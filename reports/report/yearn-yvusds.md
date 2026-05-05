# Protocol Risk Assessment: Yearn — yvUSDS-1

- **Assessment Date:** April 27, 2026
- **Token:** yvUSDS-1 (USDS-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8)
- **Final Score: 1.3/5.0**

## Overview + Links

yvUSDS-1 is a **USDS-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDS into yield strategies on Ethereum mainnet. The vault currently uses **two materially funded strategies** — the **Spark USDS Compounder** (~92.6%) which stakes USDS into the **Sky USDS Staking Rewards** contract for SPK token rewards, and the **sUSDS Lender** (~7.4%) which deposits USDS into the Sky Savings Rate vault — plus a dust position in the Aave V3 Lido USDS market.

This vault is the **terminal layer** for the broader Yearn V3 mainnet risk-1 stable stack: yvUSDC-1 currently routes 100% of its deployed funds here (via `USDC to USDS Depositor`), and yvDAI-1 routes 27.5% directly here (with another 72.5% routing through yvUSDC-1 onward). After de-duplicating the cross-counted depositor strategies, roughly **~$42M of net unique stable capital** across the four stable risk-1 vaults ultimately concentrates in yvUSDS-1's two main strategies.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.3) accepting USDS deposits, issuing yvUSDS-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.3 Yearn V3 Vault Factory ([`0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f`](https://etherscan.io/address/0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f))
- **Strategy pipelines:**
  - **Spark USDS Compounder (92.6%):** stakes USDS into the Sky **USDS Staking Rewards** contract ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)), harvests SPK token rewards ([`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066)), and converts back to USDS
  - **sUSDS Lender (7.4%):** deposits USDS into the Sky Savings vault ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) and earns the Sky Savings Rate (SSR)
  - **Aave V3 Lido USDS Lender (<0.01%):** dust position
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions
- **Multi-strategy capable:** 5 strategies in the default queue (Spark USDS Compounder, sUSDS Lender, Aave V3 Lido USDS, Aave V3 USDS, USDS Sky Rewards Compounder)

**Key metrics (April 27, 2026, snapshot at block 24974187):**

- **TVL:** ~$35,236,511 USDS
- **Total Supply:** ~32,142,127 yvUSDS-1
- **Price Per Share:** 1.096272 USDS/yvUSDS-1 (~9.63% cumulative appreciation over ~18.6 months, ~6.1% annualized)
- **Total Debt:** 33,513,026.71 USDS (~95.1% deployed)
- **Total Idle:** 1,723,484.42 USDS
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

### Active Strategies (5 in default queue, 3 with debt)

| # | Strategy | Name | Current Debt (USDS) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3) | **Spark USDS Compounder** | **31,047,030.22** | **92.6%** |
| 2 | [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1) | **sUSDS Lender** | **2,465,424.05** | **7.4%** |
| 3 | [`0xC08d81aba10f2dcBA50F9A3Efbc0988439223978`](https://etherscan.io/address/0xC08d81aba10f2dcBA50F9A3Efbc0988439223978) | Aave V3 Lido USDS Lender | 572.44 | <0.01% |
| 4 | [`0xD144eAFf17b0308a5154444907781382398AaC61`](https://etherscan.io/address/0xD144eAFf17b0308a5154444907781382398AaC61) | Aave V3 USDS Lender | 0 | 0% |
| 5 | [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | USDS Sky Rewards Compounder | 0 | 0% |

**Note:** allocation is overwhelmingly into Sky-ecosystem strategies (Spark Compounder + sUSDS Lender = 100% of meaningful debt). Aave V3 USDS markets are queued but not currently funded.

### Strategy Protocol Dependencies

| Protocol | Strategy | Allocation |
|----------|----------|-----------|
| **Sky / Spark (USDS Staking Rewards SPK farm)** | Spark USDS Compounder | **~92.6%** |
| **Sky (sUSDS Savings Rate)** | sUSDS Lender | **~7.4%** |
| Aave V3 Lido market (USDS) | Aave V3 Lido USDS Lender | <0.01% (dust) |
| Aave V3 (USDS) | Aave V3 USDS Lender | 0% (queue only) |
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

- **2 materially funded strategies** on a single chain (Ethereum), both inside the Sky ecosystem
- **No conversion hops** — the underlying asset (USDS) is the same as Sky's native staking/savings token. The Spark Compounder stakes USDS directly; the sUSDS Lender deposits USDS directly into sUSDS
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Blue-chip protocol dependency** (Sky / Spark)
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

The main accounting subtlety is the SPK reward harvest: the Spark Compounder periodically claims SPK from the staking contract and swaps it back to USDS. This is a standard reward-harvesting pattern; SPK price exposure between harvests is small relative to vault TVL.

## Historical Track Record

- **Vault deployed:** October 8, 2024 (deployment [tx](https://etherscan.io/tx/0x6a1996554455945f9ba5f58b831c86f9afaeb1a5c36b9166099a7d3ac0106803)) — **~18.6 months** in production
- **TVL:** ~$35.24M USDS — well within the $100M deposit limit
- **PPS trend:** 1.000000 → 1.096272 (~9.63% cumulative return over ~18.6 months, ~6.1% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework generally
- **Strategy changes:** active management — Spark USDS Compounder and sUSDS Lender added through 2025; Aave V3 Lido USDS and Aave V3 USDS markets queued more recently
- **Current allocation:** 92.6% Spark Compounder + 7.4% sUSDS Lender + dust on Aave V3 Lido USDS
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~23 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026). Ethereum dominant at ~$149.6M.

**Sky / sUSDS / USDS Staking track record:**

- USDS launched as part of Sky Endgame (2024)
- sUSDS TVL: ~$5.38B (Sky Savings vault) plus broader USDS / sUSDS supply across the ecosystem
- USDS Staking Rewards (SPK farm) — part of the Sky tokenomics, distributes SPK governance token to USDS stakers
- No security incidents on USDS / sUSDS / USDS Staking since launch

## Funds Management

yvUSDS-1 deploys USDS into yield strategies inside the Sky ecosystem. Capital utilization is ~95%, with two materially funded strategies plus a dust position.

### Strategy 1: Spark USDS Compounder (~92.6% allocation)

**Contract:** [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)

**Mechanic:**

1. **Stake:** USDS is deposited into the Sky **USDS Staking Rewards** contract ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)). Staked USDS remains 1:1 redeemable; staking unlocks the right to accrue SPK rewards.
2. **Harvest:** The strategy's keeper periodically claims accrued SPK ([`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066)) and converts it back to USDS, compounding the principal.
3. **Withdraw:** Atomic — strategy unstakes USDS from the Staking Rewards contract.

