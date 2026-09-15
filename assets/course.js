/* 41039 Programming 1 — shared page engine.
   Theme toggle, code-colour toggle, and the MCQ quiz used on week pages.
   No dependencies. Every page loads this file. */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEYS = ['A', 'B', 'C', 'D', 'E'];

  // ───────────── site theme (light / dark) ─────────────
  // The inline <script> in each page's <head> has already applied the stored
  // theme, so there is no flash before this runs.
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var icon = document.getElementById('theme-icon');
    var label = document.getElementById('theme-label');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function active() { return root.dataset.theme || (systemDark.matches ? 'dark' : 'light'); }
    function paint() {
      var dark = active() === 'dark';
      if (icon) icon.textContent = dark ? '☀' : '☾';
      if (label) label.textContent = dark ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    btn.addEventListener('click', function () {
      var next = active() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('p1-theme', next); } catch (e) {}
      paint();
    });
    systemDark.addEventListener('change', function () { if (!root.dataset.theme) paint(); });
    paint();
  }

  // ───────────── code colours (independent of the site theme) ─────────────
  var CODE_THEMES = [
    { key: 'midnight', label: 'Midnight' },
    { key: 'paper', label: 'Paper' },
    { key: 'contrast', label: 'Contrast' }
  ];

  function initCodeTheme() {
    var btn = document.getElementById('code-theme-toggle');
    if (!btn) return;
    var label = document.getElementById('code-theme-label');

    function current() { return root.dataset.codeTheme || 'midnight'; }
    function paint() {
      var key = current();
      var t = CODE_THEMES.filter(function (x) { return x.key === key; })[0] || CODE_THEMES[0];
      if (label) label.textContent = t.label;
      btn.setAttribute('aria-label', 'Code colour theme: ' + t.label + ' — click to change');
      btn.title = 'Code colour theme: ' + t.label;
    }
    btn.addEventListener('click', function () {
      var keys = CODE_THEMES.map(function (t) { return t.key; });
      var next = CODE_THEMES[(keys.indexOf(current()) + 1) % CODE_THEMES.length].key;
      if (next === 'midnight') delete root.dataset.codeTheme;
      else root.dataset.codeTheme = next;
      try { localStorage.setItem('p1-code-theme', next); } catch (e) {}
      paint();
    });
    paint();
  }

  // ───────────── helpers ─────────────
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  // ───────────── MCQ quiz ─────────────
  // Reads window.WEEK_DATA = { id, quiz: [{ q, code?, lang?, opts, a, why }] }
  // and renders it into #quiz-root.
  function initQuiz(data) {
    var mount = document.getElementById('quiz-root');
    if (!mount || !data || !data.quiz || !data.quiz.length) return;
    var questions = data.quiz;
    var picks = new Array(questions.length).fill(null);
    var graded = false;

    var bar = el('div', 'quiz-bar');
    var gradeBtn = el('button', 'btn primary', 'Grade my answers');
    var resetBtn = el('button', 'btn ghost', 'Reset');
    var score = el('span', 'quiz-score', '0 / ' + questions.length + ' answered');
    bar.appendChild(gradeBtn);
    bar.appendChild(resetBtn);
    bar.appendChild(score);
    mount.appendChild(bar);

    var list = el('div');
    mount.appendChild(list);

    var cards = questions.map(function (q, qi) {
      var card = el('article', 'quiz-q');
      var head = el('div', 'qhead');
      head.appendChild(el('span', 'qnum', 'Q' + (qi + 1)));
      head.appendChild(el('span', 'qtext', q.q));
      card.appendChild(head);

      if (q.code) {
        // A language chip above the snippet — this subject shows both, so
        // "which language am I reading?" must never be a guess.
        if (q.lang) {
          var chip = el('span', 'lang ' + q.lang, q.lang === 'java' ? 'Java' : 'Python');
          chip.style.marginBottom = '0.4rem';
          chip.style.display = 'inline-block';
          card.appendChild(chip);
        }
        var pre = el('pre', 'qcode');
        if (q.lang && window.P1Highlight) P1Highlight.apply(pre, q.code, q.lang);
        else pre.textContent = q.code;
        card.appendChild(pre);
      }

      var opts = el('div', 'opts');
      var buttons = q.opts.map(function (opt, oi) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.setAttribute('aria-pressed', 'false');
        b.appendChild(el('span', 'key', KEYS[oi]));
        b.appendChild(el('span', '', opt));
        b.addEventListener('click', function () {
          if (graded) return;
          picks[qi] = oi;
          buttons.forEach(function (x, xi) {
            x.setAttribute('aria-pressed', xi === oi ? 'true' : 'false');
          });
          updateScore();
        });
        opts.appendChild(b);
        return b;
      });
      card.appendChild(opts);

      var why = el('div', 'why');
      card.appendChild(why);
      return { card: card, buttons: buttons, why: why };
    });
    cards.forEach(function (c) { list.appendChild(c.card); });

    function updateScore() {
      if (graded) return;
      var answered = picks.filter(function (p) { return p !== null; }).length;
      score.textContent = answered + ' / ' + questions.length + ' answered';
    }

    gradeBtn.addEventListener('click', function () {
      if (graded) return;
      var unanswered = picks.filter(function (p) { return p === null; }).length;
      if (unanswered > 0 && !window.confirm(
        unanswered + ' question' + (unanswered === 1 ? ' is' : 's are') +
        ' unanswered. Grade anyway?')) return;

      graded = true;
      var correct = 0;
      questions.forEach(function (q, qi) {
        var c = cards[qi];
        c.card.classList.add('graded');
        c.buttons.forEach(function (b, oi) {
          if (oi === q.a) b.classList.add('right');
          else if (picks[qi] === oi) b.classList.add('wrong-pick');
          b.disabled = true;
        });
        if (picks[qi] === q.a) correct++;
        c.why.innerHTML = '<strong>' +
          (picks[qi] === q.a ? 'Correct.' : 'Answer: ' + KEYS[q.a] + '.') +
          '</strong> ' + q.why;
      });
      var pct = Math.round(100 * correct / questions.length);
      score.innerHTML = 'Score: <span class="' + (pct >= 70 ? 'good' : '') + '">' +
        correct + ' / ' + questions.length + ' (' + pct + '%)</span>';
      gradeBtn.disabled = true;
    });

    resetBtn.addEventListener('click', function () {
      graded = false;
      picks = new Array(questions.length).fill(null);
      gradeBtn.disabled = false;
      cards.forEach(function (c) {
        c.card.classList.remove('graded');
        c.buttons.forEach(function (b) {
          b.disabled = false;
          b.classList.remove('right', 'wrong-pick');
          b.setAttribute('aria-pressed', 'false');
        });
        c.why.innerHTML = '';
      });
      updateScore();
    });
  }

  // ───────── collapsible lecture sections ─────────
  function initFolds() {
    var folds = Array.prototype.slice.call(document.querySelectorAll('details.fold'));
    if (!folds.length) return;

    var expandBtn = document.getElementById('expand-all');
    var collapseBtn = document.getElementById('collapse-all');
    var count = document.getElementById('fold-count');

    function paint() {
      var open = folds.filter(function (f) { return f.open; }).length;
      if (count) count.textContent = open + ' of ' + folds.length + ' open';
    }
    folds.forEach(function (f) { f.addEventListener('toggle', paint); });
    if (expandBtn) expandBtn.addEventListener('click', function () {
      folds.forEach(function (f) { f.open = true; });
      paint();
    });
    if (collapseBtn) collapseBtn.addEventListener('click', function () {
      folds.forEach(function (f) { f.open = false; });
      paint();
    });

    // Deep links: /week-1.html#s04 opens that section and scrolls to it. Also
    // handles a link to anything *inside* a closed section.
    function openFromHash() {
      var id = location.hash.slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      var fold = target.closest ? target.closest('details.fold') : null;
      if (fold) fold.open = true;
      else if (target.tagName === 'DETAILS') target.open = true;
      paint();
      target.scrollIntoView({ block: 'start' });
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
    paint();
  }

  function boot() {
    initTheme();
    initCodeTheme();
    initFolds();
    initQuiz(window.WEEK_DATA);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
