# Protocol Risk Assessment: Flex

- **Assessment Date:** May 27, 2026
- **Token:** Flex yvUSD/USDC Lender position token (`ysUSDC`)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732`](https://etherscan.io/address/0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732)
- **Final Score: 2.53/5.0**

## Overview + Links

Flex is a **fixed-rate, CDP-style lending protocol inspired by Liquity V2**. Borrowers lock collateral in *Troves* and borrow a *borrow token*, paying a **fixed annual interest rate that they choose themselves** (bounded and adjustable with a cooldown). Lenders deposit the borrow token into a Yearn-V3-compatible *Lender* vault (an ERC-4626 tokenized strategy) and earn three income streams: borrower interest, an upfront fee equal to ~1 week of the market-average rate charged at borrow time, and surplus proceeds from collateral auctions. In exchange, lenders **absorb bad debt** from underwater liquidations, which is socialized atomically across the vault.

Liquidity is managed Liquity-V2-style through **redemptions**: when idle lender liquidity is insufficient (for a new borrow or for a lender withdrawal), the protocol redeems Troves — starting with the lowest interest-rate Troves — and **Dutch-auctions the seized collateral** to raise the borrow token. Borrowers can be liquidated by anyone once their collateralization ratio (CR) falls below the market's Minimum Collateral Ratio (MCR), with a liquidation fee that scales with how far below MCR the Trove sits.

**Assessed token.** The token under assessment is the lending position token — the **Lender** ERC-4626 share (`ysUSDC`) of the single currently-live market: **yvUSD collateral / USDC borrow**. Yearn accesses this position through its own allocator vault `yvFlexUSDC` → `FlexLenderStrategy` → `Lender` (see *Appendix: Contract Architecture*). The collateral asset, **yvUSD**, is itself a Yearn V3 USDC vault that Yearn has assessed separately ([`yearn-yvusd.md`](./yearn-yvusd.md)).

**Links:**

- [Protocol Documentation](https://flexmeow.com/docs)
- [Markets / App](https://flexmeow.com/markets)
- [GitHub Repository](https://github.com/flexmeow/flex-contracts)
- [Audits folder](https://github.com/flexmeow/flex-contracts/tree/master/audits)
- [Risks page](https://flexmeow.com/risks)
- [DeFiLlama](https://defillama.com/protocol/flex) - TVL tracking
- Collateral asset assessment: [yvUSD report](./yearn-yvusd.md)

## Audits and Due Diligence Disclosures

Flex has undergone **four independent security reviews**, all published in the repo's [`audits/`](https://github.com/flexmeow/flex-contracts/tree/master/audits) folder:

| Date | Reviewer(s) | Scope / commit | Headline result |
|------|-------------|----------------|-----------------|
| Feb 28, 2026 | Independent review (`FLEX-Audit-28-February-2026.md`) | commit `10ef9ed…` | 4 Medium (zombie-trove tracking, partial-liq, redemption of unhealthy troves, re-kick price-freeze) + several Low/Info; some marked "will not fix" (Liquity-V2-inherited behaviors) |
| March 2026 | **HHK** & **adriro** (`2026-03-Flex-report.pdf`) | — | 1 High (arbitrary `raw_call` in LeverageZapper enabling trove theft), 3 Medium, 7 Low |
| April 27, 2026 | Independent review (`flex-audit-27-april.md`) | — | FLEX-001 High (stale Lender PPS enabling atomic bad-debt-escape / auction-surplus capture), FLEX-002 (upfront-fee basis) + others |
| **May 7, 2026** | **Dedaub** (`Flex-May-07-2026-Dedaub.pdf`) | commit `b4b9656…`, fixes in PR #16 | **0 Critical, 0 High**; Medium issues (e.g. upfront-fee manipulation via helper trove) reported **RESOLVED** |

The most recent review (Dedaub) found **no Critical or High** issues *on the code it scoped*, with prior Medium findings resolved or mitigated. HHK and adriro are well-regarded independent DeFi auditors; Dedaub is a reputable firm. The codebase also ships a Slither config and Foundry invariant tests (e.g. `test/invariant/DebtInvariant.sol`).

**Audit scope vs. deployed/Yearn-path code.** The four reviews above cover the **core protocol**; the **allocator layer in the Yearn deposit path** is covered separately by Yearn's own strategy-review process:

- **Core (covered by the four reviews):** the Liquity-V2 CDP engine, `Lender.sol`, `LenderFactory.sol`, oracles and registry. Between the Dedaub commit `b4b9656` and current `master` (`341e73a`), these changed only trivially — `Lender.sol` (comment-only), `factory.vy` (comment-only), and `trove_manager.vy` (+2 same-block guards that *strengthen* the audited behavior). So the audited core is materially the deployed core.
- **Allocator (`FlexLenderStrategy` / `StrategyFactory`, the `yvFlexUSDC → FlexLenderStrategy → Lender` path Yearn deposits through):** added May 6, 2026, after the four core reviews, and **under review in Yearn's own strategy-security process** ([yearn-strategies #756](https://github.com/yearn/yearn-strategies/issues/756), reviewers Schlagonia & fp-crypto). As of this assessment that ticket is **open with the "Review Completed" boxes unchecked** (a preliminary internal risk score is recorded), i.e. the strategy is being reviewed by Yearn's security team but the review is **not yet marked complete**, and it is not a published external audit. Yearn should confirm #756 is closed before scaling.

**Complexity:** The onchain surface is **substantial** — a full Liquity-V2-style CDP engine (`trove_manager.vy`, `sorted_troves.vy`, `dutch_desk.vy`, `auction.vy`, `factory.vy`, `registry.vy`) written in Vyper, plus a Solidity Yearn-V3 lender layer (`Lender.sol`, `LenderFactory.sol`) and an allocator strategy (`FlexLenderStrategy`). Liquity V2 is a well-understood design, but the fixed-rate + redemption + bad-debt-socialization + Yearn-vault-accounting combination introduces non-trivial cross-component interactions, several of which were the source of audit findings (notably the stale-PPS interaction between synchronous asset changes and Yearn `report()` cadence).

**Status of the April-27 High (FLEX-001, stale Lender PPS):**

- **Instance A — redeem-side bad-debt escape: mitigated, verified onchain in deployed code.** On an underwater liquidation the TroveManager atomically disables the Lender's health check and forces a report, so PPS drops in the same transaction as the loss (`trove_manager.vy:1132-1137`: `lender.disableHealthCheck()` then `keeper.report(lender)`), and `Lender.disableHealthCheck()` is gated to the TroveManager (`Lender.sol:92`). This closes the redeem-at-pre-loss-PPS path.
- **Instance B — deposit-side auction-surplus capture: mitigated by design.** Because the Lender is a Yearn TokenizedStrategy, realized gains (e.g. auction surplus) are **locked at report time and released linearly over `profitMaxUnlockTime` (10 days)** rather than repricing shares instantly. A deposit therefore cannot atomically capture incoming surplus — it accrues pro-rata to whoever holds shares over the unlock window, carrying normal lender risk. This profit-unlock behavior is inherited "for free" from Yearn's strategy framework and is the structural fix for the deposit-side vector; only a negligible ERC-4626-generic entry-timing edge remains.

**Other unresolved items:** A few low-severity items are explicitly "will not fix" as inherited Liquity V2 behavior (interest-dust rounding, small-repay interest baking). No outstanding Critical/High finding remains on the audited core; the principal open caveat is completion of the allocator's Yearn strategy review (#756).

### Bug Bounty `[If Applicable]`

- **TODO** — No bug-bounty program was found on the docs, risks page, or Immunefi/SEAL Safe Harbor. The [Safe Harbor registry](https://safeharbor.securityalliance.org/) was not confirmed to list Flex. Treat as **no active bug bounty** until confirmed.

## Historical Track Record

- **Time in production: ~2 weeks.** The live core contracts and the yvUSD/USDC market were deployed on **May 12–14, 2026** (allocator vault `yvFlexUSDC` created in block 25080961 / 2026-05-12; market `TroveManager` created in block 25094970 / 2026-05-14, verified via Etherscan). Earlier broadcast artifacts date to Oct 2025, indicating an extended testnet/redeploy history, but the live deployment is very recent.
- **TVL: ~$0.7M–$1.0M.** DeFiLlama reports Flex (flexmeow.com) TVL fluctuating between ~$326K and ~$1.03M over its short life, ~$0.67M at time of writing. Onchain, the Lender held **~$802K** total assets (≈$200K idle USDC + ~$602K outstanding debt) and the `yvFlexUSDC` allocator ~$1.0M.
- **Security incidents:** None known (protocol is ~2 weeks live).
- **Concentration risk:** With ~$1M TVL sourced essentially entirely through Yearn's own allocator vault, the depositor base is highly concentrated. The single market's collateral is **100% yvUSD**.
- **Peg / depeg history:** None — too new. Both legs are USD-denominated (USDC borrow, yvUSD collateral).

## Funds Management

Flex delegates lender funds into a single market today. The fund flow is:

**User USDC → `yvFlexUSDC` (Yearn V3 allocator vault) → `FlexLenderStrategy` → `Lender` (ysUSDC) → market lending**, where borrowers post **yvUSD** collateral to borrow USDC. The Lender's `_freeFunds` calls `TroveManager.redeem(...)`, so lender withdrawals beyond idle USDC are satisfied by **redeeming borrower collateral via Dutch auction**. In this yvUSD/USDC market, the auction can be taken by redeeming yvUSD for USDC through the `yv_auction_taker`, so the path can clear near 1:1 when taken immediately; otherwise execution depends on auction/taker flow and can settle with delay or slippage.

Monitoring of fund delegation: the set of endorsed markets is enumerable onchain via `Registry.get_all_markets()` (currently returns exactly one TroveManager, `0xd82D…2e49`). New markets require Daddy to call `Registry.endorse(...)`, which is observable. The Yearn-side allocation (which strategies the `yvFlexUSDC` vault funds, and debt caps) is managed by the Yearn Strategist MultiSig (SMS) through standard Yearn V3 vault roles.

### Accessibility `[If Applicable]`

- **Lending (mint of `ysUSDC`):** Permissionless ERC-4626 deposit of USDC into the Lender — anyone can mint Lender shares 1:1 against deposited assets. The intermediate `FlexLenderStrategy` is access-gated (`openDeposits = false`; only allow-listed addresses such as the `yvFlexUSDC` vault may deposit), but the underlying Lender vault itself is open.
- **Redeeming (burn of `ysUSDC`):** Permissionless `withdraw`/`redeem`. If idle borrow token is insufficient, redemption triggers a collateral Dutch auction; for the current yvUSD/USDC market this can be taken immediately via yvUSD redemption into USDC, but exit still depends on auction takers and yvUSD vault liquidity beyond idle Lender cash.
- **Borrowing:** Permissionless — anyone can open a Trove with yvUSD collateral.
- **Fees / rate limits:** Borrowers pay an **upfront fee** (~1 week of market-average rate) and a **premature-rate-adjustment fee**. Docs cite a **10% lender performance fee** to the protocol; the Lender's onchain `performanceFee` reads **0** at assessment time, with `performanceFeeRecipient = Daddy`. There is a per-Lender `depositLimit` (currently $2M) and the allocator vault deposit limit is effectively uncapped.

### Token Mint Authority

The assessed token `ysUSDC` is a **Yearn V3 `BaseHooks` TokenizedStrategy** (ERC-4626). Shares are not mintable by any privileged role — they are minted/burned **only** through permissionless `deposit`/`mint`/`withdraw`/`redeem`, and every mint is **fully backed in the same transaction** by the USDC the depositor transfers in. There is no `MINTER_ROLE`, no whitelist mapping, and no owner mint path.

**Mint mechanism:** Permissionless ERC-4626 deposit (collateral/asset deposited atomically; shares priced off the strategy's cached `totalAssets`).

**Mint requires backing:** Yes — USDC must transfer in the same transaction; no admin can issue unbacked shares.

**Per-address mint authority** (verified onchain on May 27, 2026, from Lender `0x33C4…B732`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any depositor | ✓ | ✓ | Permissionless ERC-4626 `deposit`/`redeem` | Shares minted 1:1 vs deposited USDC; no privileged minter exists |

**Rate limits / supply caps:** `depositLimit = 2,000,000 USDC` on the Lender (settable by management/Daddy via `setDepositLimit`); `availableDepositLimit` returns 0 once total assets reach the cap.

**Backing check at mint time:** Atomic — depositor transfers USDC in the same tx. (Caveat: share **price** is computed against a *cached* `totalAssets` refreshed by permissionless `report()` calls; see *Provability* and the now-mitigated April-27 FLEX-001 finding. This is a mispricing/arbitrage surface, not an unbacked-mint surface.)

There is **no privileged minter** — a positive signal. The dependency-graph YAML (if generated) should therefore contain **no `mints` edge** into `ysUSDC`.

### Collateralization

- **Onchain & over-collateralized.** The live market borrows USDC against **yvUSD** collateral. Verified onchain on May 27, 2026:
  - TroveManager `total_debt` ≈ **602,540 USDC** (`sync_total_debt()`),
  - yvUSD collateral held by the TroveManager ≈ **699,541 yvUSD**, valued at the oracle price of **1.01292 USDC/yvUSD** → **≈ $708,580**,
  - **System CR ≈ 117.6%** ( $708.6K / $602.5K ).
- **Collateral quality:** High-quality, but **single-asset**. yvUSD is a Yearn V3 USDC vault (yield-bearing USDC) — itself assessed by Yearn in [`yearn-yvusd.md`](./yearn-yvusd.md). Because both legs are USD, the market is effectively leveraged USDC-yield exposure; the dominant risk is a **yvUSD loss/depeg**, which would feed straight through the oracle (see below).
- **Ratios (verified onchain):** MCR = **110%**, "safe" CR = **120%**, max-penalty CR = 105%, min liquidation fee 0.5%, max 5%. The live ~117.6% system CR sits between MCR and the safe ratio — a **thin buffer**.
- **Liquidations:** Onchain and permissionless. Below MCR, anyone can liquidate; the fee scales linearly with shortfall. If seized collateral (incl. fee) exceeds the Trove's collateral, the shortfall is **socialized to lenders** atomically (bad debt). Redemptions Dutch-auction collateral via `dutch_desk.vy` / `auction.vy`.
- **Admin control over funds:** The immutable market contracts hold collateral; no admin can withdraw borrower collateral. Daddy (2/4 multisig) is the Lender's *management* and the Registry owner — it cannot seize collateral or user shares, but it can change Lender parameters, shut the Lender down, change the keeper, set fees, and endorse/unendorse markets (see *Centralization*).
- **Risk curation:** Market parameters (MCR, fees, auction params, oracle) are **fixed at market-deploy time** by the `factory.vy` deploy call and are **immutable** for that market. Adding markets with different parameters/collateral requires a new factory deployment + Daddy endorsement.

### Provability

- **Fully onchain and independently verifiable.** Total debt, collateral balance, and CR are all readable from the TroveManager; the Lender's assets = idle USDC + `TROVE_MANAGER.sync_total_debt()`. Anyone can recompute the backing ratio.
- **Exchange rate / PPS:** The Lender is a Yearn TokenizedStrategy; `pricePerShare` (≈1.000022 USDC at assessment) derives from a **cached `totalAssets`** that is only refreshed when the **permissionless keeper** calls `report()` (`_harvestAndReport`). Synchronous events that change real assets *without* a report open a transient mispricing window — the April-27 review flagged this as **High (FLEX-001)**, with two instances:
  - *Bad-debt loss (redeem side):* **mitigated in deployed code** — verified at `trove_manager.vy:1132-1137`, where liquidation atomically calls `lender.disableHealthCheck()` then `keeper.report(lender)` so PPS drops in the same tx as the loss; `Lender.disableHealthCheck()` is restricted to the TroveManager (`Lender.sol:92`).
  - *Auction surplus (deposit side):* **mitigated by Yearn's profit-unlock** — realized gains are locked at report and released over `profitMaxUnlockTime` (10 days), so a deposit cannot atomically capture incoming surplus; the gain accrues pro-rata over the unlock window. This is inherited from the TokenizedStrategy framework.
- **Oracle:** The market price oracle (`0x6D8D…4206`) is a Vyper contract whose `get_price()` returns **yvUSD `pricePerShare()`** scaled to the borrow token — i.e. the collateral is priced by the **collateral's own Yearn vault PPS**, with **no external/Chainlink price feed** and no independent cross-check. This is reasonable for a yield-bearing-USDC-vs-USDC pair (both ~$1), but it means a yvUSD accounting error or PPS manipulation maps directly into the market's solvency.
- **Third-party verification:** None beyond direct onchain reads (no Chainlink PoR, no custodian). For a fully-onchain system this is adequate.

## Liquidity Risk

- **Exit is auction-mediated beyond idle cash.** Lenders redeeming `ysUSDC` are first paid from **idle borrow token** (≈$200K of ~$802K, ~25%, at assessment). Beyond idle liquidity, `Lender._freeFunds` calls `TroveManager.redeem`, which **Dutch-auctions borrower collateral**; proceeds are routed to the withdrawer. For the current yvUSD/USDC market, the `yv_auction_taker` can take auctions by redeeming yvUSD for USDC, so redemptions can clear near 1:1 when the auction is taken immediately. `FlexLenderStrategy.availableWithdrawLimit` is bounded by idle USDC in the strategy + idle USDC in the Lender.
- **Depth:** TVL is small (~$1M) and depositor concentration is high (essentially Yearn's allocator). There is no deep external DEX market for `ysUSDC`; exit relies on the protocol's own redemption machinery against ~$700K of yvUSD collateral and on yvUSD vault liquidity.
- **Stress behavior:** During collateral stress, redemptions/liquidations could deliver less than 1:1, and bad debt is socialized to lenders. Auctions have a 1-day length with 1-minute price steps; current deployment parameters start at 100% of oracle value and stop below 99%, so the normal yvUSD/USDC path is near par, but delayed or stressed takes can still introduce execution risk. No fixed withdrawal queue, but large exits effectively throttle through the auction mechanism.
- **Same-value assets:** Both legs are USD, so modest exit delays carry limited price risk, and the yvUSD redemption-taker path is a material mitigant. The remaining liquidity risk is mainly small-market depth, taker execution, and yvUSD vault exit liquidity.

## Centralization & Control Risks

### Governance

- **Core market contracts are immutable.** The Vyper CDP engine (TroveManager, SortedTroves, DutchDesk, Auction, Factory, Registry) is deployed via CREATE2 with **no proxy/upgrade path**. The Lender (`Lender.sol`) and `FlexLenderStrategy` are non-upgradeable Yearn TokenizedStrategy instances.
- **But there *is* privileged control — the protocol's "no admin keys" claim is misleading.** The [risks page](https://flexmeow.com/risks) states Flex has "no admin keys, no privileged users, and no ability to pause, upgrade, or modify." This is **true only for the immutable market mechanics**. Onchain, a **`Daddy` contract** (`0x4e8341…8290`) — a generalized arbitrary-`execute` owner — holds real powers:
  - It is the **Lender's `management`** (can `setDepositLimit`, `setPerformanceFee`, `setPerformanceFeeRecipient`, `setKeeper`, `setProfitMaxUnlockTime`, and `shutdownStrategy`),
  - It is the **Registry owner** (can `endorse`/`unendorse` markets).
- **Note on emergency withdrawal:** `Lender.sol` does **not** override `_emergencyWithdraw`, so the inherited Yearn default is a **no-op** — Daddy *cannot* pull the Lender's deployed assets out of the market via `emergencyWithdraw`. Its emergency lever is limited to `shutdownStrategy` (blocks new deposits; existing lenders can still withdraw through the normal redemption path). (The separate `FlexLenderStrategy` *does* implement `_emergencyWithdraw`, but that strategy is controlled by Yearn SMS, not Daddy.)
- **Daddy is owned by a 2-of-4 Safe multisig** (`0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67`, Safe v1.4.1; threshold and four owners verified onchain on May 27, 2026):
  - [`0x7492976ef91E02B4868341d49F3f711d8e94659f`](https://etherscan.io/address/0x7492976ef91E02B4868341d49F3f711d8e94659f)
  - [`0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F`](https://etherscan.io/address/0xF53D1fB2EeD22Cf1E8f7E90Da7f1CAe88344065F)
  - [`0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092`](https://etherscan.io/address/0xBD5f1429Ab467E69BEeba51E547C00A21F2a2092)
  - [`0x000005281a2b04A182085D37cC9E6dD552795caa`](https://etherscan.io/address/0x000005281a2b04A182085D37cC9E6dD552795caa) — deployer, `johnny.flexmeow.eth`
  - Per the protocol team (PR review), the set is **two keys held by the Flex developer plus two well-known pseudonymous Yearn-ecosystem reviewers ("corn" and "schlag"/Schlagonia)**; the team describes it as a small, intentionally low-control multisig to be hardened later.
- **No timelock** sits in front of Daddy. A **2/4 threshold (only two signatures required) with no timelock** is a low bar, though signer reputation is a mitigant and Daddy's powers cannot seize user funds.
- **Yearn-side control:** The `yvFlexUSDC` allocator vault and `FlexLenderStrategy` are managed by the **Yearn Strategist MultiSig (SMS, `0x16388463…0ff7`)** with the `role_manager` set to SMS — a comparatively well-governed party. Daddy cannot seize lender shares or borrower collateral; its worst-case is parameter abuse, fee extraction, lender shutdown, and endorsing a malicious new market (which would only affect lenders who opt into that market).

### Programmability

- **Highly programmatic.** Borrowing, interest accrual, redemptions, liquidations and auctions are all onchain. PPS is computed onchain.
- **Keeper dependency:** Lender accounting (`report()`) is driven by a **permissionless keeper** (`0x52605Bbf…b2f8` hard-coded in `LenderFactory`); the Yearn allocator/strategy use Yearn's **yHaaS keeper** (`0x604e586F…711E`). The prior stale-PPS-between-reports concern (FLEX-001) is addressed by the atomic bad-debt report and Yearn profit-locking; report cadence remains a minor liveness dependency only.

### External Dependencies

- **yvUSD (sole collateral + price source)** — the market's only collateral *and* its oracle input is yvUSD's PPS. yvUSD is itself a Yearn V3 vault that bridges USDC via Circle CCTP to remote-chain strategies (see [`yearn-yvusd.md`](./yearn-yvusd.md)). A yvUSD loss, depeg, or PPS manipulation flows directly into Flex solvency. **Critical single dependency for this market.**
- **Yearn V3 / TokenizedStrategy framework** — the Lender, strategy and allocator vault inherit Yearn's audited base contracts; a framework-level bug would affect Flex.
- **USDC** — the borrow token (Circle centralization/freeze risk, standard).
- No L2/bridge dependency on the Flex side (yvUSD's CCTP bridging is yvUSD's own dependency).

## Operational Risk

- **Team:** Pseudonymous. The lead developer is **`johnnyonline` / `johnny.flexmeow.eth`**, an active contributor in the Yearn ecosystem (the protocol reuses Yearn's TokenizedStrategy, SMS, yHaaS and Vault Factory). Per team disclosure, the Daddy Safe signer set is two Flex-dev keys plus two well-known pseudonymous Yearn-ecosystem reviewers ("corn" and Schlagonia); public docs still do not provide an address-to-person signer mapping.
- **Documentation:** User-facing docs are clear on mechanics (redemptions, liquidations, fees, bad-debt socialization). However, there is **no governance/ownership documentation**, and the risks page's "no admin keys / immutable" claim **contradicts the onchain Daddy multisig** — a transparency gap that should be weighed even though the signer set was disclosed during review.
- **Legal structure:** **TODO** — no legal entity, jurisdiction, or foundation disclosed.
- **Incident response:** No documented or tested incident-response plan; no bug bounty found. Daddy can shut down the Lender in an emergency.

## Monitoring

**Key addresses to monitor (Ethereum mainnet):**

| Contract | Address | Why monitor |
|----------|---------|-------------|
| Lender `ysUSDC` (assessed token) | [`0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732`](https://etherscan.io/address/0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732) | `pricePerShare`, `totalAssets`, `depositLimit`, `performanceFee`, management/keeper changes, `ReportLoss` |
| TroveManager (yvUSD/USDC market) | [`0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49`](https://etherscan.io/address/0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49) | `total_debt`, collateral balance → backing ratio; liquidations / bad-debt events |
| Price Oracle (yvUSD→USDC) | [`0x6D8D09F18afD74E6D6D0190CCdF89de8FEa54206`](https://etherscan.io/address/0x6D8D09F18afD74E6D6D0190CCdF89de8FEa54206) | `get_price()` vs yvUSD PPS; abnormal moves |
| Registry | [`0x9117440a7D03238905d1C8908157Bd7a547c77c8`](https://etherscan.io/address/0x9117440a7D03238905d1C8908157Bd7a547c77c8) | `EndorseMarket`/`UnendorseMarket` — new market risk |
| Daddy (protocol owner) | [`0x4e8341C77c94cCE982AB96d92BB28D69f4638290`](https://etherscan.io/address/0x4e8341C77c94cCE982AB96d92BB28D69f4638290) | `OwnershipTransferred`; any `execute` call |
| Daddy owner Safe (2/4) | [`0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67`](https://etherscan.io/address/0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67) | signer/threshold changes |
| yvFlexUSDC allocator vault | [`0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8`](https://etherscan.io/address/0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8) | Yearn-side roles, debt allocation, deposit limit |
| FlexLenderStrategy | [`0x467Ce10870747372968ba98463A1d9af9Fb27751`](https://etherscan.io/address/0x467Ce10870747372968ba98463A1d9af9Fb27751) | idle vs deployed, `openDeposits`/`allowed`, health-check losses |
| Collateral yvUSD | [`0x696d02Db93291651ED510704c9b286841d506987`](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) | PPS, peg, see `yearn-yvusd.md` triggers |

**Critical values / events & thresholds:**

- **Backing ratio** = (yvUSD collateral × oracle price) / `total_debt`. Alert if **system CR < 112%** (approaching the 110% MCR); page if **< 110%** or any bad-debt socialization (`ReportLoss` on the Lender).
- **Idle liquidity ratio** = idle USDC / Lender `totalAssets`. Alert if idle **< 5%** (lender exits would force redemption auctions).
- **Governance:** any `Daddy.execute`, ownership transfer, Safe signer/threshold change, performance-fee change, `setKeeper`, Lender shutdown, or new `EndorseMarket`.
- **Oracle:** `get_price()` deviating from yvUSD PPS, or yvUSD depeg vs USDC.
- **Recommended frequency:** backing ratio & idle liquidity **hourly**; governance/registry events **real-time**; yvUSD peg **daily**.

Onchain reads: `Lender.totalAssets()`, `Lender.pricePerShare()`, `TroveManager.sync_total_debt()`, `IERC20(yvUSD).balanceOf(TroveManager)`, `Oracle.get_price()`, `Registry.get_all_markets()`, `Daddy.owner()`, Safe `getOwners()/getThreshold()`.

## Appendix: Contract Architecture

```
                          USER / YEARN DEPOSITOR (USDC)
                                     │ deposit
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  yvFlexUSDC — Yearn V3 allocator vault (3.0.4)            │  role_manager: Yearn SMS
        │  0x863687e4E9751b57F38b4B0ebA04744C72d0f7B8              │  0x16388463…0ff7
        └─────────────────────────────────────────────────────────┘
                                     │ allocates (auto)
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  FlexLenderStrategy (Yearn TokenizedStrategy)            │  management: Yearn SMS
        │  0x467Ce10870747372968ba98463A1d9af9Fb27751             │  openDeposits=false
        └─────────────────────────────────────────────────────────┘
                                     │ deposit
                                     ▼
        ┌─────────────────────────────────────────────────────────┐   ASSESSED TOKEN
        │  Lender "Flex yvUSD/USDC Lender" — ysUSDC (ERC-4626)     │  management: Daddy
        │  0x33C45216E121E31f1a8CD24C7E9d0d0C9e29B732             │  keeper: 0x52605Bbf…b2f8
        └─────────────────────────────────────────────────────────┘  perf-fee recipient: Daddy
                                     │ provides USDC liquidity / redeem()
                                     ▼
   ── PROTOCOL LAYER (immutable Vyper, CREATE2; one market) ─────────────────────
        TroveManager   0xd82DB9893751E9C90E2a6C3bE31183048E8E2e49  (holds yvUSD collateral)
        SortedTroves   0xc489B9E1003b337146fB8095687a8FB1f7119ACC
        DutchDesk      0x3F195124394D63FCb4a792181CC8A65717Ed1efA
        Auction (tmpl) 0x10b07c594e6de6d40e13c2d0b6c49e5a3cac0bcf
        PriceOracle    0x6D8D09F18afD74E6D6D0190CCdF89de8FEa54206  → reads yvUSD pricePerShare()
        ── factories / registry ──
        CatFactory     0xe2c4a5C2AB1ed5745D206B33cc0abf0A5D34753d
        LenderFactory  0x5f6F29Bd3baE4FB934151ed4B8ccC3F264c51995
        Registry       0x9117440a7D03238905d1C8908157Bd7a547c77c8  (owner: Daddy)
   ── UNDERLYING LAYER ──────────────────────────────────────────────────────────
        Collateral  yvUSD  0x696d02Db93291651ED510704c9b286841d506987 (Yearn V3 USDC vault)
        Borrow      USDC   0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
   ── GOVERNANCE ────────────────────────────────────────────────────────────────
        Daddy (arbitrary execute)  0x4e8341C77c94cCE982AB96d92BB28D69f4638290
          └─ owner: Safe 2/4        0x687b82dA9753C9db280d4D9aBD7BCAC022Ef3B67
        Yearn SMS                   0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7
