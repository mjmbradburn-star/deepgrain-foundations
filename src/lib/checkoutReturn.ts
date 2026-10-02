/**
 * Decides whether the current page load is a genuine return from Stripe
 * Checkout, as opposed to someone typing or sharing /waitlist?checkout=success.
 *
 * Signals, strongest first:
 *   1. ?session_id=cs_live_... (set the Payment Link "after payment" redirect
 *      to https://www.deepgrain.ai/waitlist?checkout=success&session_id={CHECKOUT_SESSION_ID})
 *   2. document.referrer is Stripe's hosted checkout (checkout.stripe.com or
 *      buy.stripe.com), which is what a real post-payment redirect carries.
 *
 * Both are client-side checks, so a determined visitor could still fake them.
 * Server-side verification of the session against Stripe would need a backend
 * function; this removes the accidental and casual cases that were inflating
 * conversions.
 */
const STRIPE_HOSTS = new Set(["checkout.stripe.com", "buy.stripe.com"]);
const LIVE_SESSION = /^cs_live_[A-Za-z0-9]{20,}$/;

export function checkoutSessionId(): string | null {
  if (typeof window === "undefined") return null;
  const id = new URLSearchParams(window.location.search).get("session_id");
  return id && LIVE_SESSION.test(id) ? id : null;
}

export function isGenuineCheckoutReturn(): boolean {
  if (typeof window === "undefined") return false;
  const qs = new URLSearchParams(window.location.search);
  if (qs.get("checkout") !== "success") return false;
  if (checkoutSessionId()) return true;
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    return STRIPE_HOSTS.has(host);
  } catch {
    return false;
  }
}
