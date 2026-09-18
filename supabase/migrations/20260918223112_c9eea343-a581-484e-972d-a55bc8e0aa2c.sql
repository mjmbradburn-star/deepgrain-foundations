DROP FUNCTION IF EXISTS public.__probe_queue_auth();

-- Wake the dispatcher when mail is enqueued, plus an hourly retry backstop.
CREATE OR REPLACE FUNCTION public.tick_email_queue()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  service_key text;
  cooldown timestamptz;
BEGIN
  SELECT retry_after_until INTO cooldown FROM public.email_send_state LIMIT 1;
  IF cooldown IS NOT NULL AND cooldown > now() THEN
    RETURN;
  END IF;

  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'email_queue_service_role_key'
  LIMIT 1;

  IF service_key IS NULL THEN
    RAISE WARNING 'tick_email_queue: email_queue_service_role_key not found in vault';
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := 'https://todgunffzlopbenewfnp.supabase.co/functions/v1/process-email-queue',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 20000
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'tick_email_queue failed: %', SQLERRM;
END;
$$;

REVOKE ALL ON FUNCTION public.tick_email_queue() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.wake_email_dispatcher()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.tick_email_queue();
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'wake_email_dispatcher failed: %', SQLERRM;
  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.wake_email_dispatcher() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS wake_dispatcher_on_transactional_enqueue ON pgmq.q_transactional_emails;
CREATE TRIGGER wake_dispatcher_on_transactional_enqueue
AFTER INSERT ON pgmq.q_transactional_emails
FOR EACH STATEMENT EXECUTE FUNCTION public.wake_email_dispatcher();

DROP TRIGGER IF EXISTS wake_dispatcher_on_auth_enqueue ON pgmq.q_auth_emails;
CREATE TRIGGER wake_dispatcher_on_auth_enqueue
AFTER INSERT ON pgmq.q_auth_emails
FOR EACH STATEMENT EXECUTE FUNCTION public.wake_email_dispatcher();

-- Hourly backstop for anything left behind by a failed send or rate-limit cooldown.
DO $$
BEGIN
  PERFORM cron.unschedule('process-email-queue');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'process-email-queue-backstop',
  '0 * * * *',
  $$ SELECT public.tick_email_queue() WHERE EXISTS (SELECT 1 FROM pgmq.q_transactional_emails UNION ALL SELECT 1 FROM pgmq.q_auth_emails) $$
);