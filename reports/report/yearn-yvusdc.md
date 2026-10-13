# Protocol Risk Assessment: Yearn — yvUSDC-1

- **Assessment Date:** May 11, 2026 (Updated: October 13, 2026)
- **Token:** yvUSDC-1 (USDC-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204)
- **Final Score: 1.47/5.0**

## Overview + Links

yvUSDC-1 is a **USDC-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDC into yield strategies on Ethereum mainnet. The vault holds **~$19.70M USDC** and is **~99.75% deployed** at the snapshot (`totalIdle ≈ $48.7K`). Debt is split across **four funded strategies**: stcUSD/USDC Pawn Broker Market (~30.7% — active but NOT in the default withdrawal queue), Yearn USDC / Morpho MetaMorpho (~30.1%), USDC to USDS Depositor (~28.5%), and USDC to sUSDS Lender (~10.7%). A Spark USDC Lender remains queued at 0 debt. All previously revoked Morpho, Fluid, and Aave V3 strategies remain revoked (`activation = 0`).

Funded debt spans three governance ecosystems: Sky (~39.2% via the sUSDS Lender and the USDS Depositor), Cap (~30.7% via the Pawn Broker's stcUSD collateral), and Morpho Blue (~30.1% via the Yearn-curated MetaMorpho vault). The Pawn Broker's only borrower is the **stcUSD/USDC Pawn Broker Looper**, a 7.8x leveraged stcUSD strategy wholly owned by Yearn's [yvUSD vault](./yearn-yvusd.md). That makes yvUSD's looper the sole credit counterparty for ~30.7% of yvUSDC-1.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDC deposits, issuing yvUSDC-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the Yearn V3 Vault Factory
- **Strategy pipelines:** sUSDS Lender path: USDC → DAI (via MakerDAO PSM Lite at 1:1, 0 fee) → USDS (via DAI-USDS Exchanger at 1:1) → sUSDS (Sky Savings vault). USDS Depositor path: same USDC → DAI → USDS conversion, then USDS → [yvUSDS-1](./yearn-yvusds.md), which is 100% allocated to its Grove USDS Compounder (Sky USDS → GROVE staking-rewards farm). Yearn USDC (Morpho) path: USDC → Morpho MetaMorpho vault → Morpho Blue isolated lending markets. Pawn Broker path: USDC is lent to a single hardcoded borrower that posts stcUSD as collateral — a self-contained Yearn V3 TokenizedStrategy (v3.0.4) that holds the stcUSD on its own balance sheet and does not route through Morpho Blue. Spark USDC Lender (queued, 0 debt): would supply USDC directly to Spark Lend's USDC market
- **Governance:** Managed via the standard **Yearn V3 Role Manager** contract, governed by the **Yearn 6-of-9 global multisig (ySafe)** with a **7-day TimelockController** for strategy additions. The Yearn USDC MetaMorpho vault has its own governance: Security 4/7 multisig as owner, ySafe 6/9 as guardian, 2-of-3 curator Safe, 3-day timelock. The stcUSD token (Cap protocol, [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) used as Pawn Broker collateral is governed by a 3-of-5 anonymous multisig → 24h Timelock → Access Control — see the [Cap stcUSD report](./cap-stcusd.md) for full governance details
- **Default queue:** 4 strategies (USDS Depositor funded, sUSDS Lender funded, Yearn USDC — Morpho funded, Spark USDC Lender queued at 0 debt). `use_default_queue() = true`. The stcUSD/USDC Pawn Broker Market (the largest funded strategy, ~30.7%) is active but NOT in the default withdrawal queue. Legacy Morpho Gauntlet / Steakhouse / OEV / Yearn Compounder strategies, three other lenders (Fluid, Aave V3, Aave V3 Lido), and the old Spark USDC Lender remain revoked

**Key metrics (October 13, 2026, snapshot at block 26181162):**

- **TVL:** ~19,699,224 USDC (~99.75% deployed)
- **Total Supply:** ~17,567,713 yvUSDC-1
- **Price Per Share:** 1.121331 USDC/yvUSDC-1 (~12.1% cumulative appreciation since deployment)
- **Total Debt:** ~19,650,502 USDC (~99.75% of TVL)
- **Total Idle:** ~$48.7K USDC
- **Debt distribution:**
  - stcUSD/USDC Pawn Broker Market: 6,038,311.77 USDC (**30.7%** — active, NOT in default withdrawal queue)
  - Yearn USDC (Morpho MetaMorpho): 5,916,708.36 USDC (**30.1%**)
  - USDC to USDS Depositor: 5,596,548.02 USDC (**28.5%**)
  - USDC to sUSDS Lender: 2,098,933.48 USDC (**10.7%**)
  - Spark USDC Lender: 0 (queued, unfunded)
- **Deposit Limit:** 50,000,000 USDC
- **Profit Max Unlock Time:** 10 days
- **Net yield:** ~3.6% annualized (30-day trailing PPS growth, 1.118060 at [block 25966000](https://etherscan.io/block/25966000) on September 13 → 1.121331; net of fees)
- **Fees:** 0% management fee, 10% performance fee

**Dependency concentration note:** Sky-governed exposure is **~39.2%** of debt (sUSDS Lender ~10.7% + USDS Depositor ~28.5%). Cap (stcUSD) exposure is **~30.7%** through the Pawn Broker, and Morpho Blue exposure is **~30.1%** through the Yearn USDC MetaMorpho vault. The Pawn Broker is a **self-contained Yearn V3 lending strategy**: it holds stcUSD directly as collateral and lends USDC from its own balance. It does **not** route through Morpho Blue or any external lending protocol. Its collateral is **Cap's stcUSD** ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)), an ERC-4626 vault token governed by a 3-of-5 anonymous Gnosis Safe multisig → 24-hour Timelock → Access Control. All Cap core contracts are upgradeable UUPS proxies; Cap has 8 audit firms, a $1M Sherlock bug bounty, and ~14 months in production. Its borrower is yvUSD's Pawn Broker Looper, so the two Yearn vaults share a single Cap-collateralised credit book.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Sky Protocol Documentation](https://developers.skyeco.com/)
- [Sky Savings Rate (sUSDS)](https://docs.spark.fi/user-guides/earning-savings/susds)

## Contract Addresses

### Core yvUSDC-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvUSDC-1 Vault | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | Yearn V3 Vault (v3.0.2), Vyper minimal proxy |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Yearn Accountant (0% mgmt, 10% perf) |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |

### Governance Contracts

Vault role bitmasks read with `roles(address)` at the snapshot block.

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Standard Yearn Role Manager, manages 39 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — 12 of 14 vault roles (`0x3FF6`; all except ADD_STRATEGY and ACCOUNTANT) |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY (`0x3972`) |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe — DEBT, MAX_DEBT, EMERGENCY (`0x20C0`); controls the Role Manager |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay**. Holds ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (`0x8F`). Self-governed: timelock holds TIMELOCK_ADMIN_ROLE, so config changes must go through the 7-day delay |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5c13c246e117ed36437303cac8e250ab0`](https://etherscan.io/address/0x444045c5c13c246e117ed36437303cac8e250ab0) |
| Tokenized Strategy | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) |

### Active Strategies (4 in default queue; 4 with debt — 1 not in queue)

| # | Strategy | Name | Current Debt (USDC) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | **USDC to USDS Depositor** | **5,596,548.02** | **28.5%** |
| 2 | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | **USDC to sUSDS Lender** | **2,098,933.48** | **10.7%** |
| 3 | [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3) | **Yearn USDC (Morpho MetaMorpho)** | **5,916,708.36** | **30.1%** |
| 4 | [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a) | Spark USDC Lender | 0 | 0% |
| — | [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df) | **stcUSD/USDC Pawn Broker Market** | **6,038,311.77** | **30.7%** (active, NOT in default withdrawal queue) |

Allocations are shares of `totalDebt()` (19,650,501.64 USDC); per-strategy `current_debt` values sum exactly to `totalDebt()`.

**Previously revoked (all with `activation = 0`):**

- Morpho Gauntlet USDC Prime Compounder ([`0x694E47AFD14A64661a04eee674FB331bCDEF3737`](https://etherscan.io/address/0x694E47AFD14A64661a04eee674FB331bCDEF3737))
- Morpho Steakhouse USDC Compounder ([`0x074134A2784F4F66b6ceD6f68849382990Ff3215`](https://etherscan.io/address/0x074134A2784F4F66b6ceD6f68849382990Ff3215))
- Morpho OEV-boosted USDC Compounder ([`0x888239Ffa9a0613F9142C808aA9F7d1948a14f75`](https://etherscan.io/address/0x888239Ffa9a0613F9142C808aA9F7d1948a14f75))
- Morpho Yearn USDC Compounder ([`0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0`](https://etherscan.io/address/0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0))
- USDC Fluid Lender ([`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF))
- Aave V3 Lido USDC Lender ([`0x522478B54046aB7197880F2626b74a96d45B9B02`](https://etherscan.io/address/0x522478B54046aB7197880F2626b74a96d45B9B02))
- Aave V3 USDC Lender ([`0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858`](https://etherscan.io/address/0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858))
- Old Spark USDC Lender ([`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673))

**Pawn Broker queue note:** Strategy [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df) holds ~$6.04M of debt (30.7%) but is **not in the default withdrawal queue**. With `use_default_queue() = true`, user withdrawals iterate only the default queue; a caller-supplied strategy list is ignored. Even if the strategy were queued, its `availableWithdrawLimit()` equals its idle USDC — **1 wei** at the snapshot — because all of its USDC is lent out. Releasing this capital requires management (Brain) to call `callDebt()`, which gives the borrower a 7-day `CALL_DURATION` to repay before the position becomes liquidatable.

**Score impact of the current allocation:** No single ecosystem holds more than ~39.2% of debt. The Pawn Broker leg (~30.7%) concentrates credit risk on one borrower — yvUSD's 7.8x stcUSD looper — and its capital is not reachable by a standard redemption. This is reflected in the Centralization → Dependencies, Funds Management → Collateralization, and Liquidity subscores below.

### Strategy Protocol Dependencies (current allocation)

| Protocol | Strategy | Allocation | Notes |
|----------|----------|-----------:|-------|
| **Cap (stcUSD)** | stcUSD/USDC Pawn Broker Market | **30.7%** | Self-contained Yearn V3 lending strategy (v3.0.4). Single borrower: yvUSD's stcUSD/USDC Pawn Broker Looper ([`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986)), which posts stcUSD (Cap protocol, [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), ERC-4626 vault — 3-of-5 anonymous multisig, upgradeable proxies, 8 audits, $1M bug bounty) as collateral. Does NOT route through Morpho Blue. NOT in default withdrawal queue |
| **Morpho Blue** | Yearn USDC (MetaMorpho) | **30.1%** | MetaMorpho vault managed by Yearn (Security 4/7 owner, ySafe 6/9 guardian, 2-of-3 curator). Supplies cbBTC/USDC (~65.8%), WBTC/USDC (~29.2%), and wstETH/USDC (~5.1%) markets, all at 86% LLTV |
| **Sky (yvUSDS)** | USDC to USDS Depositor | **28.5%** | USDS deposited into [yvUSDS-1](./yearn-yvusds.md) (score 1.32), which is 100% in its Grove USDS Compounder (Sky USDS → GROVE staking-rewards farm). This strategy holds ~54.6% of yvUSDS-1 |
| **Sky / sUSDS** | USDC to sUSDS Lender | **10.7%** | Sky Savings Rate via sUSDS — Sky-governed |
| Spark Lend (Sky sub-DAO) | Spark USDC Lender | 0% (queued) | Unfunded |

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

The underlying vault infrastructure has been audited by 3 reputable firms. Dates follow the audit folder names in the [yearn-security repository](https://github.com/yearn/yearn-security/tree/master/audits):

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 2023 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | July 2023 | V3 Vaults (v3.0.1) | PDF |
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | March 2024 | V3 Vaults (v3.0.2) | PDF |

The Pawn Broker Market and its borrower, the Pawn Broker Looper, have no dedicated external audit in the yearn-security repository. Both delegate to the audited TokenizedStrategy implementation.

### Sky/MakerDAO Audits (Underlying Protocol)

Sky (formerly MakerDAO) is one of the most extensively audited DeFi protocols:

| Auditor | Coverage | Notes |
|---------|----------|-------|
| ChainSecurity | 9 audits covering USDS, sUSDS, Endgame Toolkit, LockStake, VoteDelegate | Core security partner |
| Cantina | 10 audit reports including sUSDS (Sep 2024) and USDS (Jul 2024) | Comprehensive coverage |
| Sherlock | Public audit contest (Aug 2024) | Community audit |
| Trail of Bits | Core DAI system (legacy MCD) | Historical audit |
| PeckShield | Core DAI system (legacy MCD) | Historical audit |
| Quantstamp | Liquidations 2.0 | Historical audit |
| ABDK | Vote Delegate security | Governance audit |

**LitePSM** (used for USDC → DAI conversion): Audited by both ChainSecurity and Cantina.

### Strategy Review Process

All strategies go through Yearn's formal **12-metric risk scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)), covering:

- **Strategy scores:** Review level (ySec security review), testing coverage (95%+ for score 1), complexity (sLOC), risk exposure, centralization risk, protocol integration count
- **External protocol scores:** Audit count, centralization, TVL, longevity, protocol type

### Bug Bounty

- **Yearn (Immunefi):** Active bug bounty. Max payout: **$200,000** (Critical). Scope includes V3 vaults. 40 smart contracts in scope. Median resolution: 18 hours
  - Link: https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** Also listed: https://audits.sherlock.xyz/bug-bounties/30
- **Sky/MakerDAO (Immunefi):** Active bug bounty. Max payout: **$10,000,000** (Critical). Scope includes DAI, USDS, sUSDS, PSM, and all core contracts
  - Link: https://immunefi.com/bug-bounty/sky/
- **Morpho (Cantina):** Active bug bounty. Max payout: **$2,500,000** (Critical).
  - Link: https://cantina.xyz/bounties/35a5f0a1-2ffd-432c-8f3b-77d169add8c3
- **Safe Harbor:** Yearn is not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvUSDC-1 system is **low-to-moderate complexity**:

- **4 funded strategies** on a single chain (Ethereum): Pawn Broker Market (~30.7%, self-contained lender to a leveraged looper), Yearn USDC / Morpho MetaMorpho (~30.1%), USDS Depositor (~28.5%, via yvUSDS-1), and sUSDS Lender (~10.7%). One strategy queued at 0 debt
- **Simple pipelines on the vault side:** sUSDS Lender: USDC → DAI → USDS → sUSDS (three 1:1 conversions + deposit). USDS Depositor: same conversions, then a deposit into yvUSDS-1. Yearn USDC: USDC → Morpho MetaMorpho vault. Pawn Broker: USDC lent directly to one borrower against stcUSD collateral held on the strategy's own balance sheet (v3.0.4)
- **No leverage inside yvUSDC-1.** Leverage sits one hop away: the Pawn Broker's borrower is yvUSD's looper, which runs ~7.79x leverage on stcUSD using Morpho Blue flashloans
- **No cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** March 12, 2024 (block 19,419,991) — **~31 months** in production
- **TVL:** ~19,699,224 USDC (~$19.70M), well within the $50M deposit limit. TVL was ~$29.84M on May 11, 2026, ~$25.49M on July 12, 2026, and ~$19.85M on September 14, 2026
- **PPS trend:** 1.000000 → 1.121331 (~12.1% cumulative return, ~4.5% annualized over ~31 months)
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** Active portfolio management. The vault has used Aave V3, Compound V3, Morpho, Spark, Fluid, Sky, and Cap-collateralised Pawn Broker strategies. The old Spark USDC Lender was removed from the queue between May 11 and July 12, 2026. The Pawn Broker Market and the Spark USDC Lender were activated on June 26, 2026. Allocation history:
  - **May 11, 2026:** sUSDS Lender ~97%, old Spark USDC Lender ~3%
  - **July 12, 2026:** sUSDS Lender ~77.9%, Pawn Broker ~14.9% ($3.81M), Yearn USDC ~7.2% ($1.82M)
  - **September 14, 2026:** Yearn USDC ~35.6%, Pawn Broker ~30.3%, sUSDS Lender ~22.2%, USDS Depositor ~11.9%
  - **October 13, 2026:** Pawn Broker ~30.7%, Yearn USDC ~30.1%, USDS Depositor ~28.5%, sUSDS Lender ~10.7%
- **Pawn Broker history:** Since deployment ([block 25282148](https://etherscan.io/block/25282148)), the Pawn Broker has emitted no `DebtCalled`, `Liquidated`, `Paused`, `LiquidatorUpdated`, or `RateUpdateScheduled` events
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~29 months). No V3 vault exploits

**Yearn protocol TVL:** ~$200M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn-finance), October 13, 2026).

**Sky/sUSDS track record:**
- sUSDS launched as part of Sky Endgame (2024)
- TVL: ~5.03B USDS in sUSDS (`totalAssets()` at the snapshot)
- No security incidents since launch
- Sky Savings Rate (SSR): ~3.80% APY (`ssr()` at the snapshot), set by Sky Governance
- Revenue sourced from over-collateralized loans and tokenized Treasury bill (RWA) investments

## Funds Management

yvUSDC-1 deploys deposited USDC into yield strategies with ~99.75% capital utilization. At the October 13 snapshot, debt is split across **four funded strategies**: stcUSD/USDC Pawn Broker Market (~30.7%), Yearn USDC / Morpho MetaMorpho (~30.1%), USDC to USDS Depositor (~28.5%), and USDC to sUSDS Lender (~10.7%). The Pawn Broker is a **self-contained Yearn V3 lending strategy** (v3.0.4): it holds stcUSD directly as borrower collateral and lends USDC from its own balance sheet, without routing through Morpho Blue. It is active and funded but **not in the default withdrawal queue**. The Spark USDC Lender sits in the queue at 0 debt. All `current_debt` values sum exactly to `totalDebt`, so there is no accounting gap.

### Strategy 1: USDC to USDS Depositor (~28.5% allocation)

**Contract:** [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) (TokenizedStrategy v3.0.3)

**Conversion pipeline:**

1. **USDC → DAI** via MakerDAO PSM Lite ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) — 1:1 at **0% fee** (both `tin` and `tout` set to 0)
2. **DAI → USDS** via Sky DAI-USDS Exchanger ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A)) — 1:1, no fee
3. **USDS → yvUSDS-1** ([`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8)), a Yearn V3 ERC-4626 vault. The strategy's ~5.60M USDS position is ~54.6% of yvUSDS-1's ~10.25M USDS. yvUSDS-1 is 100% allocated to its Grove USDS Compounder ([`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622)), which stakes USDS in the Sky USDS → GROVE staking-rewards farm. See the [yvUSDS-1 report](./yearn-yvusds.md) (score: 1.32/5.0)

**Withdrawal pipeline:** Reverse path (yvUSDS → USDS → DAI → USDC). If PSM `tout` fee exceeds 0.05%, the strategy falls back to **Uniswap V3** swap with 0.5% slippage tolerance. `availableWithdrawLimit()` = ~5.60M USDC at the snapshot.

**Strategy parameters:**
- Deposit limit: 100,000,000 USDC
- Max acceptable PSM fee: 0.05% (falls back to Uniswap V3 if exceeded)
- Management: Brain multisig (3-of-8)
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Strategy 2: USDC to sUSDS Lender (~10.7% allocation)

**Contract:** [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) (TokenizedStrategy v3.0.4)

**Conversion pipeline:**

1. **USDC → DAI** via MakerDAO PSM Lite — 1:1 at 0% fee
2. **DAI → USDS** via Sky DAI-USDS Exchanger — 1:1, no fee
3. **USDS → sUSDS** via Sky Savings vault ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) — earns the SSR (~3.80% APY)

**Withdrawal pipeline:** Reverse path (sUSDS → USDS → DAI → USDC). Same PSM fee fallback to Uniswap V3.

**Strategy parameters:** Same as USDS Depositor (100M deposit limit, 0.05% max PSM fee, Brain multisig management)

### Strategy 3: Yearn USDC / Morpho MetaMorpho (~30.1% allocation)

**Contract:** [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)

**Pipeline:** The strategy is the **Morpho MetaMorpho vault** itself, deployed on **Morpho Blue** ([`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)). yvUSDC-1 holds ~96.0% of its shares (~$5.92M of ~$6.17M `totalAssets()`). The MetaMorpho vault is managed by Yearn: **owner** = Security multisig (4-of-7, [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0)), **guardian** = ySafe/Daddy (6-of-9, [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)), **curator** = 2-of-3 Safe [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51). It has a **3-day timelock** (259,200 seconds). Fee is 0%.

**Market allocation (snapshot):**

| Market | Collateral | LLTV | Supplied (USDC) | Share |
|--------|-----------|-----:|----------------:|------:|
| [`0x64d65c9a…fcc64`](https://app.morpho.org/ethereum/market/0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64/) | cbBTC | 86% | ~4,055,911 | ~65.8% |
| [`0x3a85e619…ee49`](https://app.morpho.org/ethereum/market/0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49/) | WBTC | 86% | ~1,798,957 | ~29.2% |
| [`0xb323495f…86cc`](https://app.morpho.org/ethereum/market/0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc/) | wstETH | 86% | ~311,733 | ~5.1% |

Two further cbBTC and wstETH markets hold dust (<$4K each).

**Strategy parameters:**
- Max debt: 50,000,000 USDC
- Morpho Blue: [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)
- MetaMorpho owner: Security (4-of-7)
- MetaMorpho guardian: ySafe (6-of-9)
- MetaMorpho curator: 2-of-3 Safe
- MetaMorpho timelock: 3 days
- Fee: 0%

### Strategy 4: stcUSD/USDC Pawn Broker Market (~30.7% allocation)

**Contract:** [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df) (`PawnBroker`, TokenizedStrategy v3.0.4, [verified source](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df#code))

**Pipeline:** A **single-borrower pawn broker**. The immutable `BORROWER` posts **stcUSD** (Cap's staked USD ERC-4626 vault token, [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) as collateral and borrows USDC from the strategy at a fixed `rate`. The strategy does **not** route funds through Morpho Blue or any external lending protocol. yvUSDC-1 owns 100% of the strategy's shares (`allowed(vault) = true`).

**Borrower:** [`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986) — the **stcUSD/USDC Pawn Broker Looper** (`PawnBrokerLooper`, TokenizedStrategy v3.0.4; management Brain, emergency admin Security). Its shares are 100% held by [yvUSD](https://etherscan.io/address/0x696d02db93291651ed510704c9b286841d506987) (see the [yvUSD report](./yearn-yvusd.md), score 2.46/5.0). The looper uses Morpho Blue flashloans to build a levered stcUSD position: `getCurrentLeverageRatio()` = 7.79x (target 8.0x, max 8.5x), with ~$889K of equity (`totalAssets()`).

**Position at the snapshot:**

| Getter | Value |
|--------|-------|
| `totalCollateral()` | 6,392,939.74 stcUSD (~$6.94M at the oracle price) |
| `totalDebt()` | 6,046,391.50 USDC |
| `currentLtv()` | 87.16% |
| `LLTV` (immutable) | 91.50% |
| `isHealthy()` / `isSolvent()` | true / true |
| `rate` | 450 bps (4.5% APR, fixed; changes are delayed by `CALL_DURATION`) |
| `CALL_DURATION` | 7 days |
| `liquidationBonusBps` | 100 (1%) |
| `calledDebt` / `callDeadline` | 0 / 0 |
| `paused` | false |
| Idle USDC (`availableWithdrawLimit`) | 1 wei |

**Liquidation buffer:** The oracle-measured value of the collateral can fall ~4.7% before LTV reaches the 91.5% LLTV. The borrower's equity absorbs the first ~12.8% decline: yvUSDC-1 principal is impaired only if collateral value falls below the $6.05M debt and liquidation does not recover it. Only management (Brain) or allowlisted liquidators may call `liquidate()`. No `LiquidatorUpdated` event has ever been emitted, so Brain is the only liquidator.

**Oracle:** [`0x8E3386B2f6084eB1B0988070c3d826995BD175c0`](https://etherscan.io/address/0x8E3386B2f6084eB1B0988070c3d826995BD175c0) (`MorphoChainlinkOracleV2`, price ≈ 1.0851 USDC/stcUSD). It multiplies the Ojo Yield Risk Engine stcUSD/cUSD exchange rate ([`0x797Fa8167C35b19A30a5E7973561588BfEc0A086`](https://etherscan.io/address/0x797Fa8167C35b19A30a5E7973561588BfEc0A086), upgradeable proxy) by the RedStone `cUSD_FUNDAMENTAL` feed ([`0x9A5a3c3Ed0361505cC1D4e824B3854De5724434A`](https://etherscan.io/address/0x9A5a3c3Ed0361505cC1D4e824B3854De5724434A), upgradeable proxy), divided by Chainlink USDC/USD ([`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6)). It tracks stcUSD's redemption value rather than its secondary-market price, so a market-only stcUSD depeg would not move LTV or trigger liquidation. The strategy reports `idle + min(debt, collateral value)`, so a fall in oracle value below the debt is passed to yvUSDC-1 as a loss at the next report.

**stcUSD / Cap governance:** stcUSD is issued by **Cap (Covered Agent Protocol)** — a stablecoin protocol where cUSD is backed 1:1 by whitelisted reserves and operators borrow reserves secured by Symbiotic restaking collateral. stcUSD is the yield-bearing ERC-4626 vault wrapping cUSD (~66.48M supply, ~72.13M cUSD total assets, PPS ~1.0851 at the snapshot). Cap governance: **3-of-5 anonymous Gnosis Safe multisig** ([`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793)) → **24-hour TimelockController** ([`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab)) → **Access Control** ([`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683)). All core contracts (cUSD, stcUSD, Access Control) are **upgradeable UUPS proxies**. Cap has been audited by **8 firms** (9 reports: Trail of Bits, Spearbit, Zellic, Sherlock contest, Certora, Electisec, Recon, Octane), holds a **$1M Sherlock bug bounty**, and has been in production since August 2025 (~14 months). See the [Cap stcUSD risk report](./cap-stcusd.md) (score: 2.39/5.0) for the full assessment. Key governance risks: 3-of-5 threshold with anonymous signers, all core contracts upgradeable through the 24h timelock, and a deployer EOA retaining an EXECUTOR_ROLE on the timelock.

**Queue status:** The strategy is **active with ~$6.04M of debt but NOT in the default withdrawal queue**, and its withdrawable idle balance is 1 wei. Exiting requires Brain to call `callDebt()`. The looper then has 7 days to deleverage and repay; after the deadline Brain can liquidate. This is a potential liquidity bottleneck for ~30.7% of deployed capital under heavy redemptions.

**Strategy parameters:**
- Max debt (vault): 10,000,000 USDC
- Implementation: Yearn V3 TokenizedStrategy v3.0.4 ([`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c))
- Management: Brain (3-of-8); emergency admin: Security (4-of-7); keeper: yHaaSRelayer
- Performance fee: 0%
- Activation: 1782490163 (June 26, 2026)

### Strategy 5: Spark USDC Lender (0% — queued)

**Contract:** [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a)

**Pipeline:** Direct USDC supply to **Spark Lend**'s USDC market. Spark Lend is a Sky sub-DAO governed by Sky / Spark governance. The strategy was activated on June 26, 2026, replacing the old Spark USDC Lender (0x25f893), and has 0 debt.

**Strategy parameters:** Brain multisig management, keeper-driven reporting, ERC-4626 throughout.

### Revoked and removed strategies (historical context)

The old Spark USDC Lender ([`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673)) was **removed** from the default queue between May 11 and July 12, 2026. Its debt (previously ~$851K) was fully migrated; residual dust of ~2 USDC remains. All previously revoked Morpho, Fluid, and Aave V3 strategies remain with `activation = 0`. Independent attribution of the queue changes has not been verified.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSDC-1 (ERC-4626 standard). Subject to $50M deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDC-1 for USDC. Withdrawals draw on idle USDC, then the default queue: USDS Depositor and sUSDS Lender unwind through USDS → DAI → USDC, and Yearn USDC redeems from the MetaMorpho vault. The Pawn Broker is outside the queue and has no idle USDC
- **No cooldown or lock period** — unlike yvUSD's LockedyvUSD wrapper
- **Fees:** 0% management fee, 10% performance fee (taken via accountant during `process_report`)

### Token Mint Authority

**Mint mechanism:** Permissionless ERC-4626 deposit. Anyone can call `deposit(uint256, address)` or `mint(uint256, address)` on the yvUSDC-1 vault and receive shares proportional to USDC deposited. Yearn V3 vaults do not implement a privileged `MINTER_ROLE` on the share token.

**Mint requires backing:** Yes — atomic. Shares are minted only against USDC transferred into the vault in the same transaction. The vault cannot mint shares without a corresponding USDC inflow.

**Per-address mint authority** (verified onchain via Yearn V3 source; `0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any caller of `deposit()` / `mint()` | ✓ | ✓ | Permissionless ERC-4626 | Subject to the $50M `depositLimit` set by `DEPOSIT_LIMIT_MANAGER` (Daddy / Brain) |

**Rate limits / supply caps:** `depositLimit = 50,000,000 USDC` (configurable by `DEPOSIT_LIMIT_MANAGER`). No per-block mint cap.

**Backing check at mint time:** Atomic. The Vyper vault's `_deposit` enforces `asset.transferFrom(caller, vault, assets)` before `_mint(receiver, shares)` — minting without an asset inflow is impossible.

### Collateralization

- **100% onchain USDC backing** — all deposits are USDC, deployed into the self-contained Pawn Broker (stcUSD/USDC ~30.7%), Morpho Blue (Yearn USDC MetaMorpho ~30.1%), the Sky-governed USDS Depositor via yvUSDS-1 (~28.5%), and the Sky-governed sUSDS Lender (~10.7%)
- **Collateral quality:** sUSDS is backed by over-collateralized loans and RWA (Treasury bills) via Sky. yvUSDS-1 holds USDS staked in a first-party Sky staking-rewards farm. The MetaMorpho vault supplies USDC into cbBTC, WBTC, and wstETH markets on Morpho Blue at 86% LLTV — fully onchain, isolated markets with immutable parameters. The Pawn Broker lends to one borrower against stcUSD at 87.16% LTV (91.5% LLTV); the borrower is a 7.8x leveraged Yearn looper whose ~$0.89M equity is the first-loss layer. Cap is a separate protocol with its own governance (3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock, 8 audits). See the [Cap stcUSD risk report](./cap-stcusd.md)
- **No leverage within yvUSDC-1** — the vault and its strategies are unlevered lenders and depositors. The Pawn Broker's counterparty is levered
- **Redeemability:** sUSDS, yvUSDS-1, and the MetaMorpho vault support standard ERC-4626 withdrawal. USDS converts 1:1 to DAI via the Exchanger. The Pawn Broker position (~30.7%) is outside the default queue and needs a management debt call (up to 7 days) before it can return USDC

### Provability

- **yvUSDC-1 exchange rate:** Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` is computed onchain. sUSDS, yvUSDS-1, and MetaMorpho positions convert vault shares to USDC equivalent. The Pawn Broker reports `idle + min(debt, collateral value)` using its Morpho-style oracle
- **sUSDS rate:** The Sky Savings Rate is set by Sky Governance and applied onchain via the `ssr` mechanism. The sUSDS exchange rate increases continuously based on the SSR
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 10 days (`profitMaxUnlockTime`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDC-1 for USDC via ERC-4626 `withdraw()`/`redeem()`. Withdrawals draw on idle USDC (~$48.7K), then the default queue: USDS Depositor (~28.5%, `availableWithdrawLimit` ~$5.60M), sUSDS Lender (~10.7%, ~$2.10M), Yearn USDC MetaMorpho (~30.1%; `maxWithdraw(yvUSDC-1)` returns the full ~$5.92M position, with its markets at ~90% utilization). About **69.3%** of debt plus idle is reachable by a standard redemption
- **Pawn Broker (~30.7%) is not reachable by users.** It is outside the default queue, and `use_default_queue() = true` means a caller-supplied strategy list is ignored. Its `availableWithdrawLimit()` is its idle USDC (1 wei), so even a queue change would not release funds. Brain must first call `callDebt()`. The borrower has 7 days to deleverage and repay, after which Brain can liquidate
- **Underlying depth:** MetaMorpho supplies deep USDC markets on Morpho Blue; its withdrawable amount depends on market utilization. sUSDS holds ~5.03B USDS. yvUSDC-1's ~$19.70M is a small fraction of Sky and Morpho capacity
- **PSM liquidity:** The MakerDAO PSM Lite provides DAI ↔ USDC conversion at 0% fee. PSM capacity is managed by Sky Governance. The MetaMorpho exit is directly to USDC through redemption — no PSM needed
- **No DEX liquidity needed** in the base case — exit is via the protocols' own pipelines (MetaMorpho redemption for Morpho; PSM + Exchanger for Sky; debt call and repayment for the Pawn Broker). Uniswap V3 fallback applies only to the Sky legs if PSM fees rise above 0.05%
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **No vault-level cooldown** — redemptions are atomic for queue-included strategies
- **Deposit limit:** $50M cap — generous relative to current TVL of ~$19.70M

## Centralization & Control Risks

### Governance

The yvUSDC-1 vault uses the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract.

**Governance hierarchy:**

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 roles (`0x3FF6`; not ADD_STRATEGY or ACCOUNTANT) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY (`0x3972`) |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY (`0x20C0`); controls the Role Manager |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (`0x8F`) |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

**ySafe 6-of-9 multisig signers** include publicly known contributors: Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others ([source](https://docs.yearn.fi/developers/security/multisig)).

**Governance assessment:**
1. **No EOA role concentration** — all sensitive vault roles are held by multisigs, the timelock, or Yearn bots
2. **Strategy additions and accountant changes go through a 7-day timelock** via the TimelockController (delay increased from initial 24h to 7 days on [Feb 22, 2025](https://etherscan.io/tx/0x3319d16bbf1d6f1081bcc18802a49399ccd906d347f3472370d188c33e1ece2e))
3. **Untimelocked operational powers:** Brain can reorder the queue, move debt between active strategies up to their max debt, and manage the Pawn Broker (debt calls, rate changes after a 7-day delay, liquidation) without a timelock
4. **Standard Yearn governance** — same setup used across 39 Role Manager vaults, battle-tested pattern
5. **Immutable vault** — no proxy upgrades possible

### Programmability

- **Exchange rate (PPS):** Calculated onchain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless onchain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 10 days
- **Debt allocation:** Managed by both the Debt Allocator (automated) and Brain multisig (manual). Currently split across four strategies
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Sky / USDS (sUSDS + yvUSDS-1)** | Critical | ~39.2% of current allocation: sUSDS Lender (~10.7%) and USDS Depositor via yvUSDS-1 → Grove USDS Compounder (~28.5%). ~5.03B USDS in sUSDS. Blue-chip, extensively audited, $10M bug bounty |
| **Cap (stcUSD)** | High | ~30.7% via the Pawn Broker — stcUSD is the collateral backing the only loan. Cap is relatively new (~14 months, August 2025 launch) with 3-of-5 anonymous multisig governance, upgradeable UUPS proxies (cUSD, stcUSD, Access Control), and a 24-hour timelock. Audited by 8 firms (9 reports) including Trail of Bits, Spearbit, and Zellic. $1M Sherlock bug bounty. See the [Cap stcUSD risk report](./cap-stcusd.md) (score: 2.39/5.0, Low Risk) |
| **yvUSD Pawn Broker Looper (borrower)** | High | Sole borrower of the Pawn Broker (~30.7%). 7.79x leveraged stcUSD position owned by [yvUSD](./yearn-yvusd.md) (score 2.46/5.0, Low Risk); ~$0.89M equity is the first-loss layer ahead of yvUSDC-1 |
| **Morpho Blue** | High | ~30.1% via Yearn USDC MetaMorpho (cbBTC, WBTC, wstETH markets at 86% LLTV). Morpho Blue is an isolated-market lending protocol with $1B+ TVL, audited by Spearbit, Cantina, and others. The MetaMorpho wrapper is managed by Yearn (Security 4/7 owner, ySafe 6/9 guardian, 3-day timelock). Morpho Blue also provides the looper's flashloans |
| **Pawn Broker oracle feeds** | High | Ojo stcUSD/cUSD exchange rate and RedStone `cUSD_FUNDAMENTAL` (both upgradeable proxies) plus Chainlink USDC/USD. They determine the Pawn Broker's LTV and reported value |
| **MakerDAO PSM Lite** | High | USDC ↔ DAI conversion at 1:1 for both Sky legs. 0% fee. Audited by ChainSecurity and Cantina |
| **Sky DAI-USDS Exchanger** | High | DAI ↔ USDS 1:1 conversion for both Sky legs. Core Sky infrastructure |
| **Spark Lend (Sky sub-DAO)** | Low | Spark USDC Lender queued at 0 debt. No exposure unless funded |
| **Uniswap V3 (fallback)** | Low | Only used if PSM fee exceeds 0.05%. Currently not active (PSM fee is 0%) |

**Dependency quality:** Funded dependencies span three governance ecosystems with no single one above ~39.2%: Sky (~39.2%), Cap (~30.7%), and Morpho Blue (~30.1%). Sky is top-tier (8+ years of history, $10M bug bounty, multi-billion-dollar sUSDS TVL). Morpho Blue is a well-audited, isolated-market lending protocol, and the Yearn MetaMorpho vault lends only against cbBTC, WBTC, and wstETH. The Pawn Broker leg introduces two weaker links. The first is **Cap**: 3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock, 8 audits, ~14 months in production, score 2.39/5.0 — see the [Cap stcUSD report](./cap-stcusd.md). The second is a **single leveraged borrower**, yvUSD's looper. That borrower is Yearn-operated, and its equity absorbs the first ~12.8% of collateral losses. The Pawn Broker is also outside the default withdrawal queue.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The ySafe 6-of-9 multisig has 9 named signers including prominent DeFi figures
- **Governance:** Standard Yearn V3 Role Manager — the same governance used across 39 vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator)
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code is verified on Etherscan
- **Legal:** Yearn Finance has converted its ychad.eth multisig into a BORG (cybernetic organization) via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation company with smart contract governance restrictions
- **Incident response:** Yearn has demonstrated incident response capability across 4 historical events (all V1/legacy). V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **V3 immutability:** Vault contracts cannot be upgraded — this eliminates proxy upgrade risk

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring`](https://github.com/yearn/monitoring) repository. **yvUSDC-1 is actively monitored:**

- **Large flow alerts** (`protocols/yearn/alert_large_flows.py`): yvUSDC-1 is in the monitored vault list. Alerts on deposits/withdrawals exceeding threshold via Telegram
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`): Runs daily, verifies all Yearn V3 vaults are endorsed onchain via the registry contract
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`): Monitors the Yearn TimelockController (Strategy Manager) across 6 chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDC-1 Vault | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, `deposit_limit()`, `get_default_queue()`, `use_default_queue()`, Deposit/Withdraw events |
| USDC to USDS Depositor | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | `totalAssets()`, `current_debt`, `availableWithdrawLimit()`, yvUSDS-1 allocation |
| USDC to sUSDS Lender | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | `totalAssets()`, `current_debt`, keeper report frequency |
| Yearn USDC (Morpho MetaMorpho) | [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3) | `current_debt`, `lastTotalAssets()`, market allocation, `owner()`, `guardian()`, `curator()`, `timelock()`, `fee()` |
| stcUSD/USDC Pawn Broker Market | [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df) | `currentLtv()` vs `LLTV`, `isHealthy()`, `totalDebt()`, `totalCollateral()`, `calledDebt()`, `callDeadline()`, `rate()`, `pendingRateUpdate()`, `paused()`, idle USDC, queue membership. `DebtCalled`, `Liquidated`, `LiquidatorUpdated` events |
| Pawn Broker Looper (borrower) | [`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986) | `getCurrentLeverageRatio()`, `totalAssets()` (first-loss equity), `targetLeverageRatio()` / `maxLeverageRatio()` changes |
| Pawn Broker Oracle | [`0x8E3386B2f6084eB1B0988070c3d826995BD175c0`](https://etherscan.io/address/0x8E3386B2f6084eB1B0988070c3d826995BD175c0) | `price()`; implementation changes on the Ojo and RedStone feed proxies |
| Spark USDC Lender | [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a) | `totalAssets()`, `current_debt` — currently 0 debt, monitor for activation |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer/threshold changes, submitted transactions |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes, config updates |
| Sky Savings Rate | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | `ssr()` changes, sUSDS TVL |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Utilization of the MetaMorpho markets (30.1% leg). Pawn Broker is NOT on Morpho Blue |
| stcUSD (Cap) Vault | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalSupply()`, implementation upgrades (ERC-1967 impl slot). Upgradeable UUPS proxy: monitor for implementation changes via the Timelock |
| Cap Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Signer/threshold changes, submitted transactions — 3-of-5 Gnosis Safe with anonymous signers |
| Cap Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | `getMinDelay()` (currently 24h), scheduled/executed transactions, role changes — governs all Cap contract upgrades |
| Cap Access Control | [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | `RoleGranted` / `RoleRevoked` events, DEFAULT_ADMIN_ROLE holder (Timelock), implementation upgrades |

### Critical Events to Monitor

- **PPS decrease** — any decrease in `convertToAssets(1e6)` indicates a loss event. Should only increase
- **Strategy additions/removals** — `StrategyChanged` events indicate portfolio changes (new strategies go through 7-day timelock). Also monitor MetaMorpho vault governance (owner/guardian/curator changes via timelock)
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events
- **Emergency actions** — `Shutdown` event on vault
- **ySafe signer/threshold changes** — governance integrity
- **SSR rate changes** — Sky Governance may adjust the savings rate, affecting yield
- **PSM fee changes** — if `tin` or `tout` are set above 0, it may trigger the Uniswap V3 fallback path
- **Morpho MetaMorpho governance changes** — owner ([`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0)), guardian ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)), or curator ([`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51)) changes. The vault has a 3-day timelock
- **Pawn Broker health** — alert when `currentLtv()` exceeds ~89% (LLTV 91.5%), on any `DebtCalled` or `Liquidated` event, and when `callDeadline` passes with debt still outstanding. Also watch the looper's equity (`totalAssets()`), which is the first-loss buffer
- **Pawn Broker queue status** — monitor whether the Pawn Broker strategy ([`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df)) remains out of or gets added to the default withdrawal queue. While out of the queue and fully lent, its ~$6.04M debt (~30.7%) can serve redemptions only after a debt call
- **stcUSD / Cap governance changes** — monitor stcUSD implementation upgrades ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) and Cap multisig signer/threshold changes. Cap governance: 3-of-5 anonymous multisig → 24h Timelock → Access Control. Any upgrade or governance change directly affects the Pawn Broker's collateral
- **`totalDebt` vs sum of strategy `current_debt`** — monitor that the sum of all active strategy `current_debt` values stays aligned with `totalDebt`. Any material gap could indicate an untracked strategy with debt or an unreported loss

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `currentLtv()` / `isHealthy()` | Pawn Broker | Liquidation proximity | Hourly |
| `calledDebt()` / `callDeadline()` | Pawn Broker | Debt-call status | Hourly |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | Strategy Manager Timelock | Delay change detection | Weekly |
| `ssr()` | sUSDS | Savings rate | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by ChainSecurity, yAcademy, and Statemind. No V3 exploits in ~29 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Multi-ecosystem deployment:** No ecosystem holds more than ~39.2% of debt. ~39.2% is Sky-governed (sUSDS and yvUSDS-1; multi-billion-dollar TVL, 7+ auditors, $10M Immunefi bounty). ~30.1% is on Morpho Blue (Yearn-curated MetaMorpho lending against cbBTC, WBTC, wstETH). ~30.7% is lent through the Pawn Broker against Cap's stcUSD
- **Standard Yearn governance:** Uses the Yearn V3 Role Manager with the 6-of-9 ySafe multisig (named, prominent DeFi signers). No EOA vault roles. Strategy additions go through a 7-day timelock (self-governed — config changes must also go through the 7-day delay)
- **Simple vault-side pipelines:** Morpho: USDC → MetaMorpho vault. Sky: USDC → DAI → USDS → sUSDS or yvUSDS-1 via 1:1 conversions. No leverage inside the vault, no cross-chain bridging
- **Established track record:** ~31 months in production with ~$19.70M TVL, ~12.1% cumulative return, zero incidents
- **Active monitoring:** yvUSDC-1 is in Yearn's monitoring system with Telegram alerts for large flows

### Key Risks

- **Single leveraged borrower (~30.7%):** The Pawn Broker, now the largest allocation, lends ~$6.05M to one borrower: yvUSD's stcUSD looper at 7.79x leverage. LTV is 87.16% against a 91.5% LLTV, so a ~4.7% fall in oracle-measured stcUSD value makes the position liquidatable. yvUSDC-1 loses principal only if the fall exceeds ~12.8% (wiping the looper's ~$0.89M equity) and liquidation does not recover the shortfall. Only Brain can liquidate, and the 1% liquidation bonus may not attract external buyers in a stress event
- **Oracle design:** The Pawn Broker's oracle prices stcUSD from its exchange rate and a fundamental cUSD feed, not market price. A secondary-market stcUSD depeg would not trigger liquidation, but a real loss of Cap reserves would. Both feeds are upgradeable proxies outside Yearn's control
- **Pawn Broker withdrawal gap:** The Pawn Broker (~30.7%, ~$6.04M) is **not in the default withdrawal queue**, and its idle USDC is 1 wei. With `use_default_queue() = true`, users cannot reach it. Releasing the capital needs a Brain `callDebt()` and up to 7 days for repayment
- **Cap (stcUSD) governance risk:** Cap governs through a **3-of-5 anonymous Gnosis Safe multisig** → 24-hour Timelock → Access Control, with all core contracts upgradeable (UUPS proxies). Cap carries strong audit coverage (8 firms, 9 reports) and a $1M Sherlock bug bounty. Its anonymous signers and upgradeable contracts still present higher governance risk than Yearn or Sky. See the full [Cap stcUSD risk report](./cap-stcusd.md) (score: 2.39/5.0, Low Risk)
- **Inter-vault coupling:** yvUSDC-1 and yvUSD share one Cap-collateralised credit book. A stcUSD loss would hit yvUSD's looper equity first and then yvUSDC-1
- **Sky concentration:** ~39.2% of funded debt is Sky-governed. A Sky governance or USDS incident would affect roughly two-fifths of deployed capital
- **Sky Savings Rate variability:** SSR has been reduced in steps from 15% to ~3.80% at the snapshot. Further reductions would decrease yield from the sUSDS leg but do not affect principal
- **PSM fee risk:** Currently 0%, but Sky Governance can set fees. If fees exceed 0.05%, the Sky strategies fall back to Uniswap V3 with 0.5% slippage tolerance, which could cause minor losses on large withdrawals

### Critical Risks

- None identified. The vault spreads debt across three ecosystems with no leverage inside the vault. The Pawn Broker's single leveraged borrower and its absence from the withdrawal queue are material concentration and liquidity considerations. The looper's equity buffer and Yearn's control of both sides keep them below a critical gate.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims
- **Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Sky/sUSDS audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions onchain verifiable. sUSDS is transparent. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (ChainSecurity, yAcademy, Statemind). Sky/sUSDS: 7+ auditors (ChainSecurity, Cantina, Sherlock, Trail of Bits, etc.). Morpho Blue: audits by Spearbit, Cantina, and others. No dedicated external audit of the Pawn Broker contracts |
| Bug bounty | $200K on Immunefi (Yearn); $10M on Sky (Immunefi); $2.5M on Morpho (Cantina) |
| Production history | **~31 months** (March 12, 2024). V3 framework: ~29 months. Pawn Broker: ~3.5 months (June 26, 2026) |
| TVL | **~$19.70M** USDC. Deposit limit: $50M |
| Security incidents | None on V3. None on sUSDS or Spark Lend |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — 3+ audits by top firms on the vault infrastructure, plus 7+ auditors on Sky / sUSDS / Spark and multiple auditors on Morpho Blue. ~31 months of production history with ~$19.70M TVL and zero incidents. The Pawn Broker, ~30.7% of debt, is young and has no dedicated external audit, which keeps the score at 1.5 rather than lower.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | Strategy additions and accountant changes through **7-day TimelockController** |
| Privileged roles | Well-distributed: Daddy (6/9, 12 of 14 roles), Brain (3/8, operational), Security (4/7, debt/emergency), Timelock (strategy additions), Keeper + Debt Allocator (bots) |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.0/5** — Immutable vault contracts (no proxy upgrades). 7-day timelock on critical operations (strategy additions), with Daddy (6-of-9, named signers) as sole proposer. No EOA vault roles. Well-distributed roles across Daddy, Brain (3/8), Security (4/7), and automated bots. Per rubric: immutable contracts + 7+ day timelock + multisig above 3/5 threshold + no EOA roles = score 1.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits/withdrawals onchain |
| Strategy reporting | Programmatic via keeper (yHaaSRelayer) |
| Debt allocation | Both automated (Debt Allocator) and manual (Brain multisig) |

**Programmability Score: 1/5** — Fully programmatic system. PPS is calculated onchain algorithmically via ERC-4626. All vault operations (deposits, withdrawals) are permissionless onchain transactions. Strategy reporting is automated via keeper. All funds are onchain and cannot be altered by offchain factors.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (funded) | 4 funded strategies across three ecosystems: stcUSD/USDC Pawn Broker Market 30.7% (Cap collateral, single yvUSD looper borrower, not in default queue), Yearn USDC / Morpho MetaMorpho 30.1% (Morpho Blue), USDS Depositor 28.5% (Sky via yvUSDS-1), sUSDS Lender 10.7% (Sky). One strategy queued at 0 debt (Spark USDC Lender) |
| Criticality | Sky: ~39.2%. Cap: ~30.7% via Pawn Broker collateral (3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock, 8 audits). Morpho Blue: ~30.1% |
| Concentration | Largest ecosystem **~39.2% (Sky)**. Three distinct protocol ecosystems (Sky, Cap, Morpho Blue); governance entities Sky, Cap, and Yearn (MetaMorpho curation, Pawn Broker and looper management) |
| Quality | Sky (top-tier: $10M bug bounty, 7+ auditors, 8+ years), Morpho Blue (well-audited, $1B+ TVL, blue-chip collateral markets), and Cap (30.7% — 8 audits, $1M bug bounty, but ~14 months old with an anonymous multisig and upgradeable proxies; [Cap stcUSD report](./cap-stcusd.md) score 2.39/5.0, Low Risk). The Pawn Broker adds a single leveraged counterparty, yvUSD's looper ([yvUSD report](./yearn-yvusd.md) score 2.46/5.0) |

**Dependencies Score: 2.5 / 5** — Funded debt is backed by three distinct ecosystems (Sky ~39.2%, Cap ~30.7%, Morpho Blue ~30.1%). Cap introduces a moderate-governance dependency through the Pawn Broker's collateral, and the Pawn Broker's single leveraged borrower couples yvUSDC-1 to yvUSD. The rubric assigns 2.5 for 3+ established dependencies with moderate cross-protocol exposure. The withdrawal-queue gap is scored under Liquidity.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 = 1.5**

**Score: 1.5 / 5** — Immutable vault with 6/9 named-signer multisig. 7-day timelock on the most critical action (strategy additions), with Daddy as sole proposer and no EOA vault roles. Fully programmatic operations with all funds onchain. Three distinct protocol ecosystems (Sky ~39.2%, Cap ~30.7%, Morpho Blue ~30.1%); the Cap Pawn Broker leg carries weaker collateral governance and single-borrower concentration. See the [Cap stcUSD risk report](./cap-stcusd.md).

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed: stcUSD/USDC Pawn Broker Market (~30.7%), Yearn USDC / Morpho MetaMorpho (~30.1%), USDS Depositor (~28.5%, Sky via yvUSDS-1), and sUSDS Lender (~10.7%, Sky). All `current_debt` values sum exactly to `totalDebt` — no accounting gap |
| Collateral quality | Morpho Blue: cbBTC, WBTC, and wstETH markets at 86% LLTV. Pawn Broker: stcUSD at 87.16% LTV / 91.5% LLTV, with a 7.8x levered borrower whose ~$0.89M equity (~12.8% of collateral value) is first-loss. Cap governance — see the [Cap stcUSD report](./cap-stcusd.md). Sky: sUSDS and USDS staking backed by over-collateralized loans and Treasury bills (RWA) |
| Leverage | None inside yvUSDC-1; the Pawn Broker's borrower is levered 7.79x |
| Verifiability | ERC-4626, all positions onchain |

**Collateralization Score: 2 / 5** — 100% onchain USDC backing. The MetaMorpho (~30.1%) and Sky (~39.2%) legs deploy into top-tier venues. The Pawn Broker (~30.7%) lends against Cap's stcUSD at a thin 4.7% liquidation buffer. The borrower is levered, and Brain is the only liquidator. The looper's equity provides a ~12.8% first-loss layer, and Yearn controls both sides of the loan. The ~31% exposure to stcUSD collateral and a single levered borrower justifies 2 rather than 1. Fully verifiable onchain.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully onchain — anyone can verify yvUSDC-1 → sUSDS / yvUSDS-1 / Morpho MetaMorpho / Pawn Broker positions |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers with 10-day profit unlock |
| Third-party verification | sUSDS rate is onchain; Pawn Broker LTV, debt, and collateral are readable getters |

**Provability Score: 1 / 5** — Excellent transparency. ERC-4626 standard provides fully onchain, real-time verification. The Pawn Broker's valuation depends on an oracle, but its inputs (exchange rate, fundamental cUSD feed, USDC/USD) are onchain and readable. Multiple verification sources (vault `totalAssets()`, strategy `totalAssets()`, sUSDS / yvUSDS-1 / MetaMorpho / Pawn Broker getters).

**Funds Management Score = (2 + 1) / 2 = 1.5**

**Score: 1.5 / 5** — Good onchain provability and no leverage inside the vault. The ~30.7% Pawn Broker leg introduces moderate collateral and counterparty risk: Cap's stcUSD backs a loan to a single levered Yearn borrower.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption → USDS Depositor and sUSDS Lender (~39.2%, USDS → DAI → USDC), Morpho MetaMorpho redemption (~30.1%). Pawn Broker (~30.7%) is **not in the default queue** and has 1 wei idle; it requires a Brain debt call with up to 7 days to repay |
| Liquidity depth | MetaMorpho: deep USDC markets (subject to utilization). sUSDS: ~5.03B USDS. PSM: deep USDC capacity. Vault is a small fraction of Sky and Morpho capacity |
| Large holder impact | ~$13.7M (~69.3% of TVL) is atomically redeemable — negligible impact for the Sky and Morpho legs |
| Same-value asset | USDC-denominated — no price divergence risk |
| Withdrawal restrictions | No cooldown for queue-included strategies. **~30.7% of capital (Pawn Broker) is unreachable by users** until management calls the debt |

**Score: 1.5 / 5** — ~69.3% of capital redeems atomically through deep, liquid protocols. The remaining ~30.7% (Pawn Broker) needs a privileged debt call and up to 7 days of repayment time. That is material friction, but it affects a minority of capital, and the atomically redeemable ~$13.7M exceeds any plausible single-holder exit at the current TVL. Per rubric, "direct redemption with minor delays" for the majority plus a gated minority justifies 1.5 rather than 1. A gated share above ~50%, or a failed debt call, would push this to 2.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020. Named multisig signers |
| Vault management | Standard Yearn governance (ySafe 6/9). Same pattern across 39 vaults |
| Documentation | V3 docs comprehensive. Strategy code verified on Etherscan |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Demonstrated capability across 4 historical events. $200K Immunefi bounty |
| Monitoring | Active large-flow alerts. Vault is in monitoring list |

**Score: 1/5** — Top-tier operational maturity. Well-known team with named multisig signers. Comprehensive documentation. BORG legal entity. Active monitoring infrastructure with the vault specifically included. Demonstrated incident response capability.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.5 | 30% | 0.450 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.47 / 5.0** |

1.475 is recorded as 1.47 (two decimals, rounded down). Three protocol ecosystems — Sky (~39.2%), Cap (~30.7%), Morpho Blue (~30.1%). Cat 2C dependency subscore 2.5 (Cap's weaker governance and the single levered borrower). Cat 3A collateralization 2.0 (stcUSD collateral at a thin LLTV buffer). Liquidity 1.5 (~30.7% gated behind a debt call). Final score 1.47 (Minimal Risk).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | **Approved, high confidence** |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.47 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (April 2027) or annually
- **TVL-based:** Reassess if TVL exceeds $100M or changes by more than ±50% from current ~$19.70M
- **Incident-based:** Reassess after any exploit, strategy loss, governance change, or Sky / Morpho / Cap / Spark Lend incident
- **Allocation-based:** Reassess if any single protocol ecosystem exceeds 50% of debt, if new strategies are added to or removed from the queue, or if the Pawn Broker is added to or removed from the default withdrawal queue. Also reassess if any other active strategy with material debt sits outside the default queue
- **Pawn Broker-based:** Reassess if `currentLtv()` exceeds 89%, on any `DebtCalled` or `Liquidated` event, if the borrower's leverage target rises above 8.5x, if the oracle feeds change, or if Pawn Broker debt exceeds 40% of vault debt
- **SSR-based:** Reassess if Sky Savings Rate drops below 2% (may indicate Sky governance issues) or if PSM fees are introduced
- **Governance-based:** Reassess if ySafe composition changes (signer additions/removals, threshold changes), if the MetaMorpho vault governance changes (owner, guardian, curator), or if Cap governance (3-of-5 multisig signer changes, threshold changes, contract upgrades via Timelock) materially affects the Pawn Broker market

---

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| [May 11, 2026](https://github.com/yearn/risk-score/pull/148) | 1.3 | Initial assessment. ~100% Sky-governance-coupled; 3 strategies in queue (2 funded: sUSDS Lender ~97%, Spark USDC Lender ~3%); TVL ~$29.84M |
| [July 13, 2026](https://github.com/yearn/risk-score/pull/313) | 1.47 | Reassessment. TVL down to ~$25.49M; new Morpho MetaMorpho strategy added (7.2%); Pawn Broker strategy (stcUSD/USDC, 14.9%) discovered — active with debt but not in default withdrawal queue, verified onchain as self-contained Yearn V3 TokenizedStrategy (v3.0.4); old Spark Lender removed. Three distinct ecosystems: Sky ~77.9%, Morpho Blue ~7.2%, Cap ~14.9%. Cap (stcUSD) governance: 3-of-5 anonymous Gnosis Safe → 24h Timelock → Access Control, upgradeable UUPS proxies, 8 audits, $1M Sherlock bounty. Cat 2C 2.0 → 2.5, Cat 3A 1.0 → 2.0, Cat 2 1.3 → 1.5, Funds Mgmt 1.0 → 1.5. Final: 1.475 → 1.5 (Minimal Risk) |
| [October 13, 2026](https://github.com/yearn/risk-score/pull/469) | 1.47 | Reassessment at block 26181162. TVL ~$19.70M; debt split Pawn Broker ~30.7%, Morpho MetaMorpho ~30.1%, USDS Depositor ~28.5% (via yvUSDS-1, now 100% Grove USDS Compounder), sUSDS Lender ~10.7%. Pawn Broker verified as single-borrower lender to yvUSD's 7.79x stcUSD looper (87.16% LTV vs 91.5% LLTV; idle 1 wei; exit needs a Brain debt call with a 7-day repay window). Vault role bitmasks and audit dates corrected. Category scores unchanged; final recorded as 1.47 under the two-decimal round-down rule (Minimal Risk) |

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                 │
│                                                                     │
│  ┌───────────────────────┐                                          │
│  │  yvUSDC-1 (v3.0.2)    │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  0xBe53...6204        │                                          │
│  │  deposit() / redeem() │                                          │
│  └──────────┬────────────┘                                          │
│             │ 5 active strategies (4 funded, 1 not in queue)        │
│  ┌──────────▼─────────────────────────────────────────────────────┐ │
│  │  STRATEGIES (by allocation, October 13, 2026 snapshot)         │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ CAP / stcUSD (~30.7%)                                    │  │ │
│  │  │  stcUSD/USDC Pawn Broker Market              30.7%       │  │ │
│  │  │  Lends USDC to ONE borrower: yvUSD's Pawn Broker         │  │ │
│  │  │  Looper (7.79x). LTV 87.16% / LLTV 91.5%.                │  │ │
│  │  │  NOT in default queue; idle USDC = 1 wei.                │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ MORPHO BLUE (~30.1%)                                     │  │ │
│  │  │  Yearn USDC (MetaMorpho)                     30.1%       │  │ │
│  │  │  cbBTC ~66% / WBTC ~29% / wstETH ~5% (86% LLTV)          │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ SKY (~39.2%)                                             │  │ │
│  │  │  USDC to USDS Depositor → yvUSDS-1           28.5%       │  │ │
│  │  │  USDC to sUSDS Lender                        10.7%       │  │ │
│  │  │  Pipeline: USDC → DAI (PSM 1:1) → USDS → ...             │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  Queued (0 debt): Spark USDC Lender (0x654a7c)                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                  deposits into underlying protocols
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                    UNDERLYING PROTOCOLS                             │
│                                                                     │
│  ┌──────────────────────────┐    ┌──────────────────────────┐       │
│  │  Cap (stcUSD)            │    │  Morpho Blue             │       │
│  │  ERC-4626, UUPS proxy    │    │  Isolated markets        │       │
│  │  8 audits, $1M bounty    │    │  MetaMorpho vault        │       │
│  │  3-of-5 anonymous multi  │    │  $1B+ TVL, well-audited  │       │
│  │  ~30.7% of vault (coll.) │    │  ~30.1% of vault         │       │
│  └──────────────────────────┘    └──────────────────────────┘       │
│  ┌──────────────────────────┐    ┌──────────────────────────┐       │
│  │  Sky / sUSDS             │    │  yvUSDS-1 → Grove USDS   │       │
│  │  ~5.03B USDS             │    │  Compounder (Sky farm)   │       │
│  │  SSR: ~3.80% APY         │    │  score 1.32              │       │
│  │  ~10.7% of vault         │    │  ~28.5% of vault         │       │
│  └──────────────────────────┘    └──────────────────────────┘       │
│  ┌──────────────────────────┐    ┌──────────────────────────┐       │
│  │  MakerDAO PSM Lite       │    │  Sky DAI-USDS Exchanger  │       │
│  │  USDC ↔ DAI at 1:1       │    │  DAI ↔ USDS at 1:1       │       │
│  │  0% fee (tin=tout=0)     │    │  No fee                  │       │
│  └──────────────────────────┘    └──────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → yvUSDC-1 vault → Pawn Broker (~30.7%)
lends USDC to yvUSD's stcUSD looper against stcUSD collateral (NOT in
default withdrawal queue); Yearn USDC (~30.1%) deposits USDC into the
Morpho MetaMorpho vault; USDS Depositor (~28.5%) and sUSDS Lender (~10.7%)
convert USDC → DAI (PSM) → USDS (Exchanger) → yvUSDS-1 / sUSDS. Profits
reported by Keeper, locked for 10 days. Withdrawals reverse the queued
pipelines atomically; the Pawn Broker needs a debt call first.
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — deployed at [block 24,242,692](https://etherscan.io/tx/0x3063e5a82b383d0f5b38e8735dd13c0c9d492c3bfe5dc9d3d23fc829c60f96b0) with `admin = address(0)`. Same timelock used by yvUSD and other Yearn V3 vaults. Roles verified with `hasRole()` at block 26181162.

### Timelock Roles

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)` at construction). No one can grant/revoke roles outside the propose→wait→execute flow |
| **TIMELOCK_ADMIN** | Timelock itself ([`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73)) | Contract | Only the timelock can admin its own roles. Config changes (delay, role grants) must go through the 7-day delay |
| **PROPOSER** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | **Only proposer** — no one else can initiate timelocked operations |
| **EXECUTOR** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | Can execute queued proposals directly |
| **EXECUTOR** | TimelockExecutor ([`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b)) | Contract | Wrapper contract — delegates execution to its internal executor list (see below) |
| **CANCELLER** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | Can cancel pending proposals |
| **CANCELLER** | Brain ([`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)) | 3-of-8 Safe | Can cancel pending proposals |

### TimelockExecutor Contract

[`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) — governance-gated wrapper around the TimelockController. Only addresses on its internal executor list can call `execute()` through it.

| Parameter | Value |
|-----------|-------|
| Governance | Brain ([`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)) — only Brain can add/remove internal executors |
| Internal executors | Brain ([`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)) only (`getExecutors()`) |

### Execution Paths for Queued Proposals

All paths require Daddy (6/9) to first propose the operation and a 7-day wait:

1. **Daddy (6/9)** executes directly (holds EXECUTOR_ROLE on timelock)
2. **Brain (3/8)** executes via TimelockExecutor contract

### Why the Delay Cannot Be Bypassed

To change the timelock delay (e.g., reduce from 7 days), an attacker would need to:

1. Control Daddy (6/9) to **propose** `updateDelay()` — the only PROPOSER
2. Wait 7 days — Brain or Daddy can **cancel** during this window
3. Execute via Daddy or Brain — but the operation is already visible onchain for 7 days

DEFAULT_ADMIN was never granted, so no one can grant themselves PROPOSER or TIMELOCK_ADMIN to skip this flow. The timelock holds TIMELOCK_ADMIN but can only act on it through its own propose→wait→execute cycle.
