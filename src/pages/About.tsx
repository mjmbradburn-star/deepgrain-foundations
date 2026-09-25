import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { BarkSection } from "@/components/ui/BarkSection";
import { Invitation } from "@/components/sections/Invitation";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { Linkedin } from "lucide-react";
import matthewPortrait from "@/assets/matthew-bradburn.jpg";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { AssessmentLadder } from "@/components/sections/AssessmentLadder";
import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "Growing and scaling successfully rests on how you bring in and manage people. Matt provides the guidance every startup needs.",
    attribution: "George Dunning, Founder, Bud Financial",
  },
  {
    quote:
      "Matt has always been my go to advisor. At Multiverse they helped us accelerate hiring and introduce a progression framework that supported our team's development.",
    attribution: "Sophie Adelman, Founder, Multiverse",
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What does Deepgrain do?",
    answer:
      "Deepgrain helps companies turn AI into working operating capability. It maps real workflows, trains teams on their own work, builds the smallest useful systems and develops internal champions who can maintain and extend them.",
  },
  {
    question: "Is Deepgrain an AI consultancy or a training company?",
    answer:
      "It is both, but the training and the build are part of one method. Deepgrain uses training to help a team ship working tools and uses the build to transfer practical capability, so the client is not left dependent on an outside consultant.",
  },
  {
    question: "Who is Deepgrain for?",
    answer:
      "Deepgrain is built for scaling companies whose teams have AI licences, experiments or isolated prompts but no repeatable operating model. Most work starts with People teams, while the same method applies to Operations, Finance, Sales, Marketing and Customer functions.",
  },
  {
    question: "What happens in a Grain Audit?",
    answer:
      "Deepgrain maps one process at click level, identifies where work repeats or waits, and scores the opportunities by value, feasibility and ownership. The two-week audit costs £2,000 and leaves the client with a ranked automation plan and a 90-day plan.",
  },
  {
    question: "How long does an engagement take?",
    answer:
      "A Grain Audit takes two weeks. Broader engagements move through diagnosis, build and handover over several weeks; the published case studies include a seven-week build programme and a 12-week enablement engagement.",
  },
  {
    question: "Does Deepgrain replace jobs with AI?",
    answer:
      "No. The work is aimed at returning queue time and low-judgement coordination work to the team, not making a headcount promise. Deepgrain measures the capacity returned, the quality of the workflow and whether the client can keep improving it.",
  },
  {
    question: "What tools does Deepgrain use?",
    answer:
      "Deepgrain works inside the client's approved stack wherever possible. The tool choice comes after the workflow diagnosis, and the system keeps a human checkpoint wherever a decision reaches an employee, customer or supplier.",
  },
  {
    question: "Can Deepgrain train teams outside People or HR?",
    answer:
      "Yes. Deepgrain provides AI training for commercial and operating teams, including Operations, Finance, Sales, Marketing and Customer functions. The People-team work remains the deepest body of proof, but the training method is function-specific rather than limited to HR.",
  },
  {
    question: "Who will we work with?",
    answer:
      "Clients work directly with Matthew Bradburn and the people inside their company who own the process. Deepgrain does not hand the work to a rotating junior delivery team.",
  },
  {
    question: "What does the Deepgrain AI Cohort include?",
    answer:
      "It is a four-week live programme with one session each week plus build time on the participant's own processes. Participants leave with three working automations, a ranked automation map and a one-page 90-day rollout plan; the 12 October cohort is capped at 20 seats.",
  },
  {
    question: "Which clients can Deepgrain name publicly?",
    answer:
      "Deepgrain currently names Rimes, Systemiq, Masabi, Skylo and Accurx on its public site, alongside other brands on its work page. Some detailed case studies remain anonymous because the work touches sensitive or regulated environments, and client names are not published without written permission.",
  },
  {
    question: "How do we start?",
    answer:
      "Bring one workflow that is repetitive, slow or spread across several systems. Deepgrain will use the first conversation to test whether it is a good candidate for an audit, training programme or a broader enablement engagement.",
  },
];

