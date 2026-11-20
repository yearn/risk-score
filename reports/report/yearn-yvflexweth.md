# Protocol Risk Assessment: Yearn — yvFlexWETH

- **Assessment Date:** November 10, 2026
- **Token:** yvFlexWETH (Flex WETH yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F`](https://etherscan.io/address/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F)
- **Snapshot:** Onchain reads at Ethereum block [26382003](https://etherscan.io/block/26382003) (November 10, 2026, 04:05 UTC); USD values use the Chainlink ETH/USD feed ([`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)) at $2,112.41 at the same block.
- **Final Score: 2.70/5.0**

## Overview + Links

yvFlexWETH is a **WETH-denominated Yearn V3 vault** (ERC-4626, v3.1.0) that lends WETH into a single [Flex](./flex.md) market: **yvWETH-2 collateral / WETH borrow**. Flex is a fixed-rate, Liquity-V2-style CDP lending protocol. Its lenders earn borrower interest and **absorb bad debt** when a borrower's collateral cannot cover its debt. The vault is listed on Flex's own interface ([lend page](https://flexmeow.com/lend/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F/deposit)), and Kong indexes it as a Yearn V3 vault.

The vault holds **310.31 WETH (~$655,500)**, all of it in one strategy that deposits into the Flex yvWETH-2/WETH **Lender** (`ysWETH`). Borrowers in that market post **yvWETH-2** — a Yearn V3 WETH vault that runs leveraged Spark/Lido strategies and lends borrowed USDS into [yvUSD](./yearn-yvusd.md). **yvWETH-2 has no report in this repository**, so this report assesses it as the collateral dependency it is. Flex itself is assessed in the [Flex report](./flex.md); this report does not re-derive Flex's protocol facts.

**Who holds the risk.** 96.8% of the vault's shares belong to the **Yearn yETH Recovery Vault** ([`0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6`](https://etherscan.io/address/0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6)), a Yearn V3 vault funded to repay victims of the yETH incident. Its shares are held:
- 34.1% by the `yETHRecoveryVault` claim wrapper ([`0xE5387cd454Dcc542421c069C009D915Ab9EFaaFd`](https://etherscan.io/address/0xE5387cd454Dcc542421c069C009D915Ab9EFaaFd)), into which only a designated claimer contract can deposit on behalf of yETH holders;
- 33.3% by the Yearn Treasury;
- 32.5% by yChad.

The wrapper is also the Recovery Vault's accountant. It takes 100% of the vault's profit as fees until its own share price reaches the immutable `TARGET_PPS` of 3.12883 (1.07327 at the snapshot), so the Treasury and yChad contribute their yield to the recovery. Losses are not covered this way: a loss on yvFlexWETH would reduce the Recovery Vault's assets pro rata, and **about a third of it would fall on yETH claimants**.

**Key architecture:**

- **Vault:** Yearn V3 vault (v3.1.0), deployed September 16, 2026 ([tx](https://etherscan.io/tx/0xdf4d1628558780fe6f50c8cfd51899604e841503a67001aaa14e3941b03f60d4)) through the [Yearn v3.1.0 Vault Factory](https://etherscan.io/address/0x310aC28ACF5E514abDbFF9Ab25e21f1bfe22bcAC) by the Flex deployer EOA ([`0x000005281a2b04A182085D37cC9E6dD552795caa`](https://etherscan.io/address/0x000005281a2b04A182085D37cC9E6dD552795caa)), which holds no vault role (`roles() = 0`).
- **Governance:** standard [Yearn V3 `RoleManager`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) since September 25, 2026 ([tx](https://etherscan.io/tx/0x27144919a3b6fc636c9dc0ed2369b82f9cf03c949018ca51979d30010232d788)). Role holders and bitmasks are identical to [yvWETH-1](./yearn-yvweth.md).
- **Flex strategy:** one `FlexLenderStrategy` ([`0x7E4a6A89583e117C641aB3ce8897209800A3F2E3`](https://etherscan.io/address/0x7E4a6A89583e117C641aB3ce8897209800A3F2E3)) holding 99.98% of the Lender. Yearn's Strategist MultiSig is `management` and Yearn Security is `emergencyAdmin`.
- **Exit:** nothing is withdrawable through a standard redemption at the snapshot. Holders exit through the [`FlexExitRouter`](https://etherscan.io/address/0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD), which pays them asynchronously from Flex redemption auctions of yvWETH-2 (see *Liquidity Risk*).

**Key metrics (November 10, 2026, block 26382003):**

- **TVL:** 310.3083 WETH (~$655,500), fully deployed (`totalIdle = 0`)
- **Total supply:** 310.0273 yvFlexWETH
- **Price per share:** 1.000906 WETH (1.000000 at first funding on September 18, 2026)
- **Net yield:** ~1.1% annualized since the vault reached its current size (1.000127 on October 16 → 1.000906 on November 10). Borrowers pay a debt-weighted 1.92% fixed rate; Flex's 10% Lender fee and Yearn's 10% vault fee come out of that.
- **Deposit limit:** effectively uncapped at the vault (`1e29`); the Flex Lender caps itself at 10,000 WETH; the strategy's `max_debt` is 10,000 WETH
- **Profit max unlock time:** 4 days
- **Fees:** 0% management, 10% performance (Yearn [Accountant](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) default config), plus the Flex Lender's 10% performance fee paid to Flex's governance contract
- **Holders:** the yETH Recovery Vault (299.97 shares, 96.76%); a 2-of-7 Safe ([`0xe07d9C9cF00F9d6a4fD595A31cbb7BC0953a41A0`](https://etherscan.io/address/0xe07d9C9cF00F9d6a4fD595A31cbb7BC0953a41A0), 10.00 shares, 3.23%); fee shares and dust

**Links:**

- [Flex lend page](https://flexmeow.com/lend/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F/deposit)
- [Flex risk report](./flex.md) · [Flex documentation](https://flexmeow.com/docs) · [Flex allocator repository](https://github.com/flexmeow/flex-allocator)
- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [DeFiLlama: Flex](https://defillama.com/protocol/flex)
- [yvWETH-1 report](./yearn-yvweth.md) · [yvUSD report](./yearn-yvusd.md)

## Contract Addresses

### Core Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvFlexWETH Vault | [`0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F`](https://etherscan.io/address/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F) | Yearn V3 Vault (v3.1.0) |
| Vault Factory (v3.1.0) | [`0x310aC28ACF5E514abDbFF9Ab25e21f1bfe22bcAC`](https://etherscan.io/address/0x310aC28ACF5E514abDbFF9Ab25e21f1bfe22bcAC) | Yearn v3.1.0 Vault Factory |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Yearn Accountant (0% management, 10% performance) |
| FlexLenderStrategy — yvWETH-2 | [`0x7E4a6A89583e117C641aB3ce8897209800A3F2E3`](https://etherscan.io/address/0x7E4a6A89583e117C641aB3ce8897209800A3F2E3) | TokenizedStrategy v3.0.4 |
| Flex Lender `ysWETH` | [`0x0d57098e501D68905fC4B0A3397f7D4Aa4889E36`](https://etherscan.io/address/0x0d57098e501D68905fC4B0A3397f7D4Aa4889E36) | Flex Lender (Yearn TokenizedStrategy) |
| Flex TroveManager — yvWETH-2/WETH | [`0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C`](https://etherscan.io/address/0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C) | EIP-1167 clone, Factory v1.1.0 |
| Flex Price Oracle — yvWETH-2/WETH | [`0x4E2cAD94B2139f03C65B5677A84C2aeAC259B96C`](https://etherscan.io/address/0x4E2cAD94B2139f03C65B5677A84C2aeAC259B96C) | `morpho_oracle.vy` over a feedless [`MorphoChainlinkOracleV2`](https://etherscan.io/address/0xcDf094B6Ba4a90A9d6c06F2b8D00D2a74920Cb52) |
| FlexExitRouter | [`0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD`](https://etherscan.io/address/0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD) | Exit path for the Flex leg |

### Governance Contracts

Vault role bitmasks read with `roles(address)` at the snapshot block; identical on yvWETH-2.

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | `role_manager`; category 420 |
| Daddy / ySafe | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Safe — all roles except ADD_STRATEGY and ACCOUNTANT (`16374`) |
| Brain | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-6 Safe — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY (`14706`); `management` on the strategy |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Safe — DEBT, MAX_DEBT, EMERGENCY (`8384`); `emergencyAdmin` on the strategy |
| Strategy Manager (Timelock) | [`0x88ba032be87d5eF1FbE87336B7090767F367BF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336B7090767F367BF73) | 7-day TimelockController — ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (`143`) |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaS — REPORTING (`32`) |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | REPORTING + DEBT_MANAGER (`96`) |

### Strategies

| # | Strategy | Name | Current Debt (WETH) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0) | yvWETH-1 | 1 wei | 0% |
| 2 | [`0x7E4a6A89583e117C641aB3ce8897209800A3F2E3`](https://etherscan.io/address/0x7E4a6A89583e117C641aB3ce8897209800A3F2E3) | Flex yvWETH-2/WETH Lender | 310.3083 | 100.0% |

Both strategies were added on September 18, 2026 and sit in the default queue (`use_default_queue() = false`, so a withdrawer may pass its own order). New deposits are routed through yvWETH-1 before the debt allocator moves them to Flex; the two resulting 1–2 wei rounding losses in October are the only losses the vault has recorded across its 24 strategy reports.

## Audits and Due Diligence Disclosures

- **Yearn V3:** the vault and TokenizedStrategy framework are covered by Yearn's V3 audits (ChainSecurity, yAcademy, Statemind; see [yvUSDC-1](./yearn-yvusdc.md#yearn-v3-core-audits)). The vault runs v3.1.0, a later release than the v3.0.2 audited by Statemind.
- **Flex:** six published reviews, including two Dedaub audits; the August 2026 Dedaub review of the deployed v1.1 code found no Critical, High, Medium or Low issues ([Flex report](./flex.md#audits-and-due-diligence-disclosures)). The `FlexLenderStrategy` and the yvWETH-2 market's `morpho_oracle.vy` wrapper are in the reviewed code.
- **yvWETH-2 strategies:** Yearn V3 strategies (Spark lender-borrower, LST Aave looper, Lido accumulator) under Yearn's internal review process. No strategy-specific external audit is published in [yearn-security](https://github.com/yearn/yearn-security/tree/master/audits).
- **Bug bounty:** Yearn's [Immunefi program](https://immunefi.com/bug-bounty/yearnfinance/scope/) ($200K max) lists the v3.0.4 Vault Factory and TokenizedStrategy among its assets; the v3.1.0 factory that deployed this vault, the Flex strategy and Flex's contracts were not among the listed assets checked. Flex has no bug bounty.

## Historical Track Record

- **Vault deployed:** September 16, 2026 (block 25990897); first funded September 18 (10 WETH from the 2-of-7 Safe). The Recovery Vault deposited 100.00 WETH on October 6, 88.63 WETH on October 12 and 111.35 WETH on October 16 — **~8 weeks** in production and **~3.5 weeks** at its current size.
- **Flex market:** deployed September 16 and endorsed September 17, 2026 ([tx](https://etherscan.io/tx/0xfb37c1c926d7527c79f9c0549d6d9394ffefc68f02ac3a7b76ecb813bcdc99ff)). Since launch it has emitted 25 `RedeemTrove` and 12 `CloseZombieTrove` events and **no `LiquidateTrove` or `BadDebt` event**. Neither the Lender (13 reports) nor the strategy (18 reports) has reported a loss.
- **yvWETH-2:** deployed March 15, 2024 through Yearn's v3.0.2 factory. None of its 392 strategy reports since inception carried a loss above 1e-6 WETH. Its assets grew from 638.9 WETH on August 12 to 1,267.9 WETH on October 11 and **3,985.1 WETH** at the snapshot.
- **Security incidents:** none for this vault, the Flex market, or yvWETH-2.

## Funds Management

### Strategy: Flex yvWETH-2/WETH Lender (100%)

The `FlexLenderStrategy` deposits WETH into the `ysWETH` Lender and reports `idle + Lender shares × Lender PPS` (Lender PPS 1.001297). The Lender lends to 8 Troves; because the strategy holds 99.98% of the Lender, **this vault is the market's entire lender side**.

| Metric | Value |
|---|---|
| Interest-accrued debt (`get_trove_debt_after_interest`) | **310.5265 WETH** across 8 Troves |
| Pledged collateral | 318.9475 yvWETH-2 at **1.092440 WETH/share** (oracle = yvWETH-2 `convertToAssets`) → **348.4309 WETH** (~$736,000) |
| Backing CR | **112.21%** against a 110% MCR |
| Trove CR range | 110.15% – 114.78% |
| Debt below 110.5% CR | 27.2% (three Troves at 110.15–110.20%) |
| Debt below 112% CR | 60.7% |
| Largest Trove | 34.4% of debt (106.83 WETH at 114.78%) |
| Debt-weighted borrow rate | 1.92% (range 1.70–2.60%) |
| First-loss reserve (`unclaimed_protocol_fees`) | 0.0631 WETH |
| Unpledged residue | none (`collateral_balance` equals pledged collateral) |

**Same-party lending and borrowing.** The 2-of-7 Safe that holds 3.2% of yvFlexWETH also borrows 53.92 WETH (17.4% of market debt) at 110.18% CR. The arrangement is visible onchain; whose Safe it is is not publicly attributed.

**What a lender loss requires.** Collateral and debt are both WETH-denominated, so ordinary ETH price moves do not change Trove CRs; only the yvWETH-2 share price does. Liquidation at the 110% MCR leaves ~10% of collateral above debt, with a liquidation fee of 0.5–5%. The vault loses principal only if yvWETH-2's PPS falls faster than liquidation and auction can clear — roughly a 10% drop for the lowest Troves, less if auctions clear below the 99% floor price.

### Collateral: yvWETH-2

yvWETH-2 ([`0xAc37729B76db6438CE62042AE1270ee574CA7571`](https://etherscan.io/address/0xAc37729B76db6438CE62042AE1270ee574CA7571)) is a Yearn V3 vault (v3.0.2) under the same `RoleManager` and role bitmasks as this vault (category 2). It holds **3,985.10 WETH**, fully deployed, with a 10,000 WETH deposit limit and a 10-day profit unlock. Its debt:

| Strategy | Debt (WETH) | Share | What it does | Withdrawable now |
|---|---:|---:|---|---:|
| [Spark wstETH to yvUSD Lender Borrower Accumulator](https://etherscan.io/address/0x13f6Cb609959a43c3bE29407766A683b42e26D28) | 2,503.64 | 62.8% | Stakes WETH to wstETH and deposits it into the [Spark wstETH/USDS (yvUSD) Lender Borrower](https://etherscan.io/address/0x41cfE42D221a591C6308Dcea419015Ba8570B380): 2,006.66 wstETH collateral on Spark, 3.137M USDS borrowed and lent into yvUSD through the [USDS→USD convertor](https://etherscan.io/address/0x7a716dA432531c0DCeC0F4915d877631AA258fa3). LTV 59.36% vs an 84% liquidation threshold (target 70% of it, warning 80%) | **0** |
| [wstETH/WETH Spark Looper](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | 1,041.98 | 26.1% | 6,633.69 wstETH collateral against 7,240.92 WETH debt on Spark: **7.94x leverage** (target 8.0x, max 8.5x), LTV 87.41% vs a 93% liquidation threshold | 1,043.38, but **not in the default queue** (`use_default_queue = true`) |
| [Spark WETH/USDS (yvUSD) Lender Borrower](https://etherscan.io/address/0x5E8A9Acd00AdCED69b30D36929CbF7D4d4F9AE1F) | 439.48 | 11.0% | 439.97 WETH collateral, 563,896 USDS borrowed and lent into yvUSD. LTV 60.77% vs an 86% liquidation threshold | 439.97 |
| yvWETH-1 | 1 wei | 0% | — | — |

**Consequences for this vault:**

- **The collateral is leveraged ETH yield, not plain WETH.** ~74% of yvWETH-2 borrows USDS against wstETH or WETH and lends it to yvUSD. A loss in yvUSD reduces yvWETH-2's PPS: a 10% yvUSD loss on the 3.70M USDS lent would cost ~175 WETH, **~4.4% of yvWETH-2**. The looper adds wstETH/WETH exposure at 7.94x: a ~6% fall in Spark's wstETH/WETH valuation would reach its liquidation threshold.
- **ETH price moves matter indirectly.** The two lender-borrowers hold USD debt against ETH collateral; a ~29% ETH fall from the snapshot would take both to their liquidation thresholds unless the keeper deleverages first.
- **yvWETH-2 shares are concentrated.** Holders: a `mixWETH` ("WETH Mix Yield Token") vault's adapter ([`0x8c8BA78A8be6047A71a183d6680fAf32FF9e0209`](https://etherscan.io/address/0x8c8BA78A8be6047A71a183d6680fAf32FF9e0209), 61.2%), the yETH Recovery Vault directly (12.3%), this Flex market (8.7%), the yGauge (6.0%), and 137 others.
- **yETH Recovery Vault correlation.** The Recovery Vault holds 490.47 WETH of yvWETH-2 directly *and* 300.24 WETH of yvFlexWETH, which is collateralized by yvWETH-2. A yvWETH-2 impairment hits it twice.

### Accessibility

- **Deposits:** permissionless ERC-4626 deposit of WETH. Deposits land in yvWETH-1 until the debt allocator or Brain moves them to Flex.
- **Withdrawals:** permissionless ERC-4626 `withdraw`/`redeem`, but `maxWithdraw` is **0** at the snapshot: the Lender holds no idle WETH and yvWETH-1 holds 1 wei. All exits go through the `FlexExitRouter`.
- **Fees:** 0% management, 10% performance at the vault, on top of the Flex Lender's 10%.

### Token Mint Authority

**Mint mechanism:** permissionless ERC-4626 `deposit`/`mint`; Yearn V3 vault shares have no privileged minter.

**Mint requires backing:** yes — atomic `transferFrom` before `_mint`. Performance-fee shares are minted to the accountant only against reported profit.

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any caller of `deposit()` / `mint()` | ✓ | ✓ | Permissionless ERC-4626 | Subject to `deposit_limit` (DEPOSIT_LIMIT_MANAGER: Daddy / Brain) |

**Rate limits / supply caps:** none at the vault (`deposit_limit = 1e29`); the Lender's 10,000 WETH limit and the strategy's 10,000 WETH `max_debt` bound deployment.

### Collateralization

- **Over-collateralized, onchain, single-asset.** 112.21% backing in yvWETH-2, a yield-bearing WETH vault, against WETH debt. Running near the 110% MCR is the intended looping design for alike assets.
- **Collateral quality is the weak point.** yvWETH-2 is itself leveraged (Spark lender-borrowers into yvUSD, a 7.94x looper), unassessed in this repository, and only ~11% liquid through its standard queue.
- **Small buffer.** 27.2% of debt is within 0.5% of liquidation; the protocol fee reserve is 0.063 WETH.

### Provability

- **Vault and Lender PPS:** onchain ERC-4626; Lender PPS is cached at each Flex keeper report and unlocks profit over 4 days.
- **Market backing:** recomputable from the TroveManager (`sync_total_debt()`, `troves(id)`) and the oracle.
- **yvWETH-2 PPS:** onchain, from its strategies' `totalAssets()`. The accumulator values its lender-borrower shares through `valueOfWstETH()`, and the lender-borrowers value Spark positions through Spark's oracle — onchain but model-dependent.

## Liquidity Risk

- **Standard redemption: 0 WETH.** `maxWithdraw` for the Recovery Vault returns 0 at the snapshot. The yearn.fi interface's withdraw paths (direct ERC-4626, Enso zap, and two vault-specific zappers in [`yearn/yearn.fi`](https://github.com/yearn/yearn.fi) `main` at [`1e0f1b7`](https://github.com/yearn/yearn.fi/commit/1e0f1b7)) call the vault directly and do not use the router. Flex's own [lend page](https://flexmeow.com/lend/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F/withdraw) does not either: for allocator vaults it calls `withdraw(amount, user, user, maxLoss = 0)` on the vault and caps the amount at `maxWithdraw` (page source read November 10, 2026). **Neither interface can withdraw anything from this vault today**; the router exit is reachable only by calling the contract directly.
- **Router exit: asynchronous.** `FlexExitRouter.redeem()` sets the exiting holder as the strategy's proceeds receiver. The Lender then redeems the lowest-rate Troves and sells their yvWETH-2 in one-day Dutch auctions starting at 100% of oracle value and floored at 99%; proceeds go to the holder as auctions are taken. The vault books the not-yet-delivered portion as a loss on that withdrawal only, so the caller must pass a high `maxLoss`, and the exiting holder bears execution.
- **Auction takers depend on yvWETH-2 liquidity.** A taker clears near par by redeeming yvWETH-2 for WETH. yvWETH-2's standard queue can pay out ~440 WETH (the WETH/USDS lender-borrower). That covers the market's 348.43 WETH of collateral today, but it is shared with yvWETH-2's other holders, and the accumulator (62.8%) returns a withdraw limit of 0. The looper's 1,043 WETH sits outside the default queue.
- **Large holder impact.** The Recovery Vault holds 96.8% of shares and the vault is the market's only lender, so a full exit means auctioning essentially all of the market's yvWETH-2 collateral.
- **Same-value asset:** WETH in, WETH out; the auctioned collateral is WETH-denominated.

## Centralization & Control Risks

### Governance

The vault uses the **standard Yearn V3 governance pattern**: immutable vault, Yearn `RoleManager`, 7-day timelock on adding strategies and changing the accountant (Daddy, 6-of-9, is the sole proposer), and no EOA roles — the same setup as yvWETH-1. Brain (3-of-6) and the debt allocator can move debt between the two approved strategies without a timelock.

**Flex governance is outside this layer.** Flex's `Daddy` contract is the Lender's `management` and performance-fee recipient and can change its fee, keeper, deposit limit and shutdown, with no timelock; per the Flex team the developer holds two of the three signatures its 3-of-5 Safe requires ([Flex report](./flex.md#governance)). No Yearn role can override it. It cannot seize Lender assets or borrower collateral. The yvWETH-2 market's oracle has no admin switch.

### Programmability

- Vault PPS, deposits and withdrawals are onchain and programmatic; reports are keeper-driven.
- A pending Flex redemption auction blocks the strategy's report until it settles.
- yvWETH-2's lender-borrowers and looper rely on Yearn keepers to tend LTV and leverage.

### External Dependencies

| Dependency | Criticality | Notes |
|---|---|---|
| **Flex — yvWETH-2/WETH market** | Critical | 100% of debt in one isolated market of a ~6-month-old protocol with untimelocked, effectively two-party governance and no bug bounty. [Flex report](./flex.md) |
| **yvWETH-2** | Critical | Sole collateral and sole price input (feedless Morpho oracle on its `convertToAssets`). Leveraged, partly illiquid, unassessed |
| **yvUSD** | High | ~74% of yvWETH-2 lends borrowed USDS into it. [yvUSD report](./yearn-yvusd.md) |
| **Spark / Lido wstETH** | High | Venue for all three yvWETH-2 strategies; wstETH collateral |
| **Yearn V3 framework** | High | Vault, strategy and yvWETH-2 inherit Yearn's audited V3 contracts |

## Operational Risk

- **Vault operator:** Yearn — established team, named Daddy signers, BORG legal wrapper.
- **Underlying operator:** Flex's team is pseudonymous with no legal entity; its risks page denies the admin powers its governance contract holds.
- **Documentation:** neither Yearn nor Flex documents or exposes the router exit for this vault; yvWETH-2's strategy mix is not documented outside onchain state.
- **Monitoring:** generic Yearn vault-flow and timelock monitors apply; [`yearn/monitoring-scripts-py`](https://github.com/yearn/monitoring-scripts-py) has no Flex-specific monitor. Flex runs an open-source [`monitoring-bot`](https://github.com/flexmeow/monitoring-bot) (last commit [`30eedda`](https://github.com/flexmeow/monitoring-bot/commit/30eedda), which added this vault) that posts Telegram notifications for Trove, redemption, liquidation, auction, registry and allocator-vault events. It has no `BadDebt` subscription and no CR or PPS thresholds. Flex also publishes [liquidator](https://github.com/flexmeow/liquidator-bot) and [Dutch-auction taker](https://github.com/flexmeow/dutch-taker-bot) bots.

## Monitoring

Existing coverage: Yearn's generic Large Flows and timelock monitors (the vault is Kong-indexed) and Flex's Telegram event feed (see *Operational Risk*). Nothing alerts on yvWETH-2 PPS, market CR, or bad debt; the items below are recommendations.

### Key Contracts

| Contract | Address | Monitor |
|---|---|---|
| yvFlexWETH Vault | [`0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F`](https://etherscan.io/address/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F) | `pricePerShare()`, `totalAssets()`, `strategies(address)`, `StrategyReported` with loss, `StrategyChanged`, `Shutdown` |
| FlexLenderStrategy | [`0x7E4a6A89583e117C641aB3ce8897209800A3F2E3`](https://etherscan.io/address/0x7E4a6A89583e117C641aB3ce8897209800A3F2E3) | `totalAssets()`, `pendingAuctionId()`, report freshness |
| Flex Lender `ysWETH` | [`0x0d57098e501D68905fC4B0A3397f7D4Aa4889E36`](https://etherscan.io/address/0x0d57098e501D68905fC4B0A3397f7D4Aa4889E36) | `pricePerShare()`, `Reported` with `loss > 0`, `performanceFee()`, `isShutdown()` |
| Flex TroveManager | [`0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C`](https://etherscan.io/address/0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C) | `sync_total_debt()`, Trove CRs, `BadDebt`, `LiquidateTrove`, `unclaimed_protocol_fees()` |
| yvWETH-2 | [`0xAc37729B76db6438CE62042AE1270ee574CA7571`](https://etherscan.io/address/0xAc37729B76db6438CE62042AE1270ee574CA7571) | `pricePerShare()` (any decrease), strategy losses, standard withdrawable amount |
| yvWETH-2 lender-borrowers / looper | [`0x41cfE42D221a591C6308Dcea419015Ba8570B380`](https://etherscan.io/address/0x41cfE42D221a591C6308Dcea419015Ba8570B380), [`0x5E8A9Acd00AdCED69b30D36929CbF7D4d4F9AE1F`](https://etherscan.io/address/0x5E8A9Acd00AdCED69b30D36929CbF7D4d4F9AE1F), [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | `getCurrentLTV()` vs liquidation factor; looper `getCurrentLeverageRatio()` |
| Flex governance Safe | [`0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67) | any execution; signer/threshold changes |

### Critical Events & Thresholds

- **Any yvWETH-2 PPS decrease** — immediate; it is this market's only price input.
- **Market backing CR** below 111%, any `BadDebt`, any Trove below 105% CR unliquidated for over an hour, or a Lender `Reported` loss — page.
- **yvWETH-2 leverage:** lender-borrower LTV above 80% of its liquidation factor (the strategies' warning level), or looper leverage above 8.5x.
- **yvWETH-2 liquidity:** standard withdrawable amount below the market's pledged collateral value.
- **Flex governance:** Lender fee, keeper, deposit limit or shutdown change.
- **Holder movement:** any Recovery Vault debt change on this vault; any router exit.

## Risk Summary

### Key Strengths

- **Standard Yearn governance** at the vault: immutable, RoleManager, 7-day timelock on strategy additions, no EOA roles.
- **Over-collateralized, alike-asset lending:** WETH lent against a WETH vault share at 112.21%, with no oracle admin switch.
- **Clean record so far:** no liquidation, bad debt or Lender loss in the market; no material loss in 392 yvWETH-2 reports.

### Key Risks

- **Single market, single collateral:** 100% of the vault depends on one Flex market whose only collateral is yvWETH-2.
- **Leveraged, unassessed collateral:** yvWETH-2 runs Spark lender-borrowers into yvUSD and a 7.94x wstETH looper, and it has tripled in size since mid-October.
- **No standard exit:** `maxWithdraw` is 0 and neither yearn.fi nor Flex's interface offers the router path; holders must call `FlexExitRouter` directly and wait on auctions that depend on yvWETH-2's limited standard liquidity.
- **Who bears losses:** 96.8% of the vault belongs to the yETH Recovery Vault, so about a third of any loss falls on yETH claimants; that vault also holds yvWETH-2 directly.
- **Thin buffer and young history:** 27.2% of debt within 0.5% of liquidation; ~8 weeks in production.

### Critical Risks

- None identified. A yvWETH-2 impairment beyond ~10% would socialize bad debt to this vault after Flex's small fee reserve — the designed loss path of a CDP lender, but here concentrated on one market and one collateral.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [ ] **Unverified contract source** — *Not triggered.* Vault, strategy, Flex contracts, yvWETH-2 and its strategies are Etherscan-verified.
- [ ] **No audit** — *Not triggered.* Yearn V3 and Flex are audited.
- [ ] **Unverifiable reserves** — *Not triggered.* All positions are onchain.
- [ ] **Total centralization** — *Not triggered.* Multisig roles with a 7-day timelock.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits** — Yearn V3 audited by three top firms and Flex reviewed six times, but the vault runs v3.1.0, the yvWETH-2 strategies have no published external audit, and Flex has no bug bounty. → **2**

**Subcategory B: Historical Track Record** — ~8 weeks in production, ~3.5 weeks at its current ~$655K: the rubric's <3 months row. → **5**

**Audits & Historical Score = (2 + 5) / 2 = 3.5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance** — Standard Yearn setup, identical to yvWETH-1: immutable vault, 7-day timelock, multisig roles, no EOA roles. Flex's governance is scored as a dependency. → **1**

**Subcategory B: Programmability** — Onchain, keeper-driven. → **1**

**Subcategory C: External Dependencies** — 100% of debt sits in one Flex market whose sole collateral and sole price input is yvWETH-2, a leveraged, unassessed vault that itself depends on Spark, Lido and yvUSD. That is the rubric's single-point-of-failure row. → **5**

**Centralization Score = (1 + 1 + 5) / 3 = 2.33**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization** — Onchain over-collateralization at 112.21%, but in a single, leveraged, partly illiquid and unassessed collateral, with 27.2% of debt within 0.5% of liquidation: the rubric's "mixed quality or newer protocols" row. → **3**

**Subcategory B: Provability** — Fully onchain at every layer, though yvWETH-2's valuation passes through strategy models and Spark's oracle. → **1**

**Funds Management Score = (3 + 1) / 2 = 2.0**

#### Category 4: Liquidity Risk (Weight: 15%)

No standard redemption is available (`maxWithdraw = 0`); every exit is asynchronous through the router and one-day auctions, which neither yearn.fi nor Flex's interface offers. Auction takers rely on yvWETH-2's standard liquidity (~440 WETH, shared with its other holders), and the single 96.8% holder's exit would auction the whole market. Same-value assets temper the score. → **4**

#### Category 5: Operational Risk (Weight: 5%)

Yearn operates the vault; the underlying is run by a pseudonymous team with no legal entity, no Flex-specific monitoring, and an undocumented exit path. → **2**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 3.5 | 20% | 0.700 |
| Centralization & Control | 2.33 | 30% | 0.700 |
| Funds Management | 2.0 | 30% | 0.600 |
| Liquidity Risk | 4.0 | 15% | 0.600 |
| Operational Risk | 2.0 | 5% | 0.100 |
| **Final Score** | | | **2.70/5.0** |

The Centralization score is (1 + 1 + 5) / 3 = 2.3333, weighted 0.700. The weighted sum is 2.70.

**Optional Modifiers:** None apply (vault < 2 years).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk (2.70/5.0)**. The vault layer is standard Yearn, but the whole position depends on one young Flex market collateralized by a single leveraged, unassessed Yearn vault, with no standard exit. Assessing yvWETH-2 in its own report and implementing the yvWETH-2 PPS and Flex `BadDebt` monitors above are recommended before the Recovery Vault's allocation grows.

---

## Reassessment Triggers

- **Time-based:** reassess in 2 months (January 2027), or with the next Flex reassessment.
- **TVL-based:** reassess if TVL changes by more than ±50% from ~310 WETH, or if a depositor other than the Recovery Vault exceeds 10% of shares.
- **Collateral-based:** reassess on any yvWETH-2 PPS decrease, any yvWETH-2 strategy loss, a new yvWETH-2 strategy, looper leverage above 8.5x, or yvWETH-2 assets moving ±50% from 3,985 WETH.
- **Flex-based:** reassess on any `BadDebt` or `LiquidateTrove` in this market, a Lender loss, a market backing CR below 111%, or a Flex governance change.
- **Liquidity-based:** reassess if yvWETH-2's standard withdrawable amount falls below the market's pledged collateral, if the router changes, or after a router exit that realizes a material loss.
- **Governance-based:** reassess on any change to the vault's role holders or the Yearn timelock delay.

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| [November 10, 2026](https://github.com/yearn/risk-score/pull/589) | 2.70 | Initial assessment at block 26382003. 310.31 WETH, 100% in the Flex yvWETH-2/WETH Lender (112.21% backing, 8 Troves); 96.8% held by the yETH Recovery Vault; yvWETH-2 collateral (3,985 WETH) runs Spark lender-borrowers into yvUSD and a 7.94x wstETH looper; no standard exit (`maxWithdraw = 0`) |

---

## Appendix: Contract Architecture

```
   yETH claimants ─► yETHRecoveryVault wrapper (34.1%) ┐
   Yearn Treasury (33.3%) · yChad (32.5%) ─────────────┤
                                                       ▼
            Yearn yETH Recovery Vault  0xd7a540ba…95B6   (2,433 WETH)
              ├─ yvWETH-1 1,642 WETH · yvWETH-2 490 WETH (direct)
              └─ yvFlexWETH 300 WETH
                                   │
                                   ▼
   ┌──────────────────────────────────────────────────────────┐
   │ yvFlexWETH — Yearn V3 vault (v3.1.0)   310.31 WETH        │
   │ 0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F                │
   └──────────────────────────────────────────────────────────┘
     Yearn RoleManager · 7-day timelock · Daddy 6/9 · Brain 3/6 · Security 4/7
                   │ 100%
                   ▼
       FlexLenderStrategy 0x7E4a6A89…F2E3  ◄── FlexExitRouter (async exit)
                   │ deposit
                   ▼
       Flex Lender ysWETH 0x0d57098e…9E36   management: Flex Daddy (3-of-5, no timelock)
                   │ lends WETH
                   ▼
       TroveManager yvWETH-2/WETH 0xEe27D81B…334C   8 Troves · CR 112.21%
         └─ oracle 0x4E2cAD94…B96C → Morpho (feedless) → yvWETH-2 convertToAssets
                   │ collateral
                   ▼
       yvWETH-2 (Yearn V3, 3,985 WETH) 0xAc37729B76db6438CE62042AE1270ee574CA7571
         ├─ 62.8% Spark wstETH→USDS lender-borrower ─► yvUSD   (withdraw limit 0)
         ├─ 26.1% wstETH/WETH Spark looper 7.94x               (not in default queue)
         └─ 11.0% Spark WETH→USDS lender-borrower ─► yvUSD
```

**Trust boundaries:** Yearn governs this vault and yvWETH-2. Flex's governance controls the Lender's parameters and cannot be overridden by Yearn, but cannot seize funds. Borrower collateral sits in an immutable Flex TroveManager. This vault, as sole lender, bears any bad debt in the market; its losses pass to the yETH Recovery Vault and, through it, partly to yETH claimants.
