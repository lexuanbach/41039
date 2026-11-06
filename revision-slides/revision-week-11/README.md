# Revision of Week 11 — 41039 Programming 1

A recap of Week 11 (designing object-oriented programs: one responsibility per class,
Information Expert, depending on an interface you are given, keeping a replacement's
promise, focused capabilities, cohesion and coupling, DRY and YAGNI), shown at the start
of the next lecture. After a one-slide summary of the week ("Week 11 in five ideas"), it
asks ten questions of five kinds: 1 fill in the blanks, 2 multiple choice, 2 predict the
output, 2 find the bug and 3 write the code. Students answer each one alone first and the
answer appears on the next click. A bridge to Week 12 and a checklist close the deck.
Plan about 35 minutes.

| # | Question | Format |
| --- | --- | --- |
| 1 | Experts, cohesion, coupling, interfaces, YAGNI | Fill in the blanks (word bank of 10, 6 blanks) |
| 2 | Which `Basket` can use a new `Half` rule with no edit? | Multiple choice, three versions (answer C: version 3 only) |
| 3 | Which `Tally` breaks the promise? (Liskov substitution) | Multiple choice (answer C: `LastTally`) |
| 4 | Library fines (Java, a `Fee` interface given to `Library`) | Predict the output, then say which class changes for a new fee (none) |
| 5 | A screen and a recorder (Python, one `send` capability) | Predict the output, then explain why `remind` is easy to test |
| 6 | The library member (Java) | Find the bug: 4 bugs, one of them a compile error (reaching into a `private` field) |
| 7 | The checkout (Python) | Find the bug: 3 bugs; the program crashes as given |
| 8 | Ask the expert: a cart (Java) | Write the code from a skeleton, 4 minutes |
| 9 | One pass mark in one place (Python) | Write the code from a skeleton, 4 minutes |
| 10 | Two desks, one stock (Java) | Write the code from a skeleton, 4 minutes |
| — | One function that does every job | Looking ahead to Week 12 (two pages) |

26 PDF pages: 15 frames (title, "Today's revision", "Week 11 in five ideas", Q1–Q10,
Looking ahead, checklist). Each question and Looking ahead has its answer on the
following page.

## Files

| File | What |
| --- | --- |
| `revision-week-11.tex` | The deck. Build: `xelatex revision-week-11.tex`, twice |
| `revision-week-11.pdf` | Built output |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/q02-mcq-which-basket/` | The three versions as `BasketV1`, `BasketV2`, `BasketV3` (bodies as on the slide), with `StudentPrice` and `Half`: only version 3 can be handed `Half` (prints `1000 800 500`) |
| `examples/q03-mcq-safe-replacement/` | The slide's `Tally` and `check`, with the four option classes: `check` gives 8, 8, 3, 8 |
| `examples/q04-predict-library-fines/` | The slide's program, with the "in main" lines in `Demo.main`. `capped/` adds the answer's `Capped` fee with `Library` unchanged (`3 4 0`) |
| `examples/q05-predict-reminders/` | The slide's program |
| `examples/q06-find-the-bug-member/` | `Member.java` exactly as on the slide (same line numbers); it **does not compile**. `only-line-17-fixed/` repairs only the compile error, so the logic bugs show |
| `examples/q07-find-the-bug-checkout/` | `main.py` exactly as on the slide (same line numbers); it crashes with `TypeError`. `only-line-10-fixed/` shows that line 12 still crashes after line 10 is fixed |
| `examples/bridge/` | The Looking ahead programs: `one-function/` crashes on the bad row; `main.py` is the staged version |
| `solutions/q06-find-the-bug-member/` | The repaired `Member.java`, and `Demo.java` with the slide's test |
| `solutions/q07-find-the-bug-checkout/` | The repaired checkout program with the slide's test |
| `solutions/c1-cart/`, `c2-gradebook/`, `c3-desk/` | The slides' "One answer" for Q8–Q10, each with the slide's test |
| `starters/c1-cart/`, `c2-gradebook/`, `c3-desk/` | The Q8–Q10 skeletons exactly as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO`s are done |
| `checks.json` | Every runnable file, with its recorded output, for `scripts/check_revision_slides.py` |

In each Java file that holds a test, the classes under test are not `public`, so the
classes and their test fit in one file. The class bodies are the same as on the slide.

## Verification

Every output, error message and claim on the slides comes from running these files
(Java 8, CPython 3): 18 runnable files are recorded in `checks.json`, including the
buggy Q7 program, which prints `1000` and exits with
`TypeError: can only concatenate str (not "NoneType") to str`, and the Looking ahead
`one-function/` program, which exits with `ValueError`.

Two files are not in `checks.json`. Each was checked by hand with `javac --release 8`:

- `examples/q06-find-the-bug-member/Member.java` is meant not to compile:
  `Member.java:17: error: due has private access in Loan`. javac reports it on line 17,
  the line that is fixed.
- `solutions/q06-find-the-bug-member/Member.java` compiles but has no `main`; its
  classes are run through `Demo.java` in the same folder.

The Q2 answer's claim that outside code cannot swap `Half` into version 2 was also
checked: `v2.rule = new Half();` gives `rule has private access in BasketV2`.

```sh
python3 scripts/check_revision_slides.py --weeks 11
```

These are new practice questions, not copies of graded labs, assignments or exams.
