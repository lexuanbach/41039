# Weeks 6–12 authoring notes

`weeks-6-12.json` is the editable source for the seven later week pages. The checked-in
HTML and per-week JavaScript files work directly on GitHub Pages; visitors do not run a build.

The topic sequence was checked against the **Canvas course 42626 Subject Schedule** and
the lessons in **Ed course 41298** on 27 October 2026. The Canvas schedule still contains
2025 dates. Its topic sequence informed this extension; its old dates and assessment
deadlines were not imported.

| Website week | Teaching focus | Ed basis |
| --- | --- | --- |
| 6 | Reliable classes; consolidation of material introduced in Week 5 | Classes and Objects in Java/Python; OOP fundamentals |
| 7 | ArrayList, LinkedList, generics, List | Lessons 118753–118755 and 118763 |
| 8 | Inheritance, dispatch, interfaces, composition | Lessons 118759, 118761–118763 |
| 9 | Exceptions, reading tokens and lines | Lessons 118768–118770 |
| 10 | File output, resource lifetime, report formats | Lessons 118769–118770; Python CSV/JSON references |
| 11 | Responsibility assignment, SOLID, GRASP, DRY, YAGNI | Lessons 118778–118781 |
| 12 | Integration and review; optional functional preview | Earlier material; optional lessons 118789–118790 |

The Ed lesson named **Sealed Classes in Java (118760)** currently has no slides, so it
was not represented as a completed teaching source. Historical lecture archives were
not treated as additional current course weeks. Labs, code-comprehension assessments,
programming assignments and exams were not copied into the public practice material.
The website's examples, questions and exercises are newly authored.

Technical corrections applied when adapting the readings:

- `BufferedReader.ready()` measures readiness, not EOF; use `readLine() != null`.
- Python's method is `readline()`, not `readLine()`.
- Generic type checking occurs at compile time. A static method can declare its own
  type parameter, even though it cannot use the containing class's type parameter.
- Interface constants/default methods and Python's full MRO need qualifications beyond
  introductory shorthand.

Run from the repository root after editing the content:

```sh
python3 scripts/check_week_content.py --refresh
python3 scripts/build_week_pages.py
python3 bump.py
python3 scripts/check_week_content.py
python3 bump.py --check
```

The checker compiles Java with this repository's ECJ jar using `-1.8`, runs Java/Python
examples and every exercise solution in separate working directories, and derives
expected stdout. `JAVA_BIN` can select an installed JDK. The real-file examples run in
temporary test directories; the file versions are labelled for Ed and the page supplies
portable memory-stream counterparts. Browser QA must still exercise Run/Edit, tabs,
quiz grading, exercises, themes and the narrow-screen course navigation.

Validation of this extension:

- 243 native program executions passed, including 145 exercise test cases. Java was
  compiled with the site's ECJ jar, and Python ran on CPython 3.14.
- All 14 HTML pages passed local file/fragment, unique-ID and tab-control checks.
  All 112 code-explanation ranges are present and non-overlapping. Asset hashes match.
- Browser checks covered rendering all seven new pages, Python Run/Edit, editor colours,
  a Python exercise (4/4 tests), quiz grading (12/12 with explanations), keyboard section
  navigation, and the 390px course menu/editor layout without horizontal page overflow.
- The existing CheerpJ browser runtime remained at “Running” in two Java attempts in
  this session. Native Java output checks passed; in-browser Java execution is therefore
  not claimed as verified. `runtime.js` and the runtime dependencies were not changed.
