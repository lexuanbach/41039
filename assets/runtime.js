/* 41039 Programming 1 — browser runtimes for Java and Python.
 *
 * Java   : CheerpJ (a real JVM in WebAssembly) + the Eclipse batch compiler
 *          (vendor/ecj.jar) to turn source into bytecode.
 * Python : Pyodide (real CPython in WebAssembly).
 *
 * Both are fetched from a CDN on first use only, so a page that never runs code
 * costs nothing. See architecture.md for the licensing note on CheerpJ.
 *
 * API:  await P1Runtime.run('java'|'python', source, stdinText, hooks, opts)
 *       hooks = { onBoot(msg), onOut(text), onErr(text) }
 *       opts  = { interactive, eof }   — see "interactive terminal" below
 *       resolves to { ok: boolean, phase: 'compile'|'run', needInput?: true }
 *
 * Interactive terminal: neither runtime can block on a prompt in the page's thread, so
 * the console uses RE-EXECUTION. With opts.interactive, a program that reads past the
 * end of stdinText stops there and the promise resolves { needInput: true }; the console
 * shows the output so far plus a live prompt, and runs again with one more line. The
 * compiled Java classes are cached per source, so a re-run skips the compiler.
 * opts.eof (Ctrl+D) turns the stop off: the program sees a real end of input.
 */
