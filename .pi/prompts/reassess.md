---
description: Reassess an existing risk report
argument-hint: "<report-path-or-slug>"
---

Use the `risk-report-reassessor` agent to reassess:

$ARGUMENTS

Before editing, pull the latest `master`. Use RPC and API variables from `.env` through `scripts/env.py`. Refresh privileged roles, proxy implementations, TVL, allocations, reassessment triggers, and other current-state data. Check the dependency graph and regenerate it if allocations, dependencies, governance, proxy, or mint-authority facts changed. Open a draft PR when the task is ready.
