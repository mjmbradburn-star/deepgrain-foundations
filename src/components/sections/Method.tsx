import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";
import { BrassRule } from "@/components/ui/BrassRule";

// Read · Craft · Scale — the deeper method behind Diagnose · Build · Scale.
// Lives on walnut so it visually separates from the linen WhatWeDo section,
// and leans into the craft/reading language rather than restating services.
const levels = [
  {
    label: "Organisation",
    body: "Strategy, operating model, and the systems thinking that holds it all together.",
  },
  {
    label: "Function",
    body: "The agentic systems and workflows that let each team operate at a different order of magnitude.",
  },
  {
    label: "Individual capability",
    body: "Coaching the people who will keep evolving this long after we&rsquo;re gone.",
  },
];

const movements = [
  {
    title: "Read",
    body:
      "Before any tool, any agent, any framework — we read the grain. How decisions actually get made. Where energy flows. Where fractures are forming before anyone has named them.",
  },
  {
    title: "Craft",
    body:
      "We build with the grain, not against it. Human judgment and machine precision working as one system. Interventions sized to the smallest change that produces the largest effect.",
  },
  {
    title: "Scale",
    body:
      "We leave a capability, not a deck. Teams who think well with AI. Cadences that hold as you grow. The discipline to keep what works and let the rest go.",
  },
];

export const Method = () => (
  <section className="bg-walnut text-cream section-pad">
    <div className="container-grain">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow className="text-brass mb-6">The deeper method</Eyebrow>
          <h2
            className="font-display text-cream text-4xl md:text-6xl leading-[1.05] text-balance"
            style={{ letterSpacing: "-0.015em" }}
          >
            Read · Craft · Scale.
          </h2>
          <p className="mt-6 text-cream/70 leading-relaxed text-lg">
            Diagnose, Build, Scale is what we deliver. Read, Craft, Scale is how
            we work — three movements in order. Skip the first and the rest is
            theatre.
          </p>
          <BrassRule className="mx-auto mt-10" />
        </div>
      </ScrollReveal>

          <BrassRule className="mx-auto mt-10" />
        </div>
      </ScrollReveal>

      {/* Three levels of change — echoes the ICP strip framing */}
      <ScrollReveal>
        <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
          <p className="text-center font-display italic text-cream/70 text-xl md:text-2xl leading-snug">
            We work across{" "}
            <span className="text-brass not-italic font-medium">
              three levels of change.
            </span>
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {levels.map((l, i) => (
              <div
                key={l.label}
                className={`md:px-6 ${i > 0 ? "md:border-l md:border-cream/10" : ""}`}
              >
                <div
                  className="font-sans uppercase text-brass text-[11px] md:text-[12px] font-semibold"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {l.label}
                </div>
                <p
                  className="mt-3 text-cream/75 leading-relaxed text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: l.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="mt-20 md:mt-24 grid gap-12 md:grid-cols-3 md:gap-0 max-w-5xl mx-auto">
        {movements.map((m, i) => (
          <ScrollReveal
            key={m.title}
            delay={i * 120}
            className={`md:px-10 ${i > 0 ? "md:border-l md:border-cream/15" : ""}`}
          >
            <h3
              className="font-display italic text-brass text-3xl md:text-4xl"
              style={{ letterSpacing: "-0.005em" }}
            >
              {m.title}
            </h3>
            <p className="mt-5 text-cream/80 leading-relaxed">{m.body}</p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-16 md:mt-20 text-center">
          <PillButton href="/method" variant="outline">
            The full method →
          </PillButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
