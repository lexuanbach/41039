# Architecture — 41039 Programming 1 Website

Structure of the subject website for **41039 · Programming 1** (UTS course format, run at
HCMUT). Read with [design.md](design.md) before changing or extending anything.

Modelled on the sibling [CO1005 site](../CO1005-Website/architecture.md), with the same
conventions where they earned their keep and two deliberate departures (noted below).

## 1. Overview

- **Form**: static multi-page site. No build framework, no dependency beyond Google Fonts.
  Everything interactive (currently the quiz) is plain client-side JavaScript.
- **Language**: English throughout. No EN/VI toggle — see design.md §1.
- **Deployment**: **GitHub Pages at <https://lexuanbach.github.io/41039/>** — repo
  `lexuanbach/41039`, serving branch `main` from the root. Deploy = `git push`; Pages
  rebuilds in about 30 seconds. `.nojekyll` makes it serve files as-is.

> **Base path matters for Java.** CheerpJ resolves its `/app/` prefix against the **web
> server root**, not the page's directory. On Pages the site lives under `/41039/`, so a
> hard-coded `/app/vendor/ecj.jar` resolves to `lexuanbach.github.io/vendor/ecj.jar` and
> 404s with *"Could not find or load main class"*. `runtime.js` therefore derives the site
> root from **its own script URL** (`SITE_ROOT`), which is correct at any base path and any
> page depth. If the site ever moves to a different path, this keeps working — but if
> `assets/runtime.js` is ever renamed or inlined, the fallback regex must be updated too.

### Departures from CO1005

1. **One stylesheet.** CO1005's `index.html` carries a private copy of the design tokens,
   so every token change has to be made twice. Here the homepage links `assets/style.css`
   like every other page.
2. **No `build.py` / `dist/` yet.** CO1005 builds self-contained pages for publishing as
   Claude Artifacts. Add that only when there is a reason to publish that way; until then
   the source files *are* the site.

## 2. Directory structure

```
UTS-Programming-I-Website/
├── index.html              # Homepage: outline, outcomes, assessment, schedule, materials
├── playground.html         # Java + Python console with worked example programs
├── selftest.html           # Unlisted: verifies both runtimes on a live deployment
├── weeks/
│   ├── week-1.html         # Week 1: concepts, runnable examples, 20-question quiz
│   └── week-2-3.html       # Weeks 2+3: conditionals, loops, arrays/lists/dicts, 26-question quiz
├── slides/
│   ├── week-1-slides.pdf   # Compiled lecture deck (built from ../UTS-Programming I/w1.tex)
│   └── week-2-3-slides.pdf # Weeks 2+3 deck  (built from ../UTS-Programming I/w23.tex)
├── vendor/
│   └── ecj.jar             # Eclipse batch compiler 3.26.0 — compiles Java in the browser
├── assets/
│   ├── style.css           # The single stylesheet for every page
│   ├── course.js           # Shared engine: theme toggle, code-theme toggle, MCQ quiz
│   ├── runtime.js          # Java + Python execution (CheerpJ / Pyodide)
│   ├── highlight.js        # Java/Python syntax highlighter (no dependency)
│   ├── editor.js           # Shared code editor: overlay + line-number gutter
│   ├── exercises.js        # Auto-graded exercise runner
│   ├── w1-exercises.js     # Week 1 exercise data (window.WEEK_EXERCISES)
│   ├── w23-exercises.js    # Weeks 2+3 exercise data (same global)
│   ├── console-ui.js       # The console widget rendered on pages
│   ├── w1-data.js          # Week 1 quiz data (window.WEEK_DATA)
│   └── w23-data.js         # Weeks 2+3 quiz data (same global)
├── serve.py                # Dev server WITH Range support — required, see §5
├── bump.py                 # Stamps ?v=<hash> on asset links — run before committing
├── .nojekyll               # GitHub Pages: serve files as-is
├── architecture.md         # This file
└── design.md               # The design system
```

## 3. Subsystems

### Page engine (`assets/course.js`)

One IIFE, loaded by every page, that wires three things:

- **`initTheme()`** — light/dark toggle. Storage key **`p1-theme`**. Each page also has a
  tiny inline `<script>` in its `<head>` that applies the stored theme *before* first
  paint, so there is no flash of the wrong theme. That inline script must stay in sync with
  the storage key.
