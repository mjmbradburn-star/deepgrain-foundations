import { PageMeta } from "@/components/seo/PageMeta";

/**
 * /brain — People Ops AI Brain lead capture.
 *
 * Phase 1 scaffold: route resolves and nav link works end-to-end.
 * Phase 2 will compose the six sections per the build brief.
 */
const Brain = () => (
  <main className="bg-green text-cream min-h-screen">
    <PageMeta
      title="The People Ops AI Brain | Deepgrain"
      description="Twenty-plus articles on how People teams build with AI. Free with your email."
      path="/brain"
    />
    <section className="container-grain pt-40 pb-32">
      <p className="font-sans uppercase tracking-[0.2em] text-brass text-xs">The Brain</p>
      <h1 className="font-display text-cream text-6xl md:text-8xl mt-6 leading-[0.95]">
        The People<br />Ops AI<br />Brain.
      </h1>
      <p className="mt-8 text-cream/70 max-w-xl">
        Page composition lands in Phase 2.
      </p>
    </section>
  </main>
);

export default Brain;
