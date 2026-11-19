# Protocol Risk Assessment: Yearn — ysyBOLD

- **Assessment Date:** November 19, 2026
- **Token:** ysyBOLD (Staked yBOLD)
- **Chain:** Ethereum
- **Token Address:** [`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD)
- **Final Score: 2.10/5.0**

## Overview + Links

ysyBOLD is the **yield-bearing staking wrapper of yBOLD**, Yearn's BOLD vault on Liquity V2. The stack has two user-facing layers:

1. **yBOLD** ([`0x9F4330700a36B29952869fac9b33f45EEdd8A3d8`](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8)) is a Yearn V3 multi-strategy vault (v3.0.4). It takes BOLD and spreads it across three Yearn strategies, each depositing into one Liquity V2 Stability Pool (WETH, wstETH, rETH). Its [Accountant](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa) charges a **100% performance fee** on every gain, so yBOLD's price per share stays at **exactly 1.0 BOLD**. Those fees are minted as yBOLD to the fee recipient.
2. **ysyBOLD** ([`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD)) is a Yearn V3 TokenizedStrategy (v3.0.4) whose asset is yBOLD. It is the Accountant's fee recipient. On each report it pulls the accrued yBOLD from the Accountant and releases it to holders over **3 days** (`profitMaxUnlockTime = 259200`). It charges its own 10% performance fee.

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
| yBOLD Accountant | [`0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa`](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa) | yBOLD-specific `Accountant`: 100% performance fee, waived while yBOLD PPS < 1. `feeRecipient` = ysyBOLD |
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
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | `role_manager` of yBOLD. `chad()` = ySafe |
| Daddy / ySafe | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Safe. yBOLD roles `0x3FF6` (all except ADD_STRATEGY and ACCOUNTANT) |
| Brain | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | **3-of-6 Safe**. yBOLD roles `0x3972`. **`management` of ysyBOLD and of all three strategies**, ysyBOLD `emergencyAdmin`, Accountant `feeManager` |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Safe. yBOLD roles `0x20C0` (DEBT, MAX_DEBT, EMERGENCY). `emergencyAdmin` of the three strategies |
| Strategy Manager (TimelockController) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | `getMinDelay()` = **604,800 s (7 days)**. yBOLD roles `0x8F` (ADD_STRATEGY, REVOKE, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT) |
| Keeper (yHaaSRelayer) | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yBOLD REPORTING (`0x20`). `keeper` of ysyBOLD and the strategies |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | yBOLD REPORTING + DEBT_MANAGER (`0x60`) |

Timelock roles (`hasRole` at the snapshot):