- **`initCodeTheme()`** — cycles Midnight → Paper → Contrast. Storage key
  **`p1-code-theme`**, applied as `data-code-theme` on `<html>`.
- **`initQuiz(window.WEEK_DATA)`** — renders into `#quiz-root` if that element and the data
  both exist. Pages without a quiz simply load the same file and skip it.

Both toggle buttons use the markup `<button class="control-btn"><span class="icon">…</span>
<span id="…-label">…</span></button>`. `course.js` writes into those spans, so keep the ids.

### Week data (`assets/wN-data.js`)

Each file assigns:

```js
window.WEEK_DATA = {
  id: 'week-1',
  quiz: [ { q, code?, lang?, opts: [...], a, why } ]
};
```

- `q` and each option may contain inline HTML (`<code>`, `<strong>`, `<em>`).
- `code` is rendered as a plain `<pre>` (set with `textContent`, so it is not parsed as
  HTML). `lang` is `'java'` or `'python'` and renders a language badge above the snippet —
  **always set it when `code` is present**, because this subject shows both languages and
  "which language am I reading?" must never be a guess.
- `a` is the **zero-based index** of the correct option.
- `why` is shown after grading, for right and wrong answers alike. Write it so it explains
  why the *distractors* are wrong, not just why the answer is right.

**Quiz quality rule** (inherited from CO1005): every distractor must be **at least as long
as** the correct answer, so answer length is never a tell. Audit with:

```bash
node -e "global.window={};require('./assets/w1-data.js');   # and again for w23-data.js
const q=window.WEEK_DATA.quiz;let bad=0;
q.forEach((x,i)=>{const s=t=>String(t).replace(/<[^>]+>/g,'');
 const c=s(x.opts[x.a]).length;
 if(!x.opts.some((o,j)=>j!==x.a&&s(o).length>c)){console.log('FLAG Q'+(i+1));bad++;}});
console.log(bad+' flagged');"
```

Require **0 flagged** after every edit to quiz data.

### The interactive console (`assets/runtime.js` + `assets/console-ui.js`)

Runs **real** Java and **real** Python in the browser. Both runtimes are fetched from a
CDN on first use only, so a page that never runs code costs nothing.

```
await P1Runtime.run('java'|'python', source, stdinText, {onBoot, onOut, onErr}, {interactive?, eof?})
   -> { ok: boolean, phase: 'compile' | 'run' | 'boot', needInput?: true }
```

**Interactive terminal = re-execution.** Neither runtime can block on a prompt in the page's
thread, so the console's *⌨ Interactive terminal* mode (key `p1-io-mode`, synced between the
consoles of a page by the `p1-io` event) runs the program with the lines typed so far. With
`interactive: true`, a program that reads past the end of `stdinText` stops right there and the
promise resolves `{needInput: true}`; `console-ui.js` shows the output so far with each typed
line echoed where it was asked for (`marks[]` = output length at each request), plus a live
prompt, and on Enter runs again with one more line. Programs in this subject are deterministic,
so the student simply sees a terminal. A multi-line paste is queued in `pending[]` and fed one
request at a time. `eof: true` (Ctrl+D) disables the stop so the program sees a real end of
input; Ctrl+C / *Stop* / Reset abandon the session (a `runToken` makes late results harmless).
- *Java*: the generated `P1Launcher` wraps `System.in`; at end of input it prints a marker
  (`\u0001P1-NEED-INPUT\u0001`) and throws a private `Error` (Scanner and BufferedReader only
  catch `IOException`), which the launcher swallows. The mode is read from `/str/p1mode.txt`, so
  the launcher never needs recompiling. **Compiled classes are cached per source**
  (`javaCache`), so a re-run skips ecj: ≈ 0.25 s instead of ≈ 1.3 s. Statics start fresh each run.
- *Python*: `sys.stdin` is a `StringIO` subclass that raises `_P1NeedInput` (a `BaseException`,
  so `except Exception:` cannot swallow it) from `readline` / `read` / `__next__`. Every run
  gets a **fresh globals dict**, so a re-run never sees the previous run's variables.
The auto-graded exercises always use the plain batch path.

