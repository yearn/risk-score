# Protocol Risk Assessment: Yearn — yvWETH-1

- **Assessment Date:** May 11, 2026 (Updated: July 22, 2026)
- **Token:** yvWETH-1 (WETH-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0)
- **Final Score: 1.5/5.0**

## Overview + Links

yvWETH-1 is a **WETH-denominated Yearn V3 vault** (ERC-4626) that deploys deposited WETH into yield strategies on Ethereum mainnet. At the July 22 snapshot the vault is **~100% deployed** (~0.28 WETH idle across a total TVL of ~8,927 WETH). The strategy mix has shifted since the May 11 assessment: **stETH Accumulator** is now the dominant strategy at ~5,212 WETH current_debt (58.4% of totalDebt), the **Spark WETH Lender** holds ~2,521 WETH current_debt (28.2%), the **wstETH/WETH Spark Looper** holds ~1,001 WETH current_debt (11.2%), and **Yearn OG WETH** holds ~193 WETH current_debt (2.2% of totalDebt; 807.41 WETH totalAssets including accumulated Morpho yield). The four previously-funded strategies — **Morpho Gauntlet WETH Prime Compounder, Spark WETH Lender (old), and both Aave V3 strategies** — have all been drained to zero debt and removed from the default queue (residual dust remains in some strategy contracts but is outside vault accounting).

The vault's `totalDebt()` (~8,927 WETH) fully reconciles with strategy debt: stETH Accumulator (5,212) + Spark WETH Lender (2,521) + wstETH/WETH Spark Looper (1,001) + Yearn OG WETH (193) = ~8,927 WETH (100% of totalDebt).

Between the May 11 snapshot and July 22, vault TVL grew from 5,333.06 WETH to ~8,927 WETH (+67%). The Morpho and old Spark strategies were fully drained (Morpho: 3,800 → 0 debt; old Spark: 215 → 0 debt). The stETH Accumulator absorbed much of the reallocation (1,316 → 5,212 current_debt). The **new Spark WETH Lender** and the **wstETH/WETH Spark Looper** were both activated June 25, 2026. **Yearn OG WETH** was activated May 22, 2026.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting WETH deposits, issuing yvWETH-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Funded strategies (4 total; 3 in default queue):**
  - **stETH Accumulator** ([`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)) — 5,212 WETH current_debt (58.4% of totalDebt; 5,212.53 WETH strategy totalAssets)
  - **Spark WETH Lender** ([`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151)) — 2,521 WETH current_debt (28.2% of totalDebt; 2,521.35 WETH strategy totalAssets). This is a new strategy deployment replacing the old Spark WETH Lender at `0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15` which has been fully drained.
  - **wstETH/WETH Spark Looper** ([`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121)) — 1,001 WETH current_debt (11.2% of totalDebt; 1,001.28 WETH strategy totalAssets). This strategy leverages wstETH as collateral to borrow WETH on Spark Lend (an Aave-fork lending market). **Not in the default queue** but holds active debt. Implementation is an LSTAaveLooper at [`0xd377919fa87120584b21279a491f82d5265a139c`](https://etherscan.io/address/0xd377919fa87120584b21279a491f82d5265a139c).
  - **Yearn OG WETH** ([`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC)) — 193 WETH current_debt (2.2% of totalDebt; 807.41 WETH strategy totalAssets including unreported Morpho lending yield). This is a **Morpho MetaMorpho vault** (confirmed by `MORPHO()` returning [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)). Listed at https://app.morpho.org/ethereum/vault/0xE89371eAaAC6D46d4C3ED23453241987916224FC/yearn-og-weth
- **Withdrawal mechanics:** The stETH Accumulator (~58% of totalDebt) **does not auto-unwind on user withdrawal** — `availableWithdrawLimit()` returns only the strategy's loose WETH balance. Larger redemptions touching the Accumulator portion are management-paced (manual unwind via Curve or the Lido withdrawal queue). The Spark WETH Lender (28.2%), wstETH/WETH Spark Looper (11.2%), and Yearn OG WETH (2.2% of totalDebt; 9.1% effective) provide withdrawal from deep Spark Lend and Morpho markets. The looper may require partial deleveraging to exit fully.
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (July 22, 2026, snapshot):**

- **TVL:** ~8,927 WETH (~$16.66M at ETH/USD = $1,865.68, [Chainlink ETH/USD feed](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419))
- **Total Supply:** 8,459.19 yvWETH-1 (approximate, from July 20 snapshot)
- **Price Per Share:** ~1.055 WETH/yvWETH-1 (~5.5% cumulative appreciation over ~28 months, ~2.4% annualized)
- **Total Debt:** ~8,927 WETH (~99.997% deployed)
- **Total Idle:** ~0.28 WETH
- **Deposit Limit:** 15,000 WETH
- **Profit Max Unlock Time:** 10 days (unchanged)
- **Fees:** 0% management fee, 10% performance fee (unchanged)

**Reallocation since May 11:** between the prior assessment and this snapshot (~72 days), Brain / Debt Allocator executed a strategy reshuffle:
- **Morpho Gauntlet WETH Prime Compounder** fully drained: 3,800.46 → 0 current_debt (62.73 WETH residual totalAssets outside vault accounting)
- **Old Spark WETH Lender** (`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`) fully drained: 215.17 → 0 current_debt (0.16 WETH dust)
- **stETH Accumulator** absorbed significant reallocation: 1,316.44 → 5,212 current_debt (+3,896 WETH)
- **New Spark WETH Lender** (`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`) deployed and added to queue: 2,521 WETH current_debt
- **wstETH/WETH Spark Looper** (`0x68A14629cb07c74259f481382fE8b6cFD8970121`) deployed June 25, 2026 (active with 1,001 WETH current_debt; not in default queue)
- **Yearn OG WETH** added to queue May 22, 2026: 193 WETH current_debt
- **Both Aave V3 strategies** remain revoked with zero debt and dust-level residual assets

