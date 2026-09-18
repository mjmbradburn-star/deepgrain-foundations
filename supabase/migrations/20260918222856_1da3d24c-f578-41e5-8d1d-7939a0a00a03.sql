CREATE OR REPLACE FUNCTION public.__probe_email_dispatch_auth()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tok text;
  rid bigint;
BEGIN
  SELECT decrypted_secret INTO tok FROM vault.decrypted_secrets WHERE name = 'email_dispatch_token' LIMIT 1;
  SELECT net.http_post(
    url := 'https://todgunffzlopbenewfnp.supabase.co/functions/v1/send-transactional-email',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || tok),
    body := jsonb_build_object('templateName','__auth_probe_no_such_template__','recipientEmail','probe@example.invalid'),
    timeout_milliseconds := 10000
  ) INTO rid;
  RETURN rid;
END;
$$;

REVOKE ALL ON FUNCTION public.__probe_email_dispatch_auth() FROM PUBLIC, anon, authenticated;