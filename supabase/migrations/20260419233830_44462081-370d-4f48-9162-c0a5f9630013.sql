DROP POLICY IF EXISTS "Authenticated users can read enquiries" ON public.enquiries;

CREATE POLICY "Service role can read enquiries"
  ON public.enquiries
  FOR SELECT
  USING (auth.role() = 'service_role');