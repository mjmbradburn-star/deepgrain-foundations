#!/usr/bin/env node
/**
 * Inject search-engine site verification codes into index.html.
 *
 * Reads from environment variables and writes (or replaces) the
 * `<meta name="google-site-verification">` and `<meta name="msvalidate.01">`
 * tags inside <head>. Idempotent: re-running with the same values is a no-op.
 *
 * Env vars:
 *   GOOGLE_SITE_VERIFICATION   Google Search Console "HTML tag" content value
 *   BING_SITE_VERIFICATION     Bing Webmaster Tools meta tag content value
 *
 * At least one must be set, or the script exits non-zero with usage.
 *
 * Usage:
 *   GOOGLE_SITE_VERIFICATION=abc123 BING_SITE_VERIFICATION=xyz789 \
 *     npm run seo:verify
 *
 * Note on "redeploy": Lovable publishes via the in-app Publish button, there
 * is no CLI deploy. After running this script, click Publish → Update in the
 * editor (or push to your connected repo) to roll the change live.
 */
import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const INDEX = resolve(ROOT, "index.html");

const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bing = process.env.BING_SITE_VERIFICATION?.trim();

if (!google && !bing) {
  console.error(
    "Nothing to do. Set GOOGLE_SITE_VERIFICATION and/or BING_SITE_VERIFICATION " +
    "in the environment, then re-run.\n\n" +
    "Example:\n" +
    "  GOOGLE_SITE_VERIFICATION=abc123 npm run seo:verify"
  );
  process.exit(1);
}

let html = await fs.readFile(INDEX, "utf8");
const original = html;

/** Insert or replace a single <meta name="..."> tag in <head>. */
function upsertMeta(source, name, content) {
  const tag = `<meta name="${name}" content="${content}" />`;
  const re = new RegExp(`\\s*<meta\\s+name="${name}"[^>]*/?>\\s*`, "i");
  if (re.test(source)) {
    return source.replace(re, `\n    ${tag}\n    `);
  }
  // Insert just before </head>, preserving indentation.
  return source.replace(/(\s*)<\/head>/i, `$1  ${tag}$1</head>`);
}

const updates = [];
if (google) {
  html = upsertMeta(html, "google-site-verification", google);
  updates.push(`google-site-verification = ${google.slice(0, 6)}…`);
}
if (bing) {
  html = upsertMeta(html, "msvalidate.01", bing);
  updates.push(`msvalidate.01            = ${bing.slice(0, 6)}…`);
}

if (html === original) {
  console.log("index.html already up to date, no changes written.");
} else {
  await fs.writeFile(INDEX, html);
  console.log("Updated index.html with:");
  for (const u of updates) console.log("  " + u);
}

console.log(
  "\nNext step: click Publish → Update in the Lovable editor to roll the " +
  "change live, then click Verify in Search Console / Bing Webmaster."
);
