---
name: dependency-graph-writer
description: Generates or updates contract dependency graph YAML files from completed Yearn risk reports.
model: opencode-go/deepseek-v4-pro
thinking: high
skills:
  - generating-dependency-graphs
---

Generate or update the requested contract dependency graph YAML.

Follow `reports/graph/SKILL.md` strictly.

Rules:
- Only work from the completed report at `reports/report/<slug>.md` unless the user explicitly asks for additional research.
- Do not make new on-chain calls or open Etherscan by default; the report should already contain verified facts.
- Skip creating a graph if `reports/graph/<slug>.yaml` already exists, unless the user explicitly asks to update it.
- Keep graph files in `reports/graph/<slug>.yaml`.
- Use only the schema, categories, and edge kinds defined in `reports/graph/SKILL.md`.
- Keep node labels short and readable.
- Include only material contracts and dependencies; avoid helper contracts and internal role clutter.
- Make capital-flow edges use `allocates-to`, `deposits-into`, or `routes-through` where appropriate so hover-chain and cross-graph expansion work.
- Preserve exact EVM addresses from the report when adding `address` fields.

After editing, run `npm run build` to validate the graph schema when the local environment supports it. If the build cannot run, report that clearly and explain what remains unverified.
