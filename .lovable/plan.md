
## Goal
Get the site EU/UK GDPR-compliant. Add the legal pages and the runtime consent UX that regulators actually check for.

## What's missing right now
- No privacy policy, no cookies policy, no terms.
- No cookie/consent banner.
- Footer collects emails (Supabase `subscribers` table) with no link to a privacy notice or lawful basis stated.
- Contact form likely the same.
- No mention of data controller, retention, rights, or how to unsubscribe / request deletion.

The site appears low-tracking (no GA / Meta pixel spotted in `index.html`), which simplifies the banner story significantly. I'll confirm during build, but assume strictly-necessary only unless we find otherwise.

## Scope

### 1. Legal pages (new)
Three new routes, styled to match existing prose pages (linen background, Cormorant headings, walnut body):

- **`/privacy`** — `src/pages/Privacy.tsx`
  Controller (Deepgrain Ltd, matt@deepgrain.ai), what's collected (email via subscribe, name+email+message via contact form, server logs), lawful basis (consent for marketing, legitimate interest for enquiries), retention, processors (Supabase/Lovable Cloud, Resend or whichever transactional provider is wired), international transfers, your rights under UK GDPR + EU GDPR, how to exercise them, complaints to the ICO.
- **`/cookies`** — `src/pages/Cookies.tsx`
  What cookies/local storage the site uses. Given the audit, likely "strictly necessary only" plus any Supabase auth cookie. No analytics, no advertising. Explains the banner.
- **`/terms`** — `src/pages/Terms.tsx`
  Short. Site use, IP, no warranty, governing law (England & Wales).

All three registered in `src/App.tsx` as lazy routes, each with `<PageMeta>` and `noindex={false}`.

### 2. Footer
Add a small legal row below the existing copyright line: `Privacy · Cookies · Terms`. Keep the existing voice ("Work with the grain.") intact.

### 3. Cookie consent banner (new)
- New component `src/components/compliance/CookieBanner.tsx`, mounted once in `SiteShell`.
- Behaviour: appears bottom-left on first visit. Two actions: **Accept** and **Reject non-essential**. Choice stored in `localStorage` under `dg.consent.v1` with `{ status: "accepted" | "rejected", ts }`.
- Because the site currently runs no non-essential trackers, the banner is honest: it explains the site uses only strictly necessary storage and that the choice controls any future analytics. This keeps us compliant without being theatre.
- Hook `useConsent()` exported so future analytics can gate on it cleanly.
- Banner is dismissible, keyboard accessible, focus-trapped, `aria-live="polite"`, respects `prefers-reduced-motion`.
- Link in banner: "Read our cookie policy" → `/cookies`.

### 4. Form consent
- **`EmailCapture`**: add small helper text under the input: `By subscribing you agree to our Privacy Policy. Unsubscribe any time.` with `/privacy` linked. No pre-ticked boxes (illegal under GDPR).
- **`ContactForm`**: add the same single-line consent notice above the submit button, linking `/privacy`.

### 5. SEO / discoverability
- Add the three new URLs to `public/sitemap.xml`.
- Keep them indexable (standard for legal pages).

## Out of scope this pass
- No analytics integration. If you later add Plausible / GA / Meta, the consent hook is already there to gate it.
- No DPA template or cookie-scanner automation.
- No changes to existing voice on other pages.

## Questions before I build

<lov-actions>
<lov-suggestion message="Use Deepgrain Ltd, registered in England & Wales, matt@deepgrain.ai as the data controller details. Governing law England & Wales. Proceed.">Use those controller details</lov-suggestion>
<lov-suggestion message="Skip the Terms page for now. Just ship Privacy, Cookies, the banner, and the form consent lines.">Skip Terms, do the rest</lov-suggestion>
<lov-suggestion message="I'll send you the exact registered company name, number, and address before you write the legal pages. Hold the legal copy and just build the banner, the routes as stubs, the footer links, and the form consent lines.">Hold legal copy, build the rest</lov-suggestion>
</lov-actions>
