-- Wrapper for pgmq.set_vt so the edge function can defer message visibility
-- (used to implement exponential backoff on transient send failures).
CREATE OR REPLACE FUNCTION public.set_email_vt(
  queue_name text,
  message_id bigint,
  vt_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pgmq'
AS $function$
BEGIN
  PERFORM pgmq.set_vt(queue_name, message_id, vt_seconds);
  RETURN TRUE;
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
WHEN OTHERS THEN
  RAISE WARNING 'set_email_vt failed: %', SQLERRM;
  RETURN FALSE;
END;
$function$;

REVOKE ALL ON FUNCTION public.set_email_vt(text, bigint, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_email_vt(text, bigint, integer) TO service_role;