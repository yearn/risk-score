# Protocol Risk Assessment: Yearn — yvUSDT-1

- **Assessment Date:** May 11, 2026 (Updated: July 13, 2026)
- **Token:** yvUSDT-1 (USDT-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa)
- **Final Score: 1.3/5.0**

## Overview + Links

yvUSDT-1 is a **USDT-denominated Yearn V3 vault** (ERC-4626) on Ethereum mainnet. The vault holds **~$7.23M USDT** and is **100% deployed** at the snapshot — `totalIdle = 0`, `totalDebt = totalAssets`. The queue holds **two strategies** — a **Yearn-deployed MetaMorpho vault (ymv-USDT)** and a **Spark USDT Lender**. All five previously-queued strategies — Spark USDT Lender, Morpho Gauntlet USDT Prime, Morpho Steakhouse USDT, USDT Fluid Lender, and Aave V3 USDT Lender — are now revoked (`activation = 0`).

Since the May 2026 assessment, the strategy queue was fully replaced: the prior Spark USDT Lender and Morpho Gauntlet/Steakhouse strategies were revoked, and two new strategies were added — the MetaMorpho vault (activated May 10, 2026) and a new Spark USDT Lender instance (activated June 29, 2026). The Morpho exposure is now through a **Yearn-operated MetaMorpho vault** (governed by Yearn Security with a 3-day timelock and a 2-of-3 curator multisig) rather than through third-party curated Morpho vaults (Gauntlet, Steakhouse).

