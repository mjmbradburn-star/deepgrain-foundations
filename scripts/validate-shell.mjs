#!/usr/bin/env node
/**
 * Build-time SPA-shell detector.
 *
 * For every prerendered HTML file in dist/, asserts that the file is NOT
 * an empty SPA shell (i.e. that the prerender actually wrote rendered DOM
 * into <div id="root">). Catches the failure mode where the prerender
 * silently skips routes and the host's SPA fallback ships the shell.
 *
 * Heuristics for "empty shell":
 *   - The contents of <div id="root">…</div> are < 200 chars, OR
 *   - The document contains no <h1>, OR
 *   - The total file size is < 10 KB (the unrendered shell is ~7 KB).
 *
 * Cross-checks every URL listed in public/sitemap.xml has a matching
 * dist/<route>/index.html so missing routes are flagged too.
 *
 * Exits non-zero on any failure. Skip with DEEPGRAIN_SKIP_SHELL_CHECK=1.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const SITEMAP = join(ROOT, "public", "sitemap.xml");
const ORIGIN = "https://deepgrain.ai";

if (process.env.DEEPGRAIN_SKIP_SHELL_CHECK === "1") {
  console.log("[shell-check] skipped via env flag.");
  process.exit(0);
}
if (!existsSync(DIST)) {
  console.warn("[shell-check] dist/ missing, skipping.");
  process.exit(0);
}

const ROOT_RE = /<div id="root">([\s\S]*?)<\/div>\s*<script/i;
const MIN_ROOT_INNER = 200;
const MIN_FILE_SIZE = 10_000;

function routeToFile(route) {
  // "/" -> dist/index.html, "/method" -> dist/method/index.html
  const clean = route.replace(/^\/+|\/+$/g, "");
  return clean ? join(DIST, clean, "index.html") : join(DIST, "index.html");
}

function fileToRoute(file) {
  const rel = relative(DIST, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  return "/" + rel.replace(/\/index\.html$/, "");
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (entry === "index.html") out.push(full);
  }
  return out;
}

// 1. Determine expected routes from sitemap.
let expectedRoutes = [];
if (existsSync(SITEMAP)) {
  const xml = readFileSync(SITEMAP, "utf8");
  expectedRoutes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(ORIGIN))
    .map((u) => u.slice(ORIGIN.length) || "/");
}

const errors = [];
const missing = [];

// 2. Each sitemap route must have a matching dist file.
for (const route of expectedRoutes) {
  const file = routeToFile(route);
  if (!existsSync(file)) missing.push(route);
}

// 3. Every dist HTML file must look rendered, not shell.
const files = walk(DIST);
let checked = 0;
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const size = html.length;
  const m = html.match(ROOT_RE);
  const inner = (m ? m[1] : "").trim();
  const hasH1 = /<h1\b/i.test(html);
  const route = fileToRoute(file);
  checked++;

  const reasons = [];
  if (size < MIN_FILE_SIZE) reasons.push(`size=${size}B`);
  if (inner.length < MIN_ROOT_INNER)
    reasons.push(`root inner=${inner.length}chars`);
  if (!hasH1) reasons.push("no <h1>");

  if (reasons.length) {
    errors.push(`${route} (${relative(DIST, file)}): ${reasons.join(", ")}`);
  }
}

console.log(
  `[shell-check] checked ${checked} prerendered file(s); ${expectedRoutes.length} expected from sitemap`,
);

if (missing.length) {
  console.error(
    `[shell-check] ${missing.length} sitemap route(s) missing from dist:`,
  );
  for (const r of missing) console.error("  - " + r);
}
if (errors.length) {
  console.error(
    `[shell-check] ${errors.length} route(s) look like empty SPA shells:`,
  );
  for (const e of errors) console.error("  - " + e);
}

if (missing.length || errors.length) process.exit(1);
console.log("[shell-check] all routes rendered ✓");
