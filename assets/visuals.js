/* 41039 Programming 1 — interactive diagrams: step through a program and watch the data change.
 *
 *   <div class="p1-viz" data-kind="list-ops" data-title="…">
 *     <script type="application/json" data-role="spec">{…}</script>
 *     <div class="viz-fallback">…shown only without JavaScript…</div>
 *   </div>
 *
 * The spec is written by scripts/build_week_pages.py from content/weeks-6-12.json, where every
 * program it shows is run by scripts/check_week_content.py, so the code and the output on the
 * page are real. Kinds:
 *
 *   list-ops   a scripted list program, Java and Python side by side, one line per step; then a
 *              "Your turn" sandbox with add / insert / set / remove / get
 *   filter     removing while looping: a buggy forward loop and two fixes, simulated step by step
 *   queue      a linked queue: Enqueue / Dequeue append steps; arrows, head and tail move
 *   box        a generic class Box<T>, with T filled in for a chosen type
 *   typecheck  ask the compiler: a declaration × a statement → compiles or javac's error
 *
 * Code panes reuse the explained-code look (.explain-code, CSS line numbers) and the
 * P1Highlight colours; the current line carries .is-now. Steps are announced in an aria-live
 * caption. Movement uses FLIP transforms and is skipped under prefers-reduced-motion.
 *
 * Depends on assets/highlight.js.
 */