- **PROPOSER** and **EXECUTOR**: ySafe.
- **EXECUTOR**: TimelockExecutor [`0xf8f6…779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b).
- **CANCELLER**: ySafe and Brain.
- **TIMELOCK_ADMIN**: only the timelock itself. ySafe does not hold `DEFAULT_ADMIN`.

The [yvUSDC-1 report](./yearn-yvusdc.md#appendix-timelockcontroller-role-structure) describes the same shared timelock in detail.

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
- **H-2 ([#155](https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/155)):** someone deposits after a keeper reports a post-liquidation loss and before the collateral is auctioned, steals from existing depositors. This is the same class of bug as ChainSecurity's earlier sBOLD audit finding and the first press accounts of the November 2026 sBOLD exploit. K3's post-mortem later traced the exploit itself to a leftover router approval. Both are analyzed in [the sBOLD case study](#case-study-k3-capital-sbold-exploit-and-why-ysybold-is-not-exposed). The current onchain settings block it, but they can be changed without a timelock.
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

- **Yearn:** [Immunefi](https://immunefi.com/bounty/yearnfinance/), maximum $200,000 (as recorded in the [yvUSDC-1 report](./yearn-yvusdc.md#bug-bounty)). This report did not verify whether the yBOLD contracts are in scope (`TODO`).
- **Liquity:** a bug bounty run by Liquity AG on Hats Finance, covering V1 and V2 ([Liquity blog](https://www.liquity.org/blog/auditing-liquity-v2)). Maximum payout `TODO`.
- **Safe Harbor:** Yearn is not listed on the SEAL Safe Harbor registry (per the [yvUSDC-1 report](./yearn-yvusdc.md#bug-bounty)).

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

On **November 18, 2026**, K3 Capital's **sBOLD** vault lost about **3.43M BOLD** in under 10 minutes. Like yBOLD, sBOLD is an ERC-4626 vault that spreads BOLD across Liquity V2 Stability Pools.

**Root cause per K3's post-mortem: a token approval left in place by the public swap.** K3 published a [post-mortem on X](https://x.com/k3_capital/status/2123395654214967426) on November 19. This report could not retrieve its text (x.com refuses automated fetches), so what follows comes from coverage that summarizes it ([The Defiant](https://thedefiant.io/news/security/k3-capital-says-sbold-vault-flaw-drained-3-43m-bold), [Crypto Times](https://www.cryptotimes.io/2026/11/19/k3-capital-offers-15-bounty-to-recover-3-43m-lost-in-sbold-exploit/)):

- **Cause:** The Defiant traces the loss to *"unused token-spending permissions in K3's vault"*. Crypto Times reports that the vault's public swap function, which lets anyone convert vault collateral into BOLD through the 1inch router, did not revoke the router approval when a swap didn't use all of it. Attackers then used that leftover approval to take collateral.
- **Liquity:** Liquity said its protocol was not affected.
- **Response:** K3 paused its contracts and offered a bounty to recover the funds (15% per Crypto Times).

The public sBOLD code has exactly this pattern. `sBold.swap()` can be called by anyone and takes caller-supplied `SwapData`. [`SwapLogic._execute`](https://github.com/K3Capital/sBOLD/blob/master/contracts/libraries/logic/SwapLogic.sol):

1. calls `IERC20(_src).approve(_adapter, _inAmount)`;
2. runs the caller's calldata on the adapter (`_adapter.call(_swapData)`);
3. checks only that enough BOLD came back.

It never resets the approval. So any amount the caller's route didn't spend stays approved to the router. How exactly the attacker spent the leftover approval through the router has not been confirmed from the post-mortem text.

**Earlier explanations, now superseded.** The first alerts and articles ([CoinDesk](https://www.coindesk.com/tech/2026/11/19/ethereum-block-builders-received-the-most-in-a-usd3-4-million-vault-hack-data-shows), [Cryptonews / Blockaid](https://cryptonews.net/news/security/33775498/), [Altcoinbuzz / Bitquery / DefiLlama](https://www.altcoinbuzz.io/3-42-million-drained-from-k3-capital-s-sbold-vault-in-eight-minutes)) described a share-pricing attack: flash loans, collateral left out of the share price, cheap mints, then redemption after a swap. K3's account replaces that. The share-pricing class is still relevant to yBOLD, though:

- the [May 2025 ChainSecurity audit of sBOLD](https://www.chainsecurity.com/security-audit/k3-sbold) reported it (shares underpriced after liquidations);
- yBOLD's own audit found the same class ([H-2](https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/155)).

This report therefore covers **both** sBOLD-family attacks: (A) the confirmed approval / arbitrary-calldata attack and (B) the share-pricing attack.

### Attack A (confirmed sBOLD cause): leftover approvals and caller-supplied swap calldata

yBOLD never swaps collateral through an aggregator, and it never runs calldata supplied by an outside caller:

| sBOLD condition | yBOLD / ysyBOLD at the snapshot | Evidence |
|-----------------|----------------------------------|----------|
| Anyone can call `swap()` with their own router calldata | No yBOLD contract runs caller-supplied swap calldata. Collateral is moved with `COLL.safeTransfer(AUCTION, amount)` inside the keeper-only `tend()` and sold in a Dutch auction | [`Strategy._tend`](https://github.com/yearn/yBOLD/blob/master/src/Strategy.sol) |
| Approval to a third-party router (`approve(adapter, _inAmount)`) never reset | **None of the strategies, the staker, the vault or the Accountant holds any standing allowance.** The vault's BOLD approvals to strategies are set per debt update and are 0 at the snapshot. Strategies deposit into the Stability Pools through Liquity's `sendToPool`, which needs no approval | `Approval` logs scanned on BOLD, WETH, wstETH, rETH and yBOLD for every yBOLD contract (Etherscan), checked with `allowance()` at the snapshot |
| Buyers pay through a router path the vault doesn't control | Auction buyers call `take()`. The auction sends the collateral, optionally calls back the **buyer's own** contract, then pulls BOLD from the buyer with `transferFrom`. It reverts unless the price, which falls over time and has a floor, is fully paid | [Auction v1.0.4 `_take`](https://etherscan.io/address/0xecdfb5bebb9e72ca7c8b6aeeb0ca07375c1c0b2e#code) |
| — | **The only standing approvals:** each auction approves its collateral (WETH, wstETH, rETH) at `type(uint256).max` to CoW Protocol's [`GPv2VaultRelayer`](https://etherscan.io/address/0xC92E8bdf79f0507f65a392b0ab4667716BFE0110), set by `enable()`. The relayer only acts for CoW's settlement contract, and the auction approves a CoW order only through `isValidSignature`. That requires: the order hash matches, the buy token is BOLD, the receiver is the strategy, the buy amount is at least the current auction price, no fee, the order is partially fillable, the sell amount is at most the kicked lot, and it expires within the auction window | Auction v1.0.4 `enable()` / `isValidSignature()`; `allowance(auction, GPv2VaultRelayer)` = max for each auction |

What's left is the CoW approval. It is capped by the auction price and covers only collateral sitting in an auction, which was 0 at the snapshot. It depends on CoW Protocol's settlement and relayer contracts.

### Attack B (share-pricing class): yBOLD's Sherlock H-2

yBOLD's strategies value themselves **only** in BOLD: `asset.balanceOf(strategy) + SP.getCompoundedBoldDeposit(strategy)` ([`estimatedTotalAssets`](https://github.com/yearn/yBOLD/blob/master/src/Strategy.sol)). Liquidation collateral is ignored until it is sold. On paper, that is a stronger version of sBOLD's first step. The yBOLD audit found the matching attack ([H-2](https://github.com/sherlock-audit/2025-05-yearn-ybold-judging/issues/155)):

1. A liquidation burns some of a strategy's BOLD and gives it collateral instead.
2. A keeper reports, so the strategy records a **loss** and its price per share drops.
3. An attacker deposits into the strategy at that lower price.
4. The collateral is auctioned into BOLD, and the next report restores the price **instantly**, because the strategy's `profitMaxUnlockTime = 0`.
5. The attacker redeems at the restored price, taking value from the yBOLD vault.

#### Why attack B does not work against yBOLD / ysyBOLD today

| Share-pricing condition (early sBOLD reports, ChainSecurity finding) | yBOLD / ysyBOLD at the snapshot | Evidence |
|-----------------|----------------------------------|----------|
| Share price updates live on every deposit and redeem, so it can be moved inside one transaction | All four share contracts run **v3.0.4 report-boundary accounting**: `totalAssets` changes only when a keeper calls `report()` / `process_report()`. Nothing an outsider does moves the price in between | `apiVersion() = "3.0.4"` on yBOLD, ysyBOLD and all strategies |
| Anyone could call `swap()` to make excluded collateral count | Only the strategy can kick its auction: `governanceOnlyKick = true` with `governance` = the strategy. Kicking happens only inside the keeper-gated `tend()`. Anyone can **buy** from an auction (that is how it works), but the BOLD proceeds count only at the next keeper report | `Auction.governanceOnlyKick()`, `Auction.governance()` |
| Outsiders can mint vault shares while the price is depressed | **Strategies are closed to outsiders**: `openDeposits = false`, and only the yBOLD vault is on `allowed`. The vault holds 100% of each strategy's shares | `openDeposits()`, `allowed(yBOLD)`, `balanceOf(yBOLD) == totalSupply()` |
| A report after a liquidation records a loss | Every strategy has `doHealthCheck = true` and `lossLimitRatio = 0`, so **any report showing a loss fails**. The keeper has to auction the collateral first; step 2 of H-2 cannot happen | `doHealthCheck()`, `lossLimitRatio()` |
| A loss at the vault level would let users mint cheap yBOLD | If yBOLD ever reports a loss (price below 1.0), `OnLossDepositLimit` returns 0 and **vault deposits stop** until the price recovers | [`OnLossDepositLimit`](https://etherscan.io/address/0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62), `deposit_limit_module()` |
| Gains reach the share price instantly | yBOLD's price is held at 1.0 (100% fee). Gains reach ysyBOLD only after **three keeper steps** (strategy report → vault `process_report` → staker report) and are then released over **3 days** | Accountant `report()`, ysyBOLD `profitMaxUnlockTime() = 259200` |
| Collateral valued with an oracle, so the price depends on oracle accuracy | Share prices use no oracle. The Liquity price feed sets only the auction's **floor** (95% of the oracle price) and starting price (115%, ×200 if the feed is down). The auction never lowers anyone's share price | `minAuctionPriceBps() = 9500`, `bufferPercentage() = 1.15e18` |

Onchain history supports this:

- yBOLD processed **1,258 strategy reports** totalling **809,808.95 BOLD** of gains, with **zero reported losses**.
- ysyBOLD emitted **329 `Reported` events with zero losses** (Etherscan logs, from deployment to the snapshot block).
- yBOLD's price per share was exactly 1.000000 at every sampled block (snapshot, and 30, 90, 180 and 365 days earlier).

#### What could bring attack B back

Five settings protect against this. **Brain (3-of-6, no timelock)** can change most of them; the fifth needs the ySafe:

| Setting | Holder | Would enable |
|---------|--------|--------------|
| `allowDeposits()` / `setAllowed(x)` on a strategy | Brain (`management`) | Outsiders depositing straight into a strategy. With `profitMaxUnlockTime = 0` and no fee, they could also deposit just before a keeper report and take the yield |
| `setLossLimitRatio(>0)` / `setDoHealthCheck(false)` on a strategy | Brain (`management`) | A report that records a post-liquidation loss (step 2 of H-2) |
| yBOLD `set_deposit_limit_module` | Brain or ySafe (DEPOSIT_LIMIT_MANAGER) | Removes the stop on deposits while yBOLD is below 1.0 |
| ysyBOLD `setProfitMaxUnlockTime(0)` | Brain (`management`) | Instant ysyBOLD price jumps at report, so someone could deposit just before a report and take the yield |
| A strategy on TokenizedStrategy ≥ v3.1 that overrides `_strategyTotalAssets()` with live accounting | Needs ADD_STRATEGY (7-day timelock) | Live pricing between reports, which is the main precondition of share-pricing attack B |

Even with these settings flipped, H-2-style extraction is **limited to unsold liquidation collateral**: the value an attacker can capture is the collateral recovery that would otherwise go to existing depositors. At the snapshot, every strategy and auction held **0 collateral**: `getDepositorCollGain = 0`, `stashedColl = 0`, and collateral balances of 0 on the strategies and auctions. The [Monitoring](#monitoring) section has alerts for all five settings.

## Historical Track Record

- **Deployed:** yBOLD vault, Accountant and ysyBOLD on May 26, 2025 (blocks 22,569,667–22,569,894), one week after Liquity V2's relaunch. That is **~18 months** in production.
- **Strategy migration:** the three original strategies were replaced by the current ones on February 27, 2026 (see [Strategies and Auctions](#strategies-and-auctions)). New strategies have been live for **~9 months**.
- **TVL history** (yBOLD `totalAssets()` / ysyBOLD `totalAssets()`):

| Date | Block | yBOLD (BOLD) | ysyBOLD (yBOLD) | ysyBOLD PPS |
|------|------:|-------------:|----------------:|------------:|
| Nov 17, 2025 | [23,822,218](https://etherscan.io/block/23822218) | 8,984,934 | 8,984,410 | 1.039560 |
| May 22, 2026 | [25,154,218](https://etherscan.io/block/25154218) | 5,180,741 | 5,017,959 | 1.071509 |
| Aug 21, 2026 | [25,802,218](https://etherscan.io/block/25802218) | 5,877,675 | 5,788,834 | 1.088682 |
| Oct 20, 2026 | [26,234,218](https://etherscan.io/block/26234218) | 7,411,320 | 7,333,810 | 1.099712 |
| Nov 19, 2026 | [26,450,218](https://etherscan.io/block/26450218) | 7,613,634 | 7,407,856 | 1.104266 |

- **Losses:** none. The vault has zero `StrategyReported` events with a loss, and ysyBOLD has zero `Reported` events with a loss.
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

**Monitoring of fund delegation:** strategy additions need the 7-day timelock, and debt moves only between the three active strategies, all of the same type. Monitor `StrategyChanged`, `DebtUpdated` and each strategy's Stability Pool share.

### Accessibility

- **ysyBOLD deposits / withdrawals:** anyone can deposit or withdraw yBOLD (ERC-4626). `availableDepositLimit` and `availableWithdrawLimit` are unlimited. There is no cooldown. Exits are atomic.
- **yBOLD deposits:** anyone can deposit BOLD, unless yBOLD's price per share is below 1.0 (`OnLossDepositLimit`).
- **yBOLD withdrawals:** anyone, atomic. Withdrawals pull BOLD from the Stability Pools through each strategy's `withdrawFromSP`.
- **Fees:** yBOLD takes 100% of gains, all of which go to ysyBOLD. ysyBOLD takes a 10% performance fee and no management fee.

### Token Mint Authority

**Mint mechanism:** ERC-4626 deposits that anyone can make. There is no privileged minter role in TokenizedStrategy (ysyBOLD) or in the V3 Vault (yBOLD).

**Mint requires backing:** Yes. User mints require an asset transfer in the same transaction. Fee shares are minted only against reported profit:

- ysyBOLD mints its 10% performance-fee shares to [`0x5A74…DE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) during `report()`.
- yBOLD mints fee shares to the Accountant during `process_report()`. The Accountant caps fees at `gain` and waives them until any shortfall is repaid ([`Accountant.report`](https://github.com/yearn/yBOLD/blob/master/src/periphery/Accountant.sol)).

**Per-address mint authority** (from source and onchain role reads at the snapshot):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any caller of `ysyBOLD.deposit()` / `mint()` | ✓ | ✓ (own shares) | ERC-4626 (anyone) | Backed by a yBOLD transfer in the same transaction |
| ysyBOLD `keeper` / `management` via `report()` | ✓ (fee shares) | — | TokenizedStrategy `onlyKeepers` | Fee shares cover only reported profit (10%) |
| Any caller of `yBOLD.deposit()` | ✓ | ✓ (own shares) | ERC-4626 (anyone) | Blocked while yBOLD PPS < 1 |
| yBOLD REPORTING_MANAGER via `process_report()` | ✓ (fee shares to the Accountant) | — | V3 vault role (Keeper, Debt Allocator, Brain, ySafe) | Fee is at most the gain; yBOLD PPS stays at 1.0 |

**Rate limits / supply caps:** none. yBOLD `deposit_limit` is unlimited, gated only by `OnLossDepositLimit`.

**Backing check at mint time:** atomic.

### Collateralization

- **Backing:** 100% onchain. ysyBOLD → yBOLD (1:1 BOLD) → BOLD deposited in Liquity V2 Stability Pools. Simulating at the snapshot (`eth_call`), ysyBOLD could redeem its full 7,407,855.86 yBOLD into exactly 7,407,855.86 BOLD.
- **Collateral quality:**
  - BOLD is backed by overcollateralized ETH, wstETH and rETH Troves.
  - Stability Pool deposits are first-loss capital for liquidations. They burn BOLD and receive collateral at a liquidation discount.
  - If a liquidation leaves bad debt, or the collateral can't be sold above its value, depositors take a real loss.
- **Accounting is conservative:** unsold collateral is valued at **zero**, so the reported value can only be lower than the true value, never higher.
- **Leverage:** none.
- **Risk curation:** Brain sets auction parameters. The debt split across branches is automated (Debt Allocator) and can be adjusted by Brain.

### Provability

- **Reserves:** fully onchain. Anyone can call `getCompoundedBoldDeposit(strategy)` on each Stability Pool and compare it with `yBOLD.totalDebt()`.
- **Exchange rate:** ysyBOLD price per share = `totalAssets / totalSupply` with linear profit release. yBOLD is pinned at 1.0 by the Accountant. Both are computed onchain with no admin input.
- **Reporting:** the keeper (yHaaS relayer) calls reports, so values between reports lag reality. Unsold liquidation collateral isn't counted until a sale and a report.

## Liquidity Risk

- **Primary exit:** ysyBOLD `redeem` → yBOLD → yBOLD `redeem` → BOLD, atomic and with no fee. Full-size exit simulated at the snapshot: 7,407,855.86 yBOLD → 7,407,855.86 BOLD (`maxRedeem(ysyBOLD)` = full balance).
- **Gate:** Stability Pool withdrawals return the compounded BOLD deposit. After a liquidation, part of a strategy's value sits in collateral that can't be withdrawn as BOLD until the auction sells it.
- **Exit asset:** BOLD. Converting BOLD to USD depends on BOLD's secondary-market depth and peg, which this report did not quote (`TODO`: Curve / Uniswap BOLD pool depth at 1M, 5M and 10M).
- **Secondary markets for ysyBOLD/yBOLD:** not inventoried (`TODO`). Redemption is direct, so they aren't needed.
- **Unrealised-loss window:** between a liquidation and the collateral sale, yBOLD still redeems at 1.0. Early leavers get full BOLD while the collateral stays with remaining holders. Liquidation collateral normally exceeds the BOLD burned, so this only matters if a liquidation leaves bad debt.

## Centralization & Control Risks

### Governance

- **Upgradeability:**
  - yBOLD is an immutable Vyper minimal proxy.
  - ysyBOLD and the strategies delegate to a fixed TokenizedStrategy implementation and are not upgradeable proxies.
  - The Accountant, OnLossDepositLimit and auctions are not upgradeable.
- **Timelock:** strategy additions and accountant changes go through the 7-day TimelockController. ySafe is the only proposer; ySafe and Brain can cancel.
- **Untimelocked powers:**
  - Brain (3-of-6) is `management` of ysyBOLD and all strategies, and `feeManager` of the Accountant.
  - Brain and ySafe hold DEPOSIT_LIMIT_MANAGER and DEBT roles on yBOLD.
- **Pause / emergency:**
  - EMERGENCY_MANAGER (ySafe, Brain, Security) can shut down yBOLD.
  - Security is `emergencyAdmin` of the strategies; Brain is `emergencyAdmin` of ysyBOLD.
  - Shutdown stops deposits but not withdrawals. `emergencyWithdraw` only moves funds into the strategy itself.
- **ySafe signers:** publicly known DeFi contributors ([Yearn multisig docs](https://docs.yearn.fi/developers/security/multisig)).

### Critical Permission Paths and Weakest Link

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Add a strategy to yBOLD (`add_strategy`), then route debt to it (`update_debt`) | Timelock (ADD_STRATEGY), ySafe proposer; then DEBT_MANAGER (Brain, ySafe, Security, Debt Allocator) | **7-day** delay, ySafe 6/9 proposer, Brain/ySafe can cancel | All yBOLD principal (7.61M BOLD) |
| Replace yBOLD Accountant (`set_accountant`) | Timelock (ACCOUNTANT_MANAGER) | 7-day delay | Future yield; a hostile accountant could take fees above the gain (`TODO`: confirm the v3.0.4 fee cap) |
| Reopen H-2: `allowDeposits` / `setAllowed`, `setLossLimitRatio`, then `report` / `tend` (management counts as a keeper) | **Brain 3-of-6** (`management` of each strategy) | No timelock. Extraction is limited to unsold liquidation collateral | Unsold collateral (0 at the snapshot); a share of each future liquidation |
| Remove the auction floor: `setMinAuctionPriceBps(0)` | **Brain 3-of-6** | No timelock. Start price is still oracle-based; anyone can buy (MEV competition) | Unsold liquidation collateral |
| Redirect all yBOLD yield: `Accountant.setFeeRecipient` | **Brain 3-of-6** (`feeManager`) | No timelock | Future yield only (accountant balance 0 at the snapshot) |
| ysyBOLD fees: `setPerformanceFee` (≤ 50% by TokenizedStrategy), `setPerformanceFeeRecipient`, `setProfitMaxUnlockTime` | **Brain 3-of-6** | No timelock. Fee capped at 50% of profit | Future yield only |
| Remove the deposit stop at PPS < 1: `set_deposit_limit_module` | Brain or ySafe | No timelock | Same bound as H-2 |
| Shutdown / emergency withdraw | ySafe, Brain, Security | Withdrawals stay open; funds stay in the strategy | None (liveness only) |

**Weakest credible path to material loss:**

- **Principal (all ~7.61M BOLD):** the only route to outright theft is adding a hostile strategy, which needs **ySafe 6/9 plus a 7-day public delay** that Brain can cancel.
- **Bounded paths (weakest overall):** Brain **3-of-6 with no timelock** can reopen the sBOLD/H-2 attack, remove the auction floor, or redirect yield. The exposure is limited to collateral not yet sold plus future yield, not deposited principal. The collateral can still be material right after large liquidations. Historical peak unsold-collateral balances were not measured (`TODO`).

### Programmability

- **PPS:** computed onchain. yBOLD is fixed at 1.0 by design. ysyBOLD rises through keeper reports with 3-day linear profit release.
- **Operations:** the yHaaS keeper runs reports, `tend()` (claims collateral and kicks auctions) and debt allocation. Anyone can buy from an auction. If the keeper stopped, yield and collateral conversion would stall, but users could still withdraw.
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
| yBOLD | [`0x9F4330700a36B29952869fac9b33f45EEdd8A3d8`](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8) | `pricePerShare()` (alert if ≠ 1e18), `deposit_limit_module()` (alert on change), `accountant()`, `StrategyChanged`, `DebtUpdated`, `StrategyReported` with loss > 0 |
| Strategies (×3) | [`0xc5e7…5b75`](https://etherscan.io/address/0xc5e7D3F76a03006540f17668A0267C668FFb5b75), [`0x3589…49a5`](https://etherscan.io/address/0x3589b93CaDb464b6E1974Cc9fc0c9be698Ee49a5), [`0x6ED5…9005`](https://etherscan.io/address/0x6ED566B76838A08d04cBd6323231B08a2eC69005) | **sBOLD/H-2 guards:** `openDeposits()` must stay false; alert on any `setAllowed`. Alert if `lossLimitRatio()` ≠ 0 or `doHealthCheck()` is false. Alert if `minAuctionPriceBps()` < 9500 or `bufferPercentage()` changes. Also watch `profitMaxUnlockTime()`, `management()`, `keeper()`, and unsold collateral (`SP.getDepositorCollGain + stashedColl + COLL.balanceOf(strategy) + COLL.balanceOf(AUCTION)`) |
| Auctions (×3) | [`0x61C9…9381`](https://etherscan.io/address/0x61C9e1113661C991fb6377B3610804476Dcd9381), [`0x64e8…5CcA`](https://etherscan.io/address/0x64e8050D33BB296d48FE8eb08d09F00633e45CcA), [`0x3793…8091`](https://etherscan.io/address/0x3793405FBcE404f351e76fa115209488aC0e8091) | `governanceOnlyKick()` must stay true; `Approval` events from the auctions to any spender other than CoW's `GPv2VaultRelayer` (attack A guard); `minimumPrice()` vs Liquity `lastGoodPrice()`; `AuctionKicked`, sales events; auctions that end without selling |
| Accountant | [`0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa`](https://etherscan.io/address/0x53acEBB9470Cfc9D231075154f5dcF1586A4c6fa) | `feeRecipient()` must equal ysyBOLD; `feeManager()`; `defaultConfig()` |
| OnLossDepositLimit | [`0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62`](https://etherscan.io/address/0x746C238E34a6dBFE1d35d50471467Bd7Bf898f62) | Must remain yBOLD's `deposit_limit_module` |
| Liquity V2 Stability Pools / Trove Managers | [`0x5721…F9bF`](https://etherscan.io/address/0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF), [`0x9502…e56B`](https://etherscan.io/address/0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B), [`0xd442…8695`](https://etherscan.io/address/0xd442E41019B7F5C4dD78F50dc03726C446148695); TMs [`0x7bcb…Cf5A`](https://etherscan.io/address/0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A), [`0xA289…8B22`](https://etherscan.io/address/0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22), [`0xb2B2…e19e`](https://etherscan.io/address/0xb2B2ABEb5C357a234363FF5D180912D319e3e19e) | `getTotalBoldDeposits()`, yBOLD share of each pool, `shutdownTime()` (alert if non-zero), large liquidations |
| Governance | ySafe, Brain, Security, Timelock (addresses above) | Threshold/owner changes; timelock `getMinDelay()` < 7 days; queued operations targeting yBOLD |

### Thresholds and Frequency

| Check | Threshold | Frequency |
|-------|-----------|-----------|
| Any sBOLD/H-2 guard change (`openDeposits`, `allowed`, `lossLimitRatio`, `doHealthCheck`, `deposit_limit_module`, ysyBOLD `profitMaxUnlockTime`) | Any change | Event-driven / hourly |
| `Approval` events with a strategy, ysyBOLD, yBOLD or the Accountant as owner, or an auction approving anyone except `GPv2VaultRelayer` | Any non-zero allowance | Event-driven |
| yBOLD `pricePerShare()` | ≠ 1e18 | Hourly |
| ysyBOLD `pricePerShare()` | Any decrease | Hourly |
| Unsold collateral per strategy | > 1% of strategy debt for > 24h | Hourly |
| `minAuctionPriceBps` / auction `minimumPrice` | < 95% of oracle | Daily |
| Accountant `feeRecipient` | ≠ ysyBOLD | Daily |
| Liquity branch `shutdownTime()` | ≠ 0 | Hourly |
| yBOLD share of a Stability Pool | > 75% | Daily |

## Appendix: Contract Architecture

```
                         ┌───────────────────────────────┐
  users ── yBOLD ──────▶ │ ysyBOLD (TokenizedStrategy)   │  3-day profit unlock, 10% perf fee
                         │ 0x2334…91cD  asset = yBOLD    │──fee shares──▶ Yearn Accountant 0x5A74
                         └──────────────▲────────────────┘
                                        │ distribute() at report (yBOLD fee shares)
                         ┌──────────────┴────────────────┐
                         │ yBOLD Accountant 0x53ac…      │  100% perf fee, waived while PPS < 1
                         └──────────────▲────────────────┘
                                        │ fee shares minted at process_report
  users ── BOLD ───────▶ ┌──────────────┴────────────────┐
                         │ yBOLD Vault v3.0.4 0x9F43…    │  PPS ≡ 1.0
                         │ deposit gate: OnLossDepositLimit (PPS < 1 → 0)
                         └───┬────────────┬───────────┬──┘
                       45.5% │      30.3% │     24.2% │   (closed strategies: only yBOLD may deposit)
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
            Brain 3/6 ── management of ysyBOLD + strategies, Accountant feeManager, DEBT / DEPOSIT_LIMIT on yBOLD
            Security 4/7 ── DEBT / MAX_DEBT / EMERGENCY on yBOLD, emergencyAdmin of strategies
            Keeper (yHaaS) ── report / tend;  Debt Allocator ── REPORTING + DEBT_MANAGER
```

---

## Risk Summary

### Key Strengths

- **Not exposed to the confirmed sBOLD exploit.** K3's post-mortem blames a leftover router approval from a swap anyone could call. yBOLD runs no caller-supplied swap calldata, its strategies, staker, vault and Accountant hold no standing allowances, and collateral is sold in Dutch auctions. The only approvals are the auctions' to CoW's relayer, guarded by `isValidSignature` price checks.
- **Share-pricing variants are also blocked today.** Share prices change only at keeper reports. Outsiders can't deposit into the strategies. Loss reports are blocked by the health check, the vault stops deposits when PPS < 1, and gains reach ysyBOLD only after three keeper steps plus a 3-day release.
- **Clean record:** ~18 months live, 1,258 vault reports and 329 staker reports, zero losses. ysyBOLD PPS rose 10.4% since launch.
- **Immutable, fully onchain stack:** no proxies or oracles in share accounting. Unsold collateral is counted as zero, so the reported value can only be lower than the true value.
- **Strategy changes go through the 7-day timelock** with ySafe 6/9 as the only proposer.
- **Instant full exit** to BOLD, simulated at the snapshot for 100% of ysyBOLD's yBOLD.

### Key Risks

- **Protection against share-pricing attacks (H-2) depends on settings, not code.** The audit marked H-2 "won't fix". Brain (3-of-6, no timelock) can reopen it by enabling strategy deposits, raising `lossLimitRatio`, swapping the deposit module, or zeroing the staker's profit release. The exposure is limited to unsold liquidation collateral.
- **Single-protocol dependency:** 100% in Liquity V2 Stability Pools, which are first-loss capital for liquidations. Liquity V2 needed a redeployment in 2025 and its TVL has fallen from $180M to $67M.
- **Concentration in Liquity:** yBOLD is ~50% of all Stability Pool BOLD and ~25% of BOLD supply (68.5% of the rETH pool). A large yBOLD exit materially shrinks Liquity's liquidation capacity.
- **Collateral sales rely on outside buyers.** Auctions floor at 95% of the Liquity oracle. In fast markets sales may stall (floor too high) or clear below market (floor stale and low). Brain can lower the floor without a timelock.
- **Deployed code differs from the audited code:** the live strategies, Accountant and staker include post-contest changes (auction pricing, oracle handling) that were reviewed only internally.
- **Small TVL:** ~$7.4M.

### Critical Risks

- None. No path to outright theft of principal avoids the 7-day timelock. The untimelocked Brain paths are limited to collateral recovery and yield.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **Unverified contract source**: all contracts in the address tables were checked and are verified on Etherscan (V3 vault implementation, TokenizedStrategy, staker, strategies, Accountant, OnLossDepositLimit, Auction implementation). ✅ PASS
- [x] **No audit**: Sherlock contest (yBOLD), Yearn V3 core (3 firms), Liquity V2 (4 firms + Cantina). ✅ PASS
- [x] **Unverifiable reserves**: Stability Pool deposits are fully onchain. ✅ PASS
- [x] **Total centralization**: multisigs (6/9, 4/7, 3/6) and a timelock; no EOA roles. ✅ PASS

**All gates pass.**

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits: 2.5.** Strong coverage of the underlying protocol (Liquity V2) and the V3 core. The yBOLD-specific code had one public contest, whose two Highs were accepted rather than fixed. The deployed strategies include post-contest changes that were reviewed only internally. The Auction and `OnLossDepositLimit` were outside the contest scope. Bounty: Yearn $200K (Immunefi) and Liquity (Hats).
- **Historical: 3.0.** ~18 months in production (score 2) but TVL under $10M (score 4). Zero losses.

**Score: 2.75/5**: (2.5 + 3.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 2.0.** Immutable contracts, 7-day timelock on strategy and accountant changes, ySafe 6/9. Brain 3-of-6 holds several untimelocked powers (strategy `management`, Accountant `feeManager`, DEPOSIT_LIMIT) that can reopen H-2 or redirect yield. These are limited to collateral recovery and yield, so not score 1.
- **Programmability: 2.0.** Share prices are computed onchain but move only at keeper reports. Collateral conversion depends on keeper `tend()` and outside auction buyers.
- **Dependencies: 3.5.** One critical dependency (Liquity V2, also the BOLD issuer). It is well audited and immutable, but was redeployed in 2025, has shrinking TVL, and yBOLD is about half its Stability Pool liquidity. Also depends on Chainlink-based Liquity price feeds for auctions.

**Score: 2.5/5**: (2.0 + 2.0 + 3.5) / 3.

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 2.0.** 100% onchain BOLD in Liquity Stability Pools. These take liquidation (and potential bad-debt) losses first, offset by ETH/LST collateral bought at a discount. No leverage.
- **Provability: 1.5.** Fully onchain and anyone can verify it. Values lag between keeper reports, and unsold collateral is counted as zero.

**Score: 1.75/5**: (2.0 + 1.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 1.5/5.** Atomic 1:1 exit to BOLD at full size, simulated at the snapshot, with no queue or fee. Not 1.0 because:

- the exit asset's (BOLD) market depth was not quoted (`TODO`);
- part of the value can sit in unsold collateral right after liquidations.

#### Category 5: Operational Risk (Weight: 5%)

**Score: 1.0/5.** Yearn: established team, named ySafe signers, BORG legal wrapper, public code and audit report.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 2.75 | 20% | 0.550 |
| Centralization & Control | 2.5 | 30% | 0.750 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **2.10/5.0** |

No optional modifiers apply: under 2 years live and under $500M TVL.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.10/5.0)**

---

## Reassessment Triggers

- **Time-based:** every 6 months (May 2027).
- **Configuration-based (sBOLD/H-2 guards):** any change to strategy `openDeposits` / `allowed`, `lossLimitRatio`, `doHealthCheck`, `minAuctionPriceBps`, `bufferPercentage`; yBOLD `deposit_limit_module` or `accountant`; ysyBOLD `profitMaxUnlockTime`; any new strategy on TokenizedStrategy ≥ v3.1 with live accounting.
- **TVL-based:** yBOLD TVL changes by more than ±50% (from ~7.6M BOLD), or yBOLD's share of any Stability Pool exceeds 75%.
- **Incident-based:** any reported loss on yBOLD or ysyBOLD, a Liquity V2 branch shutdown, a BOLD depeg above 2%, or new details from K3's sBOLD post-mortem that also apply to yBOLD (for example, a way to exploit CoW relayer approvals).

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| November 19, 2026 | 2.10 | Initial assessment at block 26,450,218. Compared with the K3 sBOLD exploit (leftover router approval): yBOLD holds no such approvals. Protection against the share-pricing variant (Sherlock H-2) relies on settings Brain 3-of-6 can change without a timelock. |
