

## Refine the Contact page booking section

The Google Calendar iframe forces a white/light background, which clashes hard against the deep green page. Wrapping it in `bg-cream/5` doesn't help — the iframe itself is a bright rectangle floating on green. We'll fix this by giving the booking block its own light "card" surface that belongs visually, and reshaping the page rhythm so the calendar feels intentional rather than pasted in.

### Approach

Lift the booking section out of the green canvas and seat it on a **cream/linen panel** — the same warm tones used elsewhere on the site. The iframe then sits on a surface that matches its own light background, so the seam disappears.

### Page structure (Contact)

```text
[ Green hero ]            — "Let's talk." + email + intro
   ↓ soft transition
[ Cream booking panel ]   — framed, editorial, calendar lives here
   ↓ soft transition
[ Green form section ]    — "Or send a note" + ContactForm
```

### Booking panel design

- Full-bleed `bg-linen` (or `bg-cream`) band with `section-pad` vertical rhythm.
- Two-column layout on desktop (`md:grid-cols-[5fr_7fr]`), stacked on mobile:
  - **Left rail**: Eyebrow "Booking", display heading "Find a time.", short editorial paragraph, a `BrassRule`, and a small list of what to expect (e.g. "30 minutes", "No agenda required", "Video or phone").
  - **Right**: the calendar iframe, framed in a soft card — `rounded-2xl`, subtle `border-linen-dark`, light shadow, `bg-white` so it blends seamlessly with Google's own surface. No more dark wrapper.
- Iframe attributes preserved exactly (same `src`, `loading="lazy"`, `title`, responsive height ~`720px` desktop / `680px` mobile).
- Add `colorScheme: "light"` (already there) — keep.

### Visual polish

- Replace the heavy `shadow-2xl` with a softer `shadow-[0_20px_60px_-30px_rgba(18,53,36,0.25)]` so the card feels grounded, not floating.
- Brass hairline accent above the heading on the left rail to echo the rest of the site.
- Remove the now-redundant `BrassRule` + "Or book a time directly" italic line from the green hero — that copy moves into the cream panel's left rail.

### Files touched

- `src/pages/Contact.tsx` — restructure into three sections (green hero → cream booking panel → green form). Move booking copy into left rail. Reskin iframe wrapper.

### Out of scope

- No change to ContactForm, no new components, no new dependencies, no route changes.

