# Protocol Risk Assessment: Kinetiq kHYPE

**Assessment Date:** February 12, 2026
**Token:** kHYPE
**Chain:** HyperEVM (Hyperliquid ecosystem)
**Token Address:** [`0xfd739d4e423301ce9385c1fb8850539d657c296d`](https://hyperevmscan.io/address/0xfd739d4e423301ce9385c1fb8850539d657c296d)

## Overview + Links

Kinetiq is a liquid staking protocol for HYPE. Users stake HYPE and receive `kHYPE`, a liquid staking token whose redemption value appreciates from staking rewards, similar in concept to stETH.

Kinetiq routes stake through its `StakeHub` layer and supports validator delegation, queue-based unstaking, and additional utility via `vaultHYPE` / `xkHYPE` components.

**Links:**

- [Kinetiq app](https://kinetiq.xyz/)
- [Kinetiq docs](https://kinetiq.xyz/docs)
- [kHYPE docs](https://docs.kinetiq.xyz/kinetiq-lsd/khype)
- [StakeHub docs](https://docs.kinetiq.xyz/kinetiq-lsd/stakehub)
- [Contracts page](https://docs.kinetiq.xyz/resources/contracts)
- [Audits page](https://docs.kinetiq.xyz/resources/audits)
- [Kinetiq bug bounty (Cantina)](https://cantina.xyz/competitions/6f028672-6fbb-4fbe-9623-97457fc6531a)
- [CoinGecko kHYPE](https://www.coingecko.com/en/coins/kinetiq-staked-hype)

## Contract Addresses

From Kinetiq docs contract registry:

| Component | Address |
|---|---|
| kHYPE | [`0xfd739d4e423301ce9385c1fb8850539d657c296d`](https://hyperevmscan.io/address/0xfd739d4e423301ce9385c1fb8850539d657c296d) |
| StakeHub | [`0x7f174c5dc4c1270e8dff70f8d58f36ac6f63fd1f`](https://hyperevmscan.io/address/0x7f174c5dc4c1270e8dff70f8d58f36ac6f63fd1f) |
| Withdrawal Queue | [`0x600a580911dc6bf880e1e4f7e5374500162f7cf5`](https://hyperevmscan.io/address/0x600a580911dc6bf880e1e4f7e5374500162f7cf5) |
| Withdrawal Manager | [`0x95f4a7614f5884de8559f6c9e60d71ca0f7abc19`](https://hyperevmscan.io/address/0x95f4a7614f5884de8559f6c9e60d71ca0f7abc19) |
| Deposit Pool | [`0x2f5e9c569ef73d4c0b7677e8b0f6f9f5f906d5f7`](https://hyperevmscan.io/address/0x2f5e9c569ef73d4c0b7677e8b0f6f9f5f906d5f7) |
| Kinetiq Oracle | [`0x14bfeb18b2f298184f6905b5d0b6749c3002f182`](https://hyperevmscan.io/address/0x14bfeb18b2f298184f6905b5d0b6749c3002f182) |
| Commission Manager | [`0x3f7581917407d738e6fef7d804da56c8e5ddd8f4`](https://hyperevmscan.io/address/0x3f7581917407d738e6fef7d804da56c8e5ddd8f4) |
| Pauser Registry | [`0x90770f6025eaf4f98e4f9fbd3b5f6f636870b627`](https://hyperevmscan.io/address/0x90770f6025eaf4f98e4f9fbd3b5f6f636870b627) |
| Operator Registry | [`0x9f4da31de6f86f656f4ce3ac3f2ec214f13652ec`](https://hyperevmscan.io/address/0x9f4da31de6f86f656f4ce3ac3f2ec214f13652ec) |

## How Hyperliquid Staking Works (Context)

Hyperliquid staking is validator-based. HYPE is delegated to validators, and rewards depend on validator performance and network-level staking parameters.

Important slashing context (as of February 12, 2026):
- Hyperliquid docs indicate no automatic validator slashing in base HYPE staking at present.
- Validator penalties are primarily jailing/operational exclusion mechanisms.
- Governance can still change staking/penalty rules in future.

Implication for kHYPE:
- Current tail risk is more validator-performance/liveness and queue-liquidity related than immediate automatic slash haircut.
- Governance-introduced slashing would materially change kHYPE risk profile and should trigger reassessment.

## Audits and Due Diligence Disclosures

Kinetiq discloses multiple audits across core LSD and adjacent modules.

### kHYPE / staking-core relevant audits

| Date | Auditor | Scope |
|---|---|---|
| Apr 2025 | Quantstamp | kHYPE |
| Jul 2025 | Three Sigma | kHYPE |
| Jul 2025 | Zellic | kHYPE |
| Sep 2025 | Guardian Audits | kHYPE |
| Jul 2025 | Three Sigma | stakeHYPE |
| Nov 2025 | Three Sigma | stakeHYPE |

### broader protocol audits (additional context)

| Date | Auditor | Scope |
|---|---|---|
| Jan 2026 | Guardian Audits | xkHYPE |
| Jan 2026 | Three Sigma | xkHYPE |
| Jan 2026 | Guardian Audits | skHYPE |
| Jan 2026 | Three Sigma | skHYPE |

Architecture complexity: high-moderate. kHYPE relies on multiple contracts (StakeHub, queue manager, oracle, commission manager, registries), which increases integration/control-plane risk compared to single-contract wrappers.

### Bug Bounty

- **Platform:** Cantina
- **Max Reward:** up to **$5,000,000** (per competition page)
- **Scope:** Kinetiq smart-contract/security competition scope
- **Link:** https://cantina.xyz/competitions/6f028672-6fbb-4fbe-9623-97457fc6531a

## Historical Track Record

- kHYPE is a relatively new LST compared with mature peers such as stETH.
- CoinGecko indicates active market history through 2025-2026 (ATH listed Sep 18, 2025).
- No major publicly documented kHYPE exploit was identified in Kinetiq docs at assessment time.
- No official Hyperliquid documentation found describing a historical validator slashing event as of February 12, 2026.
- Shorter operating history and evolving module set (kHYPE + xkHYPE/skHYPE) imply higher change risk.

## Funds Management

kHYPE manages deposited HYPE through StakeHub and validator delegation, not a passive 1:1 wrapper.

### Accessibility

From Kinetiq docs/FAQ:
- Minting via stake flow is permissionless through app/contract path.
- Unstaking is queue-based, not instant.
- Reported unstaking characteristics:
  - approximately **8-9 day** unstaking period in normal conditions
  - **0.10% unstaking fee**
  - no rewards accrue while waiting in the unstake queue

### Collateralization

- Economic backing: delegated staked HYPE + liquid buffers in system contracts.
- Backing quality tied to Hyperliquid validator/network health.
- No off-chain custodial reserve model is disclosed for core kHYPE backing.

### Provability

- Core accounting and token supply are on-chain.
- Final exchange rate behavior depends on reward accrual + protocol accounting paths.
- Presence of an internal oracle and multiple manager contracts introduces additional trust/monitoring requirements beyond pure wrappers.

## Liquidity Risk

kHYPE exit routes:

1. Protocol unstake queue (primary deterministic exit)
- Predictable but delayed (doc-indicated ~8-9 days normal conditions)
- Fee-bearing exit path (0.10%)
- Queue delay can expand under stress

2. Secondary market liquidity
- Fast exit depends on DEX/CEX depth and discount/premium conditions
- During stress, discount to implied NAV can widen materially

Given queue dependence and newer market depth profile, kHYPE liquidity risk is materially higher than WHYPE and higher than mature LST venues.

## Centralization & Control Risks

### Governance

Kinetiq docs reference multisig admin and pause controls in FAQ/governance materials, and contract map includes dedicated pauser/operator registries.

Key implications:
- Privileged roles exist for operational safety and parameter management.
- Centralization risk depends on multisig threshold quality and timelock usage; these should be continuously verified on-chain.

### Programmability

- Hybrid on-chain system with multiple modules (StakeHub, queue/manager, oracle, registries).
- More moving parts than WETH-style wrappers.
- Additional integration risk from inter-contract assumptions and operator configuration.

### External Dependencies

Critical dependencies:
1. Hyperliquid chain liveness and validator operations.
2. Hyperliquid staking rule stability.
3. Kinetiq oracle + manager modules operating correctly.
4. Market liquidity venues for secondary exits.

Failure in Hyperliquid validator layer or chain operations directly impacts kHYPE backing and redemption dynamics.

## Operational Risk

- Public docs are relatively detailed and actively maintained.
- Audit depth is strong for protocol age.
- Public bug bounty availability is a strong positive.
- Main weakness is youth of system and number of moving modules added in short time.

## Monitoring

### 1. Governance / Privileged Roles (MANDATORY)

Monitor these contracts for owner/role/threshold changes:
- `PauserRegistry` (`0x90770f6025eaf4f98e4f9fbd3b5f6f636870b627`)
- `OperatorRegistry` (`0x9f4da31de6f86f656f4ce3ac3f2ec214f13652ec`)
- `CommissionManager` (`0x3f7581917407d738e6fef7d804da56c8e5ddd8f4`)

Immediate alerts:
- New privileged role assignment
- Pause action invoked
- Commission/fee parameter changes

### 2. Backing & Supply Monitoring (MANDATORY)

Track:
- `kHYPE.totalSupply()`
- StakeHub/deposit/withdraw manager balances
- net delegation shifts and validator concentration

Alert thresholds:
- backing ratio drift >1% in 24h (unless expected market event)
- single validator concentration >25%

### 3. Queue Health Monitoring (MANDATORY)

Track:
- queue size and average wait time
- daily enqueue/dequeue flow
- completed withdrawal latency

Alert thresholds:
- average unstake latency >12 days sustained
- queue size growth >30% day-over-day

### 4. Market Liquidity Monitoring

Track:
- kHYPE/HYPE and kHYPE/stable liquidity depth
- implied NAV discount/premium
- slippage for standard notional buckets

Alert thresholds:
- discount >2% sustained for 24h
- liquidity depth decline >40% day-over-day

### 5. Hyperliquid Base Risk Monitoring

Track official Hyperliquid updates for:
- validator jailing waves
- staking parameter changes
- any governance introduction of automatic validator slashing
- chain liveness/finality incidents

## Risk Summary

### Key Strengths

1. Clear LST design with on-chain staking exposure to HYPE.
2. Strong disclosed audit coverage across 2025-2026 modules.
3. Active public bug bounty with high maximum reward.
4. Public contract registry improves monitorability.

### Key Risks

1. Queue-based unstake path (~8-9 days normal) introduces redemption delay risk.
2. Multi-contract architecture adds integration and control-plane complexity.
3. Privileged roles (pauser/operator/commission) require continuous governance monitoring.
4. Heavy dependence on Hyperliquid validator and chain health.
5. Possible future slashing-regime changes at Hyperliquid staking layer.

### Critical Risks

- No current critical gate failure identified.
- Primary tail scenario is correlated chain/validator stress + queue congestion + market discount widening.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** -> **PASS** (multiple audits disclosed)
- [x] **Unverifiable reserves** -> **PASS** (on-chain accounting and contract registry available)
- [x] **Total centralization** -> **PASS** (multisig/role-based system, not single-EOA only)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- Multiple reputable audits (Quantstamp, Three Sigma, Zellic, Guardian) across core and adjacent modules.
- Bug bounty present and substantial.
- Historical runtime is still relatively short.

**Score: 2.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

Subscores:
- Governance: 3.0
- Programmability: 3.5
- External dependencies: 4.0

Centralization score = (3.0 + 3.5 + 4.0) / 3 = **3.5**

**Score: 3.5/5**

#### Category 3: Funds Management (Weight: 30%)

Subscores:
- Collateralization: 2.5
- Provability: 2.5

Funds management score = (2.5 + 2.5) / 2 = **2.5**

**Score: 2.5/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Queue-based unstake with multi-day delay and fee.
- Secondary liquidity depth can deviate from fair value in stress.

**Score: 3.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Strong docs/audits/bounty for protocol age.
- Ongoing release cadence and modular expansion increase operational-change risk.

**Score: 2.5/5**

### Final Score Calculation

Final Score =
(Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)

= (2.0 × 0.20) + (3.5 × 0.30) + (2.5 × 0.30) + (3.0 × 0.15) + (2.5 × 0.05)

= 0.40 + 1.05 + 0.75 + 0.45 + 0.125

= **2.775 / 5.0**

## Overall Risk Score: **2.8 / 5.0**

### Risk Tier: **MEDIUM RISK**

## Reassessment Triggers

1. Any Hyperliquid staking governance change that introduces automatic validator slashing.
2. Any kHYPE exploit or emergency pause activation.
3. Unstake queue latency >14 days sustained for >72h.
4. kHYPE discount >3% sustained for >24h.
5. Any privileged role threshold reduction or owner structure downgrade.
6. Major oracle or manager contract migration.

## Sources

- Kinetiq app: https://kinetiq.xyz/
- Kinetiq docs: https://kinetiq.xyz/docs
- kHYPE docs: https://docs.kinetiq.xyz/kinetiq-lsd/khype
- StakeHub docs: https://docs.kinetiq.xyz/kinetiq-lsd/stakehub
- Kinetiq FAQ (unstake period, fee, admin notes): https://docs.kinetiq.xyz/resources/faq
- Kinetiq contracts: https://docs.kinetiq.xyz/resources/contracts
- Kinetiq audits: https://docs.kinetiq.xyz/resources/audits
- Kinetiq bug bounty (Cantina): https://cantina.xyz/competitions/6f028672-6fbb-4fbe-9623-97457fc6531a
- CoinGecko kHYPE: https://www.coingecko.com/en/coins/kinetiq-staked-hype
- Hyperliquid staking docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking
- Hyperliquid validator prison docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking/validator-prison
- Hyperliquid risks docs: https://hyperliquid.gitbook.io/hyperliquid-docs/risks
