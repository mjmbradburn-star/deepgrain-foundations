import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { SectionLocator } from "@/components/sections/deck/SectionLocator";
import { AuditPrompt } from "@/components/sections/deck/AuditPrompt";

const pillars = [
  {
    icon: "⚖",
    title: "The judgement call",
    body: "Who is at risk, who gets the role, what is fair. The agent drafts. The human decides and owns it.",
  },
  {
    icon: "◈",
    title: "Accountability",
    body: "When it goes wrong, a name is on it, never the tool. Who owns the agent, who audits it, where the data sits.",
  },
  {
    icon: "✦",
    title: "The relationship",
    body: "The hard conversation, the trust, the read of the room.",
  },
];

/**
 * Home section, ported from deck slide 12. The counterweight. Names what we
 * will not automate. This is the section that directly addresses the
 * "AI will replace people" objection that quietly blocks bookings.
 */
export const TheCounterweight = () => (
  <section className="bg-linen text-walnut section-pad">
    <div className="container-grain">
      <ScrollReveal>
        <SectionEyebrow tone="linen" className="mb-6">The counterweight</SectionEyebrow>
        <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
          What we will not automate.
        </h2>
        <div className="mt-6 h-px w-full bg-brass/40 max-w-3xl" />
      </ScrollReveal>

      <div className="mt-14 md:mt-20 grid md:grid-cols-3 gap-8 md:gap-10">
        {pillars.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 100}>
            <div className="border-t border-walnut/20 pt-6">
              <div className="text-brass text-2xl mb-4">{p.icon}</div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl mb-3">
                {p.title}
              </h3>
              <p className="text-walnut/75 leading-relaxed">{p.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={200}>
        <p className="mt-14 font-display italic text-walnut/70 text-xl md:text-2xl max-w-2xl">
          A function that automates its judgement has not become resilient. It has become brittle
          and deniable.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={280}>
        <div className="mt-16 md:mt-20 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <SectionLocator index={5} total={5} right="The counterweight" tone="linen" />
          <AuditPrompt
            tone="linen"
            ctaId="audit_home_counterweight"
            ctaLocation="home_counterweight"
            headline="Map one workflow with me."
            sub="Thirty minutes. Honest answers. One first move."
            prefill="I'd like a 30-minute audit. The workflow I'd most like to fix is:"
          />
        </div>
      </ScrollReveal>
    </div>
  </section>
);
