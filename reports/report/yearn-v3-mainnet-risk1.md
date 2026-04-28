# Protocol Risk Assessment: Yearn V3 — Mainnet Risk-Tier 1 Vaults

- **Assessment Date:** April 27, 2026
- **Vaults Covered:** 6 mainnet Yearn V3 vaults (Role Manager Category 1)
- **Chain:** Ethereum
- **Final Score: 1.3/5.0**

This report covers all six **risk-1** Yearn V3 vaults on Ethereum mainnet. They share the same Yearn V3 vault code, the same Role Manager, the same governance multisigs, the same accountant, the same keeper, and the same 7-day strategy timelock. The risk score is therefore expressed as a single number that applies to all six. Per-vault differences (asset class, strategies, allocation, deposit limits, age) are captured in the dedicated tables and per-vault notes throughout the report.

## Vaults in Scope

| Symbol | Vault Address | Asset | API | Factory | Deployed |
|--------|---------------|-------|-----|---------|----------|
| **yvUSDC-1** | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | USDC | 3.0.2 | [`0x4440…0aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) | 2024-03-12 ([tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) |
| **yvUSDS-1** | [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) | USDS | 3.0.3 | [`0x5577…eb5f`](https://etherscan.io/address/0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f) | 2024-10-08 ([tx](https://etherscan.io/tx/0x6a1996554455945f9ba5f58b831c86f9afaeb1a5c36b9166099a7d3ac0106803)) |
| **yvWETH-1** | [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0) | WETH | 3.0.2 | [`0x4440…0aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) | 2024-03-12 ([tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) |
| **yvDAI-1** | [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c) | DAI | 3.0.2 | [`0x4440…0aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) | 2024-03-12 ([tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) |
| **yvUSDT-1** | [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa) | USDT | 3.0.2 | [`0x4440…0aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) | 2024-07-23 ([tx](https://etherscan.io/tx/0x05681fd5be0e925bb720450418d20eda99bb22adc72be3d702de70368d7cd3ea)) |
| **yvWBTC-1** | [`0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708`](https://etherscan.io/address/0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708) | WBTC | 3.0.4 | [`0x770D…812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) | 2025-05-13 ([tx](https://etherscan.io/tx/0x8cac67b54afe9af0cc072a2e63852c787343ae514638a54d9644894f6b2a3984)) |

All six are registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`) and are governed by Role Manager [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41).

## On-Chain State (snapshot)

| Vault | Total Assets | Total Supply | Idle | Debt | Deposit Limit | PPS | Profit Unlock |
|-------|-------------:|-------------:|-----:|-----:|--------------:|----:|--------------:|
| yvUSDC-1 | 28,311,546.59 USDC | 25,646,988.00 | 173,219.54 | 28,138,327.06 | 50,000,000 USDC | 1.103893 | 10 days |
| yvUSDS-1 | 35,236,511.13 USDS | 32,142,127.29 | 1,723,484.42 | 33,513,026.71 | 100,000,000 USDS | 1.096272 | 3 days |
| yvWETH-1 | 4,077.94 WETH | 3,897.31 | 2,727.94 | 1,350.00 | 15,000 WETH | 1.046349 | 10 days |
| yvDAI-1 | 8,565,115.30 DAI | 7,667,369.22 | 7.54 | 8,565,107.76 | 50,000,000 DAI | 1.117087 | 10 days |
| yvUSDT-1 | 7,124,701.19 USDT | 6,593,988.73 | 7,124,701.19 | 0 | 50,000,000 USDT | 1.080484 | 10 days |
| yvWBTC-1 | 47.5051 WBTC | 47.5034 | 47.5051 | 0 | 100,000 WBTC | 1.000036 | 5 days |

**USD TVL (Chainlink, snapshot):** ETH/USD = $2,288.82, BTC/USD = $76,879.12, WBTC/BTC = 0.99785 (feeds [`0x5f4eC3Df…b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419), [`0xF4030086…E88c`](https://etherscan.io/address/0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c), [`0xfdFD9C85…BB23`](https://etherscan.io/address/0xfdFD9C85aD200c506Cf9e21F1FD8dd01932FBB23)).

| Vault | Native TVL (gross `totalAssets`) | USD TVL (gross) |
|-------|-----------:|--------:|
| yvUSDC-1 | 28,311,547 USDC | ~$28.31M |
| yvUSDS-1 | 35,236,511 USDS | ~$35.24M |
| yvWETH-1 | 4,077.94 WETH | ~$9.33M |
| yvDAI-1 | 8,565,115 DAI | ~$8.57M |
| yvUSDT-1 | 7,124,701 USDT | ~$7.12M |
| yvWBTC-1 | 47.5051 WBTC | ~$3.64M |
| **Combined (gross sum)** | | **~$92.21M** |

**Important — gross vs net:** the **Combined** row is the gross sum of each vault's `totalAssets()` and **double-counts capital that flows through nested vault-of-vaults strategies**. At block 24974187, the internal positions are:

- yvUSDC-1's `USDC to USDS Depositor` holds yvUSDS shares worth ~$28.15M USDS (counted in both yvUSDC-1 and yvUSDS-1)
- yvDAI-1's `DAI to USDC-1 Depositor` holds yvUSDC shares worth ~$6.21M USDC (counted in yvDAI-1 and yvUSDC-1, and through yvUSDC-1's onward routing also in yvUSDS-1)
- yvDAI-1's `DAI to USDS Depositor` holds yvUSDS shares worth ~$2.36M USDS (counted in both yvDAI-1 and yvUSDS-1)

Removing the ~$36.72M of internal cross-counting, the **net unique outside capital** is approximately:

| Bucket | Net unique TVL |
|--------|---------------:|
| Stables (yvUSDC-1 + yvUSDS-1 + yvDAI-1 + yvUSDT-1, de-duplicated) | **~$42.52M** |
| yvWETH-1 | ~$9.33M |
| yvWBTC-1 | ~$3.64M |
| **Net combined** | **~$55.49M** |

Liquidity-depth and capacity comparisons throughout the report should be read against the **net** figure; growth/concentration thresholds in the Reassessment Triggers section refer to per-vault gross `totalAssets()` (as reported on-chain).

**Notes on idle balances:**

- **On-chain (verified):** yvUSDT-1 is 100% idle (`totalDebt = 0`), yvWBTC-1 is 100% idle (`totalDebt = 0`), and yvWETH-1 is ~67% idle (1,350 WETH of 4,078 WETH deployed to the stETH Accumulator only).
- **Team-provided attribution (not on-chain verifiable):** per the Yearn team, this idle posture reflects a precautionary deallocation following the recent rsETH (KelpDAO) incident — funds were pulled from strategies whose underlying markets *could* indirectly hold rsETH as collateral (e.g. Morpho/Aave markets that accept rsETH). None of the queued strategies on these vaults reference rsETH directly, so the deallocation is precautionary, not corrective. **This causal claim has not been verified against an on-chain or off-chain source independent of the team.**
- yvUSDC-1, yvUSDS-1, and yvDAI-1 remain ~99%+ deployed; their funding routes through Sky / Spark and have no rsETH-adjacent surface.
- **TODO:** rerun this assessment once Yearn re-deploys funds back into yvUSDT-1, yvWBTC-1, and the idle portion of yvWETH-1, so the strategy mix and dependency profile reflect steady-state operation.

**Fees:** 0% management fee, **10% performance fee** at the vault level (shared accountant [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69), `defaultConfig() = (0, 1000, 0, 10000, 20000, 1)`). Same fee schedule applies to all six vaults.

**Deposit/Withdraw limit modules:** None set on any vault (`deposit_limit_module` and `withdraw_limit_module` are zero-address). Limits are enforced by the simple `deposit_limit` field on each vault. None of the six vaults are shutdown.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security Repo](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Sky Protocol Documentation](https://developers.skyeco.com/)

---

## Shared Contract Addresses

The six vaults share a single set of governance, accountant, fee, keeper, and debt-allocator contracts. They differ only in vault address, factory version, and per-vault strategies.

### Governance & Operations (identical across all 6 vaults)

| Contract | Address | Configuration |
|----------|---------|---------------|
| Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Yearn V3 Role Manager — single instance for all category-1 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | **6-of-9 Gnosis Safe** — holds 12 of 14 vault roles (all except `ADD_STRATEGY_MANAGER` and `ACCOUNTANT_MANAGER`, which only the Strategy Manager / Timelock holds) |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | **3-of-8 Gnosis Safe** — `roles = 14706` (`REVOKE_STRATEGY_MANAGER + QUEUE_MANAGER + REPORTING_MANAGER + DEBT_MANAGER + MAX_DEBT_MANAGER + DEPOSIT_LIMIT_MANAGER + WITHDRAW_LIMIT_MANAGER + PROFIT_UNLOCK_MANAGER + DEBT_PURCHASER + EMERGENCY_MANAGER`) |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | **4-of-7 Gnosis Safe** — `roles = 8384` (`DEBT_MANAGER + MAX_DEBT_MANAGER + EMERGENCY_MANAGER`) |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** (`getMinDelay() = 604800`). `roles = 143` on each vault (`ADD_STRATEGY_MANAGER + REVOKE_STRATEGY_MANAGER + FORCE_REVOKE_MANAGER + ACCOUNTANT_MANAGER + MAX_DEBT_MANAGER`) |
| Keeper (yHaaSRelayer) | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot — `roles = 32` (`REPORTING_MANAGER` only) |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — `roles = 96` (`REPORTING_MANAGER + DEBT_MANAGER`). The Role Manager returns this same address for all six vaults via `getDebtAllocator(vault)` |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Yearn Accountant. Default: 0% mgmt, 10% perf, 0% refund, 100% max fee, 200% max gain, 1bp max loss |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |

### Vault Factories

Three factory versions are in use across the six vaults:

| Factory | Address | apiVersion | Vault Original (TokenizedStrategy implementation) | Vaults Using |
|---------|---------|-----------|---------------------------------------------------|--------------|
| v3.0.2 | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) | "3.0.2" | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) | yvUSDC-1, yvWETH-1, yvDAI-1, yvUSDT-1 |
| v3.0.3 | [`0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f`](https://etherscan.io/address/0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f) | "3.0.3" | [`0xcA78AF7443f3F8FA0148b746Cb18FF67383CDF3f`](https://etherscan.io/address/0xcA78AF7443f3F8FA0148b746Cb18FF67383CDF3f) | yvUSDS-1 |
| v3.0.4 | [`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) | "3.0.4" | [`0xd8063123BBA3B480569244AE66BFE72B6c84b00d`](https://etherscan.io/address/0xd8063123BBA3B480569244AE66BFE72B6c84b00d) | yvWBTC-1 |

All vaults are deployed as **immutable Vyper minimal proxies (EIP-1167)** pointing at the factory's `vault_original`. There is no upgrade path on any individual vault.

### Strategy Manager (Timelock) — Detailed Roles

The Strategy Manager (TimelockController) is the **only** holder of `ADD_STRATEGY_MANAGER` and `ACCOUNTANT_MANAGER` on every vault, meaning all strategy additions and accountant changes pass through a 7-day delay. Detailed timelock role configuration is identical to the prior yvUSDC-1 report — see Appendix B.

---

## Per-Vault Strategy Allocation (current)

The Debt Allocator and Brain rebalance debt across the strategies in each vault's queue. Below is the **current** snapshot. Allocations have changed materially over the past months and will continue to.

### yvUSDC-1 — Strategies

| Strategy | Address | Current Debt (USDC) | % | Activated | Last Report |
|----------|---------|--------------------:|--:|-----------|-------------|
| **USDC to USDS Depositor** | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52) | **28,138,327.06** | **100%** | 2025-05-15 | 2026-04-22 |
| USDC Fluid Lender | [`0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF`](https://etherscan.io/address/0x00C8a649C9837523ebb406Ceb17a6378Ab5C74cF) | 0 | 0% | 2025-08-19 | 2026-03-19 |
| Morpho Steakhouse USDC Compounder | [`0x074134A2784F4F66b6ceD6f68849382990Ff3215`](https://etherscan.io/address/0x074134A2784F4F66b6ceD6f68849382990Ff3215) | 0 | 0% | 2024-12-17 | 2026-04-19 |
| Spark USDC Lender | [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) | 0 | 0% | 2024-09-04 | 2025-05-27 |
| Aave V3 Lido USDC Lender | [`0x522478B54046aB7197880F2626b74a96d45B9B02`](https://etherscan.io/address/0x522478B54046aB7197880F2626b74a96d45B9B02) | 0 | 0% | 2024-11-09 | 2025-03-12 |
| Aave V3 USDC Lender | [`0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858`](https://etherscan.io/address/0x694cdD19EBee7A974BA8fE3AF8B383bb256F2858) | 0 | 0% | 2025-11-07 | 2026-01-31 |
| USDC to sUSDS Lender | [`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f) | 0 | 0% | 2026-03-04 | 2026-04-22 |

**Important:** as of this snapshot, yvUSDC-1's debt is fully concentrated in `USDC to USDS Depositor`, which deposits into **yvUSDS-1** (`0x182863131F9a4630fF9E27830d945B1413e347E8`) — confirmed via `VAULT()` and onchain USDC approval. This makes yvUSDC-1 effectively a wrapper around yvUSDS-1 today.

### yvUSDS-1 — Strategies

| Strategy | Address | Current Debt (USDS) | % | Activated | Last Report |
|----------|---------|--------------------:|--:|-----------|-------------|
| **Spark USDS Compounder** | [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3) | **31,047,030.22** | **92.6%** | 2025-07-14 | 2026-04-23 |
| **sUSDS Lender** | [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1) | **2,465,424.05** | **7.4%** | 2025-05-15 | 2026-04-23 |
| Aave V3 Lido USDS Lender | [`0xC08d81aba10f2dcBA50F9A3Efbc0988439223978`](https://etherscan.io/address/0xC08d81aba10f2dcBA50F9A3Efbc0988439223978) | 572.44 | <0.01% | 2024-10-08 | 2026-04-23 |
| Aave V3 USDS Lender | [`0xD144eAFf17b0308a5154444907781382398AaC61`](https://etherscan.io/address/0xD144eAFf17b0308a5154444907781382398AaC61) | 0 | 0% | 2025-11-07 | 2026-03-04 |
| USDS Sky Rewards Compounder | [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | 0 | 0% | 2025-05-16 | 2026-02-05 |

The **Spark USDS Compounder** stakes USDS into the Sky **USDS Staking Rewards** contract ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)) and harvests SPK token rewards (rewardsToken = [`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066), the SPK token). This is the **dominant yield source** for the entire stable side of the system because yvUSDC-1 and most of yvDAI-1 ultimately route through yvUSDS-1.

### yvWETH-1 — Strategies

| Strategy | Address | Current Debt (WETH) | % | Activated | Last Report |
|----------|---------|--------------------:|--:|-----------|-------------|
| **stETH Accumulator** | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | **1,350.10** | **33.1% of TVL** | 2026-04-16 | 2026-04-26 |
| Spark WETH Lender | [`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15) | 0 | 0% | 2024-09-04 | 2025-05-27 |
| Aave V3 Lido WETH Lender | [`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0) | 0 | 0% | 2024-10-08 | 2026-03-19 |
| Morpho Gauntlet WETH Prime Compounder | [`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7) | 0 | 0% | 2024-12-17 | 2026-04-19 |
| Aave V3 WETH Lender | [`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8) | 0 | 0% | 2025-11-07 | 2026-04-13 |

**Accounting (and where it can lag):** at block 24974187 the strategy holds **355.37 stETH directly** (no wstETH/WETH locally), `pendingRedemptions = 1,000 stETH`, `WETH balance = 0`, and `estimatedTotalAssets() = 355.37`. By contrast the TokenizedStrategy `totalAssets()` and the vault's `current_debt` for this strategy still report **1,350.10 WETH** — the gap is the pending Lido withdrawal request **#121758** (1,000 stETH, requested 2026-04-20 20:23 UTC, `getWithdrawalStatus([121758]).isFinalized = false` as of 2026-04-27 21:57 UTC). While `pendingRedemptions > 0`, `_harvestAndReport()` is blocked, so any peg slippage between the requested-stETH value and 1:1 WETH is not realized into PPS until the request is finalized and claimed. **Do not read the 1,350.10 WETH figure as real-time, on-chain liquid backing**; the in-flight portion settles only when Lido finalizes and `manualClaimWithdrawals()` is run. Verified against `BaseLSTAccumulator.sol` on Etherscan. See the Funds Management and Liquidity Risk sections for unwind paths.

### yvDAI-1 — Strategies

| Strategy | Address | Current Debt (DAI) | % | Activated | Last Report |
|----------|---------|-------------------:|--:|-----------|-------------|
| **DAI to USDC-1 Depositor** | [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) | **6,207,746.87** | **72.5%** | 2025-10-24 | 2026-04-22 |
| **DAI to USDS Depositor** | [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | **2,357,360.90** | **27.5%** | 2025-05-15 | 2026-04-22 |
| Savings Dai (sDAI) | [`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA) | 0 | 0% | 2024-03-14 | 2025-10-24 |
| Spark DAI Lender | [`0x1fd862499e9b9402DE6c599b6C391f83981180Ab`](https://etherscan.io/address/0x1fd862499e9b9402DE6c599b6C391f83981180Ab) | 0 | 0% | 2024-03-14 | 2025-10-24 |
| Aave V3 DAI Lender | [`0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B`](https://etherscan.io/address/0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B) | 0 | 0% | 2025-11-07 | 2025-11-07 |

**Important:** `DAI to USDC-1 Depositor` deposits DAI into **yvUSDC-1** (verified via `VAULT()` returning `0xBe53…6204` and the unlimited USDC approval onchain). `DAI to USDS Depositor` routes into **yvUSDS-1**. So **100% of yvDAI-1's deployed funds end up inside yvUSDC-1 or yvUSDS-1**, which themselves end up at Sky/Spark. See dependency chain in the appendix.

Note: the queue still contains `Savings Dai` (a direct sDAI ERC-4626 wrapper from MakerDAO at `0x83F20F44975D03b1b09e64809B757c47f942BEeA`) — this is the canonical sDAI token, included in the queue but not currently funded.

### yvUSDT-1 — Strategies (currently 0% deployed)

| Strategy | Address | Current Debt (USDT) | % | Activated | Last Report |
|----------|---------|--------------------:|--:|-----------|-------------|
| USDT Fluid Lender | [`0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72`](https://etherscan.io/address/0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72) | 0 | 0% | 2025-08-19 | 2026-03-19 |
| Spark USDT Lender | [`0xED48069a2b9982B4eec646CBfA7b81d181f9400B`](https://etherscan.io/address/0xED48069a2b9982B4eec646CBfA7b81d181f9400B) | 0 | 0% | 2024-09-04 | 2025-05-18 |
| Morpho Gauntlet USDT Prime Compounder | [`0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F`](https://etherscan.io/address/0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F) | 0 | 0% | 2025-01-07 | 2026-04-19 |
| Morpho Steakhouse USDT Compounder | [`0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5`](https://etherscan.io/address/0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5) | 0 | 0% | 2025-01-07 | 2025-05-13 |
| Aave V3 USDT Lender | [`0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2`](https://etherscan.io/address/0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2) | 0 | 0% | 2025-11-07 | 2026-04-08 |

**yvUSDT-1 holds 7.12M USDT but currently deploys none of it** (`totalDebt = 0`, on-chain). The PPS has still appreciated to 1.080484, so debt was deployed historically. Per the Yearn team (unverified), the current 100%-idle posture is a precautionary deallocation tied to the rsETH incident; reassess once funds return.

### yvWBTC-1 — Strategies (currently 0% deployed)

| Strategy | Address | Current Debt (WBTC) | % | Activated | Last Report |
|----------|---------|--------------------:|--:|-----------|-------------|
| Aave V3 WBTC Lender | [`0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc`](https://etherscan.io/address/0x0B9Ae07457BAED5536B1f3e78C9649E980fB4EDc) | 0 | 0% | 2025-05-18 | 2026-04-12 |

yvWBTC-1 is the **newest and least mature vault** of the six. It has only **one strategy** in its default queue, and currently **zero debt is deployed** (on-chain; per the Yearn team this is tied to the rsETH-related deallocation — unverified). PPS has barely moved (1.000036). The `deposit_limit` is set to **100,000 WBTC** (≈ $7.7B at current Chainlink BTC/USD), which is materially above any plausible near-term TVL — see the Reassessment Triggers section for the action item to either tighten the cap or document its intent before the vault re-deploys.

---

## Audits and Due Diligence Disclosures

Audit coverage applies to the **shared V3 framework** (vault contracts and TokenizedStrategy implementation) used by all six vaults equally. The factory differences (3.0.2 / 3.0.3 / 3.0.4) are minor patch versions.

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

The v3.0.3 and v3.0.4 patch releases (used by yvUSDS-1 and yvWBTC-1 respectively) were reviewed **internally** by the Yearn team rather than re-engaging external auditors. The diffs from v3.0.2 are minor patch-level changes; the external audits cover the core architecture. Source: [yearn-vaults-v3 GitHub releases](https://github.com/yearn/yearn-vaults-v3/releases).

### Underlying Protocol Audits (per asset)

| Underlying | Audits | Notes |
|------------|--------|-------|
| **Sky / MakerDAO (USDS, sUSDS, PSM, USDS Staking Rewards)** | ChainSecurity (9), Cantina (10), Sherlock (1 contest), Trail of Bits, PeckShield, Quantstamp, ABDK | Most extensively audited DeFi protocol. $10M Immunefi bounty |
| **Morpho (USDC/USDT/WETH compounders)** | 25+ audits across Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora; formal verification | Blue-chip, $6.6B+ TVL |
| **Aave V3 (WBTC/USDT/USDS/WETH/DAI/USDC lenders, Lido Aave market)** | Multiple audits across SigmaPrime, Certora, OpenZeppelin, Trail of Bits, ABDK | Blue-chip, $30B+ TVL |
| **Spark (Spark{Asset}Lender / Spark{Asset}Compounder)** | ChainSecurity, Cantina (Spark Lend / SparkDAO) | Sub-DAO of Sky, audited stack |
| **Fluid (USDC/USDT Fluid Lenders)** | PeckShield, StateMind, MixBytes, Cantina (8 audits) | Already covered under [`fluid.md`](./fluid.md) score 1.1/5 |
| **Lido (stETH Accumulator dependency on yvWETH-1)** | Multiple audits — see [Lido security](https://lido.fi/security) | Largest LST, $20B+ TVL |
| **Maker PSM Lite + DAI-USDS Exchanger** | ChainSecurity, Cantina | Used by USDC↔DAI↔USDS conversion strategies |

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)) — review level (ySec security review), test coverage, complexity (sLOC), risk exposure, centralization risk, protocol integration count, etc. Category-1 (risk-1) is the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200K** max payout (Critical). 40 contracts in scope, includes V3 vaults. Median resolution 18h. https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Sky / MakerDAO (Immunefi):** **$10M** max payout (Critical). https://immunefi.com/bug-bounty/sky/
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity (per vault)

| Vault | Active Strategies | Conversion Hops | Leverage | Cross-chain |
|-------|------------------:|-----------------|---------:|-------------|
| yvUSDC-1 | 1 | USDC → DAI (PSM) → USDS → yvUSDS-1 → (Spark/sUSDS) | None | No |
| yvUSDS-1 | 3 | USDS → SPK staking / sUSDS / Aave aUSDS | None | No |
| yvWETH-1 | 1 | WETH → stETH (Lido) | None | No |
| yvDAI-1 | 2 | DAI → yvUSDC-1 (then USDS chain) **or** DAI → USDS (Exchanger) → yvUSDS-1 | None | No |
| yvUSDT-1 | 0 (queue of 5) | n/a today | None | No |
| yvWBTC-1 | 0 (queue of 1) | n/a today | None | No |

No leverage anywhere. No cross-chain bridging. yvDAI-1 / yvUSDC-1 do route through other Yearn V3 vaults — this is **vault-of-vaults composition**, not leverage, but is a non-trivial dependency to track (see Risks).

---

## Historical Track Record

| Vault | Live Since | Months Live | TVL | Cumulative PPS | Annualized | Incidents |
|-------|------------|------------:|-----|---------------:|-----------:|-----------|
| yvUSDC-1 | 2024-03-12 | ~25.5 | 28.31M USDC | +10.39% | ~4.8% | None |
| yvUSDS-1 | 2024-10-08 | ~18.6 | 35.24M USDS | +9.63% | ~6.1% | None |
| yvWETH-1 | 2024-03-12 | ~25.5 | 4,078 WETH | +4.63% | ~2.2% | None |
| yvDAI-1 | 2024-03-12 | ~25.5 | 8.57M DAI | +11.71% | ~5.4% | None |
| yvUSDT-1 | 2024-07-23 | ~21.1 | 7.12M USDT | +8.05% | ~4.5% | None |
| yvWBTC-1 | 2025-05-13 | ~11.5 | 47.5 WBTC | +0.004% | ~0% | None (essentially undeployed) |

**Yearn V3 framework:** live since **May 2024 (~23 months)**. No V3 exploits across the framework or any specific vault, including the six covered here. The Yearn protocol manages **~$197.5M total** across all chains (DefiLlama, April 2026) — Ethereum is the dominant chain with ~$149.6M, followed by Katana (~$43.1M). Source: [defillama.com/protocol/yearn](https://defillama.com/protocol/yearn).

**Strategy churn:** the queues across these vaults show typical Yearn behavior — strategies added and removed as integrations mature or get deprecated. The yvUSDC-1 queue alone has had 15+ strategies added and 6+ revoked over its lifetime. Active management is part of the design.

---

## Funds Management

The six vaults all deploy underlying assets into yield strategies via the same Yearn V3 ERC-4626 pattern. What differs is the **strategy mix** and the **underlying asset's yield surface**.

### Vault-of-Vaults Composition

A notable structural feature is that several strategies route into **other Yearn V3 vaults in this same set**:

```
yvDAI-1 ───── 72.5% ──→ yvUSDC-1 ──── 100% ──→ yvUSDS-1 ──┐
        └──── 27.5% ────────────────────────→  yvUSDS-1 ──┤
                                                          ├─→ 92.6% Spark USDS Compounder (Sky SPK farm)
                                                          ├─→ 7.4% sUSDS Lender (Sky Savings Rate)
                                                          └─→ <0.01% Aave V3 Lido aUSDS
```

So today, **all stable-asset deposits ultimately concentrate into yvUSDS-1's strategies** — predominantly the Sky USDS Staking Rewards (SPK farm) via the Spark USDS Compounder. This concentration:

- **Simplifies the underlying yield source** (one farm provides ~90% of the stable yield across yvUSDC-1, yvUSDS-1, and most of yvDAI-1)
- **Compounds dependency risk** — a problem at the Sky USDS Staking contract or with USDS itself would impact all four stable vaults simultaneously

### Per-Vault Asset / Yield Notes

**yvUSDC-1 (USDC, ~28.3M):** Currently 100% routed via `USDC to USDS Depositor` → yvUSDS-1. Pipeline: USDC → DAI (Maker PSM Lite at 1:1, 0 fee) → USDS (Sky DAI-USDS Exchanger, 1:1) → yvUSDS-1. Withdrawals reverse the path. The strategy has a 0.05% PSM-fee fallback to Uniswap V3 with 0.5% slippage. Other queued strategies (Morpho compounders, Aave, Fluid, sUSDS Lender, Spark) are dormant but available.

**yvUSDS-1 (USDS, ~35.2M):** Spark USDS Compounder dominates (92.6%) — stakes USDS into the Sky USDS Staking Rewards contract ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)) for SPK token rewards, then sells SPK back to USDS. sUSDS Lender (7.4%) deposits directly into the [Sky Savings vault `0xa3931d…fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) (5.38B USDS TVL) for SSR. Aave Lido USDS dust position (~$572).

**yvWETH-1 (WETH, ~4,078 WETH):** Only the **stETH Accumulator** is funded (1,350 WETH allocated; strategy currently holds 355.37 stETH directly, with the rest in pending Lido withdrawal-queue requests as tracked by `pendingRedemptions`). The strategy code (`Strategy.sol` / `BaseLSTAccumulator.sol`, verified on Etherscan) confirms:

- **Stake path:** WETH unwrapped to ETH, then either swapped through the Curve ETH/stETH pool ([`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022)) when Curve quotes a better-than-1:1 rate, or staked directly with Lido via `submit{value}()` for a guaranteed 1:1.
- **Unwind path (manual, management-only):** three options — (a) `manualSwapToAsset()` swaps stETH → ETH via Curve with a min-out, (b) `initiateLSTWithdrawal()` queues stETH in the Lido withdrawal queue ([`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)) for guaranteed 1:1 redemption (1–7 days under normal load), or (c) emergency `manualClaimWithdrawals()`. There is **no automatic unwind on user withdrawal**: `_freeFunds()` is a no-op, and `availableWithdrawLimit()` returns only `balanceOfAsset()` (the strategy's loose WETH balance). Users can only exit the share of WETH that management has pre-positioned as idle.
- **Accounting buffer:** `reportBuffer` haircuts the LST value in `estimatedTotalAssets()` to absorb peg slippage, and `pendingRedemptions` blocks `_harvestAndReport()` from running while withdrawal requests are in flight (preventing double-counting).

This is a deliberately conservative LST integration. Remaining ~67% of the vault is idle (attributed by the Yearn team — unverified — to the rsETH-related deallocation noted above).

**yvDAI-1 (DAI, ~8.57M):** 72.5% via `DAI to USDC-1 Depositor` → yvUSDC-1, then on to yvUSDS-1. 27.5% via `DAI to USDS Depositor` → yvUSDS-1 directly. Both paths terminate at yvUSDS-1's Sky/Spark mix. sDAI direct deposit and Spark DAI Lender are dormant.

**yvUSDT-1 (USDT, ~7.12M):** Currently 100% idle (on-chain). Five strategies queued (Fluid, Spark, two Morpho compounders, Aave V3) — none receiving debt at the snapshot. The vault was previously deployed (PPS = 1.080484 implies historical yield); the current posture is attributed by the Yearn team to a precautionary, rsETH-related deallocation (unverified). Reassess once funds return to strategies.

**yvWBTC-1 (WBTC, ~47.5 WBTC):** Currently 100% idle (on-chain). Only one strategy (Aave V3 WBTC Lender) queued, with no debt deployed at the snapshot — per the Yearn team this is also tied to the rsETH-related precautionary deallocation (unverified). Newest vault in the set (~12 months old). The Aave V3 WBTC market would resume yield once the deallocation is reversed.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to per-vault `deposit_limit`. No per-user gating (no deposit limit module).
- **Withdrawals:** ERC-4626 `withdraw` / `redeem`. No cooldown or queue. Atomic when there is sufficient idle + liquid strategy capacity. Withdrawals for stable vaults route through the underlying chain (PSM, Exchanger, sUSDS, Spark, Morpho, Aave). Withdrawals for yvWETH-1 may need to liquidate stETH via Curve or wait for the Lido queue. Withdrawals for yvUSDT-1 and yvWBTC-1 today come from idle balance with no slippage.
- **Fees:** 0% management, 10% performance — uniform across all six.

### Collateralization

- **100% on-chain backing** in the vault's nominal asset (deposits flow back to the same asset on withdrawal).
- **Collateral quality (per asset):**
  - Stables (yvUSDC-1, yvUSDS-1, yvDAI-1, yvUSDT-1) → ultimately Sky/Spark/Morpho/Aave blue-chip exposure. sUSDS is backed by Sky's over-collateralized loans + RWA Treasury bills.
  - yvWETH-1 → Lido stETH (largest LST, $20B+ TVL, 30+ node operator set, audited stack).
  - yvWBTC-1 → idle (no exposure today).
- **No leverage** anywhere.
- **Fully redeemable** via ERC-4626. yvWETH-1 has the only meaningful redemption-path question (stETH-WETH peg).

### Provability

- ERC-4626 standard `convertToAssets` / `convertToShares`, fully on-chain, real-time
- Each strategy's `totalAssets()` reads underlying balances on-chain (yvUSDS shares, sUSDS shares, stETH balances, etc.)
- Profits reported by the keeper (`yHaaSRelayer`) via `process_report()` and unlock linearly over each vault's `profitMaxUnlockTime` (3, 5, or 10 days depending on vault — see snapshot table)
- Losses are immediately reflected in PPS
- **yvWETH-1 stETH Accumulator caveat:** while a Lido withdrawal request is in flight (`pendingRedemptions > 0`), `_harvestAndReport()` is blocked, so the strategy's `current_debt` / `totalAssets()` continue to value the in-flight portion at the pre-request mark — accounting can lag actual settlement until the request is finalized and claimed. See the strategy section above for the current example.

---

## Liquidity Risk

| Vault | Exit pipeline | Underlying liquidity | Same-asset? | Withdrawal restriction | Liquidity score |
|-------|---------------|----------------------|-------------|------------------------|----------------:|
| yvUSDC-1 | yvUSDS-1 → USDS → DAI (Exchanger) → USDC (PSM) | sUSDS $5.38B; PSM billions; Spark/Morpho deep | Yes | None | 1.5 |
| yvUSDS-1 | Spark Compounder unstake → USDS; sUSDS withdraw → USDS | sUSDS $5.38B; SPK staking unstake instant | Yes | None | 1.5 |
| yvWETH-1 | Manual: management converts stETH → WETH via Curve or Lido queue. User withdrawals capped at strategy's loose WETH | Curve stETH/ETH pool deep; Lido withdrawal queue typically 1–7 days | No (stETH/ETH peg risk; manual unwind only) | User cannot force unwind of staked stETH; only loose WETH available | 2.5 |
| yvDAI-1 | yvUSDC-1 / yvUSDS-1 paths combined | Same as above | Yes | None | 1.5 |
| yvUSDT-1 | 100% idle, atomic | n/a | Yes | None today | 1.0 |
| yvWBTC-1 | 100% idle, atomic | n/a | Yes | None today | 1.0 |

**Key points:**

- **Sky-routed stables (yvUSDC-1, yvUSDS-1, yvDAI-1):** ~$42M of net unique capital ultimately sits in the Sky/Spark stack (sUSDS + USDS Staking SPK farm), small relative to sUSDS ($5.38B), Maker PSM, and the Spark/Aave/Morpho USDS markets. The cascading vault-of-vaults structure does mean a withdrawal from yvDAI-1 may trigger withdrawals from yvUSDC-1 and then yvUSDS-1 — atomic, but multiple strategy `withdraw()` calls need to settle in the same transaction.
- **yvUSDT-1:** 100% idle today; its queued strategies are USDT-denominated (Fluid, Spark USDT, two Morpho USDT compounders, Aave V3 USDT) and do **not** route through the Sky/USDS stack. Liquidity is trivially atomic at the snapshot.
- **yvWETH-1:** small/medium withdrawals are easily covered by the ~67% idle balance plus the strategy's loose WETH. Beyond that, the strategy does **not** auto-unwind stETH on user withdrawal — `availableWithdrawLimit()` returns only the strategy's loose WETH balance (verified in `BaseLSTAccumulator.sol`). Management must pre-position WETH via `manualSwapToAsset()` (Curve, immediate) or `initiateLSTWithdrawal()` (Lido queue, 1–7 days normal load). Larger redemptions are therefore management-paced, not user-paced.
- **yvUSDT-1 / yvWBTC-1:** trivially liquid today (0% deployed). Risk score reflects current state, **but** if the Debt Allocator routes funds into the queued strategies (especially the Aave WBTC market, where WBTC has had concentrated liquidity issues historically), a re-assessment of the liquidity score may be warranted.

**Deposit limits relative to current TVL:**
- yvUSDC-1: $50M cap vs $28.3M TVL (room for +77%)
- yvUSDS-1: $100M cap vs $35.2M TVL (room for +184%)
- yvWETH-1: 15K WETH cap vs 4,078 WETH (room for +268%)
- yvDAI-1: $50M cap vs $8.57M (room for +484%)
- yvUSDT-1: $50M cap vs $7.12M (room for +602%)
- yvWBTC-1: 100,000 WBTC cap vs 47.5 WBTC — cap is materially oversized; tracked as an action item under Reassessment Triggers

---

## Centralization & Control Risks

### Governance (identical for all 6 vaults)

| Position | Address | Threshold | Roles bitmap | Roles on every vault |
|----------|---------|-----------|--------------|----------------------|
| **Daddy / ySafe** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | **6-of-9** | 16374 | 12 of 14 vault roles (all except `ADD_STRATEGY_MANAGER` and `ACCOUNTANT_MANAGER`) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | **3-of-8** | 14706 | REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, MAX_DEBT, DEPOSIT_LIMIT, WITHDRAW_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | **4-of-7** | 8384 | DEBT, MAX_DEBT, EMERGENCY |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | 143 | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | 32 | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | 96 | REPORTING + DEBT |

ySafe 6-of-9 signers are publicly known DeFi contributors (Mariano Conti, Leo Cheng, 0xngmi, Michael Egorov, etc.) — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig).

**Key governance properties (all 6 vaults):**

1. **No EOA holds vault roles directly** — all sensitive roles are on multisigs or the timelock or automated bots
2. **Strategy additions and accountant changes pass through a 7-day timelock** — only the Strategy Manager has these roles, and the timelock has Daddy as the sole proposer. Verified `getMinDelay() = 604800`.
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself (not Daddy). Reducing the delay or granting/revoking PROPOSER roles must also go through 7 days. DEFAULT_ADMIN was never granted (`admin=address(0)` at construction).
4. **Vault contracts are immutable** — Vyper minimal proxies pointing at fixed `vault_original`. No proxy upgrade path.
5. **Same governance pattern shared across 37+ Yearn V3 vaults** — battle-tested

### Programmability

- **PPS:** ERC-4626, fully algorithmic
- **Vault operations:** permissionless deposit/withdraw on-chain
- **Strategy reporting:** automated via keeper bot
- **Debt allocation:** Debt Allocator (automated) + Brain multisig (manual)
- **No off-chain inputs to PPS or fund movement.** Withdrawals can fail to fully fill if a strategy lacks instant liquidity, but the path is deterministic.

### External Dependencies

| Dependency | Used by | Criticality | Notes |
|-----------|---------|-------------|-------|
| **Sky / MakerDAO (USDS, sUSDS, USDS Staking, PSM Lite, DAI-USDS Exchanger)** | yvUSDC-1, yvUSDS-1, yvDAI-1 (essentially 100% of stable funds today) | **Critical** | Blue-chip. $10M Immunefi bounty. The Sky USDS Staking Rewards contract (SPK farm) is the single biggest underlying yield source |
| **Lido (stETH)** | yvWETH-1 (33% of TVL, 100% of deployed) | High | Largest LST. Curve stETH/ETH peg has been stable post-Shapella |
| **Morpho** | Queue-only on yvUSDC-1, yvUSDT-1, yvWETH-1 | Low (currently dormant) | Available; not currently funded |
| **Aave V3 (incl. Lido market)** | Queued on most vaults; trivial dust on yvUSDS-1 | Low | Available; minimal current exposure |
| **Spark** | Queued on yvUSDC-1, yvWETH-1, yvUSDT-1, yvDAI-1 | Low (currently dormant) | Sky sub-DAO |
| **Fluid** | Queue-only on yvUSDC-1, yvUSDT-1 | Low (currently dormant) | Score 1.1/5 per [`fluid.md`](./fluid.md) |
| **Maker PSM Lite** | yvUSDC-1, yvDAI-1 (USDC↔DAI conversion) | High when USDC strategies route via Sky | 1:1 at 0% fee currently |
| **Uniswap V3 (fallback)** | yvUSDC-1 PSM-fee fallback (0.05% threshold, 0.5% slippage) | Low | Inactive while PSM fee = 0 |

**Dependency quality:** every funded strategy today routes into a top-tier protocol (Sky, Lido). Concentration into Sky is the most material centralization risk for the stable vaults.

---

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors. ySafe 6-of-9 with named signers.
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults. Clear role separation.
- **Documentation:** Comprehensive Yearn V3 docs. All strategy contracts verified on Etherscan.
- **Legal:** ychad.eth is a [BORG](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540) — Cayman foundation wrapper around the multisig, with smart-contract governance restrictions.
- **Incident response:** 4 historical incidents handled (all V1/legacy). V3 has not been stress-tested by an exploit. $200K Immunefi bug bounty provides responsible disclosure.
- **V3 immutability tradeoff:** vaults cannot be upgraded — eliminates proxy upgrade risk, but a critical bug requires deploying a new vault and migrating users.

---

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting:

- **Large-flow alerts** ([`yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/yearn/alert_large_flows.py)) — runs **hourly** via GitHub Actions with Telegram alerts. Verified against the script's `VAULTS` dictionary: **yvUSDC-1, yvUSDS-1, yvWETH-1, yvDAI-1, yvUSDT-1 are all present; yvWBTC-1 is NOT yet in the monitored list** — likely an oversight given how recently it was deployed and that it currently holds no debt. Recommend Yearn adds it.
- **Endorsed-vault check** (`yearn/check_endorsed.py`) — weekly. Verifies all V3 vaults are endorsed in the registry.
- **Timelock monitoring** (`timelock/timelock_alerts.py`) — monitors the Yearn TimelockController across multiple chains, including the shared Strategy Manager used here.

### Critical Events to Monitor

For any of the 6 vaults:

- **PPS decrease** — `convertToAssets(1 share)` should only increase. Any decrease = loss event.
- **Strategy additions/removals** — `StrategyChanged` events. New strategies pass through the 7-day timelock.
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy`, `DebtUpdated`.
- **Emergency actions** — `Shutdown` event.
- **ySafe / Brain / Security signer or threshold changes** — governance integrity.
- **Idle ratio spikes** (especially for yvUSDT-1 and yvWBTC-1) — could indicate a strategy issue.
- **stETH/ETH peg deviation** — affects yvWETH-1 specifically.
- **Sky USDS Staking SPK reward rate** — affects yvUSDS-1 yield (and downstream yvUSDC-1, yvDAI-1).
- **PSM `tin`/`tout`** — if non-zero, the USDC↔DAI fallback path activates.
- **Underlying TVL changes at sUSDS / Spark / Sky USDS Staking** — affects systemic capacity.

---

## Risk Summary

### Key Strengths (apply to all 6 vaults)

- **Battle-tested Yearn V3 infrastructure.** 3 audits by top firms, 23 months of clean V3 production history. Immutable vault contracts.
- **Strong governance.** Shared Role Manager + 6-of-9 named-signer ySafe + 7-day timelock on strategy additions and accountant changes. No EOA vault roles. Self-governed timelock cannot have its delay reduced without 7-day notice.
- **Blue-chip dependencies.** Funded strategies all route into Sky, Lido, or are idle. No exotic protocol exposure.
- **No leverage. No cross-chain.** Simple ERC-4626 mechanics throughout.
- **Standard pattern across 37+ vaults.** Consistency reduces operational risk.
- **Active monitoring** via Yearn's monitoring-scripts repo with hourly alerts.

### Key Risks

- **Concentration into Sky / Spark (yvUSDC-1, yvUSDS-1, yvDAI-1).** Three of the four stable vaults route — directly or via vault-of-vaults composition — into Sky USDS Staking Rewards (SPK farm) and sUSDS. A bug or governance failure at Sky would propagate to that ~$42M of net stable TVL. **yvUSDT-1 is excluded from this concentration today**: it is 100% idle and its queued strategies (Fluid USDT, Spark USDT, Morpho USDT compounders, Aave V3 USDT) do not route through the Sky/USDS stack. If yvUSDT-1 ever adds a USDS-denominated strategy, this exclusion no longer holds.
- **Vault-of-vaults composition.** yvDAI-1 → yvUSDC-1 → yvUSDS-1 means three layers of strategies and three accounting boundaries. A bug in one vault's accounting cascades. Withdrawals are atomic but require multiple `withdraw()` calls to settle in the same transaction.
- **stETH peg + manual unwind on yvWETH-1.** The stETH Accumulator does not auto-unwind on user withdrawal. Management must pre-position WETH; large redemptions are management-paced.
- **Idle posture on yvUSDT-1, yvWBTC-1, and most of yvWETH-1.** All three are partially or fully un-deployed on-chain. Per the Yearn team (unverified attribution) this is a precautionary deallocation following the rsETH (KelpDAO) incident, since affected funds had been routed into Aave/Morpho markets that *could* indirectly hold rsETH as collateral. Reassess once funds are re-deployed and the steady-state strategy mix is observable on-chain.
- **yvWBTC-1 deposit limit is oversized** at 100,000 WBTC (≈ $7.7B). Not a safety risk while the vault has no active strategy, but should be tightened or its rationale documented before funds re-deploy. Tracked under Reassessment Triggers.
- **yvWBTC-1 not in `alert_large_flows.py`** monitoring list. Add before any meaningful TVL.
- **Sky Savings Rate / SPK reward rate variability** — affects yields, not principal.
- **PSM fee risk** — currently 0%, but Sky governance can change. Fallback routes via Uniswap V3 with 0.5% slippage.

### Critical Risks

- None identified. All gates pass. The dominant systemic risk is **a Sky USDS / sUSDS / USDS Staking failure**, which would simultaneously impair the four stable vaults — but this is a system-wide DeFi event, not a Yearn-specific risk.

---

## Risk Score Assessment

**Scoring guidelines:**
- Conservative: when between two scores, choose the higher (riskier) one
- Decimals (e.g. 1.5) for in-between cases
- Onchain evidence > documentation claims

### Critical Risk Gates (apply to all 6 vaults)

- [x] **No audit** — V3 framework: 3 top-firm audits. Underlying protocols audited extensively. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 throughout, all positions on-chain verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with named signers, 7-day timelock on critical roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 top firms (Statemind, ChainSecurity, yAcademy). Underlying: Sky 7+, Morpho 25+, Aave multiple, Lido multiple |
| Bug bounty | Yearn $200K (Immunefi); Sky $10M; Lido bounty active |
| Production history | yvUSDC/WETH/DAI: ~25 months. yvUSDT-1: ~21 months. yvUSDS-1: ~19 months. yvWBTC-1: **~12 months only** |
| TVL | ~$92.21M combined (Chainlink): $28.31M USDC + $35.24M USDS + $9.33M WETH + $8.57M DAI + $7.12M USDT + $3.64M WBTC |
| Security incidents | None on V3, none on the underlying protocols funded today |
| Strategy review | 12-metric ySec framework. Category-1 (strictest tier) |

**Score: 1.5 / 5** — Strong V3 audit coverage and underlying-protocol coverage, ~25 months of clean production for the older vaults, no incidents. yvWBTC-1's young age and no-deployed posture argues mildly upward; the yvUSDT-1/yvWBTC-1 idle posture also tempers a perfect score.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | All 6 vaults are immutable Vyper minimal proxies |
| Multisig | Daddy 6/9 (named signers), Brain 3/8, Security 4/7 |
| Timelock | 7-day delay on `ADD_STRATEGY_MANAGER` and `ACCOUNTANT_MANAGER`. Self-governed |
| Privileged roles | Well-distributed; no role concentration on a single party |
| EOA risk | None — no EOA holds direct vault roles |

**Score: 1.0 / 5** — immutable + 7-day self-governed timelock on the critical actions + 6/9 named signers + no EOA roles = textbook score-1 governance per the rubric.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | ERC-4626, fully algorithmic |
| Operations | Permissionless deposit/withdraw |
| Reporting | Automated via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |

**Score: 1.0 / 5** — fully programmatic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (funded) | yvUSDC-1 / yvUSDS-1 / yvDAI-1: effectively 1 ecosystem (Sky/Spark) due to vault-of-vaults concentration. yvWETH-1: Lido. yvUSDT-1 / yvWBTC-1: none funded today (queues are USDT- and WBTC-native respectively, not Sky/USDS-routed) |
| Criticality | Sky concentration is critical for yvUSDC-1 / yvUSDS-1 / yvDAI-1 (~$42M net unique stable capital ultimately at sUSDS + USDS Staking SPK farm). Lido critical for yvWETH-1 deployed funds. yvUSDT-1 is excluded — its queued strategies are USDT-native and do not touch the Sky/USDS stack |
| Quality | Top-tier across the board (Sky $10M bounty, Lido $20B+ TVL) |

**Score: 2.5 / 5** — the ecosystem quality is excellent (would be 1.5–2 on quality alone), but the **concentration** across stable vaults into a single ecosystem (Sky) bumps this to 2.5. If yvUSDT-1 deployed into Morpho/Aave, this would diversify; today it does not.

**Centralization composite = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Category Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain in nominal asset; deployed to Sky / Lido today |
| Collateral quality | sUSDS RWA-backed; Lido multi-operator; Aave/Morpho USDC markets blue-chip |
| Leverage | None |
| Verifiability | Fully on-chain |

**Score: 1.0 / 5** — top-tier.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain ERC-4626 across all layers |
| Exchange rate | Programmatic, real-time |
| Reporting | Keeper-driven, profit unlock 3–10 days |
| Vault-of-vaults | Slightly increases the surface area to verify (need to read multiple vaults' totalAssets), but each layer is on-chain |

**Score: 1.0 / 5** — excellent on-chain provability.

**Funds Management composite = (1.0 + 1.0) / 2 = 1.0**

**Category Score: 1.0 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Stable vaults | Highly liquid via Sky/sUSDS/PSM; vault-of-vaults adds atomic but multi-step withdrawals |
| yvWETH-1 | Material withdrawals depend on stETH liquidity (Curve) or Lido queue — peg risk under stress |
| yvUSDT-1, yvWBTC-1 | 100% idle — trivially liquid today |
| Same-asset | All vaults; no price-divergence risk on the share token |
| Withdrawal restrictions | None (no cooldown, no module) |

**Score: 1.5 / 5** — stables and idle vaults are excellent. yvWETH-1's stETH dependence and the cascading withdrawal chain on stables both nudge above a perfect 1.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established, public, 5+ years |
| Vault management | Standard pattern, 37+ vaults using same Role Manager |
| Documentation | Comprehensive, code verified |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events handled, $200K Immunefi |
| Monitoring | Active hourly alerts via monitoring-scripts repo |

**Score: 1.0 / 5** — top-tier operational maturity.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.30 |
| Centralization & Control | 1.5 | 30% | 0.45 |
| Funds Management | 1.0 | 30% | 0.30 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.05 |
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

This score applies uniformly to all six vaults: yvUSDC-1, yvUSDS-1, yvWETH-1, yvDAI-1, yvUSDT-1, yvWBTC-1.

---

## Reassessment Triggers

- **Time-based:** reassess in 6 months (October 2026) or annually
- **TVL-based:** reassess if any individual vault TVL exceeds $100M or changes by ±50%, or if combined TVL exceeds $250M
- **Strategy posture:**
  - if yvUSDT-1 or yvWBTC-1 begin actively deploying to a new strategy, re-evaluate liquidity and dependency scores
  - if yvWETH-1 stETH Accumulator scales beyond 50% of vault TVL, deeper review of stETH unwind path
  - if the stable vaults diversify away from the Sky-dominant chain (e.g., funding Morpho or Aave strategies), revise the dependency subscore downward
- **Vault-of-vaults composition:**
  - reassess if a new strategy is added that creates a third layer of nested vaults
- **yvWBTC-1 deposit limit:** the current `deposit_limit = 100,000 WBTC` (≈ $7.7B) is materially above any plausible near-term TVL. **Action item:** before yvWBTC-1 re-deploys debt to a strategy, either tighten the cap (e.g. to a multiple of intended TVL) or document the rationale with the Yearn team and revisit this report.
- **rsETH-related deallocation:**
  - **rerun this assessment once Yearn re-deploys funds back into yvUSDT-1, yvWBTC-1, and the idle portion of yvWETH-1.** The current strategy mix and dependency profile do not reflect steady-state operation while these vaults are sitting idle.
  - if any new strategy is added that takes direct or indirect rsETH exposure, re-evaluate the dependency subscore
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Sky/MakerDAO, Lido, Spark, Aave, or Morpho
- **Sky-specific:**
  - SSR drops below 2% (may indicate Sky-side stress)
  - PSM `tin`/`tout` set above 0.05% (activates Uniswap V3 fallback)
  - SPK reward rate changes materially
- **Governance-based:** any change to ySafe / Brain / Security signers or thresholds, any change to the timelock delay (would itself require 7 days), or any change to Role Manager pointers
- **New vault:** if a new category-1 vault is added to the Role Manager (`numVaults()` increases), update this report to include it

---

## Appendix A: Architecture & Fund Flow (current snapshot)

```
                          ┌───────────────────────────────────────────────┐
                          │        ROLE MANAGER (single instance)          │
                          │  0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41    │
                          │  Manages 6 category-1 vaults below             │
                          │                                                │
                          │  Daddy (6/9)  Brain (3/8)   Security (4/7)     │
                          │       │           │              │             │
                          │       └─── Strategy Mgr (Timelock 7d)          │
                          │             0x88Ba032b…F367BF73                │
                          │       │                                        │
                          │       └── Keeper (yHaaSRelayer)                │
                          │       └── Debt Allocator                       │
                          │       └── Accountant (10% perf, 0% mgmt)       │
                          └───────────────────────────────────────────────┘
                                              │
   ┌──────────────────────────────────────────┼──────────────────────────────────┐
   │                                          │                                  │
┌──▼──────────────┐  ┌──────────────────┐  ┌──▼─────────┐  ┌─────────────┐  ┌────▼────────┐
│   yvUSDC-1      │  │   yvUSDT-1       │  │  yvWETH-1  │  │   yvWBTC-1  │  │  yvDAI-1    │
│   28.31M USDC   │  │   7.12M USDT     │  │   4078 WETH│  │   47.5 WBTC │  │  8.57M DAI  │
│   100% deployed │  │   0% deployed    │  │   33% dep. │  │   0% dep.   │  │ 100% dep.   │
└────────┬────────┘  │   (5 queued)     │  └──┬─────────┘  │  (1 queued) │  └──┬──────────┘
         │           └──────────────────┘     │            └─────────────┘     │
         │ 100%                               │ 33% TVL                        │ 72.5%   27.5%
         │                                    ▼                                │   │
         │                              ┌──────────────┐                       │   │
         │                              │  stETH       │                       │   │
         │                              │  Accumulator │                       │   │
         │                              │  → Lido      │                       │   │
         │                              │  ($20B+ TVL) │                       │   │
         │                              └──────────────┘                       │   │
         │                                                                     │   │
         │              ┌──────────────────────────────────────────────────────┘   │
         │              │ via DAI to USDC-1 Depositor                              │
         │              ▼                                                          │
         │     (back into yvUSDC-1)                                                │
         │              │                                                          │
         └──────────────┼──────────────────────────────────────────────────────────┤
                        │ via USDC to USDS Depositor / DAI to USDS Depositor       │
                        ▼                                                          │
                ┌────────────────────┐                                             │
                │     yvUSDS-1       │ ◀───────────────────────────────────────────┘
                │    35.24M USDS     │
                │    100% deployed   │
                └─────────┬──────────┘
                          │
                          ├── 92.6% ──► Spark USDS Compounder
                          │             → Sky USDS Staking Rewards
                          │             → Earns SPK token (sells back to USDS)
                          │
                          ├──  7.4% ──► sUSDS Lender
                          │             → Sky Savings (sUSDS, $5.38B TVL)
                          │             → SSR
                          │
                          └── <0.01% ─► Aave V3 Lido USDS Lender (dust)
```

**Net effect today:** of yvUSDS-1's ~$35.24M USDS, ~$33.5M (92.6% Spark Compounder + 7.4% sUSDS Lender) sits in the Sky stack — and yvUSDS-1 is the terminal layer for yvUSDC-1's deployed funds and the bulk of yvDAI-1's deployed funds. After de-duplicating the cross-counted depositor strategies, this corresponds to roughly **~$42M of net unique stable capital ultimately at Sky**. yvWETH-1's deployed portion is in Lido. **yvUSDT-1 and yvWBTC-1 are 100% idle on-chain, do not route to Sky, and are excluded from the concentration figure above.**

## Appendix B: TimelockController Role Structure

The Strategy Manager [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) is shared across yvUSDC-1, yvUSDS-1, yvWETH-1, yvDAI-1, yvUSDT-1, yvWBTC-1, and the broader Yearn V3 vault set. `getMinDelay() = 604800` (7 days).

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)` at construction). Roles cannot be granted/revoked outside the propose→wait→execute flow |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed. Config changes (delay, role grants) must go through 7-day delay |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | **Sole proposer** |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper: Brain (3/8) and a deployer EOA can call `execute()` through it |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-8 Safe | Cancel pending proposals |

### Why the 7-day delay cannot be bypassed

To shorten the delay, an attacker must (1) control Daddy 6/9 to **propose** `updateDelay()` — only Daddy can propose; (2) wait 7 days, during which Brain or Daddy can cancel; (3) execute. DEFAULT_ADMIN was never granted, so no party can self-grant PROPOSER or TIMELOCK_ADMIN to skip the flow.

## Appendix C: Useful Onchain Lookups

```bash
# Per-vault basics
cast call <vault> "name()(string)"          --rpc-url $RPC_1
cast call <vault> "asset()(address)"        --rpc-url $RPC_1
cast call <vault> "apiVersion()(string)"    --rpc-url $RPC_1
cast call <vault> "totalAssets()(uint256)"  --rpc-url $RPC_1
cast call <vault> "totalDebt()(uint256)"    --rpc-url $RPC_1
cast call <vault> "totalIdle()(uint256)"    --rpc-url $RPC_1
cast call <vault> "deposit_limit()(uint256)" --rpc-url $RPC_1
cast call <vault> "convertToAssets(uint256)(uint256)" <1share> --rpc-url $RPC_1
cast call <vault> "get_default_queue()(address[])" --rpc-url $RPC_1
cast call <vault> "strategies(address)((uint256,uint256,uint256,uint256))" <strategy> --rpc-url $RPC_1
# (returns: activation, last_report, current_debt, max_debt)

# Role Manager
cast call 0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41 "isVaultsRoleManager(address)(bool)" <vault> --rpc-url $RPC_1
cast call 0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41 "getCategory(address)(uint256)" <vault> --rpc-url $RPC_1
cast call 0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41 "getDebtAllocator(address)(address)" <vault> --rpc-url $RPC_1

# Timelock
cast call 0x88Ba032be87d5EF1fbE87336b7090767F367BF73 "getMinDelay()(uint256)" --rpc-url $RPC_1

# Per-vault role bitmap
cast call <vault> "roles(address)(uint256)" <holder> --rpc-url $RPC_1
```
