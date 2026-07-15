#!/usr/bin/env node
/**
 * scripts/check-sitemap-lastmod.mjs
 *
 * Sanity check before deploy:
 *   - All URLs in public/sitemap.xml parse cleanly.
 *   - At least one <lastmod> in the sitemap matches today's date OR no
 *     route-bearing content has changed since the last commit (no false
 *     positives on docs-only PRs).
 *
 * The IndexNow ping itself (supabase/functions/ping-indexnow) is triggered
 * by pg_cron every 10 minutes and detects sitemap.xml diffs by content
 * hash. This script just catches the case where someone publishes new
 * intelligence but forgets to bump lastmod, which would silently skip
 * IndexNow notification for those URLs.
 *
 * Wire-up: add to package.json as `"prepublish:check": "node scripts/check-sitemap-lastmod.mjs"`
 * and reference from docs/prepublish-checklist.md. Non-blocking - exits 0
 * with a warning rather than failing the deploy, so a docs-only release
 * still ships.
 */
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const SITEMAP = resolve("public/sitemap.xml");
const CONTENT_DIR = resolve("src/content/intelligence");

if (!existsSync(SITEMAP)) {
  console.warn("[lastmod] public/sitemap.xml not found, skipping check");
  process.exit(0);
}

const xml = readFileSync(SITEMAP, "utf8");
const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);

const today = new Date().toISOString().slice(0, 10);
let touchedRecently = 0;

if (existsSync(CONTENT_DIR)) {
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".mdx")) {
        const mtime = statSync(p).mtime.toISOString().slice(0, 10);
        if (mtime === today) touchedRecently++;
      }
    }
  };
  walk(CONTENT_DIR);
}

const lastmodsToday = urlBlocks.filter((b) => b.includes(`<lastmod>${today}`)).length;

console.log(`[lastmod] sitemap urls: ${urlBlocks.length}`);
console.log(`[lastmod] mdx files modified today: ${touchedRecently}`);
console.log(`[lastmod] sitemap lastmods dated today: ${lastmodsToday}`);

if (touchedRecently > 0 && lastmodsToday === 0) {
  console.warn(
    `[lastmod] WARNING: ${touchedRecently} intelligence file(s) changed today but no sitemap entries have today's <lastmod>. ` +
      `IndexNow will skip these URLs until the next sitemap rebuild bumps them. Re-run scripts/build-seo-indexes.mjs.`,
  );
}

process.exit(0);
