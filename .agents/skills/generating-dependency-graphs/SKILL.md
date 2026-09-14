---
name: generating-dependency-graphs
description: Generate or update contract dependency graph YAML from a completed risk report.
---

# Generating contract dependency graphs

Produce `reports/graph/<slug>.yaml` from a completed
`reports/report/<slug>.md`. Follow [AGENTS.md](../../../AGENTS.md).
Skip an existing graph unless requested or changed report facts require an update.

Work from the report's verified facts. Make new onchain calls only when the user
requests additional research; identify missing report evidence explicitly.

## Authoring

1. Read the report's contract inventory, governance, allocations, dependencies,
   and architecture appendix.
2. Read the [schema and vocabulary](references/schema.md) before writing YAML.
   Use existing enums; the validator in [graph.ts](../../../src/lib/graph.ts)
   is authoritative.
3. Select material nodes:
   - User-facing tokens, governance Safes/timelocks, and access-control roots.
   - Every privileged minter, even if otherwise small or peripheral.
   - Strategies with roughly ≥1% of TVL/debt, their underlying dependencies,
     and queued strategies explicitly identified as material.
   - Omit dust/inactive farms and helper contracts unless they affect risk.
     Group contracts representing one dependency with an explanatory `note`.
     Avoid drawing every internal role when a representative control edge and
     the report's role table convey it accurately; retain material authorities.
4. Draw governance, mint authority, allocations, and external dependencies.
   Choose edges by the relationship they represent. Use the report's percentages
   or amounts for allocation labels and actual role names for authority labels.
5. Check each address and chain against the report. A dependency matching an
   addressed `vault` node in another graph links and expands automatically;
   don't copy its downstream nodes. Reserve `vault` for user-facing tokens so
   shared infrastructure doesn't become an ambiguous graph anchor.
6. For actual Morpho vault nodes, read [Morpho expansion](references/morpho.md)
   before setting `morphoVault` or updating generated market sections.

## Verification

When browser access is available, inspect `/graph/<slug>/` for readable layout, allocation
labels, control paths, and detail links; confirm `/report/<slug>/` links to it.
Report any visual checks that could not run.
