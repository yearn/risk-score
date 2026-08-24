# Protocol Risk Assessment: Flex

- **Assessment Date:** June 19, 2026 (Updated: August 23, 2026)
- **Token:** Flex yvUSD/USDC Lender position token (`ysUSDC`)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA)
- **Final Score: 3.15/5.0**

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

The **Zero Cool review has not been acted on**. It ran against the deployed commit, and the repository's most recent commit is the one that added the report itself ([`ac0835f4`](https://github.com/flexmeow/flex-contracts/commit/ac0835f4), August 11, 2026) — no remediation has landed in the twelve days since. Four of its findings bear directly on lender share value:

- **M-01 — liquidation callbacks allow stale-PPS bad-debt escape.** Underwater liquidation subtracts the full Trove debt from `total_debt` *before* invoking the receiver-controlled `takeCallback` and before the atomic keeper `report()`. A liquidator that already holds Lender shares can redeem them at the pre-loss cached price from inside the callback, funded by the Lender's idle balance, and exit before the loss is priced in. This is the same class as the April-27 FLEX-001 finding, reopened by the v2 callback flow.
- **M-02 — partial bounded redemptions create discounted Lender shares.** `_redeem()` stops after 1,000 Troves without reporting how much it actually freed; `TokenizedStrategy._withdraw()` then books the entire shortfall as a realized loss even though the unredeemed debt is still a Lender asset, depressing the share price for a subsequent depositor.
- **M-05 — just-in-time depositors capture previously accrued lender interest.** Deposits price against `TokenizedStrategy.totalAssets()`, which only picks up accrued Trove interest when `_harvestAndReport()` calls `sync_total_debt()`. The permissionless keeper lets an attacker deposit and trigger the report in one transaction.
- **L-04 — just-in-time deposits dilute auction surplus** through the same cached-`totalAssets` window, using the auction `take()` callback.

M-05 is not theoretical. When the v1 market was wound down in August 2026 the exiting allocator strategy redeemed at the cached price and the ~$913 of interest accrued since the prior report was left behind, lifting the residual Lender's price per share to ~1.51 for the ~1,327 shares that stayed ([`Reported` event, block 25756324](https://etherscan.io/tx/0x20ba4c339bba4c750fa2a19d2caf762512b22232a122c41284b95eb4caa0c254)). The amount was immaterial (≈0.11% of the $800K exit) but the mechanism is the one the finding describes, and it scales with the gap between reports.

