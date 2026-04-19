import type { MDXComponents } from "mdx/types";
import { Link } from "react-router-dom";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-display text-4xl md:text-5xl lg:text-6xl text-walnut leading-[1.05] mb-8"
      style={{ letterSpacing: "-0.01em" }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-display text-3xl md:text-4xl text-walnut leading-tight mt-16 mb-6"
      style={{ letterSpacing: "-0.005em" }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="font-display text-2xl md:text-3xl text-walnut leading-snug mt-12 mb-4" {...props} />
  ),
  p: (props) => (
    <p className="font-sans text-[18px] leading-[1.7] text-walnut/85 mb-6" {...props} />
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
};
