import { useState } from "react";
import { Brain, FolderKanban, Workflow, Bot, BarChart3, ChevronDown } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { EmailCapture } from "@/components/forms/EmailCapture";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { cn } from "@/lib/utils";

/** Single source for the offer. Change the cohort here, not in five places. */
const COURSE = {
  start: "Monday 12 October",
  weeks: "Five",
  seats: "Twenty",
  foundingPrice: "£495",
  standardPrice: "£695",
  foundingCheckout: "https://buy.stripe.com/9B66oJfwYdv2bwV1TXbAs00",
  standardCheckout: "https://buy.stripe.com/9B65kFgB29eM30p8ilbAs01",
} as const;

const COURSE_LD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "The Deepgrain AI Cohort for People Teams",
  description:
    "Five weeks, live, for People and HR operators in scaling companies. Brief AI like a colleague, build skills files and a properly set-up workspace, chain them into workflows on your own processes, set trusted work running with guardrails, and leave with a one-page 90-day plan. Successor to AI Powered People Ops, taught by Matt Bradburn.",
  provider: { "@id": "https://www.deepgrain.ai/#organization" },
  offers: [
    {
      "@type": "Offer",
      price: "495",
      priceCurrency: "GBP",
      category: "Founding cohort",
      availability: "https://schema.org/PreOrder",
    },
    {
      "@type": "Offer",
      price: "695",
      priceCurrency: "GBP",
      category: "Standard",
      availability: "https://schema.org/PreOrder",
    },
  ],
};

const PAINS = [
  {
    quote: "We bought the licences. Nobody uses them.",
    body: "Seats rolled out to the whole function, a launch email, a training video. Three months later the only thing that changed is the invoice. Capability without context does not survive a busy week.",
  },
  {
    quote: "The pilot worked. The rollout didn't.",
    body: "One keen person built something clever in a sandbox. It never touched a real process, it had no owner, and it died the week they went on leave.",
  },
  {
    quote: "Everyone is dabbling. Nobody is building.",
    body: "Your team uses AI in private, unevenly, with no shared standard and no governance. The gap between your best prompter and everyone else widens every month, and nothing compounds.",
  },
];

const WEEKS = [
  {
    numeral: "1.0 THINK",
    title: "Think with the machine",
    body: "Stop briefing a colleague like a search box. The reframe that decides everything after it, the four habits that separate leverage from slop, and your first two skills files: one for your role, one for a job you repeat.",
    leave: "Two skills files, written by you and used on real work.",
    detail: [
      "The colleague-not-search-box reframe, and why weak output is usually a thin brief",
      "The four habits that decide what you get back: context, curiosity, critical thinking, commerciality",
      "What a skills file is, and why it beats clever prompting every week after this one",
      "Find the jobs in your week that drain you, and pick the first one worth handing over",
    ],
  },
  {
    numeral: "2.0 SET UP",
    title: "Work with files",
    body: "A one-off chat is a colleague with amnesia. Set up a project workspace that holds your instructions, your reference files and your skills, so the briefing stops evaporating between sessions.",
    leave: "One project workspace set up properly, on your own work.",
    detail: [
      "Projects: standing instructions, reference files and skills in one persistent place",
      "Small, single-purpose skills beat one giant one, for reliability and for cost",
      "The three surfaces (projects, desktop coworking, the terminal) and when each earns its place",
      "Bringing in a skill someone else wrote without getting burned",
    ],
  },
  {
    numeral: "3.0 CHAIN",
    title: "Chain the work",
    body: "Map one weekly job click by click, tag every step as machine or judgement, then build the chain: the machine does the middle, you hold the edges and the gates. Run it by hand until it stops surprising you.",
    leave: "A workflow that finishes a task, not a helpful draft.",
    detail: [
      "Map the job honestly before you build anything; the map is the design",
      "Human, machine, human: the pattern that keeps judgement where it belongs",
      "Which steps never get handed over, and why",
      "Run it three times on real work, tightening the weakest step each time",
    ],
  },
  {
    numeral: "4.0 SET RUNNING",
    title: "Take yourself out of the loop",
    body: "In the loop, on the loop, out of the loop. Set a workflow you trust running on a schedule, then see what triggers and agents add for the people ready to go further. Everything you set running gets the five guardrails.",
    leave: "One piece of work running without you starting it, gated and logged.",
    detail: [
      "The trust ladder: you earn each rung, you never jump one",
      "Schedules first; triggers, plugins and agents when the evidence says you are ready",
      "The five guardrails on everything: scope, gate, log, stop, off switch",
      "The firm list of things you never hand over",
    ],
  },
  {
    numeral: "5.0 SHOW",
    title: "Show your work",
    body: "Old way, new way, time recovered, in three minutes. Write your one-page 90-day plan: keep doing, start doing, ask someone to build. The builders step forward.",
    leave: "A number leadership can act on, and a plan for the next quarter.",
    detail: [
      "The three-minute showcase: old way, new way, time recovered",
      "Your 90-day plan on one page, specific and dated",
      "The builder pathway for the people who catch fire",
      "What keeps this alive after the sessions end",
    ],
  },
];

