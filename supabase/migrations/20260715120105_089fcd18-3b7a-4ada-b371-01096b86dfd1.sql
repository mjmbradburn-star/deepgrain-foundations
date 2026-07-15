
REVOKE EXECUTE ON FUNCTION public.reconcile_brain_access_tokens() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.dispatch_subscriber_welcome() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_brain_subscriber_unsubscribed() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_email_vt(text, bigint, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.revoke_brain_tokens_on_suppression() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.revoke_brain_tokens_on_unsubscribe() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_sitemap_state_updated_at() FROM PUBLIC, anon, authenticated;
