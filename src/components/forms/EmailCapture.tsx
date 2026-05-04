import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { trackFormSubmit } from "@/lib/analytics";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(320),
});

type Variant = "dark" | "light";

interface EmailCaptureProps {
  source: string;
  articleSlug?: string;
  heading?: string;
  description?: string;
  variant?: Variant;
  className?: string;
}

export const EmailCapture = ({
  source,
  articleSlug,
  heading = "Intelligence in your inbox.",
  description = "Occasional dispatches on operating systems, leadership craft, and the discipline of building organisations that hold their shape.",
  variant = "dark",
  className,
}: EmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const isDark = variant === "dark";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast({
        title: "Check your email",
        description: parsed.error.issues[0]?.message ?? "Invalid email",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("subscribers").insert({
      email: parsed.data.email,
      source,
      article_slug: articleSlug ?? null,
    });

    // Treat duplicate (unique violation) as success — quiet idempotent UX,
    // but skip sending the welcome email so existing subscribers aren't re-emailed.
    const isDuplicate = error?.code === "23505";

    if (error && !isDuplicate) {
      setSubmitting(false);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    // Welcome email is dispatched server-side by a Postgres trigger on
    // `subscribers` INSERT — no client invocation needed (and not allowed,
    // to prevent abuse of the transactional email function).

    trackFormSubmit("email_capture", {
      source,
      article_slug: articleSlug ?? undefined,
      duplicate: isDuplicate,
    });

    setSubmitting(false);
    setDone(true);
    setEmail("");
  };

  return (
    <div className={cn("w-full", className)}>
      {heading && (
        <h3
          className={cn(
            "font-display text-2xl md:text-3xl lg:text-4xl leading-tight mb-4",
            isDark ? "text-cream" : "text-walnut",
          )}
          style={{ letterSpacing: "-0.01em" }}
        >
          {heading}
        </h3>
      )}
      {description && (
        <p
          className={cn(
            "text-base leading-relaxed mb-6 max-w-xl",
            isDark ? "text-cream/70" : "text-walnut/70",
          )}
        >
          {description}
        </p>
      )}

      {done ? (
        <p
          className={cn(
            "font-display text-lg",
            isDark ? "text-brass" : "text-green",
          )}
        >
          Thank you. You're on the list.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <label htmlFor={`email-${source}`} className="sr-only">
            Email address
          </label>
          <input
            id={`email-${source}`}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={cn(
              "flex-1 bg-transparent border-0 border-b py-3 px-1 font-sans text-base focus:outline-none transition-colors",
              isDark
                ? "border-cream/30 focus:border-cream/80 text-cream placeholder:text-cream/40"
                : "border-walnut/30 focus:border-walnut/80 text-walnut placeholder:text-walnut/40",
            )}
          />
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "font-sans uppercase text-[11px] px-6 py-3 rounded-full border transition-colors disabled:opacity-50",
              isDark
                ? "border-brass text-brass hover:bg-brass hover:text-walnut"
                : "border-walnut text-walnut hover:bg-walnut hover:text-cream",
            )}
            style={{ letterSpacing: "0.16em" }}
          >
            {submitting ? "Sending…" : "Subscribe"}
          </button>
        </form>
      )}

      {!done && (
        <p
          className={cn(
            "mt-4 text-xs leading-relaxed max-w-xl",
            isDark ? "text-cream/50" : "text-walnut/50",
          )}
        >
          By subscribing you agree to our{" "}
          <Link
            to="/privacy"
            className={cn(
              "underline underline-offset-2 transition-colors",
              isDark ? "hover:text-cream" : "hover:text-walnut",
            )}
          >
            Privacy Policy
          </Link>
          . Unsubscribe any time.
        </p>
      )}
    </div>
  );
};
