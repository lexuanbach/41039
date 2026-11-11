/* 41039 Programming 1 — I/O & Exceptions Lab: the model.
 *
 * One scenario, "add up the numbers in scores.txt", generated as a Java program and a Python
 * program from five choices:
 *
 *   loop     'stop' | 'skip'                    a line that is not a number: let it propagate, or catch it in the loop
 *   handler  'specific' | 'broad' | 'none'      what main catches
 *   close    'auto' | 'manual' | 'finally'      try-with-resources / with, close() at the end, close() in finally
 *   fin      true | false                       main has `finally { print "Done" }`
 *   report   true | false                       main also writes the total to report.txt
 *
 * program(cfg, lang)          → { code, lineOf(tag) }      the program, and the line each step marks
 * simulate(cfg, file, lang)   → { steps, out, exit, report, handle }
 *     file = { exists: bool, text: string }. Each step is a full snapshot (stack, file cursor,
 *     reader state, report.txt, console), so stepping back is just showing an earlier one.
 *     lang 'both' runs the Java control flow and prints both languages' output; use it only when
 *     agree(file) is true (the two languages read every line the same way).
 * agree(file)                 → null, or { line, why } for the first line the languages disagree on
 *
 * Nothing printed here is guessed: scripts/check_io_lab.py runs every choice × every preset
 * file through ECJ + a JVM and CPython and compares stdout, the exception and report.txt with
 * what simulate() says.
 *
 * Works in the browser (window.P1IOLab) and in Node (module.exports) for that checker.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.P1IOLab = api;
})(this, function () {
  'use strict';

  var DEFAULT = { loop: 'stop', handler: 'specific', close: 'auto', fin: true, report: true };
  var CHOICES = {
    loop: ['stop', 'skip'],
    handler: ['specific', 'broad', 'none'],
    close: ['auto', 'manual', 'finally'],
    fin: [true, false],
    report: [true, false]
  };

  var PRESETS = [
    { id: 'good',    label: 'All numbers',     exists: true,  text: '12\n30\n18\n' },
    { id: 'word',    label: 'A word',          exists: true,  text: '12\nabc\n18\n' },
    { id: 'blank',   label: 'A blank line',    exists: true,  text: '12\n\n18\n' },
    { id: 'missing', label: 'Missing file',    exists: false, text: '12\n30\n18\n' },
    { id: 'empty',   label: 'Empty file',      exists: true,  text: '' },
    { id: 'spaces',  label: 'Spaces and signs', exists: true, text: ' 7 \n+5\n-3\n' },
    { id: 'under',   label: '1_000',           exists: true,  text: '1_000\n2\n' },
    { id: 'big',     label: 'Too big for int', exists: true,  text: '3000000000\n1\n' }
  ];

  var NAMES = {
    main:   { java: 'main',               python: 'main' },
    sum:    { java: 'sumScores',          python: 'sum_scores' },
    parse:  { java: 'parseScore',         python: 'parse_score' },
    report: { java: 'writeReport',        python: 'write_report' },
    libInt: { java: 'Integer.parseInt',   python: 'int' },
    libOpen:{ java: 'new FileReader',     python: 'open' }
  };
  var EXC = {
    nfe: { java: 'NumberFormatException', python: 'ValueError',        jfull: 'java.lang.NumberFormatException' },
    fnf: { java: 'FileNotFoundException', python: 'FileNotFoundError', jfull: 'java.io.FileNotFoundException' }
  };
  var CLASS = 'ScoreReport';

  // ───────────── the two programs ─────────────
  function program(cfg, lang) {
    cfg = norm(cfg);
    var lines = [];
    function add(depth, text, tag) { lines.push({ text: text ? new Array(depth + 1).join('    ') + text : '', tag: tag || null }); }
    if (lang === 'java') javaProgram(cfg, add); else pythonProgram(cfg, add);
    var at = {};
    lines.forEach(function (l, i) { if (l.tag && !at[l.tag]) at[l.tag] = i + 1; });
    return {
      code: lines.map(function (l) { return l.text; }).join('\n') + '\n',
      lineOf: function (tag) { return at[tag] || 0; },
      fileName: lang === 'java' ? CLASS + '.java' : 'main.py'
    };
  }

  function javaProgram(c, add) {
    add(0, 'import java.io.*;');
    add(0, '');
    add(0, 'public class ' + CLASS + ' {');
    add(1, 'static int parseScore(String line) {', 'parse.enter');
    add(2, 'return Integer.parseInt(line.trim());', 'parse.ret');
    add(1, '}');
    add(0, '');
    add(1, 'static int sumScores(String fileName) throws IOException {', 'sum.enter');
    add(2, 'int total = 0;', 'sum.total0');
    function loop(d) {
      if (c.loop === 'skip') add(d, 'int lineNo = 0;');
      add(d, 'String line;');
      add(d, 'while ((line = in.readLine()) != null) {', 'sum.read');
      if (c.loop === 'skip') {
        add(d + 1, 'lineNo++;');
        add(d + 1, 'try {', 'sum.try');
        add(d + 2, 'total += parseScore(line);', 'sum.add');
        add(d + 1, '} catch (NumberFormatException e) {', 'sum.catch');
        add(d + 2, 'System.out.println("Skipping line " + lineNo + ": " + e.getMessage());', 'sum.skip');
        add(d + 1, '}');
      } else {
        add(d + 1, 'total += parseScore(line);', 'sum.add');
      }
      add(d, '}');
    }
    if (c.close === 'auto') {
      add(2, 'try (BufferedReader in = new BufferedReader(new FileReader(fileName))) {', 'sum.open');
      loop(3);
      add(2, '}', 'sum.autoclose');
    } else if (c.close === 'manual') {
      add(2, 'BufferedReader in = new BufferedReader(new FileReader(fileName));', 'sum.open');
      loop(2);
      add(2, 'in.close();', 'sum.close');
    } else {
      add(2, 'BufferedReader in = new BufferedReader(new FileReader(fileName));', 'sum.open');
      add(2, 'try {', 'sum.tryf');
      loop(3);
      add(2, '} finally {', 'sum.finally');
      add(3, 'in.close();', 'sum.close');
      add(2, '}');
    }
    add(2, 'return total;', 'sum.return');
    add(1, '}');
    add(0, '');
    if (c.report) {
      add(1, 'static void writeReport(int total) throws IOException {', 'report.enter');
      add(2, 'try (PrintWriter out = new PrintWriter(new FileWriter("report.txt"))) {', 'report.open');
      add(3, 'out.println("Total: " + total);', 'report.write');
      add(2, '}', 'report.close');
      add(1, '}');
      add(0, '');
    }
    var wrap = c.handler !== 'none' || c.fin;
    add(1, 'public static void main(String[] args)' + (c.handler === 'none' ? ' throws IOException' : '') + ' {', 'main.enter');
    var d = 2;
    if (wrap) { add(2, 'try {', 'main.try'); d = 3; }
    add(d, 'int total = sumScores("scores.txt");', 'main.call_sum');
    add(d, 'System.out.println("Total: " + total);', 'main.print_total');
    if (c.report) {
      add(d, 'writeReport(total);', 'main.call_report');
      add(d, 'System.out.println("Saved report.txt");', 'main.print_saved');
    }
    if (c.handler === 'specific') {
      add(2, '} catch (FileNotFoundException e) {', 'main.catch_fnf');
      add(3, 'System.out.println("Cannot open scores.txt");', 'main.h_fnf');
      add(2, '} catch (NumberFormatException e) {', 'main.catch_nfe');
      add(3, 'System.out.println("Bad score: " + e.getMessage());', 'main.h_nfe');
      add(2, '} catch (IOException e) {', 'main.catch_io');
      add(3, 'System.out.println("Read or write failed");', 'main.h_io');
    } else if (c.handler === 'broad') {
      add(2, '} catch (Exception e) {', 'main.catch_all');
      add(3, 'System.out.println("Failed: " + e.getClass().getSimpleName());', 'main.h_all');
    }
    if (c.fin) {
      add(2, '} finally {', 'main.finally');
      add(3, 'System.out.println("Done");', 'main.done');
    }
    if (wrap) add(2, '}');
    add(1, '}', 'main.end');
    add(0, '}');
  }

  function pythonProgram(c, add) {
    add(0, 'def parse_score(line):', 'parse.enter');
    add(1, 'return int(line.strip())', 'parse.ret');
    add(0, '');
    add(0, '');
    add(0, 'def sum_scores(file_name):', 'sum.enter');
    add(1, 'total = 0', 'sum.total0');
    function loop(d) {
      if (c.loop === 'skip') {
        add(d, 'for line_no, line in enumerate(f, start=1):', 'sum.read');
        add(d + 1, 'try:', 'sum.try');
        add(d + 2, 'total += parse_score(line)', 'sum.add');
        add(d + 1, 'except ValueError as e:', 'sum.catch');
        add(d + 2, 'print(f"Skipping line {line_no}: {e}")', 'sum.skip');
      } else {
        add(d, 'for line in f:', 'sum.read');
        add(d + 1, 'total += parse_score(line)', 'sum.add');
      }
    }
    if (c.close === 'auto') {
      add(1, 'with open(file_name) as f:', 'sum.open');
      loop(2);
    } else if (c.close === 'manual') {
      add(1, 'f = open(file_name)', 'sum.open');
      loop(1);
      add(1, 'f.close()', 'sum.close');
    } else {
      add(1, 'f = open(file_name)', 'sum.open');
      add(1, 'try:', 'sum.tryf');
      loop(2);
      add(1, 'finally:', 'sum.finally');
      add(2, 'f.close()', 'sum.close');
    }
    add(1, 'return total', 'sum.return');
    add(0, '');
    add(0, '');
    if (c.report) {
      add(0, 'def write_report(total):', 'report.enter');
      add(1, 'with open("report.txt", "w") as out:', 'report.open');
      add(2, 'out.write(f"Total: {total}\\n")', 'report.write');
      add(0, '');
      add(0, '');
    }
    add(0, 'def main():', 'main.enter');
    var wrap = c.handler !== 'none' || c.fin;
    var d = 1;
    if (wrap) { add(1, 'try:', 'main.try'); d = 2; }
    add(d, 'total = sum_scores("scores.txt")', 'main.call_sum');
    add(d, 'print("Total:", total)', 'main.print_total');
    if (c.report) {
      add(d, 'write_report(total)', 'main.call_report');
      add(d, 'print("Saved report.txt")', 'main.print_saved');
    }
    if (c.handler === 'specific') {
      add(1, 'except FileNotFoundError:', 'main.catch_fnf');
      add(2, 'print("Cannot open scores.txt")', 'main.h_fnf');
      add(1, 'except ValueError as e:', 'main.catch_nfe');
      add(2, 'print("Bad score:", e)', 'main.h_nfe');
      add(1, 'except OSError:', 'main.catch_io');
      add(2, 'print("Read or write failed")', 'main.h_io');
    } else if (c.handler === 'broad') {
      add(1, 'except Exception as e:', 'main.catch_all');
      add(2, 'print("Failed:", type(e).__name__)', 'main.h_all');
    }
    if (c.fin) {
      add(1, 'finally:', 'main.finally');
      add(2, 'print("Done")', 'main.done');
    }
    add(0, '');
    add(0, '');
    add(0, 'main()', 'top.call');
  }

  // ───────────── how each language reads one line ─────────────
  // Java: line.trim() drops chars <= ' ' at both ends; Integer.parseInt takes an optional sign
  // and decimal digits, and refuses anything outside the 32-bit int range.
  // Python: line.strip() drops whitespace (the line still ends in "\n" when for reads it);
  // int() also takes underscores between digits, and has no upper limit.
  var INT_MIN = -2147483648, INT_MAX = 2147483647;
  function javaTrim(s) { return s.replace(/^[\x00-\x20]+/, '').replace(/[\x00-\x20]+$/, ''); }
  function pyStrip(s) { return s.replace(/^[\s\x1c-\x1f\x85]+/, '').replace(/[\s\x1c-\x1f\x85]+$/, '').replace(/^﻿|﻿$/g, ''); }
  function parseLine(raw, lang) {
    if (lang === 'java') {
      var t = javaTrim(raw);
      if (/^[+-]?[0-9]+$/.test(t)) {
        var n = Number(t.replace(/^\+/, ''));
        if (n >= INT_MIN && n <= INT_MAX && /^[+-]?0*[0-9]{1,10}$/.test(t)) return { ok: true, v: n, arg: t };
      }
      return { ok: false, arg: t, msg: 'For input string: "' + t + '"' };
    }
    var p = pyStrip(raw);
    if (/^[+-]?[0-9]+(?:_[0-9]+)*$/.test(p)) {
      return { ok: true, v: bigOf(p.replace(/_/g, '')), arg: p };
    }
    return { ok: false, arg: p, msg: 'invalid literal for int() with base 10: ' + pyRepr(p) };
  }
  function bigOf(s) {
    var neg = s[0] === '-';
    s = s.replace(/^[+-]/, '').replace(/^0+(?=\d)/, '');
    return (neg && s !== '0' ? '-' : '') + s;
  }
  // a decimal string sum, so Python's unlimited ints add up exactly
  function addBig(a, b) {
    if (typeof BigInt === 'function') return String(BigInt(a) + BigInt(b));
    return String(Number(a) + Number(b));
  }
  function addJava(a, b) { return (a + b) | 0; }   // int arithmetic wraps around
  function pyRepr(s) {
    var q = s.indexOf("'") !== -1 && s.indexOf('"') === -1 ? '"' : "'";
    var body = s.replace(/[\\\x00-\x1f\x7f]|['"]/g, function (ch) {
      if (ch === '\\') return '\\\\';
      if (ch === q) return '\\' + q;
      if (ch === '"' || ch === "'") return ch;
      if (ch === '\n') return '\\n';
      if (ch === '\t') return '\\t';
      if (ch === '\r') return '\\r';
      var h = ch.charCodeAt(0).toString(16);
      return '\\x' + (h.length < 2 ? '0' : '') + h;
    });
    return q + body + q;
  }
  function javaStr(s) { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\t/g, '\\t') + '"'; }

  function fileLines(text) {
    if (!text) return [];
    var parts = text.split('\n');
    if (parts[parts.length - 1] === '') parts.pop();
    return parts;
  }

  /* null when Java and Python read every line of the file the same way (same verdict, same
     value, and no int overflow in the running total), else the first line where they part. */
  function agree(file) {
    if (!file.exists) return null;
    var lines = fileLines(file.text), jt = 0, pt = '0';
    for (var i = 0; i < lines.length; i++) {
      var j = parseLine(lines[i], 'java'), p = parseLine(lines[i], 'python');
      if (j.ok !== p.ok || (j.ok && String(j.v) !== p.v)) {
        return { line: i + 1, why: j.ok ? 'Python refuses ' + pyRepr(p.arg) + ', Java reads it as ' + j.v
                                       : 'Java refuses ' + javaStr(j.arg) + (p.ok ? ', Python reads it as ' + p.v : '') };
      }
      if (j.ok) {
        pt = addBig(pt, p.v);
        jt = addJava(jt, j.v);
        if (String(jt) !== pt) return { line: i + 1, why: 'the running total ' + pt + ' no longer fits in a Java int' };
      }
    }
    return null;
  }

  function norm(cfg) {
    var c = {};
    Object.keys(DEFAULT).forEach(function (k) {
      var v = cfg && cfg[k];
      c[k] = CHOICES[k].indexOf(v) !== -1 ? v : DEFAULT[k];
    });
    return c;
  }

  // ───────────── the simulation ─────────────
  function simulate(cfg, file, lang) {
    cfg = norm(cfg);
    var flow = lang === 'python' ? 'python' : 'java';
    var both = lang === 'both';
    var progs = { java: program(cfg, 'java'), python: program(cfg, 'python') };
    var lines = fileLines(file.exists ? file.text : '');
    var langs = both ? ['java', 'python'] : [flow];

    // helpers for captions: names and phrases in the language(s) on screen
    function nm(key) {
      if (both && NAMES[key].java !== NAMES[key].python) return '<code>' + esc(NAMES[key].java) + '</code> / <code>' + esc(NAMES[key].python) + '</code>';
      return '<code>' + esc(NAMES[key][flow]) + '</code>';
    }
    function ex(key) {
      if (both) return '<code>' + EXC[key].java + '</code> / <code>' + EXC[key].python + '</code>';
      return '<code>' + EXC[key][flow] + '</code>';
    }
    function L(j, p) { return both ? j + ' / ' + p : (flow === 'java' ? j : p); }

    var st = {
      stack: [],                  // newest last: { key, vars: [{n, v:{java,python}}], tone, lib, exc }
      cursor: -1, eof: false,
      verdict: lines.map(function () { return null; }),     // {kind:'ok'|'bad'|'skip', text}
      handle: file.exists ? 'closed-none' : 'missing',        // 'closed-none' 'open' 'closed' 'missing'
      report: { state: cfg.report ? 'none' : 'off', buffer: '', text: '' },
      out: { java: [], python: [] },
      exc: null,
      status: 'run'
    };
    var steps = [];
    var total = { java: 0, python: '0' };

    function clone(o) { return JSON.parse(JSON.stringify(o)); }
    function snap(tag, say, extra) {
      var s = clone(st);
      s.tag = typeof tag === 'string' ? { java: tag, python: tag } : tag;
      s.line = { java: progs.java.lineOf(s.tag.java), python: progs.python.lineOf(s.tag.python) };
      s.say = say;
      s.mark = (extra && extra.mark) || 'now';
      s.fly = (extra && extra.fly) || null;
      steps.push(s);
    }
    function top() { return st.stack[st.stack.length - 1]; }
    function frame(key, lib) { return { key: key, vars: [], tone: '', lib: !!lib, exc: null }; }
    function setVar(f, n, v) {
      var nameObj = typeof n === 'string' ? { java: n, python: n } : n;
      var valObj = typeof v === 'object' ? v : { java: String(v), python: String(v) };
      for (var i = 0; i < f.vars.length; i++) if (f.vars[i].n.java === nameObj.java) { f.vars[i].v = valObj; return; }
      f.vars.push({ n: nameObj, v: valObj });
    }
    function print(texts, err) {
      langs.forEach(function (l) {
        var t = typeof texts === 'string' ? texts : texts[l];
        t.split('\n').forEach(function (row) { st.out[l].push({ t: row, err: !!err }); });
      });
    }
    function tones(t) { st.stack.forEach(function (f) { f.tone = ''; }); if (t && top()) top().tone = t; }
    function totalVar() { return { java: String(total.java), python: total.python }; }

    var excKey = null, excMsg = { java: '', python: '' }, trace = { java: [], python: [] };
    function raise(key, msgs, libKey, at) {
      excKey = key; excMsg = msgs;
      st.exc = { key: key, java: EXC[key].java, python: EXC[key].python, msg: msgs };
      var lib = frame(libKey, true);
      lib.tone = 'throw';
      lib.exc = st.exc;
      st.stack.forEach(function (f) { f.tone = ''; f.exc = null; });
      st.stack.push(lib);
      // trace frames, innermost first: the user frame and line each language reports
      trace = { java: [], python: [] };
      at.forEach(function (a) { trace.java.push(a); trace.python.push(a); });
    }
    function carry(tone) {          // the exception now sits on the top frame
      st.stack.forEach(function (f) { f.exc = null; f.tone = ''; });
      if (top()) { top().exc = st.exc; top().tone = tone; }
    }

    // ── main ──
    var main = frame('main');
    st.stack.push(main);
    var hasTry = cfg.handler !== 'none' || cfg.fin;
    snap({ java: 'main.enter', python: 'top.call' },
      both ? 'The program starts in <code>main</code>. (Java calls it for you; the Python file calls <code>main()</code> on its last line.)'
           : flow === 'java' ? 'The JVM starts the program by calling <code>main</code>.'
                             : 'Python runs the file from the top: it stores each function, then the last line calls <code>main()</code>.');
    if (hasTry) {
      snap('main.try', cfg.handler === 'none'
        ? 'Enter the <code>try</code>. There is no <code>' + L('catch', 'except') + '</code> under it, only a <code>finally</code>.'
        : 'Enter the <code>try</code> block. If anything inside it throws, ' + L('Java', 'Python') + ' checks the <code>' + L('catch', 'except') + '</code> clauses below it, top to bottom.');
    }
    snap('main.call_sum', 'Call ' + nm('sum') + ' with the file name. A new frame goes on top of the call stack.');
    var sum = frame('sum');
    st.stack.push(sum);
    setVar(sum, 'total', 0);
    snap('sum.total0', '<code>total</code> starts at 0.');

    var thrownAt = null;   // where an exception left sumScores: 'open' | 'add'
    function unwindSum(where) {
      // sumScores has no handler for this exception: it ends early. What happens to the file?
      thrownAt = where;
      carry('unwind');
      if (where === 'open') {
        snap('sum.open', nm('sum') + ' has no ' + L('<code>catch</code>', '<code>except</code>') + ' for ' + ex(excKey) +
          ', so it ends here. The file never opened, so there is nothing to close.', { mark: 'bad' });
      } else if (cfg.close === 'auto') {
        st.handle = 'closed';
        snap({ java: 'sum.autoclose', python: 'sum.open' }, 'No ' + L('<code>catch</code>', '<code>except</code>') + ' in ' + nm('sum') + ', so it ends early. On the way out, ' +
          L('try-with-resources', 'the <code>with</code> block') + ' still closes the file.', { mark: 'bad' });
      } else if (cfg.close === 'finally') {
        st.handle = 'closed';
        snap('sum.close', 'No ' + L('<code>catch</code>', '<code>except</code>') + ' in ' + nm('sum') + '. Before it ends, its <code>finally</code> runs and closes the file.', { mark: 'bad' });
      } else {
        snap('sum.add', 'No ' + L('<code>catch</code>', '<code>except</code>') + ' in ' + nm('sum') + ', so it ends right here. The ' +
          L('<code>in.close()</code>', '<code>f.close()</code>') + ' line is never reached: <strong>the file is left open</strong>.', { mark: 'bad' });
      }
      st.stack.pop();
      carry('unwind');
    }

    if (!file.exists) {
      var fnfMsg = { java: 'scores.txt (No such file or directory)', python: "[Errno 2] No such file or directory: 'scores.txt'" };
      raise('fnf', fnfMsg, 'libOpen', ['sum.open', 'main.call_sum']);
      snap('sum.open', 'There is no <code>scores.txt</code>. ' + L('<code>new FileReader(fileName)</code>', '<code>open(file_name)</code>') +
        ' throws ' + ex('fnf') + '.', { mark: 'bad' });
      st.stack.pop();
      unwindSum('open');
    } else {
      st.handle = 'open';
      snap('sum.open', 'The file opens. ' + L('The reader', 'The file object <code>f</code>') + ' is positioned before the first line.');
      if (cfg.close === 'finally') snap('sum.tryf', 'Enter the <code>try</code> whose <code>finally</code> will close the file.');
      var i;
      for (i = 0; i < lines.length; i++) {
        st.cursor = i;
        var raw = lines[i];
        setVar(sum, 'line', { java: javaStr(raw), python: pyRepr(raw + '\n') });
        if (cfg.loop === 'skip') setVar(sum, { java: 'lineNo', python: 'line_no' }, i + 1);
        snap('sum.read', both
          ? '<code>readLine()</code> / <code>for</code> hands over line ' + (i + 1) + '. Java drops the line break; Python keeps it as <code>\\n</code>.'
          : flow === 'java' ? '<code>readLine()</code> returns line ' + (i + 1) + ', ' + esc(javaStr(raw)) + ', without its line break.'
                            : 'The <code>for</code> loop takes line ' + (i + 1) + ', ' + esc(pyRepr(raw + '\n')) + '. The line break is still on the end.',
          { fly: { from: 'file-' + i, to: 'var-sum-line' } });
        if (cfg.loop === 'skip') snap('sum.try', i === 0 ? 'Enter the <code>try</code> inside the loop: a bad line will be caught here, not in ' + nm('main') + '.'
                                                          : 'Enter the <code>try</code> again, for this line.');
        var parse = frame('parse');
        setVar(parse, 'line', { java: javaStr(raw), python: pyRepr(raw + '\n') });
        st.stack.push(parse);
        var r = parseLine(raw, flow);
        var rOther = both ? parseLine(raw, 'python') : r;
        if (r.ok) {
          snap('parse.ret', nm('parse') + ' converts ' + esc(flow === 'java' ? javaStr(r.arg) : pyRepr(r.arg)) + ' and returns <strong>' + r.v + '</strong>.');
          st.stack.pop();
          total.java = addJava(total.java, Number(r.v));
          total.python = addBig(total.python, both ? rOther.v : r.v);
          setVar(sum, 'total', totalVar());
          st.verdict[i] = { kind: 'ok', text: '+' + r.v };
          snap('sum.add', '<code>total</code> is now <strong>' + (flow === 'java' ? total.java : total.python) + '</strong>.', { mark: 'ok', fly: { from: 'frame-parse', to: 'var-sum-total' } });
          continue;
        }
        // the line is not a number
        var msgs = { java: parseLine(raw, 'java').msg, python: parseLine(raw, 'python').msg };
        raise('nfe', msgs, 'libInt', ['parse.ret', 'sum.add', 'main.call_sum']);
        snap('parse.ret', esc(flow === 'java' ? 'Integer.parseInt(' + javaStr(r.arg) + ')' : 'int(' + pyRepr(r.arg) + ')') +
          ' cannot make a number from that, so it <strong>throws</strong> ' + ex('nfe') + '.', { mark: 'bad' });
        st.stack.pop();                       // the library frame
        carry('unwind');
        snap('parse.ret', nm('parse') + ' has no handler, so it ends at once and passes the exception to the line that called it.', { mark: 'bad', fly: { from: 'exc', to: 'exc' } });
        st.stack.pop();                       // parseScore
        if (cfg.loop === 'skip') {
          carry('catch');
          st.verdict[i] = { kind: 'skip', text: 'skipped' };
          snap('sum.catch', 'The ' + L('<code>catch (NumberFormatException e)</code>', '<code>except ValueError as e</code>') + ' in the loop matches. The exception is handled here.', { mark: 'ok', fly: { from: 'exc', to: 'exc' } });
          st.exc = null; excKey = null; carry('');
          print({ java: 'Skipping line ' + (i + 1) + ': ' + msgs.java, python: 'Skipping line ' + (i + 1) + ': ' + msgs.python });
          snap('sum.skip', 'Print which line was skipped and why, then carry on with the next line. <code>total</code> is unchanged.', { fly: { from: 'frame-sum', to: 'out-last' } });
          continue;
        }
        st.verdict[i] = { kind: 'bad', text: EXC.nfe[flow] };
        unwindSum('add');
        break;
      }
      if (!excKey) {
        st.cursor = lines.length; st.eof = true;
        // Java's readLine() hands back null; Python's loop variable keeps the last line (or never existed)
        var lastPy = lines.length ? pyRepr(lines[lines.length - 1] + '\n') : null;
        if (flow === 'java' || both) setVar(sum, 'line', { java: 'null', python: lastPy === null ? '(never set)' : lastPy });
        snap('sum.read', both ? 'End of file: <code>readLine()</code> returns <code>null</code> / the <code>for</code> loop runs out of lines. The loop ends.'
                              : flow === 'java' ? 'End of file: <code>readLine()</code> returns <code>null</code>, so the <code>while</code> loop ends.'
                                                : 'End of file: there are no more lines, so the <code>for</code> loop ends.');
        if (cfg.close === 'auto') {
          st.handle = 'closed';
          snap({ java: 'sum.autoclose', python: 'sum.open' }, 'Leaving ' + L('the try-with-resources block', 'the <code>with</code> block') + ' closes the file automatically.');
        } else if (cfg.close === 'finally') {
          snap('sum.finally', 'The <code>try</code> finished normally. Its <code>finally</code> runs anyway.');
          st.handle = 'closed';
          snap('sum.close', 'Close the file.');
        } else {
          st.handle = 'closed';
          snap('sum.close', L('<code>in.close()</code>', '<code>f.close()</code>') + ' closes the file. (It is only reached because nothing went wrong.)');
        }
        snap('sum.return', nm('sum') + ' returns <strong>' + (flow === 'java' ? total.java : total.python) + '</strong>.');
        st.stack.pop();
        setVar(main, 'total', totalVar());
        tones('');
        snap('main.call_sum', 'Back in ' + nm('main') + ': <code>total</code> is ' + (flow === 'java' ? total.java : total.python) + '. The ' + nm('sum') + ' frame is gone.', { fly: { from: 'frame-sum', to: 'var-main-total' } });
        print({ java: 'Total: ' + total.java, python: 'Total: ' + total.python });
        snap('main.print_total', 'Print the total to the console.', { fly: { from: 'frame-main', to: 'out-last' } });
        if (cfg.report) {
          snap('main.call_report', 'Call ' + nm('report') + ' to save the total in a second file.');
          var rep = frame('report');
          setVar(rep, 'total', totalVar());
          st.stack.push(rep);
          st.report.state = 'open';
          snap('report.open', 'Opening <code>report.txt</code> for writing creates it (or empties it, if it was already there).');
          st.report.buffer = 'Total: ' + (flow === 'java' ? total.java : total.python);
          st.report.state = 'buffered';
          snap('report.write', L('<code>println</code>', '<code>write</code>') + ' puts the line in a <strong>buffer</strong> in memory. It is not in the file yet.', { fly: { from: 'frame-report', to: 'report-buf' } });
          st.report.state = 'saved';
          st.report.text = st.report.buffer + '\n';
          st.report.buffer = '';
          snap({ java: 'report.close', python: 'report.open' }, 'Leaving ' + L('try-with-resources', 'the <code>with</code> block') + ' closes the writer, which <strong>flushes</strong> the buffer: now the line is in <code>report.txt</code>.');
          st.stack.pop();
          print('Saved report.txt');
          snap('main.print_saved', 'Back in ' + nm('main') + '. Print a confirmation.', { fly: { from: 'frame-main', to: 'out-last' } });
        }
      }
    }

    // ── back in main, with or without an exception ──
    if (excKey) {
      carry('unwind');
      if (cfg.handler === 'none') {
        snap('main.call_sum', 'The exception arrives in ' + nm('main') + ', at the line that called ' + nm('sum') + '. ' +
          (cfg.fin ? 'There is no <code>' + L('catch', 'except') + '</code> here either.' : 'There is no <code>try</code> here at all.'), { mark: 'bad', fly: { from: 'exc', to: 'exc' } });
      } else {
        snap('main.call_sum', 'The exception arrives in ' + nm('main') + ', at the line that called ' + nm('sum') + '. The rest of the <code>try</code> block is skipped.', { mark: 'bad', fly: { from: 'exc', to: 'exc' } });
        var tag, handled;
        if (cfg.handler === 'broad') {
          tag = 'main.catch_all';
          handled = ex(excKey) + ' is a kind of <code>Exception</code>, so ' + L('<code>catch (Exception e)</code>', '<code>except Exception</code>') + ' matches.';
        } else if (excKey === 'fnf') {
          tag = 'main.catch_fnf';
          handled = 'The first clause, ' + L('<code>catch (FileNotFoundException e)</code>', '<code>except FileNotFoundError</code>') + ', matches.';
        } else {
          tag = 'main.catch_nfe';
          handled = 'Check the clauses in order: ' + L('<code>FileNotFoundException</code>', '<code>FileNotFoundError</code>') + '? No. ' + ex('nfe') + '? <strong>Yes</strong>.';
        }
        carry('catch');
        snap(tag, handled + ' The exception is handled.', { mark: 'ok' });
        st.exc = null; carry('');
        if (cfg.handler === 'broad') {
          print({ java: 'Failed: ' + EXC[excKey].java, python: 'Failed: ' + EXC[excKey].python });
          snap('main.h_all', 'Print the exception\'s class name: ' + ex(excKey) + '.', { fly: { from: 'frame-main', to: 'out-last' } });
        } else if (excKey === 'fnf') {
          print('Cannot open scores.txt');
          snap('main.h_fnf', 'Print a message a person can act on.', { fly: { from: 'frame-main', to: 'out-last' } });
        } else {
          print({ java: 'Bad score: ' + excMsg.java, python: 'Bad score: ' + excMsg.python });
          snap('main.h_nfe', 'Print the exception\'s message. ' + (both ? 'Java and Python word it differently.' : ''), { fly: { from: 'frame-main', to: 'out-last' } });
        }
        excKey = null;
      }
    }
    if (cfg.fin) {
      if (excKey) carry('unwind'); else tones('');
      print('Done');
      snap('main.done', '<code>finally</code> runs whatever happened' + (excKey ? ' — even now, with an exception still on its way out.' : '.'),
        { fly: { from: 'frame-main', to: 'out-last' } });
    }
    var leaked = st.handle === 'open', crashKey = null;
    if (excKey) {
      // nothing caught it: the runtime prints a stack trace and the program stops with exit code 1
      var lineJ = function (tag) { return progs.java.lineOf(tag); };
      var lineP = function (tag) { return progs.python.lineOf(tag); };
      var fnOf = { 'parse.ret': 'parse', 'sum.add': 'sum', 'sum.open': 'sum', 'main.call_sum': 'main' };
      var jt = ['Exception in thread "main" ' + EXC[excKey].jfull + ': ' + excMsg.java];
      trace.java.forEach(function (t) { jt.push('\tat ' + CLASS + '.' + NAMES[fnOf[t]].java + '(' + CLASS + '.java:' + lineJ(t) + ')'); });
      var pt = ['Traceback (most recent call last):',
                '  File "main.py", line ' + lineP('top.call') + ', in <module>', '    main()'];
      trace.python.slice().reverse().forEach(function (t) {
        var src = progs.python.code.split('\n')[lineP(t) - 1].trim();
        pt.push('  File "main.py", line ' + lineP(t) + ', in ' + NAMES[fnOf[t]].python);
        pt.push('    ' + src);
      });
      pt.push(EXC[excKey].python + ': ' + excMsg.python);
      st.stack = [];
      st.exc = null;
      st.status = 'crash';
      langs.forEach(function (l) {
        var t = l === 'java' ? jt : pt;
        // library frames are left out of the model's trace; mark where they would be
        t.forEach(function (row, k) {
          if (l === 'java' && k === 1) st.out.java.push({ t: '\t⋯ (frames inside Java\'s own library)', err: true, note: true });
          st.out[l].push({ t: row, err: true });
        });
      });
      crashKey = excKey;
      if (leaked) st.handle = 'leaked';
      snap({ java: 'main.end', python: 'top.call' }, 'Nothing caught ' + ex(excKey) + '. The program <strong>stops</strong>: ' +
        L('the JVM', 'Python') + ' prints a stack trace to the error stream and exits with code 1.' +
        (leaked ? ' The file was never closed by the program.' : ''), { mark: 'bad' });
    } else {
      st.stack = [];
      st.status = 'ok';
      if (leaked) st.handle = 'leaked';
      snap({ java: 'main.end', python: 'top.call' }, nm('main') + ' returns and the program ends normally (exit code 0).' +
        (leaked ? ' But the file was never closed by the program.' : ''));
    }

    // the plain output, for the checker and for "Run it for real"
    function plain(l, err) {
      return st.out[l].filter(function (o) { return !!o.err === err && !o.note; }).map(function (o) { return o.t + '\n'; }).join('');
    }
    var res = { steps: steps, exit: st.status === 'crash' ? 1 : 0, report: st.report.state === 'saved' ? st.report.text : null, handle: st.handle, out: {} };
    (both ? ['java', 'python'] : [flow]).forEach(function (l) { res.out[l] = { stdout: plain(l, false), stderr: plain(l, true), exception: crashKey ? EXC[crashKey][l] : null }; });
    return res;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // ───────────── a helper program for "Run it for real": prepares and reads back the files ─────────────
  var HELPER = {
    java: [
      'import java.io.*;',
      '',
      'public class LabFiles {',
      '    public static void main(String[] args) throws IOException {',
      '        BufferedReader in = new BufferedReader(new InputStreamReader(System.in, "UTF-8"));',
      '        String mode = in.readLine();',
      '        if ("setup".equals(mode)) {',
      '            new File("report.txt").delete();',
      '            new File("scores.txt").delete();',
      '            if ("1".equals(in.readLine())) {',
      '                StringBuilder text = new StringBuilder();',
      '                int c;',
      '                while ((c = in.read()) != -1) text.append((char) c);',
      '                try (Writer out = new FileWriter("scores.txt")) { out.write(text.toString()); }',
      '            }',
      '        } else {',
      '            File f = new File("report.txt");',
      '            if (!f.exists()) { System.out.print("\\u0000missing"); return; }',
      '            try (Reader r = new FileReader(f)) {',
      '                StringBuilder text = new StringBuilder();',
      '                int c;',
      '                while ((c = r.read()) != -1) text.append((char) c);',
      '                System.out.print(text);',
      '            }',
      '        }',
      '    }',
      '}',
      ''
    ].join('\n'),
    python: [
      'import os, sys',
      'mode = sys.stdin.readline().strip()',
      'if mode == "setup":',
      '    for name in ("scores.txt", "report.txt"):',
      '        if os.path.exists(name):',
      '            os.remove(name)',
      '    if sys.stdin.readline().strip() == "1":',
      '        with open("scores.txt", "w") as f:',
      '            f.write(sys.stdin.read())',
      'elif os.path.exists("report.txt"):',
      '    with open("report.txt") as f:',
      '        sys.stdout.write(f.read())',
      'else:',
      '    sys.stdout.write("\\x00missing")',
      ''
    ].join('\n')
  };
  function setupInput(file) { return 'setup\n' + (file.exists ? '1' : '0') + '\n' + (file.exists ? file.text : ''); }

  return {
    DEFAULT: DEFAULT, CHOICES: CHOICES, PRESETS: PRESETS, NAMES: NAMES, EXC: EXC,
    program: program, simulate: simulate, agree: agree, fileLines: fileLines,
    parseLine: parseLine, pyRepr: pyRepr, javaStr: javaStr, norm: norm,
    HELPER: HELPER, setupInput: setupInput
  };
});
