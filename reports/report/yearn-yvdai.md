# Protocol Risk Assessment: Yearn — yvDAI-1

- **Assessment Date:** April 27, 2026
- **Token:** yvDAI-1 (DAI-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c)
- **Final Score: 1.3/5.0**

## Overview + Links

yvDAI-1 is a **DAI-denominated Yearn V3 vault** (ERC-4626) that deploys deposited DAI through a **vault-of-vaults composition**: 72.5% routes through `DAI to USDC-1 Depositor` into **yvUSDC-1** (which itself routes 100% into yvUSDS-1), and 27.5% routes through `DAI to USDS Depositor` directly into **yvUSDS-1**. After the vault-of-vaults unwind, **100% of yvDAI-1's deployed DAI ultimately ends up inside yvUSDS-1**, which terminates at Sky's USDS Staking Rewards (SPK farm) and the Sky Savings Rate (sUSDS).

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting DAI deposits, issuing yvDAI-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Strategy pipelines:**
  - **DAI to USDC-1 Depositor (72.5%):** DAI → USDC (Maker PSM Lite, 1:1 at 0% fee) → yvUSDC-1 deposit. yvUSDC-1 currently routes 100% to yvUSDS-1, so the effective end state is DAI → USDC → DAI → USDS → yvUSDS-1
  - **DAI to USDS Depositor (27.5%):** DAI → USDS (Sky DAI-USDS Exchanger, 1:1, no fee) → yvUSDS-1 deposit. The shorter path
  - **Savings Dai (sDAI):** queued, 0 debt — direct sDAI ERC-4626 wrapper from MakerDAO
  - **Spark DAI Lender:** queued, 0 debt
  - **Aave V3 DAI Lender:** queued, 0 debt
- **Vault-of-vaults composition:** **100% of yvDAI-1's deployed funds end up inside yvUSDC-1 or yvUSDS-1 today**, which themselves terminate at Sky / Spark. Withdrawals settle atomically through up to three layers of strategy `withdraw()` calls in the same transaction
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (April 27, 2026, snapshot at block 24974187):**

- **TVL:** ~$8,565,115 DAI
- **Total Supply:** ~7,667,369 yvDAI-1
- **Price Per Share:** 1.117087 DAI/yvDAI-1 (~11.71% cumulative appreciation over ~25.5 months, ~5.4% annualized)
- **Total Debt:** 8,565,107.76 DAI (~99.9999% deployed)
- **Total Idle:** 7.54 DAI
- **Deposit Limit:** 50,000,000 DAI
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Verified vault-of-vaults wiring:**