**Python — Pyodide** (`v314.0.6`, MPL-2.0). `setStdout`/`setStderr` with raw `write` handlers
feed the output pane (not `batched`: a prompt without a newline must reach the page before the
program stops to wait). `input()` is served by assigning `sys.stdin = io.StringIO(...)`,
which is more predictable than the stdin-callback API. Uncaught exceptions surface the
**real CPython traceback**; `cleanTraceback()` strips Pyodide's own frames
(`/lib/python*.zip`, `_pyodide/_base.py`) and renames `<exec>` to `main.py`, so a student
sees only their own frames — which is what Week 1 teaches them to read.

**Java — CheerpJ 4.3** (a JVM in WebAssembly) plus `vendor/ecj.jar` (the Eclipse batch
compiler) to turn source into bytecode. Per run:

1. The public class name is parsed out of the source (comments and string literals are
   blanked first), because the file name must match it — the Week 1 rule.
2. Source is written to `/str/<Class>.java` with `cheerpOSAddStringFile`.
   **`/str/` is flat** — that call cannot create directories, so do not try to namespace
   runs with a subfolder. Only the `-d /files/outN` output directory is made unique.
3. A generated `P1Launcher` class does `System.setIn(new FileInputStream("/str/stdin.txt"))`
   and then calls the student's `main`. CheerpJ has **no stdin option**, and this needs no
   change to the student's own code.
4. ECJ runs via `cheerpjRunMain`, with `-1.8 -g -nowarn`. A non-zero exit means compile
   errors, which ECJ has already formatted with a caret and line number.
5. On success, `P1Launcher` runs.

Three sharp edges, all handled in `runtime.js` — do not remove these without checking:

- **CheerpJ writes `System.out` to `console.log`.** `runtime.js` patches the console
  globally and routes it to the active sink. Because that patch is global, runs are
  serialised through a promise queue. CheerpJ's own banner lines (`CheerpJ runtime ready`,
  `Class is loaded, main is starting`) are filtered out by exact match.
- **Runtime exceptions still exit 0**, so a crash is detected by scanning output for
  `Exception in thread`, not by the exit code.
- **The trace is cleaned**: the `P1Launcher` frame is removed, and
  `Exception in thread "Thread-0"` is rewritten to `"main"`. Thread-0 is an artefact of how
  CheerpJ starts the program; every real JVM would say `main` here.

**Known fidelity gaps** — stated plainly on `playground.html` rather than hidden:

| | Here | Ed (what counts) |
|---|---|---|
| Java compiler | Eclipse batch compiler | `javac` |
| Java version | 8 (CheerpJ 4.3 supports 8 and 11) | 23 |
| Error wording | `userName cannot be resolved to a variable` | `cannot find symbol` |
| Stack trace lines | `Boom.main(Unknown Source)` | `Boom.main(Boom.java:4)` |

The stack-trace gap is CheerpJ's, not ECJ's: source is already compiled with `-g`, and
`cheerpjInit({ enableDebug: true })` does **not** fix it — it only floods stdout with VM
internals. Tested and rejected; see the comment in `runtime.js`. Everything else about a
trace is faithful, including the frame order that Week 1 teaches students to read:

```
Exception in thread "main" java.util.InputMismatchException
	at java.util.Scanner.throwFor(Unknown Source)
	at java.util.Scanner.next(Unknown Source)
	at java.util.Scanner.nextInt(Unknown Source)
	at HelloAgain.main(Unknown Source)      <- the student's own frame
```

There is also **no way to stop an infinite loop** — neither runtime is on a worker with an
interrupt channel — so the page has to be reloaded. Both limits are called out in notes on
the playground page.

> **Licensing — resolve before publishing.** CheerpJ is commercial software. Its free
> Community Licence covers individuals, one-person companies and FOSS projects, and allows
> unlimited use **from the `cjrtnc.leaningtech.com` CDN** (which is what `runtime.js` uses)
> with attribution. Universities and academic institutions are directed to contact Leaning
> Technologies for an academic quote. A university subject website is **not clearly covered
> by the free tier** — confirm with them before this goes public. Pyodide (MPL-2.0) has no
> such constraint. If CheerpJ turns out not to be viable, the fallback is a hand-written
> Java interpreter in the style of CO1005's `minicpp.js`.

### Syntax highlighting (`assets/highlight.js`)

