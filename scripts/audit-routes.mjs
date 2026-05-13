#!/usr/bin/env node
/**
 * Route-source parity audit.
 *
 * The sitemap, the prerender, and the React Router <Routes> block must
 * agree on which URLs exist. If a developer adds a new <Route> in App.tsx
 * but forgets to update the sitemap source-of-truth (build-seo-indexes.mjs),
 * the new page will never be prerendered, and crawlers will get the empty
 * SPA shell.
 *
 * This script:
 *   1. Parses every <Route path="..."> from src/App.tsx.
 *   2. Expands dynamic params (:slug, :name) using the same data
 *      sources the runtime uses (MDX frontmatter, ANSWERS, PILLARS,
 *      CLUSTERS, COMPARES, CATEGORIES, GLOSSARY) — mirrored from the
 *      generator in scripts/build-seo-indexes.mjs.
 *   3. Reads public/sitemap.xml.
 *   4. Diffs the two sets, ignoring known noindex/internal routes.
 *   5. Exits non-zero on drift so the build fails loudly.
 *
 * Usage: runs automatically before prerender. Skip with
 * DEEPGRAIN_SKIP_ROUTE_AUDIT=1.
 */
import { promises as fs } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const ORIGIN = "https://deepgrain.ai";

if (process.env.DEEPGRAIN_SKIP_ROUTE_AUDIT === "1") {
  console.log("[audit-routes] skipped via env flag.");
  process.exit(0);
}

// Routes that should NOT appear in the sitemap (noindex, redirect, wildcard).
// Keep this list narrow and explicit.
const NOINDEX_PATHS = new Set([
  "/unsubscribe",
  "/brain/resend",
  "*",
]);
// Routes that App.tsx serves only as redirects (Navigate elements). Their
// targets are indexed instead.
const REDIRECT_ONLY = new Set([
  "/intelligence/people-ops",
]);

// ---------- 1. Parse <Route path="..."> from App.tsx --------------------

const appSrc = await fs.readFile(join(ROOT, "src/App.tsx"), "utf8");
const routePaths = [
  ...appSrc.matchAll(/<Route\s+path=["']([^"']+)["']/g),
].map((m) => m[1]);

if (!routePaths.length) {
  console.error("[audit-routes] FATAL: no <Route path> entries found in src/App.tsx");
  process.exit(1);
}

// ---------- 2. Load the same data sources build-seo-indexes uses --------

async function loadMdxArticleSlugs() {
  const dir = join(ROOT, "src/content/intelligence");
  const out = [];
  async function walk(d) {
    for (const e of await fs.readdir(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith(".mdx")) {
        const src = await fs.readFile(p, "utf8");
        const slugMatch = src.match(/slug:\s*"([^"]+)"/);
        if (slugMatch) out.push(slugMatch[1]);
        else out.push(basename(p, ".mdx"));
      }
    }
  }
  await walk(dir);
  return out;
}

function parseListExport(filePath, listName) {
  // Pulls slug values from `export const X: T[] = [ { slug: "...", ... }, ...]`
  const src = readFileSync(filePath, "utf8");
  const re = new RegExp(
    `export\\s+const\\s+${listName}\\s*[:=][\\s\\S]*?\\[([\\s\\S]*?)\\];`,
    "m",
  );
  const m = src.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/slug:\s*"([^"]+)"/g)].map((mm) => mm[1]);
}

