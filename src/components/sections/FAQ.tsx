import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { Eyebrow } from "@/components/ui/Eyebrow";

export interface FAQItem {
  question: string;
  /** Plain text answer — what gets emitted into FAQPage JSON-LD. */
  answer: string;
}

interface FAQProps {
  eyebrow?: string;
  heading: string;
  items: FAQItem[];
}

/**
 * Visible FAQ block. Pair with FAQPageLd in the same page so the schema
 * mirrors the rendered Q&A — Google requires the markup to match what
 * users actually see, otherwise it's grounds for a manual action.
 */
export const FAQ = ({ eyebrow = "Common questions", heading, items }: FAQProps) => (
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
                {item.answer}
              </dd>
            </details>
          ))}
        </dl>
      </ScrollReveal>
    </div>
  </section>
);

/** Builds schema.org FAQPage JSON-LD that mirrors the visible FAQ. */
export const buildFAQLd = (items: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.question,
    acceptedAnswer: { "@type": "Answer", text: i.answer },
  })),
});
