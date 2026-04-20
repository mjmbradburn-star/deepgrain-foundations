
## Goal

Rewrite every line of copy on `/enablement` so it reads in your voice — tighter, plainer, no em dashes, no AI tells. Keep the page structure and components intact; only the strings change.

## Voice rules I'll apply

- No em dashes (`—`). Use full stops, commas, or colons.
- No "we don't X. we Y." rhetorical flips. No "it's not X, it's Y."
- No tricolons ("brief, run, and judge"). Cut to one verb where possible.
- No "actually," "genuinely," "honestly," "truly."
- No "calm," "quiet," "the test is."
- Shorter sentences. Concrete nouns. Active verbs.
- Lowercase eyebrows stay; section logic stays.

## Sections to rewrite (in `src/pages/Enablement.tsx`)

1. **Hero** — headline + sub. Drop "We don't replace your team. We grow it." (classic AI cadence). Replace with something declarative about what enablement is.
2. **`upskilled` array** — three items (Fluency / Craft / Practice). Each body sentence rewritten without the em dash and tricolon patterns.
3. **"What the metric actually means" intro** — strip "actually," strip the "Not X. Not Y. A Z." cadence.
4. **Champion model section** — three prose paragraphs and the heading. Currently leans heavily on em dashes and "this works because of grain" lecture tone. Tighten to plain claims.
5. **`championNeeds` array** — three items. Bodies currently use em dashes ("twenty per cent floor — protected from..."). Rewrite with commas.
6. **Curriculum intro + 6 modules** — module bodies are mostly short but several use em dashes ("Tools, triggers, handoffs — building the plumbing..."). Trim each to a flat sentence.
7. **Outcomes (4 bullets)** — short already, just remove em dashes and the "compounds" abstraction.
8. **Closing paragraph + CTA** — "Two months after the engagement ends, the champions are still building..." rewrite without "That is the test."

## What I won't touch

- Layout, classes, colours, component structure, routing, sub-nav, SEO meta tags (unless you want the meta description rewritten too — I'll do it by default since it has the same AI cadence).
- `the-champion-model.mdx` essay (separate artifact, separate decision).

## One thing to confirm before I write

I'll draft the new copy in your voice based on the existing site (Hero, Method, Work pages). If you have a specific phrase you want in the hero ("Enablement is how the work stays after we leave" or similar), drop it in the next message and I'll build around it. Otherwise I'll propose one.

## Files

- Edited: `src/pages/Enablement.tsx` (copy strings only)

## Deliverable

One pass, all sections rewritten, no em dashes anywhere on the page, ready for you to read and red-pen.
