import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { PageMeta } from "@/components/seo/PageMeta";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { track, trackFormSubmit } from "@/lib/analytics";
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

/** Lead form shown alongside the result. Posts to the enquiries table so the
 *  score context arrives with the lead instead of a bare email address. */
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
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-lg border border-brass/40 bg-green/40 p-6 md:p-8">
        <p className="font-display italic text-cream text-2xl">Done. It is on its way.</p>
        <p className="text-cream/70 mt-2 text-sm leading-relaxed">
          Matt reads every one of these personally. If your gaps raise a question worth a
          conversation, you will hear from him, a human, not a sequence.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-brass/40 bg-green/40 p-6 md:p-8">
      <h3 className="font-display text-cream text-2xl md:text-[1.7rem] leading-tight">
        Want the board-ready version?
      </h3>
      <p className="text-cream/70 mt-2 text-sm leading-relaxed">
        Your score, the four layers, your two gaps and the recommended first move, written up
        to be forwarded to your CEO as it stands. No sequence, no chaser emails.
      </p>
      <div className="mt-5 grid gap-3">
        <input
          type="text"
          placeholder="Your name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-md border border-cream/25 bg-transparent px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-brass"
        />
        <input
          type="email"
          placeholder="Work email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full rounded-md border border-cream/25 bg-transparent px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-brass"
        />
        <input
          type="text"
          placeholder="Organisation (optional)"
          autoComplete="organization"
          value={form.organisation}
          onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))}
          className="w-full rounded-md border border-cream/25 bg-transparent px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-brass"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream text-green px-7 py-3 font-sans text-sm tracking-wider hover:bg-cream/90 transition-all disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send me the readout"}
        <span>→</span>
      </button>
      <p className="text-cream/40 mt-3 text-xs">
        One email with your readout. Nothing else unless you ask.{" "}
        <Link to="/privacy" className="underline hover:text-cream/70">
          Privacy
        </Link>
      </p>
    </form>
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
      <section className="relative bg-bark text-cream min-h-[calc(100svh-4rem)]" data-no-rule>
        <div className="absolute inset-0 bg-gradient-to-b from-green/50 via-transparent to-green/50 pointer-events-none" />
        <div className="relative container-grain py-16 md:py-24 max-w-3xl">
          {!started && !result && (
            <div className="fade-in-up">
              <span
                className="font-sans uppercase text-brass"
                style={{ fontSize: "11px", letterSpacing: "0.25em" }}
              >
                The readiness assessment
              </span>
              <h1 className="font-display font-medium text-cream leading-[1.02] mt-4 text-[2.2rem] sm:text-5xl md:text-[3.6rem]">
                How AI-ready is your People function, honestly?
              </h1>
              <p className="font-display italic text-cream/85 mt-5 max-w-xl text-lg md:text-xl leading-snug">
                Sixteen questions, eight minutes. One honest number, not a vanity score: where
                your team sits across the four capability layers, the specific gaps, and what
                fixes each one.
              </p>
              <p className="text-cream/60 mt-4 text-sm">
                No email gate on the score. The number is yours either way.
              </p>
              <button
                type="button"
                onClick={start}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cream text-green px-7 py-3.5 font-sans text-sm tracking-wider hover:bg-cream/90 transition-all"
              >
                Start the assessment
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          )}

          {started && !result && (
            <div>
              <div
                className="flex items-center justify-between font-sans uppercase text-cream/50"
                style={{ fontSize: "11px", letterSpacing: "0.2em" }}
              >
                <span>
                  Question {index + 1} of {QUESTIONS.length}
                </span>
                <span className="text-brass">
                  Layer {question.layer + 1} · {LAYERS[question.layer]}
                </span>
              </div>
              <div className="mt-3 h-1 rounded-full bg-cream/15">
                <div
                  className="h-full rounded-full bg-brass transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <h2 className="font-display font-medium text-cream leading-tight mt-8 text-2xl md:text-[2.1rem]">
                {question.question}
              </h2>
              <div className="mt-7 grid gap-3">
                {question.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => answer(opt.points)}
                    className="w-full rounded-md border border-cream/25 bg-green/30 px-5 py-4 text-left text-cream/90 text-[0.95rem] leading-snug hover:border-brass hover:bg-green/50 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => setIndex(index - 1)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-cream/30 text-cream/70 px-5 py-2.5 font-sans text-xs tracking-wider hover:bg-cream/10 transition-all"
                >
                  ← Back
                </button>
              )}
            </div>
          )}

          {result && (
            <div className="fade-in-up">
              <span
                className="font-sans uppercase text-brass"
                style={{ fontSize: "11px", letterSpacing: "0.25em" }}
              >
                Your result · unvarnished
              </span>
              <div className="mt-5 rounded-lg border border-cream/15 bg-green/40 p-7 md:p-10">
                <div
                  className="font-sans uppercase text-cream/50"
                  style={{ fontSize: "10px", letterSpacing: "0.25em" }}
                >
                  Deepgrain · People Ops AI Readiness
                </div>
                <div className="font-display font-medium text-cream leading-none mt-3 text-[4.2rem] md:text-[5.2rem]">
                  {result.score}
                  <span className="text-cream/45 text-[1.8rem] md:text-[2.2rem]"> / 100</span>
                </div>
                <div className="font-display italic text-brass text-2xl md:text-[1.8rem] mt-1">
                  {result.stage.name}
                </div>
                <p className="text-cream/75 mt-3 text-[0.95rem] leading-relaxed max-w-xl">
                  {result.stage.read}
                </p>
                <div className="mt-7 grid gap-2.5">
                  {LAYERS.map((layer, i) => (
                    <div key={layer} className="grid grid-cols-[8.5rem_1fr_2.5rem] md:grid-cols-[11rem_1fr_3rem] items-center gap-3">
                      <span
                        className="font-sans uppercase text-cream/60"
                        style={{ fontSize: "10px", letterSpacing: "0.12em" }}
                      >
                        {layer}
                      </span>
                      <div className="h-2 rounded-full bg-cream/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brass"
                          style={{ width: `${result.layerScores[i]}%` }}
                        />
                      </div>
                      <span className="font-sans text-cream/80 text-xs text-right">
                        {result.layerScores[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-display text-cream text-2xl md:text-3xl mt-10">
                Your two biggest gaps
              </h3>
              <div className="mt-4 grid gap-4">
                {result.weakestLayers.map((layer) => (
                  <div
                    key={layer}
                    className="rounded-md border-l-4 border-brass bg-green/30 px-5 py-4"
                  >
                    <h4 className="text-cream font-medium text-[1.02rem]">
                      {GAPS[layer].title}{" "}
                      <span className="text-cream/50 font-normal">
                        ({LAYERS[layer]}: {result.layerScores[layer]}/100)
                      </span>
                    </h4>
                    <p className="text-cream/70 mt-1.5 text-sm leading-relaxed">
                      {GAPS[layer].detail}
                    </p>
                    <p
                      className="font-sans uppercase text-brass mt-2"
                      style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                    >
                      {GAPS[layer].fix}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <ResultLeadForm result={result} />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/exposure-map"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/40 text-cream px-6 py-3 font-sans text-sm tracking-wider hover:bg-cream/10 transition-all"
                >
                  See which tasks drive this →
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/25 text-cream/60 px-6 py-3 font-sans text-sm tracking-wider hover:bg-cream/10 transition-all"
                >
                  Retake
                </button>
              </div>
              <p className="text-cream/40 mt-8 text-xs leading-relaxed">
                Scoring: sixteen questions, four per layer, equal weight. Your answers never
                leave this page unless you request the readout.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Readiness;
