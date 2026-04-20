import { ChevronDown } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { AIOI_URL } from "@/lib/aioi";

// CSS-only entrance animations (see index.css .fade-in-up). Removing
// framer-motion from the Hero takes motion-vendor off the critical path.
export const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp"
        srcSet="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=640&q=55&fm=webp 640w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp 1200w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=60&fm=webp 1600w"
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
          className="fade-in-up fade-in-up-1 font-display font-semibold uppercase text-cream leading-[0.95] text-[56px] sm:text-[80px] md:text-[104px] lg:text-[120px] -mt-8 md:-mt-12"
          style={{ letterSpacing: "0.02em" }}
        >
          Work with<br />the grain.
        </h1>
        <p className="fade-in-up fade-in-up-2 text-cream/85 mt-10 max-w-[480px] text-lg leading-relaxed">
          Every organisation has a grain. The real pattern of how work flows,
          where decisions actually get made, where friction forms before it
          shows on a dashboard. Most have never read it.
        </p>
        <div className="fade-in-up fade-in-up-3 mt-12 flex flex-wrap gap-4">
          <PillButton href="/method" variant="outline">
            How we work →
          </PillButton>
          <PillButton href={AIOI_URL} variant="outline" external>
            Take the AI Operating Index →
          </PillButton>
        </div>
      </div>
    </div>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/40 animate-bob">
      <ChevronDown size={28} />
    </div>
  </section>
);
