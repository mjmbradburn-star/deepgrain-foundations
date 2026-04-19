

## Deepgrain.ai — Build Plan

A multi-page consultancy site built from the supplied design + functional briefs. Editorial, wood-grain inspired: deep green (#123524), walnut, brass accents, cream linen, Cormorant Garamond display + system sans body.

### Pages & Routes
- **/** Home — Hero → Belief → Operating Proof → Method → Who This Is For → Client Voice → Logo Carousel → Invitation
- **/method** — Expanded Read · Craft · Scale narrative
- **/work** — Logo carousel + 4 case studies (Defence Tech, Financial Data, Transit Tech, Climate)
- **/about** — Matt's story, philosophy, testimonials
- **/contact** — mailto + contact form (Lovable Cloud backend), optional Calendly embed
- **404** — On-brand not-found

### Core components
- Fixed Navigation (transparent → blurred green on scroll, brass underline on active link, full-screen mobile overlay)
- Footer (3 columns, walnut bg)
- Hero with staggered fade-up + scroll chevron
- ScrollReveal wrapper (fade-up on enter)
- LogoCarousel (auto-scrolling, infinite loop, Clearbit logos with text fallback, pause on hover) — used on Home + Work
- PillButton (outline + filled variants)
- Eyebrow, BrassRule typographic primitives
- ContactForm (name, email, org, size, message → stored in Lovable Cloud)

### Design system
- Tailwind tokens wired to the Deepgrain palette (HSL) in `index.css`
- Cormorant Garamond via Google Fonts
- Section spacing: 140px desktop / 80px mobile
- Imagery: misty forests, wood grain macros, birch trunks (Unsplash) with green/walnut overlays

### Backend (Lovable Cloud)
- `enquiries` table: name, email, organisation, size, message, created_at
- RLS: public insert, authenticated read
- Form posts directly from the client; success/error states inline

### Motion
- Framer Motion for scroll reveals, nav underline (`layoutId`), mobile menu, hero stagger
- CSS keyframes for the logo carousel
- All transitions slow and editorial (250–700ms, custom easing)

### Out of scope for v1
- CMS, blog, auth/login, analytics, cookie banner, newsletter, social links

