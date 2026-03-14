# Protocol Risk Assessment: Yearn — yvUSD

- **Assessment Date:** March 13, 2026
- **Token:** yvUSD (USD yVault)
- **Chain:** Ethereum (with cross-chain strategies on Arbitrum)
- **Token Address:** [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987)
- **Final Score: 2.6/5.0**

## Overview + Links

yvUSD is a **USDC-denominated cross-chain Yearn V3 vault** (ERC-4626) that deploys deposited USDC into multiple yield strategies across Ethereum mainnet and Arbitrum. The vault uses **Circle's CCTP (Cross-Chain Transfer Protocol)** to bridge assets to strategies on remote chains, requiring only strategy contracts on those chains rather than full Yearn V3 infrastructure.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting USDC deposits, issuing yvUSD shares
- **Cross-chain strategies:** Use a two-contract pattern — an origin CCTPStrategy on Ethereum and a remote strategy on the destination chain. When `report()` is called on the destination chain, `_harvestAndReport()` reports new assets back to the origin by queuing a CCTP message — no separate keeper relay required. The origin tracks remote capital via a `remoteAssets` variable updated by these CCTP messages
- **LockedyvUSD:** Companion cooldown wrapper where users lock yvUSD shares for additional yield. Users locking shares gives the vault better guarantees on duration risk, enabling higher-yield strategies without sacrificing atomic liquidity for non-lockers. Cooldown: 14 days (configurable), withdraw window: 5 days (configurable). Lockers receive a percentage of extra yield as an illiquidity premium. Also serves as the vault's accountant
- **Strategies:** 12 active strategies deploying into Morpho, 3Jane USD3, InfiniFi, Maple syrupUSDC, Sky/MakerDAO, Spark, Fluid, Pendle/Spectra PT tokens, and Cap stcUSD
- **Yield sources:** Lending yield (Morpho, Fluid, Spark, Sky), looper strategies (borrow-against-collateral loops on Morpho), and fixed-rate PT tokens (Pendle/Spectra)

**Key metrics (March 13, 2026):**

- **TVL:** ~$3,015,281 USDC
- **Total Supply:** ~3,001,435 yvUSD
- **Price Per Share:** 1.004613 USDC/yvUSD (~0.46% appreciation in ~53 days)
- **Total Debt:** 100% deployed (0 idle)
- **Deposit Limit:** $5,000,000
- **Profit Max Unlock Time:** 7 days

**Links:**