- `DAI to USDC-1 Depositor` ([`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5)) → `VAULT() = 0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204` (yvUSDC-1), with unlimited USDC approval on-chain
- `DAI to USDS Depositor` ([`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d)) → `VAULT() = 0x182863131F9a4630fF9E27830d945B1413e347E8` (yvUSDS-1)
- yvUSDC-1's `USDC to USDS Depositor` strategy currently holds 100% of yvUSDC-1's deployed USDC and routes into yvUSDS-1

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Sky Protocol Documentation](https://developers.skyeco.com/)
- [Sky Savings Rate (sUSDS)](https://docs.spark.fi/user-guides/earning-savings/susds)
- [Companion report: yvUSDC-1](./yearn-yvusdc.md)
- [Companion report: yvUSDS-1](./yearn-yvusds.md)

## Contract Addresses

### Core yvDAI-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvDAI-1 Vault | [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c) | Yearn V3 Vault (v3.0.2), Vyper minimal proxy |
| Underlying asset (DAI) | [`0x6B175474E89094C44Da98b954EedeAC495271d0F`](https://etherscan.io/address/0x6B175474E89094C44Da98b954EedeAC495271d0F) | MakerDAO DAI |
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
| Vault Factory (v3.0.2) | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) |
| Vault Original (v3.0.2) | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) |

### Active Strategies (5 in default queue, 2 with debt)

| # | Strategy | Name | Current Debt (DAI) | Allocation |
|---|----------|------|-------------------:|-----------:|
| 1 | [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) | **DAI to USDC-1 Depositor** | **6,207,746.87** | **72.5%** |
| 2 | [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | **DAI to USDS Depositor** | **2,357,360.90** | **27.5%** |
| 3 | [`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA) | Savings Dai (sDAI) | 0 | 0% |
| 4 | [`0x1fd862499e9b9402DE6c599b6C391f83981180Ab`](https://etherscan.io/address/0x1fd862499e9b9402DE6c599b6C391f83981180Ab) | Spark DAI Lender | 0 | 0% |
| 5 | [`0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B`](https://etherscan.io/address/0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B) | Aave V3 DAI Lender | 0 | 0% |

**Note on `Savings Dai`:** strategy 3 in the queue is the canonical sDAI ERC-4626 token from MakerDAO at [`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA). It is currently unfunded but is kept in the queue as a direct, single-hop alternative to the depositor strategies.

### Strategy Protocol Dependencies (effective)

After the vault-of-vaults unwind, yvDAI-1's effective dependency mix is identical to yvUSDS-1's funded mix:

| Effective dependency | Path | Effective allocation |
|----------------------|------|---------------------:|
| **Sky USDS Staking Rewards (SPK farm)** | DAI → ... → yvUSDS-1 → Spark Compounder (~92.6% of yvUSDS-1) | **~92.6% of deployed DAI** |
| **Sky / sUSDS** | DAI → ... → yvUSDS-1 → sUSDS Lender (~7.4% of yvUSDS-1) | **~7.4% of deployed DAI** |
| **MakerDAO PSM Lite** (USDC ↔ DAI) | Used by `DAI to USDC-1 Depositor` for the inbound DAI → USDC conversion (and reverse on withdrawal) | High during routing |
| **Sky DAI-USDS Exchanger** (DAI ↔ USDS) | Used by `DAI to USDS Depositor` and downstream by yvUSDC-1's `USDC to USDS Depositor` strategy | High during routing |
| **yvUSDC-1** (intermediate vault) | 72.5% of yvDAI-1 routes through it | Vault-of-vaults dependency |
| **yvUSDS-1** (terminal vault) | 100% of deployed DAI ultimately ends up here | Vault-of-vaults dependency |

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Sky / MakerDAO Audits (Underlying Protocol)

Sky (formerly MakerDAO) is one of the most extensively audited DeFi protocols:

| Auditor | Coverage | Notes |
|---------|----------|-------|
| ChainSecurity | 9 audits including USDS, sUSDS, PSM Lite | Core security partner |
| Cantina | 10 audit reports including sUSDS and USDS | Comprehensive coverage |
| Sherlock | Public audit contest (Aug 2024) | Community audit |
| Trail of Bits | Core DAI system (legacy MCD) | Historical audit |
| PeckShield | Core DAI system (legacy MCD) | Historical audit |
| Quantstamp | Liquidations 2.0 | Historical audit |
| ABDK | Vote Delegate security | Governance audit |

**LitePSM** (used for USDC ↔ DAI conversion): audited by ChainSecurity and Cantina.

**DAI-USDS Exchanger**: part of the Sky Endgame stack, audited under the same umbrella.

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvDAI-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Sky / MakerDAO (Immunefi):** active, **$10,000,000** max payout (Critical). Scope includes DAI, USDS, sUSDS, PSM. https://immunefi.com/bug-bounty/sky/
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvDAI-1 system is **moderately complex** because of the vault-of-vaults composition:

- **2 funded strategies** today, both depositors into other Yearn V3 vaults
- **Conversion hops:**
  - `DAI to USDC-1 Depositor`: DAI → USDC (PSM Lite) → yvUSDC-1 → ... (then USDC → DAI → USDS in yvUSDC-1's strategy)
  - `DAI to USDS Depositor`: DAI → USDS (Exchanger) → yvUSDS-1
- **Three layers of vault accounting** to verify (yvDAI-1 → yvUSDC-1 → yvUSDS-1) for the 72.5% path; two layers for the 27.5% path
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** at every layer
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

The vault-of-vaults composition is **not leverage** but is a real complexity surface — a bug or accounting issue at any of the three layers cascades. Each layer is itself ERC-4626 and on-chain verifiable.

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~25.5 months** in production
- **TVL:** ~$8.57M DAI — well within the $50M deposit limit
- **PPS trend:** 1.000000 → 1.117087 (~11.71% cumulative return over ~25.5 months, ~5.4% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management — Spark DAI Lender, Aave V3 DAI Lender, sDAI all queued historically; the depositor strategies were added in 2025
- **Current allocation:** 72.5% via `DAI to USDC-1 Depositor` + 27.5% via `DAI to USDS Depositor`. Direct strategies (sDAI, Spark, Aave) are dormant
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~23 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026).

**Sky / sUSDS / USDS Staking track record:** see the [yvUSDS-1 report](./yearn-yvusds.md) for the underlying-protocol details — yvDAI-1 inherits the same dependency profile via the depositor strategies.

## Funds Management

yvDAI-1 deploys ~99.9999% of its DAI via two depositor strategies. Both terminate at yvUSDS-1.

### Strategy 1: DAI to USDC-1 Depositor (~72.5% allocation)

**Contract:** [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) — verified vault target [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) (yvUSDC-1).

**Pipeline:**

1. **DAI → USDC** via MakerDAO PSM Lite ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) — 1:1 at **0% fee** (`tin = tout = 0`)
2. **USDC → yvUSDC-1** deposit (ERC-4626)
3. yvUSDC-1 internally routes 100% to its `USDC to USDS Depositor` strategy → USDC → DAI (PSM) → USDS (Exchanger) → yvUSDS-1 → Sky/Spark

**Withdrawal:** reverse path. The user's `redeem` on yvDAI-1 triggers `withdraw` from this strategy → `redeem` from yvUSDC-1 → `withdraw` from yvUSDC-1's `USDC to USDS Depositor` → `redeem` from yvUSDS-1 → unstake from Spark Compounder / sUSDS. All atomic in the same transaction.

**Strategy parameters:**
- Activated: 2025-10-24
- Last reported: 2026-04-22
- PSM fee fallback: 0.05% threshold (above which the strategy can be configured to use Uniswap V3 with 0.5% slippage tolerance)

### Strategy 2: DAI to USDS Depositor (~27.5% allocation)

**Contract:** [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) — verified vault target [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) (yvUSDS-1).

**Pipeline:**

1. **DAI → USDS** via Sky DAI-USDS Exchanger ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A)) — 1:1, no fee
2. **USDS → yvUSDS-1** deposit (ERC-4626)
3. yvUSDS-1 routes ~92.6% to Spark USDS Compounder + ~7.4% to sUSDS Lender

