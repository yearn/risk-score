---
description: Review a risk report for correctness and evidence quality
argument-hint: <report-path-or-slug>
allowed-tools: Read, Grep, Glob, WebFetch, WebSearch, Bash(git:*), Bash(gh:*), Bash(cast:*), Bash(curl:*), Bash(uv:*)
---

Review the risk report: $ARGUMENTS

Invoke the `reviewing-risk-reports` skill and follow it.

Return findings first, ordered by severity, separating confirmed errors from
things you could not verify. Do not rewrite the report unless I explicitly ask
you to apply corrections.
