import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { LogoCarousel } from "@/components/sections/LogoCarousel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { EmailCapture } from "@/components/forms/EmailCapture";
import { PageMeta } from "@/components/seo/PageMeta";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const variants: Array<"linen" | "walnut" | "green"> = ["linen", "walnut", "linen", "green"];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do you measure whether the work actually compounded?",
    answer:
      "We define two or three operating metrics with you at the start of an engagement — usually a mix of throughput (hours reclaimed, cycle time on a named workflow) and durability (number of internal champions still extending the system 60 and 120 days after we leave). We come back at the 90-day mark to read those numbers with you, on the record. If they didn't move, we say so.",
  },
  {
    question: "What does 'lasting change' look like in practice?",
    answer:
      "Concretely: a People Ops team handling 70% of inbound queries through systems they own and modify themselves; a finance close that runs without the consultant who designed it; a hiring loop that survives the departure of the head of talent. The test is whether the work keeps running, and keeps improving, without us in the room.",
  },
  {
    question: "How are case studies selected, and what gets anonymised?",
    answer:
      "We only publish case studies the client has reviewed and approved line by line. Where the work touches sensitive sectors — defence, regulated finance, early-stage climate — we anonymise the company name and any identifying detail of the engagement. The patterns and numbers are real; the brand is held back when the client prefers it that way.",
  },
  {
    question: "What are the confidentiality boundaries during and after the work?",
    answer:
      "Everything we see inside an organisation is covered by an NDA from the first conversation. We don't share client names without written permission, we don't reuse client artefacts, and we don't take on directly competing engagements inside a 12-month window without disclosing both sides. Patterns we observe inform our writing; specifics never do.",
  },
  {
    question: "What proof can you share in a sales conversation that you can't publish?",
    answer:
      "On a call, under NDA, we can walk through the operating diagnostics, the actual systems we built, the before-and-after metrics, and the names of organisations and operators who'll vouch for the work. We can also share full post-engagement readouts. None of this lives on the public site, by design.",
  },
  {
    question: "Will you put us in touch with a reference client?",
    answer:
      "Yes. After a first conversation, if the fit looks right, we'll introduce you to one or two operators we've worked with — typically a Chief People Officer or COO — who can speak directly to how the engagement ran and what was left behind. We ask permission before each introduction; we never broker a reference cold.",
  },
];

const Work = () => (
  <>
    <PageMeta
      title="Work · Case studies | Deepgrain"
      description="Case studies from our consulting work across defence tech, financial data, transit and mobility, climate, and AI-native companies."
      image="https://deepgrain.ai/og-work.png"
      path="/work"
      jsonLd={[
        buildBreadcrumbLd([
          { name: "Home", url: "https://deepgrain.ai/" },
          { name: "Work", url: "https://deepgrain.ai/work" },
        ]),
        buildFAQLd(FAQ_ITEMS),
      ]}
    />
    <section className="bg-green text-cream pt-40 pb-20">
      <div className="container-grain max-w-4xl">
        <ScrollReveal>
          <Eyebrow withRule className="text-cream/70 mb-6">The Work</Eyebrow>
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

    <FAQ
      eyebrow="Outcomes & proof"
      heading="What you can expect to take away."
      items={FAQ_ITEMS}
    />

    <section className="bg-linen py-20 md:py-28">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow withRule className="text-walnut/60 mb-6">Stay close</Eyebrow>
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
