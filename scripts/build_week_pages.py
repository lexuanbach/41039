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
    for note in item['notes']:
        # [token, explanation] or [token, explanation, title]; the title defaults to the token.
        token, explanation = note[0], note[1]
        title = note[2] if len(note) > 2 else token
        for line_no, line in enumerate(item['code'].splitlines(), 1):
            if token in line and (line_no, token) not in used:
                used.add((line_no, token))
                notes.append(f'<li data-line="{line_no}" data-match="{esc(token)}" data-title="{esc(title)}">{explanation}</li>')
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
    after = ''
    if item.get('compile_error'):
        # A deliberate compile error: Run shows the browser's compiler; Ed uses javac.
        after = (f'<div class="note warn"><span class="tag">Two compilers, one verdict</span><p>Press Run and this browser\'s '
                 f'Eclipse compiler reports: <code>{esc(item["ecj_error"])}</code>. On Ed, <code>javac</code> says: '
                 f'<code>{esc(item["javac_error"])}</code>. Fix it: press ✎ Edit, delete line {esc(item["javac_error"].split(":")[1])} '
                 f'and run again. It prints <code>{esc(item["fixed_output"].strip())}</code>.</p></div>')
    return f'''<div class="p1-explain" data-lang="{item['lang']}" data-title="{esc(item['title'])}" data-stdin="{esc(item.get('stdin', ''))}"{mode}>
<script type="text/plain" data-role="source">{item['code']}</script>
<ol data-role="notes">{''.join(notes)}</ol>{output}</div>{after}'''


def visual(item):
    """An interactive diagram drawn by assets/visuals.js from the JSON spec it carries."""
    spec = json.dumps(item, ensure_ascii=False).replace('</', '<\\/').replace('<!--', '<\\u0021--')
    return f'''<div class="p1-viz" data-kind="{esc(item['kind'])}" data-title="{esc(item['title'])}">
<script type="application/json" data-role="spec">{spec}</script>
<div class="viz-fallback"><p class="viz-title">{esc(item['title'])}</p><p>{item['intro']}</p><p><em>This interactive diagram needs JavaScript.</em></p></div></div>'''


PHOTO_CREDITS = ROOT / 'media/photo-credits.json'
EXT = ' target="_blank" rel="noopener"'


def photo_credit(name, prefix='Photo'):
    """The credit line for a Commons photograph, built from media/photo-credits.json (never by hand)."""
    r = json.loads(PHOTO_CREDITS.read_text())[name]
    who = r['artist'] or 'Wikimedia Commons'
    lic = f'<a href="{esc(r["licence_url"])}"{EXT}>{esc(r["licence"])}</a>' if r['licence_url'] else esc(r['licence'].lower())
    year = re.search(r'\d{4}', r['date'] or '')
    when = f', {year.group()}' if year else ''
    return f'<span class="credit">{prefix}: <a href="{esc(r["commons"])}"{EXT}>{esc(who)}{when}</a> &middot; {lic}</span>'


def photo_img(item):
    r = json.loads(PHOTO_CREDITS.read_text())[item['photo']]
    pos = f' style="object-position: {esc(item["position"])}"' if item.get('position') else ''
    return f'<img src="../media/{esc(r["file"])}" loading="lazy"{pos} alt="{esc(item["alt"])}">'


def comic_credit(item):
    # the exact credit markup of the comics on Weeks 1-5
    return (f'<span class="credit"><a href="https://xkcd.com/{item["num"]}/">xkcd {item["num"]}, <em>{esc(item["title"])}</em></a> '
            f'({esc(item["year"])}) &mdash; Randall Munroe, <a href="https://creativecommons.org/licenses/by-nc/2.5/">CC BY-NC 2.5</a></span>')


