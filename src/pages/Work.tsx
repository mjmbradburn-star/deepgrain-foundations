import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { LogoCarousel } from "@/components/sections/LogoCarousel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { EmailCapture } from "@/components/forms/EmailCapture";
import { PageMeta } from "@/components/seo/PageMeta";

const variants: Array<"linen" | "walnut" | "green"> = ["linen", "walnut", "linen", "green"];

const Work = () => (
  <>
    <PageMeta
      title="Work · Case studies | Deepgrain"
      description="Case studies from our consulting work across defence tech, financial data, transit and mobility, climate, and AI-native companies."
      image="https://deepgrain.ai/og-work.png"
      path="/work"
    />
    <section className="bg-green text-cream pt-40 pb-20">
      <div className="container-grain max-w-4xl">
        <ScrollReveal>
          <Eyebrow className="text-cream/70 mb-6">The Work</Eyebrow>
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[96px] leading-[1.02] text-balance">
            Engagements that create lasting change.
          </h1>
          <p className="mt-8 text-cream/80 max-w-2xl leading-relaxed text-lg">
            A small set of organisations who chose to read themselves first.
            Each engagement built to compound long after we'd left.
          </p>
        </ScrollReveal>
      </div>
    </section>

    <LogoCarousel background="walnut" showHeadline={false} />

    {caseStudies.map((study, i) => (
      <CaseStudyCard key={study.id} study={study} variant={variants[i]} />
    ))}

    <section className="bg-walnut text-cream py-14 md:py-16">
      <div className="container-grain">
        <ScrollReveal>
          <Link
            to="/enablement"
            className="group flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <p className="font-display text-cream text-2xl md:text-3xl leading-snug max-w-3xl">
              Every engagement leaves a trained team behind.{" "}
              <span className="text-brass transition-colors group-hover:text-cream">
                See how →
              </span>
            </p>
            <ArrowUpRight
              className="hidden md:block h-7 w-7 text-brass transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={2}
            />
          </Link>
        </ScrollReveal>
      </div>
    </section>

    <section className="bg-linen py-20 md:py-28">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-walnut/60 mb-6">Stay close</Eyebrow>
          <EmailCapture
            source="work"
            variant="light"
            heading="Field notes from the work."
            description="A short dispatch, a few times a quarter. Patterns we keep seeing in how organisations actually run."
          />
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default Work;
