/**
 * Single source of truth for the production ORIGIN used by SEO scripts.
 *
 * Resolution order:
 *   1. process.env.DEEPGRAIN_ORIGIN (explicit override)
 *   2. DEFAULT_ORIGIN below
 *
 * All resolved values are validated against ALLOWED_ORIGINS so a typo or
 * www/non-www mismatch fails fast, instead of producing a sitemap whose
 * <loc> origins disagree with the audit script.
 */

export const DEFAULT_ORIGIN = "https://www.deepgrain.ai";

export const ALLOWED_ORIGINS = new Set([
  "https://www.deepgrain.ai",
  "https://deepgrain.ai",
  "https://deepgrain-foundations.lovable.app",
  "https://id-preview--f0680e91-b62d-4cc6-9160-3c03de79a1b4.lovable.app",
]);

export function resolveOrigin() {
  const raw = (process.env.DEEPGRAIN_ORIGIN || DEFAULT_ORIGIN).trim();
  const normalised = raw.replace(/\/+$/, "");
  if (!/^https?:\/\//.test(normalised)) {
    console.error(
      `[origin] FATAL: DEEPGRAIN_ORIGIN "${raw}" must be an absolute http(s) URL.`,
    );
    process.exit(1);
  }
  if (!ALLOWED_ORIGINS.has(normalised)) {
    console.error(
      `[origin] FATAL: ORIGIN "${normalised}" is not in the allow-list. ` +
        `Allowed: ${[...ALLOWED_ORIGINS].join(", ")}. ` +
        `Either set DEEPGRAIN_ORIGIN to one of these or add the new value to scripts/lib/origin.mjs.`,
    );
    process.exit(1);
  }
  return normalised;
}

export const ORIGIN = resolveOrigin();
