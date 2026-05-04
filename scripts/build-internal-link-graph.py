#!/usr/bin/env python3
"""
Build the People Ops internal-link graph and auto-insert the
"What this connects to" footer in every cluster article.

Score(a, b) = 3 * shared_keywords
            + 2 * shared_heading_tokens (H2/H3 only, stopwords removed)
            + 1 * shared_body_concepts   (bolded **terms** + Capitalised Phrases)

Top 4 neighbours per article are written into the footer as markdown links.
A machine-readable graph is also emitted to src/data/internal-link-graph.json
so the runtime can render the same recommendations elsewhere.
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "src/content/intelligence/people-ops"
GRAPH_OUT = ROOT / "src/data/internal-link-graph.json"

STOPWORDS = set("""a an the and or but of for to in on at by with from as is are was were be
been being this that these those it its their our your you we they i if then so not no into
about over under per via vs versus how what why when where who which whose more less most
many much one two three four five six seven eight nine ten people ops ai hr team teams work
working worked using use used your make makes making get gets getting do does doing first
new good great big small same other another any all every each""".split())

WORD = re.compile(r"[A-Za-z][A-Za-z\-']+")

def tokenize(text: str) -> list[str]:
    return [w.lower() for w in WORD.findall(text) if w.lower() not in STOPWORDS and len(w) > 2]

def parse_article(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    # frontmatter object literal
    fm_match = re.search(r"export const frontmatter\s*=\s*\{([\s\S]*?)\};", raw)
    fm_block = fm_match.group(1) if fm_match else ""
    title = re.search(r'title:\s*"([^"]+)"', fm_block)
    slug = re.search(r'slug:\s*"([^"]+)"', fm_block)
    desc = re.search(r'description:\s*"([^"]+)"', fm_block)
    kw_match = re.search(r"keywords:\s*\[([^\]]*)\]", fm_block)
    keywords = []
    if kw_match:
        keywords = [k.strip().strip('"').lower() for k in kw_match.group(1).split(",") if k.strip()]

    # body = everything after the closing `];` of the faqs export, or after frontmatter
    body_start = 0
    faqs_end = re.search(r"\];\s*\n", raw)
    if faqs_end:
        body_start = faqs_end.end()
    body = raw[body_start:]

    headings = re.findall(r"^#{2,3}\s+(.+)$", body, flags=re.MULTILINE)
    heading_tokens = []
    for h in headings:
        heading_tokens.extend(tokenize(h))

    # Body concepts: **bolded terms** and Capitalised multi-word phrases
    bolds = re.findall(r"\*\*([^*]{3,60})\*\*", body)
    caps = re.findall(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b", body)
    concept_tokens = []
    for c in bolds + caps:
        concept_tokens.extend(tokenize(c))

    return {
        "path": path,
        "slug": slug.group(1) if slug else path.stem,
        "title": title.group(1) if title else path.stem,
        "description": desc.group(1) if desc else "",
        "keywords": set(keywords),
        "heading_tokens": Counter(heading_tokens),
        "concept_tokens": Counter(concept_tokens),
    }

def score(a: dict, b: dict) -> tuple[int, dict]:
    shared_kw = a["keywords"] & b["keywords"]
    # token overlap = sum of min counts (capped to keep noise down)
    def overlap(ca: Counter, cb: Counter) -> int:
        return sum(min(ca[t], cb[t]) for t in ca.keys() & cb.keys())
    shared_h = overlap(a["heading_tokens"], b["heading_tokens"])
    shared_c = overlap(a["concept_tokens"], b["concept_tokens"])
    s = 3 * len(shared_kw) + 2 * shared_h + 1 * shared_c
    return s, {
        "shared_keywords": sorted(shared_kw),
        "shared_heading_tokens": shared_h,
        "shared_concept_tokens": shared_c,
    }

FOOTER_HEADINGS = ("## What this connects to", "## Where this connects", "## Where this lands")
FOOTER_RE = re.compile(
    r"\n##\s+(?:What this connects to|Where this connects)\s*\n[\s\S]*?(?=\n## |\Z)"
)

def render_footer(neighbours: list[dict]) -> str:
    bullets = "\n".join(
        f"- [{n['title']}](/intelligence/{n['slug']})" for n in neighbours
    )
    return (
        "\n## What this connects to\n\n"
        "Auto-recommended next reads in the People Ops cluster, ranked by shared concepts and headings:\n\n"
        f"{bullets}\n"
    )

def upsert_footer(text: str, footer: str) -> str:
    if FOOTER_RE.search(text):
        return FOOTER_RE.sub("\n" + footer.rstrip(), text).rstrip() + "\n"
    return text.rstrip() + "\n" + footer

def main() -> int:
    files = sorted(ARTICLES_DIR.glob("*.mdx"))
    articles = [parse_article(p) for p in files]
    by_slug = {a["slug"]: a for a in articles}

    graph = {}
    for a in articles:
        scored = []
        for b in articles:
            if a["slug"] == b["slug"]:
                continue
            s, detail = score(a, b)
            if s <= 0:
                continue
            scored.append((s, b, detail))
        scored.sort(key=lambda x: (-x[0], x[1]["slug"]))
        top = scored[:4]
        graph[a["slug"]] = {
            "title": a["title"],
            "neighbours": [
                {
                    "slug": b["slug"],
                    "title": b["title"],
                    "score": s,
                    **detail,
                }
                for s, b, detail in top
            ],
        }
        # Rewrite the footer (only if we have at least 3 neighbours).
        if len(top) >= 3:
            footer = render_footer([{"slug": b["slug"], "title": b["title"]} for _, b, _ in top])
            new_text = upsert_footer(a["path"].read_text(encoding="utf-8"), footer)
            a["path"].write_text(new_text, encoding="utf-8")

    GRAPH_OUT.parent.mkdir(parents=True, exist_ok=True)
    GRAPH_OUT.write_text(json.dumps(graph, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote graph for {len(graph)} articles -> {GRAPH_OUT.relative_to(ROOT)}")
    # Quick coverage report
    orphans = [s for s, v in graph.items() if not v["neighbours"]]
    if orphans:
        print("WARN orphans:", orphans)
    return 0

if __name__ == "__main__":
    sys.exit(main())
