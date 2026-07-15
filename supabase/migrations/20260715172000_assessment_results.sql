-- Aggregate capture for the interactive assessments (readiness, exposure map).
-- Every completion writes an anonymous row (score, layers, stage); the lead
-- form additionally writes email/name/org. Anonymous insert, authenticated read,
-- modelled on public.enquiries.
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  assessment text not null,
  score integer,
  stage text,
  layer_scores jsonb,
  detail jsonb,
  email text,
  name text,
  organisation text,
  source text,
  created_at timestamptz not null default now()
);

alter table public.assessment_results enable row level security;

drop policy if exists "Anyone can record an assessment result" on public.assessment_results;
create policy "Anyone can record an assessment result"
  on public.assessment_results
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can read assessment results" on public.assessment_results;
create policy "Authenticated users can read assessment results"
  on public.assessment_results
  for select
  to authenticated
  using (true);

create index if not exists assessment_results_assessment_idx on public.assessment_results (assessment, created_at desc);
create index if not exists assessment_results_session_idx on public.assessment_results (session_id);
create index if not exists assessment_results_email_idx on public.assessment_results (email) where email is not null;
