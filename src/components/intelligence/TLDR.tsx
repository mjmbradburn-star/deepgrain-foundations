import type { ReactNode } from "react";

/**
 * TL;DR block placed at the very top of an Intelligence article.
 *
 * Why this exists:
 *   - Search snippets and LLM retrievers chunk and quote the first scannable
 *     block they find. A clearly labelled, bulleted summary becomes the
 *     answer they lift into Google AI Overviews, Perplexity, ChatGPT, Claude.
 *   - Human readers who don't have time get the point in 30 seconds.
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
  <aside
    role="note"
    aria-label="TL;DR"
    className="not-prose my-10 rounded-lg border border-walnut/15 bg-cream/60 px-6 py-6 md:px-8 md:py-7"
  >
    <div
      className="font-sans uppercase text-[10px] md:text-[11px] text-green mb-3"
      style={{ letterSpacing: "0.18em" }}
    >
      TL;DR
    </div>
    <div className="font-sans text-[17px] md:text-[18px] leading-[1.6] text-walnut/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_p]:mb-3 [&_p:last-child]:mb-0">
      {children}
    </div>
  </aside>
);
