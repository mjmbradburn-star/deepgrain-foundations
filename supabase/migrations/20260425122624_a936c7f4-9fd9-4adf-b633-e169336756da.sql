
CREATE TABLE public.brain_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text,
  consent_given boolean NOT NULL DEFAULT false,
  consent_timestamp timestamptz NOT NULL,
  source text NOT NULL DEFAULT 'brain',
  referrer text,
  ip_address text,
  user_agent text,
  unsubscribe_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  email_sent_at timestamptz,
  email_status text,
  email_provider_id text,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX brain_subscribers_email_idx ON public.brain_subscribers (lower(email));
CREATE INDEX brain_subscribers_token_idx ON public.brain_subscribers (unsubscribe_token);
CREATE INDEX brain_subscribers_created_idx ON public.brain_subscribers (created_at DESC);

ALTER TABLE public.brain_subscribers ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.brain_subscribers FROM anon;
REVOKE ALL ON public.brain_subscribers FROM authenticated;

-- Service role bypasses RLS by design; no policies are granted to anon/authenticated,
-- so the public REST API cannot select, insert, update, or delete from this table.
