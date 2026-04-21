
## Goal

Reskin the ICP strip background from solid `walnut` to a richer, dark grey-green wood-grain surface with a subtle, continuously moving grain texture — evoking the bark/tree tones in the Hero image. Test on this one section first; if approved, we can roll the treatment elsewhere.

## Approach

Keep all ICP content, layout, and typography exactly as-is. Only change the section's background layer.

### 1. Add two new dark grey-green tokens

In `src/index.css` (`:root`), add:

- `--bark: 140 12% 12%;` — deep grey-green base (close to shadowed conifer)
- `--bark-2: 120 10% 18%;` — slightly lighter, warmer grey-green for grain highlights

Register both in `tailwind.config.ts` under `extend.colors` as `bark` and `bark-2` so we can use `bg-bark` etc.

### 2. Add a slow drifting wood-grain keyframe

In `src/index.css`, add:

```css
@keyframes grain-drift {
  0%   { background-position: 0% 0%, 0% 0%, 0% 0%; }
  100% { background-position: 200% 0%, -150% 0%, 100% 0%; }
}
.bark-grain { animation: grain-drift 90s linear infinite; will-change: background-position; }
```

Wrap in the existing `prefers-reduced-motion` block so motion-sensitive users see a static grain.

### 3. Restructure ICPStrip background

In `src/components/sections/ICPStrip.tsx`:

- Change `<section>` from `bg-walnut` to `bg-bark relative overflow-hidden`.
- Add an absolutely-positioned `aria-hidden` layer behind the content with:
  - A vertical gradient from `bark` → `bark-2` → `bark` for depth.
  - Two stacked `repeating-linear-gradient`s at ~88° and ~92° using `bark-2` and `cream` at very low opacity (~3–6%) to mimic tight wood grain (similar technique to the existing `.hero-drift`, but tighter line spacing and animated via `background-position` instead of transform).
  - `mix-blend-overlay` and `opacity-[0.18]` so the grain reads as texture, not stripes.
- Apply the `.bark-grain` class to that layer.
- Keep the existing brass hairline divider, brass borders on pills, and `text-cream` content — they'll pop nicely against the darker grey-green.
- Adjust the section's top/bottom borders from `border-brass/25` to `border-brass/30` for slightly stronger separation against the new darker bg.

### 4. Scope

Only `ICPStrip.tsx`, `index.css`, and `tailwind.config.ts` are touched. Hero, Footer, and other `bg-walnut` sections remain unchanged so you can compare side-by-side and approve before we extend the treatment.

## Files

- `src/index.css` — new tokens, keyframe, `.bark-grain` utility, reduced-motion guard
- `tailwind.config.ts` — register `bark` and `bark-2`
- `src/components/sections/ICPStrip.tsx` — swap bg, add animated grain layer