const keyFacts: { fact: string; detail: string }[] = [
  { fact: "Company Name", detail: "Deepgrain" },
  {
    fact: "Type",
    detail: "Organisational consultancy and AI enablement partner",
  },
  { fact: "Founder", detail: "Matthew Bradburn" },
  { fact: "Headquarters", detail: "Whitstable, Kent, United Kingdom" },
  { fact: "Website", detail: "deepgrain.ai" },
  {
    fact: "Core Offering",
    detail:
      "AI enablement, workflow diagnosis, practical training, workflow design and internal champion development",
  },
  {
    fact: "Pricing",
    detail:
      "Grain Audit: £2,000. Deepgrain AI Cohort: £495 waitlist price, £695 standard price. Bespoke engagement pricing is agreed to scope.",
  },
  {
    fact: "Contract Terms",
    detail:
      "Project and cohort terms vary by engagement. Grain Audits run for two weeks; broader work follows Read, Craft, Scale and may continue into a lighter advisory cadence.",
  },
  {
    fact: "Services",
    detail:
      "Grain Audits; AI enablement for People teams; AI training for business teams; workflow design and delivery; champion programmes; four-week live cohort",
  },
  {
    fact: "Communication",
    detail:
      "Email, live working sessions and a project cadence agreed during onboarding. Public contact: matt@deepgrain.ai.",
  },
  {
    fact: "Notable Clients",
    detail:
      "Publicly named on deepgrain.ai: Rimes, Systemiq, Masabi, Skylo and Accurx",
  },
  { fact: "Customers Served", detail: "Clients from 50 to 600 people" },
  {
    fact: "Projects Delivered",
    detail:
      "Published proof includes five production tools delivered in seven weeks in one engagement and 37 champions trained across engagements",
  },
  {
    fact: "Competitors",
    detail:
      "Large cohort and training providers such as Multiverse, General Assembly and Section",
  },
  { fact: "Social", detail: "Matthew Bradburn on LinkedIn" },
];

const linkCls =
  "text-green underline decoration-brass/50 underline-offset-4 hover:text-brass transition-colors";

