import { Link } from "react-router-dom";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";

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
 * The closing invitation. An inset bark island floating on the linen floor,
 * restating the one offer and giving both entry points: score your function
 * (low commitment) or book the audit (the paid two-week move). This is the
 * page's final and strongest push toward action.
 */
export const ClosingInvitation = () => {
  const onAudit = () =>
    track("cta_click", {
      cta_id: "audit_home_closing",
      cta_location: "closing_invitation",
      cta_label: "Book a Grain Audit",
      link_url: "/grain-audit",
    });
  const onReadiness = () =>
    track("cta_click", {
      cta_id: "readiness_home_closing",
      cta_location: "closing_invitation",
      cta_label: "Score your People function",
      link_url: "/readiness",
    });

  return (
    <section className="bg-linen section-pad" data-no-rule>
      <div className="container-grain">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-bark text-cream ring-1 ring-brass/25 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
            <BarkGrain />
            <div className="absolute inset-0 bg-gradient-to-br from-green/85 via-green/55 to-bark/80 pointer-events-none" />
            <Parallax speed={0.1} max={50} className="absolute inset-y-[-20%] right-[-8%] w-[60%] pointer-events-none hidden md:block">
              <TopoBackdrop variant="ridge" opacity={0.18} />
            </Parallax>

            <div className="relative px-8 py-16 md:px-16 md:py-24 lg:px-20 max-w-3xl">
              <h2 className="font-display uppercase text-cream leading-[0.98] text-[2rem] sm:text-[40px] md:text-[54px]" style={{ letterSpacing: "0.01em" }}>
                Start with one workflow.
              </h2>
              <p className="font-display italic text-cream/80 mt-5 text-lg md:text-xl lg:text-[22px] leading-snug max-w-xl">
                A two-week Grain Audit. We map how one part of your business actually runs, then hand you the three highest-leverage moves to change it.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  to="/grain-audit"
                  onClick={onAudit}
                  className="group inline-flex items-center justify-center gap-1 rounded-full bg-cream text-green pl-7 pr-3 py-3 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/90 active:scale-[0.98] shadow-[0_1px_0_hsl(var(--cream)/0.6)_inset]"
                >
                  Book a Grain Audit
                  <ArrowCircle tone="green" />
                </Link>
                <Link
                  to="/readiness"
                  onClick={onReadiness}
                  className="group inline-flex items-center justify-center gap-1 rounded-full border border-cream/40 text-cream pl-7 pr-3 py-3 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/10 active:scale-[0.98]"
                >
                  Score your People function
                  <ArrowCircle tone="cream" />
                </Link>
              </div>

              <p className="mt-8 font-sans uppercase text-cream/40" style={{ fontSize: "10px", letterSpacing: "0.25em" }}>
                Matt Bradburn · Founder, Deepgrain
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
