#!/usr/bin/env node
/**
 * Build-time canonical URL validator.
 *
 * For every prerendered HTML file in dist/, asserts that the page's
 * <link rel="canonical"> matches the URL the file will be served at.
 * Catches the failure mode where the SPA shell (with a hardcoded home
 * canonical) leaks into per-route output.
 *
 * Exits non-zero on mismatch so the build fails fast.
 *
 * Skip with DEEPGRAIN_SKIP_CANONICAL_CHECK=1.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://deepgrain.ai";

if (process.env.DEEPGRAIN_SKIP_CANONICAL_CHECK === "1") {
  console.log("[canonical] skipped via env flag.");
  process.exit(0);
}
if (!existsSync(DIST)) {
  console.warn("[canonical] dist/ missing, skipping.");
  process.exit(0);
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

/** Convert a dist file path into the URL it will serve at. */
function expectedCanonical(file) {
  const rel = relative(DIST, file).replace(/\\/g, "/");
  // dist/index.html -> /
  // dist/method/index.html -> /method
  // dist/intelligence/category/foundations/index.html -> /intelligence/category/foundations
  if (rel === "index.html") return `${ORIGIN}/`;
  const path = "/" + rel.replace(/\/index\.html$/, "");
  return `${ORIGIN}${path}`;
}

const CANON_RE =
  /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i;

const errors = [];
let checked = 0;
for (const file of walk(DIST)) {
  const html = readFileSync(file, "utf8");
  const m = html.match(CANON_RE);
  const rel = relative(DIST, file);
  if (!m) {
    errors.push(`${rel}: no <link rel="canonical"> found`);
    continue;
  }
  checked++;
  const actual = m[1].replace(/\/+$/, "") || "/";
  const expected = expectedCanonical(file).replace(/\/+$/, "") || "/";
  // Allow trailing-slash equivalence on the home only.
  if (actual !== expected) {
    errors.push(
      `${rel}: canonical mismatch\n      expected: ${expected}\n      actual:   ${actual}`,
    );
  }
}

console.log(`[canonical] checked ${checked} prerendered HTML file(s)`);
if (errors.length) {
  console.error(`[canonical] ${errors.length} mismatch(es):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("[canonical] all canonicals self-referencing ✓");
