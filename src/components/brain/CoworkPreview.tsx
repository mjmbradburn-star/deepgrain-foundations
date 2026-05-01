import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { coworkPages } from "@/assets/brain-cowork";
import { cn } from "@/lib/utils";

/**
 * CoworkPreview — page-by-page flipbook of the
 * "Claude Cowork for People Teams" Brain piece.
 *
 * - Prev / Next pill buttons + tap-zones on the image
 * - Page dots + "04 / 12" indicator
 * - Native fullscreen toggle (with fullscreenchange listener)
 * - Keyboard nav: ←, →, Home, End, F, Esc
 */
const CoworkPreview = () => {
  const [page, setPage] = useState(0); // 0-indexed
  const [isFs, setIsFs] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const total = coworkPages.length;

  const goTo = useCallback(
    (n: number) => {
      setPage((p) => {
        const next = Math.max(0, Math.min(total - 1, n));
        return next === p ? p : next;
      });
    },
    [total],
  );
  const prev = useCallback(() => goTo(page - 1), [goTo, page]);
  const next = useCallback(() => goTo(page + 1), [goTo, page]);

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

  // Track fullscreen state
  useEffect(() => {
    const onChange = () =>
      setIsFs(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Keyboard nav (always-on; cheap & scoped to this page)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing
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

  const pageNum = String(page + 1).padStart(2, "0");
  const totalNum = String(total).padStart(2, "0");

  return (
    <div className="relative">
      {/* Offset frame for depth — echoes section 2 cards */}
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
          "p-5 sm:p-7 md:p-9",
          isFs &&
            "fixed inset-0 z-[100] rounded-none border-0 shadow-none bg-walnut p-0 flex flex-col",
        )}
      >
        {/* Top bar */}
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            isFs && "px-5 py-4 text-cream",
          )}
        >
          <p
            className={cn(
              "font-display text-2xl",
              isFs ? "text-brass" : "text-brass",
            )}
          >
            05
          </p>
          <span
            className={cn(
              "font-sans uppercase text-[10px] px-2.5 py-1 rounded-full border",
              isFs
                ? "text-cream/70 border-cream/20"
                : "text-walnut/60 border-walnut/15",
            )}
            style={{ letterSpacing: "0.16em" }}
          >
            Cowork · 12 pages
          </span>
        </div>

        {/* Stage */}
        <div
          className={cn(
            "relative mt-4",
            isFs
              ? "flex-1 min-h-0 flex items-center justify-center px-4 pb-4"
              : "",
          )}
        >
          <div
            className={cn(
              "relative mx-auto overflow-hidden rounded-2xl bg-linen",
              isFs
                ? "h-full w-auto max-h-full max-w-full bg-transparent rounded-none"
                : "w-full aspect-[1/1.414] max-w-[640px] border border-linen-dark",
            )}
          >
            {/* Pre-render all pages so transitions are instant; show only current */}
            {coworkPages.map((src, i) => {
              const isActive = i === page;
              const isNeighbour = Math.abs(i - page) <= 1;
              return (
                <img
                  key={src}
                  src={src}
                  alt={`Claude Cowork for People Teams — page ${i + 1} of ${total}`}
                  width={1240}
                  height={1754}
                  loading={i === 0 ? "eager" : isNeighbour ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className={cn(
                    "absolute inset-0 m-auto h-full w-full select-none",
                    isFs ? "object-contain" : "object-contain",
                    "transition-opacity duration-200 motion-reduce:transition-none",
                    isActive ? "opacity-100" : "opacity-0 pointer-events-none",
                  )}
                />
              );
            })}

            {/* Tap zones (mobile-friendly) */}
            <button
              type="button"
              onClick={prev}
              disabled={page === 0}
              aria-label="Previous page"
              className="absolute inset-y-0 left-0 w-1/3 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={next}
              disabled={page === total - 1}
              aria-label="Next page"
              className="absolute inset-y-0 right-0 w-1/3 focus:outline-none disabled:cursor-not-allowed"
            />

            {/* Fullscreen toggle (top-right of stage) */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFs ? "Exit fullscreen" : "Enter fullscreen"}
              className={cn(
                "absolute top-3 right-3 inline-flex items-center justify-center",
                "h-9 w-9 rounded-full backdrop-blur-sm transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                isFs
                  ? "bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20"
                  : "bg-walnut/85 text-cream hover:bg-walnut",
              )}
            >
              {isFs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Side arrows (md+) */}
          <button
            type="button"
            onClick={prev}
            disabled={page === 0}
            aria-label="Previous page"
            className={cn(
              "hidden md:inline-flex items-center justify-center absolute top-1/2 -translate-y-1/2",
              "h-11 w-11 rounded-full transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              isFs
                ? "left-6 bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20"
                : "-left-2 lg:-left-5 bg-walnut text-cream hover:bg-walnut/85 shadow-lg",
            )}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={page === total - 1}
            aria-label="Next page"
            className={cn(
              "hidden md:inline-flex items-center justify-center absolute top-1/2 -translate-y-1/2",
              "h-11 w-11 rounded-full transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              isFs
                ? "right-6 bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20"
                : "-right-2 lg:-right-5 bg-walnut text-cream hover:bg-walnut/85 shadow-lg",
            )}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Footer: dots + indicator + mobile arrows */}
        <div
          className={cn(
            "mt-5 flex flex-col items-center gap-3",
            isFs && "px-5 pb-4 text-cream",
          )}
        >
          {/* Dots */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {coworkPages.map((_, i) => {
              const active = i === page;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                    active
                      ? "w-6 bg-brass"
                      : isFs
                      ? "w-1.5 bg-cream/30 hover:bg-cream/60"
                      : "w-1.5 bg-walnut/20 hover:bg-walnut/40",
                  )}
                />
              );
            })}
          </div>

          {/* Mobile prev/next + indicator */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={page === 0}
              aria-label="Previous page"
              className={cn(
                "md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                isFs
                  ? "bg-cream/10 text-cream"
                  : "bg-walnut text-cream",
              )}
            >
              <ChevronLeft size={18} />
            </button>

            <p
              aria-live="polite"
              className={cn(
                "font-display text-sm tabular-nums",
                isFs ? "text-cream/80" : "text-walnut/70",
              )}
              style={{ letterSpacing: "0.12em" }}
            >
              <span className="text-brass">{pageNum}</span>
              <span className="px-1.5 opacity-60">/</span>
              <span>{totalNum}</span>
            </p>

            <button
              type="button"
              onClick={next}
              disabled={page === total - 1}
              aria-label="Next page"
              className={cn(
                "md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                isFs
                  ? "bg-cream/10 text-cream"
                  : "bg-walnut text-cream",
              )}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoworkPreview;
