---
name: reviewing-risk-reports
description: Procedure for reviewing an existing Yearn risk report for factual correctness, evidence quality, unsupported claims, scoring consistency, and missing monitoring detail.
---

# Reviewing risk reports

Review `reports/report/<slug>.md`. Return findings; edit only if the user asks
for corrections. Follow [AGENTS.md](../../../AGENTS.md).

## Check

- Unsupported, stale, contradictory, or inaccessible evidence; incorrect
  identifiers and missing `TODO` markers. Apply the report skill's
  [negative-claim checklist](../generating-risk-reports/SKILL.md#negative-claims-and-liquidity)
  before accepting assertions that functionality or liquidity does not exist.
- Mutable onchain facts: roles, proxy/admin addresses, parameters, supply and
  backing. Use [onchain verification](../verifying-onchain-data/SKILL.md) for
  disputed claims and [supply reconciliation](../generating-risk-reports/SKILL.md#investigation)
  when assessing backing completeness.
- Governance characterization and reassessment continuity under the
  [multisig standard](../verifying-onchain-data/references/governance.md).
- Required sections, critical gates, exception status, category scores, weighted
  total, and tier against the [template](../../../reports/TEMPLATE.md) and
  [scoring framework](../../../reports/README.md).
- Concrete monitoring addresses, getters, thresholds, and observable triggers.
- Companion graph consistency with contracts, allocations, and mint authority;
  bridge-index completeness using the [bridge skill](../assessing-bridge-dependencies/SKILL.md).

## Output

Findings first, ordered by severity. Each needs file/section, the claim at issue,
evidence, and a concrete correction. Separate confirmed errors from facts you
could not verify. If no findings are established, say so and state verification
limits.
