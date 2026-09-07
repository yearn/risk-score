# Yearn Curation Score — Agent Guide

Canonical guidance for every coding agent working in this repo. Tool-specific
config (`.claude/`, `.pi/`) is a thin adapter over this file and the skills in
`reports/`; it must point here, never restate the rules.

`CLAUDE.md` is a symlink to this file.

## What this repo is

An Astro site that publishes Yearn's protocol/asset risk assessments. The
markdown reports in `reports/report/` are the product; the TypeScript/Astro code
in `src/` renders them, and the Python/Node scripts in `scripts/` verify them.

```
reports/report/<slug>.md      46 risk assessments (the product)
reports/graph/<slug>.yaml     contract dependency graphs, rendered at /graph/<slug>/
reports/TEMPLATE.md           report template with embedded scoring rubrics
reports/*/SKILL.md            authoring skills (see below)
src/                          Astro 7 site, cytoscape graph rendering
scripts/                      build-time validators + onchain/API tooling
src/data/bridges.json         cross-chain bridge dependency index
```

## Skills

Task-specific procedures live in `reports/`. Load the one matching the task
instead of working from this file alone.

| Skill | File | Use for |
|-------|------|---------|
| `generating-risk-reports` | `reports/SKILL.md` | New or substantially updated risk reports |
| `reassessing-risk-reports` | `reports/reassessment/SKILL.md` | Focused refresh of an existing report |
| `reviewing-risk-reports` | `reports/review/SKILL.md` | Reviewing a report for correctness and evidence quality |
| `generating-dependency-graphs` | `reports/graph/SKILL.md` | Authoring `reports/graph/<slug>.yaml` |
| `verifying-onchain-data` | `reports/onchain/SKILL.md` | Role/permission and mint-authority enumeration |
| `assessing-bridge-dependencies` | `reports/bridges/SKILL.md` | Tokens or protocols with a cross-chain dependency |

Skill names are registered for Claude Code in `.claude/skills/` and for Pi in
`.pi/settings.json`; both point at the files above, which are the single source
of truth.

## Validation

Everything is gated by the Node build. Run it before opening a PR:

```bash
npm run build      # update_stats → check_bridges → check_graphs → astro build
npm test           # node --test tests/*.test.mjs
```

Requires Node ≥ 22.12 (Astro 7). The build **fails** on a bad graph edge
endpoint, an unknown graph category or edge kind, a graph with no addressed
`vault` anchor, or a `bridges.json` dependency whose slug has no report.

Stricter variants surface warnings the build tolerates:

```bash
npm run check-graphs     # --strict: unlabelled authority edges, orphan nodes, duplicate addresses
npm run check-bridges    # --strict: reports that mention a bridge but aren't listed as depending on it
```

Python tooling:

```bash
uv run scripts/check_defillama_links.py <files>   # verify DefiLlama slugs in reports
uv run scripts/check_stale_reports.py             # flag reports due for reassessment
uv run -m ruff format .                           # format
```

## Evidence rules

These apply to every report, graph, and data file. They are the reason this
repo exists; nothing else here overrides them.

- **Never assume.** If a fact cannot be established, write `TODO` and say which
  source or function is missing. Do not guess, and do not soften a gap into a
  confident sentence.
- **Documentation is a map, not evidence.** Use protocol docs to understand
  intended architecture, then verify onchain. Docs are routinely stale or
  describe a superseded design.
- **Back every material claim with a working link** — contracts, transactions,
  governance records, dashboards, API output. TVL and allocation figures need
  source links too.
- **Never quote a truncated identifier without linking the full one.** A bare
  `` `0xABCD…EF12` `` is unverifiable. Write
  `` [`0xABCD…EF12`](https://etherscan.io/address/0x<full address>) `` so the
  display stays compact and the full address is one click away. Same for tx
  hashes, pool ids, and market ids, in reports and in `src/data/bridges.json`
  `detail` strings (which render as markdown for exactly this reason).
- **Hunt for indirect loss paths**, not just documented happy paths: privileged
  minting, upgradeable implementations, proxy admins, oracle control, role
  escalation, pause/blacklist paths, redemption gates, offchain custody, fee
  switches, strategy migration, and dependency failure modes. Anything that can
  move, dilute, freeze, trap, or misprice user funds counts, whether or not the
  docs frame it as a risk.

## Workflow

- Pull latest `master` before starting a report, graph, or reassessment.
- Keep report work scoped to `reports/` (plus `src/data/bridges.json` when a
  bridge dependency changes) unless asked otherwise.
- Read the existing report end-to-end before editing it.
- Every new report needs a matching graph at `reports/graph/<slug>.yaml`.
- Open a **draft** PR with a concise summary and validation notes when ready.

## Environment

`.env` holds RPC URLs and API keys and is never committed.

- **Onchain reads:** Foundry `cast`. RPC URLs come from `.env` — `RPC_1` first
  for Ethereum mainnet with `RPC_2` as fallback; for other chains use
  `RPC_<chain_id>` (e.g. `RPC_8453` for Base).
- **Python scripts:** use `scripts/env.py` — call `load_repo_env()` once at the
  entrypoint, then `get_rpc_url(chain_id)` / `get_explorer_api_key(name)`. Do
  not reimplement `.env` discovery or env-var alias lists.
- If `.env` is unreachable, stop and report the blocker rather than proceeding
  with unverified data.

Batch and cache blockchain calls; these scripts run in CI on a schedule and
RPC quota is finite.

## Reference sources

- [DeFiLlama](https://defillama.com) — TVL (`uv run reports/scripts/fetch_defillama_tvl.py <slug>`)
- [L2BEAT](https://l2beat.com/scaling/risk) — L2 and bridge risk
- [LlamaRisk](https://www.llamarisk.com/research) — protocol and asset risk research
- [Steakhouse](https://kitchen.steakhouse.financial/archive) — asset reports
- [DefiScan](https://www.defiscan.info/) — decentralization staging
