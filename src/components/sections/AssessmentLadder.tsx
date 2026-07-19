import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ToolId = "readiness" | "exposure";

interface AssessmentLadderProps {
  /** "band" is a full standalone section; "inline" is a single line dropped inside an existing section. */
  variant: "band" | "inline";
  /** Surface it sits on; drives colour. Default "linen". */
  tone?: "linen" | "green" | "bark";
  /** Which tools to surface. Default both. */
  tools?: ToolId[];
  /** Band only. Plain font-display H2, no eyebrow. Default "Start before we talk." */
  heading?: string;
  /** Required analytics surface, e.g. "home_shift". */
  ctaLocation: string;
  className?: string;
}

const TOOL_COPY: Record<
  ToolId,
  { title: string; line: string; label: string; href: string }
> = {
  readiness: {
    title: "Score your People function",
    line: "An honest read on where your People function stands today, in about ten minutes.",
    label: "Take the Readiness Assessment",
    href: "/readiness",
  },
  exposure: {
    title: "Map what AI touches",
    line: "See which of your G&A functions AI already reaches, and which it does not.",
    label: "Open the AI Exposure Map",
    href: "/exposure-map",
  },
};

/**
 * The single reusable surface for the two free assessment tools. Fixed copy
 * lives here, keyed by tool id, so callers cannot drift the wording or the
 * voice. Content renders unconditionally (no reveal gating) so this never
 * joins the invisible-content risk list.
 */
export const AssessmentLadder = ({
  variant,
  tone = "linen",
  tools = ["readiness", "exposure"],
  heading = "Start before we talk.",
  ctaLocation,
  className,
}: AssessmentLadderProps) => {
  const isDark = tone === "green" || tone === "bark";

  const fireClick = (tool: ToolId) => {
    const copy = TOOL_COPY[tool];
    track("cta_click", {
      cta_id: `${tool}_${ctaLocation}`,
      cta_location: ctaLocation,
      cta_label: copy.label,
      link_url: copy.href,
    });
  };

  const linkClass = cn(
    "group inline-flex items-center gap-1.5 font-sans text-sm tracking-wider underline-offset-4 hover:underline",
    isDark ? "text-cream/80 hover:text-cream" : "text-walnut/80 hover:text-walnut",
  );

  if (variant === "inline") {
    return (
      <p
        className={cn(
          "flex flex-wrap items-baseline gap-x-2 gap-y-1 font-sans text-sm md:text-base",
          isDark ? "text-cream/70" : "text-walnut/70",
          className,
        )}
      >
        <span>Not sure where your function stands yet?</span>
        {tools.map((tool, i) => {
          const copy = TOOL_COPY[tool];
          return (
            <span key={tool} className="inline-flex items-baseline gap-2">
              {i > 0 && (
                <span aria-hidden className="opacity-60">
                  ·
                </span>
              )}
              <Link to={copy.href} onClick={() => fireClick(tool)} className={linkClass}>
                {copy.label}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </span>
          );
        })}
      </p>
    );
  }

  // band
  const sectionBg =
    tone === "green" ? "bg-green text-cream" : tone === "bark" ? "bg-bark text-cream" : "bg-linen text-walnut";

  return (
    <section className={cn("section-pad", sectionBg, className)}>
      <div className="container-grain">
        {heading && (
          <h2
            className={cn(
              "font-display text-3xl md:text-5xl leading-tight mb-10 md:mb-14",
              isDark ? "text-cream" : "text-walnut",
            )}
          >
            {heading}
          </h2>
        )}
        <div
          className={cn(
            "grid gap-10 md:gap-16 items-stretch",
            tools.length > 1 ? "md:grid-cols-2" : "max-w-xl",
          )}
        >
          {tools.map((tool) => {
            const copy = TOOL_COPY[tool];
            return (
              <div key={tool} className="flex h-full flex-col">
                <h3
                  className={cn(
                    "font-display text-2xl md:text-3xl",
                    isDark ? "text-cream" : "text-walnut",
                  )}
                >
                  {copy.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-base md:text-lg leading-relaxed max-w-md",
                    isDark ? "text-cream/70" : "text-walnut/70",
                  )}
                >
                  {copy.line}
                </p>
                <Link
                  to={copy.href}
                  onClick={() => fireClick(tool)}
                  className={cn(linkClass, "mt-auto pt-6")}
                >
                  {copy.label}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
