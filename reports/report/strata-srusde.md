# Protocol Risk Assessment: Strata

- **Assessment Date:** May 19, 2026 (Updated: October 11, 2026)
- **Onchain Snapshot:** Ethereum block [26168863](https://etherscan.io/block/26168863) (October 11, 2026 11:18 UTC); DeFiLlama, Pendle, Morpho, and GeckoTerminal data fetched the same day
- **Token:** srUSDe (Senior Tranche USDe)
- **Chain:** Ethereum
- **Token Address:** [`0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003`](https://etherscan.io/address/0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003)
- **Final Score: 2.10/5.0**

## Overview + Links

Strata is a generalized risk-tranching protocol that splits yield from underlying strategies into two tokenized tranches with distinct risk-reward profiles:

- **Senior Tranche (srUSDe)**: Over-collateralized, yield-bearing synthetic dollar. Designed for capital preservation with a stable yield floored at a benchmark rate, uncapped upside participation in underlying yield, and first-loss protection from the junior tranche.
- **Junior Tranche (jrUSDe)**: Provides leveraged upside to the underlying yield, absorbing yield volatility and associated risks in exchange for potentially higher returns.

**srUSDe** is an ERC-4626 Meta Vault that accepts deposits of USDe, sUSDe, USDT, USDC, and DAI. All deposited assets are routed through the StrataCDO orchestrator into Ethena's sUSDe vault via the sUSDeStrategy. Yield is distributed between senior and junior tranches using a Dynamic Yield Split (DYS) mechanism that references:
- The underlying sUSDe APY
- A benchmark rate (supply-weighted average of USDC/USDT lending rates on Aave v3 Core)
- The relative TVL distribution between the two tranches
- Risk-premium parameters set by the team (planned to transition to independent risk managers)

The senior tranche always earns at minimum the benchmark rate (floored), with upside participation. In extreme scenarios where junior liquidity is depleted and the underlying APY is below the benchmark rate, the senior tranche simply earns the underlying APY. If the junior tranche is fully depleted, the senior tranche loses its first-loss buffer and may incur principal loss only if the underlying USDe/sUSDe position subsequently incurs a loss.

**Yield source**: Ethena's sUSDe yield (delta-neutral basis trade on ETH/BTC), redistributed via Strata's DYS mechanism.

**Key metrics (October 11, 2026):**
- Protocol TVL: ~$34.7M ([DeFiLlama](https://defillama.com/protocol/strata), aggregated across all Strata markets)
- srUSDe vault TVL (onchain): ~$17.5M USDe; jrUSDe ~$7.2M USDe (Ethena USDe market only)
- Holder concentration: Pendle's [SY-srUSDe](https://etherscan.io/address/0xc9bfebc79a722c05dc34bd2a227ef2db19fd1b8e) wrapper holds **16,080,469 srUSDe, 95.3% of supply**
- Peak TVL: ~$326.4M (October 8, 2025) — protocol is ~89% below ATH
- Chain: Ethereum canonical; a LayerZero OFT adapter bridges srUSDe to Plasma, with only 5.1 srUSDe escrowed (see [Cross-Chain Bridge](#cross-chain-bridge))
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
| srUSDe OFT Adapter | [`0x98020c586807681b577f5ee0a6444d4c22f0f45a`](https://etherscan.io/address/0x98020c586807681b577f5ee0a6444d4c22f0f45a) | LayerZero lock adapter (`StrataOFTAdapter`), Upgradeable Proxy |

### Governance & Multisig Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Admin Multisig | [`0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50`](https://etherscan.io/address/0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50) | 3-of-4 Gnosis Safe, cold wallets, internal team + founding contributors |
| Operational Multisig | [`0x4be3749a0F6557b8fd98F3967e859DbD7C694eF4`](https://etherscan.io/address/0x4be3749a0F6557b8fd98F3967e859DbD7C694eF4) | 2-of-3 Gnosis Safe, internal team |
| Timelock (48h) | [`0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706) | Proposer: Admin Multisig. Canceller: Guardian |
| Timelock (24h) | [`0x4f2682b78F37910704fB1AFF29358A1da07E022d`](https://etherscan.io/address/0x4f2682b78F37910704fB1AFF29358A1da07E022d) | Strategy config changes; no executor configured |
| Reserve Timelock (24h) | [`0x90de209907c5a4BF527A75fC16aBD639c77aaff4`](https://etherscan.io/address/0x90de209907c5a4BF527A75fC16aBD639c77aaff4) | Holds `RESERVE_MANAGER_ROLE`. Proposer/Canceller: Admin Multisig. Executor: open |
| Reserve Treasury | [`0x40c5C15Ec27526Ad769b04E767cD319551f7F4e4`](https://etherscan.io/address/0x40c5C15Ec27526Ad769b04E767cD319551f7F4e4) | 2-of-4 Gnosis Safe; receives reserve withdrawals |
| Guardian | [`0x277D26a45Add5775F21256159F089769892CEa5B`](https://etherscan.io/address/0x277D26a45Add5775F21256159F089769892CEa5B) | Patrick Collins (Cyfrin CEO) -- can cancel 48h Timelock transactions |

### Proxy Infrastructure

| Contract | ProxyAdmin |
|----------|-----------|
| srUSDe | [`0x30a17D6bcBdbf1579D6FbBA453aCf776d01fBb50`](https://etherscan.io/address/0x30a17D6bcBdbf1579D6FbBA453aCf776d01fBb50) |
| jrUSDe | [`0x89d2573471Dc0BF81c7c553fFfc1E31Ce9E75BF1`](https://etherscan.io/address/0x89d2573471Dc0BF81c7c553fFfc1E31Ce9E75BF1) |
| StrataCDO | [`0xcAb791D0D44eBaC17378fF2AF6356c012F15c9e6`](https://etherscan.io/address/0xcAb791D0D44eBaC17378fF2AF6356c012F15c9e6) |
| sUSDeStrategy | [`0x32D0D70A8dA4c0c2f354a986fD3738aFe92542f7`](https://etherscan.io/address/0x32D0D70A8dA4c0c2f354a986fD3738aFe92542f7) |
| Accounting | [`0x25A733FEBA393A48C07a76441777324B471d212E`](https://etherscan.io/address/0x25A733FEBA393A48C07a76441777324B471d212E) |
| ERC20Cooldown | [`0xeD6c7b379F73DF0618406d263b13b2386E398166`](https://etherscan.io/address/0xeD6c7b379F73DF0618406d263b13b2386E398166) |
| srUSDe OFT Adapter | [`0xda03a8cbe263da994e309ccd06fe50a0bff1d158`](https://etherscan.io/address/0xda03a8cbe263da994e309ccd06fe50a0bff1d158) |

All proxy admins are owned by the 48h Timelock ([`0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706)).

### On-Chain Verification

All core contracts are **verified on Etherscan**:

| Contract | Etherscan Name | Proxy |
|----------|---------------|-------|
| srUSDe | TransparentUpgradeableProxy → Tranche (impl [`0xe894055ca1c73648927e225f3ca38ed48e30210b`](https://etherscan.io/address/0xe894055ca1c73648927e225f3ca38ed48e30210b)) | Yes |
| jrUSDe | TransparentUpgradeableProxy → Tranche (impl [`0xe91869f96806b480dd61d57e17919068d35ac09c`](https://etherscan.io/address/0xe91869f96806b480dd61d57e17919068d35ac09c)) | Yes |
| StrataCDO | TransparentUpgradeableProxy → StrataCDO (impl [`0xb3d4f2c2123f8c3ca85ae7a6d48aa2ef049c79ba`](https://etherscan.io/address/0xb3d4f2c2123f8c3ca85ae7a6d48aa2ef049c79ba)) | Yes |
| sUSDeStrategy | TransparentUpgradeableProxy → sUSDeStrategy (impl [`0x2b9796606c8480312a572742c00f606ef4adb107`](https://etherscan.io/address/0x2b9796606c8480312a572742c00f606ef4adb107)) | Yes |
| Accounting | TransparentUpgradeableProxy → Accounting (impl [`0x5a8d34d785b5008cce9b9f4aaa0e445f6959cbff`](https://etherscan.io/address/0x5a8d34d785b5008cce9b9f4aaa0e445f6959cbff)) | Yes |
| ERC20Cooldown | TransparentUpgradeableProxy (impl [`0x73dfde427d6f9271a451dd01415c8f26e6292219`](https://etherscan.io/address/0x73dfde427d6f9271a451dd01415c8f26e6292219)) | Yes |
| srUSDe OFT Adapter | TransparentUpgradeableProxy → StrataOFTAdapter (impl [`0x883d687790d2674f690936fbf401044708310fe5`](https://etherscan.io/address/0x883d687790d2674f690936fbf401044708310fe5)) | Yes |
| AccessControlManager | AccessControlManager | No |
| Admin Multisig | GnosisSafeProxy | Yes |
| Operational Multisig | SafeProxy | Yes |
| 48h Timelock | StrataMasterChef (OZ TimelockController) | No |
| 24h Timelock | StrataMasterChef (OZ TimelockController) | No |
| Reserve Timelock (24h) | StrataMasterChef (OZ TimelockController) | No |
| Guardian | EOA with an EIP-7702 delegation to MetaMask `EIP7702StatelessDeleGator` ([`0x63c0c19a282a1b52b07dd5a65b58948a07dae32b`](https://etherscan.io/address/0x63c0c19a282a1b52b07dd5a65b58948a07dae32b)) | N/A |

**Note**: All three timelocks are registered on Etherscan as `StrataMasterChef` but contain standard OpenZeppelin TimelockController functions (`schedule`, `execute`, `cancel`, `getMinDelay`). Delays are 172,800 seconds (48h) and 86,400 seconds (both 24h timelocks). Each proxy contract has its own dedicated ProxyAdmin, all owned by the 48h Timelock.

**Upgrade history** (`Upgraded` events on each proxy): srUSDe, jrUSDe, StrataCDO, and sUSDeStrategy were last upgraded on **December 6, 2025** (block [23956716](https://etherscan.io/block/23956716)); Accounting was last upgraded on **February 23, 2026** (block [24519364](https://etherscan.io/block/24519364)). ERC20Cooldown was also last upgraded on December 6, 2025. No srUSDe-market implementation has been replaced since; the 48h Timelock's 2026 upgrade batches targeted sister-market ProxyAdmins only.

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

Strata has an active [Immunefi bug bounty](https://immunefi.com/bug-bounty/strata/information/) with a **$250,000 maximum smart-contract reward**, paid in USDC on Ethereum. The program has been live since **October 1, 2025** and was last updated September 8, 2026. Its [scope](https://immunefi.com/bug-bounty/strata/scope/) covers current and future Solidity files in the listed core-contract directories plus the cooldown, tranche-depositor, and exit-fee components; critical impacts include direct theft, permanent freezing, and protocol insolvency.

## Historical Track Record

- **Time in Production**: srUSDe proxy deployed October 2, 2025 (block [23492392](https://etherscan.io/tx/0x857c511cb166160e9b9acdb8ef47d9306ad5bcef1a311e845b4a2d4b90ea1f6b)). In production for **~12 months** as of October 11, 2026. Pre-deposit vaults with TVL existed from July 2025.
- **GitHub Repository**: Development moved repositories. The original [`Strata-Money/contracts-tranches`](https://github.com/Strata-Money/contracts-tranches) (created September 16, 2025) received its last push on **February 25, 2026** and is frozen. The current [`Strata-Markets/contracts`](https://github.com/Strata-Markets/contracts) repository, created **February 26, 2026**, is public and actively developed; its latest push was **September 22, 2026**.
- **TVL History** (DeFiLlama, protocol-wide totals):

| Period | TVL | Notes |
|--------|-----|-------|
| Jul 2025 | ~$18M | Pre-deposit vaults / soft launch |
| Aug 2025 | $18M - $53M | Steady growth |
| Sep 2025 | $53M - $172M | Rapid growth |
| **Oct 8, 2025** | **~$326M** | **Peak TVL (ATH)** |
| Oct 13, 2025 | ~$110M (srUSDe market only) | Official launch on Ethena USDe |
| Jan 8-17, 2026 | $230M → $122M | **First sharp drawdown** (~$108M outflow in ~10 days; -62.6% from peak) |
| **Apr 2-4, 2026** | **$242M → $114M** | **Second sharp drawdown** (-53% in 2 days) |
| **Apr 23-25, 2026** | **$119M → $84M** | **Third sharp drawdown** (-29% in 2 days) |
| **Jun 26, 2026** | **$83.3M → $67.6M** | **Fourth sharp drawdown** (−19% in a single day) |
| Aug 5, 2026 | ~$75.8M | Stable through late August (~$72M–$77M) |
| **Aug 29 – Sep 15, 2026** | **$77.4M → $38.6M** | **Fifth sharp drawdown** (−50% in ~17 days; steepest stretch $65.9M → $47.8M on Sep 4–8) |
| **Oct 11, 2026** | **~$34.7M** | **Current** (~89% below ATH) |

- **TVL Volatility**: The protocol has experienced **five distinct large drawdown events** (Jan, early Apr, late Apr, Jun-Jul, and Sep 2026), each shedding 19-55% of TVL within days to weeks. Peak-to-current decline is ~89%. The repeated boom-bust pattern is consistent with **large depositor concentration**. The September drawdown is directly attributable onchain: between August 26 and October 11, 2026, srUSDe emitted 520 `Withdraw` events totalling **42.1M USDe**, of which a single EOA ([`0x8b41013f5f0e23f5444d4a7927da0e567f50cdd7`](https://etherscan.io/address/0x8b41013f5f0e23f5444d4a7927da0e567f50cdd7)) withdrew **26.6M USDe (63%)** in multi-million-dollar redemptions such as [`0xc62b7e7e…`](https://etherscan.io/tx/0xc62b7e7ebd25850263704a0fd85da3a64576d948c00b490cf9a5bdb2fea8a532) (2.66M USDe, September 9). That address now holds no srUSDe. The senior tranche fell from 57.9M to 17.5M USDe over the same period while the share price kept rising.
- **Incidents**: No reported security incidents, exploits, or hacks.
- **Governance Activity**:
  - 48h Timelock: **118 `CallScheduled`**, **116 `CallExecuted`**, **0 `Cancelled`** events since deployment (event counts, not operation counts — a batched operation emits one event per call). The srUSDe-relevant operations since August 5, 2026 are: setting the srUSDe OFT adapter's Plasma peer and LayerZero delegate (executed August 17, tx [`0x4b06b564…`](https://etherscan.io/tx/0x4b06b5642dba731ec03092a183754c3c4412bac39d040964b8307fa531916dc3)); and moving `RESERVE_MANAGER_ROLE` on the srUSDe AccessControlManager from the 24h Timelock to the new Reserve Timelock (executed August 21, tx [`0x2905d731…`](https://etherscan.io/tx/0x2905d731022afe64c4439eb8051b7eafe2a677555819374e9b6266fabffc1e0f)). The other operations target sister markets: proxy upgrades on August 25 and September 28, Neutrl valuation-keeper and proof-of-reserve configuration, and disabling srNUSD senior deposits on September 19. Two operations remain scheduled but unexecuted: a provider change on sister-market AprPairFeed [`0x1695a2ff…`](https://etherscan.io/address/0x1695a2fF3e45365Ab4111d2E1083B2A143b4D171) scheduled September 19, and a [SaturnStrategy](https://etherscan.io/address/0xce7B00D1004d9ED22E702A6a7F5bBdcE7297B090) upgrade scheduled October 7. Neither targets srUSDe.
  - 24h Timelock: 0 `CallScheduled` and 0 `CallExecuted` events since deployment in October 2025.
  - Reserve Timelock (deployed August 12, 2026): executed one batch on August 25 (tx [`0x7045a200…`](https://etherscan.io/tx/0x7045a2008376252c2bf9068531d2688f8a8eb5e4cf3783672072bbc28d9254b7)). The batch set every market's reserve treasury to the 2-of-4 Treasury Safe and withdrew accumulated reserves. For srUSDe this was **118,844 sUSDe** (~148.9K USDe). A second srUSDe `reduceReserve` of **16,164 sUSDe** (~20.2K USDe) was scheduled on October 8 (tx [`0x678c89f8…`](https://etherscan.io/tx/0x678c89f8b3f8343212ddc68393538cbaf44f0a9c509ea495da6f20701ee31c83)) and is executable but not yet executed.
- **Exchange Rate and Tranche Sizes** (block [26168863](https://etherscan.io/block/26168863)):
  - srUSDe `convertToAssets(1e18)` = **1.035735167729589148 USDe per srUSDe**
  - srUSDe `totalAssets()` = **17,484,280 USDe**; `totalSupply()` = **16,881,034 srUSDe**
  - jrUSDe `totalAssets()` = **7,176,346 USDe**; `totalSupply()` = **6,635,582 jrUSDe** (price per share 1.0815)
  - Senior:Junior asset ratio **~2.44:1**; system collateralization **~141.0%** of senior assets — well above the 105% circuit breaker
  - Exchange-rate growth of +0.71% over the 67 days from August 5 annualizes to **~3.9%**. Weekly samples across the September outflows show the senior and junior share prices rising monotonically

## Funds Management

### Deposit/Withdrawal Flow

**Deposit**: Users deposit USDe (or sUSDe, USDT, USDC, DAI) into the srUSDe Meta Vault. Deposited assets are exchanged for shares proportional to the current exchange rate and passed to the sUSDeStrategy, which stakes them into Ethena's sUSDe vault.

**Entry-asset distinction**: A USDe holder entering srUSDe adds Strata's smart-contract and tranching risk on top of an existing USDe position. A USDC or other stablecoin holder entering srUSDe, whether by swapping first or through the vault's multi-token route, additionally takes Ethena/USDe risk before taking Strata risk. The junior tranche protects the srUSDe position after entry; it does not make USDe equivalent to the depositor's original stablecoin. This is a strategy and portfolio-allocation consideration, not an additional Strata protocol risk.

**Withdrawal**: The redemption path depends on the token the user exits into. `sUSDeStrategy.getSupportedTokens()` returns sUSDe and USDe.

1. **Exit in sUSDe — atomic, no cooldown.** `sUSDeStrategy.withdraw` routes to `ERC20Cooldown.transfer(..., cooldownSeconds)` where `cooldownSeconds` is `sUSDeCooldownSrt` for the senior tranche. Both `sUSDeCooldownSrt()` and `sUSDeCooldownJrt()` read **0**, and `ERC20Cooldown.cooldownDisabled(sUSDe)` reads **true**. In the contract, `cooldownSeconds == 0` takes an early-return branch that performs an immediate `safeTransferFrom` and emits `Finalized` in the same transaction. The senior tranche has been configured this way since deployment (October 2, 2025); the junior tranche's 7-day cooldown was zeroed on December 11, 2025 (tx [`0xb887bdbf…`](https://etherscan.io/tx/0xb887bdbfaeaf4090622c3ea0b4cd9708bfda2357106102407e0e7b2902fe6643)). 173 `Finalized` events between blocks 25,500,000 and 25,689,464 confirm redemptions settling in one transaction in practice, and the 42.1M USDe of senior withdrawals from August 26 to October 11, 2026 cleared without a queue.
2. **Exit in USDe — ~1 day.** Routes through `UnstakeCooldown`, which triggers Ethena's own sUSDe cooldown. Ethena reduced `sUSDe.cooldownDuration()` from 604,800 seconds (7 days) to **86,400 seconds (1 day)** on March 16, 2026 (tx [`0x05856199…`](https://etherscan.io/tx/0x05856199ceddbfb1b8231c8bfa3bf4c967e5156122b2f1eb11a473fdf5f2d9f9)).
3. Each withdrawal request is handled independently per user; new requests do not extend or affect earlier requests.

The senior tranche's zero cooldown is a **governance-mutable parameter**, not a structural property: `sUSDeStrategy.setCooldowns` is callable by `UPDATER_STRAT_CONFIG_ROLE` (48h and 24h Timelocks) and can reinstate a cooldown up to a hard-coded 7-day maximum. A 48h-timelocked action can therefore convert srUSDe from an instantly redeemable position into a 7-day-locked one.

### Accessibility

- **Deposits**: Permissionless. Anyone can deposit USDe, sUSDe, USDT, USDC, or DAI
- **Redemptions**: Permissionless. Atomic when exiting in sUSDe; ~1 day when exiting in USDe via Ethena's unstaking cooldown
- **Deposit limit**: `StrataCDO.maxDeposit(srUSDe)` = **~102.1M USDe** of remaining senior headroom. This is not a fixed cap — it is derived from `minimumJrtSrtRatioBuffer` (6%), so senior capacity is `jrtNav / 0.06` minus current senior NAV and shrinks as the junior tranche shrinks. `maxDeposit(jrUSDe)` is unbounded
- **Fees**: Exit fees are onchain: `exitFeeSrt()` = 2.5e14 (**0.025%**) for senior and `exitFeeJrt()` = 1e15 (**0.1%**) for junior. Exit-fee changes are governed by a two-step process via TwoStepConfigManager

### Collateralization

- **Backing**: srUSDe is backed by the underlying USDe/sUSDe staked in Ethena's vault, with additional over-collateralization from the junior tranche (jrUSDe) which serves as first-loss capital. sUSDeStrategy holds **19,705,811 sUSDe**, worth **24,681,597 USDe** per `sUSDeStrategy.totalAssets()`. This reconciles against the tranches: 17,484,280 senior + 7,176,346 junior = 24,660,626 USDe of tranche NAV, with the ~21.0K remainder matching `Accounting.reserveNav()` = 20,940 USDe
- **Senior coverage ratio**: **~141.0%** (senior + junior assets / senior assets). The circuit breaker is enforced by `Accounting.minimumJrtSrtRatio()` = 5e16, i.e. junior NAV must stay ≥ **5%** of senior NAV, equivalent to a 105% coverage floor. A separate `minimumJrtSrtRatioBuffer()` = 6e16 (6%) gates new senior deposits ahead of the hard floor. Current junior/senior ratio is **41.04%**, roughly 8× the hard floor. The ratio rose because senior capital left while junior capital stayed; jrUSDe holders can withdraw up to `maxWithdraw(jrUSDe)` = 6,301,917 USDe before the floor binds, so the buffer remains flow-dependent
- **Underlying collateral**: USDe is Ethena's synthetic dollar backed by a delta-neutral strategy (ETH/BTC spot + short perpetual futures). Ethena maintains proof of reserves via third-party verification
- **Risk hierarchy**: Senior tranche (srUSDe) is paid first in the base asset, while the junior tranche absorbs losses before senior holders. Once junior capital is depleted, senior holders are exposed to any subsequent loss in the underlying USDe/sUSDe position
- **Automatic shortfall pause**: `StrataCDO.jrtShortfallPausePrice()` = 1e16, so deposits to both tranches auto-pause only once the junior price per share reaches **0.01 USDe**. This is a terminal backstop, not an early-warning control: the 5% `minimumJrtSrtRatio` floor and 6% senior-deposit gate are the operative tranche-protection controls
- **Reserve mechanism**: `Accounting.reserveBps()` = **5e16**, which in this contract is WAD-scaled (`PERCENTAGE_100 = 1e18`), so **5%** — applied to *gains*, not to TVL, and hard-capped at `RESERVE_BPS_MAX = 0.1e18` (10%). `RESERVE_MANAGER_ROLE` is held only by the Reserve Timelock (24h, Admin Multisig proposer, open executor). `StrataCDO.treasury()` is the 2-of-4 [Treasury Safe](https://etherscan.io/address/0x40c5C15Ec27526Ad769b04E767cD319551f7F4e4). [`StrataCDO.reduceReserve`](https://etherscan.io/address/0xb3d4f2c2123f8c3ca85ae7a6d48aa2ef049c79ba#code) calls `accounting.reduceReserve`, which reverts if the requested amount exceeds the accrued reserve, so this path cannot reach tranche principal. `reserveNav()` is 20,940 USDe after the August 25 sweep

### Provability

- **Exchange rate**: Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Anyone can verify
- **Underlying sUSDe balance**: Verifiable onchain by checking the strategy's sUSDe holdings
- **Yield calculation**: DYS mechanism computes yields onchain using the AprPairFeed contract. Benchmark rate sourced from Aave v3 Core. However, risk-premium parameters (x, y, k) are set by the team
- **Accounting**: Onchain Accounting contract tracks raw TVL, balances, inflows/outflows, fees, and reward distribution for both tranches

## Liquidity Risk

### Primary Exit Mechanisms

1. **Redeem from srUSDe vault into sUSDe**: **Atomic** — no Strata cooldown and no Ethena unstaking, settled in a single transaction. This is the deepest and fastest exit, and it inherits sUSDe's own liquidity
2. **Redeem from srUSDe vault into USDe**: ~**1 day**, gated by Ethena's `cooldownDuration()` of 86,400 seconds
3. **DEX swap**: Negligible onchain DEX liquidity — **~$70.1K** of pool reserves with **~$20 of 24h volume** ([GeckoTerminal](https://www.geckoterminal.com/eth/tokens/0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003)). Largest is a Uniswap V4 srUSDe/USDe 1.01% pool at ~$45.5K. **No Curve or Balancer pools exist.** CoinGecko does not list srUSDe
4. **Pendle markets**: Two srUSDe markets are active. PT-srUSDe-22OCT2026 ([market `0x66ec657c…`](https://etherscan.io/address/0x66ec657c59cdcaf171ab43b83da3942758bf8a97), [PT `0x59bc9fae…`](https://etherscan.io/address/0x59bc9fae5d62b19d4f8d07d758047acb9ee19d34)) has **$3.68M LP liquidity** at a 5.66% implied APY ([Pendle API](https://api-v2.pendle.finance/core/v1/1/markets/0x66ec657c59cdcaf171ab43b83da3942758bf8a97)) and **expires October 22, 2026**. Its successor, PT-srUSDe-25FEB2027 ([market `0xb7c7eafa…`](https://etherscan.io/address/0xb7c7eafa97c0a2322c977576b88e71e6b8e8242d), [PT `0xd2e5a246…`](https://etherscan.io/address/0xd2e5a2467552a8df873177c02fc6fde4720d1bf1)), holds only **$54.4K** ([Pendle API](https://api-v2.pendle.finance/core/v1/1/markets/0xb7c7eafa97c0a2322c977576b88e71e6b8e8242d)). Parallel jrUSDe markets hold $0.72M ([`0x78f6927a…`](https://etherscan.io/address/0x78f6927ab0600c445178645f3c64afec85f6dd8a), 22OCT2026) and $34.5K ([`0x64c809c6…`](https://etherscan.io/address/0x64c809c69d8881341afe7d67c559a048ddd9d129), 25FEB2027). These markets trade the fixed-yield PT, not raw srUSDe. Pendle is nonetheless where srUSDe sits: the [SY-srUSDe](https://etherscan.io/address/0xc9bfebc79a722c05dc34bd2a227ef2db19fd1b8e) wrapper holds 95.3% of srUSDe supply
5. **Morpho markets**: The raw srUSDe/USDe market ([`0xc184c2aa…`](https://app.morpho.org/ethereum/market/0xc184c2aafb37a571454213746023b2f9fc16d37ce017729a96f19feea60677d1)) has **$0 supply and $0 borrow**. Neither live PT-srUSDe token is listed as Morpho collateral. **No srUSDe/USDC market exists on Morpho** — see the note on Yearn use case #2 below

### Withdrawal Restrictions

- **Cooldown period**: None for sUSDe redemptions; ~1 day for USDe redemptions. Both are governance-mutable — `setCooldowns` can reimpose up to 7 days on the Strata side, and Ethena independently controls its own `cooldownDuration`
- **Coverage protection binds junior, not senior**: `Accounting.maxWithdraw` caps *junior* redemptions so junior NAV cannot fall below 5% of senior, and the 6% buffer gates new *senior deposits*. Neither restricts senior redemptions — `maxWithdraw(srUSDe)` returns the full `srtNav`
- **Pause is the real restriction**: `StrataCDO.maxWithdraw` returns 0 whenever `actionsSrt.isWithdrawEnabled` is false, and `setActionStates` is callable instantly by the 2-of-3 Operational Multisig with no timelock
- **Self-balancing**: The coverage mechanism is designed to be self-balancing -- thinner junior coverage attracts more liquidity via higher junior yields

### Liquidity Assessment

- **Primary liquidity**: The redemption path is the main exit and it is fast — atomic in sUSDe, ~1 day in USDe. For a $17.5M senior tranche sitting on $24.7M of strategy assets, redemption capacity is effectively the full position rather than a rationed queue
- **Secondary market**: Secondary venues are thin. Pendle's expiring market at $3.68M covers ~21% of senior TVL, and its February 2027 successor holds only $54.4K; DEX pools at ~$70.1K are immaterial; Morpho srUSDe markets are empty
- **Large holder impact**: Large holders can exit at scale through redemption. The June-July outflows (~$49M of protocol TVL) and the September outflows (42.1M USDe of senior withdrawals, 26.6M of it from one address) both cleared without a queue backlog or a depeg
- **Holder concentration**: 95.3% of srUSDe supply sits in Pendle's SY-srUSDe wrapper, so remaining senior capital is overwhelmingly PT/YT-linked. The October 22, 2026 PT maturity can trigger a further large redemption wave. That wave reduces protocol scale but does not dilute remaining senior holders, who redeem at NAV
- **Same-value redemption**: srUSDe redeems for USDe or sUSDe (both stablecoin-denominated), so price-impact risk on exit is minimal
- **Note on Yearn use case #2**: the intended "srUSDe as collateral on Morpho for srUSDe/USDC markets" does not currently exist onchain. The only raw srUSDe market on Morpho Blue is srUSDe/USDe at 91.5% LLTV with zero supply and zero borrow. Using srUSDe as Morpho collateral would require a new market to be created and seeded

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
| RESERVE_MANAGER_ROLE | **Reserve Timelock (24h) only** *(docs list the original 24h Timelock)* | Redistribute reserves or withdraw to treasury, bounded by accrued reserve | `StrataCDO::reduceReserve`, `StrataCDO::distributeReserve`, `StrataCDO::setReserveTreasury` |
| PROPOSER_CONFIG_ROLE | Admin Multisig (3/4) | Propose exit-fee configuration changes | `TwoStepConfigManager::scheduleExitFeeChange` |
| DEPOSITOR_CONFIG_ROLE | Operational Multisig (2/3) | Configure the `TrancheDepositor` accepted-token whitelist and routing | `TrancheDepositor::*` config |
| COOLDOWN_WORKER_ROLE | sUSDeStrategy + 24h Timelock + EOA [`0x99fe6bb5…`](https://etherscan.io/address/0x99fe6bb58b52d54991c0b6ef2595839e835f1a20) | Finalize cooldown unstakes on behalf of the strategy | `ERC20Cooldown`/`UnstakeCooldown` worker hooks |
| Ownable `owner()` *(not a role in ACM)* | 48h Timelock | High-level protocol configuration on Ownable contracts (StrataCDO, srUSDe, jrUSDe, Accounting, sUSDeStrategy, and the srUSDe OFT Adapter all return 48h Timelock as `owner()`) | `Accounting::setAprPairFeed`, `setReserveBps`, `setFeeRetentionBps`, `setMinimumJrtSrtRatio[Buffer]`, `UnstakCooldown::setImplementations`, `AprPairFeed::setProvider`/`setRoundStaleAfter` |

**Multisig and timelock details:**
- **Admin Multisig** ([`0xA27cA929…`](https://etherscan.io/address/0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50)): 3-of-4 Gnosis Safe (`getThreshold() = 3`), 4 owners.
- **Operational Multisig** ([`0x4be3749a…`](https://etherscan.io/address/0x4be3749a0F6557b8fd98F3967e859DbD7C694eF4)): 2-of-3 Gnosis Safe (`getThreshold() = 2`), 3 owners. Two of its three signers also sit on the Admin Multisig — the two safes are not fully independent.
- **48h Timelock** ([`0xb2A3CF69…`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706)): `getMinDelay() = 172,800`. PROPOSER → Admin Multisig; CANCELLER → Admin Multisig + Guardian; EXECUTOR is **open** (zero-address holds the role, so anyone can execute after the delay). 118 `CallScheduled` / 116 `CallExecuted` / 0 `Cancelled` events.
- **24h Timelock** ([`0x4f2682b7…`](https://etherscan.io/address/0x4f2682b78F37910704fB1AFF29358A1da07E022d)): `getMinDelay() = 86,400`. PROPOSER → Admin Multisig; CANCELLER → Admin Multisig (Guardian is **not** assigned CANCELLER on the 24h timelock); EXECUTOR is **unset** — the executor list at deployment was empty per constructor calldata, the zero-address sentinel was never granted, and no principal has been granted since. Consequently **0 `CallScheduled` and 0 `CallExecuted` events** in the contract's ~12-month lifetime — see finding below.
- **Reserve Timelock** ([`0x90de2099…`](https://etherscan.io/address/0x90de209907c5a4BF527A75fC16aBD639c77aaff4)): deployed August 12, 2026 (tx [`0xf9b14a51…`](https://etherscan.io/tx/0xf9b14a51adaa8b6c851fdbcb62e1399cbd7009c44b3db86e134f50dcd5bd56a3)). `getMinDelay() = 86,400`. PROPOSER and CANCELLER → Admin Multisig; EXECUTOR is **open**. The timelock is its own `DEFAULT_ADMIN_ROLE` holder, and the Guardian is **not** a canceller. It holds `RESERVE_MANAGER_ROLE` on srUSDe and the sister markets and is the srUSDe OFT adapter's LayerZero endpoint delegate, which can change that adapter's DVN and library configuration.
- **Reserve Treasury** ([`0x40c5C15E…`](https://etherscan.io/address/0x40c5C15Ec27526Ad769b04E767cD319551f7F4e4)): 2-of-4 Gnosis Safe (`getThreshold() = 2`), 4 owners with no overlap with the Admin Multisig. It receives reserve withdrawals only.
- **Guardian** ([`0x277D26a4…`](https://etherscan.io/address/0x277D26a45Add5775F21256159F089769892CEa5B)): Patrick Collins (Co-Founder & CEO of Cyfrin). Externally-owned account with an EIP-7702 delegation to MetaMask's `EIP7702StatelessDeleGator`, already in place at the August 5, 2026 snapshot. Holds CANCELLER_ROLE on the 48h Timelock; does **not** hold CANCELLER on the 24h Timelock and does **not** hold any role in the AccessControlManager.

**Key concerns:**
- Admin Multisig is only 3-of-4 (relatively low threshold) and Operational Multisig is only 2-of-3 (low threshold). Two signers overlap between the two safes, reducing key-set independence.
- All multisig keys held by internal team -- no external/independent signers.
- **Pause is fast and low-threshold**: Operational Multisig (2/3, internal-only) can pause the protocol immediately with no timelock. This is good for emergency response but means a 2-of-3 internal-key compromise can halt user activity. Deposits and withdrawals are currently enabled for both tranches (`actionsSrt` and `actionsJrt` both return `(true, true)`).
- **Reserve management runs on a 24h route without Guardian veto**: `RESERVE_MANAGER_ROLE` sits on the Reserve Timelock, where only the Admin Multisig can cancel. A compromised Admin Multisig could redirect `treasury` and sweep accrued reserve after 24h, but the accounting check limits that path to reserve (20,940 USDe today), not tranche principal.
- **LayerZero delegate sits on the Reserve Timelock**: the srUSDe OFT adapter's endpoint delegate can change its DVN and library configuration through the 24h Reserve Timelock rather than the 48h Timelock. The adapter escrows only 5.1 srUSDe, so the current blast radius is negligible.
- **Redemption speed is a governance parameter**: `UPDATER_STRAT_CONFIG_ROLE` (both timelocks) can call `sUSDeStrategy.setCooldowns` to reimpose a cooldown of up to 7 days on senior redemptions. srUSDe's current instant-exit property is a configuration choice that a 48h-timelocked action can reverse.
- **24h Timelock route is not configured for execution**: no executor was granted at deployment (verified by inspecting both `hasRole(EXECUTOR_ROLE, …)` for all principals including the zero address, and the deployment-tx constructor calldata which shows `executors = []`). Consequently, the 24h route for `UPDATER_STRAT_CONFIG_ROLE` is unavailable; reserve management moved to the separately deployed Reserve Timelock on August 21, 2026. For srUSDe, this is an operational and documentation gap rather than a direct fund-safety issue: the working 48h Timelock holds the same `UPDATER_STRAT_CONFIG_ROLE` and the relevant Ownable powers, and can reassign operational roles through its AccessControlManager super-admin authority.
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
| **Ethena (sUSDe/USDe)** | Yield source & collateral | Core underlying exposure | All deposited assets staked in Ethena's sUSDe vault. An Ethena insolvency, USDe depegging, or sUSDe exploit would be reflected in srUSDe; junior capital absorbs losses first |
| **Aave v3 Core** | Benchmark rate oracle | **High** | Supply-weighted average of USDC/USDT lending rates used for benchmark. While the pushed round is stale, a failed provider read reverts APR-dependent deposit and redemption accounting until an authorized fresh push or provider replacement |
| **Monitoring stack** | Internal and third-party monitoring | **Medium** | [Security documentation](https://docs.strata.markets/technical-documentation/security) describes continuous anomaly detection and protective responses, but does not identify every current vendor or publish service-level guarantees |

**Underlying exposure**: srUSDe is intentionally a tranche over Ethena's sUSDe. All senior assets sit in sUSDe, so an Ethena insolvency, USDe depeg, or sUSDe exploit would be reflected in srUSDe after junior capital absorbs losses first. This is the product's underlying asset exposure, not a separate protocol-specific critical finding.

**Benchmark rate path**: [`AprPairFeed`](https://github.com/Strata-Markets/contracts/blob/tranches/contracts/tranches/oracles/AprPairFeed.sol) prefers a pushed round (`sourcePref = Feed`) but falls back to reading the provider live once a round is older than `roundStaleAfter()` = 14,400s (4h). The last pushed round dates to **May 7, 2026** (block [25046007](https://etherscan.io/block/25046007)), roughly 157 days stale, so the operative path today is a **live read of [`AaveAprPairProvider`](https://github.com/Strata-Markets/contracts/blob/tranches/contracts/tranches/strategies/ethena/AaveAprPairProvider.sol)**, which returns a current timestamp on every call. There is no automatic alternate provider. Because [`Accounting.updateBalanceFlow()`](https://github.com/Strata-Markets/contracts/blob/tranches/contracts/tranches/Accounting.sol) fetches APRs after deposits and redemptions, a failed live Aave read can revert those transactions until the Operational Multisig supplies a fresh pushed round or governance replaces the provider. No principal is deposited into Aave.

**Shared governance with sister markets**: Strata runs six live markets, each with its own CDO/Strategy/Accounting stack but sharing srUSDe's multisigs and timelocks. Only one aspect of this is an srUSDe risk — the shared 48h Timelock queue. Since August 5, 2026 that queue has carried sister-market proxy upgrades, Neutrl valuation and proof-of-reserve configuration, and the September 19 suspension of srNUSD senior deposits. Those changes flow through the same governance path that can upgrade srUSDe, so reviewers monitoring that timelock must triage operations that have nothing to do with this token. The sister markets are not srUSDe dependencies and their yield sources create no exposure for srUSDe holders.

### Cross-Chain Bridge

srUSDe is bridged to Plasma through a LayerZero **lock** adapter. [`StrataOFTAdapter` `0x98020c58…`](https://etherscan.io/address/0x98020c586807681b577f5ee0a6444d4c22f0f45a) was deployed July 31, 2026 (tx [`0xbbafd6bb…`](https://etherscan.io/tx/0xbbafd6bb761c381cb5786c1da56d97f1b6e8a81d090fd11cea06ff83c743b448)). Its `token()` is srUSDe, `approvalRequired()` is true, and its endpoint is LayerZero `EndpointV2` [`0x1a440760…`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c).

- **Exposure**: the adapter escrows **5.1 srUSDe**, matching the combined supply of two Plasma OFTs. The current Plasma OFT [`0xa651b760…`](https://plasmascan.to/address/0xa651b7605350386e37b11e85c9cb5e85702072b0) has a `totalSupply()` of **0.1 srUSDe**. The original Plasma OFT [`0x6d7198b1…`](https://plasmascan.to/address/0x6d7198b1795fa2078cc81ca60b888a07799223fd) still holds **5.0 srUSDe**. That OFT still peers to the Ethereum adapter, but the adapter's Plasma peer was switched away from it on August 17, 2026. As a result, those 5.0 srUSDe of Plasma claims cannot bridge back unless governance restores the peer. The adapter cannot mint Ethereum srUSDe, so a forged inbound message could release at most the escrowed balance.
- **Security**: both the Ethereum receive route (Plasma→Ethereum, escrow release) and the Plasma receive route (Ethereum→Plasma) require a **4-of-4 DVN quorum**: LayerZero Labs, Canary, Nethermind, and Horizen, with 15 confirmations.
- **Control**: the adapter's `owner()` and ProxyAdmin owner are the 48h Timelock. Its endpoint delegate is the 24h Reserve Timelock.
- **Plasma-side control**: the Plasma OFT's `owner()` and its ProxyAdmin [`0xd33f67c5…`](https://plasmascan.to/address/0xd33f67c5219959ed659c7a93beff197298a7cb6a) owner are a Plasma 48h timelock, [`0xa62b2040…`](https://plasmascan.to/address/0xa62b204099277762d1669d283732dcc1b3aa96ce) (`getMinDelay() = 172,800`). That timelock is self-administered, has an open executor, and uses the Admin Safe address as proposer and canceller. The Plasma endpoint delegate is a 24h timelock, [`0x1516d031…`](https://plasmascan.to/address/0x1516d031CcaE6c73f4cC106474Ae87628a403660), with the same proposer, canceller, and open-executor configuration. On Plasma, the Admin Safe address is a separate 3-of-4 Safe. Only two of its four signers also sign the Ethereum Admin Safe. Plasma state was read through a public Plasma RPC (`rpc.plasma.to`) on October 11, 2026.
- jrUSDe has a parallel adapter, [`0x6ca9cb9b…`](https://etherscan.io/address/0x6ca9cb9b1e5f6ee6e3787e1d7b640584b152a6cd), which is outside srUSDe's exposure.

## Operational Risk

- **Team Transparency**: **Vishvendra Singh Dhayal** was introduced as co-founder and CEO of Frontera Labs, the developer behind Strata, in a May 24, 2026 podcast ([LinkedIn](https://www.linkedin.com/in/vishu0909/)). **Ramiro Gamen** ([LinkedIn](https://www.linkedin.com/in/ramirogamen/)) appears among the employees listed on [Frontera Labs' company page](https://www.linkedin.com/company/frontera-labs-inc) — a self-published source, so weaker evidence than the podcast. Patrick Collins (Cyfrin CEO) is separately identified as Guardian. Protocol documentation does not map any of these individuals to multisig keys or day-to-day control responsibilities
- **Documentation**: Comprehensive docs at docs.strata.markets covering mechanism, technical architecture, contracts, roles, and risks, with contract tables for all six markets. However, the [roles page](https://docs.strata.markets/technical-documentation/roles-and-permissions) remains **out-of-date with onchain state**. It assigns `PAUSER_ROLE` to the Admin Multisig, `UPDATER_STRAT_CONFIG_ROLE` only to the 24h Timelock, and `RESERVE_MANAGER_ROLE` to the 24h Timelock, and it does not mention the Reserve Timelock, the Treasury Safe, or the OFT adapter. Onchain, `PAUSER_ROLE` is held by the Operational Multisig, `UPDATER_STRAT_CONFIG_ROLE` by both timelocks, and `RESERVE_MANAGER_ROLE` by the Reserve Timelock. Yearn should treat onchain `hasRole` results as authoritative
- **Legal Structure**: **Frontera Labs, Inc.**, a Delaware (USA) corporation, operates the Interface (front-end) only. The company explicitly disclaims ownership or control of the protocol smart contracts. Protocol contracts are licensed under BUSL-1.1. A planned transition to a **Cayman Islands foundation** is referenced in the [Terms of Service](https://docs.strata.markets/resources/terms-of-service) (last updated Nov 28, 2025). US users are geo-blocked. Contact: legal@strata.markets
- **Incident Response**: Not formally documented, but the protocol has multiple layers of defense:
  - [Continuous internal and third-party onchain monitoring](https://docs.strata.markets/technical-documentation/security), with documented automatic protective responses; current vendors and service-level details are not fully disclosed
  - Guardian (Patrick Collins) can cancel timelock transactions on the 48h Timelock
  - Operational Multisig (2/3) can pause the protocol immediately (no timelock)
- **Open Source**: Contracts are public and actively developed at [`Strata-Markets/contracts`](https://github.com/Strata-Markets/contracts), with repository activity through September 22, 2026. The migration from the older `Strata-Money/contracts-tranches` repository in late February 2026 was not announced in the docs changelog, so third parties tracking the original repo would incorrectly conclude development had stopped
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
  - Monitor the junior/senior NAV ratio against `Accounting.minimumJrtSrtRatio()` (5%) and `minimumJrtSrtRatioBuffer()` (6%); currently 41.04%
  - **Alert**: junior/senior ratio below 6% (senior deposits gate) and below 5% (hard coverage floor)
  - Monitor `actionsSrt()` / `actionsJrt()` for pause state and `setActionStates` calls
  - Monitor `StrataCDO.maxDeposit(srUSDe)` for senior deposit headroom; currently ~102.1M USDe
  - Monitor `ReserveReduced` and `TreasurySet` events; `treasury()` is currently the 2-of-4 Treasury Safe

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

- **Reserve Timelock (24h)**: [`0x90de209907c5a4BF527A75fC16aBD639c77aaff4`](https://etherscan.io/address/0x90de209907c5a4BF527A75fC16aBD639c77aaff4)
  - Monitor `CallScheduled`, `CallExecuted`, `Cancelled` events
  - **Alert**: On any `CallScheduled` that calls `setReserveTreasury`, changes the srUSDe OFT adapter's endpoint configuration, or grants roles

- **srUSDe OFT Adapter**: [`0x98020c586807681b577f5ee0a6444d4c22f0f45a`](https://etherscan.io/address/0x98020c586807681b577f5ee0a6444d4c22f0f45a)
  - Monitor escrowed `srUSDe.balanceOf(adapter)` (currently 5.1 srUSDe), `PeerSet`, and endpoint `UlnConfigSet` events
  - **Alert**: escrow above $1M, or a DVN quorum reduction below 4-of-4

- **Pendle concentration**: [SY-srUSDe](https://etherscan.io/address/0xc9bfebc79a722c05dc34bd2a227ef2db19fd1b8e) balance (currently 95.3% of supply)
  - **Alert**: large SY redemptions around the October 22, 2026 PT maturity

### Ethena Dependency Monitoring

- **USDe peg**: Monitor USDe price on DEXes
  - **Alert**: If USDe deviates >0.5% from $1.00 peg
  - **Alert**: If USDe deviates >2% from $1.00 peg (critical -- srUSDe value directly impacted)
- **sUSDe vault**: Monitor Ethena's sUSDe vault for any anomalies, cooldown period changes

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Timelock scheduled calls (48h, 24h, and Reserve) | Real-time | Critical |
| Proxy upgrade events | Real-time | Critical |
| Multisig signer/threshold changes | Real-time | Critical |
| srUSDe exchange rate | Every 6 hours | High |
| Senior coverage ratio | Every 6 hours | High |
| USDe peg stability | Hourly | High |
| Strategy sUSDe balance | Daily | Medium |
| Protocol TVL changes | Daily | Medium |

## Risk Summary

### Key Strengths

- **Fast, unrationed exit**: senior redemptions into sUSDe settle atomically with no cooldown, and into USDe in ~1 day via Ethena. The June-July outflow of ~$49M and the September senior outflow of 42.1M USDe both cleared without a queue backlog or depeg, which is direct evidence the exit path works at scale
- **Structured risk tranching**: srUSDe benefits from junior tranche (jrUSDe) first-loss protection. Senior:junior asset ratio ~2.44:1; total-system collateralization ~141.0% of senior assets, well above the 105% circuit breaker
- **Multi-layered governance**: 48h timelock for owner changes (116 execution events, active use), two-step exit-fee changes, independent Guardian (Patrick Collins/Cyfrin) with CANCELLER role on the 48h timelock
- **Onchain transparency**: Exchange rate is programmatic (ERC-4626), accounting is fully onchain, and the codebase is open-source and actively committed to. No srUSDe-market implementation has been upgraded since February 2026. Each proxy has a dedicated ProxyAdmin, all owned by the 48h Timelock
- **Multiple reputable audits**: 8 audit engagements across Cyfrin, Quantstamp, and Guardian Audits
- **Active bug bounty**: Immunefi smart-contract program with a $250,000 maximum reward
- **Active monitoring**: continuous internal and third-party onchain monitoring with Guardian oversight

### Key Risks

- **Persistent TVL volatility and holder concentration**: protocol exhibits **five distinct drawdown events** (Jan, early Apr, late Apr, Jun-Jul, and Sep 2026). Current TVL ($34.7M) is ~89% below the October 2025 peak ($326.4M). One address accounted for 63% of the September senior outflow, and Pendle's SY-srUSDe now holds 95.3% of srUSDe supply ahead of the October 22, 2026 PT maturity
- **Low multisig thresholds with overlapping signers**: Admin Multisig is 3-of-4, Operational Multisig is 2-of-3, and two of the three Operational signers also sit on the Admin Safe. All keys are internal-team-only
- **Pause is callable by a 2/3 internal-team multisig** (Operational), with no timelock
- **Redemption speed is revocable by governance**: `setCooldowns` can reimpose up to a 7-day senior cooldown via either timelock, so today's instant exit is not a durable property of the asset
- **Entry-asset risk differs by allocator**: a USDe holder adds Strata smart-contract and tranching risk, while a USDC or other stablecoin holder first elects to take Ethena/USDe risk before taking Strata risk
- **Rapid multi-market expansion**: protocol grew from 1 market to 6 (Neutrl, Midas mHYPER, Midas mM1-USD, Saturn USDat, Hastra PRIME) between February and May 2026, with no public audits covering the new markets. Operational and governance bandwidth is now stretched across six integrations sharing one timelock
- **Thin secondary liquidity**: Pendle's expiring market holds $3.68M and its February 2027 successor only $54.4K, DEX pools total ~$70.1K, and Morpho srUSDe markets are empty. Exit depends almost entirely on the redemption path continuing to function
- **Medium: junior-buffer exhaustion**: jrUSDe `totalAssets` is ~$7.18M against ~$17.48M senior assets, a junior/senior ratio of 41.04% against a 5% hard floor. The buffer is currently thick but flow-dependent: junior holders can withdraw down to the floor, and a lower underlying yield transfers value from junior to senior. Once the buffer is exhausted, senior holders lose their first-loss protection against subsequent underlying USDe/sUSDe losses

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
- **Time in Production**: **~12 months** since srUSDe deployment (October 2, 2025). Maturing.
- **TVL**: ~$34.7M current; peaked at ~$326.4M. Five distinct sharp drawdown events on record (Jan, early Apr, late Apr, Jun-Jul, Sep 2026), giving a peak-to-current decline of ~89%. The srUSDe senior tranche itself is 17.5M USDe.
- **Incidents**: None reported.

**Audit & Security Reviews Score: 2.0** -- Three reputable firms completed eight engagements, alongside a live Immunefi program with a $250,000 maximum reward.

**Historical Track Record Score: 2.5** -- ~12 months in production now scores 2, while $34.7M of TVL falls into the score-3 band, averaging to 2.5. Scale is shrinking and unsteady: TVL halved between August 29 and September 15, 2026, largely because one holder exited.

**Score: 2.25/5** -- `(2.0 + 2.5) / 2 = 2.25`. The live bounty and eight engagements across three reputable firms carry the audit subcategory, while a young and volatile production history and unaudited market-specific code hold the track-record side back.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-4 Admin Multisig with cold wallets, all internal team signers
- 2-of-3 Operational Multisig, all internal team signers; two of three owners are also Admin signers (key-set overlap)
- 48h timelock for Ownable owner-level changes (proxy upgrades, core config) — actively used, 116 execution events
- Original 24h timelock route for strategy config is not configured for execution; the 48h Timelock retains the relevant owner and AccessControlManager powers
- Independent Guardian (Patrick Collins/Cyfrin) holds CANCELLER_ROLE on the 48h Timelock only
- Pause callable by Operational Multisig (2/3, internal-team) with no timelock
- Reserve operations run through a separate 24h Reserve Timelock (Admin Multisig proposer/canceller, no Guardian veto) into a 2-of-4 Treasury Safe. The accounting check bounds this path to accrued reserve; it cannot reach tranche principal
- The same Reserve Timelock is the srUSDe OFT adapter's LayerZero delegate; the adapter escrows only 5.1 srUSDe
- Redemption speed (`setCooldowns`) is governance-mutable up to 7 days via either timelock
- No external/independent signers on either multisig

**Governance Score: 2.5** -- Upgrades and owner-level configuration are timelocked for 48 hours. The 24h Reserve Timelock controls only reserve withdrawals and adapter configuration with negligible escrow, so it does not change the score.

**Subcategory B: Programmability**

- srUSDe exchange rate: fully onchain ERC-4626 (`convertToAssets(1e18) = 1.035735`)
- Yield distribution (DYS): computed onchain. The benchmark rate resolves through a **live `AaveAprPairProvider` read**, not a manual push — the last pushed round is from May 7, 2026 and is ~157 days past the 4h `roundStaleAfter()` bound, so `latestRoundData()` takes the provider fallback branch on every call
- Manual override: the Operational Multisig (2/3) can call `updateRoundData` to push a round that takes precedence over the live Aave read for 4 hours. This shifts yield between the senior and junior tranches; it does not move principal
- Risk-premium parameters (x, y, k): admin-set, last changed February 23, 2026. A planned transition to independent risk managers is not implemented
- Accounting: fully onchain
- No srUSDe-market implementation upgraded since February 2026

**Programmability Score: 2.0** -- Price per share is pure ERC-4626 and the benchmark rate resolves programmatically from Aave with an automatic staleness fallback. The admin-set risk premium and the 4-hour benchmark override keep it off 1.0.

**Subcategory C: External Dependencies**

- **Ethena** — srUSDe's intended underlying asset exposure
  - Holds effectively all srUSDe backing through sUSDe.
  - Determines underlying yield and redemption mechanics.
  - Junior capital absorbs an Ethena/USDe loss before senior holders.
- **Aave v3** — benchmark/data and availability dependency
  - No funds are deposited into Aave.
  - AaveAprPairProvider reads USDC/USDT supply rates to calculate the target APR used by the yield split.
  - This is not merely informational: Accounting.fetchAprs() runs during deposit and withdrawal accounting.
  - The live pushed round is stale and the feed currently falls back to Aave. Therefore, an Aave read failure can temporarily freeze deposits/redemptions—not directly lose funds.
  - A fresh pushed round can bypass Aave for four hours, and governance can replace the provider, but neither is automatic.

- **LayerZero** — srUSDe OFT lock adapter to Plasma
  - 4-of-4 DVN quorum on both receive routes.
  - Escrow is 5.1 srUSDe, so a bridge failure cannot materially affect Ethereum srUSDe holders.

**Dependencies Score: 2.0** -- srUSDe has two established dependencies. Ethena is the intentionally selected underlying asset, while Aave supplies the benchmark-rate data path and does not custody principal. The LayerZero adapter's escrow is too small to count as a material dependency.

**Centralization Score = (2.5 + 2.0 + 2.0) / 3 = 2.17**

**Score: 2.17/5** -- Governance controls remain the main risk in this category: low-threshold, overlapping internal multisigs can pause exits immediately and can reimpose a redemption cooldown through the working 48h timelock. The system is otherwise largely programmatic, and Ethena is the intended underlying exposure rather than a separate protocol-specific critical risk.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- srUSDe backed by sUSDe staked in Ethena's vault; sUSDeStrategy holds 19,705,811 sUSDe worth 24,681,597 USDe, which reconciles against 24,660,626 USDe of combined tranche NAV plus 20,940 USDe of reserve
- Over-collateralized by junior tranche (first-loss capital). Senior:Junior asset ratio ~2.44:1; total-system collateralization ~141.0% of senior assets, well above the 105% circuit breaker
- Coverage enforced by `minimumJrtSrtRatio` (5%) with a 6% deposit-gating buffer; junior/senior currently 41.04%
- The 0.01 junior-price shortfall pause is a terminal deposit backstop, not an early-protection control; the 5% coverage floor and 6% senior-deposit gate are the operative protections
- Underlying collateral is USDe (Ethena's synthetic dollar -- backed by delta-neutral ETH/BTC strategy with CEX counterparty exposure)
- Reserve mechanism: `reserveBps()` = 5e16, i.e. 5% of gains (WAD-scaled, capped at 10%). `RESERVE_MANAGER_ROLE` is held by the 24h Reserve Timelock, and withdrawals are bounded by accrued reserve

**Collateralization Score: 2.0** -- Onchain backing is verifiable and reconciles. Coverage at ~141.0% sits well above the 105% breaker, and junior capital provides a 41.04% first-loss buffer. That buffer grew because senior capital left, and junior holders can withdraw down to the floor, so it is not counted as a durable improvement. The Ethena exposure is the product's intended underlying asset exposure, not a separate reason to penalize srUSDe collateralization; the remaining protocol-specific consideration is the size of the junior buffer.

**Subcategory B: Provability**

- Exchange rate: programmatic onchain (ERC-4626), `convertToAssets(1e18) = 1.035735167729589148`
- Strategy holdings: verifiable onchain (sUSDe balance in strategy contract)
- Accounting: fully onchain with transparent TVL tracking
- Underlying USDe collateral: relies on Ethena's proof of reserves (third-party verified)
- Risk-premium parameters: set by team, visible onchain once set

**Provability Score: 2.0** -- Reserves are fully onchain and anyone can reproduce the exchange rate, strategy holdings, and tranche NAVs from public getters. The USDe layer beneath depends on Ethena's own proof-of-reserve reporting rather than direct onchain verification, which keeps this off 1.0.

**Funds Management Score = (2.0 + 2.0) / 2 = 2.0**

**Score: 2.0/5** -- `(2.0 + 2.0) / 2 = 2.0`. Backing is verifiable and reconciles exactly against onchain balances. The relevant residual consideration is the junior buffer, which protects senior holders against losses in the intended USDe/sUSDe underlying.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: Atomic redemption into sUSDe (`cooldownDisabled(sUSDe) = true`), or ~1 day into USDe via Ethena's 86,400s cooldown.
- **Redemption capacity is the entire position**: `StrataCDO.maxWithdraw(srUSDe)` returns **17,483,934 USDe**, exactly `srtNav` — the full senior tranche. The coverage floor throttles the *junior* tranche only (`maxWithdraw(jrUSDe)` = 6,301,917, capped so junior NAV cannot fall below 5% of senior). There is no queue and no rationing on senior exits.
- **Redemption slippage is structurally zero**: exits settle at NAV less a 0.025% `exitFeeSrt`, against 19,705,811 sUSDe held by the strategy.
- **Demonstrated at scale**: ~$49M of protocol TVL exited between June 1 and July 15, 2026, and 42.1M USDe of senior withdrawals cleared between August 26 and October 11, 2026, both with no queue backlog and no depeg — the rubric's "maintained liquidity during major drawdowns" modifier.
- **Secondary venues are immaterial by comparison**: Pendle PT at $3.68M (expiring October 22, 2026) plus $54.4K in the February 2027 successor, DEX ~$70.1K with ~$20 of 24h volume, Morpho srUSDe markets at $0 supply and $0 borrow.
- **Holder concentration**: Pendle's SY-srUSDe holds 95.3% of supply. Its unwinding at PT maturity is a scale risk for the protocol, not a dilution risk for remaining senior holders.
- **The exit is switchable**: `maxWithdraw` returns **0** when `actionsSrt.isWithdrawEnabled` is false, and `setActionStates` is callable instantly by the 2-of-3 Operational Multisig with no timelock. If redemption were paused, holders of a $17.5M tranche would face roughly $3.8M of combined secondary depth, most of it in a PT market that expires October 22, 2026.
- **The exit speed is revocable**: `setCooldowns` can reimpose up to a 7-day senior cooldown via either timelock.

**Score: 2.0/5** — Direct redemption at NAV, capacity equal to the full position, and two large exits ($49M and 42.1M USDe) cleared without impact.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Publicly identified contributors include Vishvendra Singh Dhayal, co-founder and CEO of Frontera Labs, and Ramiro Gamen; Patrick Collins is separately identified as Guardian. Public documentation does not map individuals to governance keys or operational responsibilities
- **Documentation**: Comprehensive at docs.strata.markets, with contract tables for all six markets. However, the roles page is out-of-date with onchain state (PAUSER_ROLE documented as Admin Multisig but held by the Operational Multisig; UPDATER_STRAT_CONFIG_ROLE documented as 24h-only but held by both timelocks; RESERVE_MANAGER_ROLE documented on the 24h Timelock but held by the undocumented Reserve Timelock)
- **Public GitHub activity**: Active — `Strata-Markets/contracts` had repository activity through September 22, 2026. The February 2026 repository migration was unannounced, which is a discoverability rather than a transparency failure
- **Legal Structure**: Frontera Labs, Inc. (Delaware) operates the front-end. Protocol contracts are autonomous and licensed under BUSL-1.1. Planned transition to Cayman Islands foundation. US users geo-blocked
- **Incident Response**: Not formally documented. Public [security documentation](https://docs.strata.markets/technical-documentation/security) describes continuous internal and third-party onchain monitoring, automatic protective responses, Guardian veto capability, and an immediate Operational Multisig pause path. Specific current monitoring vendors and service-level details are not disclosed

**Score: 2.0/5** -- Public leadership and contributors, active development, good documentation, and an established legal entity meet the rubric's score-2 profile. Incomplete mapping of people to privileged controls, stale role documentation, and six markets shipping faster than public audit coverage prevent a score of 1.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.25 | 20% | 0.45 |
| Centralization & Control | 2.17 | 30% | 0.651 |
| Funds Management | 2.0 | 30% | 0.60 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.10** |

**Final Score: 2.10**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk**

At 2.10 the score sits inside the Low Risk band. Reassess if the junior buffer approaches its 6% deposit gate, senior redemption conditions change, protocol TVL falls below $10M, or Ethena materially changes sUSDe mechanics.

---

Strata's srUSDe is a well-designed risk-tranching product with good audit coverage from reputable firms, multi-layered governance with independent Guardian oversight, and fully onchain accounting and exchange rate computation. The junior tranche first-loss protection adds meaningful risk mitigation beyond the underlying yield source.

The protocol is ~12 months in production with no incidents, but TVL volatility continues. A fifth drawdown took TVL from $77.4M on August 29 to $38.6M on September 15, and current TVL ($34.7M) sits ~89% below the October 2025 peak. The senior tranche is now 17.5M USDe, and 95.3% of srUSDe sits in Pendle's SY wrapper ahead of the October 22 PT maturity. Coverage stands at ~141.0% against a 105% floor, because senior capital left while junior capital stayed. The most consequential fact for Yearn is that the redemption path is fast: senior redemptions into sUSDe are atomic, the USDe path is ~1 day, and the June-July and September outflows confirm it absorbs large exits without a queue. Against that, secondary liquidity is only $3.68M in an expiring Pendle market and effectively nothing elsewhere. The redemption path is close to the only exit that matters, and a 2-of-3 multisig can switch it off without a timelock.

**For the intended Yearn use cases:**
1. **Direct srUSDe deposit**: Low risk for an allocator already holding USDe: it adds Strata's smart-contract and tranching risk on top of existing USDe exposure. A USDC- or other stablecoin-denominated allocator additionally takes Ethena/USDe risk before taking Strata risk; that allocation decision should be assessed separately from this protocol score. Exit is fast and unrationed. The primary protocol-specific concerns are the junior-buffer level and the fact that both the pause switch and the 7-day cooldown are governance-reachable. The repeated TVL boom-bust pattern and the shrinking, Pendle-concentrated holder base are worth monitoring even though no exploits have been observed. Size any allocation against the remaining 17.5M USDe senior tranche.
2. **srUSDe as Morpho collateral (srUSDe/USDC)**: Not currently actionable — no srUSDe/USDC market exists on Morpho Blue, and the only raw srUSDe market (srUSDe/USDe, 91.5% LLTV) has zero supply and zero borrow. If a market were created, srUSDe's stablecoin denomination and atomic sUSDe redemption would make liquidations cleaner than the previous cooldown-based assumption implied, but a new market would need to be seeded and its oracle reviewed.

**Key conditions for exposure:**
- Monitor srUSDe exchange rate for any decreases (should only increase — currently 1.035735 USDe/srUSDe)
- Monitor junior/senior NAV ratio against the 6% deposit gate and 5% hard floor (currently 41.04%)
- Monitor `sUSDeStrategy.sUSDeCooldownSrt()` and Ethena's `sUSDe.cooldownDuration()` — any increase lengthens the exit path
- Monitor 48h Timelock and the 24h Reserve Timelock for any scheduled changes, including those targeting sister markets (the original 24h Timelock has never fired)
- Monitor USDe peg stability
- Track TVL and the Pendle SY-srUSDe balance for concentration risk signals, especially around the October 22, 2026 PT maturity
- Verify with the team whether the 24h-timelock executor route is intentionally left unused and update the role documentation accordingly
- Confirm with the team whether the srUSDe senior tranche's zero cooldown is a permanent design choice or a temporary setting

---

## Reassessment Triggers

- **Time-based**: Reassess in 60 days (per reassessment-scan threshold) or sooner if any of the below trigger
- **TVL-based**: Reassess if TVL changes by more than 50% (from current ~$34.7M)
- **Repository-based**: Track [`Strata-Markets/contracts`](https://github.com/Strata-Markets/contracts), not the frozen original repo; the `feat/multi-strategy-dys` branch would change the srUSDe strategy architecture if merged and deployed
- **Incident-based**: Reassess after any exploit, governance change, collateral modification, or Ethena incident
- **Dependency-based**: Reassess if Ethena modifies sUSDe mechanics, cooldown periods, or undergoes significant changes
- **Bug bounty**: Reassess if the Immunefi program's scope, status, or $250,000 maximum reward materially changes
- **Governance-based**: Reassess when onchain governance is activated, when risk-premium parameters transition to independent managers, or if the 24h-Timelock executor route is configured
- **Redemption-speed-based**: Reassess immediately if `sUSDeStrategy.sUSDeCooldownSrt()` becomes non-zero or Ethena raises `sUSDe.cooldownDuration()` — the Liquidity score depends directly on both
- **Coverage-based**: Reassess if the junior/senior NAV ratio falls below 6% (senior deposit gate)
- **Market expansion**: Reassess if the Neutrl/Midas/Saturn/Hastra markets receive separate audits, if a further market is launched, or if any of them experience an incident (operational spillover risk to srUSDe)
- **Pendle liquidity**: Reassess after the PT-srUSDe-22OCT2026 market expires on October 22, 2026, given Pendle's 95.3% share of srUSDe supply
- **Bridge-based**: Reassess if srUSDe escrowed in the OFT adapter exceeds $1M, a new remote chain is added, or the DVN quorum drops below 4-of-4
- **Morpho-based**: Reassess if an srUSDe/USDC market is created on Morpho Blue, since Yearn use case #2 depends on it

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [May 19, 2026](https://github.com/yearn/risk-score/pull/196) | 2.8 | TVL ~$86.8M, ~73% below ATH. Three sharp drawdowns on record. 24h Timelock executor misconfiguration identified. |
| [August 5, 2026](https://github.com/yearn/risk-score/pull/351) | 2.10 | Reassessment: TVL ~$75.8M, ~76% below ATH (fourth drawdown to $50.5M on Jul 15). Coverage 111.2%, junior/senior ratio 11.23%. Senior redemption confirmed atomic in sUSDe (`sUSDeCooldownSrt` = 0) and ~1 day in USDe after Ethena cut its cooldown to 1 day in Mar 2026 — Liquidity 3.0→2.0. Pendle liquidity $4.60M; DEX ~$80.3K; no srUSDe/USDC Morpho market exists. Sixth market (Hastra PRIME) live. Issue [#379](https://github.com/yearn/risk-score/issues/379) follow-up: active $250K Immunefi bounty and public Frontera Labs contributors verified — Audits & Historical 3.0→2.25, Operational 2.5→2.0. Benchmark rate resolves through a live Aave read rather than manual pushes: Programmability 2.5→2.0. Ethena treated as intended underlying exposure with junior first-loss buffer in collateralization. Tier moves Medium → Low. |
| [October 11, 2026](https://github.com/yearn/risk-score/pull/522) | 2.10 | Reassessment ([#520](https://github.com/yearn/risk-score/issues/520)): protocol TVL ~$34.7M, ~89% below ATH, after a fifth drawdown (Aug 29–Sep 15). srUSDe senior tranche down from 59.1M to 17.5M USDe, with one address withdrawing 26.6M; Pendle SY holds 95.3% of supply ahead of the Oct 22 PT maturity. Coverage 141.0%, junior/senior 41.04%. New 24h Reserve Timelock holds `RESERVE_MANAGER_ROLE`, treasury set to a 2-of-4 Safe, ~148.9K USDe of reserve swept (bounded to reserve). LayerZero OFT lock adapter to Plasma identified (5.1 srUSDe escrowed, 4-of-4 DVNs; Plasma OFT owned by a 48h timelock). Guardian corrected to an EIP-7702-delegated EOA. Implementations unchanged. Scores unchanged; Historical stays at 2.5 as production time crosses 1 year while TVL falls into the >$10M band. |
