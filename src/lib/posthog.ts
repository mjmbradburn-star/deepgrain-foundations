/**
 * PostHog (EU cloud) loader and event mirror.
 *
 * Why this file exists: GA4 cannot show where buyers drop between our pages and
 * Stripe. PostHog adds session replay, funnels and web analytics for that.
 *
 * Design:
 * - No npm dependency. array.js is loaded after window 'load' (same approach
 *   as GA in index.html) so it stays off the critical path.
 * - Events fired before the script arrives are queued, then flushed.
 * - Production hosts only (deepgrain.ai and subdomains). Localhost and Vercel
 *   previews send nothing.
 * - Every call to track() in src/lib/analytics.ts is mirrored here with the
 *   same event name and params, so GA4 and PostHog stay in step.
 * - Session replay masks all form inputs (email capture, contact form).
 *
 * Events added here (names are snake_case, object_action):
 *   $pageview            automatic, SPA route changes included
 *   checkout_started     click on a Stripe checkout link. Props: plan, link_url, page_path
 *   checkout_completed   visitor lands back on the site with ?checkout=success
 *                        (needs the Stripe Payment Link "after payment" redirect
 *                        set to https://www.deepgrain.ai/waitlist?checkout=success)
 *
 * Stripe checkout itself is hosted by Stripe, so PostHog only sees the click out
 * and the return. A buyer who opens Stripe from an email never touches the site.
 */

import { checkoutSessionId, isGenuineCheckoutReturn } from "@/lib/checkoutReturn";

type Params = Record<string, string | number | boolean | undefined | null>;

const POSTHOG_KEY = "phc_AQZxWeBUJjJ6YLf8NDJZAL2WQ6sZfeUmoB4hJd2T5VZd";
// First-party managed reverse proxy (PostHog managed proxy, CNAME r.deepgrain.ai) so ad blockers do not drop events.
const API_HOST = "https://r.deepgrain.ai";
const ASSET_HOST = "https://r.deepgrain.ai";
const UI_HOST = "https://eu.posthog.com";

/** Stripe Payment Links used on /waitlist. Keep in step with COURSE in src/pages/Waitlist.tsx. */
const PLAN_BY_LINK: Record<string, string> = {
  "9B66oJfwYdv2bwV1TXbAs00": "founding",
  "9B65kFgB29eM30p8ilbAs01": "standard",
};

type PostHogLike = {
  init: (key: string, config: Record<string, unknown>) => void;
  capture: (event: string, props?: Record<string, unknown>) => void;
  identify: (id: string, props?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    posthog?: PostHogLike;
  }
}

const queue: Array<[string, Record<string, unknown>]> = [];
let pendingIdentify: [string, Record<string, unknown>] | null = null;
let ready = false;
let started = false;

const isProductionHost = () =>
  typeof window !== "undefined" && /(^|\.)deepgrain\.ai$/i.test(window.location.hostname);

const clean = (params: Params): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
};

export function captureEvent(event: string, params: Params = {}) {
  if (!isProductionHost()) return;
  const props = clean(params);
  if (ready && window.posthog) {
    window.posthog.capture(event, props);
  } else {
    if (queue.length < 50) queue.push([event, props]);
  }
}

/**
 * Link this browser to a person, but only after they typed their email into one
 * of our own forms and submitted it. Never called on page load, never guessed.
 * The email becomes the PostHog distinct id, so person profiles carry the email,
 * first-touch UTM and geo, and the full click and replay history from before the
 * form was filled is merged in.
 */
export function identifyPerson(email: string, props: Params = {}) {
  if (!isProductionHost()) return;
  const id = email.trim().toLowerCase();
  if (!id) return;
  const p = { ...clean(props), email: id };
  if (ready && window.posthog) window.posthog.identify(id, p);
  else pendingIdentify = [id, p];
}

const stripeLinkId = (href: string): string | null => {
  try {
    const u = new URL(href, window.location.origin);
    if (u.hostname !== "buy.stripe.com" && u.hostname !== "checkout.stripe.com") return null;
    return u.pathname.replace(/^\//, "") || "unknown";
  } catch {
    return null;
  }
};

function watchCheckoutClicks() {
  document.addEventListener(
    "click",
    (e) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      const href = anchor?.getAttribute("href");
      if (!href) return;
      const id = stripeLinkId(href);
      if (!id) return;
      captureEvent("checkout_started", {
        plan: PLAN_BY_LINK[id] ?? "unknown",
        link_url: href,
        page_path: window.location.pathname,
      });
    },
    { capture: true },
  );
}

function detectCheckoutReturn() {
  // Only a genuine return from Stripe counts as a purchase. A bare
  // ?checkout=success visit (typed, shared, bookmarked) records nothing.
  if (!isGenuineCheckoutReturn()) return;
  const sessionId = checkoutSessionId();
  const dedupeKey = sessionId ? `dg_checkout_completed_${sessionId}` : "dg_checkout_completed";
  try {
    if (window.sessionStorage.getItem(dedupeKey)) return;
    window.sessionStorage.setItem(dedupeKey, "1");
  } catch {
    /* storage blocked, fire anyway */
  }
  captureEvent("checkout_completed", {
    page_path: window.location.pathname,
    stripe_session_id: sessionId ?? undefined,
  });
}

function loadScript() {
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `${ASSET_HOST}/static/array.js`;
  s.onload = () => {
    if (!window.posthog) return;
    window.posthog.init(POSTHOG_KEY, {
      api_host: API_HOST,
      ui_host: UI_HOST,
      defaults: "2025-05-24", // SPA pageviews on history change
      person_profiles: "identified_only", // profiles only after identifyPerson() (email submitted on our forms)
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "[data-ph-mask]",
      },
    });
    ready = true;
    if (pendingIdentify) {
      window.posthog.identify(pendingIdentify[0], pendingIdentify[1]);
      pendingIdentify = null;
    }
    for (const [ev, props] of queue.splice(0)) window.posthog.capture(ev, props);
  };
  document.head.appendChild(s);
}

export function initPostHog() {
  if (started || !isProductionHost()) return;
  started = true;
  watchCheckoutClicks();
  detectCheckoutReturn();
  const start = () => setTimeout(loadScript, 0);
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

initPostHog();
