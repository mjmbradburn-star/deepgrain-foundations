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
import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
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
// The unrendered SPA shell has a single hardcoded canonical pointing at
// the home, a single Organization+WebSite JSON-LD graph, and an empty root.
// We treat any file whose canonical matches the home AND is not the home
// route as a shell leak. Plus content-rendered markers below.
const SHELL_HOME_CANONICAL = `${ORIGIN}/`;
const MIN_ROOT_INNER = 500; // a real React tree is far bigger than this
const MIN_FILE_SIZE = 15_000; // unrendered shell is ~7 KB; rendered pages are 50 KB+
const REQUIRE_TAGS = [
  // Rendered pages always emit a <main> landmark via the layout.
  { name: "main landmark", re: /<main\b/i },
  // OG title is set per route by Helmet/PageMeta; absent on shell.
  { name: "og:title", re: /<meta\b[^>]*property=["']og:title["']/i },
  // Twitter card likewise.
  { name: "twitter:card", re: /<meta\b[^>]*name=["']twitter:card["']/i },
];
// At least one of these structured-data types should appear once the page
// has actually rendered through React. The shell only has Organization+WebSite.
const STRUCTURED_TYPES = [
  "Article",
  "BlogPosting",
  "NewsArticle",
  "FAQPage",
  "BreadcrumbList",
  "CollectionPage",
  "ItemList",
  "Person",
  "AboutPage",
  "ContactPage",
  "WebPage",
  "VideoObject",
];

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

// 1. Determine expected routes from sitemap. The home route ("/") is
// ALWAYS required even if the sitemap parser misses it: the home page is
// the most important crawl target and a missing/shell home is a P0.
let expectedRoutes = [];
if (existsSync(SITEMAP)) {
  const xml = readFileSync(SITEMAP, "utf8");
  expectedRoutes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(ORIGIN))
    .map((u) => u.slice(ORIGIN.length) || "/");
}
if (!expectedRoutes.includes("/")) expectedRoutes.unshift("/");

const errors = [];
const missing = [];

// 2. Each sitemap route must have a matching dist file.
for (const route of expectedRoutes) {
  const file = routeToFile(route);
  if (!existsSync(file)) missing.push(route);
}

// 2b. Hard assertion: dist/index.html (the home page) must exist and must
// be in the crawl set. Without this, a prerender regression that drops "/"
// would only surface as a generic missing-route warning.
const HOME_FILE = join(DIST, "index.html");
if (!existsSync(HOME_FILE)) {
  console.error("[shell-check] FATAL: dist/index.html is missing — home page was not built/prerendered.");
  process.exit(1);
}

// 3. Every dist HTML file must look rendered, not shell.
const files = walk(DIST);
const checks = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const size = html.length;
  const m = html.match(ROOT_RE);
  const innerLen = (m ? m[1] : "").trim().length;
  const hasH1 = /<h1\b/i.test(html);
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const canonMatch = html.match(
    /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
  );
  const title = titleMatch ? titleMatch[1] : null;
  const canonical = canonMatch ? canonMatch[1] : null;
  const route = fileToRoute(file);

  // Collect every JSON-LD @type present on the page.
  const ldTypes = new Set();
  for (const blockMatch of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(blockMatch[1].trim());
      const collect = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) return node.forEach(collect);
        if (node["@type"]) {
          const types = Array.isArray(node["@type"])
            ? node["@type"]
            : [node["@type"]];
          for (const t of types) ldTypes.add(t);
        }
        if (node["@graph"]) collect(node["@graph"]);
      };
      collect(parsed);
    } catch {
      /* JSON parse handled by validate-jsonld.mjs */
    }
  }
  const hasPageStructuredData = STRUCTURED_TYPES.some((t) => ldTypes.has(t));

  // Tag-presence checks.
  const missingTags = REQUIRE_TAGS.filter((t) => !t.re.test(html)).map(
    (t) => t.name,
  );

  // Canonical-leak check: any non-home route whose canonical equals the home
  // canonical means the shell HTML was served instead of a prerendered page.
  const isHomeRoute = route === "/";
  const canonicalLeak =
    !isHomeRoute &&
    canonical &&
    canonical.replace(/\/+$/, "") === SHELL_HOME_CANONICAL.replace(/\/+$/, "");

  // Title-leak check: shell title is the home title; any non-home page
  // matching it byte-for-byte is suspicious.
  const SHELL_TITLE = "Deepgrain | Work with the grain.";
  const titleLeak = !isHomeRoute && title === SHELL_TITLE;

  const reasons = [];
  if (size < MIN_FILE_SIZE) reasons.push(`size=${size}B (< ${MIN_FILE_SIZE})`);
  if (innerLen < MIN_ROOT_INNER)
    reasons.push(`root inner=${innerLen}chars (< ${MIN_ROOT_INNER})`);
  if (!hasH1) reasons.push("no <h1>");
  if (missingTags.length) reasons.push(`missing tags: ${missingTags.join(", ")}`);
  if (canonicalLeak) reasons.push(`canonical leak (points to home: ${canonical})`);
  if (titleLeak) reasons.push(`title leak (matches shell home title)`);
  if (!hasPageStructuredData)
    reasons.push(
      `no page-level structured data (need one of ${STRUCTURED_TYPES.slice(0, 6).join("/")}/...)`,
    );

  checks.push({
    route,
    file: relative(DIST, file),
    size,
    rootInnerChars: innerLen,
    hasH1,
    title,
    canonical,
    ldTypes: [...ldTypes].sort(),
    missingTags,
    canonicalLeak,
    titleLeak,
    hasPageStructuredData,
    passed: reasons.length === 0,
    reasons,
  });

  if (reasons.length) {
    errors.push(`${route} (${relative(DIST, file)}): ${reasons.join("; ")}`);
  }
}