**Risk profile:** SPK token price exposure exists between harvest cycles, but the principal is held as USDS and is unstaked 1:1. The dominant risk is at the Sky USDS Staking Rewards contract / SPK token level — both are part of the audited Sky/Spark stack.

**Strategy parameters:**
- Activated: 2025-07-14
- Last reported: 2026-04-23
- Management: Brain multisig (3-of-8) and Debt Allocator
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))

### Strategy 2: sUSDS Lender (~7.4% allocation)

**Contract:** [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)

**Mechanic:** Direct deposit into the Sky Savings vault sUSDS ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) — earns the Sky Savings Rate (SSR), currently around the SSR set by Sky governance. sUSDS is an ERC-4626 wrapper over the Sky `pot`, so accounting is fully on-chain via `convertToAssets()`.

**Withdrawal:** Atomic — `redeem` from sUSDS releases USDS 1:1 plus accrued yield.

**Risk profile:** Inherits Sky / sUSDS risk. SSR is set by Sky governance and can be raised or lowered.

**Strategy parameters:**
- Activated: 2025-05-15
- Last reported: 2026-04-23
- Management: Brain multisig + Debt Allocator
- Keeper: yHaaSRelayer

### Strategy 3: Aave V3 Lido USDS Lender (dust, <0.01%)

