---
name: reassessing-risk-reports
description: Focused procedure for refreshing existing risk reports by validating mutable onchain roles, proxy implementations, TVL, strategy allocations, and other current-state data without rewriting the full assessment.
---

# Reassessing risk reports

Refresh an existing `reports/report/<slug>.md` in place. Use the
[agent guide](../../../AGENTS.md) for shared evidence, environment, and workflow.
Re-derive static background or scores only when verified changes justify it.

## Check current state

Read the report end-to-end and extract its mutable claims and reassessment
triggers. Verify:

- Privileged roles and holders, timelock delays, proxy implementations/admins,
  and mint-authority paths with [onchain verification](../verifying-onchain-data/SKILL.md).
- Multisig changes using the [governance standard](../verifying-onchain-data/references/governance.md).
- TVL and trend: `uv run reports/scripts/fetch_defillama_tvl.py <slug> --days 30`.
- Strategy/farm/collateral allocations and report-specific monitoring values:
  deposit/debt limits, redemption liquidity, queues, and active/queued strategies.
  Prefer onchain getters documented in the report. For ERC-4626 dependencies,
  use asset/share conversions; for Yearn V3, check debt and debt limits as well
  as `totalAssets()`. Recompute allocation percentages and identify dust,
  revoked, matured, or disabled positions.

If allocations, dependencies, governance, proxies, or mint authority changed,
update the [graph](../generating-dependency-graphs/SKILL.md). Create a missing
graph when sufficient report evidence exists. For added, removed, or changed
cross-chain exposure, use the [bridge skill](../assessing-bridge-dependencies/SKILL.md)
to keep the index consistent.

## Editing

- Preserve the report's structure and update affected sections in place.
  State current facts without “previously,” “now X (was Y),” `(NEW)`, or
  `(unchanged)` annotations. Do not add a reassessment-notes/changelog section
  or narrate verification in the body; snapshot provenance belongs in the header.
- Keep the original assessment date and one latest update date:
  `- **Assessment Date:** May 27, 2026 (Updated: June 17, 2026)`.
  Never overwrite the original date or stack update dates; the site reads both.
- Follow the [template's Assessment History](../../../reports/TEMPLATE.md#assessment-history):
  one row per PR, Date linked to that PR, with `Date | Score | Notes` columns.
  Update an existing row for this PR; otherwise append one. Seed the original
  assessment if history is absent. Match the header date and final score/status.
- Use compact contract tables. Audit entries need firm/date/scope; bug bounty
  coverage needs the highest reward. Omit implementation trivia unless material.
- Keep incidents, depegs, and large historical TVL changes as dated facts in
  Historical Track Record, not comparisons with the previous assessment.
- Change scores only under the [scoring framework](../../../reports/README.md).
  Update dependent summaries, final tier, concentration discussion, and
  graph-related appendices when their supporting facts change.

Finish through the [authoring workflow](../../../AGENTS.md#report-and-graph-authoring-workflow).
In the task/PR summary, give the snapshot date, changed facts, graph status,
unchanged critical controls, score changes, and remaining unverified facts.
