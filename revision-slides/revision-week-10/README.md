# Revision of Week 10 — 41039 Programming 1

A recap of Week 10 (writing files and reliable reports: line endings, overwrite versus
append, closing and flushing, write errors, CSV quoting, and keeping calculation and
formatting apart from the destination), shown at the start of the next lecture. After a
one-slide summary of the week ("Week 10 in five ideas"), it asks ten questions of five
kinds: 1 fill in the blanks, 2 multiple choice, 2 predict the output, 2 find the bug and
3 write the code. Students answer each one alone first and the answer appears on the next
click. A bridge to Week 11 and a checklist close the deck. Plan about 35 minutes.

| # | Question | Format |
| --- | --- | --- |
| 1 | Newlines, file modes, closing and quoting | Fill in the blanks (word bank of 10, 6 blanks) |
| 2 | Keep the old line, add a new one (Java) | Multiple choice (answer C: `new FileWriter("s.txt", true)`) |
| 3 | `with` and an exception (Python) | Multiple choice (answer B: `closed? True`, then `'a\n'`) |
| 4 | `print`, `println` and append (Java) | Predict the output, then predict it again with an overwriting second writer |
| 5 | A name with a comma (Python, `csv`) | Predict the output, then turn a mark read back into a number |
| 6 | The report file (Java) | Find the bug: 4 bugs, one of them a compile error |
| 7 | Saving twice (Python) | Find the bug: 3 bugs; the program crashes as given |
| 8 | Report rows, no file needed (Java) | Write the code from a skeleton, 4 minutes |
| 9 | A log that only grows (Python) | Write the code from a skeleton, 4 minutes |
| 10 | One report, any writer (Java, `checkError`) | Write the code from a skeleton, 4 minutes |
| — | One method, three jobs | Looking ahead to Week 11 (two pages) |

26 PDF pages: 15 frames (title, "Today's revision", "Week 10 in five ideas", Q1–Q10,
Looking ahead, checklist). Each question and Looking ahead has its answer on the
following page.

## Files

| File | What |
| --- | --- |
| `revision-week-10.tex` | The deck. Build: `xelatex revision-week-10.tex`, twice |
| `revision-week-10.pdf` | Built output |
| `revision-week-10-student.pdf` | Student copy: the first click of every slide, so no answers. Built by `python3 scripts/build_student_revisions.py --weeks 10` |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/q02-mcq-append-mode/` | Starts `s.txt` with `old`, runs each of options A–D with `out.println("new")`, and prints what the file then holds |
| `examples/q03-mcq-with-and-exceptions/` | The slide's program |
| `examples/q04-predict-log-file/` | The slide's program, with the lines in `Demo.main`. `overwrite/` makes the second writer `new PrintWriter("log.txt")` (question 2) |
| `examples/q05-predict-quoted-name/` | The slide's program |
| `examples/q06-find-the-bug-report/` | `Report.java` exactly as on the slide (same line numbers); it **does not compile**. `only-compile-fixed/` adds only `throws IOException`, with the slide's test: it prints nothing, because the writer is never closed |
| `examples/q07-find-the-bug-save-twice/` | `main.py` exactly as on the slide (same line numbers); it crashes with `TypeError` |
| `examples/bridge/` | The Looking ahead `ReportJob`, and a complete version of the `MarkList` / `CsvReport` split that the slide sketches with `...`. Both write the same report |
| `solutions/q06-find-the-bug-report/` | The repaired `Report.java`, and `Demo.java` with the slide's test |
| `solutions/q07-find-the-bug-save-twice/` | The repaired program with the slide's test |
| `solutions/c1-report-rows/`, `c2-append-log/`, `c3-report-any-writer/` | The slides' "One answer" for Q8–Q10, each with the slide's test |
| `starters/c1-report-rows/`, `c2-append-log/`, `c3-report-any-writer/` | The Q8–Q10 skeletons exactly as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO`s are done |
| `checks.json` | Every runnable file, with its recorded output, for `scripts/check_revision_slides.py` |

In each Java file that holds a test, the class under test is not `public`, so the class
and its test fit in one file. The class body is the same as on the slide. The slides
for Q4 and Q6 show `main`'s body only; the files wrap it in `public class Demo` with
`import java.io.*;` and `throws IOException`, as the slide comments say. The Q6 test
slide says "then print every line of r.csv"; the files do that with a `BufferedReader`.

Every program that uses a file creates it first in its working directory (`s.txt`,
`r.txt`, `log.txt`, `marks.csv`, `r.csv`, `m.csv`, `app.log`), so each one runs alone
in an empty folder, as the checker runs it.

## Verification

Every output on the slides comes from running these files (Java 8, CPython 3):
16 runnable files are recorded in `checks.json`, including the buggy Q7 program, which
exits with `TypeError: unsupported operand type(s) for +=: 'int' and 'str'`, and Q6's
`only-compile-fixed/`, whose output is empty. The Q9 note ("with `"w"`, or without the
`"\n"`, the first two counts are 1 and 1") was checked by running both changed versions
of the solution.

One file is meant not to compile, so it is not in `checks.json`. It was checked by hand
with `javac --release 8`:

- `examples/q06-find-the-bug-report/Report.java`: `unreported exception IOException; must
  be caught or declared to be thrown`, reported on line 6 (`new FileWriter(f)`). The
  slide's fix is `throws IOException` on line 5.

```sh
python3 scripts/check_revision_slides.py --weeks 10
```

These are new practice questions, not copies of graded labs, assignments or exams.
