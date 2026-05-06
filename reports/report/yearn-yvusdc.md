# Protocol Risk Assessment: Yearn — yvUSDC-1

- **Assessment Date:** May 5, 2026
- **Token:** yvUSDC-1 (USDC-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204)
- **Final Score: 1.3/5.0**

## Overview + Links

yvUSDC-1 is a **USDC-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDC into yield strategies on Ethereum mainnet. The vault holds **~$28.07M USDC** and is **100% deployed** at the snapshot (`totalIdle = 0`, `totalDebt = totalAssets`). The default queue holds **four strategies** with **two funded**: USDC to sUSDS Lender (~97.6%) and Spark USDC Lender (~2.4%). The recently-activated Morpho Yearn USDC Compounder (added 2026-04-30) and the USDC to USDS Depositor are queued at 0 debt.

The three Morpho USDC compounders that were active at the prior April 3 assessment (Gauntlet, Steakhouse, OEV-boosted) have all been **revoked** at the May 5 snapshot (`activation = 0`). Funded debt has consolidated into a single Sky-governed venue (sUSDS via the sUSDS Lender) plus a small Spark Lend slice — both Sky / Sky sub-DAO infrastructure. The vault is therefore **~100% Sky-governance-coupled** at this snapshot, a material concentration shift versus the prior 41% Sky / 59% Morpho split.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDC deposits, issuing yvUSDC-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the Yearn V3 Vault Factory
- **Strategy pipelines:** sUSDS Lender path: USDC → DAI (via MakerDAO PSM Lite at 1:1, 0 fee) → USDS (via DAI-USDS Exchanger at 1:1) → sUSDS (Sky Savings vault). Spark USDC Lender: direct USDC supply to Spark Lend's USDC market (Spark is a Sky sub-DAO). Morpho Yearn USDC Compounder (queued, 0 debt today): would deposit USDC directly into a Morpho lending vault
- **Governance:** Managed via the standard **Yearn V3 Role Manager** contract, governed by the **Yearn 6-of-9 global multisig (ySafe)** with **7-day TimelockController** for strategy additions
- **Default queue:** 4 strategies (sUSDS Lender funded, Spark Lender funded, USDS Depositor and Morpho Yearn Compounder queued at 0 debt). Legacy Morpho Gauntlet / Steakhouse / OEV strategies and three other lenders (Fluid, Aave V3, Aave V3 Lido) revoked at prior cleanups

**Key metrics (May 5, 2026, snapshot at block 25031569):**

- **TVL:** 28,067,648.67 USDC (100% deployed)
- **Total Supply:** 25,400,443.80 yvUSDC-1
- **Price Per Share:** 1.105006 USDC/yvUSDC-1 (~10.5% cumulative appreciation since deployment)
- **Total Debt:** 28,067,648.67 USDC (100% of TVL)
- **Total Idle:** 0
- **Debt distribution:**
  - USDC to sUSDS Lender: 27,402,546.99 USDC (**97.63%**)
  - Spark USDC Lender: 665,101.68 USDC (**2.37%**)
  - USDC to USDS Depositor: 0 (queued, unfunded)
  - Morpho Yearn USDC Compounder: 0 (queued, activated 2026-04-30, unfunded)
