# Protocol Risk Assessment: Yearn — yvWBTC-1

- **Assessment Date:** April 27, 2026
- **Token:** yvWBTC-1 (WBTC-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708`](https://etherscan.io/address/0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708)
- **Final Score: 1.5/5.0**

## Overview + Links

yvWBTC-1 is a **WBTC-denominated Yearn V3 vault** (ERC-4626) on Ethereum mainnet. The vault holds **47.5051 WBTC** (≈ $3.64M at the snapshot) but currently deploys **0% of it** — `totalDebt = 0`, `totalIdle = totalAssets`. **Only one strategy is queued** — Aave V3 WBTC Lender — and it currently holds zero debt.

Per the Yearn team, the current 100%-idle posture is a **precautionary deallocation following the April 18, 2026 rsETH (KelpDAO) bridge exploit** on the LayerZero OFT bridge layer (the rsETH event itself is documented in the [hgETH reassessment report](./kerneldao-hgeth.md)). The team's specific causal attribution for yvWBTC-1's deallocation has not been independently verified; the rsETH event itself is well documented. Note that the queued Aave V3 WBTC market does not reference rsETH as collateral directly, so the deallocation here is precautionary.

yvWBTC-1 is also the **newest and least mature vault** in the mainnet risk-1 set — deployed May 13, 2025, ~11.5 months at the snapshot. PPS has barely moved (1.000036), reflecting that the vault has spent most of its life undeployed or only briefly funded.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting WBTC deposits, issuing yvWBTC-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.4 Yearn V3 Vault Factory ([`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F))
- **Strategy queue (single, WBTC-native, no Sky / USDS routing):**
  - Aave V3 WBTC Lender ([`0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc`](https://etherscan.io/address/0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc))
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (April 27, 2026, snapshot at block 24974187):**

- **TVL:** 47.5051 WBTC (~$3.64M, Chainlink BTC/USD = $76,879.12, WBTC/BTC = 0.99785)
- **Total Supply:** 47.5034 yvWBTC-1
- **Price Per Share:** 1.000036 WBTC/yvWBTC-1 (essentially unchanged over ~11.5 months — the vault has been mostly undeployed)
- **Total Debt:** 0 (on-chain)
- **Total Idle:** 47.5051 WBTC (100% of TVL)
- **Deposit Limit:** **100,000 WBTC** (≈ $7.7B at snapshot — materially oversized, see Reassessment Triggers)
- **Profit Max Unlock Time:** 5 days
- **Fees:** 0% management fee, 10% performance fee

**Important note:** because the vault is 100% idle and has only one strategy in queue, this assessment captures the **current snapshot state**, not steady-state operation. The dependency profile, liquidity score, and complexity assessment should be re-checked once Yearn re-deploys funds to a strategy. This trigger is recorded under Reassessment Triggers below.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [hgETH reassessment (rsETH bridge exploit context)](./kerneldao-hgeth.md)

## Contract Addresses

### Core yvWBTC-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvWBTC-1 Vault | [`0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708`](https://etherscan.io/address/0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708) | Yearn V3 Vault (v3.0.4), Vyper minimal proxy |
| Underlying asset (WBTC) | [`0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | Wrapped Bitcoin (BitGo) |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Shared Yearn Accountant (0% mgmt, 10% perf) |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |

### Governance Contracts (shared with all Yearn V3 risk-1 vaults)

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Single instance for all category-1 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.4) | [`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) |
| Vault Original (v3.0.4) | [`0xd8063123BBA3B480569244AE66BFE72B6c84b00d`](https://etherscan.io/address/0xd8063123BBA3B480569244AE66BFE72B6c84b00d) |

### Strategies (1 in default queue, 0 with debt)

| # | Strategy | Name | Current Debt (WBTC) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc`](https://etherscan.io/address/0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc) | Aave V3 WBTC Lender | 0 | 0% |

**Important:** the queued strategy is WBTC-native and does **not** route through the Sky / USDS stack. yvWBTC-1 is therefore **not part of the Sky concentration risk** that affects yvUSDC-1 / yvUSDS-1 / yvDAI-1. If yvWBTC-1 ever adds a strategy with Sky/USDS routing or with rsETH-collateral exposure, this exclusion no longer holds and the dependency assessment should be re-checked.

### Strategy Protocol Dependencies (steady-state, when re-deployed)

| Protocol | Strategy | Notes |
|----------|----------|-------|
| **Aave V3** | Aave V3 WBTC Lender | Blue-chip, $30B+ TVL. Multiple audits (SigmaPrime, Certora, OpenZeppelin, Trail of Bits, ABDK) |

When the Debt Allocator re-deploys, the dependency profile is **single-protocol** (Aave V3 only) — less diversified than yvUSDT-1's queued mix, but Aave V3 is the most extensively audited and largest-TVL lending protocol in DeFi. WBTC is also a more concentrated-liquidity asset than USDT/USDC, so even an expanded queue would have a narrower set of viable WBTC venues.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

The **v3.0.4 patch release** (used by yvWBTC-1) was reviewed **internally** by the Yearn team rather than re-engaging external auditors. The diff from v3.0.2 is a minor patch-level change; the external audits cover the core architecture. Source: [yearn-vaults-v3 GitHub releases](https://github.com/yearn/yearn-vaults-v3/releases).

### Underlying Protocol Audits (queued strategy)

| Underlying | Audits | Notes |
|------------|--------|-------|
| **Aave V3 (WBTC lender)** | Multiple audits (SigmaPrime, Certora, OpenZeppelin, Trail of Bits, ABDK) | Blue-chip, $30B+ TVL |

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvWBTC-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Aave** has an active bug bounty program
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

Today, **trivially low** — the vault holds WBTC directly with no strategy funded.

When the Debt Allocator re-deploys to the queued Aave V3 WBTC Lender, complexity is still low:

- Direct WBTC supply to Aave V3 — no conversion hops
- No leverage, no looping, no cross-chain
- Standard ERC-4626 throughout
- Vault is immutable

## Historical Track Record

- **Vault deployed:** May 13, 2025 (deployment [tx](https://etherscan.io/tx/0x8cac67b54afe9af0cc072a2e63852c787343ae514638a54d9644894f6b2a3984)) — **~11.5 months** in production. **Newest of the six mainnet risk-1 vaults.**
- **TVL:** 47.5051 WBTC (~$3.64M) — well within the 100,000 WBTC deposit limit (the cap itself is materially oversized — see Reassessment Triggers)
- **PPS trend:** 1.000000 → 1.000036 (essentially flat, ~0% annualized — the vault has been mostly undeployed over its short life)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** only one strategy ever queued (Aave V3 WBTC Lender, activated 2025-05-18); current state is post-deallocation
- **Yearn V3 track record:** V3 framework live since May 2024 (~23 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026).

**Underlying WBTC lending market track record:** the Aave V3 WBTC market has multi-year operational history with no significant principal-loss events. WBTC has historically had narrower concentrated-liquidity profiles than USD stablecoins, which is the main caveat to the dependency picture when re-deployed.

## Funds Management

yvWBTC-1 currently holds 100% WBTC idle. There is no active strategy deployment to characterize.

### Current State (snapshot)

- **Total Assets:** 47.5051 WBTC
- **Total Debt:** 0
- **Total Idle:** 47.5051 WBTC (100%)
- **Capital utilization:** 0% deployed

WBTC is held directly at the vault contract. ERC-4626 redemptions settle atomically against this idle balance with no slippage.

### Strategies When Re-Deployed

The single queued strategy is WBTC-native:

| Strategy | Mechanic | Risk profile |
|----------|----------|-------------|
| **Aave V3 WBTC Lender** | Direct supply to Aave V3 WBTC market | Blue-chip, $30B+ TVL |

Simple lend pattern with no leverage, no conversion hops, and no cross-chain.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 100,000 WBTC deposit limit (cap is oversized — see Reassessment Triggers)
- **Withdrawals:** ERC-4626. Currently atomic against idle balance — no strategy unwind needed
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 5 days

### Collateralization

- **100% on-chain WBTC backing** — all of TVL is held directly at the vault contract today
- **Collateral quality:** WBTC is a wrapped representation of BTC, custodied off-chain by BitGo. Quality is tied to BitGo's custody integrity and historical proof-of-reserves cadence
- **No leverage**
- **Fully redeemable** — atomic redemption from the idle balance

When re-deployed, the vault inherits the collateral quality of the chosen lending market (Aave V3 WBTC).

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** trivial today (all idle); when re-deployed, reads the underlying Aave aWBTC balance on-chain
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 5 days

## Liquidity Risk

**Today:** trivially atomic. Total assets = total idle, so any user redemption settles against the vault's WBTC balance with no slippage and no strategy unwind.

**When re-deployed:**

- **Exit pipeline:** ERC-4626 `withdraw` → strategy `withdraw` → Aave V3 WBTC withdrawal
- **Underlying liquidity:** the Aave V3 WBTC market has historically had **narrower available-liquidity windows than USD stablecoin markets** — large redemptions could compete with utilization and require partial waits
- **Same-asset:** WBTC-denominated share token — no price-divergence risk inside the vault (BTC custody risk is upstream of the vault)
- **No DEX liquidity needed** — exits via the protocol's own redemption mechanics
- **No withdrawal queue or cooldown** — atomic redemption
- **Deposit limit:** 100,000 WBTC cap vs 47.5051 WBTC TVL — the cap is materially oversized at the current size, but does not by itself impair liquidity (it would only become relevant if TVL grew dramatically and a single redeemer wanted to exit a large fraction)

The single-venue queued strategy means re-deployed liquidity has no diversification cushion. If the Debt Allocator routes funds into the Aave V3 WBTC market, **liquidity becomes a function of Aave's WBTC utilization at the moment of withdrawal** — this is a meaningful change from the trivially-liquid current snapshot. Captured under Reassessment Triggers.

## Centralization & Control Risks

### Governance

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | QUEUE, REPORTING, DEBT, MAX_DEBT, DEPOSIT_LIMIT, WITHDRAW_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

ySafe 6-of-9 signers include publicly known DeFi contributors — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig).

**Properties:**

1. **No EOA holds vault roles directly**
2. **Strategy additions and accountant changes pass through 7-day timelock**
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself
4. **Vault contract is immutable** — Vyper minimal proxy
5. **Same governance pattern across 37+ vaults**

### Programmability

- **PPS:** ERC-4626, fully algorithmic
- **Vault operations:** permissionless deposit / withdraw on-chain
- **Strategy reporting:** automated via keeper (when strategy is funded)
- **Debt allocation:** Debt Allocator (automated) + Brain (manual) — currently 0 deployed
- **Off-chain inputs:** none

### External Dependencies

**Today:** none directly funded. The only critical dependency is the underlying WBTC token itself (and its BitGo-custodied BTC backing).

**When re-deployed (steady-state):**

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **WBTC (BitGo)** | Critical (underlying asset) | Wrapped BTC; relies on BitGo's custody integrity and proof-of-reserves practice |
| **Aave V3** | High (when funded) | Blue-chip, $30B+ TVL |

**Dependency quality (when re-deployed):** single-venue (Aave V3) but blue-chip. Less diversified than yvUSDT-1's queued mix; comparable to a single-venue lending vault.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded
- **Operational anomalies:**
  - Current 100%-idle posture is itself an operational signal — Brain / Debt Allocator have actively pulled all debt. Per the Yearn team this was a precautionary action following the rsETH bridge exploit (unverified attribution); reassess once funds re-deploy
  - **Oversized deposit cap (100,000 WBTC ≈ $7.7B)** vs current 47.5 WBTC TVL — not a safety risk while the vault is undeployed, but should be tightened or its rationale documented before funds re-deploy. Action item under Reassessment Triggers
  - **Not yet in `alert_large_flows.py` monitoring list** — likely an oversight given how recently the vault was deployed and that it currently holds no debt. Recommend Yearn adds it before any meaningful TVL

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. Important: **yvWBTC-1 is NOT yet in the `alert_large_flows.py` `VAULTS` dictionary** (verified against the script). The other five mainnet risk-1 vaults (yvUSDC-1, yvUSDS-1, yvWETH-1, yvDAI-1, yvUSDT-1) are present. Recommend adding yvWBTC-1 before any meaningful TVL.

Other monitoring that does cover yvWBTC-1 implicitly via the broader Yearn V3 set:

- **Endorsed vault check** (`yearn/check_endorsed.py`) — weekly
- **Timelock monitoring** (`timelock/timelock_alerts.py`)

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvWBTC-1 Vault | [`0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708`](https://etherscan.io/address/0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708) | PPS (`convertToAssets(1e8)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| Aave V3 WBTC Lender | [`0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc`](https://etherscan.io/address/0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **Idle ratio change** — currently 100%; a drop indicates re-deployment, which should trigger reassessment
- **Strategy `current_debt` changes** — `DebtUpdated` events on the vault
- **Strategy additions / removals** — `StrategyChanged` events (new strategies pass through 7-day timelock)
- **Emergency actions** (`Shutdown`)
- **ySafe / Brain / Security signer or threshold changes**
- **PPS decrease** — should only increase outside of explicit loss events
- **Deposit-limit changes** — particularly relevant given the current oversized cap
- **WBTC-specific:** BitGo custody / proof-of-reserves issues, WBTC-BTC peg deviation, blacklisting events

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e8)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio — **key early signal that re-deployment has begun** | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `deposit_limit()` | Vault | Cap monitoring (currently oversized) | Daily |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Daily |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~23 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **No Sky / USDS exposure:** yvWBTC-1's queue is WBTC-native and does not route through the Sky / USDS stack — this vault is excluded from the Sky concentration risk affecting the other stable risk-1 vaults
- **Trivially liquid today** — 100% idle, atomic redemption with no slippage
- **No leverage. No cross-chain. No conversion hops** in the queued strategy
- **Blue-chip queued dependency:** Aave V3 is the most-audited and largest-TVL lending protocol in DeFi

### Key Risks

- **Idle posture (100% un-deployed):** per the Yearn team this is a precautionary deallocation following the April 18, 2026 rsETH bridge exploit (see [hgETH report](./kerneldao-hgeth.md) for verified facts about the event). The team's specific causal attribution has not been independently verified, but the rsETH event itself is well documented. The current dependency profile, liquidity, and complexity assessments do not reflect steady-state operation
- **Newest and least mature vault** of the six mainnet risk-1 vaults (~11.5 months only). PPS appreciation is essentially zero (1.000036) reflecting the mostly-undeployed history
- **No yield while idle** — depositors today earn 0% APR on the idle balance (PPS is essentially flat)
- **Single-venue queued strategy:** when re-deployed, the vault concentrates in the Aave V3 WBTC market with no diversification cushion. WBTC market liquidity is historically narrower than USD-stablecoin markets
- **Oversized deposit cap (100,000 WBTC ≈ $7.7B)** vs current 47.5 WBTC TVL — not a safety risk while undeployed but should be tightened before re-deployment
- **Not in `alert_large_flows.py`** monitoring list — should be added before meaningful TVL
- **Operational signal:** the deallocation indicates Brain / Debt Allocator can rapidly pull all debt — this is a strength in incident response but a sign that operational posture matters here
- **WBTC-specific:** BitGo custody risk is inherent to the underlying asset; this is not specific to yvWBTC-1
- **Re-deployment risk:** when the Debt Allocator re-deploys, dependency, liquidity, and complexity scores need to be re-evaluated against the actual deployed mix

### Critical Risks

- None identified. All gates pass. The current idle posture and oversized deposit cap are temporary / cosmetic concerns rather than fundamental risks to the vault.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Score reflects current snapshot state (100% idle).** Reassess when funds re-deploy.

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Aave V3 extensively audited. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + 100% idle WBTC verifiable on-chain. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. v3.0.4 patch reviewed internally. Queued underlying protocol (Aave V3): blue-chip, multi-firm coverage |
| Bug bounty | $200K (Yearn Immunefi) |
| Production history | **~11.5 months** (May 13, 2025) — youngest of the six mainnet risk-1 vaults. V3 framework: ~23 months |
| TVL | **47.5051 WBTC** (~$3.64M). Deposit limit: 100,000 WBTC (oversized) |
| Security incidents | None on V3, none on the queued underlying protocol |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.7 / 5** — strong audit coverage, no incidents, but the **youngest vault in the set** (~11.5 months) and the **mostly-undeployed history** mean the operational track record specifically for this vault is materially shorter than for yvUSDC/USDS/DAI/USDT. Score ticked above 1.5 to reflect this.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | 7-day delay on `ADD_STRATEGY` and `ACCOUNTANT`. Self-governed |
| Privileged roles | Well-distributed; no role concentration |
| EOA risk | None |

**Governance Score: 1.0 / 5** — textbook score-1 governance.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals |
| Strategy reporting | Programmatic via keeper (idle today) |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |

**Programmability Score: 1.0 / 5** — fully programmatic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (today) | 0 funded strategies |
| Protocol count (queued) | 1 (Aave V3) — single-venue |
| Criticality | Today: only the WBTC token itself (BitGo custody). When re-deployed: Aave V3 WBTC market |
| Quality | Top-tier (Aave V3 is blue-chip) |

**Dependencies Score: 2.0 / 5** — current 100%-idle state means today's only material dependency is WBTC itself; when re-deployed, single-venue Aave V3 (blue-chip but no diversification) keeps this from being lower. Per rubric, "1–2 blue-chip dependencies" = 2.

**Centralization Score = (1.0 + 1.0 + 2.0) / 3 ≈ 1.3**

**Score: 1.3 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain WBTC (today, all idle at vault contract) |
| Collateral quality | WBTC is custodied by BitGo. Quality depends on BitGo's custody integrity and proof-of-reserves cadence |
| Leverage | None |
| Verifiability | WBTC ERC-20 balance fully on-chain; the BTC backing is off-chain (BitGo custody) |

**Score: 1.5 / 5** — top-tier on-chain backing of WBTC, but WBTC's wrapped-asset structure (off-chain custody) is a half-step risk above pure on-chain assets like USDC/USDT/DAI/USDS, all of which also have off-chain backing but with different custody models. Conservative half-step bump.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain at the vault — anyone can verify yvWBTC-1's WBTC balance |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers (idle today) with 5-day profit unlock |
| Third-party verification | Underlying WBTC balance trivially on-chain; BitGo's proof-of-reserves is published off-chain |

**Score: 1.0 / 5** — excellent on-chain provability for the vault layer.

**Funds Management Score = (1.5 + 1.0) / 2 = 1.25**

**Score: 1.3 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | 100% idle today — atomic, no slippage, no strategy unwind |
| Liquidity depth | Trivially excellent today (idle balance covers any redemption up to TVL) |
| Large holder impact | None today — full balance redeemable |
| Same-value asset | WBTC-denominated |
| Withdrawal restrictions | None |

**Score: 1.0 / 5** — trivially liquid today. **When the Debt Allocator re-deploys** to the Aave V3 WBTC market, the liquidity score may need to step up — Aave's WBTC market historically has narrower available-liquidity windows than USD stablecoin markets, and the single-venue queued strategy means no diversification cushion. Captured under Reassessment Triggers.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. **Demonstrated again here** — Brain / Debt Allocator pulled all debt as a precaution following the rsETH bridge exploit (per Yearn team, unverified attribution) |
| Monitoring | Active alerts, but **yvWBTC-1 is NOT yet in `alert_large_flows.py`** — should be added before any meaningful TVL |
| Deposit cap hygiene | **100,000 WBTC cap (≈ $7.7B) vs 47.5 WBTC TVL** is materially oversized. Not a safety risk while undeployed but should be tightened |

**Score: 1.5 / 5** — top-tier operational maturity at the framework level, half-step bump for the missing monitoring entry and the oversized deposit cap on this specific vault.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.7 | 20% | 0.340 |
| Centralization & Control | 1.3 | 30% | 0.390 |
| Funds Management | 1.3 | 30% | 0.390 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **1.345 → 1.5 / 5.0** |

Rounded conservatively to 1.5 to reflect the youngest-vault status, single-venue queued strategy, oversized deposit cap, and missing monitoring entry — collectively a step above the score-1.3 yvUSDT-1 / yvDAI-1 / yvUSDS-1 reports despite a structurally similar governance and idle-posture story.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal / Low boundary (1.5 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (October 2026) or annually
- **TVL-based:** Reassess if TVL exceeds 200 WBTC (~$15M) or changes by ±50%
- **rsETH-related deallocation:**
  - **rerun this assessment once Yearn re-deploys funds back into yvWBTC-1.** The current 100%-idle posture, dependency profile, and liquidity score all need re-evaluation against the actual re-deployed strategy mix
  - if any new strategy is added that takes direct or indirect rsETH exposure, full re-review of the dependency subscore
- **Strategy posture:**
  - **if a new USDS-denominated or Sky-routed strategy is added** to yvWBTC-1, the "no Sky concentration" exclusion no longer holds — re-evaluate dependency and concentration scores against the broader risk-1 stable stack
  - if more strategies are added to broaden the queue beyond Aave V3, re-evaluate the dependency subscore
- **Underlying-protocol incidents:** any major incident at Aave V3 or to the WBTC market specifically — full re-review
- **Action items (operational hygiene):**
  - **Tighten the deposit cap** — current `deposit_limit = 100,000 WBTC` (≈ $7.7B at snapshot) is materially above any plausible near-term TVL. Either tighten the cap (e.g. to a multiple of intended TVL) or document the rationale with the Yearn team and revisit this report before re-deployment
  - **Add yvWBTC-1 to `alert_large_flows.py`** monitored vault list before any meaningful TVL
- **WBTC-specific:**
  - BitGo proof-of-reserves issues
  - sustained WBTC-BTC peg deviation
  - significant blacklisting / freezing events affecting WBTC
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvWBTC-1 (v3.0.4)   │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  0x751F…b708          │                                          │
│  │                       │                                          │
│  │  47.5 WBTC TVL        │                                          │
│  │  (~$3.64M)            │                                          │
│  │  100% idle            │  ← all WBTC held at vault contract       │
│  │  totalDebt = 0        │                                          │
│  │  deposit_limit=100k   │  ← oversized vs TVL                      │
│  └───────────────────────┘                                          │
│                                                                      │
│  1 dormant strategy in queue (WBTC-native, no Sky/USDS routing):    │
│   - Aave V3 WBTC Lender                                              │
└──────────────────────────────────────────────────────────────────────┘

When re-deployed (steady-state intent), the vault routes into a single
blue-chip WBTC lending venue (Aave V3). Less diversified than yvUSDT-1's
queued mix, but Aave V3 is the most extensively audited and largest-TVL
lending protocol in DeFi. The vault remains fully outside the Sky / USDS
concentration that affects yvUSDC-1 / yvUSDS-1 / yvDAI-1.
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — same timelock used by 37+ Yearn V3 vaults including all six mainnet risk-1 vaults. `getMinDelay() = 604800` (7 days).

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)`) |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | Sole proposer |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper: Brain (3/8) + deployer EOA can call `execute()` through it |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-8 Safe | Cancel pending proposals |

To shorten the delay, Daddy 6/9 must propose `updateDelay()`, wait 7 days during which Brain or Daddy can cancel, then execute. DEFAULT_ADMIN was never granted, so no party can self-grant PROPOSER or TIMELOCK_ADMIN to skip the flow.
