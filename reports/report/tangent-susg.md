# Protocol Risk Assessment: Tangent — sUSG

- **Assessment Date:** November 24, 2026
- **Token:** sUSG (Savings USG)
- **Chain:** Ethereum
- **Token Address:** [`0xf17d6f98a5c6eaa99d149079984119e0a4ef6900`](https://etherscan.io/address/0xf17d6f98a5c6eaa99d149079984119e0a4ef6900)
- **Final Score: 3.40/5.0**

> **Snapshot provenance:** All onchain values are read at Ethereum block [26,482,155](https://etherscan.io/block/26482155) (hash `0x63f4ecefc7275d81eaa3d8a36eeeeacbdf50ffeb9e090e763a3efe6d33d84a0d`, November 24, 2026 02:54:59 UTC), unless a different block or date is stated. Historical price and supply samples use archive reads at the blocks listed in the relevant tables.

## Overview + Links

sUSG is the savings token for **USG** ("Tangent USD"), the overcollateralized CDP stablecoin issued by [Tangent Finance](https://docs.tangent.finance/docs/overview). sUSG is an unmodified **Yearn V3 vault (API 3.0.4)** deployed by the official [Yearn v3.0.4 Vault Factory](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) ([docs](https://docs.tangent.finance/docs/usg/susg)). Users deposit USG and receive sUSG instantly, with no fee or cooldown. The vault has **no strategies**: all USG stays idle in the vault.

**Yield source:** The docs say [25% of protocol revenues](https://docs.tangent.finance/docs/usg/financial_flows) fund sUSG. Onchain, yield is a **discretionary weekly top-up**: the Protocol Revenues Treasury Safe ([`0x536d4e9C0944dE2aC6657d610Aa99fA5e97Ce493`](https://etherscan.io/address/0x536d4e9C0944dE2aC6657d610Aa99fA5e97Ce493), 2/3) transfers a round-number amount of USG into the vault and calls `process_report(vault)` in the same Safe transaction (example: [`0xdbaabb9e725b596db4673cf26035f50bd8f6d18ad6c350463ff5a30d216bcdc8`](https://etherscan.io/tx/0xdbaabb9e725b596db4673cf26035f50bd8f6d18ad6c350463ff5a30d216bcdc8)). The gain unlocks linearly over `profitMaxUnlockTime = 604800` (7 days). There have been 29 reports since May 25, 2026, totalling 53,864 USG with **zero losses**. Price per share grew from 1.052470 to 1.059020 over the last 30 days, about **7.8% annualized**.

**USG backing:** USG is minted against Curve, Convex, Stake DAO and f(x) LP collateral in Tangent's isolated markets. It is defended by crvUSD-style [Peg Keepers](https://docs.tangent.finance/docs/usg/peg_keepers), a price-dependent [interest rate](https://docs.tangent.finance/docs/usg/Rewards&interest_rate/interest_rate_model) and a [rewards deduction](https://docs.tangent.finance/docs/usg/Rewards&interest_rate/rewards_deduction_model) model. USG **has no redemption mechanism** ([docs](https://docs.tangent.finance/docs/usg/peg-stability)). The docs state that USG and its infrastructure are "currently undergoing beta testing" ([overview](https://docs.tangent.finance/docs/usg/overview_usg)).

**Assessment scope (issue [#580](https://github.com/yearn/risk-score/issues/580)):** Evaluate sUSG as collateral in a lending market, for example an sUSG/USDC Morpho market, including pricing and oracle design. See [Use as Lending Collateral: Pricing and Oracle](#use-as-lending-collateral-pricing-and-oracle).

**Key onchain state:**

| Metric | Value | Source |
|--------|-------|--------|
| sUSG `totalAssets()` | 1,107,771.72 USG | [sUSG](https://etherscan.io/address/0xf17d6f98a5c6eaa99d149079984119e0a4ef6900#readContract) |
| sUSG `totalSupply()` | 1,046,034.47 sUSG | same |
| `pricePerShare()` | 1.059020 USG | same |
| `totalIdle()` / `totalDebt()` | 1,107,771.72 / 0 (100% idle) | same |
| `accountant()` | `0x0000000000000000000000000000000000000000` (no fees) | same |
| Factory protocol fee | 0 bps (`protocol_fee_config`) | [Factory](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F#readContract) |
| `deposit_limit()` | `type(uint256).max` (unlimited) | sUSG |
| USG `totalSupply()` | 5,652,556.14 USG | [USG](https://etherscan.io/address/0xb1c2db5d6ca03fce73dbd304d320bf76c55ae1b1#readContract) |
| USG held idle by the two Peg Keepers | 3,000,000 USG (1,500,000 each), `debt() = 0` | [PK-USDC](https://etherscan.io/address/0xf89615f75c8161dc185c03020240905f6b66bad9#readContract), [PK-frxUSD](https://etherscan.io/address/0x8a7f16508d1e8b48bdf36023f378cc04d9506d4e#readContract) |
| Total market debt (21 markets) | 2,652,730 USG | [MarketViewer](https://etherscan.io/address/0x05aFEe1B483DdA7273be250f93219b607EA2477D#readContract) `totalDebt(market)` |
| Market collateral (Tangent oracles) | $3,316,335 (125.0% coverage with USG debt valued at $1) | per-market `totalCollateral()` × `collatOracle().latestAnswer(true)` |
| USG price (Tangent aggregator) | **$0.994763** | [USG Oracle](https://etherscan.io/address/0x970b2f2cec66f92de81dae6af363d1d135dd2f97#readContract) `price()` |
| DeFiLlama TVL (Tangent Finance) | $2,417,851 (peak $4,807,810 on September 23, 2026) | [DeFiLlama](https://defillama.com/protocol/tangent-finance) |

USG supply minus the 3.0M idle Peg Keeper balance is 2,652,556 USG, which matches total market debt (2,652,730 USG) within accrued interest. The DeFiLlama TVL of $2.42M is lower than the $3.32M of collateral valued by Tangent's own market oracles. The [DeFiLlama adapter](https://github.com/DefiLlama/DefiLlama-Adapters/blob/main/projects/tangent-finance/index.js) discovers all 21 markets from MarketCreator events, and DeFiLlama prices the collateral tokens at $3.32M in total. The gap comes from the adapter's `stakingProxyVault` path. Reproducing that logic at the snapshot returns a balance of 0 for both Convex FXN markets: fxUSD/USDC ($800,524) and reUSD/fxUSD ($113,472). $3.32M minus those $0.91M is about $2.40M, which matches DeFiLlama's TVL.

**Links:**

- [Protocol Documentation](https://docs.tangent.finance/)
- [sUSG docs](https://docs.tangent.finance/docs/usg/susg)
- [App (stake)](https://app.tangent.finance/stake)
- [GitHub — tangent-contracts](https://github.com/Tangent-labs/tangent-contracts)
- [Audits page](https://docs.tangent.finance/docs/faq/audits)
- [Contracts page](https://docs.tangent.finance/docs/faq/contracts)
- [Oracles docs](https://docs.tangent.finance/docs/usg/oracle)
- [DeFiLlama](https://defillama.com/protocol/tangent-finance)
- [Snapshot governance](https://snapshot.box/#/s:tangent-finance.eth)

## Contract Addresses

### sUSG and USG core

| Contract | Address | Notes |
|----------|---------|-------|
| sUSG (Yearn V3 vault, minimal proxy) | [`0xf17d6f98a5c6eaa99d149079984119e0a4ef6900`](https://etherscan.io/address/0xf17d6f98a5c6eaa99d149079984119e0a4ef6900) | Deployed February 16, 2026 ([tx](https://etherscan.io/tx/0x57d3797eb3d2aee49058ec42f63dfaaa3eba363369bd31e0772314f5b6aab5f5)); `FACTORY()` = Yearn 3.0.4 factory |
| Yearn V3.0.4 vault implementation | [`0xd8063123BBA3B480569244AE66BFE72B6c84b00d`](https://etherscan.io/address/0xd8063123BBA3B480569244AE66BFE72B6c84b00d) | Factory `vault_original()`; immutable |
| Yearn v3.0.4 Vault Factory | [`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) | `governance()` = [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) (Yearn); can set a protocol fee, but with no accountant the fee base is zero |
| USG | [`0xb1c2db5d6ca03fce73dbd304d320bf76c55ae1b1`](https://etherscan.io/address/0xb1c2db5d6ca03fce73dbd304d320bf76c55ae1b1) | Not upgradeable; `owner()` = Admin Safe; deployed February 12, 2026 ([tx](https://etherscan.io/tx/0xeae86c6a45b049ab20cb3d7e13b6dcd39e2a5b4b47ac05d79a35cf7c2018a1ed)) |
| ControlTower | [`0xf3f7669dceed2f985815011c19ed68f667267215`](https://etherscan.io/address/0xf3f7669dceed2f985815011c19ed68f667267215) | Market creator, pauser, position migrator and fee treasury registry; `owner()` = Admin Safe |
| MarketCreator | [`0x214C8A1023B30032a2Eded109146658C6D6F2781`](https://etherscan.io/address/0x214C8A1023B30032a2Eded109146658C6D6F2781) | Only active market creator; `owner()` = Admin Safe |
| IRCalculator | [`0xB4e1d3bBd2843263d58B4D648C599512cea6e88b`](https://etherscan.io/address/0xB4e1d3bBd2843263d58B4D648C599512cea6e88b) | Only `isIRProducer`; `mintIR()` mints accrued interest to the fee treasury |
| RewardAccumulator | [`0x1461D76aA1C9c523398301D9174098c6D53ce639`](https://etherscan.io/address/0x1461D76aA1C9c523398301D9174098c6D53ce639) | Splits collateral rewards; `owner()` = Admin Safe |
| MarketViewer | [`0x05aFEe1B483DdA7273be250f93219b607EA2477D`](https://etherscan.io/address/0x05aFEe1B483DdA7273be250f93219b607EA2477D) | Read-only helper |
| ZappingProxy | [`0xa9e0021d8917c51f496823605d218d7e78719c99`](https://etherscan.io/address/0xa9e0021d8917c51f496823605d218d7e78719c99) | Swap router used by zaps, leverage and liquidations |
| PauserProxy | [`0x10b1f36452e27f08b0b5747f577ff816b0e6b5fa`](https://etherscan.io/address/0x10b1f36452e27f08b0b5747f577ff816b0e6b5fa) | `pauser()` = [`0xe08c2512F87cF63fb7D2325EDd08aEC7920aC2f6`](https://etherscan.io/address/0xe08c2512F87cF63fb7D2325EDd08aEC7920aC2f6), `emergencyPauser()` = [`0x433a2561E1A7c2bE3DA5bD8F853093Fc9e5C0F14`](https://etherscan.io/address/0x433a2561E1A7c2bE3DA5bD8F853093Fc9e5C0F14) |
| USG Oracle (AggregatorStablePriceV3) | [`0x970b2f2cec66f92de81dae6af363d1d135dd2f97`](https://etherscan.io/address/0x970b2f2cec66f92de81dae6af363d1d135dd2f97) | Curve LlamaLend-style aggregator over 2 pools; `admin()` = Admin Safe |
| Peg Keeper Regulator | [`0x887706612730b7a227f3bffd8c9a6e6c3cb3f19e`](https://etherscan.io/address/0x887706612730b7a227f3bffd8c9a6e6c3cb3f19e) | `admin()` and `emergency_admin()` = Admin Safe; `fee_receiver()` = PRT Safe |
| Peg Keeper V2 — USDC | [`0xf89615f75c8161dc185c03020240905f6b66bad9`](https://etherscan.io/address/0xf89615f75c8161dc185c03020240905f6b66bad9) | Pool [USG/USDC](https://etherscan.io/address/0x97BA10115da528c113462EDE9C20D7adc806D93f) |
| Peg Keeper V2 — frxUSD | [`0x8a7f16508d1e8b48bdf36023f378cc04d9506d4e`](https://etherscan.io/address/0x8a7f16508d1e8b48bdf36023f378cc04d9506d4e) | Pool [USG/frxUSD](https://etherscan.io/address/0xEfc056790bb19702b2164ec6Ea6bA3AE01d81195) |

### Governance and treasuries

| Safe | Address | Threshold | Role |
|------|---------|-----------|------|
| Admin / DAO Treasury | [`0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca`](https://etherscan.io/address/0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca) | **3/5**, Safe 1.4.1, no modules, no guard | Owner of USG, ControlTower, MarketCreator, all 21 markets, IRCalculator, RewardAccumulator, PauserProxy, USG Oracle, Peg Keepers and Regulator; sUSG `role_manager` and `DEPOSIT_LIMIT_MANAGER` |
| Protocol Revenues Treasury (PRT) | [`0x536d4e9C0944dE2aC6657d610Aa99fA5e97Ce493`](https://etherscan.io/address/0x536d4e9C0944dE2aC6657d610Aa99fA5e97Ce493) | **2/3**, Safe 1.4.1, no modules, no guard | ControlTower `feeTreasury()`; sUSG `REPORTING_MANAGER`; funds sUSG yield |
| Protocol Owned Deployments (POD) | [`0xd2c46b4c28f4b7976d9f87687863c46bb2f71dbb`](https://etherscan.io/address/0xd2c46b4c28f4b7976d9f87687863c46bb2f71dbb) | 3/6, Safe 1.3.0 | Protocol-owned liquidity ([docs](https://docs.tangent.finance/docs/dao/dao_wallets)) |
| Operations Treasury (OT) | [`0x0af815364bd9e9e60f3d2d3bac1320b77d3e35f7`](https://etherscan.io/address/0x0af815364bd9e9e60f3d2d3bac1320b77d3e35f7) | 3/6, Safe 1.3.0 | Operating funds |

All three PRT signers are also Admin Safe signers, and the POD and OT Safes share the five Admin signers plus one more. The Safes are therefore one signer group, not independent checks. The docs do not name the signers. No timelock contract exists anywhere in the control path. The [governance docs](https://docs.tangent.finance/docs/dao/governance) say only that governance runs through `vsTAN` Snapshot votes and will "be completed with further info before `TAN`'s TGE". Snapshot votes are not enforced onchain.

### USG markets (all minters and burners)

All 21 markets were created by MarketCreator [`0x214C8A1023B30032a2Eded109146658C6D6F2781`](https://etherscan.io/address/0x214C8A1023B30032a2Eded109146658C6D6F2781) (creation events between blocks 25,036,864 and 26,442,041). Each has `USG.isMinter = true` and `USG.isBurner = true`, and `owner()` = Admin Safe. Debt and collateral are at the snapshot, with collateral valued by the market's own `collatOracle`.

| Market | Address | Debt (USG) | Collateral (USD) | Debt / collateral | `maxLTV` / LT |
|--------|---------|-----------:|-----------------:|------------------:|---------------|
| Convex FXN — fxUSD/USDC | [`0x849cf82e0ebcfeab8270cc5a3ea3b26cd481b754`](https://etherscan.io/address/0x849cf82e0ebcfeab8270cc5a3ea3b26cd481b754) | 707,520 | 800,524 | 88.4% | 90% / 91.25% |
| Stake DAO — BOLD/USDC | [`0xc9c80e8481c2b6f979afc155bc3f979cfad19c56`](https://etherscan.io/address/0xc9c80e8481c2b6f979afc155bc3f979cfad19c56) | 499,748 | 577,569 | 86.5% | 90% / 91.25% |
| Stake DAO — reUSD/scrvUSD | [`0x161d6fa48b0e0152763c3929a3813bd177fc099f`](https://etherscan.io/address/0x161d6fa48b0e0152763c3929a3813bd177fc099f) | 354,263 | 466,809 | 75.9% | 84% / 85% |
| Stake DAO — msETH/WETH | [`0x7b1b38cad63b0715a0adfeeb75e46431b48e73b6`](https://etherscan.io/address/0x7b1b38cad63b0715a0adfeeb75e46431b48e73b6) | 244,693 | 413,341 | 59.2% | 72% / 76% |
| Stake DAO — USDT/crvUSD | [`0xaed9bcae0831caf4a45739ec7910cedf2ac5d9a1`](https://etherscan.io/address/0xaed9bcae0831caf4a45739ec7910cedf2ac5d9a1) | 163,442 | 212,009 | 77.1% | 84% / 85.25% |
| Curve Gauge — PYUSD/USDC | [`0x4742a56668fbacbc11087f516c4b01ebc48f716f`](https://etherscan.io/address/0x4742a56668fbacbc11087f516c4b01ebc48f716f) | 139,913 | 155,510 | 90.0% | 90% / 91.5% |
| Curve Gauge — RLUSD/USDC | [`0xbffbd9c9ac1645285d017a69885304831e8b9b71`](https://etherscan.io/address/0xbffbd9c9ac1645285d017a69885304831e8b9b71) | 117,021 | 138,311 | 84.6% | 90% / 91.5% |
| Stake DAO — PYUSD/crvUSD | [`0xf9fbb128d4569bfc6f97124e13ae32cd6fb6a48b`](https://etherscan.io/address/0xf9fbb128d4569bfc6f97124e13ae32cd6fb6a48b) | 109,070 | 138,383 | 78.8% | 84% / 85.25% |
| Stake DAO — reUSD/sDOLA | [`0x244c24c94d5bbdba43c408b702ded98e436df721`](https://etherscan.io/address/0x244c24c94d5bbdba43c408b702ded98e436df721) | 97,356 | 121,609 | 80.1% | 84% / 85% |
| Convex FXN — reUSD/fxUSD | [`0xa63ded87df22ee573567ad1dd87d0a71c8fcd380`](https://etherscan.io/address/0xa63ded87df22ee573567ad1dd87d0a71c8fcd380) | 94,766 | 113,472 | 83.5% | 84% / 85% |
| Stake DAO — frxUSD/sDOLA | [`0xd3d29a8752fc40d64a20bbc043147077570c1785`](https://etherscan.io/address/0xd3d29a8752fc40d64a20bbc043147077570c1785) | 85,868 | 103,940 | 82.6% | 84% / 85.25% |
| Stake DAO — frxUSD/sUSDS | [`0xd2c7257efe28a1b1446904a371e3d51e1c2f7e0e`](https://etherscan.io/address/0xd2c7257efe28a1b1446904a371e3d51e1c2f7e0e) | 22,495 | 50,513 | 44.5% | 90% / 91.25% |
| Stake DAO — frxUSD/crvUSD | [`0xe1065be419cacaf05477ea77a32cb33e8bcbc7da`](https://etherscan.io/address/0xe1065be419cacaf05477ea77a32cb33e8bcbc7da) | 5,819 | 7,415 | 78.5% | 84% / 85.25% |
| Stake DAO — frxUSD/OUSD | [`0x56dbc69208044748af4d33392e25fc9336f11931`](https://etherscan.io/address/0x56dbc69208044748af4d33392e25fc9336f11931) | 5,592 | 6,753 | 82.8% | 87.5% / 88.75% |
| Stake DAO — CVX/ETH | [`0xe4622622bfb74dce6019d5d41150d8824b83bf9a`](https://etherscan.io/address/0xe4622622bfb74dce6019d5d41150d8824b83bf9a) | 5,165 | 10,073 | 51.3% | 64% / 68% |
| Stake DAO — frxUSD/scrvUSD | [`0x5c996574270f439bfff5b7647ee92c1879d35a4b`](https://etherscan.io/address/0x5c996574270f439bfff5b7647ee92c1879d35a4b) | 0 | 2 | — | 84% / 85.25% |
| Stake DAO — eUSD/USDC | [`0xa6069a4a53b564eb0a312e08f5af19ae2ba5d67e`](https://etherscan.io/address/0xa6069a4a53b564eb0a312e08f5af19ae2ba5d67e) | 0 | 4 | — | 87.5% / 88.75% |
| Stake DAO — msETH/OETH | [`0x2b2962931433fe137fd17cf62df4b9ec84a7de00`](https://etherscan.io/address/0x2b2962931433fe137fd17cf62df4b9ec84a7de00) | 0 | ~1 | — | 72% / 76% (`maxMarketDebt` = 0) |
| Stake DAO — cbBTC/WBTC | [`0x4903f0d3698ddc5ca66040b235de0a2126a41437`](https://etherscan.io/address/0x4903f0d3698ddc5ca66040b235de0a2126a41437) | 0 | ~95 | — | 78% / 82% |
| Stake DAO — frxUSD/DUSD | [`0x420d2d75c69331df6ce4a1a74067d68e82670e13`](https://etherscan.io/address/0x420d2d75c69331df6ce4a1a74067d68e82670e13) | 0 | ~1 | — | 84% / 85.25% (`maxMarketDebt` = 0) |
| Stake DAO — crvUSD/ETH/CRV | [`0xb4edf0dd81b2ad31703b61da098401d0c83607bf`](https://etherscan.io/address/0xb4edf0dd81b2ad31703b61da098401d0c83607bf) | 0 | ~1 | — | 68% / 72% (`maxMarketDebt` = 0) |
| **Total** | | **2,652,730** | **3,316,335** | **80.0%** | |

The debt-to-collateral column values each USG of debt at $1, as Tangent does in its health checks. `badDebt()` is 0 in every market. The [contracts page](https://docs.tangent.finance/docs/faq/contracts) lists only the first 12 markets, and several oracle addresses it lists differ from the onchain `collatOracle()`. For example, the frxUSD/sUSDS market reads [`0x7Ee47D8440928AD1964581bc46819AFc46B899Ac`](https://etherscan.io/address/0x7Ee47D8440928AD1964581bc46819AFc46B899Ac), not the documented [`0x3ccd01e66172b2c1b3c17f485b7f2987ae94da6a`](https://etherscan.io/address/0x3ccd01e66172b2c1b3c17f485b7f2987ae94da6a). Use onchain getters, not the docs page, for monitoring.

**Pause state:** At the snapshot, 19 markets had deposit, borrow and leverage paused (`getPausedSettings() = (1,1,1)`). The pause came from the PauserProxy at blocks 26,481,759–26,481,760, about 80 minutes before the snapshot, and still held at block 26,482,203. Markets were unpaused at block [26,483,983](https://etherscan.io/block/26483983), about 6 hours after the pause. During the pause window the Admin Safe raised BOLD/USDC `maxMarketDebt` from 500,000 to 600,000 USG ([tx](https://etherscan.io/tx/0xb58ebfc5d7c8792365f1c5ac9ed306ac4d170847036c54598d2153689a3d92b6)). Two markets were briefly paused again between blocks 26,484,030 and 26,484,343. This pattern is consistent with maintenance pauses, but Tangent has not published a reason. `PauseTrigger` history shows about a dozen earlier pause/unpause cycles since June 2026, each reversed within minutes to about 30 hours. Pauses do not block `repay`, `withdraw` or liquidation, and they do not affect sUSG deposits or withdrawals.

## Audits and Due Diligence Disclosures

| Auditor | Dates | Scope | Findings | Report |
|---------|-------|-------|----------|--------|
| Egis Security | Report dated August 6, 2025 (commit `eb2a2ea3`) | USG markets, oracles, utilities | 0 Critical, 0 High, 2 Medium, 9 Low | [PDF](https://drive.google.com/file/d/1K4rHyRfI4XWMtEfNe8ykLQu_DYuHxJ-U/view) |
| Sherlock (public contest) | August 28 – September 11, 2025 (audited `d0fe823a`, final `99803b6a`) | Markets, oracles, USG, TAN, vsTAN, WStable, ControlTower, IRCalculator, MarketCreator, Migratoor, RewardAccumulator, ZappingProxy | 2 High, 14 Medium; 0 left unfixed and unacknowledged | [PDF](https://github.com/sherlock-protocol/sherlock-reports/blob/main/audits/2025.09.11%20-%20Final%20-%20USG%20-%20Tangent%20Audit%20Report.pdf) |
| Pashov Audit Group | October 30 – November 12, 2025 (review `687d78d7`, fixes `fc8a8f82`) | Same scope as Sherlock | 3 Medium (resolved), 11 Low (10 resolved, 1 acknowledged) | [PDF](https://github.com/pashov/audits/blob/master/team/pdf/Tangent-security-review_2025-10-30.pdf) |
| Pashov Audit Group | December 8–10, 2025 (review `6fdbf129`, fixes `b79c0f17`) | CurveGauge and Stake DAO markets, USG, ControlTower, IRCalculator, Migratoor, MarketCreator, RewardAccumulator, market core | 2 Medium (resolved), 8 Low (6 resolved, 2 acknowledged) | [PDF](https://github.com/pashov/audits/blob/master/team/pdf/Tangent-security-review_2025-12-08.pdf) |
| Zerocool (AI review) | Not stated | Not stated | Not stated | [Link](https://app.zerocool.ai/share/LazsB_w5GNqH-GQWkZTOTZ6JkOAxbusdcMRrirDEHVg?finding=M-01) |

- **sUSG vault code** is the standard Yearn V3.0.4 vault, covered by Yearn's V3 audits ([Yearn V3 audits](https://github.com/yearn/yearn-vaults-v3/tree/master/audits)). Tangent did not modify it.
- **Not in any Tangent audit scope:** the Peg Keeper V2, Peg Keeper Regulator and AggregatorStablePriceV3 contracts (Vyper forks of [crvUSD](https://resources.curve.finance/crvusd/faq/#what-are-peg-keepers) code), the PauserProxy and the MarketViewer.
- **Deployed source vs. audited commits:** Each deployed contract's Etherscan-verified source was compared file by file with the public [repository](https://github.com/Tangent-labs/tangent-contracts). This is a source-level check; compiled bytecode was not compared. USG, ControlTower, ZappingProxy and MarketViewer are identical to the last audited fix commit `b79c0f17` (Pashov, December 2025). All five market implementations, IRCalculator and MarketCreator are identical to the later commit [`ccaf937d`](https://github.com/Tangent-labs/tangent-contracts/commit/ccaf937d5376fd8fee7e16cf74dd7bddf335e0ac) ("Audit zero cool protocol", February 25, 2026). That commit applies the Zerocool AI-review fixes: a zero-address deposit check, a zero-share repay check, and a `try/catch` around `USGOracle.price_w()` in IRCalculator that keeps the prior rate if the USG oracle reverts. RewardAccumulator matches [`9bc9156`](https://github.com/Tangent-labs/tangent-contracts/commit/9bc9156) (March 30, 2026). The October 2025 Pashov report says commit `ccaf937d` was reviewed after the audit, but it describes only a `RewardNotified` underflow guard. In the repository that guard lands in `9bc9156`, while `ccaf937d` carries the market and IRCalculator changes above. No published report describes a human review of those market and IRCalculator changes. The Peg Keeper, Regulator and aggregator Vyper sources match the repository. PauserProxy and the Morpho adapters are not in the public repository.
- **Audit findings relevant to USG backing:** Sherlock M-3 was acknowledged with no fix planned. Tangent compares USD-valued collateral against nominal USG debt in borrowing limits and liquidation eligibility. The largest market's deployed implementation still does this in `_verifyMaxLTV` and `liquidate`. Below $1, positions can become eligible for liquidation earlier than their mark-to-market LTV implies, and liquidators can buy USG for less than the contract assumes. Above $1, eligibility can come later while liquidators must pay more for the USG they repay. [Sherlock audit, M-3](https://github.com/sherlock-protocol/sherlock-reports/blob/main/audits/2025.09.11%20-%20Final%20-%20USG%20-%20Tangent%20Audit%20Report.pdf) · [Deployed market implementation](https://etherscan.io/address/0xa6c6193abaf2f1b72ed251984d391eaac7c31e77#code)
- **Complexity:** High. There are 21 cloned markets across five market implementations, collateral wrappers (Convex, Stake DAO, Curve gauges), per-market oracles, leverage and zap routing, migrations, peg keepers and an IR engine.

### Bug Bounty

No bug bounty program was found. Neither the docs nor the repository lists one, and `https://immunefi.com/bug-bounty/tangent/` returns 404. The protocol does not appear in the [SEAL Safe Harbor](https://safeharbor.securityalliance.org/) registry.

## Historical Track Record

- **Deployment:** USG was deployed February 12, 2026 and sUSG on February 16, 2026. DeFiLlama records the first TVL on May 25, 2026 ($293,506), the same day as the first sUSG report. That is about **6 months** of meaningful usage.
- **TVL:** Protocol TVL peaked at $4.81M on September 23, 2026 and is now $2.42M, down about 50% from peak. sUSG TVL is about $1.1M. The highest sampled value was 1.41M USG on about November 10, 2026.
- **Predecessor exploit:** The team previously built [Convergence](https://docs.tangent.finance/docs/faq/history). In August 2024 a `CvxRewardDistributor` bug allowed an unauthorized mint of all CVG staking emissions, sending CVG to zero ([post-mortem](https://medium.com/@cvg_wireshark/post-mortem-08-01-2024-e80a49d108a0)). Tangent is the DAO-voted pivot after that exploit. No Tangent incident is known.
- **USG peg history:** USG has traded **below $1 continuously since about June 2026**. The aggregator price stayed between $0.9936 and $0.9970 from June to November.

| Date (approx.) | Block | USG aggregator price | USG supply | sUSG `totalAssets` | sUSG PPS |
|----------------|------:|---------------------:|-----------:|-------------------:|---------:|
| March 28, 2026 | 24,754,155 | 1.000000 | 40,000,000 | 0 | 1.000000 |
| May 28, 2026 | 25,186,155 | 0.999691 | 41,856,591 | 307,391 | 1.005391 |
| June 27, 2026 | 25,402,155 | 0.996979 | 43,304,427 | 828,855 | 1.017383 |
| July 27, 2026 | 25,618,155 | 0.996520 | 43,811,636 | 1,214,095 | 1.027051 |
| August 26, 2026 | 25,834,155 | 0.996262 | 44,175,413 | 978,174 | 1.036462 |
| September 25, 2026 | 26,050,155 | 0.995200 | 44,296,572 | 1,142,200 | 1.044858 |
| October 25, 2026 | 26,266,155 | 0.996010 | 6,873,434 | 1,197,004 | 1.052470 |
| November 17, 2026 | 26,431,755 | 0.994528 | 6,244,195 | 1,304,294 | 1.057296 |
| November 23, 2026 | 26,474,955 | 0.993650 | 5,721,832 | 1,120,705 | 1.058749 |
| **Snapshot** | 26,482,155 | **0.994763** | 5,652,556 | 1,107,772 | 1.059020 |

The 40M+ USG supply through mid-October was mostly USG minted by the Admin Safe to the Peg Keepers through `mintPegKeeper`: 20,000,000 per keeper at blocks 24,754,155, 26,050,155 and 26,158,155. It was burned back to 1,500,000 per keeper between blocks 26,158,155 (about October 10) and 26,266,155 (about October 25). Keeper `debt()` was 0 at every sampled block, so the keepers have not had USG deployed in the pools that they could withdraw to support the peg. The Peg Keeper mechanism only adds USG when it trades above $1.

- **Holder concentration** (sUSG `balanceOf`, 61 holders reconstructed from the full `Transfer` history):

| Holder | sUSG | Share | Type |
|--------|-----:|------:|------|
| [`0xc6ac08424ee6d1373f03611b96f5da849594b6d8`](https://etherscan.io/address/0xc6ac08424ee6d1373f03611b96f5da849594b6d8) | 684,789 | 65.5% | Curve StableSwap-NG sUSG/reUSD pool |
| [`0xab8c43e0c7358b92b32816c2250aa3cdbb35555a`](https://etherscan.io/address/0xab8c43e0c7358b92b32816c2250aa3cdbb35555a) | 165,197 | 15.8% | EOA |
| [`0xe31b01ce6f29107cf8870599911703fa2aa36e1c`](https://etherscan.io/address/0xe31b01ce6f29107cf8870599911703fa2aa36e1c) | 132,586 | 12.7% | Pendle SY-sUSG (PT market [`0x68b647308f86f8669eaced155a9168769ce72265`](https://etherscan.io/address/0x68b647308f86f8669eaced155a9168769ce72265) expires November 26, 2026) |
| [`0x3e258aae11d7ea394b2eb1176ccd54d9eb83861b`](https://etherscan.io/address/0x3e258aae11d7ea394b2eb1176ccd54d9eb83861b) | 35,229 | 3.4% | EOA |

## Funds Management

sUSG does not delegate funds. All USG sits idle in the vault (`get_default_queue() = []`, `totalDebt() = 0`), and no strategy has ever been added. The economic exposure is to **USG itself**: its market collateral, its peg, and the Admin Safe's authority over the USG token.

### Accessibility

- **sUSG mint and redeem:** Permissionless ERC-4626 `deposit`, `mint`, `withdraw` and `redeem`. They are atomic and have no fee, cooldown or withdraw-limit module. `deposit_limit` is unlimited.
- **USG mint:** Only by borrowing in a Tangent market against collateral (open to anyone, subject to `maxLTV`, `maxMarketDebt`, `minimumLoan` of [3,000 USG](https://docs.tangent.finance/docs/usg/loan-to-value&liquidation) and pause flags).
- **USG exit:** No redemption. Holders exit by selling on Curve or by repaying debt. See [Liquidity Risk](#liquidity-risk).

### Token Mint Authority

The assessed token is sUSG. It is minted only through the vault's ERC-4626 entrypoints against USG deposits. sUSG has **no privileged mint path**. The Yearn V3 vault mints shares to itself only when a report records a gain or fee, and those shares are backed by the reported USG.

Because sUSG is fully backed by USG, the **USG mint authority** is the material mint surface:

**Mint mechanism:** Ownable whitelist mappings on [USG](https://etherscan.io/address/0xb1c2db5d6ca03fce73dbd304d320bf76c55ae1b1#code). `mintDebt` requires `isMinter[msg.sender]`. `mintIR` requires `isIRProducer` and mints to `controlTower.feeTreasury()`. `mintPegKeeper` is `onlyOwner` and mints to a registered Peg Keeper.

**Mint requires backing:** Market mints require collateral at `maxLTV`, priced by an owner-settable oracle. Owner mints to Peg Keepers and owner-added minters **do not require backing**.

**Per-address mint authority** (verified onchain at block 26,482,155; no `SetIsMinter` or `SetIsBurner` events since deployment; `initializeMarket` emits no event, so markets were enumerated from MarketCreator creation events and confirmed with `isMinter`/`isBurner`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| 21 markets (table above) | ✓ | ✓ | `isMinter` / `isBurner` via `USG.initializeMarket`, callable only by a ControlTower `isMarketCreator` | Borrow against collateral; burn on repay and liquidation |
| [`0xB4e1d3bBd2843263d58B4D648C599512cea6e88b`](https://etherscan.io/address/0xB4e1d3bBd2843263d58B4D648C599512cea6e88b) (IRCalculator) | ✓ | — | `isIRProducer` | Mints accrued interest to the PRT Safe; bounded by market debt-index growth (`rMax ≤ 40%` APR in `_verifyIRParams`) |
| [`0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca`](https://etherscan.io/address/0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca) (Admin Safe 3/5) | ✓ (to Peg Keepers) | ✓ (from Peg Keepers) | `owner` → `mintPegKeeper` / `burnPegKeeper` | **Unbounded** mint to a registered Peg Keeper. Also controls `setIsMinter`, `setIsBurner`, `setIsIRProducer`, `setIsPegKeeper` |
| Peg Keepers ([USDC](https://etherscan.io/address/0xf89615f75c8161dc185c03020240905f6b66bad9), [frxUSD](https://etherscan.io/address/0x8a7f16508d1e8b48bdf36023f378cc04d9506d4e)) | — | — | `isPegKeeper` | Hold owner-minted USG (1.5M each). Deposit it into Curve when USG > $1 and withdraw when USG < $1 (permissionless `update`) |
| [`0x214C8A1023B30032a2Eded109146658C6D6F2781`](https://etherscan.io/address/0x214C8A1023B30032a2Eded109146658C6D6F2781) (MarketCreator) | indirect | indirect | ControlTower `isMarketCreator` | `onlyOwner` market creation makes any new clone a minter and burner. The previous creator [`0x51c88d507e0df0d54daae6fea5b037ae39f4f76d`](https://etherscan.io/address/0x51c88d507e0df0d54daae6fea5b037ae39f4f76d) was revoked at block 24,748,515 and created no markets |

**Rate limits / supply caps:** Per-market `maxMarketDebt`, set by the owner (sum 7.2M USG across markets). There is no global cap, and nothing caps `mintPegKeeper` or owner-added minters.

**Backing check at mint time:** Atomic collateral check (`_verifyMaxLTV`) for market borrows. None for owner paths.

**Burn authority:** `USG.burnDebt(address from, uint256 amount)` lets **any `isBurner` burn USG from any address without allowance**. That includes the sUSG vault, which holds 1,107,772 USG.

### Collateralization

- **sUSG → USG:** 100% backed. `totalAssets()` equals the vault's USG `balanceOf()`, and the full balance is idle and withdrawable atomically.
- **USG → collateral:** Tangent's collateral oracles value the LP positions at $3.32M against 2.65M USG of debt. That is 125.0% aggregate coverage with debt valued at $1 per USG. Collateral is Curve stable LP positions, plus some volatile LP (msETH/WETH, CVX/ETH), wrapped in Convex, Stake DAO, f(x) or Curve gauges. Underlying stablecoins include fxUSD, BOLD, reUSD, crvUSD, PYUSD, RLUSD, frxUSD, sDOLA, OUSD and sUSDS. Several are newer or synthetic designs. For example, reUSD appears in three markets totalling 546,385 USG of debt (20.6%). [Re Protocol report](./re-reusd.md)
- **Thin buffers:** The two largest markets run at 88.4% and 86.5% debt/collateral against liquidation thresholds of 91.25%. PYUSD/USDC sits at 90.0%, at its `maxLTV`. A move of a few percent in an LP's oracle price can liquidate a large share of debt.
- **Oracle design** ([docs](https://docs.tangent.finance/docs/usg/oracle)): Chainlink feeds, with Redstone or Curve `price_oracle` fallbacks. Curve stable LPs are priced with a "pessimistic" min-asset price × `virtual_price`, and crypto LPs with `lp_price`. The Admin Safe can replace any market oracle through `setCollatOracle` with no delay.
- **Liquidation:** Permissionless below health factor 1, with a 5% fee on liquidator profit. Tangent also runs a liquidation bot that liquidates even when unprofitable ([docs](https://docs.tangent.finance/docs/usg/health)). Bad debt is recorded per market and recovered from future market earnings. There is no insurance fund.
- **Peg stability:** No redemption arbitrage exists. Below-peg defense relies on IR increases and rewards deduction, which push borrowers to repay. The current Peg Keepers cannot sell USG back because `debt() = 0`.

### Provability

- **sUSG:** Fully onchain. `totalAssets()` uses internal `total_idle` accounting and reconciles with `USG.balanceOf(vault)`. Every yield event is a `StrategyReported` log.
- **USG backing:** Fully onchain and verifiable per market (`totalCollateral`, `MarketViewer.totalDebt`, `collatOracle().latestAnswer`). Collateral valuations use Tangent-deployed oracle contracts that the Admin Safe can replace.
- **Yield:** Set offchain. The PRT Safe decides weekly how much USG to send, in round numbers. The docs' "25% of revenue" share cannot be verified onchain, because revenues accumulate in the PRT Safe and are distributed by multisig. Tangent's own API ([`/revenues/month`](https://api.tangent.finance/revenues/month), self-reported interest and reward revenue in USD) shows $111,936 of revenue from May through November 22, 2026. Over the same period, sUSG received 53,864 USG (**about 48%**, not 25%). The share has fallen over time: 87% in June, then 31–43% from August to November, and about 44% in recent weeks. Weekly revenue fell from $8,768 (week of September 28) to $3,265–$4,322 in November. A strict 25% share of recent weekly revenue (about $1,080 per week) would give sUSG about 5% APY, compared with about 7.8% now. The current yield therefore depends on discretionary distributions above the documented share.
- **Third-party verification:** None beyond DeFiLlama TVL. There is no proof-of-reserve feed.

## Use as Lending Collateral: Pricing and Oracle

**Defer funding an sUSG/USDC market.** The launch decision depends on a validated USDC-denominated oracle and liquidation proceeds under stress. The existing sUSG/frxUSD deployment has different oracle inputs and limited usage. [Assessment request](https://github.com/yearn/risk-score/issues/580)

**sUSG → USG rate.** Under the snapshot configuration, unsolicited USG transfers enter vault accounting only after a `REPORTING_MANAGER` calls `process_report`, and the resulting gains unlock over seven days. If the vault loses USG outside its accounting, `convertToAssets` can overstate backing until a loss report and withdrawals can revert. While the vault stays fully idle, use the lower of its accounting conversion and actual USG balance per outstanding share. Treat a strategy addition, debt allocation, or withdrawal-limit module as a change to that assumption. [Vault implementation](https://etherscan.io/address/0xd8063123BBA3B480569244AE66BFE72B6c84b00d#code)

**USG → USDC rate.** The direct Curve pool's `price_oracle(0)` is in USDC per USG (0.994763 at the snapshot), with an EMA half-life of about 10 minutes. Use it as a candidate input subject to freshness, depth and corroboration checks. If a second source uses the USG/frxUSD pool, convert its frxUSD-per-USG price using an independently validated frxUSD/USDC price. Tangent's aggregator blends these two pool EMAs as if the quote assets were interchangeable, and its admin can change the pairs. It returns par when no pool meets its 20,000 LP-token EMA liquidity floor. This fallback would hide the observed discount. No USG or sUSG feed appears in the [Chainlink mainnet feed directory](https://docs.chain.link/data-feeds/price-feeds/addresses), [Pyth Hermes](https://hermes.pyth.network/v2/price_feeds?query=USG), or RedStone's [relayer manifests](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/relayer-remote-config) (checked November 24, 2026). An independent USG/USDC fallback therefore does not exist today and would have to be built from Curve EMAs, with frxUSD/USDC validated independently. `TODO`: confirm Chronicle coverage. Its [dashboard](https://chroniclelabs.org/dashboard/oracles) rate-limited automated requests (HTTP 429). [USG/USDC pool](https://etherscan.io/address/0x97BA10115da528c113462EDE9C20D7adc806D93f#code) · [USG/frxUSD pool](https://etherscan.io/address/0xEfc056790bb19702b2164ec6Ea6bA3AE01d81195#code) · [Tangent aggregator](https://etherscan.io/address/0x970b2f2cec66f92de81dae6af363d1d135dd2f97#code)

**Existing Morpho market:** A Morpho market already lists sUSG as collateral: sUSG/frxUSD, 86% LLTV, market [`0x2a2f62fe3d123077da35f281fbe69ebc296759b34873d627cf44c94f05fecf7e`](https://app.morpho.org/ethereum/market/0x2a2f62fe3d123077da35f281fbe69ebc296759b34873d627cf44c94f05fecf7e), with about $15 supplied. Its oracle is a `MorphoChainlinkOracleV2` ([`0x983C54E46F6fe7793fA4fD01B72fC3c065AE1b11`](https://etherscan.io/address/0x983C54E46F6fe7793fA4fD01B72fC3c065AE1b11), deployed by Tangent's deployer EOA). It uses `BASE_VAULT = sUSG` and `BASE_FEED_1` = [`USGMorphoAdapter`](https://etherscan.io/address/0xf459fa53B26356132Ef9d6c9fDA29F7D3Eb72A85), which returns the aggregator `price()` with `updatedAt = 0`. `QUOTE_FEED_1` is a [`MorphoOracleAdapter`](https://etherscan.io/address/0xD4FA68a6A591bB8C8e77Db15CE27735f285cf97d) over Tangent's Curve-derived frxUSD oracle [`0x8aa49a3ba86ED4C9fe8FA787934d2F7860509859`](https://etherscan.io/address/0x8aa49a3ba86ED4C9fe8FA787934d2F7860509859). `price()` returns 1.0537 frxUSD per sUSG. The adapters are immutable, but their upstream aggregator and oracle are admin-configurable by the Tangent Admin Safe.

**Oracle requirements.** Multiply USG per sUSG by USDC per USG. With 18-decimal sUSG and 6-decimal USDC, Morpho's `price()` returns this human-readable product scaled by `10^24`. The existing Morpho oracle consumes the adapter's answer without checking freshness. Validate the age of meaningful pool observations, executable depth, source divergence, and vault backing. The direct pool's price timestamp from `ma_last_time()` was 35 minutes old at the snapshot. Set limits against observed trading cadence and test switching to a live, independently validated USDC-denominated fallback. Morpho uses the same oracle for borrowing and liquidation. A blanket revert can block liquidation, and a stale or par fallback can overvalue collateral. **Pre-funding requirement (not yet done):** test healthy borrowing, liquidation through a primary feed outage, and loss recognition with the proposed oracle before allocating. [Existing Morpho oracle implementation](https://etherscan.io/address/0x983C54E46F6fe7793fA4fD01B72fC3c065AE1b11#code) · [Morpho Blue liquidation](https://docs.morpho.org/learn/concepts/blue/liquidation/)

**Liquidation proceeds in USDC.** At 77% LLTV, Morpho's liquidation incentive factor is 1.0741. Assuming the position holds enough collateral, sUSG seized equals the USDC repaid times that factor, divided by the snapshot USDC price per sUSG (0.994763 USDC per USG × 1.059020 USG per sUSG). The table quotes each route at that input size. Proceeds exclude execution costs such as gas and flash liquidity fees. These are contract quotes for a hypothetical market. [Morpho Blue liquidation](https://docs.morpho.org/learn/concepts/blue/liquidation/)

| USDC debt repaid | sUSG seized | Redeem → USG/USDC | Redeem → USG/frxUSD → USDC | sUSG/reUSD → USDC | 50/50 USG split across direct and frxUSD routes | Direct only, half pool depth |
|---:|---:|---:|---:|---:|---:|---:|
| 50,000 | 50,980 | 53,545 | 53,603 | 9,475 | 53,635 | 53,236 |
| 75,000 | 76,469 | 80,142 | 80,325 | 9,479 | 80,410 | 77,924 |
| 100,000 | 101,959 | 106,472 | 106,964 | 9,480 | 107,148 | 89,236 |
| 250,000 | 254,898 | 181,404 | 254,886 | 9,481 | 265,643 | 91,498 |

Curve legs use `get_dy`. The frxUSD leg uses the Frax USDC custodian's `previewRedeem`, with 454,858 USDC in `totalAssets()` and zero redemption fee at the snapshot. The reUSD route uses the direct Curve reUSD/USDC pool, which held 9,483 USDC. The stress column assumes the frxUSD route is unavailable and estimates a proportional 50% drawdown of the direct pool's reserves by halving the direct quote at twice the input size. It holds the oracle mark, pool imbalance and pool parameters fixed. A concurrent depeg or concentrated liquidations could worsen proceeds. [Frax USDC custodian](https://etherscan.io/address/0x4F95C5bA0C7c69FB2f9340E190cCeE890B3bd87c#readProxyContract) · [Frax redemption mechanics](https://docs.frax.com/frxusd/mint-and-redeem-quickstarts/usdc) · [Curve reUSD/USDC](https://etherscan.io/address/0xf74c91b36C26543A0Aa820bEf407A577e5498BF0#readContract)

**Exposure and LLTV.** The 250k repayment depends on access to Frax redemption or additional USDC liquidity. At 86% LLTV, the bonus falls to 4.38%, and the frxUSD route alone yields about 249,806 USDC for that repayment before costs. At 77% LLTV, 50k and 75k repay in the modeled direct-only stress case before costs, while 100k does not. These results bound the scenarios tested. A curator can cap its own vault allocation to a Morpho Blue market. Other lenders can supply directly, and all positions compete for the same exit liquidity, so size any allocation against stressed proceeds and total market borrows. **Pre-funding requirement (not yet done):** set a launch cap and LLTV only after testing the chosen oracle, concurrent liquidations, and a cost buffer in USDC. [Morpho market mechanics](https://docs.morpho.org/learn/concepts/blue/) · [Morpho vault allocation controls](https://docs.morpho.org/curate/)

## Liquidity Risk

**sUSG → USG:** Instant and fee-free for the full supply (100% idle).

**USG / sUSG → USD (executable quotes at the snapshot block, via `get_dy`):**

| Route | 10k | 100k | 250k | 500k |
|-------|----:|-----:|-----:|-----:|
| USG → USDC ([pool](https://etherscan.io/address/0x97BA10115da528c113462EDE9C20D7adc806D93f): 183,539 USDC / 537,489 USG) | 0.61% | 1.27% | 27.68% | 63.41% |
| USG → frxUSD ([pool](https://etherscan.io/address/0xEfc056790bb19702b2164ec6Ea6bA3AE01d81195): 283,193 frxUSD / 829,473 USG) | 0.59% | 0.90% | 3.78% | 43.77% |
| sUSG → reUSD ([pool](https://etherscan.io/address/0xc6ac08424ee6d1373f03611b96f5da849594b6d8): 684,786 sUSG / 189,260 reUSD; value loss vs. `stored_rates`) | 0.53% | 0.99% | (200k: 6.92%) | — |

Losses are measured against $1 per USG, so they include the current ~0.5% discount. Both USG peg pools are about 75% USG, which means USG is in surplus on every venue. Other USG venues are small: [USG/sDOLA](https://etherscan.io/address/0x317837AED98bea887074d1f97Fd3C83eBCA6905b) about $183k TVL and [USG/OUSD](https://etherscan.io/address/0xf182fE2f1a1014543848E261087B6740b78Acf71) about $12k (Curve API).

**LP concentration:** The sUSG/reUSD pool's LP is 97.9% staked in its [gauge](https://etherscan.io/address/0xc58fb163359b8e53c628868ba6c9335d1a6fd16b). The gauge is held 69.5% by the [Convex VoterProxy](https://etherscan.io/address/0x989aeb4d175e16225e39e87d0d97a3360524ad80) and 30.5% by the Stake DAO Curve locker [`0x52f541764e6e90eebc5c21ff570de0e2d63766b6`](https://etherscan.io/address/0x52f541764e6e90eebc5c21ff570de0e2d63766b6). The Convex position (608,606 LP) is 55.9% held by a Stake DAO V2 `ConvexSidecar` ([`0x1156d21b8d5548e1aa1f98b046cb21c95275e68d`](https://etherscan.io/address/0x1156d21b8d5548e1aa1f98b046cb21c95275e68d)), with the rest spread across 15 other stakers. Combined with the locker, Stake DAO's [RewardVault](https://etherscan.io/address/0xD4F41eF4127F07335024278433f928B6bAb023D4) holds 606,785 LP (67.8% of the 894,491 LP supply). Two EOAs hold 71.5% of that vault: [`0x5275817b74021e97c980e95ede6bbac0d0d6f3a2`](https://etherscan.io/address/0x5275817b74021e97c980e95ede6bbac0d0d6f3a2) with 245,707 LP and [`0xb47c72be8a2968dec42d3b9d8c6f464224605bfd`](https://etherscan.io/address/0xb47c72be8a2968dec42d3b9d8c6f464224605bfd) with 188,088 LP. Together that is about **48.5% of the pool's LP**, removable at will. Neither EOA is an owner of the Admin or POD Safe. Their attribution is unknown, so treat this depth as concentrated and removable.

**Stress history:** USG has not recovered to peg in about 5 months, and the peg pools have stayed USG-heavy. A holder of the full ~$1.1M of sUSG could not exit to USDC or frxUSD without double-digit losses.

## Centralization & Control Risks

### Governance

- **Upgradeability:** No proxies in the USG or sUSG path. USG, ControlTower and the market clones (EIP-1167 clones of fixed implementations) are not upgradeable, and sUSG is an immutable Yearn V3 clone. Mutability instead comes from **owner-settable roles and parameters**.
- **Owner:** The Admin Safe [`0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca`](https://etherscan.io/address/0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca) (3/5, signers not publicly named, no modules or guard) owns every Tangent contract. **No timelock.**
- **Owner powers relevant to sUSG holders:**
  - USG: `setIsMinter`, `setIsBurner`, `setIsIRProducer`, `setIsPegKeeper`, `mintPegKeeper`, `burnPegKeeper`, `transferOwnership`.
  - ControlTower: `setIsMarketCreator`, `setIsPositionMigrator`, `setIsPauser`, `setFeeTreasury`.
  - Markets: `setCollatOracle`, `setMaxLTV`, `setLiquidationThreshold`, `setLiquidationFee`, `setMaxMarketDebt`, `setMinimumLoan`.
  - USG Oracle: add or remove price pairs. Peg Keepers and Regulator: admin parameters.
  - sUSG: `role_manager` can grant any vault role, including `ADD_STRATEGY_MANAGER`, `DEBT_MANAGER`, `MAX_DEBT_MANAGER`, `ACCOUNTANT_MANAGER` and `EMERGENCY_MANAGER`.
- **Current sUSG roles** (from all `RoleSet` events since deployment; confirmed with `roles()`): Admin Safe = `256` (`DEPOSIT_LIMIT_MANAGER`); PRT Safe = `32` (`REPORTING_MANAGER`). There is no `future_role_manager`.
- **Pausers** (pause-only): ControlTower `isPauser` = deployer EOA [`0xe08c2512F87cF63fb7D2325EDd08aEC7920aC2f6`](https://etherscan.io/address/0xe08c2512F87cF63fb7D2325EDd08aEC7920aC2f6) (EIP-7702-delegated EOA) and the PauserProxy. The PauserProxy is controlled by the same EOA plus EOA [`0x433a2561E1A7c2bE3DA5bD8F853093Fc9e5C0F14`](https://etherscan.io/address/0x433a2561E1A7c2bE3DA5bD8F853093Fc9e5C0F14). Pausing blocks only new deposits, borrows and leverage.
- **Position migrators:** None registered (no `SetIsPositionMigrator` events). A migrator could call `migrateFrom(account, collat, debt, 0, receiver)` and send any borrower's collateral to an arbitrary receiver. Only the Admin Safe can add one.

### Critical Permission Paths and Weakest Link

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Burn USG held by sUSG: `USG.setIsBurner(x)` then `burnDebt(sUSG, amount)` | Admin Safe (USG `owner`) | 3/5 multisig; no timelock; no cap | All 1,107,772 USG in sUSG |
| Move sUSG's USG: `set_role` → `add_strategy(malicious)` → `update_max_debt_for_strategy` → `update_debt` | Admin Safe (sUSG `role_manager`) | 3/5; no timelock | All 1,107,772 USG in sUSG |
| Unbacked USG mint: `setIsMinter(x)` → `mintDebt`, or `mintPegKeeper` | Admin Safe | 3/5; no timelock; no global cap | Dilutes USG and the sUSG backing value |
| Drain market collateral: `setCollatOracle(fake)` then borrow USG up to `maxMarketDebt`, or add a position migrator | Admin Safe (market and ControlTower `owner`) | 3/5; no timelock; `maxMarketDebt` is owner-settable | $3.32M of market collateral backing USG |
| Manipulate the USG price reference: aggregator `add_price_pair`/`remove_price_pair` | Admin Safe | 3/5; no timelock | IR and rewards-deduction behaviour; external lending oracles that use the aggregator |
| Stop sUSG yield | PRT Safe (2/3; the only funding path) | — | Yield only, not principal |
| Pause market deposits, borrows and leverage | Deployer EOA, PauserProxy EOAs | Pause-only | None (no material loss) |

**Weakest credible path to material loss:** The **Admin Safe ([`0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca`](https://etherscan.io/address/0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca), 3-of-5, anonymous signers, no timelock)** can call `USG.setIsBurner(attacker)` and then `USG.burnDebt(0xf17d6f98a5c6eaa99d149079984119e0a4ef6900, 1107771e18)` in a single Safe batch, with no delay and no code-enforced limit ([USG.sol](https://etherscan.io/address/0xb1c2db5d6ca03fce73dbd304d320bf76c55ae1b1#code)). That destroys 100% of sUSG's backing. The same Safe can also take the vault's USG through the `role_manager` strategy path, mint unlimited USG, or swap any market oracle. Every material path converges on this one signer set: PRT, POD and OT signers are subsets of the Admin signers or overlap with them. Inventory caveats: market roles were enumerated from MarketCreator events because `initializeMarket` emits none. Deployed sources match public repository commits, but several post-audit changes have only an AI review. See [Audits](#audits-and-due-diligence-disclosures).

### Programmability

- **Onchain:** sUSG accounting and PPS; market borrowing, interest indexes (IRCalculator), liquidations, Peg Keeper `update()` (permissionless) and USG price aggregation.
- **Manual or offchain:** sUSG yield amount and timing (weekly PRT Safe transfers), market onboarding and parameters, pausing, the Tangent liquidation bot, revenue split, and bad-debt handling (DAO "will try to sell the collateral").
- **PPS:** Computed onchain, but its growth depends on discretionary admin top-ups.

### External Dependencies

- **Curve:** Collateral LP tokens, USG peg pools, the USG price EMA, Peg Keeper target pools, and sUSG/USG secondary liquidity. Critical.
- **Convex, Stake DAO, f(x) Protocol, Curve gauges:** Collateral wrappers that hold the market collateral. Critical for collateral withdrawal.
- **Collateral stablecoins:** fxUSD, BOLD, reUSD, crvUSD, PYUSD, RLUSD, frxUSD, sDOLA, OUSD, sUSDS, USDT, USDC and msETH. Many are newer or synthetic, and a depeg of any large one creates USG bad debt.
- **fxUSD bridge exposure:** fxUSD appears in two markets with 802,286 USG of debt (30.2%). Its Ethereum LayerZero adapter escrows 39,678 fxUSD (0.20% of Ethereum fxUSD supply). The Base→Ethereum release route requires LayerZero Labs, Twinstake, Google, and one of Horizen, Polyhedra zkBridge, or Canary, with 20 confirmations. The LayerZero registry marks the Polyhedra zkBridge DVN as deprecated. The adapter's authority covers the escrowed fxUSD. Loss of that escrow or loss of confidence in the bridge could affect the fxUSD price and the two LP positions that back USG. [Ethereum escrow and receive configuration](https://etherscan.io/address/0xA07d8cc424421cC2bce0544a65481376f010A438#readContract) · [Base fxUSD OFT](https://basescan.org/address/0x55380fe7A1910dFf29A47B622057ab4139DA42C5) · [LayerZero DVN registry](https://metadata.layerzero-api.com/v1/metadata)
- **reUSD bridge status:** The LayerZero OFT adapter has configured peers for Avalanche, Arbitrum, Base and BNB Chain. At the snapshot, `paused()` is true and its downstream `minterBurner()` lacks reUSD's `MINTER_ROLE`. Canonical Ethereum minting through that configured route requires both unpausing the adapter and granting the handler the role. reUSD remains a collateral and exit-liquidity dependency. [reUSD adapter](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85#readContract) · [Mint handler](https://etherscan.io/address/0x0DfB42aA18CEed719617CD554304f6CA412a6B18#code) · [reUSD token permissions](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72#readProxyContract)
- **Oracles:** Chainlink, with Redstone and Curve `price_oracle` fallbacks, all wrapped by Tangent-deployed, admin-replaceable oracle contracts.
- **Yearn V3 vault code:** Immutable, audited and widely used.
- **Enso:** Routing for zaps and leverage ([repo README](https://github.com/Tangent-labs/tangent-contracts)).

## Operational Risk

- **Team:** The team is the former Convergence (CVG) team, which pivoted to Tangent by DAO vote after the August 2024 exploit ([history](https://docs.tangent.finance/docs/faq/history)). Individual team members are not identified in the docs, and no legal entity is disclosed.
- **Documentation:** Mechanism docs are good. Gaps: the governance section is a placeholder until the TAN TGE, the contracts page lists 12 of 21 markets and stale oracle addresses, the WTS list is empty, and no bug bounty or incident-response process is documented. The code is public on [GitHub](https://github.com/Tangent-labs/tangent-contracts).
- **Legal:** No entity is disclosed. The docs say 50% of Peg Keeper profits are shared with Swiss Stake AG, the Curve entity, because the Peg Keepers are forked from crvUSD.
- **Incident response:** Pausers exist and pauses have been used repeatedly. No public incident-response plan exists.

## Monitoring

| Target | What to watch | Getter / event | Threshold | Frequency |
|--------|---------------|----------------|-----------|-----------|
| USG [`0xb1c2db5d6ca03fce73dbd304d320bf76c55ae1b1`](https://etherscan.io/address/0xb1c2db5d6ca03fce73dbd304d320bf76c55ae1b1) | Minter, burner and Peg Keeper grants; ownership | `SetIsMinter`, `SetIsBurner`, `SetIsIRProducer`, `SetIsPegKeeper`, `OwnershipTransferred` | Any event outside a MarketCreator market creation → **critical alert** | Real-time |
| USG | Supply jumps and burns from sUSG | `totalSupply()`; `Transfer(sUSG → 0x0)` not matched by a vault `Withdraw` | >5% supply change per day; any burn from sUSG | Hourly |
| sUSG [`0xf17d6f98a5c6eaa99d149079984119e0a4ef6900`](https://etherscan.io/address/0xf17d6f98a5c6eaa99d149079984119e0a4ef6900) | Role, allocation and exit changes | `RoleSet`, `UpdateRoleManager`, `UpdateFutureRoleManager`, `StrategyChanged`, `DebtUpdated`, `UpdateAccountant`, `UpdateWithdrawLimitModule`, `UpdateProfitMaxUnlockTime`, `Shutdown` | Any event → alert | Real-time |
| sUSG | Backing integrity while idle | `totalAssets()` and `USG.balanceOf(sUSG)`; `StrategyReported` with `loss > 0` | USG balance below accounted assets or any reported loss → critical | Hourly and on vault USG outflows |
| sUSG | Yield cadence | `StrategyReported` (vault self-report) | No report in 10 days | Daily |
| USG Oracle [`0x970b2f2cec66f92de81dae6af363d1d135dd2f97`](https://etherscan.io/address/0x970b2f2cec66f92de81dae6af363d1d135dd2f97) | Peg and price-source health | `price()`, `ema_tvl()`, constituent `ma_last_time()`; `AddPricePair`, `RemovePricePair`, `SetAdmin` | `price()` < 0.990 warning, < 0.980 critical; all feeds below 20,000 EMA LP tokens → critical; any pair or admin change | Hourly for prices and depth; real-time for events |
| USG/USDC and USG/frxUSD pools | Exit depth | `balances(0)` (USDC/frxUSD); `get_dy(1,0,1e23)` | Counterparty < $100k per pool, or 100k-USG loss > 2% | Hourly |
| Frax USDC custodian [`0x4F95C5bA0C7c69FB2f9340E190cCeE890B3bd87c`](https://etherscan.io/address/0x4F95C5bA0C7c69FB2f9340E190cCeE890B3bd87c#readProxyContract) | USDC settlement capacity | `totalAssets()`, `previewRedeem()`, `redeemFee()`; combine with Curve USG/frxUSD quote | For any funded integration, modeled settlement proceeds below debt repayment plus execution costs → stop new vault allocations and reassess | Hourly while exposed |
| Markets (21) | Oracle and risk-parameter changes; bad debt | `SetOracle`, `SetMaxLTV`, `SetLiquidationThreshold`, `SetMaxMarketDebt`, `badDebt()`; new MarketCreator events | Any `SetOracle`; any `badDebt > 0` | Real-time |
| System collateralization | Aggregate collateral / debt | Σ `totalCollateral × collatOracle().latestAnswer(true)` / Σ `MarketViewer.totalDebt` | < 115% | Daily |
| ControlTower [`0xf3f7669dceed2f985815011c19ed68f667267215`](https://etherscan.io/address/0xf3f7669dceed2f985815011c19ed68f667267215) | Migrators, creators, fee treasury | `SetIsPositionMigrator`, `SetIsMarketCreator`, `SetFeeTreasury`, `SetIsPauser` | Any `SetIsPositionMigrator(_, true)` → critical | Real-time |
| Admin Safe and PRT Safe | Signer and threshold changes | `AddedOwner`, `RemovedOwner`, `ChangedThreshold`, `EnabledModule`, `ChangedGuard` | Any event | Real-time |
| Peg Keepers | Idle USG and debt | `USG.balanceOf(pk)`, `debt()` | Mint to a keeper > 1M USG | Daily |
| fxUSD and reUSD adapters | Escrow security and reUSD mint activation | fxUSD `balanceOf(adapter)` and LayerZero receive configuration; reUSD adapter `paused()` and token `hasRole(MINTER_ROLE, minterBurner)` | Unexpected escrow outflow, receive configuration change, or reUSD unpause or mint grant → reassess | Daily and on configuration events |

## Appendix: Contract Architecture

```
                         ┌──────────────────────────────────────────────┐
                         │  Admin Safe (3/5, NO timelock)               │
                         │  owner of every Tangent contract             │
                         └───────┬──────────┬───────────┬───────────────┘
           role_manager +        │ owner    │ owner     │ owner / admin
           DEPOSIT_LIMIT_MANAGER │          │           │
                                 ▼          ▼           ▼
┌──────────── Vault / Token ─────────────┐  ┌──────── Protocol ─────────────────────────┐
│ sUSG (Yearn V3.0.4 clone)              │  │ ControlTower ─ isMarketCreator ─► MarketCreator
│   100% idle USG (1.108M)               │  │   isPauser (EOA, PauserProxy)   │ clones
│   REPORTING_MANAGER: PRT Safe (2/3) ───┼──┤   feeTreasury = PRT Safe        ▼
│   weekly USG top-up + process_report   │  │ 21 Markets (isMinter + isBurner on USG)
└──────────────┬─────────────────────────┘  │   collatOracle (owner-settable)
               │ holds                      │   IRCalculator ─ mintIR ─► PRT Safe
               ▼                            │ Peg Keepers (USDC, frxUSD) ◄─ mintPegKeeper (owner)
┌────────── USG ─────────────────────────┐  │ Peg Keeper Regulator ◄─ USG Oracle (aggregator)
│ mintDebt / burnDebt(from ANY address)  │◄─┤
│ owner: setIsMinter / setIsBurner       │  └───────────────────────────────────────────┘
└────────────────────────────────────────┘
                     │ backed by market collateral ($3.32M / 2.65M USG debt)
                     ▼
┌──────────────── Underlying ──────────────────────────────────────────────────┐
│ Curve LPs (fxUSD/USDC, BOLD/USDC, reUSD/scrvUSD, msETH/WETH, crvUSD/USDT, …)  │
│ wrapped in Convex FXN / Stake DAO / Curve gauges                             │
│ Oracles: Chainlink, Redstone, Curve price_oracle (Tangent wrappers)           │
│ Exit liquidity: Curve USG/USDC, USG/frxUSD, sUSG/reUSD; Pendle SY-sUSG       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Risk Summary

### Key Strengths

- sUSG is an unmodified, immutable Yearn V3.0.4 vault. Deposits and withdrawals are instant, fee-free and 100% idle, and the accounting is donation-resistant.
- Tangent's oracles show 125% aggregate collateral coverage with USG debt valued at $1. Liquidations are permissionless, the protocol runs a liquidation bot, and no market records bad debt at the snapshot.
- Four human audits (Egis, a Sherlock contest, two Pashov reviews) cover the USG token and markets, and all High and Medium findings were fixed or acknowledged.
- Everything is verifiable onchain: vault balance, market debt and collateral, and every yield report.

### Key Risks

- **USG has traded about 0.3–0.6% below peg since June 2026.** It has no redemption path, and both Peg Keepers have zero debt, so they cannot defend the downside.
- **Exit liquidity is thin.** About $100k of USG exits to USDC at ~1.3% loss, and about $250k to frxUSD at ~3.8%, against ~$1.1M of sUSG.
- **Tangent's markets apply the $1 USG assumption to borrowing and liquidation.** A depeg changes the economics of repayment and liquidation even while the market's debt inputs stay at par.
- **sUSG yield is discretionary.** It comes from weekly round-number transfers from a 2/3 Safe, not programmatic revenue routing. Those transfers equal about 48% of Tangent's self-reported revenue, not the documented 25%, while weekly revenue has roughly halved since late September.
- The young protocol (about 6 months of usage) has falling TVL ($4.8M to $2.4M), collateral concentrated in newer synthetic stablecoins and LP wrappers, and a predecessor exploit (Convergence, 2024).
- No bug bounty, no disclosed legal entity, and governance docs that are still a placeholder.

### Critical Risks

- **A 3/5 Admin Safe with no timelock can destroy sUSG's backing instantly.** It can grant itself burner rights and burn the vault's USG (`burnDebt` needs no allowance), take the USG through the vault's `role_manager`, mint unbacked USG, or replace market oracles. None of these powers is delayed or capped.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **Unverified contract source** — Pass. sUSG (Yearn 3.0.4), USG, ControlTower, markets, oracles and Peg Keepers are verified on Etherscan.
- [x] **No audit** — Pass. Egis, Sherlock and Pashov (×2) audited the USG system, and Yearn audits cover the V3 vault.
- [x] **Unverifiable reserves** — Pass. Vault balance and market collateral are onchain.
- [x] **Total centralization** — Pass. Control sits with a 3/5 Safe. The EOAs hold pause-only roles.

**All gates pass.**

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits: 2.5.** Two or more reputable audits plus a public contest cover the USG code, and the vault uses audited Yearn code. There is no bug bounty, the Peg Keeper, Regulator and aggregator forks fall outside Tangent's audit scope, and complexity is high.
- **Historical: 4.0.** Meaningful usage covers about 6 months (since May 2026), with TVL well under $10M and falling. USG has been off-peg for about 5 months, and the team's previous protocol was exploited.

**Score: 3.25/5** — (2.5 + 4.0) / 2

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 4.5.** A 3/5 anonymous-signer Safe with **no timelock** holds unlimited power over USG mint and burn (including burning from sUSG), the sUSG role manager and market oracles. It is not an EOA, so the gate does not apply.
- **Programmability: 3.0.** Accounting, interest and liquidations are onchain, but sUSG yield depends on manual weekly admin reports, and onboarding and parameters are manual.
- **External Dependencies: 4.0.** Critical dependencies on Curve, Convex, Stake DAO and f(x), many newer collateral stablecoins, and admin-replaceable oracle wrappers.

**Score: 3.83/5** — (4.5 + 3.0 + 4.0) / 3 = 3.833

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 3.5.** sUSG is fully backed by USG. Tangent's oracles show 125% USG collateral coverage at par. Collateral consists of mixed-quality LPs, the largest markets run near liquidation thresholds that assume $1 per USG, and USG trades below peg without native redemption. The Admin Safe can bypass the backing through mint and burn authority.
- **Provability: 2.0.** Reserves and collateral are fully onchain and verifiable, but valuations use admin-replaceable oracle wrappers and the yield amount is set offchain.

**Score: 2.75/5** — (3.5 + 2.0) / 2

#### Category 4: Liquidity Risk (Weight: 15%)

sUSG to USG is instant, but USG to USD is market-only, with less than $1M of executable depth and more than 3% loss beyond about $250k. The peg has been persistently discounted, and a full exit by the largest holder would take double-digit losses.

**Score: 4.0/5**

#### Category 5: Operational Risk (Weight: 5%)

Team members are not individually identified, though the team has a known history. Mechanism docs are good, but governance and contract docs are incomplete. No legal entity, bug bounty or incident-response plan is disclosed.

**Score: 3.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.25 | 20% | 0.650 |
| Centralization & Control | 3.83 | 30% | 1.150 |
| Funds Management | 2.75 | 30% | 0.825 |
| Liquidity Risk | 4.0 | 15% | 0.600 |
| Operational Risk | 3.5 | 5% | 0.175 |
| **Final Score** | | | **3.40/5.0** |

No modifiers apply.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk**

sUSG sits near the Elevated boundary. Defer funding an sUSG/USDC market until the USDC-denominated oracle and its fallback are validated, USDC liquidation proceeds support the proposed allocation under stress, and the curator can monitor coverage, liquidity and Tangent Admin Safe actions in real time.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (February 2027).
- **TVL-based:** Reassess if USG supply outside the Peg Keepers or sUSG `totalAssets` changes by more than 50%.
- **Peg-based:** Reassess if the USG aggregator `price()` stays below 0.990 for more than 24 hours, its eligible liquidity falls to zero, or any market records `badDebt > 0`.
- **Incident-based:** Reassess after any USG minter, burner or Peg Keeper change outside market creation, any sUSG role or strategy change, any market oracle replacement, a position-migrator registration, a timelock introduction, the TAN TGE or governance launch, or an exploit.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [November 24, 2026](https://github.com/yearn/risk-score/pull/621) | 3.40 | Initial assessment |