const LEAVE_WITH = [
  {
    icon: Brain,
    title: "Skills files for your role and your recurring work",
    body: "Your standards, written down once and applied every time. The unit everything else is built from.",
  },
  {
    icon: FolderKanban,
    title: "A project workspace set up properly",
    body: "Instructions, reference files and skills in one persistent place. No more re-briefing a blank chat.",
  },
  {
    icon: Workflow,
    title: "A chained workflow on a real job",
    body: "Mapped, built and run by hand until it holds. Machine in the middle, your judgement at the edges.",
  },
  {
    icon: Bot,
    title: "One piece of work running with guardrails",
    body: "Scheduled, gated, logged, with a stop condition and an off switch. Yours, not ours.",
  },
  {
    icon: BarChart3,
    title: "A 90-day plan and your time-recovered number",
    body: "Keep doing, start doing, ask someone to build. One page, ready for leadership.",
  },
];

const CASE_RESULTS = [
  {
    label: "Hours a week lost to rekeying, chasing and answering, before",
    value: 83,
    suffix: " hrs",
    max: 100,
  },
  {
    label: "People Ops queries handled by systems the team owns, after",
    value: 70,
    suffix: "%",
    max: 100,
  },
  {
    label: "Finance admin time handed back, after",
    value: 60,
    suffix: "%",
    max: 100,
  },
];

const faqItems: FAQItem[] = [
  {
    question: "Who is the cohort for?",
    answer:
      "People and HR operators in scaling companies: Heads of People, People Ops leads, HRBPs, and People team generalists who own processes and want to rebuild them with AI. No technical background needed. If you can describe a process, you can build on it.",
  },
  {
    question: "How much time does it take each week?",
    answer:
      "One live session a week plus build time on your own processes, roughly three to four hours in total. The build time is the course: everything you make runs on real work, so the hours come back.",
  },
  {
    question: "What tools do we use?",
    answer:
      "The current generation of AI tools for operators: skills files, project workspaces, connectors and plugins, agents, and small tools you build yourself. If your company has approved tools, we build inside them.",
  },
  {
    question: "What if I miss a session?",
    answer:
      "Every session is recorded and you keep the materials. The build work carries across weeks, so you can catch up without losing the thread.",
  },
  {
    question: "What is the difference between founding and standard seats?",
    answer:
      "The same five weeks in the same room. Founding seats are £495 for the cohort starting Monday 12 October. Standard seats are £695.",
  },
  {
    question: "When does it start, and how many seats are there?",
    answer:
      "Monday 12 October, live, five weeks. Twenty seats, because the build work is reviewed by hand.",
  },
];

const PROOF = ["Rimes", "Systemiq", "Masabi", "Skylo"];

