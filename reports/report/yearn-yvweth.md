# Protocol Risk Assessment: Yearn — yvWETH-1

- **Assessment Date:** May 11, 2026 (Updated: November 23, 2026)
- **Token:** yvWETH-1 (WETH-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0)
- **Final Score: 1.49/5.0**

## Overview + Links

yvWETH-1 is a **WETH-denominated Yearn V3 vault** (ERC-4626) that deploys deposited WETH into yield strategies on Ethereum mainnet. At the November 23 snapshot the vault is **100% deployed** (`totalIdle() = 0`) across **two funded strategies**: the **stETH Accumulator** holds 2,783.04 WETH of `current_debt` (61.70% of `totalDebt()`), and **Yearn OG WETH**, a Yearn-curated Morpho MetaMorpho vault, holds 1,727.77 WETH (38.30%). Two more strategies are attached with zero debt: the **Spark WETH Lender** (in the default queue) and the **wstETH/WETH Spark Looper** (not in the queue). yvWETH-1 holds no looper shares.

The vault's `totalDebt()` (4,510.81 WETH) reconciles exactly with strategy debt: 2,783.04 (stETH Accumulator) + 1,727.77 (Yearn OG WETH) = 4,510.81 WETH.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting WETH deposits and issuing yvWETH-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) by the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0)). `use_default_queue() = true`, so withdrawals always follow the default queue.
- **Funded strategies (2):**
  - **stETH Accumulator** ([`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)): 2,783.04 WETH `current_debt` (61.70%). The strategy holds 2,784.10 stETH and 0 WETH.
  - **Yearn OG WETH** ([`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC)): 1,727.77 WETH `current_debt` (38.30%). This is a **Morpho MetaMorpho V1.1 vault** (`MORPHO()` returns [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb)). yvWETH-1 holds 99.13% of its shares, worth 1,727.81 WETH of its 1,742.93 WETH `totalAssets()`. Listed at https://app.morpho.org/ethereum/vault/0xE89371eAaAC6D46d4C3ED23453241987916224FC/yearn-og-weth
