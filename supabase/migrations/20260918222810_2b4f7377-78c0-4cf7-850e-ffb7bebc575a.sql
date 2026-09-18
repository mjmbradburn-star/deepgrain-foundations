-- 1. Create a dedicated dispatch token in Vault (random, never leaves the DB)
DO $$
DECLARE
  existing uuid;
BEGIN
  SELECT id INTO existing FROM vault.secrets WHERE name = 'email_dispatch_token' LIMIT 1;
  IF existing IS NULL THEN
    PERFORM vault.create_secret(
      encode(gen_random_bytes(32), 'hex'),
      'email_dispatch_token',
      'Shared secret used by DB triggers to authenticate to send-transactional-email'
    );
  END IF;
END $$;

-- 2. Verifier used by the edge function. Never returns the secret itself.
CREATE OR REPLACE FUNCTION public.email_dispatch_token_matches(candidate text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected text;
BEGIN
  IF candidate IS NULL OR length(candidate) = 0 THEN
    RETURN false;
  END IF;
  SELECT decrypted_secret INTO expected
  FROM vault.decrypted_secrets
  WHERE name = 'email_dispatch_token'
  LIMIT 1;
  IF expected IS NULL THEN
    RETURN false;
  END IF;
  RETURN expected = candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.email_dispatch_token_matches(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_dispatch_token_matches(text) TO service_role;

-- 3. Trigger now authenticates with the dispatch token
CREATE OR REPLACE FUNCTION public.dispatch_subscriber_welcome()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dispatch_token text;
  project_url text := 'https://todgunffzlopbenewfnp.supabase.co';
  payload jsonb;
BEGIN
  SELECT decrypted_secret INTO dispatch_token
  FROM vault.decrypted_secrets
  WHERE name = 'email_dispatch_token'
  LIMIT 1;

  IF dispatch_token IS NULL THEN
    RAISE WARNING 'dispatch_subscriber_welcome: email_dispatch_token not found in vault';
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'templateName', 'subscriber-welcome',
    'recipientEmail', NEW.email,
    'idempotencyKey', 'subscriber-welcome-' || COALESCE(NEW.source, 'unknown') || '-' || lower(NEW.email),
    'templateData', jsonb_build_object(
      'source', NEW.source,
      'articleSlug', NEW.article_slug
    )
  );

  PERFORM net.http_post(
    url := project_url || '/functions/v1/send-transactional-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || dispatch_token
    ),
    body := payload,
    timeout_milliseconds := 10000
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'dispatch_subscriber_welcome failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.dispatch_subscriber_welcome() FROM PUBLIC, anon, authenticated;