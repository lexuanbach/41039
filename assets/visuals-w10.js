/* 41039 Programming 1 — Week 10 diagram kinds (writing files and reliable reports).
 *
 *   w10-trace   step through a program and watch its destinations change: an in-memory buffer,
 *               a file on disk, small state chips, split fields and the real console output.
 *               Optional axes (segmented pickers) choose between variants of the program, and a
 *               step may ask the reader to predict before the output appears.
 *   w10-lines   print / println / write sandbox: build two complete records, watch the reader's view
 *   w10-modes   three opens, each "w" or "a" (Java: FileWriter(…, false|true)); predict, then step
 *   w10-format  width / alignment / decimals for a report meant for people
 *   w10-split   split at every comma vs csv.writer / csv.reader, on preset or typed names
 *
 * Every program shown is listed in spec.programs and run by scripts/check_week_content.py; the
 * outputs on the page are those real runs. Uses the shared helpers from assets/visuals.js.
 */
(function () {
  'use strict';
  if (!window.P1Visuals) return;
  var LANG = { java: 'Java', python: 'Python' };

  // ───────────── shared bits ─────────────
  function fixLangs(host, h, langs) {
    var box = host.querySelector('.viz-langs');
    if (!box || !langs) return;
    box.textContent = '';
    langs.forEach(function (l) { box.appendChild(h.el('span', 'lang ' + l, LANG[l])); });
  }
  function bytes(s) {
    try { return new TextEncoder().encode(s).length; } catch (e) { return s.length; }
  }
  function outLines(text, n) {
    var lines = text.replace(/\n$/, '').split('\n');
    return lines.slice(0, n).join('\n');
  }
  /* Text with every newline made visible (↵), the newly added tail highlighted and an optional
     cursor (the stream position) drawn before character `cursor`. */
  function showText(h, s, old, cursor) {
    var start = (typeof old === 'string' && s.length > old.length && s.indexOf(old) === 0) ? old.length : -1;
    if (start === -1 && typeof old !== 'string' && s.length) start = 0;
    var html = '';
    for (var i = 0; i <= s.length; i++) {
      if (i === cursor) html += '<span class="w10-cursor" aria-hidden="true"></span>';
      if (i === start) html += '<span class="w10-new">';
      if (i === s.length) break;
      var c = s.charAt(i);
      html += c === '\n' ? '<span class="w10-nl" aria-hidden="true">↵</span>\n' : h.esc(c);
    }
    if (start !== -1) html += '</span>';
    return html;
  }
  function spoken(s) {
    return s === '' ? 'empty' : s.replace(/\n/g, ' (newline) ');
  }
  var TAG = { mem: 'memory', file: 'disk', chip: 'state', fields: 'values', out: 'output' };

  /* One destination box. update(value, previous) redraws it. */
  function makeBox(h, b) {
    var root = h.el('div', 'w10-box');
    root.dataset.kind = b.kind;
    var head = h.el('div', 'w10-box-head');
    head.appendChild(h.el('span', 'w10-tag', TAG[b.kind] || b.kind));
    head.appendChild(h.el('span', 'w10-box-label', b.label));
    var meta = h.el('span', 'w10-box-meta');
    head.appendChild(meta);
    root.appendChild(head);
    var body;
    if (b.kind === 'out') {
      body = h.el('pre', 'console-out viz-out w10-out');
    } else if (b.kind === 'mem' || b.kind === 'file') {
      body = h.el('pre', 'w10-text');
    } else if (b.kind === 'fields') {
      body = h.el('div', 'w10-fields');
    } else {
      body = h.el('div', 'w10-chipval');
    }
    root.appendChild(body);
    function update(v, prev, cursor) {
      root.classList.remove('is-changed', 'is-emptied', 'is-unset');
      meta.textContent = '';
      if (b.kind === 'out') { body.textContent = v || ''; return; }
      var changed = JSON.stringify(v) !== JSON.stringify(prev) && prev !== undefined;
      if (v === undefined || v === null) {
        root.classList.add('is-unset');
        body.textContent = b.kind === 'file' ? 'no file yet' : (b.kind === 'chip' ? '—' : 'nothing yet');
        body.removeAttribute('aria-label');
        return;
      }
      if (b.kind === 'mem' || b.kind === 'file') {
        body.innerHTML = v === '' ? '' : showText(h, v, prev, cursor);
        if (cursor !== undefined && v === '') body.innerHTML = '<span class="w10-cursor" aria-hidden="true"></span>';
        body.setAttribute('role', 'img');
        body.setAttribute('aria-label', b.label + ': ' + spoken(v) + (cursor !== undefined ? ', position ' + cursor : ''));
        meta.textContent = b.kind === 'file' ? bytes(v) + ' bytes' : v.length + ' characters';
        if (v === '' && typeof prev === 'string' && prev !== '') root.classList.add('is-emptied');
        else if (changed) root.classList.add('is-changed');
        return;
      }
      if (b.kind === 'fields') {
        body.textContent = '';
        var rows = v.length && Array.isArray(v[0]) ? v : [v];
        if (!v.length) body.appendChild(h.el('span', 'w10-none', b.label === 'marks' ? '[ ] empty' : '[ ] no rows'));
        else rows.forEach(function (r, ri) {
          var row = h.el('div', 'w10-frow');
          if (rows.length > 1 || Array.isArray(v[0])) row.appendChild(h.el('span', 'w10-fidx', '[' + ri + ']'));
          r.forEach(function (f, fi) {
            var c = h.el('span', 'w10-field');
            c.appendChild(h.el('span', 'w10-fi', String(fi)));
            c.appendChild(h.el('span', 'w10-fv', f));
            row.appendChild(c);
          });
          body.appendChild(row);
        });
        meta.textContent = Array.isArray(v[0]) ? v.length + ' rows' : v.length + (v.length === 1 ? ' field' : ' fields');
        if (changed) root.classList.add('is-changed');
        return;
      }
      body.textContent = v;
      root.dataset.tone = /thrown|!/.test(v) ? 'bad' : (/caught|closed/.test(v) ? 'ok' : '');
      if (changed) root.classList.add('is-changed');
    }
    return { root: root, update: update };
  }

  /* A predict-then-reveal question. onAnswer(i) is called once. */
  function predictBox(h, p, answered, onAnswer) {
    var box = h.el('div', 'w10-predict');
    var q = h.el('p', 'w10-q');
    q.innerHTML = '<strong>Predict first:</strong> ' + p.q;
    box.appendChild(q);
    var opts = h.el('div', 'w10-opts');
    opts.setAttribute('role', 'group');
    opts.setAttribute('aria-label', 'Your prediction');
    var why = h.el('div', 'w10-why');
    why.setAttribute('aria-live', 'polite');
    var buttons = p.options.map(function (o, i) {
      var b = h.el('button', 'viz-seg-btn w10-opt');
      b.type = 'button';
      b.innerHTML = o;
      b.addEventListener('click', function () {
        if (answered.value !== undefined) return;     // answered: the buttons stay focusable, but inert
        answered.value = i;
        paint();
        onAnswer(i);
      });
      opts.appendChild(b);
      return b;
    });
    function paint() {
      var a = answered.value;
      buttons.forEach(function (b, i) {
        b.setAttribute('aria-disabled', a === undefined ? 'false' : 'true');
        b.dataset.state = a === undefined ? '' : (i === p.answer ? 'right' : (i === a ? 'wrong' : 'other'));
      });
      if (a === undefined) { why.innerHTML = ''; return; }
      why.innerHTML = '<p class="viz-big ' + (a === p.answer ? 'viz-good">✓ Right.' : 'viz-bad">✗ Not quite.') + '</p><p>' + p.why + '</p>';
    }
    box.appendChild(opts);
    box.appendChild(why);
    paint();
    return box;
  }

  function axisPickers(h, body, axes, onChange) {
    var sel = axes.map(function () { return 0; });
    var pickers = axes.map(function (ax, ai) {
      var form = h.el('div', 'viz-form');
      form.appendChild(h.el('span', 'viz-field-label', ax.name + ':'));
      var seg = h.segmented(ax.name, ax.options.map(function (o) { return { label: o }; }), function (n) { sel[ai] = n; onChange(sel); });
      form.appendChild(seg.root);
      body.appendChild(form);
      seg.pick(0);
      return seg;
    });
    return { sel: sel, pickers: pickers };
  }

  // ═════════════ w10-trace ═════════════
  P1Visuals.register('w10-trace', function (host, spec, h) {
    var body = h.shell(host, spec);
    fixLangs(host, h, spec.langs);
    var axes = spec.axes || [];
    var current = null, pane = null, boxes = {}, answered = {}, varIndex = 0;
    var picks = axisPickers(h, body, axes, function () { load(); });
    var stage = h.el('div', 'w10-stage');
    var qHost = h.el('div', 'w10-qhost');
    var paneHost = h.el('div', 'viz-panes w10-panes');
    var st = h.stepper(host, render);
    body.appendChild(stage);
    body.appendChild(st.say);
    body.appendChild(qHost);
    body.appendChild(st.bar);
    body.appendChild(paneHost);

    function find(sel) {
      for (var i = 0; i < spec.variants.length; i++) {
        var v = spec.variants[i];
        if (!v.at || v.at.every(function (x, j) { return x === sel[j]; })) return i;
      }
      return 0;
    }
    function load() {
      varIndex = find(picks.sel);
      current = spec.variants[varIndex];
      var program = spec.programs[current.program];
      pane = h.codePane(program.lang, program.code, { label: program.label });
      paneHost.textContent = '';
      paneHost.appendChild(pane.root);
      stage.textContent = '';
      boxes = {};
      current.boxes.forEach(function (b) { boxes[b.id] = makeBox(h, b); boxes[b.id].spec = b; stage.appendChild(boxes[b.id].root); });
      var state = {}, cursor = {}, n = 0, frames = [];
      current.steps.forEach(function (s, i) {
        var prev = JSON.parse(JSON.stringify(state));
        var prevOut = n;
        if (s.set) Object.keys(s.set).forEach(function (k) { state[k] = s.set[k]; });
        if (s.cursor) Object.keys(s.cursor).forEach(function (k) { cursor[k] = s.cursor[k]; });
        if (s.out !== undefined) n = s.out;
        frames.push({
          state: JSON.parse(JSON.stringify(state)), prev: prev, cursor: JSON.parse(JSON.stringify(cursor)),
          out: n, prevOut: prevOut, line: s.at || (s.line ? pane.line(s.line) : 0), say: s.say, predict: s.predict, i: i
        });
      });
      st.set(frames);
      st.bar.hidden = frames.length < 2;
    }
    function drawOut(f) {
      var program = spec.programs[current.program];
      var key = varIndex + ':' + f.i;
      var hide = f.predict && answered[key] === undefined;
      current.boxes.forEach(function (b) {
        if (b.kind === 'out') boxes[b.id].update(outLines(program.output, hide ? f.prevOut : f.out));
      });
    }
    function render(f) {
      current.boxes.forEach(function (b) {
        if (b.kind !== 'out') boxes[b.id].update(f.state[b.id], f.prev[b.id], f.cursor[b.id]);
      });
      pane.mark(f.line);
      drawOut(f);
      qHost.textContent = '';
      if (f.predict) {
        var key = varIndex + ':' + f.i;
        var holder = { value: answered[key] };
        qHost.appendChild(predictBox(h, f.predict, holder, function (i) { answered[key] = i; drawOut(f); }));
      }
    }
    load();
  });

  // ═════════════ w10-lines: build two records with print / println / write ═════════════
  P1Visuals.register('w10-lines', function (host, spec, h) {
    var body = h.shell(host, spec);
    var lang = 'java', calls = [];
    var form = h.el('div', 'viz-form');
    form.appendChild(h.el('span', 'viz-field-label', 'Language:'));
    var seg = h.segmented('Language', [{ label: 'Java · PrintWriter' }, { label: 'Python · write' }], function (n) { lang = n ? 'python' : 'java'; calls = []; drawButtons(); draw(); });
    form.appendChild(seg.root);
    body.appendChild(form);
    var ops = h.el('div', 'viz-ops w10-pieces');
    ops.setAttribute('role', 'group');
    ops.setAttribute('aria-label', 'Calls you can make');
    body.appendChild(ops);
    var hint = h.el('p', 'viz-muted w10-hint');
    body.appendChild(hint);
    var grid = h.el('div', 'w10-lines-grid');
    var progHost = h.el('div');
    var store = makeBox(h, { kind: 'mem', label: 'what the writer has stored' });
    var reader = h.el('div', 'w10-box');
    reader.dataset.kind = 'fields';
    reader.innerHTML = '<div class="w10-box-head"><span class="w10-tag">reader</span><span class="w10-box-label">the lines a reader gets</span></div>';
    var readerList = h.el('ol', 'w10-readlines');
    reader.appendChild(readerList);
    grid.appendChild(progHost);
    grid.appendChild(store.root);
    grid.appendChild(reader);
    body.appendChild(grid);
    var verdict = h.el('div', 'w10-verdict');
    verdict.setAttribute('aria-live', 'polite');
    body.appendChild(verdict);
    var undo = h.button('↶ Undo last call', 'ghost');
    var reset = h.button('Reset', 'ghost');
    // a button that has just become disabled would drop focus to <body>: hand it to the first call
    function keepFocus(b) { if (b.disabled) ops.querySelector('button').focus(); }
    undo.addEventListener('click', function () { calls.pop(); draw(); keepFocus(undo); });
    reset.addEventListener('click', function () { calls = []; draw(); keepFocus(reset); });

    function drawButtons() {
      ops.textContent = '';
      spec.pieces[lang].forEach(function (p) {
        var b = h.button(p[0], 'ghost mono');
        b.addEventListener('click', function () { if (calls.length < 12) calls.push(p); draw(); });
        ops.appendChild(b);
      });
      ops.appendChild(undo);
      ops.appendChild(reset);
      hint.innerHTML = lang === 'java'
        ? '<code>println</code> ends the line with the system&rsquo;s line separator: <code>\\n</code> on macOS and Linux, <code>\\r\\n</code> on Windows. Shown here as ↵.'
        : '<code>write</code> stores exactly the characters you give it. <code>\\n</code> inside the string is the newline, shown here as ↵.';
    }
    function draw() {
      var text = calls.map(function (c) { return c[1]; }).join('');
      var src = calls.length ? calls.map(function (c) { return c[0]; }).join('\n') : (lang === 'java' ? '// press a call above' : '# press a call above');
      var pane = h.codePane(lang, src, { label: 'your calls, in order' });
      progHost.textContent = '';
      progHost.appendChild(pane.root);
      if (calls.length) pane.mark(calls.length);
      store.update(text, calls.length ? calls.slice(0, -1).map(function (c) { return c[1]; }).join('') : undefined);
      readerList.textContent = '';
      var parts = text.split('\n');
      var tail = parts.pop();
      parts.forEach(function (p) {
        var li = h.el('li', 'w10-rl' + (p === '' ? ' is-blank' : ''));
        li.textContent = p === '' ? '(a blank line)' : p;
        readerList.appendChild(li);
      });
      if (tail !== '') {
        var li = h.el('li', 'w10-rl is-open');
        li.textContent = tail + '  ← no newline yet';
        readerList.appendChild(li);
      }
      if (!text) readerList.innerHTML = '<li class="w10-rl is-none">nothing to read</li>';
      undo.disabled = reset.disabled = !calls.length;
      var target = spec.target, msg, tone;
      if (text === target) { msg = '✓ Exactly two complete records. That is the report.'; tone = 'viz-good'; }
      else if (!text) { msg = 'Make the stored text equal <code>name,mark↵Linh,85↵</code>.'; tone = 'viz-muted'; }
      else if (target.indexOf(text) === 0) { msg = 'So far so good: ' + (target.length - text.length) + ' more character' + (target.length - text.length > 1 ? 's' : '') + ' to go.' + (text.slice(-1) !== '\n' ? ' The last line is not finished yet.' : ''); tone = 'viz-muted'; }
      else if (/\n\n/.test(text) || text.charAt(0) === '\n') { msg = '✗ There is a blank line: one newline too many. A reader would see an empty record.'; tone = 'viz-bad'; }
      else if (/markLinh|mark,?Linh|name,Linh/.test(text) || /\d[A-Za-z]/.test(text) || /markname|85Linh|85name/.test(text)) { msg = '✗ Two records are glued together on one line: a newline is missing between them.'; tone = 'viz-bad'; }
      else { msg = '✗ That is not the report. Undo, or Reset and try again.'; tone = 'viz-bad'; }
      verdict.innerHTML = '<p class="' + tone + '">' + msg + '</p>';
    }
    // the real thing: the same idea, run for real
    var real = h.el('div', 'viz-sandbox');
    real.appendChild(h.el('h4', null, 'Check it for real'));
    var p = h.el('p', 'viz-intro');
    p.innerHTML = spec.check;
    real.appendChild(p);
    var panes = h.el('div', 'viz-panes');
    spec.programs.forEach(function (pr) {
      var cp = h.codePane(pr.lang, pr.code, { label: pr.label, output: true });
      cp.setOut(pr.output.replace(/\n$/, ''));
      panes.appendChild(cp.root);
    });
    real.appendChild(panes);
    body.appendChild(real);
    seg.pick(0);
    drawButtons();
    draw();
  });

  // ═════════════ w10-modes: "w" or "a", three times ═════════════
  P1Visuals.register('w10-modes', function (host, spec, h) {
    var body = h.shell(host, spec);
    var lang = 'python', modes = ['w', 'w', 'a'], answered = {};
    var WORDS = ['old', 'new', 'tail'];
    var lf = h.el('div', 'viz-form');
    lf.appendChild(h.el('span', 'viz-field-label', 'Language:'));
    var lseg = h.segmented('Language', [{ label: 'Python' }, { label: 'Java' }], function (n) { lang = n ? 'java' : 'python'; relabel(); load(); });
    lf.appendChild(lseg.root);
    body.appendChild(lf);
    var segs = WORDS.map(function (word, i) {
      var f = h.el('div', 'viz-form');
      f.appendChild(h.el('span', 'viz-field-label w10-modelabel', ['1st', '2nd', '3rd'][i] + ' open, writes "' + word + '":'));
      var s = h.segmented('Mode of open number ' + (i + 1), [{ label: 'w', mono: true }, { label: 'a', mono: true }], function (n) { modes[i] = n ? 'a' : 'w'; load(); });
      f.appendChild(s.root);
      body.appendChild(f);
      return s;
    });
    function relabel() {
      segs.forEach(function (s) {
        s.buttons[0].textContent = lang === 'java' ? 'false · overwrite' : '"w" · overwrite';
        s.buttons[1].textContent = lang === 'java' ? 'true · append' : '"a" · append';
      });
    }
    var qHost = h.el('div', 'w10-qhost');
    var stage = h.el('div', 'w10-stage w10-stage-one');
    var file = h.el('div', 'w10-box');
    file.dataset.kind = 'file';
    file.innerHTML = '<div class="w10-box-head"><span class="w10-tag">disk</span><span class="w10-box-label">report.txt</span><span class="w10-box-meta"></span></div>';
    var flines = h.el('ol', 'w10-flines');
    file.appendChild(flines);
    stage.appendChild(file);
    var st = h.stepper(host, render);
    var paneHost = h.el('div', 'viz-panes');
    body.appendChild(qHost);
    body.appendChild(stage);
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(paneHost);
    var pane, program;

    function nthLine(src, token, n) {
      var lines = src.split('\n'), seen = 0;
      for (var i = 0; i < lines.length; i++) if (lines[i].indexOf(token) !== -1 && seen++ === n) return i + 1;
      return 0;
    }
    function q(m) { return lang === 'java' ? (m === 'a' ? '<code>true</code>' : '<code>false</code>') : '<code>"' + m + '"</code>'; }
    function load() {
      var key = lang + ':' + modes.join('');
      program = spec.programs.filter(function (p) { return p.key === key; })[0];
      pane = h.codePane(lang, program.code, { label: program.label, output: true });
      paneHost.textContent = '';
      paneHost.appendChild(pane.root);
      var frames = [], lines = null;   // null: no file yet
      modes.forEach(function (m, i) {
        var openLine = nthLine(program.code, lang === 'java' ? 'new FileWriter(' : 'open("report.txt", "', i);
        var say, shown;
        if (lines === null) {
          lines = [];
          shown = [];
          say = 'Open number ' + (i + 1) + ' with ' + q(m) + '. There is no <code>report.txt</code> yet, so it is created, empty. (Both modes create a missing file.)';
        } else if (m === 'w') {
          shown = lines.map(function (t) { return { t: t, mark: 'gone' }; });
          say = q(m) + ' <strong>overwrites</strong>: ' + (lines.length ? 'the ' + lines.length + ' line' + (lines.length > 1 ? 's are' : ' is') + ' erased the moment the file opens, before anything is written.' : 'the file is emptied, though it was already empty.');
          lines = [];
        } else {
          shown = lines.map(function (t) { return { t: t, mark: 'kept' }; });
          say = q(m) + ' <strong>appends</strong>: the ' + lines.length + ' line' + (lines.length === 1 ? '' : 's') + ' already there stay, and writing will continue after ' + (lines.length === 1 ? 'it' : 'them') + '.';
        }
        frames.push({ lines: shown, line: openLine, say: say, out: '' });
        lines.push(WORDS[i]);
        frames.push({
          lines: lines.map(function (t, j) { return { t: t, mark: j === lines.length - 1 ? 'add' : '' }; }),
          line: pane.line(lang === 'java' ? 'out.println("' + WORDS[i] : 'out.write("' + WORDS[i]),
          say: '<code>' + WORDS[i] + '</code> is written after whatever the file holds. The ' + (lang === 'java' ? 'try block' : '<code>with</code> block') + ' then closes the file, so the line is safely on disk.',
          out: ''
        });
      });
      var real = program.output.replace(/\n$/, '');
      if (real !== lines.join('\n')) console.warn('w10-modes: simulation differs from the real run', key);
      frames.push({
        lines: lines.map(function (t) { return { t: t, mark: '' }; }),
        line: pane.line(lang === 'java' ? 'System.out.println(line);' : 'print(source.read(), end="")'),
        say: 'Read the file back and print it. This output is a real run: ' + lines.length + ' line' + (lines.length > 1 ? 's' : '') + '.',
        out: real
      });
      st.set(frames);
      drawQuestion(key, lines.length);
    }
    function drawQuestion(key, count) {
      qHost.textContent = '';
      var holder = { value: answered[key] };
      qHost.appendChild(predictBox(h, {
        q: 'With these modes, how many lines will <code>report.txt</code> hold at the end?',
        options: ['1 line', '2 lines', '3 lines'], answer: count - 1,
        why: 'Only the opens after the last overwrite count: an overwrite erases everything written before it, and each append adds one line. Step through to watch it happen.'
      }, holder, function (i) { answered[key] = i; }));
    }
    function render(f) {
      flines.textContent = '';
      if (!f.lines.length) flines.appendChild(h.el('li', 'w10-none', 'empty file'));
      f.lines.forEach(function (l) {
        var li = h.el('li', 'w10-fline');
        li.dataset.mark = l.mark;
        li.textContent = l.t;
        if (l.mark) li.appendChild(h.el('span', 'w10-fmark', { gone: 'erased', kept: 'kept', add: 'written' }[l.mark]));
        flines.appendChild(li);
      });
      var live = f.lines.filter(function (l) { return l.mark !== 'gone'; });
      file.querySelector('.w10-box-meta').textContent = live.length + (live.length === 1 ? ' line' : ' lines');
      flines.setAttribute('aria-label', 'report.txt holds: ' + (live.map(function (l) { return l.t; }).join(', ') || 'nothing'));
      pane.mark(f.line);
      pane.setOut(f.out);
    }
    lseg.pick(0);
    segs.forEach(function (s, i) { s.pick(modes[i] === 'a' ? 1 : 0); });
    relabel();
    load();
  });

  // ═════════════ w10-format: a report for people ═════════════
  P1Visuals.register('w10-format', function (host, spec, h) {
    var body = h.shell(host, spec);
    var o = { width: 10, align: 'l', dec: 1, lang: 'java' };
    function row(label, opts, onPick, start) {
      var f = h.el('div', 'viz-form');
      f.appendChild(h.el('span', 'viz-field-label', label));
      var s = h.segmented(label, opts.map(function (x) { return { label: x, mono: true }; }), function (n) { onPick(n); draw(); });
      f.appendChild(s.root);
      body.appendChild(f);
      s.pick(start);
      return s;
    }
    row('Name width:', ['6', '10'], function (n) { o.width = n ? 10 : 6; }, 1);
    row('Align names:', ['left', 'right'], function (n) { o.align = n ? 'r' : 'l'; }, 0);
    row('Digits after the point:', ['0', '1', '2'], function (n) { o.dec = n; }, 1);
    row('Language:', ['Java', 'Python'], function (n) { o.lang = n ? 'python' : 'java'; }, 0);
    var specLine = h.el('div', 'w10-spec');
    body.appendChild(specLine);
    var outBox = h.el('div', 'w10-box w10-report');
    outBox.dataset.kind = 'out';
    outBox.innerHTML = '<div class="w10-box-head"><span class="w10-tag">output</span><span class="w10-box-label">the report (real run)</span></div>';
    var pre = h.el('pre', 'w10-ruled');
    outBox.appendChild(pre);
    body.appendChild(outBox);
    var verdict = h.el('div', 'w10-verdict');
    verdict.setAttribute('aria-live', 'polite');
    body.appendChild(verdict);
    var paneHost = h.el('div', 'viz-panes');
    body.appendChild(paneHost);
    function draw() {
      var key = o.lang + ':' + o.width + o.align + o.dec;
      var p = spec.programs.filter(function (x) { return x.key === key; })[0];
      if (!p) return;
      var pane = h.codePane(p.lang, p.code, { label: p.label });
      paneHost.textContent = '';
      paneHost.appendChild(pane.root);
      pane.mark(pane.line(p.tokens[0]));
      var left = o.align === 'l';
      var nameSpec = o.lang === 'java' ? '%' + (left ? '-' : '') + o.width + 's' : '{name:' + (left ? '<' : '>') + o.width + '}';
      var numSpec = o.lang === 'java' ? '%7.' + o.dec + 'f' : '{average:7.' + o.dec + 'f}';
      specLine.innerHTML = '<code class="w10-big">' + h.esc(nameSpec) + '</code> <span class="viz-muted">' +
        (left ? 'left-aligned' : 'right-aligned') + ', at least ' + o.width + ' characters wide</span> ' +
        '<code class="w10-big">' + h.esc(numSpec) + '</code> <span class="viz-muted">at least 7 wide, ' + o.dec + ' digit' + (o.dec === 1 ? '' : 's') + ' after the point</span>';
      var lines = p.output.replace(/\n$/, '').split('\n');
      var longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
      var ruler = '';
      for (var i = 0; i < longest; i++) ruler += String(i % 10);
      pre.innerHTML = '<span class="w10-rule" aria-hidden="true">' + ruler + '</span>\n' + lines.map(function (l) {
        return h.esc(l).replace(/\|/g, '<span class="w10-fence">|</span>');
      }).join('\n');
      pre.setAttribute('aria-label', 'Report: ' + lines.join('; '));
      var fences = lines.map(function (l) { return l.indexOf('|'); });
      var aligned = fences.every(function (x) { return x === fences[0]; });
      var msg = aligned
        ? '<p class="viz-big viz-good">✓ The fences line up.</p><p>Every name fits in ' + o.width + ' characters, so the padding makes each name column exactly ' + o.width + ' wide. ' +
          (left ? 'Left-aligned: the spaces go <em>after</em> the name.' : 'Right-aligned: the spaces go <em>before</em> the name, which suits numbers better than names.') + '</p>'
        : '<p class="viz-big viz-bad">✗ One row is out of line.</p><p><code>Thanh Mai</code> has 9 characters, more than the width ' + o.width + '. A width is a <strong>minimum</strong>: the format never cuts text, so this row is pushed ' +
          (9 - o.width) + ' places right. Choose a width that fits the longest value.</p>';
      msg += '<p class="viz-muted">The averages are 84.333&hellip;, 49.333&hellip; and 67.333&hellip;; with ' + o.dec + ' digit' + (o.dec === 1 ? '' : 's') + ' after the point they print as ' +
        lines.map(function (l) { return '<code>' + h.esc(l.split('|')[1].trim()) + '</code>'; }).join(', ') + '. Rounding changes only the display, not the value stored in the program. ' +
        'This layout is for people: as the diagram above showed, a program reading it back would need a delimiter, not padding.</p>';
      verdict.innerHTML = msg;
    }
    draw();
  });

  // ═════════════ w10-split: commas inside values ═════════════
  P1Visuals.register('w10-split', function (host, spec, h) {
    var body = h.shell(host, spec);
    var name = spec.presets[0], preset = 0;
    var f = h.el('div', 'viz-form');
    f.appendChild(h.el('span', 'viz-field-label', 'Name:'));
    var seg = h.segmented('Name', spec.presets.map(function (p) { return { label: p, mono: true }; }), function (n) { preset = n; name = spec.presets[n]; input.value = ''; draw(); });
    f.appendChild(seg.root);
    var lab = h.el('label', 'viz-field');
    lab.appendChild(h.el('span', null, 'or type one'));
    var input = h.el('input');
    input.type = 'text'; input.maxLength = 24; input.autocomplete = 'off'; input.spellcheck = false;
    input.placeholder = 'Nguyen, Van "Ben"';
    lab.appendChild(input);
    f.appendChild(lab);
    body.appendChild(f);
    var msg = h.el('p', 'viz-bad');
    msg.setAttribute('aria-live', 'polite');
    body.appendChild(msg);
    input.addEventListener('input', function () {
      var v = input.value;
      if (v === '') { seg.pick(preset); name = spec.presets[preset]; msg.textContent = ''; draw(); return; }
      if (!/^[\p{L} ,"'.\-]{1,24}$/u.test(v) || !v.trim()) { msg.textContent = 'Use letters, spaces, commas, quotes, apostrophes, full stops or hyphens (up to 24).'; return; }
      msg.textContent = '';
      seg.pick(-1);
      name = v;
      draw(true);
    });
    var lanes = h.el('div', 'w10-lanes');
    var laneA = lane('Join with a comma, split at every comma', 'Java example: <code>name+","+mark</code>, then <code>split(",")</code>');
    var laneB = lane('csv.writer, then csv.reader', 'Python example: quotes where needed, a reader that understands them');
    lanes.appendChild(laneA.root);
    lanes.appendChild(laneB.root);
    body.appendChild(lanes);
    var real = h.el('div', 'viz-sandbox');
    var realHead = h.el('h4', null, 'The real runs');
    var realNote = h.el('p', 'viz-intro');
    var panes = h.el('div', 'viz-panes');
    real.appendChild(realHead);
    real.appendChild(realNote);
    real.appendChild(panes);
    body.appendChild(real);

    function lane(title, sub) {
      var root = h.el('div', 'w10-lane');
      root.appendChild(h.el('h4', 'w10-lane-title', title));
      var s = h.el('p', 'viz-muted');
      s.innerHTML = sub;
      root.appendChild(s);
      root.appendChild(h.el('div', 'viz-out-label', 'the line in the file'));
      var line = h.el('pre', 'w10-text w10-csvline');
      root.appendChild(line);
      root.appendChild(h.el('div', 'viz-out-label', 'the fields that come back'));
      var fields = h.el('div', 'w10-fields');
      root.appendChild(fields);
      var verdict = h.el('p', 'w10-lane-verdict');
      root.appendChild(verdict);
      return { root: root, line: line, fields: fields, verdict: verdict };
    }
    function chips(box, list) {
      box.textContent = '';
      var row = h.el('div', 'w10-frow');
      list.forEach(function (x, i) {
        var c = h.el('span', 'w10-field' + (list.length !== 2 ? ' is-bad' : ''));
        c.appendChild(h.el('span', 'w10-fi', String(i)));
        c.appendChild(h.el('span', 'w10-fv', x));
        row.appendChild(c);
      });
      box.appendChild(row);
    }
    function csvParse(line) {
      var out = [], cur = '', q = false;
      for (var i = 0; i < line.length; i++) {
        var c = line.charAt(i);
        if (q) {
          if (c === '"' && line.charAt(i + 1) === '"') { cur += '"'; i++; }
          else if (c === '"') q = false;
          else cur += c;
        } else if (c === '"') q = true;
        else if (c === ',') { out.push(cur); cur = ''; }
        else cur += c;
      }
      out.push(cur);
      return out;
    }
    function draw(custom) {
      // lane A: every comma is a cut
      var a = name + ',85';
      laneA.line.innerHTML = h.esc(a).replace(/,/g, '<span class="w10-cut">,</span>');
      laneA.line.setAttribute('aria-label', 'Line: ' + a);
      var fa = a.split(',');
      chips(laneA.fields, fa);
      laneA.verdict.innerHTML = fa.length === 2
        ? '<span class="viz-good">✓ 2 fields: the name survives</span>, because it has no comma.' + (name.indexOf('"') !== -1 ? ' The quotes are just characters here.' : '')
        : '<span class="viz-bad">✗ ' + fa.length + ' fields:</span> the comma' + (fa.length > 3 ? 's' : '') + ' inside the name became separators. <code>fields[1]</code> is no longer the mark.';
      // lane B: csv.writer quotes a field holding a comma or a quote, doubling inner quotes
      var needs = /[",]/.test(name);
      var cell = needs ? '"' + name.replace(/"/g, '""') + '"' : name;
      var b = cell + ',85';
      var html = '', inQ = false;
      for (var i = 0; i < b.length; i++) {
        var c = b.charAt(i);
        if (c === '"') { html += '<span class="w10-q">"</span>'; inQ = !inQ; }
        else if (c === ',' && !inQ) html += '<span class="w10-cut">,</span>';
        else html += h.esc(c);
      }
      laneB.line.innerHTML = html;
      laneB.line.setAttribute('aria-label', 'Line: ' + b);
      var fb = csvParse(b);
      chips(laneB.fields, fb);
      laneB.verdict.innerHTML = '<span class="viz-good">✓ ' + fb.length + ' fields: the name comes back exactly.</span> ' +
        (needs ? 'The writer added quotes' + (name.indexOf('"') !== -1 ? ' and doubled each quote inside (<code>""</code>)' : '') + ', and the reader removed them again.' : 'No quotes were needed.');
      // real runs for presets only
      panes.textContent = '';
      if (custom) {
        realNote.innerHTML = 'Your own name is worked out in the browser, with the same rules as the two programs. Choose a preset name to see real runs.';
        return;
      }
      realNote.innerHTML = 'The two programs behind the lanes, run for real on <code>' + h.esc(name) + '</code>.';
      ['java', 'python'].forEach(function (l) {
        var p = spec.programs.filter(function (x) { return x.key === l + ':' + preset; })[0];
        var cp = h.codePane(l, p.code, { label: p.label, output: true });
        cp.setOut(p.output.replace(/\n$/, ''));
        cp.mark(cp.line(p.tokens[l === 'java' ? 1 : 0]));
        panes.appendChild(cp.root);
      });
    }
    seg.pick(0);
    draw();
  });
})();