**Contract:** [`0xC08d81aba10f2dcBA50F9A3Efbc0988439223978`](https://etherscan.io/address/0xC08d81aba10f2dcBA50F9A3Efbc0988439223978)

572.44 USDS as of snapshot. Direct supply into the Aave V3 Lido USDS market. Operationally inactive — kept in the queue for optionality but not contributing to current yield.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDS and receive yvUSDS-1 (ERC-4626 standard). Subject to 100M USDS deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDS-1 for USDS. Pipeline unwinds via Spark Compounder unstake (atomic) or sUSDS withdraw (atomic). Both paths are highly liquid
- **No cooldown or lock period**
- **Fees:** 0% management fee, 10% performance fee (taken via accountant during `process_report`)
- **Profit unlock:** 3 days

### Collateralization

- **100% on-chain USDS backing.** All deposits are USDS, deployed into Sky-ecosystem yield products
- **Collateral quality:** USDS itself is backed by Sky's over-collateralized loan book and RWA Treasury bill investments (inherited from MakerDAO). sUSDS and USDS Staking Rewards are first-party Sky contracts
- **No leverage** — both active strategies are simple deposit/stake products, no borrowing
- **All positions are fully redeemable** — sUSDS supports standard ERC-4626 withdrawal; USDS Staking Rewards unstaking is 1:1

### Provability

- **yvUSDS-1 exchange rate:** Calculated on-chain via ERC-4626 standard (`convertToAssets()` / `convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** Each strategy's `totalAssets()` reads the underlying staking balance (USDS Staking Rewards) or vault share balance (sUSDS) and converts to USDS equivalent on-chain
- **SSR rate:** Set by Sky Governance and applied on-chain via the `pot` / `ssr` mechanism. The sUSDS exchange rate increases continuously based on the SSR
- **SPK reward rate:** Set by Sky / Spark governance and visible on-chain via the Staking Rewards contract
- **Profit / loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 3 days (`profitMaxUnlockTime = 3 days`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDS-1 for USDS via ERC-4626 `withdraw()` / `redeem()`. Triggers strategy `withdraw()` calls — Spark Compounder unstakes USDS atomically; sUSDS Lender redeems sUSDS atomically
- **Highly liquid underlying:** sUSDS holds ~$5.38B; the USDS Staking Rewards contract has multi-billion USDS staked. yvUSDS-1's ~$35.24M is a small fraction of underlying capacity
- **No DEX liquidity needed** — exit is via the protocol's own contracts (Sky Staking Rewards unstake + sUSDS redeem), not DEX AMMs
- **Same-value asset:** USDS-denominated vault token — no price-divergence risk from the underlying
- **No withdrawal queue or cooldown** — atomic redemption
- **Deposit limit:** 100M USDS cap — generous relative to current TVL of ~$35.24M (room for +184%)

**Note on cascading withdrawals:** because yvUSDC-1 currently routes 100% of its deployed USDC into yvUSDS-1 (via the `USDC to USDS Depositor` strategy), and yvDAI-1 routes 27.5% of DAI directly here, large coordinated withdrawals from yvUSDC-1 or yvDAI-1 will translate into pressure on yvUSDS-1's strategy unwinds. Each layer settles atomically in the same transaction, but the call stack is multi-step.

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
| **Sky USDS Staking Rewards** | Critical | ~92.6% of allocation. Core part of the Sky Endgame tokenomics; SPK rewards distributed to USDS stakers |
| **Sky / sUSDS** | Critical | ~7.4% of allocation. ~$5.38B sUSDS TVL. Blue-chip, extensively audited, $10M bug bounty |
| **USDS itself** | Critical | The underlying asset of the vault — failure of USDS would be terminal regardless of strategy mix |
| **SPK token** | High | Reward token sold back to USDS during compounding. SPK price exposure between harvests is small relative to vault TVL but non-zero |
| **Aave V3 Lido USDS market** | Low | ~$572 dust position |

**Dependency quality:** all current dependencies are first-party Sky / Spark contracts plus the underlying USDS token. Sky has 8+ years of history (inheriting MakerDAO's track record), $5.38B in sUSDS, and a $10M bug bounty. The concentration is high — yvUSDS-1 is effectively a single-ecosystem vault — but the ecosystem is the highest-quality stable-asset infrastructure in DeFi. The dependency profile would diversify if the Aave V3 USDS Lender or another non-Sky strategy gets funded.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The ySafe 6-of-9 has 9 named signers including prominent DeFi figures
- **Governance:** Standard Yearn V3 Role Manager — same pattern across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn Finance has converted ychad.eth into a BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation
- **Incident response:** Yearn has demonstrated incident response across 4 historical events (all V1 / legacy). V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **V3 immutability:** Vault contracts cannot be upgraded — eliminates proxy upgrade risk but means bugs cannot be patched in place; a critical bug requires deploying a new vault and migrating users

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
| Spark USDS Compounder | [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3) | `totalAssets()`, `isShutdown()`, keeper report frequency |
| sUSDS Lender | [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1) | `totalAssets()`, `isShutdown()`, keeper report frequency |
| Sky USDS Staking Rewards | [`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af) | Reward rate (SPK / sec), total staked, paused state |
| Sky Savings Rate (sUSDS) | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | SSR rate changes, sUSDS TVL |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes, submitted transactions |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes, config updates |

### Critical Events to Monitor

- **PPS decrease** — any decrease in `convertToAssets(1e18)` indicates a loss event. Should only increase
- **Strategy additions / removals** — `StrategyChanged` events (new strategies pass through 7-day timelock)
- **Debt allocation changes** — `UpdatedMaxDebtForStrategy` and `DebtUpdated` events
- **Emergency actions** — `Shutdown` event on vault
- **ySafe / Brain / Security signer or threshold changes** — governance integrity
- **SSR rate changes** — Sky governance can adjust the savings rate, affecting sUSDS Lender yield
- **SPK reward rate changes** — affects Spark USDS Compounder yield
- **Sky USDS Staking Rewards pause / migration** — would directly affect ~92.6% of vault TVL

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

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by Statemind, ChainSecurity, and yAcademy. No V3 exploits in ~23 months of production. Immutable vault contracts eliminate proxy upgrade risk
- **Top-tier underlying:** ~92.6% Sky USDS Staking Rewards + ~7.4% sUSDS — both first-party Sky contracts with $10M Immunefi bounty and 8+ years of MakerDAO heritage
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named, prominent DeFi signers). No EOA role concentration. Strategy additions go through a 7-day self-governed timelock
- **Simple, low-complexity strategies:** stake USDS / deposit into sUSDS — no conversions, no leverage, no cross-chain
- **Established track record:** ~18.6 months in production with ~$35.24M TVL, ~9.63% cumulative return, zero incidents
- **Active monitoring:** yvUSDS-1 is in Yearn's hourly monitoring system with Telegram alerts

