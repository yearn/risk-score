# Protocol Risk Assessment: Yearn — yvUSDC-1

- **Assessment Date:** March 13, 2026
- **Token:** yvUSDC-1 (USDC-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204)
- **Final Score: 1.3/5.0**

## Overview + Links

yvUSDC-1 is a **USDC-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDC into yield strategies on Ethereum mainnet. The vault currently uses **two active strategies** — "USDC to USDS Depositor" (~79%) and "USDC to sUSDS Lender" (~21%) — both earning yield through the **Sky/MakerDAO ecosystem** by converting USDC into USDS-denominated yield-bearing positions.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDC deposits, issuing yvUSDC-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the Yearn V3 Vault Factory
- **Strategy pipelines:** Both active strategies share the same entry path: USDC → DAI (via MakerDAO PSM Lite at 1:1, 0 fee) → USDS (via DAI-USDS Exchanger at 1:1). The USDS Depositor then deposits into a **yvUSDS vault** (Yearn V3 ERC-4626), while the sUSDS Lender deposits into **sUSDS** (Sky Savings vault) directly
- **Governance:** Managed via the standard **Yearn V3 Role Manager** contract, governed by the **Yearn 6-of-9 global multisig (ySafe)**
- **Multi-strategy capable:** 9 strategies in the default queue (including Morpho, Aave V3, Fluid, Spark), with debt currently split between the USDS Depositor (~79%) and sUSDS Lender (~21%)

**Key metrics (March 13, 2026):**

