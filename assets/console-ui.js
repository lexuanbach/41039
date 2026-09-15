/* 41039 Programming 1 — the interactive console widget.
 *
 * Declarative use (week pages):
 *   <div class="p1-console" data-lang="java" data-title="Hello, Java" data-stdin="">
 *     <script type="text/plain" data-role="source">…code…</script>
 *   </div>
 *
 * Programmatic use (playground):
 *   P1Console.mount(el, { langs: ['java','python'], presets: {...} })
 *
 * Depends on assets/runtime.js. */
window.P1Console = (function () {
  'use strict';

  var LANG_LABEL = { java: 'Java', python: 'Python' };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function dedent(s) {
    var lines = s.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    var indents = lines.filter(function (l) { return l.trim(); })
      .map(function (l) { return l.match(/^[ \t]*/)[0].length; });
    var cut = indents.length ? Math.min.apply(null, indents) : 0;
    return lines.map(function (l) { return l.slice(cut); }).join('\n');
  }

  // Tab should indent, not jump to the next control — this is an editor.
  function enableTab(ta) {
    ta.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Tab') return;
      ev.preventDefault();
      var s = ta.selectionStart, e = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(e);
      ta.selectionStart = ta.selectionEnd = s + 4;
      ta.dispatchEvent(new Event('input'));
    });
  }

  function mount(host, opts) {
    opts = opts || {};
    var langs = opts.langs || [opts.lang || 'java'];
    var sources = opts.sources || {};
    var current = langs[0];
    var initial = {};
    langs.forEach(function (l) { initial[l] = sources[l] || ''; });

    host.classList.add('console');
    host.textContent = '';

    // ── head ──
    var head = el('div', 'console-head');
    head.appendChild(el('span', 'title', opts.title || 'Console'));
    var tabs = null;
    if (langs.length > 1) {
      tabs = el('div', 'lang-tabs');
      langs.forEach(function (l) {
        var b = el('button', l, LANG_LABEL[l]);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(l === current));
        b.addEventListener('click', function () { switchTo(l); });
        tabs.appendChild(b);
      });
      head.appendChild(tabs);
    } else {
      var badge = el('span', 'lang ' + current, LANG_LABEL[current]);
      head.appendChild(badge);
    }

    var expandBtn = el('button', 'btn ghost small expand-btn', 'Expand');
    expandBtn.type = 'button';
    expandBtn.setAttribute('aria-expanded', 'false');
    expandBtn.title = 'Make the editor full screen (Esc to close)';
    head.appendChild(expandBtn);
    host.appendChild(head);

    // ── presets ──
    var presetRow = null;
    if (opts.presets) {
      presetRow = el('div', 'preset-row');
      host.appendChild(presetRow);
    }

    // ── editor: transparent textarea over a highlighted <pre> ──
    var shell = el('div', 'editor-shell');
    var layer = el('pre', 'hl-layer');
    layer.setAttribute('aria-hidden', 'true');
    var editor = el('textarea', 'code-edit');
    editor.spellcheck = false;
    editor.autocapitalize = 'off';
    editor.autocomplete = 'off';
    editor.setAttribute('autocorrect', 'off');
    editor.setAttribute('aria-label', 'Code editor');
    editor.value = initial[current];
    enableTab(editor);
    shell.appendChild(layer);
    shell.appendChild(editor);
    host.appendChild(shell);

    function repaint() {
      P1Highlight.apply(layer, editor.value, current);
      syncScroll();
    }
    function syncScroll() {
      layer.scrollTop = editor.scrollTop;
      layer.scrollLeft = editor.scrollLeft;
    }
    editor.addEventListener('input', repaint);
    editor.addEventListener('scroll', syncScroll);
    // Tab insertion and preset loading change .value without firing 'input'.
    editor.addEventListener('keyup', syncScroll);
    repaint();

    // ── stdin ──
    host.appendChild(el('div', 'console-sub', 'Input (stdin)'));
    var stdin = el('textarea', 'console-stdin');
    stdin.spellcheck = false;
    stdin.setAttribute('aria-label', 'Standard input');
    stdin.value = opts.stdin || '';
    stdin.placeholder = 'Anything the program reads with Scanner / input()';
    enableTab(stdin);
    host.appendChild(stdin);

    // ── boot notice ──
    var boot = el('div', 'console-boot');
    boot.hidden = true;
    host.appendChild(boot);

    // ── bar ──
    var bar = el('div', 'console-bar');
    var runBtn = el('button', 'btn primary', 'Run');
    runBtn.type = 'button';
    var resetBtn = el('button', 'btn ghost small', 'Reset');
    resetBtn.type = 'button';
    var status = el('span', 'console-status', '');
    bar.appendChild(runBtn);
    bar.appendChild(resetBtn);
    bar.appendChild(status);
    host.appendChild(bar);

    // ── output ──
    var out = el('pre', 'console-out');
    out.setAttribute('aria-live', 'polite');
    host.appendChild(out);

    function switchTo(l) {
      if (l === current) return;
      initial[current] = initial[current];
      sources[current] = editor.value;
      current = l;
      editor.value = sources[l] !== undefined ? sources[l] : (initial[l] || '');
      repaint();
      if (tabs) Array.prototype.forEach.call(tabs.children, function (b) {
        b.setAttribute('aria-pressed', String(b.textContent === LANG_LABEL[l]));
      });
      out.textContent = '';
      status.textContent = '';
      renderPresets();
    }

    function renderPresets() {
      if (!presetRow) return;
      presetRow.textContent = '';
      var list = (opts.presets && opts.presets[current]) || [];
      list.forEach(function (p) {
        var b = el('button', null, p.name);
        b.type = 'button';
        b.addEventListener('click', function () {
          editor.value = dedent(p.code);
          stdin.value = p.stdin || '';
          out.textContent = '';
          status.textContent = '';
          repaint();
        });
        presetRow.appendChild(b);
      });
    }
    renderPresets();

    function write(text, isErr) {
      var node = isErr ? el('span', 'err', text) : document.createTextNode(text);
      out.appendChild(node);
      out.scrollTop = out.scrollHeight;
    }

    runBtn.addEventListener('click', function () {
      runBtn.disabled = true;
      resetBtn.disabled = true;
      out.textContent = '';
      status.textContent = 'Running…';
      var started = Date.now();

      P1Runtime.run(current, editor.value, stdin.value, {
        onBoot: function (msg) {
          if (msg) { boot.textContent = msg; boot.hidden = false; }
          else { boot.hidden = true; }
        },
        onOut: function (t) { write(t, false); },
        onErr: function (t) { write(t, true); }
      }).then(function (res) {
        var secs = ((Date.now() - started) / 1000).toFixed(1);
        if (res.ok) {
          status.innerHTML = '<span class="ok">Finished</span> · ' + secs + 's';
        } else if (res.phase === 'compile') {
          status.innerHTML = '<span class="bad">Did not compile</span> · ' + secs + 's';
        } else {
          status.innerHTML = '<span class="bad">Ended with an error</span> · ' + secs + 's';
        }
        if (!out.textContent) write('(no output)', false);
        runBtn.disabled = false;
        resetBtn.disabled = false;
      });
    });

    resetBtn.addEventListener('click', function () {
      editor.value = initial[current] || '';
      stdin.value = opts.stdin || '';
      out.textContent = '';
      status.textContent = '';
      repaint();
    });

    // ── expand / collapse ──
    function setExpanded(on) {
      host.classList.toggle('expanded', on);
      document.body.classList.toggle('console-open', on);
      expandBtn.textContent = on ? 'Close' : 'Expand';
      expandBtn.setAttribute('aria-expanded', String(on));
      syncScroll();
      if (on) editor.focus();
    }
    expandBtn.addEventListener('click', function () {
      setExpanded(!host.classList.contains('expanded'));
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && host.classList.contains('expanded')) setExpanded(false);
    });

    return { run: function () { runBtn.click(); } };
  }

  function mountAll(root) {
    (root || document).querySelectorAll('.p1-console').forEach(function (host) {
      if (host.dataset.mounted) return;
      host.dataset.mounted = '1';
      var srcNode = host.querySelector('[data-role="source"]');
      var lang = host.dataset.lang || 'java';
      var sources = {};
      sources[lang] = srcNode ? dedent(srcNode.textContent) : '';
      mount(host, {
        lang: lang,
        langs: [lang],
        title: host.dataset.title || '',
        sources: sources,
        stdin: host.dataset.stdin || ''
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mountAll(); });
  } else {
    mountAll();
  }

  return { mount: mount, mountAll: mountAll, dedent: dedent };
})();
