-- Cleanup: remove the synthetic brain signup test row created during the post-security-fix audit.
DELETE FROM public.brain_access_tokens
WHERE subscriber_id IN (
  SELECT id FROM public.brain_subscribers WHERE email = 'brain-test-1777905321@deepgrain-test.local'
);
DELETE FROM public.email_send_log
WHERE recipient_email = 'brain-test-1777905321@deepgrain-test.local';
DELETE FROM public.suppressed_emails
WHERE email = 'brain-test-1777905321@deepgrain-test.local';
DELETE FROM public.brain_subscribers
WHERE email = 'brain-test-1777905321@deepgrain-test.local';
