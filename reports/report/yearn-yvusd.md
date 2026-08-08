# Protocol Risk Assessment: Yearn — yvUSD

- **Assessment Date:** August 8, 2026
- **Token:** yvUSD (USD yVault)
- **Chain:** Ethereum (with cross-chain strategies on Arbitrum, Katana, and Base)
- **Token Address:** [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987)
- **Final Score: 2.5/5.0**

## Overview + Links

yvUSD is a **USDC-denominated cross-chain Yearn V3 vault** (ERC-4626) that deploys deposited USDC into multiple yield strategies across Ethereum mainnet and three remote chains (Arbitrum, Katana, Base). The vault uses **two distinct cross-chain mechanisms** to bridge assets to strategies on remote chains: **Circle's CCTP (Cross-Chain Transfer Protocol)** for Arbitrum and Base, and the **Polygon AggLayer LxLy unified bridge (via a VaultBridgeToken)** for Katana — requiring only strategy contracts on those chains rather than full Yearn V3 infrastructure.

All onchain figures in this report were read at **block 25,712,057** (August 8, 2026) via `cast` against Ethereum mainnet, and independently corroborated against the [yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs) strategy snapshot.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting USDC deposits, issuing yvUSD shares
- **Cross-chain strategies (CCTP):** Use a two-contract pattern — an origin `CCTPStrategy` on Ethereum and a remote `CCTPRemoteStrategy` (ERC-4626 variant) on the destination chain. The origin strategy restricts deposits to a single `DEPOSITER` address (the yvUSD vault itself). When `report()` is called on the destination chain, `_harvestAndReport()` reports new assets back to the origin by queuing a CCTP message — no separate keeper relay required. The origin receives updates via `handleReceiveFinalizedMessage` and tracks remote capital via a `remoteAssets` variable. The Arbitrum and Base CCTP strategies are active but currently hold 0 debt
- **Cross-chain strategy (AggLayer/Katana):** A `KatanaStrategy` ([`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C)) wraps USDC into a **VaultBridgeToken** ([`0x53E82ABbb12638F09d9e624578ccB666217a765e`](https://etherscan.io/address/0x53E82ABbb12638F09d9e624578ccB666217a765e)) and bridges it to a remote counterpart on **Katana** (AggLayer network ID 20) via the Polygon zkEVM/AggLayer LxLy unified bridge. Reports return through the bridge's `onMessageReceived` callback. This is the only active cross-chain position with material debt (10.1% of TVL)
- **Leveraged looper:** A `stcUSD/USDC Pawn Broker Looper` ([`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986)) posts **stcUSD** (Cap protocol) as collateral into the `stcUSD/USDC Pawn Broker Market` and borrows USDC against it, recycling proceeds to build a levered position. Running at **7.90x leverage** and **87.3% LTV** against a **91.5%** liquidation threshold at the snapshot
- **Pendle PT strategies:** Two `Pendle PT Maxi` strategies hold fixed-maturity Principal Tokens — `PT-sUSDS-26NOV2026` and `PT-USD3-17DEC2026`. Both have `openWithdrawals() = false` and report `availableWithdrawLimit() = 0`, so the vault **cannot withdraw from them at all** at the snapshot
- **LockedyvUSD:** Companion cooldown wrapper where users lock yvUSD shares for additional yield (10% locker bonus per the APR oracle). Users locking shares gives the vault better guarantees on duration risk, enabling higher-yield strategies without sacrificing atomic liquidity for non-lockers. Cooldown: 14 days (`cooldownDuration` = 1,209,600 s, confirmed onchain), withdraw window: 5 days (configurable). Also serves as the vault's accountant ([`0xAaaFEa48472f77563961Cdb53291DEDfB46F9040`](https://etherscan.io/address/0xAaaFEa48472f77563961Cdb53291DEDfB46F9040), confirmed onchain). **~33.8% of yvUSD supply is locked here** (LockedyvUSD holds 3,008,265 yvUSD of the 8,912,607 total supply, via `yvUSD.balanceOf(LockedyvUSD)`)
- **Strategies:** **15 active strategies — 6 funded, 9 at 0 debt** — deploying into Morpho V1, a remote Yearn yvUSDC vault on Katana, Sky/MakerDAO (directly and via Pendle PT), Cap stcUSD (levered), and 3Jane USD3 (via Pendle PT). A further 15 strategies have been revoked over the vault's life. The Morpho V2 Sentora PYUSD/RLUSD convertors and the Arbitrum syrupUSDC looper remain active-but-unfunded
- **Yield sources:** Curated Morpho V1 lending (Yearn OG USDC vault), a cross-chain Yearn yvUSDC compounder on Katana, a levered stcUSD carry trade, Sky savings (sUSDS) both directly and as a Pendle PT, and 3Jane USD3 as a Pendle PT

**Key metrics (August 8, 2026, block 25,712,057):**

- **TVL:** ~$9,119,103 USDC (`totalAssets()` = 9,119,102.639999, confirmed onchain)
- **Total Supply:** ~8,912,607 yvUSD
- **Price Per Share:** 1.023168 USDC/yvUSD (`convertToAssets(1e6)`; ~2.32% appreciation since the Jan 19 inception, ~4.2% annualized)
- **Total Debt:** 100% deployed (`totalDebt()` = `totalAssets()`, `totalIdle()` = 0)
- **Deposit Limit:** $15,000,000 (~60.8% utilized)
- **Profit Max Unlock Time:** 5 days (432,000 s)
- **Net APR:** 5.16% | **APY:** 5.29% ([yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs); gross APR ~5.73%, 0% management/performance fee, 10% locker bonus)

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

### Active Strategies (15 — 6 funded, 9 at 0 debt)

The strategy set is enumerated by replaying all 45 `StrategyChanged` events since deployment (block 24,271,831): 15 strategies are currently in the `ADDED` state and 15 have been `REVOKED`. Debts and allocations are confirmed onchain via `strategies(address).current_debt`; the six funded debts sum to **9,119,102.639999 USDC**, matching `totalDebt()` exactly. Withdrawal-queue membership comes from `get_default_queue()`; withdrawability comes from each strategy's `availableWithdrawLimit(vault)`.

#### Funded strategies (6)