`P1Highlight.toHtml(src, 'java'|'python')` — a single left-to-right scan emitting
`<span class="hl-*">`, not a parser. **Comments and strings are matched before everything
else**, so a keyword inside a string, or a `#` inside quotes, is never mis-coloured. Each
rule is anchored with `^` against the remaining input and the loop has a guard, so it cannot
stall or go backwards. Used in two places: the console editor overlay, and quiz snippets that
declare a `lang`.

To add a language: add a rule table and a `classify()` branch. Keep the
comments-and-strings-first ordering.

### The code editor (`assets/editor.js`)

`P1Editor.create({lang, value, label, fileName?, fullscreen?})` returns
`{root, shell, textarea, repaint, setLang, setValue, load}`. Both the console and the exercise
runner use it, so the alignment is solved once. Callers append **`root`** (toolbar + shell).

**The code window (same design as the sibling CO1005 site).** `root` is a `.editor-wrap`
holding a `.editor-bar` toolbar above the `.editor-shell`:
- left — *view*: `A− / A+` (program font size, `--code-scale` 0.85–2, key `p1-code-scale`; the
  editor layers, gutter, stdin and output all multiply their font-size by it), `↩ Wrap`
  (soft wrap, default on; `data-code-wrap="off"` on `<html>`, key `p1-wrap`) and the code colour
  theme (same `p1-code-theme` key as the top-bar button, which `editor.js` hides on pages that
  have a code window). They are site-wide preferences: every toolbar repaints, and every editor
  re-measures, on the `p1-view` window event.
- right — *edit/file*: Undo / Redo (own history: the page writes `textarea.value` itself for
  Tab, Reset, presets and Open…, which wipes the browser's undo stack; typing bursts < 0.7 s
  collapse into one step; `setValue()` and the returned `repaint()` record a step, `load()`
  starts a fresh history — used when the language tab changes), `Save…`
  (`showSaveFilePicker` where available — the reader picks folder and name — else a download;
  Java files are named after the public class, Python `program.py`; Ctrl/Cmd+S) and `Open…`.
  Last comes `⛶ Full screen` when the caller passes `fullscreen: () => element` — the element
  (the whole console / exercise card) gets `.code-fullscreen` and `<body>` gets
  `.code-fullscreen-open`; Esc leaves.

**Automatic indentation.** Enter carries the current line's leading whitespace forward. It adds
four spaces after a Java opening brace or a Python suite colon; comments and strings are ignored,
and a Python colon inside unmatched brackets (for example, a dictionary entry) does not open a
suite. Pressing Enter between Java `{}` expands the pair to three lines and aligns the closing
brace. Each automatic edit is one undo step.

**Soft wrap.** The highlight layer renders **one `<div class="cl">` per logical line**
(`splitLines()` closes and reopens a highlight `<span>` that runs across a line break — block
comments, triple-quoted strings), and the gutter holds one `<div>` per line whose height is
measured from that block, so a line wrapped over several rows keeps a single number. Both
layers must wrap at the same column: `layout()` adds the textarea's scrollbar width to the
highlight layer's right padding, and re-runs on resize, font change and wrap toggle
(ResizeObserver + `p1-view`).

Three absolutely-positioned layers inside `.editor-shell`: a `.hl-gutter` of line numbers, a
highlighted `.hl-layer`, and a transparent `textarea.code-edit` on top. **All three must share
font, size, line-height, letter-spacing and vertical padding**, or the caret drifts from the
text and the numbers stop matching their lines. Only horizontal padding differs: the gutter
owns the left strip (`--gutter-w`) and the other two are inset past it with
`padding-left: calc(var(--gutter-w) + 0.75rem)`.

Verified pixel-exact — textarea vs layer `scrollWidth`/`scrollHeight` delta 0, and gutter
line *n* sits at the same y as code line *n* (delta 0.00). **No letter-spacing fudge is
needed; do not add one.** The gutter widens itself past 99 and 999 lines.

Line numbers matter here beyond polish: Week 1 teaches students to read
`WontCompile.java:3`, and Ed's own editor has line numbers switched on in lesson 1.

### Auto-graded exercises (`assets/exercises.js` + `assets/wN-exercises.js`)

Renders into `#exercises-root`. Each exercise runs the student's code **once per test case**
through `P1Runtime` with that case's stdin, and compares stdout with the expected output.

```js
window.WEEK_EXERCISES = [
  { id, lang, title, brief, starter, solution, tests: [{ stdin, expect }] }
];
```

