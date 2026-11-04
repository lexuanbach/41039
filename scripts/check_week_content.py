#!/usr/bin/env python3
"""Execute authored examples and exercise solutions; check the saved output oracle.

--refresh updates expected output and constructs the 12-question quiz for each week.
Java 8 examples compile with the same ECJ jar as the browser. Extra explained examples
and the programs behind interactive visuals are run too (they are not quiz questions);
compiler verdicts shown on a page are checked with ECJ, and their javac wording with
`javac --release 8` when a JDK compiler sits next to the java executable. Each test has its own
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
    javac = str(Path(java).resolve().parent / 'javac') if (Path(java).resolve().parent / 'javac').exists() else None
    weeks = json.loads(DATA.read_text())
    checks = 0
    compiled = {}
    with tempfile.TemporaryDirectory(prefix='p1-content-') as directory:
        base = Path(directory)

        def compile_java(source):
            """Compile with the browser's ECJ jar; return (directory or None, compiler output)."""
            key = hashlib.sha256(source.encode()).hexdigest()
            if key in compiled:
                return compiled[key], ''
            name = re.search(r'public\s+(?:final\s+|abstract\s+)?class\s+(\w+)', source).group(1)
            out = base / key
            out.mkdir(exist_ok=True)
            path = out / (name+'.java')
            path.write_text(source)
            command = [java, '-jar', str(ROOT / 'vendor/ecj.jar'), '-1.8', '-g', '-nowarn', '-d', str(out), str(path)]
            build = subprocess.run(command, capture_output=True, text=True, timeout=30)
            if build.returncode:
                return None, build.stdout+build.stderr
            compiled[key] = out
            return out, ''

        def javac_output(source):
            """javac --release 8 output (what Ed users see), or None when no javac is installed."""
            if not javac:
                return None
            with tempfile.TemporaryDirectory(dir=base) as javac_dir:
                name = re.search(r'public\s+(?:final\s+|abstract\s+)?class\s+(\w+)', source).group(1)
                (Path(javac_dir) / (name+'.java')).write_text(source)
                result = subprocess.run([javac, '--release', '8', '-Xlint:-options', '-d', javac_dir, name+'.java'],
                                        capture_output=True, text=True, cwd=javac_dir, timeout=60)
                return result.stdout+result.stderr

        def javac_summary(message):
            """What a page shows of javac's output: the first error with its source line and
            caret, or the warning notes of a program that compiles."""
            lines = message.splitlines()
            first = next((i for i,l in enumerate(lines) if ': error:' in l), None)
            if first is None:
                return '\n'.join(l for l in lines if l.startswith('Note:'))
            block = [lines[first]]
            for l in lines[first+1:]:
                if not l[:1].isspace():
                    break
                block.append(l)
            return '\n'.join(block)

        def run(lang, source, stdin=''):
            nonlocal checks
            checks += 1
            with tempfile.TemporaryDirectory(dir=base) as run_dir:
                if lang == 'python':
                    result = subprocess.run([sys.executable, '-c', source], input=stdin, text=True, capture_output=True, cwd=run_dir, timeout=15)
                else:
                    name = re.search(r'public\s+(?:final\s+|abstract\s+)?class\s+(\w+)', source).group(1)
                    out, errors = compile_java(source)
                    if out is None:
                        raise AssertionError('Java compile failure:\n'+errors+'\n'+source)
                    result = subprocess.run([java, '-cp', str(out), name], input=stdin, text=True, capture_output=True, cwd=run_dir, timeout=15)
                if result.returncode:
                    raise AssertionError(f'{lang} run failed:\n{result.stderr}\n{source}')
                return result.stdout.replace('\r\n','\n')

        def check_notes(e):
            spans = []
            for note in e['notes']:
                token = note[0]
                assert token in e['code'], (e['title'],token)
                for line_number,line in enumerate(e['code'].splitlines(),1):
                    if token in line:
                        start = line.index(token)
                        end = start+len(token)
                        assert not any(number==line_number and start<right and left<end for number,left,right in spans), ('Overlapping explanation',e['title'],token)
                        spans.append((line_number,start,end))
                        break

        def check_output(holder, output, label):
            if args.refresh:
                holder['output'] = output
            else:
                assert normal(output) == normal(holder['output']), (label, output)

        def check_extra(w, e):
            """An explained example that is not part of the quiz. compile_error examples must fail to compile."""
            nonlocal checks
            check_notes(e)
            if not e.get('compile_error'):
                check_output(e, run(e['lang'],e['code'],e.get('stdin','')), (w['week'],e['title']))
                return
            checks += 1
            out, errors = compile_java(e['code'])
            assert out is None and e['ecj_error'] in errors, ('Expected ECJ error', e['title'], errors)
            message = javac_output(e['code'])
            assert message is None or e['javac_error'] in message, ('Expected javac error', e['title'], message)
            # The page tells students how to fix it: delete the line that the compiler rejects.
            bad = e['javac_error'].split(':')[1]
            fixed = '\n'.join(l for n,l in enumerate(e['code'].splitlines(),1) if str(n) != bad)+'\n'
            assert normal(run('java', fixed)) == normal(e['fixed_output']), ('Fixed program output', e['title'])

        def simulate_filter(values, strategy):
            values = list(values)
            if strategy == 'forward':
                i = 0
                while i < len(values):
                    if values[i] % 2 == 0:
                        values.pop(i)
                    i += 1
                return values
            if strategy == 'backward':
                for i in range(len(values)-1, -1, -1):
                    if values[i] % 2 == 0:
                        values.pop(i)
                return values
            return [v for v in values if v % 2 != 0]

        def check_media(w, m):
            """Photographs must have API-sourced credits; comic credits must match the xkcd metadata."""
            if m['kind'] == 'comic':
                assert (ROOT / f'media/xkcd-{m["num"]}.png').is_file(), ('Missing comic image', m['num'])
                meta_file = ROOT.parent / 'UTS-Programming I/comics/meta.json'
                if meta_file.is_file():
                    meta = json.loads(meta_file.read_text()).get(str(m['num']))
                    assert meta and meta['title'] == m['title'] and str(meta['year']) == str(m['year']), ('Comic credit differs from xkcd metadata', m['num'], meta)
            else:
                credits = json.loads((ROOT / 'media/photo-credits.json').read_text())
                assert m['photo'] in credits, ('Photo has no credit record', m['photo'])
                assert (ROOT / 'media' / credits[m['photo']]['file']).is_file(), ('Missing photo file', m['photo'])
                assert m.get('alt'), ('Photo needs alt text', m['photo'])

        def check_visual(w, v):
            """Visual step-throughs show real programs: run them, and check every line marker exists."""
            nonlocal checks
            label = (w['week'], v['title'])
            if v['kind'] == 'list-ops':
                for lang, program in v['programs'].items():
                    check_output(program, run(lang, program['code']), label+(lang,))
                    key = 'j' if lang == 'java' else 'p'
                    for step in v['steps']:
                        assert step[key] in program['code'], (label, lang, step[key])
                    prints = sum(step['op'] == 'print' for step in v['steps'])
                    assert prints == len(program['output'].splitlines()), (label, 'one print step per output line')
                state = []
                for step in v['steps']:
                    if step['op'] == 'add': state.append(step['value'])
                    elif step['op'] == 'insert': state.insert(step['index'], step['value'])
                    elif step['op'] == 'set': state[step['index']] = step['value']
                    elif step['op'] == 'remove': state.pop(step['index'])
                assert str(state) in v['programs']['python']['output'], (label, 'simulated list', state)
            elif v['kind'] == 'filter':
                for strategy in v['strategies']:
                    for lang, program in strategy['programs'].items():
                        check_output(program, run(lang, program['code']), label+(strategy['id'], lang))
                        assert normal(program['output']) == str(simulate_filter(v['values'], strategy['id'])), (label, strategy['id'], 'simulation')
                        for token in strategy['lines'][lang].values():
                            assert token in program['code'], (label, strategy['id'], lang, token)
            elif v['kind'] == 'queue':
                for s in w['sections']:
                    for e in s.get('extras', []):
                        for lang, pane in v['panes'].items():
                            if e['title'] == pane['source']:
                                lines = e['code'].splitlines()
                                excerpt = pane['code'].rstrip('\n').splitlines()
                                assert lines[pane['first']-1:pane['first']-1+len(excerpt)] == excerpt, (label, lang, 'excerpt')
                                pane['checked'] = True
                for lang, pane in v['panes'].items():
                    assert pane.pop('checked', False), (label, lang, 'source example missing')
                    for token in v['lines'][lang].values():
                        assert token in pane['code'], (label, lang, token)
            elif v['kind'] == 'box':
                for variant in v['variants']:
                    code = v['template'].replace('{{TYPE}}', variant['type']).replace('{{VALUE}}', variant['value'])
                    check_output(variant, run('java', code), label+(variant['type'],))
            elif v['kind'] == 'typecheck':
                for stmt in v['stmts']:
                    for decl in v['decls']:
                        result = stmt['results'][decl['id']]
                        code = v['template'].replace('{{DECL}}', decl['code']).replace('{{STMT}}', stmt['code'])
                        checks += 1
                        out, errors = compile_java(code)
                        assert (out is not None) == result['ok'], (label, decl['id'], stmt['code'], errors)
                        message = javac_output(code)
                        if message is not None:
                            assert ('error:' in message) != result['ok'], (label, decl['id'], stmt['code'], message)
                            shown = javac_summary(message)
                            errors = sum(': error:' in l for l in message.splitlines())
                            if args.refresh:
                                if shown:
                                    result['javac'] = shown
                                else:
                                    result.pop('javac', None)
                                result['errors'] = errors
                            else:
                                assert result.get('javac', '') == shown, (label, decl['id'], stmt['code'], message)
                                assert result.get('errors') == errors, (label, decl['id'], stmt['code'], 'error count')
            else:
                raise AssertionError(('Unknown visual kind', v['kind']))

        for w in weeks:
            for s in w['sections']:
                for e in s['examples']:
                    output = run(e['lang'],e['code'],e.get('stdin',''))
                    if args.refresh:
                        e['output'] = output
                    else:
                        assert normal(output) == normal(e['output']), (w['week'],e['title'],output)
                    check_notes(e)
                for e in s.get('extras', []):
                    check_extra(w, e)
            for s in w['sections']:
                for v in s.get('visuals', []):
                    check_visual(w, v)
                for m in s.get('media', []):
                    check_media(w, m)
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
