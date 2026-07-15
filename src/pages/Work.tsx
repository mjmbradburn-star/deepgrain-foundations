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
import { BarkSection } from "@/components/ui/BarkSection";
import { Invitation } from "@/components/sections/Invitation";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { BeforeAfterCard, type BeforeAfter } from "@/components/sections/deck/BeforeAfterCard";
import { AuditPrompt } from "@/components/sections/deck/AuditPrompt";
import { track } from "@/lib/analytics";

const variants: Array<"linen" | "walnut" | "green"> = ["linen", "walnut", "linen", "green"];

const heroBeforeAfter: BeforeAfter = {
  eyebrow: "Hero case · Defence tech · Series B · 200 people",
  headline: "Finance and People Ops, before and after we read the grain.",
  beforeLabel: "⏱  Before · weekly admin load",
  beforeValue: "83 hrs",
  beforeCaption:
    "of rekeying, chasing and re-answering across Finance and People Ops. The most expensive seats doing the least judgement work.",
  beforeChips: ["▦ 3 systems out of sync", "⌥ Repeating policy questions", "⚖ No time for the real work"],
  afterLabel: "◷  After · 12-week engagement",
  afterValue: "60% / 70%",
  afterCaption:
    "of Finance time reclaimed; seventy percent of People Ops queries handled by systems the team owns and modifies itself.",
  afterChips: ["⚙ Agents wired in", "✦ 5 champions trained", "✓ 0 critical issues, 2 months on"],
  judgement:
    "Two months on the champions had shipped five more agents we never scoped. That is the test.",
};

const beforeAfterGallery: BeforeAfter[] = [
  {
    eyebrow: "Financial data and analytics · ~600 people · multi-cohort",
    headline: "From training programme to production tools.",
    beforeValue: "15 people",
    beforeCaption: "across two timezones, fluent on prompts but with nothing shipped end to end.",
    beforeChips: ["⌥ Training fatigue", "▦ No production agents"],
    afterValue: "5 tools",
    afterCaption: "live in seven weeks. Five squads, one production solution each, owned by the function.",
    afterChips: ["⚙ 5 production tools", "✦ Champions still building"],
  },
  {
    eyebrow: "Transit technology · PE backed · 260 people",
    headline: "A doing problem, not a training problem.",
    beforeValue: "£40k",
    beforeCaption: "in licences and a champions programme producing no outputs outside engineering.",
    beforeChips: ["⌥ Licences unused", "◌ No internal builders"],
    afterValue: "1 tool, 2 builders",
    afterCaption: "one named production tool, two internal builders who can maintain and extend everything.",
    afterChips: ["✦ 40 enabled in wave one", "✓ £40k cost retired"],
  },
  {
    eyebrow: "Climate consultancy · growth stage · ~60 people",
    headline: "A new operating model, not a new tool.",
    beforeValue: "Ad hoc",
    beforeCaption: "associate lifecycle held together by individuals, breaking quietly under growth.",
    beforeChips: ["⌥ Onboarding gaps", "▦ Lost institutional knowledge"],
    afterValue: "1 lifecycle",
    afterCaption: "redesigned from joiner to leaver, with AI woven through every stage, built to compound.",
    afterChips: ["⚙ Agents across the lifecycle", "✓ Survives the next hire wave"],
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do you measure whether the work actually compounded?",
    answer:
      "We define two or three operating metrics with you at the start of an engagement: usually a mix of throughput (hours reclaimed, cycle time on a named workflow) and durability (number of internal champions still extending the system 60 and 120 days after we leave). We come back at the 90-day mark to read those numbers with you, on the record. If they didn't move, we say so.",
  },
  {
    question: "What does 'lasting change' look like in practice?",
    answer:
      "Concretely: a People Ops team handling 70% of inbound queries through systems they own and modify themselves; a finance close that runs without the consultant who designed it; a hiring loop that survives the departure of the head of talent. The test is whether the work keeps running, and keeps improving, without us in the room.",
  },
  {
    question: "How are case studies selected, and what gets anonymised?",
    answer:
      "We only publish case studies the client has reviewed and approved line by line. Where the work touches sensitive sectors (defence, regulated finance, early-stage climate) we anonymise the company name and any identifying detail of the engagement. The patterns and numbers are real; the brand is held back when the client prefers it that way.",
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
      "Yes. After a first conversation, if the fit looks right, we'll introduce you to one or two operators we've worked with (typically a Chief People Officer or COO) who can speak directly to how the engagement ran and what was left behind. We ask permission before each introduction; we never broker a reference cold.",
  },
];

