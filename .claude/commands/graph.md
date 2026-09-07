---
description: Generate or update a dependency graph from a finished report
argument-hint: <report-path-or-slug>
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(git:*), Bash(gh:*), Bash(npm:*)
---

Create or update the contract dependency graph for: $ARGUMENTS

Invoke the `generating-dependency-graphs` skill and follow it. Work from the
completed report unless asked for additional research — it has already verified
the facts, so no new onchain calls by default.

Validate with `npm run build` and open a **draft** PR when ready.
