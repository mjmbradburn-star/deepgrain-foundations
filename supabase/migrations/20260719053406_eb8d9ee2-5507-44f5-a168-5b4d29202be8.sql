DROP POLICY IF EXISTS "Anyone can record an assessment result" ON public.assessment_results;

CREATE POLICY "Anyone can record an assessment result"
ON public.assessment_results
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND assessment IS NOT NULL
  AND length(assessment) BETWEEN 1 AND 100
  AND (score IS NULL OR (score BETWEEN 0 AND 1000))
  AND (stage IS NULL OR length(stage) <= 100)
  AND (source IS NULL OR length(source) <= 200)
  AND (name IS NULL OR length(name) <= 200)
  AND (organisation IS NULL OR length(organisation) <= 200)
  AND (email IS NULL OR (length(email) <= 320 AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
);