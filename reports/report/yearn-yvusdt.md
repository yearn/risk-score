# Protocol Risk Assessment: Yearn — yvUSDT-1

- **Assessment Date:** May 5, 2026
- **Token:** yvUSDT-1 (USDT-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa)
- **Final Score: 1.3/5.0**

## Overview + Links

yvUSDT-1 is a **USDT-denominated Yearn V3 vault** (ERC-4626) on Ethereum mainnet. The vault holds **~$7.12M USDT** and is **100% deployed** at the snapshot — `totalIdle = 0`, `totalDebt = totalAssets`. The queue has been trimmed from five to **three strategies** (Spark USDT, Morpho Gauntlet USDT Prime, Morpho Steakhouse USDT). Two previously-queued strategies — **USDT Fluid Lender and Aave V3 USDT Lender** — were revoked between the April 27 and May 5 snapshots (`activation = 0` on both).

Per the Yearn team, the late-April 100%-idle posture was a **precautionary deallocation following the April 18, 2026 rsETH (KelpDAO) bridge exploit** on the LayerZero OFT bridge layer (the rsETH event itself is documented in the [hgETH reassessment report](./kerneldao-hgeth.md)). The team's specific causal attribution has not been independently verified, but the rsETH event itself is well documented. **Funds have since been re-deployed** — the deallocation reversed, but the redeployment landed in a narrower set of venues (3 instead of 5) and did not return to Fluid or Aave V3 USDT.

