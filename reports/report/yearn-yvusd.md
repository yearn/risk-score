# Protocol Risk Assessment: Yearn — yvUSD

- **Assessment Date:** April 3, 2026
- **Token:** yvUSD (USD yVault)
- **Chain:** Ethereum (with cross-chain strategies on Arbitrum)
- **Token Address:** [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987)
- **Final Score: 2.4/5.0**

## Overview + Links

yvUSD is a **USDC-denominated cross-chain Yearn V3 vault** (ERC-4626) that deploys deposited USDC into multiple yield strategies across Ethereum mainnet and Arbitrum. The vault uses **Circle's CCTP (Cross-Chain Transfer Protocol)** to bridge assets to strategies on remote chains, requiring only strategy contracts on those chains rather than full Yearn V3 infrastructure.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting USDC deposits, issuing yvUSD shares
- **Cross-chain strategies:** Use a two-contract pattern — an origin `CCTPStrategy` on Ethereum and a remote `CCTPRemoteStrategy` (ERC-4626 variant) on the destination chain. The origin strategy restricts deposits to a single `DEPOSITER` address (the yvUSD vault itself). When `report()` is called on the destination chain, `_harvestAndReport()` reports new assets back to the origin by queuing a CCTP message — no separate keeper relay required. The origin receives updates via `handleReceiveFinalizedMessage` and tracks remote capital via a `remoteAssets` variable. Additional remote vault implementations using different native bridges are currently in development
- **LockedyvUSD:** Companion cooldown wrapper where users lock yvUSD shares for additional yield. Users locking shares gives the vault better guarantees on duration risk, enabling higher-yield strategies without sacrificing atomic liquidity for non-lockers. Cooldown: 14 days (configurable), withdraw window: 5 days (configurable). Lockers receive a percentage of extra yield as an illiquidity premium. Also serves as the vault's accountant
- **Strategies:** 11 active strategies deploying into Morpho, Maple syrupUSDC, InfiniFi, Sky/MakerDAO, Spark, 3Jane USD3, Pendle/Spectra PT tokens, Cap stcUSD, and Fluid
- **Yield sources:** Lending yield (Morpho, Fluid, Spark, Sky), looper strategies (borrow-against-collateral loops on Morpho), and fixed-rate PT tokens (Pendle/Spectra)

**Key metrics (April 3, 2026):**

- **TVL:** ~$4,031,087 USDC
- **Total Supply:** ~4,003,217 yvUSD
- **Price Per Share:** 1.006961 USDC/yvUSD (~0.70% appreciation in ~74 days, ~3.4% annualized)
- **Total Debt:** 100% deployed (0 idle)
- **Deposit Limit:** $5,000,000 (80.6% utilized)
- **Profit Max Unlock Time:** 7 days
- **Net APR:** 4.23% | **APY:** 4.32%

**Links:**

