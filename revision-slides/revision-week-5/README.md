# Revision of Week 5 — 41039 Programming 1

A recap of Week 5 (classes, objects, `static`, Python classes, enums and switch), shown
at the start of the next lecture. It follows the same question format as the CO1005
revision decks: short active-recall questions, each answered on the next click, then
three coding questions (each with a skeleton), a bridge to today's topic and a checklist.

| # | Question | Format |
| --- | --- | --- |
| 1 | Classes and objects | Fill the blanks (word bank) |
| 2 | Lamps, aliases and a static counter | What does each line hold? (a)–(f) |
| 3 | One shared total, two objects | Trace table |
| 4 | The pizza that forgot its size | Predict the output, then a one-line fix |
| 5 | Static and instance members | Which of these methods compile? |
| 6 | Instance, class and static methods (Python) | Predict the output |
| 7 | An enum switch that falls through | Predict the output, then a switch expression (Java 14+) |
| 8 | The player score (Python) | Spot the errors: 4 planted bugs |
| 9 | Break the player | Pair activity, 3 minutes |
| 10 | `int` constants or an enum | Which version would you rather debug? |
| C1 | A rectangle that counts itself (Java) | Write the code from a skeleton, 4 minutes |
| C2 | A temperature with a class method (Python) | Write the code from a skeleton, 4 minutes |
| C3 | An enum with data (Java) | Write the code from a skeleton, 4 minutes |
| — | When anyone can change the count | Bridge to Week 6 |

34 PDF pages: 20 frames, with each answer on the following page.

## Files

| File | What |
| --- | --- |
| `revision-week-5.tex` | The deck. Build: `xelatex revision-week-5.tex`, twice |
| `revision-week-5.pdf` | Built output |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/` | One folder per question, with complete programs for every slide listing. Where a slide says "in main", the file wraps those lines in `Demo.main` |
| `examples/q08-spot-the-errors/` | `broken.py` exactly as on the slide (same line numbers), then the program after each fix in the order Python reports them |
| `solutions/` | The repaired player program and complete answers to C1–C3, each with the slide's test |
| `starters/` | Skeletons for C1–C3, as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO`s are done |
| `checks.json` | Every run, with its recorded output, for `scripts/check_revision_slides.py` |

## Verification

Every output on the slides comes from running these files: Java 8 except the switch
expression (Java 14), and CPython 3. The slides also say that some code does not compile.
Each of those cases is in `examples/` and was checked to fail with the message the slide
gives: `Lamp.toggle()`, `label()` in `Shop`, a switch expression without `LARGE`, and
`colour(7)` with the enum.

```sh
python3 scripts/check_revision_slides.py --weeks 5
```

These are new practice questions, not copies of graded labs, assignments or exams.
