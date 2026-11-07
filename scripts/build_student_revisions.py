"""Build the student copies of the revision decks: the same slides with no answers.

Every question slide shows its answer on the second click (overlay 2), and the "Looking ahead"
slide shows its answer after a pause. So the student copy keeps only the first overlay of every
frame. The title page says "Student copy: questions only" and the overview no longer promises
that the answer appears on the next click.

    python3 scripts/build_student_revisions.py            # Weeks 8-12
    python3 scripts/build_student_revisions.py --weeks 9  # one week

Writes revision-slides/revision-week-N/revision-week-N-student.pdf. Needs xelatex (with
pdfpages) and pdftotext.
"""
from pathlib import Path
import argparse
import re
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
DECKS = ROOT / 'revision-slides'

EDITS = [
    (re.compile(r'(\\subtitle\{[^\n]*?)\}\n'), r'\1\\\\[0.3em]{\\normalfont\\small Student copy: questions only}}\n'),
    (re.compile(r'\\item The answer appears on the \\textbf\{next click\}\.'),
     r'\\item We go through the answers in the lecture.'),
]


def run(cmd, cwd):
    r = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, timeout=300)
    if r.returncode:
        raise SystemExit(f'{" ".join(cmd)} failed in {cwd}:\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}')
    return r.stdout


def page_count(pdf):
    out = run(['pdfinfo', str(pdf)], pdf.parent)
    return int(re.search(r'^Pages:\s+(\d+)', out, re.M).group(1))


def first_overlays(pdf):
    """The first page of every frame, read from the footer's 'frame/total' counter."""
    keep, seen = [], set()
    for page in range(1, page_count(pdf) + 1):
        text = run(['pdftotext', '-f', str(page), '-l', str(page), '-layout', str(pdf), '-'], pdf.parent)
        m = re.findall(r'(\d+)/(\d+)\s*$', text.strip())
        frame = m[-1][0] if m else f'page{page}'
        if frame not in seen:
            seen.add(frame)
            keep.append(page)
    return keep


def build(n):
    folder = DECKS / f'revision-week-{n}'
    stem = f'revision-week-{n}'
    src = (folder / f'{stem}.tex').read_text()
    for pattern, repl in EDITS:
        src, count = pattern.subn(repl, src, count=1)
        if count != 1:
            raise SystemExit(f'Week {n}: could not apply {pattern.pattern}')
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        shutil.copy(folder / 'bk-logo.png', tmp)
        (tmp / 'full.tex').write_text(src)
        for _ in range(2):
            run(['xelatex', '-interaction=nonstopmode', '-halt-on-error', 'full.tex'], tmp)
        pages = first_overlays(tmp / 'full.pdf')
        (tmp / 'student.tex').write_text(
            '\\documentclass{article}\n\\usepackage{pdfpages}\n\\begin{document}\n'
            f'\\includepdf[pages={{{",".join(map(str, pages))}}},fitpaper]{{full.pdf}}\n'
            '\\end{document}\n')
        run(['xelatex', '-interaction=nonstopmode', '-halt-on-error', 'student.tex'], tmp)
        out = folder / f'{stem}-student.pdf'
        shutil.copy(tmp / 'student.pdf', out)
        total = page_count(tmp / 'full.pdf')
    text = run(['pdftotext', str(out), '-'], folder)
    leaks = [w for w in ('Answer:', 'Answers', 'One answer', 'Common wrong answer') if w in text]
    if leaks:
        raise SystemExit(f'Week {n}: the student copy still contains {leaks}')
    print(f'Week {n}: {len(pages)} slides (from {total} pages) -> {out.relative_to(ROOT)}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--weeks', type=int, nargs='+', default=[8, 9, 10, 11, 12])
    for n in ap.parse_args().weeks:
        build(n)


if __name__ == '__main__':
    main()
