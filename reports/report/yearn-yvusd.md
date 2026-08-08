# Protocol Risk Assessment: Yearn — yvUSD

- **Assessment Date:** August 8, 2026
- **Token:** yvUSD (USD yVault)
- **Chain:** Ethereum (with cross-chain strategies on Arbitrum, Katana, and Base)
- **Token Address:** [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987)
- **Final Score: 2.2/5.0**

## Overview + Links

yvUSD is a **USDC-denominated cross-chain Yearn V3 vault** (ERC-4626) that deploys deposited USDC into multiple yield strategies across Ethereum mainnet and three remote chains (Arbitrum, Katana, Base). The vault uses **two distinct cross-chain mechanisms** to bridge assets to strategies on remote chains: **Circle's CCTP (Cross-Chain Transfer Protocol)** for Arbitrum and Base, and the **Polygon AggLayer LxLy unified bridge (via a VaultBridgeToken)** for Katana — requiring only strategy contracts on those chains rather than full Yearn V3 infrastructure.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting USDC deposits, issuing yvUSD shares
- **Cross-chain strategies (CCTP):** Use a two-contract pattern — an origin `CCTPStrategy` on Ethereum and a remote `CCTPRemoteStrategy` (ERC-4626 variant) on the destination chain. The origin strategy restricts deposits to a single `DEPOSITER` address (the yvUSD vault itself). When `report()` is called on the destination chain, `_harvestAndReport()` reports new assets back to the origin by queuing a CCTP message — no separate keeper relay required. The origin receives updates via `handleReceiveFinalizedMessage` and tracks remote capital via a `remoteAssets` variable. Currently the Arbitrum and Base CCTP strategies hold 0 debt
- **Cross-chain strategy (AggLayer/Katana):** A `KatanaStrategy` ([`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C)) wraps USDC into a **VaultBridgeToken** ([`0x53E82ABbb12638F09d9e624578ccB666217a765e`](https://etherscan.io/address/0x53E82ABbb12638F09d9e624578ccB666217a765e)) and bridges it to a remote counterpart on **Katana** (AggLayer network ID 20) via the Polygon zkEVM/AggLayer LxLy unified bridge. Reports return through the bridge's `onMessageReceived` callback. This is the only active cross-chain position with material debt (10.1% of TVL)
- **LockedyvUSD:** Companion cooldown wrapper where users lock yvUSD shares for additional yield (10% locker bonus per the APR oracle). Users locking shares gives the vault better guarantees on duration risk, enabling higher-yield strategies without sacrificing atomic liquidity for non-lockers. Cooldown: 14 days (`cooldownDuration` = 1,209,600 s, confirmed onchain), withdraw window: 5 days (configurable). Also serves as the vault's accountant ([`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040), confirmed onchain). ~32.3% of yvUSD supply is locked here (2.88M LockedyvUSD shares out of 8.91M total)
- **Strategies:** 13 active strategies (2 funded, 11 idle at ≤0 debt) deploying into Morpho V1, a remote Yearn yvUSDC vault on Katana, and Sky/MakerDAO. The Morpho V2 Sentora PYUSD/RLUSD convertors and the Arbitrum syrupUSDC looper have been fully exited. USD3 Pendle PT and Fluid strategies hold sub-0.5% dust allocations and are treated as idle. A new sIUSD Morpho looper strategy has been added to the withdrawal queue but remains unfunded
- **Yield sources:** Curated Morpho V1 lending (Yearn OG USDC vault), a cross-chain Yearn yvUSDC compounder on Katana, and Sky savings (sUSDS)

**Key metrics (August 8, 2026):**

