import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { ValueVisualiser } from "@/components/sections/ValueVisualiser";
import { BuildVsHire } from "@/components/sections/BuildVsHire";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";

// Each FAQ keeps `answer` as the canonical text mirrored in JSON-LD; `answerNode`
// adds inline navigation (where natural) or a trailing "Related" link (otherwise)
// so users can jump straight to the relevant section after reading.
const linkCls = "text-brass underline-offset-4 hover:underline";
const trailingCls = "mt-3 inline-flex items-center gap-1 text-sm text-brass font-medium hover:text-walnut transition-colors";

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How long does a Deepgrain engagement run?",
    answer:
      "Most engagements run between three and nine months. We start with a 30-day Read phase to surface the operating reality, then move into Craft (typically 60–120 days of focused interventions paired with champion development), and finally a Scale phase that hands the practice over to your team. Some clients renew into a lighter advisory cadence after that.",
    answerNode: (
      <>
        Most engagements run between three and nine months. We start with a 30-day{" "}
        <Link to="/method#read" className={linkCls}>Read</Link> phase to surface the operating reality, then move into{" "}
        <Link to="/method#craft" className={linkCls}>Craft</Link> (typically 60–120 days of focused interventions paired with champion development), and finally a{" "}
        <Link to="/method#scale" className={linkCls}>Scale</Link> phase that hands the practice over to your team. Some clients renew into a lighter advisory cadence after that.
      </>
    ),
  },
  {
    question: "What does the first 30 days actually look like?",
    answer:
      "The Read phase. Matt sits inside your operating cadence — standups, one-to-ones, leadership reviews — and runs structured interviews across the org. The output is a written diagnostic: where the operating story diverges from the operating reality, which interventions would compound, and which would break the grain. No slideware, no benchmarks. A document leadership can act on.",
    answerNode: (
      <>
        The <Link to="/method#read" className={linkCls}>Read</Link> phase. Matt sits inside your operating cadence — standups, one-to-ones, leadership reviews — and runs structured interviews across the org. The output is a written diagnostic: where the operating story diverges from the operating reality, which interventions would compound, and which would break the grain. No slideware, no benchmarks. A document leadership can act on.
      </>
    ),
  },
  {
    question: "What deliverables do we walk away with?",
    answer:
      "Three things. First, the diagnostic document from the Read phase. Second, the interventions themselves — usually a small set of agentic systems and operating rituals built and shipped during Craft. Third, three or four trained champions inside the team who can extend, debug, and govern the work after we leave. The capability stays with you, not in a vendor.",
    answerNode: (
      <>
        Three things. First, the diagnostic document from the{" "}
        <Link to="/method#read" className={linkCls}>Read</Link> phase. Second, the interventions themselves — usually a small set of agentic systems and operating rituals built and shipped during{" "}
        <Link to="/method#craft" className={linkCls}>Craft</Link>. Third, three or four trained champions inside the team who can extend, debug, and govern the work after we leave. The capability stays with you, not in a vendor.
        <Link to="/enablement" className={trailingCls}>
          See how champions are trained →
        </Link>
      </>
    ),
  },
  {
    question: "Who is the right fit for this work?",
    answer:
      "Founders and operating leaders inside organisations worth getting right — typically AI-native, defence tech, financial data, transit and mobility, or climate. The common thread: leadership willing to look at the operating reality honestly, and a team capable of holding the practice once we hand it over.",
    answerNode: (
      <>
        Founders and operating leaders inside organisations worth getting right — typically AI-native, defence tech, financial data, transit and mobility, or climate. The common thread: leadership willing to look at the operating reality honestly, and a team capable of holding the practice once we hand it over.
        <Link to="/work" className={trailingCls}>
          See who we work with →
        </Link>
      </>
    ),
  },
  {
    question: "Do I need a technical team to make this work?",
    answer:
      "No. The champion model is built around non-engineers — heads of People, ops leads, chiefs of staff, domain operators. They learn to design and run agents inside their own function. We bring the engineering muscle when something needs to be built deeper, but the day-to-day capability lives with operators, not coders.",
    answerNode: (
      <>
        No. The champion model is built around non-engineers — heads of People, ops leads, chiefs of staff, domain operators. They learn to design and run agents inside their own function. We bring the engineering muscle when something needs to be built deeper, but the day-to-day capability lives with operators, not coders.
        <Link to="/enablement" className={trailingCls}>
          How the champion model works →
        </Link>
      </>
    ),
  },
  {
    question: "How does pricing work?",
    answer:
      "Engagements are scoped per phase, not by retainer or day rate. We share indicative ranges in the first conversation once we understand the shape of the work — write to matt@deepgrain.ai to start there.",
    answerNode: (
      <>
        Engagements are scoped per phase, not by retainer or day rate. We share indicative ranges in the first conversation once we understand the shape of the work — write to matt@deepgrain.ai to start there.
        <Link to="/contact" className={trailingCls}>
          Start the conversation →
        </Link>
      </>
    ),
  },
];

