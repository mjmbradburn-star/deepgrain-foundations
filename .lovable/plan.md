# From deck to site: a human redesign that books audits

## What the deck does that the site doesn't

The Montagu deck has a voice the site is missing. Five things specifically:

1. **Topographic illustration as a structural element**, not decoration. Brass contour lines drift across green grounds and behave like a watermark of "reading the grain".
2. **Eyebrows with weight**: `— LABEL` in brass tracked caps, paired with a long display sentence in Cormorant. The eyebrow tells you the altitude, the headline tells you the move.
3. **Numeric anchors**: `40 min`, `12 min`, `1 FTE`, `5 to 1`. Display-serif numbers carry the argument. The site argues only in prose.
4. **Chip-and-arrow flows**: small bordered pills with icons, separated by hairline arrows. Used for ladders (Strategic / Functional / Individual), pipelines (Inputs → Orchestrator → Sub-agents → Human gate), and before/after.
5. **Two-tone slide rhythm**: green slide, linen slide, green slide. linen is where the worked example lives. Green is where the argument lives. The eye rests, then works, then rests.

The site has the same tokens (green, cream, linen, brass, walnut) but uses them flatly. Sections are mostly one tone, dividers are thin brass rules with nothing on either side, and the only "voice move" is a Cormorant italic pull quote. It reads like a beautiful skin over a generic AI scaffold.

## Why nobody books

Booking has been treated as a destination (a page) instead of a thread. The thread should run through every section: "you have a workflow worth fixing, here is what it looks like fixed, here is the 30-minute slot". Concretely:

- **No single number, no single workflow** anywhere on the home page. The deck opens with `40 min → 12 min`. The home page opens with a metaphor.
- **The audit CTA is a polite button** at the end of sections, not a recurring spine. The deck ends *every section* on a "do this now" or "your move" prompt.
- **The contact page is a form and a calendar**, not an offer. The deck frames the conversation as "20 min map, 10 min agree the first move, leave with a plan". The contact page needs that same shape.
- **No proof at click level**. The site asserts "we read the grain" without showing one grain being read. The deck shows the joiner-to-first-pay-run before/after card. That's the conversion engine.

## The design system upgrades (cross-cutting)

These ship once and every page benefits.

1. `**SectionEyebrow` component** — `— THE SHIFT`, `— THE METHOD`, `— THE PROOF`. Brass, tracked caps, em-dash prefix. Replaces the current loose use of `<Eyebrow>` so every section reads at one altitude.
2. `**TopoBackdrop` component** — SVG contour-line layer (the brass topographic motif from slides 1, 4, 6). Sits behind green hero sections at ~25% opacity. Two variants: ridge (right-aligned, like slide 1) and basin (centered, like slide 4). Replaces the current static bark backdrop in some places, complements it elsewhere.
3. `**MetricBlock` component** — display-serif number (Cormorant, 96–140px), small uppercase label above, body line below. Used for `40 min → 12 min`, `1 FTE`, `5 to 1`, `30 days`. Numbers become the headline, not the supporting evidence.
4. `**ChipFlow` component** — chips with icons + tracked caps label + display name, connected by hairline arrows. Use for the method ladder, the before/after, the agent architecture pattern. Replaces several current text-only step lists.
5. `**SectionDivider` upgrade** — instead of a thin brass rule, use a slim band: brass hairline + small section number `01 / 06` + the next eyebrow. Same role as the deck's footer rail (`Deepgrain · 04 · Montagu`). Gives the site a sense of progression and location.
6. `**AuditPrompt` component** — the recurring CTA spine. One-line offer ("Map one workflow with me. Thirty minutes."), brass arrow, opens contact with `?subject=` prefilled to the section the user came from. Appears at the bottom of every major section, not just the page bottom.
7. **Type rhythm tightening** — display headlines drop in size on shorter assertions and grow on the page-defining ones (slide 11 vs slide 1). One H1 per page, sentence case with a full stop. Italic Cormorant strictly reserved for the soft commentary line under a section (the deck does this consistently).

## Page-by-page

Every page lands on the same audit thread. The thread is: **eyebrow → assertion → evidence → one move you can make → audit prompt**.

### Home

- **Hero**: keep the green ground, add the `TopoBackdrop` ridge from slide 1. Eyebrow `— READ THE GRAIN`. Headline trimmed: "Work with the grain." Sub: italic Cormorant, "A resilient function re-architects its own work faster than disruption arrives." Three chips below: Strategic / Functional / Individual (already a strong pattern in the deck). Single CTA: "Book a 30-minute audit →".
- **The shift section** (new): port slide 4. `— THE SHIFT`, "Stop auditing roles. Start auditing clicks." Four `ChipFlow` cells: Value map → Role → Workflow → Atomic clicks. This is the most conversion-loaded section in the deck and the site has nothing like it.
- **Worked example** (new, replaces or augments current proof block): port slide 10. Cream ground. `40 min → 12 min` `MetricBlock` pair, before/after chips, judgement-step note. This is the single most persuasive thing in the deck. It belongs above the fold of "what we do".
- **Behind the scenes** (port slide 8): the Hermes agent architecture flow as a `ChipFlow` row. Inputs → Orchestrator → Sub-agents → Human gate. Anchors the claim "we run agents ourselves" with one diagram.
- **The bridge** (port slide 11): `Reclaimed capacity is not value until you spend it.` `1 FTE` `MetricBlock`. Three ways hours convert (avoid hire / absorb growth / redeploy). Closes with `AuditPrompt`.
- **Counterweight** (port slide 12): "What we do not automate." Judgement / accountability / relationship. Three pillar cards. Cream ground. This humanises the offer before the contact CTA and directly addresses the "AI will replace people" objection that's stopping bookings.
- Trim the current SimpleAIPrimer / BrainTeaser / IntelligenceTeaser stack down. Keep the brain primer, demote the teaser strips.

