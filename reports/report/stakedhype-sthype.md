# Protocol Risk Assessment: StakedHYPE stHYPE (via Hyperliquid Stake Marketplace)

**Assessment Date:** February 12, 2026
**Token:** stHYPE
**Chain:** HyperEVM (Hyperliquid L1 ecosystem)
**Primary Docs:** https://docs.stakedhype.fi/technical/hyperliquid-stake-marketplace-hsm

## Overview + Links

StakedHYPE issues `stHYPE`, a liquid staking token representing HYPE staked into Hyperliquid validators through Hyperliquid Stake Marketplace (HSM). Conceptually it is similar to stETH: users deposit native HYPE, receive an LST (`stHYPE`), and accumulate staking rewards in token exchange rate terms.

StakedHYPE was originally built by **Thunderhead Labs**, a multi-LST provider (stFLIP, stELX, stMOVE, tPOKT, stHYPE) with shared modular infrastructure across products. In August 2025, stHYPE was **acquired by Valantis Labs**, which now maintains the protocol. The codebase benefits from components battle-tested across multiple Thunderhead LST deployments.

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
- [Stake Accounts & Architecture](https://docs.stakedhype.fi/technical/stake-accounts)
- [stHYPE Integration (mint/burn/unstaking)](https://docs.stakedhype.fi/technical/integrate)
- [Transparency & Risks](https://docs.stakedhype.fi/info/transparency-and-risks)
- [Contract Addresses](https://docs.stakedhype.fi/technical/contract-addresses)
- [Audits](https://docs.stakedhype.fi/technical/audits)
- [StakedHYPE security page](https://docs.stakedhype.fi/technical/security)
- [StakedHYPE governance page](https://docs.stakedhype.fi/governance)
- [Hyperliquid staking docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking)
- [Hyperliquid validator docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking/validators)

## Contract Addresses

All contracts are deployed on HyperEVM (Hyperliquid L1). Explorer: [Blockscout](https://hyperliquid.cloud.blockscout.com).

| Contract | Address | Type |
|----------|---------|------|
| stHYPE | [`0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1`](https://hyperliquid.cloud.blockscout.com/address/0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1) | Proxy (ERC-20 LST) |
| stHYPE Impl | [`0xa2fdc8eca86e3cf2593ec20f42a777984927553c`](https://hyperliquid.cloud.blockscout.com/address/0xa2fdc8eca86e3cf2593ec20f42a777984927553c) | Implementation |
| stHYPE ProxyAdmin | [`0xe7b0f26e8e20e109441f0ad1c885fffbb27125dc`](https://hyperliquid.cloud.blockscout.com/address/0xe7b0f26e8e20e109441f0ad1c885fffbb27125dc) | EIP-1967 Admin |
| OverseerV1 | [`0xB96f07367e69e86d6e9C3F29215885104813eeAE`](https://hyperliquid.cloud.blockscout.com/address/0xB96f07367e69e86d6e9C3F29215885104813eeAE) | Proxy (mint/burn controller) |
| OverseerV1 Impl | [`0xc9dcf086ee9f063bcd4c7d2ec4b82085142a8cee`](https://hyperliquid.cloud.blockscout.com/address/0xc9dcf086ee9f063bcd4c7d2ec4b82085142a8cee) | Implementation |
| OverseerV1 ProxyAdmin | [`0x943a7e81373423f7bb0fb6a3e55553638264fd6b`](https://hyperliquid.cloud.blockscout.com/address/0x943a7e81373423f7bb0fb6a3e55553638264fd6b) | EIP-1967 Admin |
| wstHYPE | [`0x94e8396e0869c9F2200760aF0621aFd240E1CF38`](https://hyperliquid.cloud.blockscout.com/address/0x94e8396e0869c9F2200760aF0621aFd240E1CF38) | Proxy (wrapped shares) |
| wstHYPE Impl | [`0x2936b42d1bfa7298faa44644ddea665c7aa51ef8`](https://hyperliquid.cloud.blockscout.com/address/0x2936b42d1bfa7298faa44644ddea665c7aa51ef8) | Implementation |
| wstHYPE ProxyAdmin | [`0xa29a2043b2fcbc9189beb9e6efcb2ba48bb3d586`](https://hyperliquid.cloud.blockscout.com/address/0xa29a2043b2fcbc9189beb9e6efcb2ba48bb3d586) | EIP-1967 Admin |
| Governance Multisig | [`0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9`](https://hyperliquid.cloud.blockscout.com/address/0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9) | Gnosis Safe (3-of-5) |

All contracts are **upgradeable** via EIP-1967 transparent proxy pattern. Each proxy has a separate ProxyAdmin contract. All three ProxyAdmin contracts are owned by the governance multisig (`0x97dee0ea...`, verified via `owner()` on each ProxyAdmin). This means the **3-of-5 multisig can upgrade all contract implementations** without timelock.

Source: [docs.stakedhype.fi/technical/contract-addresses](https://docs.stakedhype.fi/technical/contract-addresses) + on-chain verification via `eth_getStorageAt` (EIP-1967 slots).

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

StakedHYPE publicly lists 4 audits on its [audits page](https://docs.stakedhype.fi/technical/audits):

| # | Date | Firm | Scope | Link |
|---|---|---|---|---|
| 1 | Feb 2025 | Three Sigma | StakedHYPE contracts | [Report](https://github.com/ValantisLabs/audits/blob/main/Three_Sigma_Feb_25.pdf) |
| 2 | Oct 2025 | Pashov Audit Group | StakedHYPE contracts | [Report](https://github.com/ValantisLabs/audits/blob/main/pashov_oct_25.pdf) |
| 3 | Nov 2025 | Pashov Audit Group | StakedHYPE updates | [Report](https://github.com/ValantisLabs/audits/blob/main/pashov_nov_2025.pdf) |
| 4 | Nov 2025 | Guardian Audits | StakedHYPE updates | [Report](https://github.com/ValantisLabs/audits/blob/main/guardian_nov_2025.pdf) |

StakedHYPE was originally built by **Thunderhead Labs** (multi-LST provider: stFLIP, stELX, stMOVE, tPOKT) and acquired by **Valantis Labs** in August 2025. Cross-LST audits with shared modular components are available in the [Thunderhead audits repo](https://github.com/thunderhead-labs/audits). The Three Sigma audit is mirrored in both repos (identical SHA: `4c39b756`).

The governance system is based on a modified [FraxGovernorOmega](https://github.com/trailofbits/publications/blob/master/reviews/2023-05-fraxgov-securityreview.pdf) (audited by Trail of Bits), but is **not yet implemented** per the audits page.

Additional disclosures:
- HSM docs state code and technical docs are expected to be published in GitHub once finalized, indicating parts of stack/process may still be maturing.
- No public formal verification disclosure was identified.

### Bug Bounty

No Immunefi/Sherlock/Cantina bug bounty link was identified in docs.

Disclosed security contacts:
- Email: audit@valantis.xyz (per [security page](https://docs.stakedhype.fi/technical/security))
- Discord: [StakedHYPE Discord](https://t.co/zZB5aEVqCh)
- Twitter: [@ValantisLabs](https://twitter.com/ValantisLabs)

Assessment note:
- Responsible disclosure channel exists, but absence of a public bounty with payout tiers weakens external adversarial testing incentives relative to peers.

## Historical Track Record

- StakedHYPE documentation indicates active production operation with stHYPE issuance and unstaking mechanisms live.
- Listed on [DeFiLlama](https://defillama.com/protocol/stakedhype) since July 2025 (~7 months at assessment date).
- **Current TVL**: ~$133M (February 2026, per DeFiLlama).
- **Peak TVL**: ~$544M (July 2025).
- **TVL trend**: Significant decline from peak, currently at ~24% of ATH. Likely driven by broader market conditions and HYPE price movements rather than protocol-specific issues.
- No major publicly disclosed exploit was identified in StakedHYPE docs at assessment time. Not listed on [Rekt News](https://rekt.news/) or [DeFiLlama Hacks](https://defillama.com/hacks).
- Track record is materially shorter and less battle-tested than older LSTs like stETH (~7 months vs 3+ years).

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

On-chain state (verified February 12, 2026):
- **stHYPE totalSupply**: 4,273,108.50 stHYPE
- **OverseerV1 liquid reserve**: 316,477.71 HYPE (7.4% of supply held as liquid HYPE)
- **Exchange rate** (`balancePerShare`): 1.0200 (1.9962% accumulated yield since launch)
- **maxRedeemable**: 0 HYPE — no instant redemption buffer available at time of check, all burns go through 7-day unstaking queue
- **burnCount**: 39,073 total burns processed

Economic backing is staked HYPE plus liquid reserves. The remaining ~92.6% of HYPE is staked across validators via HyperCore Staking Modules.
- Backing quality is primarily dependent on Hyperliquid validator set quality and slashing/operational outcomes.
- This is not off-chain custodial collateral; risk is on-chain protocol + validator behavior.

### Provability

- Core staking and token accounting are on-chain by design.
- Key on-chain readable functions verified: `totalSupply()`, `balancePerShare()`, `totalShares()`, `maxRedeemable()`, `burnCount()`, `getBurns(address)`, `redeemable(uint256)`.
- Exchange rate (`balancePerShare`) is programmatically updated on-chain — not reliant on admin oracle updates.
- Contracts use OpenZeppelin AccessControl with MINTER_ROLE, BURNER_ROLE, PAUSER_ROLE, DEFAULT_ADMIN_ROLE. OverseerV1 holds MINTER_ROLE and BURNER_ROLE on stHYPE. The 3-of-5 multisig holds DEFAULT_ADMIN_ROLE.
- However, full real-time risk transparency (validator concentration, queue stress) depends on dashboard quality. HSM docs mention staged publication/finalization, so transparency posture should be considered improving but not fully mature.

## Liquidity Risk

stHYPE exit risk is higher than a pure wrapper token:

- There is an unstaking queue design (not instant native redemption in all conditions).
- Docs disclose a reserve buffer with a [`maxRedeemable()`](https://docs.stakedhype.fi/technical/integrate) function for instant redemptions, a Managed Liquidity Buffer (1M HYPE early-exit threshold, 300k HYPE buffer), and up to a 90-day wind-down horizon for specialized stake accounts in extreme stress conditions.

### DEX Liquidity (per DeFiLlama, February 2026)

**Total DEX liquidity: ~$403K** — extremely thin relative to $131M TVL (0.3% of TVL in DEX pools).

| DEX | Pair | TVL | Fee | Vol 7D |
|-----|------|-----|-----|--------|
| HyperSwap V3 | WHYPE-STHYPE | $196,659 | 0.01% | $53,047 |
| Project X | WSTHYPE-KHYPE | $104,064 | 0.3% | N/A |
| HyperSwap V3 | WHYPE-LSTHYPE | $59,804 | 0.3% | $129,923 |
| Project X | WHYPE-WSTHYPE | $42,904 | 0.01% | $55,348 |

No Curve, Laminar, or KittenSwap pools found for stHYPE despite these DEXes being deployed on HyperEVM.

**Lending protocol deposits** dominate external stHYPE usage: ~$41M across HyperLend ($32M) and Morpho ($8M). Pendle markets hold ~$6M. These are not exit liquidity.

Practical implications:
- In normal conditions, protocol reserves/queue support predictable withdrawals (7-day unstaking).
- **Secondary market exit is severely constrained**: the largest DEX pool is <$200K. Any meaningful position would need to rely on the protocol's native unstaking queue.
- In stress conditions, exits can be delayed up to 90 days (specialized stake account wind-down) and/or become market-impact sensitive.

## Centralization & Control Risks

### Governance

StakedHYPE docs describe a planned dual-governance model based on a modified [FraxGovernorOmega](https://github.com/trailofbits/publications/blob/master/reviews/2023-05-fraxgov-securityreview.pdf):
- **Legislative branch**: Multisig composed of Thunderhead team, Valantis team, ecosystem partners, and community members. Proposals are optimistic (succeed by default unless vetoed).
- **Executive branch**: stHYPE token holder veto power over governance proposals.

**Current status: NOT YET IMPLEMENTED.** The [security page](https://docs.stakedhype.fi/technical/security) states: *"This system will go live post Hyperliquid pre-compiles."* The [audits page](https://docs.stakedhype.fi/technical/audits) labels this as *"Governance (not implemented)."*

The current operational model is a **team-controlled multisig** without the documented veto mechanism.

On-chain verified governance data:
- **Multisig address**: [`0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9`](https://hyperliquid.cloud.blockscout.com/address/0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9) (Gnosis Safe on HyperEVM)
- **Threshold**: **3-of-5** (verified via `getThreshold()`)
- **Nonce**: 20 transactions executed
- **Timelock**: No timelock mechanism documented or found on-chain.
- **Signer identities**: Not individually disclosed. Described only as "Thunderhead team, Valantis Team, ecosystem partners."

Signer addresses (verified via `getOwners()`):
1. [`0x7fa8b1d57d31286377c7103255967da7f682861d`](https://hyperliquid.cloud.blockscout.com/address/0x7fa8b1d57d31286377c7103255967da7f682861d)
2. [`0x5cd0448cc4aae28e46babdb285b9e3b601872378`](https://hyperliquid.cloud.blockscout.com/address/0x5cd0448cc4aae28e46babdb285b9e3b601872378)
3. [`0x10f6160f0033700cb55c478826068dad4d210465`](https://hyperliquid.cloud.blockscout.com/address/0x10f6160f0033700cb55c478826068dad4d210465)
4. [`0x47cb7961d4a9218433023e9d0f3b2e3630a3e10e`](https://hyperliquid.cloud.blockscout.com/address/0x47cb7961d4a9218433023e9d0f3b2e3630a3e10e)
5. [`0x4993522ee8091cc7a452af7a98d5ef4a269f6fc5`](https://hyperliquid.cloud.blockscout.com/address/0x4993522ee8091cc7a452af7a98d5ef4a269f6fc5)

Risk implications:
- Governance is operationally centralized in current phase with no public timelock or threshold disclosure.
- The planned dual-governance with stHYPE holder veto would be a meaningful improvement, but is not yet live.
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
- Security page and audit disclosures are positive. One co-founder found a [$6M white-hat vulnerability in Curve](https://docs.stakedhype.fi/technical/security), demonstrating security expertise.
- Public bounty program absent. Not listed on Immunefi, Sherlock, Code4rena, or Cantina.
- Team operates as "known anons" via Valantis Labs. Key GitHub contributors identified: Ankit Parashar (0xparashar), Ed (happenwah). Twitter: [@ValantisLabs](https://twitter.com/ValantisLabs).
- Thunderhead Labs (original builder) has operational track record across multiple LST deployments (stFLIP, stELX, stMOVE, tPOKT). The Valantis acquisition adds the AMM/DEX expertise of the Valantis team.
- Team/governance transparency is improving but appears earlier-stage than mature LST incumbents.

## Monitoring

Key contracts to monitor:
- stHYPE Proxy: [`0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1`](https://hyperliquid.cloud.blockscout.com/address/0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1)
- OverseerV1 Proxy: [`0xB96f07367e69e86d6e9C3F29215885104813eeAE`](https://hyperliquid.cloud.blockscout.com/address/0xB96f07367e69e86d6e9C3F29215885104813eeAE)
- wstHYPE Proxy: [`0x94e8396e0869c9F2200760aF0621aFd240E1CF38`](https://hyperliquid.cloud.blockscout.com/address/0x94e8396e0869c9F2200760aF0621aFd240E1CF38)
- Governance Multisig: [`0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9`](https://hyperliquid.cloud.blockscout.com/address/0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9) (Gnosis Safe 3-of-5)

### 1. Governance Monitoring (MANDATORY)

Monitor all privileged role actions and parameter changes for:
- RoleGranted / RoleRevoked events on stHYPE and OverseerV1 (AccessControl)
- queue limits and withdrawal controls
- reserve/buffer parameters
- delegation strategy controls
- Upgraded events on proxy contracts (implementation changes)

Alert immediately on:
- ownership/multisig signer changes (AddedOwner/RemovedOwner on Safe)
- threshold changes (ChangedThreshold on Safe)
- implementation upgrades (Upgraded event on proxy)
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

- 4 disclosed audits across Feb 2025-Nov 2025 (Three Sigma, Pashov x2, Guardian). Governance audit via Trail of Bits (inherited FraxGov).
- No bug bounty program on any major platform.
- ~7 months in production, TVL ~$133M (peaked ~$544M).
- Per rubric: 3+ audits -> score 1-2 range for audits, but no bug bounty -> cannot reach score 1. Production time 6-12 months with TVL >$100M fits score 3 for track record.

**Score: 2.5/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

Subscores:
- Governance: **4.0** — 3-of-5 multisig (verified on-chain), no timelock, signer identities undisclosed, planned governance system not yet implemented. Per rubric: "Multisig 3/5 or low threshold" + "No timelock" + "Powerful admin roles with limited constraints" = score 4.
- Programmability: **3.0** — Hybrid on-chain/off-chain. Exchange rate is on-chain (`balancePerShare`), but validator delegation strategy requires off-chain operational decisions. OverseerV1 has MINTER_ROLE and BURNER_ROLE over stHYPE.
- External dependencies: **4.0** — Critical single-ecosystem dependency on Hyperliquid L1 (consensus, validator performance, staking rules). Failure of Hyperliquid would break the entire protocol.

Centralization score = (4.0 + 3.0 + 4.0) / 3 = **3.67**

**Score: 3.67/5**

#### Category 3: Funds Management (Weight: 30%)

Subscores:
- Collateralization: **2.5** — 100% on-chain collateral (staked HYPE), but not over-collateralized. Liquid reserve only 7.4% of supply. Collateral quality = single-asset (HYPE), not blue-chip.
- Provability: **2.0** — Key state readable on-chain (`totalSupply`, `balancePerShare`, `maxRedeemable`, `totalShares`). Exchange rate updated programmatically. AccessControl roles verified. Some off-chain complexity around validator delegation not fully transparent.

Funds management score = (2.5 + 2.0) / 2 = **2.25**

**Score: 2.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Queue-based withdrawals: 7-day standard unstaking, up to 90-day for specialized stake account wind-down.
- DEX liquidity is extremely thin: ~$403K total across all pools (0.3% of $133M TVL). Largest single pool <$200K.
- `maxRedeemable()` returned 0 at time of check — no instant redemption buffer available.
- Protocol unstaking queue is the primary exit mechanism, not secondary market trading.
- Per rubric: "Withdrawal queues or restrictions" + "<$1M DEX liquidity" + ">1 week potential exit time" = score 4. However, same-value asset (stHYPE/HYPE) mitigates somewhat.

**Score: 3.5/5**

#### Category 5: Operational Risk (Weight: 5%)

- Good docs and audits.
- No public bounty; governance and transparency still maturing.

**Score: 3.0/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.67 | 30% | 1.10 |
| Funds Management | 2.25 | 30% | 0.68 |
| Liquidity Risk | 3.5 | 15% | 0.53 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **2.95 / 5.0** |

## Overall Risk Score: **3.0 / 5.0**

### Risk Tier: **MEDIUM RISK**

Rationale:
- stHYPE is materially more complex/risk-bearing than WHYPE due to delegated staking, queue exits, and governance parameter controls.
- Audit coverage is decent (4 audits from reputable firms), but no bug bounty.
- Governance is centralized: 3-of-5 multisig with no timelock, planned dual-governance not yet implemented.
- DEX liquidity is extremely thin ($403K vs $133M TVL); primary exit is via protocol unstaking queue (7+ days).
- Strong single-ecosystem dependency on Hyperliquid L1.
- Partially offset by: on-chain verifiable backing, programmatic exchange rate, Thunderhead's multi-LST track record, no incidents to date.

## Reassessment Triggers

1. Any governance architecture upgrade (SAFE/timelock/token governance rollout).
2. Material changes to unstake queue logic, reserve policy, or `maxRedeemable()` buffer parameters.
3. Any Hyperliquid validator jailing wave or governance rollout of validator slashing.
4. Any stHYPE discount >3% sustained for >24h.
5. Any incident disclosure by StakedHYPE or Hyperliquid affecting staking settlement.
6. Release of new audits or public bug bounty program.

## Sources

- StakedHYPE docs home: https://docs.stakedhype.fi/
- HSM technical docs: https://docs.stakedhype.fi/technical/hyperliquid-stake-marketplace-hsm
- Stake Accounts & Architecture: https://docs.stakedhype.fi/technical/stake-accounts
- Integration (mint/burn/unstaking): https://docs.stakedhype.fi/technical/integrate
- Transparency & Risks: https://docs.stakedhype.fi/info/transparency-and-risks
- Contract Addresses: https://docs.stakedhype.fi/technical/contract-addresses
- Audits page: https://docs.stakedhype.fi/technical/audits
- StakedHYPE governance: https://docs.stakedhype.fi/governance
- StakedHYPE operators: https://docs.stakedhype.fi/governance/operators
- StakedHYPE security: https://docs.stakedhype.fi/technical/security
- wstHYPE docs: https://docs.stakedhype.fi/technical/wsthype
- ValantisLabs audit repo: https://github.com/ValantisLabs/audits
- Thunderhead Labs audit repo: https://github.com/thunderhead-labs/audits
- Three Sigma Feb 2025 audit: https://github.com/ValantisLabs/audits/blob/main/Three_Sigma_Feb_25.pdf
- Pashov Oct 2025 audit: https://github.com/ValantisLabs/audits/blob/main/pashov_oct_25.pdf
- Pashov Nov 2025 audit: https://github.com/ValantisLabs/audits/blob/main/pashov_nov_2025.pdf
- Guardian Nov 2025 audit: https://github.com/ValantisLabs/audits/blob/main/guardian_nov_2025.pdf
- Trail of Bits FraxGov audit (governance basis): https://github.com/trailofbits/publications/blob/master/reviews/2023-05-fraxgov-securityreview.pdf
- DeFiLlama StakedHYPE: https://defillama.com/protocol/stakedhype
- Hyperliquid staking docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking
- Hyperliquid validators docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking/validators
- Hyperliquid risks docs: https://hyperliquid.gitbook.io/hyperliquid-docs/risks
