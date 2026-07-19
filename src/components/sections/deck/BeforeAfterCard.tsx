import { type ReactNode } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MetricBlock } from "@/components/sections/deck/MetricBlock";

export interface BeforeAfter {
  eyebrow: string;
  headline: string;
  beforeLabel?: string;
  beforeValue: string;
  beforeCaption?: ReactNode;
  beforeChips?: string[];
  afterLabel?: string;
  afterValue: string;
  afterCaption?: ReactNode;
  afterChips?: string[];
  judgement?: ReactNode;
}

const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-walnut/20 px-3.5 py-1.5 text-xs text-walnut/80">
    {children}
  </span>
);

/**
 * Before/after card pair, deck-slide-10 styled. Used across the Work page
 * so every case study leads with the same numeric anchor pattern.
 */
export const BeforeAfterCard = ({ item }: { item: BeforeAfter }) => (
  <section className="bg-linen text-walnut section-pad">
    <div className="container-grain">
      <ScrollReveal>
        <div
          className="font-sans uppercase text-[hsl(35,45%,30%)] mb-3"
          style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 600 }}
        >
          {item.eyebrow}
        </div>
        <h3 className="font-display text-walnut text-3xl md:text-5xl leading-[1.05] max-w-3xl">
          {item.headline}
        </h3>
        <div className="mt-6 h-px w-full bg-brass/30" />
      </ScrollReveal>

      <div className="mt-12 grid lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-6 items-stretch">
        <ScrollReveal>
          <div className="bg-cream rounded-2xl p-7 md:p-9 h-full border border-walnut/10 shadow-[0_20px_50px_-40px_hsl(var(--walnut)/0.5)]">
            <div
              className="font-sans uppercase text-[hsl(35,45%,30%)] mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}
            >
              {item.beforeLabel ?? "Before"}
            </div>
            <MetricBlock tone="linen" value={item.beforeValue} caption={item.beforeCaption} />
            {item.beforeChips && (
              <div className="mt-6 flex flex-wrap gap-2">
                {item.beforeChips.map((c) => (
                  <Chip key={c}>{c}</Chip>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        <div className="flex items-center justify-center text-[hsl(35,45%,30%)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="hidden lg:block">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="lg:hidden">
            <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <ScrollReveal delay={120}>
          <div className="bg-cream rounded-2xl p-7 md:p-9 h-full border border-walnut/10 shadow-[0_20px_50px_-40px_hsl(var(--walnut)/0.5)]">
            <div
              className="font-sans uppercase text-[hsl(35,45%,30%)] mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}
            >
              {item.afterLabel ?? "After"}
            </div>
            <MetricBlock tone="linen" value={item.afterValue} caption={item.afterCaption} />
            {item.afterChips && (
              <div className="mt-6 flex flex-wrap gap-2">
                {item.afterChips.map((c) => (
                  <Chip key={c}>{c}</Chip>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>

      {item.judgement && (
        <ScrollReveal delay={200}>
          <div className="mt-10 border-l-2 border-brass/60 bg-cream/60 px-6 py-5 max-w-4xl">
            <p className="text-walnut/85 leading-relaxed text-sm md:text-base">
              <span className="text-[hsl(35,45%,30%)] font-semibold">⚖ </span>
              {item.judgement}
            </p>
          </div>
        </ScrollReveal>
      )}
    </div>
  </section>
);
