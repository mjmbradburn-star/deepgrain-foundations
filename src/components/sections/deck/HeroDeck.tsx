import { Link } from "react-router-dom";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
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
      "I'd like a 30-minute audit. The workflow I'd most like to fix is:",
    );
  const onAudit = () =>
    track("cta_click", {
      cta_id: "audit_home_hero",
      cta_location: "hero",
      cta_label: "Book a 30-minute audit",
      link_url: auditHref,
    });
  return (
    <section
      className="relative bg-green text-cream overflow-hidden min-h-[88vh] md:min-h-screen flex items-center"
      id="hero"
      data-no-rule
    >
      <TopoBackdrop variant="ridge" opacity={0.32} />
      <div className="absolute inset-0 bg-gradient-to-r from-green/95 via-green/70 to-transparent pointer-events-none" />

      <div className="relative container-grain pt-32 pb-24 md:pt-40 md:pb-32 w-full">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <SectionEyebrow>Deepgrain · An operating consultancy</SectionEyebrow>
          <span
            className="hidden md:inline font-sans uppercase text-cream/40"
            style={{ fontSize: "11px", letterSpacing: "0.25em" }}
          >
            For G&amp;A leaders
          </span>
        </div>

        <div className="max-w-3xl fade-in-up fade-in-up-1">
          <p className="text-cream/70 text-sm md:text-base mb-4">
          </p>
          <h1
            className="font-display font-medium uppercase text-cream leading-[0.95] text-[2.5rem] sm:text-[64px] md:text-[96px] lg:text-[120px]"
            style={{ letterSpacing: "0.01em" }}
          >
            From the role
            <br />
            to the click.
          </h1>
          <p className="font-display italic text-cream/85 mt-8 max-w-xl text-xl md:text-3xl leading-snug">
            We Audit, deepdive into the operating model, workflows, then rebuild for what's coming next.
          </p>
        </div>

        <div className="fade-in-up fade-in-up-2 mt-10 flex flex-wrap gap-2.5">
          <Pip icon="◎" label="Strategic" />
          <Pip icon="⌥" label="Functional" />
          <Pip icon="◯" label="Individual" />
        </div>

        <div className="fade-in-up fade-in-up-3 mt-12 flex flex-wrap items-center gap-4">
          <Link
            to={auditHref}
            onClick={onAudit}
            className="group inline-flex items-center gap-2 rounded-full bg-cream text-green px-9 py-4 font-sans text-sm tracking-wider hover:bg-cream/90 transition-all"
          >
            Book a 30-minute audit
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/method"
            className="inline-flex items-center gap-2 rounded-full border border-cream/40 text-cream px-7 py-4 font-sans text-sm tracking-wider hover:bg-cream/10 transition-all"
          >
            See the method →
          </Link>
        </div>

        <div className="hidden md:flex absolute bottom-10 left-0 right-0 container-grain items-center justify-between text-cream/40 font-sans uppercase" style={{ fontSize: "10px", letterSpacing: "0.25em" }}>
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
