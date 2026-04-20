

The user wants two distinct enhancements: (1) an interactive ROI/value calculator on the Method page, and (2) animated number visualisations on the homepage's OperatingProof section. Let me plan both.

## 1. Animated counters on the homepage (OperatingProof)

The `OperatingProof` section already has three big stat numbers (83, 70%, 0). Right now they just sit there. We'll animate them counting up when scrolled into view, using `IntersectionObserver` (matching the pattern in `ScrollReveal.tsx`).

- Create `src/components/ui/AnimatedNumber.tsx` — a small component that takes `value`, `suffix`, `duration`, and `decimals` props. Uses `requestAnimationFrame` with an ease-out curve. Respects `prefers-reduced-motion` (snap to final value).
- Update `OperatingProof.tsx` to use `<AnimatedNumber value={83} />`, `<AnimatedNumber value={70} suffix="%" />`, `<AnimatedNumber value={0} />`.
- Add a subtle brass underline that draws in beneath each stat as it animates (CSS scaleX transform).

## 2. Interactive value visualiser on the Method page

A "what is this work worth" slider block. Sits inside the existing Method page, after the explanatory prose, before the closing CTA. Lives on cream so it visually breaks from the surrounding walnut/green sections.

**Three sliders**, each driving a live calculation:

| Slider | Range | Default |
|---|---|---|
| Team size (people in the function) | 5 – 200 | 25 |
| Hours/week lost to coordination & repeatable work per person | 2 – 20 | 8 |
| Loaded hourly cost (£) | 40 – 150 | 70 |

**Live outputs** (animated via the same `AnimatedNumber` component):

- **Hours/week reclaimed** = team × hours × 0.6 (we typically reclaim ~60% of identified low-judgment time)
- **FTE freed** = (hours reclaimed × 48) / 1800
- **Annual £ value** = hours reclaimed × 48 × hourly cost
- **Equivalent new hires avoided** = FTE freed (rounded)

Plus a single horizontal bar that visually splits the team's week into "reclaimed" (brass) vs "remaining" (walnut/15) — animates as sliders move.

Honest framing copy underneath: *"A directional model, not a quote. The actual number for your function comes out of the diagnostic — usually within 10% of this."* This protects credibility (matches the tone of the `measuring-ai-value-in-people-ops` article).

**File:** `src/components/sections/ValueVisualiser.tsx`. Use the existing shadcn `Slider` primitive (need to check if it's installed; if not, add it via the standard pattern in `components/ui/`). Insert into `src/pages/MethodPage.tsx` at the appropriate point.

## Technical notes

- `AnimatedNumber` is reusable — homepage stats now, value visualiser later, future case study numbers.
- Slider values held in local React state; calculations are pure functions, recomputed each render (cheap).
- Number formatting: `Intl.NumberFormat('en-GB')` for thousands separators on the £ value.
- Mobile: sliders stack vertically, outputs grid 2×2 → 1 column under 640px.
- Respect `prefers-reduced-motion` everywhere (snap to value, no count-up).

## Out of scope for this round

- A full agents-vs-headcount toggle (interesting but heavier — would need real cost modelling for "build an agent" side; better as a follow-up once this lands).
- Animated SVG charts on the homepage (the count-up + brass underline gives the homepage enough motion without adding chart weight to the bundle).

## Files touched

- **New:** `src/components/ui/AnimatedNumber.tsx`
- **New:** `src/components/sections/ValueVisualiser.tsx`
- **Possibly new:** `src/components/ui/slider.tsx` (shadcn — only if not already present)
- **Edited:** `src/components/sections/OperatingProof.tsx` (wire counters + draw-in rule)
- **Edited:** `src/pages/MethodPage.tsx` (insert visualiser)

