

## Plan: Tighten Intelligence article cards

Single-file fix to `src/components/intelligence/ArticleCard.tsx` plus a small content tweak to keep descriptions short.

### What's actually wrong

1. **Title can overflow its reserved space.** `min-h-[5.5rem]` reserves ~88px (≈ 2 lines of `text-3xl`), but several titles wrap to 3 lines on desktop and 4 on the narrowest tablet breakpoint. The extra line pushes the description down and the bottom `Read →` row visibly bleeds past the rounded corner — worsened by the `group-hover:translate-x-1` transform on the title.
2. **No clamp on the title.** Only the description has `line-clamp-3`; the title is unbounded.
3. **Description text is genuinely too long** for the card footprint under the image — the 3-line clamp truncates mid-sentence on most cards, which reads as broken rather than intentional.
4. **`min-h` + `flex-1`** combine badly: when the title is short, the title block still takes 88px of empty space, then `flex-1` on the description pushes `Read →` to the very bottom — making short-title cards feel hollow.

### Changes

**`ArticleCard.tsx`**
- Clamp the title to **2 lines** with `line-clamp-2` and remove `min-h-[5.5rem]`. Replace with a fixed 2-line reservation using `[&]:min-h-[calc(2*1.15*1.875rem)]` (i.e. `line-height × text-3xl`) so 1-line and 2-line titles align across a row without leaving phantom space when titles are short.
- Drop title size one notch on the largest breakpoint: `text-2xl md:text-3xl` → `text-xl md:text-2xl`. Titles fit cleanly in 2 lines at this size for every current article.
- Tighten the description: `line-clamp-3` → `line-clamp-2`, and shrink to `text-[13px] leading-[1.55]` so two clamped lines sit comfortably between the title and `Read →`.
- Remove `flex-1` from the description; instead add `mt-auto` to the `Read →` row only (already there). The card body becomes content-sized, with `Read →` pinned to the bottom — no more vertical bleed.
- Reduce inner padding on the body from `p-7` to `px-6 py-5` so the image-to-text rhythm feels tighter under the 16:9 hero.
- Remove the title's `group-hover:translate-x-1` (it's the source of the hover-bleed past the rounded corner). Keep the image's `group-hover:scale-[1.03]` for hover feedback.

**`src/lib/intelligence.ts`** (only if descriptions are derived there)
- I'll check whether descriptions come from MDX frontmatter or are computed. If frontmatter, no code change needed — the 2-line clamp absorbs current copy. If any description currently exceeds ~140 characters, I'll note them in a comment for a follow-up content edit, but won't rewrite frontmatter without approval.

### Out of scope

- Palette, motion, mobile merge — already shipped in the previous polish pass.
- Any change to grid layout in `Intelligence.tsx` / `IntelligenceTeaser.tsx` / `IntelligenceCategory.tsx`. The `items-stretch` + `h-full` from the previous pass is correct; the bleed is internal to the card.

### Verification

After the edit I'll spot-check the three pages that render `ArticleCard` (Intelligence index, IntelligenceTeaser on Home, IntelligenceCategory) and confirm:
- All cards in a row have identical heights.
- No title or description overflows the card boundary on hover.
- The shortest-title card no longer has a hollow gap above `Read →`.

