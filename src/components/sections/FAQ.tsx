import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { Eyebrow } from "@/components/ui/Eyebrow";

export interface FAQItem {
  question: string;
  /**
   * Plain-text answer — required, and what gets emitted into FAQPage JSON-LD.
   * Google requires the schema's `answer.text` to mirror visible wording, so
   * this string MUST contain the full readable answer (no link markup).
   */
  answer: string;
  /**
   * Optional rich rendering for the answer (e.g. inline <Link> elements or a
   * trailing "Related" link). When present, this is what users see; `answer`
   * remains the canonical text shipped in JSON-LD. Keep the prose identical
   * to `answer` — only add navigational affordances, never new claims.
   */
  answerNode?: ReactNode;
}

/**
 * Visual treatment for the FAQ block.
 *
 * - `section` (default): full-bleed section used on /method, /people-ops,
 *   /enablement — own background, large display heading, BrassRule, eyebrow.
 * - `inline`: composes inside an existing article body. No background of its
 *   own, no eyebrow, heading drops to article-h2 scale (`text-3xl md:text-4xl`)
 *   so it reads as a section *within* the prose rather than a new page chapter.
 *   Question text drops one notch closer to body weight to match article rhythm.
 */
type FAQVariant = "section" | "inline";

interface FAQProps {
  eyebrow?: string;
  heading: string;
  items: FAQItem[];
  variant?: FAQVariant;
}

/**
 * Visible FAQ block. Pair with buildFAQLd in the same page so the schema
 * mirrors the rendered Q&A — Google requires the markup to match what
 * users actually see, otherwise it's grounds for a manual action.
 */
export const FAQ = ({
  eyebrow = "Common questions",
  heading,
  items,
  variant = "section",
}: FAQProps) => {
  if (variant === "inline") {
    // Designed to be placed *inside* the article body's existing max-w-2xl
    // container — does NOT render its own section/container, so it inherits
    // the article's measure and vertical rhythm. Heading and question text
    // align with the article h2/h3 scale defined in mdxComponents.tsx.
    return (
      <section className="mt-16 pt-12 border-t border-walnut/15" aria-label={eyebrow}>
        <h2
          className="font-display text-3xl md:text-4xl text-walnut leading-tight mb-8"
          style={{ letterSpacing: "-0.005em" }}
        >
          {heading}
        </h2>
        <dl className="divide-y divide-walnut/15 border-t border-walnut/15">
          {items.map((item) => (
            <details
              key={item.question}
              className="group py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                <dt className="font-display text-walnut text-lg md:text-xl leading-snug">
                  {item.question}
                </dt>
                <span
                  aria-hidden
                  className="mt-1.5 shrink-0 text-brass text-xl leading-none transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="mt-4 text-walnut/85 leading-[1.7] text-[17px] md:text-[18px]">
                {item.answerNode ?? item.answer}
              </dd>
            </details>
          ))}
        </dl>
      </section>
    );
  }

  // Default: full-bleed section — used on /method, /people-ops, /enablement.
  return (
    <section className="bg-linen text-walnut section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">{eyebrow}</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            {heading}
          </h2>
          <BrassRule className="mt-10 mb-12" />
          <dl className="divide-y divide-walnut/15">
            {items.map((item) => (
              <details
                key={item.question}
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                  <dt className="font-display text-walnut text-xl md:text-2xl leading-snug">
                    {item.question}
                  </dt>
                  <span
                    aria-hidden
                    className="mt-2 shrink-0 text-brass text-2xl leading-none transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <dd className="mt-5 text-walnut/80 leading-relaxed text-base md:text-lg">
                  {item.answerNode ?? item.answer}
                </dd>
              </details>
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  );
};

/**
 * Builds schema.org FAQPage JSON-LD that mirrors the visible FAQ.
 * Always uses the plain-text `answer` field so the schema text matches the
 * prose users read (excluding link chrome), per Google's structured-data rules.
 */
export const buildFAQLd = (items: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.question,
    acceptedAnswer: { "@type": "Answer", text: i.answer },
  })),
});
