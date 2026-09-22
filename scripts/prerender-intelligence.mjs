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
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, statSync, createReadStream } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const SITEMAP = join(ROOT, "public", "sitemap.xml");
import { ORIGIN as SITE_ORIGIN } from "./lib/origin.mjs";

if (process.env.DEEPGRAIN_SKIP_PRERENDER === "1") {
  console.log("[prerender] DEEPGRAIN_SKIP_PRERENDER=1 set, skipping.");
  process.exit(0);
}

if (!existsSync(DIST) || !existsSync(join(DIST, "index.html"))) {
  console.warn("[prerender] dist/ or dist/index.html missing, skipping.");
  process.exit(0);
}

// Preserve the pristine SPA shell before any route overwrites dist/index.html.
// Vercel (or any static host with real 404s) serves shell.html for the few
// app-only routes that are intentionally not prerendered (/login,
// /unsubscribe, /brain/resend, /.lovable/oauth/consent), so those routes boot
// the client app without masquerading as the homepage.
copyFileSync(join(DIST, "index.html"), join(DIST, "shell.html"));
console.log("[prerender] preserved SPA shell -> dist/shell.html");

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

// --- 2. Serve dist/ locally ---
// Serve dist/ over a plain node static server. (`npx vite preview` is
// unreliable inside hosted build containers; this has zero dependencies.)
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};
const server = createServer((req, res) => {
  try {
    const u = new URL(req.url, "http://localhost");
    let p = decodeURIComponent(u.pathname);
    if (p.endsWith("/")) p += "index.html";
    let file = join(DIST, p);
    if (!existsSync(file) && !extname(p)) file = join(DIST, p, "index.html");
    if (!existsSync(file) || statSync(file).isDirectory()) {
      // SPA fallback (mirrors `vite preview`): extensionless paths are app
      // routes - serve the pristine shell so the router can render them.
      // Prerendered route files are only written after the page is rendered.
      if (!extname(p)) {
        file = join(DIST, "shell.html");
      } else {
        res.writeHead(404);
        res.end("not found");
        return;
      }
    }
    res.writeHead(200, {
      "content-type": MIME[extname(file).toLowerCase()] ?? "application/octet-stream",
    });
    createReadStream(file).pipe(res);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const previewUrl = `http://127.0.0.1:${port}`;

const cleanup = () => {
  try { server.close(); } catch {}
};
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});

// --- 3. Launch puppeteer ---
// Hosted build containers (Vercel) lack the system libs Chrome needs, so
// there we use the serverless chromium build instead of the bundled one.
let browser;
if (process.env.VERCEL) {
  const chromium = (await import("@sparticuz/chromium")).default;
  const puppeteerCore = (await import("puppeteer-core")).default;
  browser = await puppeteerCore.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: "shell",
  });
  console.log("[prerender] launched @sparticuz/chromium (Vercel build env)");
} else {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

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
      // Retry loop: if the ready marker never appears we would snapshot the
      // bare SPA shell (noindex fallbacks) and count it as rendered. Reload
      // up to 3 times; if it still never readies, the validators fail the
      // build loudly in fatal mode.
      let readyOk = false;
      for (let attempt = 1; attempt <= 3 && !readyOk; attempt++) {
        if (attempt > 1) {
          console.warn(
            `[prerender] retry ${attempt}/3 for ${route} (ready marker missing)`,
          );
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

        // Wait for the SiteShell's [data-prerender-ready] marker. This proves
        // React + the route component + Helmet all flushed, not just that an
        // <h1> exists somewhere in the shell.
        readyOk = await page
          .waitForSelector("[data-prerender-ready='true']", { timeout: 15_000 })
          .then(() => true)
          .catch(() => false);
        if (readyOk) {
          // The shell marker can beat Helmet's PageMeta flush under load:
          // body rendered, head still carrying the static noindex fallbacks
          // and no canonical. Every prerendered route emits a canonical, so
          // gate on it too and let the retry loop catch the race.
          readyOk = await page
            .waitForSelector('link[rel="canonical"]', { timeout: 10_000 })
            .then(() => true)
            .catch(() => false);
        }
      }
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

        // De-duplicate SEO meta tags. index.html ships generic fallbacks for
        // non-prerendered pages and JS-less social scrapers; PageMeta (Helmet)
        // emits the correct per-page versions, tagged with data-rh. When both
        // exist, crawlers read the first (static, generic) one - which made
        // every prerendered page look identically templated to Google. Drop
        // the static duplicate wherever a Helmet version is present.
        const managed = [
          ["name", "robots"],
          ["name", "googlebot"],
          ["name", "description"],
          ["property", "og:title"],
          ["property", "og:description"],
          ["property", "og:url"],
          ["property", "og:type"],
          ["property", "og:image"],
          ["name", "twitter:card"],
          ["name", "twitter:title"],
          ["name", "twitter:description"],
          ["name", "twitter:image"],
        ];
        for (const [attr, val] of managed) {
          const nodes = [
            ...document.querySelectorAll(`meta[${attr}="${val}"]`),
          ];
          if (nodes.length < 2) continue;
          const helmet = nodes.find((n) => n.hasAttribute("data-rh"));
          if (helmet) {
            nodes.forEach((n) => {
              if (n !== helmet) n.remove();
            });
          }
        }
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
  // --- 4. Static 404 page ---
  // Hosts that support it (Vercel) serve dist/404.html with a real 404
  // status for unmatched paths. Render the app's NotFound route once, with
  // the same shell cleanup as prerendered routes. Its PageMeta emits
  // noindex,follow.
  {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1280, height: 900 });
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const t = req.resourceType();
        if (t === "image" || t === "media" || t === "font") req.abort();
        else req.continue();
      });
      await page.goto(previewUrl + "/__not-found-render__", {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page
        .waitForSelector("[data-prerender-ready='true']", { timeout: 15_000 })
        .catch(() => null);
      await page.evaluate(() => {
        document
          .querySelectorAll('script[type="module"][src*="@vite/client"]')
          .forEach((n) => n.remove());
        document
          .querySelectorAll("[data-cookie-banner]")
          .forEach((n) => n.remove());
        for (const name of ["robots", "googlebot"]) {
          const nodes = [...document.querySelectorAll(`meta[name="${name}"]`)];
          const helmet = nodes.find((n) => n.hasAttribute("data-rh"));
          if (helmet) nodes.forEach((n) => { if (n !== helmet) n.remove(); });
        }
      });
      let html = await page.content();
      html = html.replaceAll(previewUrl, SITE_ORIGIN);
      writeFileSync(join(DIST, "404.html"), html, "utf8");
      console.log("[prerender] wrote dist/404.html");
    } catch (e) {
      console.warn(`[prerender] 404 render failed: ${e.message}`);
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
// In CI / fatal-validators mode, any failure must stop the build. Locally
// we keep the soft-exit so a flaky puppeteer step doesn't block iteration.
const fatal =
  process.env.CI === "true" ||
  process.env.CI === "1" || // Vercel build env sets CI=1
  process.env.DEEPGRAIN_FATAL_VALIDATORS === "1";
if (failed > 0 && fatal) {
  console.error(`[prerender] FATAL: ${failed} route(s) failed to prerender.`);
  process.exit(1);
}
process.exit(0);
