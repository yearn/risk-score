# Protocol Risk Assessment: Yearn — yvUSDC-1

- **Assessment Date:** May 11, 2026 (Updated: July 13, 2026)
- **Token:** yvUSDC-1 (USDC-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204)
- **Final Score: 1.5/5.0**

## Overview + Links

yvUSDC-1 is a **USDC-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDC into yield strategies on Ethereum mainnet. The vault holds **~$25.49M USDC** and is **100% deployed** at the snapshot (`totalIdle ≈ 0`, `totalDebt = totalAssets`). The default queue holds **four strategies** with **three funded**: USDC to sUSDS Lender (~77.9%), Yearn USDC / Morpho MetaMorpho (~7.2%), and stcUSD/USDC Pawn Broker Market (~14.9% — active but NOT in the default withdrawal queue). The USDC to USDS Depositor and a new Spark USDC Lender remain queued at 0 debt.

Since the May 11 snapshot, the old Spark USDC Lender has been **removed** from the queue (residual dust, ~2 USDC), and a **new Morpho MetaMorpho strategy** ("Yearn USDC", 0x68Aea7) has been added and funded. A third funded strategy — **stcUSD/USDC Pawn Broker Market** (0xe63a2a) — was also discovered, holding ~14.9% of debt and active but not in the default withdrawal queue. Funded debt is now split between Sky (~77.9%), Morpho Blue (~7.2%), and Cap (~14.9% via the Pawn Broker's stcUSD collateral), ending the ~100% Sky-governance-coupled concentration observed at the May snapshot. A new Spark USDC Lender (0x654a7c) has also been added to the queue at 0 debt. All previously revoked Morpho, Fluid, and Aave V3 strategies remain revoked (`activation = 0`).

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDC deposits, issuing yvUSDC-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the Yearn V3 Vault Factory
- **Strategy pipelines:** sUSDS Lender path: USDC → DAI (via MakerDAO PSM Lite at 1:1, 0 fee) → USDS (via DAI-USDS Exchanger at 1:1) → sUSDS (Sky Savings vault). Yearn USDC (Morpho) path: USDC → Morpho MetaMorpho vault → Morpho Blue isolated lending markets. Pawn Broker path: USDC is lent directly to borrowers who deposit stcUSD as collateral — a self-contained Yearn V3 TokenizedStrategy (v3.0.4) that holds both USDC and stcUSD on its own balance sheet. Does not route through Morpho Blue. New Spark USDC Lender (queued, 0 debt): would supply USDC directly to Spark Lend's USDC market. USDC to USDS Depositor (queued, 0 debt): would deposit USDC-converted USDS into yvUSDS-1
- **Governance:** Managed via the standard **Yearn V3 Role Manager** contract, governed by the **Yearn 6-of-9 global multisig (ySafe)** with **7-day TimelockController** for strategy additions. The Yearn USDC MetaMorpho vault has its own governance: Security 4/7 multisig as owner, ySafe 6/9 as guardian, 3-day ownership timelock. The stcUSD token (Cap protocol, [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) used as collateral in the Pawn Broker market is governed by a 3-of-5 anonymous multisig → 24h Timelock → Access Control — see the [Cap stcUSD report](./cap-stcusd.md) for full governance details
- **Default queue:** 4 strategies (sUSDS Lender funded, Yearn USDC — Morpho funded, USDS Depositor queued at 0 debt, new Spark USDC Lender queued at 0 debt). The stcUSD/USDC Pawn Broker Market strategy (3rd funded strategy, 14.9%) is active but NOT in the default withdrawal queue. Legacy Morpho Gauntlet / Steakhouse / OEV strategies and three other lenders (Fluid, Aave V3, Aave V3 Lido) remain revoked at prior cleanups. The old Spark USDC Lender (0x25f893) removed from queue between May 11 and July 12; a new Morpho MetaMorpho strategy has been added and funded, re-establishing the non-Sky re-diversification leg

**Key metrics (July 12, 2026, snapshot at block 25519099):**

- **TVL:** 25,486,008.14 USDC (100% deployed)
- **Total Supply:** 22,929,740.00 yvUSDC-1
- **Price Per Share:** 1.111482 USDC/yvUSDC-1 (~11.1% cumulative appreciation since deployment)
- **Total Debt:** 25,486,008.14 USDC (100% of TVL)
- **Total Idle:** ~0 USDC (dust)
- **Debt distribution:**
  - USDC to sUSDS Lender: 19,856,568.16 USDC (**77.9%**)
  - Yearn USDC (Morpho MetaMorpho): 1,823,387.70 USDC (**7.2%**)
  - stcUSD/USDC Pawn Broker Market: 3,806,052.28 USDC (**14.9%** — active, NOT in default withdrawal queue)
  - USDC to USDS Depositor: 0 (queued, unfunded)
  - Spark USDC Lender (new): 0 (queued, unfunded)
- **Deposit Limit:** 50,000,000 USDC
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Dependency concentration note:** The sUSDS Lender (~77.9%) sits under Sky governance. The Yearn USDC strategy (~7.2%) is on Morpho Blue — a non-Sky protocol. The stcUSD/USDC Pawn Broker Market strategy (~14.9%) is a **self-contained Yearn V3 lending strategy**: it holds stcUSD directly as borrower collateral and lends USDC from its own balance — it does **not** route through Morpho Blue or any external lending protocol. Effective Sky-governance exposure is **~77.9%** of debt; Morpho Blue exposure is **~7.2%** (Yearn USDC MetaMorpho only); and Cap (stcUSD) exposure is **~14.9%** (Pawn Broker). The Pawn Broker's stcUSD collateral is **Cap's stcUSD** ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)), an ERC-4626 vault token governed by a 3-of-5 anonymous Gnosis Safe multisig → 24-hour Timelock → Access Control system (all core contracts are upgradeable UUPS proxies; 8 audit firms, $1M Sherlock bug bounty, ~11 months in production). Cap governance is a separate concern from Yearn-managed MetaMorpho. Two additional strategies sit queued at 0 debt.

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

### Active Strategies (4 in default queue; 3 with debt — 1 not in queue)

