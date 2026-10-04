/**
 * Route chunks are fetched lazily. When one of those requests fails (a dropped
 * connection, a dev server restart, a stale module URL after a deploy) the
 * browser caches that module URL as failed for the lifetime of the document, so
 * retrying inside the same page always fails again. The only real recovery is a
 * fresh document.
 *
 * So: reload once, and only once inside a cooldown window. A chunk that is
 * genuinely missing then fails a second time inside the cooldown, the error is
 * rethrown, and the route error boundary renders a fallback instead of a blank
 * page.
 */
const MARKER = "deepgrain:chunk-reload-at";
const COOLDOWN_MS = 20_000;

/** A reload is in flight; later failures should wait it out, not fight it. */
let reloading = false;

const markerStore = (): Storage | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const clearChunkReloadMarker = (): void => {
  reloading = false;
  try {
    window.sessionStorage.removeItem(MARKER);
  } catch {
    /* storage unavailable */
  }
};

/**
 * True the first time a chunk failure is seen, false while the cooldown lasts.
 * Session-scoped, so a later and unrelated failure can still recover.
 */
export const claimChunkReload = (): boolean => {
  const now = Date.now();
  const store = markerStore();
  let raw: string | null = null;
  try {
    raw = store?.getItem(MARKER) ?? null;
  } catch {
    /* unreadable marker: treat as no prior attempt */
  }
  if (raw !== null && now - Number(raw) < COOLDOWN_MS) return false;
  try {
    store?.setItem(MARKER, String(now));
  } catch {
    /* storage unavailable: fall through to a reload anyway */
  }
  return true;
};

/**
 * Wraps a `lazy()` import factory. On failure it reloads the document once and
 * keeps the import pending while the swap happens, so React never unmounts the
 * tree into a blank page. Past the cooldown the error is rethrown for the
 * boundary to catch.
 */
export const recoverable =
  <T,>(load: () => Promise<T>) =>
  async (): Promise<T> => {
    try {
      return await load();
    } catch (error) {
      if (reloading) return new Promise<T>(() => {});
      if (claimChunkReload()) {
        reloading = true;
        window.location.reload();
        return new Promise<T>(() => {});
      }
      throw error;
    }
  };
