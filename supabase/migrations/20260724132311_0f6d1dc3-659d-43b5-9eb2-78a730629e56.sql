
-- ============ Enums ============
create type public.app_role as enum ('admin', 'user');
create type public.provider_type as enum ('openai', 'anthropic');
create type public.provider_status as enum ('connecting', 'active', 'error', 'disabled');
create type public.recommendation_status as enum ('pending', 'implemented', 'dismissed');
create type public.difficulty_level as enum ('easy', 'medium', 'hard');
create type public.risk_level as enum ('low', 'medium', 'high');
create type public.alert_type as enum ('daily_spend', 'weekly_change', 'model_usage');
create type public.subscription_plan as enum ('free', 'pro');
create type public.subscription_status as enum ('active', 'past_due', 'canceled', 'trialing', 'incomplete');

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid());
create policy "insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());

-- ============ user_roles ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- ============ providers ============
create table public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type provider_type not null,
  label text,
  encrypted_key text not null,
  key_last4 text,
  status provider_status not null default 'connecting',
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.providers to authenticated;
grant all on public.providers to service_role;
alter table public.providers enable row level security;
-- Users may SELECT metadata (encrypted_key never exposed to client via views/RLS filter in queries)
create policy "read own providers" on public.providers for select to authenticated using (user_id = auth.uid());
create policy "insert own providers" on public.providers for insert to authenticated with check (user_id = auth.uid());
create policy "update own providers" on public.providers for update to authenticated using (user_id = auth.uid());
create policy "delete own providers" on public.providers for delete to authenticated using (user_id = auth.uid());
create index providers_user_idx on public.providers(user_id);

-- ============ cost_events ============
create table public.cost_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  provider_type provider_type not null,
  model text not null,
  endpoint text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd numeric(12,6) not null default 0,
  requests integer not null default 1,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.cost_events to authenticated;
grant all on public.cost_events to service_role;
alter table public.cost_events enable row level security;
create policy "read own cost_events" on public.cost_events for select to authenticated using (user_id = auth.uid());
create index cost_events_user_time_idx on public.cost_events(user_id, occurred_at desc);
create index cost_events_provider_idx on public.cost_events(provider_id);
create index cost_events_model_idx on public.cost_events(user_id, model);

-- ============ daily_cost_rollups ============
create table public.daily_cost_rollups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  provider_type provider_type not null,
  model text not null,
  total_cost_usd numeric(12,4) not null default 0,
  total_input_tokens bigint not null default 0,
  total_output_tokens bigint not null default 0,
  request_count integer not null default 0,
  unique (user_id, day, provider_type, model)
);
grant select, insert, update, delete on public.daily_cost_rollups to authenticated;
grant all on public.daily_cost_rollups to service_role;
alter table public.daily_cost_rollups enable row level security;
create policy "read own rollups" on public.daily_cost_rollups for select to authenticated using (user_id = auth.uid());
create index rollups_user_day_idx on public.daily_cost_rollups(user_id, day desc);

-- ============ recommendations ============
create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  summary text not null,
  detail text,
  code_snippet text,
  current_cost_usd numeric(12,2),
  predicted_savings_usd numeric(12,2),
  confidence integer,
  difficulty difficulty_level not null default 'medium',
  risk risk_level not null default 'low',
  status recommendation_status not null default 'pending',
  implemented_at timestamptz,
  actual_savings_usd numeric(12,2),
  generated_from_snapshot date,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.recommendations to authenticated;
grant all on public.recommendations to service_role;
alter table public.recommendations enable row level security;
create policy "read own recs" on public.recommendations for select to authenticated using (user_id = auth.uid());
create policy "update own recs" on public.recommendations for update to authenticated using (user_id = auth.uid());
create index recs_user_status_idx on public.recommendations(user_id, status);

-- ============ alerts ============
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type alert_type not null,
  threshold numeric(12,2) not null,
  model text,
  channel_email boolean not null default true,
  active boolean not null default true,
  last_triggered_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.alerts to authenticated;
grant all on public.alerts to service_role;
alter table public.alerts enable row level security;
create policy "manage own alerts" on public.alerts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.alert_events (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.alerts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  value numeric(12,2) not null,
  message text not null,
  triggered_at timestamptz not null default now()
);
grant select, insert on public.alert_events to authenticated;
grant all on public.alert_events to service_role;
alter table public.alert_events enable row level security;
create policy "read own alert_events" on public.alert_events for select to authenticated using (user_id = auth.uid());

-- ============ subscriptions ============
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan subscription_plan not null default 'free',
  status subscription_status not null default 'active',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;
create policy "read own subscription" on public.subscriptions for select to authenticated using (user_id = auth.uid());

-- ============ notifications ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  kind text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "read own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "update own notifications" on public.notifications for update to authenticated using (user_id = auth.uid());
create index notif_user_idx on public.notifications(user_id, created_at desc);

-- ============ triggers ============
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger t_profiles_updated before update on public.profiles for each row execute function public.update_updated_at_column();
create trigger t_providers_updated before update on public.providers for each row execute function public.update_updated_at_column();
create trigger t_subscriptions_updated before update on public.subscriptions for each row execute function public.update_updated_at_column();

-- Auto-create profile + free subscription on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;

  insert into public.subscriptions (user_id, plan, status) values (new.id, 'free', 'active') on conflict (user_id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
