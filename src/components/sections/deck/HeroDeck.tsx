import { Link } from "react-router-dom";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { Parallax } from "@/components/ui/Parallax";
import { GrainRings } from "@/components/sections/deck/GrainRings";
import { track } from "@/lib/analytics";

/** Trailing arrow nested in its own circular wrapper, with magnetic hover. */
const ArrowCircle = ({ tone = "green" }: { tone?: "green" | "cream" }) => (
  <span
    aria-hidden
    className={[
      "ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
      tone === "green" ? "bg-green/10 text-green" : "bg-cream/10 text-cream",
    ].join(" ")}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

/**
 * Two-column deck hero. Left rail carries the tracked-caps eyebrow, the
 * Cormorant headline, and the CTA row (one filled primary, two secondary
 * text-links). The right rail hangs the grain-rings render as framed artwork
 * on the dark ground, lifted on a soft shadow and drifting on scroll. On
 * tablet and mobile the frame drops below the copy so the message always
 * leads.
 */
export const HeroDeck = () => {
  const auditHref = "/grain-audit";
  const onAudit = () =>
    track("cta_click", {
      cta_id: "audit_home_hero",
      cta_location: "hero",
      cta_label: "Book a Grain Audit",
      link_url: auditHref,
    });
  const onReadiness = () =>
    track("cta_click", {
      cta_id: "readiness_home_hero",
      cta_location: "hero",
      cta_label: "Score your People function",
      link_url: "/readiness",
    });
  const onExposure = () =>
    track("cta_click", {
      cta_id: "exposure_home_hero",
      cta_location: "hero",
      cta_label: "Map what AI touches",
      link_url: "/exposure-map",
    });

  return (
    <section
      className="relative bg-bark text-cream overflow-hidden min-h-[620px] lg:min-h-[640px] lg:max-h-[880px] flex items-center"
      id="hero"
      data-no-rule
    >
      <BarkGrain />
      {/* Directional wash: solid green under the copy, opening toward the art. */}
      <div className="absolute inset-0 bg-gradient-to-br from-green/90 via-green/70 to-bark/85 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-green/30 via-transparent to-green/45 pointer-events-none z-[1]" />
      {/* Warm brass glow seated behind the artwork. */}
      <div className="hidden lg:block absolute right-[-6%] top-1/2 -translate-y-1/2 w-[46%] aspect-square rounded-full bg-brass/[0.14] blur-[120px] pointer-events-none z-[1]" />

      <div className="relative z-10 container-grain w-full pt-24 pb-16 md:pt-28 md:pb-20 lg:py-0">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* LEFT: copy */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="mb-7">
              <SectionEyebrow pill>Built for the AI era</SectionEyebrow>
            </div>

            <div className="max-w-2xl fade-in-up fade-in-up-1">
              <h1
                className="font-display font-medium uppercase text-cream leading-[0.98] text-[2.25rem] sm:text-[46px] md:text-[58px] lg:text-[58px] xl:text-[66px]"
                style={{ letterSpacing: "0.01em" }}
              >
                We rebuild how
                <br />
                your company runs.
              </h1>
              <p className="font-display italic text-cream/85 mt-5 max-w-xl text-lg md:text-xl lg:text-[22px] leading-snug">
                Audit the operating model, redesign the workflows, then ship the systems and AI that make the new shape stick.
              </p>
            </div>

            <div className="fade-in-up fade-in-up-3 mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 sm:gap-6">
              <Link
                to={auditHref}
                onClick={onAudit}
                className="group inline-flex items-center justify-center gap-1 rounded-full bg-cream text-green pl-7 pr-3 py-3 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/90 active:scale-[0.98] shadow-[0_1px_0_hsl(var(--cream)/0.6)_inset]"
              >
                Book a Grain Audit
                <ArrowCircle tone="green" />
              </Link>
              <Link
                to="/readiness"
                onClick={onReadiness}
                className="group inline-flex items-center gap-1.5 font-sans text-sm tracking-wider text-cream/80 hover:text-cream underline-offset-4 hover:underline"
              >
                Score your People function
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                to="/exposure-map"
                onClick={onExposure}
                className="group inline-flex items-center gap-1.5 font-sans text-sm tracking-wider text-cream/80 hover:text-cream underline-offset-4 hover:underline"
              >
                Map what AI touches
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: the living grain artifact */}
          <div className="lg:col-span-5 xl:col-span-5 fade-in-up fade-in-up-2">
            <Parallax speed={0.08} max={40} className="w-full">
              <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:ml-auto lg:mr-0 lg:max-w-[520px]">
                <GrainRings />
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
};
