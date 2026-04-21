/**
 * ICP qualifier section. Sits directly under the Hero so the right person
 * thinks "yes, this is me" — and the wrong fit moves on.
 *
 * Three lines: who → where → the problem we partner on.
 */
export const ICPStrip = () => (
  <section className="bg-walnut text-cream border-y border-brass/25">
    <div className="container-grain py-10 md:py-14 text-center">
      {/* Line 1 — Who: roles + company types as two simple columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-3xl mx-auto items-start">
        <div>
          <p
            className="font-sans text-[11px] md:text-[12px] uppercase text-brass mb-3"
            style={{ letterSpacing: "0.18em" }}
          >
            Roles
          </p>
          <p className="font-display font-medium leading-tight text-cream text-xl md:text-[26px] lg:text-[30px] text-balance">
            CEOs, COOs, CFOs, Chief People Officers, and VPs of Operations.
          </p>
        </div>
        <div>
          <p
            className="font-sans text-[11px] md:text-[12px] uppercase text-brass mb-3"
            style={{ letterSpacing: "0.18em" }}
          >
            Company types
          </p>
          <p className="font-display font-medium leading-tight text-cream text-xl md:text-[26px] lg:text-[30px] text-balance">
            VC, PE-backed, and bootstrapped.
          </p>
        </div>
      </div>

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