- **TVL:** ~$9,119,103 USDC (`totalAssets()`, confirmed onchain)
- **Total Supply:** ~8,912,719 yvUSD
- **Price Per Share:** 1.023156 USDC/yvUSD (`convertToAssets(1e6)`; ~2.32% appreciation since the Jan 19 inception, ~4.2% annualized)
- **Total Debt:** 100% deployed (0 idle)
- **Deposit Limit:** $15,000,000 (~60.8% utilized)
- **Profit Max Unlock Time:** 5 days (432,000 s)
- **Net APR:** 5.19% | **APY:** 5.32% ([yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs); gross APR ~5.76%, 0% management/performance fee, 10% locker bonus)

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
| APR Oracle | [`0x1981AD9F44F2EA9aDd2dC4AD7D075c102C70aF92`](https://etherscan.io/address/0x1981AD9F44F2EA9aDd2dC4AD7D075c102C70aF92) | Onchain APR estimation |
| Fee Splitter | [`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470) | Revenue distribution |

### Governance Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Standard Yearn Role Manager — vault `role_manager` |
| Strategy Manager (Timelock) | [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) | TimelockController — **7-day delay**. Governs the RoleManager. TIMELOCK_ADMIN_ROLE held only by the timelock itself (not Daddy or any EOA). DEFAULT_ADMIN never granted (`admin = address(0)` at [construction](https://etherscan.io/tx/0x3063e5a82b383d0f5b38e8735dd13c0c9d492c3bfe5dc9d3d23fc829c60f96b0)) — no one can grant/revoke roles outside the propose→wait→execute flow |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — **sole PROPOSER** on timelock; also EXECUTOR and CANCELLER (shared). Holds nearly all vault roles (bitmask 0x3FF6) |
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

### Active Strategies (13 — 2 funded, 11 idle/dust)

Debts and allocations confirmed onchain via `strategies(address).current_debt`; total debt = 9,119,102.64 USDC matches `totalDebt()` exactly. The strategy set is enumerated from `StrategyChanged` events since deployment.

| # | Strategy | Name | Current Debt (USDC) | Allocation | Protocols / Venue |
|---|----------|------|--------------------:|-----------:|-------------------|
| 1 | [`0x0e297dE4005883C757c9F09fdF7cF1363C20e626`](https://etherscan.io/address/0x0e297dE4005883C757c9F09fdF7cF1363C20e626) | Morpho Yearn OG USDC Compounder | 7,032,833 | 77.1% | Morpho V1 (Yearn OG USDC vault [`0xF9bdDD4A9b3A45f980e11fDDE96e16364dDBEc49`](https://etherscan.io/address/0xF9bdDD4A9b3A45f980e11fDDE96e16364dDBEc49)) |
| 2 | [`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C) | Katana yvUSDC Compounder | 921,601 | 10.1% | **Katana L2** (remote yvUSDC), AggLayer LxLy bridge, VaultBridgeToken |
| 3 | [`0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D`](https://etherscan.io/address/0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D) | USDC To sUSDS Depositor | 663,602 | 7.3% | Sky/MakerDAO (sUSDS [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) |

**Fully exited (0 debt):**

| # | Strategy | Name | Protocols / Venue |
|---|----------|------|-------------------|
| 6 | [`0x3D2467Cbf82332dbFb38997cBc4D2192694D9490`](https://etherscan.io/address/0x3D2467Cbf82332dbFb38997cBc4D2192694D9490) | Morpho V2 Sentora PYUSD Convertor | Formerly Morpho V2, Sentora, PYUSD |
| 7 | [`0xE0be46Cc5aD2F56a7734A99FF403781b9c54C7B2`](https://etherscan.io/address/0xE0be46Cc5aD2F56a7734A99FF403781b9c54C7B2) | Morpho V2 Sentora RLUSD Convertor | Formerly Morpho V2, Sentora, RLUSD |
| 8 | [`0x2F56D106C6Df739bdbb777C2feE79FFaED88D179`](https://etherscan.io/address/0x2F56D106C6Df739bdbb777C2feE79FFaED88D179) | Arbitrum syrupUSDC/USDC Morpho Looper | Formerly Maple syrupUSDC, Morpho, CCTP |

**Idle/dust (≤$509 debt):**

| # | Strategy | Name | Protocols / Venue |
|---|----------|------|-------------------|
| 9 | [`0x9e0A5943dFc1A85B48C191aa7c10487297aA675b`](https://etherscan.io/address/0x9e0A5943dFc1A85B48C191aa7c10487297aA675b) | USDC To Spark USDS Depositor | Spark, Sky/MakerDAO |
| 10 | [`0x48E66D65006007ef62B50735D070fc30d0242a93`](https://etherscan.io/address/0x48E66D65006007ef62B50735D070fc30d0242a93) | USDC To SKY USDS Depositor | Sky/MakerDAO |
| 11 | [`0x5f9DBa2805411a8382FDb4E69d4f2Da8EFaF1F89`](https://etherscan.io/address/0x5f9DBa2805411a8382FDb4E69d4f2Da8EFaF1F89) | Infinifi sIUSD Morpho Looper | InfiniFi siUSD, Morpho |
| 12 | [`0xF28DC8B6DeD7E45F8cf84B9972487C8e1857A442`](https://etherscan.io/address/0xF28DC8B6DeD7E45F8cf84B9972487C8e1857A442) | syrupUSDC/USDC Morpho Looper | Maple syrupUSDC, Morpho |
| 13 | [`0x7bf1D269bf2CB79E628F51B93763B342fd059D1D`](https://etherscan.io/address/0x7bf1D269bf2CB79E628F51B93763B342fd059D1D) | PT stcUSD Jul 23 Morpho Looper | Cap stcUSD, Morpho, Pendle/Spectra |
| 14 | [`0xb44EE7869b9D47cd605B05022c8Bd8612EBe53EE`](https://etherscan.io/address/0xb44EE7869b9D47cd605B05022c8Bd8612EBe53EE) | sUSD3 Compounder | 3Jane sUSD3 |
| 15 | [`0x908244B6ef0e52911a380a5454aEC0743598Fb20`](https://etherscan.io/address/0x908244B6ef0e52911a380a5454aEC0743598Fb20) | Base Yearn Morpho OG USDC | Base L2, Morpho, CCTP |
| 4 | [`0x4C0e4d3cB62B91afBbf1Fe8e830f98A513c7234b`](https://etherscan.io/address/0x4C0e4d3cB62B91afBbf1Fe8e830f98A513c7234b) | USD3 Pendle PT Maxi | $509 dust | 3Jane USD3, Pendle |
| 5 | [`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF) | USDC Fluid Lender | $96 dust | Fluid |
| 16 | [`0xF0FEC2602Dff25497D6a14b3113D0687b4c56741`](https://etherscan.io/address/0xF0FEC2602Dff25497D6a14b3113D0687b4c56741) | sIUSD/USDC Morpho Looper | InfiniFi sIUSD, Morpho |

The Morpho V2 Sentora PYUSD/RLUSD convertors and the Arbitrum syrupUSDC looper have been fully exited (0 debt). Capital consolidated into the Morpho V1 OG USDC compounder, which dominates at 77.1% of TVL. Cross-chain Katana is the only active cross-chain position (10.1%). The USD3 Pendle PT ($509) and Fluid Lender ($96) strategies hold sub-0.5% dust allocations and are treated as idle. Active portfolio management continues; the figures above are a point-in-time snapshot.

### Strategy Protocol Dependencies with Existing Reports

Several underlying protocols have been previously assessed in this repository:

| Protocol | Report Score | yvUSD Allocation |
|----------|-------------|-----------------|
| [Maple syrupUSDC](../report/maple-syrupusdc.md) | **2.33/5** (Low Risk) | 0% (exited) |
| [InfiniFi](../report/infinifi.md) | **2.8/5** (Medium Risk) | 0% (idle) |
| [3Jane USD3](../report/3jane-usd3.md) | **3.5/5** (Medium Risk) | <0.1% (Pendle PT dust) |
| [Fluid](../report/fluid.md) | **1.1/5** (Minimal Risk) | <0.1% (dust) |
| [Cap (stcUSD)](https://curation.yearn.fi/report/cap-stcusd/) | **risk-2** (Low Risk) | 0% (idle PT stcUSD looper + new sIUSD looper unfunded) |
| [Spectra](../report/spectra-finance.md) | **2.25/5** (Low Risk) | Used for PT token infrastructure |

Newer underlying venues **without** an existing repository report — **Katana L2 + AggLayer LxLy bridge** (10.1%) — are assessed inline in this report and flagged as novel-dependency risk.

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
- **Centralization Risk** — offchain management dependency
- **Protocol Integration** — number of external protocols integrated

**External Protocol-Related Scores (6 metrics):**
- **Auditing** — number of trusted audits on external protocols
- **Centralization** — owner control/governance of external protocols
- **TVL** — active total value locked
- **Longevity** — contract deployment age
- **Protocol Type** — category (blue-chip vs novel vs cross-chain vs offchain)

All 12 scores are summed and mapped to risk levels (Level 1-4). ySec can make exceptions with textual justification. This is a rigorous, documented process that provides strong assurance for strategy quality even without external audits on individual strategies.

### Underlying Protocol Audits

| Protocol | Audit Coverage | Notes |
|----------|---------------|-------|
| Morpho (V1) | 25+ audits (Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora) | Formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk. ~77% of TVL |
| Pendle | 6+ audits (Ackee, Dedaub, ChainSecurity, Spearbit, Code4rena) | Well-established (idle/dust) |
| Circle CCTP | ChainSecurity (V1 2023, V2 March 2025, V2 update April 2025, Gateway July 2025) | Trust-minimized bridge (Arbitrum/Base — CCTP strategies idle at 0 debt) |
| Polygon AggLayer (LxLy) + VaultBridgeToken | AggLayer/zkEVM bridge audited; VaultBridgeToken wrapper is **newer infrastructure** | ~10% Katana exposure. Katana is a young (2025) L2; bridge + wrapper not yet covered by an existing repo report — flagged as novel |
| Sky/MakerDAO | Extensively audited across many years | Blue-chip |
| Spark | Inherits MakerDAO audit coverage | Blue-chip (idle) |
| Cap (stcUSD) | 5+ audits (Electisec, Spearbit, Trail of Bits, Zellic, Certora) | Assessed internally as [risk-2](https://curation.yearn.fi/report/cap-stcusd/). Idle (0 debt) |

### Bug Bounty

- **Immunefi:** Active bug bounty for Yearn Finance. Max payout: **$200,000** (Critical). Scope includes V3 vaults (`VaultV3.vy`, `VaultFactory.vy`).
  - Link: https://immunefi.com/bounty/yearnfinance/
- **Sherlock:** Also listed: https://audits.sherlock.xyz/bug-bounties/30
- **Safe Harbor:** Not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

- **13 active strategies** (2 funded) spanning up to 3 chains (Ethereum + Katana + Base; Arbitrum fully exited)
- **One cross-chain mechanism with active debt:** the Polygon AggLayer LxLy bridge + VaultBridgeToken (Katana, ~10%); CCTP strategies (Arbitrum, Base) are at 0 debt
- **No active convertor or looper strategies** — the Morpho V2 Sentora PYUSD/RLUSD convertors and the Arbitrum syrupUSDC looper have been fully exited, eliminating the auction/convertor valuation surface and leveraged-looper exposure. Pendle PT and Fluid strategies hold sub-0.5% dust and are treated as idle
- **Custom accountant** (LockedyvUSD) combining cooldown/locking mechanics with fee management
- **Multiple protocol dependencies** (Morpho V1, Sky, Katana/AggLayer, CCTP framework idle)
- **V3 vault itself is non-upgradeable** (immutable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** January 19, 2026 (block 24271831) — **~201 days** in production
- **TVL:** ~$9.12M USDC. Deposit limit: $15M (~60.8% utilized)
- **PPS trend:** 1.000000 → 1.023156 — ~2.32% appreciation since inception, ~4.2% annualized; no PPS decrease observed
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** The Morpho V2 Sentora PYUSD/RLUSD convertors and the Arbitrum syrupUSDC looper have been fully exited. Capital consolidated into the Morpho V1 OG USDC compounder (77.1%). Cross-chain Katana is the only active cross-chain position (10.1%). A new sIUSD/USDC Morpho Looper strategy was added to the withdrawal queue but remains unfunded
- **Governance:** Standard Yearn RoleManager, 7-day timelock (`getMinDelay()` = 604,800 s), Daddy bitmask `0x3FF6`, no pending `future_role_manager`, vault not shut down
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~27 months). No V3 vault exploits

**Yearn protocol TVL:** ~$177M total across all chains (DeFi Llama, August 2026).

## Funds Management

yvUSD deploys deposited USDC across 16 active strategies (2 funded) with 100% capital utilization (0 idle). The funded book falls into three categories:

### Strategy Positions by Category

**1. Morpho V1 Lending — mainnet (77.1% of TVL)**

- Morpho Yearn OG USDC Compounder (77.1%) — deposits USDC into the Yearn-curated **Morpho V1** "Yearn OG USDC" vault ([`0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49`](https://etherscan.io/address/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49)). Unleveraged lending compounder. 25+ audits with formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk.

**Lending risk:** Morpho V1 has 25+ audits and formal verification, but the Yearn OG USDC vault is rated low-mid risk, not blue-chip. The vault is unleveraged and curated. No convertor or auction complexity.

**2. Cross-Chain Compounder — Katana (10.1% of TVL)**

- Katana yvUSDC Compounder (10.1%) — wraps USDC into a **VaultBridgeToken** ([`0x53E82ABbb12638F09d9e624578ccB666217a765e`](https://etherscan.io/address/0x53E82ABbb12638F09d9e624578ccB666217a765e)) and bridges to **Katana L2** (AggLayer network ID 20) via the Polygon AggLayer LxLy unified bridge, where a remote counterpart deposits into a Yearn yvUSDC vault. This is the **only active cross-chain position** with material debt (CCTP strategies idle at 0).

**Cross-chain risk:** Novel dependency stack — a young (2025) L2, the AggLayer/LxLy bridge, the VaultBridgeToken wrapper, and a remote Yearn vault — none of which have an existing repository report. Withdrawals require a bridge round-trip; the local `valueOfVault()` reads 0 between bridge reports, so ~10% of TVL resides on a remote chain and is known to the origin only via on-chain bridge messages.

**3. Sky Lending (7.3% of TVL)**

- USDC To sUSDS Depositor (7.3%) — deposits into Sky/MakerDAO Savings USDS (sUSDS, [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD))

**Lending risk:** Standard DeFi lending risk. Sky is blue-chip with extensive audit coverage and deep liquidity.

**No funded convertor or looper strategies remain.** The Morpho V2 Sentora PYUSD/RLUSD convertors and the Arbitrum syrupUSDC looper were fully exited (0 debt). A new sIUSD/USDC Morpho Looper strategy was added to the withdrawal queue but remains unfunded.

**Idle/dust strategies (11, at ≤$509 debt):** USDC To Spark USDS Depositor, USDC To SKY USDS Depositor, Infinifi sIUSD Morpho Looper, syrupUSDC/USDC Morpho Looper (mainnet), PT stcUSD Jul 23 Morpho Looper, sUSD3 Compounder, Base Yearn Morpho OG USDC (CCTP), sIUSD/USDC Morpho Looper, and the 3 fully-exited legacy strategies (Morpho V2 Sentora PYUSD/RLUSD convertors, Arbitrum syrupUSDC looper). The USD3 Pendle PT Maxi ($509) and USDC Fluid Lender ($96) hold sub-0.5% dust and are treated as idle. All endorsed strategies can be re-funded by the Debt Allocator without a new timelock proposal.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSD (ERC-4626 standard). Subject to the $15M deposit limit (`deposit_limit` confirmed onchain; `deposit_limit_module` = `address(0)`, so the hard cap is the direct limit)
- **Withdrawals:** ERC-4626 standard. Users can redeem yvUSD for USDC. However:
  - **100% of funds are deployed** (0 idle) — withdrawals require unwinding strategy positions
  - **Cross-chain strategy** requires bridging back (AggLayer claim for Katana, ~10% of TVL)
  - **No convertor exit friction** — the Morpho V2 Sentora PYUSD/RLUSD convertors have been fully exited
  - **No looper deleverage** — all looper strategies are at 0 debt
- **LockedyvUSD:** Optional lock wrapper with 14-day cooldown + 5-day withdrawal window. Yields a 10% locker bonus but restricts exit timing. ~32.3% of yvUSD supply is locked (2.88M LockedyvUSD shares out of 8.91M total) — a committed-duration buffer reducing immediate redemption pressure
- **No fees on deposits/withdrawals** — the APR oracle currently reports 0 management/performance fee; the locker bonus is funded from extra yield via the accountant

### Collateralization

- **100% USDC-backed** — all deposits are USDC, all strategy positions ultimately track back to USDC value
- **Collateral quality by strategy:**
  - Low-mid risk (Morpho V1 OG 77.1%): dominant position
  - Blue-chip (Sky sUSDS 7.3%): extensively audited, deep liquidity
  - Cross-chain (Katana yvUSDC via AggLayer): ~10.1% of TVL, novel stack
- **Leverage: 0%** — no funded looper strategies
- **No convertor or auction exposure** — the Morpho V2 Sentora PYUSD/RLUSD convertors were fully exited, eliminating stablecoin-depeg and auction-slippage risk
- **Concentration risk:** The portfolio is dominated by a single Morpho V1 OG USDC position (77.1%). Only 7.3% is in blue-chip venues (Sky). The Katana cross-chain position (10.1%) adds novel infrastructure risk.

### Provability

- **yvUSD exchange rate:** Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` is onchain. The vault's `totalAssets()` is the sum of all strategy debts (verified to reconcile exactly with the per-strategy `current_debt`)
- **No oracle-valued convertors:** The Morpho V2 Sentora convertors have been fully exited. All funded positions are valued via direct ERC-4626 reads — no management-set oracle or `reportBuffer` parameterization
- **Cross-chain lag:** Only the Katana strategy (~10.1%) has cross-chain lag. The local `valueOfVault()` reads 0 between bridge reports, so this slice is known to the origin only via the last on-chain AggLayer bridged message. CCTP strategies (Arbitrum, Base) are idle at 0 debt
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over **5 days** (`profitMaxUnlockTime` = 432,000 s). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSD for USDC via ERC-4626 `withdraw()`/`redeem()`. Subject to strategy liquidity
- **Zero idle funds:** Currently 100% of vault assets are deployed to strategies. Withdrawals require unwinding positions
- **Strategy withdrawal constraints (by current allocation):**
  - **Morpho V1 OG (77.1%):** Generally available for prompt withdrawal — unleveraged lending, no auction or bridge delay. However, the underlying Yearn OG USDC vault is rated low-mid risk, implying exit confidence is not at blue-chip levels
  - **Sky sUSDS (7.3%):** Blue-chip venue, generally available for prompt withdrawal
  - **Cross-chain (~10%):** Katana requires an AggLayer/LxLy bridge round-trip and claim
  - **No convertor exit friction** — all convertors fully exited
  - **No looper deleverage** — all looper strategies at 0 debt
- **DEX liquidity:** No known DEX liquidity pools for yvUSD. The vault is an ERC-4626 token, not traded on DEXes
- **LockedyvUSD:** 14-day cooldown + 5-day withdrawal window. Shares in cooldown cannot be transferred. **~32.3% of yvUSD supply** is locked here (2.88M LockedyvUSD shares out of 8.91M total) — a committed-duration buffer reducing immediate redemption pressure
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **Deposit limit:** $15M cap (~60.8% utilized)
- **Net:** ~84% of TVL is withdrawable without auction or bridge delay, though 77.1% sits in a low-mid risk Morpho V1 vault rather than a blue-chip venue. Only ~10% faces cross-chain bridge latency. No convertor auction friction, no looper deleverage. The ~32.3% locked-supply buffer provides meaningful duration protection.

## Centralization & Control Risks

### Governance

The yvUSD vault uses the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)). This is the same governance framework used by yvUSDC-1 and 37+ other Yearn vaults.

**Governance hierarchy:**

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | Nearly all roles (bitmask 0x3FF6). **Sole PROPOSER** on timelock; also EXECUTOR and CANCELLER (shared — see [Appendix](#appendix-timelockcontroller-role-structure)) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | Operational roles (bitmask 0x3972) — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY. CANCELLER on timelock |
| **Security** | [`0xe5e2BAf96198c56380DDd5e992D7d1adA0E989C0`](https://etherscan.io/address/0xe5e2BAf96198c56380DDd5e992D7d1adA0E989C0) | 4-of-7 | DEBT_MANAGER, MAX_DEBT_MANAGER, EMERGENCY_MANAGER (bitmask 0x20C0) |
| **Strategy Manager (Timelock)** | [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (bitmask 0x8F). DEFAULT_ADMIN never granted. Timelock holds TIMELOCK_ADMIN_ROLE — config changes require 7-day delay |
| **Keeper** | [`0x604e586F17cE106B64185a7A0d2c1DA5BaCe711e`](https://etherscan.io/address/0x604e586F17cE106B64185a7A0d2c1DA5BaCe711e) | Bot | REPORTING_MANAGER |
| **Debt Allocator** | [`0x1E9eB053228B1156831759401DE0E115356b8671`](https://etherscan.io/address/0x1E9eB053228B1156831759401DE0E115356b8671) | Bot | REPORTING_MANAGER + DEBT_MANAGER |

**Daddy (ySafe) 6-of-9 multisig signers** include publicly known contributors: Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others ([source](https://docs.yearn.fi/developers/security/multisig)).

**Governance assessment:**
1. **Standard Yearn governance** — same setup used across 37+ vaults (including yvUSDC-1), battle-tested pattern
2. **No EOA role concentration** — deployer EOA has 0 vault roles (confirmed). All vault operations require multisig or contract authorization
3. **7-day timelock with locked-down role structure** — strategy additions and other critical operations go through the TimelockController. The timelock roles are tightly controlled:
   - **PROPOSER:** Daddy (6/9) only — no one else can initiate timelocked operations
   - **EXECUTOR:** Daddy (6/9) + TimelockExecutor contract (governed by Brain, internal executors: Brain + Deployer EOA)
   - **CANCELLER:** Daddy (6/9) + Brain (3/8)
   - **TIMELOCK_ADMIN_ROLE:** held only by the timelock contract itself — not by Daddy, Brain, or any EOA. Config changes (delay, role grants) must go through the 7-day delay
   - **DEFAULT_ADMIN_ROLE:** never granted (`admin = address(0)` at construction). No one can grant or revoke timelock roles outside the normal propose→wait→execute flow
4. **Immutable vault** — no proxy upgrades possible
5. **Multi-layer security** — Daddy (governance), Brain (operations), Security (emergency), and automated bots (Keeper, Debt Allocator) with differentiated responsibilities

**Remaining concern:** The deployer EOA ([`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271)) remains the sole `governance` address on the Fee Splitter contract ([`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470)). This is a low-impact concern (fee distribution only, not fund custody) but deviates from the otherwise robust multi-sig governance pattern.

### Programmability

- **Exchange rate (PPS):** Calculated onchain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless onchain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over **5 days**. Losses are immediate
- **Debt allocation:** Automated via Debt Allocator contract, with manual override available to DEBT_MANAGER role holders (Daddy, Brain, Security)
- **Convertor valuation:** None — all convertor strategies fully exited (0 debt). All funded positions are direct ERC-4626 with no management-set oracle or `reportBuffer` parameterization
- **Cross-chain accounting:** Remote `_harvestAndReport()` queues a report back to the origin — via the AggLayer LxLy `onMessageReceived` callback for Katana (~10% of TVL). CCTP strategies (Arbitrum/Base) are idle at 0 debt. The Katana strategy's local `valueOfVault()` reads 0 between bridge reports — its value is known to the origin only via the last on-chain bridged message
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Allocation | Notes |
|-----------|-------------|-----------|-------|
| **Morpho (V1)** | Critical | ~77% | 25+ audits, formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk. Unleveraged. 77.1% concentration — critical single point of failure |
| **Katana L2 + AggLayer (LxLy) + VaultBridgeToken** | Critical | ~10% | Newer stack — young (2025) L2, AggLayer bridge, no existing repo report |
| **Sky/MakerDAO** | High | 7.3% | Blue-chip, extensively audited |
| **Pendle** | Low | 0% (idle) | $2B+ TVL, 6+ audits. PT infrastructure for fixed-rate yield |
| **3Jane USD3** | Low | 0% (idle) | Report score 3.5/5. Medium-risk credit-based lending |
| **Fluid** | Low | 0% (idle) | Report score 1.1/5, minimal risk |
| **InfiniFi / Cap / Spark / Maple** | Low | 0% (idle) | Endorsed but unfunded |

**Dependency concentration:** ~77.1% in Morpho V1 (low-mid risk), ~7.3% in blue-chip Sky, and ~10.1% in the novel Katana/AggLayer stack. The Morpho V2/Sentora convertors, PYUSD/RLUSD exposure, Arbitrum looper, and active CCTP cross-chain lanes have all been exited or sit at 0 debt. Dust-level Pendle PT ($509) and Fluid ($96) strategies are treated as idle. Single-protocol concentration on Morpho V1 (77.1%) is the primary dependency concern — a Morpho V1 exploit or Yearn OG curator compromise would impact over three-quarters of the vault's value, and the underlying vault itself is rated low-mid risk, not blue-chip.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The Yearn global multisig has 9 named signers including Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others
- **yvUSD governance:** Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations
- **Documentation:** Comprehensive Yearn V3 documentation. yvUSD-specific docs are published on the official Yearn docs site, including cross-chain strategy architecture, LockedyvUSD mechanics, and a dedicated APR API service ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi))
- **Legal:** Yearn Finance has converted its ychad.eth multisig into a BORG (cybernetic organization) via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation company with smart contract governance restrictions. The YFI token governs the protocol via YIP proposals
- **Incident response:** Yearn has demonstrated incident response capability across historical events. V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **V3 immutability:** Vault contracts cannot be upgraded — this eliminates proxy upgrade risk but means bugs cannot be patched without deploying a new vault

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring`](https://github.com/yearn/monitoring) repository:

- **Large flow alerts** (`protocols/yearn/alert_large_flows.py`): Monitors deposit/withdrawal events via indexer, alerts on flows exceeding $5M threshold via Telegram. Currently monitors 21 vaults across Ethereum, Base, Arbitrum, and Katana
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`): Runs daily, verifies all Yearn V3 vaults are endorsed onchain via the registry contract
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`): Monitors Yearn TimelockController across 6 chains

**Note:** yvUSD is not yet added to the monitored vault list in `alert_large_flows.py`, but the infrastructure is in place and can be extended.

Additionally, Yearn provides a dedicated **yvUSD APR API** ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi), [source](https://github.com/yearn/yearn-yvusd-apr-service)) that aggregates onchain vault/strategy accounting with offchain APR oracle computations. Endpoints include `/api/health` (data recency), `/api/aprs` (precomputed APRs), and `/api/snapshot` (raw strategy cache). A **DeBank bundle** ([portfolio view](https://debank.com/bundles/221066/portfolio)) provides a consolidated view of all vault fund positions.

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
- **Cross-chain strategy accounting** — monitor remote-asset staleness for Katana (AggLayer/LxLy, ~10%); the Katana strategy's local `valueOfVault()` reads 0, so verify against actual Katana-side positions. CCTP strategies (Arbitrum, Base) are idle at 0 debt — monitor for re-funding
- **Strategy re-funding** — monitor Debt Allocator activity for re-funding of idle CCTP, looper, or convertor strategies that would reintroduce previously-exited risk surfaces
- **Underlying protocol health** — monitor Morpho V1 (critical, 77.1%), Sky, and the Katana/AggLayer bridge for incidents. Idle-endorsed protocol dependencies (InfiniFi, Cap, Spark, Maple) should be monitored if re-funded

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

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~27 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Standard Yearn governance with 7-day timelock:** Standard RoleManager, 7-day TimelockController (`getMinDelay()` = 604,800 s) for critical operations. Daddy/ySafe (6-of-9, publicly known signers) is the sole proposer/executor; the timelock is self-governed (holds TIMELOCK_ADMIN_ROLE). No pending `future_role_manager`
- **Multi-layer security:** Daddy (governance), Brain (operations), Security (emergency), and automated bots (Keeper, Debt Allocator) with differentiated responsibilities. No single point of failure
- **USDC-denominated:** Stablecoin backing eliminates price volatility risk on the underlying asset
- **Looper and convertor exposure fully eliminated:** All leveraged looper positions and Morpho V2 Sentora convertors have been exited (0 debt). No stablecoin depeg exposure, no auction-conversion friction
- **~201 days production, monotonically increasing PPS:** PPS up to 1.023156 (~2.32% appreciation, ~4.2% annualized); no decrease observed
- **$9.12M TVL:** Deposit limit at $15M (~60.8% utilized)
- **No EOA role concentration:** Deployer EOA confirmed at 0 vault roles. All vault operations require multisig or contract authorization
- **Rigorous strategy review process:** 12-metric risk scoring framework with ySec security review. All strategies evaluated across testing coverage, complexity, risk exposure, centralization, and protocol integration dimensions
- **Active monitoring infrastructure:** Hourly large-flow alerts, daily endorsed-vault checks, and timelock monitoring across 6 chains via the automation scheduler + Telegram alerts

### Key Risks

- **Morpho V1 OG concentration (77.1%):** Over three-quarters of vault TVL is deployed in a single Morpho V1 curated vault rated low-mid risk, not blue-chip. High conectration in 3jane assets is main concern. Yearn is actively monitoring 3jane protocol health and other assets in the Morpho V1 OG vault.
- **Katana/AggLayer bridge risk (~10%):** The second-largest position depends on a young (2025) L2, the AggLayer/LxLy unified bridge, a VaultBridgeToken wrapper, and a remote Yearn vault — value that reads 0 locally and is known only from the last bridged report. No existing repository report covers this stack
- **CCTP infrastructure idle but available:** The Arbitrum and Base CCTP strategies sit at 0 debt but are endorsed and can be re-funded by the Debt Allocator without a new timelock proposal, potentially reintroducing cross-chain exposure
- **No external product-specific audit:** Individual strategies (KatanaStrategy, CCTPStrategy) have undergone ySec internal review but lack dedicated external third-party audits
- **No DEX liquidity:** yvUSD has no secondary market — exit is exclusively through the ERC-4626 vault
- **Only 7.3% in blue-chip venues:** Sky sUSDS is the only blue-chip dependency. The dominant Morpho V1 OG position (77.1%) is low-mid risk.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by Statemind, ChainSecurity, and yAcademy. ✅ PASS (framework audited; individual strategies lack dedicated external audit)
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions onchain verifiable. ✅ PASS
- [x] **Total centralization** — Standard Yearn governance: Daddy/ySafe 6-of-9 multisig with publicly named signers, 7-day timelock on critical operations, Brain 3-of-8 for operations, Security 4-of-7 for emergency. No EOA vault roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). KatanaStrategy has internal ySec review but no dedicated external audit. Convertor/looper strategies fully exited |
| Bug bounty | $200K on Immunefi (active) + Sherlock bounty |
| Production history | **~201 days** (Jan 19, 2026). V3 framework: ~27 months |
| TVL | **~$9.12M**. Deposit limit: $15M (~60.8% utilized) |
| Security incidents | None on V3; no PPS decrease observed |
| Strategy review | Rigorous 12-metric framework with ySec security review, testing coverage requirements, complexity scoring, and risk exposure assessment |

**Score: 2.5/5** — The underlying V3 framework has solid audit coverage from 3 reputable firms and a clean ~27-month track record. The vault is ~201 days old with ~$9.12M TVL, monotonic PPS, and no incidents. The convertor/auction surface has been fully exited. The KatanaStrategy lacks a dedicated external audit but has ySec internal review. The vault is below the 1-year production threshold and Katana remains externally unaudited.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades). Strategies can be added/removed |
| Multisig | 6-of-9 Daddy/ySafe (proposer/executor on timelock) + 3-of-8 Brain (operations) + 4-of-7 Security (emergency) |
| Timelock | **7-day TimelockController** for critical operations (add strategy, change accountant, set max debt). Self-governed: timelock holds TIMELOCK_ADMIN_ROLE, so config changes (delay, roles) must go through 7-day delay |
| Privileged roles | Well-distributed: Daddy (6/9, nearly all roles), Brain (3/8, operational), Security (4/7, emergency), Keeper + Debt Allocator (bots). No EOA roles (deployer confirmed at bitmask 0x0) |
| Yearn oversight | **Full integration** — same governance framework as yvUSDC-1 and 37+ other Yearn vaults. Standard Yearn RoleManager |

**Governance Score: 1.0/5** — Immutable vault contracts (no proxy upgrades). 7-day timelock on critical operations (strategy additions, accountant changes), with Daddy (6-of-9, named signers) as sole proposer. No EOA vault roles (deployer confirmed at bitmask 0x0). Well-distributed roles across Daddy, Brain (3/8), Security (4/7), and automated bots. Per rubric: immutable contracts + 7+ day timelock + multisig above 3/5 threshold + no EOA roles = score 1. The deployer EOA retains Fee Splitter governance only (low-impact, fee distribution not fund custody).

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits/withdrawals onchain |
| Strategy reporting | Programmatic via Keeper (yHaaSRelayer) and Debt Allocator |
| Debt allocation | Automated via Debt Allocator, with manual override by DEBT_MANAGER holders (Daddy, Brain, Security) |
| Convertor valuation | None — all convertor strategies fully exited (0 debt). All funded positions are direct ERC-4626 |
| Cross-chain | Programmatic — AggLayer `onMessageReceived` for Katana (~10%). CCTP strategies idle at 0. No management-set oracle or auction valuation |

**Programmability Score: 1.5/5** — All funds remain onchain (Ethereum, Katana) and the PPS is calculated algorithmically via ERC-4626; deposits/withdrawals are permissionless and reporting is automated. Cross-chain accounting via bridge messages is verifiable onchain and does not let governance arbitrarily move funds. The remaining ~10% cross-chain bridge lag is reflected in Provability (Category 3B).

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Morpho V1, Sky, Katana/AggLayer. Pendle/3Jane/Fluid at dust/idle. CCTP idle; idle endorsements for InfiniFi, Cap, Spark, Maple |
| Criticality | Morpho V1 (critical, ~77%); Katana/AggLayer (critical, ~10%); Sky (high, 7.3%) |
| Dependency quality | ~7.3% blue-chip (Sky); ~77.1% low-mid risk Morpho V1 OG; ~10% novel Katana/AggLayer stack. Pendle/3Jane/Fluid at dust/idle |
| Cross-chain | One active bridge — Polygon AggLayer LxLy + VaultBridgeToken (Katana, ~10%); CCTP idle |

**Dependencies Score: 3.0/5** — The dependency surface has been reduced to three material protocols, but the dominant position (77.1%) is in a Morpho V1 vault rated low-mid risk, not blue-chip. Only 7.3% is in a genuinely blue-chip venue (Sky). The novel Katana/AggLayer stack (~10%) adds further uncertainty. Single-protocol concentration on a non-blue-chip venue at 77.1% is the primary driver of this score.

**Centralization Score = (1.0 + 1.5 + 3.0) / 3 = 1.83 → 2.0/5**

**Score: 2.0/5** — Governance confirmed onchain (standard RoleManager, 7-day timelock, Daddy 6/9 sole proposer, no EOA vault roles, immutable vault). All funds remain onchain and programmatic. Dependency quality is mixed: ~7.3% blue-chip (Sky), ~77.1% low-mid risk Morpho V1 OG, ~10% novel Katana/AggLayer. The primary concern is single-protocol concentration at 77.1% in a non-blue-chip venue.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed into DeFi yield strategies |
| Collateral quality | ~77.1% low-mid risk Morpho V1 OG; ~7.3% blue-chip Sky; ~10.1% cross-chain Katana (novel); sub-0.5% dust idle |
| Leverage | **0% — all looper strategies fully exited** |
| Verifiability | ERC-4626; mainnet positions direct; ~10% on Katana via bridged reports |

**Collateralization Score: 2.5/5** — Onchain USDC backing is fully verifiable and leverage is zero. However, the dominant position (77.1%) is in a low-mid risk Morpho V1 vault not blue-chip. Only 7.3% is in a blue-chip venue (Sky). The ~10% cross-chain Katana exposure adds novel infrastructure risk. The portfolio is concentrated in a single non-blue-chip venue.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Mainnet positions verifiable onchain; ~10% (Katana) only via last bridged report (`valueOfVault()` reads 0 locally) |
| Exchange rate | ERC-4626, programmatic, anyone can verify |
| Convertor valuation | None — all convertor strategies exited. No management-set oracle or `reportBuffer` |
| Cross-chain lag | ~10% of TVL on Katana, known to origin via on-chain AggLayer bridge messages; CCTP strategies idle at 0 |
| Reporting | Automated via keepers with **5-day** profit unlock |

**Provability Score: 1.5/5** — The base vault and mainnet positions are fully verifiable via ERC-4626. The convertor oracle surface is removed (no management-set valuation). Cross-chain lag is limited to ~10% (Katana via AggLayer). All positions remain on-chain and reconcilable; the only bridge-trust assumption is the ~10% Katana position.

**Funds Management Score = (2.5 + 1.5) / 2 = 2.0**

**Score: 2.0/5** — Collateral quality is mixed: 77.1% is in a low-mid risk vault not blue-chip, only 7.3% is blue-chip, and 10.1% is in novel cross-chain infrastructure. Provability is solid with no oracle-valued positions and limited cross-chain lag.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption for USDC |
| Liquidity depth | 0 idle — 100% deployed. ~84% withdrawable without auction or bridge delay (77.1% Morpho V1 OG, 7.3% Sky sUSDS). However, the 77.1% Morpho V1 position is in a low-mid risk venue not blue-chip |
| Convertor exit | None — all convertors fully exited |
| Cross-chain | ~10% needs an AggLayer bridge round-trip (Katana) |
| Looper / PT | No looper deleverage (0%); Pendle PT/Fluid at dust/idle (0%) |
| Same-value asset | USDC-denominated — no price impact risk |
| Deposit limit | $15M cap (~60.8% utilized) |
| Locked supply | ~32.3% of yvUSD locked in LockedyvUSD — committed-duration buffer |

**Score: 3.0/5** — USDC-denominated vault eliminates price divergence risk. ~84% is withdrawable without auction or bridge delay, but 77.1% sits in a low-mid risk venue, not blue-chip, so exit confidence is not at the highest level. Only ~10% requires a cross-chain bridge round-trip. No convertor auction friction, no looper deleverage. The ~32.3% locked-supply buffer provides duration protection. No DEX liquidity but the ERC-4626 mechanism obviates it. Same-value asset adjustment applied.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020 |
| Vault management | Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations |
| Documentation | V3 docs comprehensive. yvUSD-specific docs published on official Yearn docs site (cross-chain architecture, LockedyvUSD mechanics, dedicated APR API) |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Yearn has demonstrated capability across historical events. V3 untested |
| Monitoring | Active hourly large-flow alerts, daily endorsed-vault checks, timelock monitoring across 6 chains |

**Score: 1.5/5** — Yearn's brand, track record, and known team provide high confidence. The vault uses the standard Yearn governance framework (Daddy, Brain, Security, Keeper, Debt Allocator) — the same pattern across 37+ vaults. Comprehensive V3 documentation, active Immunefi + Sherlock bounties, demonstrated incident response capability, and active monitoring infrastructure (hourly alerts, endorsed-vault checks, timelock monitoring via the automation scheduler + Telegram). yvUSD-specific documentation is on the official Yearn docs site. Yearn BORG legal entity (Cayman foundation via YIP-87).

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 2.0 | 30% | 0.60 |
| Funds Management | 2.0 | 30% | 0.60 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.225 → 2.2/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.2/5.0) — Approved with standard monitoring**

**Score rationale:** The vault benefits from battle-tested Yearn V3 infrastructure (~27 months, no exploits), an immutable design, and strong governance with a 7-day timelock. All convertor and looper exposure has been eliminated, cross-chain risk is limited to ~10%, and provability is solid with no oracle-valued positions. These strengths are tempered by the dominant Morpho V1 OG position at 77.1% in a vault rated low-mid risk, not blue-chip, limited blue-chip exposure at only 7.3% (Sky), and the novel Katana/AggLayer cross-chain stack. The Morpho V1 concentration on a non-blue-chip venue is the primary driver keeping the score in the upper part of the Low Risk tier as Yearn is actively monitoring protocols and assets in the Morpho V1 OG vault.

---

## Reassessment Triggers

- **Time-based:** Reassess in ~2 months (October 2026), or at the 1-year production milestone (January 2027)
- **TVL-based:** Reassess if TVL exceeds $20M, or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, or underlying protocol incident — especially **Morpho (V1), the AggLayer/Katana bridge, or Sky**
- **Governance-based:** Reassess if the timelock delay is modified, Safe compositions change (signer/threshold), or the Fee Splitter governance is transferred from the deployer EOA to the multisig
- **Cross-chain-based:** Reassess if cross-chain exposure exceeds ~20% of TVL, if a new remote chain/bridge is funded (e.g. the Base CCTP strategy activates), or if any bridge experiences downtime or a fault
- **Audit-based:** Reassess if the KatanaStrategy or CCTPStrategy receive dedicated external audits (should improve the Audits score)
- **Strategy-based:** Reassess if Morpho V1 concentration exceeds ~85% of TVL, if the Katana position exceeds ~20% of TVL, or if any looper/convertor strategy is re-funded
- **Concentration-based:** Reassess if the Debt Allocator re-funds idle strategies, materially shifting the concentration profile away from Morpho V1

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐        ┌──────────────────────────────┐  │
│  │  yvUSD Vault (v3.0.4) │        │  LockedyvUSD                 │  │
│  │  ERC-4626, immutable  │◀───────│  Cooldown wrapper + accountant│  │
│  │  0x696d...6987        │        │  14d cooldown, 5d window     │  │
│  │  TVL ~$9.12M          │        │  ~32% of supply locked       │  │
│  │  deposit() / redeem() │        │  0xAaaF...9040               │  │
│  │  totalAssets()        │        └──────────────────────────────┘  │
│  └──────────┬────────────┘                                           │
│             │ deploys USDC to 16 strategies (2 funded)               │
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  FUNDED STRATEGIES (by allocation)                               ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ MORPHO V1 LENDING (77.1% of TVL)                        │    ││
│  │  │  Morpho Yearn OG USDC Compounder    77.1%  (Morpho V1) │    ││
│  │  │  low-mid risk vault                      │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌──────────────────────────┐  ┌────────────────────────────┐  ││
│  │  │ CROSS-CHAIN (~10%)       │  │ LENDING                    │  ││
│  │  │  Katana yvUSDC Compounder│  │  sUSDS Depositor    7.3%   │  ││
│  │  │    10.1% (AggLayer LxLy) │  │  (blue-chip)               │  ││
│  │  └──────────────────────────┘  └────────────────────────────┘  ││
│  │  Idle/dust (0 or ≤$509 debt): Pendle PT Maxi, Fluid Lender,    ││
│  │  Spark, SKY, InfiniFi looper, syrupUSDC looper, PT stcUSD      ││
│  │  looper, sUSD3, Base (CCTP), sIUSD looper, 3 exited            ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
                                │
                  deposits into underlying protocols / chains
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│                    UNDERLYING PROTOCOLS / VENUES                       │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Morpho V1   │  │  Katana L2 + │  │  Sky/MakerDAO│               │
│  │  OG USDC     │  │  AggLayer    │  │  sUSDS       │               │
│  │  low-mid risk vault│  │  LxLy Bridge │  │  Blue-chip   │               │
│  │  77.1% alloc │  │  10.1% (new) │  │  7.3% alloc  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                       │
│  (Pendle PT, 3Jane USD3, Fluid at dust/idle — not shown)             │
└───────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → yvUSD vault → strategies deploy to
Morpho V1 (low-mid risk vault, 77.1%), Sky (blue-chip, 7.3%), and Katana L2
(via AggLayer LxLy + VaultBridgeToken, 10.1%). Pendle PT and Fluid
lending at dust/idle (<0.5%). CCTP strategies (Arbitrum, Base) idle
at 0 debt. Profits reported by Keeper, locked for 5 days. Optional:
User locks yvUSD in LockedyvUSD for a 10% bonus yield (14d cooldown).
~32.3% of supply locked.
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) — deployed at [block 24,242,692](https://etherscan.io/tx/0x3063e5a82b383d0f5b38e8735dd13c0c9d492c3bfe5dc9d3d23fc829c60f96b0) with `admin = address(0)`.

### Timelock Roles

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)` at construction). No one can grant/revoke roles outside the propose→wait→execute flow |
| **TIMELOCK_ADMIN** | Timelock itself ([`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73)) | Contract | Only the timelock can admin its own roles. Config changes (delay, role grants) must go through the 7-day delay |
| **PROPOSER** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | **Only proposer** — no one else can initiate timelocked operations |
| **EXECUTOR** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | Can execute queued proposals directly |
| **EXECUTOR** | TimelockExecutor (`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`) | Contract | Wrapper contract — delegates execution to its internal executor list (see below) |
| **CANCELLER** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | Can cancel pending proposals |
| **CANCELLER** | Brain ([`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)) | 3-of-8 Safe | Can cancel pending proposals |

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
3. Execute via Daddy, Brain, or the EOA — but the operation is already visible onchain for 7 days

DEFAULT_ADMIN was never granted, so no one can grant themselves PROPOSER or TIMELOCK_ADMIN to skip this flow. The timelock holds TIMELOCK_ADMIN but can only act on it through its own propose→wait→execute cycle.
