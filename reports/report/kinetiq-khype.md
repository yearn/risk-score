# Protocol Risk Assessment: Kinetiq kHYPE

- **Assessment Date:** May 19, 2026
- **Token:** kHYPE
- **Chain:** HyperEVM (Hyperliquid L1 ecosystem)
- **Token Address:** [`0xfd739d4e423301ce9385c1fb8850539d657c296d`](https://hyperevmscan.io/address/0xfd739d4e423301ce9385c1fb8850539d657c296d)
- **Final Score: 2.30/5.0**

## Overview + Links

Kinetiq is a liquid staking protocol for HYPE on Hyperliquid L1. Users stake HYPE and receive `kHYPE`, a yield-bearing liquid staking token whose redemption value appreciates from staking rewards. kHYPE uses an exchange-rate model (not rebasing) — 1 kHYPE currently redeems for **1.0183 HYPE** (verified onchain via `StakingAccountant.kHYPEToHYPE(1e18)`).

Kinetiq routes stake through a `StakingPool` contract that manages validator delegation, queue-based unstaking, and fee collection. On 2026-04-07 the StakingPool was upgraded to a Diamond/facet architecture (`StakingManagerRouter`) introducing a quick-withdrawal path (~36h) and an `InstantUnstakePool`. Additional products include `vaultHYPE` / `xkHYPE` and Kinetiq Markets.

**Links:**

- [Kinetiq app](https://kinetiq.xyz/)
- [Kinetiq docs](https://docs.kinetiq.xyz/)
- [kHYPE docs](https://kinetiq.xyz/docs/khype)
- [StakeHub docs](https://kinetiq.xyz/docs/stakehub)
- [Contracts page](https://kinetiq.xyz/docs/contracts-and-audits)
- [Audits page](https://kinetiq.xyz/docs/contracts-and-audits)
- [Kinetiq bug bounty (Cantina)](https://cantina.xyz/bounties/a98129d7-dd15-4c16-b2cb-d8cc42f87de4)
- [CoinGecko kHYPE](https://www.coingecko.com/en/coins/kinetiq-staked-hype)
- [DeFiLlama Kinetiq](https://defillama.com/protocol/kinetiq)

## Contract Addresses

All contracts are deployed on HyperEVM (Hyperliquid L1). Explorer: [HyperEVMScan](https://hyperevmscan.io).

**Onchain verified contracts (have deployed bytecode):**

| Contract | Address | Type |
|----------|---------|------|
| kHYPE | [`0xfd739d4e423301ce9385c1fb8850539d657c296d`](https://hyperevmscan.io/address/0xfd739d4e423301ce9385c1fb8850539d657c296d) | Proxy (ERC-20 LST) |
| kHYPE Implementation | [`0xfe3216d46448efd7708435eeb851950742681975`](https://hyperevmscan.io/address/0xfe3216d46448efd7708435eeb851950742681975) | Implementation |
| kHYPE ProxyAdmin | [`0x9c1e8db004d8158a52e83ffdc63e37eabea8304c`](https://hyperevmscan.io/address/0x9c1e8db004d8158a52e83ffdc63e37eabea8304c) | EIP-1967 Admin |
| StakingPool (Minter/Burner) | [`0x393D0B87Ed38fc779FD9611144aE649BA6082109`](https://hyperevmscan.io/address/0x393D0B87Ed38fc779FD9611144aE649BA6082109) | Proxy |
| StakingPool Implementation (`StakingManagerRouter`) | [`0x23fda3b9f944dbeaf2dcd5e7b9f8207b102c933f`](https://hyperevmscan.io/address/0x23fda3b9f944dbeaf2dcd5e7b9f8207b102c933f) | Implementation (upgraded 2026-04-07) |
| StakingPool ProxyAdmin | [`0x8194aa9eca9225f96a690072b22a9ad0dd064f64`](https://hyperevmscan.io/address/0x8194aa9eca9225f96a690072b22a9ad0dd064f64) | EIP-1967 Admin |
| PauserRegistry | [`0x752E76ea71960Da08644614E626c9F9Ff5a50547`](https://hyperevmscan.io/address/0x752E76ea71960Da08644614E626c9F9Ff5a50547) | Proxy |
| PauserRegistry Implementation | [`0x85776d01dc61a9685c315443c9e2f449472c2e22`](https://hyperevmscan.io/address/0x85776d01dc61a9685c315443c9e2f449472c2e22) | Implementation (upgraded 2026-04-07) |
| PauserRegistry ProxyAdmin | [`0xd26c2c4a8bd4f78c64212318424ed794be120ea6`](https://hyperevmscan.io/address/0xd26c2c4a8bd4f78c64212318424ed794be120ea6) | EIP-1967 Admin |
| StakingAccountant (Proxy) | [`0x9209648Ec9D448EF57116B73A2f081835643dc7A`](https://hyperevmscan.io/address/0x9209648Ec9D448EF57116B73A2f081835643dc7A) | Aggregator (kHYPE↔HYPE conversion) |
| ValidatorManager | [`0x4b797A93DfC3D18Cf98B7322a2b142FA8007508f`](https://hyperevmscan.io/address/0x4b797A93DfC3D18Cf98B7322a2b142FA8007508f) | Delegation engine |
| OracleManager | [`0x192826e470bd65FDC2CB472eDd834D096233049b`](https://hyperevmscan.io/address/0x192826e470bd65FDC2CB472eDd834D096233049b) | Validator performance oracle |
| RewardShareTracker | [`0xE5FbA07C7b3CfbC29633f3D3Ab38b36007F35983`](https://hyperevmscan.io/address/0xE5FbA07C7b3CfbC29633f3D3Ab38b36007F35983) | Reward distribution |
| InstantUnstakePool | [`0x665b67793594fc5C251a3C95cbEb4B6245Cd2123`](https://hyperevmscan.io/address/0x665b67793594fc5C251a3C95cbEb4B6245Cd2123) | Instant-unstake liquidity pool |
| FacetRegistry | [`0x4841eCC9Ffb18aEA197E4d1dd1633cEA5e834225`](https://hyperevmscan.io/address/0x4841eCC9Ffb18aEA197E4d1dd1633cEA5e834225) | Diamond facet registry (7 facets) |
| Governance Multisig | [`0x18A82c968b992D28D4D812920eB7b4305306f8F1`](https://hyperevmscan.io/address/0x18A82c968b992D28D4D812920eB7b4305306f8F1) | Gnosis Safe (4-of-8) |
| Treasury Multisig | [`0x64bD77698Ab7C3Fd0a1F54497b228ED7a02098E3`](https://hyperevmscan.io/address/0x64bD77698Ab7C3Fd0a1F54497b228ED7a02098E3) | Gnosis Safe (4-of-7) |

All three ProxyAdmin contracts are owned by the [`Governance Multisig`](https://hyperevmscan.io/address/0x18A82c968b992D28D4D812920eB7b4305306f8F1) (verified onchain). The **4-of-8 multisig can upgrade all contract implementations** without timelock.

**Architecture (2026-04-07 upgrade).** StakingPool and PauserRegistry were upgraded in a single transaction ([`0xe0d05afb…0478a0`](https://hyperevmscan.io/tx/0xe0d05afb1df4ee892f3f08bdea052fdfcdb604109574b7efeb21fc0fbf0478a0)). StakingPool runs on a Diamond/facet architecture (`StakingManagerRouter`, 7 facets in `FacetRegistry`) and exposes a `quickWithdrawalDelay()` of **36 hours** plus an `InstantUnstakePool` alongside the standard 7-day withdrawal queue.

## How Hyperliquid Staking Works (Context)

Hyperliquid staking is validator-based. HYPE is delegated to validators, and rewards depend on validator performance and network-level staking parameters.

Important slashing context (as of February 12, 2026, per official Hyperliquid docs):
- **No automatic slashing is implemented** ("There is currently no automatic slashing implemented").
- Slashing is "reserved for provably malicious behavior such as double-signing blocks at the same round."
- Validator penalties are jailing-only: jailed validators produce no rewards for delegators, but no principal loss occurs.
- Validators may be jailed by peer quorum vote for inadequate latency/frequency of consensus messages.
- Jailed validators can unjail themselves subject to onchain rate limits.
- Self-delegation requirement: 10,000 HYPE (locked 1 year). Delegation lockup: 1 day.
- Unstaking queue (staking → spot): **7 days**. Max 5 pending withdrawals per address.
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
- **Status:** Live since September 15, 2025; **387** findings submitted (as of May 2026)
- **Link:** https://cantina.xyz/bounties/a98129d7-dd15-4c16-b2cb-d8cc42f87de4

## Historical Track Record

- Listed on DeFiLlama since **July 17, 2025** (~10 months at assessment date).
- **Current TVL**: ~$932M (May 19, 2026, per DeFiLlama) — up ~36% over the last quarter.
- **Peak TVL**: ~$2.65B (October 4, 2025).
- **CoinGecko market data**: kHYPE price $49.57, market cap ~$863M, 24h volume ~$3.67M. ATH $59.44 on September 18, 2025.
- **totalSupply (onchain)**: 17,406,215.90 kHYPE.
- No Kinetiq entry found in [DeFiLlama Hacks database](https://defillama.com/hacks) or [Rekt News](https://rekt.news/).
- Evolving module set (kHYPE + xkHYPE/skHYPE/kmHYPE + April 2026 StakingPool facet refactor) maintains a moderate-to-high change-risk profile.

## Funds Management

kHYPE manages deposited HYPE through a StakingPool contract and validator delegation, not a passive 1:1 wrapper.

### Accessibility

- Minting via stake flow is permissionless through app/contract path (`whitelistEnabled()` = false onchain).
- Three exit paths:
  1. **Standard queue**: `withdrawalDelay()` = 604,800 sec = **7 days**.
  2. **Quick withdrawal**: `quickWithdrawalDelay()` = 129,600 sec = **36 hours**.
  3. **Instant unstake** via [`InstantUnstakePool`](https://hyperevmscan.io/address/0x665b67793594fc5C251a3C95cbEb4B6245Cd2123) (currently 41,837 HYPE liquid).
- Onchain verified parameters:
  - **`unstakeFeeRate()`**: **0** — no exit fee.
  - **`minStakeAmount()`**: 5 HYPE
  - `withdrawalPaused()`: false
  - `stakingPaused()`: false

### Collateralization

Onchain state (verified May 19, 2026 at block 35,538,772):
- **kHYPE totalSupply**: 17,406,215.90 kHYPE
- **StakingAccountant `totalStaked`**: 51,060,869.82 HYPE (cumulative deposits-equivalent)
- **StakingAccountant `totalClaimed`**: 33,800,215.76 HYPE (cumulative withdrawn)
- **StakingAccountant `totalRewards`**: 463,562.86 HYPE
- **StakingAccountant `totalSlashing`**: 0
- **Exchange rate (`kHYPEToHYPE(1e18)`)**: 1.018269 HYPE per kHYPE
- **Net HYPE backing** (`totalStaked − totalClaimed + totalRewards`): 17,724,217 HYPE
  - L1 delegated to validators: 16,932,424 HYPE
  - L1 pending withdrawal: 638,801 HYPE (5 active queued positions)
  - EVM liquid (StakingPool contract): 112,061 HYPE
  - InstantUnstakePool liquidity: 41,837 HYPE
  - **Sum: 17,725,123 HYPE** (matches accountant within ~900 HYPE rounding) ✓
- **totalQueuedWithdrawals (EVM)**: 768,741 HYPE
- **StakingPool kHYPE held** (mid-flight burns): 755,564 kHYPE

Economic backing is fully onchain: ~95.5% delegated to L1 validators, ~3.6% in pending unstaking, the remainder as EVM-side liquid HYPE for the instant/quick withdrawal paths. No offchain custodial reserve model is disclosed.

### Provability

- Core staking and token accounting are onchain.
- All core contracts (kHYPE, StakingPool, PauserRegistry, StakingAccountant, ValidatorManager, OracleManager, RewardShareTracker, InstantUnstakePool and their implementations) are **source-code verified on HyperEVMScan** (exact match).
- Key onchain readable functions verified: `totalSupply()`, `StakingAccountant.totalStaked/totalClaimed/totalRewards/totalSlashing`, `kHYPEToHYPE`, `HYPEToKHYPE`, `withdrawalDelay`, `quickWithdrawalDelay`, `unstakeFeeRate`, role enumeration via `AccessControlEnumerable`.
- Exchange rate is derived from onchain accountant state, not admin-set.
- Contracts use OpenZeppelin AccessControlEnumerable. kHYPE supports EIP-2612 Permit.
- kHYPE is **not** ERC4626 (`convertToAssets`, `totalAssets`, `asset` all revert).

## Liquidity Risk

kHYPE exit routes:

1. Protocol unstake queue (primary deterministic exit)
- Onchain `withdrawalDelay()` = 7 days; `quickWithdrawalDelay()` = 36 hours
- `unstakeFeeRate()` = 0 — fee-free exits
- Queue delay can expand under stress; instant path is capacity-limited by `InstantUnstakePool` liquidity (~42K HYPE currently)

2. Secondary market liquidity (per GeckoTerminal + DeFiLlama, May 19, 2026)

**Total kHYPE DEX liquidity: ~$8.6M** across 40 pools on HyperEVM DEXes.

Top DEX pools:

| DEX | Pair | TVL | 24h Volume |
|-----|------|-----|------------|
| Nest (v1) | kHYPE/WHYPE (0.01%) | $3,353,501 | $613,747 |
| Project X | kHYPE/WHYPE (0.01%) | $2,799,621 | $714,835 |
| Ramses v3 (HL) | kHYPE/WHYPE (0.008%) | $233,149 | $1,274,932 |
| Project X | USD₮0/kHYPE (0.3%) | $192,132 | $180,851 |
| Project X | UBTC/kHYPE (0.3%) | $160,863 | $154,000 |
| HyperSwap v3 | kHYPE/WHYPE (0.01%) | $245,062 | $16,719 |

**Lending protocol deposits** dominate external kHYPE usage: ~$304M HyperLend, ~$180M Morpho Blue across 5 markets, ~$5.7M HypurrFi, ~$4.8M Felix CDP, ~$1.7M Harmonix, ~$0.8M Euler v2. These are not exit liquidity. No Pendle kHYPE market is currently listed on DeFiLlama.

All trading is DEX-based on HyperEVM. No centralized exchange listings found.

Stress-exit scenarios rely primarily on the protocol's three-tier queue (instant pool → 36h quick path → 7d standard) rather than DEX depth.

## Centralization & Control Risks

### Governance

Onchain verified governance data (May 19, 2026):

- **Multisig address**: [`Governance Multisig`](https://hyperevmscan.io/address/0x18A82c968b992D28D4D812920eB7b4305306f8F1) (Gnosis Safe on HyperEVM)
- **Threshold**: **4-of-8** (verified via `getThreshold()`). `ChangedThreshold` event count over all history: 0.
- **Version**: 1.3.0
- **Nonce**: 59 transactions executed.
- **Timelock**: **None.** Verified onchain — Safe has no modules (`getModulesPaginated` returns empty array), no guard (storage slot `0x4a204f…c34c8` is zero), all three ProxyAdmins are standard OpenZeppelin (881 bytes, owned directly by multisig), and no `EnabledModule` events have ever been emitted.
- **Signer identities**: All 8 signers are pseudonymous.

**Role structure (verified via AccessControlEnumerable on May 19, 2026):**

| Contract | Role | Holder(s) |
|----------|------|-----------|
| kHYPE | DEFAULT_ADMIN | Governance Multisig (4/8) |
| kHYPE | MINTER | [`StakingPool`](https://hyperevmscan.io/address/0x393D0B87Ed38fc779FD9611144aE649BA6082109) |
| kHYPE | BURNER | [`StakingPool`](https://hyperevmscan.io/address/0x393D0B87Ed38fc779FD9611144aE649BA6082109) |
| StakingPool | DEFAULT_ADMIN | Governance Multisig (4/8) |
| StakingPool | MANAGER | Governance Multisig (4/8) |
| StakingPool | OPERATOR | [`OPERATOR EOA`](https://hyperevmscan.io/address/0x23A4604cDFe8e9e2e9Cf7C10D7492B0F3f4B4038) |
| StakingPool | SENTINEL | (no members — role defined but unassigned) |
| StakingPool | TREASURY | (no members — role defined but unassigned) |
| PauserRegistry | DEFAULT_ADMIN | Governance Multisig (4/8) |
| PauserRegistry | PAUSER | Governance Multisig (4/8) |
| StakingAccountant | MANAGER | Governance Multisig (4/8) — sole authorized manager mapping (StakingPool → kHYPE) |

`SENTINEL_ROLE` and `TREASURY_ROLE` exist on the StakingPool but currently have zero members onchain.

**Key concern:** The OPERATOR role on the StakingPool is held by a single **EOA** ([`OPERATOR EOA`](https://hyperevmscan.io/address/0x23A4604cDFe8e9e2e9Cf7C10D7492B0F3f4B4038)), not the multisig. This address is a Kinetiq automated bot (nonce 9,755) calling `generatePerformance()` and `updateValidatorMetrics()` on a regular basis.

### Programmability

- Hybrid onchain system with multiple upgradeable proxy contracts.
- Exchange rate is derived from onchain state (`StakingAccountant.kHYPEToHYPE`), not admin-set.
- StakingPool has significant admin functions: `pauseWithdrawal()`, `pauseStaking()`, `setWithdrawalDelay()`, `setUnstakeFeeRate()`, `executeEmergencyWithdrawal()`, `rescueToken()`. Emergency withdrawal and token rescue are powerful admin functions.
- **Diamond/facet architecture** for the StakingPool: a `FacetRegistry` ([`0x4841…4225`](https://hyperevmscan.io/address/0x4841eCC9Ffb18aEA197E4d1dd1633cEA5e834225)) routes calls across 7 facet contracts. The implementation (`StakingManagerRouter`) is source-verified on HyperEVMScan and was preceded by the Nov 2025 Pashov instant-unstake audit.

### External Dependencies

Critical dependencies:
1. Hyperliquid L1 consensus/liveness.
2. Hyperliquid validator performance and staking/slashing rules.
3. HyperEVM execution environment.
4. DEX liquidity conditions for kHYPE/HYPE exits.

Dependency concentration on Hyperliquid ecosystem is structurally high. **HyperEVM is NOT a separate chain** — it shares the same HyperBFT consensus as HyperCore. There is no bridge risk between HyperCore and HyperEVM; the risk is pure L1 liveness.

**Important:** Hyperliquid is a highly centralized chain — Hyper Foundation controls **54.83%** of validator stake via 5 validators, well in excess of the 1/3 BFT blocking minority. HYPE staking cannot be considered as safe as ETH staking, where validator set decentralization is significantly stronger (~1M validators, no single entity near blocking minority). This network-level centralization risk is inherited by kHYPE and should be weighed accordingly, even though Kinetiq's own delegations no longer flow to HF validators.

### Hyperliquid Validator Set Dependency (Quantified)

Source: Hyperliquid L1 API (`POST https://api.hyperliquid.xyz/info`, queries `validatorSummaries`, `delegations`, `delegatorSummary`)

Verify validator data: [Hyperliquid Staking Portal](https://app.hyperliquid.xyz/staking) | [Validator Performance](https://app.hyperliquid.xyz/staking/validatorPerformance) | [HypurrScan Staking](https://hypurrscan.io/staking)

**Network overview (May 19, 2026):**

| Metric | Value |
|--------|-------|
| Total validators | 31 (24 active, 4 jailed, 3 inactive) |
| Total network stake | 435.3M HYPE |
| Active stake | 427.6M HYPE |
| Jailed stake | 37,138 HYPE (0.01%) |

**Concentration risk:**
- **Hyper Foundation operates 5 validators** controlling **54.83%** of active stake (~234.4M HYPE), still exceeding the **1/3 blocking minority** for BFT consensus.
- Top 5 validators (4 HF + Nansen x HypurrCollective) = 57.2% of active stake.
- Top 10 validators = 79.5% of active stake.
- Kinetiq represents **~3.96% of total network stake**.

**Kinetiq's delegation strategy:**
- L1 `delegatorSummary` for StakingPool: 16,932,424 delegated; 638,801 pending withdrawal across 5 positions; ~0 undelegated.
- Delegations are spread across **15 validators**. Most non-anchor validators receive a uniform ~586,904 HYPE allocation.
- **Zero delegations to Hyper Foundation validators.**

| Validator | Delegation (HYPE) | % of Kinetiq | Lock Status |
|-----------|-------------------|-------------|-------------|
| HyperStake | 5,003,483 | **29.55%** | Unlocked |
| **Kinetiq x Hyperion** (own) | 4,227,833 | **24.97%** | Locked |
| Purrposeful x HyBridge x PiP | 622,799 | 3.68% | Unlocked |
| Nansen x HypurrCollective | 621,875 | 3.67% | Unlocked |
| Bitwise Onchain Solutions x FalconX | 587,271 | 3.47% | Unlocked |
| infinitefield.xyz | 587,022 | 3.47% | Unlocked |
| ASXN | 586,909 | 3.47% | Unlocked |
| CMI | 586,905 | 3.47% | Unlocked |
| Anchorage By Figment | 586,904 | 3.47% | Unlocked |
| Flowdex | 586,904 | 3.47% | Unlocked |
| B-Harvest | 586,904 | 3.47% | Unlocked |
| Imperator.co - HypeRPC.app | 586,904 | 3.47% | Unlocked |
| USDT0 x Luganodes | 586,904 | 3.47% | Unlocked |
| HypurrCorea: SKYGG x DeSpread | 586,904 | 3.47% | Unlocked |
| Liquid Spirit x Hydromancer x Rekt Gan | 586,904 | 3.47% | Unlocked |

- **0% of Kinetiq delegations go to Hyper Foundation validators.**
- All delegated validators are active with no current jailing exposure.

**Slashing/jailing context:**
- **No automatic slashing is implemented** on Hyperliquid (per [official docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking)). However, slashing may be enforced in the future and must be considered a forward-looking risk if Kinetiq delegates to validators that suffer a slashing event (per [Kinetiq risk disclosures](https://kinetiq.xyz/stake-hype#what-are-the-potential-risks)).
- Jailing = reward cessation only, no principal loss. Jailed validators visible on [Hyperliquid Staking Portal](https://app.hyperliquid.xyz/staking).
- Validators can be jailed by peer vote for latency/responsiveness issues (see [validator prison docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking)).
- Unstaking queue from L1 validators: **7 days**.

**L1 incident history:** No Hyperliquid L1 consensus or liveness incidents found in the DeFiLlama hacks database. Three HyperEVM application-level exploits were recorded (HyperVault $3.6M rugpull, Hyperdrive $773K router exploit, Raga Finance $18.5K exploit) — none affecting L1 itself.

## Operational Risk

- Audit depth is strong for protocol age (8 audits from 4 firms, including coverage of the April 2026 instant-unstake architecture).
- Bug bounty at $5M max is strong and has **387** submissions.
- **Team/legal entity:** Two entity names are used inconsistently — **"Kinetiq Labs"** (Terms of Use) vs **"Kinetiq Research"** (Privacy Policy, GitHub org, footer copyright). GitHub org lists **Singapore** as location; Privacy Policy references **Panama** for data transfers. Terms of Use do not name a governing law jurisdiction. No registered address or company registration number is publicly disclosed.
- **Known team members** (via GitHub commit history on `github.com/kinetiq-research`):
  - **Justin Greenberg** ([@justingreenberg](https://github.com/justingreenberg), Twitter: @greenbergz) — primary developer on `f1rewall` repo, PGP-signed commits.
  - **GregTheDev** ([@0xgregthedev](https://github.com/0xgregthedev)) — Rust/Solidity developer, primary contributor to `hl-rs` (Hyperliquid Rust SDK). `gregthedev.eth` funded governance Safe Signer 2.
  - **mektigboy** ([@mektigboy](https://github.com/mektigboy), Twitter: @mektigboy) — self-identified "driver @kinetiq-research" in GitHub bio. Prior experience with sherlock-audit and security audit orgs.
- Contact: security@kinetiq.xyz (with PGP key at `kinetiq.xyz/.well-known/pubkey.asc`), contact@kinetiq.xyz, info@kinetiq.xyz.
- No public "About" or "Team" page exists on kinetiq.xyz or docs.kinetiq.xyz. Twitter: [@Kinetiq_xyz](https://twitter.com/Kinetiq_xyz).
- Contracts are **not open-source on GitHub** — the Kinetiq GitHub org (`github.com/kinetiq-research`) has only SDK/utility repos, no smart contract code. However, all core contracts are **source-code verified on HyperEVMScan** (exact match).
- No public formal verification disclosure found.

## Monitoring

Key contracts to monitor:
- kHYPE Proxy: [`kHYPE`](https://hyperevmscan.io/address/0xfd739d4e423301ce9385c1fb8850539d657c296d)
- StakingPool Proxy: [`StakingPool`](https://hyperevmscan.io/address/0x393D0B87Ed38fc779FD9611144aE649BA6082109)
- PauserRegistry Proxy: [`PauserRegistry`](https://hyperevmscan.io/address/0x752E76ea71960Da08644614E626c9F9Ff5a50547)
- StakingAccountant Proxy: [`StakingAccountant`](https://hyperevmscan.io/address/0x9209648Ec9D448EF57116B73A2f081835643dc7A)
- InstantUnstakePool: [`InstantUnstakePool`](https://hyperevmscan.io/address/0x665b67793594fc5C251a3C95cbEb4B6245Cd2123)
- FacetRegistry: [`FacetRegistry`](https://hyperevmscan.io/address/0x4841eCC9Ffb18aEA197E4d1dd1633cEA5e834225)
- Governance Multisig: [`Governance Multisig`](https://hyperevmscan.io/address/0x18A82c968b992D28D4D812920eB7b4305306f8F1) (Gnosis Safe 4-of-8)

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
- `kHYPE.totalSupply()` (currently 17.4M)
- `StakingAccountant.totalStaked()` / `totalClaimed()` / `totalRewards()` / `totalSlashing()` (currently 51.06M / 33.80M / 463K / 0 HYPE)
- `StakingAccountant.kHYPEToHYPE(1e18)` exchange rate trend (currently 1.0183)
- StakingPool native HYPE balance (liquid buffer, currently 112K HYPE)
- InstantUnstakePool native HYPE balance (instant exit liquidity, currently 42K HYPE)

Alert thresholds:
- backing ratio drift >1% in 24h (unless expected market event)
- `totalSlashing` > 0 (immediate alert — would be the first slashing ever recorded on this protocol)
- liquid buffer drops below 50K HYPE

### 3. Queue Health Monitoring (MANDATORY)

Track:
- `StakingPool.totalQueuedWithdrawals()` (currently 769K HYPE)
- L1 `delegatorSummary.totalPendingWithdrawal` (currently 639K HYPE across 5 positions)
- standard (7d), quick (36h), and instant exit utilization
- daily enqueue/dequeue flow

Alert thresholds:
- average unstake latency >10 days sustained
- queue size growth >30% day-over-day
- InstantUnstakePool depletion below 10K HYPE for >24h

### 4. Market Liquidity Monitoring

Track:
- kHYPE/HYPE and kHYPE/stable liquidity depth on Nest, Project X, Ramses, HyperSwap
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

1. TVL ~$932M (up ~36% over the last quarter) with deep DeFi integration (~$497M of kHYPE deposited in lending markets).
2. 8 audits from reputable firms (Pashov ×2, Zenith ×2, Code4rena, Spearbit ×3), including a Pashov audit specifically covering the instant-unstake design.
3. Active Cantina bug bounty with $5M max and **387 submissions**.
4. Onchain verifiable staking economics with AccessControl role enumeration; backing reconciles to within ~900 HYPE between accountant and actual L1+EVM holdings.
5. **Diversified delegation**: spread across 15 validators with **0% to Hyper Foundation**; Kinetiq's share of total network stake is ~3.96%.
6. **Three exit paths** with **no exit fee**: 7-day standard queue, 36-hour quick withdrawal, and `InstantUnstakePool`.

### Key Risks

1. Standard queue-based unstake (7 days) is the deterministic exit; quick/instant paths are capacity-limited.
2. **Diamond/facet StakingPool architecture** — 7 facets routed via `FacetRegistry` carries higher code surface and integration complexity than a monolithic implementation.
3. OPERATOR role on StakingPool held by a single EOA (nonce 9,755).
4. **No timelock on multisig** — verified exhaustively onchain (no modules, no guard, no timelock contract). Upgrades can be executed immediately.
5. **4-of-8 multisig** — threshold is proportionally 50%. All 8 signers are pseudonymous and appear team-associated.
6. **Hyper Foundation controls 54.83% of network stake** — exceeds 1/3 BFT blocking minority (network-level risk, not Kinetiq-specific).
7. DEX liquidity is ~$8.6M across HyperEVM DEXes; top pools hold $2–3M each. Stress-exit scenarios depend on the protocol queue / InstantUnstakePool more than DEX depth.
8. Contracts not open-sourced on GitHub (but verified onchain on HyperEVMScan).
9. Legal entity ambiguity: "Kinetiq Labs" (Terms) vs "Kinetiq Research" (Privacy/GitHub) with no specific governing law jurisdiction named.

### Critical Risks

- `executeEmergencyWithdrawal()` and `rescueToken()` functions give admin significant power over funds.
- `SENTINEL_ROLE` and `TREASURY_ROLE` on StakingPool are currently unassigned — monitor for grants.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** -> **PASS** (5 core audits from 4 reputable firms)
- [x] **Unverifiable reserves** -> **PASS** (onchain staking model with readable state)
- [x] **Total centralization** -> **PASS** (4-of-7 multisig, not single EOA)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- 8 audits by reputable firms (Pashov ×2, Zenith ×2, Code4rena, Spearbit ×3) from Mar 2025 – Jan 2026, including coverage of the instant-unstake path.
- Cantina bug bounty at $5M max with **387** submissions.
- ~10 months in production, TVL ~$932M (peaked ~$2.65B). No public incidents.

**Score: 2.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

Subscores:
- Governance: **4.0** — 4-of-8 multisig (verified onchain), proportionally 50% threshold. **No timelock** (confirmed exhaustively). Signer independence is questionable (all pseudonymous and team-associated). Powerful admin functions exist (emergency withdrawal, rescue, parameter changes).
- Programmability: **2.5** — Diamond/facet StakingPool architecture (7 facets) carries elevated code surface and integration risk, partially offset by audit coverage. Exchange rate is onchain-derived (via `StakingAccountant`). All core contracts source-verified on HyperEVMScan.
- External dependencies: **3.5** — Critical single-ecosystem dependency on Hyperliquid L1. Hyper Foundation controls 54.83% of network stake. Kinetiq has **zero direct HF-validator exposure**, decoupling Kinetiq-specific risk from HF-concentration risk. Kinetiq's network share is ~3.96%.

Centralization score = (4.0 + 2.5 + 3.5) / 3 = **3.33**

**Score: 3.3/5**

#### Category 3: Funds Management (Weight: 30%)

Subscores:
- Collateralization: **2.0** — 100% onchain collateral (staked HYPE). Backing reconciles cleanly: 17,724,217 HYPE (accountant) vs 17,725,123 HYPE (L1 delegations + L1 pending + EVM liquid + InstantUnstakePool). Exchange rate verified at 1.0183 HYPE/kHYPE. Collateral quality = single-asset (HYPE), high quality within the Hyperliquid ecosystem.
- Provability: **1.5** — Full onchain accountant (`totalStaked`, `totalClaimed`, `totalRewards`, `totalSlashing`). AccessControl enumerable. All implementations source-verified onchain (exact match).

Funds management score = (2.0 + 1.5) / 2 = **1.75**

**Score: 1.75/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Three deterministic exit paths: 7-day standard, 36-hour quick, and instant pool. No exit fee.
- DEX liquidity is ~$8.6M across 40 pools; largest pool ~$3.4M.
- Most kHYPE in DeFi sits in lending markets (~$304M HyperLend, ~$180M Morpho), which is not exit liquidity.
- All trading liquidity is on HyperEVM DEXes; no CEX listings. The protocol's queue/quick/instant paths carry most of the exit burden.

**Score: 2.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Docs present but client-side rendered (verification difficult).
- Audit cadence and bounty are strong, with coverage of the current architecture.
- Team transparency: 3 identifiable contributors via GitHub history; no public team page.
- No public incident response plan documented.

**Score: 2.0/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 3.3 | 30% | 0.99 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.315 / 5.0** |

## Overall Risk Score: **2.3 / 5.0**

### Risk Tier: **MEDIUM RISK**

Rationale:
- kHYPE is a well-audited LST with significant TVL ($932M, up ~36% over the last quarter) and deep DeFi integration.
- Governance is a 4-of-8 multisig with no timelock; signers are pseudonymous and team-associated.
- **Diversified delegation**: 0% to Hyper Foundation validators, spread across 15 validators; Kinetiq's share of total network stake is ~3.96%.
- Architecture is Diamond/facet (7 facets) — audited and source-verified onchain.
- Three protocol-side exit paths (7d / 36h / instant pool) with no fee; DEX depth is ~$8.6M.
- Hyper Foundation controls 54.8% of network validator stake — structural Hyperliquid risk.

## Reassessment Triggers

- **Time-based**: Reassess in 3 months
- **TVL-based**: Reassess if TVL changes by more than 50%
1. Any Hyperliquid staking governance change that introduces automatic validator slashing.
2. Any kHYPE exploit or emergency pause activation.
3. Unstake queue latency >10 days sustained for >72h.
4. kHYPE discount >3% sustained for >24h.
5. Any privileged role threshold reduction or owner structure downgrade.
6. Major contract migration or implementation upgrade (further facet additions/replacements).
7. OPERATOR EOA change or role reassignment.
8. Assignment of the currently-empty `SENTINEL_ROLE` or `TREASURY_ROLE` on StakingPool.
9. Resumption of delegations to Hyper Foundation validators (would re-introduce concentration risk).
10. Timelock implementation (positive trigger — would warrant score improvement).

## Sources

- Kinetiq app: https://kinetiq.xyz/
- Kinetiq docs: https://docs.kinetiq.xyz/
- kHYPE docs: https://kinetiq.xyz/docs/khype
- StakeHub docs: https://kinetiq.xyz/docs/stakehub
- Kinetiq FAQ: https://kinetiq.xyz/docs/faq
- Kinetiq contracts: https://kinetiq.xyz/docs/contracts-and-audits
- Kinetiq audits: https://kinetiq.xyz/docs/contracts-and-audits
- Kinetiq audit PDFs (Google Drive): https://drive.google.com/drive/folders/1T3ZGl6HNmt5LaKwdCmrA9HS7MsXheOys
- Code4rena Kinetiq audit: https://code4rena.com/audits/2025-04-kinetiq
- Kinetiq bug bounty (Cantina): https://cantina.xyz/bounties/a98129d7-dd15-4c16-b2cb-d8cc42f87de4
- CoinGecko kHYPE: https://www.coingecko.com/en/coins/kinetiq-staked-hype
- DeFiLlama Kinetiq: https://defillama.com/protocol/kinetiq
- Hyperliquid staking docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking
- Hyperliquid validator prison docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking
- Hyperliquid risks docs: https://hyperliquid.gitbook.io/hyperliquid-docs/risks
- Onchain verification via `cast` against HyperEVM RPC (`rpc.hyperliquid.xyz/evm`)
- Hyperliquid L1 API: `POST https://api.hyperliquid.xyz/info` (validator summaries, delegations)
- Kinetiq GitHub org: https://github.com/kinetiq-research
- Kinetiq Terms of Use: https://kinetiq.xyz/terms
- Kinetiq Privacy Policy: https://kinetiq.xyz/privacy
- Kinetiq security.txt: https://kinetiq.xyz/.well-known/security.txt
- ENS reverse lookup via `0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C` (getNames)
- RouteScan API for HyperEVM (chain 999) transaction tracing
- Etherscan V2 API for cross-chain address verification (chain id 999 / HyperEVM)
- GeckoTerminal API for HyperEVM DEX pool data (`api.geckoterminal.com/api/v2/networks/hyperevm`)
- DeFiLlama yields API for lending market deposits (`yields.llama.fi/pools`)
- Onchain block reference: 35,538,772 (May 19, 2026)