**Comparison rule:** trailing whitespace on each line and the final newline are ignored;
everything else must match exactly. That teaches the Ed habit without failing anyone over an
invisible last newline. A compile error or crash fails the test and shows the real compiler
output instead of a diff.

> **Never write an `expect` by hand.** Generate every one by running the solution through
> `P1Runtime` and pasting what comes back. Java and Python disagree about float formatting in
> ways that are easy to guess wrong — `9 / 3` as a Java `double` prints `Real: 3.0`, not
> `Real: 3`. All 14 Week 1 expectations were generated this way.
>
> To regenerate: make a temporary page that loads `runtime.js` and `wN-exercises.js`, runs
> every `solution` against every `stdin`, and reports the output; then paste those in. The
> generator is deliberately not shipped — it is a few lines, and a stale one is worse than
> none.
>
> **A second, faster oracle.** Weeks 2+3's 36 expectations were generated headlessly instead:
> compile each Java solution with **this repo's own `vendor/ecj.jar`** (`java -jar vendor/ecj.jar
> -1.8 -g -nowarn -d out X.java`) and run it on any JVM, and run each Python solution on CPython
> 3.14 — the same compiler the site uses and the same Python line Pyodide ships. That is faithful
> for stdout, which is all `expect` compares. It cannot exercise CheerpJ's own quirks (stack-trace
> lines, the console patch), so a **browser pass on the page is still the acceptance test**.

### Week pages (`weeks/week-N.html`)

Each follows the same spine:

1. `<head>` — title, the inline theme bootstrap script, fonts, `../assets/style.css`.
2. Topbar with `.display-controls`.
3. `.hero` — week number eyebrow, title, lede, meta chips (including the slides link).
4. `#concepts` — **one `.lesson-tab` + `.lesson-panel` pair per section of that week's slide
   deck**, so the page and the lecture have the same shape and the same section numbers. Inside
   each panel, numbered `.concept` blocks (`<span class="idx">5.3</span>`), figures, notes and
   consoles. `course.js#initLesson()` wires selection, roving-tabindex keyboard support,
   previous/next buttons, and deep links: `week-1.html#s05` opens section 5, and a link to
   anything *inside* a panel opens that panel first. Selecting a section rewrites the hash with
   `history.replaceState`, so a section can be linked to and survives a reload.

   The rail holds more than the lecture: after the deck's sections come **Coding exercises**
   (`#s07`), **Team activity** (`#s08`), the **Quiz** (`#s09`) and **Further reading** (`#s10`).
   Keeping them as tabs rather than separate page sections means one consistent place to
   navigate, and the quiz no longer sits kilometres below the content it tests.

   Below that rail sits a **second `.lesson-nav.misc`** for off-syllabus material — Week 1's is
   *History of computing* (`#m01`), with `m` ids to keep it distinct from the numbered sections
   and teal accents so it reads as a different kind of thing. **`initLesson()` collects tabs
   across every `.lesson-nav` inside `.lesson`**, not just the first, so both rails drive the
   one content pane and arrow keys cross the boundary. Adding a third rail needs no JS change.

   Panels are hidden with the `hidden` attribute, not `display:none` on a parent, and consoles
   mount at load regardless of visibility — the editor shell has an explicit height, so a
   console inside a hidden panel is correctly sized the moment it is shown.
5. `#quiz` — a `.sec-head` then an empty `<div id="quiz-root">`.
6. `#thisweek` — what to actually do, tied to the Ed lessons.
7. `.pagenav`, footer, then `../assets/runtime.js`, `../assets/console-ui.js`,
   `../assets/wN-data.js`, and `../assets/course.js` **last**.

The data file must load before `course.js`, which reads `window.WEEK_DATA` on
`DOMContentLoaded`.

To make a code example runnable, use the declarative form — `console-ui.js` finds and
mounts these automatically:

```html
<div class="p1-console" data-lang="java" data-title="Hello, Java" data-stdin="">
  <script type="text/plain" data-role="source">
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello 41039!");
    }
}
  </script>
</div>
```

`<script type="text/plain">` is used rather than `<pre>` so the code needs no HTML
escaping. Indentation is stripped with `dedent()`, so the block can sit at any depth.

## 3a. Quotations, photographs and comics

