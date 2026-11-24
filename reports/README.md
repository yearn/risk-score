# Protocol & Asset Risk Reports

This directory contains Yearn's risk assessment framework for evaluating protocols and assets before integration with Yearn vaults.

## Framework Purpose

The risk framework provides a structured approach to evaluating the safety and reliability of DeFi protocols and assets. It covers technical, operational, and organizational risks that could impact user funds.

**All assessments—protocols, assets, tokens—use the same template and scoring methodology.**

## File Structure

```
reports/
├── TEMPLATE.md           # Risk assessment template (includes scoring rubrics)
├── README.md             # This file
├── reassessment.json     # External dependencies eligible for scheduled reassessment
├── report/               # All risk assessments
│   ├── reserve-ethplus.md      # Example: ETH+ asset
│   ├── origin-arm.md           # Example: Origin ARM protocol
│   ├── infinifi.md             # Example: InfiniFi protocol
│   └── ...
├── graph/                # Dependency graph YAML, one per report slug
└── scripts/              # Report-specific data-fetching scripts
```

Authoring procedures: [shared agent skills](../AGENTS.md#shared-skills-and-commands).

## Scheduled Reassessment

The weekly [reassessment workflow](../.github/workflows/reassessment-scan.yml)
automatically includes every `report/yearn-*.md` asset report and the external
dependency slugs in [reassessment.json](reassessment.json). Include external
protocols/assets used by Yearn, including collateral, infrastructure with a
documented integration, and approved integrations that are currently unfunded.
A requested or completed assessment alone does not qualify an external report.

The scanner keeps its existing 60-day threshold, assessment-date parsing, terminal
status exclusions, and open-issue deduplication. Reports outside this scope remain
available on the website but do not generate scheduled reassessment issues. The
list itself is used only by automation and is not rendered on the website.

To change external eligibility, add or remove a report slug (the filename under
`report/` without `.md`). Keep entries sorted and unique; do not list `yearn-*`
reports, which are discovered automatically. Invalid slugs, duplicates, unsorted
entries, and malformed lists fail before GitHub operations. An empty array leaves
only Yearn asset reports eligible.

CI validates the list whenever reports are added, renamed, removed, or edited,
as well as when the list itself changes. A missing or unreadable report at runtime
is logged as an error; the scanner processes the remaining reports and returns a
failure status afterward. Live scans flag open reassessment issues whose slugs
have left the scope for manual review and closure.

The scope is based on existing assessments and confirmed Yearn integration context:

- The `yearn-*` reports cover Yearn's own assessed vaults and are discovered automatically.
- `3jane-usd3`, `cap-stcusd`, and `sky-usds` are funded dependencies in
  [yvUSD](report/yearn-yvusd.md#strategy-protocol-dependencies-with-existing-reports).
  Cap and Sky also appear in [yvUSDC-1](report/yearn-yvusdc.md).
- `infinifi`, `maple-syrupusdc`, and `origin-ousd` are approved but unfunded
  integrations in [yvUSD](report/yearn-yvusd.md#active-but-unfunded-10-all-at-0-debt).
- `flex` covers the [Flex allocator and lending markets](report/flex.md) used by Yearn.
- `paxos-usdg` covers [USDG](report/paxos-usdg.md), used by Yearn on Robinhood Chain
  as confirmed in the scope request.

Maintain this list when Yearn integrations are added or removed, including uses
outside the currently assessed vaults. External eligibility is maintained manually;
it is not live exposure discovery. Revoked integrations and historical incident
references alone do not qualify. Preview eligible stale reports locally:

```bash
DRY_RUN=true uv run scripts/check_stale_reports.py
```

Dry runs make no GitHub calls and require no `gh` authentication. They do not check
existing issues, so the preview can include reports that already have open issues.
Report-specific time-based and event-based review recommendations still apply
outside the scheduled scope; they do not imply automatic GitHub issue creation.

## Scoring

[TEMPLATE.md](TEMPLATE.md) is self-contained: copy it to `reports/report/<slug>.md`,
check the critical gates first, then score each category with its embedded rubric.

| Category | Weight | What it evaluates |
|----------|--------|-------------------|
| Audits & Historical Track Record | 20% | Security posture, code quality, past performance |
| Centralization & Control Risks | 30% | Governance, programmability, external dependencies |
| Funds Management | 30% | Collateralization, provability, asset control |
| Liquidity Risk | 15% | Exit mechanisms and market depth |
| Operational Risk | 5% | Team, documentation, and processes |

Each category receives a score from 1-5 (1 = safest, 5 = highest risk), which are then weighted to produce a final risk score and tier classification.

Governance is scored on the weakest permission path to a material loss: a loss
of the collateral or main asset users deposited. An EOA may hold a pause-only
role without triggering the critical gate; an EOA that can move deposits or set
loss-causing parameters such as slippage, allowlists, oracles, or fees triggers
it. Rubric changes apply to an existing report at its next reassessment, and a
score change caused only by a rubric change is noted in its Assessment History.

### Key Principles

- **Evidence-Based**: Link to contracts, transactions, and documentation
- **Transparent**: Document both strengths and weaknesses
- **Actionable**: Focus on risks that can be monitored or mitigated
- **Living Document**: Update report as protocols evolve

## Risk Assessment Philosophy

### What We Look For

**Technical Safety**
- Audited and battle-tested code
- Onchain verifiability of reserves
- Programmatic operations (minimal admin intervention)
- Robust liquidation and peg stability mechanisms

**Organizational Maturity**
- Transparent team and operations
- Strong documentation and communication
- Proven incident response capabilities

**Systemic Resilience**
- Limited dependencies on external protocols
- Adequate liquidity for user exits
- Decentralized governance with appropriate safeguards
- Monitoring and alerting systems in place

### Red Flags

- Unverified contract source (bytecode cannot be independently reviewed)
- Unaudited or poorly audited code
- Unlimited admin powers without timelocks
- Opaque reserves or offchain dependencies
- History of incidents with poor response
- Insufficient liquidity for expected TVL
- Single points of failure in critical infrastructure

## Related Resources

- [Yearn Monitoring Scripts](https://github.com/yearn/monitoring)
- [Safe Multisig Monitoring](https://github.com/yearn/monitoring/blob/main/protocols/safe/main.py)
- [Job Definitions](https://github.com/yearn/monitoring/blob/main/automation/jobs.yaml)
