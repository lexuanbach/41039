/* 41039 Programming 1 — the shared code window.
 *
 * A transparent <textarea> sits exactly on top of a highlighted <pre>, with a
 * line-number gutter pinned to the left, under a small toolbar. Used by both the
 * console and the exercise runner, so there is one place to get the alignment right.
 * Same design as the sibling CO1005 site.
 *
 * The three layers MUST keep identical font, size, weight, line-height, wrapping
 * rules and vertical padding, or the caret drifts away from the text and the numbers
 * stop matching their lines. Their horizontal padding differs by design: the gutter
 * occupies the left strip and the other two are inset past it.
 *
 *   var ed = P1Editor.create({ lang: 'java', value: '...' });
 *   host.appendChild(ed.root);      ed.shell   ed.textarea   ed.repaint()
 *   ed.setValue(v)   — replaces the text; undoable (Reset, presets, Open…)
 *   ed.load(v)       — replaces the text and starts a fresh undo history (switching language)
 *
 * Toolbar, left:  A− / A+ (program font size) · Wrap · code colour theme. These are
 *   site-wide preferences kept in localStorage; every toolbar repaints on 'p1-view'.
 * Toolbar, right: Undo · Redo · Save… · Open… · Full screen
 *   Full screen needs opts.fullscreen — a function returning the element to lift over the
 *   page (the whole console or exercise card, so Run and the output come along).
 */
