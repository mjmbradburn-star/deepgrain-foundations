import { Reveal } from "@/components/ui/Reveal";
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
      <Reveal>
        <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
          What we will not automate.
        </h2>
      </Reveal>

      <div className="mt-14 md:mt-20 grid md:grid-cols-3 gap-8 md:gap-10">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="border-t border-walnut/20 pt-6">
              <div className="mb-5 rounded-full bg-brass/10 p-1 ring-1 ring-brass/20 w-11 h-11 flex items-center justify-center">
                <span className="flex h-full w-full items-center justify-center rounded-full text-brass text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                  {p.icon}
                </span>
              </div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl mb-3">
                {p.title}
              </h3>
              <p className="text-walnut/75 leading-relaxed">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-14 font-display italic text-walnut/70 text-xl md:text-2xl max-w-2xl">
          A function that automates its judgement has not become resilient. It has become brittle
          and deniable.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <div className="mt-16 md:mt-20">
          <AuditPrompt
            tone="linen"
            ctaId="audit_home_counterweight"
            ctaLocation="home_counterweight"
            headline="Map one workflow with me."
            sub="Thirty minutes. Honest answers. One first move."
            prefill="I'd like a 30-minute call. The workflow I'd most like to fix is:"
          />
        </div>
      </Reveal>
    </div>
  </section>
);
