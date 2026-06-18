import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { SectionLocator } from "@/components/sections/deck/SectionLocator";

const NodeChip = ({
  label,
  title,
  sub,
  icon,
  filled,
}: {
  label?: string;
  title: string;
  sub?: string;
  icon?: string;
  filled?: boolean;
}) => (
  <div className="text-center">
    {label && (
      <div
        className="font-sans uppercase text-brass mb-2"
        style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
      >
        {label}
      </div>
    )}
    <div
      className={[
        "rounded-xl px-4 py-3 border min-w-[180px]",
        filled
          ? "bg-brass/15 border-brass/60 text-cream"
          : "bg-green/40 border-cream/15 text-cream",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 justify-center text-sm">
        {icon && <span className="text-brass">{icon}</span>}
        <span className="font-display text-base">{title}</span>
      </div>
      {sub && <div className="text-cream/50 text-[11px] mt-1">{sub}</div>}
    </div>
  </div>
);

const Arrow = () => (
  <div className="hidden lg:flex items-center justify-center text-brass/70 px-2">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/**
 * Home section, ported from deck slide 8. Anchors "we run agents ourselves"
 * with one honest diagram: inputs → orchestrator → sub-agents → human gate.
 */
export const AgentArchitecture = () => (
  <section className="relative bg-green text-cream section-pad overflow-hidden">
    <div className="relative container-grain">
      <ScrollReveal>
        <SectionEyebrow className="mb-6">Behind the scenes · how I run my own practice</SectionEyebrow>
        <h2 className="font-display text-cream text-4xl md:text-6xl leading-[1.05] max-w-3xl">
          I ran this on my own desk first.
        </h2>
        <div className="mt-6 h-px w-full bg-brass/30 max-w-4xl" />
        <p className="mt-8 text-cream/80 max-w-3xl text-lg leading-relaxed">
          An agent architecture that takes every meeting action and every email, pulls the actions
          out of a call, routes them, and drafts what comes next. Several iterations to get it
          honest. Now it runs the back office of my practice.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <div className="mt-16 md:mt-20 grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6 lg:gap-2 items-center">
          <div className="space-y-3">
            <NodeChip label="Inputs" title="Meeting actions" icon="◷" />
            <NodeChip title="Emails" icon="✉" />
          </div>
          <Arrow />
          <NodeChip label="Orchestrator" title="Hermes" sub="Routes the work" icon="◉" />
          <Arrow />
          <div className="space-y-3">
            <NodeChip label="Sub-agents" title="Classify" icon="⌗" />
            <NodeChip title="Extract" icon="▸" />
            <NodeChip title="Draft" icon="✎" />
          </div>
          <Arrow />
          <NodeChip label="Human gate" title="I decide + send" sub="Gmail, Notion" icon="✓" filled />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="mt-16 grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="border border-brass/40 rounded-xl px-5 py-4 text-center">
            <div className="font-display text-3xl text-brass">5 to 1</div>
            <div className="text-cream/60 text-[10px] uppercase tracking-[0.25em] mt-1">
              Run by one
            </div>
          </div>
          <p className="text-cream/85 text-lg leading-relaxed max-w-2xl">
            Two things it never touches.{" "}
            <span className="text-brass font-semibold">What to say yes to. Who to say it to.</span>{" "}
            It drafts. I decide.
          </p>
        </div>
      </ScrollReveal>

      <SectionLocator index={3} total={5} right="The practice" tone="green" className="mt-20" />
    </div>
  </section>
);
