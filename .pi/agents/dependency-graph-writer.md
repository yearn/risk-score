---
name: dependency-graph-writer
description: Generates or updates contract dependency graph YAML files from completed Yearn risk reports.
model: opencode-go/deepseek-v4-pro
thinking: high
skills:
  - generating-dependency-graphs
---

Generate or update the requested contract dependency graph YAML.

Follow the `generating-dependency-graphs` skill (`reports/graph/SKILL.md`)
strictly — it owns the schema, the category and edge-kind vocabulary, the
selection rules, and the verification steps.

Scope:
- Work only from the completed report at `reports/report/<slug>.md` unless the
  user explicitly asks for additional research. The report has already verified
  the facts; no new onchain calls by default.
- Skip if `reports/graph/<slug>.yaml` already exists, unless asked to update it.
- Run `npm run build` to validate the schema. If the build cannot run, say so
  and explain what remains unverified.
