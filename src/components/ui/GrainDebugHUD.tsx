import { useEffect, useState } from "react";
import { getGrainRegistry, subscribeGrainRegistry } from "@/lib/debugGrain";

interface Row {
  seed: number;
  name: string;
  duration: string;
  playState: string;
  transform: string;
}

export const GrainDebugHUD = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [, force] = useState(0);

  useEffect(() => subscribeGrainRegistry(() => force((n) => n + 1)), []);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 500) {
        last = t;
        const next = getGrainRegistry().map(({ seed, el }) => {
          const cs = window.getComputedStyle(el);
          return {
            seed,
            name: cs.animationName,
            duration: cs.animationDuration,
            playState: cs.animationPlayState,
            transform: cs.transform,
          };
        });
        setRows(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        left: 8,
        zIndex: 99999,
        background: "rgba(0,0,0,0.85)",
        color: "#ff4fd8",
        font: "11px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace",
        padding: "8px 10px",
        borderRadius: 6,
        maxWidth: 380,
        maxHeight: "60vh",
        overflow: "auto",
        border: "1px solid #ff4fd8",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        BarkGrain debug · {rows.length} instance{rows.length === 1 ? "" : "s"}
      </div>
      {rows.length === 0 && <div style={{ opacity: 0.7 }}>No BarkGrain mounted on this view.</div>}
      {rows.map((r, i) => {
        const stuck = r.transform === "none" || r.transform === "matrix(1, 0, 0, 1, 0, 0)";
        return (
          <div key={i} style={{ marginBottom: 8, paddingBottom: 6, borderBottom: "1px dashed #ff4fd855" }}>
            <div>seed: <b>{r.seed}</b></div>
            <div>animation-name: {r.name}</div>
            <div>duration: {r.duration} · state: {r.playState}</div>
            <div style={{ color: stuck ? "#ff5555" : "#7fff9f" }}>
              transform: {r.transform}
              {stuck ? "  ← NOT MOVING" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};
