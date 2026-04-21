import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrassRule } from "@/components/ui/BrassRule";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

/**
 * Mobile-only condensed merge of OperatingProof + ClientVoice.
 * Interleaves stat → quote → stat → quote → stat to cut ~1.5 screens of scroll
 * between Method and IntelligenceTeaser on small viewports.
 *
 * Rendered with `md:hidden` from Home.tsx; desktop continues to render the two
 * full sections.
 */
const stats = [
  {
    value: 83,
    suffix: "",
    label: "Hours per week reclaimed",
    sub: "Around 2 FTE of capacity created from a single engagement.",
  },
  {
    value: 70,
    suffix: "%",
    label: "Routine work eliminated",
    sub: "People Ops query handling. Automated end to end.",
  },
  {
    value: 0,
    suffix: "",
    label: "Support calls in 2 months",
    sub: "Champions still building independently after we left.",
  },
];

const quote = {
  text:
    "Matt worked alongside our teams across People, Finance, and Legal, building real solutions to our challenges as we scaled at pace.",
  attribution: "Chief People Officer, Defence Technology Company",
};

export const MobileProofVoice = () => (
  <section className="md:hidden bg-walnut text-cream py-14">
    <div className="container-grain max-w-md">
      <ScrollReveal>
        <Eyebrow withRule className="text-cream/60 mb-4">
          How Deepgrain works
        </Eyebrow>
        <h2 className="font-display text-4xl text-cream leading-[1.05]">
          One consultancy.<br />The output of five.
        </h2>
      </ScrollReveal>

      <div className="mt-10 space-y-10">
        {stats.map((s, i) => (
          <div key={s.label}>
            <ScrollReveal delay={i * 80}>
              <div className="border-t border-cream/15 pt-6">
                <div className="font-display font-semibold text-brass text-6xl leading-none tabular-nums">
                  <AnimatedNumber value={s.value} suffix={s.suffix} duration={1400} />
                </div>
                <Eyebrow className="text-cream mt-3">{s.label}</Eyebrow>
                <p className="mt-2 text-cream/70 text-sm">{s.sub}</p>
              </div>
            </ScrollReveal>

            {i === 1 && (
              <ScrollReveal delay={120} className="mt-10">
                <BrassRule className="mb-6" />
                <blockquote className="font-display italic text-2xl leading-snug text-cream">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                <p className="mt-5 text-brass text-[11px] uppercase tracking-[0.15em]">
                  {quote.attribution}
                </p>
                <BrassRule className="mt-6" />
              </ScrollReveal>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
