import type { MDXComponents } from "mdx/types";
import { Link } from "react-router-dom";
import { slugifyHeading } from "@/lib/slugifyHeading";
import { Takeaway } from "@/components/intelligence/Takeaway";
import { TLDR } from "@/components/intelligence/TLDR";
import { KeyTakeaways } from "@/components/intelligence/KeyTakeaways";

/**
 * Shared article typography tokens.
 *
 * These are the canonical class strings for Intelligence article prose.
 * Components that render *inside* an article body (e.g. the inline FAQ)
 * import these directly so headings and body copy stay in lockstep with
 * MDX-rendered content. Update here, propagate everywhere.
 */
export const articleTypography = {
  /** Article H2 — section break inside an article. */
  h2: "font-display text-3xl md:text-4xl text-walnut leading-tight",
  /** Article H3 — used for question-weight headings inside the FAQ. */
  h3: "font-display text-2xl md:text-3xl text-walnut leading-snug",
  /** Article body paragraph. */
  body: "font-sans text-[18px] leading-[1.7] text-walnut/85",
} as const;

/** Inline style applied alongside the H2 class for tracking. */
export const articleH2Style = { letterSpacing: "-0.005em" };

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-display text-4xl md:text-5xl lg:text-6xl text-walnut leading-[1.05] mb-8"
      style={{ letterSpacing: "-0.01em" }}
      {...props}
    />
  ),
  h2: ({ children, ...rest }) => {
    // Auto-id every article H2 from its visible text. Enables deep links
    // like /intelligence/<article>#<heading-slug> from the Answers hub,
    // related-content rails, and external citations.
    const id = slugifyHeading(children);
    return (
      <h2
        id={id}
        className={`${articleTypography.h2} mt-16 mb-6 scroll-mt-32`}
        style={articleH2Style}
        {...rest}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...rest }) => {
    const id = slugifyHeading(children);
    return (
      <h3
        id={id}
        className={`${articleTypography.h3} mt-12 mb-4 scroll-mt-32`}
        {...rest}
      >
        {children}
      </h3>
    );
  },
  p: (props) => (
    <p className={`${articleTypography.body} mb-6`} {...props} />
  ),
  ul: (props) => <ul className="list-disc pl-6 mb-6 space-y-2 text-[18px] text-walnut/85" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-[18px] text-walnut/85" {...props} />,
  li: (props) => <li className="leading-[1.7]" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-brass pl-6 py-2 my-10 font-display italic text-2xl md:text-3xl text-walnut leading-snug"
      {...props}
    />
  ),
  a: ({ href = "", ...props }) => {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-green underline decoration-brass underline-offset-4 hover:text-brass transition-colors"
          {...props}
        />
      );
    }
    return (
      <Link
        to={href}
        className="text-green underline decoration-brass underline-offset-4 hover:text-brass transition-colors"
        {...(props as any)}
      />
    );
  },
  code: (props) => (
    <code className="bg-walnut/10 text-walnut rounded px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
  ),
  pre: (props) => (
    <pre className="bg-walnut text-cream rounded-lg p-6 overflow-x-auto my-8 text-sm leading-relaxed" {...props} />
  ),
  hr: () => <hr className="border-t border-walnut/15 my-12" />,
  strong: (props) => <strong className="font-semibold text-walnut" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  // Custom components available without import inside MDX. Article authors
  // can drop <Takeaway>...</Takeaway> at the end of any major section to
  // reinforce the point for scanners and LLMs.
  Takeaway,
  TLDR,
  KeyTakeaways,
};