// HowTo schema mirrors the visible Read · Craft · Scale sections below.
// Step descriptions stay short and faithful to the on-page prose so the
// markup-vs-content match Google requires for HowTo eligibility holds.
const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Deepgrain method: Read · Craft · Scale",
  description:
    "Three sequential movements for building AI capability that compounds inside an organisation: read the operating reality, craft interventions with the grain, then leave something that scales.",
  totalTime: "P9M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Read the grain",
      url: "https://deepgrain.ai/method#read",
      text: "A 30-day operating diagnostic. Sit inside the operating cadence, run structured interviews, and surface where the operating story diverges from the operating reality. Output is a written diagnostic leadership can act on — not slideware.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Craft with the grain",
      url: "https://deepgrain.ai/method#craft",
      text: "Build a small set of agentic systems and operating rituals alongside three or four internal champions. Human judgment and machine precision working together, designed around how this specific organisation actually moves.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Scale without breaking the grain",
      url: "https://deepgrain.ai/method#scale",
      text: "Hand the practice to the team. Trained champions extend the work into corners we never touched. The capability stays in the function, not in a vendor.",
    },
  ],
};

// Service schema declares the consultancy offering for entity-graph clarity.
// Kept conservative: no price (no public pricing on site), no aggregateRating
// (no published reviews). Only claims that are supported by visible page copy.
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Deepgrain operating consultancy",
  serviceType: "Organisational consultancy and AI operating systems",
  description:
    "Operating consultancy that reads an organisation's grain, builds agentic systems and rituals with it, and leaves a trained internal capability behind.",
  url: "https://deepgrain.ai/method",
  provider: {
    "@type": "Organization",
    name: "Deepgrain",
    url: "https://deepgrain.ai",
    email: "matt@deepgrain.ai",
  },
  areaServed: { "@type": "Place", name: "United Kingdom" },
  audience: {
    "@type": "Audience",
    audienceType: "Founders and operating leaders in AI-native, defence tech, financial data, transit and mobility, and climate organisations",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Engagement phases",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Read",
          description: "30-day operating diagnostic. Written output leadership can act on.",
          url: "https://deepgrain.ai/method#read",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Craft",
          description: "Building agentic systems and operating rituals with internal champions.",
          url: "https://deepgrain.ai/method#craft",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Scale",
          description: "Capability handover. Champions extend the practice after the engagement ends.",
          url: "https://deepgrain.ai/method#scale",
        },
      },
    ],
  },
};

