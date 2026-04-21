import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  articleTypography,
  articleH2Style,
} from "@/components/intelligence/mdxComponents";

/**
 * Stable, URL-safe id derived from the question text. Used both as the
 * <details id="..."> anchor target and as the slug appended to share links
 * (`#faq-...`). Deterministic so external links keep working across deploys
 * as long as the question wording is unchanged.
 */
export const faqIdFromQuestion = (question: string): string =>
  "faq-" +
  question
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export interface FAQItem {
  question: string;
  /**
   * Plain-text answer — required, and what gets emitted into FAQPage JSON-LD.
   * Google requires the schema's `answer.text` to mirror visible wording, so
   * this string MUST contain the full readable answer (no link markup).
   */
  answer: string;
  /**
   * Optional rich rendering for the answer (e.g. inline <Link> elements or a
   * trailing "Related" link). When present, this is what users see; `answer`
   * remains the canonical text shipped in JSON-LD. Keep the prose identical
   * to `answer` — only add navigational affordances, never new claims.
   */
  answerNode?: ReactNode;
}

/**
 * Visual treatment for the FAQ block.
 *
 * - `section` (default): full-bleed section used on /method, /people-ops,
 *   /enablement — own background, large display heading, BrassRule, eyebrow.
 * - `inline`: composes inside an existing article body. No background of its
 *   own, no eyebrow, heading drops to article-h2 scale (`text-3xl md:text-4xl`)
 *   so it reads as a section *within* the prose rather than a new page chapter.
 *   Question text drops one notch closer to body weight to match article rhythm.
 */
type FAQVariant = "section" | "inline";

interface FAQProps {
  eyebrow?: string;
  heading: string;
  items: FAQItem[];
  variant?: FAQVariant;
}

/**
 * Keyboard nav across <summary> elements within a single FAQ list:
 *   ArrowDown / ArrowUp  — move focus to next/previous question
 *   Home / End           — jump to first / last question
 * Native Space/Enter (toggle) is preserved — we don't intercept those.
 *
 * We resolve siblings at keydown time by querying the parent <dl>, so the
 * handler is index-free and works regardless of how items were rendered.
 */
const handleSummaryKeyDown = (e: KeyboardEvent<HTMLElement>) => {
  const key = e.key;
  if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Home" && key !== "End") {
    return;
  }
  const summary = e.currentTarget;
  const list = summary.closest("dl");
  if (!list) return;
  const summaries = Array.from(
    list.querySelectorAll<HTMLElement>("summary[data-faq-summary]"),
  );
  const i = summaries.indexOf(summary);
  if (i === -1) return;

  let next: HTMLElement | undefined;
  if (key === "ArrowDown") next = summaries[i + 1];
  else if (key === "ArrowUp") next = summaries[i - 1];
  else if (key === "Home") next = summaries[0];
  else if (key === "End") next = summaries[summaries.length - 1];

  if (next) {
    e.preventDefault();
    next.focus();
  }
};

/**
 * Smoothly-animated <details>. Native semantics + keyboard + a11y are kept;
 * we only animate the answer panel using the CSS grid-rows `0fr → 1fr` trick,
 * which transitions to `auto` height without measuring the DOM.
 *
 * The grid wrapper sits *outside* the <summary> so layout stays correct and
 * the wrapper inherits the `[open]` state via `details[open] > .faq-panel`.
 */
