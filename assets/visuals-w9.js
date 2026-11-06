/* 41039 Programming 1 — Week 9 diagram kinds (exceptions and reading text).
 *
 *   w9-steps  a scripted step-through of one or two real programs (Java and/or Python), with
 *             optional panels that change at each step:
 *               track   a row of values, the current one highlighted
 *               stack   the call stack, newest frame on top; a thrown exception rides on a frame
 *               text    the characters of an input text, the reader's position and what a call consumed
 *               file    the lines of a file, the next line to read, and each record's verdict
 *               vars    variables as name = value
 *               ask     a prediction question with feedback
 *             and, per code pane, a badge (what just happened) and a row of block chips
 *             (which try/catch/finally blocks ran).
 *
 * Spec (written by content/weeks/week-9.json, checked by scripts/check_week_content.py):
 *   { kind, title, intro, pick?, programs: [{lang, code, output, tokens}],
 *     variants: [{ label, panes: [program index…], text?, file?: {name, lines},
 *                  steps: [{ say, lines: [token|null per pane], tones?, out: [lines shown per pane],
 *                            track?, stack?, text?, file?, vars?, ask?, badge?, blocks? }] }] }
 * Output panes only ever show a prefix of the program's real, checked output.
 */
(function () {
  'use strict';
  if (!window.P1Visuals) return;
  var LANG = { java: 'Java', python: 'Python' };

  P1Visuals.register('w9-steps', function (host, spec, h) {
    var el = h.el, esc = h.esc;
    var body = h.shell(host, spec);
    var langsBox = host.querySelector('.viz-langs');

    var picker = null;
    if (spec.variants.length > 1) {
      var form = el('div', 'viz-form');
      form.appendChild(el('span', 'viz-field-label', (spec.pick || 'Version') + ':'));
      picker = h.segmented(spec.pick || 'Version', spec.variants.map(function (v) { return { label: v.label }; }), choose);
      picker.root.classList.add('viz-seg-wrap');
      form.appendChild(picker.root);
      body.appendChild(form);
    }

    var stage = el('div', 'viz-stage w9-stage');
    var trackBox = el('div', 'w9-track');
    var stackBox = el('div', 'w9-stackwrap');
    var textBox = el('div', 'w9-textwrap');
    var fileBox = el('div', 'w9-filewrap');
    var vars = el('div', 'viz-vars');
    [trackBox, stackBox, textBox, fileBox, vars].forEach(function (n) { stage.appendChild(n); });
    body.appendChild(stage);

    var stackTitle = el('div', 'w9-panel-title', 'Call stack · newest frame on top');
    var stackList = el('div', 'w9-stack');
    stackList.setAttribute('role', 'list');
    stackList.setAttribute('aria-label', 'Call stack, newest frame first');
    stackBox.appendChild(stackTitle);
    stackBox.appendChild(stackList);

    var ask = el('div', 'w9-ask');
    var panesBox = el('div', 'viz-panes');
    var panes = [], variant = null;

    var st = h.stepper(host, render);
    body.appendChild(st.say);
    body.appendChild(ask);
    body.appendChild(st.bar);
    body.appendChild(panesBox);

    function choose(n) {
      variant = spec.variants[n];
      panesBox.textContent = '';
      panes = variant.panes.map(function (idx) {
        var prog = spec.programs[idx];
        var pane = h.codePane(prog.lang, prog.code, { output: true, label: prog.lang === 'java' ? 'Demo.java' : 'main.py' });
        var badge = el('div', 'w9-badge');
        badge.setAttribute('aria-live', 'polite');
        var blocks = el('div', 'w9-blocks');
        blocks.setAttribute('role', 'list');
        blocks.setAttribute('aria-label', 'Blocks of the ' + LANG[prog.lang] + ' program');
        var outLabel = pane.root.querySelector('.viz-out-label');
        pane.root.insertBefore(blocks, outLabel);
        pane.root.insertBefore(badge, blocks);
        panesBox.appendChild(pane.root);
        var out = prog.output ? prog.output.replace(/\n$/, '').split('\n') : [];
        return { pane: pane, badge: badge, blocks: blocks, out: out, lang: prog.lang };
      });
      // the language badges in the head follow the programs on show
      langsBox.textContent = '';
      panes.forEach(function (p) { langsBox.appendChild(el('span', 'lang ' + p.lang, LANG[p.lang])); });
      stackList.textContent = '';
      stackList._drawn = false;
      st.set(variant.steps);
    }

    function render(f) {
      var askHadFocus = ask.contains(document.activeElement);
      panes.forEach(function (p, i) {
        var tok = f.lines[i];
        p.pane.mark(tok ? p.pane.line(tok) : 0, (f.tones && f.tones[i]) || 'now');
        p.pane.setOut(p.out.slice(0, f.out[i]).join('\n'));
        var b = f.badge && f.badge[p.lang];
        p.badge.hidden = !b;
        if (b) { p.badge.dataset.tone = b[0] || ''; p.badge.textContent = b[1]; }
        var bl = f.blocks && f.blocks[p.lang];
        p.blocks.hidden = !bl;
        if (bl) {
          p.blocks.innerHTML = bl.map(function (x) {
            var state = { run: 'ran', skip: 'skipped', now: 'running now' }[x[1]] || 'not reached';
            return '<span role="listitem" class="w9-block" data-tone="' + esc(x[1]) + '" title="' + esc(x[0] + ': ' + state) + '">' +
                   esc(x[0]) + '<span class="w9-sr"> (' + state + ')</span></span>';
          }).join('');
        }
      });
      drawTrack(f.track);
      drawStack(f.stack);
      drawText(f.text);
      drawFile(f.file);
      vars.innerHTML = (f.vars || []).map(function (v) { return '<span>' + esc(v[0]) + ' = ' + esc(v[1]) + '</span>'; }).join('');
      stage.hidden = !(f.track || f.stack || f.text || (f.file && f.file.show !== false) || (f.vars && f.vars.length));
      drawAsk(f.ask);
      // the question's buttons were replaced: keep the keyboard user inside the diagram
      if (askHadFocus && !ask.contains(document.activeElement)) (st.next.disabled ? host.querySelector('.viz-controls .btn') : st.next).focus();
    }

    function drawTrack(t) {
      trackBox.hidden = !t;
      if (!t) return;
      trackBox.innerHTML = '<div class="w9-panel-title">' + esc(t.title) + '</div><div class="w9-chips">' + t.items.map(function (x) {
        return '<span class="w9-chip" data-tone="' + esc(x[1]) + '">' + esc(x[0]) + '</span>';
      }).join('') + '</div>';
    }

    function drawStack(frames) {
      stackBox.hidden = !frames;
      if (!frames) return;
      var items = frames.map(function (fr, i) { return { k: i + ':' + fr.f, fr: fr, depth: i }; }).reverse();
      h.flip(stackList, items, function () {
        var n = el('div', 'w9-frame');
        n.setAttribute('role', 'listitem');
        return n;
      }, function (n, it) {
        var fr = it.fr;
        n.dataset.tone = fr.tone || '';
        n.classList.toggle('is-lib', !!fr.lib);
        var html = '<span class="w9-fname">' + esc(fr.f) + '</span>';
        if (fr.py) html += '<span class="w9-fpy">Python: ' + esc(fr.py) + '</span>';
        if (fr.lib) html += '<span class="w9-ftag">library</span>';
        if (fr.v) html += '<span class="w9-fvar">' + esc(fr.v) + '</span>';
        var tone = { throw: 'throws', unwind: 'ends without finishing', 'catch': 'handles it', 'finally': 'runs finally' }[fr.tone];
        if (fr.exc) html += '<span class="w9-exc">⚡ ' + esc(fr.exc) + (tone ? '<span class="w9-sr"> — this frame ' + tone + '</span>' : '') + '</span>';
        else if (tone) html += '<span class="w9-sr"> — this frame ' + tone + '</span>';
        n.innerHTML = html;
      });
      stackList.classList.toggle('is-empty', !frames.length);
      stackList.dataset.empty = 'Empty: the program has ended.';
    }

    function drawText(t) {
      var src = variant.text;
      textBox.hidden = !t || src === undefined;
      if (textBox.hidden) return;
      function within(r, i) { return r && i >= r[0] && i < r[1]; }
      var html = '<div class="w9-panel-title">Input text · reader position ▼</div><div class="w9-text" role="img" aria-label="' +
        esc('Input text ' + JSON.stringify(src) + ', reader at character ' + t.pos + (t.eof ? ', at the end' : '')) + '">';
      for (var i = 0; i <= src.length; i++) {
        if (i === t.pos) html += '<span class="w9-caret" aria-hidden="true"></span>';
        if (i === src.length) break;
        var ch = src.charAt(i), cls = 'w9-ch';
        if (ch === ' ' || ch === '\n') cls += ' is-ws';
        if (within(t.read, i)) cls += ' is-read';
        else if (within(t.peek, i)) cls += ' is-peek';
        else if (within(t.skip, i)) cls += ' is-skip';
        else if (within(t.lost, i)) cls += ' is-lost';
        else if (i < t.pos) cls += ' is-used';
        html += '<span class="' + cls + '">' + (ch === ' ' ? '␣' : ch === '\n' ? '⏎' : esc(ch)) + '</span>';
        if (ch === '\n') html += '<span class="w9-nl"></span>';
      }
      html += '<span class="w9-eof' + (t.eof ? ' is-hit' : '') + '">end</span></div>';
      if (t.got !== undefined) html += '<div class="w9-got"><span>' + esc(t.gotLabel || 'returned') + ' →</span> <code>' + esc(t.got) + '</code></div>';
      if (t.lost) html += '<div class="w9-got is-lost">Never read: <code>' + esc(JSON.stringify(src.slice(t.lost[0], t.lost[1]))) + '</code></div>';
      textBox.innerHTML = html;
    }

    function drawFile(fs) {
      var spec_ = variant.file;
      fileBox.hidden = !fs || !spec_ || fs.show === false;
      if (fileBox.hidden) return;
      var marks = fs.marks || {};
      var html = '<div class="w9-file-head" data-tone="' + esc(fs.tone || '') + '"><span class="w9-file-name">' + esc(spec_.name) + '</span>' +
        (fs.status ? '<span class="w9-file-status">' + esc(fs.status) + '</span>' : '') + '</div><ol class="w9-file">';
      spec_.lines.forEach(function (line, i) {
        var cls = [];
        if (fs.at === i && !fs.eof) cls.push('is-at');
        if (fs.reading === i) cls.push('is-reading');
        var verdict = marks[String(i)];
        html += '<li class="' + cls.join(' ') + '" data-tone="' + esc(verdict || '') + '"><span class="w9-ln">' + (i + 1) + '</span><code>' + esc(line) + '</code>' +
          (verdict ? '<span class="w9-verdict">' + (verdict === 'ok' ? '✓ parsed' : '✗ bad mark') + '</span>' : '') + '</li>';
      });
      html += '<li class="w9-file-end' + (fs.eof ? ' is-at' : '') + '"><span class="w9-ln"></span><span>end of file</span></li></ol>';
      fileBox.innerHTML = html;
    }

    function drawAsk(a) {
      ask.textContent = '';
      ask.hidden = !a;
      if (!a) return;
      var q = el('p', 'w9-ask-q');
      q.innerHTML = '<span class="w9-ask-tag">Predict</span> ' + a.q;
      ask.appendChild(q);
      var row = el('div', 'w9-ask-opts');
      var fb = el('p', 'w9-ask-fb');
      fb.setAttribute('aria-live', 'polite');
      a.opts.forEach(function (o, i) {
        var b = el('button', 'viz-seg-btn', o);
        b.type = 'button';
        b.addEventListener('click', function () {
          row.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-right', 'is-wrong'); x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          b.classList.add(i === a.a ? 'is-right' : 'is-wrong');
          fb.innerHTML = (i === a.a ? '<strong class="viz-good">✓ Right.</strong> ' : '<strong class="viz-bad">✗ Not this time.</strong> The answer is “' + esc(a.opts[a.a]) + '”. ') +
            (a.why || '') + ' Press <strong>Next</strong> to see it happen.';
        });
        row.appendChild(b);
      });
      ask.appendChild(row);
      ask.appendChild(fb);
    }

    if (picker) picker.pick(0);
    choose(0);
  });

  // The typecheck kind labels its first choice for a list declaration; Week 9 uses it for a method.
  function relabel() {
    document.querySelectorAll('.p1-viz[data-kind="typecheck"] .viz-seg[aria-label="Declare the list as"]').forEach(function (g) {
      g.setAttribute('aria-label', 'Declare the method as');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', relabel);
  else relabel();
})();