Both decks and both week pages carry pull-quotes (`.joke` / `\jokebox`), photographs
(`.photo`, `.note.with-media`, `.joke.with-photo`) and xkcd comics (`.fig` /
`\xkcdcredit`). Three rules, all learned the hard way:

**Never print a quotation you have not checked against a primary source.** Programming
quotations are among the most misattributed text on the internet, and a wrong one means a
lecturer states a falsehood to a room. A quote-aggregator site is *not* evidence. Every
quotation on the Weeks 2+3 material was verified against the original — the scanned book on
archive.org, the CACM PDF, the Wikisource transcription, the actual mailing-list message —
and the page's Sources section links that primary source for each one. Two candidates that
verified only through secondary sources (Brooks' *"show me your flowcharts"* and the EWD 831
wording) were **dropped rather than printed**, because their primary sources could not be
reached to confirm the exact wording. Dropping a quote costs nothing; there is always another.

**Never hand-write a comic's number, title or year.** xkcd numbers are very easy to
misremember, and a wrong credit is a licensing problem as well as an embarrassing one. Use:

```bash
python3 comics/fetch-comic.py 1652 3062 292      # in ../UTS-Programming I/
```

It fetches `https://xkcd.com/<num>/info.0.json` (authoritative), saves the image to both
`comics/` (for the decks) and `../UTS-Programming-I-Website/media/` (for the site), and
records the real title/year/alt text in `comics/meta.json`. Generate credit lines from that
file. To re-check that every credit still matches the API metadata, compare the `xkcdcredit`
/ `figcaption` numbers against `comics/meta.json` — all 23 currently match.

xkcd is **CC BY-NC 2.5** and requires attribution: every use carries a credit naming Randall
Munroe and linking both the comic and the licence. Non-commercial teaching use only.

**Never hand-write a photograph's author or licence either.** Every photograph on the site
comes from Wikimedia Commons through:

```bash
python3 media/fetch-photo.py --search "tally counter"          # find the file
python3 media/fetch-photo.py --width 1200 \
        photo-tally-counter "File:Hand tally and knitting row counter 007.jpg"
python3 media/fetch-photo.py --credit photo-tally-counter      # print the credit markup
```

It asks the Commons API for the real artist, date, licence and licence URL, saves the image
into `media/` and records the metadata in **`media/photo-credits.json`**. Every credit line
in the HTML — inline on the figure, and the Photographs table in a page's Sources section —
is generated from that file, so a licence can never drift from the image it belongs to. When
the image is a person, confirm it is actually them before using it: ask the Commons API which
Wikipedia articles use the file (`prop=globalusage`), or ask Wikipedia which file it uses for
that person (`prop=pageimages`). Two candidate portraits were rejected this way.

**A "Did you know?" note states a fact, so it carries the source it was checked against** —
a link in the note itself, and a row in the page's Sources table. The same rule as quotations:
if the claim cannot be checked against something authoritative, it does not go on the page.

> **Beamer gotcha.** `\keyline{}` begins with `\vfill` and must be the **last** thing in a
> frame. A `\jokebox` placed after it silently overflows the frame — eight did, on the first
> pass. Put quote boxes *above* the keyline, and size comics by their aspect ratio (wide
> strips by `width=`, tall ones by `height=`), then confirm with the overfull check below.

## 4. Content invariants

Check these against the subject outline before changing them — they appear in several
places and are the facts students rely on:

- **Subject code 41039**, September Session 2026, 6cp, 150 hours, 3 hours per week on
  campus, 12 weeks, pass mark 50% overall.
- **Assessment weights 30 / 25 / 25 / 20** — lab assessments, code comprehension, project,
  exam — plus an optional 0% extension track that can substitute for the lab assessments.
  These weights are encoded in the `.grade-bar` `flex` values; if a weight changes, the bar
  must change with it.
- **Code comprehension stages**: Week 4 (5%), Week 7 (5%), Week 11 (7%), Week 12 (8%),
  timetabling permitting.
- **No lab in Week 1**; labs start Week 2. Assessed exercises due **11:55pm the Monday of
  the following week**, unlimited attempts, and **all** test cases in an exercise must pass.
- **Canvas → Assignments is authoritative** for tasks and deadlines; where anything on this
  site differs, Canvas and the announcements win. Say so wherever deadlines appear.
- Week page content comes from the **Week 1 lessons on Ed** and the lecture deck. Do not
  invent concepts that are not in the source material.
