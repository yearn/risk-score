# Protocol Risk Assessment: Yearn — yvWETH-1

- **Assessment Date:** May 11, 2026 (Updated: September 28, 2026)
- **Token:** yvWETH-1 (WETH-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0)
- **Final Score: 1.52/5.0**

## Overview + Links

yvWETH-1 is a **WETH-denominated Yearn V3 vault** (ERC-4626) that deploys deposited WETH into yield strategies on Ethereum mainnet. At the September 28, 2026 snapshot the vault is **100% deployed** (0 WETH idle; total TVL ~7,249 WETH). Four strategies hold debt: the **Spark WETH Lender** holds ~2,943 WETH current_debt (40.6% of totalDebt), the **stETH Accumulator** ~2,771 WETH (38.2%), the **wstETH/WETH Spark Looper** ~1,034 WETH (14.3%), and **Yearn OG WETH** (a Morpho MetaMorpho vault) ~501 WETH (6.9%). All other historically attached strategies are revoked with zero debt.

The vault's `totalDebt()` (7,248.82 WETH) fully reconciles with strategy debt: Spark WETH Lender (2,943.04) + stETH Accumulator (2,771.26) + wstETH/WETH Spark Looper (1,033.63) + Yearn OG WETH (500.89) = 7,248.82 WETH (100% of totalDebt).

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting WETH deposits, issuing yvWETH-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Funded strategies (4 total; 3 in default queue):**
  - **Spark WETH Lender** ([`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151)) — 2,943.04 WETH current_debt (40.6% of totalDebt; 2,943.37 WETH strategy totalAssets).
  - **stETH Accumulator** ([`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)) — 2,771.26 WETH current_debt (38.2% of totalDebt; 2,773.25 WETH strategy totalAssets, held entirely as stETH)
  - **wstETH/WETH Spark Looper** ([`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121)) — 1,033.63 WETH current_debt (14.3% of totalDebt; 1,034.40 WETH strategy totalAssets). An `LSTAaveLooper` Yearn V3 TokenizedStrategy (API 3.0.4) that supplies wstETH as collateral and borrows WETH on Spark Lend in the ETH-correlated E-Mode at **~8x target leverage** (87.5% LTV, health factor 1.063). **Not in the default queue** but holds active debt.
  - **Yearn OG WETH** ([`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC)) — 500.89 WETH current_debt (6.9% of totalDebt; the vault's shares are worth 501.08 WETH, 94.5% of the MetaMorpho vault's 530.46 WETH totalAssets). This is a **Morpho MetaMorpho vault** (confirmed by `MORPHO()` returning [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)). Listed at https://app.morpho.org/ethereum/vault/0xE89371eAaAC6D46d4C3ED23453241987916224FC/yearn-og-weth
