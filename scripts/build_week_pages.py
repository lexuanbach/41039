#!/usr/bin/env python3
"""Render the later week pages from the editable content/weeks-6-12.json.

The generated HTML is committed and served directly; no build is needed by visitors.
Run check_week_content.py --refresh first when changing runnable examples or solutions.
"""
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content/weeks-6-12.json'


def esc(value):
    return html.escape(str(value), quote=True)


def example(item):
    notes = []
    used = set()
    for token, explanation in item['notes']:
        for line_no, line in enumerate(item['code'].splitlines(), 1):
            if token in line and (line_no, token) not in used:
                used.add((line_no, token))
                notes.append(f'<li data-line="{line_no}" data-match="{esc(token)}" data-title="{esc(token)}">{explanation}</li>')
                break
        else:
            raise ValueError(f"Missing explanation token {token}: {item['title']}")
    mode = ' data-run="none"' if item.get('static') else ''
    # text/plain script data must not contain an HTML closing-script sequence.
    if re.search(r'</script', item['code'], re.I):
        raise ValueError('Unsafe script boundary in example')
    output = ''
    if item.get('static'):
        output = f'<pre data-role="output" data-label="Verified output · run this file example on Ed">{esc(item["output"])}</pre>'
    return f'''<div class="p1-explain" data-lang="{item['lang']}" data-title="{esc(item['title'])}" data-stdin="{esc(item.get('stdin', ''))}"{mode}>
<script type="text/plain" data-role="source">{item['code']}</script>
<ol data-role="notes">{''.join(notes)}</ol>{output}</div>'''


def course_nav(current):
    titles = [(1, 'First programs'), ('2-3', 'Choosing and repeating'), (4, 'Methods and records'), (5, 'Classes and enums')]
    titles += [(w['week'], w['short']) for w in json.loads(CONTENT.read_text())]
    links = ''.join(f'<a href="week-{num}.html"'+(' aria-current="page"' if str(num) == str(current) else '')+f'><span class="ch-num">{num}</span>{esc(title)}</a>' for num, title in titles)
    return f'''<aside class="side" aria-label="Course navigation"><details id="course-weeks"><summary>Course weeks</summary><nav aria-label="All week pages"><a href="../index.html">Syllabus and materials</a>{links}<a href="../playground.html">Java + Python playground</a></nav></details></aside>'''


