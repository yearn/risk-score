# Protocol Risk Assessment: Yearn — yvUSDT-1

- **Assessment Date:** April 27, 2026
- **Token:** yvUSDT-1 (USDT-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa`](https://etherscan.io/address/0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa)
- **Final Score: 1.3/5.0**

## Overview + Links

yvUSDT-1 is a **USDT-denominated Yearn V3 vault** (ERC-4626) on Ethereum mainnet. The vault holds **~$7.12M USDT** but currently deploys **0% of it** — `totalDebt = 0`, `totalIdle = totalAssets`. Five strategies are queued (Fluid, Spark, two Morpho compounders, Aave V3 USDT) but none are receiving debt at the snapshot.

Per the Yearn team, the current 100%-idle posture is a **precautionary deallocation following the April 18, 2026 rsETH (KelpDAO) bridge exploit** on the LayerZero OFT bridge layer (the rsETH event itself is documented in the [hgETH reassessment report](./kerneldao-hgeth.md)). yvUSDT-1's previously-funded strategies were exited because some of the underlying lending markets *could* indirectly hold rsETH as collateral. **None of the queued strategies on yvUSDT-1 reference rsETH directly**, and **none route through the Sky / USDS stack** — yvUSDT-1's queue is USDT-native (Fluid USDT, Spark USDT, Morpho USDT compounders, Aave V3 USDT), so the deallocation is precautionary, not corrective. The team's specific causal attribution has not been independently verified, but the rsETH event itself is well documented.

The PPS has appreciated to 1.080484 (~8.05% cumulative), so debt was deployed historically. The current report captures the snapshot state; reassess once funds return to strategies.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting USDT deposits, issuing yvUSDT-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Strategy queue (USDT-native, no Sky / USDS routing):**
  - USDT Fluid Lender ([`0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72`](https://etherscan.io/address/0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72))
  - Spark USDT Lender ([`0xED48069a2b9982B4eec646CBfA7b81d181f9400B`](https://etherscan.io/address/0xED48069a2b9982B4eec646CBfA7b81d181f9400B))
  - Morpho Gauntlet USDT Prime Compounder ([`0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F`](https://etherscan.io/address/0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F))
  - Morpho Steakhouse USDT Compounder ([`0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5`](https://etherscan.io/address/0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5))
  - Aave V3 USDT Lender ([`0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2`](https://etherscan.io/address/0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2))
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (April 27, 2026, snapshot at block 24974187):**

- **TVL:** ~$7,124,701 USDT (100% idle)
- **Total Supply:** ~6,593,989 yvUSDT-1
- **Price Per Share:** 1.080484 USDT/yvUSDT-1 (~8.05% cumulative appreciation over ~21.1 months, ~4.5% annualized)
- **Total Debt:** 0 (on-chain)
- **Total Idle:** 7,124,701.19 USDT (100% of TVL)
- **Deposit Limit:** 50,000,000 USDT
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Important note:** because the vault is 100% idle, this assessment captures the **current snapshot state**, not steady-state operation. The dependency profile, liquidity score, and complexity assessment should be re-checked once Yearn re-deploys funds back into strategies. This trigger is recorded under Reassessment Triggers below.

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

### Strategies (5 in default queue, 0 with debt)

| # | Strategy | Name | Current Debt (USDT) | Allocation |
|---|----------|------|--------------------:|-----------:|
| 1 | [`0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72`](https://etherscan.io/address/0x4Bd05E6ff75b633F504F0fC501c1e257578C8A72) | USDT Fluid Lender | 0 | 0% |
| 2 | [`0xED48069a2b9982B4eec646CBfA7b81d181f9400B`](https://etherscan.io/address/0xED48069a2b9982B4eec646CBfA7b81d181f9400B) | Spark USDT Lender | 0 | 0% |
| 3 | [`0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F`](https://etherscan.io/address/0x6D2981FF9b8d7edbb7604de7A65BAC8694ac849F) | Morpho Gauntlet USDT Prime Compounder | 0 | 0% |
| 4 | [`0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5`](https://etherscan.io/address/0x0a4ea2bDe8496a878a7ca2772056a8e6fe3245c5) | Morpho Steakhouse USDT Compounder | 0 | 0% |
| 5 | [`0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2`](https://etherscan.io/address/0x27998440eC85F0DF11DED26e6aB27c8D2a9d8Cb2) | Aave V3 USDT Lender | 0 | 0% |

**Important:** none of the queued strategies route through the Sky / USDS stack. yvUSDT-1 is therefore **not part of the Sky concentration risk** that affects yvUSDC-1 / yvUSDS-1 / yvDAI-1. If yvUSDT-1 ever adds a USDS-denominated strategy, this exclusion no longer holds and the dependency assessment should be re-checked.

### Strategy Protocol Dependencies (steady-state, when re-deployed)

| Protocol | Strategy | Notes |
|----------|----------|-------|
| **Fluid** | USDT Fluid Lender | Score 1.1/5 per [`fluid.md`](./fluid.md). 8 audits (PeckShield, StateMind, MixBytes, Cantina) |
| **Spark** | Spark USDT Lender | Sub-DAO of Sky, audited stack (ChainSecurity, Cantina) |
| **Morpho** | Gauntlet + Steakhouse USDT compounders | $6.6B+ TVL, 25+ audits, formal verification by Certora |
| **Aave V3** | Aave V3 USDT Lender | Blue-chip, $30B+ TVL |

When the Debt Allocator re-deploys, the dependency mix is **diversified across 4 different blue-chip USDT lending venues** — materially better diversification than yvUSDC-1 / yvUSDS-1 / yvDAI-1's effective single-ecosystem (Sky) concentration.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Underlying Protocol Audits (queued strategies)

| Underlying | Audits | Notes |
|------------|--------|-------|
| **Fluid** | PeckShield, StateMind, MixBytes, Cantina (8 audits) | Already covered under [`fluid.md`](./fluid.md) score 1.1/5 |
| **Morpho (USDT compounders)** | 25+ audits across Trail of Bits, Spearbit, OpenZeppelin, ChainSecurity, Certora; formal verification | Blue-chip, $6.6B+ TVL |
| **Aave V3 (USDT lender)** | Multiple audits (SigmaPrime, Certora, OpenZeppelin, Trail of Bits, ABDK) | Blue-chip, $30B+ TVL |
| **Spark (USDT lender)** | ChainSecurity, Cantina (Spark Lend / SparkDAO) | Sub-DAO of Sky |

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvUSDT-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- Underlying protocols (Aave, Morpho, Spark, Fluid) all have active bug bounty programs
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

Today, **trivially low** — the vault holds USDT directly with no strategies funded.

When the Debt Allocator re-deploys to the queued strategies, complexity is still low:

- All strategies are **direct USDT lend / compound** with no conversion hops
- No leverage, no looping, no cross-chain
- Standard ERC-4626 throughout
- Vault is immutable

## Historical Track Record

- **Vault deployed:** July 23, 2024 (deployment [tx](https://etherscan.io/tx/0x05681fd5be0e925bb720450418d20eda99bb22adc72be3d702de70368d7cd3ea)) — **~21.1 months** in production
- **TVL:** ~$7.12M USDT — well within the $50M deposit limit
- **PPS trend:** 1.000000 → 1.080484 (~8.05% cumulative return, ~4.5% annualized — reflects historical deployment plus the current idle stretch)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management — five strategies have been queued and funded over the lifetime; current state is post-deallocation
- **Yearn V3 track record:** V3 framework live since May 2024 (~23 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026).

**Underlying USDT lending market track records:** Aave V3, Morpho, Spark, and Fluid all have multi-year track records on USDT markets with no significant principal-loss events.

## Funds Management

yvUSDT-1 currently holds 100% USDT idle. There is no active strategy deployment to characterize.

### Current State (snapshot)

- **Total Assets:** 7,124,701.19 USDT
- **Total Debt:** 0
- **Total Idle:** 7,124,701.19 USDT (100%)
- **Capital utilization:** 0% deployed

USDT is held directly at the vault contract. ERC-4626 redemptions settle atomically against this idle balance with no slippage.

### Strategies When Re-Deployed

The five queued strategies are all USDT-native:

| Strategy | Mechanic | Risk profile |
|----------|----------|-------------|
| **USDT Fluid Lender** | Direct supply to Fluid USDT lending market | Fluid score 1.1/5 |
| **Spark USDT Lender** | Direct supply to Spark Lend USDT market | Sky sub-DAO, ChainSecurity / Cantina audits |
| **Morpho Gauntlet USDT Prime Compounder** | Direct USDT deposit to Morpho Gauntlet vault | Curated by Gauntlet, blue-chip lending markets |
| **Morpho Steakhouse USDT Compounder** | Direct USDT deposit to Morpho Steakhouse vault | Curated by Steakhouse, blue-chip lending markets |
| **Aave V3 USDT Lender** | Direct supply to Aave V3 USDT market | Blue-chip, $30B+ TVL |

All are simple lend / compound patterns with no leverage, no conversion hops, and no cross-chain.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 50M USDT deposit limit
- **Withdrawals:** ERC-4626. Currently atomic against idle balance — no strategy unwind needed
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% on-chain USDT backing** — all of TVL is held directly at the vault contract today
- **Collateral quality:** USDT is the largest stablecoin by market cap. Centrally-issued by Tether
- **No leverage**
- **Fully redeemable** — atomic redemption from the idle balance

When re-deployed, the vault inherits the collateral quality of the chosen lending markets (Aave V3, Morpho, Spark, Fluid) — all are blue-chip USDT markets.

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** trivial today (all idle); when re-deployed, reads the underlying lending position balance on-chain
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 10 days

## Liquidity Risk

**Today:** trivially atomic. Total assets = total idle, so any user redemption settles against the vault's USDT balance with no slippage and no strategy unwind.

**When re-deployed:**

- **Exit pipeline:** ERC-4626 `withdraw` → strategy `withdraw` → underlying lending market withdrawal
- **Underlying liquidity:** Aave V3, Morpho, Spark, Fluid USDT markets are all multi-billion-dollar lending venues
- **Same-asset:** USDT-denominated share token — no price-divergence risk
- **No DEX liquidity needed** — exits via the protocol's own redemption mechanics
- **No withdrawal queue or cooldown** — atomic redemption
- **Deposit limit:** 50M USDT cap vs ~$7.12M TVL (room for +602%)

The diversified USDT-native strategy queue means re-deployed liquidity will be spread across 4–5 venues, improving liquidity resilience versus a single-venue vault.

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

**Today:** none directly funded. The only critical dependency is the underlying USDT token itself.

**When re-deployed (steady-state):**

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **USDT (Tether)** | Critical (underlying asset) | Centrally issued; relies on Tether's operational and reserve integrity |
| **Aave V3** | High (when funded) | Blue-chip, $30B+ TVL |
| **Morpho** | High (when funded) | Blue-chip, $6.6B+ TVL |
| **Spark** | Medium (when funded) | Sky sub-DAO |
| **Fluid** | Medium (when funded) | Score 1.1/5 |

**Dependency quality (when re-deployed):** diversified across 4 blue-chip USDT lending venues — substantially more diversified than the Sky-concentrated stable risk-1 vaults (yvUSDC-1 / yvUSDS-1 / yvDAI-1).

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded
- **Operational anomaly:** the current 100%-idle posture is itself an operational signal — Brain / Debt Allocator have actively pulled all debt. Per the Yearn team this was a precautionary action following the rsETH bridge exploit (unverified attribution); reassess once funds re-deploy

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
| Each queued USDT strategy | (5 addresses above) | `totalAssets()`, `current_debt`, `isShutdown()`, keeper report frequency |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |

### Critical Events to Monitor

- **Idle ratio change** — currently 100%; a drop indicates re-deployment, which should trigger reassessment
- **Strategy `current_debt` changes** — `DebtUpdated` events on the vault
- **Strategy additions / removals** — `StrategyChanged` events (new strategies pass through 7-day timelock)
- **Emergency actions** (`Shutdown`)
- **ySafe / Brain / Security signer or threshold changes**
- **PPS decrease** — should only increase outside of explicit loss events
- **USDT-specific:** Tether-side issues (peg deviation, attestation reports, blacklisting events)

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e6)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio — **key early signal that re-deployment has begun** | Daily |
| `strategies(address)` | Vault | Per-strategy debt, last report time | Daily |
| `get_default_queue()` | Vault | Withdrawal queue composition | Weekly |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Daily |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~23 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Diversified strategy queue:** 5 USDT-native strategies across 4 different blue-chip ecosystems (Aave V3, Morpho ×2, Spark, Fluid) — substantially more diversified than the Sky-concentrated stable risk-1 vaults when re-deployed
- **No Sky / USDS exposure:** yvUSDT-1's queue is 100% USDT-native and does not route through the Sky / USDS stack — this vault is excluded from the Sky concentration risk affecting the other stable risk-1 vaults
- **Trivially liquid today** — 100% idle, atomic redemption with no slippage
- **Active monitoring** via Yearn's monitoring-scripts repo
- **No leverage. No cross-chain. No conversion hops** in the queued strategies
- **Established track record:** ~21.1 months in production, ~8.05% cumulative return, zero incidents

### Key Risks

- **Idle posture (100% un-deployed):** per the Yearn team this is a precautionary deallocation following the April 18, 2026 rsETH bridge exploit (see [hgETH report](./kerneldao-hgeth.md) for verified facts about the event). The team's specific causal attribution has not been independently verified, but the rsETH event itself is well documented. The current dependency profile, liquidity, and complexity assessments do not reflect steady-state operation
- **No yield while idle** — depositors today earn 0% APR on the idle balance (PPS is flat while no strategy is funded)
- **Operational signal:** the deallocation indicates Brain / Debt Allocator can rapidly pull all debt — this is a strength in incident response but a sign that operational posture matters here
- **USDT-specific:** centrally-issued stablecoin with periodic concerns about Tether's reserve composition; this risk is inherent to the underlying asset and not specific to yvUSDT-1
- **Re-deployment risk:** when the Debt Allocator re-deploys, dependency, liquidity, and complexity scores need to be re-evaluated against the actual chosen mix

### Critical Risks

- None identified. All gates pass. The current idle posture is a temporary state, not a fundamental risk to the vault.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Score reflects current snapshot state (100% idle).** Reassess when funds re-deploy.

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Queued underlying protocols all extensively audited. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + 100% idle USDT verifiable on-chain. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Queued underlying protocols (Aave V3, Morpho, Spark, Fluid): all blue-chip with extensive audit coverage |
| Bug bounty | $200K (Yearn Immunefi) |
| Production history | **~21.1 months** (July 23, 2024). V3 framework: ~23 months |
| TVL | **~$7.12M** USDT. Deposit limit: 50M |
| Security incidents | None on V3, none on the queued underlying protocols |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — strong audit coverage, ~21 months clean production, no incidents.

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
| Protocol count (today) | 0 funded strategies |
| Protocol count (queued) | 4 different ecosystems (Aave V3, Morpho, Spark, Fluid) — diversified |
| Criticality | Today: only the USDT token itself. When re-deployed: spread across 4 blue-chip USDT lending venues |
| Quality | Top-tier across the queued mix |

**Dependencies Score: 2.0 / 5** — current 100%-idle state means today's only material dependency is USDT itself; when re-deployed, the diversified queue would warrant 1.5–2 (better than the Sky-concentrated stable vaults). Score reflects the current snapshot with the diversified queue intent. Per rubric, "1–2 blue-chip dependencies" = 2; the queued diversification keeps this from being higher.

**Centralization Score = (1.0 + 1.0 + 2.0) / 3 ≈ 1.3**

**Score: 1.3 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain USDT (today, all idle at vault contract) |
| Collateral quality | USDT is the largest stablecoin by market cap; centrally issued by Tether |
| Leverage | None |
| Verifiability | Fully on-chain |

**Score: 1.0 / 5** — top-tier on-chain backing. USDT centralization is a known characteristic of the underlying asset, not a vault-specific issue.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain — anyone can verify yvUSDT-1's USDT balance |
| Exchange rate | ERC-4626, programmatic, real-time |
| Reporting | Automated via keepers (idle today) with 10-day profit unlock |
| Third-party verification | Underlying USDT balance trivially on-chain |

**Score: 1.0 / 5** — excellent on-chain provability.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | 100% idle today — atomic, no slippage, no strategy unwind |
| Liquidity depth | Trivially excellent (idle balance covers any redemption up to TVL) |
| Large holder impact | None — full balance redeemable |
| Same-value asset | USDT-denominated |
| Withdrawal restrictions | None |

**Score: 1.0 / 5** — trivially liquid today. **When the Debt Allocator re-deploys**, liquidity may need to be re-evaluated — particularly if a single venue ends up holding a large share of the deployed funds. Captured under Reassessment Triggers.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi. **Demonstrated again here** — Brain / Debt Allocator pulled all debt as a precaution following the rsETH bridge exploit (per Yearn team, unverified attribution) |
| Monitoring | Active hourly alerts, vault in monitored list |

**Score: 1.0 / 5** — top-tier operational maturity, with the rapid deallocation itself serving as evidence of incident-response capability.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.3 | 30% | 0.390 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.190 → 1.3 / 5.0** |

Rounded conservatively to 1.3 to reflect the "snapshot-state" caveat on Category 4 — a fully-idle vault is trivially liquid today, but the score should not over-credit a temporary posture.

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
- **TVL-based:** Reassess if TVL exceeds $25M or changes by ±50%
- **rsETH-related deallocation:**
  - **rerun this assessment once Yearn re-deploys funds back into yvUSDT-1.** The current 100%-idle posture, dependency profile, and liquidity score all need re-evaluation against the actual re-deployed strategy mix
  - if any new strategy is added that takes direct or indirect rsETH exposure, full re-review of the dependency subscore
- **Strategy posture:**
  - **if a new USDS-denominated strategy is added** to yvUSDT-1, the "no Sky concentration" exclusion no longer holds — re-evaluate dependency and concentration scores against the broader risk-1 stable stack
  - if any single venue ends up holding >75% of deployed funds when re-deployed, re-evaluate the dependency / liquidity scores
- **Underlying-protocol incidents:** any major incident at Aave V3, Morpho, Spark, Fluid, or to the queued USDT lending markets — full re-review
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
│  │  ~$7.12M USDT TVL     │                                          │
│  │  100% idle            │  ← all USDT held at vault contract       │
│  │  totalDebt = 0        │                                          │
│  └───────────────────────┘                                          │
│                                                                      │
│  5 dormant strategies in queue (USDT-native, no Sky/USDS routing):  │
│   - USDT Fluid Lender                                                │
│   - Spark USDT Lender                                                │
│   - Morpho Gauntlet USDT Prime Compounder                            │
│   - Morpho Steakhouse USDT Compounder                                │
│   - Aave V3 USDT Lender                                              │
└──────────────────────────────────────────────────────────────────────┘

When re-deployed (steady-state intent), the vault would diversify across
4 different blue-chip USDT lending venues with no Sky / USDS routing —
materially more diversified than the Sky-concentrated stable risk-1 vaults
(yvUSDC-1, yvUSDS-1, yvDAI-1).
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
