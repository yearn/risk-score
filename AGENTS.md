# Yearn Curation Score — Agent Guide

An Astro site publishing risk assessments in `reports/report/`. Site code is
in `src/`; validators and onchain/API tooling are in `scripts/`.

## Shared skills and commands

Edit canonical skills in `.agents/skills/` and commands in `.agents/commands/`;
Claude and pi share them. `CLAUDE.md` links to this guide.

| Task | Skill | Claude / pi command |
|------|-------|---------------------|
| New or substantially updated report | [generating-risk-reports](.agents/skills/generating-risk-reports/SKILL.md) | `/report <target>` |
| Focused refresh | [reassessing-risk-reports](.agents/skills/reassessing-risk-reports/SKILL.md) | `/reassess <slug>` |
| Review a report | [reviewing-risk-reports](.agents/skills/reviewing-risk-reports/SKILL.md) | `/review-report <slug>` |
| Dependency graph | [generating-dependency-graphs](.agents/skills/generating-dependency-graphs/SKILL.md) | `/graph <slug>` |
| Onchain verification | [verifying-onchain-data](.agents/skills/verifying-onchain-data/SKILL.md) | — |
| Bridge dependencies | [assessing-bridge-dependencies](.agents/skills/assessing-bridge-dependencies/SKILL.md) | — |

Codex: `$<skill-name> <target>`. Pi also supports `/skill:<skill-name> <target>`.

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

- Before report work, fetch `origin`. Create a new branch from `origin/master`,
  or merge `origin/master` into the existing report branch, including in worktrees.
  Preserve uncommitted work and resolve merge conflicts before editing the report.
- Read an existing report end-to-end before editing it. Keep report work within
  `reports/`, plus `src/data/bridges.json` for bridge dependency changes.
- New reports require `reports/graph/<slug>.yaml`; keep companion artifacts consistent.
- Run the [validation](#validation) appropriate to the changed files. When the
  requested authoring task is ready, open a draft PR with a concise summary,
  validation results, and unresolved facts. Review-only tasks return findings.

## Validation

Node ≥22.12 is required. The build validates reports, graph schema, and bridge data.
Run relevant checks for changed or reviewed artifacts.

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

For tasks requiring RPC or explorer access, load the repository-root `.env`
at task start; [.env.example](.env.example) documents the variables.
Use [scripts/env.py](scripts/env.py): `load_repo_env()`, then
`get_rpc_url(chain_id)` / `get_explorer_api_key("etherscan")` for configured
values and aliases, including `ETHERSCAN_TOKEN`. Preserve existing environment
values; in worktrees, load `.env` from the original checkout if needed.

If required RPC or Etherscan/explorer access is missing or unusable, **stop
immediately**, ask the user to configure or restore it in `.env`, and wait.
Never fall back to public RPCs or continue the assessment with unverified claims.
Never print or commit secrets; report missing variable names only.

Use Foundry `cast` for onchain reads. Pass resolved configuration to subprocesses;
loading `.env` in one process does not configure another. Batch and cache RPC calls.
