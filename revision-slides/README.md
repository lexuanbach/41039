# Programming 1 revision slides

Recap decks in the established HCMUT format, for use before the next lecture.
The slides and classroom questions are in English. Weeks 1–4 remain unchanged.

| Week | Focus | PDF pages, including reveals | Files |
| --- | --- | ---: | --- |
| 1 | Existing revision deck | 43 | [PDF](revision-week-1/revision-week-1.pdf) · [LaTeX](revision-week-1/revision-week-1.tex) |
| 2 | Existing revision deck | 39 | [PDF](revision-week-2/revision-week-2.pdf) · [LaTeX](revision-week-2/revision-week-2.tex) |
| 3 | Existing revision deck | 39 | [PDF](revision-week-3/revision-week-3.pdf) · [LaTeX](revision-week-3/revision-week-3.tex) |
| 4 | Existing revision deck | 46 | [PDF](revision-week-4/revision-week-4.pdf) · [LaTeX](revision-week-4/revision-week-4.tex) |
| 5 | Classes, objects, static, enums and switch (question format) | 34 | [PDF](revision-week-5/revision-week-5.pdf) · [LaTeX](revision-week-5/revision-week-5.tex) |
| 6 | Building reliable classes: contracts, references, shared data (question format) | 26 | [PDF](revision-week-6/revision-week-6.pdf) · [LaTeX](revision-week-6/revision-week-6.tex) |
| 7 | Lists and generics: insert/set/remove by index, `remove(int)` vs `remove(Object)`, removing while looping, linked nodes and queues, `Box<T>` and boxing; extra linked-list predict and find-the-bug questions (Q11–Q14) | 34 | [PDF](revision-week-7/revision-week-7.pdf) · [LaTeX](revision-week-7/revision-week-7.tex) |
| 8 | Inheritance and interfaces: `extends`/`super`, overriding vs overloading, declared type vs object, abstract classes, interfaces and composition, Python `super()` and duck typing | 26 | [PDF](revision-week-8/revision-week-8.pdf) · [LaTeX](revision-week-8/revision-week-8.tex) |
| 9 | Exceptions and reading text: try/catch/finally, checked vs unchecked and `throws`, propagation, `readLine()`/`null` vs blank lines, Python `with`, `Scanner` tokens | 26 | [PDF](revision-week-9/revision-week-9.pdf) · [LaTeX](revision-week-9/revision-week-9.tex) |
| 10 | Writing files and reliable reports: `print`/`println` and newlines, overwrite vs append, closing with try-with-resources/`with`, `IOException` and `checkError`, CSV quoting | 26 | [PDF](revision-week-10/revision-week-10.pdf) · [LaTeX](revision-week-10/revision-week-10.tex) |
| 11 | Designing OO programs: responsibilities and Information Expert, depending on an interface, safe substitution (Liskov), focused interfaces, cohesion/coupling, DRY/YAGNI | 26 | [PDF](revision-week-11/revision-week-11.pdf) · [LaTeX](revision-week-11/revision-week-11.tex) |
| 12 | Review and integration: tracing, mutation vs rebinding, a parse/validate/store pipeline, boundary tests; streams as optional enrichment | 26 | [PDF](revision-week-12/revision-week-12.pdf) · [LaTeX](revision-week-12/revision-week-12.tex) |

## Weeks 5–12: question format

Weeks 5–12 follow the question format of the CO1005 revision decks: short questions, each
answered on the next click, then a bridge to the next lecture and a checklist. Every deck is
hand-written; see each folder's README for its question table and verification notes.

- **Week 5:** ten short questions (fill the blanks, what each line holds, a trace table,
  predict the output, which of these work, spot four planted errors, a pair activity and
  a style comparison), then three coding questions.
- **Weeks 6–12:** an overview slide and a one-slide summary of the week ("in five ideas"),
  then ten questions of five kinds: 1 fill in the blanks, 2 multiple choice, 2 predict the
  output, 2 find the bug (Java and Python) and 3 write the code from a skeleton. About
  35 minutes. Week 12's bridge is about preparing for the final assessment.

Folders include the editable `.tex`, original logo, compiled PDF, and complete runnable
programs for every slide listing: `examples/` (with the intentionally faulty files, at the
same line numbers as the slides), `solutions/`, `starters/` (skeletons that compile and run
with the slide's test) and `checks.json` (every recorded run).
`content/revision-template.tex` and `content/bk-logo.png` preserve the shared template;
`content/revisions.json` is the source of the earlier generated Week 7–12 decks, kept for
reference only.

The Week 5 switch-expression answer needs Java 14 and says so. Week 12 labels
functional transformations and streams as optional enrichment. The remaining
Java exercises target Java 8. Current Canvas instructions govern assessment.

The [complete Weeks 5–12 ZIP](revision-weeks-5-12.zip) includes all eight packages,
the shared authoring source and both scripts.

Requirements: Python 3, a JDK supporting releases 8, 14 and 21 (JDK 21+), and
XeLaTeX with the packages used by the existing Beamer template. If needed, set
`JAVA_BIN` and `JAVAC_BIN` to your JDK executables.

To compile one deck, run XeLaTeX twice from its week directory. To verify the recorded
runs of Weeks 5–12, from the repository root:

```sh
python3 scripts/check_revision_slides.py
```

`scripts/build_revision_slides.py` generated the earlier Week 7–12 decks; it now refuses
to overwrite the hand-written decks. Complete programs remain in the package even where a
slide omits a main wrapper.
Each debugging slide retains the exact line numbers of its intentionally faulty file.
