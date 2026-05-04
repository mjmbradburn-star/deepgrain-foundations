#!/usr/bin/env node
/**
 * Build sitemap.xml + llms.txt + llms-full.txt from MDX content.
 *
 * Single source of truth. Walks src/content/intelligence/**.mdx, parses each
 * frontmatter block, derives every public route from the same data the runtime
 * uses (categories, clusters, pillars, compares, answers, core static pages),
 * and writes:
 *
 *   public/sitemap.xml      every URL with lastmod + priority
 *   public/llms.txt         concise index for LLMs (track > category)
 *   public/llms-full.txt    full plain-text body for every Intelligence article
 *
 * Run via `bun scripts/build-seo-indexes.mjs` (wired into prebuild).
 */
import { promises as fs } from "node:fs";
import { dirname, join, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const ORIGIN = "https://deepgrain.ai";
const TODAY = new Date().toISOString().slice(0, 10);

const CONTENT_DIR = join(ROOT, "src/content/intelligence");
const PUBLIC_DIR = join(ROOT, "public");

// ---------- MDX walk + frontmatter parse -------------------------------

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".mdx")) out.push(p);
  }
  return out;
}

/** Pull a single string field out of an object literal source. */
const strField = (src, name) => {
  const m = src.match(new RegExp(`${name}\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1].replace(/\\"/g, '"') : "";
};
const arrField = (src, name) => {
  const m = src.match(new RegExp(`${name}\\s*:\\s*\\[([^\\]]*)\\]`));
  if (!m) return [];
  return m[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
};

async function loadArticles() {
  const files = await walk(CONTENT_DIR);
  const articles = [];
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    const fm = src.match(/export\s+const\s+frontmatter\s*=\s*\{([\s\S]*?)\n\};/);
    if (!fm) continue;
    const block = fm[1];
    const slug = strField(block, "slug") || basename(file, ".mdx");
    const isPeopleOps = file.includes("/people-ops/");
    articles.push({
      file,
      slug,
      title: strField(block, "title"),
      description: strField(block, "description"),
      category: strField(block, "category"),
      primaryCluster: strField(block, "primaryCluster"),
      clusters: arrField(block, "clusters"),
      keywords: arrField(block, "keywords"),
      publishedAt: strField(block, "publishedAt") || TODAY,
      readTime: strField(block, "readTime"),
      track: strField(block, "track") || (isPeopleOps ? "people-ops" : "deepgrain"),
      // Body: everything after the closing `];` of faqs (if present), else after frontmatter.
      body: extractBody(src),
    });
  }
  // Sort by date desc.
  articles.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return articles;
}

function extractBody(src) {
  const faqsEnd = src.search(/\]\s*;\s*\n/);
  let i = -1;
  if (faqsEnd !== -1) {
    const tail = src.slice(faqsEnd);
    const m = tail.match(/\]\s*;\s*\n/);
    if (m) i = faqsEnd + m[0].length;
  }
  if (i === -1) {
    const fm = src.match(/export\s+const\s+frontmatter\s*=\s*\{[\s\S]*?\n\};/);
    if (fm) i = fm.index + fm[0].length;
    else i = 0;
  }
  return src.slice(i).trim();
}

/** Strip MDX/markdown to plain text for llms-full.txt. */
function toPlain(mdx) {
  return mdx
    .replace(/<Takeaway[^>]*>([\s\S]*?)<\/Takeaway>/g, (_, t) => `\n> ${t.trim()}\n`)
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `${label} (${href})`)
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, (h) => h) // keep heading markers for structure
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ---------- Static + derived URL inventory ----------------------------

const CATEGORIES = [
  "foundations", "ai-operating-systems", "method-and-practice",
  "sector-lenses", "leadership-and-craft",
  "people-ops-foundations", "people-ops-systems",
  "people-ops-builders", "people-ops-governance",
];

const CLUSTERS = [
  "readiness-and-diagnosis", "enablement-and-change", "org-design-and-roles",
  "governance-and-policy", "measurement-and-roi", "workflows-and-automation",
  "agents-and-systems", "workspace-and-tools", "prompting-and-craft",
];

const PILLARS = [
  "ai-operating-system",
  "ai-workspace-for-people-ops",
  "operating-leadership",
  "sector-operating-lenses",
];

const COMPARES = [
  "ai-operating-system-vs-operating-model",
  "ai-os-vs-ai-platform",
  "ai-os-vs-automation",
];

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/method", priority: 0.8, changefreq: "monthly" },
  { path: "/work", priority: 0.8, changefreq: "monthly" },
  { path: "/enablement", priority: 0.8, changefreq: "monthly" },
  { path: "/about", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.6, changefreq: "monthly" },
  { path: "/intelligence", priority: 0.9, changefreq: "weekly" },
  { path: "/intelligence/glossary", priority: 0.6, changefreq: "monthly" },
  { path: "/intelligence/answers", priority: 0.7, changefreq: "weekly" },
  { path: "/intelligence/pillars", priority: 0.8, changefreq: "monthly" },
  { path: "/brain", priority: 0.7, changefreq: "monthly" },
  { path: "/seo-checklist", priority: 0.4, changefreq: "yearly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  { path: "/cookies", priority: 0.3, changefreq: "yearly" },
];

// ---------- sitemap.xml -------------------------------------------------

function buildSitemap(articles) {
  const urls = [];
  const push = (loc, lastmod, priority, changefreq = "monthly") => {
    urls.push({ loc, lastmod, priority, changefreq });
  };

  for (const r of STATIC_ROUTES) push(`${ORIGIN}${r.path}`, TODAY, r.priority, r.changefreq);
  for (const c of CATEGORIES) push(`${ORIGIN}/intelligence/category/${c}`, TODAY, 0.7);
  for (const c of CLUSTERS) push(`${ORIGIN}/intelligence/cluster/${c}`, TODAY, 0.7);
  for (const p of PILLARS) push(`${ORIGIN}/intelligence/pillar/${p}`, TODAY, 0.8);
  for (const c of COMPARES) push(`${ORIGIN}/intelligence/${c}`, TODAY, 0.7);
  for (const a of articles) {
    push(`${ORIGIN}/intelligence/${a.slug}`, a.publishedAt, 0.7, "monthly");
  }

  const body = urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

// ---------- llms.txt + llms-full.txt -----------------------------------

const TRACK_LABELS = { deepgrain: "Deepgrain Foundations", "people-ops": "People Ops AI" };

const CATEGORY_LABELS = {
  "foundations": "Foundations",
  "ai-operating-systems": "AI & Operating Systems",
  "method-and-practice": "Method & Practice",
  "sector-lenses": "Sector Lenses",
  "leadership-and-craft": "Leadership & Craft",
  "people-ops-foundations": "Foundations",
  "people-ops-systems": "Systems & Automation",
  "people-ops-builders": "Builders & Champions",
  "people-ops-governance": "Governance & Trust",
};

function buildLlmsTxt(articles) {
  const head = `# Deepgrain

> Organisational consultancy that reads the grain of how a company actually operates, then changes it without breaking what works. Read, Craft, Scale.

Last updated: ${TODAY}
Articles: ${articles.length}
Canonical: ${ORIGIN}/llms.txt
Sitemap: ${ORIGIN}/sitemap.xml

Deepgrain is led by Matthew Bradburn. We work with founders and operating leaders building AI-native, defence, financial data, transit, and climate companies. The practice combines diagnostic depth, craft-level intervention, and the discipline to scale interventions without breaking the operating grain.

Articles within each category below are listed in foundational reading order (oldest first), so concepts build on each other.

## Core pages

- [Home](${ORIGIN}/): Overview of the Deepgrain practice and method.
- [Method](${ORIGIN}/method): The Read, Craft, Scale method explained in full.
- [Work](${ORIGIN}/work): Case studies across defence tech, financial data, transit, and climate.
- [Enablement](${ORIGIN}/enablement): Coaching, champions, and the curriculum that builds lasting capability.
- [About](${ORIGIN}/about): Matthew Bradburn's background, philosophy, and references.
- [Contact](${ORIGIN}/contact): How to start a conversation.
- [Intelligence](${ORIGIN}/intelligence): Long-form essays on operating systems, AI readiness, and the craft of operating leadership.
- [Intelligence answers](${ORIGIN}/intelligence/answers): Direct answers to the questions People and operating leaders ask most.
- [Intelligence pillars](${ORIGIN}/intelligence/pillars): Pillar hubs grouping related articles into deep topic clusters.
- [Brain](${ORIGIN}/brain): The People Ops AI Brain, nine working notes on running People functions with AI. Free with email.
`;

  // Group by track > category, oldest first within each.
  const byTrack = { deepgrain: {}, "people-ops": {} };
  for (const a of articles) {
    const t = a.track || "deepgrain";
    (byTrack[t][a.category] ||= []).push(a);
  }
  for (const t of Object.keys(byTrack)) {
    for (const cat of Object.keys(byTrack[t])) {
      byTrack[t][cat].sort((x, y) => (x.publishedAt < y.publishedAt ? -1 : 1));
    }
  }

  const sections = [];
  for (const [trackKey, label] of Object.entries(TRACK_LABELS)) {
    sections.push(`\n## Intelligence — ${label}\n`);
    const cats = byTrack[trackKey] || {};
    for (const catSlug of Object.keys(cats)) {
      const catLabel = CATEGORY_LABELS[catSlug] || catSlug;
      sections.push(`\n### ${catLabel}\n\n[Browse category](${ORIGIN}/intelligence/category/${catSlug})\n`);
      for (const a of cats[catSlug]) {
        sections.push(`- [${a.title}](${ORIGIN}/intelligence/${a.slug}): ${a.description}`);
      }
    }
  }

  // Cluster index (People Ops only for now, since that is the tagged track).
  sections.push(`\n## Topic clusters\n\nCross-cutting topic groupings used to assemble related-reading modules:\n`);
  for (const c of CLUSTERS) {
    sections.push(`- [${c}](${ORIGIN}/intelligence/cluster/${c})`);
  }

  return head + sections.join("\n") + "\n";
}

