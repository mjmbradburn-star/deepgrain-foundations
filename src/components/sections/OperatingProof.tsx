import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const stats = [
  { value: 83, suffix: "", label: "Hours per week reclaimed", sub: "Around 2 FTE of capacity created from a single engagement." },
  { value: 70, suffix: "%", label: "Routine work eliminated", sub: "People Ops query handling. Automated end to end." },
  { value: 0, suffix: "", label: "Support calls in 2 months", sub: "Post engagement. Champions still building independently." },
];

export const OperatingProof = () => (
  <section className="bg-green text-cream section-pad">
    <div className="container-grain grid gap-16 lg:grid-cols-2 lg:gap-24">
      <ScrollReveal>
        <Eyebrow className="text-cream/60 mb-6">How Deepgrain works</Eyebrow>
        <h2 className="font-display text-5xl md:text-6xl lg:text-[72px] leading-[1.05] text-cream">
          One consultancy.<br />The output of five.
        </h2>
        <div className="mt-8 max-w-md text-cream/80 space-y-5 leading-relaxed">
          <p>
            Deepgrain runs on deep human pattern recognition and software agents
            built specifically for this work. What once required a team now
            happens faster, more precisely, and without the overhead.
          </p>
          <p className="hidden md:block">
            This isn&apos;t a selling point. It&apos;s how the work gets done,
            and it&apos;s proof, because we built it for ourselves first.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-8">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 100}>
            <div className="group relative border-t border-cream/15 pt-8">
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-brass transition-transform duration-[1400ms] ease-out group-data-[reveal=in]:scale-x-100"
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              />
              <div className="font-display font-semibold text-brass text-6xl md:text-7xl lg:text-[96px] leading-none tabular-nums">
                <AnimatedNumber value={s.value} suffix={s.suffix} duration={1600} />
              </div>
              <Eyebrow className="text-cream mt-4">{s.label}</Eyebrow>
              <p className="hidden md:block mt-3 text-cream/70 max-w-sm">{s.sub}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);
