CREATE OR REPLACE FUNCTION public.__probe_queue_auth()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tok text;
  rid bigint;
BEGIN
  SELECT decrypted_secret INTO tok FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key' LIMIT 1;
  SELECT net.http_post(
    url := 'https://todgunffzlopbenewfnp.supabase.co/functions/v1/process-email-queue',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || tok),
    body := '{}'::jsonb,
    timeout_milliseconds := 15000
  ) INTO rid;
  RETURN rid;
END;
$$;
REVOKE ALL ON FUNCTION public.__probe_queue_auth() FROM PUBLIC, anon, authenticated;