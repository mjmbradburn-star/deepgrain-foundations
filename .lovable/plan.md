

## Goal

Produce two artifacts you can post on LinkedIn today:

1. A **LinkedIn post** in your voice — a "process diary" walking from positioning conversation in Claude → markdown brand brief → Lovable build → live site at `deepgrain.ai`. Naming both Claude and Lovable.
2. A **5-slide carousel** (1080×1350 PNGs, LinkedIn portrait), site-faithful: linen background, `#123524` deep green type, brass `#b58a4a` accents, Cormorant Garamond display, 12px brass eyebrows. Hybrid structure: hook → Diagnose → Build → Scale → how it was built / CTA.

Both delivered as files in `/mnt/documents/` so you can download and post directly.

## The post (draft for review inside the plan)

Long-form, plainspoken, no hype words, British English, declarative short sentences. Roughly this shape — final copy will be tightened in the file:

> I built deepgrain.ai over a weekend. The stack was a conversation and a build tool.
>
> Day one: a long positioning conversation with Claude. Not a prompt. A conversation. We argued about what the practice actually was, what it wasn't, who it was for, and what the voice should sound like out loud. The output wasn't a deck. It was a small folder of markdown files — a brand brief, a tone-of-voice document, a manifesto, an offer matrix.
>
> Day two: I handed those markdown files to Lovable and asked it to build the site. Not "make me a landing page" — "here is the practice; build the front door."
>
> The grain metaphor came out of the Claude conversation. Carpenters don't argue with wood. They read it first. Most consulting argues with the wood. Deepgrain reads it.
>
> What I offer sits in three movements: **Diagnose. Build. Scale.** A 30-day operating diagnostic. Agents and automations built into the workflow, function by function. Then the cadence so the gains compound after I leave.
>
> Two things I'd tell anyone trying this:
> 1. Spend longer than feels comfortable on the positioning conversation. The build is fast; the brief is the work.
> 2. Write the brief in markdown, not slides. Build tools read markdown like a native language.
>
> Site is live: https://deepgrain.ai
> Carousel below walks through the offer and how it was built. ↓

Closes with a soft line about the AI Operating Index for anyone who wants a starting point.

## The carousel (5 slides, 1080×1350)

| # | Background | Eyebrow | Headline | Body | Visual motif |
|---|------------|---------|----------|------|--------------|
| 1 | Linen | `A PRACTICE, BUILT IN A WEEKEND` | *Work with the grain.* | "How I built deepgrain.ai with Claude and Lovable." | Brass top rule, large Cormorant display, small wordmark `Deepgrain` bottom-left |
| 2 | Linen | `01 — DIAGNOSE` | *Read the grain first.* | "A 30-day operating diagnostic. Where work actually flows. Where decisions get made. Where AI leverage is sitting unused." | Numbered top-left `01`, brass rule, brass-highlighted phrase on "AI leverage is sitting unused" |
| 3 | Linen | `02 — BUILD` | *Cut with it, not against it.* | "Agents and automations built into the workflow, function by function. Plus the enablement so the team can run them." | Same numbered structure, brass highlight |
| 4 | Linen | `03 — SCALE` | *Make the gains compound.* | "Strategy at the top. Capability across the team. The operating cadence that keeps the work compounding after I leave." | Same structure, brass highlight |
| 5 | Linen | `HOW IT WAS BUILT` | *Markdown in. Site out.* | Two-column: **Positioning** — long conversation in Claude; output a folder of markdown briefs. **Build** — handed the briefs to Lovable; site shipped in a weekend. CTA: `deepgrain.ai` + small note "Take the AI Operating Index". | Brass rule between the two columns, small `Claude · Lovable` credit at the bottom |

Every slide:
- Linen `#e8dfcd` background.
- Body type in deep green `#123524`.
- 3px brass `#b58a4a` rule at top under the eyebrow (the site's signature).
- Cormorant Garamond for display, system sans for eyebrow + body.
- Generous margin (≈80px), `Deepgrain` wordmark bottom-left, slide number bottom-right (`01 / 05` etc.).
- No emoji, no icons, no stock imagery. Quiet authority — same as the site.

## How it gets built

- **Post**: written straight to `/mnt/documents/linkedin-post.md` (and a `.txt` plain-text mirror for easy paste into LinkedIn).
- **Carousel**: a single Python script using Pillow renders all five slides at 1080×1350 PNG. Cormorant Garamond pulled from the canvas-design skill fonts; system sans fallback for body. Brass rule, eyebrow, headline, body, wordmark, page number all positioned from the same layout function so they're pixel-consistent across slides.
- **QA loop**: render all 5 → inspect each PNG → fix any overflow, low contrast, baseline drift, or rule misalignment → re-render → repeat until clean. Report what was checked and any fixes made. No browser tools, no copying QA images to `/mnt/documents/`.

## Files delivered

- `/mnt/documents/linkedin-post.md` — long-form post, formatted.
- `/mnt/documents/linkedin-post.txt` — same, plain text for the LinkedIn composer.
- `/mnt/documents/deepgrain-carousel-01.png` through `-05.png` — the five branded slides, 1080×1350, ready to upload as a LinkedIn document/carousel.

## Out of scope

- Posting to LinkedIn directly (no API connector wired up).
- Animated/video version of the carousel.
- A Canva-editable version — these are flat PNGs. If you want a Canva template later, that's a separate pass.
- Changes to the live site or any code in the project.

