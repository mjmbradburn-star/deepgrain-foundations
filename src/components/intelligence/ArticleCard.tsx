import { Link } from "react-router-dom";
import type { Article } from "@/lib/intelligence";
import { CATEGORIES, getHeroImage } from "@/lib/intelligence";

interface ArticleCardProps {
  article: Article;
  variant?: "linen" | "green";
}

export const ArticleCard = ({ article, variant = "linen" }: ArticleCardProps) => {
  const { frontmatter: f } = article;
  const cat = CATEGORIES.find((c) => c.slug === f.category);
  const hero = getHeroImage(f.slug);

  const isGreen = variant === "green";

  return (
    <Link
      to={`/intelligence/${f.slug}`}
      className={`group block rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isGreen
          ? "bg-green text-cream hover:bg-green/90"
          : "bg-cream/60 hover:bg-cream border border-walnut/10"
      }`}
    >
      {hero && (
        <div className="aspect-[16/9] overflow-hidden bg-walnut/10">
          <picture>
            {hero.avif && <source type="image/avif" srcSet={hero.avif} />}
            {hero.webp && <source type="image/webp" srcSet={hero.webp} />}
            <img
              src={hero.src}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </picture>
        </div>
      )}
      <div className="flex flex-col h-full gap-6 p-8">
        <div className="flex items-center gap-3">
          <span
            className={`font-sans uppercase text-[10px] ${
              isGreen ? "text-brass" : "text-green/80"
            }`}
            style={{ letterSpacing: "0.16em" }}
          >
            {cat?.name}
          </span>
          <span className={`text-[10px] ${isGreen ? "text-cream/50" : "text-walnut/40"}`}>·</span>
          <span className={`text-[11px] ${isGreen ? "text-cream/60" : "text-walnut/50"}`}>
            {f.readTime}
          </span>
        </div>
        <h3
          className={`font-display text-2xl md:text-3xl leading-[1.15] flex-1 ${
            isGreen ? "text-cream" : "text-walnut"
          } group-hover:translate-x-1 transition-transform duration-300`}
          style={{ letterSpacing: "-0.005em" }}
        >
          {f.title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            isGreen ? "text-cream/75" : "text-walnut/70"
          }`}
        >
          {f.description}
        </p>
        <div
          className={`text-[11px] uppercase ${isGreen ? "text-brass" : "text-green"}`}
          style={{ letterSpacing: "0.14em" }}
        >
          Read →
        </div>
      </div>
    </Link>
  );
};