**Audit scope vs. deployed/Yearn-path code.** The six reviews cover the **core protocol**. The **allocator layer** (`Strategy.sol`, `StrategyFactory.sol`, `ExitRouter.sol` in [`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator)) has **no external audit** — the repository has no `audits/` directory. It is covered by Yearn's own strategy-security process (yearn-strategies #756, "Flex Lender"). That ticket is **still open**, with the "Review Ongoing By" and "Review Completed By" checkboxes for both named reviewers (Schlagonia, fp-crypto) unchecked. A Yearn security reviewer (`tapired`) did conduct a detailed line-level review through August 2026, had several findings fixed, and signed off "Deployed code LGTM" (August 10) and again on the ysyBOLD strategy (August 13), with one caveat recorded verbatim: *"We discussed on how there can be race conditions for users when there are losses for the Lender because of `pendingRedemptions` but all acknowledged."* The ticket's recorded internal risk score is **29**, with the comment *"This is a new lending primitive that has not been extensively battle-tested on mainnet. Collateral quality should also be considered."*

**Complexity:** The onchain surface is **substantial** — a full Liquity-V2-style CDP engine (`trove_manager.vy`, `sorted_troves.vy`, `dutch_desk.vy`, `auction.vy`, `factory.vy`, `registry.vy`) written in Vyper, plus a Solidity Yearn-V3 lender layer (`Lender.sol`, `LenderFactory.sol`), a per-market price oracle, and an allocator strategy with an exit router. The v2 callback-based borrow and leverage flow adds re-entrancy-adjacent surface that did not exist in v1, and is the root of the M-01 and L-04 findings. The codebase ships a Slither config and Foundry invariant tests (e.g. `test/invariant/DebtInvariant.sol`).

**Other unresolved items:** A few low-severity items are explicitly "will not fix" as inherited Liquity V2 behavior (interest-dust rounding, small-repay interest baking). No outstanding Critical finding exists on any reviewed component; the principal open caveats are the twelve unaddressed Zero Cool findings on the deployed commit and the incomplete allocator strategy review (#756).

### Bug Bounty `[If Applicable]`

- **None.** No bug-bounty program appears on the docs, the risks page, Immunefi, or the [SEAL Safe Harbor registry](https://safeharbor.securityalliance.org/). Dedaub's own report recommends "a public bug bounty program" alongside multiple independent audits for high-value contracts.

## Historical Track Record

- **Time in production: ~3.5 months, but the deployed code is ~2.5 weeks old.** The first live core contracts and the original yvUSD/USDC market were deployed May 12–14, 2026. The current v1.1/v2 markets are much newer: the [yvUSD/USDC market](https://etherscan.io/address/0x8ee72c388aA73096338EE18CD46a39D98b8983c9) was deployed **August 5, 2026** and endorsed August 7, and the [ysyBOLD/USDC market](https://etherscan.io/address/0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E) was deployed **August 12, 2026** and endorsed August 13. Earlier broadcast artifacts date to October 2025, indicating an extended testnet/redeploy history.
- **TVL: ~$0.92M.** [DeFiLlama](https://defillama.com/protocol/flex) reports $917,702 for Flex on August 23, 2026, having oscillated between ~$808K and ~$1.15M over the preceding month. This reconciles with onchain collateral: $668,836 (yvUSD market) + $221,963 (ysyBOLD market) + $24,931 (retired v1 market) = **$915,730**.
- **Security incidents:** None known.
- **Migration event, August 2026.** The original yvUSD/USDC market was wound down and replaced rather than upgraded — the v1 market's Troves closed, the allocator strategy [`0x467Ce108…7751`](https://etherscan.io/address/0x467Ce10870747372968ba98463A1d9af9Fb27751) redeemed its ~$800K of Lender shares in three tranches between August 13 and August 19, and the strategy was revoked from the `yvFlexUSDC` vault. No loss was reported on any of the exits. The retired v1 `TroveManager` still holds 24,308.75 yvUSD (~$24.9K) against 147 wei of debt in a zombie Trove, and remains endorsed in the Registry.
- **Concentration risk:** With ~$0.92M TVL sourced essentially entirely through Yearn's own allocator vault, the depositor base is highly concentrated. **90.9% of `yvFlexUSDC` shares are held by the Yearn Treasury** ([`0x93A62dA5…Efde`](https://etherscan.io/address/0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde), ~$1.0M of 1.10M shares); the next holder accounts for 9.0%. The vault is also not a publicly-listed Yearn product — it is absent from yDaemon's vault index, so it reads as Treasury-seeded pilot capital rather than a live retail vault. Borrower concentration is similar: 11 Troves in the yvUSD market with the largest at 35.9% of market debt, and 7 Troves in the ysyBOLD market with the largest at 32.4%.
- **Peg / depeg history:** None. All three live and pending markets are USD-denominated on both legs.

## Funds Management

Flex runs **four endorsed markets**, two of which carry debt. The fund flow for Yearn's position is:

**User USDC → `yvFlexUSDC` (Yearn V3 allocator vault) → `FlexLenderStrategy` → `Lender` (`ysUSDC`) → market lending**, where borrowers post collateral to borrow USDC.

The `yvFlexUSDC` vault holds **$1,111,367** and allocates it across three strategies:

| Strategy | Address | Allocation | Underlying |
|----------|---------|-----------:|------------|
| Flex yvUSD/USDC Lender | [`0x7501EAE6…D737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | $600,119 (54.0%) | Flex Lender [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) |
| Flex ysyBOLD/USDC Lender | [`0xDd58AeFE…b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | $200,003 (18.0%) | Flex Lender [`0xf4996Ca4…a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) |
| USDC To SKY USDS Depositor | [`0xfb4F83c3…F95e`](https://etherscan.io/address/0xfb4F83c3923eab7B6254cD2399C206109970F95e) | $311,246 (28.0%) | Sky sUSDS — not a Flex position |

The endorsed market set is enumerable onchain via `Registry.get_all_markets()`, which returns four `TroveManager`s. New markets require Daddy to call `Registry.endorse(...)`, which emits `EndorseMarket` and is observable. The Yearn-side allocation is managed by the Yearn Strategist MultiSig (SMS) through standard Yearn V3 vault roles.

| Market | TroveManager | Lender | Collateral | Debt | Collateral value | System CR |
|--------|--------------|--------|------------|-----:|-----------------:|----------:|
| yvUSD/USDC | [`0x8ee72c38…83c9`](https://etherscan.io/address/0x8ee72c388aA73096338EE18CD46a39D98b8983c9) | [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) | yvUSD | $600,421 | $668,836 | **111.4%** |
| ysyBOLD/USDC | [`0xADf4E022…Fc6E`](https://etherscan.io/address/0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E) | [`0xf4996Ca4…a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) | ysyBOLD | $200,011 | $221,963 | **111.0%** |
| siUSD/USDC | [`0x484E3c28…C09D`](https://etherscan.io/address/0x484E3c28A99282Ce0682f65A5F902876f370C09D) | [`0x9a28d962…2456`](https://etherscan.io/address/0x9a28d962aF18B304cA2bA16bf998D1EaF8452456) | siUSD | $0 | $0 | — (unfunded) |
| yvUSD/USDC (retired) | [`0xd82DB989…2e49`](https://etherscan.io/address/0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49) | [`0x33C45216…B732`](https://etherscan.io/address/0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732) | yvUSD | 147 wei | $24,931 | — (zombie Trove) |

Both live Lenders hold **$0 idle USDC** — the markets are fully lent out. Lender withdrawals beyond idle cash call `TroveManager.redeem(...)`, which Dutch-auctions borrower collateral; proceeds route to the withdrawer.

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

- **Onchain and over-collateralized, but the buffer is thin.** Both live markets are within ~1.4 percentage points of their 110% MCR:
  - **yvUSD/USDC:** `total_debt` = **600,421.24 USDC**; `collateral_balance` = **652,146.02 yvUSD** priced at **1.025593 USDC/yvUSD** → **$668,836.40**; **system CR = 111.39%**.
  - **ysyBOLD/USDC:** `total_debt` = **200,010.54 USDC**; `collateral_balance` = **203,390.01 ysyBOLD** priced at **1.091316 USDC/ysyBOLD** → **$221,962.83**; **system CR = 110.98%**.
- **Every Trove sits at the floor.** All 11 yvUSD Troves fall between 110.20% and 112.66% CR, and all 7 ysyBOLD Troves between 110.16% and 111.88%. This is the signature of fully-levered looping through the leverage zapper, and it means essentially the entire book becomes liquidatable on a sub-1% adverse move in the collateral's price against USDC. Because both collaterals are yield-bearing USD vault shares whose price only falls on a realized loss, the practical trigger is an impairment in the underlying vault rather than market volatility — but when it comes, it hits every Trove at once.
- **First-loss reserve is negligible.** The v2 upfront fee is meant to buffer lenders against bad debt, but `unclaimed_protocol_fees` currently reads **$50.78** (yvUSD market) and **$2.29** (ysyBOLD market) against $800K of debt. The buffer is real in design and immaterial in size, and Dedaub advisory A1 plus Zero Cool H-01 and M-07 all describe ways for borrowers to suppress it further.
- **Collateral quality:** High-quality but concentrated, and now spread across two chains of dependency:
  - **yvUSD** is a Yearn V3 USDC vault assessed in [`yearn-yvusd.md`](./yearn-yvusd.md). Because both legs are USD, the market is effectively leveraged USDC-yield exposure; the dominant residual risk is a yvUSD loss feeding through the oracle.
  - **ysyBOLD** ([`0x23346B04…91cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD), Staked yBOLD) is a Yearn V3 vault over [yBOLD](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8), which is itself a vault over Liquity V2's [BOLD](https://etherscan.io/address/0x6440f144b7e50D6a8439336510312d2F54beB01D). This adds a **three-layer dependency terminating in Liquity V2, which Yearn has not assessed**, and introduces a genuine USD-price-discovery problem that the yvUSD market does not have: BOLD is not USDC.
- **Ratios:** MCR = **110%**, "safe" CR = **120%**, max-penalty CR = **105%**, minimum liquidation fee 0.5%, maximum 5%, minimum debt 500 USDC. Identical across all four markets.
- **Liquidations:** Onchain and permissionless. Below MCR, anyone can liquidate; the fee scales linearly with shortfall. If seized collateral (including fee) exceeds the Trove's collateral, the shortfall is **socialized to lenders** atomically after the protocol fee reserve is consumed. Redemptions Dutch-auction collateral via `dutch_desk.vy` / `auction.vy`: 1-day auctions, 1-minute price steps, starting at 100% of oracle value (100.1% on a re-kick) and stopping at 99%.
- **Admin control over funds:** The immutable market contracts hold collateral; no admin can withdraw borrower collateral. Daddy (3-of-5 multisig) is each Lender's *management*, the Registry owner, and the recipient of both fee streams. It cannot seize collateral or user shares, but it can change Lender parameters, shut a Lender down, change the keeper, set fees, endorse markets, and — in the ysyBOLD market — move the oracle's depeg floor (see *Centralization*).
- **Risk curation:** Market parameters (MCR, fees, auction params, oracle) are **fixed at market-deploy time** by the `factory.vy` deploy call and are **immutable** for that market. Adding markets with different parameters or collateral requires a factory deployment plus Daddy endorsement, as happened for both v2 markets.

### Provability

- **Fully onchain and independently verifiable.** Total debt, collateral balance and CR are readable from each `TroveManager`; a Lender's assets are idle USDC plus `TROVE_MANAGER.sync_total_debt()`. Anyone can recompute the backing ratio.
- **Exchange rate / PPS:** Each Lender is a Yearn TokenizedStrategy whose `pricePerShare` (1.000376 USDC on the yvUSD Lender, 1.000019 on the ysyBOLD Lender) derives from a **cached `totalAssets`** that is refreshed only when the **permissionless keeper** ([`0x52605Bbf…b2f8`](https://etherscan.io/address/0x52605BbF54845f520a3E94792d019f62407db2f8), hard-coded in `LenderFactory`) calls `report()`. Interest accrues continuously in the `TroveManager` but is only priced into shares at report time, so the share price lags real assets between reports. This is the root of Zero Cool M-01, M-02, M-05 and L-04, all unresolved. The v1-era mitigations remain in place — liquidation still calls `lender.disableHealthCheck()` and forces a keeper report in the same transaction, and realized profit still unlocks over 4 days — but M-01 documents a callback window inside the liquidation that opens before that report executes, and M-05/L-04 attack the report itself rather than the profit-unlock schedule.
- **Reporting can be blocked by a pending auction.** `FlexLenderStrategy._harvestAndReport()` reverts while the strategy's last redemption auction is unsettled, so allocator-level accounting pauses until the auction clears or is re-kicked.
- **Oracles:** Each market has its own immutable Vyper oracle, and the two live markets use different designs:
  - **yvUSD/USDC:** [`0xDB8DBB6c…7D2e`](https://etherscan.io/address/0xDB8DBB6c0548341Aea85ebAAFa681B4A8c077D2e) wraps a Morpho [`MorphoChainlinkOracleV2`](https://etherscan.io/address/0xC44Ee741C22957e6b3d40022894Eb50e6a7069EF) configured with yvUSD as `BASE_VAULT` and **no price feeds**, so the reported price is yvUSD's own `convertToAssets` rescaled. Economically identical to reading yvUSD PPS directly, with Morpho's oracle contract added as an intermediary. Appropriate for the pair: yvUSD's underlying asset is USDC and lenders deposit USDC, so there is no separate USDC→USD price-discovery problem — only whether the yvUSD vault correctly reports its own USDC-denominated value, which is a Yearn framework concern covered in [`yearn-yvusd.md`](./yearn-yvusd.md).
  - **ysyBOLD/USDC:** [`0x40556811…AE65`](https://etherscan.io/address/0x405568114Ee8058d0ca1Bbe95DA1f929279BaE65) converts ysyBOLD → yBOLD → BOLD through the two vaults' exchange rates, then prices BOLD/USDC off the **Curve BOLD/USDC pool's EMA oracle** ([`0xEFc65163…4B3E`](https://etherscan.io/address/0xEFc6516323FbD28e80B85A497B65A86243a54B3E), currently 0.99809 USDC in, inverted). The BOLD/USDC leg is **capped at 1.01 and floored at 0.99**, and the floor is only removed when **Daddy calls `set_depeg_mode(true)`** (currently `false`). The floor is the material feature: if BOLD trades below 0.99 the oracle keeps reporting 0.99, overstating collateral and delaying liquidations, so a real BOLD depeg produces bad debt that lands on lenders unless Daddy intervenes in time. The cap and floor also mean this market's solvency is not purely mechanical — it depends on a 3-of-5 multisig reacting.
  - **siUSD/USDC:** [`0x38cAe071…A15a`](https://etherscan.io/address/0x38cAe071526C57f95BBBb41eB12661FBf749A15a) reads siUSD's `convertToAssets` and **assumes iUSD is worth exactly 1 USDC** with no market price at all. The market is unfunded, so this is a forward-looking concern rather than a live one.
- **Third-party verification:** None beyond direct onchain reads (no Chainlink price feed on either live market, no PoR, no custodian).

## Liquidity Risk

- **Exit is auction-mediated, and the standard path is currently closed.** Both live Lenders hold **$0 idle USDC**, and `FlexLenderStrategy.availableWithdrawLimit()` accordingly returns **0** for the `yvFlexUSDC` vault on both Flex strategies. Of the vault's $1.11M, only the $311K parked in the non-Flex Sky USDS strategy is instantly withdrawable through the ordinary Yearn path. Freeing the $800K in Flex requires Yearn SMS to call `forceFreeFunds`, or a user to route through the `FlexExitRouter` — in which case idle liquidity is delivered atomically, the remainder arrives asynchronously as the redemption auction is taken, and the shortfall is **accounted as a loss on that user's withdrawal**.
- **Depth:** TVL is small (~$0.92M) and depositor concentration is extreme (90.9% Yearn Treasury). There is no external DEX market for `ysUSDC`; exit relies entirely on the protocol's own redemption machinery against $891K of collateral in the two live markets, and on the collateral vaults' own exit liquidity.
- **Stress behavior:** Auctions run 1 day with 1-minute steps, starting at 100% of oracle value and stopping at 99%, so a taker willing to redeem the collateral vault share for USDC can clear near par in benign conditions. Under stress the same auction becomes the throttle: redemptions and liquidations can deliver less than 1:1, bad debt is socialized to lenders, and `_harvestAndReport` is blocked while an auction remains unsettled. Zero Cool M-02 additionally describes a case where a redemption that hits the 1,000-Trove traversal bound books the entire unfilled amount as a loss — not reachable at 11 and 7 Troves today, but a scaling constraint.
- **Same-value assets:** All live legs are USD-denominated, so modest exit delays carry limited directional price risk. In the ysyBOLD market that holds only while BOLD holds its peg, and the oracle's 0.99 floor means the market's own price feed will not tell you when it stops.

## Centralization & Control Risks

### Governance

- **Core market contracts are immutable.** The Vyper CDP engine (TroveManager, SortedTroves, DutchDesk, Auction, Factory, Registry) is deployed via CREATE2 with **no proxy/upgrade path**. The Lenders and the `FlexLenderStrategy` instances are non-upgradeable Yearn TokenizedStrategy clones. Every deployed contract in the stack is source-verified on Etherscan.
- **But there *is* privileged control — the protocol's "no admin keys" claim is false.** The [risks page](https://flexmeow.com/risks) still states that Flex has *"no admin keys, no privileged users, and no ability to pause, upgrade, or modify"* the protocol after deployment. This holds only for the immutable market mechanics. Onchain, a **`Daddy` contract** ([`0x4e8341C7…8290`](https://etherscan.io/address/0x4e8341C77c94cCE982AB96d92BB28D69f4638290)) — a generalized arbitrary-`execute` owner — holds real powers:
  - It is each **Lender's `management`** (can `setDepositLimit`, `setPerformanceFee`, `setPerformanceFeeRecipient`, `setKeeper`, `setProfitMaxUnlockTime`, and `shutdownStrategy`),
  - It is the **Registry owner** (can `endorse`/`unendorse` markets),
  - It is the **`performanceFeeRecipient`** on both live Lenders, collecting the live 10% lender performance fee and the borrower upfront fees,
  - It is the sole caller of **`set_depeg_mode`** on the ysyBOLD oracle, a switch that changes how collateral in a live market is valued.
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
- **Curve BOLD/USDC pool** — the sole price source for the BOLD/USDC leg of the ysyBOLD oracle, via its EMA `price_oracle`. Bounded to [0.99, 1.01] unless Daddy lifts the floor, which caps manipulation impact and simultaneously caps the oracle's ability to recognize a genuine depeg.
- **Morpho `MorphoChainlinkOracleV2`** — the yvUSD market's price path runs through this immutable Morpho contract. Well-audited and configured feedless, but an added link in the chain.
- **Yearn V3 / TokenizedStrategy framework** — the Lenders, strategies and allocator vault inherit Yearn's audited base contracts; a framework-level bug would affect Flex.
- **USDC** — the borrow token in every market (Circle centralization/freeze risk, standard).
- **infiniFi siUSD / iUSD** — collateral for the endorsed-but-unfunded fourth market. Assessed in [`infinifi.md`](./infinifi.md). Not a live exposure today.
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
| Price Oracle — yvUSD→USDC (Morpho wrapper) | [`0xDB8DBB6c0548341Aea85ebAAFa681B4A8c077D2e`](https://etherscan.io/address/0xDB8DBB6c0548341Aea85ebAAFa681B4A8c077D2e) | `get_price()` vs yvUSD PPS; abnormal moves |
| Price Oracle — ysyBOLD→USDC | [`0x405568114Ee8058d0ca1Bbe95DA1f929279BaE65`](https://etherscan.io/address/0x405568114Ee8058d0ca1Bbe95DA1f929279BaE65) | `depeg_mode` flag, `DepegModeSet` event, `get_price()` vs Curve EMA and vault rates |
| Registry | [`0x9117440a7D03238905d1C8908157Bd7a547c77c8`](https://etherscan.io/address/0x9117440a7D03238905d1C8908157Bd7a547c77c8) | `EndorseMarket`/`UnendorseMarket` — new market risk |
| Daddy (protocol owner) | [`0x4e8341C77c94cCE982AB96d92BB28D69f4638290`](https://etherscan.io/address/0x4e8341C77c94cCE982AB96d92BB28D69f4638290) | `OwnershipTransferred`; any `execute` call |
| Daddy owner Safe (3/5) | [`0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67) | signer/threshold changes |
| yvFlexUSDC allocator vault | [`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`](https://etherscan.io/address/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8) | Yearn-side roles, `role_manager` handover, debt allocation, deposit limit |
| FlexLenderStrategy — yvUSD | [`0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | `availableWithdrawLimit`, `ForceFreeFunds`, pending auction, health-check losses |
| FlexLenderStrategy — ysyBOLD | [`0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | same |
| FlexExitRouter | [`0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD`](https://etherscan.io/address/0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD) | user exits routed with a proceeds receiver (losses booked to the exiter) |
| Collateral yvUSD | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS, see `yearn-yvusd.md` triggers |
| Collateral ysyBOLD | [`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD) | PPS; and BOLD peg via the Curve pool |

**Critical values / events & thresholds:**

- **Backing ratio** per market = (`collateral_balance` × oracle price) / `total_debt`. Both markets run close to the 110% MCR by design, so a static 112% alert would fire continuously. Alert if **system CR < 110.5%**; page if **< 110%**, on any `ReportLoss` on a Lender, or if the share of market debt held in Troves below 110.5% CR exceeds 50%.
- **Idle liquidity** = idle USDC in the Lender and in the strategy. Both are currently 0, so alert on the *inverse* condition too: track `FlexLenderStrategy.availableWithdrawLimit(vault)` and escalate if it stays at 0 while the vault needs liquidity.
- **First-loss buffer**: `unclaimed_protocol_fees` per market. Alert if it falls relative to debt, or if a borrow-side operation collects a materially below-average upfront fee (the H-01 / A1 suppression path).
- **Oracle:** `get_price()` deviating from the underlying vault rates; **any `DepegModeSet` event**; BOLD/USDC trading below 0.99 on the Curve pool while `depeg_mode` is still `false` — that is the window in which the ysyBOLD market is knowingly over-valuing its collateral.
- **Governance:** any `Daddy.execute`, ownership transfer, Safe signer/threshold change, performance-fee change, `setKeeper`, Lender shutdown, or new `EndorseMarket`.
- **Remediation:** new commits to `flexmeow/flex-contracts` or `flexmeow/flex-allocator` addressing the August 11 findings; closure of yearn-strategies #756.
- **Recommended frequency:** backing ratio, idle liquidity and withdraw limit **hourly**; governance, registry and depeg-mode events **real-time**; collateral vault PPS **daily**.

Onchain reads: `Lender.totalAssets()`, `Lender.pricePerShare()`, `TroveManager.total_debt()`, `TroveManager.collateral_balance()`, `TroveManager.unclaimed_protocol_fees()`, `Oracle.get_price()`, `ysybold_oracle.depeg_mode()`, `Registry.get_all_markets()`, `FlexLenderStrategy.availableWithdrawLimit(vault)`, `Daddy.owner()`, Safe `getOwners()/getThreshold()`.

## Appendix: Contract Architecture

```
                          USER / YEARN DEPOSITOR (USDC)
                                     │ deposit
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  yvFlexUSDC — Yearn V3 allocator vault                   │  role_manager: Yearn SMS
        │  0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8              │  0x16388463…0ff7
        └─────────────────────────────────────────────────────────┘  $1,111,367
                 │ 54.0%              │ 18.0%             │ 28.0%
                 ▼                    ▼                   ▼
        ┌────────────────────┐ ┌────────────────────┐ ┌──────────────────────┐
        │ FlexLenderStrategy │ │ FlexLenderStrategy │ │ USDC → SKY USDS      │
        │ 0x7501EAE6…D737b   │ │ 0xDd58AeFE…b5176   │ │ 0xfb4F83c3…F95e      │
        │ (yvUSD market)     │ │ (ysyBOLD market)   │ │ (not a Flex position)│
        └────────────────────┘ └────────────────────┘ └──────────────────────┘
                 │ deposit             │ deposit
                 ▼                     ▼
   ┌───────────────────────────┐ ┌───────────────────────────┐   ASSESSED TOKEN (left)
   │ Lender "Flex yvUSD/USDC"  │ │ Lender "Flex ysyBOLD/USDC"│   management: Daddy
   │ ysUSDC 0xD93Dade7…e8bA    │ │ ysUSDC 0xf4996Ca4…a03C    │   keeper: 0x52605Bbf…b2f8
   │ $600,257 · PPS 1.000376   │ │ $200,005 · PPS 1.000019   │   perf-fee 10% → Daddy
   └───────────────────────────┘ └───────────────────────────┘   profit unlock: 4 days
                 │ USDC liquidity / redeem()
                 ▼
   ── PROTOCOL LAYER (immutable Vyper, CREATE2; Factory v1.1.0) ─────────────────
     yvUSD/USDC market                     ysyBOLD/USDC market
       TroveManager  0x8ee72c38…83c9         TroveManager  0xADf4E022…Fc6E
       SortedTroves  0xB3770984…c6F7         SortedTroves  0x268C2F12…C17b
       DutchDesk     0xa22C420E…9211         DutchDesk     0x8e5C69f8…2A6D
       Auction       0x9bF027D9…7D56         Auction       0x068C6c7E…1e73
       PriceOracle   0xDB8DBB6c…7D2e         PriceOracle   0x40556811…AE65
         └─ Morpho oracle 0xC44Ee741…69EF      └─ Curve BOLD/USDC EMA 0xEFc65163…4B3E
            (BASE_VAULT = yvUSD, no feeds)       (floor 0.99 / cap 1.01, Daddy-liftable)
     ── factories / registry / periphery ──
       Factory v1.1.0   0xffc787ad…501f      LenderFactory   0x98f678aa…B856
       Registry         0x9117440a…77c8      StrategyFactory 0x1792348F…8252
       FlexExitRouter   0xe8a51140…2aeD      StrategyAprOracle 0xcB5A60AB…b171
   ── UNDERLYING LAYER ──────────────────────────────────────────────────────────
       yvUSD    0x696d02Db93291651ED510704c9b286841d506987  (Yearn V3 USDC vault)
       ysyBOLD  0x23346B04a7f55b8760E5860AA5A77383D63491cD  → yBOLD → BOLD (Liquity V2)
       USDC     0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48  (borrow token, all markets)
   ── GOVERNANCE ────────────────────────────────────────────────────────────────
       Daddy (arbitrary execute)  0x4e8341C77c94cCE982AB96d92BB28D69f4638290
         └─ owner: Safe 3/5        0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67
       Yearn SMS                   0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7
```

Two further endorsed markets carry no debt: **siUSD/USDC** (TroveManager [`0x484E3c28…C09D`](https://etherscan.io/address/0x484E3c28A99282Ce0682f65A5F902876f370C09D), unfunded) and the **retired v1 yvUSD/USDC** market (TroveManager [`0xd82DB989…2e49`](https://etherscan.io/address/0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49), Lender [`0x33C45216…B732`](https://etherscan.io/address/0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732), zombie Trove holding ~$24.9K of yvUSD against 147 wei of debt).

**Trust boundaries:** Borrower collateral is held by immutable TroveManagers — no admin withdrawal path. Daddy (3-of-5 multisig, no timelock) controls Lender parameters, both fee streams, market endorsement and the ysyBOLD oracle's depeg floor, but cannot seize funds. The Yearn allocator and strategy layer is governed by Yearn SMS. The most concentrated risks are the two single-asset collaterals, each priced by a feed that ultimately reads the collateral's own vault accounting, and a debt book where every Trove sits within 3 points of the liquidation threshold.

---

## Risk Summary

### Key Strengths

- **Immutable core protocol** — the Liquity-V2-style CDP engine has no upgrade path; market parameters are fixed at deploy, and every deployed contract is source-verified.
- **A clean audit on the deployed upgrade** — Dedaub's August 5 review of the v1.1/v2 changes (three auditors, six contracts) found **no Critical, High, Medium or Low** issues.
- **Governance hardening** — the controlling Safe moved from 2-of-4 to **3-of-5**, and Daddy's powers remain non-custodial: it cannot seize borrower collateral or lender shares.
- **Fully onchain, over-collateralized, verifiable** — backing is recomputable by anyone from `total_debt` and `collateral_balance`; **no privileged minter** exists on the lending token.
- **Transparency improved** — the allocator layer is now a public repository, and both new reviews were published including the unfavorable one.
- **Yearn-grade integration layer** — allocator vault and strategies governed by Yearn SMS / yHaaS, with a role-manager handover to Yearn's `RoleManager` pending.

### Key Risks

- **Twelve unresolved security findings on the deployed code.** The August 11 Zero Cool review of deployed `master` reported 1 High, 7 Medium and 4 Low, **all unresolved with no fix review**, and no remediation has been committed since. Four of them (M-01, M-02, M-05, L-04) transfer value away from passive lenders through the Lender's cached share price — the same class as the April-27 FLEX-001 High that the v2 callback flow reopened.
- **The collateral buffer is at the floor.** Both live markets run at ~111% system CR against a 110% MCR, with every one of the 18 Troves between 110.16% and 112.66%. The protocol's first-loss reserve against bad debt is $53 in total, and three separate findings describe ways to suppress it further.
- **Very new & small** — the deployed markets are 2–3 weeks old, TVL is ~$0.92M, and **90.9% of the depositor base is the Yearn Treasury itself**.
- **Exit is currently gated.** Both Lenders hold zero idle USDC and both Flex strategies report `availableWithdrawLimit = 0`; freeing the $800K requires Yearn SMS action or an ExitRouter exit that delivers proceeds asynchronously and books the shortfall as the exiter's loss.
- **A Daddy-controlled oracle floor on a live market.** The ysyBOLD oracle floors BOLD/USDC at 0.99; below that it knowingly over-values collateral until Daddy calls `set_depeg_mode(true)`. Market solvency in that market is therefore partly a 3-of-5 multisig's reaction time, with no timelock and no disclosure of this control in the docs.
- **Governance overclaim** — the risks page still advertises "no admin keys, no privileged users, no ability to pause, upgrade, or modify" while Daddy collects both fee streams, endorses markets, and holds the depeg switch.
- **Deeper, partly unassessed dependency chain** — the ysyBOLD market sits on ysyBOLD → yBOLD → BOLD → Liquity V2, which Yearn has not assessed, and prices the BOLD leg off a single Curve pool's EMA.
- **Allocator review still open** — `flex-allocator` has no external audit; yearn-strategies #756 remains open with both reviewers' completion boxes unchecked, though a Yearn reviewer has signed off on the deployed code.

### Critical Risks `[If Any]`

- No standalone fund-loss critical was identified. The compounding concern is **a ~1-point CR buffer above MCR + a $53 first-loss reserve + bad debt socialized to lenders + a share price that lags real assets between reports + unresolved findings that specifically exploit that lag**. A collateral impairment large enough to push Troves underwater would hit the entire book at once, and the same liquidation transaction that socializes the loss is the one M-01 identifies as escapable by a shareholder acting as liquidator. In the ysyBOLD market, the 0.99 oracle floor means a real BOLD depeg would delay liquidations rather than trigger them.

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

**Subcategory A: Audits & Security Reviews** — Coverage is broad (six reviews) and the most recent human audit of the deployed upgrade is exemplary: Dedaub found nothing above advisory severity. Against that, an independent review of the same deployed commit six days later returned **1 High, 7 Medium and 4 Low, all unresolved with no fix review and no remediation commits since**, and both Dedaub advisories were dismissed rather than fixed. Several unresolved findings target lender share value directly, and one of them has already been observed operating benignly onchain during the v1 wind-down. The allocator layer carries **no external audit** and its Yearn review ticket is open. There is **no bug bounty** on a complex, callback-heavy surface. → **3**

**Subcategory B: Historical Track Record** — The protocol is ~3.5 months old and the *deployed* markets are 2–3 weeks old, with ~$0.92M TVL, 18 Troves, and 90.9% of the depositor base being the Yearn Treasury. Effectively no track record. → **5**

**Audits & Historical Score = (3 + 5) / 2 = 4.0**

**Score: 4.0/5** — Good audit breadth undercut by an unremediated finding set on the deployed commit, an unaudited allocator layer, and minimal time in production.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance** — Immutable core with non-custodial privileged control: Daddy cannot seize collateral or lender shares. The Safe threshold improved from 2-of-4 to **3-of-5**. Offsetting that, Daddy's remit grew — it now receives both fee streams, has endorsed three additional markets without delay, and holds `set_depeg_mode` on a live market's oracle, which is the first Daddy power that can change collateral valuation and liquidation timing. Still **no timelock**, and the docs still deny that any of this exists. → **3**

**Subcategory B: Programmability** — Borrowing, interest, redemptions, liquidations and auctions remain fully onchain and share price is computed onchain. But the previously-closed stale-PPS concern is open again: v2's callbacks execute inside liquidation before the loss report, the permissionless keeper lets an attacker choose when the price refreshes, and four unresolved findings turn on exactly that. Allocator reporting also halts while a redemption auction is unsettled, and large exits are management-gated. → **2**

**Subcategory C: External Dependencies** — Two live collateral assets rather than one. yvUSD is a Yearn-assessed, USDC-denominated vault priced through an immutable Morpho oracle — a well-understood dependency. ysyBOLD adds a three-layer chain terminating in **Liquity V2, which Yearn has not assessed**, real BOLD/USD price discovery, a single Curve pool as the price source, and a governance-controlled price floor. Plus the Yearn V3 framework and USDC. → **3.5**

**Centralization Score = (3 + 2 + 3.5) / 3 = 2.83**

**Score: 2.83/5** — Immutable mechanics and non-custodial governance, weighed down by a reopened share-pricing surface and a materially deeper dependency chain.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization** — Over-collateralized, onchain, and real-time verifiable, in high-quality DeFi collateral. But the buffer is now minimal: 111.4% and 111.0% system CR against a 110% MCR, with every Trove between 110.16% and 112.66%, a $53 protocol first-loss reserve, bad debt socialized to lenders, and — in the ysyBOLD market — an oracle floor that suppresses the price signal a liquidation would need. → **3.5**

**Subcategory B: Provability** — Total debt, collateral and Lender assets are readable directly and the backing ratio is recomputable by anyone, with no offchain reserve or admin reporting dependency. The share price itself, however, is a cached figure refreshed at the discretion of a permissionless keeper, and four unresolved findings exploit the gap between it and real assets. → **2**

**Funds Management Score = (3.5 + 2) / 2 = 2.75**

**Score: 2.75/5** — Transparent onchain over-collateralization, at a leverage level that leaves almost no margin for collateral impairment.

#### Category 4: Liquidity Risk (Weight: 15%)

Both live Lenders hold zero idle USDC and both Flex strategies report `availableWithdrawLimit = 0` for the allocator vault, so the ordinary Yearn withdrawal path currently frees nothing from Flex. Exit requires management `forceFreeFunds` or the `FlexExitRouter`, which delivers auction proceeds asynchronously and books the shortfall as a loss to the exiting user. Auctions can clear near par (100% start, 99% floor, 1-day duration) when a taker redeems the collateral vault share for USDC, and both legs are USD-denominated, which limits price risk over short delays. Depth is small (~$0.92M) and concentrated. → **3.5**

**Score: 3.5/5** — Materially better than a generic delayed auction because of the collateral-redemption taker path, but with no instant liquidity available today and a loss-bearing asynchronous exit as the working mechanism.

#### Category 5: Operational Risk (Weight: 5%)

Pseudonymous but Yearn-ecosystem-known lead dev; mechanics docs are accurate and were updated for v2; the allocator code and both August audits were published, including the unfavorable one. Against that: a **misleading "no admin keys" claim** that the onchain role set plainly contradicts, no governance or legal disclosure, no bug bounty, an undisclosed fifth Safe signer, and twelve findings left open on deployed code. → **3**

**Score: 3/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 4.0 | 20% | 0.80 |
| Centralization & Control | 2.83 | 30% | 0.85 |
| Funds Management | 2.75 | 30% | 0.825 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.15/5.0** |

**Optional Modifiers:** None apply (protocol < 2 years; TVL not sustained). Final score ≈ **3.15/5.0**.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk** — *Approved with enhanced monitoring*, in the upper half of the band and close to the Elevated boundary. The driving constraints are twelve unremediated findings on the deployed commit, a debt book levered to within ~1 point of the liquidation threshold with a negligible first-loss reserve, an exit path that currently frees no liquidity through the standard route, and a deeper dependency chain that now reaches an unassessed protocol. These are partly offset by an immutable core, a clean Dedaub audit of the v2 upgrade, a hardened 3-of-5 Safe, non-custodial governance powers, and transparent onchain over-collateralization. Recommend keeping position size strictly limited, treating the ysyBOLD market as the higher-risk of the two, and requiring remediation of the August 11 High/Medium findings plus closure of yearn-strategies #756 before scaling.

---

## Reassessment Triggers `[If Applicable]`

- **Time-based:** Reassess in **2 months** (early-stage protocol on freshly deployed code).
- **Remediation:** Reassess (upward) once the August 11 High and Medium findings are fixed and fix-reviewed, and once yearn-strategies #756 is marked complete. Reassess (with caution) on any further material change to `flex-contracts` or `flex-allocator` after those.
- **Collateralization:** Reassess if either market's system CR falls below **110.5%**, if the share of market debt in Troves below 110.5% CR exceeds 50%, or if `unclaimed_protocol_fees` is materially depleted.
- **Oracle / governance switch:** Reassess on any `DepegModeSet` event, if BOLD trades below 0.99 USDC while `depeg_mode` is `false`, or if any market's oracle design changes.
- **TVL-based:** Reassess if Flex TVL changes by **>50%** in either direction, if the Yearn Treasury's share of `yvFlexUSDC` changes materially, or if a Lender `depositLimit` is raised.
- **Collateral/market:** Reassess if a **new market is endorsed** (`Registry.EndorseMarket`) — in particular if the siUSD market is funded — or if a non-USD collateral is added.
- **Liquidity:** Reassess if `FlexLenderStrategy.availableWithdrawLimit` remains 0 while the allocator vault faces redemptions, or after any `ForceFreeFunds` or ExitRouter exit that realizes a loss.
- **Governance:** Reassess on any Daddy ownership transfer, Safe signer/threshold change, addition of a timelock, performance-fee change, or keeper change.
- **Incident-based:** Reassess after any bad-debt socialization event, liquidation failure, auction freeze, collateral depeg or loss, or any exploit affecting Flex, Yearn V3, yvUSD, ysyBOLD/yBOLD or Liquity V2.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 19, 2026](https://github.com/yearn/risk-score/pull/220) | 2.53 | Initial assessment — single yvUSD/USDC market, ~$0.97M TVL, 120.7% system CR, 2-of-4 Daddy Safe |
| [August 23, 2026](https://github.com/yearn/risk-score/pull/425) | 3.15 | Reassessment: v1.1/v2 redeploy — original market retired, Yearn migrated to new yvUSD/USDC and ysyBOLD/USDC Lenders; upfront fee redirected to protocol and 10% lender performance fee activated; Safe hardened to 3-of-5; Dedaub v1.1 audit clean but 12 unresolved Zero Cool findings on deployed code; system CR down to ~111% with every Trove at the MCR floor; both Lenders fully lent out with `availableWithdrawLimit = 0` |