// 4. Write JSON + HTML reports regardless of pass/fail.
const REPORT_DIR = join(DIST, "_reports");
mkdirSync(REPORT_DIR, { recursive: true });

const summary = {
  generatedAt: new Date().toISOString(),
  origin: ORIGIN,
  expectedRoutes: expectedRoutes.length,
  checkedFiles: checks.length,
  missingRoutes: missing,
  failedRoutes: checks.filter((c) => !c.passed).map((c) => c.route),
  passed: missing.length === 0 && checks.every((c) => c.passed),
  thresholds: {
    minFileSize: MIN_FILE_SIZE,
    minRootInner: MIN_ROOT_INNER,
  },
  routes: checks,
};

writeFileSync(
  join(REPORT_DIR, "shell-check.json"),
  JSON.stringify(summary, null, 2),
);

const rows = checks
  .slice()
  .sort((a, b) => Number(a.passed) - Number(b.passed) || a.route.localeCompare(b.route))
  .map((c) => {
    const status = c.passed
      ? '<span style="color:#1F3A2E">✓</span>'
      : '<span style="color:#B33">✗</span>';
    const reasons = c.reasons.length ? c.reasons.join(", ") : "";
    const esc = (s) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    return `<tr class="${c.passed ? "" : "fail"}">
      <td>${status}</td>
      <td><code>${esc(c.route)}</code></td>
      <td>${c.size.toLocaleString()}</td>
      <td>${c.rootInnerChars.toLocaleString()}</td>
      <td>${c.hasH1 ? "yes" : "<b>no</b>"}</td>
      <td>${esc(c.title)}</td>
      <td><code>${esc(c.canonical)}</code></td>
      <td>${esc(reasons)}</td>
    </tr>`;
  })
  .join("\n");

const missingHtml = missing.length
  ? `<h2>Missing from dist (${missing.length})</h2><ul>${missing
      .map((r) => `<li><code>${r}</code></li>`)
      .join("")}</ul>`
  : "";

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Prerender shell check ${summary.generatedAt}</title>
<style>
  body{font:14px/1.5 -apple-system,Segoe UI,sans-serif;margin:2rem;color:#1a1a1a}
  h1{margin:0 0 .25rem}
  .meta{color:#555;margin-bottom:1.5rem}
  table{border-collapse:collapse;width:100%;font-size:13px}
  th,td{padding:6px 10px;border-bottom:1px solid #eee;text-align:left;vertical-align:top}
  th{background:#f5f3ee;position:sticky;top:0}
  tr.fail{background:#fff4f4}
  code{font:12px ui-monospace,Menlo,monospace}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:600}
  .ok{background:#e6f3eb;color:#1F3A2E}
  .bad{background:#fce5e5;color:#a00}
</style></head>
<body>
<h1>Prerender shell check</h1>
<p class="meta">
  Generated ${summary.generatedAt} ·
  ${summary.checkedFiles} file(s) checked ·
  ${summary.expectedRoutes} expected from sitemap ·
  <span class="badge ${summary.passed ? "ok" : "bad"}">${summary.passed ? "PASS" : "FAIL"}</span>
</p>
${missingHtml}
<h2>Routes</h2>
<table>
  <thead><tr>
    <th></th><th>Route</th><th>Size (B)</th><th>Root inner</th><th>h1</th><th>Title</th><th>Canonical</th><th>Failure reasons</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
</body></html>`;

writeFileSync(join(REPORT_DIR, "shell-check.html"), html);

console.log(
  `[shell-check] checked ${checks.length} prerendered file(s); ${expectedRoutes.length} expected from sitemap`,
);
console.log(
  `[shell-check] reports: ${relative(ROOT, join(REPORT_DIR, "shell-check.json"))}, ${relative(ROOT, join(REPORT_DIR, "shell-check.html"))}`,
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
