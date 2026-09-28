# Protocol Risk Assessment: Yearn — yvUSDT-1

- **Assessment Date:** May 11, 2026 (Updated: September 28, 2026)
- **Token:** yvUSDT-1 (USDT-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa)
- **Final Score: 1.25/5.0**

## Overview + Links

yvUSDT-1 is a **USDT-denominated Yearn V3 vault** (ERC-4626) on Ethereum mainnet. The vault holds **~$5.74M USDT** and is **100% deployed** at the snapshot — `totalIdle = 0`, `totalDebt = totalAssets`. The queue holds **two strategies** — a **Yearn-operated MetaMorpho vault (ymv-USDT)**, added directly as a strategy, and a **Spark USDT Lender**. Five earlier strategies — Spark USDT Lender (old), Morpho Gauntlet USDT Prime, Morpho Steakhouse USDT, USDT Fluid Lender, and Aave V3 USDT Lender — are revoked (`activation = 0`).

The MetaMorpho vault (added May 24, 2026) is governed by Yearn Security as owner, with a 3-day timelock and a 2-of-3 curator Safe; it lends USDT against wstETH, WBTC, XAUt, and sUSDS collateral in four Morpho Blue markets. The Spark USDT Lender (added June 26, 2026) supplies directly to the Spark Lend USDT reserve.

The [Debt Allocator](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671), triggered through the yHaaS keeper relayer, **rebalances debt between the two strategies continuously** — 282 `DebtUpdated` events between July 13 and September 28, 2026. Either strategy can hold anywhere from 0% to nearly 100% of debt at a given moment; the time-weighted split over that window was **~44% MetaMorpho / ~56% Spark**. At the snapshot the split is ~72/28.

