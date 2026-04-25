import { ChevronDown } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { PillButton } from "@/components/ui/PillButton";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { brainCards } from "@/data/brainCards";
import matthewPortrait from "@/assets/matthew-bradburn.jpg";

/**
 * /brain — The People Ops AI Brain (lead capture).
 *
 * Phase 2: full visual composition. The capture form is a non-functional
 * placeholder (`<BrainCapturePlaceholder />`); backend wiring lands in Phase 3
 * via `<BrainCaptureForm />` + the `send-brain-welcome` edge function.
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

/**
 * Visual-only capture form. Identical markup to what Phase 3's
 * `<BrainCaptureForm />` will render in its idle state, so styling is final.
 */
const BrainCapturePlaceholder = ({
  variant = "dark",
  formId,
}: {
  variant?: "dark" | "light";
  formId?: string;
}) => {
  const isDark = variant === "dark";
  return (
    <form
      id={formId}
      aria-label="Subscribe to The People Ops AI Brain"
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-xl"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          autoComplete="given-name"
          placeholder="First name (optional)"
          className={
            isDark
              ? "flex-1 bg-transparent border-0 border-b border-cream/30 focus:border-cream/80 text-cream placeholder:text-cream/40 py-3 px-1 font-sans text-base focus:outline-none transition-colors"
              : "flex-1 bg-transparent border-0 border-b border-walnut/30 focus:border-walnut/80 text-walnut placeholder:text-walnut/40 py-3 px-1 font-sans text-base focus:outline-none transition-colors"
          }
        />
        <input
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className={
            isDark
              ? "flex-[1.3] bg-transparent border-0 border-b border-cream/30 focus:border-cream/80 text-cream placeholder:text-cream/40 py-3 px-1 font-sans text-base focus:outline-none transition-colors"
              : "flex-[1.3] bg-transparent border-0 border-b border-walnut/30 focus:border-walnut/80 text-walnut placeholder:text-walnut/40 py-3 px-1 font-sans text-base focus:outline-none transition-colors"
          }
        />
      </div>

      <label
        className={
          "mt-5 flex items-start gap-3 text-sm leading-relaxed cursor-pointer " +
          (isDark ? "text-cream/70" : "text-walnut/75")
        }
      >
        <input
          type="checkbox"
          className={
            "mt-1 h-4 w-4 rounded-sm border " +
            (isDark
              ? "border-cream/40 bg-transparent accent-brass"
              : "border-walnut/40 bg-transparent accent-brass")
          }
        />
        <span>
          Send me the Brain and occasional updates. I can unsubscribe any time.
        </span>
      </label>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled
          className={
            "font-sans uppercase text-[11px] px-7 py-3 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed " +
            (isDark
              ? "border-brass text-brass"
              : "border-walnut text-walnut")
          }
          style={{ letterSpacing: "0.16em" }}
        >
          Send me the Brain →
        </button>
        <span
          className={
            "text-xs " + (isDark ? "text-cream/40" : "text-walnut/50")
          }
        >
          Wiring lands in Phase 3
        </span>
      </div>
    </form>
  );
};

