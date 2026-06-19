import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { AIOI_URL } from "@/lib/aioi";
import { trackFormSubmit } from "@/lib/analytics";

/**
 * BrainCaptureForm — lead-capture form rendered in two places on /brain
 * (Hero and the second CTA section). Submits to the `send-brain-welcome`
 * edge function which:
 *   1. validates + rate-limits
 *   2. inserts a row in `brain_subscribers`
 *   3. invokes `send-transactional-email` with the `brain-welcome` template.
 *
 * Duplicate emails are intentionally treated as success on the server so
 * the response shape never reveals subscription status.
 */

type Variant = "dark" | "light";
type Size = "md" | "lg";

interface BrainCaptureFormProps {
  variant?: Variant;
  size?: Size;
  formId?: string;
  className?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const BrainCaptureForm = ({
  variant = "dark",
  size = "md",
  formId,
  className,
}: BrainCaptureFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isDark = variant === "dark";
  const trimmedEmail = email.trim().toLowerCase();
  const emailValid = EMAIL_REGEX.test(trimmedEmail);
  const canSubmit = emailValid && consent && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "send-brain-welcome",
        {
          body: {
            firstName: firstName.trim() || null,
            email: trimmedEmail,
            consentGiven: true,
            consentTimestamp: new Date().toISOString(),
            source: "brain",
            referrer: typeof document !== "undefined" ? document.referrer || null : null,
            userAgent:
              typeof navigator !== "undefined" ? navigator.userAgent || null : null,
          },
        },
      );

      if (error) {
        // FunctionsHttpError surfaces non-2xx responses
        const message =
          (data as { error?: string } | null)?.error ??
          "Something went wrong. Please try again.";
        setErrorMsg(message);
        setSubmitting(false);
        return;
      }

      trackFormSubmit("brain_capture", {
        has_first_name: Boolean(firstName.trim()),
      });
      setDone(true);
      setSubmitting(false);
    } catch (err) {
      console.error("Brain capture failed", err);
      setErrorMsg("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        className={cn("w-full max-w-xl", className)}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          <CheckCircle2
            className={cn("h-7 w-7 mt-1 flex-shrink-0", isDark ? "text-brass" : "text-green")}
          />
          <div>
            <p
              className={cn(
                "font-display text-2xl md:text-3xl leading-snug",
                isDark ? "text-cream" : "text-walnut",
              )}
            >
              You&apos;re in. Check your inbox.
            </p>
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed",
                isDark ? "text-cream/70" : "text-walnut/70",
              )}
            >
              The Brain link is on its way. While you wait, see how your
              People function actually scores.
            </p>
            <a
              href={AIOI_URL}
              className={cn(
                "mt-5 inline-flex items-center font-sans uppercase text-[11px] px-5 py-2.5 rounded-full border transition-colors",
                isDark
                  ? "border-brass text-brass hover:bg-brass hover:text-walnut"
                  : "border-walnut text-walnut hover:bg-walnut hover:text-cream",
              )}
              style={{ letterSpacing: "0.16em" }}
            >
              Take the AIOI →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={cn("w-full max-w-xl", className)}
      aria-label="Subscribe to The People Ops AI Brain"
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={`${formId ?? "brain"}-firstname`} className="sr-only">
          First name
        </label>
        <input
          id={`${formId ?? "brain"}-firstname`}
          type="text"
          autoComplete="given-name"
          maxLength={80}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name (optional)"
          data-variant={variant}
          className={cn(
            "brain-capture-input flex-1 bg-transparent border-0 border-b py-3 px-1 font-sans text-base focus:outline-none transition-colors appearance-none",
            isDark
              ? "border-cream/30 focus:border-cream/80 text-cream placeholder:text-cream/40"
              : "border-walnut/30 focus:border-walnut/80 text-walnut placeholder:text-walnut/40",
          )}
        />
        <label htmlFor={`${formId ?? "brain"}-email`} className="sr-only">
          Email
        </label>
        <input
          id={`${formId ?? "brain"}-email`}
          type="email"
          autoComplete="email"
          required
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          data-variant={variant}
          className={cn(
            "brain-capture-input flex-[1.3] bg-transparent border-0 border-b py-3 px-1 font-sans text-base focus:outline-none transition-colors appearance-none",
            isDark
              ? "border-cream/30 focus:border-cream/80 text-cream placeholder:text-cream/40"
              : "border-walnut/30 focus:border-walnut/80 text-walnut placeholder:text-walnut/40",
          )}
        />
      </div>

      <label
        className={cn(
          "mt-5 flex items-start gap-3 text-sm leading-relaxed cursor-pointer",
          isDark ? "text-cream/70" : "text-walnut/75",
        )}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className={cn(
            "mt-1 h-4 w-4 rounded-sm border bg-transparent accent-brass cursor-pointer",
            isDark ? "border-cream/40" : "border-walnut/40",
          )}
        />
        <span>
          Send me the Brain and occasional updates. I can unsubscribe any time.
        </span>
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "font-sans uppercase text-[11px] px-7 py-3 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            isDark
              ? "border-brass text-brass hover:bg-brass hover:text-walnut"
              : "border-walnut text-walnut hover:bg-walnut hover:text-cream",
          )}
          style={{ letterSpacing: "0.16em" }}
        >
          {submitting ? "Sending…" : "Send me the Brain →"}
        </button>
        <Link
          to="/privacy"
          className={cn(
            "text-xs underline underline-offset-2 transition-colors",
            isDark ? "text-cream/55 hover:text-cream/80" : "text-walnut/55 hover:text-walnut/80",
          )}
        >
          Privacy
        </Link>
        <Link
          to="/brain/resend"
          className={cn(
            "text-xs underline underline-offset-2 transition-colors",
            isDark ? "text-cream/55 hover:text-cream/80" : "text-walnut/55 hover:text-walnut/80",
          )}
        >
          Already signed up? Resend my link →
        </Link>
      </div>

      {errorMsg && (
        <p
          role="alert"
          className={cn(
            "mt-4 text-sm",
            isDark ? "text-brass" : "text-destructive",
          )}
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
};
