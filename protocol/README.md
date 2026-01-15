# Protocol Risk Framework

This directory contains Yearn's protocol risk assessment framework and individual protocol evaluations.

## Framework Purpose

The protocol risk framework provides a structured approach to evaluating the safety and reliability of DeFi protocols before integration with Yearn vaults. It covers technical, operational, and organizational risks that could impact user funds.

## File Structure

```
protocol/
├── TEMPLATE.md           # Risk assessment template
├── README.md             # This file
├── report/               # Individual protocol risk reports
│   ├── protocol-name.md
│   └── ...
└── old/                  # Legacy protocol documentation
```

## How to Use This Framework

### Conducting a New Assessment

1. **Copy the Template**
   ```bash
   cp protocol/TEMPLATE.md protocol/report/[protocol-name].md
   ```

2. **Fill Out Each Section**
   - Work through each category systematically
   - Provide evidence and links for claims
   - Be specific with addresses, transaction hashes, and dates
   - Flag unknowns or areas requiring further investigation

3. **Set Up Monitoring**
   - Follow the Monitoring section to set up alerts
   - Add addresses to monitoring scripts
   - Create protocol-specific Telegram group
   - Define monitoring frequency (hourly/daily)

4. **Review and Update**
   - Have another team member review the assessment
   - Update when protocol parameters change
   - Reassess after incidents or major upgrades

### Assessment Categories

The framework evaluates protocols across these dimensions:

1. **Audits & Bug Bounties** - Security posture and code quality
2. **Historical Track Record** - Past performance and incident handling
3. **Funds Management** - How assets are controlled and deployed
4. **Dependency Risk** - External protocol and infrastructure dependencies
5. **Liquidity Risk** - Exit mechanisms and market depth
6. **Centralization & Control** - Governance and admin powers
7. **Operational Risk** - Team, documentation, and processes
8. **Monitoring** - Ongoing surveillance requirements

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

## Contributing

When adding or updating protocol report:

1. Use the TEMPLATE.md as your starting point
2. Be thorough but concise
3. Cite sources and link to evidence
4. Mark sections as "TODO" if information is unavailable
5. Get peer review before finalizing
6. Update the monitoring section with actual implementation

## Related Resources

- [Yearn Monitoring Scripts](https://github.com/yearn/monitoring-scripts-py)
- [Safe Multisig Monitoring](https://github.com/yearn/monitoring-scripts-py/blob/main/safe/main.py)
- [Workflow Definitions](https://github.com/yearn/monitoring-scripts-py/tree/main/.github/workflows)

## Questions?

For questions about the framework or specific report, reach out to the Yearn risk team on Discord or open an issue.
