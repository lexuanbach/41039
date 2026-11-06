/* 41039 Programming 1 — Week 8 diagram kinds (inheritance, dispatch, interfaces, MRO).
 *
 * Loaded after assets/visuals.js by the generator; each kind is registered with
 * P1Visuals.register(kind, fn(host, spec, h)). Every program a diagram shows is listed in
 * spec.programs, and scripts/check_week_content.py runs it and checks its output and the line
 * markers (tokens). Printed text on a diagram is always cut from that real output.
 *
 *   calltrace  a scripted step-through: call stack, objects with their parts, code panes
 *   dispatch   a class tree: pick an object and a method, predict, then watch the lookup walk up
 *   declared   declared type versus object type: one object, two label fields, one override
 *   overload   predict two choices per call: which overload (compile time) and which override (run time)
 *   abc        try to construct classes of a Python ABC; the abstract-method checklist decides
 *   socket     one contract, many objects: step a loop or calls through it (interfaces, duck typing)
 *   mro        Python's method resolution order: walk it, or follow super() along it
 */
(function () {
  'use strict';
  if (!window.P1Visuals) return;
  var LANG = { java: 'Java', python: 'Python' };
  var SVGNS = 'http://www.w3.org/2000/svg';

  // ───────────── shared pieces ─────────────
  function setLangs(h, host, langs) {
    var box = host.querySelector('.viz-langs');
    if (!box) return;
    box.textContent = '';
    langs.forEach(function (l) { box.appendChild(h.el('span', 'lang ' + l, LANG[l])); });
  }
  function langsOf(programs) {
    var seen = [];
    programs.forEach(function (p) { if (seen.indexOf(p.lang) < 0) seen.push(p.lang); });
    return seen;
  }
  function lines(text) { return text.replace(/\n$/, '').split('\n'); }
  function firstLines(text, n) { return lines(text).slice(0, n).join('\n'); }
  function panesBox(h) { return h.el('div', 'viz-panes'); }
  /* a code pane per program, with its output box; label names the file */
  function makePanes(h, programs, box) {
    box.textContent = '';
    return programs.map(function (p) {
      var pane = h.codePane(p.lang, p.code, { output: true, label: p.label || (p.lang === 'java' ? 'Demo.java' : 'main.py') });
      box.appendChild(pane.root);
      return pane;
    });
  }
  function keepFocus(from, to) {
    // a control that is about to disappear or be disabled hands focus on, so it never drops to <body>
    if (document.activeElement === from && to) to.focus();
  }

  /* A class diagram: boxes on a grid and inheritance links drawn with an arrowhead at the parent
     (the UML hollow triangle). Links are redrawn whenever the diagram changes size, which also
     covers a diagram that was inside a hidden section when it was built. */
  var graphId = 0;
  function classGraph(h, classes, opts) {
    opts = opts || {};
    var root = h.el('div', 'w8-graph');
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'w8-links');
    svg.setAttribute('aria-hidden', 'true');
    var mid = 'w8-tri-' + (++graphId);
    svg.innerHTML = '<defs><marker id="' + mid + '" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto-start-reverse">' +
      '<path d="M1,1 L11,6 L1,11 Z" class="w8-tri"></path></marker></defs>';
    root.appendChild(svg);
    var grid = h.el('div', 'w8-graph-grid');
    var cols = 1;
    classes.forEach(function (c) { cols = Math.max(cols, c.col + (c.span || 1) - 1); });
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
    root.appendChild(grid);
    var boxes = {}, rows = {};
    classes.forEach(function (c) {
      var b = h.el('div', 'w8-cls');
      b.style.gridRow = String(c.row);
      b.style.gridColumn = c.col + (c.span ? ' / span ' + c.span : '');
      var head = h.el('div', 'w8-cls-name');
      head.innerHTML = c.head || h.esc(c.name);
      b.appendChild(head);
      var list = h.el('div', 'w8-cls-methods');
      rows[c.name] = {};
      (c.methods || []).forEach(function (m) {
        var r = h.el('div', 'w8-cls-m', m.label || m.name);
        if (m.tag) r.appendChild(h.el('span', 'w8-tag', m.tag));
        rows[c.name][m.name] = r;
        list.appendChild(r);
      });
      if (!(c.methods || []).length && opts.emptyText) list.appendChild(h.el('div', 'w8-cls-m is-none', opts.emptyText));
      b.appendChild(list);
      boxes[c.name] = b;
      grid.appendChild(b);
    });
    function links() {
      var r = root.getBoundingClientRect();
      if (!r.width) return;
      svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
      svg.setAttribute('width', r.width);
      svg.setAttribute('height', r.height);
      Array.prototype.slice.call(svg.querySelectorAll('line')).forEach(function (l) { l.remove(); });
      classes.forEach(function (c) {
        (c.bases || []).forEach(function (base) {
          if (!boxes[base]) return;
          var a = boxes[c.name].getBoundingClientRect(), b = boxes[base].getBoundingClientRect();
          var line = document.createElementNS(SVGNS, 'line');
          var x1 = a.left + a.width / 2 - r.left, y1 = a.top - r.top;
          var x2 = b.left + b.width / 2 - r.left, y2 = b.bottom - r.top;
          // two bases of one class: start the links apart so both arrows read
          if ((c.bases || []).length > 1) x1 += (c.bases.indexOf(base) - (c.bases.length - 1) / 2) * 28;
          line.setAttribute('x1', x1); line.setAttribute('y1', y1);
          line.setAttribute('x2', x2); line.setAttribute('y2', y2 + 2);
          line.setAttribute('class', 'w8-link');
          line.setAttribute('marker-end', 'url(#' + mid + ')');
          svg.appendChild(line);
        });
      });
    }
    if (window.ResizeObserver) new ResizeObserver(links).observe(root);
    window.addEventListener('resize', links);
    return {
      root: root,
      links: links,
      /* state: {ClassName: 'declared' | 'look' | 'skip' | 'found' | 'next' | ...} */
      mark: function (state, methodMarks) {
        Object.keys(boxes).forEach(function (n) {
          boxes[n].dataset.state = (state && state[n]) || '';
          Object.keys(rows[n]).forEach(function (m) {
            rows[n][m].dataset.state = (methodMarks && methodMarks[n + '.' + m]) || '';
          });
        });
      }
    };
  }

  // ═════════════ calltrace: stack, objects, code ═════════════
  P1Visuals.register('calltrace', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(h, host, langsOf(spec.programs));
    var variants = spec.variants || [{ label: '', use: spec.programs.map(function (_, i) { return i; }), steps: spec.steps }];
    var picker = null;
    if (variants.length > 1) {
      var form = h.el('div', 'viz-form');
      form.appendChild(h.el('span', 'viz-field-label', spec.pickLabel || 'Version:'));
      picker = h.segmented(spec.pickLabel || 'Version', variants.map(function (v) { return { label: v.label }; }), choose);
      form.appendChild(picker.root);
      body.appendChild(form);
    }
    var stage = h.el('div', 'viz-stage w8-trace');
    var colS = h.el('div', 'w8-col');
    colS.appendChild(h.el('div', 'w8-col-title', 'Call stack (top = running now)'));
    var stackBox = h.el('div', 'w8-stack');
    colS.appendChild(stackBox);
    var colH = h.el('div', 'w8-col');
    colH.appendChild(h.el('div', 'w8-col-title', 'Objects'));
    var heapBox = h.el('div', 'w8-heap');
    colH.appendChild(heapBox);
    stage.appendChild(colS);
    stage.appendChild(colH);
    body.appendChild(stage);
    var panes = [], use = [], marks = [];
    var st = h.stepper(host, function (f) {
      stackBox.textContent = '';
      f.stack.slice().reverse().forEach(function (fr, i) {
        var d = h.el('div', 'w8-frame' + (i === 0 ? ' is-top' : ''));
        var n = h.el('div', 'w8-frame-name');
        n.innerHTML = fr.f;
        d.appendChild(n);
        if (fr.v) { var v = h.el('div', 'w8-frame-vars'); v.innerHTML = fr.v; d.appendChild(v); }
        stackBox.appendChild(d);
      });
      heapBox.textContent = '';
      if (!f.objs.length) heapBox.appendChild(h.el('p', 'viz-muted', 'No objects yet.'));
      f.objs.forEach(function (o) {
        var card = h.el('div', 'w8-obj');
        if (o.mark) card.dataset.mark = o.mark;
        var t = h.el('div', 'w8-obj-title');
        t.innerHTML = o.title;
        card.appendChild(t);
        // parts are listed base first, so the base part sits at the bottom like a foundation
        var layers = h.el('div', 'w8-layers');
        (o.parts || []).forEach(function (p) {
          var layer = h.el('div', 'w8-layer');
          if (p.mark) layer.dataset.mark = p.mark;
          layer.appendChild(h.el('div', 'w8-layer-label', p.label));
          (p.fields || []).forEach(function (fd) {
            var row = h.el('div', 'w8-field');
            if (fd[2]) row.dataset.mark = fd[2];
            row.innerHTML = '<span class="w8-fname">' + h.esc(fd[0]) + '</span><span class="w8-fval">' + h.esc(fd[1]) + '</span>';
            layer.appendChild(row);
          });
          layers.insertBefore(layer, layers.firstChild);
        });
        card.appendChild(layers);
        heapBox.appendChild(card);
      });
      use.forEach(function (pi, k) {
        panes[k].mark(marks[f.i][k], f.tone && f.tone[k]);
        var n = Array.isArray(f.out) ? f.out[k] : (f.out || 0);
        panes[k].setOut(n ? firstLines(spec.programs[pi].output, n) : '');
      });
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var box = panesBox(h);
    body.appendChild(box);
    function choose(n) {
      var v = variants[n];
      use = v.use;
      panes = makePanes(h, use.map(function (i) { return spec.programs[i]; }), box);
      marks = v.steps.map(function (s) {
        return use.map(function (_, k) { return s.at[k] ? panes[k].line(s.at[k]) : 0; });
      });
      st.set(v.steps.map(function (s, i) {
        return { i: i, stack: s.stack, objs: s.objs || [], out: s.out, say: s.say, tone: s.tone };
      }));
    }
    if (picker) picker.pick(0);
    choose(0);
  });

  // ═════════════ dispatch: which override runs? ═════════════
  P1Visuals.register('dispatch', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(h, host, langsOf(spec.programs));
    var byName = {};
    spec.classes.forEach(function (c) { byName[c.name] = c; });
    var obj = 0, meth = 0, guess = null, tally = { right: 0, tries: 0, seen: {} };

    var f1 = h.el('div', 'viz-form');
    f1.appendChild(h.el('span', 'viz-field-label', 'The object:'));
    var oPick = h.segmented('The object pet refers to', spec.objects.map(function (o) { return { label: o.label, mono: true }; }), function (n) { obj = n; reset(); });
    f1.appendChild(oPick.root);
    body.appendChild(f1);
    var f2 = h.el('div', 'viz-form');
    f2.appendChild(h.el('span', 'viz-field-label', 'The call:'));
    var mPick = h.segmented('The method to call', spec.methods.map(function (m) { return { label: 'pet.' + m + '()', mono: true }; }), function (n) { meth = n; reset(); });
    f2.appendChild(mPick.root);
    body.appendChild(f2);

    var predict = h.el('div', 'w8-predict');
    var pq = h.el('p', 'w8-predict-q');
    predict.appendChild(pq);
    var pRow = h.el('div', 'viz-ops');
    var pButtons = spec.classes.map(function (c) {
      var b = h.button(c.name, 'ghost mono');
      b.addEventListener('click', function () { guess = c.name; score(); st.set(frames(), 0); pRow.hidden = true; keepFocus(b, st.next); st.next.focus(); });
      pRow.appendChild(b);
      return b;
    });
    predict.appendChild(pRow);
    var pTally = h.el('p', 'viz-muted');
    predict.appendChild(pTally);
    body.appendChild(predict);

    var stage = h.el('div', 'viz-stage w8-stage w8-dispatch-stage');
    var g = classGraph(h, spec.classes.map(function (c) {
      return { name: c.name, bases: c.parent ? [c.parent] : [], row: c.row, col: c.col, span: c.span,
        head: 'class ' + h.esc(c.name) + (c.parent ? ' <span class="w8-ext">extends ' + h.esc(c.parent) + '</span>' : ''),
        methods: Object.keys(c.methods).map(function (m) { return { name: m, label: m + '()', tag: c.parent ? 'override' : '' }; }) };
    }), { emptyText: '(no methods of its own)' });
    stage.appendChild(g.root);
    var vars = h.el('div', 'viz-vars');
    stage.appendChild(vars);
    body.appendChild(stage);
    var st = h.stepper(host, render);
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var box = panesBox(h);
    body.appendChild(box);
    var panes = makePanes(h, spec.programs, box);

    function resultOf(o, m) {
      var parts = lines(spec.programs[0].output)[o].split(spec.separator);
      return parts[m];
    }
    function chain(cls) {
      var out = [];
      for (var c = byName[cls]; c; c = byName[c.parent]) out.push(c.name);
      return out;
    }
    function owner(cls, m) {
      var ch = chain(cls);
      for (var i = 0; i < ch.length; i++) if (byName[ch[i]].methods[m]) return ch[i];
      return null;
    }
    function frames() {
      var O = spec.objects[obj], m = spec.methods[meth], ch = chain(O.cls), out = [];
      var call = 'pet.' + m + '()';
      var callLines = panes.map(function (p, k) { return p.line(spec.call[k]); });
      out.push({ state: (function () { var s = {}; s[spec.declared] = 'declared'; return s; })(), lines: callLines,
        vars: '<span>declared type: ' + h.esc(spec.declared) + '</span><span>object: ' + h.esc(O.cls) + '</span>',
        say: '<strong>Compile time.</strong> <code>pet</code> is declared as <code>' + h.esc(spec.declared) + '</code>, and <code>' + h.esc(spec.declared) +
          '</code> has <code>' + m + '()</code>, so Java accepts <code>' + call + '</code>. That check never looks at the object. (Python checks nothing before it runs.)' });
      var found = null;
      for (var i = 0; i < ch.length && !found; i++) {
        var c = ch[i], s = {}, mm = {};
        ch.slice(0, i).forEach(function (x) { s[x] = 'skip'; });
        if (byName[c].methods[m]) {
          found = c;
          s[c] = 'found';
          mm[c + '.' + m] = 'found';
          out.push({ state: s, mm: mm, lines: panes.map(function (p, k) { return p.line(byName[c].methods[m][k]); }),
            vars: '<span>object: ' + h.esc(O.cls) + '</span><span>runs: ' + h.esc(c) + '.' + m + '()</span>',
            say: (i === 0 ? '<strong>Run time.</strong> The object is a <code>' + h.esc(O.cls) + '</code>, so the search starts in class <code>' + h.esc(c) + '</code>. ' : '') +
              '<code>' + h.esc(c) + '</code> has its own <code>' + m + '()</code>: <strong>this one runs</strong>.' });
        } else {
          s[c] = 'look';
          out.push({ state: s, mm: mm, lines: callLines,
            vars: '<span>object: ' + h.esc(O.cls) + '</span><span>looking in: ' + h.esc(c) + '</span>',
            say: (i === 0 ? '<strong>Run time.</strong> The object is a <code>' + h.esc(O.cls) + '</code>, so the search starts in class <code>' + h.esc(c) + '</code>. ' : '') +
              '<code>' + h.esc(c) + '</code> has no <code>' + m + '()</code> of its own, so look in its superclass, <code>' + h.esc(byName[c].parent) + '</code>.' });
        }
      }
      var last = out[out.length - 1];
      out.push({ state: last.state, mm: last.mm, lines: last.lines, result: true,
        vars: last.vars + '<span>returns "' + h.esc(resultOf(obj, meth)) + '"</span>',
        say: '<code>' + call + '</code> returns <code>"' + h.esc(resultOf(obj, meth)) + '"</code>. The declared type never changed; only the object decided.' });
      return out;
    }
    function render(f) {
      g.mark(f.state, f.mm);
      vars.innerHTML = f.vars;
      panes.forEach(function (p, k) { p.mark(f.lines[k]); p.setOut(f.result ? lines(spec.programs[k].output)[obj] : ''); });
      if (f.result && guess) {
        var right = guess === owner(spec.objects[obj].cls, spec.methods[meth]);
        st.say.innerHTML += ' <span class="' + (right ? 'viz-good' : 'viz-bad') + '">You predicted <code>' + h.esc(guess) + '</code>: ' + (right ? 'right.' : 'not this time.') + '</span>';
      }
    }
    function score() {
      var key = obj + ':' + meth;
      if (tally.seen[key]) return;
      tally.seen[key] = true;
      tally.tries++;
      if (guess === owner(spec.objects[obj].cls, spec.methods[meth])) tally.right++;
      pTally.textContent = 'Your predictions: ' + tally.right + ' right out of ' + tally.tries + ' (first guess for each pair counts).';
    }
    function reset() {
      guess = null;
      var O = spec.objects[obj], m = spec.methods[meth];
      pq.innerHTML = '<strong>Predict:</strong> <code>' + h.esc(spec.declared) + ' pet = ' + h.esc(O.label) + ';</code> then <code>pet.' + m + '()</code>. Whose <code>' + m + '()</code> runs?';
      pRow.hidden = false;
      var f = frames();
      st.set(f, 0);
    }
    oPick.pick(0);
    mPick.pick(0);
    reset();
  });

  // ═════════════ declared: declared type versus object type ═════════════
  P1Visuals.register('declared', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(h, host, ['java']);
    var at = 0;
    var form = h.el('div', 'viz-form');
    form.appendChild(h.el('span', 'viz-field-label', 'Declare value as:'));
    var pick = h.segmented('Declared type of value', spec.variants.map(function (v) { return { label: v.label, mono: true }; }), function (n) { at = n; choose(); });
    form.appendChild(pick.root);
    body.appendChild(form);
    var stage = h.el('div', 'viz-stage w8-declared');
    var varBox = h.el('div', 'w8-var');
    var arrow = h.el('div', 'w8-arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    var objBox = h.el('div', 'w8-obj w8-obj-wide');
    stage.appendChild(varBox);
    stage.appendChild(arrow);
    stage.appendChild(objBox);
    body.appendChild(stage);
    var st = h.stepper(host, render);
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var box = panesBox(h);
    body.appendChild(box);
    var pane, V, P;
    function render(f) {
      varBox.innerHTML = '<span class="w8-var-type">' + h.esc(V.declared) + '</span><span class="w8-var-name">value</span>' +
        (f.n >= 0 ? '' : '');
      varBox.dataset.mark = f.focus === 'var' ? 'look' : '';
      var fields = spec.fields.map(function (fd) {
        var m = f.field === fd.owner ? 'read' : '';
        return '<div class="w8-field"' + (m ? ' data-mark="' + m + '"' : '') + '><span class="w8-fname">label <em>from ' + h.esc(fd.owner) + '</em></span><span class="w8-fval">"' + h.esc(fd.value) + '"</span></div>';
      }).join('');
      var methods = spec.methods.map(function (md) {
        var m = f.method === md.owner ? 'found' : (f.method && md.owner !== f.method ? 'skip' : '');
        return '<div class="w8-field"' + (m ? ' data-mark="' + m + '"' : '') + '><span class="w8-fname">describe() <em>from ' + h.esc(md.owner) + '</em></span><span class="w8-fval">' + h.esc(md.note) + '</span></div>';
      }).join('');
      objBox.innerHTML = '<div class="w8-obj-title">a <strong>Child</strong> object</div>' +
        '<div class="w8-layer"><div class="w8-layer-label">fields (both exist)</div>' + fields + '</div>' +
        '<div class="w8-layer"><div class="w8-layer-label">methods</div>' + methods + '</div>';
      objBox.dataset.mark = f.focus === 'obj' ? 'look' : '';
      pane.mark(f.line);
      pane.setOut(f.out ? firstLines(P.output, f.out) : '');
    }
    function choose() {
      V = spec.variants[at];
      P = spec.programs[V.program];
      pane = makePanes(h, [P], box)[0];
      var L = function (k) { return pane.line(V.tokens[k]); };
      var out = lines(P.output);
      st.set([
        { line: L('create'), focus: 'obj', out: 0,
          say: 'A <code>Child</code> object is made. It holds <strong>two</strong> fields called <code>label</code>: the one declared in <code>Parent</code> and the one declared in <code>Child</code>. A field is never overridden; the child field only <em>hides</em> the parent one.' },
        { line: L('create'), focus: 'var', out: 0,
          say: 'The variable <code>value</code> is declared as <code>' + h.esc(V.declared) + '</code>. That declared type is all the compiler knows about it; the object itself is still a <code>Child</code>.' },
        { line: L('field'), field: V.declared, out: 1,
          say: '<code>value.label</code> is a field, so Java picks it using the <strong>declared type</strong>, ' + h.esc(V.declared) + ', while compiling. It prints <code>' + h.esc(out[0]) + '</code>.' },
        { line: L('call'), method: 'Child', focus: 'obj', out: 1,
          say: '<code>value.describe()</code> is an overridden instance method, so the <strong>object</strong> decides, while the program runs. The object is a <code>Child</code>, so <code>Child</code>\'s <code>describe()</code> is chosen.' },
        { line: L('body'), method: 'Child', out: 1,
          say: 'Inside <code>Child</code>\'s <code>describe()</code>. ' + (V.declared === 'Parent' ? 'The declared type <code>Parent</code> made no difference here.' : 'Same as with <code>Parent value</code>: the object is a Child either way.') },
        { line: L('call'), method: 'Child', out: 2,
          say: 'It prints <code>' + h.esc(out[1]) + '</code>. ' + (V.declared === 'Parent'
            ? 'So the same variable gave the <em>parent</em> field but the <em>child</em> method. Now switch to <code>Child value</code>.'
            : 'With <code>Child value</code> both lines come from Child. Only the field changed: methods follow the object, fields follow the declared type.') }
      ]);
    }
    pick.pick(0);
    choose();
  });

  // ═════════════ overload: which overload, then which override? ═════════════
  P1Visuals.register('overload', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(h, host, ['java', 'python']);
    var q = 0, picks = {}, checked = false, results = [];
    var card = h.el('div', 'w8-quiz');
    var qHead = h.el('div', 'w8-quiz-head');
    card.appendChild(qHead);
    var qCall = h.el('p', 'w8-quiz-call');
    card.appendChild(qCall);
    var parts = spec.parts.map(function (part) {
      var wrap = h.el('div', 'w8-quiz-part');
      var label = h.el('p', 'w8-quiz-label');
      label.innerHTML = part.ask;
      wrap.appendChild(label);
      var seg = h.segmented(part.ask.replace(/<[^>]+>/g, ''), part.options.map(function (o) { return { label: o.label, mono: true }; }), function (n) {
        if (checked) return;
        picks[part.id] = part.options[n].id;
        bCheck.disabled = Object.keys(picks).length < spec.parts.length;
      });
      wrap.appendChild(seg.root);
      var verdict = h.el('p', 'w8-quiz-verdict');
      wrap.appendChild(verdict);
      card.appendChild(wrap);
      return { part: part, seg: seg, verdict: verdict };
    });
    var bar = h.el('div', 'viz-ops');
    var bCheck = h.button('Check my answers', 'primary');
    var bNext = h.button('Next call ▶', 'ghost');
    var score = h.el('span', 'viz-count');
    bar.appendChild(bCheck); bar.appendChild(bNext); bar.appendChild(score);
    card.appendChild(bar);
    var say = h.el('div', 'viz-say');
    say.setAttribute('aria-live', 'polite');
    card.appendChild(say);
    body.appendChild(card);
    var box = panesBox(h);
    body.appendChild(box);
    var panes = makePanes(h, [spec.programs[0]], box);
    var pyBox = h.el('div', 'w8-aside');
    pyBox.hidden = true;
    var pyNote = h.el('p');
    pyNote.innerHTML = spec.pythonNote;
    pyBox.appendChild(pyNote);
    var pyPanes = panesBox(h);
    pyBox.appendChild(pyPanes);
    body.appendChild(pyBox);
    var py = makePanes(h, [spec.programs[1]], pyPanes)[0];
    py.setOut(spec.programs[1].output.replace(/\n$/, ''));
    py.mark(py.line(spec.pythonToken));

    var out = lines(spec.programs[0].output);
    function show() {
      var Q = spec.questions[q];
      checked = false; picks = {};
      qHead.textContent = 'Call ' + (q + 1) + ' of ' + spec.questions.length;
      qCall.innerHTML = Q.setup + ' <code class="w8-big">' + h.esc(Q.call) + '</code>';
      parts.forEach(function (p) {
        p.seg.pick(-1);
        p.seg.buttons.forEach(function (b) { b.disabled = false; b.removeAttribute('data-verdict'); });
        p.verdict.textContent = '';
      });
      bCheck.disabled = true;
      bCheck.hidden = false;
      bNext.hidden = true;
      say.innerHTML = '';
      panes[0].mark(panes[0].line(Q.call));
      panes[0].setOut(firstLines(spec.programs[0].output, q));
      label();
    }
    function label() {
      var right = results.filter(function (r) { return r; }).length;
      score.textContent = results.length ? right + ' of ' + results.length + ' calls fully right' : '';
    }
    function check() {
      var Q = spec.questions[q], all = true;
      checked = true;
      parts.forEach(function (p) {
        var want = Q.answers[p.part.id], got = picks[p.part.id];
        var ok = want === got;
        all = all && ok;
        p.seg.buttons.forEach(function (b, i) {
          var id = p.part.options[i].id;
          if (id === want) b.dataset.verdict = 'right';
          else if (id === got) b.dataset.verdict = 'wrong';
          b.disabled = true;
        });
        p.verdict.innerHTML = '<span class="' + (ok ? 'viz-good' : 'viz-bad') + '">' + (ok ? '✓ Right. ' : '✗ Not quite. ') + '</span>' + p.part.why[want];
      });
      if (results.length === q) results.push(all);
      // the pane shows both choices: the overload that was picked, and the override that ran inside it
      panes[0].mark(panes[0].line(spec.tokens.overload[Q.answers.overload]), 'ok');
      panes[0].setOut(firstLines(spec.programs[0].output, q + 1));
      say.innerHTML = 'It prints <code>' + h.esc(out[q]) + '</code>. ' + Q.say;
      bCheck.hidden = true;
      bNext.hidden = false;
      bNext.textContent = q === spec.questions.length - 1 ? 'Start again ↺' : 'Next call ▶';
      if (q === spec.questions.length - 1) pyBox.hidden = false;
      label();
      bNext.focus();
    }
    bCheck.addEventListener('click', check);
    bNext.addEventListener('click', function () {
      if (q === spec.questions.length - 1) { q = 0; results = []; } else q++;
      show();
      var first = parts[0].seg.buttons[0];
      if (first) first.focus();
    });
    // ← → are free here: the reader is answering, not stepping
    show();
  });

  // ═════════════ abc: may this class be instantiated? ═════════════
  P1Visuals.register('abc', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(h, host, ['python']);
    var P = spec.programs[0], out = lines(P.output);
    var tries = h.el('div', 'viz-ops');
    tries.appendChild(h.el('span', 'viz-field-label', 'Try to make one:'));
    var buttons = spec.tries.map(function (t, i) {
      var b = h.button(t.label, 'ghost mono');
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { choose(i); st.next.focus(); });
      tries.appendChild(b);
      return b;
    });
    body.appendChild(tries);
    var stage = h.el('div', 'viz-stage w8-stage');
    var g = classGraph(h, spec.classes.map(function (c) {
      return { name: c.name, bases: c.bases, row: c.row, col: c.col, span: c.span,
        head: 'class ' + h.esc(c.name) + '(' + h.esc(c.bases.length ? c.bases.join(', ') : 'ABC') + ')',
        methods: [{ name: 'area', label: 'area()', tag: c.area }] };
    }));
    stage.appendChild(g.root);
    var gate = h.el('div', 'w8-gate');
    stage.appendChild(gate);
    body.appendChild(stage);
    var st = h.stepper(host, render);
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var box = panesBox(h);
    body.appendChild(box);
    var pane = makePanes(h, [P], box)[0];
    function render(f) {
      g.mark(f.state, f.mm);
      gate.innerHTML = f.gate || '';
      gate.dataset.verdict = f.verdict || '';
      pane.mark(f.line, f.tone);
      pane.setOut(f.out ? f.out.map(function (i) { return out[i]; }).join('\n') : '');
    }
    function choose(i) {
      var t = spec.tries[i];
      buttons.forEach(function (b, j) { b.setAttribute('aria-pressed', String(i === j)); });
      var s0 = {}; s0[t.cls] = 'look';
      var mm = {}; mm[t.cls + '.area'] = t.ok ? 'found' : 'missing';
      var frames = [
        { state: s0, line: pane.line(t.token), gate: '<code>' + h.esc(t.label) + '</code>: before making the object, Python checks <code>' + h.esc(t.cls) + '</code> for abstract methods that nothing has implemented yet.',
          say: t.look }
      ];
      var s1 = {}; s1[t.cls] = t.ok ? 'found' : 'refused';
      frames.push({ state: s1, mm: mm, line: pane.line(t.token), tone: t.ok ? 'ok' : 'bad',
        gate: t.ok ? '✓ No abstract methods are left: the object is made.' : '✗ <code>area</code> is still abstract, so Python refuses to make the object.',
        verdict: t.ok ? 'ok' : 'bad', say: t.check });
      t.after.forEach(function (a) {
        frames.push({ state: s1, mm: mm, line: pane.line(a.token), tone: t.ok ? 'ok' : 'bad', out: a.out,
          gate: frames[1].gate, verdict: frames[1].verdict,
          say: a.say + ' It prints <code>' + a.out.map(function (k) { return h.esc(out[k]); }).join('</code> then <code>') + '</code>.' });
      });
      st.set(frames);
    }
    choose(0);
  });

  // ═════════════ socket: one contract, many objects ═════════════
  P1Visuals.register('socket', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(h, host, langsOf(spec.programs));
    var at = 0;
    if (spec.variants.length > 1) {
      var form = h.el('div', 'viz-form');
      form.appendChild(h.el('span', 'viz-field-label', spec.pickLabel || 'Version:'));
      var pick = h.segmented(spec.pickLabel || 'Version', spec.variants.map(function (v) { return { label: v.label }; }), function (n) { at = n; choose(); });
      form.appendChild(pick.root);
      body.appendChild(form);
    }
    var stage = h.el('div', 'viz-stage w8-stage w8-socket-stage');
    var socket = h.el('div', 'w8-socket');
    var plugs = h.el('div', 'w8-plugs');
    plugs.setAttribute('role', 'list');
    stage.appendChild(socket);
    stage.appendChild(plugs);
    body.appendChild(stage);
    var st = h.stepper(host, render);
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var box = panesBox(h);
    body.appendChild(box);
    var pane, V, P, cards = [];
    function render(f) {
      socket.dataset.state = f.plug || '';
      socket.querySelector('.w8-socket-now').innerHTML = f.item === null ? 'waiting' : '<code>' + h.esc(V.items[f.item].label) + '</code>';
      cards.forEach(function (c, i) {
        c.dataset.state = i === f.item ? (f.plug || 'next') : (i < (f.item === null ? f.done : f.item) ? 'done' : '');
      });
      pane.mark(f.line, f.tone);
      pane.setOut(f.out ? firstLines(P.output, f.out) : '');
    }
    function choose() {
      V = spec.variants[at];
      P = spec.programs[V.program];
      pane = makePanes(h, [P], box)[0];
      socket.innerHTML = '<div class="w8-socket-title">' + V.contract + '</div><div class="w8-socket-slot"><span class="w8-socket-now"></span></div>';
      plugs.textContent = '';
      cards = V.items.map(function (it, i) {
        var c = h.el('button', 'w8-plug');
        c.type = 'button';
        c.setAttribute('role', 'listitem');
        c.innerHTML = '<span class="w8-plug-name">' + h.esc(it.label) + '</span><span class="w8-plug-has">' + it.has + '</span>';
        c.title = 'Jump to ' + it.label;
        c.addEventListener('click', function () { st.set(frames, starts[i]); });
        plugs.appendChild(c);
        return c;
      });
      var frames = [], starts = [];
      frames.push({ item: null, done: 0, line: pane.line(V.start.at), out: 0, say: V.start.say });
      var printed = 0;
      V.items.forEach(function (it, i) {
        starts.push(frames.length);
        it.steps.forEach(function (s) {
          if (s.out) printed++;
          frames.push({ item: i, plug: s.plug, line: pane.line(s.at), tone: s.tone, out: printed, say: s.say });
        });
      });
      frames.push({ item: null, done: V.items.length, line: pane.line(V.end.at), out: printed, say: V.end.say });
      st.set(frames);
    }
    if (pick) pick.pick(0);
    choose();
  });

  // ═════════════ mro: walk the method resolution order ═════════════
  P1Visuals.register('mro', function (host, spec, h) {
    var body = h.shell(host, spec);
    setLangs(h, host, ['python']);
    var at = 0;
    var form = h.el('div', 'viz-form');
    form.appendChild(h.el('span', 'viz-field-label', 'Hierarchy:'));
    var pick = h.segmented('Hierarchy', spec.variants.map(function (v) { return { label: v.label, mono: true }; }), function (n) { at = n; choose(); });
    form.appendChild(pick.root);
    body.appendChild(form);
    var stage = h.el('div', 'viz-stage w8-stage');
    var gBox = h.el('div');
    stage.appendChild(gBox);
    var track = h.listTrack('C.__mro__ = the search order');
    track.root.classList.add('w8-mro-track');
    var scroller = h.el('div', 'w8-scroll');
    scroller.appendChild(track.root);
    stage.appendChild(scroller);
    var vars = h.el('div', 'viz-vars');
    stage.appendChild(vars);
    body.appendChild(stage);
    var st = h.stepper(host, render);
    body.appendChild(st.say);
    body.appendChild(st.bar);
    var box = panesBox(h);
    body.appendChild(box);
    var pane, V, P, g, mro;
    function render(f) {
      g.mark(f.state, f.mm);
      track.draw(mro.map(function (n, i) { return { k: n, v: n, mark: f.cells[i] || '' }; }), f.ptr, 'value');
      var ptr = track.root.querySelector('.viz-ptr');
      if (ptr && !ptr.hidden) ptr.textContent = f.ptrLabel || 'search';
      vars.innerHTML = f.vars || '';
      pane.mark(f.line, f.tone);
      pane.setOut(f.out ? firstLines(P.output, f.out) : '');
    }
    function parseList(line) {
      return line.replace(/^\[|\]$/g, '').split(',').map(function (s) { return s.trim().replace(/^'|'$/g, ''); });
    }
    function choose() {
      V = spec.variants[at];
      P = spec.programs[V.program];
      pane = makePanes(h, [P], box)[0];
      var outs = lines(P.output);
      mro = parseList(outs[1]);   // the real C.__mro__, as the program printed it
      var cls = {};
      V.classes.forEach(function (c) { cls[c.name] = c; });
      gBox.textContent = '';
      g = classGraph(h, V.classes.map(function (c) {
        return { name: c.name, bases: c.bases, row: c.row, col: c.col, span: c.span,
          head: 'class ' + h.esc(c.name) + (c.bases.length ? '(' + h.esc(c.bases.join(', ')) + ')' : ''),
          methods: c.token ? [{ name: V.method, label: V.method + '()' }] : [] };
      }), { emptyText: 'pass' });
      gBox.appendChild(g.root);
      var frames = [], m = V.method;
      var callLine = pane.line(V.call);
      function cellMarks(upto, hit, mark) {
        var c = {};
        for (var i = 0; i < upto; i++) c[i] = 'done';
        c[hit] = mark;
        return c;
      }
      frames.push({ state: {}, cells: {}, ptr: null, line: pane.line(V.order), vars: '<span>C.__mro__ = ' + h.esc(outs[1]) + '</span>',
        say: 'From the <code>class</code> lines, Python works out one fixed search order for <code>C</code>, called the <strong>method resolution order</strong> (MRO): ' +
          '<code>' + h.esc(mro.join(' → ')) + '</code>. ' + V.orderSay });
      if (V.mode === 'first') {
        for (var i = 0; i < mro.length; i++) {
          var n = mro[i], c = cls[n], s = {};
          mro.slice(0, i).forEach(function (x) { s[x] = 'skip'; });
          if (c && c.token) {
            s[n] = 'found';
            var mm = {}; mm[n + '.' + m] = 'found';
            frames.push({ state: s, mm: mm, cells: cellMarks(i, i, 'read'), ptr: i, line: pane.line(c.token), vars: '<span>found in ' + h.esc(n) + '</span>',
              say: (i === 0 ? '<code>C().' + m + '()</code>: ' : '') + '<code>' + h.esc(n) + '</code> defines <code>' + m + '()</code>, so the search stops here and it runs.' });
            frames.push({ state: s, mm: mm, cells: cellMarks(i, i, 'read'), ptr: i, line: callLine, out: 2, vars: '<span>found in ' + h.esc(n) + '</span>',
              say: 'It prints <code>' + h.esc(outs[0]) + '</code>. ' + V.endSay });
            break;
          }
          s[n] = 'look';
          frames.push({ state: s, cells: cellMarks(i, i, 'check'), ptr: i, line: callLine, vars: '<span>looking in ' + h.esc(n) + '</span>',
            say: (i === 0 ? '<code>C().' + m + '()</code>: start at the front of the MRO. ' : '') + '<code>' + h.esc(n) + '</code> has no <code>' + m + '()</code> of its own; move one place along the MRO.' });
        }
      } else {
        // every class on the way defines the method and calls super(): follow the chain, then unwind
        var stack = [], s2 = {};
        mro.forEach(function (n, i) {
          var c = cls[n];
          if (!c || !c.token) return;
          s2 = {}; stack.forEach(function (x) { s2[x] = 'waiting'; }); s2[n] = 'found';
          var mm = {}; mm[n + '.' + m] = 'found';
          var next = mro[i + 1];
          frames.push({ state: s2, mm: mm, cells: cellMarks(i, i, 'read'), ptr: i, line: pane.line(c.token),
            vars: '<span>running: ' + h.esc(n) + '.' + m + '()</span>' + (stack.length ? '<span>waiting: ' + h.esc(stack.slice().reverse().join(', ')) + '</span>' : ''),
            say: (i === 0 ? '<code>C().' + m + '()</code> starts in <code>C</code>. ' : '') + '<code>' + h.esc(n) + '.' + m + '()</code> runs. ' +
              (c.calls ? 'Its <code>super()</code> means <strong>the next class after ' + h.esc(n) + ' in C\'s MRO</strong>, which is <code>' + h.esc(next) + '</code>' +
                (c.note ? ' &mdash; ' + c.note : '') + '.' : 'It does not call <code>super()</code>, so the chain stops here and the answers come back.') });
          stack.push(n);
        });
        var built = [];
        stack.slice().reverse().forEach(function (n) {
          built.unshift(n);
          var s3 = {}; stack.forEach(function (x) { s3[x] = built.indexOf(x) >= 0 ? 'done' : 'waiting'; }); s3[n] = 'found';
          frames.push({ state: s3, cells: {}, ptr: mro.indexOf(n), line: pane.line(cls[n].token),
            vars: '<span>' + h.esc(n) + '.' + m + '() returns ' + h.esc(JSON.stringify(built).replace(/"/g, "'").replace(/,/g, ', ')) + '</span>',
            say: '<code>' + h.esc(n) + '.' + m + '()</code> returns <code>' + h.esc(JSON.stringify(built).replace(/"/g, "'").replace(/,/g, ', ')) + '</code>.' });
        });
        frames.push({ state: {}, cells: {}, ptr: null, line: callLine, out: 2, say: 'It prints <code>' + h.esc(outs[0]) + '</code>. ' + V.endSay });
        // the list the diagram built must be the one the real program printed
        if (JSON.stringify(built).replace(/"/g, "'").replace(/,/g, ', ') !== outs[0]) console.warn('P1Visuals mro: built list differs from the real output', built, outs[0]);
      }
      st.set(frames);
    }
    pick.pick(0);
    choose();
  });
})();