- **Withdrawal mechanics:** The stETH Accumulator (38.2% of totalDebt) **does not auto-unwind on user withdrawal** — `availableWithdrawLimit()` returns only the strategy's loose WETH balance (0 at the snapshot). Redemptions touching the Accumulator portion are management-paced (manual unwind via Curve or the Lido withdrawal queue). The default queue can serve ~3,444 WETH (47.5% of TVL) atomically from the Spark WETH Lender and Yearn OG WETH. The looper can fully delever through a Morpho flash loan (`maxWithdraw` = full 1,034.40 WETH), but because it is outside the default queue and `use_default_queue = true`, its debt is reachable only after the Debt Allocator or Brain moves it with `update_debt`.
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (September 28, 2026, snapshot at block [26078406](https://etherscan.io/block/26078406), hash `0xdad743cbc7789b3716b62ac1ed046849e3b93fa247ac84602e7b8e75d2e1890e`, timestamp 1790628071 = 20:41 UTC):**

- **TVL:** 7,248.82 WETH (~$19.43M at ETH/USD = $2,680.51, [Chainlink ETH/USD feed](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419))
- **Total Supply:** 6,871.65 yvWETH-1
- **Price Per Share:** 1.054887 WETH/yvWETH-1 (~5.5% cumulative appreciation over ~30 months, ~2.1% annualized; +0.39% between July 22 and September 28, 2026)
- **Total Debt:** 7,248.82 WETH (100% deployed)
- **Total Idle:** 0 WETH (`minimum_total_idle = 0`)
- **Deposit Limit:** 15,000 WETH (no deposit or withdraw limit module)
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee (Accountant `getVaultConfig`)

**Lido withdrawal queue status:** the Accumulator has no outstanding Lido withdrawal requests (`getWithdrawalRequests(accumulator) = []`) and `pendingRedemptions = 0` — the accounting-lag mechanism is **dormant**. The earlier request #121758 is finalized and claimed.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Lido Documentation](https://docs.lido.fi/)
- [Lido Security](https://docs.lido.fi/security/audits/)
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
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Single instance for all category-1 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — holds 12 of 14 vault roles |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe — DEBT, MAX_DEBT, EMERGENCY |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** for strategy additions and accountant changes. Self-governed |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) |
| Vault Original (v3.0.2) | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) |

### Active Strategies (4 total; 3 in default queue)

| # | Strategy | Name | Current Debt (WETH) | Pct of TotalDebt | Strategy totalAssets (WETH) | In Queue? |
|---|----------|------|--------------------:|-----------:|----------------------------:|-----------|
| 1 | [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151) | **Spark WETH Lender** | **2,943.04** | **40.6%** | 2,943.37 | YES |
| 2 | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | **stETH Accumulator** | **2,771.26** | **38.2%** | 2,773.25 | YES |
| 3 | [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | **wstETH/WETH Spark Looper** | **1,033.63** | **14.3%** | 1,034.40 | NO |
| 4 | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | Yearn OG WETH (Morpho MetaMorpho) | 500.89 | 6.9% | 501.08 (vault's share of 530.46) | YES |

Default queue order: stETH Accumulator → Yearn OG WETH → Spark WETH Lender (`get_default_queue()`, `use_default_queue = true`).

### Strategy Protocol Dependencies

| Protocol | Strategy | Known Allocation |
|----------|----------|-----------------:|
| **Spark Lend (Sky)** | Spark WETH Lender + wstETH/WETH Spark Looper | **54.9% of vault totalDebt** (40.6% lender + 14.3% looper equity; the looper carries ~8,260 WETH of wstETH collateral against ~7,224 WETH of Spark WETH debt) |
| **Lido (stETH / wstETH)** | stETH Accumulator; looper collateral | **38.2% direct** (Accumulator) + looper's leveraged wstETH position (14.3% equity) |
| **Morpho** | Yearn OG WETH (MetaMorpho vault); looper flash-loan source | 6.9% of vault totalDebt, supplied to wstETH/WETH (94.5% and 96.5% LLTV) and weETH/WETH (94.5% LLTV) markets |
| **Curve ETH/stETH pool** | stETH Accumulator (stake / unwind path) | Indirect dependency |
| **Lido withdrawal queue** | stETH Accumulator (unwind path) | Indirect dependency |

Spark Lend is the largest venue at ~55% of totalDebt across two strategies. Lido stETH is the largest single strategy (38.2%) and also underlies the looper's collateral and the Morpho wstETH/WETH markets.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Lido Audits (Underlying Protocol)

Lido is one of the most extensively audited LSTs in DeFi. Audits include MixBytes, Quantstamp, Sigma Prime, Statemind, Oxorio, ChainSecurity, and others. See [Lido security](https://docs.lido.fi/security/audits/) for the full list.

### Curve ETH/stETH Pool

Audited as part of Curve's StableSwap suite. Pool address [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022).

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvWETH-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`, confirmed at block 25574582), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Lido (Immunefi):** active bug bounty
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

- **4 funded strategies** at the snapshot
  - **Spark WETH Lender** — pipeline: WETH → Spark Lend supply. Atomic withdrawal. 40.6% of totalDebt
  - **stETH Accumulator** — pipeline: WETH → ETH (unwrap) → stETH (Curve or Lido `submit`). Two hops; 38.2% of totalDebt
  - **wstETH/WETH Spark Looper** — pipeline: WETH → wstETH (swap via the `WETHWstETHExchange` contract [`0x706AA50385C51596b6d9cBcf97645C6a98940c03`](https://etherscan.io/address/0x706AA50385C51596b6d9cBcf97645C6a98940c03)) → Spark Lend collateral → borrow WETH, with Morpho flash loans used to lever and delever. ~8x leverage on 14.3% of totalDebt
  - **Yearn OG WETH** — Morpho MetaMorpho vault; WETH supplied to three Morpho Blue markets. Atomic withdrawal subject to Morpho market liquidity. 6.9% of totalDebt
- **One strategy uses high leverage** (wstETH/WETH Spark Looper, ~8x, 14.3% of totalDebt). The other three strategies use simple stake / lend patterns
- **No cross-chain bridging**
- **Standard ERC-4626** deposit / withdrawal at the vault level
- **Mixed unwind pattern** — the stETH Accumulator (38.2%) requires management-paced unwind; the Spark WETH Lender (40.6%) and Yearn OG WETH (6.9%) are atomic through the default queue; the looper (14.3%) can delever atomically via Morpho flash loan but sits outside the default queue
- **Vault is immutable** (non-upgradeable Vyper minimal proxy). The strategies are Yearn V3 TokenizedStrategies that delegate to the constant `TokenizedStrategy` implementation [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c); the EIP-1967 slot is written only for explorer display, and there is no upgrade path

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~30 months** in production
- **TVL:** 7,248.82 WETH (~$19.43M) at September 28, 2026. Onchain `totalAssets()` samples: 8,927 WETH (July 22, 2026), 7,803 WETH (August 7), 7,945 WETH (September 1), 7,048 WETH (September 17), 7,249 WETH (September 28)
- **PPS trend:** 1.000000 → 1.054887 (~5.5% cumulative return over ~30 months, ~2.1% annualized). PPS rose monotonically across the July–September samples (1.050772 → 1.054887)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management. Both Aave V3 strategies were revoked on May 1, 2026; Yearn OG WETH was added on May 24, 2026; the Morpho Gauntlet WETH Prime Compounder [`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7) (then ~71% of debt) was revoked on May 25, 2026; and on June 26, 2026 the current Spark WETH Lender and wstETH/WETH Spark Looper were added and the old Spark WETH Lender [`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15) was revoked. No `StrategyChanged` events occurred between June 26 and September 28, 2026; debt was reallocated among the four strategies, with the stETH Accumulator falling from 5,212 WETH (July 22) to 2,771 WETH (September 28) and its `max_debt` set to 10,000 WETH
- **Yearn V3 track record:** V3 framework live since May 2024 (~28 months). No V3 vault exploits

**Lido track record:** $20B+ TVL, longest-running LST, Shapella enabled withdrawals (June 2023). Curve stETH/ETH peg has been stable post-Shapella with brief periods of slight discount during stress events.

## Funds Management

yvWETH-1 is **100% deployed** at the snapshot (0 WETH idle). The strategy mix is: **Spark WETH Lender (40.6% of totalDebt)**, **stETH Accumulator (38.2%)**, **wstETH/WETH Spark Looper (14.3%)**, and **Yearn OG WETH (6.9%)**. All four strategies fully reconcile to totalDebt (7,248.82 WETH).

All other historically attached strategies (Morpho Gauntlet WETH Prime Compounder, the old Spark WETH Lender, and both Aave V3 variants) are revoked with zero debt and are outside vault accounting.

### Strategy 1: Spark WETH Lender (40.6% of vault totalDebt)

**Contract:** [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151)

The strategy supplies WETH to **Spark Lend** on Ethereum mainnet, earning variable-rate lending yield. It holds 2,943.60 spWETH ([`0x59cD1C87501baa753d0B5B5Ab5D8416A45cD71DB`](https://etherscan.io/address/0x59cD1C87501baa753d0B5B5Ab5D8416A45cD71DB)). The Spark WETH reserve has ~596,019 WETH supplied and ~113,944 WETH of available liquidity (~80.9% utilization; 1.49% supply APR, 1.94% variable borrow APR from `getReserveData`), so the strategy's full position is withdrawable atomically (`maxWithdraw(vault)` = 2,943.37 WETH).

- Activated: June 26, 2026; last reported September 25, 2026
- max_debt: 15,000 WETH
- Management: Brain multisig (3-of-8)

### Strategy 2: stETH Accumulator (38.2% of vault totalDebt)

**Contract:** [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)

The contract code (`Strategy.sol` / `BaseLSTAccumulator.sol`, verified on Etherscan) implements:

**Stake path:**

1. WETH unwrapped to ETH at the strategy contract
2. ETH staked via one of two routes, selected per call:
   - **Curve ETH/stETH pool** ([`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022)) — used when Curve quotes a better-than-1:1 rate
   - **Lido `submit{value}()`** — guaranteed 1:1 minting

**Unwind path (manual, management-only — there is no auto-unwind on user withdrawal):**

| Method | Mechanic | Latency |
|--------|----------|---------|
| `manualSwapToAsset()` | Sells stETH → ETH via Curve with a min-out parameter | Immediate |
| `initiateLSTWithdrawal()` | Queues stETH in the Lido withdrawal queue ([`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)) for guaranteed 1:1 redemption | 1–7 days under normal load |
| `manualClaimWithdrawals()` | Claims finalized Lido withdrawals back to ETH | Immediate after finalization |

**Strategy parameters:**
- Activated: April 16, 2026 (`activation = 1776351539`)
- Last reported: September 19, 2026 (`last_report = 1789800167`)
- max_debt: 10,000 WETH
- Holdings: 2,773.25 stETH, 0 WETH; `pendingRedemptions = 0`
- Management: Brain multisig (3-of-8) and Debt Allocator
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Strategy 3: wstETH/WETH Spark Looper (14.3% of vault totalDebt)

**Contract:** [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121)

An `LSTAaveLooper` (source verified on Etherscan) built on Yearn's `BaseLooper`, deployed as a Yearn V3 TokenizedStrategy (API 3.0.4). The address's EIP-1967 slot points to the shared `TokenizedStrategy` implementation [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c), a constant in `BaseStrategy`. It is not an upgradeable proxy. The strategy is **not in the vault's default queue** (positions 0–2 are stETH Accumulator, Yearn OG WETH, and Spark WETH Lender) but holds active debt.

**Mechanics:**
1. Vault WETH is swapped to wstETH through the `WETHWstETHExchange` contract [`0x706AA50385C51596b6d9cBcf97645C6a98940c03`](https://etherscan.io/address/0x706AA50385C51596b6d9cBcf97645C6a98940c03)
2. wstETH is supplied as collateral on Spark Lend in **E-Mode category 1 ("ETH")**: 92% LTV, 93% liquidation threshold, 1% liquidation bonus
3. WETH is borrowed against it. A Morpho Blue flash loan ([`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)) funds the lever and delever steps in one transaction

**Position at the snapshot:**

| Metric | Value |
|--------|------:|
| wstETH collateral | 6,633.69 wstETH (~8,259.57 WETH at `stEthPerToken` = 1.245095) |
| WETH debt | 7,224.17 WETH |
| Equity (`totalAssets`) | 1,034.40 WETH |
| Leverage (`getCurrentLeverageRatio`) | 7.98x (target 8.0x, max 8.5x, buffer 0.01x) |
| LTV (`getCurrentLTV`) | 87.46% |
| Spark health factor (`getUserAccountData`) | **1.063** |
| max_debt | 2,000 WETH |
| Morpho WETH flash-loan liquidity (`maxFlashloan`) | 13,140.23 WETH |

The leverage target was already 8.0x on July 22, 2026 (7.0x actual that day). It has run at ~7.98x since August.

**Liquidation risk:** Spark prices wstETH with `WSTETHExchangeRateOracle` ([`0xE98d51fa014C7Ed68018DbfE6347DE9C3f39Ca39`](https://etherscan.io/address/0xE98d51fa014C7Ed68018DbfE6347DE9C3f39Ca39)), which applies Lido's `stEthPerToken` to the ETH/USD price. WETH is priced with the same ETH/USD source ([`0x2750e4CB635aF1FCCFB10C0eA54B5b5bfC2759b6`](https://etherscan.io/address/0x2750e4CB635aF1FCCFB10C0eA54B5b5bfC2759b6)). A secondary-market stETH discount therefore does not move the health factor. Liquidation needs the wstETH exchange rate to fall ~6% against the WETH debt. That could come from a Lido slashing or oracle loss, a Spark oracle change, or WETH borrow interest compounding faster than staking yield over a long period without rebalancing. At ~8x, a 1% drop in the wstETH exchange rate costs ~8% of the looper's equity. The maximum loss is bounded by the looper's equity (~14.3% of vault TVL).

**Carry:** over the 30.05 days to the snapshot, wstETH `stEthPerToken` rose from 1.242801 (block 25863000) to 1.245095, i.e. ~2.24% APR. Spark's WETH variable borrow rate was 2.09% APR on September 1, 2026 and 1.94% APR at the snapshot. At the current position size, that is ~4.3% APR gross on looper equity. Carry turns negative if WETH borrow APR exceeds ~2.56% (collateral × staking APR ÷ debt). Sustained negative carry slowly lowers the health factor unless the keeper delevers.

**Controls:** `setExchange()` is restricted to `GOVERNANCE`, which is the 7-day Strategy Manager TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73). Leverage parameters, slippage, and E-Mode category are set by `management` (Brain 3-of-8). Emergency delever/unwind functions (`manualFullUnwind`, `manualDelever`, `manualRepay`, etc.) are callable by `emergencyAdmin` (Security 4-of-7, [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0)) and management. Keeper: [`0x706EAcfC476f46547200a73709e2EFE1522c80e3`](https://etherscan.io/address/0x706EAcfC476f46547200a73709e2EFE1522c80e3).

**Withdrawal:** `availableWithdrawLimit()` returns the full equity when Morpho's WETH balance covers the debt, which it does at the snapshot (13,140 WETH vs 7,224 WETH debt). An exit flash-borrows WETH, repays Spark, withdraws wstETH and swaps it back to WETH through the exchange contract. The exit is atomic but subject to swap slippage.

### Strategy 4: Yearn OG WETH (6.9% of vault totalDebt)

**Contract:** [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC)

A **Morpho MetaMorpho vault**, confirmed by `MORPHO()` returning [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb). Listed on Morpho's app at https://app.morpho.org/ethereum/vault/0xE89371eAaAC6D46d4C3ED23453241987916224FC/yearn-og-weth. yvWETH-1 holds 481.81 of 510.06 shares (94.5%), worth 501.08 WETH against 500.89 WETH current_debt. The MetaMorpho vault's 530.46 WETH `totalAssets()` also includes the ~5.5% held by other depositors.

| Morpho market | Collateral / LLTV | Yearn OG WETH supply | Market supply | Utilization |
|---------------|-------------------|---------------------:|--------------:|------------:|
| [`0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d`](https://app.morpho.org/ethereum/market/0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d/) | wstETH / 94.5% | 195.47 WETH (36.8%) | 14,225 WETH | 90.5% |
| [`0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e`](https://app.morpho.org/ethereum/market/0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e/) | wstETH / 96.5% | 193.11 WETH (36.4%) | 31,272 WETH | 89.2% |
| [`0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7`](https://app.morpho.org/ethereum/market/0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7/) | weETH / 94.5% | 141.88 WETH (26.7%) | 7,271 WETH | 89.3% |

The weETH market adds a small ether.fi collateral exposure (~142 WETH, ~1.8% of vault TVL through a Morpho lending position).

- MetaMorpho `owner()`: Yearn Security multisig 4-of-7 [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0)
- `curator()`: 2-of-3 Safe [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51)
- `guardian()`: Yearn ySafe 6-of-9 [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)
- MetaMorpho `timelock()`: 3 days (259,200 s); supply queue 3 markets, withdraw queue 5 markets. Supply/withdraw queues also list enabled zero-allocation markets ([`0x58e212…72284`](https://app.morpho.org/ethereum/market/0x58e212060645d18eab6d9b2af3d56fbc906a92ff5667385f616f662c70372284/) idle WETH/no-collateral, also in the supply queue; [`0x138eec…288a40`](https://app.morpho.org/ethereum/market/0x138eec0e4a1937eb92ebc70043ed539661dd7ed5a89fb92a720b341650288a40/) WBTC collateral, withdraw queue only); funded exposure remains the three tabulated markets

### Accessibility

- **Deposits:** Permissionless ERC-4626 — anyone can deposit WETH and receive yvWETH-1. Subject to 15,000 WETH deposit limit
- **Withdrawals:** ERC-4626 through the default queue (Accumulator → Yearn OG WETH → Spark WETH Lender). The stETH Accumulator (38.2%) does NOT auto-unwind — `availableWithdrawLimit()` returns only its loose WETH (0). Yearn OG WETH (6.9%) and the Spark WETH Lender (40.6%) are atomic. The looper (14.3%) is outside the default queue and needs a debt-manager `update_debt` call before users can reach it. **See the "Liquidity Risk" section below**
- **No cooldown or lock period** at the vault level
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% backing** in Spark Lend WETH supply, stETH, a leveraged wstETH/WETH Spark position, and Morpho lending positions
- **Collateral quality:** Lido stETH is the largest LST. Spark Lend and Morpho are established lending venues on Ethereum mainnet; Yearn OG WETH lends against wstETH and weETH collateral
- **High leverage on one strategy** — the wstETH/WETH Spark Looper (14.3% of totalDebt) runs at ~8x (87.5% LTV, health factor 1.063) in Spark's ETH E-Mode. Liquidation is driven by the wstETH exchange rate, not the stETH market price. A ~6% drop in the wstETH exchange rate would trigger it, and each 1% drop costs about 8% of looper equity. The other three strategies (85.7% of totalDebt) use simple stake / lend patterns with no leverage
- **Redeemability:** stETH can be unwound via Curve (subject to peg slippage; `get_dy` returned 0.9998 ETH per stETH at the snapshot) or via the Lido withdrawal queue (1–7 days under normal load, 1:1). Spark WETH Lender and Yearn OG WETH positions are redeemable against lending-market liquidity. The looper exits atomically via a Morpho flash loan and a wstETH → WETH swap

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** stETH Accumulator reads onchain stETH balance. Spark WETH Lender reads its spWETH balance. The looper reads Spark collateral and debt, pricing wstETH with the Spark oracle. Yearn OG WETH reads Morpho MetaMorpho share value. All are onchain and verifiable
- **Accounting-lag caveat (currently dormant):** when the stETH Accumulator or the looper has an in-flight Lido withdrawal (`pendingRedemptions > 0`), `_harvestAndReport()` is blocked and the in-flight portion is valued at its pre-request mark. At this snapshot `pendingRedemptions = 0` on both, so the lag is not active
- **Profit / loss:** reported by keeper via `process_report()`, locked over 10 days
- **Strategy debt reconciliation:** strategy current_debt sum (7,248.82 WETH) covers 100% of `totalDebt()` (7,248.82 WETH)

## Liquidity Risk

| Aspect | Detail |
|--------|--------|
| Vault-level idle | 0 WETH (vault is 100% deployed) |
| Atomic via default queue | 47.5% of TVL — Spark WETH Lender (2,943.37 WETH withdrawable) + Yearn OG WETH (501.08 WETH withdrawable) |
| Atomic via debt manager | 14.3% — wstETH/WETH Spark Looper (1,034.40 WETH `maxWithdraw`, delevered via Morpho flash loan); outside the default queue, so Brain or the Debt Allocator must call `update_debt` first |
| Manual-unwind portion | 38.2% — stETH Accumulator (2,771.26 WETH debt); `availableWithdrawLimit()` returns only its loose WETH (0 at this snapshot) |
| Manual unwind paths (stETH) | (a) Curve ETH/stETH (immediate, peg-dependent), (b) Lido queue (1–7 days, 1:1) |
| Curve ETH/stETH pool depth | 18,491 ETH + 20,280 stETH; `get_dy(1 stETH)` = 0.9998 ETH |
| Spark WETH available liquidity | ~113,944 WETH (~80.9% utilization) |
| Morpho markets (Yearn OG WETH) | 89–91% utilization; ~5,520 WETH combined free liquidity vs 530 WETH supplied by Yearn OG WETH |
| Holder concentration | Largest holder (Alchemix mixWETH strategy) ~52% of supply (~3,804 WETH); yETH Recovery Vault ~27% |
| Cooldown / restrictions | None at the vault level |

**Practical implications:**

- **Mixed unwind profile** — 47.5% atomic through the default queue, 14.3% atomic once moved by the debt manager, 38.2% management-paced (stETH Accumulator)
- **Lido queue can extend** under stress (large coordinated unstake events)
- **Same-asset:** vault token is WETH-denominated; no price-divergence risk on the share
- **Deposit limit:** 15,000 WETH cap vs 7,249 WETH TVL
- **Venue concentration:** Spark Lend accounts for ~55% of totalDebt across two strategies (direct lender + leveraged looper); Lido stETH (Accumulator) is 38.2%
- **Holder concentration:** from `Transfer` logs through block 26078406, the largest holder is an Alchemix `ERC4626Strategy` [`0x8AACC947c2f4E24D2Be4CBa4498f004079F35D87`](https://etherscan.io/address/0x8AACC947c2f4E24D2Be4CBa4498f004079F35D87) belonging to the "WETH Mix Yield Token" (mixWETH) vault [`0x29bcfeD246ce37319d94eBa107db90C453D4c43D`](https://etherscan.io/address/0x29bcfeD246ce37319d94eBa107db90C453D4c43D), which holds 3,606.17 shares (~52% of supply, ~3,804 WETH). The strategy's `owner()` is a 3-of-7 Safe [`0xF56D660138815fC5d7a06cd0E1630225E788293D`](https://etherscan.io/address/0xF56D660138815fC5d7a06cd0E1630225E788293D). A full exit by this one holder would exceed the ~3,444 WETH available atomically through the default queue. The next largest are the Yearn yETH Recovery Vault (1,855.26 shares, ~27%), `StrategyRouterV3-WETH` [`0x85907b1aF27Fd04a5EFaBC0Fb7162f8690a6B82F`](https://etherscan.io/address/0x85907b1aF27Fd04a5EFaBC0Fb7162f8690a6B82F) (463.29, ~7%), and WETH-2 yVault [`0xAc37729B76db6438CE62042AE1270ee574CA7571`](https://etherscan.io/address/0xAc37729B76db6438CE62042AE1270ee574CA7571) (163.62, ~2%)
- **Yearn Treasury / yETH recovery capital:** the **Yearn yETH Recovery Vault** [`0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6`](https://etherscan.io/address/0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6) holds 1,855.26 yvWETH-1 (~1,957 WETH, ~27% of supply). It holds the Treasury ETH (~1,600 ETH) that [YIP-90](https://snapshot.org/#/s:veyfi.eth/proposal/0xe76f57663ce9311eb830ef097812702cbbb55fccbb280d254cdfc1f2c11c261a) earmarked for the yETH recovery. YIP-90 keeps this capital "fully unwindable via governance", so it is a long-horizon holder rather than a hard lock

The stETH Accumulator's `availableWithdrawLimit()` is **deliberately limited** to the strategy's loose WETH balance, which is 0 at this snapshot. This design avoids forced sales of stETH at a discount during peg events. Redemptions from the 38.2% Accumulator portion are therefore paced by management. The Spark WETH Lender and Yearn OG WETH together cover ~3,444 WETH of immediate withdrawals.

## Centralization & Control Risks

### Governance

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles (bitmask 16374; all except ADD_STRATEGY and ACCOUNTANT) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | Bitmask 14706 (0x3972) — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY. `management` on the three TokenizedStrategies (Accumulator, Spark WETH Lender, looper) |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY (bitmask 8384). `emergencyAdmin` on the looper; `owner()` of Yearn OG WETH |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

Thresholds and owner counts, role bitmasks, the 7-day `getMinDelay()`, and Role Manager `chad()` / `getCategory(vault) = 1` were re-read at block 26078406; no pending `future_role_manager`. ySafe 6-of-9 signers include publicly known DeFi contributors — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig).

**Strategy-specific governance:** the stETH Accumulator's manual unwind functions (`manualSwapToAsset`, `initiateLSTWithdrawal`, `manualClaimWithdrawals`) are management-only. This is a strategy-level centralization point — Brain decides when to start unwinding stETH for upcoming user redemptions. Standard for LST integrations. On the looper, Brain (as `management`) sets the leverage target, slippage, and E-Mode category, while swapping the `exchange` contract requires the 7-day timelock.

**Properties (all 6 Yearn V3 risk-1 vaults):**

1. **No EOA holds vault roles directly**
2. **Strategy additions and accountant changes pass through 7-day timelock**
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself
4. **Vault contract is immutable** — Vyper minimal proxy
5. **Same governance pattern across 37+ vaults**

### Programmability

- **PPS:** ERC-4626, fully algorithmic
- **Vault operations:** permissionless deposit / withdraw on-chain
- **Strategy reporting:** automated via keeper
- **Debt allocation:** Debt Allocator (automated) + Brain (manual)
- **Off-chain inputs:** none directly to PPS or fund movement, but the LST-Accumulator unwind decisions are off-chain (management-paced)

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Spark Lend (Sky)** | High — ~55% of vault totalDebt | Spark WETH Lender (40.6%) supplies WETH; the looper (14.3% equity) borrows 7,224 WETH against wstETH in E-Mode. Spark oracle configuration (wstETH exchange-rate oracle) directly governs looper liquidation |
| **Lido (stETH / wstETH)** | Critical — 38.2% direct plus the looper's ~8x wstETH collateral | Largest LST. Shapella-enabled withdrawals work 1:1 within 1–7 days. Exchange-rate losses hit the looper at ~8x |
| **Morpho** | Low–Medium — 6.9% via Yearn OG WETH; flash-loan liquidity for the looper | MetaMorpho vault lending into wstETH/WETH and weETH/WETH markets. The looper's full exit relies on Morpho holding enough WETH for a flash loan (13,140 WETH at the snapshot) |
| **Curve ETH/stETH pool** | Medium (unwind path for 38.2%) | Used for both staking (when better than 1:1) and manual unwind |
| **Lido withdrawal queue** | Medium (unwind path for 38.2%) | 1:1 redemption, 1–7 days normal load |
| **ether.fi (weETH)** | Low — ~1.8% of TVL | Collateral in one Morpho market used by Yearn OG WETH |

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code (including `BaseLSTAccumulator.sol`) verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit. $200K Immunefi bug bounty for responsible disclosure
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault and migrating
- **Strategy-level operational risk:** Brain must pace the stETH Accumulator unwind (38.2% of totalDebt) and keep the ~8x looper within its leverage bounds via keeper `tend()` calls. The Spark WETH Lender (40.6%) and Yearn OG WETH (6.9%) provide atomic withdrawal paths

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvWETH-1 is in the monitored vault list:**

- **Large flow alerts** ([`protocols/yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py)) — runs **hourly via the automation scheduler**. Alerts on deposits / withdrawals exceeding threshold via Telegram
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`) — daily
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`) — monitors the Yearn TimelockController across multiple chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvWETH-1 Vault | [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events. **Also reconcile totalDebt against strategy debt sum** |
| stETH Accumulator | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | `totalAssets()`, `estimatedTotalAssets()`, `pendingRedemptions`, `balanceOfAsset()`, `isShutdown()`, keeper report frequency |
| Spark WETH Lender | [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151) | `totalAssets()`, `totalSupply()`, PPS, `isShutdown()`, keeper report frequency |
| wstETH/WETH Spark Looper | [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | `totalAssets()`, `getCurrentLeverageRatio()` (target 8.0x, max 8.5x), `getCurrentLTV()`, Spark `getUserAccountData()` health factor (1.063 at snapshot), `maxFlashloan()` vs `balanceOfDebt()`, `pendingRedemptions()`, `exchange()`, `isShutdown()`, tend/report frequency |
| Yearn OG WETH | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | `totalAssets()`, vault's share balance, supply/withdraw queues and market allocations, curator/owner/guardian and `timelock()` changes. Morpho MetaMorpho vault |
| Lido stETH | [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) | Total supply, exchange rate, pause state |
| Lido Withdrawal Queue | [`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) | Strategy's outstanding withdrawal request status |
| Curve ETH/stETH | [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) | stETH/ETH peg, pool depth |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **PPS decrease** — should only increase outside of explicit loss events
- **Strategy debt reconciliation** — monitor the gap between `totalDebt()` and strategy debt sum (currently fully reconciled at 100%)
- **Allocation drift** — currently 40.6% Spark lender / 38.2% stETH / 14.3% Spark looper / 6.9% Yearn OG WETH of totalDebt
- **stETH/ETH peg deviation** — affects Curve exit pricing for the 38.2% Accumulator portion (the looper's Spark liquidation uses the exchange-rate oracle, not the market peg)
- **wstETH exchange-rate decrease** (`stEthPerToken`) or Spark wstETH oracle change — directly moves the looper health factor
- **Lido withdrawal queue length** — extended queue degrades the 1:1 unwind path (affects 38.2% of totalDebt)
- **`pendingRedemptions` not draining** after expected finalization — points to stuck or slow Lido withdrawal (currently 0 at the snapshot)
- **wstETH/WETH Spark Looper health** — health factor below 1.04, leverage above the 8.5x max, Spark E-Mode parameter changes, or WETH borrow APR persistently above wstETH staking yield
- **Strategy additions / removals** — `StrategyChanged` events; new strategies should be reviewed during the 7-day timelock
- **ySafe signer / threshold changes**
- **Lido pause** — would impact stETH redemption mechanics for the 38.2% Accumulator portion

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `estimatedTotalAssets()` | Strategy | Real on-chain backing (vs `totalAssets()`) | Daily |
| `pendingRedemptions()` | Strategy | In-flight Lido withdrawal value | Daily |
| `balanceOfAsset()` | Strategy | Loose WETH available for user withdrawals | Hourly |
| Lido `getWithdrawalStatus(...)` | Lido queue | Track pending request finalization | Daily until finalized |
| Curve `get_dy(0,1,1e18)` | Curve pool | stETH/ETH spot exchange rate | Hourly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | Strategy Manager timelock | Delay change detection | Weekly |
| `getUserAccountData(looper)` | Spark Pool [`0xC13e21B648A5Ee794902342038FF3aDAB66BE987`](https://etherscan.io/address/0xC13e21B648A5Ee794902342038FF3aDAB66BE987) | Looper health factor | Hourly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by 3 top firms, ~28 months of clean V3 production. Immutable vault contract; strategies use the constant TokenizedStrategy implementation with no upgrade path
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe + 7-day self-governed timelock, re-verified at block 26078406
- **Conservative LST integration:** the stETH Accumulator's design (no auto-unwind, `pendingRedemptions` blocks reporting, peg buffer) deliberately avoids forced-sale of stETH at a discount during peg events
- **Atomic liquidity for ~48% of TVL** through the default queue (Spark WETH Lender + Yearn OG WETH), plus a further 14.3% that the debt manager can pull atomically from the looper
- **No outstanding Lido withdrawals:** accounting-lag mechanism dormant
- **Yearn recovery capital:** the Yearn yETH Recovery Vault [`0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6`](https://etherscan.io/address/0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6) holds ~27% of supply (~1,957 WETH). This is the Treasury ETH that [YIP-90](https://snapshot.org/#/s:veyfi.eth/proposal/0xe76f57663ce9311eb830ef097812702cbbb55fccbb280d254cdfc1f2c11c261a) earmarked for yETH recovery, and it is intended to stay until recovery is complete
- **Active monitoring** via Yearn's monitoring-scripts repo
- **No cross-chain bridging**

### Key Risks

- **Spark Lend concentration (~55% of totalDebt):** the direct lender (40.6%) and the looper (14.3%) both depend on Spark Lend solvency, oracle configuration, and WETH market liquidity
- **High leverage in the looper:** 14.3% of totalDebt sits in a ~8x wstETH/WETH position with a 1.063 health factor. The exchange-rate oracle removes market-depeg liquidation risk. A ~6% loss in the wstETH exchange rate, an adverse Spark oracle or E-Mode change, or prolonged negative carry could still liquidate the position. Loss is bounded by looper equity
- **Manual-unwind exposure:** 38.2% of totalDebt requires management-paced unwind via Lido queue (1–7 days normal) or Curve (peg-dependent)
- **Lido exposure:** 38.2% unlevered stETH plus the looper's leveraged wstETH collateral. A Lido slashing event would be amplified ~8x on the looper portion
- **Looper outside the default queue:** its 14.3% is not directly reachable by user withdrawals
- **Holder concentration:** one Alchemix mixWETH strategy holds ~52% of supply (~3,804 WETH), more than the ~3,444 WETH available atomically through the default queue

### Critical Risks

- A Lido stETH integrity failure is the dominant systemic tail risk. It hits the 38.2% Accumulator directly and, amplified, the 14.3% looper. A Spark Lend failure would affect ~55% of totalDebt. All gates pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.

### Critical Risk Gates

- [x] **Unverified contract source** — Vault, strategies, and TokenizedStrategy implementation are source-verified on Etherscan. ✅ PASS
- [x] **No audit** — Yearn V3 core audited by 3 top firms. Lido audited by multiple firms. Spark Lend (Sky) and Morpho are established blue-chip protocols with audit histories. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + onchain balances verifiable for all four strategies (stETH, Spark Lend supply and looper position, Morpho MetaMorpho shares). Strategy debt sum covers 100% of totalDebt. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig, 7-day timelock on critical roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Lido: multiple firms. Spark Lend and Morpho: established blue-chip protocols. |
| Bug bounty | $200K (Yearn Immunefi); Lido bounty active |
| Production history | **~30 months** (March 12, 2024). V3 framework: ~28 months |
| TVL | 7,248.82 WETH (~$19.43M). Deposit limit: 15,000 WETH |
| Security incidents | None on V3, none on Lido stETH |
| Strategy review | 12-metric ySec framework. Category-1 strictest tier |

**Score: 1.5 / 5** — strong audit coverage, ~30 months clean production, no incidents. All four strategies deploy into well-audited blue-chip venues (Lido, Spark Lend, Morpho).

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable**; strategies use the constant TokenizedStrategy implementation |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | 7-day delay on `ADD_STRATEGY`, `ACCOUNTANT`, and the looper's `setExchange()`. Self-governed |
| Privileged roles | Well-distributed across Daddy, Brain, Security, Keeper, Debt Allocator |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.0 / 5** — textbook score-1 governance per the rubric. ySafe 6-of-9, Brain 3-of-8, Security 4-of-7, and the 7-day timelock re-verified at block 26078406.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals onchain |
| Strategy reporting | Programmatic via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |
| LST unwind | **Management-paced** (manual functions) for the 38.2% Accumulator portion; Spark WETH Lender and Yearn OG WETH atomic for 47.5%; looper delevers programmatically via flash loan (14.3%) |

**Programmability Score: 1.5 / 5** — fully programmatic at the vault level. The LST Accumulator's manual unwind remains a mild factor; the looper's leverage is maintained by keeper `tend()` calls against onchain triggers.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Verified protocol count | 3 funded venues (Spark Lend ~55%, Lido 38.2% direct, Morpho 6.9%), plus Morpho flash loans for the looper |
| Criticality | Spark Lend high (~55% across two strategies, and its oracle drives looper liquidation); Lido critical (direct stETH plus levered wstETH collateral); Morpho low–medium |
| Concentration | No single venue above ~55%; Lido also underlies the looper and the Morpho wstETH markets |
| Quality | All three are top-tier DeFi protocols with established track records |

**Dependencies Score: 2.0 / 5** — three blue-chip dependencies. Spark Lend (~55%) and Lido (38.2% direct) are the two main venues. The looper couples them: it borrows on Spark against Lido-backed collateral.

**Centralization Score = (1.0 + 1.5 + 2.0) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 40.6% Spark Lend WETH supply, 38.2% stETH, 14.3% leveraged wstETH/WETH on Spark, 6.9% Morpho MetaMorpho. All onchain verifiable |
| Collateral quality | Lido stETH is top-tier. Spark Lend and Morpho are blue-chip lending venues; Morpho markets use wstETH and weETH collateral |
| Leverage | **~8x** on the looper (14.3% of totalDebt): 87.5% LTV, health factor 1.063, 93% E-Mode liquidation threshold. Priced with the wstETH exchange-rate oracle, so a stETH market depeg does not liquidate it. The other 85.7% is unlevered |
| Verifiability | Fully onchain for all four strategies |

**Score: 1.75 / 5** — high-quality, fully verifiable collateral. The looper runs ~8x leverage with a ~6% buffer against loss in the wstETH exchange rate, on 14.3% of totalDebt. That is materially more than the "moderate leverage" credited at 1.5.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | All four strategies: fully onchain via stETH balance, Spark Lend supply and collateral/debt, Morpho MetaMorpho shares |
| Exchange rate | Programmatic, real-time at the vault level |
| Reporting | Keeper-driven, 10-day profit unlock |
| LST accounting lag | Dormant at this snapshot (`pendingRedemptions = 0` on Accumulator and looper) |
| totalDebt reconciliation | Strategy debt sum (7,248.82 WETH) covers 100% of totalDebt |

**Score: 1.0 / 5** — reserves are fully transparent across all four strategies and reconcile to 100% of totalDebt.

**Funds Management Score = (1.75 + 1.0) / 2 = 1.375 → 1.4** (category averages shown/used at 1 decimal before weighting; same convention as July's 1.25 → 1.3)

**Score: 1.4 / 5** — high-quality collateral, fully transparent and verifiable onchain. The ~8x looper on 14.3% of totalDebt is the main collateral-side risk.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Vault-level idle | 0 WETH (vault is 100% deployed) |
| Atomic via default queue | 47.5% of TVL — Spark WETH Lender (40.6%) + Yearn OG WETH (6.9%) |
| Atomic via debt manager | 14.3% — looper delevers via Morpho flash loan, but is outside the default queue |
| Manual-unwind portion | 38.2% in stETH Accumulator; `availableWithdrawLimit()` returns only loose WETH (0 at this snapshot) |
| Unknown portion | 0% — fully reconciled |
| Underlying liquidity | Curve ETH/stETH ~38.8k combined balance; Lido queue 1–7 days normal load. Spark WETH ~113.9k WETH available. Morpho markets ~89–91% utilized |
| Same-asset | WETH-denominated share token |
| Withdrawal restrictions | None at vault level; effective restriction is `availableWithdrawLimit() = balanceOfAsset()` of the Accumulator strategy and the looper's absence from the default queue |
| Holder concentration | ~52% Alchemix mixWETH strategy; ~27% Yearn yETH Recovery Vault (long-horizon) |

**Score: 2.0 / 5** — the manual-unwind portion is smaller (38.2%), and 47.5% is atomic through the default queue. The score stays at 2.0 because idle is zero, the looper needs debt-manager action, the Accumulator still depends on the Lido queue or Curve, and a single holder (~52%) could request more than the atomic liquidity. The ~27% held by the yETH Recovery Vault is long-horizon capital.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. Strategy rotations in May–June 2026 and debt reallocation since show active management capability |
| Monitoring | Active hourly alerts, vault in monitored list. Strategy debt reconciliation at 100% of totalDebt |
| Strategy unwind ops | Brain must pre-position WETH for the 38.2% Accumulator portion and keep the looper within leverage bounds |

**Score: 1.0 / 5** — operational maturity remains high for the Yearn V3 infrastructure. Active monitoring, standard governance, and demonstrated management capability.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.4 | 30% | 0.420 |
| Liquidity Risk | 2.0 | 15% | 0.300 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.52 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (1.52 / 5.0) — Approved with standard monitoring**

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (December 2026)
- **TVL-based:** Reassess if TVL exceeds 12,000 WETH or changes by ±50% from 7,249 WETH
- **Allocation drift:**
  - stETH Accumulator share moves above 70% of vault totalDebt — critical concentration review
  - Spark Lend combined exposure (lender + looper) exceeds 70% of vault totalDebt (55% at this snapshot)
  - any one venue exceeds 90% of vault totalDebt
  - wstETH/WETH Spark Looper share exceeds 25% of vault totalDebt
  - Yearn OG WETH strategy totalAssets exceeds 20% of vault TVL
- **Strategy changes (`addStrategy()` proposals at the Strategy Manager TimelockController, [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73), 7-day delay):**
  - any new strategy proposed for inclusion — re-review during the 7-day timelock window
  - any new strategy with leverage, looping, cross-chain bridging, or non-blue-chip routing
- **Lido-specific:**
  - extended Lido withdrawal queue (>14 days) — degrades the 1:1 unwind path for the Accumulator portion
  - stETH/ETH peg deviation > 1% sustained — affects Curve exit pricing for the Accumulator portion
  - any decrease in wstETH `stEthPerToken` (slashing or oracle loss) — directly reduces the looper health factor
  - any Lido contract upgrade or oracle change
  - any new `initiateLSTWithdrawal()` from the Accumulator — re-engages the `pendingRedemptions` accounting-lag mechanism
- **wstETH/WETH Spark Looper-specific:**
  - looper health factor on Spark Lend drops below 1.04 (1.063 at the 8x target), or `targetLeverageRatio` / `maxLeverageRatio` raised above 8.0x / 8.5x
  - any liquidation, or a deleveraging event (forced or management-initiated)
  - `setExchange()` proposal at the 7-day timelock, change to Spark E-Mode category 1 parameters, or a change to Spark's wstETH oracle source
  - Morpho WETH flash-loan liquidity falling below the looper's WETH debt (full exit no longer atomic)
  - looper added to the default queue
- **Strategy-specific:**
  - `pendingRedemptions` failing to drain after expected Lido finalization
  - Brain unwind cadence (frequency / size of `manualSwapToAsset` and `initiateLSTWithdrawal` calls) drops materially
- **Holder-based:** the Alchemix mixWETH strategy initiates a large redemption, or any single holder exceeds 60% of supply; the yETH Recovery Vault begins withdrawing
- **Carry-based:** Spark WETH borrow APR stays above wstETH staking APR for more than 2 weeks (looper negative carry)
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Lido / Curve / Spark Lend / Morpho
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| [May 11, 2026](https://github.com/yearn/risk-score/pull/148) | 1.5 | Initial assessment. 3 funded strategies (Morpho ~71%, stETH ~25%, Spark ~4%). 6-of-9 ySafe, 7-day timelock, immutable vault. Minimal Risk tier. |
| [July 22, 2026](https://github.com/yearn/risk-score/pull/335) | 1.49 | Reassessment. Strategy mix: stETH Accumulator (59%), Spark WETH Lender (31%), Yearn OG WETH (Morpho MetaMorpho, 2%/~9% effective), wstETH/WETH Spark Looper (~11% of totalDebt; not in default queue) — an LSTAaveLooper that leverages wstETH as collateral to borrow WETH on Spark Lend, the first leveraged strategy in this vault. Strategy debt fully reconciles to 100% of totalDebt (~8,927 WETH). All strategies mapped to verified blue-chip protocols. Governance unchanged. Score returned to 1.49 (Minimal Risk). |
| [September 28, 2026](https://github.com/yearn/risk-score/pull/495) | 1.52 | Reassessment at block 26078406. TVL 7,249 WETH. Allocation: Spark WETH Lender 40.6%, stETH Accumulator 38.2%, wstETH/WETH Spark Looper 14.3%, Yearn OG WETH 6.9%. Spark Lend combined ~55% (above the prior 50% trigger). Looper verified at ~8x leverage (health factor 1.063, exchange-rate oracle) and not upgradeable. Yearn OG WETH exposure restated from share value. Holders mapped: Alchemix mixWETH strategy ~52%, yETH Recovery Vault ~27%. Governance unchanged. Collateralization 1.5 → 1.75; tier moves from Minimal to Low Risk. |

---

## Appendix: Contract Architecture

Snapshot at block [26078406](https://etherscan.io/block/26078406) (September 28, 2026).

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER                                  │
│                                                                       │
│  ┌────────────────────────────────────────┐                          │
│  │  yvWETH-1 (v3.0.2)                    │                          │
│  │  ERC-4626, immutable Vyper proxy       │                          │
│  │                                        │                          │
│  │  TVL: 7,249 WETH (~$19.43M)            │                          │
│  │   ├── 0 idle                           │                          │
│  │   ├── 2,943 Spark WETH Lender (40.6%)  │                          │
│  │   ├── 2,771 stETH Accumulator (38.2%)  │                          │
│  │   ├── 1,034 wstETH/WETH Looper (14.3%) │                          │
│  │   └──   501 Yearn OG WETH (6.9%)       │                          │
│  └─────────────────┬──────────────────────┘                          │
│                    │                                                  │
│   ┌────────────────┼──────────────────────────────────────────┐       │
│   ▼                ▼              ▼                           ▼       │
│ ┌──────────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐│
│ │ stETH Accumulator    │ │ Spark WETH   │ │ wstETH/WETH  │ │Yearn OG││
│ │                      │ │ Lender       │ │ Spark Looper │ │WETH    ││
│ │ 2,771 WETH (38.2%)   │ │ 2,943 WETH   │ │ 1,034 WETH   │ │501 WETH││
│ │                      │ │ (40.6%)      │ │ (14.3%)      │ │(6.9%)  ││
│ │ Stake: WETH→ETH→stETH│ │              │ │ ~8x, HF 1.063│ │        ││
│ │ via Curve or Lido    │ │ Atomic:      │ │ E-Mode 1     │ │Atomic: ││
│ │ Unwind (mgmt-only):  │ │ Spark Lend   │ │ Morpho flash │ │Morpho  ││
│ │  manualSwapToAsset() │ │ supply       │ │ loan exit    │ │markets ││
│ │  initiateLSTWithdr.  │ │              │ │              │ │        ││
│ │  manualClaimWithdr.  │ │              │ │ NOT in queue │ │owner:  ││
│ │ pendingRedemptions=0 │ │              │ │              │ │Security││
│ └──────────────────────┘ └──────────────┘ └──────────────┘ └────────┘│
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          UNDERLYING                                   │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Lido stETH / wstETH    │  │ Curve ETH/stETH pool   │               │
│  │ Multi-operator         │  │ Stake-on-better-quote, │               │
│  │ Shapella withdrawals   │  │ manual unwind venue    │               │
│  └────────────────────────┘  └────────────────────────┘               │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Lido Withdrawal Queue  │  │ Spark Lend WETH Market │               │
│  │ 1:1, 1–7 days normal   │  │ (Sky) WETH supply +    │               │
│  │                        │  │ wstETH E-Mode borrow   │               │
│  └────────────────────────┘  └────────────────────────┘               │
│  ┌────────────────────────┐                                           │
│  │ Morpho Blue            │                                           │
│  │ wstETH/WETH, weETH/WETH│                                           │
│  │ markets; flash loans   │                                           │
│  └────────────────────────┘                                           │
└──────────────────────────────────────────────────────────────────────┘
```

Contract addresses for every box are listed in [Contract Addresses](#contract-addresses).

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — same timelock used by 37+ Yearn V3 vaults including all six mainnet risk-1 vaults. `getMinDelay() = 604800` (7 days).

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)` at construction) |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | Sole proposer |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper: Brain (3/8) + deployer EOA can call `execute()` through it |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-8 Safe | Cancel pending proposals |

To shorten the delay, Daddy 6/9 must propose `updateDelay()`, wait 7 days during which Brain or Daddy can cancel, then execute. DEFAULT_ADMIN was never granted, so no party can self-grant PROPOSER or TIMELOCK_ADMIN to skip the flow.
