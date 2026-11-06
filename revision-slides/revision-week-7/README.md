# Revision of Week 7 — 41039 Programming 1

A recap of Week 7 (lists and generics: `ArrayList` and Python lists, inserting, replacing
and removing by index, `remove(int)` versus `remove(Object)`, removing safely while
looping, linked nodes and queues, type parameters such as `Box<T>`, `Integer` versus
`int`, and programming to `List`), shown at the start of the next lecture. After a
one-slide summary of the week ("Week 7 in five ideas"), it asks ten questions of five
kinds: 1 fill in the blanks, 2 multiple choice, 2 predict the output, 2 find the bug and
3 write the code. Four more linked-list questions follow (Q11–Q14: 2 predict the output,
2 find the bug), for the hand-built nodes and queues of the last lecture. Students answer
each one alone first and the answer appears on the next click. A bridge to Week 8 and a
checklist close the deck. Plan about 50 minutes, or about 35 without Q11–Q14.

| # | Question | Format |
| --- | --- | --- |
| 1 | Indexes, nodes and type parameters | Fill in the blanks (word bank of 10, 6 blanks) |
| 2 | Which loop removes every negative? | Multiple choice, three versions (answer C: versions 2 and 3) |
| 3 | Which line does not compile? (`Box<T>`) | Multiple choice (answer C: `b.set("7");`) |
| 4 | Insert, set and remove (Java) | Predict the output, then explain why `get(size())` fails |
| 5 | A chain of nodes (Python) | Predict the output, then name the node that is cut out |
| 6 | The mark book (Java) | Find the bug: 4 bugs, one of them a compile error |
| 7 | The basket (Python) | Find the bug: 3 bugs; the program crashes as given |
| 8 | The last few, for any type: `Recent<T>` (Java) | Write the code from a skeleton, 4 minutes |
| 9 | A help-desk queue with `deque` (Python) | Write the code from a skeleton, 4 minutes |
| 10 | A queue of linked nodes (Java) | Write the code from a skeleton, 4 minutes |
| 11 | Splice the nodes (Java) | Predict the output, then explain why `p = new Node(7, null)` does not join the list |
| 12 | Who holds the new head? (Python) | Predict the output, then say where the ignored `push_front` node went |
| 13 | The linked queue (Java) | Find the bug: 3 bugs (`tail` never moves, `tail` not reset when emptied, `size()` stops one node early); crashes as given |
| 14 | The chain (Python) | Find the bug: 3 bugs (`add_last` walks past the end, `remove` relinks to the same node and ignores the head); crashes as given |
| — | One method, two kinds of list | Looking ahead to Week 8 (two pages) |

34 PDF pages: 19 frames (title, "Today's revision", "Week 7 in five ideas", Q1–Q14,
Looking ahead, checklist). Each question and Looking ahead has its answer on the
following page.

## Files

| File | What |
| --- | --- |
| `revision-week-7.tex` | The deck. Build: `xelatex revision-week-7.tex`, twice |
| `revision-week-7.pdf` | Built output |
| `bk-logo.png` | Required next to the `.tex` |
| `examples/ideas/` | The listing on "Week 7 in five ideas" |
| `examples/q02-mcq-safe-removal/` | The three loops, each run on a fresh `[4, -1, -2, 5]` |
| `examples/q03-mcq-which-line-fails/` | `Demo.java` runs options A, B and D. `option-c/Demo.java` adds option C and **does not compile** |
| `examples/q04-predict-list-indexes/` | The slide's program, and `get-at-size/` which adds `xs.get(xs.size())` and crashes with `IndexOutOfBoundsException` |
| `examples/q05-predict-linked-nodes/` | The slide's program |
| `examples/q06-find-the-bug-mark-book/` | `MarkBook.java` exactly as on the slide (same line numbers); it **does not compile**. `only-line-10-fixed/` removes only the compile error, so the logic bugs show |
| `examples/q07-find-the-bug-basket/` | `main.py` exactly as on the slide (same line numbers); it crashes with `TypeError` |
| `examples/q11-predict-splice-nodes/`, `q12-predict-push-front/` | The Q11 and Q12 programs (Q12's `main.py` has the slide's line numbers) |
| `examples/q13-find-the-bug-linked-queue/` | `Demo.java`: lines 1–23 exactly as on the slide, then the test. Prints `An 0`, then `NullPointerException`. `only-line-10-fixed/` prints `An 1`, `Mai Tuan`, then crashes |
| `examples/q14-find-the-bug-chain/` | `main.py`: lines 1–21 exactly as on the slide (plus the correct `values()`, lines 22–27), then the test. Crashes with `AttributeError` adding `"b"`; `only-line-13-fixed/` crashes on `remove("a")` |
| `examples/bridge/` | The Looking ahead program (`total(List<Integer>)` with an `ArrayList` and a `LinkedList`) |
| `solutions/q06-find-the-bug-mark-book/` | The repaired `MarkBook.java`, and `Demo.java` with the slide's test |
| `solutions/q07-find-the-bug-basket/` | The repaired basket program with the slide's test |
| `solutions/q13-find-the-bug-linked-queue/`, `q14-find-the-bug-chain/` | The repaired programs with the slide's test (`An 2 / Mai Tuan / Linh 0` and `['b', 'd']`) |
| `solutions/c1-recent/`, `c2-help-desk/`, `c3-linked-queue/` | Complete answers for Q8–Q10, each with the slide's test. The slides show only the two `TODO` methods; their bodies match these files |
| `starters/c1-recent/`, `c2-help-desk/`, `c3-linked-queue/` | The Q8–Q10 skeletons exactly as on the slides, each with the slide's test. They compile and run as given, so students can run the test at once and watch it fail until the `TODO`s are done |
| `checks.json` | Every runnable file, with its recorded output, for `scripts/check_revision_slides.py` |

In each Java file that holds a test, the class under test is not `public`, so the class
and its test fit in one file. The class body is the same as on the slide.

## Verification

Every output on the slides comes from running these files (Java 8, CPython 3):
25 runnable files are recorded in `checks.json`. Seven of them stop with an error, as the
slides say: the buggy Q13 and Q14 programs and their `only-line-…-fixed` versions, and `q04-predict-list-indexes/get-at-size` (`IndexOutOfBoundsException: Index 2
out of bounds for length 2`), `q06-find-the-bug-mark-book/only-line-10-fixed` (prints
`true false`, then `IndexOutOfBoundsException: Index 3 out of bounds for length 3`) and
the buggy Q7 program (`TypeError: 'str' object cannot be interpreted as an integer`).

Two files are meant not to compile, so they are not in `checks.json`. Each was checked
by hand with `javac --release 8`:

- `examples/q03-mcq-which-line-fails/option-c/Demo.java`: `incompatible types: String
  cannot be converted to Integer` (on the `b.set("7");` line).
- `examples/q06-find-the-bug-mark-book/MarkBook.java`: `incompatible types: Integer
  cannot be converted to boolean`, reported on line 10 (`return marks.remove(m);`),
  which is also the line to fix.

Two further claims were checked by hand and are not files here: `Box<int>` fails with
`unexpected type` (the "five ideas" point that a type argument must be a class), and the Q10
answer without `if (head == null) tail = null;` prints `5 2`, `6 7 0`, then stops with a
`NullPointerException`.

```sh
python3 scripts/check_revision_slides.py --weeks 7
```

These are new practice questions, not copies of graded labs, assignments or exams.
