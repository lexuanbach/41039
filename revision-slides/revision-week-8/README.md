# Revision of Week 8: Inheritance and interfaces

Recap for the start of the next lecture, using the same HCMUT Beamer template,
logo, blue headings, question/answer boxes and individual-then-team structure as
revision Week 4. The teaching language remains English.

- **Individual questions:** 6, with answers revealed after a pause.
- **Team rounds:** draw the model, spot two faulty programs, predict two programs,
  then write and test matching Java/Python solutions.
- **Timing:** about 45-55 minutes. For a shorter session, use four individual
  questions, one debugging question and the final keyboard challenge.
- **Scope:** Week 8 sections 01-04. No sealed-class question depends on the empty Ed lesson.

## Files

- `revision-week-8.pdf`: compiled deck.
- `revision-week-8.tex` and `bk-logo.png`: editable source and the original logo.
- `Broken.java` and `broken.py`: intentionally faulty programs, exactly as on the
  numbered debugging slides. Python may stop at its first error.
- The other root `.java`/`.py` files are the keyboard-challenge starters.
- `solutions/`: repaired debugging programs and complete challenge solutions.
- `examples/`: complete individual, draw and prediction programs. Each Java
  question has its own folder so repeated class names never collide.
- `checks.json`: recorded inputs and actual program outcomes for repeatable checks.

## Teaching notes

The declared type permits speak(). Each actual object selects the overridden instance method. b aliases a, so no third animal is created.

For each debugging question, ask the group to propose a counterexample as well as a
repair. A first failure may hide a later one. The answers distinguish a correct
return value from correct state and a syntactically valid format from valid data.

Current Canvas instructions remain authoritative for assessment. These revision
tasks are newly authored practice, not copies of graded labs, assignments or exams.

## Build and verify

From this folder, run `xelatex revision-week-8.tex` twice. From the repository root:

```sh
python3 scripts/build_revision_slides.py --weeks 8
python3 scripts/check_revision_slides.py --weeks 8
```

All displayed program results and challenge outputs are derived from native runs,
using a matching Java release and CPython. The intentionally wrong programs may
return a nonzero status. See `checks.json` for the exact observed outcomes.
Some slide excerpts omit only the `Demo.main` wrapper; the complete program is
always present in the corresponding example or solution file. Debug listings
retain their exact root-file line numbers.