const FaqDetails = ({
  item,
  questionClass,
  answerClass,
  rowPadding,
}: {
  item: FAQItem;
  questionClass: string;
  answerClass: string;
  rowPadding: string;
}) => {
  const ref = useRef<HTMLDetailsElement>(null);
  const id = faqIdFromQuestion(item.question);
  const [copied, setCopied] = useState(false);

  // Respect prefers-reduced-motion: skip the height transition entirely.
  const onToggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.animate = "off";
    }
  }, []);

  // Deep linking: open the matching <details> when the URL hash points at it
  // (on first paint AND on subsequent hashchange events — e.g. user pastes a
  // share link into the address bar of an already-loaded page). We scroll
  // after a tick so the panel has a chance to expand to its real height.
  useEffect(() => {
    const tryOpen = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash.slice(1) !== id) return;
      const el = ref.current;
      if (!el) return;
      el.open = true;
      requestAnimationFrame(() => {
        el.scrollIntoView({
          behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
    };
    tryOpen();
    window.addEventListener("hashchange", tryOpen);
    return () => window.removeEventListener("hashchange", tryOpen);
  }, [id]);

  const onCopyLink = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard API can reject in insecure contexts / older browsers —
        // fall back to updating the URL hash so the user can copy from the bar.
      }
      // Always reflect the anchor in the address bar so back/forward + manual
      // copy still work even when the clipboard write fails.
      history.replaceState(null, "", `#${id}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    },
    [id],
  );

  return (
    <details
      ref={ref}
      id={id}
      onToggle={onToggle}
      className={`group scroll-mt-24 ${rowPadding} [&_summary::-webkit-details-marker]:hidden`}
    >
      <summary
        data-faq-summary
        onKeyDown={handleSummaryKeyDown}
        className="flex cursor-pointer items-start justify-between gap-4 sm:gap-6 list-none rounded-sm -mx-2 px-2 py-1 min-h-[44px] outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-linen"
      >
        <dt className={questionClass}>{item.question}</dt>
        <span
          aria-hidden
          className="mt-1 sm:mt-2 shrink-0 text-brass text-2xl sm:text-xl leading-none w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center -mr-2 sm:mr-0 transition-transform duration-300 ease-out group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div
        className={[
          "faq-panel grid transition-all duration-300 ease-out",
          "grid-rows-[0fr] opacity-0",
          "group-open:grid-rows-[1fr] group-open:opacity-100",
          "motion-reduce:transition-none",
        ].join(" ")}
      >
        <dd className={`min-h-0 overflow-hidden ${answerClass}`}>
          <div className="pt-4">{item.answerNode ?? item.answer}</div>
          <div className="pt-4">
            <button
              type="button"
              onClick={onCopyLink}
              aria-label={`Copy link to question: ${item.question}`}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-walnut/60 hover:text-brass focus-visible:text-brass outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-linen rounded-sm px-1 py-1 -mx-1 transition-colors"
            >
              <span aria-hidden>{copied ? "✓" : "🔗"}</span>
              <span>{copied ? "Link copied" : "Copy link"}</span>
            </button>
          </div>
        </dd>
      </div>
    </details>
  );
};

/**
 * Visible FAQ block. Pair with buildFAQLd in the same page so the schema
 * mirrors the rendered Q&A — Google requires the markup to match what
 * users actually see, otherwise it's grounds for a manual action.
 */
export const FAQ = ({
  eyebrow = "Common questions",
  heading,
  items,
  variant = "section",
}: FAQProps) => {
  if (variant === "inline") {
    // Designed to live *inside* the article body. Inherits the parent's
    // measure (the IntelligenceArticle body is `container-grain max-w-2xl`),
    // so we don't re-apply width here. Spacing mirrors the EmailCapture
    // wrapper directly below it (`mt-16 pt-12 border-t border-walnut/15`)
    // and the MDX h2 rhythm (`mb-6`, `text-3xl md:text-4xl`) so the block
    // reads as a native section of the article, not a separate component.
    return (
      <section
        className="mt-16 pt-12 border-t border-walnut/15"
        aria-label={eyebrow}
      >
        <h2 className={`${articleTypography.h2} mb-6`} style={articleH2Style}>
          {heading}
        </h2>
        <dl className="divide-y divide-walnut/15 border-t border-walnut/15">
          {items.map((item) => (
            <FaqDetails
              key={item.question}
              item={item}
              questionClass={articleTypography.h3}
              answerClass={articleTypography.body}
              rowPadding="py-5 sm:py-6"
            />
          ))}
        </dl>
      </section>
    );
  }

  // Default: full-bleed section — used on /method, /people-ops, /enablement.
  return (
    <section className="bg-linen text-walnut section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">{eyebrow}</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            {heading}
          </h2>
          <BrassRule className="mt-10 mb-12" />
          <dl className="divide-y divide-walnut/15">
            {items.map((item) => (
              <FaqDetails
                key={item.question}
                item={item}
                questionClass="font-display text-walnut text-xl md:text-2xl leading-snug"
                answerClass="text-walnut/80 leading-relaxed text-base md:text-lg"
                rowPadding="py-5 sm:py-6"
              />
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  );
};

/**
 * Builds schema.org FAQPage JSON-LD that mirrors the visible FAQ.
 * Always uses the plain-text `answer` field so the schema text matches the
 * prose users read (excluding link chrome), per Google's structured-data rules.
 */
export const buildFAQLd = (items: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.question,
    acceptedAnswer: { "@type": "Answer", text: i.answer },
  })),
});
