# Asset Risk Assessment: Flying Tulip — ftUSD & Staked ftUSD (sftUSD)

- **Assessment Date:** August 6, 2026
- **Token:** ftUSD (stablecoin) and sftUSD (staked ftUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** ftUSD [`0xF7D85EC4E7710f71992752eac2111312e73E9C9C`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) · sftUSD [`0xeb48218a4c35C814C7678cBcae88C6Ee037F7625`](https://etherscan.io/address/0xeb48218a4c35C814C7678cBcae88C6Ee037F7625)
- **Final Score: 3.9/5.0**
- **Elevated Risk** — limited approval, strict limits. ftUSD is fully collateralized (100.05%) and the backing reconciles to the wei, but that backing is **not idle cash — it is lent into Flying Tulip's own money market** by a strategy operated in part by a plain EOA with no price bound on its trades. The 3/5 admin Safe can mint unbacked ftUSD, blacklist and burn balances. sftUSD adds a rate-limited exit and pays **zero** yield in ftUSD terms — all return is discretionary FT emissions. See [Risk Score Assessment](#risk-score-assessment).
- **Companion report:** the lending market itself is assessed in **[Flying Tulip — FT Lend](./flying-tulip.md)**.

> **Scope.** This report covers **holding ftUSD** and **staking it as sftUSD**. It is a separate risk from supplying to the FT Lend market — different loss paths, different exit mechanics, different concentration profile — and the two should be sized independently. All values verified **August 6, 2026 at block `25697429`** via `cast` and Etherscan.

## Overview + Links

**ftUSD** is Flying Tulip's stablecoin. Users mint 1:1 against USDC or USDT through `MintAndRedeem` and can redeem the same way, paying 7 bps each direction. It is marketed as a "delta-neutral yield stablecoin": the collateral is deployed into a strategy that supplies stables, borrows ETH, and holds wstETH, capturing staking yield while hedging price exposure.

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
| Strategy operator (Safe) | [`0x5557729b169082f07d3131D560E2f2cb5e6c48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) | 3/5 Safe, identical signers to admin |
| **Strategy operator (EOA)** | [`0x8dc8f616af6c146906b218f2acbdc2d27c9ac221`](https://etherscan.io/address/0x8dc8f616af6c146906b218f2acbdc2d27c9ac221) | **Plain EOA**, granted August 3, 2026 |
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
| 6 | **Bad hedge execution** | Strategy operators pre-sign open/close orders with **no price or slippage bound**; a bad fill is a direct loss to backing | operator incl. **one EOA** | Partial |
| 7 | **`execute()` arbitrary call** | Strategy `owner` and wrapper `yieldClaimer` can forward arbitrary calls through contracts holding the backing | 3/5 Safe / YieldClaimer | Total |
| 8 | **Redemption capacity shortfall** | Redeeming requires FT Lend to have withdrawable liquidity, which requires Spark/Aave to have it | structural | Temporary to partial |
| 9 | **Rate-limited exit (sftUSD)** | 10% of TVL per window, 6h settlement, admin-settable to **7 days** | 3/5 Safe | Temporary lockup |
| 10 | **Rewards simply stop** | FT emissions are discretionary; sftUSD's exchange rate is fixed at 1.0, so no emissions means zero yield | epoch settler | Opportunity loss |
| 11 | **`recoverERC20` / `sweepExcess`** | Owner-callable token recovery on MintAndRedeem and sftUSD | 3/5 Safe | Partial |
| 12 | **Curve pool flight** | The only external ftUSD exit and the only external price reference | market | Exit degradation |

## Audits and Due Diligence Disclosures

**Status: asserted but unverifiable** — identical to the lending report. The team states ftUSD has been audited multiple times; the reports sit behind an **access-code wall** on an investor-relations portal that renders only "Enter Your Unique Code Below" without authentication. No firm, date, scope or finding count could be verified.

| Item | Status |
|---|---|
| Public audit reports for `FlyingTulipUSD`, ftUSD Core, `MintAndRedeem` | **NOT FOUND** |
| Public audit reports for sftUSD / `ftYieldWrapperV2` / the Delta-Neutral strategy | **NOT FOUND** |
| Formal verification | **NOT FOUND** |
| Bug bounty | **NOT FOUND** |
| SEAL Safe Harbor | **Not enrolled** |
| Source verification on Etherscan | **PASS** — all contracts above verified |

The only publicly confirmable reviews cover the token-sale `Escrow` and the separate ftPUT product ([Sherlock #1223](https://audits.sherlock.xyz/contests/1223)) — **neither touches ftUSD**. A deleted internal draft of the lending report cited two open ChainSecurity medium findings on ftUSD, one titled *"Historical Mint Ratio in Redemption Can Cause Insolvency"*. That is **unverified** — it came from portal-gated material, not from independent review — but it is consistent with the `redeemPriceBreakdown` structure visible in the ABI (`spotFactorWad`, `avgMintFactorWad`, `effectiveRedeemFactorWad`), which does price redemptions against a historical average mint factor. Flagged for the team, not scored as a confirmed finding.

### Bug Bounty

**NOT FOUND.** No Immunefi, Cantina, Code4rena, Sherlock or HackerOne program, and no Safe Harbor enrolment. A white-hat finding a live ftUSD bug has no disclosure channel and no legal protection.

## Historical Track Record

- **Production history:** ftUSD [deployed February 21, 2026](https://etherscan.io/tx/0x52e7d46b7e166b8e30c5d38a09d93c44537bcb77b439e5b125d8b51d5670ea21), live at the February 23 TGE — **~5.4 months**. sftUSD has settled **220 reward epochs**.
- **Supply:** 4,196,697 ftUSD against a `maxSupply` cap of 100M (raised from 5M). Of that, **1,324,455 (31.6%) is staked** as sftUSD and 1,428,403 is supplied into FT Lend.
- **Peg:** the protocol's oracle reads $0.9988. Independently, the Curve pool is near-balanced at 971,101 ftUSD / 903,390 USDC with `get_virtual_price()` = 1.000464 — so the peg is **externally corroborated**, not merely self-reported.
- **Incidents / depegs:** **NONE FOUND** through August 2026.
- **Third-party acceptance:** [Morpho](https://etherscan.io/address/0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb) holds 629,675 ftUSD as collateral — meaningful external validation for an asset this young.
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
| **Redeem ftUSD** | permissionless | ✓ nominally | 7 bps | priced off a historical average mint factor, not flat 1:1; capacity depends on FT Lend having withdrawable liquidity |
| **Sell ftUSD** | permissionless | ✓ | Curve 2 bps + slippage | ~$500K at 0.30%; USDC side exhausted above ~$900K |
| **Stake (sftUSD)** | permissionless | ✓ | none | `minDepositAmount` 0 |
| **Unstake (sftUSD)** | permissionless | **✗ above the limit** | none | **10% of TVL per window; excess queued for 6h (`settlementDelay`), admin-settable to 7 days** |
| **Claim FT rewards** | permissionless | ✓ | none | only if the epoch settler has funded an epoch |
| Blacklist / burn | 3/5 Safe | ✓ | — | applies at both the ftUSD and sftUSD layers |

**No cooldowns or lockups on ftUSD itself** — mint, redeem and sell are all same-transaction. The only queue in the system is on unstaking, and only above 10% of staked TVL per window. Note that "atomic" redemption is a contract property, not a capacity guarantee: the collateral sits inside FT Lend, so a large redemption needs that market (and then Spark/Aave) to be liquid at that moment.

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
                           ├─► FT Lend: 76.54 wstETH supplied (hedge collateral)
                           ├─► FT Lend: 95.01 WETH borrowed (hedge short)
                           └─► Aave: 1,227.45 USDC residual
```

| Check | Value |
|---|---|
| ftUSD `totalSupply()` | 4,196,696.77 |
| ftUSD Core `totalDebt()` | 4,196,696.77 ✓ exact match |
| `accountedCollateralTvl()` | 4,198,976.27 |
| — USDC / USDT components | 2,781,366.71 / 1,417,609.56 ✓ sums exactly |
| Located in wrappers | 2,781,366.71 / 1,417,609.56 ✓ |
| **Collateral ratio** | **100.054%** |

**The backing genuinely exists and reconciles to the wei.** That is a real strength and better than many larger stablecoins. The risk is not that the collateral is missing — it is *where* the collateral is.

### The backing is lent into Flying Tulip's own market

ftUSD's collateral is not idle cash. It is a **supplier position in FT Lend**, the protocol's own money market, worth **$4.38M = 35.1% of that market's entire TVL**.

Consequences for an ftUSD holder:

1. **You are a lender in FT Lend whether you intended to be or not.** Every risk in the [FT Lend report](./flying-tulip.md) — bad debt with no backstop, admin upgrade, oracle override, Spark/Aave dependency with zero idle buffer — sits underneath your ftUSD.
2. **The circle closes.** ftUSD is *also* an accepted collateral in that market (11.4% of its TVL) and *also* borrowable there. A shock propagates in a loop rather than being absorbed.
3. **Your price feed reads your own backing.** `FtUsdMintRedeemOracleProxy` prices ftUSD as Chainlink USDC/USD × the `MintAndRedeem` redeem factor — i.e. from the accounted value of collateral deployed inside FT Lend — at a **0 bps deviation tolerance**. A genuine impairment would not surface in that feed. The Curve pool is the only external check.
4. **Redemption capacity is not independent.** Redeeming at size requires FT Lend to have withdrawable liquidity, which requires Spark/Aave to have it.

### The hedge, and who runs it

The "delta-neutral" leg is now live. It was **not running as recently as August 3** (0 wstETH, 0.34 WETH debt); by August 6 it holds 76.54 wstETH as collateral and owes 95.01 WETH — 99.6% of all WETH debt in FT Lend. `targetLeverageBps` = 10500 (1.05×), `borrowAsset` = WETH, `stakingAsset` = wstETH.

**Control is split, and the operational layer is weak:**

| Layer | Who | Powers |
|---|---|---|
| `owner()` | 3/5 Admin Safe (was deployer EOA [`0x92c3eb78…61f4`](https://etherscan.io/address/0x92c3eb785069f58657bfcaa116d9ce7d56e361f4) until block 25302049) | `setOperator`, `setLeverageEngine`, `setTargetLeverageBps`, `setCollateralWrapper(s)`, `setftYieldWrapper`, **`execute(address,uint256,bytes)`** |
| `operators` | [`0x5557729b…48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) — 3/5 Safe, identical signers | Same operational authority as owner (`onlyManager` = `owner() \|\| operators[]`) |
| `operators` | **[`0x8dc8f616…c221`](https://etherscan.io/address/0x8dc8f616af6c146906b218f2acbdc2d27c9ac221) — plain EOA**, codesize 0, nonce 15, 0.0997 ETH. Granted at block 25674942 (Aug 3, 2026); its own first transaction is block 25675067, funded from [`0xb258ad41…48ec`](https://etherscan.io/address/0xb258ad4125e84068f3a47fbbc4f6aced2bc148ec) | Same |

Operators call `approveOpenOrder` / `approveCloseOrder` / `approveSwapCollateralOrder`, which invoke `pm.approveBorrow` / `pm.approveEngine` and pre-sign the order through `LeverageRfqEngine`. That is the mechanism that moves $4.2M of backing.

**Order validation carries no price bound.** `_validateCommonOrder` checks only that `order.user == address(this)`, that the order has not expired, and that both amounts are non-zero. `_validateOpenOrder` adds a direction check (sell WETH, buy wstETH). There is **no price check, no slippage bound**, and `targetLeverageBps` is not enforced in validation — it is used for previews. `LeverageRfqEngine.broadcastOrder` only checks `order.user == msg.sender` and pre-signs; the engine source contains no oracle reference at all.

**Net: a single EOA key can pre-sign a swap of ftUSD's backing at an arbitrary execution price.** The only backstop is the `PositionsManager` health-factor check, which bounds position *size*, not *price*. This is the most acute finding in this report.

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

### Provability

- **Reserves reconcile exactly** (table above) and every hop is readable onchain by anyone. Genuine strength.
- **But verification takes four hops** through contracts that public documentation does not describe, and the final hop lands inside another Flying Tulip product rather than at a custodian or a liquid buffer.
- **The price feed is circular** and carries a 0 bps deviation tolerance.
- **No public source repository** and no public audit reports — review is limited to reading verified bytecode.
- **The Curve pool is the only independent price reference** and the only way to detect the circular feed drifting.

## Liquidity Risk

### ftUSD

| Venue | Depth | Notes |
|---|---|---|
| **Curve StableSwap-NG** [ftUSD/USDC](https://etherscan.io/address/0xafec61e7a604f8f81f7cab64ec75bfa07c542630) | **971,101 ftUSD / 903,390 USDC (~$1.87M)** | A=1000, fee 2 bps, near-balanced |
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

Mint/redeem accounting, the collateral reconciliation and the sftUSD share math are all onchain and verifiable. Against that: proxy upgrades are instant, oracle prices are admin-overridable at the router, FT emissions are entirely discretionary, and the backing is managed by a **discretionary strategy whose trade execution has no price bound** and whose operator set includes an EOA. The staking exit is a governed rate limiter, not a programmatic guarantee.

### External Dependencies

- **FT Lend** — where 100% of the backing sits. See the [companion report](./flying-tulip.md). **Critical.**
- **Spark & Aave** — FT Lend's wrappers hold zero idle buffer, so redemption capacity ultimately depends on these venues.
- **Lido / wstETH** — now a live component of the hedge (76.54 wstETH).
- **Chainlink** — USDC/USD feeds the ftUSD oracle's base leg.
- **Curve** — the only external ftUSD exit and the only external price reference. Its own risk (LP concentration, admin, A-ramp authority) **not assessed — TODO**.
- **Morpho** — 629,675 ftUSD of external acceptance; also an outward propagation channel.
- **CoW Protocol** — hedge orders are pre-signed and settled through it (`GPv2Settlement` and a `CowSwapBurner` appear in ftUSD transfer history). Settlement-layer risk **not assessed — TODO**.

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

- **Compare the Curve spot price against `priceUSD(ftUSD)` from the router.** This is the only external check on the circular feed. Alert on >0.5% divergence.
- Alert on `PausedSet` / `AnswerBoundsSet` / `MaxStalenessSet` on the ftUSD oracle proxy, and on any `setLastGoodPrice(ftUSD, …)` at the router.
- Alert if the Curve pool becomes >70/30 imbalanced or loses >50% of its TVL — that removes the only independent price reference.

### Mint authority — immediate alert

- `MinterConfigured`, `MinterRemoved`, `MasterMinterChanged` on ftUSD.
- **Any new module enablement on ftUSD Core** — this is the unbacked-mint path.
- `setMaxSupply`, `globalDebtCeiling` changes, `Blacklisted`, `wipeBlacklistedAddress`.
- `Upgraded` on ftUSD, Core, MintAndRedeem, sftUSD, and both wrappers.

### Strategy operations

- **`OperatorSet` on the Delta-Neutral strategy** — the set currently includes a plain EOA; any addition is material.
- `setLeverageEngine`, `setTargetLeverageBps`, `setCollateralWrapper(s)`, `setftYieldWrapper`, and any `execute()` call.
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
        │            │  + 76.5 wstETH collateral│
        │            │  − 95.0 WETH borrowed    │
        │            └──────────────────────────┘
        │                       │ Spark / Aave (zero idle buffer)
        │                       ▼
        │            ftUSD price oracle ◄── redeem factor ⟲ CIRCULAR
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
- **A real external market exists**: ~$1.87M Curve pool clearing $500K at 0.30%, near-balanced, which both provides an exit and independently corroborates the peg.
- **External acceptance** — 629,675 ftUSD held as Morpho collateral.
- **sftUSD holder distribution is healthy** — 107 holders, largest 12.1%.
- **Currently fully liquid**: sftUSD `availableToWithdraw` is 100% of TVL and no withdrawals are queued.
- All contracts source-verified; the transient `totalDebt` drift has resolved.

### Key Risks

- **The backing is lent into Flying Tulip's own money market** (100% of it, 35.1% of that market's TVL), so ftUSD cannot fail independently of FT Lend, and its price feed reads that same backing.
- **A plain EOA can pre-sign trades of the backing with no price or slippage bound** in either the strategy or the execution engine.
- **A 3/5 Safe with no timelock can mint unbacked ftUSD**, blacklist and burn balances at both the token and vault layers, and upgrade every contract.
- **sftUSD pays zero yield in ftUSD terms** — the rate is fixed at 1.0 and all return is discretionary FT emissions in a token with ~$28K of DEX liquidity.
- **sftUSD's exit is rate-limited** at 10% of TVL per window with a 6h delay that the admin can extend to 7 days.
- **Audit status is unverifiable** for every contract here, with an unconfirmed report of an open medium finding on the redemption path specifically.

### Critical Risks

- **Unbacked mint via a new Core module** — one multisig transaction, no delay, dilutes every holder.
- **Reflexive backing** — an FT Lend loss event impairs ftUSD's collateral while ftUSD is simultaneously 11.4% of that market's collateral, priced by a feed reading the impaired backing.
- **Unbounded trade execution by an EOA** over $4.2M of collateral.

---

## Risk Score Assessment

**Scoring guidelines applied:** conservative rounding, decimals where a subcategory falls between bands, onchain evidence over documentation.

### Critical Risk Gates

- [ ] **Unverified contract source** — **PASS.** All contracts, including proxy implementations, are source-verified.
- [ ] **No audit** — **PASS, with material reservation.** A real audit registry exists but is access-code gated; **zero audits are independently confirmable** for any contract here. Scored down hard in Category 1 rather than gated.
- [ ] **Unverifiable reserves** — **PASS.** Backing reconciles exactly across four hops at 100.054%.
- [ ] **Total centralization (single EOA)** — **PASS, marginally.** Control is a 3/5 multisig. Note however that an EOA holds live operational authority over the backing.

**No critical gate is triggered.**

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits — 3.5**
Same posture as the lending report: a real registry exists but is unverifiable, no in-scope contract has a confirmable review, no bug bounty, no Safe Harbor. Aggravated here by an **unconfirmed report of an open medium finding on the redemption path** — precisely the mechanism an ftUSD holder depends on. Complexity is high (module-gated minting, a leveraged hedging strategy, a queued staking vault).

**Subcategory B: Historical — 4.0**
ftUSD is ~5.4 months live with no depeg and no incident, which is clean but uninformative at this age. Supply is $4.2M — the `<$10M` band (4). The peg is externally corroborated, and 220 reward epochs have settled, which is a real operating record. The "delta-neutral" mechanism, however, only started working days ago, so the yield strategy itself has **no** track record.

**Score: 3.75/5** — (3.5 + 4.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0**
Same 3/5 Safe, no timelock, UUPS everywhere. For ftUSD specifically it adds an **unbacked-mint path** (register an arbitrary Core module) and **two independent seizure layers** (`wipeBlacklistedAddress` on both the token and the staking vault). Signers undisclosed; the guardian and strategy-operator Safes share the same signer set.

**Subcategory B: Programmability — 4.5**
Worse than the lending market. Accounting is onchain and verifiable, but: the backing is managed by a discretionary strategy; **its trade execution has no price or slippage bound**; an **EOA** holds that authority; yield is 100% discretionary emissions; and the staking exit is a governed rate limiter with an admin-settable delay. Very little about the economics is programmatically guaranteed.

**Subcategory C: External Dependencies — 4.5**
The dependency set is unusual: **100% of the backing depends on FT Lend**, which itself depends on Spark/Aave with zero idle buffer, plus Lido for the hedge, Curve as the only external price reference, and CoW for settlement. This is closer to "single point of failure — failure breaks the entire protocol" (row 5) than to a diversified set, and two of the dependencies (Curve, CoW) were not assessed.

**Score: 4.67/5** — (5.0 + 4.5 + 4.5) / 3.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 3.5**
100.054% collateralized in USDC/USDT — blue-chip collateral, atomic mint, per-collateral caps, $1.00 price hardcap. That is rubric row 1–2 on quality. Dragged up by: the collateral is a lending position rather than cash; over-collateralization is only 5 bps of headroom; there is no reserve or insurance buffer; and redemption is priced off a historical average mint factor whose behaviour under stress is unmodelled.

**Subcategory B: Provability — 3.0**
Reserves reconcile exactly and anyone can reproduce it — genuinely strong. Offset by: four undocumented hops to verify, a **circular price feed** at 0 bps tolerance, no public repo, no public audits, and the fact that the final hop lands inside a sibling product rather than at a liquid buffer. The Curve pool makes divergence detectable, which keeps this out of the 4s.

**Score: 3.25/5** — (3.5 + 3.0) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

- **ftUSD:** a real $1.87M Curve venue clears **$500K at 0.30%** — inside the rubric's `<1% slippage` band — plus atomic 7 bps redemption. For an unstaked holder this is rubric row 2 territory.
- **sftUSD:** materially worse. Exit is **rate-limited to 10% of TVL per window with a 6h settlement delay, admin-extendable to 7 days**, and there is no secondary market for sftUSD itself. That is squarely the rubric's "withdrawal queues or restrictions" row (4).
- Above ~$900K the Curve USDC side is exhausted and redemption becomes the only route, which depends on FT Lend and then Spark/Aave liquidity.
- Currently no queue is active and 100% is withdrawable — the throttle is real but untested at scale.

**Score: 3.5/5** — blending an unstaked position (≈2.5) with the staked one (≈4.0), and applying the **+0.5 throttle modifier** the rubric specifies for mechanisms that delay large exits. Weighted toward the staked case since this report exists to cover it.

#### Category 5: Operational Risk (Weight: 5%)

Same team, entity and governance-transparency profile as the lending report (public founder with mixed record, anonymous team, no legal entity, no DAO or forum, no public incident runbook). Scored **0.5 worse** than the lending report's 3.5 because of two documentation-versus-reality gaps specific to ftUSD: the public docs do not disclose that the backing is lent into FT Lend, and the "delta-neutral" description was inaccurate from launch until early August 2026.

**Score: 4.0/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.75 | 20% | 0.750 |
| Centralization & Control | 4.67 | 30% | 1.401 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 3.50 | 15% | 0.525 |
| Operational Risk | 4.00 | 5% | 0.200 |
| **Final Score** | | | **3.851** |

**Final Score: 3.9**

**Optional modifiers:** none apply — the asset is <1 year old and supply is far below $500M.

Three dependencies were not assessed (the Curve pool's own risk, CoW settlement, and the unverified redemption finding). None is credited as a positive anywhere above, so the score is conservative with respect to all three rather than being adjusted for them.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: ELEVATED RISK — limited approval, strict limits.**

**This scores worse than the lending market (3.6).** The delta is driven by four things a lender does not face:

1. **Principal concentration into the reflexive asset.** Lending USDC, ftUSD is 11.4% of the collateral behind other people's loans. Holding ftUSD, 100% of principal is the reflexive asset.
2. **An EOA with unbounded trade authority** over the backing.
3. **A rate-limited exit** on the staked form, admin-extendable to 7 days.
4. **Zero intrinsic yield on sftUSD** — the rate is pinned at 1.0 and all return is discretionary emissions in an illiquid token.

**Recommendation for Yearn:** if exposure proceeds, prefer **unstaked ftUSD over sftUSD** — staking adds a queue, two contracts, and a second seizure layer in exchange for a reward token with $28K of liquidity. Size against the **Curve pool's usable depth (~$500K at 0.30%)**, not against ftUSD's $4.2M supply, since redemption capacity is a function of FT Lend's liquidity rather than a protocol guarantee. Treat any `OperatorSet` event, any new ftUSD Core module, or any `settlementDelay` increase as an immediate exit trigger.

---

## Reassessment Triggers

- **Backing location:** reassess immediately if ftUSD's backing moves to a different venue, or if the Delta-Neutral strategy's share of FT Lend TVL exceeds 45% or falls below 10%.
- **Operator model:** reassess on any `OperatorSet` event, and immediately if a price or slippage bound is *not* added to order validation within the next review cycle.
- **Hedge:** the leg went live around August 3–6, 2026. Reassess after 30 days of live operation, or immediately if `targetLeverageBps` is raised above 1.05×.
- **Mint authority:** reassess on any new ftUSD Core module, `masterMinter` change, or `maxSupply`/`globalDebtCeiling` increase.
- **Peg:** reassess if the Curve spot price diverges >0.5% from `priceUSD(ftUSD)` for more than 24h, or if the pool goes >70/30 imbalanced or loses >50% TVL.
- **Staking:** reassess if `settlementDelay` is raised, if `convertToAssets(1e6)` ever deviates from `1000000`, or if FT emissions stall for more than two epoch periods.
- **Audit status:** reassess if any ftUSD audit is published, if the redemption finding is confirmed or refuted, or if a bug bounty launches.
- **Time-based:** reassess in **2 months** — shorter than the lending report's 3, because the hedge strategy is new and the market state moved materially within days during this assessment.

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [August 6, 2026](https://github.com/yearn/risk-score/pull/237) | 4.0 | Initial assessment. Split out of the FT Lend report so that lending and ftUSD/sftUSD exposure can be sized independently. Completed the backing reconciliation (100.054%, exact across four hops), established that 100% of the backing is lent into FT Lend, documented the Delta-Neutral strategy's operator model (3/5 Safe **plus a plain EOA**) and the absence of any price or slippage bound in order validation, covered sftUSD (fixed 1.0 rate, FT-only discretionary yield, 10%/window exit with a 6h admin-extendable delay), and measured the Curve venue ($500K at 0.30%) |
