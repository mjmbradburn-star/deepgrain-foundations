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
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  Component: React.ComponentType;
}

const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: ArticleFrontmatter;
}>("../content/intelligence/**/*.mdx", { eager: true });

const PEOPLE_OPS_CATEGORIES: CategorySlug[] = [
  "people-ops-foundations",
  "people-ops-systems",
  "people-ops-builders",
  "people-ops-governance",
];

const inferTrack = (f: ArticleFrontmatter): Track =>
  f.track ?? (PEOPLE_OPS_CATEGORIES.includes(f.category) ? "people-ops" : "deepgrain");

export const ARTICLES: Article[] = Object.values(modules)
  .map((m) => ({
    frontmatter: { ...m.frontmatter, track: inferTrack(m.frontmatter) },
    Component: m.default,
  }))
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

export const getRelatedArticles = (slug: string, limit = 3) => {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  return ARTICLES.filter(
    (a) =>
      a.frontmatter.slug !== slug &&
      a.frontmatter.category === current.frontmatter.category
  ).slice(0, limit);
};
