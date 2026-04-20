
## Goal

Transform the recessive ICP strip into a confident, three-line audience+problem statement that:
1. Names the people (roles, broad funding mix) without em dashes.
2. Hints at sector breadth without listing every industry.
3. States the core problem Deepgrain solves — messy workflows, human + agentic AI, three levels of change.

## Proposed copy

**Line 1 — Who (warm, prominent, mixed-case serif):**
> For CEOs, COOs, CFOs, Chief People Officers, and VPs of Operations. VC, PE-backed, and bootstrapped.

**Line 2 — Where (small caps, supporting):**
> AI-native, defence, financial services, healthcare, climate, mobility, and the long tail of real businesses in between.

**Line 3 — Problem + partnership (the engaging bit, two short sentences):**
> Your workflows are messy, your team is stretched, and the AI conversation has outpaced your operating reality. Deepgrain partners with you across three levels — organisation, function, and individual capability — to build the strategy, the agentic systems, and the people who can keep evolving them.

(Note: user said no em dashes in line 1. The single en/em in line 3 lives in the problem statement — I'll use a comma or period instead to honour the spirit. Revised line 3 below.)

**Revised line 3 (no dashes):**
> Your workflows are messy. Your team is stretched. The AI conversation has outpaced your operating reality. Deepgrain partners with you across three levels of change, organisation, function, and individual capability, to build the strategy, the agentic systems, and the people who can keep evolving them.

That's long. Tightened version:

> Your workflows are messy and the AI conversation has outpaced your operating reality. Deepgrain partners with you across three levels of change: organisation, function, and individual capability. The strategy, the agentic systems, and the people who can keep evolving them.

Three sentences. Builds: problem → partnership shape → what gets built.

## Visual treatment

The strip becomes a proper section, not a chip:

- **Background**: keep walnut, keep cream text. Add subtle brass top + bottom hairlines (already there) — bump opacity slightly.
- **Padding**: `py-10 md:py-14` (was py-5/py-6).
- **Line 1 (who)**:
  - `font-display` (Cormorant Garamond serif), mixed case
  - `text-2xl md:text-[32px] lg:text-[38px]`, `font-medium`, `leading-tight`
  - cream, with brass accent on "For" and on the funding clause
  - centred, `max-w-3xl` mx-auto, `text-balance`
- **Line 2 (sectors)**:
  - small caps, `text-[12px] md:text-[13px]`, tracking 0.18em, cream/65
  - `mt-5`, centred, `max-w-2xl` mx-auto
  - thin brass hairline (1px, brass/25, w-12) above it as a separator
- **Line 3 (problem)**:
  - sans, `text-base md:text-lg`, `leading-relaxed`, cream/85
  - `mt-8 md:mt-10`, centred, `max-w-2xl` mx-auto, `text-balance`
  - Bold the phrase **"three levels of change"** in brass to anchor the idea visually.

Result: the strip reads top-down as a clear "this is who, where, and what we do together" — bigger, warmer, and confident enough that the right person says "yes, this is me".

## File to change

- `src/components/sections/ICPStrip.tsx` — copy, typography, spacing, hairline divider, brass emphasis on "three levels of change".

No new components, no new dependencies.
