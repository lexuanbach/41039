# Revision of Week 4 — 41039 Programming 1

A 50-minute recap of Week 4, shown **at the start of the next lecture**, before any new
material. It uses the same shape as Week 3: six short **individual** questions, then **four
team rounds** for teams of 3–4: **draw the memory** (the stack and the heap), **spot the
errors** (Java, then Python), **predict the output** (Java, then Python), and **write the
code** (on paper, then at the keyboard). It is hard on purpose. Most questions turn on one
idea: what a call copies, and what it shares.

| File | What |
|---|---|
| `revision-week-4.tex` | The deck. Build: `xelatex revision-week-4.tex` (twice — the TOC needs a second pass) |
| `revision-week-4.pdf` | Built output, 37 pages (25 frames plus section outlines; individual answers are overlays, team answers are separate frames) |
| `bk-logo.png` | Required next to the `.tex`, same file as earlier weeks |
| `Marks.java` | *Spot the errors 1*, exactly as on the slide (same line numbers): five bugs, three reported by `javac` in two rounds |
| `marks.py` | *Spot the errors 2*, exactly as on the slide: five errors, which Python shows one at a time |
| `Stats.java`, `stats.py` | Skeletons for *Code it 2*, the keyboard challenge (one Java team, one Python team). They fail until the TODOs are written — `summarise` does not exist yet |
| `solutions/` | `Marks.java` and `marks.py` with every bug fixed and listed by slide line number, and completed `Stats.java` and `stats.py` |

Style and macros are the same as `../revision-week-3/revision-week-3.tex`. The flowchart
styles are replaced by stack-and-heap styles (`sframe`, `ftitle`, `cell`, `atitle`, `ref`,
`hd`), and TikZ loads `positioning`.

## Scope: the Week 4 page

There is **no Lecture 4 slide deck**, so every question comes from the Week 4 page
(`../../weeks/week-4.html`), sections 01–08. That page follows the three Ed lessons in
`../../ed-w4/` and adds sections 6 and 7 (the stack and the heap; by value or by
reference), which were added to Week 4 at your request.

| Revision frame | Week 4 page source |
|---|---|
| Which of these compile? | 2.2 *The return statement*; 2.3 *Three ways to get it wrong*; 2.4 *return in a void method* |
| Which one runs? | 3.3 *Overloading*; 3.4 *Variable arguments* (“including zero”) |
| Three variables called `n` | 3.1 (parameters are new variables); 6.1 *Every call gets a frame* (the three-`n` picture) |
| Mutate, or reassign? | 7.1–7.3 (Java passes by value; the value of an array variable is a reference; `replace`); Weeks 2+3 “two variables, one array” |
| Python: what does the caller see? | 4.3 (no `return` gives `None`); 7.4–7.5 (`add3`, `append3`, `overwrite`, the `+=` trap) |
| Records: compile, and print what? | 8.2–8.4 (syntax, accessor methods, `final` components, the constructor, printing) |
| Draw it: the stack and the heap | 6.1–6.4 (frames, locals die with the frame, arrays on the heap survive); for-each variable scope from Weeks 2+3 |
| Spot the errors 1 (Java) | 2.1–2.3 (return type, `void`); 6.2 (a local does not outlive its frame); 7.2 (reassigning an array parameter); Week 1's integer division |
| Spot the errors 2 (Python) | 4.3 (print is not return); 5.2 (keyword arguments); 5.3 (`*names` makes later parameters keyword-only); 7.4–7.5 (aliasing); Week 1's `str + int` `TypeError`; Weeks 2+3 slices |
| Predict 1: grow | 7.2 (mutation through a copied reference); 6.3 (`new` makes a new array); Weeks 2+3 `==` on arrays |
| Predict 2: pad and shout | 5.1–5.2 (defaults, keyword arguments); 7.4–7.5 (mutate or rebind; immutable strings); slices |
| Code it 1: reverse, two ways | 3.5 *Functions and procedures*; 7.1 and 7.3 (the `swap` that cannot work, and the one that can) |
| Code it 2: summarise | 2.1 (“a method returns a single value”); 8.5 (a record returns two values as one — here three); Weeks 2+3 tuples |

