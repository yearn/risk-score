# Protocol Risk Assessment: Yearn — yvWETH-1

- **Assessment Date:** May 5, 2026
- **Token:** yvWETH-1 (WETH-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0)
- **Final Score: 1.5/5.0**

## Overview + Links

yvWETH-1 is a **WETH-denominated Yearn V3 vault** (ERC-4626) that deploys deposited WETH into yield strategies on Ethereum mainnet. At the May 5 snapshot the vault is **100% deployed across three funded strategies**: Morpho Gauntlet WETH Prime Compounder (~73%), stETH Accumulator (~21%), and Spark WETH Lender (~6%). Two previously-queued strategies — **Aave V3 Lido WETH and Aave V3 WETH** — were revoked between the April 27 and May 5 snapshots (`activation = 0` on both).

The April-27 snapshot captured the vault mid-deallocation following the **April 18, 2026 rsETH (KelpDAO) bridge exploit** on the LayerZero OFT bridge layer (see the [hgETH reassessment report](./kerneldao-hgeth.md) for verified on-chain facts about that event). Per the Yearn team that deallocation was precautionary — funds were pulled from previously-funded Aave / Morpho strategies because some underlying lending markets *could* indirectly hold rsETH as collateral. **None of the funded strategies on yvWETH-1 reference rsETH directly.** By May 5 funds have been re-deployed: the redeployment landed in three venues (Morpho-dominant), did not return to either Aave V3 strategy, and revoked them entirely. The team's causal attribution has not been independently verified, but the rsETH event itself is well documented.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting WETH deposits, issuing yvWETH-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Funded strategies (3 in default queue, all with debt):**
  - Morpho Gauntlet WETH Prime Compounder ([`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7)) — 4,033.64 WETH (73.85%)
  - **stETH Accumulator** ([`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)) — 1,166.19 WETH (21.35%)
  - Spark WETH Lender ([`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15)) — 262.32 WETH (4.80%)
- **Withdrawal mechanics:** Morpho and Spark unwind atomically against deep underlying lending markets. The stETH Accumulator **does not auto-unwind on user withdrawal** — `availableWithdrawLimit()` returns only the strategy's loose WETH balance. Larger redemptions touching the Accumulator portion are management-paced (manual unwind via Curve or the Lido withdrawal queue)
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (May 5, 2026, snapshot at block 25031569, timestamp 1778017355 = 21:42:35 UTC):**

- **TVL:** 5,462.15 WETH (~$12.99M at ETH/USD = $2,378.63, [Chainlink ETH/USD feed](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419))
- **Total Supply:** 5,217.47 yvWETH-1
- **Price Per Share:** 1.046897 WETH/yvWETH-1 (~4.69% cumulative appreciation over ~25.8 months, ~2.2% annualized)
- **Total Debt:** 5,462.15 WETH (100% deployed)
- **Total Idle:** 0
- **Deposit Limit:** 15,000 WETH
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Snapshot drift since the prior in-day snapshot (block 25029809, ~6 hours earlier):** vault TVL fell ~70.09 WETH (-1.27%). The entire reduction came out of the **Spark WETH Lender** strategy (332.41 → 262.32 WETH), with Morpho Gauntlet and stETH Accumulator absolute debts unchanged. As a result Spark's allocation share dropped from 6.01% → 4.80%, while Morpho moved 72.92% → 73.85% and stETH Accumulator moved 21.08% → 21.35% (composition-only changes; their absolute deployment is unchanged).

**Lido withdrawal #121758 status:** Lido withdrawal request **#121758** (the 1,000-stETH in-flight request flagged in the April 27 snapshot) is now **finalized AND claimed** (`getWithdrawalStatus([121758]) = (1000 stETH, 811.44 shares, owner = stETH strategy, ts = 1776716615, isFinalized = true, isClaimed = true)`). At the snapshot the strategy's `pendingRedemptions = 0`, so the accounting-lag mechanism described in the prior snapshot is **dormant** here. `estimatedTotalAssets()` matches `current_debt = 1,166.19 WETH` to within profit-unlock noise.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Lido Documentation](https://docs.lido.fi/)
- [Lido Security](https://lido.fi/security)
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

### Active Strategies (3 in default queue, 3 with debt)

| # | Strategy | Name | Current Debt (WETH) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15) | Spark WETH Lender | 262.32 | 4.80% |
| 2 | [`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7) | **Morpho Gauntlet WETH Prime Compounder** | **4,033.64** | **73.85%** |
| 3 | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | **stETH Accumulator** | **1,166.19** | **21.35%** |

**Previously queued, now revoked (`activation = 0` at block 25031569):**

- Aave V3 Lido WETH Lender ([`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0))
- Aave V3 WETH Lender ([`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8))

**Current funding posture:** vault is 100% deployed across three venues. Morpho Gauntlet dominates at ~74% — a meaningful single-venue concentration. The stETH Accumulator share is at ~21%. Both Aave V3 strategies were revoked entirely; per Yearn team this followed the April 18 rsETH bridge exploit (unverified attribution). None of the funded strategies reference rsETH directly. Between the prior in-day snapshot (block 25029809) and this snapshot (block 25031569, ~6 hours later) ~70 WETH was withdrawn from Spark WETH Lender, dropping its allocation share from 6.01% → 4.80%; Morpho Gauntlet and stETH Accumulator absolute debts were unchanged.

### Strategy Protocol Dependencies

| Protocol | Strategy | Allocation |
|----------|----------|-----------|
| **Morpho (Gauntlet curator)** | Morpho Gauntlet WETH Prime Compounder | **73.85% of vault TVL** |
| **Lido (stETH)** | stETH Accumulator | **21.35% of vault TVL** |
| **Spark Lend** | Spark WETH Lender | **4.80% of vault TVL** |
| **Curve ETH/stETH pool** | stETH Accumulator (stake / unwind path) | Indirect dependency |
| **Lido withdrawal queue** | stETH Accumulator (unwind path) | Indirect dependency |

**Sky-governance exposure note:** Spark Lend is a Sky sub-DAO. Roughly 5% of yvWETH-1's debt sits in Spark WETH Lender, which is administered through Sky / Spark governance. This is a small Sky-governance dependency on a minority allocation; immaterial relative to the Morpho-dominated mix.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Lido Audits (Underlying Protocol)

Lido is one of the most extensively audited LSTs in DeFi. Audits include MixBytes, Quantstamp, Sigma Prime, Statemind, Oxorio, ChainSecurity, and others. See [Lido security](https://lido.fi/security) for the full list.

### Curve ETH/stETH Pool

Audited as part of Curve's StableSwap suite. Pool address [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022).

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvWETH-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Lido (Immunefi):** active bug bounty
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

- **3 funded strategies** at the snapshot
  - **Morpho Gauntlet WETH Prime Compounder** — direct WETH deposit into a Morpho Gauntlet ERC-4626 vault. Single hop
  - **Spark WETH Lender** — direct supply into Spark Lend WETH market. Single hop
  - **stETH Accumulator** — pipeline: WETH → ETH (unwrap) → stETH (Curve or Lido `submit`). Two hops; the only LST in the mix
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit / withdrawal at the vault level
- **Manual unwind** is the only operational complexity layer — `_freeFunds()` on the stETH Accumulator is a no-op, so user redemptions touching the ~21% Accumulator portion depend on management pre-positioning loose WETH
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~25.8 months** in production
- **TVL:** 5,462.15 WETH (~$12.99M)
- **PPS trend:** 1.000000 → 1.046897 (~4.69% cumulative return over ~25.8 months, ~2.2% annualized — reflects historical periods at lower deployment ratios)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management. Between April 27 and May 5, **Aave V3 Lido WETH and Aave V3 WETH were both revoked** (`activation = 0`); funds were re-deployed from the prior 67%-idle posture into a Morpho-dominant 3-venue mix
- **Yearn V3 track record:** V3 framework live since May 2024 (~24 months). No V3 vault exploits

**Lido track record:** $20B+ TVL, longest-running LST, Shapella enabled withdrawals (June 2023). Curve stETH/ETH peg has been stable post-Shapella with brief periods of slight discount during stress events.

## Funds Management

yvWETH-1 is **100% deployed** at the snapshot, split roughly: **Morpho Gauntlet 73%, stETH Accumulator 21%, Spark 6%**. The earlier April-27 67%-idle posture (per Yearn team a rsETH-precautionary deallocation, unverified attribution) has reversed.

### Strategy 1: Morpho Gauntlet WETH Prime Compounder (~73.85% of vault TVL)

**Contract:** [`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7)

Direct WETH deposit into the Gauntlet-curated Morpho WETH Prime ERC-4626 vault. Atomic single-hop deposit / redeem against deep Morpho lending markets (Morpho protocol $6.6B+ TVL). Curated by Gauntlet, audited 25+ times across Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora.

### Strategy 2: stETH Accumulator (~21.35% of vault TVL)

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

**Current strategy state (snapshot block 25031569):**

| Field | Value |
|-------|-------|
| `balanceOfAsset()` (loose WETH) | 0 WETH (verified at snapshot) |
| `pendingRedemptions` | **0 stETH** (April 27 in-flight request #121758 has finalized and been claimed) |
| `estimatedTotalAssets()` | 1,166.72 WETH |
| `totalAssets()` (TokenizedStrategy) | ~1,166.72 WETH (matches `estimatedTotalAssets()` to within profit-unlock noise) |
| Vault `current_debt` for this strategy | 1,166.19 WETH |
| Lido request #121758 | **isFinalized = true, isClaimed = true** at block 25031569 |

The accounting-lag mechanism (`pendingRedemptions > 0` blocks `_harvestAndReport()`) is **dormant** at this snapshot — there is no in-flight Lido withdrawal. If the strategy initiates a new `initiateLSTWithdrawal()` later, the lag mechanism will re-engage; captured under Reassessment Triggers.

**Strategy parameters:**
- Activated: 2026-04-16
- Last reported: 2026-05-01 (`last_report = 1777645139`)
- Management: Brain multisig (3-of-8) and Debt Allocator
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Strategy 3: Spark WETH Lender (~4.80% of vault TVL)

**Contract:** [`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15)

Direct supply of WETH into Spark Lend's WETH market. Spark Lend is a Sky sub-DAO; ChainSecurity / Cantina audits. Atomic redemption against Spark Lend WETH market liquidity. Allocation is small (~6%), so Sky-governance dependency is not material at this allocation.

### Revoked strategies (`activation = 0` at snapshot)

- **Aave V3 Lido WETH Lender** ([`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0)) — revoked between April 27 and May 5
- **Aave V3 WETH Lender** ([`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8)) — revoked between April 27 and May 5

The rationale for revoking both Aave V3 strategies has not been independently verified.

### Accessibility

- **Deposits:** Permissionless ERC-4626 — anyone can deposit WETH and receive yvWETH-1. Subject to 15,000 WETH deposit limit
- **Withdrawals:** ERC-4626. The bulk of TVL (~79%, Morpho + Spark) unwinds atomically against deep underlying lending markets. The ~21% in the stETH Accumulator does NOT auto-unwind — `availableWithdrawLimit()` on that strategy returns only its loose WETH balance. **See the "Liquidity Risk" section below**
- **No cooldown or lock period** at the vault level
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% backing** in WETH (Morpho, Spark positions) or stETH (Accumulator)
- **Collateral quality:** Morpho protocol $6.6B+ TVL with Gauntlet curation; Lido stETH is the largest LST ($20B+ TVL, multi-operator); Spark Lend is a Sky-audited stack
- **No leverage** — the Accumulator is a simple stake / unstake pattern; Morpho and Spark are direct lending positions
- **Redeemability:** Morpho and Spark redeem atomically subject to underlying market utilization. stETH can be unwound either via Curve (subject to peg slippage) or via the Lido withdrawal queue (1–7 days under normal load, 1:1 redemption)

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads on-chain Morpho / Spark / stETH balances
- **Accounting-lag caveat (currently dormant):** when the stETH Accumulator has an in-flight Lido withdrawal (`pendingRedemptions > 0`), `_harvestAndReport()` is blocked and the strategy values the in-flight portion at its pre-request mark. At this snapshot `pendingRedemptions = 0` so the lag is not active, but the mechanism re-engages on every `initiateLSTWithdrawal()` call
- **Profit / loss:** reported by keeper via `process_report()`, locked over 10 days

## Liquidity Risk

| Aspect | Detail |
|--------|--------|
| Vault-level idle | 0 WETH (vault is fully deployed) |
| Atomic-unwind portion | ~79% of TVL — Morpho Gauntlet (4,033.64 WETH) + Spark Lend (262.32 WETH), both deep blue-chip WETH lending markets |
| Manual-unwind portion | ~21% of TVL — stETH Accumulator (1,166.19 WETH); `availableWithdrawLimit()` on this strategy returns only its loose WETH |
| Manual unwind paths | (a) Curve ETH/stETH (immediate, peg-dependent), (b) Lido queue (1–7 days, 1:1) |
| Curve ETH/stETH pool depth | Deep pool; stETH peg has been stable post-Shapella |
| Lido queue normal load | 1–7 days for finalization |
| Cooldown / restrictions | None at the vault level |

**Practical implications:**

- **Small / medium withdrawals** unwind atomically through the queue (Spark first, then Morpho) for the ~79% atomic portion
- **Withdrawals exceeding the atomic portion** require either (a) additional Morpho headroom, which depends on Morpho Gauntlet WETH market utilization at the moment of withdraw, or (b) management to pre-position WETH out of the stETH Accumulator
- **Lido queue can extend** under stress (post-merge withdrawal congestion, large coordinated unstake events)
- **Same-asset:** vault token is WETH-denominated; no price-divergence risk on the share
- **Deposit limit:** 15,000 WETH cap vs 5,462 WETH TVL (room for +175%)
- **Single-venue concentration:** ~73% of TVL sits in the Morpho Gauntlet WETH Prime vault — concentrated single-venue exposure, though Morpho/Gauntlet is among the highest-quality WETH venues in DeFi

The on-chain reality on the stETH Accumulator: `availableWithdrawLimit()` is **deliberately constrained** to the strategy's loose WETH balance — verified in `BaseLSTAccumulator.sol`. This is a design choice to prevent forced-sale of stETH at a discount during peg events, but it means **redemptions exceeding the atomic Morpho + Spark capacity are management-paced for the Accumulator portion**.

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
| **Morpho protocol + Gauntlet curator** | Critical — ~73% of vault TVL | Morpho $6.6B+ TVL; Gauntlet curates the WETH Prime vault's underlying markets |
| **Lido (stETH)** | High — ~21% of vault TVL | Largest LST, $20B+ TVL, well-audited stack, multi-operator. Shapella-enabled withdrawals work 1:1 within 1–7 days |
| **Spark Lend + Sky governance** | Low — ~6% of vault TVL | Sky sub-DAO; small allocation |
| **Curve ETH/stETH pool** | Medium (unwind path for ~21%) | Used for both staking (when better than 1:1) and manual unwind |
| **Lido withdrawal queue** | Medium (unwind path for ~21%) | 1:1 redemption, 1–7 days normal load |

**Dependency quality:** Morpho/Gauntlet, Lido, and Spark are all top-tier WETH venues. Concentration risk is meaningful (~73% Morpho), but each individual venue is high quality.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code (including `BaseLSTAccumulator.sol`) verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit. $200K Immunefi bug bounty for responsible disclosure
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault and migrating
- **Strategy-level operational risk:** the management-paced unwind for the stETH Accumulator's ~21% portion means yvWETH-1 retains a higher operational dependency on Brain than the all-stable vaults — even though the bulk of TVL (Morpho + Spark) now unwinds atomically
- **Operational anomaly:** between April 27 and May 5, **two strategies (Aave V3 Lido WETH and Aave V3 WETH) were revoked** while funds were re-deployed. Per Yearn team this followed the rsETH bridge exploit (unverified attribution); the rationale for revoking these specific blue-chip strategies has not been independently verified — Brain must monitor incoming withdrawal demand and pre-position WETH

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvWETH-1 is in the monitored vault list:**

- **Large flow alerts** ([`yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/yearn/alert_large_flows.py)) — runs **hourly via GitHub Actions**. Alerts on deposits / withdrawals exceeding threshold via Telegram
- **Endorsed vault check** (`yearn/check_endorsed.py`) — weekly
- **Timelock monitoring** (`timelock/timelock_alerts.py`) — monitors the Yearn TimelockController across multiple chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvWETH-1 Vault | [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| Morpho Gauntlet WETH Prime Compounder | [`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| Spark WETH Lender | [`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| stETH Accumulator | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | `totalAssets()`, `estimatedTotalAssets()`, `pendingRedemptions`, `balanceOfAsset()`, `isShutdown()`, keeper report frequency |
| Lido stETH | [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) | Total supply, exchange rate, pause state |
| Lido Withdrawal Queue | [`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) | Strategy's outstanding withdrawal request status |
| Curve ETH/stETH | [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) | stETH/ETH peg, pool depth |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **PPS decrease** — should only increase outside of explicit loss events
- **Allocation drift** — currently ~73% Morpho / ~21% stETH / ~6% Spark; drift toward >85% in any single venue should trigger reassessment
- **stETH/ETH peg deviation** — affects the ~21% Accumulator portion's manual unwind via Curve
- **Lido withdrawal queue length** — extended queue degrades the 1:1 unwind path
- **`pendingRedemptions` not draining** after expected finalization — points to stuck or slow Lido withdrawal (currently 0 at the snapshot; will engage on the next `initiateLSTWithdrawal()`)
- **Strategy additions / removals** — `StrategyChanged` events; further revocations are operational signals
- **ySafe signer / threshold changes**
- **Lido pause** — would impact stETH redemption mechanics
- **Morpho Gauntlet WETH Prime utilization** — affects atomicity of the largest portion (~73%)

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

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by 3 top firms, ~24 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Top-tier underlying mix:** Morpho/Gauntlet ($6.6B+ TVL), Lido stETH (largest LST $20B+ TVL), and Spark Lend — each is among the highest-quality WETH venues in DeFi
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Bulk of TVL atomic-unwind:** ~79% in Morpho + Spark unwinds atomically against deep blue-chip lending markets
- **Conservative LST integration:** the stETH Accumulator's design (no auto-unwind, `pendingRedemptions` blocks reporting, peg buffer) deliberately avoids forced-sale of stETH at a discount during peg events
- **Lido withdrawal #121758 cleared:** the in-flight withdrawal flagged in the April 27 snapshot is finalized and claimed; accounting-lag mechanism is dormant at this snapshot
- **Active monitoring** via Yearn's monitoring-scripts repo
- **No leverage. No cross-chain.**

### Key Risks

- **Single-venue concentration in Morpho (~73%):** the redeployed mix puts roughly three quarters of TVL behind one venue (Morpho Gauntlet WETH Prime). Morpho/Gauntlet is top-tier, but the concentration itself is the largest single risk in the score
- **Manual unwind on the stETH Accumulator portion (~21%):** `availableWithdrawLimit()` on the strategy returns only its loose WETH balance. Withdrawals exceeding the atomic Morpho + Spark capacity require Brain to pre-position WETH out of the Accumulator (Curve immediate but peg-dependent, or Lido queue 1:1 in 1–7 days normal load)
- **Accounting-lag mechanism (currently dormant, not eliminated):** when the stETH Accumulator initiates a new Lido withdrawal, `pendingRedemptions > 0` blocks `_harvestAndReport()` and the strategy values the in-flight portion at its pre-request mark. Mechanism is dormant at this snapshot (request #121758 finalized + claimed) but re-engages on the next `initiateLSTWithdrawal()`
- **stETH peg risk under stress:** Curve ETH/stETH peg has been stable post-Shapella but historical depeg events have happened (e.g. June 2022 ~5% discount). During stress, manual unwind via Curve would realize that discount on the ~21% Accumulator share
- **Lido queue extension under stress:** normal 1–7 days can extend significantly during large coordinated unstake events
- **Two strategies revoked:** Aave V3 Lido WETH and Aave V3 WETH — both blue-chip — were revoked entirely between April 27 and May 5. Per Yearn team this followed the rsETH bridge exploit (unverified attribution); the rationale for these specific revocations is not independently verifiable on-chain
- **Brain-dependent operational tempo:** the manual-unwind layer on ~21% of TVL keeps yvWETH-1 more operationally dependent on Brain than the all-stable vaults

### Critical Risks

- None identified. The dominant systemic risk would be either (a) a Morpho/Gauntlet WETH Prime market failure given the ~73% concentration, or (b) a Lido stETH integrity failure on the Accumulator portion. All gates pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is rounded to one decimal place using standard nearest-0.1 rounding; when the value is exactly halfway between two 0.1 marks (X.X50), round UP to the higher (riskier) score per the conservative principle

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Lido audited by multiple firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + on-chain stETH balances + Lido withdrawal queue all verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with named signers, 7-day timelock on critical roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Morpho: 25+ audits incl. Certora formal verification. Lido: multiple firms. Spark: ChainSecurity, Cantina |
| Bug bounty | $200K (Yearn Immunefi); Morpho, Lido, Spark bounties active |
| Production history | **~25.8 months** (March 12, 2024). V3 framework: ~24 months |
| TVL | 5,462 WETH (~$12.99M). Deposit limit: 15,000 WETH |
| Security incidents | None on V3, none on Lido stETH, none on Morpho/Gauntlet, none on Spark Lend |
| Strategy review | 12-metric ySec framework. Category-1 strictest tier |

**Score: 1.5 / 5** — strong audit coverage, ~25.8 months clean production, no incidents. The mild upward pressure relative to a perfect 1 reflects the LST-specific accounting mechanics on the Accumulator portion.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | 7-day delay on `ADD_STRATEGY` and `ACCOUNTANT`. Self-governed |
| Privileged roles | Well-distributed across Daddy, Brain, Security, Keeper, Debt Allocator |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.0 / 5** — textbook score-1 governance per the rubric.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals on-chain |
| Strategy reporting | Programmatic via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |
| LST unwind | **Management-paced** (manual functions); on-chain but operator-triggered |

**Programmability Score: 1.5 / 5** — fully programmatic at the vault level. The LST Accumulator's manual unwind is a single mild downward factor: settlement of large redemptions depends on management triggering on-chain functions, even though those functions themselves are deterministic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | 3 funded dependencies (Morpho/Gauntlet ~73%, Lido ~21%, Spark ~6%) |
| Criticality | Morpho critical (~73%); Lido high (~21%); Spark/Sky governance low (~6%) |
| Concentration | Single-venue concentration ~73% in Morpho Gauntlet WETH Prime |
| Quality | Top-tier across all three venues |

**Dependencies Score: 2.0 / 5** — three blue-chip dependencies. Quality is high across the mix, but ~73% Morpho concentration keeps this from being lower. Per rubric "1–2 blue-chip dependencies" = 2; the third venue (Spark, ~6%) is small enough not to push higher.

**Centralization Score = (1.0 + 1.5 + 2.0) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain across Morpho WETH positions, Spark Lend WETH positions, and Lido stETH |
| Collateral quality | Morpho/Gauntlet WETH Prime (top-tier curated lending), Lido stETH (largest LST $20B+ TVL multi-operator), Spark Lend (Sky-audited stack) |
| Leverage | None |
| Verifiability | Fully on-chain (with the documented `pendingRedemptions` lag mechanism on the Accumulator, currently dormant) |

**Score: 1.0 / 5** — top-tier collateral quality across the mix.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain ERC-4626 + on-chain Morpho / Spark / stETH balances + Lido withdrawal queue |
| Exchange rate | Programmatic, real-time at the vault level |
| Reporting | Keeper-driven, 10-day profit unlock |
| LST accounting lag | When the stETH Accumulator has an in-flight Lido withdrawal, `_harvestAndReport()` is blocked. Currently dormant (`pendingRedemptions = 0` at snapshot) but the mechanism re-engages on the next `initiateLSTWithdrawal()` |

**Score: 1.5 / 5** — excellent on-chain provability; the LST accounting-lag mechanism is dormant at this snapshot but remains a structural property of the Accumulator strategy.

**Funds Management Score = (1.0 + 1.5) / 2 = 1.25**

**Score: 1.25 / 5** — collateral quality is top-tier; the LST accounting-lag mechanism is a small but persistent provability factor.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Vault-level idle | 0 WETH (vault is fully deployed) |
| Atomic-unwind portion | ~79% of TVL through Morpho Gauntlet (~73%) + Spark (~6%) — both deep blue-chip lending markets |
| Manual-unwind portion | ~21% of TVL in stETH Accumulator; `availableWithdrawLimit()` returns only loose WETH |
| Underlying liquidity | Morpho Gauntlet WETH Prime is deep; Curve ETH/stETH deep; Lido queue 1–7 days normal load |
| Same-asset | WETH-denominated share token |
| Single-venue concentration | ~73% Morpho — the largest single-venue exposure in the mix |
| Withdrawal restrictions | None at vault level; effective restriction is `availableWithdrawLimit() = balanceOfAsset()` of the Accumulator strategy |

**Score: 2.0 / 5** — bulk of TVL (~79%) unwinds atomically through deep blue-chip lending markets, materially improved versus the prior 67%-idle / Accumulator-only posture. Score does not drop further because (a) ~73% concentration in a single venue (Morpho Gauntlet WETH Prime) means the atomic path depends on one market's utilization, and (b) the ~21% Accumulator portion still requires manual unwind for redemptions exceeding the atomic capacity.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. **Demonstrated again here** — pull-then-redeploy cycle completed within ~8 days, two strategies revoked in the process (per Yearn rsETH-precautionary, unverified attribution) |
| Monitoring | Active hourly alerts, vault in monitored list |
| Strategy unwind ops | Brain must actively pre-position WETH for redemptions exceeding the atomic Morpho + Spark capacity |

**Score: 1.0 / 5** — top-tier operational maturity. The Accumulator unwind operator dependency is captured in the liquidity score.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.25 | 30% | 0.375 |
| Liquidity Risk | 2.0 | 15% | 0.300 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.475 → 1.5 / 5.0** |

**Conservative rounding note (addresses prior P2 review feedback):** the April-27 snapshot of this vault scored Cat 4 = 2.5 (then 67% idle, almost all funded debt in the Accumulator), giving a raw 1.55. Under the framework's conservative rule (round half up to the higher / riskier score), 1.55 rounds to **1.6** (Low Risk). The May 5 redeployment moved ~79% of TVL into atomic Morpho + Spark venues, lowering Cat 4 to 2.0; the recomputed raw score is **1.475**, which rounds to **1.5** under the same conservative rule. The reported score is 1.5 (Minimal Risk, at the Minimal/Low boundary). If a future snapshot pushes any single sub-score upward — for example, Cat 4 back to 2.5 if the Accumulator share grows materially, or Cat 3B to 1.75 on extended `pendingRedemptions` — the score moves into Low Risk territory.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.5 / 5.0) — Approved, high confidence**

The score sits at the Minimal / Low Risk boundary. The dominant factors keeping it from a clean 1.0 are (a) ~73% single-venue concentration in Morpho Gauntlet WETH Prime, (b) the manual-unwind liquidity mechanic on the ~21% Accumulator portion, and (c) the dormant-but-structural LST accounting-lag mechanism. Reassessment should be re-run if the Accumulator share grows above 50% of vault TVL, if a new `initiateLSTWithdrawal()` is observed, or if either of the revoked Aave V3 strategies is re-funded.

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (November 2026) or annually
- **TVL-based:** Reassess if TVL exceeds 10,000 WETH or changes by ±50%
- **Allocation drift:**
  - Morpho Gauntlet WETH Prime share moves above 85% or below 50% of vault TVL
  - stETH Accumulator share grows above 50% of vault TVL — deeper review of the manual unwind path
  - any one venue exceeds 90% of vault TVL
- **Strategy changes (`addStrategy()` proposals at the Strategy Manager TimelockController, [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73), 7-day delay):**
  - any new strategy proposed for inclusion — re-review during the 7-day timelock window
  - any new strategy with leverage, looping, cross-chain bridging, or non-blue-chip routing
  - any new strategy with direct or indirect rsETH exposure (LayerZero OFT bridge contagion still recent — see [hgETH report](./kerneldao-hgeth.md))
  - re-funding of either revoked Aave V3 strategy ([`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0) or [`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8)) — would clarify the ongoing rationale of the May 5 revocations
- **Lido-specific:**
  - extended Lido withdrawal queue (>14 days) — degrades the 1:1 unwind path
  - stETH/ETH peg deviation > 1% sustained
  - any Lido contract upgrade or oracle change
  - any new `initiateLSTWithdrawal()` from the Accumulator — re-engages the `pendingRedemptions` accounting-lag mechanism that is dormant at this snapshot
- **Strategy-specific:**
  - `pendingRedemptions` failing to drain after expected Lido finalization
  - Brain unwind cadence (frequency / size of `manualSwapToAsset` and `initiateLSTWithdrawal` calls) drops materially
- **Morpho-specific:** Morpho Gauntlet WETH Prime sustained utilization > 95% — degrades the atomic unwind path on the largest single allocation
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Morpho / Lido / Spark / Curve
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

Snapshot at block 25031569 (May 5, 2026, 21:42 UTC).

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER                                  │
│                                                                       │
│  ┌────────────────────────────────────────┐                          │
│  │  yvWETH-1 (v3.0.2)                    │                          │
│  │  ERC-4626, immutable Vyper proxy       │                          │
│  │  0xc564…dDB0                           │                          │
│  │                                        │                          │
│  │  TVL: 5,462.15 WETH (~$12.99M)         │                          │
│  │   ├── 0 idle                           │                          │
│  │   └── 5,462.15 deployed across 3      │                          │
│  └─────────────────┬──────────────────────┘                          │
│                    │                                                  │
│   ┌────────────────┼────────────────────────────┐                    │
│   ▼                ▼                            ▼                    │
│ ┌──────────────┐ ┌──────────────────────┐ ┌────────────────────────┐ │
│ │ Spark WETH   │ │ Morpho Gauntlet      │ │ stETH Accumulator      │ │
│ │ Lender       │ │ WETH Prime           │ │ 0x470e…7435            │ │
│ │ 0x365c…9e15  │ │ Compounder           │ │                        │ │
│ │ 262.32 WETH  │ │ 0xeEB6…CBE7          │ │ 1,166.19 WETH (21.35%) │ │
│ │ 4.80%        │ │ 4,033.64 WETH        │ │                        │ │
│ │ Atomic       │ │ 73.85%               │ │ Stake: WETH→ETH→stETH  │ │
│ │ unwind       │ │ Atomic unwind        │ │ via Curve or Lido      │ │
│ │              │ │ subject to market    │ │                        │ │
│ │              │ │ utilization          │ │ Unwind (mgmt-only):    │ │
│ │              │ │                      │ │  manualSwapToAsset()   │ │
│ │              │ │                      │ │  initiateLSTWithdrawal │ │
│ │              │ │                      │ │  manualClaimWithdrawals│ │
│ │              │ │                      │ │                        │ │
│ │              │ │                      │ │ pendingRedemptions = 0 │ │
│ │              │ │                      │ │ (req #121758 cleared)  │ │
│ └──────────────┘ └──────────────────────┘ └────────────────────────┘ │
│                                                                       │
│  Revoked between Apr 27 and May 5 (activation = 0):                   │
│   • Aave V3 Lido WETH Lender — 0xC7bA…8DF0                            │
│   • Aave V3 WETH Lender      — 0x5ABc…0dB8                            │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          UNDERLYING                                   │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Morpho protocol        │  │ Spark Lend (Sky        │               │
│  │ + Gauntlet curator     │  │ sub-DAO)               │               │
│  │ $6.6B+ TVL             │  │ ChainSecurity/Cantina  │               │
│  │ 25+ audits             │  │ audited stack          │               │
│  └────────────────────────┘  └────────────────────────┘               │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Lido stETH             │  │ Curve ETH/stETH pool   │               │
│  │ $20B+ TVL              │  │ 0xDC24…7022            │               │
│  │ Multi-operator         │  │ Stake-on-better-quote, │               │
│  │ Shapella withdrawals   │  │ manual unwind venue    │               │
│  └────────────────────────┘  └────────────────────────┘               │
│  ┌────────────────────────┐                                           │
│  │ Lido Withdrawal Queue  │                                           │
│  │ 0x889e…F9B1            │                                           │
│  │ 1:1, 1–7 days normal   │                                           │
│  └────────────────────────┘                                           │
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
