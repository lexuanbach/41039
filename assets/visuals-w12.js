/* 41039 Programming 1 — Week 12's own diagram kinds (loaded after assets/visuals.js).
 *
 *   w12-trace     a step-through of one program (or one of several, picked with choice buttons):
 *                 the code panes highlight the line that just ran while panels show the state —
 *                 an array with its processed prefix, variables, an input file with its read
 *                 position, a list of objects, an exception, an output file, or names and the
 *                 objects they refer to (drawn with arrows). Optional "predict first" question.
 *   w12-stages    pick an input row, predict which parsing stage rejects it, watch it travel
 *   w12-mutants   the original Counter and four one-change bugs: which tests catch which bug?
 *   w12-diverge   a correct trace beside a buggy one; click the first row that goes wrong
 *   w12-pipeline  marks flowing through filter → map → sum, replayed from a real log
 *   w12-bugs      "where does this bug live?": symptom → cause → program → fix → earlier week
 *
 * Every program shown is in spec.programs, which scripts/check_week_content.py runs; every printed
 * line on a diagram is cut from that real output (content/weeks/week-12.json).
 */
(function () {
  'use strict';
  if (!window.P1Visuals) return;
  var V = window.P1Visuals;
  var LANG = { java: 'Java', python: 'Python' };

  // ───────────── shared bits ─────────────
  function badges(host, langs) {
    var box = host.querySelector('.viz-langs');
    if (!box || !langs) return;
    box.textContent = '';
    langs.forEach(function (l) {
      var s = document.createElement('span');
      s.className = 'lang ' + l;
      s.textContent = LANG[l];
      box.appendChild(s);
    });
  }
  function outLines(p) { var o = p.output.replace(/\n+$/, ''); return o ? o.split('\n') : []; }
  /* the line a token marks: a line that is exactly the token wins, then the first line containing it */
  function findLine(src, token) {
    if (!token) return 0;
    var lines = src.split('\n'), i;
    for (i = 0; i < lines.length; i++) if (lines[i].trim() === token.trim()) return i + 1;
    for (i = 0; i < lines.length; i++) if (lines[i].indexOf(token) !== -1) return i + 1;
    console.warn('visuals-w12: token not found', token);
    return 0;
  }
  function pane(h, prog, label, withOut) {
    var p = h.codePane(prog.lang, prog.code, { label: label, output: withOut !== false });
    var lines = outLines(prog);
    return {
      root: p.root,
      mark: function (token, kind) { p.mark(findLine(prog.code, token), kind || 'now'); },
      show: function (n) { p.setOut(lines.slice(0, n).join('\n')); },
      text: function (t) { p.setOut(t); },
      lines: lines
    };
  }
  /* one segmented control per choice group; calls back with the joined key */
  function choiceBar(h, groups, onChange) {
    var wrap = h.el('div', 'w12-choices');
    var picked = groups.map(function () { return 0; });
    var segs = groups.map(function (g, gi) {
      var row = h.el('div', 'w12-choice');
      row.appendChild(h.el('span', 'viz-field-label', g.label));
      var seg = h.segmented(g.label, g.options.map(function (o) { return { label: o.label }; }), function (i) {
        picked[gi] = i;
        onChange(key());
      });
      seg.pick(0);
      row.appendChild(seg.root);
      wrap.appendChild(row);
      return seg;
    });
    function key() { return groups.map(function (g, gi) { return g.options[picked[gi]].id; }).join('|'); }
    return { root: wrap, key: key, segs: segs };
  }
  /* a "predict first" question: buttons, then a verdict */
  function predictBox(h) {
    var box = h.el('div', 'w12-predict');
    var q = h.el('p', 'w12-predict-q');
    var opts = h.el('div', 'w12-predict-opts');
    opts.setAttribute('role', 'group');
    var verdict = h.el('p', 'w12-predict-verdict');
    verdict.setAttribute('aria-live', 'polite');
    box.appendChild(q); box.appendChild(opts); box.appendChild(verdict);
    return {
      root: box,
      set: function (p, onAnswer) {
        box.hidden = !p;
        if (!p) return;
        q.innerHTML = p.q;
        opts.setAttribute('aria-label', q.textContent);
        opts.textContent = '';
        verdict.textContent = '';
        verdict.className = 'w12-predict-verdict';
        p.opts.forEach(function (o, i) {
          var b = h.el('button', 'viz-seg-btn');
          b.type = 'button';
          b.innerHTML = o;
          b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', function () {
            Array.prototype.forEach.call(opts.children, function (x, j) {
              x.setAttribute('aria-pressed', String(i === j));
              x.classList.toggle('is-right', j === p.a);
              x.classList.toggle('is-wrong', i === j && j !== p.a);
            });
            var right = i === p.a;
            verdict.className = 'w12-predict-verdict ' + (right ? 'viz-good' : 'viz-bad');
            verdict.innerHTML = right ? '✓ Right. Step through to check the reason, not just the answer.'
                                      : '✗ Not this one: it is ' + p.opts[p.a] + '. Step through to find the line that decides it.';
            if (onAnswer) onAnswer(right);
          });
          opts.appendChild(b);
        });
      }
    };
  }

  // ───────────── panels for w12-trace ─────────────
  function txt(h, tag, cls, t) { return h.el(tag, cls, t); }
  function card(h, cls, title, state) {
    var c = h.el('div', 'w12-card ' + (cls || ''));
    var head = h.el('div', 'w12-card-head');
    head.appendChild(h.el('span', 'w12-card-title', title));
    if (state) head.appendChild(h.el('span', 'w12-card-state', state));
    c.appendChild(head);
    return c;
  }
  var PANEL = {
    array: function (h, p) {
      var c = card(h, 'w12-array-card', p.name + '  (length ' + p.values.length + ')');
      var row = h.el('div', 'w12-arr');
      row.setAttribute('role', 'img');
      var label = p.name + ' is {' + p.values.join(', ') + '}';
      if (!p.values.length) row.appendChild(h.el('span', 'w12-empty', 'no elements: there is no index 0'));
      p.values.forEach(function (v, i) {
        var cell = h.el('div', 'w12-cell');
        if (i < p.done) cell.classList.add('is-done');
        if (p.i === i) cell.classList.add('is-at');
        var m = p.marks && p.marks[String(i)];
        if (m) cell.dataset.mark = m;
        cell.appendChild(h.el('span', 'w12-ptr', p.i === i ? 'i' : ''));
        cell.appendChild(h.el('span', 'w12-v', String(v)));
        cell.appendChild(h.el('span', 'w12-ix', String(i)));
        cell.appendChild(h.el('span', 'w12-m', m === 'pass' ? '✓ pass' : m === 'fail' ? '✗ fail' : ''));
        row.appendChild(cell);
      });
      if (p.i !== null && p.i !== undefined && p.i >= p.values.length) {
        var end = h.el('div', 'w12-cell is-end');
        end.appendChild(h.el('span', 'w12-ptr', 'i'));
        end.appendChild(h.el('span', 'w12-v', '–'));
        end.appendChild(h.el('span', 'w12-ix', String(p.i)));
        end.appendChild(h.el('span', 'w12-m', 'past the end'));
        row.appendChild(end);
      }
      label += p.done ? '; the first ' + p.done + ' processed' : '';
      row.setAttribute('aria-label', label);
      c.appendChild(row);
      if (p.values.length) c.appendChild(h.el('p', 'w12-legend', p.done ? 'Shaded = processed prefix (indexes 0 to ' + (p.done - 1) + ')' : 'Nothing processed yet: the prefix is empty'));
      return c;
    },
    vars: function (h, p) {
      var c = card(h, 'w12-vars-card', 'Variables');
      var box = h.el('div', 'w12-vars');
      p.items.forEach(function (it) {
        var chip = h.el('span', 'w12-var' + (it[2] ? ' is-changed' : ''));
        chip.appendChild(h.el('span', 'n', it[0]));
        chip.appendChild(h.el('span', 'eq', ' = '));
        chip.appendChild(h.el('span', 'v', it[1]));
        box.appendChild(chip);
      });
      c.appendChild(box);
      return c;
    },
    file: function (h, p) {
      var c = card(h, 'w12-file-card', '📄 ' + p.name, p.state);
      var ol = h.el('ol', 'w12-file');
      p.lines.forEach(function (l, i) {
        var li = h.el('li', 'w12-fline');
        if (i < p.read && i !== p.at) li.classList.add('is-read');
        if (i === p.at) li.classList.add('is-at');
        li.appendChild(h.el('span', 'w12-ftext', l));
        var nl = !p.nl || p.nl[i];
        li.appendChild(h.el('span', 'w12-nl', nl ? '⏎' : '(no newline)'));
        if (i === p.at) li.appendChild(h.el('span', 'w12-reading', '◀ reading'));
        ol.appendChild(li);
      });
      c.appendChild(ol);
      return c;
    },
    objects: function (h, p) {
      var c = card(h, 'w12-obj-card', p.name, p.items.length + (p.items.length === 1 ? ' item' : ' items'));
      var box = h.el('div', 'w12-objs');
      if (!p.items.length) box.appendChild(h.el('span', 'w12-empty', p.empty || 'empty'));
      p.items.forEach(function (o, i) {
        var ob = h.el('div', 'w12-obj' + (o.mark ? ' is-' + o.mark : ''));
        ob.appendChild(h.el('span', 'w12-obj-ix', '[' + i + ']'));
        ob.appendChild(h.el('span', 'w12-obj-type', o.label));
        o.fields.forEach(function (f) {
          var fl = h.el('span', 'w12-obj-f');
          fl.appendChild(h.el('span', 'n', f[0]));
          fl.appendChild(h.el('span', 'v', f[1]));
          ob.appendChild(fl);
        });
        box.appendChild(ob);
      });
      c.appendChild(box);
      return c;
    },
    exc: function (h, p) {
      var state = { thrown: 'thrown', propagating: 'leaving the loop', caught: 'caught' }[p.state] || p.state;
      var c = card(h, 'w12-exc-card is-' + p.state, '⚡ Exception', state);
      c.appendChild(h.el('p', 'w12-exc-type', p.type));
      if (p.msg) c.appendChild(h.el('p', 'w12-exc-msg', p.msg));
      if (p.note) c.appendChild(h.el('p', 'w12-exc-note', p.note));
      return c;
    },
    outfile: function (h, p) {
      var c = card(h, 'w12-out-card is-' + p.state.split(/[ ,]/)[0], '💾 ' + p.name, p.state);
      if (!p.lines.length) {
        c.appendChild(h.el('p', 'w12-empty', p.state === 'missing' ? 'not created yet' : p.state === 'never created' ? 'never created' : 'empty'));
      } else {
        var pre = h.el('pre', 'w12-outfile');
        pre.textContent = p.lines.join('\n');
        c.appendChild(pre);
      }
      return c;
    },
    refs: function (h, p) {
      var c = card(h, 'w12-refs-card', 'Names and the objects they refer to');
      var grid = h.el('div', 'w12-refs');
      var left = h.el('div', 'w12-frames'), right = h.el('div', 'w12-heap');
      var ids = {};
      p.objects.forEach(function (o) { ids[o.id] = true; });
      var links = [];
      p.frames.forEach(function (f) {
        var fr = h.el('div', 'w12-frame');
        fr.appendChild(h.el('div', 'w12-frame-name', f.name));
        f.vars.forEach(function (v) {
          var row = h.el('div', 'w12-name');
          row.appendChild(h.el('span', 'n', v[0]));
          var slot = h.el('span', 'w12-slot', ids[v[1]] ? '→ ' + v[1] : v[1]);
          if (ids[v[1]]) { slot.classList.add('is-ref'); links.push([slot, v[1]]); }
          row.appendChild(slot);
          fr.appendChild(row);
        });
        left.appendChild(fr);
      });
      var boxes = {};
      p.objects.forEach(function (o) {
        var ob = h.el('div', 'w12-heapobj' + (o.mark ? ' is-' + o.mark : ''));
        var head = h.el('div', 'w12-heap-head');
        head.appendChild(h.el('span', 'w12-heap-id', o.id));
        head.appendChild(h.el('span', 'w12-heap-kind', 'list' + (o.note ? ' · ' + o.note : '')));
        ob.appendChild(head);
        var cells = h.el('div', 'w12-heap-cells');
        o.items.forEach(function (x) { cells.appendChild(h.el('span', 'w12-heap-cell', x)); });
        if (!o.items.length) cells.appendChild(h.el('span', 'w12-empty', 'empty'));
        ob.appendChild(cells);
        ob.setAttribute('aria-label', 'Object ' + o.id + ': [' + o.items.join(', ') + ']');
        right.appendChild(ob);
        boxes[o.id] = ob;
      });
      grid.appendChild(left);
      grid.appendChild(right);
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'w12-arrows');
      svg.setAttribute('aria-hidden', 'true');
      grid.appendChild(svg);
      c.appendChild(grid);
      function draw() {
        var g = grid.getBoundingClientRect();
        if (!g.width) return;
        svg.setAttribute('width', g.width);
        svg.setAttribute('height', g.height);
        svg.setAttribute('viewBox', '0 0 ' + g.width + ' ' + g.height);
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        var stacked = right.getBoundingClientRect().top >= left.getBoundingClientRect().bottom - 2;
        links.forEach(function (l, li) {
          var a = l[0].getBoundingClientRect(), b = boxes[l[1]].getBoundingClientRect();
          var x1, y1, x2, y2, d, head;
          if (stacked) {
            // run down the right-hand gutter, one lane per arrow, and enter the object from the right
            var lane = g.width - 5 - (links.length - 1 - li) * 7;
            x1 = a.right - g.left; y1 = a.top + a.height / 2 - g.top;
            x2 = b.right - g.left; y2 = b.top + Math.min(b.height / 2, 16) - g.top;
            d = 'M' + x1 + ',' + y1 + ' H' + lane + ' V' + y2 + ' H' + (x2 + 7);
            head = 'M' + (x2 + 8) + ',' + (y2 - 5) + ' L' + (x2 + 8) + ',' + (y2 + 5) + ' L' + x2 + ',' + y2 + ' Z';
          } else {
            x1 = a.right - g.left; y1 = a.top + a.height / 2 - g.top;
            x2 = b.left - g.left; y2 = b.top + Math.min(b.height / 2, 18) - g.top;
            var mid = (x1 + x2) / 2;
            d = 'M' + x1 + ',' + y1 + ' C' + mid + ',' + y1 + ' ' + mid + ',' + y2 + ' ' + (x2 - 7) + ',' + y2;
            head = 'M' + (x2 - 8) + ',' + (y2 - 5) + ' L' + (x2 - 8) + ',' + (y2 + 5) + ' L' + x2 + ',' + y2 + ' Z';
          }
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', d);
          path.setAttribute('class', 'w12-arrow');
          svg.appendChild(path);
          var tip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          tip.setAttribute('d', head);
          tip.setAttribute('class', 'w12-arrow-tip');
          svg.appendChild(tip);
        });
      }
      c._after = draw;
      if (window.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(grid);
      return c;
    }
  };

  // ═════════════ w12-trace ═════════════
  V.register('w12-trace', function (host, spec, h) {
    var body = h.shell(host, spec);
    badges(host, spec.langs);
    var progs = spec.programs;
    var choices = spec.choices && spec.choices.length ? choiceBar(h, spec.choices, function (k) { load(k); }) : null;
    if (choices) body.appendChild(choices.root);
    var predict = predictBox(h);
    body.appendChild(predict.root);
    var stage = h.el('div', 'viz-stage w12-stage');
    var panels = h.el('div', 'w12-panels');
    stage.appendChild(panels);
    body.appendChild(stage);
    var panesBox = h.el('div', 'viz-panes');
    var panes = [];
    var st = h.stepper(host, function (f) {
      panes.forEach(function (p, i) {
        p.mark(f.lines[i], f.kinds && f.kinds[i]);
        p.show(f.out[i]);
      });
      panels.textContent = '';
      var after = [];
      (f.panels || []).forEach(function (p) {
        var node = PANEL[p.t](h, p);
        node.classList.add('w12-panel-' + p.t);
        panels.appendChild(node);
        if (node._after) after.push(node._after);
      });
      after.forEach(function (fn) { fn(); });
      stage.hidden = !(f.panels && f.panels.length);
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(panesBox);
    function load(k) {
      var tr = spec.tracks[k];
      panesBox.textContent = '';
      panes = tr.panes.map(function (pd) {
        var p = pane(h, progs[pd.prog], pd.label);
        panesBox.appendChild(p.root);
        return p;
      });
      predict.set(tr.predict);
      st.set(tr.frames, 0);
    }
    load(choices ? choices.key() : Object.keys(spec.tracks)[0]);
  });

  // ═════════════ w12-stages ═════════════
  V.register('w12-stages', function (host, spec, h) {
    var body = h.shell(host, spec);
    badges(host, spec.langs);
    var langs = ['python', 'java'];
    var row = 0, timers = [];
    var pickRow = h.el('div', 'w12-choice');
    pickRow.appendChild(h.el('span', 'viz-field-label', 'Input row'));
    var rowSeg = h.segmented('Input row', spec.rows.map(function (r) { return { label: '"' + r + '"', mono: true }; }), function (i) { row = i; reset(); });
    pickRow.appendChild(rowSeg.root);
    body.appendChild(pickRow);

    var ask = h.el('div', 'w12-predict');
    ask.appendChild(h.el('p', 'w12-predict-q', 'Predict: where is this row stopped?'));
    var guessBox = h.el('div', 'w12-predict-opts');
    guessBox.setAttribute('role', 'group');
    guessBox.setAttribute('aria-label', 'Predict where the row is stopped');
    var guessButtons = spec.stages.map(function (s, i) {
      var b = h.el('button', 'viz-seg-btn', i === spec.stages.length - 1 ? 'Nowhere: accepted' : s.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { reveal(i); });
      guessBox.appendChild(b);
      return b;
    });
    var just = h.button('Just show me', 'ghost');
    just.addEventListener('click', function () { reveal(null); });
    guessBox.appendChild(just);
    ask.appendChild(guessBox);
    var verdict = h.el('p', 'w12-predict-verdict');
    verdict.setAttribute('aria-live', 'polite');
    ask.appendChild(verdict);
    body.appendChild(ask);

    var stage = h.el('div', 'viz-stage w12-lanes');
    var lanes = {};
    langs.forEach(function (l) {
      var lane = h.el('div', 'w12-lane');
      var head = h.el('div', 'w12-lane-head');
      head.appendChild(h.el('span', 'lang ' + l, LANG[l]));
      lane.appendChild(head);
      var track = h.el('div', 'w12-track');
      var boxes = spec.stages.map(function (s) {
        var b = h.el('div', 'w12-st');
        b.appendChild(h.el('span', 'w12-st-label', s.label));
        b.appendChild(h.el('span', 'w12-st-job', s.job));
        b.appendChild(h.el('span', 'w12-st-mark', ''));
        track.appendChild(b);
        return b;
      });
      lane.appendChild(track);
      var out = h.el('pre', 'console-out viz-out w12-lane-out');
      out.setAttribute('aria-label', LANG[l] + ' output for this row');
      lane.appendChild(out);
      stage.appendChild(lane);
      lanes[l] = { boxes: boxes, out: out, lines: outLines(spec.programs[spec.panes[l]]) };
    });
    body.appendChild(stage);
    var note = h.el('div', 'viz-say');
    note.setAttribute('aria-live', 'polite');
    body.appendChild(note);
    var panesBox = h.el('div', 'viz-panes');
    var panes = {};
    langs.forEach(function (l) {
      panes[l] = pane(h, spec.programs[spec.panes[l]], l === 'python' ? 'main.py (parse from 2.4)' : 'Demo.java', false);
      panesBox.appendChild(panes[l].root);
    });
    body.appendChild(panesBox);

    function clear() { timers.forEach(clearTimeout); timers = []; }
    function reset() {
      clear();
      guessButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.classList.remove('is-right', 'is-wrong'); });
      verdict.textContent = '';
      verdict.className = 'w12-predict-verdict';
      note.innerHTML = '';
      langs.forEach(function (l) {
        lanes[l].boxes.forEach(function (b) { b.className = 'w12-st'; b.lastChild.textContent = ''; });
        lanes[l].out.textContent = '';
        panes[l].mark(null);
      });
    }
    function reveal(guess) {
      reset();
      if (guess !== null) guessButtons[guess].setAttribute('aria-pressed', 'true');
      var last = spec.stages.length - 1;
      var parts = [];
      langs.forEach(function (l) {
        var stop = spec.stage[l][row];
        var ok = guess === stop;
        if (guess !== null) parts.push(LANG[l] + (ok ? ' ✓ ' : ' ✗ ') + (stop === last ? 'accepts it' : 'stops it at ' + spec.stages[stop].label));
        var steps = [];
        for (var k = 0; k <= stop; k++) steps.push(k);
        steps.forEach(function (k, n) {
          var go = function () {
            var b = lanes[l].boxes[k];
            b.classList.add(k < stop || stop === last ? 'is-pass' : 'is-stop');
            b.lastChild.textContent = k < stop || stop === last ? '✓' : '✗';
            if (k === stop) {
              lanes[l].out.textContent = lanes[l].lines[row];
              panes[l].mark(spec.lines[l][stop], stop === last ? 'ok' : 'bad');
              for (var m = stop + 1; m <= last; m++) lanes[l].boxes[m].classList.add('is-skip');
            }
          };
          if (h.moving()) timers.push(setTimeout(go, 330 * n)); else go();
        });
      });
      if (guess !== null) {
        var both = spec.stage.python[row] === guess && spec.stage.java[row] === guess;
        guessButtons.forEach(function (b, i) {
          var right = spec.stage.python[row] === i || spec.stage.java[row] === i;
          b.classList.toggle('is-right', right);
          b.classList.toggle('is-wrong', i === guess && !right);
        });
        verdict.className = 'w12-predict-verdict ' + (both ? 'viz-good' : 'viz-bad');
        verdict.textContent = parts.join(' · ');
      }
      note.innerHTML = spec.notes[row];
    }
    rowSeg.pick(0);
    reset();
  });

  // ═════════════ w12-mutants ═════════════
  V.register('w12-mutants', function (host, spec, h) {
    var body = h.shell(host, spec);
    badges(host, spec.langs);
    var progs = spec.programs, muts = spec.mutants;
    var mode = 0, view = 0;
    var sel = spec.tests.map(function () { return false; }), checkLeft = false;
    var modeRow = h.el('div', 'w12-choice');
    modeRow.appendChild(h.el('span', 'viz-field-label', 'Tests'));
    var modeSeg = h.segmented('Tests', [{ label: 'The example\'s own calls' }, { label: 'Choose your own tests' }], function (i) { mode = i; draw(); });
    modeRow.appendChild(modeSeg.root);
    body.appendChild(modeRow);
    var own = h.el('div', 'w12-own');
    var testBox = h.el('div', 'w12-predict-opts');
    testBox.setAttribute('role', 'group');
    testBox.setAttribute('aria-label', 'Tests to include, each on a new Counter(2)');
    own.appendChild(h.el('span', 'viz-field-label', 'Each test makes a new Counter(2), then calls:'));
    var testButtons = spec.tests.map(function (t, i) {
      var b = h.el('button', 'viz-seg-btn mono', t.call);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { sel[i] = !sel[i]; b.setAttribute('aria-pressed', String(sel[i])); draw(); });
      testBox.appendChild(b);
      return b;
    });
    var leftBtn = h.el('button', 'viz-seg-btn', 'Also check left() afterwards');
    leftBtn.type = 'button';
    leftBtn.setAttribute('aria-pressed', 'false');
    leftBtn.addEventListener('click', function () { checkLeft = !checkLeft; leftBtn.setAttribute('aria-pressed', String(checkLeft)); draw(); });
    testBox.appendChild(leftBtn);
    own.appendChild(testBox);
    body.appendChild(own);
    var tableWrap = h.el('div', 'w12-matrix-wrap');
    body.appendChild(tableWrap);
    var score = h.el('div', 'viz-say');
    score.setAttribute('aria-live', 'polite');
    body.appendChild(score);
    var panesBox = h.el('div', 'viz-panes');
    body.appendChild(panesBox);

    // results: example mode = output lines; own mode = {ret,left} per test
    function exampleRes(m) { return outLines(progs[m.example]); }
    function ownRes(m) {
      return outLines(progs[m.own]).map(function (l) {
        var r = /-> (\w+), left (-?\d+)/.exec(l);
        return { ret: r[1], left: r[2] };
      });
    }
    function ownSame(a, b) { return a.ret === b.ret && (!checkLeft || a.left === b.left); }
    function caughtOwn(m, chosen) {
      var o = ownRes(muts[0]), r = ownRes(m);
      return chosen.some(function (i) { return !ownSame(o[i], r[i]); });
    }
    function fewest() {
      var n = spec.tests.length, best = null;
      for (var mask = 1; mask < (1 << n); mask++) {
        var ch = [];
        for (var i = 0; i < n; i++) if (mask & (1 << i)) ch.push(i);
        if (muts.slice(1).every(function (m) { return caughtOwn(m, ch); }) && (best === null || ch.length < best)) best = ch.length;
      }
      return best;
    }
    function cell(text, diff) {
      var td = h.el('td', 'mono' + (diff ? ' is-diff' : ''), text);
      if (diff) td.setAttribute('title', 'Different from the original');
      return td;
    }
    function draw() {
      own.hidden = mode === 0;
      tableWrap.textContent = '';
      var table = h.el('table', 'tbl w12-matrix');
      var thead = h.el('thead'), tr = h.el('tr');
      tr.appendChild(h.el('th', '', 'Version'));
      var chosen = [];
      if (mode === 0) spec.exampleCalls.forEach(function (c) { tr.appendChild(h.el('th', 'mono', c)); });
      else sel.forEach(function (s, i) { if (s) { chosen.push(i); tr.appendChild(h.el('th', 'mono', spec.tests[i].call)); } });
      tr.appendChild(h.el('th', '', 'Caught?'));
      thead.appendChild(tr);
      table.appendChild(thead);
      var tb = h.el('tbody');
      var caught = 0;
      muts.forEach(function (m, mi) {
        var row = h.el('tr', mi === view ? 'is-viewing' : '');
        var th = h.el('th', '');
        var vb = h.el('button', 'w12-linkbtn', m.label);
        vb.type = 'button';
        vb.setAttribute('aria-pressed', String(mi === view));
        vb.title = 'Show this version\'s code';
        vb.addEventListener('click', function () { view = mi; draw(); var again = tableWrap.querySelectorAll('.w12-linkbtn')[mi]; if (again) again.focus(); });
        th.appendChild(vb);
        row.appendChild(th);
        var diff = false;
        if (mode === 0) {
          var o = exampleRes(muts[0]), r = exampleRes(m);
          r.forEach(function (x, i) { var d = x !== o[i]; diff = diff || d; row.appendChild(cell(x, d)); });
        } else {
          var oo = ownRes(muts[0]), rr = ownRes(m);
          chosen.forEach(function (i) {
            var d = !ownSame(oo[i], rr[i]);
            diff = diff || d;
            row.appendChild(cell(rr[i].ret + (checkLeft ? ' · left ' + rr[i].left : ''), d));
          });
        }
        if (mi === 0) row.appendChild(h.el('td', 'w12-ref', 'the reference'));
        else {
          if (diff) caught++;
          row.appendChild(h.el('td', diff ? 'viz-good' : 'viz-bad', diff ? '✓ caught' : '✗ survives'));
        }
        tb.appendChild(row);
      });
      table.appendChild(tb);
      var scroll = h.el('div', 'tbl-scroll');
      scroll.appendChild(table);
      tableWrap.appendChild(scroll);
      var bugs = muts.length - 1;
      if (mode === 0) {
        score.innerHTML = 'The example\'s four lines catch <strong>' + caught + ' of ' + bugs + '</strong> bugs: it tests zero, exactly the amount left, and one more than is left, and it checks <code>left()</code> at the end.';
      } else if (!chosen.length) {
        score.innerHTML = 'Pick one or more tests above. Which single test do you think catches the most bugs?';
      } else {
        var best = fewest();
        var msg = 'Your ' + chosen.length + ' test' + (chosen.length > 1 ? 's' : '') + ' catch <strong>' + caught + ' of ' + bugs + '</strong> bugs.';
        if (caught === bugs) msg += chosen.length === best ? ' 🎉 All caught, with the fewest tests possible.' : ' All caught. Can you do it with fewer?';
        else if (!checkLeft && muts.slice(1).some(function (m) { return !caughtOwn(m, spec.tests.map(function (_, i) { return i; })); }))
          msg += ' Some bug survives <em>every</em> return value: a mutator\'s result is not only what it returns. Try checking <code>left()</code> too.';
        if (sel[1] && chosen.length === 1) msg += ' <code>take(1)</code> is the "normal" case, and it catches nothing here.';
        score.innerHTML = msg;
      }
      panesBox.textContent = '';
      var m = muts[view];
      var p = pane(h, progs[mode === 0 ? m.example : m.own], m.label + (mode === 0 ? ' · the example\'s main' : ' · your tests\' main'));
      p.mark(m.line, view === 0 ? 'ok' : 'bad');
      p.show(p.lines.length);
      panesBox.appendChild(p.root);
    }
    modeSeg.pick(0);
    draw();
  });

  // ═════════════ w12-diverge ═════════════
  V.register('w12-diverge', function (host, spec, h) {
    var body = h.shell(host, spec);
    badges(host, spec.langs);
    var progs = spec.programs, bug = 0, shown = 0, found = false;
    var pickRow = h.el('div', 'w12-choice');
    pickRow.appendChild(h.el('span', 'viz-field-label', 'The bug'));
    var seg = h.segmented('The bug', spec.bugs.map(function (b) { return { label: b.label }; }), function (i) { bug = i; load(); });
    pickRow.appendChild(seg.root);
    body.appendChild(pickRow);
    var grid = h.el('div', 'w12-traces');
    body.appendChild(grid);
    var feedback = h.el('div', 'w12-feedback');
    feedback.setAttribute('aria-live', 'polite');
    var panesBox = h.el('div', 'viz-panes');
    var good = outLines(progs[spec.good]);
    var tables = {};
    function makeTable(title, cls) {
      var wrap = h.el('div', 'w12-trace ' + cls);
      wrap.appendChild(h.el('div', 'w12-trace-title', title));
      var t = h.el('table', 'tbl w12-ttable');
      var tr = h.el('tr');
      spec.head.forEach(function (c) { tr.appendChild(h.el('th', 'mono', c)); });
      var th = h.el('thead'); th.appendChild(tr); t.appendChild(th);
      var tb = h.el('tbody'); t.appendChild(tb);
      wrap.appendChild(t);
      grid.appendChild(wrap);
      return { wrap: wrap, title: wrap.firstChild, body: tb };
    }
    tables.good = makeTable('Correct: the example', 'is-good');
    tables.bad = makeTable('', 'is-bad');
    function cells(line) {
      var parts = line.split(' ');
      if (parts[0] === 'total') return [['total', 2], [parts[1], 1]];
      return parts.map(function (x) { return [x, 1]; });
    }
    function firstDiff(b) {
      for (var i = 0; i < Math.max(b.length, good.length); i++) if (b[i] !== good[i]) return i;
      return -1;
    }
    var st = h.stepper(host, function (f, at) {
      shown = at;
      var b = outLines(progs[spec.bugs[bug].prog]);
      fill(tables.good.body, good, false);
      fill(tables.bad.body, b, true);
    });
    function fill(tb, lines, clickable) {
      tb.textContent = '';
      lines.slice(0, shown).forEach(function (line, i) {
        var tr = h.el('tr');
        cells(line).forEach(function (c, ci) {
          var td = h.el('td', 'mono', '');
          td.colSpan = c[1];
          if (clickable && ci === 0) {
            var bt = h.el('button', 'w12-rowbtn', c[0]);
            bt.type = 'button';
            bt.setAttribute('aria-label', 'Row ' + i + ': ' + line + '. Choose as the first wrong row');
            bt.addEventListener('click', function () { choose(i, tr); });
            td.appendChild(bt);
          } else td.textContent = c[0];
          tr.appendChild(td);
        });
        tr.dataset.row = i;
        if (clickable && found !== false && i === found) tr.classList.add('is-first');
        tb.appendChild(tr);
      });
    }
    function choose(i, tr) {
      var b = outLines(progs[spec.bugs[bug].prog]);
      var d = firstDiff(b);
      Array.prototype.forEach.call(tables.bad.body.children, function (r) { r.classList.remove('is-picked-wrong', 'is-first'); });
      if (i === d) {
        found = i;
        tr.classList.add('is-first');
        feedback.className = 'w12-feedback viz-good';
        feedback.innerHTML = '<strong>✓ Yes: row ' + i + '.</strong> ' + spec.bugs[bug].why;
      } else {
        tr.classList.add('is-picked-wrong');
        feedback.className = 'w12-feedback viz-bad';
        feedback.innerHTML = i < d ? '✗ Row ' + i + ' matches the correct trace exactly. The first wrong state comes later.'
                                   : '✗ Row ' + i + ' is wrong, but it is not the <em>first</em> wrong row: look further up.';
      }
    }
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(feedback);
    body.appendChild(panesBox);
    function load() {
      var B = spec.bugs[bug];
      var b = outLines(progs[B.prog]);
      tables.bad.title.textContent = 'With the bug: ' + B.label;
      found = false;
      feedback.textContent = '';
      feedback.className = 'w12-feedback';
      var n = Math.max(b.length, good.length), frames = [];
      for (var k = 0; k <= n; k++) {
        frames.push({ say: k === 0 ? 'Press <strong>Next</strong> to print the first row of both traces.'
          : k < n ? 'Row ' + (k - 1) + ' printed. Compare the two tables row by row.'
          : 'Both traces are complete. Now click the <strong>first</strong> row on the right that differs from the correct trace.' });
      }
      panesBox.textContent = '';
      var pg = pane(h, progs[spec.good], 'main.py · correct (3.4)', false);
      pg.mark(spec.goodLine, 'ok');
      var pb = pane(h, progs[B.prog], 'main.py · ' + B.label, false);
      pb.mark(B.line, 'bad');
      panesBox.appendChild(pg.root);
      panesBox.appendChild(pb.root);
      st.set(frames, 0);
    }
    seg.pick(0);
    load();
  });

  // ═════════════ w12-pipeline ═════════════
  V.register('w12-pipeline', function (host, spec, h) {
    var body = h.shell(host, spec);
    badges(host, spec.langs);
    var progs = spec.programs;
    var choices = choiceBar(h, spec.choices, function (k) { load(k); });
    body.appendChild(choices.root);
    var stage = h.el('div', 'viz-stage w12-pipe');
    var zones = {};
    function zone(id, title, cls) {
      var z = h.el('div', 'w12-zone ' + (cls || ''));
      var t = h.el('div', 'w12-zone-title', title);
      z.appendChild(t);
      var box = h.el('div', 'w12-zone-box');
      z.appendChild(box);
      zones[id] = { root: z, title: t, box: box };
      return z;
    }
    var flow = h.el('div', 'w12-flow');
    flow.appendChild(zone('source', 'source list'));
    flow.appendChild(h.el('span', 'w12-flow-arrow', '→'));
    flow.appendChild(zone('filter', 'filter'));
    flow.appendChild(h.el('span', 'w12-flow-arrow', '→'));
    flow.appendChild(zone('map', 'map'));
    flow.appendChild(h.el('span', 'w12-flow-arrow', '→'));
    flow.appendChild(zone('sum', 'reduce: sum', 'is-sum'));
    stage.appendChild(flow);
    var under = h.el('div', 'w12-under');
    under.appendChild(zone('dropped', 'dropped by the filter', 'is-drop'));
    var acc = h.el('div', 'w12-acc');
    under.appendChild(acc);
    stage.appendChild(under);
    body.appendChild(stage);
    var tokens = {};
    spec.source.forEach(function (v) {
      var t = h.el('span', 'w12-tok', String(v));
      t.dataset.k = String(v);
      tokens[v] = t;
    });
    var panesBox = h.el('div', 'viz-panes');
    var current = null;
    var st = h.stepper(host, function (f) {
      // FLIP: remember where every token was, move it, then slide it from there
      var before = {};
      Object.keys(tokens).forEach(function (k) { before[k] = tokens[k].getBoundingClientRect(); });
      Object.keys(f.pos).forEach(function (k) {
        var t = tokens[k];
        t.className = 'w12-tok' + (f.hot === Number(k) ? ' is-hot' : '');
        zones[f.pos[k]].box.appendChild(t);
      });
      if (h.moving()) {
        Object.keys(tokens).forEach(function (k) {
          var t = tokens[k], a = before[k], b = t.getBoundingClientRect();
          if (!a.width) return;
          var dx = a.left - b.left, dy = a.top - b.top;
          if (!dx && !dy) return;
          t.style.transition = 'none';
          t.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
          t.getBoundingClientRect();
          t.style.transition = '';
          t.style.transform = '';
        });
      }
      acc.innerHTML = f.acc;
      current.mark(f.line, f.kind);
      current.show(f.out);
    });
    body.appendChild(st.say);
    body.appendChild(st.bar);
    body.appendChild(panesBox);
    function load(k) {
      var tr = spec.tracks[k], lang = k.split('|')[0];
      var prog = progs[tr.prog];
      var log = outLines(progs[tr.logFrom]).filter(function (l) { return /^(filter|map) /.test(l); });
      var outs = outLines(prog);
      var L = tr.lines; // [source, filter, map, sum, print, printSource]
      zones.filter.title.textContent = spec.stages[lang][0];
      zones.map.title.textContent = spec.stages[lang][1];
      zones.sum.title.textContent = tr.terminal ? spec.stages[lang][2] : 'no final step';
      zones.sum.root.classList.toggle('is-missing', !tr.terminal);
      var pos = {}, shown = 0, sum = 0, frames = [];
      spec.source.forEach(function (v) { pos[v] = 'source'; });
      function push(line, say, extra) {
        var f = { line: line, say: say, pos: Object.assign({}, pos), out: shown, acc: '' };
        if (tr.terminal) f.acc = 'running total: <strong>' + sum + '</strong>';
        Object.assign(f, extra || {});
        frames.push(f);
      }
      push(L[0], 'The source list holds 49, 50 and 85. Building a pipeline does not copy or change it.');
      if (!tr.terminal) {
        push(L[1], 'The filter step is attached to the pipeline. Nothing runs yet.');
        push(L[2], 'The map step is attached too. Still nothing has run: no filter or map line has been printed.');
        shown = 1;
        push(L[4], 'The program carries on. Print <code>' + h.esc(outs[0]) + '</code>.');
        shown = 2;
        push(L[5], 'Done. No element ever moved, because nothing asked for a result: without a final step that needs the values (a <strong>terminal operation</strong> such as <code>sum</code>), the steps never run.');
        frames[frames.length - 1].acc = 'Nothing was summed: the pipeline was never run.';
      } else {
        for (var i = 0; i < log.length; i++) {
          var parts = log[i].split(' '), what = parts[0], v = Number(parts[1]);
          if (tr.logged) shown++;
          if (what === 'filter') {
            pos[v] = 'filter';
            var passes = log[i + 1] === 'map ' + v;
            push(L[1], (tr.logged ? 'Printed <code>' + h.esc(log[i]) + '</code>. ' : '') + v + ' reaches the filter: <code>' + v + ' &gt;= 50</code> is ' + (passes ? 'true' : 'false') + '.', { hot: v, kind: passes ? 'ok' : 'bad' });
            if (!passes) {
              pos[v] = 'dropped';
              push(L[1], v + ' is dropped. It never reaches the map step, and the next element starts.', { kind: 'bad' });
            }
          } else {
            pos[v] = 'map';
            push(L[2], (tr.logged ? 'Printed <code>' + h.esc(log[i]) + '</code>. ' : '') + v + ' goes straight on to the map step <em>before</em> the next element is filtered: one element at a time, through every step.', { hot: v });
            pos[v] = 'sum';
            sum += v;
            push(L[3], 'The sum takes ' + v + '. Running total: ' + sum + '.', { hot: v, kind: 'ok' });
          }
        }
        if (String(sum) !== outs[shown]) console.error('visuals-w12: pipeline sum differs from the real output', sum, outs[shown]);
        shown++;
        push(L[4], 'Print the total: <code>' + h.esc(outs[shown - 1]) + '</code>.');
        shown++;
        push(L[5], 'Print the source: <code>' + h.esc(outs[shown - 1]) + '</code>. The pipeline read it but did not change it.');
      }
      panesBox.textContent = '';
      current = pane(h, prog, lang === 'java' ? 'Demo.java' : 'main.py');
      panesBox.appendChild(current.root);
      st.set(frames, 0);
    }
    load(choices.key());
  });

  // ═════════════ w12-bugs ═════════════
  V.register('w12-bugs', function (host, spec, h) {
    var body = h.shell(host, spec);
    badges(host, spec.langs);
    var progs = spec.programs, at = -1, solved = {};
    var count = h.el('p', 'w12-count');
    count.setAttribute('aria-live', 'polite');
    body.appendChild(count);
    var grid = h.el('div', 'w12-symptoms');
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Symptoms');
    var cards = spec.bugs.map(function (b, i) {
      var c = h.el('button', 'w12-symptom');
      c.type = 'button';
      c.setAttribute('aria-pressed', 'false');
      c.appendChild(h.el('span', 'w12-symptom-n', String(i + 1)));
      c.appendChild(h.el('span', 'w12-symptom-t', b.symptom));
      c.appendChild(h.el('span', 'w12-symptom-ok', ''));
      c.addEventListener('click', function () { open(i); });
      grid.appendChild(c);
      return c;
    });
    body.appendChild(grid);
    var detail = h.el('div', 'w12-bug');
    body.appendChild(detail);
    function tally() {
      var n = Object.keys(solved).length;
      count.textContent = 'Diagnosed ' + n + ' of ' + spec.bugs.length + (n === spec.bugs.length ? ' 🎉 every bug traced to its week' : '');
      cards.forEach(function (c, i) { c.lastChild.textContent = solved[i] ? '✓' : ''; c.classList.toggle('is-solved', !!solved[i]); });
    }
    function open(i) {
      at = i;
      cards.forEach(function (c, j) { c.setAttribute('aria-pressed', String(i === j)); });
      var b = spec.bugs[i];
      detail.textContent = '';
      detail.appendChild(h.el('p', 'w12-bug-symptom', '“' + b.symptom + '”'));
      var ask = h.el('div', 'w12-predict');
      ask.appendChild(h.el('p', 'w12-predict-q', 'Where does the cause live?'));
      var opts = h.el('div', 'w12-predict-opts w12-stack');
      opts.setAttribute('role', 'group');
      opts.setAttribute('aria-label', 'Where does the cause live?');
      // rotate the choices so the right one is not always first
      var order = b.choices.map(function (_, k) { return (k + i + 1) % b.choices.length; });
      var verdict = h.el('p', 'w12-predict-verdict');
      verdict.setAttribute('aria-live', 'polite');
      var reveal = h.el('div', 'w12-bug-reveal');
      reveal.hidden = true;
      order.forEach(function (k) {
        var ch = b.choices[k];
        var bt = h.el('button', 'viz-seg-btn', ch[0]);
        bt.type = 'button';
        bt.setAttribute('aria-pressed', 'false');
        bt.addEventListener('click', function () {
          Array.prototype.forEach.call(opts.children, function (x) { x.setAttribute('aria-pressed', String(x === bt)); x.classList.remove('is-right', 'is-wrong'); });
          bt.classList.add(ch[1] ? 'is-right' : 'is-wrong');
          if (ch[1]) {
            solved[i] = true;
            verdict.className = 'w12-predict-verdict viz-good';
            verdict.textContent = '✓ That is where it lives.';
            reveal.hidden = false;
          } else {
            verdict.className = 'w12-predict-verdict viz-bad';
            verdict.textContent = '✗ Not quite. Read the symptom again and try another.';
          }
          tally();
        });
        opts.appendChild(bt);
      });
      var giveUp = h.button('Show me the answer', 'ghost');
      giveUp.addEventListener('click', function () {
        reveal.hidden = false;
        Array.prototype.forEach.call(opts.children, function (x, j) { x.classList.toggle('is-right', !!b.choices[order[j]][1]); });
        giveUp.focus();
      });
      ask.appendChild(opts);
      ask.appendChild(giveUp);
      ask.appendChild(verdict);
      detail.appendChild(ask);
      var cause = h.el('p', 'w12-bug-cause');
      cause.innerHTML = '<strong>The cause.</strong> ' + b.cause;
      reveal.appendChild(cause);
      var seg = h.segmented('Version', [{ label: '🐞 With the bug' }, { label: '🔧 With the fix' }], function (k) { show(k); });
      reveal.appendChild(seg.root);
      var paneBox = h.el('div');
      reveal.appendChild(paneBox);
      var links = h.el('p', 'w12-bug-links');
      links.innerHTML = 'Revisit: ' + b.links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + ' →</a>'; }).join(' · ');
      reveal.appendChild(links);
      detail.appendChild(reveal);
      function show(k) {
        paneBox.textContent = '';
        var p = pane(h, progs[k ? b.good : b.bad], k ? 'fixed' : 'buggy');
        p.mark(k ? b.goodLine : b.badLine, k ? 'ok' : 'bad');
        p.show(p.lines.length);
        paneBox.appendChild(p.root);
      }
      seg.pick(0);
      show(0);
    }
    tally();
    open(0);
  });
})();
