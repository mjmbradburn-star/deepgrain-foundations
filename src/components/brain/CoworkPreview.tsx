import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { coworkPages, coworkPlaceholders } from "@/assets/brain-cowork";
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
  const [, setIsDesktop] = useState(false);
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

  const step = 1;

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

  // Single page only. PDF pages are 16:9 landscape (3200x1800).
  const leftIdx = page;
  const rightIdx: number | null = null;
  const showSpread = false;

  const label = `${String(page + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const atStart = page === 0;
  const atEnd = page + step >= total;

  // Track which pages have ever been visited so we don't unmount their <img>
  // once loaded (avoids re-fetching when the user flips back and forth).
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    setSeen((prev) => {
      if (prev.has(page) && prev.has(page + 1)) return prev;
      const next = new Set(prev);
      next.add(page);
      if (page + 1 < total) next.add(page + 1); // preload neighbour
      return next;
    });
  }, [page, total]);

  const Page = ({ idx }: { idx: number }) => {
    const shouldRenderFull = seen.has(idx);
    return (
      <div className="relative h-full w-full bg-linen overflow-hidden rounded-xl">
        {/* Tiny blurred placeholder, always present, instant render */}
        <img
          src={coworkPlaceholders[idx]}
          alt=""
          aria-hidden
          width={3200}
          height={1800}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain select-none scale-105 blur-md"
        />
        {/* Full-res image, only mounted once the page is current/neighbour/visited */}
        {shouldRenderFull && (
          <img
            src={coworkPages[idx]}
            alt={`Claude Cowork for People Teams, page ${idx + 1} of ${total}`}
            width={3200}
            height={1800}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={idx === page ? "high" : "low"}
            draggable={false}
            style={{ touchAction: "pinch-zoom" }}
            className={cn(
              "relative h-full w-full object-contain select-none",
              "transition-opacity duration-300 motion-reduce:transition-none",
              "animate-in fade-in",
            )}
          />
        )}
      </div>
    );
  };

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

        {/* Stage, sized to the PDF's 16:9 page */}
        <div
          className={cn(
            "relative",
            isFs && "flex-1 min-h-0 flex items-center justify-center px-6 pb-4",
          )}
        >
          <div
            className={cn(
              "relative mx-auto",
              isFs ? "h-full w-auto max-h-full" : "w-full aspect-[16/9]",
            )}
            style={isFs ? { aspectRatio: "16 / 9" } : undefined}
          >
            <div className="absolute inset-0 rounded-xl overflow-hidden shadow-md shadow-black/20 ring-1 ring-walnut/10">
              <Page idx={leftIdx} />
            </div>

            {/* No mobile tap-zones: they block native pinch-to-zoom.
                Mobile users navigate via the prev/next buttons in the footer. */}

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
