
## Goal

Build a dedicated `/enablement` page that gives the empowerment thread its own home — explaining the coaching curriculum, the champion model, and what "people upskilled" actually means inside a Deepgrain engagement.

## Page structure

Single route `/enablement`, lazy-loaded like the other pages, wrapped in `SiteShell` with `PageMeta` for SEO.

Sections, top to bottom:

1. **Hero band** (green/cream, like other page heros)
   - Eyebrow: "Enablement"
   - Headline: *"We don't replace your team. We grow it."*
   - Sub: one paragraph on partnership-not-replacement, naming agents + champions + lasting capability.

2. **What "people upskilled" means** (cream/walnut)
   - Three-column grid (stacks on mobile):
     - *Fluency* — everyone in the function can brief, run, and judge an agent.
     - *Craft* — three to four champions can design and ship workflows.
     - *Practice* — the team holds the capability after we leave.
   - Short intro paragraph above the grid.

3. **The champion model** (linen background, two-column on desktop)
   - Left: short prose explaining the model (3 short paragraphs lifted/condensed from `the-champion-model.mdx`).
   - Right: a brass-bordered callout listing the three things a champion needs (Air cover · Tools & budget · A small starting brief).
   - Closing link to the full Intelligence article.

4. **The coaching curriculum** (cream)
   - Numbered list of 5–6 modules delivered across an engagement, e.g.:
     1. Reading the grain — diagnosing where agents belong
     2. Briefing agents — prompts as specifications
     3. Wiring workflows — tools, triggers, handoffs
     4. Governance & trust — what stays human
     5. Measuring value — hours, judgment, capability
     6. Sustaining the practice — running the champion circle
   - Each module: title + one-sentence description + duration tag (e.g. "half day", "2 weeks").

5. **What you walk away with** (walnut/cream contrast band)
   - 4 short bullet outcomes — e.g. "A trained champion circle of 3–4 people", "8–12 production workflows", "A governance pattern your team owns", "A capability that compounds".

6. **CTA strip** — reuse the `Invitation` component (already used elsewhere) or a similar "Talk to us" pill button block linking to `/contact`.

## Files

**New:**
- `src/pages/Enablement.tsx` — the page itself, using existing primitives (`PageMeta`, `Eyebrow`, `BrassRule`, `ScrollReveal`, `PillButton`, `Invitation`).

**Edited:**
- `src/App.tsx` — add lazy import + `<Route path="/enablement" element={<Enablement />} />`.
- `src/pages/MethodPage.tsx` — change the existing "Champions trained" callout's link from `/intelligence/the-champion-model` to `/enablement` (so the empowerment narrative on /method now flows into the dedicated page, with the Intelligence article linked from inside /enablement instead). Also add a single inline link in the new empowerment beat paragraph pointing to `/enablement`.
- `src/components/layout/Footer.tsx` — add an "Enablement" link in the relevant column (soft launch — no top nav change).
- `public/sitemap.xml` — add `/enablement` URL entry.

**No changes** to top navigation (per soft-launch approach — discoverable via /method, footer, and sitemap).

## Visual + tone notes

- Match existing page rhythm: alternating cream/linen/walnut bands, brass accents, generous vertical space.
- Reuse typography classes already on `MethodPage` (font-display headings, eyebrow caps, text-balance).
- No new dependencies, no new components — just composition of existing primitives.
- Copy stays in the same voice as `the-champion-model.mdx` and the empowerment beat — calm, declarative, no hype.

## Why this works

- Gives prospects a single URL to send when asked "what does training look like?"
- Anchors "people upskilled" (the new Visualiser output) to a real, tangible deliverable.
- Keeps the homepage and /method tight — the deeper detail lives one click away.
- Soft launch via footer + /method link avoids cluttering top nav until traffic justifies it.
