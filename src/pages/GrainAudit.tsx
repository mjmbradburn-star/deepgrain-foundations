import { Link } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { track } from "@/lib/analytics";

const AUDIT_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "The Grain Audit",
  serviceType: "People Ops process audit",
  description:
    "A two-week fixed-scope review of one People Ops process. You get a U-shaped process map, a ranked automation shortlist scored on impact and effort, a one-page 90-day plan you keep, and a 30-minute readout. GBP 2,000, credited in full against any enablement programme within 30 days.",
  provider: { "@id": "https://deepgrain.ai/#organization" },
  areaServed: "Worldwide",
  offers: {
    "@type": "Offer",
    price: "2000",
    priceCurrency: "GBP",
    description: "Fixed price, credited in full against any enablement programme within 30 days.",
  },
};

const DELIVERABLES = [
  {
    title: "A U-shaped process map",
    body: "One process, drawn end to end. Where the hours go, where the judgment lives, where the work drops down into task and climbs back up into decision. The map most teams have never seen of their own process.",
  },
  {
    title: "A ranked automation shortlist",
    body: "Five to eight concrete automations, each scored on impact against effort. Not a wishlist. A sequence, ordered so the first thing you build pays for the next.",
  },
  {
    title: "A one-page 90-day plan",
    body: "What to do first, second, third, over the next quarter. One page, plain language, yours to keep and run with whether or not we ever work together.",
  },
  {
    title: "A 30-minute readout",
    body: "Live walkthrough of the map, the shortlist, and the plan. Your questions answered in the room. No deck theatre, no upsell wrapped in a slide.",
  },
];

const STEPS = [
  {
    time: "10 minutes",
    label: "Intake",
    body: "A short form. The process you want mapped, who runs it, what already hurts.",
  },
  {
    time: "60 minutes",
    label: "One working session",
    body: "We walk the process together, live. This is the only meeting that needs your team in a room.",
  },
  {
    time: "30 minutes",
    label: "Readout",
    body: "You get the map, the shortlist, and the plan. We talk them through. Then they are yours.",
  },
];

const PROOF = ["Rimes", "Systemiq", "Masabi", "Skylo"];

