import { forwardRef, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  as?: "div" | "section" | "article";
}

/**
 * CSS-only scroll reveal. Uses IntersectionObserver + a `data-reveal` attribute
 * driven by index.css. Replaces the previous framer-motion implementation so the
 * critical path no longer needs motion-vendor.
 *
 * forwardRef so consumers (and dev-tooling) can pass a ref without React warning.
 */
const ScrollRevealInner = forwardRef<HTMLElement, ScrollRevealProps>(({
  children,
  delay = 0,
  duration = 0.7,
  threshold = 0.15,
  className,
  as: Tag = "div",
}, forwardedRef) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      node.setAttribute("data-reveal", "in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-reveal", "in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  const style: CSSProperties = {
    transitionDelay: delay ? `${delay}ms` : undefined,
    transitionDuration: duration !== 0.7 ? `${duration}s` : undefined,
  };

  // Cast to any — Tag union is erased at runtime; React handles the element fine.
  const Element = Tag as unknown as "div";

  const setRefs = (node: HTMLElement | null) => {
    (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return (
    <Element ref={setRefs as never} data-reveal="" className={className} style={style}>
      {children}
    </Element>
  );
});

ScrollRevealInner.displayName = "ScrollReveal";

export const ScrollReveal = ScrollRevealInner;