| # | Strategy | Name | Current Debt (USDC) | Allocation | In default queue? | Withdrawable now | Protocols / Venue |
|---|----------|------|--------------------:|-----------:|-------------------|-----------------:|-------------------|
| 1 | [`0x0e297dE4005883C757c9F09fdF7cF1363C20e626`](https://etherscan.io/address/0x0e297dE4005883C757c9F09fdF7cF1363C20e626) | Morpho Yearn OG USDC Compounder | 5,688,704.15 | **62.4%** | ✅ Yes | Full | Morpho V1 (Yearn OG USDC vault [`0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49`](https://etherscan.io/address/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49)) |
| 2 | [`0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C`](https://etherscan.io/address/0xc5b16E7eFe1CA05714477b8edcAb4deE9b93a27C) | Katana yvUSDC Compounder | 920,999.82 | 10.1% | ❌ No | **~0** (`availableWithdrawLimit` = 1 wei) | **Katana L2** (remote yvUSDC), AggLayer LxLy bridge, VaultBridgeToken |
| 3 | [`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986) | **stcUSD/USDC Pawn Broker Looper** | 869,584.70 | 9.5% | ❌ No | Full (requires deleverage) | **Cap stcUSD** collateral, [Pawn Broker Market](https://etherscan.io/address/0xe63A2aBC24cD9538398d825a4bFe5778D25687dF), Morpho Blue flashloans. **7.90x leverage** |
| 4 | [`0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D`](https://etherscan.io/address/0xdA2f1B3CBa732d779cfF56f0cF9d3Bc8AEA6Cd8D) | USDC To sUSDS Depositor | 663,490.08 | 7.3% | ✅ Yes | Full | Sky/MakerDAO (sUSDS [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) |
| 5 | [`0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142`](https://etherscan.io/address/0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142) | **sUSDS Pendle PT Maxi** | 575,327.90 | 6.3% | ❌ No | **0** (`openWithdrawals` = false) | Pendle [`PT-sUSDS-26NOV2026`](https://etherscan.io/address/0xdC169AbE56461A2E0c034Da431Ac2a3ebf596094), Sky sUSDS |
| 6 | [`0x62ebE2ca290DB3B649c390847f8204196771B438`](https://etherscan.io/address/0x62ebE2ca290DB3B649c390847f8204196771B438) | **USD3 Pendle PT Maxi** | 400,995.98 | 4.4% | ❌ No | **0** (`openWithdrawals` = false) | Pendle [`PT-USD3-17DEC2026`](https://etherscan.io/address/0x7f47c3e6b2c00fC4eB4d5Ae50d0Ab0Ab6888Eb4D), 3Jane USD3 |
| | | **Total** | **9,119,102.64** | **100.0%** | | | |

All six weights are independently reproduced by the [yvUSD APR API](https://yvusd-api.yearn.fi/api/aprs) (`meta.strategies[].weight`): 0.6238, 0.1010, 0.0954, 0.0728, 0.0631, 0.0440.

Strategies 3, 5, and 6 were all activated on **June 26, 2026** — roughly six weeks before this snapshot.

#### Active but unfunded (9, all at 0 debt)

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

These 9 remain endorsed and can be re-funded by the Debt Allocator **without a new timelock proposal**, so their risk surfaces (convertor auctions, CCTP lanes, additional loopers) are dormant rather than removed.

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

`get_default_queue()` returns **5 strategies**, only **2 of which are funded**:

1. `0xdA2f1B3C…` USDC To sUSDS Depositor — 7.3% funded
2. `0x9e0A5943…` USDC To Spark USDS Depositor — 0 debt
3. `0x0e297dE4…` Morpho Yearn OG USDC Compounder — 62.4% funded
4. `0x908244B6…` Base Yearn Morpho OG USDC — 0 debt
5. `0xF0FEC260…` sIUSD/USDC Morpho Looper — 0 debt

**Consequence:** only **69.7% of TVL** (Morpho OG 62.4% + sUSDS 7.3%) is reachable by a standard `withdraw()`/`redeem()` call. The remaining **30.3%** — Katana (10.1%), Pawn Broker Looper (9.5%), and the two Pendle PT strategies (10.7%) — sits outside the default queue and requires either a targeted `redeem(uint256,address,address,uint256)` with an explicit strategy list, a bridge round-trip, or (for the PT positions) governance action. See [Liquidity Risk](#liquidity-risk).

### Strategy Protocol Dependencies with Existing Reports

Several underlying protocols have been previously assessed in this repository:

| Protocol | Report Score | yvUSD Allocation |
|----------|-------------|-----------------|
| [Cap (stcUSD)](./cap-stcusd.md) | **2.4/5** (Low Risk) | **9.5%** equity — ~$6.87M stcUSD collateral notional at 7.90x leverage |
| [3Jane USD3](./3jane-usd3.md) | **3.4/5** (Medium Risk) | **4.4%** via `PT-USD3-17DEC2026` |
| [Sky USDS](./sky-usds.md) | **1.3/5** (Minimal Risk) | **13.6%** — 7.3% direct sUSDS + 6.3% via `PT-sUSDS-26NOV2026` |
| [Yearn yvUSDC-1](./yearn-yvusdc.md) | **1.5/5** (Minimal Risk) | Counterparty — yvUSDC-1 funds the Pawn Broker Market this vault borrows from |
| [Spectra](./spectra-finance.md) | **2.33/5** (Low Risk) | 0% — PT infrastructure only |
| [InfiniFi](./infinifi.md) | **3.2/5** (Medium Risk) | 0% (active, unfunded) |
| [Maple syrupUSDC](./maple-syrupusdc.md) | **2.33/5** (Low Risk) | 0% (active, unfunded) |
| [Fluid](./fluid.md) | **2.6/5** (Medium Risk) | 0% (revoked) |

Underlying venues **without** an existing repository report — **Morpho V1** (62.4%), **Katana L2 + AggLayer LxLy bridge** (10.1%), and **Pendle** (10.7% of TVL held as PTs) — are assessed inline in this report and flagged as uncovered-dependency risk.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

The underlying vault infrastructure has been audited by 3 reputable firms:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### yvUSD-Specific Audits

No external third-party audit specifically covering the CCTPStrategy cross-chain code, the KatanaStrategy, the Pawn Broker Looper, the Pendle PT Maxi strategies, or the LockedyvUSD cooldown wrapper was found. The **CCTPStrategy has undergone strict internal review by ySec** (Yearn's security team), and all strategies go through Yearn's internal review process (see below). The three highest-complexity funded strategies — the 7.9x leveraged Pawn Broker Looper and the two PT Maxi strategies — were activated on June 26, 2026 and have **~6 weeks of production history** with no dedicated external audit.

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
| Morpho (V1) | 25+ audits (Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora) | Formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk. **62.4% of TVL**. Morpho Blue is also the flashloan venue for the Pawn Broker Looper |
| Pendle | 6+ audits (Ackee, Dedaub, ChainSecurity, Spearbit, Code4rena) | Well-established. **10.7% of TVL** now held as fixed-maturity PTs (Nov 26 and Dec 17, 2026) |
| Cap (stcUSD) | 8 audit firms / 9 reports (Trail of Bits, Spearbit, Zellic, Electisec, Certora), $1M Sherlock bug bounty | **9.5% of TVL as equity, ~$6.87M collateral notional at 7.90x leverage.** Assessed internally at [2.4/5.0](./cap-stcusd.md). Governance is a 3-of-5 anonymous multisig → 24h timelock, all core contracts upgradeable UUPS proxies |
| Sky/MakerDAO | Extensively audited across many years | Blue-chip. 13.6% combined (7.3% direct sUSDS + 6.3% via PT-sUSDS) |
| 3Jane (USD3) | See [3Jane USD3 report](./3jane-usd3.md) (3.4/5) | 4.4% via PT-USD3. Credit-based lending, medium risk |
| Polygon AggLayer (LxLy) + VaultBridgeToken | AggLayer/zkEVM bridge audited; VaultBridgeToken wrapper is **newer infrastructure** | ~10.1% Katana exposure. Katana is a young (2025) L2; bridge + wrapper not yet covered by an existing repo report — flagged as novel |
| Circle CCTP | ChainSecurity (V1 2023, V2 March 2025, V2 update April 2025, Gateway July 2025) | Trust-minimized bridge (Arbitrum/Base — CCTP strategies active but at 0 debt) |
| Spark | Inherits MakerDAO audit coverage | Blue-chip (active, 0 debt) |

### Bug Bounty

- **Immunefi:** Active bug bounty for Yearn Finance. Max payout: **$200,000** (Critical). Scope includes V3 vaults (`VaultV3.vy`, `VaultFactory.vy`).
  - Link: https://immunefi.com/bounty/yearnfinance/
- **Sherlock:** Also listed: https://audits.sherlock.xyz/bug-bounties/30
- **Safe Harbor:** Not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

- **15 active strategies** (6 funded) spanning up to 3 chains (Ethereum + Katana + Base; Arbitrum strategy active but unfunded)
- **One cross-chain mechanism with active debt:** the Polygon AggLayer LxLy bridge + VaultBridgeToken (Katana, ~10.1%); CCTP strategies (Arbitrum, Base) are at 0 debt
- **One leveraged looper funded at 7.90x** (Pawn Broker Looper, 9.5% of TVL) — flashloan-assisted, with liquidation risk, a `reportBuffer` parameter, and slippage/loss-limit controls
- **Two fixed-maturity Pendle PT positions** (10.7% of TVL) valued through a Pendle oracle and currently non-withdrawable
- **Convertor strategies dormant, not removed** — the Morpho V2 Sentora PYUSD/RLUSD convertors remain active at 0 debt and can be re-funded by the Debt Allocator without a timelock
- **Custom accountant** (LockedyvUSD) combining cooldown/locking mechanics with fee management
- **Inter-vault coupling** — the Pawn Broker Looper's USDC is borrowed from the Pawn Broker Market, which is itself a funded strategy of yvUSDC-1
- **V3 vault itself is non-upgradeable** (immutable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** January 19, 2026 (block 24271831) — **~201 days** in production
- **TVL:** ~$9.12M USDC. Deposit limit: $15M (~60.8% utilized)
- **PPS trend:** 1.000000 → 1.023168 — ~2.32% appreciation since inception, ~4.2% annualized; no PPS decrease observed
- **Security incidents:** None known for this vault or Yearn V3 generally
- **Strategy changes:** 45 `StrategyChanged` events over ~201 days — 15 additions currently active, 15 revocations. The portfolio has turned over aggressively: on **June 26, 2026** four new strategies were added (Pawn Broker Looper, sUSDS PT Maxi, USD3 PT Maxi, wOUSD Morpho Looper), of which three are now funded at a combined **20.2%** of TVL. The Morpho V1 OG position was simultaneously reduced. The Morpho V2 Sentora convertors and the Arbitrum syrupUSDC looper were de-funded but remain active
- **Governance:** Standard Yearn RoleManager, 7-day timelock (`getMinDelay()` = 604,800 s), Daddy bitmask `0x3FF6`, no pending `future_role_manager`, vault not shut down
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~27 months). No V3 vault exploits

**Yearn protocol TVL:** ~$177M total across all chains (DeFi Llama, August 2026).

## Funds Management

yvUSD deploys deposited USDC across 15 active strategies (6 funded) with 100% capital utilization (0 idle). The funded book falls into five categories.

### Strategy Positions by Category

**1. Morpho V1 Lending — mainnet (62.4% of TVL)**

- Morpho Yearn OG USDC Compounder (62.4%, $5,688,704) — deposits USDC into the Yearn-curated **Morpho V1** "Yearn OG USDC" vault ([`0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49`](https://etherscan.io/address/0xF9bdDd4A9b3A45f980e11fDDE96e16364dDBEc49)). Unleveraged lending compounder. 25+ audits with formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk.

**Lending risk:** Morpho V1 has 25+ audits and formal verification, but the Yearn OG USDC vault is rated low-mid risk, not blue-chip. The vault is unleveraged and curated. This remains the single largest position and the single largest point of failure.

**2. Cross-Chain Compounder — Katana (10.1% of TVL)**

- Katana yvUSDC Compounder (10.1%, $920,999) — wraps USDC into a **VaultBridgeToken** ([`0x53E82ABbb12638F09d9e624578ccB666217a765e`](https://etherscan.io/address/0x53E82ABbb12638F09d9e624578ccB666217a765e)) and bridges to **Katana L2** (AggLayer network ID 20) via the Polygon AggLayer LxLy unified bridge, where a remote counterpart deposits into a Yearn yvUSDC vault. This is the **only active cross-chain position** with material debt.

**Cross-chain risk:** Novel dependency stack — a young (2025) L2, the AggLayer/LxLy bridge, the VaultBridgeToken wrapper, and a remote Yearn vault — none of which have an existing repository report. The strategy's `availableWithdrawLimit()` reads **1 wei**, so this slice is effectively non-withdrawable on demand; exiting requires a bridge round-trip and claim. The local `valueOfVault()` reads 0 between bridge reports, so ~10% of TVL is known to the origin only via on-chain bridge messages.

**3. Leveraged stcUSD Carry — Pawn Broker Looper (9.5% of TVL)**

- stcUSD/USDC Pawn Broker Looper (9.5%, $869,585 equity) — posts **stcUSD** ([`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), Cap's staked-USD ERC-4626 token) as collateral into the **stcUSD/USDC Pawn Broker Market** ([`0xe63A2aBC24cD9538398d825a4bFe5778D25687dF`](https://etherscan.io/address/0xe63A2aBC24cD9538398d825a4bFe5778D25687dF)) and borrows USDC against it, using Morpho Blue flashloans to build the position.

Onchain state at the snapshot:

| Metric | Value |
|--------|-------|
| `balanceOfCollateral()` | 6,392,939.74 stcUSD (~$6.87M) |
| `balanceOfDebt()` | 5,997,837 USDC |
| Net equity (`totalAssets()`) | 869,328 USDC |
| `getCurrentLeverageRatio()` | **7.90x** (target 8.00x, max 8.50x) |
| `getCurrentLTV()` | **87.34%** |
| `getLiquidateCollateralFactor()` | **91.50%** |
| Headroom to liquidation | **~4.5%** decline in stcUSD/USDC |

**Leverage risk:** This is the vault's highest-risk position by a wide margin. A ~4.5% adverse move in the stcUSD/USDC price — a Cap depeg, a reserve loss, an operator default, or an oracle disagreement — would push the position into liquidation and can wipe out most or all of the 9.5% equity. Cap governs stcUSD through a **3-of-5 anonymous Gnosis Safe multisig → 24h timelock**, with all core contracts on **upgradeable UUPS proxies** (see the [Cap stcUSD report](./cap-stcusd.md), 2.4/5.0). The position was opened only ~6 weeks before this snapshot.

**Inter-vault coupling:** the Pawn Broker Market held $6,170,257 of total assets at the snapshot, of which this strategy has borrowed $5,997,837 — **~97%**. The Market is itself a funded strategy of [yvUSDC-1](./yearn-yvusdc.md) (~14.9% of that vault). yvUSD's leveraged borrower is therefore effectively the sole counterparty to a material yvUSDC-1 position, and the two vaults' risk is correlated through a single Cap-collateralised credit book.

**4. Sky Lending (7.3% direct, 13.6% including PT)**

- USDC To sUSDS Depositor (7.3%, $663,490) — deposits into Sky/MakerDAO Savings USDS (sUSDS, [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD))

**Lending risk:** Standard DeFi lending risk. Sky is blue-chip with extensive audit coverage and deep liquidity. Combined with the sUSDS PT position below, total Sky exposure is 13.6%.

**5. Pendle Principal Tokens (10.7% of TVL)**

| Strategy | Allocation | Principal Token | Maturity | Underlying |
|----------|-----------:|-----------------|----------|------------|
| sUSDS Pendle PT Maxi | 6.3% | [`PT-sUSDS-26NOV2026`](https://etherscan.io/address/0xdC169AbE56461A2E0c034Da431Ac2a3ebf596094) | Nov 26, 2026 | Sky sUSDS |
| USD3 Pendle PT Maxi | 4.4% | [`PT-USD3-17DEC2026`](https://etherscan.io/address/0x7f47c3e6b2c00fC4eB4d5Ae50d0Ab0Ab6888Eb4D) | Dec 17, 2026 | [3Jane USD3](./3jane-usd3.md) (3.4/5) |

**PT risk:** Both strategies report `openWithdrawals() = false` and `availableWithdrawLimit(vault) = 0` — the vault **cannot withdraw any value from these positions** at the snapshot. They are duration-locked to maturity (~110 and ~131 days out) unless governance flips the flag, in which case exit runs through the Pendle router at up to 50 bps configured slippage (`swapSlippageBPS` = 50). PT prices trade at a discount to face value and are exposed to interest-rate and underlying-protocol risk before maturity. Valuation flows through a strategy-configured Pendle oracle ([`0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2`](https://etherscan.io/address/0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2)), reintroducing an oracle-valued surface that was absent at the prior snapshot. The USD3 leg additionally carries 3Jane credit risk (report score 3.4/5, medium).

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDC and receive yvUSD (ERC-4626 standard). Subject to the $15M deposit limit (`deposit_limit` confirmed onchain; `deposit_limit_module` = `address(0)`, so the hard cap is the direct limit)
- **Withdrawals:** ERC-4626 standard, but materially constrained:
  - **100% of funds are deployed** (0 idle) — withdrawals require unwinding strategy positions
  - **Only 69.7% of TVL sits in the default withdrawal queue** and is immediately withdrawable (Morpho OG 62.4% + sUSDS 7.3%)
  - **10.7% (Pendle PT) has zero withdrawal availability** — `availableWithdrawLimit()` returns 0
  - **10.1% (Katana)** requires an AggLayer/LxLy bridge round-trip and claim
  - **9.5% (Pawn Broker Looper)** is fully withdrawable in principle but is outside the default queue and requires unwinding a 7.9x levered position via flashloan
- **LockedyvUSD:** Optional lock wrapper with 14-day cooldown + 5-day withdrawal window. Yields a 10% locker bonus but restricts exit timing. **~33.8% of yvUSD supply is locked** (LockedyvUSD holds 3,008,265 of 8,912,607 yvUSD) — a committed-duration buffer reducing immediate redemption pressure
- **No fees on deposits/withdrawals** — the APR oracle currently reports 0 management/performance fee; the locker bonus is funded from extra yield via the accountant

### Collateralization

- **100% USDC-denominated** — all deposits are USDC, and all strategy positions ultimately track back to USDC value
- **Collateral quality by strategy:**
  - Low-mid risk (Morpho V1 OG 62.4%): dominant position
  - Blue-chip (Sky sUSDS 7.3% direct + 6.3% via PT = 13.6%)
  - Cross-chain (Katana yvUSDC via AggLayer): 10.1%, novel stack
  - Levered Cap stcUSD (Pawn Broker Looper): 9.5% equity on ~$6.87M notional
  - Credit-based (3Jane USD3 via PT): 4.4%
- **Leverage: 7.90x on 9.5% of TVL** — the Pawn Broker Looper runs at 87.34% LTV against a 91.50% liquidation threshold, ~4.5% of headroom. Gross levered notional is ~$6.87M against $869K of vault equity, i.e. ~75% of total vault TVL in gross collateral terms
- **Duration risk:** 10.7% of TVL is in fixed-maturity PTs that cannot currently be redeemed before Nov 26 / Dec 17, 2026
- **Concentration risk:** The portfolio is less concentrated than at the prior snapshot (Morpho V1 OG down from ~77% to 62.4%), but the diversification was achieved by adding a levered position, two duration-locked PT positions, and two additional protocol dependencies (Cap, 3Jane) rather than by moving into blue-chip venues

### Provability

- **yvUSD exchange rate:** Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` is onchain, and the six funded `current_debt` values reconcile exactly with `totalDebt()` (9,119,102.639999 USDC)
- **Oracle-valued positions:** The two Pendle PT strategies (10.7%) value their holdings through a strategy-configured Pendle oracle ([`0x5542be50…`](https://etherscan.io/address/0x5542be50420E88dd7D5B4a3D488FA6ED82F6DAc2)); the Pawn Broker Looper exposes a `reportBuffer` parameter (currently 1) and slippage/loss-limit controls. These are management-configurable valuation surfaces
- **Cross-chain lag:** Only the Katana strategy (10.1%) has cross-chain lag. The local `valueOfVault()` reads 0 between bridge reports, so this slice is known to the origin only via the last on-chain AggLayer bridged message. CCTP strategies (Arbitrum, Base) are at 0 debt
- **Levered position verifiability:** The Pawn Broker Looper's collateral, debt, LTV, and leverage ratio are all directly readable onchain (`balanceOfCollateral()`, `balanceOfDebt()`, `getCurrentLTV()`, `getCurrentLeverageRatio()`) — good transparency, but the stcUSD collateral itself sits behind Cap's upgradeable proxies
- **Profit/loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over **5 days** (`profitMaxUnlockTime` = 432,000 s). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSD for USDC via ERC-4626 `withdraw()`/`redeem()`. Subject to strategy liquidity **and** to default-queue membership
- **Zero idle funds:** 100% of vault assets are deployed. Withdrawals require unwinding positions
- **Withdrawability by tier (verified via `availableWithdrawLimit(vault)` and `get_default_queue()`):**

| Tier | Share of TVL | Positions | Exit path |
|------|-------------:|-----------|-----------|
| Immediately withdrawable via default queue | **69.7%** | Morpho V1 OG (62.4%), Sky sUSDS (7.3%) | Standard `redeem()` |
| Withdrawable, but out of queue | 9.5% | Pawn Broker Looper | Targeted `redeem()` with explicit strategy list; requires flashloan deleverage of a 7.9x position |
| Bridge round-trip required | 10.1% | Katana yvUSDC | AggLayer/LxLy claim; `availableWithdrawLimit` = 1 wei locally |
| **Not withdrawable at all** | **10.7%** | sUSDS PT Maxi (6.3%), USD3 PT Maxi (4.4%) | `availableWithdrawLimit` = 0, `openWithdrawals` = false. Locked until Nov 26 / Dec 17, 2026 maturity or governance action |

- **Sequencing risk:** because the default queue draws from the Morpho OG position first, sustained redemptions would drain the liquid 69.7% and progressively raise the share of remaining TVL held in levered, bridged, and duration-locked positions — the residual holders would end up in a strictly riskier book
- **DEX liquidity:** No known DEX liquidity pools for yvUSD. The vault is an ERC-4626 token, not traded on DEXes
- **LockedyvUSD:** 14-day cooldown + 5-day withdrawal window. Shares in cooldown cannot be transferred. **~33.8% of yvUSD supply** is locked here — a committed-duration buffer that materially reduces immediate redemption pressure and is the main mitigant for the illiquid tail
- **Same-value asset:** USDC-denominated vault token — no price divergence risk from the underlying
- **Deposit limit:** $15M cap (~60.8% utilized)
- **Net:** ~69.7% of TVL is withdrawable through the normal path, and 62.4% of that sits in a low-mid risk Morpho V1 vault rather than a blue-chip venue. ~30.3% requires non-standard exit — including 10.7% that is hard-locked for roughly four months. The ~33.8% locked-supply buffer covers a large share of that illiquid tail, but the mismatch between the liquid queue and the funded book is the vault's most significant liquidity weakness

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

**Operational latitude within governance:** the 7-day timelock gates *adding* strategies, but the Debt Allocator and DEBT_MANAGER holders can re-fund any of the 9 active-but-unfunded strategies (including the Morpho V2 Sentora convertors, the CCTP lanes, and two further loopers) with no delay. Brain (3-of-8) holds `management` on the funded strategies, and therefore controls the PT strategies' `openWithdrawals` flag and the looper's leverage targets and `reportBuffer`.

**Remaining concern:** The deployer EOA ([`0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271`](https://etherscan.io/address/0x1b5f15DCb82d25f91c65b53CEe151E8b9fBdD271)) remains the sole `governance` address on the Fee Splitter contract ([`0xd744B7D6bE69b334766802245Db2895e861cb470`](https://etherscan.io/address/0xd744B7D6bE69b334766802245Db2895e861cb470)). This is a low-impact concern (fee distribution only, not fund custody) but deviates from the otherwise robust multi-sig governance pattern.

### Programmability

- **Exchange rate (PPS):** Calculated onchain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit/withdraw are permissionless onchain transactions
- **Strategy profit/loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over **5 days**. Losses are immediate
- **Debt allocation:** Automated via Debt Allocator contract, with manual override available to DEBT_MANAGER role holders (Daddy, Brain, Security)
- **PT valuation:** The two PT Maxi strategies (10.7%) mark their holdings through a strategy-configured Pendle oracle and expose management-set `swapSlippageBPS` (50) and `openWithdrawals` parameters. `openWithdrawals = false` means management, not the market, currently determines whether the vault can exit these positions
- **Looper parameterization:** The Pawn Broker Looper exposes `targetLeverageRatio` (8.0x), `maxLeverageRatio` (8.5x), `leverageBuffer`, `slippage`, `lossLimitRatio`, and `reportBuffer` — all management-configurable and all affecting reported value and liquidation proximity
- **Cross-chain accounting:** Remote `_harvestAndReport()` queues a report back to the origin — via the AggLayer LxLy `onMessageReceived` callback for Katana (10.1% of TVL). The Katana strategy's local `valueOfVault()` reads 0 between bridge reports
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Allocation | Notes |
|-----------|-------------|-----------|-------|
| **Morpho (V1)** | Critical | **62.4%** | 25+ audits, formal verification by Certora. The Yearn OG USDC vault is rated low-mid risk. Unleveraged. Largest single point of failure. Morpho Blue also provides looper flashloans |
| **Sky/MakerDAO** | High | **13.6%** | 7.3% direct sUSDS + 6.3% via PT-sUSDS. Blue-chip, extensively audited ([report 1.3/5](./sky-usds.md)) |
| **Katana L2 + AggLayer (LxLy) + VaultBridgeToken** | Critical | **10.1%** | Newer stack — young (2025) L2, AggLayer bridge, no existing repo report. Effectively non-withdrawable without a bridge round-trip |
| **Pendle** | Critical | **10.7%** | Fixed-maturity PTs (Nov 26 / Dec 17, 2026). Oracle-valued, currently non-withdrawable. 6+ audits, $2B+ TVL |
| **Cap (stcUSD)** | Critical | **9.5% equity / ~$6.87M notional** | [Report 2.4/5](./cap-stcusd.md). 3-of-5 anonymous multisig, upgradeable UUPS proxies, 24h timelock. Levered 7.9x with ~4.5% liquidation headroom |
| **3Jane (USD3)** | High | **4.4%** | [Report 3.4/5](./3jane-usd3.md), medium-risk credit-based lending, held via PT until Dec 17, 2026 |
| **yvUSDC-1 / Pawn Broker Market** | High | Counterparty | The looper's $6.0M USDC borrow is ~97% of the Market's book; the Market is a 14.9% strategy of [yvUSDC-1](./yearn-yvusdc.md) |
| **Circle CCTP / Spark / Maple / InfiniFi / Origin** | Low | 0% (active, unfunded) | Endorsed and re-fundable by the Debt Allocator without a timelock |

**Dependency concentration:** Morpho V1 concentration has fallen from ~77% to **62.4%**, which is a genuine improvement in single-point-of-failure terms. However, the redeployed 20.2% went into a **7.9x levered Cap position (9.5%)** and **two duration-locked Pendle PT positions (10.7%)**, adding Cap (2.4/5, anonymous multisig, upgradeable) and 3Jane (3.4/5, credit risk) as new material dependencies and creating a correlated counterparty relationship with yvUSDC-1. Genuinely blue-chip exposure is 13.6% (Sky). Net: concentration improved, dependency *quality* and liquidity worsened.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The Yearn global multisig has 9 named signers including Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others
- **yvUSD governance:** Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation (Daddy, Brain, Security, Keeper, Debt Allocator). 7-day timelock on critical operations
- **Documentation:** Comprehensive Yearn V3 documentation. yvUSD-specific docs are published on the official Yearn docs site, including cross-chain strategy architecture, LockedyvUSD mechanics, and a dedicated APR API service ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi))
- **Legal:** Yearn Finance has converted its ychad.eth multisig into a BORG (cybernetic organization) via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation company with smart contract governance restrictions. The YFI token governs the protocol via YIP proposals
- **Incident response:** Yearn has demonstrated incident response capability across historical events. V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **Active management intensity:** 45 strategy changes in ~201 days, with four strategies added and the allocation profile materially reshaped on a single day (June 26, 2026). This is a fast-moving book — point-in-time assessments age quickly
- **V3 immutability:** Vault contracts cannot be upgraded — this eliminates proxy upgrade risk but means bugs cannot be patched without deploying a new vault

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring`](https://github.com/yearn/monitoring) repository:

- **Large flow alerts** (`protocols/yearn/alert_large_flows.py`): Monitors deposit/withdrawal events via indexer, alerts on flows exceeding $5M threshold via Telegram. Currently monitors 21 vaults across Ethereum, Base, Arbitrum, and Katana
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`): Runs daily, verifies all Yearn V3 vaults are endorsed onchain via the registry contract
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`): Monitors Yearn TimelockController across 6 chains

**Note:** yvUSD is not yet added to the monitored vault list in `alert_large_flows.py`, but the infrastructure is in place and can be extended.

Additionally, Yearn provides a dedicated **yvUSD APR API** ([yvusd-api.yearn.fi](https://yvusd-api.yearn.fi), [source](https://github.com/yearn/yearn-yvusd-apr-service)) that aggregates onchain vault/strategy accounting with offchain APR oracle computations. Endpoints include `/api/health` (data recency), `/api/aprs` (precomputed APRs and per-strategy debts/weights), and `/api/snapshot` (raw strategy cache). A **DeBank bundle** ([portfolio view](https://debank.com/bundles/221066/portfolio)) provides a consolidated view of all vault fund positions.

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSD Vault | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, `get_default_queue()`, Deposit/Withdraw events |
| **Pawn Broker Looper** | [`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986) | **`getCurrentLTV()`, `getCurrentLeverageRatio()`, `getLiquidateCollateralFactor()`, `balanceOfCollateral()`, `balanceOfDebt()`, `reportBuffer()` — alert on LTV > 89%** |
| **sUSDS Pendle PT Maxi** | [`0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142`](https://etherscan.io/address/0x2dF6c1602528dE8B8A5C72Baf6E70295b3A64142) | `openWithdrawals()`, `availableWithdrawLimit()`, `balanceOfPT()`, PT maturity (Nov 26, 2026) |
| **USD3 Pendle PT Maxi** | [`0x62ebE2ca290DB3B649c390847f8204196771B438`](https://etherscan.io/address/0x62ebE2ca290DB3B649c390847f8204196771B438) | `openWithdrawals()`, `availableWithdrawLimit()`, `balanceOfPT()`, PT maturity (Dec 17, 2026) |
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
- **PT withdrawal availability** — track `openWithdrawals()` and `availableWithdrawLimit()` on both PT Maxi strategies, and the Nov 26 / Dec 17, 2026 maturities. While false/0, 10.7% of TVL cannot be redeemed
- **Default queue composition** — `get_default_queue()` currently covers only 69.7% of funded debt. Alert on any change, and on any funded strategy that is not in the queue
- **PPS decrease** — any decrease in `convertToAssets(1e6)` indicates a loss event. Should only increase
- **Strategy additions/removals** — `StrategyChanged` events indicate portfolio changes (new strategies go through 7-day timelock; re-funding an existing one does not)
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events, especially any re-funding of the 9 active-but-unfunded strategies (convertors, CCTP lanes, syrupUSDC/sIUSD/wOUSD loopers)
- **Emergency actions** — `Shutdown` event on vault
- **Timelock operations** — pending proposals on the TimelockController
- **Signer/threshold changes** on the Daddy (6-of-9) and Brain (3-of-8) Safes
- **Cross-chain strategy accounting** — monitor remote-asset staleness for Katana (AggLayer/LxLy, 10.1%); the strategy's local `valueOfVault()` reads 0, so verify against actual Katana-side positions
- **Pawn Broker Market utilization** — the looper is ~97% of the Market's book, and the Market is a yvUSDC-1 strategy. Monitor for correlated stress across both vaults
- **Underlying protocol health** — Morpho V1 (critical, 62.4%), Sky (13.6%), Pendle (10.7%), Cap (9.5% levered), 3Jane (4.4%), and the Katana/AggLayer bridge

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
| `get_default_queue()` | Vault | Withdrawal queue composition | Daily |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | Timelock | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~27 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Standard Yearn governance with 7-day timelock:** Standard RoleManager, 7-day TimelockController (`getMinDelay()` = 604,800 s) for critical operations. Daddy/ySafe (6-of-9, publicly known signers) is the sole proposer; the timelock is self-governed (holds TIMELOCK_ADMIN_ROLE). No pending `future_role_manager`
- **Multi-layer security:** Daddy (governance), Brain (operations), Security (emergency), and automated bots (Keeper, Debt Allocator) with differentiated responsibilities. No single point of failure in governance
- **USDC-denominated:** Stablecoin backing eliminates price volatility risk on the underlying asset
- **Reduced single-venue concentration:** Morpho V1 OG is down from ~77% to 62.4% of TVL
- **Excellent onchain verifiability:** every funded position — including the levered one — exposes collateral, debt, LTV, and leverage directly onchain, and the six `current_debt` values reconcile exactly with `totalDebt()`. The APR API independently reproduces all six weights
- **~201 days production, monotonically increasing PPS:** PPS up to 1.023168 (~2.32% appreciation, ~4.2% annualized); no decrease observed
- **~33.8% of supply in a 14-day cooldown wrapper:** a committed-duration buffer that covers most of the vault's illiquid tail
- **No EOA role concentration:** Deployer EOA confirmed at 0 vault roles
- **Rigorous strategy review process:** 12-metric risk scoring framework with ySec security review

### Key Risks

- **7.90x leveraged stcUSD position with ~4.5% liquidation headroom (9.5% of TVL):** the Pawn Broker Looper runs at 87.34% LTV against a 91.50% liquidation threshold, holding ~$6.87M of Cap stcUSD collateral against $6.0M of USDC debt on $869K of vault equity. Cap is governed by a 3-of-5 anonymous multisig with upgradeable UUPS proxies and scores 2.4/5. Six weeks of production history
- **10.7% of TVL is not withdrawable at all:** both Pendle PT strategies return `availableWithdrawLimit() = 0` with `openWithdrawals() = false`, locking this slice until maturity (Nov 26 / Dec 17, 2026) or governance action
- **Default queue covers only 69.7% of funded debt:** four of the six funded strategies — 30.3% of TVL — are outside `get_default_queue()` and cannot be reached by a standard `redeem()`
- **Morpho V1 OG concentration (62.4%):** still the dominant position, in a vault rated low-mid risk rather than blue-chip. High concentration in 3Jane assets is the main concern. Yearn is actively monitoring 3Jane protocol health and other assets in the Morpho V1 OG vault. Note that 3Jane exposure also arrives directly through the USD3 Pendle PT strategy (4.4% of TVL), so the two paths compound
- **Katana/AggLayer bridge risk (10.1%):** depends on a young (2025) L2, the AggLayer/LxLy unified bridge, a VaultBridgeToken wrapper, and a remote Yearn vault — value that reads 0 locally and is known only from the last bridged report. `availableWithdrawLimit` is 1 wei. No existing repository report covers this stack
- **Re-introduced oracle and parameter surface:** PT positions are marked via a Pendle oracle; the looper exposes `reportBuffer` and leverage/slippage parameters. Brain (3-of-8) holds `management` on all funded strategies
- **Correlated counterparty with yvUSDC-1:** the looper's $6.0M borrow is ~97% of the Pawn Broker Market's book, and that Market is a 14.9% strategy of yvUSDC-1 — stress in one vault propagates to the other
- **Nine dormant strategies re-fundable without timelock:** the Morpho V2 Sentora convertors, both CCTP lanes, and three further loopers remain active at 0 debt and can be re-funded by the Debt Allocator at any time
- **No external product-specific audit:** the three June 26 strategies (looper + two PT Maxis), the KatanaStrategy, and the CCTPStrategy have ySec internal review but no dedicated external audit
- **No DEX liquidity:** yvUSD has no secondary market — exit is exclusively through the ERC-4626 vault
- **Only 13.6% in blue-chip venues:** Sky is the only blue-chip dependency
- **Structural liquidity mismatch:** sustained redemptions drain the liquid 69.7% first, progressively concentrating remaining holders into the levered, bridged, and duration-locked positions

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
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). The Pawn Broker Looper, both PT Maxi strategies, KatanaStrategy, and CCTPStrategy have internal ySec review but no dedicated external audit |
| Bug bounty | $200K on Immunefi (active) + Sherlock bounty |
| Production history | Vault **~201 days** (Jan 19, 2026); the three newest funded strategies (20.2% of TVL) only **~6 weeks**. V3 framework: ~27 months |
| TVL | **~$9.12M**. Deposit limit: $15M (~60.8% utilized) |
| Security incidents | None on V3; no PPS decrease observed |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 2.5/5** — The underlying V3 framework has solid audit coverage from 3 reputable firms and a clean ~27-month track record. The vault is ~201 days old with ~$9.12M TVL, monotonic PPS, and no incidents. Offsetting this, the vault is below the 1-year production threshold, and 20.2% of TVL sits in three strategies that are only ~6 weeks old and externally unaudited — including a 7.9x leveraged position. Katana also remains externally unaudited.

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
| PT valuation | Marked via a strategy-configured Pendle oracle (10.7% of TVL); `openWithdrawals` is a management flag currently set to false |
| Looper parameters | `targetLeverageRatio`, `maxLeverageRatio`, `leverageBuffer`, `slippage`, `lossLimitRatio`, `reportBuffer` — all management-set, all affecting reported value |
| Cross-chain | Programmatic — AggLayer `onMessageReceived` for Katana (10.1%) |

**Programmability Score: 2.0/5** — All funds remain onchain and PPS is algorithmic via ERC-4626; reporting is automated and governance cannot arbitrarily move funds. However, the June 26 additions reintroduced management-configurable valuation and access surfaces that were absent at the prior snapshot: an oracle-marked PT book (10.7%) whose withdrawability is set by a Brain-controlled boolean, and a levered strategy with a `reportBuffer` and management-set leverage/slippage parameters. Score raised from 1.5.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Six material dependencies: Morpho V1 (62.4%), Sky (13.6%), Pendle (10.7%), Katana/AggLayer (10.1%), Cap (9.5% levered), 3Jane (4.4%). Plus a counterparty relationship with yvUSDC-1 |
| Criticality | Morpho V1 (critical, 62.4%); Pendle (critical, 10.7%, non-withdrawable); Katana/AggLayer (critical, 10.1%); Cap (critical, levered, 2.4/5); Sky (high, 13.6%); 3Jane (high, 4.4%, 3.4/5) |
| Dependency quality | 13.6% blue-chip (Sky); 62.4% low-mid risk Morpho V1 OG; 10.1% novel Katana/AggLayer; 9.5% Cap (anonymous multisig, upgradeable proxies); 4.4% 3Jane credit risk |
| Cross-chain | One active bridge — Polygon AggLayer LxLy + VaultBridgeToken (Katana, 10.1%); CCTP lanes dormant but re-fundable |
| Coupling | Looper is ~97% of the Pawn Broker Market's book; the Market is a 14.9% strategy of yvUSDC-1 |

**Dependencies Score: 3.0/5** — Single-venue concentration improved meaningfully (Morpho 77% → 62.4%), but the redeployment expanded the dependency set from three protocols to six and added two of the weakest-scoring dependencies in the repository (Cap 2.4/5 with anonymous governance and upgradeable proxies, held at 7.9x leverage; 3Jane 3.4/5). Only 13.6% is genuinely blue-chip. The improvement in concentration and the deterioration in dependency quality broadly offset; score held at 3.0.

**Centralization Score = (1.0 + 2.0 + 3.0) / 3 = 2.0/5**

**Score: 2.0/5** — Governance confirmed onchain (standard RoleManager, 7-day timelock, Daddy 6/9 sole proposer, no EOA vault roles, immutable vault) and remains a genuine strength. Programmability weakened with the reintroduction of an oracle-marked, management-gated PT book and a parameterized levered strategy. Dependency quality is mixed and broader than at the prior snapshot.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDC-denominated, deployed into DeFi yield strategies |
| Collateral quality | 62.4% low-mid risk Morpho V1 OG; 13.6% blue-chip Sky (7.3% direct + 6.3% PT); 10.1% cross-chain Katana (novel); 9.5% Cap stcUSD (levered, 2.4/5); 4.4% 3Jane USD3 (3.4/5) |
| Leverage | **7.90x on 9.5% of TVL** — 87.34% LTV vs 91.50% liquidation threshold, ~4.5% headroom, ~$6.87M gross notional on $869K equity |
| Duration | 10.7% locked in fixed-maturity PTs (Nov 26 / Dec 17, 2026) |
| Verifiability | ERC-4626; mainnet positions direct; collateral/debt/LTV all readable onchain; 10.1% on Katana via bridged reports |

**Collateralization Score: 3.0/5** — Onchain USDC backing is fully verifiable and the levered position is unusually transparent. But leverage is no longer zero: a 7.9x position with only ~4.5% of price headroom sits on top of Cap, the weakest-governed dependency in the book. Add 10.7% of duration-locked PT exposure (including 4.4% of 3Jane credit risk) and 10.1% of novel cross-chain infrastructure, and only 13.6% of the vault is in genuinely blue-chip venues. Score raised from 2.5.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Mainnet positions verifiable onchain; six funded debts reconcile exactly with `totalDebt()`; 10.1% (Katana) only via last bridged report (`valueOfVault()` reads 0 locally) |
| Exchange rate | ERC-4626, programmatic, anyone can verify |
| Oracle valuation | 10.7% (PT book) marked via a strategy-configured Pendle oracle; looper exposes `reportBuffer` and slippage parameters |
| Cross-chain lag | 10.1% of TVL on Katana, known to origin via on-chain AggLayer bridge messages |
| Reporting | Automated via keepers with **5-day** profit unlock |

**Provability Score: 2.0/5** — The base vault and mainnet positions are fully verifiable, debts reconcile to the wei, and the levered position's collateral, debt, and LTV are all directly readable. Offsetting this, the PT book (10.7%) is oracle-marked rather than redeemable-at-par, the looper carries a management-set `reportBuffer`, and 10.1% remains behind a bridge with `valueOfVault()` reading 0 locally. Score raised from 1.5.

**Funds Management Score = (3.0 + 2.0) / 2 = 2.5**

**Score: 2.5/5** — Collateral quality is mixed and now includes a materially levered leg; provability is solid on the mainnet book but weakened by oracle-marked PTs and the bridged Katana slice.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 redemption for USDC — but gated by default-queue membership and per-strategy withdraw limits |
| Liquidity depth | 0 idle. **Only 69.7% reachable via the default queue** (62.4% Morpho V1 OG + 7.3% Sky sUSDS); 62.4% of that is a low-mid risk venue, not blue-chip |
| Hard-locked | **10.7%** in Pendle PTs with `availableWithdrawLimit() = 0` and `openWithdrawals() = false` until Nov 26 / Dec 17, 2026 |
| Cross-chain | 10.1% needs an AggLayer bridge round-trip (Katana); local `availableWithdrawLimit` = 1 wei |
| Looper | 9.5% withdrawable in principle, but out of queue and requires flashloan deleverage of a 7.9x position |
| Same-value asset | USDC-denominated — no price impact risk |
| Deposit limit | $15M cap (~60.8% utilized) |
| Locked supply | ~33.8% of yvUSD locked in LockedyvUSD (14-day cooldown) — committed-duration buffer covering most of the illiquid tail |

**Score: 3.5/5** — The USDC denomination eliminates price divergence risk and the ~33.8% locked-supply buffer is a genuine structural mitigant. But the funded book and the withdrawal queue have diverged sharply: only 69.7% of TVL is reachable by a standard `redeem()`, 10.7% is hard-locked for roughly four months behind a management-controlled flag, 10.1% requires a bridge round-trip, and the remaining 9.5% requires a targeted redemption that deleverages a 7.9x position. Sustained redemptions would drain the liquid tranche first and leave remaining holders concentrated in the illiquid, levered residue. Score raised from 3.0.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020 |
| Vault management | Standard Yearn V3 Role Manager — the same governance used across 37+ vaults, with clear role separation. 7-day timelock on critical operations |
| Documentation | V3 docs comprehensive. yvUSD-specific docs published on official Yearn docs site, plus a dedicated APR API that publishes per-strategy debts and weights |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Yearn has demonstrated capability across historical events. V3 untested under stress |
| Monitoring | Active hourly large-flow alerts, daily endorsed-vault checks, timelock monitoring across 6 chains. yvUSD not yet in the monitored vault list; no LTV alerting yet on the levered strategy |
| Management intensity | 45 strategy changes in ~201 days; the book was materially reshaped in a single day (June 26, 2026) |

**Score: 1.5/5** — Yearn's brand, track record, and known team provide high confidence, and the public APR API makes the book unusually easy to audit externally. The vault uses the standard Yearn governance framework, has comprehensive documentation, active Immunefi + Sherlock bounties, and demonstrated incident response. Held at 1.5 despite the fast rate of portfolio change, since the changes are executed through the documented role structure.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 2.0 | 30% | 0.60 |
| Funds Management | 2.5 | 30% | 0.75 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.45 → 2.5/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.5/5.0) — at the top of the tier; enhanced monitoring recommended**

The weighted score of 2.45 rounds to 2.5, which sits at the **upper boundary of the Low Risk tier** (the repository's tier mapping in `src/lib/colors.ts` assigns 2.5 to Low Risk). This is a full 0.3 worse than the prior 2.2 assessment and one increment away from Medium Risk. Given the 7.9x leveraged position with ~4.5% of liquidation headroom and the 10.7% of TVL that is currently non-withdrawable, the monitoring posture set out above — hourly LTV and stcUSD price alerting, daily withdrawability and queue checks — should be treated as a condition of the approval rather than optional.

**Score rationale:** The vault retains battle-tested Yearn V3 infrastructure (~27 months, no exploits), an immutable design, strong governance with a 7-day timelock, and excellent onchain verifiability — the six funded debts reconcile to the wei with `totalDebt()` and are independently reproduced by the public APR API. Single-venue concentration has genuinely improved, with Morpho V1 OG down from ~77% to 62.4%.

The score nonetheless rises from the prior 2.2 because the June 26, 2026 reallocation changed the vault's risk character rather than simply diluting it. The 20.2% redeployed went into a **7.90x leveraged Cap stcUSD position with ~4.5% of liquidation headroom** and **two Pendle PT positions that the vault currently cannot withdraw from at all**. That reintroduces leverage and oracle-marked valuation, adds Cap (2.4/5, 3-of-5 anonymous multisig, upgradeable UUPS proxies) and 3Jane (3.4/5) as material dependencies, creates a correlated counterparty relationship with yvUSDC-1, and leaves only **69.7% of TVL reachable through the default withdrawal queue**. Genuinely blue-chip exposure remains just 13.6% (Sky). The ~33.8% locked-supply buffer is the main structural offset to the liquidity mismatch.

---

## Reassessment Triggers

- **Time-based:** Reassess in ~1 month (September 2026) given the ~6-week age of the levered and PT positions, and again at the PT maturities (Nov 26 / Dec 17, 2026)
- **Leverage-based:** Reassess immediately if the Pawn Broker Looper's `getCurrentLTV()` exceeds 89%, if `getCurrentLeverageRatio()` approaches 8.5x, if `targetLeverageRatio` is raised, or if the position's share of TVL exceeds 15%
- **Cap-based:** Reassess on any stcUSD implementation upgrade, Cap multisig/threshold change, stcUSD depeg beyond 1%, or a change to the [Cap stcUSD report](./cap-stcusd.md) score
- **Liquidity-based:** Reassess if the share of TVL outside `get_default_queue()` exceeds 35%, if `availableWithdrawLimit()` on any funded strategy falls to 0, or if `openWithdrawals` is flipped on either PT strategy
- **TVL-based:** Reassess if TVL exceeds $20M, or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, strategy loss, or underlying protocol incident — especially **Morpho V1, Cap, Pendle, 3Jane, the AggLayer/Katana bridge, or Sky**
- **Governance-based:** Reassess if the timelock delay is modified, Safe compositions change (signer/threshold), or the Fee Splitter governance is transferred from the deployer EOA to the multisig
- **Cross-chain-based:** Reassess if cross-chain exposure exceeds ~20% of TVL, if a new remote chain/bridge is funded (e.g. the Base or Arbitrum CCTP strategies activate), or if any bridge experiences downtime or a fault
- **Audit-based:** Reassess if the Pawn Broker Looper, PT Maxi strategies, KatanaStrategy, or CCTPStrategy receive dedicated external audits (should improve the Audits score)
- **Strategy-based:** Reassess if Morpho V1 concentration exceeds ~75% of TVL, if any of the 9 active-but-unfunded strategies (convertors, CCTP lanes, additional loopers) is re-funded, or if a further leveraged strategy is added
- **Counterparty-based:** Reassess if the Pawn Broker Market's composition changes materially, or if the [yvUSDC-1 report](./yearn-yvusdc.md) score changes

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
│  │  TVL ~$9.12M          │        │  ~33.8% of supply locked     │  │
│  │  deposit() / redeem() │        │  0xAaaF...9040               │  │
│  │  totalAssets()        │        └──────────────────────────────┘  │
│  └──────────┬────────────┘                                           │
│             │ 15 active strategies — 6 funded                        │
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  FUNDED STRATEGIES (by allocation)                               ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ MORPHO V1 LENDING (62.4%)              ✅ in queue      │    ││
│  │  │  Morpho Yearn OG USDC Compounder      low-mid risk     │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌──────────────────────────┐  ┌────────────────────────────┐  ││
│  │  │ CROSS-CHAIN (10.1%)      │  │ SKY LENDING (7.3%)         │  ││
│  │  │  Katana yvUSDC Compounder│  │  sUSDS Depositor           │  ││
│  │  │  AggLayer LxLy           │  │  (blue-chip)               │  ││
│  │  │  ❌ not in queue, awl≈0  │  │  ✅ in queue               │  ││
│  │  └──────────────────────────┘  └────────────────────────────┘  ││
│  │  ┌──────────────────────────┐  ┌────────────────────────────┐  ││
│  │  │ LEVERAGED (9.5%)         │  │ PENDLE PT (10.7%)          │  ││
│  │  │  stcUSD/USDC Pawn Broker │  │  PT-sUSDS 26NOV26   6.3%   │  ││
│  │  │  Looper — 7.90x, 87.3%   │  │  PT-USD3  17DEC26   4.4%   │  ││
│  │  │  LTV vs 91.5% liq. thr.  │  │  ❌ not in queue           │  ││
│  │  │  ❌ not in queue         │  │  ⛔ availableWithdraw = 0  │  ││
│  │  └──────────────────────────┘  └────────────────────────────┘  ││
│  │                                                                  ││
│  │  Active but unfunded (9, 0 debt): Spark USDS, Base CCTP,        ││
│  │  sIUSD looper, USD3 PT (legacy), wOUSD looper, syrupUSDC        ││
│  │  looper, Arbitrum syrupUSDC (CCTP), Sentora PYUSD/RLUSD         ││
│  │  convertors — all re-fundable without a new timelock            ││
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
│  │  low-mid risk│  │  LxLy Bridge │  │  Blue-chip   │               │
│  │  62.4%       │  │  10.1% (new) │  │  13.6% total │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Cap stcUSD  │  │  Pendle      │  │  3Jane USD3  │               │
│  │  2.4/5       │  │  PT market   │  │  3.4/5       │               │
│  │  9.5% equity │  │  10.7% held  │  │  4.4% via PT │               │
│  │  ~$6.87M lev.│  │  as PTs      │  │  credit risk │               │
│  └──────┬───────┘  └──────────────┘  └──────────────┘               │
│         │ collateral in                                              │
│  ┌──────▼─────────────────────────┐                                 │
│  │  stcUSD/USDC Pawn Broker Market│  ← also a 14.9% strategy of     │
│  │  0xe63A...87dF  ($6.17M book)  │     yvUSDC-1; yvUSD's looper is │
│  └────────────────────────────────┘     ~97% of its borrowings      │
└───────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → yvUSD vault → strategies deploy to
Morpho V1 (62.4%), Sky sUSDS (7.3% direct), Katana L2 via AggLayer LxLy
(10.1%), a 7.90x levered Cap stcUSD carry via the Pawn Broker Market
(9.5% equity), and Pendle PTs on sUSDS + USD3 (10.7%, non-withdrawable
until Nov/Dec 2026). Only the Morpho V1 and sUSDS legs (69.7%) sit in
the default withdrawal queue. Profits reported by Keeper, locked for
5 days. Optional: user locks yvUSD in LockedyvUSD for a 10% bonus yield
(14d cooldown); ~33.8% of supply is locked.
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
