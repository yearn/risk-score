---
description: Refresh an existing risk report's current-state facts
argument-hint: <report-path-or-slug>
allowed-tools: Read, Write, Edit, Grep, Glob, WebFetch, Bash(git:*), Bash(gh:*), Bash(cast:*), Bash(curl:*), Bash(uv:*), Bash(npm:*)
---

Reassess the existing risk report: $ARGUMENTS

Invoke the `reassessing-risk-reports` skill and follow it. This is a focused
refresh, not a rewrite — patch affected sections in place, and do not narrate
the refresh in the report body. Pull latest `master` first.

Check the dependency graph and regenerate it if allocations, dependencies,
governance, proxy, or mint-authority facts changed. Run `npm run build`, then
open a **draft** PR.
