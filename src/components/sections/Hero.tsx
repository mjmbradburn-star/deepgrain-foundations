import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { PillButton } from "@/components/ui/PillButton";
import { AIOI_URL } from "@/lib/aioi";

// CSS-only entrance animations (see index.css .fade-in-up). Removing
// framer-motion from the Hero takes motion-vendor off the critical path.
export const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp"
        srcSet="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=55&fm=webp 400w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=640&q=55&fm=webp 640w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp 1200w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=60&fm=webp 1600w"
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
    </div>

    <div className="relative container-grain pt-32 pb-32 md:pt-40">
      <div className="relative max-w-2xl">
        <h1
          className="font-display font-semibold uppercase text-cream leading-[0.95] text-[56px] sm:text-[80px] md:text-[104px] lg:text-[120px] -mt-8 md:-mt-12"
          style={{ letterSpacing: "0.02em" }}
        >
          Work with<br />the grain.
        </h1>
        <p className="text-cream mt-10 max-w-[560px] text-xl md:text-2xl leading-snug font-medium">
          Every organisation has a grain. Most leaders are working against theirs without realising it... 
        </p>
        <p className="hidden md:block text-cream/75 mt-5 max-w-[520px] text-base md:text-lg leading-relaxed">
          We read yours, then build the strategy, the agentic systems, and the people who can keep evolving them.
        </p>
        <div className="fade-in-up fade-in-up-3 mt-10 flex flex-wrap items-center gap-6">
          <PillButton href={AIOI_URL} variant="filled" external>
            Take the AI Operating Index →
          </PillButton>
          <Link
            to="/method"
            className="font-sans text-sm uppercase text-cream/80 hover:text-cream transition-colors border-b border-cream/30 hover:border-cream pb-1"
            style={{ letterSpacing: "0.16em" }}
          >
            How we work
          </Link>
        </div>
      </div>
    </div>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/40 animate-bob">
      <ChevronDown size={28} />
    </div>
  </section>
);