| # | Strategy | Name | Current Debt (USDC) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | USDC to USDS Depositor | 0 | 0% |
| 2 | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | **USDC to sUSDS Lender** | **19,856,568.16** | **77.9%** |
| 3 | [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3) | **Yearn USDC (Morpho MetaMorpho)** | **1,823,387.70** | **7.2%** |
| 4 | [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a) | Spark USDC Lender (new) | 0 | 0% |
| 5 | [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df) | **stcUSD/USDC Pawn Broker Market** | **3,806,052.28** | **14.9%** (active, NOT in default withdrawal queue) |

**Removed from queue since May 11:**

- Old Spark USDC Lender ([`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673)) — removed from queue, residual ~2 USDC dust

**Previously revoked (all with `activation = 0`):**

- Morpho Gauntlet USDC Prime Compounder ([`0x694E47AFD14A64661a04eee674FB331bCDEF3737`](https://etherscan.io/address/0x694E47AFD14A64661a04eee674FB331bCDEF3737))
- Morpho Steakhouse USDC Compounder ([`0x074134A2784F4F66b6ceD6f68849382990Ff3215`](https://etherscan.io/address/0x074134A2784F4F66b6ceD6f68849382990Ff3215))
- Morpho OEV-boosted USDC Compounder ([`0x888239Ffa9a0613F9142C808aA9F7d1948a14f75`](https://etherscan.io/address/0x888239Ffa9a0613F9142C808aA9F7d1948a14f75))
- Morpho Yearn USDC Compounder ([`0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0`](https://etherscan.io/address/0xf1784A1bF0cBDE0F868838Dd093E65215343c4C0))
- USDC Fluid Lender ([`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF))
- Aave V3 Lido USDC Lender ([`0x522478B54046aB7197880F2626b74a96d45B9B02`](https://etherscan.io/address/0x522478B54046aB7197880F2626b74a96d45B9B02))
- Aave V3 USDC Lender ([`0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858`](https://etherscan.io/address/0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858))

**Note:** The queue has expanded from 3 to 4 strategies since May 11. A new Morpho MetaMorpho strategy ("Yearn USDC", 0x68Aea7) has been added and funded with ~$1.82M. A third funded strategy — the Pawn Broker Market (0xe63a2a, 14.9%) — is active with debt but not in the default withdrawal queue. A new Spark USDC Lender (0x654a7c) has been added to the queue at 0 debt. The old Spark USDC Lender (0x25f893) has been removed from the queue with its debt fully migrated. Active portfolio management continues; the vault has used Aave V3, Compound V3, Morpho, Spark, Fluid, Sky, and the self-contained Pawn Broker strategies over its ~16-month lifetime.

**Pawn Broker queue note:** Strategy 0xe63a2a holds $3.81M in USDC debt (14.9%) but is **not in the default withdrawal queue**. During withdrawals, the vault iterates through the queue; this strategy will be skipped unless it is added to the queue or targeted via `redeem(uint256, address, address, uint256)`. This means the $3.81M could be less liquid under heavy redemptions until the strategy is added to the queue or its debt is migrated.

**Score impact of recent rebalancing:** The vault is no longer ~100% Sky-governance-coupled. Funded debt is now split between Sky (~77.9% via sUSDS Lender), Morpho Blue (~7.2% via Yearn USDC MetaMorpho), and Cap (~14.9% via the Pawn Broker's self-contained stcUSD collateral lending). This re-diversification improves the dependency concentration profile and is reflected in the Centralization → Dependencies subscore below.

### Strategy Protocol Dependencies (current allocation)

| Protocol | Strategy | Allocation | Notes |
|----------|----------|-----------:|-------|
| **Sky / sUSDS** | USDC to sUSDS Lender | **77.9%** | Sky Savings Rate via sUSDS — Sky-governed |
| **Morpho Blue** | Yearn USDC (MetaMorpho) | **7.2%** | Non-Sky; MetaMorpho vault managed by Yearn (Security 4/7 owner, ySafe 6/9 guardian) |
| **Cap (stcUSD)** | stcUSD/USDC Pawn Broker Market | **14.9%** | Self-contained Yearn V3 lending strategy (v3.0.4). Borrowers deposit stcUSD (Cap protocol, [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), ERC-4626 vault — 3-of-5 anonymous multisig, upgradeable proxies, 8 audits, $1M bug bounty) as collateral and receive USDC loans directly from the strategy. Does NOT route through Morpho Blue or any external lending protocol. NOT in default withdrawal queue |
| Sky (yvUSDS via Depositor) | USDC to USDS Depositor | 0% (queued) | Previously the dominant strategy; currently unfunded |
| Spark Lend (Sky sub-DAO) | Spark USDC Lender (new) | 0% (queued) | New strategy, unfunded; replaces the old 0x25f893 Spark Lender |

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
- **Morpho (Cantina):** Active bug bounty. Max payout: **$2,500,000** (Critical).
  - Link: https://cantina.xyz/bounties/35a5f0a1-2ffd-432c-8f3b-77d169add8c3
- **Safe Harbor:** Yearn is not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvUSDC-1 system is **low complexity**:

- **3 funded strategies** on a single chain (Ethereum): sUSDS Lender (~77.9%, Sky-governed), Yearn USDC / Morpho MetaMorpho (~7.2%, non-Sky), and stcUSD/USDC Pawn Broker Market (~14.9%, self-contained Yearn V3 lending strategy — not on Morpho Blue). Two additional strategies queued at 0 debt
- **Simple pipelines:** sUSDS Lender: USDC → DAI → USDS → sUSDS (three 1:1 conversions + deposit). Yearn USDC: USDC → Morpho MetaMorpho vault. Pawn Broker: USDC lent directly to borrowers against stcUSD collateral held on the strategy's own balance sheet (v3.0.4). Spark USDC Lender: direct USDC supply to Spark Lend's USDC market
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Blue-chip dependencies** across three ecosystems (Sky at ~77.9%, Morpho Blue at ~7.2%, Cap at ~14.9%)
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** March 12, 2024 (block 19,419,991) — **~16 months** in production
- **TVL:** 25,486,008.14 USDC (~$25.49M) — well within the $50M deposit limit. Down from $29.84M at May 11 snapshot
- **PPS trend:** 1.000000 → 1.111482 (~11.1% cumulative return, ~8.3% annualized)
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** active portfolio management continues. The vault has used Aave V3, Compound V3, Morpho, Spark, Fluid, and Sky strategies over its ~16-month lifetime. Between May 11 and July 12: old Spark USDC Lender removed from queue (debt migrated); new Morpho MetaMorpho strategy ("Yearn USDC", 0x68Aea7) added and funded with ~$1.82M; new Spark USDC Lender (0x654a7c) added to queue at 0 debt
- **Current allocation:** ~77.9% USDC to sUSDS Lender (Sky-governed), ~7.2% Yearn USDC (Morpho Blue MetaMorpho), and ~14.9% stcUSD/USDC Pawn Broker Market (Cap — self-contained Yearn V3 lending strategy, NOT on Morpho Blue). The Pawn Broker strategy is active with debt but not in the default withdrawal queue — an important operational detail for withdrawal liquidity
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~26 months). No V3 vault exploits

**Yearn protocol TVL:** ~$147M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn-finance), July 2026).

**Sky/sUSDS track record:**
- sUSDS launched as part of Sky Endgame (2024)
- TVL: ~$5.38B+ in sUSDS (within ~$10B+ total USDS ecosystem)
- No security incidents since launch
- Sky Savings Rate (SSR): currently ~4.0% APY, set by Sky Governance
- Revenue sourced from over-collateralized loans and tokenized Treasury bill (RWA) investments

## Funds Management

yvUSDC-1 deploys deposited USDC into yield strategies with 100% capital utilization. At the July 12 snapshot debt is split across **three funded strategies**: USDC to sUSDS Lender (~77.9%), Yearn USDC / Morpho MetaMorpho (~7.2%), and stcUSD/USDC Pawn Broker Market (~14.9%). The Pawn Broker is a **self-contained Yearn V3 lending strategy** (v3.0.4) — it holds stcUSD directly as borrower collateral and lends USDC from its own balance sheet; it does NOT route through Morpho Blue. The Pawn Broker strategy is active and funded but **not in the default withdrawal queue** — it will not participate in withdrawals unless explicitly targeted, representing a potential liquidity consideration. Two further strategies sit in the queue at 0 debt: USDC to USDS Depositor and a new Spark USDC Lender. All `current_debt` values sum to ~$25.49M, matching `totalDebt` with negligible rounding. There is no accounting gap.

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

### Strategy 2: USDC to sUSDS Lender (~77.9% allocation)

**Contract:** [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)

**Conversion pipeline:**

1. **USDC → DAI** via MakerDAO PSM Lite — 1:1 at 0% fee
2. **DAI → USDS** via Sky DAI-USDS Exchanger — 1:1, no fee
3. **USDS → sUSDS** via Sky Savings vault ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) — earns the SSR (~4.0% APY)

**Withdrawal pipeline:** Reverse path (sUSDS → USDS → DAI → USDC). Same PSM fee fallback to Uniswap V3.

**Strategy parameters:** Same as USDS Depositor (100M deposit limit, 0.05% max PSM fee, Brain multisig management)

### Strategy 3: Yearn USDC / Morpho MetaMorpho (~7.2% allocation)

**Contract:** [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)

**Pipeline:** USDC is deposited into a **Morpho MetaMorpho vault** deployed on **Morpho Blue** ([`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)). The MetaMorpho vault is managed by Yearn: **owner** = Security multisig (4-of-7, [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0)), **guardian** = ySafe/Daddy (6-of-9, [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)), **curator** = [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51). Has a **3-day timelock** (259,200 seconds) on ownership transfers. Fee is 0%. This is a **non-Sky protocol** — re-establishing the Morpho re-diversification leg that was previously revoked in the April–May cleanup.

**Strategy parameters:**
- Deposit limit: 50,000,000 USDC (max_debt)
- Morpho Blue: 0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb
- MetaMorpho owner: Security (4-of-7)
- MetaMorpho guardian: ySafe (6-of-9)
- MetaMorpho timelock: 3 days
- Fee: 0%
- Keeper: yHaaSRelayer

### Strategy 4: stcUSD/USDC Pawn Broker Market (~14.9% allocation)

**Contract:** [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df)

**Pipeline:** This is a **self-contained Yearn V3 TokenizedStrategy (v3.0.4)** — a pawn broker that lends USDC directly to borrowers who deposit **stcUSD** (Cap's staked USD ERC-4626 vault token, [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) as collateral. The strategy holds idle USDC (~$5.7K) and stcUSD collateral (~$4.06M) on its own balance sheet. When a borrower deposits stcUSD, USDC is lent out of the strategy; when a borrower repays USDC, their stcUSD is returned. This strategy does **not** route funds through Morpho Blue or any external lending protocol — it is entirely self-contained. The strategy's only external dependency is Cap (stcUSD as the collateral asset).

**stcUSD / Cap governance:** stcUSD is issued by **Cap (Covered Agent Protocol)** — a stablecoin protocol where cUSD is backed 1:1 by whitelisted reserves (USDC ~95%, wWTGXX ~5%) and operators borrow reserves secured by Symbiotic restaking collateral. stcUSD is the yield-bearing ERC-4626 vault wrapping cUSD (~$81.6M supply, ~$86.7M total assets). Cap governance: **3-of-5 anonymous Gnosis Safe multisig** ([`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793)) → **24-hour TimelockController** ([`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab)) → **Access Control** ([`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683)). All core contracts (cUSD, stcUSD, Access Control) are **upgradeable UUPS proxies**. Cap has been audited by **8 firms** (9 reports: Trail of Bits, Spearbit, Zellic, Sherlock contest, Certora, Electisec, Recon, Octane), holds a **$1M Sherlock bug bounty**, and has been in production since August 2025 (~11 months). Cap is a separate governance domain from Yearn and Sky. See the [Cap stcUSD risk report](./cap-stcusd.md) for the full assessment. Key governance risks: 3-of-5 threshold with anonymous signers, all core contracts upgradeable through the 24h timelock, and a deployer EOA retaining an EXECUTOR_ROLE on the timelock.

**Queue status:** This strategy is **active with $3.81M debt but NOT in the default withdrawal queue**. During normal withdrawals, the vault iterates through the default queue and will skip this strategy. Its debt must be explicitly targeted or the strategy must be added to the queue before it can participate in withdrawals. This creates a potential liquidity bottleneck for ~14.9% of deployed capital under heavy redemptions.

**Strategy parameters:**
- Deposit limit: 10,000,000 USDC (max_debt)
- Implementation: Yearn V3 TokenizedStrategy v3.0.4 ([`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c)) — self-contained pawn broker, no external lending protocol
- Collateral: stcUSD — held directly on strategy balance sheet (~$4.06M stcUSD, ~$5.7K idle USDC)
- stcUSD token: [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) (Cap, ERC-4626, upgradeable UUPS proxy)
- stcUSD / Cap governance: 3-of-5 anonymous multisig → 24h timelock → Access Control (see [Cap stcUSD report](./cap-stcusd.md))
- Activation: 1782490163 (active)
- Keeper: yHaaSRelayer

### Strategy 5: Spark USDC Lender (0% — queued, new)

**Contract:** [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a)

**Pipeline:** Direct USDC supply to **Spark Lend**'s USDC market. Spark Lend is a Sky sub-DAO governed by Sky / Spark governance. This is a **new strategy** added to the queue at 0 debt, replacing the old Spark USDC Lender (0x25f893) which was removed from the queue.

**Strategy parameters:** Brain multisig management, keeper-driven reporting, ERC-4626 throughout.

### Revoked and removed strategies (historical context)

The old Spark USDC Lender ([`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673)) has been **removed** from the default queue between May 11 and July 12. Its debt (previously ~$851K) has been fully migrated — residual dust of ~2 USDC remains. All previously revoked Morpho, Fluid, and Aave V3 strategies remain with `activation = 0`. The broader cleanup pattern across Yearn V3 risk-1 vaults in late April/early May has stabilized, and a new Morpho MetaMorpho leg has been re-established. Independent attribution of the queue changes has not been verified.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSDC-1 (ERC-4626 standard). Subject to $50M deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDC-1 for USDC. For the sUSDS Lender: unwinds sUSDS → USDS → DAI → USDC pipeline. For Spark Lender: direct withdrawal from Spark Lend's USDC market. Both paths are highly liquid
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

- **100% onchain USDC backing** — all deposits are USDC, deployed into Sky-governed (sUSDS Lender ~77.9%), Morpho Blue (Yearn USDC MetaMorpho ~7.2%), and self-contained Pawn Broker (stcUSD/USDC ~14.9%) lending
- **Collateral quality:** sUSDS is backed by over-collateralized loans and RWA (Treasury bills) via MakerDAO. The Morpho MetaMorpho vault supplies USDC into Morpho Blue markets — fully onchain, isolated markets with immutable parameters. The Pawn Broker is a self-contained Yearn V3 strategy (v3.0.4) that holds stcUSD directly as borrower collateral — Cap is a separate protocol with its own governance (3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock, 8 audits). See the [Cap stcUSD risk report](./cap-stcusd.md)
- **No leverage** — unlike yvUSD's looper strategies, these are simple deposits into savings rate and lending products
- **All positions are fully redeemable** — sUSDS and Spark vaults support standard ERC-4626 / aToken withdrawal. USDS converts 1:1 to DAI via the Exchanger. The Pawn Broker position (~14.9%) is not in the default withdrawal queue and requires targeted withdrawal or queue addition

### Provability

- **yvUSDC-1 exchange rate:** Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` reads the underlying vault share balance (sUSDS or MetaMorpho vault shares) and converts to USDC equivalent onchain
- **sUSDS rate:** The Sky Savings Rate is set by Sky Governance and applied onchain via the `pot`/`ssr` mechanism. The sUSDS exchange rate increases continuously based on the SSR
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 10 days (`profitMaxUnlockTime`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDC-1 for USDC via ERC-4626 `withdraw()`/`redeem()`. Triggers reverse pipeline through sUSDS → USDS → DAI → USDC (~77.9% of debt), Morpho MetaMorpho redemption (~7.2%), or Pawn Broker withdrawal (~14.9% — not in default queue, requires targeted withdrawal or queue addition)
- **Highly liquid underlying:** sUSDS holds multi-billion-dollar USDS reserves; Morpho MetaMorpho markets have deep USDC liquidity on Morpho Blue. The Pawn Broker is a self-contained lender; its USDC liquidity is limited to the strategy's own idle balance plus borrower repayments. The vault's ~$25.49M is a small fraction of underlying pool capacity
- **PSM liquidity:** The MakerDAO PSM Lite provides deep DAI ↔ USDC liquidity at 0% fee. PSM capacity is managed by Sky Governance and typically holds billions of USDC. The Morpho MetaMorpho exit is directly to USDC through redemption — no PSM needed. The Pawn Broker path exits by recalling USDC loans from borrowers or through queue-targeted withdrawal
- **No DEX liquidity needed** in the base case — exit is via the protocol's own pipeline (PSM + Exchanger for Sky; MetaMorpho redemption for Morpho; borrower loan recall for Pawn Broker), not DEX AMMs. Uniswap V3 fallback applies only for the Sky leg if PSM fees rise above 0.05%
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **No withdrawal queue or cooldown** — atomic redemption through the pipeline. Note: the Pawn Broker strategy (~14.9%) is not in the default withdrawal queue; its debt requires targeted withdrawal or queue addition
- **Deposit limit:** $50M cap — generous relative to current TVL of $25.49M

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
| **Sky / sUSDS** | Critical | ~77.9% of current allocation via the sUSDS Lender. Multi-billion-dollar sUSDS TVL. Blue-chip, extensively audited, $10M bug bounty |
| **Morpho Blue** | Moderate | ~7.2% of current allocation via Yearn USDC MetaMorpho. Morpho Blue is a non-Sky, isolated-market lending protocol with $1B+ TVL. Audited by Spearbit, Cantina, and others. The Yearn USDC MetaMorpho wrapper is managed by Yearn (Security 4/7 owner, ySafe 6/9 guardian, 3-day timelock) |
| **Cap (stcUSD)** | High | ~14.9% via Pawn Broker — stcUSD is the collateral asset held directly by the self-contained Yearn V3 Pawn Broker strategy. Cap is a relatively new protocol (~11 months, August 2025 launch) with a 3-of-5 anonymous multisig governance, upgradeable UUPS proxy contracts (cUSD, stcUSD, Access Control), and a 24-hour timelock. Audited by 8 firms (9 reports) including Trail of Bits, Spearbit, and Zellic. $1M Sherlock bug bounty. Operator model relies on offchain institutional strategies with onchain Symbiotic restaking collateral. The Pawn Broker strategy is not in the default withdrawal queue. See the [Cap stcUSD risk report](./cap-stcusd.md) (score: 2.4/5.0, Low Risk) |
| **MakerDAO PSM Lite** | High | USDC ↔ DAI conversion at 1:1 for the sUSDS Lender path. 0% fee. Deep liquidity. Audited by ChainSecurity and Cantina |
| **Sky DAI-USDS Exchanger** | High | DAI ↔ USDS 1:1 conversion for the sUSDS Lender path. Core Sky infrastructure |
| **Spark Lend (Sky sub-DAO)** | Low | New Spark USDC Lender currently queued at 0 debt. No exposure unless funded |
| **Uniswap V3 (fallback)** | Low | Only used if PSM fee exceeds 0.05%. Currently not active (PSM fee is 0%) |

**Dependency quality:** Funded dependencies span three distinct governance ecosystems: Sky (~77.9%), Morpho Blue (~7.2%), and Cap (~14.9%). The Yearn USDC MetaMorpho leg (7.2%) is Yearn-managed and sits on Morpho Blue. The Pawn Broker leg (14.9%) is a self-contained Yearn V3 lending strategy whose only external dependency is Cap's stcUSD as the collateral asset, introducing the third governance entity: **Cap** (3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock, 8 audits, ~11 months in production, score 2.4/5.0 Low Risk — see [Cap stcUSD report](./cap-stcusd.md)). Sky is top-tier (8+ years of history, $10M bug bounty, multi-billion-dollar sUSDS TVL). Morpho Blue is a well-audited, isolated-market lending protocol with $1B+ TVL. Cap is younger and has weaker governance (anonymous signers, upgradeable proxies) but carries strong audit coverage and institutional backing. The re-diversification across three ecosystems significantly improves the dependency concentration profile compared to the prior ~100% Sky-governance-coupled snapshot. Note: the Pawn Broker strategy (14.9%) is not in the default withdrawal queue, adding a liquidity nuance. Two additional strategies remain queued at 0 debt (USDS Depositor and new Spark USDC Lender).

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The ySafe 6-of-9 multisig has 9 named signers including prominent DeFi figures
- **Governance:** Standard Yearn V3 Role Manager — the same governance used across 37 vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator)
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
| yvUSDC-1 Vault | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, `deposit_limit()`, Deposit/Withdraw events |
| USDC to sUSDS Lender | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | `totalAssets()`, `current_debt`, keeper report frequency |
| Yearn USDC (Morpho MetaMorpho) | [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3) | `totalAssets()`, `current_debt`, `lastTotalAssets()`, Morpho market allocation, curator/guardian changes |
| stcUSD/USDC Pawn Broker Market | [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df) | `totalAssets()`, `current_debt`, `lastTotalAssets()`, stcUSD balance ([`balanceOf(address)`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888#readContract)), USDC idle balance, activation status, queue membership — self-contained Yearn V3 lending strategy, NOT on Morpho Blue. NOT in default withdrawal queue, monitor for queue inclusion |
| Spark USDC Lender (new) | [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a) | `totalAssets()`, `current_debt` — currently 0 debt, monitor for activation |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer/threshold changes, submitted transactions |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes, config updates |
| Sky Savings Rate | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | SSR rate changes, sUSDS TVL |
| Morpho MetaMorpho Vault | [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3) | `owner()`, `guardian()`, `curator()`, `timelock()`, `fee()` — governance integrity |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Market parameters, supply/borrow caps — MetaMorpho vault only (7.2%). Pawn Broker is NOT on Morpho Blue |
| stcUSD (Cap) Vault | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalSupply()`, implementation upgrades (ERC-1967 impl slot) — stcUSD is Cap's ERC-4626 vault, the collateral asset in the Pawn Broker market. Upgradeable UUPS proxy: monitor for implementation changes via the Timelock |
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
- **Morpho MetaMorpho governance changes** — owner (`0xe5e2...`), guardian (`0xFEB4...`), or curator (`0x90D0...`) changes. The vault has a 3-day timelock on ownership transfers
- **Pawn Broker queue status** — monitor whether the Pawn Broker strategy (0xe63a2a) remains out of or gets added to the default withdrawal queue. While out of queue, its $3.81M debt (~14.9%) requires targeted withdrawal or queue addition to serve redemptions. Also monitor the strategy's USDC idle balance and stcUSD collateral balance — as a self-contained lender, insufficient idle USDC could delay withdrawals
- **stcUSD / Cap governance changes** — monitor stcUSD implementation upgrades ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) and Cap multisig signer/threshold changes. Cap governance: 3-of-5 anonymous multisig → 24h Timelock → Access Control. Any upgrade or governance change directly affects the collateral asset held by the Pawn Broker strategy — this is the strategy's only external dependency
- **`totalDebt` vs sum of strategy `current_debt`** — monitor that the sum of all active strategy `current_debt` values stays aligned with `totalDebt`. Any material gap could indicate an un-tracked strategy with debt or an unreported loss

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | ySafe | Delay change detection | Weekly |
| `ssr()` | Sky Pot | Savings rate | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~26 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Multi-ecosystem deployment:** ~77.9% of debt is supplied to sUSDS (Sky Savings Rate, multi-billion-dollar TVL, 7+ auditors, $10M Immunefi bounty), ~7.2% to Morpho Blue (Yearn-managed MetaMorpho, isolated-market lending, $1B+ TVL), and ~14.9% to a self-contained Pawn Broker strategy (Cap's stcUSD as collateral, 8 audits, $1M bug bounty). Three distinct governance ecosystems (Sky, Morpho Blue, Cap) provide meaningful diversification away from the single-ecosystem Sky concentration observed at prior snapshots. The Pawn Broker strategy is active but not in the default withdrawal queue
- **Standard Yearn governance:** Uses the Yearn V3 Role Manager with the 6-of-9 ySafe multisig (named, prominent DeFi signers). No EOA role concentration. Strategy additions go through 7-day timelock (self-governed — config changes must also go through 7-day delay)
- **Simple, low-complexity pipelines:** sUSDS: USDC → DAI → USDS → sUSDS via 1:1 conversions. Morpho: USDC → MetaMorpho vault. No leverage, no cross-chain bridging, no looper mechanics
- **Established track record:** ~16 months in production with ~$25.49M TVL, ~11.1% cumulative return, zero incidents
- **Active monitoring:** yvUSDC-1 is in Yearn's hourly monitoring system with Telegram alerts for large flows

### Key Risks

- **Sky-governance concentration:** ~77.9% of funded debt remains Sky-governed via the sUSDS Lender. While improved from the ~100% concentration at prior snapshots, a Sky governance / sUSDS incident would still affect ~77.9% of yvUSDC-1's deployed capital. The Morpho Blue (~7.2%) and Cap (~14.9%) diversification provides meaningful but not dominant diversification. The Pawn Broker leg (~14.9%) introduces Cap protocol dependency — Cap is well-audited (8 firms) but has weaker governance (3-of-5 anonymous multisig, upgradeable UUPS proxies) and is younger (~11 months)
- **Sky Savings Rate variability:** SSR has been reduced from 15% → 6.5% → 4.5% → 4.0% over the past year. Further reductions would decrease vault yield from the sUSDS strategy but do not affect principal
- **PSM fee risk:** Currently 0%, but Sky Governance can set fees. If fees exceed 0.05%, the sUSDS Lender strategy falls back to Uniswap V3 with 0.5% slippage tolerance, which could cause minor losses on large withdrawals
- **Pawn Broker withdrawal queue gap:** The Pawn Broker strategy (~14.9%, $3.81M) is active with debt but **not in the default withdrawal queue**. Standard `withdraw()`/`redeem()` calls iterate the queue and skip this strategy. Withdrawals from this position require a targeted `redeem(uint256, address, address, uint256)` or the strategy must be added to the queue. Under heavy redemptions, the $3.81M could be less accessible than queue-included strategies
- **Cap (stcUSD) governance risk:** The Pawn Broker market pairs USDC against stcUSD collateral — Cap's ERC-4626 vault token ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)). Cap governs through a **3-of-5 anonymous Gnosis Safe multisig** → 24-hour Timelock → Access Control, with all core contracts upgradeable (UUPS proxies). While Cap carries strong audit coverage (8 firms, 9 reports, Trail of Bits/Spearbit/Zellic) and a $1M Sherlock bug bounty, the anonymous signers and upgradeable contracts present elevated governance risk relative to Yearn and Sky. Changes to Cap's stcUSD contract, oracle, or reserve parameters could affect Pawn Broker market dynamics. See the full [Cap stcUSD risk report](./cap-stcusd.md) (score: 2.4/5.0, Low Risk)

### Critical Risks

- None identified. The vault uses blue-chip infrastructure (Sky, Morpho Blue, and Cap) with strong governance and no leverage. The dominant risk (Sky concentration at ~77.9%) is non-critical — Sky is top-tier — and has significantly improved with diversification across three ecosystems: Sky (~77.9%), Morpho Blue (~7.2%), and Cap (~14.9%). The Pawn Broker's absence from the default withdrawal queue is a noted liquidity consideration but does not constitute a critical risk. 

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
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). Sky/sUSDS: 7+ auditors (ChainSecurity, Cantina, Sherlock, Trail of Bits, etc.). Morpho Blue: audits by Spearbit, Cantina, and others |
| Bug bounty | $200K on Immunefi (Yearn); $10M on Sky (Immunefi); $2.5M on Morpho (Cantina) |
| Production history | **~16 months** (March 12, 2024). V3 framework: ~26 months |
| TVL | **~$25.49M** USDC. Deposit limit: $50M |
| Security incidents | None on V3. None on sUSDS or Spark Lend |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — 3+ audits by top firms on the vault infrastructure, plus 7+ auditors on Sky / sUSDS / Spark and multiple auditors on Morpho Blue. ~16 months of production history with ~$25.49M TVL and zero incidents. V3 framework has ~26 months of clean track record. High-quality audit coverage on both vault and underlying layers warrants a score between 1 and 2.

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
| Protocol count (funded) | 3 funded strategies across three distinct ecosystems: sUSDS Lender 77.9% (Sky), Yearn USDC / Morpho MetaMorpho 7.2% (Morpho Blue), stcUSD/USDC Pawn Broker Market 14.9% (Cap, self-contained Yearn V3 lending strategy, not in default queue). Two additional strategies queued at 0 debt (USDS Depositor, new Spark USDC Lender) |
| Criticality | Sky / sUSDS: ~77.9% via sUSDS Lender. Morpho Blue: ~7.2% via MetaMorpho vault. Cap: ~14.9% via Pawn Broker (stcUSD collateral held directly on strategy balance sheet — Cap protocol: 3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock, 8 audits) |
| Concentration | **~77.9% Sky-governed** at the snapshot — down from ~100% at May 11. Three distinct protocol ecosystems (Sky, Morpho Blue, Cap); three governance entities (Sky, Yearn, Cap) |
| Quality | Funded dependencies span Sky (top-tier: $10M bug bounty, 7+ auditors, 8+ years), Morpho Blue (well-audited, $1B+ TVL), and Cap (14.9% — 8 audits, $1M bug bounty, but younger at ~11 months with anonymous multisig and upgradeable proxies). The Yearn USDC MetaMorpho wrapper is Yearn-managed with its own governance checks (Security 4/7 owner, ySafe 6/9 guardian, 3-day timelock). Cap introduces a third governance entity with different risk characteristics from Sky and Yearn; see the [Cap stcUSD report](./cap-stcusd.md) (score: 2.4/5.0, Low Risk) |

