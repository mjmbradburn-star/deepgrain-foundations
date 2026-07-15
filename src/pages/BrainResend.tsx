import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Mail, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { PageMeta } from "@/components/seo/PageMeta";

/**
 * BrainResend - diagnostic "resend my Brain link" flow.
 *
 * Unlike the original /brain capture form (which deliberately hides whether
 * an email is on file), this page is *intentionally* enumerable. Its whole
 * purpose is to tell a stuck user *why* they can't access the Brain
 * (unsubscribed / bounced / not on file) so they have a clear next step.
 *
 * Backed by the `resend-brain-link` edge function. Rate-limited there
 * (3/60s/IP) and per-subscriber hourly cooldown via idempotency key.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResendStatus =
  | "sent"
  | "unsubscribed"
  | "suppressed"
  | "not_found"
  | "rate_limited";

interface ResendResult {
  status: ResendStatus;
  since?: string | null;
  reason?: string | null;
  supportEmail?: string;
}

const reasonCopyMap: Record<string, string> = {
  revoked: "Your previous Brain link was revoked. Drop your email below and we'll send a fresh one - or tell you why we can't.",
  expired: "Your previous Brain link has expired. Drop your email below and we'll send a fresh one.",
  not_found: "We couldn't match your previous Brain link. Drop your email below and we'll send a fresh one - or tell you why we can't.",
  malformed: "That Brain link looked malformed. Drop your email below and we'll send a fresh one.",
};

const BrainResend = () => {
  const [params] = useSearchParams();
  const reason = params.get("reason") ?? null;

  const [email, setEmail] = useState("");
  // Honeypot - hidden from users, bots will fill it.
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ResendResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const trimmedEmail = email.trim().toLowerCase();
  const emailValid = EMAIL_REGEX.test(trimmedEmail);
  const canSubmit = emailValid && !submitting;

  useEffect(() => {
    document.title = "Resend my Brain link · Deepgrain";
  }, []);

  const intro = useMemo(
    () =>
      reason && reasonCopyMap[reason]
        ? reasonCopyMap[reason]
        : "Already signed up but can't access the Brain? Drop your email below - we'll send a fresh link, or tell you exactly why we can't.",
    [reason],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "resend-brain-link",
        {
          body: {
            email: trimmedEmail,
            website, // honeypot
          },
        },
      );

      if (error) {
        const payload = data as { status?: ResendStatus; error?: string } | null;
        if (payload?.status === "rate_limited") {
          setResult({ status: "rate_limited" });
          setSubmitting(false);
          return;
        }
        setErrorMsg(payload?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      const payload = data as ResendResult | null;
      if (!payload?.status) {
        setErrorMsg("Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setResult(payload);
      setSubmitting(false);
    } catch (err) {
      console.error("Brain resend failed", err);
      setErrorMsg("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-walnut text-cream">
      <PageMeta
        title="Resend my Brain link · Deepgrain"
        description="Already signed up to the People Ops AI Brain but can't access it? Drop your email below and we'll send a fresh link."
        path="/brain/resend"
        noindex
      />
      <section className="max-w-2xl mx-auto px-6 py-24 md:py-32">
        <p
          className="font-sans uppercase text-[11px] text-brass mb-6"
          style={{ letterSpacing: "0.18em" }}
        >
          The Brain · Resend link
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-cream">
          Resend my Brain link.
        </h1>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-cream/75">
          {intro}
        </p>

        {!result && (
          <form
            onSubmit={handleSubmit}
            className="mt-10"
            aria-label="Resend Brain link"
            noValidate
          >
            <label htmlFor="resend-email" className="sr-only">
              Email
            </label>
            <input
              id="resend-email"
              type="email"
              autoComplete="email"
              required
              maxLength={320}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-transparent border-0 border-b border-cream/30 focus:border-cream/80 py-3 px-1 font-sans text-base text-cream placeholder:text-cream/40 focus:outline-none transition-colors"
            />

            {/* Honeypot - visually hidden, off-screen, no autofill. */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label htmlFor="resend-website">Website</label>
              <input
                id="resend-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "font-sans uppercase text-[11px] px-7 py-3 rounded-full border border-brass text-brass transition-colors",
                  "hover:bg-brass hover:text-walnut",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
                style={{ letterSpacing: "0.16em" }}
              >
                {submitting ? "Sending…" : "Send me a fresh link →"}
              </button>
              <Link
                to="/brain"
                className="text-xs underline underline-offset-2 text-cream/55 hover:text-cream/80 transition-colors"
              >
                Back to /brain
              </Link>
            </div>

            {errorMsg && (
              <p
                role="alert"
                className="mt-4 text-sm text-brass"
              >
                {errorMsg}
              </p>
            )}
          </form>
        )}

        {result && <ResultBlock result={result} />}
      </section>
    </main>
  );
};

