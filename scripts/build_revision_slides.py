#!/usr/bin/env python3
"""Build Week 5--12 revision packages in the existing Beamer format.

The source is revision-slides/content/revisions.json. Every program is executed
before its output is inserted into a deck. Requires a JDK and XeLaTeX.
"""
from pathlib import Path
import argparse, concurrent.futures, hashlib, html, json, math, os, re, shutil, subprocess, sys, tempfile, textwrap
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'revision-slides'

def text(value):
    value=str(value).replace('\u2014','; ').replace('\u2013','-').replace('\u2019',"'").replace('\u2018',"'").replace('\u201c','"').replace('\u201d','"').replace('\u2265','>=').replace('\u2264','<=')
    mapping={'\\':r'\textbackslash{}','&':r'\&','%':r'\%','$':r'\$','#':r'\#','_':r'\_','{':r'\{','}':r'\}','~':r'\textasciitilde{}','^':r'\textasciicircum{}','<':r'\textless{}','>':r'\textgreater{}'}
    return ''.join(mapping.get(c,c) for c in value)

def norm(s): return '\n'.join(x.rstrip() for x in s.splitlines()).rstrip()
def short(s,words=70):
    parts=s.split()
    if len(parts)<=words:return s
    # Preserve complete sentences instead of clipping an explanation mid-claim.
    chunks=re.split(r'(?<=[.!?])\s+',s)
    result=[];count=0
    for chunk in chunks:
        if result and count+len(chunk.split())>words:break
        result.append(chunk);count+=len(chunk.split())
    return ' '.join(result)

def listing(code,lang='',numbers=False,first=1,bad=False):
    language='Py' if lang=='python' else 'Java' if lang=='java' else ''
    opts=['style='+('bad' if bad else 'code')]
    if language:opts.append('language='+language)
    if numbers:opts += ['numbers=left','numberstyle=\\tiny\\color{codegray}',f'firstnumber={first}','numbersep=0.7em']
    return '\\begin{lstlisting}['+','.join(opts)+']\n'+code.rstrip()+'\n\\end{lstlisting}\n'

def frame(title,body,fragile=False):
    return '\n\\begin{frame}'+('[fragile]' if fragile else '')+'{'+text(title)+'}\n'+body+'\n\\end{frame}\n'

def section(title):return '\n\\section{'+text(title)+'}\n'
def source_line(n):return '\\par\\srcline{'+r'\href{../../weeks/week-'+str(n)+'.html}{Course website: Week '+str(n)+'}'+'. Complete programs accompany this deck.}\n'
def cols(a,b,left=.60):
    return '\\begin{columns}[T,onlytextwidth]\n\\column{'+str(left)+r'\textwidth}'+'\n\\raggedright\n'+a+'\n\\column{'+str(round(.96-left,2))+r'\textwidth}'+'\n\\raggedright\n'+b+'\n\\end{columns}\n'

