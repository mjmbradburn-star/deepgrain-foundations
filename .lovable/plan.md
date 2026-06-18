# SEO/AEO + CRO delivery plan

I cross-checked both docs against the current site. Most of the SEO/AEO plan is already shipped from earlier batches. The CRO plan is mostly outstanding. Below: what to skip (already done), what to ship, and two questions I need answered before I touch anything.

## Already done, skip

- **Intelligence essays crawlable/indexable** — 40+ MDX articles live under `/intelligence/*` with per-route `<PageMeta>`, canonical, OG, Article JSON-LD.
- **Problem-led pages** — `/answers/:slug` (15+ questions), `/intelligence/cluster/:slug`, `/intelligence/pillar/:slug`, and three `/intelligence/*-vs-*` compare pages already exist.
- **JSON-LD** — `SiteEntityLd` emits Organization + Person (Matthew Bradburn) + WebSite + Service globally; Article + FAQ JSON-LD on the relevant routes.
- **Sitemap + robots.txt** — fixed last turn; 104 entries on `https://www.deepgrain.ai`.
- **Founder entity signals** — About page already centres on Matthew Bradburn with Person schema, sameAs LinkedIn, bio, and named references.
- **Hero secondary CTA** — already swapped to "Book an audit → /contact" last turn.

## Conflict to resolve before I build

The CRO doc wants **"Book an intro"** as the *primary* CTA, with "See the method" as the quieter secondary. We currently have it the other way round (primary = "How we work", secondary = "Book an audit"). Need a call: do I swap them so Book becomes primary (filled) and Method becomes secondary (outline)? See Question 1.

## To deliver (CRO-led, single pass)

1. **Hero subhead sharpen.** Replace the current subhead with the CRO copy:
  > "We read how your organisation actually operates, then build the AI systems and team capability to scale it, so the gains compound after we leave."
  >  Keep "Work with the grain." as H1. House style: no em dashes (use commas/full stops).
2. **CTA hierarchy (pending Q1).** Either swap primary/secondary in `Hero.tsx`, or keep as-is. If swapping, primary = "Book an audit → /contact" (filled), secondary = "See the method → /method" (outline).
3. **Stats above the fold render real numbers immediately.** `OperatingProof.tsx` currently uses `<AnimatedNumber>` that animates from 0. Change so the final value is the initial render (SSR/first paint shows "83", "70%", "0"), and the count-up only runs as a progressive enhancement when the section is in view. Preserves the visual flourish, removes the "zeros on first paint" risk.
4. **Named-ish testimonial attribution.** `ClientVoice.tsx` and `MobileProofVoice.tsx` currently read "Chief People Officer, Defence Technology Company". Per CRO best practice, tighten to a half-named form (see Question 2). I will not invent a real name.
5. **Reduce mid-page CTA competition on Home.** Audit Home sections (`WhatWeDo`, `BuildVsHire`, `Method`, `IntelligenceTeaser`, `Invitation`, etc.) and ensure only the closing `Invitation` section carries a strong primary "Book an audit" CTA. Demote other mid-page links to discovery-style text links (no filled pill buttons competing with the hero ask). Nav stays unchanged.

## Out of scope (already covered or non-blocking)

- New service/offer pages for "Read · Craft · Scale" — `/method` already covers this. Flag if you want a dedicated `/services` page split, otherwise skip.
- Case-study pages for Defence Tech / FinEdge — would need real source material from you; logging as a follow-up rather than fabricating.
- Lighthouse perf audit — noted as a later follow-up in the SEO doc itself.

## Technical notes (for me, not you)

- `Hero.tsx` lines 45-58: subhead text + CTA order.
- `OperatingProof.tsx`: change `AnimatedNumber` to accept an `initial` prop or render `value` as text immediately, then animate via `IntersectionObserver`. `MobileProofVoice.tsx` may need parallel treatment.
- `ClientVoice.tsx` line ~16 + `MobileProofVoice.tsx` `attribution` field: single source of truth would be nice but not required for this pass.
- Mid-page CTA audit: grep `PillButton variant="filled"` across `src/components/sections/*` and downgrade non-closing ones to outline or plain text links.

## Questions before I build

1. **CTA hierarchy.** Make "Book an audit" the *primary* (filled) hero CTA and demote "How we work / See the method" to secondary? CRO doc says yes; you most recently asked for "Book an audit" only as the secondary. Confirm which wins. YES - SWAP THEM
2. **Testimonial attribution.** Pick one:
  - a) "Chief People Officer, defence technology scale-up. Name on request."
  - b) Use the real name and company (please paste).
  - c) Leave anonymous as-is. leave anonymous