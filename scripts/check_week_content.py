#!/usr/bin/env python3
"""Execute authored examples and exercise solutions; check the saved output oracle.

--refresh updates expected output and constructs the 12-question quiz for each week.
Java 8 examples compile with the same ECJ jar as the browser. Each test has its own
working directory, so file fixtures and static counters cannot contaminate another run.
"""
from pathlib import Path
import argparse
import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'content/weeks-6-12.json'


def normal(text):
    return '\n'.join(line.rstrip() for line in text.splitlines()).rstrip()


def plain(text):
    return html.unescape(re.sub(r'<[^>]+>', '', text))


def build_quiz(w):
    quiz = []
    for si,s in enumerate(w['sections']):
        for ei,e in enumerate(s['examples']):
            def output_option(output):
                return '<code>'+html.escape(output.rstrip()).replace('\n','<br>')+'</code>'
            answer = output_option(e['output'])
            alternatives = [output_option(x) for x in e['wrong']]
            assert all(normal(x)!=normal(e['output']) for x in e['wrong']), ('Correct distractor',w['week'],e['title'])
            # Keep identical formatting for output alternatives. If their lengths
            # would make the correct output an obvious longest answer, include a
            # plausible failure outcome rather than padding only wrong answers.
            if not any(len(plain(x))>len(plain(answer)) for x in alternatives):
                alternatives[-1] = 'Execution stops with a runtime error before completing the program; the remaining output is not produced.'
            position = (si*2+ei+w['week']) % 4
            alternatives.insert(position,answer)
            quiz.append({'q':f'What is the complete outcome of this {"Java" if e["lang"]=="java" else "Python"} program?', 'code':e['code'],'lang':e['lang'],'opts':alternatives,'a':position,'why':e['why']})
    for i,q in enumerate(w['questions']):
        opts = [html.escape(option) for option in q['wrong']]
        position = (i+w['week'])%4
        opts.insert(position,html.escape(q['correct']))
        quiz.append({'q':q['q'],'opts':opts,'a':position,'why':q['why']})
    return quiz


def main():
    refresh = argparse.ArgumentParser()
    refresh.add_argument('--refresh', action='store_true')
    args = refresh.parse_args()
    java = os.environ.get('JAVA_BIN') or shutil.which('java')
    if Path('/opt/homebrew/opt/openjdk@26/bin/java').exists() and not os.environ.get('JAVA_BIN'):
        java = '/opt/homebrew/opt/openjdk@26/bin/java'
    if not java:
        raise SystemExit('Java is required; set JAVA_BIN to the JDK java executable.')
    weeks = json.loads(DATA.read_text())
    checks = 0
    compiled = {}
    with tempfile.TemporaryDirectory(prefix='p1-content-') as directory:
        base = Path(directory)

        def run(lang, source, stdin=''):
            nonlocal checks
            checks += 1
            with tempfile.TemporaryDirectory(dir=base) as run_dir:
                if lang == 'python':
                    result = subprocess.run([sys.executable, '-c', source], input=stdin, text=True, capture_output=True, cwd=run_dir, timeout=15)
                else:
                    key = hashlib.sha256(source.encode()).hexdigest()
                    name = re.search(r'public\s+(?:final\s+|abstract\s+)?class\s+(\w+)', source).group(1)
                    if key not in compiled:
                        out = base / key
                        out.mkdir()
                        path = out / (name+'.java')
                        path.write_text(source)
                        command = [java, '-jar', str(ROOT / 'vendor/ecj.jar'), '-1.8', '-g', '-nowarn', '-d', str(out), str(path)]
                        build = subprocess.run(command, capture_output=True, text=True, timeout=30)
                        if build.returncode:
                            raise AssertionError('Java compile failure:\n'+build.stdout+build.stderr+'\n'+source)
                        compiled[key] = out
                    result = subprocess.run([java, '-cp', str(compiled[key]), name], input=stdin, text=True, capture_output=True, cwd=run_dir, timeout=15)
                if result.returncode:
                    raise AssertionError(f'{lang} run failed:\n{result.stderr}\n{source}')
                return result.stdout.replace('\r\n','\n')

        for w in weeks:
            for s in w['sections']:
                for e in s['examples']:
                    output = run(e['lang'],e['code'],e.get('stdin',''))
                    if args.refresh:
                        e['output'] = output
                    else:
                        assert normal(output) == normal(e['output']), (w['week'],e['title'],output)
                    spans = []
                    for token, _ in e['notes']:
                        assert token in e['code'], (e['title'],token)
                        for line_number,line in enumerate(e['code'].splitlines(),1):
                            if token in line:
                                start = line.index(token)
                                end = start+len(token)
                                assert not any(number==line_number and start<right and left<end for number,left,right in spans), ('Overlapping explanation',e['title'],token)
                                spans.append((line_number,start,end))
                                break
            for e in w['exercises']:
                outputs = []
                for case in e['tests']:
                    output = run(e['lang'],e['solution'],case['stdin'])
                    if args.refresh:
                        case['expect'] = output
                    else:
                        assert normal(output) == normal(case['expect']), (w['week'],e['id'],output)
                    outputs.append(normal(output))
                # Verify the starter is not already a passing solution for every case.
                starter_passes = []
                for case in e['tests'][:1]:
                    try:
                        starter_passes.append(normal(run(e['lang'],e['starter'],case['stdin'])) == normal(case['expect']))
                    except (AssertionError, subprocess.TimeoutExpired):
                        starter_passes.append(False)
                assert not all(starter_passes), ('Already-solved starter',w['week'],e['id'])
            if args.refresh:
                w['quiz'] = build_quiz(w)
            else:
                assert w['quiz'] == build_quiz(w), ('Quiz needs --refresh',w['week'])
            for qi,q in enumerate(w['quiz'],1):
                assert len(q['opts'])==4 and 0<=q['a']<4
                correct_length = len(plain(q['opts'][q['a']]))
                assert any(len(plain(o))>correct_length for i,o in enumerate(q['opts']) if i!=q['a']), ('Answer-length cue',w['week'],qi)
            assert len(w['quiz'])==12
            print(f'Week {w["week"]}: verified examples, {len(w["exercises"])} exercise solutions and 12 quiz questions',flush=True)
    if args.refresh:
        DATA.write_text(json.dumps(weeks,indent=2)+'\n')
    print(f'{checks} program executions; {len(compiled)} distinct Java programs compiled with the browser ECJ jar.')


if __name__ == '__main__':
    main()
