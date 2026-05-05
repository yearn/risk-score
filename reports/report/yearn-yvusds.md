# Protocol Risk Assessment: Yearn — yvUSDS-1

- **Assessment Date:** May 5, 2026
- **Token:** yvUSDS-1 (USDS-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8)
- **Final Score: 1.4/5.0**

## Overview + Links

yvUSDS-1 is a **USDS-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDS into yield strategies on Ethereum mainnet. At the May 5 snapshot the vault is **100% deployed into a single strategy: the Spark USDS Compounder**, which stakes USDS into the Sky **USDS Staking Rewards** contract for SPK token rewards. Two other strategies sit in the default queue with **zero current debt** (sUSDS Lender, USDS Sky Rewards Compounder).

**Material change since the prior snapshot (April 27 → May 5):** TVL has dropped roughly **83%** (from ~35.24M USDS to ~6.01M), and concentration has gone from a 92.6% / 7.4% split to **100% in a single venue**. The drop is largely upstream-driven: yvUSDC-1's `USDC to USDS Depositor` strategy (which previously routed all deployed USDC through yvUSDS-1) now sits at zero debt — yvUSDC-1 now routes ~97.6% of its deployed USDC through a new **`USDC to sUSDS Lender`** strategy that deposits direct into sUSDS, **bypassing yvUSDS-1 entirely**. Two earlier-queued Aave V3 USDS strategies (Aave V3 Lido USDS Lender, Aave V3 USDS Lender) are no longer in the default queue.

