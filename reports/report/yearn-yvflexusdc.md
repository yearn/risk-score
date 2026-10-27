# Protocol Risk Assessment: Yearn — yvFlexUSDC

- **Assessment Date:** October 27, 2026
- **Token:** yvFlexUSDC (Flex USDC yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`](https://etherscan.io/address/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8)
- **Snapshot:** Onchain reads at Ethereum block [26285921](https://etherscan.io/block/26285921) (October 27, 2026, 18:43 UTC)
- **Final Score: 2.40/5.0**

## Overview + Links

yvFlexUSDC is a **USDC-denominated Yearn V3 vault** (ERC-4626, v3.0.4) that lends USDC into [Flex](./flex.md), a fixed-rate, Liquity-V2-style CDP lending protocol. It is listed on yearn.fi ([vault page](https://yearn.fi/vaults/1/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8)); Kong indexes it as a Yearn V3 vault (`vaultType: 1`, `isHidden: false`, `isRetired: false`). The vault holds **$1,118,643** and is fully deployed (`totalIdle = 0`). **81.0% of debt sits in three Flex Lender strategies**, one per Flex market, and the remaining 19.0% sits in Sky's sUSDS:

| Strategy | Allocation | Destination |
|---|---:|---|
| Flex yvUSD/USDC Lender | 54.0% | Flex yvUSD/USDC market |
| Flex ysyBOLD/USDC Lender | 18.0% | Flex ysyBOLD/USDC market |
| Flex yvcrvUSD-2/USDC Lender | 9.0% | Flex yvcrvUSD-2/USDC market |
| USDC To SKY USDS Depositor | 19.0% | Sky sUSDS |

Each Flex strategy deposits USDC into a Flex **Lender** — an ERC-4626 Yearn TokenizedStrategy that lends to borrowers ("Troves") posting yield-bearing USD vault shares as collateral. Lenders earn borrower interest and **absorb bad debt** if a Trove's collateral cannot cover its debt. Flex's markets, Lenders, oracles, governance and collateral chains are assessed in the [Flex report](./flex.md) (score 2.57/5.0, Medium Risk); this report treats Flex as a dependency and does not re-derive those facts. It covers the vault layer: governance, allocation, the Sky leg, how a vault holder exits, and how Flex risk passes through to vault shares.

**Key architecture:**

- **Vault:** Yearn V3 vault (v3.0.4), an EIP-1167 minimal proxy deployed on May 12, 2026 ([tx](https://etherscan.io/tx/0x5a08eb3db1726f1e3c7720532fbb28f6272ae0b0482c2cefe9f84ea2943c31a8)) through the [Yearn v3.0.4 Vault Factory](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) by the Flex deployer EOA ([`0x000005281a2b04A182085D37cC9E6dD552795caa`](https://etherscan.io/address/0x000005281a2b04A182085D37cC9E6dD552795caa)). That EOA holds no vault role at the snapshot (`roles() = 0`).
- **Governance:** standard [Yearn V3 `RoleManager`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) since September 8, 2026 ([tx](https://etherscan.io/tx/0xddff074807d813fbc600b0d42c23b457da751d422488926ee8971e17541c0d73)). Strategy additions and accountant changes go through the 7-day Yearn TimelockController. Role bitmasks are identical to [yvWETH-1](./yearn-yvweth.md) and [yvUSDC-1](./yearn-yvusdc.md).
- **Flex strategies:** three `FlexLenderStrategy` instances (TokenizedStrategy v3.0.4) from the Flex allocator repo ([`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator)). Deposits are gated to this vault (`open = false`, `allowed(vault) = true`); Yearn's Strategist MultiSig is `management`.
- **Sky strategy:** a `USDCToUSDS` strategy (TokenizedStrategy v3.0.4) — the same contract type as yvUSDC-1's USDC to sUSDS Lender — converting USDC to USDS through the Sky PSM and depositing into [sUSDS](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD).
- **Exit:** the first ~20.6% of the vault (Sky leg plus idle Lender cash) is withdrawable atomically. The remainder exits through the [`FlexExitRouter`](https://etherscan.io/address/0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD), which pays the exiting holder asynchronously from Flex redemption auctions (see *Liquidity Risk*).

**Key metrics (October 27, 2026, block 26285921):**

- **TVL:** 1,118,643.45 USDC, fully deployed (`totalDebt = totalAssets`, `totalIdle = 0`)
- **Total supply:** 1,100,731.35 yvFlexUSDC
- **Price per share:** 1.016272 USDC (1.000000 at first funding on May 17, 2026)
- **Net yield:** ~3.6% annualized over the last 30 days (1.013328 at [block 26070657](https://etherscan.io/block/26070657) on September 27 → 1.016272), ~3.7% annualized since first funding; net of fees
- **Deposit limit:** effectively uncapped (`deposit_limit = 1e29`); each Flex Lender caps itself at $2,000,000
- **Profit max unlock time:** 4 days
- **Fees:** 0% management, 10% performance (Yearn [Accountant](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) default config). Each Flex Lender separately charges a 10% performance fee to Flex's governance contract before profit reaches this vault (see [Flex report](./flex.md#accessibility-if-applicable))
- **Holders:** the Yearn Treasury ([`0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde`](https://etherscan.io/address/0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde)) holds 1,000,000 shares (90.8%, ~$1.02M); a 2-of-8 Safe ([`0xF06016D822943C42e3Cb7FC3a6A3B1889C1045f8`](https://etherscan.io/address/0xF06016D822943C42e3Cb7FC3a6A3B1889C1045f8)) holds 99,120.58 shares (9.0%); the rest is dust and fee shares

**Links:**

- [Yearn vault page](https://yearn.fi/vaults/1/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8)
- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Flex risk report](./flex.md) · [Flex documentation](https://flexmeow.com/docs) · [Flex allocator repository](https://github.com/flexmeow/flex-allocator)
- [Sky USDS risk report](./sky-usds.md)

## Contract Addresses

### Core Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvFlexUSDC Vault | [`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`](https://etherscan.io/address/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8) | Yearn V3 Vault (v3.0.4), Vyper minimal proxy |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Yearn Accountant (0% management, 10% performance; default config) |
| Vault Factory (v3.0.4) | [`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) | Yearn v3.0.4 Vault Factory |
| Tokenized Strategy | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) | Implementation for all four strategies (v3.0.4) |
| FlexExitRouter | [`0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD`](https://etherscan.io/address/0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD) | Flex periphery — exit path for the Flex legs |

### Governance Contracts

Vault role bitmasks read with `roles(address)` at the snapshot block.

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | `role_manager`; registers this vault as category 420 |
| Daddy / ySafe | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Safe — all roles except ADD_STRATEGY and ACCOUNTANT (`16374`) |
| Brain | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-6 Safe — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY (`14706`); `management` on all four strategies |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Safe — DEBT, MAX_DEBT, EMERGENCY (`8384`) |
| Strategy Manager (Timelock) | [`0x88ba032be87d5eF1FbE87336B7090767F367BF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336B7090767F367BF73) | TimelockController, `getMinDelay() = 604800` (7 days) — ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (`143`) |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaS — REPORTING only (`32`); keeper on all four strategies |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | REPORTING + DEBT_MANAGER (`96`) |

### Active Strategies (4 in default queue, all with debt)

| # | Strategy | Name | Current Debt (USDC) | Allocation | Activated |
|---|----------|------|--------------------:|-----------:|-----------|
| 1 | [`0xfb4F83c3923eab7B6254cD2399C206109970F95e`](https://etherscan.io/address/0xfb4F83c3923eab7B6254cD2399C206109970F95e) | USDC To SKY USDS Depositor | 212,583.82 | 19.0% | May 17, 2026 |
| 2 | [`0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | Flex yvUSD/USDC Lender | 604,550.07 | 54.0% | Aug 11, 2026 |
| 3 | [`0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | Flex ysyBOLD/USDC Lender | 200,964.97 | 18.0% | Aug 14, 2026 |
| 4 | [`0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d`](https://etherscan.io/address/0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d) | Flex yvcrvUSD-2/USDC Lender | 100,544.59 | 9.0% | Aug 25, 2026 |

Allocations are shares of `totalDebt()` (1,118,643.45 USDC); per-strategy `current_debt` values sum exactly to `totalDebt()`. Every strategy's `max_debt` is `1e16` (effectively uncapped), so allocation is bounded only by the Flex Lenders' $2M deposit limits and by Brain / the debt allocator. The default queue order is Sky, yvUSD, ysyBOLD, yvcrvUSD-2; `use_default_queue() = false`, so a withdrawing caller may pass its own strategy order.

**Previously revoked:** the original v1 Flex yvUSD/USDC Lender strategy ([`0x467Ce10870747372968ba98463A1d9af9fb27751`](https://etherscan.io/address/0x467Ce10870747372968ba98463A1d9af9fb27751)) was added at the first funding (May 17, 2026), wound down without loss between August 13 and 19, and revoked on August 19, 2026 ([tx](https://etherscan.io/tx/0x90306a5ff581ee85d211811649f75e4f19d3e83fe5666145adba33d2717ea51e)) when Flex migrated to its v1.1 markets.

### Strategy Protocol Dependencies (current allocation)

| Protocol | Strategy | Allocation | Notes |
|---|---|---:|---|
| **Flex — yvUSD/USDC market** | Flex yvUSD/USDC Lender | **54.0%** | Collateral is [yvUSD](./yearn-yvusd.md), a Yearn V3 USDC vault; backing CR 114.97%. The strategy holds 99.87% of the [Lender](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) |
| **Flex — ysyBOLD/USDC market** | Flex ysyBOLD/USDC Lender | **18.0%** | Collateral is ysyBOLD → yBOLD → Liquity V2 BOLD, priced off a Curve EMA; backing CR 126.70%. Liquity V2 has no report in this repository |
| **Flex — yvcrvUSD-2/USDC market** | Flex yvcrvUSD-2/USDC Lender | **9.0%** | Collateral is yvcrvUSD-2 → Curve crvUSD, priced off a Curve EMA; backing CR 112.28%, with 79.8% of debt within 0.5% of the 110% liquidation line. Neither the vault nor crvUSD has a report in this repository |
| **Sky / sUSDS** | USDC To SKY USDS Depositor | **19.0%** | 190,835.64 sUSDS (212,646.19 USDS) in the 4.80B-USDS Sky Savings vault, earning the ~3.80% Sky Savings Rate. See the [Sky USDS report](./sky-usds.md) |

The three Flex markets are **isolated**: each has its own TroveManager and Lender, so bad debt in one market reaches only the strategy lending into it. They share Flex's code (one TroveManager template, one Lender implementation), its oracle designs, and its governance contract, so a code-level or governance failure in Flex is a common-mode risk across all 81.0%.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

The vault and TokenizedStrategy framework are covered by Yearn's V3 audits, listed in the [yearn-security repository](https://github.com/yearn/yearn-security/tree/master/audits):

| Auditor | Date | Scope |
|---------|------|-------|
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 2023 | V3 Vaults + Tokenized Strategy (v3.0.0) |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | July 2023 | V3 Vaults (v3.0.1) |
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | March 2024 | V3 Vaults (v3.0.2) |

### Flex Audits (Underlying Protocol)

Flex has six published security reviews, including two Dedaub audits; the August 2026 Dedaub review of the deployed v1.1 code found no Critical, High, Medium or Low issues. The `FlexLenderStrategy` allocator code is a Yearn V3 strategy reviewed by Yearn security and by Zero Cool. Details are in the [Flex report](./flex.md#audits-and-due-diligence-disclosures).

### Strategy Review Process

Strategies go through Yearn's [risk scoring framework](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md) and ySec security review before being added through the 7-day timelock.

### Bug Bounty

- **Yearn (Immunefi):** active, max payout $200,000 — [immunefi.com/bounty/yearnfinance](https://immunefi.com/bounty/yearnfinance/). Whether the Flex strategies fall within its scope is not stated: `TODO` — confirm scope with Yearn security.
- **Flex:** none (see [Flex report](./flex.md#bug-bounty-if-applicable)).
- **Sky (Immunefi):** active, max payout $10,000,000 — [immunefi.com/bug-bounty/sky](https://immunefi.com/bug-bounty/sky/).

### On-Chain Complexity

The vault layer is simple: four strategies on one chain, no leverage inside the vault, no bridging. Complexity sits one hop down, in Flex — a Liquity-V2-style CDP engine with callback-based borrowing, Dutch-auction redemptions, and three oracle designs — summarized in the [Flex report](./flex.md#audits-and-due-diligence-disclosures).

## Historical Track Record

- **Vault deployed:** May 12, 2026 (block 25080961); first funded May 17, 2026 (block 25116141) — **~5.5 months** in production.
- **TVL:** 1,000,000 USDC at first funding; $1,009,527 on August 11; $1,111,367 on August 25; $1,118,643 at the snapshot. The only material inflow after first funding was the Safe's 99,120.58-share deposit on August 14, 2026 ([tx](https://etherscan.io/tx/0x6c8227e58c40b6b578bc8dd49d3150ce8972aade9c041443d48b25dfc1c517e1)); growth since then is yield.
- **PPS trend:** 1.000000 (May 17) → 1.008462 (Aug 11) → 1.011264 (Sep 6) → 1.016272 (Oct 27). None of the vault's 89 `StrategyReported` events since inception carried a loss.
- **Migration, August 2026:** the vault moved its Flex exposure from the v1 market to three v1.1 markets. The v1 strategy redeemed ~$800K in three tranches between August 13 and 19 without loss and was revoked; the three v1.1 strategies were added on August 11, 14 and 25.
- **Security incidents:** none for this vault, for Yearn V3, or for Flex.
- **Yearn V3 track record:** ~29 months live with no V3 vault exploits. Yearn protocol TVL is ~$154M across chains ([DeFiLlama](https://defillama.com/protocol/yearn-finance), October 27, 2026).

## Funds Management

The vault takes USDC and allocates it across four strategies with no idle buffer (`minimum_total_idle = 0`). Brain and the debt allocator move debt between them; adding a new strategy requires the 7-day timelock.

### Strategy 1–3: Flex Lender strategies (81.0%)

Each `FlexLenderStrategy` deposits USDC into one Flex Lender and reports `idle + Lender shares × Lender PPS`. The Lender lends to Troves; collateral is pledged yield-bearing USD vault shares, liquidated permissionlessly below a 110% minimum collateral ratio, and redeemed lowest-interest-rate first through one-day Dutch auctions when a Lender needs liquidity. Bad debt that liquidation cannot cover is socialized to that Lender's shareholders — here, effectively this vault — after a small protocol fee reserve.

| Leg | Strategy debt | Lender | Lender share held | Market backing CR | Lender idle |
|---|---:|---|---:|---:|---:|
| yvUSD/USDC | $604,550 | [`0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) | 99.87% | 114.97% | $0 |
| ysyBOLD/USDC | $200,965 | [`0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) | 99.94% | 126.70% | $17,594 |
| yvcrvUSD-2/USDC | $100,545 | [`0xc1f281A3643F219636F97F6E687A33704950eC84`](https://etherscan.io/address/0xc1f281A3643F219636F97F6E687A33704950eC84) | 99.89% | 112.28% | $798 |

Market CRs are pledged collateral over interest-accrued debt, from the Flex report's Trove walk at the same block. Because the vault owns essentially every Lender share, it is the entire lender side of all three Flex USDC markets.

Flex-side parameters that affect this vault but are not under Yearn's control are set by Flex's governance contract (a 3-of-5 Safe with no timelock): each Lender's performance fee (10% today), keeper, deposit limit and shutdown, market endorsement, and the ysyBOLD oracle's depeg floor. That contract cannot seize Lender assets or borrower collateral. See the [Flex report](./flex.md#governance).

**Reporting dependency:** `FlexLenderStrategy._harvestAndReport()` reverts while the strategy's last redemption auction is unsettled, so this vault cannot book profit or loss from that leg until the auction clears.

### Strategy 4: USDC To SKY USDS Depositor (19.0%)

**Conversion pipeline:** USDC → USDS through the Sky PSM (maximum accepted PSM fee 0.05%, with a Uniswap V3 fallback at 0.5% slippage), then USDS → sUSDS. At the snapshot the strategy holds 190,835.64 sUSDS worth 212,646.19 USDS, and `availableWithdrawLimit(vault)` returns the full 212,646.19 USDC. This is the same `USDCToUSDS` contract type as [yvUSDC-1](./yearn-yvusdc.md)'s USDC to sUSDS Lender.

### Accessibility

- **Deposits:** permissionless ERC-4626 deposit of USDC; vault deposit limit effectively uncapped. Deposited USDC is idle until Brain or the debt allocator pushes it to strategies; each Flex Lender accepts deposits only up to its $2M limit.
- **Withdrawals:** permissionless ERC-4626 `withdraw`/`redeem`. A standard redemption can draw only on liquid funds — today ~$230,976 (Sky leg plus idle Lender cash). Larger exits go through the `FlexExitRouter` (see *Liquidity Risk*).
- **No cooldown or lock.**
- **Fees:** 0% management, 10% performance at the vault, on top of the Flex Lenders' own 10% performance fee.

### Token Mint Authority

**Mint mechanism:** permissionless ERC-4626 `deposit`/`mint`. Yearn V3 vault shares have no privileged minter.

**Mint requires backing:** yes — atomic. The vault transfers USDC in before minting shares.

**Per-address mint authority** (`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any caller of `deposit()` / `mint()` | ✓ | ✓ | Permissionless ERC-4626 | Subject to `deposit_limit` set by DEPOSIT_LIMIT_MANAGER (Daddy / Brain) |

**Rate limits / supply caps:** `deposit_limit = 1e29` (effectively none); no deposit or withdraw limit module.

**Backing check at mint time:** atomic `transferFrom` before `_mint`. Performance-fee shares are minted to the accountant only against reported profit.

### Collateralization

- **100% onchain:** every dollar is either lent through Flex against pledged onchain collateral or held as sUSDS.
- **Flex legs (81.0%):** over-collateralized by yield-bearing USD vault shares at market backing ratios of 112.28–126.70% (book-wide 116.81% in the Flex report, which also includes a WETH market this vault does not lend into). The collaterals are alike assets for a USDC lender, so running near the 110% MCR is the intended looping design. Lender loss requires an impairment in an underlying collateral vault (yvUSD, ysyBOLD's Liquity V2 chain, or yvcrvUSD-2's crvUSD) large enough to outrun liquidation, not ordinary price moves. The protocol's first-loss reserve is about $424 across the three USDC markets, a rounding buffer.
- **Sky leg (19.0%):** sUSDS, backed by Sky's over-collateralized loans and RWA holdings ([Sky USDS report](./sky-usds.md), score 1.30).
- **No leverage inside the vault.** Flex borrowers are levered; the vault is their only lender.

### Provability

- **Vault PPS:** onchain ERC-4626; profits unlock over 4 days, losses hit PPS immediately.
- **Flex legs:** strategy value = idle + Lender shares × Lender PPS. Lender PPS is cached at each Flex keeper report and unlocks profit over 4 days; underlying debt and collateral are readable from each TroveManager (`sync_total_debt()`, `troves(id)`), so anyone can recompute backing.
- **Sky leg:** `sUSDS.convertToAssets()`, onchain.

## Liquidity Risk

- **Standard ERC-4626 exit — ~20.6% today.** `maxWithdraw` for the Yearn Treasury returns **230,976 USDC** at the snapshot: the Sky leg (212,646 USDC withdrawable) plus idle cash in the ysyBOLD and yvcrvUSD-2 Lenders. A plain `redeem()` beyond that reverts or returns less, because each Flex strategy's `availableWithdrawLimit` is only its idle liquidity.
- **Flex legs exit through `FlexExitRouter.redeem()` — asynchronous.** The router sets the exiting holder as the *proceeds receiver* on the Flex strategies, redeems vault shares, and clears it. Each Flex strategy then redeems Lender shares to that receiver: idle cash arrives atomically, and the remainder triggers Flex redemptions of the lowest-rate Troves whose collateral is sold in a one-day Dutch auction (starting at 100% of oracle value, floored at 99%). Auction proceeds go straight to the exiting holder as they are taken.
  - The vault books the asynchronous portion as a **loss on that withdrawal** (per the strategy's verified source), so the caller must pass a `maxLoss` high enough to cover it. Remaining holders are unaffected: the shortfall and any auction discount fall on the exiting holder alone.
  - The exiting holder bears auction execution: price drift of the collateral during the auction, up to a ~1% discount at the floor, and re-kick delay if no taker appears.
  - Whether the yearn.fi interface routes withdrawals through the `FlexExitRouter`: `TODO` — not verified.
- **Large holder impact.** The vault is the sole lender in all three Flex USDC markets, so the Yearn Treasury's full exit (~$1.02M, 90.8% of shares) would mean redeeming essentially the entire Flex USDC borrower book — about $889K of Trove debt across three collaterals — through auctions that each clear only in their own collateral. Flex's redemption path has run 60 times across its markets since September 7 without incident, but never at that scale.
- **Curator unwind.** Brain can also reduce debt on a Flex strategy (`update_debt`) or call `forceFreeFunds`; both use the same redemption-auction path and take at least a day to complete.
- **Same-value asset:** USDC in, USDC out; the collateral being auctioned is USD-denominated, so short delays carry limited price risk.

## Centralization & Control Risks

### Governance

The vault uses the **standard Yearn V3 governance pattern** through the Yearn RoleManager, identical (same role holders and bitmasks) to yvWETH-1 and yvUSDC-1:

1. **Immutable vault** — a minimal proxy of the v3.0.4 implementation; no upgrade path.
2. **7-day timelock** on adding strategies and changing the accountant (`getMinDelay() = 604800`). Daddy (6-of-9, publicly named signers) is the timelock's sole proposer ([details](./yearn-yvusd.md#appendix-timelockcontroller-role-structure)).
3. **No EOA roles** — the Flex deployer EOA that created the vault holds `roles() = 0`.
4. **Untimelocked operational powers:** Brain (3-of-6) and the debt allocator can move debt between the four approved strategies and reorder the queue; Brain is `management` on every strategy and can `forceFreeFunds` the Flex legs. These are bounded operational powers over already-approved strategies.

**Flex governance is outside this layer.** Flex's own governance contract controls the Lenders the vault lends into and cannot be overridden by any Yearn role. It is scored here as a dependency, not as vault governance.

### Programmability

- Vault PPS, deposits and withdrawals are onchain and programmatic.
- Strategy reports are keeper-driven (yHaaS); Flex Lender reports are driven by Flex's hard-coded keeper. A pending Flex auction pauses that leg's report until settled.
- Debt allocation is manual (Brain) plus the debt allocator.

### External Dependencies

| Dependency | Criticality | Notes |
|---|---|---|
| **Flex** (three markets) | Critical | 81.0% of debt. ~5.5-month-old protocol, six audits, no bug bounty, governance by a 3-of-5 Safe with no timelock, pseudonymous team. Markets are isolated but share code and governance. [Flex report](./flex.md) score 2.57/5.0 (Medium Risk) |
| **Flex collateral chains** | High | yvUSD (54.0% leg; [assessed](./yearn-yvusd.md), 2.46/5.0); ysyBOLD → yBOLD → Liquity V2 BOLD (18.0% leg; unassessed); yvcrvUSD-2 → Curve crvUSD (9.0% leg; unassessed). Two of these are priced off single Curve pool EMAs |
| **Sky / sUSDS** | Medium | 19.0% of debt; blue-chip. [Sky USDS report](./sky-usds.md) score 1.30/5.0 |
| **Sky PSM / Uniswap V3 fallback** | Low | USDC ↔ USDS conversion for the Sky leg |
| **Yearn V3 framework** | High | Vault and all four strategies inherit Yearn's audited V3 contracts |

## Operational Risk

- **Vault operator:** Yearn — established since 2020, named Daddy signers, BORG legal wrapper ([YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)).
- **Underlying operator:** Flex's team is pseudonymous with no legal entity; its risks page denies the admin powers its governance contract holds (see [Flex report](./flex.md#operational-risk)).
- **Documentation:** Yearn V3 docs are comprehensive. Neither Yearn nor Flex documents this vault's exit path through the `FlexExitRouter` for end users.
- **Incident response:** Yearn's demonstrated process and $200K bug bounty cover the vault layer; Flex has no bounty or documented incident process.

## Monitoring

### Existing Monitoring Infrastructure

Verified against [`yearn/monitoring-scripts-py`](https://github.com/yearn/monitoring-scripts-py) at `main` commit [`65599b6`](https://github.com/yearn/monitoring-scripts-py/commit/65599b6c58174a6ab90c2dbc34405889dd41e39a):

- **Large Flows** (`protocols/yearn/alert_large_flows.py`) and **Small Parent Vault Flows** apply: both discover Yearn V3 vaults from Kong, which indexes this vault. The $500K mainnet large-flow threshold equals ~45% of the vault, so only very large flows alert.
- **Timelock Events / Timelock Delay** cover strategy additions and the 7-day delay on the Yearn TimelockController; **Safe Multisigs** covers Yearn Safe queues.
- **No Flex-specific monitor exists** — Trove CRs, bad debt, Lender losses, Flex oracles and Flex governance are unwatched (see the [Flex report's monitoring section](./flex.md#monitoring) for recommended monitors).

### Key Contracts

| Contract | Address | Monitor |
|---|---|---|
| yvFlexUSDC Vault | [`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`](https://etherscan.io/address/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8) | `pricePerShare()`, `totalAssets()`, `totalIdle()`, `strategies(address)`, `get_default_queue()`, `maxWithdraw`, `StrategyChanged`, `DebtUpdated`, `StrategyReported` (loss), `Shutdown` |
| Flex yvUSD/USDC Lender strategy | [`0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | `totalAssets()`, `pendingAuctionId()`, `availableWithdrawLimit(vault)`, report freshness |
| Flex ysyBOLD/USDC Lender strategy | [`0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | same |
| Flex yvcrvUSD-2/USDC Lender strategy | [`0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d`](https://etherscan.io/address/0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d) | same |
| USDC To SKY USDS Depositor | [`0xfb4F83c3923eab7B6254cD2399C206109970F95e`](https://etherscan.io/address/0xfb4F83c3923eab7B6254cD2399C206109970F95e) | `totalAssets()`, `availableWithdrawLimit(vault)` |
| Flex Lenders | [`0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA), [`0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C), [`0xc1f281A3643F219636F97F6E687A33704950eC84`](https://etherscan.io/address/0xc1f281A3643F219636F97F6E687A33704950eC84) | `pricePerShare()`, `Reported` loss, `performanceFee()`, `isShutdown()` |
| Flex governance Safe | [`0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67) | any execution; signer/threshold changes |

### Critical Events & Thresholds

- **PPS decrease** on the vault or any Flex Lender — immediate.
- **Any `BadDebt` event** in a Flex market this vault lends into, or a Flex market backing CR below 110.5% — see the [Flex report](./flex.md#monitoring).
- **Liquid share** — alert if the standard-withdrawable amount (Sky leg + Lender idle) falls below 10% of `totalAssets`, or if the Sky leg is defunded.
- **Allocation** — alert if any single Flex market exceeds 60% of vault debt or the Flex share exceeds 90%.
- **Flex governance** — any Flex Lender performance-fee, keeper or shutdown change; any `DepegModeSet` on the ysyBOLD oracle.
- **Holder concentration** — a Yearn Treasury exit (90.8%) would require redeeming most Flex USDC Troves; track large `Withdraw` events and router exits.
- **Report staleness** — a Flex strategy not reported for >7 days (likely a pending auction).

## Risk Summary

### Key Strengths

- **Standard Yearn governance:** immutable vault, Yearn RoleManager, 7-day timelock on strategy additions, no EOA roles — the same setup as Yearn's core vaults.
- **Over-collateralized, onchain lending:** the Flex legs lend against pledged yield-bearing USD vault shares at 112–127% market backing; everything is recomputable onchain.
- **Clean record:** ~5.5 months live, PPS up 1.63%, 89 strategy reports with zero loss, one migration completed without loss, no Flex bad debt.
- **A liquid Sky leg:** 19.0% in sUSDS, instantly withdrawable.

### Key Risks

- **Concentration in one young protocol:** 81.0% of debt is in Flex, whose markets are isolated but share code, oracle designs and an untimelocked 3-of-5 governance contract.
- **Exit is mostly asynchronous:** only ~20.6% exits through a standard redemption; the rest requires the `FlexExitRouter`, auction execution, and a `maxLoss` that tolerates the asynchronous portion being booked as a loss.
- **The vault is the whole lender side:** it owns 99.9% of every Flex USDC Lender, so its largest holder's exit equals unwinding the entire Flex USDC borrower book.
- **Partly unassessed collateral:** 27.0% of debt sits on collateral chains ending in Liquity V2 BOLD and Curve crvUSD, which this repository has not assessed.
- **No protocol-level monitoring:** Yearn monitors only the vault's flows and its own governance.

### Critical Risks

- None identified. A collateral impairment in a Flex market would socialize bad debt to this vault after Flex's small fee reserve — the designed loss path of a CDP lender, bounded per market.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [ ] **Unverified contract source** — *Not triggered.* Vault, strategies, Flex contracts and router are Etherscan-verified.
- [ ] **No audit** — *Not triggered.* Yearn V3 has three audits; Flex has six reviews.
- [ ] **Unverifiable reserves** — *Not triggered.* All positions are onchain.
- [ ] **Total centralization** — *Not triggered.* Multisig roles with a 7-day timelock.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits** — Yearn V3 has three top-firm audits and a $200K Immunefi bounty; Flex, which holds 81.0% of debt, has six reviews (two Dedaub) but no bug bounty. → **2**

**Subcategory B: Historical Track Record** — ~5.5 months in production with ~$1.12M TVL: the rubric's 3–6 months / <$10M row. → **4**

**Audits & Historical Score = (2 + 4) / 2 = 3.0**

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance** — Immutable vault, 7-day timelock on strategy additions with a 6-of-9 named-signer proposer, no EOA roles: the rubric's score-1 row, identical to yvWETH-1 and yvUSDC-1. Brain's untimelocked debt and queue powers are operational and scored under Programmability. Flex's own untimelocked governance is a dependency risk, scored below. → **1**

**Subcategory B: Programmability** — PPS and vault operations are onchain and programmatic; strategy reports are keeper-driven; debt allocation is Brain plus the debt allocator. → **1**

**Subcategory C: External Dependencies** — 81.0% of debt depends on a single ~5.5-month-old protocol whose governance has no timelock and whose collateral chains reach two unassessed protocols. Markets are isolated, so no single market failure hits the whole position, but shared Flex code and governance make Flex close to a single point of failure for four-fifths of the vault. The 19.0% Sky leg is blue-chip. Between the rubric's "newer protocol dependencies, critical functionality depends on them" (4) and "single point of failure" (5). → **4.5**

**Centralization Score = (1 + 1 + 4.5) / 3 = 2.17**

**Score: 2.17/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization** — 100% onchain. The Flex legs lend against over-collateralized, real-time-verifiable yield-bearing USD vault shares (newer protocols and partly unassessed chains); the Sky leg is sUSDS. Matches the Flex report's 2.5. → **2.5**

**Subcategory B: Provability** — Fully onchain at every layer; anyone can recompute Flex backing. → **1**

**Funds Management Score = (2.5 + 1) / 2 = 1.75**

**Score: 1.75/5**

#### Category 4: Liquidity Risk (Weight: 15%)

About 20.6% of the vault exits atomically through a standard redemption. The rest exits through the `FlexExitRouter`, paid asynchronously from one-day near-par Dutch auctions, with the exiting holder bearing execution and the asynchronous portion booked as a withdrawal loss — a mechanism standard ERC-4626 integrations do not use. Same-value assets allow some delay. The deciding factor is large-holder impact: the vault is the sole lender, so its 90.8% holder's exit means unwinding the entire Flex USDC borrower book. The Flex report scores its Lender's liquidity 3; the vault scores half a point worse for that concentration and for the default path's ~20.6% ceiling. → **3.5**

**Score: 3.5/5**

#### Category 5: Operational Risk (Weight: 5%)

Yearn operates the vault (well-known team, BORG entity, comprehensive docs, active vault-level monitoring). The 81.0% underlying is run by a pseudonymous team with no legal entity and no Flex-specific monitoring, and the router exit path is undocumented for users. → **2**

**Score: 2/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 3.0 | 20% | 0.600 |
| Centralization & Control | 2.17 | 30% | 0.650 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.0 | 5% | 0.100 |
| **Final Score** | | | **2.40/5.0** |

The Centralization score is (1 + 1 + 4.5) / 3 = 2.1667, weighted 0.650. The weighted sum is 2.40.

**Optional Modifiers:** None apply (vault < 2 years).

**Relation to the Flex score (2.57):** this vault scores slightly better than the Flex Lender it is 54.0% concentrated in because its own governance is Yearn's score-1 setup, 19.0% sits in blue-chip sUSDS, and Yearn as curator can unwind or re-weight the Flex legs without Flex's cooperation. Flex's governance, track record and collateral risk pass through in full via the Dependencies (4.5), Collateralization (2.5) and Liquidity (3.5) subscores.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.40/5.0)**, near the top of the band. The vault layer is standard Yearn, but four-fifths of it depends on a young protocol with untimelocked governance and an exit that is mostly asynchronous. Implementing the Flex monitors listed in the [Flex report](./flex.md#monitoring) is recommended before significant outside deposits arrive.

---

## Reassessment Triggers

- **Time-based:** reassess in 3 months (January 2027), or with the next Flex reassessment.
- **TVL-based:** reassess if TVL changes by more than ±50% from ~$1.12M, or if outside depositors exceed 25% of shares.
- **Allocation-based:** reassess if a strategy is added or revoked, if the Flex share exceeds 90% or falls below 50%, if any single Flex market exceeds 60% of debt, or if the Sky leg is defunded.
- **Flex-based:** reassess on any Flex score change, `BadDebt` event, Lender loss, new Flex market this vault funds, Flex governance change, or `DepegModeSet` on the ysyBOLD oracle.
- **Liquidity-based:** reassess if the standard-withdrawable share falls below 10% of `totalAssets`, if the `FlexExitRouter` is changed or disabled, or after any router exit that realizes a material loss.
- **Governance-based:** reassess on any change to the vault's role holders, the Yearn timelock delay, or Daddy / Brain / Security composition.

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| [October 27, 2026](https://github.com/yearn/risk-score/pull/564) | 2.40 | Initial assessment at block 26285921. $1.12M TVL; 81.0% in three Flex Lender strategies (yvUSD 54.0%, ysyBOLD 18.0%, yvcrvUSD-2 9.0%), 19.0% in sUSDS; standard Yearn RoleManager governance; ~20.6% instantly withdrawable, remainder via FlexExitRouter auctions; 90.8% held by the Yearn Treasury |

---

## Appendix: Contract Architecture

```
                        USER / YEARN TREASURY (USDC)
                                   │ deposit / redeem (ERC-4626)
                                   │ large exits: FlexExitRouter.redeem()
                                   ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │  yvFlexUSDC — Yearn V3 vault (v3.0.4)        $1,118,643, 0% idle     │
   │  0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8                          │
   └──────────────────────────────────────────────────────────────────────┘
     role_manager: Yearn RoleManager 0xb3bd6B2E…9a41
     ADD_STRATEGY / ACCOUNTANT: Yearn 7-day timelock 0x88ba032b…BF73
     Daddy 6/9 · Brain 3/6 · Security 4/7 · keeper · debt allocator
        │ 19.0%            │ 54.0%            │ 18.0%            │ 9.0%
        ▼                  ▼                  ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ USDC → SKY   │  │ FlexLender   │  │ FlexLender   │  │ FlexLender   │
  │ USDS Depos.  │  │ Strategy     │  │ Strategy     │  │ Strategy     │
  │ 0xfb4F83c3…  │  │ 0x7501EAE6…  │  │ 0xDd58AeFE…  │  │ 0xC818A0Be…  │
  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
        │ PSM            │ deposit          │ deposit          │ deposit
        ▼                ▼                  ▼                  ▼
     sUSDS          Flex Lender        Flex Lender        Flex Lender
     0xa3931d71…    yvUSD/USDC         ysyBOLD/USDC       yvcrvUSD-2/USDC
     (Sky)          0xD93Dade7…        0xf4996Ca4…        0xc1f281A3…
                    CR 114.97%         CR 126.70%         CR 112.28%
                       └───────── Flex markets: see flex.md ─────────┘
                       governance: Flex Daddy, 3-of-5 Safe, no timelock
```

**Trust boundaries:** Yearn governs the vault and chooses how much to lend into each Flex market, with strategy additions behind a 7-day timelock. Flex's governance controls the Lenders' parameters and market set and cannot be overridden by Yearn, but cannot seize funds. Borrower collateral sits in immutable Flex TroveManagers. The vault, as sole lender, bears any Flex bad debt in the markets it funds.
