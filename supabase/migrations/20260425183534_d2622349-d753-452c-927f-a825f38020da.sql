
CREATE TABLE public.brain_access_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL REFERENCES public.brain_subscribers(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '365 days'),
  revoked_at timestamptz,
  revoke_reason text,
  last_used_at timestamptz,
  use_count integer NOT NULL DEFAULT 0,
  last_ip text
);

CREATE INDEX idx_brain_access_tokens_subscriber ON public.brain_access_tokens(subscriber_id);
CREATE INDEX idx_brain_access_tokens_token ON public.brain_access_tokens(token);

ALTER TABLE public.brain_access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can read brain access tokens"
  ON public.brain_access_tokens FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert brain access tokens"
  ON public.brain_access_tokens FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update brain access tokens"
  ON public.brain_access_tokens FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Revoke tokens when an email is suppressed (bounce/complaint/unsubscribe).
CREATE OR REPLACE FUNCTION public.revoke_brain_tokens_on_suppression()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.brain_access_tokens t
  SET revoked_at = now(),
      revoke_reason = COALESCE(NEW.reason, 'suppressed')
  FROM public.brain_subscribers s
  WHERE t.subscriber_id = s.id
    AND lower(s.email) = lower(NEW.email)
    AND t.revoked_at IS NULL;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'revoke_brain_tokens_on_suppression failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_revoke_brain_tokens_on_suppression ON public.suppressed_emails;
CREATE TRIGGER trg_revoke_brain_tokens_on_suppression
AFTER INSERT ON public.suppressed_emails
FOR EACH ROW
EXECUTE FUNCTION public.revoke_brain_tokens_on_suppression();

-- Revoke tokens when a subscriber is marked unsubscribed.
CREATE OR REPLACE FUNCTION public.revoke_brain_tokens_on_unsubscribe()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.unsubscribed_at IS NOT NULL AND OLD.unsubscribed_at IS NULL THEN
    UPDATE public.brain_access_tokens
    SET revoked_at = now(),
        revoke_reason = 'unsubscribed'
    WHERE subscriber_id = NEW.id
      AND revoked_at IS NULL;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'revoke_brain_tokens_on_unsubscribe failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_revoke_brain_tokens_on_unsubscribe ON public.brain_subscribers;
CREATE TRIGGER trg_revoke_brain_tokens_on_unsubscribe
AFTER UPDATE OF unsubscribed_at ON public.brain_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.revoke_brain_tokens_on_unsubscribe();
