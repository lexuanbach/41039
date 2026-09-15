/* 41039 Programming 1 — browser runtimes for Java and Python.
 *
 * Java   : CheerpJ (a real JVM in WebAssembly) + the Eclipse batch compiler
 *          (vendor/ecj.jar) to turn source into bytecode.
 * Python : Pyodide (real CPython in WebAssembly).
 *
 * Both are fetched from a CDN on first use only, so a page that never runs code
 * costs nothing. See architecture.md for the licensing note on CheerpJ.
 *
 * API:  await P1Runtime.run('java'|'python', source, stdinText, hooks)
 *       hooks = { onBoot(msg), onOut(text), onErr(text) }
 *       resolves to { ok: boolean, phase: 'compile'|'run' }
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

  function runJava(src, stdin, hooks) {
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

      var id = ++runSeq;
      // /str/ is flat — cheerpOSAddStringFile does not create directories — and the
      // file name must match the public class name anyway. Only the output
      // directory needs to be unique, so stale classes never get picked up.
      var outDir = '/files/out' + id;

      cheerpOSAddStringFile('/str/' + cls + '.java', src);
      cheerpOSAddStringFile('/str/stdin.txt', stdin || '');
      // A generated launcher so System.in comes from the stdin box. CheerpJ has
      // no stdin option, and this needs no change to the student's own code.
      cheerpOSAddStringFile('/str/P1Launcher.java',
        'import java.io.*;\n' +
        'public class P1Launcher {\n' +
        '    public static void main(String[] a) throws Exception {\n' +
        '        System.setIn(new FileInputStream("/str/stdin.txt"));\n' +
        '        ' + cls + '.main(new String[0]);\n' +
        '    }\n' +
        '}\n');

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
        var sawException = false;
        return captureDuring(function () {
          return cheerpjRunMain('P1Launcher', outDir);
        }, function (text, isErr) {
          if (/Exception in thread|\bError\b.*\n\tat /.test(text)) sawException = true;
          if (sawException || isErr) onErr(cleanJavaTrace(text));
          else onOut(text);
        }).then(function () {
          return { ok: !sawException, phase: 'run' };
        });
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

  function runPython(src, stdin, hooks) {
    var onBoot = hooks.onBoot || function () {};
    var onOut = hooks.onOut || function () {};
    var onErr = hooks.onErr || function () {};

    return ensurePyodide(onBoot).then(function (py) {
      onBoot(null);
      py.setStdout({ batched: function (s) { onOut(s + '\n'); } });
      py.setStderr({ batched: function (s) { onErr(s + '\n'); } });

      // input() reads sys.stdin when it is not a terminal, so handing it a
      // StringIO is enough and avoids depending on the stdin-callback API.
      py.globals.set('__p1_stdin__', stdin || '');
      return py.runPythonAsync(
        'import sys, io\n' +
        'sys.stdin = io.StringIO(__p1_stdin__)\n'
      ).then(function () {
        return py.runPythonAsync(src);
      }).then(function () {
        return { ok: true, phase: 'run' };
      }, function (e) {
        // Pyodide puts the real CPython traceback in the message.
        onErr(cleanTraceback(String(e.message || e)) + '\n');
        return { ok: false, phase: 'run' };
      });
    });
  }

  function run(lang, src, stdin, hooks) {
    var job = function () {
      return (lang === 'java' ? runJava : runPython)(src, stdin, hooks || {})
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
