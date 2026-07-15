import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  Calculator,
  Compass,
  Headphones,
  Package,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { track, trackFormSubmit } from "@/lib/analytics";
import { recordAssessment } from "@/lib/assessmentCapture";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  EXPOSURE_ROLES,
  LAYER_LABELS,
  TOTAL_HOURS,
  roleAverage,
  scoreColour,
} from "@/data/exposureMap";

const leadSchema = z.object({
  email: z.string().trim().email("Please enter a valid work email").max(320),
});

const EXPOSURE_LD = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "The AI Exposure Map",
  description:
    "Every operating function and its component tasks scored 0-10 for AI exposure. Exposure is judged at task level: every function splits into work that automates and judgment that compounds.",
  creator: { "@id": "https://deepgrain.ai/#organization" },
  license: "https://deepgrain.ai/terms",
};

const ROLE_ICONS: LucideIcon[] = [
  Users, // People & HR
  Calculator, // Finance & Accounting
  Scale, // Legal & Compliance
  TrendingUp, // Revenue & Sales Ops
  ShieldCheck, // IT & Security
  Headphones, // Customer Support & Success
  Package, // Procurement & Vendor
  Compass, // Executive & Chief of Staff
];

/** The surveyor's grid behind the role chart: mixed cream and brass hairlines
 *  at slightly irregular spacing, per the Montagu map slide. Decorative. */