- [yvUSD Documentation](https://docs.yearn.fi/getting-started/products/yvaults/yvusd)
- [yvUSD Developer Docs](https://docs.yearn.fi/developers/yvusd)
- [yvUSD APR API](https://yvusd-api.yearn.fi)
- [yvUSD Vault Portfolio (DeBank)](https://debank.com/bundles/221066/portfolio)
- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)

## Contract Addresses

### Core yvUSD Contracts (Ethereum)

| Contract | Address | Type |
|----------|---------|------|
| yvUSD Vault | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | Yearn V3 Vault (v3.0.4), Vyper minimal proxy |
| LockedyvUSD (Accountant) | [`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040) | Cooldown wrapper + vault accountant |
| APR Oracle | [`0x1981AD9F44F2EA9aDd2dC4AD7D075c102C70aF92`](https://etherscan.io/address/0x1981AD9F44F2EA9aDd2dC4AD7D075c102C70aF92) | On-chain APR estimation |
| Fee Splitter | [`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470) | Revenue distribution |

### Governance Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Standard Yearn Role Manager — vault `role_manager` |
| Strategy Manager (Timelock) | [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) | TimelockController — **7-day delay**. Governs the RoleManager. TIMELOCK_ADMIN_ROLE held only by the timelock itself (not Daddy or any EOA). DEFAULT_ADMIN never granted (`admin = address(0)` at [construction](https://etherscan.io/tx/0x3063e5a82b383d0f5b38e8735dd13c0c9d492c3bfe5dc9d3d23fc829c60f96b0)) — no one can grant/revoke roles outside the propose→wait→execute flow |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — **sole PROPOSER**, EXECUTOR, and CANCELLER on timelock. Holds nearly all vault roles (bitmask 0x3FF6) |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe — operational roles + **CANCELLER** on timelock |
| Security | [`0xe5e2BAf96198c56380DDd5e992D7d1adA0E989C0`](https://etherscan.io/address/0xe5e2BAf96198c56380DDd5e992D7d1adA0E989C0) | 4-of-7 Gnosis Safe — DEBT_MANAGER, MAX_DEBT_MANAGER, EMERGENCY_MANAGER |
| Debt Allocator | [`0x1E9eB053228B1156831759401DE0E115356b8671`](https://etherscan.io/address/0x1E9eB053228B1156831759401DE0E115356b8671) | Contract — REPORTING_MANAGER, DEBT_MANAGER |
| Keeper | [`0x604e586F17cE106B64185a7A0d2c1DA5BaCe711e`](https://etherscan.io/address/0x604e586F17cE106B64185a7A0d2c1DA5BaCe711e) | yHaaSRelayer — REPORTING_MANAGER |
| Deployer EOA | [`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271) | **0 vault roles** (confirmed). Fee Splitter governance only |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory | [`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) |
| Vault Implementation (v3.0.4) | [`0xd8063123BBA3B480569244AE66BFE72B6c84b00d`](https://etherscan.io/address/0xd8063123BBA3B480569244AE66BFE72B6c84b00d) |
| Tokenized Strategy | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) |
| Yearn V3 Keeper | [`0x52605BbF54845f520a3E94792d019f62407db2f8`](https://etherscan.io/address/0x52605BbF54845f520a3E94792d019f62407db2f8) |

### Active Strategies (11)

| # | Strategy | Name | Current Debt (USDC) | Allocation | Protocols Used |
|---|----------|------|--------------------:|-----------:|----------------|
| 1 | [`0xf28d...442`](https://etherscan.io/address/0xf28d...442) | syrupUSDC/USDC Morpho Looper | 1,747,438 | 43.35% | Maple syrupUSDC, Morpho |
| 2 | [`0x0e29...626`](https://etherscan.io/address/0x0e29...626) | Morpho Yearn OG USDC Compounder | 970,687 | 24.08% | Morpho |
| 3 | [`0x5f9D...f89`](https://etherscan.io/address/0x5f9D...f89) | Infinifi sIUSD Morpho Looper | 612,648 | 15.20% | InfiniFi siUSD, Morpho |
| 4 | [`0x7130...f8f`](https://etherscan.io/address/0x7130...f8f) | USDC to sUSDS Depositor | 421,438 | 10.45% | Sky/MakerDAO |
| 5 | [`0x9e0A...75b`](https://etherscan.io/address/0x9e0A...75b) | USDC To Spark USDS Depositor | 100,257 | 2.49% | Spark, Sky/MakerDAO |
| 6 | [`0x2f56...179`](https://etherscan.io/address/0x2f56...179) | Arbitrum syrupUSDC/USDC Morpho Looper | 100,114 | 2.48% | Maple syrupUSDC, Morpho, CCTP |
| 7 | [`0x4c0e...34b`](https://etherscan.io/address/0x4c0e...34b) | USD3 Pendle PT Maxi | 50,015 | 1.24% | 3Jane USD3, Pendle |
| 8 | [`0x7bf1...d1d`](https://etherscan.io/address/0x7bf1...d1d) | PT stcUSD Jul 23 Morpho Looper | 28,491 | 0.71% | Cap stcUSD, Morpho, Pendle/Spectra |
| 9 | [`0x48E6...a93`](https://etherscan.io/address/0x48E6...a93) | USDC To SKY USDS Depositor | 0 | 0.0% | Sky/MakerDAO |
| 10 | [`0x00C8...4cF`](https://etherscan.io/address/0x00C8...4cF) | USDC Fluid Lender | 0 | 0.0% | Fluid |
| 11 | [`0x1983...9e`](https://etherscan.io/address/0x1983...9e) | Arb Yearn Degen Morpho Compounder | 0 | 0.0% | Morpho, CCTP |

**Note:** Since the March 2026 assessment, one strategy has been removed (PT siUSD March 25 — matured) and significant rebalancing has occurred. The vault has shifted from 3Jane USD3 dominance (33% → 1.2%) to Maple syrupUSDC dominance (9.4% → 45.8% across two strategies). Active portfolio management continues with multiple strategy additions and revocations over the vault's ~74-day history.

### Strategy Protocol Dependencies with Existing Reports

Several underlying protocols have been previously assessed in this repository:

| Protocol | Report Score | yvUSD Allocation |
|----------|-------------|-----------------|
| [Maple syrupUSDC](../report/maple-syrupusdc.md) | **2.33/5** (Low Risk) | 45.83% (two strategies) |
| [InfiniFi](../report/infinifi.md) | **2.8/5** (Medium Risk) | 15.20% |
| [3Jane USD3](../report/3jane-usd3.md) | **3.5/5** (Medium Risk) | 1.24% |
| [Fluid](../report/fluid.md) | **1.1/5** (Minimal Risk) | 0% (currently inactive) |
| [Spectra](../report/spectra-finance.md) | **2.25/5** (Low Risk) | Used for PT token infrastructure |

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

The underlying vault infrastructure has been audited by 3 reputable firms:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### yvUSD-Specific Audits

No external third-party audit specifically covering the CCTPStrategy cross-chain code, the LockedyvUSD cooldown wrapper, or individual yvUSD strategies was found. However, the **CCTPStrategy has undergone strict internal review by ySec** (Yearn's security team). All strategies go through Yearn's rigorous internal review process (see Strategy Review Process below).

### Strategy Review Process

Yearn uses a formal **12-metric risk scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)) for evaluating and approving strategies. The framework scores strategies across two dimensions:

**Strategy-Related Scores (6 metrics):**
- **Review** — number of Sources of Trust (internal strategist, peer review, expert review, ySec security review, recurring security review)
- **Testing** — code coverage requirements (score 1 = 95%+, score 5 = <70%)
- **Complexity** — source lines of code (score 1 = 0-150 sLOC, score 5 = 600+)
- **Risk Exposure** — potential loss percentage
- **Centralization Risk** — off-chain management dependency
- **Protocol Integration** — number of external protocols integrated

**External Protocol-Related Scores (6 metrics):**
- **Auditing** — number of trusted audits on external protocols
- **Centralization** — owner control/governance of external protocols
- **TVL** — active total value locked
- **Longevity** — contract deployment age
- **Protocol Type** — category (blue-chip vs novel vs cross-chain vs off-chain)

All 12 scores are summed and mapped to risk levels (Level 1-4). ySec can make exceptions with textual justification. This is a rigorous, documented process that provides strong assurance for strategy quality even without external audits on individual strategies.

### Underlying Protocol Audits

| Protocol | Audit Coverage | Notes |
|----------|---------------|-------|
| Morpho | 25+ audits (Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora) | Blue-chip. Formal verification by Certora |
| Pendle | 6+ audits (Ackee, Dedaub, ChainSecurity, Spearbit, Code4rena) | Well-established |
| Circle CCTP | ChainSecurity (V1 2023, V2 March 2025, V2 update April 2025, Gateway July 2025) | Trust-minimized bridge |
| Sky/MakerDAO | Extensively audited across many years | Blue-chip |
| Spark | Inherits MakerDAO audit coverage | Blue-chip |
| Cap (stcUSD) | TODO — no specific audit information found in public documentation | ~$500M TVL. Assessed internally as risk-2 (non-public report) |

### Bug Bounty

- **Immunefi:** Active bug bounty for Yearn Finance. Max payout: **$200,000** (Critical). Scope includes V3 vaults (`VaultV3.vy`, `VaultFactory.vy`).
  - Link: https://immunefi.com/bounty/yearnfinance/
- **Sherlock:** Also listed: https://audits.sherlock.xyz/bug-bounties/30
- **Safe Harbor:** Not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvUSD system is moderately complex:

- **11 active strategies** across 2 chains (Ethereum + Arbitrum)
- **Cross-chain accounting** via Circle CCTP (destination chain reports back to origin via CCTP on `_harvestAndReport()`)
- **Looper strategies** using Morpho for leveraged yield (borrow-against-collateral loops)
- **PT token strategies** with maturity dates requiring rollover
- **Custom accountant** (LockedyvUSD) combining cooldown/locking mechanics with fee management
- **Multiple protocol dependencies** (8+ distinct protocols)
- **V3 vault itself is non-upgradeable** (immutable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** January 19, 2026 (block 24271831) — **~74 days** in production
- **TVL:** ~$4.03M USDC — early stage with a $5M deposit limit (80.6% utilized)
- **PPS trend:** 1.000000 → 1.006961 (~0.70% appreciation over 74 days, ~3.4% annualized)
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** Active portfolio management continues — one strategy removed (PT siUSD March 25 matured), significant rebalancing from 3Jane dominance to Maple dominance
- **Governance maturation:** Vault migrated from direct Safe governance to standard Yearn RoleManager with 7-day timelock (March 2026)
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~23 months). No V3 vault exploits

**Yearn protocol TVL:** ~$240M total across all chains (DeFi Llama, April 2026).

## Funds Management

yvUSD deploys deposited USDC across 11 strategies with 100% capital utilization (0 idle). Strategies fall into four categories:

### Strategy Categories

**1. Looper Strategies (85.8% of TVL)**

Strategies that borrow against collateral on Morpho to achieve leveraged yield positions. These include:
- syrupUSDC/USDC Morpho Looper (43.35%)
- Morpho Yearn OG USDC Compounder (24.08%)
- Infinifi sIUSD Morpho Looper (15.20%)
- Arbitrum syrupUSDC/USDC Morpho Looper (2.48%, cross-chain)
- PT stcUSD Jul 23 Morpho Looper (0.71%)

**Looper risk:** These strategies are leveraged — they borrow USDC on Morpho against collateral (PT tokens, siUSD, syrupUSDC). If the collateral depegs or the Morpho market becomes illiquid, positions may face liquidation or inability to unwind.

**2. Fixed-Rate PT Strategies (1.2% of TVL)**

- USD3 Pendle PT Maxi (1.24%) — holds Pendle Principal Tokens backed by 3Jane USD3

**PT risk:** PT tokens have fixed maturity dates. Before maturity, exit requires selling on AMM (Pendle/Spectra) at potentially unfavorable rates. At maturity, PT is manually rolled over by converting to SY (yield token) via a `rollover()` call on the strategy — this process cannot steal user funds. If not rolled over, the position simply holds the redeemed underlying.

**3. Lending Strategies (12.9% of TVL)**

- USDC to sUSDS Depositor (10.45%) — deposits into Sky/MakerDAO
- USDC To Spark USDS Depositor (2.49%) — deposits into Spark

**Lending risk:** Standard DeFi lending risk. Sky and Spark are blue-chip protocols with extensive audit coverage.

**4. Cross-Chain Strategies (2.5% active, with inactive allocations)**

Two strategies bridge USDC to Arbitrum via Circle CCTP:
- Arbitrum syrupUSDC/USDC Morpho Looper (2.48%)
- Arb Yearn Degen Morpho Compounder (0%, inactive)

**Cross-chain risk:** Bridge delays (CCTP attestation time), and remote chain execution risk.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSD (ERC-4626 standard). Subject to $5M deposit limit
- **Withdrawals:** ERC-4626 standard. Users can redeem yvUSD for USDC. However:
  - **100% of funds are deployed** (0 idle) — withdrawals require unwinding strategy positions
  - **Cross-chain strategies** require CCTP bridging back, which takes time
  - **PT strategies** may have liquidity constraints before maturity
  - **Looper strategies** require deleveraging, which may take multiple transactions
- **LockedyvUSD:** Optional lock wrapper with 14-day cooldown + 5-day withdrawal window. Yields a "locker bonus" but restricts exit timing
- **No fees on deposits/withdrawals** — fees are taken via the accountant during `process_report` (performance/management fees)

### Collateralization

- **100% on-chain USDC backing** — all deposits are USDC, all strategy positions ultimately track back to USDC value
- **Collateral quality varies by strategy:**
  - Blue-chip (Sky, Spark, Fluid): 12.9% of TVL
  - Low-risk (Maple syrupUSDC 2.33/5): 45.8% of TVL — now the dominant allocation
  - Medium-risk (InfiniFi 2.8/5, 3Jane 3.5/5): **16.4% of TVL** — significantly reduced from 65.6% in March
  - Low-risk (Cap stcUSD, internal risk-2): 0.71% of TVL
  - Established infrastructure (Morpho, Pendle): used across 85%+ of strategies
- **Leverage via looper strategies:** Borrowing against collateral on Morpho. Looper allocation increased from ~58% to ~86% of TVL

### Provability

- **yvUSD exchange rate:** Calculated on-chain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` is on-chain. The vault's `totalAssets()` is the sum of all strategy debts
- **Cross-chain lag:** For cross-chain strategies, `remoteAssets` on the origin is updated when CCTP messages arrive (sent automatically by `_harvestAndReport()` on the destination chain). Between report cycles, the value can be stale — the vault's reported `totalAssets()` may not reflect real-time changes on Arbitrum
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 7 days (`profitMaxUnlockTime`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSD for USDC via ERC-4626 `withdraw()`/`redeem()`. Subject to strategy liquidity
- **Zero idle funds:** Currently 100% of vault assets are deployed to strategies. Withdrawals require unwinding positions
- **Strategy withdrawal constraints:**
  - Looper strategies: Must deleverage on Morpho (may require multiple keeper transactions)
  - PT strategies: Before maturity, must sell PTs on AMM (potential slippage). At maturity, manual rollover via `rollover()` call converting PT to SY
  - Cross-chain strategies: Withdrawal triggers CCTP bridging back from remote chain (hours for CCTP attestation)
  - Lending strategies (Sky, Spark): Generally liquid for immediate withdrawal
- **DEX liquidity:** No known DEX liquidity pools for yvUSD. The vault is an ERC-4626 token, not traded on DEXes
- **LockedyvUSD:** 14-day cooldown + 5-day withdrawal window. Shares in cooldown cannot be transferred
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **Deposit limit:** $5M cap limits both concentration risk and indicates early stage

## Centralization & Control Risks

### Governance

Since the initial March 2026 assessment, the yvUSD vault has **completed its governance setup** by migrating to the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)). This is the same governance framework used by yvUSDC-1 and 37+ other Yearn vaults — a significant maturation from the initial direct-Safe governance used during the vault's launch phase.

**Governance hierarchy:**

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | Nearly all roles (bitmask 0x3FF6). **Sole PROPOSER**, EXECUTOR, CANCELLER on timelock |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | Operational roles (bitmask 0x3972) — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY. CANCELLER on timelock |
| **Security** | [`0xe5e2BAf96198c56380DDd5e992D7d1adA0E989C0`](https://etherscan.io/address/0xe5e2BAf96198c56380DDd5e992D7d1adA0E989C0) | 4-of-7 | DEBT_MANAGER, MAX_DEBT_MANAGER, EMERGENCY_MANAGER (bitmask 0x20C0) |
| **Strategy Manager (Timelock)** | [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (bitmask 0x8F). DEFAULT_ADMIN never granted. Timelock holds TIMELOCK_ADMIN_ROLE — config changes require 7-day delay |
| **Keeper** | [`0x604e586F17cE106B64185a7A0d2c1DA5BaCe711e`](https://etherscan.io/address/0x604e586F17cE106B64185a7A0d2c1DA5BaCe711e) | Bot | REPORTING_MANAGER |
| **Debt Allocator** | [`0x1E9eB053228B1156831759401DE0E115356b8671`](https://etherscan.io/address/0x1E9eB053228B1156831759401DE0E115356b8671) | Bot | REPORTING_MANAGER + DEBT_MANAGER |

**Daddy (ySafe) 6-of-9 multisig signers** include publicly known contributors: Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others ([source](https://docs.yearn.fi/developers/security/multisig)).

**Governance assessment:**
1. **Standard Yearn governance** — same setup used across 37+ vaults (including yvUSDC-1), battle-tested pattern
2. **No EOA role concentration** — deployer EOA has 0 vault roles (confirmed). All vault operations require multisig or contract authorization
3. **7-day timelock with locked-down role structure** — strategy additions and other critical operations go through the TimelockController (delay increased from initial 24h to 7 days). The timelock roles are tightly controlled:
   - **PROPOSER:** Daddy (6/9) only — no one else can initiate timelocked operations
   - **EXECUTOR:** Daddy (6/9) + TimelockExecutor contract (governed by Brain, internal executors: Brain + Deployer EOA)
   - **CANCELLER:** Daddy (6/9) + Brain (3/8)
   - **TIMELOCK_ADMIN_ROLE:** held only by the timelock contract itself — not by Daddy, Brain, or any EOA. Config changes (delay, role grants) must go through the 7-day delay
   - **DEFAULT_ADMIN_ROLE:** never granted (`admin = address(0)` at construction). No one can grant or revoke timelock roles outside the normal propose→wait→execute flow
4. **Immutable vault** — no proxy upgrades possible
5. **Multi-layer security** — Daddy (governance), Brain (operations), Security (emergency), and automated bots (Keeper, Debt Allocator) with differentiated responsibilities

**Remaining concern:** The deployer EOA ([`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271)) remains the sole `governance` address on the Fee Splitter contract ([`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470)). This is a low-impact concern (fee distribution only, not fund custody) but deviates from the otherwise robust multi-sig governance pattern.

### Programmability

- **Exchange rate (PPS):** Calculated on-chain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless on-chain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 7 days. Losses are immediate
- **Debt allocation:** Automated via Debt Allocator contract, with manual override available to DEBT_MANAGER role holders (Daddy, Brain, Security)
- **Cross-chain accounting:** When `report()` is called on the destination chain, `_harvestAndReport()` automatically queues a CCTP message back to the origin. No separate keeper relay required. Can be stale between report cycles
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Allocation | Notes |
|-----------|-------------|-----------|-------|
| **Morpho** | Critical | ~86% (5 strategies) | $6.6B TVL, 25+ audits, formal verification. Used for looper leverage and USDC compounding |
| **Maple syrupUSDC** | Critical | 45.8% | Report score 2.33/5 (Low Risk). Overcollateralized institutional lending, ~$1.7B TVL. **Highest single-protocol allocation** |
| **InfiniFi** | High | 15.2% | Report score 2.8/5 (Medium Risk). Stablecoin protocol deploying into various DeFi strategies, ~$150M TVL |
| **Sky/MakerDAO** | High | 10.5% | Blue-chip, extensively audited. Stable lending yield |
| **Pendle/Spectra** | Medium | Used in PT strategies | $2.1B TVL (Pendle), 6+ audits. PT token infrastructure for fixed-rate yield |
| **Spark** | Medium | 2.5% | Part of Sky/MakerDAO ecosystem. Blue-chip |
| **Circle CCTP** | Medium | Cross-chain bridge | Audited by ChainSecurity (V1 + V2). Trust assumption: Circle attestation (same trust as holding USDC) |
| **3Jane USD3** | Low | 1.2% | Report score 3.5/5. Significantly reduced from 33% in March. Unsecured credit-based lending |
| **Cap (stcUSD)** | Low | 0.7% | ~$500M TVL. Yield-bearing stablecoin. Reduced from 5.1% |
| **Fluid** | Low | 0% (inactive) | Report score 1.1/5. Currently no allocation |

**Dependency concentration:** The vault's largest protocol dependency is now Maple syrupUSDC at 45.8% (rated Low Risk 2.33/5), a significant improvement from the previous concentration in medium-risk protocols (65.6% in 3Jane + InfiniFi). Medium-risk protocol exposure has dropped to ~16.4% (InfiniFi 15.2% + 3Jane 1.2%). However, the Maple concentration risk is notable — a single protocol failure could impact nearly half the vault. Morpho remains the critical infrastructure layer across 86% of strategies.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The Yearn global multisig has 9 named signers including Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others
- **yvUSD governance:** Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations
- **Documentation:** Comprehensive Yearn V3 documentation. yvUSD-specific docs are now published on the official Yearn docs site, including cross-chain strategy architecture, LockedyvUSD mechanics, and a dedicated APR API service ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi))
- **Legal:** Yearn Finance has converted its ychad.eth multisig into a BORG (cybernetic organization) via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation company with smart contract governance restrictions. The YFI token governs the protocol via YIP proposals
- **Incident response:** Yearn has demonstrated incident response capability across historical events. V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **V3 immutability:** Vault contracts cannot be upgraded — this eliminates proxy upgrade risk but means bugs cannot be patched without deploying a new vault

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring-scripts-py`](https://github.com/yearn/monitoring-scripts-py) repository:

- **Large flow alerts** (`yearn/alert_large_flows.py`): Runs **hourly via GitHub Actions**. Monitors deposit/withdrawal events via Envio indexer, alerts on flows exceeding $5M threshold via Telegram. Currently monitors 21 vaults across Ethereum, Base, Arbitrum, and Katana
- **Endorsed vault check** (`yearn/check_endorsed.py`): Runs weekly, verifies all Yearn V3 vaults are endorsed on-chain via the registry contract
- **Timelock monitoring** (`timelock/timelock_alerts.py`): Monitors Yearn TimelockController across 6 chains

**Note:** yvUSD is not yet added to the monitored vault list in `alert_large_flows.py`, but the infrastructure is in place and can be extended.

Additionally, Yearn provides a dedicated **yvUSD APR API** ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi), [source](https://github.com/yearn/yearn-yvusd-apr-service)) that aggregates on-chain vault/strategy accounting with off-chain APR oracle computations. Endpoints include `/api/health` (data recency), `/api/aprs` (precomputed APRs), and `/api/snapshot` (raw strategy cache). A **DeBank bundle** ([portfolio view](https://debank.com/bundles/221066/portfolio)) provides a consolidated view of all vault fund positions.

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSD Vault | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit/Withdraw events |
| LockedyvUSD | [`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040) | Cooldown events, configuration changes (cooldown duration, withdrawal window) |
| Strategy Manager (Timelock) | [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) | Pending operations, MinDelayChange events, role grants/revocations |
| Daddy / ySafe | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer/threshold changes, submitted transactions |
| Brain | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | Signer/threshold changes, submitted transactions |
| Deployer EOA | [`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271) | Fee Splitter governance changes only (0 vault roles) |
| Fee Splitter | [`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470) | Governance changes, fee distribution changes |

### Critical Events to Monitor

- **PPS decrease** — any decrease in `convertToAssets(1e6)` indicates a loss event. Should only increase
- **Strategy additions/removals** — `StrategyChanged` events indicate portfolio changes (new strategies go through 7-day timelock)
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events
- **Emergency actions** — `Shutdown` event on vault
- **Timelock operations** — pending proposals on the TimelockController (strategy additions, accountant changes, delay changes)
- **Signer/threshold changes** on the Daddy (6-of-9) and Brain (3-of-8) Safes
- **Cross-chain strategy accounting** — monitor `remoteAssets` for staleness (compare to actual on-chain positions on Arbitrum)
- **Looper strategy health** — monitor Morpho market positions for proximity to liquidation
- **Underlying protocol health** — monitor Maple, InfiniFi, and Morpho for incidents

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `getThreshold()` / `getOwners()` | Daddy / Brain Safes | Governance integrity | Daily |
| `getMinDelay()` | Timelock | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~23 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Standard Yearn governance with 7-day timelock:** The vault now uses the standard Yearn V3 governance pattern (same as yvUSDC-1 and 37+ other vaults) with a 7-day TimelockController for critical operations (adding strategies, changing accountant). Daddy/ySafe (6-of-9, with publicly known signers) is the sole proposer/executor. The timelock is self-governed (holds TIMELOCK_ADMIN_ROLE) — any config changes must themselves go through the 7-day delay
- **Multi-layer security:** Daddy (governance), Brain (operations), Security (emergency), and automated bots (Keeper, Debt Allocator) with differentiated responsibilities. No single point of failure
- **USDC-denominated:** Stablecoin backing eliminates price volatility risk on the underlying asset
- **Diversified strategy portfolio:** 11 strategies across 8+ protocols, distributed across lending, looper, PT, and cross-chain categories
- **Improved dependency quality:** Medium-risk protocol exposure reduced from 65.6% to 16.4%. Largest allocation (Maple, 45.8%) is rated Low Risk (2.33/5)
- **No EOA role concentration:** Deployer EOA confirmed at 0 vault roles. All vault operations require multisig or contract authorization
- **Rigorous strategy review process:** 12-metric risk scoring framework with ySec security review. All strategies evaluated across testing coverage, complexity, risk exposure, centralization, and protocol integration dimensions
- **Active monitoring infrastructure:** Hourly large-flow alerts, weekly endorsed-vault checks, and timelock monitoring across 6 chains via GitHub Actions + Telegram alerts

### Key Risks

- **Still early stage:** ~74 days in production with ~$4M TVL. No stress testing. Deposit limit of $5M indicates early stage, though TVL growth is healthy (+34% since March)
- **No external product-specific audit:** The CCTPStrategy cross-chain code and LockedyvUSD wrapper have no dedicated external audit. CCTPStrategy underwent strict internal ySec review. All strategies follow the rigorous 12-metric risk framework, but external third-party review of these specific components is absent
- **Maple concentration:** 45.8% of vault funds are in Maple syrupUSDC strategies — a single protocol failure could impact nearly half the vault
- **High looper allocation:** Looper strategies now represent ~86% of TVL (up from ~58%), increasing leverage exposure

### Critical Risks

- **Looper liquidation cascade:** Looper strategies (~86% of TVL) use leveraged positions on Morpho. A collateral depeg (e.g., syrupUSDC or siUSD) could trigger cascading liquidations across multiple strategies simultaneously. The increased looper concentration amplifies this risk compared to March
- **Cross-chain accounting lag:** Remote strategy positions are updated when `_harvestAndReport()` queues CCTP messages back to the origin. Between report cycles, the vault's reported `totalAssets()` may not reflect real-time changes on Arbitrum

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by Statemind, ChainSecurity, and yAcademy. ✅ PASS (framework audited; individual strategies lack dedicated audit)
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions on-chain verifiable. ✅ PASS
- [x] **Total centralization** — Standard Yearn governance: Daddy/ySafe 6-of-9 multisig with publicly named signers, 7-day timelock on critical operations, Brain 3-of-8 for operations, Security 4-of-7 for emergency. No EOA vault roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). CCTPStrategy: strict internal ySec review. All strategies: rigorous 12-metric risk framework |
| Bug bounty | $200K on Immunefi (active) + Sherlock bounty |
| Production history | **~74 days** (Jan 19, 2026). V3 framework: ~23 months |
| TVL | **~$4M** (small but growing +34%). Deposit limit: $5M (80.6% utilized) |
| Security incidents | None on V3 |
| Strategy review | Rigorous 12-metric framework with ySec security review, testing coverage requirements, complexity scoring, and risk exposure assessment |

**Score: 3.0/5** — The underlying V3 framework has solid audit coverage from 3 reputable firms and a clean 23-month track record. The CCTPStrategy underwent strict internal ySec review, and all strategies follow a rigorous 12-metric risk scoring framework. However, yvUSD itself is still early (~74 days) with modest TVL (~$4M), and no external third-party audit covers the novel yvUSD-specific components. The vault has shown healthy growth (+34% TVL) and no incidents, but remains below the 6-month production history threshold. Score unchanged from March assessment.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades). Strategies can be added/removed |
| Multisig | 6-of-9 Daddy/ySafe (proposer/executor on timelock) + 3-of-8 Brain (operations) + 4-of-7 Security (emergency) |
| Timelock | **7-day TimelockController** for critical operations (add strategy, change accountant, set max debt). Self-governed: timelock holds TIMELOCK_ADMIN_ROLE, so config changes (delay, roles) must go through 7-day delay |
| Privileged roles | Well-distributed: Daddy (6/9, nearly all roles), Brain (3/8, operational), Security (4/7, emergency), Keeper + Debt Allocator (bots). No EOA roles (deployer confirmed at bitmask 0x0) |
| Yearn oversight | **Full integration** — same governance framework as yvUSDC-1 and 37+ other Yearn vaults. Standard Yearn RoleManager |

**Governance Score: 1.5/5** — Major improvement from March assessment (was 2.5). Now uses the **standard Yearn V3 governance pattern** — the same framework as yvUSDC-1 (which also scores 1.5 for governance). Immutable vault contracts. 6-of-9 Daddy/ySafe multisig with named, prominent DeFi signers. The most critical governance actions — adding new strategies and changing the accountant — go through a **7-day TimelockController** (increased from initial 24h). The timelock is self-governed (holds TIMELOCK_ADMIN_ROLE) — any config changes must also pass through the 7-day delay, though the delay is not immutable and could theoretically be reduced via a timelocked proposal. No EOA role concentration. Well-distributed roles across Daddy, Brain, Security, and automated bots. The deployer EOA retains Fee Splitter governance only (low-impact, fee distribution not fund custody). Direct vault parameter changes (deposit limits, emergency shutdown) by Daddy (6/9) have no timelock, preventing a score of 1.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits/withdrawals on-chain |
| Strategy reporting | Programmatic via Keeper (yHaaSRelayer) and Debt Allocator |
| Debt allocation | Automated via Debt Allocator, with manual override by DEBT_MANAGER holders (Daddy, Brain, Security) |
| Cross-chain | Programmatic — `_harvestAndReport()` queues CCTP messages automatically. Stale between report cycles |

**Programmability Score: 1.5/5** — All funds are on-chain across Ethereum and Arbitrum and cannot be altered by off-chain factors. PPS is calculated on-chain algorithmically via ERC-4626. Deposits/withdrawals are permissionless. Strategy reporting is automated via the Keeper (yHaaSRelayer). Debt allocation is automated via the Debt Allocator with manual override available to Daddy, Brain, and Security multisigs. Cross-chain accounting has minor lag between keeper cycles but all positions are verifiable on-chain at all times.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | 8+ distinct protocols |
| Criticality | Morpho (critical, 86%), Maple (critical, 45.8%), InfiniFi (high, 15.2%) |
| Dependency quality | Improved: blue-chip (Sky, Spark, Morpho) + low-risk (Maple 2.33/5) + medium-risk (InfiniFi 2.8/5, now 15.2% vs 32.6%) |
| Cross-chain | Circle CCTP (well-audited, same trust as USDC) |

**Dependencies Score: 3.5/5** — Still many dependencies (8+), and Morpho is critical infrastructure across 86% of strategies. However, the dependency quality has significantly improved: medium-risk protocol exposure dropped from 65.6% to 16.4%, with the largest allocation (Maple, 45.8%) rated Low Risk (2.33/5). The main concern is Maple concentration — a single protocol failure could impact ~46% of the vault. Cross-chain bridge dependency via CCTP remains. Per rubric: many dependencies with critical reliance on Morpho and Maple, but improved quality pulls down from 4 to 3.5.

**Centralization Score = (1.5 + 1.5 + 3.5) / 3 = 2.17**

**Score: 2.2/5** — Significant improvement from March (was 2.7). The vault now uses the standard Yearn V3 governance pattern with 7-day timelock, Daddy/ySafe (6/9) integration, and standard RoleManager — the same framework as yvUSDC-1 and 37+ other Yearn vaults. Immutable vault contracts, no EOA role concentration, and multi-layer security are key strengths. All funds remain on-chain and fully programmatic. The main remaining concerns are Maple protocol concentration and the Fee Splitter EOA governance.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed into DeFi yield strategies |
| Collateral quality | Improved: 12.9% blue-chip (Sky, Spark), 45.8% low-risk (Maple 2.33/5), 16.4% medium-risk (InfiniFi 2.8/5, 3Jane 3.5/5) |
| Leverage | Looper strategies (~86% of TVL) use Morpho leverage — increased from ~58% |
| Verifiability | ERC-4626, all positions on-chain |

**Collateralization Score: 2.5/5** — On-chain USDC backing is fully verifiable. Collateral quality has improved significantly: medium-risk protocol exposure dropped from 65.6% to 16.4%, with the largest allocation now in Maple (low-risk, 2.33/5) and blue-chip protocols (Sky, Spark) at 12.9%. However, looper strategy allocation increased from ~58% to ~86% of TVL, adding more leverage risk. The improved dependency quality offsets the increased leverage concentration.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | All strategy positions verifiable on-chain |
| Exchange rate | ERC-4626, programmatic, anyone can verify |
| Cross-chain lag | remoteAssets updated by keeper, can be stale |
| Reporting | Automated via keepers with 7-day profit unlock |

**Provability Score: 1.5/5** — All strategy positions are verifiable on-chain on both Ethereum and Arbitrum. ERC-4626 share price is fully programmatic. Cross-chain positions have minor reporting lag between keeper cycles but the actual positions exist on-chain at all times. Multiple verification sources available.

**Funds Management Score = (2.5 + 1.5) / 2 = 2.0**

**Score: 2.0/5** — Improved from March (was 2.25). Strong on-chain provability with all positions verifiable across both chains. Collateral quality has improved with the shift from medium-risk to low-risk protocol dependencies. Increased looper concentration partially offsets the improvement.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption for USDC |
| Liquidity depth | 0 idle — 100% deployed. Withdrawal requires strategy unwinding |
| Cross-chain | CCTP bridge delays for Arbitrum strategies |
| PT maturity | Reduced: PT strategies now only 1.9% of TVL (was 51.5%) |
| Same-value asset | USDC-denominated — no price impact risk |
| Deposit limit | $5M cap (80.6% utilized) |
| Locked supply | ~70.6% of yvUSD supply locked in LockedyvUSD (14-day cooldown + 5-day window) |

**Score: 3.0/5** — USDC-denominated vault eliminates price divergence risk. ERC-4626 redemption mechanism exists. PT maturity constraints are significantly reduced (1.9% vs 51.5% of TVL in March). However, 100% capital deployment means withdrawals require strategy unwinding — and ~86% is in looper strategies requiring deleveraging. No DEX liquidity as alternative exit. ~70.6% of yvUSD supply is locked in LockedyvUSD with 14-day cooldown. The current TVL (~$4M) means withdrawal amounts are relatively small in absolute terms. Same-value asset adjustment: -0.5 applied from a base of 3.5. Score unchanged from March.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020 |
| Vault management | Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations |
| Documentation | V3 docs comprehensive. yvUSD-specific docs published on official Yearn docs site (cross-chain architecture, LockedyvUSD mechanics, dedicated APR API) |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Yearn has demonstrated capability across historical events. V3 untested |
| Monitoring | Active hourly large-flow alerts, weekly endorsed-vault checks, timelock monitoring across 6 chains |

**Score: 1.5/5** — Yearn's brand, track record, and known team provide high confidence. The vault now uses the standard Yearn governance framework (Daddy, Brain, Security, Keeper, Debt Allocator) — the same pattern across 37+ vaults. Comprehensive V3 documentation, active Immunefi + Sherlock bounties, demonstrated incident response capability, and active monitoring infrastructure (hourly alerts, endorsed-vault checks, timelock monitoring via GitHub Actions + Telegram). yvUSD-specific documentation is on the official Yearn docs site, covering cross-chain strategy architecture, LockedyvUSD mechanics, and a dedicated APR API service. Yearn BORG legal entity (Cayman foundation via YIP-87). Score unchanged from March.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (2.2 × 0.30) + (2.0 × 0.30) + (3.0 × 0.20) + (3.0 × 0.15) + (1.5 × 0.05)
            = 0.66 + 0.60 + 0.60 + 0.45 + 0.075
            = 2.385
```

| Category | Score | Weight | Weighted | Change from March |
|----------|-------|--------|----------|-------------------|
| Audits & Historical | 3.0 | 20% | 0.60 | — |
| Centralization & Control | 2.2 | 30% | 0.66 | ↓ from 2.7 (standard Yearn governance + 7-day timelock) |
| Funds Management | 2.0 | 30% | 0.60 | ↓ from 2.25 (better dependency quality) |
| Liquidity Risk | 3.0 | 15% | 0.45 | — |
| Operational Risk | 1.5 | 5% | 0.075 | — |
| **Final Score** | | | **2.4/5.0** | ↓ from 2.6 |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.4/5.0) — Approved with standard monitoring**

**Score change rationale:** The score improved from 2.6 (Medium Risk) to 2.4 (Low Risk) primarily due to:
1. **Governance maturation** (2.7 → 2.2): Migration to the standard Yearn V3 governance pattern (same as yvUSDC-1) with 7-day timelock, Daddy/ySafe (6/9) integration, and standard RoleManager
2. **Improved dependency quality** (Funds Mgmt 2.25 → 2.0): Medium-risk protocol exposure reduced from 65.6% to 16.4%, with the dominant allocation shifting to Maple (Low Risk 2.33/5)

---

## Reassessment Triggers

- **Time-based:** Reassess in 2 months (June 2026) as the vault approaches the 6-month production milestone
- **TVL-based:** Reassess if TVL exceeds $10M or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, or underlying protocol incident (especially Maple, InfiniFi, or Morpho)
- **Governance-based:** Reassess if the timelock delay is modified, Safe compositions change (signer additions/removals, threshold changes), or the Fee Splitter governance is transferred from the deployer EOA to the multisig
- **Audit-based:** Reassess if CCTPStrategy or yvUSD-specific components receive dedicated external audits (should improve Audits score)
- **Dependency-based:** Reassess if Maple syrupUSDC or InfiniFi experience significant events. Reassess if Morpho looper markets face liquidation stress
- **Strategy-based:** Reassess if Maple concentration exceeds 60%, if allocation to medium-risk protocols exceeds 30%, or if looper leverage ratios increase significantly

---

## Appendix: TimelockController Role Structure

TimelockController [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) — deployed at [block 24,242,692](https://etherscan.io/tx/0x3063e5a82b383d0f5b38e8735dd13c0c9d492c3bfe5dc9d3d23fc829c60f96b0) with `admin = address(0)`.

### Timelock Roles

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)` at construction). No one can grant/revoke roles outside the propose→wait→execute flow |
| **TIMELOCK_ADMIN** | Timelock itself (`0x88ba...bf73`) | Contract | Only the timelock can admin its own roles. Config changes (delay, role grants) must go through the 7-day delay |
| **PROPOSER** | Daddy/ySafe (`0xFEB4...ff52`) | 6-of-9 Safe | **Only proposer** — no one else can initiate timelocked operations |
| **EXECUTOR** | Daddy/ySafe (`0xFEB4...ff52`) | 6-of-9 Safe | Can execute queued proposals directly |
| **EXECUTOR** | TimelockExecutor (`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`) | Contract | Wrapper contract — delegates execution to its internal executor list (see below) |
| **CANCELLER** | Daddy/ySafe (`0xFEB4...ff52`) | 6-of-9 Safe | Can cancel pending proposals |
| **CANCELLER** | Brain (`0x1638...0ff7`) | 3-of-8 Safe | Can cancel pending proposals |

### TimelockExecutor Contract

[`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) — governance-gated wrapper around the TimelockController. Only addresses on its internal executor list can call `execute()` through it.

| Parameter | Value |
|-----------|-------|
| Governance | Brain (`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`) — only Brain can add/remove internal executors |
| Internal executor 1 | Brain (`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`) |
| Internal executor 2 | Deployer EOA (`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`) |

### Execution Paths for Queued Proposals

All paths require Daddy (6/9) to first propose the operation and a 7-day wait:

1. **Daddy (6/9)** executes directly (holds EXECUTOR_ROLE on timelock)
2. **Brain (3/8)** executes via TimelockExecutor contract
3. **Deployer EOA** executes via TimelockExecutor contract

### Why the Delay Cannot Be Bypassed

To change the timelock delay (e.g., reduce from 7 days), an attacker would need to:

1. Control Daddy (6/9) to **propose** `updateDelay()` — the only PROPOSER
2. Wait 7 days — Brain or Daddy can **cancel** during this window
3. Execute via Daddy, Brain, or the EOA — but the operation is already visible on-chain for 7 days

DEFAULT_ADMIN was never granted, so no one can grant themselves PROPOSER or TIMELOCK_ADMIN to skip this flow. The timelock holds TIMELOCK_ADMIN but can only act on it through its own propose→wait→execute cycle.
