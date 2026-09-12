import { Link } from "react-router-dom";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { track } from "@/lib/analytics";

/**
 * Time-bound cohort announcement for the home page. A quiet news band, not a
 * second sales pitch: mono date label (stage-numeral treatment, outside the
 * page's two-eyebrow budget), one display line, one italic line, one outline
 * CTA. The filled cream pill stays exclusive to the Grain Audit, so the
 * consultancy's primary CTA keeps its primacy on every surface.
 */
export const CohortBand = () => (
  <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
    <BarkGrain />
    <div className="relative z-10 container-grain py-16 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div>
          <p
            className="font-mono uppercase text-brass"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            Cohort one · starts Monday 12 October
          </p>
          <h2
            className="font-display font-semibold text-cream mt-5 max-w-2xl"
            style={{ fontSize: "clamp(28px, 3.6vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.01em" }}
          >
            The Deepgrain AI Cohort for People Teams
          </h2>
          <p className="font-display italic text-cream/75 mt-4 max-w-xl text-lg md:text-xl leading-snug">
            Four weeks, live. Ship three working automations on your own processes, and leave with
            a 90-day rollout plan.
          </p>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-4">
          <Link
            to="/waitlist"
            onClick={() =>
              track("cta_click", {
                cta_id: "cohort_home_band",
                cta_location: "home_cohort_band",
                cta_label: "Join the waitlist",
                link_url: "/waitlist",
              })
            }
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-cream/80 bg-transparent text-cream px-8 py-3.5 font-sans text-sm tracking-wider transition-colors duration-300 hover:bg-cream hover:text-green"
          >
            Join the waitlist
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <p className="font-sans text-cream/60 text-sm">£495 waitlist price · 20 seats</p>
        </div>
      </div>
    </div>
  </section>
);
