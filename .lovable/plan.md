# SEO + LLM Visibility Plan

## What the GSC data actually says (last 28 days)

- **Volume is tiny:** 14 clicks / 121 impressions. Average position 30. This is a cold-start problem, not a ranking decay problem.
- **Brand works:** "deepgrain" / "deep grain" → position 1-4, 58% CTR. Not the issue.
- **The opportunity is one cluster:** "ai operating system" and variants ("ai os", "artificial intelligence operating system", "ai based operating system", "ai powered operating system") = **35+ impressions, 0 clicks, position 70-82.** Google sees us as topically relevant but not authoritative.
- **One page is on the cusp:** `/intelligence/setting-up-your-ai-workspace` = position 7.15, 13 impressions. One push moves it to page 1.
- **Two pages exist but Google can't find them properly:**
  - `/intelligence/people-ops` (the hub) gets 16 impressions but **is missing from sitemap.xml**.
  - `aioi.deepgrain.ai` (the AI Operating Index subdomain) appears with 5 impressions and is not interlinked from the main site sitemap or nav.
- **Mobile CTR is 33% vs desktop 9.8%.** Mobile titles/snippets are working harder than desktop. Don't break this.
- **Long-tail proof:** "how does the enablement agent integrate with coaching workflows" - someone is already asking conversational/AI-style queries. This is exactly what LLM citation traffic looks like.

## Strategy: three concentric rings, all low credit cost

```text
  Ring 1 (this week)   Technical hygiene + sitemap fixes
  Ring 2 (next 2 wks)  Own the "AI operating system" cluster
  Ring 3 (ongoing)     LLM-citation surface + low-effort backlinks
```

---

## Ring 1: Technical hygiene (1 build session, ~no API spend)

1. **Fix sitemap gaps.** Add `/intelligence/people-ops` (hub) and the `aioi` subdomain entry. Add `lastmod` updates so Google re-crawls.
2. **Add hreflang + self-canonical sanity check** on `/intelligence/*` (currently inherits index.html canonical in some lazy routes — verify `PageMeta` is firing on every article).
3. **Fix http→https duplication.** GSC shows both `http://deepgrain.ai/` and `https://deepgrain.ai/` getting impressions. Confirm 301 from http and from any non-www variants.
4. **Internal linking audit.** Every "AI OS" article should link to the pillar page (`/intelligence/what-is-an-ai-operating-system`) with the exact-match anchor. Currently that page is at **position 75 with 35 impressions** - the highest single-page opportunity in the entire account.
5. **Submit IndexNow ping** for all updated URLs (already automated, just trigger after the sitemap change).

## Ring 2: Own the "AI operating system" cluster (2 build sessions)

This is your single biggest unlock. Google has decided you're topically related but not authoritative. Fix that with structured depth, not more articles.

1. **Rebuild `/intelligence/what-is-an-ai-operating-system` as a true pillar page:**
   - Add a TOC, a clear definition in the first 60 words (snippet bait), an H2 for each query variant ("AI OS", "AI-based operating system", "AI-powered operating system").
   - Add a comparison table (AI OS vs Operating Model vs Workflow Automation).
   - Add `FAQPage` JSON-LD with the 5 actual GSC query variants as questions. You already have the FAQ infra (`src/test/faq-jsonld.test.ts`).
   - Add `Article` + `BreadcrumbList` JSON-LD if missing.
2. **Cluster all 6 related articles** behind it. Every related article links *up* to the pillar with anchor text "AI operating system". The pillar links *down* to each as a "Related" rail.
3. **Push `/intelligence/setting-up-your-ai-workspace` from position 7 → page 1.** Add 2-3 internal links from higher-traffic pages (Brain page, People Ops hub) and tighten the title to lead with the keyword.
4. **Add the AIOI subdomain to the main sitemap as a separate `<sitemap>` reference** (sitemap index pattern), or proxy/link it from the homepage so it inherits authority.

## Ring 3: LLM citations + cheap backlinks (ongoing, near-zero credit cost)

LLMs cite sources that are: well-structured, frequently updated, and quoted by other sites. We optimise for all three.

1. **`llms.txt` + `llms-full.txt` are already shipping.** Confirm they list every pillar page with a one-line summary (this is what Perplexity/Claude actually parse).
2. **Add a "Definitions" block** to each pillar (Read·Craft·Scale, AI OS, Operating Intervention, Grain). Single-sentence, quotable, schema-marked as `DefinedTerm`. LLMs scrape these verbatim.
3. **Distribution playbook (no credits, just time):**
   - Cross-post 3 best articles as LinkedIn long-form with canonical link back to deepgrain.ai.
   - Submit `/intelligence/what-is-an-ai-operating-system` to: Hacker News (Show HN if you reposition the AIOI), Indie Hackers, the Lenny's Newsletter community, r/PeopleOps, r/HRTech.
   - List Deepgrain on: Clutch, Consultancy.uk, The Org, Crunchbase, AI consultancy directories.
   - Pitch one guest post to `peopleops.com` or `Charthop`'s blog with a backlink to the People Ops hub.
4. **One-click Notion/Slack share** on every Intelligence article. Free distribution = backlinks over time.
5. **Quarterly "AI Operating Index" report** on the `aioi` subdomain, gated by email. This is your linkable asset - PR/Substack writers cite reports, not blog posts.

## What I am NOT proposing

- No new content commissioned until the existing pillar ranks. Writing more articles when 30 articles already underperform is the wrong move.
- No paid backlink services.
- No sweeping redesign. The site converts; the funnel isn't the bottleneck. Discovery is.

## Technical scope (for the build phase)

Files I'd touch in Ring 1+2:
- `public/sitemap.xml` - add People Ops hub, AIOI reference, refresh lastmods
- `src/content/intelligence/what-is-an-ai-operating-system.mdx` - rewrite as pillar
- `src/content/intelligence/setting-up-your-ai-workspace.mdx` - title + internal links
- `src/components/seo/PageMeta.tsx` - add optional `FAQPage` + `DefinedTerm` JSON-LD helpers
- `src/components/intelligence/mdxComponents.tsx` - add `<Definition>` and `<Faq>` components
- `public/llms.txt` / `public/llms-full.txt` - re-sync after pillar rewrite
- Trigger `ping-indexnow` after deploy

## Success metric (check at day 30)

- Pillar page position: 75 → under 20
- "Setting up your AI workspace": position 7 → under 5
- Total impressions: 121 → 400+
- At least 1 LLM citation appearing in `referer` or branded search uplift

Approve and I'll execute Ring 1 + Ring 2 in the next session. Ring 3 is mostly your distribution work, but I'll prep the LinkedIn-ready exports and directory submission copy.