const articleSlugs = await loadMdxArticleSlugs();
const answerSlugs = parseListExport(join(ROOT, "src/data/answers.ts"), "ANSWERS");
const pillarSlugs = parseListExport(join(ROOT, "src/data/pillars.ts"), "PILLARS");
const compareSlugs = parseListExport(join(ROOT, "src/data/compares.ts"), "COMPARES");
const clusterSlugs = (() => {
  // CLUSTERS uses slug values via Cluster[] interface
  const src = readFileSync(join(ROOT, "src/lib/clusters.ts"), "utf8");
  const m = src.match(/CLUSTERS:\s*Cluster\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return [];
  return [...m[1].matchAll(/slug:\s*"([^"]+)"/g)].map((mm) => mm[1]);
})();
// Categories live in src/lib/intelligence.ts CATEGORIES.
const categorySlugs = (() => {
  const src = readFileSync(join(ROOT, "src/lib/intelligence.ts"), "utf8");
  const m = src.match(/CATEGORIES:\s*Category\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) return [];
  return [...m[1].matchAll(/slug:\s*"([^"]+)"/g)].map((mm) => mm[1]);
})();

// ---------- 3. Expand App.tsx routes into concrete URLs -----------------

const expanded = new Set();

for (const path of routePaths) {
  if (NOINDEX_PATHS.has(path)) continue;
  if (REDIRECT_ONLY.has(path)) continue;

  if (!path.includes(":")) {
    expanded.add(path);
    continue;
  }

  // Dynamic param routes — expand based on the param.
  if (path === "/intelligence/category/:name") {
    for (const s of categorySlugs) expanded.add(`/intelligence/category/${s}`);
  } else if (path === "/intelligence/pillar/:slug") {
    for (const s of pillarSlugs) expanded.add(`/intelligence/pillar/${s}`);
  } else if (path === "/intelligence/cluster/:slug") {
    for (const s of clusterSlugs) expanded.add(`/intelligence/cluster/${s}`);
  } else if (path === "/answers/:slug") {
    for (const s of answerSlugs) expanded.add(`/answers/${s}`);
  } else if (path === "/intelligence/:slug") {
    // The catch-all article route. Compares are routed first via explicit
    // <Route> entries; everything else maps to an MDX article slug.
    for (const s of articleSlugs) expanded.add(`/intelligence/${s}`);
    for (const s of compareSlugs) expanded.add(`/intelligence/${s}`);
  } else {
    console.warn(`[audit-routes] WARN: unhandled dynamic path "${path}" — extend audit-routes.mjs`);
  }
}

// ---------- 4. Read sitemap and diff -----------------------------------

const sitemapPath = join(ROOT, "public/sitemap.xml");
if (!existsSync(sitemapPath)) {
  console.error("[audit-routes] FATAL: public/sitemap.xml is missing. Run scripts/build-seo-indexes.mjs first.");
  process.exit(1);
}
const sitemapXml = await fs.readFile(sitemapPath, "utf8");
const sitemapPaths = new Set(
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(ORIGIN))
    .map((u) => u.slice(ORIGIN.length) || "/"),
);

const inAppNotSitemap = [...expanded].filter((p) => !sitemapPaths.has(p)).sort();
const inSitemapNotApp = [...sitemapPaths].filter((p) => !expanded.has(p)).sort();

// ---------- 5. Report --------------------------------------------------

console.log(
  `[audit-routes] App routes: ${expanded.size}, sitemap routes: ${sitemapPaths.size}`,
);
console.log(
  `[audit-routes] sources — articles=${articleSlugs.length}, answers=${answerSlugs.length}, pillars=${pillarSlugs.length}, clusters=${clusterSlugs.length}, compares=${compareSlugs.length}, categories=${categorySlugs.length}`,
);

let failed = false;
if (inAppNotSitemap.length) {
  failed = true;
  console.error(
    `\n[audit-routes] ${inAppNotSitemap.length} route(s) reachable in App.tsx but missing from sitemap.xml:`,
  );
  for (const p of inAppNotSitemap) console.error("  - " + p);
  console.error(
    "  Fix: add to scripts/build-seo-indexes.mjs (STATIC_ROUTES or appropriate dynamic source) and re-run `npm run build:seo-indexes`.",
  );
}
if (inSitemapNotApp.length) {
  failed = true;
  console.error(
    `\n[audit-routes] ${inSitemapNotApp.length} route(s) in sitemap.xml but unreachable from App.tsx:`,
  );
  for (const p of inSitemapNotApp) console.error("  - " + p);
  console.error(
    "  Fix: either add the matching <Route> to src/App.tsx or remove from sitemap source.",
  );
}

if (failed) {
  console.error("\n[audit-routes] FAILED — sitemap and App.tsx are out of sync.");
  process.exit(1);
}
console.log("[audit-routes] sitemap and App.tsx are in sync ✓");
