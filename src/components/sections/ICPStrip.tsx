/**
 * ICP qualifier section. Sits directly under the Hero so the right person
 * thinks "yes, this is me" — and the wrong fit moves on.
 *
 * Three lines: who → where → the problem we partner on.
 */
export const ICPStrip = () => (
  <section className="bg-walnut text-cream border-y border-brass/25">
    <div className="container-grain py-10 md:py-14 text-center">
      {/* Line 1 — Who */}
      <p className="font-display font-medium leading-tight text-cream text-2xl md:text-[32px] lg:text-[38px] max-w-3xl mx-auto text-balance">
        <span className="text-brass">For</span>{" "}
        CEOs, COOs, CFOs, Chief People Officers, and VPs of Operations.{" "}
        <span className="text-brass">VC, PE-backed, and bootstrapped.</span>
      </p>

      {/* Hairline divider */}
      <div
        aria-hidden
        className="mx-auto mt-6 md:mt-7 h-px w-12 bg-brass/30"
      />

      {/* Line 2 — Where */}
      <p
        className="mt-5 font-sans text-[12px] md:text-[13px] uppercase text-cream/65 max-w-2xl mx-auto leading-relaxed"
        style={{ letterSpacing: "0.18em" }}
      >
        AI-native, defence, financial services, healthcare, climate, mobility,
        and the long tail of real businesses in between.
      </p>

      {/* Line 3 — Problem + partnership */}
      <p className="mt-8 md:mt-10 text-base md:text-lg leading-relaxed text-cream/85 max-w-2xl mx-auto text-balance">
        Your workflows are messy and the AI conversation has outpaced your
        operating reality. Deepgrain partners with you across{" "}
        <strong className="font-semibold text-brass">
          three levels of change
        </strong>
        : organisation, function, and individual capability. The strategy, the
        agentic systems, and the people who can keep evolving them.
      </p>
    </div>
  </section>
);
