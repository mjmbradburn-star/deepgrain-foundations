import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";

const testimonials = [
  {
    quote:
      "Growing and scaling successfully rests on how you bring in and manage people. Matt provides the guidance every startup needs.",
    attribution: "George Dunning, Founder, Bud Financial",
  },
  {
    quote:
      "Matt has always been my go to advisor. At Multiverse they helped us accelerate hiring and introduce a progression framework that supported our team's development.",
    attribution: "Sophie Adelman, Founder, Multiverse",
  },
];

const About = () => (
  <>
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=2400&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green/60" />
      </div>
      <div className="relative container-grain pb-20 md:pb-32 pt-40 max-w-5xl">
        <div className="relative bg-walnut/88 backdrop-blur-sm rounded-[48px] md:rounded-[72px] p-10 md:p-16 border border-brass/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
          <ScrollReveal>
            <Eyebrow className="text-brass mb-6">About</Eyebrow>
            <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[96px] leading-[1.02] max-w-4xl text-balance">
              The grain is always there. Most have never looked for it.
            </h1>
            <div className="mt-10 max-w-xl text-cream/85 space-y-5 leading-relaxed">
              <p>
                I&apos;ve spent two decades inside organisations. Building them,
                fixing them, watching what makes them hold and what makes them
                split at the seams.
              </p>
              <p>
                At a certain point you have read enough grain to know what an
                organisation is doing before most people have finished the
                introductory call. That&apos;s not a methodology. It&apos;s pattern
                recognition built from real exposure.
              </p>
              <p>
                Deepgrain exists because most consulting work is designed to be
                seen, not to last. The carpenter builds furniture that fits the
                room and survives decades of use. Everyone else is building
                flat pack.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight">
            We built the proof of concept on ourselves.
          </h2>
          <div className="mt-10 space-y-5 text-body/85 leading-relaxed text-lg">
            <p>
              Deepgrain runs on agents designed specifically for this work.
              What once required a team of consultants now happens faster, with
              more precision, and with less overhead.
            </p>
            <p>
              This isn&apos;t a claim about what&apos;s possible. It&apos;s the model built,
              tested, and run on our own operations before recommending it to
              anyone else.
            </p>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3 border-t border-walnut/15 pt-10">
            {[
              { v: "125+", l: "Workflows processed this month" },
              { v: "50%", l: "Handled end to end by agents" },
              { v: "Same day", l: "From 7 days to resolve" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none">{s.v}</div>
                <p className="mt-4 text-sm text-body/75">{s.l}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    <section className="bg-walnut text-cream section-pad">
      <div className="container-grain max-w-4xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-6">Track record</Eyebrow>
          <div className="space-y-4 text-cream/85 leading-relaxed text-lg">
            <p>1,000+ managers trained across 100+ cohorts.</p>
            <p>Clients from 50 to 600 people.</p>
            <p>Sectors include defence, climate, fintech, transit, health, legal, and e-commerce.</p>
            <p>Previously founded and exited People Collective.</p>
            <p>PE and M&amp;A advisory including exit readiness engagements.</p>
          </div>
          <BrassRule className="my-16" />
          <div className="grid md:grid-cols-2 gap-12">
            {testimonials.map((t) => (
              <blockquote key={t.attribution}>
                <p className="font-display italic text-2xl text-cream leading-snug">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-brass text-xs uppercase tracking-[0.15em]">
                  {t.attribution}
                </footer>
              </blockquote>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default About;
