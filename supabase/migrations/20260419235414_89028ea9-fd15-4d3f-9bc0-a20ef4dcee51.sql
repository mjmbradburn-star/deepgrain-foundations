-- Subscribers table for email capture across the site
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'unknown',
  article_slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique email constraint (case-insensitive)
CREATE UNIQUE INDEX subscribers_email_unique ON public.subscribers (LOWER(email));

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can subscribe
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only service role can read the list
CREATE POLICY "Service role can read subscribers"
ON public.subscribers
FOR SELECT
USING (auth.role() = 'service_role');