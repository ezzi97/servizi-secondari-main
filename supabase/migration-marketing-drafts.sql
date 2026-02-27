-- ============================================
-- Marketing drafts table (for preview-then-confirm flow)
-- Run after main migration.sql in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS public.marketing_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL DEFAULT '',
  html_content TEXT NOT NULL DEFAULT '',
  confirm_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_drafts_confirm_token ON public.marketing_drafts(confirm_token);
CREATE INDEX IF NOT EXISTS idx_marketing_drafts_status ON public.marketing_drafts(status);
CREATE INDEX IF NOT EXISTS idx_marketing_drafts_created_at ON public.marketing_drafts(created_at DESC);

-- Service role only (API uses service role); no RLS needed for server-side access
GRANT ALL ON public.marketing_drafts TO service_role;
