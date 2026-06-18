## What changes

Swap the `WhoThisIsFor` section on the homepage for a new **BrainTeaser** section that sells the People Ops AI Brain and drives subscriptions. Same slot in `Home.tsx`, same green/walnut palette, but a far more useful piece of real estate.

## The section, top to bottom

Walnut curved panel on the green background (matching current treatment, so the page rhythm holds).

1. **Eyebrow:** `THE PEOPLE OPS AI BRAIN`
2. **Headline (display serif, cream):** "The AI brain we wish we'd had." with a second line "Free. Yours in a click."
3. **Lead paragraph (cream/85):** Short pitch in Matt's voice. 9 worked examples, 27 practical guides, four layers from foundations to leading change. The thing you'd build yourself if you had six months.
4. **The visual element (the centrepiece):** A "Four Layers" diagram, custom-built in JSX/SVG, not an image. Four stacked horizontal bands inside a rounded brass-bordered frame, each band labelled with a layer and a count, with thin connecting lines down the left edge so it reads as one organism rather than four tiles:
   ```text
   ┌─────────────────────────────────────────────┐
   │ 01  FOUNDATIONS         · workspace, prompts │
   │ 02  SKILLS              · the daily craft    │
   │ 03  SYSTEMS             · orchestration      │
   │ 04  HUMAN LAYER         · leading change     │
   └─────────────────────────────────────────────┘
                 9 examples · 27 guides
   ```
   Each row uses the existing cream/walnut/brass tokens. A faint vertical brass line ties them together. A small pulsing brass dot on the active row (cycles every few seconds) gives it life without animation noise. No external libs; pure Tailwind + a tiny CSS keyframe reusing existing tokens.
5. **CTA row:**
   - Primary `PillButton` → `/brain` "Get the Brain, free →" (analytics: `cta=get_brain`, `ctaLocation=home_brain_teaser`)
   - Secondary `PillButton` outline → `/brain#whats-inside` "See what's inside →"

Inline reassurance under the CTAs: "One email. No drip. Unsubscribe in one click." in cream/60.

## Files

- **New:** `src/components/sections/BrainTeaser.tsx` — the section described above. Reuses `Eyebrow`, `ScrollReveal`, `PillButton`, the existing `who-this-is-for` background images (so we don't ship new assets), and existing semantic tokens.
- **Edit:** `src/pages/Home.tsx` — replace the lazy `WhoThisIsFor` import + its `<div className="cv-auto">` slot with a lazy `BrainTeaser` in the same position so SEO/order is unchanged.
- **Keep:** `src/components/sections/WhoThisIsFor.tsx` stays on disk (unused) in case we want to restore it. If you'd rather delete it, say so and I will.

## Out of scope

- No changes to `/brain` itself, the capture form, or the edge function.
- No new images generated; the diagram is pure CSS/SVG so it stays sharp and fast.
- No copy changes elsewhere on the homepage.

## Open question

The headline I've drafted ("The AI brain we wish we'd had. Free. Yours in a click.") leans punchy. Happy to swap for something quieter, e.g. "Nine examples. Twenty-seven guides. One brain." Tell me if you want a different angle before I build.
