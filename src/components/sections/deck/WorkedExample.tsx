import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { MetricBlock } from "@/components/sections/deck/MetricBlock";
import { AuditPrompt } from "@/components/sections/deck/AuditPrompt";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-walnut/20 px-3.5 py-1.5 text-xs text-walnut/80">
    {children}
  </span>
);

/**
 * Double-bezel shell. Outer machined tray + inner core with concentric radii
 * and a hairline inset highlight, so the before/after cards read as physical
 * hardware rather than flat panels.
 */
const Bezel = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full rounded-[2rem] bg-walnut/[0.04] p-1.5 ring-1 ring-walnut/10 shadow-[0_40px_80px_-50px_hsl(var(--walnut)/0.5)]">
    <div className="h-full rounded-[1.625rem] bg-cream p-8 md:p-10 border border-walnut/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.65)]">
      {children}
    </div>
  </div>
);

/**
 * Home worked-example section, ported from deck slide 10. The single most
 * persuasive artefact in the deck: a real before/after on a real workflow,
 * rendered at numeric anchor weight.
 */
export const WorkedExample = () => (
  <section className="bg-linen text-walnut section-pad">
    <div className="container-grain">
      <Reveal>
        <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
          Mapped, then rebuilt. In that order.
        </h2>
        <p className="mt-5 text-walnut/70 max-w-2xl text-lg md:text-xl leading-relaxed">
          A real people workflow, joiner to first pay run.
        </p>
      </Reveal>

      <div className="mt-14 md:mt-20 grid lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-6 items-stretch">
        <Reveal className="h-full">
          <Bezel>
            <div
              className="font-sans uppercase text-brass mb-6"
              style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}
            >
              ⏱  Before · joiner to first pay run
            </div>
            <MetricBlock
              tone="linen"
              value={<AnimatedNumber value={40} countUp suffix=" min" />}
              caption="of handling, per joiner. Most of it rekeying and chasing, for the least judgement."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>▦ 3 systems</Chip>
              <Chip>⌥ 4 handoffs</Chip>
              <Chip>⚖ 2 real checks</Chip>
            </div>
            <div className="mt-10 text-walnut/60 text-xs uppercase tracking-widest">
              14 atomic steps
            </div>
          </Bezel>
        </Reveal>

        <div className="flex items-center justify-center text-brass">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="hidden lg:block">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="lg:hidden">
            <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <Reveal delay={120} className="h-full">
          <Bezel>
            <div
              className="font-sans uppercase text-brass mb-6"
              style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}
            >
              ◷  After · redesigned, then automated
            </div>
            <MetricBlock
              tone="linen"
              value={<AnimatedNumber value={12} countUp suffix=" min" />}
              caption="of reviewing, per joiner. An agent assembles, a human checks eligibility and signs."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>↺ 5 redesigned out</Chip>
              <Chip>⚙ Agent assembles</Chip>
              <Chip>✓ Human signs</Chip>
            </div>
            <div className="mt-10 text-walnut/60 text-xs uppercase tracking-widest">
              9 kept · 5 cut
            </div>
          </Bezel>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="mt-10 border-l-2 border-brass/60 bg-cream/60 px-6 py-5 max-w-4xl">
          <p className="text-walnut/85 leading-relaxed text-sm md:text-base">
            <span className="text-brass font-semibold">⚖ </span>
            The judgement step stayed human, by choice. Reclaimed time only counts if redeployed,
            not re-absorbed.
          </p>
        </div>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-16 md:mt-20">
          <AuditPrompt
            tone="linen"
            ctaId="audit_home_worked_example"
            ctaLocation="home_worked_example"
            prefill="I'd like to map one of my workflows with you. The one that wastes the most time per week is:"
          />
        </div>
      </Reveal>
    </div>
  </section>
);
