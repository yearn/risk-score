# Protocol Risk Assessment: Strata

- **Assessment Date:** May 19, 2026
- **Token:** srUSDe (Senior Tranche USDe)
- **Chain:** Ethereum
- **Token Address:** [`0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003`](https://etherscan.io/address/0x3d7d6fdf07EE548B939A80edbc9B2256d0cdc003)
- **Final Score: 2.8/5.0**

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

**Key metrics (May 19, 2026):**
- Protocol TVL: ~$86.8M (DeFiLlama, aggregated across all Strata markets)
- srUSDe vault TVL (onchain): ~$51.9M USDe; jrUSDe ~$10.0M USDe (Ethena USDe market only)
- Peak TVL: ~$326M (October 8, 2025) — protocol is now ~73% below ATH
- Chain: Ethereum only
- Protocol now operates **five markets** (added since the previous assessment): Ethena USDe (srUSDe), Neutrl NUSD (srNUSD), Midas mHYPER (srmHYPER), Midas mM1-USD (srmM1-USD), Saturn USDat (srUSDat). srUSDe is the original and largest market; the others share governance and the same access-control contract but each has its own CDO/Strategy/Accounting/AprPairFeed contracts.

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
- [Risks & Mitigations](https://docs.strata.markets/protocol-mechanism/risks-and-mitigations)
- [DeFiLlama](https://defillama.com/protocol/strata)
- [GitHub](https://github.com/Strata-Money/contracts-tranches)
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
| StrataCDO | [`0xcAb791D0D44eBaC17378fF2AF6356c012F15c9e6`](https://etherscan.io/address/0xcAb791D0D44eBaC17378fF2AF6356c012F15c9e6) |
| ERC20Cooldown | [`0xeD6c7b379F73DF0618406d263b13b2386E398166`](https://etherscan.io/address/0xeD6c7b379F73DF0618406d263b13b2386E398166) |

### On-Chain Verification (Etherscan, May 19, 2026)

All core contracts are **verified on Etherscan**:

| Contract | Etherscan Name | Verified | Proxy |
|----------|---------------|----------|-------|
| srUSDe | TransparentUpgradeableProxy → Tranche (impl `0xe894055ca1c73648927e225f3ca38ed48e30210b`) | Yes | Yes |
| jrUSDe | TransparentUpgradeableProxy | Yes | Yes |
| StrataCDO | TransparentUpgradeableProxy → StrataCDO (impl `0xb3d4f2c2123f8c3ca85ae7a6d48aa2ef049c79ba`) | Yes | Yes |
| sUSDeStrategy | TransparentUpgradeableProxy → sUSDeStrategy (impl `0x2b9796606c8480312a572742c00f606ef4adb107`) | Yes | Yes |
| Accounting | TransparentUpgradeableProxy | Yes | Yes |
| AccessControlManager | AccessControlManager | Yes | No |
| Admin Multisig | GnosisSafeProxy | Yes | Yes |
| Operational Multisig | SafeProxy | Yes | Yes |
| 48h Timelock | StrataMasterChef (OZ TimelockController) | Yes | No |
| 24h Timelock | StrataMasterChef (OZ TimelockController) | Yes | No |
| Guardian | EOA (not a contract) | N/A | N/A |

**Note**: Both timelocks are registered on Etherscan as `StrataMasterChef` but contain standard OpenZeppelin TimelockController functions (`schedule`, `execute`, `cancel`, `getMinDelay`). Delays verified onchain (May 19, 2026): 48h = 172,800 seconds, 24h = 86,400 seconds. Implementation contracts for srUSDe, StrataCDO, and sUSDeStrategy are unchanged since November 2025 — no upgrade has been pushed in the past ~6 months.

## Audits and Due Diligence Disclosures

Strata has completed an extensive, multi-phased audit process with 3 reputable firms across at least 8 distinct audit engagements (one new Quantstamp engagement added since the previous assessment).

### Audit History

| # | Firm | Date | Scope | C | H | M | L | Info | Report |
|---|------|------|-------|---|---|---|---|------|--------|
| 1 | **Cyfrin** | Oct 8, 2025 | Protocol v1 (Tranches) | 1 | 2 | 6 | 5 | 12 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-10-08-cyfrin-strata-tranches-v2.0.pdf) |
| 2 | **Guardian Audits** | Oct 10, 2025 | Protocol v1 (Tranches) | 1 | 5 | 14 | 5 | 8 | [PDF](https://github.com/GuardianAudits/Audits/blob/main/Strata/Strata_Tranches_report.pdf) |
| 3 | **Quantstamp** | ~Q4 2025 | Protocol v1 (Tranches) | - | - | - | - | - | [Certificate](https://certificate.quantstamp.com/full/strata-tranches/3c3a4037-2a92-468c-a4f3-5ea498e7b539/index.html) |
| 4 | **Quantstamp** | ~Q4 2025 | Redemption Fee (Update to Tranches) | - | - | - | - | - | [Certificate](https://certificate.quantstamp.com/full/strata-update-to-tranches/d7a903b7-80cf-42db-8433-79186fdd8be2/index.html) |
| 5 | **Cyfrin** | Jan 23, 2026 | Coverage-aware redemption / Shares Cooldown mechanism | 0 | 0 | 6 | 3 | 10 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2026-01-23-cyfrin-strata-shares-cooldown-v2.0.pdf) |
| 6 | **Quantstamp** | ~Q1 2026 (new) | Discrete accounting mechanism | - | - | - | - | - | [Certificate](https://certificate.quantstamp.com/full/strata-discrete-accounting/02318e87-e35f-4e96-81ad-192253203d55/index.html) |
| 7 | **Cyfrin** | Jun 11, 2025 | Pre-Deposit Vaults | 1 | 1 | 3 | 16 | 9 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-06-11-cyfrin-strata-predeposit-v2.1.pdf) |
| 8 | **Quantstamp** | ~2025 | Pre-Deposit Vaults | - | - | - | - | - | [Papermark](https://www.papermark.com/view/cmgm9op9b0003l404g395i6a5) |

*Quantstamp reports hosted on JS-rendered platforms; finding counts require browser access. Dashes indicate data not programmatically extractable.*

**Total findings across Cyfrin + Guardian reports: 3 Critical, 8 High, 29 Medium, 29 Low (all resolved).**

**New since previous assessment**: Quantstamp audit of the "Discrete accounting mechanism" (engagement #6, published certificate but exact date and finding counts not programmatically extractable). No new audits cover the recently deployed Neutrl/Midas/Saturn markets — those use the same codebase as srUSDe per protocol docs.

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

**No active bug bounty program found.** Exhaustive search across Immunefi, Code4rena, Sherlock, HackerOne, Safe Harbor, and the protocol's own documentation and GitHub yielded no bug bounty listing, responsible disclosure policy, or security contact for vulnerability reporting. The [security documentation](https://docs.strata.markets/technical-documentation/security) covers audits, multisigs, and monitoring but does not mention a bug bounty. This is a notable gap for a protocol with >$150M TVL.

## Historical Track Record

- **Time in Production**: srUSDe proxy deployed October 2, 2025 (block [23492392](https://etherscan.io/tx/0x857c511cb166160e9b9acdb8ef47d9306ad5bcef1a311e845b4a2d4b90ea1f6b)). In production for **~7.5 months** as of May 19, 2026. Pre-deposit vaults with TVL existed from July 2025 (~10 months with TVL).
- **GitHub Repository**: Created September 16, 2025. Public, Solidity-based; last public push **Feb 25, 2026** (~3 months ago). Active development continues on private branches (`strat/morpho`, `strat/neutrl`, `strat/superstate`, `release/performance-fee`) which are not yet merged to public master.
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
| May 1-19, 2026 | $82M → $87M | Current range, stable but near multi-month lows |
| **May 19, 2026** | **~$86.8M** | **Current** (~73% below ATH) |

- **TVL Volatility**: The protocol has now experienced **three distinct large drawdown events** (Jan, early Apr, late Apr 2026), each shedding 25-55% of TVL within days. Current TVL sits ~73% below the October 2025 peak. The repeated boom-bust pattern is consistent with **large depositor concentration** and is likely driven in part by points-program farming behavior.
- **Incidents**: No reported security incidents, exploits, or hacks found in this assessment window (Feb 18 - May 19, 2026).
- **Governance Activity (Feb 18 - May 19, 2026)**:
  - 48h Timelock: 14 `CallScheduled` and 14 `CallExecuted` events. Most activity clustered around Feb 23, Apr 8, and May 3 — corresponding to deployments of the new Neutrl, Midas mHYPER/mM1-USD, and Saturn USDat markets (none affect the srUSDe contracts directly).
  - 24h Timelock: 0 events in this window (and 0 since deployment in October 2025). See onchain finding in *Centralization & Control Risks* below.
- **Exchange Rate (onchain verified May 19, 2026)**:
  - `convertToAssets(1e18)` = **1.021541647465871857 USDe per srUSDe** (up from 1.013728 on Feb 18, 2026)
  - `totalAssets()` = **51,909,893 USDe** (down from 113,838,466 on Feb 18)
  - `totalSupply()` = **50,815,249 srUSDe** (down from 112,296,907 on Feb 18)
  - Senior tranche underlying assets dropped ~54% over the 90-day window, mirroring the protocol-wide TVL decline.
  - Exchange-rate growth: 1.021541 / 1.013728 = +0.77% over 90 days → **~3.1% annualized yield** to the senior tranche over this window (down from the ~3.7% implied at the previous assessment, but in line with the dynamic-yield-split mechanism floored at the Aave benchmark rate).
  - jrUSDe (junior tranche): `totalAssets()` = ~10,035,113 USDe; `totalSupply()` = ~9,556,172 jrUSDe. Senior:Junior asset ratio is ~5.17:1; total system collateral (senior + junior) / senior = ~119.3%, well above the 105% coverage circuit breaker.

## Funds Management

### Deposit/Withdrawal Flow

**Deposit**: Users deposit USDe (or sUSDe, USDT, USDC, DAI) into the srUSDe Meta Vault. Deposited assets are exchanged for shares proportional to the current exchange rate and passed to the sUSDeStrategy, which stakes them into Ethena's sUSDe vault.

**Withdrawal**: Uses a multi-stage cooldown mechanism:
1. **ERC20Cooldown**: Strategy locks tokens in a cooldown contract for a specified period
2. **UnstakeCooldown**: For sUSDe, triggers Ethena's own sUSDe cooldown (currently 7 days)
3. Each withdrawal request is handled independently per user; new requests do not extend or affect earlier requests
4. After the cooldown period, tokens can be finalized/withdrawn

### Accessibility

- **Deposits**: Permissionless. Anyone can deposit USDe, sUSDe, USDT, USDC, or DAI
- **Redemptions**: Permissionless but subject to cooldown periods tied to Ethena's sUSDe unstaking
- **Atomic operations**: Deposits are single-transaction. Withdrawals require initiation + cooldown + finalization
- **Fees**: Performance fees and redemption fees apply (transparent, visible on the app). Exit-fee changes governed by a two-step process via TwoStepConfigManager

### Collateralization

- **Backing**: srUSDe is backed by the underlying USDe/sUSDe staked in Ethena's vault, with additional over-collateralization from the junior tranche (jrUSDe) which serves as first-loss capital
- **Senior coverage ratio**: When it falls below **105%**, the protocol may temporarily halt senior minting and junior redemptions to protect the senior tranche
- **Underlying collateral**: USDe is Ethena's synthetic dollar backed by a delta-neutral strategy (ETH/BTC spot + short perpetual futures). Ethena maintains proof of reserves via third-party verification
- **Risk hierarchy**: Senior tranche (srUSDe) is principal-protected in the base asset and paid first. The junior tranche absorbs losses before any impact to senior holders. However, if the junior tranche is **fully depleted**, the senior tranche **may incur principal losses**
- **Reserve mechanism**: Part of strategy gains can be allocated to a protocol reserve (configurable via `setReserveBps`), which can be redistributed to tranche TVL or withdrawn to treasury

### Provability

- **Exchange rate**: Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Anyone can verify
- **Underlying sUSDe balance**: Verifiable onchain by checking the strategy's sUSDe holdings
- **Yield calculation**: DYS mechanism computes yields onchain using the AprPairFeed contract. Benchmark rate sourced from Aave v3 Core. However, risk-premium parameters (x, y, k) are set by the team
- **Accounting**: Onchain Accounting contract tracks raw TVL, balances, inflows/outflows, fees, and reward distribution for both tranches

## Liquidity Risk

### Primary Exit Mechanisms

1. **Redeem from srUSDe vault**: Initiate withdrawal → cooldown period (tied to Ethena's sUSDe cooldown, currently ~7 days) → finalize. Permissionless but not instant
2. **DEX swap**: Extremely thin onchain DEX liquidity. Total across all Uniswap V4 pools: ~$135K. Largest pool is srUSDe/USDe at ~$81K with only $425 in 24h volume. **No Curve or Balancer pools exist.** CoinGecko does not list srUSDe
3. **Pendle markets**: PT-srUSDe-02APR2026 pool holds ~$21.9M TVL with ~$128K weekly volume. Primary venue for srUSDe trading, but these are fixed-yield PT tokens, not raw srUSDe
4. **Morpho markets**: PT-srUSDe-2APR2026/USDC market has ~$14.6M supply and 82.4% utilization. A raw srUSDe/USDe market exists on Morpho but is empty ($0 supply/$0 borrow)

### Withdrawal Restrictions

- **Cooldown period**: Withdrawals require a cooldown period linked to Ethena's sUSDe unstaking (~7 days). Not instant
- **Coverage protection**: When senior coverage ratio falls below 105%, senior minting and junior redemptions are suspended. This protects senior tranche but could trap capital in extreme scenarios
- **Self-balancing**: The coverage mechanism is designed to be self-balancing -- thinner junior coverage attracts more liquidity via higher junior yields

### Liquidity Assessment

- **Primary liquidity**: The main exit path is through the cooldown-based redemption mechanism (not instant)
- **Secondary market**: DEX liquidity is negligible (~$135K total across Uniswap V4 pools). Pendle PT-srUSDe markets (~$21.9M) are the most liquid venue but trade fixed-yield PTs, not raw srUSDe. Morpho lending markets hold ~$14.6M in PT-srUSDe collateral
- **Large holder impact**: Given the TVL volatility (62.6% drawdown from peak), large holders can exit but it takes time due to cooldowns
- **Same-value redemption**: srUSDe redeems for USDe (stablecoin-denominated), so price impact risk is minimal for the Morpho use case

## Centralization & Control Risks

### Governance

Strata uses a layered Role-Based Access Control (RBAC) system in the **AccessControlManager** ([`0x1d19E18ECaC4ef332a0d5d6Aa3a0f0f772605f60`](https://etherscan.io/address/0x1d19E18ECaC4ef332a0d5d6Aa3a0f0f772605f60)). The table below was **validated onchain on May 19, 2026** by hashing each role string with `keccak256` and querying `hasRole(role, address)` against every known principal. Note the corrections vs. the protocol documentation and the previous assessment (both contained errors for PAUSER_ROLE and RESERVE_MANAGER_ROLE).

| Role | Onchain Holder(s) | Description | Key Functions |
|------|-------------------|-------------|---------------|
| DEFAULT_ADMIN_ROLE (`0x0000…`) | 48h Timelock + 24h Timelock | AccessControlManager super-admin (can grant/revoke any role) | `grantRole`, `revokeRole`, `grantCall`, `revokeCall` |
| PAUSER_ROLE | **Operational Multisig (2/3)** *(docs/prior report incorrectly state Admin Multisig)* | Pause/resume deposits and redemptions | `StrataCDO::setActionStates`, `StrataCDO::setJrtShortfallPausePrice` |
| UPDATER_FEED_ROLE | Operational Multisig (2/3) | Trigger APR refresh and recalculation | `Accounting::onAprChanged`, `AprPairFeed::updateRoundData` |
| UPDATER_CDO_APR_ROLE | AprPairFeed contract + EOA [`0x1f3aab5b…`](https://etherscan.io/address/0x1f3aab5b7c5ea8c4ce629b14edb09d68b90a3c57) | Push APR updates into the CDO | `Accounting::onAprChanged` (internal-only path) |
| UPDATER_STRAT_CONFIG_ROLE | **48h Timelock + 24h Timelock** *(prior report listed 24h only)* | Update strategy risk parameters and cooldowns | `Accounting::setRiskParameters`, `sUSDeStrategy::setCooldowns` |
| RESERVE_MANAGER_ROLE | **24h Timelock only** *(prior report incorrectly listed Admin Multisig)* | Redistribute reserves or withdraw to treasury | `StrataCDO::reduceReserve`, `StrataCDO::distributeReserve`, `StrataCDO::setReserveTreasury` |
| PROPOSER_CONFIG_ROLE | Admin Multisig (3/4) | Propose exit-fee configuration changes | `TwoStepConfigManager::scheduleExitFeeChange` |
| DEPOSITOR_CONFIG_ROLE | Operational Multisig (2/3) | Configure the `TrancheDepositor` accepted-token whitelist and routing | `TrancheDepositor::*` config |
| COOLDOWN_WORKER_ROLE | sUSDeStrategy + 24h Timelock + EOA [`0x99fe6bb5…`](https://etherscan.io/address/0x99fe6bb58b52d54991c0b6ef2595839e835f1a20) | Finalize cooldown unstakes on behalf of the strategy | `ERC20Cooldown`/`UnstakeCooldown` worker hooks |
| Ownable `owner()` *(not a role in ACM)* | 48h Timelock | High-level protocol configuration on Ownable contracts (StrataCDO, srUSDe, jrUSDe, Accounting, sUSDeStrategy all return 48h Timelock as `owner()`) | `Accounting::setAprPairFeed`, `setReserveBps`, `setFeeRetentionBps`, `setMinimumJrtSrtRatio[Buffer]`, `UnstakCooldown::setImplementations`, `AprPairFeed::setProvider`/`setRoundStaleAfter` |

**Multisig Details (onchain verified May 19, 2026):**
- **Admin Multisig** ([`0xA27cA929…`](https://etherscan.io/address/0xA27cA9292268ee0f0258B749f1D5740c9Bb68B50)): 3-of-4 Gnosis Safe (`getThreshold() = 3`). Owners: `0x791fB932…`, `0x296400D8…`, `0xd796E125…`, `0x206cFf3D…`. Threshold and owner set unchanged since the previous assessment.
- **Operational Multisig** ([`0x4be3749a…`](https://etherscan.io/address/0x4be3749a0F6557b8fd98F3967e859DbD7C694eF4)): 2-of-3 Gnosis Safe (`getThreshold() = 2`). Owners: `0x296400D8…`, `0xd796E125…`, `0xacE53036…`. Two of three signers (`0x296400D8…`, `0xd796E125…`) also sit on the Admin Multisig — the two safes are not fully independent. Unchanged since previous assessment.
- **48h Timelock** ([`0xb2A3CF69…`](https://etherscan.io/address/0xb2A3CF69C97AFD4dE7882E5fEE120e4efC77B706)): `getMinDelay() = 172,800`. Roles (verified via `hasRole`): PROPOSER → Admin Multisig; CANCELLER → Admin Multisig + Guardian; EXECUTOR is **open** (zero-address holds the role, so anyone can execute after the delay). 53 historical `CallExecuted` events.
- **24h Timelock** ([`0x4f2682b7…`](https://etherscan.io/address/0x4f2682b78F37910704fB1AFF29358A1da07E022d)): `getMinDelay() = 86,400`. PROPOSER → Admin Multisig; CANCELLER → Admin Multisig (Guardian is **not** assigned CANCELLER on the 24h timelock); EXECUTOR is **unset** (executor list at deployment was empty per constructor calldata; the zero-address sentinel was not granted, no other principal has been granted since). As a consequence, **0 `CallExecuted` events** in the contract's ~7-month lifetime — see finding below.
- **Guardian** ([`0x277D26a4…`](https://etherscan.io/address/0x277D26a45Add5775F21256159F089769892CEa5B)): Patrick Collins (Co-Founder & CEO of Cyfrin). Externally-owned account. Holds CANCELLER_ROLE on the 48h Timelock; does **not** hold CANCELLER on the 24h Timelock and does **not** hold any role in the AccessControlManager.

**Key concerns:**
- Admin Multisig is only 3-of-4 (relatively low threshold) and Operational Multisig is only 2-of-3 (low threshold). Two signers overlap between the two safes, reducing key-set independence.
- All multisig keys held by internal team -- no external/independent signers.
- **Pause is faster and lower-threshold than previously thought**: Operational Multisig (2/3, internal-only) can pause the protocol immediately with no timelock. This is good for emergency response but means a 2-of-3 internal-key compromise can halt user activity.
- **Reserve management is timelocked, not multisig-callable** (correcting the prior report): `RESERVE_MANAGER_ROLE` sits on the 24h Timelock, which must be triggered by an Admin Multisig (3/4) proposal with a 24-hour delay. This materially **reduces** the "reserve extraction" risk that the previous assessment flagged as critical.
- **24h Timelock is currently inoperative**: no executor was granted at deployment (verified by inspecting both `hasRole(EXECUTOR_ROLE, …)` for all principals including the zero address, and the deployment-tx constructor calldata which shows `executors = []`). Combined with the on-chain fact of 0 `CallExecuted` events since October 2025, this means `RESERVE_MANAGER_ROLE` and the 24h path of `UPDATER_STRAT_CONFIG_ROLE` cannot currently fire. For srUSDe this is largely benign because the 48h Timelock holds the same `UPDATER_STRAT_CONFIG_ROLE` and the same Ownable `owner()` powers, so strategy configuration can still be updated via the 48h path; reserve treasury withdrawals, however, are blocked outright until an executor is granted (which itself requires a proposal that no one can execute — likely a redeploy or migration would be needed to fix this). Worth flagging to the team.
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
| **Aave v3 Core** | Benchmark rate oracle | **High** | Supply-weighted average of USDC/USDT lending rates used for benchmark. Failure could distort yield calculations and tranche distributions |
| **Gnosis Safe** | Multisig infrastructure | **High** | All governance actions flow through Safe multisigs |
| **Hypernative** | Monitoring & alerting | **Medium** | 24/7 contract monitoring. Not critical for operations but important for security |
| **Ethereum L1** | Settlement layer | **High** | All contracts deployed on Ethereum mainnet only |

**Key dependency risk**: For srUSDe specifically, Strata has a **single critical yield source dependency** on Ethena/sUSDe. The benchmark rate relies on a **single data source** (Aave v3 Core). No documented fallback mechanisms if Ethena or Aave dependencies fail. The AprPairFeed has a `setRoundStaleAfter` parameter suggesting some staleness detection.

**Note on protocol-wide surface area** (new since previous assessment): Strata expanded from a single market to **five live markets** between Feb and May 2026: Ethena USDe (srUSDe — unchanged), Neutrl NUSD, Midas mHYPER, Midas mM1-USD, and Saturn USDat. Each market has its own CDO/Strategy/Accounting/AprPairFeed/AccessControlManager stack but shares the same multisig and timelock governance. This diversifies the protocol's yield mix away from sole reliance on Ethena, but materially increases overall protocol surface area — none of the new markets have undergone the same depth of audit coverage as the original srUSDe codebase, and operational mistakes on any market (e.g. an oracle mis-configuration on the Midas markets) could indirectly affect team focus / incident-response bandwidth for srUSDe. The srUSDe contracts themselves are unchanged.

## Operational Risk

- **Team Transparency**: Founding team is **not publicly named** in documentation. Operational team members are not publicly identified. The only publicly named individual is **Patrick Collins** (Cyfrin CEO), who serves as Guardian (security oversight role, not management). Team is classified as **partially anonymous** -- known anons at best
- **Documentation**: Comprehensive docs at docs.strata.markets covering mechanism, technical architecture, contracts, roles, and risks; updated to cover the four new markets (Neutrl/Midas/Saturn). However, parts of the docs are now **out-of-date with onchain state** — notably, the docs claim `PAUSER_ROLE` is held by the Admin Multisig, but onchain it is held by the Operational Multisig. Yearn should treat onchain `hasRole` results as authoritative
- **Legal Structure**: **Frontera Labs, Inc.**, a Delaware (USA) corporation, operates the Interface (front-end) only. The company explicitly disclaims ownership or control of the protocol smart contracts. Protocol contracts are licensed under BUSL-1.1. A planned transition to a **Cayman Islands foundation** is referenced in the [Terms of Service](https://docs.strata.markets/resources/terms-of-service) (last updated Nov 28, 2025). US users are geo-blocked. Contact: legal@strata.markets
- **Incident Response**: Not formally documented, but the protocol has multiple layers of defense:
  - 24/7 monitoring via Hypernative
  - Guardian (Patrick Collins) can cancel timelock transactions on the 48h Timelock
  - Operational Multisig (2/3) can pause the protocol immediately (no timelock)
- **Open Source**: Contracts are public on [GitHub](https://github.com/Strata-Money/contracts-tranches). Public branch last pushed Feb 25, 2026; active development is on unmerged feature branches (`strat/morpho`, `strat/neutrl`, `strat/superstate`, `release/performance-fee`)
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
  - Monitor senior coverage ratio (should stay above 105%)
  - **Alert**: Coverage ratio below 105% (triggers protective measures -- junior redemptions halted)
  - Monitor for any pausing events (`setActionStates`)

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

- **Structured risk tranching**: srUSDe benefits from junior tranche (jrUSDe) first-loss protection. Current senior:junior asset ratio ~5.17:1; total-system collateralization ~119.3% of senior assets, well above the 105% circuit-breaker
- **Multi-layered governance**: 48h timelock for owner changes (verified active with 53 executions), two-step exit-fee changes, independent Guardian (Patrick Collins/Cyfrin) with CANCELLER role on the 48h timelock
- **Onchain transparency**: Exchange rate is programmatic (ERC-4626), accounting is fully onchain, and the codebase is open-source. Implementation contracts unchanged since November 2025 (no recent upgrades)
- **Multiple reputable audits**: 8 audit engagements across Cyfrin, Quantstamp, and Guardian Audits (one new Quantstamp engagement on the discrete-accounting mechanism since the previous assessment)
- **Active monitoring**: 24/7 monitoring via Hypernative with Guardian oversight
- **Reserve extraction is timelocked** (corrected from prior assessment): `RESERVE_MANAGER_ROLE` is held by the 24h Timelock, not the Admin Multisig — and the 24h Timelock currently has no executor, so reserve withdrawal to treasury is presently blocked outright

### Key Risks

- **Persistent TVL volatility**: protocol now exhibits **three sharp drawdown events** (Jan 8-17, Apr 2-4, Apr 23-25, 2026), each shedding 25-55% of TVL within days. Current TVL ($86.8M) is ~73% below the October 2025 peak ($326M) — worse than the 62.6% reported in Feb. The repeated boom-bust pattern is consistent with large-depositor and points-program concentration
- **Single critical dependency on Ethena (for srUSDe)**: All srUSDe-market funds flow into Ethena's sUSDe. An Ethena exploit or USDe depeg would directly impact srUSDe holders
- **Low multisig thresholds with overlapping signers**: Admin Multisig is 3-of-4, Operational Multisig is 2-of-3, and two of the three Operational signers also sit on the Admin Safe. All keys are internal-team-only
- **Pause is callable by a 2/3 internal-team multisig** (Operational), correcting the previous report's claim that pause was an Admin Multisig (3/4) function
- **No bug bounty program found**: Notable absence for a protocol managing tens of millions in TVL
- **Withdrawal delays**: Redemptions subject to cooldown periods tied to Ethena's sUSDe unstaking (~7 days)
- **Anonymous team**: Founding team not publicly identified. Patrick Collins (Guardian) is the only doxxed individual, in a security oversight role
- **Rapid multi-market expansion**: protocol grew from 1 market to 5 markets (Neutrl, Midas mHYPER, Midas mM1-USD, Saturn USDat) between Feb and May 2026, with no audits found covering the new markets. While srUSDe contracts are unchanged, broader operational and governance bandwidth is now stretched across five integrations
- **Stalled public repo**: Public GitHub last pushed Feb 25, 2026 — active development is happening on unmerged branches (`strat/morpho`, `strat/neutrl`, `strat/superstate`, `release/performance-fee`)

### Critical Risks

- **Junior tranche depletion**: If the junior tranche is fully depleted (e.g., prolonged negative yield or extreme outflows), senior tranche **may incur principal losses**. The 105% coverage circuit breaker provides some protection but is not a guarantee. Current jrUSDe `totalAssets` is ~$10M against ~$51.9M senior assets — adequate but the buffer has shrunk in absolute terms vs. the previous assessment
- **24h Timelock has no executor and has never executed a single call** since deployment in October 2025 — verified by `hasRole` queries against every known principal (including the zero-address sentinel) and by inspection of the deployment-tx constructor calldata which shows an empty `executors[]` array. Several roles that the protocol documentation routes through the 24h Timelock (RESERVE_MANAGER, UPDATER_STRAT_CONFIG, COOLDOWN_WORKER) cannot fire on that path. For srUSDe most of these functions are reachable via the 48h Timelock or other principals, but it is an unexplained governance misconfiguration that the team should address
- **Proxy upgrade risk**: Core contracts are upgradeable with 48h timelock. While the Guardian can cancel, this requires active monitoring

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Protocol audited by 3 reputable firms (Cyfrin, Quantstamp, Guardian) across 7+ engagements. **PASS**
- [x] **Unverifiable reserves** -- srUSDe exchange rate is programmatic onchain (ERC-4626). Underlying sUSDe holdings verifiable onchain. **PASS**
- [x] **Total centralization** -- 3-of-4 Gnosis Safe multisig with 48h timelock and independent Guardian. Not a single EOA. **PASS**

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 audit firms (Cyfrin, Quantstamp, Guardian) across **8 engagements** (one new Quantstamp on the discrete-accounting mechanism since Feb). Good coverage of the srUSDe codebase; new Neutrl/Midas/Saturn markets are **not separately audited** in publicly available reports.
- **Bug Bounty**: Still no active bug bounty program found. Unchanged gap.
- **Time in Production**: **~7.5 months** since official launch (October 2025). Still young but maturing.
- **TVL**: ~$86.8M current (down from $153M at the previous assessment); peaked at ~$326M. Three distinct sharp drawdown events now on record (Jan, early Apr, late Apr 2026), giving a peak-to-current decline of ~73%.
- **Incidents**: None reported in the Feb–May 2026 window.

**Score: 3.0/5** -- Audit coverage and time-in-production both modestly improved vs. the Feb assessment, but the protocol now has *three* sharp-drawdown events on its public record (vs. one previously) and TVL sits at ~$87M, the lowest level since the August 2025 ramp. Maintained at 3.0 — the additional audit and three extra months of operation offset the worsened TVL volatility and broader protocol surface area.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-4 Admin Multisig with cold wallets, all internal team signers (unchanged)
- 2-of-3 Operational Multisig, all internal team signers; two of three owners are also Admin signers (key-set overlap)
- 48h timelock for Ownable owner-level changes (proxy upgrades, core config) — active (53 historical executions)
- 24h timelock for strategy config / reserve management — **inoperative**: no executor configured, 0 historical executions over ~7 months
- Independent Guardian (Patrick Collins/Cyfrin) holds CANCELLER_ROLE on the 48h Timelock only
- Pause callable by Operational Multisig (2/3, internal-team) with no timelock — *corrected from previous assessment*
- Reserve withdrawal to treasury is timelocked (24h) and currently unreachable — *also corrected from previous assessment*
- No external/independent signers on either multisig

**Governance Score: 3.0** -- Two findings move in opposite directions vs. the prior assessment: (a) Reserve management is materially less risky than previously described (timelocked, currently blocked); (b) Pause is callable by a 2/3 internal multisig rather than the 3/4 Admin Multisig. The 24h timelock misconfiguration adds operational concern but does not currently widen attack surface. Net: held at 3.0.

**Subcategory B: Programmability**

- srUSDe exchange rate: fully onchain ERC-4626 (verified `convertToAssets(1e18) = 1.021541…`)
- Yield distribution (DYS): mostly programmatic using AprPairFeed from Aave
- Risk-premium parameters (x, y, k): set by team initially, planned transition to independent risk managers (not yet implemented)
- APR updates: triggered manually by Operational Multisig (but computation is onchain)
- Accounting: fully onchain
- Implementation contracts unchanged since November 2025 (no recent upgrade activity on the srUSDe stack)

**Programmability Score: 2.5** -- Unchanged. Most critical functions are onchain and programmatic; manual APR triggers and team-controlled risk parameters keep this above 2.0.

**Subcategory C: External Dependencies**

- **Critical**: Ethena sUSDe (single yield source for the srUSDe market, all funds deposited there)
- **High**: Aave v3 Core (single benchmark rate source)
- **High**: Gnosis Safe (multisig infrastructure)
- New since prior assessment: protocol-wide exposure to **Neutrl, Midas, and Saturn** as yield sources for sister markets — these don't affect srUSDe collateral directly but stretch team operational bandwidth
- No documented fallback mechanisms if critical dependencies fail

**Dependencies Score: 4.0** -- Unchanged. For srUSDe specifically, Ethena remains the single critical dependency with no fallback.

**Centralization Score = (3.0 + 2.5 + 4.0) / 3 = 3.17**

**Score: 3.2/5** -- Held at 3.2. Corrected reserve-extraction risk is offset by a lower pause threshold and the 24h-timelock misconfiguration. Multi-market expansion increases the protocol-wide complexity but doesn't directly degrade srUSDe-specific governance.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- srUSDe backed by sUSDe staked in Ethena's vault (onchain verifiable; sUSDeStrategy holds ~50.4M sUSDe per `balanceOf` query on May 19, 2026)
- Over-collateralized by junior tranche (first-loss capital). Senior:Junior asset ratio ~5.17:1; total-system collateralization ~119.3% of senior assets — above the 105% circuit breaker but tighter than the protocol's idealized targets
- 105% coverage circuit breaker provides protection
- Underlying collateral is USDe (Ethena's synthetic dollar -- backed by delta-neutral ETH/BTC strategy with CEX counterparty exposure)
- Reserve mechanism exists (configurable via timelock; treasury withdrawal currently blocked by the 24h-timelock executor gap)

**Collateralization Score: 2.5** -- Unchanged. Onchain backing remains verifiable. Reserve-extraction concern is reduced vs. the prior assessment (timelocked, currently unreachable) but Ethena synthetic-dollar dependency is the dominant risk.

**Subcategory B: Provability**

- Exchange rate: programmatic onchain (ERC-4626), `convertToAssets(1e18) = 1.021541647465871857` on May 19, 2026
- Strategy holdings: verifiable onchain (sUSDe balance in strategy contract)
- Accounting: fully onchain with transparent TVL tracking
- Underlying USDe collateral: relies on Ethena's proof of reserves (third-party verified)
- Risk-premium parameters: set by team, visible onchain once set

**Provability Score: 2.0** -- Unchanged.

**Funds Management Score = (2.5 + 2.0) / 2 = 2.25**

**Score: 2.25/5** -- Unchanged. Onchain provability remains strong; the Ethena dependency continues to dominate funds-management risk.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: Cooldown-based redemption (~7 days via Ethena sUSDe unstaking). Not instant. Unchanged.
- **DEX liquidity**: Still negligible relative to vault TVL. srUSDe is not the primary trading instrument; secondary market venues are Pendle (PT-srUSDe) and Morpho (srUSDe collateral)
- **Withdrawal restrictions**: 105% coverage circuit breaker can temporarily halt operations
- **Same-value redemption**: srUSDe redeems for USDe (stablecoin-denominated), minimal price change risk
- **Use case context**: For the Morpho use case (srUSDe as collateral for USDC loans), the collateral/loan price change should be minimal

**Score: 3.0/5** -- Unchanged. Redemptions remain available but not instant.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Partially anonymous. Founding team not publicly identified. Patrick Collins (Guardian) is the only doxxed individual, in a security oversight role
- **Documentation**: Comprehensive at docs.strata.markets; the public docs page now also covers the four new markets (Neutrl, Midas mHYPER, Midas mM1-USD, Saturn USDat). However, parts of the docs are out-of-date with respect to onchain state (e.g. PAUSER_ROLE is documented as Admin Multisig but is in fact held by the Operational Multisig)
- **Public GitHub activity**: Last push Feb 25, 2026 (~3 months stale); active development is on unmerged branches that are not visible from the master view
- **Legal Structure**: Frontera Labs, Inc. (Delaware) operates the front-end. Protocol contracts are autonomous and licensed under BUSL-1.1. Planned transition to Cayman Islands foundation. US users geo-blocked
- **Incident Response**: Not formally documented. 24/7 Hypernative monitoring + Guardian veto capability provide de facto incident response

**Score: 2.5/5** -- Held at 2.5. Strengths (legal clarity, monitoring) and weaknesses (anonymous team, doc drift, stalled public repo) roughly balance.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 3.2 | 30% | 0.96 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **2.81** |

**Final Score: 2.8**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |

**Final Risk Tier: Medium Risk**

---

Strata's srUSDe is a well-designed risk-tranching product with good audit coverage from reputable firms, multi-layered governance with independent Guardian oversight, and fully onchain accounting and exchange rate computation. The junior tranche first-loss protection adds meaningful risk mitigation beyond the underlying yield source.

The protocol is now ~7.5 months in production and has accumulated a longer (mostly clean) operational track record, but TVL volatility has worsened, not improved — there are now three sharp drawdown events on the public record, and current TVL ($86.8M) sits ~73% below the October 2025 peak. The protocol has also expanded rapidly to five live markets in three months, none of the new markets are separately audited, and an onchain governance check exposed a 24h-timelock executor misconfiguration that has gone unfixed for 7 months. Critical dependencies (Ethena, Aave) remain unchanged.

**For the intended Yearn use cases:**
1. **Direct srUSDe deposit**: Medium risk. The 7-day withdrawal cooldown and Ethena dependency are the primary concerns. The repeated TVL boom-bust pattern is worth watching for incident triggers (though no exploits have been observed).
2. **srUSDe as Morpho collateral (srUSDe/USDC)**: Lower effective risk for the specific use case since srUSDe is stablecoin-denominated and price changes should be minimal, but liquidation could be slow due to cooldown periods.

**Key conditions for exposure:**
- Monitor srUSDe exchange rate for any decreases (should only increase — currently 1.021541 USDe/srUSDe)
- Monitor senior coverage ratio (alert below 105%; currently ~119.3%)
- Monitor 48h Timelock for any scheduled changes (the 24h Timelock has not fired since deployment)
- Monitor USDe peg stability
- Track TVL for concentration risk signals (large outflows)
- Verify bug bounty program status with the team
- Verify with the team whether the 24h-timelock executor configuration is intentional or a bug requiring remediation

---

## Reassessment Triggers

- **Time-based**: Reassess in 60 days (per reassessment-scan threshold) or sooner if any of the below trigger
- **TVL-based**: Reassess if TVL changes by more than 50% (from current ~$87M)
- **Incident-based**: Reassess after any exploit, governance change, collateral modification, or Ethena incident
- **Dependency-based**: Reassess if Ethena modifies sUSDe mechanics, cooldown periods, or undergoes significant changes
- **Bug bounty**: Reassess if/when a bug bounty program is launched (should improve Audits score)
- **Governance-based**: Reassess when onchain governance is activated, when risk-premium parameters transition to independent managers, or when the 24h-Timelock executor misconfiguration is resolved
- **Market expansion**: Reassess if the new Neutrl/Midas/Saturn markets receive separate audits or if any of them experience an incident (operational spillover risk to srUSDe)
