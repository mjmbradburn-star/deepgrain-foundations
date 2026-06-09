import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const SITE = "https://deepgrain.ai";

const CATEGORIES = [
  { slug: "foundations", name: "Foundations", description: "First principles of organisational consultancy and the grain.", track: "deepgrain" },
  { slug: "ai-operating-systems", name: "AI & Operating Systems", description: "What an AI operating system is — and how to build one.", track: "deepgrain" },
  { slug: "method-and-practice", name: "Method & Practice", description: "Read · Craft · Scale: how the work is done.", track: "deepgrain" },
  { slug: "sector-lenses", name: "Sector Lenses", description: "Operating consultancy applied to specific industries.", track: "deepgrain" },
  { slug: "leadership-and-craft", name: "Leadership & Craft", description: "The disciplines of operating leadership.", track: "deepgrain" },
  { slug: "people-ops-foundations", name: "People Ops · Foundations", description: "From AI dabbling to systematic People Ops capability.", track: "people-ops" },
  { slug: "people-ops-systems", name: "People Ops · Systems & Automation", description: "Connected systems, agents, and the mechanics of leverage.", track: "people-ops" },
  { slug: "people-ops-builders", name: "People Ops · Builders & Champions", description: "Growing internal capability instead of buying tools.", track: "people-ops" },
  { slug: "people-ops-governance", name: "People Ops · Governance & Trust", description: "Working with AI without trading away judgment.", track: "people-ops" },
];

// Static, indexable routes. Keep in sync with src/App.tsx.
// Excluded by design: /unsubscribe, /brain/resend, /seo-checklist, /* (404).
const STATIC_PAGES = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/method", priority: "0.8", changefreq: "monthly" },
  { url: "/work", priority: "0.8", changefreq: "monthly" },
  { url: "/enablement", priority: "0.8", changefreq: "monthly" },
  { url: "/about", priority: "0.7", changefreq: "monthly" },
  { url: "/contact", priority: "0.6", changefreq: "yearly" },
  { url: "/intelligence", priority: "0.9", changefreq: "weekly" },
  { url: "/intelligence/answers", priority: "0.7", changefreq: "weekly" },
  { url: "/intelligence/pillars", priority: "0.8", changefreq: "monthly" },
  { url: "/intelligence/glossary", priority: "0.6", changefreq: "monthly" },
  { url: "/brain", priority: "0.9", changefreq: "monthly" },
  { url: "/privacy", priority: "0.3", changefreq: "yearly" },
  { url: "/cookies", priority: "0.3", changefreq: "yearly" },
  { url: "/terms", priority: "0.3", changefreq: "yearly" },
];

function readPillarSlugs(root: string): string[] {
  const file = path.join(root, "src/data/pillars.ts");
  if (!fs.existsSync(file)) return [];
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/PILLARS:\s*Pillar\[\]\s*=\s*\[([\s\S]*?)\];/);
  const block = m ? m[1] : src;
  return [...block.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((mm) => mm[1]);
}

interface Frontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  publishedAt: string;
  author?: string;
  readTime?: string;
  track?: string;
}

interface Article {
  frontmatter: Frontmatter;
  body: string;
}

const PEOPLE_OPS_CATEGORIES = new Set([
  "people-ops-foundations",
  "people-ops-systems",
  "people-ops-builders",
  "people-ops-governance",
]);

function inferTrack(f: Frontmatter): string {
  return f.track ?? (PEOPLE_OPS_CATEGORIES.has(f.category) ? "people-ops" : "deepgrain");
}

function readArticles(root: string): Article[] {
  const dir = path.join(root, "src/content/intelligence");
  if (!fs.existsSync(dir)) return [];
  const results: Article[] = [];
  const walk = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        const src = fs.readFileSync(full, "utf8");
        const m = src.match(/export const frontmatter = (\{[\s\S]*?\n\});/);
        if (!m) continue;
        try {
          const fm = new Function("return " + m[1])() as Frontmatter;
          fm.track = inferTrack(fm);
          // Strip the frontmatter export and any import statements; keep the prose.
          const body = src
            .replace(/export const frontmatter = \{[\s\S]*?\n\};\s*/g, "")
            .replace(/^import .*?;?\s*$/gm, "")
            .trim();
          results.push({ frontmatter: fm, body });
        } catch {
          /* ignore */
        }
      }
    }
  };
  walk(dir);
  return results.sort(
    (a, b) => +new Date(b.frontmatter.publishedAt) - +new Date(a.frontmatter.publishedAt),
  );
}

