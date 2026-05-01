import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { coworkPages } from "@/assets/brain-cowork";
import { cn } from "@/lib/utils";

/**
 * CoworkPreview, page-by-page flipbook of the Cowork Brain piece.
 *
 * Desktop: two-page landscape spread (left + right).
 * Mobile: single page.
 * Native fullscreen, keyboard nav, page dots.
 */
const CoworkPreview = () => {
  const [page, setPage] = useState(0); // 0-indexed, left page of the spread on desktop
  const [isFs, setIsFs] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const total = coworkPages.length;

  // Track viewport for spread vs single
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const step = isDesktop && !isFs ? 2 : 1;

  const goTo = useCallback(
    (n: number) => {
      setPage((p) => {
        const next = Math.max(0, Math.min(total - 1, n));
        return next === p ? p : next;
      });
    },
    [total],
  );
  const prev = useCallback(() => goTo(page - step), [goTo, page, step]);
  const next = useCallback(() => goTo(page + step), [goTo, page, step]);

  const toggleFullscreen = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      /* no-op */
    }
  }, []);

  useEffect(() => {
    const onChange = () =>
      setIsFs(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      } else if ((e.key === "f" || e.key === "F") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, goTo, total, toggleFullscreen]);

  // Spread = current page + (current+1) on desktop. Always show page on left.
  const showSpread = isDesktop && !isFs;
  const leftIdx = page;
  const rightIdx = showSpread && page + 1 < total ? page + 1 : null;

  // Indicator label
  const label =
    showSpread && rightIdx !== null
      ? `${String(leftIdx + 1).padStart(2, "0")}–${String(rightIdx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
      : `${String(leftIdx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  const atStart = page === 0;
  const atEnd = page + step >= total;

  // A4 page is 1:1.414. Spread is 2:1.414 ≈ 1.414:1 landscape.
  const stageAspect = showSpread ? "aspect-[2/1.414]" : "aspect-[1/1.414]";
  const stageMaxW = showSpread ? "max-w-[920px]" : "max-w-[440px]";

  const Page = ({ idx, side }: { idx: number; side: "left" | "right" | "solo" }) => (
    <div
      className={cn(
        "relative h-full bg-linen overflow-hidden",
        side === "left" && "rounded-l-xl border-r border-walnut/10",
        side === "right" && "rounded-r-xl",
        side === "solo" && "rounded-xl",
      )}
      style={{ flex: "1 1 0", minWidth: 0 }}
    >
      <img
        src={coworkPages[idx]}
        alt={`Claude Cowork for People Teams, page ${idx + 1} of ${total}`}
        width={1240}
        height={1754}
        loading={idx <= 2 ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        // touch-pinch-zoom + touch-pan-y lets the browser handle native pinch
        // and vertical scroll without us hijacking the gesture
        style={{ touchAction: "pinch-zoom" }}
        className="absolute inset-0 h-full w-full object-contain select-none"
      />
    </div>
  );

  return (
    <div className="relative">
      {/* Offset frame for depth */}
      <div
        aria-hidden
        className="absolute -inset-3 md:-inset-4 rounded-[2rem] border border-brass/20 pointer-events-none"
      />

      <div
        ref={wrapRef}
        role="region"
        aria-label={`Claude Cowork preview, page ${page + 1} of ${total}`}
        className={cn(
          "relative bg-cream rounded-3xl border border-linen-dark shadow-2xl shadow-black/30",
          "p-4 sm:p-5 md:p-6",
          isFs &&
            "fixed inset-0 z-[100] rounded-none border-0 shadow-none bg-walnut p-0 flex flex-col",
        )}
      >
        {/* Compact top bar */}
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            isFs ? "px-5 py-3 text-cream" : "px-1 pb-3",
          )}
        >
          <span
            className={cn(
              "font-sans uppercase text-[10px] tracking-[0.16em]",
              isFs ? "text-cream/70" : "text-walnut/55",
            )}
          >
            Cowork for People Teams
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFs ? "Exit fullscreen" : "Enter fullscreen"}
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
              isFs
                ? "bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20"
                : "bg-walnut/10 text-walnut hover:bg-walnut hover:text-cream",
            )}
          >
            {isFs ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Stage */}
        <div
          className={cn(
            "relative",
            isFs && "flex-1 min-h-0 flex items-center justify-center px-6 pb-4",
          )}
        >
          <div
            className={cn(
              "relative mx-auto",
              isFs
                ? "h-full w-auto max-h-full"
                : cn("w-full", stageAspect, stageMaxW),
            )}
            style={
              isFs
                ? { aspectRatio: showSpread ? "2 / 1.414" : "1 / 1.414" }
                : undefined
            }
          >
            {/* Pages */}
            <div className="absolute inset-0 flex rounded-xl overflow-hidden shadow-md shadow-black/20 ring-1 ring-walnut/10">
              {showSpread && rightIdx !== null ? (
                <>
                  <Page idx={leftIdx} side="left" />
                  <Page idx={rightIdx} side="right" />
                </>
              ) : (
                <Page idx={leftIdx} side="solo" />
              )}
            </div>

            {/* Tap zones for mobile */}
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Previous page"
              className="md:hidden absolute inset-y-0 left-0 w-1/3 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={next}
              disabled={atEnd}
              aria-label="Next page"
              className="md:hidden absolute inset-y-0 right-0 w-1/3 focus:outline-none disabled:cursor-not-allowed"
            />

            {/* Side arrows */}
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Previous page"
              className={cn(
                "hidden md:inline-flex items-center justify-center absolute top-1/2 -translate-y-1/2",
                "h-11 w-11 rounded-full transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                "disabled:opacity-25 disabled:cursor-not-allowed",
                isFs
                  ? "left-4 bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20"
                  : "-left-5 lg:-left-6 bg-walnut text-cream hover:bg-walnut/85 shadow-lg",
              )}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={atEnd}
              aria-label="Next page"
              className={cn(
                "hidden md:inline-flex items-center justify-center absolute top-1/2 -translate-y-1/2",
                "h-11 w-11 rounded-full transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                "disabled:opacity-25 disabled:cursor-not-allowed",
                isFs
                  ? "right-4 bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20"
                  : "-right-5 lg:-right-6 bg-walnut text-cream hover:bg-walnut/85 shadow-lg",
              )}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Footer: dots + indicator */}
        <div
          className={cn(
            "mt-4 flex items-center justify-between gap-4",
            isFs ? "px-6 pb-4 text-cream" : "px-1",
          )}
        >
          {/* Mobile prev */}
          <button
            type="button"
            onClick={prev}
            disabled={atStart}
            aria-label="Previous page"
            className={cn(
              "md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              isFs ? "bg-cream/10 text-cream" : "bg-walnut text-cream",
            )}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 flex-1">
            {coworkPages.map((_, i) => {
              const isCurrent =
                i === leftIdx || (rightIdx !== null && i === rightIdx);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                    isCurrent
                      ? "w-5 bg-brass"
                      : isFs
                      ? "w-1.5 bg-cream/25 hover:bg-cream/60"
                      : "w-1.5 bg-walnut/20 hover:bg-walnut/40",
                  )}
                />
              );
            })}
          </div>

          {/* Indicator */}
          <p
            aria-live="polite"
            className={cn(
              "font-display text-xs tabular-nums whitespace-nowrap",
              isFs ? "text-cream/80" : "text-walnut/60",
            )}
            style={{ letterSpacing: "0.12em" }}
          >
            <span className="text-brass">{label.split(" / ")[0]}</span>
            <span className="px-1 opacity-50">/</span>
            <span>{label.split(" / ")[1]}</span>
          </p>

          {/* Mobile next */}
          <button
            type="button"
            onClick={next}
            disabled={atEnd}
            aria-label="Next page"
            className={cn(
              "md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              isFs ? "bg-cream/10 text-cream" : "bg-walnut text-cream",
            )}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoworkPreview;
