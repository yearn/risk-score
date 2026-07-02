# Protocol Risk Assessment: [Protocol Name]

- **Assessment Date:** [Month Day, Year]
- **Token:** [Token Name]
- **Chain:** [Chain Name]
- **Token Address:** [`[Token Address]`]([Token Explorer Link])
- **Final Score: X/5.0**
<!-- Status: omit this line entirely for normal/active reports. See the Status comment below. -->

<!--
Status field (optional — omit for active reports):
  Add a "- **Status:** <TAG>" line only when a report is an exception. The
  taxonomy is:
    - GATED   — score is retained but was capped by a critical gate (e.g. no
                audit) rather than earned organically. Keep the numeric
                "Final Score: X/5.0"; the site shows it with an amber GATED chip.
    - HACKED  — confirmed exploit / unbacked mint / realized loss event.
    - DEAD    — deprecated, wind-down, or discretionary-only redemption.
  HACKED and DEAD are "terminal": a realized event supersedes a forward-looking
  score, so set the header to "- **Final Score: N/A**" (the site renders these
  off the 1–5 scale under a separate "Not Rated" section). Retain the gate/
  override derivation in the Risk Score Assessment section for the record.

Assessment Date format:
  - Use full English month name and four-digit year, e.g. "March 4, 2026".
  - When a report is reassessed, append the new date in parentheses on the
    same line, e.g.
        **Assessment Date:** February 8, 2026 (Updated: March 22, 2026)
    or, when reassessing in response to an event:
        **Assessment Date:** April 27, 2026 (reassessment after April 18, 2026 exploit)
  - The reassessment-scan workflow parses every "Month Day, Year" date on this
    line and uses the latest one to decide whether the report is stale, so the
    appended date keeps the staleness clock honest.
-->


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

### Token Mint Authority

Enumerate every address that can mint the assessed token, and the mechanism that gates them. Treat any address with mint authority as part of the trust surface even if it is intended only for a narrow purpose. Onchain enumeration procedure: see `reports/skill.md` § "Pass 1.6: Mint authority enumeration".

**Mint mechanism:** [Open mint via collateral deposit / Role-gated AccessControl / Whitelist mapping / Ownable / Custodial bridge / Other — describe]

**Mint requires backing:** [Yes — collateral must transfer in same tx / No — minter can issue unbacked tokens]

