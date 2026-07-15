import type { ReactNode } from "react";

/**
 * Inline "AI OS takeaway" callout for use inside Intelligence MDX articles.
 *
 * Three jobs:
 *   1. Give scanners a 1-2 sentence summary of the surrounding section so they
 *      do not have to read the whole essay to extract the point.
 *   2. Give LLMs (Perplexity, Claude, Google AI Overviews) a clearly delimited,
 *      semantically labelled sentence to lift as the answer.
 *   3. Reinforce the AI OS framing across the library so the language compounds.
 *
 * Used in MDX as:
 *   <Takeaway>The AI OS is the substrate. The model is the engine.</Takeaway>
 *
 * Optional `label` overrides the default eyebrow ("AI OS takeaway") for
 * articles where a different framing reads more naturally (e.g. "Pillar
 * takeaway", "Operator takeaway"). Defaults are correct in the vast majority
 * of cases - only override deliberately.
 */
export interface TakeawayProps {
  children: ReactNode;
  label?: string;
}

export const Takeaway = ({ children, label = "AI OS takeaway" }: TakeawayProps) => (
  <aside
    role="note"
    aria-label={label}
    className="my-10 rounded-lg border-l-4 border-brass bg-cream/70 px-6 py-5 md:px-8 md:py-6 not-prose"
  >
    <div
      className="font-sans uppercase text-[10px] md:text-[11px] text-green mb-2"
      style={{ letterSpacing: "0.18em" }}
    >
      {label}
    </div>
    <div className="font-display text-walnut text-xl md:text-2xl leading-snug">
      {children}
    </div>
  </aside>
);