- **Deposit Limit:** 50,000,000 USDC
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Sky-governance concentration note:** Both funded strategies (sUSDS Lender ~98% and Spark USDC Lender ~2%) sit under Sky / Sky sub-DAO governance. Effective Sky-governance exposure is **~100%** of debt at this snapshot. This is a meaningful concentration risk and is captured in the dependency subscore below.

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

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Standard Yearn Role Manager, manages 37 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — **ALL 14 vault roles** |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe — QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, EMERGENCY |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe — manages via Role Manager |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** for strategy additions. Self-governed: timelock holds TIMELOCK_ADMIN_ROLE, so config changes must go through 7-day delay |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5c13c246e117ed36437303cac8e250ab0`](https://etherscan.io/address/0x444045c5c13c246e117ed36437303cac8e250ab0) |
| Tokenized Strategy | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) |

### Active Strategies (4 in default queue, 2 with debt)

| # | Strategy | Name | Current Debt (USDC) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | USDC to USDS Depositor | 0 | 0% |
| 2 | [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) | **Spark USDC Lender** | **665,101.68** | **2.37%** |
| 3 | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | **USDC to sUSDS Lender** | **27,402,546.99** | **97.63%** |
| 4 | [`0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0`](https://etherscan.io/address/0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0) | Morpho Yearn USDC Compounder | 0 | 0% |

**Previously queued, now revoked (`activation = 0` at block 25031569):**

- Morpho Gauntlet USDC Prime Compounder ([`0x694E47AFD14A64661a04eee674FB331bCDEF3737`](https://etherscan.io/address/0x694E47AFD14A64661a04eee674FB331bCDEF3737))
- Morpho Steakhouse USDC Compounder ([`0x074134A2784F4F66b6ceD6f68849382990Ff3215`](https://etherscan.io/address/0x074134A2784F4F66b6ceD6f68849382990Ff3215))
- Morpho OEV-boosted USDC Compounder ([`0x888239Ffa9a0613F9142C808aA9F7d1948a14f75`](https://etherscan.io/address/0x888239Ffa9a0613F9142C808aA9F7d1948a14f75))
- USDC Fluid Lender ([`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF))
- Aave V3 Lido USDC Lender ([`0x522478B54046aB7197880F2626b74a96d45B9B02`](https://etherscan.io/address/0x522478B54046aB7197880F2626b74a96d45B9B02))
- Aave V3 USDC Lender ([`0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858`](https://etherscan.io/address/0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858))

**Note:** Significant queue reshape since the prior April 3 assessment. The three Morpho compounders that previously held ~59% of debt (Gauntlet, Steakhouse, OEV) have all been **revoked**. Funded debt has been **consolidated into a single Sky-governed venue** (sUSDS Lender ~98%) plus a small residual Spark Lend slice (~2%). A single new Morpho strategy — Morpho Yearn USDC Compounder — was added 2026-04-30 but is queued at 0 debt at the snapshot. Active portfolio management continues; the vault has used Aave V3, Compound V3, Morpho, Spark, Fluid, and Sky strategies over its ~14-month lifetime.

**Score impact of recent rebalancing:** The vault is now **~100% Sky-governance-coupled** (98% sUSDS Lender + 2% Spark Lender, both Sky / Sky sub-DAO). This is materially more concentrated than the prior 41% Sky / 59% Morpho split and is reflected in the Centralization → Dependencies subscore below.

### Strategy Protocol Dependencies (current allocation)

| Protocol | Strategy | Allocation | Notes |
|----------|----------|-----------:|-------|
| **Sky / sUSDS** | USDC to sUSDS Lender | **97.63%** | Sky Savings Rate via sUSDS — Sky-governed |
| **Spark Lend (Sky sub-DAO)** | Spark USDC Lender | **2.37%** | Sky sub-DAO; Spark admin keys live under Sky governance |
| Sky (yvUSDS via Depositor) | USDC to USDS Depositor | 0% (queued) | Previously the dominant strategy; currently unfunded |
| Morpho | Morpho Yearn USDC Compounder | 0% (queued, activated 2026-04-30) | Direct USDC into Morpho |

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

The underlying vault infrastructure has been audited by 3 reputable firms:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

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
- **Safe Harbor:** Yearn is not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvUSDC-1 system is **low complexity**:

- **2 funded strategies** on a single chain (Ethereum), both Sky-governed: sUSDS Lender (~98%) and Spark USDC Lender (~2%)
- **Simple pipelines:** sUSDS Lender: USDC → DAI → USDS → sUSDS (three 1:1 conversions + deposit). Spark USDC Lender: direct USDC supply to Spark Lend's USDC market
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Blue-chip dependencies** (Sky / Sky sub-DAO at ~100% of funded debt)
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** March 12, 2024 (block 19,419,991) — **~14 months** in production
- **TVL:** 28,067,648.67 USDC (~$28.07M) — well within the $50M deposit limit
- **PPS trend:** 1.000000 → 1.105006 (~10.5% cumulative return, ~8.8% annualized)
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** active portfolio management. The vault has used Aave V3, Compound V3, Morpho, Spark, Fluid, and Sky strategies over its lifetime. Between the April 3 and May 5 snapshots: three Morpho compounders (Gauntlet, Steakhouse, OEV-boosted) **revoked**; Morpho Yearn USDC Compounder **added** 2026-04-30 (queued at 0 debt); funded debt consolidated into the sUSDS Lender + Spark
- **Current allocation:** ~98% USDC to sUSDS Lender (Sky-governed) and ~2% Spark USDC Lender (Sky sub-DAO) — effectively single-ecosystem (Sky) at the snapshot
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~24 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026).

**Sky/sUSDS track record:**
- sUSDS launched as part of Sky Endgame (2024)
- TVL: ~$6.18B USDS deposited (~$10B+ including all sUSDS)
- No security incidents since launch
- Sky Savings Rate (SSR): currently ~4.0% APY, set by Sky Governance
- Revenue sourced from over-collateralized loans and tokenized Treasury bill (RWA) investments

## Funds Management

yvUSDC-1 deploys deposited USDC into yield strategies with 100% capital utilization. At the May 5 snapshot debt is concentrated in **two Sky-governed strategies**: USDC to sUSDS Lender (~98%) and Spark USDC Lender (~2%). Two further strategies sit in the queue at 0 debt: USDC to USDS Depositor and the recently-added Morpho Yearn USDC Compounder.

### Strategy 1: USDC to USDS Depositor (0% — queued, unfunded)

**Contract:** [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52)

**Conversion pipeline:**

1. **USDC → DAI** via MakerDAO PSM Lite ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) — 1:1 at **0% fee** (both `tin` and `tout` set to 0)
2. **DAI → USDS** via Sky DAI-USDS Exchanger ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A)) — 1:1, no fee
3. **USDS → yvUSDS** via a Yearn V3 ERC-4626 vault — earns yield from the underlying yvUSDS vault strategies

