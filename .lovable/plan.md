

## Goal

Ship a temporary, opt-in debug mode for `BarkGrain` that makes the animated element visually obvious and logs every instance to the console, so we can confirm whether the animation is actually being applied and where it's failing.

## How to turn it on

Append `?debugGrain=1` to any URL (e.g. `/`, `/method`, `/about`). The flag is read once at module load from `window.location.search`. No flag = zero overhead, identical to today.

## What debug mode does

1. **Outlines the animated SVG** with a 2px dashed magenta border and a translucent magenta tint, so you can see exactly where it sits, how big it is, and — critically — whether it's translating.
2. **Adds a fixed-position HUD** in the bottom-left corner listing every mounted `BarkGrain`: its seed, the computed `animation-name`, `animation-duration`, `animation-play-state`, and the live `transform` value, refreshed every 500ms via `requestAnimationFrame` throttling. If `transform` stays at `none` or `matrix(1,0,0,1,0,0)` across ticks, the animation isn't running.
3. **Logs once per mount** to `console.info` with: seed, parent section's `tagName` + `className`, parent's computed `overflow` and `position`, and whether `prefers-reduced-motion` is active. This pinpoints the three most likely culprits: reduced-motion override, parent clipping, or the keyframe never being attached.
4. **Forces motion on** even when `prefers-reduced-motion: reduce` is set, but only in debug mode, so we can rule that out as the cause.

## Files

- `src/lib/debugGrain.ts` (new) — tiny helper exporting `isGrainDebug()` (reads the URL flag once) and `registerGrain(seed, el)` which pushes into a module-level registry and mounts the HUD on first call.
- `src/components/ui/BarkGrain.tsx` — when `isGrainDebug()` is true: add the magenta outline + tint to the `<svg>`, call `registerGrain(seed, svgRef.current)` in a `useEffect`, and emit the one-time `console.info` describing the parent. No behaviour change when the flag is off.
- `src/components/ui/GrainDebugHUD.tsx` (new) — fixed bottom-left panel that subscribes to the registry and renders the per-instance live readout. Mounted lazily by `registerGrain` on first call so it costs nothing in production.

## Cleanup

Once we've used the output to fix the motion, we delete `debugGrain.ts`, `GrainDebugHUD.tsx`, and the debug branch in `BarkGrain.tsx`. No production residue.

## Out of scope

- Changing the animation itself. This plan only adds visibility — the fix follows once we know what we're looking at.
- Touching any other component or page.