The PPS is **1.086177** (~8.62% cumulative since deployment, ~4.4% annualized over ~23.6 months).

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDT deposits, issuing yvUSDT-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Strategy queue (2 strategies, both USDT-native):**
  - MetaMorpho Vault (ymv-USDT) ([`0x0963232eB842BAF53E8e517691f81745C1F228a0`](https://etherscan.io/address/0x0963232eB842BAF53E8e517691f81745C1F228a0)) — 43.94% of debt, Morpho MetaMorpho vault
  - Spark USDT Lender ([`0x176Caf15f1793fc16898458E0ba295ec6523E9E2`](https://etherscan.io/address/0x176Caf15f1793fc16898458E0ba295ec6523E9E2)) — 56.06% of debt, Spark Lend
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (July 13, 2026, snapshot at block 25521239):**

- **TVL:** 7,229,374.54 USDT (100% deployed)
- **Total Supply:** 6,655,795.03 yvUSDT-1
- **Price Per Share:** 1.086177 USDT/yvUSDT-1 (~8.62% cumulative appreciation over ~23.6 months, ~4.4% annualized)
- **Total Debt:** 7,228,870.58 USDT (~99.99% of TVL; ~$503 unallocated due to floating P&L / pending profit unlock)
- **Total Idle:** 0
- **Debt distribution:**
  - MetaMorpho Vault (ymv-USDT): 3,176,868.08 USDT (43.94%)
  - Spark USDT Lender: 4,052,002.50 USDT (56.06%)
- **Deposit Limit:** 50,000,000 USDT
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee (unchanged)

**Sky exposure note:** Spark Lend is a **Sky sub-DAO** (governed by Sky), so the ~56% allocation to Spark USDT Lender carries a **Sky-governance dependency** on the Spark admin keys, even though USDT itself has no USDS / Sky peg dependency. This is materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1 (which have direct USDS exposure), but yvUSDT-1 is **not fully Sky-independent**. The Sky-governance share has increased from ~46% to ~56% since the May 2026 strategy replacement.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [hgETH reassessment (rsETH bridge exploit context)](./kerneldao-hgeth.md)

## Contract Addresses

### Core yvUSDT-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvUSDT-1 Vault | [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa) | Yearn V3 Vault (v3.0.2), Vyper minimal proxy |
| Underlying asset (USDT) | [`0xdAC17F958D2ee523a2206206994597C13D831ec7`](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) | Tether USD |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Shared Yearn Accountant (0% mgmt, 10% perf) |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |

### Governance Contracts (shared with all Yearn V3 risk-1 vaults)

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Single instance for all category-1 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) |
| Vault Original (v3.0.2) | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) |

### Strategies (2 in default queue, both with debt)

| # | Strategy | Name | Current Debt (USDT) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x0963232eB842BAF53E8e517691f81745C1F228a0`](https://etherscan.io/address/0x0963232eB842BAF53E8e517691f81745C1F228a0) | MetaMorpho Vault (ymv-USDT) | 3,176,868.08 | 43.94% |
| 2 | [`0x176Caf15f1793fc16898458E0ba295ec6523E9E2`](https://etherscan.io/address/0x176Caf15f1793fc16898458E0ba295ec6523E9E2) | Spark USDT Lender | 4,052,002.50 | 56.06% |

**Previously queued, now revoked (`activation = 0` at block 25521239):**

- Spark USDT Lender (old) ([`0xED48069a2b9982B4eec646CBfA7b81d181f9400B`](https://etherscan.io/address/0xED48069a2b9982B4eec646CBfA7b81d181f9400B))
- Morpho Gauntlet USDT Prime Compounder ([`0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F`](https://etherscan.io/address/0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F))
- Morpho Steakhouse USDT Compounder ([`0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5`](https://etherscan.io/address/0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5))
- USDT Fluid Lender ([`0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72`](https://etherscan.io/address/0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72))
- Aave V3 USDT Lender ([`0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2`](https://etherscan.io/address/0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2))

**Sky-governance exposure note:** Spark Lend is a Sky sub-DAO. Roughly 56% of yvUSDT-1's debt sits in Spark USDT Lender, which is administered through Sky / Spark governance. This is a **Sky-governance dependency** but not a USDS-peg or USDS-collateral dependency — yvUSDT-1 is materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1, but **not fully Sky-independent**.

### Strategy Protocol Dependencies (current allocation)

| Protocol | Strategy | Allocation | Notes |
|----------|----------|-----------:|-------|
| **Morpho** | MetaMorpho Vault (ymv-USDT) | 43.94% | Yearn-operated MetaMorpho vault; governed by Yearn Security (4-of-7) with 3-day timelock; curator is a 2-of-3 Safe overlapping Brain/Security signers; guardian is Daddy (6-of-9) |
| **Spark** | Spark USDT Lender | 56.06% | Sky sub-DAO; audited stack (ChainSecurity, Cantina); new strategy instance activated June 29, 2026 |

The current debt is **split ~44/56 across two ecosystems** (Morpho, Spark). Both have multi-year USDT track records with no significant principal-loss events. The mix is two-venue concentrated — ~56% allocation to a single Sky-governed venue is higher than the ~46% in the May 2026 snapshot and warrants continued monitoring. The Morpho leg is now through a Yearn-operated MetaMorpho vault rather than a third-party curator.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Underlying Protocol Audits (active and queued strategies)

| Underlying | Audits | Notes |
|------------|--------|-------|
| **Morpho** | 25+ audits across Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora; formal verification | Blue-chip, $6.6B+ TVL; MetaMorpho vault source verified on Etherscan |
| **Spark (USDT lender)** | ChainSecurity, Cantina (Spark Lend / SparkDAO) | Sub-DAO of Sky; new SparkLender strategy source verified on Etherscan |

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvUSDT-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Morpho (Cantina):** active, **$2,500,000** max payout (Critical). https://cantina.xyz/bounties/35a5f0a1-2ffd-432c-8f3b-77d169add8c3
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

**Low.** All funded strategies are **direct USDT lend / compound** with no conversion hops:

- MetaMorpho Vault → direct USDT deposit to a Yearn-operated Morpho MetaMorpho vault
- Spark USDT Lender → direct supply to Spark Lend USDT market
- No leverage, no looping, no cross-chain
- Standard ERC-4626 throughout
- Vault is immutable

## Historical Track Record

- **Vault deployed:** July 23, 2024 (deployment [tx](https://etherscan.io/tx/0x05681fd5be0e925bb720450418d20eda99bb22adc72be3d702de70368d7cd3ea)) — **~23.6 months** in production
- **TVL:** 7,229,374.54 USDT (~$7.23M) — well within the $50M deposit limit
- **PPS trend:** 1.000000 → 1.086177 (~8.62% cumulative return, ~4.4% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy history:** seven strategies have been queued historically. Five have been revoked. Between May and July 2026, all three strategies active in the May report (Spark USDT Lender, Morpho Gauntlet USDT Prime, Morpho Steakhouse USDT) were revoked and replaced by two new strategies: a Yearn-operated MetaMorpho vault (ymv-USDT, activated May 10, 2026) and a new Spark USDT Lender instance (activated June 29, 2026)
- **Yearn V3 track record:** V3 framework live since May 2024 (~26 months). No V3 vault exploits

**Yearn protocol TVL:** ~$147M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), July 2026).

**Underlying USDT lending market track records:** Spark Lend and Morpho both have multi-year track records on USDT markets with no significant principal-loss events.

## Funds Management

yvUSDT-1 is **100% deployed** at the snapshot, split ~44/56 between a Yearn-operated MetaMorpho vault (ymv-USDT) and a Spark USDT Lender.

### Current State (snapshot)

- **Total Assets:** 7,229,374.54 USDT
- **Total Debt:** 7,228,870.58 USDT (~99.99% deployed; ~$503 floating P&L)
- **Total Idle:** 0
- **Capital utilization:** ~99.99%

ERC-4626 redemptions settle by unwinding strategy positions in queue order — atomic from the user's perspective as long as the underlying lending markets have available liquidity (Spark Lend and Morpho USDT markets are both deep multi-million-USDT venues).

### Active Strategies

| Strategy | Allocation | Mechanic | Risk profile |
|----------|-----------:|----------|-------------|
| **MetaMorpho Vault (ymv-USDT)** | 43.94% | USDT deposit to Yearn-operated MetaMorpho vault on Morpho | Governed by Yearn Security (4-of-7), 3-day timelock, 2-of-3 curator Safe |
| **Spark USDT Lender** | 56.06% | Direct supply to Spark Lend USDT market | Sky sub-DAO, ChainSecurity / Cantina audits; new instance June 2026 |

Both strategies are simple lend / compound patterns with no leverage, no conversion hops, and no cross-chain. The MetaMorpho vault introduces an additional governance layer (owner, curator, guardian, timelock) that is absent from the prior third-party curated Morpho vaults.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 50M USDT deposit limit
- **Withdrawals:** ERC-4626. Strategy unwind through Spark + Morpho USDT markets (both deep)
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **~99.99% USDT backing** — held through MetaMorpho vault on Morpho and Spark Lend USDT market positions
- **Collateral quality:** USDT is the largest stablecoin by market cap. Centrally-issued by Tether
- **No leverage**
- **Redemption:** atomic for normal sizes; very large redemptions depend on MetaMorpho vault liquidity and Spark market utilization at the moment of withdrawal

The collateral quality is the union of the Yearn-operated MetaMorpho vault and Spark Lend USDT market quality — both are blue-chip USDT venues with multi-year clean track records.

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads the underlying lending position balance on-chain in both Spark and Morpho
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 10 days

## Liquidity Risk

**Exit pipeline:** ERC-4626 `withdraw` → strategy `withdraw` → underlying lending market withdrawal (MetaMorpho vault on Morpho or Spark Lend USDT market).

- **Underlying liquidity:** Spark Lend USDT and Morpho MetaMorpho vault are both multi-million-dollar venues with healthy utilization headroom; ~$4.1M (Spark) and ~$3.2M (Morpho) here are small fractions of either venue's free liquidity
- **Same-asset:** USDT-denominated share token — no price-divergence risk
- **No DEX liquidity needed** — exits via the lending protocol's own redemption mechanics
- **No withdrawal queue or cooldown** — atomic redemption for normal sizes (MetaMorpho vault has a 3-day timelock on parameter changes but redemptions are atomic)
- **Deposit limit:** 50M USDT cap vs $7.23M TVL (room for +591%)

The two-ecosystem split (~44% Morpho / ~56% Spark) means a liquidity squeeze in one venue can be partially absorbed by the other (subject to queue order and the user's withdraw size).

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

**Properties:**

1. **No EOA holds vault roles directly**
2. **Strategy additions and accountant changes pass through 7-day timelock**
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself
4. **Vault contract is immutable** — Vyper minimal proxy
5. **Same governance pattern across 37+ vaults**

### Programmability

- **PPS:** ERC-4626, fully algorithmic
- **Vault operations:** permissionless deposit / withdraw on-chain
- **Strategy reporting:** automated via keeper (when strategies are funded)
- **Debt allocation:** Debt Allocator (automated) + Brain (manual) — currently 0 deployed
- **Off-chain inputs:** none

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **USDT (Tether)** | Critical (underlying asset) | Centrally issued; relies on Tether's operational and reserve integrity |
| **Spark Lend** | High (~56% of debt) | Sky sub-DAO; Spark admin keys live under Sky governance |
| **Morpho** | High (~44% of debt) | Morpho protocol $6.6B+ TVL; MetaMorpho vault governed by Yearn Security with 3-day timelock + 2-of-3 curator Safe |
| **Sky governance** | Indirect via Spark | Spark Lend admin sits under Sky; not an independent venue |
| **MetaMorpho curator** | Indirect, internal | 2-of-3 Safe with overlapping Brain/Security signers; can adjust vault parameters within timelock constraints |

**Dependency quality:** the deployed mix is **two blue-chip ecosystems split ~44/56** (Morpho + Spark). ~56% of debt sits behind Sky-governed infrastructure — an increase from ~46% in the May 2026 snapshot. Materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1 (which carry direct USDS exposure) but **not fully Sky-independent**. The Morpho leg is now through a Yearn-operated MetaMorpho vault rather than third-party curated vaults, which internalizes curator risk but adds the vault's own governance surface (owner, curator, guardian, timelock).

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded
- **Operational history:**
  - Late April 2026: 100%-idle posture, precautionary deallocation following the rsETH bridge exploit (per Yearn team, unverified attribution)
  - May 2026: Redeployment into Spark + Morpho Gauntlet (~46/54 split); Fluid and Aave V3 strategies revoked
  - May–July 2026: Full strategy-queue replacement — all three remaining strategies revoked, replaced by a Yearn-operated MetaMorpho vault (activated May 10, 2026) and a new Spark USDT Lender (activated June 29, 2026). Rationale for the full replacement rather than incremental changes has not been independently verified
  - The sequence demonstrates active debt management capability: the operations multisigs can pull, revoke, and redeploy across entirely new strategy sets

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvUSDT-1 is in the monitored vault list:**

- **Large flow alerts** ([`protocols/yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py)) — runs **hourly via the automation scheduler**
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`) — daily
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`)

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDT-1 Vault | [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| Each active USDT strategy | (2 active addresses above) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| MetaMorpho vault (ymv-USDT) | [`0x0963232eB842BAF53E8e517691f81745C1F228a0`](https://etherscan.io/address/0x0963232eB842BAF53E8e517691f81745C1F228a0) | `totalAssets()`, `owner()`, `curator()`, `guardian()`, `timelock()`, `supplyQueue()` market list |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **Allocation drift** — currently ~44/56 Morpho/Spark; a drift toward >75% in one venue should trigger reassessment of the dependency subscore
- **Strategy `current_debt` changes** — `DebtUpdated` events on the vault
- **Strategy additions / removals** — `StrategyChanged` events (new strategies pass through 7-day timelock; further revocations are operational signals)
- **MetaMorpho vault governance changes** — `owner()`, `curator()`, `guardian()`, or timelock changes on the ymv-USDT vault
- **Emergency actions** (`Shutdown`)
- **ySafe / Brain / Security signer or threshold changes**
- **PPS decrease** — should only increase outside of explicit loss events
- **Sky / Spark governance events** — Spark Lend admin actions can affect ~56% of yvUSDT-1's debt
- **USDT-specific:** Tether-side issues (peg deviation, attestation reports, blacklisting events)

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio — currently 100% deployed | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time, activation (revocations show `activation = 0`) | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition (currently 2 strategies) | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | ySafe | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~26 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Two-ecosystem split:** ~44/56 across Morpho and Spark Lend — both blue-chip USDT venues with multi-year clean track records
- **No USDS-peg exposure:** yvUSDT-1 holds USDT, not USDS, so it is not exposed to USDS peg risk that affects yvUSDC-1 / yvUSDS-1 / yvDAI-1
- **Active monitoring** via Yearn's monitoring-scripts repo
- **No leverage. No cross-chain. No conversion hops** in the active strategies
- **Established track record:** ~23.6 months in production, ~8.62% cumulative return, zero incidents

### Key Risks

- **Concentration in two venues only:** ~44% Morpho (MetaMorpho) + ~56% Spark Lender. Less diversified than the prior 5-strategy queue
- **Sky-governance dependency on ~56% of debt:** Spark Lend is a Sky sub-DAO, so Sky governance / Spark admin keys can affect over half of yvUSDT-1's funds. This is an increase from ~46% in the May 2026 snapshot. Less coupled than the USDS-denominated vaults but **not Sky-independent**
- **MetaMorpho governance surface:** the ymv-USDT MetaMorpho vault introduces an additional governance layer — Yearn Security (4-of-7) as owner, a 2-of-3 curator Safe (overlapping Brain/Security signers), Daddy (6-of-9) as guardian, and a 3-day timelock. While internal to Yearn, this adds parameters that can affect ~44% of funds
- **Full strategy-queue replacement:** all five previously-queued strategies were revoked and replaced by two new ones between May and July 2026. The rationale for the full replacement rather than incremental changes has not been independently verified
- **USDT-specific:** centrally-issued stablecoin with periodic concerns about Tether's reserve composition; this risk is inherent to the underlying asset and not specific to yvUSDT-1

### Critical Risks

- None identified. All gates pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is rounded to one decimal place using standard nearest-0.1 rounding; when the value is exactly halfway between two 0.1 marks (X.X50), round UP to the higher (riskier) score per the conservative principle
- **Score reflects July 13 snapshot — 100% deployed across MetaMorpho (Morpho) + Spark (~44/56).**

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Active underlying protocols (Spark, Morpho) extensively audited. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + on-chain Spark/Morpho positions verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Active underlying protocols (Spark, Morpho): blue-chip with extensive audit coverage |
| Bug bounty | $200K (Yearn Immunefi) |
| Production history | **~23.6 months** (July 23, 2024). V3 framework: ~26 months |
| TVL | **$7.23M** USDT (100% deployed). Deposit limit: 50M |
| Security incidents | None on V3, none on the active underlying protocols |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — strong audit coverage, ~23.6 months clean production, no incidents.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** (EIP-1167 minimal proxy) |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | 7-day delay on `ADD_STRATEGY` and `ACCOUNTANT`. Self-governed |
| Privileged roles | Well-distributed; no role concentration |
| EOA risk | None |

**Governance Score: 1.0 / 5** — textbook score-1 governance.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless deposits / withdrawals |
| Strategy reporting | Programmatic via keeper (idle today) |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |

**Programmability Score: 1.0 / 5** — fully programmatic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (active) | 2 funded ecosystems (Morpho via MetaMorpho vault, Spark Lend); no queued strategies |
| Criticality | USDT (Tether) + MetaMorpho/Morpho (~44%) + Spark Lend (~56%, Sky-governed) |
| Concentration | ~56% behind Sky-governed infrastructure (Spark) — meaningful Sky-governance dependency, increased from ~46% in May 2026. The Morpho leg is through a Yearn-operated MetaMorpho vault with its own governance surface |
| Quality | Top-tier on both venues; concentration is the main concern |

**Dependencies Score: 2.5 / 5** — two blue-chip ecosystems (Morpho, Spark Lend), but ~56% of debt sits behind Sky-governance infrastructure (Spark Lend → Sky sub-DAO → Sky governance) and the Morpho leg introduces MetaMorpho governance surface (owner, curator, guardian, timelock). The rubric "1–2 blue-chip dependencies" = 2 captures the count; the +0.5 reflects that the Sky-governance share is a single-point-of-control concentration above what a pure two-blue-chip split would carry. The Morpho leg is governed by Yearn Security + curator Safe + guardian, independent of Sky.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDT (held via MetaMorpho vault on Morpho and Spark Lend USDT positions) |
| Collateral quality | USDT is the largest stablecoin by market cap; centrally issued by Tether |
| Leverage | None |
| Verifiability | Vault and strategy positions fully on-chain |

**Score: 1.0 / 5** — top-tier on-chain backing. USDT centralization is a known characteristic of the underlying asset, not a vault-specific issue.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Vault and strategy USDT positions fully on-chain |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers, 10-day profit unlock |
| Third-party verification | Underlying USDT positions trivially on-chain |

**Score: 1.0 / 5** — excellent on-chain provability.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | ERC-4626 → strategy unwind through MetaMorpho vault and Spark USDT market |
| Liquidity depth | Both venues have multi-million-USDT free liquidity; ~$3.2M (MetaMorpho) and ~$4.1M (Spark) are small relative to either market |
| Large holder impact | Very large redemptions depend on MetaMorpho vault / Spark utilization at withdraw time |
| Same-value asset | USDT-denominated |
| Withdrawal restrictions | None |

**Score: 1.0 / 5** — both active venues are deep blue-chip USDT lending markets with healthy utilization headroom. The ~44/56 split provides cross-venue resilience. Re-evaluate if either venue's utilization spikes or if allocation drifts beyond ~75% to a single venue.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. Demonstrated active debt management — the Brain/Debt Allocator pulled all debt, revoked five strategies across two phases, and redeployed into a new two-strategy configuration (Yearn-operated MetaMorpho vault + new Spark USDT Lender) between April and July 2026 |
| Monitoring | Active hourly alerts, vault in monitored list |

**Score: 1.0 / 5** — top-tier operational maturity. The deallocate / redeploy / full-strategy-replacement sequence demonstrates incident-response and debt-management capability.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.250 → 1.3 / 5.0** |

1.250 rounds to 1.3 under the conservative rule (X.X50 ties break UP). The Centralization score (1.5) reflects the Sky-governance concentration on ~50% of debt; otherwise the vault is a clean two-venue blue-chip stablecoin deployment.

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

- **Time-based:** Reassess in 6 months (January 2027) or annually
- **TVL-based:** Reassess if TVL exceeds $25M or changes by ±50%
- **rsETH-related context:** if any new strategy is added that takes direct or indirect rsETH exposure, full re-review of the dependency subscore
- **Strategy posture:**
  - if a USDS-denominated strategy is later added to yvUSDT-1, the partial Sky-coupling becomes a peg dependency — re-evaluate dependency and concentration scores against the broader risk-1 stable stack
  - if either venue's allocation drifts above ~75% of deployed funds, re-evaluate the dependency / liquidity scores
  - the MetaMorpho vault's governance parameters (owner, curator, guardian, timelock) are new; any change to these should trigger reassessment
  - if any further strategy revocations or replacements occur, investigate the rationale
- **Underlying-protocol incidents:** any major incident at Spark Lend or Morpho USDT markets — full re-review
- **USDT-specific:**
  - sustained Tether peg deviation
  - Tether reserve attestation issues
  - significant blacklisting / freezing events
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvUSDT-1 (v3.0.2)   │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  EIP-1167 min proxy   │                                          │
│  │  0x310B…FAaa          │                                          │
│  │                       │                                          │
│  │  $7.23M USDT TVL      │                                          │
│  │  ~99.99% deployed     │                                          │
│  │  totalDebt = $7.23M   │                                          │
│  │  totalIdle = 0        │                                          │
│  └───────────┬───────────┘                                          │
│              │                                                       │
│      ┌───────┴────────┐                                             │
│      ▼                ▼                                             │
│  MetaMorpho Vault  Spark USDT Lender                                │
│  (ymv-USDT)        4.05M (56.06%)                                   │
│  3.18M (43.94%)    Sky sub-DAO                                      │
│  Morpho protocol                                                     │
│                                                                      │
│  MetaMorpho governance:                                              │
│   - Owner: Yearn Security (4-of-7)                                  │
│   - Curator: 2-of-3 Safe                                            │
│   - Guardian: Daddy (6-of-9)                                        │
│   - Timelock: 3 days                                                │
│                                                                      │
│  All previously-queued strategies revoked (activation = 0):          │
│   - Spark USDT Lender (old, 0xED48…9400B)                           │
│   - Morpho Gauntlet USDT Prime (0x6D29…849F)                        │
│   - Morpho Steakhouse USDT (0x0a4e…45c5)                            │
│   - USDT Fluid Lender (0x4Bd0…8A72)                                 │
│   - Aave V3 USDT Lender (0x2799…8Cb2)                               │
└──────────────────────────────────────────────────────────────────────┘

The vault is now ~44/56 across two ecosystems. ~56% sits behind Sky-governed
infrastructure (Spark Lend), up from ~46% in May 2026. The Morpho leg is through
a Yearn-operated MetaMorpho vault with its own governance surface (owner,
curator, guardian, timelock) rather than a third-party curated vault.
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — same timelock used by 37+ Yearn V3 vaults including all six mainnet risk-1 vaults. `getMinDelay() = 604800` (7 days).

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)`) |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | Sole proposer |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper: Brain (3/8) + deployer EOA can call `execute()` through it |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-8 Safe | Cancel pending proposals |

To shorten the delay, Daddy 6/9 must propose `updateDelay()`, wait 7 days during which Brain or Daddy can cancel, then execute. DEFAULT_ADMIN was never granted, so no party can self-grant PROPOSER or TIMELOCK_ADMIN to skip the flow.

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| May 11, 2026 | 1.3 | Initial assessment; ~46/54 Spark/Morpho Gauntlet split |
| July 13, 2026 | 1.3 | Strategy-queue replacement: MetaMorpho vault + new Spark USDT Lender; ~44/56 split; Sky dependency increased to ~56% |
