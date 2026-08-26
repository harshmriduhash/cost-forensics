-- Alter profiles table to add slack_webhook_url
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slack_webhook_url text;

-- Add new provider types to enum
ALTER TYPE public.provider_type ADD VALUE IF NOT EXISTS 'cohere';
ALTER TYPE public.provider_type ADD VALUE IF NOT EXISTS 'google_vertex';
ALTER TYPE public.provider_type ADD VALUE IF NOT EXISTS 'aws_bedrock';

-- Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT null REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT null,
  key_hash text NOT null UNIQUE,
  key_prefix text NOT null,
  created_at timestamptz NOT null DEFAULT now(),
  last_used_at timestamptz,
  active boolean NOT null DEFAULT true
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "read own api_keys" ON public.api_keys FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert own api_keys" ON public.api_keys FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update own api_keys" ON public.api_keys FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "delete own api_keys" ON public.api_keys FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON public.api_keys(user_id);
