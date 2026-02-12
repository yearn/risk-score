# Protocol Risk Assessment: StakedHYPE stHYPE (via Hyperliquid Stake Marketplace)

**Assessment Date:** February 12, 2026
**Token:** stHYPE
**Chain:** HyperEVM (Hyperliquid L1 ecosystem)
**Primary Docs:** https://docs.stakedhype.fi/technical/hyperliquid-stake-marketplace-hsm

## Overview + Links

StakedHYPE issues `stHYPE`, a liquid staking token representing HYPE staked into Hyperliquid validators through Hyperliquid Stake Marketplace (HSM). Conceptually it is similar to stETH: users deposit native HYPE, receive an LST (`stHYPE`), and accumulate staking rewards in token exchange rate terms.

The architecture has two layers:

1. **LST layer (StakedHYPE)**
- User-facing mint/redeem flow for stHYPE.
- Maintains a withdrawal queue and reserve buffer.

2. **Validator staking layer (HSM)**
- HYPE is delegated into Hyperliquid validators via HSM infra.
- Uses HSM voting and delegation controls to distribute stake and manage exits.

**Links:**

- [StakedHYPE docs](https://docs.stakedhype.fi/)
- [HSM technical page](https://docs.stakedhype.fi/technical/hyperliquid-stake-marketplace-hsm)
- [StakedHYPE architecture](https://docs.stakedhype.fi/technical/stakedhype)
- [stHYPE unstaking](https://docs.stakedhype.fi/technical/sthype-unstaking)
- [stHYPE risk section](https://docs.stakedhype.fi/technical/sthype-risks)
- [StakedHYPE security page](https://docs.stakedhype.fi/technical/security)
- [StakedHYPE governance page](https://docs.stakedhype.fi/governance)
- [Hyperliquid staking docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking)
- [Hyperliquid validator docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking/validators)

## How Hyperliquid Staking Works (Context)

Hyperliquid’s staking model is validator-based and epoch-driven.

- Users stake HYPE and delegate to validators.
- Rewards accrue through validator performance and protocol emissions/fees.
- Validator set and stake movement are constrained by protocol rules (epoch timing and activation/deactivation semantics).
- Hyperliquid docs describe validator/L1 operational risks; this is the core external risk inherited by any HYPE liquid staking protocol.

### Slashing in Hyperliquid (Important for stHYPE)

As of **February 12, 2026**, Hyperliquid docs state that core HYPE staking currently has:

- **No automatic validator slashing mechanism** in live staking.
- **Jailing** as the immediate validator penalty path for uptime/behavior issues.
- A note that governance may introduce explicit validator slashing in the future.

Practical interpretation for stHYPE:
- **Today:** direct stake haircut from automatic validator slashing is low-probability because that mechanism is not yet active in base staking.
- **Still material risk:** validator jailing, poor validator performance, or chain-level instability can still reduce effective yield and delay exits.
- **Future risk step-up:** if governance enables validator slashing later, stHYPE loss profile can change meaningfully and requires immediate reassessment.

Historical status:
- No official Hyperliquid documentation found describing a past **validator slashing event** in HYPE staking as of February 12, 2026.
- This is an inference from official docs and release/risk pages; absence of a documented event is not proof of impossibility.

For stHYPE specifically, staking operations route through HSM abstractions and StakedHYPE’s queue/buffer logic, which adds additional smart-contract and operational layers on top of base protocol staking.

## Audits and Due Diligence Disclosures

StakedHYPE publicly lists 4 audits on its security page:

| # | Date | Firm | Scope | Link |
|---|---|---|---|---|
| 1 | Dec 2024 | Pashov Audit Group | StakedHYPE contracts | [Report](https://github.com/ValantisLabs/audits/blob/main/staked_hype/pashov_dec_2024.pdf) |
| 2 | Feb 2025 | Three Sigma | StakedHYPE contracts | [Security page](https://docs.stakedhype.fi/technical/security) |
| 3 | Mar 2025 | Pashov Audit Group | StakedHYPE updates | [Report](https://github.com/ValantisLabs/audits/blob/main/staked_hype/pashov_mar_2025.pdf) |
| 4 | Nov 2025 | Guardian Audits | StakedHYPE updates | [Security page](https://docs.stakedhype.fi/technical/security) |

Additional disclosures:
- HSM docs state code and technical docs are expected to be published in GitHub once finalized, indicating parts of stack/process may still be maturing.
- No public formal verification disclosure was identified.

### Bug Bounty

No Immunefi/Sherlock/Cantina bug bounty link was identified in docs.

Disclosed security contact:
- security@stakedhype.fi

Assessment note:
- Responsible disclosure channel exists, but absence of a public bounty with payout tiers weakens external adversarial testing incentives relative to peers.

## Historical Track Record

- StakedHYPE documentation indicates active production operation with stHYPE issuance and unstaking mechanisms live.
- No major publicly disclosed exploit was identified in StakedHYPE docs at assessment time.
- Track record is materially shorter and less battle-tested than older LSTs like stETH.

## Funds Management

### Strategy and delegation model

stHYPE deposits are managed via HSM-integrated staking operations:

- User deposits -> mint stHYPE.
- Capital is distributed across validator/delegation pathways using HSM.
- A reserve buffer is kept to improve withdrawal responsiveness.
- Redemptions rely on reserve and, when needed, unstake/rebalance processes.

### Accessibility

- stHYPE minting is permissionless at user level through protocol interface.
- Unstaking uses a queue-based process and does not guarantee instant 1:1 native withdrawal.
- Queue and buffer mechanics are key liquidity controls and must be actively monitored.

### Collateralization

- Economic backing is staked HYPE plus liquid reserves.
- Backing quality is primarily dependent on Hyperliquid validator set quality and slashing/operational outcomes.
- This is not off-chain custodial collateral; risk is on-chain protocol + validator behavior.

### Provability

- Core staking and token accounting are on-chain by design.
- However, full real-time risk transparency (validator concentration, queue stress, reserve ratio) depends on dashboard quality and published contract interfaces.
- HSM docs mention staged publication/finalization, so transparency posture should be considered improving but not fully mature.

## Liquidity Risk

stHYPE exit risk is higher than a pure wrapper token:

- There is an unstaking queue design (not instant native redemption in all conditions).
- Docs disclose a reserve buffer plus a `maxUnstakeBuffer` and up to a 90-day liquidation/wind-down horizon in extreme stress conditions.
- Secondary market liquidity depth for stHYPE may vary materially by venue and market regime.

Practical implications:
- In normal conditions, reserves/queue may support predictable withdrawals.
- In stress conditions, exits can be delayed and/or become more market-impact sensitive.

## Centralization & Control Risks

### Governance

StakedHYPE docs describe governance and role model with meaningful privileged controls (parameter tuning, queue controls, operational policy). The governance page also states governance implementation is planned via SAFE multisig and potentially future token-governance structures.

Risk implications:
- Governance appears operationally centralized in current phase compared to fully decentralized LST governance.
- Governance and parameter controls need explicit monitor coverage for role changes and critical parameter updates.

### Programmability

- Hybrid system: smart-contract based staking + operational policy layer for delegation, reserves, and queue management.
- More complex than simple wrappers (WHYPE/WETH).
- Potential sensitivity to off-chain operator execution quality and policy correctness.

### External Dependencies

Critical dependencies include:
1. Hyperliquid L1 consensus/liveness.
2. Hyperliquid validator performance and staking/slashing rules.
3. HSM mechanism assumptions and stake-market behavior.
4. DEX liquidity conditions for stHYPE/HYPE exits.

Dependency concentration on Hyperliquid ecosystem is structurally high.

## Operational Risk

- Docs quality is good and technically detailed.
- Security page and audit disclosures are positive.
- Public bounty program absent.
- Team/governance transparency is improving but appears earlier-stage than mature LST incumbents.

## Monitoring

### 1. Governance Monitoring (MANDATORY)

Monitor all privileged role actions and parameter changes for:
- queue limits and withdrawal controls
- reserve/buffer parameters
- delegation strategy controls
- pause/emergency functions

Alert immediately on:
- ownership/multisig signer changes
- timelock delay reductions
- emergency pause activations

### 2. Backing & Solvency Monitoring (MANDATORY)

Track:
- total stHYPE supply
- estimated total managed HYPE (staked + liquid reserve)
- backing ratio trend
- validator concentration and large delegation shifts

Alert thresholds:
- backing ratio deterioration >1% in 24h (without expected event)
- single validator concentration >25%

### 3. Queue & Exit Monitoring (MANDATORY)

Track:
- queue size and age distribution
- realized withdrawal times
- reserve utilization rate

Alert thresholds:
- median queue delay > target SLA for 24h+
- reserve buffer utilization >80% sustained
- abrupt increase in queued exits (>20% day-over-day)

### 4. Market Liquidity Monitoring

Track:
- stHYPE/HYPE and stHYPE/stable pool depth
- slippage for representative sizes
- depeg vs implied fair value

Alert thresholds:
- >2% sustained discount vs implied NAV proxy
- pool depth drop >40% day-over-day

### 5. Hyperliquid Base Risk Monitoring

Track official Hyperliquid staking/validator announcements for:
- validator jailing incidents
- any governance activation of validator slashing
- validator instability
- staking parameter changes
- chain liveness incidents

## Risk Summary

### Key Strengths

1. Clear product-market fit: native HYPE liquid staking primitive.
2. Public audit trail with multiple firms and multiple rounds.
3. Detailed technical docs for HSM and unstaking mechanics.
4. On-chain staking economics rather than off-chain custodial backing.

### Key Risks

1. Queue-based exits and stress-path wind-down mechanics introduce liquidity delay risk.
2. Meaningful governance/parameter control centralization in current phase.
3. Strong dependency on Hyperliquid validator and chain-level risk.
4. Slashing regime may change via governance (currently no automatic validator slashing in base staking).
5. No public bug bounty program identified.

### Critical Risks

- No immediate critical gate failure found from available public docs.
- Highest tail risk is correlated Hyperliquid chain/validator stress causing both backing and liquidity pressure simultaneously.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** -- PASS (4 audits disclosed)
- [x] **Unverifiable reserves** -- PASS (on-chain staking model, though monitoring visibility still maturing)
- [x] **Total centralization** -- PASS (not single-EOA only, but governance remains relatively concentrated)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- 4 disclosed audits across Dec 2024-Nov 2025.
- Positive security posture but shorter production history than mature LST leaders.

**Score: 2.5/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

Subscores:
- Governance: 3.5
- Programmability: 3.0
- External dependencies: 4.0

Centralization score = (3.5 + 3.0 + 4.0) / 3 = **3.5**

**Score: 3.5/5**

#### Category 3: Funds Management (Weight: 30%)

Subscores:
- Collateralization: 2.5
- Provability: 2.5

Funds management score = (2.5 + 2.5) / 2 = **2.5**

**Score: 2.5/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Queue-based withdrawals and stress-path delays can materially extend exit times.
- Liquidity resilience under extreme conditions remains the key unknown.

**Score: 3.5/5**

#### Category 5: Operational Risk (Weight: 5%)

- Good docs and audits.
- No public bounty; governance and transparency still maturing.

**Score: 3.0/5**

### Final Score Calculation

Final Score =
(Audits x 0.20) + (Centralization x 0.30) + (Funds Mgmt x 0.30) + (Liquidity x 0.15) + (Operational x 0.05)

= (2.5 x 0.20) + (3.5 x 0.30) + (2.5 x 0.30) + (3.5 x 0.15) + (3.0 x 0.05)

= 0.50 + 1.05 + 0.75 + 0.525 + 0.15

= **2.98 / 5.0**

## Overall Risk Score: **3.0 / 5.0**

### Risk Tier: **MEDIUM RISK**

Rationale:
- stHYPE is materially more complex/risk-bearing than WHYPE due to delegated staking, queue exits, and governance parameter controls. Audit coverage is decent, but dependency concentration and liquidity-path risk justify a medium-risk classification.

## Reassessment Triggers

1. Any governance architecture upgrade (SAFE/timelock/token governance rollout).
2. Material changes to unstake queue logic, reserve policy, or `maxUnstakeBuffer`.
3. Any Hyperliquid validator jailing wave or governance rollout of validator slashing.
4. Any stHYPE discount >3% sustained for >24h.
5. Any incident disclosure by StakedHYPE or Hyperliquid affecting staking settlement.
6. Release of new audits or public bug bounty program.

## Sources

- StakedHYPE docs home: https://docs.stakedhype.fi/
- HSM technical docs: https://docs.stakedhype.fi/technical/hyperliquid-stake-marketplace-hsm
- StakedHYPE technical docs: https://docs.stakedhype.fi/technical/stakedhype
- stHYPE unstaking: https://docs.stakedhype.fi/technical/sthype-unstaking
- stHYPE risks: https://docs.stakedhype.fi/technical/sthype-risks
- StakedHYPE governance: https://docs.stakedhype.fi/governance
- StakedHYPE security: https://docs.stakedhype.fi/technical/security
- Pashov Dec 2024 audit: https://github.com/ValantisLabs/audits/blob/main/staked_hype/pashov_dec_2024.pdf
- Pashov Mar 2025 audit: https://github.com/ValantisLabs/audits/blob/main/staked_hype/pashov_mar_2025.pdf
- Hyperliquid staking docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking
- Hyperliquid validators docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking/validators
- Hyperliquid validator penalties/jailing docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking/validator-prison
- Hyperliquid risks docs: https://hyperliquid.gitbook.io/hyperliquid-docs/risks
