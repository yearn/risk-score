# Asset Risk Assessment: Flying Tulip — ftUSD & Staked ftUSD (sftUSD)

- **Assessment Date:** August 7, 2026
- **Token:** ftUSD (stablecoin) and sftUSD (staked ftUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** ftUSD [`0xF7D85EC4E7710f71992752eac2111312e73E9C9C`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) · sftUSD [`0xeb48218a4c35C814C7678cBcae88C6Ee037F7625`](https://etherscan.io/address/0xeb48218a4c35C814C7678cBcae88C6Ee037F7625)
- **Final Score: 3.5/5.0**
- **Medium Risk** — approved with enhanced monitoring. ftUSD is fully collateralized (100.05%) but that backing is **not idle cash — it is lent into Flying Tulip's own money market** by a strategy whose `operators[]` include a plain EOA with `onlyManager` rights to pre-sign hedge trades (no onchain price bound). The 3/5 admin Safe can mint unbacked ftUSD, blacklist and burn balances. Redemption is permissionless but rate-limited and capped by FT Lend's cash — ~15% of the USDT backing is not withdrawable today. The price feed is structurally blind to the backing. See [Risk Score Assessment](#risk-score-assessment).
- **Companion report:** the lending market itself is assessed in **[Flying Tulip — FT Lend](./flying-tulip.md)**.

> **Scope.** This report covers **holding ftUSD** and **staking it as sftUSD**. It is a separate risk from supplying to the FT Lend market — different loss paths, different exit mechanics, different concentration profile — and the two should be sized independently. All values verified **August 6, 2026 at block `25697429`** via `cast` and Etherscan.

## Overview + Links

**ftUSD** is Flying Tulip's stablecoin. Users mint 1:1 against USDC or USDT through `MintAndRedeem` and can redeem the same way, paying 7 bps each direction. It is marketed as a "delta-neutral yield stablecoin": the strategy supplies the original USDC/USDT principal to Flying Tulip's own lending market, borrows WETH from that same market, swaps the borrowed WETH for wstETH, and deposits the wstETH back into the market as leveraged collateral. Gross collateral therefore includes USDC/USDT and wstETH, offset by WETH debt; the strategy's net equity, not its gross assets, backs ftUSD.

**sftUSD** is the staked form — an ERC-4626-style vault at [`0xeb48218a…7625`](https://etherscan.io/address/0xeb48218a4c35C814C7678cBcae88C6Ee037F7625) holding 1,324,455 ftUSD across 107 holders. Critically, **sftUSD does not appreciate in ftUSD terms**; its yield is paid separately in FT tokens.

**Links:**

- [Protocol Documentation](https://docs.flyingtulip.com/) · [Contract Addresses](https://docs.flyingtulip.com/contract-addresses/) · [Risks page](https://docs.flyingtulip.com/risks/)
- [App](https://flyingtulip.com/) · [Blog](https://blog.flyingtulip.com/)
- [GitHub org `flyingtulipdotcom`](https://github.com/flyingtulipdotcom) (ftUSD repos are **private**)
- [DeFiLlama — Flying Tulip](https://defillama.com/protocol/flying-tulip) · [Curve ftUSD/USDC pool](https://etherscan.io/address/0xafec61e7a604f8f81f7cab64ec75bfa07c542630)

## Contract Addresses

All source-verified on Etherscan, including proxy implementations.

### ftUSD Core

| Contract | Address | Role | Implementation |
|---|---|---|---|
| **ftUSD** (`FlyingTulipUSD`) | [`0xF7D85EC4E7710f71992752eac2111312e73E9C9C`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | FiatToken-style stablecoin, 6 dec, UUPS | [`0xf47bb65f…1885`](https://etherscan.io/address/0xf47bb65fb0886be183db541afce555345e3e1885) |
| ftUSD Core | [`0x56c5892B0cF41B792217CCDD208f0FA85B178ca9`](https://etherscan.io/address/0x56c5892B0cF41B792217CCDD208f0FA85B178ca9) | sole `minter()`; debt-ceiling module gate | [`0x986841b7…5440`](https://etherscan.io/address/0x986841b77f3aa934d315d48121842e3c622e5440) |
| MintAndRedeem | [`0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C`](https://etherscan.io/address/0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C) | only enabled mint module; holds collateral accounting | [`0x8852b132…c3c6`](https://etherscan.io/address/0x8852b132b72613a16f1e3960978a3d45c0a7c3c6) |
| ftUSD price oracle | [`0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8) | `FtUsdMintRedeemOracleProxy` — redemption-value feed | — |

### Backing custody chain

| Contract | Address | Holds |
|---|---|---|
| ftUSD USDC wrapper | [`0x6aaf84563Cdb03a22Cd92EE2553698beE87E837D`](https://etherscan.io/address/0x6aaf84563Cdb03a22Cd92EE2553698beE87E837D) | 2,781,367 USDC |
| ftUSD USDT wrapper | [`0x28CCa8eEA2cD0498cE91A9da15772A1ce42347D6`](https://etherscan.io/address/0x28CCa8eEA2cD0498cE91A9da15772A1ce42347D6) | 1,417,610 USDT |
| **Delta-Neutral strategy** | [`0xe0E445967256EE60111e243e0F0F94DD1D351A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59) | `MultiCollateralDeltaNeutralStakingStrategy` — deploys the above into FT Lend |
| LeverageRfqEngine | [`0x8263a07504d93cB95e0a74f3627bb15faaf140e2`](https://etherscan.io/address/0x8263a07504d93cB95e0a74f3627bb15faaf140e2) | Executes the strategy's hedge orders |

### Staking (sftUSD)

| Contract | Address | Role |
|---|---|---|
| **sftUSD** | [`0xeb48218a4c35C814C7678cBcae88C6Ee037F7625`](https://etherscan.io/address/0xeb48218a4c35C814C7678cBcae88C6Ee037F7625) | ERC-4626-style staking vault, UUPS, impl [`0xea95e463…b6da`](https://etherscan.io/address/0xea95e4636badc00881f8f73a0623b0fe8627b6da) |
| ftftUSD wrapper | [`0xB44a9C40EFc05Eb014EfFEac3CBed6A31F8cB87f`](https://etherscan.io/address/0xb44a9c40efc05eb014effeac3cbed6a31f8cb87f) | `ftYieldWrapperV2` — holds the staked ftUSD |
| Staking CircuitBreaker | [`0xCB210509F5AE2b3843B7Fb8Bb90bAFF9cE4f7355`](https://etherscan.io/address/0xCB210509F5AE2b3843B7Fb8Bb90bAFF9cE4f7355) | Rate-limits withdrawals |
| Epoch settler | [`0xBAE14f050Fb8cDa4D16ab47DBEC67793c7c0b566`](https://etherscan.io/address/0xBAE14f050Fb8cDa4D16ab47DBEC67793c7c0b566) | Funds FT reward epochs |

### Governance

| Role | Address | Notes |
|---|---|---|
| **Admin Safe** | [`0x1118e1c057211306a40A4d7006C040dbfE1370Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | **3 of 5, no timelock.** ftUSD `owner` + `masterMinter` + `pauser` + `blacklister`; owner of Core, MintAndRedeem, both wrappers, sftUSD, the staking breaker, and the Delta-Neutral strategy |
| Strategy operator (Safe) | [`0x5557729b169082f07d3131D560E2f2cb5e6c48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) | 3/5 Safe, identical signers to admin; `operators[]` = true |
| **Strategy operator (EOA)** | [`0x8dc8f616af6c146906b218f2acbdc2d27c9ac221`](https://etherscan.io/address/0x8dc8f616af6c146906b218f2acbdc2d27c9ac221) | **Plain EOA** (`operators[]` = true since block 25674942 / Aug 3, 2026). `onlyManager` trade/ops rights — not `owner` |
| Staking breaker guardian | [`0xdc86aD63Ca7dB1d8b703598b0735c08d5374c7eA`](https://etherscan.io/address/0xdc86aD63Ca7dB1d8b703598b0735c08d5374c7eA) | — |
| Staking breaker operator | [`0x765224780AD888285B03af221f528D0a6824994d`](https://etherscan.io/address/0x765224780AD888285B03af221f528D0a6824994d) | — |
| YieldClaimer | [`0x88432bB6EA62e774cB6d87995CC5277568d01397`](https://etherscan.io/address/0x88432bB6EA62e774cB6d87995CC5277568d01397) | Holds wrapper `execute()` arbitrary-call |

### Can Holders Lose Money?

| # | Path | Mechanism | Gating | Severity |
|---|---|---|---|---|
| 1 | **Unbacked mint** | Safe registers a new ftUSD Core module with an arbitrary ceiling, or replaces `minter()`, issuing ftUSD with no collateral | 3/5 Safe, no timelock | Total dilution |
| 2 | **Blacklist + balance wipe** | ftUSD `blacklist` then `wipeBlacklistedAddress` freezes and **burns** a holder's balance | 3/5 Safe | Total, targeted |
| 3 | **sftUSD balance wipe** | The staking vault has its **own** `wipeBlacklistedAddress` — a second, independent seizure layer | 3/5 Safe | Total, targeted |
| 4 | **Contract upgrade** | ftUSD, Core, MintAndRedeem, sftUSD and both wrappers are UUPS proxies upgradeable to arbitrary code | 3/5 Safe | Total |
| 5 | **Backing impaired inside FT Lend** | The collateral is a supply position in Flying Tulip's own market. Bad debt, a pause, or an admin action there impairs ftUSD's backing | structural | Partial to total |
| 6 | **Bad hedge execution** | Strategy `operators` pre-sign open/close/swap orders (`onlyManager`) with **no price or slippage bound**; a bad fill is a direct loss to backing | `operators[]` incl. **one EOA** | Partial |
| 7 | **`execute()` arbitrary call** | Strategy `owner` and wrapper `yieldClaimer` can forward arbitrary calls through contracts holding the backing | 3/5 Safe / YieldClaimer | Total |
| 8 | **Redemption capacity shortfall** | Redeeming requires FT Lend to have withdrawable liquidity, which requires Spark/Aave to have it | structural | Temporary to partial |
| 9 | **Rate-limited exit (sftUSD)** | 10% of TVL per window, 6h settlement, admin-settable to **7 days** | 3/5 Safe | Temporary lockup |
| 10 | **Rewards simply stop** | FT emissions are discretionary; sftUSD's exchange rate is fixed at 1.0, so no emissions means zero yield | epoch settler | Opportunity loss |
| 11 | **`recoverERC20` / `sweepExcess`** | Owner-callable token recovery on MintAndRedeem and sftUSD | 3/5 Safe | Partial |
| 12 | **Curve pool flight** | The only external ftUSD exit and the only external price reference | market | Exit degradation |

## Audits and Due Diligence Disclosures

The team provides gated portal access to the in-scope ftUSD, ftUSD Position Manager, Yield Claimer cotnracts audited by reputable firms.

| Item | Status |
|---|---|
| Public bug bounty | **LIVE** — [Sherlock Flying Tulip Bug Bounty #248](https://audits.sherlock.xyz/bug-bounties/248?tab=scope), max reward 1,000,000 USDC; **scope is ftPUT + FT OFT**, not ftUSD / sftUSD / MintAndRedeem (see below) |
| SEAL Safe Harbor enrolment | **Not enrolled** (absent from the `security-alliance/safe-harbor` registry) |
| Contract source verification on Etherscan | **PASS** — all contracts above verified |

- The docs' [Risks page](https://docs.flyingtulip.com/risks/) states a policy of "external audits before enabling capital-bearing features" and lists "Transparency. Publish parameters, addresses, **audit reports**, and incident post-mortems" as a security principle. The audit reports are not public.
- Only two reviews are publicly confirmable, and **neither covers the assessed contracts**: the token-sale `Escrow` (PeckShield #2025-170, Oct 2025; Cantina Managed, Oct 2025) and the separate **ftPUT** product ([Sherlock contest #1223](https://audits.sherlock.xyz/contests/1223), Jan 2026).

**Contract complexity is high:** module-gated minting on ftUSD Core, a discretionary Delta-Neutral strategy whose hedge orders carry no onchain price bound, wrapper/oracle paths into FT Lend, and a queued staking vault with an admin-extendable delay. Complexity of this order is precisely where public, finding-level audit disclosure matters most.

### Bug Bounty

**LIVE.** [Sherlock's Flying Tulip Bug Bounty #248](https://audits.sherlock.xyz/bug-bounties/248?tab=scope) has been live since June 18, 2026 and advertises a maximum reward of **1,000,000 USDC**. The [Scope](https://audits.sherlock.xyz/bug-bounties/248?tab=scope) tab is public: in-scope source is `flyingtulipdotcom/ftPUT` (`PutManager`, `pFT`, `ftYieldWrapper`, `CircuitBreaker`, Aave strategy, oracle/ACL) plus listed onchain deployments of that product and the FT OFT token — the same product family as [Sherlock contest #1223](https://audits.sherlock.xyz/contests/1223).

**Against this report's contracts:** none of ftUSD, ftUSD Core, `MintAndRedeem`, the ftUSD oracle, the Delta-Neutral strategy, sftUSD, the staking breaker, or the ftUSD wrappers appear in that scope. Two addresses that are listed also appear here, but only as shared infrastructure / reward token — not as coverage of the assessed mint/redeem/staking path:

| Address | Role in this report | In bounty scope? |
|---|---|---|
| [`0x88432bB6…1397`](https://etherscan.io/address/0x88432bB6EA62e774cB6d87995CC5277568d01397) | `YieldClaimer` (wrapper `execute`) | **Yes** |
| [`0x5DD1A7A3…082c`](https://etherscan.io/address/0x5DD1A7A369e8273371d2DBf9d83356057088082c) | FT token (sftUSD emissions) | **Yes** (FT OFT) |

## Historical Track Record

- **Production history:** ftUSD [deployed February 21, 2026](https://etherscan.io/tx/0x52e7d46b7e166b8e30c5d38a09d93c44537bcb77b439e5b125d8b51d5670ea21), live at the February 23 TGE — **~5.4 months**. sftUSD has settled **220 reward epochs**.
- **Supply:** 4,196,697 ftUSD against a `maxSupply` cap of 100M (raised from 5M). Of that, **1,324,455 (31.6%) is staked** as sftUSD and 1,428,403 is supplied into FT Lend.
- **Peg:** the protocol's oracle reads $0.9988. Independently, the Curve pool is near-balanced at 971,101 ftUSD / 903,390 USDC with `get_virtual_price()` = 1.000464 — so the peg is **externally corroborated**, not merely self-reported.
- **Incidents / depegs:** **NONE FOUND** through August 2026.
- **Third-party acceptance, with a caveat:** [Morpho](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) holds **629,675 ftUSD (15.0% of supply)** as collateral across two USDC markets. That is genuine external adoption for an asset this young — but Morpho does **not** independently price ftUSD; its oracle consumes Flying Tulip's own feed. See [The Morpho ftUSD markets](#the-morpho-ftusd-markets).
- **Accounting drift resolved.** An earlier check (August 3) found `Core.totalDebt` exceeding `totalSupply` by 40,310 ftUSD. At this block the two are **exactly equal** (4,196,696.769396 both). The drift was transient.

## Funds Management

### Minting and redemption

`MintAndRedeem` is the only enabled module on ftUSD Core. Mint is atomic: collateral transfers in, `wrapper.deposit()` is called, then `core.mint()` issues ftUSD — all in one transaction.

| Parameter | USDC | USDT |
|---|---|---|
| Enabled | ✓ | ✓ |
| `mintFeeBps` / `redeemFeeBps` | 7 / 7 | 7 / 7 |
| `maxValueFtUSD` (per-collateral cap) | 100M | 100M |
| `mintPriceHardcapWad` | 1.0 — collateral never valued above $1 | 1.0 |
| Accounted collateral | 2,781,367 | 1,417,610 |

Global gates: ftUSD `maxSupply` 100M, Core `globalDebtCeiling` 100M, `minTVLForMint` 5,000,000. Accrued fees: 6,575.28 ftUSD held on `MintAndRedeem`, sweepable by the owner via `sweepFees`.

**Redemption pricing is not a flat 1:1.** `redeemPriceBreakdown` returns a decomposition of `spotFactorWad`, `avgMintFactorWad` and `effectiveRedeemFactorWad` — redemptions are priced against a historical average mint factor, not purely spot. This is the mechanism the unverified audit finding referenced above concerns, and it is the single most important thing to model before sizing a large ftUSD position.

### Accessibility

| Action | Who | Atomic? | Fees | Limits / gating |
|---|---|:---:|---|---|
| **Mint ftUSD** | permissionless | ✓ one tx — collateral in, `wrapper.deposit()`, `core.mint()` | 7 bps | per-collateral cap 100M; `minTVLForMint` 5M; `globalDebtCeiling` 100M; `maxSupply` 100M; mint price hardcapped at $1.00 |
| **Redeem ftUSD** | permissionless | ✓ up to the window cap | 7 bps | **10% of wrapper capital per window, 6h settlement beyond that** (admin-settable to 7 days); total capacity capped by FT Lend's cash — USDT is ~15% short today. Priced off `min(spot, avgMint)` factors, not flat 1:1 |
| **Sell ftUSD** | permissionless | ✓ | Curve 0.2% + slippage | ~$500K at 0.30%; USDC side exhausted above ~$900K |
| **Stake (sftUSD)** | permissionless | ✓ | none | `minDepositAmount` 0 |
| **Unstake (sftUSD)** | permissionless | **✗ above the limit** | none | **10% of TVL per window; excess queued for 6h (`settlementDelay`), admin-settable to 7 days** |
| **Claim FT rewards** | permissionless | ✓ | none | only if the epoch settler has funded an epoch |
| Blacklist / burn | 3/5 Safe | ✓ | — | applies at both the ftUSD and sftUSD layers |

**Redemption is permissionless and same-transaction up to the window cap.** Beyond ~10% of wrapper capital it queues for 6 hours, and total redeemable size is bounded by FT Lend's available cash for that asset — a constraint that is **already binding on USDT** (see [Redemption capacity](#redemption-capacity--the-cascade)). "Atomic" is a property of the transaction, not a guarantee of capacity.

### Collateralization — the backing chain

Complete reconciliation at block `25697429`:

```
User mints ftUSD with USDC/USDT
   └─► MintAndRedeem  0xAa48EcBC…D23C     (holds ~0 collateral — custody is NOT here)
         └─► wrapper.deposit()
               ftUSD-USDC wrapper 0x6aaf8456…837D   capital 2,781,366.71 USDC
               ftUSD-USDT wrapper 0x28CCa8eE…47D6   capital 1,417,609.56 USDT
                     └─► MultiCollateralDeltaNeutralStakingStrategy 0xe0E44596…1A59
                           ├─► FT Lend: 2,780,139.26 USDC supplied
                           ├─► FT Lend: 1,417,609.56 USDT supplied
                           ├─► FT Lend: 76.54 wstETH supplied (bought with borrowed WETH)
                           ├─► FT Lend: 95.01 WETH borrowed (matching hedge liability)
                           └─► Aave: 1,227.45 USDC residual
```

| Check | Value |
|---|---|
| ftUSD `totalSupply()` | 4,196,696.77 |
| ftUSD Core `totalDebt()` | 4,196,696.77 ✓ |
| `accountedCollateralTvl()` | 4,198,976.27 |
| — USDC / USDT components | 2,781,366.71 / 1,417,609.56 ✓ |
| Located in wrappers | 2,781,366.71 / 1,417,609.56 ✓ |
| **Collateral ratio** | **100.054%** |

**The backing genuinely exists and reconciles to the wei.** That is a real strength and better than many larger stablecoins. The risk is not that the collateral is missing — it is *where* the collateral is.

**This is a leveraged portfolio, not a vault holding only stablecoins.** The original ftUSD principal remains predominantly supplied as USDC/USDT, while the strategy adds a long wstETH position financed by WETH debt. Ordinary ETH/USD moves should largely offset across those two ETH-denominated legs, but wstETH/ETH basis risk, borrowing costs, unwind liquidity, and execution losses remain. If wstETH cannot be sold and the WETH debt repaid promptly, redemptions can lose capacity; if wstETH is impaired relative to WETH, the unmatched loss reduces ftUSD backing.

### The backing is lent into Flying Tulip's own market

ftUSD's collateral is not idle cash. It is a **supplier position in FT Lend**, the protocol's own money market, worth **$4.38M = 35.1% of that market's entire TVL**.

Consequences for an ftUSD holder:

1. **You are a lender in FT Lend whether you intended to be or not.** Every risk in the [FT Lend report](./flying-tulip.md) — bad debt with no backstop, admin upgrade, oracle override, Spark/Aave dependency with zero idle buffer for your ftUSD. Most of the time it's not a problem, because Spark and Aave have big TVL and no liquidity rarely occurs.
2. **The circle closes.** ftUSD is *also* an accepted collateral in that market (11.4% of its TVL) and *also* borrowable there. A shock propagates in a loop rather than being absorbed.
3. **Your price feed does not read your backing.** `FtUsdMintRedeemOracleProxy` prices ftUSD from Chainlink USDC/USD and the `MintAndRedeem` redeem factor, which is derived from cumulative mint history rather than the accounted collateral deployed inside FT Lend. A genuine impairment would not surface in that feed. The Curve pool is the only external market signal.
4. **Redemption capacity is not independent.** Redeeming at size requires FT Lend to have withdrawable liquidity, which requires Spark/Aave to have it.

### The hedge, and who runs it

The "delta-neutral" leg is now live. It was **not running as recently as August 3** (0 wstETH, 0.34 WETH debt); by August 6 it holds 76.54 wstETH as collateral and owes 95.01 WETH — 99.6% of all WETH debt in FT Lend. `targetLeverageBps` = 10500 (1.05×), `borrowAsset` = WETH, `stakingAsset` = wstETH. The WETH is borrowed from FT Lend itself: external WETH suppliers economically fund the loan, while the same Flying Tulip 3/5 Safe controls both the borrower strategy and FT Lend's administrative configuration. These are therefore related, vertically controlled components rather than independent counterparties.

**Losses can propagate in both directions.** A hedge loss reduces the net equity backing ftUSD; if it also leaves unrecoverable WETH debt, FT Lend's WETH suppliers can absorb bad debt. Conversely, FT Lend illiquidity or an administrative restriction can prevent the strategy from withdrawing stablecoins or unwinding wstETH, reducing ftUSD redemption capacity even before a permanent accounting loss occurs.

**Control is split between `owner` and `operators`:**

| Layer | Who | Gate | Powers |
|---|---|---|---|
| `owner()` | 3/5 Admin Safe (was deployer EOA [`0x92c3eb78…61f4`](https://etherscan.io/address/0x92c3eb785069f58657bfcaa116d9ce7d56e361f4) until block 25302049) | `onlyOwner` | Config: `setOperator`, `setLeverageEngine`, `setCollateralWrapper(s)`, `setftYieldWrapper`; also **`execute(address,uint256,bytes)`** |
| `operators` | [`0x5557729b…48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) — 3/5 Safe, identical signers | `onlyManager` | See operator action list below |
| `operators` | **[`0x8dc8f616…c221`](https://etherscan.io/address/0x8dc8f616af6c146906b218f2acbdc2d27c9ac221) — plain EOA** (codesize 0; `OperatorSet` at block [`25674942`](https://etherscan.io/tx/0x4f642f298395d44d0fdfe90126d24ab5f58f3fae5f86d9a915b98e777b5db198)) | `onlyManager` | Same operator action list |

`onlyManager` = `msg.sender == owner() || operators[msg.sender]`. Operators share **trade/ops** rights with the owner under that modifier. They cannot change the operator set or call the strategy's separate arbitrary-call `execute(address,uint256,bytes)` function, which are both `onlyOwner`; this restriction does not apply to filling pre-signed RFQ orders.

**Operator (`onlyManager`) actions:**

| Function | What it does |
|---|---|
| `approveOpenOrder` | Pre-signs an open hedge order via `LeverageRfqEngine` (borrow WETH / buy wstETH path) |
| `approveCloseOrder` | Pre-signs a close hedge order |
| `approveSwapCollateralOrder` | Pre-signs a collateral-swap order |
| `revokeOrder` / `revokeOrderByDigest` | Revokes a pending pre-signed order |
| `cancelOrder` | Cancels an order |
| `setTargetLeverageBps` | Sets the strategy's target leverage parameter |
| `claimStakingYield` | Claims staking yield on the hedge leg |

Those `approve*Order` calls invoke `pm.approveBorrow` / `pm.approveEngine` and pre-sign through `LeverageRfqEngine` — that is the path that moves hedge risk on the backing.

**Order validation carries no price bound.** `_validateCommonOrder` checks only that `order.user == address(this)`, that the order has not expired, and that both amounts are non-zero. `_validateOpenOrder` adds a direction check (sell WETH, buy wstETH). There is **no price check, no slippage bound**, and `targetLeverageBps` is not enforced in validation — it is used for previews. `LeverageRfqEngine.broadcastOrder` only checks `order.user == msg.sender` and pre-signs; the engine source contains no oracle reference at all.

**Net: a single EOA with `operators[] = true` can pre-sign hedge open/close/swap orders on the strategy at an arbitrary execution price.** It cannot change the operator set or call the strategy's separate arbitrary-call `execute(address,uint256,bytes)` function; those administrative powers are `onlyOwner`. However, once the EOA pre-signs an RFQ order, anyone—including that EOA or an accomplice—can fill it through the public `LeverageRfqEngine` fill functions. The only onchain backstop on fills is the `PositionsManager` health-factor check, which does not enforce an oracle-relative price or slippage limit. This is the most acute finding in this report.

**Live example (Aug 12, 2026) — authorise ≠ execute:**

1. **Pre-sign** — operator EOA [`0x8dC8…c221`](https://etherscan.io/address/0x8dC8f616Af6C146906B218f2acbdc2D27C9ac221) called `approveOpenOrder` on the strategy ([tx `0x0d9e6a…dab9`](https://etherscan.io/tx/0x0d9e6a543935e31ef8323ccadc624329a8f10274c3e5a8adec3e6d2d1ae0dab9), block `25738326`): OPEN **10 WETH → min 8.048 wstETH**, `feeAmount` 0, ~20 min `validTo`. Events: PM `borrowAllowance` for the leverage engine (+10 WETH), engine `PreSignature` + `OrderBroadcast` (digest `0x13e44b…8d92`). **No tokens moved.**
2. **Fill** — five blocks later, a separate filler [`0xa505…b9d8`](https://etherscan.io/address/0xa505815A526f1200c17B7ffaE0067318d734b9d8) called `openLeverageFlash` on `LeverageRfqEngine` ([tx `0x1b0ea2…aefe`](https://etherscan.io/tx/0x1b0ea29d9fa6dbf1776225dca3f7d63081858288b9157d086ee74ec8fbe2aefe), block `25738331`) and completed the borrow/swap/deposit. `filledDigests[digest] = true`.

Implied rate on that order (~1.2425 WETH/wstETH) was ~0.09% under fair `stEthPerToken` at the pre-sign block — normal ops sizing, not a bad fill. It still demonstrates the split: the EOA alone locks the limit price; any filler can take it; PM only gates size via HF.

### Staked ftUSD (sftUSD)

| Property | Value |
|---|---|
| `totalAssets` / `totalSupply` | 1,324,454.74 / 1,324,454.74 |
| **`convertToAssets(1e6)`** | **exactly `1000000`** |
| Underlying wrapper strategies | **0 configured**, `deployed()` = 0 — the ftUSD sits idle |
| Reward token | **FT**, 139,602.48 pending in the vault (~$13.9K) |
| Epochs settled | 220 |
| Holders | 107 |
| Paused | false |

**sftUSD never appreciates in ftUSD terms.** The exchange rate is fixed at 1.000000 and the underlying wrapper has no strategy, so 100% of the return is FT token emissions, claimed separately via `claim()`. Those emissions are funded by the epoch settler at its discretion — nothing obliges it. On the lending side of the protocol the same mechanism has paid **zero** emissions to WBTC and ftUSD suppliers for the market's entire life, so "emissions may simply not arrive" is a demonstrated behaviour, not a hypothetical.

The reward token itself is close to unsellable at size: aggregate FT quote-side DEX liquidity is roughly **$28K**.

### How ftUSD is priced

Every venue that prices ftUSD — FT Lend's liquidation engine and both Morpho markets — reads the same contract: `FtUsdMintRedeemOracleProxy` [`0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8). It is a Chainlink-shaped `AggregatorV3Interface` wrapper, 8 decimals, **owned by the 3/5 admin Safe**, with `baseFeed`, `mintRedeem` and `usdc` set `immutable` at construction.

**Step 1 — read Chainlink USDC/USD and validate it.** `baseFeed` is canonical Chainlink USDC/USD. The wrapper reverts if `paused`, if the round is incomplete (`answeredInRound < roundId`, `updatedAt == 0`, or a future timestamp), if the round is older than `maxStaleness` (currently **86,400s / 24h**), or if the answer is non-positive.

**Step 2 — derive ftUSD from the mint/redeem engine.** `_quoteAnswer` queries `MintAndRedeem` twice and takes the **lower** of two estimates:

```
mintOut   = previewMint(USDC, 1e6)      // ftUSD received for 1.000000 USDC
redeemOut = previewRedeem(USDC, 1e6)    // USDC received for 1.000000 ftUSD

mintImplied = usdcUsd × 1e6 / mintOut       // what it costs to create 1 ftUSD
redeemValue = redeemOut × usdcUsd / 1e6     // what 1 ftUSD returns on exit

answer = min(mintImplied, redeemValue)
```

Live at block `25697429`: `mintOut` = 999,067 and `redeemOut` = 999,050, with USDC/USD at $0.99989 →

| Leg | Value |
|---|---|
| mint-implied price | $1.000827 |
| redeem value | $0.998944 |
| **`answer` = min(...)** | **$0.998944** |

**Step 3 — what those previews are actually made of.** This is the part that matters. `previewRedeem` resolves through `_redeemFactorWad` → `_redeemFactorDecomposition` (`MintAndRedeem` line 1722), which builds the `RedeemFactorDecomposition` struct returned publicly by `redeemPriceBreakdown(address)`:

```
spotFactorWad    = _redeemFactorFromPriceWad( oracle.priceUSD(USDC) )
avgMintFactorWad = f( cinfo.totalFtUSDMinted / cinfo.totalIn )   // cumulative counters
effectiveRedeemFactorWad = min(spotFactorWad, avgMintFactorWad)
```

`oracle` on `MintAndRedeem` is the FT Lend `OracleRouterChainlink` [`0xe4372dB4…674A`](https://etherscan.io/address/0xe4372dB43D2814750a19b93950157AD81D93674A), and `priceUSD(USDC)` resolves to canonical Chainlink USDC/USD. `_redeemFactorFromPriceWad` is a clamp — returns the price if ≤ 1.0, else `1e18²/price` — so the factor can never exceed 1.

Live: `spotFactorWad` 0.99976752, `avgMintFactorWad` 0.99975037, `effectiveRedeemFactorWad` 0.99975037.

**Neither input measures the collateral.** `spotFactor` is a function of the **USDC price**. `avgMintFactor` is a function of **cumulative mint history** — counters that move only on mint/redeem, never on a change in collateral value. `_quoteRedeemExactOutput` (line 1449) consults only the factor and the fee. Nothing in the path reads `accountedCollateralTvl`, wrapper `capital()`, or the strategy's position.

> **The oracle is structurally blind to the state of ftUSD's backing.** If the collateral were impaired or gone, `previewRedeem(USDC, 1e6)` would still return ~999,050 and the feed would still report ~$0.9989. There is no lag to measure, because there is no propagation path at all.

**This is not circularity.** Tracing the call graph — `OracleRouter.priceUSD(ftUSD)` → this proxy → `MintAndRedeem.preview*` → `OracleRouter.priceUSD(USDC)` → Chainlink — the router is touched twice but with *different assets*, so there is no cycle and no recursion. The accurate description is simpler and worse than circularity: **ftUSD is priced as ≈ USDC, adjusted only by fees and historical mint ratios.** A circular feed would at least track the backing with lag; this one does not track it at all.

**What the design does protect against.** Every guard in the path is aimed at the collateral *changing price*: the clamp caps the factor at 1.0 whether USDC trades above or below a dollar, and `min(spot, avgMint)` ensures a redeemer can never extract more than the cheaper of {current price, historical average mint price}. That is coherent and deliberately conservative. It is simply aimed at a different risk than the one this system carries — the collateral here is a lending position, and the design is silent on whether it is still there.

**A pause here is a cross-protocol denial-of-service.** `setPaused(true)` on this proxy makes `latestRoundData` revert. That does not just stop FT Lend pricing ftUSD — it also breaks the Morpho oracle that consumes it (below), freezing borrows and liquidations in a third-party protocol. The 3/5 admin Safe holds that lever.

### Redemption capacity — the cascade

Redemption is **real and permissionless**: `redeem`, `redeemExact`, `redeemTo` and the session variants are all public, 7 bps, atomic in code. ftUSD is not swap-only. But "atomic" describes the transaction, not the capacity — and the capacity is a four-hop unwind:

```
MintAndRedeem  (holds ~0 collateral — only wrapper shares)
  └─ wrapper.withdraw
       └─ Delta-Neutral strategy
            └─ withdraw from FT Lend   ← capped by FT Lend's available CASH
                 └─ FT Lend wrapper → Spark   (zero idle buffer)
```

Live at block `25697429`:

| | USDC | USDT |
|---|---:|---:|
| ftUSD wrapper `capital()` | 2,781,366.71 | 1,417,609.56 |
| ftUSD wrapper `availableToWithdraw()` | 2,781,366.71 | **1,206,351.08** |
| **Shortfall** | 0 | **211,258.48 (14.9%)** |
| FT Lend cash for that asset | 2,934,606.16 | **1,206,351.08** |
| FT Lend borrowed by others | 241,017.83 | 223,541.39 |
| Breaker instant capacity (10%) | 278,136.67 | 141,760.96 |

The USDT wrapper's `availableToWithdraw` equals FT Lend's USDT cash **to the cent** — confirming the constraint is exactly the lending market's liquidity. **About 15% of ftUSD's USDT backing is not redeemable right now**, because third parties have borrowed it inside FT Lend. This is normal operation, not stress.

**On top of that, redemption is rate-limited.** Both ftUSD backing wrappers are protected by the same `CircuitBreaker` [`0xCB210509…7355`](https://etherscan.io/address/0xCB210509F5AE2b3843B7Fb8Bb90bAFF9cE4f7355) that gates sftUSD unstaking: **10% of wrapper capital per window**, with a **6h `settlementDelay`** (admin-settable 5 min – 7 days) beyond that.

**How the redeem factor behaves over time.** `avgMintFactorWad` is derived from `cinfo.totalFtUSDMinted / cinfo.totalIn`. Both are **cumulative mint-side counters that only ever increase** (`+=` at `MintAndRedeem` lines 1581–1582); redemptions increment separate counters (`totalOut`, `totalFtUSDBurned`) that do not enter the calculation. Live for USDC: `totalIn` 4,218,502 and `totalFtUSDMinted` 4,217,456 → ratio 0.999752, matching the observed factor.

Two consequences:

- **It is a lifetime average, and it gets stickier with age.** Each new mint moves it by a shrinking fraction as `totalIn` grows. Early mints anchor it permanently. Over time `avgMintFactorWad` asymptotes to a constant and stops responding to anything at all.
- **`effective = min(spot, avgMint)` therefore degenerates.** Once the average is effectively frozen, the redeem factor is `min(USDC-price factor, constant)` — which reinforces the backing-blindness above. This is the answer to "how does redemption behave under a moving mint factor": it increasingly doesn't move.

The asymmetry itself is conservative for solvency (appreciation retained, depreciation passed through), so this is not an insolvency mechanism in the direction the unverified audit finding suggests. But it does mean the redeem factor carries progressively less information as the protocol matures.

**Practical exit menu for a holder:**

| Size | Best route | Cost | Binding constraint |
|---|---|---|---|
| < ~$140K | Redeem | 7 bps, instant | none today |
| $140K – $500K | Curve, or queued redemption | 0.22–0.30% vs 7 bps + 6h | breaker window |
| > $500K | Split across both | — | USDT redemption ceiling ~1.21M, Curve USDC side ~903K |

**Note the interaction with the oracle.** At this block the feed reports ftUSD at $0.9988 while ~15% of the USDT backing cannot be withdrawn. Reported price and actual redeemability are already decoupled under entirely normal conditions, and the oracle has no channel through which that gap could ever appear.

### The Morpho ftUSD markets

ftUSD is live collateral in **two Morpho Blue markets**, both lending USDC, both created in June 2026:

| Market ID | Loan | Collateral | LLTV | Supplied | Borrowed | Util |
|---|---|---|---|---:|---:|---:|
| [`0x88ab06d4…8acf`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | USDC | ftUSD | **86.0%** | 450,213 USDC | 405,868 USDC | **90.1%** |
| [`0x5497d843…d2ac`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | USDC | ftUSD | 91.5% | 1.00 USDC | 0 | — |

Both use `AdaptiveCurveIrm` [`0x870ac11d…00bc`](https://etherscan.io/address/0x870ac11d48b15db9a138cf899d20f13f79ba00bc), Morpho's standard rate model. Morpho holds **629,675 ftUSD** of posted collateral in total, against 405,868 USDC of debt — a blended LTV of roughly **64.5%** against an 86% liquidation threshold, so the live market is currently healthy with meaningful headroom.

**The oracle is the important part.** The markets price ftUSD through `MorphoChainlinkOracleV2` [`0x7887afbe7581eb01b3d91d80c198b0275feab779`](https://etherscan.io/address/0x7887afbe7581eb01b3d91d80c198b0275feab779), configured as:

| Parameter | Value |
|---|---|
| `BASE_FEED_1` | [`0xA69f7a38…DFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8) — **Flying Tulip's own `FtUsdMintRedeemOracleProxy`** |
| `QUOTE_FEED_1` | [`0x37be050e…8cAa`](https://etherscan.io/address/0x37be050e75C7F0a80F0E8abBFC2c4Ff826728cAa) — canonical Chainlink USDC/USD |
| `BASE_VAULT` / `QUOTE_VAULT` | none |
| `SCALE_FACTOR` | 1e36 |
| `price()` | 998,924,165,380,579,646,955,586,648,201,499,387 → **0.998924 USDC per ftUSD** |

**This materially qualifies the "third-party validation" reading.** Morpho *accepts* ftUSD as collateral, which is genuine external adoption. But Morpho does **not independently price it** — it consumes Flying Tulip's redemption-factor feed. Three consequences:

1. **The backing-blindness propagates outward.** Morpho's ftUSD price is Flying Tulip's feed, which is a function of the USDC price and mint history — not of the collateral. An impairment of ftUSD's backing would never reach Morpho's liquidation engine through this path, so Morpho lenders could be under-collateralized with no onchain signal at all.
2. **The Flying Tulip admin Safe holds a DoS lever over a third-party protocol.** Pausing the ftUSD oracle proxy makes `price()` revert, freezing borrows and liquidations in these Morpho markets.
3. **The 86% LLTV market is 90.1% utilized.** Exit liquidity for Morpho lenders is thin in the same conditions that would stress ftUSD, and ftUSD collateral posted there is not available to support the ftUSD peg.

For an ftUSD holder this is a second-order but real exposure: 629,675 ftUSD (15.0% of supply) is locked as Morpho collateral and would need to be unwound through the same Curve pool or redemption path that everyone else uses.

### Provability

- **Reserves reconcile exactly** (table above) and every hop is readable onchain by anyone. Genuine strength.
- **But verification takes four hops** through contracts that public documentation does not describe, and the final hop lands inside another Flying Tulip product rather than at a custodian or a liquid buffer.
- **The price feed does not read the backing.** It is a function of the USDC price and cumulative mint history, so nothing a holder verifies about the collateral can ever reach the price the protocol uses. It also carries a 0 bps deviation tolerance, so no cross-check is attempted.
- **No public source repository** and no public audit reports — review is limited to reading verified bytecode.
- **The Curve pool is the only external price reference** — the only place a backing problem could surface as a price, but its liquidity is protocol-adjacent rather than independent.

## Liquidity Risk

### ftUSD

| Venue | Depth | Notes |
|---|---|---|
| **Curve StableSwap-NG** [ftUSD/USDC](https://etherscan.io/address/0xafec61e7a604f8f81f7cab64ec75bfa07c542630) | **971,101 ftUSD / 903,390 USDC (~$1.87M)** | A=1000, fee 0.2%, near-balanced |
| Curve Twocrypto [FT/ftUSD](https://etherscan.io/address/0x68102ff5406475881462880a8da3c9bc9181ad6c) | 48,838 ftUSD | thin |
| Uniswap V3 0.05% | 0.000033 ftUSD | dust, unusable |
| Protocol redemption | subject to FT Lend liquidity | 7 bps fee |

Measured slippage on Curve (`get_dy`, ftUSD → USDC):

| Size | Out | Slippage |
|---|---|---|
| 10,000 | 9,979.15 USDC | 0.209% |
| 100,000 | 99,780.80 USDC | 0.219% |
| 250,000 | 249,398.14 USDC | 0.241% |
| 500,000 | 498,495.41 USDC | **0.301%** |

A holder can exit **$500K at 0.30%** without touching the protocol. That is a genuine, measured secondary market and the strongest single point in ftUSD's favour. Above ~$900K the pool's USDC side is exhausted and redemption becomes the only route — which then depends on FT Lend liquidity.

### sftUSD — rate-limited

Unstaking passes through the staking `CircuitBreaker`:

| Parameter | Value |
|---|---|
| `withdrawalCapacity(ftUSD, TVL)` | **132,445 = exactly 10% of staked TVL** |
| `settlementDelay` | **21,600s = 6 hours** |
| Admin-settable range | `MIN_DELAY` 300s → **`MAX_DELAY` 604,800s = 7 days** |
| Queue used historically | `nextQueueId` = 11 (~10 queued withdrawals) |
| Currently queued | `activeQueueCount` = 0 |
| Currently available | `availableToWithdraw` = 100% of TVL |

Withdrawals beyond 10% of TVL per window route to `redeemWithQueueId` / `withdrawWithQueueId` and settle after the delay. **The admin can raise that delay to 7 days in one transaction with no timelock.** There is no secondary market for sftUSD itself.

### The Curve pool is protocol-adjacent liquidity

The ~$1.87M ftUSD/USDC StableSwap-NG pool ([`0xafec61e7…2630`](https://etherscan.io/address/0xafec61e7a604f8f81f7cab64ec75bfa07c542630)) is the only external ftUSD venue and the only external ftUSD price. Inspecting who actually provides it:

| Layer | Holder | Share |
|---|---|---|
| Pool LP tokens | [Curve gauge `0x8abf0a7e…7c3f`](https://etherscan.io/address/0x8abf0a7e4b59ace59cb214fcb158285cd7cf7c3f) (`LiquidityGaugeV6`) | **100.0%** |
| Gauge deposits | EOA [`0x3ffebdc5…46ee`](https://etherscan.io/address/0x3ffebdc5130f6072a582f79f3fb61581d3d846ee) | **99.998%** |

**A single EOA provides essentially all of it**, and that address also holds 23,941 sftUSD. The gauge's `manager` is [`0x3c427497…1B4E`](https://etherscan.io/address/0x3c42749709BF354B3aE0Db29Fd2dd88089b21B4E) — **one of the five admin Safe signers**. A second signer, [`0xD0CA8838…6f5A`](https://etherscan.io/address/0xD0CA88388d1732594D611535314e9B6745396f5A), holds a dust gauge position.

Pool parameters are otherwise unremarkable and healthy: `A` = 1000 with `future_A_time` = 0 (no ramp in progress), fee **0.2%**, `admin_fee` 50% of fees, `offpeg_fee_multiplier` 2.5×, `get_virtual_price` 1.000465.

**This qualifies how the Curve venue should be read.** The pool is real, tradeable by anyone, and the measured slippage is genuine — but:

1. **It is not a durable exit.** One EOA can withdraw it. The $500K-at-0.30% capacity is that party's continued willingness to provide liquidity, not a property of the market.
2. **It is not independent price corroboration.** A pool made almost entirely by one protocol-adjacent party, with an admin signer as gauge manager, is closer to protocol-owned liquidity than to a third-party market. The peg is "corroborated" by a market the protocol effectively makes. That is better than no market at all — arbitrage against it is still real and permissionless — but it is not an outside check.

Note this is the same pattern as the Morpho finding: an external venue that looks like third-party validation but, on inspection, either consumes the protocol's own oracle (Morpho) or is provided by the protocol's own circle (Curve).

### Holder concentration

**ftUSD holders** (top balances): the largest non-protocol holders are the Curve pool (971,101), Morpho (629,675) and the FT Lend ftUSD wrapper (1,106,633). Circulating ftUSD is meaningfully absorbed by protocol-adjacent venues rather than distributed retail.

**sftUSD is well distributed** — genuinely better than the lending market:

| # | Holder | Balance | Share | Cumulative |
|---|---|---|---|---|
| 1 | [`0x5786c96f…a088`](https://etherscan.io/address/0x5786c96f80ad6a00de474b85bb83dc537d8aa088) | 160,440 | 12.1% | 12.1% |
| 2 | [`0x73bdf9f0…f124`](https://etherscan.io/address/0x73bdf9f02f5f093fde140fb6e4fbbc8fc4d0f124) | 159,723 | 12.1% | 24.2% |
| 3 | [`0x80d0d540…9ee8`](https://etherscan.io/address/0x80d0d54050c15971b21e877d95441800f5aa9ee8) | 115,145 | 8.7% | 32.9% |
| 4 | [`0xe5dab7ec…eb6a`](https://etherscan.io/address/0xe5dab7ec38f91f97c34f9f35eee683150a15eb6a) | 109,673 | 8.3% | 41.1% |
| 5 | [`0x9a4a20fc…7317`](https://etherscan.io/address/0x9a4a20fc422f849caa37fd32a873223e23077317) | 99,881 | 7.5% | 48.7% |
| … | 102 others | | | 100% |

107 holders, top-1 at 12.1%, top-10 at 66.9%. Note holder #8 [`0xb7b54333…08bc8`](https://etherscan.io/address/0xB7B543337539219A5a1326aCB71dBa8Bba408bc8) (49,923, 3.8%) is **an admin Safe signer**.

## Centralization & Control Risks

### Governance

The same 3-of-5 Gnosis Safe [`0x1118…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) with **no timelock** owns every contract in this report. Over ftUSD specifically it is `owner` + `masterMinter` + `pauser` + `blacklister`.

### Token Mint Authority

**Mint mechanism:** single role-gated `minter()` fronted by a debt-ceiling module system. **Mint requires backing** for the one enabled module.

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x56c5892B…8ca9`](https://etherscan.io/address/0x56c5892B0cF41B792217CCDD208f0FA85B178ca9) | ✓ | ✓ | sole `minter()`, allowance ≈ 2²⁵⁶−1 | **ftUSD Core** — mints only for enabled modules within their ceilings |
| [`0xAa48EcBC…D23C`](https://etherscan.io/address/0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C) | ✓ (via Core) | ✓ | enabled module, ceiling **100M**, `moduleDebt` 4,196,696.77 | **MintAndRedeem** — the only enabled module; collateralized |
| [`0x1118e1c0…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | **indirectly, unbacked** | ✓ | `owner` + `masterMinter` + `pauser` + `blacklister` | **3/5 Safe** — `configureMinter` / `removeMinter` / `updateMasterMinter`, enable an arbitrary new Core module, `setMaxSupply`, `pause`, **`blacklist` / `wipeBlacklistedAddress`**, `upgradeToAndCall` |

**Rate limits / caps:** ftUSD `maxSupply` 100M; Core `globalDebtCeiling` 100M; per-collateral cap 100M each.

**Backing check at mint time:** atomic. **But** the masterMinter can register an arbitrary new module or replace the minter, issuing unbacked ftUSD — gated only by a 3-of-5 multisig with no delay.

### Programmability

Mint/redeem accounting, the collateral reconciliation and the sftUSD share math are all onchain and verifiable. Against that: proxy upgrades are instant, oracle prices are admin-overridable at the router, FT emissions are entirely discretionary, and the backing strategy's `operators[]` (including a plain EOA) can pre-sign hedge orders with **no price bound** via `onlyManager`. The staking exit is a governed rate limiter, not a programmatic guarantee.

### External Dependencies

- **FT Lend** — where the stablecoin principal, wstETH hedge collateral, and WETH hedge debt are recorded in one strategy account. The same Admin Safe controls the ftUSD strategy and FT Lend's administrative configuration; external suppliers provide the borrowed WETH. See the [companion report](./flying-tulip.md). **Critical.**
- **Spark & Aave** — FT Lend's wrappers hold zero idle buffer, so redemption capacity ultimately depends on these venues.
- **Lido / wstETH** — now a live component of the hedge (76.54 wstETH).
- **Chainlink** — USDC/USD feeds the ftUSD oracle's base leg.
- **Curve** — the only external ftUSD exit and the only external price reference. **Its liquidity is protocol-adjacent, not independent** — see below. Assessed.
- **Morpho** — two USDC/ftUSD Blue markets holding 629,675 ftUSD (15.0% of supply); the live one is at 86% LLTV and 90.1% utilization. Its oracle reads Flying Tulip's own ftUSD feed, so this is an outward **propagation** channel rather than an independent price check, and pausing the FT oracle proxy would freeze these markets.
- **CoW Protocol — not a dependency.** An earlier revision listed this after seeing `GPv2Settlement` and a `CowSwapBurner` in ftUSD transfer history and CoW-style naming (`setPreSignature`, `PreSignature`) in the engine. Both were misleading: `preSignature` is `LeverageRfqEngine`'s own `mapping(bytes32 => bool)`, the engine contains **zero** references to GPv2/CoWSwap/vaultRelayer across its 250KB of source, and neither the strategy nor the engine has any allowance to CoW's vault relayer. The `CowSwapBurner` is Curve's fee burner for the ftUSD/USDC pool. Fills go through the engine's own flash-fill path with a caller-supplied `fillTarget` and `fillData`.

## Operational Risk

Identical team, entity and disclosure profile to the lending report: public founder (Andre Cronje) with a mixed track record, ~15 anonymous team members, **no disclosed legal entity or jurisdiction**, no DAO or forum, undisclosed multisig signers, no public incident-response runbook despite the docs claiming one.

Two disclosure gaps specific to this report:

1. **The docs do not disclose that ftUSD's backing is lent into FT Lend.** A holder reading the public material would reasonably believe the collateral is held in a conventional custody or yield arrangement.
2. **The "delta-neutral" description was inaccurate until three days ago.** The strategy held no hedge at all until ~August 3–6, 2026, while being marketed as delta-neutral since launch.

## Monitoring

Recommended frequency: **hourly** for peg, oracle divergence and governance; **daily** for backing reconciliation and cap headroom.

### Backing and solvency

- Reconcile `ftUSD.totalSupply()` vs `Core.totalDebt()` vs `MintAndRedeem.accountedCollateralTvl()` vs the sum of both wrappers' `capital()`. Alert on **>0.5% divergence** or on any reappearance of the debt-vs-supply drift.
- Track the Delta-Neutral strategy's FT Lend positions and its **WETH debt and health factor** — it is 99.6% of all WETH borrows, so its liquidation would be FT Lend's first at size and a direct hit to backing.
- Alert if `deployed()` on either ftUSD wrapper moves to a new strategy, or if `MintAndRedeem.collateralInfo(token).yieldWrapper` changes.

### Peg and oracle

- **Compare the Curve spot price against `priceUSD(ftUSD)` from the router.** This is the only external market signal on a feed that cannot see the backing. Alert on >0.5% divergence.
- Alert on `PausedSet` / `AnswerBoundsSet` / `MaxStalenessSet` on the ftUSD oracle proxy, and on any `setLastGoodPrice(ftUSD, …)` at the router.
- Alert if the Curve pool becomes >70/30 imbalanced or loses >50% of its TVL — that removes the only external market signal.
- Poll `previewMint(USDC, 1e6)` and `previewRedeem(USDC, 1e6)` directly — these are the oracle's two inputs, and they propagate to FT Lend *and* Morpho.
- Alert on `redeemPriceBreakdown(USDC)` when `spotFactorWad` falls below `avgMintFactorWad` — the point at which redeemers start absorbing collateral depreciation.
- **Do not rely on the oracle to detect a backing problem.** It reads the USDC price and mint history, not the collateral, so it will report par through an impairment. The reconciliation below and the Curve comparison are the only signals that would move.
- **Poll `availableToWithdraw()` vs `capital()` on both ftUSD wrappers.** This is the live measure of redeemability and it is already short on USDT. Alert if the gap exceeds 25% on either asset, or if it appears on USDC (currently zero).
- **Alert on `setPaused` on the ftUSD oracle proxy.** It halts pricing in FT Lend and simultaneously freezes both Morpho markets.

### Curve liquidity

- Track the gauge [`0x8abf0a7e…7c3f`](https://etherscan.io/address/0x8abf0a7e4b59ace59cb214fcb158285cd7cf7c3f) balance of [`0x3ffebdc5…46ee`](https://etherscan.io/address/0x3ffebdc5130f6072a582f79f3fb61581d3d846ee). One EOA is 99.998% of the gauge and therefore ~100% of the pool; its withdrawal removes both the exit and the price reference in a single transaction.
- Alert on pool imbalance beyond 70/30 and on `A` ramp initiation (`future_A_time` becoming non-zero) — a ramp changes slippage materially and the pool has an admin able to start one.

### Morpho exposure

- Track market [`0x88ab06d4…8acf`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) (86% LLTV): `totalSupplyAssets`, `totalBorrowAssets` and posted ftUSD collateral. It is currently 90.1% utilized, so Morpho lenders have thin exit capacity in exactly the conditions that would stress ftUSD.
- Alert if the blended LTV there rises above ~75% (currently ~64.5% against an 86% threshold), or if `MorphoChainlinkOracleV2.price()` starts reverting — the latter means the FT oracle proxy has been paused or has gone stale.
- Alert on any new Morpho market created with ftUSD as loan or collateral asset, and on `BASE_FEED_1` remaining pointed at Flying Tulip's own feed if a curated alternative appears.

### Mint authority — immediate alert

- `MinterConfigured`, `MinterRemoved`, `MasterMinterChanged` on ftUSD.
- **Any new module enablement on ftUSD Core** — this is the unbacked-mint path.
- `setMaxSupply`, `globalDebtCeiling` changes, `Blacklisted`, `wipeBlacklistedAddress`.
- `Upgraded` on ftUSD, Core, MintAndRedeem, sftUSD, and both wrappers.

### Strategy operations

- **`OperatorSet` on the Delta-Neutral strategy** — the set currently includes a plain EOA; any addition is material.
- **Owner-only (`onlyOwner`):** `setOperator`, `setLeverageEngine`, `setCollateralWrapper(s)`, `setftYieldWrapper`, any `execute()` call.
- **Operator (`onlyManager`, incl. the EOA):** `approveOpenOrder` / `approveCloseOrder` / `approveSwapCollateralOrder`, `revokeOrder` / `revokeOrderByDigest` / `cancelOrder`, `setTargetLeverageBps`, `claimStakingYield`.
- Monitor open/close order digests via `OrderBroadcast` on `LeverageRfqEngine` and compare realised fills against Chainlink at execution time — since no price bound exists in-contract, **this is the only detection mechanism for a bad fill**.

### Staking

- `settlementDelay` changes on the staking breaker (admin can go to 7 days), `activeQueueCount`, and `paused` on the sftUSD vault.
- `convertToAssets(1e6)` — if it ever deviates from `1000000`, the vault's economics have changed.
- FT balance in the vault and epoch cadence: a stall in `settleEpoch` means yield has stopped.

## Appendix: Contract Architecture

```
                      Admin Safe 3/5  0x1118…70Cb   (no timelock)
                      owner of EVERY contract below; ftUSD masterMinter/pauser/blacklister
                                    │
        ┌───────────────────────────┼────────────────────────────┐
        ▼                           ▼                            ▼
   ftUSD (UUPS)             MintAndRedeem  ──► ftUSD Core ──► mint (module ceiling 100M)
   blacklist + wipe             │ 7bps in/out       ▲
        ▲                       │                   └── only enabled module
        │                       ▼
        │            ftUSD-USDC wrapper  2,781,367 USDC
        │            ftUSD-USDT wrapper  1,417,610 USDT
        │                       │
        │                       ▼
        │      MultiCollateralDeltaNeutralStakingStrategy  0xe0E4…1A59
        │        owner = Admin Safe │ operators = 3/5 Safe + PLAIN EOA
        │        orders have NO price/slippage bound
        │                       │
        │                       ▼
        │            ┌──────────────────────────┐
        │            │  FT LEND (companion report ) │  35.1% of its TVL
        │            │  2.78M USDC + 1.42M USDT │
        │            │  + 76.5 wstETH collateral│ bought with borrowed WETH
        │            │  − 95.0 WETH debt        │ supplied by FT Lend lenders
        │            └──────────────────────────┘
        │                       │ Spark / Aave (zero idle buffer)
        │                       ▼
        │            ftUSD price oracle ◄── f(USDC px, mint history) — BLIND to backing
        │
        ▼
   sftUSD vault 0xeb48…7625  (UUPS, own wipeBlacklistedAddress)
     rate 1.000000 fixed ── yield = FT emissions only (discretionary)
     └─► ftftUSD wrapper 0xB44a…B87f (0 strategies, idle)
           └─► CircuitBreaker 0xCB21…7355  10%/window, 6h delay (→7d)

   EXTERNAL:  Curve ftUSD/USDC ~$1.87M (only market exit + only price reference)
              Morpho 629,675 ftUSD collateral
```

---

## Risk Summary

### Key Strengths

- **Backing fully exists and reconciles to the wei** — 100.054% collateral ratio, verified across four hops, reproducible by anyone with `cast`.
- **Mint is genuinely atomic and collateralized** through the only enabled module, with a per-collateral cap and a $1.00 mint price hardcap.
- **A real external market exists**: ~$1.87M Curve pool clearing $500K at 0.30%, near-balanced. Genuinely tradeable and arbitrageable by anyone — though the liquidity is provided by a single protocol-adjacent EOA, so treat it as available rather than durable.
- **External acceptance** — 629,675 ftUSD (15.0% of supply) held as collateral in two Morpho Blue markets, the live one comfortably collateralized at ~64.5% LTV against an 86% threshold.
- **sftUSD holder distribution is healthy** — 107 holders, largest 12.1%.
- **Currently fully liquid**: sftUSD `availableToWithdraw` is 100% of TVL and no withdrawals are queued.
- All contracts source-verified; the transient `totalDebt` drift has resolved.

### Key Risks

- **The backing is lent into Flying Tulip's own money market** (100% of it, 35.1% of that market's TVL), so ftUSD cannot fail independently of FT Lend, while its price feed is blind to that backing.
- **A plain EOA in `operators[]` can pre-sign hedge open/close/swap orders with no price or slippage bound** in either the strategy or the execution engine (`onlyManager`, not `onlyOwner`).
- **A 3/5 Safe with no timelock can mint unbacked ftUSD**, blacklist and burn balances at both the token and vault layers, and upgrade every contract.
- **sftUSD pays zero yield in ftUSD terms** — the rate is fixed at 1.0 and all return is discretionary FT emissions in a token with ~$28K of DEX liquidity.
- **sftUSD's exit is rate-limited** at 10% of TVL per window with a 6h delay that the admin can extend to 7 days.
- **Audit status is unverifiable** for every contract here, with an unconfirmed report of an open medium finding on the redemption path specifically.
- **The price feed is structurally blind to the backing, and that blindness propagates outside the protocol.** ftUSD is priced off the USDC price and cumulative mint history — nothing in the path reads the collateral. Morpho's ftUSD markets consume that same feed rather than pricing ftUSD independently, and the FT admin Safe can freeze those markets by pausing it.
- **Redemption capacity is bounded by FT Lend's liquidity and is already partially constrained** — ~15% of the USDT backing is not withdrawable today because third parties borrowed it, and redemption is rate-limited to 10% of wrapper capital per window with a 6h delay.

### Critical Risks

- **Unbacked mint via a new Core module** — one multisig transaction, no delay, dilutes every holder.
- **Reflexive backing** — an FT Lend loss event impairs ftUSD's collateral while ftUSD is simultaneously 11.4% of that market's collateral, and its backing-blind feed would not register the impairment.
- **Unbounded `onlyManager` trade pre-sign by an EOA** over the strategy's hedge leg (price unbounded; size still subject to PM health factor).

---

## Risk Score Assessment

**Scoring guidelines applied:** conservative rounding, decimals where a subcategory falls between bands, onchain evidence over documentation.

### Critical Risk Gates

- [ ] **Unverified contract source** — **PASS.** All contracts, including proxy implementations, are source-verified.
- [ ] **No audit** — **PASS, with material reservation.** A real audit registry exists but is access-code gated; **zero audits are independently confirmable** for any contract here. Scored down hard in Category 1 rather than gated.
- [ ] **Unverifiable reserves** — **PASS.** Backing reconciles exactly across four hops at 100.054%.
- [ ] **Total centralization (single EOA)** — **PASS, marginally.** Root control is a 3/5 multisig. Note however that a plain EOA holds live `onlyManager` operator rights on the Delta-Neutral strategy (hedge order pre-sign), separate from `owner`.

**No critical gate is triggered.**

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits — 2.5**
The privately reviewed audit package provides good coverage from reputable firms, while the reports remain non-public. This asset-specific subscore remains 2.5; by contrast, the [FT Lend report](./flying-tulip.md) scores 3.0 because it applies an additional **+0.5** protocol-specific penalty for having no bounty coverage over the core lending contracts. This difference does not imply that the published bounty covers the ftUSD core: its published scope is **ftPUT / FT OFT**, not `FlyingTulipUSD`, Core, `MintAndRedeem`, sftUSD, or the Delta-Neutral strategy. No Safe Harbor enrolment was found. Complexity is high (module-gated minting, a leveraged hedging strategy, a queued staking vault).

**Subcategory B: Historical — 4.0**
ftUSD is ~5.4 months live with no depeg and no incident, which is clean but uninformative at this age. Supply is $4.2M — the `<$10M` band (4). The peg is externally corroborated, and 220 reward epochs have settled, which is a real operating record. The "delta-neutral" mechanism, however, only started working days ago, so the yield strategy itself has **no** track record.

**Score: 3.25/5** — (2.5 + 4.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0**
Same 3/5 Safe, no timelock, UUPS everywhere. For ftUSD specifically it adds an **unbacked-mint path** (register an arbitrary Core module) and **two independent seizure layers** (`wipeBlacklistedAddress` on both the token and the staking vault). Signers undisclosed; the guardian and strategy-operator Safes share the same signer set.

**Subcategory B: Programmability — 4.5**
Worse than the lending market. Accounting is onchain and verifiable, but the backing sits in a discretionary strategy whose **`operators[]` set includes a plain EOA** with `onlyManager` rights to pre-sign hedge orders (`approveOpenOrder` / `approveCloseOrder` / `approveSwapCollateralOrder`), revoke/cancel orders, set `targetLeverageBps`, and `claimStakingYield` — **with no onchain price or slippage bound** on those orders. (Config/`execute` remain `onlyOwner` / Admin Safe.) Yield on sftUSD is 100% discretionary FT emissions, and the staking exit is a governed rate limiter with an admin-settable delay.

**Subcategory C: External Dependencies — 4.0**
Same rule as the [FT Lend report](./flying-tulip.md): **Spark, Aave, Chainlink, and Lido are not high-risk counterparties** — they are mature, heavily audited infrastructure (low individual counterparty risk).
What elevates this subcategory is **where principal sits**:
- **100% of ftUSD backing is a supply claim on FT Lend** (sibling product, Medium/Elevated risk profile, same admin Safe). That is the single unusual dependency — correlated failure of the stablecoin and the money market.
- Curve is a secondary-market exit / price reference only (protocol-adjacent liquidity); primary redeem is `MintAndRedeem`. CoW is not a dependency.

**Score: 4.5/5** — (5.0 + 4.5 + 4.0) / 3.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 3.5**
ftUSD is 100.054% backed by the strategy's net equity, whose principal is predominantly USDC/USDT; gross collateral also includes wstETH purchased with borrowed WETH, so the portfolio must be assessed net of that WETH liability. Minting is atomic and backing is verifiable in real time onchain, but the collateral quality falls between rubric rows 3 and 4 because the backing is a leveraged position inside the newer, commonly controlled FT Lend market rather than liquid assets held independently. There is only 5 bps of excess backing, no reserve or insurance buffer, and wstETH/WETH basis risk, unwind constraints, FT Lend bad debt, or badly priced operator-authorized RFQ fills can impair the net backing.

**Subcategory B: Provability — 1.5**
Reserves and liabilities are fully onchain, update in real time, and reconcile exactly across ftUSD supply, Core debt, MintAndRedeem accounting, wrapper capital, and the strategy's FT Lend positions. Anyone can reproduce the reconciliation without relying on an administrator or custodian. The half-point reflects the four-contract custody chain and lack of a protocol-provided reserve dashboard, not an inability to verify the backing. The separate finding that ftUSD's price feed does not read this backing affects risk detection and liquidation behavior, but does not make the reserves themselves unprovable.

**Score: 2.5/5** — (3.5 + 1.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

- **ftUSD:** a real $1.87M Curve venue clears **$500K at 0.30%** plus permissionless 7 bps redemption. But the venue is **provided almost entirely by one EOA** through a gauge managed by an admin Safe signer, so it is withdrawable at that party's discretion rather than a durable market property.
- **sftUSD:** materially worse. Exit is **rate-limited to 10% of TVL per window with a 6h settlement delay, admin-extendable to 7 days**, and there is no secondary market for sftUSD itself. That is squarely the rubric's "withdrawal queues or restrictions" row (4).
- Above ~$900K the Curve USDC side is exhausted and redemption becomes the only route, which depends on FT Lend and then Spark/Aave liquidity.
- Currently no queue is active and 100% is withdrawable — the throttle is real but untested at scale.

**Score: 3.5/5** — ftUSD has permissionless redemption and a measured $500K secondary-market exit at 0.30%, but redemption capacity depends on FT Lend liquidity and essentially all Curve liquidity comes from one protocol-adjacent EOA. sftUSD adds a 10%-per-window throttle and no secondary market; excess withdrawals currently wait 6 hours, while an admin can extend the delay to 7 days without a timelock. This places the combined position between the rubric's short-queue score of 3 and restricted-withdrawal score of 4.

#### Category 5: Operational Risk (Weight: 5%)

Same team, entity and governance-transparency profile as the lending report (public founder with mixed record, anonymous team, no legal entity, no DAO or forum, no public incident runbook).

**Score: 3.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.25 | 20% | 0.650 |
| Centralization & Control | 4.50 | 30% | 1.350 |
| Funds Management | 2.50 | 30% | 0.750 |
| Liquidity Risk | 3.50 | 15% | 0.525 |
| Operational Risk | 3.50 | 5% | 0.175 |
| **Final Score** | | | **3.450** |

**Final Score: 3.5** (3.45 weighted, conservatively rounded)

**Optional modifiers:** none apply — the asset is <1 year old and supply is far below $500M.

Category 1 is aligned with FT Lend. Cat 2C scores the **FT Lend backing concentration**, not Spark/Aave/Chainlink as high-risk venues. The gap versus lending is driven by Programmability, FT Lend-as-backing, the leveraged collateral structure, and staked-exit liquidity.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK — approved with enhanced monitoring.**

**This scores worse than the lending market (3.1).** FT Lend's Audits & Historical category is now higher risk (3.5 versus ftUSD's 3.25) solely because its audit subscore includes the additional no-bounty penalty; ftUSD's higher overall score is instead driven by four things a lender does not face:

1. **Principal concentration into the reflexive asset.** Lending USDC, ftUSD is 11.4% of the collateral behind other people's loans. Holding ftUSD, 100% of principal is the reflexive asset.
2. **An EOA in `operators[]` with unbounded hedge order pre-sign** (`approveOpenOrder` / `approveCloseOrder` / `approveSwapCollateralOrder`; no onchain price bound).
3. **A rate-limited exit** on the staked form, admin-extendable to 7 days.
4. **Zero intrinsic yield on sftUSD** — the rate is pinned at 1.0 and all return is discretionary emissions in an illiquid token.

**The external validation is thinner than it looks.** Both of ftUSD's apparent third-party endorsements dissolve on inspection: Morpho accepts ftUSD but prices it with Flying Tulip's own feed, and the Curve pool is ~100% one protocol-adjacent EOA behind a gauge managed by an admin Safe signer. Neither is an outside check; both are extensions of the protocol's own circle.

---

## Reassessment Triggers

- **Backing location:** reassess immediately if ftUSD's backing moves to a different venue, or if the Delta-Neutral strategy's share of FT Lend TVL exceeds 45% or falls below 10%.
- **Operator model:** reassess on any `OperatorSet` event, and immediately if a price or slippage bound is *not* added to order validation within the next review cycle.
- **Hedge:** the leg went live around August 3–6, 2026. Reassess after 30 days of live operation, or immediately if `targetLeverageBps` is raised above 1.05×.
- **Mint authority:** reassess on any new ftUSD Core module, `masterMinter` change, or `maxSupply`/`globalDebtCeiling` increase.
- **Redeemability:** reassess if either wrapper's `availableToWithdraw()` falls below 75% of `capital()`, or if `settlementDelay` on the backing circuit breaker is raised.
- **Peg:** reassess if the Curve spot price diverges >0.5% from `priceUSD(ftUSD)` for more than 24h, or if the pool goes >70/30 imbalanced or loses >50% TVL.
- **Staking:** reassess if `settlementDelay` is raised, if `convertToAssets(1e6)` ever deviates from `1000000`, or if FT emissions stall for more than two epoch periods.
- **Audit status:** reassess if any ftUSD audit is published, if the redemption finding is confirmed or refuted, or if the bounty publishes or expands ftUSD contract coverage.
- **Curve liquidity:** reassess immediately if the sole gauge depositor [`0x3ffebdc5…46ee`](https://etherscan.io/address/0x3ffebdc5130f6072a582f79f3fb61581d3d846ee) withdraws more than 25% of its position — that is the entire external exit and the entire external price reference.
- **Time-based:** reassess in **2 months** — the hedge strategy is new.

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [August 7, 2026](https://github.com/yearn/risk-score/pull/237) | 3.5 | Initial assessment |
