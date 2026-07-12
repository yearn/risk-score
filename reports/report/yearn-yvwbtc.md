# Protocol Risk Assessment: Yearn — yvWBTC-1

- **Assessment Date:** May 11, 2026 (Updated: July 12, 2026)
- **Token:** yvWBTC-1 (WBTC-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708`](https://etherscan.io/address/0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708)
- **Final Score: 1.4/5.0**

## Overview + Links

yvWBTC-1 is a **WBTC-denominated Yearn V3 vault** (ERC-4626) on Ethereum mainnet. The vault holds **47.5099 WBTC** (~$3.05M at the snapshot) deployed through a single **MetaMorpho V1_1 strategy** (ymv-WBTC) that allocates capital to **Morpho Blue** lending markets. The vault was fully idle at the May 11, 2026 snapshot but a new strategy was **activated May 24, 2026** (after a 7-day timelock proposal) and the vault is now **100% deployed** (`totalDebt = totalAssets`, `totalIdle = 0`).

Within the strategy, capital is split: **~82% idle** within MetaMorpho's Morpho Blue idle market and **~18% supplied** to a Morpho Blue WBTC/LBTC (Lombard BTC) lending market at 94.5% LLTV. A second Morpho Blue WBTC/cbBTC market is available in the supply queue but currently holds no position. The strategy's max debt on the Yearn V3 vault is **1,000 WBTC**.

yvWBTC-1 was deployed May 13, 2025 and is now **~14 months** in production. PPS has risen from 1.000000 at deployment to 1.000305, reflecting ~49 days of yield generation since the strategy was activated.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.4) accepting WBTC deposits, issuing yvWBTC-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.4 Yearn V3 Vault Factory ([`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F))
- **Strategy:** [MetaMorphoV1_1](https://etherscan.io/address/0x2bB005127069A0F0325Fb7370967E8A2b64FB77E) (ymv-WBTC) — a Yearn-operated Morpho MetaMorpho lending vault deploying WBTC into Morpho Blue markets. **Owner:** Yearn Security 4-of-7. **Guardian:** ySafe 6-of-9. **Curator:** 2-of-3 Gnosis Safe. The MetaMorpho contract itself is **immutable** (no EIP-1967 proxy).
- **Underlying protocol:** [Morpho Blue](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) (immutable, v1) — a permissionless lending primitive. The deployed portion (~18% of TVL) is supplied to the WBTC/LBTC market.
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions. The MetaMorpho strategy itself adds a 3-day curator timelock for market cap changes.

**Key metrics (July 12, 2026, snapshot at block 25519096):**

- **TVL:** 47.50988862 WBTC (~$3.05M, Chainlink WBTC/USD = $64,168.64)
- **Total Supply:** 47.49541057 yvWBTC-1
- **Price Per Share:** 1.000305 WBTC/yvWBTC-1 (accumulated yield since strategy activation May 24, 2026)
- **Total Debt:** 47.50988862 WBTC (100% deployed)
- **Total Idle:** 0 WBTC (vault level; within strategy 82% is in Morpho idle market)
- **Deposit Limit:** **100,000 WBTC** (~$6.4B at snapshot — materially oversized, see Reassessment Triggers)
- **Strategy maxDebt:** 1,000 WBTC (~$64M)
- **Profit Max Unlock Time:** 5 days
- **Fees:** 0% management fee, 10% performance fee (vault); 0% MetaMorpho fee

**Strategy allocation:**

| Venue | WBTC | % of TVL | Notes |
|-------|------|----------|-------|
| MetaMorpho idle (Morpho Blue idle market) | 38.96 | 82.0% | Fully liquid, no yield |
| Morpho Blue WBTC/LBTC market | 8.55 | 18.0% | 94.5% LLTV, 79.4% utilization, strategy is 95.2% of supply |
| Morpho Blue WBTC/cbBTC market | 0 | 0% | Cap 500 WBTC, enabled but no position |

**Important note about rsETH / deallocation context:** The vault was 100% idle from April 27–May 11, 2026 after the Aave V3 WBTC Lender was revoked, per the Yearn team in response to the April 18, 2026 rsETH bridge exploit ([hgETH report](./kerneldao-hgeth.md)). The current MetaMorpho strategy was activated May 24, 2026, restoring yield generation through a different, non-Aave, non-rsETH-exposed route.

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [Morpho Blue Documentation](https://docs.morpho.org/)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [hgETH reassessment (rsETH bridge exploit context)](./kerneldao-hgeth.md)

## Contract Addresses

### Core yvWBTC-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvWBTC-1 Vault | [`0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708`](https://etherscan.io/address/0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708) | Yearn V3 Vault (v3.0.4), Vyper minimal proxy |
| Underlying asset (WBTC) | [`0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | Wrapped Bitcoin (BitGo) |
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
| Vault Factory (v3.0.4) | [`0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F`](https://etherscan.io/address/0x770D0d1Fb036483Ed4AbB6d53c1C88fb277D812F) |
| Vault Original (v3.0.4) | [`0xd8063123BBA3B480569244AE66BFE72B6c84b00d`](https://etherscan.io/address/0xd8063123BBA3B480569244AE66BFE72B6c84b00d) |

### Strategies (1 active in default queue, 100% deployed)

`get_default_queue()` returns `[0x2bB005127069A0F0325Fb7370967E8A2b64FB77E]` at block 25519096. The single attached strategy is a **MetaMorpho V1_1 vault** ("ymv-WBTC") deployed specifically for yvWBTC-1:

| Contract | Address | Type |
|----------|---------|------|
| ymv-WBTC (MetaMorphoV1_1) | [`0x2bB005127069A0F0325Fb7370967E8A2b64FB77E`](https://etherscan.io/address/0x2bB005127069A0F0325Fb7370967E8A2b64FB77E) | Morpho MetaMorpho ERC-4626 vault, immutable |

Vault `strategies(0x2bB0…)` returns `(activation=1779638639 [May 24, 2026], last_report=1783571039 [Jul 9, 2026], current_debt=47.5099 WBTC, max_debt=1000 WBTC)`. The strategy was activated 13 days after the May 11, 2026 snapshot, following a 7-day TimelockController proposal.

### Strategy Protocol Dependencies

The MetaMorpho strategy allocates capital to **Morpho Blue** lending markets:

| Contract | Address | Type |
|----------|---------|------|
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Immutable lending primitive (v1) |
| WBTC/LBTC Market (94.5% LLTV) | `0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549` | Active: 18.0% of TVL |
| WBTC/cbBTC Market (94.5% LLTV) | `0x39d6cc9211d023cc16708a2378d821d394d8cfaa3640e3a4d4638d292e10035d` | In queue, cap 500 WBTC, no position |
| LBTC (Lombard BTC) | [`0x8236a87084f8B84306f72007F36F2618A5634494`](https://etherscan.io/address/0x8236a87084f8B84306f72007F36F2618A5634494) | Collateral token in active market |
| cbBTC (Coinbase BTC) | [`0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf`](https://etherscan.io/address/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf) | Collateral token in queued market |
| MorphoChainlinkOracleV2 (LBTC) | [`0xa98105B8227E0f2157816Feb7A331364A9B74F80`](https://etherscan.io/address/0xa98105B8227E0f2157816Feb7A331364A9B74F80) | Chainlink LBTC/USD oracle |
| MorphoChainlinkOracleV2 (cbBTC) | [`0x3eF1F71723d633deE9834c5a7577c39B13C17aeb`](https://etherscan.io/address/0x3eF1F71723d633deE9834c5a7577c39B13C17aeb) | Chainlink cbBTC/USD oracle |
| AdaptiveCurveIrm | [`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC) | Interest rate model (shared by both markets) |

**Note:** yvWBTC-1 remains **outside the Sky/USDS concentration** affecting yvUSDC-1 / yvUSDS-1 / yvDAI-1. The strategy routes exclusively through WBTC-native Morpho Blue markets with BTC-collateral pairs.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

The **v3.0.4 patch release** (used by yvWBTC-1) was reviewed **internally** by the Yearn team rather than re-engaging external auditors. The diff from v3.0.2 is a minor patch-level change; the external audits cover the core architecture. Source: [yearn-vaults-v3 GitHub releases](https://github.com/yearn/yearn-vaults-v3/releases).

### Underlying Protocol Audits: Morpho Blue & MetaMorpho

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [ChainSecurity](https://github.com/morpho-org/morpho-blue/blob/main/audits/2024-01-05-chainsecurity.pdf) | Jan 5, 2024 | Morpho Blue | PDF |
| [Spearbit](https://github.com/morpho-org/morpho-blue/blob/main/audits/2024-01-08-spearbit.pdf) | Jan 8, 2024 | Morpho Blue | PDF |
| [Cantina](https://github.com/morpho-org/morpho-blue/blob/main/audits/2024-02-02-cantina.pdf) | Feb 2, 2024 | Morpho Blue | PDF |
| [Cantina](https://cantina.xyz/competitions/47418e9c-6540-47bd-a205-7f410b6bea43) | May 2024 | MetaMorpho | Competition |
| [OpenZeppelin](https://github.com/morpho-org/morpho-blue/blob/main/audits/2024-09-17-openzeppelin-timelock.pdf) | Sep 17, 2024 | Timelock | PDF |

Morpho Blue core contracts are **immutable** (no proxy, no upgrade mechanism). MetaMorpho V1_1 is also immutable. The historical Aave V3 attachment (which was revoked) is documented in the Historical Track Record below.

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvWBTC-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Underlying-protocol bug bounties:** [Morpho (Immunefi)](https://immunefi.com/bounty/morpho/) — **$2,500,000** max payout (Critical)
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

**Low** — single strategy, single underlying lending protocol. The flow is:
```
yvWBTC-1 (ERC-4626) → MetaMorpho (ERC-4626) → Morpho Blue idle market + WBTC/LBTC lending market
```
Two ERC-4626 layers (vault + MetaMorpho) with Morpho Blue as the underlying lending primitive. No leverage, no looping, no cross-chain. Morpho Blue uses MorphoChainlinkOracleV2 for pricing (standard Chainlink feeds). Both the yvWBTC-1 vault and MetaMorpho strategy contract are immutable.

## Historical Track Record

- **Vault deployed:** May 13, 2025 (deployment [tx](https://etherscan.io/tx/0x8cac67b54afe9af0cc072a2e63852c787343ae514638a54d9644894f6b2a3984)) — **~14 months** in production
- **TVL:** 47.5099 WBTC (~$3.05M). WBTC TVL essentially flat year-over-year; USD TVL declined ~21% since May 2026 due to BTC price drop ($81,600 → $64,200)
- **PPS trend:** 1.000000 (deployment) → 1.000037 (May 11, 2026, mostly undeployed) → **1.000305** (July 12, 2026, ~49 days of yield since MetaMorpho strategy activated May 24, 2026)
- **Security incidents:** None known for this vault, Yearn V3, Morpho Blue, or MetaMorpho
- **Strategy history:**
  - May 18, 2025: Aave V3 WBTC Lender attached
  - Apr 27–May 5, 2026: Aave V3 WBTC Lender **revoked** (precautionary response to April 18 rsETH bridge exploit per Yearn team; causal attribution unverified)
  - May 11, 2026: Vault idle, default queue empty (last snapshot of previous report)
  - **May 24, 2026: MetaMorpho V1_1 (ymv-WBTC) activated** after 7-day TimelockController proposal. Funds deployed immediately
- **Yearn V3 track record:** V3 framework live since May 2024 (~26 months). No V3 vault exploits
- **Morpho Blue track record:** Live since Jan 2024 (~30 months). No exploits. ~$1B+ active markets

**Yearn protocol TVL:** ~$147M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), July 2026, down from ~$197.5M in April 2026).

## Funds Management

yvWBTC-1 deploys all WBTC through a single MetaMorpho V1_1 strategy (ymv-WBTC). Within the strategy, ~82% of TVL is idle on Morpho Blue's idle market and ~18% is supplied as lending liquidity to the WBTC/LBTC Morpho Blue market.

### Current State (snapshot)

- **Total Assets:** 47.50988862 WBTC
- **Total Debt:** 47.50988862 WBTC (100% deployed to strategy)
- **Total Idle:** 0 WBTC (at vault level)
- **Capital utilization:** 100% deployed (at vault level); 18.0% actually earning yield (at strategy level)
- **Default queue length:** 1 (MetaMorpho ymv-WBTC)

### Strategy Breakdown

**ymv-WBTC (MetaMorphoV1_1)** — [`0x2bB005127069A0F0325Fb7370967E8A2b64FB77E`](https://etherscan.io/address/0x2bB005127069A0F0325Fb7370967E8A2b64FB77E)

| Metric | Value |
|--------|-------|
| Strategy totalAssets | 47.5105 WBTC |
| Yearn V3 maxDebt | 1,000 WBTC (~$64M) |
| Yearn V3 currentDebt | 47.5099 WBTC |
| Activation | May 24, 2026 (unix 1779638639) |
| Last report | Jul 9, 2026 (unix 1783571039) |
| MetaMorpho fee | 0% |
| MetaMorpho timelock (curator cap changes) | 3 days |

**Within the MetaMorpho strategy:**

| Venue | WBTC | % of TVL | Utilization | Strategy share of market |
|-------|------|----------|-------------|--------------------------|
| Morpho Blue idle market | 38.96 | 82.0% | N/A (always liquid) | N/A (shared idle pool) |
| Morpho Blue WBTC/LBTC (94.5% LLTV) | 8.55 | 18.0% | 79.4% | 95.2% |
| Morpho Blue WBTC/cbBTC (94.5% LLTV) | 0 | 0% | ~0% | N/A |

**LBTC market context:** The active WBTC/LBTC market has 8.98 WBTC total supply with 7.13 WBTC borrowed (79.4% utilization). The yvWBTC-1 strategy provides 95.2% of all supply — it is the dominant (and essentially sole) liquidity provider. At 79.4% utilization, ~1.85 WBTC of available liquidity remains; large withdrawals from this market would require borrower repayments or new depositor inflows. However, 82% of TVL is in the idle market (immediately redeemable), so redemptions up to ~82% of TVL can be serviced without touching the LBTC market.

**Morpho market parameters:**

| Parameter | WBTC/LBTC Market | WBTC/cbBTC Market |
|-----------|------------------|--------------------|
| Market ID | `0xf6a056…` | `0x39d6cc…` |
| Loan token | WBTC | WBTC |
| Collateral token | LBTC (Lombard BTC) | cbBTC (Coinbase BTC) |
| Oracle | MorphoChainlinkOracleV2 (LBTC/USD) | MorphoChainlinkOracleV2 (cbBTC/USD) |
| IRM | AdaptiveCurveIrm | AdaptiveCurveIrm |
| LLTV | 94.5% | 94.5% |
| MetaMorpho supply cap | 250 WBTC | 500 WBTC |
| Strategy position | 8.55 WBTC | 0 WBTC |

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 100,000 WBTC deposit limit (cap remains oversized — see Reassessment Triggers)
- **Withdrawals:** ERC-4626 `withdraw` → MetaMorpho `redeem` → Morpho Blue idle market withdrawal + LBTC market withdrawal. The 82% idle buffer enables large redemptions without touching the LBTC market
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance (vault); 0% MetaMorpho fee; Morpho Blue has no protocol fee
- **Profit unlock:** 5 days

### Collateralization

- **100% on-chain WBTC backing** — all TVL is deployed to the MetaMorpho strategy, which holds WBTC either as idle (82%) or as Morpho Blue supply positions (18%)
- **Collateral quality:** The underlying asset is WBTC (BitGo-custodied wrapped BTC). The LBTC exposure is through **over-collateralized lending at 94.5% LLTV** — the strategy lends WBTC and receives LBTC as collateral from borrowers
- **Collateral token risk (LBTC):** Lombard BTC is a liquid staking derivative for Bitcoin (similar to Lido's stETH for ETH). Newer than cbBTC or WBTC but used with tight LLTV. Limited track record relative to more established wrapped-BTC products
- **Collateral token risk (cbBTC):** Coinbase Wrapped BTC — well-established with strong institutional custody. Currently zero exposure
- **No leverage** at the vault level — the strategy operates as a pure lender, not a borrower
- **Oracle risk:** Both markets use MorphoChainlinkOracleV2 with Chainlink price feeds. Chainlink is the most battle-tested oracle infrastructure in DeFi. However, oracle manipulation of LBTC/USD (a newer feed) could trigger incorrect liquidations of borrowers, temporarily reducing available liquidity

### Provability

- **PPS:** ERC-4626, fully algorithmic. Vault PPS = convertToAssets(1e18) / 1e18. On-chain at block 25519096: 1.000305
- **Strategy totalAssets():** MetaMorpho ERC-4626 → Morpho Blue share math + idle balance. Fully on-chain and verifiable
- **Profit / loss reporting:** Automated via keeper → StrategyReported events on the vault. Profits unlock over 5 days. Last report: Jul 9, 2026
- **Morpho Blue position:** `Morpho.position(marketId, strategy)` → `(supplyShares, borrowShares, collateral)` — all on-chain

## Liquidity Risk

**Favorable** — 82% idle buffer within the MetaMorpho strategy provides strong redemption capacity. The deployed 18% faces a concentrated, high-utilization Morpho Blue market.

- **Exit pipeline:** ERC-4626 `withdraw` → MetaMorpho `redeem` → Morpho Blue idle market withdrawal (82% of TVL, instant) + LBTC market withdrawal (18% of TVL, constrained). The idle portion redeems atomically; LBTC market withdrawal requires available liquidity or borrower repayments
- **Idle liquidity:** 38.96 WBTC (82% of TVL) held in Morpho Blue's idle market — effectively cash-equivalent, redeemable on demand
- **LBTC market liquidity:** 8.55 WBTC supplied to the WBTC/LBTC market at 79.4% utilization. Available liquidity: ~1.85 WBTC. The strategy is 95.2% of market supply, meaning a large withdrawal from this market would exceed available liquidity and require borrowers to repay. In Morpho Blue, borrowers can be liquidated if collateral value drops, restoring liquidity
- **Same-asset:** WBTC-denominated throughout — no price-divergence risk inside the vault (WBTC/BTC peg risk is upstream at BitGo)
- **No DEX liquidity needed** — exit is through lending-market unwind, not AMM swap
- **No withdrawal queue or cooldown**
- **Deposit limit:** 100,000 WBTC cap vs 47.5 WBTC TVL — materially oversized; not a liquidity issue today, but should be tightened
- **MetaMorpho timelock:** 3-day delay on market cap changes by the curator — prevents sudden allocation shifts

**Liquidity stress scenario:** A redemption exceeding ~39 WBTC (the idle buffer) would partially draw from the LBTC market. Given the market's 79.4% utilization and the strategy's 95.2% supply dominance, the strategy may not be able to exit the full position immediately. However, in practice:
1. The idle buffer covers ~82% of TVL, accommodating most conceivable redemptions
2. LBTC borrowers may repay to avoid liquidation if interest rates rise
3. Liquidations would bring in new WBTC supply to the market
4. The curator can rebalance the supply queue (subject to 3-day timelock)

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
- **Strategy reporting:** automated via keeper (when strategy is funded)
- **Debt allocation:** Debt Allocator (automated) + Brain (manual) — currently 0 deployed
- **Off-chain inputs:** none

### External Dependencies

The strategy introduces a structured dependency chain. The complete external dependency surface:

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **WBTC (BitGo)** | Critical (underlying asset) | Wrapped BTC; relies on BitGo's custody integrity and proof-of-reserves practice. All vault value ultimately depends on WBTC's peg to BTC |
| **Morpho Blue** | Critical (for deployed portion) | Immutable lending primitive, ~30 months production, $1B+ markets, 3 top-tier audits. Currently holds 100% of TVL (82% idle + 18% active) |
| **MetaMorpho V1_1** | High (strategy layer) | Immutable ERC-4626 wrapper. Audited by Cantina, Spearbit, OpenZeppelin. Yearn-governed (Security as owner, ySafe as guardian) |
| **Chainlink (LBTC/USD oracle)** | High (liquidation pricing) | MorphoChainlinkOracleV2 wrapping Chainlink LBTC/USD feed. Oracle failure → incorrect liquidations → temporary illiquidity for LBTC market positions |
| **Chainlink (cbBTC/USD oracle)** | Low (no current exposure) | Identical architecture to LBTC oracle. Currently unused |
| **LBTC (Lombard BTC)** | Moderate (collateral) | Bitcoin liquid staking derivative. Newer than cbBTC/wBTC. Used as collateral at 94.5% LLTV. If LBTC depegs or has custody issues, borrowers face liquidation, which would release WBTC back to the market (beneficial for lenders) unless the oracle lags |
| **cbBTC (Coinbase BTC)** | Low (no current exposure) | Coinbase wrapped Bitcoin. Well-established, strong custody. In supply queue but no position |
| **AdaptiveCurveIrm** | Low (interest rate model) | Morpho's standard adaptive IRM. Battle-tested, no known issues |

**Concentration note:** The strategy is currently single-market for its deployed portion (100% of deployed capital → one WBTC/LBTC market). While only 18% of TVL is deployed, this is a single-point dependency within the deployed segment. The available-but-unused cbBTC market provides a diversification path that the curator can activate.

**Oracle dependency depth:** Both markets use a two-layer oracle stack:
1. MorphoChainlinkOracleV2 — adapter contract (immutable, Morpho-maintained)
2. Chainlink AggregatorV3 — the underlying price feed

Chainlink oracle failure is a systemic risk shared by most DeFi lending protocols. For the LBTC/USD feed specifically, it has less historical data than BTC/USD or ETH/USD, but the feed architecture is identical.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. Strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded
- **Operational anomalies:**
  - **Oversized deposit cap (100,000 WBTC ≈ $6.4B)** vs current 47.5 WBTC TVL — not a safety risk while TVL remains low, but should be tightened or its rationale documented. Action item under Reassessment Triggers
  - **Not yet in `alert_large_flows.py` monitoring list** — the vault has been live ~14 months with rising TVL. Recommend Yearn adds it before any material TVL increase
  - **Strategy-level idle ratio:** 82% idle within MetaMorpho is operationally conservative — the curator (2-of-3 Safe) has not raised the LBTC market cap beyond 250 WBTC despite the available 250 WBTC headroom, indicating conservative risk management

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. Important: **yvWBTC-1 is NOT yet in the `alert_large_flows.py` `VAULTS` dictionary** (verified against the script). The other five mainnet risk-1 vaults (yvUSDC-1, yvUSDS-1, yvWETH-1, yvDAI-1, yvUSDT-1) are present. Recommend adding yvWBTC-1 before any meaningful TVL.

Other monitoring that does cover yvWBTC-1 implicitly via the broader Yearn V3 set:

- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`) — daily
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`)

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvWBTC-1 Vault | [`0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708`](https://etherscan.io/address/0x751F0cC6115410A3eE9eC92d08f46Ff6Da98b708) | PPS (`convertToAssets(1e8)`), `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events, `StrategyChanged`, `DebtUpdated` |
| ymv-WBTC (MetaMorpho) | [`0x2bB005127069A0F0325Fb7370967E8A2b64FB77E`](https://etherscan.io/address/0x2bB005127069A0F0325Fb7370967E8A2b64FB77E) | `totalAssets()`, `totalSupply()`, `convertToAssets(1e8)`, supply cap changes (`setSupplyQueue`, `submitCap`), timelock operations |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Market state for `0xf6a056…` and `0x39d6cc…` (totalSupplyAssets, totalBorrowAssets, utilization, fee) |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | New `addStrategy()` / `revokeStrategy()` proposals (7-day delay) |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Security multisig | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | MetaMorpho owner: signer / threshold changes |
| Curator multisig | [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) | Market cap changes, supply queue modifications (3-day timelock) |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Fee changes |
| LBTC / cbBTC Chainlink feeds | [LBTC/USD](https://data.chain.link/feeds/ethereum/mainnet/lbtc-usd), [cbBTC/USD](https://data.chain.link/feeds/ethereum/mainnet/cbbtc-usd) | Oracle deviation, heartbeat, circuit-breaker triggers |

### Critical Events to Monitor

- **Strategy queue changes** — additions/removals from `get_default_queue()`
- **Strategy debt changes** — `DebtUpdated` events; watch for debt shifts between idle and LBTC market
- **MetaMorpho supply cap changes** — `submitCap` / `acceptCap` events on the MetaMorpho contract (3-day timelock)
- **MetaMorpho supply queue changes** — `setSupplyQueue` by curator
- **LBTC market utilization spikes** — currently 79.4%; approaching 90%+ significantly degrades withdrawal capacity
- **Morpho Blue market parameter changes** — LLTV or oracle changes on the active markets (requires new Morpho Blue market creation since core is immutable)
- **Emergency actions** — vault `Shutdown` or Morpho Blue market pause (guardian can pause)
- **ySafe / Brain / Security / Curator signer or threshold changes**
- **PPS decrease** — should only increase outside of explicit loss events
- **Deposit-limit changes** — particularly relevant given the current oversized cap
- **WBTC-specific:** BitGo custody / proof-of-reserves issues, WBTC-BTC peg deviation, blacklisting events
- **LBTC-specific:** Lombard custody issues, LBTC-BTC peg deviation, oracle deviation
- **Chainlink oracle incidents** affecting LBTC/USD or cbBTC/USD feeds

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e8)` | Vault | PPS tracking | Every 6 hours |
| `totalAssets()` | Vault | Total TVL | Daily |
| `totalDebt()` / `totalIdle()` | Vault | Capital deployment ratio | Daily |
| `get_default_queue()` | Vault | Queue composition | Daily |
| `deposit_limit()` | Vault | Cap monitoring (oversized) | Daily |
| `convertToAssets(1e8)` | MetaMorpho | Strategy PPS tracking | Every 6 hours |
| `totalAssets()` | MetaMorpho | Strategy TVL | Daily |
| Morpho `market(id)` | Morpho Blue | LBTC + cbBTC market state (supply, borrow, utilization) | Daily |
| Morpho `position(id, strategy)` | Morpho Blue | Strategy supply shares per market | Daily |
| `getThreshold()` / `getOwners()` | ySafe, Security, Curator | Governance integrity | Weekly |
| `getMinDelay()` | TimelockController | Delay change detection | Weekly |
| Chainlink LBTC/USD latestAnswer | Oracle | Oracle deviation monitoring | Every 6 hours |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~26 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Morpho Blue is immutable and heavily audited:** 3 top-tier audits, ~30 months of production, $1B+ markets, no exploits
- **Conservative allocation:** 82% idle within MetaMorpho provides substantial redemption buffer. Only 18% deployed to a single Morpho Blue market
- **No Sky / USDS exposure:** Pure WBTC → Morpho Blue → WBTC lending markets. No routing through the Sky/USDS stack that creates concentration risk in yvUSDC-1 / yvUSDS-1 / yvDAI-1
- **No leverage. No cross-chain. No conversion hops** — WBTC-native throughout
- **7-day Yearn timelock + 3-day MetaMorpho timelock** — dual-delay guard on strategy changes and market cap adjustments
- **Good yield resumption:** PPS moved from 1.000037 to 1.000305 in ~49 days since strategy activation

### Key Risks

- **LBTC collateral risk:** The deployed 18% of TVL is in a market where collateral is LBTC (Lombard BTC), a relatively newer Bitcoin liquid staking derivative. While the 94.5% LLTV provides conservative over-collateralization, LBTC has a shorter track record than cbBTC or WBTC
- **Single-market deployment concentration:** 100% of deployed capital is in one Morpho Blue market. The idle buffer mitigates this (82% idle), but redeployment to a second market (cbBTC) would improve diversification
- **Market dominance:** The strategy is 95.2% of the LBTC market supply — large withdrawals from the deployed portion would face significant friction at the current 79.4% utilization
- **Vault immaturity:** ~14 months old, with only ~49 days of yield-bearing history. The vault itself is still the youngest in the mainnet risk-1 set
- **Oversized deposit cap:** 100,000 WBTC cap vs 47.5 WBTC TVL remains a governance hygiene concern
- **Missing monitoring:** yvWBTC-1 is still not in `alert_large_flows.py`

### Critical Risks

- None identified. All gates pass. The current posture — 82% idle, 18% in over-collateralized lending at a blue-chip protocol (Morpho Blue) with conservative LLTV and dual-timelock governance — presents a well-structured risk profile.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is rounded to one decimal place using standard nearest-0.1 rounding; when the value is exactly halfway between two 0.1 marks (X.X50), round UP to the higher (riskier) score per the conservative principle
- **Score reflects current snapshot state (July 12, 2026):** 100% deployed through MetaMorpho → Morpho Blue, with 82% idle and 18% in WBTC/LBTC lending market.

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Morpho Blue audited by ChainSecurity, Spearbit, Cantina. MetaMorpho audited by Cantina, OpenZeppelin. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 + Morpho Blue share math, fully on-chain verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers + 7-day timelock. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits. Morpho Blue: 3 audits. MetaMorpho: multiple audits. Strategy reviewed via Yearn's 12-metric framework |
| Bug bounty | $200K (Yearn Immunefi) + $2.5M (Morpho Immunefi) |
| Production history | Vault: **~14 months** (mostly undeployed until May 24, 2026). Strategy: **~49 days** (activated May 24). V3 framework: ~26 months. Morpho Blue: ~30 months |
| TVL | **47.5099 WBTC** (~$3.05M). Deposit limit: 100,000 WBTC (oversized). Strategy maxDebt: 1,000 WBTC |
| Security incidents | None on any component |
| Strategy review | Yearn 12-metric framework + ySec review |

**Score: 1.5 / 5** — strong audit coverage across all layers, no incidents. The strategy is only ~49 days old (short track record for this specific MetaMorpho instance), but the underlying Morpho Blue protocol has ~30 months of clean production. The vault spent most of its life idle, so yield-bearing track record is limited but risk-bearing history is not misleading.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable**. MetaMorpho is **immutable**. Morpho Blue is **immutable** |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers**. MetaMorpho owner: Security 4-of-7. Curator: 2-of-3 Safe |
| Timelock | 7-day Yearn TimelockController + 3-day MetaMorpho curator timelock |
| Privileged roles | Well-distributed; no role concentration. Dual timelock layers for strategy and market-cap changes |
| EOA risk | None |

**Governance Score: 1.0 / 5** — textbook score-1 governance. Multiple immutable contracts, distributed roles, named signers, dual-timelock architecture.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Fully on-chain: vault ERC-4626 → MetaMorpho ERC-4626 → Morpho Blue share math |
| Vault operations | Permissionless deposits / withdrawals |
| Strategy reporting | Automated via keeper → StrategyReported events. Last report: Jul 9, 2026 |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) + MetaMorpho curator (supply caps) |
| Oracle dependency | MorphoChainlinkOracleV2 (LBTC/USD, cbBTC/USD). Chainlink is the most battle-tested oracle infrastructure |

**Programmability Score: 1.0 / 5** — fully programmatic with battle-tested oracle infrastructure.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (today) | 1 active strategy → Morpho Blue (2 markets: 1 active, 1 queued). Collateral tokens: LBTC (active), cbBTC (queued). Oracles: 2 Chainlink feeds. Total: ~7 distinct dependencies |
| Criticality | WBTC (critical, underlying). Morpho Blue (critical, holds all funds). Chainlink LBTC/USD oracle (high, liquidation pricing). LBTC (moderate, collateral) |
| Quality | Morpho Blue: top-tier, immutable, $1B+ TVL. Chainlink: battle-tested. LBTC: newer but serious (Lombard). cbBTC: Coinbase-backed, well-established |
| Single-point concentration | 100% of deployed capital (18% of TVL) in one Morpho Blue market. 82% idle buffer mitigates but diversification to cbBTC market would improve resilience |

**Dependencies Score: 2.0 / 5** — the dependency surface expanded from 1 (WBTC alone) to ~7 distinct components. The protocols themselves are high-quality (Morpho Blue, Chainlink), but the number of dependencies is material and the deployed portion is single-market concentrated. LBTC as a newer collateral token at 94.5% LLTV adds moderate risk. The 82% idle buffer provides substantial mitigation.

**Centralization Score = (1.0 + 1.0 + 2.0) / 3 = 1.33**

**Score: 1.3 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain WBTC deployed through MetaMorpho → Morpho Blue (82% idle, 18% active lending). The WBTC balance is directly verifiable on-chain through Morpho share math |
| Collateral quality | Underlying asset: WBTC (BitGo custody). Lending exposure: over-collateralized at 94.5% LLTV against LBTC. The strategy is a pure lender, not a borrower |
| Leverage | None at vault or strategy level |
| Verifiability | Fully on-chain: vault ERC-4626 → MetaMorpho ERC-4626 → Morpho Blue supply positions |

**Score: 1.5 / 5** — top-tier on-chain backing with over-collateralized lending. WBTC's off-chain custody (BitGo) and LBTC's newer status keep this at 1.5 rather than 1.0. No leverage, pure lender position.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain across the full dependency chain — vault, MetaMorpho, Morpho Blue supply positions |
| Exchange rate | Two-layer ERC-4626 (vault + MetaMorpho), fully algorithmic |
| Reporting | Automated via keepers with 5-day profit unlock. Last report: Jul 9, 2026 |
| Third-party verification | All positions verifiable via Etherscan + `cast`. Chainlink oracle feeds are publicly accessible |

**Score: 1.0 / 5** — excellent on-chain provability for the entire dependency chain.

**Funds Management Score = (1.5 + 1.0) / 2 = 1.25**

**Score: 1.25 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | 82% idle (instant redemption through Morpho idle market). 18% in WBTC/LBTC lending market at 79.4% utilization — withdrawal constrained by available liquidity (~1.85 WBTC) |
| Liquidity depth | Excellent for idle portion (covers any redemption up to 82% of TVL). Constrained for deployed portion — strategy is 95.2% of market supply |
| Large holder impact | Redemptions >82% of TVL would need LBTC market unwind; above available liquidity would require borrower repayments or liquidations |
| Same-value asset | WBTC-denominated throughout |
| Withdrawal restrictions | None. No cooldown, no lock period. MetaMorpho redeem → Morpho withdraw is instant |

**Score: 1.5 / 5** — the 82% idle buffer provides strong redemption capacity for typical usage. The deployed portion's constrained liquidity (single-market, high utilization, strategy dominance) prevents a score of 1.0, but the idle buffer prevents a score of 2.0 or higher. The Morpho Blue liquidation mechanism provides a backstop for deployed liquidity recovery.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers. Morpho — established 2022, respected |
| Vault management | Standard pattern across 37+ vaults. MetaMorpho adds curator layer (2-of-3 Safe) for supply cap management |
| Documentation | Comprehensive. Strategy code verified on Etherscan. Morpho Blue docs extensive |
| Legal | Yearn BORG (Cayman foundation). Morpho: Swiss association |
| Incident response | Demonstrated: Yearn pulled all debt during April 2026 rsETH incident, revoked Aave strategy, re-deployed via MetaMorpho within weeks. Morpho has not had an exploit incident |
| Monitoring | Active Yearn alerts, but **yvWBTC-1 is NOT yet in `alert_large_flows.py`**. MetaMorpho/Morpho monitoring coverage needs confirmation |
| Deposit cap hygiene | **100,000 WBTC cap (~$6.4B) vs 47.5 WBTC TVL** remains materially oversized |

**Score: 1.5 / 5** — top-tier operational maturity at the framework level, half-step bump for the missing monitoring entry and the oversized deposit cap on this specific vault.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.3 | 30% | 0.390 |
| Funds Management | 1.25 | 30% | 0.375 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **1.365 → 1.4 / 5.0** |

1.365 rounds to 1.4 under the standard nearest-0.1 rule. This is up from the previous 1.2, reflecting the newly-attached strategy and expanded dependency surface. However, 1.4 remains well within the **Minimal Risk** tier. The primary drivers of the +0.2 increase are: (a) Dependencies expanded from WBTC-only (1.0) to 7-component dependency chain including newer LBTC collateral (2.0); (b) Liquidity moved from trivially atomic (1.0) to mostly-idle with constrained deployed portion (1.5).

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

- **Time-based:** Reassess in 6 months (January 2027) or annually
- **TVL-based:** Reassess if TVL exceeds 200 WBTC (~$12.8M at current prices) or changes by ±50%
- **Strategy posture:**
  - **any `addStrategy()` or `revokeStrategy()` proposal at the Strategy Manager TimelockController** ([`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73)) targeting yvWBTC-1 — review during the 7-day delay window
  - **if a USDS-denominated or Sky-routed strategy is later attached** — re-evaluate dependency and concentration scores
  - if additional strategies are attached, re-evaluate the dependency subscore for diversification
- **MetaMorpho / Morpho Blue:**
  - Any supply cap changes on active markets (3-day curator timelock provides advance notice)
  - Addition or removal of Morpho Blue markets from the MetaMorpho supply queue
  - Any Morpho Blue market parameter change (requires new market creation since core is immutable)
  - Chainlink oracle changes for LBTC/USD or cbBTC/USD feeds
- **Allocation shifts:**
  - If deployed portion exceeds 50% of TVL (currently 18%)
  - If idle ratio drops below 20% (currently 82%)
  - If a second Morpho market receives a material allocation — re-evaluate diversification
- **Underlying-protocol incidents:**
  - Any major incident affecting Morpho Blue, MetaMorpho, or WBTC
  - LBTC depeg event, Lombard custody issues, or significant LBTC/USD oracle deviation
  - Chainlink oracle failure or manipulation affecting LBTC or cbBTC feeds
- **Action items (operational hygiene):**
  - **Tighten the deposit cap** — current `deposit_limit = 100,000 WBTC` (~$6.4B at snapshot) is materially above any plausible near-term TVL
  - **Add yvWBTC-1 to `alert_large_flows.py`** monitored vault list
- **WBTC-specific:** BitGo proof-of-reserves issues, sustained WBTC-BTC peg deviation, significant blacklisting / freezing events
- **Governance-based:** ySafe / Brain / Security / Curator signer or threshold changes; any change to the timelock delays

---

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| May 11, 2026 | 1.2 | Initial assessment: 100% idle, empty strategy queue, no protocol dependencies beyond WBTC |
| July 12, 2026 | 1.4 | Reassessment: MetaMorpho V1_1 strategy activated May 24, 2026 deploying 18% to WBTC/LBTC Morpho Blue market (82% idle). Dependency surface expanded to Morpho Blue + Chainlink + LBTC. Score +0.2 on dependencies (+1.0) and liquidity (+0.5), offset by continued excellent governance and collateralization. Still Minimal Risk tier |

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VAULT LAYER                                  │
│                                                                      │
│  ┌───────────────────────┐                                          │
│  │  yvWBTC-1 (v3.0.4)   │                                          │
│  │  ERC-4626, immutable  │                                          │
│  │  0x751F…b708          │                                          │
│  │                       │                                          │
│  │  47.5 WBTC TVL        │                                          │
│  │  ~$3.05M              │                                          │
│  │  totalDebt = 100% TVL │  ← fully deployed to strategy            │
│  │  deposit_limit=100k   │  ← oversized vs TVL                      │
│  └──────────┬────────────┘                                          │
│             │ 100% (47.5 WBTC)                                      │
│             ▼                                                       │
│  ┌───────────────────────┐                                          │
│  │  MetaMorphoV1_1       │  ← Yearn-governed ERC-4626               │
│  │  "ymv-WBTC", immut.   │    Owner: Security 4-of-7                │
│  │  0x2bB0…77E           │    Guardian: ySafe 6-of-9                │
│  │                       │    Curator: 2-of-3 Safe                  │
│  │  totalAssets: 47.51   │    Fee: 0% | Timelock: 3 days            │
│  └────┬────────────┬─────┘                                          │
│       │ 82% idle   │ 18% active                                     │
│       ▼            ▼                                                │
│  ┌─────────┐  ┌──────────────────────┐                              │
│  │ Morpho  │  │ Morpho Blue          │                              │
│  │ Blue    │  │ WBTC/LBTC Market     │                              │
│  │ idle    │  │ (94.5% LLTV)         │                              │
│  │ market  │  │ Oracle: Chainlink     │                              │
│  │         │  │   LBTC/USD           │                              │
│  │ 38.96   │  │ IRM: AdaptiveCurve   │                              │
│  │ WBTC    │  │                       │                              │
│  │         │  │ Strategy: 8.55 WBTC   │                              │
│  └─────────┘  │ Market: 8.98 WBTC    │                              │
│               │ Util: 79.4%           │                              │
│               └──────────────────────┘                              │
│                                                                      │
│  Available but unused:                                               │
│  ┌──────────────────────┐                                           │
│  │ Morpho Blue          │  ← queued, cap 500 WBTC, no position      │
│  │ WBTC/cbBTC Market    │                                           │
│  │ (94.5% LLTV)         │                                           │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘

Dependency chain: WBTC (BitGo) → yvWBTC-1 → MetaMorpho → Morpho Blue
→ Chainlink (LBTC/USD) + LBTC (Lombard).

All three core contracts (yvWBTC-1, MetaMorpho, Morpho Blue) are immutable.
The vault remains fully outside the Sky / USDS concentration.
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
