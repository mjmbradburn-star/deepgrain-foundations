## /brain — People Ops AI Brain lead capture

A phased plan to build the `/brain` route per the brief, composed entirely from existing tokens, components, and infrastructure. No new fonts, colours, component libraries, or design patterns will be introduced.

---

## Key deviation from the brief (please confirm)

The brief specifies **Resend** + a bespoke `send-brain-welcome` edge function. The project already has the full Lovable Email infrastructure live: queue, retry/backoff, suppression list, unsubscribe tokens, send log, and a verified sender domain (`notify.deepgrain.ai`, just configured this session).

**Recommendation: use the existing infrastructure** for the welcome email. Reasons:

- The sender domain is already verified through Lovable; adding Resend would create a DNS conflict on the same subdomain.
- Retries, suppression, bounce handling, and one-click unsubscribe already work and are already styled into `/unsubscribe`.
- No new secret (`RESEND_API_KEY`) is needed.
- The `From` address can still be `Matt Bradburn <matt@notify.deepgrain.ai>` (display-from-root can show `@deepgrain.ai` if enabled).
- The template, gating, and audit-trail requirements are unchanged — only the delivery path differs.

The brain_subscribers table, consent capture, audit fields, edge function entry point, and email content are all built as the brief specifies. The substitution is purely the transport layer.

If you'd rather follow the brief literally and add Resend as a parallel system, say so and I'll swap Phase 3 accordingly (this means removing Lovable Emails from `notify.deepgrain.ai` first — see the email infra guide for the DNS implications).  
  
I have decided to use the Lovable Email infrastructure we have in place as it makes perfect sense. Ignore the resend aspects of the plan. 

---

## Phase 1 — Foundations: routes, nav, schema

Goal: scaffolding in place so subsequent phases have a route to render into and a table to write to.

1. **Database migration** — create `brain_subscribers` table per Section 9 of the brief (all fields, three indexes, RLS enabled, anon/authenticated revoked). One migration, reviewed before applying.
2. **Routing** — add `/brain` to `src/App.tsx` as a lazy-loaded page (matching the existing pattern). The `/privacy` and `/unsubscribe` routes already exist.
3. **Navigation** — add `{ to: "/brain", label: "Brain" }` to the `links` array in `src/components/layout/Navigation.tsx`, positioned between Intelligence and About. Mobile drawer picks it up automatically.
4. **Page shell** — create `src/pages/Brain.tsx` rendering placeholder sections so the route resolves and the nav link works end-to-end.

---

## Phase 2 — Page composition (visual build)

Goal: every section visually approved against the existing design system before any backend wiring.

1. **Brain card data** — `src/data/brainCards.ts` with the nine cards from Section 5 (typed, hardcoded).
2. **Section 1 — Hero** — forest backdrop (reuse the homepage hero image), eyebrow `THE BRAIN`, three-line Cormorant headline, sub-headline, form slot (visual only, non-functional in this phase), micro-copy line, scroll chevron matching homepage.
3. **Section 2 — What's Inside** — linen/walnut body section, eyebrow + heading + sub, three-column responsive card grid reusing the existing card pattern from FOUNDATIONS / ArticleCard styling.
4. **Section 3 — Sample Article** — phthalo green full-bleed, structural placeholder using lorem-style copy with correct typography and a `BrassRule` quote block reusing the existing pattern. Outline pill CTA that smooth-scrolls to the form in Section 5.
5. **Section 4 — Author Block** — walnut surface, two-column layout, portrait placeholder of correct dimensions, eyebrow + Cormorant heading + two body paragraphs + three brass-outline credibility chips matching `/about`.
6. **Section 5 — Second CTA** — forest backdrop with deeper overlay, centred stack, headline, second instance of the form slot, three brass-bordered chip rows.
7. **Section 6 — Footer** — uses existing `<Footer />` via `<SiteShell>`. Verify privacy link present; add it to the footer link group if missing (single-line change).
8. **Page meta** — `<PageMeta>` with title, description, path `/brain`.

Animations limited to: chevron bounce, `ScrollReveal` fade-in on sections, form state transition. No new animation library.

---

## Phase 3 — Form + edge function (backend wiring)

Goal: form submits, row written, welcome email sent, audit trail captured.

1. `**<BrainCaptureForm />` component** — `src/components/forms/BrainCaptureForm.tsx`:
  - Two inputs (first name optional, email required) + consent checkbox + submit button, styled per Section 6.
  - States: idle → submitting → success / error. Success state replaces form inline with the tick + Cormorant headline + AIOI cross-sell pill.
  - Validation: permissive RFC email regex, lowercase + trim, submit disabled until valid email + consent.
  - Captures `userAgent`, `referrer`, `consentTimestamp`, hardcoded `source: 'brain'`.
  - Posts to the edge function (no direct table write).
  - Mounted into both Hero and Section 5.