window.P1Editor = (function () {
  'use strict';

  var root = document.documentElement;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // ───────────── site-wide view preferences ─────────────
  var CODE_THEMES = [
    { key: 'midnight', label: 'Midnight' },
    { key: 'paper', label: 'Paper' },
    { key: 'contrast', label: 'Contrast' }
  ];
  var CODE_SCALES = [0.85, 1, 1.15, 1.3, 1.5, 1.75, 2];
  function storedScale() {
    try { var v = parseFloat(localStorage.getItem('p1-code-scale')); if (CODE_SCALES.indexOf(v) >= 0) return v; } catch (e) {}
    return 1;
  }
  function applyScale(v) { root.style.setProperty('--code-scale', String(v)); }
  applyScale(storedScale());
  try { if (localStorage.getItem('p1-wrap') === 'off') root.dataset.codeWrap = 'off'; } catch (e) {}
  function wrapOn() { return root.dataset.codeWrap !== 'off'; }
  function changed() { window.dispatchEvent(new Event('p1-view')); }

  function mountViewControls(bar) {
    function button(cls) { var b = el('button', 'ed-btn' + (cls ? ' ' + cls : '')); b.type = 'button'; bar.appendChild(b); return b; }
    var group = el('div', 'font-size-group');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Program font size');
    bar.appendChild(group);
    var minus = el('button', 'ed-btn', 'A−'), plus = el('button', 'ed-btn', 'A+');
    minus.type = plus.type = 'button';
    group.appendChild(minus); group.appendChild(plus);
    var wrapBtn = button('wrap-toggle');
    var themeBtn = button('code-theme-btn');

    function theme() { return root.dataset.codeTheme || 'midnight'; }
    function paint() {
      var v = storedScale(), i = CODE_SCALES.indexOf(v), pct = Math.round(v * 100) + '%';
      minus.disabled = i === 0; plus.disabled = i === CODE_SCALES.length - 1;
      minus.title = 'Smaller program text (now ' + pct + ')'; plus.title = 'Larger program text (now ' + pct + ')';
      minus.setAttribute('aria-label', minus.title); plus.setAttribute('aria-label', plus.title);
      wrapBtn.textContent = wrapOn() ? '↩ Wrap' : '→ No wrap';
      wrapBtn.setAttribute('aria-pressed', String(wrapOn()));
      wrapBtn.title = wrapOn() ? 'Long lines wrap inside the editor — click to scroll sideways instead'
                               : 'Long lines scroll sideways — click to wrap them';
      var t = CODE_THEMES.filter(function (x) { return x.key === theme(); })[0] || CODE_THEMES[0];
      themeBtn.textContent = '◐ ' + t.label;
      themeBtn.title = 'Code colour theme: ' + t.label + ' — click to change';
      themeBtn.setAttribute('aria-label', themeBtn.title);
    }
    function step(d) {
      var i = Math.min(CODE_SCALES.length - 1, Math.max(0, CODE_SCALES.indexOf(storedScale()) + d));
      try { localStorage.setItem('p1-code-scale', String(CODE_SCALES[i])); } catch (e) {}
      applyScale(CODE_SCALES[i]);
      changed();
    }
    minus.addEventListener('click', function () { step(-1); });
    plus.addEventListener('click', function () { step(1); });
    wrapBtn.addEventListener('click', function () {
      var off = wrapOn();
      if (off) root.dataset.codeWrap = 'off'; else delete root.dataset.codeWrap;
      try { localStorage.setItem('p1-wrap', off ? 'off' : 'on'); } catch (e) {}
      changed();
    });
    themeBtn.addEventListener('click', function () {
      var keys = CODE_THEMES.map(function (t) { return t.key; });
      var next = keys[(keys.indexOf(theme()) + 1) % keys.length];
      if (next === 'midnight') delete root.dataset.codeTheme; else root.dataset.codeTheme = next;
      try { localStorage.setItem('p1-code-theme', next); } catch (e) {}   // same key as the top-bar button
      changed();
    });
    window.addEventListener('p1-view', paint);
    paint();
  }

  /* The highlighter returns one HTML string whose <span>s may run across line breaks
     (block comments, Python triple-quoted strings). Cut it into one string per logical
     line, closing and reopening the open span at every break, so each line can be its
     own block and a wrapped line keeps a single line number. */
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
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function create(opts) {
    opts = opts || {};
    var lang = opts.lang || 'java';

    var wrap = el('div', 'editor-wrap');
    var bar = el('div', 'editor-bar');
    var shell = el('div', 'editor-shell');
    var gutter = el('div', 'hl-gutter');
    gutter.setAttribute('aria-hidden', 'true');
    var layer = el('pre', 'hl-layer');
    layer.setAttribute('aria-hidden', 'true');
    var ta = el('textarea', 'code-edit');
    ta.spellcheck = false;
    ta.autocapitalize = 'off';
    ta.autocomplete = 'off';
    ta.setAttribute('autocorrect', 'off');
    if (opts.label) ta.setAttribute('aria-label', opts.label);
    ta.value = opts.value || '';

    shell.appendChild(gutter);
    shell.appendChild(layer);
    shell.appendChild(ta);
    wrap.appendChild(bar);
    wrap.appendChild(shell);

    // The page's top bar also has a code-theme button; on a page with code windows the
    // control lives here instead.
    var topBtn = document.getElementById('code-theme-toggle');
    if (topBtn) topBtn.style.display = 'none';

    // ── layout: line numbers that follow wrapped rows ──
    var lineCount = 0, queued = false;
    function sync() {
      layer.scrollTop = ta.scrollTop;
      layer.scrollLeft = ta.scrollLeft;
      gutter.scrollTop = ta.scrollTop;
    }
    function layout() {
      queued = false;
      // Both layers must break lines at the same column, so the highlight layer gives up
      // exactly the width the textarea loses to its vertical scrollbar.
      var scrollbar = (ta.offsetWidth - ta.clientWidth) - (layer.offsetWidth - layer.clientWidth);
      layer.style.paddingRight = 'calc(1.05rem + ' + Math.max(0, scrollbar) + 'px)';
      var nums = gutter.children, rows = layer.children, i;
      if (nums.length !== lineCount) {
        var html = '';
        for (i = 1; i <= lineCount; i++) html += '<div>' + i + '</div>';
        gutter.innerHTML = html;
        nums = gutter.children;
        // Widen the strip once the numbers need more room.
        shell.style.setProperty('--gutter-w',
          (String(lineCount).length <= 2 ? 2.4 : String(lineCount).length <= 3 ? 3 : 3.6) + 'rem');
      }
      if (wrapOn()) {
        var h = [];
        for (i = 0; i < rows.length; i++) h.push(rows[i].getBoundingClientRect().height);   // read, then write
        for (i = 0; i < nums.length; i++) nums[i].style.height = h[i] + 'px';
      } else {
        for (i = 0; i < nums.length; i++) nums[i].style.height = '';
      }
      sync();
    }
    function queueLayout() {
      if (queued) return;
      queued = true;
      (window.requestAnimationFrame || setTimeout)(layout);
    }
    function repaint() {
      var html = window.P1Highlight ? P1Highlight.toHtml(ta.value, lang) : esc(ta.value);
      var lines = splitLines(html);
      lineCount = lines.length;
      layer.innerHTML = lines.map(function (l) { return '<div class="cl">' + l + '</div>'; }).join('');
      layout();
    }
    if (window.ResizeObserver) new ResizeObserver(queueLayout).observe(shell);
    window.addEventListener('p1-view', queueLayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueLayout);

    // ── undo / redo ──
    /* Our own history: the page rewrites textarea.value itself (Tab, Reset, presets, Open…),
       and every such write wipes the browser's native undo stack. */
    var hist, hi, lastTyped = 0, lastWasTyping = false;
    function snapshot() { return { v: ta.value, s: ta.selectionStart, e: ta.selectionEnd }; }
    function freshHistory() { hist = [snapshot()]; hi = 0; lastWasTyping = false; paintBar(); }
    function record(typing) {
      var cur = snapshot(), now = Date.now();
      if (cur.v === hist[hi].v) { hist[hi] = cur; return; }
      if (typing && lastWasTyping && hi === hist.length - 1 && hi > 0 && now - lastTyped < 700) {
        hist[hi] = cur;                       // keystrokes under 0.7 s apart are one undo step
      } else {
        hist = hist.slice(0, hi + 1);
        hist.push(cur);
        if (hist.length > 400) hist.shift();
        hi = hist.length - 1;
      }
      lastTyped = now; lastWasTyping = typing;
      paintBar();
    }
    function restore(i) {
      hi = i; lastWasTyping = false;
      ta.value = hist[hi].v;
      repaint();
      ta.focus();
      ta.setSelectionRange(hist[hi].s, hist[hi].e);
      paintBar();
    }
    function undo() { if (hi > 0) restore(hi - 1); }
    function redo() { if (hi < hist.length - 1) restore(hi + 1); }

    // ── save to / open from the reader's computer ──
    function fileName() {
      if (lang === 'python') return opts.fileName || 'program.py';
      var m = /\bpublic\s+(?:final\s+|abstract\s+)*class\s+([A-Za-z_$][\w$]*)/.exec(ta.value) ||
              /\bclass\s+([A-Za-z_$][\w$]*)/.exec(ta.value);
      return (m ? m[1] : 'Main') + '.java';   // javac wants the file named after the public class
    }
    var lastHandle = null;
    function download() {
      var name = fileName();
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ta.value], { type: 'text/plain;charset=utf-8' }));
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      flash('Saved ' + name + ' to your Downloads folder');
    }
    /* Chrome and Edge can ask where to save (folder and name); Safari and Firefox have no
       such API, so there the file goes to the Downloads folder. */
    function save() {
      if (typeof window.showSaveFilePicker !== 'function') { download(); return; }
      var isPy = lang === 'python';
      var options = {
        suggestedName: fileName(),
        types: [isPy ? { description: 'Python source file', accept: { 'text/x-python': ['.py'] } }
                     : { description: 'Java source file', accept: { 'text/x-java-source': ['.java'] } }]
      };
      if (lastHandle) options.startIn = lastHandle;
      var content = ta.value;
      window.showSaveFilePicker(options).then(function (handle) {
        lastHandle = handle;
        return handle.createWritable().then(function (w) {
          return w.write(content).then(function () { return w.close(); });
        }).then(function () { flash('Saved ' + handle.name); });
      }).catch(function (e) {
        if (e && e.name === 'AbortError') return;
        if (e && e.name === 'SecurityError') { download(); return; }
        flash('Could not save: ' + ((e && e.message) || e));
      });
    }
    var picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = '.java,.py,.txt,text/plain';
    picker.hidden = true;
    picker.addEventListener('change', function () {
      var f = picker.files && picker.files[0];
      picker.value = '';
      if (!f) return;
      if (f.size > 512 * 1024) { flash('File too large (max 512 KB)'); return; }
      var reader = new FileReader();
      reader.onload = function () { setValue(String(reader.result).replace(/\r\n?/g, '\n')); flash('Opened ' + f.name); };
      reader.onerror = function () { flash('Could not read that file'); };
      reader.readAsText(f);
    });

    // ── toolbar ──
    mountViewControls(bar);
    var note = el('span', 'ed-note');
    note.setAttribute('aria-live', 'polite');
    bar.appendChild(note);
    function barButton(label, title, fn) {
      var b = el('button', 'ed-btn', label);
      b.type = 'button'; b.title = title; b.setAttribute('aria-label', title);
      b.addEventListener('click', fn);
      bar.appendChild(b);
      return b;
    }
    var undoBtn = barButton('↶ Undo', 'Undo (Ctrl/Cmd+Z)', undo);
    var redoBtn = barButton('↷ Redo', 'Redo (Ctrl+Y or Shift+Ctrl/Cmd+Z)', redo);
    bar.appendChild(el('span', 'ed-sep'));
    barButton('⤓ Save…', typeof window.showSaveFilePicker === 'function'
      ? 'Save this program to your computer — you choose the folder and the name (Ctrl/Cmd+S)'
      : 'Save this program to your Downloads folder (Ctrl/Cmd+S)', save);
    barButton('⤒ Open…', 'Open a .java or .py file from your computer', function () { picker.click(); });
    bar.appendChild(picker);

    // ── full screen: the whole code window (editor, input, output, Run) fills the viewport ──
    var fsBtn = null;
    function fsTarget() { return (opts.fullscreen && opts.fullscreen()) || null; }
    function setFullscreen(on) {
      var target = fsTarget();
      if (!target) return;
      target.classList.toggle('code-fullscreen', on);
      document.body.classList.toggle('code-fullscreen-open', on);
      fsBtn.textContent = on ? '✕ Exit full screen' : '⛶ Full screen';
      fsBtn.setAttribute('aria-pressed', String(on));
      fsBtn.title = on ? 'Back to the page (Esc)' : 'Make this code window fill the screen (Esc to leave)';
      queueLayout();
      if (on) ta.focus();
      else target.scrollIntoView({ block: 'nearest' });
    }
    if (opts.fullscreen) {
      bar.appendChild(el('span', 'ed-sep'));
      fsBtn = barButton('⛶ Full screen', 'Make this code window fill the screen (Esc to leave)', function () {
        setFullscreen(!fsTarget().classList.contains('code-fullscreen'));
      });
      fsBtn.setAttribute('aria-pressed', 'false');
      document.addEventListener('keydown', function (ev) {
        var target = fsTarget();
        if (ev.key === 'Escape' && target && target.classList.contains('code-fullscreen')) setFullscreen(false);
      });
    }
    var noteTimer = null;
    function flash(text) {
      note.textContent = text;
      clearTimeout(noteTimer);
      noteTimer = setTimeout(function () { note.textContent = ''; }, 2500);
    }
    function paintBar() {
      if (!undoBtn) return;
      undoBtn.disabled = hi === 0;
      redoBtn.disabled = hi >= hist.length - 1;
    }

    function setValue(v) { ta.value = v; repaint(); record(false); }
    function load(v) { ta.value = v; repaint(); freshHistory(); }

    ta.addEventListener('input', function (ev) {
      repaint();
      record(ev.inputType === 'insertText' || ev.inputType === 'deleteContentBackward' || ev.inputType === 'deleteContentForward');
    });
    ta.addEventListener('scroll', sync);
    ta.addEventListener('keyup', sync);
    ta.addEventListener('click', sync);
    ta.addEventListener('keydown', function (ev) {
      if (ev.key === 'Tab') {                 // Tab indents rather than moving focus — this is an editor.
        ev.preventDefault();
        var s = ta.selectionStart, e = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(e);
        ta.selectionStart = ta.selectionEnd = s + 4;
        repaint(); record(false);
        return;
      }
      if (!(ev.ctrlKey || ev.metaKey) || ev.altKey) return;
      var k = ev.key.toLowerCase();
      if (k === 'z') { ev.preventDefault(); if (ev.shiftKey) redo(); else undo(); }
      else if (k === 'y') { ev.preventDefault(); redo(); }
      else if (k === 's') { ev.preventDefault(); save(); }
    });

    repaint();
    freshHistory();

    return {
      root: wrap,
      shell: shell,
      textarea: ta,
      // Callers that write textarea.value themselves call repaint() afterwards; record that
      // write too, so Reset and presets can be undone.
      repaint: function () { repaint(); record(false); },
      setLang: function (l) { lang = l; repaint(); },
      setValue: setValue,
      load: load
    };
  }

  return { create: create };
})();