This vault is **no longer the terminal layer** for the broader Yearn V3 mainnet risk-1 stable stack. yvDAI-1 still routes ~20.6% (~1.61M DAI) directly here via `DAI to USDS Depositor`, but yvUSDC-1 is no longer a depositor.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.3) accepting USDS deposits, issuing yvUSDS-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.3 Yearn V3 Vault Factory ([`0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f`](https://etherscan.io/address/0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f))
- **Default queue (3 strategies, 1 funded):**
  1. **USDS Sky Rewards Compounder** ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81)) — 0 USDS debt at snapshot
  2. **Spark USDS Compounder** ([`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)) — **6,008,242.81 USDS (100%)**, stakes USDS into the Sky **USDS Staking Rewards** contract ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)) and harvests SPK ([`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066)) back to USDS
  3. **sUSDS Lender** ([`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)) — 0 USDS debt at snapshot; deposits USDS into the Sky Savings vault ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD))
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (May 5, 2026, snapshot at block 25031569, timestamp 1778017355 = 21:42:35 UTC):**

- **TVL:** 6,008,242.81 USDS
- **Total Supply:** 5,474,920.40 yvUSDS-1
- **Price Per Share:** 1.097412 USDS/yvUSDS-1 (~9.74% cumulative appreciation over ~19.0 months, ~6.0% annualized)
- **Total Debt:** 6,008,242.81 USDS (100% deployed)
- **Total Idle:** 0 USDS
- **Deposit Limit:** 100,000,000 USDS
- **Profit Max Unlock Time:** 3 days
- **Fees:** 0% management fee, 10% performance fee

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Sky Protocol Documentation](https://developers.skyeco.com/)
- [Sky Savings Rate (sUSDS)](https://docs.spark.fi/user-guides/earning-savings/susds)
- [Sky USDS Staking Rewards](https://docs.spark.fi/user-guides/earning-savings/sky-token-rewards)

## Contract Addresses

### Core yvUSDS-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvUSDS-1 Vault | [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) | Yearn V3 Vault (v3.0.3), Vyper minimal proxy |
| Underlying asset (USDS) | [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) | Sky USDS stablecoin |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Shared Yearn Accountant (0% mgmt, 10% perf) |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |

### Governance Contracts (shared with all Yearn V3 risk-1 vaults)

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Single instance for all category-1 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe — holds 12 of 14 vault roles |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe — QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, EMERGENCY |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe — DEBT, MAX_DEBT, EMERGENCY |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** for strategy additions and accountant changes. Self-governed (TIMELOCK_ADMIN held by the timelock itself) |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.3) | [`0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f`](https://etherscan.io/address/0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f) |
| Vault Original (v3.0.3) | [`0xcA78AF7443f3F8FA0148b746Cb18FF67383CDF3f`](https://etherscan.io/address/0xcA78AF7443f3F8FA0148b746Cb18FF67383CDF3f) |

### Active Strategies (3 in default queue, 1 with debt)

Default queue order at block 25031569:

| # | Strategy | Name | Activation | Current Debt (USDS) | Allocation |
|---|----------|------|------------|--------------------:|-----------:|
| 1 | [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | USDS Sky Rewards Compounder | 2025-05-16 | 0 | 0% |
| 2 | [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3) | **Spark USDS Compounder** | 2025-07-14 | **6,008,242.81** | **100%** |
| 3 | [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1) | sUSDS Lender | 2025-05-15 | 0 | 0% |

**Removed from queue between April 27 and May 5 (no longer in `get_default_queue()`):**

- Aave V3 Lido USDS Lender ([`0xC08d81aba10f2dcBA50F9A3Efbc0988439223978`](https://etherscan.io/address/0xC08d81aba10f2dcBA50F9A3Efbc0988439223978)) — held 572.44 USDS dust at the prior snapshot
- Aave V3 USDS Lender ([`0xD144eAFf17b0308a5154444907781382398AaC61`](https://etherscan.io/address/0xD144eAFf17b0308a5154444907781382398AaC61)) — held 0 USDS at the prior snapshot

**Current funding posture:** **100% in a single strategy** (Spark USDS Compounder → Sky USDS Staking Rewards). The two remaining queued strategies have zero current debt; the prior 92.6 / 7.4 split with sUSDS Lender no longer exists. Last reports: Spark Compounder 2026-05-04, sUSDS Lender 2026-05-04, USDS Sky Rewards Compounder 2026-02-05 (the latter is **stale** — last harvested ~3 months before the snapshot, consistent with zero allocated debt).

### Strategy Protocol Dependencies

| Protocol | Strategy | Allocation |
|----------|----------|-----------|
| **Sky / Spark (USDS Staking Rewards SPK farm)** | Spark USDS Compounder | **100%** |
| Sky (sUSDS Savings Rate) | sUSDS Lender | 0% (queue only) |
| Sky USDS Staking (alt compounder) | USDS Sky Rewards Compounder | 0% (queue only) |

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

The underlying vault infrastructure (v3.0.0 baseline) has been audited by 3 reputable firms:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

The v3.0.3 patch release used by yvUSDS-1 was reviewed **internally** by the Yearn team rather than re-engaging external auditors. The diff from v3.0.2 is a minor patch-level change; the external audits cover the core architecture. Source: [yearn-vaults-v3 GitHub releases](https://github.com/yearn/yearn-vaults-v3/releases).

### Sky / MakerDAO Audits (Underlying Protocol)

Sky (formerly MakerDAO) is one of the most extensively audited DeFi protocols:

| Auditor | Coverage | Notes |
|---------|----------|-------|
| ChainSecurity | 9 audits covering USDS, sUSDS, Endgame Toolkit, LockStake, VoteDelegate | Core security partner |
| Cantina | 10 audit reports including sUSDS (Sep 2024) and USDS (Jul 2024) | Comprehensive coverage |
| Sherlock | Public audit contest (Aug 2024) | Community audit |
| Trail of Bits | Core DAI system (legacy MCD) | Historical audit |
| PeckShield | Core DAI system (legacy MCD) | Historical audit |
| Quantstamp | Liquidations 2.0 | Historical audit |
| ABDK | Vote Delegate security | Governance audit |

**USDS Staking Rewards / SPK farm:** part of the Sky Endgame stack and reviewed under the same Sky / Spark audit umbrella (ChainSecurity, Cantina).

### Strategy Review Process

All strategies pass through Yearn's formal **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)) — review level (ySec security review), test coverage, complexity (sLOC), risk exposure, centralization risk, protocol integration count, etc. yvUSDS-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active bug bounty. Max payout: **$200,000** (Critical). Scope includes V3 vaults. 40 smart contracts in scope. Median resolution: 18 hours
  - https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Sky / MakerDAO (Immunefi):** active bug bounty. Max payout: **$10,000,000** (Critical). Scope includes DAI, USDS, sUSDS, PSM, USDS Staking Rewards
  - https://immunefi.com/bug-bounty/sky/
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvUSDS-1 system is **low complexity**:

- **1 funded strategy** on a single chain (Ethereum), inside the Sky ecosystem
- **No conversion hops** — the underlying asset (USDS) is the same as Sky's native staking token. The Spark Compounder stakes USDS directly into the Sky USDS Staking Rewards contract
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Blue-chip protocol dependency** (Sky / Spark)
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

The main accounting subtlety is the SPK reward harvest: the Spark Compounder periodically claims SPK from the staking contract and swaps it back to USDS. This is a standard reward-harvesting pattern; SPK price exposure between harvests is small relative to vault TVL.

## Historical Track Record

- **Vault deployed:** October 8, 2024 (deployment [tx](https://etherscan.io/tx/0x6a1996554455945f9ba5f58b831c86f9afaeb1a5c36b9166099a7d3ac0106803)) — **~19.0 months** in production
- **TVL:** 6,008,242.81 USDS at the May 5 snapshot — well within the 100M USDS deposit limit. **TVL has dropped ~83%** from the April 27 snapshot of ~35.24M
- **PPS trend:** 1.000000 → 1.097412 (~9.74% cumulative return over ~19.0 months, ~6.0% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework generally
- **Strategy changes:** active management — Aave V3 Lido USDS Lender and Aave V3 USDS Lender both removed from the default queue between April 27 and May 5; sUSDS Lender debt drained to zero in the same window. The vault is now 100% allocated to the Spark USDS Compounder
- **Cause of TVL drop (per on-chain evidence):** yvUSDC-1 added a `USDC to sUSDS Lender` strategy (activation 2025-12-12) that deposits USDC-borrowed-USDS direct into sUSDS, replacing the prior `USDC to USDS Depositor` route which routed through this vault. yvUSDC-1's `USDC to USDS Depositor` strategy now sits at zero current debt
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~24 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026). Ethereum dominant at ~$149.6M.

**Sky / sUSDS / USDS Staking track record:**

- USDS launched as part of Sky Endgame (2024)
- sUSDS TVL: ~$5.38B (Sky Savings vault) plus broader USDS / sUSDS supply across the ecosystem
- USDS Staking Rewards (SPK farm) — part of the Sky tokenomics, distributes SPK governance token to USDS stakers
- No security incidents on USDS / sUSDS / USDS Staking since launch

## Funds Management

yvUSDS-1 is **100% deployed** into a single strategy at the May 5 snapshot. The two other strategies in the default queue (USDS Sky Rewards Compounder, sUSDS Lender) hold zero debt.

### Strategy 1: Spark USDS Compounder (100% allocation)

**Contract:** [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)

**Mechanic:**

1. **Stake:** USDS is deposited into the Sky **USDS Staking Rewards** contract ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)). Staked USDS remains 1:1 redeemable; staking unlocks the right to accrue SPK rewards.
2. **Harvest:** The strategy's keeper periodically claims accrued SPK ([`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066)) and converts it back to USDS, compounding the principal.
3. **Withdraw:** Atomic — strategy unstakes USDS from the Staking Rewards contract.

