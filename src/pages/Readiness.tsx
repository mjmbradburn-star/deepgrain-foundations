import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { PageMeta } from "@/components/seo/PageMeta";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { GrowthRings } from "@/components/ui/GrowthRings";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { track, trackFormSubmit } from "@/lib/analytics";
import { recordAssessment } from "@/lib/assessmentCapture";
import { cn } from "@/lib/utils";
import {
  GAPS,
  LAYERS,
  QUESTIONS,
  scoreAssessment,
  type AssessmentResult,
} from "@/data/readinessAssessment";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please add your name").max(120),
  email: z.string().trim().email("Please enter a valid work email").max(320),
  organisation: z.string().trim().max(160).optional(),
});

const READINESS_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "People Ops AI Readiness Assessment",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  provider: { "@id": "https://deepgrain.ai/#organization" },
  description:
    "Sixteen questions scoring a People function across four capability layers. One honest number, the gaps, and what fixes each.",
};

/** Count-up for the headline numeral: 0 → value over 1600ms, once, honouring
 *  prefers-reduced-motion. */
const useCountUp = (value: number, duration = 1600) => {
  const [display, setDisplay] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const startAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return display;
};

const underlineInput =
  "w-full bg-transparent border-0 border-b border-cream/25 rounded-none px-0 py-3.5 text-cream text-[17px] placeholder:text-cream/40 focus:outline-none focus:ring-0 focus:border-brass transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

const EASE = "cubic-bezier(0.32,0.72,0,1)";

/** Trailing arrow nested in its own circular wrapper, with magnetic hover.
 *  Mirrors the primitive built for the home hero (HeroDeck's ArrowCircle) so
 *  every CTA on the site shares the same button-in-button language. `invert`
 *  is for outline CTAs whose surrounding button flips to a solid fill on
 *  hover, so the inner circle needs its own colour swap rather than a flat
 *  tone. */
const ArrowCircle = ({ tone = "green" }: { tone?: "green" | "cream" | "invert" }) => (
  <span
    aria-hidden
    className={cn(
      "ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
      tone === "green" && "bg-green/10 text-green",
      tone === "cream" && "bg-cream/10 text-cream",
      tone === "invert" &&
        "border border-cream/40 text-cream/80 group-hover:border-green/30 group-hover:bg-green/10 group-hover:text-green",
    )}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

/** Double-bezel shell for the dark bark section: a machined outer tray in a
 *  hairline cream ring, an inner core with its own inset highlight and a
 *  smaller, concentric radius. `innerClassName` carries the padding so each
 *  use (gap cards, the growth-rings tray, the lead-capture panel) can size
 *  itself. */
const Bezel = ({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) => (
  <div
    className={cn(
      "rounded-[2.5rem] bg-cream/[0.04] p-1.5 ring-1 ring-cream/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)]",
      className,
    )}
  >
    <div
      className={cn(
        "h-full rounded-[calc(2.5rem-0.375rem)] bg-bark/60 border border-cream/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]",
        innerClassName,
      )}
    >
      {children}
    </div>
  </div>
);

/** Same double-bezel technique, in the linen section's palette (walnut outer
 *  tray, cream inner core), matching the WorkedExample cards on Home. */
const BezelLight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "h-full rounded-[2rem] bg-walnut/[0.04] p-1.5 ring-1 ring-walnut/10 shadow-[0_40px_80px_-50px_hsl(var(--walnut)/0.5)]",
      className,
    )}
  >
    <div className="h-full rounded-[1.625rem] bg-cream p-8 border border-walnut/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.65)]">
      {children}
    </div>
  </div>
);

/** The lead capture, set in the site's curved bronze panel. Posts to
 *  enquiries so the score context arrives with the lead. */
