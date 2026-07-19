import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { brainCards } from "@/data/brainCards";
import matthewPortrait from "@/assets/matthew-bradburn.jpg";
import { BrainCaptureForm } from "@/components/forms/BrainCaptureForm";
import CoworkPreview from "@/components/brain/CoworkPreview";
import { AssessmentLadder } from "@/components/sections/AssessmentLadder";

/**
 * /brain - The People Ops AI Brain (lead capture).
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
      image="https://www.deepgrain.ai/og-brain.png"
      jsonLd={[
        buildBreadcrumbLd([
          { name: "Home", url: "https://www.deepgrain.ai/" },
          { name: "Brain", url: "https://www.deepgrain.ai/brain" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "The People Ops AI Brain",
          url: "https://www.deepgrain.ai/brain",
          description:
            "The most thorough collection of working notes on running People functions with AI. Free with your email. One link, yours to keep.",
          inLanguage: "en",
          isPartOf: {
            "@type": "WebSite",
            name: "Deepgrain",
            url: "https://www.deepgrain.ai",
          },
          author: {
            "@type": "Person",
            name: "Matthew Bradburn",
            url: "https://www.deepgrain.ai/about",
          },
          publisher: {
            "@type": "Organization",
            name: "Deepgrain",
            url: "https://www.deepgrain.ai",
          },
          potentialAction: {
            "@type": "SubscribeAction",
            target: "https://www.deepgrain.ai/brain#brain-capture-form",
            name: "Get the Brain",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Offer",
          name: "The People Ops AI Brain",
          description:
            "Free access to the People Ops AI Brain in exchange for an email address.",
          url: "https://www.deepgrain.ai/brain",
          price: "0",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          category: "Knowledge resource",
          seller: {
            "@type": "Organization",
            name: "Deepgrain",
            url: "https://www.deepgrain.ai",
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

    {/* ───────── Section 1 - Hero (editorial, no photo) ───────── */}
    <section
      className="relative bg-green text-cream overflow-hidden"
      data-no-rule
    >
      {/* faint vertical brass hairline, right edge, desktop only */}
      <div
        aria-hidden
        className="hidden lg:block absolute top-0 bottom-0 right-[8%] w-px bg-brass/25"
      />

      <div className="container-grain pt-32 pb-14 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20">
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

          <p className="mt-10 max-w-2xl text-cream/85 text-xl md:text-2xl leading-snug font-medium">
            The most thorough working file on running People functions
            with AI. Twenty-seven guides. One link, yours
            to keep.
          </p>

          <BrassRule className="mt-12 mb-10 max-w-2xl" />

          {/* Form card - cream artefact sitting on the dark ground */}
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
              The link is permanent, updated monthly. We don&apos;t share,
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
      </div>
    </section>

    {/* ───────── Section 2 - Sample article (flipbook, lifted) ───────── */}
    <section className="bg-green text-cream py-16 md:py-20 overflow-hidden">
      <div className="container-grain">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display text-cream text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-balance">
              Read one of the pieces.
            </h2>
            <p className="mt-6 text-cream/80 leading-relaxed max-w-xl mx-auto">
              <span className="text-brass">Claude Cowork for People Teams.</span>{" "}
              Piece 06 of 27, straight from inside the Brain. The desktop
              AI that does the work while you live your life, in twelve
              pages.
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

    {/* ───────── Section 3 - What's Inside ───────── */}
    <section
      id="brain-whats-inside"
      className="bg-linen text-body py-20 md:py-28 lg:py-32"
    >
      <div className="container-grain">
        <ScrollReveal>
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
                    className="font-sans uppercase text-[10px] text-brass/80"
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
                {card.number === "05" && (
                  <Link
                    to="/readiness"
                    className="group mt-5 inline-flex items-center gap-1.5 font-sans text-sm tracking-wider text-walnut/80 underline-offset-4 hover:text-walnut hover:underline"
                  >
                    Try the Readiness Assessment
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* ───────── Section 4 - Author ───────── */}
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

            <p
              className="mt-10 font-sans uppercase text-xs text-brass/80"
              style={{ letterSpacing: "0.16em" }}
            >
              20+ yrs People Ops · AI-native operators · Founder-tested
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* ───────── Section 5 - Second CTA ───────── */}
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

          <div className="mt-10">
            <AssessmentLadder
              variant="inline"
              tone="bark"
              tools={["readiness", "exposure"]}
              ctaLocation="brain_closing"
              className="justify-center text-center"
            />
          </div>

          <p className="mt-6">
            <Link
              to="/grain-audit"
              className="group inline-flex items-center gap-1.5 font-sans text-sm tracking-wider text-cream/80 underline-offset-4 hover:text-cream hover:underline"
            >
              Rather talk it through first? Book a Grain Audit.
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </p>

          <p
            className="mt-10 font-sans uppercase text-xs text-cream/70"
            style={{ letterSpacing: "0.16em" }}
          >
            No spam, ever · Unsubscribe in one click · EU-region storage
          </p>
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default Brain;
