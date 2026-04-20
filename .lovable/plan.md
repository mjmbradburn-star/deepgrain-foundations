
## Goal

Replace the dense "Read · Craft · Scale" + "three levels of change" content on the homepage `Method` section with a tighter teaser that:
1. Keeps a short hook ("Read · Craft · Scale" as a one-line promise, not three paragraphs).
2. Showcases a **visual preview of the Value Visualiser sliders** from `/method` — the interactive ROI calculator — as the magnet.
3. Drives a single clear CTA: *See what this is worth in your function →*.

The full Read/Craft/Scale + three-levels content already lives on `/method`, so removing it from home is safe.

## New homepage Method section structure

Walnut background, same vertical rhythm. Two-column on desktop, stacked on mobile.

**Left column (copy, ~40%)**
- Eyebrow: "The Method"
- Headline (font-display, large): *"Read the grain. Build with it. Leave something that compounds."*
- One short paragraph (2 sentences max): positions Read · Craft · Scale as the how, and teases the value model.
- Brass-bold inline: **"three levels of change"** kept as the anchor phrase.
- PillButton (filled, brass-prominent): *"See what it's worth in your function →"* → `/method`

**Right column (visual teaser, ~60%)**
A static, non-interactive **mock of the Value Visualiser** styled like a browser/app card:
- Linen card with rounded corners, subtle shadow, brass border accent
- Three slider rows (Team size, Hours/week lost, Loaded hourly cost) rendered as static visuals — track + brass range fill + thumb dot, no interactivity, no Radix
- One headline output below: e.g. "Annual value · £1,209,600" in large brass display type
- Small label "Directional model · live on /method"
- Subtle hover lift + cursor-pointer wrapping the whole card as a link to `/method`
- A faint "click to explore" affordance (small arrow chip top-right)

This makes the teaser feel like a real screenshot of the tool without requiring the user to interact on the homepage — fewer decisions, clearer pull-through.

## Implementation

**File rewritten:**
- `src/components/sections/Method.tsx` — full replacement. Drop the `levels`, `movements`, BrassRule layout. Build the new two-column teaser + static slider mock inline (no new component file needed; ~120 lines).

**No other files touched.** `ValueVisualiser` stays as-is on `/method`. `MethodPage.tsx` unchanged.

## Static slider mock approach

Pure divs + tailwind, no Radix:
```
<div class="track">
  <div class="range" style="width: 32%" />
  <div class="thumb" style="left: 32%" />
</div>
```
Three rows with realistic preset values (e.g. 25 people / 8 hrs / £70) so the headline output number reads as a believable £1.2M figure — same maths as the real visualiser. This subtly previews the result the user will compute themselves on /method.

## Mobile

- Stack: copy first, visual card second
- Slider mock scales down; output number stays large and brass to anchor the eye
- CTA full-width-ish, thumb-friendly

## Why this works

- Removes ~2 screens of repeated content from home (Read/Craft/Scale story already on /method)
- Replaces it with a *thing to click* — a visual that promises a personalised number
- Single CTA, single destination, no analysis paralysis
- Keeps the brand language ("grain", "three levels of change") in one tight paragraph rather than three sections