**Withdrawal pipeline:** Reverse path (yvUSDS → USDS → DAI → USDC). If PSM `tout` fee exceeds 0.05%, the strategy falls back to **Uniswap V3** swap with 0.5% slippage tolerance.

**Strategy parameters:**
- Deposit limit: 100,000,000 USDC
- Max acceptable PSM fee: 0.05% (falls back to Uniswap V3 if exceeded)
- Management: Brain multisig (3-of-8)
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Strategy 2: USDC to sUSDS Lender (~97.6% allocation)

**Contract:** [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)

**Conversion pipeline:**

1. **USDC → DAI** via MakerDAO PSM Lite — 1:1 at 0% fee
2. **DAI → USDS** via Sky DAI-USDS Exchanger — 1:1, no fee
3. **USDS → sUSDS** via Sky Savings vault ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) — earns the SSR (~4.0% APY)

**Withdrawal pipeline:** Reverse path (sUSDS → USDS → DAI → USDC). Same PSM fee fallback to Uniswap V3.

**Strategy parameters:** Same as USDS Depositor (100M deposit limit, 0.05% max PSM fee, Brain multisig management)

### Strategy 3: Spark USDC Lender (~2.4% allocation)

**Contract:** [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673)

**Pipeline:** Direct USDC supply to **Spark Lend**'s USDC market. Spark Lend is a Sky sub-DAO governed by Sky / Spark governance — the underlying liquidity is Sky-administered.

**Strategy parameters:** Brain multisig management, keeper-driven reporting, ERC-4626 throughout.

### Strategy 4: Morpho Yearn USDC Compounder (queued, 0 debt)