const GrainAudit = () => {
  return (
    <>
      <PageMeta
        title="The Grain Audit | Deepgrain"
        description="A two-week fixed-scope review of one People Ops process. U-shaped process map, ranked automation shortlist, a one-page 90-day plan you keep, and a 30-minute readout. GBP 2,000, credited in full against any programme. Three slots a month."
        path="/grain-audit"
        jsonLd={AUDIT_LD}
      />

      {/* ------------------------------------------------ hero ----------- */}
      <section className="relative bg-linen text-walnut overflow-hidden" data-no-rule>
        <TopoBackdrop variant="ridge" opacity={0.14} />
        <div className="relative container-grain pt-24 pb-16 md:pt-36 md:pb-24">
          <div className="fade-in-up">
            <SectionEyebrow tone="linen" className="mb-10">
              The bridge offer
            </SectionEyebrow>
            <h1
              className="font-display font-semibold max-w-4xl"
              style={{
                fontSize: "clamp(40px, 6vw, 84px)",
                lineHeight: 1.03,
                letterSpacing: "-0.01em",
              }}
            >
              The Grain Audit
            </h1>
          </div>
          <div className="fade-in-up fade-in-up-2 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-24 items-end mt-10">
            <p
              className="font-display italic text-walnut/75"
              style={{ fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.3 }}
            >
              Pick one People Ops process. In two weeks you get a map, a ranked plan, and the next
              quarter written down.
            </p>
            <p className="text-body text-lg leading-relaxed">
              A fixed-scope review of one process, end to end. We map where the hours and the
              judgment sit, rank the automations worth building, and hand you a 90-day plan you
              keep. GBP 2,000, credited in full against any programme. Three slots a month.
            </p>
          </div>
          <div className="fade-in-up fade-in-up-3 mt-12 flex flex-wrap items-center gap-6">
            <PillButton
              href="/contact"
              variant="filled"
              cta="grain_audit_hero"
              ctaLocation="grain_audit_hero"
              className="bg-green text-cream hover:bg-green/90 shadow-none"
            >
              Book a Grain Audit →
            </PillButton>
            <Link
              to="/readiness"
              onClick={() =>
                track("cta_click", {
                  cta_id: "readiness_from_grain_audit_hero",
                  cta_location: "grain_audit_hero",
                  cta_label: "Take the readiness assessment",
                  link_url: "/readiness",
                })
              }
              className="font-sans text-sm tracking-wider text-walnut/70 underline underline-offset-4 decoration-brass hover:text-walnut transition-colors"
            >
              Not sure yet? Take the 8-minute readiness assessment →
            </Link>
          </div>
        </div>
        <GrainFlow className="absolute inset-x-0 -bottom-4 h-36" tone="walnut" opacity={0.12} />
      </section>

      {/* ------------------------------------------------ deliverables --- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain pb-24 md:pb-36">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            What you walk away with
          </h2>
          <p className="text-body text-lg leading-relaxed max-w-2xl mt-6">
            Four things, all yours to keep. Concrete enough to hand to a builder on the Monday
            after.
          </p>

          <div className="mt-14">
            {DELIVERABLES.map((d, i) => (
              <div
                key={d.title}
                className="grid grid-cols-1 md:grid-cols-[4rem_minmax(0,1fr)] gap-x-10 gap-y-3 border-t border-walnut/15 py-9 md:py-11"
              >
                <span
                  className="font-display font-semibold text-brass/70 text-3xl md:text-4xl leading-none"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  0{i + 1}
                </span>
                <div className="max-w-2xl">
                  <h3 className="font-display font-semibold text-walnut text-2xl md:text-3xl leading-tight">
                    {d.title}
                  </h3>
                  <p className="text-body/80 text-[17px] leading-relaxed mt-3">{d.body}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-walnut/15" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ effort --------- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain pb-24 md:pb-36">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-24 items-end">
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              What it costs your team
            </h2>
            <p className="font-display italic text-walnut/75 text-2xl md:text-[28px] leading-snug">
              Under two hours of anyone's time. The heavy lifting is ours.
            </p>
          </div>

          <div className="mt-14 grid gap-px md:grid-cols-3 bg-walnut/15">
            {STEPS.map((s) => (
              <div key={s.label} className="bg-linen px-2 py-8 md:px-6 md:py-10">
                <p
                  className="font-display font-semibold text-walnut text-4xl md:text-5xl leading-none"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {s.time}
                </p>
                <p
                  className="font-sans font-semibold uppercase text-brass/80 mt-5"
                  style={{ fontSize: "11px", letterSpacing: "0.2em" }}
                >
                  {s.label}
                </p>
                <p className="text-body/80 text-[16px] leading-relaxed mt-3 max-w-xs">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ price + terms -- */}
      <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
        <BarkGrain />
        <TopoBackdrop variant="basin" opacity={0.16} className="z-[1]" />
        <GrainFlow className="absolute inset-x-0 -top-6 h-40 z-[2]" opacity={0.14} />
        <div className="relative z-10 container-grain section-pad">
          <ScrollReveal>
            <SectionEyebrow className="mb-10">The terms</SectionEyebrow>
            <div className="grid md:grid-cols-3 gap-12 md:gap-10">
              <div>
                <p
                  className="font-display font-semibold text-brass leading-none"
                  style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
                >
                  <AnimatedNumber value={2000} prefix="£" />
                </p>
                <p className="text-cream/75 mt-5 text-[17px] leading-relaxed max-w-xs">
                  Fixed, up front. Credited in full against any enablement programme you start
                  within 30 days. Move forward and the audit was free.
                </p>
              </div>
              <div>
                <p
                  className="font-display font-semibold text-cream leading-none"
                  style={{ fontSize: "clamp(56px, 7vw, 96px)", fontVariantNumeric: "tabular-nums" }}
                >
                  2 weeks
                </p>
                <p className="text-cream/75 mt-5 text-[17px] leading-relaxed max-w-xs">
                  Start to readout. One intake, one working session, one walkthrough. No drawn-out
                  discovery, no open-ended retainer.
                </p>
              </div>
              <div>
                <p
                  className="font-display font-semibold text-cream leading-none"
                  style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
                >
                  <AnimatedNumber value={3} suffix=" a month" />
                </p>
                <p className="text-cream/75 mt-5 text-[17px] leading-relaxed max-w-xs">
                  Three audits, every month. Each one is done properly by hand, so the slots are
                  real and they run out.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mt-20 md:mt-28 border-t border-cream/15 pt-14 md:pt-16 max-w-3xl">
              <p
                className="font-sans font-semibold uppercase text-brass/80"
                style={{ fontSize: "11px", letterSpacing: "0.22em" }}
              >
                The guarantee
              </p>
              <p className="font-display italic text-cream text-3xl md:text-[40px] leading-snug mt-6">
                If the readout does not surface at least five concrete opportunities, you do not
                pay.
              </p>
              <p className="text-cream/70 mt-6 text-lg leading-relaxed">
                Not five vague themes. Five specific, buildable automations, each with an impact and
                an effort score attached. If the map comes up short, the invoice does not come.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ------------------------------------------------ proof ---------- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain py-20 md:py-28">
          <p
            className="font-sans font-semibold uppercase text-walnut/50"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            The same operating work, run for
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

      {/* ------------------------------------------------ cta ------------ */}
      <section className="relative bg-green text-cream overflow-hidden" data-no-rule>
        <TopoBackdrop variant="ridge" opacity={0.16} />
        <GrainFlow className="absolute inset-x-0 -top-6 h-40 z-[2]" opacity={0.14} />
        <div className="relative z-10 container-grain section-pad">
          <ScrollReveal>
            <h2
              className="font-display font-semibold max-w-3xl"
              style={{
                fontSize: "clamp(32px, 4.5vw, 64px)",
                letterSpacing: "-0.01em",
                lineHeight: 1.05,
              }}
            >
              Pick the process. We will map it.
            </h2>
            <p className="text-cream/75 mt-8 max-w-xl text-lg leading-relaxed">
              Tell us which process is costing you the most and which slot you want this month. Two
              weeks later you have the map, the shortlist, and the plan.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <PillButton
                href="/contact"
                variant="filled"
                cta="grain_audit_footer"
                ctaLocation="grain_audit_footer"
              >
                Book a Grain Audit →
              </PillButton>
              <Link
                to="/exposure-map"
                onClick={() =>
                  track("cta_click", {
                    cta_id: "exposure_map_from_grain_audit",
                    cta_location: "grain_audit_footer",
                    cta_label: "See the exposure map",
                    link_url: "/exposure-map",
                  })
                }
                className="font-sans text-sm tracking-wider text-cream/70 underline underline-offset-4 decoration-brass hover:text-cream transition-colors"
              >
                First, see what automates on the exposure map →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default GrainAudit;
