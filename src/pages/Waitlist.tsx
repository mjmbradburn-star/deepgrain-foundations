import { useState } from "react";
import { Brain, FolderKanban, Workflow, Bot, BarChart3, ChevronDown } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { EmailCapture } from "@/components/forms/EmailCapture";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { Testimonials } from "@/components/sections/Testimonials";
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
    pattern: "Tool theatre",
    body: "Capability without context does not survive a busy week.",
  },
  {
    quote: "The pilot worked. The rollout didn't.",
    pattern: "The pilot trap",
    body: "Built for demo, never for production, with no owner.",
  },
  {
    quote: "Everyone is dabbling. Nobody is building.",
    pattern: "Private dabbling",
    body: "No shared standard, no governance, nothing compounds.",
  },
];

const WEEK_ICONS = [Brain, FolderKanban, Workflow, Bot, BarChart3];

const WEEKS = [
  {
    numeral: "1.0 THINK",
    rail: "Change how you think",
    title: "Think with the machine",
    body: "Stop briefing a colleague like a search box. The reframe that decides everything after it, plus your first two skills files.",
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
    rail: "Change your setup",
    title: "Work with files",
    body: "A one-off chat is a colleague with amnesia. Set up a project workspace that holds your instructions, files and skills.",
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
    rail: "Change what ships",
    title: "Chain the work",
    body: "Map one weekly job, tag every step machine or judgement, then build the chain: machine in the middle, you on the edges.",
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
    rail: "Change your week",
    title: "Take yourself out of the loop",
    body: "Set a workflow you trust running on a schedule, with the five guardrails on everything. Agents for the people ready to go further.",
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
    rail: "Make it visible",
    title: "Show your work",
    body: "Old way, new way, time recovered, in three minutes. Then your one-page 90-day plan.",
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
    title: "Skills files",
    body: "Your standards, written down once, applied every time.",
  },
  {
    icon: FolderKanban,
    title: "A project workspace",
    body: "Instructions, files and skills in one persistent place.",
  },
  {
    icon: Workflow,
    title: "A chained workflow",
    body: "Machine in the middle, your judgement at the edges.",
  },
  {
    icon: Bot,
    title: "Work running with guardrails",
    body: "Scheduled, gated, logged. Yours, not ours.",
  },
  {
    icon: BarChart3,
    title: "A 90-day plan",
    body: "One page, with your time-recovered number, ready for leadership.",
  },
];

const CASE_STATS = [
  {
    value: "83",
    suffix: "hrs",
    label: "lost every week to rekeying, chasing and answering, before",
  },
  {
    value: "70",
    suffix: "%",
    label: "of People Ops queries now handled by systems the team owns",
  },
  {
    value: "60",
    suffix: "%",
    label: "of Finance admin time handed back",
  },
];

const MATT_FACTS = ["VP People at Peakon", "Built and sold People Collective", "4.3/5 across 13 course reviews"];