const CheckoutButton = ({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant: "filled" | "outline";
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "inline-flex items-center justify-center rounded-full font-sans font-medium tracking-wider text-sm px-10 py-4 transition-colors",
      variant === "filled"
        ? "bg-cream text-green hover:bg-cream/90"
        : "border border-brass text-brass hover:bg-brass hover:text-walnut",
    )}
  >
    {children}
  </a>
);

const Waitlist = () => {
  const [openWeek, setOpenWeek] = useState<number>(0);

  return (
    <>
      <PageMeta
        title="Deepgrain AI Cohort for People Teams"
        description="Five weeks, live, for People and HR operators. Build skills, projects, workflows and agents on your own processes. Founding cohort 12 October, from £495."
        path="/waitlist"
        jsonLd={[COURSE_LD, buildFAQLd(faqItems), buildBreadcrumbLd([{ name: "Home", url: "https://www.deepgrain.ai/" }, { name: "AI cohort", url: "https://www.deepgrain.ai/waitlist" }])]}
      />

      {/* ------------------------------------------------ hero ----------- */}
      <section className="relative bg-green text-cream overflow-hidden" data-no-rule>
        <div className="relative container-grain pt-24 pb-16 md:pt-36 md:pb-24">
          <div className="fade-in-up">
            <SectionEyebrow className="mb-10">
              The Deepgrain AI Cohort for People Teams
            </SectionEyebrow>
            <h1
              className="font-display font-semibold max-w-4xl"
              style={{
                fontSize: "clamp(34px, 5vw, 64px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Everyone told your People team to use AI. Nobody showed them how.
            </h1>
          </div>
          <div className="fade-in-up fade-in-up-2 mt-10 max-w-2xl">
            <p className="text-cream/85 text-lg md:text-xl leading-relaxed">
              Five weeks, live, for People and HR operators in scaling companies. Successor to AI
              Powered People Ops, rebuilt for this year's tools: skills files, project workspaces,
              workflows and agents. Taught by Matt Bradburn, built on your own work.
            </p>
            <p
              className="mt-6 font-sans font-semibold uppercase text-brass"
              style={{ fontSize: "11px", letterSpacing: "0.22em" }}
            >
              Founding cohort starts {COURSE.start} · {COURSE.seats} seats · {COURSE.foundingPrice} founding (standard {COURSE.standardPrice})
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CheckoutButton href={COURSE.foundingCheckout} variant="filled">
                Book a founding seat · {COURSE.foundingPrice} →
              </CheckoutButton>
              <a
                href="#weeks"
                className="inline-flex items-center justify-center rounded-full font-sans font-medium tracking-wider text-sm px-10 py-4 border border-cream/30 text-cream/80 hover:border-cream/60 hover:text-cream transition-colors"
              >
                See the five weeks ↓
              </a>
            </div>
          </div>
        </div>
        <GrainFlow className="absolute inset-x-0 -bottom-4 h-36" tone="walnut" opacity={0.12} />
      </section>

      {/* ------------------------------------------------ pain ----------- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain py-20 md:py-28">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            Sound familiar?
          </h2>
          <div className="mt-14 grid gap-px md:grid-cols-3 bg-walnut/15">
            {PAINS.map((p) => (
              <div key={p.quote} className="bg-linen px-2 py-8 md:px-8 md:py-10">
                <p className="font-display font-semibold text-walnut text-2xl md:text-[28px] leading-snug">
                  &ldquo;{p.quote}&rdquo;
                </p>
                <p className="text-body/80 text-[16px] leading-relaxed mt-4">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-body/80 text-lg leading-relaxed">
            None of these are tool problems. They are capability problems, and capability is
            teachable. That is what the five weeks are for.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ weeks ---------- */}
      <section id="weeks" className="bg-linen text-walnut scroll-mt-28" data-no-rule>
        <div className="container-grain pb-24 md:pb-36">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            Five weeks. One story.
          </h2>
          <p className="text-body/80 text-lg leading-relaxed max-w-2xl mt-6">
            One live session a week, then build time on your own processes. Week one changes how
            you think. Week two changes how your tools are set up. Week three changes the shape of
            what comes out. Week four changes where AI sits in your working day. Week five makes
            the change visible.
          </p>

          <div className="mt-14">
            {WEEKS.map((w, i) => {
              const open = openWeek === i;
              return (
                <div key={w.numeral} className="border-t-4 border-walnut">
                  <button
                    type="button"
                    onClick={() => setOpenWeek(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full text-left py-10 md:py-12 flex items-start justify-between gap-6 group"
                  >
                    <div className="max-w-3xl">
                      <h3 className="font-mono text-sm tracking-wider text-walnut/60 mb-4">
                        {w.numeral}
                      </h3>
                      <p className="font-display font-semibold text-walnut text-3xl md:text-4xl leading-tight group-hover:text-green transition-colors">
                        {w.title}
                      </p>
                      <p className="text-body/80 text-[17px] leading-relaxed mt-4">{w.body}</p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-2 shrink-0 text-walnut/50 transition-transform duration-300",
                        open && "rotate-180",
                      )}
                      size={22}
                      aria-hidden
                    />
                  </button>
                  {open && (
                    <div className="pb-10 md:pb-12 max-w-3xl">
                      <ul className="space-y-3">
                        {w.detail.map((d) => (
                          <li key={d} className="flex items-start gap-3 text-body/85 text-[16px] leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden />
                            {d}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-6 font-sans font-semibold uppercase text-green" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
                        You leave with: {w.leave}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ leave with ----- */}
      <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
        <BarkGrain />
        <div className="relative z-10 container-grain section-pad">
          <p
            className="font-sans font-semibold uppercase text-brass/80"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            What you leave with
          </p>
          <div className="mt-12 grid gap-px md:grid-cols-2 lg:grid-cols-3 bg-cream/15">
            {LEAVE_WITH.map((t) => (
              <div key={t.title} className="bg-bark px-2 py-8 md:px-10 md:py-12">
                <t.icon className="text-brass mb-5" size={26} strokeWidth={1.5} aria-hidden />
                <h3 className="font-display font-semibold text-cream text-2xl leading-tight">
                  {t.title}
                </h3>
                <p className="text-cream/75 text-[16px] leading-relaxed mt-3 max-w-md">{t.body}</p>
              </div>
            ))}
            <div className="bg-bark px-2 py-8 md:px-10 md:py-12 flex items-center">
              <p className="font-display italic text-cream/70 text-xl leading-snug">
                Not prototypes. Running, on your own processes, owned by you when we leave.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ proof ---------- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain py-20 md:py-28">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            What this looks like when it lands
          </h2>
          <p className="text-body/80 text-lg leading-relaxed max-w-2xl mt-6">
            From a twelve-week Deepgrain engagement with a defence-tech firm's Finance and People
            Ops teams. The same method the cohort teaches, run at company scale.
          </p>
          <div className="mt-14 max-w-3xl space-y-10">
            {CASE_RESULTS.map((r) => (
              <div key={r.label}>
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <p className="text-body/85 text-[16px] leading-snug max-w-xl">{r.label}</p>
                  <p className="font-display font-semibold text-green text-3xl md:text-4xl leading-none">
                    {r.value}{r.suffix}
                  </p>
                </div>
                <div className="mt-3 h-2 w-full bg-walnut/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green rounded-full"
                    style={{ width: `${(r.value / r.max) * 100}%` }}
                    role="img"
                    aria-label={`${r.label}: ${r.value}${r.suffix}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-body/60 text-sm leading-relaxed">
            Their processes, their numbers. Yours will be your own, which is the point of building
            on real work. The five people trained in that engagement have since shipped another
            five systems outside the original scope.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ pricing -------- */}
      <section className="relative bg-green text-cream overflow-hidden" data-no-rule>
        <GrainFlow className="absolute inset-x-0 -top-6 h-40 z-[2]" opacity={0.14} />
        <div className="relative z-10 container-grain section-pad">
          <p
            className="font-sans font-semibold uppercase text-brass"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            Book your seat
          </p>
          <div className="mt-12 grid gap-px md:grid-cols-2 bg-cream/15 max-w-4xl">
            <div className="bg-green px-2 py-10 md:px-10 md:py-14">
              <p className="font-sans uppercase text-brass/80" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
                Founding cohort
              </p>
              <p className="mt-4 font-display font-semibold text-brass leading-none" style={{ fontSize: "clamp(56px, 7vw, 88px)" }}>
                {COURSE.foundingPrice}
              </p>
              <p className="mt-5 text-cream/80 text-[16px] leading-relaxed max-w-sm">
                Starts {COURSE.start}, five weeks, live. {COURSE.seats} seats, because the build
                work is reviewed by hand.
              </p>
              <div className="mt-8">
                <CheckoutButton href={COURSE.foundingCheckout} variant="filled">
                  Book a founding seat →
                </CheckoutButton>
              </div>
            </div>
            <div className="bg-green px-2 py-10 md:px-10 md:py-14">
              <p className="font-sans uppercase text-cream/60" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
                Standard
              </p>
              <p className="mt-4 font-display font-semibold text-cream/85 leading-none" style={{ fontSize: "clamp(56px, 7vw, 88px)" }}>
                {COURSE.standardPrice}
              </p>
              <p className="mt-5 text-cream/70 text-[16px] leading-relaxed max-w-sm">
                The same five weeks in the same room, at the standard price. For seats after the
                founding cohort fills, and for later cohorts.
              </p>
              <div className="mt-8">
                <CheckoutButton href={COURSE.standardCheckout} variant="outline">
                  Book a standard seat →
                </CheckoutButton>
              </div>
            </div>
          </div>
          <div id="join" className="mt-16 max-w-2xl scroll-mt-28">
            <EmailCapture
              source="course-waitlist"
              variant="dark"
              heading="Not ready to book?"
              description="Join the waitlist. You hear first when the next cohort opens, and founding pricing reaches you before anyone else."
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ about ---------- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain py-20 md:py-28">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            Built and taught by Matt Bradburn
          </h2>
          <div className="mt-8 max-w-2xl">
            <p className="text-body/85 text-lg leading-relaxed">
              Matt was VP People at Peakon, built and sold People Collective and the DBR community,
              and now runs Deepgrain. The original course, AI Powered People Ops, was rated 4.3 out
              of 5 across 13 reviews. This cohort is its successor, rebuilt for this year's tools.
            </p>
            <p className="mt-6 text-body/80 text-lg leading-relaxed">
              The same operating work, run for:
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-14 gap-y-6">
            {PROOF.map((name) => (
              <span
                key={name}
                className="font-display font-semibold text-walnut/85"
                style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ faq ------------ */}
      <FAQ eyebrow="" heading="Questions, answered" items={faqItems} />

      {/* ------------------------------------------------ final ---------- */}
      <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
        <BarkGrain />
        <div className="relative z-10 container-grain section-pad">
          <div className="max-w-2xl">
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {COURSE.seats} seats. Five Mondays from 12 October.
            </h2>
            <p className="mt-6 text-cream/80 text-lg leading-relaxed">
              Founding seats are {COURSE.foundingPrice} for the October cohort. When they fill,
              standard seats are {COURSE.standardPrice}.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <CheckoutButton href={COURSE.foundingCheckout} variant="filled">
                Book a founding seat · {COURSE.foundingPrice} →
              </CheckoutButton>
              <CheckoutButton href={COURSE.standardCheckout} variant="outline">
                Standard · {COURSE.standardPrice} →
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Waitlist;
