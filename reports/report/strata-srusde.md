# Protocol Risk Assessment: Strata

- **Assessment Date:** May 19, 2026 (Updated: August 5, 2026)
- **Token:** srUSDe (Senior Tranche USDe)
- **Chain:** Ethereum
- **Token Address:** [`0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003`](https://etherscan.io/address/0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003)
- **Final Score: 2.6/5.0**

## Overview + Links

Strata is a generalized risk-tranching protocol that splits yield from underlying strategies into two tokenized tranches with distinct risk-reward profiles:

- **Senior Tranche (srUSDe)**: Over-collateralized, yield-bearing synthetic dollar. Designed for capital preservation with a stable yield floored at a benchmark rate, uncapped upside participation in underlying yield, and first-loss protection from the junior tranche.
- **Junior Tranche (jrUSDe)**: Provides leveraged upside to the underlying yield, absorbing yield volatility and associated risks in exchange for potentially higher returns.

**srUSDe** is an ERC-4626 Meta Vault that accepts deposits of USDe, sUSDe, USDT, USDC, and DAI. All deposited assets are routed through the StrataCDO orchestrator into Ethena's sUSDe vault via the sUSDeStrategy. Yield is distributed between senior and junior tranches using a Dynamic Yield Split (DYS) mechanism that references:
- The underlying sUSDe APY
- A benchmark rate (supply-weighted average of USDC/USDT lending rates on Aave v3 Core)
- The relative TVL distribution between the two tranches
- Risk-premium parameters set by the team (planned to transition to independent risk managers)

The senior tranche always earns at minimum the benchmark rate (floored), with upside participation. In extreme scenarios where junior liquidity is depleted and the underlying APY is below the benchmark rate, the senior tranche simply earns the underlying APY. If the junior tranche is fully depleted, **senior tranche may incur principal losses**.

**Yield source**: Ethena's sUSDe yield (delta-neutral basis trade on ETH/BTC), redistributed via Strata's DYS mechanism.

**Key metrics (August 5, 2026):**
- Protocol TVL: ~$75.8M ([DeFiLlama](https://defillama.com/protocol/strata), aggregated across all Strata markets)
- srUSDe vault TVL (onchain): ~$59.1M USDe; jrUSDe ~$6.6M USDe (Ethena USDe market only)
- Peak TVL: ~$326.4M (October 8, 2025) — protocol is ~77% below ATH
- Chain: Ethereum only
- Protocol operates **six markets**: Ethena USDe (srUSDe), Neutrl NUSD (srNUSD), Midas mHYPER (srmHYPER), Midas mM1-USD (srmM1-USD), Saturn USDat (srUSDat), and Hastra PRIME ([srPRIME](https://etherscan.io/address/0x35bFF778d3fc53a561486BF28e761428499232Eb), deployed May 17, 2026, ~$0.1M). srUSDe is the original and by far the largest market; the others share the same multisig and timelock governance but each has its own CDO/Strategy/Accounting/AprPairFeed and its own AccessControlManager.

**Yearn use cases per issue #47:**
1. Deposit into senior vault srUSDe as part of a strategy
2. Use srUSDe as collateral on Morpho for srUSDe/USDC markets where srUSDe is collateral and USDC is the loan token (minimal price change exposure)

**Links:**

- [Protocol Documentation](https://docs.strata.markets/)
- [Protocol App](https://app.strata.money)
- [Mechanism Overview](https://docs.strata.markets/protocol-mechanism/mechanism-overview)
- [Technical Overview](https://docs.strata.markets/technical-documentation/protocol-overview)
- [Contract Details](https://docs.strata.markets/technical-documentation/contracts-details)
- [Roles & Permissions](https://docs.strata.markets/technical-documentation/roles-and-permissions)
- [Audits](https://docs.strata.markets/technical-documentation/audits)
- [Immunefi Bug Bounty](https://immunefi.com/bug-bounty/strata/information/)
- [Risks & Mitigations](https://docs.strata.markets/protocol-mechanism/risks-and-mitigations)
- [DeFiLlama](https://defillama.com/protocol/strata)
- [GitHub — active repo](https://github.com/Strata-Markets/contracts)
- [GitHub — original repo (frozen Feb 25, 2026)](https://github.com/Strata-Money/contracts-tranches)
- [Twitter/X](https://twitter.com/strata_markets)

## Contract Addresses

### Core Ethena USDe Market Contracts (Ethereum)

| Contract | Address | Type |
|----------|---------|------|
| srUSDe (Senior Tranche) | [`0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003`](https://etherscan.io/address/0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003) | ERC-4626 Meta Vault, Upgradeable Proxy |
| jrUSDe (Junior Tranche) | [`0xC58D044404d8B14e953C115E67823784dEA53d8F`](https://etherscan.io/address/0xC58D044404d8B14e953C115E67823784dEA53d8F) | ERC-4626 Vault, Upgradeable Proxy |
| StrataCDO | [`0x908B3921aaE4fC17191D382BB61020f2Ee6C0e20`](https://etherscan.io/address/0x908B3921aaE4fC17191D382BB61020f2Ee6C0e20) | Core Orchestrator, Upgradeable Proxy |
| Accounting | [`0xa436c5Dd1Ba62c55D112C10cd10E988bb3355102`](https://etherscan.io/address/0xa436c5Dd1Ba62c55D112C10cd10E988bb3355102) | TVL calculations, fee accrual |
| sUSDeStrategy | [`0xdbf4FB6C310C1C85D0b41B5DbCA06096F2E7099F`](https://etherscan.io/address/0xdbf4FB6C310C1C85D0b41B5DbCA06096F2E7099F) | Deposits into Ethena sUSDe Vault |
| ERC20Cooldown | [`0xd6dAD17d025cDdDEd27305aEbAB8b277996A6fAF`](https://etherscan.io/address/0xd6dAD17d025cDdDEd27305aEbAB8b277996A6fAF) | Token lockup for cooldown period |
| UnstakeCooldown | [`0x735edDF50Ca2371aa48466469C742e684c610F74`](https://etherscan.io/address/0x735edDF50Ca2371aa48466469C742e684c610F74) | sUSDe unstaking cooldown |
| SUSDeCooldownRequestImpl | [`0x00A96056c30A22b684fF7a09F4A0AfEaE426dde2`](https://etherscan.io/address/0x00A96056c30A22b684fF7a09F4A0AfEaE426dde2) | Cooldown workflow for sUSDe |
| TrancheDepositor | [`0x50E850641F43F65BF8fB3a7d0CF082a1D252F47e`](https://etherscan.io/address/0x50E850641F43F65BF8fB3a7d0CF082a1D252F47e) | Routes deposits into tranches |
| AprPairFeed | [`0x2bb416614D740E5313aA64A0E3e419B39e800EC2`](https://etherscan.io/address/0x2bb416614D740E5313aA64A0E3e419B39e800EC2) | Benchmark & Collateral APY inputs |
| AaveAprPairProvider | [`0x1c137776e04803F807616c382AbBA12d9BF0AF73`](https://etherscan.io/address/0x1c137776e04803F807616c382AbBA12d9BF0AF73) | Fetches APR values from Aave |
| AccessControlManager | [`0x1d19E18ECaC4ef332a0d5d6Aa3a0f0f772605f60`](https://etherscan.io/address/0x1d19E18ECaC4ef332a0d5d6Aa3a0f0f772605f60) | Role-based access control |
| TwoStepConfigManager | [`0x0f93bAC77c3dDD1341d3Ecc388c5F8A180818994`](https://etherscan.io/address/0x0f93bAC77c3dDD1341d3Ecc388c5F8A180818994) | Two-step exit-fee governance |

### Governance & Multisig Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Admin Multisig | [`0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50`](https://etherscan.io/address/0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50) | 3-of-4 Gnosis Safe, cold wallets, internal team + founding contributors |
| Operational Multisig | [`0x4be3749a0F6557b8fd98F3967e859DbD7C694eF4`](https://etherscan.io/address/0x4be3749a0F6557b8fd98F3967e859DbD7C694eF4) | 2-of-3 Gnosis Safe, internal team |
| Timelock (48h) | [`0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706) | Proposer: Admin Multisig. Canceller: Guardian |
| Timelock (24h) | [`0x4f2682b78F37910704fB1AFF29358A1da07E022d`](https://etherscan.io/address/0x4f2682b78F37910704fB1AFF29358A1da07E022d) | Strategy config changes |
| Guardian | [`0x277D26a45Add5775F21256159F089769892CEa5B`](https://etherscan.io/address/0x277D26a45Add5775F21256159F089769892CEa5B) | Patrick Collins (Cyfrin CEO) -- can cancel timelock transactions |

### Proxy Infrastructure

| Contract | ProxyAdmin |
|----------|-----------|
| srUSDe | [`0x30a17D6bcBdbf1579D6FbBA453aCf776d01fBb50`](https://etherscan.io/address/0x30a17D6bcBdbf1579D6FbBA453aCf776d01fBb50) |
| jrUSDe | [`0x89d2573471Dc0BF81c7c553fFfc1E31Ce9E75BF1`](https://etherscan.io/address/0x89d2573471Dc0BF81c7c553fFfc1E31Ce9E75BF1) |
| StrataCDO | [`0xcAb791D0D44eBaC17378fF2AF6356c012F15c9e6`](https://etherscan.io/address/0xcAb791D0D44eBaC17378fF2AF6356c012F15c9e6) |
| sUSDeStrategy | [`0x32D0D70A8dA4c0c2f354a986fD3738aFe92542f7`](https://etherscan.io/address/0x32D0D70A8dA4c0c2f354a986fD3738aFe92542f7) |
| Accounting | [`0x25A733FEBA393A48C07a76441777324B471d212E`](https://etherscan.io/address/0x25A733FEBA393A48C07a76441777324B471d212E) |
| ERC20Cooldown | [`0xeD6c7b379F73DF0618406d263b13b2386E398166`](https://etherscan.io/address/0xeD6c7b379F73DF0618406d263b13b2386E398166) |

All proxy admins are owned by the 48h Timelock ([`0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706)).

### On-Chain Verification

All core contracts are **verified on Etherscan**:

| Contract | Etherscan Name | Verified | Proxy |
|----------|---------------|----------|-------|
| srUSDe | TransparentUpgradeableProxy → Tranche (impl [`0xe894055ca1c73648927e225f3ca38ed48e30210b`](https://etherscan.io/address/0xe894055ca1c73648927e225f3ca38ed48e30210b)) | Yes | Yes |
| jrUSDe | TransparentUpgradeableProxy → Tranche (impl [`0xe91869f96806b480dd61d57e17919068d35ac09c`](https://etherscan.io/address/0xe91869f96806b480dd61d57e17919068d35ac09c)) | Yes | Yes |
| StrataCDO | TransparentUpgradeableProxy → StrataCDO (impl [`0xb3d4f2c2123f8c3ca85ae7a6d48aa2ef049c79ba`](https://etherscan.io/address/0xb3d4f2c2123f8c3ca85ae7a6d48aa2ef049c79ba)) | Yes | Yes |
| sUSDeStrategy | TransparentUpgradeableProxy → sUSDeStrategy (impl [`0x2b9796606c8480312a572742c00f606ef4adb107`](https://etherscan.io/address/0x2b9796606c8480312a572742c00f606ef4adb107)) | Yes | Yes |
| Accounting | TransparentUpgradeableProxy → Accounting (impl [`0x5a8d34d785b5008cce9b9f4aaa0e445f6959cbff`](https://etherscan.io/address/0x5a8d34d785b5008cce9b9f4aaa0e445f6959cbff)) | Yes | Yes |
| AccessControlManager | AccessControlManager | Yes | No |
| Admin Multisig | GnosisSafeProxy | Yes | Yes |
| Operational Multisig | SafeProxy | Yes | Yes |
| 48h Timelock | StrataMasterChef (OZ TimelockController) | Yes | No |
| 24h Timelock | StrataMasterChef (OZ TimelockController) | Yes | No |
| Guardian | EOA (not a contract) | N/A | N/A |

**Note**: Both timelocks are registered on Etherscan as `StrataMasterChef` but contain standard OpenZeppelin TimelockController functions (`schedule`, `execute`, `cancel`, `getMinDelay`). Delays are 172,800 seconds (48h) and 86,400 seconds (24h). Each proxy contract has its own dedicated ProxyAdmin, all owned by the 48h Timelock.

**Upgrade history** (`Upgraded` events on each proxy): srUSDe, jrUSDe, StrataCDO, and sUSDeStrategy were last upgraded on **December 6, 2025** (block [23956716](https://etherscan.io/block/23956716)); Accounting was last upgraded on **February 23, 2026** (block [24519364](https://etherscan.io/block/24519364)). No srUSDe-market implementation has been replaced since.

## Audits and Due Diligence Disclosures

Strata has completed an extensive, multi-phased audit process with 3 reputable firms across at least 8 distinct audit engagements, per the protocol's [audits page](https://docs.strata.markets/technical-documentation/audits).

### Audit History

| # | Firm | Date | Scope | C | H | M | L | Info | Report |
|---|------|------|-------|---|---|---|---|------|--------|
| 1 | **Cyfrin** | Oct 8, 2025 | Protocol v1 (Tranches) | 1 | 2 | 6 | 5 | 12 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-10-08-cyfrin-strata-tranches-v2.0.pdf) |
| 2 | **Guardian Audits** | Oct 10, 2025 | Protocol v1 (Tranches) | 1 | 5 | 14 | 5 | 8 | [PDF](https://github.com/GuardianAudits/Audits/blob/main/Strata/Strata_Tranches_report.pdf) |
| 3 | **Quantstamp** | ~Q4 2025 | Protocol v1 (Tranches) | - | - | - | - | - | [Certificate](https://certificate.quantstamp.com/full/strata-tranches/3c3a4037-2a92-468c-a4f3-5ea498e7b539/index.html) |
| 4 | **Quantstamp** | ~Q4 2025 | Redemption Fee (Update to Tranches) | - | - | - | - | - | [Certificate](https://certificate.quantstamp.com/full/strata-update-to-tranches/d7a903b7-80cf-42db-8433-79186fdd8be2/index.html) |
| 5 | **Cyfrin** | Jan 23, 2026 | Coverage-aware redemption / Shares Cooldown mechanism | 0 | 0 | 6 | 3 | 10 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2026-01-23-cyfrin-strata-shares-cooldown-v2.0.pdf) |
| 6 | **Quantstamp** | ~Q1 2026 | Discrete accounting mechanism | - | - | - | - | - | [Certificate](https://certificate.quantstamp.com/full/strata-discrete-accounting/02318e87-e35f-4e96-81ad-192253203d55/index.html) |
| 7 | **Cyfrin** | Jun 11, 2025 | Pre-Deposit Vaults | 1 | 1 | 3 | 16 | 9 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-06-11-cyfrin-strata-predeposit-v2.1.pdf) |
| 8 | **Quantstamp** | ~2025 | Pre-Deposit Vaults | - | - | - | - | - | [Papermark](https://www.papermark.com/view/cmgm9op9b0003l404g395i6a5) |

*Quantstamp reports hosted on JS-rendered platforms; finding counts require browser access. Dashes indicate data not programmatically extractable.*

**Total findings across Cyfrin + Guardian reports: 3 Critical, 8 High, 29 Medium, 29 Low (all resolved).**

**Coverage gap**: no published audit covers the Neutrl, Midas, Saturn, or Hastra PRIME markets. Protocol docs state the tranche contracts share the srUSDe codebase, but each market ships its own Strategy, Accounting, and APR-provider contracts — the market-specific code is unaudited in public reports.

Notable Critical/High findings (all resolved):
- **C: Withdrawers of sUSDe always incur a loss** (Cyfrin #1) -- Inverted parameters in `Tranche::_withdraw` caused users to receive significantly less than entitled
- **C: Reserve withdrawal unit mismatch** (Guardian #2) -- `StrataCDO.reduceReserve` forwarded incorrect amounts, breaking internal accounting
- **C: Attacker can drain entire protocol sUSDe balance** (Cyfrin #6) -- Incorrect redemption accounting in pre-deposit vault could drain funds
- **H: Withdrawal active requests DoS** (Cyfrin #1, Guardian #2) -- Spam tiny withdrawal requests on behalf of another user causing out-of-gas during finalization
- **H: MEV APR front-run** (Guardian #2) -- Front-running of APR changes via `onAprChanged`
- **H: JR tranche bankrun susceptibility** (Cyfrin #5) -- SharesCooldown finalization bypassed `minimumJrtSrtRatio`

Guardian Audits recommended an independent follow-up review after finding 1 Critical + 5 High issues, which was conducted by Quantstamp.

### On-Chain Complexity

The architecture is moderately complex:
- **CDO Pattern**: Core orchestrator (StrataCDO) connects tranches, accounting, and strategy contracts
- **Multiple Proxy Contracts**: Most core contracts use OpenZeppelin TransparentUpgradeableProxy
- **Cooldown Mechanisms**: Two-stage withdrawal with ERC20Cooldown and UnstakeCooldown contracts
- **APR Feed System**: Onchain APR calculation using Aave data feeds
- **Multi-token deposits**: The srUSDe Meta Vault accepts USDe, sUSDe, USDT, USDC, and DAI

### Bug Bounty

Strata has an active [Immunefi bug bounty](https://immunefi.com/bug-bounty/strata/information/) with a **$250,000 maximum smart-contract reward**, paid in USDC on Ethereum. The program has been live since **October 1, 2025** and was last updated July 8, 2026. Its [scope](https://immunefi.com/bug-bounty/strata/scope/) covers current and future Solidity files in the listed core-contract directories plus the cooldown, tranche-depositor, and exit-fee components; critical impacts include direct theft, permanent freezing, and protocol insolvency.

## Historical Track Record

- **Time in Production**: srUSDe proxy deployed October 2, 2025 (block [23492392](https://etherscan.io/tx/0x857c511cb166160e9b9acdb8ef47d9306ad5bcef1a311e845b4a2d4b90ea1f6b)). In production for **~10 months** as of August 5, 2026. Pre-deposit vaults with TVL existed from July 2025.
- **GitHub Repository**: Development moved repositories. The original [`Strata-Money/contracts-tranches`](https://github.com/Strata-Money/contracts-tranches) (created September 16, 2025) received its last push on **February 25, 2026** and is frozen. The current [`Strata-Markets/contracts`](https://github.com/Strata-Markets/contracts) repository, created **February 26, 2026**, is public and actively developed; its latest push was **August 4, 2026**.
- **TVL History** (DeFiLlama, protocol-wide totals):

| Period | TVL | Notes |
|--------|-----|-------|
| Jul 2025 | ~$18M | Pre-deposit vaults / soft launch |
| Aug 2025 | $18M - $53M | Steady growth |
| Sep 2025 | $53M - $172M | Rapid growth |
| **Oct 8, 2025** | **~$326M** | **Peak TVL (ATH)** |
| Oct 13, 2025 | ~$110M (srUSDe market only) | Official launch on Ethena USDe |
| Nov - Dec 2025 | $214M - $221M | Consolidation |
| Jan 1, 2026 | $226M | Stable |
| Jan 8-17, 2026 | $230M → $122M | **First sharp drawdown** (~$108M outflow in ~10 days; -62.6% from peak) |
| Feb 1-18, 2026 | $132M → $153M | Recovery |
| Mar 1-31, 2026 | $172M → $258M | Strong recovery |
| **Apr 2-4, 2026** | **$242M → $114M** | **Second sharp drawdown** (-53% in 2 days) |
| Apr 11-22, 2026 | $137M → $128M | Partial recovery, then renewed decline |
| **Apr 23-25, 2026** | **$119M → $84M** | **Third sharp drawdown** (-29% in 2 days) |
| May 1-19, 2026 | $82M → $87M | Recovery off multi-month lows |
| May 22 – Jun 1, 2026 | $87M → $99.7M | **Local high** for the period |
| Jun 1-25, 2026 | $99.7M → $83.3M | Steady bleed |
| **Jun 26, 2026** | **$83.3M → $67.6M** | **Fourth sharp drawdown** (−19% in a single day) |
| Jun 26 – Jul 15, 2026 | $67.6M → $50.5M | Continued outflows to the cycle low |
| Jul 16-17, 2026 | $50.5M → $71.5M | Rapid bounce (+42% in 2 days) |
| Jul 22, 2026 | $66.9M → $77.3M | Second inflow step (+16% in a day) |
| **Jul 27, 2026** | **~$78.1M** | Reassessment snapshot (~76% below ATH) |
| **Aug 5, 2026** | **~$75.8M** | **Current** (~77% below ATH) |

- **TVL Volatility**: The protocol has experienced **four distinct large drawdown events** (Jan, early Apr, late Apr, and Jun-Jul 2026), each shedding 19-55% of TVL within days. Peak-to-current decline is ~77%, and the trough-to-current recovery since July 15 is +50%. The repeated boom-bust pattern is consistent with **large depositor concentration** and is likely driven in part by points-program farming behavior — the single-day ±16-19% steps in June and July are the signature of individual whale entries and exits rather than broad retail flow.
- **Incidents**: No reported security incidents, exploits, or hacks.
- **Governance Activity**:
  - 48h Timelock: **74 `CallScheduled`**, **74 `CallExecuted`**, **0 `Cancelled`** events since deployment (event counts, not operation counts — a batched operation emits one event per call). The July 21, 2026 operation calling `setReserveBps(0)` on **SaturnAccounting** [`0x180f7b3b…`](https://etherscan.io/address/0x180f7b3b807FA91EDb6e864802e4664D6Ee8Cf88) executed on **July 30, 2026** (tx [`0xcb220999…`](https://etherscan.io/tx/0xcb220999d1fb471984f1ac9ec074ae7deff877289cba85825fdf0854da5d1a81)). It targets the Saturn USDat market, not srUSDe.
  - 24h Timelock: 0 `CallScheduled` and 0 `CallExecuted` events since deployment in October 2025.
- **Exchange Rate and Tranche Sizes** (block [25689464](https://etherscan.io/block/25689464)):
  - srUSDe `convertToAssets(1e18)` = **1.028479213064204045 USDe per srUSDe**
  - srUSDe `totalAssets()` = **59,081,900 USDe**; `totalSupply()` = **57,445,886 srUSDe**
  - jrUSDe `totalAssets()` = **6,635,632 USDe**; `totalSupply()` = **6,219,341 jrUSDe** (price per share 1.0669)
  - Senior:Junior asset ratio **~8.90:1**; system collateralization **~111.2%** of senior assets — above the 105% circuit breaker
  - Exchange-rate growth of approximately +0.68% over the 78 days to August 5 annualizes to **~3.2%**

## Funds Management

### Deposit/Withdrawal Flow

**Deposit**: Users deposit USDe (or sUSDe, USDT, USDC, DAI) into the srUSDe Meta Vault. Deposited assets are exchanged for shares proportional to the current exchange rate and passed to the sUSDeStrategy, which stakes them into Ethena's sUSDe vault.

**Withdrawal**: The redemption path depends on the token the user exits into. `sUSDeStrategy.getSupportedTokens()` returns sUSDe and USDe.

1. **Exit in sUSDe — atomic, no cooldown.** `sUSDeStrategy.withdraw` routes to `ERC20Cooldown.transfer(..., cooldownSeconds)` where `cooldownSeconds` is `sUSDeCooldownSrt` for the senior tranche. Both `sUSDeCooldownSrt()` and `sUSDeCooldownJrt()` read **0**, and `ERC20Cooldown.cooldownDisabled(sUSDe)` reads **true**. In the contract, `cooldownSeconds == 0` takes an early-return branch that performs an immediate `safeTransferFrom` and emits `Finalized` in the same transaction. The senior tranche has been configured this way since deployment (October 2, 2025); the junior tranche's 7-day cooldown was zeroed on December 11, 2025 (tx [`0xb887bdbf…`](https://etherscan.io/tx/0xb887bdbfaeaf4090622c3ea0b4cd9708bfda2357106102407e0e7b2902fe6643)). 122 `Finalized` events since block 25,500,000 confirm redemptions settling in one transaction in practice.
2. **Exit in USDe — ~1 day.** Routes through `UnstakeCooldown`, which triggers Ethena's own sUSDe cooldown. Ethena reduced `sUSDe.cooldownDuration()` from 604,800 seconds (7 days) to **86,400 seconds (1 day)** on March 16, 2026 (tx [`0x05856199…`](https://etherscan.io/tx/0x05856199ceddbfb1b8231c8bfa3bf4c967e5156122b2f1eb11a473fdf5f2d9f9)).
3. Each withdrawal request is handled independently per user; new requests do not extend or affect earlier requests.

The senior tranche's zero cooldown is a **governance-mutable parameter**, not a structural property: `sUSDeStrategy.setCooldowns` is callable by `UPDATER_STRAT_CONFIG_ROLE` (48h and 24h Timelocks) and can reinstate a cooldown up to a hard-coded 7-day maximum. A 48h-timelocked action can therefore convert srUSDe from an instantly redeemable position into a 7-day-locked one.

### Accessibility

- **Deposits**: Permissionless. Anyone can deposit USDe, sUSDe, USDT, USDC, or DAI
- **Redemptions**: Permissionless. Atomic when exiting in sUSDe; ~1 day when exiting in USDe via Ethena's unstaking cooldown
- **Deposit limit**: `StrataCDO.maxDeposit(srUSDe)` = **~51.5M USDe** of remaining senior headroom. This is not a fixed cap — it is derived from `minimumJrtSrtRatioBuffer` (6%), so senior capacity is `jrtNav / 0.06` minus current senior NAV and shrinks as the junior tranche shrinks. `maxDeposit(jrUSDe)` is unbounded
- **Fees**: Exit fees are onchain: `exitFeeSrt()` = 2.5e14 (**0.025%**) for senior and `exitFeeJrt()` = 1e15 (**0.1%**) for junior. Exit-fee changes are governed by a two-step process via TwoStepConfigManager

### Collateralization

- **Backing**: srUSDe is backed by the underlying USDe/sUSDe staked in Ethena's vault, with additional over-collateralization from the junior tranche (jrUSDe) which serves as first-loss capital. sUSDeStrategy holds **53,023,275 sUSDe**, worth **65,862,142 USDe** per `sUSDeStrategy.totalAssets()`. This reconciles against the tranches: 59,081,900 senior + 6,635,632 junior = 65,717,532 USDe of tranche NAV, with the ~145K remainder held as protocol reserve
- **Senior coverage ratio**: **~111.2%** (senior + junior assets / senior assets). The circuit breaker is enforced by `Accounting.minimumJrtSrtRatio()` = 5e16, i.e. junior NAV must stay ≥ **5%** of senior NAV, equivalent to a 105% coverage floor. A separate `minimumJrtSrtRatioBuffer()` = 6e16 (6%) gates new senior deposits ahead of the hard floor. Current junior/senior ratio is **11.23%**, so the tranche retains a little over half its junior buffer before deposits gate and before the hard floor
- **Underlying collateral**: USDe is Ethena's synthetic dollar backed by a delta-neutral strategy (ETH/BTC spot + short perpetual futures). Ethena maintains proof of reserves via third-party verification
- **Risk hierarchy**: Senior tranche (srUSDe) is principal-protected in the base asset and paid first. The junior tranche absorbs losses before any impact to senior holders. However, if the junior tranche is **fully depleted**, the senior tranche **may incur principal losses**
- **Automatic shortfall pause**: `StrataCDO.jrtShortfallPausePrice()` = 1e16, i.e. deposits to *both* tranches auto-pause only once the junior price per share falls to **0.01 USDe**. Junior price per share is currently **1.0669**, so this backstop requires a ~99% junior wipeout to fire and offers effectively no protection against gradual junior erosion. The `minimumJrtSrtRatio` floor, not this price trigger, is the operative guard
- **Reserve mechanism**: `Accounting.reserveBps()` = **5e16**, which in this contract is WAD-scaled (`PERCENTAGE_100 = 1e18`), so **5%** — applied to *gains*, not to TVL, and hard-capped at `RESERVE_BPS_MAX = 0.1e18` (10%). `RESERVE_MANAGER_ROLE` is currently held only by the inoperative 24h Timelock, so `distributeReserve`, `reduceReserve`, and `setReserveTreasury` cannot execute through their assigned path. The 48h Timelock is a `DEFAULT_ADMIN_ROLE` holder on the AccessControlManager and can grant or reassign `RESERVE_MANAGER_ROLE` through a 48h-delayed action. `StrataCDO.treasury()` is additionally unset, so reserve withdrawal would require both role remediation and a treasury configuration

### Provability

- **Exchange rate**: Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Anyone can verify
- **Underlying sUSDe balance**: Verifiable onchain by checking the strategy's sUSDe holdings
- **Yield calculation**: DYS mechanism computes yields onchain using the AprPairFeed contract. Benchmark rate sourced from Aave v3 Core. However, risk-premium parameters (x, y, k) are set by the team
- **Accounting**: Onchain Accounting contract tracks raw TVL, balances, inflows/outflows, fees, and reward distribution for both tranches

## Liquidity Risk

### Primary Exit Mechanisms

1. **Redeem from srUSDe vault into sUSDe**: **Atomic** — no Strata cooldown and no Ethena unstaking, settled in a single transaction. This is the deepest and fastest exit, and it inherits sUSDe's own liquidity
2. **Redeem from srUSDe vault into USDe**: ~**1 day**, gated by Ethena's `cooldownDuration()` of 86,400 seconds
3. **DEX swap**: Negligible onchain DEX liquidity — **~$99K across 40 pools** with **~$768 of 24h volume** protocol-wide ([GeckoTerminal](https://www.geckoterminal.com/eth/tokens/0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003)). Largest is a Uniswap V4 srUSDe/USDe 1.01% pool at ~$45.5K. **No Curve or Balancer pools exist.** CoinGecko does not list srUSDe
4. **Pendle markets**: The PT-srUSDe-25JUN2026 market **expired June 25, 2026**. One active srUSDe market remains: PT-srUSDe-22OCT2026 ([market `0x66ec657c…`](https://etherscan.io/address/0x66ec657c59cdcaf171ab43b83da3942758bf8a97), [PT `0x59bc9fae…`](https://etherscan.io/address/0x59bc9fae5d62b19d4f8d07d758047acb9ee19d34)), **$4.60M LP liquidity** at a 3.97% implied APY ([Pendle API](https://api-v2.pendle.finance/core/v1/1/markets/0x66ec657c59cdcaf171ab43b83da3942758bf8a97)). A parallel jrUSDe market ([`0x78f6927a…`](https://etherscan.io/address/0x78f6927ab0600c445178645f3c64afec85f6dd8a)) holds $0.57M. These trade the fixed-yield PT, not raw srUSDe
5. **Morpho markets**: The raw srUSDe/USDe market ([`0xc184c2aa…`](https://app.morpho.org/ethereum/market/0xc184c2aafb37a571454213746023b2f9fc16d37ce017729a96f19feea60677d1)) has **$0 supply and $0 borrow**. All PT-srUSDe markets are dust (largest is PT-srUSDe-15JAN2026/USDC at ~$37.5K on an expired PT). **No srUSDe/USDC market exists on Morpho** — see the note on Yearn use case #2 below

### Withdrawal Restrictions

- **Cooldown period**: None for sUSDe redemptions; ~1 day for USDe redemptions. Both are governance-mutable — `setCooldowns` can reimpose up to 7 days on the Strata side, and Ethena independently controls its own `cooldownDuration`
- **Coverage protection**: Senior deposits gate at a 6% junior/senior ratio and the hard floor sits at 5% (105% coverage). This protects the senior tranche but could restrict activity in stressed conditions
- **Self-balancing**: The coverage mechanism is designed to be self-balancing -- thinner junior coverage attracts more liquidity via higher junior yields

### Liquidity Assessment

- **Primary liquidity**: The redemption path is the main exit and it is fast — atomic in sUSDe, ~1 day in USDe. For a $59.1M senior tranche sitting on $65.9M of strategy assets, redemption capacity is effectively the full position rather than a rationed queue
- **Secondary market**: Secondary venues are thin. Pendle at $4.60M covers ~7.8% of senior TVL; DEX pools at ~$99K are immaterial; Morpho srUSDe markets are empty
- **Large holder impact**: Large holders can exit at scale through redemption, which is what the June-July outflows demonstrate — the protocol shed ~$49M of TVL between June 1 and July 15 without a queue backlog or a depeg
- **Same-value redemption**: srUSDe redeems for USDe or sUSDe (both stablecoin-denominated), so price-impact risk on exit is minimal
- **Note on Yearn use case #2**: the intended "srUSDe as collateral on Morpho for srUSDe/USDC markets" does not currently exist onchain. The only raw srUSDe market on Morpho Blue is srUSDe/USDe at 92% LLTV with zero supply and zero borrow. Using srUSDe as Morpho collateral would require a new market to be created and seeded

## Centralization & Control Risks

### Governance

Strata uses a layered Role-Based Access Control (RBAC) system in the **AccessControlManager** ([`0x1d19E18ECaC4ef332a0d5d6Aa3a0f0f772605f60`](https://etherscan.io/address/0x1d19E18ECaC4ef332a0d5d6Aa3a0f0f772605f60)). The contract is not `AccessControlEnumerable` — `getRoleMemberCount` reverts — so holders are resolved by hashing each role string with `keccak256` and querying `hasRole(role, address)` against every known principal. Where the table diverges from the protocol documentation, the onchain result is authoritative.

| Role | Onchain Holder(s) | Description | Key Functions |
|------|-------------------|-------------|---------------|
| DEFAULT_ADMIN_ROLE (`0x0000…`) | 48h Timelock + 24h Timelock | AccessControlManager super-admin (can grant/revoke any role) | `grantRole`, `revokeRole`, `grantCall`, `revokeCall` |
| PAUSER_ROLE | **Operational Multisig (2/3)** *(docs state Admin Multisig — docs are wrong)* | Pause/resume deposits and redemptions | `StrataCDO::setActionStates`, `StrataCDO::setJrtShortfallPausePrice` |
| UPDATER_FEED_ROLE | Operational Multisig (2/3) | Trigger APR refresh and recalculation | `Accounting::onAprChanged`, `AprPairFeed::updateRoundData` |
| UPDATER_CDO_APR_ROLE | AprPairFeed contract + EOA [`0x1f3aab5b…`](https://etherscan.io/address/0x1f3aab5b7c5ea8c4ce629b14edb09d68b90a3c57) | Push APR updates into the CDO | `Accounting::onAprChanged` (internal-only path) |
| UPDATER_STRAT_CONFIG_ROLE | **48h Timelock + 24h Timelock** *(docs list 24h only)* | Update strategy risk parameters and cooldowns | `Accounting::setRiskParameters`, `sUSDeStrategy::setCooldowns` |
| RESERVE_MANAGER_ROLE | **24h Timelock only** | Redistribute reserves or withdraw to treasury | `StrataCDO::reduceReserve`, `StrataCDO::distributeReserve`, `StrataCDO::setReserveTreasury` |
| PROPOSER_CONFIG_ROLE | Admin Multisig (3/4) | Propose exit-fee configuration changes | `TwoStepConfigManager::scheduleExitFeeChange` |
| DEPOSITOR_CONFIG_ROLE | Operational Multisig (2/3) | Configure the `TrancheDepositor` accepted-token whitelist and routing | `TrancheDepositor::*` config |
| COOLDOWN_WORKER_ROLE | sUSDeStrategy + 24h Timelock + EOA [`0x99fe6bb5…`](https://etherscan.io/address/0x99fe6bb58b52d54991c0b6ef2595839e835f1a20) | Finalize cooldown unstakes on behalf of the strategy | `ERC20Cooldown`/`UnstakeCooldown` worker hooks |
| Ownable `owner()` *(not a role in ACM)* | 48h Timelock | High-level protocol configuration on Ownable contracts (StrataCDO, srUSDe, jrUSDe, Accounting, sUSDeStrategy all return 48h Timelock as `owner()`) | `Accounting::setAprPairFeed`, `setReserveBps`, `setFeeRetentionBps`, `setMinimumJrtSrtRatio[Buffer]`, `UnstakCooldown::setImplementations`, `AprPairFeed::setProvider`/`setRoundStaleAfter` |

**Multisig and timelock details:**
- **Admin Multisig** ([`0xA27cA929…`](https://etherscan.io/address/0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50)): 3-of-4 Gnosis Safe (`getThreshold() = 3`), 4 owners.
- **Operational Multisig** ([`0x4be3749a…`](https://etherscan.io/address/0x4be3749a0F6557b8fd98F3967e859DbD7C694eF4)): 2-of-3 Gnosis Safe (`getThreshold() = 2`), 3 owners. Two of its three signers also sit on the Admin Multisig — the two safes are not fully independent.
- **48h Timelock** ([`0xb2A3CF69…`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706)): `getMinDelay() = 172,800`. PROPOSER → Admin Multisig; CANCELLER → Admin Multisig + Guardian; EXECUTOR is **open** (zero-address holds the role, so anyone can execute after the delay). 74 `CallScheduled` / 74 `CallExecuted` / 0 `Cancelled` events.
- **24h Timelock** ([`0x4f2682b7…`](https://etherscan.io/address/0x4f2682b78F37910704fB1AFF29358A1da07E022d)): `getMinDelay() = 86,400`. PROPOSER → Admin Multisig; CANCELLER → Admin Multisig (Guardian is **not** assigned CANCELLER on the 24h timelock); EXECUTOR is **unset** — the executor list at deployment was empty per constructor calldata, the zero-address sentinel was never granted, and no principal has been granted since. Consequently **0 `CallScheduled` and 0 `CallExecuted` events** in the contract's ~10-month lifetime — see finding below.
- **Guardian** ([`0x277D26a4…`](https://etherscan.io/address/0x277D26a45Add5775F21256159F089769892CEa5B)): Patrick Collins (Co-Founder & CEO of Cyfrin). Externally-owned account. Holds CANCELLER_ROLE on the 48h Timelock; does **not** hold CANCELLER on the 24h Timelock and does **not** hold any role in the AccessControlManager.

**Key concerns:**
- Admin Multisig is only 3-of-4 (relatively low threshold) and Operational Multisig is only 2-of-3 (low threshold). Two signers overlap between the two safes, reducing key-set independence.
- All multisig keys held by internal team -- no external/independent signers.
- **Pause is fast and low-threshold**: Operational Multisig (2/3, internal-only) can pause the protocol immediately with no timelock. This is good for emergency response but means a 2-of-3 internal-key compromise can halt user activity. Deposits and withdrawals are currently enabled for both tranches (`actionsSrt` and `actionsJrt` both return `(true, true)`).
- **Reserve management's assigned path is inoperative**: `RESERVE_MANAGER_ROLE` sits on the 24h Timelock, which cannot execute under its current configuration. The 48h Timelock's `DEFAULT_ADMIN_ROLE` on the AccessControlManager provides a slower recovery path: it can grant or reassign `RESERVE_MANAGER_ROLE` after a 48h-delayed Admin Multisig proposal.
- **Redemption speed is a governance parameter**: `UPDATER_STRAT_CONFIG_ROLE` (both timelocks) can call `sUSDeStrategy.setCooldowns` to reimpose a cooldown of up to 7 days on senior redemptions. srUSDe's current instant-exit property is a configuration choice that a 48h-timelocked action can reverse.
- **24h Timelock is currently inoperative**: no executor was granted at deployment (verified by inspecting both `hasRole(EXECUTOR_ROLE, …)` for all principals including the zero address, and the deployment-tx constructor calldata which shows `executors = []`). Combined with the on-chain fact of 0 `CallExecuted` events since October 2025, this means `RESERVE_MANAGER_ROLE` and the 24h path of `UPDATER_STRAT_CONFIG_ROLE` cannot currently fire. For srUSDe this is largely benign because the 48h Timelock holds the same `UPDATER_STRAT_CONFIG_ROLE` and the same Ownable `owner()` powers. The 24h Timelock cannot grant itself an executor because only the timelock itself holds its admin role, but the 48h Timelock can use its separate AccessControlManager super-admin authority to reassign operational roles to a working principal.
- No onchain governance yet (planned for future).

### Programmability

- **srUSDe exchange rate**: Calculated onchain via ERC-4626 standard. Programmatic, no admin input needed
- **Yield distribution (DYS)**: Mostly programmatic. AprPairFeed fetches benchmark rate from Aave onchain. However, risk-premium parameters (x, y, k) are set by the team initially
- **APR updates**: Triggered by Operational Multisig via `updateRoundData`. This is a manual trigger for an onchain computation
- **Accounting**: Fully onchain. TVL, balances, fees, and reward distribution tracked programmatically
- **Withdrawals**: Programmatic cooldown mechanism. No manual intervention needed after initiation

### External Dependencies

| Dependency | Type | Criticality | Impact of Failure |
|------------|------|-------------|-------------------|
| **Ethena (sUSDe/USDe)** | Yield source & collateral | **Critical** | All deposited assets staked in Ethena's sUSDe vault. Ethena insolvency, USDe depegging, or sUSDe exploit would directly impact srUSDe. Senior tranche principal at risk if junior tranche is depleted |
| **Aave v3 Core** | Benchmark rate oracle | **High** | Supply-weighted average of USDC/USDT lending rates used for benchmark. The feed can use a fresh pushed round, but a provider failure could block fresh fallback calculations until governance replaces the provider |
| **Gnosis Safe** | Multisig infrastructure | **High** | All governance actions flow through Safe multisigs |
| **Monitoring stack** | Internal and third-party monitoring | **Medium** | [Security documentation](https://docs.strata.markets/technical-documentation/security) describes continuous anomaly detection and protective responses, but does not identify every current vendor or publish service-level guarantees |
| **Ethereum L1** | Settlement layer | **High** | All contracts deployed on Ethereum mainnet only |

**Key dependency risk**: For srUSDe specifically, Strata has a **single critical yield source dependency** on Ethena/sUSDe. This coupling is intentional to the product but remains a direct loss path if Ethena fails. The benchmark provider reads Aave v3 Core; [`AprPairFeed`](https://github.com/Strata-Markets/contracts/blob/tranches/contracts/tranches/oracles/AprPairFeed.sol) can use a fresh pushed round and governance can replace the provider, but there is no automatic alternate provider if the [`AaveAprPairProvider`](https://github.com/Strata-Markets/contracts/blob/tranches/contracts/tranches/strategies/ethena/AaveAprPairProvider.sol) fails.

**Note on protocol-wide surface area**: Strata now runs **six live markets** — Ethena USDe (srUSDe), Neutrl NUSD, Midas mHYPER, Midas mM1-USD, Saturn USDat (senior tranche deployed April 24, 2026), and Hastra PRIME (senior tranche deployed May 17, 2026). Each has its own CDO/Strategy/Accounting/AprPairFeed/AccessControlManager stack but shares the same multisig and timelock governance. This diversifies the protocol's yield mix away from sole reliance on Ethena, but materially increases overall protocol surface area — none of the newer markets have public audit coverage, and operational mistakes on any of them could consume incident-response bandwidth that srUSDe depends on. The shared 48h Timelock is the concrete coupling: its July 30, 2026 execution targeted the **Saturn** market's Accounting contract, showing sister-market changes use the same governance path that controls srUSDe.

## Operational Risk

- **Team Transparency**: Public contributors include [Vishvendra Singh Dhayal](https://www.linkedin.com/in/vishu0909/), publicly introduced as co-founder and CEO of Frontera Labs, the developer behind Strata, in a [May 24, 2026 podcast](https://podcasts.apple.com/gb/podcast/strata-why-defi-is-finally-ready-for-risk-tranching/id1671489227?i=1000769353134), and [Ramiro Gamen](https://www.linkedin.com/in/ramirogamen/), whom [Frontera Labs' company page](https://www.linkedin.com/company/frontera-labs-inc) lists among its employees. Patrick Collins (Cyfrin CEO) is separately identified as Guardian. Protocol documentation does not map these individuals to multisig keys or day-to-day control responsibilities
- **Documentation**: Comprehensive docs at docs.strata.markets covering mechanism, technical architecture, contracts, roles, and risks, with contract tables for all six markets. However, the [roles page](https://docs.strata.markets/technical-documentation/roles-and-permissions) remains **out-of-date with onchain state** — it claims `PAUSER_ROLE` is held by the Admin Multisig and that `UPDATER_STRAT_CONFIG_ROLE` sits only on the 24h Timelock; onchain, `PAUSER_ROLE` is held by the Operational Multisig and `UPDATER_STRAT_CONFIG_ROLE` is held by both timelocks. Yearn should treat onchain `hasRole` results as authoritative
- **Legal Structure**: **Frontera Labs, Inc.**, a Delaware (USA) corporation, operates the Interface (front-end) only. The company explicitly disclaims ownership or control of the protocol smart contracts. Protocol contracts are licensed under BUSL-1.1. A planned transition to a **Cayman Islands foundation** is referenced in the [Terms of Service](https://docs.strata.markets/resources/terms-of-service) (last updated Nov 28, 2025). US users are geo-blocked. Contact: legal@strata.markets
- **Incident Response**: Not formally documented, but the protocol has multiple layers of defense:
  - [Continuous internal and third-party onchain monitoring](https://docs.strata.markets/technical-documentation/security), with documented automatic protective responses; current vendors and service-level details are not fully disclosed
  - Guardian (Patrick Collins) can cancel timelock transactions on the 48h Timelock
  - Operational Multisig (2/3) can pause the protocol immediately (no timelock)
- **Open Source**: Contracts are public and actively developed at [`Strata-Markets/contracts`](https://github.com/Strata-Markets/contracts), with repository activity through August 4, 2026. The migration from the older `Strata-Money/contracts-tranches` repository in late February 2026 was not announced in the docs changelog, so third parties tracking the original repo would incorrectly conclude development had stopped
- **Points Program**: Strata runs a "Strata Points Program" (incentive/airdrop mechanism). Repeated TVL boom-bust cycles in Jan/Apr 2026 are consistent with points-program farming behavior

## Monitoring

### srUSDe Vault Monitoring

- **srUSDe contract**: [`0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003`](https://etherscan.io/address/0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003)
  - Monitor `convertToAssets(1e18)` for exchange rate changes (should only increase)
  - **Alert**: If exchange rate **decreases** -- indicates potential issue with yield distribution or losses
  - Monitor `Deposit`, `Withdraw` events for large deposits/withdrawals (>$1M)
  - **Alert**: Single deposits/withdrawals >$5M (potential whale activity)

### StrataCDO Monitoring

- **StrataCDO**: [`0x908B3921aaE4fC17191D382BB61020f2Ee6C0e20`](https://etherscan.io/address/0x908B3921aaE4fC17191D382BB61020f2Ee6C0e20)
  - Monitor the junior/senior NAV ratio against `Accounting.minimumJrtSrtRatio()` (5%) and `minimumJrtSrtRatioBuffer()` (6%); currently 11.23%
  - **Alert**: junior/senior ratio below 6% (senior deposits gate) and below 5% (hard coverage floor)
  - Monitor `actionsSrt()` / `actionsJrt()` for pause state and `setActionStates` calls
  - Monitor `StrataCDO.maxDeposit(srUSDe)` for senior deposit headroom; currently ~51.5M USDe

- **sUSDeStrategy redemption config**: [`0xdbf4FB6C310C1C85D0b41B5DbCA06096F2E7099F`](https://etherscan.io/address/0xdbf4FB6C310C1C85D0b41B5DbCA06096F2E7099F)
  - Monitor `sUSDeCooldownSrt()` and `CooldownsChanged` events; currently 0 (atomic sUSDe redemption)
  - **Alert**: any non-zero `sUSDeCooldownSrt` — srUSDe would cease to be instantly redeemable
  - Monitor Ethena `sUSDe.cooldownDuration()` and `CooldownDurationUpdated` events; currently 86,400s
  - **Alert**: any increase in Ethena's cooldown duration (lengthens the USDe exit path)

### Strategy Monitoring

- **sUSDeStrategy**: [`0xdbf4FB6C310C1C85D0b41B5DbCA06096F2E7099F`](https://etherscan.io/address/0xdbf4FB6C310C1C85D0b41B5DbCA06096F2E7099F)
  - Monitor sUSDe balance held by strategy
  - **Alert**: If strategy balance drops significantly relative to total deposits

### Governance Monitoring

- **Admin Multisig**: [`0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50`](https://etherscan.io/address/0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50)
  - Monitor for owner/signer changes and threshold modifications
  - **Alert**: Immediately on any signer replacement or threshold change

- **48h Timelock**: [`0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706)
  - Monitor `CallScheduled`, `CallExecuted`, `Cancelled` events
  - **Alert**: Immediately on any `CallScheduled` event (48h window to review changes)

- **24h Timelock**: [`0x4f2682b78F37910704fB1AFF29358A1da07E022d`](https://etherscan.io/address/0x4f2682b78F37910704fB1AFF29358A1da07E022d)
  - Monitor `CallScheduled`, `CallExecuted`, `Cancelled` events
  - **Alert**: On any `CallScheduled` event (24h window for strategy config changes)

### Ethena Dependency Monitoring

- **USDe peg**: Monitor USDe price on DEXes
  - **Alert**: If USDe deviates >0.5% from $1.00 peg
  - **Alert**: If USDe deviates >2% from $1.00 peg (critical -- srUSDe value directly impacted)
- **sUSDe vault**: Monitor Ethena's sUSDe vault for any anomalies, cooldown period changes

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Timelock scheduled calls (both 48h and 24h) | Real-time | Critical |
| Proxy upgrade events | Real-time | Critical |
| Multisig signer/threshold changes | Real-time | Critical |
| srUSDe exchange rate | Every 6 hours | High |
| Senior coverage ratio | Every 6 hours | High |
| USDe peg stability | Hourly | High |
| Strategy sUSDe balance | Daily | Medium |
| Protocol TVL changes | Daily | Medium |

## Risk Summary

### Key Strengths

- **Fast, unrationed exit**: senior redemptions into sUSDe settle atomically with no cooldown, and into USDe in ~1 day via Ethena. The June-July outflow of ~$49M cleared without a queue backlog or depeg, which is direct evidence the exit path works at scale
- **Structured risk tranching**: srUSDe benefits from junior tranche (jrUSDe) first-loss protection. Senior:junior asset ratio ~8.90:1; total-system collateralization ~111.2% of senior assets, above the 105% circuit breaker
- **Multi-layered governance**: 48h timelock for owner changes (74 executions, active use), two-step exit-fee changes, independent Guardian (Patrick Collins/Cyfrin) with CANCELLER role on the 48h timelock
- **Onchain transparency**: Exchange rate is programmatic (ERC-4626), accounting is fully onchain, and the codebase is open-source and actively committed to. No srUSDe-market implementation has been upgraded since February 2026. Each proxy has a dedicated ProxyAdmin, all owned by the 48h Timelock
- **Multiple reputable audits**: 8 audit engagements across Cyfrin, Quantstamp, and Guardian Audits
- **Active bug bounty**: Immunefi smart-contract program with a $250,000 maximum reward
- **Active monitoring**: continuous internal and third-party onchain monitoring with Guardian oversight

### Key Risks

- **Persistent TVL volatility**: protocol exhibits **four distinct drawdown events** (Jan, early Apr, late Apr, and Jun-Jul 2026), each shedding 19-55% of TVL within days. Current TVL ($75.8M) is ~77% below the October 2025 peak ($326.4M). The repeated boom-bust pattern, including single-day ±16-19% steps, is consistent with large-depositor and points-program concentration
- **Single critical dependency on Ethena (for srUSDe)**: All srUSDe-market funds flow into Ethena's sUSDe. An Ethena exploit or USDe depeg would directly impact srUSDe holders
- **Low multisig thresholds with overlapping signers**: Admin Multisig is 3-of-4, Operational Multisig is 2-of-3, and two of the three Operational signers also sit on the Admin Safe. All keys are internal-team-only
- **Pause is callable by a 2/3 internal-team multisig** (Operational), with no timelock
- **Redemption speed is revocable by governance**: `setCooldowns` can reimpose up to a 7-day senior cooldown via either timelock, so today's instant exit is not a durable property of the asset
- **Rapid multi-market expansion**: protocol grew from 1 market to 6 (Neutrl, Midas mHYPER, Midas mM1-USD, Saturn USDat, Hastra PRIME) between February and May 2026, with no public audits covering the new markets. Operational and governance bandwidth is now stretched across six integrations sharing one timelock
- **Thin secondary liquidity**: Pendle at $4.60M is ~7.8% of senior TVL, DEX pools total ~$99K, and Morpho srUSDe markets are empty. Exit depends almost entirely on the redemption path continuing to function
- **Intended Morpho use case has no venue**: no srUSDe/USDC market exists on Morpho Blue; the only raw srUSDe market (srUSDe/USDe) has zero supply and zero borrow

### Critical Risks

- **Junior tranche depletion**: If the junior tranche is fully depleted, the senior tranche **may incur principal losses**. jrUSDe `totalAssets` is ~$6.64M against ~$59.1M senior assets — a junior/senior ratio of 11.23% against a 5% hard floor. The junior tranche absorbs Ethena yield volatility, so a sustained period of sUSDe yield below the Aave benchmark rate drains it structurally, not just through redemptions
- **Shortfall auto-pause is largely decorative**: `jrtShortfallPausePrice` = 0.01 USDe against a junior price per share of 1.0669. The automatic deposit pause only fires after a ~99% junior collapse, so it provides no early protection
- **24h Timelock has no executor and has never executed a single call** since deployment in October 2025 — confirmed by `hasRole` queries against every known principal (including the zero-address sentinel), by the deployment-tx constructor calldata showing an empty `executors[]` array, and by zero `CallScheduled`/`CallExecuted` events. Roles that the protocol documentation routes through the 24h Timelock (RESERVE_MANAGER, UPDATER_STRAT_CONFIG, COOLDOWN_WORKER) cannot fire on that path. For srUSDe most of these functions are reachable via the 48h Timelock or other principals, but it is an unexplained governance misconfiguration that the team should address
- **Proxy upgrade risk**: Core contracts are upgradeable with 48h timelock. While the Guardian can cancel, this requires active monitoring

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Protocol audited by 3 reputable firms (Cyfrin, Quantstamp, Guardian) across 8 engagements. **PASS**
- [x] **Unverifiable reserves** -- srUSDe exchange rate is programmatic onchain (ERC-4626). Underlying sUSDe holdings verifiable onchain. **PASS**
- [x] **Total centralization** -- 3-of-4 Gnosis Safe multisig with 48h timelock and independent Guardian. Not a single EOA. **PASS**

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 audit firms (Cyfrin, Quantstamp, Guardian) across **8 engagements**. Good coverage of the srUSDe codebase; the Neutrl/Midas/Saturn/Hastra markets are **not separately audited** in publicly available reports.
- **Bug Bounty**: Active Immunefi program with a **$250,000 maximum smart-contract reward**; core Solidity directories and deployed protocol components are in scope.
- **Time in Production**: **~10 months** since official launch (October 2025). Maturing.
- **TVL**: ~$75.8M current; peaked at ~$326.4M. Four distinct sharp drawdown events on record (Jan, early Apr, late Apr, Jun-Jul 2026), giving a peak-to-current decline of ~77%.
- **Incidents**: None reported.

**Audit & Security Reviews Score: 2.0** -- Three reputable firms completed eight engagements, and the $250,000 Immunefi maximum exceeds the rubric's $200,000 threshold.

**Historical Track Record Score: 3.0** -- Approximately 10 months in production with more than $10M TVL and no reported incidents. The ~77% peak-to-current TVL decline and four sharp drawdowns prevent a stronger track-record assessment.

**Score: 2.5/5** -- `(2.0 + 3.0) / 2 = 2.5`. The live bounty improves the audit subcategory, while the young and volatile production history and unaudited market-specific code keep the combined category at 2.5.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-4 Admin Multisig with cold wallets, all internal team signers
- 2-of-3 Operational Multisig, all internal team signers; two of three owners are also Admin signers (key-set overlap)
- 48h timelock for Ownable owner-level changes (proxy upgrades, core config) — actively used, 74 executed calls
- 24h timelock for strategy config / reserve management — **inoperative**: no executor configured, zero events over ~10 months
- Independent Guardian (Patrick Collins/Cyfrin) holds CANCELLER_ROLE on the 48h Timelock only
- Pause callable by Operational Multisig (2/3, internal-team) with no timelock
- Reserve operations cannot use their assigned 24h path; the 48h Timelock can reassign `RESERVE_MANAGER_ROLE` through its AccessControlManager super-admin authority, and `treasury()` is unset
- Redemption speed (`setCooldowns`) is governance-mutable up to 7 days via either timelock
- No external/independent signers on either multisig

**Governance Score: 3.0** -- Governance is layered and demonstrably active on the 48h path, with an independent Guardian able to cancel. Against that: both multisigs are low-threshold, internal-only, and overlapping; pause needs only 2 internal keys; the 24h timelock is misconfigured; and the parameter that makes srUSDe instantly redeemable is itself timelock-mutable. Held at 3.0.

**Subcategory B: Programmability**

- srUSDe exchange rate: fully onchain ERC-4626 (`convertToAssets(1e18) = 1.028479…`)
- Yield distribution (DYS): mostly programmatic using AprPairFeed from Aave, with `roundStaleAfter()` = 14,400s (4h) staleness bound
- Risk-premium parameters (x, y, k): set by team initially, planned transition to independent risk managers (not yet implemented)
- APR updates: triggered manually by Operational Multisig (but computation is onchain)
- Accounting: fully onchain
- No srUSDe-market implementation upgraded since February 2026

**Programmability Score: 2.5** -- Unchanged. Most critical functions are onchain and programmatic; manual APR triggers and team-controlled risk parameters keep this above 2.0.

**Subcategory C: External Dependencies**

- **Critical**: Ethena sUSDe (single yield source for the srUSDe market, all funds deposited there)
- **High**: Aave v3 Core (single benchmark rate source)
- **High**: Gnosis Safe (multisig infrastructure)
- Protocol-wide exposure to **Neutrl, Midas, Saturn, and Hastra** as yield sources for sister markets — these don't affect srUSDe collateral directly but share the 48h Timelock and stretch team operational bandwidth
- AprPairFeed accepts fresh pushed rounds and its provider is governance-replaceable, but it has no automatic alternate provider; Ethena has no compatible substitute within this product

**Dependencies Score: 4.0** -- Unchanged. For srUSDe specifically, Ethena remains the single critical dependency with no fallback, and the redemption path's speed now also depends on Ethena's own cooldown setting.

**Centralization Score = (3.0 + 2.5 + 4.0) / 3 = 3.17**

**Score: 3.2/5** -- The low pause threshold, overlapping internal multisigs, 24h-timelock misconfiguration, and governance's ability to reimpose redemption cooldowns remain material. The 48h Timelock can recover reserve-role functionality through its AccessControlManager super-admin authority, but this does not materially reduce the broader governance risk under the rubric.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- srUSDe backed by sUSDe staked in Ethena's vault; sUSDeStrategy holds 53,023,275 sUSDe worth 65,862,142 USDe, which reconciles against 65,717,532 USDe of combined tranche NAV
- Over-collateralized by junior tranche (first-loss capital). Senior:Junior asset ratio ~8.90:1; total-system collateralization ~111.2% of senior assets, above the 105% circuit breaker
- Coverage enforced by `minimumJrtSrtRatio` (5%) with a 6% deposit-gating buffer; junior/senior currently 11.23%
- Automatic shortfall pause triggers only at a junior price per share of 0.01 against a current 1.0669 — effectively no early protection
- Underlying collateral is USDe (Ethena's synthetic dollar -- backed by delta-neutral ETH/BTC strategy with CEX counterparty exposure)
- Reserve mechanism: `reserveBps()` = 5e16, i.e. 5% of gains (WAD-scaled, capped at 10%). `RESERVE_MANAGER_ROLE` is held by the inoperative 24h Timelock and `treasury()` is unset; the 48h Timelock can reassign the role through the AccessControlManager

**Collateralization Score: 2.5** -- Onchain backing is verifiable and reconciles. Coverage at ~111.2% sits above the 105% breaker with a little over half the junior buffer remaining. The Ethena synthetic-dollar dependency and the structurally shrinking junior tranche remain the dominant risks.

**Subcategory B: Provability**

- Exchange rate: programmatic onchain (ERC-4626), `convertToAssets(1e18) = 1.028479213064204045`
- Strategy holdings: verifiable onchain (sUSDe balance in strategy contract)
- Accounting: fully onchain with transparent TVL tracking
- Underlying USDe collateral: relies on Ethena's proof of reserves (third-party verified)
- Risk-premium parameters: set by team, visible onchain once set

**Provability Score: 2.0** -- Unchanged.

**Funds Management Score = (2.5 + 2.0) / 2 = 2.25**

**Score: 2.25/5** -- Unchanged. Onchain provability remains strong; the Ethena dependency continues to dominate funds-management risk.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: Atomic redemption into sUSDe (no cooldown, `cooldownDisabled(sUSDe) = true`), or ~1 day into USDe via Ethena's 86,400s cooldown. Redemption capacity is the full senior position, not a rationed queue.
- **Demonstrated at scale**: ~$49M of protocol TVL exited between June 1 and July 15, 2026 with no queue backlog and no depeg.
- **DEX liquidity**: Negligible — ~$99K across 40 pools, ~$768 of 24h volume.
- **Pendle markets**: One active PT-srUSDe-22OCT2026 market with $4.60M LP liquidity, ~7.8% of senior TVL.
- **Morpho markets**: Effectively dead — srUSDe/USDe at $0 supply/$0 borrow, and no srUSDe/USDC market exists at all.
- **Withdrawal restrictions**: 6% deposit gate and 5% hard coverage floor can restrict activity under stress; `setCooldowns` can reimpose up to a 7-day senior cooldown by governance action.
- **Same-value redemption**: srUSDe redeems for USDe or sUSDe (stablecoin-denominated), minimal price-impact risk.

**Score: 2.5/5** — The primary exit path is fast rather than cooldown-gated: senior redemptions into sUSDe settle atomically, and the USDe path is ~1 day following Ethena's March 2026 cooldown reduction. For an asset whose dominant exit is redemption rather than secondary markets, that is the governing input, and the June-July outflows demonstrate it clears at scale. Secondary venues remain thin (Pendle $4.60M, DEX ~$99K, Morpho empty) and the intended Morpho collateral market does not exist, which keeps this from scoring better than 2.5, as does the fact that the instant-exit property is governance-revocable.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Publicly identified contributors include Vishvendra Singh Dhayal, co-founder and CEO of Frontera Labs, and Ramiro Gamen; Patrick Collins is separately identified as Guardian. Public documentation does not map individuals to governance keys or operational responsibilities
- **Documentation**: Comprehensive at docs.strata.markets, with contract tables for all six markets. However, the roles page is out-of-date with onchain state (PAUSER_ROLE documented as Admin Multisig but held by the Operational Multisig; UPDATER_STRAT_CONFIG_ROLE documented as 24h-only but held by both timelocks)
- **Public GitHub activity**: Active — `Strata-Markets/contracts` had repository activity through August 4, 2026. The February 2026 repository migration was unannounced, which is a discoverability rather than a transparency failure
- **Legal Structure**: Frontera Labs, Inc. (Delaware) operates the front-end. Protocol contracts are autonomous and licensed under BUSL-1.1. Planned transition to Cayman Islands foundation. US users geo-blocked
- **Incident Response**: Not formally documented. Public [security documentation](https://docs.strata.markets/technical-documentation/security) describes continuous internal and third-party onchain monitoring, automatic protective responses, Guardian veto capability, and an immediate Operational Multisig pause path. Specific current monitoring vendors and service-level details are not disclosed

**Score: 2.0/5** -- Public leadership and contributors, active development, good documentation, and an established legal entity meet the rubric's score-2 profile. Incomplete mapping of people to privileged controls, stale role documentation, and six markets shipping faster than public audit coverage prevent a score of 1.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.2 | 30% | 0.96 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.61** |

**Final Score: 2.6**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |

**Final Risk Tier: Medium Risk**

---

Strata's srUSDe is a well-designed risk-tranching product with good audit coverage from reputable firms, multi-layered governance with independent Guardian oversight, and fully onchain accounting and exchange rate computation. The junior tranche first-loss protection adds meaningful risk mitigation beyond the underlying yield source.

The protocol is ~10 months in production with no incidents, but TVL volatility continues: a fourth drawdown took TVL from $99.7M on June 1 to $50.5M on July 15, and current TVL ($75.8M) sits ~77% below the October 2025 peak. Coverage stands at ~111.2% against a 105% floor, with the junior tranche providing a little over half its gating buffer. The most consequential fact for Yearn is that the redemption path is fast — senior redemptions into sUSDe are atomic and the USDe path is ~1 day — and the June-July outflows confirm it absorbs large exits without a queue. Against that, secondary liquidity is only $4.60M on Pendle and effectively nothing elsewhere, so the redemption path is close to the only exit that matters. Critical dependencies (Ethena, Aave) are unchanged.

**For the intended Yearn use cases:**
1. **Direct srUSDe deposit**: Medium risk. Exit is fast, so the primary concerns are the Ethena dependency, the structurally shrinking junior buffer, and governance's ability to reimpose a 7-day cooldown. The repeated TVL boom-bust pattern is worth watching as a signal even though no exploits have been observed.
2. **srUSDe as Morpho collateral (srUSDe/USDC)**: Not currently actionable — no srUSDe/USDC market exists on Morpho Blue, and the only raw srUSDe market (srUSDe/USDe, 92% LLTV) has zero supply and zero borrow. If a market were created, srUSDe's stablecoin denomination and atomic sUSDe redemption would make liquidations cleaner than the previous cooldown-based assumption implied, but a new market would need to be seeded and its oracle reviewed.

**Key conditions for exposure:**
- Monitor srUSDe exchange rate for any decreases (should only increase — currently 1.028479 USDe/srUSDe)
- Monitor junior/senior NAV ratio against the 6% deposit gate and 5% hard floor (currently 11.23%)
- Monitor `sUSDeStrategy.sUSDeCooldownSrt()` and Ethena's `sUSDe.cooldownDuration()` — any increase lengthens the exit path
- Monitor 48h Timelock for any scheduled changes, including those targeting sister markets (the 24h Timelock has never fired)
- Monitor USDe peg stability
- Track TVL for concentration risk signals (large outflows)
- Verify with the team whether the 24h-timelock executor configuration is intentional or a bug requiring remediation
- Confirm with the team whether the srUSDe senior tranche's zero cooldown is a permanent design choice or a temporary setting

---

## Reassessment Triggers

- **Time-based**: Reassess in 60 days (per reassessment-scan threshold) or sooner if any of the below trigger
- **TVL-based**: Reassess if TVL changes by more than 50% (from current ~$75.8M)
- **Repository-based**: Track [`Strata-Markets/contracts`](https://github.com/Strata-Markets/contracts), not the frozen original repo; the `feat/multi-strategy-dys` branch would change the srUSDe strategy architecture if merged and deployed
- **Incident-based**: Reassess after any exploit, governance change, collateral modification, or Ethena incident
- **Dependency-based**: Reassess if Ethena modifies sUSDe mechanics, cooldown periods, or undergoes significant changes
- **Bug bounty**: Reassess if the Immunefi program's scope, status, or $250,000 maximum reward materially changes
- **Governance-based**: Reassess when onchain governance is activated, when risk-premium parameters transition to independent managers, or when the 24h-Timelock executor misconfiguration is resolved
- **Redemption-speed-based**: Reassess immediately if `sUSDeStrategy.sUSDeCooldownSrt()` becomes non-zero or Ethena raises `sUSDe.cooldownDuration()` — the Liquidity score depends directly on both
- **Coverage-based**: Reassess if the junior/senior NAV ratio falls below 6% (senior deposit gate)
- **Market expansion**: Reassess if the Neutrl/Midas/Saturn/Hastra markets receive separate audits, if a further market is launched, or if any of them experience an incident (operational spillover risk to srUSDe)
- **Pendle liquidity**: Reassess if/when new Pendle markets are created or if the PT-srUSDe-22OCT2026 market expires
- **Morpho-based**: Reassess if an srUSDe/USDC market is created on Morpho Blue, since Yearn use case #2 depends on it

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| May 19, 2026 | 2.8 | Original assessment. TVL ~$86.8M, ~73% below ATH. Three sharp drawdowns on record. 24h Timelock executor misconfiguration identified. |
| Jul 27, 2026 | 2.7 | Reassessment. TVL ~$78.1M, ~76% below ATH (fourth drawdown to $50.5M on Jul 15). Coverage 110.8%, junior/senior ratio 10.76%. Senior redemption confirmed atomic in sUSDe (`sUSDeCooldownSrt` = 0) and ~1 day in USDe after Ethena cut its cooldown to 1 day in Mar 2026 — Liquidity 3.0→2.5. Pendle liquidity $4.67M; no srUSDe/USDC Morpho market exists. Sixth market (Hastra PRIME) live. Development active at `Strata-Markets/contracts`. Roles, thresholds, timelock configs, and implementations unchanged. |
| August 5, 2026 | 2.6 | Issue #379 follow-up. Active $250K Immunefi bounty and public Frontera Labs contributors verified; Audits & Historical 3.0→2.5 and Operational 2.5→2.0. TVL ~$75.8M, coverage 111.2%, junior/senior ratio 11.23%, and Pendle liquidity $4.60M. Clarified that the 24h reserve path is inoperative but the 48h Timelock can reassign AccessControlManager roles. |