window.P1Runtime = (function () {
  'use strict';

  var CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
  var PYODIDE_LOADER = 'https://cdn.jsdelivr.net/pyodide/v314.0.6/full/pyodide.js';
  // CheerpJ's /app/ prefix maps to the WEB SERVER ROOT, not the page's directory.
  // On GitHub Pages the site lives under /41039/, so a hard-coded '/app/vendor/ecj.jar'
  // would resolve to example.github.io/vendor/ecj.jar and 404. Derive the site root from
  // this script's own URL instead, which is correct at any base path and any page depth.
  var SITE_ROOT = (function () {
    var self = document.currentScript;
    if (!self) {
      var all = document.getElementsByTagName('script');
      for (var i = all.length - 1; i >= 0; i--) {
        if (/runtime\.js(\?|$)/.test(all[i].src)) { self = all[i]; break; }
      }
    }
    if (!self || !self.src) return '/';
    // .../41039/assets/runtime.js  ->  /41039/
    return new URL(self.src).pathname.replace(/assets\/runtime\.js.*$/, '');
  })();
  var ECJ_JAR = '/app' + SITE_ROOT + 'vendor/ecj.jar';
  var ECJ_MAIN = 'org.eclipse.jdt.internal.compiler.batch.Main';

  // CheerpJ prints these to the console itself; they are not program output.
  var CHEERPJ_NOISE = [
    'CheerpJ runtime ready',
    'Class is loaded, main is starting'
  ];

  var cheerpjReady = null;
  var pyodideReady = null;
  var runSeq = 0;
  var queue = Promise.resolve();   // console patching is global — one run at a time

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
  }

  // ───────────── console capture (CheerpJ writes System.out to console.log) ─────────────
  var sink = null;
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var original = console[level].bind(console);
    console[level] = function () {
      var args = Array.prototype.slice.call(arguments);
      if (sink) {
        var text = args.map(function (a) { return typeof a === 'string' ? a : String(a); }).join(' ');
        if (CHEERPJ_NOISE.indexOf(text.trim()) === -1) {
          sink(text, level === 'error' || level === 'warn');
        }
      }
      original.apply(console, args);
    };
  });

  function captureDuring(fn, onText) {
    sink = onText;
    return Promise.resolve()
      .then(fn)
      .then(function (v) { sink = null; return v; },
            function (e) { sink = null; throw e; });
  }

  // ───────────── Java ─────────────
  function ensureCheerpJ(onBoot) {
    if (!cheerpjReady) {
      if (onBoot) onBoot('Downloading the Java runtime (CheerpJ). First run only \u2014 this takes a moment.');
      cheerpjReady = loadScript(CHEERPJ_LOADER).then(function () {
        // NOTE: do not pass { enableDebug: true } here. It does NOT restore line
        // numbers in stack traces, and it floods stdout with CheerpJ's internal VM
        // diagnostics (ClassNotFoundException handlers, thread termination notices)
        // which then appear in the student's output pane.
        return cheerpjInit();
      });
    }
    return cheerpjReady;
  }

  // The class we must run is the public class, so its name has to match the file
  // name — exactly the rule taught in Week 1.
  function javaClassName(src) {
    var stripped = src
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\/[^\n]*/g, ' ')
      .replace(/"(?:\\.|[^"\\])*"/g, '""');
    var m = /\bpublic\s+(?:final\s+|abstract\s+)?(?:class|interface|enum|record)\s+([A-Za-z_$][\w$]*)/.exec(stripped);
    if (m) return m[1];
    m = /\b(?:class|interface|enum|record)\s+([A-Za-z_$][\w$]*)/.exec(stripped);
    return m ? m[1] : null;
  }

  function cleanJavacPaths(text) {
    return text.replace(/\/str\/run\d+\//g, '').replace(/\/str\//g, '');
  }

  function cleanJavaTrace(text) {
    return cleanJavacPaths(text)
      .replace(/^.*\bat P1Launcher\.main\(.*\)\s*$\n?/gm, '')
      .replace(/Exception in thread "Thread-\d+"/g, 'Exception in thread "main"');
  }

  /* System.in for every Java run. At the end of the supplied text it either reports a real
     end of input, or — when /str/p1mode.txt says "1" — prints NEED_MARK and unwinds the
     program with an Error (Scanner and BufferedReader only catch IOException). */
  var NEED_MARK = '\u0001P1-NEED-INPUT\u0001';
  function launcherSource(cls) {
    return 'import java.io.*;\n' +
      'public class P1Launcher {\n' +
      '    static class NeedInput extends Error { NeedInput() { super("waiting for input"); } }\n' +
      '    public static void main(String[] a) throws Exception {\n' +
      '        final InputStream f = new FileInputStream("/str/stdin.txt");\n' +
      '        InputStream m = new FileInputStream("/str/p1mode.txt");\n' +
      '        final boolean wait = m.read() == 49;\n' +
      '        m.close();\n' +
      '        System.setIn(new InputStream() {\n' +
      '            private int end(int n) {\n' +
      '                if (n >= 0 || !wait) return n;\n' +
      '                System.out.flush();\n' +
      '                System.out.print("\\u0001P1-NEED-INPUT\\u0001");\n' +
      '                System.out.flush();\n' +
      '                throw new NeedInput();\n' +
      '            }\n' +
      '            public int read() throws IOException { return end(f.read()); }\n' +
      '            public int read(byte[] b, int o, int n) throws IOException { return n == 0 ? 0 : end(f.read(b, o, n)); }\n' +
      '            public int available() throws IOException { return f.available(); }\n' +
      '        });\n' +
      '        try { ' + cls + '.main(new String[0]); } catch (NeedInput e) { }\n' +
      '    }\n' +
      '}\n';
  }
  var javaCache = { src: null, cls: null, outDir: null };   // last successful compile

  function runJava(src, stdin, hooks, opts) {
    var onBoot = hooks.onBoot || function () {};
    var onOut = hooks.onOut || function () {};
    var onErr = hooks.onErr || function () {};

    return ensureCheerpJ(onBoot).then(function () {
      onBoot(null);

      var cls = javaClassName(src);
      if (!cls) {
        onErr('Could not find a class declaration. Java code needs a class, for example:\n\n' +
              'public class Hello {\n    public static void main(String[] args) {\n        ...\n    }\n}\n');
        return { ok: false, phase: 'compile' };
      }

      cheerpOSAddStringFile('/str/stdin.txt', stdin || '');
      cheerpOSAddStringFile('/str/p1mode.txt', opts.interactive && !opts.eof ? '1' : '0');

      var needInput = false, sawException = false;
      function execute(outDir) {
        return captureDuring(function () {
          return cheerpjRunMain('P1Launcher', outDir);
        }, function (text, isErr) {
          if (needInput) return;                       // the unwinding after the mark is not program output
          var at = text.indexOf(NEED_MARK);
          if (at >= 0) { needInput = true; text = text.slice(0, at); if (!text) return; }
          if (/Exception in thread|\bError\b.*\n\tat /.test(text)) sawException = true;
          if (sawException || isErr) onErr(cleanJavaTrace(text));
          else onOut(text);
        }).then(function () {
          return needInput ? { ok: true, phase: 'run', needInput: true } : { ok: !sawException, phase: 'run' };
        });
      }
      if (javaCache.src === src) return execute(javaCache.outDir);   // same program: skip the compiler

      var id = ++runSeq;
      // /str/ is flat — cheerpOSAddStringFile does not create directories — and the
      // file name must match the public class name anyway. Only the output
      // directory needs to be unique, so stale classes never get picked up.
      var outDir = '/files/out' + id;

      cheerpOSAddStringFile('/str/' + cls + '.java', src);
      cheerpOSAddStringFile('/str/P1Launcher.java', launcherSource(cls));

      var compileText = '';
      return captureDuring(function () {
        // -g keeps line numbers, so a stack trace names the line that threw.
        return cheerpjRunMain(ECJ_MAIN, ECJ_JAR, '-1.8', '-g', '-nowarn',
          '-d', outDir, '/str/' + cls + '.java', '/str/P1Launcher.java');
      }, function (text) { compileText += text; })
      .then(function (exit) {
        if (exit !== 0) {
          onErr(cleanJavacPaths(compileText).trim() || 'Compilation failed.');
          return { ok: false, phase: 'compile' };
        }
        javaCache = { src: src, cls: cls, outDir: outDir };
        return execute(outDir);
      });
    });
  }

  // ───────────── Python ─────────────
  function ensurePyodide(onBoot) {
    if (!pyodideReady) {
      if (onBoot) onBoot('Downloading the Python runtime (Pyodide, about 15 MB). First run only.');
      pyodideReady = loadScript(PYODIDE_LOADER).then(function () {
        return loadPyodide();
      });
    }
    return pyodideReady;
  }

  // Keep the header, the student's own frames and the final error line; drop the
  // Pyodide plumbing in between.
  function cleanTraceback(text) {
    var lines = text.replace(/\s*$/, '').split('\n');
    var keep = [];
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      if (/^\s*File "(\/lib\/python|\/lib\/pyodide)/.test(l) || /_pyodide\/_base\.py/.test(l)) {
        // drop this frame and its source/detail lines
        while (i + 1 < lines.length && /^\s+/.test(lines[i + 1]) && !/^\s*File "/.test(lines[i + 1])) i++;
        continue;
      }
      keep.push(l);
    }
    return keep.join('\n').replace(/File "<exec>"/g, 'File "main.py"');
  }

  /* sys.stdin for every Python run; the counterpart of P1Launcher above. _P1NeedInput is a
     BaseException so that a student's `except Exception:` does not swallow it. */
  var PY_PRELUDE =
    'import sys, io\n' +
    'class _P1NeedInput(BaseException): pass\n' +
    'class _P1Stdin(io.StringIO):\n' +
    '    def __init__(self, text, wait):\n' +
    '        super().__init__(text)\n' +
    '        self._wait = wait\n' +
    '    def _end(self, s):\n' +
    '        if s == "" and self._wait:\n' +
    '            sys.stdout.flush()\n' +
    '            raise _P1NeedInput()\n' +
    '        return s\n' +
    '    def readline(self, *a): return self._end(super().readline(*a))\n' +
    '    def read(self, *a): return self._end(super().read(*a))\n' +
    '    def readlines(self, *a): return self.read().splitlines(True)\n' +
    '    def __next__(self):\n' +
    '        s = self._end(super().readline())\n' +
    '        if s == "": raise StopIteration\n' +
    '        return s\n' +
    'sys.stdin = _P1Stdin(__p1_stdin__, __p1_wait__)\n';

  function runPython(src, stdin, hooks, opts) {
    var onBoot = hooks.onBoot || function () {};
    var onOut = hooks.onOut || function () {};
    var onErr = hooks.onErr || function () {};

    return ensurePyodide(onBoot).then(function (py) {
      onBoot(null);
      // Raw writes, not `batched`: a prompt such as input("Name: ") has no newline and must
      // still reach the page before the program stops to wait.
      var outDec = new TextDecoder(), errDec = new TextDecoder();
      py.setStdout({ write: function (buf) { onOut(outDec.decode(buf, { stream: true })); return buf.length; } });
      py.setStderr({ write: function (buf) { onErr(errDec.decode(buf, { stream: true })); return buf.length; } });

      py.globals.set('__p1_stdin__', stdin || '');
      py.globals.set('__p1_wait__', !!(opts.interactive && !opts.eof));
      // A fresh namespace per run: re-execution must not see the previous run's variables.
      var scope = py.globals.get('dict')();
      scope.set('__name__', '__main__');
      function done(result) {
        return py.runPythonAsync('sys.stdout.flush(); sys.stderr.flush()').then(null, function () {}).then(function () {
          scope.destroy();
          return result;
        });
      }
      return py.runPythonAsync(PY_PRELUDE).then(function () {
        return py.runPythonAsync(src, { globals: scope });
      }).then(function () {
        return done({ ok: true, phase: 'run' });
      }, function (e) {
        var msg = String(e.message || e);
        if (/_P1NeedInput/.test(msg)) return done({ ok: true, phase: 'run', needInput: true });
        // Pyodide puts the real CPython traceback in the message.
        return done({ ok: false, phase: 'run' }).then(function (r) {
          onErr(cleanTraceback(msg) + '\n');
          return r;
        });
      });
    });
  }

  function run(lang, src, stdin, hooks, opts) {
    var job = function () {
      return (lang === 'java' ? runJava : runPython)(src, stdin, hooks || {}, opts || {})
        .catch(function (e) {
          (hooks.onErr || function () {})('Could not start the ' +
            (lang === 'java' ? 'Java' : 'Python') + ' runtime.\n' + (e && e.message ? e.message : e) + '\n');
          return { ok: false, phase: 'boot' };
        });
    };
    queue = queue.then(job, job);
    return queue;
  }

  return { run: run, javaClassName: javaClassName };
})();
