# Protocol Risk Assessment: Yearn — yvUSD

- **Assessment Date:** June 8, 2026
- **Token:** yvUSD (USD yVault)
- **Chain:** Ethereum (with cross-chain strategies on Arbitrum, Katana, and Base)
- **Token Address:** [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987)
- **Final Score: 2.4/5.0**

## Overview + Links

yvUSD is a **USDC-denominated cross-chain Yearn V3 vault** (ERC-4626) that deploys deposited USDC into multiple yield strategies across Ethereum mainnet and three remote chains (Arbitrum, Katana, Base). The vault uses **two distinct cross-chain mechanisms** to bridge assets to strategies on remote chains: **Circle's CCTP (Cross-Chain Transfer Protocol)** for Arbitrum and Base, and the **Polygon AggLayer LxLy unified bridge (via a VaultBridgeToken)** for Katana — requiring only strategy contracts on those chains rather than full Yearn V3 infrastructure.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting USDC deposits, issuing yvUSD shares
- **Cross-chain strategies (CCTP):** Use a two-contract pattern — an origin `CCTPStrategy` on Ethereum and a remote `CCTPRemoteStrategy` (ERC-4626 variant) on the destination chain. The origin strategy restricts deposits to a single `DEPOSITER` address (the yvUSD vault itself). When `report()` is called on the destination chain, `_harvestAndReport()` reports new assets back to the origin by queuing a CCTP message — no separate keeper relay required. The origin receives updates via `handleReceiveFinalizedMessage` and tracks remote capital via a `remoteAssets` variable. Currently funds Arbitrum; a Base `CCTPStrategy` ([`0x908244B6ef0e52911a380a5454aEC0743598Fb20`](https://etherscan.io/address/0x908244B6ef0e52911a380a5454aEC0743598Fb20)) is added but holds 0 debt
- **Cross-chain strategy (AggLayer/Katana):** A new `KatanaStrategy` ([`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C)) wraps USDC into a **VaultBridgeToken** ([`0x53E82ABbb12638F09d9e624578ccB666217a765e`](https://etherscan.io/address/0x53E82ABbb12638F09d9e624578ccB666217a765e)) and bridges it to a remote counterpart on **Katana** (AggLayer network ID 20) via the Polygon zkEVM/AggLayer LxLy unified bridge. Reports return through the bridge's `onMessageReceived` callback. This is now the second-largest strategy (27.3% of TVL) and introduces a bridge dependency distinct from CCTP
- **LockedyvUSD:** Companion cooldown wrapper where users lock yvUSD shares for additional yield (10% locker bonus per the APR oracle). Users locking shares gives the vault better guarantees on duration risk, enabling higher-yield strategies without sacrificing atomic liquidity for non-lockers. Cooldown: 14 days (`cooldownDuration` = 1,209,600 s, confirmed onchain), withdraw window: 5 days (configurable). Also serves as the vault's accountant ([`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040), confirmed onchain)
- **Strategies:** 15 active strategies (7 funded, 8 idle at 0 debt) deploying into Morpho (V1 + V2), a remote Yearn yvUSDC vault on Katana, Sky/MakerDAO, Maple syrupUSDC, and 3Jane USD3 Pendle PTs. The portfolio rotated heavily since April — leveraged "looper" strategies fell from ~86% to ~3.5% of TVL, and Maple/InfiniFi concentration was replaced by Morpho lending + cross-chain Katana exposure
- **Yield sources:** Curated Morpho lending vaults (Yearn OG USDC; Sentora-curated Morpho V2 PYUSD/RLUSD markets reached via onchain Dutch auctions), a cross-chain Yearn yvUSDC compounder on Katana, Sky savings (sUSDS), one residual Maple syrupUSDC Morpho looper on Arbitrum, and fixed-rate PT tokens (Pendle)

**Key metrics (June 8, 2026):**

- **TVL:** ~$11,561,917 USDC (`totalAssets()`, confirmed onchain) — **+187% since April**
- **Total Supply:** ~11,412,307 yvUSD
- **Price Per Share:** 1.014423 USDC/yvUSD (`convertToAssets(1e6)`; ~1.44% appreciation since the Jan 19 inception, ~3.8% annualized)
- **Total Debt:** 100% deployed (0 idle)
- **Deposit Limit:** $15,000,000 (raised from $5M; ~77.1% utilized)
- **Profit Max Unlock Time:** 5 days (432,000 s — reduced from 7 days)
- **Net APR:** 4.60% | **APY:** 4.71% ([yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs); gross APR ~5.12%, 0% management/performance fee, 10% locker bonus)

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

### Active Strategies (15 — 7 funded, 8 idle)

Debts and allocations confirmed onchain via `strategies(address).current_debt`; the 15 active strategies sum exactly to `totalDebt()` = 11,561,916.84 USDC. The strategy set is enumerated from all `StrategyChanged` events since deployment (35 events: 23 adds, 12 revokes).

| # | Strategy | Name | Current Debt (USDC) | Allocation | Protocols / Venue |
|---|----------|------|--------------------:|-----------:|-------------------|
| 1 | [`0x0e297dE4005883C757c9F09fdF7cF1363C20e626`](https://etherscan.io/address/0x0e297dE4005883C757c9F09fdF7cF1363C20e626) | Morpho Yearn OG USDC Compounder | 4,043,203 | 34.97% | Morpho V1 (Yearn OG USDC vault `0xF9bd…Ec49`) |
| 2 | [`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C) | Katana yvUSDC Compounder | 3,152,648 | 27.27% | **Katana L2** (remote yvUSDC), AggLayer LxLy bridge, VaultBridgeToken |
| 3 | [`0x3D2467Cbf82332dbFb38997cBc4D2192694D9490`](https://etherscan.io/address/0x3D2467Cbf82332dbFb38997cBc4D2192694D9490) | Morpho V2 Sentora PYUSD Convertor | 1,406,847 | 12.17% | **Morpho V2** (Sentora PYUSD vault `senPYUSDmain`), onchain auction USDC⇄PYUSD |
| 4 | [`0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D`](https://etherscan.io/address/0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D) | USDC To sUSDS Depositor | 1,328,202 | 11.49% | Sky/MakerDAO (sUSDS `0xa393…7fbD`) |
| 5 | [`0xE0be46Cc5aD2F56a7734A99FF403781b9c54C7B2`](https://etherscan.io/address/0xE0be46Cc5aD2F56a7734A99FF403781b9c54C7B2) | Morpho V2 Sentora RLUSD Convertor | 1,025,317 | 8.87% | **Morpho V2** (Sentora RLUSD vault `senRLUSDv2`), onchain auction USDC⇄RLUSD |
| 6 | [`0x2F56D106C6Df739bdbb777C2feE79FFaED88D179`](https://etherscan.io/address/0x2F56D106C6Df739bdbb777C2feE79FFaED88D179) | Arbitrum syrupUSDC/USDC Morpho Looper | 401,180 | 3.47% | Maple syrupUSDC, Morpho, CCTP (Arbitrum) |
| 7 | [`0x4C0e4d3cB62B91afBbf1Fe8e830f98A513c7234b`](https://etherscan.io/address/0x4C0e4d3cB62B91afBbf1Fe8e830f98A513c7234b) | USD3 Pendle PT Maxi | 204,520 | 1.77% | 3Jane USD3, Pendle |
| 8 | [`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF) | USDC Fluid Lender | 0 | 0.0% | Fluid |
| 9 | [`0x9e0A5943dFc1A85B48C191aa7c10487297aA675b`](https://etherscan.io/address/0x9e0A5943dFc1A85B48C191aa7c10487297aA675b) | USDC To Spark USDS Depositor | 0 | 0.0% | Spark, Sky/MakerDAO |
| 10 | [`0x48E66D65006007ef62B50735D070fc30d0242a93`](https://etherscan.io/address/0x48E66D65006007ef62B50735D070fc30d0242a93) | USDC To SKY USDS Depositor | 0 | 0.0% | Sky/MakerDAO |
| 11 | [`0x5f9DBa2805411a8382FDb4E69d4f2Da8EFaF1F89`](https://etherscan.io/address/0x5f9DBa2805411a8382FDb4E69d4f2Da8EFaF1F89) | Infinifi sIUSD Morpho Looper | 0 | 0.0% | InfiniFi siUSD, Morpho |
| 12 | [`0xF28DC8B6DeD7E45F8cf84B9972487C8e1857A442`](https://etherscan.io/address/0xF28DC8B6DeD7E45F8cf84B9972487C8e1857A442) | syrupUSDC/USDC Morpho Looper | 0 | 0.0% | Maple syrupUSDC, Morpho |
| 13 | [`0x7bf1D269bf2CB79E628F51B93763B342fd059D1D`](https://etherscan.io/address/0x7bf1D269bf2CB79E628F51B93763B342fd059D1D) | PT stcUSD Jul 23 Morpho Looper | 0 | 0.0% | Cap stcUSD, Morpho, Pendle/Spectra |
| 14 | [`0xb44EE7869b9D47cd605B05022c8Bd8612EBe53EE`](https://etherscan.io/address/0xb44EE7869b9D47cd605B05022c8Bd8612EBe53EE) | sUSD3 Compounder | 0 | 0.0% | 3Jane sUSD3 |
| 15 | [`0x908244B6ef0e52911a380a5454aEC0743598Fb20`](https://etherscan.io/address/0x908244B6ef0e52911a380a5454aEC0743598Fb20) | Base Yearn Morpho OG USDC | 0 | 0.0% | Base L2, Morpho, CCTP |

**Note:** The portfolio rotated substantially since the April assessment (~66 days). The previously dominant Maple syrupUSDC mainnet looper (43.35%) and InfiniFi sIUSD looper (15.20%) are now at **0 debt**, and leveraged looper exposure collapsed from ~86% to ~3.5% of TVL (only the small Arbitrum syrupUSDC looper remains funded). New funded strategies — Katana yvUSDC Compounder (27.27%), the two Morpho V2 Sentora convertors (21.0% combined), and a refreshed sUSDS depositor — now dominate. Morpho remains the central venue (~56% of TVL on mainnet across V1 OG + V2 Sentora convertors, with another ~3.5% via the Arbitrum looper). Active portfolio management continues; the figures above are a point-in-time snapshot.

### Strategy Protocol Dependencies with Existing Reports

Several underlying protocols have been previously assessed in this repository:

| Protocol | Report Score | yvUSD Allocation |
|----------|-------------|-----------------|
| [Maple syrupUSDC](../report/maple-syrupusdc.md) | **2.33/5** (Low Risk) | 3.47% (Arbitrum looper only; down from 45.8%) |
| [InfiniFi](../report/infinifi.md) | **2.8/5** (Medium Risk) | 0% (idle; was 15.20%) |
| [3Jane USD3](../report/3jane-usd3.md) | **3.5/5** (Medium Risk) | 1.77% (USD3 Pendle PT) |
| [Fluid](../report/fluid.md) | **1.1/5** (Minimal Risk) | 0% (currently inactive) |
| [Cap (stcUSD)](https://curation.yearn.fi/report/cap-stcusd/) | **risk-2** (Low Risk) | 0% (idle PT stcUSD looper) |
| [Spectra](../report/spectra-finance.md) | **2.25/5** (Low Risk) | Used for PT token infrastructure |

Newer underlying venues **without** an existing repository report — **Katana L2 + AggLayer LxLy bridge** (27.3%), **Morpho V2** and the **Sentora** curator (21.0%, holding PYUSD/RLUSD), and the **VaultBridgeToken** wrapper — are assessed inline in this report and flagged as novel-dependency risk.

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
| Morpho (V1) | 25+ audits (Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora) | Blue-chip. Formal verification by Certora. ~35% of TVL (Yearn OG USDC vault) |
| Morpho V2 | Audited (Morpho V2 launched 2025) but **newer than V1**; Sentora is a newer curator | ~21% of TVL via Sentora PYUSD/RLUSD vaults. Newer codebase + curator = elevated novelty |
| Pendle | 6+ audits (Ackee, Dedaub, ChainSecurity, Spearbit, Code4rena) | Well-established |
| Circle CCTP | ChainSecurity (V1 2023, V2 March 2025, V2 update April 2025, Gateway July 2025) | Trust-minimized bridge (Arbitrum, Base) |
| Polygon AggLayer (LxLy) + VaultBridgeToken | AggLayer/zkEVM bridge audited; VaultBridgeToken wrapper is **newer infrastructure** | New ~27% Katana exposure. Katana is a young (2025) L2; bridge + wrapper not yet covered by an existing repo report — flagged as novel |
| Sky/MakerDAO | Extensively audited across many years | Blue-chip |
| Spark | Inherits MakerDAO audit coverage | Blue-chip (idle) |
| Cap (stcUSD) | 5+ audits (Electisec, Spearbit, Trail of Bits, Zellic, Certora) | Assessed internally as [risk-2](https://curation.yearn.fi/report/cap-stcusd/). Idle (0 debt) |

### Bug Bounty

- **Immunefi:** Active bug bounty for Yearn Finance. Max payout: **$200,000** (Critical). Scope includes V3 vaults (`VaultV3.vy`, `VaultFactory.vy`).
  - Link: https://immunefi.com/bounty/yearnfinance/
- **Sherlock:** Also listed: https://audits.sherlock.xyz/bug-bounties/30
- **Safe Harbor:** Not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvUSD system is moderately complex, and complexity **increased** since April with two new strategy archetypes:

- **15 active strategies** (7 funded) spanning up to 4 chains (Ethereum + Arbitrum + Katana + Base)
- **Two cross-chain mechanisms:** Circle CCTP (Arbitrum, Base) and the Polygon AggLayer LxLy bridge + VaultBridgeToken (Katana). Both report remote assets back to the origin asynchronously and track them via a `remoteAssets`-style variable; the Katana position reads 0 locally (`valueOfVault()`) because all capital lives on Katana between bridge reports
- **Auction-based convertor strategies (new):** the Morpho V2 Sentora PYUSD/RLUSD convertors swap USDC into a yield-bearing want token via onchain Dutch auctions (CoW-style, governance-only kick) and value the position with a management-set Morpho oracle plus a `reportBuffer` haircut — a valuation surface not present in the April snapshot
- **Residual looper strategy** using Morpho for leveraged yield (now only the Arbitrum syrupUSDC looper, 3.5%)
- **PT token strategies** with maturity dates requiring rollover (1.77%)
- **Custom accountant** (LockedyvUSD) combining cooldown/locking mechanics with fee management
- **Multiple protocol dependencies** (Morpho V1 & V2, Sky, Maple, 3Jane, Pendle, Sentora, AggLayer, CCTP)
- **V3 vault itself is non-upgradeable** (immutable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** January 19, 2026 (block 24271831) — **~140 days** in production
- **TVL:** ~$11.56M USDC — **+187% since April** ($4.03M). Deposit limit raised to $15M (~77.1% utilized)
- **PPS trend:** 1.000000 → 1.006961 (April) → 1.014423 (now) — ~1.44% appreciation since inception, ~3.8% annualized; no PPS decrease observed
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** High turnover — 35 `StrategyChanged` events (23 adds, 12 revokes). Since April the vault rotated out of leveraged Maple/InfiniFi loopers (now 0 debt) into Morpho lending (V1 OG + V2 Sentora), a cross-chain Katana yvUSDC compounder, and Sky sUSDS. Leveraged looper exposure fell from ~86% to ~3.5%
- **New cross-chain venues:** Katana L2 (AggLayer LxLy bridge, ~27% of TVL) went live as a funded strategy; a Base CCTP strategy was added (0 debt)
- **Governance:** Unchanged since the April migration — standard Yearn RoleManager (`0xb3bd…9a41`, confirmed onchain), 7-day timelock (`getMinDelay()` = 604,800 s), Daddy bitmask `0x3FF6`, no pending `future_role_manager`, vault not shut down
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~25 months). No V3 vault exploits

**Yearn protocol TVL:** ~$153M total across all chains (DeFi Llama, June 2026: Ethereum ~$120M, Katana ~$30M, Optimism/Base/others ~$4M). Down from ~$240M in April; a meaningful share has migrated to Katana.

## Funds Management

yvUSD deploys deposited USDC across 15 active strategies (7 funded) with 100% capital utilization (0 idle). The funded book now falls into five categories:

### Strategy Categories

**1. Curated Morpho Lending — mainnet (56.0% of TVL)**

- Morpho Yearn OG USDC Compounder (34.97%) — deposits USDC into the Yearn-curated **Morpho V1** "Yearn OG USDC" vault (`ymvOG-USDC`, [`0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49`](https://etherscan.io/address/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49)). Unleveraged lending compounder
- Morpho V2 Sentora PYUSD Convertor (12.17%) — converts USDC→PYUSD via onchain Dutch auction and holds **Morpho V2** Sentora `senPYUSDmain` shares ([`0xb576765fB15505433aF24FEe2c0325895C559FB2`](https://etherscan.io/address/0xb576765fB15505433aF24FEe2c0325895C559FB2))
- Morpho V2 Sentora RLUSD Convertor (8.87%) — same pattern with RLUSD (`senRLUSDv2`, [`0x6dC58a0FdfC8D694e571DC59B9A52EEEa780E6bf`](https://etherscan.io/address/0x6dC58a0FdfC8D694e571DC59B9A52EEEa780E6bf))

**Lending/convertor risk:** Morpho V1 is blue-chip; **Morpho V2 and the Sentora curator are newer and unproven by comparison.** The convertors add execution and valuation risk: USDC⇄stablecoin swaps clear through onchain Dutch auctions (governance-only kick), and the position is valued via a management-set Morpho oracle with a `reportBuffer` haircut. A mispriced oracle, a stuck/under-filled auction, or PYUSD/RLUSD depeg would impair the reported value and exit.

**2. Cross-Chain Compounder — Katana (27.27% of TVL)**

- Katana yvUSDC Compounder (27.27%) — wraps USDC into a VaultBridgeToken and bridges to **Katana L2** via the Polygon AggLayer LxLy unified bridge, where a remote counterpart deposits into a Yearn yvUSDC vault. Now the **second-largest single position**

**Cross-chain risk:** Adds a brand-new dependency stack — a young (2025) L2, the AggLayer/LxLy bridge, the VaultBridgeToken wrapper, and a remote Yearn vault — none of which have an existing repository report. Withdrawals require a bridge round-trip; the local `valueOfVault()` reads 0 between bridge reports, so ~27% of TVL resides on a remote chain and is known to the origin only via on-chain bridge messages.

**3. Sky Lending (11.49% of TVL)**

- USDC To sUSDS Depositor (11.49%) — deposits into Sky/MakerDAO Savings USDS (sUSDS, [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD))

**Lending risk:** Standard DeFi lending risk. Sky is blue-chip with extensive audit coverage and deep liquidity.

**4. Residual Looper (3.47% of TVL)**

- Arbitrum syrupUSDC/USDC Morpho Looper (3.47%, cross-chain via CCTP) — the **only remaining funded looper**

**Looper risk:** Leveraged position borrowing USDC on Morpho against syrupUSDC collateral. If syrupUSDC depegs or the Morpho market becomes illiquid, the position may face liquidation or inability to unwind. **Materially de-risked vs April** — looper exposure fell from ~86% to ~3.5%, so a looper cascade can no longer threaten most of the vault.

**5. Fixed-Rate PT (1.77% of TVL)**

- USD3 Pendle PT Maxi (1.77%) — holds Pendle Principal Tokens backed by 3Jane USD3

**PT risk:** PT tokens have fixed maturity dates. Before maturity, exit requires selling on AMM (Pendle) at potentially unfavorable rates. At maturity, PT is manually rolled over via a `rollover()` call — this process cannot steal user funds.

**Idle strategies (8, at 0 debt):** USDC Fluid Lender, USDC→Spark USDS, USDC→SKY USDS, Infinifi sIUSD Morpho Looper, syrupUSDC/USDC Morpho Looper (mainnet), PT stcUSD Jul 23 Morpho Looper, sUSD3 Compounder, and Base Yearn Morpho OG USDC (CCTP). These remain endorsed and can be re-funded by the Debt Allocator without a new timelock proposal.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSD (ERC-4626 standard). Subject to the $15M deposit limit (`deposit_limit` confirmed onchain; `deposit_limit_module` = `address(0)`, so the hard cap is the direct limit)
- **Withdrawals:** ERC-4626 standard. Users can redeem yvUSD for USDC. However:
  - **100% of funds are deployed** (0 idle) — withdrawals require unwinding strategy positions
  - **Cross-chain strategies** require bridging back (CCTP attestation for Arbitrum; AggLayer claim for Katana, ~27% of TVL)
  - **Convertor strategies** can only service redemptions from loose USDC (`availableWithdrawLimit` returns `balanceOfAsset()`); freeing the ~21% held as PYUSD/RLUSD requires an auction to convert back
  - **PT strategies** may have liquidity constraints before maturity
  - **Looper strategy** (3.5%) requires deleveraging, which may take multiple transactions
- **LockedyvUSD:** Optional lock wrapper with 14-day cooldown + 5-day withdrawal window. Yields a 10% locker bonus but restricts exit timing
- **No fees on deposits/withdrawals** — the APR oracle currently reports 0 management/performance fee; the locker bonus is funded from extra yield via the accountant

### Collateralization

- **100% onchain USDC backing** — all deposits are USDC, all strategy positions ultimately track back to USDC value
- **Collateral quality varies by strategy:**
  - Blue-chip lending (Morpho V1 OG 34.97%, Sky sUSDS 11.49%): ~46.5% of TVL
  - Newer-but-reputable (Morpho V2 / Sentora PYUSD+RLUSD): 21.0% of TVL
  - Cross-chain (Katana yvUSDC via AggLayer): 27.27% of TVL — new
  - Low-risk (Maple syrupUSDC 2.33/5, Arbitrum looper): 3.47% of TVL — down from 45.8%
  - Medium-risk (3Jane USD3 3.5/5): 1.77% of TVL — down from 16.4% combined with InfiniFi (now 0%)
- **Leverage:** Looper allocation **fell from ~86% to ~3.5%** — the single largest risk-profile change since April, sharply reducing liquidation-cascade exposure
- **New exposures replacing leverage:** cross-chain (Katana, 27%) and newer-protocol (Morpho V2/Sentora, 21%) risk — a quality trade-off rather than an unambiguous improvement

### Provability

- **yvUSD exchange rate:** Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` is onchain. The vault's `totalAssets()` is the sum of all strategy debts (verified to reconcile exactly with the per-strategy `current_debt`)
- **Convertor valuation:** The ~21% held via Morpho V2 convertors is valued through a management-set Morpho oracle (`asset = want * price / 1e36`) minus a `reportBuffer`. This is verifiable but introduces an oracle/parameter dependency the April book did not have
- **Cross-chain lag:** For cross-chain strategies, the origin tracks remote capital via bridge-delivered reports (CCTP for Arbitrum/Base; AggLayer `onMessageReceived` for Katana). Between report cycles, the value can be stale, and ~30.7% of TVL (Katana 27.27% + Arbitrum 3.47%) resides on remote chains. The Katana strategy's local `valueOfVault()` reads 0 — its value exists only in the last on-chain bridged report until the next harvest
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over **5 days** (`profitMaxUnlockTime` = 432,000 s; reduced from 7 days). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSD for USDC via ERC-4626 `withdraw()`/`redeem()`. Subject to strategy liquidity
- **Zero idle funds:** Currently 100% of vault assets are deployed to strategies. Withdrawals require unwinding positions
- **Strategy withdrawal constraints (by current allocation):**
  - **Liquid (~46%):** Morpho V1 OG lending (35%) and Sky sUSDS (11.5%) are generally available for prompt withdrawal
  - **Convertor (~21%):** Morpho V2 convertors expose only loose USDC on demand (`availableWithdrawLimit` = `balanceOfAsset()`); converting PYUSD/RLUSD back to USDC requires an onchain Dutch auction to clear, so this slice is not instantly redeemable
  - **Cross-chain (~31%):** Katana (27%) requires an AggLayer/LxLy bridge round-trip and claim; Arbitrum (3.5%) requires CCTP bridging back (attestation latency)
  - **Looper (3.5%):** Must deleverage on Morpho (may require multiple keeper transactions) — far smaller drag than April
  - **PT (1.8%):** Before maturity, must sell PTs on AMM (potential slippage); at maturity, manual `rollover()`
- **DEX liquidity:** No known DEX liquidity pools for yvUSD. The vault is an ERC-4626 token, not traded on DEXes
- **LockedyvUSD:** 14-day cooldown + 5-day withdrawal window. Shares in cooldown cannot be transferred. **~23.1% of yvUSD supply** is locked here (2,637,598 yvUSD of 11.41M; down sharply from ~70.6% in April) — a smaller committed-duration buffer, meaning more supply can request liquidity on demand
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **Deposit limit:** $15M cap (raised from $5M; ~77.1% utilized) — limits concentration and still indicates a maturing-but-early vault
- **Net:** Looper-deleveraging friction is largely gone, but it has been replaced by **auction-conversion (~21%) and cross-chain bridge (~31%) exit latency** — over half of TVL is not instantly redeemable, against a smaller locked-supply buffer

## Centralization & Control Risks

### Governance

Since the initial March 2026 assessment, the yvUSD vault has **completed its governance setup** by migrating to the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)). This is the same governance framework used by yvUSDC-1 and 37+ other Yearn vaults — a significant maturation from the initial direct-Safe governance used during the vault's launch phase.

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

- **Exchange rate (PPS):** Calculated onchain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless onchain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over **5 days** (reduced from 7). Losses are immediate
- **Debt allocation:** Automated via Debt Allocator contract, with manual override available to DEBT_MANAGER role holders (Daddy, Brain, Security)
- **Convertor valuation (new):** ~21% of TVL (Morpho V2 convertors) is valued via a **management-set Morpho oracle** plus a `reportBuffer` haircut, with USDC⇄want swaps clearing through governance-kicked onchain auctions. This is verifiable but adds a parameterized valuation surface that did not exist in April
- **Cross-chain accounting:** Remote `_harvestAndReport()` queues a report back to the origin — via CCTP for Arbitrum/Base and via the AggLayer LxLy `onMessageReceived` callback for Katana. No separate keeper relay required. Can be stale between report cycles; ~31% of TVL resides on remote chains and is tracked via on-chain bridge messages back to the origin
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Allocation | Notes |
|-----------|-------------|-----------|-------|
| **Morpho (V1)** | Critical | ~35% | Blue-chip. 25+ audits, formal verification by Certora. Yearn OG USDC curated vault (unleveraged) |
| **Morpho V2 + Sentora curator** | Critical | ~21% | **Newer** than V1; Sentora is a newer curator. PYUSD + RLUSD markets reached via onchain auctions. Elevated novelty |
| **Katana L2 + AggLayer (LxLy) + VaultBridgeToken** | Critical | ~27% | **New, unproven stack** — young (2025) L2, AggLayer unified bridge, VaultBridgeToken wrapper, remote yvUSDC vault. No existing repo report |
| **Sky/MakerDAO** | High | 11.5% | Blue-chip, extensively audited. sUSDS savings yield |
| **Maple syrupUSDC** | Medium | 3.5% | Report score 2.33/5. Now only the Arbitrum looper — down from 45.8% |
| **Pendle** | Medium | 1.8% (PT) | $2B+ TVL, 6+ audits. PT infrastructure for 3Jane USD3 fixed-rate yield |
| **Circle CCTP** | Medium | Cross-chain (Arbitrum, Base) | Audited by ChainSecurity (V1 + V2). Trust assumption: Circle attestation (same trust as holding USDC) |
| **3Jane USD3** | Low | 1.8% | Report score 3.5/5. Medium-risk credit-based lending, held via Pendle PT |
| **PYUSD / RLUSD** | Low | held inside Morpho V2 convertors | Stablecoin exposure introduced by the convertors; depeg would impair convertor value |
| **InfiniFi / Cap / Fluid / Spark** | Low | 0% (idle) | Endorsed but unfunded strategies; can be re-funded by the Debt Allocator |

**Dependency concentration:** The concentration profile **inverted** since April. The previous Maple (45.8%) and InfiniFi/3Jane (16.4% medium-risk) concentrations are gone; the vault is now anchored on **Morpho** (~56% across V1 OG + V2 Sentora convertors on mainnet, plus the Arbitrum looper) and a **cross-chain Katana** position (~27%). This trades single-protocol medium-risk concentration for (a) heavy reliance on Morpho as critical infrastructure and (b) two genuinely new, unproven dependency stacks — Morpho V2/Sentora and the Katana/AggLayer bridge — that together carry ~48% of TVL. Blue-chip exposure (Morpho V1 + Sky) is ~46.5%. The net effect is lower leverage/looper risk but higher cross-chain and newer-protocol novelty risk.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The Yearn global multisig has 9 named signers including Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others
- **yvUSD governance:** Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations
- **Documentation:** Comprehensive Yearn V3 documentation. yvUSD-specific docs are now published on the official Yearn docs site, including cross-chain strategy architecture, LockedyvUSD mechanics, and a dedicated APR API service ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi))
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
- **Cross-chain strategy accounting** — monitor remote-asset staleness for both Katana (AggLayer/LxLy, ~27%) and Arbitrum (CCTP, ~3.5%); the Katana strategy's local `valueOfVault()` reads 0, so verify against actual Katana-side positions
- **Convertor health (new)** — monitor the Morpho V2 Sentora convertors: oracle (`oracle()`) integrity, `reportBuffer`, PYUSD/RLUSD peg, and auction fill/settlement
- **Looper strategy health** — monitor the Arbitrum syrupUSDC Morpho market for proximity to liquidation (now small)
- **Underlying protocol health** — monitor Morpho (V1 & V2), Sky, the Sentora curator, Maple, and the Katana/AggLayer bridge for incidents

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

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~25 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Standard Yearn governance with 7-day timelock:** Confirmed unchanged onchain — standard RoleManager, 7-day TimelockController (`getMinDelay()` = 604,800 s) for critical operations. Daddy/ySafe (6-of-9, publicly known signers) is the sole proposer/executor; the timelock is self-governed (holds TIMELOCK_ADMIN_ROLE). No pending `future_role_manager`
- **Multi-layer security:** Daddy (governance), Brain (operations), Security (emergency), and automated bots (Keeper, Debt Allocator) with differentiated responsibilities. No single point of failure
- **USDC-denominated:** Stablecoin backing eliminates price volatility risk on the underlying asset
- **Sharply reduced leverage:** Looper exposure collapsed from ~86% to ~3.5% of TVL. The April "looper liquidation cascade" critical risk is largely resolved; a residual looper now sits at only 3.5%
- **Lower medium-risk and single-protocol concentration:** Maple fell 45.8% → 3.5%; InfiniFi 15.2% → 0%. ~46.5% is now in blue-chip lending (Morpho V1 OG + Sky)
- **Healthy growth:** TVL +187% to ~$11.56M; PPS up monotonically to 1.014423; deposit limit raised to $15M
- **No EOA role concentration:** Deployer EOA confirmed at 0 vault roles. All vault operations require multisig or contract authorization
- **Rigorous strategy review process:** 12-metric risk scoring framework with ySec security review. All strategies evaluated across testing coverage, complexity, risk exposure, centralization, and protocol integration dimensions
- **Active monitoring infrastructure:** Hourly large-flow alerts, daily endorsed-vault checks, and timelock monitoring across 6 chains via the automation scheduler + Telegram alerts

### Key Risks

- **Newer, unproven dependency stacks (~48% of TVL):** Morpho V2 + the Sentora curator (~21%) and the Katana L2 + AggLayer/LxLy bridge + VaultBridgeToken stack (~27%) are materially newer than the blue-chip venues they replaced, and neither has an existing repository report
- **Cross-chain concentration:** ~31% of TVL now resides on remote chains (Katana 27.3% + Arbitrum 3.5%) across two distinct bridges (AggLayer + CCTP) — up from ~2.5% in April
- **Convertor execution & valuation surface:** ~21% of TVL is valued via a management-set Morpho oracle with a `reportBuffer` haircut and is exited via onchain Dutch auctions plus a PYUSD/RLUSD leg — more moving parts than direct ERC-4626 lending
- **No external product-specific audit:** The CCTPStrategy, the new KatanaStrategy (AggLayer), the BaseConvertor (auctions), and the LockedyvUSD wrapper have no dedicated external audit. All follow Yearn's internal 12-metric framework / ySec review, but external third-party review of these specific components is absent
- **Still maturing:** ~140 days in production, ~$11.56M TVL, no stress test of the new cross-chain/auction machinery

### Critical Risks

- **Cross-chain & bridge risk on the Katana position (~27%):** The largest non-mainnet exposure depends on a young L2, the AggLayer/LxLy unified bridge, a VaultBridgeToken wrapper, and a remote Yearn vault — value that reads 0 locally and is known only from the last bridged report. A bridge fault, remote-vault loss, or stuck claim would impair a quarter of the vault and delay redemptions
- **Cross-chain accounting lag:** Remote positions update only when `_harvestAndReport()` delivers a report (CCTP for Arbitrum/Base; AggLayer for Katana). Between cycles, the vault's `totalAssets()` may not reflect real-time remote changes for ~31% of TVL
- **Residual looper liquidation:** The Arbitrum syrupUSDC Morpho looper (3.5%) is still a leveraged position; a syrupUSDC depeg or Morpho-market illiquidity could cause a loss — but now capped at a small share of TVL

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by Statemind, ChainSecurity, and yAcademy. ✅ PASS (framework audited; individual strategies lack dedicated audit)
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions onchain verifiable. ✅ PASS
- [x] **Total centralization** — Standard Yearn governance: Daddy/ySafe 6-of-9 multisig with publicly named signers, 7-day timelock on critical operations, Brain 3-of-8 for operations, Security 4-of-7 for emergency. No EOA vault roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). CCTPStrategy, **new KatanaStrategy (AggLayer), and BaseConvertor (auctions)**: internal ySec review + 12-metric framework, no dedicated external audit |
| Bug bounty | $200K on Immunefi (active) + Sherlock bounty |
| Production history | **~140 days** (Jan 19, 2026). V3 framework: ~25 months |
| TVL | **~$11.56M** (+187% since April). Deposit limit: $15M (~77.1% utilized) |
| Security incidents | None on V3; no PPS decrease observed |
| Strategy review | Rigorous 12-metric framework with ySec security review, testing coverage requirements, complexity scoring, and risk exposure assessment |

**Score: 3.0/5** — The underlying V3 framework has solid audit coverage from 3 reputable firms and a clean ~25-month track record, and the vault has grown +187% to ~$11.56M with no incidents and monotonic PPS. Offsetting this, two new strategy archetypes now run at scale without dedicated external audits — the KatanaStrategy (AggLayer/LxLy bridge) and the BaseConvertor (auction-based Morpho V2 access) — and yvUSD is still ~140 days old, below the 6-month production threshold. The improved age/TVL and the added novel-component surface roughly offset; score unchanged at 3.0.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades). Strategies can be added/removed |
| Multisig | 6-of-9 Daddy/ySafe (proposer/executor on timelock) + 3-of-8 Brain (operations) + 4-of-7 Security (emergency) |
| Timelock | **7-day TimelockController** for critical operations (add strategy, change accountant, set max debt). Self-governed: timelock holds TIMELOCK_ADMIN_ROLE, so config changes (delay, roles) must go through 7-day delay |
| Privileged roles | Well-distributed: Daddy (6/9, nearly all roles), Brain (3/8, operational), Security (4/7, emergency), Keeper + Debt Allocator (bots). No EOA roles (deployer confirmed at bitmask 0x0) |
| Yearn oversight | **Full integration** — same governance framework as yvUSDC-1 and 37+ other Yearn vaults. Standard Yearn RoleManager |

**Governance Score: 1.0/5** — Major improvement from March assessment (was 2.5). Immutable vault contracts (no proxy upgrades). 7-day timelock on critical operations (strategy additions, accountant changes), with Daddy (6-of-9, named signers) as sole proposer. No EOA vault roles (deployer confirmed at bitmask 0x0). Well-distributed roles across Daddy, Brain (3/8), Security (4/7), and automated bots. Per rubric: immutable contracts + 7+ day timelock + multisig above 3/5 threshold + no EOA roles = score 1. The deployer EOA retains Fee Splitter governance only (low-impact, fee distribution not fund custody).

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits/withdrawals onchain |
| Strategy reporting | Programmatic via Keeper (yHaaSRelayer) and Debt Allocator |
| Debt allocation | Automated via Debt Allocator, with manual override by DEBT_MANAGER holders (Daddy, Brain, Security) |
| Convertor valuation | ~21% (Morpho V2 convertors) valued via a management-set Morpho oracle + `reportBuffer`; USDC⇄want via governance-kicked onchain auctions |
| Cross-chain | Programmatic — remote `_harvestAndReport()` reports back via CCTP (Arbitrum/Base) and AggLayer (Katana). ~31% of TVL on remote chains, tracked via on-chain bridge messages; stale between cycles |

**Programmability Score: 1.5/5** — All funds remain onchain (Ethereum, Arbitrum, Katana) and the PPS is calculated algorithmically via ERC-4626; deposits/withdrawals are permissionless and reporting is automated. New surfaces appeared — the convertors' management-set oracle valuation and the larger, two-bridge cross-chain accounting (Katana reads 0 locally between reports) — but these are still verifiable onchain and do not let governance arbitrarily move funds. Score held at 1.5, with the added valuation/cross-chain lag reflected in Provability (Category 3B) to avoid double-counting.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Many (Morpho V1 & V2, Sky, Maple, 3Jane/Pendle, Sentora, AggLayer, CCTP) |
| Criticality | Morpho (critical, ~56% across V1 OG + V2 convertors); Katana/AggLayer (critical, ~27%); Sky (~11.5%) |
| Dependency quality | Mixed: ~46.5% blue-chip (Morpho V1 OG, Sky) vs ~48% in newer/unproven stacks (Morpho V2 + Sentora ~21%, Katana/AggLayer ~27%) |
| Cross-chain | Two bridges now — Circle CCTP (Arbitrum/Base) + Polygon AggLayer LxLy + VaultBridgeToken (Katana, new) |

**Dependencies Score: 3.5/5** — The concentration profile inverted: the April Maple (45.8%) and medium-risk InfiniFi/3Jane (16.4%) concentrations are gone, replaced by heavy reliance on Morpho as critical infrastructure (~56%) plus a large cross-chain Katana position (~27%). Single-protocol medium-risk concentration improved, but two genuinely new, unproven dependency stacks (Morpho V2/Sentora and the Katana/AggLayer bridge) now carry ~48% of TVL, and cross-chain bridge surface doubled. These risks roughly offset the concentration improvement; score unchanged at 3.5.

**Centralization Score = (1.0 + 1.5 + 3.5) / 3 = 2.0**

**Score: 2.0/5** — Unchanged from April. Governance is confirmed unchanged onchain (standard RoleManager, 7-day timelock, Daddy 6/9 sole proposer, no EOA vault roles, immutable vault). All funds remain onchain and programmatic. The dependency mix shifted character — lower single-protocol/medium-risk concentration, but higher cross-chain and newer-protocol novelty — netting flat. Remaining concerns: Morpho concentration (~56%), the new Katana/AggLayer and Morpho V2/Sentora exposures, and the Fee Splitter EOA governance.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-backed, deployed into DeFi yield strategies |
| Collateral quality | ~46.5% blue-chip (Morpho V1 OG 35%, Sky 11.5%); ~21% Morpho V2/Sentora; ~27% cross-chain Katana; ~3.5% Maple looper; ~1.8% 3Jane PT |
| Leverage | **Looper exposure fell from ~86% to ~3.5%** — major de-risking |
| Verifiability | ERC-4626; mainnet positions direct, ~21% via oracle-valued convertors, ~27% on a remote chain (Katana) |

**Collateralization Score: 2.5/5** — Onchain USDC backing is fully verifiable. The dramatic leverage reduction (looper 86% → 3.5%) and the removal of Maple/InfiniFi concentration are clear positives for collateral safety. These are offset by new lower-pedigree exposures replacing the leverage: ~27% cross-chain into a young Katana L2 and ~21% into newer Morpho V2/Sentora markets reached via auctions. The de-risking and the added novelty roughly cancel; score held at 2.5.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Mainnet positions verifiable onchain; ~27% (Katana) only via last bridged report (`valueOfVault()` reads 0 locally) |
| Exchange rate | ERC-4626, programmatic, anyone can verify |
| Convertor valuation | ~21% valued via a management-set Morpho oracle + `reportBuffer` haircut — verifiable but parameter-dependent |
| Cross-chain lag | ~31% of TVL on remote chains across two bridges, known to origin via on-chain bridge messages; stale between reports |
| Reporting | Automated via keepers with **5-day** profit unlock |

**Provability Score: 2.0/5** — Worse than April (was 1.5). The base vault and mainnet positions remain fully verifiable via ERC-4626, but two new factors weaken real-time provability: ~31% of TVL now resides on remote chains (Katana, Arbitrum) and is known to the origin only via on-chain bridge messages — the Katana strategy's local value reads 0 between reports. Another ~21% is valued through a governance-set Morpho oracle plus a `reportBuffer` rather than a direct ERC-4626 read. All positions remain on-chain and reconcilable; the weaker score reflects cross-chain bridge trust and governance-parameterized valuation, not off-chain data dependence.

**Funds Management Score = (2.5 + 2.0) / 2 = 2.25**

**Score: 2.25/5** — Roughly flat vs April (was 2.0). The strong leverage de-risking keeps collateralization at 2.5, but provability slips from 1.5 to 2.0 as cross-chain (~31%, two bridges) and oracle-valued convertor (~21%) exposure grows. All positions remain on-chain and reconcilable; the change reflects added cross-chain bridge trust assumptions and governance-parameterized valuation surface, not off-chain data dependence.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption for USDC |
| Liquidity depth | 0 idle — 100% deployed. ~46% in promptly-liquid lending (Morpho V1 OG, Sky) |
| Convertor exit | ~21% (Morpho V2 convertors) only frees loose USDC on demand; PYUSD/RLUSD must clear via auction |
| Cross-chain | ~31% needs a bridge round-trip — Katana (AggLayer, ~27%) + Arbitrum (CCTP, ~3.5%) |
| Looper / PT | Looper deleverage friction now small (3.5%); PT ~1.8% |
| Same-value asset | USDC-denominated — no price impact risk |
| Deposit limit | $15M cap (~77.1% utilized) |
| Locked supply | ~23.1% of yvUSD locked in LockedyvUSD (down from ~70.6%) — smaller duration buffer |

**Score: 3.0/5** — USDC-denominated vault eliminates price divergence risk, and looper-deleverage friction is largely gone. But the constraints shifted rather than disappeared: ~21% can only be freed via onchain auctions and ~31% requires a bridge round-trip (including a young AggLayer/Katana path), so **over half of TVL is not instantly redeemable**, now against a smaller locked-supply buffer (23% vs 71%). ~46% sits in promptly-liquid lending, and there is still no DEX liquidity as an alternative exit. The net liquidity profile is comparable to April; same-value asset adjustment applied. Score unchanged at 3.0.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020 |
| Vault management | Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations |
| Documentation | V3 docs comprehensive. yvUSD-specific docs published on official Yearn docs site (cross-chain architecture, LockedyvUSD mechanics, dedicated APR API) |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Yearn has demonstrated capability across historical events. V3 untested |
| Monitoring | Active hourly large-flow alerts, daily endorsed-vault checks, timelock monitoring across 6 chains |

**Score: 1.5/5** — Yearn's brand, track record, and known team provide high confidence. The vault now uses the standard Yearn governance framework (Daddy, Brain, Security, Keeper, Debt Allocator) — the same pattern across 37+ vaults. Comprehensive V3 documentation, active Immunefi + Sherlock bounties, demonstrated incident response capability, and active monitoring infrastructure (hourly alerts, endorsed-vault checks, timelock monitoring via the automation scheduler + Telegram). yvUSD-specific documentation is on the official Yearn docs site, covering cross-chain strategy architecture, LockedyvUSD mechanics, and a dedicated APR API service. Yearn BORG legal entity (Cayman foundation via YIP-87). Score unchanged from March.

### Final Score Calculation


| Category | Score | Weight | Weighted | Change from April |
|----------|-------|--------|----------|-------------------|
| Audits & Historical | 3.0 | 20% | 0.60 | — (older + larger, but new unaudited components) |
| Centralization & Control | 2.0 | 30% | 0.60 | — (governance unchanged; dependency mix shifted, net flat) |
| Funds Management | 2.25 | 30% | 0.675 | ↑ from 2.0 (provability 1.5→2.0 on cross-chain + convertor valuation) |
| Liquidity Risk | 3.0 | 15% | 0.45 | — (looper friction → auction/bridge friction) |
| Operational Risk | 1.5 | 5% | 0.075 | — |
| **Final Score** | | | **2.4/5.0** | ↑ from 2.3 |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.4/5.0) — Approved with standard monitoring**

**Score change rationale:** The score ticks up slightly from 2.3 to 2.4 (still Low Risk). The portfolio transformed since April rather than simply improving:
1. **De-risking (positive):** Leveraged looper exposure collapsed from ~86% to ~3.5% of TVL, and Maple/InfiniFi concentration (62% combined in April) fell to ~3.5%/0%. This largely resolves the prior "looper liquidation cascade" critical risk.
2. **New novelty/cross-chain risk (negative):** ~48% of TVL moved into newer, unproven stacks — Morpho V2 + the Sentora curator (~21%, accessed via auctions) and a brand-new Katana L2 + AggLayer/LxLy bridge (~27%). Cross-chain exposure rose from ~2.5% to ~31% across two bridges.
3. **Net scoring effect:** Funds Management rose from 2.0 to 2.25 (provability 1.5→2.0) as ~31% of TVL now resides on remote chains (tracked via on-chain bridge messages) and ~21% is oracle-valued via convertors. Governance (confirmed unchanged onchain) and the other categories held flat. The leverage de-risking and the cross-chain/novelty increase roughly offset, leaving the vault firmly in the Low Risk tier.

---

## Reassessment Triggers

- **Time-based:** Reassess in ~2 months (Aug 2026), or at the 6-month production milestone (Jul 2026)
- **TVL-based:** Reassess if TVL exceeds $20M (approaches the $15M cap), or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, or underlying protocol incident — especially **Morpho (V1 or V2), the AggLayer/Katana bridge, the Sentora curator, or Sky**
- **Governance-based:** Reassess if the timelock delay is modified, Safe compositions change (signer/threshold), or the Fee Splitter governance is transferred from the deployer EOA to the multisig
- **Cross-chain-based:** Reassess if cross-chain exposure exceeds ~40% of TVL, if a new remote chain/bridge is funded (e.g. the Base CCTP strategy activates), or if any bridge experiences downtime or a fault
- **Convertor-based:** Reassess if the Morpho V2 convertors' oracle is changed, if PYUSD/RLUSD depegs, or if auction settlement shows persistent slippage beyond `maxSlippageBps`
- **Audit-based:** Reassess if the CCTPStrategy, KatanaStrategy, or BaseConvertor receive dedicated external audits (should improve the Audits score)
- **Strategy-based:** Reassess if Morpho concentration exceeds ~65%, if the Katana position exceeds ~35% of TVL, or if looper leverage re-expands materially above its current ~3.5%

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
│  │  TVL ~$11.56M         │        │  ~23% of supply locked       │  │
│  │  deposit() / redeem() │        │  0xAaaF...9040               │  │
│  │  totalAssets()        │        └──────────────────────────────┘  │
│  └──────────┬────────────┘                                           │
│             │ deploys USDC to 15 strategies (7 funded)               │
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  FUNDED STRATEGIES (by allocation)                               ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ MORPHO LENDING (~56% of TVL)                            │    ││
│  │  │  Morpho Yearn OG USDC Compounder    34.97%  (Morpho V1)│    ││
│  │  │  Morpho V2 Sentora PYUSD Convertor  12.17%  (V2+auction)│   ││
│  │  │  Morpho V2 Sentora RLUSD Convertor   8.87%  (V2+auction)│   ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌──────────────────────────┐  ┌────────────────────────────┐  ││
│  │  │ CROSS-CHAIN (~31%)       │  │ LENDING / LOOPER / PT      │  ││
│  │  │  Katana yvUSDC Compounder│  │  sUSDS Depositor   11.49%  │  ││
│  │  │    27.27% (AggLayer LxLy)│  │  Arb syrupUSDC      3.47%  │  ││
│  │  │  Arb syrupUSDC (CCTP)    │  │   looper (Maple, CCTP)     │  ││
│  │  │    3.47%                 │  │  USD3 Pendle PT     1.77%  │  ││
│  │  └──────────────────────────┘  └────────────────────────────┘  ││
│  │  Idle (0 debt): Fluid, Spark, SKY, InfiniFi looper, syrupUSDC   ││
│  │  mainnet looper, PT stcUSD looper, sUSD3, Base (CCTP)           ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
                                │
                  deposits into underlying protocols / chains
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│                    UNDERLYING PROTOCOLS / VENUES                       │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Morpho V1   │  │  Morpho V2   │  │  Sky/MakerDAO│               │
│  │  OG USDC     │  │  + Sentora   │  │  sUSDS       │               │
│  │  Blue-chip   │  │  PYUSD/RLUSD │  │  Blue-chip   │               │
│  │  ~35% alloc  │  │  ~21% (new)  │  │  11.5% alloc │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ Katana L2 +  │  │  Maple       │  │  3Jane USD3  │               │
│  │ AggLayer LxLy│  │  syrupUSDC   │  │  + Pendle PT │               │
│  │ + vbToken    │  │  (Arb looper)│  │  1.77%       │               │
│  │ ~27% (new)   │  │  3.47%       │  │              │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└───────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → yvUSD vault → strategies deploy to
Morpho V1/V2, Sky, Maple, Pendle, and remote chains. Cross-chain bridges:
Circle CCTP (Arbitrum, Base) and Polygon AggLayer LxLy + VaultBridgeToken
(Katana, ~27%). Profits reported by Keeper, locked for 5 days. Optional:
User locks yvUSD in LockedyvUSD for a 10% bonus yield (14d cooldown).
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
