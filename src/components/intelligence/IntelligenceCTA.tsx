import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { AssessmentLadder } from "@/components/sections/AssessmentLadder";
import { cn } from "@/lib/utils";

interface IntelligenceCTAProps {
  className?: string;
}

/**
 * The single closing CTA for every Intelligence page (hub, Pillars, Pillar,
 * Category, Cluster, Glossary). Extracted from Intelligence.tsx so every one
 * of these pages ends on the paid Grain Audit plus the free readiness rung,
 * instead of dead-ending on a list of links.
 */
export const IntelligenceCTA = ({ className }: IntelligenceCTAProps) => (
  <section className={cn("relative bg-green text-cream section-pad overflow-hidden", className)}>
    <TopoBackdrop variant="basin" opacity={0.16} />
    <div className="relative container-grain max-w-2xl">
      <h2 className="font-display text-3xl md:text-5xl leading-[1.08] max-w-xl">
        Reading is one thing. Doing is another.
      </h2>
      <p className="mt-6 max-w-xl text-cream/75 leading-relaxed">
        The Grain Audit maps one People Ops process end to end, ranks the highest-return
        automations, and hands you a 90-day plan you keep whether or not we work together.
        Two weeks. £2,000, credited in full against a programme. Three slots a month.
      </p>
      <Link
        to="/grain-audit"
        onClick={() =>
          track("cta_click", {
            cta_id: "audit_intel_cta",
            cta_location: "intel_cta",
            cta_label: "Book a Grain Audit",
            link_url: "/grain-audit",
          })
        }
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 font-sans text-sm tracking-wider text-green transition-all duration-300 hover:bg-cream/90"
      >
        Book a Grain Audit
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </Link>
      <AssessmentLadder
        variant="inline"
        tone="green"
        tools={["readiness"]}
        ctaLocation="intel_cta"
        className="mt-6"
      />
    </div>
  </section>
);
