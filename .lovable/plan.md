

## Goal

Fix the bark grain motion not being visible by applying the well-known SVG transform-animation workaround: split the absolutely-positioned SVG into an outer wrapper that handles **position** and an inner wrapper that handles **animation only**, with `transform-box` and `transform-origin` set explicitly so percentage-based translates animate consistently across Chromium, Firefox, and Safari.

## Why the current setup fails

Today, `<svg class="bark-grain absolute">` mixes layout transforms (none currently, but `position:absolute` + percentage offsets) with the keyframe `transform: translate3d(-8%, 4%, 0) scale(1.08)`. On SVG root elements, browsers compute percentage transforms against the SVG viewport, and `transform-origin` defaults differ between SVG and HTML — the result in some engines is that the animation either resolves to a no-op transform or animates around an unexpected origin, so nothing visibly moves. Animating a plain HTML wrapper around the SVG sidesteps every one of those quirks.

## Approach

Rework `BarkGrain.tsx` to a three-layer structure:

```text
<div bg-gradient, overflow-hidden>          ← outer: clip + bark gradient (unchanged)
  <div bark-grain-anim absolute -inset[5%]> ← NEW inner: holds the animation
    <svg width=100% height=100%>            ← SVG: pure texture, no animation, no offsets
      …filters + rects…
    </svg>
  </div>
</div>
```

- The animation moves to the new `.bark-grain-anim` HTML div. The SVG itself becomes a static, fully-sized child — no `top/left/width/height` overrides, no `.bark-grain` class.
- Rename the CSS hook: `.bark-grain` → `.bark-grain-anim` in `src/index.css` (same two-stage `grain-flow-boot` + `grain-flow` keyframes, untouched). Add `transform-box: border-box;` and `transform-origin: 50% 50%;` to lock down the reference box and origin so the percentage translates and `scale(1.08)` behave identically in every engine.
- The 110% × 110% bleed (so edges never show during the 8% drift) moves to the wrapper via `inset: -5%` (Tailwind `-inset-[5%]`) instead of being applied to the SVG.
- Debug mode keeps working: the `?debugGrain=1` overrides (outline, magenta tint, forced animation) move from the `<svg>` to the new `.bark-grain-anim` div. The HUD's `registerGrain` call now registers the animated div instead of the SVG — update its type to `HTMLDivElement` so computed-style sampling reads from the element that actually owns the animation.

### Reduced motion / debug parity

- The `prefers-reduced-motion` block in `index.css` currently targets `.bark-grain` — update to `.bark-grain-anim`. Behaviour preserved.
- Debug HUD's "NOT MOVING" detector keeps working unchanged because it reads computed `transform` from whichever element we register, and that element is now the one with the animation.

## Files

- `src/components/ui/BarkGrain.tsx` — restructure JSX into outer gradient div → inner `.bark-grain-anim` div → static SVG. Move debug-mode style overrides and the `registerGrain` ref onto the inner div. Update ref type to `HTMLDivElement`.
- `src/index.css` — rename `.bark-grain` rule to `.bark-grain-anim`, add `transform-box: border-box;` and `transform-origin: 50% 50%;`. Update the matching selector inside the `prefers-reduced-motion` block.
- `src/lib/debugGrain.ts` — broaden `GrainEntry.el` and `registerGrain` element type from `SVGSVGElement` to `Element` (or `HTMLElement | SVGElement`) so the registry accepts the new HTML wrapper without any other call-site changes.

## Out of scope

- Changing the keyframe values, durations, or the boot/ambient two-stage chain.
- Touching `.hero-drift` or any non-bark surface.
- Removing the debug HUD or the `?debugGrain=1` flag — both stay until we've confirmed the fix in the live preview.

