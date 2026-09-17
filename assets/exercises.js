/* 41039 Programming 1 — auto-graded coding exercises.
 *
 * Reads window.WEEK_EXERCISES and renders into #exercises-root. Each exercise runs
 * the student's code once per test case through P1Runtime and compares stdout with
 * the expected output, the same way the Ed labs do.
 *
 * Comparison rule: trailing whitespace on each line and the final newline are
 * ignored; everything else must match exactly. That mirrors Ed closely enough to
 * teach the habit without failing people over an invisible last newline.
 */
window.P1Exercises = (function () {
  'use strict';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function normalise(s) {
    return String(s == null ? '' : s)
      .replace(/\r\n/g, '\n')
      .split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n')
      .replace(/\n+$/, '');
  }

  function showStdin(s) {
    if (!s) return '(none)';
    return s.replace(/\n/g, ' ⏎ ').trim();
  }

  function build(ex, host) {
    var card = el('article', 'ex');

    var head = el('div', 'ex-head');
    var titleRow = el('div', 'ex-title-row');
    titleRow.appendChild(el('h4', null, ex.title));
    titleRow.appendChild(el('span', 'lang ' + ex.lang, ex.lang === 'java' ? 'Java' : 'Python'));
    head.appendChild(titleRow);
    var brief = el('p', 'ex-brief');
    brief.innerHTML = ex.brief;
    head.appendChild(brief);
    card.appendChild(head);

    var ed = P1Editor.create({
      lang: ex.lang, value: ex.starter, label: ex.title + ' \u2014 code editor',
      fullscreen: function () { return card; }
    });
    var editor = ed.textarea;
    card.appendChild(ed.root);
    function repaint() { ed.repaint(); }

    var bar = el('div', 'console-bar');
    var runBtn = el('button', 'btn primary', 'Run tests');
    runBtn.type = 'button';
    var resetBtn = el('button', 'btn ghost small', 'Reset');
    resetBtn.type = 'button';
    var status = el('span', 'console-status', String(ex.tests.length) + ' test' +
      (ex.tests.length === 1 ? '' : 's'));
    bar.appendChild(runBtn);
    bar.appendChild(resetBtn);
    bar.appendChild(status);
    card.appendChild(bar);

    var results = el('div', 'ex-tests');
    card.appendChild(results);

    var sol = el('details', 'ex-solution');
    var sum = el('summary', null, 'Show a worked solution');
    sol.appendChild(sum);
    var solPre = el('pre', 'qcode');
    if (window.P1Highlight) P1Highlight.apply(solPre, ex.solution, ex.lang);
    else solPre.textContent = ex.solution;
    var solNote = el('p', 'ex-solnote',
      'One way to do it — not the only way. If yours passes the tests, yours is right.');
    sol.appendChild(solNote);
    sol.appendChild(solPre);
    card.appendChild(sol);

    resetBtn.addEventListener('click', function () {
      ed.setValue(ex.starter);
      results.textContent = '';
      status.textContent = ex.tests.length + ' test' + (ex.tests.length === 1 ? '' : 's');
      status.className = 'console-status';
      repaint();
    });

    runBtn.addEventListener('click', async function () {
      runBtn.disabled = true;
      resetBtn.disabled = true;
      results.textContent = '';
      status.textContent = 'Running…';

      var passed = 0;
      for (var i = 0; i < ex.tests.length; i++) {
        var t = ex.tests[i];
        var out = '', err = '';
        status.textContent = 'Running test ' + (i + 1) + ' of ' + ex.tests.length + '…';
        /* eslint-disable no-await-in-loop */
        var res = await P1Runtime.run(ex.lang, editor.value, t.stdin, {
          onBoot: function () {},
          onOut: function (s) { out += s; },
          onErr: function (s) { err += s; }
        });
        var ok = res.ok && normalise(out) === normalise(t.expect);
        if (ok) passed++;

        var row = el('div', 'ex-test ' + (ok ? 'pass' : 'fail'));
        var rhead = el('div', 'ex-test-head');
        rhead.appendChild(el('span', 'badge-res', ok ? 'PASS' : 'FAIL'));
        rhead.appendChild(el('span', 'ex-test-name', 'Test ' + (i + 1)));
        rhead.appendChild(el('span', 'ex-stdin', 'input: ' + showStdin(t.stdin)));
        row.appendChild(rhead);

        if (!ok) {
          var diff = el('div', 'ex-diff');
          if (!res.ok && err) {
            diff.appendChild(el('div', 'ex-diff-label', res.phase === 'compile'
              ? 'It did not compile:' : 'It ended with an error:'));
            diff.appendChild(el('pre', 'ex-pre err', err.trim()));
          } else {
            var g = el('div');
            g.appendChild(el('div', 'ex-diff-label', 'Expected:'));
            g.appendChild(el('pre', 'ex-pre', normalise(t.expect) || '(no output)'));
            g.appendChild(el('div', 'ex-diff-label', 'Your output:'));
            g.appendChild(el('pre', 'ex-pre', normalise(out) || '(no output)'));
            diff.appendChild(g);
          }
          row.appendChild(diff);
        }
        results.appendChild(row);
      }

      var all = passed === ex.tests.length;
      status.innerHTML = '<span class="' + (all ? 'ok' : 'bad') + '">' +
        passed + ' / ' + ex.tests.length + ' tests passed' +
        (all ? ' — nice.' : '') + '</span>';
      runBtn.disabled = false;
      resetBtn.disabled = false;
    });

    host.appendChild(card);
  }

  function init() {
    var host = document.getElementById('exercises-root');
    var data = window.WEEK_EXERCISES;
    if (!host || !data || !data.length) return;
    data.forEach(function (ex) { build(ex, host); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  return { init: init };
})();
