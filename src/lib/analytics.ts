/**
 * Thin GA4 helper. Centralises the `window.gtag` call so components don't have
 * to know about the global, and so we can swap or mute analytics in one place.
 *
 * GA4 reserved event names we use:
 *   page_view        fired by src/components/analytics/Analytics.tsx
 *   form_submit      one per successful form submission
 *   click            generic outbound/email/phone click (categorised via params)
 *
 * Custom event names we add:
 *   form_submit_attempt  user pressed submit (before validation/network)
 *
 * Parameter names follow GA4 conventions where possible (link_url, link_domain,
 * outbound, form_id) so the events show up in standard reports without custom
 * dimensions.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type Params = Record<string, string | number | boolean | undefined | null>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  // Strip nullish so GA4 doesn't store empty strings.
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") clean[k] = v;
  }
  window.gtag("event", event, clean);
}

/** Convenience: fire a `form_submit` event with consistent params. */
export function trackFormSubmit(formId: string, extra: Params = {}) {
  track("form_submit", { form_id: formId, ...extra });
}
