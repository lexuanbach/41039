# Revision of Week 8 — 41039 Programming 1

A recap of Week 8 (inheritance and interfaces: `extends` and `super`, overriding versus
overloading, declared type versus object, abstract classes, interfaces, composition, and
Python inheritance with duck typing), shown at the start of the next lecture. After a
one-slide summary of the week ("Week 8 in five ideas"), it asks ten questions of five
kinds: 1 fill in the blanks, 2 multiple choice, 2 predict the output, 2 find the bug and
3 write the code. Students answer each one alone first and the answer appears on the next
click. A bridge to Week 9 and a checklist close the deck. Plan about 35 minutes.

| # | Question | Format |
| --- | --- | --- |
| 1 | `extends`, `super`, overriding, overloading, `abstract`, duck typing | Fill in the blanks (word bank of 10, 6 blanks) |
| 2 | Which line does not compile? (`Pet p = new Cat(...)`) | Multiple choice (answer C: `p.purr();`, because the declared type `Pet` has no `purr`) |
| 3 | Overloading or overriding? (`Vet.check(pet)`) | Multiple choice (answer B: `animal woof`) |
| 4 | Bikes and vehicles (Java, constructor chaining and `super.info()`) | Predict the output, then say why deleting `super(2);` breaks compilation |
| 5 | Lamps and a fan (Python, `super()` and duck typing) | Predict the output, then rename `Fan.status` and say what happens |
| 6 | Cinema tickets (Java, interface and subclass) | Find the bug: 4 bugs, one of them a compile error |
| 7 | Staff pay (Python) | Find the bug: 3 bugs; the program crashes as given |
| 8 | A toll gate (Java, abstract class) | Write the code from a skeleton, 4 minutes |
| 9 | An account with a fee (Python, `super().withdraw`) | Write the code from a skeleton, 4 minutes |
| 10 | Greeters (Java, interface and composition) | Write the code from a skeleton, 4 minutes |
| — | When the input is not a number | Looking ahead to Week 9 (two pages) |

26 PDF pages: 15 frames (title, "Today's revision", "Week 8 in five ideas", Q1–Q10,
Looking ahead, checklist). Each question and Looking ahead has its answer on the
following page.

## Files

| File | What |
| --- | --- |
| `revision-week-8.tex` | The deck. Build: `xelatex revision-week-8.tex`, twice |
| `revision-week-8.pdf` | Built output |
| `revision-week-8-student.pdf` | Student copy: the first click of every slide, so no answers. Built by `python3 scripts/build_student_revisions.py --weeks 8` |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/five-ideas/` | The "five ideas" listing (`Priced`, `Item`, `Book`) with a `main` |
| `examples/q02-mcq-which-line-fails/` | `Demo.java` runs options A, B and D. `option-c/Demo.java` adds option C and **does not compile** |
| `examples/q03-mcq-overload-or-override/` | The slide's program, with the "in main" lines in `Demo.main` |
| `examples/q04-predict-vehicles/` | The slide's program. `no-super/Demo.java` has `super(2);` deleted and **does not compile** |
| `examples/q05-predict-devices/` | The slide's program, and `renamed/` with `Fan.status` renamed to `power` (stops with `AttributeError`) |
| `examples/q06-find-the-bug-tickets/` | `Ticket.java` exactly as on the slide (same line numbers); it **does not compile**. `only-line-5-fixed/` removes only the compile error, so the logic bugs show (it prints `Dune $15`, then `StackOverflowError`) |
| `examples/q07-find-the-bug-staff/` | `main.py` exactly as on the slide (same line numbers); it crashes with `AttributeError`. `only-line-12-fixed/` and `lines-12-13-fixed/` back the answer's claims about the other two bugs |
| `examples/bridge/` | The Looking ahead program (crashes with `NumberFormatException`), and `fixed/` with the `try`/`catch` loop |
| `solutions/q06-find-the-bug-tickets/` | The repaired `Ticket.java`, and `Demo.java` with the slide's test |
| `solutions/q07-find-the-bug-staff/` | The repaired staff program with the slide's test |
| `solutions/c1-toll-gate/`, `c2-fee-account/`, `c3-greeters/` | The slides' "One answer" for Q8–Q10, each with the slide's test |
| `starters/c1-toll-gate/`, `c2-fee-account/`, `c3-greeters/` | The Q8–Q10 skeletons exactly as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO`s are done |
| `checks.json` | Every runnable file, with its recorded output, for `scripts/check_revision_slides.py` |

In each Java file that holds a test, the classes under test are not `public`, so the
classes and their test fit in one file. The class bodies are the same as on the slide.

## Verification

Every output on the slides comes from running these files (Java 8, CPython 3):
20 runnable files are recorded in `checks.json`, including the ones that stop with an
error on purpose (the Q5 rename, the Q6 and Q7 partial fixes, the buggy Q7 program and
the Looking ahead program).

Three files are meant not to compile, so they are not in `checks.json`. Each was checked
by hand with `javac --release 8`:

- `examples/q02-mcq-which-line-fails/option-c/Demo.java`: `cannot find symbol`
  (`symbol: method purr()`, `location: variable p of type Pet`).
- `examples/q04-predict-vehicles/no-super/Demo.java`: `constructor Vehicle in class
  Vehicle cannot be applied to given types;`. javac reports it on the `Bike() {` line,
  because Java inserts `super()` there.
- `examples/q06-find-the-bug-tickets/Ticket.java`: `price() in Ticket cannot implement
  price() in Priced` / `attempting to assign weaker access privileges; was public`, on
  line 5.

`solutions/q06-find-the-bug-tickets/Ticket.java` compiles but has no `main`; its test is
in `Demo.java` next to it.

```sh
python3 scripts/check_revision_slides.py --weeks 8
```

These are new practice questions, not copies of graded labs, assignments or exams.
