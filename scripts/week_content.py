"""Load and save the editable sources of the Week 6-12 pages: one file per week in content/weeks/.

One file per week lets each week be edited (and checked or rebuilt with --weeks) on its own.
"""
from pathlib import Path
import json
import os
import tempfile

ROOT = Path(__file__).resolve().parents[1]
WEEKS_DIR = ROOT / 'content/weeks'


def week_path(n):
    return WEEKS_DIR / f'week-{n}.json'


def load_weeks(only=None):
    """All weeks in order, or only the week numbers listed in `only`."""
    files = sorted(WEEKS_DIR.glob('week-*.json'), key=lambda p: int(p.stem.split('-')[1]))
    weeks = [json.loads(p.read_text()) for p in files]
    return [w for w in weeks if not only or w['week'] in only]


def save_week(w):
    """Write atomically, so a reader never sees a half-written file."""
    path = week_path(w['week'])
    fd, tmp = tempfile.mkstemp(dir=path.parent, suffix='.tmp')
    with os.fdopen(fd, 'w') as f:
        f.write(json.dumps(w, indent=2) + '\n')
    os.replace(tmp, path)