const ChartGrid = () => (
  <svg
    aria-hidden
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
  >
    <g strokeWidth="1">
      {Array.from({ length: 19 }, (_, i) => {
        const x = 40 + i * 84 + (i % 3) * 9;
        const brass = i % 4 === 2;
        return (
          <line
            key={`v${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="900"
            stroke={brass ? "hsl(var(--brass))" : "hsl(var(--cream))"}
            opacity={brass ? 0.22 : 0.09}
          />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const y = 30 + i * 78 + (i % 2) * 7;
        const brass = i % 4 === 1;
        return (
          <line
            key={`h${i}`}
            x1="0"
            y1={y}
            x2="1600"
            y2={y}
            stroke={brass ? "hsl(var(--brass))" : "hsl(var(--cream))"}
            opacity={brass ? 0.22 : 0.09}
          />
        );
      })}
    </g>
  </svg>
);

const INSIGHTS = [
  {
    title: "Read the low scores first",
    body: "Tasks scoring 0 to 3 are where the human value concentrates: judgment calls, trust, hard conversations. These grow in value as everything around them speeds up.",
  },
  {
    title: "The high scores are capacity",
    body: "Tasks scoring 7 and above are not headcount cuts. They are the hours a team gets back to spend on the low-scoring column. Cutting the people who hold the judgment is how AI adoption fails.",
  },
  {
    title: "Exposure is not adoption",
    body: "These scores are what current tooling can reliably do with proper setup and verification, not what your team does today. Most teams capture a fraction of this. That gap is the readiness question.",
  },
];

/** Direct lead capture on the exposure map: email + the function they were
 *  looking at, recorded to both the lead inbox (enquiries) and the structured
 *  capture table. The map used to capture nothing at all. */
const MapLeadForm = ({ viewedFunction }: { viewedFunction: string }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse({ email });
    if (!parsed.success) {
      toast({
        title: "Check your email",
        description: parsed.error.issues[0]?.message ?? "Invalid email",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: "Exposure Map request",
      email: parsed.data.email,
      organisation: null,
      size: null,
      message: `Requested a tailored AI exposure map. Was viewing the ${viewedFunction} function.`,
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again, or email matt@deepgrain.ai directly.",
        variant: "destructive",
      });
      return;
    }
    void recordAssessment({
      assessment: "exposure-map",
      email: parsed.data.email,
      detail: { viewedFunction },
      source: "exposure_map_capture",
    });
    trackFormSubmit("exposure_map_lead", { viewed_function: viewedFunction });
    setDone(true);
  };

  if (done) {
    return (
      <p className="font-display italic text-cream text-2xl md:text-3xl max-w-xl">
        Done. Matt will send your tailored map shortly.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
      <input
        type="email"
        placeholder="Work email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent border-0 border-b border-cream/25 rounded-none px-0 py-3.5 text-cream text-[17px] placeholder:text-cream/40 focus:outline-none focus:ring-0 focus:border-brass transition-colors duration-300"
      />
      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-cream text-green px-7 py-3.5 font-sans text-sm tracking-wider transition-all duration-300 hover:bg-cream/90 disabled:opacity-60 shrink-0"
      >
        {submitting ? "Sending…" : "Send me the tailored map"}
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
      </button>
    </form>
  );
};

const ExposureMap = () => {
  const [selected, setSelected] = useState(0);
  const role = EXPOSURE_ROLES[selected];
  const sortedTasks = [...role.tasks].sort((a, b) => b.score - a.score);
  const automates = role.tasks.filter((t) => t.score >= 7).length;
  const judgment = role.tasks.filter((t) => t.score <= 3).length;

  const selectRole = (i: number) => {
    setSelected(i);
    track("exposure_map_role", { role: EXPOSURE_ROLES[i].role });
  };

  return (
    <>
      <PageMeta
        title="The AI Exposure Map | Deepgrain"
        description="Every operating function scored for AI exposure at task level, not job level. From People and Finance to Legal, Revenue Ops and IT: see which work automates, which judgment compounds, and which capability layer unlocks each."
        path="/exposure-map"
        jsonLd={EXPOSURE_LD}
      />

      {/* ------------------------------------------------ intro ---------- */}
      <section className="relative bg-linen text-walnut overflow-hidden" data-no-rule>
        <TopoBackdrop variant="ridge" opacity={0.14} />
        <div className="relative container-grain pt-24 pb-16 md:pt-36 md:pb-24">
          <div className="fade-in-up">
            <SectionEyebrow tone="linen" className="mb-10">
              Interactive reference
            </SectionEyebrow>
            <h1
              className="font-display font-semibold max-w-4xl"
              style={{
                fontSize: "clamp(40px, 6vw, 84px)",
                lineHeight: 1.03,
                letterSpacing: "-0.01em",
              }}
            >
              The AI Exposure Map
            </h1>
          </div>
          <div className="fade-in-up fade-in-up-2 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-24 items-end mt-10">
            <p
              className="font-display italic text-walnut/75"
              style={{ fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.3 }}
            >
              Every chart you have seen scores whole jobs. Jobs are the wrong unit.
            </p>
            <p className="text-body text-lg leading-relaxed">
              Exposure lives at task level. Every operating function, from People and Finance to
              Legal, Revenue Ops and IT, splits into work that automates and judgment that
              compounds. Select a function to see its tasks.
            </p>
          </div>
        </div>
        <GrainFlow className="absolute inset-x-0 -bottom-4 h-36" tone="walnut" opacity={0.12} />
      </section>

      {/* ------------------------------------------------ map ------------ */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain pt-10 pb-24 md:pb-36">
          <ScrollReveal>
            <div className="relative bg-green rounded-[48px] md:rounded-[80px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-brass/20">
              <ChartGrid />
              <TopoBackdrop variant="basin" opacity={0.16} />
              <div className="relative p-8 md:p-14 lg:p-16">
                <div
                  className="flex items-baseline justify-between font-sans font-semibold uppercase text-cream/50 mb-8 md:mb-10"
                  style={{ fontSize: "11px", letterSpacing: "0.22em" }}
                >
                  <span>The chart · eight functions</span>
                  <span className="hidden md:inline">Exposure 0-10 · Weighted by hours</span>
                </div>
                <div className="grid gap-3.5 md:gap-4 grid-cols-2 md:grid-cols-3">
                  {EXPOSURE_ROLES.map((r, i) => {
                    const avg = roleAverage(r);
                    const active = i === selected;
                    const Icon = ROLE_ICONS[i];
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => selectRole(i)}
                        aria-pressed={active}
                        className={`group rounded-2xl px-5 py-5 md:px-6 md:py-6 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                          active
                            ? "bg-cream ring-1 ring-brass/60 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
                            : "bg-linen/90 ring-1 ring-walnut/10 hover:-translate-y-1 hover:bg-cream hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
                        }`}
                        style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)" }}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span
                            className={`inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-300 ${
                              active
                                ? "border-brass/70 text-brass bg-brass/10"
                                : "border-walnut/20 text-walnut/60 group-hover:border-brass/50 group-hover:text-brass"
                            }`}
                          >
                            <Icon size={19} strokeWidth={1.8} aria-hidden />
                          </span>
                          <span
                            className={`font-display font-semibold text-3xl leading-none ${
                              active ? "text-brass" : "text-walnut/85"
                            }`}
                            style={{ fontVariantNumeric: "tabular-nums" }}
                          >
                            {avg.toFixed(1)}
                          </span>
                        </span>
                        <span
                          className="font-sans font-semibold uppercase block mt-5 leading-snug text-walnut/60"
                          style={{ fontSize: "10px", letterSpacing: "0.18em" }}
                        >
                          ~{Math.round((r.hours / TOTAL_HOURS) * 100)}% of hours
                        </span>
                        <span className="font-display text-walnut text-xl md:text-[22px] block mt-1 leading-tight">
                          {r.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p
                  className="font-display italic text-brass/90 text-center mt-10 md:mt-12"
                  style={{ fontSize: "clamp(19px, 2.2vw, 26px)" }}
                >
                  The map asks the question. The task layer answers it.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-20 md:mt-28">
            <div className="h-px w-10 bg-brass/30 mb-10" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2
                className="font-display font-semibold"
                style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
              >
                {role.role}
              </h2>
              <p
                className="font-sans font-semibold uppercase text-walnut/55"
                style={{ fontSize: "12px", letterSpacing: "0.2em" }}
              >
                {automates} automate · {judgment} compound
              </p>
            </div>

            <div className="mt-10">
              {sortedTasks.map((t) => (
                <div
                  key={t.name}
                  className="grid grid-cols-1 md:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)_5rem] items-center gap-x-12 gap-y-2 border-b border-walnut/15 py-6"
                >
                  <div>
                    <p className="text-walnut font-medium text-[17px] leading-snug">
                      {t.name}
                      <span
                        className="ml-3 inline-block rounded-full border border-walnut/25 px-2.5 py-0.5 font-sans font-semibold uppercase text-walnut/55 align-[2px]"
                        style={{ fontSize: "9px", letterSpacing: "0.12em" }}
                      >
                        {LAYER_LABELS[t.layer]}
                      </span>
                    </p>
                    <p className="text-body/70 text-[15px] leading-snug mt-1.5">{t.note}</p>
                  </div>
                  <div className="h-px bg-walnut/15 relative" aria-hidden>
                    <div
                      className="absolute left-0 -top-px h-[3px]"
                      style={{ width: `${t.score * 10}%`, background: scoreColour(t.score) }}
                    />
                  </div>
                  <p
                    className="font-display font-semibold text-walnut text-xl md:text-right"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {t.score}
                    <span className="text-walnut/40 text-sm"> /10</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ScrollReveal delay={100}>
            <div className="relative mt-24 md:mt-32 bg-walnut/92 backdrop-blur-sm rounded-[48px] md:rounded-[80px] p-10 md:p-16 lg:p-20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-brass/20 overflow-hidden">
              <GrainFlow className="absolute inset-x-0 -top-8 h-44" opacity={0.1} />
              <div className="relative grid gap-12 md:grid-cols-3 md:gap-14">
                {INSIGHTS.map((card, i) => (
                  <div key={card.title}>
                    <span
                      className="font-display font-semibold text-brass/60 text-2xl block"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      0{i + 1}
                    </span>
                    <h3 className="font-display font-semibold text-cream text-2xl leading-tight mt-4">
                      {card.title}
                    </h3>
                    <p className="text-cream/70 mt-4 text-[15px] leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <p className="mt-20 text-walnut/50 text-sm max-w-3xl leading-relaxed">
            Methodology: task inventories from operating engagements across seven sectors. Scores
            rate what frontier models plus workflow tooling reliably produce with proper context
            and a verification step, judged per task rather than per function. Argue with them,
            that is what they are for.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ cta ------------ */}
      <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
        <BarkGrain />
        <TopoBackdrop variant="ridge" opacity={0.18} className="z-[1]" />
        <GrainFlow className="absolute inset-x-0 -top-6 h-40 z-[2]" opacity={0.14} />
        <div className="relative z-10 container-grain section-pad">
          <ScrollReveal>
            <SectionEyebrow className="mb-10">The next question</SectionEyebrow>
            <h2
              className="font-display font-semibold max-w-3xl"
              style={{
                fontSize: "clamp(32px, 4.5vw, 64px)",
                letterSpacing: "-0.01em",
                lineHeight: 1.05,
              }}
            >
              Where is your company on this map?
            </h2>
            <p className="text-cream/75 mt-8 max-w-xl text-lg leading-relaxed">
              This is the generic version. Get one built for your actual functions and team,
              with the tasks that matter to you scored and mapped to a plan. No cost.
            </p>
            <div className="mt-10">
              <MapLeadForm viewedFunction={role.role} />
            </div>
            <p className="text-cream/50 mt-8 text-sm">
              Want this done properly, on your own process?{" "}
              <Link
                to="/grain-audit"
                onClick={() =>
                  track("cta_click", {
                    cta_id: "grain_audit_from_exposure_map",
                    cta_location: "exposure_map_footer",
                    cta_label: "Book a Grain Audit",
                    link_url: "/grain-audit",
                  })
                }
                className="text-cream underline underline-offset-4 decoration-brass hover:text-brass transition-colors"
              >
                Book a Grain Audit →
              </Link>
            </p>
            <p className="text-cream/50 mt-3 text-sm">
              Prefer a number first?{" "}
              <Link
                to="/readiness"
                onClick={() =>
                  track("cta_click", {
                    cta_id: "readiness_from_exposure_map",
                    cta_location: "exposure_map_footer",
                    cta_label: "Take the readiness assessment",
                    link_url: "/readiness",
                  })
                }
                className="text-cream underline underline-offset-4 decoration-brass hover:text-brass transition-colors"
              >
                Take the 8-minute readiness assessment →
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default ExposureMap;