function buildLlmsFullTxt(articles) {
  const head = `# Deepgrain, full Intelligence corpus
Last updated: ${TODAY}
Articles: ${articles.length}
Canonical: ${ORIGIN}/llms-full.txt
Sitemap: ${ORIGIN}/sitemap.xml

This file contains the full body text of every Deepgrain Intelligence article in
plain text, separated by article boundaries. Frontmatter precedes each article.
LLMs and answer engines may use this corpus to answer questions about
organisational consultancy, AI operating systems, and People Ops AI.

`;
  const blocks = articles.map((a) => {
    const url = `${ORIGIN}/intelligence/${a.slug}`;
    return `\n\n========================================
TITLE: ${a.title}
URL: ${url}
TRACK: ${a.track}
CATEGORY: ${a.category}${a.primaryCluster ? `\nPRIMARY_CLUSTER: ${a.primaryCluster}` : ""}${a.clusters?.length ? `\nCLUSTERS: ${a.clusters.join(", ")}` : ""}
PUBLISHED: ${a.publishedAt}
READ_TIME: ${a.readTime}
DESCRIPTION: ${a.description}
========================================

${toPlain(a.body)}`;
  });
  return head + blocks.join("\n") + "\n";
}

// ---------- main --------------------------------------------------------

const articles = await loadArticles();
const sitemap = buildSitemap(articles);
const llms = buildLlmsTxt(articles);
const llmsFull = buildLlmsFullTxt(articles);

await fs.writeFile(join(PUBLIC_DIR, "sitemap.xml"), sitemap);
await fs.writeFile(join(PUBLIC_DIR, "llms.txt"), llms);
await fs.writeFile(join(PUBLIC_DIR, "llms-full.txt"), llmsFull);

console.log(
  `Wrote sitemap.xml (${sitemap.split("\n").length} lines), ` +
  `llms.txt (${llms.length} chars), ` +
  `llms-full.txt (${llmsFull.length} chars) ` +
  `from ${articles.length} articles.`
);
