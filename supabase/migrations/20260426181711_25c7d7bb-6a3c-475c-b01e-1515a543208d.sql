
CREATE TABLE public.notion_sync_state (
  id integer PRIMARY KEY DEFAULT 1,
  last_synced_at timestamptz NOT NULL DEFAULT '1970-01-01T00:00:00Z',
  last_run_at timestamptz,
  last_run_status text,
  last_run_count integer,
  last_run_error text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notion_sync_state_singleton CHECK (id = 1)
);

ALTER TABLE public.notion_sync_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage notion sync state"
ON public.notion_sync_state
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

INSERT INTO public.notion_sync_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
