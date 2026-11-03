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
├── reassessment.json     # Report slugs eligible for scheduled reassessment
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

[reassessment.json](reassessment.json) is the explicit list of report slugs scanned
by the weekly [reassessment workflow](../.github/workflows/reassessment-scan.yml).
Include Yearn assets and protocols/assets used by Yearn, including collateral,
infrastructure, and approved integrations that are currently unfunded. A completed
risk assessment alone does not qualify a report for this list.

The scanner keeps its existing 60-day threshold, assessment-date parsing, terminal
status exclusions, and open-issue deduplication. Reports outside the list remain
available on the website but do not generate scheduled reassessment issues. The
list itself is used only by automation and is not rendered on the website.

To change eligibility, add or remove a report slug (the filename under `report/`
without `.md`). Keep entries sorted and unique. Missing files, invalid slugs, and
duplicates fail the scan before any issues are created. An empty array disables
issue creation without changing the workflow schedule.

The initial list is seeded from the existing Yearn assessment snapshots:

- All seven `yearn-*` reports cover Yearn's own assessed vaults.
- `3jane-usd3`, `cap-stcusd`, and `sky-usds` are funded dependencies in
  [yvUSD](report/yearn-yvusd.md#strategy-protocol-dependencies-with-existing-reports).
  Cap and Sky also appear in [yvUSDC-1](report/yearn-yvusdc.md).
- `infinifi`, `maple-syrupusdc`, and `origin-ousd` are approved but unfunded
  integrations in [yvUSD](report/yearn-yvusd.md#active-but-unfunded-10-all-at-0-debt).
- `spectra-finance` is listed as a PT infrastructure dependency in
  [yvUSD](report/yearn-yvusd.md#strategy-protocol-dependencies-with-existing-reports).

Maintain this list when Yearn integrations are added or removed, including uses
outside these seven vaults. This is a manually maintained scope, not live exposure
discovery. Revoked integrations and historical incident references alone do not
qualify. Preview the scan without creating issues:

```bash
DRY_RUN=true uv run scripts/check_stale_reports.py
```

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
