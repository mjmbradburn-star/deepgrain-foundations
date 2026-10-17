/**
 * Cohort starts shown by <StartingMonth />. Dates are ISO (YYYY-MM-DD) for the first session;
 * every cohort is five weekly sessions. Americas run Mondays, UK/EMEA Thursdays, same weeks
 * ("block"), with two clear weeks between blocks (Matt, 16 Oct 2026). Later blocks live in
 * Notion ("Cohort calendar, Nov 2026 to Nov 2027"); add one here only when it is ready to sell.
 * Any start listed here must also be in COHORTS in api/api/checkout-session.mjs.
 */
export type CohortRegion = "uk" | "us";

export interface CohortStart {
  block: number;
  region: CohortRegion;
  start: string;
  time: string;
  note?: string;
  /** Session dates that move off the weekly pattern: original ISO date to new ISO date. */
  moves?: Record<string, string>;
}

const US_TIME = "Mondays, 9am PT / 12pm ET (5pm UK)";
const UK_TIME = "Thursdays, 2pm UK";

export const COHORT_STARTS: CohortStart[] = [
  { block: 1, region: "uk", start: "2026-10-22", time: UK_TIME },
  { block: 1, region: "us", start: "2026-10-19", time: US_TIME, note: "26 October is 4pm UK because the clocks change on different dates." },
  { block: 2, region: "uk", start: "2026-11-26", time: UK_TIME, note: "The last session moves to Wednesday 23 December, same time, because 24 December is Christmas Eve.", moves: { "2026-12-24": "2026-12-23" } },
  { block: 2, region: "us", start: "2026-11-23", time: US_TIME },
  { block: 3, region: "uk", start: "2027-01-14", time: UK_TIME },
  { block: 3, region: "us", start: "2027-01-11", time: US_TIME, note: "Monday 18 January is a US holiday, so that week meets Thursday 21 January, same time.", moves: { "2027-01-18": "2027-01-21" } },
];

/** Americas checkout is in USD (decided 16 Oct 2026). UK/EMEA and everyone else pay GBP. */
export const US_PRICES = { founding: "$650", standard: "$895" } as const;

/** Founding pricing covers the October and November 2026 starts only (Matt, 17 Oct 2026). */
export const foundingAvailable = (c: CohortStart): boolean => c.start >= "2026-10-01" && c.start <= "2026-11-30";
