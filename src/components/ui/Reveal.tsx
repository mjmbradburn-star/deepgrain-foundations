import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in ms. Pass `index * step` for a run of cards. */
  delay?: number;
  /** Transition length in ms. Default 800. */
  duration?: number;
  /** Travel distance in px before settling. Default 40 (translate-y-16-ish). */
  y?: number;
  /** Peak blur in px while hidden. Default 8 (blur-md-ish). Set 0 to skip blur. */
  blur?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "article" | "li" | "span";
}

const EASE = "cubic-bezier(0.32,0.72,0,1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Blur-fade-up scroll reveal. As the element enters the viewport it resolves
 * from `translateY + blur + opacity:0` to its resting state over ~800ms on the
 * house cubic-bezier. Self-contained: state + inline styles, one
 * IntersectionObserver that disconnects after firing. Animates only
 * `transform`, `opacity` and a short-lived `filter`, and renders fully visible
 * immediately under `prefers-reduced-motion`.
 *
 * Stagger a group by passing `delay={i * 80}`.
 */
export const Reveal = forwardRef<HTMLElement, RevealProps>(
  (
    {
      children,
      delay = 0,
      duration = 800,
      y = 40,
      blur = 8,
      threshold = 0.15,
      className,
      style,
      as: Tag = "div",
    },
    forwardedRef,
  ) => {
    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
      const node = ref.current;
      if (!node) return;
      if (prefersReducedMotion()) {
        setReduced(true);
        setShown(true);
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setShown(true);
              io.unobserve(entry.target);
            }
          }
        },
        { threshold, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(node);
      // Fail-safe: a stalled or throttled observer must never strand content
      // hidden. Content is visible by default after this window regardless.
      const failSafe = window.setTimeout(() => setShown(true), 1200);
      return () => {
        io.disconnect();
        window.clearTimeout(failSafe);
      };
    }, [threshold]);

    const motion: CSSProperties = reduced
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
          filter: shown || blur === 0 ? "blur(0px)" : `blur(${blur}px)`,
          transition: [
            `opacity ${duration}ms ${EASE}`,
            `transform ${duration}ms ${EASE}`,
            `filter ${Math.round(duration * 0.75)}ms ${EASE}`,
          ].join(", "),
          transitionDelay: delay ? `${delay}ms` : undefined,
          willChange: shown ? undefined : "transform, opacity, filter",
        };

    const Element = Tag as unknown as "div";

    const setRefs = (node: HTMLElement | null) => {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    };

    return (
      <Element
        ref={setRefs as never}
        className={cn(className)}
        style={{ ...motion, ...style }}
      >
        {children}
      </Element>
    );
  },
);

Reveal.displayName = "Reveal";