Deliberately **kept out**:

- **Classes beyond records**, `this`, constructors you write yourself — that is Week 5.
- **Argument widening** (`f(1, 2)` for an `int, double` method). It compiles, but the Week 4
  page does not discuss it, so no question depends on it.
- **Python's `min()`, `max()`, `sum()`**, which the course has not taught. *Code it 2* asks
  for the loop.
- **Mutable default arguments** (`def f(items=[])`). A classic trap, but not on the page.

## Every answer was run

Each claimed output and every compiler message was produced with OpenJDK 26 and CPython 3.14:

- **Individual questions:** all four methods in *Which of these compile?* (`missing return
  statement`, `int cannot be converted to boolean`, `unexpected return value`, `unreachable
  statement`), the five overload calls and the duplicate `show(int)` (`already defined`),
  `3 13`, the five array states (`9 2`, `9 2`, `9 2`, `4 4`, `4 0`), `[1, 5] 5 None`, and
  every records line: the two errors, `Point[x=1, y=2]`, `3` and `Point[x=3, y=4]`.
- **Draw it:** `Tally` prints `1 fail`, `2 pass`, and a separate test confirms `m` is out of
  scope after the for-each.
- **Spot the errors 1:** `Marks.java` at every stage. Round 1 gives only `return type required`
  (L2). Round 2 gives three messages: L10 `unexpected return value`, L18 `'void' type not
  allowed here`, and L21 `cannot find symbol`. With those fixed it prints `70.0 91` then `72`.
- **Spot the errors 2:** `marks.py` at every stage. The order is `SyntaxError` (L17), then
  `str + NoneType` (L16), `str + float` (L16), the keyword-only `title` error (L19), and the
  silent alias (L7), which prints `[82, 65, 101]` twice.
- **Predict:** *Predict 1* (`-1 2`, `1 99 3`, `3`, `false`, `true`) and *Predict 2*
  (`[1, 0, 0] [1, 0, 0] 3 5 hi`, `3`, `hi!hi!`).
- **Code it:**
  - *Code it 1*: both correct methods, the `v = reversed(v)` version (array unchanged), and
    the full-length swap (`1 2 3 4` comes back unchanged).
  - *Code it 2*: both solutions on all three tests, plus the wrong versions: starting at 0
    (`min=0`, and `max=0` for `{-3, -7}`), `int` division (`mean=70.0`), and
    print-instead-of-return (the tuple, then `None`).

## Running it

**Part 1 (about 8 minutes).** Around a minute per frame, with a show of hands before each
`\pause`. The records frame needs Java 16+, so if you demo it, use Ed or a local JDK. The
site's console is Java 8.

**Part 2 (about 40 minutes), four rounds.** Form teams on the *Form teams* frame. For each
challenge, leave the question frame up for the time on the slide, call on one team, invite
disagreement, then show the answer frame.

- **Draw the memory** (5 min). Have one team draw on the board before the reveal. The common
  mistakes are two copies of the `{72, 45, 91}` array, and `m` still in `tally`'s frame.
- **Spot the errors** (5 + 4 min). If there is time, compile `Marks.java` and run
  `marks.py` on the projector after each fix, so the room sees the errors arrive in rounds.
- **Predict the output** (4 + 4 min). Insist on written answers first.
- **Write the code** (4 + 6 min). *Code it 1* is on paper. For *Code it 2*, open `Stats.java`
  and `stats.py` on the projector (with a JDK of 16 or later for the record), give one team
  each, and run all three tests. `{-3, -7}` is the test that catches starting at 0.

**If you only have 25–30 minutes,** drop *Which one runs?* and *Records* from Part 1, then
use one challenge per round: *Draw it*, *Spot the errors 2*, *Predict 1*, *Code it 1*. Keep
*Mutate, or reassign?*: it is the idea every other frame depends on.
