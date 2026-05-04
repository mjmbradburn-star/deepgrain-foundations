import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const MEASUREMENT_ID = "G-93DFWMX8GP";
const SITE_HOST = "deepgrain.ai";

/**
 * Fires a GA4 page_view on every client-side route change, plus a delegated
 * document-level listener that emits a single `click` event for outbound
 * links, mailto:, and tel: taps. Keeping this delegated avoids touching every
 * <a> in the codebase and survives any new links added later.
 *
 * Event shape (all use GA4's reserved `click` name so they show up in the
 * standard Engagement > Events report without custom dimensions):
 *   click { outbound: true,  link_url, link_domain, link_text }   external
 *   click { link_type: "email", link_url: "mailto:...", link_text } mailto:
 *   click { link_type: "phone", link_url: "tel:...",   link_text }  tel:
 */
export const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const path = location.pathname + location.search;
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      send_to: MEASUREMENT_ID,
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      const text = (anchor.textContent || "").trim().slice(0, 100);

      if (href.startsWith("mailto:")) {
        track("click", { link_type: "email", link_url: href, link_text: text });
        return;
      }
      if (href.startsWith("tel:")) {
        track("click", { link_type: "phone", link_url: href, link_text: text });
        return;
      }
      if (/^https?:\/\//i.test(href)) {
        try {
          const u = new URL(href, window.location.origin);
          if (u.host && u.host !== window.location.host && !u.host.endsWith(SITE_HOST)) {
            track("click", {
              outbound: true,
              link_url: href,
              link_domain: u.host,
              link_text: text,
            });
          }
        } catch {
          /* malformed href, ignore */
        }
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
};
