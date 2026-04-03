# Protocol Risk Assessment: Yearn — yvUSDC-1

- **Assessment Date:** April 3, 2026
- **Token:** yvUSDC-1 (USDC-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204)
- **Final Score: 1.3/5.0**

## Overview + Links

yvUSDC-1 is a **USDC-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDC into yield strategies on Ethereum mainnet. The vault currently uses **four active strategies** — "USDC to sUSDS Lender" (~41%), three Morpho USDC compounders (~59%) — earning yield through the **Sky/MakerDAO** and **Morpho** ecosystems.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDC deposits, issuing yvUSDC-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the Yearn V3 Vault Factory
- **Strategy pipelines:** Both active strategies share the same entry path: USDC → DAI (via MakerDAO PSM Lite at 1:1, 0 fee) → USDS (via DAI-USDS Exchanger at 1:1). The USDS Depositor then deposits into a **yvUSDS vault** (Yearn V3 ERC-4626), while the sUSDS Lender deposits into **sUSDS** (Sky Savings vault) directly
- **Governance:** Managed via the standard **Yearn V3 Role Manager** contract, governed by the **Yearn 6-of-9 global multisig (ySafe)** with **7-day TimelockController** for strategy additions
- **Multi-strategy capable:** 9 strategies in the default queue (including Morpho, Aave V3, Fluid, Spark), with debt currently split across sUSDS Lender (~41%) and three Morpho compounders (~59%)

**Key metrics (April 3, 2026):**

- **TVL:** ~$31,257,937 USDC
- **Total Supply:** ~28,380,070 yvUSDC-1
- **Price Per Share:** 1.101404 USDC/yvUSDC-1 (~10.1% cumulative appreciation over ~13 months)
- **Total Debt:** 100% deployed (0 idle)
- **Deposit Limit:** $50,000,000
- **Profit Max Unlock Time:** 10 days
- **Net APR:** ~3.57% (after 10% performance fee)
- **Fees:** 0% management fee, 10% performance fee

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

### Active Strategies (9 in default queue, 4 with debt)

