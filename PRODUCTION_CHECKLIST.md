# PRODUCTION_CHECKLIST

Production readiness gate. Everything here must be **green** before we send the invite email to real users.
Cross-reference: `LAUNCH_CHECKLIST.md` (master), `MVP_LAUNCH_CHECKLIST.md` (product scope).

## Infrastructure
- [x] Lovable Cloud (Postgres + Auth) provisioned
- [x] Encryption secret `PROVIDER_KEY_ENCRYPTION_SECRET` set (64 chars, AES-GCM)
- [x] Lovable AI Gateway key `LOVABLE_API_KEY` set
- [ ] Custom domain + SSL
- [ ] CDN caching for `/assets/*`

## Database
- [x] RLS on every user table
- [x] `GRANT`s on every public table
- [x] Backups enabled (Lovable Cloud default)
- [ ] Monthly restore drill scheduled

## Security
- [x] Separate `user_roles` table
- [x] `SECURITY DEFINER` functions have locked `search_path`
- [x] Provider secrets never sent to browser
- [ ] Security scan clean
- [ ] Dependency audit (`bun audit`) clean

## Performance
- [ ] Landing page LCP < 2.5s
- [ ] Dashboard TTI < 3s on 4G
- [ ] Charts virtualized when > 500 points

## Compliance
- [x] Privacy + Terms live
- [ ] GDPR delete-my-data endpoint
- [ ] Cookie policy (if needed)

## Support
- [ ] `support@` email set up
- [ ] Status page / uptime monitor
- [ ] Incident runbook