**Risk profile:** SPK token price exposure exists between harvest cycles, but the principal is held as USDS and is unstaked 1:1. The dominant risk is at the Sky USDS Staking Rewards contract / SPK token level — both are part of the audited Sky/Spark stack.

**Strategy parameters:**
- Activated: 2025-07-14
- Last reported: 2026-05-04 (`last_report = 1777869767`)
- Management: Brain multisig (3-of-8) and Debt Allocator
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Queued (zero current debt): sUSDS Lender

**Contract:** [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)

In the queue but with `current_debt = 0` at the snapshot. Mechanic: direct deposit into the Sky Savings vault sUSDS ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) earning the Sky Savings Rate (SSR). sUSDS is an ERC-4626 wrapper over the Sky `pot`. Atomic redemption via `redeem`. Activated 2025-05-15; last reported 2026-05-04 (`last_report = 1777868495`). Available as fallback if Brain re-allocates.

### Queued (zero current debt): USDS Sky Rewards Compounder

**Contract:** [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81)

Alternate compounder strategy targeting the same Sky USDS Staking Rewards venue as the funded Spark Compounder. `current_debt = 0` at the snapshot; activated 2025-05-16; last reported 2026-02-05 (~3 months stale, consistent with no allocated debt). Keeping it in the queue gives Brain a second on-chain implementation if the primary Spark Compounder needed to be paused.

### Removed from default queue (between April 27 and May 5)