const ResultBlock = ({ result }: { result: ResendResult }) => {
  const supportEmail = result.supportEmail ?? "matt@peopleleaders.io";

  if (result.status === "sent") {
    return (
      <div role="status" aria-live="polite" className="mt-10 flex items-start gap-4">
        <CheckCircle2 className="h-7 w-7 mt-1 flex-shrink-0 text-brass" />
        <div>
          <p className="font-display text-2xl md:text-3xl leading-snug text-cream">
            Fresh link on its way.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            We've emailed a new Brain link to your address. It should arrive
            within a minute. The new link replaces any earlier ones - older
            links from us no longer work.
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "unsubscribed") {
    const since = result.since
      ? new Date(result.since).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;
    return (
      <div role="status" aria-live="polite" className="mt-10 flex items-start gap-4">
        <UserMinus className="h-7 w-7 mt-1 flex-shrink-0 text-brass" />
        <div>
          <p className="font-display text-2xl md:text-3xl leading-snug text-cream">
            This address unsubscribed{since ? ` on ${since}` : ""}.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            We can't send Brain links to unsubscribed addresses - that's the
            whole point of unsubscribing. If you want back in, reply to{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="underline underline-offset-2 text-brass hover:text-cream"
            >
              {supportEmail}
            </a>{" "}
            from this email and we'll re-enable it manually.
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "suppressed") {
    return (
      <div role="status" aria-live="polite" className="mt-10 flex items-start gap-4">
        <AlertCircle className="h-7 w-7 mt-1 flex-shrink-0 text-brass" />
        <div>
          <p className="font-display text-2xl md:text-3xl leading-snug text-cream">
            Mail to this address is being blocked.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Either earlier emails to you bounced, or one of them got marked as
            spam, so our email provider is blocking further sends to this
            address
            {result.reason ? ` (reason on file: ${result.reason})` : ""}.
            Try a different email - or reply to{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="underline underline-offset-2 text-brass hover:text-cream"
            >
              {supportEmail}
            </a>{" "}
            from a working address and we'll sort it out.
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "not_found") {
    return (
      <div role="status" aria-live="polite" className="mt-10 flex items-start gap-4">
        <Mail className="h-7 w-7 mt-1 flex-shrink-0 text-brass" />
        <div>
          <p className="font-display text-2xl md:text-3xl leading-snug text-cream">
            We don't have a record of this address.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            You may have signed up with a different email - try that one. Or,
            if this is your first time, sign up below.
          </p>
          <Link
            to="/brain"
            className="mt-5 inline-flex items-center font-sans uppercase text-[11px] px-5 py-2.5 rounded-full border border-brass text-brass hover:bg-brass hover:text-walnut transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            Sign up for the Brain →
          </Link>
        </div>
      </div>
    );
  }

  // rate_limited
  return (
    <div role="status" aria-live="polite" className="mt-10 flex items-start gap-4">
      <AlertCircle className="h-7 w-7 mt-1 flex-shrink-0 text-brass" />
      <div>
        <p className="font-display text-2xl md:text-3xl leading-snug text-cream">
          Too many requests.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">
          Wait a minute and try again.
        </p>
      </div>
    </div>
  );
};

export default BrainResend;
