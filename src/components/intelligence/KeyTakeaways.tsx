import type { ReactNode } from "react";

/**
 * Key takeaways block placed at the end of an Intelligence article, just
 * before the FAQ. Mirror of TLDR but framed as conclusions rather than
 * preview. LLM retrievers love both, for the same chunking reason.
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
    className="not-prose my-12 rounded-lg border-l-4 border-green bg-cream/70 px-6 py-6 md:px-8 md:py-7"
  >
    <div
      className="font-sans uppercase text-[10px] md:text-[11px] text-green mb-3"
      style={{ letterSpacing: "0.18em" }}
    >
      Key takeaways
    </div>
    <div className="font-sans text-[17px] md:text-[18px] leading-[1.6] text-walnut/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_p]:mb-3 [&_p:last-child]:mb-0">
      {children}
    </div>
  </aside>
);
