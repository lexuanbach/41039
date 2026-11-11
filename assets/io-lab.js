/* 41039 Programming 1 — I/O & Exceptions Lab: the page.
 *
 *   <div id="io-lab"></div>   (io-lab.html)
 *
 * The reader edits scores.txt and makes five choices; assets/io-lab-model.js writes the Java and
 * Python programs and simulates them. Each step is a snapshot: the line that runs, the file and its
 * read position, whether the file is open, the call stack (with the exception on the frame it has
 * reached), the console and report.txt. "Run it for real" runs the same programs on the real
 * runtimes (assets/runtime.js) and says whether they agree with the animation.
 *
 * Full screen lifts the whole lab over the page (Esc leaves). ← / → step. The choices live in the
 * URL hash, so a link can open the lab on a particular scenario (see the "Things to try" list).
 *
 * Depends on io-lab-model.js, highlight.js and (for real runs) runtime.js.
 */
(function () {
  'use strict';
  var M = window.P1IOLab;
  if (!M) return;
  var LANG = { java: 'Java', python: 'Python' };
  var motion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  // ───────────── small helpers ─────────────
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function button(label, cls, title) {
    var b = el('button', 'btn small ' + (cls || 'ghost'), label);
    b.type = 'button';
    if (title) { b.title = title; b.setAttribute('aria-label', title); }
    return b;
  }
  function seg(label, options, onPick) {
    var wrap = el('div', 'viz-seg');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', label);
    var buttons = options.map(function (o) {
      var b = el('button', 'viz-seg-btn' + (o.mono ? ' mono' : ''));
      b.type = 'button';
      b.innerHTML = o.html || esc(o.label);
      if (o.title) b.title = o.title;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { if (!b.disabled) onPick(o.value); });
      wrap.appendChild(b);
      return b;
    });
    return {
      root: wrap, buttons: buttons,
      set: function (v) { buttons.forEach(function (b, i) { b.setAttribute('aria-pressed', String(options[i].value === v)); }); }
    };
  }
  function splitLines(html) {
    var lines = [], cur = '', open = '', re = /(<span[^>]*>)|(<\/span>)|(\n)|([^<\n]+)/g, m;
    while ((m = re.exec(html)) !== null) {
      if (m[1]) { open = m[1]; cur += m[1]; }
      else if (m[2]) { open = ''; cur += m[2]; }
      else if (m[3]) { lines.push(cur + (open ? '</span>' : '')); cur = open; }
      else cur += m[4];
    }
    lines.push(cur + (open ? '</span>' : ''));
    return lines;
  }
  function highlight(src, lang) {
    return splitLines(window.P1Highlight ? P1Highlight.toHtml(src, lang) : esc(src));
  }
  // show the characters a reader cannot see: spaces as ·, tabs as →
  function visible(s) {
    if (s === '') return '<span class="lab-ws">(empty line)</span>';
    return esc(s).replace(/ /g, '<span class="lab-ws">·</span>').replace(/\t/g, '<span class="lab-ws">→</span>');
  }

  // ───────────── state, kept in the URL hash ─────────────
  var state = {
    cfg: M.norm({}),
    file: { exists: true, text: M.PRESETS[1].text },
    view: 'java',
    predict: false
  };
  function readHash() {
    var h = location.hash.replace(/^#/, '');
    if (!h || h.indexOf('=') === -1) return false;
    var q = {};
    h.split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) { try { q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); } catch (e) {} }
    });
    var cfg = {};
    ['loop', 'handler', 'close'].forEach(function (k) { if (q[k]) cfg[k] = q[k]; });
    if (q.fin) cfg.fin = q.fin !== '0';
    if (q.report) cfg.report = q.report !== '0';
    state.cfg = M.norm(Object.assign({}, state.cfg, cfg));
    var preset = M.PRESETS.filter(function (p) { return p.id === q.preset; })[0];
    if (preset) state.file = { exists: preset.exists, text: preset.text };
    if (q.file !== undefined) state.file.text = q.file;
    if (q.exists) state.file.exists = q.exists !== '0';
    if (q.view === 'java' || q.view === 'python' || q.view === 'both') state.view = q.view;
    return true;
  }
  function writeHash() {
    var c = state.cfg, parts = [
      'loop=' + c.loop, 'handler=' + c.handler, 'close=' + c.close,
      'fin=' + (c.fin ? 1 : 0), 'report=' + (c.report ? 1 : 0), 'view=' + state.view
    ];
    var preset = presetOf(state.file);
    if (preset) parts.push('preset=' + preset.id);
    else parts.push('exists=' + (state.file.exists ? 1 : 0), 'file=' + encodeURIComponent(state.file.text));
    try { history.replaceState(null, '', '#' + parts.join('&')); } catch (e) {}
  }
  function presetOf(file) {
    return M.PRESETS.filter(function (p) { return p.exists === file.exists && p.text === file.text; })[0] || null;
  }

  // ───────────── build ─────────────
  function mount(host) {
    readHash();
    host.textContent = '';
    host.classList.add('lab');
    host.setAttribute('role', 'region');
    host.setAttribute('aria-label', 'I/O and exceptions lab');

    // header
    var head = el('div', 'lab-head');
    head.appendChild(el('span', 'viz-kicker', 'Interactive lab'));
    head.appendChild(el('span', 'lab-title', 'Add up the numbers in scores.txt'));
    var badges = el('span', 'viz-langs');
    head.appendChild(badges);
    var fsBtn = button('⛶ Full screen', 'ghost lab-fs', 'Make the lab fill the screen (Esc to leave)');
    fsBtn.setAttribute('aria-pressed', 'false');
    head.appendChild(fsBtn);
    host.appendChild(head);

    var body = el('div', 'lab-body');
    host.appendChild(body);
    var setup = el('div', 'lab-col lab-setup');
    var codeCol = el('div', 'lab-col lab-codecol');
    var stageCol = el('div', 'lab-col lab-stagecol');
    body.appendChild(setup);
    body.appendChild(codeCol);
    body.appendChild(stageCol);

    // ── 1 · the input file ──
    var boxFile = box(setup, '1', 'The input file', 'What is in scores.txt when the program runs?');
    var presets = seg('Example files', M.PRESETS.map(function (p) { return { label: p.label, value: p.id }; }), function (id) {
      var p = M.PRESETS.filter(function (x) { return x.id === id; })[0];
      state.file = { exists: p.exists, text: p.text };
      fileArea.value = p.text;
      existsBox.checked = p.exists;
      changed();
    });
    presets.root.classList.add('lab-presets');
    boxFile.appendChild(presets.root);
    var editor = el('div', 'lab-fileedit');
    var fehead = el('div', 'lab-fe-head');
    fehead.appendChild(el('span', 'lab-fe-name', 'scores.txt'));
    var existsLabel = el('label', 'lab-check');
    var existsBox = el('input');
    existsBox.type = 'checkbox';
    existsLabel.appendChild(existsBox);
    existsLabel.appendChild(document.createTextNode(' the file exists'));
    fehead.appendChild(existsLabel);
    editor.appendChild(fehead);
    var fileArea = el('textarea', 'lab-fe-text');
    fileArea.rows = 6;
    fileArea.spellcheck = false;
    fileArea.setAttribute('autocapitalize', 'off');
    fileArea.setAttribute('autocomplete', 'off');
    fileArea.setAttribute('aria-label', 'Contents of scores.txt, one score per line');
    editor.appendChild(fileArea);
    boxFile.appendChild(editor);
    var feHint = el('p', 'lab-hint');
    feHint.innerHTML = 'One score per line. Edit it: try a word, a blank line, <code>3.5</code> or spaces around a number.';
    boxFile.appendChild(feHint);
    var tmr = null;
    fileArea.addEventListener('input', function () {
      clearTimeout(tmr);
      tmr = setTimeout(function () { state.file.text = fileArea.value; changed(); }, 250);
    });
    existsBox.addEventListener('change', function () { state.file.exists = existsBox.checked; changed(); });

    // ── 2 · the program ──
    var boxProg = box(setup, '2', 'The program', 'Change how it handles trouble. Both programs are rewritten as you choose.');
    var pickers = {};
    function choice(key, label, options) {
      var row = el('div', 'lab-choice');
      row.appendChild(el('div', 'lab-choice-label', label));
      var s = seg(label, options, function (v) { state.cfg[key] = v; changed(); });
      row.appendChild(s.root);
      boxProg.appendChild(row);
      pickers[key] = s;
    }
    choice('loop', 'A line is not a number', [
      { label: 'Let it stop the loop', value: 'stop', title: 'No try/catch in the loop: the exception leaves sumScores' },
      { label: 'Skip that line', value: 'skip', title: 'A try/catch inside the loop handles it and carries on' }
    ]);
    choice('handler', 'What main catches', [
      { label: 'Each exception', value: 'specific', title: 'One catch / except per kind of failure' },
      { label: 'Any Exception', value: 'broad', title: 'One broad catch (Exception e) / except Exception' },
      { label: 'Nothing', value: 'none', title: 'No catch at all: an exception crashes the program' }
    ]);
    choice('close', 'Who closes scores.txt', [
      { label: 'Automatic', value: 'auto', html: 'Automatic <span class="lab-sub">try-with-resources / with</span>' },
      { label: 'close() at the end', value: 'manual', html: '<code>close()</code> at the end' },
      { label: 'close() in finally', value: 'finally', html: '<code>close()</code> in <code>finally</code>' }
    ]);
    choice('fin', 'finally in main', [
      { label: 'Prints "Done"', value: true, html: 'Prints <code>Done</code>' },
      { label: 'None', value: false }
    ]);
    choice('report', 'Write report.txt', [
      { label: 'Save the total', value: true },
      { label: 'No', value: false }
    ]);

    // ── 3 · how to watch ──
    var boxView = box(setup, '3', 'Watch it run', null);
    var viewRow = el('div', 'lab-choice');
    viewRow.appendChild(el('div', 'lab-choice-label', 'Language'));
    var viewSeg = seg('Language', [
      { label: 'Java', value: 'java' }, { label: 'Python', value: 'python' }, { label: 'Side by side', value: 'both' }
    ], function (v) { state.view = v; changed(true); });
    viewRow.appendChild(viewSeg.root);
    boxView.appendChild(viewRow);
    var agreeNote = el('p', 'lab-hint lab-agree');
    agreeNote.setAttribute('aria-live', 'polite');
    boxView.appendChild(agreeNote);
    var predictLabel = el('label', 'lab-check');
    var predictBox = el('input');
    predictBox.type = 'checkbox';
    predictLabel.appendChild(predictBox);
    predictLabel.appendChild(document.createTextNode(' Predict first: hide the console until the last step'));
    boxView.appendChild(predictLabel);
    predictBox.addEventListener('change', function () { state.predict = predictBox.checked; show(at, false); });

    // ── the code ──
    var panesBox = el('div', 'lab-panes');
    codeCol.appendChild(panesBox);
    var real = el('div', 'lab-real');
    codeCol.appendChild(real);

    // ── the stage: controls, caption, panels ──
    var bar = el('div', 'viz-controls lab-controls');
    var bStart = button('⏮', 'ghost', 'Back to the first step');
    var bBack = button('◀ Back', 'ghost', 'Previous step (←)');
    var bNext = button('Next ▶', 'primary', 'Next step (→)');
    var bEnd = button('⏭', 'ghost', 'Jump to the last step');
    var bPlay = button('▶ Play', 'ghost', 'Play the steps one after another');
    var speed = el('select', 'lab-speed');
    speed.setAttribute('aria-label', 'Playing speed');
    [['2000', 'Slow'], ['1200', 'Normal'], ['650', 'Fast']].forEach(function (o) {
      var opt = el('option', null, o[1]); opt.value = o[0]; speed.appendChild(opt);
    });
    speed.value = '1200';
    var count = el('span', 'viz-count');
    [bStart, bBack, bNext, bEnd, bPlay, speed, count].forEach(function (n) { bar.appendChild(n); });
    stageCol.appendChild(bar);
    var say = el('div', 'viz-say lab-say');
    say.setAttribute('aria-live', 'polite');
    stageCol.appendChild(say);

    var stage = el('div', 'lab-stage');
    stageCol.appendChild(stage);
    var pFile = panel(stage, 'lab-p-file', 'Input file');
    var pStack = panel(stage, 'lab-p-stack', 'Call stack · newest on top');
    var pOut = panel(stage, 'lab-p-out', 'Console');
    var pRep = panel(stage, 'lab-p-report', 'Output file');
    var summary = el('div', 'lab-summary');
    summary.setAttribute('aria-live', 'polite');
    stageCol.appendChild(summary);
    var legend = el('p', 'lab-legend');
    legend.innerHTML = '<span data-tone="throw">thrown</span><span data-tone="unwind">passing through</span>' +
      '<span data-tone="catch">caught</span><span data-tone="lib">library code</span>';
    stageCol.appendChild(legend);

    // ───────────── behaviour ─────────────
    var sim = null, panes = [], at = 0, timer = null, langs = ['java'];
    var realState = {};      // lang → { status, out, err, report, verdict }

    function box(parent, num, title, hint) {
      var b = el('section', 'lab-box');
      var t = el('h3', 'lab-box-title');
      t.appendChild(el('span', 'lab-num', num));
      t.appendChild(document.createTextNode(title));
      b.appendChild(t);
      if (hint) b.appendChild(el('p', 'lab-hint', hint));
      parent.appendChild(b);
      return b;
    }
    function panel(parent, cls, title) {
      var p = el('section', 'lab-panel ' + cls);
      var h = el('div', 'lab-panel-title');
      h.appendChild(el('span', null, title));
      var extra = el('span', 'lab-panel-extra');
      h.appendChild(extra);
      p.appendChild(h);
      var b = el('div', 'lab-panel-body');
      p.appendChild(b);
      parent.appendChild(p);
      return { root: p, body: b, extra: extra };
    }

    function changed(viewOnly) {
      stop();
      var dis = M.agree(state.file);
      viewSeg.buttons[2].disabled = !!dis;
      if (dis) {
        agreeNote.innerHTML = '<strong>Side by side is off for this file.</strong> On line ' + dis.line + ', ' + esc(dis.why) +
          '. The two programs take different paths, so watch them one at a time.';
        if (state.view === 'both') state.view = 'java';
      } else {
        agreeNote.textContent = '';
      }
      langs = state.view === 'both' ? ['java', 'python'] : [state.view];
      sim = M.simulate(state.cfg, state.file, state.view);
      if (!viewOnly) realState = {};
      syncControls();
      buildPanes();
      buildReal();
      writeHash();
      show(0, false);
    }
    function syncControls() {
      Object.keys(pickers).forEach(function (k) { pickers[k].set(state.cfg[k]); });
      viewSeg.set(state.view);
      var p = presetOf(state.file);
      presets.set(p ? p.id : null);
      if (fileArea.value !== state.file.text && document.activeElement !== fileArea) fileArea.value = state.file.text;
      existsBox.checked = state.file.exists;
      fileArea.disabled = !state.file.exists;
      editor.classList.toggle('is-missing', !state.file.exists);
      badges.textContent = '';
      langs.forEach(function (l) { badges.appendChild(el('span', 'lang ' + l, LANG[l])); });
      host.dataset.view = state.view;
    }

    function buildPanes() {
      panesBox.textContent = '';
      panes = langs.map(function (lang) {
        var prog = M.program(state.cfg, lang);
        var pane = el('div', 'viz-pane lab-pane');
        var ph = el('div', 'viz-pane-head');
        ph.appendChild(el('span', 'lang ' + lang, LANG[lang]));
        ph.appendChild(el('span', 'viz-pane-label', prog.fileName));
        var copy = button('Copy', 'ghost lab-copy', 'Copy the ' + LANG[lang] + ' program');
        copy.addEventListener('click', function () {
          var done = function () { copy.textContent = 'Copied ✓'; setTimeout(function () { copy.textContent = 'Copy'; }, 1500); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(prog.code).then(done, function () {});
        });
        ph.appendChild(copy);
        pane.appendChild(ph);
        var pre = el('pre', 'explain-code viz-code lab-code');
        pre.setAttribute('aria-label', LANG[lang] + ' program');
        pre.innerHTML = highlight(prog.code.replace(/\n$/, ''), lang).map(function (l) {
          return '<div class="cl">' + l.replace(/^ +/, function (s) { return new Array(s.length + 1).join(' '); }) + '</div>';
        }).join('');
        pane.appendChild(pre);
        panesBox.appendChild(pane);
        return { lang: lang, pre: pre };
      });
    }

    // ── one step ──
    function show(n, animate) {
      if (!sim) return;
      at = Math.max(0, Math.min(sim.steps.length - 1, n));
      var s = sim.steps[at];
      var fly = animate && s.fly && moving() ? prepareFly(s.fly) : null;
      say.innerHTML = s.say;
      count.textContent = 'Step ' + (at + 1) + ' of ' + sim.steps.length;
      bStart.disabled = bBack.disabled = at === 0;
      bNext.disabled = bEnd.disabled = at === sim.steps.length - 1;
      panes.forEach(function (p) { markLine(p, s.line[p.lang], s.mark); });
      renderFile(s);
      renderStack(s);
      renderOut(s);
      renderReport(s);
      renderSummary(s);
      if (fly) runFly(fly, s);
      if (at === sim.steps.length - 1) stop();
    }
    function last() { return at === sim.steps.length - 1; }

    function markLine(p, line, mark) {
      Array.prototype.forEach.call(p.pre.children, function (row, i) {
        var on = i + 1 === line;
        row.classList.toggle('is-now', on);
        row.classList.toggle('is-ok', on && mark === 'ok');
        row.classList.toggle('is-bad', on && mark === 'bad');
      });
      var row = p.pre.children[line - 1];
      if (!row) return;
      // keep the current line in view inside the pane, without scrolling the page
      var box = p.pre.parentNode;
      var scroller = box.scrollHeight > box.clientHeight + 2 ? box : null;
      if (scroller) {
        var top = row.offsetTop - scroller.offsetTop, h = scroller.clientHeight;
        if (top < scroller.scrollTop + 40 || top > scroller.scrollTop + h - 60) {
          scroller.scrollTo({ top: Math.max(0, top - h / 3), behavior: moving() ? 'smooth' : 'auto' });
        }
      }
    }

    var HANDLE = {
      'closed-none': ['not opened yet', ''],
      open: ['● open', 'open'],
      closed: ['✓ closed', 'closed'],
      leaked: ['⚠ never closed', 'leaked'],
      missing: ['✗ no such file', 'missing']
    };
    function renderFile(s) {
      var h = HANDLE[s.handle];
      pFile.extra.innerHTML = '<span class="lab-pill" data-tone="' + h[1] + '">' + h[0] + '</span>';
      var b = pFile.body;
      b.textContent = '';
      var name = el('div', 'lab-fname', 'scores.txt');
      b.appendChild(name);
      if (!state.file.exists) {
        var gone = el('div', 'lab-missing');
        gone.innerHTML = 'There is no file called <code>scores.txt</code>. Opening it will fail.';
        b.appendChild(gone);
        return;
      }
      var lines = M.fileLines(state.file.text);
      var list = el('ol', 'lab-lines');
      lines.forEach(function (line, i) {
        var li = el('li', 'lab-line');
        li.dataset.fly = 'file-' + i;
        if (s.cursor === i) li.classList.add('is-cur');
        if (s.cursor > i || s.eof) li.classList.add('is-done');
        li.innerHTML = '<span class="lab-ln">' + (i + 1) + '</span><span class="lab-lt">' + visible(line) + '</span>';
        var v = s.verdict[i];
        if (v) {
          var chip = el('span', 'lab-verdict', v.text);
          chip.dataset.tone = v.kind;
          li.appendChild(chip);
        }
        list.appendChild(li);
      });
      b.appendChild(list);
      var eof = el('div', 'lab-eof' + (s.eof ? ' is-hit' : ''), lines.length ? 'end of file' : 'end of file (the file is empty)');
      b.appendChild(eof);
    }

    function frameName(key) {
      var n = M.NAMES[key];
      if (state.view === 'both') return n.java === n.python ? n.java : n.java + ' · ' + n.python;
      return n[state.view];
    }
    function varText(v) {
      if (state.view === 'both') {
        var nj = v.n.java, np = v.n.python, vj = v.v.java, vp = v.v.python;
        if (nj === np && vj === vp) return nj + ' = ' + vj;
        return (nj === np ? nj : nj + ' / ' + np) + ' = ' + vj + ' / ' + vp;
      }
      return v.n[state.view] + ' = ' + v.v[state.view];
    }
    function excName(e) {
      if (state.view === 'both') return e.java + ' / ' + e.python;
      return e[state.view];
    }
    function renderStack(s) {
      var b = pStack.body;
      b.textContent = '';
      var list = el('div', 'lab-stack');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Call stack, newest frame first');
      s.stack.slice().reverse().forEach(function (f) {
        var fr = el('div', 'lab-frame' + (f.lib ? ' is-lib' : ''));
        fr.setAttribute('role', 'listitem');
        fr.dataset.fly = 'frame-' + f.key;
        if (f.tone) fr.dataset.tone = f.tone;
        var nameRow = el('div', 'lab-frame-head');
        var nm = el('span', 'lab-frame-name', frameName(f.key) + (f.lib ? '(…)' : '()'));
        nameRow.appendChild(nm);
        if (f.lib) nameRow.appendChild(el('span', 'lab-frame-tag', state.view === 'python' ? 'built-in' : state.view === 'java' ? 'Java library' : 'library'));
        if (f.exc) {
          var x = el('span', 'lab-exc', excName(f.exc));
          x.dataset.fly = 'exc';
          x.dataset.tone = f.tone;
          nameRow.appendChild(x);
        }
        fr.appendChild(nameRow);
        if (f.vars.length) {
          var vars = el('div', 'lab-vars');
          f.vars.forEach(function (v) {
            var c = el('span', 'lab-var', varText(v));
            c.dataset.fly = 'var-' + f.key + '-' + v.n.java.toLowerCase().replace(/[^a-z]/g, '');
            vars.appendChild(c);
          });
          fr.appendChild(vars);
        }
        list.appendChild(fr);
      });
      if (!s.stack.length) {
        var empty = el('div', 'lab-stack-empty');
        empty.textContent = s.status === 'crash' ? 'Empty: the program crashed.' : s.status === 'ok' ? 'Empty: the program has finished.' : 'Empty.';
        list.appendChild(empty);
      }
      b.appendChild(list);
      if (s.status !== 'run') {
        var end = el('div', 'lab-end');
        end.dataset.tone = s.status;
        end.innerHTML = s.status === 'crash' ? 'Uncaught exception · <strong>exit code 1</strong>' : 'Finished normally · <strong>exit code 0</strong>';
        b.appendChild(end);
      }
    }

    function renderOut(s) {
      var b = pOut.body;
      b.textContent = '';
      pOut.extra.textContent = '';
      langs.forEach(function (l) {
        var wrap = el('div', 'lab-term');
        if (langs.length > 1) wrap.appendChild(el('div', 'lab-term-label', LANG[l]));
        var pre = el('pre', 'console-out lab-out');
        pre.setAttribute('aria-label', LANG[l] + ' console');
        if (state.predict && !last()) {
          pre.classList.add('is-hidden');
          pre.textContent = 'Hidden. What will it print? Step to the end to check.';
        } else {
          s.out[l].forEach(function (o, i) {
            var row = el('span', o.note ? 'muted' : o.err ? 'err' : null, o.t + '\n');
            if (i === s.out[l].length - 1) row.dataset.fly = 'out-last';
            pre.appendChild(row);
          });
        }
        wrap.appendChild(pre);
        b.appendChild(wrap);
        // keep the newest output in view
        pre.scrollTop = pre.scrollHeight;
      });
      var hasErr = s.out[langs[0]].some(function (o) { return o.err; });
      if (hasErr && !(state.predict && !last())) pOut.extra.innerHTML = '<span class="lab-pill" data-tone="leaked">red = error stream</span>';
    }

    function renderReport(s) {
      var b = pRep.body, r = s.report;
      b.textContent = '';
      b.appendChild(el('div', 'lab-fname', 'report.txt'));
      var tone = { off: '', none: '', open: 'open', buffered: 'open', saved: 'closed' }[r.state];
      var label = { off: 'not used', none: 'does not exist', open: '● open, empty', buffered: '● open', saved: '✓ saved' }[r.state];
      pRep.extra.innerHTML = '<span class="lab-pill" data-tone="' + tone + '">' + label + '</span>';
      if (r.state === 'off') {
        b.appendChild(el('p', 'lab-muted', 'This version does not write a report. Turn on “Write report.txt”.'));
        return;
      }
      var rows = el('div', 'lab-rep');
      var buf = el('div', 'lab-rep-row');
      buf.innerHTML = '<span class="lab-rep-k">buffer (memory)</span>';
      var bufV = el('span', 'lab-rep-v' + (r.buffer ? ' is-buf' : ''), r.buffer || (r.state === 'open' ? '(empty)' : '—'));
      bufV.dataset.fly = 'report-buf';
      buf.appendChild(bufV);
      var disk = el('div', 'lab-rep-row');
      disk.innerHTML = '<span class="lab-rep-k">on disk</span>';
      disk.appendChild(el('span', 'lab-rep-v' + (r.state === 'saved' ? ' is-saved' : ''),
        r.state === 'saved' ? r.text.replace(/\n$/, '') : r.state === 'none' ? (s.status === 'run' ? '(no file yet)' : '(never created)') : '(empty)'));
      rows.appendChild(buf);
      rows.appendChild(disk);
      b.appendChild(rows);
    }

    function renderSummary(s) {
      summary.textContent = '';
      if (s.status === 'run') return;
      var items = [];
      items.push(s.status === 'crash' ? ['bad', 'Crashed: exit code 1'] : ['good', 'Ended normally: exit code 0']);
      if (s.handle === 'closed') items.push(['good', 'scores.txt was closed']);
      else if (s.handle === 'leaked') items.push(['bad', 'scores.txt was never closed']);
      else if (s.handle === 'missing') items.push(['', 'scores.txt never opened']);
      if (s.report.state === 'saved') items.push(['good', 'report.txt saved']);
      else if (s.report.state !== 'off') items.push(['', 'report.txt not written']);
      items.forEach(function (it) {
        var c = el('span', 'lab-sum-chip', it[1]);
        if (it[0]) c.dataset.tone = it[0];
        summary.appendChild(c);
      });
    }

    // ── flying values: a copy of the thing that moved travels from where it was to where it went ──
    function moving() { return !(motion && motion.matches); }
    function prepareFly(f) {
      var from = host.querySelector('[data-fly="' + f.from + '"]');
      if (!from) return null;
      var r = from.getBoundingClientRect();
      var text = from.dataset.fly === 'exc' ? from.textContent : null;
      return { spec: f, rect: r, text: text };
    }
    function runFly(fly, s) {
      var to = host.querySelector('[data-fly="' + fly.spec.to + '"]');
      if (!to) return;
      var t = to.getBoundingClientRect();
      if (!fly.rect.width || !t.width) return;
      var text = fly.text || to.textContent.replace(/\n$/, '');
      if (fly.spec.from.indexOf('file-') === 0) {
        var i = +fly.spec.from.slice(5);
        text = M.fileLines(state.file.text)[i];
        text = text === '' ? '""' : text;
      }
      if (text.length > 40) text = text.slice(0, 38) + '…';
      var token = el('div', 'lab-token', text);
      if (fly.spec.from === 'exc') token.classList.add('is-exc');
      document.body.appendChild(token);
      var w = token.offsetWidth, h = token.offsetHeight;
      var x0 = fly.rect.left + fly.rect.width / 2 - w / 2, y0 = fly.rect.top + fly.rect.height / 2 - h / 2;
      var x1 = t.left + Math.min(t.width, 220) / 2 - w / 2, y1 = t.top + t.height / 2 - h / 2;
      token.style.transform = 'translate(' + x0 + 'px,' + y0 + 'px)';
      to.classList.add('is-arriving');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          token.style.transform = 'translate(' + x1 + 'px,' + y1 + 'px)';
          token.style.opacity = '0.15';
        });
      });
      setTimeout(function () { token.remove(); to.classList.remove('is-arriving'); }, 650);
    }

    // ── controls ──
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      bPlay.textContent = '▶ Play';
    }
    function play() {
      if (timer) { stop(); return; }
      if (last()) show(0, false);
      bPlay.textContent = '❚❚ Pause';
      timer = setInterval(function () { show(at + 1, true); }, +speed.value);
    }
    bStart.addEventListener('click', function () { stop(); show(0, false); });
    bBack.addEventListener('click', function () { stop(); show(at - 1, false); });
    bNext.addEventListener('click', function () { stop(); show(at + 1, true); });
    bEnd.addEventListener('click', function () { stop(); show(sim.steps.length - 1, false); });
    bPlay.addEventListener('click', play);
    speed.addEventListener('change', function () { if (timer) { stop(); play(); } });
    host.addEventListener('keydown', function (ev) {
      var t = ev.target;
      if (t.closest && t.closest('textarea, input, select')) return;
      if (ev.key === 'ArrowRight') { ev.preventDefault(); stop(); show(at + 1, true); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); stop(); show(at - 1, false); }
    });

    // ── full screen ──
    function setFull(on) {
      host.classList.toggle('is-full', on);
      document.body.classList.toggle('code-fullscreen-open', on || !!document.querySelector('.code-fullscreen, .viz.is-full'));
      fsBtn.textContent = on ? '✕ Exit full screen' : '⛶ Full screen';
      fsBtn.setAttribute('aria-pressed', String(on));
      fsBtn.title = on ? 'Back to the page (Esc)' : 'Make the lab fill the screen (Esc to leave)';
      fsBtn.setAttribute('aria-label', fsBtn.title);
      if (on) fsBtn.focus();
      else host.scrollIntoView({ block: 'start' });
      show(at, false);
    }
    fsBtn.addEventListener('click', function () { setFull(!host.classList.contains('is-full')); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && host.classList.contains('is-full')) setFull(false);
    });

    // ───────────── run it for real ─────────────
    function buildReal() {
      real.textContent = '';
      var h = el('div', 'lab-real-head');
      var t = el('h3', 'lab-real-title', 'Check it on the real runtimes');
      h.appendChild(t);
      var btns = el('div', 'lab-real-btns');
      langs.forEach(function (l) {
        var b = button('▶ Run ' + LANG[l] + ' for real', 'primary', 'Compile and run this ' + LANG[l] + ' program on scores.txt');
        b.addEventListener('click', function () { runReal(l); });
        btns.appendChild(b);
      });
      h.appendChild(btns);
      real.appendChild(h);
      var p = el('p', 'lab-hint');
      p.innerHTML = 'The animation is a model. This button writes your <code>scores.txt</code>, runs the program above on real ' +
        (langs.length > 1 ? 'Java and Python' : LANG[langs[0]]) + ' in your browser, then reads back <code>report.txt</code>.';
      real.appendChild(p);
      langs.forEach(function (l) {
        var box = el('div', 'lab-real-res');
        box.dataset.lang = l;
        real.appendChild(box);
        paintReal(l);
      });
    }
    function paintReal(l) {
      var box = real.querySelector('.lab-real-res[data-lang="' + l + '"]');
      if (!box) return;
      var r = realState[l];
      box.textContent = '';
      if (!r) return;
      var head = el('div', 'lab-real-res-head');
      head.appendChild(el('span', 'lang ' + l, LANG[l]));
      var status = el('span', 'console-status');
      status.innerHTML = r.status;
      head.appendChild(status);
      box.appendChild(head);
      if (r.boot) box.appendChild(el('div', 'console-boot', r.boot));
      if (r.done) {
        var pre = el('pre', 'console-out lab-out');
        if (r.out) pre.appendChild(el('span', null, r.out));
        if (r.err) pre.appendChild(el('span', 'err', r.err));
        if (!r.out && !r.err) pre.appendChild(el('span', 'muted', '(nothing printed)'));
        box.appendChild(pre);
        var rep = el('div', 'lab-real-rep');
        rep.innerHTML = '<span class="lab-rep-k">report.txt</span> ' + (r.report === null ? '<em>not created</em>' : '<code>' + esc(r.report.replace(/\n$/, '')) + '</code>');
        box.appendChild(rep);
        var v = el('div', 'lab-real-verdict');
        v.dataset.tone = r.match ? 'good' : 'bad';
        v.innerHTML = r.verdict;
        box.appendChild(v);
      }
    }
    function runReal(l) {
      if (!window.P1Runtime) return;
      var file = { exists: state.file.exists, text: state.file.text };
      var cfg = Object.assign({}, state.cfg);
      var prog = M.program(cfg, l).code;
      var expect = M.simulate(cfg, file, l);
      var r = realState[l] = { status: 'Preparing scores.txt…', out: '', err: '', report: null, done: false };
      var buttons = real.querySelectorAll('.lab-real-btns button');
      Array.prototype.forEach.call(buttons, function (b) { b.disabled = true; });
      paintReal(l);
      var setupErr = '';
      var hooks = function (onOut, onErr) {
        return {
          onBoot: function (msg) { r.boot = msg; paintReal(l); },
          onOut: onOut, onErr: onErr
        };
      };
      P1Runtime.run(l, M.HELPER[l], M.setupInput(file), hooks(function () {}, function (t) { setupErr += t; }))
        .then(function (res) {
          if (!res.ok) throw new Error('Could not prepare scores.txt\n' + setupErr);
          r.status = 'Running ' + (l === 'java' ? 'ScoreReport.java' : 'main.py') + '…';
          paintReal(l);
          return P1Runtime.run(l, prog, '', hooks(function (t) { r.out += t; }, function (t) { r.err += t; }));
        })
        .then(function () {
          var rep = '';
          return P1Runtime.run(l, M.HELPER[l], 'read\n', hooks(function (t) { rep += t; }, function () {}))
            .then(function () { r.report = rep === '\u0000missing' ? null : rep; });
        })
        .then(function () {
          r.done = true;
          var e = expect.out[l];
          var sameOut = r.out === e.stdout;
          var crashed = /Exception in thread|Traceback \(most recent call last\)/.test(r.err);
          var realExc = null;
          if (l === 'java') {
            var jm = /Exception in thread "[^"]*" ([\w.$]+)/.exec(r.err);
            if (jm) realExc = jm[1].split('.').pop();
          } else {
            var rows = r.err.replace(/\s+$/, '').split('\n');
            var pm = /^(\w+)(?::|$)/.exec(rows[rows.length - 1] || '');
            if (pm) realExc = pm[1];
          }
          var sameExc = crashed ? realExc === e.exception : !e.exception;
          var sameRep = r.report === expect.report;
          r.match = sameOut && sameExc && sameRep;
          r.status = '<span class="' + (crashed ? 'bad' : 'ok') + '">' + (crashed ? '✗ ended with an uncaught ' + esc(realExc || 'exception') : '✓ finished') + '</span>';
          var parts = [];
          parts.push((sameOut ? '✓' : '✗') + ' standard output');
          parts.push((sameExc ? '✓' : '✗') + ' ' + (crashed ? 'the same exception' : 'no crash'));
          parts.push((sameRep ? '✓' : '✗') + ' report.txt');
          r.verdict = (r.match ? '<strong>Matches the animation.</strong> ' : '<strong>Differs from the animation.</strong> ') + parts.join(' · ') +
            (crashed ? '<br><span class="lab-muted">' + (l === 'java'
              ? 'In the browser, a Java stack trace says <code>Unknown Source</code> where a real JDK gives a line number, such as <code>ScoreReport.java:5</code>.'
              : 'In the browser, the traceback leaves out the source line under each frame' +
                (realExc === 'FileNotFoundError' ? ', and a missing file is <code>[Errno 44]</code> where desktop Python says <code>[Errno 2]</code>' : '') + '.') + '</span>' : '');
        })
        .catch(function (err) {
          r.done = true; r.match = false;
          r.status = '<span class="bad">Could not run</span>';
          r.verdict = esc(String(err && err.message || err));
        })
        .then(function () {
          r.boot = null;
          Array.prototype.forEach.call(real.querySelectorAll('.lab-real-btns button'), function (b) { b.disabled = false; });
          paintReal(l);
        });
    }

    // ───────────── go ─────────────
    fileArea.value = state.file.text;
    changed();
    window.addEventListener('hashchange', function () {
      if (readHash()) { fileArea.value = state.file.text; changed(); }
    });
    // "Things to try" links on the page set the hash and jump to the lab
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[data-lab]');
      if (!a) return;
      ev.preventDefault();
      location.hash = a.getAttribute('href').replace(/^#/, '');
      host.scrollIntoView({ block: 'start', behavior: moving() ? 'smooth' : 'auto' });
    });
  }

  function init() {
    var host = document.getElementById('io-lab');
    if (host) mount(host);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