def display_code(code):
    # A main-only Demo wrapper adds four lines without teaching a new idea. Show
    # its statements and supporting types as an explicitly labelled excerpt;
    # retain the complete executable program in examples/ or solutions/.
    match=re.search(r'public class Demo\s*\{\s*public static void main\([^\n]*\)\s*(?:throws [\w, ]+)?\s*\{',code)
    if match:
        start=match.end();depth=1;end=start
        masked=re.sub(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|//[^\n]*|/\*[\s\S]*?\*/',lambda m:' '*len(m.group()),code)
        while depth and end<len(code):
            if masked[end]=='{':depth+=1
            elif masked[end]=='}':depth-=1
            end+=1
        tail=end
        while tail<len(code) and code[tail].isspace():tail+=1
        if tail<len(code) and code[tail]=='}':
            code=code[:match.start()]+textwrap.dedent(code[start:end-1]).strip()+'\n'+code[tail+1:]
    return '\n'.join(line for line in code.splitlines() if line.strip())

class Runner:
    def __init__(self,directory):
        self.directory=Path(directory);self.cache={};self.runs=0
        self.java=os.environ.get('JAVA_BIN','/opt/homebrew/opt/openjdk@26/bin/java')
        self.javac=os.environ.get('JAVAC_BIN','/opt/homebrew/opt/openjdk@26/bin/javac')
        if not Path(self.java).exists():self.java=shutil.which('java')
        if not Path(self.javac).exists():self.javac=shutil.which('javac')
        if not self.java or not self.javac:raise RuntimeError('Install a JDK or set JAVA_BIN and JAVAC_BIN.')
    def run(self,program,stdin='',allow_failure=False):
        self.runs+=1
        code=program['code'];lang=program['lang'];release=program.get('release',8)
        with tempfile.TemporaryDirectory(dir=self.directory) as working:
            if lang=='python':
                command=[sys.executable,'-c',code]
            else:
                key=hashlib.sha256((str(release)+code).encode()).hexdigest()
                name=re.search(r'public\s+(?:(?:final|abstract)\s+)?class\s+(\w+)',code).group(1)
                if key not in self.cache:
                    dest=self.directory/key;dest.mkdir();file=dest/(name+'.java');file.write_text(code)
                    compiled=subprocess.run([self.javac,'--release',str(release),'-d',str(dest),str(file)],capture_output=True,text=True,timeout=30)
                    if compiled.returncode:raise AssertionError('Java compilation failed:\n'+compiled.stderr+'\n'+code)
                    self.cache[key]=dest
                command=[self.java,'-ea','-cp',str(self.cache[key]),name]
            completed=subprocess.run(command,input=stdin,text=True,capture_output=True,cwd=working,timeout=15)
            result={'stdout':completed.stdout.replace('\r\n','\n'),'returncode':completed.returncode,'error':completed.stderr.strip().splitlines()[-1] if completed.stderr.strip() else ''}
            if completed.returncode and not allow_failure:raise AssertionError(f"{lang} failed: {result['error']}\n{code}")
            if 'expected' in program:assert norm(result['stdout'])==norm(program['expected']),(program.get('title'),result)
            return result

class ReplayRunner:
    """Reuse measured output only when language, release, source and input match."""
    def __init__(self):
        self.runs=0;self.measured={}
        for folder in BASE.glob('revision-week-*'):
            if not (folder/'checks.json').exists():continue
            for case in json.loads((folder/'checks.json').read_text()):
                source=(folder/case['file']).read_text()
                key=(case['lang'],case['release'],source,case['stdin'])
                self.measured[key]={k:case[k] for k in ['stdout','returncode','error']}
    def run(self,program,stdin='',allow_failure=False):
        self.runs+=1
        key=(program['lang'],program.get('release',8),program['code'],stdin)
        if key not in self.measured:raise AssertionError('Source changed: run without --reuse-checks to measure its output.')
        result=self.measured[key]
        if not allow_failure:assert result['returncode']==0
        if 'expected' in program:assert norm(result['stdout'])==norm(program['expected'])
        return result

def program_file(folder,program):
    folder.mkdir(parents=True,exist_ok=True)
    if program['lang']=='java':
        name=re.search(r'public\s+(?:(?:final|abstract)\s+)?class\s+(\w+)',program['code']).group(1)+'.java'
    else:name='main.py'
    path=folder/name;path.write_text(program['code'])
    return path

def diagram_tex(d):
    nodes=[]
    for name,label,x,y in d['nodes']:
        label=r'\\[0pt] '.join(text(t) for t in label.split('\n'))
        nodes.append('\\node[draw=bkblue,rounded corners=2pt,fill=codebg,align=center,inner sep=6pt,font=\\small] ('+name+') at ('+str(x)+','+str(y)+') {'+label+'};')
    positions={name:(x,y) for name,_,x,y in d['nodes']}
    for a,b,label in d['edges']:
        placement='right=3pt' if positions[a][0]==positions[b][0] else 'above=8pt'
        nodes.append('\\draw[ref] ('+a+') -- '+('node['+placement+',font=\\scriptsize]{'+text(label)+'} ' if label else '')+'('+b+');')
    return '\\resizebox{\\linewidth}{!}{\\begin{tikzpicture}\n'+'\n'.join(nodes)+'\n\\end{tikzpicture}}\n'

def output_block(result):
    code=result['stdout'].rstrip() or '(no standard output)'
    if result['returncode']:code+='\n'+result['error']
    return listing(code)

def build_one(d,runner,preamble):
    n=d['week'];folder=BASE/f'revision-week-{n}';folder.mkdir(exist_ok=True)
    shutil.copy2(BASE/'content/bk-logo.png',folder/'bk-logo.png')
    records=[]
    def run_program(p,path,stdin='',allow_failure=False):
        target=program_file(folder/path,p)
        r=runner.run(p,stdin,allow_failure)
        records.append({'file':str(target.relative_to(folder)),'lang':p['lang'],'release':p.get('release',8),'stdin':stdin,**r})
        return r
    questions=d['questions']+d['bonus']
    question_results=[]
    for i,p in enumerate(questions,1):question_results.append(run_program(p,Path('examples')/f'q{i:02}'))
    graph_result=run_program(d['diagram']['program'],Path('examples/draw'))
    assert norm(graph_result['stdout'])==norm(d['diagram']['expected']),('Diagram state',n,graph_result)
    debug_results=[]
    for i,b in enumerate(d['debug'],1):
        p={'lang':b['lang'],'code':b['broken']}
        # Root copies mirror exactly the listings on the slides.
        extension='java' if b['lang']=='java' else 'py'
        root_path=folder/('Broken.java' if extension=='java' else 'broken.py');root_path.write_text(b['broken'])
        r=runner.run(p,allow_failure=True)
        fixed_path=folder/'solutions'/root_path.name;fixed_path.parent.mkdir(exist_ok=True);fixed_path.write_text(b['fixed'])
        fixed=runner.run({'lang':b['lang'],'code':b['fixed']})
        assert (norm(r['stdout']),r['returncode'])!=(norm(fixed['stdout']),fixed['returncode']),('Wrong program shows no failure',n,b['lang'])
        for path,code_value,value in [(root_path,b['broken'],r),(fixed_path,b['fixed'],fixed)]:
            records.append({'file':str(path.relative_to(folder)),'lang':b['lang'],'release':8,'stdin':'',**value})
        debug_results.append((r,fixed))
    predict_results=[]
    for i,p in enumerate(d['predict'],1):predict_results.append(run_program(p,Path('examples')/f'predict-{i}'))
    challenge_results={}
    for lang in ['java','python']:
        item=d['challenge'][lang]
        if lang=='java':
            name=re.search(r'public\s+class\s+(\w+)',item['solution']).group(1)+'.java'
        else:name='challenge.py'
        (folder/name).write_text(item['starter'])
        path=folder/'solutions'/name;path.write_text(item['solution'])
        results=[]
        for case in item['tests']:
            p={'lang':lang,'code':item['solution']}
            result=runner.run(p,case['stdin'])
            assert norm(result['stdout'])==norm(case['expect']),('Challenge oracle',n,lang,result,case)
            records.append({'file':str(path.relative_to(folder)),'lang':lang,'release':8,'stdin':case['stdin'],**result})
            results.append(result)
        challenge_results[lang]=results
    tex=preamble+'\n\\title[41039 Programming 1 --- Revision of Week '+str(n)+']{41039 Programming 1}\n'
    tex+='\\subtitle{Revision of Week '+str(n)+': '+text(d['title'])+'}\n'
    tex+=r'\author{Dr. Xuan-Bach Le\\ \small\texttt{le.xuan.bach@hcmut.edu.vn}}'+'\n'+r'\institute{\small Faculty of Computer Science and Engineering, HCMUT}'+'\n'+r'\date{September Session 2026}'+'\n'
    tex+=r'\AtBeginSection[]{\begin{frame}{Outline}\tableofcontents[currentsection]\end{frame}}'+'\n\\begin{document}\n'
    tex+=frame('','\\titlepage')
    guide=r'\begin{discussionbox}{A recap before the next lecture}\small Write an answer before the reveal. Explain the state change, rule or contract that makes it follow. These are practice questions, with no new assessment requirements.\end{discussionbox}'+'\n'
    guide+=cols(r'\neutrallabel{Part 1: on your own}\begin{itemize}\small\item '+str(len(questions))+r' short questions\item About 90 seconds per question\item Java and Python; name the language first\end{itemize}',r'\neutrallabel{Part 2: teams of 3 or 4}\begin{itemize}\small\item Draw the model\item Spot the errors\item Predict the output\item Write and test the code\end{itemize}',.48)
    guide+=r'\keyline{A result needs a reason. A repair needs a counterexample.}'
    tex+=frame('How the revision session works',guide)
    tex+=section('On your own')
    for i,(p,r) in enumerate(zip(questions,question_results),1):
        label=('Java '+str(p.get('release',8))) if p['lang']=='java' else 'Python 3'
        if 'public class Demo' in p['code'] and 'public class Demo' not in display_code(p['code']):label+=' excerpt: main statements and supporting types'
        if n==12 and i>6:label+='; optional extension'
        if p.get('release',8)>8:label+='; use Ed or a matching local JDK'
        body='\\srcline{'+text(label)+'; commit to an outcome before the reveal.}\n'
        left=listing(display_code(p['code']),p['lang'])
        prompt=p.get('probe','What is the complete output? Which line or rule decides it?')
        right=r'\begin{onlyenv}<1>\begin{discussionbox}{Your answer}\small '+text(prompt)+r'\end{discussionbox}\end{onlyenv}'+'\n'+r'\begin{onlyenv}<2>\begin{contextbox}{Answer}'+'\n'+output_block(r)+'\\scriptsize\\raggedright '+text(short(p['why']))+'\n\\end{contextbox}\\end{onlyenv}'
        body+=cols(left,right,.62)
        tex+=frame(str(i)+'. '+p['title'],body,True)
    tex+=section('Team round 1: draw the model')
    tex+=frame('Form teams',r'\begin{itemize}[itemsep=0.8em]\item Teams of 3 or 4. One shared sheet, one spokesperson.\item For each challenge, record the result and the reason.\item Rotate the spokesperson. Other teams can challenge an explanation.\item The final task has starter files and a Java/Python solution pair.\end{itemize}'+r'\keyline{Discuss first. Commit to an answer. Then compare with the reveal.}')
    graph=d['diagram']
    body=cols(listing(display_code(graph['program']['code']),'java'),r'\begin{discussionbox}{Four minutes}\small '+text('Draw '+('the object references' if graph['kind']=='objects' else 'the flow and responsibilities')+' after the shown operations. Label the important state. Mark what is shared, what changes, or which path handles failure. Predict every output line.')+r'\end{discussionbox}',.62)+source_line(n)
    tex+=frame('Draw it: '+graph['title'],body,True)
    body=cols(diagram_tex(graph),r'\begin{contextbox}{Output}'+output_block(graph_result)+r'\end{contextbox}',.66)
    body+='\\vspace{0.8em}\n\\small '+text(graph['why'])+'\n'+source_line(n)
    tex+=frame('Draw it: one answer',body,True)
    tex+=section('Team round 2: spot the errors')
    for i,(b,(wrong,fixed)) in enumerate(zip(d['debug'],debug_results),1):
        lines=b['broken'].splitlines();mid=(len(lines)+1)//2
        body=r'\begin{discussionbox}{Contract}\small '+text(b['contract'])+r'\end{discussionbox}'+'\n'
        body+=cols(listing('\n'.join(lines[:mid]),b['lang'],True,1,True),listing('\n'.join(lines[mid:]),b['lang'],True,mid+1,True),.48)
        tex+=frame('Spot the errors '+str(i)+': '+('Java' if b['lang']=='java' else 'Python')+' (5 min)',body,True)
        entries=[]
        for needle,why in b['issues']:
            assert needle in b['broken'],(n,needle)
            number=b['broken'][:b['broken'].index(needle)].count('\n')+1
            entries.append(r'\item \textbf{L'+str(number)+':} '+text(why))
        body=cols(r'\begin{contextbox}{The repairs}\footnotesize\begin{itemize}[itemsep=0.45em]'+''.join(entries)+r'\end{itemize}\end{contextbox}',r'\badlabel{Original program}'+output_block(wrong)+r'\goodlabel{After the repairs}'+output_block(fixed),.58)
        body+=source_line(n)
        tex+=frame('Spot the errors '+str(i)+': answers',body,True)
    tex+=section('Team round 3: predict the output')
    for i,(p,r) in enumerate(zip(d['predict'],predict_results),1):
        body=cols(listing(display_code(p['code']),p['lang']),r'\begin{discussionbox}{Three minutes}\small Write every line in order. Explain the first state change, alias, dispatch decision or exception that controls the result. Then propose one change that alters the output.\end{discussionbox}',.62)+source_line(n)
        tex+=frame('Predict '+str(i)+': '+p['title'],body,True)
        body=cols(output_block(r),r'\begin{contextbox}{Why}\small '+text(p['why'])+r'\end{contextbox}',.42)+source_line(n)
        tex+=frame('Predict '+str(i)+': answer',body,True)
    tex+=section('Team round 4: write the code')
    ch=d['challenge'];cases=ch['java']['tests']
    body=r'\begin{discussionbox}{'+text(ch['title'])+r'}\small '+text(ch['brief'])+r'\end{discussionbox}'+'\n'
    body+=cols(r'\neutrallabel{Example input}'+listing(cases[0]['stdin']),r'\neutrallabel{Expected output}'+listing(cases[0]['expect']),.48)
    body+=r'\small Eight minutes. One Java team and one Python team at the keyboard. Other teams produce a boundary test and explain which wrong implementation it would expose.'
    tex+=frame('Code it: specification',body,True)
    for lang in ['java','python']:
        code=display_code(ch[lang]['solution']);lines=code.splitlines()
        parts=math.ceil(len(lines)/17)
        chunk_size=math.ceil(len(lines)/parts)
        chunks=[lines[i:i+chunk_size] for i in range(0,len(lines),chunk_size)]
        for i,chunk in enumerate(chunks,1):
            label=('Java' if lang=='java' else 'Python')+' solution'
            if len(chunks)>1:label+=' ('+str(i)+'/'+str(len(chunks))+')'
            body=listing('\n'.join(chunk),lang,True,first=(i-1)*chunk_size+1)
            body+=source_line(n)
            tex+=frame('Code it: '+label,body,True)
    tests=r'{\scriptsize A slash separates input lines; (blank) denotes an empty line.\par}\medskip '
    assert [case['stdin'] for case in cases]==[case['stdin'] for case in ch['python']['tests']],('Challenge input formats differ',n)
    for i,case in enumerate(cases,1):
        # Every case is supplied, including empty input and boundary examples.
        shown_input=' / '.join(line if line else '(blank)' for line in case['stdin'].splitlines()) or '(EOF)'
        shown_output=' / '.join(line if line else '(empty line)' for line in case['expect'].splitlines()) or '(no output)'
        tests+=r'\textbf{Test '+str(i)+r'}\par '+r'\code{'+text(shown_input)+r'}\par '+r'\textbf{Output:} \code{'+text(shown_output)+r'}\par\medskip '
    tex+=frame('Code it: the tests',r'\footnotesize '+tests+r'\keyline{Explain why each test is present, not only whether it passes.}')
    tex+=section('Wrapping up')
    body=r'\begin{itemize}[itemsep=0.6em]'+''.join(r'\item '+text(x) for x in d['learning'])+r'\end{itemize}'
    body+=r'\vfill\small Return to the matching week page for runnable examples and further practice. Bring one unresolved prediction or counterexample to the next class.'
    body+=source_line(n)
    tex+=frame('What you should now be able to explain',body)
    tex+='\n\\end{document}\n'
    path=folder/f'revision-week-{n}.tex';path.write_text(tex)
    (folder/'checks.json').write_text(json.dumps(records,indent=2)+'\n')
    readme=f'''# Revision of Week {n}: {d['title']}

Recap for the start of the next lecture, using the same HCMUT Beamer template,
logo, blue headings, question/answer boxes and individual-then-team structure as
revision Week 4. The teaching language remains English.

- **Individual questions:** {len(questions)}, with answers revealed after a pause.
- **Team rounds:** draw the model, spot two faulty programs, predict two programs,
  then write and test matching Java/Python solutions.
- **Timing:** about 45-55 minutes. For a shorter session, use four individual
  questions, one debugging question and the final keyboard challenge.
- **Scope:** {d['source']}

## Files

- `revision-week-{n}.pdf`: compiled deck.
- `revision-week-{n}.tex` and `bk-logo.png`: editable source and the original logo.
- `Broken.java` and `broken.py`: intentionally faulty programs, exactly as on the
  numbered debugging slides. Python may stop at its first error.
- The other root `.java`/`.py` files are the keyboard-challenge starters.
- `solutions/`: repaired debugging programs and complete challenge solutions.
- `examples/`: complete individual, draw and prediction programs. Each Java
  question has its own folder so repeated class names never collide.
- `checks.json`: recorded inputs and actual program outcomes for repeatable checks.

## Teaching notes

{d['diagram']['why']}

For each debugging question, ask the group to propose a counterexample as well as a
repair. A first failure may hide a later one. The answers distinguish a correct
return value from correct state and a syntactically valid format from valid data.

Current Canvas instructions remain authoritative for assessment. These revision
tasks are newly authored practice, not copies of graded labs, assignments or exams.
'''
    if n==5:readme+='\nThe final two individual questions need **Java 14** and **Java 21**. Their code\nwas compiled with those release levels; the website Java 8 console cannot run them.\n'
    if n==12:readme+='\nThe last two individual questions are clearly labelled **optional enrichment**\n(functional transformations and streams). They add no assessment requirement.\n'
    readme+=f'''\n## Build and verify

From this folder, run `xelatex revision-week-{n}.tex` twice. From the repository root:

```sh
python3 scripts/build_revision_slides.py --weeks {n}
python3 scripts/check_revision_slides.py --weeks {n}
```

All displayed program results and challenge outputs are derived from native runs,
using a matching Java release and CPython. The intentionally wrong programs may
return a nonzero status. See `checks.json` for the exact observed outcomes.
Some slide excerpts omit only the `Demo.main` wrapper; the complete program is
always present in the corresponding example or solution file. Debug listings
retain their exact root-file line numbers.
'''
    (folder/'README.md').write_text(readme)
    return folder

def compile_pdf(folder):
    n=folder.name.split('-')[-1];stem=f'revision-week-{n}'
    for pass_no in [1,2]:
        result=subprocess.run(['xelatex','-interaction=nonstopmode','-halt-on-error',stem+'.tex'],cwd=folder,text=True,capture_output=True,timeout=120)
        if result.returncode:raise AssertionError('XeLaTeX failed for Week '+n+'\n'+result.stdout[-7000:])
    log=(folder/(stem+'.log')).read_text(errors='replace')
    warnings=[line for line in log.splitlines() if 'Overfull' in line or 'Missing character' in line]
    # Keep private compilation traces outside the deliverable directories.
    private=Path('/tmp/41039-revision-logs');private.mkdir(exist_ok=True)
    shutil.copy2(folder/(stem+'.log'),private/(stem+'.log'))
    for extension in ['aux','log','nav','out','snm','toc','vrb']:
        for artifact in folder.glob('*.'+extension):artifact.unlink()
    return {'week':int(n),'warnings':warnings,'pdf':str(folder/(stem+'.pdf'))}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--weeks',type=int,nargs='+',default=list(range(5,13)));parser.add_argument('--no-pdf',action='store_true');parser.add_argument('--reuse-checks',action='store_true');args=parser.parse_args()
    decks=json.loads((BASE/'content/revisions.json').read_text())
    preamble=(BASE/'content/revision-template.tex').read_text()
    folders=[]
    with tempfile.TemporaryDirectory(prefix='p1-revision-') as temp:
        runner=ReplayRunner() if args.reuse_checks else Runner(temp)
        for d in decks:
            if d['week'] not in args.weeks:continue
            folders.append(build_one(d,runner,preamble));print(f'Week {d["week"]}: source package and native output checks complete',flush=True)
        print(f'{runner.runs} program outcomes '+('reused from matching native checks.' if args.reuse_checks else 'verified before PDF generation.'),flush=True)
    if not args.no_pdf:
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            for result in pool.map(compile_pdf,folders):print(json.dumps(result),flush=True)

if __name__=='__main__':main()
