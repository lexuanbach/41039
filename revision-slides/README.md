# Programming 1 revision slides

Recap decks in the established HCMUT format, for use before the next lecture.
The slides and classroom questions are in English. Weeks 1–4 remain unchanged.

| Week | Focus | PDF pages, including reveals | Files |
| --- | --- | ---: | --- |
| 1 | Existing revision deck | 43 | [PDF](revision-week-1/revision-week-1.pdf) · [LaTeX](revision-week-1/revision-week-1.tex) |
| 2 | Existing revision deck | 39 | [PDF](revision-week-2/revision-week-2.pdf) · [LaTeX](revision-week-2/revision-week-2.tex) |
| 3 | Existing revision deck | 39 | [PDF](revision-week-3/revision-week-3.pdf) · [LaTeX](revision-week-3/revision-week-3.tex) |
| 4 | Existing revision deck | 46 | [PDF](revision-week-4/revision-week-4.pdf) · [LaTeX](revision-week-4/revision-week-4.tex) |
| 5 | Classes, objects and enums | 43 | [PDF](revision-week-5/revision-week-5.pdf) · [LaTeX](revision-week-5/revision-week-5.tex) |
| 6 | Building reliable classes | 36 | [PDF](revision-week-6/revision-week-6.pdf) · [LaTeX](revision-week-6/revision-week-6.tex) |
| 7 | Lists and generics | 36 | [PDF](revision-week-7/revision-week-7.pdf) · [LaTeX](revision-week-7/revision-week-7.tex) |
| 8 | Inheritance and interfaces | 37 | [PDF](revision-week-8/revision-week-8.pdf) · [LaTeX](revision-week-8/revision-week-8.tex) |
| 9 | Exceptions and reading text | 36 | [PDF](revision-week-9/revision-week-9.pdf) · [LaTeX](revision-week-9/revision-week-9.tex) |
| 10 | Writing files and reliable reports | 36 | [PDF](revision-week-10/revision-week-10.pdf) · [LaTeX](revision-week-10/revision-week-10.tex) |
| 11 | Designing object-oriented programs | 36 | [PDF](revision-week-11/revision-week-11.pdf) · [LaTeX](revision-week-11/revision-week-11.tex) |
| 12 | Review and integration | 41 | [PDF](revision-week-12/revision-week-12.pdf) · [LaTeX](revision-week-12/revision-week-12.tex) |

## Weeks 5–12

Each package has individual prediction questions with answer reveals, then four
team rounds: draw the model, spot errors in Java and Python, predict two programs,
and implement/test a shared coding task. Plan approximately 45–55 minutes.

Folders include the editable `.tex`, original logo, compiled PDF, full runnable
examples, faulty programs, starter files, solutions and recorded test cases.
`content/revisions.json` is the editable authoring source for the new decks.
`content/revision-template.tex` and `content/bk-logo.png` preserve the shared template.
The Python build/check scripts live in the repository's `scripts/` directory.

Java 14/21 questions in Week 5 state their version requirement. Week 12 labels
functional transformations and streams as optional enrichment. The remaining
Java exercises target Java 8. Current Canvas instructions govern assessment.

The [complete Weeks 5–12 ZIP](revision-weeks-5-12.zip) includes all eight packages,
the shared authoring source and both scripts.

Requirements: Python 3, a JDK supporting releases 8, 14 and 21 (JDK 21+), and
XeLaTeX with the packages used by the existing Beamer template. If needed, set
`JAVA_BIN` and `JAVAC_BIN` to your JDK executables.

To compile one deck directly, run XeLaTeX twice from its week directory. To build
or verify all new packages from the repository root:

```sh
python3 scripts/build_revision_slides.py
python3 scripts/check_revision_slides.py
```

A layout-only rebuild may use `--reuse-checks`. This reuses a measured output only
when source, language, compiler release and standard input match an existing case.
Complete programs remain in the package even where a slide omits a main wrapper.
Each debugging slide retains the exact line numbers of its intentionally faulty file.