def render(w):
    n = w['week']
    template = (ROOT / 'weeks/week-5.html').read_text()
    head = template.split('<body>')[0]
    head = re.sub(r'<title>.*?</title>', f'<title>Week {n} · {esc(w["title"])} · 41039</title>', head)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(w["lede"])}">', head)
    header = template.split('<body>')[1].split('</header>')[0] + '</header>'
    header = re.sub(r'<nav class="topnav".*?</nav>', f'''<nav class="topnav" aria-label="Page navigation"><a href="../index.html#materials">All weeks</a><a href="#concepts">Lecture</a><a href="#quiz">Quiz</a><a href="#thisweek">This week</a><a href="../playground.html">Playground</a></nav>''', header, flags=re.S)
    sections = [(s['title'], f"{len(s['examples'])} examples · Java + Python") for s in w['sections']]
    sections += [('Coding exercises', f"{len(w['exercises'])} tasks · auto-marked"), ('Team activity', '2 activities · discussion'), ('Quiz', f"{len(w['quiz'])} questions · explained"), ('Further reading', 'Ed + Canvas + documentation')]
    tabs = []
    panels = []
    for i, (title, meta) in enumerate(sections, 1):
        key = f's{i:02}'
        tabs.append(f'''<button class="lesson-tab" role="tab" id="tab-{key}" aria-controls="panel-{key}" aria-selected="{'true' if i == 1 else 'false'}" tabindex="{0 if i == 1 else -1}" data-target="{key}"><span class="t-num">{i:02}</span><span class="t-text"><span class="t-title">{esc(title)}</span><span class="t-meta">{esc(meta)}</span></span></button>''')
        if i <= len(w['sections']):
            s = w['sections'][i - 1]
            body = ''.join(f'<div class="concept"><h3><span class="idx">{i}.{j}</span>{c[0]}</h3>{c[1]}</div>' for j,c in enumerate(s['concepts'],1))
            body += ''.join(example(e) for e in s['examples'])
            body += f'<div class="note tip"><span class="tag">Predict · run · change · explain</span><p>{s["try"]}</p></div>'
        elif title == 'Coding exercises':
            body = '<p>These are new practice tasks for this website. Read the input and output contract, complete the starter, then run the tests. They are not assessment submissions.</p><div id="exercises-root"></div>'
        elif title == 'Team activity':
            body = ''.join(f'<div class="team-card"><div class="team-meta">Activity {j} · 12 min · groups of 3</div><h4>{a[0]}</h4>{a[1]}</div>' for j,a in enumerate(w['activities'],1))
        elif title == 'Quiz':
            body = '<div id="quiz"><p>Predict the behaviour before running a program. Answer every question, then grade to see explanations. Nothing here is recorded or submitted.</p><div id="quiz-root"></div></div>'
        else:
            body = '<p>The Ed lessons below provide the course material behind this page. The worked examples, activities and practice questions here are newly written adaptations.</p><div class="read-grid">'
            for title_,url,description in w['sources'] + w['reading']:
                body += f'<a class="read-card" href="{esc(url)}"><span class="kind">Course source / reference</span><h4>{esc(title_)}</h4><p>{description}</p><span class="host">{esc(url.split("/")[2])}</span></a>'
            body += '</div>'
        panels.append(f'''<section class="lesson-panel" role="tabpanel" id="panel-{key}" aria-labelledby="tab-{key}" tabindex="0"{'' if i == 1 else ' hidden'}><h3 class="panel-head"><span class="panel-num">{i:02}</span>{esc(title)}</h3>{body}</section>''')
    first = w['sections'][0]['examples'][0]
    hero_code = '<pre>' + esc('\n'.join(first['code'].splitlines()[:15])) + '</pre>'
    source_links = ''.join(f'<li><a href="{esc(url)}">{esc(title)}</a></li>' for title,url,_ in w['sources'])
    previous = f'week-{n-1}.html'
    next_ = f'week-{n+1}.html' if n < 12 else '../index.html#materials'
    scripts = ''.join(f'<script src="../assets/{name}.js"></script>\n' for name in ['runtime','highlight','editor','console-ui','explain',f'w{n}-data',f'w{n}-exercises','exercises','course'])
    return f'''{head}<body>{header}<div class="layout">{course_nav(n)}<main>
<section class="hero"><div class="wrap"><div><span class="eyebrow">Week {n} · 41039 Programming 1</span><h1>{esc(w['title'])}</h1><p class="lede">{esc(w['lede'])}</p><div class="meta-chips"><span class="chip">{len(w['sections'])} lecture sections</span><span class="chip">{sum(not e.get('static',False) for s in w['sections'] for e in s['examples'])} runnable examples</span><span class="chip">{len(w['exercises'])} exercises · {len(w['quiz'])} MCQs</span><span class="chip"><span class="lang java">Java</span> <span class="lang python">Python</span></span></div></div><div class="code-card" aria-hidden="true"><div class="bar"><span class="file">{esc(first['title'])}</span></div>{hero_code}</div></div></section>
<section class="block" id="concepts"><div class="wrap"><div class="sec-head"><span class="eyebrow">Week {n} · Interactive</span><h2>The lecture, then the practice</h2><p>Choose a section, or use the arrow keys in the section list. Hover or tap an underlined part of a program for its explanation. Run it, then use Edit to test a prediction of your own.</p></div><div class="lesson"><div class="lesson-side"><nav class="lesson-nav" role="tablist" aria-label="Lecture sections" aria-orientation="vertical">{''.join(tabs)}</nav></div><div class="lesson-content">{''.join(panels)}</div></div></div></section>
<section class="block" id="thisweek"><div class="wrap"><div class="sec-head"><span class="eyebrow">This week</span><h2>Read, practise, explain</h2><p>{w['study']}</p></div><ol>{source_links}</ol><div class="note"><span class="tag">Course schedule and assessment</span><p>These pages follow the topic sequence in <a href="https://canvas.uts.edu.au/courses/42626/pages/subject-schedule">Canvas Subject Schedule</a> and the Ed lessons. Some topics were introduced earlier on this website, so Week 6 consolidates Week 5 before collections. Use current announcements and Canvas assignments for deadlines. Practice here is independent of graded labs, code comprehension, assignments and exams.</p></div></div></section>
<div class="wrap pagenav"><a href="{previous}"><span class="dir">Previous</span>Week {n-1}</a><a href="{next_}"><span class="dir">Next</span>{'Week '+str(n+1) if n < 12 else 'All course materials'}</a></div>
<footer><div class="wrap"><p>41039 Programming 1 · Week {n} · {esc(w['title'])}</p></div></footer>
</main></div>{scripts}</body></html>'''


def main():
    weeks = json.loads(CONTENT.read_text())
    for w in weeks:
        n = w['week']
        (ROOT / f'weeks/week-{n}.html').write_text(render(w))
        data = {'id':f'week-{n}', 'quiz':w['quiz']}
        (ROOT / f'assets/w{n}-data.js').write_text('/* Newly authored practice, adapted from Ed and Canvas topics. */\nwindow.WEEK_DATA = '+json.dumps(data,indent=2)+';\n')
        (ROOT / f'assets/w{n}-exercises.js').write_text('/* Output expectations verified by scripts/check_week_content.py. */\nwindow.WEEK_EXERCISES = '+json.dumps(w['exercises'],indent=2)+';\n')
        print(f'Week {n}: {len(w["sections"])} sections, {len(w["exercises"])} exercises, {len(w["quiz"])} questions')


if __name__ == '__main__':
    main()
