#!/usr/bin/env python3
"""Stamp every local CSS/JS link with a content hash, to defeat browser caching.

GitHub Pages serves assets with `cache-control: max-age=600` and no versioning.
Ship new markup plus a changed stylesheet and a returning visitor can get the new
HTML with a stale CSS for up to ten minutes — the page renders unstyled.

Appending ?v=<hash of the file> makes the URL change whenever the file does, so
the browser is forced to refetch. Idempotent: run it before every commit that
touches assets/.

Usage:  python3 bump.py [--check]
        --check exits 1 if anything is out of date (for CI), changing nothing.
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
ASSET = re.compile(r'(?P<attr>href|src)="(?P<path>[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"')


def digest(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


def main() -> int:
    check_only = "--check" in sys.argv
    stale = changed = 0

    for page in sorted(ROOT.rglob("*.html")):
        if page.name.startswith("_") or ".git" in page.parts:
            continue
        text = original = page.read_text(encoding="utf-8")

        def stamp(m: re.Match) -> str:
            nonlocal stale
            rel = m.group("path")
            target = (page.parent / rel).resolve()
            if not target.is_file():
                return m.group(0)          # external or missing: leave alone
            new = f'{m.group("attr")}="{rel}?v={digest(target)}"'
            if new != m.group(0):
                stale += 1
            return new

        text = ASSET.sub(stamp, text)
        if text != original:
            changed += 1
            if not check_only:
                page.write_text(text, encoding="utf-8")
        print(f"  {'stale' if text != original else 'ok   '}  {page.relative_to(ROOT)}")

    if check_only:
        print(f"\n{stale} asset link(s) out of date in {changed} file(s)")
        return 1 if stale else 0
    print(f"\nstamped {stale} asset link(s) across {changed} file(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