**Per-address mint authority** (verified onchain on [date], from token contract `0x…`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x…`](etherscan link) | ✓ | ✓ | `MINTER_ROLE` | Multisig, 3/5, named signers |
| [`0x…`](etherscan link) | ✓ | — | `mintList` entry | Bridge contract (e.g. Wormhole NTT) |

**Rate limits / supply caps:** [None / Max mint per block of X / Global supply cap of Y / Per-minter caps — describe]

**Backing check at mint time:** [Atomic — minter must deposit collateral in same tx / Deferred — backing settled offchain / None — minter can issue unbacked tokens]

See `reports/report/mezo-musd.md` for a worked example.

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
- If yield-bearing, how is the yield calculated? onchain or offchain? Can anyone compute it?
- How does onchain reporting work? Is the exchange rate computed programmatically or updated by a privileged role?
- If collateral is offchain, how transparent is the team? How frequently are reserves verified?
- Are there third-party verification mechanisms? (Chainlink PoR, Merkle proofs, custodian attestations)

(Mint-authority enumeration and unbacked-mint risk are captured in the *Token Mint Authority* subsection above.)

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
- If the protocol relies on vaults, how is PPS (price per share) defined? onchain or offchain accounting?
- Are there offchain dependencies for critical functions? (keepers, relayers, backends)

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
- If data can't be fetched onchain then fallback to using offchain data.
- Try to define threshold values.
- Recommended monitoring frequency, hourly, daily, weekly, etc.

## Appendix: Contract Architecture

Include an ASCII or text-based diagram showing the contract dependency graph. Group contracts by layer:

1. **Vault / Token Layer** — the assessed token contract, strategies, proxy admins
2. **Protocol Layer** — core protocol contracts (factories, kernels, markets, tranching)
3. **Underlying Layer** — external protocols, yield sources, oracles
4. **Governance** — multisigs, timelocks, access managers

Show the data/fund flow between layers. Note key admin powers and trust boundaries. This diagram should be created during the pre-assessment architecture mapping phase (see `skill.md`).

```
[Replace with actual architecture diagram]
```

---

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

- [ ] **Unverified contract source** - The assessed contract, or its implementation behind a proxy, is not source-verified on a public block explorer (bytecode cannot be independently reviewed)
- [ ] **No audit** - Protocol has not been audited by reputable firms
- [ ] **Unverifiable reserves** - Reserves cannot be verified onchain or through transparent attestation
- [ ] **Total centralization** - Controlled by a single EOA with no multisig or governance

**If ALL gates pass**, proceed to category scoring.

> **A triggered gate is not the same as a realized loss.** A gate on an
> otherwise-live protocol caps the score at 5.0 — set `Status: GATED` in the
> header and keep the number so it stays comparable on the scale. Reserve
> `N/A` / the "Not Rated" bucket for **terminal** states (`HACKED` / `DEAD`),
> where an actual exploit or wind-down has occurred. Do not let a gate flatten
> a distinguishable, still-live protocol into the same cell as a corpse — record
> the ungated weighted score in the reasoning so the underlying risk stays
> visible.

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
| **1** | Immutable or fully decentralized DAO | 7+ days timelock on critical operations | Multisig above 3/5 threshold, no EOA roles. Multi-party approval required |
| **2** | Multisig 7/11+ with timelock | 24+ hours | Limited roles, cannot seize funds |
| **3** | Multisig 5/9 with timelock | 24+ hours | Some powerful roles, constrained by timelock |
| **4** | Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints |
| **5** | EOA or <3 signers (CRITICAL GATE) | No timelock | Unlimited admin powers |

**Subcategory B: Programmability**

| Score | System Operations | PPS/Rate Definition |
|-------|------------------|---------------------|
| **1** | Fully programmatic | Calculated onchain algorithmically |
| **2** | Mostly programmatic with minor admin input | onchain with some parameters |
| **3** | Hybrid onchain/offchain operations | onchain but reliant on admin updates |
| **4** | Significant manual intervention required | Offchain accounting with periodic reporting |
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
| **3** | 100% collateral, some offchain | Mixed quality or newer protocols | Periodic custodian attestation |
| **4** | Partially collateralized or custodial | Lower-quality or illiquid assets | Opaque or infrequent reporting |
| **5** | Uncollateralized or unverifiable (CRITICAL GATE) | Unknown or very high-risk assets | No verification possible |

**Subcategory B: Provability**

| Score | Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|-------|---------------------|--------------------|-----------------------|
| **1** | Fully onchain, anyone can verify | Programmatic, real-time | Multiple verification sources |
| **2** | Mostly onchain, some offchain | onchain with periodic updates | Single reliable source |
| **3** | Hybrid onchain/offchain | Manual reporting by admins | Known custodian attestation |
| **4** | Primarily offchain | Infrequent reporting | Self-reported only |
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
| **N/A** | **Not Rated** | Terminal — do not use (exploited or wound down) |

**Final Risk Tier: [TIER]**

<!--
Not Rated: for terminal reports (Status: HACKED / DEAD), set Final Score to
"N/A" and Final Risk Tier to "Not Rated". These are excluded from the numeric
1–5 ranking and grouped separately on the site.
-->



---

## Reassessment Triggers `[If Applicable]`

- **Time-based**: Reassess in [X months]
- **TVL-based**: Reassess if TVL changes by more than [X%]
- **Incident-based**: Reassess after any exploit, governance change, or collateral modification
