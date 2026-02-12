# Protocol Risk Assessment: Kinetiq kHYPE

**Assessment Date:** February 12, 2026
**Token:** kHYPE
**Chain:** HyperEVM (Hyperliquid L1 ecosystem)
**Token Address:** [`0xfd739d4e423301ce9385c1fb8850539d657c296d`](https://hyperliquid.cloud.blockscout.com/address/0xfd739d4e423301ce9385c1fb8850539d657c296d)

## Overview + Links

Kinetiq is a liquid staking protocol for HYPE on Hyperliquid L1. Users stake HYPE and receive `kHYPE`, a yield-bearing liquid staking token whose redemption value appreciates from staking rewards. kHYPE uses an exchange-rate model (not rebasing) — 1 kHYPE currently represents ~2.26 HYPE.

Kinetiq routes stake through a `StakingPool` contract that manages validator delegation, queue-based unstaking, and fee collection. Additional products include `vaultHYPE` / `xkHYPE` and Kinetiq Markets.

**Links:**

- [Kinetiq app](https://kinetiq.xyz/)
- [Kinetiq docs](https://docs.kinetiq.xyz/)
- [kHYPE docs](https://docs.kinetiq.xyz/kinetiq-lsd/khype)
- [StakeHub docs](https://docs.kinetiq.xyz/kinetiq-lsd/stakehub)
- [Contracts page](https://docs.kinetiq.xyz/resources/contracts)
- [Audits page](https://docs.kinetiq.xyz/resources/audits)
- [Kinetiq bug bounty (Cantina)](https://cantina.xyz/bounties/a98129d7-dd15-4c16-b2cb-d8cc42f87de4)
- [CoinGecko kHYPE](https://www.coingecko.com/en/coins/kinetiq-staked-hype)
- [DeFiLlama Kinetiq](https://defillama.com/protocol/kinetiq)

## Contract Addresses

All contracts are deployed on HyperEVM (Hyperliquid L1). Explorer: [Blockscout](https://hyperliquid.cloud.blockscout.com).

**On-chain verified contracts (have deployed bytecode):**

| Contract | Address | Type |
|----------|---------|------|
| kHYPE | [`0xfd739d4e423301ce9385c1fb8850539d657c296d`](https://hyperliquid.cloud.blockscout.com/address/0xfd739d4e423301ce9385c1fb8850539d657c296d) | Proxy (ERC-20 LST) |
| kHYPE Implementation | [`0xfe3216d46448efd7708435eeb851950742681975`](https://hyperliquid.cloud.blockscout.com/address/0xfe3216d46448efd7708435eeb851950742681975) | Implementation |
| kHYPE ProxyAdmin | [`0x9c1e8db004d8158a52e83ffdc63e37eabea8304c`](https://hyperliquid.cloud.blockscout.com/address/0x9c1e8db004d8158a52e83ffdc63e37eabea8304c) | EIP-1967 Admin |
| StakingPool (Minter/Burner) | [`0x393D0B87Ed38fc779FD9611144aE649BA6082109`](https://hyperliquid.cloud.blockscout.com/address/0x393D0B87Ed38fc779FD9611144aE649BA6082109) | Proxy |
| StakingPool Implementation | [`0x69d4c44398fc95bbe86755ea481b467fc6a09c84`](https://hyperliquid.cloud.blockscout.com/address/0x69d4c44398fc95bbe86755ea481b467fc6a09c84) | Implementation |
| StakingPool ProxyAdmin | [`0x8194aa9eca9225f96a690072b22a9ad0dd064f64`](https://hyperliquid.cloud.blockscout.com/address/0x8194aa9eca9225f96a690072b22a9ad0dd064f64) | EIP-1967 Admin |
| PauserRegistry | [`0x752E76ea71960Da08644614E626c9F9Ff5a50547`](https://hyperliquid.cloud.blockscout.com/address/0x752E76ea71960Da08644614E626c9F9Ff5a50547) | Proxy |
| PauserRegistry ProxyAdmin | [`0xd26c2c4a8bd4f78c64212318424ed794be120ea6`](https://hyperliquid.cloud.blockscout.com/address/0xd26c2c4a8bd4f78c64212318424ed794be120ea6) | EIP-1967 Admin |
| Governance Multisig | [`0x18A82c968b992D28D4D812920eB7b4305306f8F1`](https://hyperliquid.cloud.blockscout.com/address/0x18A82c968b992D28D4D812920eB7b4305306f8F1) | Gnosis Safe (4-of-7) |
| Treasury Multisig | [`0x64bD77698Ab7C3Fd0a1F54497b228ED7a02098E3`](https://hyperliquid.cloud.blockscout.com/address/0x64bD77698Ab7C3Fd0a1F54497b228ED7a02098E3) | Gnosis Safe (4-of-7) |

All three ProxyAdmin contracts are owned by the governance multisig (`0x18A82c...`). The **4-of-7 multisig can upgrade all contract implementations** without timelock.

**REVIEW NOTE:** The original PR listed 8 additional addresses (StakeHub `0x7f17...`, Withdrawal Queue `0x600a...`, Withdrawal Manager `0x95f4...`, Deposit Pool `0x2f5e...`, Kinetiq Oracle `0x14bf...`, Commission Manager `0x3f75...`, Pauser Registry `0x9077...`, Operator Registry `0x9f4d...`) sourced from docs. On-chain verification found **none of these addresses have deployed code** on HyperEVM — they return `0x` bytecode. These may be L1-side addresses or outdated/incorrect. The actual on-chain contracts discovered via proxy slot inspection and role enumeration are listed above.

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

Kinetiq hosts audit reports in a [Google Drive folder](https://drive.google.com/drive/folders/1T3ZGl6HNmt5LaKwdCmrA9HS7MsXheOys) (linked from `https://audits.kinetiq.xyz/`).

### kHYPE / staking-core relevant audits (verified from Google Drive)

| Date | Auditor | Scope | Link |
|---|---|---|---|
| Mar 2025 | Pashov Audit Group | kHYPE LST | [PDF](https://drive.google.com/file/d/1k9jA3JJ_e85AtI-EJRBdo-cq4JOvBok3/view) |
| Mar 2025 | Zenith | kHYPE LST | [PDF](https://drive.google.com/file/d/1S5Xm1rinC7kOt826eXhwrVbX7WtdwsWr/view) |
| Apr 2025 | Code4rena | kHYPE LST ($35K, 69+ wardens) | [Report](https://code4rena.com/audits/2025-04-kinetiq) |
| Jun 2025 | Spearbit | kHYPE LST | [PDF](https://drive.google.com/file/d/121JxhR9TpWGEoa1-GGm9fNbl3ByjOOhe/view) |
| Nov 2025 | Pashov Audit Group | kHYPE instant unstake | [PDF](https://drive.google.com/file/d/1ada6eazjmtatQIt38_QrZ3Nks7pYTly1/view) |

### Broader protocol audits (additional context)

| Date | Auditor | Scope | Link |
|---|---|---|---|
| Nov 2025 | Spearbit | kmHYPE | [PDF](https://drive.google.com/file/d/1uffwIAjfRDdCLCTpN66h1zK_Qji41Fr-/view) |
| Nov 2025 | Zenith | kmHYPE | [PDF](https://drive.google.com/file/d/1pMti8B4qM15-v61AyGe-hEdi8zcXR6at/view) |
| Jan 2026 | Spearbit | skNTQ | [PDF](https://drive.google.com/file/d/1LSZWM2sheoh1qeBqjkwkkl_1wO8gtI6H/view) |

Architecture complexity: high-moderate. kHYPE relies on multiple upgradeable proxy contracts (kHYPE token, StakingPool, PauserRegistry), which increases integration/control-plane risk compared to single-contract wrappers.

### Bug Bounty

- **Platform:** Cantina
- **Max Reward:** up to **$5,000,000** (Critical severity)
- **Scope:** kHYPE, StakingManager, StakingAccountant, ValidatorManager, PauserRegistry, OracleManager, OracleAdapter
- **Status:** Live since September 15, 2025; 294 findings submitted
- **Link:** https://cantina.xyz/bounties/a98129d7-dd15-4c16-b2cb-d8cc42f87de4

## Historical Track Record

- Listed on DeFiLlama since **July 17, 2025** (~7 months at assessment date).
- **Current TVL**: ~$683M (February 2026, per DeFiLlama).
- **Peak TVL**: ~$2.65B (October 4, 2025).
- **TVL trend**: Significant decline from peak, currently at ~26% of ATH. Likely driven by broader HYPE price movements.
- **CoinGecko market data**: kHYPE price $29.73, market cap ~$657M, 24h volume ~$12.8M. ATH $59.44 on September 18, 2025.
- **totalSupply (on-chain)**: 22,104,091.53 kHYPE.
- No Kinetiq entry found in [DeFiLlama Hacks database](https://defillama.com/hacks) or [Rekt News](https://rekt.news/).
- Shorter operating history and evolving module set (kHYPE + xkHYPE/skHYPE/kmHYPE) imply higher change risk.

## Funds Management

kHYPE manages deposited HYPE through a StakingPool contract and validator delegation, not a passive 1:1 wrapper.

### Accessibility

- Minting via stake flow is permissionless through app/contract path (`whitelistEnabled()` = false on-chain).
- Unstaking is queue-based, not instant.
- On-chain verified unstaking parameters:
  - **`withdrawalDelay()`**: 604,800 seconds = **7 days** exact
  - **`unstakeFeeRate()`**: 10 (0.10% in basis points)
  - `withdrawalPaused()`: false
  - `stakingPaused()`: false

### Collateralization

On-chain state (verified February 12, 2026):
- **kHYPE totalSupply**: 22,104,091.53 kHYPE
- **StakingPool totalStaked**: 50,013,410.11 HYPE
- **Implied exchange rate**: 1 kHYPE = 2.2626 HYPE
- **StakingPool liquid HYPE**: 203,958.26 HYPE (0.41% of totalStaked held as liquid buffer)
- **StakingPool kHYPE held**: 960,784.91 kHYPE
- **totalQueuedWithdrawals**: 971,460.09 HYPE
- **totalClaimed**: 27,987,503.62 HYPE

Economic backing is staked HYPE plus liquid reserves. Backing quality is primarily dependent on Hyperliquid validator set quality and staking outcomes. No off-chain custodial reserve model is disclosed for core kHYPE backing.

### Provability

- Core staking and token accounting are on-chain.
- Key on-chain readable functions verified: `totalSupply()`, `totalStaked()`, `totalQueuedWithdrawals()`, `totalClaimed()`, `withdrawalDelay()`, `unstakeFeeRate()`.
- Exchange rate is derived from totalStaked / totalSupply — updated via staking operations, not admin oracle.
- Contracts use OpenZeppelin AccessControlEnumerable (verified via `supportsInterface`). kHYPE supports EIP-2612 Permit.
- kHYPE is **not** ERC4626 (`convertToAssets`, `totalAssets`, `asset` all revert).

## Liquidity Risk

kHYPE exit routes:

1. Protocol unstake queue (primary deterministic exit)
- On-chain `withdrawalDelay()` = 7 days
- Fee-bearing exit path (0.10%)
- Queue delay can expand under stress

2. Secondary market liquidity (per DeFiLlama, February 2026)

**Total DEX liquidity: ~$44M** across 39 pools on HyperEVM DEXes.

Top DEX pools:

| DEX | Pair | TVL | 24h Volume |
|-----|------|-----|------------|
| Project X | WHYPE/KHYPE | $8,206,746 | $6,933,060 |
| Project X | USDT0/KHYPE | $2,337,679 | $312,037 |
| Ramses HL | WHYPE/KHYPE | $281,206 | $1,512,669 |
| HyperSwap V3 | WHYPE/KHYPE | $268,244 | $599,408 |

**Lending protocol deposits** dominate external kHYPE usage: ~$170M HyperLend, ~$215M Morpho, ~$27M Pendle. These are not exit liquidity.

All trading is DEX-based on HyperEVM. No centralized exchange listings found.

Given queue dependence and same-ecosystem DEX liquidity, kHYPE liquidity risk is materially higher than WHYPE but better than stHYPE (which has ~$403K DEX depth vs kHYPE's $44M).

## Centralization & Control Risks

### Governance

On-chain verified governance data:

- **Multisig address**: [`0x18A82c968b992D28D4D812920eB7b4305306f8F1`](https://hyperliquid.cloud.blockscout.com/address/0x18A82c968b992D28D4D812920eB7b4305306f8F1) (Gnosis Safe on HyperEVM)
- **Threshold**: **4-of-7** (verified via `getThreshold()`)
- **Version**: 1.3.0
- **Nonce**: 32 transactions executed
- **Timelock**: No timelock mechanism found on-chain.
- **Signer identities**: Not individually disclosed.

Signer addresses (verified via `getOwners()`):
1. [`0x99ed257a514d81A62C3195934d4e63A1c2C3946A`](https://hyperliquid.cloud.blockscout.com/address/0x99ed257a514d81A62C3195934d4e63A1c2C3946A)
2. [`0x6FF68aaac208d5765AD48293BeAAfb2c702D5B1d`](https://hyperliquid.cloud.blockscout.com/address/0x6FF68aaac208d5765AD48293BeAAfb2c702D5B1d)
3. [`0xF0B3a9BfF7b733bbF6B9FDcA20cC954dE5E8Aa77`](https://hyperliquid.cloud.blockscout.com/address/0xF0B3a9BfF7b733bbF6B9FDcA20cC954dE5E8Aa77)
4. [`0xFCADDD4395fbC10FB6FA024a427561C1841a0849`](https://hyperliquid.cloud.blockscout.com/address/0xFCADDD4395fbC10FB6FA024a427561C1841a0849)
5. [`0xDc1c4B5d08528a25A96ba036dDD6496FA2fb6947`](https://hyperliquid.cloud.blockscout.com/address/0xDc1c4B5d08528a25A96ba036dDD6496FA2fb6947)
6. [`0x9bD23f6e1012D490FaEE8C81d3bad9D4e4F71624`](https://hyperliquid.cloud.blockscout.com/address/0x9bD23f6e1012D490FaEE8C81d3bad9D4e4F71624)
7. [`0x64cbeD11Afe88631b7B6C12D8B50E59E8E07f42e`](https://hyperliquid.cloud.blockscout.com/address/0x64cbeD11Afe88631b7B6C12D8B50E59E8E07f42e)

**Role structure (verified via AccessControlEnumerable):**

| Contract | Role | Holder |
|----------|------|--------|
| kHYPE | DEFAULT_ADMIN | Governance Multisig (4/7) |
| kHYPE | MINTER | StakingPool (`0x393D...`) |
| kHYPE | BURNER | StakingPool (`0x393D...`) |
| StakingPool | DEFAULT_ADMIN | Governance Multisig (4/7) |
| StakingPool | MANAGER | Governance Multisig (4/7) |
| StakingPool | OPERATOR | `0x23A4604cDFe8e9e2e9Cf7C10D7492B0F3f4B4038` (EOA) |
| PauserRegistry | DEFAULT_ADMIN | Governance Multisig (4/7) |

**Key concern:** The OPERATOR role on the StakingPool is held by a single **EOA** (`0x23A4...`), not the multisig. This role likely controls operational staking/delegation functions. This is a centralization risk point.

### Programmability

- Hybrid on-chain system with multiple upgradeable proxy contracts.
- Exchange rate is derived from on-chain state (totalStaked / totalSupply), not admin-set.
- StakingPool has significant admin functions: `pauseWithdrawal()`, `pauseStaking()`, `setWithdrawalDelay()`, `setUnstakeFeeRate()`, `executeEmergencyWithdrawal()`, `rescueToken()`.
- Emergency withdrawal and token rescue capabilities exist — powerful admin functions.

### External Dependencies

Critical dependencies:
1. Hyperliquid L1 consensus/liveness.
2. Hyperliquid validator performance and staking/slashing rules.
3. HyperEVM execution environment.
4. DEX liquidity conditions for kHYPE/HYPE exits.

Dependency concentration on Hyperliquid ecosystem is structurally high.

## Operational Risk

- Docs are present at docs.kinetiq.xyz but use client-side rendering (GitBook), making content verification difficult.
- Audit depth is reasonable for protocol age (5 core audits from 4 firms).
- Bug bounty at $5M max is strong and has 294 submissions.
- Team transparency: TODO — team identities not individually disclosed. Twitter: [@Kinetiq_xyz](https://twitter.com/Kinetiq_xyz).
- Contracts are **not open-source on GitHub** — the Kinetiq GitHub org (`github.com/kinetiq-research`) has only SDK/utility repos, no smart contract code.
- No public formal verification disclosure found.

## Monitoring

Key contracts to monitor:
- kHYPE Proxy: [`0xfd739d4e423301ce9385c1fb8850539d657c296d`](https://hyperliquid.cloud.blockscout.com/address/0xfd739d4e423301ce9385c1fb8850539d657c296d)
- StakingPool Proxy: [`0x393D0B87Ed38fc779FD9611144aE649BA6082109`](https://hyperliquid.cloud.blockscout.com/address/0x393D0B87Ed38fc779FD9611144aE649BA6082109)
- PauserRegistry Proxy: [`0x752E76ea71960Da08644614E626c9F9Ff5a50547`](https://hyperliquid.cloud.blockscout.com/address/0x752E76ea71960Da08644614E626c9F9Ff5a50547)
- Governance Multisig: [`0x18A82c968b992D28D4D812920eB7b4305306f8F1`](https://hyperliquid.cloud.blockscout.com/address/0x18A82c968b992D28D4D812920eB7b4305306f8F1) (Gnosis Safe 4-of-7)

### 1. Governance Monitoring (MANDATORY)

Monitor all privileged role actions and parameter changes for:
- RoleGranted / RoleRevoked events on kHYPE and StakingPool (AccessControl)
- Upgraded events on proxy contracts (implementation changes)
- AddedOwner / RemovedOwner / ChangedThreshold on Governance Safe

Immediate alerts:
- ownership/multisig signer changes
- threshold changes
- implementation upgrades
- emergency pause activations
- parameter changes (withdrawalDelay, unstakeFeeRate, stakingLimit)

### 2. Backing & Supply Monitoring (MANDATORY)

Track:
- `kHYPE.totalSupply()` (currently 22.1M)
- `StakingPool.totalStaked()` (currently 50.0M HYPE)
- Implied exchange rate trend
- StakingPool native HYPE balance (liquid buffer)

Alert thresholds:
- backing ratio drift >1% in 24h (unless expected market event)
- liquid buffer drops below 50K HYPE

### 3. Queue Health Monitoring (MANDATORY)

Track:
- `StakingPool.totalQueuedWithdrawals()` (currently 971K HYPE)
- queue size and average wait time
- daily enqueue/dequeue flow

Alert thresholds:
- average unstake latency >10 days sustained
- queue size growth >30% day-over-day

### 4. Market Liquidity Monitoring

Track:
- kHYPE/HYPE and kHYPE/stable liquidity depth on Project X, Ramses, HyperSwap
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

1. Significant TVL (~$683M) and DeFi integration (~$493M across 52 pools).
2. 5 core audits from reputable firms (Pashov, Zenith, Code4rena, Spearbit) across 2025.
3. Active Cantina bug bounty with $5M maximum and 294 submissions.
4. On-chain verifiable staking economics with AccessControl role enumeration.
5. 4-of-7 multisig governance (stronger than many DeFi protocol minimums).

### Key Risks

1. Queue-based unstake path (7 days on-chain) introduces redemption delay risk.
2. Multi-contract upgradeable proxy architecture adds integration and control-plane complexity.
3. OPERATOR role on StakingPool held by single EOA (not multisig).
4. No timelock on multisig — upgrades can be executed immediately.
5. Heavy dependence on Hyperliquid validator and chain health.
6. Contracts not open-sourced on GitHub.

### Critical Risks

- No current critical gate failure identified.
- Primary tail scenario is correlated chain/validator stress + queue congestion + market discount widening.
- `executeEmergencyWithdrawal()` and `rescueToken()` functions give admin significant power over funds.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** -> **PASS** (5 core audits from 4 reputable firms)
- [x] **Unverifiable reserves** -> **PASS** (on-chain staking model with readable state)
- [x] **Total centralization** -> **PASS** (4-of-7 multisig, not single EOA)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- 5 core audits by reputable firms (Pashov x2, Zenith, Code4rena, Spearbit) from Mar-Nov 2025.
- Cantina bug bounty at $5M max with 294 submissions. High bug bounty (>$5M) reduces score by 0.5.
- ~7 months in production, TVL ~$683M (peaked ~$2.65B).
- Per rubric: 3+ audits by top firms, active bug bounty >$1M -> score 1 range for audits. 6-12 months, TVL >$100M fits score 2-3 for track record. Net: 1.5 + track record penalty.

**Score: 2.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

Subscores:
- Governance: **3.5** — 4-of-7 multisig (verified on-chain), but no timelock, signer identities undisclosed, powerful admin functions (emergency withdrawal, rescue, parameter changes). Per rubric: "Multisig 3/5 or low threshold" (4/7 is between 3 and 4 tier) + "No timelock" + "Powerful admin roles" = score 3.5.
- Programmability: **3.0** — Hybrid on-chain system with upgradeable proxies. Exchange rate is on-chain derived (not admin-set). But OPERATOR EOA and admin parameter controls add centralization.
- External dependencies: **4.0** — Critical single-ecosystem dependency on Hyperliquid L1. Failure of Hyperliquid would break the entire protocol.

Centralization score = (3.5 + 3.0 + 4.0) / 3 = **3.5**

**Score: 3.5/5**

#### Category 3: Funds Management (Weight: 30%)

Subscores:
- Collateralization: **2.0** — 100% on-chain collateral (staked HYPE). Liquid buffer only 0.41% of totalStaked. Collateral quality = single-asset (HYPE), high quality within Hyperliquid ecosystem. Exchange rate verified at 2.26x.
- Provability: **2.5** — Key state readable on-chain via AccessControlEnumerable. Exchange rate derived programmatically. However, contracts not open-source limits independent verification. Some operational complexity around validator delegation not fully transparent.

Funds management score = (2.0 + 2.5) / 2 = **2.25**

**Score: 2.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Queue-based withdrawals: 7-day standard unstaking period (verified on-chain).
- DEX liquidity is moderate: ~$44M total across 39 pools. Largest pool ~$8.2M with $6.9M daily volume.
- All liquidity is on HyperEVM DEXes — no CEX listings.
- Per rubric: "Market-based or short queues" + ">$1M, 1-3% slippage" + "3-7 days for full exit" = score 3. Same-value asset mitigates somewhat.

**Score: 3.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Docs present but client-side rendered (verification difficult).
- Audits and bounty are strong for protocol age.
- Team transparency: unknown/anon. Contracts not open-source on GitHub.
- No public incident response plan documented.

**Score: 3.0/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **2.725 / 5.0** |

## Overall Risk Score: **2.7 / 5.0**

### Risk Tier: **MEDIUM RISK**

Rationale:
- kHYPE is a well-audited LST with significant TVL ($683M) and DeFi adoption.
- Governance is reasonable (4-of-7 multisig) but lacks timelock and signer transparency.
- Single-EOA OPERATOR role and powerful emergency functions are centralization concerns.
- Liquidity is decent for an LST ($44M DEX depth) but all on HyperEVM.
- Strong single-ecosystem dependency on Hyperliquid L1.

## Reassessment Triggers

- **Time-based**: Reassess in 3 months
- **TVL-based**: Reassess if TVL changes by more than 50%
1. Any Hyperliquid staking governance change that introduces automatic validator slashing.
2. Any kHYPE exploit or emergency pause activation.
3. Unstake queue latency >10 days sustained for >72h.
4. kHYPE discount >3% sustained for >24h.
5. Any privileged role threshold reduction or owner structure downgrade.
6. Major contract migration or implementation upgrade.
7. OPERATOR EOA change or role reassignment.
8. Timelock implementation (positive trigger — would warrant score improvement).

## Sources

- Kinetiq app: https://kinetiq.xyz/
- Kinetiq docs: https://docs.kinetiq.xyz/
- kHYPE docs: https://docs.kinetiq.xyz/kinetiq-lsd/khype
- StakeHub docs: https://docs.kinetiq.xyz/kinetiq-lsd/stakehub
- Kinetiq FAQ: https://docs.kinetiq.xyz/resources/faq
- Kinetiq contracts: https://docs.kinetiq.xyz/resources/contracts
- Kinetiq audits: https://docs.kinetiq.xyz/resources/audits
- Kinetiq audit PDFs (Google Drive): https://drive.google.com/drive/folders/1T3ZGl6HNmt5LaKwdCmrA9HS7MsXheOys
- Code4rena Kinetiq audit: https://code4rena.com/audits/2025-04-kinetiq
- Kinetiq bug bounty (Cantina): https://cantina.xyz/bounties/a98129d7-dd15-4c16-b2cb-d8cc42f87de4
- CoinGecko kHYPE: https://www.coingecko.com/en/coins/kinetiq-staked-hype
- DeFiLlama Kinetiq: https://defillama.com/protocol/kinetiq
- Hyperliquid staking docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking
- Hyperliquid validator prison docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hype-staking/validator-prison
- Hyperliquid risks docs: https://hyperliquid.gitbook.io/hyperliquid-docs/risks
- On-chain verification via `cast` against HyperEVM RPC (`rpc.hyperliquid.xyz/evm`)
