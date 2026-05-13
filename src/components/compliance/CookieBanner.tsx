import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "dg.consent.v1";

type ConsentStatus = "accepted" | "rejected";
interface ConsentRecord {
  status: ConsentStatus;
  ts: number;
}

const readConsent = (): ConsentRecord | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.status === "accepted" || parsed?.status === "rejected") return parsed;
    return null;
  } catch {
    return null;
  }
};

const writeConsent = (status: ConsentStatus) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status, ts: Date.now() } satisfies ConsentRecord),
    );
    window.dispatchEvent(new CustomEvent("dg:consent-change", { detail: { status } }));
  } catch {
    /* ignore storage failures */
  }
};

/**
 * Read current consent state. Returns null until the user has chosen.
 * Use this to gate any future analytics or non-essential storage.
 */
export const useConsent = () => {
  const [consent, setConsent] = useState<ConsentRecord | null>(() => readConsent());

  useEffect(() => {
    const onChange = () => setConsent(readConsent());
    window.addEventListener("dg:consent-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("dg:consent-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return consent;
};

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Defer to next tick so we don't flash on first paint of an existing visitor.
    const t = window.setTimeout(() => {
      if (!readConsent()) setVisible(true);
    }, 250);
    return () => window.clearTimeout(t);
  }, []);

  const choose = useCallback((status: ConsentStatus) => {
    writeConsent(status);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      data-cookie-banner
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 bg-walnut text-cream border border-cream/10 shadow-2xl p-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4"
      style={{ borderRadius: "8px" }}
    >
      <p
        className="font-display text-cream text-lg mb-2"
        style={{ letterSpacing: "-0.01em" }}
      >
        A quick note on cookies.
      </p>
      <p className="text-sm text-cream/70 leading-relaxed mb-4">
        This site uses only the storage it needs to work. We do not run
        advertising or third-party trackers. Your choice here controls any
        future analytics.{" "}
        <Link
          to="/cookies"
          className="text-brass underline underline-offset-2 hover:text-brass/80"
        >
          Read our cookie policy
        </Link>
        .
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="font-sans uppercase text-[11px] px-4 py-2 rounded-full border border-brass text-brass hover:bg-brass hover:text-walnut transition-colors"
          style={{ letterSpacing: "0.16em" }}
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("rejected")}
          className="font-sans uppercase text-[11px] px-4 py-2 rounded-full border border-cream/30 text-cream/80 hover:border-cream/60 hover:text-cream transition-colors"
          style={{ letterSpacing: "0.16em" }}
        >
          Reject non-essential
        </button>
      </div>
    </div>
  );
};
