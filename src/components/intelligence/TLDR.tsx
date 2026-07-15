import type { ReactNode } from "react";

/**
 * Standfirst summary placed at the very top of an Intelligence article.
 *
 * Why this exists:
 *   - Search snippets and LLM retrievers chunk and quote the first scannable
 *     block they find. A clear summary near the top becomes the answer they
 *     lift into AI Overviews, Perplexity, ChatGPT, Claude.
 *   - Human readers who don't have time get the point in 30 seconds.
 *
 * It renders as a quiet editorial standfirst set in the reading column, not a
 * boxed callout. Larger serif, brass tick markers, a single hairline above.
 * The label is kept for assistive tech only (aria-label), never shown, so it
 * reads like a lead a person wrote rather than an LLM-bait card.
 *
 * Usage in MDX:
 *   <TLDR>
 *     - First takeaway as a complete sentence.
 *     - Second takeaway, also a sentence.
 *     - Third.
 *   </TLDR>
 *
 * Keep it 3 to 5 bullets, each a complete sentence.
 */
export const TLDR = ({ children }: { children: ReactNode }) => (
  <aside role="note" aria-label="Summary" className="not-prose mb-12 md:mb-16">
    <div className="border-t border-walnut/20 pt-7 font-display text-[21px] md:text-[24px] leading-[1.45] text-walnut/90 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-3 [&_ol]:list-none [&_ol]:pl-0 [&_ol]:space-y-3 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.72em] [&_li]:before:h-px [&_li]:before:w-3.5 [&_li]:before:bg-brass/70 [&_li]:before:content-['']">
      {children}
    </div>
  </aside>
);
