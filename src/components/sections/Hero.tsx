import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
});

export const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    {/* Forest backdrop */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-green/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-green/80 via-green/40 to-transparent" />
    </div>

    <div className="relative container-grain pt-32 pb-32 md:pt-40">
      <div className="max-w-2xl">
        <motion.div {...stagger(0)}>
          <Eyebrow className="text-cream/70 mb-8">Organisational Consultancy</Eyebrow>
        </motion.div>
        <motion.h1
          {...stagger(1)}
          className="font-display font-semibold uppercase text-cream leading-[0.95] text-[64px] sm:text-[88px] md:text-[120px] lg:text-[140px]"
          style={{ letterSpacing: "0.02em" }}
        >
          Work with<br />the grain.
        </motion.h1>
        <motion.p
          {...stagger(2)}
          className="text-cream/85 mt-10 max-w-[480px] text-lg leading-relaxed"
        >
          Every organisation has a grain. The real pattern of how work flows,
          where decisions actually get made, where friction forms before it
          shows on a dashboard. Most have never read it.
        </motion.p>
        <motion.div {...stagger(3)} className="mt-12">
          <PillButton href="/method" variant="outline">
            How we work →
          </PillButton>
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/40 animate-bob">
      <ChevronDown size={28} />
    </div>
  </section>
);
