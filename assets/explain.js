/* 41039 Programming 1 — explained code: a read-only example whose key parts show what
 * they do when the reader hovers, taps or tabs to them.
 *
 *   <div class="p1-explain" data-lang="python" data-title="A typical list program" data-stdin="">
 *     <script type="text/plain" data-role="source">…code…</script>
 *     <ol data-role="notes">
 *       <li data-line="1" data-match="[72, 85]" data-title="Square brackets make a list">…</li>
 *     </ol>
 *   </div>
 *
 * Each note marks the exact text `data-match` on line `data-line` (1-based; `data-nth` picks a
 * later occurrence on that line). Notes may not overlap. A note whose text is not found is
 * skipped with a console warning, so a typo in a page never breaks the example.
 *
 * One tooltip serves the whole page: a fixed-position element on <body>, so the code's own
 * horizontal scrolling cannot clip it. Mouse: hover shows it, click pins it. Touch: tap toggles.
 * Keyboard: Tab to a marked part. Esc or a click elsewhere closes it. The same notes are also
 * listed, in order, under "All explanations", for print and for screen readers.
 *
 * Run sends the source to P1Runtime (assets/runtime.js), as the consoles do, with
 * `data-stdin` as the input. "✎ Edit" swaps the example for a full console
 * (assets/console-ui.js) holding the same code and input; "Back to the explanations" returns,
 * and the edited copy is kept for the next visit.
 *
 * Code the browser cannot run (Java records need Java 16; the runtime is Java 8): set
 * data-run="none" and give the real output, shown as it is, with
 *     <pre data-role="output" data-label="Output (Java 16 or later)">…</pre>
 *
 * Depends on assets/highlight.js; assets/console-ui.js is optional (Edit, and dedent).
 */
