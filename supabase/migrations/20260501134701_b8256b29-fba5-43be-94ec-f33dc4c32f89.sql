-- 1. Sitemap state table (single-row, internal use only)
CREATE TABLE IF NOT EXISTS public.sitemap_state (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id = TRUE),
  content_hash TEXT,
  url_list JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_checked_at TIMESTAMPTZ,
  last_changed_at TIMESTAMPTZ,
  last_pinged_at TIMESTAMPTZ,
  last_ping_status INTEGER,
  last_ping_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.sitemap_state (id) VALUES (TRUE) ON CONFLICT DO NOTHING;

ALTER TABLE public.sitemap_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sitemap_state is internal only"
  ON public.sitemap_state
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.touch_sitemap_state_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sitemap_state_touch_updated_at ON public.sitemap_state;
CREATE TRIGGER sitemap_state_touch_updated_at
  BEFORE UPDATE ON public.sitemap_state
  FOR EACH ROW EXECUTE FUNCTION public.touch_sitemap_state_updated_at();