# Revision of Week 2 — 41039 Programming 1

A 20-minute active-recall recap of Lecture 2, shown **at the start of the next lecture**,
before any new material. Announced to students in
[`w3-announcement.txt`](../../w3-announcement.txt): taking part earns extra credit, as in
Week 1.

| File | What |
|---|---|
| `revision-week-2.tex` | The deck. Build: `xelatex revision-week-2.tex` (twice — the TOC needs a second pass) |
| `revision-week-2.pdf` | Built output, 39 pages (18 frames plus section outlines; questions and answers are separate overlays) |
| `bk-logo.png` | Required next to the `.tex`, same file as Week 1 |
| `Ticket.java`, `day.py` | Skeleton code for the two live-coding frames — TODO-marked, ready to paste into the IDE on the projector |
| `solutions/` | Completed versions of both skeletons, with the three planted bugs noted in comments |

Style and macros are identical to `../revision-week-1/revision-week-1.tex`, with one addition:
a `Py` listings language that highlights `match`, `case` and `elif` (listings' built-in
Python predates 3.10).

## Scope: conditionals only

The Week 2 lecture was planned to cover sections 1–7 of `week-2-3-slides.pdf` (choosing
**and** loops). The post-lecture email (`../../w2-email-post.text`) asked students to revise
only conditionals — if / else if / else, `switch`, `match` — so this deck covers sections
1–4 and nothing else. The last frame, *Where Week 2 stops*, bridges into loops as today's
topic.

**If loops were in fact covered in Lecture 2,** the bridge frame is wrong (it presents
`do-while` as new) and loops are unrevised. Swap the bridge for a loop frame before using
the deck.

## Every question comes from Lecture 2

Each frame maps to a frame of `UTS-Programming I/w23.tex` (sections 1–4):

| Revision frame | Lecture 2 source |
|---|---|
| Fill the blanks: types and booleans | *Java is strongly, statically typed*; *It is not only variables that have a type*; *The operators that produce a boolean* |
| Which of these compile? | *It is not only variables that have a type* (`boolean b = 10 + 3`); *`boolean` is its own type* (`10 + b`); the `if (x = 5)` typo on *The operators that produce a boolean*; *Combining comparisons* |
| True or false? | *The operators that produce a boolean*; *Combining comparisons*; Python's `and`/`or`/`not` from Activity C |
| Two `if`s, again | *Two `if`s are not an `if-else`*; *Two problems, and the second one is nastier* — same trap, new numbers |
| Order decides the winner | *Many conditions: `else if`*; *Order decides the winner* |
| Find the gaps | *Two problems* (“what about exactly 100?”); *The case you were certain could not happen* (the final `else`) |
| Predict the output (`switch`) | *`break`, and what happens without it*; *Fall-through* |
| Could this be a `switch`? | *When every test is “is it equal to…”* (the switchable types; equality only); *Fall-through on purpose* |
| Spot the errors: Python | *Same idea, less punctuation* (`elif`, colon, indentation, `if (1 < 2):` allowed but not preferred) |
| `match`: predict, then compare | *`match` — Python's switch, sort of*; *No fall-through changes the idiom* (the comparison table) |
| Live coding: ticket prices (Java) | *Many conditions: `else if`*; *Order decides the winner*; *Combining comparisons* (`\|\|`); Week 1's `Scanner` |
| Live coding: which day? (Python) | *`match`*; *No fall-through changes the idiom* (`case 6 \| 7`, `case _`); Week 1's `input()`/`int()` |
| Where Week 2 stops | bridge into loops; nothing here is revised |

Deliberately **kept out**, because Lecture 2 did not teach it (or not yet):

- **Loops** of any kind — see *Scope* above. The one `do-while` on the bridge frame is a
  preview, shown after the question.
- **Arrow-form `switch`** (`case 1 -> ...`) and switch *expressions*. Neither the deck nor the
  Ed lesson shows them.
- **String comparison with `.equals()`.** `String` is on the switchable-types list, but
  comparing Strings with `==` is a later topic, so no question depends on it.
- **Operator precedence** between `&&` and `||`. Every boolean question uses one operator
  kind per expression, or brackets.
- **Python's chained comparisons** (`10 < i < 20`). Not taught; the Python answer uses
  `and`.

If a frame is ever added, check it against this table first.

## Every answer was run

Each snippet with a claimed output was compiled with OpenJDK 26 and run on CPython 3.14,
including the three bugs on *One answer — and three ways to get it wrong* (`&&` for `||`,
`> 65`, child test first), the no-`int()` trap in `day.py` (every input prints
`Invalid day`), and the `double` switch (rejected: “primitive patterns are a preview
feature”, matching the lecture's “currently in preview”).

## Timing

About 20 minutes at a brisk pace: roughly one minute per question frame, 90 seconds for
*Find the gaps* in pairs, and four minutes for each live-coding frame. For those, paste
`Ticket.java` or `day.py` into the IDE on the projector and hand the keyboard to a
volunteer; the room shouts corrections; **run every input in the table** before accepting
it — the bugs only show on the boundary inputs.

If time is short, the frames that can be dropped without breaking the thread are *Fill the
blanks* and *Could this be a switch?*; the Python live coding can be replaced by showing its
answer frame (30 seconds). **Do not** drop *Two ifs, again* or *Find the gaps* — the
“exactly on the boundary” question is the Week 2 idea that most needs saying twice, and
every loop condition in the next lecture needs it too.