window.P1Explain = (function () {
  'use strict';

  var LANG_LABEL = { java: 'Java', python: 'Python', cpp: 'C++', c: 'C' };
  // C and C++ appear only as read-only comparisons; the Java rules colour them well enough.
  function hlLang(lang) { return lang === 'cpp' || lang === 'c' ? 'java' : lang; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function dedent(s) {
    if (window.P1Console && P1Console.dedent) return P1Console.dedent(s);
    var lines = s.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    var cut = Math.min.apply(null, lines.filter(function (l) { return l.trim(); })
      .map(function (l) { return l.match(/^[ \t]*/)[0].length; }).concat([Infinity]));
    return lines.map(function (l) { return l.slice(cut === Infinity ? 0 : cut); }).join('\n');
  }

  /* The highlighter's spans are flat, but one may run across a line break (a triple-quoted
     string); close and reopen it so every line is complete on its own. */
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

  /* Wrap character ranges of one highlighted line in marker tags. A range may start or end
     inside a highlight span, so the span is closed before the marker opens or closes and then
     reopened — the nesting stays valid. Positions count characters, an entity as one. */
  function wrapRanges(html, ranges) {
    var out = '', pos = 0, open = '', r = 0, inside = false;
    var re = /(<span[^>]*>)|(<\/span>)|(&[a-z#0-9]+;|[^<&])/g, m;
    function boundary() {
      if (inside && pos === ranges[r].end) {
        out += (open ? '</span>' : '') + '</span>' + open;
        inside = false; r++;
      }
      if (!inside && r < ranges.length && pos === ranges[r].start) {
        out += (open ? '</span>' : '') + ranges[r].tag + open;
        inside = true;
      }
    }
    while ((m = re.exec(html)) !== null) {
      if (m[1]) { open = m[1]; out += m[1]; }
      else if (m[2]) { open = ''; out += m[2]; }
      else { boundary(); out += m[3]; pos++; }
    }
    boundary();
    return out;
  }

  // ───────────── the shared tooltip ─────────────
  var tip = null, tipTitle, tipBody, shownFor = null, pinned = false;
  function ensureTip() {
    if (tip) return;
    tip = el('div', 'explain-tip');
    tip.id = 'p1-explain-tip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    tipTitle = el('strong', 'explain-tip-title');
    tipBody = el('div', 'explain-tip-body');
    tip.appendChild(tipTitle);
    tip.appendChild(tipBody);
    document.body.appendChild(tip);
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && shownFor) hide(true); });
    document.addEventListener('click', function (ev) {
      if (pinned && !ev.target.closest('.xk') && !ev.target.closest('.explain-tip')) hide(true);
    });
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
  }
  function place() {
    if (!shownFor) return;
    var r = shownFor.getBoundingClientRect(), gap = 8, edge = 8;
    var w = tip.offsetWidth, h = tip.offsetHeight, vw = document.documentElement.clientWidth;
    var below = r.bottom + gap + h <= window.innerHeight || r.top - gap - h < 0;
    tip.style.top = (below ? r.bottom + gap : r.top - gap - h) + 'px';
    tip.style.left = Math.max(edge, Math.min(r.left, vw - w - edge)) + 'px';
    tip.classList.toggle('above', !below);
  }
  function show(token, pin) {
    ensureTip();
    if (shownFor && shownFor !== token) shownFor.classList.remove('is-active');
    var note = token._note;
    tipTitle.textContent = note.title;
    tipTitle.hidden = !note.title;
    tipBody.innerHTML = note.html;
    tip.hidden = false;
    shownFor = token;
    pinned = !!pin;
    token.classList.add('is-active');
    token.setAttribute('aria-describedby', tip.id);
    place();
  }
  function hide(force) {
    if (!shownFor || (pinned && !force)) return;
    shownFor.classList.remove('is-active');
    shownFor.removeAttribute('aria-describedby');
    shownFor = null; pinned = false;
    tip.hidden = true;
  }

  // ───────────── one explained example ─────────────
  function mount(host) {
    var lang = host.dataset.lang || 'python';
    var srcNode = host.querySelector('[data-role="source"]');
    var source = srcNode ? dedent(srcNode.textContent) : '';
    var raw = source.split('\n');
    var notes = [];
    Array.prototype.forEach.call(host.querySelectorAll('[data-role="notes"] > li'), function (li) {
      var line = parseInt(li.dataset.line, 10), match = li.dataset.match || '';
      var nth = parseInt(li.dataset.nth || '1', 10), text = raw[line - 1], at = -1;
      for (var k = 0; text !== undefined && match && k < nth; k++) at = text.indexOf(match, at + 1);
      if (at < 0) { console.warn('P1Explain: "' + match + '" not found on line ' + line, host); return; }
      notes.push({ line: line, start: at, end: at + match.length, match: match,
                   title: li.dataset.title || '', html: li.innerHTML.trim() });
    });
    notes.sort(function (a, b) { return a.line - b.line || a.start - b.start; });
    var title = host.dataset.title || 'Explained example';
    var runnable = host.dataset.run !== 'none';
    var stdinText = host.dataset.stdin || '';
    var outNode = host.querySelector('[data-role="output"]');
    var fixedOut = outNode ? { text: dedent(outNode.textContent), label: outNode.dataset.label || 'Output' } : null;

    host.classList.add('explain');
    host.textContent = '';

    // head
    var head = el('div', 'explain-head');
    head.appendChild(el('span', 'title', title));
    head.appendChild(el('span', 'lang ' + lang, LANG_LABEL[lang] || lang));
    var hint = el('span', 'explain-hint');
    hint.innerHTML = '<span class="when-hover">Hover</span><span class="when-touch">Tap</span> the ' +
      '<span class="xk-sample">underlined</span> parts.';
    head.appendChild(hint);
    var editBtn = null;
    if (runnable && window.P1Console) {
      editBtn = el('button', 'btn ghost small explain-edit', '✎ Edit');
      editBtn.type = 'button';
      editBtn.title = 'Open this program in an editor: change it, run it, break it';
      editBtn.addEventListener('click', function () { setEditing(true); });
      head.appendChild(editBtn);
    }
    host.appendChild(head);
    var body = el('div', 'explain-body');
    host.appendChild(body);

    // code, one block per line, with the notes marked
    var html = splitLines(window.P1Highlight ? P1Highlight.toHtml(source, hlLang(lang)) : esc(source));
    var tokens = [];
    var pre = el('pre', 'explain-code');
    pre.innerHTML = html.map(function (lineHtml, i) {
      var mine = notes.filter(function (n) { return n.line === i + 1; });
      mine.forEach(function (n) {
        n.index = notes.indexOf(n);
        n.tag = '<span class="xk" tabindex="0" data-note="' + n.index + '">';
      });
      return '<div class="cl">' + (mine.length ? wrapRanges(lineHtml, mine) : lineHtml) + '</div>';
    }).join('');
    body.appendChild(pre);
    pre.querySelectorAll('.xk').forEach(function (t) {
      t._note = notes[+t.dataset.note];
      tokens[+t.dataset.note] = t;
      t.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse' && shownFor !== t) show(t, false); });
      t.addEventListener('pointerleave', function (ev) { if (ev.pointerType === 'mouse') hide(false); });
      t.addEventListener('focus', function () { if (!pinned || shownFor !== t) show(t, false); });
      t.addEventListener('blur', function () { hide(false); });
      t.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (shownFor === t && pinned) hide(true); else show(t, true);
      });
    });

    // run — or, for code the browser cannot run, the real output as given
    var bar = el('div', 'console-bar');
    var runBtn = el('button', 'btn primary', 'Run');
    runBtn.type = 'button';
    var status = el('span', 'console-status');
    var boot = el('div', 'console-boot');
    boot.hidden = true;
    var out = el('pre', 'console-out explain-out');
    out.hidden = true;
    if (runnable) {
      bar.appendChild(runBtn);
      bar.appendChild(status);
      if (stdinText) {
        var given = el('span', 'explain-stdin');
        given.appendChild(document.createTextNode('Input: '));
        given.appendChild(el('code', null, stdinText.replace(/\n$/, '').split('\n').join(' ⏎ ') + ' ⏎'));
        given.title = 'What the program reads, as if typed. Press ✎ Edit to change it.';
        bar.appendChild(given);
      }
      body.appendChild(bar);
      body.appendChild(boot);
      body.appendChild(out);
    } else if (fixedOut) {
      body.appendChild(el('div', 'console-sub explain-fixed-label', fixedOut.label));
      body.appendChild(el('pre', 'console-out explain-out', fixedOut.text));
    }
    runBtn.addEventListener('click', function () {
      if (!window.P1Runtime) { status.textContent = 'The runtime is not loaded on this page.'; return; }
      runBtn.disabled = true;
      out.hidden = false;
      out.textContent = '';
      status.textContent = 'Running…';
      var started = Date.now();
      function write(t, isErr) { out.appendChild(isErr ? el('span', 'err', t) : document.createTextNode(t)); }
      P1Runtime.run(lang, source, stdinText, {
        onBoot: function (msg) { boot.hidden = !msg; if (msg) boot.textContent = msg; },
        onOut: function (t) { write(t, false); },
        onErr: function (t) { write(t, true); }
      }).then(function (res) {
        var secs = ((Date.now() - started) / 1000).toFixed(1);
        status.innerHTML = (res.ok ? '<span class="ok">Finished</span>' : '<span class="bad">Ended with an error</span>') + ' · ' + secs + 's';
        if (!out.textContent) write('(no output)', false);
        runBtn.disabled = false;
      });
    });

    // every note, in order — for print, screen readers, and reading straight through
    var all = el('details', 'explain-all');
    all.appendChild(el('summary', null, 'All ' + notes.length + ' explanations, in order'));
    var ol = el('ol');
    notes.forEach(function (n, i) {
      var li = el('li');
      var ref = el('span', 'explain-ref');
      ref.appendChild(document.createTextNode('line ' + n.line + ' '));
      ref.appendChild(el('code', null, n.match));
      li.appendChild(ref);
      if (n.title) li.appendChild(el('strong', null, n.title));
      var body = el('div');
      body.innerHTML = n.html;
      li.appendChild(body);
      // pointing at an explanation lights up the code it belongs to
      li.addEventListener('mouseenter', function () { if (tokens[i]) tokens[i].classList.add('is-linked'); });
      li.addEventListener('mouseleave', function () { if (tokens[i]) tokens[i].classList.remove('is-linked'); });
      ol.appendChild(li);
    });
    all.appendChild(ol);
    body.appendChild(all);

    // edit mode: the same program in a full console; the edited copy survives a trip back
    var consoleBox = null;
    function setEditing(on) {
      hide(true);
      if (on && !consoleBox) {
        consoleBox = el('div');
        host.appendChild(consoleBox);
        var sources = {};
        sources[lang] = source;
        P1Console.mount(consoleBox, { lang: lang, langs: [lang], title: title, sources: sources, stdin: stdinText });
        var back = el('button', 'btn ghost small', '↩ Back to the explanations');
        back.type = 'button';
        back.addEventListener('click', function () { setEditing(false); });
        consoleBox.querySelector('.console-head').appendChild(back);
      }
      host.classList.toggle('is-editing', on);
      head.hidden = body.hidden = on;
      if (consoleBox) consoleBox.hidden = !on;
      if (on) {
        consoleBox.querySelector('textarea.code-edit').focus();
      } else {
        editBtn.textContent = '✎ Your edited copy';
        editBtn.focus();
      }
    }
  }

  function mountAll(root) {
    (root || document).querySelectorAll('.p1-explain').forEach(function (host) {
      if (host.dataset.mounted) return;
      host.dataset.mounted = '1';
      mount(host);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mountAll(); });
  else mountAll();

  return { mountAll: mountAll };
})();
