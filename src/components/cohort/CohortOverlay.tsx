import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackFormSubmit } from "@/lib/analytics";
import { captureEvent, identifyPerson } from "@/lib/posthog";

/**
 * Waitlist overlay for the cohort page.
 *
 * When it opens:
 *   desktop  the cursor leaves through the top of the window (exit intent), after 15s on the page
 *   mobile   the visitor has scrolled past 60% of the page and been there 25s
 * It never opens when: they already joined, closed it in the last 14 days, clicked a
 * Stripe checkout link this session, landed back from checkout, or it already showed
 * this session. It is dismissible by the X, the backdrop, or Escape.
 *
 * Signup goes to the same `subscribers` table as EmailCapture (anon insert, no
 * read-back), so the existing welcome-email trigger and flows apply, and the person
 * is identified in PostHog only after they submit.
 */
const STORE_KEY = "dg_cohort_overlay_v1";
const SESSION_KEY = "dg_cohort_overlay_shown";
const SNOOZE_DAYS = 14;
const MIN_DWELL_EXIT_MS = 15_000;
const MIN_DWELL_SCROLL_MS = 25_000;
const SCROLL_TRIGGER = 0.6;

type Stored = { state: "dismissed" | "joined"; at: number };

const readStore = (): Stored | null => {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
};
const writeStore = (state: Stored["state"]) => {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ state, at: Date.now() }));
  } catch {
    /* storage blocked */
  }
};

const blocked = (): boolean => {
  const s = readStore();
  if (s?.state === "joined") return true;
  if (s?.state === "dismissed" && Date.now() - s.at < SNOOZE_DAYS * 86_400_000) return true;
  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) return true;
  } catch {
    /* ignore */
  }
  return new URLSearchParams(window.location.search).get("checkout") === "success";
};

export const CohortOverlay = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const triggerRef = useRef("");
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((trigger: string) => {
    if (blocked()) return;
    // Do not stack on the cookie prompt; the next trigger will try again.
    if (document.querySelector("[data-cookie-banner]")) return;
    triggerRef.current = trigger;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    returnFocus.current = document.activeElement as HTMLElement | null;
    captureEvent("overlay_shown", { overlay: "cohort_waitlist", trigger });
    setOpen(true);
  }, []);

  useEffect(() => {
    if (blocked()) return;
    const start = Date.now();
    let checkoutClicked = false;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (a?.href.includes("stripe.com")) checkoutClicked = true;
    };
    const onMouseOut = (e: MouseEvent) => {
      if (checkoutClicked || e.relatedTarget || e.clientY > 10) return;
      if (Date.now() - start < MIN_DWELL_EXIT_MS) return;
      show("exit_intent");
    };
    const onScroll = () => {
      if (checkoutClicked || Date.now() - start < MIN_DWELL_SCROLL_MS) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)) {
        show("scroll_60");
      }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Touch users who stop scrolling at 60% should still get it once the dwell passes.
    const poll = window.setInterval(onScroll, 3000);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(poll);
    };
  }, [show]);

  const close = useCallback(
    (how: string) => {
      setOpen(false);
      if (!done) {
        writeStore("dismissed");
        captureEvent("overlay_dismissed", { overlay: "cohort_waitlist", how, trigger: triggerRef.current });
      }
      returnFocus.current?.focus?.();
    },
    [done],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("escape");
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("button, input, a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("input")?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, close]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 320) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setSubmitting(true);
    // RLS-SAFE INSERT (anon-write table): no .select() read-back, same as EmailCapture.
    const { error: err } = await supabase.from("subscribers").insert({
      email: value,
      source: "cohort-overlay",
      article_slug: null,
    });
    const isDuplicate = err?.code === "23505";
    if (err && !isDuplicate) {
      setSubmitting(false);
      setError("Something went wrong. Please try again in a moment.");
      return;
    }
    identifyPerson(value, { lead_form: "cohort_overlay" });
    trackFormSubmit("cohort_overlay", {
      source: "cohort-overlay",
      trigger: triggerRef.current,
      duplicate: isDuplicate,
    });
    writeStore("joined");
    setSubmitting(false);
    setDone(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-walnut/70 backdrop-blur-[2px]"
        onClick={() => close("backdrop")}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cohort-overlay-title"
        className="relative w-full sm:max-w-lg bg-green text-cream border-t border-brass/50 sm:border sm:border-brass/40 px-6 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10 sm:py-10 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => close("x")}
          aria-label="Close"
          className="absolute right-3 top-3 p-3 text-cream/60 hover:text-cream transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="font-sans font-semibold uppercase text-brass" style={{ fontSize: "11px", letterSpacing: "0.22em" }}>
          The Deepgrain AI Cohort
        </p>

        {done ? (
          <>
            <h2 id="cohort-overlay-title" className="mt-4 font-display font-semibold text-2xl sm:text-3xl leading-tight">
              You're on the list.
            </h2>
            <p className="mt-4 text-cream/80 leading-relaxed">
              Use code DG20 at checkout for 20% off this cohort or a future one. Save it for when you're ready.
            </p>
            <p className="mt-6 border border-brass/50 px-5 py-4 text-center font-mono text-3xl tracking-[0.2em] text-brass" aria-label="Your discount code: DG20">
              DG20
            </p>
            <button
              type="button"
              onClick={() => close("done")}
              className="mt-8 rounded-full border border-brass px-8 py-3 font-sans text-sm font-medium tracking-wider text-brass hover:bg-brass hover:text-walnut transition-colors"
            >
              Back to the page
            </button>
          </>
        ) : (
          <>
            <h2 id="cohort-overlay-title" className="mt-4 font-display font-semibold text-2xl sm:text-3xl leading-tight">
              Not ready to book? Join the list.
            </h2>
            <p className="mt-4 text-cream/80 leading-relaxed">
              Leave your email for 20% off this cohort or a future one. Every seat includes the community
              that runs alongside the five-week cohort, with six months of access and the hub. Founding seats include community for life.
            </p>
            <form onSubmit={submit} className="mt-6" noValidate>
              <label htmlFor="cohort-overlay-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="cohort-overlay-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-transparent border-0 border-b border-cream/30 focus:border-cream/80 py-3 px-1 font-sans text-base text-cream placeholder:text-cream/40 focus:outline-none transition-colors"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "cohort-overlay-error" : undefined}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-cream px-8 py-3.5 font-sans text-sm font-medium tracking-wider text-green hover:bg-cream/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Join the list"}
                </button>
              </div>
              {error && (
                <p id="cohort-overlay-error" role="alert" className="mt-3 text-sm text-brass">
                  {error}
                </p>
              )}
            </form>
            <p className="mt-4 text-xs leading-relaxed text-cream/50">
              One email, no spam.{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-cream">
                Privacy Policy
              </Link>
              . Unsubscribe any time.
            </p>
            <button
              type="button"
              onClick={() => close("no_thanks")}
              className="mt-5 font-sans text-sm text-cream/60 underline underline-offset-4 hover:text-cream transition-colors"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
};
