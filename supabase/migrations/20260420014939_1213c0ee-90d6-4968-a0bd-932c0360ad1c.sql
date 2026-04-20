-- Server-side dispatch of the subscriber welcome email.
-- Replaces the client-callable invocation in EmailCapture.tsx so the
-- send-transactional-email function can no longer be abused via the public
-- anon key to spam arbitrary inboxes.

CREATE OR REPLACE FUNCTION public.dispatch_subscriber_welcome()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, vault
AS $$
DECLARE
  service_key text;
  project_url text := 'https://todgunffzlopbenewfnp.supabase.co';
  payload jsonb;
BEGIN
  -- Read the service role key stored in Vault by setup_email_infra.
  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'email_queue_service_role_key'
  LIMIT 1;

  IF service_key IS NULL THEN
    RAISE WARNING 'dispatch_subscriber_welcome: email_queue_service_role_key not found in vault';
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
      'Authorization', 'Bearer ' || service_key
    ),
    body := payload,
    timeout_milliseconds := 10000
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block the subscriber insert if dispatch fails.
  RAISE WARNING 'dispatch_subscriber_welcome failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS subscribers_dispatch_welcome ON public.subscribers;

CREATE TRIGGER subscribers_dispatch_welcome
AFTER INSERT ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.dispatch_subscriber_welcome();