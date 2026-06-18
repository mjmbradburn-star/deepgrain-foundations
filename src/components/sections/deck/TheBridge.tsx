import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { MetricBlock } from "@/components/sections/deck/MetricBlock";
import { SectionLocator } from "@/components/sections/deck/SectionLocator";

const ways = [
  { icon: "✕", text: "Avoid a hire you would otherwise make." },
  { icon: "↗", text: "Absorb growth without adding cost." },
  { icon: "✓", text: "Redeploy senior people onto judgement work that moves the number." },
];

/**
 * Home section, ported from deck slide 11. The bridge from operations to
 * value: hours only count if you spend them.
 */
export const TheBridge = () => (
  <section className="relative bg-green text-cream section-pad overflow-hidden">
    <div className="relative container-grain">
      <ScrollReveal>
        <SectionEyebrow className="mb-6">The bridge</SectionEyebrow>
        <h2 className="font-display text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
          Reclaimed capacity is not value until you spend it.
        </h2>
        <div className="mt-6 h-px w-full bg-brass/30 max-w-3xl" />
      </ScrollReveal>

      <div className="mt-16 md:mt-20 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
        <ScrollReveal>
          <div
            className="font-sans uppercase text-brass mb-6"
            style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}
          >
            Hours convert to value three ways
          </div>
          <ul className="space-y-5">
            {ways.map((w) => (
              <li key={w.text} className="flex items-start gap-4 text-cream/90 text-lg leading-relaxed">
                <span className="text-brass font-display text-xl mt-0.5">{w.icon}</span>
                <span>{w.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-brass/50 px-3.5 py-1.5 text-xs text-brass">
              ⚡ Tech enablement
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-brass/50 px-3.5 py-1.5 text-xs text-brass">
              ◌ Operational improvement
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="rounded-2xl border border-brass/40 p-8 md:p-10 bg-gradient-to-br from-brass/5 to-transparent">
            <div
              className="font-sans uppercase text-brass mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}
            >
              ◯ Illustrative
            </div>
            <MetricBlock tone="green" size="lg" value="1 FTE" />
            <p className="mt-6 text-cream/80 leading-relaxed">
              A 40-person function, thirty minutes a week each, is roughly one full-time role you
              take off the cost line or redeploy to a value lever. The map you build is
              exit-diligence a buyer credits.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <SectionLocator index={4} total={5} right="The bridge" tone="green" className="mt-20" />
    </div>
  </section>
);
