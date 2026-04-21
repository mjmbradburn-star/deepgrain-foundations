import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type Track = "deepgrain" | "people-ops";

export type CategorySlug =
  // Deepgrain track
  | "foundations"
  | "ai-operating-systems"
  | "method-and-practice"
  | "sector-lenses"
  | "leadership-and-craft"
  // People Ops track
  | "people-ops-foundations"
  | "people-ops-systems"
  | "people-ops-builders"
  | "people-ops-governance";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  track: Track;
}

export const CATEGORIES: Category[] = [
  // Deepgrain
  { slug: "foundations", name: "Foundations", description: "First principles of organisational consultancy and the grain.", track: "deepgrain" },
  { slug: "ai-operating-systems", name: "AI & Operating Systems", description: "What an AI operating system is — and how to build one.", track: "deepgrain" },
  { slug: "method-and-practice", name: "Method & Practice", description: "Read · Craft · Scale: how the work is done.", track: "deepgrain" },
  { slug: "sector-lenses", name: "Sector Lenses", description: "Operating consultancy applied to specific industries.", track: "deepgrain" },
  { slug: "leadership-and-craft", name: "Leadership & Craft", description: "The disciplines of operating leadership.", track: "deepgrain" },
  // People Ops
  { slug: "people-ops-foundations", name: "Foundations", description: "From AI dabbling to systematic People Ops capability.", track: "people-ops" },
  { slug: "people-ops-systems", name: "Systems & Automation", description: "Connected systems, agents, and the mechanics of leverage.", track: "people-ops" },
  { slug: "people-ops-builders", name: "Builders & Champions", description: "Growing internal capability instead of buying tools.", track: "people-ops" },
  { slug: "people-ops-governance", name: "Governance & Trust", description: "Working with AI without trading away judgment.", track: "people-ops" },
];

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  category: CategorySlug;
  description: string;
  keywords: string[];
  readTime: string;
  publishedAt: string;
  author: string;
  featured?: boolean;
  track?: Track;
  heroImage?: string;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  /** Lazy-loaded MDX component — only fetched when an article page renders. */
  Component: LazyExoticComponent<ComponentType>;
}

import { FRONTMATTERS, LOADERS } from "virtual:intelligence-manifest";

// Eager-load all Intelligence hero images (both tracks) and key them by slug.
// Vite resolves these to hashed asset URLs at build time — only the URL string
// ships in the bundle, not the image bytes themselves.
// We load JPG (fallback), WebP (~53% of JPG), and AVIF (~32% of JPG) so the
// browser can pick the smallest format it supports via a <picture> element.
const heroImageModules = import.meta.glob<{ default: string }>(
  "../assets/intelligence/**/*.{jpg,png,webp,avif}",
  { eager: true }
);

export interface HeroImageSet {
  /** JPG/PNG fallback — always present. */
  src: string;
  webp?: string;
  avif?: string;
}

const HERO_IMAGES: Record<string, HeroImageSet> = {};
for (const [path, mod] of Object.entries(heroImageModules)) {
  const file = path.split("/").pop()!;
  const m = file.match(/^(.+)\.(jpg|png|webp|avif)$/);
  if (!m) continue;
  const [, slug, ext] = m;
  const set = (HERO_IMAGES[slug] ||= { src: "" });
  if (ext === "webp") set.webp = mod.default;
  else if (ext === "avif") set.avif = mod.default;
  else set.src = mod.default; // jpg/png fallback
}

export const getHeroImage = (slug: string): HeroImageSet | undefined => {
  const set = HERO_IMAGES[slug];
  return set && set.src ? set : undefined;
};

const PEOPLE_OPS_CATEGORIES: CategorySlug[] = [
  "people-ops-foundations",
  "people-ops-systems",
  "people-ops-builders",
  "people-ops-governance",
];

const inferTrack = (f: ArticleFrontmatter): Track =>
  f.track ?? (PEOPLE_OPS_CATEGORIES.includes(f.category) ? "people-ops" : "deepgrain");

export const ARTICLES: Article[] = FRONTMATTERS
  .map((entry) => {
    const { __path, ...fm } = entry;
    const loader = LOADERS[__path];
    return {
      frontmatter: { ...fm, track: inferTrack(fm) } as ArticleFrontmatter,
      Component: lazy(loader),
    };
  })
  .sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );

export const getArticleBySlug = (slug: string) =>
  ARTICLES.find((a) => a.frontmatter.slug === slug);

export const getArticlesByCategory = (cat: CategorySlug) =>
  ARTICLES.filter((a) => a.frontmatter.category === cat);

export const getArticlesByTrack = (track: Track) =>
  ARTICLES.filter((a) => a.frontmatter.track === track);

export const getCategoriesByTrack = (track: Track) =>
  CATEGORIES.filter((c) => c.track === track);

export const getCategory = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const getFeaturedArticles = (limit = 3) =>
  ARTICLES.filter((a) => a.frontmatter.featured).slice(0, limit);

/**
 * Keyword-weighted related articles for stronger internal linking.
 *
 * Score = (shared keywords × 3) + (same category × 2) + (same track × 1).
 * Sort: score desc, then most recent. Articles with score 0 are excluded
 * unless we'd otherwise return fewer than `limit` — in which case we top up
 * with same-track, then site-wide recency, so the section is never empty.
 */
export const getRelatedArticles = (slug: string, limit = 3) => {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  const cf = current.frontmatter;
  const currentKeywords = new Set((cf.keywords ?? []).map((k) => k.toLowerCase()));

  const scored = ARTICLES.filter((a) => a.frontmatter.slug !== slug).map((a) => {
    const f = a.frontmatter;
    const sharedKeywords = (f.keywords ?? []).reduce(
      (n, k) => (currentKeywords.has(k.toLowerCase()) ? n + 1 : n),
      0
    );
    const sameCategory = f.category === cf.category ? 1 : 0;
    const sameTrack = f.track === cf.track ? 1 : 0;
    const score = sharedKeywords * 3 + sameCategory * 2 + sameTrack;
    return { article: a, score, sharedKeywords };
  });

  const byRecency = (a: { article: Article }, b: { article: Article }) =>
    new Date(b.article.frontmatter.publishedAt).getTime() -
    new Date(a.article.frontmatter.publishedAt).getTime();

  const ranked = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || byRecency(a, b));

  if (ranked.length >= limit) return ranked.slice(0, limit).map((s) => s.article);

  // Top-up with same-track recency, then site-wide, avoiding duplicates.
  const chosen = new Set(ranked.map((s) => s.article.frontmatter.slug));
  const fillers = ARTICLES
    .filter(
      (a) => a.frontmatter.slug !== slug && !chosen.has(a.frontmatter.slug)
    )
    .sort(
      (a, b) =>
        (a.frontmatter.track === cf.track ? -1 : 0) -
          (b.frontmatter.track === cf.track ? -1 : 0) ||
        new Date(b.frontmatter.publishedAt).getTime() -
          new Date(a.frontmatter.publishedAt).getTime()
    );

  return [...ranked.map((s) => s.article), ...fillers].slice(0, limit);
};