This is the shorter of the two paths — two layers of vaults instead of three.

**Withdrawal:** reverse path. Atomic.

**Strategy parameters:**
- Activated: 2025-05-15
- Last reported: 2026-04-22

### Strategies 3–5: sDAI / Spark / Aave V3 (0% allocation)

Queued but unfunded today:

- **Savings Dai (sDAI)** ([`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA)) — direct ERC-4626 wrapper from MakerDAO, single-hop alternative to the depositor strategies
- **Spark DAI Lender** ([`0x1fd862499e9b9402DE6c599b6C391f83981180Ab`](https://etherscan.io/address/0x1fd862499e9b9402DE6c599b6C391f83981180Ab)) — direct supply into Spark Lend
- **Aave V3 DAI Lender** ([`0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B`](https://etherscan.io/address/0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B)) — direct supply into Aave V3

These would diversify the dependency profile if funded.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 50M DAI deposit limit
- **Withdrawals:** ERC-4626. Atomic, but unwinds through up to three vault layers + Sky / Spark unstaking
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% on-chain DAI backing.** All deposits are DAI; deployed DAI ends up as USDS at the terminal layer (yvUSDS-1) but the unwind always returns DAI 1:1
- **Collateral quality:** ultimately backed by Sky's over-collateralized loan book + RWA Treasury bills (via USDS / sUSDS / USDS Staking Rewards) — see [yvUSDS-1 report](./yearn-yvusds.md) for full underlying details
- **No leverage** — vault-of-vaults composition is not leverage
- **All positions are fully redeemable** via the reverse pipeline

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads the underlying yvUSDC-1 / yvUSDS-1 share balance and converts via ERC-4626 `convertToAssets()` — fully on-chain, real-time
- **Multi-layer verification:** anyone can independently verify yvDAI-1 → yvUSDC-1 → yvUSDS-1 → Sky / Spark on-chain. Each layer's exchange rate is its own ERC-4626 calculation
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 10 days

The vault-of-vaults adds a small surface area to verify (multiple `totalAssets()` reads) but does not add any off-chain dependency.

## Liquidity Risk

- **Primary exit:** Redeem yvDAI-1 for DAI via ERC-4626 `withdraw()` / `redeem()`. Triggers reverse pipeline through yvUSDC-1 / yvUSDS-1 (atomic, multi-step in the same transaction)
- **Highly liquid underlying:** sUSDS holds ~$5.38B; USDS Staking Rewards has multi-billion USDS staked. yvDAI-1's ~$8.57M is a tiny fraction of underlying capacity
- **PSM liquidity:** MakerDAO PSM Lite provides deep DAI ↔ USDC liquidity at 1:1, 0% fee. PSM capacity is managed by Sky governance and typically holds billions of USDC
- **Cascading withdrawal mechanics:** for the 72.5% path, a user redemption from yvDAI-1 triggers up to **three** layers of strategy `withdraw()` calls (yvDAI-1 → yvUSDC-1 → yvUSDS-1) plus the unstake from Spark Compounder / sUSDS — all in the same transaction. The 27.5% path is two layers
- **No DEX liquidity needed** — exit is via Sky's own contracts (PSM, Exchanger, sUSDS, USDS Staking)
- **Same-value asset:** DAI-denominated vault token — no price-divergence risk
- **No withdrawal queue or cooldown** — atomic redemption
- **Deposit limit:** 50M DAI cap vs ~$8.57M TVL (room for +484%)

The cascading multi-layer withdrawal is atomic but has a higher gas cost than a single-strategy vault. For a large institutional withdrawal, the gas of unwinding through all layers plus the Spark / sUSDS unstakes should be considered when sizing the redemption.

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

- **PPS:** ERC-4626, fully algorithmic at every vault layer
- **Vault operations:** permissionless deposit / withdraw on-chain
- **Strategy reporting:** automated via keeper at every vault layer
- **Debt allocation:** Debt Allocator (automated) + Brain (manual) at every vault layer
- **Off-chain inputs:** none

### External Dependencies

After resolving the vault-of-vaults composition, yvDAI-1's effective dependencies are:

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **yvUSDC-1** (intermediate vault) | Critical — 72.5% of deployed funds route through it | Same governance, audits, code as yvDAI-1. See [yvUSDC-1 report](./yearn-yvusdc.md) |
| **yvUSDS-1** (terminal vault) | Critical — 100% of deployed funds end here | Same governance, audits, code. See [yvUSDS-1 report](./yearn-yvusds.md) |
| **Sky USDS Staking Rewards (SPK farm)** | Critical — ~92.6% of yvUSDS-1's allocation | First-party Sky contract |
| **Sky / sUSDS** | Critical — ~7.4% of yvUSDS-1's allocation | $5.38B sUSDS TVL, $10M Immunefi bounty |
| **MakerDAO PSM Lite** | High during routing (used by yvUSDC-1 path) | 1:1, 0% fee, audited |
| **Sky DAI-USDS Exchanger** | High during routing | 1:1, no fee, audited |
| **DAI / USDS / USDC tokens** | Critical | Inherited from each conversion hop |

**Dependency quality:** all dependencies are top-tier — Sky / MakerDAO infrastructure plus Yearn V3 itself. The vault-of-vaults composition concentrates dependency on yvUSDS-1 specifically (since 100% of yvDAI-1's deployed funds end up there) and on Yearn V3's own vault accounting working correctly across three layers.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. All strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault
- **Vault-of-vaults operational consideration:** because yvDAI-1's funded strategies all depend on yvUSDC-1 / yvUSDS-1 being healthy, an emergency action on either upstream vault (e.g. shutdown, deposit pause) directly impacts yvDAI-1

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvDAI-1 is in the monitored vault list:**

- **Large flow alerts** ([`yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/yearn/alert_large_flows.py)) — runs **hourly via GitHub Actions**
- **Endorsed vault check** (`yearn/check_endorsed.py`) — weekly
- **Timelock monitoring** (`timelock/timelock_alerts.py`)

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvDAI-1 Vault | [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c) | PPS, `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| DAI to USDC-1 Depositor | [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) | `totalAssets()`, `isShutdown()`, keeper report |
| DAI to USDS Depositor | [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | `totalAssets()`, `isShutdown()`, keeper report |
| yvUSDC-1 (upstream dependency) | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | PPS, shutdown state |
| yvUSDS-1 (upstream dependency) | [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) | PPS, shutdown state |
| MakerDAO PSM Lite | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `tin`, `tout` (fee parameters) |
| Sky DAI-USDS Exchanger | [`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) | Pause state |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |

