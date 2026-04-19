import { Link } from "react-router-dom";
import { getFeaturedArticles } from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const IntelligenceTeaser = () => {
  const featured = getFeaturedArticles(3);
  if (featured.length === 0) return null;

  return (
    <section className="bg-linen py-24 md:py-36">
      <div className="container-grain">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <Eyebrow>Deepgrain Intelligence</Eyebrow>
              <h2
                className="font-display text-4xl md:text-5xl lg:text-[3.25rem] text-walnut leading-[1.05] mt-4"
                style={{ letterSpacing: "-0.01em" }}
              >
                Essays on operating with the grain.
              </h2>
            </div>
            <Link
              to="/intelligence"
              className="text-[11px] uppercase text-green hover:text-brass transition-colors"
              style={{ letterSpacing: "0.14em" }}
            >
              Browse all intelligence →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((a, i) => (
            <ScrollReveal key={a.frontmatter.slug} delay={i * 0.08}>
              <ArticleCard article={a} variant={i === 0 ? "green" : "linen"} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