### Key Risks

- **Single-ecosystem concentration:** ~100% of materially funded debt sits in Sky / Spark contracts (USDS Staking Rewards + sUSDS). A bug or governance failure at the Sky USDS Staking Rewards contract would directly impair ~92.6% of vault TVL
- **Terminal-layer for the broader stack:** yvUSDC-1 routes 100% of deployed funds into yvUSDS-1; yvDAI-1 routes ~27.5% directly here. A bug at this vault propagates upward to the entire stable risk-1 set (~$42M net unique stable capital)
- **Sky Savings Rate / SPK reward rate variability:** SSR has been reduced from 15% → 6.5% → 4.5% → ~4% over the past year. Reductions affect yield, not principal. SPK reward rate is similarly governance-set
- **SPK token price exposure between harvests:** small relative to vault TVL but non-zero — large SPK price drops between Spark Compounder harvest cycles would slightly underdeliver expected yield

### Critical Risks

- None identified. The dominant systemic risk is a Sky USDS / sUSDS / USDS Staking failure, which would simultaneously impair the four stable risk-1 vaults — but that is a system-wide DeFi event, not a Yearn-specific risk.

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
| Production history | **~18.6 months** (October 8, 2024). V3 framework: ~23 months |
| TVL | **~$35.24M** USDS. Deposit limit: 100M |
| Security incidents | None on V3, none on USDS / sUSDS / USDS Staking |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — Strong audit coverage on both layers (vault + Sky). ~18.6 months of clean production with material TVL. The only mild downward pressure relative to a perfect 1 is the relatively recent (~18 months) production history compared to the older risk-1 vaults.

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
| Protocol count | 1 active ecosystem (Sky / Spark) for ~100% of funded debt; 1 dormant (Aave V3 USDS) |
| Criticality | Sky USDS Staking Rewards is critical (~92.6%); sUSDS critical (~7.4%); plus the underlying USDS token itself |
| Quality | Top-tier — Sky has $10M bounty, ~$5.38B sUSDS TVL, and 8+ years of MakerDAO heritage |

**Dependencies Score: 2.5 / 5** — single blue-chip ecosystem dependency for ~100% of funded debt, plus dependency on the vault's own underlying asset (USDS) being stable. Per rubric, single-ecosystem concentration of this size warrants 2.5 even when the ecosystem is top-tier.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5** — Immutable vault with named-signer multisig and 7-day timelock. Fully programmatic. The single-ecosystem (Sky) dependency is the dominant centralization-adjacent risk, since this vault is the terminal layer for the broader risk-1 stable stack.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDS-backed, deployed to first-party Sky contracts (USDS Staking Rewards + sUSDS) |
| Collateral quality | USDS backed by Sky's over-collateralized loan book + RWA Treasury bills (inherited from MakerDAO) |
| Leverage | None |
| Verifiability | ERC-4626, all positions on-chain |

