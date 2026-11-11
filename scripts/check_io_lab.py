#!/usr/bin/env python3
"""Check the I/O & Exceptions Lab (io-lab.html) against real Java and real Python.

assets/io-lab-model.js generates a Java and a Python program from five choices and *simulates*
them for the animation. This script runs every choice (72 programs per language) on every preset
input file through the same compiler the site uses (vendor/ecj.jar, -1.8) on a JVM, and through
CPython, and requires the simulation to agree exactly on:

  * standard output, byte for byte
  * the exit code (0, or 1 for an uncaught exception)
  * the stack trace: Java's first line and every ScoreReport frame (the JDK's own frames are
    left out of the model); Python's whole traceback minus the ~~~^^^ underline rows
  * report.txt: its exact content, or that it was not written

Usage:  python3 scripts/check_io_lab.py            (needs node, a JDK, python3)
        JAVA_BIN=/path/to/java to pick the JVM.
"""
import itertools
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODEL = ROOT / 'assets' / 'io-lab-model.js'


def find_java():
    java = os.environ.get('JAVA_BIN')
    if not java and Path('/opt/homebrew/opt/openjdk@26/bin/java').exists():
        java = '/opt/homebrew/opt/openjdk@26/bin/java'
    java = java or shutil.which('java')
    if not java:
        raise SystemExit('A JDK is required; set JAVA_BIN.')
    return java


NODE_DUMP = r"""
const M = require(process.argv[1]);
const keys = Object.keys(M.CHOICES);
const combos = [[]];
for (const k of keys) {
  const next = [];
  for (const c of combos) for (const v of M.CHOICES[k]) next.push(c.concat([[k, v]]));
  combos.splice(0, combos.length, ...next);
}
const out = [];
for (const pairs of combos) {
  const cfg = Object.fromEntries(pairs);
  const entry = { cfg, programs: {}, runs: [] };
  for (const lang of ['java', 'python']) entry.programs[lang] = M.program(cfg, lang).code;
  for (const p of M.PRESETS) {
    const file = { exists: p.exists, text: p.text };
    const run = { preset: p.id, file, sim: {} };
    for (const lang of ['java', 'python']) {
      const r = M.simulate(cfg, file, lang);
      run.sim[lang] = { stdout: r.out[lang].stdout, stderr: r.out[lang].stderr, exit: r.exit, report: r.report,
                        exception: r.out[lang].exception, steps: r.steps.length };
    }
    // 'both' must only be offered when the two flows agree; then it must print what each language prints
    if (!M.agree(file)) {
      const b = M.simulate(cfg, file, 'both');
      run.both = { java: b.out.java, python: b.out.python, exit: b.exit, report: b.report };
    }
    entry.runs.push(run);
  }
  out.push(entry);
}
process.stdout.write(JSON.stringify(out));
"""

CARET = re.compile(r'^\s*[~^]+\s*$')


def java_key(stderr):
    lines = stderr.splitlines()
    if not lines:
        return []
    return [lines[0]] + [l for l in lines[1:] if l.startswith('\tat ScoreReport.')]


def python_key(stderr, folder):
    rows = []
    for l in stderr.splitlines():
        if CARET.match(l):
            continue
        rows.append(l.replace(str(Path(folder) / 'main.py'), 'main.py'))
    return rows


def main():
    java = find_java()
    dump = subprocess.run(['node', '-e', NODE_DUMP, str(MODEL)], capture_output=True, text=True, check=True)
    data = json.loads(dump.stdout)
    failures, checked = [], 0
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for n, entry in enumerate(data):
            label = ' '.join(f'{k}={v}' for k, v in entry['cfg'].items())
            # compile the Java program once per configuration
            jdir = tmp / f'j{n}'
            (jdir / 'src').mkdir(parents=True)
            (jdir / 'src' / 'ScoreReport.java').write_text(entry['programs']['java'])
            c = subprocess.run([java, '-jar', str(ROOT / 'vendor/ecj.jar'), '-1.8', '-g', '-nowarn',
                                '-d', str(jdir / 'out'), str(jdir / 'src' / 'ScoreReport.java')],
                               capture_output=True, text=True)
            if c.returncode != 0:
                failures.append(f'[{label}] Java does not compile:\n{c.stdout}{c.stderr}')
                continue
            for run in entry['runs']:
                for lang in ('java', 'python'):
                    work = tmp / f'w{n}-{run["preset"]}-{lang}'
                    work.mkdir()
                    if run['file']['exists']:
                        (work / 'scores.txt').write_text(run['file']['text'])
                    if lang == 'java':
                        cmd = [java, '-cp', str(jdir / 'out'), 'ScoreReport']
                    else:
                        (work / 'main.py').write_text(entry['programs']['python'])
                        cmd = [sys.executable, str(work / 'main.py')]
                    r = subprocess.run(cmd, cwd=work, capture_output=True, text=True, timeout=30)
                    sim = run['sim'][lang]
                    where = f'[{label}] {run["preset"]} {lang}'
                    report = (work / 'report.txt').read_text() if (work / 'report.txt').exists() else None
                    problems = []
                    if r.stdout != sim['stdout']:
                        problems.append(f'stdout\n  real: {r.stdout!r}\n  sim:  {sim["stdout"]!r}')
                    if r.returncode != sim['exit']:
                        problems.append(f'exit real {r.returncode} sim {sim["exit"]}')
                    if report != sim['report']:
                        problems.append(f'report.txt real {report!r} sim {sim["report"]!r}')
                    if lang == 'java':
                        real_t, sim_t = java_key(r.stderr), java_key(sim['stderr'])
                    else:
                        real_t, sim_t = python_key(r.stderr, work), python_key(sim['stderr'], work)
                    if real_t != sim_t:
                        problems.append('trace\n  real: ' + '\n        '.join(real_t) + '\n  sim:  ' + '\n        '.join(sim_t))
                    if problems:
                        failures.append(where + ': ' + '; '.join(problems))
                    checked += 1
                if 'both' in run:
                    for lang in ('java', 'python'):
                        if run['both'][lang]['stdout'] != run['sim'][lang]['stdout'] or run['both'][lang]['stderr'] != run['sim'][lang]['stderr']:
                            failures.append(f'[{label}] {run["preset"]}: the "both" view prints something else for {lang}')
    for f in failures[:40]:
        print('FAIL', f)
    print(f'{checked} runs checked against real Java and Python, {len(failures)} failures.')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
