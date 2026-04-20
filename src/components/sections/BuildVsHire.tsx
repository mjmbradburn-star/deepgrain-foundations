import { forwardRef, useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

/**
 * Fixed-scenario comparison: a mid-level Ops hire vs an in-house agent
 * doing the same shape of work, costed honestly over 1, 2 and 3 years.
 *
 * Hire (loaded annual cost): salary + employer NI + pension + tooling + onboarding (yr 1).
 * Agent: one-off build + annual run (LLM tokens, monitoring, periodic improvement).
 */
const HIRE = {
  yr1: 110_000, // £80k base + ~25k loaded (NI, pension, tooling) + ~5k onboarding amortised in yr 1
  yr2: 105_000, // £80k base + ~25k loaded
  yr3: 108_000, // small uplift
};

const AGENT = {
  build: 18_000, // one-off, amortised over 3 years
  run: 12_000, // tokens + monitoring + periodic improvement
};

const agentCost = (year: 1 | 2 | 3) => {
  const amortisedBuild = AGENT.build / 3;
  return Math.round(amortisedBuild + AGENT.run) * year;
};

const hireCost = (year: 1 | 2 | 3) => {
  if (year === 1) return HIRE.yr1;
  if (year === 2) return HIRE.yr1 + HIRE.yr2;
  return HIRE.yr1 + HIRE.yr2 + HIRE.yr3;
};

type Year = 1 | 2 | 3;
const YEARS: Year[] = [1, 2, 3];

export const BuildVsHire = () => {
  const [year, setYear] = useState<Year>(3);
  const hire = hireCost(year);
  const agent = agentCost(year);
  const saving = hire - agent;
  const ratio = hire / Math.max(agent, 1);
  const hirePct = 100;
  const agentPct = (agent / hire) * 100;

  return (
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-5xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">Build or hire</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
            One mid-level hire. Or one well-built agent.
          </h2>
          <p className="mt-6 max-w-2xl text-body/75 leading-relaxed text-lg">
            Same shape of work. Same expected output. Costed honestly — loaded
            salary on one side, build plus run on the other. The gap widens
            every year you keep the agent running.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          {/* Year toggle */}
          <div className="mt-12 inline-flex rounded-full border border-walnut/15 bg-cream p-1">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                aria-pressed={year === y}
                className={
                  "px-6 py-2.5 rounded-full text-sm uppercase tracking-[0.18em] transition-colors " +
                  (year === y
                    ? "bg-walnut text-cream"
                    : "text-walnut/60 hover:text-walnut")
                }
              >
                {y} {y === 1 ? "year" : "years"}
              </button>
            ))}
          </div>

          {/* Comparison */}
          <div key={`cards-${year}`} className="mt-12 grid gap-6 md:grid-cols-2 animate-fade-in">
            <CostCard
              label="New hire"
              sub="Loaded annual cost"
              amount={hire}
              barPct={hirePct}
              tone="muted"
            />
            <CostCard
              label="Agent"
              sub="Amortised build + run"
              amount={agent}
              barPct={agentPct}
              tone="brass"
            />
          </div>

          {/* Verdict */}
          <div className="mt-10 grid gap-8 sm:grid-cols-2 border-t border-walnut/15 pt-10">
            <div>
              <Eyebrow className="text-brass mb-3">Saving</Eyebrow>
              <div className="font-display font-semibold text-walnut text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={saving} live prefix="£" />
              </div>
              <p className="mt-3 text-sm text-body/60">
                Over {year} {year === 1 ? "year" : "years"}, against the same
                output.
              </p>
            </div>
            <div>
              <Eyebrow className="text-brass mb-3">Ratio</Eyebrow>
              <div className="font-display font-semibold text-walnut text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={ratio} live decimals={1} suffix="×" />
              </div>
              <p className="mt-3 text-sm text-body/60">
                The hire costs that many times what the agent does, at this
                horizon.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-12 max-w-2xl text-sm text-body/60 italic leading-relaxed">
            Indicative only. Hire assumes a mid-level London Ops salary
            (~£80k base) loaded with NI, pension, tooling and amortised
            onboarding. Agent assumes an £18k build amortised across three
            years, plus £12k/year for tokens, monitoring and periodic
            improvement. The agent does not replace a human — it removes a
            hire that would otherwise have been needed for the same workload.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

interface CostCardProps {
  label: string;
  sub: string;
  amount: number;
  barPct: number;
  tone: "muted" | "brass";
}

const CostCard = forwardRef<HTMLDivElement, CostCardProps>(({ label, sub, amount, barPct, tone }, forwardedRef) => {
  // Bar animates width on amount change.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setShown(barPct), 30);
    return () => window.clearTimeout(t);
  }, [barPct]);

  return (
    <div
      ref={forwardedRef}
      className={
        "rounded-2xl border p-8 " +
        (tone === "brass"
          ? "border-brass/40 bg-cream"
          : "border-walnut/15 bg-cream/60")
      }
    >
      <div className="flex items-baseline justify-between mb-1">
        <Eyebrow className={tone === "brass" ? "text-brass" : "text-walnut/60"}>
          {label}
        </Eyebrow>
        <span className="text-xs text-walnut/50">{sub}</span>
      </div>
      <div className="mt-4 font-display font-semibold text-walnut text-5xl md:text-6xl leading-none tabular-nums">
        <AnimatedNumber value={amount} live prefix="£" />
      </div>
      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-walnut/10">
        <div
          className={
            "h-full transition-[width] duration-700 ease-out " +
            (tone === "brass" ? "bg-brass" : "bg-walnut/40")
          }
          style={{ width: `${shown}%` }}
        />
      </div>
    </div>
  );
});
CostCard.displayName = "CostCard";
