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
└── old/                  # Legacy documentation (deprecated format)
```

## How to Use This Framework

### Conducting a New Assessment

1. **Copy the Template**
   ```bash
   cp reports/TEMPLATE.md reports/report/[name].md
   ```

2. **Fill Out Each Section**
   - Work through each category systematically
   - Provide evidence and links for claims (Etherscan links, documentation)
   - Be specific with addresses, transaction hashes, and dates
   - Sections marked `[Required]` must be completed; `[If Applicable]` sections can be skipped
   - Flag unknowns as TODO rather than assuming

3. **Calculate Risk Score**
   - The scoring rubrics are embedded in the template itself
   - Check critical gates first (auto-fail criteria)
   - Score each category, then compute the weighted final score
   - Document reasoning for each category score

4. **Review and Update**
   - Have another team member review the assessment
   - Update when protocol parameters change
   - Reassess based on triggers defined in the report

### Template Structure

The template is self-contained with embedded scoring rubrics. Reports follow this structure:

1. **Analysis Sections** - Investigation and evidence gathering
   - Overview, Audits, Historical Track Record, Funds Management, Liquidity Risk, Centralization & Control, Operational Risk, Monitoring
2. **Risk Summary** - Synthesis of key strengths, risks, and critical concerns
3. **Risk Score Assessment** - Critical gates check, category scoring (1-5 scale), weighted final score, and risk tier classification
4. **Reassessment Triggers** - Conditions that warrant re-evaluation

### Scoring Categories

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
- On-chain verifiability of reserves
- Programmatic operations (minimal admin intervention)
- Robust liquidation and peg stability mechanisms

**Organizational Maturity**
- Transparent team and operations
- Strong documentation and communication
- Proven incident response capabilities
- Active development and maintenance

**Systemic Resilience**
- Limited dependencies on external protocols
- Adequate liquidity for user exits
- Decentralized governance with appropriate safeguards
- Monitoring and alerting systems in place

### Red Flags

- Unaudited or poorly audited code
- Unlimited admin powers without timelocks
- Opaque reserves or off-chain dependencies
- History of incidents with poor response
- Insufficient liquidity for expected TVL
- Single points of failure in critical infrastructure

## Migration from Legacy Format

Previously, protocols and assets were documented separately with different formats. The new framework provides:
- Unified assessment methodology
- Quantitative risk scoring (1-5 scale)
- Weighted category scoring
- Standardized monitoring requirements

**Legacy documents are in `reports/old/` for reference only. Do not use them as templates.**

## Related Resources

- [Yearn Monitoring Scripts](https://github.com/yearn/monitoring-scripts-py)
- [Safe Multisig Monitoring](https://github.com/yearn/monitoring-scripts-py/blob/main/safe/main.py)
- [Workflow Definitions](https://github.com/yearn/monitoring-scripts-py/tree/main/.github/workflows)
