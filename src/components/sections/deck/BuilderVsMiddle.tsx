import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";

const builders = [
  "Already wires their own tools together on the quiet.",
  "Talks about the work in workflows, not headcount.",
  "Has a backlog of friction they'd fix if anyone asked.",
];

const middle = [
  { state: "Leaning in", body: "Curious, asking how to use the new tools well. Multiply these people first." },
  { state: "Freezing", body: "Quiet, watching. Will move once the first builder ships something visible." },
  { state: "Resisting", body: "Active brake. Often the most experienced. Needs honest air cover, not training." },
];

/**
 * Enablement spine, ported from deck slide 13. The two-column argument:
 * find your builder (where the upside is), then move your middle layer
 * (where the value leaks).
 */
export const BuilderVsMiddle = () => (
  <section className="bg-linen text-walnut section-pad">
    <div className="container-grain">
      <ScrollReveal>
        <SectionEyebrow tone="linen" className="mb-6">Where the value is</SectionEyebrow>
        <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
          Find your builder. Move your middle layer.
        </h2>
        <div className="mt-6 h-px w-full bg-brass/40 max-w-4xl" />
      </ScrollReveal>

      <div className="mt-16 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <ScrollReveal>
          <div className="rounded-2xl border border-brass/40 bg-brass/[0.06] p-8 md:p-10 h-full">
            <div
              className="font-sans uppercase text-brass mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
            >
              ✦ The builder
            </div>
            <h3 className="font-display text-walnut text-2xl md:text-3xl">
              One person. Three workflows shipped. The whole function shifts.
            </h3>
            <p className="mt-5 text-walnut/80 leading-relaxed">
              In every function there is one person who is already doing this. Find them, name
              them, give them air cover and a fifth of the week. The upside is asymmetric.
            </p>
            <ul className="mt-6 space-y-3">
              {builders.map((b) => (
                <li key={b} className="flex items-start gap-3 text-walnut/85 leading-relaxed">
                  <span className="text-brass mt-0.5">↗</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="rounded-2xl border border-walnut/15 bg-cream/50 p-8 md:p-10 h-full">
            <div
              className="font-sans uppercase text-walnut/55 mb-3"
              style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
            >
              ◌ The middle layer
            </div>
            <h3 className="font-display text-walnut text-2xl md:text-3xl">
              Where the value leaks. Three postures, all real.
            </h3>
            <p className="mt-5 text-walnut/80 leading-relaxed">
              The middle layer decides whether the practice spreads or stalls. They are not the
              enemy. They are watching to see whether you mean it.
            </p>
            <ul className="mt-6 space-y-5">
              {middle.map((m) => (
                <li key={m.state} className="border-t border-walnut/15 pt-4">
                  <div
                    className="font-sans uppercase text-brass"
                    style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                  >
                    {m.state}
                  </div>
                  <p className="mt-2 text-walnut/80 leading-relaxed">{m.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);