The PPS is 1.080606 (~8.06% cumulative since deployment, ~4.5% annualized). The current report captures the May 5 redeployed state.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDT deposits, issuing yvUSDT-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Strategy queue (3 strategies, all USDT-native):**
  - Spark USDT Lender ([`0xED48069a2b9982B4eec646CBfA7b81d181f9400B`](https://etherscan.io/address/0xED48069a2b9982B4eec646CBfA7b81d181f9400B)) — 49.98% of debt
  - Morpho Gauntlet USDT Prime Compounder ([`0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F`](https://etherscan.io/address/0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F)) — 50.02% of debt
  - Morpho Steakhouse USDT Compounder ([`0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5`](https://etherscan.io/address/0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5)) — queued, 0 debt
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (May 5, 2026, snapshot at block 25029809, timestamp 1777996211 = 15:50:11 UTC):**

- **TVL:** 7,122,057.32 USDT (100% deployed)
- **Total Supply:** 6,590,793.95 yvUSDT-1
- **Price Per Share:** 1.080606 USDT/yvUSDT-1 (~8.06% cumulative appreciation over ~21.4 months, ~4.5% annualized)
- **Total Debt:** 7,122,057.32 USDT (100% of TVL)
- **Total Idle:** 0
- **Debt distribution:**
  - Spark USDT Lender: 3,559,778.70 USDT (49.98%)
  - Morpho Gauntlet USDT Prime Compounder: 3,562,278.63 USDT (50.02%)
  - Morpho Steakhouse USDT Compounder: 0 (queued, unfunded)
- **Deposit Limit:** 50,000,000 USDT
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Sky exposure note:** Spark Lend is a **Sky sub-DAO** (governed by Sky), so the ~50% allocation to Spark USDT Lender carries a **Sky-governance dependency** on the Spark admin keys, even though USDT itself has no USDS / Sky peg dependency. This is materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1 (which have direct USDS exposure), but yvUSDT-1 is **not fully Sky-independent** — the prior framing of the queue as having "no Sky routing" was incorrect and has been revised here.

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

### Strategies (3 in default queue, 2 with debt)

| # | Strategy | Name | Current Debt (USDT) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0xED48069a2b9982B4eec646CBfA7b81d181f9400B`](https://etherscan.io/address/0xED48069a2b9982B4eec646CBfA7b81d181f9400B) | Spark USDT Lender | 3,559,778.70 | 49.98% |
| 2 | [`0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F`](https://etherscan.io/address/0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F) | Morpho Gauntlet USDT Prime Compounder | 3,562,278.63 | 50.02% |
| 3 | [`0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5`](https://etherscan.io/address/0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5) | Morpho Steakhouse USDT Compounder | 0 | 0% |

**Previously queued, now revoked (`activation = 0` at block 25029809):**

- USDT Fluid Lender ([`0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72`](https://etherscan.io/address/0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72))
- Aave V3 USDT Lender ([`0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2`](https://etherscan.io/address/0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2))

**Sky-governance exposure note:** Spark Lend is a Sky sub-DAO. Roughly 50% of yvUSDT-1's debt sits in Spark USDT Lender, which is administered through Sky / Spark governance. This is a **Sky-governance dependency** but not a USDS-peg or USDS-collateral dependency — yvUSDT-1 is materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1, but **not fully Sky-independent**. Captured in the dependency subscore.

### Strategy Protocol Dependencies (current allocation)

| Protocol | Strategy | Allocation | Notes |
|----------|----------|-----------:|-------|
| **Spark** | Spark USDT Lender | 49.98% | Sky sub-DAO; audited stack (ChainSecurity, Cantina) |
| **Morpho (Gauntlet)** | Morpho Gauntlet USDT Prime Compounder | 50.02% | Curated by Gauntlet, $6.6B+ Morpho TVL, 25+ audits, Certora formal verification |
| **Morpho (Steakhouse)** | Morpho Steakhouse USDT Compounder | 0% (queued) | Curated by Steakhouse |

The current debt is **split roughly 50/50 across two ecosystems** (Spark, Morpho). Both have multi-year USDT track records with no significant principal-loss events. The mix is less diversified than the prior 5-strategy queue but more concentrated than ideal — particularly the ~50% allocation to a single Sky-governed venue.

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
| **Spark (USDT lender)** | ChainSecurity, Cantina (Spark Lend / SparkDAO) | Sub-DAO of Sky |
| **Morpho (Gauntlet + Steakhouse USDT)** | 25+ audits across Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora; formal verification | Blue-chip, $6.6B+ TVL |

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvUSDT-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- Underlying protocols (Spark, Morpho) both have active bug bounty programs
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

**Low.** All funded strategies are **direct USDT lend / compound** with no conversion hops:

- Spark USDT Lender → direct supply to Spark Lend USDT market
- Morpho Gauntlet USDT Prime Compounder → direct USDT deposit to a Morpho Gauntlet vault
- No leverage, no looping, no cross-chain
- Standard ERC-4626 throughout
- Vault is immutable

## Historical Track Record

- **Vault deployed:** July 23, 2024 (deployment [tx](https://etherscan.io/tx/0x05681fd5be0e925bb720450418d20eda99bb22adc72be3d702de70368d7cd3ea)) — **~21.4 months** in production
- **TVL:** 7,122,057.32 USDT (~$7.12M) — well within the $50M deposit limit
- **PPS trend:** 1.000000 → 1.080606 (~8.06% cumulative return, ~4.5% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management — five strategies have been queued historically. Between April 27 and May 5, **Fluid USDT and Aave V3 USDT were revoked** (`activation = 0`); funds were also re-deployed from the brief 100%-idle state into the remaining Spark + Morpho Gauntlet venues
- **Yearn V3 track record:** V3 framework live since May 2024 (~24 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026).

**Underlying USDT lending market track records:** Spark Lend and Morpho both have multi-year track records on USDT markets with no significant principal-loss events.

## Funds Management

yvUSDT-1 is **100% deployed** at the snapshot, split roughly 50/50 between Spark USDT Lender and Morpho Gauntlet USDT Prime Compounder. Morpho Steakhouse USDT remains queued but unfunded.

### Current State (snapshot)

- **Total Assets:** 7,122,057.32 USDT
- **Total Debt:** 7,122,057.32 USDT (100% deployed)
- **Total Idle:** 0
- **Capital utilization:** 100%

ERC-4626 redemptions now settle by unwinding strategy positions in queue order — atomic from the user's perspective as long as the underlying lending markets have available liquidity (Spark Lend and Morpho USDT markets are both deep multi-million-USDT venues).

### Active Strategies

| Strategy | Allocation | Mechanic | Risk profile |
|----------|-----------:|----------|-------------|
| **Spark USDT Lender** | 49.98% | Direct supply to Spark Lend USDT market | Sky sub-DAO, ChainSecurity / Cantina audits |
| **Morpho Gauntlet USDT Prime Compounder** | 50.02% | Direct USDT deposit to Morpho Gauntlet vault | Curated by Gauntlet, blue-chip lending markets |
| **Morpho Steakhouse USDT Compounder** | 0% (queued) | Direct USDT deposit to Morpho Steakhouse vault | Curated by Steakhouse, blue-chip lending markets |

All are simple lend / compound patterns with no leverage, no conversion hops, and no cross-chain.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 50M USDT deposit limit
- **Withdrawals:** ERC-4626. Strategy unwind through Spark + Morpho USDT markets (both deep)
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% USDT backing** — held in Spark and Morpho USDT lending positions
- **Collateral quality:** USDT is the largest stablecoin by market cap. Centrally-issued by Tether
- **No leverage**
- **Redemption:** atomic for normal sizes; very large redemptions depend on Spark / Morpho market utilization at the moment of withdrawal

The collateral quality is the union of Spark Lend USDT and Morpho USDT market quality — both are blue-chip USDT venues with multi-year clean track records.

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads the underlying lending position balance on-chain in both Spark and Morpho
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 10 days

## Liquidity Risk

**Exit pipeline:** ERC-4626 `withdraw` → strategy `withdraw` → underlying lending market withdrawal (Spark Lend USDT or Morpho Gauntlet USDT vault).

- **Underlying liquidity:** Spark Lend USDT and Morpho Gauntlet USDT are both multi-million-dollar venues with healthy utilization headroom; ~$3.5M / venue here is a small fraction of either market's free liquidity
- **Same-asset:** USDT-denominated share token — no price-divergence risk
- **No DEX liquidity needed** — exits via the lending protocol's own redemption mechanics
- **No withdrawal queue or cooldown** — atomic redemption for normal sizes
- **Deposit limit:** 50M USDT cap vs $7.12M TVL (room for +602%)

The 50/50 split across two ecosystems means a liquidity squeeze in one venue can be partially absorbed by the other (subject to queue order and the user's withdraw size).

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
| **Spark Lend** | High (~50% of debt) | Sky sub-DAO; Spark admin keys live under Sky governance |
| **Morpho (Gauntlet curator)** | High (~50% of debt) | Morpho protocol $6.6B+ TVL; Gauntlet curator selects underlying markets |
| **Sky governance** | Indirect via Spark | Spark Lend admin sits under Sky; not an independent venue |

**Dependency quality:** the deployed mix is **two blue-chip ecosystems split ~50/50** (Spark + Morpho/Gauntlet). Less diversified than the prior 5-strategy queue, and ~50% of debt sits behind Sky-governed infrastructure. Materially less Sky-coupled than yvUSDC-1 / yvUSDS-1 / yvDAI-1 (which carry direct USDS exposure) but **not fully Sky-independent** as the original report claimed.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded
- **Operational anomalies:**
  - The brief late-April 100%-idle posture (followed by full redeployment by May 5) showed Brain / Debt Allocator can rapidly pull and re-route debt. Per the Yearn team the deallocation was precautionary following the rsETH bridge exploit (unverified attribution)
  - **Two strategies revoked** between April 27 and May 5 — USDT Fluid Lender and Aave V3 USDT Lender now have `activation = 0`. The redeployment landed in a narrower set of venues (Spark + Morpho only). The rationale for revoking those two specifically has not been independently verified

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvUSDT-1 is in the monitored vault list:**

- **Large flow alerts** ([`yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/yearn/alert_large_flows.py)) — runs **hourly via GitHub Actions**
- **Endorsed vault check** (`yearn/check_endorsed.py`) — weekly
- **Timelock monitoring** (`timelock/timelock_alerts.py`)

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvUSDT-1 Vault | [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa) | PPS (`convertToAssets(1e6)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| Each active USDT strategy | (3 queued addresses above) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **Allocation drift** — currently ~50/50 Spark/Morpho; a drift toward >75% in one venue should trigger reassessment of the dependency subscore
- **Strategy `current_debt` changes** — `DebtUpdated` events on the vault
- **Strategy additions / removals** — `StrategyChanged` events (new strategies pass through 7-day timelock; further revocations are operational signals)
- **Emergency actions** (`Shutdown`)
- **ySafe / Brain / Security signer or threshold changes**
- **PPS decrease** — should only increase outside of explicit loss events
- **Sky / Spark governance events** — Spark Lend admin actions can affect ~50% of yvUSDT-1's debt
- **USDT-specific:** Tether-side issues (peg deviation, attestation reports, blacklisting events)

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio — currently 100% deployed | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time, activation (revocations show `activation = 0`) | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition (currently 3 strategies) | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Daily |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~24 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Two-ecosystem split:** ~50/50 across Spark Lend and Morpho Gauntlet — both blue-chip USDT venues with multi-year clean track records
- **No USDS-peg exposure:** yvUSDT-1 holds USDT, not USDS, so it is not exposed to USDS peg risk that affects yvUSDC-1 / yvUSDS-1 / yvDAI-1
- **Active monitoring** via Yearn's monitoring-scripts repo
- **No leverage. No cross-chain. No conversion hops** in the active strategies
- **Established track record:** ~21.4 months in production, ~8.06% cumulative return, zero incidents

### Key Risks

- **Concentration in two venues only:** ~50% Spark + ~50% Morpho/Gauntlet. The pre-deallocation 5-strategy queue offered better venue diversification; the post-redeployment 3-strategy queue (with one unfunded) is materially more concentrated
- **Sky-governance dependency on ~50% of debt:** Spark Lend is a Sky sub-DAO, so Sky governance / Spark admin keys can affect ~half of yvUSDT-1's funds. Less coupled than the USDS-denominated vaults but **not Sky-independent** as the prior report claimed
- **Operational signal:** the late-April deallocation followed by the May 5 redeployment with two strategies revoked is a meaningful operational footprint. Per Yearn team this was rsETH-precautionary (see [hgETH report](./kerneldao-hgeth.md)) but specific attribution has not been independently verified
- **USDT-specific:** centrally-issued stablecoin with periodic concerns about Tether's reserve composition; this risk is inherent to the underlying asset and not specific to yvUSDT-1
- **Strategy revocation rationale unverified:** USDT Fluid Lender and Aave V3 USDT Lender — both blue-chip — were revoked entirely. The rationale (rsETH-related vs strategy-specific issue vs APR optimization) is not independently verifiable on-chain

### Critical Risks

- None identified. All gates pass.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Score reflects May 5 snapshot — 100% deployed across Spark + Morpho.**

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
| Production history | **~21.4 months** (July 23, 2024). V3 framework: ~24 months |
| TVL | **$7.12M** USDT (100% deployed). Deposit limit: 50M |
| Security incidents | None on V3, none on the active underlying protocols |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — strong audit coverage, ~21.4 months clean production, no incidents.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** |
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
| Protocol count (active) | 2 funded ecosystems (Spark Lend, Morpho Gauntlet); 1 additional queued (Morpho Steakhouse) |
| Criticality | USDT (Tether) + Spark Lend (~50%, Sky-governed) + Morpho/Gauntlet (~50%) |
| Concentration | ~50% behind Sky-governed infrastructure (Spark) — meaningful Sky-governance dependency, but no USDS-peg dependency |
| Quality | Top-tier on both venues; concentration is the main concern |

**Dependencies Score: 2.0 / 5** — two-ecosystem split with both being blue-chip; offset by Sky-governance concentration on ~50%. Per rubric, "1–2 blue-chip dependencies" = 2.

**Centralization Score = (1.0 + 1.0 + 2.0) / 3 ≈ 1.3**

**Score: 1.3 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% USDT (held via Spark Lend and Morpho Gauntlet positions) |
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
| Exit mechanism | ERC-4626 → strategy unwind through Spark and Morpho USDT markets |
| Liquidity depth | Both venues have multi-million-USDT free liquidity; ~$3.5M each is small relative to either market |
| Large holder impact | Very large redemptions depend on Spark / Morpho utilization at withdraw time |
| Same-value asset | USDT-denominated |
| Withdrawal restrictions | None |

**Score: 1.0 / 5** — both active venues are deep blue-chip USDT lending markets with healthy utilization headroom. The 50/50 split provides cross-venue resilience. Re-evaluate if either venue's utilization spikes or if allocation drifts beyond ~75% to a single venue.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. **Demonstrated again here** — Brain / Debt Allocator pulled all debt and re-deployed within ~8 days, revoking Fluid USDT and Aave V3 USDT in the process (per Yearn team rsETH-precautionary, unverified attribution) |
| Monitoring | Active hourly alerts, vault in monitored list |

**Score: 1.0 / 5** — top-tier operational maturity. The deallocate / redeploy / revoke sequence demonstrates incident-response capability, though the rationale for the specific revocations has not been independently verified.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.3 | 30% | 0.390 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.190 → 1.3 / 5.0** |

Rounded conservatively to 1.3 to reflect the two-venue concentration and the Sky-governance dependency on ~50% of debt.

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

- **Time-based:** Reassess in 6 months (November 2026) or annually
- **TVL-based:** Reassess if TVL exceeds $25M or changes by ±50%
- **rsETH-related context:** if any new strategy is added that takes direct or indirect rsETH exposure, full re-review of the dependency subscore
- **Strategy posture:**
  - **if a USDS-denominated strategy is later added** to yvUSDT-1, the partial Sky-coupling becomes a peg dependency — re-evaluate dependency and concentration scores against the broader risk-1 stable stack
  - if either venue's allocation drifts above ~75% of deployed funds, re-evaluate the dependency / liquidity scores
  - if Morpho Steakhouse USDT is funded (currently queued at 0), re-check the per-venue concentration
  - if any further strategy revocations occur, investigate the rationale
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
│  │  0x310B…FAaa          │                                          │
│  │                       │                                          │
│  │  $7.12M USDT TVL      │                                          │
│  │  100% deployed        │                                          │
│  │  totalDebt = $7.12M   │                                          │
│  │  totalIdle = 0        │                                          │
│  └───────────┬───────────┘                                          │
│              │                                                       │
│      ┌───────┴────────┐                                             │
│      ▼                ▼                                             │
│  Spark USDT       Morpho Gauntlet                                   │
│  3.56M (49.98%)   3.56M (50.02%)                                    │
│  Sky sub-DAO      Morpho protocol                                   │
│                                                                      │
│  Also queued (unfunded): Morpho Steakhouse USDT (0 debt)            │
│                                                                      │
│  Revoked between Apr 27 and May 5 (`activation = 0`):               │
│   - USDT Fluid Lender (0x4Bd0…8A72)                                 │
│   - Aave V3 USDT Lender (0x2799…8Cb2)                               │
└──────────────────────────────────────────────────────────────────────┘

The vault is now 50/50 across two ecosystems. ~50% sits behind Sky-governed
infrastructure (Spark Lend), so yvUSDT-1 is materially less Sky-coupled
than the USDS-denominated risk-1 vaults but **not Sky-independent**. The
prior 5-strategy queue offered better venue diversification.
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
