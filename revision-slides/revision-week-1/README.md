# Revision of Week 1 — 41039 Programming 1

A 15-minute active-recall recap of Lecture 1, shown **at the start of the Weeks 2 & 3
lecture**, before any new material. Announced to students in
[`w2-announcement.txt`](../../w2-announcement.txt): taking part earns extra credit.

| File | What |
|---|---|
| `revision-week-1.tex` | The deck. Build: `xelatex revision-week-1.tex` (twice — the TOC needs a second pass) |
| `revision-week-1.pdf` | Built output, 43 pages (13 frames; questions and answers are separate overlays) |
| `bk-logo.png` | Required next to the `.tex`, same file the `w1.tex` / `w23.tex` decks use |
| `Average.java`, `average.py` | Skeleton code for the two live-coding frames &mdash; TODO-marked, ready to paste into the IDE on the projector |
| `solutions/` | Completed versions of both skeletons, for you to check against or reveal if a volunteer gets stuck |

Style follows the subject's own decks in `Courses/UTS-Programming I/` (`w1.tex`, `w23.tex`)
— same `bkblue`, `\keyline`, `lstlisting` style and footer. The **structure** follows the
CO1005 revision deck in `CO1005-Website/lecture3-slides/revision-week1-2/`: every frame asks
before it tells, answers arrive on a separate overlay, and a word bank or an explicit
question box makes the ask unambiguous.

## Why the answers are on a second overlay

Recalling something is what fixes it; re-reading it does not. If the answer is on screen
while the question is being read, no recall happens. Advance only once the room has
committed to an answer — out loud, on paper, or silently.

## Every question comes from Lecture 1

Nothing here tests material the students have not been taught. Each frame maps to a frame
of `w1.tex`:

| Revision frame | Lecture 1 source |
|---|---|
| Fill the blanks: Java and Python | *Java, the language*; *Python, the language* (the comparison table); *Python's basic types* |
| Which kind of error is it? | *Three kinds of error*; *A real one* (the `InputMismatchException`); *What this looks like in real code*; *The same `+`, two languages* |
| Spot the errors | *Conventions — and one Rule*; *One more rule: the file name*; *Hello, Java* |
| Fill the blanks: name the parts | *How Java code is structured*; *Hello, Java*; *One more rule: the file name* |
| Types and names: quick quiz | *Java's primitive types*; *Conventions — and one Rule*; *This number once made global news* |
| Predict the output | *Arithmetic*; *A note about `=`* |
| The bug that compiles, runs, and lies | *What this looks like in real code* — the same program, the same numbers |
| Same program, two languages | *Python's basic types*; *Hello, Python*; *The same `+`, two languages* |
| One space changes the answer | *Indentation is not decoration* — the same two snippets |
| Read the compiler | *Reading a Java compile-time error*; *Two things that will save you* |
| In pairs: make it print `Bach20` | *The same `+`, two languages* — the keyline sets exactly this task |
| Live coding: finish the Java program | *A real one* (`Scanner`, `nextInt()`, the `InputMismatchException`); *Arithmetic* (`7 / 2`); *What this looks like in real code* (the average that truncates) |
| Live coding: the same program in Python | *Indentation is not decoration* (`input()`, `int()`); *The same `+`, two languages*; *Errors in Python* |
| Where Week 1 stops | bridge into Weeks 2 & 3; no Week 1 content is assessed here |

Three things were deliberately **kept out**, because Lecture 1 does not teach them:

- **Array indexing.** Arrays arrive in Weeks 2–3. The CrowdStrike slide mentions an array
  index, but only as a news story — students cannot yet write or read one.
- **Division by zero.** Never mentioned in Lecture 1. The run-time error they were actually
  shown is `InputMismatchException` from `Scanner.nextInt()`.
- **The syntax rules for legal identifiers** (no leading digit, no reserved words). Lecture 1
  covers naming *conventions* — `UpperCamel` classes, `lowerCamel` variables, `ALL_CAPS`
  constants, case sensitivity — so the quiz asks about those instead.

If a frame is ever added, check it against this table first.

## Timing

About 20 minutes at a brisk pace: roughly one minute per question frame, two minutes for
the pair activity, and four minutes for each of the two live-coding frames. For those, paste
the skeleton file (`Average.java` or `average.py`, both in this folder) into the IDE on the projector and hand the keyboard to a
volunteer; the room shouts corrections; run it before accepting it. If time is short, do the
Java one only — the Python one is the same program, and the differences are on its answer frame. If time is short, the frames that can be dropped without breaking the
thread are *Name the parts* and *One space changes the answer*. **Do not** drop *The bug that
compiles, runs, and lies* — the silent logic error is the single idea from Week 1 that most
needs saying twice.
