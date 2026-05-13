import type { Plugin } from "vite";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

/**
 * Runs the prerender + JSON-LD validate scripts inside `vite build` itself
 * (closeBundle hook) instead of relying on npm's `postbuild` lifecycle, which
 * Lovable's hosting builder does not reliably execute.
 *
 * Skips on dev/serve and when DEEPGRAIN_SKIP_PRERENDER=1.
 */
export function deepgrainPrerenderPlugin(): Plugin {
  let isBuild = false;
  return {
    name: "deepgrain-prerender",
    apply: "build",
    configResolved(c) {
      isBuild = c.command === "build";
    },
    async closeBundle() {
      if (!isBuild) return;
      if (process.env.DEEPGRAIN_SKIP_PRERENDER === "1") {
        console.log("[prerender-plugin] skipped via env flag.");
        return;
      }

      // Resolve repo root from this file's location.
      const here = dirname(fileURLToPath(import.meta.url));
      const root = join(here, "..");
      const dist = join(root, "dist");
      if (!existsSync(dist)) {
        console.warn("[prerender-plugin] dist/ missing, skipping.");
        return;
      }

      const run = (script: string) =>
        new Promise<void>((resolve, reject) => {
          const child = spawn(
            process.execPath,
            [join(root, "scripts", script)],
            { cwd: root, stdio: "inherit", env: process.env },
          );
          child.on("error", reject);
          child.on("exit", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${script} exited ${code}`));
          });
        });

      // In CI we want validators to be fatal so a broken build never
      // ships. Locally (Lovable preview, dev sandboxes) we keep them
      // non-fatal so a flaky puppeteer step doesn't block iteration.
      const fatal = process.env.CI === "true" || process.env.DEEPGRAIN_FATAL_VALIDATORS === "1";
      try {
        await run("audit-routes.mjs");
        await run("prerender-intelligence.mjs");
        await run("validate-jsonld.mjs");
        await run("validate-canonicals.mjs");
        await run("validate-shell.mjs");
      } catch (err) {
        if (fatal) {
          console.error("[prerender-plugin] FATAL (CI):", err);
          throw err;
        }
        console.error("[prerender-plugin] non-fatal failure:", err);
      }
    },
  };
}
