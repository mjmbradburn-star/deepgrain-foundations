/**
 * Checkout email step (added 9 Oct 2026).
 *
 * Why: Stripe Payment Links only record a buyer's email on a session if they pay,
 * tick the promo-consent box, or we hand Stripe the email first. Handing it over
 * (prefilled_email) means abandoned checkouts keep a name.
 *
 * What it does: a click on a buy.stripe.com link on the page asks for an email
 * first. "Continue without email" goes straight to the plain link. Submitting
 * opens the link with ?prefilled_email=<email>&client_reference_id=<PostHog id>
 * and identifies the person in PostHog. No database write, no welcome email.
 * The consent box is unticked by default; the answer is stored on the PostHog
 * person as marketing_consent_claimed only; real consent is set server-side after payment.
 * Course links (founding/standard) go through /api/api/checkout-session, which creates a
 * Checkout Session with the email attached; any failure falls back to the plain Payment
 * Link with ?prefilled_email. The modal always opens; a stored or ?email= address is only a
 * prefill the buyer must confirm.
 * Imported for side effects from src/pages/Waitlist.tsx.
 */
import { identifyPerson } from "@/lib/posthog";

/** Flip to false to bring back a "Continue without email" link. */
const REQUIRE_EMAIL = true;
const SESSION_ENDPOINT = "/api/api/checkout-session";
const PLAN_BY_LINK: Record<string, string> = {
  "9B66oJfwYdv2bwV1TXbAs00": "founding",
  "9B65kFgB29eM30p8ilbAs01": "standard",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KEY = "dg_checkout_email";
const CONSENT_KEY = "dg_checkout_consent";
const CONSENT_TEXT = "Email me about this course, cohort dates and occasional updates from Deepgrain. Unsubscribe any time.";
let installed = false;

const isStripeHref = (href: string | null | undefined) => {
  if (!href) return false;
  try {
    return new URL(href, window.location.origin).hostname === "buy.stripe.com";
  } catch {
    return false;
  }
};

const anonId = (): string => {
  try {
    const w = window as unknown as { posthog?: { get_distinct_id?: () => string } };
    const raw = w.posthog?.get_distinct_id?.() ?? "";
    // client_reference_id allows [A-Za-z0-9_-], max 200. Skip it if the id is an email.
    return raw.includes("@") ? "" : raw.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 100);
  } catch {
    return "";
  }
};

const build = (href: string, email: string | null): string => {
  const u = new URL(href, window.location.origin);
  if (email) u.searchParams.set("prefilled_email", email);
  const ref = anonId();
  if (ref) u.searchParams.set("client_reference_id", ref);
  return u.toString();
};

const planFor = (href: string): string | null => {
  try {
    const id = new URL(href, window.location.origin).pathname.replace(/^\//, "");
    return PLAN_BY_LINK[id] ?? null;
  } catch {
    return null;
  }
};

/**
 * Open checkout in a new tab. The tab is opened synchronously (so popup blockers allow it),
 * then pointed at a server-made Checkout Session, or at the plain link on any failure.
 */
const launch = async (href: string, email: string | null, consent: boolean, ref: string) => {
  const fallback = build(href, email);
  const tab = window.open("about:blank", "_blank");
  if (!tab) {
    window.location.href = fallback;
    return;
  }
  try {
    tab.opener = null;
  } catch {
    /* ignore */
  }
  const plan = planFor(href);
  let target = fallback;
  if (plan && email) {
    try {
      const ctl = new AbortController();
      const timer = window.setTimeout(() => ctl.abort(), 8000);
      const r = await fetch(SESSION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email, consent, ref }),
        signal: ctl.signal,
      });
      window.clearTimeout(timer);
      const j = r.ok ? await r.json() : null;
      if (j && typeof j.url === "string" && j.url.startsWith("https://checkout.stripe.com/")) target = j.url;
      else track("checkout_session_fallback", { reason: r.ok ? "bad_response" : `http_${r.status}`, plan });
    } catch (err) {
      track("checkout_session_fallback", { reason: (err as Error)?.name === "AbortError" ? "timeout" : "network", plan });
    }
  }
  tab.location.href = target;
};

/**
 * Suggestion only (never used silently): Stripe locks the email field when we pass it, so
 * a stale or mistyped address must be confirmed by the buyer in the modal every time.
 */
