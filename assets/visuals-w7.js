/* 41039 Programming 1 — Week 7's own diagram kinds (loaded after assets/visuals.js).
 *
 *   grow      a hand-built GrowList: watch size and capacity, and the copy into a bigger array
 *   overload  remove(int index) or remove(Object o)? predict which one Java picks, then see it
 *   access    ArrayList beside LinkedList: count the elements each one touches for get(i),
 *             a for-each loop and taking from the front
 *   pair      step through Pair<A, B>, with A and B filled in for the object in use
 *
 * Every program shown is in spec.programs, which scripts/check_week_content.py runs; printed
 * text is always cut from that real output. A spec may also name `after`: the title of an
 * explained example, and the diagram is then moved to sit right after that example, so a
 * diagram is read next to the code it steps through (without JavaScript it stays with the
 * section's other diagrams).
 */
(function () {
  'use strict';
  if (!window.P1Visuals) return;
  var V = window.P1Visuals;
  var LANG = { java: 'Java', python: 'Python' };

  // ───────────── move a diagram next to the example it covers (before diagrams mount) ─────────────
  function relocate() {
    var examples = document.querySelectorAll('.p1-explain');
    document.querySelectorAll('.p1-viz').forEach(function (host) {
      var node = host.querySelector('script[data-role="spec"]');
      if (!node) return;
      var after;
      try { after = JSON.parse(node.textContent).after; } catch (err) { return; }
      if (!after) return;
      var target = null;
      examples.forEach(function (e) { if (!target && e.dataset.title === after) target = e; });
      if (!target) { console.warn('P1Visuals w7: no example titled', after); return; }
      // a deliberate compile error is followed by its "two compilers" note: keep them together
      var next = target.nextElementSibling;
      if (next && next.classList.contains('note') && next.classList.contains('warn')) target = next;
      target.parentNode.insertBefore(host, target.nextSibling);
    });
  }
  relocate();

  // ───────────── small shared bits ─────────────
  function program(spec, lang, id) {
    return spec.programs.filter(function (p) { return p.lang === lang && (id === undefined || p.id === id); })[0];
  }
  function upTo(output, n) {
    return n ? output.replace(/\n$/, '').split('\n').slice(0, n).join('\n') : '';
  }
  function setLangs(host, langs) {
    var box = host.querySelector('.viz-langs');
    if (!box) return;
    box.textContent = '';
    langs.forEach(function (l) {
      var s = document.createElement('span');
      s.className = 'lang ' + l;
      s.textContent = LANG[l];
      box.appendChild(s);
    });
  }
  // on a phone a row can be wider than the stage: scroll the stage so `node` is in view
  function keepInView(stage, node) {
    if (!node) return;
    var r = node.getBoundingClientRect(), g = stage.getBoundingClientRect();
    if (r.right > g.right - 8) stage.scrollLeft += r.right - g.right + 24;
    else if (r.left < g.left + 8) stage.scrollLeft -= g.left - r.left + 24;
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  // a button that is about to be removed or disabled must not drop focus to <body>
  function keepFocus(host, fallback) {
    if (!host.contains(document.activeElement) || document.activeElement === document.body) {
      if (fallback && !fallback.disabled) fallback.focus();
    }
  }

  // ═════════════ grow: size versus capacity in a hand-built GrowList ═════════════
  V.register('grow', function (host, spec, h) {
    var body = h.shell(host, spec);
    var stage = h.el('div', 'viz-stage w7-grow');
    var itemsBox = h.el('div', 'w7-arr');
    var otherBox = h.el('div', 'w7-arr');
    var vars = h.el('div', 'viz-vars');
    stage.appendChild(itemsBox);
    stage.appendChild(otherBox);
    stage.appendChild(vars);
    body.appendChild(stage);
    var pj = program(spec, 'java'), pp = program(spec, 'python');
    var java = h.codePane('java', pj.code, { output: true });
    var py = h.codePane('python', pp.code, { output: true });
    function lines(role, v) {
      var tj = spec.lines.java[role], tp = spec.lines.python[role];
      if (v !== undefined) { tj = tj.replace('{v}', v); tp = tp.replace('{v}', v); }
      return { java: java.line(tj), python: py.line(tp) };
    }
    var NONE = { java: 0, python: 0 };

    function drawArr(box, label, arr, size, marks, faded) {
      box.hidden = !arr;
      if (!arr) return;
      box.textContent = '';
      box.classList.toggle('is-old', !!faded);
      box.appendChild(h.el('div', 'viz-track-name', label));
      var row = h.el('div', 'w7-slots');
      arr.forEach(function (v, i) {
        var c = h.el('div', 'w7-slot');
        c.appendChild(h.el('span', 'v', v === null ? 'empty' : v));
        c.appendChild(h.el('span', 'i', String(i)));
        if (v === null) c.classList.add('is-empty');
        if (marks && marks[i]) c.dataset.mark = marks[i];
        row.appendChild(c);
      });
      row.setAttribute('role', 'img');
      row.setAttribute('aria-label', label + ': ' + arr.length + ' slots, holding ' +
        (arr.filter(function (v) { return v !== null; }).join(', ') || 'nothing'));
      box.appendChild(row);
      if (size !== null) {
        // two brackets under the slots: the elements (size) and the whole array (capacity)
        var m = h.el('div', 'w7-measure');
        m.setAttribute('aria-hidden', 'true');
        var sz = h.el('span', 'w7-size', 'size ' + size);
        sz.style.setProperty('--n', size);
        sz.hidden = !size;
        var cp = h.el('span', 'w7-cap', 'capacity ' + arr.length);
        cp.style.setProperty('--n', arr.length);
        m.appendChild(sz);
        m.appendChild(cp);
        box.appendChild(m);
      }
    }

    var st = h.stepper(host, function (f) {
      drawArr(itemsBox, 'items (the array inside the list)', f.items, f.size, f.marks);
      drawArr(otherBox, f.otherLabel, f.other, null, f.omarks, f.old);
      vars.innerHTML = '<span>size = ' + f.size + '</span><span>items.length = ' + f.items.length + '</span>' +
        (f.got !== undefined ? '<span>returned ' + h.esc(f.got) + '</span>' : '');
      java.mark(f.lines.java, f.bad ? 'bad' : undefined);
      py.mark(f.lines.python, f.bad ? 'bad' : undefined);
      java.setOut(upTo(pj.output, f.out));
      py.setOut(upTo(pp.output, f.out));
      label();
      var marked = stage.querySelectorAll('.w7-slot[data-mark]:not([data-mark=""])');
      keepInView(stage, marked[marked.length - 1]);
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);

    // "Your turn": more adds, and get(i) at any slot of the array
    var turn = h.el('div', 'viz-sandbox');
    turn.appendChild(h.el('h4', null, 'Your turn: add more, or ask for a slot'));
    var tp = h.el('p', 'viz-intro');
    tp.innerHTML = 'These calls are not in <code>main</code>: they run the same <code>add</code> and <code>get</code> code on the list as it is now. ' +
      'Ask for a slot that exists in the array but is past <code>size</code>.';
    turn.appendChild(tp);
    var ops = h.el('div', 'viz-ops');
    var bAdd = h.button('add', 'ghost mono');
    ops.appendChild(bAdd);
    var iLab = h.el('label', 'viz-field');
    iLab.appendChild(h.el('span', null, 'index'));
    var iIn = h.el('input');
    iIn.type = 'number'; iIn.min = '0'; iIn.max = '12'; iIn.inputMode = 'numeric';
    iLab.appendChild(iIn);
    ops.appendChild(iLab);
    var bGet = h.button('get(index)', 'ghost mono');
    ops.appendChild(bGet);
    var bReset = h.button('Reset', 'ghost');
    ops.appendChild(bReset);
    turn.appendChild(ops);
    var msg = h.el('p', 'viz-muted');
    msg.setAttribute('aria-live', 'polite');
    turn.appendChild(msg);
    body.appendChild(turn);
    var panes = h.el('div', 'viz-panes');
    panes.appendChild(java.root);
    panes.appendChild(py.root);
    body.appendChild(panes);

    var state, poolAt;
    function snap(o) {
      return {
        items: state.items.slice(), size: state.size,
        other: o.other ? o.other.slice() : null, otherLabel: o.otherLabel || '', old: !!o.old,
        marks: o.marks || {}, omarks: o.omarks || {}, lines: o.lines || NONE, out: state.out,
        got: o.got, bad: !!o.bad, say: o.say
      };
    }
    function one(i, mark) { var m = {}; m[i] = mark; return m; }
    function addFrames(v, inMain) {
      var fr = [];
      if (inMain) fr.push(snap({ lines: lines('call', v), say: h.code('names.add("' + v + '")') + ' calls <code>add</code>.' }));
      var full = state.size === state.items.length;
      var cap = state.items.length;
      fr.push(snap({
        lines: lines('check'),
        marks: full ? {} : one(state.size, 'free'),
        say: 'Is the array full? <code>size</code> is ' + state.size + ' and the array has ' + cap + ' slots, so ' +
          (full ? '<strong>yes</strong>: there is no free slot for ' + h.code(v) + '.' : 'no: slot ' + state.size + ' is free.')
      }));
      if (full) {
        var bigger = [];
        for (var k = 0; k < cap + Math.floor(cap / 2); k++) bigger.push(null);
        fr.push(snap({ other: bigger, otherLabel: 'bigger (a new array)', lines: lines('bigger'),
          say: 'Make a new array with room for half as many again: ' + cap + ' + ' + cap + ' / 2 = ' + bigger.length + ' slots, all empty. Java\'s real ArrayList grows by half like this.' }));
        for (var i = 0; i < state.size; i++) {
          bigger[i] = state.items[i];
          fr.push(snap({ other: bigger, otherLabel: 'bigger (a new array)', omarks: one(i, 'add'), marks: one(i, 'read'), lines: lines('copy'),
            say: 'Copy ' + h.code(state.items[i]) + ' from <code>items[' + i + ']</code> to <code>bigger[' + i + ']</code>.' +
              (i === 0 ? ' Every element is copied, one at a time.' : '') }));
        }
        var old = state.items;
        state.items = bigger;
        fr.push(snap({ other: old, otherLabel: 'the old array: nothing refers to it now', old: true, lines: lines('swap'),
          say: '<code>items = bigger</code>: the list now uses the new array. The old one is unreachable, so its memory can be reclaimed. ' +
            'That was ' + plural(old.length, 'copy', 'copies') + ' for one add, but it happens rarely.' }));
      }
      var at = state.size;
      state.items[at] = v;
      fr.push(snap({ marks: one(at, 'add'), lines: lines('store'), say: h.code(v) + ' goes into slot ' + at + '.' }));
      state.size++;
      var spare = state.items.length - state.size;
      fr.push(snap({ marks: one(at, 'add'), lines: lines('inc'),
        say: '<code>size</code> goes up to ' + state.size + '. ' + (spare ? plural(spare, 'spare slot') + ' left.' : 'The array is full again.') }));
      return fr;
    }
    function getFrames(i, inMain) {
      var fr = [];
      var ok = i < state.size;
      fr.push(snap({
        lines: lines('getcheck'), bad: !ok, marks: i < state.items.length ? one(i, ok ? 'read' : 'refused') : {},
        say: '<code>get(' + i + ')</code> checks the index against <code>size</code>, not against the length of the array: ' +
          (ok ? i + ' &lt; ' + state.size + ', so it is allowed.'
              : i + ' is not less than ' + state.size + ', so it <strong>throws IndexOutOfBoundsException</strong> (Python: <strong>IndexError</strong>). ' +
                (i < state.items.length ? 'Slot ' + i + ' is there in the array, but it is spare capacity, not an element.' : 'The array does not even have a slot ' + i + '.'))
      }));
      if (ok) {
        if (inMain) state.out = 2;
        fr.push(snap({ lines: lines('getret'), marks: one(i, 'read'), got: '"' + state.items[i] + '"',
          say: 'It returns ' + h.code(state.items[i]) + (inMain ? ', and <code>main</code> prints it.' : '.') }));
      }
      return fr;
    }
    function reset() {
      state = { items: [], size: 0, out: 0 };
      for (var k = 0; k < spec.start; k++) state.items.push(null);
      poolAt = 0;
      var frames = [snap({ lines: lines('new'),
        say: 'A new GrowList: an array with ' + spec.start + ' empty slots, and <code>size</code> 0. The slots are its <em>capacity</em>; none of them is an element yet.' })];
      spec.values.forEach(function (v) { frames = frames.concat(addFrames(v, true)); });
      state.out = 1;
      frames.push(snap({ lines: lines('size'),
        say: 'Print the size and the capacity: ' + h.code(state.size + ' of ' + state.items.length) + '. Only ' + state.size + ' slots hold elements.' }));
      frames.push(snap({ lines: lines('get'), say: h.code('names.get(' + spec.get + ')') + ' calls <code>get</code>.' }));
      frames = frames.concat(getFrames(spec.get, true));
      st.set(frames);
      msg.textContent = '';
      iIn.value = String(state.size);
    }
    function label() { bAdd.textContent = 'add("' + spec.pool[poolAt % spec.pool.length] + '")'; }
    bAdd.addEventListener('click', function () {
      st.toEnd();
      if (state.size >= spec.max) { msg.textContent = 'This demo stops at ' + spec.max + ' elements. A real list keeps growing.'; return; }
      var v = spec.pool[poolAt % spec.pool.length];
      poolAt++;
      msg.textContent = '';
      st.append(addFrames(v, false));
      st.next.focus();
    });
    bGet.addEventListener('click', function () {
      var raw = iIn.value.trim(), i = raw === '' ? NaN : Number(raw);
      if (!Number.isInteger(i) || i < 0 || i > 12) { msg.textContent = 'Type a whole-number index from 0 to 12.'; iIn.focus(); return; }
      st.toEnd();
      msg.textContent = '';
      st.append(getFrames(i, false));
      st.next.focus();
    });
    bReset.addEventListener('click', reset);
    reset();
  });

  // ═════════════ overload: remove(int index) or remove(Object o)? ═════════════
  V.register('overload', function (host, spec, h) {
    var body = h.shell(host, spec);
    var picker = h.segmented('Choose a program', spec.scripts.map(function (s) { return { label: s.label }; }), choose);
    body.appendChild(picker.root);
    var stage = h.el('div', 'viz-stage');
    var track = h.listTrack('values');
    var vars = h.el('div', 'viz-vars');
    stage.appendChild(track.root);
    stage.appendChild(vars);
    body.appendChild(stage);
    var ask = h.el('div', 'w7-ask');
    ask.setAttribute('role', 'group');
    var java, py, pj, pp, script;
    var st = h.stepper(host, function (f) {
      track.draw(f.cells);
      vars.innerHTML = f.vars;
      java.mark(f.lines.java, f.kind); py.mark(f.lines.python, f.kind);
      java.setOut(upTo(pj.output, f.outJ)); py.setOut(upTo(pp.output, f.outP));
      drawAsk(f.ask);
    });
    body.appendChild(st.say);
    body.appendChild(ask);
    body.appendChild(st.bar);
    var panes = h.el('div', 'viz-panes');
    body.appendChild(panes);

    function drawAsk(q) {
      ask.textContent = '';
      ask.hidden = !q;
      if (!q) return;
      ask.setAttribute('aria-label', 'Predict');
      ask.appendChild(h.el('p', 'w7-ask-q', 'Predict: which remove does Java call?'));
      var opts = h.el('div', 'viz-ops');
      var fb = h.el('p', 'w7-ask-fb');
      fb.setAttribute('aria-live', 'polite');
      q.options.forEach(function (o, i) {
        var b = h.button(o, 'ghost mono');
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(opts.children, function (x, j) { x.setAttribute('aria-pressed', String(i === j)); });
          var right = i === q.answer;
          fb.className = 'w7-ask-fb ' + (right ? 'viz-good' : 'viz-bad');
          fb.innerHTML = (right ? '✓ Right. ' : '✗ Not this one. ') + q.why + ' Press <strong>Next</strong> to see it happen.';
        });
        opts.appendChild(b);
      });
      ask.appendChild(opts);
      ask.appendChild(fb);
    }

    function frames(s) {
      var key = 0, cur = [], outJ = 0, outP = 0, fr = [];
      function cells(marks) { return cur.map(function (c) { return { k: c.k, v: c.v, mark: (marks || {})[c.k] || '' }; }); }
      function push(step, say, o) {
        o = o || {};
        fr.push({ cells: cells(o.marks), lines: { java: java.line(step.j), python: py.line(step.p) }, kind: o.kind,
          outJ: outJ, outP: outP, ask: o.ask || null, say: say,
          vars: '<span>values.size() = ' + cur.length + '</span>' + (o.ret !== undefined ? '<span>returned ' + h.esc(o.ret) + '</span>' : '') });
      }
      var list = function () { return h.code('[' + cur.map(function (c) { return c.v; }).join(', ') + ']'); };
      s.steps.forEach(function (step) {
        if (step.op === 'new') {
          cur = step.values.map(function (v) { return { k: ++key, v: v }; });
          push(step, 'The list starts as ' + list() + '. These are <code>Integer</code> objects: the indexes under the boxes and the values in them are both small numbers, which is what makes <code>remove</code> tricky.');
          return;
        }
        if (step.op === 'print') {
          outJ += step.pj ? 1 : 0; outP += step.pp ? 1 : 0;
          push(step, step.say || 'Print the list: ' + list() + '.');
          return;
        }
        var call = step.op === 'at' ? 'remove(' + step.arg + ')' : 'remove(Integer.valueOf(' + step.arg + '))';
        var answer = step.op === 'at' ? 0 : 1;
        push(step, h.code(call) + ': the argument ' + (step.op === 'at' ? 'is a plain <code>int</code>.' : 'is an <code>Integer</code> object.') +
          ' <code>ArrayList</code> has two methods called <code>remove</code>. Predict which one runs.', {
          ask: { options: ['remove(int index)', 'remove(Object o)'], answer: answer,
            why: step.op === 'at'
              ? 'An <code>int</code> argument matches <code>remove(int index)</code> exactly, so ' + step.arg + ' is an <strong>index</strong>.'
              : 'An <code>Integer</code> is an object, so it matches <code>remove(Object o)</code>: ' + step.arg + ' is a <strong>value</strong> to look for.' }
        });
        var marks = {}, ret, say;
        if (step.op === 'at') {
          var gone = cur.splice(step.arg, 1)[0];
          cur.forEach(function (c, i) { if (i >= step.arg) marks[c.k] = 'moved'; });
          ret = String(gone.v);
          say = '<code>remove(int index)</code>: the element at <strong>index ' + step.arg + '</strong> comes out, and it was ' + h.code(String(gone.v)) +
            '. It returns the removed element. Everything after it moves one place left. Python spells this <code>values.pop(' + step.arg + ')</code>.';
        } else {
          var at = -1;
          cur.forEach(function (c, i) { if (at < 0 && c.v === step.arg) at = i; });
          if (at < 0) {
            ret = 'false';
            say = '<code>remove(Object o)</code> looks for the <strong>value ' + step.arg + '</strong>, finds none, and returns <code>false</code>. The list is unchanged and nothing is thrown. ' +
              'Python\'s <code>values.remove(' + step.arg + ')</code> would raise <strong>ValueError</strong> instead, so the Python program asks <code>' + step.arg + ' in values</code>.';
          } else {
            cur.splice(at, 1);
            cur.forEach(function (c, i) { if (i >= at) marks[c.k] = 'moved'; });
            ret = 'true';
            say = '<code>remove(Object o)</code> removes the <strong>first value equal to ' + step.arg + '</strong>, found at index ' + at + ', and returns <code>true</code>. ' +
              'A later ' + step.arg + ' would stay. Python spells this <code>values.remove(' + step.arg + ')</code>.';
          }
        }
        outJ += step.pj ? 1 : 0; outP += step.pp ? 1 : 0;
        push(step, say, { marks: marks, ret: ret, kind: 'ok' });
      });
      return fr;
    }
    function choose(n) {
      script = spec.scripts[n];
      pj = program(spec, 'java', script.id); pp = program(spec, 'python', script.id);
      java = h.codePane('java', pj.code, { output: true });
      py = h.codePane('python', pp.code, { output: true });
      panes.textContent = '';
      panes.appendChild(java.root);
      panes.appendChild(py.root);
      st.set(frames(script));
    }
    picker.pick(0);
    choose(0);
  });

  // ═════════════ access: ArrayList beside LinkedList, counting the work ═════════════
  V.register('access', function (host, spec, h) {
    var body = h.shell(host, spec);
    var mode = 0, impl = 0;
    var f1 = h.el('div', 'viz-form');
    f1.appendChild(h.el('span', 'viz-field-label', 'Loop:'));
    var modePick = h.segmented('Choose what the loop does', spec.modes.map(function (m) { return { label: m.label }; }), function (n) { mode = n; rebuild(); });
    f1.appendChild(modePick.root);
    body.appendChild(f1);
    var f2 = h.el('div', 'viz-form');
    f2.appendChild(h.el('span', 'viz-field-label', 'Code for:'));
    var implPick = h.segmented('Show the code for', spec.impls.map(function (m) { return { label: m.label, mono: true }; }), function (n) { impl = n; panesFor(true); });
    f2.appendChild(implPick.root);
    body.appendChild(f2);

    var stage = h.el('div', 'viz-stage w7-access');
    var arr = h.listTrack('ArrayList: one array');
    var arrCount = h.el('div', 'w7-count');
    var linkWrap = h.el('div', 'viz-track');
    linkWrap.appendChild(h.el('div', 'viz-track-name', 'LinkedList: linked nodes'));
    var lt = h.el('div', 'viz-qtrack');
    var topRow = h.el('div', 'viz-qlabels');
    var firstLab = h.el('div', 'viz-qlabel is-head', 'first');
    var lastLab = h.el('div', 'viz-qlabel is-head w7-last', 'last');
    topRow.appendChild(firstLab); topRow.appendChild(lastLab);
    var nodes = h.el('div', 'viz-nodes');
    nodes.setAttribute('role', 'img');
    var botRow = h.el('div', 'viz-qlabels');
    var walker = h.el('div', 'viz-qlabel is-local', 'here');
    botRow.appendChild(walker);
    lt.appendChild(topRow); lt.appendChild(nodes); lt.appendChild(botRow);
    linkWrap.appendChild(lt);
    var linkCount = h.el('div', 'w7-count');
    stage.appendChild(arr.root);
    stage.appendChild(arrCount);
    stage.appendChild(linkWrap);
    stage.appendChild(linkCount);
    body.appendChild(stage);

    var java, py, pj, pp;
    var st = h.stepper(host, function (f) {
      arr.draw(f.cells);
      h.flip(nodes, f.nodes, makeNode, updateNode);
      nodes.setAttribute('aria-label', f.nodes.length ? 'Linked nodes: ' + f.nodes.map(function (n) { return n.v; }).join(', ') : 'No nodes');
      firstLab.hidden = lastLab.hidden = !f.nodes.length;
      lastLab.style.setProperty('--i', Math.max(0, f.nodes.length - 1));
      firstLab.textContent = f.nodes.length === 1 ? 'first, last' : 'first';
      lastLab.hidden = lastLab.hidden || f.nodes.length === 1;
      walker.hidden = f.walk === null || f.walk === undefined;
      if (!walker.hidden) walker.style.setProperty('--i', f.walk);
      arrCount.innerHTML = '<strong>ArrayList</strong>: ' + plural(f.a, 'element') + ' touched' + (f.aNote ? ' · ' + f.aNote : '');
      linkCount.innerHTML = '<strong>LinkedList</strong>: ' + plural(f.l, 'node') + ' visited' + (f.lNote ? ' · ' + f.lNote : '');
      var spot = nodes.querySelector('.viz-slot[data-mark="read"]');
      keepInView(stage, spot || (f.role === 'start' ? nodes.firstChild : null));
      java.mark(f.role === 'body' ? java.line(pj.body) : 0); py.mark(f.role === 'body' ? py.line(pp.body) : 0);
      java.setOut(upTo(pj.output, f.out)); py.setOut(upTo(pp.output, f.out));
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var panes = h.el('div', 'viz-panes');
    body.appendChild(panes);

    function makeNode() {
      var s = h.el('div', 'viz-slot w7-dslot');
      var n = h.el('div', 'viz-node w7-dnode');
      n.appendChild(h.el('span', 'nv'));
      s.appendChild(n);
      var link = h.el('span', 'w7-dlink');
      link.setAttribute('aria-hidden', 'true');
      s.appendChild(link);
      return s;
    }
    function updateNode(s, it) {
      s.firstChild.firstChild.textContent = it.v;
      s.dataset.mark = it.mark || '';
      s.lastChild.classList.toggle('is-on', !!it.next);
    }
    var frames = [];
    function currentIndex() {
      var m = /Step (\d+)/.exec(st.bar.querySelector('.viz-count').textContent);
      return m ? Number(m[1]) - 1 : 0;
    }
    // switching the code shown keeps the place in the run: the frames do not depend on it
    function panesFor(keep) {
      var m = spec.modes[mode], id = m.id + '-' + spec.impls[impl].id;
      var n = keep ? currentIndex() : 0;
      pj = program(spec, 'java', id); pp = program(spec, 'python', id);
      java = h.codePane('java', pj.code, { output: true });
      py = h.codePane('python', pp.code, { output: true });
      panes.textContent = '';
      panes.appendChild(java.root);
      panes.appendChild(py.root);
      st.set(frames, n);
    }
    // the work of every operation, for both structures, one frame per loop pass
    function build() {
      var m = spec.modes[mode].id, names = spec.values.slice(), n = names.length;
      var key = 0, items = names.map(function (v) { return { k: ++key, v: v }; });
      var a = 0, l = 0, out = 0, fr = [], walk = null;
      function push(role, say, o) {
        o = o || {};
        fr.push({
          role: role, out: out, a: a, l: l, aNote: o.aNote, lNote: o.lNote, walk: o.walk === undefined ? walk : o.walk,
          cells: items.map(function (c) { return { k: c.k, v: c.v, mark: (o.am || {})[c.k] || '' }; }),
          nodes: items.map(function (c, i) { return { k: c.k, v: c.v, next: i < items.length - 1, mark: (o.lm || {})[c.k] || '' }; }),
          say: say
        });
      }
      var intro = { index: 'The loop asks for <code>get(i)</code> with i = 0, 1, 2, … Watch how many boxes each list has to touch to answer.',
                    each: 'A for-each loop asks the list for its elements in order. The list hands them out one after another.',
                    front: 'The loop keeps taking the element at the front until the list is empty, like serving a queue.' }[m];
      push('start', 'Both lists hold the same ' + n + ' names. ' + intro, { walk: null });
      if (m === 'index') {
        for (var i = 0; i < n; i++) {
          var fromEnd = i >= (n >> 1), start = fromEnd ? n - 1 : 0, hops = Math.abs(i - start);
          var am = {}, lm = {};
          am[items[i].k] = 'read';
          var lo = Math.min(i, start), hi = Math.max(i, start);
          for (var j = lo; j <= hi; j++) lm[items[j].k] = 'trail';
          lm[items[i].k] = 'read';
          a += 1; l += hops + 1; out++; walk = i;
          push('body', '<code>get(' + i + ')</code>. ArrayList: index ' + i + ' is worked out from where the array starts, so it goes straight there (1 element). ' +
            'LinkedList: it has no indexes, so it starts at <code>' + (fromEnd ? 'last' : 'first') + '</code> (the nearer end) and follows ' + plural(hops, 'link') +
            ' to reach ' + h.code(items[i].v) + ' (' + plural(hops + 1, 'node') + '). Next time it starts again from an end.', { am: am, lm: lm, aNote: '+1', lNote: '+' + (hops + 1) });
        }
      } else if (m === 'each') {
        for (var e = 0; e < n; e++) {
          var am2 = {}, lm2 = {};
          am2[items[e].k] = 'read'; lm2[items[e].k] = 'read';
          a += 1; l += 1; out++; walk = e;
          push('body', e === 0 ? 'The loop gets ' + h.code(items[0].v) + '. Both lists start at the front: 1 element each.'
            : 'The loop gets ' + h.code(items[e].v) + '. The LinkedList\'s iterator remembers where it is, so it follows just one link: 1 node, the same as the ArrayList.',
            { am: am2, lm: lm2, aNote: '+1', lNote: '+1' });
        }
      } else {
        while (items.length) {
          var front = items[0], rest = items.length - 1;
          var gone = {}, moved = {};
          gone[front.k] = 'read';
          push('body', 'Take ' + h.code(front.v) + ' from the front of both lists.', { am: gone, lm: gone, walk: 0 });
          items = items.slice(1);
          items.forEach(function (c) { moved[c.k] = 'moved'; });
          a += 1 + rest; l += 1; out++;
          push('body', 'ArrayList: removing index 0 leaves a gap, so ' + (rest ? 'all ' + plural(rest, 'remaining element') + ' move one place left' : 'nothing is left to move') +
            ' (+' + (1 + rest) + '). LinkedList: <code>first</code> just moves to the next node, and nothing else moves (+1). ' + h.code(front.v) + ' is printed.',
            { am: moved, walk: null, aNote: '+' + (1 + rest), lNote: '+1' });
        }
      }
      // the same counts for a much longer list, from the same rules
      var big = spec.big, bigA, bigL;
      if (m === 'index') { bigA = big; bigL = 0; for (var b = 0; b < big; b++) bigL += Math.min(b, big - 1 - b) + 1; }
      else if (m === 'each') { bigA = big; bigL = big; }
      else { bigA = big * (big + 1) / 2; bigL = big; }
      var fmt = function (x) { return x.toLocaleString('en-AU'); };
      var verdict = { index: 'For a LinkedList, <code>get(i)</code> in a loop is the slow choice: each call walks again from an end.',
                      each: 'A for-each loop is fast for both: this is the loop to use on a LinkedList.',
                      front: 'Taking from the front is where LinkedList (and Python\'s <code>deque</code>) wins: an ArrayList or Python list shifts everything left every time.' }[m];
      walk = null;
      push('end', 'Done: ArrayList touched ' + a + ' elements and LinkedList visited ' + l + ' nodes, and both printed the same names. With ' + fmt(big) +
        ' names the same rules give ' + fmt(bigA) + ' and ' + fmt(bigL) + '. ' + verdict, { walk: null });
      return fr;
    }
    function rebuild() {
      frames = build();
      panesFor(false);
    }
    modePick.pick(0);
    implPick.pick(0);
    rebuild();
  });

  // ═════════════ pair: Pair<A, B>, with A and B filled in for the object in use ═════════════
  V.register('pair', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(host, ['java']);
    var controls = h.el('div', 'viz-form');
    var fill = h.el('button', 'viz-seg-btn viz-toggle', 'Fill in A and B');
    fill.type = 'button';
    fill.setAttribute('aria-pressed', 'false');
    controls.appendChild(fill);
    controls.appendChild(h.el('span', 'viz-muted', 'shows the class the way the compiler reads it for the object in use'));
    body.appendChild(controls);
    var stage = h.el('div', 'viz-stage w7-pair');
    var varsBox = h.el('div', 'w7-locals');
    var heap = h.el('div', 'w7-heap');
    stage.appendChild(varsBox);
    stage.appendChild(heap);
    body.appendChild(stage);
    var pj = program(spec, 'java');
    var pane = h.codePane('java', pj.code, { output: true, label: 'Demo.java' });
    var filled = false, cur = null;
    var st = h.stepper(host, function (f) { cur = f; draw(); });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(pane.root);
    fill.addEventListener('click', function () {
      filled = !filled;
      fill.setAttribute('aria-pressed', String(filled));
      fill.textContent = filled ? 'Show A and B again' : 'Fill in A and B';
      draw();
    });

    var SUB_OPEN = '⟦', SUB_CLOSE = '⟧', T_OPEN = '⟪', T_CLOSE = '⟫';
    function draw() {
      var f = cur, obj = f.obj !== null ? f.objs[f.obj] : null;
      // the class, with its type parameters marked, or filled in for the object in use
      var lines = pj.code.replace(/\n+$/, '').split('\n'), inClass = false;
      var text = lines.map(function (l) {
        if (/^class Pair<A, B>/.test(l)) {
          inClass = true;
          return l.replace('<A, B>', '<' + T_OPEN + 'A' + T_CLOSE + ', ' + T_OPEN + 'B' + T_CLOSE + '>') +
            (filled && obj ? '   // ' + f.objVar + ': A = ' + obj.A + ', B = ' + obj.B : '');
        }
        if (!inClass) return l;
        return l.replace(/\b([AB])\b/g, function (_, p) {
          return filled && obj ? SUB_OPEN + obj[p] + SUB_CLOSE : T_OPEN + p + T_CLOSE;
        });
      }).join('\n');
      var html = h.highlight(text, 'java').map(function (l) {
        return l.split(SUB_OPEN).join('<span class="viz-sub">').split(SUB_CLOSE).join('</span>')
                .split(T_OPEN).join('<span class="viz-t">').split(T_CLOSE).join('</span>');
      });
      pane.setHtml(html);
      pane.mark(f.line);
      pane.setOut(upTo(pj.output, f.out));
      varsBox.innerHTML = '<div class="viz-track-name">main\'s variables</div>' + (f.vars.length ? f.vars.map(function (v) {
        return '<div class="w7-var' + (v.isNew ? ' is-new' : '') + '"><span class="t">' + h.esc(v.type) + '</span> <span class="n">' + h.esc(v.name) + '</span> ' +
          (v.ref !== undefined ? '<span class="w7-ref">→ Pair #' + (v.ref + 1) + '</span>' : '= <span class="val">' + h.esc(v.value) + '</span>') + '</div>';
      }).join('') : '<p class="viz-muted">none yet</p>');
      heap.innerHTML = '<div class="viz-track-name">objects</div>' + (f.objs.length ? f.objs.map(function (o, i) {
        var on = i === f.obj;
        function field(name, p, val) {
          var lit = on && f.field === name;
          return '<div class="w7-field' + (lit ? ' is-lit' : '') + '"><span class="n">' + name + '</span> <span class="w7-tp">' + p + ' = ' + h.esc(o[p]) + '</span>' +
            '<span class="val">' + h.esc(val) + '</span></div>';
        }
        return '<div class="w7-obj' + (on ? ' is-on' : '') + (o.isNew && on ? ' is-new' : '') + '"><div class="w7-obj-head">Pair #' + (i + 1) + ' · <code>Pair&lt;' + h.esc(o.A) + ', ' + h.esc(o.B) + '&gt;</code></div>' +
          field('first', 'A', o.first) + field('second', 'B', o.second) + '</div>';
      }).join('') : '<p class="viz-muted">none yet</p>');
    }

    // frames from the steps: objects and variables are built up as main runs
    var objs = [], vars = [], out = 0, frames = [];
    function copy(list) { return list.map(function (x) { var c = {}; for (var k in x) c[k] = x[k]; return c; }); }
    function push(line, say, o) {
      o = o || {};
      frames.push({ line: pane.line(line), say: say, out: out, objs: copy(objs), vars: copy(vars),
        obj: o.obj === undefined ? null : o.obj, objVar: o.objVar || '', field: o.field || null });
      vars.forEach(function (v) { v.isNew = false; });
      objs.forEach(function (x) { x.isNew = false; });
    }
    function refOf(name) { var v = vars.filter(function (x) { return x.name === name; })[0]; return v.ref; }
    spec.steps.forEach(function (s) {
      if (s.op === 'new') {
        var t = 'Pair<' + s.A + ', ' + s.B + '>';
        push(s.j, h.code('new ' + t + '(' + s.args + ')') + ' creates a Pair object. In it, <code>A</code> stands for ' + h.code(s.A) + ' and <code>B</code> for ' + h.code(s.B) + '.' + (s.note ? ' ' + s.note : ''));
        objs.push({ A: s.A, B: s.B, first: s.first, second: s.second, isNew: true });
        var idx = objs.length - 1;
        push(spec.lines.ctor, 'The constructor <code>Pair(A first, B second)</code> runs. For this object it accepts ' + h.code(s.A + ' first') + ' and ' + h.code(s.B + ' second') +
          ', and stores ' + h.code(s.first) + ' and ' + h.code(s.second) + '. Press <strong>Fill in A and B</strong> to read it that way.', { obj: idx, objVar: s['var'] });
        vars.push({ type: t, name: s['var'], ref: idx, isNew: true });
        push(s.j, h.code(s['var']) + ' now refers to Pair #' + (idx + 1) + '. One <code>Pair</code> class, used here with ' + h.code(s.A) + ' and ' + h.code(s.B) + '.', { obj: idx, objVar: s['var'] });
      } else if (s.op === 'get') {
        var r = refOf(s.of), o = objs[r], p = s.field === 'first' ? 'A' : 'B';
        push(s.j, h.code(s.of + '.' + s.method + '()') + ' is called on Pair #' + (r + 1) + '.', { obj: r, objVar: s.of });
        push(s.method === 'getFirst' ? spec.lines.getFirst : spec.lines.getSecond,
          h.code(p + ' ' + s.method + '()') + ' returns its <code>' + s.field + '</code> field. For ' + h.code(s.of) + ', <code>' + p + '</code> is ' + h.code(o[p]) +
          ', so the compiler knows the result is ' + (/^[AEIOU]/.test(o[p]) ? 'an ' : 'a ') + h.code(o[p]) + ' and no cast is needed.', { obj: r, objVar: s.of, field: s.field });
        vars.push({ type: s.type, name: s['var'], value: s.value, isNew: true });
        push(s.j, h.code(s.type + ' ' + s['var']) + ' = ' + h.code(s.value) + '.' + (s.note ? ' ' + s.note : ''), { obj: r, objVar: s.of, field: s.field });
      } else if (s.op === 'print') {
        out++;
        push(s.j, s.say + ' It prints ' + h.code(upTo(pj.output, out).split('\n')[out - 1]) + '.', s.of ? { obj: refOf(s.of), objVar: s.of } : {});
      }
    });
    st.set(frames);
  });
})();
