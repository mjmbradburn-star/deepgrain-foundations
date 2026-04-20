/**
 * Slim ICP qualifier strip. Sits directly under the Hero so wrong-fit
 * visitors can self-disqualify and right-fit visitors lean in.
 */
export const ICPStrip = () => (
  <section className="bg-walnut text-cream border-y border-cream/10">
    <div className="container-grain py-5 md:py-6">
      <p
        className="font-sans text-[12px] md:text-[13px] uppercase text-cream/85 text-center leading-relaxed"
        style={{ letterSpacing: "0.14em" }}
      >
        <span className="text-brass">For</span>{" "}
        Series A–C founders, CPOs, and operating leaders
        <span className="hidden md:inline"> · </span>
        <span className="block md:inline mt-1 md:mt-0 text-cream/70">
          AI-native · Defence · Financial data · Transit &amp; mobility · Climate
        </span>
      </p>
    </div>
  </section>
);
