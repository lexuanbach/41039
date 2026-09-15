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
│   └── week-1.html         # Week 1: concepts, runnable examples, 20-question quiz
├── slides/
│   └── week-1-slides.pdf   # Compiled lecture deck (built from ../UTS-Programming I/w1.tex)
├── vendor/
│   └── ecj.jar             # Eclipse batch compiler 3.26.0 — compiles Java in the browser
├── assets/
│   ├── style.css           # The single stylesheet for every page
│   ├── course.js           # Shared engine: theme toggle, code-theme toggle, MCQ quiz
│   ├── runtime.js          # Java + Python execution (CheerpJ / Pyodide)
│   ├── highlight.js        # Java/Python syntax highlighter (no dependency)
│   ├── console-ui.js       # The console widget rendered on pages
│   └── w1-data.js          # Week 1 quiz data (window.WEEK_DATA)
├── serve.py                # Dev server WITH Range support — required, see §5
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
node -e "global.window={};require('./assets/w1-data.js');
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
await P1Runtime.run('java'|'python', source, stdinText, {onBoot, onOut, onErr})
   -> { ok: boolean, phase: 'compile' | 'run' | 'boot' }
```

**Python — Pyodide** (`v314.0.6`, MPL-2.0). `setStdout`/`setStderr` with batched handlers
feed the output pane. `input()` is served by assigning `sys.stdin = io.StringIO(...)`,
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

Worth re-running after layout changes:

- **Link check** — every relative `href`/`src` resolves.
- **All three theme states** — light, dark, and system default.
- **Quiz grading** — answer one question right and one wrong, then grade: green outline on
  the correct option, red on the wrong pick, explanations shown, score correct.
- **The console**, both languages, four cases each: hello, reading stdin, a compile error,
  and a crash. The first run of each language downloads a runtime, so allow time.

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

1. **Weeks 2–12.** Copy `weeks/week-1.html`, write `assets/wN-data.js`, add a `.mat-card`
   on the homepage. Once there are more than two or three week pages, add CO1005's left
   sidebar (`aside.side` + `.layout`) so navigation does not depend on the topbar — its CSS
   is in `../CO1005-Website/assets/style.css` under "Left sidebar".
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
