import { Link } from "react-router-dom";
import { PillButton } from "@/components/ui/PillButton";

// Inline chevron-down SVG. Avoids pulling the lucide-react barrel into the
// LCP component's chunk; tree-shaking helps in prod, but excluding it from
// the eager Hero path is a guaranteed win for FCP/LCP everywhere.
const ChevronDown = ({ size = 28 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);


// CSS-only entrance animations (see index.css .fade-in-up). Removing
// framer-motion from the Hero takes motion-vendor off the critical path.
export const Hero = () => (
  <section className="relative min-h-[70vh] sm:min-h-screen flex items-center overflow-hidden" id="hero" data-no-rule>
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=40&fm=webp"
        srcSet="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=40&fm=webp 400w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=640&q=40&fm=webp 640w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=40&fm=webp 1200w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=45&fm=webp 1600w"
        sizes="100vw"
        alt=""
        width={1600}
        height={1067}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-green/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-green/70 via-green/30 to-transparent" />
      {/* Ambient wood-grain drift - purely decorative, GPU transform only. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05] hero-drift mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(92deg, hsl(var(--cream) / 0.6) 0 1px, transparent 1px 7px), repeating-linear-gradient(88deg, hsl(var(--brass) / 0.4) 0 1px, transparent 1px 13px)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>

    <div className="relative container-grain pt-28 pb-20 sm:pt-32 sm:pb-32 md:pt-40">
      <div className="relative max-w-2xl">
        <h1
          className="font-display font-semibold uppercase text-cream leading-[0.95] text-[2.25rem] xs:text-[2.5rem] sm:text-[80px] md:text-[104px] lg:text-[120px] -mt-4 sm:-mt-8 md:-mt-12"
          style={{ letterSpacing: "0.02em" }}
        >
          Work with<br />the grain.
        </h1>
        <p className="text-cream mt-6 sm:mt-10 max-w-[560px] text-lg sm:text-xl md:text-2xl leading-snug font-medium">
          We audit how your organisation actually operates, then build the AI systems and team capability to scale it.
        </p>
        <p className="hidden md:block text-cream/75 mt-5 max-w-[560px] text-base md:text-lg leading-relaxed">
          Every organisation has a grain. Most leaders are working against theirs without realising it.
        </p>
        <div className="fade-in-up fade-in-up-3 mt-6 sm:mt-10 flex flex-wrap items-center gap-3 md:gap-4">
          <PillButton href="/contact" variant="filled" cta="book_audit" ctaLocation="hero">
            Book an audit →
          </PillButton>
          <PillButton href="/method" variant="outline" cta="see_method" ctaLocation="hero">
            See the method →
          </PillButton>
        </div>
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none">
      <button
        type="button"
        onClick={() => {
          const hero = document.getElementById("hero");
          const next = hero?.nextElementSibling as HTMLElement | null;
          const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";
          if (next) {
            next.scrollIntoView({ behavior, block: "start" });
          } else {
            window.scrollTo({ top: window.innerHeight, behavior });
          }
        }}
        aria-label="Scroll to next section"
        className="pointer-events-auto inline-flex items-center justify-center text-cream/50 hover:text-cream transition-colors animate-bob motion-reduce:animate-none p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60"
      >
        <ChevronDown size={28} />
      </button>
    </div>
  </section>
);