**Collateralization Score: 1.0 / 5** — 100% on-chain USDS backing deployed to top-tier Sky-ecosystem contracts. No leverage. Fully verifiable.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain — anyone can verify yvUSDS-1 → Spark Compounder / sUSDS positions |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers with 3-day profit unlock |
| Third-party verification | sUSDS rate and USDS Staking Rewards rate are on-chain, verifiable independently |

**Provability Score: 1.0 / 5** — Excellent transparency. ERC-4626 provides fully on-chain real-time verification.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5** — Outstanding on-chain provability. Top-tier collateral quality. No leverage. Simple pipelines.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Spark Compounder unstake (atomic) + sUSDS redeem (atomic) |
| Liquidity depth | sUSDS: $5.38B TVL. USDS Staking: multi-billion USDS staked. Vault is small fraction of capacity |
| Large holder impact | $35.24M vault vs multi-billion pools — negligible |
| Same-value asset | USDS-denominated — no price-divergence risk |
| Withdrawal restrictions | None — atomic redemption, no cooldown |

**Score: 1.5 / 5** — Highly liquid. The only marginal risk is the cascading withdrawal pressure from the upstream vault-of-vaults stack (yvUSDC-1 routes 100% here, yvDAI-1 routes 27.5% directly here), which is atomic but multi-step.

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

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (October 2026) or annually
- **TVL-based:** Reassess if TVL exceeds $100M (the deposit limit) or changes by more than ±50%
- **Strategy posture:**
  - if yvUSDS-1 funds the Aave V3 USDS Lender or another non-Sky strategy materially, the dependency subscore should diversify
  - if a new strategy is added that takes leverage or routes through a non-blue-chip protocol, full re-review
- **Vault-of-vaults composition:** reassess if a new Yearn V3 vault is added as a depositor into yvUSDS-1 (further concentrating the terminal-layer role)
- **Sky-specific:**
  - SSR drops below 2% (may indicate Sky-side stress)
  - SPK reward rate changes materially or the USDS Staking Rewards contract is paused / migrated
  - any change to the USDS or sUSDS contracts (upgrade, governance vote)
- **Incident-based:** any V3 exploit, strategy loss, governance change, or Sky / MakerDAO incident
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvUSDS-1 (v3.0.3)   │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  0x1828…47E8          │                                          │
│  │                       │                                          │
│  │  deposit() / redeem() │                                          │
│  │  totalAssets()        │                                          │
│  └──────────┬────────────┘                                          │
│             │ deploys USDS to 3 funded strategies                    │
│             │                                                        │
│  ┌──────────▼──────────────────────────────────────────────────────┐│
│  │  STRATEGIES (by allocation)                                      ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ SPARK USDS COMPOUNDER (~92.6%)                          │    ││
│  │  │   USDS → Sky USDS Staking Rewards → SPK → USDS          │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ sUSDS LENDER (~7.4%)                                    │    ││
│  │  │   USDS → sUSDS (Sky Savings Rate)                       │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │  ┌─────────────────────────────────────────────────────────┐    ││
│  │  │ AAVE V3 LIDO USDS LENDER (<0.01%, dust)                 │    ││
│  │  └─────────────────────────────────────────────────────────┘    ││
│  │                                                                  ││
│  │  2 dormant strategies in queue with 0 debt:                      ││
│  │  Aave V3 USDS Lender, USDS Sky Rewards Compounder                ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
                                │
                  deposits into underlying protocols
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│                    UNDERLYING PROTOCOLS                                │
│                                                                       │
│  ┌──────────────────────────┐    ┌──────────────────────────┐        │
│  │  Sky USDS Staking        │    │  Sky / sUSDS             │        │
│  │  0x173e…F3af             │    │  ~$5.38B sUSDS TVL       │        │
│  │  SPK rewards             │    │  SSR (Sky governance)    │        │
│  │  ~92.6% of vault         │    │  ~7.4% of vault          │        │
│  └──────────────────────────┘    └──────────────────────────┘        │
└───────────────────────────────────────────────────────────────────────┘

Upstream composition (vault-of-vaults):
  yvUSDC-1 ─── 100% (USDC→DAI→USDS depositor) ──┐
  yvDAI-1  ───  27.5% (DAI→USDS depositor) ─────┼─► yvUSDS-1
                                                 │
  yvDAI-1  ───  72.5% via yvUSDC-1 ─────────────┘

Net effect: ~$42M of net unique stable capital across the four risk-1
stable vaults ultimately concentrates in yvUSDS-1's two main strategies.
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
