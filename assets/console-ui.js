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
  var IO_KEY = 'p1-io-mode';
  function storedMode() { try { return localStorage.getItem(IO_KEY) === 'interactive' ? 'interactive' : 'batch'; } catch (e) { return 'batch'; } }

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

    host.appendChild(head);

    // ── presets ──
    var presetRow = null;
    if (opts.presets) {
      presetRow = el('div', 'preset-row');
      host.appendChild(presetRow);
    }

    // ── editor (shared factory: overlay + line-number gutter) ──
    var ed = P1Editor.create({
      lang: current, value: initial[current], label: 'Code editor',
      fullscreen: function () { return host; }
    });
    var editor = ed.textarea;
    host.appendChild(ed.root);

    function repaint() { ed.repaint(); }
    function syncScroll() { ed.repaint(); }

    // ── input mode: a box filled in before the run, or an interactive terminal ──
    var ioRow = el('div', 'console-io');
    var sw = el('div', 'io-mode');
    sw.setAttribute('role', 'group');
    sw.setAttribute('aria-label', 'How the program receives its input');
    var bBatch = el('button', null, 'Input box'), bInter = el('button', null, '⌨ Interactive terminal');
    bBatch.type = bInter.type = 'button';
    bBatch.title = 'Type all the input first, then run';
    bInter.title = 'Run first, then type each value when the program asks — like a real terminal';
    sw.appendChild(bBatch); sw.appendChild(bInter);
    ioRow.appendChild(sw);
    host.appendChild(ioRow);

    // ── stdin ──
    var stdinLabel = el('div', 'console-sub');
    stdinLabel.appendChild(el('span', null, 'Input (stdin)'));
    stdinLabel.appendChild(el('span', 'hint', 'drag the corner to resize'));
    host.appendChild(stdinLabel);
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
    var outLabel = el('div', 'console-sub');
    var outTitle = el('span', null, 'Output');
    outLabel.appendChild(outTitle);
    outLabel.appendChild(el('span', 'hint', 'drag the corner to resize'));
    host.appendChild(outLabel);
    var out = el('pre', 'console-out');
    out.setAttribute('aria-live', 'polite');
    host.appendChild(out);
    var hint = el('div', 'term-hint');
    hint.hidden = true;
    host.appendChild(hint);

    function switchTo(l) {
      if (l === current) return;
      initial[current] = initial[current];
      sources[current] = editor.value;
      current = l;
      ed.setLang(l);
      ed.load(sources[l] !== undefined ? sources[l] : (initial[l] || ''));
      if (tabs) Array.prototype.forEach.call(tabs.children, function (b) {
        b.setAttribute('aria-pressed', String(b.textContent === LANG_LABEL[l]));
      });
      endSession();
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
          endSession();
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
    var hooks = {
      onBoot: function (msg) {
        if (msg) { boot.textContent = msg; boot.hidden = false; }
        else { boot.hidden = true; }
      }
    };
    function report(res, started) {
      var secs = ((Date.now() - started) / 1000).toFixed(1);
      if (res.ok) {
        status.innerHTML = '<span class="ok">Finished</span> · ' + secs + 's';
      } else if (res.phase === 'compile') {
        status.innerHTML = '<span class="bad">Did not compile</span> · ' + secs + 's';
      } else {
        status.innerHTML = '<span class="bad">Ended with an error</span> · ' + secs + 's';
      }
    }

    /* Interactive mode is re-execution (see runtime.js): run with the lines typed so far; when
       the program reads past them, show its output up to there plus a live prompt, and on Enter
       run again with one more line. Programs here are deterministic, so it reads as a terminal. */
    var mode = storedMode();
    var session = null;     // { inputs[] consumed so far, pending[] pasted but not yet fed, marks[], eof, started }
    var runToken = 0;

    function paintMode() {
      var inter = mode === 'interactive';
      bBatch.setAttribute('aria-pressed', String(!inter));
      bInter.setAttribute('aria-pressed', String(inter));
      stdinLabel.hidden = inter; stdin.hidden = inter;
      outTitle.textContent = inter ? 'Terminal' : 'Output';
      out.classList.toggle('is-terminal', inter);
      out.dataset.empty = inter ? 'Press Run — then type here whenever the program waits for input.' : 'Output appears here.';
    }
    function endSession() {
      session = null; runToken++;
      hint.hidden = true; hint.textContent = '';
      out.onclick = null;
      runBtn.disabled = false; resetBtn.disabled = false;
    }
    function setMode(m) {
      if (m === mode) return;
      mode = m;
      try { localStorage.setItem(IO_KEY, m); } catch (e) {}
      window.dispatchEvent(new Event('p1-io'));     // the page's other consoles follow
      endSession();
      out.textContent = ''; status.textContent = '';
      paintMode();
    }
    bBatch.addEventListener('click', function () { setMode('batch'); });
    bInter.addEventListener('click', function () { setMode('interactive'); });
    window.addEventListener('p1-io', function () {
      if (storedMode() === mode || session) return;
      mode = storedMode();
      paintMode();
    });

    // program output with each typed line echoed at the point it was asked for
    function transcript(text) {
      var frag = document.createDocumentFragment(), prev = 0, mark = 0;
      session.inputs.forEach(function (line, i) {
        if (typeof session.marks[i] === 'number') mark = Math.max(mark, Math.min(session.marks[i], text.length));
        if (mark > prev) frag.appendChild(document.createTextNode(text.slice(prev, mark)));
        frag.appendChild(el('span', 't-in', line));
        prev = mark;
      });
      if (text.length > prev) frag.appendChild(document.createTextNode(text.slice(prev)));
      return frag;
    }
    function showPrompt(text, prefill) {
      out.textContent = '';
      out.appendChild(transcript(text));
      var field = el('span', 't-field');
      field.setAttribute('contenteditable', 'plaintext-only');
      if (field.contentEditable !== 'plaintext-only') field.setAttribute('contenteditable', 'true');
      field.setAttribute('role', 'textbox');
      field.setAttribute('aria-label', 'Program input — type a value and press Enter');
      field.spellcheck = false;
      if (prefill) field.textContent = prefill;
      out.appendChild(field);
      status.textContent = 'Waiting for input…';
      hint.hidden = false;
      hint.textContent = '';
      var msg = el('span');
      msg.innerHTML = 'The program is waiting — type and press <kbd>Enter</kbd>.';
      hint.appendChild(msg);
      var eofBtn = el('button', null, 'End of input (Ctrl+D)'), stopBtn = el('button', null, 'Stop (Ctrl+C)');
      eofBtn.type = stopBtn.type = 'button';
      hint.appendChild(eofBtn); hint.appendChild(stopBtn);
      // Freeze the terminal the moment a line is sent: the re-run is asynchronous, and
      // keystrokes must not land in a field that is about to be replaced.
      function freeze() {
        hint.hidden = true; hint.textContent = '';
        out.onclick = null;
        out.textContent = '';
        out.appendChild(transcript(text));
        status.textContent = 'Running…';
      }
      function feed(lines, rest) {
        if (!session) return;
        lines.forEach(function (l) { session.pending.push(l + '\n'); });
        session.inputs.push(session.pending.shift());
        freeze();
        step(rest);
      }
      function endInput() { if (!session) return; session.eof = true; freeze(); step(); }
      function stop() {
        if (!session) return;
        var body = transcript(text);
        endSession();
        out.textContent = '';
        out.appendChild(body);
        out.appendChild(el('span', 'muted', '\n^C  ── stopped ──'));
        status.textContent = 'Stopped';
      }
      eofBtn.addEventListener('click', endInput);
      stopBtn.addEventListener('click', stop);
      field.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); feed(field.textContent.replace(/\r/g, '').split('\n')); }
        else if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'd') { ev.preventDefault(); endInput(); }
        else if (ev.ctrlKey && ev.key.toLowerCase() === 'c' && String(window.getSelection()) === '') { ev.preventDefault(); stop(); }
      });
      field.addEventListener('paste', function (ev) {          // multi-line paste = several Enter presses
        var pasted = (ev.clipboardData || window.clipboardData).getData('text');
        if (pasted.indexOf('\n') < 0) return;
        ev.preventDefault();
        var lines = (field.textContent + pasted).replace(/\r/g, '').split('\n');
        var rest = lines.pop();
        feed(lines, rest);
      });
      out.onclick = function () { if (String(window.getSelection()) === '') field.focus(); };
      out.scrollTop = out.scrollHeight;
      field.focus({ preventScroll: true });
    }
    function step(prefill) {
      var mine = ++runToken, sess = session;
      var text = '', errs = '';
      P1Runtime.run(current, sess.src, sess.inputs.join(''), {
        onBoot: hooks.onBoot,
        onOut: function (s) { text += s; },
        onErr: function (s) { errs += s; }
      }, { interactive: true, eof: sess.eof }).then(function (res) {
        if (mine !== runToken || sess !== session) return;      // superseded by Stop / Reset / a mode switch
        if (res.needInput) {
          if (typeof sess.marks[sess.inputs.length] !== 'number') sess.marks[sess.inputs.length] = text.length;
          if (sess.pending.length) {                // lines pasted together are fed one request at a time,
            sess.inputs.push(sess.pending.shift());   // so each is echoed where the program asked for it
            step(prefill);
            return;
          }
          showPrompt(text, prefill);
          return;
        }
        var body = transcript(text);
        var started = sess.started;
        endSession();
        out.textContent = '';
        out.appendChild(body);
        if (errs) write(errs, true);
        if (!out.textContent) write('(no output)', false);
        report(res, started);
      });
    }

    runBtn.addEventListener('click', function () {
      runBtn.disabled = true;
      resetBtn.disabled = true;
      out.textContent = '';
      status.textContent = 'Running…';
      var started = Date.now();

      if (mode === 'interactive') {
        resetBtn.disabled = false;               // Reset doubles as a way out of a waiting program
        session = { src: editor.value, inputs: [], pending: [], marks: [], eof: false, started: started };
        step();
        return;
      }
      P1Runtime.run(current, editor.value, stdin.value, {
        onBoot: hooks.onBoot,
        onOut: function (t) { write(t, false); },
        onErr: function (t) { write(t, true); }
      }).then(function (res) {
        report(res, started);
        if (!out.textContent) write('(no output)', false);
        runBtn.disabled = false;
        resetBtn.disabled = false;
      });
    });

    resetBtn.addEventListener('click', function () {
      endSession();
      editor.value = initial[current] || '';
      stdin.value = opts.stdin || '';
      out.textContent = '';
      status.textContent = '';
      repaint();
    });
    paintMode();

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
