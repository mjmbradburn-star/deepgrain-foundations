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
  const route = fileToRoute(file);

  const reasons = [];
  if (size < MIN_FILE_SIZE) reasons.push(`size=${size}B`);
  if (innerLen < MIN_ROOT_INNER)
    reasons.push(`root inner=${innerLen}chars`);
  if (!hasH1) reasons.push("no <h1>");

  checks.push({
    route,
    file: relative(DIST, file),
    size,
    rootInnerChars: innerLen,
    hasH1,
    title: titleMatch ? titleMatch[1] : null,
    canonical: canonMatch ? canonMatch[1] : null,
    passed: reasons.length === 0,
    reasons,
  });

  if (reasons.length) {
    errors.push(`${route} (${relative(DIST, file)}): ${reasons.join(", ")}`);
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