**Dependencies Score: 2.5 / 5** — funded debt is backed by three distinct protocol ecosystems (Sky ~77.9%, Morpho Blue ~7.2%, Cap ~14.9%). Cap (via Pawn Broker) introduces a moderate-governance dependency: 8 audits, $1M bug bounty, but a 3-of-5 anonymous multisig with upgradeable UUPS proxies and ~11 months of production. The rubric assigns 2.5 for 3+ blue-chip dependencies with moderate cross-protocol exposure. The Pawn Broker strategy is not in the default withdrawal queue, which is a liquidity nuance but does not affect the dependency concentration score. See the [Cap stcUSD risk report](./cap-stcusd.md).

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5** — Immutable vault with 6/9 named-signer multisig. 7-day timelock on the most critical action (strategy additions), with Daddy as sole proposer and no EOA vault roles. Fully programmatic operations with all funds onchain. **Dependency concentration is improved from the prior snapshot**: three distinct protocol ecosystems (Sky ~77.9%, Morpho Blue ~7.2%, Cap ~14.9%) with three governance entities (Sky, Yearn, Cap); the Pawn Broker leg (14.9%) adds Cap protocol exposure — well-audited but with weaker governance (3-of-5 anonymous multisig, upgradeable UUPS proxies). See the [Cap stcUSD risk report](./cap-stcusd.md).

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed: sUSDS Lender (~77.9%, Sky), Yearn USDC / Morpho MetaMorpho (~7.2%, Morpho Blue), and stcUSD/USDC Pawn Broker Market (~14.9%, self-contained Yearn V3 lending strategy). All `current_debt` values sum to `totalDebt` with negligible rounding — no accounting gap |
| Collateral quality | sUSDS: backed by over-collateralized loans and Treasury bills (RWA) via MakerDAO. Morpho Blue: isolated lending markets with immutable parameters. stcUSD (Pawn Broker collateral): Cap protocol ERC-4626 vault, 3-of-5 anonymous multisig governance with upgradeable UUPS proxies — see the [Cap stcUSD report](./cap-stcusd.md) |
| Leverage | None |
| Verifiability | ERC-4626, all positions onchain |

