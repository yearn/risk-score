# Protocol Risk Assessment: Yearn — yvWETH-1

- **Assessment Date:** May 11, 2026 (Updated: October 14, 2026)
- **Token:** yvWETH-1 (WETH-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0)
- **Final Score: 1.59/5.0**

## Overview + Links

yvWETH-1 is a **WETH-denominated Yearn V3 vault** (ERC-4626) that deploys deposited WETH into yield strategies on Ethereum mainnet. At block [26192556](https://etherscan.io/block/26192556) the vault holds **7,341.17 WETH** (~$17.86M) and is fully deployed (`totalIdle` = 0). Debt is split across four strategies: **Spark WETH Lender 38.4%**, **stETH Accumulator 37.8%**, **wstETH/WETH Spark Looper 14.1%**, and **Yearn OG WETH 9.7%**. The four `current_debt` values sum to `totalDebt()` exactly.

The default queue is Accumulator → Yearn OG WETH → Spark WETH Lender. That queue can pay **3,530.55 WETH (48.1% of debt)** atomically. The Accumulator does not auto-unwind. The looper is outside the queue, and pinned-block withdrawals from it revert with `!slippage`.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting WETH deposits and issuing yvWETH-1 shares. Immutable Vyper minimal proxy (EIP-1167) from the v3.0.2 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0)). `isShutdown()` is false. `use_default_queue()` is true.
- **Funded strategies (4; 3 in the default queue):**
  - **Spark WETH Lender** ([`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151)) — 2,821.68 WETH `current_debt` (38.4%). Supplies WETH to Spark Lend. Atomic.
  - **stETH Accumulator** ([`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)) — 2,774.69 WETH `current_debt` (37.8%). Holds stETH. `availableWithdrawLimit(vault)` is 0.
  - **wstETH/WETH Spark Looper** ([`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121)) — 1,035.94 WETH `current_debt` (14.1%). LSTAaveLooper at ~7.97x in Spark ETH E-Mode (health factor 1.063). Not in the default queue. Simulated exits revert with `!slippage`.
  - **Yearn OG WETH** ([`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC)) — 708.87 WETH `current_debt` (9.7%). Morpho MetaMorpho vault. The yvWETH-1 vault's shares are worth 708.89 WETH, which is 96.1% of that MetaMorpho vault. Listed at https://app.morpho.org/ethereum/vault/0xE89371eAaAC6D46d4C3ED23453241987916224FC/yearn-og-weth