const Work = () => (
  <>
    <PageMeta
      title="Work · Before and after | Deepgrain"
      description="Real engagements at click level. Before-and-after on Finance, People Ops, and operating lifecycles across defence, financial data, transit and climate."
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

    {/* Hero: deck shape */}
    <section className="relative bg-green text-cream pt-40 pb-24 md:pb-32 overflow-hidden">
      <TopoBackdrop variant="ridge" opacity={0.22} />
      <div className="relative container-grain max-w-5xl">
        <ScrollReveal>
          <SectionEyebrow className="mb-6" />
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02] text-balance max-w-4xl">
            Read first. Then the numbers move.
          </h1>
          <p className="mt-8 max-w-2xl text-cream/80 text-lg leading-relaxed">
            Not many. The ones who read the work at click level before they bought a tool.
            Every engagement built to keep compounding long after we've gone.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Hero before/after: the strongest case, deck slide 10 styled */}
    <BeforeAfterCard item={heroBeforeAfter} />

    {/* Sector strip */}
    <LogoCarousel background="walnut" showHeadline={false} />

    {/* Before/after gallery: every case told in the same shape */}
    <section className="bg-cream text-walnut py-20 md:py-28">
      <div className="container-grain max-w-5xl">
        <ScrollReveal>
          <SectionEyebrow tone="linen" className="mb-6" />
          <h2 className="font-display text-walnut text-3xl md:text-5xl leading-[1.05] max-w-3xl">
            Same shape. Different grain.
          </h2>
          <p className="mt-6 max-w-2xl text-walnut/75 leading-relaxed">
            Every engagement starts with a real workflow and ends with a number the client owns.
            Here are three more, in the same before-and-after shape.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {beforeAfterGallery.map((item) => (
      <BeforeAfterCard key={item.eyebrow} item={item} />
    ))}

    {/* Long-form case studies retained for clients who want the full narrative */}
    <section className="bg-walnut text-cream py-20">
      <div className="container-grain max-w-3xl text-center">
        <SectionEyebrow className="mb-4 justify-center">In the client's words</SectionEyebrow>
        <p className="font-display text-cream/85 text-2xl md:text-3xl italic leading-snug">
          Below: the testimonials, the shape of each engagement, what the team still has now
          we've gone. Not our words. Theirs.
        </p>
      </div>
    </section>

    {caseStudies.map((study, i) => (
      <CaseStudyCard key={study.id} study={study} variant={variants[i]} />
    ))}

    {/* Proof sits next to the offer: every case above started as a Grain Audit. */}
    <BarkSection className="section-pad" contentClassName="container-grain max-w-3xl">
      <ScrollReveal>
        <Eyebrow withRule className="text-brass mb-6">The next move</Eyebrow>
        <h2 className="font-display text-cream text-3xl md:text-5xl leading-[1.08] max-w-2xl">
          Every case above started the same way.
        </h2>
        <p className="mt-6 max-w-xl text-cream/75 leading-relaxed">
          The Grain Audit maps one People Ops process end to end, ranks the highest-return
          automations, and hands you a 90-day plan you keep whether or not we work together. Two
          weeks. GBP 2,000, credited in full against a programme. Three slots a month.
        </p>
        <Link
          to="/grain-audit"
          onClick={() =>
            track("cta_click", {
              cta_id: "audit_work_proof",
              cta_location: "work_proof",
              cta_label: "Book a Grain Audit",
              link_url: "/grain-audit",
            })
          }
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 font-sans text-sm tracking-wider text-green transition-all duration-300 hover:bg-cream/90"
        >
          Book a Grain Audit
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </Link>
      </ScrollReveal>
    </BarkSection>

    <FAQ eyebrow="Outcomes & proof" heading="What you can expect to take away." items={FAQ_ITEMS} />

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
          <div className="mt-12">
            <AuditPrompt
              tone="linen"
              ctaId="audit_work_mid"
              ctaLocation="work_mid"
              headline="Want this kind of before and after on your own function?"
              sub="Thirty minutes. One workflow. We map it together."
              prefill="I saw the case studies. The function I'd like to map a before and after for is:"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>

    <Invitation
      ctaLocation="work"
      headline="Want this kind of before and after on your own function?"
      sub="Thirty minutes. One workflow. We map it together."
      prefill="I saw the case studies. The function I'd like to map a before and after for is:"
    />
  </>
);

export default Work;