const MethodPage = () => (
  <>
    <PageMeta
      title="Method · Read · Craft · Scale | Deepgrain"
      description="The Deepgrain method in full. Read the operating reality, craft the smallest interventions that compound, then scale without breaking the grain."
      image="https://deepgrain.ai/og-method.png"
      path="/method"
      jsonLd={[
        buildBreadcrumbLd([
          { name: "Home", url: "https://deepgrain.ai/" },
          { name: "Method", url: "https://deepgrain.ai/method" },
        ]),
        buildFAQLd(FAQ_ITEMS),
        howToLd,
        serviceLd,
      ]}
    />
    {/* Intro */}
    <section className="relative min-h-[80vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp"
          srcSet="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=640&q=55&fm=webp 640w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp 1200w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=60&fm=webp 1600w"
          sizes="100vw"
          alt=""
          width={1600}
          height={1067}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green/60" />
      </div>
      <div className="relative container-grain pb-20 md:pb-32 pt-40">
        <div className="relative max-w-4xl bg-walnut/88 backdrop-blur-sm rounded-[48px] md:rounded-[72px] p-10 md:p-16 border border-brass/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
          <ScrollReveal>
            <Eyebrow className="text-brass mb-6">The Method</Eyebrow>
            <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[96px] leading-[1.02] text-balance">
              Read the grain. Build with it. Leave something that lasts.
            </h1>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Read */}
    <section id="read" className="bg-linen text-body section-pad scroll-mt-40">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">01 Read</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
            Before we touch a thing, we understand.
          </h2>
          <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
            <p>
              Most consulting starts with the org chart. We start somewhere
              else. The org chart is rarely how decisions actually get made,
              and the strategy deck is rarely what drives the outcome.
            </p>
            <p className="hidden md:block">
              Underneath all of it is a grain. The real pattern of how this
              organisation moves and decides. We read it first. We talk to
              the people doing the work. We watch where energy flows and
              where it stalls. We find the fractures forming before anyone
              has named them. Only then do we build.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Craft */}
    <section id="craft" className="bg-walnut text-cream section-pad scroll-mt-40">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">02 Craft</Eyebrow>
          <h2 className="font-display text-cream text-4xl md:text-6xl leading-tight">
            We build with the grain, not against it.
          </h2>
          <div className="mt-10 space-y-6 text-cream/80 leading-relaxed text-lg">
            <p>
              Human judgment and machine precision, working together from day
              one. Agents that remove friction without removing thought.
              Systems designed around how this specific place actually works,
              rather than borrowed from a playbook that worked somewhere else.
            </p>
            <p className="hidden md:block">
              The carpenter knows the wood will split if you cut against the
              grain. So do we. We build alongside your people, in your tools,
              with your context. Then we hand it over.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Empowerment beat */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">The partnership</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
            Agents that partner. People who grow.
          </h2>
          <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
            <p>
              Agents take the repeatable, low-judgment work. Your champions
              learn to design, run, and extend them. The capability stays in
              the team, not in a vendor.{" "}
              <Link to="/enablement" className="text-brass underline-offset-4 hover:underline">
                See how enablement works →
              </Link>
            </p>
            <p className="hidden md:block">
              This is a training programme that happens to ship working
              systems alongside it. The hours we reclaim go back to your
              people for the work only they can do.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Build vs Hire — sits between Craft and Scale */}
    <BuildVsHire />

    {/* Scale */}
    <section id="scale" className="bg-linen text-body section-pad scroll-mt-40">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">03 Scale</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
            We leave something that compounds.
          </h2>
          <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
            <p>
              Not a deck. A genuine capability. Teams who think well with AI,
              and structures that hold as you grow.
            </p>
            <p className="hidden md:block">
              Two months after the engagement ends, our champions are still
              building. They have extended the work into places we never
              touched. That is the test. What you still have, and what you
              have added, six months on.
            </p>
          </div>

          {/* Champions trained — pull-quote callout linking to the deep dive */}
          <Link
            to="/enablement"
            className="group mt-12 block rounded-2xl border-l-4 border-brass bg-walnut/[0.04] p-7 md:p-9 transition-colors hover:bg-walnut/[0.07]"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-brass font-semibold">
                  Champions trained
                </div>
                <p className="mt-3 font-display text-walnut text-2xl md:text-3xl leading-snug text-balance">
                  &ldquo;You don&apos;t need engineers to build AI capability inside
                  the function. You need three or four champions, given air cover
                  and time.&rdquo;
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-brass font-medium transition-colors group-hover:text-walnut">
                  See how enablement works
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>

    {/* Value visualiser */}
    <ValueVisualiser />

    {/* FAQ */}
    <FAQ heading="What clients ask before they engage." items={FAQ_ITEMS} />

    {/* CTA */}
    <section className="bg-green text-cream section-pad">
      <div className="container-grain max-w-3xl text-center">
        <ScrollReveal>
          <BrassRule className="mx-auto mb-10" />
          <h2 className="font-display text-cream text-4xl md:text-6xl lg:text-7xl leading-tight text-balance">
            Want to see what reading your grain might surface?
          </h2>
          <div className="mt-12">
            <PillButton href="/contact" variant="filled">Start the conversation →</PillButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default MethodPage;
