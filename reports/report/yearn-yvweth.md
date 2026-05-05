# Protocol Risk Assessment: Yearn — yvWETH-1

- **Assessment Date:** April 27, 2026
- **Token:** yvWETH-1 (WETH-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0)
- **Final Score: 1.5/5.0**

## Overview + Links

yvWETH-1 is a **WETH-denominated Yearn V3 vault** (ERC-4626) that deploys deposited WETH into yield strategies on Ethereum mainnet. The vault currently has only **one funded strategy** — the **stETH Accumulator** — which converts WETH to ETH and stakes via Lido (either directly via `submit{value}()` or via Curve when the pool quotes a better-than-1:1 rate). The remaining ~67% of vault TVL is **idle WETH** held at the vault level.

Per the Yearn team, the current oversized idle posture reflects a precautionary deallocation following the **April 18, 2026 rsETH (KelpDAO) bridge exploit** on the LayerZero OFT bridge layer (see the [hgETH reassessment report](./kerneldao-hgeth.md) for verified on-chain facts about that event). Funds were pulled from yvWETH-1's previously funded Aave / Morpho strategies because some of those underlying lending markets *could* indirectly hold rsETH as collateral. **None of the queued strategies on yvWETH-1 reference rsETH directly**, so the deallocation is precautionary, not corrective. The team's causal attribution has not been independently verified against an off-chain or on-chain source, but the rsETH event itself and its general market impact are well documented.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting WETH deposits, issuing yvWETH-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Strategy:** the **stETH Accumulator** is the only funded strategy. It converts WETH to ETH and stakes either via Curve ETH/stETH ([`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022)) when the pool quotes a better-than-1:1 rate, or directly via Lido `submit{value}()` for a guaranteed 1:1
- **Withdrawal mechanics:** the Accumulator does **not auto-unwind on user withdrawal** — `availableWithdrawLimit()` returns only the strategy's loose WETH balance. Larger redemptions are management-paced (manual unwind via Curve or the Lido withdrawal queue)
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions
- **Multi-strategy capable:** 5 strategies in the default queue (stETH Accumulator, Spark WETH Lender, Aave V3 Lido WETH, Morpho Gauntlet WETH, Aave V3 WETH); only the stETH Accumulator is currently funded

**Key metrics (April 27, 2026, snapshot at block 24974187):**

- **TVL:** 4,077.94 WETH (~$9.33M at ETH/USD = $2,288.82, [Chainlink ETH/USD feed](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419))
- **Total Supply:** 3,897.31 yvWETH-1
- **Price Per Share:** 1.046349 WETH/yvWETH-1 (~4.63% cumulative appreciation over ~25.5 months, ~2.2% annualized)
- **Total Debt:** 1,350.10 WETH (~33.1% deployed) — all in the stETH Accumulator
- **Total Idle:** 2,727.94 WETH (~66.9% idle at the vault)
- **Deposit Limit:** 15,000 WETH
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Accounting caveat — pending Lido withdrawal:** at the snapshot block, the stETH Accumulator's `current_debt` and `totalAssets()` report **1,350.10 WETH**, but the strategy's actual on-chain composition is:

- 355.37 stETH held directly
- 1,000 stETH in pending Lido withdrawal request **#121758** (requested 2026-04-20 20:23 UTC; `getWithdrawalStatus([121758]).isFinalized = false` as of 2026-04-27 21:57 UTC)
- 0 WETH balance, 0 wstETH

While `pendingRedemptions > 0`, `_harvestAndReport()` is blocked, so any peg slippage between the requested-stETH value and 1:1 WETH is not realized into PPS until the request is finalized and `manualClaimWithdrawals()` is run. **Do not read the 1,350.10 WETH figure as real-time, on-chain liquid backing**; the in-flight portion settles only when Lido finalizes. Verified against `BaseLSTAccumulator.sol` on Etherscan.

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

### Active Strategies (5 in default queue, 1 with debt)

| # | Strategy | Name | Current Debt (WETH) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | **stETH Accumulator** | **1,350.10** | **33.1% of vault TVL** |
| 2 | [`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15) | Spark WETH Lender | 0 | 0% |
| 3 | [`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0) | Aave V3 Lido WETH Lender | 0 | 0% |
| 4 | [`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7) | Morpho Gauntlet WETH Prime Compounder | 0 | 0% |
| 5 | [`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8) | Aave V3 WETH Lender | 0 | 0% |

**Current funding posture:** only the stETH Accumulator is funded, at 1,350 WETH. Per the Yearn team this is a precautionary deallocation following the April 18, 2026 rsETH bridge exploit (unverified attribution); the previously-funded Aave / Morpho strategies were exited because some of their underlying lending markets *could* indirectly hold rsETH as collateral. None of the queued strategies reference rsETH directly. Reassess once funds are re-deployed and the steady-state strategy mix is observable on-chain.

### Strategy Protocol Dependencies

| Protocol | Strategy | Allocation |
|----------|----------|-----------|
| **Lido (stETH)** | stETH Accumulator | **~33.1% of vault TVL (100% of deployed)** |
| Spark | Spark WETH Lender | 0% (queue only) |
| Aave V3 Lido market | Aave V3 Lido WETH Lender | 0% (queue only) |
| Morpho | Morpho Gauntlet WETH Prime Compounder | 0% (queue only) |
| Aave V3 | Aave V3 WETH Lender | 0% (queue only) |
| **Curve ETH/stETH pool** | stETH Accumulator (stake / unwind path) | Indirect dependency |
| **Lido withdrawal queue** | stETH Accumulator (unwind path) | Indirect dependency |

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

- **1 funded strategy** today (stETH Accumulator). Other 4 in queue but unfunded
- **Pipeline:** WETH → ETH (unwrap) → stETH (Curve or Lido `submit`)
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit / withdrawal at the vault level
- **Manual unwind** is the only complexity layer — `_freeFunds()` is a no-op on the Accumulator, so larger user redemptions depend on management pre-positioning loose WETH
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~25.5 months** in production
- **TVL:** 4,077.94 WETH (~$9.33M)
- **PPS trend:** 1.000000 → 1.046349 (~4.63% cumulative return over ~25.5 months, ~2.2% annualized — reflects long periods at lower deployment ratios)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management — Aave / Morpho / Spark WETH strategies queued and funded historically; current state is post-deallocation
- **Yearn V3 track record:** V3 framework live since May 2024 (~23 months). No V3 vault exploits

**Lido track record:** $20B+ TVL, longest-running LST, Shapella enabled withdrawals (June 2023). Curve stETH/ETH peg has been stable post-Shapella with brief periods of slight discount during stress events.

## Funds Management

yvWETH-1 currently deploys ~33% of TVL into the stETH Accumulator. The remaining ~67% is idle (per the Yearn team, a precautionary deallocation following the April 18, 2026 rsETH bridge exploit — unverified attribution).

### Strategy 1: stETH Accumulator (~33.1% of vault TVL, 100% of deployed funds)

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

**Current strategy state (snapshot block 24974187):**

| Field | Value |
|-------|-------|
| `balanceOfAsset()` (loose WETH) | 0 WETH |
| Direct stETH balance | 355.37 stETH |
| `pendingRedemptions` | 1,000 stETH |
| `estimatedTotalAssets()` | 355.37 WETH |
| `totalAssets()` (TokenizedStrategy) | 1,350.10 WETH |
| Vault `current_debt` for this strategy | 1,350.10 WETH |
| Outstanding Lido withdrawal | Request **#121758** (1,000 stETH, requested 2026-04-20 20:23 UTC, `isFinalized = false` as of 2026-04-27 21:57 UTC) |

The 994.73 WETH gap between `estimatedTotalAssets()` (355.37) and `current_debt` (1,350.10) is the in-flight Lido withdrawal. While the request is unfinalized, peg slippage is not realized into PPS.

**Strategy parameters:**
- Activated: 2026-04-16
- Last reported: 2026-04-26
- Management: Brain multisig (3-of-8) and Debt Allocator
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Strategies 2–5: Spark / Aave V3 / Morpho WETH (0% allocation)

Queued but unfunded today:

- **Spark WETH Lender** ([`0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15`](https://etherscan.io/address/0x365cC9c28Df1663fA37C565A3aC1Addc3A219e15)) — direct supply into Spark Lend
- **Aave V3 Lido WETH Lender** ([`0xC7baE383738274ea8C3292d53AfBB3b42B348DF0`](https://etherscan.io/address/0xC7baE383738274ea8C3292d53AfBB3b42B348DF0)) — supply into the Aave V3 Lido WETH market
- **Morpho Gauntlet WETH Prime Compounder** ([`0xeEB6Be70fF212238419cD638FAB17910CF61CBE7`](https://etherscan.io/address/0xeEB6Be70fF212238419cD638FAB17910CF61CBE7)) — direct WETH deposit into the Morpho Gauntlet vault
- **Aave V3 WETH Lender** ([`0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8`](https://etherscan.io/address/0x5ABcBBDbf617a21F7667e8cfD17Fa16475D20dB8)) — direct supply into the standard Aave V3 WETH market

These strategies have been previously funded and are kept in the queue for re-allocation once the rsETH-precaution deallocation reverses.

### Accessibility

- **Deposits:** Permissionless ERC-4626 — anyone can deposit WETH and receive yvWETH-1. Subject to 15,000 WETH deposit limit
- **Withdrawals:** ERC-4626 — but **see the "Liquidity Risk" section below.** User redemptions are atomic from the vault-level idle balance plus the strategy's loose WETH; they do NOT auto-unwind staked stETH. Larger redemptions depend on management pre-positioning WETH
- **No cooldown or lock period** at the vault level
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% on-chain backing** in WETH or stETH. The vault holds WETH directly (idle) plus the strategy's stETH position (and, when active, in-flight Lido withdrawal requests)
- **Collateral quality:** Lido stETH is the largest LST (~$20B+ TVL), audited by multiple firms, multi-operator (30+ node operators)
- **No leverage** — the Accumulator is a simple stake / unstake pattern
- **Redeemability:** stETH can be unwound either via Curve (subject to peg slippage) or via the Lido withdrawal queue (1–7 days under normal load, 1:1 redemption)

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads on-chain stETH balance and pending redemption tracking
- **Caveat:** while a Lido withdrawal is in flight (`pendingRedemptions > 0`), `_harvestAndReport()` is blocked and the strategy continues to value the in-flight portion at its pre-request mark. Accounting can therefore lag actual settlement until the request is finalized and `manualClaimWithdrawals()` is run. The current example (request #121758) is documented above
- **Profit / loss:** reported by keeper via `process_report()`, locked over 10 days

## Liquidity Risk

| Aspect | Detail |
|--------|--------|
| Vault-level idle | 2,727.94 WETH (~67% of TVL) — atomic, no slippage |
| Strategy loose WETH | 0 WETH at snapshot |
| Strategy stETH | 355.37 stETH directly + 1,000 stETH pending Lido withdrawal #121758 |
| `availableWithdrawLimit()` | Returns only `balanceOfAsset()` of the strategy — **no auto-unwind** |
| Manual unwind paths | (a) Curve (immediate, peg-dependent), (b) Lido queue (1–7 days, 1:1) |
| Curve ETH/stETH pool depth | Deep pool; stETH peg has been stable post-Shapella |
| Lido queue normal load | 1–7 days for finalization |
| Cooldown / restrictions | None at the vault level |

**Practical implications:**

- **Small / medium withdrawals** (up to the ~67% idle balance, ~$6.24M at snapshot) settle atomically with no slippage
- **Larger withdrawals** beyond idle require management to pre-position WETH:
  - Via `manualSwapToAsset()` — immediate but subject to Curve peg slippage
  - Via `initiateLSTWithdrawal()` → wait → `manualClaimWithdrawals()` — 1:1 but 1–7 days under normal load
- **Lido queue can extend** under stress (post-merge withdrawal congestion, large coordinated unstake events)
- **Same-asset:** vault token is WETH-denominated; no price-divergence risk on the share
- **Deposit limit:** 15,000 WETH cap vs 4,078 WETH TVL (room for +268%)

The on-chain reality is that `availableWithdrawLimit()` is **deliberately constrained** to the strategy's loose WETH balance — verified in `BaseLSTAccumulator.sol`. This is a design choice to prevent forced-sale of stETH at a discount during peg events, but it means **larger redemptions are management-paced, not user-paced**.

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
| **Lido (stETH)** | Critical — 100% of deployed funds | Largest LST, $20B+ TVL, well-audited stack, multi-operator. Shapella-enabled withdrawals work 1:1 within 1–7 days |
| **Curve ETH/stETH pool** | High (unwind path) | Used for both staking (when better than 1:1) and manual unwind. Peg has been stable post-Shapella |
| **Lido withdrawal queue** | High (unwind path) | 1:1 redemption, 1–7 days normal load |

**Dependency quality:** Lido is the highest-quality LST infrastructure available. Curve ETH/stETH is the deepest stETH liquidity venue. The dependency profile is concentrated (Lido) but uses top-tier infrastructure throughout.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code (including `BaseLSTAccumulator.sol`) verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit. $200K Immunefi bug bounty for responsible disclosure
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault and migrating
- **Strategy-level operational risk:** the management-paced unwind for stETH means yvWETH-1 has a higher operational dependency on Brain than the all-stable vaults — Brain must monitor incoming withdrawal demand and pre-position WETH

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
| stETH Accumulator | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | `totalAssets()`, `estimatedTotalAssets()`, `pendingRedemptions`, `balanceOfAsset()`, `isShutdown()`, keeper report frequency |
| Lido stETH | [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) | Total supply, exchange rate, pause state |
| Lido Withdrawal Queue | [`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) | Strategy's outstanding withdrawal request status |
| Curve ETH/stETH | [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) | stETH/ETH peg, pool depth |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **PPS decrease** — should only increase outside of explicit loss events
- **stETH/ETH peg deviation** — directly affects yvWETH-1's manual unwind via Curve
- **Lido withdrawal queue length** — extended queue degrades the 1:1 unwind path
- **`pendingRedemptions` not draining** after expected finalization — points to stuck or slow Lido withdrawal
- **Idle ratio extreme moves** — currently 67% idle (rsETH-precaution); reverting to fully-deployed should be visible on-chain
- **Strategy additions / removals** — `StrategyChanged` events
- **ySafe signer / threshold changes**
- **Lido pause** — would impact stETH redemption mechanics

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

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by 3 top firms, ~23 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Top-tier underlying:** Lido is the largest LST ($20B+ TVL), with a well-audited stack, multi-operator set, and Shapella-enabled 1:1 ETH withdrawals
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Conservative LST integration:** the stETH Accumulator's design (no auto-unwind, `pendingRedemptions` blocks reporting, peg buffer) deliberately avoids forced-sale of stETH at a discount during peg events
- **Immutable vault contract**
- **Active monitoring** via Yearn's monitoring-scripts repo
- **No leverage. No cross-chain.**

### Key Risks

- **Manual unwind / management-paced larger redemptions:** the stETH Accumulator does not auto-unwind on user withdrawal. `availableWithdrawLimit()` returns only the strategy's loose WETH balance. Larger redemptions depend on Brain pre-positioning WETH via Curve (immediate, peg-dependent) or the Lido queue (1:1, 1–7 days normal load)
- **Accounting lag during pending Lido withdrawals:** while `pendingRedemptions > 0`, `_harvestAndReport()` is blocked. The current example (request #121758, 1,000 stETH unfinalized as of snapshot) means the strategy's `totalAssets()` reports 1,350.10 WETH while real on-chain composition is 355.37 stETH + the in-flight request. Peg slippage is not realized into PPS until finalization
- **Idle posture (~67% of TVL undeployed):** per the Yearn team this is a precautionary deallocation following the April 18, 2026 rsETH bridge exploit (see [hgETH report](./kerneldao-hgeth.md) for verified facts about the event); attribution to that specific cause is unverified, but the event itself is well documented. The current strategy mix does not reflect steady-state operation
- **stETH peg risk under stress:** Curve ETH/stETH peg has been stable post-Shapella but historical depeg events have happened (e.g. June 2022 ~5% discount). During stress, manual unwind via Curve would realize that discount
- **Lido queue extension under stress:** normal 1–7 days can extend significantly during large coordinated unstake events
- **Brain-dependent operational tempo:** because the Accumulator unwinds manually, yvWETH-1 has a higher operational dependency on Brain than the all-stable vaults

### Critical Risks

- None identified. The dominant systemic risk would be a Lido stETH integrity failure (validator slashing event large enough to break 1:1, oracle compromise, contract bug). All gates pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Lido audited by multiple firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + on-chain stETH balances + Lido withdrawal queue all verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with named signers, 7-day timelock on critical roles. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Lido: multiple firms |
| Bug bounty | $200K (Yearn Immunefi); Lido bounty active |
| Production history | **~25.5 months** (March 12, 2024). V3 framework: ~23 months |
| TVL | 4,077 WETH (~$9.33M). Deposit limit: 15,000 WETH |
| Security incidents | None on V3, none on Lido stETH |
| Strategy review | 12-metric ySec framework. Category-1 strictest tier |

**Score: 1.5 / 5** — strong audit coverage, ~25 months clean production, no incidents. The mild upward pressure relative to a perfect 1 reflects the partial deployment posture and the LST-specific accounting mechanics.

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
| Protocol count | 1 active funded dependency (Lido); 4 dormant (Spark, Aave V3 Lido, Morpho, Aave V3) |
| Criticality | Lido critical for 100% of deployed funds (~33% of vault TVL) |
| Quality | Top-tier — Lido is the largest LST, well-audited, multi-operator |

**Dependencies Score: 2.0 / 5** — single blue-chip dependency for funded portion; per rubric "1–2 blue-chip dependencies" = 2.

**Centralization Score = (1.0 + 1.5 + 2.0) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain in WETH or stETH |
| Collateral quality | Lido stETH (largest LST, $20B+ TVL, multi-operator) |
| Leverage | None |
| Verifiability | Fully on-chain (with the documented `pendingRedemptions` lag) |

**Score: 1.0 / 5** — top-tier.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain ERC-4626 + on-chain stETH + Lido withdrawal queue |
| Exchange rate | Programmatic, real-time at the vault level |
| Reporting | Keeper-driven, 10-day profit unlock |
| LST accounting lag | While `pendingRedemptions > 0`, `_harvestAndReport()` is blocked — accounting lags actual settlement until finalization. Documented and visible on-chain |

**Score: 1.5 / 5** — excellent on-chain provability with one documented lag mechanism around in-flight Lido withdrawals.

**Funds Management Score = (1.0 + 1.5) / 2 = 1.25**

**Score: 1.25 / 5** — collateral quality is top-tier; the LST accounting lag is a small but real provability factor.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Vault-level idle | ~67% of TVL is loose WETH at the vault — atomic |
| Strategy unwind | **Manual / management-paced.** No auto-unwind |
| Underlying liquidity | Curve ETH/stETH deep; Lido queue 1–7 days normal load |
| Same-asset | WETH-denominated share token |
| Withdrawal restrictions | None at vault level; effective restriction is `availableWithdrawLimit() = balanceOfAsset()` of the strategy |

**Score: 2.5 / 5** — small and medium withdrawals are excellent (idle balance covers them), but larger redemptions depend on stETH peg or Lido queue. The strategy explicitly does not auto-unwind, which is by design but materially affects user-paced liquidity.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi |
| Monitoring | Active hourly alerts, vault in monitored list |
| Strategy unwind ops | Brain must actively pre-position WETH for larger withdrawals |

**Score: 1.0 / 5** — top-tier operational maturity. The unwind operator dependency is captured in the liquidity score.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.25 | 30% | 0.375 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.55 → 1.5 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.5 / 5.0) — Approved, high confidence**

The score sits at the boundary between Minimal and Low Risk, reflecting the manual-unwind liquidity mechanic and the partial deployment posture. The vault score should be re-checked once the rsETH-related deallocation reverses and the steady-state strategy mix is observable on-chain.

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (October 2026) or annually
- **TVL-based:** Reassess if TVL exceeds 10,000 WETH or changes by ±50%
- **Strategy posture:**
  - **rerun this assessment once the idle ~67% is re-deployed** — current strategy mix does not reflect steady-state operation
  - if the stETH Accumulator scales beyond 50% of vault TVL, deeper review of the manual unwind path
  - if a new strategy is added that takes leverage or routes through a non-blue-chip protocol, full re-review
  - if any new strategy is added that takes direct or indirect rsETH exposure, re-evaluate the dependency subscore
- **Lido-specific:**
  - extended Lido withdrawal queue (>14 days) — degrades the 1:1 unwind path
  - stETH/ETH peg deviation > 1% sustained
  - any Lido contract upgrade or oracle change
- **Strategy-specific:**
  - `pendingRedemptions` failing to drain after expected Lido finalization
  - Brain unwind cadence (frequency / size of `manualSwapToAsset` and `initiateLSTWithdrawal` calls) drops materially
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Lido / Curve
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvWETH-1 (v3.0.2)   │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  0xc564…dDB0          │                                          │
│  │                       │                                          │
│  │  4,078 WETH TVL       │                                          │
│  │   ├── 2,728 idle      │  ← user redemption pool                  │
│  │   └── 1,350 → strat   │                                          │
│  └──────────┬────────────┘                                          │
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  stETH ACCUMULATOR (1,350 WETH allocated, 33% of TVL)            ││
│  │  0x470e…7435                                                     ││
│  │                                                                  ││
│  │  Stake: WETH→ETH→stETH (Curve or Lido submit)                    ││
│  │  Unwind (manual, mgmt-only):                                     ││
│  │     manualSwapToAsset()      → Curve, immediate                  ││
│  │     initiateLSTWithdrawal()  → Lido queue, 1–7 days, 1:1         ││
│  │     manualClaimWithdrawals() → claim finalized request           ││
│  │                                                                  ││
│  │  Snapshot: 355 stETH direct + 1,000 stETH in Lido req #121758    ││
│  │  pendingRedemptions blocks _harvestAndReport during in-flight    ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  4 dormant strategies in queue (Spark, Aave V3 Lido, Morpho, Aave)   │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    UNDERLYING                                          │
│  ┌──────────────────────────┐    ┌──────────────────────────┐         │
│  │  Lido stETH              │    │  Curve ETH/stETH pool    │         │
│  │  $20B+ TVL               │    │  0xDC24…7022             │         │
│  │  Multi-operator          │    │  Stake-on-better-quote   │         │
│  │  Shapella withdrawals    │    │  Manual unwind venue     │         │
│  └──────────────────────────┘    └──────────────────────────┘         │
│  ┌──────────────────────────┐                                         │
│  │  Lido Withdrawal Queue   │                                         │
│  │  0x889e…F9B1             │                                         │
│  │  1:1, 1–7 days normal    │                                         │
│  └──────────────────────────┘                                         │
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
