
## Goal
Visually verify that the recent Navigation and SiteShell changes (forced opaque nav on /method and /enablement, conditional `pt-10` under sub-nav) didn't regress the homepage Method teaser link, the Work outcome band, or the /method and /enablement pages themselves.

## Steps
1. Desktop (1366×768): visit `/`, scroll to Method section, screenshot. Confirm both CTAs render (filled pill + "Or see how we train your team" link).
2. Same viewport: visit `/work`, scroll to the walnut outcome band above the email capture, screenshot. Confirm layout and link.
3. Visit `/method` and `/enablement`, screenshot top of each. Confirm sub-nav sits flush, hero clears it, no background bleed.
4. Mobile (390×844): repeat the same four routes, screenshot each relevant area.
5. Click the homepage "Or see how we train your team" link and the Work outcome band link to confirm both land on `/enablement`.

## Notes
- Pure verification. No code changes expected.
- If anything renders incorrectly (overflow, clipped hero, broken link, sub-nav misalignment), I'll stop and report before fixing.
