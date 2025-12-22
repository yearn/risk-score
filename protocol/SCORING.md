# Risk Scoring Methodology

This document defines the scoring methodology for protocol risk assessments using the Yearn Risk Framework.

## Scoring Approach: Critical Gates + Weighted Score

**Score Scale:** 1-5 (1 = safest, 5 = highest risk)

### Step 1: Critical Risk Gates

Before calculating a detailed score, check if the protocol meets any critical failure criteria. If ANY gate is triggered, the protocol automatically receives a score of **5** (High Risk) and is not recommended for integration.

**Critical Gates (Auto-fail to score 5 if ANY true):**

- [ ] **No audit** - Protocol has not been audited by reputable firms
- [ ] **Unverifiable reserves** - For collateralized protocols, reserves cannot be verified on-chain or through transparent attestation
- [ ] **Total centralization (single EOA admin)** - Protocol is controlled by a single externally owned account (EOA) admin with no multisig or governance

**If ALL gates pass:** Proceed to Step 2 for detailed scoring.

---

### Step 2: Category Scoring

Score each risk category on a 1-5 scale using the rubrics below.

## Category 1: Audits & Historical Track Record (Weight: 20%)

Evaluates security posture and battle-testing over time.

| Score | Audits | Time in Production | Incident History |
|-------|--------|-------------------|------------------|
| **1** | 3+ audits by top firms, active bug bounty >$1M | >2 years, TVL >$100M | No incidents |
| **2** | 2+ audits by reputable firms, bug bounty >$500K | 1-2 years, TVL >$50M | Minor incidents with excellent response |
| **3** | 1 audit by reputable firm, bug bounty present | 6-12 months, TVL >$10M | Past incident with good response |
| **4** | 1 audit by lesser-known firm or dated audit | 3-6 months, TVL <$10M | Past incident with mediocre response |
| **5** | No audit or failed audit (CRITICAL GATE) | <3 months or no meaningful TVL | Major exploit with poor response (CRITICAL GATE) |

**Scoring Guidance:**
- High bug bounty (>$5M) can reduce score by 0.5
- Code complexity should be considered: simple protocols score better
- Contract upgrades should be re-audited

---

## Category 2: Centralization & Control Risks (Weight: 30%)

Evaluates governance, programmability, and external dependencies. **Highest weighted category.**

### Subcategory A: Governance

| Score | Contract Upgradeability | Timelock | Privileged Roles |
|-------|------------------------|----------|-----------------|
| **1** | Immutable or fully decentralized DAO | N/A or >7 days | No privileged roles or require multi-party approval |
| **2** | Multisig 7/11+ with timelock | 48+ hours | Limited roles (pause only), cannot seize funds |
| **3** | Multisig 5/9 with timelock | 24-48 hours | Some powerful roles but constrained by timelock |
| **4** | Multisig 3/5 or low threshold | <24 hours | Powerful admin roles with limited constraints |
| **5** | EOA or <3 signers (CRITICAL GATE) | No timelock | Unlimited admin powers (CRITICAL GATE) |

### Subcategory B: Programmability

| Score | System Operations | PPS/Rate Definition | Oracle Control |
|-------|------------------|--------------------|--------------------|
| **1** | Fully programmatic (e.g., Liquity, Uniswap) | Calculated on-chain algorithmically | Decentralized oracle network, immutable |
| **2** | Mostly programmatic with minor admin input | On-chain calculation with some parameters | Decentralized oracle, governance can change |
| **3** | Hybrid on-chain/off-chain operations | On-chain but reliant on admin updates | Centralized oracle with governance control |
| **4** | Significant manual intervention required | Off-chain accounting with periodic reporting | Single oracle source, upgradeable |
| **5** | Fully custodial/centralized operations | Admin-controlled rate with no transparency | No oracle or completely manipulable |

### Subcategory C: External Dependencies

| Score | Protocol Dependencies | Criticality | Fallback Mechanisms |
|-------|----------------------|-------------|---------------------|
| **1** | No external dependencies | N/A | N/A |
| **2** | 1-2 dependencies on blue-chip protocols | Non-critical or can operate degraded | Multiple fallbacks, graceful degradation |
| **3** | 2-3 dependencies on established protocols | Some critical functions depend on them | Fallback available but complex |
| **4** | Many dependencies or deps on newer protocols | Critical functionality depends on them | Limited or no fallbacks |
| **5** | Single point of failure dependency | Failure breaks entire protocol | No fallback mechanism |

**Centralization Category Score = (Governance + Programmability + Dependencies) / 3**

---

## Category 3: Funds Management (Weight: 30%)

Evaluates how funds are managed, collateralization, and verifiability. **Highest weight (tied with Centralization)** - if reserves don't exist or can't be verified, nothing else matters.

### Subcategory: Collateralization

| Score | Backing | Collateral Quality | Verifiability |
|-------|---------|-------------------|---------------|
| **1** | 100%+ on-chain, over-collateralized | Blue-chip assets (ETH, WBTC, stablecoins) | Real-time on-chain verification |
| **2** | 100% on-chain collateral | High-quality DeFi assets (LSTs, major DEX LPs) | On-chain verification with some complexity |
| **3** | 100% collateral with some off-chain | Mixed quality assets or newer protocols | Periodic attestation from custodian |
| **4** | Partially collateralized or custodial | Lower-quality or illiquid assets | Opaque or infrequent reporting |
| **5** | Uncollateralized or unverifiable (CRITICAL GATE) | Unknown or very high-risk assets | No verification possible |

