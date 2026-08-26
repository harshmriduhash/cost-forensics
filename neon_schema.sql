-- ============================================================
-- LLM Cost Forensics — Neon PostgreSQL Unified DDL Schema
-- Execute this script in your Neon Console SQL Editor
-- ============================================================

-- Enums
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.provider_type AS ENUM ('openai', 'anthropic', 'cohere', 'google_vertex', 'aws_bedrock');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.provider_status AS ENUM ('connecting', 'active', 'error', 'disabled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.recommendation_status AS ENUM ('pending', 'implemented', 'dismissed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.alert_type AS ENUM ('daily_spend', 'weekly_change', 'model_usage');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing', 'incomplete');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  slack_webhook_url text,
  onboarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- providers
CREATE TABLE IF NOT EXISTS public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  type provider_type NOT NULL,
  label text,
  encrypted_key text NOT NULL,
  key_last4 text,
  status provider_status NOT NULL DEFAULT 'connecting',
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_providers_user ON public.providers(user_id);

-- cost_events
CREATE TABLE IF NOT EXISTS public.cost_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  provider_type provider_type NOT NULL,
  model text NOT NULL,
  endpoint text,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_usd numeric(12,6) NOT NULL DEFAULT 0,
  requests integer NOT NULL DEFAULT 1,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cost_events_user_time ON public.cost_events(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_cost_events_provider ON public.cost_events(provider_id);

-- daily_cost_rollups
CREATE TABLE IF NOT EXISTS public.daily_cost_rollups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  day date NOT NULL,
  provider_type provider_type NOT NULL,
  model text NOT NULL,
  total_cost_usd numeric(12,4) NOT NULL DEFAULT 0,
  total_input_tokens bigint NOT NULL DEFAULT 0,
  total_output_tokens bigint NOT NULL DEFAULT 0,
  request_count integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, day, provider_type, model)
);
CREATE INDEX IF NOT EXISTS idx_rollups_user_day ON public.daily_cost_rollups(user_id, day DESC);

-- recommendations
CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  detail text,
  code_snippet text,
  current_cost_usd numeric(12,2),
  predicted_savings_usd numeric(12,2),
  confidence integer,
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  risk risk_level NOT NULL DEFAULT 'low',
  status recommendation_status NOT NULL DEFAULT 'pending',
  notes text,
  implemented_at timestamptz,
  actual_savings_usd numeric(12,2),
  generated_from_snapshot date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_recs_user_status ON public.recommendations(user_id, status);

-- alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  type alert_type NOT NULL,
  threshold numeric(12,2) NOT NULL,
  model text,
  channel_email boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- alert_events
CREATE TABLE IF NOT EXISTS public.alert_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES public.alerts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  value numeric(12,2) NOT NULL,
  message text NOT NULL,
  triggered_at timestamptz NOT NULL DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  kind text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- api_keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  key_prefix text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON public.api_keys(user_id);

-- subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