- **Aave V3 Lido USDS Lender** ([`0xC08d81aba10f2dcBA50F9A3Efbc0988439223978`](https://etherscan.io/address/0xC08d81aba10f2dcBA50F9A3Efbc0988439223978)) — held 572.44 USDS dust at the prior snapshot; removed from queue
- **Aave V3 USDS Lender** ([`0xD144eAFf17b0308a5154444907781382398AaC61`](https://etherscan.io/address/0xD144eAFf17b0308a5154444907781382398AaC61)) — held 0 USDS at the prior snapshot; removed from queue

The rationale for removing both Aave V3 USDS strategies has not been independently verified. Reintroducing either would require a fresh `addStrategy()` proposal at the Strategy Manager TimelockController (7-day delay).

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDS and receive yvUSDS-1 (ERC-4626 standard). Subject to 100M USDS deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDS-1 for USDS. Pipeline unwinds via Spark Compounder unstake (atomic against the Sky USDS Staking Rewards contract). Highly liquid against multi-billion-USDS underlying capacity
- **No cooldown or lock period**
- **Fees:** 0% management fee, 10% performance fee (taken via accountant during `process_report`)
- **Profit unlock:** 3 days

### Collateralization

- **100% on-chain USDS backing.** All deposits are USDS, deployed into a single Sky-ecosystem yield product (USDS Staking Rewards)
- **Collateral quality:** USDS itself is backed by Sky's over-collateralized loan book and RWA Treasury bill investments (inherited from MakerDAO). USDS Staking Rewards is a first-party Sky contract
- **No leverage** — the active strategy is a simple deposit/stake product, no borrowing
- **Position is fully redeemable** — USDS Staking Rewards unstaking is 1:1

### Provability

- **yvUSDS-1 exchange rate:** Calculated on-chain via ERC-4626 standard (`convertToAssets()` / `convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** The Spark Compounder's `totalAssets()` reads the underlying staking balance from Sky's USDS Staking Rewards contract on-chain
- **SPK reward rate:** Set by Sky / Spark governance and visible on-chain via the Staking Rewards contract
- **Profit / loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 3 days (`profitMaxUnlockTime = 3 days`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDS-1 for USDS via ERC-4626 `withdraw()` / `redeem()`. Triggers a single strategy `withdraw()` call — Spark Compounder unstakes USDS atomically from the Sky USDS Staking Rewards contract
- **Highly liquid underlying:** the USDS Staking Rewards contract holds multi-billion USDS staked; yvUSDS-1's 6.01M USDS is a tiny fraction of underlying capacity
- **No DEX liquidity needed** — exit is via the protocol's own contract (Sky Staking Rewards unstake), not DEX AMMs
- **Same-value asset:** USDS-denominated vault token — no price-divergence risk from the underlying
- **No withdrawal queue or cooldown** — atomic redemption
- **Deposit limit:** 100M USDS cap — generous relative to current TVL of 6.01M USDS (room for +1,564%)
- **Single-protocol concentration:** 100% of unwind capacity sits at the Sky USDS Staking Rewards contract. A pause / migration there would block atomic redemption from this strategy until Brain re-routed funds (the queued sUSDS Lender provides an on-chain fallback)

**Note on cascading withdrawals:** yvUSDC-1 no longer routes through this vault (its `USDC to USDS Depositor` strategy holds 0 USDC at the snapshot). yvDAI-1 still routes ~20.6% (~1.61M DAI) directly here via `DAI to USDS Depositor`. Large coordinated withdrawals from yvDAI-1 will translate into pressure on the Spark Compounder unstake; each layer settles atomically in the same transaction.

## Centralization & Control Risks

### Governance

The yvUSDS-1 vault uses the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract — identical configuration to the other five risk-1 vaults.

**Governance hierarchy:**

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles (all except `ADD_STRATEGY_MANAGER` and `ACCOUNTANT_MANAGER`) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | QUEUE, REPORTING, DEBT, MAX_DEBT, DEPOSIT_LIMIT, WITHDRAW_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

**ySafe 6-of-9 multisig signers** include publicly known contributors: Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others ([source](https://docs.yearn.fi/developers/security/multisig)).

**Governance assessment:**

1. **No EOA role concentration** — all sensitive roles are held by multisigs, the timelock, or automated bots
2. **Strategy additions and accountant changes pass through a 7-day timelock** (`getMinDelay() = 604800`)
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself; reducing the delay also requires 7 days. DEFAULT_ADMIN was never granted (`admin = address(0)`)
4. **Standard Yearn governance** — same pattern shared across 37+ vaults
5. **Immutable vault** — no proxy upgrade path

### Programmability

- **Exchange rate (PPS):** Calculated on-chain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit / withdraw are permissionless on-chain transactions
- **Strategy profit / loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 3 days
- **Debt allocation:** Managed by both the Debt Allocator (automated) and Brain multisig (manual)
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Sky USDS Staking Rewards** | Critical | **100% of allocation.** Core part of the Sky Endgame tokenomics; SPK rewards distributed to USDS stakers |
| **USDS itself** | Critical | The underlying asset of the vault — failure of USDS would be terminal regardless of strategy mix |
| **SPK token** | High | Reward token sold back to USDS during compounding. SPK price exposure between harvests is small relative to vault TVL but non-zero |
| Sky / sUSDS | Standby | sUSDS Lender is in the queue with 0 debt. ~$5.38B sUSDS TVL. Available as on-chain fallback |

**Dependency quality:** the single funded dependency is a first-party Sky / Spark contract plus the underlying USDS token. Sky has 8+ years of history (inheriting MakerDAO's track record), $5.38B in sUSDS, and a $10M bug bounty. The concentration is now **higher than the prior snapshot** — yvUSDS-1 went from 92.6/7.4 to 100/0 — and the dependency profile is effectively single-venue (one Sky contract). The two queued strategies (sUSDS Lender, USDS Sky Rewards Compounder) are immediately fundable by Brain and provide on-chain diversification optionality, but at the snapshot the realized dependency is single-venue.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The ySafe 6-of-9 has 9 named signers including prominent DeFi figures
- **Governance:** Standard Yearn V3 Role Manager — same pattern across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn Finance has converted ychad.eth into a BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation
- **Incident response:** Yearn has demonstrated incident response across 4 historical events (all V1 / legacy). V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **V3 immutability:** Vault contracts cannot be upgraded — eliminates proxy upgrade risk but means bugs cannot be patched in place; a critical bug requires deploying a new vault and migrating users
- **Operational anomaly (April 27 → May 5):** sUSDS Lender debt drained from ~7.4% to 0; two Aave V3 USDS strategies removed from the default queue; vault TVL dropped ~83%. Per on-chain evidence the TVL drop is upstream-driven (yvUSDC-1 redirected its USDC→USDS routing) rather than a vault-level operational event, but the strategy posture changes (queue trimmed from 5 to 3, sUSDS drained, single-venue concentration) are management-initiated and the rationale is not independently verifiable on-chain

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring`](https://github.com/yearn/monitoring) repository. **yvUSDS-1 is actively monitored:**

- **Large flow alerts** ([`yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/yearn/alert_large_flows.py)): runs **hourly via GitHub Actions**. yvUSDS-1 is in the monitored vault list. Alerts on deposits / withdrawals exceeding threshold via Telegram
- **Endorsed vault check** (`yearn/check_endorsed.py`): runs weekly, verifies all Yearn V3 vaults are endorsed on-chain via the registry contract
- **Timelock monitoring** (`timelock/timelock_alerts.py`): monitors the Yearn TimelockController (Strategy Manager) across 6 chains

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDS-1 Vault | [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| Spark USDS Compounder (funded) | [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| sUSDS Lender (queued, 0 debt) | [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1) | `current_debt` re-funding event, `isShutdown()`, keeper report frequency |
| USDS Sky Rewards Compounder (queued, 0 debt) | [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | `current_debt` re-funding event, `last_report` resumes, `isShutdown()` |
| Sky USDS Staking Rewards | [`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af) | Reward rate (SPK / sec), total staked, paused state |
| Sky Savings Rate (sUSDS) | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | SSR rate changes, sUSDS TVL |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes, submitted transactions |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes, config updates |

### Critical Events to Monitor

- **PPS decrease** — any decrease in `convertToAssets(1e18)` indicates a loss event. Should only increase
- **Strategy additions / removals** — `StrategyChanged` events (new strategies pass through 7-day timelock at the Strategy Manager)
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events; especially any re-funding of sUSDS Lender or USDS Sky Rewards Compounder (would diversify the dependency profile)
- **TVL inflow event** — sustained TVL re-rise above 20M would justify reassessment, since the snapshot reflects the post-redirection low
- **Emergency actions** — `Shutdown` event on vault
- **ySafe / Brain / Security signer or threshold changes** — governance integrity
- **SPK reward rate changes** — affects 100% of vault TVL via Spark USDS Compounder yield
- **Sky USDS Staking Rewards pause / migration** — would directly affect 100% of vault TVL; monitor `paused()` state

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Daily |
| `ssr()` | Sky Pot | Savings rate | Weekly |
| `rewardRate()` | USDS Staking Rewards | SPK reward rate | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~24 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Top-tier underlying:** 100% Sky USDS Staking Rewards — first-party Sky contract with $10M Immunefi bounty and 8+ years of MakerDAO heritage
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named, prominent DeFi signers). No EOA role concentration. Strategy additions go through a 7-day self-governed timelock
- **Simple, low-complexity strategy:** stake USDS into Sky's native staking contract — no conversions, no leverage, no cross-chain
- **Established track record:** ~19.0 months in production, ~9.74% cumulative return, zero incidents at the vault or strategy level
- **On-chain redundancy in the queue:** sUSDS Lender and USDS Sky Rewards Compounder both sit in the queue with 0 debt, immediately fundable by Brain if the primary venue needed to be paused
- **Atomic unwind:** the entire 6.01M USDS unwinds in a single `withdraw()` call against multi-billion underlying capacity
- **Active monitoring:** yvUSDS-1 is in Yearn's hourly monitoring system with Telegram alerts

### Key Risks

- **Single-venue concentration (100%):** at this snapshot all 6.01M USDS sits behind one Sky contract (USDS Staking Rewards). Up from 92.6% at the prior snapshot. A pause / migration / bug at that contract directly impairs the entire vault, even though the queued sUSDS Lender provides an on-chain fallback path
- **Sharp TVL contraction:** TVL fell ~83% in 8 days (35.24M → 6.01M). The drop is upstream-driven (yvUSDC-1 redirected its USDC→USDS routing to a new direct-to-sUSDS strategy and stopped depositing here), not a vault-level operational event. Smaller TVL reduces the operational cushion for fixed-cost components (keepers, harvests) and concentrates the user base
- **Queue trimmed:** Aave V3 Lido USDS Lender and Aave V3 USDS Lender both removed from the default queue; sUSDS Lender drained to 0. Rationale not independently verifiable on-chain
- **SPK reward rate variability:** SPK reward rate is governance-set and has been adjusted in the past. Reductions affect yield, not principal
- **SPK token price exposure between harvests:** small relative to vault TVL but non-zero — large SPK price drops between Spark Compounder harvest cycles would slightly underdeliver expected yield
- **yvDAI-1 dependency:** yvDAI-1 still routes ~20.6% (~1.61M DAI) of its TVL here. Coordinated yvDAI-1 withdrawals translate into pressure on the Spark Compounder unstake; settlement is atomic but multi-step

### Critical Risks

- None identified. The dominant systemic risk is a Sky USDS Staking Rewards pause or USDS depeg event, which would impair this vault and any other Sky-dependent vault simultaneously — but that is a system-wide DeFi event, not a Yearn-specific risk.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Sky / sUSDS / USDS Staking audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions on-chain verifiable. sUSDS and USDS Staking are transparent. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms (Statemind, ChainSecurity, yAcademy). Sky / sUSDS / USDS Staking: 7+ auditors (ChainSecurity, Cantina, Sherlock, Trail of Bits, etc.) |
| Bug bounty | $200K on Immunefi (Yearn); $10M on Immunefi (Sky) |
| Production history | **~19.0 months** (October 8, 2024). V3 framework: ~24 months |
| TVL | 6,008,243 USDS at snapshot (down ~83% from 35.24M April 27). Deposit limit: 100M |
| Security incidents | None on V3, none on USDS / USDS Staking |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — Strong audit coverage on both layers (vault + Sky). ~19.0 months of clean production. The TVL drop is upstream-routing-driven and does not change the historical-track-record scoring.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** (no proxy upgrades) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | Strategy additions and accountant changes through **7-day TimelockController** |
| Privileged roles | Well-distributed: Daddy (6/9, all roles), Brain (3/8, operational), Security (4/7), Keeper + Debt Allocator (bots) |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.0 / 5** — Immutable + 7-day self-governed timelock + 6/9 named signers + no EOA roles = textbook score-1 governance per the rubric.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals on-chain |
| Strategy reporting | Programmatic via keeper (yHaaSRelayer) |
| Debt allocation | Both automated (Debt Allocator) and manual (Brain multisig) |

**Programmability Score: 1.0 / 5** — Fully programmatic system. PPS calculated on-chain via ERC-4626. All vault operations permissionless. Strategy reporting automated.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Funded protocol count | **1** (Sky USDS Staking Rewards), **100% of TVL** |
| Queued, 0-debt fallbacks | sUSDS Lender (Sky Savings vault), USDS Sky Rewards Compounder (alternate Sky Staking implementation) |
| Criticality | Sky USDS Staking Rewards critical (100%); plus dependency on the underlying USDS token itself |
| Quality | Top-tier — Sky has $10M bounty, ~$5.38B sUSDS TVL, and 8+ years of MakerDAO heritage |

**Dependencies Score: 3.0 / 5** — **single funded venue at 100%**, up from 92.6% at the prior snapshot. Per the rubric, "1 critical concentrated dependency" warrants 3.0 even when the venue is top-tier. The two queued sUSDS / Sky-Rewards alternates are immediately fundable but uncounted at the snapshot.

**Centralization Score = (1.0 + 1.0 + 3.0) / 3 ≈ 1.667 → 1.7**

**Score: 1.7 / 5** — Immutable vault with named-signer multisig and 7-day timelock. Fully programmatic. The 100% single-venue dependency on Sky USDS Staking Rewards drives the subcategory upward versus the prior snapshot.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDS-backed, deployed to first-party Sky contracts (USDS Staking Rewards + sUSDS) |
| Collateral quality | USDS backed by Sky's over-collateralized loan book + RWA Treasury bills (inherited from MakerDAO) |
| Leverage | None |
| Verifiability | ERC-4626, all positions on-chain |

**Collateralization Score: 1.0 / 5** — 100% on-chain USDS backing deployed to a top-tier Sky-ecosystem contract. No leverage. Fully verifiable.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain — anyone can verify yvUSDS-1 → Spark Compounder → Sky USDS Staking position |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers with 3-day profit unlock |
| Third-party verification | USDS Staking Rewards staked balance and reward rate on-chain, verifiable independently |

**Provability Score: 1.0 / 5** — Excellent transparency. ERC-4626 provides fully on-chain real-time verification.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5** — Outstanding on-chain provability. Top-tier collateral quality. No leverage. Single simple pipeline.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Spark Compounder unstake from Sky USDS Staking Rewards (atomic) |
| Liquidity depth | USDS Staking Rewards: multi-billion USDS staked. 6.01M vault is a tiny fraction of capacity |
| Large holder impact | 6.01M vault vs multi-billion underlying pool — negligible |
| Same-value asset | USDS-denominated — no price-divergence risk |
| Withdrawal restrictions | None — atomic redemption, no cooldown |
| Single-venue concentration | 100% unwind capacity sits at one Sky contract; pause/migration would block redemption until Brain re-routes (queued sUSDS Lender provides on-chain fallback) |

**Score: 1.5 / 5** — Highly liquid against deep underlying capacity, but **single-venue unwind dependency** keeps this from a clean 1.0. The single-venue concentration risk is also captured in Cat 2C, so it is not double-counted here. Cascading-withdrawal pressure from yvDAI-1 (~20.6% of yvDAI routes here) settles atomically but multi-step.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020. Named multisig signers |
| Vault management | Standard Yearn governance (ySafe 6-of-9). Same pattern across 37+ vaults |
| Documentation | V3 docs comprehensive. Strategy code verified on Etherscan |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Demonstrated capability across 4 historical V1 events. $200K Immunefi bounty |
| Monitoring | Active hourly large-flow alerts. Vault is in monitoring list |

**Score: 1.0 / 5** — Top-tier operational maturity.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.7 | 30% | 0.500 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.375 → 1.4 / 5.0** |

**Change from prior snapshot (April 27 = 1.3):** Cat 2C dependencies moved from 2.5 → 3.0 because the dependency profile is now fully single-venue (100% Sky USDS Staking Rewards, up from 92.6%). The other category scores are unchanged. Per the framework's conservative rounding rule, 1.375 rounds up to **1.4**.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.4 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (November 2026) or annually
- **TVL-based:** Reassess if TVL exceeds 50M USDS or changes by more than ±50% from the May 5 snapshot of 6.01M (would indicate either a material upstream re-routing back into this vault or further contraction)
- **Allocation drift:**
  - if Spark USDS Compounder share drops below 90% (i.e. Brain re-funds sUSDS Lender or Sky Rewards Compounder materially), Cat 2C dependencies should soften from 3.0 toward 2.5
  - if Spark Compounder share remains 100% but the queued sUSDS Lender / Sky Rewards Compounder are removed from the queue, Cat 2C should harden further (no on-chain fallback)
- **Strategy changes (`addStrategy()` proposals at the Strategy Manager TimelockController, [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73), 7-day delay):**
  - any new strategy proposed for inclusion — re-review during the 7-day timelock window
  - any new strategy with leverage, looping, cross-chain bridging, or non-blue-chip routing
  - re-introduction of either removed Aave V3 USDS strategy
- **Vault-of-vaults composition:** reassess if a new Yearn V3 vault begins routing into yvUSDS-1 (would re-establish terminal-layer concentration risk)
- **Sky-specific:**
  - SPK reward rate changes materially or the USDS Staking Rewards contract is paused / migrated
  - any change to the USDS contract (upgrade, governance vote)
- **Incident-based:** any V3 exploit, strategy loss, governance change, or Sky / MakerDAO incident
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

Snapshot at block 25031569 (May 5, 2026, 21:42 UTC).

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER                                  │
│                                                                       │
│  ┌────────────────────────────────────────┐                          │
│  │  yvUSDS-1 (v3.0.3)                    │                          │
│  │  ERC-4626, immutable Vyper proxy       │                          │
│  │  0x1828…47E8                           │                          │
│  │                                        │                          │
│  │  TVL: 6,008,242.81 USDS                │                          │
│  │   ├── 0 idle                           │                          │
│  │   └── 6,008,242.81 → Spark Compounder │                          │
│  └─────────────────┬──────────────────────┘                          │
│                    │                                                  │
│                    ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │ SPARK USDS COMPOUNDER (100%)                                     ││
│  │ 0xc9f0…f8a3                                                      ││
│  │   USDS → Sky USDS Staking Rewards → SPK → USDS                   ││
│  │   Atomic unstake on user withdrawal                              ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                       │
│  Queued, 0 debt at snapshot (on-chain fallbacks):                     │
│   • USDS Sky Rewards Compounder — 0x0868…5b81 (alternate Sky Staking) │
│   • sUSDS Lender              — 0x3F2d…CfC1 (Sky Savings Rate)        │
│                                                                       │
│  Removed from queue (Apr 27 → May 5):                                 │
│   • Aave V3 Lido USDS Lender — 0xC08d…3978                            │
│   • Aave V3 USDS Lender      — 0xD144…AaC61                           │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          UNDERLYING                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Sky USDS Staking Rewards   0x173e…F3af                         │  │
│  │ Multi-billion USDS staked, SPK reward token (0xc200…b066)       │  │
│  │ $10M Immunefi bug bounty (Sky)                                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

Upstream composition (vault-of-vaults) at block 25031569:
  yvUSDC-1 → USDC to USDS Depositor       — 0 USDC debt (no longer routes here)
  yvDAI-1  → DAI to USDS Depositor        — ~1.61M DAI (~20.6% of yvDAI TVL)

Net effect: ~1.61M of upstream depositor flow currently lands here
(down from ~$42M across four vaults at the prior snapshot).
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — deployed at [block 24,242,692](https://etherscan.io/tx/0x3063e5a82b383d0f5b38e8735dd13c0c9d492c3bfe5dc9d3d23fc829c60f96b0) with `admin = address(0)`. Same timelock used by 37+ Yearn V3 vaults including all six mainnet risk-1 vaults.

### Timelock Roles

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)` at construction). No one can grant / revoke roles outside the propose → wait → execute flow |
| **TIMELOCK_ADMIN** | Timelock itself ([`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73)) | Contract | Only the timelock can admin its own roles. Config changes (delay, role grants) must go through the 7-day delay |
| **PROPOSER** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | **Sole proposer** — no one else can initiate timelocked operations |
| **EXECUTOR** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor ([`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b)) | Contract | Wrapper — delegates to its internal executor list (Brain + deployer EOA) |
| **CANCELLER** | Daddy/ySafe ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain ([`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7)) | 3-of-8 Safe | Cancel pending proposals |

### Why the 7-day delay cannot be bypassed

To shorten the delay, an attacker would need to (1) control Daddy 6/9 to **propose** `updateDelay()` — only Daddy can propose; (2) wait 7 days, during which Brain or Daddy can cancel; (3) execute via Daddy, Brain (via TimelockExecutor), or the deployer EOA — but the operation is already visible on-chain for 7 days. DEFAULT_ADMIN was never granted, so no one can self-grant PROPOSER or TIMELOCK_ADMIN to skip the flow.