The PPS is **1.093836** (~9.38% cumulative since deployment, ~4.2% annualized over ~26.2 months).

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDT deposits, issuing yvUSDT-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Strategy queue (2 strategies, both USDT-native):**
  - MetaMorpho Vault (ymv-USDT) ([`0x0963232eB842BAF53E8e517691f81745C1F228a0`](https://etherscan.io/address/0x0963232eB842BAF53E8e517691f81745C1F228a0)) — 72.12% of debt at snapshot (~44% time-weighted since July 13), Morpho MetaMorpho vault
  - Spark USDT Lender ([`0x176Caf15f1793fc16898458E0ba295ec6523E9E2`](https://etherscan.io/address/0x176Caf15f1793fc16898458E0ba295ec6523E9E2)) — 27.88% of debt at snapshot (~56% time-weighted since July 13), Spark Lend
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (September 28, 2026, snapshot at block [26078415](https://etherscan.io/block/26078415)):**

- **TVL:** 5,743,266.94 USDT (100% deployed)
- **Total Supply:** 5,250,570.53 yvUSDT-1
- **Price Per Share:** 1.093836 USDT/yvUSDT-1 (~9.38% cumulative appreciation over ~26.2 months, ~4.2% annualized; ~3.4% annualized since July 13, 2026)
- **Total Debt:** 5,743,266.94 USDT (100% of TVL)
- **Total Idle:** 0
- **Debt distribution (snapshot; rebalanced continuously):**
  - MetaMorpho Vault (ymv-USDT): 4,142,044.12 USDT (72.12%)
  - Spark USDT Lender: 1,601,222.82 USDT (27.88%)
- **Per-strategy max debt:** 50,000,000 USDT each
- **Deposit Limit:** 50,000,000 USDT
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee at the yvUSDT-1 level; the MetaMorpho vault charges a further 5% performance fee on its interest (recipient: Yearn Security Safe)

**Sky exposure note:** Spark Lend is a **Sky sub-DAO** (governed by Sky), so the Spark USDT Lender allocation (27.88% at snapshot, ~56% time-weighted, up to ~94% at times) carries a **Sky-governance dependency** on the Spark admin keys. The MetaMorpho vault also lends ~100K USDT (~1.7% of yvUSDT-1) against sUSDS collateral, a small indirect USDS-peg exposure mitigated by Morpho liquidations. yvUSDT-1 is materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1 (which have direct USDS exposure), but it is **not fully Sky-independent**.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [hgETH reassessment (rsETH bridge exploit context)](./kerneldao-hgeth.md)

## Contract Addresses

### Core yvUSDT-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvUSDT-1 Vault | [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa) | Yearn V3 Vault (v3.0.2), Vyper minimal proxy |
| Underlying asset (USDT) | [`0xdAC17F958D2ee523a2206206994597C13D831ec7`](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) | Tether USD |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Shared Yearn Accountant (0% mgmt, 10% perf) |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Immutable lending core used by ymv-USDT |
| Spark Lend Pool | [`0xC13e21B648A5Ee794902342038FF3aDAB66BE987`](https://etherscan.io/address/0xC13e21B648A5Ee794902342038FF3aDAB66BE987) | Aave-v3-fork pool; USDT aToken [`spUSDT`](https://etherscan.io/address/0xe7dF13b8e3d6740fe17CBE928C7334243d86c92f) |
| MetaMorpho Curator | [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) | 2-of-3 Safe |

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

### Strategies (2 in default queue, both with debt)

| # | Strategy | Name | Added | Current Debt (USDT) | Allocation |
|---|----------|------|-------|--------------------:|-----------:|
| 1 | [`0x0963232eB842BAF53E8e517691f81745C1F228a0`](https://etherscan.io/address/0x0963232eB842BAF53E8e517691f81745C1F228a0) | MetaMorpho Vault (ymv-USDT) | May 24, 2026 | 4,142,044.12 | 72.12% |
| 2 | [`0x176Caf15f1793fc16898458E0ba295ec6523E9E2`](https://etherscan.io/address/0x176Caf15f1793fc16898458E0ba295ec6523E9E2) | Spark USDT Lender (TokenizedStrategy v3.0.4) | June 26, 2026 | 1,601,222.82 | 27.88% |

Both strategies have `max_debt = 50,000,000 USDT`. The Debt Allocator shifts debt between them several times per day, so the snapshot split is not stable; the time-weighted split from July 13 to September 28, 2026 was ~44% MetaMorpho / ~56% Spark.

The Spark USDT Lender strategy's management is Brain, its emergency admin is Security, its keeper is the yHaaS relayer, and its own performance fee is 0%. yvUSDT-1 holds 100% of its shares.

### MetaMorpho Vault (ymv-USDT) Market Allocation

yvUSDT-1 holds ~99.98% of ymv-USDT shares. Of its 4,146,877.31 USDT `totalAssets()`:

| Morpho Market | Collateral | LLTV | Supply Cap | ymv-USDT Supply | % of ymv-USDT | % of yvUSDT-1 | Market Utilization |
|---------------|------------|-----:|-----------:|----------------:|--------------:|--------------:|-------------------:|
| [`0xe7e9694b…87d2`](https://app.morpho.org/ethereum/market/0xe7e9694b754c4d4f7e21faf7223f6fa71abaeb10296a4c43a54a7977149687d2/) | [wstETH](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | 86% | 50M | 2,750,138 | 66.3% | 47.9% | 90.5% |
| [`0xa921ef34…df99`](https://app.morpho.org/ethereum/market/0xa921ef34e2fc7a27ccc50ae7e4b154e16c9799d3387076c421423ef52ac4df99/) | [WBTC](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | 86% | 50M | 1,094,710 | 26.4% | 19.1% | 90.5% |
| [`0xb7843fe7…0877`](https://app.morpho.org/ethereum/market/0xb7843fe78e7e7fd3106a1b939645367967d1f986c2e45edb8932ad1896450877/) | [XAUt](https://etherscan.io/address/0x68749665FF8D2d112Fa859AA293F07A622782F38) | 77% | 2M | 201,611 | 4.9% | 3.5% | 90.4% |
| [`0x3274643d…cf0b`](https://app.morpho.org/ethereum/market/0x3274643db77a064abd3bc851de77556a4ad2e2f502f4f0c80845fa8f909ecf0b/) | [sUSDS](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | 96.5% | 50M | 100,416 | 2.4% | 1.7% | 90.5% |
| [`0x45671fb8…5bca`](https://app.morpho.org/ethereum/market/0x45671fb8d5dea1c4fbca0b8548ad742f6643300eeb8dbd34ad64a658b2b05bca/) | [cbBTC](https://etherscan.io/address/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf) | 86% | 50M | 0 | 0% | 0% | 75.0% |
| [`0x5c6aaf2d…02d1`](https://app.morpho.org/ethereum/market/0x5c6aaf2dfecf6b2d60ef4ee8192b83c53ade0b35cb8e7f763a83a30db10502d1/) | none (idle market) | — | 1B | 0 | 0% | 0% | 0% |

The supply queue contains the WBTC market and the idle market; the withdraw queue contains all six. All markets are USDT-loan, isolated Morpho Blue markets with the standard Adaptive Curve IRM ([`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)). Bad debt in any one market is socialized only across that market's suppliers.

**Previously queued, now revoked (`activation = 0` at block 26078415):**

- Spark USDT Lender (old) ([`0xED48069a2b9982B4eec646CBfA7b81d181f9400B`](https://etherscan.io/address/0xED48069a2b9982B4eec646CBfA7b81d181f9400B))
- Morpho Gauntlet USDT Prime Compounder ([`0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F`](https://etherscan.io/address/0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F))
- Morpho Steakhouse USDT Compounder ([`0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5`](https://etherscan.io/address/0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5))
- USDT Fluid Lender ([`0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72`](https://etherscan.io/address/0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72))
- Aave V3 USDT Lender ([`0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2`](https://etherscan.io/address/0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2))

**Sky-governance exposure note:** Spark Lend is a Sky sub-DAO. The Spark USDT Lender held 27.88% of yvUSDT-1's debt at the snapshot and ~56% time-weighted since July 13, 2026; that share is administered through Sky / Spark governance. This is a **Sky-governance dependency**. The only USDS-peg exposure is the ~1.7% of yvUSDT-1 lent against sUSDS collateral through ymv-USDT. yvUSDT-1 is materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1, but **not fully Sky-independent**.

### Strategy Protocol Dependencies (current allocation)

| Protocol | Strategy | Allocation | Notes |
|----------|----------|-----------:|-------|
| **Morpho** | MetaMorpho Vault (ymv-USDT) | 72.12% (snapshot) / ~44% (time-weighted) | Yearn-operated MetaMorpho vault; owner Yearn Security (4-of-7), 3-day timelock, 2-of-3 curator Safe, guardian Daddy (6-of-9); lends against wstETH, WBTC, XAUt, and sUSDS collateral |
| **Spark** | Spark USDT Lender | 27.88% (snapshot) / ~56% (time-weighted) | Sky sub-DAO; audited stack (ChainSecurity, Cantina); strategy added June 26, 2026 |

The debt is **split across two ecosystems** (Morpho, Spark), with the Debt Allocator moving funds between them continuously. Both have multi-year USDT track records with no significant principal-loss events. Because the allocator can move nearly all debt to one venue, either venue can briefly hold nearly 100% of funds. The Morpho leg adds collateral and oracle risk from four isolated markets, dominated by wstETH (~48% of yvUSDT-1 at the snapshot) and WBTC (~19%).

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Underlying Protocol Audits (active and queued strategies)

| Underlying | Audits | Notes |
|------------|--------|-------|
| **Morpho** | 25+ audits across Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora; formal verification | Blue-chip lending protocol; MetaMorpho vault source verified on Etherscan |
| **Spark (USDT lender)** | ChainSecurity, Cantina (Spark Lend / SparkDAO) | Sub-DAO of Sky; new SparkLender strategy source verified on Etherscan |

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvUSDT-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Morpho (Cantina):** active, **$2,500,000** max payout (Critical). https://cantina.xyz/bounties/35a5f0a1-2ffd-432c-8f3b-77d169add8c3
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

**Low.** All funded strategies are **direct USDT lend / compound** with no conversion hops:

- MetaMorpho Vault → direct USDT deposit to a Yearn-operated Morpho MetaMorpho vault, which lends into four isolated collateralized Morpho Blue markets
- Spark USDT Lender → direct supply to Spark Lend USDT market
- No leverage, no looping, no cross-chain at the vault or strategy level
- Standard ERC-4626 throughout
- Vault is immutable

## Historical Track Record

- **Vault deployed:** July 23, 2024 (deployment [tx](https://etherscan.io/tx/0x05681fd5be0e925bb720450418d20eda99bb22adc72be3d702de70368d7cd3ea)) — **~26.2 months** in production
- **TVL:** 5,743,266.94 USDT (~$5.74M) — well within the $50M deposit limit. TVL was ~$7.2M in mid-July 2026 and fell to ~$5.8M by late August, mostly from a single 1,238,358 USDT withdrawal on August 25, 2026 ([tx](https://etherscan.io/tx/0x0c8c44d7c8c8ab116dea914774d284a3ab8964c66ab0dbc55d7eea2d96c2cd09))
- **PPS trend:** 1.000000 → 1.093836 (~9.38% cumulative return, ~4.2% annualized). The PPS has not decreased
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy history:** seven strategies have been queued historically. Five have been revoked. Between May and July 2026, all three strategies then active (Spark USDT Lender, Morpho Gauntlet USDT Prime, Morpho Steakhouse USDT) were revoked and replaced by two new strategies: a Yearn-operated MetaMorpho vault (ymv-USDT, added May 24, 2026) and a new Spark USDT Lender instance (added June 26, 2026). No strategies were added or revoked between July 13 and September 28, 2026
- **Yearn V3 track record:** V3 framework live since May 2024 (~28 months). No V3 vault exploits

**Yearn protocol TVL:** ~$204M total ([DeFiLlama](https://defillama.com/protocol/yearn-finance), September 28, 2026).

**Underlying USDT lending market track records:** Spark Lend and Morpho both have multi-year track records on USDT markets with no significant principal-loss events.

## Funds Management

yvUSDT-1 is **100% deployed** at the snapshot, split ~72/28 between a Yearn-operated MetaMorpho vault (ymv-USDT) and a Spark USDT Lender. The Debt Allocator rebalances between them continuously.

### Current State (snapshot)

- **Total Assets:** 5,743,266.94 USDT
- **Total Debt:** 5,743,266.94 USDT (100% deployed)
- **Total Idle:** 0
- **Capital utilization:** 100%

ERC-4626 redemptions settle by unwinding strategy positions in queue order (MetaMorpho first, then Spark). They are atomic for the user as long as the underlying lending markets have available liquidity (see [Liquidity Risk](#liquidity-risk)).

### Active Strategies

| Strategy | Allocation | Mechanic | Risk profile |
|----------|-----------:|----------|-------------|
| **MetaMorpho Vault (ymv-USDT)** | 72.12% (snapshot) | USDT deposit to Yearn-operated MetaMorpho vault on Morpho; lends against wstETH / WBTC / XAUt / sUSDS | Governed by Yearn Security (4-of-7), 3-day timelock, 2-of-3 curator Safe; 5% MetaMorpho performance fee |
| **Spark USDT Lender** | 27.88% (snapshot) | Direct supply to Spark Lend USDT market | Sky sub-DAO, ChainSecurity / Cantina audits; added June 2026 |

Both strategies are simple lend / compound patterns with no leverage, no conversion hops, and no cross-chain. The MetaMorpho vault adds a governance layer (owner, curator, guardian, timelock) and exposes that leg to the collateral, oracle, and liquidation mechanics of its Morpho markets.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 50M USDT deposit limit
- **Withdrawals:** ERC-4626. Strategy unwind through Spark + Morpho USDT markets (both deep)
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% USDT backing** — held through MetaMorpho vault on Morpho and Spark Lend USDT market positions
- **Collateral quality:** USDT is the largest stablecoin by market cap. Centrally-issued by Tether
- **No leverage**
- **Redemption:** atomic for normal sizes; very large redemptions depend on MetaMorpho vault liquidity and Spark market utilization at the moment of withdrawal

The collateral quality is the union of the Yearn-operated MetaMorpho vault and Spark Lend USDT market quality. Both are blue-chip USDT venues with multi-year clean track records. The MetaMorpho leg's borrowers post wstETH (~66% of ymv-USDT), WBTC (~26%), XAUt (~5%), and sUSDS (~2%) as collateral at 77–96.5% LLTV.

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads the underlying lending position balance on-chain in both Spark and Morpho
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 10 days

## Liquidity Risk

**Exit pipeline:** ERC-4626 `withdraw` → strategy `withdraw` → underlying lending market withdrawal (MetaMorpho vault on Morpho or Spark Lend USDT market).

- **Underlying liquidity (snapshot):**
  - **Spark Lend USDT:** ~$325.1M supplied, ~$15.9M free USDT in the [spUSDT aToken](https://etherscan.io/address/0xe7dF13b8e3d6740fe17CBE928C7334243d86c92f) (~95.1% utilization). The strategy's ~$1.60M position is ~10% of free liquidity
  - **MetaMorpho markets:** the four funded markets run at ~90.5% utilization. Free liquidity in each covers ymv-USDT's full position: wstETH ~$12.2M free vs $2.75M, WBTC ~$8.1M vs $1.09M, sUSDS ~$1.16M vs $0.10M, XAUt ~$0.27M vs $0.20M. The XAUt market has the thinnest margin
- **Same-asset:** USDT-denominated share token — no price-divergence risk
- **No DEX liquidity needed** — exits via the lending protocol's own redemption mechanics
- **No withdrawal queue or cooldown** — atomic redemption for normal sizes (MetaMorpho vault has a 3-day timelock on parameter changes but redemptions are atomic)
- **Deposit limit:** 50M USDT cap vs $5.74M TVL (room for +771%)

The two-ecosystem split means a liquidity squeeze in one venue can be partially absorbed by the other, subject to queue order, the user's withdraw size, and the current allocator split.

## Centralization & Control Risks

### Governance

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY (`roles = 14706`) |
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

- **PPS:** ERC-4626, fully algorithmic
- **Vault operations:** permissionless deposit / withdraw on-chain
- **Strategy reporting:** automated via keeper
- **Debt allocation:** Debt Allocator (automated, triggered through the yHaaS keeper relayer) + Brain (manual); rebalances several times per day
- **Off-chain inputs:** none

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **USDT (Tether)** | Critical (underlying asset) | Centrally issued; relies on Tether's operational and reserve integrity |
| **Spark Lend** | High (27.88% snapshot, ~56% time-weighted, up to ~94%) | Sky sub-DAO; Spark admin keys live under Sky governance |
| **Morpho** | High (72.12% snapshot, ~44% time-weighted, up to 100%) | Immutable Morpho Blue markets; MetaMorpho vault governed by Yearn Security with 3-day timelock + 2-of-3 curator Safe |
| **Morpho market collateral / oracles** | Medium, via ymv-USDT | wstETH (~48% of yvUSDT-1), WBTC (~19%), XAUt (~3.5%), sUSDS (~1.7%) collateral; bad debt from failed liquidations or oracle faults is borne by market suppliers |
| **Sky governance** | Indirect via Spark (and sUSDS collateral) | Spark Lend admin sits under Sky; not an independent venue |
| **MetaMorpho curator** | Indirect, internal | 2-of-3 Safe; can lower market caps immediately, while cap increases and new markets pass the 3-day timelock |

**Dependency quality:** the deployed mix is **two blue-chip ecosystems** (Morpho + Spark), with allocation moved continuously by the Debt Allocator. Over July 13 – September 28, 2026, ~56% of debt sat behind Sky-governed infrastructure on a time-weighted basis. The vault is materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1 (which carry direct USDS exposure) but **not fully Sky-independent**. The Morpho leg is a Yearn-operated MetaMorpho vault, which internalizes curator risk but adds the vault's own governance surface (owner, curator, guardian, timelock) and market-collateral risk.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded
- **Operational history:**
  - Late April 2026: 100%-idle posture, precautionary deallocation following the rsETH bridge exploit (per Yearn team, unverified attribution)
  - May 2026: Redeployment into Spark + Morpho Gauntlet (~46/54 split); Fluid and Aave V3 strategies revoked
  - May–July 2026: Full strategy-queue replacement — all three remaining strategies revoked, replaced by a Yearn-operated MetaMorpho vault (added May 24, 2026) and a new Spark USDT Lender (added June 26, 2026). Rationale for the full replacement rather than incremental changes has not been independently verified
  - July–September 2026: stable two-strategy queue; 282 `DebtUpdated` events as the Debt Allocator rebalanced between the two strategies (roughly 140 paired rebalances)
  - The sequence demonstrates active debt management capability: the operations multisigs can pull, revoke, and redeploy across entirely new strategy sets

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvUSDT-1 is in the monitored vault list:**

- **Large flow alerts** ([`protocols/yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py)) — runs **hourly via the automation scheduler**
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`) — daily
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`)

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDT-1 Vault | [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| Each active USDT strategy | (2 active addresses above) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| MetaMorpho vault (ymv-USDT) | [`0x0963232eB842BAF53E8e517691f81745C1F228a0`](https://etherscan.io/address/0x0963232eB842BAF53E8e517691f81745C1F228a0) | `totalAssets()`, `owner()`, `curator()`, `guardian()`, `timelock()`, `supplyQueue()` market list |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **Allocation drift** — the Debt Allocator moves debt between venues several times per day (72/28 Morpho/Spark at snapshot, ~44/56 time-weighted). Track the rolling time-weighted share; a sustained >75% share in one venue should trigger reassessment of the dependency subscore
- **MetaMorpho market changes** — new markets, cap increases (`SubmitCap` / `SetCap`), or supply-queue changes on ymv-USDT; utilization of the XAUt market (thinnest free liquidity)
- **Strategy `current_debt` changes** — `DebtUpdated` events on the vault
- **Strategy additions / removals** — `StrategyChanged` events (new strategies pass through 7-day timelock; further revocations are operational signals)
- **MetaMorpho vault governance changes** — `owner()`, `curator()`, `guardian()`, or timelock changes on the ymv-USDT vault
- **Emergency actions** (`Shutdown`)
- **ySafe / Brain / Security signer or threshold changes**
- **PPS decrease** — should only increase outside of explicit loss events
- **Sky / Spark governance events** — Spark Lend admin actions can affect the Spark share of yvUSDT-1's debt (~56% time-weighted)
- **Spark USDT utilization** — ~95.1% at snapshot; sustained full utilization would slow exits from the Spark leg
- **USDT-specific:** Tether-side issues (peg deviation, attestation reports, blacklisting events)

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio — currently 100% deployed | Daily |
| `withdrawQueue(i)`, `config(id)` / Morpho `market(id)` | ymv-USDT / Morpho Blue | Market list, caps, and utilization | Daily |
| USDT `balanceOf(spUSDT)` | USDT / Spark | Spark free USDT liquidity | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time, activation (revocations show `activation = 0`) | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition (currently 2 strategies) | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | Timelock | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~28 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Two-ecosystem split:** Morpho and Spark Lend, ~44/56 time-weighted — both blue-chip USDT venues with multi-year clean track records
- **Minimal USDS-peg exposure:** yvUSDT-1 holds USDT, not USDS; the only USDS-linked exposure is ~1.7% lent against sUSDS collateral in a Morpho market
- **Active monitoring** via Yearn's monitoring-scripts repo
- **No leverage. No cross-chain. No conversion hops** in the active strategies
- **Established track record:** ~26.2 months in production, ~9.38% cumulative return, zero incidents

### Key Risks

- **Concentration in two venues only:** Morpho (MetaMorpho) and Spark Lender. The Debt Allocator can move nearly all debt to either one (MetaMorpho reached 100% and Spark ~94% at points between July and September 2026). Less diversified than the prior 5-strategy queue
- **Sky-governance dependency on ~56% of debt (time-weighted):** Spark Lend is a Sky sub-DAO, so Sky governance / Spark admin keys can affect over half of yvUSDT-1's funds on average. Less coupled than the USDS-denominated vaults but **not Sky-independent**
- **MetaMorpho governance and collateral surface:** the ymv-USDT MetaMorpho vault adds a governance layer — Yearn Security (4-of-7) as owner, a 2-of-3 curator Safe, Daddy (6-of-9) as guardian, and a 3-day timelock. Its USDT is lent against wstETH, WBTC, XAUt, and sUSDS, so oracle faults or failed liquidations in those markets can cause bad debt for the Morpho leg
- **High underlying utilization:** Spark USDT ~95% and Morpho markets ~90.5% utilized at snapshot. Free liquidity still covers yvUSDT-1's positions, but a utilization spike would delay exits
- **Full strategy-queue replacement:** all five previously-queued strategies were revoked and replaced by two new ones between May and July 2026. The rationale for the full replacement rather than incremental changes has not been independently verified
- **USDT-specific:** centrally-issued stablecoin with periodic concerns about Tether's reserve composition; this risk is inherent to the underlying asset and not specific to yvUSDT-1

### Critical Risks

- None identified. All gates pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.
- **Score reflects the September 28, 2026 snapshot — 100% deployed across MetaMorpho (Morpho) + Spark, dynamically rebalanced (72/28 at snapshot, ~44/56 time-weighted since July 13).**

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Active underlying protocols (Spark, Morpho) extensively audited. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + on-chain Spark/Morpho positions verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Active underlying protocols (Spark, Morpho): blue-chip with extensive audit coverage |
| Bug bounty | $200K (Yearn Immunefi) |
| Production history | **~26.2 months** (July 23, 2024). V3 framework: ~28 months |
| TVL | **$5.74M** USDT (100% deployed). Deposit limit: 50M |
| Security incidents | None on V3, none on the active underlying protocols |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — strong audit coverage, ~26.2 months clean production, no incidents.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** (EIP-1167 minimal proxy) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | 7-day delay on `ADD_STRATEGY` and `ACCOUNTANT`. Self-governed |
| Privileged roles | Well-distributed; no role concentration |
| EOA risk | None |

**Governance Score: 1.0 / 5** — textbook score-1 governance.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals |
| Strategy reporting | Programmatic via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |

**Programmability Score: 1.0 / 5** — fully programmatic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (active) | 2 funded ecosystems (Morpho via MetaMorpho vault, Spark Lend) |
| Criticality | USDT (Tether) + MetaMorpho/Morpho (72.12% snapshot, ~44% time-weighted) + Spark Lend (27.88% snapshot, ~56% time-weighted, Sky-governed) |
| Concentration | Allocator moves debt continuously; either venue can hold nearly all funds. ~56% time-weighted behind Sky-governed infrastructure (Spark). The Morpho leg carries its own governance surface and wstETH / WBTC / XAUt / sUSDS collateral risk |
| Quality | Top-tier on both venues; concentration is the main concern |

**Dependencies Score: 2.5 / 5** — two blue-chip ecosystems (Morpho, Spark Lend), but on average over half of debt sits behind Sky-governance infrastructure (Spark Lend → Sky sub-DAO → Sky governance), and the allocator can move nearly all funds to either venue. The Morpho leg adds MetaMorpho governance (owner, curator, guardian, timelock) and market-collateral exposure. The rubric "1–2 blue-chip dependencies" = 2 captures the count; the +0.5 reflects the single-point-of-control concentration from the Sky-governance share and the absence of a fixed allocation split.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDT (held via MetaMorpho vault on Morpho and Spark Lend USDT positions); Morpho-leg loans overcollateralized by wstETH / WBTC / XAUt / sUSDS |
| Collateral quality | USDT is the largest stablecoin by market cap; centrally issued by Tether |
| Leverage | None |
| Verifiability | Vault and strategy positions fully on-chain |

**Score: 1.0 / 5** — top-tier on-chain backing. USDT centralization is a known characteristic of the underlying asset, not a vault-specific issue.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Vault and strategy USDT positions fully on-chain |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers, 10-day profit unlock |
| Third-party verification | Underlying USDT positions trivially on-chain |

**Score: 1.0 / 5** — excellent on-chain provability.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 → strategy unwind through MetaMorpho vault and Spark USDT market |
| Liquidity depth | Spark: ~$15.9M free vs ~$1.60M position (~95.1% utilization). Morpho: every funded market's free liquidity exceeds ymv-USDT's position (~90.5% utilization); XAUt market has the thinnest margin (~$0.27M free vs ~$0.20M) |
| Large holder impact | Very large redemptions depend on MetaMorpho vault / Spark utilization at withdraw time |
| Same-value asset | USDT-denominated |
| Withdrawal restrictions | None |

**Score: 1.0 / 5** — both active venues are deep blue-chip USDT lending markets, and free liquidity covers yvUSDT-1's full position in each. The two-venue split provides cross-venue resilience. Re-evaluate if either venue's utilization rises to 100% for an extended period or if the time-weighted allocation stays above ~75% in a single venue.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. Demonstrated active debt management — the Brain/Debt Allocator pulled all debt, revoked five strategies across two phases, and redeployed into a new two-strategy configuration (Yearn-operated MetaMorpho vault + new Spark USDT Lender) between April and July 2026 |
| Monitoring | Active hourly alerts, vault in monitored list |

**Score: 1.0 / 5** — top-tier operational maturity. The deallocate / redeploy / full-strategy-replacement sequence demonstrates incident-response and debt-management capability.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.25 / 5.0** |

1.250 is recorded as 1.25 (two decimals, rounded down). The Centralization score (1.5) reflects the Sky-governance concentration on ~56% of debt (time-weighted) and the allocator's ability to concentrate funds in one venue; otherwise the vault is a clean two-venue blue-chip stablecoin deployment.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | **Approved, high confidence** |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.25 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (March 2027) or annually
- **TVL-based:** Reassess if TVL exceeds $25M or changes by ±50%
- **rsETH-related context:** if any new strategy is added that takes direct or indirect rsETH exposure, full re-review of the dependency subscore
- **Strategy posture:**
  - if a USDS-denominated strategy is later added to yvUSDT-1, the partial Sky-coupling becomes a peg dependency — re-evaluate dependency and concentration scores against the broader risk-1 stable stack
  - if either venue's time-weighted allocation stays above ~75% of deployed funds, re-evaluate the dependency / liquidity scores
  - any change to the MetaMorpho vault's governance parameters (owner, curator, guardian, timelock) should trigger reassessment
  - a new ymv-USDT market, a collateral type outside wstETH / WBTC / cbBTC / XAUt / sUSDS, or a large cap increase should trigger review of the Morpho-leg collateral risk
  - if any further strategy revocations or replacements occur, investigate the rationale
- **Underlying-protocol incidents:** any major incident at Spark Lend or Morpho USDT markets — full re-review
- **USDT-specific:**
  - sustained Tether peg deviation
  - Tether reserve attestation issues
  - significant blacklisting / freezing events
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvUSDT-1 (v3.0.2)   │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  EIP-1167 min proxy   │                                          │
│  │  0x310B…FAaa          │                                          │
│  │                       │                                          │
│  │  $5.74M USDT TVL      │                                          │
│  │  100% deployed        │                                          │
│  │  totalDebt = $5.74M   │                                          │
│  │  totalIdle = 0        │                                          │
│  └───────────┬───────────┘                                          │
│              │                                                       │
│      ┌───────┴────────┐                                             │
│      ▼                ▼                                             │
│  MetaMorpho Vault  Spark USDT Lender                                │
│  (ymv-USDT)        1.60M (27.88%)                                   │
│  4.14M (72.12%)    Sky sub-DAO                                      │
│  Morpho protocol   (split rebalanced continuously)                  │
│   wstETH 66% / WBTC 26% / XAUt 5% / sUSDS 2%                        │
│                                                                      │
│  MetaMorpho governance:                                              │
│   - Owner: Yearn Security (4-of-7)                                  │
│   - Curator: 2-of-3 Safe                                            │
│   - Guardian: Daddy (6-of-9)                                        │
│   - Timelock: 3 days                                                │
│                                                                      │
│  All previously-queued strategies revoked (activation = 0):          │
│   - Spark USDT Lender (old, 0xED48…9400B)                           │
│   - Morpho Gauntlet USDT Prime (0x6D29…849F)                        │
│   - Morpho Steakhouse USDT (0x0a4e…45c5)                            │
│   - USDT Fluid Lender (0x4Bd0…8A72)                                 │
│   - Aave V3 USDT Lender (0x2799…8Cb2)                               │
└──────────────────────────────────────────────────────────────────────┘

The vault is split across two ecosystems, ~44/56 Morpho/Spark time-weighted
since July 13, 2026. The Spark share sits behind Sky-governed infrastructure.
The Morpho leg is through a Yearn-operated MetaMorpho vault with its own
governance surface (owner, curator, guardian, timelock).
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

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [May 11, 2026](https://github.com/yearn/risk-score/pull/148) | 1.3 | Initial assessment; ~46/54 Spark/Morpho Gauntlet split |
| [July 13, 2026](https://github.com/yearn/risk-score/pull/315) | 1.25 | Strategy-queue replacement: MetaMorpho vault + new Spark USDT Lender; ~44/56 split; Sky dependency increased to ~56% |
| September 28, 2026 | 1.25 | Refresh: TVL $5.74M; unchanged queue and governance; continuous allocator rebalancing documented; MetaMorpho market collateral mapped |