### Critical Events to Monitor

- **PPS decrease** at any of the three layers (yvDAI-1, yvUSDC-1, yvUSDS-1) — should only increase outside of explicit loss events
- **Strategy additions / removals** at any layer
- **Emergency actions** (`Shutdown`) at any layer — directly impacts yvDAI-1's redemption path
- **PSM `tin` / `tout`** — if non-zero, USDC ↔ DAI conversion incurs fees
- **DAI-USDS Exchanger pause state**
- **Sky USDS Staking Rewards pause / migration** (affects ~92.6% of effective deployment)
- **ySafe / Brain / Security signer or threshold changes**

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | yvDAI-1 | PPS | Every 6 hours |
| `convertToAssets(1e6)` | yvUSDC-1 | Upstream PPS | Every 6 hours |
| `convertToAssets(1e18)` | yvUSDS-1 | Terminal PPS | Every 6 hours |
| `totalAssets()` | All three vaults | TVL | Daily |
| `tin()` / `tout()` | PSM Lite | PSM fee | Daily |
| `live()` | DAI-USDS Exchanger | Exchanger active | Daily |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Daily |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~23 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Top-tier underlying:** all deployed funds end up at Sky USDS Staking Rewards + sUSDS, both first-party Sky contracts with $10M Immunefi bounty
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Established track record:** ~25.5 months in production, ~11.71% cumulative return, zero incidents
- **Active monitoring:** vault is in Yearn's hourly monitoring system
- **No leverage. No cross-chain.** Vault-of-vaults composition is not leverage
- **Highly liquid underlying** — Sky / sUSDS / PSM all multi-billion-dollar deep
- **All conversion hops at 1:1** — PSM Lite (USDC ↔ DAI) and DAI-USDS Exchanger are both 0-fee 1:1

