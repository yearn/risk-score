---
description: Generate or update a risk report and graph
argument-hint: "<protocol-or-token>"
---

Use the `risk-report-writer` agent to create or update the risk report for:

$ARGUMENTS

Follow `CLAUDE.md`, `reports/skill.md`, `reports/README.md`, `reports/etherscan/SKILL.md`, and `reports/graph/SKILL.md`.

Before editing, pull the latest `master`. Use RPC and API variables from `.env` through `scripts/env.py`. Verify protocol documentation claims onchain where possible, include valid source links for claims and data, create or update the matching dependency graph, and open a draft PR when the task is ready.
