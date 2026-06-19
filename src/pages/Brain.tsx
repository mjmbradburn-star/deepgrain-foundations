import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { brainCards } from "@/data/brainCards";
import matthewPortrait from "@/assets/matthew-bradburn.jpg";
import { BrainCaptureForm } from "@/components/forms/BrainCaptureForm";
import CoworkPreview from "@/components/brain/CoworkPreview";

/**
 * /brain — The People Ops AI Brain (lead capture).
 *
 * Phase 3: form is wired to the `send-brain-welcome` edge function.
 */

const FORM_TARGET_ID = "brain-capture-form";

const scrollToForm = () => {
  const el = document.getElementById(FORM_TARGET_ID);
  if (!el) return;
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "center",
  });
};

const Brain = () => (
  <>
    <PageMeta
      title="People Ops AI Brain: 9 Examples, 27 Guides"
      description="9 worked examples and 27 deep practical guides on running People functions with AI. Free with your email. One link, yours to keep."
      path="/brain"
      image="https://deepgrain.ai/og-brain.png"
      jsonLd={[
        buildBreadcrumbLd([
          { name: "Home", url: "https://deepgrain.ai/" },
          { name: "Brain", url: "https://deepgrain.ai/brain" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "The People Ops AI Brain",
          url: "https://deepgrain.ai/brain",
          description:
            "The most thorough collection of working notes on running People functions with AI. Free with your email. One link, yours to keep.",
          inLanguage: "en",
          isPartOf: {
            "@type": "WebSite",
            name: "Deepgrain",
            url: "https://deepgrain.ai",
          },
          author: {
            "@type": "Person",
            name: "Matthew Bradburn",
            url: "https://deepgrain.ai/about",
          },
          publisher: {
            "@type": "Organization",
            name: "Deepgrain",
            url: "https://deepgrain.ai",
          },
          potentialAction: {
            "@type": "SubscribeAction",
            target: "https://deepgrain.ai/brain#brain-capture-form",
            name: "Get the Brain",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Offer",
          name: "The People Ops AI Brain",
          description:
            "Free access to the People Ops AI Brain in exchange for an email address.",
          url: "https://deepgrain.ai/brain",
          price: "0",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          category: "Knowledge resource",
          seller: {
            "@type": "Organization",
            name: "Deepgrain",
            url: "https://deepgrain.ai",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: brainCards.map((card) => ({
            "@type": "Question",
            name: `${card.title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: card.blurb,
            },
          })),
        },
      ]}
    />

    {/* ───────── Section 1 — Hero (editorial, no photo) ───────── */}
    <section
      className="relative bg-green text-cream overflow-hidden"
      data-no-rule
    >

      <div className="container-grain pt-32 pb-14 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-14 lg:gap-20 items-start">
          <div className="max-w-4xl">
            <div className="flex items-center gap-5 mb-10">
              <Eyebrow className="text-brass">THE BRAIN</Eyebrow>
              <span className="hidden sm:inline-block h-px flex-1 bg-cream/15" />
              <span
                className="hidden sm:inline-flex font-sans uppercase text-[11px] text-cream/60"
                style={{ letterSpacing: "0.18em" }}
              >
                A LIVING BOOK
              </span>
            </div>

            <h1
              className="font-display font-semibold text-cream leading-[0.92] text-[2.75rem] sm:text-6xl md:text-[80px] lg:text-[96px] xl:text-[112px]"
              style={{ letterSpacing: "-0.01em" }}
            >
              The People<br />Ops AI<br />Brain.
            </h1>

            <p className="mt-10 max-w-2xl text-brass text-3xl md:text-4xl lg:text-5xl leading-snug font-medium">
              The most thorough working file on running People functions
              with AI. Twenty-seven guides. One link, yours
              to keep.
            </p>

            <BrassRule className="mt-12 mb-10 max-w-2xl" />

            {/* Form card — cream artefact sitting on the dark ground */}
            <div className="max-w-2xl rounded-3xl border border-brass/30 bg-cream/[0.06] backdrop-blur-sm p-7 md:p-10">
              <p
                className="font-sans uppercase text-[11px] text-brass mb-6"
                style={{ letterSpacing: "0.18em" }}
              >
                Send it to me
              </p>
              <BrainCaptureForm
                formId={FORM_TARGET_ID}
                variant="dark"
                size="lg"
              />
              <p className="mt-7 text-cream/60 text-xs max-w-md leading-relaxed">
                One email. The link is permanent. We don&apos;t share,
                sell, or sync your address anywhere.
              </p>
            </div>

            <p
              className="mt-10 text-cream/65 text-xs uppercase max-w-xl leading-relaxed"
              style={{ letterSpacing: "0.16em" }}
            >
              Read by heads of People at Series B SaaS, defence tech, and
              founder-led services firms.
            </p>
          </div>

          {/* Desktop meta rail */}
          <aside className="hidden lg:flex flex-col gap-8 pt-4 pr-2 text-cream/70 min-w-[170px]">
            {[
              ["\n", "\n"],
              ["Updated", "Monthly"],
              ["\n", "\n"],
              ["\n", "\n"],
            ].map(([label, value], i) => (
              <div key={i}>
                <p
                  className="font-sans uppercase text-[10px] text-cream/50"
                  style={{ letterSpacing: "0.2em" }}
                >
                  {label}
                </p>
                <p className="font-display text-cream text-2xl mt-1">
                  {value}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>

    {/* ───────── Section 2 — Sample article (flipbook, lifted) ───────── */}
    <section className="bg-green text-cream py-16 md:py-20 overflow-hidden">
      <div className="container-grain">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <Eyebrow withRule className="text-brass mb-6 justify-center inline-flex">
              A taste from inside · Piece 05 of 27
            </Eyebrow>
            <h2 className="font-display text-cream text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-balance">
              Read one of the pieces.
            </h2>
            <p className="mt-6 text-cream/80 leading-relaxed max-w-xl mx-auto">
              <span className="text-brass">Claude Cowork for People Teams.</span>{" "}
              The desktop AI that does the work while you live your life.
              Twelve pages, straight from inside the Brain.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={120}>
          <div className="mt-12 md:mt-16 max-w-5xl mx-auto">
            <CoworkPreview />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <p className="mt-12 text-center text-cream/70 max-w-xl mx-auto leading-relaxed">
            If this is the shape of the thinking, the rest is yours for
            an email.{" "}
            <button
              type="button"
              onClick={scrollToForm}
              className="text-brass underline underline-offset-4 hover:text-cream transition-colors"
            >
              Send me the Brain →
            </button>
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* ───────── Section 3 — What's Inside ───────── */}
    <section
      id="brain-whats-inside"
      className="bg-linen text-body py-20 md:py-28 lg:py-32"
    >
      <div className="container-grain">
        <ScrollReveal>
          <Eyebrow withRule className="text-body/70 mb-6">
            What&apos;s inside
          </Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-3xl text-balance">
            9 examples. 27 deep practical guides.
          </h2>
          <p className="mt-6 max-w-2xl text-body/75 leading-relaxed">
            Each one starts with a real problem and ends with what we&apos;d keep.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {brainCards.map((card, i) => (
            <ScrollReveal key={card.number} delay={i * 60}>
              <article className="h-full bg-cream rounded-3xl p-8 md:p-9 border border-linen-dark hover:border-brass/50 transition-colors flex flex-col">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-brass text-2xl">
                    {card.number}
                  </p>
                  <span
                    className="font-sans uppercase text-[10px] text-body/60 px-2.5 py-1 rounded-full border border-walnut/15"
                    style={{ letterSpacing: "0.16em" }}
                  >
                    {card.layer}
                  </span>
                </div>
                <BrassRule className="mt-4 mb-5" />
                <h3 className="font-display text-walnut text-2xl md:text-[28px] leading-[1.15] text-balance">
                  {card.title}
                </h3>
                <p className="mt-4 text-body/75 text-sm leading-relaxed">
                  {card.blurb}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* ───────── Section 4 — Author ───────── */}
    <section className="bg-walnut text-cream py-20 md:py-28">
      <div className="container-grain">
        <div className="grid gap-12 md:gap-16 md:grid-cols-[5fr_7fr] items-start">
          <ScrollReveal>
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-brass/15 bg-bark">
              <img
                src={matthewPortrait}
                alt="Matthew Bradburn, founder of Deepgrain"
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <Eyebrow withRule className="text-brass mb-6">
              Who wrote this
            </Eyebrow>
            <h2 className="font-display text-cream text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-balance">
              Matthew Bradburn.
            </h2>
            <div className="mt-8 space-y-5 text-cream/80 leading-relaxed max-w-xl">
              <p>
                Two decades inside companies, building People functions,
                fixing them. The kind of exposure that turns instinct into
                pattern.
              </p>
              <p>
                The Brain is the working file: what we&apos;ve actually tried,
                what works, and the systems we&apos;d keep if we were starting
                from scratch tomorrow.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "20+ yrs People Ops",
                "AI-native operators",
                "Founder-tested",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center px-4 py-2 rounded-full border border-brass/60 text-brass text-xs uppercase"
                  style={{ letterSpacing: "0.16em" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* ───────── Section 5 — Second CTA ───────── */}
    <section className="relative bg-green text-cream py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(92deg, hsl(var(--cream) / 0.6) 0 1px, transparent 1px 9px)",
        }}
      />
      <div className="relative container-grain max-w-2xl text-center">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-6 justify-center inline-flex">
            Take it with you
          </Eyebrow>
          <h2 className="font-display text-cream text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance">
            One link. Yours to keep.
          </h2>
          <p className="mt-6 text-cream/75 leading-relaxed max-w-lg mx-auto">
            Drop your email and we&apos;ll send the Brain straight back. No
            sequence, no funnel, no follow-up unless you ask.
          </p>

          <BrassRule className="mx-auto my-10" />

          <div className="flex justify-center">
            <BrainCaptureForm formId={`${FORM_TARGET_ID}-secondary`} />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "No spam, ever",
              "Unsubscribe in one click",
              "EU-region storage",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-4 py-2 rounded-full border border-brass/50 text-cream/80 text-xs uppercase"
                style={{ letterSpacing: "0.16em" }}
              >
                {label}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default Brain;