**Collateralization Score: 2 / 5** — 100% onchain USDC backing. The sUSDS Lender (~78%) and Morpho MetaMorpho (~7%) deploy into top-tier venues. The Pawn Broker (~15%) is self-contained but holds stcUSD (Cap) directly as borrower collateral — Cap has a 3-of-5 anonymous multisig, upgradeable UUPS proxies, and ~11 months in production (score 2.4/5.0). The ~15% collateral exposure to Cap's weaker governance justifies a 2 rather than 1. No leverage. Fully verifiable onchain.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully onchain — anyone can verify yvUSDC-1 → sUSDS / Morpho MetaMorpho / Pawn Broker / Spark Lend positions |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers with 10-day profit unlock |
| Third-party verification | sUSDS rate is onchain, verifiable independently |

**Provability Score: 1 / 5** — Excellent transparency. ERC-4626 standard provides fully onchain, real-time verification. No offchain components. Multiple verification sources (vault totalAssets, strategy totalAssets, sUSDS / Morpho MetaMorpho / Pawn Broker balances).

**Funds Management Score = (2 + 1) / 2 = 1.5**

**Score: 1.5 / 5** — Good onchain provability and no leverage, but the ~15% Cap (stcUSD) collateral exposure via the Pawn Broker introduces moderate collateral governance risk (anonymous multisig, upgradeable proxies).

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption → sUSDS → USDS → DAI → USDC pipeline (~77.9%), Morpho MetaMorpho redemption (~7.2%), or Pawn Broker USDC withdrawal (~14.9% — not in default queue, requires targeted withdrawal or queue addition) |
| Liquidity depth | sUSDS: multi-billion-dollar TVL. PSM: billions of USDC capacity. Morpho MetaMorpho: deep USDC market. Vault is small fraction of pool capacity |
| Large holder impact | $25.49M vault vs multi-billion pools — negligible impact |
| Same-value asset | USDC-denominated — no price divergence risk |
| Withdrawal restrictions | None — atomic redemption, no cooldown |

