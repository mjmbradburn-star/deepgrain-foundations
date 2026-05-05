#!/usr/bin/env node
/**
 * Build-time JSON-LD validator.
 *
 * Walks every prerendered HTML file in `dist/` and verifies that:
 *   1. Every <script type="application/ld+json"> block contains valid JSON.
 *   2. Each block has @context and @type (the minimum Schema.org contract).
 *   3. The home page (dist/index.html) contains a VideoObject block with
 *      the required Google video properties (name, thumbnailUrl, uploadDate,
 *      and one of contentUrl/embedUrl).
 *   4. Required type-specific fields are present for common types we ship
 *      (Article, FAQPage, BreadcrumbList, Organization, WebSite).
 *
 * Exits non-zero if any check fails so the deploy is blocked.
 *
 * Skip locally with DEEPGRAIN_SKIP_JSONLD_CHECK=1.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");

if (process.env.DEEPGRAIN_SKIP_JSONLD_CHECK === "1") {
  console.log("[jsonld] DEEPGRAIN_SKIP_JSONLD_CHECK=1 set, skipping.");
  process.exit(0);
}

if (!existsSync(DIST)) {
  console.warn("[jsonld] dist/ missing, skipping.");
  process.exit(0);
}

const JSONLD_RE =
  /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/** Recursively collect every .html file under dir. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Flatten @graph wrappers so per-type checks can find nested nodes. */
function flatten(node) {
  if (!node) return [];
  if (Array.isArray(node)) return node.flatMap(flatten);
  if (node["@graph"] && Array.isArray(node["@graph"])) {
    return [node, ...node["@graph"].flatMap(flatten)];
  }
  return [node];
}

const REQUIRED_BY_TYPE = {
  VideoObject: ["name", "thumbnailUrl", "uploadDate"],
  Article: ["headline", "author"],
  NewsArticle: ["headline", "author"],
  BlogPosting: ["headline", "author"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  Organization: ["name"],
  WebSite: ["name", "url"],
  Person: ["name"],
};

const errors = [];
const warnings = [];
let totalBlocks = 0;
let totalFiles = 0;
let homeHasVideo = false;

const files = walk(DIST);
for (const file of files) {
  const rel = relative(DIST, file);
  totalFiles++;
  const html = readFileSync(file, "utf8");
  const matches = [...html.matchAll(JSONLD_RE)];

  if (matches.length === 0) {
    // Not every page must carry JSON-LD, but warn so misses are visible.
    warnings.push(`${rel}: no JSON-LD blocks found`);
    continue;
  }

  for (const [, raw] of matches) {
    totalBlocks++;
    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch (err) {
      errors.push(`${rel}: invalid JSON in ld+json block (${err.message})`);
      continue;
    }

    const nodes = flatten(parsed);
    for (const node of nodes) {
      if (typeof node !== "object" || node === null) continue;
      // Skip the @graph wrapper itself when checking type fields.
      if (!node["@type"] && node["@graph"]) continue;
      if (!node["@context"] && !parsed["@context"]) {
        errors.push(`${rel}: ld+json node missing @context`);
      }
      const type = node["@type"];
      if (!type) {
        errors.push(`${rel}: ld+json node missing @type`);
        continue;
      }
      const types = Array.isArray(type) ? type : [type];
      for (const t of types) {
        const required = REQUIRED_BY_TYPE[t];
        if (!required) continue;
        for (const key of required) {
          if (node[key] === undefined || node[key] === null || node[key] === "") {
            errors.push(`${rel}: ${t} missing required field "${key}"`);
          }
        }
        if (t === "VideoObject") {
          if (!node.contentUrl && !node.embedUrl) {
            errors.push(`${rel}: VideoObject must have contentUrl or embedUrl`);
          }
          if (rel === "index.html") homeHasVideo = true;
        }
      }
    }
  }
}

if (!homeHasVideo) {
  errors.push("index.html: no VideoObject JSON-LD found in static HTML");
}

console.log(
  `[jsonld] scanned ${totalFiles} HTML file(s), ${totalBlocks} JSON-LD block(s)`,
);

if (warnings.length) {
  console.warn(`[jsonld] ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn("  - " + w);
}

if (errors.length) {
  console.error(`[jsonld] ${errors.length} error(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log("[jsonld] all JSON-LD blocks valid ✓");