| # | Strategy | Name | Current Debt (USDC) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | **USDC to sUSDS Lender** | **12,781,812** | **40.9%** |
| 2 | [`0x694E47AFD14A64661a04eee674FB331bCDEF3737`](https://etherscan.io/address/0x694E47AFD14A64661a04eee674FB331bCDEF3737) | **Morpho Gauntlet USDC Prime Compounder** | **7,054,474** | **22.6%** |
| 3 | [`0x074134A2784F4F66b6ceD6f68849382990Ff3215`](https://etherscan.io/address/0x074134A2784F4F66b6ceD6f68849382990Ff3215) | **Morpho Steakhouse USDC Compounder** | **6,692,324** | **21.4%** |
| 4 | [`0x888239Ffa9a0613F9142C808aA9F7d1948a14f75`](https://etherscan.io/address/0x888239Ffa9a0613F9142C808aA9F7d1948a14f75) | **Morpho OEV-boosted USDC Compounder** | **4,729,326** | **15.1%** |
| 5 | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | USDC to USDS Depositor | 0 | 0% |
| 6 | [`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF) | USDC Fluid Lender | 0 | 0% |
| 7 | [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) | Spark USDC Lender | 0 | 0% |
| 8 | [`0x522478B54046aB7197880F2626b74a96d45B9B02`](https://etherscan.io/address/0x522478B54046aB7197880F2626b74a96d45B9B02) | Aave V3 Lido USDC Lender | 0 | 0% |
| 9 | [`0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858`](https://etherscan.io/address/0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858) | Aave V3 USDC Lender | 0 | 0% |

**Note:** Since the March 2026 assessment, the vault has undergone a significant rebalancing. The USDS Depositor strategy has been fully exited and three Morpho compounders activated. Debt is now split across sUSDS Lender (~41%, Sky/MakerDAO) and three Morpho strategies (~59%), diversifying the vault from a single protocol ecosystem (100% Sky) to two blue-chip ecosystems (Sky + Morpho). Active portfolio management continues with 15+ strategies added and 6+ revoked over the vault's ~13-month history.

**Score impact of strategy diversification:** All active strategies (sUSDS Lender, Morpho compounders) lend into blue-chip protocols. The diversification from 100% Sky to 41% Sky + 59% Morpho improves concentration risk without changing the dependency quality score — both are top-tier DeFi protocols.

### Strategy Protocol Dependencies

| Protocol | Strategy | Allocation |
|----------|----------|-----------|
| **Sky/MakerDAO (sUSDS)** | USDC to sUSDS Lender | **~41%** of current allocation |
| **Morpho** | 3 compounders (Gauntlet, Steakhouse, OEV-boosted) | **~59%** of current allocation |
| Sky/MakerDAO (yvUSDS) | USDC to USDS Depositor | 0% (exited, previously ~79%) |
| Aave V3 | 2 strategies (0% current allocation) | Blue-chip, $30B+ TVL |
| Fluid | 1 strategy (0% current allocation) | [Report score 1.1/5](../report/fluid.md) |
| Spark | 1 strategy (0% current allocation) | Part of Sky ecosystem |

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

- **4 active strategies** on a single chain (Ethereum), across Sky/MakerDAO (~41%) and Morpho (~59%)
- **Simple conversion pipelines:** Sky: USDC → DAI → USDS → sUSDS (three 1:1 conversions + deposit). Morpho: USDC → Morpho vault (direct deposit)
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Blue-chip protocol dependencies** (Sky/MakerDAO + Morpho)
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** March 12, 2024 (block 19,419,991) — **~13 months** in production
- **TVL:** ~$31.26M USDC — established with a $50M deposit limit
- **PPS trend:** 1.000000 → 1.101404 (~10.1% cumulative return over 13 months, ~9.4% annualized)
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** 15+ strategies added over lifetime, 6+ revoked — active portfolio management. Has used Aave V3, Compound V3, Morpho, Spark, Fluid, and Sky strategies. Major rebalancing since March 2026: exited USDS Depositor, activated three Morpho compounders
- **Current allocation:** Debt split across USDC to sUSDS Lender (~41%, Sky/MakerDAO) and three Morpho compounders (~59%) — diversified from 100% Sky to two blue-chip ecosystems
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~23 months). No V3 vault exploits

**Yearn protocol TVL:** ~$220M total across all chains (DeFi Llama, April 2026).

**Sky/sUSDS track record:**
- sUSDS launched as part of Sky Endgame (2024)
- TVL: ~$6.18B USDS deposited (~$10B+ including all sUSDS)
- No security incidents since launch
- Sky Savings Rate (SSR): currently ~4.0% APY, set by Sky Governance
- Revenue sourced from over-collateralized loans and tokenized Treasury bill (RWA) investments

## Funds Management

yvUSDC-1 deploys deposited USDC into yield strategies with 100% capital utilization. Debt is currently split across four strategies in two blue-chip ecosystems: Sky/MakerDAO (~41%) and Morpho (~59%).

### Strategy 1: USDC to USDS Depositor (0% — exited, previously ~79%)

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

### Strategy 2: USDC to sUSDS Lender (~41% allocation)

**Contract:** [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)

**Conversion pipeline:**

1. **USDC → DAI** via MakerDAO PSM Lite — 1:1 at 0% fee
2. **DAI → USDS** via Sky DAI-USDS Exchanger — 1:1, no fee
3. **USDS → sUSDS** via Sky Savings vault ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) — earns the SSR (~4.0% APY)

**Withdrawal pipeline:** Reverse path (sUSDS → USDS → DAI → USDC). Same PSM fee fallback to Uniswap V3.

**Strategy parameters:** Same as USDS Depositor (100M deposit limit, 0.05% max PSM fee, Brain multisig management)

### Strategies 3-5: Morpho USDC Compounders (~59% allocation)

**Contracts:**
- Morpho Gauntlet USDC Prime Compounder ([`0x694E47AFD14A64661a04eee674FB331bCDEF3737`](https://etherscan.io/address/0x694E47AFD14A64661a04eee674FB331bCDEF3737)) — 22.6%
- Morpho Steakhouse USDC Compounder ([`0x074134A2784F4F66b6ceD6f68849382990Ff3215`](https://etherscan.io/address/0x074134A2784F4F66b6ceD6f68849382990Ff3215)) — 21.4%
- Morpho OEV-boosted USDC Compounder ([`0x888239Ffa9a0613F9142C808aA9F7d1948a14f75`](https://etherscan.io/address/0x888239Ffa9a0613F9142C808aA9F7d1948a14f75)) — 15.1%

**Pipeline:** Direct USDC deposit into Morpho lending vaults. No conversion steps required.

**Morpho risk profile:** Morpho is a blue-chip lending protocol with $6.6B+ TVL, 25+ audits (Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora), and formal verification. These are simple USDC lending strategies with no leverage — USDC is deposited into Morpho markets and earns lending yield.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSDC-1 (ERC-4626 standard). Subject to $50M deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDC-1 for USDC. For Sky strategies: unwinds sUSDS → USDS → DAI → USDC pipeline. For Morpho strategies: direct withdrawal from lending vaults. Both paths are highly liquid
- **No cooldown or lock period** — unlike yvUSD's LockedyvUSD wrapper
- **Fees:** 0% management fee, 10% performance fee (taken via accountant during `process_report`)

### Collateralization

- **100% on-chain USDC backing** — all deposits are USDC, deployed into blue-chip protocols (Sky/MakerDAO sUSDS and Morpho lending vaults)
- **Collateral quality:** sUSDS (~41%) is backed by over-collateralized loans and RWA (Treasury bills) via MakerDAO. Morpho compounders (~59%) deposit into USDC lending markets with blue-chip collateral
- **No leverage** — unlike yvUSD's looper strategies, these are simple deposits into savings rate and lending products
- **All positions are fully redeemable** — sUSDS and Morpho vaults support standard ERC-4626 withdrawal. USDS converts 1:1 to DAI via the Exchanger

### Provability

- **yvUSDC-1 exchange rate:** Calculated on-chain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` reads the underlying vault share balance (yvUSDS or sUSDS) and converts to USDC equivalent on-chain
- **sUSDS rate:** The Sky Savings Rate is set by Sky Governance and applied on-chain via the `pot`/`ssr` mechanism. The sUSDS exchange rate increases continuously based on the SSR
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 10 days (`profitMaxUnlockTime`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDC-1 for USDC via ERC-4626 `withdraw()`/`redeem()`. Triggers reverse pipeline through sUSDS → USDS → DAI → USDC (Sky strategies) or Morpho vault withdrawal (Morpho strategies)
- **Highly liquid underlying:** sUSDS holds ~$6.18B USDS; Morpho vaults have deep lending liquidity. The vault's ~$31.26M is a small fraction of underlying pool capacity
- **PSM liquidity:** The MakerDAO PSM Lite provides deep DAI ↔ USDC liquidity at 0% fee. PSM capacity is managed by Sky Governance and typically holds billions of USDC
- **No DEX liquidity needed** — exit is via the protocol's own pipeline (PSM + Exchanger), not DEX AMMs
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **No withdrawal queue or cooldown** — atomic redemption through the pipeline
- **Deposit limit:** $50M cap — generous relative to current TVL of $31.26M

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

- **Exchange rate (PPS):** Calculated on-chain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless on-chain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 10 days
- **Debt allocation:** Managed by both the Debt Allocator (automated) and Brain multisig (manual). Currently split across four strategies
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Sky/MakerDAO (sUSDS)** | Critical | ~41% of current allocation via sUSDS Lender. ~$6.18B TVL in sUSDS. Blue-chip, extensively audited, $10M bug bounty. One of the oldest DeFi protocols |
| **Morpho** | Critical | ~59% of current allocation via 3 compounders (Gauntlet, Steakhouse, OEV-boosted). $6.6B+ TVL, 25+ audits, formal verification by Certora. Blue-chip |
| **MakerDAO PSM Lite** | High | USDC ↔ DAI conversion at 1:1 for sUSDS strategy. 0% fee. Deep liquidity. Audited by ChainSecurity and Cantina |
| **Sky DAI-USDS Exchanger** | High | DAI ↔ USDS 1:1 conversion for sUSDS strategy. Core Sky infrastructure |
| **Uniswap V3 (fallback)** | Low | Only used if PSM fee exceeds 0.05%. Currently not active (PSM fee is 0%) |

**Dependency quality:** Current dependencies are spread across two blue-chip protocol ecosystems: Sky/MakerDAO (~41%) and Morpho (~59%). Both have exceptional audit coverage and track records. This diversification improves upon the previous 100% Sky/MakerDAO concentration. Sky has 8+ years of history and $10M bug bounty; Morpho has 25+ audits with formal verification. All dependencies are top-tier DeFi protocols.

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
- **Endorsed vault check** (`yearn/check_endorsed.py`): Runs weekly, verifies all Yearn V3 vaults are endorsed on-chain via the registry contract
- **Timelock monitoring** (`timelock/timelock_alerts.py`): Monitors the Yearn TimelockController (Strategy Manager) across 6 chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDC-1 Vault | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit/Withdraw events |
| USDC to USDS Depositor | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | `totalAssets()`, `isShutdown()`, keeper report frequency |
| USDC to sUSDS Lender | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | `totalAssets()`, `isShutdown()`, keeper report frequency |
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

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~23 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Blue-chip dependencies with improved diversification:** ~41% Sky/MakerDAO (sUSDS) + ~59% Morpho (3 compounders) — both are top-tier DeFi protocols with extensive audit coverage. Improved from previous 100% Sky concentration
- **Standard Yearn governance:** Uses the Yearn V3 Role Manager with the 6-of-9 ySafe multisig (named, prominent DeFi signers). No EOA role concentration. Strategy additions go through 7-day timelock (self-governed — config changes must also go through 7-day delay)
- **Simple, low-complexity strategies:** Sky: USDC → DAI → USDS → sUSDS pipeline with 1:1 conversions. Morpho: direct USDC deposit into lending vaults. No leverage, no cross-chain bridging, no looper mechanics
- **Established track record:** ~13 months in production with ~$31.26M TVL, ~10.1% cumulative return, zero incidents
- **Active monitoring:** yvUSDC-1 is in Yearn's hourly monitoring system with Telegram alerts for large flows

### Key Risks

- **Protocol concentration:** While improved from 100% Sky, the vault still has significant concentration: ~41% Sky/MakerDAO, ~59% Morpho. A major issue with either ecosystem would affect a substantial portion of the vault
- **Sky Savings Rate variability:** SSR has been reduced from 15% → 6.5% → 4.5% → 4.0% over the past year. Further reductions would decrease vault yield from the sUSDS strategy but do not affect principal
- **PSM fee risk:** Currently 0%, but Sky Governance can set fees. If fees exceed 0.05%, the strategy falls back to Uniswap V3 with 0.5% slippage tolerance, which could cause minor losses on large withdrawals

### Critical Risks

- None identified. The vault uses blue-chip infrastructure throughout, with strong governance and no leverage. The primary risk (Sky/MakerDAO failure) would be a systemic DeFi event affecting the broader ecosystem.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Sky/sUSDS audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions on-chain verifiable. sUSDS is transparent. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). Sky/sUSDS: 7+ auditors (ChainSecurity, Cantina, Sherlock, Trail of Bits, etc.) |
| Bug bounty | $200K on Immunefi (Yearn) |
| Production history | **~13 months** (March 12, 2024). V3 framework: ~23 months |
| TVL | **~$31.26M** USDC. Deposit limit: $50M |
| Security incidents | None on V3. None on sUSDS |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5/5** — 3+ audits by top firms on the vault infrastructure, plus 7+ auditors on the underlying protocols (Sky and Morpho). ~13 months of production history with ~$31.26M TVL and zero incidents. V3 framework has 23 months of clean track record. The high-quality audit coverage on both layers (vault + underlying) warrant a score between 1 and 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | Strategy additions through **7-day TimelockController**. Direct vault parameter changes by Daddy (6/9) have no timelock |
| Privileged roles | Well-distributed: Daddy (6/9, all roles), Brain (3/8, operational), Security (4/7), Keeper + Debt Allocator (bots) |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.5/5** — Immutable vault contracts (no proxy upgrade risk). 6-of-9 multisig with named, prominent DeFi signers. The most critical governance action — adding new strategies, which could break the system — goes through a **7-day TimelockController**. The timelock is self-governed (holds TIMELOCK_ADMIN_ROLE) — config changes like delay reduction must also go through the 7-day delay, though the delay is not permanently immutable. No EOA role concentration. Direct vault parameter changes (deposit limits, emergency shutdown) by the 6/9 multisig have no timelock, preventing a score of 1.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits/withdrawals on-chain |
| Strategy reporting | Programmatic via keeper (yHaaSRelayer) |
| Debt allocation | Both automated (Debt Allocator) and manual (Brain multisig) |

**Programmability Score: 1/5** — Fully programmatic system. PPS is calculated on-chain algorithmically via ERC-4626. All vault operations (deposits, withdrawals) are permissionless on-chain transactions. Strategy reporting is automated via keeper. All funds are on-chain and cannot be altered by off-chain factors.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | 2 active ecosystem dependencies (Sky/MakerDAO ~41%, Morpho ~59%), 3+ available (Aave V3, Fluid, Spark) |
| Criticality | Sky/MakerDAO: ~41% (sUSDS). Morpho: ~59% (3 compounders) |
| Quality | Both blue-chip: Sky (8+ years, $6.18B sUSDS TVL, $10M bounty), Morpho ($6.6B+ TVL, 25+ audits, formal verification) |

**Dependencies Score: 2/5** — Two active blue-chip dependencies with improved diversification from the previous 100% Sky concentration. Per rubric, "1-2 blue-chip dependencies" = score 2. Both Sky/MakerDAO and Morpho are among the highest-quality DeFi protocols. The ~41/59 split reduces single-protocol concentration risk.

**Centralization Score = (1.5 + 1 + 2) / 3 = 1.5**

**Score: 1.5/5** — Immutable vault with 6/9 named-signer multisig. 7-day timelock on the most critical action (strategy additions). Fully programmatic operations with all funds on-chain. Blue-chip dependencies (Sky + Morpho). Minor gap: no timelock on direct vault parameter changes.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed to blue-chip yield products: Sky/MakerDAO (sUSDS, ~41%) and Morpho (3 compounders, ~59%) |
| Collateral quality | sUSDS: backed by over-collateralized loans and Treasury bills (RWA) via MakerDAO. Morpho: USDC lending markets with blue-chip collateral |
| Leverage | None |
| Verifiability | ERC-4626, all positions on-chain |

**Collateralization Score: 1/5** — 100% on-chain USDC backing deployed to the highest-quality DeFi protocols (Sky/MakerDAO sUSDS and Morpho lending vaults). No leverage. Fully verifiable. Blue-chip collateral. Real-time on-chain verification.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain — anyone can verify yvUSDC-1 → yvUSDS/sUSDS positions |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers with 10-day profit unlock |
| Third-party verification | sUSDS rate is on-chain, verifiable independently |

**Provability Score: 1/5** — Excellent transparency. ERC-4626 standard provides fully on-chain, real-time verification. No off-chain components. Multiple verification sources (vault totalAssets, strategy totalAssets, yvUSDS/sUSDS balances).

**Funds Management Score = (1 + 1) / 2 = 1.0**

**Score: 1.0/5** — Outstanding on-chain provability. Top-tier blue-chip collateral quality. No leverage. Simple, transparent pipeline.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption → sUSDS/Morpho → USDS → DAI → USDC pipeline (Sky) or direct Morpho withdrawal |
| Liquidity depth | sUSDS: $6.18B TVL. PSM: billions of USDC capacity. Morpho: deep lending markets. Vault is small fraction of pool capacity |
| Large holder impact | $31.26M vault vs multi-billion pools — negligible impact |
| Same-value asset | USDC-denominated — no price divergence risk |
| Withdrawal restrictions | None — atomic redemption, no cooldown |

**Score: 1.5/5** — The vault lends into highly liquid protocols (Sky/sUSDS and Morpho compounders) which are liquid the vast majority of the time. Withdrawals are atomic via the ERC-4626 pipeline with no cooldown. Diversification across Sky and Morpho strategies improves liquidity resilience. In rare edge cases (e.g., PSM liquidity constraints, Morpho utilization spikes), withdrawals could face short delays — hence 1.5 rather than 1.

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

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (1.5 × 0.30) + (1.0 × 0.30) + (1.5 × 0.20) + (1.5 × 0.15) + (1.0 × 0.05)
            = 0.45 + 0.30 + 0.30 + 0.225 + 0.05
            = 1.33
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.30 |
| Centralization & Control | 1.5 | 30% | 0.45 |
| Funds Management | 1.0 | 30% | 0.30 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.05 |
| **Final Score** | | | **1.3/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.3/5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (October 2026) or annually
- **TVL-based:** Reassess if TVL exceeds $100M or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, governance change, or Sky/MakerDAO or Morpho incident
- **Strategy-based:** Reassess if the vault reallocates into riskier strategies (e.g., leveraged positions). The current score assumes allocation to blue-chip ecosystems (Sky/MakerDAO + Morpho) — a shift to riskier strategies would significantly change the risk profile
- **SSR-based:** Reassess if Sky Savings Rate drops below 2% (may indicate Sky governance issues) or if PSM fees are introduced
- **Governance-based:** Reassess if ySafe composition changes (signer additions/removals, threshold changes)