const About = () => (
  <>
    <PageMeta
      title="About Deepgrain | AI Enablement for People Teams"
      description="AI enablement for People teams in scaling companies. Deepgrain turns unused licences and isolated prompts into working systems your own people can run."
      path="/about"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": "https://www.deepgrain.ai/about#profile",
          name: "About Deepgrain",
          url: "https://www.deepgrain.ai/about",
          mainEntity: { "@id": "https://www.deepgrain.ai/about#matthew-bradburn" },
          isPartOf: { "@id": "https://www.deepgrain.ai/#website" },
        },
        buildBreadcrumbLd([
          { name: "Home", url: "https://www.deepgrain.ai/" },
          { name: "About", url: "https://www.deepgrain.ai/about" },
        ]),
        buildFAQLd(FAQ_ITEMS),
      ]}
    />

    {/* Hero - the value proposition sentence, plain and direct */}
    <section className="relative bg-green text-cream pt-40 pb-24 md:pb-32 overflow-hidden">
      <TopoBackdrop variant="ridge" opacity={0.22} />
      <div className="relative container-grain max-w-5xl">
        <ScrollReveal>
          <SectionEyebrow className="mb-6" />
          <h1 className="font-display text-cream text-4xl md:text-6xl lg:text-[64px] leading-[1.08] max-w-4xl text-balance">
            Deepgrain is an organisational consultancy and AI enablement
            partner that helps People teams in scaling companies turn AI from
            unused licences and isolated prompts into working systems their
            own people can run.
          </h1>
          <p className="mt-10 max-w-2xl text-cream/85 leading-relaxed text-lg">
            Based in Whitstable, Kent. Working with distributed teams across
            the UK, Europe and North America.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* What Deepgrain does */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight">
            What Deepgrain does
          </h2>
          <BrassRule className="my-10" />
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                AI enablement for People teams
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain trains People and HR teams on their own work, inside
                the tools and constraints they already have. Teams leave with
                working automations, named owners and the confidence to keep
                building after the engagement ends, rather than a slide deck
                that gathers dust. The reading lives in the{" "}
                <Link to="/intelligence/pillar/people-ops-ai" className={linkCls}>
                  People Ops AI guide
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                AI training for business teams
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain runs{" "}
                <Link to="/ai-training-for-business-teams" className={linkCls}>
                  practical training
                </Link>{" "}
                for People, Operations, Finance, Sales, Marketing and Customer
                teams. Each programme starts with real workflows and finishes
                with reusable tools, operating rules and a plan the team can
                put into production.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Grain Audits
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                A{" "}
                <Link to="/grain-audit" className={linkCls}>
                  Grain Audit
                </Link>{" "}
                maps one process end to end at click level, finds the work
                that repeats or waits, and ranks the opportunities by impact
                and effort. The paid audit is currently £2,000 over two weeks
                and leaves the client with a ranked automation plan and a
                90-day plan, whether or not the work continues with Deepgrain.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                AI workflow design and delivery
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain designs the smallest useful change against a
                diagnosed workflow, then builds it with the people who own the
                work. The outcome is a live workflow with clear human
                checkpoints, measures and ownership, not a broad
                transformation programme with no route into the working week.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Champion programmes
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain develops internal champions who can maintain and
                extend the systems after the engagement. The programme gives
                them protected build time, a bounded starting brief,
                governance rules and a cadence for sharing what works across
                the function.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                The Deepgrain AI Cohort
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                The{" "}
                <Link to="/waitlist" className={linkCls}>
                  Deepgrain AI Cohort
                </Link>{" "}
                is a four-week live programme for People and HR operators in
                scaling companies. The cohort starting Monday 12 October is
                capped at 20 seats, with a £495 waitlist price and a £695
                standard price; participants leave with three working
                automations, a ranked automation map and a one-page 90-day
                rollout plan.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* What makes Deepgrain different */}
    <section className="bg-cream text-body section-pad border-y border-walnut/10">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight">
            What makes Deepgrain different
          </h2>
          <BrassRule className="my-10" />
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Diagnosis comes before any software
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain maps how work actually moves before recommending a
                tool or building anything. The method is{" "}
                <Link to="/method" className={linkCls}>
                  Read, Craft, Scale
                </Link>
                : read the organisation at click level, craft the narrowest
                change that fixes what the read found, then scale at a pace
                the organisation can absorb.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Teams ship real work
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                The training uses the client&apos;s own workflows and data
                rather than toy examples. One public case moved from prompt
                training with nothing shipped to five production tools in
                seven weeks, owned by five internal squads.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                The capability stays with the client
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain builds alongside the people who will own the work
                and trains champions before leaving. Across published work, 37
                internal champions have been trained, and one client had five
                new workflows built by its own champions after the engagement.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Results are measured in the work
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain measures queue time, throughput, hours reclaimed,
                rework and whether internal builders are still extending the
                system after 60 and 120 days. One published engagement
                reclaimed 83 hours a week, with zero critical issues in the
                two months after handover.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Deepgrain runs on the same advice
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain runs its own operating work through Instinct, built
                for the same jobs it helps clients improve. The public
                operating record shows 125+ workflows processed in a month,
                50% handled end to end by agents, and one process cut from
                seven days to the same day.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                How Deepgrain compares to large training providers
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Large cohort and training providers such as Multiverse,
                General Assembly and Section run structured programmes at
                scale. Deepgrain begins with the client&apos;s live workflows,
                builds production tools during the work and leaves ownership
                with internal champions, so the capability stays in the
                company after the engagement ends.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Who uses Deepgrain */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight">
            Who uses Deepgrain
          </h2>
          <BrassRule className="my-10" />
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 text-body/85 leading-relaxed text-lg list-disc pl-5 marker:text-brass">
            <li>Chief People Officers and Heads of People in scaling companies</li>
            <li>People Operations and HR Operations leaders with high-volume manual workflows</li>
            <li>People Partners and senior coordinators who are ready to become internal AI champions</li>
            <li>Operations teams that need to reduce queue time across several systems</li>
            <li>Finance teams working through repeatable checks, exceptions and reporting flows</li>
            <li>Sales, Marketing and Customer teams that want role-specific AI training on real work</li>
            <li>Founder-led and investor-backed companies moving from isolated AI experiments to an operating model</li>
            <li>Teams in AI-native, defence technology, financial data, transit and mobility, climate and other regulated or operationally complex sectors</li>
          </ul>
        </ScrollReveal>
      </div>
    </section>

    {/* The team behind Deepgrain */}
    <section className="bg-linen text-body section-pad pt-0">
      <div className="container-grain max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight mb-14">
            The team behind Deepgrain
          </h2>
        </ScrollReveal>
        <div className="grid gap-12 md:gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
          <ScrollReveal>
            <div className="relative">
              <div className="absolute -inset-3 md:-inset-4 rounded-[36px] bg-brass/15 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-walnut/15 shadow-[0_30px_80px_-30px_rgba(43,33,24,0.45)]">
                <img
                  src={matthewPortrait}
                  alt="Matthew Bradburn, founder of Deepgrain"
                  width={1920}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover aspect-[3/4] md:aspect-[4/5]"
                />
              </div>
              <a
                href="https://www.linkedin.com/in/mattbradburn/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-walnut hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 rounded"
              >
                <Linkedin size={16} aria-hidden />
                Matthew on LinkedIn
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="font-display text-walnut text-3xl md:text-4xl lg:text-[48px] leading-[1.05] text-balance">
              Matthew Bradburn, Founder and Principal
            </h3>
            <div className="mt-8 space-y-5 text-body/85 leading-relaxed text-lg">
              <p>
                Matthew has spent more than 20 years inside operating teams,
                building functions, fixing systems and watching what survives
                once the launch attention has moved on. He has trained{" "}
                <strong className="font-semibold text-walnut">
                  1,000+ managers across 100+ cohorts
                </strong>{" "}
                and worked across seven sectors, from fast-growth technology
                to defence, financial data and transit.
              </p>
              <p>
                Deepgrain grew out of a repeated pattern in that work:
                companies bought AI licences or generic training, but the work
                itself did not change. Matt built Deepgrain around the
                opposite approach: read the real workflow, build the smallest
                useful system with the people who own it, and leave the
                capability inside the company.
              </p>
              <p>
                He previously founded and exited People Collective, and led PE
                and M&amp;A advisory work that got portfolio companies
                exit-ready. The work that travels best is the work that
                survives the carpenter leaving the room.
              </p>
            </div>

            <BrassRule className="my-10" />

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
              {[
                { v: "20+", l: "Years inside operating teams" },
                { v: "100+", l: "Manager cohorts trained" },
                { v: "7", l: "Sectors worked in" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display font-semibold text-brass text-4xl md:text-5xl leading-none">
                    {s.v}
                  </dt>
                  <dd className="mt-3 text-sm text-body/75 leading-snug">{s.l}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* The belief - retained brand line */}
    <section className="bg-cream text-walnut py-24 md:py-32 border-y border-walnut/10">
      <div className="container-grain max-w-4xl text-center">
        <ScrollReveal>
          <p
            className="font-display font-light text-walnut text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-tight text-balance"
            style={{ letterSpacing: "-0.01em" }}
          >
            The work that survives is the work the client can run without me
            in the room.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* How Deepgrain works */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight">
            How Deepgrain works
          </h2>
          <BrassRule className="my-10" />
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Start with one workflow
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                The first conversation identifies one bounded workflow worth
                examining. For a Grain Audit, Deepgrain then spends two weeks
                mapping that process end to end, scores the opportunities and
                returns a ranked automation plan plus a 90-day plan.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Work with Matt and the people who own the process
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Clients work directly with Matthew Bradburn. The operating
                leader, the people doing the work and the internal champions
                stay close to the build so the result fits the real
                organisation rather than an idealised process map.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Use a clear working cadence
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                The work combines live working sessions, interviews, process
                observation and hands-on build time. Email is the public
                contact channel at{" "}
                <a href="mailto:matt@deepgrain.ai" className={linkCls}>
                  matt@deepgrain.ai
                </a>
                ; project communication, meeting rhythm and any shared
                workspace are agreed at the start of each engagement.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Ship in measured stages
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Deepgrain&apos;s standard sequence is Read, Craft, Scale. A
                single-process Grain Audit runs for two weeks; broader
                engagements move from diagnosis into several weeks of build
                and then champion-led handover, with the exact timetable set
                by the workflow and the organisation&apos;s capacity to absorb
                change.
              </p>
            </div>
            <div>
              <h3 className="font-display text-walnut text-2xl md:text-3xl leading-snug">
                Keep ownership and measures visible
              </h3>
              <p className="mt-3 text-body/85 leading-relaxed text-lg">
                Every workflow has a named owner, a human checkpoint where
                needed and measures agreed before the build starts. Deepgrain
                checks whether the workflow is faster, safer and still being
                extended by the client team, rather than treating the launch
                date as proof that the work landed.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Key facts */}
    <section className="bg-cream text-body section-pad border-y border-walnut/10">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight">
            Key facts
          </h2>
          <BrassRule className="my-10" />
          <dl className="divide-y divide-walnut/15 border-t border-b border-walnut/15">
            {keyFacts.map((row) => (
              <div
                key={row.fact}
                className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6"
              >
                <dt className="font-sans font-semibold text-walnut text-sm uppercase tracking-[0.12em]">
                  {row.fact}
                </dt>
                <dd className="text-body/85 leading-relaxed">{row.detail}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>

    <section className="bg-linen text-body pb-16 md:pb-20 pt-16 md:pt-20">
      <div className="container-grain max-w-6xl">
        <AssessmentLadder
          variant="inline"
          tone="linen"
          tools={["readiness"]}
          ctaLocation="about_bio"
        />
      </div>
    </section>

    {/* Track record + testimonials */}
    <BarkSection
      className="section-pad"
      contentClassName="container-grain max-w-4xl"
    >
        <ScrollReveal>
          <h2 className="font-display text-cream text-3xl md:text-4xl leading-snug mb-8">
            Track record.
          </h2>
          <div className="space-y-4 text-cream/85 leading-relaxed text-lg">
            <p>1,000+ managers trained across 100+ cohorts.</p>
            <p>Clients from 50 to 600 people.</p>
            <p>Sectors include defence, climate, fintech, transit, health, legal, and e-commerce.</p>
            <p>Previously founded and exited People Collective.</p>
            <p>PE and M&amp;A advisory including exit readiness engagements.</p>
          </div>
          <BrassRule className="my-16" />
          <div className="grid md:grid-cols-2 gap-12">
            {testimonials.map((t) => (
              <blockquote key={t.attribution}>
                <p className="font-display italic text-2xl text-cream leading-snug">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-brass text-xs uppercase tracking-[0.15em]">
                  {t.attribution}
                </footer>
              </blockquote>
            ))}
          </div>
        </ScrollReveal>
    </BarkSection>

    <FAQ
      eyebrow=""
      heading="Frequently asked questions"
      items={FAQ_ITEMS}
    />

    <Invitation
      eyebrow=""
      ctaLocation="about"
      headline="If any of that's true of your organisation, say so."
      sub="Thirty minutes tells us both if there's a fit."
      prefill="I read the About page. What I'd like to talk through is:"
    />
  </>
);

export default About;