**Lido withdrawal #121758 status:** remains **finalized and claimed** (`getWithdrawalStatus([121758]) = (1000 stETH, finalized=true, claimed=true)`). `pendingRedemptions = 0` on the Accumulator — the accounting-lag mechanism is **dormant**.

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
| 1 | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | **stETH Accumulator** | **5,212** | **58.4%** | 5,212.53 | YES |
| 2 | [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151) | **Spark WETH Lender** | **2,521** | **28.2%** | 2,521.35 | YES |
| 3 | [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | **wstETH/WETH Spark Looper** | **1,001** | **11.2%** | 1,001.28 | NO |
| 4 | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | Yearn OG WETH (Morpho MetaMorpho) | 193 | 2.2% | 807.41 | YES |

**Debt reconciliation:** strategy current_debt sum (5,212 + 2,521 + 1,001 + 193 = 8,927 WETH) covers 100% of `totalDebt()` (~8,927 WETH). Fully reconciled.

**Previously funded, now fully drained (`activation = 0`, `current_debt = 0` at block 25574582):**

- Morpho Gauntlet WETH Prime Compounder ([`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7)) — 62.73 WETH residual totalAssets (outside vault accounting)
- Old Spark WETH Lender ([`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15)) — 0.16 WETH dust
- Aave V3 Lido WETH Lender ([`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0)) — 0.04 WETH dust
- Aave V3 WETH Lender ([`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8)) — 0.15 WETH dust

**Current funding posture:** vault is ~100% deployed across four active strategies (~0.28 WETH idle). The stETH Accumulator dominates at ~58% of totalDebt, followed by the Spark WETH Lender (~28%), the wstETH/WETH Spark Looper (~11%), and Yearn OG WETH (~2% of totalDebt, ~9% effective with accumulated yield). The looper holds active debt but is **not in the default queue** — it will not receive new deposits via automatic allocation but can still be harvested.

### Strategy Protocol Dependencies

| Protocol | Strategy | Known Allocation |
|----------|----------|-----------------:|
| **Lido (stETH)** | stETH Accumulator | **58.4% of vault totalDebt** |
| **Spark Lend (Sky)** | Spark WETH Lender + wstETH/WETH Spark Looper | **39.4% of vault totalDebt** (28.2% lender + 11.2% looper) |
| **Morpho** | Yearn OG WETH (MetaMorpho vault) | 2.2% of vault totalDebt (193 WETH); 9.1% effective including yield (807.41 WETH totalAssets) |
| **Curve ETH/stETH pool** | stETH Accumulator (stake / unwind path) | Indirect dependency |
| **Lido withdrawal queue** | stETH Accumulator (unwind path) | Indirect dependency |

**Key changes from prior assessment:** The old Morpho Gauntlet and old Spark strategies have been replaced. The Lido dependency remains dominant at ~58% of totalDebt. Spark Lend exposure has grown to ~39% (via two strategies: direct lender at 28.2% and leveraged looper at 11.2%). A wstETH/WETH Spark Looper strategy (not in default queue) introduces moderate leverage. Morpho exposure continues through Yearn OG WETH at ~2% of totalDebt (~9% effective).

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

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
  - **stETH Accumulator** — pipeline: WETH → ETH (unwrap) → stETH (Curve or Lido `submit`). Two hops; the dominant strategy at ~58% of totalDebt
  - **Spark WETH Lender** — pipeline: WETH → Spark Lend supply. Atomic withdrawal. 28.2% of totalDebt
  - **wstETH/WETH Spark Looper** — pipeline: WETH → wstETH (Lido) → Spark Lend collateral → borrow WETH → re-supply. Leveraged looping on Spark Lend. Moderate leverage at ~11% of totalDebt. May require deleveraging for full exit
  - **Yearn OG WETH** — Morpho MetaMorpho vault; WETH deployed into Morpho lending markets. Atomic withdrawal. 2.2% of totalDebt (9.1% effective). Confirmed via `MORPHO()` returning `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`
- **One strategy uses moderate leverage** (wstETH/WETH Spark Looper, ~11% of totalDebt) backed by blue-chip wstETH collateral. The other three strategies use simple stake / lend patterns
- **No cross-chain bridging**
- **Standard ERC-4626** deposit / withdrawal at the vault level
- **Mixed unwind pattern** — the stETH Accumulator (~58%) requires management-paced unwind; the Spark WETH Lender (~28%), wstETH/WETH Spark Looper (~11%), and Yearn OG WETH (~2% of totalDebt, ~9% effective) provide withdrawal from deep Spark Lend and Morpho markets. The looper may require partial deleveraging for full exit
- **Vault is immutable** (non-upgradeable Vyper minimal proxy) — confirmed unchanged at block 25574582

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~28 months** in production
- **TVL:** ~8,927 WETH (~$16.66M)
- **PPS trend:** 1.000000 → ~1.055 (~5.5% cumulative return over ~28 months, ~2.4% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management. Between May 11 and July 22, 2026, a strategy reshuffle occurred: Morpho Gauntlet (formerly 71%) and old Spark WETH (formerly 4%) were fully drained; the stETH Accumulator grew from 1,316 → 5,212 WETH current_debt. A new Spark WETH Lender, a new wstETH/WETH Spark Looper (leveraged), and Yearn OG WETH (Morpho MetaMorpho vault) were all activated by June 25. By the July 22 snapshot, vault TVL had grown 67% to ~8,927 WETH across four active strategies
- **Yearn V3 track record:** V3 framework live since May 2024 (~26 months). No V3 vault exploits

**Lido track record:** $20B+ TVL, longest-running LST, Shapella enabled withdrawals (June 2023). Curve stETH/ETH peg has been stable post-Shapella with brief periods of slight discount during stress events.

## Funds Management

yvWETH-1 is **~100% deployed** at the snapshot (~0.28 WETH idle). The strategy mix is: **stETH Accumulator (~58% of totalDebt)**, **Spark WETH Lender (~28%)**, **wstETH/WETH Spark Looper (~11%)**, and **Yearn OG WETH (~2% of totalDebt, but 807 WETH strategy totalAssets due to accumulated Morpho yield)**. All four strategies fully reconcile to totalDebt (~8,927 WETH).

Four previously-funded strategies (Morpho Gauntlet, old Spark WETH, and both Aave V3 variants) have been fully drained to zero debt and removed from the default queue.

### Strategy 1: stETH Accumulator (~58.4% of vault totalDebt)

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

**Accounting buffer:**

- `reportBuffer` haircuts the LST value in `estimatedTotalAssets()` to absorb peg slippage
- `pendingRedemptions` blocks `_harvestAndReport()` from running while withdrawal requests are in flight (preventing double-counting)

**Current strategy state (snapshot block 25574582):**

| Field | Value |
|-------|-------|
| Loose WETH balance on strategy | 0 WETH (verified at snapshot via `WETH.balanceOf(strategy)`) |
| `pendingRedemptions` | **0 stETH** (request #121758 remains finalized and claimed) |
| `estimatedTotalAssets()` | 5,212.53 WETH |
| `totalAssets()` (TokenizedStrategy) | 5,212.53 WETH |
| Vault `current_debt` for this strategy | 5,212 WETH |
| Strategy stETH balance | 5,212.53 stETH (entire backing held as stETH; 0 wstETH, 0 WETH) |
| Lido request #121758 | **isFinalized = true, isClaimed = true** at block 25574582 |

The accounting-lag mechanism (`pendingRedemptions > 0` blocks `_harvestAndReport()`) is **dormant** at this snapshot — there is no in-flight Lido withdrawal. If the strategy initiates a new `initiateLSTWithdrawal()` later, the lag mechanism will re-engage; captured under Reassessment Triggers.

**Strategy parameters:**
- Activated: April 14, 2026 (`activation = 1776351539`)
- Last reported: July 9, 2026 (`last_report = 1783748183`)
- max_debt: 15,000 WETH
- Management: Brain multisig (3-of-8) and Debt Allocator
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Strategy 2: Spark WETH Lender (~28.2% of vault totalDebt)

**Contract:** [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151)

New strategy deployed to replace the old Spark WETH Lender (`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`), which has been fully drained. The strategy supplies WETH to **Spark Lend** on Ethereum mainnet, earning variable-rate lending yield. Withdrawal is atomic against the deep Spark Lend WETH market.

**Current strategy state:**

| Field | Value |
|-------|-------|
| Vault `current_debt` | 2,521 WETH |
| Strategy `totalAssets()` | 2,521.35 WETH |
| Strategy WETH balance | 0 WETH |
| Strategy ETH balance | 0 WETH |
| `activation` | June 25, 2026 (1782490163) |
| `last_report` | July 15, 2026 (1784261003) |
| `max_debt` | 15,000 WETH |
| Underlying protocol | Spark Lend / Sky |

### Strategy 3: wstETH/WETH Spark Looper (~11.2% of vault totalDebt)

**Contract:** [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121)

This strategy leverages wstETH as collateral to borrow WETH on **Spark Lend** (an Aave-fork lending market). It is an upgradeable proxy with implementation **LSTAaveLooper** at [`0xd377919fa87120584b21279a491f82d5265a139c`](https://etherscan.io/address/0xd377919fa87120584b21279a491f82d5265a139c). The strategy is **not in the vault's default queue** (queue positions 0–2 are occupied by stETH Accumulator, Yearn OG WETH, and Spark WETH Lender respectively) but holds active debt from the vault. The looper deploys all assets into Spark Lend — it holds 0 WETH, 0 stETH, and 0 wstETH directly.

**Mechanics:**
1. WETH is staked into wstETH via Lido
2. wstETH is supplied as collateral on Spark Lend
3. WETH is borrowed against the wstETH collateral
4. The borrowed WETH is re-supplied (looped), amplifying the Spark Lend yield

**Liquidation risk:** The position is leveraged but uses wstETH/WETH, one of the safest collateral pairs in DeFi. Liquidation would require an extreme stETH/WETH exchange rate divergence. The leverage is moderate and only on ~11% of vault totalDebt.

**Withdrawal:** Exiting the looper requires partial deleveraging (repaying the borrowed WETH, withdrawing wstETH collateral, and unwrapping wstETH → stETH → WETH). This is not fully atomic like the Spark WETH Lender.

**Current strategy state:**

| Field | Value |
|-------|-------|
| Vault `current_debt` | 1,001 WETH |
| Strategy `totalAssets()` | 1,001.28 WETH |
| Strategy `balanceOfAsset()` | 0 WETH |
| Strategy WETH balance | 0 WETH |
| Strategy stETH balance | 0 WETH |
| Strategy wstETH balance | 0 WETH |
| `activation` | June 25, 2026 (1782490163) |
| `last_report` | July 17, 2026 (1783998623) |
| `max_debt` | 2,000 WETH |
| Underlying protocol | Spark Lend / Sky (leveraged via wstETH collateral) |
| Implementation | LSTAaveLooper ([`0xd377919fa87120584b21279a491f82d5265a139c`](https://etherscan.io/address/0xd377919fa87120584b21279a491f82d5265a139c)) |
| In default queue | **No** (not in `default_queue`; holds active debt but will not receive automatic allocations) |

### Strategy 4: Yearn OG WETH (~2.2% of vault totalDebt; 807.41 WETH strategy totalAssets)

**Contract:** [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC)

New strategy added to the default queue after the May 11 assessment. This is a **Morpho MetaMorpho vault**, confirmed by `MORPHO()` returning [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) (the Morpho protocol). Listed on Morpho's app at https://app.morpho.org/ethereum/vault/0xE89371eAaAC6D46d4C3ED23453241987916224FC/yearn-og-weth. WETH is deployed into Morpho lending markets. The strategy's PPS is 1.0366 (strategy-level), implying 3.66% yield since deployment. The gap between `current_debt` (193 WETH) and `totalAssets()` (807.41 WETH) represents ~614 WETH of accumulated Morpho lending yield awaiting keeper report — normal behavior for a Yearn strategy.

**Current strategy state:**

| Field | Value |
|-------|-------|
| Vault `current_debt` | 193 WETH |
| Strategy `totalAssets()` | 807.41 WETH |
| Strategy `totalSupply()` | 778.90 shares |
| Strategy PPS (`convertToAssets(1e18)`) | 1.036598 |
| Strategy WETH balance | 0 WETH |
| `activation` | May 22, 2026 (1779638639) |
| `last_report` | July 12, 2026 (1784004371) |
| `max_debt` | 15,000 WETH |
| Underlying protocol | Morpho (MetaMorpho vault) |
| `owner()` | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) (Security multisig 4-of-7) |

### Drained strategies (`activation = 0`, `current_debt = 0` at snapshot)

- **Morpho Gauntlet WETH Prime Compounder** ([`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7)) — 62.73 WETH residual totalAssets (outside vault accounting); `isShutdown = false`
- **Old Spark WETH Lender** ([`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15)) — 0.16 WETH residual; `isShutdown = false`
- **Aave V3 Lido WETH Lender** ([`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0)) — 0.04 WETH residual
- **Aave V3 WETH Lender** ([`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8)) — 0.15 WETH residual

### Accessibility

- **Deposits:** Permissionless ERC-4626 — anyone can deposit WETH and receive yvWETH-1. Subject to 15,000 WETH deposit limit
- **Withdrawals:** ERC-4626. The stETH Accumulator (~58% of totalDebt) does NOT auto-unwind — `availableWithdrawLimit()` on that strategy returns only its loose WETH balance. The Spark WETH Lender (~28%), wstETH/WETH Spark Looper (~11%), and Yearn OG WETH (~2% of totalDebt, ~9% effective with yield) provide withdrawal from Spark Lend and Morpho markets. The looper may require partial deleveraging for full exit. **See the "Liquidity Risk" section below**
- **No cooldown or lock period** at the vault level
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% backing** in WETH, stETH, Spark Lend, and Morpho positions
- **Collateral quality:** Lido stETH is the largest LST ($20B+ TVL, multi-operator). Spark Lend and Morpho are established blue-chip lending venues on Ethereum mainnet; both lend against bluechip collateral only
- **Moderate leverage on one strategy** — the wstETH/WETH Spark Looper (~11% of totalDebt) uses wstETH as collateral to borrow and re-supply WETH on Spark Lend. The collateral is blue-chip (wstETH) and the LTV is conservative. The other three strategies (58% + 28% + 2%) use simple stake / lend patterns with no leverage
- **Redeemability:** stETH can be unwound either via Curve (subject to peg slippage) or via the Lido withdrawal queue (1–7 days under normal load, 1:1 redemption). Spark WETH Lender and Yearn OG WETH (Morpho MetaMorpho) positions are instantly redeemable against deep lending markets. The wstETH/WETH Spark Looper requires partial deleveraging for full exit

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** stETH Accumulator reads on-chain stETH balance. Spark WETH Lender reads Spark Lend position value. Yearn OG WETH reads Morpho MetaMorpho share value (on-chain and verifiable)
- **Accounting-lag caveat (currently dormant):** when the stETH Accumulator has an in-flight Lido withdrawal (`pendingRedemptions > 0`), `_harvestAndReport()` is blocked and the strategy values the in-flight portion at its pre-request mark. At this snapshot `pendingRedemptions = 0` so the lag is not active, but the mechanism re-engages on every `initiateLSTWithdrawal()` call
- **Profit / loss:** reported by keeper via `process_report()`, locked over 10 days
- **Strategy debt reconciliation:** strategy current_debt sum (~8,927 WETH) now covers 100% of `totalDebt()` (~8,927 WETH). Fully reconciled with the discovery of the wstETH/WETH Spark Looper

## Liquidity Risk

| Aspect | Detail |
|--------|--------|
| Vault-level idle | 0.2844 WETH (vault is ~100% deployed) |
| Manual-unwind portion | ~58% of totalDebt — stETH Accumulator (5,212 WETH); `availableWithdrawLimit()` on this strategy returns only its loose WETH (0 at this snapshot) |
| Atomic-unwind portion | ~30% of totalDebt — Spark WETH Lender (2,521 WETH, 28.2%) + Yearn OG WETH (193 WETH, 2.2%; 807.41 WETH effective). Both provide atomic withdrawal from deep lending markets |
| Leveraged-unwind portion | ~11% of totalDebt — wstETH/WETH Spark Looper (1,001 WETH); requires partial deleveraging on Spark Lend for full exit |
| Manual unwind paths (stETH) | (a) Curve ETH/stETH (immediate, peg-dependent), (b) Lido queue (1–7 days, 1:1) |
| Curve ETH/stETH pool depth | Deep pool; stETH peg has been stable post-Shapella |
| Lido queue normal load | 1–7 days for finalization |
| Cooldown / restrictions | None at the vault level |

**Practical implications:**

- **Mixed unwind profile** — ~58% of totalDebt requires management-paced unwind (stETH Accumulator), ~30% provides atomic withdrawal from deep lending markets (Spark Lend + Morpho), ~11% requires deleveraging to exit (wstETH/WETH Spark Looper)
- **Lido queue can extend** under stress (post-merge withdrawal congestion, large coordinated unstake events)
- **Same-asset:** vault token is WETH-denominated; no price-divergence risk on the share
- **Deposit limit:** 15,000 WETH cap vs ~8,927 WETH TVL (room for +68%)
- **Single-venue concentration:** ~58% of totalDebt sits in the stETH Accumulator — a single Lido-based strategy. Spark Lend accounts for a combined ~39% across two strategies (direct lender + leveraged looper)
- **Yearn Treasury deposit:** ~1,600 ETH has been deposited by Yearn Treasury into this vault, providing a liquidity floor

The on-chain reality on the stETH Accumulator: `availableWithdrawLimit()` is **deliberately constrained** to the strategy's loose WETH balance (returns 0 at this snapshot). This is a design choice to prevent forced-sale of stETH at a discount during peg events, but it means **redemptions are management-paced for the ~58% Accumulator portion**. The Spark WETH Lender, wstETH/WETH Spark Looper, and Yearn OG WETH strategies provide a substantial withdrawal buffer.

## Centralization & Control Risks

### Governance

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | QUEUE, REPORTING, DEBT, MAX_DEBT, DEPOSIT_LIMIT, WITHDRAW_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

ySafe 6-of-9 signers include publicly known DeFi contributors — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig).

**Strategy-specific governance:** the stETH Accumulator's manual unwind functions (`manualSwapToAsset`, `initiateLSTWithdrawal`, `manualClaimWithdrawals`) are management-only. This is a strategy-level centralization point — Brain decides when to start unwinding stETH for upcoming user redemptions. Standard for LST integrations.

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
| **Lido (stETH)** | Critical — ~59% of vault totalDebt | Largest LST, $20B+ TVL, well-audited stack, multi-operator. Shapella-enabled withdrawals work 1:1 within 1–7 days |
| **Spark Lend (Sky)** | Medium — ~31% of vault totalDebt | Established blue-chip lending venue, WETH supply market is deep |
| **Morpho** | Low — ~2% of vault totalDebt (~9% effective including yield) | MetaMorpho vault deploying into Morpho lending markets; bluechip collateral only |
| **Curve ETH/stETH pool** | Medium (unwind path for ~59%) | Used for both staking (when better than 1:1) and manual unwind |
| **Lido withdrawal queue** | Medium (unwind path for ~59%) | 1:1 redemption, 1–7 days normal load |

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code (including `BaseLSTAccumulator.sol`) verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit. $200K Immunefi bug bounty for responsible disclosure
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault and migrating
- **Strategy-level operational risk:** the management-paced unwind for the stETH Accumulator covers the majority of TVL (~58% of totalDebt). The Spark WETH Lender (~28%), wstETH/WETH Spark Looper (~11%), and Yearn OG WETH (Morpho MetaMorpho, ~2% of totalDebt, ~9% effective) provide withdrawal paths, reducing Brain's operational burden for non-Accumulator redemptions
- **Operational note:** between May 11 and July 22, **Brain/Debt Allocator executed a strategy reshuffle** — fully draining Morpho Gauntlet (formerly 71%) and old Spark WETH (formerly 4%) while redeploying into the stETH Accumulator, a new Spark WETH Lender, a wstETH/WETH Spark Looper (leveraged, not in default queue), and a new Yearn OG WETH (Morpho MetaMorpho vault)

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
| wstETH/WETH Spark Looper | [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | `totalAssets()`, `balanceOfAsset()`, `isShutdown()`, keeper report frequency. Monitor Spark Lend health factor and leverage ratio. Implementation: [`0xd377919fa87120584b21279a491f82d5265a139c`](https://etherscan.io/address/0xd377919fa87120584b21279a491f82d5265a139c) (LSTAaveLooper, upgradeable proxy) |
| Yearn OG WETH | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | `totalAssets()`, `totalSupply()`, PPS, `isShutdown()`, keeper report frequency. Morpho MetaMorpho vault |
| Lido stETH | [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) | Total supply, exchange rate, pause state |
| Lido Withdrawal Queue | [`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) | Strategy's outstanding withdrawal request status |
| Curve ETH/stETH | [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) | stETH/ETH peg, pool depth |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **PPS decrease** — should only increase outside of explicit loss events
- **Strategy debt reconciliation** — monitor the gap between `totalDebt()` and strategy debt sum (currently fully reconciled at 100%)
- **Allocation drift** — currently ~58% stETH / ~28% Spark / ~11% Spark looper / ~2% Yearn OG WETH of totalDebt; drift toward >85% stETH or >50% Spark Lend should trigger reassessment
- **stETH/ETH peg deviation** — affects the ~58% Accumulator portion and the ~11% looper (liquidation risk)
- **Lido withdrawal queue length** — extended queue degrades the 1:1 unwind path (affects ~58% of totalDebt)
- **`pendingRedemptions` not draining** after expected finalization — points to stuck or slow Lido withdrawal (currently 0 at the snapshot)
- **wstETH/WETH Spark Looper health** — monitor the looper's leverage ratio and Spark Lend health factor. If the stETH/WETH exchange rate diverges significantly, the leveraged position could approach liquidation
- **Strategy additions / removals** — `StrategyChanged` events; new strategies should be reviewed during the 7-day timelock
- **ySafe signer / threshold changes**
- **Lido pause** — would impact stETH redemption mechanics for ~59% of totalDebt

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
| `getMinDelay()` | ySafe | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by 3 top firms, ~26 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe + 7-day self-governed timelock — unchanged since prior assessment
- **Conservative LST integration:** the stETH Accumulator's design (no auto-unwind, `pendingRedemptions` blocks reporting, peg buffer) deliberately avoids forced-sale of stETH at a discount during peg events
- **Lido withdrawal #121758 cleared:** the in-flight withdrawal flagged in April 2026 is finalized and claimed; accounting-lag mechanism is dormant
- **Yearn Treasury funds:** Treasury has deposited [~1,600 ETH](https://snapshot.org/#/s:veyfi.eth/proposal/0xe76f57663ce9311eb830ef097812702cbbb55fccbb280d254cdfc1f2c11c261a) into the vault which won't be withdrawn until the yETH recovery is repaid
- **Active monitoring** via Yearn's monitoring-scripts repo
- **Moderate leverage only on one strategy** (~11% of totalDebt) using blue-chip wstETH collateral; the other three strategies use simple stake/lend patterns
- **No cross-chain bridging**

### Key Risks

- **Single-venue concentration in stETH Accumulator (~58% of totalDebt):** the Lido dependency represents a majority of vault TVL. stETH is the highest-quality LST, but vault risk is concentrated behind one venue and one protocol (Lido)
- **Majority manual-unwind exposure:** ~58% of totalDebt requires management-paced unwind via Lido queue (1–7 days normal) or Curve (peg-dependent). The Spark WETH Lender (~28%), wstETH/WETH Spark Looper (~11%), and Yearn OG WETH (~2% of totalDebt, ~9% effective) provide withdrawal from deep lending markets
- **stETH peg risk under stress:** Curve ETH/stETH peg has been stable post-Shapella but historical depeg events have happened. The peg risk applies to ~58% of totalDebt
- **Lido queue extension under stress:** normal 1–7 days can extend significantly during large coordinated unstake events, affecting the majority of TVL
- **Moderate leverage via wstETH/WETH Spark Looper:** ~11% of totalDebt is exposed to a leveraged wstETH/WETH position on Spark Lend. While wstETH/WETH is one of the safest collateral pairs, extreme exchange-rate divergence could trigger liquidations
- **Strategy reshuffle:** four previously-core strategies (Morpho Gauntlet, old Spark, both Aaves) drained fully and replaced with stETH Accumulator, Spark WETH Lender, wstETH/WETH Spark Looper, and Yearn OG WETH (Morpho MetaMorpho vault)

### Critical Risks

- Lido stETH integrity failure on the ~58% Accumulator portion remains the dominant systemic tail risk. The wstETH/WETH Spark Looper's leveraged position adds a secondary tail risk (wstETH depeg → liquidation cascade), though wstETH/WETH is among the safest collateral pairs in DeFi. All gates pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is rounded to one decimal place using standard nearest-0.1 rounding; when the value is exactly halfway between two 0.1 marks (X.X50), round UP to the higher (riskier) score per the conservative principle

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Lido audited by multiple firms. Spark Lend (Sky) and Morpho are established blue-chip protocols with audit histories. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + on-chain balances verifiable for all four strategies (stETH, Spark Lend positions, Morpho MetaMorpho shares). Strategy debt sum covers 100% of totalDebt. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig (unchanged), 7-day timelock on critical roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Lido: multiple firms. Spark Lend and Morpho: established blue-chip protocols. |
| Bug bounty | $200K (Yearn Immunefi); Lido bounty active |
| Production history | **~28 months** (March 12, 2024). V3 framework: ~26 months |
| TVL | ~8,927 WETH (~$16.66M). Deposit limit: 15,000 WETH |
| Security incidents | None on V3, none on Lido stETH |
| Strategy review | 12-metric ySec framework. Category-1 strictest tier |

**Score: 1.5 / 5** — strong audit coverage, ~28 months clean production, no incidents. All four strategies deploy into well-audited blue-chip venues (Lido, Spark Lend, Morpho).

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | 7-day delay on `ADD_STRATEGY` and `ACCOUNTANT`. Self-governed |
| Privileged roles | Well-distributed across Daddy, Brain, Security, Keeper, Debt Allocator |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.0 / 5** — textbook score-1 governance per the rubric. Governance parameters (ySafe 6-of-9, Brain 3-of-8, Security 4-of-7, 7-day timelock) are unchanged from prior assessment.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals on-chain |
| Strategy reporting | Programmatic via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |
| LST unwind | **Management-paced** (manual functions) for the ~58% Accumulator portion; Spark WETH Lender and Yearn OG WETH provide atomic withdrawal for ~30%; wstETH/WETH Spark Looper requires deleveraging for ~11% |

**Programmability Score: 1.5 / 5** — fully programmatic at the vault level. The LST Accumulator's manual unwind remains a mild factor, partially mitigated by the Spark, Looper, and Morpho strategies providing withdrawal paths for ~41% of totalDebt.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Verified protocol count | 3 funded dependencies (Lido ~58%, Spark Lend ~39%, Morpho ~2%/~9% effective) |
| Criticality | Lido critical (~58%); Spark Lend elevated (~39% across two strategies); Morpho low |
| Concentration | Single-venue concentration ~58% in Lido/stETH; Spark Lend represents ~39% combined |
| Quality | All three are top-tier DeFi protocols with established track records |

**Dependencies Score: 2.0 / 5** — three blue-chip dependencies. The ~58% Lido concentration is material but offset by Spark Lend (~39% across two strategies) and Morpho (~9% effective) as alternative venues. Spark Lend dependency deepened since prior assessment (31% → 39%) but remains well-diversified across two distinct strategies (direct lender + leveraged looper).

**Centralization Score = (1.0 + 1.5 + 2.0) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | ~58% stETH, ~28% Spark Lend (direct), ~11% Spark Lend (leveraged), ~2% Morpho MetaMorpho (~9% effective). All on-chain verifiable |
| Collateral quality | Lido stETH is top-tier ($20B+ TVL, multi-operator). Spark Lend and Morpho are blue-chip lending venues, lending against bluechip collateral only |
| Leverage | Moderate leverage on the wstETH/WETH Spark Looper (~11% of totalDebt) using blue-chip wstETH collateral. The other ~89% (stETH Accumulator, Spark WETH Lender, Yearn OG WETH) uses simple stake / lend patterns |
| Verifiability | Fully on-chain for all four strategies |

**Score: 1.5 / 5** — high-quality collateral across three blue-chip venues, fully verifiable on-chain. The looper's leverage is moderate, backed by wstETH (top-tier LST), and limited to ~11% of totalDebt.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | All four strategies: fully on-chain via stETH balance, Spark Lend position values, Morpho MetaMorpho shares |
| Exchange rate | Programmatic, real-time at the vault level |
| Reporting | Keeper-driven, 10-day profit unlock |
| LST accounting lag | Dormant at this snapshot (`pendingRedemptions = 0`) |
| totalDebt reconciliation | Strategy debt sum (~8,927 WETH) covers 100% of totalDebt (~8,927 WETH). Fully reconciled |

**Score: 1.0 / 5** — reserves are fully transparent across all four strategies. Strategy debt now reconciles to 100% of totalDebt with the discovery of the wstETH/WETH Spark Looper.

**Funds Management Score = (1.5 + 1.0) / 2 = 1.25**

**Score: 1.3 / 5** — high-quality collateral across four strategies (three blue-chip venues), fully transparent and verifiable on-chain. Moderate leverage in the looper (~11%) is well-contained.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Vault-level idle | 0.2844 WETH (vault is ~100% deployed) |
| Atomic-unwind portion | ~30% of totalDebt — Spark WETH Lender (28.2%) + Yearn OG WETH Morpho MetaMorpho (2.2% of totalDebt, 9.1% effective). Both provide atomic withdrawal from deep lending markets |
| Leveraged-unwind portion | ~11% of totalDebt — wstETH/WETH Spark Looper; requires partial deleveraging on Spark Lend for full exit |
| Manual-unwind portion | ~58% of totalDebt in stETH Accumulator; `availableWithdrawLimit()` returns only loose WETH (0 at this snapshot) |
| Unknown portion | 0% — fully reconciled |
| Underlying liquidity | Curve ETH/stETH deep; Lido queue 1–7 days normal load. Spark Lend WETH market deep. Morpho lending markets deep |
| Same-asset | WETH-denominated share token |
| Withdrawal restrictions | None at vault level; effective restriction is `availableWithdrawLimit() = balanceOfAsset()` of the Accumulator strategy |

**Score: 2.0 / 5** — the stETH Accumulator (~58% of totalDebt) requires management-paced unwind via Lido queue (1–7 days normal) or Curve (peg-dependent). The Spark WETH Lender (~28%) and Yearn OG WETH (~2% of totalDebt, ~9% effective) provide substantial atomic-withdrawal buffer. The wstETH/WETH Spark Looper (~11%) adds a deleveraging requirement for full exit. Yearn Treasury deposits provide a liquidity floor.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. Strategy reshuffle executed May-July shows active management capability |
| Monitoring | Active hourly alerts, vault in monitored list. Strategy debt reconciliation at 100% of totalDebt |
| Strategy unwind ops | Brain must actively pre-position WETH for the ~58% Accumulator portion; Spark, Looper, and Morpho strategies provide withdrawal paths for ~41% |

**Score: 1.0 / 5** — operational maturity remains high for the Yearn V3 infrastructure. Active monitoring, standard governance, and demonstrated management capability. No material operational concerns.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.3 | 30% | 0.390 |
| Liquidity Risk | 2.0 | 15% | 0.300 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.49 → 1.5 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.5 / 5.0) — Approved with high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (October 2026)
- **TVL-based:** Reassess if TVL exceeds 12,000 WETH or changes by ±50%
- **Allocation drift:**
  - stETH Accumulator share moves above 85% of vault totalDebt — critical concentration review
  - Spark Lend combined exposure (lender + looper) exceeds 50% of vault totalDebt
  - any one venue exceeds 90% of vault totalDebt
  - wstETH/WETH Spark Looper share exceeds 25% of vault totalDebt
  - Yearn OG WETH strategy totalAssets exceeds 20% of vault TVL
- **Strategy changes (`addStrategy()` proposals at the Strategy Manager TimelockController, [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73), 7-day delay):**
  - any new strategy proposed for inclusion — re-review during the 7-day timelock window
  - any new strategy with leverage, looping, cross-chain bridging, or non-blue-chip routing
  - re-funding of any previously-drained strategy (Morpho Gauntlet, old Spark WETH, or Aave variants)
- **Lido-specific:**
  - extended Lido withdrawal queue (>14 days) — degrades the 1:1 unwind path (affecting ~58% of totalDebt)
  - stETH/ETH peg deviation > 1% sustained — affects the ~58% Accumulator portion and the ~11% leveraged looper (liquidation risk)
  - any Lido contract upgrade or oracle change
  - any new `initiateLSTWithdrawal()` from the Accumulator — re-engages the `pendingRedemptions` accounting-lag mechanism
- **wstETH/WETH Spark Looper-specific:**
  - looper health factor on Spark Lend drops below 1.5 (approaching liquidation threshold)
  - any deleveraging event (forced or management-initiated)
  - looper implementation upgrade (proxy upgrade) — the strategy is an upgradeable LSTAaveLooper proxy
  - looper added to the default queue
- **Strategy-specific:**
  - `pendingRedemptions` failing to drain after expected Lido finalization
  - Brain unwind cadence (frequency / size of `manualSwapToAsset` and `initiateLSTWithdrawal` calls) drops materially
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Lido / Curve / Spark Lend / Morpho
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| May 11, 2026 | 1.5 | Initial assessment. 3 funded strategies (Morpho ~71%, stETH ~25%, Spark ~4%). 6-of-9 ySafe, 7-day timelock, immutable vault. Minimal Risk tier. |
| July 20, 2026 | 1.5 | Reassessment. Strategy mix: stETH Accumulator (59%), Spark WETH Lender (31%), Yearn OG WETH (Morpho MetaMorpho, 2%/~9% effective). All strategies mapped to verified blue-chip protocols. Governance unchanged. Score returned to 1.5 (Minimal Risk). |
| July 22, 2026 | 1.5 | Reassessment. Discovered 4th strategy: wstETH/WETH Spark Looper (~11% of totalDebt; not in default queue). This is an LSTAaveLooper that leverages wstETH as collateral to borrow WETH on Spark Lend — the first leveraged strategy in this vault. Strategy debt now fully reconciles to 100% of totalDebt (~8,927 WETH). Score unchanged at 1.5 (Minimal Risk). |

---

## Appendix: Contract Architecture

Snapshot at block 25574582 (July 20, 2026). Updated with July 22, 2026 strategy data.

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER                                  │
│                                                                       │
│  ┌────────────────────────────────────────┐                          │
│  │  yvWETH-1 (v3.0.2)                    │                          │
│  │  ERC-4626, immutable Vyper proxy       │                          │
│  │  0xc564…dDB0                           │                          │
│  │                                        │                          │
│  │  TVL: ~8,927 WETH (~$16.66M)           │                          │
│  │   ├── 0.28 idle                        │                          │
│  │   ├── 5,212 stETH Accumulator (58%)    │                          │
│  │   ├── 2,521 Spark WETH Lender (28%)    │                          │
│  │   ├── 1,001 wstETH/WETH Looper (11%)   │                          │
│  │   └── 193 Yearn OG WETH (2.2%)         │                          │
│  └─────────────────┬──────────────────────┘                          │
│                    │                                                  │
│   ┌────────────────┼──────────────────────────────────────────┐       │
│   ▼                ▼              ▼                           ▼       │
│ ┌──────────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐│
│ │ stETH Accumulator    │ │ Spark WETH   │ │ wstETH/WETH  │ │Yearn OG││
│ │ 0x470e…7435          │ │ Lender       │ │ Spark Looper │ │WETH    ││
│ │                      │ │ 0xfca3…0151  │ │ 0x68A1…0121  │ │0xE893…││
│ │ 5,212 WETH (58.4%)   │ │              │ │              │ │        ││
│ │                      │ │ 2,521 WETH   │ │ 1,001 WETH   │ │193 WETH││
│ │ Stake: WETH→ETH→stETH│ │ (28.2%)      │ │ (11.2%)      │ │(2.2%)  ││
│ │ via Curve or Lido    │ │              │ │              │ │        ││
│ │ Unwind (mgmt-only):  │ │ Atomic:      │ │ Leveraged:   │ │Atomic: ││
│ │  manualSwapToAsset() │ │ Spark Lend   │ │ wstETH→WETH  │ │Morpho  ││
│ │  initiateLSTWithdr.  │ │ supply       │ │ loop on Spark│ │lending ││
│ │  manualClaimWithdr.  │ │              │ │              │ │        ││
│ │                      │ │              │ │ NOT in queue │ │owner:  ││
│ │ pendingRedemptions=0 │ │              │ │ Proxy:       │ │Security││
│ │                      │ │              │ │ LSTAaveLooper│ │(4-of-7)││
│ └──────────────────────┘ └──────────────┘ └──────────────┘ └────────┘│
│                                                                       │
│  Drained (activation=0, current_debt=0 at snapshot):                   │
│   • Morpho Gauntlet WETH Prime    — 0xeEB6…CBE7 (62.73 WETH residual)  │
│   • Old Spark WETH Lender         — 0x365c…9e15 (0.16 dust)            │
│   • Aave V3 Lido WETH Lender      — 0xC7bA…8DF0 (0.04 dust)            │
│   • Aave V3 WETH Lender           — 0x5ABc…0dB8 (0.15 dust)            │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          UNDERLYING                                   │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Lido stETH             │  │ Curve ETH/stETH pool   │               │
│  │ $20B+ TVL              │  │ 0xDC24…7022            │               │
│  │ Multi-operator         │  │ Stake-on-better-quote, │               │
│  │ Shapella withdrawals   │  │ manual unwind venue    │               │
│  └────────────────────────┘  └────────────────────────┘               │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Lido Withdrawal Queue  │  │ Spark Lend WETH Market │               │
│  │ 0x889e…F9B1            │  │ (Sky)                  │               │
│  │ 1:1, 1–7 days normal   │  │ WETH supply + wstETH    │               │
│  │                        │  │ collateral loop        │               │
│  └────────────────────────┘  └────────────────────────┘               │
│  ┌────────────────────────┐                                             │
│  │ Morpho Lending Markets │                                             │
│  │ (via MetaMorpho vault) │                                             │
│  │ Bluechip collateral    │                                             │
│  └────────────────────────┘                                             │
└──────────────────────────────────────────────────────────────────────┘
```

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
