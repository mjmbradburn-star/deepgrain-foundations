DO $$
DECLARE
  sig text;
  fns text[] := ARRAY[
    'public.enqueue_email(text, jsonb)',
    'public.read_email_batch(text, integer, integer)',
    'public.delete_email(text, bigint)',
    'public.move_to_dlq(text, text, bigint, jsonb)',
    'public.set_email_vt(text, bigint, integer)',
    'public.dispatch_subscriber_welcome()',
    'public.mark_brain_subscriber_unsubscribed()',
    'public.revoke_brain_tokens_on_suppression()',
    'public.revoke_brain_tokens_on_unsubscribe()',
    'public.reconcile_brain_access_tokens()',
    'public.touch_sitemap_state_updated_at()'
  ];
BEGIN
  FOREACH sig IN ARRAY fns LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC', sig);
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', sig);
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM authenticated', sig);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Function % not found, skipping', sig;
    END;
  END LOOP;
END $$;