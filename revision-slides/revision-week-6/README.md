# Revision of Week 6 — 41039 Programming 1

A recap of Week 6 (building reliable classes: contracts, `private`, references, shared
versus per-object data, and composition), shown at the start of the next lecture. After a
one-slide summary of the week ("Week 6 in five ideas"), it asks ten questions of five
kinds: 1 fill in the blanks, 2 multiple choice, 2 predict the output, 2 find the bug and
3 write the code. Students answer each one alone first and the answer appears on the next
click. A bridge to Week 7 and a checklist close the deck. Plan about 25 minutes.

| # | Question | Format |
| --- | --- | --- |
| 1 | Contracts, `private` and references | Fill in the blanks (word bank of 10, 6 blanks) |
| 2 | Which `take(n)` keeps the contract? | Multiple choice, three versions (answer A: version 1 only) |
| 3 | Which line does not compile? (`Account`) | Multiple choice (answer C: `a.balance = 100;`) |
| 4 | Ticket numbers (Java, `static`) | Predict the output, then name the line that breaks the numbering |
| 5 | A shelf has a book (Python) | Predict the output, then give `s2` its own book |
| 6 | The car park (Java) | Find the bug: 4 bugs, one of them a compile error |
| 7 | The team (Python) | Find the bug: 3 bugs; the program crashes as given |
| 8 | A counter with a ceiling (Java) | Write the code from a skeleton, 4 minutes |
| 9 | A playlist of its own (Python) | Write the code from a skeleton, 4 minutes |
| 10 | Order numbers (Java) | Write the code from a skeleton, 4 minutes |
| — | When a shelf needs more than three books | Looking ahead to Week 7 (two pages) |

26 PDF pages: 15 frames (title, "Today's revision", "Week 6 in five ideas", Q1–Q10,
Looking ahead, checklist). Each question and Looking ahead has its answer on the
following page.

## Files

| File | What |
| --- | --- |
| `revision-week-6.tex` | The deck. Build: `xelatex revision-week-6.tex`, twice |
| `revision-week-6.pdf` | Built output |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/q02-mcq-which-take/` | The three versions of `take` as classes `A`, `B`, `C`, each tried with `take(9)` then `take(-5)` |
| `examples/q03-mcq-which-line-fails/` | `Demo.java` runs options A, B and D. `option-c/Demo.java` adds option C and **does not compile** |
| `examples/q04-predict-ticket-numbers/` | The slide's program, with the "in main" lines in `Demo.main` |
| `examples/q05-predict-shelf-has-a-book/` | The slide's program, and `fixed/` with `s2 = Shelf(Book(b.title))` |
| `examples/q06-find-the-bug-car-park/` | `CarPark.java` exactly as on the slide (same line numbers); it **does not compile**. `only-line-14-fixed/` removes only the compile error, so the logic bugs show |
| `examples/q07-find-the-bug-team/` | `main.py` exactly as on the slide (same line numbers); it crashes with `ValueError` |
| `examples/bridge/` | The Looking ahead shelves. The list version is named `ListShelf` so both fit in one file |
| `solutions/q06-find-the-bug-car-park/` | The repaired `CarPark.java`, and `Demo.java` with the slide's test |
| `solutions/q07-find-the-bug-team/` | The repaired team program with the slide's test |
| `solutions/c1-bounded-counter/`, `c2-playlist/`, `c3-order-numbers/` | The slides' "One answer" for Q8–Q10, each with the slide's test |
| `starters/c1-bounded-counter/`, `c2-playlist/`, `c3-order-numbers/` | The Q8–Q10 skeletons exactly as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO`s are done |
| `checks.json` | Every runnable file, with its recorded output, for `scripts/check_revision_slides.py` |

In each Java file that holds a test, the class under test is not `public`, so the class
and its test fit in one file. The class body is the same as on the slide.

## Verification

Every output on the slides comes from running these files (Java 8, CPython 3):
16 runnable files are recorded in `checks.json`, including the buggy Q7 program, which
exits with `ValueError: list.remove(x): x not in list`.

Two files are meant not to compile, so they are not in `checks.json`. Each was checked
by hand with `javac --release 8`:

- `examples/q03-mcq-which-line-fails/option-c/Demo.java`: `balance has private access in Account`.
- `examples/q06-find-the-bug-car-park/CarPark.java`: `non-static variable capacity cannot
  be referenced from a static context`. javac reports it on line 15 (`return capacity - parked;`);
  the fix is on line 14 (remove `static` from `free()`).

```sh
python3 scripts/check_revision_slides.py --weeks 6
```

These are new practice questions, not copies of graded labs, assignments or exams.