- [yvUSD Documentation (draft)](https://yearn-docs-git-fork-engn33r-yvusd-yearn.vercel.app/getting-started/products/yvusd/overview)
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
| Role Manager (Vault Safe) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe v1.3.0 |
| Deployer/Operator EOA | [`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271) | Fee Splitter governance only (vault roles removed via Safe tx nonce 3130) |
| Yearn Global Multisig | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — **has NO roles on yvUSD** |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory | [`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) |
| Vault Implementation (v3.0.4) | [`0xd8063123BBA3B480569244AE66BFE72B6c84b00d`](https://etherscan.io/address/0xd8063123BBA3B480569244AE66BFE72B6c84b00d) |
| Tokenized Strategy | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) |
| Yearn V3 Keeper | [`0x52605BbF54845f520a3E94792d019f62407db2f8`](https://etherscan.io/address/0x52605BbF54845f520a3E94792d019f62407db2f8) |

### Active Strategies (12)

| # | Strategy | Name | Current Debt (USDC) | Allocation | Protocols Used | Last Report |
|---|----------|------|--------------------:|-----------:|----------------|-------------|
| 1 | [`0x4c0e...34b`](https://etherscan.io/address/0x4c0e...34b) | USD3 Pendle PT Maxi | 350,758 | 33.0% | 3Jane USD3, Pendle | 2026-03-09 |
| 2 | [`0xb73a...66d`](https://etherscan.io/address/0xb73a...66d) | PT siUSD March 25 Morpho Looper | 196,128 | 18.5% | InfiniFi siUSD, Morpho, Pendle/Spectra | 2026-03-09 |
| 3 | [`0x5f9D...f89`](https://etherscan.io/address/0x5f9D...f89) | Infinifi sIUSD Morpho Looper | 150,168 | 14.1% | InfiniFi siUSD, Morpho | 2026-03-09 |
| 4 | [`0x0e29...626`](https://etherscan.io/address/0x0e29...626) | Morpho Yearn OG USDC Compounder | 108,980 | 10.3% | Morpho | 2026-03-09 |
| 5 | [`0xf28d...442`](https://etherscan.io/address/0xf28d...442) | syrupUSDC/USDC Morpho Looper | 100,000 | 9.4% | Maple syrupUSDC, Morpho | 2026-03-10 |
| 6 | [`0x7bf1...d1d`](https://etherscan.io/address/0x7bf1...d1d) | PT stcUSD Jul 23 Morpho Looper | 54,000 | 5.1% | Cap stcUSD, Morpho, Pendle/Spectra | 2026-01-28 |
| 7 | [`0x7130...f8f`](https://etherscan.io/address/0x7130...f8f) | USDC to sUSDS Lender | 49,995 | 4.7% | Sky/MakerDAO | 2026-03-09 |
| 8 | [`0x2f56...179`](https://etherscan.io/address/0x2f56...179) | Arbitrum syrupUSDC/USDC Morpho Looper | 30,000 | 2.8% | Maple syrupUSDC, Morpho, CCTP | 2026-03-10 |
| 9 | [`0x9e0A...75b`](https://etherscan.io/address/0x9e0A...75b) | USDC To Spark USDS Depositor | 21,507 | 2.0% | Spark, Sky/MakerDAO | 2026-01-19 |
| 10 | [`0x48E6...a93`](https://etherscan.io/address/0x48E6...a93) | USDC To SKY USDS Depositor | 0 | 0.0% | Sky/MakerDAO | 2026-01-28 |
| 11 | [`0x00C8...4cF`](https://etherscan.io/address/0x00C8...4cF) | USDC Fluid Lender | 0 | 0.0% | Fluid | 2026-01-31 |
| 12 | [`0x1983...9e`](https://etherscan.io/address/0x1983...9e) | Arb Yearn Degen Morpho Compounder | 0 | 0.0% | Morpho, CCTP | 2026-03-04 |

**Note:** 5 strategies have been revoked during the vault's ~50-day history, indicating active portfolio management. 6 strategies are in the default withdrawal queue; 6 are active but outside the queue.

### Strategy Protocol Dependencies with Existing Reports

Several underlying protocols have been previously assessed in this repository:

| Protocol | Report Score | yvUSD Allocation |
|----------|-------------|-----------------|
| [3Jane USD3](../report/3jane-usd3.md) | **3.5/5** (Medium Risk) | 33.0% |
| [InfiniFi](../report/infinifi.md) | **2.8/5** (Medium Risk) | 32.6% (two strategies) |
| [Maple syrupUSDC](../report/maple-syrupusdc.md) | **2.33/5** (Low Risk) | 12.2% (two strategies) |
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

- **12 active strategies** across 2 chains (Ethereum + Arbitrum)
- **Cross-chain accounting** via Circle CCTP (destination chain reports back to origin via CCTP on `_harvestAndReport()`)
- **Looper strategies** using Morpho for leveraged yield (borrow-against-collateral loops)
- **PT token strategies** with maturity dates requiring rollover
- **Custom accountant** (LockedyvUSD) combining cooldown/locking mechanics with fee management
- **Multiple protocol dependencies** (8+ distinct protocols)
- **V3 vault itself is non-upgradeable** (immutable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** January 19, 2026 (block 24271831) — **~53 days** in production
- **TVL:** ~$3.02M USDC — early stage with a $5M deposit limit
- **PPS trend:** 1.000000 → 1.004613 (~0.46% appreciation over 53 days, ~3.2% annualized)
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** 17 strategies have been added over the vault's lifetime, 5 have been revoked, indicating active and frequent portfolio management
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~22 months). No V3 vault exploits

**Yearn protocol TVL:** ~$240M total across all chains (DeFi Llama, March 2026).

## Funds Management

yvUSD deploys deposited USDC across 12 strategies with 100% capital utilization (0 idle). Strategies fall into four categories:

### Strategy Categories

**1. Looper Strategies (57.9% of TVL)**

Strategies that borrow against collateral on Morpho to achieve leveraged yield positions. These include:
- PT siUSD March 25 Morpho Looper (18.5%)
- Infinifi sIUSD Morpho Looper (14.1%)
- syrupUSDC/USDC Morpho Looper (9.4%)
- PT stcUSD Jul 23 Morpho Looper (5.1%)
- Morpho Yearn OG USDC Compounder (10.3%)
- Arbitrum syrupUSDC/USDC Morpho Looper (2.8%, cross-chain)

**Looper risk:** These strategies are leveraged — they borrow USDC on Morpho against collateral (PT tokens, siUSD, syrupUSDC). If the collateral depegs or the Morpho market becomes illiquid, positions may face liquidation or inability to unwind.

**2. Fixed-Rate PT Strategies (33.0% of TVL)**

- USD3 Pendle PT Maxi (33.0%) — holds Pendle Principal Tokens backed by 3Jane USD3

**PT risk:** PT tokens have fixed maturity dates. Before maturity, exit requires selling on AMM (Pendle/Spectra) at potentially unfavorable rates. At maturity, PT is manually rolled over by converting to SY (yield token) via a `rollover()` call on the strategy — this process cannot steal user funds. If not rolled over, the position simply holds the redeemed underlying.

**3. Lending Strategies (6.7% of TVL)**

- USDC to sUSDS Lender (4.7%) — deposits into Sky/MakerDAO
- USDC To Spark USDS Depositor (2.0%) — deposits into Spark

**Lending risk:** Standard DeFi lending risk. Sky and Spark are blue-chip protocols with extensive audit coverage.

**4. Cross-Chain Strategies (2.8% active, with inactive allocations)**

Two strategies bridge USDC to Arbitrum via Circle CCTP:
- Arbitrum syrupUSDC/USDC Morpho Looper (2.8%)
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
  - Blue-chip (Sky, Spark, Fluid): 6.7% of TVL
  - Established with review (Morpho, Maple, Pendle): used across 70%+ of strategies
  - Medium-risk (3Jane 3.5/5, InfiniFi 2.8/5): **65.6% of TVL** — the majority of funds are in protocols with Medium Risk scores
  - Low-risk (Cap stcUSD, internal risk-2): 5.1% of TVL
- **Leverage via looper strategies:** Borrowing against collateral on Morpho. TODO: verify exact max LTV parameters and liquidation buffers per Morpho market

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

The yvUSD vault uses a **different governance pattern** from the standard Yearn V3 Role Manager. For comparison, the standard Yearn mainnet vault (yvUSDC-1, [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204)) uses the Yearn V3 Vault Role Manager contract ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)), which is governed by the Yearn ySafe 6-of-9 multisig. The yvUSD vault instead uses a direct multisig as role manager, since the standard Yearn Role Manager manages vault-level governance but does not manage strategy operations — yvUSD's multi-strategy, cross-chain design requires a dedicated operational Safe.

**Role Manager: 3-of-8 Gnosis Safe** ([`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7))

- Threshold: 3-of-8
- Holds all 14 vault roles (bitmap 16383)
- **Signers are Yearn team members**, spanning core contributors and the security team. Not publicly labeled on Etherscan but confirmed as known Yearn insiders
- No timelock on any actions
- 3,130 transactions processed as of March 2026 — very active multisig
**Deployer EOA roles — removed:** [`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271)

This EOA (also a Safe owner and the vault deployer) previously held 11 of 14 vault roles directly. **Safe transaction nonce 3130 has been executed**, calling `set_role(0x1b5f...d271, 0)` to remove ALL vault roles from this EOA. All vault operations now require 3-of-8 multisig approval.

The same transaction also:
- Accepted management of 8 strategies
- Set LockedyvUSD withdrawal window to 5 days (from previous 7)
- Set keeper on a new strategy
- Adjusted profit unlock timing on another vault

**Note:** This EOA remains the sole `governance` address on the Fee Splitter contract ([`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470)).

**Governance assessment:**
1. **No timelock** on any governance action — changes take effect immediately. The team has confirmed there are no plans to add a timelock at this time
2. **No EOA role concentration** — Safe tx nonce 3130 has been executed, removing all direct vault roles from the deployer EOA. All vault operations now require 3-of-8 multisig approval. The EOA retains governance of the Fee Splitter contract only
3. **Known Yearn team signers** — all 8 Safe owners are confirmed Yearn contributors (core team + security team)
4. **Independent from Yearn global multisig** — the 6/9 Yearn multisig has no roles on this vault, but the separation is by design (strategy-focused governance vs vault-level governance)

### Programmability

- **Exchange rate (PPS):** Calculated on-chain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless on-chain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 7 days. Losses are immediate
- **Debt allocation:** Requires manual intervention by DEBT_MANAGER role (3-of-8 multisig)
- **Cross-chain accounting:** When `report()` is called on the destination chain, `_harvestAndReport()` automatically queues a CCTP message back to the origin. No separate keeper relay required. Can be stale between report cycles
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Allocation | Notes |
|-----------|-------------|-----------|-------|
| **Morpho** | Critical | ~60% (6 strategies) | $6.6B TVL, 25+ audits, formal verification. Used for looper leverage and USDC compounding |
| **3Jane USD3** | Critical | 33.0% | Report score 3.5/5. Unsecured credit-based lending, ~$16M TVL. **Highest allocation to a single medium-risk dependency** |
| **InfiniFi** | Critical | 32.6% | Report score 2.8/5. Stablecoin protocol deploying into various DeFi strategies, ~$150M TVL |
| **Maple syrupUSDC** | High | 12.2% | Report score 2.33/5. Overcollateralized institutional lending, ~$1.7B TVL |
| **Pendle/Spectra** | High | Used in PT strategies | $2.1B TVL (Pendle), 6+ audits. PT token infrastructure for fixed-rate yield |
| **Cap (stcUSD)** | Medium | 5.1% | ~$500M TVL. Yield-bearing stablecoin. Internal assessment: risk-2 (non-public) |
| **Sky/MakerDAO** | Medium | 4.7% | Blue-chip, extensively audited. Stable lending yield |
| **Spark** | Low | 2.0% | Part of Sky/MakerDAO ecosystem. Blue-chip |
| **Circle CCTP** | High | Cross-chain bridge | Audited by ChainSecurity (V1 + V2). Trust assumption: Circle attestation (same trust as holding USDC) |
| **Fluid** | Low | 0% (inactive) | Report score 1.1/5. Currently no allocation |

**Dependency concentration:** 65.6% of vault funds are deployed into protocols with Medium Risk scores (3Jane 3.5/5 + InfiniFi 2.8/5). This is a significant concentration in higher-risk dependencies.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The Yearn global multisig has 9 named signers including Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others
- **yvUSD governance:** The vault is managed by a separate 3-of-8 Safe (not the Yearn global multisig). However, all 8 signers are confirmed Yearn team members (core contributors and security team), providing high trust in the governance quality
- **Documentation:** Comprehensive Yearn V3 documentation. yvUSD-specific docs exist in a draft PR (not yet merged to main docs). Cross-chain strategy documentation available
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

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSD Vault | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit/Withdraw events |
| LockedyvUSD | [`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040) | Cooldown events, configuration changes (cooldown duration, withdrawal window) |
| Role Manager Safe | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | Signer/threshold changes, submitted transactions |
| Deployer EOA | [`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271) | Fee Splitter governance changes (vault roles removed) |
| Fee Splitter | [`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470) | Governance changes, fee distribution changes |

### Critical Events to Monitor

- **PPS decrease** — any decrease in `convertToAssets(1e6)` indicates a loss event. Should only increase
- **Strategy additions/removals** — `StrategyChanged` events indicate portfolio changes
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events
- **Emergency actions** — `Shutdown` event on vault
- **Signer/threshold changes** on the 3-of-8 Safe
- **Cross-chain strategy accounting** — monitor `remoteAssets` for staleness (compare to actual on-chain positions on Arbitrum)
- **Looper strategy health** — monitor Morpho market positions for proximity to liquidation
- **PT token maturity** — track expiry dates of Pendle/Spectra PT positions
- **Underlying protocol health** — monitor 3Jane, InfiniFi, and Cap for incidents

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `getThreshold()` / `getOwners()` | Safe | Governance integrity | Daily |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~22 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **USDC-denominated:** Stablecoin backing eliminates price volatility risk on the underlying asset
- **Diversified strategy portfolio:** 12 strategies across 8+ protocols, distributed across lending, looper, PT, and cross-chain categories. No single strategy exceeds 33% allocation
- **Granular V3 role system:** 14 distinct roles with clear separation of responsibilities, all held exclusively by the 3-of-8 multisig. No EOA role concentration
- **Circle CCTP:** Trust-minimized cross-chain bridge with same trust assumption as holding USDC. Audited by ChainSecurity
- **Rigorous strategy review process:** 12-metric risk scoring framework with ySec security review. CCTPStrategy underwent strict internal review. All strategies evaluated across testing coverage, complexity, risk exposure, centralization, and protocol integration dimensions
- **Active monitoring infrastructure:** Hourly large-flow alerts, weekly endorsed-vault checks, and timelock monitoring across 6 chains via GitHub Actions + Telegram alerts

### Key Risks

- **Extremely new:** Only ~53 days in production with ~$3M TVL. No stress testing. Deposit limit of $5M indicates early stage
- **Separate governance from Yearn global multisig:** Vault is managed by a dedicated 3-of-8 Safe with known Yearn team signers, independent from the standard 6-of-9 Yearn multisig. By design for strategy-focused operations, but no cross-oversight
- **No external product-specific audit:** The CCTPStrategy cross-chain code and LockedyvUSD wrapper have no dedicated external audit. CCTPStrategy underwent strict internal ySec review. All strategies follow the rigorous 12-metric risk framework, but external third-party review of these specific components is absent
- **65.6% in medium-risk protocols:** The majority of vault funds are deployed into 3Jane USD3 (score 3.5/5) and InfiniFi (score 2.8/5) — both relatively new protocols with elevated risk profiles

### Critical Risks

- **No timelock:** All governance actions via the 3-of-8 Safe take effect immediately. No monitoring window for users to react to potentially harmful changes. The team has confirmed no plans to add a timelock at this time
- **Looper liquidation cascade:** Looper strategies (~58% of TVL) use leveraged positions on Morpho. A collateral depeg (e.g., USD3 or siUSD) could trigger cascading liquidations across multiple strategies simultaneously
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
- [x] **Total centralization** — 3-of-8 multisig with known Yearn team signers. All vault roles held by multisig only (EOA roles removed via Safe tx nonce 3130). ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). CCTPStrategy: strict internal ySec review. All strategies: rigorous 12-metric risk framework |
| Bug bounty | $200K on Immunefi (active) + Sherlock bounty |
| Production history | **~53 days** (Jan 19, 2026). V3 framework: ~22 months |
| TVL | **~$3M** (small). Deposit limit: $5M |
| Security incidents | None on V3 |
| Strategy review | Rigorous 12-metric framework with ySec security review, testing coverage requirements, complexity scoring, and risk exposure assessment |

**Score: 3.0/5** — The underlying V3 framework has solid audit coverage from 3 reputable firms and a clean 22-month track record. The CCTPStrategy underwent strict internal ySec review, and all strategies follow a rigorous 12-metric risk scoring framework — providing strong assurance even without external audits on individual components. However, yvUSD itself is extremely new (~53 days) with small TVL (~$3M), and no external third-party audit covers the novel yvUSD-specific components. Between score 2 (2+ audits, 1-2 years) and score 4 (3-6 months, TVL <$10M) — the strong framework audits and rigorous internal review process pull toward 3, while the very early stage pushes toward 4.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades). Strategies can be added/removed |
| Multisig | 3-of-8 Gnosis Safe with **known Yearn team signers** (core contributors + security team) |
| Timelock | **None** — all actions immediate |
| Privileged roles | All 14 vault roles held by 3-of-8 multisig only. Deployer EOA roles removed (Safe tx nonce 3130 executed). EOA retains Fee Splitter governance |
| Yearn oversight | No direct 6/9 ySafe involvement, but this is by design — strategy-focused vault uses dedicated multisig with Yearn insiders |

**Governance Score: 2.5/5** — Vault contracts are immutable (no upgrade risk). The 3-of-8 Safe has high-quality signers (confirmed Yearn team members and security team). All vault roles are now held exclusively by the multisig — the previously identified EOA role concentration has been fully remediated (Safe tx nonce 3130 executed). However, the lack of timelock on any governance action remains a significant gap — all changes take effect immediately with no monitoring window. The 3/8 threshold is relatively low (37.5%). The deployer EOA retains sole governance of the Fee Splitter contract. Per rubric: known-insider multisig with high trust and no EOA risk, but no timelock and low threshold — between score 2 (7/11+ with timelock) and score 3 (3/5, no timelock). The high-quality signers and immutable vault pull toward 2, while the low threshold and no timelock push toward 3: 2.5.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits/withdrawals on-chain |
| Strategy reporting | Programmatic via keepers |
| Debt allocation | Manual intervention by DEBT_MANAGER (3-of-8 multisig) |
| Cross-chain | Programmatic — `_harvestAndReport()` queues CCTP messages automatically. Stale between report cycles |

**Programmability Score: 1.5/5** — All funds are on-chain across Ethereum and Arbitrum and cannot be altered by off-chain factors. PPS is calculated on-chain algorithmically via ERC-4626. Deposits/withdrawals are permissionless. Strategy reporting is automated via keepers. Debt allocation has both automated (Debt Allocator) and manual (DEBT_MANAGER via 3/8 multisig) paths. Cross-chain accounting has minor lag between keeper cycles but all positions are verifiable on-chain at all times.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | 8+ distinct protocols |
| Criticality | Morpho (critical, 60%), 3Jane (critical, 33%), InfiniFi (critical, 32.6%) |
| Dependency quality | Mix: blue-chip (Sky, Spark, Morpho) + medium-risk (3Jane, InfiniFi) |
| Cross-chain | Circle CCTP (well-audited, same trust as USDC) |

**Dependencies Score: 4/5** — Many dependencies (8+), several critical. 65.6% of funds in medium-risk protocols. Cross-chain bridge dependency. Failure of 3Jane or InfiniFi could impact >30% of vault funds each. Per rubric: "Many or newer protocol dependencies, critical functionality depends on them" maps to 4.

**Centralization Score = (2.5 + 1.5 + 4) / 3 = 2.67**

**Score: 2.7/5** — Immutable vault contracts and known Yearn team signers on the 3/8 Safe are significant strengths. All vault roles are now held exclusively by the multisig (EOA roles removed). All funds are on-chain and fully programmatic. However, the lack of timelock on governance actions and the heavy dependency on multiple protocols (including medium-risk ones) remain concerns.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed into DeFi yield strategies |
| Collateral quality | Mixed: 6.7% blue-chip (Sky, Spark), 65.6% medium-risk (3Jane, InfiniFi), 12.2% low-risk (Maple) |
| Leverage | Looper strategies (~58% of TVL) use Morpho leverage |
| Verifiability | ERC-4626, all positions on-chain |

**Collateralization Score: 3/5** — On-chain USDC backing is fully verifiable, which is strong. However, the majority of funds (65.6%) are deployed into medium-risk protocols, and looper strategies add leverage risk. The collateral quality is mixed — not pure blue-chip stablecoins, but also not opaque or unverifiable.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | All strategy positions verifiable on-chain |
| Exchange rate | ERC-4626, programmatic, anyone can verify |
| Cross-chain lag | remoteAssets updated by keeper, can be stale |
| Reporting | Automated via keepers with 7-day profit unlock |

**Provability Score: 1.5/5** — All strategy positions are verifiable on-chain on both Ethereum and Arbitrum. ERC-4626 share price is fully programmatic. Cross-chain positions have minor reporting lag between keeper cycles but the actual positions exist on-chain at all times. Multiple verification sources available.

**Funds Management Score = (3 + 1.5) / 2 = 2.25**

**Score: 2.25/5** — Strong on-chain provability with all positions verifiable across both chains. Mixed collateral quality and leverage usage elevate the risk on the collateralization side.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption for USDC |
| Liquidity depth | 0 idle — 100% deployed. Withdrawal requires strategy unwinding |
| Cross-chain | CCTP bridge delays for Arbitrum strategies |
| PT maturity | Some strategies hold PT tokens with maturity constraints |
| Same-value asset | USDC-denominated — no price impact risk |
| Deposit limit | $5M cap limits current scale |

**Score: 3/5** — USDC-denominated vault eliminates price divergence risk. ERC-4626 redemption mechanism exists. However, 100% capital deployment means withdrawals require strategy unwinding which may take time (looper deleveraging, cross-chain bridging, PT selling before maturity). No DEX liquidity as alternative exit. The current TVL (~$3M) means withdrawal amounts are relatively small in absolute terms, partially mitigating liquidity risk. Same-value asset adjustment: -0.5 applied from a base of 3.5.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020 |
| Vault management | Separate from Yearn global governance. 3-of-8 Safe with known Yearn team signers |
| Documentation | V3 docs comprehensive. yvUSD docs exist as draft PR |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Yearn has demonstrated capability across historical events. V3 untested |
| Monitoring | Active hourly large-flow alerts, weekly endorsed-vault checks, timelock monitoring across 6 chains |

**Score: 1.5/5** — Yearn's brand, track record, and known team provide high confidence. All 8 signers of the yvUSD Safe are confirmed Yearn insiders (core team + security team). Comprehensive V3 documentation, active Immunefi + Sherlock bounties, demonstrated incident response capability, and active monitoring infrastructure (hourly alerts, endorsed-vault checks, timelock monitoring via GitHub Actions + Telegram). yvUSD-specific docs are in draft but V3 framework docs are extensive. Yearn BORG legal entity (Cayman foundation via YIP-87).

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (2.7 × 0.30) + (2.25 × 0.30) + (3.0 × 0.20) + (3.0 × 0.15) + (1.5 × 0.05)
            = 0.81 + 0.675 + 0.60 + 0.45 + 0.075
            = 2.61
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 2.7 | 30% | 0.81 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.6/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk (2.6/5.0) — Approved with enhanced monitoring**

---

## Reassessment Triggers

- **Time-based:** Reassess in 2 months (May 2026) given the vault's extreme youth
- **TVL-based:** Reassess if TVL exceeds $10M or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, governance change, or underlying protocol incident (especially 3Jane, InfiniFi, or Cap)
- **Governance-based:** Reassess if the Safe composition changes (signer additions/removals, threshold changes), if a timelock is added, or if the vault migrates to the Yearn global multisig. Reassess if the Fee Splitter governance is transferred from the deployer EOA to the multisig
- **Audit-based:** Reassess if CCTPStrategy or yvUSD-specific components receive dedicated external audits (should improve Audits score)
- **Dependency-based:** Reassess if 3Jane, InfiniFi, or Cap experience significant events. Reassess if Morpho looper markets face liquidation stress
- **Strategy-based:** Reassess if allocation to medium-risk protocols exceeds 70% or if leverage ratios increase significantly
