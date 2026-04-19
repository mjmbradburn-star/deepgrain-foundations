import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  {
    n: "01",
    title: "Read",
    body:
      "Before anything is built, we understand. Not the org chart. The grain. Where decisions really get made. Where energy flows and where it stalls. Where fractures are forming before anyone has named them.",
  },
  {
    n: "02",
    title: "Craft",
    body:
      "We build with the grain, not against it. Human judgment and machine precision, working together from day one. Agents that remove friction without removing thought. Systems designed around how this specific place actually works.",
  },
  {
    n: "03",
    title: "Scale",
    body:
      "We leave something that compounds. Not a deck. A genuine capability. Teams who think well with AI. Structures that hold as you grow. The clarity to make hard decisions without losing what makes the place good.",
  },
];

export const Method = () => (
  <section className="bg-linen text-body section-pad">
    <div className="container-grain">
      <ScrollReveal>
        <Eyebrow className="text-body/60 text-center mb-6">The Method</Eyebrow>
        <h2 className="sr-only">The Method</h2>
      </ScrollReveal>
      <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
        {steps.map((s, i) => (
          <ScrollReveal
            key={s.n}
            delay={i * 120}
            className={`md:px-10 ${i > 0 ? "md:border-l md:border-walnut/15" : ""}`}
          >
            <div className="font-sans text-brass text-sm tracking-[0.15em]">{s.n}</div>
            <h3 className="font-display text-walnut text-3xl md:text-4xl mt-2">{s.title}</h3>
            <p className="mt-6 text-body/85 leading-relaxed">{s.body}</p>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);