function buildSitemap(articles: Article[], pillarSlugs: string[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_PAGES.map(
      (p) =>
        `  <url>\n    <loc>${SITE}${p.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    ),
    ...CATEGORIES.map(
      (c) =>
        `  <url>\n    <loc>${SITE}/intelligence/category/${c.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    ),
    ...pillarSlugs.map(
      (s) =>
        `  <url>\n    <loc>${SITE}/intelligence/pillar/${s}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
    ...articles.map(
      (a) =>
        `  <url>\n    <loc>${SITE}/intelligence/${a.frontmatter.slug}</loc>\n    <lastmod>${a.frontmatter.publishedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildLlmsTxt(articles: Article[]): string {
  const today = new Date().toISOString().slice(0, 10);
  // For llms.txt we want foundational-first reading order: oldest → newest within each category.
  const ascArticles = [...articles].sort(
    (a, b) => +new Date(a.frontmatter.publishedAt) - +new Date(b.frontmatter.publishedAt),
  );
  const byCat = (slug: string) =>
    ascArticles.filter((a) => a.frontmatter.category === slug).map((a) => a.frontmatter);
  const deepgrainCats = CATEGORIES.filter((c) => c.track === "deepgrain");
  const peopleOpsCats = CATEGORIES.filter((c) => c.track === "people-ops");
  const renderCat = (c: typeof CATEGORIES[number]) => `### ${c.name}

${c.description}

[Browse category](${SITE}/intelligence/category/${c.slug})

${byCat(c.slug)
    .map((a) => `- [${a.title}](${SITE}/intelligence/${a.slug}): ${a.description}`)
    .join("\n")}
`;

  return `# Deepgrain

> Organisational consultancy that reads the grain of how a company actually operates — then changes it without breaking what works. Read · Craft · Scale.

Last updated: ${today}
Articles: ${articles.length}
Canonical: ${SITE}/llms.txt
Sitemap: ${SITE}/sitemap.xml

Deepgrain is led by Matthew Bradburn. We work with founders and operating leaders building AI-native, defence, financial data, transit, and climate companies. Our practice combines diagnostic depth, craft-level intervention, and the discipline to scale interventions without breaking the operating grain.

Articles within each category below are listed in foundational reading order (oldest first), so concepts build on each other.

## Core pages

- [Home](${SITE}/): Overview of the Deepgrain practice and method.
- [Method](${SITE}/method): The Read · Craft · Scale method explained in full.
- [Work](${SITE}/work): Case studies across defence tech, financial data, transit, and climate.
- [Enablement](${SITE}/enablement): Coaching, champions, and the curriculum that builds lasting capability.
- [About](${SITE}/about): Matthew Bradburn's background, philosophy, and references.
- [Contact](${SITE}/contact): How to start a conversation.
- [Intelligence](${SITE}/intelligence): Long-form essays on operating systems, AI readiness, and the craft of operating leadership.
- [Brain](${SITE}/brain): The People Ops AI Brain — nine working notes on running People functions with AI. Free with email.

## Intelligence — Deepgrain Foundations

${deepgrainCats.map(renderCat).join("\n")}
## Intelligence — The People Ops AI Brain

A track for Heads of People, CPOs, HRBPs and TA leaders moving from individual AI experiments to systematic operating capability.

${peopleOpsCats.map(renderCat).join("\n")}
## Topics we write about

- Organisational consultancy and operating systems
- AI operating systems and the five pillars of AI readiness
- The AI operating ladder (five tiers of operating maturity)
- Diagnosing operating reality vs operating story
- Sector-specific operating challenges (defence, fintech data, transit, climate, AI-native)
- Founder-mode vs operator-mode leadership
- Hiring, scaling, and compounding teams
- AI capability inside People functions: champions, governance, automation patterns

## How to cite Deepgrain

Author: Matthew Bradburn. Publisher: Deepgrain Ltd. Site: ${SITE}.
Articles include schema.org Article JSON-LD with author, datePublished, and canonical URL.

## Contact

Email: matt@deepgrain.ai
`;
}

function buildLlmsFullTxt(articles: Article[]): string {
  const today = new Date().toISOString().slice(0, 10);
  // Foundational-first: oldest → newest, grouped by category track.
  const ascArticles = [...articles].sort(
    (a, b) => +new Date(a.frontmatter.publishedAt) - +new Date(b.frontmatter.publishedAt),
  );
  const renderArticle = (a: Article) => {
    const f = a.frontmatter;
    return `---

# ${f.title}

URL: ${SITE}/intelligence/${f.slug}
Category: ${f.category}
Published: ${f.publishedAt}
Author: ${f.author ?? "Matthew Bradburn"}
${f.readTime ? `Reading time: ${f.readTime}\n` : ""}
${f.description}

${a.body}
`;
  };

  return `# Deepgrain — Full Intelligence Corpus

> Full text of every Deepgrain Intelligence article, in foundational reading order. Optimised for LLM ingestion.

Last updated: ${today}
Articles: ${articles.length}
Canonical: ${SITE}/llms-full.txt
Index: ${SITE}/llms.txt
Site: ${SITE}

Author: Matthew Bradburn. Publisher: Deepgrain Ltd.
When citing, please link back to the canonical article URL listed under each piece.

${ascArticles.map(renderArticle).join("\n")}`;
}

// Routes intentionally excluded from sitemap (private, redirect, transactional, or 404).
const EXCLUDED_ROUTES = new Set([
  "*",
  "/unsubscribe",
  "/brain/resend",
  "/seo-checklist",
  "/intelligence/people-ops", // 301 redirect → /intelligence
]);

/**
 * Audit App.tsx so concrete routes can never silently drift out of the sitemap.
 * Dynamic routes (containing `:`) and EXCLUDED_ROUTES are skipped. Anything
 * else that isn't covered by STATIC_PAGES, the category list, or article
 * slugs is logged as a warning during build.
 */
function auditRoutes(root: string, articles: Article[]): void {
  const appPath = path.join(root, "src/App.tsx");
  if (!fs.existsSync(appPath)) return;
  const src = fs.readFileSync(appPath, "utf8");
  const routes = [...src.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

  const sitemapPaths = new Set<string>([
    ...STATIC_PAGES.map((p) => p.url),
    ...CATEGORIES.map((c) => `/intelligence/category/${c.slug}`),
    ...articles.map((a) => `/intelligence/${a.frontmatter.slug}`),
  ]);

  const missing = routes.filter(
    (r) => !r.includes(":") && !EXCLUDED_ROUTES.has(r) && !sitemapPaths.has(r),
  );
  if (missing.length > 0) {
    console.warn(
      `[deepgrain-seo] ${missing.length} route(s) in App.tsx are missing from the sitemap. ` +
        `Add to STATIC_PAGES or EXCLUDED_ROUTES in vite-plugins/deepgrain-seo.ts:\n  - ${missing.join("\n  - ")}`,
    );
  }
}

export function deepgrainSeoPlugin(): Plugin {
  const generate = (root: string, outDir: string) => {
    const articles = readArticles(root);
    const pillarSlugs = readPillarSlugs(root);
    auditRoutes(root, articles);
    const sitemap = buildSitemap(articles, pillarSlugs);
    const llms = buildLlmsTxt(articles);
    const llmsFull = buildLlmsFullTxt(articles);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
    fs.writeFileSync(path.join(outDir, "llms.txt"), llms);
    fs.writeFileSync(path.join(outDir, "llms-full.txt"), llmsFull);

    const publicDir = path.join(root, "public");
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
      fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);
      fs.writeFileSync(path.join(publicDir, "llms-full.txt"), llmsFull);
    }
  };

  let root = process.cwd();

  return {
    name: "deepgrain-seo",
    apply: () => true,
    configResolved(config) {
      root = config.root;
      try {
        generate(root, path.join(root, "public"));
      } catch (e) {
        console.warn("[deepgrain-seo] dev generate failed:", e);
      }
    },
    closeBundle() {
      try {
        generate(root, path.join(root, "dist"));
      } catch (e) {
        console.warn("[deepgrain-seo] build generate failed:", e);
      }
    },
  };
}
