# Protocol Risk Assessment: Yearn — ysyBOLD

- **Assessment Date:** November 19, 2026
- **Token:** ysyBOLD (Staked yBOLD)
- **Chain:** Ethereum
- **Token Address:** [`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD)
- **Final Score: 2.30/5.0**

## Overview + Links

ysyBOLD is the **yield-bearing staking wrapper of yBOLD**, Yearn's BOLD vault on Liquity V2. The stack has two user-facing layers:

1. **yBOLD** ([`0x9F4330700a36B29952869fac9b33f45EEdd8A3d8`](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)) is a Yearn V3 multi-strategy vault (v3.0.4). It takes BOLD and spreads it across three Yearn strategies, each depositing into one Liquity V2 Stability Pool (WETH, wstETH, rETH). Its Accountant charges a **100% performance fee** on reported gains after covering any shortfall below 1 BOLD per share. The vault mints fee shares to the Accountant for distribution. Stored PPS was **1.0 BOLD** at the snapshot. [Accountant source](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa#code)
2. **ysyBOLD** ([`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD)) is a Yearn V3 TokenizedStrategy (v3.0.4) whose asset is yBOLD. It was the Accountant's fee recipient at the snapshot. On report, it calls its immutable Accountant to distribute accrued shares to the configured recipient. Gains it receives unlock over **3 days** (`profitMaxUnlockTime = 259200`), subject to a 10% performance fee. [Staker source](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD#code)