- **Withdrawal mechanics:** A user `withdraw` walks the default queue. The Accumulator contributes 0. Yearn OG WETH and the Spark lender then pay up to their `current_debt`. A simulated withdrawal of that full 3,530.55 WETH from the largest holder succeeded at the snapshot block. The looper's 14.1% is not in the queue, and `update_debt` down to zero reverts with `!slippage`, so a debt manager cannot pull it until the Curve quote fits the 2 bps limit or management raises `slippage()`.
- **Governance:** Yearn V3 Role Manager ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)), category 1. ySafe 6-of-9, Brain 3-of-8, Security 4-of-7, and the 7-day Strategy Manager timelock are unchanged from block [25574582](https://etherscan.io/block/25574582) (July 20, 2026).

**Key metrics (October 14, 2026, block [26192556](https://etherscan.io/block/26192556), hash `0x82962f4620910d4d8d842924e95c18e7436b6725656a9fc66184783c0f5defa0`, 18:32:35 UTC):**

- **TVL:** 7,341.17 WETH. Chainlink ETH/USD ([`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)) answered $2,432.22306244 at 17:41:35 UTC, so about **$17.86M**
- **Total Supply:** 6,953.49 yvWETH-1
- **Price Per Share:** 1.055753 WETH per share (5.58% since the March 12, 2024 deployment). From block [25977509](https://etherscan.io/block/25977509) (exactly 30 days earlier, PPS 1.053931) the trailing growth annualizes to **2.12%**
- **Total Debt:** 7,341.17 WETH
- **Total Idle:** 0
- **Deposit Limit:** 15,000 WETH
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management, 10% performance, from the shared accountant default config (`useCustomConfig(vault)` is false)

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Lido Documentation](https://docs.lido.fi/)
- [Lido Security](https://docs.lido.fi/security/audits/)
- [DeFiLlama: Lido](https://defillama.com/protocol/lido)
- [hgETH reassessment (rsETH bridge exploit context)](./kerneldao-hgeth.md)

## Contract Addresses

### Core yvWETH-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvWETH-1 Vault | [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0) | Yearn V3 Vault (v3.0.2), Vyper minimal proxy |
| Underlying asset (WETH) | [`0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) | Wrapped Ether |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Shared Yearn Accountant (0% mgmt, 10% perf) |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |

### Governance Contracts (shared with all Yearn V3 risk-1 vaults)

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | `getCategory(vault) = 1` |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — vault role mask `0x3ff6` (12 of 14 roles) |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe — vault role mask `0x3972` |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe — DEBT, MAX_DEBT, EMERGENCY |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay**. Self-governed |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) |
| Vault Original (v3.0.2) | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) |

### Active Strategies (4 total; 3 in default queue)

`get_default_queue()` returns Accumulator, Yearn OG WETH, Spark WETH Lender. No `StrategyChanged` events from block 25574582 through 26192556.

| # | Strategy | Name | Current Debt (WETH) | Pct of TotalDebt | In Queue? |
|---|----------|------|--------------------:|-----------:|-----------|
| 1 | [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151) | **Spark WETH Lender** | **2,821.68** | **38.4%** | YES (3rd) |
| 2 | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | **stETH Accumulator** | **2,774.69** | **37.8%** | YES (1st) |
| 3 | [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | **wstETH/WETH Spark Looper** | **1,035.94** | **14.1%** | NO |
| 4 | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | Yearn OG WETH (Morpho MetaMorpho) | 708.87 | 9.7% | YES (2nd) |

### Strategy Protocol Dependencies

| Protocol | Strategy | Known Allocation |
|----------|----------|-----------------:|
| **Spark Lend (Sky)** | Spark WETH Lender + wstETH/WETH Spark Looper | **52.5% of vault totalDebt** (38.4% lender + 14.1% looper) |
| **Lido (stETH)** | stETH Accumulator | **37.8% of vault totalDebt** |
| **Morpho** | Yearn OG WETH | **9.7% of vault totalDebt** (708.89 WETH of vault shares) |
| **Curve ETH/stETH pool** | Accumulator stake/unwind, and the looper's automatic exit | Indirect. Full looper collateral is 8,267.68 stETH |
| **Lido withdrawal queue** | Accumulator unwind only | Indirect. The looper exchange has no queue fallback |

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Lido Audits (Underlying Protocol)

Lido is one of the most extensively audited LSTs in DeFi. Audits include MixBytes, Quantstamp, Sigma Prime, Statemind, Oxorio, ChainSecurity, and others. See [Lido security](https://docs.lido.fi/security/audits/) for the full list. Lido TVL is $23.66B ([DeFiLlama](https://defillama.com/protocol/lido), October 14, 2026).

### Curve ETH/stETH Pool

Audited as part of Curve's StableSwap suite. Pool address [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022).

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvWETH-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`).

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Lido (Immunefi):** active bug bounty
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

- **4 funded strategies**
  - **Spark WETH Lender** — WETH supplied to Spark Lend. Atomic withdrawal. 38.4% of totalDebt. TokenizedStrategy API 3.0.4
  - **stETH Accumulator** — WETH → ETH → stETH via Curve or Lido `submit`. Management-only unwind. 37.8% of totalDebt. TokenizedStrategy API 3.0.4
  - **wstETH/WETH Spark Looper** — wstETH collateral, WETH debt, Spark E-Mode, ~7.97x. Morpho flash loans and a Curve swap on the way out. 14.1% of totalDebt. Verified source is `LSTAaveLooper` (API 3.0.4). Etherscan flags the shared TokenizedStrategy module [`0xd377919fa87120584b21279a491f82d5265a139c`](https://etherscan.io/address/0xd377919fa87120584b21279a491f82d5265a139c) in the EIP-1967 implementation slot. That same slot value is set on the Accumulator and the Spark lender. The admin slot is zero and the verified source has no upgrade function
  - **Yearn OG WETH** — Morpho MetaMorpho vault into Morpho Blue markets. 9.7% of totalDebt
- **One strategy is leveraged** (the looper, 14.1% of totalDebt, health factor 1.063)
- **No cross-chain bridging**
- **Standard ERC-4626** deposit / withdrawal at the vault level
- **Mixed unwind** — 48.1% atomic through the default queue, 37.8% management-paced, 14.1% currently not executable
- **Vault is immutable** (Vyper minimal proxy). EIP-1967 implementation and admin slots are zero

## Historical Track Record

- **Vault deployed:** March 12, 2024 ([tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~31 months** in production
- **TVL:** 7,341.17 WETH (~$17.86M). Thirty days earlier, at block [25977509](https://etherscan.io/block/25977509), `totalAssets()` was 8,030.49 WETH
- **PPS:** 1.055753. Trailing 30-day growth annualizes to 2.12% after fees
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy history:** Between May 11 and July 22, 2026 the vault rotated out of Morpho Gauntlet WETH Prime and the old Spark lender ([`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15)) into the current four strategies. The old Spark lender still shows 0.156 WETH of residual `totalAssets` and zero vault debt. No strategy was added or revoked between July 20 and this snapshot
- **Yearn V3 track record:** V3 framework live since May 2024 (~29 months). No V3 vault exploits. Protocol TVL is $198.7M ([DeFiLlama](https://defillama.com/protocol/yearn-finance), October 14, 2026)
- **Lido withdrawal #121758:** still finalized and claimed. `getWithdrawalStatus([121758])` returns 1,000 stETH, owner = the Accumulator, `finalized = true`, `claimed = true`. `pendingRedemptions` on the Accumulator is 0

**Lido track record:** $23.66B TVL, longest-running LST, Shapella-enabled withdrawals. At this snapshot the withdrawal queue is not backlogged: 12,422.33 stETH is unfinalized across request ids 138692–138734, and the oldest open request (0.250 stETH) was submitted at 09:51 UTC, 8.7 hours before the block.

## Funds Management

yvWETH-1 is fully deployed (0 idle). Spark Lend is the largest venue at 52.5% of debt, Lido stETH is 37.8%, and Morpho is 9.7%. Strategy `current_debt` sums to `totalDebt()`.

### Strategy 1: Spark WETH Lender (38.4% of vault totalDebt)

**Contract:** [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151)

The strategy supplies WETH to **Spark Lend** and holds 2,822.94 spWETH ([`0x59cD1C87501baa753d0B5B5Ab5D8416A45cD71DB`](https://etherscan.io/address/0x59cD1C87501baa753d0B5B5Ab5D8416A45cD71DB)). The Spark WETH reserve has 640,988 WETH supplied and 137,250 WETH available (78.6% utilization). `getReserveData` reports 1.39% supply APR and 1.86% variable borrow APR. `maxWithdraw(vault)` equals the strategy's `totalAssets()` (2,822.94 WETH), so the vault's 2,821.68 WETH debt is inside available liquidity.

`management()` is Brain. `keeper()` is yHaaSRelayer. Strategy `performanceFee()` is 0. Last report: October 5, 2026. `max_debt` is 15,000 WETH.

### Strategy 2: stETH Accumulator (37.8% of vault totalDebt)

**Contract:** [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)

The contract (`Strategy.sol` / `BaseLSTAccumulator.sol`, verified on Etherscan) implements:

**Stake path:**

1. WETH unwrapped to ETH at the strategy contract
2. ETH staked via one of two routes, selected per call:
   - **Curve ETH/stETH pool** ([`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022)) — used when Curve quotes a better-than-1:1 rate
   - **Lido `submit{value}()`** — guaranteed 1:1 minting

**Unwind path (manual, management-only — there is no auto-unwind on user withdrawal):**

| Method | Mechanic | Latency |
|--------|----------|---------|
| `manualSwapToAsset()` | Sells stETH → ETH via Curve with a min-out parameter | Immediate |
| `initiateLSTWithdrawal()` | Queues stETH in the Lido withdrawal queue ([`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)) for guaranteed 1:1 redemption | Next Lido oracle report under the current queue |
| `manualClaimWithdrawals()` | Claims finalized Lido withdrawals back to ETH | Immediate after finalization |

The strategy holds 2,775.97 stETH and 0 WETH. `availableWithdrawLimit(vault)` is 0. `pendingRedemptions` is 0. `estimatedTotalAssets()` is 2,775.97 WETH against 2,774.69 WETH of vault debt (about 1.28 WETH unreported). Activated April 16, 2026. Last report October 9, 2026. `max_debt` is 10,000 WETH. `management()` is Brain. `keeper()` is yHaaSRelayer.

### Strategy 3: wstETH/WETH Spark Looper (14.1% of vault totalDebt)

**Contract:** [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121)

Verified source is `LSTAaveLooper`, a Yearn V3 TokenizedStrategy (API 3.0.4). It supplies wstETH to Spark Lend and borrows WETH in E-Mode category 1, then loops. It is not in the default queue. Loose balances of WETH, stETH, and wstETH are 0. `pendingRedemptions` is 0.

| Parameter | Value at block 26192556 |
|-----------|------------------------|
| `balanceOfCollateral()` | 6,633.6881 wstETH |
| wstETH `stEthPerToken()` | 1.2463165174 → **8,267.6750 stETH** of oracle collateral |
| `balanceOfDebt()` | 7,230.1984 WETH |
| Equity (`totalAssets()`) | 1,036.32 WETH |
| `getCurrentLeverageRatio()` / target / max | **7.969x** / 8.0x / 8.5x |
| `getCurrentLTV()` | 87.45% |
| `leverageBuffer()` | 1% |
| Spark `getUserAccountData` health factor | **1.06345** |
| E-Mode LTV / liquidation threshold | 92% / 93% (`getUserEMode` = 1) |
| `maxFlashloan()` | 15,942.93 WETH (debt is 7,230.20 WETH) |
| `slippage()` | 2 bps |
| `slippagePeriodLossLimit()` | 1.645 WETH |
| Last report | October 12, 2026 |
| `max_debt` | 2,000 WETH |

**Oracles.** Spark's price oracle is [`0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9`](https://etherscan.io/address/0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9). wstETH is priced by [`WSTETHExchangeRateOracle`](https://etherscan.io/address/0xE98d51fa014C7Ed68018DbfE6347DE9C3f39Ca39) and WETH by [`Chronicle_Aggor_ETH_USD`](https://etherscan.io/address/0x2750e4CB635aF1FCCFB10C0eA54B5b5bfC2759b6). The wstETH/WETH price ratio equals `stEthPerToken`. A secondary-market stETH discount does not move the health factor. Liquidation needs the wstETH exchange rate to fall about **6.0%** against the WETH debt (`1 - 1/1.06345`). A 1% exchange-rate drop costs about 8% of looper equity. Loss is bounded by that equity, 14.1% of vault debt.

**Carry.** From block 25977509 to the snapshot, `stEthPerToken` rose from 1.24402131 to 1.24631652, which is **2.24% APR**. Spark's WETH variable borrow rate at the snapshot is **1.86% APR**. Collateral times the staking APR, divided by debt, is a **2.57%** borrow rate. Below that, carry is positive. At the snapshot rates it is about **4.9% APR** on looper equity. Carry turns negative if the borrow rate stays above ~2.57% without a delever.

**Controls.** `management()` is Brain. `setSlippage`, `setLeverageParams`, and `setEModeCategory` are `onlyManagement`. While the strategy is not shut down, `setSlippage` accepts any value below `MAX_SLIPPAGE` (100 bps). `GOVERNANCE()` is the 7-day timelock, and `setExchange` is `onlyGovernance`. `emergencyAdmin()` is Security. `keeper()` is yHaaSRelayer. Strategy `performanceFee()` is 0.

**Withdrawal.** `availableWithdrawLimit(vault)` returns 1,037.48 WETH and `maxWithdraw(vault)` returns 1,036.32 WETH. Neither call quotes the exchange. The exit flash-borrows WETH from Morpho, repays Spark, withdraws wstETH, and swaps through [`WETHWstETHExchange`](https://etherscan.io/address/0x706AA50385C51596b6d9cBcf97645C6a98940c03). That exchange's `STABLE_SWAP_STETH()` is the [Curve ETH/stETH pool](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022). `governance()` on the exchange is Brain. The path unwraps wstETH and sells stETH. It has no Lido-queue fallback.

**Executable-exit checks at block [26192556](https://etherscan.io/block/26192556):**

| Check | Result |
|-------|--------|
| Curve `get_dy(1, 0, 1e18)` | 0.999789 ETH per stETH (**2.11 bps**) |
| Curve `get_dy(1, 0, 8,267.675 stETH)` | 8,260.538 ETH (**8.63 bps**). Pool balances: 18,280.99 ETH and 20,193.87 stETH |
| Looper `withdraw(assets, vault, vault, 10000)` via `eth_call`, sender = vault | 1, 10, 100, 500 WETH and full `maxWithdraw` (1036317043976196252406 wei) each revert with `!slippage` |
| Vault `update_debt(looper, 0, 10000)` via `eth_call`, sender = Brain | Reverts with `!slippage` |

The 2 bps limit is already tighter than the 1 stETH Curve quote, so size is not what blocks the exit. Brain can raise `slippage()` toward 99 bps; that would accept the swap loss, amplified against equity. **TODO:** successful exit size after a slippage change or a tighter Curve quote. Do not count `maxWithdraw()` as executable liquidity until a pinned-block withdraw succeeds.

### Strategy 4: Yearn OG WETH (9.7% of vault totalDebt)

**Contract:** [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC)

This address is the Morpho MetaMorpho vault (`MORPHO()` = [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)), and it is also the Yearn strategy. Its own `totalAssets()` is **737.91 WETH**, the whole MetaMorpho vault. yvWETH-1 holds 681.03 shares. `convertToAssets` of those shares is **708.89 WETH**, 96.1% of the MetaMorpho vault, against 708.87 WETH of `current_debt` (0.019 WETH unreported). `maxWithdraw(yvWETH-1)` returns the same 708.89 WETH.

- `owner()` = Security, 4-of-7
- `guardian()` = ySafe, 6-of-9
- `curator()` = [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51), 2-of-3. Owner set and threshold match block 25574582
- `timelock()` = 3 days. `fee()` = 5%
- Market weights from the Morpho API at this refresh: wstETH/WETH 96.5% LLTV **49.2%**, weETH/WETH 94.5% LLTV **32.1%**, wstETH/WETH 94.5% LLTV **18.6%** (labels sum to 99.9%)

The weETH market is WETH lent against ether.fi weETH collateral. It is about 3.1% of yvWETH debt (32% of the 9.7% Morpho sleeve). Activation May 24, 2026. Vault `last_report` for this strategy is October 14, 2026. `max_debt` is 15,000 WETH.

### Accessibility

- **Deposits:** Permissionless ERC-4626, up to the 15,000 WETH `deposit_limit`
- **Withdrawals:** ERC-4626 through the default queue. 48.1% is atomic (Yearn OG WETH + Spark). 37.8% waits on Accumulator management. 14.1% is the looper, outside the queue, and simulated exits revert with `!slippage`. See Liquidity Risk
- **No cooldown** at the vault level
- **Fees:** accountant default config on this vault: `managementFee` 0, `performanceFee` 1000 (10%), `refundRatio` 0, `maxFee` 10000, `maxGain` 20000, `maxLoss` 1 (1 bp). `feeManager()` is Brain, unchanged since block 25574582. Brain can change those rates up to the accountant caps (`MANAGEMENT_FEE_THRESHOLD` 200 = 2%, `PERFORMANCE_FEE_THRESHOLD` 5000 = 50%) without the strategy timelock. Replacing the accountant contract on the vault is the timelocked `ACCOUNTANT_MANAGER` action
- **Profit unlock:** 10 days

### Collateralization

- **Backing:** 38.4% Spark WETH supply, 37.8% Lido stETH, 14.1% leveraged wstETH/WETH on Spark, 9.7% Morpho Blue WETH loans. All onchain
- **Collateral quality:** Lido stETH ($23.66B TVL). Spark Lend and Morpho Blue are mainnet money markets. The Morpho sleeve lends WETH against wstETH and weETH
- **Leverage:** the looper runs at 7.97x, 87.45% LTV, health factor 1.063, on 14.1% of debt. The other 85.9% is unlevered stake or lend
- **Redeemability:** Accumulator stETH unwinds through Curve or the Lido queue. Spark WETH and Yearn OG WETH redeem against market liquidity. The looper's flash-loan/Curve exit reverts at the 2 bps slippage setting

### Provability

- **PPS:** ERC-4626 `convertToAssets`, algorithmic
- **Strategy value:** Accumulator reads its stETH balance. Spark lender reads spWETH. The looper reads Spark collateral and debt. Yearn OG WETH's vault debt tracks `convertToAssets` of the shares yvWETH-1 holds, not the MetaMorpho vault's full `totalAssets()`
- **Accounting lag:** `pendingRedemptions` is 0 on the Accumulator and the looper, so the in-flight Lido-withdrawal valuation path is dormant. It re-engages on `initiateLSTWithdrawal()`
- **Profit / loss:** keeper `process_report()`, unlocked over 10 days. A reported loss above the 1 bp `maxLoss` reverts until the fee manager turns the health check off
- **Debt reconciliation:** the four `current_debt` values sum to `totalDebt()` (7,341.171120267047779822 WETH)

## Liquidity Risk

| Aspect | Detail |
|--------|--------|
| Vault-level idle | 0 |
| Atomic, default queue | **3,530.55 WETH, 48.1% of debt.** Yearn OG WETH `current_debt` 708.87 + Spark `current_debt` 2,821.68. `eth_call` of `withdraw(3530549488632626798710, alchemixStrategy, alchemixStrategy, 100, [])` from the Alchemix strategy succeeded, as did a 1 WETH and a 3,000 WETH withdrawal |
| Management-paced | **37.8%.** Accumulator `availableWithdrawLimit(vault) = 0`. Curve or the Lido queue, both management-only |
| Restricted looper | **14.1%.** `maxWithdraw` returns 1,036.32 WETH. Withdrawals of 1 through the full amount, and `update_debt(looper, 0, 10000)` from Brain, revert with `!slippage` |
| Curve depth | 18,280.99 ETH + 20,193.87 stETH. 1 stETH costs 2.11 bps. The full 8,267.68 stETH looper collateral costs 8.63 bps |
| Lido queue | 12,422.33 stETH unfinalized. Oldest open request is 8.7 hours old |
| Cooldown | None at the vault. `use_default_queue()` is true |
| Holder vs immediate liquidity | Largest holder can redeem 3,734.15 WETH of value and the queue can pay 3,530.55 WETH |

**Holders** (`balanceOf` at block 26192556):

- **Alchemix `ERC4626Strategy`** [`0x8AACC947c2f4E24D2Be4CBa4498f004079F35D87`](https://etherscan.io/address/0x8AACC947c2f4E24D2Be4CBa4498f004079F35D87) — 3,536.96 shares, **50.87%** of supply, **3,734.15 WETH**. `MYT()` is mixWETH ([`0x29bcfeD246ce37319d94eBa107db90C453D4c43D`](https://etherscan.io/address/0x29bcfeD246ce37319d94eBa107db90C453D4c43D), symbol `mixWETH`). `vault()` is yvWETH-1. `owner()` is a 3-of-7 Safe ([`0xF56D660138815fC5d7a06cd0E1630225E788293D`](https://etherscan.io/address/0xF56D660138815fC5d7a06cd0E1630225E788293D)), which is also `owner()` of mixWETH. This one position is 203.60 WETH larger than atomic queue liquidity
- **Yearn yETH Recovery Vault** [`0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6`](https://etherscan.io/address/0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6) — 1,665.78 shares, **23.96%**, **1,758.65 WETH**. This is the Treasury ETH that [YIP-90](https://snapshot.org/#/s:veyfi.eth/proposal/0xe76f57663ce9311eb830ef097812702cbbb55fccbb280d254cdfc1f2c11c261a) earmarked for yETH recovery. YIP-90 keeps it unwindable via governance. It is long-horizon capital. It does not add executable exit capacity for other holders
- **StrategyRouterV3-WETH** [`0x85907b1aF27Fd04a5EFaBC0Fb7162f8690a6B82F`](https://etherscan.io/address/0x85907b1aF27Fd04a5EFaBC0Fb7162f8690a6B82F) — 438.38 shares, 6.30%, 462.82 WETH
- **WETH-2 yVault** [`0xAc37729B76db6438CE62042AE1270ee574CA7571`](https://etherscan.io/address/0xAc37729B76db6438CE62042AE1270ee574CA7571) — 365.03 shares, 5.25%, 385.38 WETH
- An EOA [`0xeb259282c361ef46074a38d2eda6fb5b93db1ee9`](https://etherscan.io/address/0xeb259282c361ef46074a38d2eda6fb5b93db1ee9) holds 2.29%. A `TreasuryVault` whose `governance()` is ySafe ([`0x93a62da5a14c80f265dabc077fcee437b1a0efde`](https://etherscan.io/address/0x93a62da5a14c80f265dabc077fcee437b1a0efde)) holds exactly 140 shares (2.01%)

**Practical picture:** 48.1% of debt can leave in one transaction. 37.8% needs Brain to sell stETH or queue a Lido withdrawal. 14.1% cannot leave through the strategy's own flash-loan path at the current Curve quote. The largest single holder cannot fully exit on the atomic path.

## Centralization & Control Risks

### Governance

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | Mask `0x3ff6`: every role except `ADD_STRATEGY_MANAGER` and `ACCOUNTANT_MANAGER` (12 of 14) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | Mask `0x3972`: `REVOKE_STRATEGY`, `QUEUE`, `REPORTING`, `DEBT`, `DEPOSIT_LIMIT`, `PROFIT_UNLOCK`, `DEBT_PURCHASER`, `EMERGENCY`. Not `MAX_DEBT` or `WITHDRAW_LIMIT` |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | `DEBT`, `MAX_DEBT`, `EMERGENCY` |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | `ADD_STRATEGY`, `REVOKE_STRATEGY`, `FORCE_REVOKE`, `ACCOUNTANT`, `MAX_DEBT` |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | `REPORTING` only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | `REPORTING` + `DEBT_MANAGER` |

Role bitmasks for these six addresses match block 25574582. No `RoleSet` events on the vault, and no `RoleGranted` or `RoleRevoked` events on the timelock, between that block and 26192556. ySafe, Brain, Security, and the curator Safe each have the same `getOwners()` set and the same `getThreshold()` as at block 25574582.

ySafe 6-of-9 signers include publicly known DeFi contributors — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig).

**Strategy-specific governance:** Accumulator unwind functions are management-only. On the looper, Brain sets leverage, the 2 bps slippage, and the E-Mode category. Swapping the looper's `exchange` contract takes the 7-day timelock. The exchange contract's own `governance()` is Brain.

**Fee governance:** swapping the accountant address is timelocked. Fee rates on the shared accountant are `onlyFeeManager`, and that address is Brain. Caps are 2% management and 50% performance. Current rates are 0% and 10%.

**Properties:**

1. **No EOA holds vault roles directly**
2. **Strategy additions and accountant replacement pass through the 7-day timelock**
3. **Self-governed timelock** — `TIMELOCK_ADMIN_ROLE` is the timelock. `DEFAULT_ADMIN_ROLE` is not held by ySafe, Brain, the timelock, or the executor
4. **Vault contract is immutable**
5. **Same governance pattern across 37+ vaults**

Timelock role holders, confirmed with `hasRole` at this block: `PROPOSER_ROLE` and `EXECUTOR_ROLE` and `CANCELLER_ROLE` are ySafe. `EXECUTOR_ROLE` is also the TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b). `CANCELLER_ROLE` is also Brain. See the appendix for the full role table.

### Programmability

- **PPS:** ERC-4626, algorithmic
- **Vault operations:** permissionless deposit / withdraw
- **Strategy reporting:** keeper
- **Debt allocation:** Debt Allocator and Brain
- **Unwind:** Accumulator exits are manual for 37.8% of debt. The looper's programmatic exit is blocked by its slippage check. That block is scored under Liquidity, not again here

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Spark Lend (Sky)** | Critical — 52.5% of debt | WETH supply market has 137,250 WETH available. The looper adds 7,230 WETH of borrow and exchange-rate liquidation risk on the 14.1% sleeve |
| **Lido (stETH)** | Critical — 37.8% of debt | $23.66B TVL. Queue is current (12,422 stETH unfinalized) |
| **Morpho** | Medium — 9.7% of debt, plus the looper's flash-loan rail | MetaMorpho sleeve, 96% owned by this vault. Flash-loan liquidity (15,943 WETH) exceeds looper debt. The exit still reverts on slippage |
| **Curve ETH/stETH** | Material exit path | 2.11 bps on 1 stETH, 8.63 bps on the looper's full collateral. Accumulator can use the Lido queue instead. The looper exchange cannot |
| **ether.fi weETH** | Low — ~3.1% of debt | Collateral in one Morpho market inside the OG WETH sleeve. The vault lends WETH. It does not hold weETH |

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Yearn V3 docs. Accumulator and looper source verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework has not been stress-tested by an exploit. $200K Immunefi bug bounty
- **V3 immutability:** a critical vault bug means a new vault and a migration
- **Strategy operations:** Brain paces Accumulator unwinds (37.8%) and sets the looper's slippage and leverage (14.1%). A health factor of 1.063 does not mean the keeper can delever: `tend` uses the same exchange and the same 2 bps check. Spark (38.4%) and Yearn OG WETH (9.7%) do not need that manual step

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvWETH-1 is in the monitored vault list:**

- **Large flow alerts** ([`protocols/yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py)) — hourly
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`) — daily
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`) — Yearn TimelockController across chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvWETH-1 Vault | [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0) | PPS, `totalAssets()`, `totalDebt()`, `totalIdle()`, `get_default_queue()`. Reconcile `totalDebt()` to strategy `current_debt` |
| Spark WETH Lender | [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151) | `totalAssets()`, `maxWithdraw(vault)`, Spark WETH available liquidity (`WETH.balanceOf` of spWETH), `isShutdown()` |
| stETH Accumulator | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | `totalAssets()`, `estimatedTotalAssets()`, `pendingRedemptions()`, `availableWithdrawLimit(vault)`, stETH balance, `isShutdown()` |
| wstETH/WETH Spark Looper | [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | `getCurrentLeverageRatio()` (target 8.0x, max 8.5x), Spark `getUserAccountData` health factor (1.063 at snapshot), `slippage()` (2 bps), `maxFlashloan()` vs `balanceOfDebt()`, simulated `withdraw` and `update_debt`. Alert when a simulated exit reverts, which it does now |
| WETHWstETHExchange | [`0x706AA50385C51596b6d9cBcf97645C6a98940c03`](https://etherscan.io/address/0x706AA50385C51596b6d9cBcf97645C6a98940c03) | `STABLE_SWAP_STETH()`, `governance()` |
| Yearn OG WETH | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | Vault share balance and `convertToAssets`. `owner` / `guardian` / `curator` / `timelock` / `fee`. Market mix |
| Spark Pool | [`0xC13e21B648A5Ee794902342038FF3aDAB66BE987`](https://etherscan.io/address/0xC13e21B648A5Ee794902342038FF3aDAB66BE987) | `getUserAccountData(looper)`, WETH `getReserveData` borrow APR, available liquidity |
| Lido stETH | [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) | Supply, pause |
| wstETH | [`0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0`](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | `stEthPerToken()`. A drop moves the looper health factor directly |
| Lido Withdrawal Queue | [`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) | `unfinalizedStETH()` (12,422.33), `getLastRequestId` vs `getLastFinalizedRequestId` (138734 vs 138691) |
| Curve ETH/stETH | [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) | `get_dy(1, 0, amount)` against the looper's 2 bps `slippage()` |
| ySafe | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | `getOwners()` / `getThreshold()` |
| Timelock | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | `getMinDelay()` (604800) |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | `getVaultConfig(vault)`, `feeManager()` |

### Critical Events to Monitor

- **PPS decrease** outside an explicit loss report
- **Debt reconciliation** — `totalDebt()` versus the sum of strategy `current_debt` (matched at this snapshot)
- **Allocation** — Spark combined is 52.5%, above the old 50% trigger. Reassess if it breaks 70% or falls under 35%, if stETH breaks 60%, or if the looper breaks 25%
- **Looper exit** — any simulated `withdraw` or `update_debt` that still reverts `!slippage`, a `slippage()` change, or a 1 stETH Curve quote wider than `slippage()`
- **Looper health** — health factor below 1.04, leverage above 8.5x, `stEthPerToken` decrease, or WETH borrow APR above ~2.57% for a sustained period
- **Lido queue** — `unfinalizedStETH()` well above 12,422, or an open request older than 7 days
- **`pendingRedemptions` staying above 0** after the expected Lido finalization
- **Strategy additions** — `StrategyChanged`. None since July 20
- **ySafe / Brain / Security owner set or threshold**
- **Accountant `getVaultConfig`** — management fee above 0, performance fee above 1000, or `maxLoss` moved
- **Yearn OG WETH** `owner`, `guardian`, `fee`, or a market outside wstETH/WETH and weETH/WETH

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | Vault | PPS | Every 6 hours |
| `totalAssets()` / `totalDebt()` / `totalIdle()` | Vault | TVL and deployment | Daily |
| `get_default_queue()` | Vault | Which strategies a user withdraw can hit | Daily |
| `strategies(strategy).current_debt` | Vault | Allocation | Daily |
| `availableWithdrawLimit(vault)` | Each strategy | Advertised withdrawable assets. On the looper this overstates executable size | Daily |
| `slippage()` | Looper | Per-swap limit. 2 bps at the snapshot, tighter than the 2.11 bp discount on 1 stETH | Hourly |
| `get_dy(1, 0, 1e18)` | Curve pool | stETH→ETH spot, compare with `slippage()` | Hourly |
| `getUserAccountData(looper)` | Spark Pool | Health factor | Hourly |
| `stEthPerToken()` | wstETH | Exchange rate that prices the looper | Hourly |
| `getCurrentLeverageRatio()` | Looper | Versus 8.0x target and 8.5x max | Hourly |
| `pendingRedemptions()` | Accumulator | In-flight Lido withdrawal | Daily |
| `unfinalizedStETH()` | Lido queue | Queue backlog | Daily |
| `getVaultConfig(vault)` | Accountant | Fee and `maxLoss` | Daily |
| `getThreshold()` / `getOwners()` | ySafe, Brain, Security | Signer set | Weekly |
| `getMinDelay()` | Timelock | Delay change | Weekly |

## Risk Summary

### Key Strengths

- **Yearn V3 vault:** three audits, ~31 months on this vault, ~29 months of V3 with no V3 exploit. The vault proxy is immutable
- **Governance unchanged since July 20, 2026:** ySafe 6-of-9, Brain 3-of-8, Security 4-of-7, 7-day timelock. Owner sets match. No role or strategy-set changes in that window
- **48.1% atomic liquidity** from Spark WETH and Yearn OG WETH, and a simulated full withdrawal of that amount succeeded
- **Debt reconciles** to the wei. `pendingRedemptions` is 0. Lido's open queue is a few hours old, not a backlog
- **Looper liquidation is exchange-rate based.** A Curve discount does not move the health factor. Loss is capped at looper equity
- **No cross-chain bridging**

### Key Risks

- **Spark is 52.5% of debt**, across an unlevered lender and an ~8x looper. That is the largest venue
- **Looper exit is blocked.** `slippage()` is 2 bps. Curve is 2.11 bps on 1 stETH and 8.63 bps on the full 8,267.68 stETH collateral. Sampled withdrawals and `update_debt(looper, 0)` revert with `!slippage`. `maxWithdraw` overstates executable liquidity. Brain can raise the limit; that realizes the swap loss
- **Looper leverage.** Health factor 1.063 on 14.1% of debt. A ~6% drop in `stEthPerToken` liquidates it. A 1% drop costs ~8% of looper equity
- **Accumulator is management-paced** for 37.8% of debt
- **Holder concentration.** One Alchemix strategy holds 50.9% of shares (3,734.15 WETH), more than the 3,530.55 WETH the queue can pay now. The yETH Recovery Vault holds another 24.0%

### Critical Risks

- A Lido failure hits the 37.8% Accumulator sleeve and the looper's wstETH collateral. A Spark failure hits 52.5% of debt, including the leveraged sleeve. The looper cannot be delevered on the current Curve quote, so a fast exchange-rate drop does not have a working automatic unwind. All critical gates still pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** category scores in this report are recorded to one decimal. The weighted sum is recorded to two decimal places, rounded down (1.595 → 1.59).

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 firms. Lido, Spark, Morpho, and Curve are established protocols with public audits. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 plus onchain balances for all four strategies. Strategy debt sums to `totalDebt()`. ✅ PASS
- [x] **Total centralization** — 6-of-9 ySafe and a 7-day timelock on strategy additions. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits. Lido, Spark, Morpho, Curve: established audit histories |
| Bug bounty | $200K Yearn Immunefi; Lido bounty active |
| Production history | **~31 months** (March 12, 2024). V3 framework ~29 months |
| TVL | 7,341.17 WETH (~$17.86M). Deposit limit 15,000 WETH |
| Security incidents | None on this vault, none on V3, none on Lido stETH |
| Strategy review | Category-1 ySec tier |

**Score: 1.5 / 5** — audited stack, multi-year production, no incidents on this vault. TVL is well under the score-1 scale band, which is why the category stays off 1.0.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | Vault is immutable. Looper has no upgrade function; EIP-1967 admin slot is zero |
| Multisig | 6-of-9 ySafe, publicly documented signers |
| Timelock | 7 days on `ADD_STRATEGY` and accountant replacement. Self-governed |
| Fee rates | Brain, as accountant `feeManager`, can change fees up to 2% management and 50% performance without that timelock. Current fees are 0% / 10% |
| Privileged roles | Split across ySafe, Brain, Security, keeper, debt allocator |
| EOA risk | No EOA holds a vault role |

**Governance Score: 1.0 / 5** — thresholds, owner sets, role masks, and timelock roles match July 20, 2026. Fee-rate authority sits with Brain inside published caps. That is an operational bound, not a new admin key.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626 |
| Vault operations | Permissionless |
| Strategy reporting | Keeper |
| Debt allocation | Debt Allocator and Brain |
| LST unwind | Management-paced for the 37.8% Accumulator. The looper's blocked exit is scored in Liquidity |

**Programmability Score: 1.5 / 5** — the vault is programmatic. Accumulator unwinds still need management for 37.8% of debt. The 48.1% atomic queue covers the rest of what users can reach.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Funded venues | Spark 52.5%, Lido 37.8%, Morpho 9.7% |
| Criticality | Spark and Lido are both large enough to matter. Morpho is the third sleeve and the looper's flash-loan venue |
| Quality | All three are top-tier mainnet protocols |

**Dependencies Score: 2.0 / 5** — three blue-chip venues. Spark crossing 50% does not add a new protocol. The single largest sleeve is 52.5%, down from the prior Lido concentration.

**Centralization Score = (1.0 + 1.5 + 2.0) / 3 = 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 38.4% Spark WETH, 37.8% stETH, 14.1% leveraged wstETH/WETH, 9.7% Morpho WETH loans |
| Collateral quality | stETH, WETH, wstETH, and a smaller weETH-collateral Morpho market |
| Leverage | 7.97x on 14.1% of debt, health factor 1.063, 93% liquidation threshold. A ~6% exchange-rate drop liquidates the sleeve. The other 85.9% is unlevered |
| Verifiability | Onchain for every sleeve |

**Score: 1.75 / 5** — assets are blue-chip and fully onchain. The looper's leverage and thin health factor sit above a plain LST or lending sleeve, and they apply to 14.1% of debt rather than the whole vault.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Onchain balances, Spark account data, and MetaMorpho `convertToAssets` |
| Exchange rate | Vault PPS is real-time |
| Reporting | Keeper, 10-day unlock, 1 bp `maxLoss` |
| LST accounting lag | Dormant (`pendingRedemptions = 0`) |
| Reconciliation | Strategy debt sums to `totalDebt()` |

**Score: 1.0 / 5**

**Funds Management Score = (1.75 + 1.0) / 2 = 1.375, recorded as 1.4**

**Score: 1.4 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Vault-level idle | 0 |
| Atomic portion | 48.1%. Full-size simulated withdraw succeeded |
| Management-paced | 37.8% Accumulator. Lido queue is not backlogged. Curve is the immediate alternative |
| Restricted portion | 14.1% looper. Advertised `maxWithdraw` reverts. `update_debt` to zero reverts |
| Holder impact | Largest holder (50.9%, 3,734.15 WETH) exceeds atomic liquidity (3,530.55 WETH) |
| Same-asset | WETH-denominated shares |

**Score: 2.5 / 5** — base 2.0 for direct WETH redemption, a working 48.1% atomic path, and a management-paced LST unwind with a live Lido queue. The rubric's **+0.5 for a mechanism that delays large exits** applies to the looper: even an authorized debt-manager call cannot recover 14.1% at this block. That restriction is not also applied in Programmability. The yETH Recovery Vault's 24% holding is long-horizon and is not treated as exit liquidity. Successful exit size after a slippage change remains TODO.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn, public, named signers |
| Vault management | Same pattern as the other category-1 vaults |
| Documentation | V3 docs, verified strategy source |
| Legal | BORG |
| Incident response | Historical V1 events, $200K Immunefi |
| Monitoring | Vault is on the hourly flow alerts |
| Unwind ops | Brain must move the Accumulator and must change looper slippage or wait on Curve before that sleeve can exit |

**Score: 1.0 / 5** — Yearn's operating pattern is unchanged. The looper's blocked delever is a position constraint, scored in Liquidity and Collateralization.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.4 | 30% | 0.420 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.595 → 1.59 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (1.59 / 5.0) — Approved with standard monitoring**

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (January 2027)
- **TVL-based:** Reassess if TVL exceeds 12,000 WETH or moves ±50% from 7,341 WETH
- **Allocation drift (from this snapshot):**
  - Spark combined (lender + looper) above 70% or below 35% of `totalDebt`
  - stETH Accumulator above 60% of `totalDebt`
  - wstETH/WETH Spark Looper above 25% of `totalDebt`
  - Yearn OG WETH share value above 20% of vault TVL
  - any new market in Yearn OG WETH outside wstETH/WETH and weETH/WETH
- **Strategy changes** at the Strategy Manager timelock ([`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73), 7-day delay): any new strategy, especially leverage, looping, or a bridge
- **Looper:**
  - health factor below 1.04, or leverage above 8.5x
  - `slippage()` changed, or a pinned-block `withdraw` / `update_debt` starts succeeding
  - WETH borrow APR sustained above 2.57%
  - `stEthPerToken` drops
  - `setExchange` proposed at the timelock
  - looper added to the default queue
- **Lido:**
  - `unfinalizedStETH()` far above 12,422, or an unfinalized request older than 7 days
  - `pendingRedemptions` on the Accumulator stays above 0 past expected finalization
  - a Lido upgrade or pause
- **Holders:** the Alchemix mixWETH strategy redeems a size that hits the Accumulator, any single holder exceeds 60% of supply, or the yETH Recovery Vault starts withdrawing
- **Incident-based:** any V3 exploit, strategy loss, or major incident at Lido, Curve, Spark, or Morpho
- **Governance-based:** ySafe, Brain, Security, or curator owner-set or threshold changes; `getMinDelay()` changed; accountant `getVaultConfig` changed; `feeManager()` changed

---

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| [May 11, 2026](https://github.com/yearn/risk-score/pull/148) | 1.5 | Initial assessment. 3 funded strategies (Morpho ~71%, stETH ~25%, Spark ~4%). 6-of-9 ySafe, 7-day timelock, immutable vault. Minimal Risk tier. |
| [July 22, 2026](https://github.com/yearn/risk-score/pull/335) | 1.49 | Reassessment. Strategy mix: stETH Accumulator (~58%), Spark WETH Lender (~28%), wstETH/WETH Spark Looper (~11%, not in the default queue), Yearn OG WETH. Strategy debt reconciles to totalDebt (~8,927 WETH). Governance unchanged. Recorded score 1.49 (Minimal Risk). |
| October 14, 2026 | 1.59 | Reassessment at block 26192556. TVL 7,341.17 WETH (~$17.86M). Spark WETH Lender 38.4%, stETH Accumulator 37.8%, looper 14.1% at 7.97x (HF 1.063), Yearn OG WETH 9.7% measured from share value. Looper withdrawals and `update_debt` to zero revert with `!slippage` (2 bps vs 2.11 bps on 1 stETH). Largest holder is the Alchemix mixWETH strategy at 50.9%. Governance owner sets and role masks match July 20. Collateralization 1.5 → 1.75, Funds Management 1.3 → 1.4, Liquidity 2.0 → 2.5. Low Risk. |

---

## Appendix: Contract Architecture

Snapshot at block [26192556](https://etherscan.io/block/26192556) (October 14, 2026, 18:32:35 UTC).

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER                                  │
│                                                                       │
│  ┌────────────────────────────────────────┐                          │
│  │  yvWETH-1 (v3.0.2)                    │                          │
│  │  ERC-4626, immutable Vyper proxy       │                          │
│  │  0xc564…dDB0                           │                          │
│  │                                        │                          │
│  │  TVL: 7,341.17 WETH (~$17.86M)         │                          │
│  │   ├── 0 idle                           │                          │
│  │   ├── 2,821.68 Spark WETH (38.4%)      │                          │
│  │   ├── 2,774.69 stETH Accumulator (37.8%)│                         │
│  │   ├── 1,035.94 wstETH/WETH Looper (14.1%)│                        │
│  │   └── 708.87 Yearn OG WETH (9.7%)      │                          │
│  └─────────────────┬──────────────────────┘                          │
│                    │                                                  │
│   Queue: Accumulator → Yearn OG WETH → Spark. Looper not queued.    │
│   Atomic queue capacity: 3,530.55 WETH (48.1%), simulated OK.       │
│                                                                       │
│ ┌──────────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐│
│ │ stETH Accumulator    │ │ Spark WETH   │ │ wstETH/WETH  │ │Yearn OG││
│ │ 0x470e…7435          │ │ Lender       │ │ Spark Looper │ │WETH    ││
│ │                      │ │ 0xfca3…0151  │ │ 0x68A1…0121  │ │0xE893…││
│ │ 2,774.69 WETH (37.8%)│ │              │ │              │ │        ││
│ │ availableWithdraw = 0│ │ 2,821.68 WETH│ │ 1,035.94 WETH│ │708.87  ││
│ │ Unwind (mgmt-only):  │ │ (38.4%)      │ │ (14.1%)      │ │(9.7%)  ││
│ │  Curve or Lido queue │ │ Atomic Spark │ │ 7.97x HF 1.063│ │Atomic  ││
│ │ pendingRedemptions=0 │ │ supply       │ │ exits revert │ │Morpho  ││
│ │                      │ │              │ │ !slippage    │ │708.89  ││
│ └──────────────────────┘ └──────────────┘ └──────────────┘ └────────┘│
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          UNDERLYING                                   │
│  Spark Pool 0xC13e…E987     Curve ETH/stETH 0xDC24…7022              │
│  640,988 WETH supplied      18,281 ETH / 20,194 stETH                │
│  137,250 WETH available     2.11 bps on 1 stETH                      │
│                                                                      │
│  Lido stETH + withdrawal queue 0x889e…F9B1                           │
│  12,422 stETH unfinalized, oldest open request 8.7 hours             │
│                                                                      │
│  Looper exchange 0x706A…0c03 → Curve (no Lido-queue fallback)        │
│  Morpho flash loans 15,943 WETH available to the looper              │
│                                                                      │
│  Yearn OG WETH markets: wstETH/WETH 49.2% + 18.6%, weETH/WETH 32.1%  │
└──────────────────────────────────────────────────────────────────────┘
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73). `getMinDelay() = 604800` (7 days). `hasRole` at block 26192556. No `RoleGranted` or `RoleRevoked` since block 25574582.

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | Not held by ySafe, Brain, the timelock, or the executor | — | `hasRole` is false for each |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | Sole proposer among the checked set |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper Brain can call |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-8 Safe | Cancel pending proposals |

To shorten the delay, ySafe must propose `updateDelay()`, wait 7 days during which Brain or ySafe can cancel, then execute.
