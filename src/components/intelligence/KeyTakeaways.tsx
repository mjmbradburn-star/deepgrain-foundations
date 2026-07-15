import type { ReactNode } from "react";

/**
 * Takeaways list placed at the end of an Intelligence article, just before the
 * FAQ. Conclusions rather than preview. LLM retrievers love both, for the same
 * chunking reason.
 *
 * Renders as a rule-bordered list in the reading column, not a boxed card. A
 * hairline above and below, a quiet serif kicker, brass tick markers. The
 * accessible name stays for assistive tech; the visible kicker is normal case,
 * not the uppercase micro-label that reads as machine-made.
 *
 * Usage in MDX:
 *   <KeyTakeaways>
 *     - Conclusion one.
 *     - Conclusion two.
 *     - Conclusion three.
 *   </KeyTakeaways>
 */
export const KeyTakeaways = ({ children }: { children: ReactNode }) => (
  <aside
    role="note"
    aria-label="Key takeaways"
    className="not-prose my-14 border-y border-walnut/15 py-8 md:py-10"
  >
    <p className="font-display italic text-walnut/55 text-lg mb-5">
      What to take from this
    </p>
    <div className="font-sans text-[18px] leading-[1.6] text-walnut/90 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-3 [&_ol]:list-none [&_ol]:pl-0 [&_ol]:space-y-3 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.68em] [&_li]:before:h-px [&_li]:before:w-3.5 [&_li]:before:bg-brass/70 [&_li]:before:content-['']">
      {children}
    </div>
  </aside>
);
