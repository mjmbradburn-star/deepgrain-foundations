
## Goal

Weave a clear, repeated **"empowerment, not replacement"** thread through the site — specifically into the homepage Method teaser, the `/method` page narrative, and the Value Visualiser outputs — so a reader instantly understands the offering is about *partnering agents with people, training the team, and building lasting capability*, not headcount reduction.

## What's missing today

Reviewing the current copy:
- **`MethodPage.tsx`** — Read/Craft/Scale prose mentions "agents that remove friction without removing thought" and "teams who think well with AI", but it's a quiet line. The empowerment + training angle is implicit, not foregrounded.
- **`ValueVisualiser.tsx`** — Outputs are *Hours reclaimed, FTE freed, Annual value, **Hires avoided***. "Hires avoided" reads as headcount-replacement language. There's no output that captures *capability built* or *people upskilled*.
- **`Method.tsx` (homepage teaser)** — One-line promise, no mention of partnership/training.
- **No section anywhere** explicitly names the training/coaching/champion model as a deliverable, even though `the-champion-model.mdx` is a core Intelligence piece.

## Plan

### 1. Reframe Value Visualiser outputs (`ValueVisualiser.tsx`)

Replace **"Hires avoided"** with **"People upskilled"** — calculated as `team` (everyone in the function gets coached/enabled). Reframes the model from *cost saved* to *capability built*.

Rework the outputs grid to lead with capability:
- *Hours/week reclaimed* (kept) — what agents handle
- *FTE freed for higher-judgment work* (renamed from "FTE freed") — what people do instead
- *People upskilled* (new, replaces "Hires avoided") — = team size
- *Annual value created* (renamed from "Annual value")

Update the closing italic caveat to explicitly say: *"Reclaimed hours go back to your people for higher-judgment work — this is a partnership model, not a replacement one."*

Also tweak the section sub-paragraph to lead with the partnership framing before the numbers.

### 2. Add an "Empowerment" beat to `MethodPage.tsx`

Insert a short, punchy section between **Craft** and **Build vs Hire** titled something like *"Agents that partner. People who grow."* — three-sentence statement on a linen/walnut alternating band that names:
- Agents take the repeatable, low-judgment work.
- People are coached to design, run, and extend those agents — your champions.
- The capability stays in the team, not in a vendor.

This becomes the explicit empowerment anchor on the dedicated page.

Also subtly tighten the **Scale** section copy to mention the training/coaching outcome more directly ("the champions are still building" — already there, but lift it visually with a brass pull-quote or callout).

### 3. Add one line to homepage `Method.tsx` teaser

Inside the left-column paragraph, append a second sentence that names partnership + training in one breath, e.g.:

> *"Agents partner with your people on the repeatable work. We coach the champions who keep building after we leave."*

Keeps the teaser tight (still 2 sentences total in that paragraph) but plants the empowerment flag before the click-through.

### 4. Update the Visualiser teaser card on homepage

Change the static "Annual value · £1,209,600" headline output on the teaser card to a **two-stat** layout:
- *People upskilled · 25*
- *Annual value · £1.2M*

So the empowerment number sits **first**, anchoring the click-through on capability rather than cost.

## Files to change

- `src/components/sections/ValueVisualiser.tsx` — rename/replace outputs, update copy.
- `src/pages/MethodPage.tsx` — insert "Agents that partner. People who grow." section between Craft and BuildVsHire.
- `src/components/sections/Method.tsx` — extend left-column paragraph; replace single-stat footer with two-stat (People upskilled + Annual value).

No new components, no new dependencies, no schema changes.

## Why this works

- The **language shift** (upskilled vs hires avoided, partnership vs replacement) does the heavy lifting in seconds — anyone scanning the visualiser sees capability, not redundancy.
- The dedicated **empowerment band on `/method`** gives the philosophy a home so prospects can quote