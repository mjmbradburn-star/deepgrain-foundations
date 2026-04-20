import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

const items = [
  {
    number: "01",
    title: "Diagnose",
    body:
      "A 30-day operating diagnostic. We read where work actually flows, where decisions get made, and where AI leverage is sitting unused.",
  },
  {
    number: "02",
    title: "Build",
    body:
      "Agents and automations built into the workflow, function by function. Plus the enablement and training so the team can run them.",
  },
  {
    number: "03",
    title: "Scale",
    body:
      "Strategy at the top, capability across the team. We embed the operating cadence so the gains compound after we leave.",
  },
];

/**
 * Concrete "What we do" triplet. Sits between LogoCarousel and BeliefStatement
 * to anchor the brand narrative in practical services before the metaphor.
 */
export const WhatWeDo = () => (
  <section className="bg-linen py-20 md:py-28">
    <div className="container-grain">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <Eyebrow className="text-walnut/70 mb-4">What we do</Eyebrow>
          <h2
            className="font-display text-walnut text-3xl md:text-5xl leading-[1.05] text-balance"
            style={{ letterSpacing: "-0.01em" }}
          >
            Diagnose. Build. Scale.
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-10 md:gap-8 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 100}>
            <div className="border-t border-walnut/20 pt-6 md:pt-8 h-full">
              <div
                className="font-sans text-[11px] uppercase text-brass mb-4"
                style={{ letterSpacing: "0.18em" }}
              >
                {item.number}
              </div>
              <h3
                className="font-display text-walnut text-2xl md:text-3xl mb-4"
                style={{ letterSpacing: "-0.005em" }}
              >
                {item.title}
              </h3>
              <p className="text-walnut/75 leading-relaxed">{item.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);
