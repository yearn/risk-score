# Protocol Risk Assessment: Yearn — yvUSD

- **Assessment Date:** March 13, 2026 (Updated: October 12, 2026)
- **Token:** yvUSD (USD yVault)
- **Chain:** Ethereum (with cross-chain strategies on Arbitrum, Katana, and Base)
- **Token Address:** [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987)
- **Final Score: 2.46/5.0**

## Overview + Links

yvUSD is a **USDC-denominated cross-chain Yearn V3 vault** (ERC-4626) that deploys deposited USDC into multiple yield strategies across Ethereum mainnet and three remote chains (Arbitrum, Katana, Base). The vault uses **two distinct cross-chain mechanisms** to bridge assets to strategies on remote chains: **Circle's CCTP (Cross-Chain Transfer Protocol)** for Arbitrum and Base, and the **Polygon AggLayer LxLy unified bridge (via a VaultBridgeToken)** for Katana — requiring only strategy contracts on those chains rather than full Yearn V3 infrastructure.

All onchain figures in this report were read at **block 26,177,300** (October 12, 2026) via `cast` against Ethereum mainnet, and independently corroborated against the [yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs) strategy snapshot. Morpho V1 OG market allocations come from the [Morpho API](https://app.morpho.org/ethereum/vault/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49/) on the same date.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting USDC deposits, issuing yvUSD shares
- **Cross-chain strategies (CCTP):** Use a two-contract pattern — an origin `CCTPStrategy` on Ethereum and a remote `CCTPRemoteStrategy` (ERC-4626 variant) on the destination chain. The origin strategy restricts deposits to a single `DEPOSITER` address (the yvUSD vault itself). When `report()` is called on the destination chain, `_harvestAndReport()` reports new assets back to the origin by queuing a CCTP message — no separate keeper relay required. The origin receives updates via `handleReceiveFinalizedMessage` and tracks remote capital via a `remoteAssets` variable. The Arbitrum and Base CCTP strategies are active but currently hold 0 debt
- **Cross-chain strategy (AggLayer/Katana):** A `KatanaStrategy` ([`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C)) wraps USDC into a **VaultBridgeToken** ([`0x53E82ABbb12638F09d9e624578ccB666217a765e`](https://etherscan.io/address/0x53E82ABbb12638F09d9e624578ccB666217a765e)) and bridges it to a remote counterpart on **Katana** (AggLayer network ID 20) via the Polygon zkEVM/AggLayer LxLy unified bridge. Reports return through the bridge's `onMessageReceived` callback. This is the only active cross-chain position with material debt (8.0% of TVL)
- **Leveraged looper:** A `stcUSD/USDC Pawn Broker Looper` ([`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986)) posts **stcUSD** (Cap protocol) as collateral into the `stcUSD/USDC Pawn Broker Market` and borrows USDC against it, recycling proceeds to build a levered position. Running at **7.79x leverage** and **87.16% LTV** against a **91.5%** liquidation threshold at the snapshot
- **Pendle PT strategies:** Two `Pendle PT Maxi` strategies hold fixed-maturity Principal Tokens — `PT-sUSDS-26NOV2026` and `PT-USD3-17DEC2026`. Both have `openWithdrawals() = false` and report `availableWithdrawLimit() = 0`, so the vault **cannot withdraw from them at all** at the snapshot
- **Grove USDS compounder:** A `USDC to Grove USDS Compounder` ([`0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e`](https://etherscan.io/address/0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e)), added September 21, 2026, swaps USDC to USDS through Sky's LitePSM and deposits it into Yearn's `Grove USDS Compounder` (ysUSDS, [`0x47c640fDA687B7D20d50D4464e302e36D3D312Ed`](https://etherscan.io/address/0x47c640fDA687B7D20d50D4464e302e36D3D312Ed)). The compounder stakes USDS in Sky's GROVE `StakingRewards` farm ([`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a)) and auctions the [GROVE](https://etherscan.io/address/0xB30FE1Cf884B48a22a50D22a9282004F2c5E9406) rewards back into USDS. yvUSD's strategy holds all ysUSDS shares
- **LockedyvUSD:** Companion cooldown wrapper where users lock yvUSD shares for additional yield (10% locker bonus per the APR oracle). Users locking shares gives the vault better guarantees on duration risk, enabling higher-yield strategies without sacrificing atomic liquidity for non-lockers. Cooldown: 14 days (`cooldownDuration` = 1,209,600 s, confirmed onchain), withdraw window: 5 days (`withdrawalWindow` = 432,000 s, configurable). Also serves as the vault's accountant ([`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040), confirmed onchain). **~37.8% of yvUSD supply is locked here** (LockedyvUSD holds 4,242,071 yvUSD of the 11,219,361 total supply, via `yvUSD.balanceOf(LockedyvUSD)`)
- **Strategies:** **17 active strategies — 7 funded, 10 at 0 debt** — deploying into Morpho V1, a remote Yearn yvUSDC vault on Katana, Sky/MakerDAO (sUSDS directly, the GROVE staking farm, and a Pendle PT), Cap stcUSD (levered), and 3Jane USD3 (via Pendle PT). A further 15 strategies have been revoked over the vault's life. The Morpho V2 Sentora PYUSD/RLUSD convertors, the Arbitrum syrupUSDC looper, and a `USDC to ysyBOLD Convertor` remain active-but-unfunded
- **Yield sources:** Curated Morpho V1 lending (Yearn OG USDC vault), GROVE staking rewards on USDS, a cross-chain Yearn yvUSDC compounder on Katana, a levered stcUSD carry trade, Sky savings (sUSDS) both directly and as a Pendle PT, and 3Jane USD3 as a Pendle PT

**Key metrics (October 12, 2026, block 26,177,300):**

- **TVL:** ~$11,601,730 USDC (`totalAssets()` = 11,601,729.696164, confirmed onchain)
- **Total Supply:** ~11,219,361 yvUSD
- **Price Per Share:** 1.034081 USDC/yvUSD (`convertToAssets(1e6)`; ~3.41% appreciation since the Jan 19 inception, ~4.7% annualized)
- **Total Debt:** 100% deployed (`totalDebt()` = `totalAssets()`, `totalIdle()` = 0)
- **Deposit Limit:** $15,000,000 (~77.3% utilized)
- **Profit Max Unlock Time:** 5 days (432,000 s)
- **Net APR:** 6.60% | **APY:** 6.82% ([yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs); gross APR ~7.33%, 0% management/performance fee, 10% locker bonus)

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
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe — operational roles + **CANCELLER** on timelock. Also `management` on all funded strategies |
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

### Active Strategies (17 — 7 funded, 10 at 0 debt)

The strategy set is enumerated by replaying all 47 `StrategyChanged` events since deployment (block 24,271,831): 17 strategies are currently in the `ADDED` state and 15 have been `REVOKED`. Debts and allocations are confirmed onchain via `strategies(address).current_debt`; the seven funded debts sum to **11,601,729.696164 USDC**, matching `totalDebt()` exactly. Withdrawal-queue membership comes from `get_default_queue()`; withdrawability comes from each strategy's `availableWithdrawLimit(vault)`.

#### Funded strategies (7)

| # | Strategy | Name | Current Debt (USDC) | Allocation | In default queue? | Withdrawable now | Protocols / Venue |
|---|----------|------|--------------------:|-----------:|-------------------|-----------------:|-------------------|
| 1 | [`0x0e297dE4005883C757c9F09fdF7cF1363C20e626`](https://etherscan.io/address/0x0e297dE4005883C757c9F09fdF7cF1363C20e626) | Morpho Yearn OG USDC Compounder | 7,060,864.11 | **60.9%** | ✅ Yes | Full | Morpho V1 (Yearn OG USDC vault [`0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49`](https://etherscan.io/address/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49)) |
| 2 | [`0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e`](https://etherscan.io/address/0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e) | USDC to Grove USDS Compounder | 1,001,639.01 | 8.6% | ✅ Yes | Full | Sky LitePSM, Yearn [ysUSDS](https://etherscan.io/address/0x47c640fDA687B7D20d50D4464e302e36D3D312Ed), Sky GROVE [StakingRewards](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a) |
| 3 | [`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C) | Katana yvUSDC Compounder | 929,596.85 | 8.0% | ❌ No | **~0** (`availableWithdrawLimit` = 1 wei) | **Katana L2** (remote yvUSDC), AggLayer LxLy bridge, VaultBridgeToken |
| 4 | [`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986) | **stcUSD/USDC Pawn Broker Looper** | 888,356.81 | 7.7% | ❌ No | Full (requires deleverage) | **Cap stcUSD** collateral, [Pawn Broker Market](https://etherscan.io/address/0xe63A2aBC24cD9538398d825a4bFe5778D25687dF), Morpho Blue flashloans. **7.79x leverage** |
| 5 | [`0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D`](https://etherscan.io/address/0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D) | USDC To sUSDS Depositor | 731,048.22 | 6.3% | ✅ Yes | Full | Sky/MakerDAO (sUSDS [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) |
| 6 | [`0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142`](https://etherscan.io/address/0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142) | **sUSDS Pendle PT Maxi** | 580,745.29 | 5.0% | ❌ No | **0** (`openWithdrawals` = false) | Pendle [`PT-sUSDS-26NOV2026`](https://etherscan.io/address/0xdC169AbE56461A2E0c034Da431Ac2a3ebf596094), Sky sUSDS |
| 7 | [`0x62ebE2ca290DB3B649c390847f8204196771B438`](https://etherscan.io/address/0x62ebE2ca290DB3B649c390847f8204196771B438) | **USD3 Pendle PT Maxi** | 409,479.40 | 3.5% | ❌ No | **0** (`openWithdrawals` = false) | Pendle [`PT-USD3-17DEC2026`](https://etherscan.io/address/0x7f47c3e6b2c00fC4eB4d5Ae50d0Ab0Ab6888Eb4D), 3Jane USD3 |
| | | **Total** | **11,601,729.70** | **100.0%** | | | |

All seven weights are independently reproduced by the [yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs) (`meta.strategies[].weight`): 0.6086, 0.0863, 0.0801, 0.0766, 0.0630, 0.0501, 0.0353.

Strategies 4, 6, and 7 were activated on **June 26, 2026**; strategy 2 was activated on **September 21, 2026** ([tx](https://etherscan.io/tx/0xcb16d156c19a90e98a785d50dc8ca88b5a2297053e2d895f08d4e4091f6dad4d)). The Grove leg's strategy and ysUSDS both run on Yearn's newer TokenizedStrategy **v3.1.0** ([`0x310f5Db015E9d6E542fd41bd4542640790791e76`](https://etherscan.io/address/0x310f5Db015E9d6E542fd41bd4542640790791e76)); the other funded strategies use v3.0.4.

#### Active but unfunded (10, all at 0 debt)

| # | Strategy | Name | In default queue? | Protocols / Venue |
|---|----------|------|-------------------|-------------------|
| 7 | [`0x9e0A5943dFc1A85B48C191aa7c10487297aA675b`](https://etherscan.io/address/0x9e0A5943dFc1A85B48C191aa7c10487297aA675b) | USDC To Spark USDS Depositor | ✅ Yes | Spark, Sky/MakerDAO |
| 8 | [`0x908244B6ef0e52911a380a5454aEC0743598Fb20`](https://etherscan.io/address/0x908244B6ef0e52911a380a5454aEC0743598Fb20) | Base Yearn Morpho OG USDC | ✅ Yes | Base L2, Morpho, CCTP |
| 9 | [`0xF0FEC2602Dff25497D6a14b3113D0687b4c56741`](https://etherscan.io/address/0xF0FEC2602Dff25497D6a14b3113D0687b4c56741) | sIUSD/USDC Morpho Looper | ✅ Yes | InfiniFi sIUSD, Morpho |
| 10 | [`0x4C0e4d3cB62B91afBbf1Fe8e830f98A513c7234b`](https://etherscan.io/address/0x4C0e4d3cB62B91afBbf1Fe8e830f98A513c7234b) | USD3 Pendle PT Maxi (legacy) | ❌ No | 3Jane USD3, Pendle — superseded by strategy #6 |
| 11 | [`0x8C8232Bdffc60BAb474CABa0245e63726e85Ce15`](https://etherscan.io/address/0x8C8232Bdffc60BAb474CABa0245e63726e85Ce15) | wOUSD/USDC Morpho Looper | ❌ No | Origin wOUSD, Morpho. Added June 26, 2026, never funded |
| 12 | [`0xF28DC8B6DeD7E45F8cf84B9972487C8e1857A442`](https://etherscan.io/address/0xF28DC8B6DeD7E45F8cf84B9972487C8e1857A442) | syrupUSDC/USDC Morpho Looper | ❌ No | Maple syrupUSDC, Morpho |
| 13 | [`0x2F56D106C6Df739bdbb777C2feE79FFaED88D179`](https://etherscan.io/address/0x2F56D106C6Df739bdbb777C2feE79FFaED88D179) | Arbitrum syrupUSDC/USDC Morpho Looper | ❌ No | Maple syrupUSDC, Morpho, CCTP (Arbitrum) |
| 14 | [`0x3D2467Cbf82332dbFb38997cBc4D2192694D9490`](https://etherscan.io/address/0x3D2467Cbf82332dbFb38997cBc4D2192694D9490) | Morpho V2 Sentora PYUSD Convertor | ❌ No | Morpho V2, Sentora, PYUSD |
| 15 | [`0xE0be46Cc5aD2F56a7734A99FF403781b9c54C7B2`](https://etherscan.io/address/0xE0be46Cc5aD2F56a7734A99FF403781b9c54C7B2) | Morpho V2 Sentora RLUSD Convertor | ❌ No | Morpho V2, Sentora, RLUSD |
| 16 | [`0x72978421a29d83Ca76E9E5A72EaBE2b363454596`](https://etherscan.io/address/0x72978421a29d83Ca76E9E5A72EaBE2b363454596) | USDC to ysyBOLD Convertor | ❌ No | Auction-based USDC ↔ [ysyBOLD](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD) convertor (Liquity V2 BOLD via Yearn). Added September 15, 2026 ([tx](https://etherscan.io/tx/0x56f8435298e6cae43b7a8a9c2c5349aeb86f0067c2083e48ae48978deaa0be77)), `max_debt` 2.5M USDC, never funded by the vault |

These 10 remain endorsed and can be re-funded by the Debt Allocator **without a new timelock proposal**, so their risk surfaces (convertor auctions, CCTP lanes, additional loopers) are dormant rather than removed.

#### Revoked (15)

Revoked strategies require a fresh **7-day timelock** proposal to be re-added. Notably, several strategies previously described as merely "idle" are in fact revoked:

| Strategy | Name |
|----------|------|
| [`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF) | USDC Fluid Lender |
| [`0x48E66D65006007ef62B50735D070fc30d0242a93`](https://etherscan.io/address/0x48E66D65006007ef62B50735D070fc30d0242a93) | USDC To SKY USDS Depositor |
| [`0x5f9DBa2805411a8382FDb4E69d4f2Da8EFaF1F89`](https://etherscan.io/address/0x5f9DBa2805411a8382FDb4E69d4f2Da8EFaF1F89) | Infinifi sIUSD Morpho Looper |
| [`0x7bf1D269bf2CB79E628F51B93763B342fd059D1D`](https://etherscan.io/address/0x7bf1D269bf2CB79E628F51B93763B342fd059D1D) | PT stcUSD Jul 23 Morpho Looper |
| [`0xb44EE7869b9D47cd605B05022c8Bd8612EBe53EE`](https://etherscan.io/address/0xb44EE7869b9D47cd605B05022c8Bd8612EBe53EE) | sUSD3 Compounder |
| [`0xBc65ad17c5C0a2A4D159fa5a503f4992c7B545FE`](https://etherscan.io/address/0xBc65ad17c5C0a2A4D159fa5a503f4992c7B545FE) | Spark USDC Vault |
| [`0x1b88F199d42F2114dE341C5b68E9c92aF1c271ee`](https://etherscan.io/address/0x1b88F199d42F2114dE341C5b68E9c92aF1c271ee) | USDC To sUSDS Depositor (v1) |
| [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | USDC to sUSDS Lender |
| [`0xb68f759eFa587a83E59B094CA1eC982D5ea97581`](https://etherscan.io/address/0xb68f759eFa587a83E59B094CA1eC982D5ea97581) | PT siUSD March 25 Morpho Looper |
| [`0xB73a2f9f57aAA125aDE3A11a1E661d28A919C66d`](https://etherscan.io/address/0xB73a2f9f57aAA125aDE3A11a1E661d28A919C66d) | PT siUSD March 25 Morpho Looper (v2) |
| [`0xEa1F78458cD7FB4225CD239506EfaD4237b12dab`](https://etherscan.io/address/0xEa1F78458cD7FB4225CD239506EfaD4237b12dab) | Arbitrum PT sUSDai Feb 18 Morpho Looper |
| [`0x1983923e5a3591AFe036d38A8C8011e66Cd76e9E`](https://etherscan.io/address/0x1983923e5a3591AFe036d38A8C8011e66Cd76e9E) | Arbitrum Yearn Degen Morpho Compounder |
| [`0x59B6C75Eeb7dfe417505919C3E5A919b7C1b0773`](https://etherscan.io/address/0x59B6C75Eeb7dfe417505919C3E5A919b7C1b0773) | syrupUSDC/USDC Morpho Looper (v1) |
| [`0x7E71d8a63cA904F832Ed35B39911f7EEC36c8928`](https://etherscan.io/address/0x7E71d8a63cA904F832Ed35B39911f7EEC36c8928) | sUSDe/USDT Aave Looper Convertor |
| [`0xdA29b5ddc82F968cd75Ee69ff51A47D940318Ebe`](https://etherscan.io/address/0xdA29b5ddc82F968cd75Ee69ff51A47D940318Ebe) | jrUSDe Convertor |

#### Default withdrawal queue

`get_default_queue()` returns **6 strategies**, **3 of which are funded**:

1. [`0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D`](https://etherscan.io/address/0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D) USDC To sUSDS Depositor — 6.3% funded
2. [`0x9e0A5943dFc1A85B48C191aa7c10487297aA675b`](https://etherscan.io/address/0x9e0A5943dFc1A85B48C191aa7c10487297aA675b) USDC To Spark USDS Depositor — 0 debt
3. [`0x0e297dE4005883C757c9F09fdF7cF1363C20e626`](https://etherscan.io/address/0x0e297dE4005883C757c9F09fdF7cF1363C20e626) Morpho Yearn OG USDC Compounder — 60.9% funded
4. [`0x908244B6ef0e52911a380a5454aEC0743598Fb20`](https://etherscan.io/address/0x908244B6ef0e52911a380a5454aEC0743598Fb20) Base Yearn Morpho OG USDC — 0 debt
5. [`0xF0FEC2602Dff25497D6a14b3113D0687b4c56741`](https://etherscan.io/address/0xF0FEC2602Dff25497D6a14b3113D0687b4c56741) sIUSD/USDC Morpho Looper — 0 debt
6. [`0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e`](https://etherscan.io/address/0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e) USDC to Grove USDS Compounder — 8.6% funded

**Consequence:** only **75.8% of TVL** (Morpho OG 60.9% + Grove 8.6% + sUSDS 6.3%) is reachable by a standard `withdraw()`/`redeem()` call. The vault has `use_default_queue() = true`, so a caller-supplied strategy list in `redeem(uint256,address,address,uint256,address[])` is ignored. The remaining **24.2%** — Katana (8.0%), Pawn Broker Looper (7.7%), and the two Pendle PT strategies (8.5%) — is not reachable by a plain user redemption. It can be opened up in two ways. A DEBT_MANAGER holder (the Debt Allocator, Brain, Security, or Daddy) can lower a strategy's debt with `update_debt()` to move USDC into idle. Alternatively, QUEUE_MANAGER holders (Brain and Daddy, bitmasks `0x3972` and `0x3FF6`) can also call `set_default_queue()` to add active strategies to the queue, or `set_use_default_queue(false)` to let callers pass their own strategy list. Neither call is timelocked. Either path needs a privileged action first. A queue change only helps where the strategy itself can pay out. That covers the looper's 7.7% (`availableWithdrawLimit` = 890,364 USDC) but not Katana (1 wei; needs a bridge round-trip) or the PT positions (0; need management to open withdrawals or must reach maturity).

**This gap is more than covered by the locked supply.** ~37.8% of yvUSD sits in LockedyvUSD behind a 14-day cooldown, which exceeds the 24.2% held outside the default queue. Redemptions from unlocked holders draw against the 75.8% liquid tranche, and the locked cohort cannot exit without at least 14 days' notice — enough time to unwind the bridged, levered, or PT positions in an orderly way. The queue composition is therefore a monitoring item rather than a live redemption risk at current lock levels. See [Liquidity Risk](#liquidity-risk).

### Strategy Protocol Dependencies with Existing Reports

Several underlying protocols have been previously assessed in this repository:

| Protocol | Report Score | yvUSD Allocation |
|----------|-------------|-----------------|
| [Cap (stcUSD)](./cap-stcusd.md) | **2.39/5** (Low Risk) | **7.7%** equity — ~$6.94M stcUSD collateral notional at 7.79x leverage |
| [3Jane USD3](./3jane-usd3.md) | **3.46/5** (Medium Risk) | **3.5%** via `PT-USD3-17DEC2026`, plus indirect exposure through Morpho V1 OG markets backed by 3Jane collateral (see [Funds Management](#funds-management)) |
| [Sky USDS](./sky-usds.md) | **1.3/5** (Minimal Risk) | **19.9%** — 6.3% direct sUSDS + 8.6% USDS in the GROVE staking farm + 5.0% via `PT-sUSDS-26NOV2026` |
| [Yearn yvUSDC-1](./yearn-yvusdc.md) | **1.47/5** (Minimal Risk) | Counterparty — yvUSDC-1 funds the Pawn Broker Market this vault borrows from |
| [Spectra](./spectra-finance.md) | **2.32/5** (Low Risk) | 0% — PT infrastructure only |
| [InfiniFi](./infinifi.md) | **3.19/5** (Medium Risk) | 0% (active, unfunded) |
| [Maple syrupUSDC](./maple-syrupusdc.md) | **2.32/5** (Low Risk) | 0% (active, unfunded) |
| [Origin OUSD](./origin-ousd.md) | **2.05/5** (Low Risk) | 0% (wOUSD looper active, unfunded) |
| [Fluid](./fluid.md) | **2.61/5** (Medium Risk) | 0% (revoked) |

Underlying venues **without** an existing repository report — **Morpho V1** (60.9%), **Katana L2 + AggLayer LxLy bridge** (8.0%), **Pendle** (8.5% of TVL held as PTs), and **Grove** (GROVE reward token only; principal sits in the Sky-owned farm) — are assessed inline in this report and flagged as uncovered-dependency risk.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

The underlying vault infrastructure has been audited by 3 reputable firms:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |
| [yAudit](https://github.com/yearn/yearn-security/tree/master/audits/20260601_yAudit_Yearn_V3.1.0) | Jun 2026 | V3 Vaults + Tokenized Strategy (v3.1.0) — the version used by the Grove leg | 2 PDFs |

### yvUSD-Specific Audits

No external third-party audit specifically covering the CCTPStrategy cross-chain code, the KatanaStrategy, the Pawn Broker Looper, the Pendle PT Maxi strategies, the Grove USDC→USDS strategy and GroveCompounder, or the LockedyvUSD cooldown wrapper was found. The **CCTPStrategy has undergone strict internal review by ySec** (Yearn's security team), and all strategies go through Yearn's internal review process (see below). The three highest-complexity funded strategies — the 7.8x leveraged Pawn Broker Looper and the two PT Maxi strategies — were activated on June 26, 2026 and have **~15 weeks of production history** with no dedicated external audit. The Grove leg is simpler (PSM swap + single-farm staking) and has ~3 weeks of production history.

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
| Morpho (V1) | 25+ audits (Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora) | Formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk. **60.9% of TVL**. Morpho Blue is also the flashloan venue for the Pawn Broker Looper |
| Pendle | 6+ audits (Ackee, Dedaub, ChainSecurity, Spearbit, Code4rena) | Well-established. **8.5% of TVL** held as fixed-maturity PTs (Nov 26 and Dec 17, 2026) |
| Cap (stcUSD) | 8 audit firms / 9 reports (Trail of Bits, Spearbit, Zellic, Electisec, Certora), $1M Sherlock bug bounty | **7.7% of TVL as equity, ~$6.94M collateral notional at 7.79x leverage.** Assessed internally at [2.39/5.0](./cap-stcusd.md). Governance is a 3-of-5 anonymous multisig → 24h timelock, all core contracts upgradeable UUPS proxies |
| Sky/MakerDAO | Extensively audited across many years | Blue-chip. 19.9% combined (6.3% direct sUSDS + 8.6% USDS in the GROVE farm + 5.0% via PT-sUSDS). The GROVE `StakingRewards` farm is owned by Sky's pause proxy ([`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB)), and the LitePSM charged 0 `tin`/`tout` at the snapshot |
| 3Jane (USD3) | See [3Jane USD3 report](./3jane-usd3.md) (3.46/5) | 3.5% via PT-USD3. Credit-based lending, medium risk |
| Polygon AggLayer (LxLy) + VaultBridgeToken | AggLayer/zkEVM bridge audited; VaultBridgeToken wrapper is **newer infrastructure** | ~8.0% Katana exposure. Katana is a young (2025) L2; bridge + wrapper not yet covered by an existing repo report — flagged as novel |
| Circle CCTP | ChainSecurity (V1 2023, V2 March 2025, V2 update April 2025, Gateway July 2025) | Trust-minimized bridge (Arbitrum/Base — CCTP strategies active but at 0 debt) |
| Spark | Inherits MakerDAO audit coverage | Blue-chip (active, 0 debt) |

### Bug Bounty

- **Immunefi:** Active bug bounty for Yearn Finance. Max payout: **$200,000** (Critical). Scope includes V3 vaults (`VaultV3.vy`, `VaultFactory.vy`).
  - Link: https://immunefi.com/bounty/yearnfinance/
- **Sherlock:** Also listed: https://audits.sherlock.xyz/bug-bounties/30
- **Safe Harbor:** Not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

- **17 active strategies** (7 funded) spanning up to 4 chains (Ethereum + Katana funded; Base and Arbitrum strategies active but unfunded)
- **One cross-chain mechanism with active debt:** the Polygon AggLayer LxLy bridge + VaultBridgeToken (Katana, ~8.0%); CCTP strategies (Arbitrum, Base) are at 0 debt
- **One leveraged looper funded at 7.79x** (Pawn Broker Looper, 7.7% of TVL) — flashloan-assisted, with liquidation risk, a `reportBuffer` parameter, and slippage/loss-limit controls
- **Two fixed-maturity Pendle PT positions** (8.5% of TVL) valued through a Pendle oracle and currently non-withdrawable
- **Two-layer Grove leg** (8.6% of TVL) — a yvUSD strategy wraps a second Yearn tokenized strategy (ysUSDS) that stakes in the Sky GROVE farm and auctions GROVE rewards
- **Convertor strategies dormant, not removed** — the Morpho V2 Sentora PYUSD/RLUSD convertors and the ysyBOLD convertor remain active at 0 debt and can be re-funded by the Debt Allocator without a timelock
- **Custom accountant** (LockedyvUSD) combining cooldown/locking mechanics with fee management
- **Inter-vault coupling** — the Pawn Broker Looper's USDC is borrowed from the Pawn Broker Market, which is itself a funded strategy of yvUSDC-1
- **V3 vault itself is non-upgradeable** (immutable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** January 19, 2026 (block 24271831) — **~266 days** in production
- **TVL:** ~$11.60M USDC. Deposit limit: $15M (~77.3% utilized). Sampled `totalAssets()` rose from ~$9.12M on August 8, 2026 to ~$11.90M on September 27, 2026 (block 26,070,000)
- **PPS trend:** 1.000000 → 1.034081 — ~3.41% appreciation since inception, ~4.7% annualized; no PPS decrease observed at sampled blocks, and no `StrategyReported` event since August 8, 2026 recorded a loss
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** 47 `StrategyChanged` events over ~266 days — 17 strategies currently active, 15 revoked. On **June 26, 2026** four strategies were added (Pawn Broker Looper, sUSDS PT Maxi, USD3 PT Maxi, wOUSD Morpho Looper); three are funded at a combined **16.2%** of TVL. The ysyBOLD convertor was added on **September 15, 2026** and remains unfunded; the Grove USDS Compounder was added on **September 21, 2026** and holds **8.6%**
- **Governance:** Standard Yearn RoleManager, 7-day timelock (`getMinDelay()` = 604,800 s), Daddy bitmask `0x3FF6`, no pending `future_role_manager`, vault not shut down
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~29 months). No V3 vault exploits

**Yearn protocol TVL:** ~$200M total across all chains ([DeFi Llama](https://defillama.com/protocol/yearn-finance), October 12, 2026).

## Funds Management

yvUSD deploys deposited USDC across 17 active strategies (7 funded) with 100% capital utilization (0 idle). The funded book falls into six categories.

### Strategy Positions by Category

**1. Morpho V1 Lending — mainnet (60.9% of TVL)**

- Morpho Yearn OG USDC Compounder (60.9%, $7,060,864) — deposits USDC into the Yearn-curated **Morpho V1** "Yearn OG USDC" vault ([`0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49`](https://etherscan.io/address/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49)). Unleveraged lending compounder. 25+ audits with formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk.

The OG vault's supply allocation on October 12, 2026 ([Morpho API](https://app.morpho.org/ethereum/vault/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49/)) was:

| Market (collateral / loan · LLTV) | Share of OG vault |
|-----------------------------------|------------------:|
| [PT-USD3-17DEC2026 / USDC · 86%](https://app.morpho.org/ethereum/market/0xf8c5aa31ea6b2a068a9eddb46dd110cae57bf0f12be9583a3f9a818effecba89/) | 39.1% |
| [OETH / USDC · 86%](https://app.morpho.org/ethereum/market/0xb8fef900b383db2dbbf4458c7f46acf5b140f26d603a6d1829963f241b82510e/) | 23.4% |
| [USD3 / USDC · 91.5%](https://app.morpho.org/ethereum/market/0xe3df58f9d3011b7481ff36b939fa5f8da642f34ea5792d25d3958dbf1efa26d7/) | 21.3% |
| [siUSD / USDC · 91.5%](https://app.morpho.org/ethereum/market/0xbbf7ce1b40d32d3e3048f5cf27eeaa6de8cb27b80194690aab191a63381d8c99/) | 8.1% |
| [PT-siUSD-7JAN2027 / USDC · 86%](https://app.morpho.org/ethereum/market/0x0c93c623fd2a78a2ffa36b019f74c400c3f3d81fcb22851c88e0c96e510f9689/) | 5.2% |
| [YFI / USDC · 77%](https://app.morpho.org/ethereum/market/0x973e9dd45799efe8775417bcc420a3ab84a583587b2108985746e2fe201d0c83/) | 1.3% |
| [cbBTC / USDC · 86%](https://app.morpho.org/ethereum/market/0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64/) | 1.1% |
| [wOUSD / USDC · 91.5%](https://app.morpho.org/ethereum/market/0xad656d430bb3d8c1469bf45c8ad4ebae1b04be04757c69fa424eec78d7b3f4dc/) | <0.1% |

**Lending risk:** Morpho V1 has 25+ audits and formal verification, but the Yearn OG USDC vault is rated low-mid risk, not blue-chip. The vault is unleveraged and curated. This remains the single largest position and the single largest point of failure. **60.4% of the OG vault lends against 3Jane collateral** (PT-USD3 39.1% + USD3 21.3%). On a look-through basis, ~36.8% of yvUSD TVL is lent against 3Jane collateral. Including the direct 3.5% PT-USD3 position, ~40% of yvUSD TVL is exposed to 3Jane. The Morpho legs are collateralized loans with 86% / 91.5% LLTVs, not direct holdings, so a 3Jane loss reaches yvUSD only if collateral falls past the liquidation margin and liquidations fail to cover the debt.

**2. Sky USDS Staking — Grove (8.6% of TVL)**

- USDC to Grove USDS Compounder (8.6%, $1,001,639) — swaps USDC to USDS 1:1 through Sky's LitePSM wrapper ([`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c)). The strategy refuses deposits when the PSM charges a fee (`tin`/`tout` > 0; both were 0 at the snapshot). The USDS goes into Yearn's `GroveCompounder` (ysUSDS, [`0x47c640fDA687B7D20d50D4464e302e36D3D312Ed`](https://etherscan.io/address/0x47c640fDA687B7D20d50D4464e302e36D3D312Ed)), which stakes it in the Sky GROVE `StakingRewards` farm ([`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a)). The strategy holds all 1,000,000 ysUSDS shares, and the compounder's 1,001,639 USDS stake is ~0.65% of the farm's 153.2M USDS.

**Staking risk:** Principal stays in USDS inside a Sky-owned farm (owner: Sky pause proxy [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB)), so principal risk is Sky's (1.3/5). Staked USDS does not earn the Sky Savings Rate. All yield comes from GROVE emissions, which the compounder sells for USDS through a dedicated Yearn auction ([`0x645ecF8D3355A8ce243B6706bB685F66B3fEe71A`](https://etherscan.io/address/0x645ecF8D3355A8ce243B6706bB685F66B3fEe71A)) that only the compounder can kick, with a 0.006 USDS-per-GROVE minimum price. Yield therefore depends on GROVE's market value and the farm's reward schedule (the current reward period ends October 19, 2026 per `periodFinish()`). The exit path is `withdraw` from the farm and then LitePSM `buyGem`; the PSM pocket ([`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341)) held ~$4.34B USDC at the snapshot. Management (Brain) can call `manualRedeem` and `manualPsmSwap`.

**PSM exit-fee gate:** withdrawals from this leg revert whenever the LitePSM's `tout` is above zero. In `_freeFunds`, the strategy redeems only `_amount × 1e12` USDS from ysUSDS. It then calls the wrapper's `buyGem(_amount)`, which pulls `gemAmt18 + gemAmt18 × tout / 1e18` USDS ([wrapper source](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c#code)). With any positive `tout` the `transferFrom` lacks the extra fee and reverts. `availableWithdrawLimit()` ignores the fee, so the vault's `maxWithdraw()`/`maxRedeem()` would still count this 8.6% as available. A redemption large enough to reach Grove (sixth in the default queue, after sUSDS and Morpho OG) would revert. `tout` is set by Sky governance, and `tin` and `tout` were both 0 at the snapshot. Under a positive `tout`, Brain can still exit manually with `manualRedeem` plus a smaller `manualPsmSwap`, which pays the fee and realizes it as a loss. The same gate applies to `emergencyWithdraw`.

**3. Cross-Chain Compounder — Katana (8.0% of TVL)**

- Katana yvUSDC Compounder (8.0%, $929,597) — wraps USDC into a **VaultBridgeToken** ([`0x53E82ABbb12638F09d9e624578ccB666217a765e`](https://etherscan.io/address/0x53E82ABbb12638F09d9e624578ccB666217a765e)) and bridges to **Katana L2** (AggLayer network ID 20) via the Polygon AggLayer LxLy unified bridge, where a remote counterpart ([`0xEfEEBaAcdC5640A123Fe282652503ea4Fd499d14`](https://explorer.katanarpc.com/address/0xEfEEBaAcdC5640A123Fe282652503ea4Fd499d14)) deposits into a Yearn vbUSDC yVault ([`0x80c34BD3A3569E126e7055831036aa7b212cB159`](https://explorer.katanarpc.com/address/0x80c34BD3A3569E126e7055831036aa7b212cB159)). `remoteAssets()` reads 930,351.03 USDC on the origin. This is the **only active cross-chain position** with material debt.

**Cross-chain risk:** Novel dependency stack — a young (2025) L2, the AggLayer/LxLy bridge, the VaultBridgeToken wrapper, and a remote Yearn vault — none of which have an existing repository report. The strategy's `availableWithdrawLimit()` reads **1 wei**, so this slice is effectively non-withdrawable on demand; exiting requires a bridge round-trip and claim. The local `valueOfVault()` reads 0 between bridge reports, so ~8% of TVL is known to the origin only via on-chain bridge messages. Katana-side state reconciles with the origin. At Katana block 45,084,399 (October 12, 2026), the remote counterpart's `totalAssets()` was 930,522.45 vbUSDC. That is 904,707.94 vbUSDC yVault shares worth 930,437.39 vbUSDC, plus 85.06 idle vbUSDC. The origin shows `remoteAssets()` = 930,351.03 and vault debt = 929,596.85, so the gap is unreported profit. yvUSD's leg is ~14.5% of the remote vault's 6.41M `totalAssets()`. The remote vault (v3.0.4) allocates to Morpho compounders and a Steer LP: Yearn OG v2 USDC 42.8%, Yearn Degen USDC 23.5%, Single Sided Steer LP vbUSDC-vbUSDT 15.1%, Steakhouse High Yield USDC (Morpho V2) 11.6%, Steakhouse Prime v2 USDC 6.0%, and idle 1.0%.

**4. Leveraged stcUSD Carry — Pawn Broker Looper (7.7% of TVL)**

- stcUSD/USDC Pawn Broker Looper (7.7%, $888,357 debt) — posts **stcUSD** ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), Cap's staked-USD ERC-4626 token) as collateral into the **stcUSD/USDC Pawn Broker Market** ([`0xe63A2aBC24cD9538398d825a4bFe5778D25687dF`](https://etherscan.io/address/0xe63A2aBC24cD9538398d825a4bFe5778D25687dF)) and borrows USDC against it, using Morpho Blue flashloans to build the position.

Onchain state at the snapshot:

| Metric | Value |
|--------|-------|
| `balanceOfCollateral()` | 6,392,939.74 stcUSD (~$6.94M at stcUSD `convertToAssets` = 1.084958) |
| `balanceOfDebt()` | 6,045,991 USDC |
| Net equity (`totalAssets()`) | 888,913 USDC |
| `getCurrentLeverageRatio()` | **7.79x** (target 8.00x, max 8.50x) |
| `getCurrentLTV()` | **87.16%** |
| `getLiquidateCollateralFactor()` | **91.50%** |
| Headroom to liquidation | **~4.7%** decline in stcUSD/USDC |

**Leverage risk:** This is the vault's highest-risk position by a wide margin. A ~4.7% adverse move in the stcUSD/USDC price — a Cap depeg, a reserve loss, an operator default, or an oracle disagreement — would push the position into liquidation and can wipe out most or all of the 7.7% equity. Cap governs stcUSD through a **3-of-5 anonymous Gnosis Safe multisig → 24h timelock**, with all core contracts on **upgradeable UUPS proxies** (see the [Cap stcUSD report](./cap-stcusd.md), 2.39/5.0). The collateral balance has not changed since August 8, 2026; LTV fell slightly because stcUSD appreciated faster than the USDC debt accrued interest.

**Inter-vault coupling:** the Pawn Broker Market held $6,045,024 of total assets and 1 wei of idle USDC at the snapshot, while this strategy owed $6,045,991. Effectively **~100%** of the Market's book is lent to yvUSD's looper. The Market is a funded strategy of [yvUSDC-1](./yearn-yvusdc.md) with 6,038,312 USDC of debt (**~30.7%** of yvUSDC-1's 19.66M `totalAssets()`). yvUSD's leveraged borrower is therefore the sole counterparty to nearly a third of yvUSDC-1, and the two vaults' risk is correlated through a single Cap-collateralised credit book.

**5. Sky Lending — sUSDS (6.3% direct; 19.9% total Sky)**

- USDC To sUSDS Depositor (6.3%, $731,048) — deposits into Sky/MakerDAO Savings USDS (sUSDS, [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD))

**Lending risk:** Standard DeFi lending risk. Sky is blue-chip with extensive audit coverage and deep liquidity. Combined with the Grove farm leg and the sUSDS PT position below, total Sky exposure is 19.9%.

**6. Pendle Principal Tokens (8.5% of TVL)**

| Strategy | Allocation | Principal Token | PT held | Maturity | Underlying |
|----------|-----------:|-----------------|--------:|----------|------------|
| sUSDS Pendle PT Maxi | 5.0% | [`PT-sUSDS-26NOV2026`](https://etherscan.io/address/0xdC169AbE56461A2E0c034Da431Ac2a3ebf596094) | 584,707.18 | Nov 26, 2026 | Sky sUSDS |
| USD3 Pendle PT Maxi | 3.5% | [`PT-USD3-17DEC2026`](https://etherscan.io/address/0x7f47c3e6b2c00fC4eB4d5Ae50d0Ab0Ab6888Eb4D) | 420,530.82 | Dec 17, 2026 | [3Jane USD3](./3jane-usd3.md) (3.46/5) |

**PT risk:** Both strategies report `openWithdrawals() = false` and `availableWithdrawLimit(vault) = 0` — the vault **cannot withdraw any value from these positions** at the snapshot. They are duration-locked to maturity (~45 and ~66 days out) unless governance flips the flag, in which case exit runs through the Pendle router at up to 50 bps configured slippage (`swapSlippageBPS` = 50). PT prices trade at a discount to face value and are exposed to interest-rate and underlying-protocol risk before maturity. Valuation flows through a strategy-configured Pendle oracle ([`0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2`](https://etherscan.io/address/0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2)). The USD3 leg additionally carries 3Jane credit risk (report score 3.46/5, medium).

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSD (ERC-4626 standard). Subject to the $15M deposit limit (`deposit_limit` confirmed onchain; `deposit_limit_module` = `address(0)`, so the hard cap is the direct limit)
- **Withdrawals:** ERC-4626 standard, but materially constrained:
  - **100% of funds are deployed** (0 idle) — withdrawals require unwinding strategy positions
  - **Only 75.8% of TVL sits in the default withdrawal queue** and is immediately withdrawable (Morpho OG 60.9% + Grove 8.6% + sUSDS 6.3%). `use_default_queue() = true`, so users cannot supply a custom queue unless a QUEUE_MANAGER (Brain, Daddy) disables it. The Grove 8.6% depends on the LitePSM `tout` staying at 0 (see [Sky USDS Staking](#strategy-positions-by-category))
  - **8.5% (Pendle PT) has zero withdrawal availability** — `availableWithdrawLimit()` returns 0
  - **8.0% (Katana)** requires an AggLayer/LxLy bridge round-trip and claim
  - **7.7% (Pawn Broker Looper)** is fully withdrawable in principle but is outside the default queue. A DEBT_MANAGER must call `update_debt()` to move it to idle, or a QUEUE_MANAGER must add it to the queue or disable `use_default_queue`. Either way, exit unwinds a 7.8x levered position via flashloan
- **LockedyvUSD:** Optional lock wrapper with 14-day cooldown + 5-day withdrawal window. Yields a 10% locker bonus but restricts exit timing. **~37.8% of yvUSD supply is locked** (LockedyvUSD holds 4,242,071 of 11,219,361 yvUSD) — a committed-duration buffer reducing immediate redemption pressure
- **No fees on deposits/withdrawals** — the APR oracle currently reports 0 management/performance fee; the locker bonus is funded from extra yield via the accountant

### Collateralization

- **100% USDC-denominated** — all deposits are USDC, and all strategy positions ultimately track back to USDC value
- **Collateral quality by strategy:**
  - Low-mid risk (Morpho V1 OG 60.9%): dominant position; 60.4% of the OG vault lends against 3Jane collateral
  - Blue-chip (Sky: sUSDS 6.3% + GROVE farm 8.6% + PT-sUSDS 5.0% = 19.9%)
  - Cross-chain (Katana yvUSDC via AggLayer): 8.0%, novel stack
  - Levered Cap stcUSD (Pawn Broker Looper): 7.7% equity on ~$6.94M notional
  - Credit-based (3Jane USD3 via PT): 3.5%
- **Leverage: 7.79x on 7.7% of TVL** — the Pawn Broker Looper runs at 87.16% LTV against a 91.50% liquidation threshold, ~4.7% of headroom. Gross levered notional is ~$6.94M against $889K of vault equity, i.e. ~60% of total vault TVL in gross collateral terms
- **Duration risk:** 8.5% of TVL is in fixed-maturity PTs that cannot currently be redeemed before Nov 26 / Dec 17, 2026
- **Concentration risk:** Morpho V1 OG is 60.9% of TVL. The Grove leg lifted blue-chip Sky exposure to 19.9%. Look-through 3Jane exposure is the largest single-issuer concentration: ~40% of TVL across the OG vault's PT-USD3 and USD3 markets plus the direct PT-USD3 position

### Provability

- **yvUSD exchange rate:** Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` is onchain, and the seven funded `current_debt` values reconcile exactly with `totalDebt()` (11,601,729.696164 USDC)
- **Oracle-valued positions:** The two Pendle PT strategies (8.5%) value their holdings through a strategy-configured Pendle oracle ([`0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2`](https://etherscan.io/address/0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2)); the Pawn Broker Looper exposes a `reportBuffer` parameter (currently 1) and slippage/loss-limit controls. These are management-configurable valuation surfaces. The Grove leg is valued 1:1 in USDS (`balanceOfStake()` + idle USDS, divided by 1e12), with no oracle
- **Cross-chain lag:** Only the Katana strategy (8.0%) has cross-chain lag. The local `valueOfVault()` reads 0 between bridge reports, so this slice is known to the origin only via the last on-chain AggLayer bridged message. At the snapshot the Katana-side position (930,522 vbUSDC) matched the origin's `remoteAssets()` (930,351) to within ~$171. CCTP strategies (Arbitrum, Base) are at 0 debt
- **Levered position verifiability:** The Pawn Broker Looper's collateral, debt, LTV, and leverage ratio are all directly readable onchain (`balanceOfCollateral()`, `balanceOfDebt()`, `getCurrentLTV()`, `getCurrentLeverageRatio()`) — good transparency, but the stcUSD collateral itself sits behind Cap's upgradeable proxies
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over **5 days** (`profitMaxUnlockTime` = 432,000 s). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSD for USDC via ERC-4626 `withdraw()`/`redeem()`. Subject to strategy liquidity **and** to default-queue membership (`use_default_queue() = true`)
- **Zero idle funds:** 100% of vault assets are deployed. Withdrawals require unwinding positions
- **Withdrawability by tier (verified via `availableWithdrawLimit(vault)` and `get_default_queue()`):**

| Tier | Share of TVL | Positions | Exit path |
|------|-------------:|-----------|-----------|
| Immediately withdrawable via default queue | **75.8%** | Morpho V1 OG (60.9%), Grove USDS (8.6%), Sky sUSDS (6.3%) | Standard `redeem()` |
| Withdrawable, but out of queue | 7.7% | Pawn Broker Looper | DEBT_MANAGER `update_debt()` to idle, or QUEUE_MANAGER queue change; requires flashloan deleverage of a 7.8x position |
| Bridge round-trip required | 8.0% | Katana yvUSDC | DEBT_MANAGER action plus AggLayer/LxLy claim; `availableWithdrawLimit` = 1 wei locally |
| **Not withdrawable at all** | **8.5%** | sUSDS PT Maxi (5.0%), USD3 PT Maxi (3.5%) | `availableWithdrawLimit` = 0, `openWithdrawals` = false. Locked until Nov 26 / Dec 17, 2026 maturity or management action |

- **Sequencing risk:** the default queue draws from sUSDS first, then Morpho OG, then Grove. Sustained redemptions would drain the liquid 75.8% and progressively raise the share of remaining TVL held in levered, bridged, and duration-locked positions — the residual holders would end up in a strictly riskier book
- **DEX liquidity:** No known DEX liquidity pools for yvUSD. The vault is an ERC-4626 token, not traded on DEXes
- **LockedyvUSD:** 14-day cooldown + 5-day withdrawal window. Shares in cooldown cannot be transferred. **~37.8% of yvUSD supply** is locked here — a committed-duration buffer that materially reduces immediate redemption pressure and is the main mitigant for the illiquid tail
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **Deposit limit:** $15M cap (~77.3% utilized)
- **Net:** ~75.8% of TVL is withdrawable through the normal path, and 60.9% of that sits in a low-mid risk Morpho V1 vault rather than a blue-chip venue. ~24.2% requires DEBT_MANAGER or QUEUE_MANAGER action before users can redeem it, including 8.5% that is hard-locked until late November / mid-December 2026. The ~37.8% locked-supply buffer exceeds that illiquid tail, but the mismatch between the liquid queue and the funded book is still the vault's most significant liquidity weakness

## Centralization & Control Risks

### Governance

The yvUSD vault uses the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)). This is the same governance framework used by yvUSDC-1 and 37+ other Yearn vaults.

**Governance hierarchy:**

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | Nearly all roles (bitmask 0x3FF6). **Sole PROPOSER** on timelock; also EXECUTOR and CANCELLER (shared — see [Appendix](#appendix-timelockcontroller-role-structure)) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | Operational roles (bitmask 0x3972) — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY. CANCELLER on timelock. Also `management` on all funded strategies |
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

**Operational latitude within governance:** the 7-day timelock gates *adding* strategies, but the Debt Allocator and DEBT_MANAGER holders can re-fund any of the 10 active-but-unfunded strategies (including the Morpho V2 Sentora and ysyBOLD convertors, the CCTP lanes, and further loopers) with no delay. Out-of-queue debt (24.2% of TVL) becomes redeemable only after a privileged action. Either DEBT_MANAGER holders move it to idle, or QUEUE_MANAGER holders (Brain, Daddy) change the default queue or disable `use_default_queue`, without a timelock. Brain (3-of-8) holds `management` on all seven funded strategies and on ysUSDS, so it controls the PT strategies' `openWithdrawals` flag, the looper's leverage targets and `reportBuffer`, and the Grove leg's `manualRedeem`/`manualPsmSwap` and auction settings.

**Remaining concern:** The deployer EOA ([`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271)) remains the sole `governance` address on the Fee Splitter contract ([`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470)). This is a low-impact concern (fee distribution only, not fund custody) but deviates from the otherwise robust multi-sig governance pattern.

### Programmability

- **Exchange rate (PPS):** Calculated onchain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless onchain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over **5 days**. Losses are immediate
- **Debt allocation:** Automated via Debt Allocator contract, with manual override available to DEBT_MANAGER role holders (Daddy, Brain, Security)
- **PT valuation:** The two PT Maxi strategies (8.5%) mark their holdings through a strategy-configured Pendle oracle and expose management-set `swapSlippageBPS` (50) and `openWithdrawals` parameters. `openWithdrawals = false` means management, not the market, currently determines whether the vault can exit these positions
- **Looper parameterization:** The Pawn Broker Looper exposes `targetLeverageRatio` (8.0x), `maxLeverageRatio` (8.5x), `leverageBuffer`, `slippage`, `lossLimitRatio`, and `reportBuffer` — all management-configurable and all affecting reported value and liquidation proximity
- **Cross-chain accounting:** Remote `_harvestAndReport()` queues a report back to the origin — via the AggLayer LxLy `onMessageReceived` callback for Katana (8.0% of TVL). The Katana strategy's local `valueOfVault()` reads 0 between bridge reports
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Allocation | Notes |
|-----------|-------------|-----------|-------|
| **Morpho (V1)** | Critical | **60.9%** | 25+ audits, formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk. Unleveraged. Largest single point of failure; 60.4% of the OG vault lends against 3Jane collateral. Morpho Blue also provides looper flashloans |
| **Sky/MakerDAO** | High | **19.9%** | 6.3% direct sUSDS + 8.6% USDS in the GROVE farm + 5.0% via PT-sUSDS. Blue-chip, extensively audited ([report 1.3/5](./sky-usds.md)) |
| **Grove (GROVE rewards)** | Low | 8.6% (yield only) | Grove leg principal is USDS in the Sky-owned farm; GROVE token value determines yield, not principal |
| **Katana L2 + AggLayer (LxLy) + VaultBridgeToken** | Critical | **8.0%** | Newer stack — young (2025) L2, AggLayer bridge, no existing repo report. Effectively non-withdrawable without a bridge round-trip |
| **Pendle** | Critical | **8.5%** | Fixed-maturity PTs (Nov 26 / Dec 17, 2026). Oracle-valued, currently non-withdrawable. 6+ audits, $2B+ TVL |
| **Cap (stcUSD)** | Critical | **7.7% equity / ~$6.94M notional** | [Report 2.39/5](./cap-stcusd.md). 3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock. Levered 7.79x with ~4.7% liquidation headroom |
| **3Jane (USD3)** | High | **3.5% direct; ~36.8% via Morpho OG collateral** | [Report 3.46/5](./3jane-usd3.md), medium-risk credit-based lending. Held directly via PT until Dec 17, 2026, and indirectly as collateral in the OG vault's PT-USD3 and USD3 markets |
| **yvUSDC-1 / Pawn Broker Market** | High | Counterparty | The looper's $6.05M USDC borrow is ~100% of the Market's book; the Market is a ~30.7% strategy of [yvUSDC-1](./yearn-yvusdc.md) |
| **Circle CCTP / Spark / Maple / InfiniFi / Origin / Liquity (ysyBOLD)** | Low | 0% (active, unfunded) | Endorsed and re-fundable by the Debt Allocator without a timelock |

**Dependency concentration:** Morpho V1 OG is **60.9%** of TVL and remains the single largest point of failure. Blue-chip Sky exposure is **19.9%**, including the Grove farm leg. The book still includes a **7.79x levered Cap position (7.7%)** and **two duration-locked Pendle PT positions (8.5%)**, plus a correlated counterparty relationship with yvUSDC-1. The largest issuer concentration is 3Jane (3.46/5): ~40% of TVL on a look-through basis, mostly as Morpho collateral rather than direct holdings.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The Yearn global multisig has 9 named signers including Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others
- **yvUSD governance:** Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations
- **Documentation:** Comprehensive Yearn V3 documentation. yvUSD-specific docs are published on the official Yearn docs site, including cross-chain strategy architecture, LockedyvUSD mechanics, and a dedicated APR API service ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi))
- **Legal:** Yearn Finance has converted its ychad.eth multisig into a BORG (cybernetic organization) via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation company with smart contract governance restrictions. The YFI token governs the protocol via YIP proposals
- **Incident response:** Yearn has demonstrated incident response capability across historical events. V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **Active management intensity:** 47 strategy changes in ~266 days. Four strategies were added and the allocation profile materially reshaped on a single day (June 26, 2026), and two more strategies were added in September 2026. This is a fast-moving book — point-in-time assessments age quickly
- **V3 immutability:** Vault contracts cannot be upgraded — this eliminates proxy upgrade risk but means bugs cannot be patched without deploying a new vault

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring`](https://github.com/yearn/monitoring) repository:

- **Large flow alerts** (`protocols/yearn/alert_large_flows.py`): Monitors deposit/withdrawal events via indexer, alerts on flows exceeding $5M threshold via Telegram. Currently monitors 21 vaults across Ethereum, Base, Arbitrum, and Katana
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`): Runs daily, verifies all Yearn V3 vaults are endorsed onchain via the registry contract
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`): Monitors Yearn TimelockController across 6 chains

- **Shadow-debt check** ([`protocols/yearn/check_shadow_debt.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/check_shadow_debt.py)): alerts when a strategy holds debt but is outside the vault's default queue. yvUSD has a whitelist entry, but it covers only legacy and unfunded strategies. The four funded out-of-queue strategies (Katana, Pawn Broker Looper, both PT Maxis) are not whitelisted, so they are flagged

**Note:** yvUSD is not yet in the monitored vault list in `alert_large_flows.py`, but the infrastructure is in place and can be extended.

Additionally, Yearn provides a dedicated **yvUSD APR API** ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi), [source](https://github.com/yearn/yearn-yvusd-apr-service)) that aggregates onchain vault/strategy accounting with offchain APR oracle computations. Endpoints include `/api/health` (data recency), `/api/aprs` (precomputed APRs and per-strategy debts/weights), and `/api/snapshot` (raw strategy cache). A **DeBank bundle** ([portfolio view](https://debank.com/bundles/221066/portfolio)) provides a consolidated view of all vault fund positions.

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSD Vault | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, `get_default_queue()`, Deposit/Withdraw events |
| **Pawn Broker Looper** | [`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986) | **`getCurrentLTV()`, `getCurrentLeverageRatio()`, `getLiquidateCollateralFactor()`, `balanceOfCollateral()`, `balanceOfDebt()`, `reportBuffer()` — alert on LTV > 89%** |
| **sUSDS Pendle PT Maxi** | [`0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142`](https://etherscan.io/address/0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142) | `openWithdrawals()`, `availableWithdrawLimit()`, `balanceOfPT()`, PT maturity (Nov 26, 2026) |
| **USD3 Pendle PT Maxi** | [`0x62ebE2ca290DB3B649c390847f8204196771B438`](https://etherscan.io/address/0x62ebE2ca290DB3B649c390847f8204196771B438) | `openWithdrawals()`, `availableWithdrawLimit()`, `balanceOfPT()`, PT maturity (Dec 17, 2026) |
| Grove USDS strategy / ysUSDS | [`0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e`](https://etherscan.io/address/0xcaDf62b59406a05754581c31C04f8f7B54AF1e6e) / [`0x47c640fDA687B7D20d50D4464e302e36D3D312Ed`](https://etherscan.io/address/0x47c640fDA687B7D20d50D4464e302e36D3D312Ed) | `availableWithdrawLimit()`, `balanceOfStake()`, GROVE farm `paused()` / `periodFinish()`, LitePSM `tin()`/`tout()` — **alert on any nonzero `tout`** (Grove withdrawals revert) |
| Katana yvUSDC Compounder | [`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C) | Remote-asset staleness, `availableWithdrawLimit()`, bridge message receipt |
| stcUSD (Cap) Vault | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | PPS (`convertToAssets(1e18)`), ERC-1967 implementation slot (upgradeable UUPS proxy), Cap multisig/timelock activity |
| Pawn Broker Market | [`0xe63A2aBC24cD9538398d825a4bFe5778D25687dF`](https://etherscan.io/address/0xe63A2aBC24cD9538398d825a4bFe5778D25687dF) | `totalAssets()`, idle USDC — shared counterparty with yvUSDC-1 |
| LockedyvUSD | [`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040) | Cooldown events, configuration changes, `yvUSD.balanceOf()` (locked share of supply) |
| Strategy Manager (Timelock) | [`0x88ba032be87d5eF1FbE87336b7090767f367bF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336b7090767f367bF73) | Pending operations, MinDelayChange events, role grants/revocations |
| Daddy / ySafe | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer/threshold changes, submitted transactions |
| Brain | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | Signer/threshold changes, submitted transactions, strategy `management` actions |
| Deployer EOA | [`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271) | Fee Splitter governance changes only (0 vault roles) |
| Fee Splitter | [`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470) | Governance changes, fee distribution changes |

### Critical Events to Monitor

- **Pawn Broker Looper LTV** — the single most time-critical metric. Alert if `getCurrentLTV()` exceeds ~89% (against the 91.5% liquidation threshold) or if `getCurrentLeverageRatio()` approaches `maxLeverageRatio` (8.5x)
- **stcUSD price and Cap governance** — stcUSD is the looper's collateral. Monitor stcUSD PPS, ERC-1967 implementation upgrades, and Cap 3-of-5 multisig / 24h timelock activity. A Cap incident propagates directly into a levered yvUSD position
- **PT withdrawal availability** — track `openWithdrawals()` and `availableWithdrawLimit()` on both PT Maxi strategies, and the Nov 26 / Dec 17, 2026 maturities. While false/0, 8.5% of TVL cannot be redeemed
- **Default queue composition** — `get_default_queue()` currently covers only 75.8% of funded debt. Alert on any change, and on any funded strategy that is not in the queue
- **PPS decrease** — any decrease in `convertToAssets(1e6)` indicates a loss event. Should only increase
- **Strategy additions/removals** — `StrategyChanged` events indicate portfolio changes (new strategies go through 7-day timelock; re-funding an existing one does not)
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events, especially any re-funding of the 10 active-but-unfunded strategies (Sentora and ysyBOLD convertors, CCTP lanes, syrupUSDC/sIUSD/wOUSD loopers)
- **LitePSM exit fee** — alert immediately if `tout()` on the LitePSM ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) becomes nonzero. Grove-leg withdrawals (8.6%) then revert, while `availableWithdrawLimit()` still reports them as available
- **Queue settings** — `UpdateDefaultQueue` and `UpdateUseDefaultQueue` events (QUEUE_MANAGER: Brain, Daddy; not timelocked)
- **Emergency actions** — `Shutdown` event on vault
- **Timelock operations** — pending proposals on the TimelockController
- **Signer/threshold changes** on the Daddy (6-of-9) and Brain (3-of-8) Safes
- **Cross-chain strategy accounting** — monitor remote-asset staleness for Katana (AggLayer/LxLy, 8.0%); the strategy's local `valueOfVault()` reads 0, so verify against actual Katana-side positions
- **Pawn Broker Market utilization** — the looper is ~100% of the Market's book, and the Market is ~30.7% of yvUSDC-1. Monitor for correlated stress across both vaults
- **Underlying protocol health** — Morpho V1 (critical, 60.9%; 3Jane collateral share in the OG vault), Sky (19.9%), Pendle (8.5%), Cap (7.7% levered), 3Jane (3.5% direct), Grove reward continuity, and the Katana/AggLayer bridge

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `getCurrentLTV()` / `getCurrentLeverageRatio()` | Pawn Broker Looper | Liquidation proximity | **Hourly** |
| `convertToAssets(1e18)` | stcUSD (Cap) | Collateral price | **Hourly** |
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `availableWithdrawLimit(vault)` | Each funded strategy | Real withdrawability | Daily |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `openWithdrawals()` | PT Maxi strategies | PT exit availability | Daily |
| `tout()` | Sky LitePSM | Grove-leg withdrawability (must be 0) | **Hourly** |
| `get_default_queue()` | Vault | Withdrawal queue composition | Daily |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | Timelock | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~29 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Standard Yearn governance with 7-day timelock:** Standard RoleManager, 7-day TimelockController (`getMinDelay()` = 604,800 s) for critical operations. Daddy/ySafe (6-of-9, publicly known signers) is the sole proposer; the timelock is self-governed (holds TIMELOCK_ADMIN_ROLE). No pending `future_role_manager`
- **Multi-layer security:** Daddy (governance), Brain (operations), Security (emergency), and automated bots (Keeper, Debt Allocator) with differentiated responsibilities. No single point of failure in governance
- **USDC-denominated:** Stablecoin backing eliminates price volatility risk on the underlying asset
- **Excellent onchain verifiability:** every funded position — including the levered one — exposes collateral, debt, LTV, and leverage directly onchain, and the seven `current_debt` values reconcile exactly with `totalDebt()`. The APR API independently reproduces all seven weights
- **~266 days production, monotonically increasing PPS:** PPS up to 1.034081 (~3.41% appreciation, ~4.7% annualized); no decrease observed
- **~37.8% of supply in a 14-day cooldown wrapper:** a committed-duration buffer that exceeds the vault's 24.2% illiquid tail
- **Blue-chip share rising:** Sky exposure is 19.9% after the Grove leg, the only new funded strategy since August
- **No EOA role concentration:** Deployer EOA confirmed at 0 vault roles
- **Rigorous strategy review process:** 12-metric risk scoring framework with ySec security review

### Key Risks

- **7.79x leveraged stcUSD position with ~4.7% liquidation headroom (7.7% of TVL):** the Pawn Broker Looper runs at 87.16% LTV against a 91.50% liquidation threshold, holding ~$6.94M of Cap stcUSD collateral against $6.05M of USDC debt on $889K of vault equity. Cap is governed by a 3-of-5 anonymous multisig with upgradeable UUPS proxies and scores 2.4/5. ~15 weeks of production history
- **8.5% of TVL is not withdrawable at all:** both Pendle PT strategies return `availableWithdrawLimit() = 0` with `openWithdrawals() = false`, locking this slice until maturity (Nov 26 / Dec 17, 2026) or governance action
- **Default queue covers only 75.8% of funded debt:** four of the seven funded strategies — 24.2% of TVL — are outside `get_default_queue()`. With `use_default_queue() = true`, users cannot reach them until a DEBT_MANAGER moves debt to idle or a QUEUE_MANAGER (Brain, Daddy) changes the queue settings. Queue changes would only make the looper directly redeemable; Katana and the PTs report ~0 available
- **Morpho V1 OG concentration (60.9%) and 3Jane look-through (~40%):** still the dominant position, in a vault rated low-mid risk rather than blue-chip. 60.4% of the OG vault lends against 3Jane collateral (PT-USD3 39.1%, USD3 21.3%). Together with the direct USD3 PT strategy (3.5%), ~40% of yvUSD TVL depends on 3Jane collateral or credit. Yearn is actively monitoring 3Jane protocol health and other assets in the Morpho V1 OG vault
- **Katana/AggLayer bridge risk (8.0%):** depends on a young (2025) L2, the AggLayer/LxLy unified bridge, a VaultBridgeToken wrapper, and a remote Yearn vault — value that reads 0 locally and is known only from the last bridged report. `availableWithdrawLimit` is 1 wei. No existing repository report covers this stack
- **Re-introduced oracle and parameter surface:** PT positions are marked via a Pendle oracle; the looper exposes `reportBuffer` and leverage/slippage parameters. Brain (3-of-8) holds `management` on all funded strategies
- **Correlated counterparty with yvUSDC-1:** the looper's $6.05M borrow is ~100% of the Pawn Broker Market's book, and that Market is ~30.7% of yvUSDC-1 — stress in one vault propagates to the other
- **Ten dormant strategies re-fundable without timelock:** the Morpho V2 Sentora and ysyBOLD convertors, both CCTP lanes, and three further loopers remain active at 0 debt and can be re-funded by the Debt Allocator at any time

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by Statemind, ChainSecurity, and yAcademy. ✅ PASS (framework audited; individual strategies lack dedicated external audit)
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions onchain verifiable, including collateral/debt on the levered strategy. ✅ PASS
- [x] **Total centralization** — Standard Yearn governance: Daddy/ySafe 6-of-9 multisig with publicly named signers, 7-day timelock on critical operations, Brain 3-of-8 for operations, Security 4-of-7 for emergency. No EOA vault roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy), plus yAudit on v3.1.0 (used by the Grove leg). The Pawn Broker Looper, both PT Maxi strategies, the Grove strategies, KatanaStrategy, and CCTPStrategy have internal ySec review but no dedicated external audit |
| Bug bounty | $200K on Immunefi (active) + Sherlock bounty |
| Production history | Vault **~266 days** (Jan 19, 2026); the June 26 strategies (16.2% of TVL) **~15 weeks**; the Grove leg (8.6%) **~3 weeks**. V3 framework: ~29 months |
| TVL | **~$11.60M**. Deposit limit: $15M (~77.3% utilized) |
| Security incidents | None on V3; no PPS decrease observed |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 2.5/5** — The underlying V3 framework has solid audit coverage from reputable firms and a clean ~29-month track record. The vault is ~266 days old with ~$11.60M TVL, monotonic PPS, and no incidents. Offsetting this, the vault is still below the 1-year production threshold, and 24.8% of TVL sits in strategies that are less than four months old and externally unaudited at the strategy level, including a 7.8x leveraged position. Katana also remains externally unaudited. Score held.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vaults are **immutable** (no proxy upgrades). Strategies can be added/removed |
| Multisig | 6-of-9 Daddy/ySafe (proposer/executor on timelock) + 3-of-8 Brain (operations) + 4-of-7 Security (emergency) |
| Timelock | **7-day TimelockController** for critical operations (add strategy, change accountant, set max debt). Self-governed: timelock holds TIMELOCK_ADMIN_ROLE |
| Privileged roles | Well-distributed: Daddy (6/9, nearly all roles), Brain (3/8, operational + strategy `management`), Security (4/7, emergency), Keeper + Debt Allocator (bots). No EOA roles (deployer confirmed at bitmask 0x0) |
| Yearn oversight | **Full integration** — same governance framework as yvUSDC-1 and 37+ other Yearn vaults |

**Governance Score: 1.0/5** — Immutable vault contracts (no proxy upgrades). 7-day timelock on critical operations, with Daddy (6-of-9, named signers) as sole proposer. No EOA vault roles. Well-distributed roles across Daddy, Brain (3/8), Security (4/7), and automated bots. Per rubric: immutable contracts + 7+ day timelock + multisig above 3/5 threshold + no EOA roles = score 1. The deployer EOA retains Fee Splitter governance only (low-impact).

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits/withdrawals onchain — but gated by per-strategy `availableWithdrawLimit` and queue membership |
| Strategy reporting | Programmatic via Keeper (yHaaSRelayer) and Debt Allocator |
| Debt allocation | Automated via Debt Allocator, with manual override by DEBT_MANAGER holders |
| PT valuation | Marked via a strategy-configured Pendle oracle (8.5% of TVL); `openWithdrawals` is a management flag currently set to false |
| Looper parameters | `targetLeverageRatio`, `maxLeverageRatio`, `leverageBuffer`, `slippage`, `lossLimitRatio`, `reportBuffer` — all management-set, all affecting reported value |
| Cross-chain | Programmatic — AggLayer `onMessageReceived` for Katana (8.0%) |

**Programmability Score: 2.0/5** — All funds remain onchain and PPS is algorithmic via ERC-4626; reporting is automated and governance cannot arbitrarily move funds. However, the book includes management-configurable valuation and access surfaces: an oracle-marked PT book (8.5%) whose withdrawability is set by a Brain-controlled boolean, and a levered strategy with a `reportBuffer` and management-set leverage/slippage parameters. Out-of-queue debt (24.2%) reaches redeemers only after a DEBT_MANAGER moves it to idle or a QUEUE_MANAGER changes the queue settings, neither of which is timelocked. The Grove leg adds no oracle; it is valued 1:1 in USDS. Score held.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Six material dependencies: Morpho V1 (60.9%), Sky (19.9%), Pendle (8.5%), Katana/AggLayer (8.0%), Cap (7.7% levered), 3Jane (3.5% direct). Grove affects yield only. Plus a counterparty relationship with yvUSDC-1 |
| Criticality | Morpho V1 (critical, 60.9%); Pendle (critical, 8.5%, non-withdrawable); Katana/AggLayer (critical, 8.0%); Cap (critical, levered, 2.4/5); Sky (high, 19.9%); 3Jane (high, 3.5% direct and ~36.8% look-through via OG vault collateral, 3.46/5) |
| Dependency quality | 19.9% blue-chip (Sky); 60.9% low-mid risk Morpho V1 OG, 60.4% of which lends against 3Jane collateral; 8.0% novel Katana/AggLayer; 7.7% Cap (anonymous multisig, upgradeable proxies); 3.5% direct 3Jane credit risk |
| Cross-chain | One active bridge — Polygon AggLayer LxLy + VaultBridgeToken (Katana, 8.0%); CCTP lanes dormant but re-fundable |
| Coupling | Looper is ~100% of the Pawn Broker Market's book; the Market is ~30.7% of yvUSDC-1 |

**Dependencies Score: 3.5/5** — The OG vault's 3Jane collateral share rose to 60.4%. Including the direct PT-USD3 position, ~40% of yvUSD TVL now depends on a single medium-risk credit protocol (3Jane, 3.46/5). The Morpho path gives limited protection. The USD3 market's 91.5% LLTV leaves ~8.5% of buffer, and liquidating USD3 or PT-USD3 collateral needs buyers for an illiquid credit token during exactly the scenario in which 3Jane is stressed. The yvUSDC-1 coupling also deepened: the Market is now ~30.7% of that vault. Cap (2.4/5, anonymous governance, upgradeable proxies, held at 7.8x leverage) remains in the book. The Grove leg lifts blue-chip Sky exposure to 19.9%, but at 8.6% it does not offset the 3Jane concentration. Score raised from 3.0.

**Centralization Score = (1.0 + 2.0 + 3.5) / 3 ≈ 2.17/5**

**Score: 2.17/5** — Governance confirmed onchain (unchanged roles and Safe owner sets since August 8, 2026; standard RoleManager, 7-day timelock, Daddy 6/9 sole proposer, no EOA vault roles, immutable vault) and remains a genuine strength. Programmability carries an oracle-marked, management-gated PT book and a parameterized levered strategy. Dependency quality weakened, with ~40% of TVL dependent on 3Jane on a look-through basis.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-denominated, deployed into DeFi yield strategies |
| Collateral quality | 60.9% low-mid risk Morpho V1 OG (60.4% of it against 3Jane collateral); 19.9% blue-chip Sky (6.3% sUSDS + 8.6% GROVE farm + 5.0% PT); 8.0% cross-chain Katana (novel); 7.7% Cap stcUSD (levered, 2.4/5); 3.5% 3Jane USD3 (3.46/5) |
| Leverage | **7.79x on 7.7% of TVL** — 87.16% LTV vs 91.50% liquidation threshold, ~4.7% headroom, ~$6.94M gross notional on $889K equity |
| Duration | 8.5% locked in fixed-maturity PTs (Nov 26 / Dec 17, 2026) |
| Verifiability | ERC-4626; mainnet positions direct; collateral/debt/LTV all readable onchain; 8.0% on Katana via bridged reports |

**Collateralization Score: 3.0/5** — Onchain USDC backing is fully verifiable and the levered position is unusually transparent. But a 7.8x position with only ~4.7% of price headroom sits on top of Cap, the weakest-governed dependency in the book. The book also holds 8.5% of duration-locked PTs and 8.0% of novel cross-chain infrastructure. The OG vault concentrates 60.4% of its lending against 3Jane collateral. The larger blue-chip share (19.9%) does not offset these factors. Score held.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Mainnet positions verifiable onchain; seven funded debts reconcile exactly with `totalDebt()`; 8.0% (Katana) only via last bridged report (`valueOfVault()` reads 0 locally) |
| Exchange rate | ERC-4626, programmatic, anyone can verify |
| Oracle valuation | 8.5% (PT book) marked via a strategy-configured Pendle oracle; looper exposes `reportBuffer` and slippage parameters |
| Cross-chain lag | 8.0% of TVL on Katana, known to origin via on-chain AggLayer bridge messages |
| Reporting | Automated via keepers with **5-day** profit unlock |

**Provability Score: 2.0/5** — The base vault and mainnet positions are fully verifiable, debts reconcile to the wei, and the levered position's collateral, debt, and LTV are all directly readable. Offsetting this, the PT book (8.5%) is oracle-marked rather than redeemable-at-par, the looper carries a management-set `reportBuffer`, and 8.0% remains behind a bridge with `valueOfVault()` reading 0 locally. Score held.

**Funds Management Score = (3.0 + 2.0) / 2 = 2.5**

**Score: 2.5/5** — Collateral quality is mixed and includes a materially levered leg; provability is solid on the mainnet book but weakened by oracle-marked PTs and the bridged Katana slice.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption for USDC — but gated by default-queue membership (`use_default_queue() = true`) and per-strategy withdraw limits |
| Liquidity depth | 0 idle. **Only 75.8% reachable via the default queue** (60.9% Morpho V1 OG + 8.6% Grove USDS + 6.3% Sky sUSDS); 60.9% of that is a low-mid risk venue, not blue-chip |
| Hard-locked | **8.5%** in Pendle PTs with `availableWithdrawLimit() = 0` and `openWithdrawals() = false` until Nov 26 / Dec 17, 2026 |
| Cross-chain | 8.0% needs an AggLayer bridge round-trip (Katana); local `availableWithdrawLimit` = 1 wei |
| Looper | 7.7% withdrawable in principle, but out of queue; a DEBT_MANAGER (`update_debt`) or QUEUE_MANAGER (queue change) must act first, and exit deleverages a 7.8x position via flashloan |
| Same-value asset | USDC-denominated — no price impact risk |
| Deposit limit | $15M cap (~77.3% utilized) |
| Locked supply | ~37.8% of yvUSD locked in LockedyvUSD (14-day cooldown) — committed-duration buffer exceeding the 24.2% illiquid tail |

**Score: 3.25/5** — The USDC denomination eliminates price divergence risk, and the ~37.8% locked-supply buffer is a genuine structural mitigant that now clearly exceeds the 24.2% held outside the queue. The Grove leg is in the queue and fully withdrawable, so queue coverage improved to 75.8%. The PT positions mature within ~2 months. But the funded book and the withdrawal queue still diverge: 8.5% is hard-locked until late November / mid-December 2026 behind a management-controlled flag, 8.0% requires a bridge round-trip, and 7.7% must be deleveraged from a 7.8x position. None of the 24.2% outside the queue can be reached by redeemers until a DEBT_MANAGER moves it to idle or a QUEUE_MANAGER changes the queue. The 8.6% Grove leg is in the queue but reverts on exit if Sky sets a nonzero PSM `tout`. Sustained redemptions would drain the liquid tranche first and leave remaining holders concentrated in the illiquid, levered residue. Score lowered from 3.5; the PT maturities are a natural point to revisit.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020 |
| Vault management | Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation. 7-day timelock on critical operations |
| Documentation | V3 docs comprehensive. yvUSD-specific docs published on official Yearn docs site, plus a dedicated APR API that publishes per-strategy debts and weights |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Yearn has demonstrated capability across historical events. V3 untested under stress |
| Monitoring | Active large-flow alerts, daily endorsed-vault checks, timelock monitoring across 6 chains, and a shadow-debt check that covers yvUSD. yvUSD not yet in the large-flow vault list; no LTV alerting yet on the levered strategy |
| Management intensity | 47 strategy changes in ~266 days; the book was materially reshaped in a single day (June 26, 2026), and two more strategies were added in September 2026 |

**Score: 1.5/5** — Yearn's brand, track record, and known team provide high confidence, and the public APR API makes the book unusually easy to audit externally. The vault uses the standard Yearn governance framework, has comprehensive documentation, active Immunefi + Sherlock bounties, and demonstrated incident response. Held at 1.5 despite the fast rate of portfolio change, since the changes are executed through the documented role structure.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 2.17 | 30% | 0.65 |
| Funds Management | 2.5 | 30% | 0.75 |
| Liquidity Risk | 3.25 | 15% | 0.49 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.46/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.46/5.0) — enhanced monitoring recommended**

The weighted score is 2.46, inside the Low Risk tier (scores below 2.50) but only 0.04 from Medium Risk. The reports list floors it to 2.4. Given the 7.8x leveraged position with ~4.7% of liquidation headroom and the 8.5% of TVL that is currently non-withdrawable, the monitoring posture set out above — hourly LTV and stcUSD price alerting, daily withdrawability and queue checks — should be treated as a condition of the approval rather than optional.

**Score rationale:** The vault retains battle-tested Yearn V3 infrastructure (~29 months, no exploits), an immutable design, strong governance with a 7-day timelock, and excellent onchain verifiability — the seven funded debts reconcile to the wei with `totalDebt()` and are independently reproduced by the public APR API.

The score moves from 2.45 to 2.46, but the drivers have shifted. **3Jane concentration is now the main risk.** 60.4% of the Morpho V1 OG vault lends against 3Jane collateral, so ~40% of yvUSD TVL depends on 3Jane including the direct PT-USD3 position. The Dependencies subscore rises to 3.5. Liquidity improved, and that subscore falls to 3.25. The new Grove leg (8.6%) is in the default queue and keeps principal in USDS inside a Sky-owned farm, lifting blue-chip exposure to 19.9% and queue coverage to 75.8%. The locked-supply buffer (37.8%) now clearly exceeds the out-of-queue tail (24.2%). TVL growth also diluted the levered Cap position to 7.7% and the non-withdrawable PT book to 8.5%. The yvUSDC-1 coupling also deepened, with the Pawn Broker Market at ~30.7% of that vault. The **7.79x leveraged Cap stcUSD position with ~4.7% of liquidation headroom** and the PT positions that the vault cannot withdraw from remain in place. The ~37.8% locked-supply buffer is the main structural offset to the liquidity mismatch.

---

## Reassessment Triggers

- **Time-based:** Reassess at the PT maturities (Nov 26 / Dec 17, 2026), when the 8.5% PT book should convert to withdrawable assets
- **Leverage-based:** Reassess immediately if the Pawn Broker Looper's `getCurrentLTV()` exceeds 89%, if `getCurrentLeverageRatio()` approaches 8.5x, if `targetLeverageRatio` is raised, or if the position's share of TVL exceeds 15%
- **Cap-based:** Reassess on any stcUSD implementation upgrade, Cap multisig/threshold change, stcUSD depeg beyond 1%, or a change to the [Cap stcUSD report](./cap-stcusd.md) score
- **Liquidity-based:** Reassess if the share of TVL outside `get_default_queue()` exceeds 35%, if `availableWithdrawLimit()` on any funded strategy falls to 0, or if `openWithdrawals` is flipped on either PT strategy, if the LitePSM `tout` becomes nonzero (Grove withdrawals revert), or if `use_default_queue` / the default queue is changed
- **TVL-based:** Reassess if TVL exceeds $20M, or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, or underlying protocol incident — especially **Morpho V1, Cap, Pendle, 3Jane, the AggLayer/Katana bridge, or Sky**
- **Governance-based:** Reassess if the timelock delay is modified, Safe compositions change (signer/threshold), or the Fee Splitter governance is transferred from the deployer EOA to the multisig
- **Cross-chain-based:** Reassess if cross-chain exposure exceeds ~20% of TVL, if a new remote chain/bridge is funded (e.g. the Base or Arbitrum CCTP strategies activate), or if any bridge experiences downtime or a fault
- **Audit-based:** Reassess if the Pawn Broker Looper, PT Maxi strategies, Grove strategies, KatanaStrategy, or CCTPStrategy receive dedicated external audits (should improve the Audits score)
- **Strategy-based:** Reassess if Morpho V1 concentration exceeds ~75% of TVL, if the OG vault's 3Jane collateral share (PT-USD3 + USD3 markets) exceeds ~70%, if any of the 10 active-but-unfunded strategies (convertors, CCTP lanes, additional loopers) is re-funded, if the GROVE farm is paused or its rewards stop, or if a further leveraged strategy is added
- **Counterparty-based:** Reassess if the Pawn Broker Market's composition changes materially, or if the [yvUSDC-1 report](./yearn-yvusdc.md) score changes

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [March 13, 2026](https://github.com/yearn/risk-score/pull/89) | 2.6 | Initial assessment |
| [April 3, 2026](https://github.com/yearn/risk-score/pull/126) | 2.3 | Reassessment: governance maturation — 7-day TimelockController confirmed, deployer EOA at 0 vault roles |
| [June 8, 2026](https://github.com/yearn/risk-score/pull/241) | 2.4 | Reassessment: TVL +187% to ~$11.56M; Morpho V2 Sentora PYUSD/RLUSD convertors and Katana cross-chain leg funded |
| [August 8, 2026](https://github.com/yearn/risk-score/pull/390) | 2.45 | Reassessment: convertors and Arbitrum looper de-funded; Morpho V1 OG to 62.4%; three June 26 strategies funded at 20.2% — 7.90x leveraged Cap stcUSD looper (9.5%) and two Pendle PT positions (10.7%) that are currently non-withdrawable. Collateralization, Provability, Programmability and Liquidity subscores all raised |
| [October 12, 2026](https://github.com/yearn/risk-score/pull/523) | 2.46 | Reassessment: TVL to ~$11.60M; new Grove USDS Compounder funded at 8.6% (Sky GROVE farm, in default queue), lifting queue coverage to 75.8% and Sky exposure to 19.9%; Morpho V1 OG 3Jane collateral share up to 60.4% (~40% look-through); Pawn Broker Market now ~30.7% of yvUSDC-1. Dependencies raised to 3.5 (3Jane concentration); Liquidity lowered to 3.25 |

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
│  │  TVL ~$11.60M         │        │  ~37.8% of supply locked     │  │
│  │  deposit() / redeem() │        │  0xAaaF...9040               │  │
│  │  totalAssets()        │        └──────────────────────────────┘  │
│  └──────────┬────────────┘                                           │
│             │ 17 active strategies — 7 funded                        │
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  FUNDED STRATEGIES (by allocation)                               ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ MORPHO V1 LENDING (60.9%)              ✅ in queue      │    ││
│  │  │  Morpho Yearn OG USDC Compounder      low-mid risk     │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌──────────────────────────┐  ┌────────────────────────────┐  ││
│  │  │ SKY USDS STAKING (8.6%)  │  │ CROSS-CHAIN (8.0%)         │  ││
│  │  │  Grove USDS Compounder   │  │  Katana yvUSDC Compounder  │  ││
│  │  │  LitePSM → GROVE farm    │  │  AggLayer LxLy             │  ││
│  │  │  ✅ in queue             │  │  ❌ not in queue, awl≈0    │  ││
│  │  └──────────────────────────┘  └────────────────────────────┘  ││
│  │  ┌──────────────────────────┐  ┌────────────────────────────┐  ││
│  │  │ LEVERAGED (7.7%)         │  │ SKY LENDING (6.3%)         │  ││
│  │  │  stcUSD/USDC Pawn Broker │  │  sUSDS Depositor           │  ││
│  │  │  Looper — 7.79x, 87.2%   │  │  (blue-chip)               │  ││
│  │  │  LTV vs 91.5% liq. thr.  │  │  ✅ in queue               │  ││
│  │  │  ❌ not in queue         │  └────────────────────────────┘  ││
│  │  └──────────────────────────┘  ┌────────────────────────────┐  ││
│  │                                │ PENDLE PT (8.5%)           │  ││
│  │                                │  PT-sUSDS 26NOV26   5.0%   │  ││
│  │                                │  PT-USD3  17DEC26   3.5%   │  ││
│  │                                │  ❌ not in queue           │  ││
│  │                                │  ⛔ availableWithdraw = 0  │  ││
│  │                                └────────────────────────────┘  ││
│  │                                                                  ││
│  │  Active but unfunded (10, 0 debt): Spark USDS, Base CCTP,       ││
│  │  sIUSD looper, USD3 PT (legacy), wOUSD looper, syrupUSDC        ││
│  │  looper, Arbitrum syrupUSDC (CCTP), Sentora PYUSD/RLUSD and     ││
│  │  ysyBOLD convertors — all re-fundable without a new timelock    ││
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
│  │  OG USDC     │  │  AggLayer    │  │  sUSDS, USDS │               │
│  │  low-mid risk│  │  LxLy Bridge │  │  GROVE farm  │               │
│  │  60.9%       │  │  8.0%        │  │  19.9% total │               │
│  └──────┬───────┘  └──────────────┘  └──────────────┘               │
│         │ 60.4% of OG lends against 3Jane collateral                 │
│  ┌──────┴───────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Cap stcUSD  │  │  Pendle      │  │  3Jane USD3  │               │
│  │  2.4/5       │  │  PT market   │  │  3.46/5      │               │
│  │  7.7% equity │  │  8.5% held   │  │  3.5% via PT │               │
│  │  ~$6.94M lev.│  │  as PTs      │  │  ~40% look-  │               │
│  │              │  │              │  │  through     │               │
│  └──────┬───────┘  └──────────────┘  └──────────────┘               │
│         │ collateral in                                              │
│  ┌──────▼─────────────────────────┐                                 │
│  │  stcUSD/USDC Pawn Broker Market│  ← also ~30.7% of yvUSDC-1;     │
│  │  0xe63A...87dF  ($6.05M book)  │     yvUSD's looper is ~100% of  │
│  └────────────────────────────────┘     its borrowings              │
└───────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → yvUSD vault → strategies deploy to
Morpho V1 (60.9%), the Sky GROVE farm via LitePSM + ysUSDS (8.6%),
Katana L2 via AggLayer LxLy (8.0%), a 7.79x levered Cap stcUSD carry
via the Pawn Broker Market (7.7% equity), Sky sUSDS (6.3% direct), and
Pendle PTs on sUSDS + USD3 (8.5%, non-withdrawable until Nov/Dec 2026).
Only the Morpho V1, Grove, and sUSDS legs (75.8%) sit in the default
withdrawal queue. Profits reported by Keeper, locked for 5 days.
Optional: user locks yvUSD in LockedyvUSD for a 10% bonus yield
(14d cooldown); ~37.8% of supply is locked.
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
