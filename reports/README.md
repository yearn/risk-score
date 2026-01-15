# Protocol & Asset Risk Reports

This directory contains Yearn's risk assessment framework for evaluating protocols and assets before integration with Yearn vaults.

## Framework Purpose

The risk framework provides a structured approach to evaluating the safety and reliability of DeFi protocols and assets. It covers technical, operational, and organizational risks that could impact user funds.

**All assessments—protocols, assets, tokens—use the same template and scoring methodology.**

## File Structure

```
reports/
├── TEMPLATE.md           # Risk assessment template
├── SCORING.md            # Quantitative scoring methodology
├── README.md             # This file
├── report/               # All risk assessments
│   ├── reserve-ethplus.md      # Example: ETH+ asset
│   ├── origin-arm.md           # Example: Origin ARM protocol
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
   - Provide evidence and links for claims
   - Be specific with addresses, transaction hashes, and dates
   - Flag unknowns or areas requiring further investigation

3. **Calculate Risk Score**
   - Use the scoring methodology defined in `SCORING.md`
   - Follow the step-by-step calculation process
   - Document reasoning for each category score

4. **Set Up Monitoring**
   - Follow the Monitoring section to set up alerts
   - Add addresses to monitoring scripts
   - Create protocol-specific Telegram group
   - Define monitoring frequency (hourly/daily)

5. **Review and Update**
   - Have another team member review the assessment
   - Update when protocol parameters change
   - Reassess after incidents or major upgrades

### Assessment Categories

1. **Audits & Historical Track Record** - Security posture, code quality, and past performance (Weight: 20%)
2. **Centralization & Control Risks** - Governance, programmability, and external dependencies (Weight: 30%)
3. **Funds Management** - Collateralization, provability, and asset control (Weight: 30%)
4. **Liquidity Risk** - Exit mechanisms and market depth (Weight: 15%)
5. **Operational Risk** - Team, documentation, and processes (Weight: 5%)

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
