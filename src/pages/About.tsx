import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { BarkSection } from "@/components/ui/BarkSection";
import { Linkedin } from "lucide-react";
import matthewPortrait from "@/assets/matthew-bradburn.jpg";

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
    <PageMeta
      title="About Matthew Bradburn | Deepgrain"
      description="Matthew Bradburn leads Deepgrain. Background, philosophy, and references from founders and operators across AI-native, defence, fintech, transit, and climate companies."
      path="/about"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Matthew Bradburn",
          jobTitle: "Founder",
          worksFor: { "@type": "Organization", name: "Deepgrain" },
          url: "https://deepgrain.ai/about",
          email: "matt@deepgrain.ai",
        },
        buildBreadcrumbLd([
          { name: "Home", url: "https://deepgrain.ai/" },
          { name: "About", url: "https://deepgrain.ai/about" },
        ]),
      ]}
    />
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1600&q=70&fm=webp"
          alt=""
          width={1600}
          height={1067}
          loading="eager"
          fetchPriority="high"
          decoding="async"
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
                come apart.
              </p>
              <p>
                After enough of that,{" "}
                <strong className="font-semibold text-brass">
                  you read an organisation before the introductory call is over
                </strong>
                . It is{" "}
                <strong className="font-semibold text-brass">
                  pattern recognition built from real exposure
                </strong>
                , nothing more.
              </p>
              <p className="hidden md:block">
                Deepgrain exists because most consulting work is built to be
                seen. The carpenter builds furniture that fits the room and
                survives decades of use. Everyone else is building flat pack.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Bio — who Matthew is, in his own grain */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-6xl">
        <div className="grid gap-12 md:gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
          <ScrollReveal>
            <div className="relative">
              <div className="absolute -inset-3 md:-inset-4 rounded-[36px] bg-brass/15 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-walnut/15 shadow-[0_30px_80px_-30px_rgba(43,33,24,0.45)]">
                <img
                  src={matthewPortrait}
                  alt="Matthew Bradburn, founder of Deepgrain"
                  width={1920}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover aspect-[3/4] md:aspect-[4/5]"
                />
              </div>
              <a
                href="https://www.linkedin.com/in/mattbradburn/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-walnut hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 rounded"
              >
                <Linkedin size={16} aria-hidden />
                Matthew on LinkedIn
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <Eyebrow className="text-walnut/60 mb-6">Who runs this</Eyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-5xl lg:text-[60px] leading-[1.05] text-balance">
              Matthew Bradburn - Founder, Operator, Builder
            </h2>
            <div className="mt-8 space-y-5 text-body/85 leading-relaxed text-lg">
              <p>
                I&apos;ve built and rebuilt people ops and operating approaches,
                across companies from fifty to six hundred. Defence, climate,
                fintech, transit, health, legal, e-commerce. Different sectors,
                same underlying craft.
              </p>
              <p>
                I founded and exited People Collective, trained{" "}
                <strong className="font-semibold text-walnut">
                  1,000+ managers across 100+ cohorts
                </strong>
                , and have led PE and M&amp;A advisory work through to
                exit-ready outcomes. The work that travels best is the work
                that survives the carpenter leaving the room.
              </p>
              <p>
                Deepgrain is the consolidation of that practice. Strategy at
                the top, enablement and training across the team, agents and
                automations in the workflow &mdash; built function by function,
                top to bottom. We run the model on ourselves first, then bring
                it to clients who want something built to last.
              </p>
            </div>

            <BrassRule className="my-10" />

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
              {[
                { v: "20+", l: "Years inside operating teams" },
                { v: "100+", l: "Manager cohorts trained" },
                { v: "7", l: "Sectors of operating exposure" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display font-semibold text-brass text-4xl md:text-5xl leading-none">
                    {s.v}
                  </dt>
                  <dd className="mt-3 text-sm text-body/75 leading-snug">{s.l}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* The belief — moved here from the homepage so the line still lives somewhere */}
    <section className="bg-cream text-walnut py-24 md:py-32 border-y border-walnut/10">
      <div className="container-grain max-w-4xl text-center">
        <ScrollReveal>
          <Eyebrow className="text-walnut/60 mb-8">The belief</Eyebrow>
          <p
            className="font-display italic font-light text-walnut text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-tight text-balance"
            style={{ letterSpacing: "-0.01em" }}
          >
            &ldquo;Strategy at the top. Enablement and training across the team.
            Agents and automations in the workflow. Built function by function,
            top to bottom.&rdquo;
          </p>
        </ScrollReveal>
      </div>
    </section>

    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-[72px] leading-tight">
            We built the proof on ourselves.
          </h2>
          <div className="mt-10 space-y-5 text-body/85 leading-relaxed text-lg">
            <p>
              Deepgrain runs on agents we built for this work. Things that used
              to need a team of consultants now happen faster, with less
              overhead, and with the kind of precision people rarely get from a
              deck.
            </p>
            <p className="hidden md:block">
              We ran the model on our own operations first. Everything we
              recommend has been used in anger here before it reaches a client.
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

    <BarkSection
      className="section-pad"
      contentClassName="container-grain max-w-4xl"
    >
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
            {testimonials.map((t, i) => (
              <blockquote
                key={t.attribution}
                className={i >= 1 ? "hidden md:block" : undefined}
              >
                <p className="font-display italic text-2xl text-cream leading-snug">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-brass text-xs uppercase tracking-[0.15em]">
                  {t.attribution}
                </footer>
              </blockquote>
            ))}
          </div>
        </ScrollReveal>
    </BarkSection>
  </>
);

export default About;
