# Protocol Risk Assessment: Flex

- **Assessment Date:** June 19, 2026 (Updated: September 2, 2026)
- **Token:** Flex yvUSD/USDC Lender position token (`ysUSDC`)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA)
- **Final Score: 3.26/5.0**

## Overview + Links

Flex is a **fixed-rate, CDP-style lending protocol inspired by Liquity V2**. Borrowers lock collateral in *Troves* and borrow a *borrow token*, paying a **fixed annual interest rate that they choose themselves** (bounded and adjustable with a cooldown). Lenders deposit the borrow token into a Yearn-V3-compatible *Lender* vault (an ERC-4626 tokenized strategy) and earn borrower interest plus surplus proceeds from collateral auctions. In exchange, lenders **absorb bad debt** from underwater liquidations, which is socialized atomically across the vault.

Liquidity is managed Liquity-V2-style through **redemptions**: when idle lender liquidity is insufficient (for a new borrow or for a lender withdrawal), the protocol redeems Troves — starting with the lowest interest-rate Troves — and **Dutch-auctions the seized collateral** to raise the borrow token. Borrowers can be liquidated by anyone once their collateralization ratio (CR) falls below the market's Minimum Collateral Ratio (MCR), with a liquidation fee that scales with how far below MCR the Trove sits.