**Contract:** [`0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0`](https://etherscan.io/address/0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0)

**Status:** Activated 2026-04-30, queued at 0 debt at the May 5 snapshot. When funded, this strategy would deposit USDC directly into a Morpho lending vault (no conversion hops). Adding this strategy provides a non-Sky route should the team choose to re-diversify away from the current ~100% Sky concentration.

**Morpho risk profile:** Morpho is a blue-chip lending protocol with $6.6B+ TVL, 25+ audits (Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora), and formal verification.

### Revoked strategies (historical context)

Three Morpho compounders that were active at the prior April 3 assessment have been **revoked** between snapshots: Morpho Gauntlet USDC Prime Compounder, Morpho Steakhouse USDC Compounder, and Morpho OEV-boosted USDC Compounder. All three show `activation = 0` at block 25031569. The cleanup also removed USDC Fluid Lender, Aave V3 Lido USDC Lender, and Aave V3 USDC Lender from the queue (also `activation = 0`). Per the broader cleanup pattern observed across the Yearn V3 risk-1 vaults in late April, the team has been pruning the queue and consolidating debt. Independent attribution of the rationale has not been verified.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSDC-1 (ERC-4626 standard). Subject to $50M deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDC-1 for USDC. For Sky strategies: unwinds sUSDS → USDS → DAI → USDC pipeline. For Morpho strategies: direct withdrawal from lending vaults. Both paths are highly liquid
- **No cooldown or lock period** — unlike yvUSD's LockedyvUSD wrapper
- **Fees:** 0% management fee, 10% performance fee (taken via accountant during `process_report`)

### Collateralization

- **100% onchain USDC backing** — all deposits are USDC, deployed into Sky-governed lending venues (sUSDS Lender ~98% and Spark USDC Lender ~2%)
- **Collateral quality:** sUSDS is backed by over-collateralized loans and RWA (Treasury bills) via MakerDAO. Spark USDC Lender supplies into Spark Lend's USDC market (Sky sub-DAO infrastructure)
- **No leverage** — unlike yvUSD's looper strategies, these are simple deposits into savings rate and lending products
- **All positions are fully redeemable** — sUSDS and Spark vaults support standard ERC-4626 / aToken withdrawal. USDS converts 1:1 to DAI via the Exchanger

### Provability

- **yvUSDC-1 exchange rate:** Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` reads the underlying vault share balance (yvUSDS or sUSDS) and converts to USDC equivalent onchain
- **sUSDS rate:** The Sky Savings Rate is set by Sky Governance and applied onchain via the `pot`/`ssr` mechanism. The sUSDS exchange rate increases continuously based on the SSR
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 10 days (`profitMaxUnlockTime`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDC-1 for USDC via ERC-4626 `withdraw()`/`redeem()`. Triggers reverse pipeline through sUSDS → USDS → DAI → USDC (~98% of debt) or direct Spark Lend withdrawal (~2%)
- **Highly liquid underlying:** sUSDS holds multi-billion-dollar USDS reserves; Spark Lend's USDC market also has deep lending liquidity. The vault's ~$28M is a small fraction of underlying pool capacity
- **PSM liquidity:** The MakerDAO PSM Lite provides deep DAI ↔ USDC liquidity at 0% fee. PSM capacity is managed by Sky Governance and typically holds billions of USDC
- **No DEX liquidity needed** in the base case — exit is via the protocol's own pipeline (PSM + Exchanger), not DEX AMMs. Uniswap V3 fallback applies only if PSM fees rise above 0.05%
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **No withdrawal queue or cooldown** — atomic redemption through the pipeline
- **Deposit limit:** $50M cap — generous relative to current TVL of $28.07M

## Centralization & Control Risks

### Governance

The yvUSDC-1 vault uses the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract.

**Governance hierarchy:**

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | All 14 roles (full admin) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | Manages via Role Manager |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | Strategy additions via Role Manager |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

**ySafe 6-of-9 multisig signers** include publicly known contributors: Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others ([source](https://docs.yearn.fi/developers/security/multisig)).

**Governance assessment:**
1. **No EOA role concentration** — all sensitive roles are held by multisigs
2. **Strategy additions go through a 7-day timelock** via the TimelockController (delay increased from initial 24h to 7 days on [Feb 22, 2025](https://etherscan.io/tx/0x3319d16bbf1d6f1081bcc18802a49399ccd906d347f3472370d188c33e1ece2e))
3. **Standard Yearn governance** — same setup used across 37 vaults, battle-tested pattern
4. **Immutable vault** — no proxy upgrades possible

### Programmability

- **Exchange rate (PPS):** Calculated onchain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless onchain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 10 days
- **Debt allocation:** Managed by both the Debt Allocator (automated) and Brain multisig (manual). Currently split across four strategies
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Sky / sUSDS** | Critical | ~98% of current allocation via the sUSDS Lender. Multi-billion-dollar sUSDS TVL. Blue-chip, extensively audited, $10M bug bounty |
| **Spark Lend (Sky sub-DAO)** | High | ~2% of current allocation via Spark USDC Lender. Spark is a Sky sub-DAO; admin keys live under Sky governance |
| **MakerDAO PSM Lite** | High | USDC ↔ DAI conversion at 1:1 for the sUSDS Lender path. 0% fee. Deep liquidity. Audited by ChainSecurity and Cantina |
| **Sky DAI-USDS Exchanger** | High | DAI ↔ USDS 1:1 conversion for the sUSDS Lender path. Core Sky infrastructure |
| **Uniswap V3 (fallback)** | Low | Only used if PSM fee exceeds 0.05%. Currently not active (PSM fee is 0%) |
| **Morpho** (queued, 0 debt) | N/A at snapshot | Morpho Yearn USDC Compounder activated 2026-04-30, currently unfunded. Would re-introduce a non-Sky leg if funded |

**Dependency quality:** All funded dependencies sit under Sky / Sky sub-DAO governance — effective Sky-governance exposure is **~100%** of debt at this snapshot. Sky itself is top-tier (8+ years of history, $10M bug bounty, multi-billion-dollar sUSDS TVL), but the **single-ecosystem concentration is materially worse** than the prior 41% Sky / 59% Morpho split. The newly-added Morpho Yearn USDC Compounder is queued but unfunded; if and when it is funded, this profile would become two-ecosystem again. This concentration is reflected in the dependency subscore.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The ySafe 6-of-9 multisig has 9 named signers including prominent DeFi figures
- **Governance:** Standard Yearn V3 Role Manager — the same governance used across 37 vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator)
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code is verified on Etherscan
- **Legal:** Yearn Finance has converted its ychad.eth multisig into a BORG (cybernetic organization) via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation company with smart contract governance restrictions
- **Incident response:** Yearn has demonstrated incident response capability across 4 historical events (all V1/legacy). V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **V3 immutability:** Vault contracts cannot be upgraded — this eliminates proxy upgrade risk but means bugs cannot be patched without deploying a new vault

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring-scripts-py`](https://github.com/yearn/monitoring-scripts-py) repository. **yvUSDC-1 is actively monitored:**

- **Large flow alerts** (`yearn/alert_large_flows.py`): Runs **hourly via GitHub Actions**. yvUSDC-1 is in the monitored vault list. Alerts on deposits/withdrawals exceeding threshold via Telegram
- **Endorsed vault check** (`yearn/check_endorsed.py`): Runs weekly, verifies all Yearn V3 vaults are endorsed onchain via the registry contract
- **Timelock monitoring** (`timelock/timelock_alerts.py`): Monitors the Yearn TimelockController (Strategy Manager) across 6 chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDC-1 Vault | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit/Withdraw events |
| USDC to sUSDS Lender | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| Spark USDC Lender | [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| Morpho Yearn USDC Compounder | [`0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0`](https://etherscan.io/address/0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0) | Activation date / first debt allocation |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer/threshold changes, submitted transactions |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes, config updates |
| Sky Savings Rate | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | SSR rate changes, sUSDS TVL |

### Critical Events to Monitor

- **PPS decrease** — any decrease in `convertToAssets(1e6)` indicates a loss event. Should only increase
- **Strategy additions/removals** — `StrategyChanged` events indicate portfolio changes (new strategies go through 7-day timelock)
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events
- **Emergency actions** — `Shutdown` event on vault
- **ySafe signer/threshold changes** — governance integrity
- **SSR rate changes** — Sky Governance may adjust the savings rate, affecting yield
- **PSM fee changes** — if `tin` or `tout` are set above 0, it may trigger the Uniswap V3 fallback path

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Daily |
| `ssr()` | Sky Pot | Savings rate | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~24 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Blue-chip Sky exposure:** ~98% of debt is supplied to sUSDS (Sky Savings Rate, multi-billion-dollar TVL, 7+ auditors, $10M Immunefi bounty), with the residual ~2% in Spark Lend (Sky sub-DAO). Sky itself is one of the highest-quality DeFi protocols
- **Standard Yearn governance:** Uses the Yearn V3 Role Manager with the 6-of-9 ySafe multisig (named, prominent DeFi signers). No EOA role concentration. Strategy additions go through 7-day timelock (self-governed — config changes must also go through 7-day delay)
- **Simple, low-complexity pipelines:** sUSDS: USDC → DAI → USDS → sUSDS via 1:1 conversions. Spark: direct USDC supply. No leverage, no cross-chain bridging, no looper mechanics
- **Established track record:** ~14 months in production with ~$28.07M TVL, ~10.5% cumulative return, zero incidents
- **Active monitoring:** yvUSDC-1 is in Yearn's hourly monitoring system with Telegram alerts for large flows

### Key Risks

- **Single-ecosystem concentration:** ~100% Sky-governance-coupled at the May 5 snapshot (98% sUSDS Lender + 2% Spark Lender, both Sky / Sky sub-DAO). This is a meaningful regression from the prior 41% Sky / 59% Morpho profile and is the dominant risk at this snapshot. A Sky governance / sUSDS / Spark Lend incident would affect ~all of yvUSDC-1's debt
- **Sky Savings Rate variability:** SSR has been reduced from 15% → 6.5% → 4.5% → 4.0% over the past year. Further reductions would decrease vault yield from the sUSDS strategy but do not affect principal
- **PSM fee risk:** Currently 0%, but Sky Governance can set fees. If fees exceed 0.05%, the strategy falls back to Uniswap V3 with 0.5% slippage tolerance, which could cause minor losses on large withdrawals
- **Strategy revocation rationale unverified:** Three Morpho USDC compounders were revoked between snapshots. The rationale (operational vs strategy-specific vs APR-driven) is not independently verifiable on-chain

### Critical Risks

- None identified. The vault uses blue-chip Sky infrastructure throughout, with strong governance and no leverage. The dominant risk (single-ecosystem Sky concentration) is non-critical — Sky is top-tier — but is a real concentration step-up versus the prior assessment.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims
- **Rounding rule:** the weighted sum is rounded to one decimal place using standard nearest-0.1 rounding; when the value is exactly halfway between two 0.1 marks (X.X50), round UP to the higher (riskier) score per the conservative principle

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Sky/sUSDS audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions onchain verifiable. sUSDS is transparent. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). Sky/sUSDS: 7+ auditors (ChainSecurity, Cantina, Sherlock, Trail of Bits, etc.) |
| Bug bounty | $200K on Immunefi (Yearn); $10M on Sky |
| Production history | **~14 months** (March 12, 2024). V3 framework: ~24 months |
| TVL | **~$28.07M** USDC. Deposit limit: $50M |
| Security incidents | None on V3. None on sUSDS or Spark Lend |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — 3+ audits by top firms on the vault infrastructure, plus 7+ auditors on the dominant underlying (Sky / sUSDS / Spark). ~14 months of production history with ~$28.07M TVL and zero incidents. V3 framework has ~24 months of clean track record. High-quality audit coverage on both layers (vault + underlying) warrants a score between 1 and 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | Strategy additions through **7-day TimelockController** |
| Privileged roles | Well-distributed: Daddy (6/9, all roles), Brain (3/8, operational), Security (4/7), Keeper + Debt Allocator (bots) |
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
| Protocol count (funded) | 2 funded strategies (sUSDS Lender 97.6%, Spark Lender 2.4%) — both Sky / Sky sub-DAO. 1 additional queued: Morpho Yearn USDC Compounder (0 debt, activated 2026-04-30) |
| Criticality | Sky / sUSDS: ~98% via sUSDS Lender. Spark Lend (Sky sub-DAO): ~2% |
| Concentration | **~100% Sky-governance-coupled** at the snapshot — single-ecosystem exposure |
| Quality | Top-tier on the funded leg (Sky has $10M Immunefi bounty, multi-billion sUSDS TVL, 7+ auditors) — quality is excellent, but concentration is the dominant concern |

**Dependencies Score: 2.5 / 5** — funded debt sits behind a single ecosystem (Sky governance) at ~100%. The rubric treats "1–2 blue-chip dependencies" as 2.0; the +0.5 reflects that the entire venue surface is Sky-coupled rather than two ecosystems split. The recently-added Morpho Yearn USDC Compounder is queued at 0 debt and would re-introduce a non-Sky leg if funded — at that point this score would step back toward 2.0.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5** — Immutable vault with 6/9 named-signer multisig. 7-day timelock on the most critical action (strategy additions), with Daddy as sole proposer and no EOA vault roles. Fully programmatic operations with all funds onchain. **Dependency concentration on Sky governance (~100%) is the dominant Cat 2 driver** at this snapshot.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed to Sky-governed venues: sUSDS Lender (~98%) and Spark USDC Lender (~2%) |
| Collateral quality | sUSDS: backed by over-collateralized loans and Treasury bills (RWA) via MakerDAO. Spark Lend: USDC lending market on Sky sub-DAO infrastructure |
| Leverage | None |
| Verifiability | ERC-4626, all positions onchain |

**Collateralization Score: 1 / 5** — 100% onchain USDC backing deployed to top-tier Sky / Sky sub-DAO venues. No leverage. Fully verifiable. Blue-chip collateral. Real-time onchain verification. (Concentration risk is captured separately under Cat 2C, not here.)

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully onchain — anyone can verify yvUSDC-1 → sUSDS / Spark Lend positions |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers with 10-day profit unlock |
| Third-party verification | sUSDS rate is onchain, verifiable independently |

**Provability Score: 1 / 5** — Excellent transparency. ERC-4626 standard provides fully onchain, real-time verification. No offchain components. Multiple verification sources (vault totalAssets, strategy totalAssets, sUSDS / Spark balances).

**Funds Management Score = (1 + 1) / 2 = 1.0**

**Score: 1.0 / 5** — Outstanding onchain provability. Top-tier blue-chip collateral quality. No leverage. Simple, transparent pipeline.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption → sUSDS → USDS → DAI → USDC pipeline (~98%) or direct Spark Lend withdrawal (~2%) |
| Liquidity depth | sUSDS: multi-billion-dollar TVL. PSM: billions of USDC capacity. Spark Lend USDC market: deep. Vault is small fraction of pool capacity |
| Large holder impact | $28.07M vault vs multi-billion pools — negligible impact |
| Same-value asset | USDC-denominated — no price divergence risk |
| Withdrawal restrictions | None — atomic redemption, no cooldown |

**Score: 1.5 / 5** — The vault lends into highly liquid Sky-governed protocols which are liquid the vast majority of the time. Withdrawals are atomic via the ERC-4626 pipeline with no cooldown. In rare edge cases (e.g., PSM liquidity constraints, Spark utilization spikes), withdrawals could face short delays — hence 1.5 rather than 1. The single-ecosystem concentration also means a Sky-side incident could affect both legs simultaneously.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020. Named multisig signers |
| Vault management | Standard Yearn governance (ySafe 6/9). Same pattern across 37 vaults |
| Documentation | V3 docs comprehensive. Strategy code verified on Etherscan |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Demonstrated capability across 4 historical events. $200K Immunefi bounty |
| Monitoring | Active hourly large-flow alerts. Vault is in monitoring list |

**Score: 1/5** — Top-tier operational maturity. Well-known team with named multisig signers. Comprehensive documentation. BORG legal entity. Active monitoring infrastructure with the vault specifically included. Demonstrated incident response capability.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.325 → 1.3 / 5.0** |

1.325 rounds to 1.3 under the standard nearest-0.1 rule. The Centralization score (1.5) reflects that funded debt is ~100% Sky-governance-coupled at this snapshot (98% sUSDS Lender + 2% Spark Lender). Score is a step up from the previous 1.2 — driven entirely by the post-rebalance single-ecosystem concentration, not by any audit / governance / funds-management regression.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.3 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (November 2026) or annually
- **TVL-based:** Reassess if TVL exceeds $100M or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, governance change, or Sky / Spark Lend / Morpho incident
- **Allocation-based:** Reassess if the vault re-funds the queued Morpho Yearn USDC Compounder (would re-introduce a non-Sky leg and potentially step the Cat 2C dependency score back down to 2.0 / final to 1.2). Conversely, reassess if any new Sky-coupled strategy increases concentration further
- **SSR-based:** Reassess if Sky Savings Rate drops below 2% (may indicate Sky governance issues) or if PSM fees are introduced
- **Governance-based:** Reassess if ySafe composition changes (signer additions/removals, threshold changes)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvUSDC-1 (v3.0.2)   │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  0xBe53...6204        │                                          │
│  │                       │                                          │
│  │  deposit() / redeem() │                                          │
│  │  totalAssets()        │                                          │
│  └──────────┬────────────┘                                          │
│             │ deploys USDC to 4 queued strategies (2 funded)         │
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  STRATEGIES (by allocation, May 5 snapshot)                      ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ SKY (~98%)                                              │    ││
│  │  │  USDC to sUSDS Lender                       97.63%      │    ││
│  │  │  Pipeline: USDC → DAI (PSM 1:1) → USDS → sUSDS         │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ SPARK (Sky sub-DAO) (~2%)                               │    ││
│  │  │  Spark USDC Lender                          2.37%       │    ││
│  │  │  Pipeline: USDC → Spark Lend (direct)                   │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │                                                                  ││
│  │  Queued (0 debt):                                                ││
│  │  - USDC to USDS Depositor                                        ││
│  │  - Morpho Yearn USDC Compounder (added 2026-04-30)               ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
                                │
                  deposits into underlying protocols
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│                    UNDERLYING PROTOCOLS                                │
│                                                                       │
│  ┌──────────────────────────┐    ┌──────────────────────────┐        │
│  │  Sky / sUSDS             │    │  Spark Lend (Sky sub-DAO)│        │
│  │  Multi-billion TVL       │    │  USDC market             │        │
│  │  SSR: ~4.0% APY          │    │  Sky-governed            │        │
│  │  8+ years, $10M bounty   │    │  Audited (ChainSec, etc.)│        │
│  │  ~98% of vault           │    │  ~2% of vault            │        │
│  └──────────────────────────┘    └──────────────────────────┘        │
│  ┌──────────────────────────┐    ┌──────────────────────────┐        │
│  │  MakerDAO PSM Lite       │    │  Sky DAI-USDS Exchanger  │        │
│  │  USDC ↔ DAI at 1:1      │    │  DAI ↔ USDS at 1:1      │        │
│  │  0% fee (tin=tout=0)     │    │  No fee                  │        │
│  └──────────────────────────┘    └──────────────────────────┘        │
└───────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → yvUSDC-1 vault → sUSDS Lender (~98%)
converts USDC → DAI (PSM) → USDS (Exchanger) → sUSDS; Spark Lender (~2%)
supplies USDC directly to Spark Lend. Profits reported by Keeper, locked
for 10 days. Withdrawals reverse the pipeline (atomic, no cooldown).
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — deployed at [block 24,242,692](https://etherscan.io/tx/0x3063e5a82b383d0f5b38e8735dd13c0c9d492c3bfe5dc9d3d23fc829c60f96b0) with `admin = address(0)`. Same timelock used by yvUSD and 37+ other Yearn V3 vaults.

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
| Internal executor 1 | Brain ([`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)) |
| Internal executor 2 | Deployer EOA ([`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271)) |

### Execution Paths for Queued Proposals

All paths require Daddy (6/9) to first propose the operation and a 7-day wait:

1. **Daddy (6/9)** executes directly (holds EXECUTOR_ROLE on timelock)
2. **Brain (3/8)** executes via TimelockExecutor contract
3. **Deployer EOA** executes via TimelockExecutor contract

### Why the Delay Cannot Be Bypassed

To change the timelock delay (e.g., reduce from 7 days), an attacker would need to:

1. Control Daddy (6/9) to **propose** `updateDelay()` — the only PROPOSER
2. Wait 7 days — Brain or Daddy can **cancel** during this window
3. Execute via Daddy, Brain, or the EOA — but the operation is already visible onchain for 7 days

DEFAULT_ADMIN was never granted, so no one can grant themselves PROPOSER or TIMELOCK_ADMIN to skip this flow. The timelock holds TIMELOCK_ADMIN but can only act on it through its own propose→wait→execute cycle.
