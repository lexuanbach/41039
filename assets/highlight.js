/* 41039 Programming 1 — a small syntax highlighter for Java and Python.
 *
 * Deliberately not a parser. It is a single left-to-right scan that emits
 * <span class="hl-*"> tokens, which is plenty for the size of program this
 * subject deals with and costs nothing to load.
 *
 * P1Highlight.toHtml(source, 'java'|'python') -> HTML string
 * P1Highlight.apply(preElement, source, lang)
 *
 * Order matters: comments and strings are matched before anything else, so a
 * keyword inside a string or a "#" inside quotes is never mis-coloured — the
 * exact trap Week 1 warns students about.
 */
window.P1Highlight = (function () {
  'use strict';

  var JAVA_KEYWORDS = ('abstract assert break case catch class const continue default do else ' +
    'enum extends final finally for goto if implements import instanceof interface native new ' +
    'package private protected public return static strictfp super switch synchronized this ' +
    'throw throws transient try volatile while var record yield sealed permits').split(' ');

  var JAVA_TYPES = ('boolean byte char double float int long short void String Integer Double ' +
    'Boolean Character Long Float Short Byte Object Math System Scanner ArrayList List Map ' +
    'HashMap Arrays StringBuilder Exception').split(' ');

  var JAVA_LITERALS = ['true', 'false', 'null'];

  var PY_KEYWORDS = ('and as assert async await break class continue def del elif else except ' +
    'finally for from global if import in is lambda nonlocal not or pass raise return try ' +
    'while with yield match case').split(' ');

  var PY_BUILTINS = ('abs all any bool chr dict divmod enumerate filter float format frozenset ' +
    'getattr hasattr hash input int isinstance len list map max min next object open ord pow ' +
    'print range repr reversed round set setattr slice sorted str sum tuple type zip').split(' ');

  var PY_LITERALS = ['True', 'False', 'None', 'self'];

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function span(cls, text) {
    return '<span class="hl-' + cls + '">' + esc(text) + '</span>';
  }

  // One alternation per language. Every branch is anchored with ^ and applied to
  // the remaining input, so the scan cannot go backwards or loop.
  var JAVA_RULES = [
    ['cm',  /^\/\/[^\n]*/],
    ['cm',  /^\/\*[\s\S]*?(?:\*\/|$)/],
    ['str', /^"(?:\\.|[^"\\\n])*"?/],
    ['chr', /^'(?:\\.|[^'\\\n])*'?/],
    ['num', /^\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?[fFdDlL]?\b/],
    ['ann', /^@[A-Za-z_$][\w$]*/],
    ['word', /^[A-Za-z_$][\w$]*/],
    ['op',  /^[{}()[\];,.<>=+\-*/%!&|^~?:]+/],
    ['ws',  /^\s+/]
  ];

  var PY_RULES = [
    ['cm',  /^#[^\n]*/],
    ['str', /^[rbfuRBFU]{0,2}("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$))/],
    ['str', /^[rbfuRBFU]{0,2}"(?:\\.|[^"\\\n])*"?/],
    ['str', /^[rbfuRBFU]{0,2}'(?:\\.|[^'\\\n])*'?/],
    ['num', /^\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?j?\b/],
    ['ann', /^@[A-Za-z_][\w]*/],
    ['word', /^[A-Za-z_][\w]*/],
    ['op',  /^[{}()[\];,.<>=+\-*/%!&|^~:@]+/],
    ['ws',  /^\s+/]
  ];

  function classify(word, lang, nextChar) {
    if (lang === 'java') {
      if (JAVA_KEYWORDS.indexOf(word) !== -1) return 'kw';
      if (JAVA_LITERALS.indexOf(word) !== -1) return 'num';
      if (JAVA_TYPES.indexOf(word) !== -1) return 'type';
      if (nextChar === '(') return 'fn';
      if (/^[A-Z]/.test(word)) return 'type';   // conventionally a class name
      return null;
    }
    if (PY_KEYWORDS.indexOf(word) !== -1) return 'kw';
    if (PY_LITERALS.indexOf(word) !== -1) return 'num';
    if (PY_BUILTINS.indexOf(word) !== -1 && nextChar === '(') return 'fn';
    if (nextChar === '(') return 'fn';
    if (/^[A-Z]/.test(word)) return 'type';
    return null;
  }

  function toHtml(src, lang) {
    var rules = lang === 'python' ? PY_RULES : JAVA_RULES;
    var out = '';
    var rest = String(src == null ? '' : src);
    var guard = 0;

    while (rest.length && guard++ < 200000) {
      var matched = false;
      for (var i = 0; i < rules.length; i++) {
        var kind = rules[i][0];
        var m = rules[i][1].exec(rest);
        if (!m || !m[0].length) continue;
        var text = m[0];

        if (kind === 'ws') {
          out += esc(text);
        } else if (kind === 'word') {
          var after = rest.slice(text.length).match(/^\s*(.)/);
          var cls = classify(text, lang, after ? after[1] : '');
          out += cls ? span(cls, text) : esc(text);
        } else {
          out += span(kind, text);
        }
        rest = rest.slice(text.length);
        matched = true;
        break;
      }
      if (!matched) {            // never stall on an unexpected character
        out += esc(rest[0]);
        rest = rest.slice(1);
      }
    }
    return out;
  }

  // A trailing newline keeps the last line's height when the source ends with
  // one, so the overlay and the textarea stay the same height.
  function apply(pre, src, lang) {
    pre.innerHTML = toHtml(src, lang) + '\n';
  }

  return { toHtml: toHtml, apply: apply };
})();