def media(item):
    """Photographs and comics, in the same components Weeks 1-5 use (design.md: .photo, .media-row,
    .note.with-media, .fig). Credits come from media/photo-credits.json or the comic's xkcd metadata."""
    kind = item['kind']
    lead = f'<strong>{item["lead"]}</strong> ' if item.get('lead') else ''
    if kind in ('banner', 'side'):
        return f'<figure class="photo {kind}">{photo_img(item)}<figcaption>{lead}{item.get("caption", "")} {photo_credit(item["photo"])}</figcaption></figure>'
    if kind == 'media-row':
        # without its own html, a media-row placed at concept-N wraps that concept (see render)
        width = esc(item.get('width', '20rem'))
        return (f'<div class="media-row" style="--media-w:{width}">{item.get("wrapped") or "<div>" + item["html"] + "</div>"}'
                f'<figure class="photo side">{photo_img(item)}<figcaption>{lead}{item.get("caption", "")} {photo_credit(item["photo"])}</figcaption></figure></div>')
    if kind == 'did-you-know':
        source = ''.join(f' <a href="{esc(url)}"{EXT}>{label}</a>' for label, url in item.get('sources', []))
        return (f'<div class="note with-media"><div class="note-text"><span class="tag">{esc(item.get("tag", "Did you know?"))}</span>'
                f'<p>{item["text"]}{source}</p></div><figure class="note-media">{photo_img(item)}'
                f'<figcaption>{photo_credit(item["photo"])}</figcaption></figure></div>')
    if kind == 'comic':
        size = esc(item.get('size', 'fig-narrow'))
        caption = item.get('caption', '')
        return (f'<figure class="fig {size} plain"><img src="../media/xkcd-{item["num"]}.png" alt="{esc(item["alt"])}" loading="lazy">'
                f'<figcaption>{caption}{comic_credit(item)}</figcaption></figure>')
    raise ValueError(f'Unknown media kind {kind}')


