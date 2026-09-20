#!/usr/bin/env python3
"""Fetch a photograph from Wikimedia Commons together with its real licence metadata.

Credits must never be hand-written (architecture.md §3a). This script asks the Commons
API for the authoritative artist / licence / date of every file it downloads, saves the
image into media/ and records the metadata in media/photo-credits.json, from which the
credit lines in the HTML are generated.

    python3 media/fetch-photo.py portrait-hoare "File:Sir Tony Hoare IMG 5125.jpg"
    python3 media/fetch-photo.py --width 1600 photo-conveyor "File:Conveyor system in a factory.jpg"
    python3 media/fetch-photo.py --search "tally counter"
"""
import argparse, html, json, os, re, sys, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "UTS-41039-Course-Site/1.0 (teaching material; inspector4crypto@gmail.com)"
HERE = os.path.dirname(os.path.abspath(__file__))
CREDITS = os.path.join(HERE, "photo-credits.json")


def api(**params):
    params.setdefault("format", "json")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def strip(s):
    """extmetadata values are HTML fragments; keep the text and the first link."""
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", " ", s)
    s = " ".join(html.unescape(s).split())
    # some files repeat the same phrase twice ("Unknown author Unknown author")
    half = len(s) // 2
    if len(s) % 2 == 1 and s[:half] == s[half + 1:]:
        s = s[:half]
    return s


def search(term, limit=12):
    d = api(action="query", list="search", srsearch=term, srnamespace=6, srlimit=limit)
    for r in d.get("query", {}).get("search", []):
        print(r["title"])


def fetch(name, title, width):
    d = api(action="query", titles=title, prop="imageinfo",
            iiprop="url|extmetadata|size|mime", iiurlwidth=width)
    pages = list(d.get("query", {}).get("pages", {}).values())
    if not pages or "imageinfo" not in pages[0]:
        sys.exit(f"!! not found on Commons: {title}")
    info = pages[0]["imageinfo"][0]
    meta = info.get("extmetadata", {})

    def m(key):
        return strip(meta.get(key, {}).get("value", ""))

    src = info.get("thumburl") or info["url"]
    ext = os.path.splitext(urllib.parse.urlparse(src).path)[1].lower()
    if ext in (".svg", ""):          # SVGs are rendered to PNG by the thumbnailer
        ext = ".png"
    out = os.path.join(HERE, name + ext)
    req = urllib.request.Request(src, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r, open(out, "wb") as f:
        f.write(r.read())

    record = {
        "file": os.path.basename(out),
        "commons": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_")),
        "artist": m("Artist"),
        "date": m("DateTimeOriginal") or m("DateTime"),
        "licence": m("LicenseShortName"),
        "licence_url": meta.get("LicenseUrl", {}).get("value", ""),
        "credit_line": m("Credit"),
        "description": m("ImageDescription")[:400],
    }
    credits = {}
    if os.path.exists(CREDITS):
        with open(CREDITS) as f:
            credits = json.load(f)
    credits[name] = record
    with open(CREDITS, "w") as f:
        json.dump(credits, f, indent=1, sort_keys=True, ensure_ascii=False)
        f.write("\n")
    print(f"{record['file']:34s} {os.path.getsize(out)//1024:5d} KB  "
          f"{record['licence'] or '?':16s} {record['artist'][:40]}")


def credit(name, prefix="Photo"):
    """Print the credit markup for one image, built from the stored API metadata."""
    with open(CREDITS) as f:
        r = json.load(f)[name]
    who = r["artist"] or "Wikimedia Commons"
    lic = r["licence"]
    lic_html = (f'<a href="{r["licence_url"]}">{lic}</a>' if r["licence_url"]
                else lic.lower())
    year = re.search(r"\d{4}", r["date"] or "")
    when = f", {year.group()}" if year else ""
    print(f'<span class="credit">{prefix}: <a href="{r["commons"]}">{who}{when}</a> &middot; {lic_html}</span>')


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--search", metavar="TERM")
    p.add_argument("--credit", metavar="NAME")
    p.add_argument("--prefix", default="Photo")
    p.add_argument("--width", type=int, default=800)
    p.add_argument("pairs", nargs="*", metavar="NAME FILE:Title")
    a = p.parse_args()
    if a.search:
        search(a.search)
    elif a.credit:
        credit(a.credit, a.prefix)
    elif len(a.pairs) >= 2 and len(a.pairs) % 2 == 0:
        for i in range(0, len(a.pairs), 2):
            fetch(a.pairs[i], a.pairs[i + 1], a.width)
    else:
        p.error("give NAME and a Commons File: title in pairs, or --search")
