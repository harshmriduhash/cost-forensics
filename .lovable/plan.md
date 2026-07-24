
# LLM Cost Forensics — MVP Build Plan

Building a launch-ready MVP based on your PRD. Below is the scope, phased for a first shippable version, plus honest notes on what needs your input (API keys, OAuth apps, Stripe) before it can go live to real paying users.

## Scope for MVP v1 (shippable)

### Public marketing
- Landing page: hero, problem, solution (4-step how it works), features, pricing (Free vs Pro $299), FAQ, footer
- Pricing page, Privacy, Terms, About
- SEO metadata + sitemap/robots per route

### Auth (Lovable Cloud)
- Email/password + Google sign-in
- Email confirmation, password reset
- Protected `_authenticated` routes

### Onboarding
- Welcome → Choose provider (OpenAI, Anthropic) → Paste API key (see note below) → "Analyzing…" screen → Dashboard
- Empty state and skip flow

### Provider connection
- OpenAI + Anthropic connectors via **user-supplied API key** (stored encrypted server-side)
- OAuth to OpenAI/Anthropic is **not offered by those providers today** — API key is the industry-standard method (what Vellum, Helicone, Langfuse use). Documented as "connect via API key" in UI.
- Ingest usage: pull recent Usage/Cost data via provider APIs, normalize into `cost_events` table

### Cost dashboard
- Time range selector (7/30/90 days)
- KPIs: total spend, vs previous period, projected month-end
- Charts (Recharts): spend over time (line), cost by model (donut), cost by endpoint/task (bar), time-of-day heatmap
- Drill-down table of recent calls with CSV export

### AI-powered recommendations (Lovable AI Gateway, `openai/gpt-5.5`)
- Server function analyzes aggregated usage and returns 5–10 structured recommendations: title, current cost, predicted savings, confidence, difficulty, risk, explanation, code snippet
- Recommendation detail modal + "Mark as implemented" → tracks before/after spend
- Regenerate on demand + cached per snapshot

### Alerts (Pro)
- Create/edit/delete alerts: daily spend > $X, WoW % change, model usage change
- Server cron via pg_cron hitting `/api/public/cron/check-alerts` evaluates and emails via Resend
- In-app notifications list

### Billing (Stripe)
- Free vs Pro $299/mo
- Stripe Checkout for upgrade, Customer Portal for manage/cancel
- Webhook updates `subscriptions` table; gates Pro features (alerts, recommendations depth, API access)

### Settings
- Profile, providers (connect/disconnect, rotate key), billing, notifications, API keys (Pro), danger zone

### Email (Resend)
- Welcome, weekly digest (cron), alert triggered, receipt (via Stripe)

## Technical architecture

- **Stack:** TanStack Start + React 19 + Tailwind v4 + shadcn (project template)
- **Backend:** Lovable Cloud (Postgres + Auth + Storage) + TanStack server functions
- **AI:** Lovable AI Gateway (`openai/gpt-5.5`) for recommendation generation with `Output.object`
- **Payments:** Stripe (Checkout + Portal + webhook at `/api/public/stripe/webhook`)
- **Email:** Resend (server-side)
- **Cron:** pg_cron → `/api/public/cron/*` endpoints (secret-verified) for ingestion, alerts, digests
- **Encryption:** provider keys encrypted with `PROVIDER_KEY_ENCRYPTION_SECRET` (AES-GCM) before insert; only decrypted inside server handlers

## Database (Lovable Cloud)

`profiles`, `user_roles`, `app_role` enum • `providers` (user_id, type, encrypted_key, org_id, status, last_synced_at) • `cost_events` (provider_id, model, endpoint, input_tokens, output_tokens, cost_usd, occurred_at) • `daily_cost_rollups` • `recommendations` (status: pending/implemented/dismissed, savings tracking) • `alerts` + `alert_events` • `subscriptions` (stripe_customer_id, plan, status, current_period_end) • `notifications` • `audit_log`

RLS on every table + explicit GRANTs. Roles table separate from profiles (privilege-escalation safe).

## Build phases

1. Design system + landing page + pricing/legal pages
2. Auth (email + Google) + `_authenticated` layout + settings shell
3. DB schema, RLS, provider key encryption, connect-provider flow
4. Usage ingestion for OpenAI + Anthropic + rollups + cron
5. Dashboard (KPIs, charts, drill-down, CSV)
6. AI recommendations engine + detail modal + implementation tracking
7. Alerts + email delivery + weekly digest
8. Stripe (Checkout, Portal, webhook, Pro gating)
9. Onboarding polish, empty states, notifications, error boundaries
10. Security scan, SEO metadata per route, sitemap, publish

## What I need from you to ship to real users

I will build everything and wire the code, but these must be provided (I'll prompt via secure secret forms at the right moment):

- **Stripe** secret key + Pro price ID + webhook signing secret
- **Resend** API key + verified sending domain
- **Google OAuth** client (for sign-in) — I'll set up the Cloud side
- Optional: your own **OpenAI/Anthropic API keys** for E2E testing

Lovable AI Gateway key is auto-provisioned; encryption secret I generate.

## Out of scope for v1 (per PRD's V1/V2 sections — post-launch)

Cohere/Vertex/Bedrock, Slack integration, team collaboration, forecasting ML, LangChain/LlamaIndex hooks, budget/allocation, auto-apply optimizations, anomaly ML, benchmarking. All are called out as V1/V2 in your PRD.

---

Reply **"go"** to start building phase 1 (design system + landing). I'll surface secret-collection prompts (Stripe, Resend) when we reach those phases so nothing blocks earlier work.