```

**Trust boundaries:** Borrower collateral is held by the immutable TroveManager — no admin withdrawal path. Daddy (2/4 multisig, no timelock) controls Lender parameters + market endorsement but cannot seize funds. The Yearn allocator/strategy layer is governed by Yearn SMS. The single most concentrated risk is the **yvUSD collateral**, which is both the only collateral and the oracle's only price input.

---

## Risk Summary

### Key Strengths

- **Immutable core protocol** — the Liquity-V2-style CDP engine has no upgrade path; market parameters are fixed at deploy.
- **Four independent security reviews** of the core (incl. Dedaub and HHK/adriro); the latest found **no Critical/High** on the audited core, and the deployed core is materially unchanged from the audited commit.
- **Fully onchain, over-collateralized, verifiable** — system CR ≈ 117.6%, backing recomputable by anyone; **no privileged minter** on the lending token (atomic 1:1 mint).
- **High-quality, USD-denominated collateral** (yvUSD, a Yearn V3 USDC vault) against USDC debt — limited directional price risk.
- **Yearn-grade integration layer** — allocator vault and strategy governed by Yearn SMS / yHaaS.

### Key Risks

- **Very new & small** — ~2 weeks live, ~$0.7–1.0M TVL, highly concentrated depositor base.
- **Governance overclaim + low threshold** — docs advertise "no admin keys / immutable," but a **2/4 multisig with no timelock** controls Lender parameters, fees, shutdown, keeper, and market endorsement. Powers cannot seize user funds and signers are reputable, but only two signatures are required and there is no delay.
- **Single-asset collateral that is also the oracle** — the market is priced by yvUSD's own PPS with no external feed; yvUSD loss/depeg/PPS manipulation flows straight into solvency.
- **Exit is auction-mediated beyond idle cash** — lender withdrawals beyond idle USDC trigger Dutch-auction collateral redemptions. The yvUSD/USDC market has an immediate yvUSD-redemption taker path that can clear near 1:1, but large exits still rely on taker execution and yvUSD vault liquidity; **bad debt is socialized to lenders**.
- **Allocator review not yet complete** — the `FlexLenderStrategy`/`StrategyFactory` path Yearn deposits through is under Yearn's internal strategy review ([#756](https://github.com/yearn/yearn-strategies/issues/756)), which is open/unchecked at assessment time — not a published external audit.

### Critical Risks `[If Any]`

- No standalone fund-loss critical was identified. The compounding concern to watch is **thin CR buffer (≈117% vs 110% MCR) + single yvUSD collateral + self-referential oracle + bad-debt socialization**: a sharp yvUSD impairment could push lenders into socialized losses faster than redemptions/liquidations clear.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [ ] **No audit** — *Not triggered.* Four reviews; Dedaub + HHK/adriro reputable.
- [ ] **Unverifiable reserves** — *Not triggered.* Fully onchain; CR recomputable.
- [ ] **Total centralization** — *Not triggered.* Core immutable; control via 2/4 Safe (not a lone EOA), and Daddy cannot seize funds.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews** — The core has **strong coverage**: four reviews including Dedaub (no Critical/High) and HHK/adriro, invariant tests + Slither, and the deployed core is materially unchanged from the audited commit; the April-27 High (FLEX-001) is closed (bad-debt side mitigated onchain, surplus side handled by Yearn profit-locking). The allocator (`FlexLenderStrategy`) is under Yearn's internal strategy review (#756, not yet marked complete) rather than a published external audit, and there is **no bug bounty** on a complex surface. → **2**

**Subcategory B: Historical Track Record** — ~2 weeks in production, ~$1M TVL. → **5**

**Audits & Historical Score = (2 + 5) / 2 = 3.5**

**Score: 3.5/5** — Strong core audit coverage offset by minimal time-in-production/TVL and a not-yet-complete allocator review.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance** — Immutable core. Privileged control is a **2/4 multisig with no timelock** (reputable signers: Flex dev + Schlagonia + "corn") whose powers are genuinely **limited — it cannot seize collateral or lender shares**, only set parameters/fees/keeper, shut the Lender down, and endorse markets. The low signature threshold and absence of a timelock cap this below the well-governed tiers, but the immutable core and bounded, non-custodial powers keep it off the worst tier. → **3**

**Subcategory B: Programmability** — Fully programmatic: borrowing, interest, redemptions, liquidations and auctions are onchain, and PPS is computed onchain (`idle + sync_total_debt`). The prior stale-PPS concern is closed (atomic report on bad debt; profit-locking on surplus); permissionless `report()` cadence is only a minor liveness consideration. → **1**

**Subcategory C: External Dependencies** — Single-collateral market where the **sole collateral (yvUSD) is also the only oracle input**; plus Yearn V3 framework and USDC. yvUSD is a material dependency, but it is a Yearn-assessed USDC-denominated vault rather than an unknown external dependency, so this fits the established-dependency tier. → **3**

**Centralization Score = (3 + 1 + 3) / 3 = 2.33**

**Score: 2.33/5** — Immutable, fully-programmatic mechanics with non-custodial governance, held up mainly by the concentrated, self-referential yvUSD collateral/oracle dependency.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization** — 100%+ onchain over-collateralization (≈117.6%) in high-quality DeFi asset (yvUSD), real-time verifiable; tempered by thin buffer vs 110% MCR, single-asset concentration, and bad-debt socialization. → **2.5**

**Subcategory B: Provability** — Fully onchain and recomputable; total debt, collateral, and Lender assets are readable directly, and PPS/reporting is programmatic and permissionless. No offchain reserve or admin reporting dependency remains after the FLEX-001 mitigations. → **1**

**Funds Management Score = (2.5 + 1) / 2 = 1.75**

**Score: 1.75/5** — A clear strength: transparent, onchain over-collateralization and independently recomputable reserves.

#### Category 4: Liquidity Risk (Weight: 15%)

Auction-mediated exit: idle USDC first (~25%), then Dutch-auction redemption of yvUSD collateral. The yvUSD/USDC market can clear near 1:1 through immediate `kick + take` using yvUSD redemption, but liquidity depth is small (~$1M), large exits rely on taker execution/yvUSD vault liquidity, and auctions remain the throttle beyond idle cash. Same-value USD legs mitigate price risk. → **3**

**Score: 3/5** — Exit is materially better than a generic delayed auction because yvUSD can be redeemed into USDC for taking, but the rubric still treats this as market-based liquidity, not deep direct instant redemption.

#### Category 5: Operational Risk (Weight: 5%)

Pseudonymous but Yearn-ecosystem-known lead dev; adequate mechanics docs but **misleading "no admin keys" claim** and no governance/legal disclosure; no bug bounty. → **3**

**Score: 3/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.5 | 20% | 0.70 |
| Centralization & Control | 2.33 | 30% | 0.70 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **2.525 ≈ 2.53/5.0** |

**Optional Modifiers:** None apply (protocol < 2 years; TVL not sustained). Final score ≈ **2.53/5.0**.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk** — *Approved with enhanced monitoring.* The driving constraints are immaturity (~2 weeks live, ~$1M TVL), no bug bounty, and the concentrated yvUSD collateral/oracle dependency, partially offset by strong core audit coverage, immutable fully-programmatic mechanics, non-custodial governance, transparent onchain over-collateralization, and the near-par yvUSD/USDC auction-taker exit path. Recommend strict size limits and confirming the allocator's Yearn strategy review (#756) is complete before scaling.

---

## Reassessment Triggers `[If Applicable]`

- **Time-based:** Reassess in **3 months** (early-stage protocol).
- **Audit coverage:** Reassess (upward) once Yearn's allocator strategy review ([#756](https://github.com/yearn/yearn-strategies/issues/756)) is marked complete, or (with caution) if `FlexLenderStrategy`/`StrategyFactory` is changed materially after that.
- **TVL-based:** Reassess if Flex TVL changes by **>50%** in either direction, or the Lender `depositLimit` is raised materially.
- **Collateral/market:** Reassess if a **new market is endorsed** (`Registry.EndorseMarket`), if a non-yvUSD or non-USD collateral is added, or if the oracle design changes.
- **Governance:** Reassess on any Daddy ownership transfer, Safe signer/threshold change, addition of a timelock, performance-fee activation, or keeper change.
- **Incident-based:** Reassess after any bad-debt socialization event, liquidation failure, auction freeze, yvUSD depeg/loss, or any exploit affecting Flex, Yearn V3, or yvUSD.
