/* 41039 Programming 1 — the shared code editor.
 *
 * A transparent <textarea> sits exactly on top of a highlighted <pre>, with a
 * line-number gutter pinned to the left. Used by both the console and the
 * exercise runner, so there is one place to get the alignment right.
 *
 * The three layers MUST keep identical font, size, line-height and vertical
 * padding, or the caret drifts away from the text and the numbers stop matching
 * their lines. Their horizontal padding differs by design: the gutter occupies
 * the left strip and the other two are inset past it.
 *
 *   var ed = P1Editor.create({ lang: 'java', value: '...' });
 *   host.appendChild(ed.shell);      ed.textarea      ed.repaint()
 */
window.P1Editor = (function () {
  'use strict';

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function create(opts) {
    opts = opts || {};
    var lang = opts.lang || 'java';

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

    var lastCount = -1;

    function paintGutter() {
      var count = ta.value.split('\n').length;
      if (count === lastCount) return;
      lastCount = count;
      var nums = new Array(count);
      for (var i = 0; i < count; i++) nums[i] = i + 1;
      gutter.textContent = nums.join('\n');
      // Widen the strip once the numbers need more room, so 3- and 4-digit
      // files do not push their numbers under the code.
      shell.style.setProperty('--gutter-w',
        (String(count).length <= 2 ? 2.4 : String(count).length <= 3 ? 3 : 3.6) + 'rem');
    }

    function sync() {
      layer.scrollTop = ta.scrollTop;
      layer.scrollLeft = ta.scrollLeft;
      gutter.scrollTop = ta.scrollTop;
    }

    function repaint() {
      if (window.P1Highlight) P1Highlight.apply(layer, ta.value, lang);
      else layer.textContent = ta.value + '\n';
      paintGutter();
      sync();
    }

    ta.addEventListener('input', repaint);
    ta.addEventListener('scroll', sync);
    ta.addEventListener('keyup', sync);
    ta.addEventListener('click', sync);

    // Tab indents rather than moving focus — this is an editor.
    ta.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Tab') return;
      ev.preventDefault();
      var s = ta.selectionStart, e = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(e);
      ta.selectionStart = ta.selectionEnd = s + 4;
      repaint();
    });

    repaint();

    return {
      shell: shell,
      textarea: ta,
      repaint: repaint,
      setLang: function (l) { lang = l; repaint(); },
      setValue: function (v) { ta.value = v; repaint(); }
    };
  }

  return { create: create };
})();