### Subcategory: Provability

| Score | Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|-------|---------------------|--------------------|-----------------------|
| **1** | Fully on-chain, anyone can verify | Programmatic, real-time | Multiple verification sources (Chainlink PoR, etc.) |
| **2** | Mostly on-chain, some off-chain components | On-chain with periodic updates | Single reliable verification source |
| **3** | Hybrid on-chain/off-chain reserves | Manual reporting by admins | Attestation by known custodian |
| **4** | Primarily off-chain reserves | Infrequent reporting | Self-reported, no third party |
| **5** | Opaque reserves, cannot verify | No reporting or unreliable | No verification |

**Funds Management Score = (Collateralization + Provability) / 2**

---

## Category 4: Liquidity Risk (Weight: 15%)

Evaluates ability for users to exit positions without significant loss.

| Score | Exit Mechanism | Liquidity Depth | Large Holder Impact |
|-------|---------------|----------------|---------------------|
| **1** | Direct 1:1 redemption, instant | Deep liquidity (>$10M), <0.5% slippage | Can exit fully with <2% impact |
| **2** | Direct redemption with minor delays | Good liquidity (>$5M), <1% slippage | Can exit with <5% impact over 1-2 days |
| **3** | Market-based redemption or short queues | Moderate liquidity (>$1M), 1-3% slippage | Requires 3-7 days for full exit |
| **4** | Withdrawal queues or significant restrictions | Limited liquidity (<$1M), >3% slippage | Requires >1 week or >10% impact |
| **5** | No clear exit mechanism or frozen | No liquidity or cannot exit | Cannot exit without massive losses |

**Adjustments:**
- Historical stress performance: -0.5 if maintained liquidity during major drawdowns
- Throttle mechanisms that significantly delay large exits: +0.5

---

## Category 5: Operational Risk (Weight: 5%)

Evaluates team, documentation, and organizational factors. **Lowest weight** - important for long-term sustainability but less critical to immediate fund safety than technical and collateralization factors.

| Score | Team Transparency | Documentation | Development Activity | Legal/Compliance |
|-------|------------------|---------------|---------------------|-----------------|
| **1** | Fully doxxed, established reputation | Excellent, comprehensive | Very active, regular updates | Clear legal structure, compliant |
| **2** | Mostly public team or known anons | Good, mostly complete | Active development | Established entity, some clarity |
| **3** | Mixed doxxed/anon team | Adequate, some gaps | Moderate activity | Uncertain structure |
| **4** | Mostly anon team, limited info | Poor or outdated docs | Slow or irregular updates | No clear legal entity |
| **5** | Fully anon, no reputation | No documentation | Inactive, abandoned | No legal structure, regulatory risk |

---

## Step 3: Calculate Weighted Final Score

**Category Weights:**
- Centralization & Control: **30%** (governance, programmability, dependencies)
- Funds Management: **30%** (collateralization, provability)
- Audits + Historical: **20%** (security track record)
- Liquidity: **15%** (exit mechanisms)
- Operational: **5%** (team, docs, communication)

**Rationale:** Centralization and Funds Management are equally critical - together they account for **60% of the total score**. If reserves don't exist or governance is compromised, all other factors are irrelevant.

**Formula:**
```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

**Round to one decimal place.**

---

## Step 4: Apply Modifiers (Optional)

### Time Decay Bonus (Reduces Risk Over Time)
- Protocol live >2 years with no incidents: **-0.5** to final score
- TVL maintained >$100M for >1 year: **-0.5** to final score
- Maximum combined bonus: **-1.0**

### Incident Penalty (Increases Risk After Problems)
- Major exploit <6 months ago: **+1.0** to final score
- Poor incident response history: **+0.5** to final score
- Unresolved security issues: **+0.5** to final score

**Final Score (with modifiers) capped at 1.0 minimum and 5.0 maximum.**

---

## Risk Tier Classification

Map final score to risk tier:

| Final Score | Risk Tier | Description | Recommendation |
|------------|-----------|-------------|----------------|
| **1.0-1.5** | **Minimal Risk** | Blue chip protocols with proven track record | ✅ Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Established protocols with strong fundamentals | ✅ Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Acceptable risk with active monitoring required | ⚠️ Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Significant concerns, limited exposure | ⚠️ Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Critical issues or too early/untested | ❌ Not recommended |

---

## Scoring Example: ETH+ (Reserve Protocol)

See [reserve-ethplus.md](assessments/reserve-ethplus.md) for complete worked example.

**Summary:**
- Critical Gates: ✅ All passed
- Audits & Historical: 1.5
- Centralization: 2.5
- Funds Management: 1.5
- Liquidity: 2.0
- Operational: 1.5

**Final Score:** 1.9 → **Low Risk** tier

---

## Scoring Best Practices

1. **Be Conservative**: When uncertain between two scores, choose the higher (more risky) score
2. **Document Reasoning**: Explain why each score was assigned
3. **Update Regularly**: Reassess when protocols change significantly
4. **Compare Peers**: Look at similar protocols for consistency
5. **Use Ranges**: If a subcategory falls between scores, use decimals (e.g., 2.5)
6. **Weight Evidence**: Priority should be given to on-chain data over documentation claims

---

## Review and Appeals

All risk scores should be:
1. Peer-reviewed by at least one other team member
2. Updated quarterly or when material changes occur
3. Open to challenge with new evidence
4. Documented with clear reasoning for each category

For questions about scoring methodology, contact the Yearn risk team.