def credits_tables(w):
    """Photographs and Comics tables for the Further reading panel, as on the Week 4-5 pages."""
    items = [m for s in w['sections'] for m in s.get('media', [])]
    photos = [m for m in items if m['kind'] != 'comic']
    comics = [m for m in items if m['kind'] == 'comic']
    out = ''
    head = '<h3 style="font-family:Archivo,sans-serif;font-size:1rem;margin:1.4rem 0 0.6rem">'
    if photos:
        data = json.loads(PHOTO_CREDITS.read_text())
        rows = ''
        for name in dict.fromkeys(m['photo'] for m in photos):
            r = data[name]
            title = re.sub(r'\.[A-Za-z]+$', '', r['commons'].split('File%3A', 1)[-1])
            from urllib.parse import unquote
            title = unquote(title).replace('_', ' ')
            lic = f'<a href="{esc(r["licence_url"])}">{esc(r["licence"])}</a>' if r['licence_url'] else esc(r['licence'].lower())
            year = re.search(r'\d{4}', r['date'] or '')
            rows += (f'<tr><td class="mono">{esc(re.sub(r"^(photo|fact|portrait)-", "", name))}</td><td><a href="{esc(r["commons"])}">{esc(title)}</a> &mdash; '
                     f'{esc(r["artist"] or "Wikimedia Commons")}{", " + year.group() if year else ""} &middot; {lic}</td></tr>')
        out += (f'{head}Photographs</h3><p style="color:var(--ink-soft);font-size:0.92rem">From <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, '
                'reused under the licence each one names. Author and licence come from the Commons API rather than from anyone&rsquo;s memory &mdash; see '
                '<span class="mono">media/fetch-photo.py</span>.</p><div class="tbl-scroll"><table class="tbl"><thead><tr><th>Image</th><th>Source</th></tr></thead>'
                f'<tbody>{rows}</tbody></table></div>')
    if comics:
        rows = ''.join(f'<tr><td class="mono">xkcd {m["num"]}</td><td><a href="https://xkcd.com/{m["num"]}/"><em>{esc(m["title"])}</em></a> ({esc(m["year"])}) &mdash; '
                       f'Randall Munroe, <a href="https://creativecommons.org/licenses/by-nc/2.5/">CC BY-NC 2.5</a></td></tr>' for m in comics)
        out += (f'{head}Comics</h3><div class="tbl-scroll"><table class="tbl"><thead><tr><th>Comic</th><th>Source</th></tr></thead>'
                f'<tbody>{rows}</tbody></table></div>')
    return out


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
    def section_meta(s):
        count = len(s['examples']) + len(s.get('extras', []))
        visuals = len(s.get('visuals', []))
        return f"{count} examples · " + (f"{visuals} interactive · " if visuals else '') + 'Java + Python'
    sections = [(s['title'], section_meta(s)) for s in w['sections']]
    sections += [('Coding exercises', f"{len(w['exercises'])} tasks · auto-marked"), ('Team activity', '2 activities · discussion'), ('Quiz', f"{len(w['quiz'])} questions · explained"), ('Further reading', 'Ed + Canvas + documentation')]
    tabs = []
    panels = []
    for i, (title, meta) in enumerate(sections, 1):
        key = f's{i:02}'
        tabs.append(f'''<button class="lesson-tab" role="tab" id="tab-{key}" aria-controls="panel-{key}" aria-selected="{'true' if i == 1 else 'false'}" tabindex="{0 if i == 1 else -1}" data-target="{key}"><span class="t-num">{i:02}</span><span class="t-text"><span class="t-title">{esc(title)}</span><span class="t-meta">{esc(meta)}</span></span></button>''')
        if i <= len(w['sections']):
            s = w['sections'][i - 1]
            # media items: place 'top' (opens the section), 'concept-N' (after concept N; a media-row
            # without html wraps that concept), 'after-visuals' (after the interactive diagrams) or 'end'
            def wraps(m, where):
                return m['kind'] == 'media-row' and 'html' not in m and m.get('place') == where
            placed = lambda where: ''.join(media(m) for m in s.get('media', []) if m.get('place', 'end') == where and not wraps(m, where))
            body = placed('top')
            for j, c in enumerate(s['concepts'], 1):
                block = f'<div class="concept"><h3><span class="idx">{i}.{j}</span>{c[0]}</h3>{c[1]}</div>'
                for m in s.get('media', []):
                    if wraps(m, f'concept-{j}'):
                        block = media(dict(m, wrapped=block))
                body += block + placed(f'concept-{j}')
            body += ''.join(visual(v) for v in s.get('visuals', []))
            body += placed('after-visuals')
            body += ''.join(example(e) for e in s['examples'] + s.get('extras', []))
            body += placed('end')
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
            body += '</div>' + credits_tables(w)
        panels.append(f'''<section class="lesson-panel" role="tabpanel" id="panel-{key}" aria-labelledby="tab-{key}" tabindex="0"{'' if i == 1 else ' hidden'}><h3 class="panel-head"><span class="panel-num">{i:02}</span>{esc(title)}</h3>{body}</section>''')
    first = w['sections'][0]['examples'][0]
    hero_code = '<pre>' + esc('\n'.join(first['code'].splitlines()[:15])) + '</pre>'
    source_links = ''.join(f'<li><a href="{esc(url)}">{esc(title)}</a></li>' for title,url,_ in w['sources'])
    previous = f'week-{n-1}.html'
    next_ = f'week-{n+1}.html' if n < 12 else '../index.html#materials'
    visual_count = sum(len(s.get('visuals', [])) for s in w['sections'])
    interactive_chip = f'<span class="chip">{visual_count} interactive diagrams</span>' if visual_count else ''
    names = ['runtime','highlight','editor','console-ui','explain'] + (['visuals'] if visual_count else []) + [f'w{n}-data',f'w{n}-exercises','exercises','course']
    scripts = ''.join(f'<script src="../assets/{name}.js"></script>\n' for name in names)
    return f'''{head}<body>{header}<div class="layout">{course_nav(n)}<main>
<section class="hero"><div class="wrap"><div><span class="eyebrow">Week {n} · 41039 Programming 1</span><h1>{esc(w['title'])}</h1><p class="lede">{esc(w['lede'])}</p><div class="meta-chips"><span class="chip">{len(w['sections'])} lecture sections</span><span class="chip">{sum(not e.get('static',False) for s in w['sections'] for e in s['examples'] + s.get('extras', []))} runnable examples</span>{interactive_chip}<span class="chip">{len(w['exercises'])} exercises · {len(w['quiz'])} MCQs</span><span class="chip"><span class="lang java">Java</span> <span class="lang python">Python</span></span></div></div><div class="code-card" aria-hidden="true"><div class="bar"><span class="file">{esc(first['title'])}</span></div>{hero_code}</div></div></section>
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
