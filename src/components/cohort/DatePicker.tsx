import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { COHORT_STARTS, US_PRICES, type CohortRegion, type CohortStart } from "./startingMonth.data";

const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(parts(iso));
export const addDays = (iso: string, n: number) => {
  const d = parts(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const todayIso = () => new Date().toISOString().slice(0, 10);

const guessRegion = (): CohortRegion => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith("America/") ? "us" : "uk";
  } catch {
    return "uk";
  }
};

/** A cohort stays bookable until a week after its first session, so a late joiner can still catch up. */
const LATE_JOIN_DAYS = 7;

export interface CohortChoice {
  region: CohortRegion;
  setRegion: (r: CohortRegion) => void;
  blocks: [number, CohortStart[]][];
  blockNo: number;
  setBlockNo: (n: number) => void;
  active: CohortStart;
  usd: boolean;
  foundingPrice: (gbp: string) => string;
  standardPrice: (gbp: string) => string;
}

/** Shared state for the date selector and the pricing cards that follow it. */
export const useCohortChoice = (): CohortChoice => {
  const [region, setRegionState] = useState<CohortRegion>("uk");
  const [picked, setPicked] = useState<number | null>(null);
  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current) setRegionState(guessRegion());
  }, []);

  const blocks = useMemo(() => {
    const today = todayIso();
    const map = new Map<number, CohortStart[]>();
    for (const c of COHORT_STARTS) {
      if (addDays(c.start, LATE_JOIN_DAYS) < today) continue;
      map.set(c.block, [...(map.get(c.block) ?? []), c]);
    }
    return [...map.entries()].sort(([a], [b]) => a - b).slice(0, 3);
  }, []);

  const fallback = blocks.length ? blocks[0] : ([1, COHORT_STARTS.filter((c) => c.block === 1)] as [number, CohortStart[]]);
  const blockNo = picked ?? fallback[0];
  const entry = blocks.find(([n]) => n === blockNo) ?? fallback;
  const active = entry[1].find((c) => c.region === region) ?? entry[1][0];
  const usd = active.region === "us";

  return {
    region,
    setRegion: (r) => {
      touched.current = true;
      setRegionState(r);
      track("cta_click", { cta_id: "date_picker_region", cta_location: "pricing", cta_label: r, link_url: "#pricing" });
    },
    blocks,
    blockNo: entry[0],
    setBlockNo: (n) => {
      setPicked(n);
      track("cta_click", { cta_id: "date_picker_start", cta_location: "pricing", cta_label: `block_${n}`, link_url: "#pricing" });
    },
    active,
    usd,
    foundingPrice: (gbp) => (usd ? US_PRICES.founding : gbp),
    standardPrice: (gbp) => (usd ? US_PRICES.standard : gbp),
  };
};

/** The five session dates for a cohort, with any moved dates applied. */
export const sessionDates = (c: CohortStart): string[] =>
  [0, 1, 2, 3, 4].map((i) => addDays(c.start, i * 7)).map((d) => c.moves?.[d] ?? d).sort();

/** Tag a Payment Link URL with the region and cohort so the checkout gate builds the right session. */
export const tagCheckout = (href: string, c: CohortStart) => {
  const u = new URL(href);
  u.searchParams.set("dg_region", c.region);
  u.searchParams.set("dg_cohort", c.start);
  return u.toString();
};

/** Region switch plus one chip per start. Sits directly above the pricing cards. */
export const DatePicker = ({ choice }: { choice: CohortChoice }) => {
  const { region, setRegion, blocks, blockNo, setBlockNo, active, usd } = choice;
  if (blocks.length === 0) return null;
  return (
    <div className="max-w-5xl" data-ph-section="date-picker">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">Book your seat</p>
        <div role="group" aria-label="Choose your time zone" className="inline-flex rounded-full border border-cream/30 p-1">
          {(["uk", "us"] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={region === k}
              onClick={() => setRegion(k)}
              className={cn("rounded-full px-4 py-2 font-sans text-sm tracking-wider transition-colors", region === k ? "bg-brass text-walnut" : "text-cream/80 hover:text-cream")}
            >
              {k === "uk" ? "UK / EMEA" : "Americas"}
            </button>
          ))}
        </div>
      </div>
      <div role="group" aria-label="Choose your start date" className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {blocks.map(([n, cs]) => {
          const c = cs.find((x) => x.region === region) ?? cs[0];
          const on = n === blockNo;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => setBlockNo(n)}
              className={cn("border px-2 py-3 text-center transition-colors sm:px-4", on ? "border-brass bg-brass text-walnut" : "border-cream/30 text-cream hover:border-cream/60")}
            >
              <span className="block font-display text-lg font-semibold leading-tight">{fmtDate(c.start, { month: "short" })}</span>
              <span className="block text-xs opacity-80">{fmtDate(c.start, { weekday: "short", day: "numeric" })}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-cream/90" aria-live="polite">
        <span className="font-semibold">Starts {fmtDate(active.start, { weekday: "long", day: "numeric", month: "long" })}.</span> {active.time}, five weekly sessions to{" "}
        {fmtDate(addDays(active.start, 28), { day: "numeric", month: "long" })}.
        {usd ? " Charged in US dollars." : " Charged in pounds."}
      </p>
      <p className="mt-2 text-sm text-cream/80">
        <span className="font-semibold text-cream">Sessions:</span>{" "}
        {sessionDates(active).map((d) => fmtDate(d, { day: "numeric", month: "short" })).join(", ")}
      </p>
      {active.note && <p className="mt-1 text-xs text-cream/70">{active.note}</p>}
    </div>
  );
};
