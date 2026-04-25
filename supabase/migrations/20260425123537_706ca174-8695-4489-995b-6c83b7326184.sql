-- 1. Enable RLS on brain_subscribers (table already exists from Phase 1).
ALTER TABLE public.brain_subscribers ENABLE ROW LEVEL SECURITY;

-- 2. Service-role-only access. The edge function `send-brain-welcome` uses
--    the service role; the browser cannot read or write this table directly.
CREATE POLICY "Service role can read brain subscribers"
  ON public.brain_subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert brain subscribers"
  ON public.brain_subscribers
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update brain subscribers"
  ON public.brain_subscribers
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3. Lookup index for the unsubscribe trigger and admin queries.
CREATE INDEX IF NOT EXISTS brain_subscribers_email_lower_idx
  ON public.brain_subscribers ((lower(email)));

CREATE INDEX IF NOT EXISTS brain_subscribers_created_at_idx
  ON public.brain_subscribers (created_at DESC);

-- 4. Trigger: when an email is added to suppressed_emails (e.g. via the
--    /unsubscribe flow or a bounce), also stamp brain_subscribers.unsubscribed_at
--    so the brain audit trail stays consistent without a second edge function.
CREATE OR REPLACE FUNCTION public.mark_brain_subscriber_unsubscribed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.brain_subscribers
  SET unsubscribed_at = now()
  WHERE lower(email) = lower(NEW.email)
    AND unsubscribed_at IS NULL;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block a suppression insert if the brain update fails.
  RAISE WARNING 'mark_brain_subscriber_unsubscribed failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS suppressed_emails_brain_unsubscribe ON public.suppressed_emails;

CREATE TRIGGER suppressed_emails_brain_unsubscribe
AFTER INSERT ON public.suppressed_emails
FOR EACH ROW
EXECUTE FUNCTION public.mark_brain_subscriber_unsubscribed();