**Score: 1.5 / 5** — The vault lends into highly liquid protocols which are liquid the vast majority of the time. Withdrawals are atomic via the ERC-4626 pipeline with no cooldown. In rare edge cases (e.g., PSM liquidity constraints, Morpho utilization spikes), withdrawals could face short delays — hence 1.5 rather than 1.

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
| Funds Management | 1.5 | 30% | 0.450 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.475 → 1.5 / 5.0** |

1.475 rounds to 1.5 under the standard nearest-0.1 rule. Three distinct protocol ecosystems — Sky (~77.9%), Morpho Blue (~7.2%), Cap (~14.9%). Cat 2C dependency subscore 2.5 (Cap's weaker governance). Cat 3A collateralization increased from 1.0 to 2.0 (~15% Cap stcUSD collateral carries governance risk). Funds Management up from 1.0 to 1.5. Final score 1.5 (Minimal Risk).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.5 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (January 2027) or annually
- **TVL-based:** Reassess if TVL exceeds $100M or changes by more than ±50% from current ~$25.49M
- **Incident-based:** Reassess after any exploit, strategy loss, governance change, or Sky / Morpho / Spark Lend incident
- **Allocation-based:** Reassess if any single protocol ecosystem exceeds 90% concentration, if new strategies are added/removed from the queue, or if the Pawn Broker strategy is added to or removed from the default withdrawal queue. Also reassess if any active strategy with material debt is not in the default queue
- **SSR-based:** Reassess if Sky Savings Rate drops below 2% (may indicate Sky governance issues) or if PSM fees are introduced
- **Governance-based:** Reassess if ySafe composition changes (signer additions/removals, threshold changes), if the MetaMorpho vault governance changes (owner, guardian, curator), or if Cap governance (3-of-5 multisig signer changes, threshold changes, contract upgrades via Timelock) materially affects the Pawn Broker market
- **Withdrawal-queue gap:** Reassess if the Pawn Broker strategy remains out of the default queue with >$5M in debt, creating a liquidity pressure point under potential redemption spikes

---

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| May 11, 2026 | 1.3 | Initial assessment. ~100% Sky-governance-coupled; 3 strategies in queue (2 funded: sUSDS Lender ~97%, Spark USDC Lender ~3%); TVL ~$29.84M |
| July 12, 2026 | 1.3 | Reassessment. TVL down to ~$25.49M; new Morpho MetaMorpho strategy added (7.2%); Pawn Broker strategy (stcUSD/USDC, 14.9%) discovered — active with debt but not in default withdrawal queue; old Spark Lender removed; Cat 2C remains 2.0; Cat 2 remains 1.3; final score unchanged at 1.3 (1.265 rounds to 1.3). Three funded strategies. All `current_debt` values sum to `totalDebt` with negligible rounding — no accounting gap. Morpho Blue exposure now ~22.1% (7.2% MetaMorpho + 14.9% Pawn Broker) |
| July 13, 2026 | 1.3 | stcUSD identity and governance verified: stcUSD = Cap's ERC-4626 vault token ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)). Cap governance: 3-of-5 anonymous Gnosis Safe → 24h Timelock → Access Control, upgradeable UUPS proxies, 8 audits, $1M Sherlock bounty. All "unverified"/TODO stcUSD references resolved. Cap added as tracked external dependency in the dependency table, monitoring section, and dependency graph. Final score unchanged at 1.3; Cat 2C remains 2.0 — Cap (~14.9% via Morpho) is a secondary governance concern within the Morpho Blue dependency ecosystem |
| July 13, 2026 | 1.3 | **Correction:** Pawn Broker strategy (0xe63a2a) verified onchain as a self-contained Yearn V3 TokenizedStrategy (v3.0.4) — holds USDC and stcUSD directly, does NOT route through Morpho Blue. Morpho Blue exposure corrected from ~22.1% to ~7.2% (Yearn USDC MetaMorpho only). Pawn Broker's only external dependency is Cap (stcUSD as collateral). Three distinct ecosystems: Sky ~77.9%, Morpho Blue ~7.2%, Cap ~14.9%. Cat 2C dependency subscore revised from 2.0 → 2.5 (three ecosystems, one with weaker governance). Cat 2 changes 1.3 → 1.5. Final score unchanged at 1.3 (1.325 rounds to 1.3). Dependency graph updated |
| July 13, 2026 | 1.5 | Cat 3A collateralization: 1.0 → 2.0 (~15% Pawn Broker holds Cap stcUSD collateral — 3-of-5 anonymous multisig, upgradeable UUPS proxies). Funds Management: 1.0 → 1.5. Final: 1.475 → 1.5 (Minimal Risk). Broken link cap-stcusd.md fixed |
| July 13, 2026 | 1.5 | **Data fix:** sUSDS Lender `current_debt` corrected 19,841,123.66 → 19,856,568.16 USDC (onchain value at block 25519099; prior figure was $15.4K low). The three funded strategies' `current_debt` now sum exactly to `totalDebt` (25,486,008.14). TVL references normalized to ~$25.49M; Cap production age corrected to ~11 months. No score change |

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
│             │ deploys USDC to 5 strategies (3 funded, 1 not in queue)│
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  STRATEGIES (by allocation, July 12 snapshot)                    ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ SKY (~77.9%)                                            │    ││
│  │  │  USDC to sUSDS Lender                       77.9%       │    ││
│  │  │  Pipeline: USDC → DAI (PSM 1:1) → USDS → sUSDS         │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ MORPHO BLUE (~7.2%)                                     │    ││
│  │  │  Yearn USDC (MetaMorpho)                    7.2%        │    ││
│  │  │  Pipeline: USDC → Morpho MetaMorpho vault               │    ││
│  │  │  Curator: Yearn (3-day timelock on owner)               │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ CAP / stcUSD (~14.9%)                                   │    ││
│  │  │  stcUSD/USDC Pawn Broker Market             14.9%        │    ││
│  │  │  Self-contained Yearn V3 TokenizedStrategy              │    ││
│  │  │  (v3.0.4). Holds stcUSD directly as                    │    ││
│  │  │  borrower collateral, lends USDC from own               │    ││
│  │  │  balance. NOT in default withdrawal queue.              │    ││
│  │  │  Does NOT route through Morpho Blue.                    │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │                                                                  ││
│  │  Queued (0 debt):                                                ││
│  │  - USDC to USDS Depositor                                        ││
│  │  - Spark USDC Lender (new, 0x654a7c)                             ││
│  │                                                                  ││
│  │  Removed since May 11:                                           ││
│  │  - Old Spark USDC Lender (0x25f893, debt migrated)               ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
                                │
                  deposits into underlying protocols
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│                    UNDERLYING PROTOCOLS                                │
│                                                                       │
│  ┌──────────────────────────┐    ┌──────────────────────────┐        │
│  │  Sky / sUSDS             │    │  Morpho Blue             │        │
│  │  Multi-billion TVL       │    │  Isolated markets        │        │
│  │  SSR: ~4.0% APY          │    │  MetaMorpho vault        │        │
│  │  8+ years, $10M bounty   │    │  $1B+ TVL, well-audited  │        │
│  │  ~77.9% of vault         │    │  ~7.2% of vault          │        │
│  └──────────────────────────┘    └──────────────────────────┘        │
│  ┌──────────────────────────┐                                        │
│  │  Cap (stcUSD)            │                                        │
│  │  stcUSD ERC-4626 vault   │                                        │
│  │  8 audits, $1M bounty    │                                        │
│  │  3-of-5 anonymous multi  │                                        │
│  │  ~14.9% of vault         │                                        │
│  └──────────────────────────┘                                        │
│  ┌──────────────────────────┐    ┌──────────────────────────┐        │
│  │  MakerDAO PSM Lite       │    │  Sky DAI-USDS Exchanger  │        │
│  │  USDC ↔ DAI at 1:1      │    │  DAI ↔ USDS at 1:1      │        │
│  │  0% fee (tin=tout=0)     │    │  No fee                  │        │
│  └──────────────────────────┘    └──────────────────────────┘        │
└───────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → yvUSDC-1 vault → sUSDS Lender (~77.9%)
converts USDC → DAI (PSM) → USDS (Exchanger) → sUSDS; Yearn USDC (~7.2%)
deposits USDC into Morpho MetaMorpho vault; Pawn Broker (~14.9%) is a
self-contained Yearn V3 lending strategy that holds stcUSD directly as
borrower collateral and lends USDC from its own balance (NOT in
default withdrawal queue). Profits reported by Keeper, locked for 10 days.
Withdrawals reverse the pipeline (atomic, no cooldown).
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