const faqItems: FAQItem[] = [
  {
    question: "Who is the cohort for?",
    answer:
      "People and HR operators in scaling companies: Heads of People, People Ops leads, HRBPs, and People team generalists who own processes and want to rebuild them with AI. No technical background needed.",
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

const H2_STYLE = { fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" } as const;

const Waitlist = () => {
  const [openWeek, setOpenWeek] = useState<number>(0);

  const jumpToWeek = (i: number) => {
    setOpenWeek(i);
    document.getElementById(`week-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

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
              Five weeks, live. Skills files, project workspaces, workflows and agents, built on
              your own processes. Taught by Matt Bradburn.
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
          <h2 className="font-display font-semibold max-w-3xl" style={H2_STYLE}>
            Sound familiar?
          </h2>
          <div className="mt-14 grid gap-px md:grid-cols-3 bg-walnut/15">
            {PAINS.map((p) => (
              <div key={p.quote} className="bg-linen px-2 py-8 md:px-8 md:py-10">
                <p
                  className="font-sans font-semibold uppercase text-brass"
                  style={{ fontSize: "10px", letterSpacing: "0.22em" }}
                >
                  {p.pattern}
                </p>
                <p className="mt-4 font-display font-semibold text-walnut text-2xl md:text-[28px] leading-snug">
                  &ldquo;{p.quote}&rdquo;
                </p>
                <p className="text-body/70 text-[15px] leading-relaxed mt-3">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl font-display italic text-walnut/70 text-xl leading-snug">
            Capability problems, every one. Capability is teachable.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ weeks ---------- */}
      <section id="weeks" className="bg-linen text-walnut scroll-mt-28" data-no-rule>
        <div className="container-grain pb-24 md:pb-36">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2 className="font-display font-semibold max-w-3xl" style={H2_STYLE}>
            Five weeks. One story.
          </h2>
          <p className="text-body/80 text-lg leading-relaxed max-w-2xl mt-6">
            One live session a week. Everything else is build time on your own processes.
          </p>

          {/* the story as a rail: five stops, each jumps to its week */}
          <div className="mt-12 flex flex-col md:flex-row md:items-stretch border-y-2 border-walnut/70">
            {WEEKS.map((w, i) => {
              const Icon = WEEK_ICONS[i];
              const active = openWeek === i;
              return (
                <button
                  key={w.numeral}
                  type="button"
                  onClick={() => jumpToWeek(i)}
                  aria-label={`Week ${i + 1}: ${w.title}`}
                  className={cn(
                    "group flex md:flex-1 items-center md:items-start gap-4 md:gap-0 md:flex-col px-2 py-5 md:px-6 md:py-8 text-left border-t md:border-t-0 md:border-l first:border-t-0 md:first:border-l-0 border-walnut/15 transition-colors",
                    active ? "bg-walnut/[0.06]" : "hover:bg-walnut/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
                      active
                        ? "border-green bg-green text-cream"
                        : "border-walnut/30 text-walnut/70 group-hover:border-green group-hover:text-green",
                    )}
                  >
                    <Icon size={20} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="md:mt-5">
                    <span className="block font-mono text-[11px] tracking-wider text-walnut/55">
                      {w.numeral}
                    </span>
                    <span className="mt-1 block font-display font-semibold text-walnut text-lg leading-tight">
                      {w.rail}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-14">
            {WEEKS.map((w, i) => {
              const open = openWeek === i;
              const Icon = WEEK_ICONS[i];
              return (
                <div key={w.numeral} id={`week-${i}`} className="border-t-4 border-walnut scroll-mt-32">
                  <button
                    type="button"
                    onClick={() => setOpenWeek(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full text-left py-10 md:py-12 flex items-start justify-between gap-6 group"
                  >
                    <div className="max-w-3xl">
                      <h3 className="font-mono text-sm tracking-wider text-walnut/60 mb-4 flex items-center gap-3">
                        <Icon size={16} strokeWidth={1.5} className="text-brass" aria-hidden />
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
                <p className="text-cream/70 text-[15px] leading-relaxed mt-2 max-w-md">{t.body}</p>
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
          <h2 className="font-display font-semibold max-w-3xl" style={H2_STYLE}>
            What this looks like when it lands
          </h2>
          <p className="text-body/80 text-lg leading-relaxed max-w-2xl mt-6">
            Twelve weeks with a defence-tech firm's Finance and People Ops teams. The method the
            cohort teaches, run at company scale.
          </p>
          <div className="mt-14 grid gap-px md:grid-cols-3 bg-walnut/15 max-w-5xl">
            {CASE_STATS.map((s) => (
              <div key={s.label} className="bg-linen px-2 py-10 md:px-10 md:py-14">
                <p className="font-display font-semibold text-green leading-none" style={{ fontSize: "clamp(64px, 7vw, 104px)" }}>
                  {s.value}
                  <span className="text-brass" style={{ fontSize: "0.45em" }}>{s.suffix}</span>
                </p>
                <p className="mt-5 text-body/75 text-[15px] leading-relaxed max-w-xs">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-body/60 text-sm leading-relaxed">
            Their processes, their numbers. Yours will be your own, which is the point of building
            on real work.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------- testimonials --- */}
      <Testimonials />

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
                Starts {COURSE.start}. {COURSE.seats} seats; the build work is reviewed by hand.
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
                The same five weeks in the same room, at the standard price.
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
          <h2 className="font-display font-semibold max-w-3xl" style={H2_STYLE}>
            Built and taught by Matt Bradburn
          </h2>
          <div className="mt-10 inline-flex flex-wrap gap-px bg-walnut/15">
            {MATT_FACTS.map((f) => (
              <p
                key={f}
                className="bg-linen px-6 py-4 font-sans font-semibold uppercase text-walnut/80"
                style={{ fontSize: "11px", letterSpacing: "0.18em" }}
              >
                {f}
              </p>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-body/80 text-lg leading-relaxed">
            The original course was AI Powered People Ops. This cohort is its successor, rebuilt
            for this year's tools. The same operating work, run for:
          </p>
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
            <h2 className="font-display font-semibold" style={H2_STYLE}>
              {COURSE.seats} seats. Five Mondays from 12 October.
            </h2>
            <p className="mt-6 text-cream/80 text-lg leading-relaxed">
              Founding {COURSE.foundingPrice}. Standard {COURSE.standardPrice}.
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
