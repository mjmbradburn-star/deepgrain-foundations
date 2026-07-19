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
  // linen sits on a light surface: brass at hsl(35,42%,52%) fails AA here (~2.46:1),
  // so linen uses a darker, walnut-tinted version of the same brass hue instead.
  linen: { bg: "bg-linen", text: "text-body", heading: "text-walnut", subtle: "text-body/75", rule: "border-walnut/15", accent: "text-[hsl(35,45%,30%)]" },
  walnut: { bg: "bg-walnut", text: "text-cream", heading: "text-cream", subtle: "text-cream/75", rule: "border-cream/15", accent: "text-brass" },
  green: { bg: "bg-green", text: "text-cream", heading: "text-cream", subtle: "text-cream/75", rule: "border-cream/15", accent: "text-brass" },
};

export const CaseStudyCard = ({ study, variant }: Props) => {
  const v = variantMap[variant];
  return (
    <section className={cn(v.bg, v.text, "section-pad")}>
      <div className="container-grain max-w-5xl">
        <ScrollReveal>
          <Eyebrow className={cn(v.accent, "mb-6")}>{study.eyebrow}</Eyebrow>
          <h2 className={cn("font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] whitespace-pre-line", v.heading)}>
            {study.headline}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className={cn("mt-10 space-y-5 max-w-2xl leading-relaxed text-lg", v.subtle)}>
            {study.body.map((p, i) => (
              <p key={i} className={i >= 1 ? "hidden md:block" : undefined}>{p}</p>
            ))}
          </div>
        </ScrollReveal>

        {study.metrics.length > 0 && (
          <ScrollReveal delay={200}>
            <div className={cn("mt-16 grid gap-10 md:grid-cols-3 border-t pt-10", v.rule)}>
              {study.metrics.map((m) => (
                <div key={m.label}>
                  <div className={cn("font-display font-semibold text-5xl md:text-6xl leading-none", v.accent)}>
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
              <p className={cn(v.accent, "mt-6 text-xs uppercase tracking-[0.15em]")}>
                {study.testimonial.attribution}
              </p>
            </div>
          </ScrollReveal>
        )}

        {study.outcomes && (
          <ScrollReveal delay={300}>
            <div className={cn("hidden md:block mt-12 border-t pt-8 max-w-2xl space-y-2 text-sm", v.rule, v.subtle)}>
              {study.outcomes.map((o) => (
                <p key={o} className={v.accent}>{o}</p>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
