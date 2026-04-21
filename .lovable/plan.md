

## Plan: Polish pass — cards, palette, mobile, motion, Work FAQ

Five focused workstreams, ordered by risk (lowest first). Each is independently shippable.

### 1. Fix Intelligence article cards (bug)

`ArticleCard.tsx` has two issues visible on the Intelligence grid:

- The card uses `flex flex-col h-full gap-6` but the parent grid doesn't stretch children, so heights vary and the description `<p>` runs unbounded — long descriptions visually bleed past the card edge on hover-scale.
- Description has no line clamp, so 3-line and 6-line cards sit side by side.

Changes:
- Add `h-full` to the card root and `items-stretch` to the parent grids in `Intelligence.tsx`, `IntelligenceTeaser.tsx`, `IntelligenceCategory.tsx`.
- Clamp description to 3 lines with `line-clamp-3` (Tailwind built-in, no plugin needed in v3).
- Tighten internal spacing: `gap-6 p-8` → `gap-4 p-7` so the card breathes the same regardless of description length.
- Reserve a fixed minimum for the title block (`min-h-[5.5rem]`) so the meta row + Read → always align across cards in a row.

### 2. Palette: subtle walnut → tree nudge

In `src/index.css`, shift `--walnut` from warm chocolate toward muted forest-brown, and quiet the brass slightly so it stops reading as honey. Conservative deltas — no layout impact.

```text
--walnut:  19 48% 8%   →  90 12% 11%   (cooler, greener-grey-brown)
--brass:   36 65% 58%  →  35 42% 52%   (less saturated, aged-bronze)
--body-text: 26 21% 20% → 60 10% 18%   (matches new walnut family)
--border:  39 21% 75%  →  60 12% 74%   (so borders don't read pink against new walnut)
```

`--green` and `--cream` stay untouched — they're the brand anchor. I'll spot-check the dark sections (Hero, walnut CTAs, Footer) after the swap and nudge brass opacity in 1–2 places if contrast drops.

### 3. Mobile: trim + merge

Two changes, both <768px only:

**Trim** — global section padding utility tightens on mobile:
- `.section-pad` becomes `py-14 md:py-[140px]` (was `py-20 md:py-[140px]`)
- Hero h1 drops one step on mobile (`text-5xl` → `text-[2.5rem]` with tighter leading)
- `IntelligenceTeaser` headline drops from `text-4xl` to `text-3xl` <md

**Merge** — on mobile only, render `OperatingProof` and `ClientVoice` as one alternating block:
- New wrapper `MobileProofVoice.tsx` interleaves 1 proof stat → 1 voice quote → 1 proof stat → 1 voice quote, single column, walnut background.
- Desktop is unchanged: `Home.tsx` renders `<OperatingProof />` and `<ClientVoice />` inside an `md:contents` wrapper, with `<MobileProofVoice />` shown only `<md:block`.
- Net effect on mobile: ~1.5 fewer screens of scroll between Method and IntelligenceTeaser.

### 4. Subtle motion: hero ambient + section eyebrow draw-in

**Hero ambient (CSS-only, no JS):**
- Add a single fixed-position SVG wood-grain layer behind `Hero.tsx` content, `opacity-[0.04]`, `pointer-events-none`, with a 60s linear `translate3d` keyframe drifting 2% horizontally then back. GPU-only transform, no layout, no paint.
- Respects `prefers-reduced-motion` (already wired in `index.css`).

**Eyebrow draw-in:**
- `BrassRule.tsx` already exists. Extend `Eyebrow.tsx` with an optional companion rule that animates `scaleX` from 0→1 (300ms, brass color) when its parent enters viewport via the existing `[data-reveal="in"]` hook.
- Apply to section eyebrows on Home, Method, Work, Intelligence — opt-in via `<Eyebrow withRule>`. No change to existing call sites unless we add the prop.

Bundle cost: ~0 JS (reuses ScrollReveal's IntersectionObserver), ~1KB SVG inlined.

### 5. Work page FAQ — Outcomes & proof

Add an `<FAQ variant="section">` block to `Work.tsx` between the "every engagement leaves a trained team" CTA and the EmailCapture, with 5–6 items on:
- How we measure whether the work compounded
- What "lasting change" means concretely (1–2 examples)
- How case studies are selected and what's anonymised
- Confidentiality boundaries during and after engagements
- What proof we share in a sales conversation that we can't publish
- Whether we'll talk to a reference client

The FAQ component already emits FAQPage JSON-LD via `assertFAQPageShape` — Work page will pick this up automatically through the existing prebuild validator.

I'll draft answers in the implementation step; you can edit them inline via Visual Edits afterwards.

---

### Order of execution

1. Cards fix (5 min, isolated)
2. Palette nudge (10 min, visual QA after)
3. Work FAQ (15 min, content)
4. Mobile trim + merge (25 min, new component)
5. Motion (20 min, last so palette is settled before tuning opacity)

### Out of scope (flag for later)

- Magnetic card hover / cursor-follow (you picked the lighter motion option)
- Hiding LogoCarousel on mobile (you picked merge instead)
- Any palette change to green or cream

