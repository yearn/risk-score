# Plan: API-driven monitoring page + per-protocol alert history

- **Repository:** `github.com/yearn/risk-score`
- **Depends on:** `github.com/yearn/monitoring` alerts API (PR #273, merged to `main`)
- **Status:** Draft / planning

## Context

The monitoring page (`/monitoring`) is currently static — it renders a hardcoded list of
monitored protocols and their monitor descriptions from `src/data/monitoring.ts`, with no
live data. Alerts only go to Telegram.

The `monitoring-scripts-py` backend now ships a read-only HTTP API (merged on `main`, PR #273)
backed by SQLite. It exposes:

- `GET /v1/protocols` — `{ data: [{ name, tasks: [{ name, script, args, profile, cron }] }], count }`
  (protocol = `protocols/<name>/` dir, cadence from `jobs.yaml`).
- `GET /v1/alerts?protocol=&severity=&source=&from=&to=&cursor=&limit=` — newest-first,
  cursor-paginated `{ data: [AlertEvent], next_cursor, limit }`.
- `GET /v1/alerts/{id}` — single alert.
- AlertEvent fields: `id, created_at, source, protocol, channel, severity (LOW|MEDIUM|HIGH|CRITICAL),
  message, plain_text, silent, delivery_status, delivered_at, delivery_error, metadata`.

Goal: surface live alert history on the site so users can see *what fired*, not just *what is watched*.

Two backend constraints drive the design:

1. The API binds to `127.0.0.1:8923` behind a reverse proxy and **sets no CORS headers** and
   `Cache-Control: no-store` — the browser cannot call it directly.
2. Protocol identifiers differ between the two repos (`monitoring.ts` uses display ids like
   `aave-v3`/`compound-v3`/`maker-dao`/`superstate-ustb`; the API uses dir names `aave`/`compound`/
   `maker`/`ustb`). Some site protocols (`silo`, `pendle`, `euler`) have no API job yet, and some
   API protocols (`bad-debt`, `spark`, `stables`, `safe`, `timelock`) aren't on the site list.

## Decisions

- **Per-protocol detail pages** at `/monitoring/[id]` (static-generated like `report/[slug].astro`),
  each fetching its own alert history client-side.
- **Vercel Edge Function proxy** — reuse the `api/cdn.ts` pattern. The browser calls our own
  `/api/monitoring/*`; the edge function fetches the internal API and injects CORS + caching.
- **MVP first, then iterate.** Phase 1 = proxy + recent alerts. Phase 2 = full history pages.

---

## Phase 1 — MVP (edge proxy + recent alerts)

### 1.1 Edge proxy: `api/monitoring.ts` (new)

Model on `api/cdn.ts` (`export const config = { runtime: 'edge' }`, OPTIONS preflight, CORS headers,
GET-only, try/catch).

- Read base URL from `process.env.MONITORING_API_URL` (e.g. `https://<monitoring-host>`); return 500
  if unset.
- Allowlist only the two upstream paths and forward the querystring verbatim:
  - `/api/monitoring/protocols` → `${BASE}/v1/protocols`
  - `/api/monitoring/alerts`    → `${BASE}/v1/alerts?<query>`
  - (Phase 2) `/api/monitoring/alerts/{id}` → `${BASE}/v1/alerts/{id}`
- Validate/whitelist forwarded query params (`protocol, severity, source, from, to, cursor, limit`)
  to avoid open proxying; reject anything else.
- Override upstream `no-store` with `cache-control: public, max-age=30, s-maxage=60,
  stale-while-revalidate=120` and `access-control-allow-origin: *` (same header style as `api/cdn.ts`).
- Add `MONITORING_API_URL` to `.env.example` and set it in Vercel project env.
- Add a `vercel.json` rewrite if pretty paths are wanted (optional; `/api/monitoring/*` resolves
  natively without one).

### 1.2 Protocol → API mapping in `src/data/monitoring.ts`

Add an optional `apiProtocol?: string` field to the `Protocol` interface (top of the file, ~line 7)
and populate it for every protocol that has an API job. Map the mismatches explicitly:
`aave-v3→aave`, `compound-v3→compound`, `maker-dao→maker`, `superstate-ustb→ustb`,
`rtoken→rtoken`, `lrt-pegs→lrt-pegs`, etc. Leave `apiProtocol` unset for `silo`/`pendle`/`euler`
(no backend job yet) so the UI can omit live data for them gracefully.

### 1.3 Shared client helper: `src/lib/monitoring.ts` (new)

- TypeScript types `AlertEvent` and `AlertsResponse` mirroring the API shape (see Context).
- `fetchAlerts(params)` → `GET /api/monitoring/alerts?…` returning `AlertsResponse`.
- A severity→style/emoji map reused by both the list and detail views
  (LOW ℹ️, MEDIUM ⚠️, HIGH 🚨, CRITICAL 🔴 — matches backend `utils/alert.py`).
- Keep all fetching **client-side** (browser → our edge proxy); do not fetch at build time so the
  static site stays decoupled from backend uptime.

### 1.4 Monitoring list page: `src/pages/monitoring.astro` (edit)

- Render each accordion card with `data-api-protocol={p.apiProtocol}` and link the header to
  `/monitoring/{p.id}/`.
- Add an inline `<script>` (extend the existing one at ~line 93) that, for cards with an
  `apiProtocol`, calls `fetchAlerts({ protocol, limit: 1 })` and renders a small "last alert"
  badge (relative time + severity dot). Batch/guard requests; fail silently to the current static
  view on error.

### 1.5 Detail page: `src/pages/monitoring/[id].astro` (new)

- `getStaticPaths()` from `protocols` in `src/data/monitoring.ts` (same pattern as
  `src/pages/report/[slug].astro`).
- Server-render the static header (icon via `protocolIconUrl`, name, frequency, monitor
  descriptions from `items[]`) so the page is useful even with JS off.
- Client `<script>` fetches recent alerts via `fetchAlerts({ protocol: apiProtocol, limit: 20 })`
  and renders a history list (time, severity, message). Show an empty/"no alerts" state, and a
  "live history not yet available" note when `apiProtocol` is unset.
- Reuse `BaseLayout.astro`; mirror styling/classes from `monitoring.astro` and `report/[slug].astro`.

---

## Phase 2 — Full history (iterate)

- Detail page: severity/source filters + cursor pagination ("Load more" using `next_cursor`).
- Optionally drive the protocol **list/cadence** from `GET /v1/protocols` (merge live cron/profile
  with the human-readable descriptions in `monitoring.ts`, joined on `apiProtocol`); flag drift
  between the two sources.
- Optional `/api/monitoring/alerts/{id}` passthrough for deep-linking a single alert.
- Consider a global "recent alerts" feed on the page or home.

---

## Critical files

| File | Action |
|------|--------|
| `api/monitoring.ts` | **new** — edge proxy (pattern: `api/cdn.ts`) |
| `src/lib/monitoring.ts` | **new** — types + `fetchAlerts` + severity map |
| `src/data/monitoring.ts` | edit — add `apiProtocol?` field + values |
| `src/pages/monitoring.astro` | edit — last-alert badge + links to detail |
| `src/pages/monitoring/[id].astro` | **new** — detail page (pattern: `report/[slug].astro`) |
| `.env.example` | edit — add `MONITORING_API_URL` |
| Vercel project env | add `MONITORING_API_URL` (ops) |

All work stays in `risk-score`; no changes to `monitoring-scripts-py` (API already supports the
needed endpoints).

## Reuse (don't reinvent)

- `api/cdn.ts` — edge runtime config, OPTIONS preflight, CORS + cache-control headers, error handling.
- `src/lib/icons.ts` `protocolIconUrl()` — protocol icons.
- `src/pages/report/[slug].astro` — `getStaticPaths` dynamic-route pattern.
- `src/layouts/BaseLayout.astro` — page shell.
- Severity emojis/levels — mirror `monitoring-scripts-py/utils/alert.py`.

## Verification

1. **Backend reachable:** run the API locally — from `monitoring-scripts-py`:
   `CACHE_DIR=/tmp/monitoring-cache uv run python -m api`, then
   `curl 'http://127.0.0.1:8923/v1/protocols'` and `curl 'http://127.0.0.1:8923/v1/alerts?limit=5'`.
2. **Proxy:** set `MONITORING_API_URL=http://127.0.0.1:8923`, run `npm run dev`, then
   `curl 'http://localhost:4321/api/monitoring/alerts?protocol=aave&limit=5'` — expect JSON with
   CORS + non-`no-store` cache headers; confirm disallowed params are rejected.
3. **List page:** load `/monitoring`, confirm cards with `apiProtocol` show a last-alert badge and
   that protocols without one (e.g. Silo) degrade gracefully.
4. **Detail page:** load `/monitoring/aave`, confirm static header renders and alert history
   populates; check empty state on a protocol with no alerts.
5. **Build:** `npm run build` succeeds and generates a static page per protocol id.
6. **Format:** repo formatting passes before merge.
