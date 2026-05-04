-- Tighten the two public-write INSERT policies flagged by the linter.
-- Both endpoints remain anonymously writable (forms on the marketing site),
-- but with format + length validation to stop trivially-abusive payloads.

DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.enquiries;
CREATE POLICY "Public can submit a valid enquiry"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(email) BETWEEN 5 AND 320
    AND name IS NOT NULL
    AND char_length(btrim(name)) BETWEEN 1 AND 200
    AND message IS NOT NULL
    AND char_length(btrim(message)) BETWEEN 1 AND 5000
    AND (organisation IS NULL OR char_length(organisation) <= 200)
    AND (size IS NULL OR char_length(size) <= 80)
  );

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
CREATE POLICY "Public can subscribe with a valid email"
  ON public.subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(email) BETWEEN 5 AND 320
    AND char_length(source) BETWEEN 1 AND 80
    AND (article_slug IS NULL OR char_length(article_slug) <= 200)
  );