2. **Edge function `send-brain-welcome**` — `supabase/functions/send-brain-welcome/index.ts`:
  - Validates payload (email format, `consentGiven === true`, throwaway-domain blocklist).
  - Reads IP from `x-forwarded-for`.
  - Inserts row into `brain_subscribers` via service role.
  - Invokes the existing `send-transactional-email` function with template `brain-welcome` and `templateData` containing `firstName`, `brainUrl`, `aioiUrl`. The existing system handles retries, queue, suppression, and the unsubscribe token automatically.
  - Updates row with `email_sent_at`, `email_status`, `email_provider_id` on success / `failed` on error.
  - Rate limit: in-memory map, 5 submissions per IP per 60s, 429 on the 6th.
  - Always returns success-shaped response on duplicates (no duplicate signal to caller).
3. **React Email template `brain-welcome**` — `supabase/functions/_shared/transactional-email-templates/brain-welcome.tsx`:
  - Per Section 11: max-width 600px, phthalo green background, walnut card, brass accents, cream body, Georgia/serif fallback headlines, system sans body.
  - DEEPGRAIN wordmark, greeting, body, brass pill "Open the Brain →" linking to `brainUrl`, where-to-start paragraph, brass divider, walnut secondary block with "Take the AIOI →" outline CTA, sign-off, footer with unsubscribe + privacy links.
  - Registered in `_shared/transactional-email-templates/registry.ts`.
4. **Secrets** — add `BRAIN_NOTION_URL` (your Notion link) and `AIOI_URL` (`https://aioi.deepgrain.ai`) as edge function secrets. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` already present. No `RESEND_API_KEY` (see deviation note above).
5. **Deploy edge functions**: `send-brain-welcome` and `send-transactional-email` (the latter to pick up the new template).

---

## Phase 4 — Privacy + unsubscribe

Goal: legal + opt-out work end-to-end.

1. **Privacy page** — extend the existing `src/pages/Privacy.tsx` with a `Brain` subsection covering the data captured at `/brain` (first name, email, consent timestamp, IP, user agent), retention (24 months post last engagement), processors (Lovable Cloud + EU-region storage), and the rights statement. Existing chrome and styling unchanged.
2. **Unsubscribe** — the existing `/unsubscribe` page uses the global suppression token system. Extend the `handle-email-unsubscribe` edge function (or add a tiny `unsubscribe-brain` companion) so that when a token resolves to a brain subscriber, `brain_subscribers.unsubscribed_at` is also stamped. Visual states (success / error) already match the brief's requirements; minor copy tweak only if needed.
3. **Footer link** — verify privacy link target. (Already present in Footer per existing routes.)

---

## Phase 5 — QA, content, launch checklist

Goal: meet every acceptance criterion in Section 13.

1. **Functional QA**:
  - Submit valid form → row appears with all fields; email arrives within 60s; both links work.
  - Submit without consent / invalid email → submit stays disabled, no console errors.
  - Click unsubscribe link → `/unsubscribe?token=…` updates the row, success state renders.
  - Browser console attempt to `select` from `brain_subscribers` with anon key → fails.
2. **Cross-browser/device check** — Chrome, Safari, Firefox, mobile Safari, mobile Chrome. Lighthouse a11y ≥ 95.
3. **Email render check** — preview the `brain-welcome` template via the existing `preview-transactional-email` function; send to `delivered@resend.dev`-equivalent test inbox.
4. **Voice scrub** — re-read every line of new copy against Section 1's blocklist (no "leverage", "seamlessly", "robust", em dashes, etc.).
5. **Items pending from Matt** (block launch only, not build):
  - Sample article MDX for Section 3 (placeholder until then).
  - Final `BRAIN_NOTION_URL` (you've supplied it: `https://www.notion.so/The-Deepgrain-People-Ops-AI-Brain-2f61569da34481baa942d9758263742d`).
  - Author portrait image.
  - Privacy-policy sign-off.

---

## Files touched (summary)

New:

- `src/pages/Brain.tsx`
- `src/components/forms/BrainCaptureForm.tsx`
- `src/data/brainCards.ts`
- `supabase/functions/send-brain-welcome/index.ts` (+ `deno.json`)
- `supabase/functions/_shared/transactional-email-templates/brain-welcome.tsx`
- One DB migration (`brain_subscribers` + RLS)

Modified:

- `src/App.tsx` (add `/brain` route)
- `src/components/layout/Navigation.tsx` (add Brain link)
- `src/components/layout/Footer.tsx` (only if privacy link missing)
- `src/pages/Privacy.tsx` (append Brain clauses)
- `supabase/functions/_shared/transactional-email-templates/registry.ts` (register new template)
- `supabase/functions/handle-email-unsubscribe/index.ts` (also stamp `brain_subscribers.unsubscribed_at`)
- `supabase/config.toml` (config block for `send-brain-welcome` if non-default needed)

---

## Out of scope (explicitly)

- Double opt-in (per Section 14).
- Iframe of the Notion page (per Section 14).
- Share-with-a-friend (per Section 14).
- New Tailwind tokens, fonts, colours, animation libraries.
- CMS-driven cards (hardcoded for v1).
- Newsletter / re-engagement sequences (transactional-only — anything bulk would need a separate marketing tool).