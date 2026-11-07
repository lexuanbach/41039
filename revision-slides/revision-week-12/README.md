# Revision of Week 12 — 41039 Programming 1

A recap of Week 12 (review and integration: tracing with meaning, mutation versus
rebinding, a read–parse–validate–store–report pipeline, an explicit error policy, and
tests that can fail), shown at the start of the next session. As the final revision, the
questions also draw on earlier weeks: classes, lists, inheritance and interfaces,
exceptions and text files. After a one-slide summary of the week ("Week 12 in five
ideas"), it asks ten questions of five kinds: 1 fill in the blanks, 2 multiple choice,
2 predict the output, 2 find the bug and 3 write the code. Students answer each one alone
first and the answer appears on the next click. A "Looking ahead" slide on preparing for
the final assessment and a checklist close the deck. Plan about 35 minutes.

| # | Question | Format |
| --- | --- | --- |
| 1 | Tracing, parsing, mutation and tests | Fill in the blanks (word bank of 10, 6 blanks) |
| 2 | Which test reveals the bug? (`countPassed` uses `>`) | Multiple choice (answer C: marks `{50, 70}`) |
| 3 | Where does `marks.add(mark)` go? (parse, then validate, then store) | Multiple choice (answer B: inside the range check) |
| 4 | A box in a list (Java: mutation vs rebinding, `ArrayList`) | Predict the output, then name the line that changes the caller's box |
| 5 | Items on sale (Python: inheritance, `super()`, exceptions) | Predict the output, then predict the ink order with `n = 0` |
| 6 | The gradebook (Java) | Find the bug: 4 bugs, one of them a compile error |
| 7 | Loading students (Python) | Find the bug: 3 bugs; the program crashes as given |
| 8 | Parse one row (Java, throwing `IllegalArgumentException`) | Write the code from a skeleton, 4 minutes |
| 9 | Summarise a marks file (Python, file reading) | Write the code from a skeleton, 4 minutes |
| 10 | Keep what passes a check (Java, interface + new list) | Write the code from a skeleton, 4 minutes |
| — | Preparing for the final assessment | Looking ahead (two pages); streams and list comprehensions shown as **optional** enrichment |

26 PDF pages: 15 frames (title, "Today's revision", "Week 12 in five ideas", Q1–Q10,
Looking ahead, checklist). Each question and Looking ahead has its answer on the
following page.

Scope: Week 12 sections 01–03 are the core. Section 04 (functional ideas and streams) is
optional enrichment and appears only on the Looking ahead slide, labelled "Optional:
beyond the core". Current Canvas instructions govern assessment.

## Files

| File | What |
| --- | --- |
| `revision-week-12.tex` | The deck. Build: `xelatex revision-week-12.tex`, twice |
| `revision-week-12.pdf` | Built output |
| `revision-week-12-student.pdf` | Student copy: the first click of every slide, so no answers. Built by `python3 scripts/build_student_revisions.py --weeks 12` |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/q02-mcq-which-test/` | The slide's `countPassed`, run on the four tests A–D against the rule (`>= 50`) |
| `examples/q03-mcq-where-to-add/` | `Demo.java` is option B (the answer). `option-a/` and `option-d/` run those placements. `option-c/Demo.java` **does not compile** |
| `examples/q04-predict-box-in-a-list/` | The slide's program, with `change` and `main` in `Demo` |
| `examples/q05-predict-sale-items/` | The slide's program, and `ink-zero/` with the ink order's `n` set to 0 (part 2) |
| `examples/q06-find-the-bug-gradebook/` | `Gradebook.java` exactly as on the slide (same line numbers); it **does not compile**. `only-line-13-fixed/` removes only the compile error, so the logic bugs show |
| `examples/q07-find-the-bug-load/` | `main.py` exactly as on the slide (same line numbers); it crashes with `ValueError`. `only-line-10-fixed/` fixes only the crash |
| `examples/looking-ahead/` | The optional Java 8 stream next to the equivalent loop, and the optional Python list comprehension |
| `solutions/q06-find-the-bug-gradebook/` | The repaired `Gradebook.java`, and `Demo.java` with the slide's test |
| `solutions/q07-find-the-bug-load/` | The repaired program with the slide's test |
| `solutions/c1-parse-a-row/`, `c2-summarise-a-file/`, `c3-keep-matching/` | The slides' "One answer" for Q8–Q10, each with the slide's test |
| `starters/c1-parse-a-row/`, `c2-summarise-a-file/`, `c3-keep-matching/` | The Q8–Q10 skeletons exactly as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO`s are done |
| `checks.json` | Every runnable file, with its recorded output, for `scripts/check_revision_slides.py` |

In each Java file that holds a test, the class under test is not `public`, so the class
and its test fit in one file. The class body is the same as on the slide. The Q9 programs
write their own `marks.txt` first, so they run in an empty directory.

## Verification

Every output on the slides comes from running these files (Java 8, CPython 3):
20 runnable files are recorded in `checks.json`, including the buggy Q7 program, which
exits with `ValueError: not enough values to unpack (expected 2, got 1)`.

Three files are not in `checks.json`. Two are meant not to compile; each was checked by
hand with `javac --release 8`:

- `examples/q03-mcq-where-to-add/option-c/Demo.java`: `cannot find symbol ... variable mark`
  (`mark` is declared inside the `try` block, so the `catch` block cannot see it).
- `examples/q06-find-the-bug-gradebook/Gradebook.java`: `variable avg might not have been
  initialized`. javac reports it on line 15 (`return avg;`); the fix is on line 13
  (`double avg = 0;`).

The third, `solutions/q06-find-the-bug-gradebook/Gradebook.java`, compiles but has no
`main`; `Demo.java` beside it runs the test.

```sh
python3 scripts/check_revision_slides.py --weeks 12
```

These are new practice questions, not copies of graded labs, assignments or exams.
