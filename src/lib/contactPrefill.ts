/**
 * Contact-form prefill links.
 *
 * The prefill travels in the URL fragment (`/contact#write&subject=...`), not
 * the query string. Fragments never reach the server or the crawler, so these
 * CTAs no longer mint dozens of indexable `/contact?subject=...` URL variants.
 * The first fragment segment is the scroll target (`write`); ScrollToTop only
 * reads the part before `&`.
 */
export const PREFILL_MAX = 500;

export const contactPrefillHref = (prefill: string) =>
  `/contact#write&subject=${encodeURIComponent(prefill)}`;

/** Read a prefill from the fragment, falling back to the legacy `?subject=`. */
export const readContactPrefill = (search: string, hash: string): string => {
  const fromHash = new URLSearchParams(hash.replace(/^#/, "")).get("subject");
  const fromQuery = new URLSearchParams(search).get("subject");
  return (fromHash ?? fromQuery ?? "").slice(0, PREFILL_MAX);
};

/** True when the URL carries a prefill (fragment or legacy query), even an empty one. */
export const hasContactPrefill = (search: string, hash: string): boolean =>
  new URLSearchParams(hash.replace(/^#/, "")).has("subject") ||
  new URLSearchParams(search).has("subject");