The deployed protocol is the **v1.1 ("v2") revision**, merged to `master` on August 7, 2026 ([PR #20](https://github.com/flexmeow/flex-contracts/pull/20)) and deployed as new markets from `Factory` v1.1.0. The v2 revision reworks borrow and leverage flows around authenticated `troveCallback`s and direct auction settlement (the leverage zapper takes the redemption auction instead of using a flashloan), **redirects the borrower upfront fee from lenders to the protocol** as a first-loss buffer against bad debt, adds a configurable repay cooldown of up to one hour on newly created debt, and shortens the Lender's profit-unlock window to 4 days. The allocator layer Yearn deposits through was moved to a separate public repository, [`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator).

**Assessed token.** The token under assessment is the lending position token — the **Lender** ERC-4626 share (`ysUSDC`) of the largest live market: **yvUSD collateral / USDC borrow**. Yearn accesses this position through its own allocator vault `yvFlexUSDC` → `FlexLenderStrategy` → `Lender` (see *Appendix: Contract Architecture*). Yearn holds a second Flex position in the **ysyBOLD/USDC** market through an identical strategy; both are covered here because they share the same Lender code, the same Daddy-controlled parameters and the same lender-loss mechanics. The collateral asset **yvUSD** is itself a Yearn V3 USDC vault that Yearn has assessed separately ([`yearn-yvusd.md`](./yearn-yvusd.md)).

**Links:**

- [Protocol Documentation](https://flexmeow.com/docs)
- [GitHub Repository — core](https://github.com/flexmeow/flex-contracts)
- [GitHub Repository — allocator](https://github.com/flexmeow/flex-allocator)
- [Audits folder](https://github.com/flexmeow/flex-contracts/tree/master/audits)
- [Risks page](https://flexmeow.com/risks)
- [DeFiLlama](https://defillama.com/protocol/flex) - TVL tracking
- Collateral asset assessment: [yvUSD report](./yearn-yvusd.md)

## Audits and Due Diligence Disclosures

Flex has undergone **six security reviews**, all published in the repo's [`audits/`](https://github.com/flexmeow/flex-contracts/tree/master/audits) folder:

| Date | Reviewer(s) | Scope / commit | Headline result |
|------|-------------|----------------|-----------------|
| Feb 28, 2026 | Independent review (`FLEX-Audit-28-February-2026.md`) | commit `10ef9ed…` | 4 Medium (zombie-trove tracking, partial-liq, redemption of unhealthy troves, re-kick price-freeze) + several Low/Info; some marked "will not fix" (Liquity-V2-inherited behaviors) |
| March 2026 | **HHK** & **adriro** (`2026-03-Flex-report.pdf`) | v1 core | 1 High (arbitrary `raw_call` in LeverageZapper enabling trove theft), 3 Medium, 7 Low |
| April 27, 2026 | Independent review (`flex-audit-27-april.md`) | v1 core | FLEX-001 High (stale Lender PPS enabling atomic bad-debt-escape / auction-surplus capture), FLEX-002 (upfront-fee basis) + others |
| May 7, 2026 | **Dedaub** (`Flex-May-07-2026-Dedaub.pdf`) | v1 core, commit `b4b9656…` | 0 Critical, 0 High; Medium issues reported RESOLVED |
| **Aug 5, 2026** | **Dedaub** (`Flex-v1.1-August-05-2026-dedaub.pdf`) | v1.1/v2 upgrade, commit `92dfb87b…`; `auction.vy`, `factory.vy`, `Lender.sol`, `LenderFactory.sol`, `leverage_zapper.vy`, `trove_manager.vy` | **0 Critical, 0 High, 0 Medium, 0 Low**; two advisory issues (A1 upfront-fee suppression via helper Trove, A2 same-ID re-kick repricing stale takes), both **DISMISSED** by the team |
| **Aug 11, 2026** | **Zero Cool** (`zero-cool-flex-v2-review.pdf`) — [autonomous AI security agents](https://zerocool.ai/) | deployed `master`, commit `b96c12a1…`; 10 files incl. `trove_manager.vy`, `Lender.sol`, `auction.vy`, `dutch_desk.vy`, `registry.vy` | **1 High, 7 Medium, 4 Low — all 12 Unresolved.** No fix review performed |

Dedaub's review of the v2 upgrade is a genuinely clean result: three auditors, two weeks, and no findings above advisory severity. Its two advisories were both dismissed by the team — A1 (a helper Trove at the minimum rate depresses the debt-weighted average that sets the upfront fee, undercollecting up to ~$24K on a $1M position in an empty market) reduces `unclaimed_protocol_fees`, which is precisely the first-loss reserve standing between bad debt and lender principal.

The **Zero Cool review has not been acted on**. It ran against the deployed commit, and the repository's most recent commit is the one that added the report itself ([`ac0835f4`](https://github.com/flexmeow/flex-contracts/commit/ac0835f4), August 11, 2026) — no remediation has landed in the nineteen days since, during which a third market was deployed and funded. Four of its findings bear directly on lender share value:

- **M-01 — liquidation callbacks allow stale-PPS bad-debt escape.** Underwater liquidation subtracts the full Trove debt from `total_debt` *before* invoking the receiver-controlled `takeCallback` and before the atomic keeper `report()`. A liquidator that already holds Lender shares can redeem them at the pre-loss cached price from inside the callback, funded by the Lender's idle balance, and exit before the loss is priced in. This is the same class as the April-27 FLEX-001 finding, reopened by the v2 callback flow.
- **M-02 — partial bounded redemptions create discounted Lender shares.** `_redeem()` stops after 1,000 Troves without reporting how much it actually freed; `TokenizedStrategy._withdraw()` then books the entire shortfall as a realized loss even though the unredeemed debt is still a Lender asset, depressing the share price for a subsequent depositor.
- **M-05 — just-in-time depositors capture previously accrued lender interest.** Deposits price against `TokenizedStrategy.totalAssets()`, which only picks up accrued Trove interest when `_harvestAndReport()` calls `sync_total_debt()`. The permissionless keeper lets an attacker deposit and trigger the report in one transaction.
- **L-04 — just-in-time deposits dilute auction surplus** through the same cached-`totalAssets` window, using the auction `take()` callback.

M-05 is not theoretical. When the v1 market was wound down in August 2026 the exiting allocator strategy redeemed at the cached price and the ~$913 of interest accrued since the prior report was left behind, lifting the residual Lender's price per share to ~1.51 for the ~1,327 shares that stayed ([`Reported` event, block 25756324](https://etherscan.io/tx/0x20ba4c339bba4c750fa2a19d2caf762512b22232a122c41284b95eb4caa0c254)). The amount was immaterial (≈0.11% of the $800K exit) but the mechanism is the one the finding describes, and it scales with the gap between reports.

**Audit scope vs. deployed/Yearn-path code.** The six reviews cover the **core protocol**, and two live markets' price oracles fall outside it: the ysyBOLD and yvcrvUSD-2 oracles sit on unmerged pull requests ([#22](https://github.com/flexmeow/flex-contracts/pull/22), [#23](https://github.com/flexmeow/flex-contracts/pull/23)) and were in no review's scope, leaving the pricing for $300,086 of live debt unaudited (see *Provability*). The **allocator layer** (`Strategy.sol`, `StrategyFactory.sol`, `ExitRouter.sol` in [`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator)) has **no external audit** — the repository has no `audits/` directory. It is covered by Yearn's own strategy-security process (yearn-strategies #756, "Flex Lender"). That ticket is **still open**, with the "Review Ongoing By" and "Review Completed By" checkboxes for both named reviewers (Schlagonia, fp-crypto) unchecked. A Yearn security reviewer (`tapired`) did conduct a detailed line-level review through August 2026, had several findings fixed, and signed off "Deployed code LGTM" (August 10) and again on the ysyBOLD strategy (August 13), with one caveat recorded verbatim: *"We discussed on how there can be race conditions for users when there are losses for the Lender because of `pendingRedemptions` but all acknowledged."* The ticket's recorded internal risk score is **29**, with the comment *"This is a new lending primitive that has not been extensively battle-tested on mainnet. Collateral quality should also be considered."*

**Complexity:** The onchain surface is **substantial** — a full Liquity-V2-style CDP engine (`trove_manager.vy`, `sorted_troves.vy`, `dutch_desk.vy`, `auction.vy`, `factory.vy`, `registry.vy`) written in Vyper, plus a Solidity Yearn-V3 lender layer (`Lender.sol`, `LenderFactory.sol`), a per-market price oracle, and an allocator strategy with an exit router. The v2 callback-based borrow and leverage flow adds re-entrancy-adjacent surface that did not exist in v1, and is the root of the M-01 and L-04 findings. The codebase ships a Slither config and Foundry invariant tests (e.g. `test/invariant/DebtInvariant.sol`).

**Other unresolved items:** A few low-severity items are explicitly "will not fix" as inherited Liquity V2 behavior (interest-dust rounding, small-repay interest baking). No outstanding Critical finding exists on any reviewed component; the principal open caveats are the twelve unaddressed Zero Cool findings on the deployed commit and the incomplete allocator strategy review (#756).

### Bug Bounty `[If Applicable]`

- **None.** No bug-bounty program appears on the docs, the risks page, Immunefi, or the [SEAL Safe Harbor registry](https://safeharbor.securityalliance.org/). Dedaub's own report recommends "a public bug bounty program" alongside multiple independent audits for high-value contracts.

## Historical Track Record

- **Time in production: ~3.5 months, but the deployed markets are days to weeks old.** The first live core contracts and the original yvUSD/USDC market were deployed May 12–14, 2026. Every market carrying debt today is far newer: [yvUSD/USDC](https://etherscan.io/address/0x8ee72c388aA73096338EE18CD46a39D98b8983c9) deployed **August 5** and endorsed August 7; [ysyBOLD/USDC](https://etherscan.io/address/0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E) deployed **August 12** and endorsed August 13; [yvcrvUSD-2/USDC](https://etherscan.io/address/0x7582b47486F75F5D675f260d357972cD0DbEeA2E) deployed **August 23** and endorsed **August 24, 2026** — roughly one week of production history. Earlier broadcast artifacts date to October 2025, indicating an extended testnet/redeploy history.
- **TVL: ~$1.09M.** [DeFiLlama](https://defillama.com/protocol/flex) reports $1,090,024 for Flex on September 2, 2026. This reconciles with onchain collateral: $684,661 (yvUSD) + $262,347 (ysyBOLD, of which $33,213 is unpledged residue) + $116,365 (yvcrvUSD-2) + $24,975 (retired v1 market) = **$1,088,349**.
- **Security incidents:** None known.
- **Migration event, August 2026.** The original yvUSD/USDC market was wound down and replaced rather than upgraded — the v1 market's Troves closed, the allocator strategy [`0x467Ce108…7751`](https://etherscan.io/address/0x467Ce10870747372968ba98463A1d9af9Fb27751) redeemed its ~$800K of Lender shares in three tranches between August 13 and August 19, and the strategy was revoked from the `yvFlexUSDC` vault. No loss was reported on any of the exits. The retired v1 `TroveManager` still holds 24,308.75 yvUSD (~$24,960) against 147 wei of debt in a zombie Trove; its Lender retains $2,001 against 1,232 shares, a price per share of **1.62** built from interest that accrued after the large holder exited at a stale cached price.
- **Governance actions, August 24, 2026.** Daddy executed two transactions three minutes apart. The first ([`0xe1e6f4b0…`](https://etherscan.io/tx/0xe1e6f4b0a3c67389804fbcf80acbf29dc46e923de7f24ca56f76471ca194bf63)) **unendorsed the retired v1 yvUSD/USDC market and the never-funded siUSD/USDC market** — both now report `market_status = 2` — and simultaneously set **`depeg_mode = true`** on the ysyBOLD oracle, removing that market's artificial 0.99 floor on BOLD/USDC. The second ([`0xe292a429…`](https://etherscan.io/tx/0xe292a42968fa1b2b5b406c8e7819ad2a404aaedb7e3afaf7864d5af6a5379290)) endorsed the new yvcrvUSD-2/USDC market. Both the retirement of dead markets and the removal of the price floor are lender-protective choices; the point of record is that all three took effect immediately, with no timelock.
- **Concentration risk:** With ~$1.06M TVL sourced essentially entirely through Yearn's own allocator vault, the depositor base is highly concentrated. **90.9% of `yvFlexUSDC` shares are held by the Yearn Treasury** ([`0x93A62dA5…Efde`](https://etherscan.io/address/0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde), ~$1.0M of 1.10M shares); the next holder accounts for 9.0%. The vault is also not a publicly-listed Yearn product — it is absent from yDaemon's vault index, so it reads as Treasury-seeded pilot capital rather than a live retail vault. Borrower concentration is similar: 22 Troves across the three live markets, with the largest position in each accounting for 36.0%, 26.8% and 26.7% of that market's debt.
- **Peg / depeg history:** None. All live markets are USD-denominated on both legs.

## Funds Management

Flex runs **three endorsed markets**, all of which carry debt. The fund flow for Yearn's position is:

**User USDC → `yvFlexUSDC` (Yearn V3 allocator vault) → `FlexLenderStrategy` → `Lender` (`ysUSDC`) → market lending**, where borrowers post collateral to borrow USDC.

The `yvFlexUSDC` vault holds **$1,111,920** and allocates it across four strategies — **81.0% of it sits in Flex**:

| Strategy | Address | Allocation | Underlying | Instantly withdrawable |
|----------|---------|-----------:|------------|----------------------:|
| Flex yvUSD/USDC Lender | [`0x7501EAE6…D737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | $600,498 (54.0%) | Flex Lender [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) | $0 |
| Flex ysyBOLD/USDC Lender | [`0xDd58AeFE…b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | $200,028 (18.0%) | Flex Lender [`0xf4996Ca4…a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) | $0 |
| Flex yvcrvUSD-2/USDC Lender | [`0xC818A0Be…f39d`](https://etherscan.io/address/0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d) | $100,000 (9.0%) | Flex Lender [`0xc1f281A3…eC84`](https://etherscan.io/address/0xc1f281A3643F219636F97F6E687A33704950eC84) | $0 |
| USDC To SKY USDS Depositor | [`0xfb4F83c3…F95e`](https://etherscan.io/address/0xfb4F83c3923eab7B6254cD2399C206109970F95e) | $211,394 (19.0%) | Sky sUSDS — not a Flex position | $211,491 |

The endorsed market set is enumerable onchain via `Registry.get_all_markets()`, which returns five `TroveManager`s of which three carry `market_status = 1` (endorsed) and two `market_status = 2` (unendorsed). Endorsement and unendorsement are Daddy-only and observable through `EndorseMarket` / `UnendorseMarket`. The Yearn-side allocation is managed by the Yearn Strategist MultiSig (SMS) through standard Yearn V3 vault roles.

| Market | TroveManager | Lender | Collateral | Debt | Collateral value | System CR | Troves |
|--------|--------------|--------|------------|-----:|-----------------:|----------:|-------:|
| yvUSD/USDC | [`0x8ee72c38…83c9`](https://etherscan.io/address/0x8ee72c388aA73096338EE18CD46a39D98b8983c9) | [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) | yvUSD | $601,088 | $684,661 | **113.9%** | 10 |
| ysyBOLD/USDC | [`0xADf4E022…Fc6E`](https://etherscan.io/address/0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E) | [`0xf4996Ca4…a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) | ysyBOLD | $200,194 | $229,134 | **114.5%** | 6 |
| yvcrvUSD-2/USDC | [`0x7582b474…eA2E`](https://etherscan.io/address/0x7582b47486F75F5D675f260d357972cD0DbEeA2E) | [`0xc1f281A3…eC84`](https://etherscan.io/address/0xc1f281A3643F219636F97F6E687A33704950eC84) | yvcrvUSD-2 | $100,025 | $116,365 | **116.3%** | 6 |
| yvUSD/USDC (unendorsed) | [`0xd82DB989…2e49`](https://etherscan.io/address/0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49) | [`0x33C45216…B732`](https://etherscan.io/address/0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732) | yvUSD | 147 wei | $24,975 | — | 0 |
| siUSD/USDC (unendorsed) | [`0x484E3c28…C09D`](https://etherscan.io/address/0x484E3c28A99282Ce0682f65A5F902876f370C09D) | [`0x9a28d962…2456`](https://etherscan.io/address/0x9a28d962aF18B304cA2bA16bf998D1EaF8452456) | siUSD | $0 | $0 | — | 0 |

The collateral column counts only collateral pledged against Troves; the ysyBOLD market additionally holds $33,213 of unpledged residue in fully-redeemed Troves (see *Collateralization*). All three Lenders hold zero idle USDC. Lender withdrawals beyond idle cash call `TroveManager.redeem(...)`, which Dutch-auctions borrower collateral; proceeds route to the withdrawer.

### Accessibility `[If Applicable]`

- **Lending (mint of `ysUSDC`):** Permissionless ERC-4626 deposit of USDC into the Lender — anyone can mint Lender shares against deposited assets, up to the $2,000,000 per-Lender `depositLimit`. The intermediate `FlexLenderStrategy` is access-gated: `availableDepositLimit` returns 0 for any address other than the allow-listed `yvFlexUSDC` vault.
- **Redeeming (burn of `ysUSDC`):** Permissionless `withdraw`/`redeem` at the Lender. At the strategy layer the picture is tighter: `FlexLenderStrategy.availableWithdrawLimit()` returns *idle USDC in the strategy plus idle USDC in the Lender*, which is currently **0 for both Flex strategies**. A full exit therefore requires either Yearn SMS calling the management-gated `forceFreeFunds(amount, minOut)`, or a user routing through the `FlexExitRouter`, which sets a proceeds receiver so the withdrawal is delivered directly to the exiting user — idle liquidity atomically and the remainder asynchronously via a redemption auction, with the shortfall booked as a loss on that user's withdrawal.
- **Borrowing:** Permissionless — anyone can open a Trove. A configurable `repay_cooldown` (max 1 hour) must elapse between opening or increasing debt and repaying or closing it.
- **Fees / rate limits:** Borrowers pay an **upfront fee** (~1 week of the market-average rate) and a **premature-rate-adjustment fee**; both now accrue to the protocol as a first-loss buffer against bad debt rather than to lenders. Lenders pay a **10% performance fee** — `performanceFee` reads **1000 bps** on both live Lenders with `performanceFeeRecipient = Daddy`. Realized lender profit unlocks linearly over `profitMaxUnlockTime = 4 days`. The allocator vault's own deposit limit is effectively uncapped.

### Token Mint Authority

The assessed token `ysUSDC` is a **Yearn V3 `BaseHooks` TokenizedStrategy** (ERC-4626). Shares are not mintable by any privileged role — they are minted/burned **only** through permissionless `deposit`/`mint`/`withdraw`/`redeem`, and every mint is **fully backed in the same transaction** by the USDC the depositor transfers in. There is no `MINTER_ROLE`, no whitelist mapping, and no owner mint path.

**Mint mechanism:** Permissionless ERC-4626 deposit (asset deposited atomically; shares priced off the strategy's cached `totalAssets`).

**Mint requires backing:** Yes — USDC must transfer in the same transaction; no admin can issue unbacked shares.

**Per-address mint authority** (Lender [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any depositor | ✓ | ✓ | Permissionless ERC-4626 `deposit`/`redeem` | Shares priced against cached `totalAssets`; no privileged minter exists |

**Rate limits / supply caps:** `depositLimit = 2,000,000 USDC` per Lender (settable by management/Daddy via `setDepositLimit`); `availableDepositLimit` returns 0 once total assets reach the cap. Current headroom on the yvUSD Lender is ~$1.40M.

**Backing check at mint time:** Atomic — the depositor transfers USDC in the same transaction. Share **price**, however, is computed against a *cached* `totalAssets` refreshed only by permissionless `report()` calls, which is the mispricing surface behind Zero Cool M-05 and L-04 (see *Provability*). This is a value-transfer surface between depositors, not an unbacked-mint surface.

There is **no privileged minter** — a positive signal. The dependency graph therefore contains **no `mints` edge** into `ysUSDC`.

### Collateralization

- **Onchain and over-collateralized, with a thin buffer.** Debt is measured as `sync_total_debt()` / `get_trove_debt_after_interest()`, the interest-accrued figures the protocol itself uses to decide liquidations — stored `trove.debt` lags accrual and flatters the ratio by up to ~0.3 percentage points. Collateral is counted only where it is actually pledged against a Trove. Against a 110% MCR:
  - **yvUSD/USDC:** debt **601,088.10 USDC**; pledged collateral **666,406.47 yvUSD** at **1.027393 USDC/yvUSD** → **$684,661.34**; **backing CR = 113.90%**.
  - **ysyBOLD/USDC:** debt **200,194.13 USDC**; pledged collateral **209,459.62 ysyBOLD** at **1.093929 USDC/ysyBOLD** → **$229,134.04**; **backing CR = 114.46%**.
  - **yvcrvUSD-2/USDC:** debt **100,025.13 USDC**; pledged collateral **100,993.35 yvcrvUSD-2** at **1.152209 USDC/yvcrvUSD-2** → **$116,365.48**; **backing CR = 116.34%**.
- **Not all collateral in a market backs debt.** The ysyBOLD `TroveManager` holds **239,821.18 ysyBOLD** but only 209,459.62 of it is pledged: **30,361.56 ysyBOLD (~$33,213) sits in three fully-redeemed Troves that carry zero debt**, awaiting withdrawal by their owners. That residue is borrower property and is not available to absorb lender losses, so the naive `collateral_balance / total_debt` ratio for that market reads **131.05%** against a true backing ratio of 114.46%. Any monitoring built on the naive ratio will overstate protection; the yvUSD and yvcrvUSD-2 markets currently have no such residue and the two ratios coincide.
- **Trove-level distribution.** Walking all 22 Troves gives a range of **110.07% to 171.41%** and a debt-weighted average of **114.30%**. The tail matters more than the average: **22.3% of debt sits below 111% CR, 59.1% below 112%, and 68.5% below 113%**. Per market the debt-weighted CR is 113.90% (yvUSD), 114.46% (ysyBOLD) and 116.34% (yvcrvUSD-2); the lowest single Trove sits at 110.07%, effectively on the liquidation line. Because all three collaterals are yield-bearing USD vault shares whose price falls only on a realized loss, the practical trigger is an impairment in an underlying vault rather than market volatility; when it comes it hits a whole market's book at once.
- **First-loss reserve is negligible.** The v2 upfront fee is meant to buffer lenders against bad debt, but `unclaimed_protocol_fees` reads **$90.74**, **$80.34** and **$4.50** across the three markets — **$175.59 in total against $901,307 of debt**. The buffer is real in design and immaterial in size, and Dedaub advisory A1 plus Zero Cool H-01 and M-07 all describe ways for borrowers to suppress it further.
- **Collateral quality:** High-quality but concentrated per market, and now spread across three dependency chains:
  - **yvUSD** is a Yearn V3 USDC vault assessed in [`yearn-yvusd.md`](./yearn-yvusd.md). Because both legs are USD, the market is effectively leveraged USDC-yield exposure; the dominant residual risk is a yvUSD loss feeding through the oracle.
  - **ysyBOLD** ([`0x23346B04…91cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD), Staked yBOLD) is a Yearn V3 vault over [yBOLD](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8), which is itself a vault over Liquity V2's [BOLD](https://etherscan.io/address/0x6440f144b7e50D6a8439336510312d2F54beB01D). A three-layer chain terminating in **Liquity V2, which Yearn has not assessed**, and one that introduces genuine USD price discovery: BOLD is not USDC.
  - **yvcrvUSD-2** ([`0xBF319dDC…805F`](https://etherscan.io/address/0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F)) is a publicly-listed Yearn V3 vault (~$1.20M crvUSD of assets, of which Flex's market holds ~9.7%) over Curve's [crvUSD](https://etherscan.io/address/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E). Same structural shape as the ysyBOLD leg — a Yearn vault wrapping a third-party CDP stablecoin — and **neither the vault nor Curve/crvUSD has a report in this repository**.
- **Ratios:** MCR = **110%**, "safe" CR = **120%**, max-penalty CR = **105%**, minimum liquidation fee 0.5%, maximum 5%, minimum debt 500 USDC. Identical across all markets.
- **Liquidations:** Onchain and permissionless. Below MCR, anyone can liquidate; the fee scales linearly with shortfall. If seized collateral (including fee) exceeds the Trove's collateral, the shortfall is **socialized to lenders** atomically after the protocol fee reserve is consumed. Redemptions Dutch-auction collateral via `dutch_desk.vy` / `auction.vy`: 1-day auctions, 1-minute price steps, starting at 100% of oracle value (100.1% on a re-kick) and stopping at 99%, identically parameterized in all three live markets.
- **Admin control over funds:** The immutable market contracts hold collateral; no admin can withdraw borrower collateral. Daddy (3-of-5 multisig) is each Lender's *management*, the Registry owner, and the recipient of both fee streams. It cannot seize collateral or user shares, but it can change Lender parameters, shut a Lender down, change the keeper, set fees, endorse and unendorse markets, and — in the ysyBOLD market — move the oracle's depeg floor (see *Centralization*).
- **Risk curation:** Market parameters (MCR, fees, auction params, oracle) are **fixed at market-deploy time** by the `factory.vy` deploy call and are **immutable** for that market. Adding markets with different parameters or collateral requires a factory deployment plus Daddy endorsement, as happened for all three live markets.

### Provability

- **Fully onchain and independently verifiable.** Total debt, collateral balance and CR are readable from each `TroveManager`; a Lender's assets are idle USDC plus `TROVE_MANAGER.sync_total_debt()`. Anyone can recompute the backing ratio.
- **Exchange rate / PPS:** Each Lender is a Yearn TokenizedStrategy whose `pricePerShare` (1.001133 on the yvUSD Lender, 1.000211 on ysyBOLD, 1.000068 on yvcrvUSD-2) derives from a **cached `totalAssets`** that is refreshed only when the **permissionless keeper** ([`0x52605Bbf…b2f8`](https://etherscan.io/address/0x52605BbF54845f520a3E94792d019f62407db2f8), hard-coded in `LenderFactory`) calls `report()`. Interest accrues continuously in the `TroveManager` but is only priced into shares at report time, so the share price lags real assets between reports. This is the root of Zero Cool M-01, M-02, M-05 and L-04, all unresolved. The v1-era mitigations remain in place — liquidation still calls `lender.disableHealthCheck()` and forces a keeper report in the same transaction, and realized profit still unlocks over 4 days — but M-01 documents a callback window inside the liquidation that opens before that report executes, and M-05/L-04 attack the report itself rather than the profit-unlock schedule.
- **Reporting can be blocked by a pending auction.** `FlexLenderStrategy._harvestAndReport()` reverts while the strategy's last redemption auction is unsettled, so allocator-level accounting pauses until the auction clears or is re-kicked.
- **Oracles:** Each market has its own immutable Vyper oracle, and the three live markets use three different designs:
  - **yvUSD/USDC:** [`0xDB8DBB6c…7D2e`](https://etherscan.io/address/0xDB8DBB6c0548341Aea85ebAAFa681B4A8c077D2e) wraps a Morpho [`MorphoChainlinkOracleV2`](https://etherscan.io/address/0xC44Ee741C22957e6b3d40022894Eb50e6a7069EF) configured with yvUSD as `BASE_VAULT` and **no price feeds**, so the reported price is yvUSD's own `convertToAssets` rescaled. Appropriate for the pair: yvUSD's underlying asset is USDC and lenders deposit USDC, so there is no separate USDC→USD price-discovery problem — only whether the yvUSD vault correctly reports its own USDC-denominated value, which is a Yearn framework concern covered in [`yearn-yvusd.md`](./yearn-yvusd.md).
  - **ysyBOLD/USDC:** [`0x40556811…AE65`](https://etherscan.io/address/0x405568114Ee8058d0ca1Bbe95DA1f929279BaE65) converts ysyBOLD → yBOLD → BOLD through the two vaults' exchange rates, then prices BOLD/USDC off the **Curve BOLD/USDC pool's EMA oracle** ([`0xEFc65163…4B3E`](https://etherscan.io/address/0xEFc6516323FbD28e80B85A497B65A86243a54B3E), 0.99 floor currently disabled). The BOLD/USDC leg is **capped at 1.01**, and a 0.99 floor applies unless Daddy sets `set_depeg_mode(true)`. **Daddy set it to `true` on August 24, 2026**, so the floor is currently lifted and the oracle tracks a real BOLD depeg downward — the lender-protective configuration. The residual governance risk is symmetric: the same key can switch the floor back on, at which point a depegging market would again be valued at 0.99.
  - **yvcrvUSD-2/USDC:** [`0x01821e20…a8B2`](https://etherscan.io/address/0x01821e20e102A9c9878298fde6b87B1885Baa8B2) converts yvcrvUSD-2 → crvUSD through the vault rate and prices crvUSD/USDC off the **Curve USDC/crvUSD pool's EMA oracle** ([`0x4DEcE678…d69E`](https://etherscan.io/address/0x4DEcE678ceceb27446b35C672dC7d61F30bAD69E), 1.00001). This design is **capped at 1.01 with no floor and no privileged switch at all** — structurally the soundest of the three, since it recognizes a crvUSD depeg without needing anyone to act.
  - **Oracle code is outside the audited repository.** The ysyBOLD and yvcrvUSD-2 oracles are Etherscan source-verified, but neither has been merged into `flex-contracts` `master`: they live on open pull requests ([#22](https://github.com/flexmeow/flex-contracts/pull/22), open since August 11, and [#23](https://github.com/flexmeow/flex-contracts/pull/23), open since August 21). Neither was in scope for any of the six security reviews — Dedaub's August audit covered `auction.vy`, `factory.vy`, `Lender.sol`, `LenderFactory.sol`, `leverage_zapper.vy` and `trove_manager.vy`, and Zero Cool's ten-file scope likewise excluded them. **The collateral pricing for $300,086 of live debt — the ysyBOLD and yvcrvUSD-2 markets — is therefore unaudited, unmerged code.** It is readable and simple, but it sits outside the review process the rest of the protocol went through.
- **Third-party verification:** None beyond direct onchain reads (no Chainlink price feed on any live market, no PoR, no custodian).

## Liquidity Risk

- **Exit is auction-mediated, and the standard path frees nothing from Flex.** All three Lenders hold zero idle USDC, so `FlexLenderStrategy.availableWithdrawLimit()` — idle USDC in the strategy plus idle USDC in its Lender — returns **$0 on all three Flex legs**. Of the allocator vault's $1,111,920, only **$211,491 (19.0%) is instantly withdrawable, and every dollar of it is the non-Flex Sky USDS strategy**. Freeing the $900,526 in Flex requires Yearn SMS to call `forceFreeFunds`, or a user to route through the `FlexExitRouter` — in which case idle liquidity is delivered atomically, the remainder arrives asynchronously as the redemption auction is taken, and the shortfall is **accounted as a loss on that user's withdrawal**.
- **Depth:** TVL is small (~$1.09M) and depositor concentration is extreme (90.9% Yearn Treasury). There is no external DEX market for `ysUSDC`; exit relies entirely on the protocol's own redemption machinery against $1,030,161 of pledged collateral in the three live markets, and on the collateral vaults' own exit liquidity. Spreading the book across three collaterals is a mild diversification of that exit path, but each market's auction can only be taken in its own collateral.
- **Stress behavior:** Auctions run 1 day with 1-minute steps, starting at 100% of oracle value and stopping at 99%, so a taker willing to redeem the collateral vault share for its underlying can clear near par in benign conditions. Under stress the same auction becomes the throttle: redemptions and liquidations can deliver less than 1:1, bad debt is socialized to lenders, and `_harvestAndReport` is blocked while an auction remains unsettled. Zero Cool M-02 additionally describes a case where a redemption that hits the 1,000-Trove traversal bound books the entire unfilled amount as a loss — not reachable at 10, 6 and 6 Troves today, but a scaling constraint.
- **Same-value assets:** All live legs are USD-denominated, so modest exit delays carry limited directional price risk. In the ysyBOLD and yvcrvUSD-2 markets that holds only while BOLD and crvUSD hold their pegs; both oracles now track a depeg downward, so the price feed will register it rather than mask it.

## Centralization & Control Risks

### Governance

- **Core market contracts are immutable.** Each market's TroveManager, SortedTroves, DutchDesk and Auction are **EIP-1167 minimal clones** of fixed implementations held by `Factory` v1.1.0 — the yvUSD and yvcrvUSD-2 TroveManagers, for instance, are byte-identical clones of [`0x41D491d2…39cE`](https://etherscan.io/address/0x41D491d261ad0D34bBFFFb3e2098f57beC4139cE). The implementation address is baked into the clone bytecode and both EIP-1967 slots read zero, so there is **no admin and no upgrade path**. The Lenders and `FlexLenderStrategy` instances are non-upgradeable Yearn TokenizedStrategy clones. Every deployed contract in the stack is source-verified on Etherscan.
- **But there *is* privileged control — the protocol's "no admin keys" claim is false.** The [risks page](https://flexmeow.com/risks) still states that Flex has *"no admin keys, no privileged users, and no ability to pause, upgrade, or modify"* the protocol after deployment. This holds only for the immutable market mechanics. Onchain, a **`Daddy` contract** ([`0x4e8341C7…8290`](https://etherscan.io/address/0x4e8341C77c94cCE982AB96d92BB28D69f4638290)) — a generalized arbitrary-`execute` owner — holds real powers:
  - It is each **Lender's `management`** (can `setDepositLimit`, `setPerformanceFee`, `setPerformanceFeeRecipient`, `setKeeper`, `setProfitMaxUnlockTime`, and `shutdownStrategy`),
  - It is the **Registry owner** (can `endorse`/`unendorse` markets — exercised three times on August 24, 2026 alone),
  - It is the **`performanceFeeRecipient`** on both live Lenders, collecting the live 10% lender performance fee and the borrower upfront fees,
  - It is the sole caller of **`set_depeg_mode`** on the ysyBOLD oracle, a switch that changes how collateral in a live market is valued; it currently reads `true`, the lender-protective setting.
- **Note on emergency withdrawal:** `Lender.sol` does **not** override `_emergencyWithdraw`, so the inherited Yearn default is a **no-op** — Daddy *cannot* pull a Lender's deployed assets out of its market. Its emergency lever is limited to `shutdownStrategy` (blocks new deposits; existing lenders can still withdraw through the normal redemption path). The `FlexLenderStrategy` *does* implement `_emergencyWithdraw`, but that strategy is controlled by Yearn SMS, not Daddy.
- **Daddy is owned by a 3-of-5 Safe multisig** ([`0x687b82dA…3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67), Safe v1.4.1). The threshold was raised from 2 to 3 on June 24, 2026 (block 25388899) and a fifth owner added on August 13, 2026 (block 25747928). Current owners:
  - [`0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504`](https://etherscan.io/address/0x0Dca0FDC170baA4CA9c1dCd37Ffe01f97bCfD504)
  - [`0x7492976ef91E02B4868341d49F3f711d8e94659f`](https://etherscan.io/address/0x7492976ef91E02B4868341d49F3f711d8e94659f)
  - [`0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F`](https://etherscan.io/address/0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F)
  - [`0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092`](https://etherscan.io/address/0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092)
  - [`0x000005281a2b04A182085D37cC9E6dD552795caa`](https://etherscan.io/address/0x000005281a2b04A182085D37cC9E6dD552795caa) — deployer, `johnny.flexmeow.eth`
  - Per the protocol team (PR review), the original four keys were two held by the Flex developer plus two well-known pseudonymous Yearn-ecosystem reviewers ("corn" and "schlag"/Schlagonia). The fifth signer is not publicly mapped.
- **No timelock** sits in front of Daddy. A 3-of-5 threshold is a meaningful improvement over the 2-of-4 it replaced, but there is still no delay between a signed transaction and its effect — including for market endorsement and the ysyBOLD depeg switch.
- **Yearn-side control:** The `yvFlexUSDC` allocator vault and both `FlexLenderStrategy` instances are managed by the **Yearn Strategist MultiSig (SMS, [`0x16388463…0ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7))**, which holds all 14 vault roles; the yHaaS keeper ([`0x604e586F…711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E)) holds the reporting role only. A role-manager handover to the Yearn [`RoleManager`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) contract is pending (`future_role_manager` set, not yet accepted). Daddy cannot seize lender shares or borrower collateral; its worst case is parameter abuse, fee extraction, lender shutdown, oracle-floor manipulation on the ysyBOLD market, and endorsing a malicious new market.

### Programmability

- **Highly programmatic.** Borrowing, interest accrual, redemptions, liquidations and auctions are all onchain, and share price is computed onchain from `idle + sync_total_debt`.
- **Keeper dependency:** Lender accounting (`report()`) is driven by a **permissionless keeper** hard-coded in `LenderFactory`; the Yearn allocator and strategies use Yearn's **yHaaS keeper**. Report cadence is not merely a liveness concern: because share price is only refreshed at report time, the gap between reports is the window that Zero Cool M-05 and L-04 exploit, and the permissionless keeper is what lets an attacker close that window inside their own transaction.
- **Callback surface:** v2 hands control to `troveCallback` and `takeCallback` receivers mid-operation — during borrow, during leverage, and (per M-01) during liquidation before the loss is reported. This is deliberate design that enables swapless looping and lender-side auction takes, and it is also the source of the newest unresolved findings.
- **Management-gated liquidity:** `forceFreeFunds` and `deployIdleFunds` on the allocator strategy are `onlyManagement`. Yearn SMS, not the market, decides when a large exit is attempted.

### External Dependencies

- **yvUSD** — collateral and price source for the largest market. A yvUSD loss (strategy underperformance, strategy-level exploit, or a bridge/CCTP failure) flows directly into Flex solvency. yvUSD *depeg* vs USDC is not a distinct risk: yvUSD's underlying asset is USDC and Flex lenders deposit USDC, so only yvUSD correctly reporting the USDC value of its positions matters. Assessed in [`yearn-yvusd.md`](./yearn-yvusd.md).
- **ysyBOLD → yBOLD → BOLD → Liquity V2** — collateral for the second market, a three-layer chain terminating in a protocol **Yearn has not assessed**. Unlike yvUSD this introduces real USD price discovery: BOLD is a CDP stablecoin, not USDC.
- **yvcrvUSD-2 → crvUSD → Curve** — collateral for the third market. A publicly-listed Yearn V3 vault over Curve's crvUSD; **neither the vault nor crvUSD has a report in this repository**.
- **Curve pools as price sources** — the BOLD/USDC pool ([`0xEFc65163…4B3E`](https://etherscan.io/address/0xEFc6516323FbD28e80B85A497B65A86243a54B3E)) and the USDC/crvUSD pool ([`0x4DEcE678…d69E`](https://etherscan.io/address/0x4DEcE678ceceb27446b35C672dC7d61F30bAD69E)) are the sole price inputs for two of the three live markets, read through their EMA `price_oracle`. The EMA smoothing and the 1.01 caps bound manipulation impact; the ysyBOLD oracle's 0.99 floor is currently disabled.
- **Morpho `MorphoChainlinkOracleV2`** — the yvUSD market's price path runs through this immutable Morpho contract. Well-audited and configured feedless, but an added link in the chain.
- **Yearn V3 / TokenizedStrategy framework** — the Lenders, strategies and allocator vault inherit Yearn's audited base contracts; a framework-level bug would affect Flex.
- **USDC** — the borrow token in every market (Circle centralization/freeze risk, standard).
- **infiniFi siUSD / iUSD** — collateral for a market that was deployed, never funded, and unendorsed on August 24, 2026. Assessed in [`infinifi.md`](./infinifi.md). Not a live exposure.
- No L2 or bridge dependency on the Flex side; yvUSD's CCTP bridging is yvUSD's own dependency.

## Operational Risk

- **Team:** Pseudonymous. The lead developer is **`johnnyonline` / `johnny.flexmeow.eth`**, an active contributor in the Yearn ecosystem (the protocol reuses Yearn's TokenizedStrategy, SMS, yHaaS and Vault Factory). Per team disclosure, the Daddy Safe signer set includes two Flex-dev keys plus well-known pseudonymous Yearn-ecosystem reviewers; public docs provide no address-to-person signer mapping, and the fifth signer added in August 2026 is undisclosed.
- **Documentation:** User-facing docs are clear on mechanics and were updated for the v2 fee model (upfront fee to protocol as first-loss buffer, 10% lender performance fee). However, there is **no governance or ownership documentation**, and the risks page's "no admin keys / no privileged users / no ability to modify" claim now contradicts the onchain reality more sharply than before — Daddy collects both fee streams and holds a switch that changes how a live market values its collateral.
- **Development transparency:** A clear improvement — the allocator layer moved from a private branch into the public [`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator) repository, and both new audits were published to the repo, including the unfavorable one.
- **Remediation posture:** Twelve findings from the August 11 review remain unaddressed with no fix commits, and both Dedaub advisories were dismissed. The team's stated reasoning on the dismissals is recorded in the report and is not unreasonable, but the aggregate signal is a protocol shipping faster than it closes findings.
- **Legal structure:** **None.** Flex has no legal entity, jurisdiction, or foundation. There is no counterparty to pursue and, per the risks page, no bailout: losses from market conditions, execution prices, liquidations, redemptions or bugs are borne entirely by users.
- **Incident response:** No documented or tested incident-response plan; no bug bounty. Daddy can shut down a Lender in an emergency and can lift the ysyBOLD oracle floor.

## Monitoring

**Key addresses to monitor (Ethereum mainnet):**

| Contract | Address | Why monitor |
|----------|---------|-------------|
| Lender `ysUSDC` — yvUSD/USDC (assessed token) | [`0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) | `pricePerShare`, `totalAssets`, idle balance, `depositLimit`, `performanceFee`, management/keeper changes, `ReportLoss` |
| Lender `ysUSDC` — ysyBOLD/USDC | [`0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) | same |
| TroveManager — yvUSD/USDC | [`0x8ee72c388aA73096338EE18CD46a39D98b8983c9`](https://etherscan.io/address/0x8ee72c388aA73096338EE18CD46a39D98b8983c9) | `total_debt`, `collateral_balance`, `unclaimed_protocol_fees`; liquidations / bad-debt events |
| TroveManager — ysyBOLD/USDC | [`0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E`](https://etherscan.io/address/0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E) | same |
| Lender `ysUSDC` — yvcrvUSD-2/USDC | [`0xc1f281A3643F219636F97F6E687A33704950eC84`](https://etherscan.io/address/0xc1f281A3643F219636F97F6E687A33704950eC84) | same |
| TroveManager — yvcrvUSD-2/USDC | [`0x7582b47486F75F5D675f260d357972cD0DbEeA2E`](https://etherscan.io/address/0x7582b47486F75F5D675f260d357972cD0DbEeA2E) | same |
| Price Oracle — yvcrvUSD-2→USDC | [`0x01821e20e102A9c9878298fde6b87B1885Baa8B2`](https://etherscan.io/address/0x01821e20e102A9c9878298fde6b87B1885Baa8B2) | `get_price()` vs Curve USDC/crvUSD EMA and the vault rate |
| Price Oracle — yvUSD→USDC (Morpho wrapper) | [`0xDB8DBB6c0548341Aea85ebAAFa681B4A8c077D2e`](https://etherscan.io/address/0xDB8DBB6c0548341Aea85ebAAFa681B4A8c077D2e) | `get_price()` vs yvUSD PPS; abnormal moves |
| Price Oracle — ysyBOLD→USDC | [`0x405568114Ee8058d0ca1Bbe95DA1f929279BaE65`](https://etherscan.io/address/0x405568114Ee8058d0ca1Bbe95DA1f929279BaE65) | `depeg_mode` flag, `DepegModeSet` event, `get_price()` vs Curve EMA and vault rates |
| Registry | [`0x9117440a7D03238905d1C8908157Bd7a547c77c8`](https://etherscan.io/address/0x9117440a7D03238905d1C8908157Bd7a547c77c8) | `EndorseMarket`/`UnendorseMarket` — new market risk |
| Daddy (protocol owner) | [`0x4e8341C77c94cCE982AB96d92BB28D69f4638290`](https://etherscan.io/address/0x4e8341C77c94cCE982AB96d92BB28D69f4638290) | `OwnershipTransferred`; any `execute` call |
| Daddy owner Safe (3/5) | [`0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67) | signer/threshold changes |
| yvFlexUSDC allocator vault | [`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`](https://etherscan.io/address/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8) | Yearn-side roles, `role_manager` handover, debt allocation, deposit limit |
| FlexLenderStrategy — yvUSD | [`0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | `availableWithdrawLimit`, `ForceFreeFunds`, pending auction, health-check losses |
| FlexLenderStrategy — ysyBOLD | [`0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | same |
| FlexLenderStrategy — yvcrvUSD-2 | [`0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d`](https://etherscan.io/address/0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d) | same |
| FlexExitRouter | [`0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD`](https://etherscan.io/address/0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD) | user exits routed with a proceeds receiver (losses booked to the exiter) |
| Collateral yvUSD | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS, see `yearn-yvusd.md` triggers |
| Collateral ysyBOLD | [`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD) | PPS; and BOLD peg via the Curve pool |
| Collateral yvcrvUSD-2 | [`0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F`](https://etherscan.io/address/0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F) | PPS; and crvUSD peg via the Curve pool |

**Critical values / events & thresholds:**

- **Backing ratio** per market = (pledged Trove collateral × oracle price) / `sync_total_debt()`. Use interest-accrued debt (`sync_total_debt()`, `get_trove_debt_after_interest()`), not stored `trove.debt`, and count only collateral pledged against Troves — `collateral_balance` includes residue in fully-redeemed Troves and overstates the ratio (131.05% versus a true 114.46% in the ysyBOLD market today). Markets run close to the 110% MCR by design, so a static 112% alert would fire continuously. Alert if **backing CR < 110.5%**; page if **< 110%**, on any `ReportLoss` on a Lender, or if the share of market debt held in Troves below 110.5% CR exceeds 50%. The book-wide debt-weighted CR is 114.30% with 22.3% of debt below 111%.
- **Idle liquidity** = idle USDC in the Lender and in the strategy. Both are currently 0, so alert on the *inverse* condition too: track `FlexLenderStrategy.availableWithdrawLimit(vault)` and escalate if it stays at 0 while the vault needs liquidity.
- **First-loss buffer**: `unclaimed_protocol_fees` per market. Alert if it falls relative to debt, or if a borrow-side operation collects a materially below-average upfront fee (the H-01 / A1 suppression path).
- **Oracle:** `get_price()` deviating from the underlying vault rates; **any `DepegModeSet` event** — in particular a switch back to `false`, which would restore the 0.99 floor and let the ysyBOLD market over-value collateral during a depeg; BOLD/USDC or USDC/crvUSD moving off peg on their Curve pools.
- **Governance:** any `Daddy.execute`, ownership transfer, Safe signer/threshold change, performance-fee change, `setKeeper`, Lender shutdown, or new `EndorseMarket`.
- **Remediation:** new commits to `flexmeow/flex-contracts` or `flexmeow/flex-allocator` addressing the August 11 findings; merges of oracle PRs [#22](https://github.com/flexmeow/flex-contracts/pull/22) and [#23](https://github.com/flexmeow/flex-contracts/pull/23); closure of yearn-strategies #756.
- **Recommended frequency:** backing ratio, idle liquidity and withdraw limit **hourly**; governance, registry and depeg-mode events **real-time**; collateral vault PPS **daily**.

Onchain reads: `Lender.totalAssets()`, `Lender.pricePerShare()`, `TroveManager.sync_total_debt()`, `TroveManager.get_trove_debt_after_interest(id)`, `TroveManager.collateral_balance()`, `SortedTroves.size()/first()/next(id)`, `TroveManager.troves(id)`, `TroveManager.unclaimed_protocol_fees()`, `Oracle.get_price()`, `ysybold_oracle.depeg_mode()`, `Registry.get_all_markets()`, `FlexLenderStrategy.availableWithdrawLimit(vault)`, `Daddy.owner()`, Safe `getOwners()/getThreshold()`.

## Appendix: Contract Architecture

```
                          USER / YEARN DEPOSITOR (USDC)
                                     │ deposit
                                     ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │  yvFlexUSDC — Yearn V3 allocator vault  $1,111,699                    │ role_manager: Yearn SMS
   │  0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8                           │ 0x16388463…0ff7
   └──────────────────────────────────────────────────────────────────────┘
        │ 54.0%             │ 18.0%             │ 9.0%             │ 19.0%
        ▼                   ▼                   ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐
  │ FlexLender   │  │ FlexLender   │  │ FlexLender   │  │ USDC → SKY USDS    │
  │ Strategy     │  │ Strategy     │  │ Strategy     │  │ 0xfb4F83c3…F95e    │
  │ 0x7501EAE6…  │  │ 0xDd58AeFE…  │  │ 0xC818A0Be…  │  │ (not a Flex leg)   │
  └──────────────┘  └──────────────┘  └──────────────┘  └────────────────────┘
        │ deposit          │ deposit           │ deposit
        ▼                  ▼                   ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   ASSESSED TOKEN (left)
  │ Lender       │  │ Lender       │  │ Lender       │   management: Daddy
  │ yvUSD/USDC   │  │ ysyBOLD/USDC │  │ yvcrvUSD-2   │   keeper: 0x52605Bbf…b2f8
  │ 0xD93Dade7…  │  │ 0xf4996Ca4…  │  │ 0xc1f281A3…  │   perf-fee 10% → Daddy
  │ $600,662     │  │ $200,037     │  │ $100,003     │   profit unlock: 4 days
  └──────────────┘  └──────────────┘  └──────────────┘   deposit limit: $2M each
        │ USDC liquidity / redeem()
        ▼
   ── PROTOCOL LAYER (EIP-1167 clones of immutable templates; Factory v1.1.0) ───
     yvUSD/USDC            ysyBOLD/USDC          yvcrvUSD-2/USDC
       TroveManager          TroveManager          TroveManager
       0x8ee72c38…83c9       0xADf4E022…Fc6E       0x7582b474…eA2E
       SortedTroves          SortedTroves          SortedTroves
       0xB3770984…c6F7       0x268C2F12…C17b       0x32aB7094…d1a2
       DutchDesk             DutchDesk             DutchDesk
       0xa22C420E…9211       0x8e5C69f8…2A6D       0x26f652aC…edae
       Auction               Auction               Auction
       0x9bF027D9…7D56       0x068C6c7E…1e73       0xaA8C7040…795c
       PriceOracle           PriceOracle           PriceOracle
       0xDB8DBB6c…7D2e       0x40556811…AE65       0x01821e20…a8B2
         └─ Morpho oracle      └─ Curve BOLD/USDC    └─ Curve USDC/crvUSD
            0xC44Ee741…69EF       0xEFc65163…4B3E       0x4DEcE678…d69E
            (BASE_VAULT=yvUSD,    (cap 1.01; floor      (cap 1.01, no floor,
             no feeds)             0.99 currently off)    no admin switch)
       CR 111.9% · 7 troves  CR 121.5% · 7 troves  CR 116.1% · 5 troves
     ── shared factories / registry / periphery ──
       Factory v1.1.0   0xffc787ad…501f      LenderFactory   0x98f678aa…B856
       TM template      0x41D491d2…39cE      Registry        0x9117440a…77c8
       StrategyFactory  0x1792348F…8252      FlexExitRouter  0xe8a51140…2aeD
   ── UNDERLYING LAYER ──────────────────────────────────────────────────────────
       yvUSD      0x696d02Db93291651ED510704c9b286841d506987  (Yearn V3 USDC vault)
       ysyBOLD    0x23346B04a7f55b8760E5860AA5A77383D63491cD  → yBOLD → BOLD (Liquity V2)
       yvcrvUSD-2 0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F  → crvUSD (Curve)
       USDC       0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48  (borrow token, all markets)
   ── GOVERNANCE ────────────────────────────────────────────────────────────────
       Daddy (arbitrary execute)  0x4e8341C77c94cCE982AB96d92BB28D69f4638290
         └─ owner: Safe 3/5        0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67
       Yearn SMS                   0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7
```

Two markets were unendorsed on August 24, 2026 and carry no live exposure: the **retired v1 yvUSD/USDC** market (TroveManager [`0xd82DB989…2e49`](https://etherscan.io/address/0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49), a zombie Trove holding ~$24,960 of yvUSD against 147 wei of debt) and the never-funded **siUSD/USDC** market (TroveManager [`0x484E3c28…C09D`](https://etherscan.io/address/0x484E3c28A99282Ce0682f65A5F902876f370C09D)).

**Trust boundaries:** Borrower collateral is held by non-upgradeable TroveManager clones — no admin withdrawal path. Daddy (3-of-5 multisig, no timelock) controls Lender parameters, both fee streams, market endorsement and unendorsement, and the ysyBOLD oracle's depeg floor, but cannot seize funds. The Yearn allocator and strategy layer is governed by Yearn SMS. The most concentrated risks are three single-asset collateral markets, each priced by a feed that ultimately reads the collateral's own vault accounting, and a debt book of which 84.5% sits below a 113% collateral ratio against a 110% liquidation threshold.

---

## Risk Summary

### Key Strengths

- **Immutable core protocol** — every market is an EIP-1167 clone of a fixed template with no admin and no upgrade path; market parameters are set at deploy, and every deployed contract is source-verified.
- **A clean audit on the deployed upgrade** — Dedaub's August 5 review of the v1.1/v2 changes (three auditors, six contracts) found **no Critical, High, Medium or Low** issues.
- **Governance used in the lender's favour** — the controlling Safe is **3-of-5**, and on August 24 Daddy retired two dead markets and lifted the ysyBOLD oracle's artificial 0.99 price floor, the configuration that lets a real BOLD depeg register. Its powers remain non-custodial: it cannot seize borrower collateral or lender shares.
- **Collateral buffer is diversified across three markets** — the debt-weighted collateral ratio across the whole book is 114.30%, measured on interest-accrued debt and pledged collateral only.
- **Fully onchain, over-collateralized, verifiable** — backing is recomputable by anyone from `total_debt` and `collateral_balance`; **no privileged minter** exists on the lending token.
- **Transparency improved** — the allocator layer is a public repository, and both August reviews were published including the unfavorable one.
- **Yearn-grade integration layer** — allocator vault and strategies governed by Yearn SMS / yHaaS, with a role-manager handover to Yearn's `RoleManager` pending.

### Key Risks

- **Twelve unresolved security findings on the deployed code.** The August 11 Zero Cool review of deployed `master` reported 1 High, 7 Medium and 4 Low, **all unresolved with no fix review**, and no remediation has been committed in the nineteen days since — a window in which a third market was deployed and funded instead. Four findings (M-01, M-02, M-05, L-04) transfer value away from passive lenders through the Lender's cached share price, reopening the FLEX-001 class the prior deployment had closed.
- **Two live markets are priced by unaudited, unmerged code.** The ysyBOLD and yvcrvUSD-2 oracles sit on open pull requests ([#22](https://github.com/flexmeow/flex-contracts/pull/22), [#23](https://github.com/flexmeow/flex-contracts/pull/23)) and were in no review's scope, leaving collateral pricing for **$300,086 of live debt** outside the process the rest of the protocol went through.
- **The tail of the debt book sits on the liquidation line.** Against a 110% MCR, **22.3% of debt is below 111% CR, 59.1% below 112% and 68.5% below 113%**, with the lowest Trove at 110.07%. The protocol's first-loss reserve against bad debt is **$175.59** across all three markets. Headline market ratios also need care: the ysyBOLD market's naive collateral-to-debt ratio reads 131.05% only because $33,213 of collateral sits in fully-redeemed Troves that back no debt — its true backing ratio is 114.46%.
- **Very new & small** — the newest market is under two weeks old, TVL is ~$1.09M, and **90.9% of the depositor base is the Yearn Treasury itself** in a vault that is not a listed Yearn product.
- **Exit frees nothing from Flex through the standard path.** Only **19.0% of the allocator vault is instantly withdrawable, and all of it is the non-Flex Sky leg**; all three Flex strategies report $0. Freeing the rest requires Yearn SMS action or an ExitRouter exit that delivers proceeds asynchronously and books the shortfall as the exiter's loss.
- **A Daddy-controlled oracle floor remains switchable.** The ysyBOLD oracle's 0.99 floor is currently disabled, which is the safe setting, but the same 3-of-5 key can re-enable it with no timelock — at which point a depegging market would again be valued at 0.99.
- **A 3-of-5 multisig with no timelock**, which the rubric places at the second-riskiest governance tier, controls Lender parameters, both fee streams, market endorsement and the ysyBOLD oracle switch. Its powers are non-custodial, but nothing delays them.
- **Governance overclaim** — the risks page still advertises "no admin keys, no privileged users, no ability to pause, upgrade, or modify" while Daddy collects both fee streams, endorses and unendorses markets, and holds the depeg switch. The August 24 transactions are a concrete demonstration that the surface is live.
- **Deeper, partly unassessed dependency chain** — two of the three collaterals terminate in protocols this repository has not assessed (Liquity V2/BOLD and Curve/crvUSD), and two of the three markets take their price from a single Curve pool each.
- **Allocator review still open** — `flex-allocator` has no external audit; yearn-strategies #756 remains open with both reviewers' completion boxes unchecked, though a Yearn reviewer has signed off on the deployed code.

### Critical Risks `[If Any]`

- No standalone fund-loss critical was identified. The compounding concern is **a debt tail sitting on the liquidation line + a $106 first-loss reserve + bad debt socialized to lenders + a share price that lags real assets between reports + unresolved findings that specifically exploit that lag**. A collateral impairment large enough to push Troves underwater would hit a whole market's book at once, and the same liquidation transaction that socializes the loss is the one Zero Cool M-01 identifies as escapable by a shareholder acting as liquidator. Two of the three markets now price collateral through code that no audit has read.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [ ] **No audit** — *Not triggered.* Six reviews; Dedaub (twice) and HHK/adriro reputable, all deployed contracts source-verified.
- [ ] **Unverifiable reserves** — *Not triggered.* Fully onchain; CR recomputable per market.
- [ ] **Total centralization** — *Not triggered.* Core immutable; control via 3-of-5 Safe (not a lone EOA), and Daddy cannot seize funds.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews** — Coverage is broad (six reviews) and the most recent human audit of the deployed upgrade is exemplary: Dedaub found nothing above advisory severity. Against that, an independent review of the same deployed commit six days later returned **1 High, 7 Medium and 4 Low, all unresolved with no fix review and no remediation commits in the nineteen days since**, and both Dedaub advisories were dismissed rather than fixed. Several unresolved findings target lender share value directly, and one has already been observed operating benignly onchain. The unaudited surface has since widened: **two of the three live markets are priced by oracles that were never merged to `master` and were in no review's scope**, and the allocator layer still carries **no external audit** with its Yearn review ticket open. There is **no bug bounty** on a complex, callback-heavy surface. → **3.5**

**Subcategory B: Historical Track Record** — The protocol is ~3.5 months old; its live markets are four weeks, three weeks and **ten days** old respectively, with ~$1.09M TVL, 22 Troves, and 90.9% of the depositor base being the Yearn Treasury. Effectively no track record. → **5**

**Audits & Historical Score = (3.5 + 5) / 2 = 4.25**

**Score: 4.25/5** — Good audit breadth undercut by an unremediated finding set on the deployed commit, unaudited oracle code pricing two live markets, and minimal time in production.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance** — The rubric's row 4 reads *"Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints"*, and Flex matches it on every axis: a **3-of-5 Safe with no timelock at all**, holding powerful but bounded roles — Lender parameters, both fee streams, market endorsement and unendorsement, keeper, shutdown, and the ysyBOLD oracle's depeg switch. It does not fall to row 5, which requires an EOA or fewer than three signers together with unlimited admin powers; Daddy cannot seize collateral or lender shares, and the market contracts are immutable clones. The August 24 transactions confirm the surface is live rather than theoretical — three registry actions and an oracle-parameter change, all effective on signature. The choices made were sane and lender-protective, but that is evidence about the operators, not about the control structure, which still permits the reverse. Docs continue to deny that any of it exists. → **4**

**Subcategory B: Programmability** — Borrowing, interest, redemptions, liquidations and auctions remain fully onchain and share price is computed onchain. But the stale-PPS concern is open: v2's callbacks execute inside liquidation before the loss report, the permissionless keeper lets an attacker choose when the price refreshes, and four unresolved findings turn on exactly that. Allocator reporting also halts while a redemption auction is unsettled, and large exits are management-gated. → **2**

**Subcategory C: External Dependencies** — Three live collateral assets. yvUSD is a Yearn-assessed, USDC-denominated vault priced through an immutable Morpho oracle — a well-understood dependency. ysyBOLD adds a three-layer chain terminating in **Liquity V2** and yvcrvUSD-2 a two-layer chain terminating in **Curve/crvUSD**, neither assessed in this repository, and each priced off a single Curve pool's EMA. Plus the Yearn V3 framework and USDC. The crvUSD oracle is the soundest of the three designs (cap only, no floor, no admin switch), which offsets the added surface rather than compounding it. → **3.5**

**Centralization Score = (4 + 2 + 3.5) / 3 = 3.17**

**Score: 3.17/5** — Immutable mechanics and non-custodial powers, held back by a 3-of-5 multisig with no timelock, an open share-pricing surface, and a dependency chain reaching two unassessed protocols.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization** — Over-collateralized, onchain and real-time verifiable in high-quality DeFi collateral, spread across three markets with a debt-weighted collateral ratio of 114.30% on interest-accrued debt and real dispersion (110.07%–171.41%). The buffer is still thin where it counts: 59.1% of debt sits below 112% CR against a 110% MCR, the first-loss reserve is $175.59, one market's headline ratio is inflated by $33,213 of collateral backing no debt, and a liquidation fee of 0.5–5% eats into the margin before lenders are made whole. → **3.25**

**Subcategory B: Provability** — Total debt, collateral and Lender assets are readable directly and the backing ratio is recomputable by anyone, with no offchain reserve or admin reporting dependency. The share price itself is a cached figure refreshed at the discretion of a permissionless keeper, four unresolved findings exploit the gap between it and real assets, and the pricing code for two markets is verifiable on Etherscan but absent from the reviewed repository. → **2**

**Funds Management Score = (3.25 + 2) / 2 = 2.625**

**Score: 2.63/5** — Transparent onchain over-collateralization at a leverage level that leaves little margin for collateral impairment.

#### Category 4: Liquidity Risk (Weight: 15%)

Only **19.0% of the allocator vault is instantly withdrawable**, and all $211,491 of it is the non-Flex Sky USDS leg; all three Flex strategies report $0. Exit from Flex requires management `forceFreeFunds` or the `FlexExitRouter`, which delivers auction proceeds asynchronously and books the shortfall as a loss to the exiting user. Auctions can clear near par (100% start, 99% floor, 1-day duration) when a taker redeems the collateral vault share for its underlying, and every leg is USD-denominated, which limits price risk over short delays. Depth is small (~$1.06M) and concentrated, and the Flex share of the vault has risen to 81.0%. → **3.5**

**Score: 3.5/5** — Better than a generic delayed auction because of the collateral-redemption taker path, but with almost no instant liquidity available today and a loss-bearing asynchronous exit as the working mechanism.

#### Category 5: Operational Risk (Weight: 5%)

Pseudonymous but Yearn-ecosystem-known lead dev; mechanics docs are accurate and were updated for v2; the allocator code and both August audits were published, including the unfavorable one; and the August 24 housekeeping (retiring dead markets, disabling the price floor) is competent operations. Against that: a **misleading "no admin keys" claim** that the onchain role set plainly contradicts, a third market shipped in a week while twelve findings and two oracle pull requests sat open, no governance or legal disclosure, no bug bounty, and an undisclosed fifth Safe signer. → **3**

**Score: 3/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 4.25 | 20% | 0.85 |
| Centralization & Control | 3.17 | 30% | 0.95 |
| Funds Management | 2.625 | 30% | 0.7875 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.26/5.0** |

**Optional Modifiers:** None apply (protocol < 2 years; TVL not sustained). Final score ≈ **3.26/5.0**.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk** — *Approved with enhanced monitoring*, in the upper quarter of the band and close to the Elevated boundary. The driving constraints are a 3-of-5 multisig with no timelock, twelve unremediated findings on the deployed commit, collateral pricing for two of three live markets sitting in unaudited and unmerged code, a debt tail on the liquidation threshold with a negligible first-loss reserve, an exit path where the standard route frees nothing from Flex at all, and a dependency chain reaching two unassessed protocols. These are partly offset by non-upgradeable market clones, a clean Dedaub audit of the v2 upgrade, a 3-of-5 Safe that has so far used its powers in the lender's favour, a wider and more dispersed collateral buffer, and transparent onchain over-collateralization. Recommend keeping position size strictly limited, treating the yvUSD market as the thinnest of the three, and requiring remediation of the August 11 High/Medium findings, merge and review of the two oracle pull requests, and closure of yearn-strategies #756 before scaling.

---

## Reassessment Triggers `[If Applicable]`

- **Time-based:** Reassess in **2 months** (early-stage protocol shipping new markets on a weekly cadence).
- **Remediation:** Reassess (upward) once the August 11 High and Medium findings are fixed and fix-reviewed, once oracle pull requests [#22](https://github.com/flexmeow/flex-contracts/pull/22) and [#23](https://github.com/flexmeow/flex-contracts/pull/23) are merged and brought into audit scope, and once yearn-strategies #756 is marked complete.
- **Collateralization:** Reassess if any market's **backing CR** (pledged collateral over interest-accrued debt) falls below **110.5%**, if the share of a market's debt in Troves below 110.5% CR exceeds 50%, or if `unclaimed_protocol_fees` is materially depleted. Compute backing CR from pledged collateral only — the naive `collateral_balance / total_debt` ratio is inflated wherever fully-redeemed Troves retain collateral.
- **Oracle / governance switch:** Reassess on any `DepegModeSet` event — in particular a switch back to `false` — if BOLD or crvUSD trades materially off peg on its Curve pool, or if any market's oracle design changes.
- **TVL-based:** Reassess if Flex TVL changes by **>50%** in either direction, if the Yearn Treasury's share of `yvFlexUSDC` changes materially, if the Flex share of the allocator vault exceeds 90%, or if a Lender `depositLimit` is raised.
- **Collateral/market:** Reassess if a **new market is endorsed** (`Registry.EndorseMarket`), if a live market is unendorsed, or if a non-USD collateral is added.
- **Liquidity:** Reassess if `FlexLenderStrategy.availableWithdrawLimit` remains at or near 0 while the allocator vault faces redemptions, or after any `ForceFreeFunds` or ExitRouter exit that realizes a loss.
- **Governance:** Reassess on any Daddy ownership transfer, Safe signer/threshold change, addition of a timelock, performance-fee change, or keeper change.
- **Incident-based:** Reassess after any bad-debt socialization event, liquidation failure, auction freeze, collateral depeg or loss, or any exploit affecting Flex, Yearn V3, yvUSD, ysyBOLD/yBOLD/Liquity V2, or yvcrvUSD-2/Curve.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 19, 2026](https://github.com/yearn/risk-score/pull/220) | 2.53 | Initial assessment — single yvUSD/USDC market, ~$0.97M TVL, 120.7% system CR, 2-of-4 Daddy Safe |
| [September 2, 2026](https://github.com/yearn/risk-score/pull/425) | 3.26 | Reassessment: v1.1/v2 redeploy — original market retired and unendorsed, Yearn migrated to three new Lenders (yvUSD/USDC, ysyBOLD/USDC, yvcrvUSD-2/USDC); upfront fee redirected to protocol and 10% lender performance fee activated; Safe hardened to 3-of-5; ysyBOLD oracle depeg floor lifted; Dedaub v1.1 audit clean but 12 Zero Cool findings unremediated and two live markets priced by unmerged, unaudited oracles; debt-weighted backing CR 114.3% with 59.1% of debt below 112%; allocator vault 81% in Flex with 19.0% instantly withdrawable and nothing free from Flex itself |