### Key Risks

- **Vault-of-vaults composition (3 layers):** the 72.5% path traverses yvDAI-1 → yvUSDC-1 → yvUSDS-1 → Spark / sUSDS. A bug or accounting issue at any layer cascades. Each layer's emergency state (shutdown, deposit pause) directly affects yvDAI-1
- **Effective concentration into Sky / Spark:** because yvUSDC-1 currently routes 100% to yvUSDS-1, ~100% of yvDAI-1's deployed DAI ultimately concentrates in yvUSDS-1's two main strategies (Spark Compounder + sUSDS). A bug or governance failure at the Sky USDS Staking Rewards contract would directly impair the bulk of yvDAI-1's deployed value
- **Cascading withdrawal mechanics:** atomic but multi-step — a redemption from yvDAI-1 triggers strategy `withdraw()` calls at up to three vault layers plus the Spark / sUSDS unstake, all in the same transaction. Higher gas, more accounting boundaries
- **Sky Savings Rate / SPK reward rate variability:** affects yield, not principal
- **PSM fee risk:** currently 0%, but Sky governance can change. Above 0.05% the strategy can fall back to Uniswap V3 with 0.5% slippage
- **Single intermediate-vault dependency:** the 72.5% path has yvUSDC-1 as a single point of dependency between yvDAI-1 and the terminal yvUSDS-1

