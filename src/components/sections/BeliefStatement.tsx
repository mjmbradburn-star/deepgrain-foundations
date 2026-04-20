import { ScrollReveal } from "@/components/ui/ScrollReveal";
import bg800Avif from "@/assets/sections/belief-statement-800.avif";
import bg1200Avif from "@/assets/sections/belief-statement-1200.avif";
import bg800Webp from "@/assets/sections/belief-statement-800.webp";
import bg1200Webp from "@/assets/sections/belief-statement-1200.webp";

export const BeliefStatement = () => (
  <section className="relative section-pad overflow-hidden">
    <div className="absolute inset-0">
      <picture>
        <source
          type="image/avif"
          srcSet={`${bg800Avif} 800w, ${bg1200Avif} 1200w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${bg800Webp} 800w, ${bg1200Webp} 1200w`}
          sizes="100vw"
        />
        <img
          src={bg1200Webp}
          alt=""
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-walnut/85" />
    </div>
    <div className="relative container-grain text-center">
      <ScrollReveal>
        <p className="font-display italic font-light text-cream text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight max-w-4xl mx-auto text-balance">
          &ldquo;Every organisation has a grain.<br />Most have never read it.&rdquo;
        </p>
      </ScrollReveal>
    </div>
  </section>
);
