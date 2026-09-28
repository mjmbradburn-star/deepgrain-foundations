import { lazy, type ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModuleWithDefault = { default: ComponentType<any> };

const RELOAD_STAMP = "deepgrain:chunk-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;

/** Set once this document has asked for a reload, so sibling chunks that fail
 *  in the same window are held open instead of unmounting the tree. */
let reloadTriggered = false;

/**
 * Chunk-load failures are worded differently per engine and bundler: Chrome
 * says "Failed to fetch dynamically imported module", Safari says "Importing a
 * module script failed", a dev server mid-restart returns 502/504, Rollup says
 * "Loading chunk ... failed". All of them mean the same recoverable thing.
 */
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /dynamically imported module|importing a module script failed|loading (?:css )?chunk|could not resolve|failed to import|request failed with status code 5\d\d/i.test(
    message,
  );
}

/**
 * A failed ES module import is memoised as errored in the browser module map,
 * so re-importing the same URL rejects without issuing a new request: retrying
 * is useless, only a fresh document re-resolves it. Reload once per burst, hold
 * any sibling failure open while that reload runs, and only hand a genuine
 * second failure to the boundary so it never reloads forever.
 */
export function recoverFromChunkFailure(error: unknown): Promise<never> {
  if (!isChunkLoadError(error)) throw error;
  if (reloadTriggered) return new Promise<never>(() => {});

  const now = Date.now();
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(RELOAD_STAMP));
  } catch {
    /* storage unavailable (private mode): fall through and reload anyway */
  }
  if (!Number.isFinite(last)) last = 0;
  if (now - last < RELOAD_COOLDOWN_MS) throw error;

  reloadTriggered = true;
  try {
    sessionStorage.setItem(RELOAD_STAMP, String(now));
  } catch {
    /* best effort: the stamp only prevents a reload loop across documents */
  }
  window.location.reload();
  return new Promise<never>(() => {});
}

export function lazyWithRecovery<T extends ModuleWithDefault["default"]>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(() => factory().catch(recoverFromChunkFailure));
}