const suggestedEmail = (): string => {
  try {
    // URLSearchParams turns "+" into a space; put it back for plus-addressed emails.
    const q = new URLSearchParams(window.location.search).get("email")?.trim().replace(/ /g, "+").toLowerCase();
    if (q && EMAIL_RE.test(q)) return q;
    const s = window.localStorage.getItem(KEY);
    return s && EMAIL_RE.test(s) ? s : "";
  } catch {
    return "";
  }
};
const suggestedConsent = (): boolean => {
  try {
    // Pre-tick only when the suggested email is the one the buyer already ticked for.
    return window.localStorage.getItem(CONSENT_KEY) === "1" && window.localStorage.getItem(KEY) === suggestedEmail();
  } catch {
    return false;
  }
};
const track = (event: string, props: Record<string, unknown>) => {
  try {
    (window as unknown as { posthog?: { capture?: (e: string, p?: unknown) => void } }).posthog?.capture?.(event, props);
  } catch {
    /* ignore */
  }
};

function openModal(href: string) {
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px;";
  overlay.innerHTML = `
    <form style="background:#f5efe3;color:#2b2118;max-width:420px;width:100%;padding:28px;border-radius:12px;font-family:inherit">
      <p style="font-size:20px;margin:0 0 8px;font-weight:600">Where should we send your receipt?</p>
      <p style="font-size:14px;margin:0 0 16px;opacity:.75">Check your email is right: it is filled in at checkout and locked there. We also keep it (with Stripe, PostHog and Deepgrain) so we can see abandoned checkouts.</p>
      <input type="email" name="email" required autocomplete="email" placeholder="you@company.com" value="${suggestedEmail().replace(/[<>"&]/g, "")}"
        style="width:100%;box-sizing:border-box;padding:12px;font-size:16px;border:1px solid #2b211833;border-radius:8px;margin-bottom:12px" />
      ${planFor(href) ? `<label style="display:flex;gap:8px;align-items:flex-start;font-size:13px;margin:0 0 14px;cursor:pointer">
        <input type="checkbox" name="consent" style="margin-top:3px"${suggestedConsent() ? " checked" : ""} />
        <span>${CONSENT_TEXT}</span>
      </label>` : ""}
      <button type="submit" style="width:100%;padding:12px;font-size:15px;border:0;border-radius:999px;background:#2b2118;color:#f5efe3;cursor:pointer">Continue to checkout</button>
      ${REQUIRE_EMAIL ? "" : '<button type="button" data-skip style="width:100%;margin-top:8px;padding:8px;font-size:13px;border:0;background:none;text-decoration:underline;cursor:pointer;color:#2b2118">Continue without email</button>'}
    </form>`;
  const close = () => overlay.remove();
  const form = overlay.querySelector("form") as HTMLFormElement;
  const input = overlay.querySelector("input[type=email]") as HTMLInputElement;
  const consentBox = overlay.querySelector("input[name=consent]") as HTMLInputElement | null;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = input.value.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      input.setCustomValidity("Please enter a valid email");
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");
    const consent = !!consentBox?.checked;
    const ref = anonId(); // read the PostHog anonymous id before identify replaces it
    try {
      window.localStorage.setItem(KEY, email);
      window.localStorage.setItem(CONSENT_KEY, consent ? "1" : "0");
    } catch {
      /* storage blocked */
    }
    identifyPerson(email, {
      lead_form: "checkout_start",
      // CLAIMED only: anyone can type any email here. Real consent is written server-side
      // after a paid checkout, never from this page.
      marketing_consent_claimed: consent,
      marketing_consent_claimed_at: consent ? new Date().toISOString() : "",
    });
    close();
    void launch(href, email, consent, ref);
  });
  overlay.querySelector("[data-skip]")?.addEventListener("click", () => {
    close();
    void launch(href, null, false, anonId());
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener(
    "keydown",
    function esc(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", esc);
      }
    },
  );
  document.body.appendChild(overlay);
  input.focus();
}

export function installCheckoutGate() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  // Capture phase, registered after PostHog's own listener, so checkout_started still fires.
  document.addEventListener(
    "click",
    (e) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      const href = anchor?.getAttribute("href");
      if (!anchor || !isStripeHref(href)) return;
      if (new URL(href as string, window.location.origin).searchParams.has("prefilled_email")) return;
      e.preventDefault();
      openModal(href as string);
    },
    { capture: true },
  );
}

installCheckoutGate();
