## Brain page rebuild, Montagu-grade

The current /brain hero is the old picture-and-headline pattern: a stock forest photo with the form bolted underneath in small print. There is no real sell, the form is tiny, and the most persuasive thing we own (the actual flipbook of a Brain article) is buried behind the cards. We rebuild the page so the work does the selling.

### New page order

```text
1. Hero               editorial, no photo, big sell, big form
2. Sample article     CoworkPreview flipbook, lifted to second slot
3. What's inside      9 examples, 27 guides grid
4. Author             Matthew portrait + bio
5. Second CTA         keep, simplified
```

### Section 1, Hero, Montagu-esque

Out: the forest photo, the green overlay, the small italic form, the chevron bob.

In: a full-bleed cream/linen canvas, a single oversized display headline set tight, an editorial deck paragraph, then the form treated as a real artefact, not a footnote.

```text
┌──────────────────────────────────────────────────────────┐
│ THE BRAIN · ISSUE 01                  27 GUIDES · FREE  │
│ ──────────────────────────────────────────────────────── │
│                                                          │
│   The People Ops                                         │
│   AI Brain.                                              │
│                                                          │
│   The most thorough working file on running People       │
│   functions with AI. Nine examples. Twenty-seven         │
│   guides. One link, yours to keep.                       │
│                                                          │
│   ┌────────────────────────────────────────────────┐    │
│   │  First name            you@company.com         │    │
│   │  ──────────────        ──────────────────      │    │
│   │  [   SEND ME THE BRAIN   →   ]   Already in?   │    │
│   └────────────────────────────────────────────────┘    │
│                                                          │
│   Read by heads of People at Series B SaaS, defence      │
│   tech, and founder-led services firms.                  │
└──────────────────────────────────────────────────────────┘
```

Key moves:
- Headline scales up to ~clamp(64px, 9vw, 144px), walnut on cream, the existing display serif, tight tracking.
- Form gets its own framed card: brass hairline border, generous padding, inputs at text-lg, button promoted from outline pill to solid walnut/brass CTA at text-base uppercase, full width on mobile.
- The "tiny print" reassurance line moves below the card and stays small on purpose, but the CTA itself reads first.
- Right rail (desktop only): a vertical meta strip, "Issue 01 / Updated weekly / 9 examples / 27 guides", set in the uppercase tracked label style we already use. Replaces the photo entirely.

### Section 2, Sample article, lifted

Move the existing CoworkPreview block up so it is the first thing after the hero. Keep the green ground (it gives the page a deliberate dark-light-dark rhythm) and the same copy, but reframe the eyebrow as `A taste from inside · Piece 05 of 27` and let the flipbook breathe wider on desktop. Add a single line under it: "If this is the shape of the thinking, the rest is yours for an email." with a quiet jump-to-form link.

### Section 3, What's inside

Unchanged in content, but renumbered as section 3 and tightened: the intro paragraph drops to one sentence, the grid stays as is.

### Sections 4 and 5

Author block and second CTA stay as they are. The second CTA already does the heavy lifting for repeat conversion.

### Form treatment, both placements

The `BrainCaptureForm` itself stays wired to the same edge function. We only restyle its container and promote the submit button. Inline labels get bumped one size, the consent checkbox row sits cleanly under the inputs, and the submit becomes a solid filled button rather than the current ghost pill.

### Files touched

- `src/pages/Brain.tsx` — reorder sections, rewrite hero markup, drop the background image and chevron.
- `src/components/forms/BrainCaptureForm.tsx` — bump input and button sizes, swap the outline pill for a solid CTA variant, tighten spacing.
- No new dependencies, no data changes, no backend changes.

### Out of scope

- No new copy beyond the hero deck and the one bridging line under the flipbook.
- No changes to analytics, edge functions, or the cards data.
- Mobile gets the same order, hero meta strip collapses, form card goes full width.

---

## Home hero, borrow the plain-English clarity from /method

The /method page intro reads much more clearly than the current home hero ("We rebuild how your company runs."). The "Three levels. You work at all three at once." block, with its plain-English deck and "Walk one workflow through it with me" sub-CTA, explains what we actually do in a way the home page does not.

To do:
- Pull the /method intro language into the home hero (or a strip directly under it): the "three levels, worked at once" framing, the "from audit through to agents" deck, and the "walk one workflow through it" half-step CTA next to the audit CTA.
- More broadly, audit the entire /method page for copy and structural moves that belong on the home page. Treat /method as the source of truth for how we describe the work, and lift the strongest beats forward.
- Keep the bark hero background and current visual treatment, this is a copy and information-architecture change, not a redesign.