- Cross-page links are **relative**, so the site works from the filesystem and from any
  static host.

## 5. Local check

```bash
python3 serve.py 8000                # from the repo root
open http://localhost:8000/index.html
```

**Use `serve.py`, not `python3 -m http.server`.** CheerpJ fetches its runtime and
`vendor/ecj.jar` with HTTP **Range** requests, which `SimpleHTTPRequestHandler` does not
implement; without them the console reports *"HTTP server does not support the 'Range'
header. CheerpJ cannot run."* `serve.py` is that handler plus Range support. Any real
static host (GitHub Pages, nginx, Netlify) already supports Range.

**Deck check** — after editing `../UTS-Programming I/w23.tex` (or `w1.tex`):

```bash
xelatex -interaction=nonstopmode w23.tex && xelatex -interaction=nonstopmode w23.tex
grep -c 'Overfull \\vbox' w23.log     # must be 0 — an overfull vbox is content off the slide
grep -c 'Overfull \\hbox' w23.log     # must be 0
```

Both decks currently report **0 errors and 0 overfull boxes**; keep it that way, because an
overfull vbox in beamer means text has silently run off the bottom of a slide.

Worth re-running after layout changes:

- **Link check** — every relative `href`/`src` resolves.
- **All three theme states** — light, dark, and system default.
- **Quiz grading** — answer one question right and one wrong, then grade: green outline on
  the correct option, red on the wrong pick, explanations shown, score correct.
- **The console**, both languages, four cases each: hello, reading stdin, a compile error,
  and a crash. The first run of each language downloads a runtime, so allow time.

### Cache busting — run `bump.py` before you commit

GitHub Pages serves assets with `cache-control: max-age=600` and no versioning. Ship new
markup together with a changed stylesheet and a returning visitor can get the **new HTML with
a ten-minute-stale CSS** — which renders the page unstyled, not merely slightly off. This has
already happened once, on the left-rail layout change.

```bash
python3 bump.py            # stamps href/src with ?v=<first 8 of the file's sha256>
python3 bump.py --check    # exits 1 if anything is stale, changes nothing
```

It is idempotent, so running it when nothing changed is a no-op. **`runtime.js` tolerates the
query string** when deriving `SITE_ROOT` from its own URL (see §1) — if that regex is ever
rewritten, keep it tolerant of `?v=`.

### Verifying a deployment

`selftest.html` (unlisted, `noindex`, not linked from any page) runs six checks against the
live runtimes and reports pass/fail, writing a summary into `document.title` so it can be
scraped headlessly:

```bash
open https://lexuanbach.github.io/41039/selftest.html
```

**Run it after any deploy that touches `runtime.js`, `vendor/`, or the site's base path.**
A local check cannot prove the Java console works, for the reason in §1: `/app/` is resolved
against the hosting origin, so the ECJ jar path is only exercised properly once deployed.
Python passing locally tells you nothing about whether Java will.

## 6. Extending

1. **Weeks 4–12.** Copy `weeks/week-2-3.html`, write `assets/wN-data.js` and
   `assets/wN-exercises.js`, add a `.mat-card` on the homepage, and link the topic title in that
   week's `.week` schedule row (the `.week .topic a` rule tints the underline with the row's part
   colour). **Two week pages exist now** — at the next one or two, add CO1005's left sidebar
   (`aside.side` + `.layout`) so navigation does not depend on the topbar, because the topnav is
   already carrying "Week 1" and "Weeks 2–3" and hides entirely below 640px. Its CSS is in
   `../CO1005-Website/assets/style.css` under "Left sidebar".
2. **Auto-graded exercises.** The console can already run code and take stdin, so the
   remaining work is a test harness: run the student's program once per test case and
   compare stdout to an expected string. Copy CO1005's `initExercises()` and its
   `{starter, solution, tests:[{stdin, expect}]}` data shape. Generate every `expect` by
   actually running the solution through `P1Runtime` — never by hand.
3. **Pin the runtimes.** `runtime.js` pins Pyodide to `v314.0.6` but CheerpJ to the `4.3`
   channel, which Leaning Technologies may move. If the console breaks unexpectedly, check
   whether that channel changed before looking anywhere else.
4. **Progress saving.** Quiz results are deliberately not stored. If that changes, say so
   clearly on the page — students are told "nothing here is recorded or submitted".
