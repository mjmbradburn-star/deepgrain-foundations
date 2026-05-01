## Goal

Replace **Section 3** of `/brain` (the "A taste · Layer 1 — Setting up your AI workspace" preview) with a real, page-by-page preview of the **Claude Cowork for People Teams** PDF (12 pages). Readers can flip pages, expand to fullscreen, and click through to the lead-capture form.

## What gets built

### 1. Asset pipeline
- Copy the 12 pre-rendered page JPGs (`page_1.jpg` … `page_12.jpg`) from the parsed PDF into `src/assets/brain-cowork/` so Vite hashes & optimises them.
- Also copy the source PDF to `public/brain/claude-cowork-for-people-teams.pdf` so fullscreen / "open in new tab" can link to the real file if wanted (used as a low-priority fallback only — main viewer is the image flipbook).

### 2. New component: `src/components/brain/CoworkPreview.tsx`
A self-contained flipbook in the project's design system (cream card, brass accents, walnut text, BrassRule, rounded-3xl, offset frame echoing existing card).

Features:
- **Fixed aspect-ratio stage** (A4 portrait, `aspect-[1/1.414]`) holding the current page image. Image swaps with a soft fade (~150ms) on page change. `prefers-reduced-motion` respected.
- **Prev / Next pill buttons** flanking the stage, plus tap zones on the left/right halves of the image for mobile. Disabled state at first/last page.
- **Page indicator**: `04 / 12` in brass display type, plus 12 small brass dots (clickable) under the stage.
- **Fullscreen toggle** (top-right of stage, lucide `Maximize2` / `Minimize2`). Uses the Fullscreen API on a wrapper div; hides surrounding chrome and scales the page image to viewport with `object-contain` on a black/walnut backdrop. Adds `fullscreenchange` listener for clean exit.
- **Keyboard nav**: ←, →, Home, End, F (fullscreen), Esc (exit). Listeners scoped to the component when focused / fullscreen.
- **Lazy loading**: current page eager, neighbours preloaded, rest lazy. `decoding="async"`.
- Accessibility: `role="region"` with `aria-label="Claude Cowork preview, page X of 12"`, `aria-live="polite"` page indicator, focus-visible rings on all controls, alt text per page.

### 3. Section rewrite in `src/pages/Brain.tsx`
Replace the existing two-column "A taste" section with a new layout that keeps the same visual rhythm (green background, brass eyebrow, scroll reveal):

```text
┌─────────────────────────────────────────────────────────────┐
│  Eyebrow: A taste · 05 of 27                                │
│  H2:      Read one of the pieces.                           │
│  Sub:     Claude Cowork for People Teams — the desktop AI   │
│           that does the work while you go and live your     │
│           life. Twelve pages from inside the Brain.         │
│                                                             │
│  ┌──────────────────────  CoworkPreview  ──────────────────┐│
│  │  [<]   [   page image, A4 portrait   ]   [>]   [⤢]     ││
│  │              ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●        ││
│  │                       04 / 12                           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  CTA: [ Read the full Brain → ]   20+ more pieces like this.│
└─────────────────────────────────────────────────────────────┘
```

- CTA reuses existing `PillButton` calling `scrollToForm` so it lands on the capture form, exactly like today.
- On `lg+` the preview is centered with max-width ~880px. On mobile the stage is full-width with prev/next pills below the image and tap-zones on the image itself.

### 4. Cleanup
- Remove the old hand-drawn "Setting up your AI workspace" mock card (the three-layer diagram block) from `Brain.tsx` since it's superseded.
- No changes to `brainCards`, hero, author, or second CTA sections.

## Technical notes

- Files added:
  - `src/assets/brain-cowork/page-01.jpg` … `page-12.jpg` (copied from `parsed-documents://…/page_N.jpg`)
  - `src/assets/brain-cowork/index.ts` exporting an ordered array of imports for clean iteration
  - `public/brain/claude-cowork-for-people-teams.pdf`
  - `src/components/brain/CoworkPreview.tsx`
- Files edited:
  - `src/pages/Brain.tsx` (Section 3 only)
- No new dependencies. Fullscreen via native API. No PDF.js — image flipbook is faster, sharper, and matches the design system without iframe chrome.
- Performance: 12 JPGs at the parsed resolution are small; eager-load page 1, preload page 2, the rest lazy. Total payload comfortably under ~1MB.

## Out of scope

- Pinch-zoom inside fullscreen (browser zoom is sufficient at this resolution).
- Download button (PDF lives at a stable public URL; can be added later if wanted).
- Analytics events for page turns (can wire into existing analytics later if desired).