const Brain = () => (
  <>
    <PageMeta
      title="The People Ops AI Brain | Deepgrain"
      description="Twenty-plus articles on how People teams build with AI — hiring, onboarding, performance, comp, org design. Free with your email."
      path="/brain"
      jsonLd={buildBreadcrumbLd([
        { name: "Home", url: "https://deepgrain.ai/" },
        { name: "Brain", url: "https://deepgrain.ai/brain" },
      ])}
    />

    {/* ───────── Section 1 — Hero ───────── */}
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      data-no-rule
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=60&fm=webp"
          alt=""
          width={1600}
          height={1067}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-green/80 via-green/40 to-transparent" />
      </div>

      <div className="relative container-grain pt-32 pb-32 md:pt-40">
        <div className="max-w-3xl">
          <Eyebrow className="text-brass mb-8">The Brain</Eyebrow>
          <h1
            className="font-display font-semibold text-cream leading-[0.95] text-[2.75rem] sm:text-7xl md:text-[88px] lg:text-[104px]"
            style={{ letterSpacing: "0.01em" }}
          >
            The People<br />Ops AI<br />Brain.
          </h1>
          <p className="mt-10 max-w-xl text-cream text-xl md:text-2xl leading-snug font-medium">
            Twenty-plus articles on how People teams actually build with AI.
          </p>
          <p className="mt-5 max-w-lg text-cream/75 text-base md:text-lg leading-relaxed">
            Free with your email. No drip sequence, no upsell — one link,
            yours to keep.
          </p>

          <div className="mt-10">
            <BrainCapturePlaceholder />
          </div>

          <p className="mt-6 text-cream/55 text-xs max-w-md leading-relaxed">
            One email. The link is permanent. We don&apos;t share, sell, or
            sync your address anywhere.
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none">
        <button
          type="button"
          onClick={() => {
            const next = document.getElementById("brain-whats-inside");
            const prefersReducedMotion =
              typeof window !== "undefined" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            next?.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "start",
            });
          }}
          aria-label="Scroll to what's inside"
          className="pointer-events-auto inline-flex items-center justify-center text-cream/50 hover:text-cream transition-colors animate-bob motion-reduce:animate-none p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60"
        >
          <ChevronDown size={28} />
        </button>
      </div>
    </section>

    {/* ───────── Section 2 — What's Inside ───────── */}
    <section
      id="brain-whats-inside"
      className="bg-linen text-body py-20 md:py-28 lg:py-32"
    >
      <div className="container-grain">
        <ScrollReveal>
          <Eyebrow withRule className="text-walnut/70 mb-6">
            What&apos;s inside
          </Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-3xl text-balance">
            Nine working pieces. Written from the inside.
          </h2>
          <p className="mt-6 max-w-2xl text-body/75 leading-relaxed">
            Each one starts with a problem we&apos;ve hit ourselves, walks
            through what we tried, and ends with what we&apos;d keep.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {brainCards.map((card, i) => (
            <ScrollReveal key={card.number} delay={i * 60}>
              <article className="h-full bg-cream rounded-3xl p-8 md:p-9 border border-linen-dark hover:border-brass/50 transition-colors">
                <p className="font-display text-brass text-2xl">
                  {card.number}
                </p>
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

    {/* ───────── Section 3 — Sample Article ───────── */}
    <section className="bg-green text-cream py-24 md:py-32">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow withRule className="text-brass mb-6">
            A taste
          </Eyebrow>
          <h2 className="font-display text-cream text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Where AI actually belongs in People Ops.
          </h2>

          <div className="mt-10 space-y-6 text-cream/85 leading-relaxed text-lg">
            <p>
              Most People teams are being asked the same question right now:
              what should AI be doing here, and what should it stay out of?
              The honest answer is more interesting than the headline version.
            </p>
            <p>
              The work splits cleanly into three buckets. There&apos;s the
              throughput work — scheduling, scorecards, summaries — where AI
              earns its keep within a quarter. There&apos;s the judgment work
              — calibration, conflict, hiring decisions — where it should sit
              in the room but never hold the pen. And there&apos;s the
              relational work, where its presence is a tax, not a tool.
            </p>

            <div className="my-10 pl-6 border-l-2 border-brass">
              <p className="font-display italic text-cream text-2xl md:text-3xl leading-snug text-balance">
                The teams getting this right aren&apos;t the ones with the
                biggest stack. They&apos;re the ones with the clearest line
                between the three.
              </p>
            </div>

            <p>
              We walk through each bucket with the systems we&apos;ve built or
              torn out, the cost of getting the line wrong, and the questions
              we&apos;d ask before introducing a model into any People-facing
              workflow.
            </p>
          </div>

          <BrassRule className="mt-12 mb-10" />

          <div className="flex flex-wrap items-center gap-4">
            <PillButton onClick={scrollToForm} variant="outline">
              Read the full Brain →
            </PillButton>
            <span className="text-cream/55 text-sm">
              Eight more pieces like this inside.
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* ───────── Section 4 — Author ───────── */}
    <section className="bg-walnut text-cream py-20 md:py-28">
      <div className="container-grain">
        <div className="grid gap-12 md:gap-16 md:grid-cols-[5fr_7fr] items-start">
          <ScrollReveal>
            <div
              className="aspect-[4/5] rounded-3xl bg-bark border border-brass/15 overflow-hidden flex items-center justify-center"
              aria-label="Portrait of Matthew Bradburn"
            >
              <span className="font-display text-cream/30 text-sm uppercase tracking-[0.25em]">
                Portrait
              </span>
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
                Two decades inside companies — building People functions,
                fixing them, sitting in the rooms where the hard calls get
                made. Multiverse, Bud, defence, fintech, climate. The kind of
                exposure that turns instinct into pattern.
              </p>
              <p>
                The Brain is the working file: what we&apos;ve actually tried,
                what stuck, and the systems we&apos;d keep if we were starting
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
            Drop your email — we&apos;ll send the Brain straight back. No
            sequence, no funnel, no follow-up unless you ask.
          </p>

          <BrassRule className="mx-auto my-10" />

          <div className="flex justify-center">
            <BrainCapturePlaceholder formId={FORM_TARGET_ID} />
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
