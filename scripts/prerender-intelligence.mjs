#!/usr/bin/env node
/**
 * Build-time prerender for every public route in sitemap.xml.
 *
 * Why: Deepgrain ships as a Vite SPA. LLM crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, CCBot), most social scrapers, and Google's video indexer
 * do not execute JavaScript reliably, so they see an empty <div id="root">
 * on every route. This script post-processes the `dist` output to write
 * fully-rendered static HTML for every URL listed in sitemap.xml.
 *
 * How:
 *   1. `vite build` has already produced dist/index.html (the SPA shell).
 *   2. We launch `vite preview` against `dist/` on a local port.
 *   3. We launch headless Chromium and visit every URL on the deepgrain.ai
 *      origin in the sitemap.
 *   4. For each route we wait for an <h1> to appear, then snapshot the
 *      fully-rendered DOM and write it to `dist/<route>/index.html` (or
 *      dist/index.html for the root).
 *   5. Lovable's hosting serves real files when present and falls back to
 *      index.html otherwise, so no redirect rules are needed.
 *
 * Usage: runs automatically via `postbuild`. Skip locally with
 * `DEEPGRAIN_SKIP_PRERENDER=1 npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const SITEMAP = join(ROOT, "public", "sitemap.xml");
const SITE_ORIGIN = "https://deepgrain.ai";

if (process.env.DEEPGRAIN_SKIP_PRERENDER === "1") {
  console.log("[prerender] DEEPGRAIN_SKIP_PRERENDER=1 set, skipping.");
  process.exit(0);
}

if (!existsSync(DIST) || !existsSync(join(DIST, "index.html"))) {
  console.warn("[prerender] dist/ or dist/index.html missing, skipping.");
  process.exit(0);
}

// Lazy import puppeteer so a missing devDep does not crash non-build flows.
let puppeteer;
try {
  puppeteer = (await import("puppeteer")).default;
} catch (e) {
  console.warn("[prerender] puppeteer not installed, skipping.", e.message);
  process.exit(0);
}

// --- 1. Collect routes from sitemap, restricted to /intelligence/* ---
const sitemapXml = readFileSync(SITEMAP, "utf8");
const allLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
const routes = allLocs
  .filter((u) => u.startsWith(SITE_ORIGIN))
  .map((u) => u.slice(SITE_ORIGIN.length) || "/");

if (!routes.length) {
  console.warn("[prerender] no routes in sitemap, skipping.");
  process.exit(0);
}
console.log(`[prerender] found ${routes.length} routes (all of sitemap).`);

// --- 2. Find an open port and start `vite preview` ---
const port = await new Promise((resolve, reject) => {
  const srv = createServer();
  srv.unref();
  srv.on("error", reject);
  srv.listen(0, () => {
    const p = srv.address().port;
    srv.close(() => resolve(p));
  });
});

const preview = spawn(
  "npx",
  ["vite", "preview", "--port", String(port), "--strictPort"],
  { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] },
);
const previewUrl = `http://localhost:${port}`;
let previewReady = false;
preview.stdout.on("data", (d) => {
  if (d.toString().includes("Local:")) previewReady = true;
});
preview.stderr.on("data", (d) => process.stderr.write(`[vite preview] ${d}`));

const cleanup = () => {
  if (!preview.killed) preview.kill("SIGTERM");
};
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});

// Poll until preview is responsive.
const deadline = Date.now() + 30_000;
while (!previewReady && Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 200));
}
if (!previewReady) {
  console.error("[prerender] vite preview did not start in 30s.");
  cleanup();
  process.exit(1);
}

// --- 3. Launch puppeteer ---
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

let ok = 0;
let failed = 0;
const failures = [];

try {
  // Sequential to keep memory predictable in the build sandbox.
  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1280, height: 900 });
      // Block heavy assets we don't need for static HTML output.
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const t = req.resourceType();
        if (t === "image" || t === "media" || t === "font") req.abort();
        else req.continue();
      });

      const url = previewUrl + route;
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });

      // Wait for the SiteShell's [data-prerender-ready] marker. This proves
      // React + the route component + Helmet all flushed, not just that an
      // <h1> exists somewhere in the shell.
      await page
        .waitForSelector("[data-prerender-ready='true']", { timeout: 15_000 })
        .catch(() => null);
      // Belt and braces: also confirm an <h1> rendered.
      await page
        .waitForSelector("h1", { timeout: 5_000 })
        .catch(() => null);

      // Strip the Vite preview client, HMR scripts, and the post-hydration
      // cookie banner (visual-only, hydrates client-side anyway).
      await page.evaluate(() => {
        document
          .querySelectorAll('script[type="module"][src*="@vite/client"]')
          .forEach((n) => n.remove());
        // Cookie banner is mounted client-side; remove from snapshot so it
        // doesn't appear in JS-disabled previews until consent state loads.
        document
          .querySelectorAll('[data-cookie-banner]')
          .forEach((n) => n.remove());
      });

      let html = await page.content();

      // Rewrite localhost references back to canonical origin so any
      // accidentally-inlined absolute URLs do not leak.
      html = html.replaceAll(previewUrl, SITE_ORIGIN);

      // Write to dist/<route>/index.html. Root /intelligence becomes
      // dist/intelligence/index.html (which already exists if SPA shell
      // was copied there, but we overwrite with the rendered version).
      const cleanRoute = route.replace(/^\/+|\/+$/g, "");
      const outDir = cleanRoute ? join(DIST, cleanRoute) : DIST;
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, "index.html"), html, "utf8");
      ok++;
    } catch (e) {
      failed++;
      failures.push({ route, error: e.message });
      console.warn(`[prerender] FAILED ${route}: ${e.message}`);
    } finally {
      await page.close().catch(() => {});
    }
  }
} finally {
  await browser.close().catch(() => {});
  cleanup();
}

console.log(`[prerender] done. rendered=${ok} failed=${failed}`);
if (failures.length) {
  for (const f of failures) console.log(`  - ${f.route}: ${f.error}`);
}
// Don't fail the build over a few flaky routes; the SPA fallback still works.
process.exit(0);
