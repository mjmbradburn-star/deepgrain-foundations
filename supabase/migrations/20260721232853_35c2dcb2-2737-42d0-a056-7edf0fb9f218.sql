DROP POLICY IF EXISTS "Authenticated users can read assessment results" ON public.assessment_results;
REVOKE SELECT ON public.assessment_results FROM authenticated, anon;
GRANT SELECT ON public.assessment_results TO service_role;