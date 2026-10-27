# Protocol Risk Assessment: Flex

- **Assessment Date:** June 19, 2026 (Updated: October 27, 2026)
- **Token:** Flex yvUSD/USDC Lender position token (`ysUSDC`)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA)
- **Snapshot:** Onchain reads at Ethereum block [26285921](https://etherscan.io/block/26285921) (October 27, 2026, 18:43 UTC); USD values for WETH use the Chainlink ETH/USD feed ([`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)) at $2,344.00 at the same block.
- **Final Score: 2.58/5.0**

## Overview + Links

Flex is a **fixed-rate, CDP-style lending protocol inspired by Liquity V2**. Borrowers lock collateral in *Troves* and borrow a *borrow token*, paying a **fixed annual interest rate that they choose themselves** (bounded and adjustable with a cooldown). Lenders deposit the borrow token into a Yearn-V3-compatible *Lender* vault (an ERC-4626 tokenized strategy) and earn borrower interest plus surplus proceeds from collateral auctions. In exchange, lenders **absorb bad debt** from underwater liquidations, which is socialized atomically across the vault.

Liquidity is managed Liquity-V2-style through **redemptions**: when idle lender liquidity is insufficient (for a new borrow or for a lender withdrawal), the protocol redeems Troves — starting with the lowest interest-rate Troves — and **Dutch-auctions the seized collateral** to raise the borrow token. Borrowers can be liquidated by anyone once their collateralization ratio (CR) falls below the market's Minimum Collateral Ratio (MCR), with a liquidation fee that scales with how far below MCR the Trove sits.

The deployed protocol is the **v1.1 ("v2") revision**, merged to `master` on August 7, 2026 ([PR #20](https://github.com/flexmeow/flex-contracts/pull/20)) and deployed as new markets from `Factory` v1.1.0. The v2 revision reworks borrow and leverage flows around authenticated `troveCallback`s and direct auction settlement (the leverage zapper takes the redemption auction instead of using a flashloan), **redirects the borrower upfront fee from lenders to the protocol** as a first-loss buffer against bad debt, adds a configurable repay cooldown of up to one hour on newly created debt, and shortens the Lender's profit-unlock window to 4 days. The allocator layer Yearn deposits through was moved to a separate public repository, [`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator).

**Assessed token.** The token under assessment is the lending position token — the **Lender** ERC-4626 share (`ysUSDC`) of the largest live market: **yvUSD collateral / USDC borrow**. End users do not lend directly to Flex markets. They deposit USDC into Yearn's allocator vault `yvFlexUSDC` → `FlexLenderStrategy` → `Lender` (see *Appendix: Contract Architecture*). Direct Lender depositors would bear the curator-style risks that Yearn takes on as allocator. Yearn also lends USDC in the **ysyBOLD/USDC** and **yvcrvUSD-2/USDC** markets through identical strategies, and WETH in the **yvWETH-2/WETH** market through a second allocator vault, `yvFlexWETH`. All four Lenders are covered here because they share the same Lender code, the same Daddy-controlled parameters and the same lender-loss mechanics. Each market is isolated: it has its own TroveManager and Lender, and bad debt in one market is socialized only to that market's Lender. The collateral asset **yvUSD** is itself a Yearn V3 USDC vault that Yearn has assessed separately ([`yearn-yvusd.md`](./yearn-yvusd.md)).

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
| **Aug 11, 2026** | **Zero Cool** (`zero-cool-flex-v2-review.pdf`) — [autonomous AI security agents](https://zerocool.ai/) | deployed `master`, commit `b96c12a1…`; 10 files incl. `trove_manager.vy`, `Lender.sol`, `auction.vy`, `dutch_desk.vy`, `registry.vy` | 1 High, 7 Medium, 4 Low reported. Yearn security review concluded most are invalid; the rest are low/info or intended behavior, not open blockers |

Dedaub's review of the v2 upgrade is a genuinely clean result: three auditors, two weeks, and no findings above advisory severity. Its two advisories were both dismissed by the team — A1 (a helper Trove at the minimum rate depresses the debt-weighted average that sets the upfront fee, undercollecting up to ~$24K on a $1M position in an empty market) reduces `unclaimed_protocol_fees`, which is precisely the first-loss reserve standing between bad debt and lender principal.

The **Zero Cool review** is an autonomous-agent report against the deployed commit. It classified 12 items as open; Yearn security's review of those items concluded that **most are invalid**, and that the remainder are low/informational or **intended protocol behavior** rather than exploitable lender-loss bugs. Cached Lender share price and Yearn profit-unlock are intentional: realized profit unlocks over 4 days, so a depositor cannot atomically harvest previously accrued interest, and the Lender keeper is a hard-coded address rather than a permissionless caller. Exiting before a loss is socialized is available to any shareholder by withdrawing — it is not a callback-specific hole. Partial bounded redemptions are not a practical concern at current Trove counts.

When the v1 market was wound down in August 2026 the exiting allocator strategy redeemed at the cached price and ~$913 of interest accrued since the prior report was left behind, lifting the residual Lender's price per share to ~1.51 for the ~1,327 shares that stayed ([`Reported` event, block 25756324](https://etherscan.io/tx/0x20ba4c339bba4c750fa2a19d2caf762512b22232a122c41284b95eb4caa0c254)). That leftover is the intended profit-unlock / cached-PPS behavior of a Yearn TokenizedStrategy, not evidence of an unpatched bug.

**Audit scope vs. deployed/Yearn-path code.** The six reviews cover the **core protocol**; `flex-contracts` `master` has had no code change since the Zero Cool report was added on August 11, 2026. The yvUSD and yvWETH-2 markets use the `morpho_oracle.vy` wrapper merged to `master` in [PR #19](https://github.com/flexmeow/flex-contracts/pull/19). The ysyBOLD and yvcrvUSD-2 oracles live on open pull requests ([#22](https://github.com/flexmeow/flex-contracts/pull/22), [#23](https://github.com/flexmeow/flex-contracts/pull/23)) and are Etherscan-verified; both were reviewed by Yearn security and Zero Cool even though they are not yet merged to `master`. Further oracle PRs (locked yvUSD [#24](https://github.com/flexmeow/flex-contracts/pull/24), sDOLA [#26](https://github.com/flexmeow/flex-contracts/pull/26), siUSD [#27](https://github.com/flexmeow/flex-contracts/pull/27)) are open but back no endorsed market. The **allocator layer** (`Strategy.sol`, `StrategyFactory.sol`, `ExitRouter.sol` in [`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator)) is a Yearn V3 strategy, not protocol core — it is covered by Yearn's strategy-security process and was reviewed by Zero Cool plus Yearn internal security. End users of `yvFlexUSDC` deposit into the allocator, which then lends to Flex markets; they do not lend directly to a market. Direct Lender depositors would bear the curator-style risks that Yearn takes on as allocator.

**Complexity:** The onchain surface is **substantial** — a full Liquity-V2-style CDP engine (`trove_manager.vy`, `sorted_troves.vy`, `dutch_desk.vy`, `auction.vy`, `factory.vy`, `registry.vy`) written in Vyper, plus a Solidity Yearn-V3 lender layer (`Lender.sol`, `LenderFactory.sol`), a per-market price oracle, and an allocator strategy with an exit router. The v2 callback-based borrow and leverage flow adds re-entrancy-adjacent surface that did not exist in v1. The codebase ships a Slither config and Foundry invariant tests (e.g. `test/invariant/DebtInvariant.sol`).

**Other unresolved items:** A few low-severity items are explicitly "will not fix" as inherited Liquity V2 behavior (interest-dust rounding, small-repay interest baking). No outstanding Critical finding exists on any reviewed component.

### Bug Bounty `[If Applicable]`

- **None.** No bug-bounty program appears on the docs, the risks page, Immunefi, or the [SEAL Safe Harbor registry](https://safeharbor.securityalliance.org/). Dedaub's own report recommends "a public bug bounty program" alongside multiple independent audits for high-value contracts.

## Historical Track Record

- **Time in production: ~5.5 months; the v1.1 code ~12 weeks.** The first live core contracts and the original yvUSD/USDC market were deployed May 12–14, 2026. The markets carrying debt today run the v1.1 code: [yvUSD/USDC](https://etherscan.io/address/0x8ee72c388aA73096338EE18CD46a39D98b8983c9) deployed **August 5** and endorsed August 7; [ysyBOLD/USDC](https://etherscan.io/address/0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E) deployed **August 12** and endorsed August 13; [yvcrvUSD-2/USDC](https://etherscan.io/address/0x7582b47486F75F5D675f260d357972cD0DbEeA2E) deployed **August 23** and endorsed August 24; [yvWETH-2/WETH](https://etherscan.io/address/0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C) deployed **September 16** and endorsed **September 17, 2026** ([tx](https://etherscan.io/tx/0xfb37c1c926d7527c79f9c0549d6d9394ffefc68f02ac3a7b76ecb813bcdc99ff)). Earlier broadcast artifacts date to October 2025, indicating an extended testnet/redeploy history.
- **TVL: ~$1.94M.** [DeFiLlama](https://defillama.com/protocol/flex) reports $1,944,022 for Flex on October 27, 2026, up from $1,090,024 on September 2, 2026 (+78%). TVL was flat near $1.11M until October 8 and stepped up from October 9 as Yearn funded the yvWETH-2/WETH market: the WETH allocator strategy minted Lender shares for 99.99 WETH on October 8, 88.62 WETH on October 12 and 111.33 WETH on October 16, on top of 10.0 WETH on September 19. This reconciles with onchain collateral at the snapshot: $699,044 (yvUSD) + $240,504 (ysyBOLD, of which $7,716 is unpledged residue) + $112,234 (yvcrvUSD-2) + $846,979 (yvWETH-2) + $25,193 (retired v1 market) = **$1,923,955**.
- **Security incidents:** None known. From September 7 to the snapshot, no market emitted a `BadDebt` event, and no Lender or allocator strategy reported a loss: all 13, 12, 13 and 10 Lender reports and all strategy reports carried zero loss. The redemption path was exercised repeatedly: 60 `RedeemTrove` events across the four live markets. The only liquidation was a 2,682.35 USDC Trove in the ysyBOLD market on September 16, 2026 ([tx](https://etherscan.io/tx/0x760628050580eafab0cc188b106f467c334784d0ddd442c1d42ce4ec186a426f)), which cleared without bad debt.
- **Migration event, August 2026.** The original yvUSD/USDC market was wound down and replaced rather than upgraded — the v1 market's Troves closed, the allocator strategy [`0x467Ce108…7751`](https://etherscan.io/address/0x467Ce10870747372968ba98463A1d9af9Fb27751) redeemed its ~$800K of Lender shares in three tranches between August 13 and August 19, and the strategy was revoked from the `yvFlexUSDC` vault. No loss was reported on any of the exits. The retired v1 `TroveManager` still holds 24,308.75 yvUSD (~$24,960) against 147 wei of debt in a zombie Trove; its Lender retains $2,001 against 1,232 shares, a price per share of **1.62** built from interest that accrued after the large holder exited (Yearn TokenizedStrategy profit-unlock: remaining shares keep interest that was not yet unlocked).
- **Governance actions, August 24, 2026.** Daddy executed two transactions three minutes apart. The first ([`0xe1e6f4b0…`](https://etherscan.io/tx/0xe1e6f4b0a3c67389804fbcf80acbf29dc46e923de7f24ca56f76471ca194bf63)) **unendorsed the retired v1 yvUSD/USDC market and the never-funded siUSD/USDC market** — both now report `market_status = 2` — and simultaneously set **`depeg_mode = true`** on the ysyBOLD oracle, removing that market's artificial 0.99 floor on BOLD/USDC. The second ([`0xe292a429…`](https://etherscan.io/tx/0xe292a42968fa1b2b5b406c8e7819ad2a404aaedb7e3afaf7864d5af6a5379290)) endorsed the new yvcrvUSD-2/USDC market. Both the retirement of dead markets and the removal of the price floor are lender-protective choices; the point of record is that all three took effect immediately, with no timelock.
- **Governance action, September 17, 2026.** The Safe's only execution after September 7 ([`0xfb37c1c9…`](https://etherscan.io/tx/0xfb37c1c926d7527c79f9c0549d6d9394ffefc68f02ac3a7b76ecb813bcdc99ff)) configured the new ysWETH Lender through Daddy and endorsed the yvWETH-2/WETH market in the same transaction. Like the August actions, it took effect immediately.
- **Concentration risk:** Lending is sourced essentially entirely through Yearn's own allocator vaults. Each `FlexLenderStrategy` holds 99.87–99.98% of its Lender's shares. **90.8% of `yvFlexUSDC` shares are held by the Yearn Treasury** ([`0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde`](https://etherscan.io/address/0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde), 1.0M of 1.10M shares); the next holder accounts for 9.0%. **96.8% of `yvFlexWETH` shares are held by the Yearn yETH Recovery Vault** ([`0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6`](https://etherscan.io/address/0xd7a540ba3626c0aa66e7DB4088971d0CD64695B6), 299.97 of 310.02 shares); a Safe ([`0xe07d9C9cF00F9d6a4fD595A31cbb7BC0953a41A0`](https://etherscan.io/address/0xe07d9C9cF00F9d6a4fD595A31cbb7BC0953a41A0)) holds the remaining 3.2%. The TVL growth therefore reflects Yearn's own allocation rather than organic third-party lending. Borrower concentration is similar: 30 Troves across the four live markets. The largest position accounts for 19.0% of debt in yvUSD, 31.2% in ysyBOLD, 57.0% in yvcrvUSD-2 and 38.9% in yvWETH-2.
- **Peg / depeg history:** None. The three USDC markets are USD-denominated on both legs and the WETH market is ETH-denominated on both legs. At the snapshot the Curve USDC/crvUSD EMA reads 0.99897 (down from 1.00006 on September 7), which lowers every yvcrvUSD-2 Trove's CR by the same ~0.1%; the BOLD/USDC EMA reads 1.0036.

## Funds Management

Flex runs **four endorsed markets**, all of which carry debt. The fund flow for Yearn's positions is:

**User USDC → `yvFlexUSDC` (Yearn V3 allocator vault) → `FlexLenderStrategy` → `Lender` (`ysUSDC`) → market lending**, where borrowers post collateral to borrow USDC; and the same shape in WETH through `yvFlexWETH` → `FlexLenderStrategy` → `Lender` (`ysWETH`).

The `yvFlexUSDC` vault holds **$1,118,643** and allocates it across four strategies — **81.0% of it sits in Flex**:

| Strategy | Address | Allocation | Underlying | Idle USDC |
|----------|---------|-----------:|------------|----------:|
| Flex yvUSD/USDC Lender | [`0x7501EAE6…D737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | $604,550 (54.0%) | Flex Lender [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) | $0 |
| Flex ysyBOLD/USDC Lender | [`0xDd58AeFE…b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | $200,965 (18.0%) | Flex Lender [`0xf4996Ca4…a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) | $17,594 (Lender) |
| Flex yvcrvUSD-2/USDC Lender | [`0xC818A0Be…f39d`](https://etherscan.io/address/0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d) | $100,545 (9.0%) | Flex Lender [`0xc1f281A3…eC84`](https://etherscan.io/address/0xc1f281A3643F219636F97F6E687A33704950eC84) | $798 (Lender) |
| USDC To SKY USDS Depositor | [`0xfb4F83c3…F95e`](https://etherscan.io/address/0xfb4F83c3923eab7B6254cD2399C206109970F95e) | $212,584 (19.0%) | Sky sUSDS — not a Flex position | $212,646 withdrawable |

The `yvFlexWETH` vault ([`0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F`](https://etherscan.io/address/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F)) holds **310.14 WETH (~$726,965)**. All of it sits in the Flex yvWETH-2/WETH Lender strategy ([`0x7E4a6A89583e117C641aB3ce8897209800A3F2E3`](https://etherscan.io/address/0x7E4a6A89583e117C641aB3ce8897209800A3F2E3)); the second queued strategy, yvWETH-1 ([`0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0`](https://etherscan.io/address/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0)), holds 1 wei of debt.

The endorsed market set is enumerable onchain via `Registry.get_all_markets()`, which returns six `TroveManager`s of which four carry `market_status = 1` (endorsed) and two `market_status = 2` (unendorsed). Endorsement and unendorsement are Daddy-only and observable through `EndorseMarket` / `UnendorseMarket`. Both allocator vaults are governed by Yearn's standard [`RoleManager`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) (see *Centralization*).

| Market | TroveManager | Lender | Collateral | Debt | Pledged collateral value | Backing CR | Troves |
|--------|--------------|--------|------------|-----:|-----------------:|----------:|-------:|
| yvUSD/USDC | [`0x8ee72c38…83c9`](https://etherscan.io/address/0x8ee72c388aA73096338EE18CD46a39D98b8983c9) | [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA) | yvUSD | $605,779 | $696,457 | **114.97%** | 9 |
| ysyBOLD/USDC | [`0xADf4E022…Fc6E`](https://etherscan.io/address/0xADf4E0226d59aac20272023c04B4DcF5Ade7Fc6E) | [`0xf4996Ca4…a03C`](https://etherscan.io/address/0xf4996Ca4190A1a3e7CF19AbE2F6eb712abd4a03C) | ysyBOLD | $183,728 | $232,788 | **126.70%** | 6 |
| yvcrvUSD-2/USDC | [`0x7582b474…eA2E`](https://etherscan.io/address/0x7582b47486F75F5D675f260d357972cD0DbEeA2E) | [`0xc1f281A3…eC84`](https://etherscan.io/address/0xc1f281A3643F219636F97F6E687A33704950eC84) | yvcrvUSD-2 | $99,957 | $112,234 | **112.28%** | 6 |
| yvWETH-2/WETH | [`0xEe27D81B…334C`](https://etherscan.io/address/0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C) | [`0x0d57098e…9E36`](https://etherscan.io/address/0x0d57098e501D68905fC4B0A3397f7D4Aa4889E36) | yvWETH-2 | 310.24 WETH ($727,206) | 361.34 WETH ($846,979) | **116.47%** | 9 |
| yvUSD/USDC (unendorsed) | [`0xd82DB989…2e49`](https://etherscan.io/address/0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49) | [`0x33C45216…B732`](https://etherscan.io/address/0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732) | yvUSD | 147 wei | $25,193 | — | 0 |
| siUSD/USDC (unendorsed) | [`0x484E3c28…C09D`](https://etherscan.io/address/0x484E3c28A99282Ce0682f65A5F902876f370C09D) | [`0x9a28d962…2456`](https://etherscan.io/address/0x9a28d962aF18B304cA2bA16bf998D1EaF8452456) | siUSD | $0 | $0 | — | 0 |

The collateral column counts only collateral pledged against Troves. The yvUSD and ysyBOLD markets also hold unpledged residue in fully-redeemed Troves: $2,587 and $7,716 respectively (see *Collateralization*). The Lenders keep idle cash near zero by design — deployed cash earns borrower interest. The ysyBOLD Lender holds 17,594 USDC of idle cash. Over the same period that market's debt fell from $200,194 to $183,728 through repayments, Trove closures and redemptions. Lender withdrawals beyond idle cash go through the `FlexExitRouter`, which Dutch-auctions borrower collateral and delivers proceeds to the exiting user.

### Accessibility `[If Applicable]`

- **Lending (mint of `ysUSDC`):** Permissionless ERC-4626 deposit of USDC into the Lender — anyone can mint Lender shares against deposited assets, up to the $2,000,000 per-Lender `depositLimit` (10,000 WETH on the ysWETH Lender). The intermediate `FlexLenderStrategy` is access-gated: `open = false` and `availableDepositLimit` returns 0 for any address other than the allow-listed allocator vault, so allocator users cannot lend directly to a market.
- **Redeeming (burn of `ysUSDC`):** Permissionless `withdraw`/`redeem` at the Lender. At the strategy layer, idle cash in the strategy plus idle cash in the Lender is **$0** on the yvUSD leg, $17,594 on ysyBOLD, $798 on yvcrvUSD-2 and 0.072 WETH on yvWETH-2 — Lenders stay essentially fully deployed by design. Users exit through the `FlexExitRouter`, which sets a proceeds receiver so the withdrawal is delivered directly to the exiting user: any idle cash atomically, the remainder asynchronously via a redemption auction. Anyone can exit at any time this way; Yearn SMS `forceFreeFunds` is an optional management path, not a gate on user exit.
- **Borrowing:** Permissionless — anyone can open a Trove. A configurable `repay_cooldown` (max 1 hour) must elapse between opening or increasing debt and repaying or closing it.
- **Fees / rate limits:** Borrowers pay an **upfront fee** (~1 week of the market-average rate) and a **premature-rate-adjustment fee**; both now accrue to the protocol as a first-loss buffer against bad debt rather than to lenders. Lenders pay a **10% performance fee** — `performanceFee` reads **1000 bps** on all four live Lenders with `performanceFeeRecipient = Daddy`. Realized lender profit unlocks linearly over `profitMaxUnlockTime = 4 days`. Both allocator vaults' own deposit limits are effectively uncapped.

### Token Mint Authority

The assessed token `ysUSDC` is a **Yearn V3 `BaseHooks` TokenizedStrategy** (ERC-4626). Shares are not mintable by any privileged role — they are minted/burned **only** through permissionless `deposit`/`mint`/`withdraw`/`redeem`, and every mint is **fully backed in the same transaction** by the USDC the depositor transfers in. There is no `MINTER_ROLE`, no whitelist mapping, and no owner mint path.

**Mint mechanism:** Permissionless ERC-4626 deposit (asset deposited atomically; shares priced off the strategy's cached `totalAssets`).

**Mint requires backing:** Yes — USDC must transfer in the same transaction; no admin can issue unbacked shares.

**Per-address mint authority** (Lender [`0xD93Dade7…e8bA`](https://etherscan.io/address/0xD93Dade7Ac8b5d1687da5d074835cB4404Dee8bA)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any depositor | ✓ | ✓ | Permissionless ERC-4626 `deposit`/`redeem` | Shares priced against cached `totalAssets`; no privileged minter exists |

**Rate limits / supply caps:** `depositLimit = 2,000,000 USDC` per Lender (settable by management/Daddy via `setDepositLimit`); `availableDepositLimit` returns 0 once total assets reach the cap. Current headroom on the yvUSD Lender is ~$1.39M.

**Backing check at mint time:** Atomic — the depositor transfers USDC in the same transaction. Share **price** is computed against a cached `totalAssets` refreshed by the designated keeper's `report()`, with realized profit unlocking linearly over 4 days — standard Yearn TokenizedStrategy accounting, not an unbacked-mint surface.

There is **no privileged minter** — a positive signal. The dependency graph therefore contains **no `mints` edge** into `ysUSDC`.

### Collateralization

- **Onchain and over-collateralized, with a thin buffer.** Debt is measured as `sync_total_debt()` / `get_trove_debt_after_interest()`, the interest-accrued figures the protocol itself uses to decide liquidations — stored `trove.debt` lags accrual and flatters the ratio by up to ~0.3 percentage points. Collateral is counted only where it is actually pledged against a Trove. Against a 110% MCR:
  - **yvUSD/USDC:** debt **605,778.99 USDC**; pledged collateral **672,010.63 yvUSD** at **1.036378 USDC/yvUSD** → **$696,457.04**; **backing CR = 114.97%**.
  - **ysyBOLD/USDC:** debt **183,727.95 USDC**; pledged collateral **212,264.79 ysyBOLD** at **1.096686 USDC/ysyBOLD** → **$232,787.76**; **backing CR = 126.70%**.
  - **yvcrvUSD-2/USDC:** debt **99,957.50 USDC**; pledged collateral **96,511.51 yvcrvUSD-2** at **1.162908 USDC/yvcrvUSD-2** → **$112,233.99**; **backing CR = 112.28%**.
  - **yvWETH-2/WETH:** debt **310.2417 WETH**; pledged collateral **330.9869 yvWETH-2** at **1.091703 WETH/yvWETH-2** → **361.3395 WETH**; **backing CR = 116.47%**.
- **Not all collateral in a market backs debt.** Fully-redeemed Troves that carry zero debt still hold their owners' collateral until withdrawn. That residue is borrower property and cannot absorb lender losses. The ysyBOLD `TroveManager` holds **219,300.97 ysyBOLD**, of which **7,036.18 (~$7,716) is unpledged residue**, so its naive `collateral_balance / total_debt` ratio reads **130.90%** against a true backing ratio of 126.70%. The yvUSD market holds **2,496.57 yvUSD (~$2,587)** of residue (naive 115.40% versus 114.97%). The yvcrvUSD-2 and yvWETH-2 markets have none. Any monitoring built on the naive ratio will overstate protection.
- **Trove-level distribution.** Walking all 30 Troves gives a range of **110.16% to 154.88%** and a book-wide debt-weighted average of **116.81%** (WETH debt converted at the snapshot ETH price). **19.0% of debt sits below 111% CR, 46.0% below 112%, and 50.9% below 113%**. Per market:
  - **yvUSD:** 114.97%, range 110.16–136.23%, 16.8% of debt below 110.5%.
  - **ysyBOLD:** 126.70%, range 110.37–154.88%, 29.2% below 110.5%.
  - **yvcrvUSD-2:** 112.28%, range 110.25–123.33%, **79.8% below 110.5%**.
  - **yvWETH-2:** 116.47%, range 110.18–147.24%, 9.8% below 110.5%.

  The yvcrvUSD-2 concentration comes from four looped Troves opened near 110.3%. The largest holds 57.0% of that market's debt at 110.25%. The crvUSD EMA's drift to 0.99897 since September has lowered all of them together. These Troves are close to *liquidation*, not to *lender loss*. Liquidation at or just below the 110% MCR leaves roughly 10% of surplus collateral above debt, and the liquidation fee is capped at 5%. Every collateral is a yield-bearing vault share of the same asset as the borrow token (USD vault shares vs USDC, a WETH vault share vs WETH). Running near the MCR is therefore the intended looping design rather than a volatility buffer; the practical trigger for lender loss is an impairment in an underlying vault, not ordinary price swings.
- **First-loss reserve is small but growing.** The v2 upfront fee is meant to buffer lenders against bad debt. `unclaimed_protocol_fees` reads **$243.74**, **$144.90** and **$34.89** in the three USDC markets and **0.0603 WETH (~$141)** in the WETH market — about **$565 against ~$1.62M of debt**. Dedaub advisory A1 describes a way for borrowers to suppress it further. Because the collaterals are alike assets, the reserve is a rounding buffer rather than the system's primary protection.
- **Collateral quality:** High-quality but concentrated per market, and spread across four dependency chains:
  - **yvUSD** is a Yearn V3 USDC vault assessed in [`yearn-yvusd.md`](./yearn-yvusd.md). Because both legs are USD, the market is effectively leveraged USDC-yield exposure; the dominant residual risk is a yvUSD loss feeding through the oracle.
  - **ysyBOLD** ([`0x23346B04…91cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD), Staked yBOLD) is a Yearn V3 vault over [yBOLD](https://etherscan.io/address/0x9F4330700a36B29952869fac9b33f45EEdd8A3d8), which is itself a vault over Liquity V2's [BOLD](https://etherscan.io/address/0x6440f144b7e50D6a8439336510312d2F54beB01D). A three-layer chain terminating in **Liquity V2, which Yearn has not assessed**, and one that introduces genuine USD price discovery: BOLD is not USDC.
  - **yvcrvUSD-2** ([`0xBF319dDC…805F`](https://etherscan.io/address/0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F)) is a publicly-listed Yearn V3 vault (~1.42M crvUSD of assets, of which Flex's market holds ~7.9%) over Curve's [crvUSD](https://etherscan.io/address/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E). Same structural shape as the ysyBOLD leg — a Yearn vault wrapping a third-party CDP stablecoin — and **neither the vault nor Curve/crvUSD has a report in this repository**.
  - **yvWETH-2** ([`0xAc37729B76db6438CE62042AE1270ee574CA7571`](https://etherscan.io/address/0xAc37729B76db6438CE62042AE1270ee574CA7571)) is a Yearn V3 (v3.0.2) WETH vault under Yearn's `RoleManager` (category 2), holding 1,531.58 WETH, of which Flex's market holds ~23.6%. It is a leveraged-yield vault rather than a plain lender. Its debt is split across four strategies:
    - [Spark wstETH to yvUSD Lender Borrower Accumulator](https://etherscan.io/address/0x13f6Cb609959a43c3bE29407766A683b42e26D28): 924.82 WETH (60.6%).
    - [wstETH/WETH Spark Looper](https://etherscan.io/address/0x68A14629cb07c74259f481382fE8b6cFD8970121): 270.25 WETH (17.7%).
    - [Spark WETH/USDS (yvUSD) Lender Borrower](https://etherscan.io/address/0x5E8A9Acd00AdCED69b30D36929CbF7D4d4F9AE1F): 170.23 WETH (11.2%).
    - yvWETH-1: 160.37 WETH (10.5%), assessed in [`yearn-yvweth.md`](./yearn-yvweth.md).

    The two lender-borrower strategies post wstETH or WETH on Spark, borrow USDS and deposit it into yvUSD through the [USDS to USD yVault Convertor](https://etherscan.io/address/0x7a716dA432531c0DCeC0F4915d877631AA258fa3). So ~72% of yvWETH-2 carries Spark liquidation risk, Lido wstETH risk and **yvUSD** exposure — the same vault that collateralizes the yvUSD/USDC market. **yvWETH-2 itself has no report in this repository.** The two markets remain separate Lenders, so a yvUSD loss would reach each market's lenders only through that market's own collateral.
- **Ratios:** MCR = **110%**, "safe" CR = **120%**, max-penalty CR = **105%**, minimum liquidation fee 0.5%, maximum 5%. Identical across all markets. Minimum debt is 500 USDC in the USDC markets and 0.1 WETH in the WETH market. `repay_cooldown` is 10 minutes in the yvUSD and yvWETH-2 markets and 1 hour in the ysyBOLD and yvcrvUSD-2 markets.
- **Liquidations:** Onchain and permissionless. Below MCR, anyone can liquidate; the fee scales linearly with shortfall. If seized collateral (including fee) exceeds the Trove's collateral, the shortfall is **socialized to lenders** atomically after the protocol fee reserve is consumed. Redemptions Dutch-auction collateral via `dutch_desk.vy` / `auction.vy`: 1-day auctions, 1-minute price steps, starting at 100% of oracle value (100.1% on a re-kick) and stopping at 99%, identically parameterized in all four live markets.
- **Admin control over funds:** The immutable market contracts hold collateral; no admin can withdraw borrower collateral. Daddy (3-of-5 multisig) is each Lender's *management*, the Registry owner, and the recipient of both fee streams in all four markets. It cannot seize collateral or user shares, but it can change Lender parameters, shut a Lender down, change the keeper, set fees, endorse and unendorse markets, and — in the ysyBOLD market — move the oracle's depeg floor (see *Centralization*).
- **Risk curation:** Market parameters (MCR, fees, auction params, oracle) are **fixed at market-deploy time** by the `factory.vy` deploy call and are **immutable** for that market. Adding markets with different parameters or collateral requires a factory deployment plus Daddy endorsement, as happened for all four live markets. The yvWETH-2 market was deployed from the same `Factory` v1.1.0 ([`0xfFc787AD990dA8f73dDA2B971Dce31C0D9d2501F`](https://etherscan.io/address/0xfFc787AD990dA8f73dDA2B971Dce31C0D9d2501F)) and its TroveManager is a clone of the same template.

### Provability

- **Fully onchain and independently verifiable.** Total debt, collateral balance and CR are readable from each `TroveManager`; a Lender's assets are idle USDC plus `TROVE_MANAGER.sync_total_debt()`. Anyone can recompute the backing ratio.
- **Exchange rate / PPS:** Each Lender is a Yearn TokenizedStrategy whose `pricePerShare` (1.007785 on the yvUSD Lender, 1.005018 on ysyBOLD, 1.006003 on yvcrvUSD-2, 1.000689 on yvWETH-2) derives from a **cached `totalAssets`** refreshed when the designated keeper ([`0x52605Bbf…b2f8`](https://etherscan.io/address/0x52605BbF54845f520a3E94792d019f62407db2f8), hard-coded in `LenderFactory`) calls `report()`. Interest accrues continuously in the `TroveManager` but is only priced into shares at report time. Realized profit unlocks over 4 days. This is standard Yearn TokenizedStrategy accounting, not a mispricing bug: profit locking prevents just-in-time capture of accrued interest, and liquidation still calls `lender.disableHealthCheck()` and forces a keeper report in the same transaction.
- **Reporting can be blocked by a pending auction.** `FlexLenderStrategy._harvestAndReport()` reverts while the strategy's last redemption auction is unsettled, so allocator-level accounting pauses until the auction clears or is re-kicked.
- **Oracles:** Each market has its own immutable Vyper oracle; the four live markets use three designs:
  - **yvUSD/USDC:** [`0xDB8DBB6c…7D2e`](https://etherscan.io/address/0xDB8DBB6c0548341Aea85ebAAFa681B4A8c077D2e) wraps a Morpho [`MorphoChainlinkOracleV2`](https://etherscan.io/address/0xC44Ee741C22957e6b3d40022894Eb50e6a7069EF) configured with yvUSD as `BASE_VAULT` and **no price feeds**, so the reported price is yvUSD's own `convertToAssets` rescaled (1.036378 at the snapshot, equal to yvUSD's `convertToAssets`). Appropriate for the pair: yvUSD's underlying asset is USDC and lenders deposit USDC, so there is no separate USDC→USD price-discovery problem — only whether the yvUSD vault correctly reports its own USDC-denominated value, which is a Yearn framework concern covered in [`yearn-yvusd.md`](./yearn-yvusd.md).
  - **yvWETH-2/WETH:** [`0x4E2cAD94…B96C`](https://etherscan.io/address/0x4E2cAD94B2139f03C65B5677A84C2aeAC259B96C) is the same `morpho_oracle.vy` wrapper over a second feedless [`MorphoChainlinkOracleV2`](https://etherscan.io/address/0xcDf094B6Ba4a90A9d6c06F2b8D00D2a74920Cb52) with yvWETH-2 as `BASE_VAULT`; it reads 1.091703, exactly yvWETH-2's `convertToAssets`. Same reasoning as yvUSD: both legs are WETH, so the price is purely the vault's own accounting. That accounting includes the lender-borrower and looper strategies described under *Collateralization*.
  - **ysyBOLD/USDC:** [`0x40556811…AE65`](https://etherscan.io/address/0x405568114Ee8058d0ca1Bbe95DA1f929279BaE65) converts ysyBOLD → yBOLD → BOLD through the two vaults' exchange rates, then prices BOLD/USDC off the **Curve BOLD/USDC pool's EMA oracle** ([`0xEFc65163…4B3E`](https://etherscan.io/address/0xEFc6516323FbD28e80B85A497B65A86243a54B3E), 1.0036 at the snapshot; 0.99 floor currently disabled). The BOLD/USDC leg is **capped at 1.01**, and a 0.99 floor applies unless Daddy sets `set_depeg_mode(true)`. **Daddy set it to `true` on August 24, 2026** and `depeg_mode()` still reads `true` at the snapshot (no `DepegModeSet` event since), so the floor is currently lifted and the oracle tracks a real BOLD depeg downward — the lender-protective configuration. The residual governance risk is symmetric: the same key can switch the floor back on, at which point a depegging market would again be valued at 0.99.
  - **yvcrvUSD-2/USDC:** [`0x01821e20…a8B2`](https://etherscan.io/address/0x01821e20e102A9c9878298fde6b87B1885Baa8B2) converts yvcrvUSD-2 → crvUSD through the vault rate and prices crvUSD/USDC off the **Curve USDC/crvUSD pool's EMA oracle** ([`0x4DEcE678…d69E`](https://etherscan.io/address/0x4DEcE678ceceb27446b35C672dC7d61F30bAD69E), 0.99897 at the snapshot). This design is **capped at 1.01 with no floor and no privileged switch at all**, so it recognizes a crvUSD depeg without needing anyone to act. The current sub-par reading is passed straight through to Trove CRs.
  - **Oracle code is reviewed, not yet merged.** The ysyBOLD and yvcrvUSD-2 oracles are Etherscan source-verified. They live on open pull requests ([#22](https://github.com/flexmeow/flex-contracts/pull/22), open since August 11, and [#23](https://github.com/flexmeow/flex-contracts/pull/23), open since August 21) rather than on `flex-contracts` `master`. Both were reviewed by Yearn security and Zero Cool. Dedaub's August audit scoped `auction.vy`, `factory.vy`, `Lender.sol`, `LenderFactory.sol`, `leverage_zapper.vy` and `trove_manager.vy`, so these oracles were outside that particular engagement — they are not unaudited live pricing code.
- **Third-party verification:** None beyond direct onchain reads (no Chainlink price feed on any live market, no PoR, no custodian).

## Liquidity Risk

- **Exit is permissionless via `FlexExitRouter`.** Lenders keep idle cash near zero by design — capital stays deployed in Troves. `FlexLenderStrategy.availableWithdrawLimit()` returns **$0 on the yvUSD leg**, $17,594 on ysyBOLD, $798 on yvcrvUSD-2 and 0.072 WETH on yvWETH-2, which is not a gate on user exit. A user routes through the `FlexExitRouter`, which delivers any idle cash atomically and the remainder asynchronously as the redemption auction is taken. Yearn SMS `forceFreeFunds` is an optional management unwind, not a requirement for depositors to leave. Of `yvFlexUSDC`'s $1,118,643, **$212,584 (19.0%) sits in the non-Flex Sky USDS strategy** and is instantly withdrawable as cash; the Flex legs exit through the router instead. `yvFlexWETH` has no non-Flex leg.
- **Depth:** TVL is small (~$1.94M) and depositor concentration is extreme (90.8% of `yvFlexUSDC` is the Yearn Treasury; 96.8% of `yvFlexWETH` is the yETH Recovery Vault). There is no external DEX market for `ysUSDC` or `ysWETH`. Exit relies on the protocol's redemption machinery — the 60 `RedeemTrove` events since September 7 show it working in every live market — against $1,041,479 of pledged collateral in the three USDC markets (and $846,979 in the WETH market), and on the collateral vaults' own exit liquidity. Each market's auction can only be taken in its own collateral.
- **Stress behavior:** Auctions run 1 day with 1-minute steps, starting at 100% of oracle value and stopping at 99%, so a taker willing to redeem the collateral vault share for its underlying can clear near par in benign conditions. Under stress the same auction becomes the throttle: redemptions and liquidations can deliver less than 1:1, bad debt is socialized to lenders, and `_harvestAndReport` is blocked while an auction remains unsettled.
- **Same-value assets:** Every market's collateral and borrow token share a denomination (USD or ETH), so modest exit delays carry limited directional price risk. In the ysyBOLD and yvcrvUSD-2 markets that holds only while BOLD and crvUSD hold their pegs; both oracles now track a depeg downward, so the price feed will register it rather than mask it. Redeeming yvWETH-2 for WETH depends on that vault unwinding Spark lender-borrower and looper positions, so in an ETH stress event its own exit liquidity could slow auction takers.

## Centralization & Control Risks

### Governance

- **Core market contracts are immutable.** Each market's TroveManager, SortedTroves, DutchDesk and Auction are **EIP-1167 minimal clones** of fixed implementations held by `Factory` v1.1.0 — the yvUSD and yvcrvUSD-2 TroveManagers, for instance, are byte-identical clones of [`0x41D491d2…39cE`](https://etherscan.io/address/0x41D491d261ad0D34bBFFFb3e2098f57beC4139cE). The implementation address is baked into the clone bytecode and both EIP-1967 slots read zero, so there is **no admin and no upgrade path**. The Lenders and `FlexLenderStrategy` instances are non-upgradeable Yearn TokenizedStrategy clones. Every deployed contract in the stack is source-verified on Etherscan.
- **But there *is* privileged control — the protocol's "no admin keys" claim is false.** The [risks page](https://flexmeow.com/risks) still states that Flex has *"no admin keys, no privileged users, and no ability to pause, upgrade, or modify"* the protocol after deployment. This holds only for the immutable market mechanics. Onchain, a **`Daddy` contract** ([`0x4e8341C7…8290`](https://etherscan.io/address/0x4e8341C77c94cCE982AB96d92BB28D69f4638290)) — a generalized arbitrary-`execute` owner — holds real powers:
  - It is each **Lender's `management`** (can `setDepositLimit`, `setPerformanceFee`, `setPerformanceFeeRecipient`, `setKeeper`, `setProfitMaxUnlockTime`, and `shutdownStrategy`),
  - It is the **Registry owner** (can `endorse`/`unendorse` markets — exercised three times on August 24, 2026 and again on September 17),
  - It is the **`performanceFeeRecipient`** on all four live Lenders, collecting the live 10% lender performance fee and the borrower upfront fees,
  - It is the sole caller of **`set_depeg_mode`** on the ysyBOLD oracle, a switch that changes how collateral in a live market is valued; it currently reads `true`, the lender-protective setting.
- **Note on emergency withdrawal:** `Lender.sol` does **not** override `_emergencyWithdraw`, so the inherited Yearn default is a **no-op** — Daddy *cannot* pull a Lender's deployed assets out of its market. Its emergency lever is limited to `shutdownStrategy` (blocks new deposits; existing lenders can still withdraw through the normal redemption path). The `FlexLenderStrategy` *does* implement `_emergencyWithdraw`, but that strategy is controlled by Yearn SMS, not Daddy.
- **Daddy is owned by a 3-of-5 Safe multisig** ([`0x687b82dA…3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67), Safe v1.4.1). The threshold was raised from 2 to 3 on June 24, 2026 (block 25388899) and a fifth owner added on August 13, 2026 (block 25747928). The owner set and threshold at the snapshot match the set recorded after that change, and the Safe emitted no owner or threshold events afterwards. Signers are pseudonymous; one of them is also the EOA that deployed the markets, oracles and allocator contracts.
- **No timelock** sits in front of Daddy. A 3-of-5 threshold is a meaningful improvement over the 2-of-4 it replaced, but there is still no delay between a signed transaction and its effect — including for market endorsement and the ysyBOLD depeg switch.
- **Yearn-side control:** Both allocator vaults now sit under Yearn's standard [`RoleManager`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41). `yvFlexUSDC` accepted it on September 8, 2026 ([tx](https://etherscan.io/tx/0xddff074807d813fbc600b0d42c23b457da751d422488926ee8971e17541c0d73)) and `yvFlexWETH` on September 25, 2026 ([tx](https://etherscan.io/tx/0x27144919a3b6fc636c9dc0ed2369b82f9cf03c949018ca51979d30010232d788)); both are registered as category 420. The vault roles are distributed the standard way:
  - The **Yearn 7-day TimelockController** ([`0x88ba032be87d5eF1FbE87336B7090767F367BF73`](https://etherscan.io/address/0x88ba032be87d5eF1FbE87336B7090767F367BF73), `getMinDelay() = 604800`) holds `ADD_STRATEGY`, `REVOKE_STRATEGY`, `FORCE_REVOKE`, `ACCOUNTANT_MANAGER` and `MAX_DEBT_MANAGER`. Routing a vault into a new strategy therefore now takes a week.
  - **yChad** ([`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52)) holds every role except `ADD_STRATEGY` and `ACCOUNTANT_MANAGER`.
  - The **Yearn Strategist MultiSig (SMS / Brain, [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7))** holds the revoke, queue, reporting, debt, deposit-limit, profit-unlock, debt-purchaser and emergency roles.
  - Yearn security ([`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0)) holds the emergency, max-debt and debt roles.
  - The debt allocator ([`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671)) holds the reporting and debt roles; the yHaaS keeper ([`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E)) holds reporting only.

  SMS is `management` on all four `FlexLenderStrategy` instances; Yearn security is `emergencyAdmin` on the WETH strategy. Daddy cannot seize lender shares or borrower collateral; its worst case is parameter abuse, fee extraction, lender shutdown, oracle-floor manipulation on the ysyBOLD market, and endorsing a malicious new market.

### Programmability

- **Highly programmatic.** Borrowing, interest accrual, redemptions, liquidations and auctions are all onchain, and share price is computed onchain from `idle + sync_total_debt`.
- **Keeper dependency:** Lender accounting (`report()`) is driven by a **designated keeper** hard-coded in `LenderFactory`; the Yearn allocator and strategies use Yearn's **yHaaS keeper**. Share price refreshes at report time, with profit unlocking over 4 days — intended TokenizedStrategy accounting.
- **Callback surface:** v2 hands control to `troveCallback` and `takeCallback` receivers mid-operation — during borrow, during leverage, and during liquidation. This is deliberate design that enables swapless looping and lender-side auction takes.
- **Management-gated liquidity:** `forceFreeFunds` and `deployIdleFunds` on the allocator strategy are `onlyManagement`. Users exit through the `FlexExitRouter` without that call; Yearn SMS uses `forceFreeFunds` when it wants to unwind a position as curator.

### External Dependencies

- **yvUSD** — collateral and price source for the largest market. A yvUSD loss (strategy underperformance, strategy-level exploit, or a bridge/CCTP failure) flows directly into Flex solvency. yvUSD *depeg* vs USDC is not a distinct risk: yvUSD's underlying asset is USDC and Flex lenders deposit USDC, so only yvUSD correctly reporting the USDC value of its positions matters. Assessed in [`yearn-yvusd.md`](./yearn-yvusd.md).
- **ysyBOLD → yBOLD → BOLD → Liquity V2** — collateral for the second market, a three-layer chain terminating in a protocol **Yearn has not assessed**. Unlike yvUSD this introduces real USD price discovery: BOLD is a CDP stablecoin, not USDC.
- **yvcrvUSD-2 → crvUSD → Curve** — collateral for the third market. A publicly-listed Yearn V3 vault over Curve's crvUSD; **neither the vault nor crvUSD has a report in this repository**.
- **yvWETH-2 → Spark lender-borrower / looper strategies → Spark, Lido wstETH, yvUSD** — collateral for the WETH market. A Yearn-managed vault that is **not assessed in this repository**. It concerns only `ysWETH` lenders: the yvUSD/USDC Lender assessed here has no claim on, or exposure to, the WETH market. Its yvUSD leg means a yvUSD loss would hit two Flex markets at once, each through its own collateral.
- **Curve pools as price sources** — the BOLD/USDC pool ([`0xEFc65163…4B3E`](https://etherscan.io/address/0xEFc6516323FbD28e80B85A497B65A86243a54B3E)) and the USDC/crvUSD pool ([`0x4DEcE678…d69E`](https://etherscan.io/address/0x4DEcE678ceceb27446b35C672dC7d61F30bAD69E)) are the sole price inputs for two of the four live markets, read through their EMA `price_oracle`. The EMA smoothing and the 1.01 caps bound manipulation impact; the ysyBOLD oracle's 0.99 floor is currently disabled.
- **Morpho `MorphoChainlinkOracleV2`** — the yvUSD and yvWETH-2 markets' price paths each run through an immutable, feedless instance of this Morpho contract. Well-audited and configured feedless, but an added link in the chain.
- **Yearn V3 / TokenizedStrategy framework** — the Lenders, strategies and allocator vault inherit Yearn's audited base contracts; a framework-level bug would affect Flex.
- **USDC** — the borrow token in the three USDC markets (Circle centralization/freeze risk, standard). The WETH market borrows canonical WETH.
- **infiniFi siUSD / iUSD** — collateral for a market that was deployed, never funded, and unendorsed on August 24, 2026. Assessed in [`infinifi.md`](./infinifi.md). Not a live exposure.
- No L2 or bridge dependency on the Flex side; yvUSD's CCTP bridging is yvUSD's own dependency.

## Operational Risk

- **Team:** Pseudonymous. The lead developer is **`johnnyonline` / `johnny.flexmeow.eth`**, an active contributor in the Yearn ecosystem (the protocol reuses Yearn's TokenizedStrategy, SMS, yHaaS and Vault Factory).
- **Documentation:** User-facing docs are clear on mechanics and were updated for the v2 fee model (upfront fee to protocol as first-loss buffer, 10% lender performance fee). However, there is **no governance or ownership documentation** and the docs do not list the live markets. The [risks page](https://flexmeow.com/risks) still states, as of October 27, 2026, that there are "no admin keys, no privileged users, and no ability to pause, upgrade, or modify the protocol after deployment". That contradicts the onchain reality: Daddy collects both fee streams, endorses markets, and holds a switch that changes how a live market values its collateral.
- **Development transparency:** The allocator layer is public in [`flexmeow/flex-allocator`](https://github.com/flexmeow/flex-allocator), including its deployment broadcasts for the WETH vault and strategy, and both August audits were published to the core repo, including the Zero Cool report. Upcoming markets are developed in the open as oracle pull requests before deployment.
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
| Lender `ysWETH` — yvWETH-2/WETH | [`0x0d57098e501D68905fC4B0A3397f7D4Aa4889E36`](https://etherscan.io/address/0x0d57098e501D68905fC4B0A3397f7D4Aa4889E36) | same as the USDC Lenders |
| TroveManager — yvWETH-2/WETH | [`0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C`](https://etherscan.io/address/0xEe27D81Bd4f54bA978e5dC0C335fC25C00e8334C) | same as the USDC TroveManagers |
| Price Oracle — yvWETH-2→WETH (Morpho wrapper) | [`0x4E2cAD94B2139f03C65B5677A84C2aeAC259B96C`](https://etherscan.io/address/0x4E2cAD94B2139f03C65B5677A84C2aeAC259B96C) | `get_price()` vs yvWETH-2 `convertToAssets`; abnormal moves |
| Registry | [`0x9117440a7D03238905d1C8908157Bd7a547c77c8`](https://etherscan.io/address/0x9117440a7D03238905d1C8908157Bd7a547c77c8) | `EndorseMarket`/`UnendorseMarket` — new market risk |
| Daddy (protocol owner) | [`0x4e8341C77c94cCE982AB96d92BB28D69f4638290`](https://etherscan.io/address/0x4e8341C77c94cCE982AB96d92BB28D69f4638290) | `OwnershipTransferred`; any `execute` call |
| Daddy owner Safe (3/5) | [`0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67) | signer/threshold changes |
| yvFlexUSDC allocator vault | [`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`](https://etherscan.io/address/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8) | Yearn-side roles, debt allocation, deposit limit |
| yvFlexWETH allocator vault | [`0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F`](https://etherscan.io/address/0xfaC55fAFD0b55BFb8dD41F735EfCc195adA9891F) | same; yETH Recovery Vault share |
| FlexLenderStrategy — yvWETH-2 | [`0x7E4a6A89583e117C641aB3ce8897209800A3F2E3`](https://etherscan.io/address/0x7E4a6A89583e117C641aB3ce8897209800A3F2E3) | same as the USDC strategies |
| FlexLenderStrategy — yvUSD | [`0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b`](https://etherscan.io/address/0x7501EAE6b5C2Cb0A6EDAC908E3A679B20eDd737b) | `availableWithdrawLimit`, `ForceFreeFunds`, pending auction, health-check losses |
| FlexLenderStrategy — ysyBOLD | [`0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176`](https://etherscan.io/address/0xDd58AeFE74585DA2C7Ad3D3dF0F3aeEAb05b5176) | same |
| FlexLenderStrategy — yvcrvUSD-2 | [`0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d`](https://etherscan.io/address/0xC818A0Be1BB2cE820CfdefAD5f890667e885f39d) | same |
| FlexExitRouter | [`0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD`](https://etherscan.io/address/0xe8a511403B0C83e7b85513e00Ed39996B48c2aeD) | permissionless user exit with a proceeds receiver |
| Collateral yvUSD | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS, see `yearn-yvusd.md` triggers |
| Collateral ysyBOLD | [`0x23346B04a7f55b8760E5860AA5A77383D63491cD`](https://etherscan.io/address/0x23346B04a7f55b8760E5860AA5A77383D63491cD) | PPS; and BOLD peg via the Curve pool |
| Collateral yvcrvUSD-2 | [`0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F`](https://etherscan.io/address/0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F) | PPS; and crvUSD peg via the Curve pool |
| Collateral yvWETH-2 | [`0xAc37729B76db6438CE62042AE1270ee574CA7571`](https://etherscan.io/address/0xAc37729B76db6438CE62042AE1270ee574CA7571) | PPS, strategy losses, Spark lender-borrower health, yvUSD PPS |

**Existing monitoring coverage (verified October 27, 2026).** [`yearn/monitoring-scripts-py`](https://github.com/yearn/monitoring-scripts-py) has **no Flex-specific monitor** at `main` commit [`65599b6`](https://github.com/yearn/monitoring-scripts-py/commit/65599b6c58174a6ab90c2dbc34405889dd41e39a). None of the Flex protocol addresses above appear in it: Registry, Daddy, Daddy Safe, TroveManagers, Lenders and oracles. Coverage today is indirect and Yearn-side only:

- Both allocator vaults are indexed in Kong as Yearn V3 vaults (`vaultType: 1`, `yearn: true`), so the generic Yearn **Large Flows** monitor applies to them: deposits or withdrawals ≥ $500K on mainnet. It sees only flows larger than ~45% of `yvFlexUSDC`. The **Small Parent Vault Flows** monitor also applies.
- Strategy additions and accountant changes on both vaults now go through the Yearn 7-day timelock, which the Yearn **Timelock Events** monitor covers. Yearn-side Safe queues are covered by the **Safe Multisigs** monitor.
- Nothing watches Trove CRs, bad debt, Lender losses, Flex oracle prices, `depeg_mode`, market endorsements, or the Daddy Safe. The values and thresholds below are recommendations to implement, not existing alerts.

**Critical values / events & thresholds:**

- **Backing ratio** per market = (pledged Trove collateral × oracle price) / `sync_total_debt()`. Use interest-accrued debt (`sync_total_debt()`, `get_trove_debt_after_interest()`), not stored `trove.debt`, and count only collateral pledged against Troves. `collateral_balance` includes residue in fully-redeemed Troves and overstates the ratio: 130.90% versus a true 126.70% in the ysyBOLD market today. Markets run close to the 110% MCR by design, so a static 112% alert would fire continuously. Alert if a market's **backing CR < 110.5%**; page if **< 110%**, on any `BadDebt` event, or on a Lender `Reported` event with non-zero loss. The book-wide debt-weighted CR is 116.81%, with 19.0% of debt below 111%.
- **Liquidation backlog** (lender-loss early warning): any single Trove with CR **below 105%** (the max-penalty CR) that stays unliquidated for more than one hour. Below that level the fee no longer grows and the remaining buffer before bad debt is thin. The share of a market's debt in Troves below 110.5% CR is a *borrower-liquidation* signal, not a lender-loss one. It sits at 79.8% in the yvcrvUSD-2 market today because looped Troves open near 110.3%, so report it daily rather than paging on it.
- **Idle liquidity** = idle cash in the Lender and in the strategy. It stays near zero by design (capital stays deployed). Users exit via `FlexExitRouter`; track `FlexLenderStrategy.availableWithdrawLimit(vault)` as an idle-cash signal, not as a binary "can exit" flag.
- **First-loss buffer**: `unclaimed_protocol_fees` per market. Alert if it falls relative to debt, or if a borrow-side operation collects a materially below-average upfront fee (the A1 suppression path).
- **Oracle:** `get_price()` deviating from the underlying vault rates; **any `DepegModeSet` event** — in particular a switch back to `false`, which would restore the 0.99 floor and let the ysyBOLD market over-value collateral during a depeg; BOLD/USDC or USDC/crvUSD moving off peg on their Curve pools.
- **Governance:** any `Daddy.execute`, ownership transfer, Safe signer/threshold change, performance-fee change, `setKeeper`, Lender shutdown, or new `EndorseMarket`. The Daddy Safe is the cheapest high-value addition: it is a single address, and every privileged Flex action passes through it.
- **Recommended frequency:** backing ratio, liquidation backlog, idle liquidity and withdraw limit **hourly**; governance, registry, `BadDebt` and depeg-mode events **real-time**; collateral vault PPS **daily**.

Onchain reads: `Lender.totalAssets()`, `Lender.pricePerShare()`, `TroveManager.sync_total_debt()`, `TroveManager.get_trove_debt_after_interest(id)`, `TroveManager.collateral_balance()`, `SortedTroves.size()/first()/next(id)`, `TroveManager.troves(id)`, `TroveManager.unclaimed_protocol_fees()`, `Oracle.get_price()`, `ysybold_oracle.depeg_mode()`, `Registry.get_all_markets()`, `FlexLenderStrategy.availableWithdrawLimit(vault)`, `Daddy.owner()`, Safe `getOwners()/getThreshold()`.

## Appendix: Contract Architecture

```
             USER / YEARN DEPOSITOR (USDC)                       YEARN yETH RECOVERY VAULT (WETH, 96.8%)
                        │ deposit                                              │ deposit
                        ▼                                                      ▼
   ┌───────────────────────────────────────────────────────┐   ┌──────────────────────────────────┐
   │  yvFlexUSDC — Yearn V3 allocator vault  $1,118,643     │   │  yvFlexWETH — allocator vault     │
   │  0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8            │   │  0xfaC55fAF…891F   310.14 WETH    │
   └───────────────────────────────────────────────────────┘   └──────────────────────────────────┘
     role_manager (both): Yearn RoleManager 0xb3bd6B2E…9a41 · add-strategy via 7-day timelock
        │ 54.0%          │ 18.0%          │ 9.0%           │ 19.0%                 │ 100%
        ▼                ▼                ▼                ▼                       ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────────┐     ┌────────────┐
  │ FlexLender │  │ FlexLender │  │ FlexLender │  │ USDC → SKY USDS  │     │ FlexLender │
  │ Strategy   │  │ Strategy   │  │ Strategy   │  │ 0xfb4F83c3…F95e  │     │ Strategy   │
  │ 0x7501EAE6…│  │ 0xDd58AeFE…│  │ 0xC818A0Be…│  │ (not a Flex leg) │     │ 0x7E4a6A89…│
  └────────────┘  └────────────┘  └────────────┘  └──────────────────┘     └────────────┘
        │ deposit        │ deposit        │ deposit                                │ deposit
        ▼                ▼                ▼                                        ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐                           ┌────────────┐
  │ Lender     │  │ Lender     │  │ Lender     │                           │ Lender     │
  │ yvUSD/USDC │  │ysyBOLD/USDC│  │ yvcrvUSD-2 │                           │ yvWETH-2   │
  │ 0xD93Dade7…│  │ 0xf4996Ca4…│  │ 0xc1f281A3…│                           │ 0x0d57098e…│
  │ $605,486   │  │ $201,122   │  │ $100,712   │                           │ 310.24 WETH│
  └────────────┘  └────────────┘  └────────────┘                           └────────────┘
   ASSESSED TOKEN (left) · every Lender: management + perf-fee recipient = Daddy, 10% fee,
   keeper 0x52605Bbf…b2f8, profit unlock 4 days, deposit limit $2M (10,000 WETH on ysWETH)
        │ lends borrow token / redeem()
        ▼
   ── PROTOCOL LAYER (EIP-1167 clones of immutable templates; Factory v1.1.0) ─────────────────
     yvUSD/USDC          ysyBOLD/USDC         yvcrvUSD-2/USDC      yvWETH-2/WETH
       TroveManager        TroveManager         TroveManager         TroveManager
       0x8ee72c38…83c9     0xADf4E022…Fc6E      0x7582b474…eA2E      0xEe27D81B…334C
       SortedTroves        SortedTroves         SortedTroves         SortedTroves
       0xB3770984…c6F7     0x268C2F12…C17b      0x32aB7094…d1a2      0x6e8354f6…5f8D
       DutchDesk           DutchDesk            DutchDesk            DutchDesk
       0xa22C420E…9211     0x8e5C69f8…2A6D      0x26f652aC…edae      0x6ddE4736…C11d
       Auction             Auction              Auction              Auction
       0x9bF027D9…7D56     0x068C6c7E…1e73      0xaA8C7040…795c      0x7361aa9d…BE1C
       PriceOracle         PriceOracle          PriceOracle          PriceOracle
       0xDB8DBB6c…7D2e     0x40556811…AE65      0x01821e20…a8B2      0x4E2cAD94…B96C
         └─ Morpho oracle    └─ Curve BOLD/USDC   └─ Curve USDC/crvUSD └─ Morpho oracle
            0xC44Ee741…69EF     0xEFc65163…4B3E      0x4DEcE678…d69E      0xcDf094B6…Cb52
            (BASE_VAULT=yvUSD,  (cap 1.01; floor     (cap 1.01, no floor, (BASE_VAULT=yvWETH-2,
             no feeds)           0.99 currently off)  no admin switch)     no feeds)
       CR 114.97% · 9      CR 126.70% · 6       CR 112.28% · 6       CR 116.47% · 9
     ── shared factories / registry / periphery ──
       Factory v1.1.0   0xffc787ad…501f      LenderFactory   0x98f678aa…B856
       TM template      0x41D491d2…39cE      Registry        0x9117440a…77c8
       StrategyFactory  0x1792348F…8252      FlexExitRouter  0xe8a51140…2aeD
   ── UNDERLYING LAYER ────────────────────────────────────────────────────────────────────────
       yvUSD      0x696d02Db93291651ED510704c9b286841d506987  (Yearn V3 USDC vault)
       ysyBOLD    0x23346B04a7f55b8760E5860AA5A77383D63491cD  → yBOLD → BOLD (Liquity V2)
       yvcrvUSD-2 0xBF319dDC2Edc1Eb6FDf9910E39b37Be221C8805F  → crvUSD (Curve)
       yvWETH-2   0xAc37729B76db6438CE62042AE1270ee574CA7571  → Spark LB / looper (wstETH, USDS → yvUSD), yvWETH-1
       USDC       0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48  (borrow token, USDC markets)
       WETH       0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2  (borrow token, WETH market)
   ── GOVERNANCE ──────────────────────────────────────────────────────────────────────────────
       Daddy (arbitrary execute)  0x4e8341C77c94cCE982AB96d92BB28D69f4638290
         └─ owner: Safe 3/5        0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67
       Yearn RoleManager           0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41
       Yearn 7-day timelock        0x88ba032be87d5eF1FbE87336B7090767F367BF73
       Yearn SMS (strategy mgmt)   0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7
```

Two markets were unendorsed on August 24, 2026 and carry no live exposure: the **retired v1 yvUSD/USDC** market (TroveManager [`0xd82DB989…2e49`](https://etherscan.io/address/0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49), a zombie Trove holding 24,308.75 yvUSD (~$25,193) against 147 wei of debt) and the never-funded **siUSD/USDC** market (TroveManager [`0x484E3c28…C09D`](https://etherscan.io/address/0x484E3c28A99282Ce0682f65A5F902876f370C09D)).

**Trust boundaries:** Borrower collateral is held by non-upgradeable TroveManager clones — no admin withdrawal path. Daddy (3-of-5 multisig, no timelock) controls Lender parameters, both fee streams, market endorsement and unendorsement, and the ysyBOLD oracle's depeg floor, but cannot seize funds. End users deposit through the Yearn allocator vaults, governed by Yearn's RoleManager with strategy additions behind a 7-day timelock; they do not lend directly to Flex markets. Markets are isolated from each other. The most concentrated risks are four single-asset collateral markets, each priced by a feed that ultimately reads the collateral's own vault accounting.

---

## Risk Summary

### Key Strengths

- **Immutable core protocol** — every market is an EIP-1167 clone of a fixed template with no admin and no upgrade path; market parameters are set at deploy, and every deployed contract is source-verified.
- **A clean audit on the deployed upgrade** — Dedaub's August 5 review of the v1.1/v2 changes (three auditors, six contracts) found **no Critical, High, Medium or Low** issues. Subsequent Zero Cool findings were reviewed by Yearn security and are not treated as open blockers.
- **Users lend through the Yearn allocators, not directly to markets.** Direct Lender depositors would bear curator-style risk; `yvFlexUSDC` and `yvFlexWETH` depositors take Yearn's allocation decisions instead.
- **Growing, loss-free production record** — TVL rose 78% to ~$1.94M as Yearn funded the WETH market. Through September 7 – October 27 the redemption path ran 60 times and one liquidation cleared, with no `BadDebt` event and no reported Lender or strategy loss.
- **Permissionless exit via `FlexExitRouter`** — Lenders stay essentially fully deployed by design; anyone can still exit at any time through the router.
- **Governance used in the lender's favour** — the controlling Safe is **3-of-5**, and on August 24 Daddy retired two dead markets and lifted the ysyBOLD oracle's artificial 0.99 price floor, the configuration that lets a real BOLD depeg register. Its powers remain non-custodial: it cannot seize borrower collateral or lender shares.
- **Alike-asset over-collateralization** — USD vault shares vs USDC borrow and a WETH vault share vs WETH borrow, with a book-wide debt-weighted collateral ratio of 116.81% on interest-accrued debt and pledged collateral only. Running near a 110% MCR is the intended looping design.
- **Fully onchain, verifiable** — backing is recomputable by anyone from `total_debt` and `collateral_balance`; **no privileged minter** exists on the lending token.
- **Transparency improved** — the allocator layer is a public repository, and both August reviews were published.
- **Yearn-grade integration layer** — both allocator vaults sit under Yearn's standard `RoleManager`, with strategy additions behind the 7-day Yearn timelock; strategies are managed by Yearn SMS and kept by yHaaS.

### Key Risks

- **A Daddy-controlled oracle floor remains switchable.** The ysyBOLD oracle's 0.99 floor is currently disabled, which is the safe setting, but the same 3-of-5 key can re-enable it with no timelock — at which point a depegging market would again be valued at 0.99.
- **A 3-of-5 multisig with no timelock**, which the rubric places at the second-riskiest governance tier, controls Lender parameters, both fee streams, market endorsement and the ysyBOLD oracle switch. Its powers are non-custodial, but nothing delays them.
- **Governance overclaim** — the risks page still advertises "no admin keys, no privileged users, no ability to pause, upgrade, or modify" while Daddy collects both fee streams, endorses and unendorses markets, and holds the depeg switch. The August 24 and September 17 transactions are concrete demonstrations that the surface is live.
- **Deeper, partly unassessed dependency chain** — two of the three USDC collaterals terminate in protocols this repository has not assessed (Liquity V2/BOLD and Curve/crvUSD), and those two markets take their price from a single Curve pool each. The WETH market's collateral, yvWETH-2, is also unassessed; it is a leveraged Spark/Lido strategy mix with a yvUSD leg, though it concerns only `ysWETH` lenders.
- **yvcrvUSD-2 borrowers sit at the liquidation edge.** 79.8% of that market's debt is in Troves between 110.25% and 110.47% CR after the crvUSD EMA slipped to 0.99897. This is a borrower-liquidation risk rather than a lender-loss one, but a further 0.25–0.45% fall in the crvUSD EMA would make most of that book liquidatable.
- **No Flex-specific monitoring exists.** Yearn's monitoring repo covers only the allocator vaults' flows and Yearn-side timelock/Safe actions; Trove CRs, bad debt, oracle state and the Daddy Safe are unwatched.
- **Headline CR can be misread.** The ysyBOLD market's naive collateral-to-debt ratio reads 130.90% because $7,716 of collateral sits in fully-redeemed Troves that back no debt — its true backing ratio is 126.70%. Monitoring must use pledged collateral.

### Critical Risks `[If Any]`

- No standalone fund-loss critical was identified. A collateral impairment in an underlying vault would still socialize bad debt to lenders after the small first-loss reserve is consumed; that is the protocol's designed loss path, not a hidden one.

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

**Subcategory A: Audits & Security Reviews** — Coverage is broad (six reviews) and the most recent human audit of the deployed upgrade is exemplary: Dedaub found nothing above advisory severity. Yearn security reviewed the subsequent Zero Cool agent report and judged **most items invalid**, with the rest low/info or intended Yearn TokenizedStrategy behavior (cached PPS, profit unlock). The ysyBOLD and yvcrvUSD-2 oracles were reviewed by Yearn security and Zero Cool even though those PRs are unmerged. The allocator is a Yearn V3 strategy, reviewed internally and by Zero Cool — it does not need a separate protocol audit. There is **no bug bounty** on a complex, callback-heavy surface. → **2**

**Subcategory B: Historical Track Record** — The protocol has been in production ~5.5 months (first core contracts May 12, 2026) and the v1.1 code ~12 weeks; the newest market, yvWETH-2/WETH, is six weeks old. That places it in the rubric's **3–6 months** row. TVL of ~$1.94M is in the **<$10M** column of the same row. The record is clean and now exercised: 60 redemptions, one liquidation without bad debt, and no reported loss on any Lender or strategy since September 7. TVL grew 78%, but the growth is Yearn's own capital — the Treasury holds 90.8% of `yvFlexUSDC` and the yETH Recovery Vault 96.8% of `yvFlexWETH` — so it is not yet evidence of external demand. → **4**

**Audits & Historical Score = (2 + 4) / 2 = 3.0**

**Score: 3.0/5** — Strong audit breadth on the v2 upgrade and a growing, loss-free record, offset by a still-short production history, small TVL and no bug bounty.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance** — The rubric's row 4 reads *"Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints"*, and Flex matches it on every axis: a **3-of-5 Safe with no timelock at all**, holding powerful but bounded roles — Lender parameters, both fee streams, market endorsement and unendorsement, keeper, shutdown, and the ysyBOLD oracle's depeg switch. It does not fall to row 5, which requires an EOA or fewer than three signers together with unlimited admin powers; Daddy cannot seize collateral or lender shares, and the market contracts are immutable clones. The August 24 and September 17 transactions confirm the surface is live rather than theoretical — four registry actions and an oracle-parameter change, all effective on signature. The choices made were sane and lender-protective, but that is evidence about the operators, not about the control structure, which still permits the reverse. Docs continue to deny that any of it exists. → **4**

**Subcategory B: Programmability** — Borrowing, interest, redemptions, liquidations and auctions are fully onchain. Share price is computed onchain from `idle + sync_total_debt`, with cached PPS and 4-day profit unlock as **intended** Yearn TokenizedStrategy accounting, not a keeper-chosen mispricing window. The designated Lender keeper is a hard-coded address. Users exit through the `FlexExitRouter` without a management call. → **1**

**Subcategory C: External Dependencies** — Three USDC-market collaterals. yvUSD (the assessed market) is a Yearn-assessed, USDC-denominated vault priced through an immutable Morpho oracle — a well-understood dependency. ysyBOLD adds a three-layer chain terminating in **Liquity V2** and yvcrvUSD-2 a two-layer chain terminating in **Curve/crvUSD**, neither assessed in this repository, and each priced off a single Curve pool's EMA. Plus the Yearn V3 framework and USDC. The crvUSD oracle's cap-only, no-switch design offsets the added surface rather than compounding it. The new yvWETH-2/WETH market adds a fourth, unassessed chain (Spark lender-borrower and looper strategies, Lido wstETH, yvUSD). It does not move this score: markets are isolated, so that chain can impair only `ysWETH` lenders, and holders of the assessed `ysUSDC` have no mechanical exposure to it. It is tracked as a monitoring and reassessment item. → **3.5**

**Centralization Score = (4 + 1 + 3.5) / 3 = 2.83**

**Score: 2.83/5** — Immutable mechanics, fully programmatic accounting, and non-custodial powers, held back by a 3-of-5 multisig with no timelock and a dependency chain reaching two unassessed protocols.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization** — Over-collateralized, onchain and real-time verifiable in high-quality DeFi collateral, spread across four markets with a book-wide debt-weighted collateral ratio of 116.81% on interest-accrued debt; the assessed yvUSD market sits at 114.97%. Collaterals are **alike assets** versus their borrow token (USD vault shares vs USDC, a WETH vault share vs WETH), so a 110% MCR and a book near that floor is the intended looping design, not a missing volatility buffer. The yvcrvUSD-2 book clustered at 110.25–110.47% is a liquidation-proximity fact, not a lender-loss one. Liquidations have cleared without bad debt, and the first-loss reserve has tripled to ~$565, though it remains a rounding buffer. Count pledged collateral only — the ysyBOLD market's naive ratio is inflated by $7,716 in fully-redeemed Troves. → **2.5**

**Subcategory B: Provability** — Total debt, collateral and Lender assets are readable directly and the backing ratio is recomputable by anyone, with no offchain reserve or admin reporting dependency. Cached PPS plus profit unlock is standard Yearn TokenizedStrategy reporting. Oracle source for all four markets is Etherscan-verified and reviewed. → **1**

**Funds Management Score = (2.5 + 1) / 2 = 1.75**

**Score: 1.75/5** — Transparent onchain over-collateralization in alike USD assets, with the usual CDP socialization of residual bad debt.

#### Category 4: Liquidity Risk (Weight: 15%)

Lenders keep idle cash near zero **by design**; users exit at any time through the `FlexExitRouter`, which delivers auction proceeds asynchronously. Auctions can clear near par (100% start, 99% floor, 1-day duration) when a taker redeems the collateral vault share for its underlying. Every market's legs share a denomination, which limits price risk over short delays. The redemption machinery has now run 60 times without incident. Depth is still small (~$1.94M across both allocators) and concentrated in Yearn's own capital. The Sky USDS leg ($212,584, 19.0% of `yvFlexUSDC`) is instantly withdrawable cash; it is not the Flex exit path. → **3**

**Score: 3/5** — Auction-mediated but permissionless, with same-value collateral and a 1-day near-par Dutch auction. Small depth is the remaining constraint.

#### Category 5: Operational Risk (Weight: 5%)

Pseudonymous but Yearn-ecosystem-known lead dev; mechanics docs are accurate and were updated for v2; the allocator code and both August audits were published; the August 24 housekeeping (retiring dead markets, disabling the price floor) and the September WETH-market launch were competent operations. Against that: a **misleading "no admin keys" claim** that the onchain role set plainly contradicts, no governance or legal disclosure, and no bug bounty. → **3**

**Score: 3/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 2.83 | 30% | 0.85 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **2.58/5.0** |

**Optional Modifiers:** None apply (protocol < 2 years; TVL not sustained). Final score ≈ **2.58/5.0**.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk** — *Approved with enhanced monitoring*, near the bottom of the band. The remaining constraints are:

- a 3-of-5 multisig with no timelock;
- a dependency chain reaching unassessed protocols (Liquity V2/BOLD and Curve/crvUSD, plus yvWETH-2 for the WETH market);
- a production history that is improving but still under six months;
- a switchable ysyBOLD oracle floor;
- the absence of any Flex-specific monitoring.

These are offset by non-upgradeable market clones, a clean Dedaub audit of the v2 upgrade, a loss-free record through 78% TVL growth, fully programmatic Yearn TokenizedStrategy accounting, permissionless `FlexExitRouter` exits, and transparent onchain over-collateralization in alike assets. Recommend keeping position size limited while TVL is small and Yearn-sourced, implementing the Daddy-Safe, `BadDebt` and backing-CR monitors listed above, and treating a `DepegModeSet` back to `false` as an immediate reassessment.

---

## Reassessment Triggers `[If Applicable]`

- **Time-based:** Reassess in **2 months** (early-stage protocol still adding markets).
- **Collateralization:** Reassess if any market's **backing CR** (pledged collateral over interest-accrued debt) falls below **110.5%**, if any Trove below **105%** CR remains unliquidated for more than an hour, or if `unclaimed_protocol_fees` is materially depleted. Compute backing CR from pledged collateral only — the naive `collateral_balance / total_debt` ratio is inflated wherever fully-redeemed Troves retain collateral.
- **Oracle / governance switch:** Reassess on any `DepegModeSet` event — in particular a switch back to `false` — if BOLD or crvUSD trades materially off peg on its Curve pool, or if any market's oracle design changes.
- **TVL-based:** Reassess if Flex TVL changes by **>50%** in either direction, if the Yearn Treasury's share of `yvFlexUSDC` or the yETH Recovery Vault's share of `yvFlexWETH` changes materially, if the Flex share of `yvFlexUSDC` exceeds 90%, or if a Lender `depositLimit` is raised.
- **Collateral/market:** Reassess if a **new market is endorsed** (`Registry.EndorseMarket`) — the open locked-yvUSD, sDOLA and siUSD oracle PRs are candidates — if a live market is unendorsed, or if a market is added whose collateral and borrow token are not the same asset class.
- **Liquidity:** Reassess after any `ForceFreeFunds` or ExitRouter exit that realizes a material loss, or if the ExitRouter path is disabled.
- **Governance:** Reassess on any Daddy ownership transfer, Safe signer/threshold change, addition of a timelock, performance-fee change, or keeper change.
- **Incident-based:** Reassess after any bad-debt socialization event, liquidation failure, auction freeze, collateral depeg or loss, or any exploit affecting Flex, Yearn V3, yvUSD, ysyBOLD/yBOLD/Liquity V2, yvcrvUSD-2/Curve, or yvWETH-2 and its Spark/Lido strategies.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 19, 2026](https://github.com/yearn/risk-score/pull/220) | 2.53 | Initial assessment — single yvUSD/USDC market, ~$0.97M TVL, 120.7% system CR, 2-of-4 Daddy Safe |
| [September 7, 2026](https://github.com/yearn/risk-score/pull/425) | 2.67 | Reassessment: v1.1/v2 redeploy — original market retired, Yearn migrated to three Lenders (yvUSD, ysyBOLD, yvcrvUSD-2); upfront fee to protocol and 10% lender performance fee live; Safe 3-of-5; ysyBOLD depeg floor lifted. Scores revised after Flex-expert review: Zero Cool items not treated as open blockers, oracles and allocator reviewed, ExitRouter is the designed permissionless exit, alike-asset CR near MCR is intended. Remaining drivers are governance (3-of-5, no timelock), unassessed Liquity/Curve dependencies, and short track record. |
| [October 27, 2026](https://github.com/yearn/risk-score/pull/563) | 2.58 | Reassessment: TVL ~$1.94M (+78%) after Yearn funded a new yvWETH-2/WETH market (endorsed September 17) through `yvFlexWETH`, 96.8% held by the yETH Recovery Vault; four live markets, 30 Troves, 116.81% book-wide CR, no bad debt or Lender loss; both allocators moved to Yearn's RoleManager. Historical track record 5 → 4 (3–6 months in production). Governance (3-of-5, no timelock) and dependencies unchanged; no Flex-specific monitoring exists. |