- **TVL:** ~$31,869,296 USDC
- **Total Supply:** ~28,811,012 yvUSDC-1
- **Price Per Share:** 1.099235 USDC/yvUSDC-1 (~9.9% cumulative appreciation over ~12 months)
- **Total Debt:** ~99.4% deployed (~$177K USDC idle)
- **Deposit Limit:** $50,000,000
- **Profit Max Unlock Time:** 10 days
- **Net APR:** ~2.37% (after 10% performance fee)
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
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — 24-hour delay for strategy additions |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5c13c246e117ed36437303cac8e250ab0`](https://etherscan.io/address/0x444045c5c13c246e117ed36437303cac8e250ab0) |
| Tokenized Strategy | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) |

### Active Strategies (9 in default queue, 2 with debt)

| # | Strategy | Name | Current Debt (USDC) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF) | USDC Fluid Lender | 0 | 0% |
| 2 | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | **USDC to USDS Depositor** | **25,152,715** | **~79%** |
| 3 | [`0x694E47AFD14A64661a04eee674FB331bCDEF3737`](https://etherscan.io/address/0x694E47AFD14A64661a04eee674FB331bCDEF3737) | Morpho Gauntlet USDC Prime Compounder | 0 | 0% |
| 4 | [`0x074134A2784F4F66b6ceD6f68849382990Ff3215`](https://etherscan.io/address/0x074134A2784F4F66b6ceD6f68849382990Ff3215) | Morpho Steakhouse USDC Compounder | 0 | 0% |
| 5 | [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) | Spark USDC Lender | 0 | 0% |
| 6 | [`0x522478B54046aB7197880F2626b74a96d45B9B02`](https://etherscan.io/address/0x522478B54046aB7197880F2626b74a96d45B9B02) | Aave V3 Lido USDC Lender | 0 | 0% |
| 7 | [`0x888239Ffa9a0613F9142C808aA9F7d1948a14f75`](https://etherscan.io/address/0x888239Ffa9a0613F9142C808aA9F7d1948a14f75) | Morpho OEV-boosted USDC Compounder | 0 | 0% |
| 8 | [`0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858`](https://etherscan.io/address/0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858) | Aave V3 USDC Lender | 0 | 0% |
| 9 | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | **USDC to sUSDS Lender** | **6,539,182** | **~21%** |

**Note:** 15 strategies have been added over the vault's 12-month lifetime with 6 revoked, demonstrating active portfolio management. The vault has rotated through strategies including Aave V3, Compound V3, Morpho, Spark, Fluid, and Sky/sUSDS. Debt is currently split between the USDS Depositor (~79%) and sUSDS Lender (~21%) strategies — both route through the Sky/MakerDAO ecosystem.

**Score impact of strategy diversification:** Both active strategies and all available idle strategies (Aave V3, Morpho, Spark, Fluid) lend into minimal-risk, blue-chip protocols. The dependency score remains at 2/5 (blue-chip dependencies), and collateral quality remains at 1/5 (top-tier DeFi protocols). Diversification across these strategies would **not change** the final risk score.

### Strategy Protocol Dependencies

| Protocol | Strategy | TVL |
|----------|----------|-----|
| **Sky/MakerDAO (yvUSDS)** | USDC to USDS Depositor | ~79% of current allocation |
| **Sky/MakerDAO (sUSDS)** | USDC to sUSDS Lender | ~21% of current allocation |
| Morpho | 3 strategies (0% current allocation) | Blue-chip, $6.6B+ TVL, 25+ audits |
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

- **2 active strategies** on a single chain (Ethereum), both routing through the same Sky/MakerDAO ecosystem
- **Simple conversion pipelines:** USDC → DAI → USDS → yvUSDS or sUSDS (three 1:1 conversions + deposit)
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Single protocol ecosystem dependency** (Sky/MakerDAO) — blue-chip
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** March 12, 2024 (block 19,419,991) — **~12 months** in production
- **TVL:** ~$31.87M USDC — established with a $50M deposit limit
- **PPS trend:** 1.000000 → 1.099235 (~9.9% cumulative return over 12 months, ~9.9% annualized)
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** 15 strategies added over lifetime, 6 revoked — active portfolio management. Has used Aave V3, Compound V3, Morpho, Spark, Fluid, and Sky strategies
- **Current allocation:** Debt split between USDC to USDS Depositor (~79%, depositing into yvUSDS) and USDC to sUSDS Lender (~21%) — both activated March 3, 2026
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~22 months). No V3 vault exploits

**Yearn protocol TVL:** ~$240M total across all chains (DeFi Llama, March 2026).

**Sky/sUSDS track record:**
- sUSDS launched as part of Sky Endgame (2024)
- TVL: ~$6.18B USDS deposited (~$10B+ including all sUSDS)
- No security incidents since launch
- Sky Savings Rate (SSR): currently ~4.0% APY, set by Sky Governance
- Revenue sourced from over-collateralized loans and tokenized Treasury bill (RWA) investments

## Funds Management

yvUSDC-1 deploys deposited USDC into yield strategies with ~99.4% capital utilization. Debt is currently split between two strategies, both routing through the Sky/MakerDAO ecosystem.

### Strategy 1: USDC to USDS Depositor (~79% allocation)

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

### Strategy 2: USDC to sUSDS Lender (~21% allocation)

**Contract:** [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)

**Conversion pipeline:**

1. **USDC → DAI** via MakerDAO PSM Lite — 1:1 at 0% fee
2. **DAI → USDS** via Sky DAI-USDS Exchanger — 1:1, no fee
3. **USDS → sUSDS** via Sky Savings vault ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) — earns the SSR (~4.0% APY)

**Withdrawal pipeline:** Reverse path (sUSDS → USDS → DAI → USDC). Same PSM fee fallback to Uniswap V3.

**Strategy parameters:** Same as USDS Depositor (100M deposit limit, 0.05% max PSM fee, Brain multisig management)

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSDC-1 (ERC-4626 standard). Subject to $50M deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDC-1 for USDC. Withdrawal unwinds the yvUSDS/sUSDS → USDS → DAI → USDC pipeline, which is highly liquid
- **No cooldown or lock period** — unlike yvUSD's LockedyvUSD wrapper
- **Fees:** 0% management fee, 10% performance fee (taken via accountant during `process_report`)

### Collateralization

- **100% on-chain USDC backing** — all deposits are USDC, converted through blue-chip protocols to yvUSDS and sUSDS
- **Collateral quality:** Both strategies route into the Sky/MakerDAO ecosystem — sUSDS is backed by over-collateralized loans and RWA (Treasury bills); yvUSDS is a Yearn V3 vault that itself deploys into Sky/MakerDAO yield sources
- **No leverage** — unlike yvUSD's looper strategies, these are simple deposits into savings rate products
- **Both positions are fully redeemable** — sUSDS and yvUSDS are ERC-4626 vaults, and USDS converts 1:1 to DAI via the Exchanger

### Provability

- **yvUSDC-1 exchange rate:** Calculated on-chain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` reads the underlying vault share balance (yvUSDS or sUSDS) and converts to USDC equivalent on-chain
- **sUSDS rate:** The Sky Savings Rate is set by Sky Governance and applied on-chain via the `pot`/`ssr` mechanism. The sUSDS exchange rate increases continuously based on the SSR
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 10 days (`profitMaxUnlockTime`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDC-1 for USDC via ERC-4626 `withdraw()`/`redeem()`. Triggers reverse pipeline through yvUSDS/sUSDS → USDS → DAI → USDC
- **Highly liquid underlying:** sUSDS holds ~$6.18B USDS — the vault's ~$31.87M is less than 0.5% of the sUSDS pool. Redemption will not impact the pool
- **PSM liquidity:** The MakerDAO PSM Lite provides deep DAI ↔ USDC liquidity at 0% fee. PSM capacity is managed by Sky Governance and typically holds billions of USDC
- **No DEX liquidity needed** — exit is via the protocol's own pipeline (PSM + Exchanger), not DEX AMMs
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **No withdrawal queue or cooldown** — atomic redemption through the pipeline
- **Deposit limit:** $50M cap — generous relative to current TVL of $31.87M

## Centralization & Control Risks

### Governance

The yvUSDC-1 vault uses the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract.

**Governance hierarchy:**

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | All 14 roles (full admin) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | Manages via Role Manager |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 24h delay | Strategy additions via Role Manager |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

**ySafe 6-of-9 multisig signers** include publicly known contributors: Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others ([source](https://docs.yearn.fi/developers/security/multisig)).

**Governance assessment:**
1. **No EOA role concentration** — all sensitive roles are held by multisigs, unlike the yvUSD vault's temporary EOA issue
2. **Strategy additions go through a 24-hour timelock** via the TimelockController
3. **Standard Yearn governance** — same setup used across 37 vaults, battle-tested pattern
4. **Immutable vault** — no proxy upgrades possible

### Programmability

- **Exchange rate (PPS):** Calculated on-chain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless on-chain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 10 days
- **Debt allocation:** Managed by both the Debt Allocator (automated) and Brain multisig (manual). Currently split across two strategies
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Sky/MakerDAO (yvUSDS + sUSDS)** | Critical | 100% of current allocation (~79% via yvUSDS, ~21% via sUSDS). ~$6.18B TVL in sUSDS. Blue-chip, extensively audited, $10M bug bounty. One of the oldest DeFi protocols |
| **MakerDAO PSM Lite** | Critical | USDC ↔ DAI conversion at 1:1. 0% fee. Deep liquidity (billions of USDC capacity). Audited by ChainSecurity and Cantina |
| **Sky DAI-USDS Exchanger** | Critical | DAI ↔ USDS 1:1 conversion. Core Sky infrastructure |
| **Uniswap V3 (fallback)** | Low | Only used if PSM fee exceeds 0.05%. Currently not active (PSM fee is 0%) |

**Dependency quality:** All current dependencies are on Sky/MakerDAO — a single blue-chip protocol ecosystem with 8+ years of history, extensive audit coverage, and $10M bug bounty. The USDS Depositor adds a layer of Yearn V3 vault risk (yvUSDS), but this uses the same audited V3 infrastructure. While this is a concentration risk (100% in one protocol family), the protocol quality is among the highest in DeFi.

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
- **Strategy additions/removals** — `StrategyChanged` events indicate portfolio changes (new strategies go through 24h timelock)
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

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~22 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Blue-chip single ecosystem dependency:** 100% allocated to Sky/MakerDAO (~79% via yvUSDS, ~21% via sUSDS) — one of DeFi's oldest and most audited protocols with $10M bug bounty and ~$6.18B in sUSDS deposits
- **Standard Yearn governance:** Uses the Yearn V3 Role Manager with the 6-of-9 ySafe multisig (named, prominent DeFi signers). No EOA role concentration. Strategy additions go through 24-hour timelock
- **Simple, low-complexity strategies:** USDC → DAI → USDS → yvUSDS/sUSDS pipelines with three 1:1 conversions. No leverage, no cross-chain bridging, no looper mechanics
- **Established track record:** 12 months in production with $31.87M TVL, ~9.9% cumulative return, zero incidents
- **Active monitoring:** yvUSDC-1 is in Yearn's hourly monitoring system with Telegram alerts for large flows

### Key Risks

- **Single-ecosystem concentration:** 100% of vault funds in two strategies (yvUSDS ~79%, sUSDS ~21%), both routing through Sky/MakerDAO. If Sky/MakerDAO experiences an issue, the entire vault is affected
- **Sky Savings Rate variability:** SSR has been reduced from 15% → 6.5% → 4.5% → 4.0% over the past year. Further reductions would decrease vault yield but do not affect principal
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
| Production history | **~12 months** (March 12, 2024). V3 framework: ~22 months |
| TVL | **~$31.87M** USDC. Deposit limit: $50M |
| Security incidents | None on V3. None on sUSDS |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5/5** — 3+ audits by top firms on the vault infrastructure, plus 7+ auditors on the underlying protocol. 12 months of production history with $31.87M TVL and zero incidents. V3 framework has 22 months of clean track record. The high-quality audit coverage on both layers (vault + underlying) warrant a score between 1 and 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | Strategy additions through **24-hour TimelockController**. Direct vault parameter changes by Daddy (6/9) have no timelock |
| Privileged roles | Well-distributed: Daddy (6/9, all roles), Brain (3/8, operational), Security (4/7), Keeper + Debt Allocator (bots) |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.5/5** — Immutable vault contracts (no proxy upgrade risk). 6-of-9 multisig with named, prominent DeFi signers. The most critical governance action — adding new strategies, which could break the system — goes through a **24-hour TimelockController**. No EOA role concentration. Direct vault parameter changes (deposit limits, emergency shutdown) by the 6/9 multisig have no timelock, preventing a score of 1.

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
| Protocol count | 1 active ecosystem dependency (Sky/MakerDAO via 2 strategies), 4+ available (Morpho, Aave V3, Fluid, Spark) |
| Criticality | Sky/MakerDAO: 100% of current allocation (~79% yvUSDS, ~21% sUSDS) |
| Quality | Blue-chip: 8+ years history, $6.18B sUSDS TVL, $10M bug bounty, 7+ auditors |

**Dependencies Score: 2/5** — Single active dependency on a blue-chip protocol. Sky/MakerDAO is among the highest-quality DeFi dependencies possible. Per rubric, "1-2 blue-chip dependencies" = score 2. The 100% concentration in one protocol is a concern, but the protocol quality is exceptional.

**Centralization Score = (1.5 + 1 + 2) / 3 = 1.5**

**Score: 1.5/5** — Immutable vault with 6/9 named-signer multisig. 24h timelock on the most critical action (strategy additions). Fully programmatic operations with all funds on-chain. Single blue-chip dependency. Minor gap: no timelock on direct vault parameter changes.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed to blue-chip Sky/MakerDAO yield products (yvUSDS + sUSDS) |
| Collateral quality | yvUSDS and sUSDS: backed by over-collateralized loans and Treasury bills (RWA) via MakerDAO |
| Leverage | None |
| Verifiability | ERC-4626, all positions on-chain |

**Collateralization Score: 1/5** — 100% on-chain USDC backing deployed to the highest-quality DeFi savings protocols (Sky/MakerDAO via yvUSDS and sUSDS). No leverage. Fully verifiable. Blue-chip collateral backed by over-collateralized loans and Treasury bills. Real-time on-chain verification.

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
| Exit mechanism | ERC-4626 redemption → yvUSDS/sUSDS → USDS → DAI → USDC pipeline |
| Liquidity depth | sUSDS: $6.18B TVL. PSM: billions of USDC capacity. Vault is 0.5% of pool |
| Large holder impact | $31.87M vault vs $6.18B pool — negligible impact |
| Same-value asset | USDC-denominated — no price divergence risk |
| Withdrawal restrictions | None — atomic redemption, no cooldown |

**Score: 1.5/5** — The vault lends into lending protocols (Sky/sUSDS, and available strategies for Aave V3, Morpho, Spark, Fluid) which are liquid the vast majority of the time. Withdrawals are atomic via the ERC-4626 pipeline with no cooldown. In rare edge cases (e.g., PSM liquidity constraints, temporary protocol congestion), withdrawals could face short delays — hence 1.5 rather than 1.

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

- **Time-based:** Reassess in 6 months (September 2026) or annually
- **TVL-based:** Reassess if TVL exceeds $100M or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, governance change, or Sky/MakerDAO incident
- **Strategy-based:** Reassess if the vault reallocates away from Sky/MakerDAO strategies into riskier strategies (e.g., leveraged positions). The current score assumes 100% allocation to blue-chip Sky/MakerDAO ecosystem (yvUSDS + sUSDS) — a shift to riskier strategies would significantly change the risk profile
- **SSR-based:** Reassess if Sky Savings Rate drops below 2% (may indicate Sky governance issues) or if PSM fees are introduced
- **Governance-based:** Reassess if ySafe composition changes (signer additions/removals, threshold changes)