window.P1Visuals = (function () {
  'use strict';

  var LANG = { java: 'Java', python: 'Python' };
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function moving() { return !(motionQuery && motionQuery.matches); }

  // ───────────── small helpers ─────────────
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function button(label, cls, title) {
    var b = el('button', 'btn small ' + (cls || 'ghost'), label);
    b.type = 'button';
    if (title) { b.title = title; b.setAttribute('aria-label', title); }
    return b;
  }
  function code(text) { return '<code>' + esc(text) + '</code>'; }
  function pyRepr(v) { return typeof v === 'number' ? String(v) : "'" + v + "'"; }
  function javaList(items) { return '[' + items.map(function (c) { return c.v; }).join(', ') + ']'; }
  function pyList(items) { return '[' + items.map(function (c) { return pyRepr(c.v); }).join(', ') + ']'; }

  /* The highlighter's spans are flat, but one may cross a line break; close and reopen it so
     every line stands alone (same as explain.js). */
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
  function lineOf(src, token, where) {
    var lines = src.split('\n');
    for (var i = 0; i < lines.length; i++) if (lines[i].indexOf(token) !== -1) return i + 1;
    console.warn('P1Visuals: "' + token + '" not found', where || '');
    return 0;
  }

  // ───────────── a read-only code pane with a current line ─────────────
  function codePane(lang, src, opts) {
    opts = opts || {};
    src = src.replace(/\n+$/, '');
    var root = el('div', 'viz-pane');
    var head = el('div', 'viz-pane-head');
    head.appendChild(el('span', 'lang ' + lang, LANG[lang] || lang));
    if (opts.label) head.appendChild(el('span', 'viz-pane-label', opts.label));
    root.appendChild(head);
    var pre = el('pre', 'explain-code viz-code');
    if (opts.first > 1) pre.style.counterReset = 'ln ' + (opts.first - 1);
    root.appendChild(pre);
    var out = null;
    if (opts.output) {
      root.appendChild(el('div', 'viz-out-label', 'Output'));
      out = el('pre', 'console-out viz-out');
      out.setAttribute('aria-label', LANG[lang] + ' output');
      root.appendChild(out);
    }
    function setHtml(lines) {
      pre.innerHTML = lines.map(function (l) { return '<div class="cl">' + l + '</div>'; }).join('');
    }
    setHtml(highlight(src, lang));
    return {
      root: root,
      setHtml: setHtml,
      line: function (token) { return lineOf(src, token, lang); },
      mark: function (n, kind) {
        Array.prototype.forEach.call(pre.children, function (row, i) {
          row.classList.toggle('is-now', i + 1 === n);
          row.classList.toggle('is-ok', i + 1 === n && kind === 'ok');
          row.classList.toggle('is-bad', i + 1 === n && kind === 'bad');
        });
      },
      setOut: function (text) { if (out) out.textContent = text; }
    };
  }

  // ───────────── the frame every diagram sits in ─────────────
  function shell(host, spec) {
    host.classList.add('viz');
    host.textContent = '';
    var head = el('div', 'viz-head');
    head.appendChild(el('span', 'viz-kicker', 'Interactive'));
    head.appendChild(el('span', 'title', spec.title));
    var langs = el('span', 'viz-langs');
    var kinds = spec.kind === 'box' || spec.kind === 'typecheck' ? ['java'] : ['java', 'python'];
    if (spec.kind === 'typecheck') kinds.push('python');
    kinds.forEach(function (l) { langs.appendChild(el('span', 'lang ' + l, LANG[l])); });
    head.appendChild(langs);
    host.appendChild(head);
    var body = el('div', 'viz-body');
    var intro = el('p', 'viz-intro');
    intro.innerHTML = spec.intro;
    body.appendChild(intro);
    host.appendChild(body);
    return body;
  }

  function segmented(label, options, onPick) {
    var wrap = el('div', 'viz-seg');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', label);
    var buttons = options.map(function (o, i) {
      var b = el('button', 'viz-seg-btn' + (o.mono ? ' mono' : ''), o.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { pick(i); onPick(i); });
      wrap.appendChild(b);
      return b;
    });
    function pick(i) { buttons.forEach(function (b, j) { b.setAttribute('aria-pressed', String(i === j)); }); }
    return { root: wrap, pick: pick, buttons: buttons };
  }

  // ───────────── step controls: start, back, next, end, play ─────────────
  function stepper(host, render) {
    var frames = [], at = 0, timer = null;
    var say = el('div', 'viz-say');
    say.setAttribute('aria-live', 'polite');
    var bar = el('div', 'viz-controls');
    var bStart = button('⏮', 'ghost', 'Back to the first step');
    var bBack = button('◀ Back', 'ghost');
    var bNext = button('Next ▶', 'primary');
    var bEnd = button('⏭', 'ghost', 'Jump to the last step');
    var bPlay = button('▶ Play', 'ghost');
    var count = el('span', 'viz-count');
    [bStart, bBack, bNext, bEnd, bPlay, count].forEach(function (n) { bar.appendChild(n); });

    function go(n) {
      if (!frames.length) return;
      at = Math.max(0, Math.min(frames.length - 1, n));
      var f = frames[at];
      render(f, at);
      say.innerHTML = f.say || '';
      count.textContent = 'Step ' + (at + 1) + ' of ' + frames.length;
      var focused = document.activeElement;
      bStart.disabled = bBack.disabled = at === 0;
      bNext.disabled = bEnd.disabled = at === frames.length - 1;
      // a button that just became disabled would drop focus to <body>; hand it to its opposite
      var other = new Map([[bNext, bBack], [bEnd, bStart], [bBack, bNext], [bStart, bEnd]]).get(focused);
      if (other && focused.disabled && !other.disabled) other.focus();
      if (at === frames.length - 1) stop();
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      bPlay.textContent = '▶ Play';
    }
    function play() {
      if (timer) { stop(); return; }
      if (at >= frames.length - 1) go(0);
      bPlay.textContent = '❚❚ Pause';
      timer = setInterval(function () { go(at + 1); }, 1400);
    }
    bStart.addEventListener('click', function () { stop(); go(0); });
    bBack.addEventListener('click', function () { stop(); go(at - 1); });
    bNext.addEventListener('click', function () { stop(); go(at + 1); });
    bEnd.addEventListener('click', function () { stop(); go(frames.length - 1); });
    bPlay.addEventListener('click', play);
    // ← and → step when focus is inside the diagram but not in a text box
    host.addEventListener('keydown', function (ev) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName) || ev.target.closest('.viz-sandbox')) return;
      if (ev.key === 'ArrowRight') { stop(); go(at + 1); ev.preventDefault(); }
      if (ev.key === 'ArrowLeft') { stop(); go(at - 1); ev.preventDefault(); }
    });
    return {
      say: say, bar: bar, next: bNext,
      set: function (list, n) { stop(); frames = list; go(n || 0); },
      append: function (list) { stop(); var first = frames.length; frames = frames.concat(list); go(first); },
      last: function () { return frames[frames.length - 1]; },
      toEnd: function () { stop(); go(frames.length - 1); },
      stop: stop
    };
  }

  /* Re-render keyed children with FLIP: elements that stay slide from where they were,
     new ones fade in, and removed ones fade out where they stood. */
  function flip(box, items, make, update) {
    var animate = moving();
    var boxRect = box.getBoundingClientRect();
    var old = {};
    // copy first: removing from a live HTMLCollection while walking it skips the next child
    Array.prototype.slice.call(box.children).forEach(function (c) {
      if (c.classList.contains('is-leaving') || c._k === undefined) { c.remove(); return; }
      old[c._k] = { el: c, r: c.getBoundingClientRect() };
    });
    var keep = {};
    var placed = items.map(function (it) {
      var o = old[it.k], node = o ? o.el : make(it);
      if (!o) { node._k = it.k; if (animate && box._drawn) node.classList.add('is-entering'); }
      else node.classList.remove('is-entering');
      update(node, it);
      keep[it.k] = true;
      return node;
    });
    placed.forEach(function (n) { box.appendChild(n); });
    Object.keys(old).forEach(function (k) {
      if (keep[k]) return;
      var o = old[k];
      if (!animate) { o.el.remove(); return; }
      o.el.classList.add('is-leaving');
      o.el.style.left = (o.r.left - boxRect.left - box.clientLeft + box.scrollLeft) + 'px';
      o.el.style.top = (o.r.top - boxRect.top - box.clientTop) + 'px';
      setTimeout(function () { o.el.remove(); }, 450);
    });
    if (animate) {
      placed.forEach(function (n) {
        var o = old[n._k];
        if (!o) return;
        var r = n.getBoundingClientRect(), dx = o.r.left - r.left, dy = o.r.top - r.top;
        if (!dx && !dy) return;
        n.style.transition = 'none';
        n.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        n.getBoundingClientRect();   // commit the start position
        n.style.transition = '';
        n.style.transform = '';
      });
    }
    box._drawn = true;
  }

  // ───────────── a row of list cells with indexes under them ─────────────
  var MARK_LABEL = { add: 'added', 'new': 'added', changed: 'replaced', moved: 'moved', check: 'checking',
                     read: 'read', skipped: 'skipped!', done: 'checked', kept: 'kept' };
  function listTrack(name) {
    var root = el('div', 'viz-track');
    var label = el('div', 'viz-track-name', name);
    var ptr = el('div', 'viz-ptr');
    ptr.hidden = true;
    ptr.setAttribute('aria-hidden', 'true');
    var cells = el('div', 'viz-cells');
    var idx = el('div', 'viz-idx');
    idx.setAttribute('aria-hidden', 'true');
    var row = el('div', 'viz-row');
    row.appendChild(ptr);
    row.appendChild(cells);
    row.appendChild(idx);
    root.appendChild(label);
    root.appendChild(row);
    function make() {
      var c = el('div', 'viz-cell');
      c.appendChild(el('span', 'v'));
      c.appendChild(el('span', 'm'));
      return c;
    }
    function update(c, it) {
      c.firstChild.textContent = it.v;
      c.lastChild.textContent = MARK_LABEL[it.mark] || '';
      c.dataset.mark = it.mark || '';
    }
    return {
      root: root,
      draw: function (items, pointer, pointerName) {
        flip(cells, items, make, update);
        cells.classList.toggle('is-empty', !items.length);
        idx.innerHTML = items.map(function (_, i) { return '<span>' + i + '</span>'; }).join('');
        cells.setAttribute('aria-label', name + ' is ' + javaList(items));
        cells.setAttribute('role', 'img');
        if (pointer === null || pointer === undefined) { ptr.hidden = true; return; }
        ptr.hidden = false;
        ptr.classList.toggle('is-out', pointer < 0 || pointer >= items.length);
        ptr.style.setProperty('--i', Math.max(0, pointer));
        ptr.textContent = (pointerName || 'i') + (pointerName === 'value' ? '' : ' = ' + pointer);
      },
      hide: function (h) { root.hidden = h; }
    };
  }

  // ═════════════ list-ops: a scripted program, then the reader's own ═════════════
  function mountListOps(host, spec) {
    var body = shell(host, spec);
    var stage = el('div', 'viz-stage');
    var track = listTrack(spec['var']);
    var vars = el('div', 'viz-vars');
    stage.appendChild(track.root);
    stage.appendChild(vars);
    body.appendChild(stage);
    var java = codePane('java', spec.programs.java.code, { output: true });
    var py = codePane('python', spec.programs.python.code, { output: true });
    var st = stepper(host, function (f) {
      track.draw(f.cells);
      vars.innerHTML = f.vars;
      java.mark(f.lines.java); py.mark(f.lines.python);
      java.setOut(f.out.java); py.setOut(f.out.python);
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var panes = el('div', 'viz-panes');
    panes.appendChild(java.root);
    panes.appendChild(py.root);
    body.appendChild(panes);

    // the frames: one per step, state simulated, printed text taken from the real output
    var outJ = spec.programs.java.output.split('\n'), outP = spec.programs.python.output.split('\n');
    var printed = 0, key = 0, state = [], gone = null, frames = [];
    spec.steps.forEach(function (s) {
      var marks = {};
      if (s.op === 'new') state = [];
      if (s.op === 'add') { state.push({ k: ++key, v: s.value }); marks[key] = 'add'; }
      if (s.op === 'insert') {
        state.splice(s.index, 0, { k: ++key, v: s.value });
        state.forEach(function (c, i) { if (i === s.index) marks[c.k] = 'add'; else if (i > s.index) marks[c.k] = 'moved'; });
      }
      if (s.op === 'set') { state[s.index] = { k: ++key, v: s.value }; marks[key] = 'changed'; }
      if (s.op === 'remove') {
        gone = state.splice(s.index, 1)[0].v;
        state.forEach(function (c, i) { if (i >= s.index) marks[c.k] = 'moved'; });
      }
      if (s.op === 'print') {
        printed++;
        if (s.read !== undefined) marks[state[s.read].k] = 'read';
      }
      frames.push({
        cells: state.map(function (c) { return { k: c.k, v: c.v, mark: marks[c.k] || '' }; }),
        lines: { java: java.line(s.j), python: py.line(s.p) },
        out: { java: outJ.slice(0, printed).join('\n'), python: outP.slice(0, printed).join('\n') },
        vars: '<span>size = ' + state.length + '</span>' + (gone !== null ? '<span>gone = "' + esc(gone) + '"</span>' : ''),
        say: s.say
      });
    });
    st.set(frames);
    if (spec.sandbox) body.appendChild(sandbox(spec));
  }

  // "Your turn": the reader drives the list; each action shows the Java and the Python line
  function sandbox(spec) {
    var cfg = spec.sandbox, name = spec['var'];
    var box = el('div', 'viz-sandbox');
    var h = el('h4', null, 'Your turn: change the list yourself');
    box.appendChild(h);
    var p = el('p', 'viz-intro');
    p.innerHTML = 'Each button does one list operation and shows the Java line and the Python line that do the same job. ' +
      'Try an index that is too big, too.';
    box.appendChild(p);
    var track = listTrack(name);
    box.appendChild(track.root);
    var form = el('div', 'viz-form');
    var vLab = el('label', 'viz-field');
    vLab.appendChild(el('span', null, 'value'));
    var vIn = el('input');
    vIn.type = 'text'; vIn.maxLength = 10; vIn.autocomplete = 'off'; vIn.spellcheck = false;
    vLab.appendChild(vIn);
    var iLab = el('label', 'viz-field');
    iLab.appendChild(el('span', null, 'index'));
    var iIn = el('input');
    iIn.type = 'number'; iIn.min = '0'; iIn.max = '9'; iIn.value = '1'; iIn.inputMode = 'numeric';
    iLab.appendChild(iIn);
    form.appendChild(vLab);
    form.appendChild(iLab);
    box.appendChild(form);
    var ops = el('div', 'viz-ops');
    var acts = [
      ['add', 'add(value)'], ['insert', 'add(index, value)'], ['set', 'set(index, value)'],
      ['remove', 'remove(index)'], ['get', 'get(index)']
    ];
    acts.forEach(function (a) {
      var b = button(a[1], 'ghost mono');
      b.addEventListener('click', function () { act(a[0]); });
      ops.appendChild(b);
    });
    var reset = button('Reset', 'ghost');
    reset.addEventListener('click', start);
    ops.appendChild(reset);
    box.appendChild(ops);
    var result = el('div', 'viz-result');
    result.setAttribute('aria-live', 'polite');
    box.appendChild(result);

    var state, key, poolAt;
    function nextName() { var n = cfg.pool[poolAt % cfg.pool.length]; poolAt++; return n; }
    function start() {
      key = 0; poolAt = 0;
      state = cfg.start.map(function (v) { return { k: ++key, v: v }; });
      vIn.value = nextName();
      draw({});
      result.innerHTML = '<p class="viz-muted">The list starts as ' + code(javaList(state)) + '. Pick an operation.</p>';
    }
    function draw(marks) {
      track.draw(state.map(function (c) { return { k: c.k, v: c.v, mark: marks[c.k] || '' }; }));
    }
    function row(lang, line, outcome, bad) {
      return '<div class="viz-line"><span class="lang ' + lang + '">' + LANG[lang] + '</span>' + code(line) +
        '<span class="viz-arrow" aria-hidden="true">→</span><span class="' + (bad ? 'viz-bad' : 'viz-good') + '">' + outcome + '</span></div>';
    }
    var IOOBE = 'throws <strong>IndexOutOfBoundsException</strong>';
    function act(op) {
      var raw = iIn.value.trim(), i = raw === '' ? NaN : Number(raw);
      var v = vIn.value.trim(), n = state.length, marks = {}, j, py, note = '', ok = true;
      var needsValue = op === 'add' || op === 'insert' || op === 'set';
      var needsIndex = op !== 'add';
      // a rejected input changes nothing, so clear the marks of the previous operation too
      if (needsValue && !/^\p{L}{1,10}$/u.test(v)) {
        draw({});
        result.innerHTML = '<p class="viz-bad">Type a value made of letters only (up to 10), such as <code>Lan</code>.</p>';
        vIn.focus(); return;
      }
      if (needsIndex && (!Number.isInteger(i) || i < 0 || i > 9)) {
        draw({});
        result.innerHTML = '<p class="viz-bad">Type a whole-number index from 0 to 9. (Python also allows negative indexes, such as -1 for the last item; Java does not.)</p>';
        iIn.focus(); return;
      }
      if ((op === 'add' || op === 'insert') && n >= cfg.max) {
        draw({});
        result.innerHTML = '<p class="viz-muted">This demo stops at ' + cfg.max + ' items. A real list keeps growing. Remove something first.</p>';
        return;
      }
      var q = '"' + v + '"';
      if (op === 'add') {
        state.push({ k: ++key, v: v }); marks[key] = 'add';
        j = row('java', name + '.add(' + q + ');', 'returns <code>true</code>');
        py = row('python', name + '.append(' + q + ')', 'returns <code>None</code>');
        note = code(v) + ' goes on the end, at index ' + n + '.';
      } else if (op === 'insert') {
        if (i > n) {
          ok = false;
          j = row('java', name + '.add(' + i + ', ' + q + ');', IOOBE, true);
          py = row('python', name + '.insert(' + i + ', ' + q + ')', 'no error: Python puts it at the end instead');
          note = 'The valid insert positions are 0 to ' + n + ' (the size, which means the end). The two languages disagree here. The list above follows Java, which refused.';
        } else {
          state.splice(i, 0, { k: ++key, v: v });
          state.forEach(function (c, x) { if (x === i) marks[c.k] = 'add'; else if (x > i) marks[c.k] = 'moved'; });
          j = row('java', name + '.add(' + i + ', ' + q + ');', 'nothing returned (void)');
          py = row('python', name + '.insert(' + i + ', ' + q + ')', 'returns <code>None</code>');
          note = code(v) + ' goes into index ' + i + (i < n ? '. The ' + (n - i) + ' value' + (n - i > 1 ? 's' : '') + ' after it move one place right.' : ', the end.');
        }
      } else if (op === 'set') {
        if (i >= n) {
          ok = false;
          j = row('java', name + '.set(' + i + ', ' + q + ');', IOOBE, true);
          py = row('python', name + '[' + i + '] = ' + q, 'raises <strong>IndexError</strong>: list assignment index out of range', true);
          note = 'set can only replace a value that is already there: indexes 0 to ' + (n - 1) + '.';
          if (!n) note = 'The list is empty, so there is nothing to replace.';
        } else {
          var old = state[i].v;
          state[i] = { k: ++key, v: v }; marks[key] = 'changed';
          j = row('java', name + '.set(' + i + ', ' + q + ');', 'returns the old value <code>"' + esc(old) + '"</code>');
          py = row('python', name + '[' + i + '] = ' + q, 'an assignment: no value');
          note = code(old) + ' is replaced by ' + code(v) + '. Nothing moves and the size stays ' + n + '.';
        }
      } else if (op === 'remove') {
        if (i >= n) {
          ok = false;
          j = row('java', name + '.remove(' + i + ');', IOOBE, true);
          py = row('python', name + '.pop(' + i + ')', 'raises <strong>IndexError</strong>: ' + (n ? 'pop index out of range' : 'pop from empty list'), true);
          note = n ? 'The valid indexes are 0 to ' + (n - 1) + '.' : 'The list is empty, so there is nothing to remove.';
        } else {
          var out = state.splice(i, 1)[0].v;
          state.forEach(function (c, x) { if (x >= i) marks[c.k] = 'moved'; });
          j = row('java', name + '.remove(' + i + ');', 'returns <code>"' + esc(out) + '"</code>');
          py = row('python', name + '.pop(' + i + ')', "returns <code>'" + esc(out) + "'</code>");
          note = code(out) + ' comes out' + (i < n - 1 ? '. The values after it move one place left.' : ' from the end. Nothing else moves.');
        }
      } else if (op === 'get') {
        if (i >= n) {
          ok = false;
          j = row('java', name + '.get(' + i + ');', IOOBE, true);
          py = row('python', name + '[' + i + ']', 'raises <strong>IndexError</strong>: list index out of range', true);
          note = n ? 'The valid indexes are 0 to ' + (n - 1) + '. The size, ' + n + ', is already one past the end.' : 'The list is empty, so there is no index 0.';
        } else {
          marks[state[i].k] = 'read';
          j = row('java', name + '.get(' + i + ');', 'returns <code>"' + esc(state[i].v) + '"</code>');
          py = row('python', name + '[' + i + ']', "gives <code>'" + esc(state[i].v) + "'</code>");
          note = 'Reading never changes the list.';
        }
      }
      draw(marks);
      if (needsValue && ok) vIn.value = nextName();
      result.innerHTML = j + py + '<p>' + note + '</p>' +
        '<p class="viz-muted">Java prints ' + code(javaList(state)) + ' · Python prints ' + code(pyList(state)) + '</p>';
    }
    start();
    return box;
  }

  // ═════════════ filter: removing while looping, and two fixes ═════════════
  function filterFrames(spec, strat, java, py) {
    var frames = [], lines = strat.lines;
    var cur = spec.values.map(function (v, i) { return { k: i + 1, v: v }; });
    var done = {}, skipped = {}, kept = null, keptKey = 100;
    var outJ = strat.programs.java.output.replace(/\n$/, ''), outP = strat.programs.python.output.replace(/\n$/, '');
    function snap(list, marks) {
      return list.map(function (c) {
        return { k: c.k, v: c.v, mark: (marks && marks[c.k]) || (skipped[c.k] ? 'skipped' : (done[c.k] ? 'done' : '')) };
      });
    }
    function push(role, say, o) {
      o = o || {};
      frames.push({
        cells: snap(cur, o.marks), ptr: o.ptr, ptrName: o.ptrName || 'i',
        kept: kept ? kept.map(function (c) { return { k: c.k, v: c.v, mark: (o.keptMarks || {})[c.k] || '' }; }) : null,
        lines: { java: java.line(lines.java[role]), python: py.line(lines.python[role]) },
        out: { java: role === 'print' ? outJ : '', python: role === 'print' ? outP : '' },
        vars: o.vars || '', say: say
      });
    }
    function sizeVars(i) { return '<span>i = ' + i + '</span><span>size = ' + cur.length + '</span>'; }
    push('init', 'The list starts as ' + code(javaList(cur)) + '. The goal: remove every even number.');
    var i, v, even, moved;
    if (strat.id === 'forward' || strat.id === 'backward') {
      var fwd = strat.id === 'forward';
      i = fwd ? 0 : cur.length - 1;
      push('start', fwd ? 'The loop starts with <code>i = 0</code>, the first index.' : 'The loop starts at the last index: <code>i = ' + i + '</code>.', { ptr: i, vars: sizeVars(i) });
      var firstPass = true;
      while (fwd ? i < cur.length : i >= 0) {
        // the loop condition is checked before every pass (Python: the while line)
        if (!firstPass) {
          push('loop', fwd ? 'Check the condition: <code>i</code> is ' + i + ' and the size is ' + cur.length + ', so <code>i &lt; size</code> is true and the loop goes round again.'
                           : 'Check the condition: <code>i</code> is ' + i + ', so <code>i &gt;= 0</code> is true and the loop goes round again.', { ptr: i, vars: sizeVars(i) });
        }
        firstPass = false;
        v = cur[i].v; even = v % 2 === 0;
        var m = {}; m[cur[i].k] = 'check';
        push('test', 'Check index ' + i + ': the value is ' + v + ', which is ' + (even ? 'even.' : 'odd, so it stays.'), { ptr: i, marks: m, vars: sizeVars(i) });
        var slid = null;
        if (even) {
          cur.splice(i, 1);
          moved = {};
          cur.forEach(function (c, x) { if (x >= i) moved[c.k] = 'moved'; });
          var wasLast = i === cur.length;
          if (wasLast) {
            push('remove', 'Remove index ' + i + '. It was the last value, so nothing moves.', { ptr: i, marks: moved, vars: sizeVars(i) });
          } else if (fwd) {
            slid = cur[i];
            push('remove', 'Remove index ' + i + '. Every value after it moves one place left, so the ' + slid.v +
              ' that was at index ' + (i + 1) + ' is now at index ' + i + '.', { ptr: i, marks: moved, vars: sizeVars(i) });
          } else {
            push('remove', 'Remove index ' + i + '. Only values to the right of index ' + i + ' move left, and the loop has already checked those.', { ptr: i, marks: moved, vars: sizeVars(i) });
          }
        } else {
          done[cur[i].k] = true;
        }
        if (fwd) {
          i++;
          if (slid) {
            skipped[slid.k] = true;
            push('step', '<code>i</code> goes up to ' + i + '. The ' + slid.v + ' now at index ' + (i - 1) + ' was never checked: the loop has <strong>skipped</strong> it.', { ptr: i, vars: sizeVars(i) });
          } else {
            push('step', '<code>i</code> goes up to ' + i + '.', { ptr: i, vars: sizeVars(i) });
          }
        } else {
          i--;
          push('step', '<code>i</code> goes down to ' + i + '.', { ptr: i, vars: sizeVars(i) });
        }
      }
      push('loop', fwd ? '<code>i</code> is ' + i + ' and the size is ' + cur.length + ', so <code>i &lt; size</code> is false: the loop ends.'
                       : '<code>i</code> is -1, so <code>i &gt;= 0</code> is false: the loop ends.', { ptr: i, vars: sizeVars(i) });
    } else {
      kept = [];
      push('start', 'Make a new, empty list called <code>kept</code>. The loop will only read <code>values</code>.');
      cur.forEach(function (c, x) {
        push('loop', '<code>value</code> is now ' + c.v + ' (the item at index ' + x + ').', { ptr: x, ptrName: 'value', vars: '<span>value = ' + c.v + '</span>' });
        var m = {}; m[c.k] = 'check';
        var odd = c.v % 2 !== 0;
        push('test', c.v + ' is ' + (odd ? 'odd, so it is kept.' : 'even, so it is not copied.'), { ptr: x, ptrName: 'value', marks: m, vars: '<span>value = ' + c.v + '</span>' });
        done[c.k] = true;
        if (odd) {
          kept.push({ k: ++keptKey, v: c.v });
          var km = {}; km[keptKey] = 'add';
          push('add', c.v + ' is added to the end of <code>kept</code>. <code>values</code> does not change.', { ptr: x, ptrName: 'value', keptMarks: km, vars: '<span>value = ' + c.v + '</span>' });
        }
      });
      push('loop', 'There are no more values, so the loop ends. <code>values</code> was never changed.');
    }
    push('print', strat.end);
    return frames;
  }

  function mountFilter(host, spec) {
    var body = shell(host, spec);
    var picker = segmented('Choose a version', spec.strategies.map(function (s) { return { label: s.label }; }), choose);
    body.appendChild(picker.root);
    var stage = el('div', 'viz-stage');
    var track = listTrack('values');
    var keptTrack = listTrack('kept');
    var vars = el('div', 'viz-vars');
    stage.appendChild(track.root);
    stage.appendChild(keptTrack.root);
    stage.appendChild(vars);
    body.appendChild(stage);
    var panes = el('div', 'viz-panes');
    var java, py;
    var st = stepper(host, function (f) {
      track.draw(f.cells, f.ptr, f.ptrName);
      keptTrack.hide(!f.kept);
      if (f.kept) keptTrack.draw(f.kept);
      vars.innerHTML = f.vars;
      java.mark(f.lines.java); py.mark(f.lines.python);
      java.setOut(f.out.java); py.setOut(f.out.python);
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(panes);
    function choose(n) {
      var s = spec.strategies[n];
      java = codePane('java', s.programs.java.code, { output: true });
      py = codePane('python', s.programs.python.code, { output: true });
      panes.textContent = '';
      panes.appendChild(java.root);
      panes.appendChild(py.root);
      host.dataset.strategy = s.id;
      st.set(filterFrames(spec, s, java, py));
    }
    picker.pick(0);
    choose(0);
  }

  // ═════════════ queue: linked nodes, head and tail ═════════════
  function mountQueue(host, spec) {
    var body = shell(host, spec);
    var actions = el('div', 'viz-ops');
    var bEnq = button('Enqueue', 'primary');
    var bDeq = button('Dequeue', 'ghost');
    var bReset = button('Reset', 'ghost');
    actions.appendChild(bEnq); actions.appendChild(bDeq); actions.appendChild(bReset);
    body.appendChild(actions);

    var stage = el('div', 'viz-stage viz-queue');
    var headRow = el('div', 'viz-qlabels');
    var headLab = el('div', 'viz-qlabel is-head');
    headRow.appendChild(headLab);
    var nodesBox = el('div', 'viz-nodes');
    nodesBox.setAttribute('role', 'img');
    var tailRow = el('div', 'viz-qlabels');
    var tailLab = el('div', 'viz-qlabel is-tail');
    tailRow.appendChild(tailLab);
    var nodeRow = el('div', 'viz-qlabels');
    var nodeLab = el('div', 'viz-qlabel is-local');
    nodeRow.appendChild(nodeLab);
    var track = el('div', 'viz-qtrack');
    [headRow, nodesBox, tailRow, nodeRow].forEach(function (n) { track.appendChild(n); });
    stage.appendChild(track);
    var vars = el('div', 'viz-vars');
    stage.appendChild(vars);
    body.appendChild(stage);

    var java = codePane('java', spec.panes.java.code, { first: spec.panes.java.first, label: 'from: ' + spec.panes.java.source });
    var py = codePane('python', spec.panes.python.code, { first: spec.panes.python.first, label: 'from: ' + spec.panes.python.source });
    function ln(role) { return { java: java.line(spec.lines.java[role]), python: py.line(spec.lines.python[role]) }; }

    function placeLabel(lab, name, at) {
      if (at === null || at === undefined) {
        lab.textContent = name + ' = null';
        lab.classList.add('is-null');
        lab.style.setProperty('--i', 0);
      } else {
        lab.textContent = name;
        lab.classList.remove('is-null');
        lab.style.setProperty('--i', at);
      }
    }
    function makeSlot() {
      var s = el('div', 'viz-slot');
      var n = el('div', 'viz-node');
      n.appendChild(el('span', 'nv'));
      n.appendChild(el('span', 'nn'));
      s.appendChild(n);
      s.appendChild(el('span', 'viz-link'));
      return s;
    }
    function updateSlot(s, it) {
      s.firstChild.firstChild.textContent = it.v;
      s.firstChild.lastChild.textContent = it.next ? '•' : 'null';
      s.firstChild.lastChild.title = it.next ? 'next: a link to the node behind' : 'next is null (None in Python)';
      s.dataset.mark = it.mark || '';
      s.lastChild.className = 'viz-link' + (it.next ? ' is-on' : '') + (it.linkNew ? ' is-new' : '');
    }
    var st = stepper(host, function (f) {
      flip(nodesBox, f.nodes, makeSlot, updateSlot);
      nodesBox.setAttribute('aria-label', f.nodes.length ? 'Nodes: ' + f.nodes.map(function (n) { return n.v; }).join(' then ') : 'No nodes');
      placeLabel(headLab, 'head', f.head);
      placeLabel(tailLab, 'tail', f.tail);
      nodeLab.hidden = f.node === null || f.node === undefined;
      if (!nodeLab.hidden) placeLabel(nodeLab, 'node', f.node);
      vars.innerHTML = f.vars;
      java.mark(f.lines ? f.lines.java : 0);
      py.mark(f.lines ? f.lines.python : 0);
      label();
      // on a phone the chain can be wider than the stage: keep the node being worked on in view
      var focusAt = f.node !== null && f.node !== undefined ? f.node : (f.tail !== null && f.tail !== undefined ? f.tail : f.head);
      var slot = focusAt !== null && focusAt !== undefined ? nodesBox.children[focusAt] : null;
      if (slot && !slot.classList.contains('is-leaving')) {
        var sr = slot.getBoundingClientRect(), gr = stage.getBoundingClientRect();
        if (sr.right > gr.right - 8) stage.scrollLeft += sr.right - gr.right + 24;
        else if (sr.left < gr.left + 8) stage.scrollLeft -= gr.left - sr.left + 24;
      }
    });
    // the Enqueue label always names the value the next enqueue will really add
    function label() { bEnq.textContent = 'Enqueue "' + spec.pool[poolAt % spec.pool.length] + '"'; }
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var panes = el('div', 'viz-panes');
    panes.appendChild(java.root);
    panes.appendChild(py.root);
    body.appendChild(panes);

    // the model after every finished operation
    var model, key, poolAt, returned;
    function snapshot(extra) {
      var f = {
        nodes: model.nodes.map(function (n) { return { k: n.k, v: n.v, next: n.next, mark: '' }; }),
        head: model.head, tail: model.tail, node: null, lines: null,
        vars: '', say: ''
      };
      for (var k in extra) f[k] = extra[k];
      return f;
    }
    function callVars(call, more) {
      return '<span>' + esc(call) + '</span>' + (more || '') +
        (returned.length ? '<span>returned so far: ' + esc(returned.join(', ')) + '</span>' : '');
    }
    function reset() {
      model = { nodes: [], head: null, tail: null };
      key = 0; poolAt = 0; returned = [];
      st.set([snapshot({ vars: callVars('queue is empty'), say: 'The queue is empty: <code>head</code> and <code>tail</code> are both <code>null</code> (<code>None</code> in Python). Press <strong>Enqueue</strong>.' })]);
    }
    function enqueue() {
      st.toEnd();
      if (model.nodes.length >= spec.max) {
        st.say.innerHTML = 'This demo stops at ' + spec.max + ' nodes. Dequeue someone first.';
        return;
      }
      var v = spec.pool[poolAt % spec.pool.length];
      poolAt++;
      var call = 'queue.enqueue("' + v + '")';
      var frames = [], wasEmpty = model.tail === null, oldTail = model.tail;
      model.nodes.push({ k: ++key, v: v, next: false });
      var idx = model.nodes.length - 1;
      function f(role, say, o) {
        o = o || {};
        var fr = snapshot({ node: idx, lines: ln(role), say: say, vars: callVars(call, '<span>value = "' + esc(v) + '"</span>') });
        fr.nodes[idx].mark = 'new';
        if (o.linkNew) fr.nodes[oldTail].linkNew = true;
        frames.push(fr);
      }
      f('new', 'A new node holds ' + code(v) + '. Its <code>next</code> is <code>null</code>, and no node links to it yet.');
      f('check', wasEmpty ? '<code>tail</code> is <code>null</code>: the queue is empty, so take the first branch.'
                          : '<code>tail</code> is not <code>null</code>: there is already a back node, ' + code(model.nodes[oldTail].v) + '.');
      if (wasEmpty) {
        model.head = idx;
        f('head', '<code>head = node</code>: the new node is the front of the queue.');
      } else {
        model.nodes[oldTail].next = true;
        f('link', '<code>tail.next = node</code>: the old back node, ' + code(model.nodes[oldTail].v) + ', now links to the new one. No value moved.', { linkNew: true });
      }
      model.tail = idx;
      f('tail', '<code>tail = node</code>: the new node is now the back. Enqueue never walks along the chain, however long it is.');
      st.append(frames);
      st.next.focus();
    }
    function dequeue() {
      st.toEnd();
      if (model.head === null) {
        st.say.innerHTML = 'The queue is empty: <code>head</code> is <code>null</code>, so <code>head.value</code> would crash ' +
          '(Java: <code>NullPointerException</code>; Python: <code>AttributeError</code>). Real code checks <code>isEmpty()</code> first.';
        java.mark(java.line(spec.lines.java.read), 'bad');
        py.mark(py.line(spec.lines.python.read), 'bad');
        return;
      }
      var call = 'queue.dequeue()';
      var frames = [], front = model.nodes[0], v = front.v;
      function f(role, say, o) {
        o = o || {};
        var fr = snapshot({ lines: ln(role), say: say, vars: callVars(call, '<span>value = "' + esc(v) + '"</span>') });
        if (o.mark) fr.nodes[0].mark = o.mark;
        if (o.head !== undefined) fr.head = o.head;
        if (o.tail !== undefined) fr.tail = o.tail;
        frames.push(fr);
      }
      var single = model.nodes.length === 1;
      f('read', '<code>value = head.value</code>: remember ' + code(v) + ', the value at the front.', { mark: 'read' });
      f('advance', single ? '<code>head = head.next</code>: the front node\'s <code>next</code> was <code>null</code>, so <code>head</code> is now <code>null</code>.'
                          : '<code>head = head.next</code>: follow the link. The front is now ' + code(model.nodes[1].v) + '. Nothing refers to the ' + code(v) + ' node any more.',
        { mark: 'gone', head: single ? null : 1 });
      f('empty', single ? '<code>head</code> is <code>null</code>: the queue has just become empty.'
                        : '<code>head</code> is not <code>null</code>, so <code>tail</code> stays where it is.',
        { mark: 'gone', head: single ? null : 1 });
      if (single) f('clear', '<code>tail = null</code>: the back must not keep pointing at the node that just left.', { mark: 'gone', head: null, tail: null });
      // the method returns; the unreachable node disappears and the rest slide along
      model.nodes.shift();
      model.head = model.nodes.length ? 0 : null;
      model.tail = model.nodes.length ? model.nodes.length - 1 : null;
      returned.push(v);
      frames.push(snapshot({ lines: ln('ret'), vars: callVars(call, '<span>value = "' + esc(v) + '"</span>'),
        say: '<code>return value</code>: the caller gets ' + code(v) + '. Its old node is unreachable, so its memory can be reclaimed. First in, first out.' }));
      st.append(frames);
      st.next.focus();
    }
    bEnq.addEventListener('click', enqueue);
    bDeq.addEventListener('click', dequeue);
    bReset.addEventListener('click', reset);
    reset();
  }

  // ═════════════ box: Box<T>, with T filled in ═════════════
  function mountBox(host, spec) {
    var body = shell(host, spec);
    var controls = el('div', 'viz-form');
    var picker = segmented('Type for T', spec.variants.map(function (v) { return { label: v.type, mono: true }; }), function (n) { at = n; draw(); });
    var tLab = el('span', 'viz-field-label', 'Box of:');
    controls.appendChild(tLab);
    controls.appendChild(picker.root);
    var fill = el('button', 'viz-seg-btn viz-toggle', 'Fill in T');
    fill.type = 'button';
    fill.setAttribute('aria-pressed', 'false');
    fill.addEventListener('click', function () { filled = !filled; fill.setAttribute('aria-pressed', String(filled)); draw(); });
    controls.appendChild(fill);
    body.appendChild(controls);
    var pane = codePane('java', spec.template.replace(/\{\{TYPE\}\}/g, 'T').replace(/\{\{VALUE\}\}/g, '0'), { output: true });
    body.appendChild(pane.root);
    var say = el('div', 'viz-say');
    say.setAttribute('aria-live', 'polite');
    body.appendChild(say);
    var at = 0, filled = false;
    var SUB_OPEN = '⟦', SUB_CLOSE = '⟧', T_OPEN = '⟪', T_CLOSE = '⟫';
    function draw() {
      var v = spec.variants[at];
      var lines = spec.template.replace(/\n+$/, '').split('\n');
      var classAt = -1;
      var text = lines.map(function (l, i) {
        l = l.replace(/\{\{TYPE\}\}/g, SUB_OPEN + v.type + SUB_CLOSE).replace(/\{\{VALUE\}\}/g, v.value);
        if (/^class \w+<T>/.test(l)) {
          classAt = i;
          return l.replace(/<T>/, '<' + T_OPEN + 'T' + T_CLOSE + '>') + (filled ? '   // read every T as ' + v.type : '');
        }
        if (classAt >= 0) l = l.replace(/\bT\b/g, filled ? SUB_OPEN + v.type + SUB_CLOSE : T_OPEN + 'T' + T_CLOSE);
        return l;
      }).join('\n');
      var html = highlight(text, 'java').map(function (l) {
        return l.split(SUB_OPEN).join('<span class="viz-sub">').split(SUB_CLOSE).join('</span>')
                .split(T_OPEN).join('<span class="viz-t">').split(T_CLOSE).join('</span>');
      });
      pane.setHtml(html);
      pane.setOut(v.output.replace(/\n$/, ''));
      var t = code(v.type), boxT = code('Box<' + v.type + '>');
      say.innerHTML = filled
        ? 'For ' + boxT + ', read every <code>T</code> as ' + t + '. That is what the compiler checks: the constructor only accepts ' +
          (v.type === 'Integer' ? 'an ' : 'a ') + t + ', and <code>get()</code> gives back ' + (v.type === 'Integer' ? 'an ' : 'a ') + t +
          ', so no cast is needed. There is still only one <code>Box</code> class.'
        : '<code>T</code> is a <strong>type parameter</strong>: a placeholder for a type. Writing ' + boxT +
          ' chooses ' + t + ' for it. Press <strong>Fill in T</strong> to see what that means.';
    }
    picker.pick(0);
    draw();
  }

  // ═════════════ typecheck: what does the compiler say? ═════════════
  function mountTypecheck(host, spec) {
    var body = shell(host, spec);
    var d = 0, s = 0;
    var form = el('div', 'viz-form');
    form.appendChild(el('span', 'viz-field-label', 'Declare:'));
    var decl = segmented('Declare the list as', spec.decls.map(function (x) { return { label: x.label, mono: true }; }), function (n) { d = n; draw(); });
    form.appendChild(decl.root);
    body.appendChild(form);
    var form2 = el('div', 'viz-form');
    form2.appendChild(el('span', 'viz-field-label', 'Then try:'));
    var stmt = segmented('Statement to try', spec.stmts.map(function (x) { return { label: x.code, mono: true }; }), function (n) { s = n; draw(); });
    stmt.root.classList.add('viz-seg-wrap');
    form2.appendChild(stmt.root);
    body.appendChild(form2);
    var grid = el('div', 'viz-panes');
    var paneBox = el('div');
    var verdict = el('div', 'viz-verdict');
    verdict.setAttribute('aria-live', 'polite');
    grid.appendChild(paneBox);
    grid.appendChild(verdict);
    body.appendChild(grid);
    function draw() {
      var D = spec.decls[d], S = spec.stmts[s], r = S.results[D.id];
      var src = spec.template.replace('{{DECL}}', D.code).replace('{{STMT}}', S.code);
      var pane = codePane('java', src, { label: 'Demo.java' });
      paneBox.textContent = '';
      paneBox.appendChild(pane.root);
      pane.mark(pane.line(S.code), r.ok ? 'ok' : 'bad');
      var h = '<p class="viz-big ' + (r.ok ? 'viz-good' : 'viz-bad') + '">' + (r.ok ? '✓ Compiles' : '✗ Does not compile: nothing runs') + '</p>';
      if (r.javac) h += '<div class="viz-out-label">javac says</div><pre class="console-out viz-out' + (r.ok ? '' : ' is-error') + '">' + esc(r.javac) + '</pre>';
      h += '<p>' + r.say + '</p>';
      h += '<div class="viz-line"><span class="lang python">Python</span><span>' + S.py + '</span></div>';
      verdict.innerHTML = h;
    }
    decl.pick(0);
    stmt.pick(0);
    draw();
  }

  var KINDS = { 'list-ops': mountListOps, filter: mountFilter, queue: mountQueue, box: mountBox, typecheck: mountTypecheck };

  function mountAll(root) {
    (root || document).querySelectorAll('.p1-viz').forEach(function (host) {
      if (host.dataset.mounted) return;
      var node = host.querySelector('script[data-role="spec"]');
      var mount = KINDS[host.dataset.kind];
      if (!node || !mount) { console.warn('P1Visuals: cannot mount', host); return; }
      host.dataset.mounted = '1';
      try {
        mount(host, JSON.parse(node.textContent));
      } catch (err) {
        console.error('P1Visuals: failed to draw', host.dataset.title, err);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mountAll(); });
  else mountAll();

  return { mountAll: mountAll };
})();
