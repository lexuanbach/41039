# Revision of Week 3 — 41039 Programming 1

A 50-minute recap of Lecture 3 (loops), shown **at the start of the next lecture**, before
any new material. It has two parts: six short **individual** questions, then **four team
rounds** for teams of 3–4: **draw the flow** (one flowchart), **spot the errors** (three
programs, the last with logic errors only), **predict the output** (two), and **write the
code** (two). It is harder than Weeks 1 and 2 on purpose. The
questions ask how many times a loop runs, whether it stops at all, and whether two loops
really are equivalent, and most can only be answered by tracing on paper.

| File | What |
|---|---|
| `revision-week-3.tex` | The deck. Build: `xelatex revision-week-3.tex` (twice — the TOC needs a second pass) |
| `revision-week-3.pdf` | Built output, 39 pages (27 frames plus section outlines; individual answers are overlays, team answers are separate frames) |
| `bk-logo.png` | Required next to the `.tex`, same file as Weeks 1–2 |
| `Primes.java` | *Spot the errors 1* as a runnable file: five planted bugs, one of which stops it compiling |
| `odds.py` | *Spot the errors 2* as a runnable file: five errors, which Python reports one at a time |
| `RowSums.java` | *Spot the errors 3* as a runnable file: compiles and runs, five logic errors in nested loops |
| `Floyd.java`, `floyd.py` | Skeletons for *Code it 2*, the keyboard challenge (one Java team, one Python team) |
| `solutions/` | `Primes.java`, `odds.py` and `RowSums.java` with every bug fixed and listed, and completed `Floyd.java` and `floyd.py` |

Style and macros are the same as `../revision-week-2/revision-week-2.tex`. The `Py` listings
language also highlights `True` and `False`, and TikZ is loaded for the flowchart, with four
node styles (`term`, `io`, `proc`, `dec`) in the preamble.

## Scope: loops only

The deck covers sections 5–7 of `w23.tex` (*Loops in Java*; *Nesting, Breaking,
Continuing*; *Loops in Python*), which is what the Week 3 follow-up email
(`../../w3-email-post.txt`) asked students to revise. Arrays, lists, dicts, sets and tuples
(sections 8–11) are not revised here.

| Revision frame | Lecture 3 source |
|---|---|
| Predict the output (a–c) | *The `for` loop* (`i += 2` steps); *The `while` loop*; *`do-while`: test afterwards* (“at least once”) |
| Predict the output: two that surprise (d–e) | *Loops with almost no body* (the bare `;` body); *Two dimensions* (“a variable declared in a `for` header is local to that loop”); *The shape of a Python loop* (`range(n)`) |
| Count it | *Loops inside loops* (inner bound uses the outer variable); *`while` vs `for`* (the `i /= 2` count); *Loops with almost no body* (`sum += i++`) |
| What makes this stop? | *Forget the third part and…*; *What makes this stop?*; *The shape of a Python loop* (the `for` is always a for-each) |
| `break`, `continue`, and labels | *Finishing early: `break`*; *Labelled `break`*; *`continue`: skip just this one* |
| Loop-`else`: the search | *Loop-`else` — the genuinely strange one*, plus its speaker note (“a search loop that breaks on a hit”) |
| **Round 1 — draw the flow** | |
| Draw it: the flowchart | *`do-while`: test afterwards*; *The `for` loop* (its three parts); *Loops inside loops* (the prime test); *Finishing early: `break`*. Flowcharts themselves were **not** taught in Weeks 1–3, so the question frame shows the four shapes |
| **Round 2 — spot the errors** | |
| Spot the errors 1: primes, in Java | *Loops inside loops* and *`continue`: skip just this one* (the prime programs, with bugs planted); for-header scope from *Two dimensions* |
| Spot the errors 2: odd numbers, in Python | *The shape of a Python loop*; *`break` and `continue`*; Week 1's `int(input())` and the `str + int` `TypeError` (w1.tex, *TypeError*) |
| Spot the errors 3: logic only | *Loops inside loops*; *Labelled `break`*; boundaries (`<` vs `<=`, as in *What makes this stop?*); for-header scope |
| **Round 3 — predict the output** | |
| Predict 1: four loops, two claims | *`while` vs `for`: which is best?* (“functionally equivalent… just unpack the three parts”); *`do-while`* |
| Predict 2: the mystery loop | *The `while` loop* (set up, test, change); Week 1's integer division; `%` as used in the prime examples |
| **Round 4 — write the code** | |
| Code it 1: leave both loops, in Python | *Labelled `break`*; *`break` and `continue`* in Python (“no labelled `break`… commonly with a flag variable”); loop-`else` for the bonus |
| Code it 2: Floyd's triangle | *Loops inside loops*; *Labelled `break`* (Java); the flag from *`break` and `continue`* (Python) |

