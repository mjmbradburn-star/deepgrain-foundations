import { forwardRef } from "react";
import { Link } from "react-router-dom";
import type { Article } from "@/lib/intelligence";
import { CATEGORIES, getHeroImage } from "@/lib/intelligence";

interface ArticleCardProps {
  article: Article;
  variant?: "linen" | "green";
}

/**
 * Trim copy to a character budget on a word boundary, appending an ellipsis.
 * Belt-and-braces with the CSS line-clamp below: guarantees the description
 * never exceeds ~2 lines of `text-[13px]` on any card width, regardless of
 * font metrics or future copy edits.
 */
const trimDescription = (text: string, max = 130): string => {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s,;:.\-—–]+$/, "") + "…";
};

export const ArticleCard = forwardRef<HTMLAnchorElement, ArticleCardProps>(
  ({ article, variant = "linen" }, ref) => {
    const { frontmatter: f } = article;
    const cat = CATEGORIES.find((c) => c.slug === f.category);
    const hero = getHeroImage(f.slug);
    const description = trimDescription(f.description);

    const isGreen = variant === "green";

    return (
      <Link
        ref={ref}
      to={`/intelligence/${f.slug}`}
      className={`group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
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
      <div className="flex flex-col flex-1 gap-2 px-4 py-4 md:gap-3 md:px-6 md:py-5">
        <div className="flex items-center gap-2 md:gap-3">
          <span
            className={`font-sans uppercase text-[9px] md:text-[10px] ${
              isGreen ? "text-brass" : "text-green/80"
            }`}
            style={{ letterSpacing: "0.16em" }}
          >
            {cat?.name}
          </span>
          <span className={`text-[10px] ${isGreen ? "text-cream/50" : "text-walnut/40"}`}>·</span>
          <span className={`text-[10px] md:text-[11px] ${isGreen ? "text-cream/60" : "text-walnut/50"}`}>
            {f.readTime}
          </span>
        </div>
        <h3
          className={`font-display text-lg md:text-2xl leading-[1.15] line-clamp-2 [&]:min-h-[calc(2*1.15*1.125rem)] md:[&]:min-h-[calc(2*1.15*1.5rem)] ${
            isGreen ? "text-cream" : "text-walnut"
          }`}
          style={{ letterSpacing: "-0.005em" }}
        >
          {f.title}
        </h3>
        <p
          className={`text-[12px] md:text-[13px] leading-[1.5] md:leading-[1.55] line-clamp-2 ${
            isGreen ? "text-cream/75" : "text-walnut/70"
          }`}
        >
          {description}
        </p>
        <div
          className={`text-[10px] md:text-[11px] uppercase mt-auto pt-1 md:pt-2 ${isGreen ? "text-brass" : "text-green"}`}
          style={{ letterSpacing: "0.14em" }}
        >
          Read →
        </div>
        </div>
      </Link>
    );
  },
);
ArticleCard.displayName = "ArticleCard";