- **Withdrawal mechanics:** the stETH Accumulator **does not auto-unwind on user withdrawal**. Its `availableWithdrawLimit()` returns only loose WETH (0 at the snapshot), so redemptions beyond the Morpho portion wait for Brain to unwind stETH through Curve or the Lido withdrawal queue. Yearn OG WETH reports `maxWithdraw(yvWETH-1) = 1,727.81 WETH`, the full position.
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) under the **Yearn 6-of-9 ySafe** (Daddy), with a **7-day TimelockController** on strategy additions. A Brain + Daddy role-manager handover can bypass that delay (see [Critical Permission Paths](#critical-permission-paths-and-weakest-link)).

**Key metrics (November 23, 2026, snapshot at [block 26479415](https://etherscan.io/block/26479415), hash `0x922b142867e85cb577aeb9a31a6e7c083334b5b48bb6f40d1bb53452705f089b`, 17:45:59 UTC):**

- **TVL:** 4,510.81 WETH (~$7.81M at ETH/USD = $1,731.47, [Chainlink ETH/USD feed](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419))
- **Total Supply:** 4,259.44 yvWETH-1
- **Price Per Share:** 1.059014 WETH/yvWETH-1. 30-day growth from 1.056331 at [block 26263415](https://etherscan.io/block/26263415) is ~3.1% annualized, net of fees
- **Total Debt:** 4,510.81 WETH (100% deployed)
- **Total Idle:** 0 WETH (`minimum_total_idle() = 0`)
- **Deposit Limit:** 15,000 WETH (no deposit or withdraw limit module)
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee (shared [Accountant](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69))

**Depositor concentration (from `Transfer` logs through the snapshot block, confirmed with `balanceOf`):**

| Holder | Shares | ≈ WETH | Share of supply |
|--------|-------:|-------:|----------------:|
| [Yearn yETH Recovery Vault](https://etherscan.io/address/0xd7a540ba3626c0aa66e7db4088971d0cd64695b6) (Yearn V3 vault) | 1,552.03 | 1,643.63 | 36.4% |
| [Alchemix mixWETH `ERC4626Strategy`](https://etherscan.io/address/0x8aacc947c2f4e24d2be4cba4498f004079f35d87) (adapter of [WETH Mix Yield Token](https://etherscan.io/address/0x29bcfeD246ce37319d94eBa107db90C453D4c43D)) | 1,296.73 | 1,373.26 | 30.4% |
| [StrategyRouterV3-WETH](https://etherscan.io/address/0x85907b1af27fd04a5efabc0fb7162f8690a6b82f) | 445.90 | 472.21 | 10.5% |

Yearn Treasury ([`0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde`](https://etherscan.io/address/0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde)) and Daddy together own 65.8% of the yETH Recovery Vault (1,602.39 of 2,433.93 shares). That position is the Treasury deposit described in the [veYFI Snapshot proposal](https://snapshot.org/#/s:veyfi.eth/proposal/0xe76f57663ce9311eb830ef097812702cbbb55fccbb280d254cdfc1f2c11c261a). The Treasury also holds 140.00 yvWETH-1 directly and Daddy holds 32.60.

**Pending strategy addition:** a Strategy Manager batch scheduled in [tx `0xf2ac69b26faa0ebcffcf6bdc8ea20263ca70331dc28336121a053b0d180b63ac`](https://etherscan.io/tx/0xf2ac69b26faa0ebcffcf6bdc8ea20263ca70331dc28336121a053b0d180b63ac) on November 16, 2026 includes `add_strategy` and `update_max_debt_for_strategy(10,000 WETH)` on yvWETH-1. The target is the **Flex wstETH/WETH Lender** ([`0x61b1DEf6D44D5052dBAc0aD20E4648F7F9d708d5`](https://etherscan.io/address/0x61b1DEf6D44D5052dBAc0aD20E4648F7F9d708d5), `LidoFlexLenderStrategy`, management = Brain). The operation became executable at 16:39 UTC on November 23 and had not been executed at the snapshot (`isOperationPending = true`). The strategy has 0 `totalAssets()`. It is a lender into a [Flex](./flex.md) wstETH-collateral market and is not part of the current allocation.

**Lido withdrawal state:** `pendingRedemptions() = 0` on the Accumulator, so the accounting-lag mechanism is dormant. Withdrawal #121758 from April 2026 is finalized and claimed.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Lido Documentation](https://docs.lido.fi/)
- [Lido Security](https://docs.lido.fi/security/audits/)
- [Morpho Documentation](https://docs.morpho.org/)
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

Vault role bitmasks read with `roles(address)` at the snapshot block. Safe thresholds read with `getThreshold()` / `getOwners()`.

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Manages 40 vaults. `governance()` = Strategy Manager Timelock; immutable `chad` = Daddy. Holds no vault roles itself but is the vault's `role_manager()` |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Safe (v1.3.0) — 12 of 14 vault roles (`0x3FF6`; all except ADD_STRATEGY and ACCOUNTANT). Yearn BORG: `borgCore` guard and three modules (see [Governance](#governance)) |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-6 Safe — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY (`0x3972`). `management()` of the three tokenized strategies (Accumulator, Spark WETH Lender, Spark Looper) |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Safe — DEBT, MAX_DEBT, EMERGENCY (`0x20C0`). `emergencyAdmin` of the three tokenized strategies; owner of Yearn OG WETH |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController, `getMinDelay() = 604800` (7 days). ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (`0x8F`). Self-governed |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING (`0x20`); keeper of the three tokenized strategies |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Proxy — REPORTING + DEBT_MANAGER (`0x60`) |
| Morpho Curator Safe | [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) | 2-of-3 Safe (v1.4.1) — curator of Yearn OG WETH |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) |
| Vault Original (v3.0.2) | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) |
| TokenizedStrategy (v3.0.4, shared by all attached strategies) | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) |

### Attached Strategies

Read with `strategies(address)` on the vault and `totalAssets()` on each strategy. The active set was checked against every `StrategyChanged` event on the vault since deployment: 14 additions and 10 revocations leave these four.

| # | Strategy | Name | Current Debt (WETH) | Pct of TotalDebt | max_debt (WETH) | In Default Queue? |
|---|----------|------|--------------------:|-----------:|----------:|-----------|
| 1 | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | **stETH Accumulator** | **2,783.04** | **61.70%** | 10,000 | YES (position 0) |
| 2 | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | **Yearn OG WETH** (Morpho MetaMorpho V1.1) | **1,727.77** | **38.30%** | 15,000 | YES (position 1) |
| 3 | [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151) | Spark WETH Lender | 0 | 0% | 15,000 | YES (position 2) |
| 4 | [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | wstETH/WETH Spark Looper | 0 | 0% | 2,000 | NO |

The Spark WETH Lender has 0 `totalAssets()`. The looper holds 1,044.35 WETH of `totalAssets()` for other depositors; yvWETH-1 holds none of its shares. Both remain attached, so Brain, Security, or the Debt Allocator can fund them again up to `max_debt` without a timelock.

### Strategy Protocol Dependencies

| Protocol | Strategy | Allocation |
|----------|----------|-----------:|
| **Lido (stETH)** | stETH Accumulator | **61.70% of vault totalDebt** |
| **Morpho Blue** | Yearn OG WETH (MetaMorpho) | **38.30% of vault totalDebt** |
| Lido (wstETH, as Morpho collateral) | Yearn OG WETH → wstETH/WETH markets | 79.9% of Yearn OG WETH (~30.6% of vault) |
| ether.fi (weETH, as Morpho collateral) | Yearn OG WETH → weETH/WETH market | 20.1% of Yearn OG WETH (~7.7% of vault) |
| **Curve ETH/stETH pool** | stETH Accumulator (stake / unwind path) | Indirect dependency |
| **Lido withdrawal queue** | stETH Accumulator (unwind path) | Indirect dependency |

Spark Lend has no yvWETH-1 exposure at the snapshot. Both Spark strategies are still attached and can be refunded.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Lido Audits (Underlying Protocol)

Lido is one of the most extensively audited LSTs in DeFi. Audits include MixBytes, Quantstamp, Sigma Prime, Statemind, Oxorio, ChainSecurity, and others. See [Lido security](https://docs.lido.fi/security/audits/) for the full list.

### Morpho

Morpho Blue and MetaMorpho V1.1 are covered in Morpho's [security documentation](https://docs.morpho.org/). Yearn OG WETH is a standard, immutable `MetaMorphoV1_1` deployment (verified on Etherscan).

### Curve ETH/stETH Pool

Audited as part of Curve's StableSwap suite. Pool address [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022).

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvWETH-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1` at block 26479415), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Lido (Immunefi):** active bug bounty
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

- **2 funded strategies** at the snapshot
  - **stETH Accumulator**: WETH → ETH (unwrap) → stETH (Curve or Lido `submit`). Two hops; 61.70% of totalDebt
  - **Yearn OG WETH**: MetaMorpho vault lending WETH into three Morpho Blue markets (wstETH/WETH at 96.5% and 94.5% LLTV, weETH/WETH at 94.5% LLTV). Atomic withdrawal subject to market liquidity. 38.30% of totalDebt
- **No leverage in funded strategies**; the leveraged wstETH/WETH Spark Looper carries no yvWETH-1 debt
- **No cross-chain bridging**
- **Standard ERC-4626** deposit / withdrawal at the vault level
- **Vault is immutable** (non-upgradeable Vyper minimal proxy). Strategies are Yearn V3 tokenized strategies that delegate to a constant TokenizedStrategy address and have no upgrade path

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)), **~32 months** in production
- **TVL:** 4,510.81 WETH (~$7.81M) at the snapshot. Onchain `totalAssets()`: 8,399.59 WETH at [block 25615415](https://etherscan.io/block/25615415) (late July), 7,613.95 WETH at [block 26263415](https://etherscan.io/block/26263415) (October 24), 5,022.51 WETH at [block 26378615](https://etherscan.io/block/26378615) (November 9)
- **October 29 – November 18, 2026 outflow:** the Alchemix mixWETH adapter withdrew at least 3,989 WETH in eight transactions of up to 500 WETH each (withdrawals of 100 WETH or more) (first: [tx](https://etherscan.io/tx/0x9397aba4cf034672626755192db47493d7d94e1e073c2ec7789116dae8b0d8e7); last: [tx](https://etherscan.io/tx/0xfffeb98b10dd55f73231feb9d1f82f75ed82e8d800751e203feca435b3e002a3)). It also redeposited 999.8 WETH on November 5 ([tx](https://etherscan.io/tx/0x1d239bb377cdc75459adf2aa67a64c68e0f304d6dec78c3ebe214e9dd854522f)). This accounts for most of the 40.8% fall in TVL over 30 days
- **PPS trend:** 1.000000 → 1.059014 (~5.9% cumulative over ~32 months, ~2.2% annualized; ~3.1% annualized over the last 30 days)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management. The Spark WETH Lender and the wstETH/WETH Spark Looper were activated on June 26, 2026 ([tx](https://etherscan.io/tx/0xa5a2d4dc5273016bfbf6f4cfd56ff580a8f9677e98ef0119a7066749c3656b11)) and both carry zero yvWETH-1 debt at the snapshot. Yearn OG WETH was added on May 24, 2026 ([tx](https://etherscan.io/tx/0x7547c85c7144fe4ac8e853f01e842b262670e0d223111f544e1cbdb9a62db808))
- **Governance changes:** Brain went from 3-of-8 to 3-of-6 when two owners were removed on October 15, 2026 ([tx](https://etherscan.io/tx/0xfcc529cfb0a85204a137315423f15f8a4a59fa4ad0b26d0603e9e0892d091065)); the threshold stayed at 3
- **Yearn V3 track record:** V3 framework live since May 2024 (~30 months). No V3 vault exploits

**Lido track record:** $20B+ TVL, longest-running LST, Shapella enabled withdrawals (June 2023). Curve stETH/ETH peg has been stable post-Shapella with brief periods of slight discount during stress events.

## Funds Management

yvWETH-1 is **100% deployed** at the snapshot: **stETH Accumulator 61.70%** and **Yearn OG WETH 38.30%** of totalDebt. Strategy debt reconciles exactly to `totalDebt()`.

### Strategy 1: stETH Accumulator (61.70% of vault totalDebt)

**Contract:** [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435)

The contract code (`Strategy.sol` / `BaseLSTAccumulator.sol`, verified on Etherscan) implements:

**Stake path:**

1. WETH unwrapped to ETH at the strategy contract
2. ETH staked via one of two routes, selected per call:
   - **Curve ETH/stETH pool** ([`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022)) — used only when Curve quotes better than 1:1, with a 1:1 minimum out
   - **Lido `submit{value}()`** — guaranteed 1:1 minting

**Unwind path (manual, management-only — there is no auto-unwind on user withdrawal):**

| Method | Caller | Mechanic | Latency |
|--------|--------|----------|---------|
| `manualSwapToAsset(_amount, _minOut)` | Management (Brain) | Sells stETH → ETH on Curve; `_minOut` is chosen by the caller | Immediate |
| `initiateLSTWithdrawal()` | Management (Brain) | Queues stETH in the Lido withdrawal queue ([`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)) for 1:1 redemption | Queue-dependent |
| `claimLSTWithdrawal()` / `manualClaimWithdrawals()` | Management / emergency-authorized | Claims finalized Lido withdrawals back to ETH | Immediate after finalization |
| `emergencyWithdraw()` (after `shutdownStrategy()`) | Management or `emergencyAdmin` (Security) | Sells stETH on Curve with `_minOut = 0` | Immediate |

**Strategy parameters (at snapshot):**
- Activated: April 16, 2026 (`activation = 1776351539`)
- Last vault report: November 19, 2026 (`last_report = 1795058063`); strategy `lastReport()` November 21, 2026
- `max_debt`: 10,000 WETH
- Management: Brain. Keeper: yHaaSRelayer. `emergencyAdmin`: Security
- `pendingRedemptions = 0`, `reportBuffer = 0`, health check on with `lossLimitRatio = 0` (any reported loss reverts unless management disables the check)
- `openDeposits = false`; only allowlisted depositors (yvWETH-1 is allowed)
- Performance fee 0% at strategy level (vault charges 10%)

### Strategy 2: Yearn OG WETH (38.30% of vault totalDebt)

**Contract:** [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) (`MetaMorphoV1_1`, immutable)

yvWETH-1 holds 1,656.41 of 1,670.90 shares (99.13%). The MetaMorpho vault lends WETH into Morpho Blue markets:

| Market | Collateral | LLTV | Yearn OG WETH supply (WETH) | Share | Market utilization | Market free liquidity (WETH) |
|--------|-----------|-----:|----------------------------:|------:|-------------------:|-----------------------------:|
| [`0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e`](https://app.morpho.org/ethereum/market/0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e/) | [wstETH](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | 96.5% | 1,092.64 | 62.7% | 84.9% | 5,065.59 |
| [`0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7`](https://app.morpho.org/ethereum/market/0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7/) | [weETH](https://etherscan.io/address/0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee) | 94.5% | 350.13 | 20.1% | 84.1% | 673.34 |
| [`0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d`](https://app.morpho.org/ethereum/market/0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d/) | [wstETH](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | 94.5% | 300.16 | 17.2% | 84.6% | 1,357.11 |

The withdraw queue also lists a WBTC/WETH 91.5% LLTV market ([`0x138eec0e4a1937eb92ebc70043ed539661dd7ed5a89fb92a720b341650288a40`](https://app.morpho.org/ethereum/market/0x138eec0e4a1937eb92ebc70043ed539661dd7ed5a89fb92a720b341650288a40/)) and an idle market ([`0x58e212060645d18eab6d9b2af3d56fbc906a92ff5667385f616f662c70372284`](https://app.morpho.org/ethereum/market/0x58e212060645d18eab6d9b2af3d56fbc906a92ff5667385f616f662c70372284/)); Yearn OG WETH supplies 0 to both. Supply amounts are Morpho Blue `position().supplyShares` converted with `market()` totals at the snapshot block. The wstETH markets use oracle [`0xbD60A6770b27E084E8617335ddE769241B0e71D8`](https://etherscan.io/address/0xbD60A6770b27E084E8617335ddE769241B0e71D8) and the weETH market uses [`0xbDd2F2D473E8D63d1BFb0185B5bDB8046ca48a72`](https://etherscan.io/address/0xbDd2F2D473E8D63d1BFb0185B5bDB8046ca48a72); all three use the AdaptiveCurve IRM [`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC).

**MetaMorpho governance:** owner = Security (4-of-7); curator = 2-of-3 Safe [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51); guardian = Daddy (6-of-9); `timelock() = 259200` (3 days), no pending timelock or guardian change. Fee 5% of interest to Security. Allocators (from `SetIsAllocator` events, confirmed with `isAllocator`): EOA [`0x75a1253432356f90611546a487b5350cef08780d`](https://etherscan.io/address/0x75a1253432356f90611546a487b5350cef08780d) (EIP-7702 delegated), EOA [`0x50b75d586929ab2f75dc15f07e1b921b7c4ba8fa`](https://etherscan.io/address/0x50b75d586929ab2f75dc15f07e1b921b7c4ba8fa), and `EmergencyAllocator` [`0xffb824d00fd6f9513259fc6e79674a0065570862`](https://etherscan.io/address/0xffb824d00fd6f9513259fc6e79674a0065570862).

### Attached zero-debt strategies

- **Spark WETH Lender** ([`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151)): supplies WETH to Spark Lend. 0 debt, 0 `totalAssets()`, `max_debt` 15,000 WETH, in the default queue.
- **wstETH/WETH Spark Looper** ([`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121), `LSTAaveLooper`): loops wstETH collateral against WETH borrows on Spark Lend. 0 yvWETH-1 debt, `max_debt` 2,000 WETH, not in the default queue. Etherscan shows it as a proxy of [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c). That address is the shared Yearn TokenizedStrategy, which the strategy reaches through a constant address, so it cannot be upgraded.

### Accessibility

- **Deposits:** Permissionless ERC-4626, subject to the 15,000 WETH deposit limit
- **Withdrawals:** ERC-4626 through the default queue (Accumulator, Yearn OG WETH, Spark WETH Lender). The Accumulator contributes only loose WETH (0 at the snapshot), so instant withdrawals are served by Yearn OG WETH (1,727.81 WETH available). **See [Liquidity Risk](#liquidity-risk)**
- **No cooldown or lock period** at the vault level
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% backing** in stETH (61.70%) and Morpho Blue WETH supply positions (38.30%)
- **Collateral quality:** Lido stETH is the largest LST ($20B+ TVL, multi-operator). The Morpho markets lend WETH against wstETH (79.9% of Yearn OG WETH) and ether.fi weETH (20.1%) at 94.5–96.5% LLTV. These are correlated-asset markets, so the high LLTVs depend on the collateral oracles and on the LSTs keeping their ETH value
- **No leverage** in funded strategies
- **Redeemability:** stETH unwinds via Curve (peg-dependent) or the Lido withdrawal queue (1:1, queue-dependent). Yearn OG WETH positions redeem against Morpho market free liquidity

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** the stETH Accumulator reads its onchain stETH balance at 1:1 (less `reportBuffer`, currently 0). Yearn OG WETH is valued through MetaMorpho `convertToAssets`, computed from Morpho Blue positions
- **Accounting-lag caveat (dormant):** while the Accumulator has an in-flight Lido withdrawal (`pendingRedemptions > 0`), `_harvestAndReport()` reverts and the strategy keeps its last reported value. `pendingRedemptions = 0` at the snapshot
- **Profit / loss:** reported by keeper via `process_report()`, locked over 10 days
- **Strategy debt reconciliation:** strategy `current_debt` sums to exactly `totalDebt()` (4,510.81 WETH)

## Liquidity Risk

| Aspect | Detail |
|--------|--------|
| Vault-level idle | 0 WETH |
| Atomic portion | 38.30% of totalDebt — Yearn OG WETH, `maxWithdraw(yvWETH-1) = 1,727.81 WETH`. The three supplied Morpho markets hold 7,096.04 WETH of free liquidity combined at ~84–85% utilization |
| Manual-unwind portion | 61.70% of totalDebt — stETH Accumulator (2,784.10 stETH); `availableWithdrawLimit()` returns loose WETH only (0) |
| Manual unwind paths (stETH) | (a) Curve ETH/stETH: 16,004.32 ETH / 21,468.19 stETH balances; `get_dy(1, 0, 1e18) = 0.99956`. (b) Lido withdrawal queue: not paused, 61,473 stETH unfinalized at the snapshot |
| Cooldown / restrictions | None at the vault level |

**Practical implications:**

- **Mixed unwind profile:** 38.30% is atomically withdrawable through Morpho, and 61.70% waits for Brain to unwind stETH
- **Concentrated holders:** the yETH Recovery Vault (36.4% of supply) holds Treasury and Daddy capital that the [Snapshot proposal](https://snapshot.org/#/s:veyfi.eth/proposal/0xe76f57663ce9311eb830ef097812702cbbb55fccbb280d254cdfc1f2c11c261a) keeps in place until the yETH recovery is repaid. The Alchemix mixWETH adapter (30.4%, ~1,373 WETH) is the largest holder that is likely to move. Its full exit is about the size of the atomic Morpho portion
- **Lido queue can extend** under stress (large coordinated unstake events)
- **Same-asset:** vault token is WETH-denominated; no price-divergence risk on the share
- **Deposit limit:** 15,000 WETH vs 4,510.81 WETH TVL

## Centralization & Control Risks

### Governance

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles (`0x3FF6`); Role Manager `chad`; Timelock proposer/executor/canceller; Yearn OG WETH guardian |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-6 | REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY (`0x3972`); Role Manager Brain position; Timelock canceller; management of the tokenized strategies |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY (`0x20C0`); `emergencyAdmin` of the tokenized strategies; Yearn OG WETH owner |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT (`0x8F`); Role Manager `governance` |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

ySafe 6-of-9 signers include publicly known DeFi contributors — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig).

**Daddy BORG guard and modules:** Daddy has a `borgCore` guard ([`0xe1c90a1f8a9553b31110dd6feead76e79a6ed419`](https://etherscan.io/address/0xe1c90a1f8a9553b31110dd6feead76e79a6ed419)) in blacklist mode (`borgMode() = 1`), with no policy entry for yvWETH-1 or the Role Manager. Three modules are enabled:

- `sudoImplant` ([`0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7`](https://etherscan.io/address/0xbe01DAdf8C85277ab8db9Ceaa1cB5A5f24426Cc7)) can set Daddy's guard and enable or disable modules.
- `ejectImplant` ([`0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC`](https://etherscan.io/address/0x991c8581Df1Bb51672e958a7fDCbE74288A1acAC)) manages signers.
- `AllowanceModule` ([`0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134`](https://etherscan.io/address/0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)) only spends token allowances from Daddy's own balance.

Both implants' sole owner is a `SnapShotExecutor` ([`0xe8bd6ee2a38709e677b02c875ad73d0ae373eb5c`](https://etherscan.io/address/0xe8bd6ee2a38709e677b02c875ad73d0ae373eb5c)). In that executor an oracle EOA proposes, the `waitingPeriod` is 3 days, and `execute()` is owner-only. The executor's owner is Daddy itself (auth [`0x993Ee3e9190fFE7Df2Ea97F1f927E1678EA3610b`](https://etherscan.io/address/0x993Ee3e9190fFE7Df2Ea97F1f927E1678EA3610b)). The modules therefore give no path that avoids Daddy's 6-of-9 signature.

**Timelock role inventory** (OpenZeppelin `TimelockController`, from all `RoleGranted`/`RoleRevoked` events): PROPOSER = Daddy; EXECUTOR = Daddy and TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b); CANCELLER = Daddy and Brain; TIMELOCK_ADMIN = the timelock itself. No revocations. See the appendix.

**Properties:**

1. **No EOA holds vault roles directly**
2. **Strategy additions and accountant changes go through the 7-day timelock**, but the Role Manager handover below can bypass it
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself
4. **Vault contract is immutable** — Vyper minimal proxy
5. **Same governance pattern across the 40 vaults** in the Role Manager

### Critical Permission Paths and Weakest Link

Material loss here means loss of WETH deposited in yvWETH-1. The inventory covers the vault, the Role Manager, the Strategy Manager timelock, the two funded strategies, Yearn OG WETH, and Daddy's modules. Role holders were read at the snapshot block. Timelock and MetaMorpho allocator roles come from complete event scans.

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Sell Accumulator stETH at a caller-chosen price: `Strategy.manualSwapToAsset(_amount, _minOut)` | Brain (3-of-6), strategy `management()` | None in code: `_minOut` is a free parameter and the call can be repeated. Loss is limited only by Curve pool depth and the cost of moving the pool | Up to 2,784.10 stETH (61.70% of TVL) |
| Shut down the Accumulator and dump stETH: `shutdownStrategy()` + `emergencyWithdraw()` → Curve swap with `_minOut = 0` | Security (4-of-7) as `emergencyAdmin`, or Brain as management | None in code | Up to 2,784.10 stETH (61.70% of TVL) |
| Mark down Accumulator value: `setReportBuffer()` (no upper bound) + `setDoHealthCheck(false)`, then report | Brain (3-of-6) | Health check rejects any loss until Brain disables it. Value shifts between exiting and remaining holders and is not extracted | Up to 61.70% of PPS while the buffer is set |
| Add an arbitrary strategy and fund it, via the timelock: `add_strategy` / `update_max_debt_for_strategy` through the Strategy Manager, then `update_debt` | Daddy (6-of-9) proposes and executes; Brain or Daddy can cancel | 7-day delay | Full TVL, 4,510.81 WETH |
| Add an arbitrary strategy and fund it, via a Role Manager handover: `RoleManager.removeVault(yvWETH-1)` transfers the vault's role manager to the immutable `chad` (Daddy); Daddy calls `accept_role_manager()`, then `add_role(Daddy, ADD_STRATEGY)`, `add_strategy`, `update_debt` | Brain (3-of-6) **and** Daddy (6-of-9) | **No delay.** Needs both Safes. Daddy's BORG guard has no policy that blocks these calls. Fork-confirmed at block 26479415: a strategy was added within the same block | Full TVL, 4,510.81 WETH |
| Add a malicious Morpho market to Yearn OG WETH: curator `submitCap`, then an allocator `reallocate` | Curator 2-of-3 Safe (or owner Security 4-of-7) | 3-day MetaMorpho timelock; guardian Daddy can revoke pending caps | 1,727.81 WETH (38.30% of TVL) |
| Write off strategy debt: `force_revoke_strategy` | Daddy (6-of-9) and Strategy Manager | Records the full debt as a loss; strategy shares stay in the vault and can be recovered only by re-adding the strategy (7-day timelock) | Up to 61.70% of TVL as an accounting loss |

Low-impact roles: the keeper and Debt Allocator only report and move debt between attached strategies. The three MetaMorpho allocators, two of them EOAs, only reallocate between markets that already have caps. Brain's `REVOKE_STRATEGY` only works at zero debt. `DEBT_PURCHASER` pays full value for strategy shares.

**Weakest credible path to material loss:** **Brain's untimelocked swap authority over the stETH Accumulator.** As strategy management, the Brain 3-of-6 Safe can call `manualSwapToAsset` with any `_minOut`, repeatedly, on up to 2,784.10 stETH (61.70% of TVL, ~$4.82M). No timelock applies and no code-set slippage reference limits the call. If the sale is sandwiched, or its proceeds are routed to the caller, the loss is bounded only by Curve ETH/stETH depth (16,004.32 ETH / 21,468.19 stETH). The maximum extractable amount has not been modelled (`TODO`: simulate a sandwiched `manualSwapToAsset` at the snapshot block). Security's `emergencyAdmin` path (4-of-7, `_minOut = 0` after shutdown) is a comparable path on the same assets.

For the whole vault, **Brain and Daddy together can add and fund an arbitrary strategy with no delay** through the Role Manager handover, so in practice the 7-day Strategy Manager timelock binds only Daddy acting alone. The same Role Manager governs all 40 Yearn V3 vaults it manages. No EOA or sub-3-signer Safe holds an untimelocked path to material loss. The 2-of-3 curator path sits behind a 3-day timelock that Daddy, as guardian, can veto.

### Programmability

- **PPS:** ERC-4626, fully algorithmic
- **Vault operations:** permissionless deposit / withdraw onchain
- **Strategy reporting:** automated via keeper
- **Debt allocation:** Debt Allocator (automated) + Brain (manual)
- **Offchain inputs:** none directly to PPS or fund movement, but stETH unwind decisions are offchain (paced by management)

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Lido (stETH)** | Critical — 61.70% of vault totalDebt directly; also ~30.6% indirectly as wstETH collateral in Morpho | Largest LST, $20B+ TVL, well-audited, multi-operator. Shapella withdrawals redeem 1:1 |
| **Morpho Blue / MetaMorpho** | High — 38.30% of vault totalDebt | Immutable core; Yearn-curated vault with 3-day timelock |
| **ether.fi (weETH)** | Low — ~7.7% of vault through one Morpho market's collateral | Loss only if weETH collateral fails to cover WETH loans in the 94.5% LLTV market |
| **Curve ETH/stETH pool** | Medium (unwind path for 61.70%) | Used for staking (only at better than 1:1) and manual unwind |
| **Lido withdrawal queue** | Medium (unwind path for 61.70%) | 1:1 redemption; queue length varies with demand |

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 40 vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code (including `BaseLSTAccumulator.sol`) verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit. $200K Immunefi bug bounty for responsible disclosure
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault and migrating
- **Strategy-level operational risk:** Brain must pre-position WETH from the stETH Accumulator for redemptions beyond the Morpho portion (61.70% of totalDebt)

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvWETH-1 is in the monitored vault list:**

- **Large flow alerts** ([`protocols/yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py)) — runs **hourly via the automation scheduler**. Alerts on deposits / withdrawals exceeding threshold via Telegram
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`) — daily
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`) — monitors the Yearn TimelockController across multiple chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvWETH-1 Vault | [`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, `role_manager()` / `future_role_manager()`, Deposit / Withdraw events. Reconcile totalDebt against strategy debt sum |
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | `RemovedVault`, `UpdatePositionHolder`, `UpdatePositionRoles` events |
| stETH Accumulator | [`0x470e0e048F85CFD72EEf325895e02c8D297E7435`](https://etherscan.io/address/0x470e0e048F85CFD72EEf325895e02c8D297E7435) | `totalAssets()`, `estimatedTotalAssets()`, `pendingRedemptions()`, `reportBuffer()`, `doHealthCheck()`, `isShutdown()`, stETH balance, keeper report frequency; `manualSwapToAsset` calls and realized price vs Curve `get_dy` |
| Yearn OG WETH | [`0xE89371eAaAC6D46d4C3ED23453241987916224FC`](https://etherscan.io/address/0xE89371eAaAC6D46d4C3ED23453241987916224FC) | `totalAssets()`, PPS, supply/withdraw queues, `SubmitCap` / `SetCap` / `SetIsAllocator` events, market utilization |
| Spark WETH Lender / Spark Looper | [`0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151`](https://etherscan.io/address/0xfca3F21D60d5bC8B4C5c35F169bb5B6402510151) / [`0x68A14629cb07c74259f481382fE8b6cFD8970121`](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121) | Vault `strategies(address).current_debt` — any refunding |
| Lido stETH | [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) | Total supply, exchange rate, pause state |
| Lido Withdrawal Queue | [`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) | `unfinalizedStETH()`, strategy's outstanding request status |
| Curve ETH/stETH | [`0xDC24316b9AE028F1497c275EB9192a3Ea0f67022`](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) | stETH/ETH peg, pool depth |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | `CallScheduled` / `CallExecuted` targeting yvWETH-1 (pending Flex wstETH/WETH Lender addition) |
| ySafe (Daddy) / Brain / Security | see Governance | Signer / threshold / module / guard changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **PPS decrease** — should only increase outside of explicit loss events
- **Role manager handover** — `RoleManager.RemovedVault(yvWETH-1)` or a non-zero `future_role_manager()` signals the untimelocked strategy-addition path
- **Accumulator stETH sales** — `manualSwapToAsset` or `emergencyWithdraw` executions, and any change to `reportBuffer` or `doHealthCheck`
- **Allocation drift** — currently 61.70% stETH Accumulator / 38.30% Yearn OG WETH; refunding of the Spark strategies or execution of the pending Flex strategy addition
- **stETH/ETH peg deviation** — affects the Accumulator portion and wstETH collateral in the Morpho markets
- **Lido withdrawal queue length** — extended queue degrades the 1:1 unwind path
- **`pendingRedemptions` not draining** after expected finalization
- **Morpho market utilization** near 100% in the supplied markets, which would freeze the atomic withdrawal path
- **Large holder exits** — Alchemix mixWETH adapter (30.4% of supply)
- **ySafe / Brain / Security signer or threshold changes**

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `future_role_manager()` | Vault | Role-manager handover detection | Hourly |
| `estimatedTotalAssets()` | Strategy | Onchain backing (vs `totalAssets()`) | Daily |
| `pendingRedemptions()` | Strategy | In-flight Lido withdrawal value | Daily |
| `maxWithdraw(vault)` | Yearn OG WETH | Atomic liquidity for the vault | Hourly |
| Lido `getWithdrawalStatus(...)` | Lido queue | Track pending request finalization | Daily until finalized |
| Curve `get_dy(1,0,1e18)` | Curve pool | stETH/ETH spot exchange rate | Hourly |
| `getThreshold()` / `getOwners()` | Safes | Governance integrity | Weekly |
| `getMinDelay()` | Timelock | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by 3 top firms, ~30 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe + 7-day self-governed timelock; no EOA holds a vault role
- **Simple, unlevered allocation:** two funded strategies, stETH and Morpho WETH lending, both fully verifiable onchain with exact debt reconciliation
- **Conservative LST integration:** the stETH Accumulator's design (no auto-unwind, `pendingRedemptions` blocks reporting, health check with zero loss limit) avoids forced selling of stETH at a discount during peg events
- **Sticky Treasury capital:** the yETH Recovery Vault, mostly Treasury and Daddy capital, holds 36.4% of supply ([Snapshot proposal](https://snapshot.org/#/s:veyfi.eth/proposal/0xe76f57663ce9311eb830ef097812702cbbb55fccbb280d254cdfc1f2c11c261a))
- **No cross-chain bridging**

### Key Risks

- **Untimelocked Brain swap authority over 61.70% of TVL:** Brain (3-of-6) can sell the Accumulator's stETH on Curve at a `_minOut` it chooses itself. This is the weakest material path. Security (4-of-7) has a comparable `emergencyWithdraw` path with `_minOut = 0`
- **Timelock bypass via the Role Manager:** Brain and Daddy together can move the vault's role manager to Daddy and add a strategy with no delay. This was fork-confirmed and applies to all 40 vaults the Role Manager manages
- **Single-venue concentration in stETH (61.70%)**, plus ~30.6% indirect wstETH collateral exposure through Morpho
- **Majority manual-unwind exposure:** 61.70% of totalDebt waits for a Lido queue or Curve unwind. The atomic Morpho portion (1,727.81 WETH) roughly covers the largest likely mover (Alchemix adapter, ~1,373 WETH)
- **High-LLTV Morpho markets:** Yearn OG WETH lends at 94.5–96.5% LLTV against wstETH and weETH; an oracle fault or LST depeg could leave bad debt
- **Pending strategy addition:** the Flex wstETH/WETH Lender (`max_debt` 10,000 WETH) was executable at the snapshot. Once executed and funded, it adds Flex protocol exposure

### Critical Risks

- Lido stETH integrity failure remains the dominant systemic tail risk (61.70% direct plus wstETH collateral in Morpho). No critical gate fails.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Lido audited by multiple firms. Morpho Blue and MetaMorpho are established, audited protocols. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 and onchain balances verifiable for both funded strategies (stETH balance, Morpho Blue positions). Strategy debt sums to 100% of totalDebt. ✅ PASS
- [x] **Total centralization** — no EOA or sub-3-signer holder has an untimelocked path to material loss. The weakest path is Brain 3-of-6 (Accumulator swaps); the 2-of-3 curator path is behind a 3-day timelock with Daddy as guardian. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Lido: multiple firms. Morpho: established, audited protocol |
| Bug bounty | $200K (Yearn Immunefi); Lido bounty active |
| Production history | **~32 months** (March 12, 2024). V3 framework: ~30 months |
| TVL | 4,510.81 WETH (~$7.81M), down from ~8,927 WETH in July after an Alchemix adapter withdrawal. Deposit limit: 15,000 WETH |
| Security incidents | None on V3, none on Lido stETH |
| Strategy review | 12-metric ySec framework. Category-1 strictest tier |

**Score: 1.5 / 5** — strong audit coverage, ~32 months of clean production, no incidents. The TVL drop came from one integrator's reallocation, not from an incident.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable**; strategies have no upgrade path |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers**; Brain 3-of-6; Security 4-of-7 |
| Timelock | 7-day delay on `ADD_STRATEGY` and `ACCOUNTANT` for Daddy alone. Brain + Daddy can bypass it through the Role Manager handover |
| Privileged roles | Distributed across Daddy, Brain, Security, Keeper, Debt Allocator. Brain holds untimelocked swap authority over the Accumulator |
| EOA risk | None — no EOA holds a vault role or a material strategy role |

**Governance Score: 1.0 / 5** — held. The vault is immutable, every material path needs a Safe of at least 3 signers, and strategy additions by Daddy alone are timelocked for 7 days. Brain's untimelocked strategy-management powers are scored as operational under the convention applied to all Yearn V3 reports. The new findings are recorded in Key Risks: Accumulator swaps with a caller-set `_minOut` (Brain 3-of-6), and a Brain + Daddy Role Manager handover that skips the timelock.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals onchain |
| Strategy reporting | Programmatic via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |
| LST unwind | **Paced by management** for the 61.70% Accumulator portion; Yearn OG WETH is atomic for 38.30% |

**Programmability Score: 1.5 / 5** — fully programmatic at the vault level. The Accumulator's manual unwind remains a mild factor.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Verified protocol count | 2 funded dependencies (Lido 61.70%, Morpho 38.30%); ether.fi weETH indirectly (~7.7%) |
| Criticality | Lido critical; Morpho high; ether.fi low |
| Concentration | Lido/stETH 61.70% direct plus ~30.6% as Morpho collateral |
| Quality | Lido and Morpho are top-tier DeFi protocols |

**Dependencies Score: 2.0 / 5** — two blue-chip direct dependencies. Spark Lend exposure is now zero, but Lido concentration rose, both directly and through wstETH collateral.

**Centralization Score = (1.0 + 1.5 + 2.0) / 3 = 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 61.70% stETH, 38.30% Morpho Blue WETH supply. All verifiable onchain |
| Collateral quality | Lido stETH is top-tier. Morpho markets lend against wstETH (79.9%) and weETH (20.1%) |
| Leverage | None in funded strategies |
| Verifiability | Fully onchain |

**Score: 1.5 / 5** — high-quality, unlevered backing. The 94.5–96.5% LLTV Morpho markets are the main collateral sensitivity.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully onchain: stETH balance and Morpho Blue positions |
| Exchange rate | Programmatic, real-time at the vault level |
| Reporting | Keeper-driven, 10-day profit unlock |
| LST accounting lag | Dormant (`pendingRedemptions = 0`) |
| totalDebt reconciliation | Strategy debt sum equals totalDebt (4,510.81 WETH) |

**Score: 1.0 / 5** — reserves are fully transparent and reconcile exactly.

**Funds Management Score = (1.5 + 1.0) / 2 = 1.25**

**Score: 1.3 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Vault-level idle | 0 WETH |
| Atomic portion | 38.30% — Yearn OG WETH, 1,727.81 WETH withdrawable; 7,096.04 WETH free liquidity in the supplied Morpho markets |
| Manual-unwind portion | 61.70% — stETH Accumulator; `availableWithdrawLimit()` returns loose WETH only (0) |
| Underlying liquidity | Curve ETH/stETH 16,004.32 ETH / 21,468.19 stETH; Lido queue not paused |
| Holder concentration | 36.4% Treasury-backed yETH Recovery Vault; 30.4% Alchemix adapter |
| Same-asset | WETH-denominated share token |
| Withdrawal restrictions | None at vault level |

**Score: 2.0 / 5** — held. The manual-unwind share rose from ~58% to 61.70%, but the leveraged looper portion is gone. The atomic Morpho portion roughly covers a full exit by the largest likely mover. Treasury-backed holders provide a liquidity floor.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 40 vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi |
| Monitoring | Active hourly alerts, vault in monitored list |
| Strategy unwind ops | Brain must pre-position WETH for the 61.70% Accumulator portion |

**Score: 1.0 / 5** — operational maturity remains high.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.3 | 30% | 0.390 |
| Liquidity Risk | 2.0 | 15% | 0.300 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.49 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | **Approved, high confidence** |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.49 / 5.0) — Approved with high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (February 2027)
- **TVL-based:** Reassess if TVL exceeds 9,000 WETH or changes by ±50% from 4,510.81 WETH
- **Allocation drift:**
  - stETH Accumulator share above 85% of vault totalDebt
  - any refunding of the Spark WETH Lender or wstETH/WETH Spark Looper
  - Yearn OG WETH adds a market with non-ETH-correlated collateral, or a single market exceeds 80% of its supply
- **Strategy changes:**
  - execution of the pending Flex wstETH/WETH Lender addition ([`0x61b1DEf6D44D5052dBAc0aD20E4648F7F9d708d5`](https://etherscan.io/address/0x61b1DEf6D44D5052dBAc0aD20E4648F7F9d708d5)) and any debt allocated to it
  - any other `add_strategy` proposal at the Strategy Manager TimelockController ([`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73), 7-day delay)
  - any `RoleManager.removeVault` call or non-zero `future_role_manager()` on yvWETH-1
- **Lido-specific:**
  - extended Lido withdrawal queue (>14 days)
  - stETH/ETH peg deviation > 1% sustained
  - any Lido contract upgrade or oracle change
  - any new `initiateLSTWithdrawal()` from the Accumulator (re-engages the `pendingRedemptions` accounting lag)
- **Strategy-specific:**
  - any `manualSwapToAsset` or `emergencyWithdraw` that realizes a loss against the Curve quote
  - `reportBuffer` raised above 0 or health check disabled
  - `pendingRedemptions` failing to drain after expected Lido finalization
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Lido / Curve / Morpho / ether.fi
- **Governance-based:** ySafe / Brain / Security / curator signer or threshold changes; any change to the timelock delay; any change to Daddy's guard or modules

---

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| [May 11, 2026](https://github.com/yearn/risk-score/pull/148) | 1.5 | Initial assessment. 3 funded strategies (Morpho ~71%, stETH ~25%, Spark ~4%). 6-of-9 ySafe, 7-day timelock, immutable vault. Minimal Risk tier. |
| [July 22, 2026](https://github.com/yearn/risk-score/pull/335) | 1.49 | Reassessment. Strategy mix: stETH Accumulator (59%), Spark WETH Lender (31%), Yearn OG WETH (Morpho MetaMorpho, 2%/~9% effective), wstETH/WETH Spark Looper (~11% of totalDebt; not in default queue) — an LSTAaveLooper that leverages wstETH as collateral to borrow WETH on Spark Lend, the first leveraged strategy in this vault. Strategy debt fully reconciles to 100% of totalDebt (~8,927 WETH). All strategies mapped to verified blue-chip protocols. Governance unchanged. Score returned to 1.5 (Minimal Risk). |
| [November 23, 2026](https://github.com/yearn/risk-score/pull/620) | 1.49 | TVL fell to 4,510.81 WETH after an Alchemix adapter withdrawal; debt is now stETH Accumulator 61.70% / Yearn OG WETH (Morpho) 38.30%, with Spark strategies at zero. Added Critical Permission Paths: Brain 3-of-6 can swap Accumulator stETH at a caller-set `_minOut`, and Brain + Daddy can bypass the 7-day timelock via the Role Manager (fork-confirmed). All category scores held. |

---

## Appendix: Contract Architecture

Snapshot at [block 26479415](https://etherscan.io/block/26479415) (November 23, 2026). Addresses are in [Contract Addresses](#contract-addresses).

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER                                  │
│                                                                       │
│  ┌────────────────────────────────────────┐                          │
│  │  yvWETH-1 (v3.0.2)                     │                          │
│  │  ERC-4626, immutable Vyper proxy       │                          │
│  │                                        │                          │
│  │  TVL: 4,510.81 WETH (~$7.81M)          │                          │
│  │   ├── 0 idle                           │                          │
│  │   ├── 2,783.04 stETH Accumulator (62%) │                          │
│  │   ├── 1,727.77 Yearn OG WETH (38%)     │                          │
│  │   └── 0 Spark WETH Lender / Looper     │                          │
│  └─────────────────┬──────────────────────┘                          │
│                    │                                                  │
│        ┌───────────┴─────────────────────┐                            │
│        ▼                                 ▼                            │
│ ┌──────────────────────────┐   ┌──────────────────────────────┐       │
│ │ stETH Accumulator        │   │ Yearn OG WETH (MetaMorpho)   │       │
│ │ mgmt: Brain 3/6          │   │ owner: Security 4/7          │       │
│ │ emergencyAdmin: Security │   │ curator: 2/3 Safe            │       │
│ │ Stake: WETH→ETH→stETH    │   │ guardian: Daddy 6/9          │       │
│ │ Unwind (mgmt-only):      │   │ timelock: 3 days             │       │
│ │  manualSwapToAsset()     │   │ Atomic withdrawal            │       │
│ │  initiateLSTWithdrawal() │   │                              │       │
│ │ pendingRedemptions = 0   │   │                              │       │
│ └──────────────────────────┘   └──────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          UNDERLYING                                   │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Lido stETH             │  │ Curve ETH/stETH pool   │               │
│  │ $20B+ TVL              │  │ stake-on-better-quote, │               │
│  │ Shapella withdrawals   │  │ manual unwind venue    │               │
│  └────────────────────────┘  └────────────────────────┘               │
│  ┌────────────────────────┐  ┌────────────────────────┐               │
│  │ Lido Withdrawal Queue  │  │ Morpho Blue markets    │               │
│  │ 1:1 redemption         │  │ wstETH/WETH 96.5% 62.7%│               │
│  │                        │  │ weETH/WETH  94.5% 20.1%│               │
│  │                        │  │ wstETH/WETH 94.5% 17.2%│               │
│  └────────────────────────┘  └────────────────────────┘               │
└──────────────────────────────────────────────────────────────────────┘
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) is the same timelock used by the other Yearn V3 vaults under the Role Manager, and it is also the Role Manager's `governance()`. `getMinDelay() = 604800` (7 days). Roles were enumerated from every `RoleGranted`/`RoleRevoked` event through block 26479415 and confirmed with `hasRole()`.

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)` at construction) |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | Sole proposer |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper; `governance()` and sole entry in `getExecutors()` is Brain (3-of-6), which can execute already-queued operations after the delay |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-6 Safe | Cancel pending proposals |

To shorten the delay, Daddy must propose `updateDelay()` and wait 7 days, during which Brain or Daddy can cancel; then the change can be executed. DEFAULT_ADMIN was never granted, so no party can grant itself PROPOSER or TIMELOCK_ADMIN to skip that flow. The timelock does **not** cover the Role Manager `removeVault` handover described in [Critical Permission Paths](#critical-permission-paths-and-weakest-link).
