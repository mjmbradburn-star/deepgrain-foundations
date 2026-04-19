export type CategorySlug =
  | "foundations"
  | "ai-operating-systems"
  | "method-and-practice"
  | "sector-lenses"
  | "leadership-and-craft";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "foundations",
    name: "Foundations",
    description: "First principles of organisational consultancy and the grain.",
  },
  {
    slug: "ai-operating-systems",
    name: "AI & Operating Systems",
    description: "What an AI operating system is — and how to build one.",
  },
  {
    slug: "method-and-practice",
    name: "Method & Practice",
    description: "Read · Craft · Scale: how the work is done.",
  },
  {
    slug: "sector-lenses",
    name: "Sector Lenses",
    description: "Operating consultancy applied to specific industries.",
  },
  {
    slug: "leadership-and-craft",
    name: "Leadership & Craft",
    description: "The disciplines of operating leadership.",
  },
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
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  Component: React.ComponentType;
}

// Eagerly import all MDX articles
const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: ArticleFrontmatter;
}>("../content/intelligence/*.mdx", { eager: true });

export const ARTICLES: Article[] = Object.values(modules)
  .map((m) => ({ frontmatter: m.frontmatter, Component: m.default }))
  .sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );

export const getArticleBySlug = (slug: string) =>
  ARTICLES.find((a) => a.frontmatter.slug === slug);

export const getArticlesByCategory = (cat: CategorySlug) =>
  ARTICLES.filter((a) => a.frontmatter.category === cat);

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