**Yield sources** ([Yearn docs](https://docs.yearn.fi/getting-started/products/yvaults/yBold)):

- Liquity V2 borrower interest paid to Stability Pool depositors in BOLD (75% of interest per the docs)
- Liquidation gains: when a Trove is liquidated, the Stability Pool burns BOLD and receives the Trove's collateral at a discount. Yearn sells this collateral back into BOLD through per-strategy Dutch auctions.

All onchain figures were read at **block [26,450,218](https://etherscan.io/block/26450218)** (hash `0x6e89ed223e9376209753603b9c4857f49ca5eb4b811b43b2ff788e6067543795`, timestamp 1795104431 = November 19, 2026 16:07:11 UTC) with `cast` against Ethereum mainnet, unless another block is stated.

**Key metrics (snapshot):**

| Metric | Value | Source |
|--------|-------|--------|
| ysyBOLD `totalAssets()` | 7,407,855.86 yBOLD | `ysyBOLD.totalAssets()` |
| ysyBOLD `totalSupply()` | 6,708,399.43 ysyBOLD | `ysyBOLD.totalSupply()` |
| ysyBOLD price per share | **1.104266 yBOLD** | `ysyBOLD.pricePerShare()` |
| yBOLD `totalAssets()` / `totalSupply()` | 7,613,633.94 BOLD / 7,613,633.94 yBOLD | yBOLD vault |
| yBOLD price per share | **1.000000** | `yBOLD.pricePerShare()` |
| Share of yBOLD supply staked in ysyBOLD | **97.3%** (7,407,855.86 / 7,613,633.94) | `yBOLD.balanceOf(ysyBOLD)` |
| yBOLD idle / debt | 0 / 7,613,633.94 BOLD | `totalIdle()` / `totalDebt()` |
| ysyBOLD net yield, 30 days | ~5.2% annualized (1.099712 on [Oct 20, 2026](https://etherscan.io/block/26234218) → 1.104266) | `pricePerShare()` at past blocks |
| ysyBOLD net yield, 1 year | ~6.2% (1.039560 on [Nov 17, 2025](https://etherscan.io/block/23822218) → 1.104266) | `pricePerShare()` at past blocks |

**Strategy allocation (yBOLD vault):**

| Strategy | Liquity V2 branch | Current debt (BOLD) | Allocation | yBOLD share of that Stability Pool |
|----------|-------------------|--------------------:|-----------:|-----------------------------------:|
| [Liquity V2 wstETH Stability Pool](https://etherscan.io/address/0x3589b93CaDb464b6E1974Cc9fc0c9be698Ee49a5) | wstETH | 3,462,558.74 | **45.5%** | 52.7% of 6,574,027 |
| [Liquity V2 WETH Stability Pool](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75) | WETH | 2,305,490.90 | **30.3%** | 39.4% of 5,846,247 |
| [Liquity V2 rETH Stability Pool](https://etherscan.io/address/0x6ED566B76838A08d04cBd6323231B08a2eC69005) | rETH | 1,845,584.30 | **24.2%** | 68.5% of 2,693,822 |

Per-strategy `current_debt` sums exactly to `totalDebt()`. Stability Pool shares compare each strategy's `getCompoundedBoldDeposit()` with its pool's `getTotalBoldDeposits()`. Across the three pools, yBOLD holds **~50.4%** of all Stability Pool BOLD (7.61M of 15.11M) and **~25.2%** of BOLD supply (30.22M, `BOLD.totalSupply()`).

**Links:**

- [yBOLD product page](https://ybold.yearn.fi/)
- [Yearn yBOLD documentation](https://docs.yearn.fi/getting-started/products/yvaults/yBold)
- [Yearn vault page (yBOLD)](https://yearn.fi/v3/1/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)
- [yBOLD GitHub repository](https://github.com/yearn/yBOLD)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [Liquity V2 technical docs and audits](https://docs.liquity.org/v2-documentation/technical-docs-and-audits)
- [DeFiLlama: Liquity V2](https://defillama.com/protocol/liquity-v2)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)

## Contract Addresses

### Token and Vault Layer

| Contract | Address | Type / Notes |
|----------|---------|--------------|
| ysyBOLD (Staked yBOLD) | [`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD) | `LV2SPStakerStrategy`, Yearn TokenizedStrategy v3.0.4. Delegates to the immutable [TokenizedStrategy](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c). Created [May 26, 2025](https://etherscan.io/tx/0x8c2bafb1b31e340b9c8f97180256d21b6d460061c62e0eacff807dee085f81c9) |
| yBOLD vault | [`0x9F4330700a36B29952869fac9b33f45EEdd8A3d8`](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8) | Yearn V3 Vault v3.0.4, Vyper minimal proxy of [`0xd8063123bba3b480569244ae66bfe72b6c84b00d`](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d). Created [May 26, 2025](https://etherscan.io/tx/0x1606c33ba741e5888f02dd1eead5a303a52ed99cf584cde176646b452d3fd359) |
| yBOLD Accountant | [`0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa`](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa) | 100% performance fee on gains above the shortfall to 1 BOLD per share. `feeRecipient` = ysyBOLD at the snapshot |
| OnLossDepositLimit | [`0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62`](https://etherscan.io/address/0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62) | yBOLD `deposit_limit_module`. Returns 0 when `yBOLD.pricePerShare() < 1e18` |
| ysyBOLD fee recipient | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Yearn's general Accountant; receives ysyBOLD's 10% performance fee shares |
| BOLD | [`0x6440f144b7e50D6a8439336510312d2F54beB01D`](https://etherscan.io/address/0x6440f144b7e50D6a8439336510312d2F54beB01D) | Liquity V2 stablecoin, the vault asset |

### Strategies and Auctions

All three strategies were created on [February 19, 2026](https://etherscan.io/tx/0x8da469ad1d8243142bcb0efc7ed3bf756b32adcb91ede9c6f7461154c6401784). They were activated on [February 27, 2026](https://etherscan.io/tx/0x5e4c8a5fa549e439d0b006c326d812b23470ae519a75f6fd95494afe1ccb02ae) in a ySafe transaction executed through the timelock. That same transaction revoked the original May 2025 strategies ([`0x2048…7961`](https://etherscan.io/address/0x2048a730f564246411415f719198d6f7c10a7961), [`0x46af…6214`](https://etherscan.io/address/0x46af61661b1e15da5bfe40756495b7881f426214), [`0x2351…1d2`](https://etherscan.io/address/0x2351e217269a4a53a392bffe8195efa1c502a1d2)).

| Strategy | Stability Pool | Collateral | Auction (v1.0.4, minimal proxy) | Liquity price feed |
|----------|----------------|------------|---------------------------------|--------------------|
| [WETH SP `0xc5e7…5b75`](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75) | [`0x5721…F9bF`](https://etherscan.io/address/0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF) | WETH | [`0x61C9…9381`](https://etherscan.io/address/0x61C9e1113661C991fb6377B3610804476Dcd9381) | [`0xCC5F…c24F`](https://etherscan.io/address/0xCC5F8102eb670c89a4a3c567C13851260303c24F) |
| [wstETH SP `0x3589…49a5`](https://etherscan.io/address/0x3589b93CaDb464b6E1974Cc9fc0c9be698Ee49a5) | [`0x9502…e56B`](https://etherscan.io/address/0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B) | wstETH | [`0x64e8…5CcA`](https://etherscan.io/address/0x64e8050D33BB296d48FE8eb08d09F00633e45CcA) | [`0xe7Aa…314E`](https://etherscan.io/address/0xe7Aa2Ba9E086A379d3beb224098bC634a46e314E) |
| [rETH SP `0x6ED5…9005`](https://etherscan.io/address/0x6ED566B76838A08d04cBd6323231B08a2eC69005) | [`0xd442…8695`](https://etherscan.io/address/0xd442E41019B7F5C4dD78F50dc03726C446148695) | rETH | [`0x3793…8091`](https://etherscan.io/address/0x3793405FBcE404f351e76fa115209488aC0e8091) | [`0x34F1…7b2B`](https://etherscan.io/address/0x34F1E9c7dcc279ec70d3c4488EB2D80FBa8B7b2B) |

Each auction is a minimal proxy of the verified [`Auction` implementation](https://etherscan.io/address/0xecdfb5bebb9e72ca7c8b6aeeb0ca07375c1c0b2e). The strategy constructor creates it ([source](https://github.com/yearn/yBOLD/blob/master/src/Strategy.sol)) and makes the strategy its `governance` and `receiver`, with `governanceOnlyKick = true`.

### Governance Contracts

| Contract | Address | Configuration (snapshot) |
|----------|---------|--------------------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | `role_manager` of yBOLD. `governance()` = TimelockController. `chad()` = ySafe, the recipient for a role-manager handoff |
| Daddy / ySafe | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Safe. yBOLD roles `0x3FF6` (all except ADD_STRATEGY and ACCOUNTANT) |
| Brain | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | **3-of-6 Safe**. yBOLD roles `0x3972`. **`management` of ysyBOLD and of all three strategies**, ysyBOLD `emergencyAdmin`, Accountant `feeManager` |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Safe. yBOLD roles `0x20C0` (DEBT, MAX_DEBT, EMERGENCY). `emergencyAdmin` of the three strategies |
| Strategy Manager (TimelockController) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | `getMinDelay()` = **604,800 s (7 days)**. yBOLD roles `0x8F` (ADD_STRATEGY, REVOKE, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT) |
| Keeper (yHaaSRelayer) | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yBOLD REPORTING (`0x20`). `keeper` of ysyBOLD and the strategies |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | yBOLD REPORTING + DEBT_MANAGER (`0x60`) |
| ySafe BORG guard | [`0xe1c90a1f8a9553b31110dd6feead76e79a6ed419`](https://etherscan.io/address/0xe1c90a1f8a9553b31110dd6feead76e79a6ed419) | Blacklist mode, zero required directors, no policy entry for yBOLD or its Role Manager |

Timelock roles (`hasRole` at the snapshot):

- **PROPOSER** and **EXECUTOR**: ySafe.
- **EXECUTOR**: TimelockExecutor [`0xf8f6…779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b).
- **CANCELLER**: ySafe and Brain.
- **TIMELOCK_ADMIN**: only the timelock itself. ySafe does not hold `DEFAULT_ADMIN`.

The shared timelock's role model is documented in the [yvUSDC-1 assessment](https://github.com/yearn/risk-score/blob/3f8d6ed09011b9199c66be8a897b7e66ccd0c0b0/reports/report/yearn-yvusdc.md#appendix-timelockcontroller-role-structure).

Brain and Security share two signers ([`0x5250…0bDB`](https://etherscan.io/address/0x5250077c42627cBd112988f32D482acC9ff40bDB) and [`0x80a3…A8B2`](https://etherscan.io/address/0x80a3887BA60F76acAb48EE4aEAd0a71A0774A8B2)).

## Audits and Due Diligence Disclosures

### yBOLD-specific audit

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| Sherlock public contest | May 22–25, 2025 (final report June 20, 2025) | `Strategy.sol`, `Staker.sol`, factories, `Accountant.sol`, interfaces at commit `845c5151`. The `Auction` contract and `OnLossDepositLimit` were **not** in scope | [PDF in yearn/yBOLD](https://github.com/yearn/yBOLD/tree/master/audit), [judging repo](https://github.com/sherlock-audit/2025-05-yearn-ybold-judging) |

**Code changed after the audit.** The deployed strategies (created February 2026) include post-contest changes to `Strategy.sol`, `Staker.sol` and `Accountant.sol`:

- size: about 100 lines added and 30 removed relative to `845c5151`;
- content: auction floor and start-price logic from the Liquity oracle, oracle staleness handling, claim-on-report, a separate asset dust threshold, and the Accountant waiving fees while PPS < 1;
- review: Yearn developers reviewed it internally in [yearn/yBOLD#6](https://github.com/yearn/yBOLD/pull/6) (merged October 16, 2025) and later commits through January 2026;
- deployed code: the post-audit constants are on the live strategy (`ASSET_DUST_THRESHOLD()`, `ORACLE_DOWN_BUFFER_PCT_MULTIPLIER() = 200`);
- external coverage: this report found no external audit of the changes (`TODO`: confirm with Yearn).

The contest reported **2 High and 1 Medium**. All three are marked *"acknowledged by the team but won't be fixed"*:

- **H-1 ([#154](https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/154)):** first-depositor share inflation on a newly deployed strategy. It doesn't apply to the live strategies, which each hold 1.8M or more shares owned by the yBOLD vault.
- **H-2 ([#155](https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/155)):** a report can price strategy shares before liquidation collateral has been converted back into BOLD, exposing existing holders to dilution. Brain can change the strategy deposit and loss-report settings without a timelock. The sBOLD case study below compares this finding with the November 2026 incident.
- **M-1:** `dustThreshold` has no maximum, so management can make `tend()` skip claiming collateral (a liveness issue).

### Yearn V3 core audits

Vault and TokenizedStrategy: ChainSecurity (v3.0.0, May 2023), yAcademy (v3.0.1, July 2023), Statemind (v3.0.2, March 2024). See the [yearn-security audits folder](https://github.com/yearn/yearn-security/tree/master/audits). The `Auction` contract is from [tokenized-strategy-periphery](https://github.com/yearn/tokenized-strategy-periphery). This report found no dedicated external audit of the periphery Auction v1.0.4 (`TODO`: confirm with Yearn).

### Liquity V2 (underlying protocol)

Per the [Liquity V2 docs](https://docs.liquity.org/v2-documentation/technical-docs-and-audits), the core protocol was audited by:

- ChainSecurity ([core, December 2024](https://www.chainsecurity.com/security-audit/liquity-bold-smart-contracts))
- Dedaub (August and November 2024, plus a [May 2025 review of the Cantina fixes](https://dedaub.com/audits/liquity/liquity-v2-cantina-fixes-review-may-13-2025/))
- Coinspect (December 2024)
- Recon (October 2024)
- A [Cantina public competition](https://cantina.xyz/competitions/d86632df-ab33-4448-8198-64955eae6712) in March–April 2025

Formal verification (Certora specs) is in the [liquity/bold repository](https://github.com/liquity/bold/tree/main/contracts/certora).

### Bug Bounty

- **Yearn:** The [yvUSDC-1 assessment](https://github.com/yearn/risk-score/blob/3f8d6ed09011b9199c66be8a897b7e66ccd0c0b0/reports/report/yearn-yvusdc.md#bug-bounty) records a $200,000 [Immunefi](https://immunefi.com/bounty/yearnfinance/) maximum. `TODO`: confirm yBOLD contract coverage.
- **Liquity:** a bug bounty run by Liquity AG on Hats Finance, covering V1 and V2 ([Liquity blog](https://www.liquity.org/blog/auditing-liquity-v2)). Maximum payout `TODO`.
- **Safe Harbor:** The [yvUSDC-1 assessment](https://github.com/yearn/risk-score/blob/3f8d6ed09011b9199c66be8a897b7e66ccd0c0b0/reports/report/yearn-yvusdc.md#bug-bounty) records no Yearn listing on the SEAL Safe Harbor registry.

### Onchain Complexity

Moderate:

- Two share layers: ysyBOLD wraps yBOLD.
- A 100%-fee Accountant converts all vault profit into fee shares for ysyBOLD.
- Three Stability Pool strategies, each with a dedicated collateral auction.
- Accounting is **report-boundary only** (v3.0.4). Collateral is not counted until an auction has sold it and a keeper reports.
- Each strategy is about 320 lines of code; the staker is 58 ([yearn/yBOLD](https://github.com/yearn/yBOLD/tree/master/src)).
- No leverage, no cross-chain components, no upgradeable proxies.

## Case Study: K3 Capital sBOLD Exploit and Why ysyBOLD Is Not Exposed

### What happened to sBOLD

Source: K3 Capital, [*sBOLD Vault Exploit: Postmortem and Recovery Plan*](https://x.com/k3_capital/status/2123395654214967426), November 19, 2026. The technical analysis was done by ChainSecurity for K3. Quotes below are from the post-mortem.

On **November 18, 2026, 12:25–12:33 UTC**, attackers drained **~3.43M BOLD**, nearly all of sBOLD's assets, in **99 transactions** by **ten operators**, starting at block [26,441,929](https://etherscan.io/block/26441929). The vault was paused at 13:05 UTC. Like yBOLD, sBOLD is an ERC-4626 vault spreading BOLD across the three Liquity V2 Stability Pools. The post-mortem says Liquity V2 and 1inch were not exploited, and **no Liquity liquidations were involved**. That corrects the early reports.

The root cause combines **two flaws**:

1. **The share price counted any collateral the vault held, live.** *"Total assets are the BOLD in the three stability pools, the BOLD in the vault, the value of unclaimed collateral in the pools, and the value of collateral held directly by the vault. Any collateral sent to the vault therefore raises the share price."* The price was recomputed on every deposit and redeem.
2. **Anyone could call `swap()` with their own 1inch calldata, and it left the approval behind.** [`SwapLogic._execute`](https://github.com/K3Capital/sBOLD/blob/master/contracts/libraries/logic/SwapLogic.sol) approves `_inAmount` of collateral to the 1inch Aggregation Router v6, calls it with the caller's data, and checks only that enough BOLD arrived. *"It does not verify that the adapter actually took the collateral. It does not reset the allowance to zero after the call."* The router's `swap(executor, desc, data)` lets the caller choose the token sold and the executor contract.

**One round of the attack** (each transaction ran 8 rounds):

1. **Setup:** flash-borrow wstETH (Morpho) and WETH (Balancer), open a Liquity V2 trove, and borrow BOLD worth several times the vault's assets (the first attack used 9.01M BOLD).
2. **Deposit** the BOLD into sBOLD, taking most of the shares (72.4% in the first round).
3. **Donate** 4 WETH to the vault with a plain transfer. The share price rises.
4. **Fake swap:** call `swap()` for the 4 WETH with a crafted order that sells an attacker-owned dummy token and delivers the BOLD the vault expects. No WETH leaves, so the received BOLD acts as a second donation, and the WETH approval to the router stays unused.
5. **Redeem** all shares at the inflated price.
6. **Take the WETH back:** call `swap()` again for a dust amount of wstETH, with an order that sells WETH. The router spends the leftover approval and sends the 4 WETH to the attacker.

Why this works: per the post-mortem, the profit per round is about *(2 × attacker's share − 1) × donated WETH value*, positive once the attacker owns more than 50% of the shares. **Neither flaw pays off alone:** *"Without the leftover approval, an attacker cannot recover its donation and loses money."*

Each round extracted only ~3,200–7,460 BOLD, because sBOLD refuses redemptions while it holds more than 7,500 BOLD of collateral. Gas limits held each transaction to 8 rounds, so the drain needed ~100 transactions. Once the first one landed, others copied it: attackers paid **~986 ETH (~1.77M BOLD) to block builders**, which went to 21 validator fee recipients.

Other details from the post-mortem:

- Pendle's SY-sBOLD (12.79% of sBOLD shares) was also affected.
- K3 identified counterparties holding 894.50 ETH and **131,316 yBOLD** from the exploit and listed Yearn among the parties committed to the recovery. The Historical Track Record section records the same-size Accountant distribution and the outstanding question about its purpose.
- Recovery address: [`0x2f02BCd2163176B29C7B070B43A1660A5341C795`](https://etherscan.io/address/0x2f02BCd2163176B29C7B070B43A1660A5341C795), with a 15% bounty.

> Early reports ([CoinDesk](https://www.coindesk.com/tech/2026/11/19/ethereum-block-builders-received-the-most-in-a-usd3-4-million-vault-hack-data-shows), [Cryptonews / Blockaid](https://cryptonews.net/news/security/33775498/), [Altcoinbuzz / Bitquery / DefiLlama](https://www.altcoinbuzz.io/3-42-million-drained-from-k3-capital-s-sbold-vault-in-eight-minutes)) said self-liquidations or collateral "excluded below a threshold" were involved. The post-mortem rules out liquidations. The 7,500-BOLD collateral cap that limited each round is probably the "threshold" those reports meant.

### Why the sBOLD attack does not work against yBOLD / ysyBOLD

Both flaws are needed, and **neither exists in yBOLD**:

| sBOLD ingredient | yBOLD / ysyBOLD at the snapshot | Evidence |
|------------------|----------------------------------|----------|
| **Donations raise the share price instantly**, because collateral and BOLD balances count live on every deposit and redeem | All share contracts run **v3.0.4 report-boundary accounting**. Deposits and redeems use the stored `totalAssets`; tokens sent to the vault, a strategy or ysyBOLD don't count until a keeper reports. **Collateral never counts**: strategies value themselves in BOLD only (`asset.balanceOf + getCompoundedBoldDeposit`). Donated BOLD reaches holders only after three keeper steps (strategy report → vault `process_report`, where the 100% fee keeps yBOLD at 1.0 → ysyBOLD report), then a **3-day** release. Someone who deposits and redeems in one transaction gets no part of a donation | `apiVersion() = "3.0.4"`; [`estimatedTotalAssets`](https://github.com/yearn/yBOLD/blob/master/src/Strategy.sol); ysyBOLD `profitMaxUnlockTime() = 259200`; yBOLD `pricePerShare() = 1e18` |
| **Outsiders deposit into the contract that holds collateral** and own most of its shares | Strategy deposits are allowlisted and yBOLD holds 100% of strategy shares at the snapshot. yBOLD and ysyBOLD hold BOLD or yBOLD respectively. | `openDeposits()`, `allowed(yBOLD)`, `balanceOf(yBOLD) == totalSupply()` |
| **Anyone can call `swap()` with their own router calldata** (a caller-chosen token and executor) | The strategy sends collateral to its own auction for sale. The strategy alone can kick that auction through keeper-gated `tend()` (`governanceOnlyKick = true`). Public auction purchases use the payment checks below. | [Deployed strategy source](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75#code) |
| **A leftover router approval** lets the attacker take the donation back | The strategies, ysyBOLD, yBOLD and the Accountant hold **no standing allowances**. The vault's BOLD approvals to strategies are set per debt update and are 0 at the snapshot. Stability Pool deposits use Liquity's `sendToPool`, which needs no approval | `Approval` logs scanned on BOLD, WETH, wstETH, rETH and yBOLD for every yBOLD contract (Etherscan), checked with `allowance()` at the snapshot |
| **The vault checks only BOLD received**, not collateral sent | Auction buyers call `take()`: the auction sends a fixed collateral amount, optionally calls the **buyer's own** contract, then pulls the full BOLD price from the buyer with `transferFrom`, or reverts. The price falls over time and has a floor at 95% of the Liquity oracle | [Auction v1.0.4 `_take`](https://etherscan.io/address/0xecdfb5bebb9e72ca7c8b6aeeb0ca07375c1c0b2e#code) |

**The only standing approvals** are each auction's `type(uint256).max` approval of its collateral (WETH, wstETH, rETH) to CoW Protocol's [`GPv2VaultRelayer`](https://etherscan.io/address/0xC92E8bdf79f0507f65a392b0ab4667716BFE0110), set by `enable()`. Unlike the 1inch router used by sBOLD:

- the relayer only acts for CoW's settlement contract;
- the auction accepts a CoW order only through `isValidSignature`, which requires the buy token to be BOLD, the receiver to be the strategy, a buy amount at or above the current auction price, no fee, a sell amount at most the kicked lot, and expiry within the auction window.

A caller can't pick the token or the receiver, so this approval can't be used to take collateral without paying the auction price. It covers only collateral sitting in an auction, which was 0 at the snapshot.

**Running sBOLD's attack against yBOLD:**

- A donation to a yBOLD strategy or to ysyBOLD doesn't move any price within the transaction.
- It reaches ysyBOLD holders only after keeper reports and a 3-day release.
- The donor can't take it back, because no contract leaves an approval behind.

Per the post-mortem's own reasoning, the donation is then a pure loss for the attacker.

### Related class: share price lowered after liquidations (yBOLD Sherlock H-2)

The [May 2025 ChainSecurity audit of sBOLD](https://www.chainsecurity.com/security-audit/k3-sbold) and [Sherlock H-2](https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/155) both describe share pricing that can omit liquidation collateral. This audit finding is separate from the November 2026 incident. yBOLD strategies report only BOLD held directly and compounded BOLD in the Stability Pool. A report before a collateral sale can price shares below the combined value of BOLD and recoverable collateral. Stored accounting still allows H-2 because the finding spans reports. [Deployed strategy source](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75#code)

| Layer | Safeguard at the snapshot | Who can change it |
|-------|---------------------------|-------------------|
| Liquity strategies | `openDeposits = false`, `allowed(yBOLD) = true`, and yBOLD holds all strategy shares. `doHealthCheck = true` and `lossLimitRatio = 0` block a report with a net BOLD loss. Strategy gains are recognized immediately at report (`profitMaxUnlockTime = 0`). | Brain (3-of-6, no delay) can change deposit access or relax the loss check. |
| yBOLD vault | `OnLossDepositLimit` stops new BOLD deposits when recorded yBOLD PPS falls below 1.0. The Accountant uses gains to restore the vault to par before charging fees on the excess. | Brain or ySafe can replace the deposit-limit module without a delay. |
| ysyBOLD staker | Gains received by the staker unlock over 3 days. The vault's deposit gate applies at yBOLD only. | Brain can change the unlock period without a delay. |

Liquidation collateral replaces burned BOLD, so the value exposed to dilution includes recovery of depositor principal. Exposure for the strategy-level finding depends on the recoverable collateral value and on how much dilution occurs. At the snapshot, every strategy and auction had zero unsold collateral across `getDepositorCollGain`, `stashedColl`, and token balances. `TODO`: measure historical peak unsold collateral in BOLD terms and enumerate every `setAllowed` call. The mapping has no member list and the setter emits no event. [Deployed strategy source](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75#code)

## Historical Track Record

- **Deployed:** yBOLD vault, Accountant and ysyBOLD on May 26, 2025 (blocks 22,569,667–22,569,894), one week after Liquity V2's relaunch. That is **~18 months** in production.
- **Strategy migration:** the three original strategies were replaced by the current ones on February 27, 2026 as documented in Strategies and Auctions above. New strategies have been live for **~9 months**.
- **TVL history** (yBOLD `totalAssets()` / ysyBOLD `totalAssets()`):

| Date | Block | yBOLD (BOLD) | ysyBOLD (yBOLD) | ysyBOLD PPS |
|------|------:|-------------:|----------------:|------------:|
| Nov 17, 2025 | [23,822,218](https://etherscan.io/block/23822218) | 8,984,934 | 8,984,410 | 1.039560 |
| May 22, 2026 | [25,154,218](https://etherscan.io/block/25154218) | 5,180,741 | 5,017,959 | 1.071509 |
| Aug 21, 2026 | [25,802,218](https://etherscan.io/block/25802218) | 5,877,675 | 5,788,834 | 1.088682 |
| Oct 20, 2026 | [26,234,218](https://etherscan.io/block/26234218) | 7,411,320 | 7,333,810 | 1.099712 |
| Nov 19, 2026 | [26,450,218](https://etherscan.io/block/26450218) | 7,613,634 | 7,407,856 | 1.104266 |

- **Reported losses:** zero across 1,258 yBOLD `StrategyReported` events and 329 ysyBOLD `Reported` events through the snapshot. Vault redemptions can realize losses in the withdrawal flow. `TODO`: reconcile historical withdrawals against their share value at execution to quantify any losses outside reports. [Vault implementation](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d#code)
- **Accountant distribution:** at [block 26,448,914](https://etherscan.io/block/26448914), Brain switched the fee recipient from ysyBOLD to itself, received **131,316 yBOLD**, and restored ysyBOLD as recipient in the same transaction. Brain still held 131,316 yBOLD at the snapshot, and the Accountant balance was zero. Cumulative yBOLD strategy gains were 809,808.95 BOLD and cumulative ysyBOLD reported gains were 678,492.95 yBOLD. The difference matches this distribution at the 1:1 vault rate. The amount also matches the yBOLD amount K3 identified in its recovery update. `TODO`: verify with Yearn whether the transfer was part of that recovery and how it affected ysyBOLD holders. [Distribution transaction](https://etherscan.io/tx/0x27bd72f9a183359b68b2c313a1f145e03d3bb7539069eb43ffee367cdbf2a677) · [K3 post-mortem](https://x.com/k3_capital/status/2123395654214967426)
- **Security incidents:** none known for yBOLD or ysyBOLD.
- **Liquity V2 incidents:** a Stability Pool issue in the original Liquity V2 deployment led to a **redeployment and relaunch on May 19, 2025** ([Liquity blog](https://www.liquity.org/blog/stability-pool-issue), [relaunch](https://www.liquity.org/blog/liquity-v2-redeployment)). yBOLD launched on the redeployed contracts.
- **Liquity V2 TVL:** $67.2M on November 19, 2026, down from a $180.0M peak on October 7, 2025 ([DeFiLlama](https://defillama.com/protocol/liquity-v2), `fetch_defillama_tvl.py liquity-v2`). All three branches have `shutdownTime() = 0` (not shut down).
- **Concentration:** ysyBOLD holds 97.3% of yBOLD. The distribution of ysyBOLD holders was not enumerated (`TODO`: top-holder breakdown).

## Funds Management

Each strategy deposits BOLD into one Liquity V2 Stability Pool. Interest is claimed in BOLD and redeposited at report. Liquidation collateral is claimed during `tend()` and sold through the strategy's Dutch auction for BOLD, which goes back to the strategy (`receiver`). The Debt Allocator and Brain rebalance the three strategies; the [docs](https://docs.yearn.fi/getting-started/products/yvaults/yBold) say allocation is re-checked every 30 minutes.

**Auction parameters (all three strategies):**

- `bufferPercentage = 1.15e18`: starting price is 115% of the Liquity oracle price, ×200 if the oracle is down or not on its primary source.
- `minAuctionPriceBps = 9500`: floor at 95% of the oracle price, set on each kick.
- Decay of 0.5% per 60 s step (`stepDecayRate = 50`, `stepDuration = 60`); auction length 1 day.
- `maxAuctionAmount = type(uint256).max`; `dustThreshold = 1e15`.
- No auction was active at the snapshot (`isActive = false`), and every collateral balance was 0.

**Monitoring of fund delegation:** three Liquity strategies held the vault's debt at the snapshot. Monitor `StrategyChanged`, `DebtUpdated`, `RoleSet`, `UpdateFutureRoleManager`, `UpdateRoleManager` and each strategy's Stability Pool share.

### Accessibility

- **ysyBOLD deposits / withdrawals:** anyone can deposit or withdraw yBOLD (ERC-4626). `availableDepositLimit` and `availableWithdrawLimit` are unlimited. There is no cooldown. Exits are atomic.
- **yBOLD deposits:** anyone can deposit BOLD, unless yBOLD's price per share is below 1.0 (`OnLossDepositLimit`).
- **yBOLD withdrawals:** permissionless and atomic when the strategy queue can fulfill the request. A withdrawal limit module can cap exits. The module address was zero at the snapshot. [Vault implementation](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d#code)
- **Fees:** yBOLD charges 100% on gains remaining after recovery to par. Brain controls the Accountant's recipient, which was ysyBOLD at the snapshot. ysyBOLD takes a 10% performance fee and no management fee.

### Token Mint Authority

**Mint mechanism:** ERC-4626 deposits that anyone can make. There is no privileged minter role in TokenizedStrategy (ysyBOLD) or in the V3 Vault (yBOLD).

**Mint backing:** User mints require an asset transfer in the same transaction. Under the snapshot configuration, fee shares were issued against reported profit:

- ysyBOLD mints its 10% performance-fee shares to [`0x5A74…DE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) during `report()`.
- yBOLD mints fee shares to the Accountant during `process_report()`. The Accountant caps fees at `gain` and waives them until any shortfall is repaid ([`Accountant.report`](https://github.com/yearn/yBOLD/blob/master/src/periphery/Accountant.sol)).

**Per-address mint authority** (from source and onchain role reads at the snapshot):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any caller of `ysyBOLD.deposit()` / `mint()` | ✓ | ✓ (own shares) | ERC-4626 (anyone) | Backed by a yBOLD transfer in the same transaction |
| ysyBOLD `keeper` / `management` via `report()` | ✓ (fee shares) | — | TokenizedStrategy `onlyKeepers` | Fee shares cover only reported profit (10%) |
| Any caller of `yBOLD.deposit()` | ✓ | ✓ (own shares) | ERC-4626 (anyone) | Blocked while yBOLD PPS < 1 |
| yBOLD REPORTING_MANAGER via `process_report()` | ✓ (fee shares to the Accountant) | — | V3 vault role (Keeper, Debt Allocator, Brain, ySafe) | Deployed Accountant caps fees at the gain. A replacement Accountant can change this bound. |

**Rate limits / supply caps:** none. yBOLD `deposit_limit` is unlimited, gated only by `OnLossDepositLimit`.

**Backing check at mint time:** atomic.

### Collateralization

- **Backing at the snapshot:** ysyBOLD held 7,407,855.86 yBOLD. An `eth_call` from the staker at the pinned block redeemed that yBOLD for 7,407,855.86 BOLD with `max_loss = 0`. This verifies coverage for the staker's position at that block. [Snapshot block](https://etherscan.io/block/26450218) · [yBOLD vault](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)
- **Collateral quality:**
  - BOLD is backed by overcollateralized ETH, wstETH and rETH Troves.
  - Stability Pool deposits are first-loss capital for liquidations. They burn BOLD and receive collateral at a liquidation discount.
  - If a liquidation leaves bad debt, or the collateral can't be sold above its value, depositors take a real loss.
- **Stored accounting can lag backing.** Strategies exclude unsold collateral from reports. A Stability Pool liquidation immediately reduces the live compounded BOLD deposit, while the stored share value can remain at its pre-liquidation level. During that interval, reported assets can exceed the BOLD available for withdrawal. [Strategy source](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75#code) · [Vault implementation](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d#code)
- **Leverage:** none.
- **Risk curation:** Brain sets auction parameters. The debt split across branches is automated (Debt Allocator) and can be adjusted by Brain.

### Provability

- **Reserves:** add each strategy's live `getCompoundedBoldDeposit(strategy)` and on-hand BOLD, then compare the sum plus vault idle BOLD with stored `totalAssets()`. Track unsold collateral separately. [Strategy source](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75#code)
- **Exchange rate:** ysyBOLD price per share uses stored assets and effective supply after profit unlocking. The yBOLD Accountant targets 1.0 BOLD per share through its fee rule. Losses and privileged changes can move yBOLD PPS away from 1.0. [Accountant source](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa#code) · [TokenizedStrategy implementation](https://etherscan.io/address/0xD377919FA87120584B21279a491F82D5265A139c#code)
- **Reporting:** the keeper (yHaaS relayer) calls reports, so values between reports lag reality. Unsold liquidation collateral isn't counted until a sale and a report.

## Liquidity Risk

- **Primary exit:** ysyBOLD `redeem` → yBOLD `redeem` → BOLD. Both calls can be bundled. The underlying yBOLD redemption leg returned 7,407,855.86 BOLD at the snapshot with `max_loss = 0`. [Snapshot block](https://etherscan.io/block/26450218)
- **After a liquidation:** the withdrawal queue can draw from other strategies when one branch has less live BOLD than its stored debt. A redemption can revert if the queue runs out of withdrawable BOLD or the realized loss exceeds the caller's limit. The default three-argument yBOLD `redeem` accepts losses, so specify `max_loss` explicitly when quoting an exit. [Vault implementation](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d#code)
- **Exit asset:** BOLD. Converting BOLD to USD depends on BOLD's secondary-market depth and peg, which this report did not quote (`TODO`: Curve / Uniswap BOLD pool depth at 1M, 5M and 10M).
- **Secondary markets for ysyBOLD/yBOLD:** not inventoried (`TODO`). Redemption is direct, so they aren't needed.

## Centralization & Control Risks

### Governance

- **Upgradeability:**
  - yBOLD is an immutable Vyper minimal proxy.
  - ysyBOLD and the strategies delegate to a fixed TokenizedStrategy implementation and are not upgradeable proxies.
  - The Accountant, OnLossDepositLimit and auctions are not upgradeable.
- **Timelock:** the 7-day TimelockController held ADD_STRATEGY and ACCOUNTANT_MANAGER at the snapshot. ySafe is the only proposer. ySafe and Brain can cancel. The Role Manager handoff can move these powers outside the timelock.
- **Untimelocked powers:**
  - Brain (3-of-6) is `management` of ysyBOLD and all strategies, and `feeManager` of the Accountant.
  - Brain and ySafe hold DEPOSIT_LIMIT_MANAGER and DEBT roles on yBOLD.
  - ySafe holds FORCE_REVOKE_MANAGER and WITHDRAW_LIMIT_MANAGER directly.
- **Pause / emergency:**
  - EMERGENCY_MANAGER (ySafe, Brain, Security) can shut down yBOLD.
  - Security is `emergencyAdmin` of the strategies; Brain is `emergencyAdmin` of ysyBOLD.
  - Shutdown stops deposits but not withdrawals. `emergencyWithdraw` only moves funds into the strategy itself.
- **ySafe signers:** publicly known DeFi contributors ([Yearn multisig docs](https://docs.yearn.fi/developers/security/multisig)).

### Critical Permission Paths and Weakest Link

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Grant yBOLD roles after a Role Manager handoff | Brain 3-of-6 can call `removeVault` on the Role Manager. This nominates the fixed `chad()` address, ySafe 6-of-9, which can accept role administration and grant vault roles. | Both Safes are required on the immediate path. Neither handoff step has a delay. | All yBOLD principal (7.61M BOLD) through control of strategies and accounting |
| Add a strategy to yBOLD (`add_strategy`) and allocate debt (`update_debt`) | Timelock currently holds ADD_STRATEGY. Brain, ySafe, Security and the Debt Allocator hold DEBT_MANAGER. | Scheduled path has a 7-day delay and Brain/ySafe cancellation. Role Manager handoff gives ySafe an immediate route. | All yBOLD principal (7.61M BOLD) |
| Replace yBOLD Accountant (`set_accountant`) | Timelock currently holds ACCOUNTANT_MANAGER. ySafe can acquire the role through the handoff. | The current Accountant caps fees at the gain. Vault v3.0.4 has no independent gain-based cap on fees returned by a replacement. The staker continues to call its original immutable `ACCOUNTANT`. | Accrued yield, future yield, and depositor share value through fee dilution |
| Force-revoke a strategy with debt (`force_revoke_strategy`) | **ySafe 6-of-9** directly, or the Timelock | No delay for ySafe. The vault writes off the strategy's debt and removes it from the withdrawal queue. Recovery requires subsequent vault action. | Up to all 7.61M BOLD of recorded debt across the three strategies |
| Restrict yBOLD exits (`set_withdraw_limit_module`) | **ySafe 6-of-9** directly | No delay. Module is unset at the snapshot. | Redemption access for all yBOLD depositors, including ysyBOLD |
| Change strategy deposit access and loss health checks relevant to Sherlock H-2 | **Brain 3-of-6** (`management` of each strategy) | No timelock. Requires unrecovered liquidation collateral for the documented dilution risk. | Recoverable value of burned BOLD and liquidation proceeds. Unsold collateral was zero at the snapshot. |
| Remove the auction floor: `setMinAuctionPriceBps(0)` | **Brain 3-of-6** | No timelock. Start price is still oracle-based; anyone can buy (MEV competition) | Unsold liquidation collateral |
| Redirect yBOLD fees via `Accountant.setFeeRecipient` | **Brain 3-of-6** (`feeManager`) | No timelock. The recipient may change and return to ysyBOLD within one transaction. | Accrued fee shares and future yield. Brain received 131,316 yBOLD through this authority before the snapshot. |
| ysyBOLD fees: `setPerformanceFee` (≤ 50% by TokenizedStrategy), `setPerformanceFeeRecipient`, `setProfitMaxUnlockTime` | **Brain 3-of-6** | No timelock. Fee capped at 50% of profit | Future yield only |
| Remove the yBOLD deposit stop below par (`set_deposit_limit_module`) | Brain or ySafe | No timelock | Dilution of existing yBOLD holders if shares are issued below the value of recoverable assets |
| Shutdown / emergency withdraw | ySafe, Brain, Security | Withdrawals stay open; funds stay in the strategy | None (liveness only) |

**Weakest credible path to material loss:**

- **ySafe alone can write off recorded debt and interrupt principal recovery immediately.** ySafe 6-of-9 held FORCE_REVOKE_MANAGER at the snapshot. Each forced revocation can remove a strategy's full debt from vault accounting, while its assets remain in the strategy until recovered. The three strategies accounted for all 7.61M BOLD of vault debt. [Vault implementation](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d#code)
- **Brain and ySafe together can gain immediate authority over all deployed principal.** The Role Manager permits Brain to initiate the handoff to ySafe. The vault lets the accepted role manager assign strategy and accountant roles. The BORG guard was in blacklist mode and had no policy against calls to either contract at the snapshot. [Role Manager source](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41#code) · [Vault implementation](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d#code) · [BORG guard](https://etherscan.io/address/0xe1c90a1f8a9553b31110dd6feead76e79a6ed419#code)
- **Brain alone can put liquidation recovery and fee shares at risk immediately.** The 3-of-6 Safe controls the strategy loss and deposit settings, auction floor, and Accountant fee recipient. Liquidation proceeds include collateral acquired with deposited BOLD. The snapshot's zero unsold collateral is a point-in-time observation. [Deployed strategy source](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75#code) · [Accountant source](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa#code)

### Programmability

- **PPS:** computed onchain from stored assets and effective share supply. The yBOLD Accountant targets 1.0 BOLD per share. ysyBOLD gains unlock over 3 days at the snapshot configuration.
- **Operations:** the yHaaS keeper runs reports, `tend()` and debt allocation. Anyone can buy from an auction. If the keeper stops, yield processing and auction starts stall. Users can still redeem within the available strategy liquidity.
- **Collateral pricing:** auctions use the Liquity price feed for the floor and start price, not for share accounting.

### External Dependencies

| Dependency | Criticality | Notes |
|------------|-------------|-------|
| **Liquity V2 (BOLD + Stability Pools)** | Critical: 100% of funds | Immutable protocol. 4 audit firms, a Cantina contest and Certora formal verification. Relaunched May 2025 after a Stability Pool issue. TVL $67.2M. yBOLD is ~50% of all Stability Pool deposits |
| **Liquity price feeds (Chainlink-based)** | High: auctions only | Set the auction floor and start price. A stale or wrong feed can pause sales (floor too high) or underprice them (floor too low) |
| **ETH / wstETH / rETH** | High | Trove collateral; also what the Stability Pools receive on liquidation |
| **Auction buyers (MEV / solvers)** | Medium | Collateral conversion relies on outside buyers taking the auctions above the 95% floor |
| **Yearn keeper (yHaaS)** | Medium | Needed for yield; not needed to exit |

## Operational Risk

- **Team:** Yearn, operating since 2020, with publicly known ySafe signers. yBOLD runs on the same Role Manager setup as other Yearn V3 vaults.
- **Documentation:** product docs and a public repository with tests and the audit report. Accepted-risk audit findings (H-1, H-2, M-1) are public but not explained in the user docs.
- **Legal:** Yearn BORG (Cayman foundation, [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)).
- **Incident response:** Yearn has a track record and an Immunefi bounty. Its monitoring repository covers V3 vaults; yBOLD-specific alerts are proposed below.

## Monitoring

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| ysyBOLD | [`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD) | `pricePerShare()` (must not fall), `totalAssets()`, `profitMaxUnlockTime()` (alert if < 1 day), `performanceFee()`, `management()`, `Reported` events with a loss |
| yBOLD | [`0x9F4330700a36B29952869fac9b33f45EEdd8A3d8`](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8) | `pricePerShare()` (alert if ≠ 1e18), `deposit_limit_module()`, `withdraw_limit_module()`, `accountant()`, `StrategyChanged`, `DebtUpdated`, `RoleSet`, `UpdateFutureRoleManager`, `UpdateRoleManager`, `UpdateWithdrawLimitModule`, `StrategyReported` with loss > 0 |
| Strategies (×3) | [`0xc5e7…5b75`](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75), [`0x3589…49a5`](https://etherscan.io/address/0x3589b93CaDb464b6E1974Cc9fc0c9be698Ee49a5), [`0x6ED5…9005`](https://etherscan.io/address/0x6ED566B76838A08d04cBd6323231B08a2eC69005) | **sBOLD/H-2 guards:** `openDeposits()` must stay false; alert on any `setAllowed`. Alert if `lossLimitRatio()` ≠ 0 or `doHealthCheck()` is false. Alert if `minAuctionPriceBps()` < 9500 or `bufferPercentage()` changes. Also watch `profitMaxUnlockTime()`, `management()`, `keeper()`, and unsold collateral (`SP.getDepositorCollGain + stashedColl + COLL.balanceOf(strategy) + COLL.balanceOf(AUCTION)`) |
| Auctions (×3) | [`0x61C9…9381`](https://etherscan.io/address/0x61C9e1113661C991fb6377B3610804476Dcd9381), [`0x64e8…5CcA`](https://etherscan.io/address/0x64e8050D33BB296d48FE8eb08d09F00633e45CcA), [`0x3793…8091`](https://etherscan.io/address/0x3793405FBcE404f351e76fa115209488aC0e8091) | `governanceOnlyKick()` must stay true; `Approval` events from the auctions to any spender other than CoW's `GPv2VaultRelayer` (sBOLD-style leftover-approval guard); `minimumPrice()` vs Liquity `lastGoodPrice()`; `AuctionKicked`, sales events; auctions that end without selling |
| Accountant | [`0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa`](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa) | `feeRecipient()`, `feeManager()`, `defaultConfig()`, `UpdateFeeRecipient`, `DistributeRewards` and outgoing yBOLD `Transfer` events |
| OnLossDepositLimit | [`0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62`](https://etherscan.io/address/0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62) | Must remain yBOLD's `deposit_limit_module` |
| Liquity V2 Stability Pools / Trove Managers | [`0x5721…F9bF`](https://etherscan.io/address/0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF), [`0x9502…e56B`](https://etherscan.io/address/0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B), [`0xd442…8695`](https://etherscan.io/address/0xd442E41019B7F5C4dD78F50dc03726C446148695); TMs [`0x7bcb…Cf5A`](https://etherscan.io/address/0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A), [`0xA289…8B22`](https://etherscan.io/address/0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22), [`0xb2B2…e19e`](https://etherscan.io/address/0xb2B2ABEb5C357a234363FF5D180912D319e3e19e) | `getTotalBoldDeposits()`, yBOLD share of each pool, `shutdownTime()` (alert if non-zero), large liquidations |
| Governance | ySafe, Brain, Security, Timelock, Role Manager and BORG guard (addresses above) | Threshold, owner, guard or module changes. Monitor `RemovedVault` on the Role Manager, `getMinDelay()` below 7 days and queued operations targeting yBOLD. |

### Thresholds and Frequency

| Check | Threshold | Frequency |
|-------|-----------|-----------|
| Any sBOLD/H-2 guard change (`openDeposits`, `allowed`, `lossLimitRatio`, `doHealthCheck`, `deposit_limit_module`, ysyBOLD `profitMaxUnlockTime`) | Any change | Event-driven / hourly |
| `Approval` events with a strategy, ysyBOLD, yBOLD or the Accountant as owner, or an auction approving anyone except `GPv2VaultRelayer` | Any non-zero allowance | Event-driven |
| yBOLD `pricePerShare()` | ≠ 1e18 | Hourly |
| ysyBOLD `pricePerShare()` | Any decrease | Hourly |
| Unsold collateral per strategy | Oracle value in BOLD terms > 1% of strategy debt for > 24h | Hourly |
| `minAuctionPriceBps` / auction `minimumPrice` | < 95% of oracle | Daily |
| Accountant recipient and distributions | Any `UpdateFeeRecipient`, or any outgoing yBOLD transfer to a recipient other than ysyBOLD. Inspect every event in the transaction. | Event-driven |
| yBOLD role administration or exit module | Any `UpdateFutureRoleManager`, `UpdateRoleManager`, `RoleSet`, `UpdateWithdrawLimitModule`, or Role Manager `RemovedVault` for yBOLD | Event-driven |
| yBOLD live BOLD backing and redemptions | Alert when live BOLD backing falls below recorded assets or a redemption returns less than its share value. Compare strategy BOLD balances and compounded SP deposits plus vault BOLD against `totalAssets()`. | Hourly and on withdrawals |
| Liquity branch `shutdownTime()` | ≠ 0 | Hourly |
| yBOLD share of a Stability Pool | > 75% | Daily |

## Appendix: Contract Architecture

```
                         ┌───────────────────────────────┐
  users ── yBOLD ──────▶ │ ysyBOLD (TokenizedStrategy)   │  3-day profit unlock, 10% perf fee
                         │ asset = yBOLD                │──fee shares──▶ Yearn Accountant
                         └──────────────▲────────────────┘
                                        │ distribute() at report (yBOLD fee shares)
                         ┌──────────────┴────────────────┐
                         │ yBOLD Accountant             │  100% fee above any shortfall to par
                         └──────────────▲────────────────┘
                                        │ fee shares minted at process_report
  users ── BOLD ───────▶ ┌──────────────┴────────────────┐
                         │ yBOLD Vault v3.0.4            │  stored PPS = 1.0 at snapshot
                         │ deposit gate: OnLossDepositLimit (PPS < 1 → 0)
                         └───┬────────────┬───────────┬──┘
                       45.5% │      30.3% │     24.2% │   (strategy deposits are allowlisted)
                 ┌───────────▼──┐ ┌───────▼──────┐ ┌──▼───────────┐
                 │ wstETH SP    │ │ WETH SP      │ │ rETH SP      │  LiquityV2SPStrategy v3.0.4
                 │ strategy     │ │ strategy     │ │ strategy     │  lossLimit 0, healthcheck on
                 └──┬────────┬──┘ └──┬────────┬──┘ └──┬────────┬──┘
           BOLD     │  coll  │       │        │       │        │
                    ▼        ▼       ▼        ▼       ▼        ▼
          Liquity V2 SP   Auction  Liquity   Auction Liquity  Auction   (kick: strategy-only via keeper tend;
          (wstETH)        (wstETH) SP (WETH) (WETH)  SP (rETH) (rETH)    take: anyone; floor 95% oracle)
                    ▲        │
                    └─BOLD───┘  auction proceeds → strategy (counted only at next keeper report)

Governance: ySafe 6/9 ──propose/execute──▶ Timelock (7d) ──ADD_STRATEGY / ACCOUNTANT──▶ yBOLD
            Brain 3/6 ──Role Manager handoff──▶ ySafe 6/9 ──accept role administration──▶ yBOLD
            ySafe 6/9 ── FORCE_REVOKE / WITHDRAW_LIMIT on yBOLD without delay
            Brain 3/6 ── management of ysyBOLD + strategies, Accountant feeManager, DEBT / DEPOSIT_LIMIT on yBOLD
            Security 4/7 ── DEBT / MAX_DEBT / EMERGENCY on yBOLD, emergencyAdmin of strategies
            Keeper (yHaaS) ── report / tend;  Debt Allocator ── REPORTING + DEBT_MANAGER
```

---

## Risk Summary

### Key Strengths

- **Stored accounting resists instant collateral-donation inflation.** yBOLD strategies exclude collateral from share accounting. Collateral sales use strategy-controlled auctions, with CoW orders subject to the auction's `isValidSignature` checks.
- **Strategy safeguards against Sherlock H-2.** At the snapshot, strategies restricted deposits to their allowlists and blocked net-loss reports. The vault's below-par deposit gate and the staker's profit unlock operate at their own layers.
- **Zero reported losses** across 1,258 vault reports and 329 staker reports over ~18 months. ysyBOLD PPS rose 10.4% since launch.
- **Onchain accounting and fixed implementations.** Strategy deposits, withdrawals, loans offset by Liquity, and auction collateral can be reconciled against stored balances.
- **Full-size BOLD exit at the snapshot.** The staker's 7,407,855.86 yBOLD redeemed for the same amount of BOLD in the pinned call with zero loss tolerance.

### Key Risks

- **Brain can relax strategy safeguards without a delay.** Sherlock H-2 was marked "won't fix". Brain can open strategy deposits and relax loss-report checks. The collateral at risk includes value received in exchange for burned depositor BOLD.
- **Brain can redirect accrued fee shares and future yield.** It received 131,316 yBOLD before the snapshot and restored ysyBOLD as fee recipient within the same transaction. [Distribution transaction](https://etherscan.io/tx/0x27bd72f9a183359b68b2c313a1f145e03d3bb7539069eb43ffee367cdbf2a677)
- **Single-protocol dependency:** 100% in Liquity V2 Stability Pools, which are first-loss capital for liquidations. Liquity V2 needed a redeployment in 2025 and its TVL has fallen from $180M to $67M.
- **Concentration in Liquity:** yBOLD is ~50% of all Stability Pool BOLD and ~25% of BOLD supply (68.5% of the rETH pool). A large yBOLD exit materially shrinks Liquity's liquidation capacity.
- **Collateral sales rely on outside buyers.** Auctions floor at 95% of the Liquity oracle. In fast markets sales may stall (floor too high) or clear below market (floor stale and low). Brain can lower the floor without a timelock.
- **Deployed code differs from the audited code:** the live strategies, Accountant and staker include post-contest changes (auction pricing, oracle handling) that were reviewed only internally.
- **Small TVL:** ~$7.4M.

### Critical Risks

- **Principal recovery depends on ySafe 6-of-9.** ySafe can force-revoke debt or restrict exits immediately. Brain and ySafe can also transfer role administration to ySafe without the 7-day delay, exposing all vault principal to strategy and accounting changes. [Role Manager source](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41#code) · [Vault implementation](https://etherscan.io/address/0xd8063123bba3b480569244ae66bfe72b6c84b00d#code)

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **Unverified contract source**: all contracts in the address tables were checked and are verified on Etherscan (V3 vault implementation, TokenizedStrategy, staker, strategies, Accountant, OnLossDepositLimit, Auction implementation). ✅ PASS
- [x] **No audit**: Sherlock contest (yBOLD), Yearn V3 core (3 firms), Liquity V2 (4 firms + Cantina). ✅ PASS
- [x] **Unverifiable reserves**: Stability Pool deposits are fully onchain. ✅ PASS
- [x] **Total centralization**: the material governance paths identified above require a multisig with at least three signers. ✅ PASS

**All gates pass.**

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits: 2.5.** Strong coverage of the underlying protocol (Liquity V2) and the V3 core. The yBOLD-specific code had one public contest, whose two Highs were accepted rather than fixed. The deployed strategies include post-contest changes that were reviewed only internally. The Auction and `OnLossDepositLimit` were outside the contest scope. Bounty: Yearn $200K (Immunefi) and Liquity (Hats).
- **Historical: 3.0.** ~18 months in production (score 2) and TVL under $10M (score 4). No loss-bearing reports through the snapshot.

**Score: 2.75/5**: (2.5 + 3.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 4.0.** ySafe 6-of-9 can immediately write off strategy debt or restrict exits. Brain 3-of-6 can immediately change protections on liquidation recoveries and redirect fees. Together the Safes can transfer vault role administration without the 7-day delay.
- **Programmability: 2.0.** Accounting is onchain. Keeper reports recognize gains and losses, the staker unlocks gains over time, and collateral conversion depends on keeper `tend()` and auction buyers.
- **Dependencies: 3.5.** One critical dependency (Liquity V2, also the BOLD issuer). It is well audited and immutable, but was redeployed in 2025, has shrinking TVL, and yBOLD is about half its Stability Pool liquidity. Also depends on Chainlink-based Liquity price feeds for auctions.

**Score: 3.167/5** (4.0 + 2.0 + 3.5) / 3, rounded.

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 2.0.** At the snapshot, BOLD deposited in Liquity Stability Pools backed the reported vault assets. Pool deposits absorb liquidations in exchange for ETH or LST collateral. The vault uses no leverage.
- **Provability: 1.5.** Verify liquid BOLD reserves onchain against stored assets. The difference can widen after liquidations and before collateral sales or reports.

**Score: 1.75/5**: (2.0 + 1.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 1.5/5.** The staker's full yBOLD position redeemed to BOLD at par in the zero-loss snapshot simulation. Liquidation collateral can delay recovery of BOLD and the withdrawal queue is subject to available strategy liquidity. `TODO`: quantify BOLD market depth to size an exit beyond the vault.

#### Category 5: Operational Risk (Weight: 5%)

**Score: 1.0/5.** Yearn: established team, named ySafe signers, BORG legal wrapper, public code and audit report.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 2.75 | 20% | 0.550 |
| Centralization & Control | 3.167 | 30% | 0.950 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **2.30/5.0** |

No optional modifiers apply: under 2 years live and under $500M TVL.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.30/5.0)**

---

## Reassessment Triggers

- **Time-based:** every 6 months (May 2027).
- **Configuration-based:** any role-manager handoff, vault role change, withdrawal-limit module change, Accountant replacement or fee recipient change. Reassess changes to strategy deposit access, health checks, auction pricing, yBOLD's deposit-limit module, and ysyBOLD's profit unlock period.
- **TVL-based:** yBOLD TVL changes by more than ±50% (from ~7.6M BOLD), or yBOLD's share of any Stability Pool exceeds 75%.
- **Incident-based:** any reported loss on yBOLD or ysyBOLD, a Liquity V2 branch shutdown, a BOLD depeg above 2%, any update to K3's sBOLD analysis that also applies to yBOLD, or any finding against CoW relayer approvals or the Auction's `isValidSignature`.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| November 19, 2026 | 2.30 | Initial assessment at block 26,450,218. The score reflects immediate principal write-off and role-handoff powers, Brain's fee authority, and the distinction between snapshot redemption and liquidity after liquidations. |
