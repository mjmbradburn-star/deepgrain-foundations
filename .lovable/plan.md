
The warning likely comes from `AnimatedNumber` being passed a `ref` somewhere (or used in a context expecting one). Either way, wrapping it in `React.forwardRef` is cheap and silences it.

## Change

Update `src/components/ui/AnimatedNumber.tsx`:

- Convert the named export from a plain function component to `React.forwardRef<HTMLSpanElement, AnimatedNumberProps>`.
- Merge the forwarded ref with the existing internal `ref` (used for IntersectionObserver) via a small `setRefs` helper, so both the consumer's ref and the internal observer ref point to the same `<span>`.
- Add a `displayName = "AnimatedNumber"` for clean React DevTools output.
- No prop or behaviour changes. No other files touched.

That's it — small, surgical, no regressions expected.
