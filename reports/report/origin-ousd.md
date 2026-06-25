# Protocol Risk Assessment: Origin OUSD

- **Assessment Date:** June 25, 2026
- **Token:** OUSD (Origin Dollar)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86)
- **Final Score: 1.85/5.0**

## Overview + Links

Origin Dollar (OUSD) is a rebasing stablecoin backed 100% by USDC. Holders' wallet balances automatically increase as yield accrues, without staking, locking, or manual compounding. Smart contracts must opt in to receive rebased yield; those that don't forfeit rewards to standard holders, amplifying returns for participants. An ERC-4626 wrapper (wOUSD) is available for DeFi composability, appreciating in value instead of rebasing.

OUSD generates yield through three mechanisms:
1. **Morpho Lending** (~$3.33M, ~45% of TVL) — Deposits USDC into a MetaMorpho vault for over-collateralized lending yield
2. **Curve AMO** (~$1.02M, ~14% of TVL) — Algorithmic Market Operations providing liquidity in the Curve OUSD/USDC pool, earning trading fees and CRV incentives
3. **Cross-Chain Strategies** (~$3.09M, ~42% of TVL) — Bridges USDC via Circle CCTP to Base (~$2.11M) and HyperEVM (~$977K)

Collateral was simplified from multi-stablecoin (USDT, DAI, USDC) to **USDC-only** via governance proposal in November 2025.

- **Launch Date:** September 18, 2020 (relaunched January 5, 2021 after November 2020 hack)
- **Performance Fee:** 20% (2,000 bps), collected by Trustee multisig
- **Total Value:** ~$7.43M (vault `totalValue()` at block 25394922)

**Links:**

