# Protocol Risk Assessment: Yearn — yvUSDS-1

- **Assessment Date:** May 11, 2026 (Updated: September 28, 2026)
- **Token:** yvUSDS-1 (USDS-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8)
- **Final Score: 1.32/5.0**

## Overview + Links

yvUSDS-1 is a **USDS-denominated Yearn V3 vault** (ERC-4626) that deploys deposited USDS into yield strategies on Ethereum mainnet. At the September 28 snapshot the vault is **100% deployed across two funded strategies**, both of which stake USDS into first-party Sky `StakingRewards` farms:

- **Grove USDS Compounder (96.53%)** — stakes USDS into the Sky **USDS → GROVE** staking-rewards farm and sells GROVE rewards back to USDS through a Yearn Dutch auction
- **Spark USDS Compounder (3.47%)** — stakes USDS into the Sky **USDS → SPK** staking-rewards farm

The other two queued strategies — **sUSDS Lender** and **USDS Sky Rewards Compounder** — both hold zero debt.

The allocation changed twice since the July 13 reassessment. First, the sUSDS Lender was drained to zero on August 22, 2026, leaving 100% in the Spark Compounder at the September 14 check. Second, a new **Grove USDS Compounder** was proposed at the Strategy Manager timelock on September 14 ([tx](https://etherscan.io/tx/0x668f9c885979f6a928c431df388ecd031e227da6598652226e2ce6003d3a23d1)), added to the vault after the 7-day delay on September 21 ([tx](https://etherscan.io/tx/0xcb16d156c19a90e98a785d50dc8ca88b5a2297053e2d895f08d4e4091f6dad4d)), and Brain moved ~96.5% of debt into it on September 21–22. TVL rose from 6.23M (July 13) to **10.52M USDS** (+68.9%).

This vault is the **terminal USDS layer for two Yearn V3 mainnet risk-1 stable vaults**. At the snapshot, **73.72% of yvUSDS-1 TVL** is held by two Yearn depositor strategies: yvUSDC-1's `USDC to USDS Depositor` (5.55M USDS, 52.73%) and yvDAI-1's `DAI to USDS Depositor` (2.21M USDS, 20.99%).

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.3) accepting USDS deposits, issuing yvUSDS-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.3 Yearn V3 Vault Factory ([`0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f`](https://etherscan.io/address/0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f))
- **Default queue (4 strategies, 2 funded):**
  1. **USDS Sky Rewards Compounder** ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81)) — 0 USDS debt. Targets the Sky **USDS → SKY** farm ([`0x0650CAF159C5A49f711e8169D4336ECB9b950275`](https://etherscan.io/address/0x0650CAF159C5A49f711e8169D4336ECB9b950275)), whose reward period ended January 26, 2026
  2. **Spark USDS Compounder** ([`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)) — **364,574.52 USDS (3.47%)**, stakes USDS into the Sky **USDS → SPK** farm ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)) and harvests SPK ([`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066)) back to USDS
  3. **sUSDS Lender** ([`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)) — 0 USDS debt (drained August 22, 2026; deposits into the Sky Savings vault when funded)
  4. **Grove USDS Compounder** ([`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622)) — **10,155,032.07 USDS (96.53%)**, stakes USDS into the Sky **USDS → GROVE** farm ([`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a)) and sells GROVE ([`0xB30FE1Cf884B48a22a50D22a9282004F2c5E9406`](https://etherscan.io/address/0xB30FE1Cf884B48a22a50D22a9282004F2c5E9406)) via a Yearn auction ([`0xF3318007c41539b691b49D3e898560AB5BB966A3`](https://etherscan.io/address/0xF3318007c41539b691b49D3e898560AB5BB966A3))
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (September 28, 2026, snapshot at block 26077066):**

- **TVL:** 10,519,606.58 USDS
- **Total Supply:** 9,464,711.36 yvUSDS-1
- **Price Per Share:** 1.111456 USDS/yvUSDS-1 (~11.15% cumulative appreciation over ~23.7 months, ~5.5% annualized)
- **Total Debt:** 10,519,606.58 USDS (100% deployed)
- **Total Idle:** 0 USDS
- **Deposit Limit:** 100,000,000 USDS
- **Profit Max Unlock Time:** 3 days
- **Fees:** 0% management fee, 10% performance fee (Accountant `getVaultConfig(vault)`)

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Sky Protocol Documentation](https://developers.skyeco.com/)
- [Sky Savings Rate (sUSDS)](https://docs.spark.fi/user-guides/earning-savings/susds)
- [Sky USDS Staking Rewards](https://docs.spark.fi/user-guides/farming-rewards)

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
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe — REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe — DEBT, MAX_DEBT, EMERGENCY |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** for strategy additions and accountant changes. Self-governed (TIMELOCK_ADMIN held by the timelock itself) |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.3) | [`0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f`](https://etherscan.io/address/0x5577EdcB8A856582297CdBbB07055E6a6E38eb5f) |
| Vault Original (v3.0.3) | [`0xcA78AF7443f3F8FA0148b746Cb18FF67383CDF3f`](https://etherscan.io/address/0xcA78AF7443f3F8FA0148b746Cb18FF67383CDF3f) |
| TokenizedStrategy v3.0.3 (sUSDS Lender, USDS Sky Rewards Compounder) | [`0x254A93feff3BEeF9cA004E913bB5443754e8aB19`](https://etherscan.io/address/0x254A93feff3BEeF9cA004E913bB5443754e8aB19) |
| TokenizedStrategy v3.0.4 (Spark USDS Compounder) | [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) |
| TokenizedStrategy v3.1.0 (Grove USDS Compounder) | [`0x310f5Db015E9d6E542fd41bd4542640790791e76`](https://etherscan.io/address/0x310f5Db015E9d6E542fd41bd4542640790791e76) |

### Active Strategies (4 in default queue, 2 with debt)

Default queue order at block 26077066:

| # | Strategy | Name | Activation | Current Debt (USDS) | Allocation |
|---|----------|------|------------|--------------------:|-----------:|
| 1 | [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | USDS Sky Rewards Compounder | 2025-05-16 | 0 | 0% |
| 2 | [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3) | Spark USDS Compounder | 2025-07-14 | 364,574.52 | 3.47% |
| 3 | [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1) | sUSDS Lender | 2025-05-14 | 0 | 0% |
| 4 | [`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622) | **Grove USDS Compounder** | 2026-09-21 | **10,155,032.07** | **96.53%** |

**Removed from queue at prior reshape (between April 27 and May 5, still absent at September 28):**

- Aave V3 Lido USDS Lender ([`0xC08d81aba10f2dcBA50F9A3Efbc0988439223978`](https://etherscan.io/address/0xC08d81aba10f2dcBA50F9A3Efbc0988439223978))
- Aave V3 USDS Lender ([`0xD144eAFf17b0308a5154444907781382398AaC61`](https://etherscan.io/address/0xD144eAFf17b0308a5154444907781382398AaC61))

**Current funding posture:** **96.53% Grove USDS Compounder (Sky USDS → GROVE farm), 3.47% Spark USDS Compounder (Sky USDS → SPK farm)**. The sUSDS Lender is drained to 0 (not shut down — Brain can re-fund it), and the USDS Sky Rewards Compounder remains queued at 0 debt (with ~833 USDS of unreported dust in its `totalAssets()`). Last reports: Grove Compounder 2026-09-28 (`last_report = 1790565059`), Spark Compounder 2026-09-26 (`last_report = 1790392859`), sUSDS Lender 2026-08-22 (`last_report = 1787379419`, consistent with the final drain), USDS Sky Rewards Compounder 2026-02-05 (stale, consistent with zero allocated debt).

### Strategy Protocol Dependencies

| Protocol | Strategy | Allocation |
|----------|----------|-----------|
| **Sky USDS → GROVE StakingRewards** | Grove USDS Compounder | **96.53%** |
| Sky USDS → SPK StakingRewards | Spark USDS Compounder | 3.47% |
| Sky Savings Rate (sUSDS) | sUSDS Lender | 0% (drained, queue only) |
| Sky USDS → SKY StakingRewards (rewards ended Jan 26, 2026) | USDS Sky Rewards Compounder | 0% (queue only) |

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 2023 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | Jul 2023 | V3 Vaults (v3.0.1) | PDF |
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | Mar 2024 | V3 Vaults (v3.0.2) | PDF |
| [yAudit](https://github.com/yearn/yearn-security/tree/master/audits/20260601_yAudit_Yearn_V3.1.0) | Jun 2026 | V3 Vaults + Tokenized Strategy (v3.1.0) | 2 PDFs |

Dates follow the audit folder names in [yearn-security/audits](https://github.com/yearn/yearn-security/tree/master/audits). The v3.0.3 vault release used by yvUSDS-1 was reviewed **internally** by the Yearn team rather than re-engaging external auditors; the external audits cover the core architecture. Source: [yearn-vaults-v3 GitHub releases](https://github.com/yearn/yearn-vaults-v3/releases). The Grove USDS Compounder runs on TokenizedStrategy v3.1.0, which is covered by the June 2026 yAudit review. **TODO:** no audit or ySec review artifact for the `GroveCompounder` strategy contract itself was located.

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

**Sky StakingRewards farms (GROVE, SPK, SKY):** all three are verified on Etherscan as the Sky Endgame Toolkit `StakingRewards` contract, owned by the Sky `DSPauseProxy` ([`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB)), and reviewed under the Endgame Toolkit audit umbrella (ChainSecurity, Cantina).

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

- **2 funded strategies** on a single chain (Ethereum), both staking USDS into Sky `StakingRewards` farms
- **No conversion hops for principal** — the underlying asset (USDS) is the farms' staking token. Only reward tokens (GROVE, SPK) are converted back to USDS
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** deposit/withdrawal
- **Blue-chip protocol dependency** (Sky)
- **Vault is immutable** (non-upgradeable Vyper minimal proxy); strategies are non-upgradeable (see [Programmability](#programmability))

The main accounting subtlety is reward harvesting. The Grove Compounder claims GROVE on each report and kicks it into a Yearn Dutch auction ([`0xF3318007c41539b691b49D3e898560AB5BB966A3`](https://etherscan.io/address/0xF3318007c41539b691b49D3e898560AB5BB966A3); want = USDS, receiver = the strategy, minimum price 0.006 USDS/GROVE, governance-only kick). The Spark Compounder converts SPK back to USDS. Reward-token prices affect yield only; staked USDS principal is not exposed to GROVE or SPK prices.

## Historical Track Record

- **Vault deployed:** October 8, 2024 (deployment [tx](https://etherscan.io/tx/0x6a1996554455945f9ba5f58b831c86f9afaeb1a5c36b9166099a7d3ac0106803)) — **~23.7 months** in production
- **TVL:** 10,519,606.58 USDS at the September 28 snapshot — well within the 100M USDS deposit limit. TVL is up ~68.9% from the July 13 snapshot of ~6.23M and up ~44.4% from 7.29M on September 14; still down ~70% from the ~35.24M April 27 high
- **PPS trend:** 1.000000 → 1.111456 (~11.15% cumulative return over ~23.7 months, ~5.5% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework generally
- **New strategy and reallocation (September 14 → 28):** the Grove USDS Compounder `addStrategy()` was scheduled at the Strategy Manager timelock on September 14 ([tx](https://etherscan.io/tx/0x668f9c885979f6a928c431df388ecd031e227da6598652226e2ce6003d3a23d1)) and executed on September 21 ([tx](https://etherscan.io/tx/0xcb16d156c19a90e98a785d50dc8ca88b5a2297053e2d895f08d4e4091f6dad4d)). First debt allocation was 7.41M USDS on September 21 ([tx](https://etherscan.io/tx/0x6e46217c049664cb432d1e7a0f94d79d765314b9fbfd267710c16037cd58f570)), rising to 10.16M by September 22 ([tx](https://etherscan.io/tx/0x2a1e8b48d69ffa5a32c89c289e0c1f7142b7d8717e955169ff4ff4479c5115c4)); Spark Compounder debt fell from ~9.26M to ~0.36M over the same period. The strategy contract was deployed August 16, 2026 ([tx](https://etherscan.io/tx/0x598b2372f104d9c7f495bc1388f7d5d664e48ff7ab6ce12ee6cd06d7a311b358)), so it has ~1 week of production history in this vault
- **sUSDS drain (July 13 → September 14):** the sUSDS Lender was drained from ~5.24M USDS to 0 (final drain August 22, 2026, after oscillating between ~2.3M–5.2M through July–August), and all debt moved to the Spark USDS Compounder
- **Prior reshape (April 27 → May 5):** Aave V3 Lido USDS Lender and Aave V3 USDS Lender both removed from the default queue; sUSDS Lender debt was drained to zero
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~28 months). No V3 vault exploits

**Yearn protocol TVL:** ~$203.3M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), September 28, 2026). Ethereum dominant at ~$180.7M.

**Sky / sUSDS / USDS Staking track record:**

- USDS launched as part of Sky Endgame (2024)
- sUSDS TVL: ~4.47B USDS (`sUSDS.totalAssets()` at snapshot)
- USDS → GROVE farm: deployed June 23, 2026 ([tx](https://etherscan.io/tx/0xd2d30ac3fe4cf4b850ac13d3830b5d17befb453dbc5292b35708efd571c2e4bc)); **~180.8M USDS staked**; `rewardRate() = 38.84 GROVE/s`; rewards funded by a `VestedRewardsDistribution` ([`0xAf7a108B4fB0b2F65E1Acc9E1a548abe482559C4`](https://etherscan.io/address/0xAf7a108B4fB0b2F65E1Acc9E1a548abe482559C4)); current period ends October 5, 2026
- USDS → SPK farm: **~556.3M USDS staked**; `rewardRate() = 36.07 SPK/s`; current period ends October 2, 2026
- No security incidents on USDS / sUSDS / USDS StakingRewards since launch

## Funds Management

yvUSDS-1 is **100% deployed** across two strategies at the September 28 snapshot: the **Grove USDS Compounder (96.53%)** and the **Spark USDS Compounder (3.47%)**. The sUSDS Lender and USDS Sky Rewards Compounder both hold zero debt.

### Strategy 1: Grove USDS Compounder (96.53% allocation)

**Contract:** [`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622) — verified `GroveCompounder` source on Etherscan

**Mechanic:**

1. **Stake:** `_deployFunds()` calls `STAKING.stake(amount, 2009)` on the hard-coded Sky USDS → GROVE farm ([`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a)). The staking contract is a `constant`, so it cannot be repointed.
2. **Harvest:** each report claims GROVE and, above a 10,000 GROVE minimum, kicks it into the strategy's Yearn auction ([`0xF3318007c41539b691b49D3e898560AB5BB966A3`](https://etherscan.io/address/0xF3318007c41539b691b49D3e898560AB5BB966A3)). Auction proceeds (USDS) return to the strategy and are re-staked.
3. **Withdraw:** `_freeFunds()` calls `STAKING.withdraw(amount)` — atomic, 1:1 in USDS.

**Risk profile:** principal is staked USDS, withdrawable 1:1. The farm's `withdraw()` has no `notPaused` modifier (only `stake()` does), and `recoverERC20()` reverts for the staking token, so neither a pause nor the farm owner can block or seize staked USDS. GROVE price and auction clearing affect yield only. The strategy is new: first debt on September 21, 2026.

**Strategy parameters:**
- Activated: 2026-09-21 (TokenizedStrategy v3.1.0)
- Last reported: 2026-09-28 (`last_report = 1790565059`)
- Staked balance at snapshot: 10,155,032.07 USDS (yvUSDS-1 holds 100% of strategy shares; `totalAssets() == current_debt`)
- Health check: `doHealthCheck() = true`, `lossLimitRatio() = 0`, `profitLimitRatio() = 10000`
- Performance fee: 0 (strategy level); `management()` and `emergencyAdmin()` = Brain (3-of-8); no pending management transfer
- Keeper: yHaaSRelayer ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E))
- Farm share: 10.16M of ~180.8M USDS staked (~5.6%)

### Strategy 2: Spark USDS Compounder (3.47% allocation)

**Contract:** [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)

Stakes USDS into the Sky USDS → SPK farm ([`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af)) and converts SPK ([`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066)) back to USDS. Same farm contract design as the GROVE farm: unpausable `withdraw()`, staking token excluded from `recoverERC20()`. Activated 2025-07-14; last reported 2026-09-26 (`last_report = 1790392859`). The strategy has other depositors: yvUSDS-1 holds ~43.2% of its shares (307,630.65 of 711,734.86), and the strategy holds ~847,160 USDS staked in total. `management()` = Brain.

### Queued (zero current debt): sUSDS Lender

**Contract:** [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)

Deposits USDS into the Sky Savings vault sUSDS ([`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD)) earning the Sky Savings Rate. `current_debt = 0` (drained August 22, 2026); **not shut down** (`isShutdown() = false`), so Brain can re-fund it. Activated 2025-05-14; last reported 2026-08-22 (`last_report = 1787379419`). Holds ~57.43 sUSDS of residual dust.

### Queued (zero current debt): USDS Sky Rewards Compounder

**Contract:** [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81)

Stakes USDS into the Sky **USDS → SKY** farm ([`0x0650CAF159C5A49f711e8169D4336ECB9b950275`](https://etherscan.io/address/0x0650CAF159C5A49f711e8169D4336ECB9b950275); `staking()` getter), earning SKY ([`0x56072C95FAA701256059aa122697B133aDEd9279`](https://etherscan.io/address/0x56072C95FAA701256059aa122697B133aDEd9279)). That farm's reward period ended January 26, 2026 (`periodFinish`), which is consistent with the strategy being unfunded since February. `current_debt = 0` (with ~833 USDS of unreported dust in `totalAssets()`); activated 2025-05-16; last reported 2026-02-05.

### Removed from default queue (at the April 27 → May 5 reshape; still absent at September 28)

- **Aave V3 Lido USDS Lender** ([`0xC08d81aba10f2dcBA50F9A3Efbc0988439223978`](https://etherscan.io/address/0xC08d81aba10f2dcBA50F9A3Efbc0988439223978))
- **Aave V3 USDS Lender** ([`0xD144eAFf17b0308a5154444907781382398AaC61`](https://etherscan.io/address/0xD144eAFf17b0308a5154444907781382398AaC61))

The rationale for removing both Aave V3 USDS strategies has not been independently verified. Reintroducing either would require a fresh `addStrategy()` proposal at the Strategy Manager TimelockController (7-day delay).

### Accessibility

- **Deposits:** Permissionless — anyone can deposit USDS and receive yvUSDS-1 (ERC-4626 standard). Subject to 100M USDS deposit limit
- **Withdrawals:** ERC-4626 standard. Users redeem yvUSDS-1 for USDS. The vault unwinds through the default queue; both funded strategies unstake USDS atomically from their Sky farms
- **No cooldown or lock period**
- **Fees:** 0% management fee, 10% performance fee (taken via accountant during `process_report`)
- **Profit unlock:** 3 days

### Collateralization

- **100% on-chain USDS backing.** All deposits are USDS, staked in first-party Sky `StakingRewards` contracts
- **Collateral quality:** USDS itself is backed by Sky's over-collateralized loan book and RWA Treasury bill investments (inherited from MakerDAO). Staked USDS is withdrawable 1:1
- **No leverage** — both active strategies are simple stake products, no borrowing
- **Positions are fully redeemable** — `withdraw()` on the farms is not pausable

### Provability

- **yvUSDS-1 exchange rate:** Calculated on-chain via ERC-4626 standard (`convertToAssets()` / `convertToShares()`). Fully programmatic, no admin input
- **Strategy positions:** each compounder's `totalAssets()` is `balanceOfStake() + balanceOfAsset()`, read from the Sky farm on-chain (Grove: 10,155,032.07 USDS staked at snapshot)
- **Reward rates:** set by Sky governance via the farms' `rewardsDistribution`, visible on-chain (`rewardRate()`: 38.84 GROVE/s, 36.07 SPK/s at snapshot)
- **Profit / loss reporting:** Profits are reported by keepers via `process_report()` and locked for gradual distribution over 3 days (`profitMaxUnlockTime = 3 days`). Losses are immediately reflected in PPS

## Liquidity Risk

- **Primary exit:** Redeem yvUSDS-1 for USDS via ERC-4626 `withdraw()` / `redeem()`. This triggers the funded strategies' `withdraw()`, which unstakes USDS from the Sky farms atomically in the same transaction
- **Deep underlying:** the GROVE farm holds ~180.8M USDS staked (yvUSDS-1's Grove position is ~5.6%); the SPK farm holds ~556.3M USDS. Unstaking returns the vault's own USDS and does not depend on other stakers' liquidity
- **No DEX liquidity needed** — the exit is via Sky's own contracts (unstake), not DEX AMMs
- **Same-value asset:** USDS-denominated vault token — no price-divergence risk from the underlying
- **No withdrawal queue or cooldown** — atomic redemption
- **Pause does not block exits:** the farms' `paused` flag only gates `stake()`; `withdraw()` stays callable. A pause would stop new deposits into the strategies (Grove's `availableDepositLimit()` returns 0 while paused), not redemptions
- **Deposit limit:** 100M USDS cap — generous relative to current TVL of 10.52M USDS

**Note on cascading withdrawals and holder concentration:** 73.72% of TVL is held by two Yearn depositor strategies — yvUSDC-1's `USDC to USDS Depositor` ([`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52), 5,547,017.21 USDS, 52.73%; ~28.3% of yvUSDC-1 TVL) and yvDAI-1's `DAI to USDS Depositor` ([`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d), 2,207,991.38 USDS, 20.99%; ~30.0% of yvDAI-1 TVL). A Brain debt rebalance in either parent vault can move most of this TVL in one transaction. Each layer settles atomically.

## Centralization & Control Risks

### Governance

The yvUSDS-1 vault uses the **standard Yearn V3 governance pattern** via the Yearn V3 Role Manager contract — identical configuration to the other five risk-1 vaults.

**Governance hierarchy** (vault `roles(address)` bitmasks at block 26077066):

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles (all except `ADD_STRATEGY_MANAGER` and `ACCOUNTANT_MANAGER`) |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT |

**ySafe 6-of-9 multisig signers** include publicly known contributors: Mariano Conti (ex-MakerDAO), Leo Cheng (C.R.E.A.M.), 0xngmi (DeFiLlama), Michael Egorov (Curve), and others ([source](https://docs.yearn.fi/developers/security/multisig)).

**Governance assessment:**

1. **No EOA role concentration** — all sensitive roles are held by multisigs, the timelock, or automated bots
2. **Strategy additions and accountant changes pass through a 7-day timelock** (`getMinDelay() = 604800`). The Grove Compounder addition followed this path (scheduled September 14, executed September 21)
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself; reducing the delay also requires 7 days. DEFAULT_ADMIN was never granted (`admin = address(0)`)
4. **Standard Yearn governance** — same pattern shared across 37+ vaults
5. **Immutable vault** — no proxy upgrade path
6. **Debt moves are not timelocked** — Brain (DEBT) can move the full TVL between already-added strategies in one transaction, as it did on September 21–22. MAX_DEBT is held by Daddy, Security and the timelock, not Brain; all four strategies have `max_debt = 100M USDS`

### Programmability

- **Exchange rate (PPS):** Calculated on-chain algorithmically via ERC-4626. Fully programmatic, no admin input
- **Vault operations:** Deposit / withdraw are permissionless on-chain transactions
- **Strategy profit / loss:** Reported programmatically by keepers via `process_report()`. Profits unlock linearly over 3 days
- **Debt allocation:** Managed by both the Debt Allocator (automated) and Brain multisig (manual)
- **V3 vaults are immutable** — no proxy upgrades, no admin-changeable implementation.
- **Strategies are not upgradeable.** Each strategy delegates its ERC-4626 accounting to a TokenizedStrategy implementation whose address is a compile-time `constant` (`tokenizedStrategyAddress`) in `BaseStrategy`. `BaseStrategy` writes that address to the EIP-1967 implementation slot once at construction "so etherscan picks up the interface"; nothing updates it later, and the EIP-1967 admin slot is `0x0`. Implementations: v3.0.3 [`0x254A93feff3BEeF9cA004E913bB5443754e8aB19`](https://etherscan.io/address/0x254A93feff3BEeF9cA004E913bB5443754e8aB19) (sUSDS Lender, USDS Sky Rewards Compounder), v3.0.4 [`0xD377919FA87120584B21279a491F82D5265A139c`](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c) (Spark Compounder), v3.1.0 [`0x310f5Db015E9d6E542fd41bd4542640790791e76`](https://etherscan.io/address/0x310f5Db015E9d6E542fd41bd4542640790791e76) (Grove Compounder). Strategy `management()` (Brain, 3-of-8) can change parameters such as auction settings, keeper, and health-check limits, and can shut a strategy down, but cannot change strategy logic or redirect staked USDS. No pending management transfers on any strategy.

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Sky USDS → GROVE StakingRewards** | Critical | **96.53% of allocation** via Grove USDS Compounder. ~180.8M USDS staked; deployed June 2026. Owner: Sky `DSPauseProxy` (48-hour GSM delay on `MCD_PAUSE` [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3)) |
| **USDS itself** | Critical | The underlying asset of the vault — failure of USDS would be terminal regardless of strategy mix |
| Sky USDS → SPK StakingRewards | Low | 3.47% via Spark USDS Compounder. ~556.3M USDS staked |
| **GROVE token / Yearn auction** | Yield only | Reward token sold for USDS through a Dutch auction with a 0.006 USDS minimum price. Affects yield, not principal |
| Sky Savings Rate (sUSDS) | Standby | sUSDS Lender is in the queue with 0 debt (drained Aug 22, not shut down) |

**Dependency quality:** all funded dependencies are first-party Sky contracts plus the underlying USDS token. Sky has 8+ years of history (inheriting MakerDAO's track record), ~4.47B USDS in sUSDS, and a $10M bug bounty. At this snapshot ~96.5% of capital sits in one farm contract that is ~3 months old. Principal risk in that farm is limited to the `StakingRewards` code and USDS itself: `withdraw()` cannot be paused, and the owner cannot recover the staking token. Sky governance changes are subject to the 48-hour GSM delay.

## Operational Risk

- **Team:** Yearn Finance — established since 2020, publicly known contributors. The ySafe 6-of-9 has 9 named signers including prominent DeFi figures
- **Governance:** Standard Yearn V3 Role Manager — same pattern across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn Finance has converted ychad.eth into a BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540), wrapping it in a Cayman Islands foundation
- **Incident response:** Yearn has demonstrated incident response across 4 historical events (all V1 / legacy). V3 framework has not been tested under stress. The $200K Immunefi bug bounty provides a responsible disclosure channel
- **V3 immutability:** Vault and strategy logic cannot be upgraded — this eliminates upgrade risk but means bugs cannot be patched in place; a critical bug requires shutting down the strategy or deploying a new vault and migrating users
- **Recent allocation activity (September 14 → 28):** Grove USDS Compounder added through the 7-day timelock and funded to 96.53%; Spark Compounder reduced to 3.47%; TVL rose from 7.29M to 10.52M USDS (+44.4%), largely from the yvUSDC-1 `USDC to USDS Depositor` (2.36M → 5.55M USDS)
- **Earlier activity (July 13 → September 14):** sUSDS Lender drained to 0 (final drain August 22, 2026), moving the vault from an ~84/16 sUSDS / Spark split to 100% Spark
- **Prior reshape (April 27 → May 5):** sUSDS Lender debt drained from ~7.4% to 0; two Aave V3 USDS strategies removed from the default queue; vault TVL dropped ~83%. Rationale not independently verifiable on-chain

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains an active monitoring system via the [`monitoring`](https://github.com/yearn/monitoring) repository. **yvUSDS-1 is actively monitored:**

- **Large flow alerts** ([`protocols/yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py)): runs **hourly** ([`automation/jobs.yaml`](https://github.com/yearn/monitoring/blob/main/automation/jobs.yaml)). yvUSDS-1 is in the monitored vault list. Alerts on deposits / withdrawals exceeding threshold via Telegram
- **Timelock monitoring** ([`protocols/timelock/timelock_alerts.py`](https://github.com/yearn/monitoring/blob/main/protocols/timelock/timelock_alerts.py)): runs hourly and alerts on operations scheduled at the Yearn TimelockController (Strategy Manager) — this is the channel that surfaces new `addStrategy()` proposals such as the Grove Compounder
- **Timelock delay check** ([`protocols/yearn/check_timelock_delay.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/check_timelock_delay.py)): runs daily, alerts if `getMinDelay()` drops below 7 days on any chain

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDS-1 Vault | [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| Grove USDS Compounder (96.53%) | [`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622) | `totalAssets()` vs `current_debt`, `isShutdown()`, `lastReport()` frequency, `claimableRewards()` |
| Grove auction | [`0xF3318007c41539b691b49D3e898560AB5BB966A3`](https://etherscan.io/address/0xF3318007c41539b691b49D3e898560AB5BB966A3) | Kicks / settlements; `minimumPrice()` changes |
| Spark USDS Compounder (3.47%) | [`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3) | `current_debt`, `isShutdown()`, keeper report frequency |
| sUSDS Lender (queued, 0 debt) | [`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1) | `current_debt` re-funding event, `isShutdown()` |
| USDS Sky Rewards Compounder (queued, 0 debt) | [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | `current_debt` re-funding event, `isShutdown()` |
| Sky USDS → GROVE farm | [`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a) | `rewardRate()`, `periodFinish()`, `totalSupply()`, `paused()` |
| Sky USDS → SPK farm | [`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af) | `rewardRate()`, `periodFinish()`, `paused()` |
| Upstream depositors | [`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52), [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | yvUSDS-1 `balanceOf()` — share of TVL |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes, submitted transactions |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | `CallScheduled` targeting the vault; `getMinDelay()` |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes, config updates |

### Critical Events to Monitor

- **PPS decrease** — any decrease in `convertToAssets(1e18)` indicates a loss event. Should only increase
- **Timelock proposals** — any `CallScheduled` at the Strategy Manager targeting the vault (new strategies, accountant changes); review during the 7-day window
- **Debt allocation changes** — `DebtUpdated` events, especially moves that put >50% of TVL into a strategy with <30 days of history, or re-funding of the sUSDS Lender / USDS Sky Rewards Compounder
- **Upstream concentration** — combined `balanceOf()` of the two Yearn depositor strategies above 80% of `totalSupply()`, or a single-block change of more than 25% of TVL
- **Emergency actions** — `Shutdown` event on vault; `StrategyShutdown` event or `emergencyWithdraw()` call on any funded strategy
- **ySafe / Brain / Security signer or threshold changes** — governance integrity
- **Farm reward changes** — GROVE `rewardRate()` or `periodFinish()` lapsing without renewal (would zero the Grove Compounder's yield)
- **Sky StakingRewards owner actions** — `setPaused`, `setRewardsDistribution`, `setRewardsDuration` on the GROVE or SPK farm (visible 48 hours ahead via the Sky GSM)

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `balanceOf(depositor)` | Vault | Upstream Yearn vault share of TVL | Daily |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | Strategy Manager (Timelock) | Delay change detection | Daily |
| `rewardRate()` / `periodFinish()` | GROVE farm, SPK farm | Reward program status | Weekly |
| `ssr()` | sUSDS | Savings rate | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** V3 framework audited by ChainSecurity, yAcademy, Statemind and (v3.1.0) yAudit. No V3 exploits in ~28 months of production. Vault and strategy logic are immutable
- **Top-tier underlying:** 100% in first-party Sky `StakingRewards` farms with a $10M Sky Immunefi bounty; staked USDS is withdrawable 1:1, and withdrawals cannot be paused
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named, prominent DeFi signers). No EOA role concentration on vault roles. Strategy additions go through a 7-day self-governed timelock, which the Grove addition followed
- **Simple, low-complexity strategies:** direct USDS → Sky farm stakes — no principal conversions, no leverage, no cross-chain
- **Established track record:** ~23.7 months in production, ~11.15% cumulative return, zero incidents at the vault or strategy level
- **Atomic unwind:** ~10.52M USDS unwinds in a single `withdraw()` call against Sky farms holding ~737M USDS combined
- **Active monitoring:** yvUSDS-1 is in Yearn's hourly large-flow monitoring, and timelock proposals are alerted hourly

### Key Risks

- **New strategy holds 96.5% of TVL:** the Grove USDS Compounder has ~1 week of production history in this vault, runs on the new TokenizedStrategy v3.1.0 (deployed June 2026), and stakes into a ~3-month-old Sky farm. No audit artifact for the `GroveCompounder` contract itself was located (TODO)
- **Single-contract concentration:** ~96.5% of deployed capital sits in one Sky farm contract. Principal exposure is limited to the `StakingRewards` code and USDS (withdraw is unpausable, staking token not recoverable by owner), but a bug in that contract would affect nearly the entire vault
- **Single-ecosystem coupling (Sky):** all funded venues sit inside the Sky governance umbrella. A Sky-level incident (e.g., USDS depeg, governance attack) would affect the vault directly
- **Reward-token yield:** vault yield now depends mainly on GROVE emissions and auction clearing, not the Sky Savings Rate. This affects yield, not principal
- **Upstream concentration:** 73.72% of TVL belongs to yvUSDC-1 and yvDAI-1 depositor strategies; Brain rebalances in those vaults can move most of the TVL in one transaction
- **Queue trimmed:** Aave V3 Lido USDS Lender and Aave V3 USDS Lender remain absent from the default queue (removed in the prior reshape). Rationale not independently verifiable on-chain

### Critical Risks

- None identified. The dominant systemic risk is a USDS depeg or a bug in Sky's `StakingRewards` contract, which would impair this vault and any other Sky-dependent vault simultaneously — a system-wide DeFi event rather than a Yearn-specific risk.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 4 firms. Sky / sUSDS / Endgame Toolkit audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 standard. All positions on-chain verifiable. Sky farms are transparent. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: ChainSecurity, yAcademy, Statemind; v3.1.0 by yAudit. Sky / sUSDS / StakingRewards: 7+ auditors. `GroveCompounder` strategy audit: TODO |
| Bug bounty | $200K on Immunefi (Yearn); $10M on Immunefi (Sky) |
| Production history | **~23.7 months** (October 8, 2024). V3 framework: ~28 months. Grove Compounder: ~1 week |
| TVL | 10,519,606.58 USDS at snapshot (up ~68.9% from 6.23M July 13; still down ~70% from 35.24M April 27 peak). Deposit limit: 100M |
| Security incidents | None on V3, none on USDS / sUSDS / USDS StakingRewards |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — Strong audit coverage on both layers (vault + Sky). ~23.7 months of clean vault production. The new Grove Compounder has little history, but it is a thin `BaseStrategy` wrapper on audited TokenizedStrategy v3.1.0 around the same Sky `StakingRewards` pattern the Spark Compounder has used since July 2025; this keeps the score at 1.5 rather than 1.0.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable**. Strategies are **not upgradeable** (TokenizedStrategy address is a compile-time constant) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | Strategy additions and accountant changes through **7-day TimelockController** |
| Privileged roles | Well-distributed: Daddy (6/9, 12 roles), Brain (3/8, operational), Security (4/7), Keeper + Debt Allocator (bots) |
| EOA risk | None — no EOA holds direct vault roles |

**Governance Score: 1.0 / 5** — Immutable vault and strategies + 7-day self-governed timelock + 6/9 named signers + no EOA roles on vault = textbook score-1 governance per the rubric.

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
| Funded venues | **2** — Sky USDS → GROVE farm (96.53%) and Sky USDS → SPK farm (3.47%) |
| Queued, 0-debt strategies | sUSDS Lender (Sky Savings vault); USDS Sky Rewards Compounder (Sky USDS → SKY farm, rewards ended) |
| Criticality | Sky GROVE farm critical (96.53%); plus dependency on the underlying USDS token itself |
| Concentration | ~96.5% in a single, ~3-month-old Sky farm contract |
| Quality | Top-tier ecosystem — Sky has $10M bounty, 8+ years of MakerDAO heritage; farms use the audited Endgame Toolkit `StakingRewards` with unpausable withdrawals |

**Dependencies Score: 2.5 / 5** — the vault depends on a single blue-chip ecosystem (Sky) plus the underlying USDS token; per the rubric, one blue-chip dependency maps to 2.0. The +0.5 reflects ~96.5% concentration in one farm contract that is only ~3 months old and a yield source that now depends on GROVE emissions. This is offset in part by the corrected finding that farm pauses cannot block withdrawals, so the score holds at 2.5.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5** — Immutable vault and strategies with named-signer multisig and 7-day timelock. Fully programmatic. Single-ecosystem (Sky) coupling and single-farm concentration are the dominant subcategory drivers.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDS-backed, staked in first-party Sky `StakingRewards` contracts |
| Collateral quality | USDS backed by Sky's over-collateralized loan book + RWA Treasury bills (inherited from MakerDAO); staked USDS withdrawable 1:1 |
| Leverage | None |
| Verifiability | ERC-4626, all positions on-chain |

**Collateralization Score: 1.0 / 5** — 100% on-chain USDS backing deployed to top-tier Sky-ecosystem contracts. No leverage. Fully verifiable.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain — anyone can verify yvUSDS-1 → Grove / Spark Compounder → Sky farm positions |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers with 3-day profit unlock |
| Third-party verification | Farm staked balances / reward rates all on-chain, verifiable independently |

**Provability Score: 1.0 / 5** — Excellent transparency. ERC-4626 provides fully on-chain real-time verification.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5** — Outstanding on-chain provability. Top-tier collateral quality. No leverage. Simple stake pipelines.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Unstake from Sky farms — atomic, 1:1, not pausable |
| Liquidity depth | Unstaking returns the strategy's own USDS; GROVE farm ~180.8M staked (vault ~5.6%), SPK farm ~556.3M |
| Large holder impact | 73.72% of TVL held by yvUSDC-1 and yvDAI-1 depositor strategies; exits settle atomically |
| Same-value asset | USDS-denominated — no price-divergence risk |
| Withdrawal restrictions | None — atomic redemption, no cooldown |

**Score: 1.5 / 5** — Highly liquid; atomic 1:1 unstake with no queue or cooldown, and farm pauses do not block withdrawals. Held at 1.5 rather than 1.0 because of the multi-layer cascading withdrawals from yvUSDC-1 / yvDAI-1, which hold ~74% of TVL.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn: well-known team, public contributors, established since 2020. Named multisig signers |
| Vault management | Standard Yearn governance (ySafe 6-of-9). Same pattern across 37+ vaults |
| Documentation | V3 docs comprehensive. Strategy code verified on Etherscan |
| Legal | Yearn BORG (Cayman foundation via YIP-87) |
| Incident response | Demonstrated capability across 4 historical V1 events. $200K Immunefi bounty |
| Monitoring | Hourly large-flow and timelock alerts; vault is in monitoring list |

**Score: 1.0 / 5** — Top-tier operational maturity.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.32 / 5.0** |

**Change from prior snapshot (July 13 = 1.32):** capital moved from an ~84/16 sUSDS / Spark split to 96.53% Grove Compounder / 3.47% Spark Compounder, all in Sky `StakingRewards` farms. No category score changes. Two new risks: a new strategy holding almost all TVL (Cat 1, Cat 2C) and yield now coming from GROVE emissions. Two corrections offset them: strategies are not upgradeable (Cat 2A), and farm pauses cannot block withdrawals (Cat 2C, Cat 4). Final score remains **1.32**.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | **Approved, high confidence** |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.32 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (March 2027) or annually
- **TVL-based:** Reassess if TVL exceeds 50M USDS or changes by more than ±50% from the September 28 snapshot of 10.52M
- **Allocation / diversification:**
  - if a non-Sky venue is funded, or any strategy other than a Sky farm compounder takes more than 10% of debt
  - if the Grove Compounder reports a loss, is shut down, or its debt is re-routed with no funded replacement
  - if the GROVE farm reward period lapses without renewal while the Grove Compounder holds most of the debt
- **Strategy changes (`addStrategy()` proposals at the Strategy Manager TimelockController, [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73), 7-day delay):**
  - any new strategy proposed for inclusion — re-review during the 7-day timelock window
  - any new strategy with leverage, looping, cross-chain bridging, or non-blue-chip routing
  - re-introduction of either removed Aave V3 USDS strategy
- **Vault-of-vaults composition:** reassess if another Yearn V3 vault begins routing into yvUSDS-1, or if upstream depositor strategies exceed 80% of TVL
- **Sky-specific:**
  - `StakingRewards` owner actions on the GROVE or SPK farm, or migration of either farm
  - any change to the USDS contract (upgrade, governance vote)
- **Incident-based:** any V3 exploit, strategy loss, governance change, or Sky / MakerDAO incident
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

Snapshot at on-chain query (September 28, 2026, block 26077066). Full addresses are in [Contract Addresses](#contract-addresses).

```
┌──────────────────────────────────────────────────────────────────────┐
│                          UPSTREAM DEPOSITORS                          │
│  yvUSDC-1 → USDC to USDS Depositor  — 5.55M USDS (52.73% of TVL)      │
│  yvDAI-1  → DAI to USDS Depositor   — 2.21M USDS (20.99% of TVL)      │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER                                  │
│  yvUSDS-1 (v3.0.3, immutable)  TVL 10,519,606.58 USDS, 0 idle         │
│   ├── 10,155,032.07 → Grove USDS Compounder (96.53%, v3.1.0)          │
│   └──    364,574.52 → Spark USDS Compounder (3.47%, v3.0.4)           │
│                                                                       │
│  Queued, 0 debt: sUSDS Lender; USDS Sky Rewards Compounder            │
│  Removed (Apr 27 → May 5): Aave V3 Lido USDS / Aave V3 USDS Lenders   │
└──────────────────────────────────┬───────────────────────────────────┘
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          UNDERLYING (Sky StakingRewards)              │
│  USDS → GROVE farm  ~180.8M staked   GROVE → USDS via Yearn auction   │
│  USDS → SPK farm    ~556.3M staked   SPK → USDS                       │
│  Owner: Sky DSPauseProxy (48h GSM); withdraw() not pausable           │
│                  $10M Immunefi bug bounty (Sky)                       │
└──────────────────────────────────────────────────────────────────────┘
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

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [May 11, 2026](https://github.com/yearn/risk-score/pull/148) | 1.3 | Initial assessment |
| [July 13, 2026](https://github.com/yearn/risk-score/pull/314) | 1.32 | Reassessment: TVL $6.23M (down 9.7% since May 11); allocations drifted to 84/16 sUSDS/Spark; all governance roles, multisig thresholds, and timelock parameters confirmed unchanged; sUSDS TVL drifted to ~$5.28B; USDS Staking Rewards ~$556M staked. No score or tier change |
| [September 28, 2026](https://github.com/yearn/risk-score/pull/470) | 1.32 | Reassessment: new Grove USDS Compounder added via 7-day timelock (Sep 21) and funded to 96.53%; Spark Compounder 3.47%; sUSDS Lender drained Aug 22; TVL $10.52M (+68.9%); 73.72% of TVL from yvUSDC-1 / yvDAI-1 depositors. Corrected: strategies are not upgradeable (TokenizedStrategy address is a constant); farm pauses cannot block withdrawals; USDS Sky Rewards Compounder targets the SKY farm, not the SPK farm; Brain role list. Governance thresholds and 7-day timelock unchanged. No score or tier change |
