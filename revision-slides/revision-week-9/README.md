# Revision of Week 9 — 41039 Programming 1

A recap of Week 9 (exceptions and reading text: `try`/`catch`/`finally`, catching the
exact exception, checked versus unchecked, `throw`/`raise` and propagation, stack
traces, `Scanner` tokens, `readLine()` and end of input, Python `with`/`for line in f`),
shown at the start of the next lecture. After a one-slide summary of the week ("Week 9
in five ideas"), it asks ten questions of five kinds: 1 fill in the blanks, 2 multiple
choice, 2 predict the output, 2 find the bug and 3 write the code. Students answer each
one alone first and the answer appears on the next click. A bridge to Week 10 and a
checklist close the deck. Plan about 35 minutes.

| # | Question | Format |
| --- | --- | --- |
| 1 | Checked/unchecked, `finally`, `with`, end of input | Fill in the blanks (word bank of 10, 6 blanks) |
| 2 | Which `main` compiles? (`firstLine` declares `throws IOException`) | Multiple choice (answer C: add `throws IOException` to `main`) |
| 3 | Which `readLine()` loops read every line? | Multiple choice, three versions (answer B: versions 1 and 3) |
| 4 | Marks through method calls (Java) | Predict the output (`finally`, an exception passing through `total` to `main`), then add one `catch` |
| 5 | A file of marks (Python) | Predict the output (blank line, bad mark, last line without `\n`), then name the two failing statements |
| 6 | The mark reader (Java, `BufferedReader`) | Find the bug: 4 bugs, one of them a compile error |
| 7 | Average of a file (Python) | Find the bug: 3 bugs; the program crashes with a stack trace |
| 8 | Parse a mark or say why (Java) | Write the code from a skeleton (`throw` with a message), 4 minutes |
| 9 | Ask again until it is valid (Python, `input()`, `EOFError`) | Write the code from a skeleton, 4 minutes |
| 10 | Add up the numbers (Java, `Scanner` tokens) | Write the code from a skeleton, 4 minutes |
| — | From reading marks to saving a report | Looking ahead to Week 10 (two pages) |

26 PDF pages: 15 frames (title, "Today's revision", "Week 9 in five ideas", Q1–Q10,
Looking ahead, checklist). Each question and Looking ahead has its answer on the
following page.

## Files

| File | What |
| --- | --- |
| `revision-week-9.tex` | The deck. Build: `xelatex revision-week-9.tex`, twice |
| `revision-week-9.pdf` | Built output |
| `revision-week-9-student.pdf` | Student copy: the first click of every slide, so no answers. Built by `python3 scripts/build_student_revisions.py --weeks 9` |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/q02-mcq-which-main-compiles/` | `option-a/`, `option-b/`, `option-d/`: the three versions of `main` that **do not compile**. `option-c/` compiles and first creates its own `notes.txt`. `option-c-missing-file/` is option C with no file: it stops with a `FileNotFoundException` stack trace |
| `examples/q03-mcq-read-every-line/` | The three loops, each on its own reader over `"tea\n\ncoffee"`, printing each line in `[ ]` |
| `examples/q04-predict-marks-through-calls/` | The slide's program, and `catch-both/` with the extra `catch (IllegalArgumentException e)` from part 2 |
| `examples/q05-predict-a-marks-file/` | The slide's program (it writes its own `marks.txt`), and `why/`, which prints the two `ValueError` messages and shows a final `\n` adds no line |
| `examples/q06-find-the-bug-mark-reader/` | `MarkReader.java` exactly as on the slide (same line numbers); it **does not compile**. `only-compile-error-fixed/` adds only `throws IOException`, so the logic bugs show (prints `50`) |
| `examples/q07-find-the-bug-average/` | `main.py` exactly as on the slide (same line numbers); it makes its own files and crashes with `ZeroDivisionError` |
| `examples/bridge/` | Looking ahead: `Demo.java` reads, then writes `report.txt` and reads it back before and after `close()` (0, then 2 lines). `main.py` shows `write()` adds no newline |
| `solutions/q06-find-the-bug-mark-reader/` | The repaired `MarkReader.java`, and `Demo.java` with the slide's test |
| `solutions/q07-find-the-bug-average/` | The repaired program with the slide's test |
| `solutions/c1-parse-mark/`, `c2-ask-again/`, `c3-add-the-numbers/` | The slides' "One answer" for Q8–Q10, each with the slide's test |
| `starters/c1-parse-mark/`, `c2-ask-again/`, `c3-add-the-numbers/` | The Q8–Q10 skeletons exactly as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO` is done. Q9 reads `abc`, `42`, `7`, `x` from standard input |
| `checks.json` | Every runnable file, with its recorded input and output, for `scripts/check_revision_slides.py` |

In each Java file that holds a test, the class under test is not `public`, so the class
and its test fit in one file. The class body is the same as on the slide. Every program
that reads a file creates that file itself (or reads from a string or standard input),
so it runs alone in an empty folder.

## Verification

Every output on the slides comes from running these files (Java 8 via `--release 8`,
CPython 3): 19 runnable files are recorded in `checks.json`, including the buggy Q7
program (exits with `ZeroDivisionError: division by zero`) and the Q2 option C run with
no input file (exits with `java.io.FileNotFoundException: notes.txt (No such file or
directory)`).

Four files are meant not to compile, so they are not in `checks.json`. Each was checked
by hand with `javac --release 8`:

- `examples/q02-mcq-which-main-compiles/option-a/Demo.java` (line 9),
  `option-b/Demo.java` (line 10) and `option-d/Demo.java` (line 10):
  `unreported exception IOException; must be caught or declared to be thrown`.
- `examples/q06-find-the-bug-mark-reader/MarkReader.java`: `unreported exception
  IOException; must be caught or declared to be thrown`. javac reports it on line 7
  (`in.readLine()`); the fix is on line 3 (add `throws IOException` to `sumMarks`).

```sh
python3 scripts/check_revision_slides.py --weeks 9
```

These are new practice questions, not copies of graded labs, assignments or exams.
