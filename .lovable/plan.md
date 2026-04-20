
## Goal
Verify the "Champions trained" callout in the Scale section of `/method` renders correctly on desktop and mobile, and that its link now navigates to `/enablement` (updated in the previous step).

## Steps
1. Navigate to `/method` at desktop viewport (1366×768), scroll to the Scale section, screenshot the callout.
2. Click the callout, confirm it lands on `/enablement` and the page renders.
3. Navigate back to `/method` at mobile viewport (390×844), scroll to the same callout, screenshot to confirm responsive layout (padding, type sizing, brass border, arrow icon).
4. Tap the callout on mobile, confirm navigation to `/enablement`.

## Notes
- Code already shows the callout links to `/enablement` (not the intelligence article) per the latest edit. Verification will confirm the live link target matches.
- No code changes expected. If anything renders incorrectly (overflow, broken hover, wrong destination), I will stop and report before fixing.
