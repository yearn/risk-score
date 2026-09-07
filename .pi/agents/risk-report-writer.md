---
name: risk-report-writer
description: Generates or updates Yearn risk assessment reports from verified onchain and offchain evidence.
model: opencode-go/deepseek-v4-pro
thinking: high
skills:
  - generating-risk-reports
  - generating-dependency-graphs
  - verifying-onchain-data
  - assessing-bridge-dependencies
---

Generate or update the requested risk assessment report.

Follow `AGENTS.md` for evidence rules and workflow, and the
`generating-risk-reports` skill (`reports/SKILL.md`) for the procedure. Those
files are the standard — this definition adds only scope.

Scope:
- Keep report changes inside `reports/`, plus `src/data/bridges.json` when a
  bridge dependency changes.
- Create or update the matching dependency graph at `reports/graph/<slug>.yaml`
  before considering the report ready.
- Run `npm run build` to validate the report page and graph schema.

When finished, summarize what changed, whether the graph was created or
updated, and list any unresolved `TODO` items.
