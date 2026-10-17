<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- All protected app functions use `verifiedAuth` and `attachVerifiedSession`; legacy generated demo/Neon middleware is not used because identity must be validated by the live auth service.
- Lovable Cloud is the sole active data path; dormant Neon helpers are not imported by application functions because their placeholder identity lookup is not authentication.
- Usage ingestion stores provider-reported aggregates only, with transactional replacement per provider and atomic rollups; fabricated baselines must never become user financial data.
