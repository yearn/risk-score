# Curation on Cloudflare Workers

Implementation for [issue #578](https://github.com/yearn/risk-score/issues/578).
This migrates only curation.yearn.fi. Provisioning, DNS, production attribution,
and deployed cache verification are release prerequisites owned outside this checkout.
Do not enable publication until the corresponding prerequisites below are complete.

## Build and local validation

Use Node 24 and npm. `.npmrc` retains `ignore-scripts=true`, `min-release-age=7`
and exact saves; `package-lock.json` is the installation contract.

```sh
npm ci
node scripts/check_worker_tools.mjs
npm test
uv run python -m unittest discover -s tests
npm run build
npm exec playwright -- install chromium
npm run test:worker
npm run preview
```

`npm run build` keeps Astro static, validates reports/graphs/bridges, packages
tracked vault JSON/Markdown into `dist/_data`, and bundles `worker/index.ts`
into `release/worker.mjs`. `worker/public-data.ts` is the explicit public-data
manifest. Tracked vault files missing from it fail packaging. JSON validation
rejects invalid shapes, non-lowercase address keys, literal duplicate keys and
case-normalized/escaped duplicates before deployment. Asset bytes remain unchanged.

`release/bundle.json` is a data envelope with base64 files and repository, PR,
run, attempt, exact source SHA, analytics mode, and vault checksums.
`release/provenance.json` records its SHA-256. CI verifies `git rev-parse HEAD`
against the explicitly selected revision. Local builds include uncommitted edits;
only CI's checked artifact is eligible for publication.

Wrangler 4.154.0 resolves esbuild 0.28.2 and workerd 1.20261023.1 through their
pinned optional platform packages. Their postinstall scripts are present but
not needed on tested Linux x64: the JS wrappers resolve the native packages
directly. `check_worker_tools.mjs` exercises the wrappers and esbuild API and
prints package versions/paths, never configuration secrets. Building OG images
also exercises the existing resvg native package. No blanket lifecycle-script
exception is enabled. CI starts workerd and runs real asset-routing and Chromium
tests after a clean `npm ci`. Chromium installation is an explicit browser-test
step from the pinned Playwright package, separate from npm lifecycle scripts.

## Response contract

| Resource | Delivery and browser policy |
| --- | --- |
| Exact static files | Asset-first; security headers from generated `_headers` |
| `/`, clean pages with either slash form | Worker resolves `index.html` using `ASSETS`, without redirects |
| HTML, stable images, OG images, sitemap, `llms.txt` | `public, max-age=0, must-revalidate`; preserve asset ETags |
| Confirmed content-hashed `_astro` JS/CSS/fonts | `public, max-age=31536000, immutable` |
| `/cdn/vaults/<chain>.json`, single-vault JSON, vault Markdown | `ASSETS` only; CORS; `public, max-age=60` |
| `/api/cdn/...` | Alias of the same CDN handlers |
| Bare `/cdn` or `/api/cdn`, including query-only calls | 400 |
| Suffixed CDN routes with `schema` + `file` | Validated overrides within the same manifest |
| CDN and monitoring methods | GET; OPTIONS 204; HEAD and all other methods 405 before reads/cache access |
| Successful monitoring GETs | Browser 30 seconds; targeted Cache API 60 seconds |
| Missing pages/APIs, errors | Explicit error status; `no-store` |
| Plausible event POST | `no-store`; exact endpoint only |

Static headers are grouped within Cloudflare's 100-rule limit. Both Wrangler
configs explicitly set `cache.enabled: false`, `html_handling: none`, and
`not_found_handling: none`. There is no SPA fallback, global response cache, KV,
R2 or Durable Object. `run_worker_first` covers the bare and subtree forms of
`/_data`, `/api`, `/cdn`, `/proxy/plausible`. A `/*%*` rule also intercepts encoded
paths before asset normalization can redirect or expose an internal asset.
External internal-data reads return 404/no-store. Runtime tests place static
collisions in reserved namespaces and test literal and encoded URLs.

All known vault files, including `RISK_FRAMEWORK.md` and `VAULT.md`, are bundled.
Generic CDN resources are restricted to the manifest. **TODO: Vercel owners must
inventory working non-vault `/cdn/<path>` resources and confirm parity before
cutover.** Add confirmed resources to the manifest and handler/runtime tests;
do not use a whole-checkout publication or remote-file fallback.

Monitoring permits only `/protocols`, `/alerts`, `/alerts/<numeric-id>` under
`/api/monitoring`. Alerts accept the existing parameter allowlist with duplicate,
length and value validation. The former Vercel `path` query artifact is rejected.
Requests have an 8-second deadline and a 2 MiB JSON response bound; redirects and
upstream error bodies are rejected. Only a server-side bearer token is forwarded.
Successful GET cache keys include hostname, environment, source revision and all
validated inputs. Cache errors fall through to live reads; there is no stale
revalidation engine. `X-Monitoring-Cache: HIT|MISS` assists deployed verification.
Do not confuse this with Static Assets caching or browser revalidation.

Plausible permits only `POST /proxy/plausible/api/event` to the fixed
`https://plausible.io/api/event`, with a 16 KiB body bound, 5-second deadline,
supported JSON/plain-text content types, and no redirect following. It forwards
the body and User-Agent and replaces forwarding chains using ingress
`CF-Connecting-IP` for both IP headers. Cookies/authorization never pass through.
The outbound header tests establish intent; final Cloudflare wire behavior is
still a deployed check.

Normal builds disable tracker initialization. Only an explicit
`PUBLIC_ANALYTICS_ENABLED=true` build initializes automatic pageviews and outbound
links. CI enables that for production pushes only. Independently, the preview
Worker always returns 204 for event POSTs without a Plausible subrequest.
Chromium tests block external networking and verify preview pageviews/outbound
clicks produce zero analytics requests. Production-build browser tests send only
to the local preview Worker, where forwarding remains suppressed. An outbound
guard around the compiled test Worker permits only the local monitoring fixture;
even a forwarding regression cannot send an event to Plausible.

## Publication and credentials

`tests.yml` runs for every PR, including forks, without secrets, environment
approval or OIDC. It explicitly checks out the PR head for preview artifacts.
A separate merge-result job checks `github.sha`; previews do not replace merge
checks. Production artifacts come only from the exact master push SHA.

The reusable publication workflow is guarded by protected GitHub environments.
Its runner checks out **master deployment tooling**, installs only those reviewed
dependencies, then downloads the validated bundle as data. It never checks out,
imports, builds, installs dependencies from, or executes the downloaded PR code.
Worker config comes from master, not the artifact. Wrangler receives a prebuilt
ES module with `--no-bundle` and no build hooks. Bundle identity/checksum, filenames,
size and data checksums are validated before writing files. Publication rechecks
the run, successful checks, artifact identity, current PR head, same-repository
eligibility and current-head maintainer approval immediately before upload.
Forks, drafts, stale heads and unreviewed revisions are rejected.

Repository owners must review workflow changes as part of the protected
environment approval; environment protection is essential because a PR can edit
workflow YAML. The deployment scripts and Wrangler configuration used on the
credential-bearing runner always come from reviewed master. Initial activation
must wait until this tooling has merged to master. A PR whose code has already
passed CI can receive a current-head review, then have the pending environment
job approved. If the job was rejected before review, rerun the full workflow
after approval; publication requires the same attempt's validation and bundle.

| Setting | Preview environment | Production environment |
| --- | --- | --- |
| GitHub environment | `cloudflare-preview` | `cloudflare-production` |
| Worker | `curation-preview` | `curation-production` |
| `CLOUDFLARE_ACCOUNT_ID` variable or secret | Owner-provided account ID | Owner-provided account ID |
| Deployment token environment secret | `CLOUDFLARE_PREVIEW_API_TOKEN`, scoped to preview Worker only | `CLOUDFLARE_PRODUCTION_API_TOKEN`, scoped to production Worker only |
| `MONITORING_API_URL` variable | Preview backend/configuration | Production backend/configuration |
| Monitoring environment secret | `MONITORING_PREVIEW_API_TOKEN`, independently scoped, or empty | `MONITORING_PRODUCTION_API_TOKEN`, production read credential |
| Publication | `wrangler versions upload` only | `wrangler deploy` after checked master push |
| Version URLs | Enabled, immutable URL recorded per PR/head | Disabled |
| Runtime analytics | Always suppressed | Explicitly enabled |

These environment secrets replace this app's Doppler-to-Vercel delivery path;
the shared subscription and yearn-gha remain untouched. Production builds here
also use the static monitoring fallback: no build-time secret is needed. RPC,
explorer and `ARTIFACTS_API_KEY` values never belong in build or Worker environments.
An absent preview token binds an explicit empty value, never production fallback.
The account ID can be a repository variable or the existing repository secret;
it is a configuration identifier. Deployment and monitoring token key names are
distinct per environment, so the generic repository-level `CLOUDFLARE_API_TOKEN`
and `MONITORING_API_TOKEN` are never selected by the publication workflow. Remove
obsolete repository-level deployment credentials after replacements are secured.
Owners must verify the upstream token's actual read-only permissions; the proxy
allowlist does not establish the backend credential's authority.

Both Workers require separate owner provisioning. Preview CI never deploys or
changes active traffic and never creates a shared alias. The immutable URL and
version ID are attached to the PR/head as a GitHub deployment and retained in the
run summary/record with the source SHA and bundle checksum. Bundle artifacts are
retained for 14 days and deployment records for 90 days. Cloudflare owners must
set preview-version retention and Access protection; old version URLs may remain
accessible until explicitly retired. `noindex` is included in preview headers
for static and Worker responses but is not access protection.

## Release evidence and owner handoffs

Local evidence (Linux x64, November 5, 2026): clean npm install with scripts
disabled, native-tool checks, static/Worker build, Node/Python tests and workerd
routing/browser tests. Existing graph warnings (17) and the existing Axelar
bridge coverage warning are unrelated to the migration. Existing npm advisories
for js-yaml, fflate/satori and the sitemap's nested zod remain outside its scope.

These are **unresolved release prerequisites**, not local-test claims:

GitHub environment setup completed November 5, 2026: `cloudflare-preview` accepts
only `refs/pull/*/merge`; `cloudflare-production` accepts only `master`. Both require
approval from an existing repository admin, prevent self-review and disallow
admin bypass. The configured reviewers are matheus1lva, banteg, tapired,
johnnyonline and spalen0. This does not establish master branch protection,
credential scope, Worker provisioning or deployed validation. Environment token
secrets still need to be entered: GitHub does not return stored plaintext values,
and no local copy of the repository token was available to migrate.

- [ ] Vercel/Doppler owner (name TODO): supply working deployment/source SHA,
  configuration, dashboard headers/redirects/firewall/preview settings, generic
  CDN inventory and attributed usage. Preserve the live deployment/domain.
- [ ] Cloudflare owner (name TODO): confirm account, both Worker names, separate
  credentials and secrets, preview-only permissions and absence of production
  access. Configure preview Access, alternate test endpoints, version retention,
  API abuse controls and usage alerts. Keep domain-setup permission out of CI.
- [ ] Repository owner (name TODO): require review plus `Build, data and Worker
  checks` and `Merge result checks` on master; configure both protected deploy
  environments with required reviewers and prevent self-review. Restrict the
  production environment to master. The issue reports no protection/rulesets on
  November 5; workflow checks alone do not enforce merges. Validate a fork can
  run checks without reaching a protected environment, credentials or OIDC.
- [ ] Enable repository variable `CLOUDFLARE_PREVIEW_ENABLED=true` only after the
  preceding preview prerequisites. Verify PR uploads leave preview active
  deployments unchanged and record the immutable version URL for the exact SHA.
- [ ] On that actual hostname and Access policy, verify asset edge reuse,
  browser ETag/304s and all response headers separately from monitoring
  `X-Monitoring-Cache` and upstream-request evidence. Test monitoring cache expiry,
  query/revision isolation, error freshness and credential isolation. If Access
  prevents a usable cache test, obtain an appropriate test hostname before cutover.
- [ ] Compare deployed CDN bodies against recorded vault checksums; verify both
  Markdown URLs/aliases, address lookup, methods, encoded denial, slash forms,
  errors, source headers, sitemap/canonicals and OG images. Scan visible output
  and logging for secret exposure without printing secret values.
- [ ] Analytics owner (name TODO): approve a separate isolated test deployment
  with a separate Plausible test-site identity before network-level header/IP
  attribution verification. Ordinary previews must never forward production
  events. Record platform header rewrites and resolve any attribution mismatch.
- [ ] DNS owner (name TODO): record original CNAME/proxy/TTL/certificate state,
  agree rollback window/operators, and coordinate the production Worker Custom
  Domain binding for curation.yearn.fi only. The conflicting Vercel CNAME needs
  owner replacement; no registrar/nameserver or other-app changes are required.
  Domain provisioning is deliberately absent from routine deployment config.
- [ ] After reviewed preview evidence, enable `CLOUDFLARE_PRODUCTION_ENABLED`,
  publish a checked master push, coordinate cutover, and recheck pages, APIs,
  monitoring, production analytics attribution, headers, freshness and errors.
- [ ] Test rollback to a recorded version/bundle: pages and bundled data must
  match the same SHA, with monitoring keys naturally separated by revision.
  For hosting rollback, DNS owners restore the recorded Vercel assignment/settings
  and verify both pages and data. Retain all evidence and matching artifacts
  through the rollback window; do not rely on CI's 14-day artifact retention.
- [ ] After the window, Vercel owners retire only this app's deployment integration
  and credentials. Then remove the retained `.vercel` ignore entry. Do not revoke
  shared credentials or alter other services/subscriptions.
- [ ] Record production verification, cleanup, direct-static versus Worker
  requests, CPU/log/upstream/CI usage and actual attributed hosting cost. Clean
  HTML, vault wrappers, monitoring and analytics invoke the Worker; direct static
  assets remain separately accounted. Do not assume shared subscription savings.

## Platform references

- [Static asset routing and bindings](https://developers.cloudflare.com/workers/static-assets/binding/)
- [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Version URLs](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/)
- [Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- [Global Workers Cache, intentionally disabled](https://developers.cloudflare.com/workers/cache/)
- [Plausible event API](https://plausible.io/docs/events-api)
