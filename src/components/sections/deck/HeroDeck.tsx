import { Link } from "react-router-dom";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { track } from "@/lib/analytics";

const ChevronDown = ({ size = 28 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Pip = ({ icon, label }: { icon: string; label: string }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-brass/40 px-3.5 py-1.5 text-xs text-cream/85">
    <span className="text-brass">{icon}</span> {label}
  </span>
);

/**
 * Deck-style hero. Mirrors the Montagu title slide composition: tracked-caps
 * eyebrow rail, italic Cormorant sub, three altitude chips, brass topographic
 * ridge on the right, single dominant CTA.
 */
export const HeroDeck = () => {
  const auditHref =
    "/contact?subject=" +
    encodeURIComponent(
      "I'd like a free 30-minute audit. The workflow I'd most like to fix is:",
    );
  const onAudit = () =>
    track("cta_click", {
      cta_id: "audit_home_hero",
      cta_location: "hero",
      cta_label: "Book a free 30-minute audit",
      link_url: auditHref,
    });
  return (
    <section
      className="relative bg-bark text-cream overflow-hidden min-h-[560px] md:min-h-[620px] lg:h-[calc(100svh-4rem)] lg:min-h-[600px] lg:max-h-[820px] flex items-center"
      id="hero"
      data-no-rule
    >
      <BarkGrain />
      <div className="absolute inset-0 bg-gradient-to-r from-green/85 via-green/55 to-green/20 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-green/40 via-transparent to-green/40 pointer-events-none z-[1]" />

      <div className="relative z-10 container-grain pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-16 lg:pb-20 w-full">
        <div className="hidden md:flex items-center justify-between mb-6 md:mb-8 lg:mb-6">
          <SectionEyebrow />
          <span
            className="hidden md:inline font-sans uppercase text-cream/40"
            style={{ fontSize: "11px", letterSpacing: "0.25em" }}
          >
            For G&amp;A leaders
          </span>
        </div>

        <div className="max-w-3xl fade-in-up fade-in-up-1">
          <h1
            className="font-display font-medium uppercase text-cream leading-[0.95] text-[2.25rem] sm:text-[48px] md:text-[64px] lg:text-[72px]"
            style={{ letterSpacing: "0.01em" }}
          >
            We rebuild how
            <br />
            your company runs.
          </h1>
          <p className="font-display italic text-cream/85 mt-5 max-w-xl text-base md:text-xl lg:text-[22px] leading-snug">
            Audit the operating model, redesign the workflows, then ship the systems and AI that make the new shape stick.
          </p>
        </div>

        <div className="fade-in-up fade-in-up-2 mt-6 lg:mt-5 flex flex-wrap gap-2.5">
          <Pip icon="◎" label="Strategic" />
          <Pip icon="⌥" label="Functional" />
          <Pip icon="◯" label="Individual" />
        </div>

        <div className="fade-in-up fade-in-up-3 mt-6 lg:mt-5 flex flex-wrap items-center gap-4">
          <Link
            to={auditHref}
            onClick={onAudit}
            className="group inline-flex items-center gap-2 rounded-full bg-cream text-green px-7 py-3.5 font-sans text-sm tracking-wider hover:bg-cream/90 transition-all"
          >
            Book a free 30-minute audit
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/method"
            className="inline-flex items-center gap-2 rounded-full border border-cream/40 text-cream px-7 py-3.5 font-sans text-sm tracking-wider hover:bg-cream/10 transition-all"
          >
            See the method →
          </Link>
        </div>

        <div className="hidden md:flex absolute bottom-6 left-0 right-0 container-grain items-center justify-between text-cream/40 font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.25em" }}>
          <span>Matt Bradburn · Founder, Deepgrain</span>
          <span>Work with the grain</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-4 md:bottom-6 flex justify-center pointer-events-none z-10">
        <button
          type="button"
          onClick={() => {
            const hero = document.getElementById("hero");
            const next = hero?.nextElementSibling as HTMLElement | null;
            const prefersReduced =
              typeof window !== "undefined" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";
            if (next) next.scrollIntoView({ behavior, block: "start" });
            else window.scrollTo({ top: window.innerHeight, behavior });
          }}
          aria-label="Scroll to next section"
          className="pointer-events-auto inline-flex items-center justify-center text-cream/50 hover:text-cream transition-colors animate-bob motion-reduce:animate-none p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60"
        >
          <ChevronDown size={26} />
        </button>
      </div>
    </section>
  );
};
