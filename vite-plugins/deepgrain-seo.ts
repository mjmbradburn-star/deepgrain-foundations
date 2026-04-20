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

const STATIC_PAGES = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/method", priority: "0.8", changefreq: "monthly" },
  { url: "/work", priority: "0.8", changefreq: "monthly" },
  { url: "/about", priority: "0.7", changefreq: "monthly" },
  { url: "/contact", priority: "0.6", changefreq: "yearly" },
  { url: "/intelligence", priority: "0.9", changefreq: "weekly" },
  { url: "/intelligence/people-ops", priority: "0.9", changefreq: "weekly" },
];

interface Frontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  publishedAt: string;
  track?: string;
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

function readArticles(root: string): Frontmatter[] {
  const dir = path.join(root, "src/content/intelligence");
  if (!fs.existsSync(dir)) return [];
  const results: Frontmatter[] = [];
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
          results.push(fm);
        } catch {
          /* ignore */
        }
      }
    }
  };
  walk(dir);
  return results.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

function buildSitemap(articles: Frontmatter[]): string {
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
    ...articles.map(
      (a) =>
        `  <url>\n    <loc>${SITE}/intelligence/${a.slug}</loc>\n    <lastmod>${a.publishedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildLlmsTxt(articles: Frontmatter[]): string {
  const byCat = (slug: string) => articles.filter((a) => a.category === slug);
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

Deepgrain is led by Matt Webb. We work with founders and operating leaders building AI-native, defence, financial data, transit, and climate companies. Our practice combines diagnostic depth, craft-level intervention, and the discipline to scale interventions without breaking the operating grain.

## Core pages

- [Home](${SITE}/): Overview of the Deepgrain practice and method.
- [Method](${SITE}/method): The Read · Craft · Scale method explained in full.
- [Work](${SITE}/work): Case studies across defence tech, financial data, transit, and climate.
- [About](${SITE}/about): Matt Webb's background, philosophy, and references.
- [Contact](${SITE}/contact): How to start a conversation.
- [Intelligence](${SITE}/intelligence): Long-form essays on operating systems, AI readiness, and the craft of operating leadership.
- [Intelligence · People Ops AI Brain](${SITE}/intelligence/people-ops): A dedicated track for People leaders building AI capability — from prompts to systems.

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

Author: Matt Webb. Publisher: Deepgrain Ltd. Site: ${SITE}.
Articles include schema.org Article JSON-LD with author, datePublished, and canonical URL.

## Contact

Email: matt@deepgrain.ai
`;
}

export function deepgrainSeoPlugin(): Plugin {
  const generate = (root: string, outDir: string) => {
    const articles = readArticles(root);
    const sitemap = buildSitemap(articles);
    const llms = buildLlmsTxt(articles);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
    fs.writeFileSync(path.join(outDir, "llms.txt"), llms);

    const publicDir = path.join(root, "public");
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
      fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);
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