Deliberately **kept out**, because Lecture 3 did not teach it:

- **`range` with two or three arguments.** Every Python loop uses `range(n)`, so Team 5's
  Python needs `range(r + 1)`, and that is also where its off-by-one trap is.
- **Python's `//`.** *Predict 2* and the integer-halving count are in Java, where Week 1 taught
  integer division. The loop-`else` search prints the divisor only, not `n // d`.
- **Floating-point loop counters** (`x += 0.1` never equalling `1.0`) and **integer
  overflow**. *What makes this stop?* (b) is still honestly infinite with overflow in play,
  because wrapping by 2³² keeps `i` odd, so it can never equal 10.
- **Arrays** beyond the one for-each shown in the lecture. No question needs indexing.

**One thing given in the skeleton, not taught:** `print(k, end=" ")` in `floyd.py`. The
skeleton explains it in a comment, because Floyd's triangle needs several numbers on one
line.

**Why the Python spot-the-errors works as a sequence:** Python reports only the first
error each run, so the question asks for the *order* students would meet the five. That
order was checked by running the file after each fix: `SyntaxError` at the braces, then at
`i++`, then `TypeError` at `i <= n`, then a silent hang at `i = 2` (the `continue` skips
`i += 1`), and only then the `str + int` `TypeError` on the last line, which the hang had
been hiding.

## Every answer was run

Each snippet with a claimed output was compiled with OpenJDK 26 and run on CPython 3.14:
all five parts of *Count it* (5, 10, 9, 45, 55), the three `break`/`continue` variants,
the loop-`else` search for 91, 97, 4, 2, 1 and 36 with and without `break`, both pairs
in *Predict 1* (the unpacked `while` was run with a guard and sticks at `i = 0`), the Java
and all three Python versions in *Code it 1*, digit reversal for 472, 1200, 7, 0, −45 and
1221, and the `r == n` palindrome check (prints nothing for 1221, `palindrome` for 0),
`odds.py` at each of its five stages and fixed (25 for `n = 10`, 16 for 7, 1 for 1, 0 for
0), `RowSums.java` buggy and fixed for `5, 100` and `5, 8` (the buggy one prints `Total: 10`
for both, and `10` is also the right total for `5, 8`), the flowchart program for inputs 0,
1, then 20 (it asks again twice, then prints 8), 2 (prints 1) and 100 (prints 25), and
`Primes.java` as given (fails at `count`), with only that error fixed (prints 1, 2, 4, 6,
8, 10 and `6 primes below 10`), and fully fixed (2, 3, 5, 7). Both Floyd solutions
produce identical output for every row of the test table, and the three wrong versions on
*three ways to get it wrong* were run too (plain `break` gives three blank lines for
`8, 12`).

## Running it

**Part 1 (about 8 minutes).** Around a minute per frame. Ask for a show of hands or a
shouted answer before each `\pause`.

**Part 2 (about 40 minutes), four rounds.** Form teams on the *Form teams* frame at the
start of round 1. For each challenge, leave the question frame up for the time on the
slide, call on one team, invite disagreement, then show the answer frame.

- **Draw the flow** (5 min). Teams draw on paper. Ask one team to draw theirs on the board
  before showing the answer. The usual mistakes are putting the `for`'s diamond after its
  body, and sending the `break` arrow to `i++` or to the end.
- **Spot the errors** (4 + 3 + 5 min). For `odds.py`, the order question is the hard part:
  if there is time, run the file on the projector after each fix so the room sees each
  error appear. For `RowSums.java`, run the buggy version for `5, 8` last: the right total
  from wrong rows is the point of the challenge.
- **Predict the output** (4 + 4 min). Insist on written answers before the reveal. Most
  wrong answers here come from a skipped step in the trace.
- **Write the code** (4 + 6 min). *Code it 1* is on paper. For *Code it 2*, open
  `Floyd.java` and `floyd.py` in the IDE on the projector, give one team each, and **run
  every row of the test table** before accepting a solution. The `8, 12` row is the one
  that catches a plain `break`, and `3, 0` catches a counter that prints before checking
  the limit.

**If you only have 25–30 minutes,** drop *Predict the output (a–c)* from Part 1, then use
one challenge per round: *Draw it*, *Spot the errors 3*, *Predict 1* and *Code it 2*. Show
the others as answer frames only, or skip them. Keep *What makes this stop?* in Part 1.
