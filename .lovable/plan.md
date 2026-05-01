## Cleanup before republish

Audit found the Brain page and Cowork flipbook are functionally complete and SEO-safe. Two small hygiene fixes worth applying before publish.

### Fixes

1. **`src/pages/Brain.tsx` line 36**: replace the em dash in the SEO `<title>` (shown in browser tabs and Google results) to match your tone rule.
   - From: `The People Ops AI Brain — 9 Examples, 27 Practical Guides | Deepgrain`
   - To: `The People Ops AI Brain: 9 Examples, 27 Practical Guides | Deepgrain`

2. **`src/components/brain/CoworkPreview.tsx`**: remove the dead `setIsDesktop` state and its `matchMedia` effect. Left over from the earlier two-page spread version, no longer read anywhere. Also tighten the file header comment so it reflects the current single-page 16:9 behaviour.

### What's already clean (verified, no action)

- **Assets**: all 12 page JPGs + 12 placeholders + the source PDF (`public/brain/claude-cowork-for-people-teams.pdf`) are present and Vite-imported.
- **SEO / structured data**: `PageMeta` on `/brain` emits canonical, OG, Twitter, BreadcrumbList, WebPage, Offer, and FAQPage JSON-LD. `/brain` is in `STATIC_PAGES` in `vite-plugins/deepgrain-seo.ts` (priority 0.9), so sitemap.xml regenerates on build automatically.
- **Performance**: low-res blurred placeholders inline as data URIs (~6KB total), full pages lazy-mounted only when current/neighbour/visited, `fetchPriority` set per page. Hero image preloaded via `<link rel="preload">` in `index.html`. Casing of `fetchPriority` matches the rest of the codebase (Hero, About, MethodPage, IntelligenceArticle).
- **Tone**: prose copy in the new section uses commas/full stops, no em or en dashes. Section comment dividers in `Brain.tsx` use box-drawing chars, not dashes, so they don't affect rendered output.
- **Accessibility**: `role="region"`, `aria-live` page indicator, `aria-label` on every control, keyboard nav (arrows, Home/End, F, Esc), focus-visible rings, `prefers-reduced-motion` respected on scroll-to-form.
- **No new dependencies, no DB changes, no edge function changes.** Republish will redeploy frontend only.

### Republish steps (after fixes land)

1. Click **Publish → Update** in the Lovable editor (frontend changes need an explicit update; backend would deploy automatically but there isn't any here).
2. The build regenerates `public/sitemap.xml`, `llms.txt`, and `llms-full.txt` automatically via `deepgrainSeoPlugin`. No manual ping needed.