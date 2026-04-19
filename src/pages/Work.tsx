import { caseStudies } from "@/data/caseStudies";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { LogoCarousel } from "@/components/sections/LogoCarousel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const variants: Array<"linen" | "walnut" | "green"> = ["linen", "walnut", "linen", "green"];

const Work = () => (
  <>
    <section className="bg-green text-cream pt-40 pb-20">
      <div className="container-grain max-w-4xl">
        <ScrollReveal>
          <Eyebrow className="text-cream/70 mb-6">The Work</Eyebrow>
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[96px] leading-[1.02] text-balance">
            Engagements that left something behind.
          </h1>
          <p className="mt-8 text-cream/80 max-w-2xl leading-relaxed text-lg">
            A small set of organisations who chose to understand themselves
            first. Each engagement built to compound long after we'd left.
          </p>
        </ScrollReveal>
      </div>
    </section>

    <LogoCarousel background="walnut" showHeadline={false} />

    {caseStudies.map((study, i) => (
      <CaseStudyCard key={study.id} study={study} variant={variants[i]} />
    ))}
  </>
);

export default Work;
