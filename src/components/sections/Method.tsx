import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";

// Homepage Method teaser. The full Read · Craft · Scale story and the live
// Value Visualiser both live on /method — here we tease the visualiser as the
// magnet to click through.
const sliders = [
  { label: "Team size", display: "25 people", fill: 11 },
  { label: "Hours/week lost", display: "8 hrs/week", fill: 33 },
  { label: "Loaded hourly cost", display: "£70/hr", fill: 27 },
];

const stats = [
  { label: "People upskilled", value: "25" },
  { label: "Annual value", value: "£1.2M" },
];

export const Method = () => (
  <section className="bg-walnut text-cream section-pad">
    <div className="container-grain">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20 items-center">
        {/* Left — copy */}
        <ScrollReveal>
          <Eyebrow className="text-brass mb-6">The Method</Eyebrow>
          <h2
            className="font-display text-cream text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance"
            style={{ letterSpacing: "-0.015em" }}
          >
            Read the grain. Build with it. Leave something that compounds.
          </h2>
          <p className="mt-6 text-cream/75 leading-relaxed text-lg">
            Read · Craft · Scale is how we work across{" "}
            <span className="text-brass font-medium">three levels of change</span>
            . Agents partner with your people on the repeatable work, and we
            coach the champions who keep building after we leave. The full
            method — and a live model of what it could be worth in your
            function — sits one click away.
          </p>
          <div className="mt-10">
            <PillButton href="/method" variant="filled">
              See what it's worth in your function →
            </PillButton>
          </div>
        </ScrollReveal>

        {/* Right — static visualiser teaser card */}
        <ScrollReveal delay={120}>
          <Link
            to="/method"
            aria-label="Open the full method and value visualiser"
            className="group relative block rounded-2xl bg-linen text-body p-7 md:p-9 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] ring-1 ring-brass/30 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
          >
            {/* Click affordance */}
            <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-walnut/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-walnut/60 transition-colors group-hover:bg-brass/15 group-hover:text-brass">
              Explore
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
            </span>

            <div className="text-[11px] uppercase tracking-[0.2em] text-walnut/55 font-semibold">
              Value Visualiser
            </div>
            <div className="mt-1 font-display text-walnut text-2xl md:text-[28px] leading-tight">
              What might this be worth in your function?
            </div>

            {/* Static slider rows */}
            <div className="mt-8 space-y-6">
              {sliders.map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-display text-walnut text-base md:text-lg">
                      {s.label}
                    </span>
                    <span className="font-display text-brass text-base md:text-lg tabular-nums">
                      {s.display}
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full rounded-full bg-walnut/15">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-brass"
                      style={{ width: `${s.fill}%` }}
                    />
                    <div
                      className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-brass bg-cream shadow-md"
                      style={{ left: `${s.fill}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Headline outputs — empowerment first */}
            <div className="mt-9 pt-7 border-t border-walnut/10">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-walnut/55 font-semibold">
                      {s.label}
                    </div>
                    <div className="mt-2 font-display font-semibold text-brass text-3xl md:text-4xl leading-none tabular-nums">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-[11px] text-walnut/55 italic">
                Directional model · live on /method
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  </section>
);
