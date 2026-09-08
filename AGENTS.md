# Yearn Curation Score — Agent Guide

An Astro site publishing risk assessments in `reports/report/`. Site code is
in `src/`; validators and onchain/API tooling are in `scripts/`.

## Shared skills and commands

Canonical skills live in `.agents/skills/`. Codex discovers them there;
`.claude/skills` links to that directory, and `.pi/settings.json` loads it.
`CLAUDE.md` links to this guide. Edit canonical files, not separate adapter copies.

| Task | Skill | Claude / pi command |
|------|-------|---------------------|
| New or substantially updated report | [generating-risk-reports](.agents/skills/generating-risk-reports/SKILL.md) | `/report <target>` |
| Focused refresh | [reassessing-risk-reports](.agents/skills/reassessing-risk-reports/SKILL.md) | `/reassess <slug>` |
| Review a report | [reviewing-risk-reports](.agents/skills/reviewing-risk-reports/SKILL.md) | `/review-report <slug>` |
| Dependency graph | [generating-dependency-graphs](.agents/skills/generating-dependency-graphs/SKILL.md) | `/graph <slug>` |
| Onchain verification | [verifying-onchain-data](.agents/skills/verifying-onchain-data/SKILL.md) | — |
| Bridge dependencies | [assessing-bridge-dependencies](.agents/skills/assessing-bridge-dependencies/SKILL.md) | — |

In Codex, use `$<skill-name> <target>`; in pi, `/skill:<skill-name> <target>`
also works. Claude commands and pi prompts link to the same files in
`.agents/commands/`. No agent extension is required.

Markdown links resolve relative to their containing file. Backtick paths and
shell commands are relative to the repository root; run commands there.

## Evidence

- Never guess unavailable facts. Mark them `TODO` with the missing source or getter.
- Use protocol docs to map intended architecture; verify mutable contract facts onchain.
- Link material claims, including TVL and allocation data, to their evidence.
  Link every truncated address, transaction, or market identifier to its full
  value on the correct explorer. This includes bridge-index `detail` strings.
- Trace indirect loss paths: minting, upgrades, role escalation, oracle control,
  custody, redemption gates, fees, migrations, and dependency failures.

## Report and graph authoring workflow

- Start from current `origin/master`, preserving any work already in progress.
- Read an existing report end-to-end before editing it. Keep report work within
  `reports/`, plus `src/data/bridges.json` for bridge dependency changes.
- A new report needs `reports/graph/<slug>.yaml`; updates must keep companion
  artifacts consistent. If required graph facts are unavailable, identify the
  missing inputs as `TODO` and explain the limitation.
- Run the [validation](#validation) appropriate to the changed files. When the
  requested authoring task is ready, open a draft PR with a concise summary,
  validation results, and unresolved facts. Review-only tasks return findings.

## Validation

Node ≥22.12 is required. The build validates reports, graph schema, and bridge data.

```bash
npm run build       # update_stats → check_bridges → check_graphs → astro build
npm test            # run after code, validator, or agent-configuration changes
npm run check-graphs    # strict graph warnings
npm run check-bridges   # strict bridge-mention coverage
uv run scripts/check_defillama_links.py <files>
```

Resolve warnings introduced by the change; report unrelated existing failures
without expanding the task. For Python changes, run the relevant checks and
`uv run -m ruff format <files>`. If validation cannot run, state what remains unverified.

Optional behavioral checks: [manual smoke cases](tests/skill_scenarios.md).

## Environment

Use Foundry `cast` for onchain reads. Configuration may come from the process
environment or `.env`; never print or commit RPC credentials or API keys.
For Ethereum, use `RPC_1` then `RPC_2`; other chains use `RPC_<chain_id>`.
Python entrypoints use [scripts/env.py](scripts/env.py): `load_repo_env()`,
then `get_rpc_url(chain_id)` / `get_explorer_api_key(name)` for aliases and discovery.

Missing `.env` is not a blocker if the required configuration is already
available. If credentials or RPC access needed for a check are unavailable,
mark that check unverified and report the blocker; continue independent work.
Batch and cache RPC calls to conserve quota.
