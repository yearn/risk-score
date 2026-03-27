# Protocol Risk Assessment: [Protocol Name]

- **Assessment Date:** [Date]
- **Token:** [Token Name]
- **Chain:** [Chain Name]
- **Token Address:** [`[Token Address]`]([Token Explorer Link])
- **Final Score: X/5.0**

## Overview + Links

Explain what the protocol does, its usage, and yield sources.

**Links:**

- [Protocol Documentation](URL)
- [Protocol Dashboard/App](URL)
- [GitHub Repository](URL)
- [Security/Audits Page](URL)
- [Third-Party Analysis](URL) - LlamaRisk, etc.

## Audits and Due Diligence Disclosures

- List all audits with firm names, dates, and links to reports
- How complex is the onchain smart contract architecture?
- Are there any unresolved findings from audits?

### Bug Bounty `[If Applicable]`

- Bug bounty program link, platform (Immunefi, Code4rena, HackerOne, Sherlock, Cantina), and maximum payout
- Check if the protocol is using Safe Harbor build by SEAL team. Try using [website](https://safeharbor.securityalliance.org/) to check if the protocol is using it.

## Historical Track Record

- How long has the protocol been in production?
- Past security incidents or exploits? How were they handled?
- TVL history, stability, and volatility patterns
- Any concentration risk from large depositors?
- Any historical peg deviations or depegging events?

## Funds Management

- Is the protocol delegating funds to other protocol/s? If so, which ones?
- How will we monitor changes in funds delegation?

### Accessibility `[If Applicable]`

- Who can mint/redeem the token? Anyone or whitelisted addresses?
- Is minting/redeeming atomic in a single transaction?
- Are there fees, rate limits, or cooldown periods?

### Collateralization

- Is it collateralized onchain?
- What is the collateral quality? Which assets are accepted?
- What are the over-collateralization and maintenance ratios?
- Are liquidations onchain? What peg stability mechanisms exist?
- If funds are controlled by an EOA, multisig, or custodian, are the possible actions on those funds explicitly disclosed?
- What are the reserves used for? What risk level are the strategies?
- Does the system require risk curation (e.g., max mintable caps, liquidation thresholds)? If yes, who manages it?

### Provability

- How easy is it to prove that reserves exist where documentation claims?
- If yield-bearing, how is the yield calculated? onchain or off-chain? Can anyone compute it?
- How does onchain reporting work? Is the exchange rate computed programmatically or updated by a privileged role?
- If collateral is off-chain, how transparent is the team? How frequently are reserves verified?
- Are there third-party verification mechanisms? (Chainlink PoR, Merkle proofs, custodian attestations)
- Can minting be done without backing assets?
- Can admin mint tokens out of thin air? List all accounts with minting role.

## Liquidity Risk

- What is the exit liquidity for the token?
- onchain liquidity depth across DEXes
- Slippage analysis for different redemption sizes
- Redemption mechanism: Direct (1:1 with collateral) vs market-based?
- Are there withdrawal queues or delays? If so, how do they work? (ordering, processing, yield during queue)
- Historical liquidity during market stress periods
- Can large holders exit without significant price impact?

## Centralization & Control Risks

### Governance

- Are the contracts upgradable? Define the owner, multisig, or timelock.
- Multisig threshold (N/M)? Timelock delay? Who are the signers (known entities, anon)? Don't validate onchain multisig signers, just check docs.
- Are there privileged roles capable of causing serious harm to token holders?
- Can governance pause, freeze, or seize user funds?

### Programmability

- How programmatic is the system? How much is handled by smart contracts vs manual intervention?
- If the protocol relies on vaults, how is PPS (price per share) defined? onchain or off-chain accounting?
- Are there off-chain dependencies for critical functions? (keepers, relayers, backends)

### External Dependencies

- What external protocols does this depend on?
- How critical are these dependencies? Would failure break core functionality?
- What oracle systems are used? Multiple sources or single point of failure? Is the oracle upgradeable?
- Are there fallback mechanisms if dependencies fail?
- Cross-chain or centralized infrastructure dependencies?

## Operational Risk

- Team transparency: public, known anons, or unknown? Reputation and track record?
- Documentation quality: complete, maintained, and clear?
- Legal structure: DAO, foundation, company? Jurisdiction?
- Incident response: documented plan? Previously tested?

## Monitoring

List key contracts and events to monitor. At minimum, cover governance changes and backing ratio.

- Key contract addresses to monitor, always define which addresses should be monitored.
- Critical values or events to watch like parameter changes, governance actions, redeption liquidity, collateral allocation.
- If protocol is using trenches or some kind of loss coverage define which contracts should be monitored to track the coverage ratio.
- Define which functions can be used to get specific data.
- If data can't be fetched on-chain then fallback to using off-chain data.
- Try to define threshold values.
- Recommended monitoring frequency, hourly, daily, weekly, etc.

## Risk Summary

### Key Strengths

- (3-5 bullet points summarizing the strongest aspects)

### Key Risks

- (3-5 bullet points summarizing the most significant concerns)

### Critical Risks `[If Any]`

- (Issues that could lead to loss of funds or protocol failure)

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

If ANY gate is triggered, the protocol automatically receives a score of **5** (High Risk).

- [ ] **No audit** - Protocol has not been audited by reputable firms
- [ ] **Unverifiable reserves** - Reserves cannot be verified onchain or through transparent attestation
- [ ] **Total centralization** - Controlled by a single EOA with no multisig or governance

**If ALL gates pass**, proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

| Score | Audit coverage | Bug bounty |
|-------|-----------------|------------|
| **1** | 3+ audits by top firms | Active, max payout >$1M |
| **2** | 2+ audits by reputable firms | Max payout >$200K |
| **3** | 1 audit by reputable firm | Bounty program present |
| **4** | 1 audit by lesser-known firm or dated | Minimal or no bounty |
| **5** | No audit (CRITICAL GATE) | — |

- Simple contract surface scores better than highly complex ones

**Subcategory B: Historical Track Record**

| Score | Time in production | Scale (TVL) |
|-------|-------------------|-------------|
| **1** | >2 years | Sustained >$100M |
| **2** | 1–2 years | >$50M |
| **3** | 6–12 months | >$10M |
| **4** | 3–6 months | <$10M |
| **5** | <3 months | No meaningful TVL |

**Audits & Historical Score = (Audits + Historical) / 2**

**Score: X/5** - [Justification]

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Score | Contract Upgradeability | Timelock | Privileged Roles |
|-------|------------------------|----------|-----------------|
| **1** | Immutable or fully decentralized DAO | N/A or >3 days | No privileged roles or multi-party approval |
| **2** | Multisig 7/11+ with timelock | 24+ hours | Limited roles, cannot seize funds |
| **3** | Multisig 5/9 with timelock | 24+ hours | Some powerful roles, constrained by timelock |
| **4** | Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints |
| **5** | EOA or <3 signers (CRITICAL GATE) | No timelock | Unlimited admin powers |

**Subcategory B: Programmability**

| Score | System Operations | PPS/Rate Definition |
|-------|------------------|---------------------|
| **1** | Fully programmatic | Calculated onchain algorithmically |
| **2** | Mostly programmatic with minor admin input | onchain with some parameters |
| **3** | Hybrid onchain/off-chain operations | onchain but reliant on admin updates |
| **4** | Significant manual intervention required | Off-chain accounting with periodic reporting |
| **5** | Fully custodial/centralized operations | Admin-controlled rate, no transparency |

**Subcategory C: External Dependencies**

| Score | Protocol Dependencies | Criticality |
|-------|----------------------|-------------|
| **1** | No external dependencies | N/A |
| **2** | 1-2 blue-chip dependencies | Non-critical |
| **3** | 2-3 established protocol dependencies | Some critical functions depend on them |
| **4** | Many or newer protocol dependencies | Critical functionality depends on them |
| **5** | Single point of failure dependency | Failure breaks entire protocol |

**Centralization Score = (Governance + Programmability + Dependencies) / 3**

**Score: X/5** - [Justification]

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Score | Backing | Collateral Quality | Verifiability |
|-------|---------|-------------------|---------------|
| **1** | 100%+ onchain, over-collateralized | Blue-chip assets (ETH, WBTC, stablecoins) | Real-time onchain verification |
| **2** | 100% onchain collateral | High-quality DeFi assets (LSTs, major LPs) | onchain with some complexity |
| **3** | 100% collateral, some off-chain | Mixed quality or newer protocols | Periodic custodian attestation |
| **4** | Partially collateralized or custodial | Lower-quality or illiquid assets | Opaque or infrequent reporting |
| **5** | Uncollateralized or unverifiable (CRITICAL GATE) | Unknown or very high-risk assets | No verification possible |

**Subcategory B: Provability**

| Score | Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|-------|---------------------|--------------------|-----------------------|
| **1** | Fully onchain, anyone can verify | Programmatic, real-time | Multiple verification sources |
| **2** | Mostly onchain, some off-chain | onchain with periodic updates | Single reliable source |
| **3** | Hybrid onchain/off-chain | Manual reporting by admins | Known custodian attestation |
| **4** | Primarily off-chain | Infrequent reporting | Self-reported only |
| **5** | Opaque, cannot verify | No reporting | No verification |

**Funds Management Score = (Collateralization + Provability) / 2**

**Score: X/5** - [Justification]

#### Category 4: Liquidity Risk (Weight: 15%)

| Score | Exit Mechanism | Liquidity Depth | Large Holder Impact |
|-------|---------------|----------------|---------------------|
| **1** | Direct 1:1 redemption, instant | >$10M, <0.5% slippage | Full exit with <0.5% impact |
| **2** | Direct redemption with minor delays | >$5M, <1% slippage | Exit with <1% impact over 1-3 days |
| **3** | Market-based or short queues | >$1M, 1-3% slippage | 3-7 days for full exit |
| **4** | Withdrawal queues or restrictions | <$1M, >3% slippage | >1 week or >10% impact |
| **5** | No clear exit mechanism | No liquidity | Cannot exit without massive losses |

- Maintained liquidity during major drawdowns: -0.5
- Throttle mechanisms delaying large exits: +0.5
- Same-value assets can accept higher exit times

**Score: X/5** - [Justification]

#### Category 5: Operational Risk (Weight: 5%)

| Score | Team Transparency | Documentation | Legal/Compliance |
|-------|------------------|---------------|-----------------|
| **1** | Fully doxxed or well-known, established reputation | Excellent, comprehensive | Clear legal structure |
| **2** | Mostly public or known anons | Good, mostly complete | Established entity |
| **3** | Mixed unknown and known anons | Adequate, some gaps | Uncertain structure |
| **4** | Mostly unknown, limited info | Poor or outdated | No clear legal entity |
| **5** | Fully unknown, no reputation | No documentation | No legal structure |

**Score: X/5** - [Justification]

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | X | 20% | X |
| Centralization & Control | X | 30% | X |
| Funds Management | X | 30% | X |
| Liquidity Risk | X | 15% | X |
| Operational Risk | X | 5% | X |
| **Final Score** | | | **X/5.0** |

**Optional Modifiers:**
- Protocol live >2 years with no incidents: **-0.5**
- TVL maintained >$500M for >1 year: **-0.5**
- Final score capped at 1.0 minimum and 5.0 maximum

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: [TIER]**

---

## Reassessment Triggers `[If Applicable]`

- **Time-based**: Reassess in [X months]
- **TVL-based**: Reassess if TVL changes by more than [X%]
- **Incident-based**: Reassess after any exploit, governance change, or collateral modification