### Critical Risks

- None identified. The dominant systemic risk is a Sky USDS / sUSDS / USDS Staking failure, which would simultaneously impair the four risk-1 stable vaults — but that is a system-wide DeFi event, not a Yearn-specific risk.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Sky / sUSDS / USDS Staking audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 at all three layers, all positions on-chain verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Sky / sUSDS / USDS Staking: 7+ auditors |
| Bug bounty | $200K (Yearn Immunefi); $10M (Sky Immunefi) |
| Production history | **~25.5 months** (March 12, 2024). V3 framework: ~23 months |
| TVL | **~$8.57M** DAI. Deposit limit: 50M |
| Security incidents | None on V3, none on Sky |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — strong audit coverage, ~25 months clean production, no incidents.

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
| PPS | On-chain ERC-4626, algorithmic at every layer |
| Vault operations | Permissionless deposits / withdrawals |
| Strategy reporting | Programmatic via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |
| Vault-of-vaults | All on-chain; multiple layers to verify but each layer is deterministic |

**Programmability Score: 1.0 / 5** — fully programmatic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (effective) | 1 ecosystem (Sky / Spark) for ~100% of effective deployment, plus dependency on Yearn V3's own vault-of-vaults accounting |
| Criticality | Sky USDS Staking + sUSDS critical (~100% of deployed funds, via yvUSDS-1); intermediate dependency on yvUSDC-1 (72.5%); same-team Yearn V3 dependency |
| Quality | Top-tier (Sky $10M bounty, $5.38B sUSDS TVL) plus same Yearn V3 framework |

**Dependencies Score: 2.5 / 5** — single-ecosystem (Sky) effective concentration plus three layers of vault-of-vaults dependency on Yearn V3 itself. The ecosystem quality is excellent, but the concentration and the multi-layer composition warrant 2.5.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain DAI; deployed to Sky-ecosystem contracts via vault-of-vaults |
| Collateral quality | USDS / sUSDS / Sky Staking — all backed by Sky's over-collateralized loan book + RWA |
| Leverage | None |
| Verifiability | Fully on-chain across all three layers |

