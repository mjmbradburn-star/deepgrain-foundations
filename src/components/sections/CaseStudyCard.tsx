import { Eyebrow } from "@/components/ui/Eyebrow";
import { BrassRule } from "@/components/ui/BrassRule";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/data/caseStudies";
import { cn } from "@/lib/utils";

interface Props {
  study: CaseStudy;
  variant: "linen" | "walnut" | "green";
}

const variantMap = {
  linen: { bg: "bg-linen", text: "text-body", heading: "text-walnut", subtle: "text-body/75", rule: "border-walnut/15" },
  walnut: { bg: "bg-walnut", text: "text-cream", heading: "text-cream", subtle: "text-cream/75", rule: "border-cream/15" },
  green: { bg: "bg-green", text: "text-cream", heading: "text-cream", subtle: "text-cream/75", rule: "border-cream/15" },
};

export const CaseStudyCard = ({ study, variant }: Props) => {
  const v = variantMap[variant];
  return (
    <section className={cn(v.bg, v.text, "section-pad")}>
      <div className="container-grain max-w-5xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-6">{study.eyebrow}</Eyebrow>
          <h2 className={cn("font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] whitespace-pre-line", v.heading)}>
            {study.headline}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className={cn("mt-10 space-y-5 max-w-2xl leading-relaxed text-lg", v.subtle)}>
            {study.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </ScrollReveal>

        {study.metrics.length > 0 && (
          <ScrollReveal delay={200}>
            <div className={cn("mt-16 grid gap-10 md:grid-cols-3 border-t pt-10", v.rule)}>
              {study.metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none">
                    {m.value}
                  </div>
                  <p className={cn("mt-4 text-sm", v.subtle)}>{m.label}</p>
                  {m.sub && <p className={cn("mt-2 text-xs opacity-70", v.subtle)}>{m.sub}</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {study.testimonial && (
          <ScrollReveal delay={250}>
            <div className="mt-16 max-w-3xl">
              <BrassRule className="mb-8" />
              <blockquote className={cn("font-display italic text-2xl md:text-3xl leading-snug", v.heading)}>
                &ldquo;{study.testimonial.quote}&rdquo;
              </blockquote>
              <p className="mt-6 text-brass text-xs uppercase tracking-[0.15em]">
                {study.testimonial.attribution}
              </p>
            </div>
          </ScrollReveal>
        )}

        {study.outcomes && (
          <ScrollReveal delay={300}>
            <div className={cn("mt-12 border-t pt-8 max-w-2xl space-y-2 text-sm", v.rule, v.subtle)}>
              {study.outcomes.map((o) => (
                <p key={o} className="text-brass/90">{o}</p>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