### Method (`/method`)

- Lead with `— THE METHOD` and `Three levels. You work at all three at once.` Port slide 5 verbatim as the page's spine. Strategic / Functional / Individual stacked as three numbered sections, each with its own eyebrow (`— LEVEL 01 · STRATEGIC`, etc), failure-mode / resilient-posture two-column (slide 6), and a "do this now" prompt that links to the audit. Worked example (slide 10) sits between functional and individual.

### Work (`/work`)

- Reframe from case-study gallery to **before/after gallery**. Each case study uses the same `MetricBlock` + chips pattern as slide 10. Top of page: one hero case study at full bleed. Below: a grid of smaller before/after cards. Closes with `AuditPrompt`.

### Enablement (`/enablement`)

- Port slide 13 as the spine. `Find your builder. Move your middle layer.` Two-column: the builder (upside) / the middle layer (where value leaks). Use the `Leaning in / Freezing / Resisting` marker pattern. Adds slide 14's 2×2 matrix as the framework visual (Value Creator / Enabler / Protector × Automation potential). This page currently has no visual hook; the matrix is the hook.

### Intelligence (`/intelligence`)

- Keep article surface unchanged but reframe the index page: eyebrow `— INTELLIGENCE`, headline a single assertion, then a magazine-style grid using `MetricBlock` thumbnails where each article advertises its strongest number or claim. Category sections separated by the upgraded `SectionDivider` (brass hairline + 01/06).
- Article template: drop the drop-cap, replace with deck-style opening — eyebrow + headline + italic Cormorant sub-line. Pull quotes use the deck's gold-rule + italic Cormorant pattern (slide 1 footer).

### About

- One page, one argument. Eyebrow `— WHO RUNS THIS`. Single Matt portrait, full-bleed cream ground. Headline assertion in Cormorant. Body broken into three altitudes (strategic / functional / individual) mirroring the method. Closes on `AuditPrompt`. Currently the about page is the weakest conversion surface; treating it as a personal letter that ends in a meeting invitation fixes that.

### Contact

- Reframe as **"20 min map, 10 min agree the first move"** (the deck's breakout shape on slide 15). Eyebrow `— THE FIRST MOVE`. Headline: "Map one workflow with me." Then three bullets describing what we'll cover (pick a workflow, atomise it, name the first move). The calendar embed sits inside a cream card with the same border treatment as the deck's worked-example card. The free-text form moves below the fold as a fallback ("Or send a note"). Today the form is co-equal with the calendar, which dilutes the booking action.

## Conversion-specific moves

These are not pure design — they are the things most likely to actually move bookings.

1. **One CTA, repeated**: "Book a 30-minute audit". Every section, every page, same words, same arrow. No "Get in touch", no "Learn more", no "Let's talk".
2. `**?subject=` prefill on every audit prompt** (the contact form already supports this — `ContactForm.tsx` reads `?subject=`). Each `AuditPrompt` passes a section-specific prefill so when someone clicks the audit link from the worked example, the contact form opens with "I'd like to map one workflow with you" already typed. Removes the blank-page friction.
3. **Calendar above form**, hero treatment, on `/contact`. The form is the fallback path.
4. **Single proof anchor on the home page**: the 40 min → 12 min worked example, not a logo carousel. The logo carousel demotes to a thin band below the worked example.
5. **Remove the "let's talk" politeness layer** in copy. The deck never says "let's talk". It says "do this now", "pick one workflow", "leave with a plan". Port that imperative voice across every CTA on the site.

## Implementation order

A two-pass build, not one big bang.

**Pass 1 (the spine, ~1 sitting):**

- Build the seven design-system components (`SectionEyebrow`, `TopoBackdrop`, `MetricBlock`, `ChipFlow`, upgraded `SectionDivider`, `AuditPrompt`, type rhythm).
- Rebuild the home page on top of them: hero, the shift, worked example, behind the scenes, the bridge, counterweight, audit prompt.
- Rebuild `/contact` as the "first move" shape.
- Roll the `AuditPrompt` + `?subject=` prefill onto every existing page bottom.

**Pass 2 (the rest of the surfaces):**

- Method page port.
- Work page reframe.
- Enablement page with the 2×2 matrix.
- Intelligence index reframe (articles themselves untouched).
- About page rewrite as a personal letter.

## Technical notes

- All new components live under `src/components/sections/deck/` so the existing section components stay untouched during pass 1 and we can A/B in preview before deleting the old.
- `TopoBackdrop` ships as an inline SVG (no asset request) so it doesn't cost a paint or a network round-trip. ~3–5kb gzipped.
- Tokens already exist (`--green`, `--cream`, `--brass`, `--walnut`, `--linen`). No `index.css` token additions needed for pass 1; pass 2 may add `--brass-soft` (an ~30% mix) for the topographic line layer.
- `Cormorant Garamond` is already loaded with `display=swap`. The deck uses heavier weights on numerals — confirm the variable font is being pulled, otherwise add the 500/600 weights to the existing Google Fonts URL.
- Memory rules respected: no em dashes in prose copy (only in eyebrows as a tracked-caps glyph, which matches the deck and matches the project memory's "use commas, full stops, or colons instead" rule for prose).

## What I will not change in this pass

- The brain / capture flows and any Supabase wiring.
- Article MDX content itself (only the index page and article template chrome).
- Existing SEO, JSON-LD, sitemap, prerendering plumbing.
- Bark texture sections — they stay where they are; topographic backdrops only go on green grounds where bark isn't already used.

---

If you approve, I'll start with **pass 1** (design system + home + contact + audit prompt rollout) so the conversion path is rebuilt end-to-end before we touch any secondary pages.