**Score: 1.0 / 5** — top-tier.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain at every layer (ERC-4626 throughout) |
| Exchange rate | Programmatic, real-time at every layer |
| Reporting | Keeper-driven, 10-day profit unlock |
| Vault-of-vaults | Slightly increases the surface area to verify (need to read multiple vaults' totalAssets), but each layer is on-chain and independently verifiable |

**Score: 1.0 / 5** — excellent on-chain provability.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5** — outstanding on-chain provability and top-tier collateral throughout.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit pipeline | Up to 3 vault layers + Spark Compounder unstake / sUSDS withdraw |
| Liquidity depth | sUSDS $5.38B; PSM billions; Spark / Aave / Morpho deep |
| Large holder impact | $8.57M vault vs multi-billion underlying — negligible |
| Same-asset | DAI-denominated share token |
| Withdrawal restrictions | None — atomic redemption (multi-step within one transaction) |

**Score: 1.5 / 5** — highly liquid; only mild downward pressure from the multi-layer cascade.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi |
| Monitoring | Active hourly alerts, vault in monitored list |

**Score: 1.0 / 5** — top-tier operational maturity.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.325 → 1.3 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.3 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (October 2026) or annually
- **TVL-based:** Reassess if TVL exceeds $25M or changes by ±50%, or if the deposit limit is changed
- **Strategy posture:**
  - if yvDAI-1 funds the dormant strategies (sDAI, Spark DAI Lender, Aave V3 DAI Lender), the dependency profile diversifies and the report should be updated
  - if yvUSDC-1's downstream allocation diversifies away from yvUSDS-1, yvDAI-1's effective concentration changes accordingly
- **Vault-of-vaults composition:**
  - **reassess if a new strategy is added that creates a fourth layer of nested vaults**
  - reassess if any of the three layers (yvDAI-1, yvUSDC-1, yvUSDS-1) shuts down a strategy that contains yvDAI-1's deployed funds
- **Sky-specific:**
  - SSR drops below 2% (may indicate Sky-side stress)
  - PSM `tin` / `tout` set above 0.05% (activates Uniswap V3 fallback in the USDC depositor path)
  - SPK reward rate changes materially or USDS Staking Rewards is paused / migrated
  - DAI-USDS Exchanger pause
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Sky / MakerDAO
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER 1                                │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvDAI-1 (v3.0.2)    │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  0x028e…336c          │                                          │
│  │                       │                                          │
│  │  ~$8.57M DAI TVL      │                                          │
│  └───┬──────────────┬────┘                                          │
│      │ 72.5%        │ 27.5%                                         │
│      ▼              ▼                                                │
│  ┌────────────┐  ┌─────────────────┐                                │
│  │ DAI→USDC-1 │  │ DAI→USDS        │                                │
│  │ Depositor  │  │ Depositor       │                                │
│  │ 0xfF03…f9B5│  │ 0xAeDF…b78d     │                                │
│  └────┬───────┘  └────────┬────────┘                                │
│       │                   │                                          │
│  ┌────▼─────────┐         │                                          │
│  │ DAI→USDC     │         │ DAI→USDS                                 │
│  │ via PSM Lite │         │ via DAI-USDS Exchanger                   │
│  │ 1:1, 0 fee   │         │ 1:1, no fee                              │
│  └────┬─────────┘         │                                          │
│       │                   │                                          │
└───────┼───────────────────┼──────────────────────────────────────────┘
        │                   │
        ▼                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER 2                                 │
│                                                                       │
│  ┌────────────────────┐         ┌────────────────────┐                │
│  │  yvUSDC-1          │         │  (skip layer 2 —   │                │
│  │  0xBe53…6204       │         │   direct to L3)    │                │
│  │  100% to USDS depr │         │                    │                │
│  └─────────┬──────────┘         └─────────┬──────────┘                │
│            │ 100%                         │                            │
│            ▼                              │                            │
│  ┌─────────────────────────┐              │                            │
│  │ USDC→USDS Depositor     │              │                            │
│  │ USDC→DAI(PSM)→USDS(Exch)│              │                            │
│  └─────────┬───────────────┘              │                            │
└────────────┼──────────────────────────────┼────────────────────────────┘
             │                              │
             ▼                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER 3 (TERMINAL)                       │
│                                                                       │
│  ┌────────────────────────────────────────┐                          │
│  │  yvUSDS-1                              │                          │
│  │  0x1828…47E8                           │                          │
│  │  ~92.6% Spark Compounder (SPK farm)    │                          │
│  │   ~7.4% sUSDS Lender (SSR)             │                          │
│  │  <0.01% Aave V3 Lido USDS (dust)       │                          │
│  └────────────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                       Sky / Spark Stack
            (USDS Staking Rewards + sUSDS Savings Rate)
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