const ResultLeadForm = ({ result }: { result: AssessmentResult }) => {
  const [form, setForm] = useState({ name: "", email: "", organisation: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Almost there",
        description: parsed.error.issues[0]?.message ?? "Please review the form",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const summary = [
      `People Ops AI Readiness Assessment result: ${result.score}/100 (${result.stage.name}).`,
      `Layers: ${LAYERS.map((l, i) => `${l} ${result.layerScores[i]}`).join(", ")}.`,
      `Biggest gaps: ${result.weakestLayers.map((l) => LAYERS[l]).join(" and ")}.`,
      "Requested the board-ready readout.",
    ].join(" ");
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      organisation: parsed.data.organisation || null,
      size: null,
      message: summary,
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
    trackFormSubmit("readiness_lead", { score: result.score, stage: result.stage.name });
    // Record the lead against the same session as the anonymous completion,
    // so the email joins back to the score they actually saw.
    void recordAssessment({
      assessment: "readiness",
      score: result.score,
      stage: result.stage.name,
      layerScores: Object.fromEntries(LAYERS.map((l, i) => [l, result.layerScores[i]])),
      detail: { weakestLayers: result.weakestLayers.map((l) => LAYERS[l]) },
      email: parsed.data.email,
      name: parsed.data.name,
      organisation: parsed.data.organisation || null,
      source: "readiness_readout",
    });
    setDone(true);
  };

  return (
    <div className="relative rounded-[3rem] md:rounded-[4rem] bg-brass/[0.06] p-2 md:p-2.5 ring-1 ring-brass/25 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.6)]">
      <div className="relative rounded-[calc(3rem-0.5rem)] md:rounded-[calc(4rem-0.625rem)] bg-walnut/95 backdrop-blur-sm p-10 md:p-16 lg:p-20 border border-brass/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden">
        <GrainFlow className="absolute inset-x-0 -top-6 h-40" opacity={0.1} />
        {done ? (
          <div className="relative max-w-2xl">
            <p className="font-display italic text-cream text-3xl md:text-4xl">
              Done. It is on its way.
            </p>
            <p className="text-cream/75 mt-5 text-[17px] leading-relaxed">
              Matt reads every one of these personally. If your gaps raise a question worth a
              conversation, you will hear from him, a human, not a sequence.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h3
                className="font-display font-semibold text-cream leading-[1.05]"
                style={{ fontSize: "clamp(28px, 3vw, 44px)", letterSpacing: "-0.01em" }}
              >
                Want the board-ready version?
              </h3>
              <p className="text-cream/75 mt-6 text-[17px] leading-relaxed max-w-md">
                Your score, the four layers, your two gaps and the recommended first move, written
                up to be forwarded to your CEO as it stands.
              </p>
              <p className="text-cream/50 mt-5 text-sm">
                One email with your readout. Nothing else unless you ask.{" "}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-cream/80">
                  Privacy
                </Link>
              </p>
            </div>
            <div className="grid gap-6">
              <input
                type="text"
                placeholder="Your name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={underlineInput}
              />
              <input
                type="email"
                placeholder="Work email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={underlineInput}
              />
              <input
                type="text"
                placeholder="Organisation (optional)"
                autoComplete="organization"
                value={form.organisation}
                onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))}
                className={underlineInput}
              />
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-1 rounded-full bg-cream text-green pl-8 pr-3 py-3.5 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/90 active:scale-[0.98] shadow-[0_1px_0_hsl(var(--cream)/0.6)_inset] disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send me the readout"}
                  <ArrowCircle tone="green" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const ResultScore = ({ result }: { result: AssessmentResult }) => {
  const shown = useCountUp(result.score);
  return (
    <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-16 lg:gap-24 items-center">
      <div>
        <div
          className="font-display font-semibold text-brass leading-none"
          style={{ fontSize: "clamp(100px, 13vw, 180px)", fontVariantNumeric: "tabular-nums" }}
        >
          {shown}
          <span className="text-cream/30" style={{ fontSize: "0.3em" }}>
            {" "}
            / 100
          </span>
        </div>
        <p
          className="font-display italic text-cream mt-5"
          style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
        >
          {result.stage.name}
        </p>
        <p className="text-cream/80 mt-8 max-w-xl text-lg leading-relaxed">{result.stage.read}</p>

        <div className="mt-14 grid gap-7 max-w-lg">
          {LAYERS.map((layer, i) => (
            <div key={layer}>
              <div className="flex items-baseline justify-between mb-2.5">
                <span
                  className="font-sans font-semibold uppercase text-cream/70"
                  style={{ fontSize: "12px", letterSpacing: "0.2em" }}
                >
                  {layer}
                </span>
                <span
                  className="font-display font-semibold text-cream text-2xl"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {result.layerScores[i]}
                </span>
              </div>
              <div className="h-px bg-cream/15 relative">
                <div
                  className="absolute left-0 -top-px h-[3px] bg-brass/70 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ width: `${result.layerScores[i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <Bezel innerClassName="p-10 flex flex-col items-center">
          <GrowthRings
            values={[...result.layerScores]}
            labels={[...LAYERS]}
            className="w-full max-w-[400px] mx-auto"
          />
          <p
            className="text-center font-sans uppercase text-cream/40 mt-6"
            style={{ fontSize: "11px", letterSpacing: "0.25em" }}
          >
            Four layers, read like growth rings
          </p>
        </Bezel>
      </div>
    </div>
  );
};

const Readiness = () => {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const question = QUESTIONS[index];
  const progress = useMemo(() => Math.round((index / QUESTIONS.length) * 100), [index]);

  const start = () => {
    setStarted(true);
    track("assessment_start", { assessment: "readiness" });
  };

  const answer = (points: number) => {
    const next = [...answers];
    next[index] = points;
    setAnswers(next);
    if (index + 1 < QUESTIONS.length) {
      setIndex(index + 1);
    } else {
      const r = scoreAssessment(next);
      setResult(r);
      track("assessment_complete", {
        assessment: "readiness",
        score: r.score,
        stage: r.stage.name,
      });
      // Record every completion anonymously (no email needed) so the full
      // score distribution is queryable and benchmarkable.
      void recordAssessment({
        assessment: "readiness",
        score: r.score,
        stage: r.stage.name,
        layerScores: Object.fromEntries(LAYERS.map((l, i) => [l, r.layerScores[i]])),
        detail: { weakestLayers: r.weakestLayers.map((l) => LAYERS[l]) },
        source: "readiness_complete",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const restart = () => {
    setStarted(false);
    setIndex(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <>
      <PageMeta
        title="How AI-ready is your People function? | Deepgrain"
        description="Sixteen questions, eight minutes, one honest number. Score your People function across four capability layers and see the two gaps that matter most."
        path="/readiness"
        jsonLd={READINESS_LD}
      />
      <section
        className="relative bg-bark text-cream overflow-hidden"
        data-no-rule
      >
        <BarkGrain />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/70 via-transparent to-bark/70 pointer-events-none z-[1]" />

        {/* ---------------------------------------------- intro ---------- */}
        {!started && !result && (
          <>
            <Parallax speed={0.12} max={80} className="absolute inset-0 z-[1]">
              <TopoBackdrop variant="ridge" opacity={0.22} />
            </Parallax>
            <div className="relative z-10 container-grain pt-24 pb-32 md:pt-28 md:pb-40">
              <div className="fade-in-up">
                <SectionEyebrow pill className="mb-10">
                  The readiness assessment
                </SectionEyebrow>
                <h1
                  className="font-display font-semibold text-cream max-w-4xl"
                  style={{
                    fontSize: "clamp(40px, 6vw, 84px)",
                    lineHeight: 1.03,
                    letterSpacing: "-0.01em",
                  }}
                >
                  How AI-ready is your People function, honestly?
                </h1>
              </div>
              <div className="fade-in-up fade-in-up-2">
                <p
                  className="font-display italic text-cream/85 mt-10 max-w-2xl"
                  style={{ fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.3 }}
                >
                  Sixteen questions, eight minutes. One honest number, not a vanity score.
                </p>
                <p className="mt-7 text-cream/75 max-w-xl text-lg leading-relaxed">
                  Where your team sits across the four capability layers, the specific gaps, and
                  what fixes each one. No email gate on the score. The number is yours either
                  way.
                </p>
              </div>
              <div className="fade-in-up fade-in-up-3 mt-14 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={start}
                  className="group inline-flex items-center gap-1 rounded-full bg-cream text-green pl-8 pr-3 py-3.5 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/90 active:scale-[0.98] shadow-[0_1px_0_hsl(var(--cream)/0.6)_inset]"
                >
                  Start the assessment
                  <ArrowCircle tone="green" />
                </button>
                <span className="text-cream/50 text-sm">Free · no sign-up</span>
              </div>

            </div>
          </>
        )}

        {/* ---------------------------------------------- quiz ----------- */}
        {started && !result && (
          <>
            <Parallax speed={0.1} max={60} className="absolute inset-0 z-[1]">
              <TopoBackdrop variant="basin" opacity={0.1} />
            </Parallax>
            <div className="relative z-10 container-grain py-28 md:py-36">
              <div className="max-w-3xl mx-auto">
                <div
                  className="flex items-baseline justify-between font-sans font-semibold uppercase text-cream/50"
                  style={{ fontSize: "12px", letterSpacing: "0.2em" }}
                >
                  <span>
                    Question {index + 1}{" "}
                    <span className="text-cream/25">of {QUESTIONS.length}</span>
                  </span>
                  <span>{LAYERS[question.layer]}</span>
                </div>
                <div className="mt-5 h-px bg-cream/15 relative">
                  <div
                    className="absolute left-0 -top-px h-[3px] bg-brass/70 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      transitionTimingFunction: EASE,
                    }}
                  />
                </div>

                <div key={index} className="fade-in-up">
                  <h2
                    className="font-display font-semibold text-cream text-balance mt-16 md:mt-20"
                    style={{
                      fontSize: "clamp(28px, 3.8vw, 48px)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {question.question}
                  </h2>

                  <div className="mt-14 grid gap-4">
                    {question.options.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => answer(opt.points)}
                        className="group w-full rounded-[1.75rem] ring-1 ring-cream/20 bg-bark/40 px-9 py-7 text-left transition-all duration-500 hover:ring-brass/60 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                        style={{ transitionTimingFunction: EASE }}
                      >
                        <span className="flex items-center justify-between gap-6">
                          <span className="text-cream/90 text-[17px] leading-snug">
                            {opt.label}
                          </span>
                          <span
                            aria-hidden
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brass/0 text-cream/0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-brass/15 group-hover:text-brass group-hover:translate-x-0.5"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-14 flex items-center justify-between">
                  {index > 0 ? (
                    <button
                      type="button"
                      onClick={() => setIndex(index - 1)}
                      className="font-sans font-semibold uppercase text-cream/50 hover:text-cream transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      style={{ fontSize: "12px", letterSpacing: "0.2em" }}
                    >
                      ← Previous
                    </button>
                  ) : (
                    <span aria-hidden />
                  )}
                  <span
                    className="font-sans uppercase text-cream/30"
                    style={{ fontSize: "11px", letterSpacing: "0.2em" }}
                  >
                    Honest answers, honest number
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ---------------------------------------------- result --------- */}
        {result && (
          <div className="relative z-10">
            <div className="container-grain pt-24 pb-8 md:pt-32">
              <Reveal>
                <SectionEyebrow pill className="mb-14">
                  Your result · unvarnished
                </SectionEyebrow>
                <ResultScore result={result} />
              </Reveal>
            </div>

            <GrainFlow className="h-40 md:h-52 mt-8" opacity={0.18} />

            <div className="container-grain pb-32 md:pb-40">
              <Reveal>
                <div className="mt-8 md:mt-12">
                  <h3
                    className="font-display font-semibold text-cream"
                    style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
                  >
                    Your two biggest gaps
                  </h3>
                  <div className="mt-12 grid md:grid-cols-2 gap-6 md:gap-8">
                    {result.weakestLayers.map((layer, i) => (
                      <Reveal key={layer} delay={i * 100} className="h-full">
                        <Bezel className="h-full" innerClassName="p-8 md:p-10 h-full">
                          <p
                            className="font-sans font-semibold uppercase text-cream/50"
                            style={{ fontSize: "12px", letterSpacing: "0.2em" }}
                          >
                            {LAYERS[layer]} ·{" "}
                            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                              {result.layerScores[layer]}
                            </span>
                            /100
                          </p>
                          <h4 className="font-display font-semibold text-cream text-2xl md:text-3xl mt-5">
                            {GAPS[layer].title}
                          </h4>
                          <p className="text-cream/75 mt-5 text-[17px] leading-relaxed">
                            {GAPS[layer].detail}
                          </p>
                        </Bezel>
                      </Reveal>
                    ))}
                  </div>
                  <div className="mt-10 border-l-2 border-brass/60 bg-cream/[0.05] px-7 py-5 max-w-4xl">
                    <p className="text-cream/80 text-[17px] leading-relaxed">
                      The first move is {GAPS[result.weakestLayers[0]].fix.replace("Fix: ", "")}
                      .{" "}
                      <span className="text-brass font-medium">
                        That is a two-week teardown, not a transformation programme.
                      </span>
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Link
                      to="/grain-audit"
                      onClick={() =>
                        track("cta_click", {
                          cta_id: "audit_readiness_result",
                          cta_location: "readiness_result",
                          cta_label: "Book a Grain Audit",
                          link_url: "/grain-audit",
                        })
                      }
                      className="group inline-flex items-center gap-1 rounded-full bg-cream text-green pl-8 pr-3 py-3.5 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/90 active:scale-[0.98] shadow-[0_1px_0_hsl(var(--cream)/0.6)_inset]"
                    >
                      Book a Grain Audit
                      <ArrowCircle tone="green" />
                    </Link>
                    <span className="text-cream/50 text-sm">
                      Two weeks. GBP 2,000, credited in full if you go further.
                    </span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-24 md:mt-32">
                  <ResultLeadForm result={result} />
                </div>
              </Reveal>

              <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-5">
                <Link
                  to="/exposure-map"
                  className="group inline-flex items-center gap-1 rounded-full border border-cream/80 text-cream pl-7 pr-3 py-3 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] hover:bg-cream hover:text-green"
                >
                  See which tasks drive this
                  <ArrowCircle tone="invert" />
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="font-sans text-sm tracking-wider text-cream/50 hover:text-cream transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  Retake the assessment
                </button>
              </div>
              <p className="mt-16 text-cream/40 text-sm max-w-2xl leading-relaxed">
                Scoring: sixteen questions, four per layer, equal weight. Your answers never
                leave this page unless you request the readout.
              </p>
            </div>
          </div>
        )}
      </section>

      {!started && !result && (
        <section className="bg-linen text-walnut border-t border-walnut/10">
          <div className="container-grain py-24 md:py-32">
            <div className="flex items-baseline justify-between mb-10 md:mb-14">
              <SectionEyebrow pill tone="linen">
                The four layers
              </SectionEyebrow>
              <span className="font-display italic text-walnut/50 text-sm md:text-base">
                Read like growth rings
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {LAYERS.map((layer, i) => {
                const hints = [
                  "Where the hours actually go.",
                  "Confidence and craft, not just training.",
                  "The stack that earns its keep.",
                  "Habits that survive the rollout.",
                ];
                return (
                  <Reveal key={layer} delay={i * 90} className="h-full">
                    <BezelLight className="h-full">
                      <span
                        className="font-display font-semibold text-brass text-4xl md:text-5xl leading-none"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        0{i + 1}
                      </span>
                      <div className="mt-5">
                        <div
                          className="font-sans font-semibold uppercase text-walnut"
                          style={{ fontSize: "12px", letterSpacing: "0.2em" }}
                        >
                          {layer}
                        </div>
                        <p className="text-walnut/65 text-sm mt-2 leading-snug">
                          {hints[i]}
                        </p>
                      </div>
                    </BezelLight>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Readiness;
