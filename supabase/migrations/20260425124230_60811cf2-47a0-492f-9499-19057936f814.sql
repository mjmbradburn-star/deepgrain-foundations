-- Phase 4: Wire brain unsubscribe propagation.
-- When an email is suppressed (via the global one-click unsubscribe flow),
-- automatically stamp brain_subscribers.unsubscribed_at for any matching
-- brain subscriber. The function itself already exists; this attaches the
-- trigger that was missing.

DROP TRIGGER IF EXISTS suppressed_emails_brain_unsubscribe ON public.suppressed_emails;

CREATE TRIGGER suppressed_emails_brain_unsubscribe
AFTER INSERT ON public.suppressed_emails
FOR EACH ROW
EXECUTE FUNCTION public.mark_brain_subscriber_unsubscribed();