/* 41039 Programming 1 — Week 11 diagram kinds (designing object-oriented programs).
 *
 * Registered with P1Visuals.register (assets/visuals.js); styles in assets/visuals-w11.css.
 * Every program a diagram shows is listed in its spec.programs, where
 * scripts/check_week_content.py runs it and compares the output shown here.
 *
 *   w11-nouns     mark the words of a problem description, then give each job to a class
 *                 (Information Expert); the finished design is the real example
 *   w11-calls     step through objects sending messages: who asks, who answers, the call stack
 *   w11-change    versions × change requests: a live line diff, the parts of the program that had
 *                 to be opened, and the real output of the changed program
 *   w11-swap      replace an implementation, predict, then compare its real output with the original
 *   w11-tangle    move responsibilities between classes until no class reaches into another's data
 *   w11-refactor  a refactoring, one step at a time: what changed, why, and the output check
 *
 * Diffs, "parts touched" and counts are computed from the program text in the browser, so a
 * label can never disagree with the code it describes.
 */
(function () {
  'use strict';
  if (!window.P1Visuals) return;
  var LANG = { java: 'Java', python: 'Python' };
  var H = P1Visuals.helpers;
  var el = H.el, esc = H.esc;

  // ───────────── shared helpers ─────────────
  function strip(src) { return String(src).replace(/\n+$/, ''); }
  function nb(line) { return line.replace(/^ +/, function (s) { return new Array(s.length + 1).join(' '); }); }

  /* the shell shows Java + Python badges; show the languages this diagram really uses */
  function setLangs(host, langs) {
    var box = host.querySelector('.viz-langs');
    if (!box) return;
    box.textContent = '';
    langs.filter(function (l, i) { return langs.indexOf(l) === i; })
      .forEach(function (l) { box.appendChild(el('span', 'lang ' + l, LANG[l])); });
  }

  function label(text, cls) { return el('span', 'viz-field-label' + (cls ? ' ' + cls : ''), text); }

  /* line diff (longest common subsequence); a replaced line shows as − then + */
  function diff(a, b) {
    var n = a.length, m = b.length, L = [], i, j;
    for (i = 0; i <= n; i++) { L.push([]); for (j = 0; j <= m; j++) L[i].push(0); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var ops = [];
    i = 0; j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && a[i] === b[j]) { ops.push({ t: 'same', a: i, b: j }); i++; j++; }
      else if (j < m && (i === n || L[i][j + 1] > L[i + 1][j])) { ops.push({ t: 'add', b: j }); j++; }
      else { ops.push({ t: 'del', a: i }); i++; }
    }
    return ops;
  }

  /* which top-level part (class, interface, function, main program) each line belongs to */
  function units(src, lang) {
    var cur = lang === 'python' ? 'main program' : '';
    return strip(src).split('\n').map(function (l) {
      var m = lang === 'java' ? /^(?:public\s+)?(?:abstract\s+|final\s+)?(?:class|interface)\s+(\w+)/.exec(l)
                              : /^(?:class|def)\s+(\w+)/.exec(l);
      if (m) cur = m[1];
      else if (lang === 'python' && /^\S/.test(l)) cur = 'main program';
      return l.trim() === '' ? null : cur;
    });
  }

  /* draw `after` into a code pane with the lines that differ from `before` marked; report the impact */
  function renderDiff(pre, before, after, lang) {
    var A = strip(before).split('\n'), B = strip(after).split('\n');
    var hA = H.highlight(strip(before), lang), hB = H.highlight(strip(after), lang);
    var uA = units(before, lang), uB = units(after, lang);
    var inA = {}, inB = {};
    uA.forEach(function (u) { if (u) inA[u] = true; });
    uB.forEach(function (u) { if (u) inB[u] = true; });
    var ops = diff(A, B), rows = [], added = 0, removed = 0, touched = {}, order = [];
    function touch(u, how) { if (!u) return; if (!touched[u]) order.push(u); if (!touched[u] || how === 'new') touched[u] = how; }
    ops.forEach(function (o) {
      if (o.t === 'same') rows.push('<div class="cl">' + nb(hB[o.b]) + '</div>');
      else if (o.t === 'add') {
        added++;
        touch(uB[o.b], inA[uB[o.b]] ? 'edited' : 'new');
        rows.push('<div class="cl w11-add"><span class="w11-sr">added: </span>' + nb(hB[o.b]) + '</div>');
      } else {
        removed++;
        touch(uA[o.a], inB[uA[o.a]] ? 'edited' : 'removed');
        rows.push('<div class="cl w11-del"><span class="w11-sr">removed: </span>' + nb(hA[o.a]) + '</div>');
      }
    });
    pre.innerHTML = rows.join('');
    var all = [];
    uB.forEach(function (u) { if (u && all.indexOf(u) < 0) all.push(u); });
    return { added: added, removed: removed, touched: touched, order: order,
             untouched: all.filter(function (u) { return !touched[u]; }) };
  }

  /* a code pane whose rows this file draws itself (diffs, several marked lines) */
  function pane(lang, labelText, withOut) {
    var root = el('div', 'viz-pane');
    var head = el('div', 'viz-pane-head');
    head.appendChild(el('span', 'lang ' + lang, LANG[lang]));
    var lab = el('span', 'viz-pane-label', labelText || '');
    head.appendChild(lab);
    root.appendChild(head);
    var pre = el('pre', 'explain-code viz-code');
    root.appendChild(pre);
    var outLab = null, out = null;
    if (withOut) {
      outLab = el('div', 'viz-out-label', 'Output (a real run)');
      out = el('pre', 'console-out viz-out');
      out.setAttribute('aria-label', LANG[lang] + ' output');
      root.appendChild(outLab);
      root.appendChild(out);
    }
    return { root: root, pre: pre, out: out, outLab: outLab, label: function (t) { lab.textContent = t; } };
  }

  function unitName(spec, u) { return (spec.unitLabels && spec.unitLabels[u]) || u; }
  function impactHtml(spec, r) {
    var h = '<span class="w11-stat"><span class="w11-plus">+' + r.added + '</span> <span class="w11-minus">−' + r.removed + '</span> lines</span>';
    r.order.forEach(function (u) {
      var how = r.touched[u];
      h += '<span class="w11-unit is-' + how + '">' + esc(unitName(spec, u)) + ' · ' + (how === 'new' ? 'new' : how === 'removed' ? 'removed' : 'edited') + '</span>';
    });
    r.untouched.forEach(function (u) { h += '<span class="w11-unit is-same">' + esc(unitName(spec, u)) + ' · untouched</span>'; });
    return h;
  }

  // ═════════════ w11-change: versions × change requests ═════════════
  P1Visuals.register('w11-change', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(host, [spec.lang]);
    var P = spec.programs, v = 0, c = -1, slip = false;

    var f1 = el('div', 'viz-form');
    f1.appendChild(label('Version:'));
    var vSeg = h.segmented('Version', spec.versions.map(function (x) { return { label: x.label }; }), function (n) { v = n; slip = false; draw(); });
    f1.appendChild(vSeg.root);
    var f2 = el('div', 'viz-form');
    f2.appendChild(label('Change request:'));
    var cSeg = h.segmented('Change request', [{ label: 'As it is now' }].concat(spec.changes.map(function (x) { return { label: x.label }; })),
      function (n) { c = n - 1; slip = false; draw(); });
    f2.appendChild(cSeg.root);
    body.appendChild(f1);
    body.appendChild(f2);

    var ask = el('p', 'w11-ask');
    body.appendChild(ask);
    var impact = el('div', 'w11-impact');
    impact.setAttribute('aria-live', 'polite');
    body.appendChild(impact);
    var slipBtn = el('button', 'viz-seg-btn viz-toggle w11-slip');
    slipBtn.type = 'button';
    slipBtn.setAttribute('aria-pressed', 'false');
    slipBtn.addEventListener('click', function () { slip = !slip; draw(); });
    body.appendChild(slipBtn);
    var p = pane(spec.lang, '', true);
    body.appendChild(p.root);
    var note = el('p', 'w11-note');
    body.appendChild(note);

    // the change log: which parts each request opened, in each version (computed from the code)
    var logBox = el('div', 'w11-log');
    var scratch = el('pre');
    var table = '<div class="tbl-scroll"><table class="tbl w11-logtbl"><caption>What each change request opened</caption><thead><tr><th scope="col">Change request</th>' +
      spec.versions.map(function (x) { return '<th scope="col">' + esc(x.label) + '</th>'; }).join('') + '</tr></thead><tbody>';
    spec.changes.forEach(function (ch, ci) {
      table += '<tr><th scope="row">' + esc(ch.label) + '</th>';
      spec.versions.forEach(function (ver, vi) {
        var cell = spec.cells[ver.id + ':' + ch.id];
        var r = renderDiff(scratch, P[cell.from !== undefined ? cell.from : ver.program].code, P[cell.program].code, spec.lang);
        table += '<td data-cell="' + vi + ':' + ci + '">' + r.order.map(function (u) { return esc(unitName(spec, u)) + (r.touched[u] === 'new' ? ' (new)' : ''); }).join(', ') +
          ' <span class="w11-muted">(' + (r.added + r.removed) + ' line' + (r.added + r.removed === 1 ? '' : 's') + ')</span></td>';
      });
      table += '</tr>';
    });
    table += '</tbody></table></div>';
    logBox.innerHTML = table + (spec.summary ? '<p class="w11-muted">' + spec.summary + '</p>' : '');
    body.appendChild(logBox);

    function draw() {
      var ver = spec.versions[v];
      var focused = document.activeElement;
      if (c < 0) {
        var base = P[ver.program];
        renderDiff(p.pre, base.code, base.code, spec.lang);
        p.label('today: ' + ver.label);
        p.out.textContent = strip(base.output);
        ask.innerHTML = 'This is the program today. Pick a change request above and see what has to be edited.';
        impact.innerHTML = '';
        note.innerHTML = '';
        slipBtn.hidden = true;
      } else {
        var ch = spec.changes[c], cell = spec.cells[ver.id + ':' + ch.id];
        var useSlip = slip && cell.slip;
        var prog = P[useSlip ? cell.slip.program : cell.program];
        var from = cell.from !== undefined ? cell.from : ver.program;
        var r = renderDiff(p.pre, P[from].code, prog.code, spec.lang);
        p.label(cell.from !== undefined ? 'changes since the previous request' : 'changes from today\'s program');
        p.out.textContent = strip(prog.output);
        ask.innerHTML = '<span class="w11-tag">Request</span> ' + ch.ask;
        impact.innerHTML = impactHtml(spec, r);
        note.innerHTML = useSlip ? cell.slip.note : cell.note;
        slipBtn.hidden = !cell.slip;
        if (cell.slip) {
          slipBtn.textContent = useSlip ? 'Show the complete change' : cell.slip.label;
          slipBtn.setAttribute('aria-pressed', String(!!useSlip));
        }
        note.classList.toggle('is-bad', !!useSlip);
      }
      Array.prototype.forEach.call(logBox.querySelectorAll('td'), function (td) {
        td.classList.toggle('is-now', td.getAttribute('data-cell') === v + ':' + c);
      });
      if (focused === slipBtn && slipBtn.hidden) cSeg.buttons[c + 1].focus();
    }
    vSeg.pick(0);
    cSeg.pick(0);
    draw();
  });

  // ═════════════ w11-calls: objects sending messages ═════════════
  P1Visuals.register('w11-calls', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(host, spec.runs.map(function (r) { return spec.programs[r.program].lang; }));
    var picker = null;
    if (spec.runs.length > 1) {
      picker = h.segmented('Choose a program', spec.runs.map(function (r) { return { label: r.label }; }), choose);
      body.appendChild(picker.root);
    }
    var stage = el('div', 'viz-stage w11-calls-stage');
    var msg = el('div', 'w11-msg');
    var grid = el('div', 'w11-calls-grid');
    var cards = el('div', 'w11-cards');
    var stackBox = el('div', 'w11-stack');
    stackBox.appendChild(el('div', 'w11-stack-head', 'Call stack'));
    var stackList = el('ol', 'w11-stack-list');
    stackBox.appendChild(stackList);
    grid.appendChild(cards);
    grid.appendChild(stackBox);
    stage.appendChild(msg);
    stage.appendChild(grid);
    body.appendChild(stage);
    var paneBox = el('div', 'w11-onepane');
    var cp = null, run = null, outLines = [];

    function nameOf(o) { return o ? (o.name || o.cls) : '?'; }
    function make(it) {
      var c = el('div', 'w11-card');
      var head = el('div', 'w11-card-head');
      head.appendChild(el('span', 'w11-card-name'));
      head.appendChild(el('span', 'w11-card-cls'));
      c.appendChild(head);
      c.appendChild(el('div', 'w11-card-fields'));
      c.appendChild(el('div', 'w11-card-role'));
      return c;
    }
    var ROLE = { asking: 'asks', working: 'working', answering: 'answers', receiving: 'gets the answer' };
    function update(c, it) {
      c.querySelector('.w11-card-name').textContent = it.name || it.cls;
      var cls = c.querySelector('.w11-card-cls');
      cls.textContent = it.name && it.name !== it.cls ? it.cls : '';
      var keys = Object.keys(it.fields);
      c.querySelector('.w11-card-fields').innerHTML = keys.length
        ? keys.map(function (k) {
            return '<div class="w11-f' + (it.changed[k] ? ' is-changed' : '') + '"><span class="k">' + esc(k) + '</span><span class="v">' + esc(it.fields[k]) + '</span></div>';
          }).join('')
        : '<div class="w11-f w11-muted">' + (/main/.test(it.cls) ? 'no variables yet' : '') + '</div>';
      c.dataset.role = it.role || '';
      c.querySelector('.w11-card-role').textContent = ROLE[it.role] || '';
      c.setAttribute('aria-label', (it.name || it.cls) + (it.role ? ', ' + ROLE[it.role] : '') + ': ' +
        keys.map(function (k) { return k + ' ' + it.fields[k]; }).join(', '));
    }

    var st = h.stepper(host, function (f) {
      H.flip(cards, f.objs, make, update);
      msg.innerHTML = f.msg;
      stackList.innerHTML = f.stack.map(function (s, i) {
        return '<li' + (i === f.stack.length - 1 ? ' class="is-top"' : '') + '>' + esc(s) + '</li>';
      }).join('');
      cp.mark(f.line);
      cp.setOut(outLines.slice(0, f.printed).join('\n'));
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(paneBox);

    function choose(n) {
      run = spec.runs[n];
      var prog = spec.programs[run.program];
      outLines = strip(prog.output).split('\n');
      cp = h.codePane(prog.lang, prog.code, { output: true });
      paneBox.textContent = '';
      paneBox.appendChild(cp.root);
      cards.textContent = '';
      cards._drawn = false;
      // replay the steps: the state at step n is everything applied up to n
      var objs = [], byId = {}, printed = 0, frames = [];
      function add(o) { var c = { id: o.id, cls: o.cls, name: o.name, fields: {} }; for (var k in o.fields) c.fields[k] = o.fields[k]; objs.push(c); byId[o.id] = c; }
      (run.objects || []).forEach(add);
      run.steps.forEach(function (s) {
        var changed = {};
        if (s['new']) { add(s['new']); }
        if (s.set) Object.keys(s.set).forEach(function (id) {
          var o = byId[id];
          changed[id] = {};
          Object.keys(s.set[id]).forEach(function (k) { o.fields[k] = s.set[id][k]; changed[id][k] = true; });
        });
        if (s.print) printed++;
        var role = {};
        var lines = [];
        if (s['new'] && !s.call) lines.push('<span class="w11-new">new</span> <code>' + esc(s['new'].cls) + '</code> → <span class="w11-who">' + esc(nameOf(byId[s['new'].id])) + '</span>');
        if (s.call) {
          role[s.call[0]] = 'asking'; role[s.call[1]] = 'working';
          lines.push('<span class="w11-who">' + esc(nameOf(byId[s.call[0]])) + '</span><span class="w11-arrow" aria-label="sends to">→</span><span class="w11-who">' +
            esc(nameOf(byId[s.call[1]])) + '</span><code>' + esc(s.call[2]) + '</code>');
        }
        if (s.ret) {
          if (!s.call) { role[s.ret[0]] = 'answering'; role[s.ret[1]] = 'receiving'; }
          lines.push('<span class="w11-who">' + esc(nameOf(byId[s.ret[1]])) + '</span><span class="w11-arrow is-back" aria-label="receives from">←</span><span class="w11-who">' +
            esc(nameOf(byId[s.ret[0]])) + '</span><span class="w11-ret">returns <code>' + esc(s.ret[2]) + '</code></span>');
        }
        if (s.print) lines.push('<span class="w11-who">output</span><span class="w11-arrow">→</span><span>prints <code>' + esc(outLines[printed - 1] || '') + '</code></span>');
        if (!lines.length) lines.push('<span class="w11-muted">No message: this line works inside one object.</span>');
        frames.push({
          objs: objs.map(function (o) {
            var f = {}; for (var k in o.fields) f[k] = o.fields[k];
            return { k: o.id, id: o.id, cls: o.cls, name: o.name, fields: f, changed: changed[o.id] || {}, role: role[o.id] || '' };
          }),
          msg: lines.map(function (l) { return '<div class="w11-msg-line">' + l + '</div>'; }).join(''),
          stack: s.stack || [], line: cp.line(s.at), printed: printed, say: s.say
        });
      });
      st.set(frames);
    }
    if (picker) picker.pick(0);
    choose(0);
  });

  // ═════════════ w11-swap: replace an implementation, predict, compare ═════════════
  P1Visuals.register('w11-swap', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(host, spec.cases.map(function (c) { return c.lang; }));
    var P = spec.programs, ci = 0, vi = 0;
    var caseSeg = h.segmented('Choose a caller', spec.cases.map(function (c) { return { label: c.label }; }), function (n) { ci = n; vi = 0; build(); });
    body.appendChild(caseSeg.root);
    var relies = el('p', 'w11-ask');
    body.appendChild(relies);
    var vForm = el('div', 'viz-form');
    body.appendChild(vForm);
    var p = pane('java', '', false);
    body.appendChild(p.root);
    var pForm = el('div', 'viz-form w11-predict');
    pForm.appendChild(label('Your prediction:'));
    var predSeg = h.segmented('Your prediction', [{ label: 'Same output as the original' }, { label: 'Different output' }], reveal);
    pForm.appendChild(predSeg.root);
    body.appendChild(pForm);
    var result = el('div', 'w11-result');
    result.setAttribute('aria-live', 'polite');
    body.appendChild(result);
    var vSeg = null;

    function build() {
      var cs = spec.cases[ci];
      relies.innerHTML = '<span class="w11-tag">The promise</span> ' + cs.relies;
      vForm.textContent = '';
      vForm.appendChild(label('Replace it with:'));
      vSeg = h.segmented('Replacement', cs.variants.map(function (x) { return { label: x.label, mono: true }; }), function (n) { vi = n; draw(); });
      vForm.appendChild(vSeg.root);
      vSeg.pick(vi);
      draw();
    }
    function draw() {
      var cs = spec.cases[ci], vr = cs.variants[vi], ref = P[cs.reference], prog = P[vr.program];
      var newPane = pane(cs.lang, '', false);
      p.root.replaceWith(newPane.root);
      p = newPane;
      var r = renderDiff(p.pre, ref.code, prog.code, cs.lang);
      p.label(vr.program === cs.reference ? 'the original (the example on this page)' : 'differences from the original: +' + r.added + ' −' + r.removed);
      predSeg.buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      result.innerHTML = '<p class="w11-muted">' + (cs.lang === 'java' ? 'It compiles.' : 'It runs without an error.') +
        ' Will the caller see the same output as with the original? Predict first.</p>';
    }
    function reveal(choice) {
      var cs = spec.cases[ci], vr = cs.variants[vi], ref = P[cs.reference], prog = P[vr.program];
      var a = strip(ref.output).split('\n'), b = strip(prog.output).split('\n');
      var same = a.length === b.length && a.every(function (x, i) { return x === b[i]; });
      var right = (choice === 0) === same;
      var rows = '';
      for (var i = 0; i < Math.max(a.length, b.length); i++) {
        var ok = a[i] === b[i];
        rows += '<tr class="' + (ok ? 'is-ok' : 'is-bad') + '"><td class="mono">' + esc(a[i] === undefined ? '(nothing)' : a[i]) + '</td><td class="mono">' +
          esc(b[i] === undefined ? '(nothing)' : b[i]) + '</td><td>' + (ok ? '✓ same' : '✗ differs') + '</td></tr>';
      }
      result.innerHTML =
        '<p class="w11-verdict ' + (right ? 'viz-good' : 'viz-bad') + '">' + (right ? '✓ Your prediction was right.' : '✗ Not this time.') + '</p>' +
        '<p class="viz-big ' + (same ? 'viz-good' : 'viz-bad') + '">' + (same ? 'Keeps the promise: identical output' : 'Breaks the promise: the caller sees different output') + '</p>' +
        '<div class="tbl-scroll"><table class="tbl w11-cmp"><thead><tr><th scope="col">With the original</th><th scope="col">With ' + esc(vr.label) +
        '</th><th scope="col">Compared</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<p>' + vr.why + '</p>' +
        (same ? '' : '<p class="w11-muted">' + (cs.lang === 'java' ? 'The compiler accepted it, because the method signatures match. ' : 'Python ran it, because it has a <code>send</code> method. ') +
          'Neither can check the promise about behaviour: that is the substitution principle\'s job, and your tests\'.</p>');
    }
    caseSeg.pick(0);
    build();
  });

  // ═════════════ w11-nouns: words → classes, then jobs → experts ═════════════
  P1Visuals.register('w11-nouns', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(host, ['java']);
    var roleOf = {}, brush = spec.roles[0].id, ROLE = {};
    spec.roles.forEach(function (r) { ROLE[r.id] = r.label; });

    body.appendChild(el('h4', 'w11-h', 'Step 1 · Mark the words'));
    var f = el('div', 'viz-form');
    f.appendChild(label('Mark as:'));
    var bSeg = h.segmented('Mark words as', spec.roles.map(function (r) { return { label: r.label }; }), function (n) { brush = spec.roles[n].id; });
    f.appendChild(bSeg.root);
    body.appendChild(f);
    var text = el('p', 'w11-text');
    var words = {};
    spec.text.forEach(function (t) {
      if (typeof t === 'string') { text.appendChild(document.createTextNode(t)); return; }
      var b = el('button', 'w11-word');
      b.type = 'button';
      b.appendChild(el('span', 'w', t.w));
      b.appendChild(el('span', 'r'));
      b.addEventListener('click', function () {
        roleOf[t.id] = roleOf[t.id] === brush ? undefined : brush;
        paintWord(t.id);
        checkBox.innerHTML = '';
      });
      words[t.id] = { btn: b, w: t.w };
      text.appendChild(b);
    });
    body.appendChild(text);
    function paintWord(id) {
      var b = words[id].btn, r = roleOf[id];
      b.dataset.role = r || '';
      b.lastChild.textContent = r ? ROLE[r].split(' ')[0].toLowerCase() : '';
      b.setAttribute('aria-label', words[id].w + (r ? ', marked ' + ROLE[r] : ', not marked'));
    }
    Object.keys(words).forEach(paintWord);
    var ops = el('div', 'viz-ops');
    var bCheck = h.button('Check my marks', 'primary');
    var bShow = h.button('Show the answers', 'ghost');
    var bClear = h.button('Clear', 'ghost');
    [bCheck, bShow, bClear].forEach(function (b) { ops.appendChild(b); });
    body.appendChild(ops);
    var checkBox = el('div', 'w11-result');
    checkBox.setAttribute('aria-live', 'polite');
    body.appendChild(checkBox);
    function check() {
      var right = 0, items = '';
      Object.keys(words).forEach(function (id) {
        var a = spec.answers[id], r = roleOf[id];
        var ok = r === a.role, also = !ok && a.also && a.also.indexOf(r) >= 0;
        if (ok) right++;
        items += '<li class="' + (ok ? 'is-ok' : also ? 'is-maybe' : 'is-bad') + '"><strong>' + esc(words[id].w) + '</strong> · ' +
          (ok ? '✓ ' + esc(ROLE[a.role]) : also ? '≈ ' + esc(ROLE[r]) + ' is possible; better: ' + esc(ROLE[a.role]) :
            (r ? '✗ not ' + esc(ROLE[r]) + '; ' : '✗ not marked; ') + 'answer: ' + esc(ROLE[a.role])) + '. ' + a.why + '</li>';
      });
      checkBox.innerHTML = '<p class="viz-big">' + right + ' of ' + Object.keys(words).length + ' as suggested</p><ul class="w11-checks">' + items + '</ul>' +
        '<p class="w11-muted">Word lists are a starting point, not a rule: the design decides what each word becomes.</p>';
    }
    bCheck.addEventListener('click', check);
    bShow.addEventListener('click', function () { Object.keys(words).forEach(function (id) { roleOf[id] = spec.answers[id].role; paintWord(id); }); check(); });
    bClear.addEventListener('click', function () { roleOf = {}; Object.keys(words).forEach(paintWord); checkBox.innerHTML = ''; });

    // step 2: jobs → classes
    body.appendChild(el('h4', 'w11-h', 'Step 2 · Give each job to the class that has the information'));
    var classBox = el('div', 'w11-classes');
    var classEls = {};
    spec.classes.forEach(function (c) {
      var card = el('div', 'w11-class');
      card.appendChild(el('div', 'w11-class-name', c.label));
      var k = el('div', 'w11-class-knows');
      k.innerHTML = '<span>knows:</span> ' + esc(c.knows);
      card.appendChild(k);
      var m = el('div', 'w11-class-methods');
      card.appendChild(m);
      classEls[c.id] = m;
      classBox.appendChild(card);
    });
    body.appendChild(classBox);
    var owner = {};
    var dutyBox = el('div', 'w11-duties');
    var prog = spec.programs[0];
    var cp = h.codePane(prog.lang, prog.code, { output: true, label: 'the example below' });
    var done = el('p', 'w11-done');
    done.setAttribute('aria-live', 'polite');
    spec.duties.forEach(function (d) {
      var row = el('div', 'w11-duty');
      row.appendChild(el('span', 'w11-duty-label', d.label));
      var fb = el('p', 'w11-duty-fb');
      var seg = h.segmented('Who should ' + d.label + '?', spec.classes.map(function (c) { return { label: c.label }; }), function (n) {
        owner[d.id] = spec.classes[n].id;
        var ok = owner[d.id] === d.owner;
        fb.className = 'w11-duty-fb ' + (ok ? 'viz-good' : 'viz-bad');
        fb.innerHTML = (ok ? '✓ ' : '✗ ') + d.why[owner[d.id]];
        row.dataset.state = ok ? 'ok' : 'bad';
        drawJobs();
      });
      row.appendChild(seg.root);
      row.appendChild(fb);
      dutyBox.appendChild(row);
    });
    body.appendChild(dutyBox);
    body.appendChild(done);
    body.appendChild(cp.root);
    function drawJobs() {
      Object.keys(classEls).forEach(function (id) {
        var mine = spec.duties.filter(function (d) { return owner[d.id] === id; });
        classEls[id].innerHTML = mine.length ? mine.map(function (d) {
          return '<code class="' + (d.owner === id ? 'is-ok' : 'is-bad') + '">' + esc(d.method) + '</code>';
        }).join(' ') : '<span class="w11-muted">no jobs yet</span>';
      });
      var rows = cp.root.querySelectorAll('.viz-code .cl'), right = 0;
      Array.prototype.forEach.call(rows, function (r) { r.classList.remove('w11-hit'); });
      spec.duties.forEach(function (d) {
        if (owner[d.id] !== d.owner) return;
        right++;
        var n = cp.line(d.token);
        if (n && rows[n - 1]) rows[n - 1].classList.add('w11-hit');
      });
      var all = right === spec.duties.length;
      done.innerHTML = all ? '✓ Every job sits with the class that has its information. That is exactly the example below; its output is a real run.'
                           : right + ' of ' + spec.duties.length + ' jobs placed well. The lines for those jobs are marked in the code.';
      done.classList.toggle('viz-good', all);
      cp.setOut(all ? strip(prog.output) : '');
    }
    bSeg.pick(0);
    drawJobs();
  });

  // ═════════════ w11-tangle: move responsibilities until nothing reaches across ═════════════
  P1Visuals.register('w11-tangle', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(host, ['java']);
    var place = {}, sel = null, NS = 'http://www.w3.org/2000/svg';
    var byId = {}, idx = {};
    spec.classes.forEach(function (c, i) { byId[c.id] = c; idx[c.id] = i; });
    function reset() { spec.duties.forEach(function (d) { place[d.id] = d.start; }); sel = null; }
    reset();

    var stage = el('div', 'viz-stage w11-tangle-stage');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 480 170');
    svg.setAttribute('class', 'w11-graph');
    svg.setAttribute('aria-hidden', 'true');
    stage.appendChild(svg);
    var score = el('div', 'w11-score');
    score.setAttribute('aria-live', 'polite');
    stage.appendChild(score);
    var arrows = el('ul', 'w11-arrows');
    stage.appendChild(arrows);
    body.appendChild(stage);

    var cols = el('div', 'w11-tcols');
    var colEls = {};
    spec.classes.forEach(function (c) {
      var col = el('div', 'w11-tcol');
      var head = el('div', 'w11-tcol-head');
      head.appendChild(el('span', 'w11-class-name', c.label));
      head.appendChild(el('span', 'w11-class-knows', 'owns ' + c.owns));
      col.appendChild(head);
      var badge = el('span', 'w11-coh');
      col.appendChild(badge);
      var list = el('div', 'w11-chips');
      col.appendChild(list);
      var move = h.button('Move here', 'ghost');
      move.addEventListener('click', function () { moveTo(c.id); });
      col.appendChild(move);
      colEls[c.id] = { list: list, badge: badge };
      cols.appendChild(col);
    });
    body.appendChild(cols);
    var fb = el('p', 'w11-duty-fb');
    fb.setAttribute('aria-live', 'polite');
    body.appendChild(fb);
    var ops = el('div', 'viz-ops');
    var bReset = h.button('Start again', 'ghost');
    var bSolve = h.button('Show me', 'ghost');
    ops.appendChild(bReset); ops.appendChild(bSolve);
    body.appendChild(ops);
    var solved = el('div', 'w11-solved');
    body.appendChild(solved);
    bReset.addEventListener('click', function () { reset(); fb.textContent = ''; draw(); });
    bSolve.addEventListener('click', function () { spec.duties.forEach(function (d) { place[d.id] = d.home; }); sel = null; fb.textContent = ''; draw(); });

    function moveTo(cid) {
      if (!sel) { fb.className = 'w11-duty-fb w11-muted'; fb.textContent = 'Select a job first: press one of the job buttons.'; return; }
      var d = spec.duties.filter(function (x) { return x.id === sel; })[0];
      place[d.id] = cid;
      sel = null;
      var ok = cid === d.home;
      fb.className = 'w11-duty-fb ' + (ok ? 'viz-good' : 'viz-bad');
      fb.innerHTML = ok ? '✓ “' + esc(d.label) + '” now sits in ' + esc(byId[cid].label) + '. ' + d.why
                        : '✗ In ' + esc(byId[cid].label) + ', “' + esc(d.label) + '” still needs ' + esc(d.needs) + ' from ' + esc(byId[d.home].label) + '.';
      draw();
    }
    function chip(d) {
      var b = el('button', 'w11-chip', d.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(sel === d.id));
      b.dataset.ok = place[d.id] === d.home ? 'yes' : 'no';
      b.addEventListener('click', function () {
        sel = sel === d.id ? null : d.id;
        Array.prototype.forEach.call(cols.querySelectorAll('.w11-chip'), function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', String(sel === d.id));
        fb.className = 'w11-duty-fb w11-muted';
        fb.textContent = sel ? 'Now press “Move here” on the class that should own this job.' : '';
      });
      return b;
    }
    var X = [70, 240, 410], Y = 85, W = 128, HT = 46;
    function svgEl(tag, attrs, text) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (text !== undefined) n.textContent = text;
      return n;
    }
    function draw() {
      // red arrows: a job sitting in X whose home is Y means X depends on Y's details
      var red = {};
      spec.duties.forEach(function (d) {
        if (place[d.id] === d.home) return;
        var key = place[d.id] + '>' + d.home;
        (red[key] = red[key] || []).push(d);
      });
      svg.textContent = '';
      var defs = svgEl('defs', {});
      ['ok', 'bad'].forEach(function (k) {
        var m = svgEl('marker', { id: host.id + '-m-' + k, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' });
        m.appendChild(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', 'class': 'w11-head-' + k }));
        defs.appendChild(m);
      });
      svg.appendChild(defs);
      spec.needed.forEach(function (n) {
        var a = idx[n[0]], b = idx[n[1]];
        svg.appendChild(svgEl('line', { x1: X[a] + W / 2, y1: Y, x2: X[b] - W / 2 - 2, y2: Y, 'class': 'w11-edge-ok', 'marker-end': 'url(#' + host.id + '-m-ok)' }));
      });
      Object.keys(red).forEach(function (key) {
        var ab = key.split('>'), a = idx[ab[0]], b = idx[ab[1]];
        var up = a < b, dy = up ? -1 : 1, span = Math.abs(a - b);
        var x1 = X[a] + (up ? 20 : -20), x2 = X[b] + (up ? -20 : 20);
        var y1 = Y + dy * HT / 2, y2 = y1, cy = Y + dy * (HT / 2 + 30 + 18 * (span - 1));
        svg.appendChild(svgEl('path', { d: 'M' + x1 + ',' + y1 + ' C' + x1 + ',' + cy + ' ' + x2 + ',' + cy + ' ' + x2 + ',' + y2,
          'class': 'w11-edge-bad', 'stroke-width': String(1.5 + red[key].length), 'marker-end': 'url(#' + host.id + '-m-bad)' }));
        var mx = (x1 + x2) / 2, my = Y + dy * (HT / 2 + 22 + 13.5 * (span - 1));
        svg.appendChild(svgEl('circle', { cx: mx, cy: my, r: 9, 'class': 'w11-edge-count' }));
        svg.appendChild(svgEl('text', { x: mx, y: my + 4, 'class': 'w11-edge-num', 'text-anchor': 'middle' }, String(red[key].length)));
      });
      spec.classes.forEach(function (c, i) {
        var bad = spec.duties.some(function (d) { return place[d.id] === c.id && d.home !== c.id; });
        svg.appendChild(svgEl('rect', { x: X[i] - W / 2, y: Y - HT / 2, width: W, height: HT, rx: 9, 'class': 'w11-node' + (bad ? ' is-mixed' : '') }));
        svg.appendChild(svgEl('text', { x: X[i], y: Y + 5, 'text-anchor': 'middle', 'class': 'w11-node-text' }, c.label));
      });
      var keys = Object.keys(red), wrong = spec.duties.filter(function (d) { return place[d.id] !== d.home; }).length;
      arrows.innerHTML = spec.needed.map(function (n) {
        return '<li class="is-ok">' + esc(byId[n[0]].label) + ' → ' + esc(byId[n[1]].label) + ': calls <code>' + esc(n[2]) + '</code> (needed)</li>';
      }).join('') + keys.map(function (k) {
        var ab = k.split('>');
        return '<li class="is-bad">' + esc(byId[ab[0]].label) + ' → ' + esc(byId[ab[1]].label) + ': ' +
          red[k].map(function (d) { return 'needs ' + esc(d.needs); }).join('; ') + '</li>';
      }).join('');
      score.innerHTML = wrong ? '<span class="w11-tangled">Tangled:</span> ' + keys.length + ' red arrow' + (keys.length === 1 ? '' : 's') + ', ' + wrong + ' of ' + spec.duties.length + ' jobs in the wrong class'
                              : '<span class="viz-good">✓ Untangled.</span> Only the two calls the program needs are left: high cohesion, low coupling.';
      spec.classes.forEach(function (c) {
        var mine = spec.duties.filter(function (d) { return place[d.id] === c.id; });
        var foreign = mine.filter(function (d) { return d.home !== c.id; }).length;
        var ce = colEls[c.id];
        ce.list.textContent = '';
        if (!mine.length) ce.list.appendChild(el('span', 'w11-muted', 'no jobs'));
        mine.forEach(function (d) { ce.list.appendChild(chip(d)); });
        ce.badge.className = 'w11-coh ' + (foreign ? 'is-mixed' : 'is-focused');
        ce.badge.textContent = foreign ? 'mixed: ' + foreign + ' misplaced' : (mine.length ? 'focused' : 'empty');
      });
      drawSolved(!wrong);
    }
    var solvedPane = null, solvedPick = 0;
    function drawSolved(on) {
      if (!on) { solved.textContent = ''; solvedPane = null; return; }
      if (solvedPane) return;
      var prog = spec.programs[0];
      solved.innerHTML = '<h4 class="w11-h">The untangled design is the example below</h4><p class="w11-muted">Pick a class to see its code and who calls it.</p>';
      var seg = h.segmented('Show a class', spec.classes.map(function (c) { return { label: c.label }; }), function (n) { solvedPick = n; show(); });
      solved.appendChild(seg.root);
      var who = el('p', 'w11-ask');
      solved.appendChild(who);
      solvedPane = h.codePane(prog.lang, prog.code, { output: true });
      solvedPane.setOut(strip(prog.output));
      solved.appendChild(solvedPane.root);
      var u = units(prog.code, prog.lang);
      function show() {
        var c = spec.classes[solvedPick];
        who.innerHTML = '<span class="w11-tag">' + esc(c.label) + '</span> ' + c.calledBy;
        Array.prototype.forEach.call(solvedPane.root.querySelectorAll('.viz-code .cl'), function (r, i) { r.classList.toggle('w11-hit', u[i] === c.unit); });
      }
      seg.pick(solvedPick);
      show();
    }
    if (!host.id) host.id = 'w11-tangle-' + Math.random().toString(36).slice(2, 8);
    draw();
  });

  // ═════════════ w11-refactor: one move at a time, behaviour unchanged ═════════════
  P1Visuals.register('w11-refactor', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(host, [spec.lang]);
    var P = spec.programs;
    var head = el('div', 'w11-rhead');
    var title = el('h4', 'w11-h');
    var tag = el('span', 'w11-tag');
    head.appendChild(title);
    head.appendChild(tag);
    body.appendChild(head);
    var metrics = el('div', 'viz-vars w11-metrics');
    body.appendChild(metrics);
    var check = el('p', 'w11-check');
    function count(m, src) {
      if (m.token) return src.split(m.token).length - 1;
      return (src.match(new RegExp(m.pattern, 'gm')) || []).length;
    }
    var p = pane(spec.lang, '', true);
    var st = h.stepper(host, function (f) {
      var s = spec.steps[f.i], prog = P[s.program];
      var prev = f.i ? P[spec.steps[f.i - 1].program] : prog;
      title.textContent = 'Step ' + f.i + ': ' + s.title;
      tag.textContent = s.tag;
      var r = renderDiff(p.pre, prev.code, prog.code, spec.lang);
      p.label(f.i === 0 ? 'the starting program' : (r.added + r.removed ? 'changes in this step: +' + r.added + ' −' + r.removed : 'no change in this step'));
      metrics.innerHTML = spec.metrics.map(function (m) {
        var now = count(m, prog.code), was = count(m, prev.code);
        return '<span' + (now !== was ? ' class="is-changed"' : '') + '>' + esc(m.label) + ': ' + (f.i && now !== was ? was + ' → ' : '') + now + '</span>';
      }).join('');
      p.out.textContent = strip(prog.output);
      var same = strip(prog.output) === strip(P[spec.steps[0].program].output);
      check.className = 'w11-check ' + (same ? 'viz-good' : 'viz-bad');
      check.textContent = same ? '✓ Same output as the starting program (real runs of both)' : '✗ The output changed: this would not be a refactoring';
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(check);
    body.appendChild(p.root);
    st.set(spec.steps.map(function (s, i) { return { i: i, say: s.why }; }));
  });
})();