- [Protocol Documentation](https://docs.originprotocol.com/yield-bearing-tokens/origin-dollar-ousd)
- [Protocol App](https://www.originprotocol.com/ousd)
- [GitHub Repository](https://github.com/OriginProtocol/origin-dollar)
- [Security / Audits](https://github.com/OriginProtocol/security)
- [Bug Bounty](https://immunefi.com/bug-bounty/originprotocol/scope/#top)
- [DeFiLlama](https://defillama.com/protocol/origin-dollar)

## Contract Addresses

| Contract | Address |
|----------|---------|
| OUSD Token (Proxy) | [`0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86) |
| OUSD Token Implementation | [`0xA7B7c59a1705e4a624ea8a4ad8a06f9de22dcc33`](https://etherscan.io/address/0xA7B7c59a1705e4a624ea8a4ad8a06f9de22dcc33) |
| wOUSD (ERC-4626) | [`0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62`](https://etherscan.io/address/0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62) |
| OUSD Vault (Proxy) | [`0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70`](https://etherscan.io/address/0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70) |
| OUSD Vault Implementation | [`0x82948060c4b72684bededec342350ab344975145`](https://etherscan.io/address/0x82948060c4b72684bededec342350ab344975145) |
| Curve USDC AMO Strategy | [`0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11`](https://etherscan.io/address/0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11) |
| Morpho V2 Strategy | [`0x3643cafA6eF3dd7Fcc2ADaD1cabf708075AFFf6e`](https://etherscan.io/address/0x3643cafA6eF3dd7Fcc2ADaD1cabf708075AFFf6e) |
| Cross-Chain Strategy (Base) | [`0xB1d624fc40824683e2bFBEfd19eB208DbBE00866`](https://etherscan.io/address/0xB1d624fc40824683e2bFBEfd19eB208DbBE00866) |
| Cross-Chain Strategy (HyperEVM) | [`0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e`](https://etherscan.io/address/0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e) |
| Oracle Router | [`0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c`](https://etherscan.io/address/0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c) |
| Curve OUSD/USDC Pool | [`0x6d18E1a7faeB1F0467A77C0d293872ab685426dc`](https://etherscan.io/address/0x6d18E1a7faeB1F0467A77C0d293872ab685426dc) |
| Curve Gauge | [`0x1eF8B6Ea6434e722C916314caF8Bf16C81cAF2f9`](https://etherscan.io/address/0x1eF8B6Ea6434e722C916314caF8Bf16C81cAF2f9) |
| CoW Harvester | [`0xD400341aEfED0BC75176714cFdE82e8BDAA2D3b8`](https://etherscan.io/address/0xD400341aEfED0BC75176714cFdE82e8BDAA2D3b8) |
| MetaMorpho Vault (mOUSD-V2) | [`0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960`](https://etherscan.io/address/0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960) |
| Timelock Controller | [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F) |
| Origin DeFi Governance | [`0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC`](https://etherscan.io/address/0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC) |
| GOV Multisig (5/8, cancel-only) | [`0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899`](https://etherscan.io/address/0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899) |
| Strategist / Guardian (2/8) | [`0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`](https://etherscan.io/address/0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) |
| Trustee / Fee Collector (1/3) | [`0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c`](https://etherscan.io/address/0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c) |
| xOGN Governance Token | [`0x63898b3b6Ef3d39332082178656E9862bee45C57`](https://etherscan.io/address/0x63898b3b6Ef3d39332082178656E9862bee45C57) |
| USDC (Collateral) | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) |
| Chainlink USDC/USD Oracle | [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) |

## Audits and Due Diligence Disclosures

OUSD has been audited extensively across its lifecycle. Key OUSD-specific audits:

| # | Date | Firm | Scope | Report |
|---|------|------|-------|--------|
| 1 | Dec 2020 | Trail of Bits | OUSD (pre-relaunch) | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Trail%20of%20Bits%20-%20Origin%20Dollar%20-%20Dec%202020.pdf) |
| 2 | Dec 2020 | Solidified | OUSD (pre-relaunch) | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Solidified%20-%20Origin%20Dollar%20-%20Dec%202020.pdf) |
| 3 | Oct 2021 | OpenZeppelin | Origin Dollar | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20-%20October%202021.pdf) |
| 4 | Jun 2022 | OpenZeppelin | Origin Dollar Governance | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20Governance%20-%20June%202022.pdf) |
| 5 | Oct 2022 | OpenZeppelin | Origin Dollar Convex | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20Convex%20-%20October%202022.pdf) |
| 6 | Apr 2023 | OpenZeppelin | OUSD Dripper & Uniswap Strategy | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20Dripper%20%26%20Uniswap%20strategy%20-%20April%202023.pdf) |
| 7 | Dec 2024 | Certora | Formal Verification (OUSD) | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Certora%20-%20Formal%20verification%20-%20December%202024.pdf) |
| 8 | Dec 2024 | OpenZeppelin | Origin OUSD | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20OUSD%20-%20December%202024.pdf) |
| 9 | Feb 2026 | Sigma Prime | OUSD Upgrade Security Assessment v2 | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Sigma%20Prime%20-%20Origin%20OUSD%20Upgrade%20Security%20Assessment%20Report%20v2%20-%20February%202026.pdf) |

Origin Protocol maintains 30+ audit reports across all products in their [security repository](https://github.com/OriginProtocol/security). They have a continuous auditing agreement with OpenZeppelin to review 100% of smart contract changes.

**Smart Contract Complexity:** High - Upgradeable proxy pattern (EIP-1967), rebasing token with non-standard ERC-20 behavior, AMO minting mechanism, 4 active strategies including cross-chain via CCTP, oracle integration.

### Bug Bounty

- **Platform:** Immunefi
- **Maximum Payout:** $1,000,000 (critical smart contract, capped at 10% of economic damage, min $50,000)
- **Scope:** OUSD token contract explicitly in-scope (34 assets total)
- **Safe Harbor:** Enabled via SEAL team
- **Link:** https://immunefi.com/bug-bounty/originprotocol/scope/

## Historical Track Record

- **Launched:** September 18, 2020 (~5.5 years in production)
- **Relaunched:** January 5, 2021 (after November 2020 hack, with fresh audits)
- **November 17, 2020 — OUSD Flash Loan Reentrancy Attack ($7.7M loss):**
  - **Attack:** Exploited missing input validation in `mintMultiple()` and lack of reentrancy protection. Attacker used a malicious ERC-20 contract to re-enter the mint function, inflating OUSD supply without depositing backing collateral.
  - **Impact:** 11,809 ETH + 2,249,821 DAI stolen (~$7.7M), including $1M+ from Origin founders/employees.
  - **Resolution:** Deposits immediately disabled. $1M bounty offered for fund recovery. All existing OUSD balances reset to zero upon relaunch.
  - **Compensation:** Users <=1,000 OUSD received 100% in newly minted OUSD. Users >1,000 OUSD received 25% OUSD + 75% in OGN tokens (1-year lock, 25% interest). Founders received no compensation.
  - **Source:** [PeckShield Root Cause Analysis](https://peckshield.medium.com/origin-dollar-incident-root-cause-analysis-f27e11988c90), [rekt.news](https://rekt.news/origin-rekt/)
- **Post-relaunch incidents:** None in ~5 years since relaunch
- **TVL history:** Peak ~$275M (December 2021), current ~$7.43M — significant decline from peak
- **Price stability:** Post-relaunch peg maintained within a few basis points of $1.00. Minor deviation to $0.9671 in March 2022.
- **Team:** Origin Protocol since 2017. Founded by Josh Fraser & Matthew Liu. CEO: Rafael Ugolini. Backed by Pantera Capital, Founders Fund.

## Funds Management

**Strategy Allocation** (from vault `totalValue()` = ~$7,426,782 at block 25394922):

| Strategy | Balance (USDC) | % of TVL | Description |
|----------|---------------|----------|-------------|
| Morpho V2 | ~3,325,590 | ~45% | MetaMorpho vault (mOUSD-V2) lending |
| Curve USDC AMO | ~1,015,370 | ~14% | Curve OUSD/USDC pool + gauge staking |
| Cross-Chain (Base) | ~2,108,562 | ~28% | USDC bridged via Circle CCTP to Base |
| Cross-Chain (HyperEVM) | ~977,259 | ~13% | USDC bridged via Circle CCTP to HyperEVM |
| Vault (idle) | ~0 | <0.01% | Effective idle vault USDC (raw balance ~17,205 fully reserved against the withdrawal queue's `queued − claimed`); `vaultBuffer` parameter = 0 |

Reward tokens (CRV, MORPHO) are sold via CoW Protocol into USDC and returned to the vault, where they are distributed to holders via rebase.

### Accessibility

- **Minting:** Permissionless. Anyone can call `mint()` by depositing USDC; the vault mints equivalent OUSD 1:1. Requires `safeTransferFrom` of USDC — cannot mint without depositing collateral.
- **AMO Minting:** The Curve AMO strategy can call `mintForStrategy()` to mint OUSD without direct user-deposited backing (see [AMO Minting Analysis](#amo-minting-analysis) below). Only governor-whitelisted strategies can use this function.
- **Redemption:** Async withdrawal queue — two-step process:
  1. `requestWithdrawal(amount)` burns OUSD immediately and enqueues a withdrawal (NFT-like request ID).
  2. `claimWithdrawal(id)` / `claimWithdrawals(ids[])` pays out USDC after `withdrawalClaimDelay` (600s = **10 minutes minimum**, verified on-chain) AND when the queue's claimable liquidity has caught up to the request.
  There is no on-chain upper bound on claim time — if the queue is ahead of deposits/strategy withdrawals, a claim can wait indefinitely. The strategist (or anyone permissionlessly, via `allocate()` / strategy pulls) must supply USDC to advance the queue.
- **DEX Swaps:** Instant exits via Curve OUSD/USDC pool (~$1.10M TVL).
- **Fees:** 20% performance fee (2,000 bps), no deposit/withdrawal fees.

### AMO Minting Analysis

**Can OUSD be minted without backing?** Yes, through the AMO mechanism, but with constraints:

1. **`mintForStrategy()`** allows whitelisted strategies to mint OUSD without depositing collateral. Currently only the Curve USDC AMO strategy ([`0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11`](https://etherscan.io/address/0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11)) is whitelisted.
2. **Adding strategies to the mint whitelist requires governance** (xOGN vote + 48h timelock).
3. **Solvency check:** After every AMO operation, `_solvencyAssert()` verifies that `totalVaultValue / totalOUSDSupply >= 99.8%` (SOLVENCY_THRESHOLD). This caps the maximum unbacked OUSD at ~0.2% of total supply.
4. **Pool balance check:** The `improvePoolBalance` modifier ensures one-sided operations (mint-and-add or remove-and-burn) must improve the Curve pool's balance. Sequential operations in the same direction are prevented.
5. **`maxSupplyDiff`:** Set to 5% (checked during redemptions) — if supply exceeds backing by >5%, redemptions revert.
6. **Historical minting cap (`netOusdMintForStrategyThreshold`) has been deprecated.** There is no vault-level per-strategy cap. Protection relies on the strategy-level solvency check.

**Risk assessment:** AMO-minted OUSD enters the Curve pool (not free circulation). It can only be obtained by someone swapping USDC for it, at which point it becomes backed. The strategist (2-of-8 multisig) can trigger AMO operations without governance vote. The 99.8% solvency threshold limits exploitation but the deprecated vault-level cap is a design choice worth monitoring.

### Collateralization

- 100% backed by USDC (single collateral since November 2025)
- Funds deployed across 4 strategies; `vaultBuffer` parameter = 0 (no idle reserve target). Raw vault USDC at the snapshot block is ~17,205, fully reserved against pending withdrawal requests (effective idle ≈ 0)
- No debt, leverage, or liquidation mechanics in the vault itself
- Morpho strategy uses over-collateralized lending markets
- Cross-chain strategies bridge ~42% of TVL to HyperEVM and Base via Circle CCTP — these funds are not immediately accessible for Ethereum redemptions

### Provability

- On-chain verification: `vault.totalValue()` returns the sum of strategy balances plus vault USDC, **minus the withdrawal-queue reserve** (`queued − claimed`). The same is true of `vault.checkBalance(asset)`. Raw vault USDC and the queue reserve must be inspected separately to reconstruct each component.
- `ousd.totalSupply()` lives on the OUSD token, not on the vault. The vault parameter `maxSupplyDiff` (5%) and the AMO `SOLVENCY_THRESHOLD` (99.8%) compare these two sources at redemption / AMO time.
- Rebase calculated programmatically: `rebasingCreditsPerToken` determines each holder's share of rebased yield
- Oracle Router ([`0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c`](https://etherscan.io/address/0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c)) is non-upgradeable with hardcoded Chainlink feeds (USDC/USD)
- Cross-chain strategy balances are self-reported from CCTP bridge amounts — require checking destination chains for full verification
- 100% on-chain for Ethereum-based strategies; cross-chain portion (~42%) requires multi-chain verification

## Liquidity Risk

- **Primary exit:** Async withdrawal queue via `requestWithdrawal()` → `claimWithdrawal()`. OUSD is burned at request time; USDC is paid only after (a) `withdrawalClaimDelay` of 10 minutes AND (b) queue claimable liquidity has advanced past the request. No on-chain upper bound on wait time — effective wait depends on how quickly strategies return USDC. Per the on-chain queue (`withdrawalQueueMetadata()`), `queued = claimable ≈ $1,684,584` with `nextWithdrawalIndex = 67`, so the queue is currently caught up; a flush of large new requests would have to wait on Morpho redemptions or CCTP unwinds.
- **DEX liquidity:** Curve OUSD/USDC pool ([`0x6d18E1a7faeB1F0467A77C0d293872ab685426dc`](https://etherscan.io/address/0x6d18E1a7faeB1F0467A77C0d293872ab685426dc)) at the snapshot block holds ~653K OUSD + ~448K USDC (nominal TVL ~$1.10M). `get_dy(0,1, 100k OUSD)` ≈ 99,945 USDC, `get_dy(0,1, 300k OUSD)` ≈ 299,557 USDC, and `get_dy(0,1, 500k OUSD)` ≈ 446,294 USDC; the USDC side is only ~$448K, so swap exits beyond ~$450K OUSD will deplete it quickly.
- **Vault buffer:** `vaultBuffer` parameter = 0; raw vault USDC at the snapshot block is ~17,205, fully reserved against pending claims (effective idle ≈ 0). Queue advancement therefore depends on the strategist pulling from strategies (`withdrawFromStrategy` / `withdrawAllFromStrategies`) or on new deposits auto-allocating to cover requests.
- **Withdrawal queue depth:** `withdrawalQueueMetadata()` reports `queued = claimable ≈ $1,684,584` with `nextWithdrawalIndex = 67`. The queue represents ~22.7% of the ~7,414,516 OUSD `totalSupply()` — a meaningful concentration of exit intent, but the queue is fully caught up (claimable = queued) and the strategist is actively servicing claims (`claimWithdrawal` / `addWithdrawalQueueLiquidity` calls observed in recent blocks).
- **Cross-chain assets:** ~$3.09M (~42% of TVL) on Base and HyperEVM — cannot be immediately redeemed on Ethereum, requires CCTP bridging back (minutes to hours).
- **No priority mechanism** — first-come-first-served queue ordering.
- **Same-value assets** (USD stablecoins) mitigate price impact risk during any waiting period.
- **Legacy OUSD/3CRV pool:** ~$30K TVL, effectively deprecated.

## Centralization & Control Risks

### Governance

**Governance Structure:** Identical to Origin ARM — same xOGN governance, same Timelock, same multisig. See [Appendix: Contract Architecture](#appendix-contract-architecture) for full diagram.

**Timelock Roles (verified via `hasRole()`):**

| Role | Origin DeFi Governance | GOV Multisig (5/8) |
|------|:---:|:---:|
| PROPOSER | ✓ | ✗ |
| EXECUTOR | ✓ | ✗ |
| CANCELLER | ✓ | ✓ |

- Timelock is self-administered (TIMELOCK_ADMIN_ROLE held by itself)
- Total time from proposal to execution: ~5 days minimum (24h voting delay + 48h voting + 48h timelock)
- No backdoor — only Origin DeFi Governance can propose/execute

**GOV Multisig Signers (5-of-8, verified via `getOwners()` at block 25394922):**
`0x530d3F8C`, `0x052c01a2`, `0x336C02D3`, `0x6AC8d65D`, `0x617a3582`, `0x17aBc3F0`, `0x39772922`, `0x9990C10c`

**Privileged Roles:**

| Role | Who | Timelock? | Powers |
|------|-----|-----------|--------|
| Governor (owner) | Timelock → xOGN governance | ~5 days | Upgrade proxy, approve/remove strategies, add/remove from mint whitelist, `setAutoAllocateThreshold`, `setMaxSupplyDiff`, `setWithdrawalClaimDelay`, `setTrusteeFeeBps`, `setTrusteeAddress`, `setStrategistAddr`, set oracle, `governanceRebaseOptIn` |
| Strategist | 2-of-8 Safe `0x4FF1...971` | None | Vault (all `onlyGovernorOrStrategist`): `depositToStrategy` / `withdrawFromStrategy` / `withdrawAllFromStrategy` / `withdrawAllFromStrategies`, `setVaultBuffer`, `setDefaultStrategy`, `setRebaseRateMax`, `setDripDuration`, `setRebaseThreshold`, `pauseCapital` / `pauseRebase`, `unpauseCapital` / `unpauseRebase`, `rebase`. Curve AMO: `mintAndAddOTokens` / `removeAndBurnOTokens` / `removeOnlyAssets` (AMO ops), reward harvesting. OUSD Token (`onlyGovernorOrStrategist`): `delegateYield(from, to)`, `undelegateYield(from)` — can redirect rebase yield of **any account** to any other account without that account's consent. |
| Trustee | 1-of-3 Safe `0xBB07...c8c` | None | Receives 20% performance fee |

**Key Risks:**

1. **AMO minting without timelock:** The Strategist can trigger AMO mint/burn operations, constrained by the strategy-level 99.8% solvency check. The vault-level AMO minting cap (`netOusdMintForStrategyThreshold`) is deprecated (function reverts on-chain).
2. **Yield delegation without timelock:** `delegateYield` / `undelegateYield` on the OUSD token are `onlyGovernorOrStrategist` — the strategist can redirect the rebase yield of any account (including smart contracts holding OUSD) to an arbitrary recipient. This is a non-trivial power over holder yield.
3. **Strategy reallocation without timelock:** The strategist can move all vault funds to/from any approved strategy (`withdrawAllFromStrategies`, `setDefaultStrategy`, `depositToStrategy`). Bounded by what's already on the governor-approved strategy list.
4. **Rebase rate cap without timelock:** `setRebaseRateMax` lets the strategist cap daily rebase APR — misconfiguration could strand yield.

### Programmability

- Standard minting/redeeming: fully programmatic and permissionless
- Rebase: triggered automatically during user operations when yield exceeds `rebaseThreshold` (1,000 USDC); also callable by strategist
- Auto-allocation: triggered when deposits exceed `autoAllocateThreshold` (25,000 USDC)
- AMO operations and inter-strategy rebalancing: require strategist intervention
- Cross-chain strategy management: requires manual bridging decisions
- Reward harvesting: CoW Harvester sells CRV/MORPHO → USDC via CoW Protocol (semi-automated, bot-triggered)

### External Dependencies

1. **USDC / Circle (Critical)** — Sole collateral asset. OUSD is 100% backed by USDC. Circle can freeze/blacklist addresses holding USDC, which could impact vault or strategy contracts.
2. **Morpho (Critical)** — ~45% of TVL deployed into MetaMorpho vault (mOUSD-V2). Curator: [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) (Gnosis Safe). Largest single dependency.
3. **Curve (High)** — AMO yield generation (~14% of TVL) and primary on-Ethereum DEX liquidity (~$1.10M pool TVL, ~$448K USDC side). AMO strategy deposits into Curve OUSD/USDC pool.
4. **Circle CCTP (High)** — Cross-chain strategies use Circle CCTP V2 to bridge USDC to HyperEVM and Base. ~42% of TVL is held on remote chains.
5. **Chainlink (High)** — Oracle Router uses Chainlink USDC/USD feed for price verification. Non-upgradeable router contract.
6. **CoW Protocol (Low)** — Used for reward token swaps (CRV, MORPHO → USDC). Not critical for core functionality.

No single-point-of-failure that would break the protocol entirely, but USDC dependency means a Circle freeze on key addresses would be highly disruptive.

## Operational Risk

- **Team:** Origin Protocol since 2017, public team, known leadership (Josh Fraser, Matthew Liu, Rafael Ugolini), VC-backed (Pantera, Founders Fund)
- **Documentation:** Comprehensive. Public GitHub with active development, dedicated security repo with 30+ audits
- **Legal:** Established company (Origin Protocol)
- **Incident Response:** Learned from 2020 hack. $1M bug bounty on Immunefi. Safe Harbor enabled via SEAL team. Full relaunch with multiple audits after incident.

## Monitoring

- **Governance:** Monitor Timelock events (`CallScheduled`, `CallExecuted`, `Cancelled`) on [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F). Monitor EIP-1967 implementation slot changes on Vault and OUSD Token proxies. Monitor Origin DeFi Governance proposals.
- **Vault Parameters:** Track `totalValue()` on the vault ([`0xE75D...F70`](https://etherscan.io/address/0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70)) and `totalSupply()` on the OUSD token ([`0x2A8e...E86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86)). Alert on >1% divergence between vault `totalValue()` and token `totalSupply()`. **Note:** `totalValue()` and `checkBalance(asset)` already subtract the withdrawal-queue reserve (`queued − claimed`); reconstruct components by reading the strategy `checkBalance()` calls, the vault's raw USDC balance, and `withdrawalQueueMetadata()` separately. Monitor `rebasePaused()` and `capitalPaused()` state changes on the vault. Track `maxSupplyDiff`, `vaultBuffer`, `defaultStrategy`, `dripDuration`, and `rebasePerSecondMax` changes (several settable by strategist without timelock).
- **AMO:** Monitor `mintForStrategy()` calls and OUSD supply vs vault value ratio. Alert if solvency drops below 99.5%. Track `isMintWhitelistedStrategy` changes (requires governance).
- **Strategy Allocation:** Monitor strategy balances via `checkBalance()` on each strategy contract. Alert on >20% TVL change in 24h. Track cross-chain strategy CCTP bridge transactions.
- **Oracle:** Monitor Chainlink USDC/USD feed staleness on [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6). Alert if price deviates >1% from $1.00.
- **Liquidity:** Monitor Curve OUSD/USDC pool balance ratio. Alert on significant imbalance (>60/40 split). Track vault USDC raw balance vs. queue reserve (`queued − claimed`) — the difference is what is actually available to advance the queue or rebalance to strategies.
- **Morpho:** Monitor MetaMorpho vault (mOUSD-V2) at [`0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960`](https://etherscan.io/address/0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960). Track curator changes and market allocations.
- **Strategist:** Monitor role changes on vault `strategistAddr()`. Track AMO operations frequency and size. Monitor `YieldDelegated` / `YieldUndelegated` events on the OUSD token for yield redirection activity. Monitor `withdrawAllFromStrategies`, `setVaultBuffer`, `setDefaultStrategy`, `setDripDuration`, `setRebaseRateMax` calls (untimelocked strategist powers).
- **Withdrawal Queue:** Track `withdrawalQueueMetadata()` on the vault to monitor queue depth (requested vs claimable). Alert when queue backlog (requested − claimable) exceeds available vault + Morpho liquidity — indicates redemption delays.

## Risk Summary

### Key Strengths

1. On-chain xOGN governance with ~5-day total cycle, self-administered Timelock, no admin backdoor — identical governance to audited Origin ARM
2. 9 OUSD-specific audits by top firms (OpenZeppelin, Trail of Bits, Sigma Prime, Solidified, Certora formal verification) + $1M Immunefi bounty
3. ~5 years clean track record since January 2021 relaunch, with lessons learned from 2020 hack
4. Standard minting always requires USDC collateral deposit — permissionless and fully backed
5. AMO minting constrained by 99.8% solvency check, pool balance improvement requirement, and governance-controlled whitelist

### Key Risks

1. AMO `mintForStrategy()` can mint OUSD without direct backing (constrained to ~0.2% of supply), and historical vault-level cap has been deprecated
2. Strategist (2-of-8 multisig) has broad untimelocked power: AMO operations, strategy allocation (`withdrawAllFromStrategies`, `setDefaultStrategy`, `depositToStrategy`), vault parameters (`setVaultBuffer`, `setDripDuration`, `setRebaseRateMax`), pause controls, **and yield delegation** (`delegateYield` / `undelegateYield` can redirect any account's rebase yield)
3. Single collateral dependency on USDC (Circle) — centralized stablecoin with freeze capabilities
4. Cross-chain strategies (~42% of TVL) add bridge risk and reduce immediate redemption liquidity
5. Morpho concentration: ~45% of TVL sits in a single MetaMorpho vault (mOUSD-V2), dependent on its curator's market allocations
6. Modest TVL (~$7.43M, down from $275M peak) suggests concentration risk and reduced market confidence; the Curve OUSD/USDC pool only holds ~$448K USDC on the buy-side, capping instant DEX exit
7. `vaultBuffer` parameter is 0 — effective idle USDC is ~0 after subtracting queue reserve; redemptions flow through async withdrawal queue with no on-chain upper bound on claim time
8. Active withdrawal queue of ~$1.68M (≈22.7% of OUSD supply) signals meaningful exit intent; queue is currently caught up and the strategist is processing claims, but a large new wave of redemptions would depend on Morpho liquidity or cross-chain unwinds

### Critical Risks

- None identified. All critical gates pass.
- Historical $7.7M hack (November 2020) was on a different codebase; protocol was completely relaunched with audited contracts.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** → **PASS** (9 OUSD-specific audits including Trail of Bits, OpenZeppelin, Sigma Prime, Certora)
- [ ] **Unverifiable reserves** → **PASS** (on-chain via `totalValue()`, Chainlink oracle, though cross-chain portion requires multi-chain verification)
- [ ] **Total centralization** → **PASS** (xOGN governance + Timelock; strategist is 2-of-8 multisig, not single EOA)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.5**

**Subcategory A: Audits & Security Reviews — 1.0**

| Aspect | Assessment |
|--------|-----------|
| Audits | 9 OUSD-specific audits by 5 top firms (OpenZeppelin, Trail of Bits, Sigma Prime, Solidified, Certora) |
| Bug Bounty | $1M on Immunefi, OUSD explicitly in scope, Safe Harbor enabled |
| Formal Verification | Certora formal verification (December 2024) |
| Continuous Review | OpenZeppelin reviews 100% of contract changes |

**Subcategory B: Historical Track Record — 2.0**

| Aspect | Assessment |
|--------|-----------|
| Time in Production | ~5.5 years total, ~5 years since secure relaunch |
| Past Incidents | $7.7M flash-loan reentrancy hack (Nov 2020) on pre-relaunch code; users fully compensated; different code since relaunch |
| TVL | ~$7.43M — down ~97% from ~$275M peak (Dec 2021); modest current size |
| Price Stability | Peg maintained within basis points of $1.00 since relaunch |
| Holder pressure | Active withdrawal queue of ~$1.68M (~22.7% of OUSD supply) signals sustained exit intent |

**Score: (1.0 + 2.0) / 2 = 1.5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **2.0**

**Subcategory A: Governance — 1.0**
- On-chain xOGN token governance with ~5-day cycle (24h delay + 48h voting + 48h timelock)
- Self-administered Timelock, GOV Multisig (5/8) cancel-only
- No admin backdoor. Same governance as Origin ARM.

**Subcategory B: Programmability — 2.5**
- Minting and `requestWithdrawal` permissionless and programmatic; rebase automated via threshold triggers
- **Broad untimelocked strategist surface** (2-of-8 multisig, `onlyGovernorOrStrategist`): AMO mint/burn, strategy allocation (`depositToStrategy`, `withdrawFromStrategy`, `withdrawAllFromStrategies`, `setDefaultStrategy`), vault parameters (`setVaultBuffer`, `setDripDuration`, `setRebaseRateMax`, `setRebaseThreshold`), pause controls, and OUSD token `delegateYield` / `undelegateYield` which can redirect any account's rebase yield without consent
- Cross-chain strategy management requires manual intervention
- Reward harvesting semi-automated via CoW Protocol
- Bounded by governor's approved-strategy list and the 99.8% solvency threshold, but the set of untimelocked levers is meaningfully larger than pause/allocate alone

**Subcategory C: External Dependencies — 2.5**
- Critical: USDC (single collateral, centralized stablecoin), Morpho (~45% of TVL in a single MetaMorpho vault)
- High: Curve (AMO yield + primary DEX exit), Circle CCTP (~42% of TVL on remote chains), Chainlink (oracle)
- Low: CoW Protocol (reward swaps)
- More dependencies than Origin ARM due to AMO, Morpho, and cross-chain strategies

**Score: (1.0 + 2.5 + 2.5) / 3 = 2.0**

#### Category 3: Funds Management (Weight: 30%) — **1.75**

**Subcategory A: Collateralization — 2.0**
- 100% backed by USDC (high-quality stablecoin)
- AMO can temporarily create up to ~0.2% unbacked OUSD (solvency check)
- Funds deployed across 4 strategies including cross-chain; ~45% concentrated in Morpho mOUSD-V2
- `vaultBuffer` parameter = 0; effective idle USDC ≈ 0 at the snapshot block (all raw vault USDC reserved against pending claims)
- Cross-chain assets (~42%) not immediately accessible on Ethereum

**Subcategory B: Provability — 1.5**
- On-chain verification via `totalValue()` (vault) and `totalSupply()` (OUSD token); reconstructing components requires reading strategy `checkBalance()` calls plus `withdrawalQueueMetadata()` because `totalValue()` already nets out the queue reserve
- Oracle Router non-upgradeable with Chainlink feeds
- Ethereum-based strategies fully transparent
- Cross-chain strategy balances self-reported from CCTP bridge amounts — require multi-chain verification

**Score: (2.0 + 1.5) / 2 = 1.75**

#### Category 4: Liquidity Risk (Weight: 15%) — **2.5**

- Async withdrawal queue: 10-minute minimum delay (`withdrawalClaimDelay` = 600s) plus queue liquidity catch-up; no on-chain upper bound
- Current queue depth ~$1,684,584 queued/claimable (≈22.7% of OUSD supply, `nextWithdrawalIndex = 67`) — queue is caught up and the strategist is actively servicing claims, but a large new wave of requests would depend on Morpho liquidity or cross-chain unwinds
- Curve OUSD/USDC pool ~$1.10M TVL (~653K OUSD + ~448K USDC) — instant swap path works for small exits but the ~$448K USDC side caps useful capacity at ~$450K OUSD
- `vaultBuffer` = 0 and effective idle USDC ≈ 0 at the snapshot block — larger redemptions require strategy unwinding (Morpho is the deepest source)
- Cross-chain assets (~$3.09M, ~42% of TVL) require CCTP bridging back to Ethereum
- Same-value assets (USD stablecoins) mitigate waiting risk
- No priority mechanism; first-come-first-served

#### Category 5: Operational Risk (Weight: 5%) — **1.0**

- Established team (2017), public, VC-backed (Pantera, Founders Fund)
- Comprehensive security repo with 30+ audit reports
- $1M bug bounty, Safe Harbor enabled
- Demonstrated incident response capability (2020 hack recovery and user compensation)

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (1.5 × 0.20) + (2.0 × 0.30) + (1.75 × 0.30) + (2.5 × 0.15) + (1.0 × 0.05)
            = 0.300 + 0.600 + 0.525 + 0.375 + 0.050
            = 1.850
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 2.0 | 30% | 0.600 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.85 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

---

## Reassessment Triggers

- **Time-based:** Quarterly (next: July 2026)
- **Incident-based:** Any security incident, AMO solvency anomaly, or USDC depeg/freeze event
- **Change-based:** New strategy added to mint whitelist, MetaMorpho vault curator change, new cross-chain deployment, governance parameter changes, or significant TVL changes (>50%)

---

## Appendix: Contract Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          GOVERNANCE                                      │
│                                                                          │
│  xOGN Token Holders (Staked OGN)                                        │
│  (100K xOGN to propose, ~274M xOGN quorum)                             │
│         │                                                                │
│         ▼                                                                │
│  Origin DeFi Governance (0x1D3f...)                                     │
│  [PROPOSER + EXECUTOR + CANCELLER]                                      │
│  (7,200 blocks voting delay + 14,416 blocks voting period)              │
│         │                                                                │
│         ▼                                                                │
│  Timelock Controller (0x3591...)          GOV Multisig 5/8              │
│  [48h delay, self-administered]  ◄────── (0xbe2A...)                    │
│         │                                [CANCELLER only]                │
│         │ governor                                                       │
│         ├──────────────────────────────────────────────────────────┐     │
│         ▼                                                          ▼     │
│  OUSD Token (0x2A8e...)                                OUSD Vault (0xE75D│
│  [Rebasing ERC-20, proxy]                              [Proxy, impl: 0x82│
│  impl: 0xA7B7...                                                         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        OUSD VAULT (0xE75D...)                            │
│                                                                          │
│  Supported Asset: USDC only (0xA0b8...)                                 │
│  Oracle: Router (0x36CF...) → Chainlink USDC/USD [non-upgradeable]      │
│                                                                          │
│  Roles:                                                                  │
│  ├── governor:      Timelock (0x3591...) [~5d timelock]                 │
│  │   approveStrategy, addStrategyToMintWhitelist, setTrusteeFeeBps,     │
│  │   setAutoAllocateThreshold, setMaxSupplyDiff,                        │
│  │   setWithdrawalClaimDelay, setStrategistAddr, upgradeTo              │
│  ├── strategistAddr: 2-of-8 Safe (0x4FF1...) "Origin: Guardian" [none]  │
│  │   Vault: depositToStrategy, withdrawFromStrategy,                    │
│  │   withdrawAllFromStrategy(ies), setDefaultStrategy, setVaultBuffer,  │
│  │   setDripDuration, setRebaseRateMax, setRebaseThreshold,             │
│  │   pauseCapital/Rebase, unpauseCapital/Rebase, rebase.                │
│  │   AMO: mintAndAddOTokens, removeAndBurnOTokens, harvest.             │
│  │   OUSD Token: delegateYield, undelegateYield (any account).          │
│  ├── trusteeAddress: 1-of-3 Safe (0xBB07...) receives 20% fee          │
│  └── vaultBuffer:   0 (all funds deployed to strategies)                │
│                                                                          │
│  Key Parameters:                                                         │
│  ├── rebaseThreshold:       1,000 USDC                                  │
│  ├── autoAllocateThreshold: 25,000 USDC                                 │
│  ├── maxSupplyDiff:         5%                                          │
│  └── trusteeFeeBps:         2,000 (20%)                                 │
│                                                                          │
│  Permissionless: mint, requestWithdrawal, claimWithdrawal(s),          │
│                     rebase (if threshold met), allocate                 │
│                                                                          │
└──────┬──────────────┬──────────────┬──────────────┬─────────────────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│ Curve USDC   │ │ Morpho V2    │ │ Cross-Chain  │ │ Cross-Chain          │
│ AMO Strategy │ │ Strategy     │ │ (Base)       │ │ (HyperEVM)           │
│ (0x26a0...)  │ │ (0x3643...)  │ │ (0xB1d6...)  │ │ (0xE022...)          │
│ ~$1.02M (14%)│ │ ~$3.33M (45%)│ │ ~$2.11M (28%)│ │ ~$977K (13%)         │
│              │ │              │ │              │ │                      │
│ ┌──────────┐ │ │ ┌──────────┐ │ │ Circle CCTP  │ │ Circle CCTP          │
│ │Curve Pool│ │ │ │MetaMorpho│ │ │ → Base USDC  │ │ → HyperEVM USDC      │
│ │OUSD/USDC │ │ │ │mOUSD-V2  │ │ │              │ │                      │
│ │(0x6d18..)│ │ │ │(0xFB15..)│ │ └──────────────┘ └──────────────────────┘
│ │~$1.10M   │ │ │ │~$3.33M   │ │
│ └──────────┘ │ │ └──────────┘ │
│       │      │ │       │      │
│   Gauge      │ │   MORPHO     │
│  (0x1eF8..)  │ │   rewards    │
│   → CRV      │ │       │      │
│   rewards    │ │       ▼      │
│       │      │ │ CoW Harvester│
│       ▼      │ │ (0xD400...)  │
│  Strategist  │ │ → USDC       │
│  harvests    │ │              │
└──────────────┘ └──────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    AMO MINTING FLOW                                      │
│                                                                          │
│  Curve AMO Strategy → mintForStrategy() → OUSD Token mints new OUSD    │
│  [Whitelisted by governor]   [No vault-level cap]   [99.8% solvency]   │
│                                                                          │
│  OUSD enters Curve pool → only obtainable by swapping USDC → backed    │
│                                                                          │
│  Constraints:                                                            │
│  ├── _solvencyAssert(): totalValue/totalSupply >= 99.8%                 │
│  ├── improvePoolBalance: must improve pool ratio                        │
│  └── maxSupplyDiff: 5% (checked on redemption)                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    SECONDARY LIQUIDITY                                   │
│                                                                          │
│  Curve Pool: OUSD/USDC (CurveStableSwapNG)                             │
│  (0x6d18...)  ~$1.10M TVL (~653K OUSD + ~448K USDC)                    │
│                                                                          │
│  Legacy: OUSD/3CRV Metapool (0x8765...)  ~$30K TVL [deprecated]        │
│                                                                          │
│  wOUSD (0xD2af...): ERC-4626 wrapper for DeFi composability            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Data flows:
  Mint:    User USDC → Vault → mint OUSD 1:1
  Redeem:  requestWithdrawal (burns OUSD, enqueues request) →
           wait >=600s AND queue liquidity advances →
           claimWithdrawal(s) pays USDC (no on-chain upper bound on wait)
  Rebase:  Yield accrues → rebase increases all opted-in balances
  AMO:     Strategist → AMO Strategy → mintForStrategy → Curve pool
  Yield:   Morpho interest + CRV/MORPHO rewards → CoW Harvester → USDC → Vault
  Bridge:  Vault → Cross-Chain Strategy → CCTP → Base/HyperEVM USDC
```
