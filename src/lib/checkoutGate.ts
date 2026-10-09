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
 * person (marketing_consent) so only ticked emails are treated as contactable.
 * ?email= on the page URL (campaign links) skips the prompt and records no consent.
 * Imported for side effects from src/pages/Waitlist.tsx.
 */
import { identifyPerson } from "@/lib/posthog";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KEY = "dg_checkout_email";
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

const go = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const rememberedEmail = (): string | null => {
  try {
    const q = new URLSearchParams(window.location.search).get("email")?.trim().toLowerCase();
    if (q && EMAIL_RE.test(q)) {
      window.localStorage.setItem(KEY, q);
      return q;
    }
    const s = window.localStorage.getItem(KEY);
    return s && EMAIL_RE.test(s) ? s : null;
  } catch {
    return null;
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
      <p style="font-size:14px;margin:0 0 16px;opacity:.75">Your email goes to Stripe so it is filled in for you at checkout.</p>
      <input type="email" name="email" required autocomplete="email" placeholder="you@company.com"
        style="width:100%;box-sizing:border-box;padding:12px;font-size:16px;border:1px solid #2b211833;border-radius:8px;margin-bottom:12px" />
      <label style="display:flex;gap:8px;align-items:flex-start;font-size:13px;margin:0 0 14px;cursor:pointer">
        <input type="checkbox" name="consent" style="margin-top:3px" />
        <span>${CONSENT_TEXT}</span>
      </label>
      <button type="submit" style="width:100%;padding:12px;font-size:15px;border:0;border-radius:999px;background:#2b2118;color:#f5efe3;cursor:pointer">Continue to checkout</button>
      <button type="button" data-skip style="width:100%;margin-top:8px;padding:8px;font-size:13px;border:0;background:none;text-decoration:underline;cursor:pointer;color:#2b2118">Continue without email</button>
    </form>`;
  const close = () => overlay.remove();
  const form = overlay.querySelector("form") as HTMLFormElement;
  const input = overlay.querySelector("input[type=email]") as HTMLInputElement;
  const consentBox = overlay.querySelector("input[name=consent]") as HTMLInputElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = input.value.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      input.setCustomValidity("Please enter a valid email");
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");
    const url = build(href, email); // read PostHog anon id before identify
    try {
      window.localStorage.setItem(KEY, email);
    } catch {
      /* storage blocked */
    }
    identifyPerson(email, {
      lead_form: "checkout_start",
      marketing_consent: consentBox.checked,
      marketing_consent_text: consentBox.checked ? CONSENT_TEXT : "",
      marketing_consent_at: consentBox.checked ? new Date().toISOString() : "",
    });
    close();
    go(url);
  });
  (overlay.querySelector("[data-skip]") as HTMLButtonElement).addEventListener("click", () => {
    close();
    go(build(href, null));
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
      const known = rememberedEmail();
      if (known) {
        const url = build(href as string, known);
        identifyPerson(known, { lead_form: "checkout_start" });
        go(url);
      } else {
        openModal(href as string);
      }
    },
    { capture: true },
  );
}

installCheckoutGate();
