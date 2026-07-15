import { supabase } from "@/integrations/supabase/client";

/**
 * Capture layer for the interactive assessments (readiness, exposure map).
 *
 * Every completion records an anonymous row in `assessment_results` (score +
 * layers, no email needed) so Matt gets the full distribution and can
 * benchmark. When a visitor asks for the board-ready readout, the same
 * session_id is recorded again with their email, so leads join back to the
 * score they saw. The score itself stays ungated that is what makes the
 * tool shareable.
 *
 * The table is not in the generated Supabase types yet, so we insert through a
 * narrow local cast rather than editing the generated file.
 */

export interface AssessmentRecord {
  assessment: "readiness" | "exposure-map";
  score?: number | null;
  stage?: string | null;
  layerScores?: Record<string, number> | null;
  detail?: Record<string, unknown> | null;
  email?: string | null;
  name?: string | null;
  organisation?: string | null;
  source?: string | null;
}

const SESSION_KEY = "dg_assessment_session";

/** Stable per-browser id so an anonymous completion and a later lead row link. */
export function getAssessmentSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

type InsertableClient = {
  from: (table: string) => {
    insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
};

/** Fire-and-forget: never block or break the UI if capture fails. */
export async function recordAssessment(record: AssessmentRecord): Promise<void> {
  try {
    const client = supabase as unknown as InsertableClient;
    await client.from("assessment_results").insert({
      session_id: getAssessmentSessionId(),
      assessment: record.assessment,
      score: record.score ?? null,
      stage: record.stage ?? null,
      layer_scores: record.layerScores ?? null,
      detail: record.detail ?? null,
      email: record.email ?? null,
      name: record.name ?? null,
      organisation: record.organisation ?? null,
      source: record.source ?? null,
    });
  } catch {
    /* capture is best-effort; the visitor experience never depends on it */
  }
}
