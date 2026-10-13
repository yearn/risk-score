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
├── report/               # All risk assessments
│   ├── reserve-ethplus.md      # Example: ETH+ asset
│   ├── origin-arm.md           # Example: Origin ARM protocol
│   ├── infinifi.md             # Example: InfiniFi protocol
│   └── ...
├── graph/                # Dependency graph YAML, one per report slug
└── scripts/              # Report-specific data-fetching scripts
```

Authoring procedures: [shared agent skills](../AGENTS.md#shared-skills-and-commands).

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
