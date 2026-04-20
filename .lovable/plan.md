

The user re-confirmed the same two answers (new project + all three levels). My previous reply already explained that AIOI must be built in a separate Lovable project — I can't create that from inside this codebase.

Two productive things I *can* do in **this** project right now while they spin up the new one:

1. Add cross-link CTAs pointing to `aioi.deepgrain.ai` (homepage, article inline band, footer)
2. Wait for them to create the new project, then build there

The cross-links are small and safe. The article inline AIOI CTA is currently a placeholder green band — wiring it to the real (future) URL is a clean tidy-up.

## Plan — cross-links to AIOI in this project

**1. Homepage hero** (`src/components/sections/Hero.tsx`)
- Add secondary outline PillButton next to the primary CTA: "Take the AI Operating Index →" linking to `https://aioi.deepgrain.ai`

**2. Article inline AIOI band** (`src/pages/IntelligenceArticle.tsx`)
- Replace the placeholder green CTA band mid-article with a real link to `https://aioi.deepgrain.ai`
- Copy: eyebrow "Diagnostic", headline "Where does your operating system stand?", subline "Take the AI Operating Index — a free 8-pillar diagnostic.", PillButton "Begin the index →"

**3. Footer** (`src/components/layout/Footer.tsx`)
- Add "AI Operating Index ↗" link under the Explore column, external

All three use a single constant `AIOI_URL = "https://aioi.deepgrain.ai"` so we can flip it later if the subdomain changes.

## What happens next for AIOI itself

You create the new Lovable project (`aioi-deepgrain`), enable Lovable Cloud, re-upload the spec there, and paste:

> "Build AIOI per the spec. All three levels (Company, Function, Individual). Start with element 1 (design system + primitives)."

Then I execute elements 1–14 in that project, one per turn, exactly as the approved 14-element plan.

## Ask

Do you want me to add the three cross-links to this project now? Reply **"yes, add the cross-links"** and I'll do it. Or **"skip, I'll come back when AIOI exists"** and I'll wait.

