# 🚀 LAUNCH_CHECKLIST — LLM Cost Forensics

The single source of truth for shipping to real users.
See also: `PRODUCTION_CHECKLIST.md`, `EXECUTION_CHECKLIST.md`, `MVP_LAUNCH_CHECKLIST.md`, `READY_CHECKLIST.md`.

---

## 0. Pre-flight (5 min)

- [ ] `bun install` runs clean
- [ ] `bun run build` completes with 0 errors
- [ ] Environment variables verified in Lovable Cloud
- [ ] Latest DB migration applied
- [ ] Neon connection string configured if using the new DB path
- [ ] Resend sender domain verified before sending real emails

## 1. Product

- [x] Landing page (hero, problem, solution, features, pricing, FAQ)
- [x] Pricing / About / Privacy / Terms
- [x] Auth (email + password + Google OAuth)
- [x] Password reset flow
- [x] Onboarding flow (`/onboarding`) — 3 steps, skippable
- [x] Providers CRUD (connect, list, resync, delete) — AES-GCM encrypted keys
- [x] Cost dashboard (KPIs, line, bar, donut, drill-down)
- [x] AI recommendations engine (Lovable AI Gateway)
- [x] Recommendation detail CRUD (view, edit, notes, actual savings, delete)
- [x] Alerts (create/list/toggle) with in-app notifications and event history
- [x] Cost reports — PDF + CSV export
- [x] Settings (profile, providers, danger zone, account deletion)
- [x] Mail notification hooks for provider, alert, and recommendation events

## 2. Security

- [x] RLS enabled on every user-data table
- [x] Explicit `GRANT` on every public table
- [x] Roles in separate `user_roles` table (privilege-escalation safe)
- [x] `has_role()` as `SECURITY DEFINER` w/ locked search_path
- [x] Provider API keys encrypted at rest (AES-GCM, server-only secret)
- [x] Server-only secrets never leak into client bundle
- [x] Security headers applied globally for CSP, HSTS, frame protections, and XSS mitigation
- [ ] Run a third-party security scan and resolve any critical findings
- [ ] Set up rate limiting for public API routes (once webhooks land)

## 3. Data & Backend

- [x] Migrations idempotent
- [x] `handle_new_user()` trigger creates profile, role, subscription
- [x] `daily_cost_rollups` recomputed on every sync
- [ ] pg_cron for hourly usage sync (post-MVP)
- [ ] pg_cron for daily alert evaluation (post-MVP)
- [ ] pg_cron for weekly digest email (post-MVP)

## 4. Payments (Stripe)

- [ ] Stripe secret key added as Lovable secret
- [ ] Pro price ID configured
- [ ] Stripe webhook endpoint at `/api/public/stripe/webhook`
- [ ] Webhook signing secret stored
- [ ] Checkout + Customer Portal wired
- [ ] Subscription gating on Pro features (alerts, unlimited providers, PDF reports)

## 5. Email (Resend)

- [ ] Resend API key added
- [ ] Domain verified (SPF + DKIM)
- [ ] Welcome email template
- [ ] Alert triggered email template
- [ ] Weekly digest template

## 6. SEO & Sharing

- [x] Unique title + description on every route
- [x] Open Graph + Twitter card on landing
- [x] `sitemap.xml` at `/sitemap.xml`
- [x] `robots.txt`
- [x] Favicon + web manifest + apple-touch icon wired

## 7. Observability

- [x] Client error capture wired to console
- [ ] Server error reporting (Sentry / Logtail — optional)
- [ ] Track key funnel events (signup → connect → run analysis)

## 8. Legal & Trust

- [x] Privacy policy page
- [x] Terms of service page
- [ ] DPA / SOC 2 statement (enterprise, post-launch)
- [ ] Cookie banner (only if adding non-essential cookies)

## 9. Beta launch

- [ ] Publish (Lovable → Publish)
- [ ] Custom domain configured
- [ ] Invite 20 design-partner users
- [ ] Feedback channel (Discord / email)
- [ ] Onboarding call schedule for first 5

## 10. Post-launch monitoring (first 72h)

- [ ] Signup conversion > 30%
- [ ] Connect-provider completion > 60%
- [ ] Zero unhandled server errors
- [ ] Daily digest of usage
