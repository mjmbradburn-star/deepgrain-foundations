import { Link } from "react-router-dom";
import { getFeaturedArticles } from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Reveal } from "@/components/ui/Reveal";

export const IntelligenceTeaser = () => {
  const featured = getFeaturedArticles(3);
  if (featured.length === 0) return null;

  return (
    <section className="bg-linen py-24 md:py-40">
      <div className="container-grain">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <h2
                className="font-display text-3xl md:text-5xl lg:text-[3.25rem] text-walnut leading-[1.05]"
                style={{ letterSpacing: "-0.01em" }}
              >
                Practical essays on operating with AI, not around it.
              </h2>
            </div>
            <Link
              to="/intelligence"
              className="group inline-flex items-center gap-1 rounded-full border border-green/25 pl-5 pr-2 py-2 text-[11px] uppercase text-green transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-brass/40 hover:text-brass active:scale-[0.98]"
              style={{ letterSpacing: "0.14em" }}
            >
              Browse all intelligence
              <span
                aria-hidden
                className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green/[0.07] text-green transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-105 group-hover:bg-brass/10 group-hover:text-brass"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {featured.map((a, i) => (
            <Reveal
              key={a.frontmatter.slug}
              delay={i * 90}
              className={i >= 2 ? "hidden md:block" : undefined}
            >
              <ArticleCard article={a} variant={i === 0 ? "green" : "linen"} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
