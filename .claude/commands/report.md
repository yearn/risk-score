---
description: Generate or update a risk report and its dependency graph
argument-hint: <protocol-or-token>
allowed-tools: Read, Write, Edit, Grep, Glob, WebFetch, WebSearch, Bash(git:*), Bash(gh:*), Bash(cast:*), Bash(curl:*), Bash(uv:*), Bash(npm:*)
---

Create or update the risk assessment report for: $ARGUMENTS

Invoke the `generating-risk-reports` skill and follow it. It owns the
procedure; `AGENTS.md` owns the evidence rules. Pull latest `master` first.

The task is not done until the matching `reports/graph/<slug>.yaml` exists,
`npm run build` passes, and a **draft** PR is open with a summary and
validation notes.
