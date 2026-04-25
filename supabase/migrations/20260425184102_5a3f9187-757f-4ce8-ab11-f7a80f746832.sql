
CREATE TABLE public.brain_access_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event text NOT NULL,
  details jsonb
);

CREATE INDEX idx_brain_access_audit_log_created_at
  ON public.brain_access_audit_log(created_at DESC);

ALTER TABLE public.brain_access_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can read brain access audit log"
  ON public.brain_access_audit_log FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert brain access audit log"
  ON public.brain_access_audit_log FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.reconcile_brain_access_tokens()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  drift_unsub_count integer := 0;
  drift_suppressed_count integer := 0;
  expired_count integer := 0;
  result jsonb;
BEGIN
  -- Drift: subscriber unsubscribed but token still active
  WITH revoked AS (
    UPDATE public.brain_access_tokens t
    SET revoked_at = now(),
        revoke_reason = 'reconcile_drift_unsubscribed'
    FROM public.brain_subscribers s
    WHERE t.subscriber_id = s.id
      AND s.unsubscribed_at IS NOT NULL
      AND t.revoked_at IS NULL
    RETURNING t.id
  )
  SELECT COUNT(*) INTO drift_unsub_count FROM revoked;

  -- Drift: subscriber email in suppression list but token still active
  WITH revoked AS (
    UPDATE public.brain_access_tokens t
    SET revoked_at = now(),
        revoke_reason = 'reconcile_drift_suppressed'
    FROM public.brain_subscribers s
    WHERE t.subscriber_id = s.id
      AND t.revoked_at IS NULL
      AND EXISTS (
        SELECT 1 FROM public.suppressed_emails se
        WHERE lower(se.email) = lower(s.email)
      )
    RETURNING t.id
  )
  SELECT COUNT(*) INTO drift_suppressed_count FROM revoked;

  -- Expired: past expires_at, mark revoked so /open-brain logs are clean
  WITH revoked AS (
    UPDATE public.brain_access_tokens
    SET revoked_at = now(),
        revoke_reason = 'reconcile_expired'
    WHERE revoked_at IS NULL
      AND expires_at < now()
    RETURNING id
  )
  SELECT COUNT(*) INTO expired_count FROM revoked;

  result := jsonb_build_object(
    'drift_unsubscribed', drift_unsub_count,
    'drift_suppressed', drift_suppressed_count,
    'expired', expired_count,
    'total', drift_unsub_count + drift_suppressed_count + expired_count
  );

  INSERT INTO public.brain_access_audit_log(event, details)
  VALUES ('reconcile_run', result);

  RETURN result;
END;
$$;
