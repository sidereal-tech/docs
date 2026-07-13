# sidereal docs

Documentation for [Sidereal](https://www.sidereal.tech), yield tokenization
on Stellar. This repo holds two things: a **deployable documentation site**
(the same 15-page docs surface the app serves at
[sidereal.tech/docs](https://www.sidereal.tech/docs), packaged standalone),
and the **working records** behind the protocol.

- Contracts repo:
  [`sidereal-tech/contracts`](https://github.com/sidereal-tech/contracts)
- Frontend/SDK repo: [`sidereal-tech/web`](https://github.com/sidereal-tech/web)

## The docs site

A self-contained Next.js app at the repo root: `app/docs/**` (pages),
`components/` (sidebar, pager, atmosphere chrome), no dependency on the main
app workspace. Every page is prerendered static. `/` redirects to `/docs`.

```bash
nvm use 20
pnpm install
pnpm dev          # local preview
pnpm run build    # static production build
```

**Deploy (Vercel):** create a project on this repo, Root Directory = repo
root; Next.js is auto-detected, no environment variables needed. Point a
subdomain (e.g. `docs.sidereal.tech`) at it.

**Keeping content in sync:** the page sources under `app/docs/` are
duplicated from `app/app/docs/` in the web repo. When docs pages change
there, port the change here (the components and prose CSS are copies too).

## Records index

| Path | Contents |
|---|---|
| `docs/deploy/` | Mainnet parameter selection and reproducible-build provenance process |
| `docs/audit/` | Pre-testnet audit and remediation records |
| `docs/testing/` | Live usage and simulation logs (testnet cohorts, mainnet lifecycle) |
| `docs/research/` | Gap analysis vs. the yield-tokenization landscape |
| `docs/plans/` | Working plans, kept as history |
| `docs/marketing/` | Launch and outreach material |
| `evaluation.md` | Post-simulation evaluation notes |

## History note

Extracted from the original monorepo
([`PoulavBhowmick03/sidereal`](https://github.com/PoulavBhowmick03/sidereal))
at commit `3490b40` with history preserved via `git filter-repo` (commit
hashes rewritten). The original repo remains the provenance anchor for
mainnet deployment verification.

## License

Apache-2.0. See [`LICENSE`](./LICENSE).
