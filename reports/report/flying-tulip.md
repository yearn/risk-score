# Protocol Risk Assessment: Flying Tulip — FT Lend (ftDNMM)

- **Assessment Date:** August 7, 2026 (team-response update: September 4, 2026)
- **Token:** FT Lend market — supply / borrow positions (internal balances, not tokenised)
- **Chain:** Ethereum Mainnet
- **Core Contract:** PositionsManager [`0xbe4050a73a7Fb384c65E885a15C33461A4B20055`](https://etherscan.io/address/0xbe4050a73a7Fb384c65E885a15C33461A4B20055)
- **Final Score: 3.1/5.0**
- **Medium Risk** — approved with enhanced monitoring. A 3-of-5 Safe with no timelock can upgrade every contract and override every price. **35.1% of the market's TVL is the protocol's own ftUSD backing collateral supplied back into itself**, and only three genuinely third-party addresses hold 96% of the remainder. The audit package was privately reviewed and is strong but remains non-public; a live $1M Sherlock bounty covers deployed Flying Tulip contracts through the dynamic production-contract list incorporated by its Additional Scope. See [Risk Score Assessment](#risk-score-assessment). (Also deployed on Sonic; this report covers Ethereum.)
- **Companion report:** ftUSD and staked ftUSD are assessed separately in **[Flying Tulip — ftUSD & Staked ftUSD](./flying-tulip-ftusd.md)**.

> **Scope.** Yearn's interest (issue [yearn/risk-score#234](https://github.com/yearn/risk-score/issues/234)) is the risk of supplying ("just lend") and/or borrowing in the **FT Lend** market. This report covers the lending engine and the assets it touches. **Holding ftUSD and staking ftUSD are out of scope** and are assessed in the companion report [Flying Tulip — ftUSD & Staked ftUSD](./flying-tulip-ftusd.md). ftUSD appears here only as an accepted collateral asset and because the contract holding its backing is this market's largest supplier. Nothing in this report should be used to size an ftUSD or sftUSD position. The unrelated `tulip.garden` protocol on Solana is **not** Flying Tulip and is excluded. Original values were verified **June 7, 2026 at block `25264957`**; this revision re-verified everything on **August 6, 2026 at block `25697429`** via `cast` and Etherscan. Bug-bounty scope and Curve context were refreshed **September 4, 2026 at block `25903824`** in response to team comments.

## Overview + Links

**Flying Tulip** is Andre Cronje's "on-chain financial system that standardizes pricing, credit, and risk across a suite of products" — a hybrid AMM-CLOB spot exchange, a lending market (FT Lend), perpetual futures, and a yield stablecoin (ftUSD). The products share collateral and pricing so "a single deposit can back a loan, serve as collateral for a limit order, and support a future position simultaneously."

**FT Lend** (the contract suite is labelled **ftDNMM** in the protocol's address registry) works as follows:

- **Markets.** Two models: (1) *permissionless* pair markets auto-created for any Spot pool, and (2) a curated *permissioned* cross-collateral pool. On Ethereum today the live set is the curated pool (7 enabled assets, 6 priced).
- **Supply side.** A lender calls `deposit(asset, amount)` on the `PositionsManager`. Un-borrowed liquidity is held by the asset's `ftYieldWrapper`, which deploys it to an external strategy. Suppliers earn borrower interest plus strategy yield through the supply index.
- **Borrow side.** Borrowers post collateral and borrow against it. **LTV is dynamic and snapshotted** at position open based on AMM depth and multi-timeframe volatility. Onchain, each asset carries a **maintenance-margin rate (`mmBps`)** in the `ConfigRegistry`, and account health is enforced against `marginHfTargetBps`/`marginHfSafeBps`.
- **Pricing.** An onchain `OracleRouterChainlink` — Chainlink-anchored, with Aave-style adapters for WBTC and wstETH, and a protocol-internal redemption oracle for ftUSD.
- **Liquidations.** Module-gated through `RfqEngine` (`rfqFill` / `rfqFillFlash` → `liquidateFlash`), designed as time-sliced / RFQ-routed soft liquidations. Anyone can liquidate using partial liquidation.

**Links:**

- [Protocol Documentation](https://docs.flyingtulip.com/) · [FT Lend docs](https://docs.flyingtulip.com/product-suite/ft-lend/) · [Contract Addresses](https://docs.flyingtulip.com/contract-addresses/) · [Risks page](https://docs.flyingtulip.com/risks/)
- [App](https://flyingtulip.com/) · [Lend dashboard](https://flyingtulip.com/lend/dashboard/) · [Blog](https://blog.flyingtulip.com/)
- [GitHub org `flyingtulipdotcom`](https://github.com/flyingtulipdotcom) (only `ft`, `escrow`, `supporter-whitelist` are public; the lending/ftUSD repos are private)
- [DeFiLlama — Flying Tulip](https://defillama.com/protocol/flying-tulip) (slug `flying-tulip`)
- [Sherlock bug bounty #248](https://audits.sherlock.xyz/bug-bounties/248) · [Sherlock contest #1223 (ftPUT)](https://audits.sherlock.xyz/contests/1223) · [CoinList sale](https://coinlist.co/flying-tulip)

## Contract Addresses

All addresses verified onchain at block `25675412` (August 3, 2026). Every contract listed is **source-verified on Etherscan**, including each proxy implementation.

### Core Lending Contracts (Ethereum)

| Contract | Address | Type | Implementation |
|---|---|---|---|
| PositionsManager | [`0xbe4050a73a7Fb384c65E885a15C33461A4B20055`](https://etherscan.io/address/0xbe4050a73a7Fb384c65E885a15C33461A4B20055) | UUPS proxy | [`0xaa3d5fc8…a23b`](https://etherscan.io/address/0xaa3d5fc84b43219391539714be5f0681aefca23b) |
| ConfigRegistry | [`0xA8777c3D446fa7F0b0FC97a80C1Ea1d37F1ca33E`](https://etherscan.io/address/0xA8777c3D446fa7F0b0FC97a80C1Ea1d37F1ca33E) | UUPS proxy | [`0xd25f964e…47e5`](https://etherscan.io/address/0xd25f964ead7bfbf07858b5bfede58f11a5a947e5) |
| PMWrapper (PM admin) | [`0xBDD80028c9e4b9A2D268D2cF62Fb54Ec8697C68B`](https://etherscan.io/address/0xBDD80028c9e4b9A2D268D2cF62Fb54Ec8697C68B) | admin wrapper | — |
| RfqEngine (**sole liquidation module**) | [`0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32`](https://etherscan.io/address/0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32) | engine | — |
| LeverageRfqEngine | [`0x8263a07504d93cB95e0a74f3627bb15faaf140e2`](https://etherscan.io/address/0x8263a07504d93cB95e0a74f3627bb15faaf140e2) | engine | — |
| MetaActions | [`0x3633eb60d08756674472e2d34d6ffb5f4c1c29f2`](https://etherscan.io/address/0x3633eb60d08756674472e2d34d6ffb5f4c1c29f2) | engine + meta-module | — |
| MetaSessionActions | [`0x4f83ac5c8a79986d0916a8849730d9cef63a3497`](https://etherscan.io/address/0x4f83ac5c8a79986d0916a8849730d9cef63a3497) | engine + meta-module | — |
| RelayerAuth | [`0x823a97a2c32985e0f5457fc8103F36698D1F53F4`](https://etherscan.io/address/0x823a97a2c32985e0f5457fc8103F36698D1F53F4) | session layer | — |
| SessionManager | [`0xF9f3ddF2E96Cabef94e2634c326DC6dde99360f8`](https://etherscan.io/address/0xF9f3ddF2E96Cabef94e2634c326DC6dde99360f8) | session layer | — |
| CircuitBreaker | [`0x9676E697399581AB288844cDE5F73d0887eC18e0`](https://etherscan.io/address/0x9676E697399581AB288844cDE5F73d0887eC18e0) | outflow limiter | — |
| Stable IRM | [`0x3253739A68640E308c8209384bb44E4ADA38710d`](https://etherscan.io/address/0x3253739A68640E308c8209384bb44E4ADA38710d) | `pure` rate model | — |
| Major IRM | [`0x07eC8583B1bC7D97646409a2b51DdBed6725D12F`](https://etherscan.io/address/0x07eC8583B1bC7D97646409a2b51DdBed6725D12F) | `pure` rate model | — |
| LongTail IRM | [`0x09cd852f47aCa224eE6B4AccC29BD2694F29Ef69`](https://etherscan.io/address/0x09cd852f47aCa224eE6B4AccC29BD2694F29Ef69) | `pure` rate model | — |

### ftUSD Contracts (summary — see the dedicated report)

ftUSD is an accepted collateral and borrowable asset here, and the contract that holds its backing is this market's largest single supplier. Full enumeration, mint authority, and the staking product are covered in **[Flying Tulip — ftUSD & Staked ftUSD](./flying-tulip-ftusd.md)**.

| Contract | Address | Relevance to FT Lend |
|---|---|---|
| ftUSD | [`0xF7D85EC4E7710f71992752eac2111312e73E9C9C`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | Collateral + borrowable asset, 11.4% of TVL |
| **Delta-Neutral strategy** | [`0xe0E445967256EE60111e243e0F0F94DD1D351A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59) | **Largest supplier in this market — 35.1% of TVL.** Holds ftUSD's backing |
| MintAndRedeem | [`0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C`](https://etherscan.io/address/0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C) | Source of the ftUSD price used for liquidations here |
| FT token | [`0x5DD1A7A369e8273371d2DBf9d83356057088082c`](https://etherscan.io/address/0x5DD1A7A369e8273371d2DBf9d83356057088082c) | Reward token paid to suppliers; enabled but unpriced asset |

### Governance & Multisig

| Contract | Address | Threshold | Notes |
|---|---|---|---|
| **Admin Safe** | [`0x1118e1c057211306a40A4d7006C040dbfE1370Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | **3 of 5** | Gnosis Safe v1.3.0. Root of all authority. No timelock |
| Guardian Safe | [`0x22246a9183cE2CE6e2c2a9973F94aEA91435017C`](https://etherscan.io/address/0x22246a9183cE2CE6e2c2a9973F94aEA91435017C) | 3 of 4 | Strict **subset** of admin signers |
| WBTC strategy-manager Safe | [`0x5557729b169082f07d3131D560E2f2cb5e6c48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) | 3 of 5 | **Identical five signers** to the admin Safe |
| YieldClaimer | [`0x88432bB6EA62e774cB6d87995CC5277568d01397`](https://etherscan.io/address/0x88432bB6EA62e774cB6d87995CC5277568d01397) | contract | Holds wrapper `execute()` arbitrary-call |
| Treasury | [`0x9B2F12De620d4E2993068e5cab6D6c7451f6cDe5`](https://etherscan.io/address/0x9B2F12De620d4E2993068e5cab6D6c7451f6cDe5) | UUPS proxy | `setStrategyDelay`; impl [`0xf32adbe8…7d21`](https://etherscan.io/address/0xf32adbe84a4560084516f807b73d7cd7f0677d21) |
| Fee collector / epoch settler | [`0x5cd6Abe67f8af1C0c699dF36d90a6469Eaf1958a`](https://etherscan.io/address/0x5cd6Abe67f8af1C0c699dF36d90a6469Eaf1958a) | UUPS proxy | impl [`0x63176fda…beb5`](https://etherscan.io/address/0x63176fdaee7af7fd60acd896e3b6ce894901beb5) |

**Admin Safe signers** (undisclosed in docs, presumed team EOAs): [`0xB7B54333…08bc8`](https://etherscan.io/address/0xB7B543337539219A5a1326aCB71dBa8Bba408bc8), [`0x3c427497…1B4E`](https://etherscan.io/address/0x3c42749709BF354B3aE0Db29Fd2dd88089b21B4E), [`0xf9E5aF16…9a10`](https://etherscan.io/address/0xf9E5aF16243041cE3141284D225CAfC0fC749a10), [`0x09E2B492…7881`](https://etherscan.io/address/0x09E2B49280f1879172b2C3345d08896921707881), [`0xD0CA8838…6f5A`](https://etherscan.io/address/0xD0CA88388d1732594D611535314e9B6745396f5A). The Guardian Safe holds the same set minus [`0xf9E5aF16…9a10`](https://etherscan.io/address/0xf9E5aF16243041cE3141284D225CAfC0fC749a10).

### FT Lend Yield Wrappers & Strategies

| Asset | Wrapper | Strategy | Venue | `strategyManager` |
|---|---|---|---|---|
| USDC | [`0xD2e4A5ac4B4Da102317cF7C9A1289aDF082639E2`](https://etherscan.io/address/0xD2e4A5ac4B4Da102317cF7C9A1289aDF082639E2) | [`0xfBE0736e…b0e5`](https://etherscan.io/address/0xfBE0736eBF5668A604D73BA93a5DdBEe9c10b0e5) | Spark | Admin Safe |
| USDT | [`0x28b0905d83BCe5FFA6c54651F25858828A38123B`](https://etherscan.io/address/0x28b0905d83BCe5FFA6c54651F25858828A38123B) | [`0x852dc763…6a42`](https://etherscan.io/address/0x852dc7638aD159Ec12526d7E47f53f1307756a42) | Spark | Admin Safe |
| WETH | [`0x460494aF61BcB92B59797B4e09C26A5ADecb2da2`](https://etherscan.io/address/0x460494aF61BcB92B59797B4e09C26A5ADecb2da2) | [`0x4df6f4f8…F2a7`](https://etherscan.io/address/0x4df6f4f8CDA409550A5d8A89aD66DE355CF7F2a7) | Spark | Admin Safe |
| WBTC | [`0x1A5730c71576D77048E9FdC79DD40e4B1E8Fe042`](https://etherscan.io/address/0x1A5730c71576D77048E9FdC79DD40e4B1E8Fe042) | [`0x06980dC5…3B92`](https://etherscan.io/address/0x06980dC564e85c1eef0b2F85c803f08A30113B92) | Aave | **`0x5557…48f6` Safe** |
| wstETH | [`0x01980BD1B58313bD3767f6adc75Af8b6464f3db7`](https://etherscan.io/address/0x01980BD1B58313bD3767f6adc75Af8b6464f3db7) | none | — | Admin Safe |
| ftUSD | [`0xc67D966f761e8cf13Faa0a1E774425290c8453d9`](https://etherscan.io/address/0xc67D966f761e8cf13Faa0a1E774425290c8453d9) | none | idle | Admin Safe |
| FT | [`0x7127BB9d9ad0f47B8dA9087e634D67F3946F840E`](https://etherscan.io/address/0x7127BB9d9ad0f47B8dA9087e634D67F3946F840E) | none | reward pool | Admin Safe |

All seven wrappers share the implementation [`0xfaed20b307a6789481ee383adc10b9b0090b1157`](https://etherscan.io/address/0xfaed20b307a6789481ee383adc10b9b0090b1157) (`ftYieldWrapper`).

### Oracle Stack

| Asset | Router feed | Type | Underlying | Owner | Staleness | Deviation |
|---|---|---|---|---|---|---|
| USDC | [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) | Chainlink `EACAggregatorProxy` | USDC/USD | Chainlink | 88,200s | 25 bps |
| USDT | [`0x3E7d1eAB13ad0104d2750B8863b489D65364e32D`](https://etherscan.io/address/0x3E7d1eAB13ad0104d2750B8863b489D65364e32D) | Chainlink `EACAggregatorProxy` | USDT/USD | Chainlink | 88,200s | 25 bps |
| WETH | [`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) | Chainlink `EACAggregatorProxy` | ETH/USD | Chainlink | 5,400s | 50 bps |
| WBTC | [`0x183dB475d8184aA7a018ed2164e11A887afBDA55`](https://etherscan.io/address/0x183dB475d8184aA7a018ed2164e11A887afBDA55) | `ChainlinkLatestAnswerProxy` | CL [BTC/USD](https://etherscan.io/address/0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c) + Aave [`CLSynchronicityPriceAdapterPegToBase`](https://etherscan.io/address/0xDaa4B74C6bAc4e25188e64ebc68DB5050b690cAc) | **Admin Safe** | 88,200s | 50 bps |
| wstETH | [`0x000bb128a8aBCFa05B871C97CC9C5f88e7Dcf35a`](https://etherscan.io/address/0x000bb128a8aBCFa05B871C97CC9C5f88e7Dcf35a) | `ChainlinkLatestAnswerProxy` | CL [ETH/USD](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) + Aave [`WstETHPriceCapAdapter`](https://etherscan.io/address/0xe1D97bF61901B075E9626c8A2340a7De385861Ef) | **Admin Safe** | 5,400s | 50 bps |
| ftUSD | [`0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8) | `FtUsdMintRedeemOracleProxy` | CL USDC/USD × `MintAndRedeem` redeem factors — **f(USDC price, mint history); does not read ftUSD collateral** | **Admin Safe** | 86,400s | **0 bps** |
| FT | — | **no feed configured** | `priceUSD(FT)` reverts | — | — | — |

On the three protocol-owned wrappers, `baseFeed` and `adapter` are **`immutable`** — the owner can `setPaused`, `setAnswerBounds` and `setMaxStaleness`, but **cannot repoint the feed**. The arbitrary-price path is at the router, not here (see [Provability](#provability)).

### Can Holders Lose Money?

Enumerated loss paths for a Yearn deposit into FT Lend, ordered by how directly they reach supplied principal:

| # | Path | Mechanism | Gating | Severity |
|---|---|---|---|---|
| 1 | **Admin upgrades `PositionsManager`** | `PMWrapper.upgradePM` replaces the engine with arbitrary code that can transfer any balance | 3/5 Safe, **no timelock** | Total loss |
| 2 | **Admin rewrites the oracle price** | `OracleRouterChainlink.setLastGoodPrice(asset, price)` writes an arbitrary price, making solvent positions liquidatable or insolvent ones invisible | 3/5 Safe | Total loss |
| 3 | **Admin redirects lender capital** | `wrapper.setStrategy` + `confirmStrategy` with `strategyDelayConfig = 0` moves deployed funds to an arbitrary strategy in one block | 3/5 Safe (WBTC: `0x5557…48f6` Safe) | Total loss |
| 4 | **`YieldClaimer` arbitrary call** | `wrapper.execute(strategy, to, value, data)` forwards an arbitrary call through the strategy contract | YieldClaimer contract | Total loss |
| 5 | **Unbacked ftUSD mint** | Safe registers a new ftUSD Core module (or replaces `minter()`) and issues ftUSD with no collateral; ftUSD is collateral in FT Lend | 3/5 Safe | Severe — dilutes ftUSD collateral |
| 6 | **ftUSD blacklist / balance wipe** | `blacklist` + `wipeBlacklistedAddress` freezes and burns a holder's ftUSD, including a Yearn position | 3/5 Safe | Severe |
| 7 | **Bad debt from a failed liquidation** | The novel time-sliced/RFQ liquidation path fails to clear a position; the insolvency exception in `liquidateFlash` explicitly permits seizing all collateral and leaving debt. Blue-chip collateral and a 1.25 target health factor mitigate likelihood, but reserves are negligible | permissionless caller via `RfqEngine` | Partial, socialized |
| 8 | **Reflexive ftUSD impairment** | ftUSD's backing *is* a supply position in FT Lend; a loss here impairs ftUSD, which is 11.8% of the market's collateral and is priced by a feed blind to that backing | structural | Partial |
| 9 | **Spark or Aave exit shortfall** | Wrappers hold **zero idle buffer** (`deployed() == capital()`); a freeze or cash shortfall at either *otherwise low-risk* venue blocks or impairs exits | external (concentrated exposure) | Partial to total per-asset |
| 10 | **Withdrawal pause / breaker** | `setWithdrawPaused`, `CircuitBreaker`, or flipping `marginRestrictWithdrawToSettlement` / `marginWithdrawRequiresNoDebt` to `true` traps funds | 3/5 Safe / guardian | Temporary lockup |
| 11 | **Chainlink feed failure** | Single feed per asset; a stale or wrong price mis-liquidates. Adapters are immutable but the owner can `setPaused` the wrapper, denying pricing | external / 3/5 Safe | Partial |

Paths 1–6 require trusting a single 3-of-5 multisig with no delay. Paths 7–11 are structural or external. **There is no insurance fund and no SEAL Safe Harbor enrolment behind any of them; a live Sherlock bug bounty provides a public disclosure and reward channel.**

## Audits and Due Diligence Disclosures

The team provides gated portal access to the in-scope FT Lend / ftDNMM contracts and ftUSD have been audited multiple times by reputable firms, and keeps the reports and finding-level detail private.

An investor-relations portal does host a structured **Audits** registry — its front-end code contains a component that renders an "Audits" heading over a list, with per-row states for entries that have **no attached report file**. The portal is behind a **unique-access-code wall**: every page renders only "Enter Your Unique Code Below" and fetches no audit data until authenticated. No firm name, date, scope, or finding count could be verified for this assessment.

| Item | Status |
|---|---|
| Public bug bounty | **LIVE** — [Sherlock Flying Tulip Bug Bounty #248](https://audits.sherlock.xyz/bug-bounties/248?tab=scope), max reward 1,000,000 USDC; the bounty's **Additional Scope** incorporates Flying Tulip's dynamic list of all deployed production contracts, including FT Lend (see below) |
| SEAL Safe Harbor enrolment | **Not enrolled** (absent from the `security-alliance/safe-harbor` registry) |
| Contract source verification on Etherscan | **PASS** — all 20 contracts checked are verified (see Appendix B) |

- The docs' [Risks page](https://docs.flyingtulip.com/risks/) states a policy of "external audits before enabling capital-bearing features" and lists "Transparency. Publish parameters, addresses, **audit reports**, and incident post-mortems" as a security principle. The audit reports are not public.
- Only two reviews are publicly confirmable, and **neither covers the assessed contracts**: the token-sale `Escrow` (PeckShield #2025-170, Oct 2025; Cantina Managed, Oct 2025) and the separate **ftPUT** product ([Sherlock contest #1223](https://audits.sherlock.xyz/contests/1223), Jan 2026).
- **Accepted risks** from the Sherlock ftPUT contest README — relevant because the same team and patterns build Lend: "protocol-level loss handling and backstops are out-of-scope," "malicious strategy manager cannot be removed," "caps updates can be front-run," and a circuit-breaker that does not cover all flows. Each of these is observable in the deployed Lend contracts (see [Centralization](#centralization--control-risks)).

**Contract complexity is high:** a novel dynamic-LTV money market with snapshot LTVs, an RFQ/relayer/session layer, flash-liquidations, epoch settlement, cross-product shared collateral, and a stablecoin whose backing is actively managed by a strategy contract. Complexity of this order is precisely where public, finding-level audit disclosure matters most.

### Bug Bounty

**LIVE.** [Sherlock's Flying Tulip Bug Bounty #248](https://audits.sherlock.xyz/bug-bounties/248?tab=scope) has been live since June 18, 2026 and advertises a maximum reward of **1,000,000 USDC**. Its **Additional Scope** states that contracts deployed for the bounty are found either in Sherlock's static Scope section or in Flying Tulip's linked [Contract Addresses](https://docs.flyingtulip.com/contract-addresses/) directory. That directory points to Flying Tulip's Smart Search, the protocol-maintained dynamic list of all deployed production contracts. Accordingly, the live bounty covers the deployed contracts assessed here, including `PositionsManager`, `ConfigRegistry`, the RFQ engines, the IRMs, the wrappers and strategies, and the related ftUSD contracts, even when an address is not duplicated in Sherlock's static address table.

> **Scoring note.** This does **not** trigger the "No audit" critical gate — a real audit registry demonstrably exists, so asserting "no audit" would be false. Audits can be access with team permission.

## Historical Track Record

- **Production history.** TGE / mainnet ~**Feb 23, 2026**; ftUSD [deployed Feb 21, 2026](https://etherscan.io/tx/0x52e7d46b7e166b8e30c5d38a09d93c44537bcb77b439e5b125d8b51d5670ea21). The assessed lending engine is newer: `ConfigRegistry` and `PositionsManager` were [deployed April 27, 2026](https://etherscan.io/tx/0x8838947473f9a3b6ba3f46bd89ecd5b28d7bd470e8c0b969cb38ceb5c4ebcdef) (block `24974967`) and the **first `Deposit` event is April 29, 2026** (block [`24986969`](https://etherscan.io/block/24986969)). Protocol ~5.4 months old; **FT Lend in its current deployment ~3.2 months.**
- **TVL (DeFiLlama, whole protocol):** **~$12.56M** on August 3, 2026 — Ethereum $12.14M, Sonic $0.42M ([API](https://api.llama.fi/protocol/flying-tulip)). Peak **~$12.58M on July 31, 2026**; tracked since ~May 12, 2026 (85 data points). The marketed "$126M+ TVL" figure is **raise capital parked in Aave**, not protocol usage.
- **FT Lend onchain TVL:** **$12.48M supplied / $0.97M borrowed** (6.43% utilization) — reconciles with DeFiLlama's $12.14M Ethereum figure.
- **Genuine third-party TVL is $8.11M, not $12.48M.** $4.38M (35.1%) is the protocol's own ftUSD backing collateral supplied back into the market by its own strategy contract.
- **Incidents / exploits / depegs:** **NONE FOUND** for Flying Tulip itself through August 2026. (An April 23, 2026 news item concerns Flying Tulip *adding* a withdrawal circuit breaker after *other* protocols' April exploits — preventive, not a breach.)
- **ftUSD:** supply 4,142,539; oracle price ~$0.9988; `maxSupply` cap 100M (raised from 5M); thinly traded.

### TVL history

DeFiLlama daily series (protocol-wide, [API](https://api.llama.fi/protocol/flying-tulip)); tracking began ~May 12, 2026:

| Month | Open | Close | Low | High |
|---|---:|---:|---:|---:|
| May 2026 | $2.93M | $5.05M | $2.93M | $5.05M |
| June 2026 | $5.75M | $8.97M | $4.56M | $8.97M |
| July 2026 | $8.92M | $12.58M | $8.92M | $12.58M |
| August 2026 (MTD) | $12.41M | $12.63M | $12.41M | $12.63M |

Growth has been monotonic apart from one drawdown: **−20.7% from the running peak on June 6, 2026**. That is the only stress episode in the series and it was a growth-phase dip, not a redemption event. Chain split at the latest point: **Ethereum $12.20M (96.6%), Sonic $0.42M (3.4%)**, borrowed $1.11M protocol-wide. Sonic is immaterial and out of scope for this report.

Two caveats on reading this series: (1) it starts only ~2 weeks after FT Lend opened, so there is no pre-launch baseline; (2) ~35.1% of the Ethereum figure is the protocol's own recycled ftUSD collateral — the Delta-Neutral strategy deposits ftUSD's USDC/USDT backing into this same market — so the growth curve overstates third-party adoption. See [Reflexive supply](#reflexive-supply-ftusd-backing-lent-into-ft-lend).

### FT Lend market state — onchain, block `25697429` (August 6, 2026)

| Asset | IRM | Maint. margin | Borrowable | Collateral | Supplied | Borrowed | Util | Supply cap | Cap used |
|-------|-----|:---:|:---:|:---:|---|---|:---:|---|:---:|
| [USDC](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Stable | 1.50% | ✓ | ✓ | 3,175,623 ($3.17M) | 241,018 | 7.6% | 10M | 32% |
| [USDT](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) | Stable | 1.50% | ✓ | ✓ | 1,429,877 ($1.43M) | 223,541 | 15.6% | 10M | 14% |
| [WETH](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) | Major | 19.0% | ✓ | ✓ | 736.92 ($1.41M) | **95.35** | **12.9%** | 1,000 | 74% |
| [WBTC](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | Major | 22.0% | ✓ | ✓ | 75.18 ($4.86M) | 0 | 0% | 100 | 75% |
| [wstETH](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | Major | 21.0% | — | ✓ | **76.54** ($0.18M) | 0 | — | 300 | 26% |
| [ftUSD](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | Stable | 1.50% | ✓ | ✓ | 1,428,403 ($1.43M) | 322,186 | 22.6% | **1.5M** | **95%** |
| [FT](https://etherscan.io/address/0x5DD1A7A369e8273371d2DBf9d83356057088082c) | LongTail | 0% | — | — | 763.25 (unpriced) | — | — | 0 | — |
| **Total** | | | | | **$12.48M** | **$0.97M** | **7.8%** | | |

Prices at block `25697429`: USDC $0.9998, USDT $0.9991, WETH $1,911.99, WBTC $64,680.05, wstETH $2,372.33, ftUSD $0.9988. FT has **no configured price feed** — `priceUSD(FT)` reverts.

**The market changed materially between August 3 and August 6.** wstETH went from 0 supplied to 76.54, and WETH borrows from 0.35 to 95.35 — both driven by the Delta-Neutral strategy activating its hedge leg (see below). WETH utilization went from 0.05% to 12.9% in three days. A market that moves this fast on one actor's decision warrants a shorter reassessment interval than its size alone would suggest.

**Cap headroom is a live constraint.** ftUSD is at **95% of its 1.5M supply cap**; WBTC and WETH at ~75%. Caps are raised by the admin Safe in one transaction via `PMWrapper.setCaps` with no delay.

### Interest rate models

`borrowAPR(asset, utilizationWad)` sampled directly on each IRM contract (all `pure`, so the curves are fixed until the `ConfigRegistry` points an asset at a different IRM):

| Utilization | Stable IRM | Major IRM | LongTail IRM |
|---:|---:|---:|---:|
| 0% | 1.50% | 1.00% | 6.00% |
| 25% | 4.44% | 2.92% | 13.69% |
| 50% | 7.38% | 4.85% | 21.38% |
| 75% | 10.32% | 6.77% | 68.86% |
| 80% | 10.91% | 12.45% | 90.29% |
| 90% | 38.17% | 39.73% | 133.14% |
| 100% | 91.50% | 67.00% | 176.00% |

Kinks sit at ~80% for Stable and Major and ~50–75% for LongTail. The curves are conventional and adequately steep above the kink to defend exit liquidity. At today's 6.4% utilization, suppliers earn near the base rate, so most of the realised supply yield comes from the Spark/Aave strategies rather than from borrowers.

## Funds Management

### How supplying works

A lender calls `deposit(asset, amount)` on the `PositionsManager`. Un-borrowed liquidity is held by the asset's `ftYieldWrapper`; where a strategy is configured the wrapper deploys it. Borrower interest and strategy yield accrue through the supply index. Withdrawals (`withdraw`) pull from currently available wrapper liquidity.

| Asset | FT Lend yield wrapper | Strategy | Venue |
|---|---|---|---|
| USDC | [`0xD2e4A5ac…39E2`](https://etherscan.io/address/0xD2e4A5ac4B4Da102317cF7C9A1289aDF082639E2) | [`0xfBE0736e…b0e5`](https://etherscan.io/address/0xfBE0736eBF5668A604D73BA93a5DdBEe9c10b0e5) `SparkSavingsStrategy` | Spark |
| USDT | [`0x28b0905d…123B`](https://etherscan.io/address/0x28b0905d83BCe5FFA6c54651F25858828A38123B) | [`0x852dc763…6a42`](https://etherscan.io/address/0x852dc7638aD159Ec12526d7E47f53f1307756a42) `SparkSavingsStrategy` | Spark |
| WETH | [`0x460494aF…2da2`](https://etherscan.io/address/0x460494aF61BcB92B59797B4e09C26A5ADecb2da2) | [`0x4df6f4f8…F2a7`](https://etherscan.io/address/0x4df6f4f8CDA409550A5d8A89aD66DE355CF7F2a7) `SparkSavingsStrategy` | Spark |
| WBTC | [`0x1A5730c7…E042`](https://etherscan.io/address/0x1A5730c71576D77048E9FdC79DD40e4B1E8Fe042) | [`0x06980dC5…3B92`](https://etherscan.io/address/0x06980dC564e85c1eef0b2F85c803f08A30113B92) `AaveStrategy` | Aave |
| wstETH | [`0x01980BD1…3db7`](https://etherscan.io/address/0x01980BD1B58313bD3767f6adc75Af8b6464f3db7) | none | — |
| ftUSD | [`0xc67D966f…53d9`](https://etherscan.io/address/0xc67D966f761e8cf13Faa0a1E774425290c8453d9) | none | held idle in wrapper |
| FT | [`0x7127BB9d…840E`](https://etherscan.io/address/0x7127BB9d9ad0f47B8dA9087e634D67F3946F840E) | none | circuit breaker unset (`address(0)`) |

**There is no idle buffer.** On all four wrappers with a strategy, `deployed()` equals `capital()` to the wei — 2,902,577.215876 USDC, 1,180,959.539429 of 1,180,959.539430 USDT, 736.579217 WETH and 7,518,219,204 WBTC units are inside Spark/Aave, not in the wrapper. **Every lender withdrawal is a Spark or Aave withdrawal in the same transaction** and inherits that venue's liquidity and pause state. Only the ftUSD wrapper (1,109,633 ftUSD, no strategy) holds its balance locally.

### Fees, reserves and revenue

| Flow | Parameter | Value | Set by |
|---|---|---|---|
| Lending protocol reserves | `astate.reserves` | 7.72 USDC · 13.16 USDT · 303.01 ftUSD · 0.0000257 WETH · **0 WBTC** | accrued from interest |
| Reserve withdrawal | `PMWrapper.withdrawReserves` | unrestricted | Admin Safe |

**Protocol reserves are negligible** — a few hundred dollars in total against a $12.48M book. The current book uses blue-chip collateral and a 1.25 target health factor, which reduce expected bad-debt risk. Reserves nevertheless provide no meaningful buffer against any residual loss; bad debt would be borne by suppliers of the affected asset. ftUSD mint/redeem fees are covered in the ftUSD report.

### Supplier rewards are discretionary FT emissions

`settleEpoch(asset, interest)` on the `PositionsManager` is **`onlyAdmin`**. The admin transfers **FT tokens** into the contract, which are deposited to the FT wrapper and distributed to that asset's suppliers pro-rata by supply-time (`totalSuppliedTime`), with the epoch rate recorded as `rateRay`. This is a material and undocumented component of advertised supply yield, and it is entirely discretionary — no rule obliges the admin to fund an epoch, and no schedule is published.

Settlement history by asset (latest settled epoch, read from `astate` and `epochs`):

| Asset | Epochs settled | Last settlement | FT emissions received |
|---|---:|---|---|
| USDC | **126** | Aug 2, 2026 | yes, ongoing |
| USDT | **120** | Aug 2, 2026 | yes, ongoing |
| WETH | **28** | Aug 1, 2026 | yes, ongoing |
| WBTC | **0** | never (epoch `t_end` still the Apr 27 deploy timestamp) | **none** |
| ftUSD | **0** | never | **none** |
| wstETH | 0 | never (no supply) | none |

**WBTC and ftUSD suppliers have never received a single FT emission** — that is 39.5% and 11.4% of TVL respectively earning only base interest, while USDC/USDT/WETH suppliers receive FT on top. Total emitted to date is the FT wrapper's balance: **43,792.78 FT** (~$4,353 at $0.0994). Any yield figure quoted for this market must be checked against which asset it applies to, and treated as revocable.

### Liquidation mechanics

`liquidateFlash(user, seizeTo, seizeAssets, seizeAmounts, repayAssets, repayAmounts, callbackData)` is callable **only by a registered liquidation module** — currently `RfqEngine` [`0xEB00B335…Dc32`](https://etherscan.io/address/0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32) alone. The flow is:

1. **Pre-check** — `hfPre < marginHfTargetBps` (1.25), else revert.
2. **Seize** — collateral is withdrawn from the user's `avail` balance to `seizeTo`, an address the module chooses, in module-specified amounts.
3. **Callback** — `onLiquidationFlash` lets the module trade the seized collateral and source repayment. The RFQ caller chooses the debt and collateral bundles; the engine's repayment cap permits partial fills sized around restoring the HF corridor, which is what "time-sliced / RFQ-routed" means here. Each fill is atomic — there is no onchain timer or automatic sequence of slices.
4. **Repay** — the engine's funds are pulled and booked against the user's debt, capped at its balance and allowance.
5. **Post-check** — `hfPost >= marginHfTargetBps`, **with an insolvency exception**: if `equityUSDPre == 0` *and* all seizable collateral is exhausted (`collUSDWadPost == 0`), the check is skipped so bad debt can be cleaned up rather than blocked.

**The liquidator proposes the price, but cannot set an arbitrary penalty.** Live at block `25776852`, `RfqEngine.liqBonusBps()` is 750 (7.5%), so oracle-valued collateral seized cannot exceed `actual debt repaid × 1.075`. The protocol receives 10% of the realized bonus (`protocolLiqSplitBps` = 1000): at the maximum, repaying $100 can seize $107.50, of which $0.75 goes to the protocol and $106.75 to the filler. This uses FT Lend's oracle values, not the collateral's realized DEX sale price.

| Proposed RFQ fill | Result | Why |
|---|---|---|
| Repay $100; seize $107.50 | Maximum permitted ordinary fill, subject to HF and dust checks | Exactly the 7.5% oracle-value cap |
| Repay $100; seize $110 | Reverts | Seized value exceeds `repay × 1.075` |
| Repay $50; seize $53.75 in an ordinary partial liquidation | Reverts | Fairness cap passes, but collateral-seizing partial fills have a $100 minimum repayment |
| Repay $50; seize nothing | Not blocked by the $100 floor; normal HF checks still apply | Pure repayment is exempt; the payer receives no collateral |
| Repay $50; seize at most $53.75 and close all debt | Permitted by the minimum-size rule | Full debt closure is exempt, but the 7.5% fairness cap still applies |
| Repay $50; seize at most $53.75 and exhaust an already-insolvent account's collateral | Permitted by the minimum-size rule | Terminal insolvency is exempt from the minimum and normal post-HF/dust checks, but not the fairness cap |

**Terminal bad debt is narrowly identified, not declared by the liquidator.** The engine computes `terminalBadDebt = (equityUSDPre == 0 && collUSDWadPost == 0)`: the account must already have zero economic equity before the fill, and the fill must leave no oracle-valued collateral. The seize-fairness cap is checked before this exception, so even a terminal fill cannot take more than repayment plus the 7.5% bonus. Any debt left after the last collateral is removed is unsecured; it can still be repaid at any size through a pure-repayment RFQ or `repayFor`, but there is no collateral incentive or funded backstop to make a third party do so.

Three structural observations:

- **Not keeper-protected — module-gated and mostly permissionless.** `PositionsManager.liquidateFlash` is callable only by the registered module (`RfqEngine`), but `RfqEngine.rfqFill` / `rfqFillFlash` themselves have **no general liquidator whitelist**. Anyone can liquidate a normal underwater account. The only exception is `privilegedAccounts`: those may be liquidated only by `permissionedLiquidators`. Today the sole privileged account is the ftUSD strategy [`0xe0E445…1A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59), and **zero** permissioned liquidators are set — so that account is currently unliquidatable via this path. No `rfqFill*` / `liquidateFlash` execution has occurred yet.
- **No liq bonus or close factor in `PositionsManager`.** Seize/repay sizing lives in `RfqEngine` (onchain module, not the core ledger). Core only requires HF ≥1.25 after — bounds under-liquidation, not how much collateral value the borrower loses per unit of debt repaid.
- **The insolvency exception is an explicit bad-debt path.** It permits a position to end with all collateral seized and debt outstanding. The debt remains technically repayable, but without collateral there is no liquidator incentive or funded backstop; unless the borrower or protocol supplies the missing asset, the economic shortfall falls on suppliers against reserves of essentially zero.

Because the liquidation module is swappable by the admin (`setLiquidationModule`), the economics of liquidation are a governance parameter, not a code invariant. To date the module has never been changed since deployment.

### Reflexive supply: ftUSD backing lent into FT Lend

The single largest supplier to FT Lend is not a third party. It is [`0xe0E44596…1A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59), the `MultiCollateralDeltaNeutralStakingStrategy` that holds ftUSD's collateral, which deposits that collateral into this market (**35.1% of TVL** today):

| Position | Amount | USD |
|---|---|---|
| USDC supplied | 2,780,139.26 | $2.78M |
| USDT supplied | 1,417,609.56 | $1.42M |
| wstETH supplied (collateral for its hedge) | 76.54 | $0.18M |
| **Total** | | **$4.38M = 35.1% of TVL** |
| WETH borrowed (hedge leg) | 95.01 | 99.6% of all WETH debt |

**What a lender needs to take from this:**

1. **Headline TVL overstates third-party capital.** Genuine third-party TVL is **$8.11M**, not $12.48M.
2. **ftUSD and FT Lend cannot fail independently.** ftUSD's backing is a claim on this market; ftUSD is 11.4% of this market's collateral; and ftUSD's price feed is blind to that backing. A loss event propagates in a circle while the protocol feed does not register the backing impairment.
3. **The largest supplier is also a leveraged borrower.** It is now 99.6% of all WETH debt, so its health factor is a solvency variable for this market — and it is operated by a key set that includes a plain EOA.
4. **It can leave.** A 35.1% supplier unwinding would be the largest liquidity event this market has seen.

Full derivation of the backing chain, the collateral reconciliation, the strategy's operator model, and the risks to ftUSD holders themselves are in **[Flying Tulip — ftUSD & Staked ftUSD](./flying-tulip-ftusd.md)**.

### Accessibility

| Action | Who | Atomic? | Fees | Limits |
|---|---|---|---|---|
| Supply to FT Lend | permissionless | yes, same tx | none | per-asset `supplyCap` |
| Withdraw from FT Lend | permissionless | yes, if wrapper liquidity available | none | `withdrawPaused`, CircuitBreaker, available liquidity |
| Borrow | permissionless, over-collateralized | yes | interest per IRM | `borrowCap`, `mmBps`, HF ≥ 1.25, $250 min equity |
| Liquidate | **module-gated** (`RfqEngine.rfqFill`/`rfqFillFlash`); callers permissionless except for `privilegedAccounts` | yes | module-defined (`liqBonusBps` etc. on `RfqEngine`) | HF < 1.25 |

There are **no withdrawal queues, cooldowns, or lockups** on the lending path in normal operation — a genuine strength, and a real difference from the staked-ftUSD product, which is rate-limited. All gating here is either liquidity-based or admin-flippable.

### Token Mint Authority

**Not applicable to the assessed position.** An FT Lend supply position is an internal balance on the `PositionsManager`, not a transferable or mintable token — there are no supply receipts and no mint authority to enumerate.

The relevant mint authority is ftUSD's, because ftUSD is 11.4% of this market's collateral and an unbacked mint would dilute that collateral. In short: the 3/5 admin Safe is ftUSD `owner` + `masterMinter` and can register an arbitrary new mint module or replace the minter outright, issuing ftUSD with no backing. Full enumeration in **[Flying Tulip — ftUSD & Staked ftUSD](./flying-tulip-ftusd.md)**.

**Softener, not a fix:** the FT Lend `CircuitBreaker` can **rate-limit post-mint outflows** (wrapper withdrawals, redemptions, unstaking), which can slow a dump / run cascade into this market after an unbacked mint. They do **not** prevent the mint, reverse dilution, or act as an independent check — the same admin Safe owns / can unset those breakers.

### Collateralization

- **Backing.** Borrowing is over-collateralized and enforced onchain via per-asset maintenance margins (`ConfigRegistry.assetCfg`) and account health (Hf - health factor): `marginHfSafeBps = 15000` (1.50), `marginHfTargetBps = 12500` (1.25), `marginMinEquityUSDWad = 250e18` ($250 minimum position equity).
- **Collateral quality.** Blue-chip (WETH, WBTC, wstETH, USDC, USDT) plus ftUSD. The blue-chip leg is genuinely high quality; ftUSD (11.4% of TVL) carries the reflexivity above.
- **Maintenance margins are thin on stables.** `mmBps = 150` implies a 1.5% maintenance floor — ~66× theoretical leverage before the dynamic-LTV haircut. The protocol states effective LTV is reduced from this floor by AMM depth and volatility and snapshotted at position open, but that reduction is computed off the Spot AMM/CLOB and is **not independently verifiable onchain**. The floor is what the contract enforces.
- **Liquidations.** Onchain, module-gated through `RfqEngine` [`0xEB00B335…Dc32`](https://etherscan.io/address/0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32) (`rfqFill` / `rfqFillFlash` → `liquidateFlash`; set at deployment, never changed). **Not keeper-whitelisted** — any address may call those entrypoints for normal accounts; only `privilegedAccounts` require `permissionedLiquidators`. Time-sliced / RFQ-routed by design, novel and untested at scale. Per the team's own accepted-risk list there is **no protocol-level loss backstop / insurance fund** for bad debt.
- **Reserves are negligible.** `astate.reserves` across all assets: 7.72 USDC, 13.16 USDT, 0.0000257 WETH, 303.01 ftUSD, 0 WBTC. There is effectively no protocol-side buffer to absorb a shortfall.
- **Curation.** The 3/5 Safe sets every risk parameter — which assets are enabled/collateral/borrowable, maintenance margins, supply/borrow caps, IRMs, and the oracle.

### Provability

- **Reserves are fully onchain and reconcile exactly.** Verified two independent ways at block `25675412`: (a) summing every supplier's `getBalance` across all assets reproduces each `astate.totalSupplied` and totals $12,127,035; (b) summing `debtShares` pro-rata reproduces `astate.borrows` and totals $780,125. The ftUSD backing chain reconciles to the wei (table above). This is a genuine strength — the accounting is honest and independently checkable.
- **Oracle — better than "admin-controlled", worse than "canonical Chainlink".** Three of six feeds are canonical Chainlink `EACAggregatorProxy` contracts owned by Chainlink. Three are protocol-deployed wrappers owned by the admin Safe — but with **immutable** base feeds and adapters, so the owner cannot repoint them:

| Asset | Router feed | Type | Wraps | Owner | Staleness | Dev. |
|---|---|---|---|---|---|---|
| USDC | [`0x8fFfFfd4…18f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) | Chainlink `EACAggregatorProxy` | USDC/USD | Chainlink | 88,200s | 25 bps |
| USDT | [`0x3E7d1eAB…e32D`](https://etherscan.io/address/0x3E7d1eAB13ad0104d2750B8863b489D65364e32D) | Chainlink `EACAggregatorProxy` | USDT/USD | Chainlink | 88,200s | 25 bps |
| WETH | [`0x5f4eC3Df…8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) | Chainlink `EACAggregatorProxy` | ETH/USD | Chainlink | 5,400s | 50 bps |
| WBTC | [`0x183dB475…DA55`](https://etherscan.io/address/0x183dB475d8184aA7a018ed2164e11A887afBDA55) | `ChainlinkLatestAnswerProxy` | Chainlink BTC/USD + Aave [`CLSynchronicityPriceAdapterPegToBase`](https://etherscan.io/address/0xDaa4B74C6bAc4e25188e64ebc68DB5050b690cAc) | **3/5 Safe** | 88,200s | 50 bps |
| wstETH | [`0x000bb128…f35a`](https://etherscan.io/address/0x000bb128a8aBCFa05B871C97CC9C5f88e7Dcf35a) | `ChainlinkLatestAnswerProxy` | Chainlink ETH/USD + Aave [`WstETHPriceCapAdapter`](https://etherscan.io/address/0xe1D97bF61901B075E9626c8A2340a7De385861Ef) | **3/5 Safe** | 5,400s | 50 bps |
| ftUSD | [`0xA69f7a38…DFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8) | `FtUsdMintRedeemOracleProxy` | Chainlink USDC/USD × `MintAndRedeem` redeem factor | **3/5 Safe** | 86,400s | **0 bps** |

  Using Aave's audited peg and cap adapters for WBTC and wstETH is a sound choice and better than a raw feed. The residual concerns are: the owner can `setPaused(true)` on any wrapper (a price-denial, not a price-forgery, path); ftUSD's price is **blind to its own backing** (the redeem factors are functions of the USDC price and cumulative mint history, not of the collateral) and carries a **0 bps deviation tolerance**; and WBTC's 88,200s (24.5h) staleness window is long for a 39.5%-of-TVL asset.
- **The real override is at the router.** `OracleRouterChainlink` [`0xe4372dB4…674A`](https://etherscan.io/address/0xe4372dB43D2814750a19b93950157AD81D93674A) exposes `setLastGoodPrice(asset, price)` to its owner — the 3/5 Safe — which writes an **arbitrary price directly**, bypassing every adapter safeguard above. `setPriceFeed`, `setStaleFallback`, `setPriceDeviation` and `setOwner` are likewise owner-only; `disablePrice` is guardian-only. Immutable adapters do not constrain this path.
- **Source availability.** All 20 assessed contracts are source-verified on Etherscan (Appendix B). **No public GitHub repo** for the lending or ftUSD code, and no public audit reports, so review is limited to reading verified bytecode.

## Liquidity Risk

Lender-exit frame: a supplier leaves via `withdraw` against available (un-borrowed) wrapper liquidity. Secondary-market depth for ftUSD is noted below only as context for the ftUSD collateral/supply leg — it does not exit a USDC/WETH/WBTC lending position.

- **Exit mechanism.** Suppliers withdraw against available wrapper liquidity: 2.903M USDC of 3.140M supplied (7.6% utilized), 1.181M USDT of 1.404M (15.9%), 736.58 of 736.92 WETH (0.05%), all 75.18 WBTC (0%), 1.110M of 1.428M ftUSD (22.3%). Exit is instant today; borrowed funds are unavailable until repaid or liquidated. **Utilization is the primary liquidity constraint.**
- **Depth of the market.** Thin absolutely: largest pool is WBTC at $4.79M, then USDC at $3.14M. Supply receipts are internal balances (normal for lending); no transferable receipt to sell.
- **Concentration is the dominant liquidity risk.** Only **25 addresses** hold the entire $12.13M. Excluding the protocol's own Delta-Neutral strategy, **three genuinely third-party addresses hold 96.1% of the $8.11M third-party TVL**:

| Supplier | Type | USD | % of total TVL | % of third-party TVL | Holdings |
|---|---|---:|---:|---:|---|
| [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) | EOA | $4.62M | 38.1% | **58.1%** | 72.18 WBTC + 21.9K USDC |
| [`0xe0E445…1A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59) | **protocol strategy** | $4.38M | 35.1% | — | 2.78M USDC + 1.42M USDT + 76.5 wstETH |
| [`0x666130…701c`](https://etherscan.io/address/0x66613091b75e54954f77746e160c98391f99701c) | Safe | $1.87M | 15.4% | 23.5% | 1.43M ftUSD + 237.4 WETH |
| [`0x0d5dc6…4e83`](https://etherscan.io/address/0x0d5dc686d0a2abbfdafdfb4d0533e886517d4e83) | Safe | $1.15M | 9.5% | 14.5% | 485.1 WETH + 245.2K USDC |
| 21 others | mixed | $0.31M | 2.5% | 3.9% | — |

- **Borrowing is one account.** 11 addresses carry debt; the *same* EOA [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) holds **72.7% of all outstanding debt** ($567K across USDC/USDT/ftUSD) while being the largest supplier. It is simultaneously the market's biggest lender, biggest borrower, and sole WBTC depositor of size. A single account's liquidation, exit, or default is the dominant tail risk.
- **Secondary market depth for ftUSD: real, and deeper than the market itself is utilized.** The dominant venue is a Curve StableSwap-NG pool:

| Venue | Pool | ftUSD side | Quote side | Notes |
|---|---|---|---|---|
| **Curve StableSwap-NG** | [`0xafec61e7…2630`](https://etherscan.io/address/0xafec61e7a604f8f81f7cab64ec75bfa07c542630) | **118,921 ftUSD** | **130,034 USDC** | ~$249K, A=1000, fee 0.2%; >85% smaller than initial snapshot |
| Curve Twocrypto | [`0x68102ff5…ad6c`](https://etherscan.io/address/0x68102ff5406475881462880a8da3c9bc9181ad6c) | 48,838 ftUSD | FT | FT/ftUSD pair |
| Uniswap V3 0.05% | [`0x99986c44…bf2c`](https://etherscan.io/address/0x99986c4473e3C8fF3b31FA8a92fB582d19BdBf2c) | 0.000033 ftUSD | 0.00064 USDC | dust — not a usable venue |
| Uniswap V3/V2 (other tiers) | — | no pool deployed | — | — |

  Measured slippage on the Curve pool (`get_dy`, ftUSD → USDC):

| Size | Out | Slippage |
|---|---|---|
| 10,000 ftUSD | ~9,979 USDC | ~0.21% |
| 50,000 ftUSD | 49,880.65 USDC | 0.239% |
| 100,000 ftUSD | 99,616.85 USDC | 0.383% |
| 150,000 ftUSD | 129,378.67 USDC | **13.75%** |

  The initial August 6 snapshot supported a $500K exit at 0.30%, but the dominant LP exited on August 28 and the pool fell from ~$1.87M to ~$249K. On September 4, **$100K exits at about 0.38%, while $150K incurs about 13.75% slippage**. The pool remains an external price signal and exit for ftUSD, but no longer provides deep corroboration. This does not change the FT Lend supplier liquidity score because Curve cannot exit a USDC/WETH/WBTC lending position. ftUSD also circulates as collateral in [Morpho](https://etherscan.io/address/0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb) (629,675 ftUSD), which is independent third-party acceptance of the asset.

- The supply receipts themselves have no secondary market which is normal for lending protocols. A lender's FT Lend position is an internal balance, not a transferable token, so exit is redemption-only against wrapper liquidity — which is a Spark/Aave withdrawal. The Curve venue above is an exit for *ftUSD holders*, not for USDC/WETH/WBTC lenders. This distinction matters: it improves the ftUSD collateral leg and the ftUSD-supplier leg, and does nothing for the other 88% of the market.

- **Throttles / pause.** The admin can pause deposits/borrows/withdrawals per asset (`setDepositPaused` / `setBorrowPaused` / `setWithdrawPaused`); a `CircuitBreaker` [`0x9676E697…18e0`](https://etherscan.io/address/0x9676E697399581AB288844cDE5F73d0887eC18e0) can halt flows; config flags `marginRestrictWithdrawToSettlement` and `marginWithdrawRequiresNoDebt` can gate withdrawals (both currently `false`). The breaker is **owned by the admin Safe**, each wrapper's `setCircuitBreaker` is `onlyStrategyManager` and accepts `address(0)`, and the wrappers expose `withdrawBypassCB`. It is an operational rate limiter, not a safeguard against the admin.
- **Dependency.** Exit liquidity for USDC/USDT/WETH/WBTC depends **entirely** on Spark/Aave withdrawability — zero idle buffer.
- **Stress history:** none. No drawdown, mass exit, or liquidation cascade has occurred.

## Centralization & Control Risks

### Governance

**A single 3-of-5 Gnosis Safe is the root of all authority, with no timelock.**

- **Admin Safe:** [`0x1118e1c057211306a40A4d7006C040dbfE1370Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) — Gnosis Safe v1.3.0, **threshold 3 of 5**. Signers (undisclosed in docs, presumed team EOAs): [`0xB7B54333…08bc8`](https://etherscan.io/address/0xB7B543337539219A5a1326aCB71dBa8Bba408bc8), [`0x3c427497…1B4E`](https://etherscan.io/address/0x3c42749709BF354B3aE0Db29Fd2dd88089b21B4E), [`0xf9E5aF16…9a10`](https://etherscan.io/address/0xf9E5aF16243041cE3141284D225CAfC0fC749a10), [`0x09E2B492…7881`](https://etherscan.io/address/0x09E2B49280f1879172b2C3345d08896921707881), [`0xD0CA8838…6f5A`](https://etherscan.io/address/0xD0CA88388d1732594D611535314e9B6745396f5A).
- **Guardian Safe:** [`0x22246a9183cE2CE6e2c2a9973F94aEA91435017C`](https://etherscan.io/address/0x22246a9183cE2CE6e2c2a9973F94aEA91435017C) — **3 of 4**, signer set a strict *subset* of the admin Safe. No independent parties.
- **WBTC strategy-manager Safe:** [`0x5557729b169082f07d3131D560E2f2cb5e6c48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) — a **third** Safe, **3 of 5**, with the *identical five signers* as the admin Safe. `strategyManager` of the WBTC wrapper only. Separate address, zero added independence.
- **Upgradeability:** every core contract is an OpenZeppelin **UUPS proxy** (EIP-1967 admin slot empty; upgrade gated by `owner()`/`admin()`). `PositionsManager.admin()` is `PMWrapper` [`0xBDD80028…C68B`](https://etherscan.io/address/0xBDD80028c9e4b9A2D268D2cF62Fb54Ec8697C68B), whose `admin()` is the same 3/5 Safe and which can `upgradePM`, `setCaps`, pause, and `withdrawReserves`.

With **no delay**, the 3/5 Safe can: upgrade any contract to arbitrary code, change which assets/caps/margins apply, write an arbitrary oracle price, pause user funds, redirect where lender capital is deployed, and (for ftUSD) authorize a new issuance path that need not enforce collateral, blacklist, and burn balances. The current production mint module is collateralized and no evidence of privileged unbacked issuance was found. There is **no timelock, no DAO, and no independent guardian.**

### Admin powers over FT Lend (verified onchain)

| Role | Who | Powers |
|------|-----|--------|
| Owner — ConfigRegistry, OracleRouter, MintAndRedeem, ftUSD Core, CircuitBreaker, all 7 yield wrappers; ftUSD owner/masterMinter/pauser/blacklister | [3/5 Safe `0x1118…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | Enable/disable assets, set maintenance margins, set IRMs, set/override oracle prices, upgrade all proxies, mint/seize ftUSD |
| PositionsManager admin (via PMWrapper) | 3/5 Safe | `upgradePM`, `setCaps`, `setBorrowPaused`/`setDepositPaused`/`setWithdrawPaused`, `setLiquidationModule`, `setEngine`, `withdrawReserves`, `settleEpoch` |
| Guardian — ConfigRegistry, OracleRouter | [3/4 Safe `0x22246a…017C`](https://etherscan.io/address/0x22246a9183cE2CE6e2c2a9973F94aEA91435017C) | `disablePrice`, pause |
| Yield-wrapper `strategyManager` (6 of 7 wrappers) | 3/5 Safe | `setStrategy`, `removeStrategy`, `setStrategiesOrder`, `setCircuitBreaker` (incl. `address(0)`), `setDepositor`, `setPutManager` |
| Yield-wrapper `strategyManager` (**WBTC only**) | [3/5 Safe `0x5557729b…48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) | Same powers over the wrapper holding 39.5% of TVL |
| Yield-wrapper `yieldClaimer` | [`YieldClaimer 0x88432bB6…1397`](https://etherscan.io/address/0x88432bB6EA62e774cB6d87995CC5277568d01397) | **`execute(strategy, to, value, data)` — arbitrary call forwarded through the strategy** — plus `forceWithdrawToWrapper`, `claimYield` |
| Yield-wrapper `treasury` | [`0x9B2F12De…cDe5`](https://etherscan.io/address/0x9B2F12De620d4E2993068e5cab6D6c7451f6cDe5) | `setStrategyDelay` (UUPS proxy, impl [`0xf32adbe8…7d21`](https://etherscan.io/address/0xf32adbe84a4560084516f807b73d7cd7f0677d21)) |
| Fee collector / epoch settler | [`0x5cd6Abe6…958a`](https://etherscan.io/address/0x5cd6Abe67f8af1C0c699dF36d90a6469Eaf1958a) | Receives reserves/fees, settles epochs (UUPS proxy, impl [`0x63176fda…beb5`](https://etherscan.io/address/0x63176fdaee7af7fd60acd896e3b6ce894901beb5)) |

**`strategyDelayConfig` is `0` on every wrapper.** The two-step `setStrategy` → `confirmStrategy` flow exists but its timelock is set to zero, so a strategy manager can register and activate a new strategy — redirecting where lender capital is deployed — in the same block. Combined with `execute`'s arbitrary-call path and the Safe's ability to upgrade the wrapper proxies, custody of supplied assets is fully discretionary.

### Privileged engines and modules

Four contracts are whitelisted on the `PositionsManager` and can move user balances via `engineDebitAllowanceOf` / `engineHeld`. All were set in the **deployment block `24974967`** and none has changed since — a genuine positive (no post-launch privilege drift):

| Contract | Address | Engine | MetaModule | Liquidation module |
|---|---|:---:|:---:|:---:|
| `RfqEngine` | [`0xEB00B335…Dc32`](https://etherscan.io/address/0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32) | ✓ | — | **✓ (sole)** |
| `LeverageRfqEngine` | [`0x8263a075…40e2`](https://etherscan.io/address/0x8263a07504d93cB95e0a74f3627bb15faaf140e2) | ✓ | — | — |
| `MetaActions` | [`0x3633eb60…29f2`](https://etherscan.io/address/0x3633eb60d08756674472e2d34d6ffb5f4c1c29f2) | ✓ | ✓ | — |
| `MetaSessionActions` | [`0x4f83ac5c…3497`](https://etherscan.io/address/0x4f83ac5c8a79986d0916a8849730d9cef63a3497) | ✓ | ✓ | — |

### Programmability

Lending accounting (supply/borrow indices, health factors) is onchain and the oracle is Chainlink-anchored — good. The offchain/operator surface is nonetheless substantial: an RFQ/relayer/session layer (`RelayerAuth` [`0x823a97a2…53F4`](https://etherscan.io/address/0x823a97a2c32985e0f5457fc8103F36698D1F53F4), `SessionManager` [`0xF9f3ddF2…60f8`](https://etherscan.io/address/0xF9f3ddF2E96Cabef94e2634c326DC6dde99360f8), `MetaActions`/`MetaSessionActions`), a module-gated but mostly permissionless RFQ liquidation path, admin-settable oracle prices, epoch settlement by a privileged collector, and — uniquely here — a **discretionary strategy contract that decides where ftUSD's backing sits**.

### External Dependencies

- **Spark & Aave** — **low counterparty risk**, high *exposure*. Mature, heavily audited venues hold 100% of idle USDC/USDT/WETH/WBTC (`deployed() == capital()`). A freeze or withdrawal shortfall at either venue blocks lender exits only because FT Lend keeps **no idle buffer** — that is concentration of exit path, not a judgment that Spark/Aave are risky protocols.
- **Chainlink** — **low counterparty risk**. Canonical feeds price solvency for USDC/USDT/ETH; WBTC/wstETH use Chainlink bases plus Aave's audited peg/cap adapters (immutable). Ordinary residual: single feed per asset, no fallback oracle. The high-impact price risk in this system is the admin `setLastGoodPrice` override, scored under Governance — not Chainlink itself.
- **Aave price adapters** — `CLSynchronicityPriceAdapterPegToBase` (WBTC) and `WstETHPriceCapAdapter` (wstETH) sit in the pricing path for 39.5% of TVL; sound, audited construction.
- **FT Lend itself (reflexive)** — ftUSD's backing (~$4.38M) is supplied into this market by the Delta-Neutral strategy, and ftUSD is also accepted as collateral here, so the stablecoin and the money market cannot fail independently. See [Reflexive supply](#reflexive-supply-ftusd-backing-lent-into-ft-lend). This is the unusual dependency — not Spark/Aave/Chainlink.
- **The Spot AMM / CLOB — verified absent from the deployed contracts.** The docs describe dynamic LTV "snapshotted from AMM depth and volatility," and earlier revisions of this report carried that as an unverified critical dependency. It is not wired in. `ConfigRegistry`'s entire risk surface is `assetCfg` (IRM, `mmBps`, enabled/borrowable/collateral flags, wrapper), the three margin thresholds and the oracle pointer — **no depth input, no volatility input, no LTV machinery**. The `PositionsManager` contains no AMM or order-book reference beyond a comment on the `engines` mapping (`// PositionsManager, RFQ, ftLP, OrderBook, AMM, etc`), and all four registered engines are RFQ/meta-action contracts. The `RfqEngine`'s only "Uniswap" string is an MIT licence header on a copied math library. *Caveat: the lending repos are private, so this is established from deployed ABIs, source and event logs, not from the team's source of truth.*
- **Lido / wstETH** — a live component of the Delta-Neutral strategy's hedge at the August 6 snapshot (76.54 wstETH financed by 95.01 WETH debt).
- **Curve** — a StableSwap-NG [ftUSD/USDC pool](https://etherscan.io/address/0xafec61e7a604f8f81f7cab64ec75bfa07c542630) is the **only secondary-market** exit and external ftUSD price reference. Primary exit is protocol redemption. After the former dominant EOA exited on August 28, pool liquidity fell by more than 85% to ~$249K. Current gauge custody is 87.1% through the Convex voter proxy, 7.1% through an EOA, and 5.6% through `CurveYCRVVoter`; Convex aggregation does not establish beneficial ownership. Full analysis in the [ftUSD report](./flying-tulip-ftusd.md).

## Operational Risk

- **Team:** Founder **Andre Cronje** (public; founded Yearn, Keep3r, co-founded Sonic/Fantom) strong founder, but mixed reputation on other projects.
- **Legal entity / jurisdiction:** **NOT FOUND** / undisclosed (docs reference a "Foundation" with no domicile). CoinList sale excluded the US, Canada and ~21 other jurisdictions.
- **Funding:** ~$200M seed (Sep 2025, $1B FDV), ~$25.5M Series A (Jan 2026), public sale; the official sale-update blog reports total raised ≈ **$184M** (below the "$200M seed" headline — a reconciliation gap). FT token (Aug 3, 2026): max supply 10B, mainnet `totalSupply()` **1,197,190,528**, circulating ~547M, price ~**$0.0994**, **market cap ~$54.5M**, FDV ~$119M ([CoinGecko](https://www.coingecko.com/en/coins/flying-tulip)). FT is an OFT, so mainnet supply is not the cross-chain total.
- **Documentation vs. reality gap.** Beyond the usual omissions (oracle design, risk parameters, multisig setup), the public material does not clearly disclose that **ftUSD's backing is lent into FT Lend**. The hedge was inactive at the June snapshot and active by August 6, showing that strategy state can change materially between reviews. The docs' own transparency principle commits to publishing audit reports, which has not happened.
- **Incident response:** the docs claim "continuous monitoring and formal incident runbooks" and list "incident post-mortems" as a published artefact. **No runbook, no post-mortem, and no security contact are public**, and there have been no incidents to test the claim. Onchain emergency capability genuinely exists and is broad — per-asset pause, the `CircuitBreaker`, guardian `disablePrice`, ftUSD `pause` and `blacklist`. The live Sherlock bounty provides a public reporting channel covering deployed Flying Tulip production contracts through the dynamic contract list incorporated by its Additional Scope; Safe Harbor enrolment remains absent.
- **Other deployments:** Flying Tulip also runs on **Sonic**, which DeFiLlama puts at **$0.52M — 3.8%** of protocol TVL against Ethereum's $12.99M ([API](https://api.llama.fi/protocol/flying-tulip)). It is a separate deployment: none of the contracts assessed here exists on Sonic, so **nothing in this report transfers to it**, and no Ethereum position is exposed to it. Deliberately out of scope rather than pending — a Sonic allocation would need its own assessment, and at 3.8% of a $13M protocol that is not currently worth the effort.
- **Governance transparency:** no DAO, no forum/Snapshot, multisig signer identities undisclosed.

## Monitoring

Recommended frequency: **hourly** for pause/circuit-breaker, oracle overrides, and large supply/borrow swings; **daily** for governance, caps, and the reflexivity ratio.

### Contracts to monitor

| Contract | Address | Why |
|----------|---------|-----|
| PositionsManager | [`0xbe4050a7…0055`](https://etherscan.io/address/0xbe4050a73a7Fb384c65E885a15C33461A4B20055) | `astate` per asset, `supplyCap`/`borrowCap`, pause flags, `EngineSet`/`MetaModuleSet`/`LiquidationModuleSet`, `Upgraded` |
| ConfigRegistry | [`0xA8777c3D…a33E`](https://etherscan.io/address/0xA8777c3D446fa7F0b0FC97a80C1Ea1d37F1ca33E) | Asset enable/disable, `mmBps`, margins, oracle pointer, `Upgraded` |
| OracleRouterChainlink | [`0xe4372dB4…674A`](https://etherscan.io/address/0xe4372dB43D2814750a19b93950157AD81D93674A) | **`setLastGoodPrice` (arbitrary price write!)**, `setPriceFeed`, `setStaleFallback`, `disablePrice`, `setOwner` |
| Oracle wrapper proxies | WBTC [`0x183dB475…DA55`](https://etherscan.io/address/0x183dB475d8184aA7a018ed2164e11A887afBDA55), wstETH [`0x000bb128…f35a`](https://etherscan.io/address/0x000bb128a8aBCFa05B871C97CC9C5f88e7Dcf35a), ftUSD [`0xA69f7a38…DFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8) | `PausedSet`, `AnswerBoundsSet`, `MaxStalenessSet` — a pause here denies pricing |
| PMWrapper | [`0xBDD80028…C68B`](https://etherscan.io/address/0xBDD80028c9e4b9A2D268D2cF62Fb54Ec8697C68B) | `upgradePM`, `setCaps`, `withdrawReserves` |
| Admin Safe (3/5) | [`0x1118e1c0…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | Any `ExecutionSuccess`; `AddedOwner`/`RemovedOwner`/`ChangedThreshold` |
| Guardian Safe (3/4) | [`0x22246a91…017C`](https://etherscan.io/address/0x22246a9183cE2CE6e2c2a9973F94aEA91435017C) | Pause / `disablePrice` actions |
| WBTC strategy-mgr Safe (3/5) | [`0x5557729b…48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) | Any execution — controls the wrapper holding 39.5% of TVL |
| CircuitBreaker | [`0x9676E697…18e0`](https://etherscan.io/address/0x9676E697399581AB288844cDE5F73d0887eC18e0) | Trips, ownership changes, removal from wrappers |
| ftUSD | [`0xF7D85EC4…9C9C`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | `MinterConfigured`, `setMaxSupply`, `Blacklisted`, `Upgraded`; `totalSupply` vs cap |
| ftUSD Core | [`0x56c5892B…8ca9`](https://etherscan.io/address/0x56c5892B0cF41B792217CCDD208f0FA85B178ca9) | **New module enablement**, `globalDebtCeiling` changes, `moduleDebt` vs `totalSupply` drift |
| MintAndRedeem | [`0xAa48EcBC…D23C`](https://etherscan.io/address/0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C) | `addCollateral`, `setCollateralCapFtUSD`, fee changes, `sweepExcess`, `recoverERC20` |
| **Delta-Neutral strategy** | [`0xe0E44596…1A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59) | **Reflexivity ratio** — its FT Lend position as % of TVL; any move of ftUSD backing to a new venue |
| FT Lend yield wrappers ×7 | see Funds Management table | `setStrategy`/`confirmStrategy` (no delay!), `setCircuitBreaker`, `execute`, available liquidity |

### Governance monitoring — immediate alert, no timelock means zero warning

| Event | Contract | Why it is urgent |
|---|---|---|
| `ExecutionSuccess` | all three Safes | Every privileged action in the system flows through one of these. There is no delay window in which to react after the fact |
| `Upgraded` | PositionsManager, ConfigRegistry, ftUSD, ftUSD Core, MintAndRedeem, all 7 wrappers, fee collector, treasury | Arbitrary code replacement |
| `AddedOwner` / `RemovedOwner` / `ChangedThreshold` | all three Safes | Signer-set change on the root of trust |
| `MinterConfigured` / `MinterRemoved` / `MasterMinterChanged` | ftUSD | Unbacked-mint path |
| module enablement | ftUSD Core | A new module with a ceiling is an unbacked-mint path |
| `EngineSet` / `MetaModuleSet` / `LiquidationModuleSet` | PositionsManager | Changes who can move user balances or set liquidation economics. **None has fired since the deploy block — any occurrence is novel** |

### Oracle monitoring

- Alert on **any** `setLastGoodPrice` on the router — this is the arbitrary-price write and there is no legitimate routine use of it.
- Alert on `setPriceFeed`, `setStaleFallback`, `setPriceDeviation`, `setOwner`, `setGuardian` on the router, and `disablePrice` from the guardian.
- Alert on `PausedSet`, `AnswerBoundsSet`, `MaxStalenessSet` on the three protocol-owned wrapper proxies — a pause denies pricing for that asset entirely.
- Poll `priceUSD(asset)` against the corresponding Chainlink feed; alert on >0.5% divergence (detects a router override even without catching the event).
- Watch the ftUSD feed specially: it is derived from the USDC price and mint history rather than from ftUSD's collateral, and carries a **0 bps** deviation tolerance — it will not register a genuine ftUSD discount or a backing impairment. **Compare `priceUSD(ftUSD)` against the Curve pool's spot price** ([`0xafec61e7…2630`](https://etherscan.io/address/0xafec61e7a604f8f81f7cab64ec75bfa07c542630), `get_dy(0,1,1e6)`) — this is the only external reference for ftUSD and the only way to detect the protocol feed drifting from reality. Alert on >0.5% divergence, and on the Curve pool becoming materially imbalanced (>70/30) or losing >50% of its TVL.

### Reflexive-supplier monitoring

- Poll the Delta-Neutral strategy's [`0xe0E44596…1A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59) `getBalance` on the PositionsManager for USDC and USDT. Alert if its share of total TVL crosses **40%** upward or **10%** downward.
- Alert on any change to the strategy's operator set (`OperatorSet`) — it currently includes a plain EOA.
- Track its WETH debt and account health factor: it is 99.6% of all WETH borrows, so its liquidation would be this market's first at size.
- Deeper ftUSD-side monitoring (backing reconciliation, mint modules, redemption capacity) is specified in the ftUSD report.

### Liquidity and exit-capacity monitoring

- Poll each funded wrapper's `deployed()` and `capital()`. They are currently equal — alert if Spark or Aave utilization exceeds 95% while that holds, which is the precise condition under which lender exits begin to fail.
- Poll `astate(asset).cash` per asset as the true instantaneous exit capacity.
- Alert on `setWithdrawPaused`, `setDepositPaused`, `setBorrowPaused`, any CircuitBreaker trip, `setCircuitBreaker` (especially to `address(0)`), and any flip of `marginRestrictWithdrawToSettlement` or `marginWithdrawRequiresNoDebt` to `true`.
- Alert on `setStrategy` / `confirmStrategy` on any wrapper — `strategyDelayConfig` is `0`, so these can land in the same block with no warning.

### Position and solvency monitoring

- Track the four dominant addresses via `getBalance(user, asset)` and `debtShares(user, asset)`; alert on any withdrawal >25% of a position.
- The dominant EOA [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) warrants its own alert set: it is 38% of supply and 73% of debt simultaneously, so its health factor is a systemic variable. Poll its account HF and alert below 1.35 (ahead of the 1.25 liquidation threshold).
- Alert on any `liquidateFlash` execution — none has occurred at size; the first one is a live test of an untested engine.
- Alert if any `astate.borrows` exceeds `astate.totalSupplied` for an asset, or if reserves move (they are currently ~$325 in total, so any movement is significant relative to the balance).

### Key thresholds / values

- **Oracle integrity:** alert on **any** `setLastGoodPrice`, and on any router `priceUSD` deviating >0.5% from the corresponding Chainlink feed.
- **Governance:** alert on **any** execution by any of the three Safes and **any** proxy `Upgraded` event — no timelock means zero warning.
- **Reflexivity:** alert if the Delta-Neutral strategy's share of FT Lend TVL exceeds 40%, or if ftUSD's supply cap is raised while its backing remains deployed into FT Lend.
- **Caps:** alert above ~90% of `supplyCap` — **ftUSD is already at 95%** — and on every `setCaps`.
- **Concentration:** track [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) (38% of supply, 73% of debt), [`0x666130…701c`](https://etherscan.io/address/0x66613091b75e54954f77746e160c98391f99701c), [`0x0d5dc6…4e83`](https://etherscan.io/address/0x0d5dc686d0a2abbfdafdfb4d0533e886517d4e83) via `getBalance`; alert on any withdrawal >25% of a position.
- **Exit capacity:** alert if wrapper `deployed()` remains equal to `capital()` while Spark or Aave utilization exceeds 95% — that is the condition under which exits fail.
- **Solvency:** monitor liquidations and `astate.reserves` (currently negligible); alert on any bad-debt socialization event.

## Appendix A: Contract Architecture

```
GOVERNANCE (no timelock, identical signer set across all three Safes)
  Admin Safe 3/5  0x1118…70Cb ── owns/upgrades ─────────────┐
  Guardian Safe 3/4  0x22246a…017C (subset signers)         │ disablePrice / pause
  WBTC StrategyMgr Safe 3/5  0x5557…48f6 (same 5 signers)   │
        │                                                    ▼
        ▼                                            LEND ENGINE (ftDNMM)
TOKEN / STABLE LAYER                                   PositionsManager (UUPS)
  ftUSD (FiatToken, UUPS)                               ├─ admin via PMWrapper (admin=Safe)
     ▲ mint (module-gated, ceiling 100M)                ├─ config → ConfigRegistry
  ftUSD Core (sole minter)                              │    • per-asset IRM, mmBps, wrapper, flags
     ▲                                                  │    • HF safe 1.50 / target 1.25 / minEq $250
  MintAndRedeem  ── collateral in ──┐                   ├─ oracle → OracleRouterChainlink
  FT token (OFT, unpriced in Lend)  │                   │    ├─ USDC/USDT/ETH → canonical Chainlink
                                    │                   │    ├─ WBTC → CL BTC/USD + Aave peg adapter
                                    │                   │    ├─ wstETH → CL ETH/USD + Aave cap adapter
                                    │                   │    └─ ftUSD → MintAndRedeem redeem factor ⟲
                                    │                   ├─ IRMs: Stable / Major / LongTail
                                    │                   ├─ engines: RfqEngine* / LeverageRfqEngine
                                    │                   │           MetaActions / MetaSessionActions
                                    │                   │           (*sole liquidation module)
                                    │                   ├─ session: RelayerAuth / SessionManager
                                    │                   └─ CircuitBreaker (owned by Admin Safe)
                                    │                          ▲
   ftUSD-USDC wrapper 0x6aaf…837D ──┤                          │
   ftUSD-USDT wrapper 0x28CC…47D6 ──┘                          │
        └─► MultiCollateralDeltaNeutralStakingStrategy         │
              0xe0E4…1A59  ── deposits 2.77M USDC + 1.42M USDT ┘
              (hedge leg live since ~Aug 3: 76.5 wstETH collateral, 95.0 WETH borrowed)
              ⟲ REFLEXIVITY: ftUSD backing is 35.1% of FT Lend TVL

LEND SUPPLY ROUTING (third-party lenders)          UNDERLYING YIELD
  USDC / USDT / WETH wrappers ──────────────────►  Spark   (deployed == capital, no buffer)
  WBTC wrapper ─────────────────────────────────►  Aave    (deployed == capital, no buffer)
  ftUSD / wstETH / FT wrappers ─────────────────►  no strategy configured
```

## Appendix B: Source-verification check

All contracts in the trust surface were checked via Etherscan `getsourcecode` on August 3, 2026. **Every one is source-verified**, so the "Unverified contract source" critical gate does not trigger.

| Contract | Address | Implementation (if proxy) |
|---|---|---|
| PositionsManager | [`0xbe4050a7…0055`](https://etherscan.io/address/0xbe4050a73a7Fb384c65E885a15C33461A4B20055) | [`0xaa3d5fc8…a23b`](https://etherscan.io/address/0xaa3d5fc84b43219391539714be5f0681aefca23b) |
| ConfigRegistry | [`0xA8777c3D…a33E`](https://etherscan.io/address/0xA8777c3D446fa7F0b0FC97a80C1Ea1d37F1ca33E) | [`0xd25f964e…47e5`](https://etherscan.io/address/0xd25f964ead7bfbf07858b5bfede58f11a5a947e5) |
| ftUSD (`FlyingTulipUSD`) | [`0xF7D85EC4…9C9C`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | [`0xf47bb65f…1885`](https://etherscan.io/address/0xf47bb65fb0886be183db541afce555345e3e1885) |
| ftUSD Core | [`0x56c5892B…8ca9`](https://etherscan.io/address/0x56c5892B0cF41B792217CCDD208f0FA85B178ca9) | [`0x986841b7…5440`](https://etherscan.io/address/0x986841b77f3aa934d315d48121842e3c622e5440) |
| MintAndRedeem | [`0xAa48EcBC…D23C`](https://etherscan.io/address/0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C) | [`0x8852b132…c3c6`](https://etherscan.io/address/0x8852b132b72613a16f1e3960978a3d45c0a7c3c6) |
| MultiCollateralDeltaNeutralStakingStrategy | [`0xe0E44596…1A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59) | — |
| RfqEngine | [`0xEB00B335…Dc32`](https://etherscan.io/address/0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32) | — |
| LeverageRfqEngine | [`0x8263a075…40e2`](https://etherscan.io/address/0x8263a07504d93cB95e0a74f3627bb15faaf140e2) | — |
| MetaActions | [`0x3633eb60…29f2`](https://etherscan.io/address/0x3633eb60d08756674472e2d34d6ffb5f4c1c29f2) | — |
| MetaSessionActions | [`0x4f83ac5c…3497`](https://etherscan.io/address/0x4f83ac5c8a79986d0916a8849730d9cef63a3497) | — |
| RelayerAuth | [`0x823a97a2…53F4`](https://etherscan.io/address/0x823a97a2c32985e0f5457fc8103F36698D1F53F4) | — |
| SessionManager | [`0xF9f3ddF2…60f8`](https://etherscan.io/address/0xF9f3ddF2E96Cabef94e2634c326DC6dde99360f8) | — |
| CircuitBreaker | [`0x9676E697…18e0`](https://etherscan.io/address/0x9676E697399581AB288844cDE5F73d0887eC18e0) | — |
| YieldClaimer | [`0x88432bB6…1397`](https://etherscan.io/address/0x88432bB6EA62e774cB6d87995CC5277568d01397) | — |
| Fee collector | [`0x5cd6Abe6…958a`](https://etherscan.io/address/0x5cd6Abe67f8af1C0c699dF36d90a6469Eaf1958a) | [`0x63176fda…beb5`](https://etherscan.io/address/0x63176fdaee7af7fd60acd896e3b6ce894901beb5) |
| Treasury | [`0x9B2F12De…cDe5`](https://etherscan.io/address/0x9B2F12De620d4E2993068e5cab6D6c7451f6cDe5) | [`0xf32adbe8…7d21`](https://etherscan.io/address/0xf32adbe84a4560084516f807b73d7cd7f0677d21) |
| Oracle wrapper — WBTC | [`0x183dB475…DA55`](https://etherscan.io/address/0x183dB475d8184aA7a018ed2164e11A887afBDA55) | — (immutable base feed + adapter) |
| Oracle wrapper — wstETH | [`0x000bb128…f35a`](https://etherscan.io/address/0x000bb128a8aBCFa05B871C97CC9C5f88e7Dcf35a) | — (immutable base feed + adapter) |
| Oracle wrapper — ftUSD | [`0xA69f7a38…DFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8) | — (immutable base feed + mintRedeem) |
| Yield wrappers ×7 | see Funds Management table | [`0xfaed20b3…1157`](https://etherscan.io/address/0xfaed20b307a6789481ee383adc10b9b0090b1157) (`ftYieldWrapper`) |

---

## Risk Summary

### Key Strengths

- **Accounting is honest and independently verifiable.** Every reserve figure reconciles exactly: supplier balances sum to `astate.totalSupplied` ($12,127,035), debt shares sum to `astate.borrows` ($780,125), and the four-hop ftUSD backing chain reconciles to the wei at a 101.03% collateral ratio. This is better than most protocols at this size.
- **Genuine onchain over-collateralization with blue-chip collateral** (WETH, WBTC, wstETH, USDC, USDT) and enforced health factors.
- **Oracle construction is more careful than it first appears** — canonical Chainlink for USDC/USDT/ETH, plus Aave's audited peg and cap adapters for WBTC and wstETH, all wired **immutably** so the owner cannot repoint them.
- **No privilege drift since launch.** All four engines, both meta-modules and the sole liquidation module were set in the deployment block and have never changed.
- **ftUSD has a genuine external market**, but it is now thin: the Curve pool fell from ~$1.87M to ~$249K after the initial review. It remains a market-based price signal and exit for the ftUSD leg; ftUSD is separately accepted as Morpho collateral.
- **Conservative caps and a small footprint** limit blast radius today.

### Key Risks

- **34.5% of TVL is the protocol lending to itself.** ftUSD's backing is deployed into FT Lend, so ftUSD and the lending market cannot fail independently, and ftUSD's own price feed cannot register an impairment of that collateral at all.
- **Single 3/5 multisig controls everything with no timelock** — instant upgrade of any contract, arbitrary oracle price override, pause of user funds, and a privileged path to authorize unbacked ftUSD issuance, plus blacklist and seizure. The current ftUSD mint module is collateralized and no evidence that the privileged issuance path has been used was found. Two further Safes share the identical signer set, so apparent separation of duties is cosmetic.
- **Extreme lender and borrower concentration:** 25 suppliers total; three third-party addresses are 96.1% of third-party TVL; one EOA is 38% of all supply and 73% of all debt.
- **Audit quality is good but non-public** — the private package was reviewed for this assessment, while firm/date/scope/finding details remain unavailable to public depositors. A live $1M Sherlock bounty covers FT Lend and the other deployed production contracts through the dynamic contract list incorporated by its Additional Scope.
- **Very new** (engine ~3.2 months) with **no stress history**, an untested novel liquidation engine, and negligible reserves. The current book's blue-chip collateral and 1.25 target health factor reduce expected bad-debt risk, but any residual bad debt would be borne by suppliers.
- **Reflexive collateral.** A loss event in FT Lend impairs ftUSD's backing, which impairs ftUSD, which is 11.8% of FT Lend's collateral; the backing-blind feed would not register that impairment.

### Critical Risks

- **Unilateral, instant admin control.** A 3/5 multisig — effectively one party, given the identical signer set across all three Safes — can upgrade the engine, rewrite the oracle price via `setLastGoodPrice`, redirect lender capital through a zero-delay `setStrategy`, or authorize a new unbacked ftUSD issuance path, with no delay and no independent check. Normal ftUSD minting remains collateralized and no evidence that this path has been used was found. Deployed invariants must be treated as mutable, not durable.

---

## Risk Score Assessment

**Scoring guidelines applied:** conservative rounding (higher/riskier when uncertain), decimals where a subcategory falls between bands, onchain evidence prioritised over documentation.

### Critical Risk Gates

- [ ] **Unverified contract source** — **PASS.** All 20 contracts in the trust surface, including every proxy implementation, are source-verified on Etherscan (Appendix B).
- [ ] **No audit** — **PASS, with material reservation.** A structured audit registry demonstrably exists in the investor portal, so "no audit" would be a false statement. However it is access-code gated and **zero audits are independently confirmable** for the assessed contracts. The two publicly confirmable reviews (token-sale `Escrow`; ftPUT via Sherlock) cover neither the lending engine nor ftUSD. Scored down hard in Category 1 rather than gated.
- [ ] **Unverifiable reserves** — **PASS.** Reserves are fully onchain and were reconciled exactly, twice, including the complete ftUSD backing chain.
- [ ] **Total centralization (single EOA)** — **PASS, marginally.** Control is a 3/5 multisig, not a lone EOA. But all three Safes share one signer set and there is no timelock, so the practical distance from the gate is small. Reflected as a 5.0 in Category 2A.

**No critical gate is triggered.** The final score uses weighted category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 2.5**
- The privately reviewed audit package provides good in-scope coverage from reputable firms including ChainSecurity, MixBytes, and Cantina; the audit quality itself maps to rubric row 2.
- **+0.5** because the reports and finding-level detail remain behind an access-code wall rather than being publicly inspectable.
- The live Sherlock bounty has a maximum reward of 1,000,000 USDC and covers Flying Tulip's deployed production contracts through the dynamic contract list incorporated by the bounty's Additional Scope, including `PositionsManager`, `ConfigRegistry`, the IRMs, and the RFQ engines.
- The only two publicly confirmable reviews cover the token-sale `Escrow` and the separate ftPUT product — **neither touches `PositionsManager`, `ConfigRegistry`, the IRMs, the RFQ engines, ftUSD, ftUSD Core, or `MintAndRedeem`.**
- Contract surface is large and novel: dynamic snapshot LTV, RFQ/relayer/session layer, flash liquidation, epoch settlement, cross-product shared collateral, and a discretionary backing strategy. The rubric notes simple surfaces score better than complex ones.

**Subcategory B: Historical Track Record — 4.0**
- Time in production: the assessed `PositionsManager` was deployed **April 27, 2026** with first deposit **April 29, 2026** — **3.2 months**. The wider protocol is 5.4 months. Rubric band "3–6 months" = 4.
- Scale: headline TVL $12.13M would sit in the ">$10M" band (3), but **$4.18M of it is the protocol's own recycled ftUSD collateral**. Genuine third-party TVL is **$8.11M**, which is the "<$10M" band (4).
- No incidents, exploits, or depegs — but also no stress event of any kind, no drawdown, and no liquidation cascade. The clean record carries little information at this age and size.
- Both columns land on 4. **4.0.**

**Score: 3.25/5** — (2.5 + 4.0) / 2 = 3.25. The audit work and bounty coverage are good, while the non-public reports and the market's limited age and scale keep the category above the low-risk bands.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0**
- 3-of-5 Gnosis Safe, **no timelock anywhere in the system**. Rubric row 4 is "Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints"; row 5 is "No timelock | Unlimited admin powers". Two of three columns are row 5.
- Every core contract is a **UUPS proxy upgradeable by that Safe** — audited (or unaudited) code can be replaced with arbitrary code in one transaction. This alone makes every other invariant in this report non-durable.
- The Safe is ftUSD `owner` + `masterMinter` + `pauser` + `blacklister`: it can register a new mint module with an arbitrary ceiling (**unbacked mint**), and `blacklist` + `wipeBlacklistedAddress` (**freeze and burn user balances**).
- It can write **arbitrary oracle prices** via `setLastGoodPrice`, bypassing the immutable adapter safeguards.
- **Apparent separation of duties is cosmetic:** the Guardian Safe (3/4) is a strict subset of the admin signers, and the WBTC strategy-manager Safe (3/5) has the *identical five signers*. Three Safes, one party.
- `strategyDelayConfig = 0` on all seven wrappers, so the strategy-change timelock that exists in code is disabled in configuration.
- Signer identities undisclosed. **5.0** — this is the top of the band and is the single largest contributor to the final score.

**Subcategory B: Programmability — 3.0**
- Positives: supply/borrow indices, health factors and liquidation eligibility are computed onchain; IRM curves are `pure` functions; the supply index accrues without operator action.
- Offsetting: admin-settable prices; instant proxy upgrades; four whitelisted engines holding debit allowances over user balances; a module-gated, mostly permissionless, time-sliced RFQ liquidation path (`rfqFill`/`rfqFillFlash`) that still depends on offchain callers sourcing repayment; epoch settlement performed by a privileged collector; and a **discretionary strategy contract that decides where ftUSD's backing is deployed** with no onchain rule constraining it.

**Subcategory C: External Dependencies — 2.5**
- **Spark, Aave, and Chainlink are not high-risk counterparties.** They are mature, heavily audited infrastructure — among the best external deps a money market can pick. Individual counterparty risk is low (~1.5–2.0 band).
- What elevates this subcategory is **exposure design**, not venue quality: wrappers keep `deployed() == capital()`, so lender exits inherit Spark/Aave cash and pause state with **no idle buffer**. That is concentrated exit-path risk on otherwise sound venues.
- Chainlink (plus immutable Aave peg/cap adapters for WBTC/wstETH) is sound oracle construction; single-feed residual is ordinary. Arbitrary-price risk sits on the admin router override and is scored under Governance.
- **The unusual dependency is reflexive FT Lend via ftUSD's backing** — correlated failure of the stablecoin and this market — not Spark/Aave/Chainlink.
- Spot AMM/CLOB is **not wired** into the deployed contracts (no score credit or debit).

**Score: 3.50/5** — (5.0 + 3.0 + 2.5) / 3 = 3.50. Governance remains the ceiling; external deps no longer treat blue-chip venues as if they were risky protocols.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 3.5**
- The direct lending book is strong: 100% onchain, over-collateralized, blue-chip collateral, health factors enforced in-contract (`marginHfSafeBps` 1.50 / `marginHfTargetBps` 1.25 / $250 min equity).
- Dragging it down: **ftUSD (11.4% of TVL) is collateral whose own backing is a claim on this same market**, at a nominal 101.03% CR with no independent buffer.
- **Maintenance margins on stables are 1.5%, and there is nothing beneath them.** The dynamic-LTV haircut the docs describe is **not implemented in the deployed contracts** — no depth or volatility input exists in `ConfigRegistry` or the `PositionsManager`. With `mmBps` = 150 and a 1.25 target HF, the contract permits roughly **50× leverage** on a stable position. This is an admin-set constant, not a risk engine, and it is the only thing standing between a borrower and the collateral.
- **Limited loss backstop.** Protocol reserves are 7.72 USDC / 13.16 USDT / 303.01 ftUSD / ~0 WETH / 0 WBTC — negligible against $12.13M. Blue-chip collateral and the 1.25 target health factor reduce expected loss probability, but any residual bad debt would be socialized to suppliers.
- Liquidation engine is novel, module-gated via permissionless `rfqFill(Flash)`, and has never run at scale. **The `PositionsManager` defines no liquidation bonus and no close factor** — the seize/repay split is set by the swappable `RfqEngine`, and the insolvency exception explicitly permits leaving bad debt.
- **Supplier yield is partly discretionary FT emissions** paid via admin-only `settleEpoch`. WBTC and ftUSD suppliers (51.3% of TVL combined) have received **zero** emissions to date.
- Admin can override the price that determines whether a position is solvent at all.

**Subcategory B: Provability — 2.5**
- Strong: reserves reconcile exactly and independently (supplier balances → `totalSupplied`; debt shares → `borrows`; ftUSD collateral chain → wrapper `capital()` → strategy position). Anyone can reproduce this with `cast`. The supply index is computed onchain.
- Strong: oracle wrappers have **immutable** base feeds and adapters, so the pricing *construction* is fixed and auditable.
- Weak: `setLastGoodPrice` lets the admin write an arbitrary price, which defeats the above at will.
- Weak: **ftUSD's price does not read ftUSD's backing** — `MintAndRedeem`'s redeem factors are functions of the USDC price and cumulative mint history — and carries a 0 bps deviation tolerance, so neither a market discount nor a backing impairment can surface in liquidation pricing.
- Weak: verifying ftUSD's backing takes four hops through undocumented contracts; nothing in the public docs describes it.
- Weak: no public source repository and no public audit reports, so review is confined to reading verified bytecode.

**Score: 3.0/5** — (3.5 + 2.5) / 2 = 3.0. The arithmetic is honest and checkable, which is a real strength; the risks are structural (reflexivity, no backstop) and discretionary (price override), not accounting opacity. High governance power keeps the score higher

#### Category 4: Liquidity Risk (Weight: 15%)

Framed for an **FT Lend supplier**. Exit is protocol `withdraw` against available cash — there is no secondary market for the supply receipt, which is normal for a money market and is not scored as a missing DEX.

- **Binding constraint is utilization.** A lender can exit only the un-borrowed share of each asset. At today's **6.4% utilization**, cash is ample (USDC ~92% available, WBTC 100%, WETH ~100%, USDT ~84%) and withdrawal is same-block. Risk rises as utilization approaches the kink / 100% — borrowed liquidity is unavailable until repaid or liquidated.
- **Underlying venue is a second utilization gate.** Wrappers keep `deployed() == capital()` into Spark (USDC/USDT/WETH) and Aave (WBTC), so even low FT Lend utilization still requires those venues to have withdrawable cash / not be paused. That is dependency risk expressed as liquidity, not a separate market-depth story.
- **Concentration can force utilization.** Three third-party addresses hold 96.1% of third-party TVL; a large simultaneous withdrawal (or the Delta-Neutral strategy unwinding its 35.1%) is the realistic path to an unavailable-cash state on a thin book ($4.79M WBTC / $3.14M USDC largest pools).
- **No stress history** — exit under high utilization has not been observed.

**Score: 2.0/5** — The money-market withdrawal path is permissionless and same-block at current low utilization. It is not scored lower because Spark/Aave sit under every funded wrapper with no idle buffer, and supplier concentration makes a utilization spike plausible. Admin-triggered withdrawal pauses are captured under centralization rather than treated as an active liquidity throttle. Curve depth is out of scope for this lender score.

#### Category 5: Operational Risk (Weight: 5%)

- **Team:** founder is public and well known (Andre Cronje — Yearn, Keep3r, Sonic/Fantom), which is a genuine positive. His track record is mixed, with a documented history of abandoned or incomplete launches. The remaining ~15 team members are anonymous.
- **Legal:** **no disclosed legal entity or jurisdiction** — docs reference a "Foundation" with no domicile.
- **Documentation:** conceptually reasonable, but omits oracle design, risk parameters and the multisig setup. The docs do not clearly disclose that ftUSD's backing is lent into FT Lend. The strategy's hedge was inactive at the June snapshot and active by August 6. The docs' own transparency principle promises published audit reports that do not exist.
- **Governance transparency:** no DAO, no forum, no Snapshot, signers undisclosed.
- **Incident response:** docs reference "formal incident runbooks"; none is public. Emergency capability exists onchain (pause, circuit breaker, `disablePrice`) and has never been exercised.

**Score: 3.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.25 | 20% | 0.650 |
| Centralization & Control | 3.50 | 30% | 1.050 |
| Funds Management | 3.00 | 30% | 0.900 |
| Liquidity Risk | 2.00 | 15% | 0.300 |
| Operational Risk | 3.50 | 5% | 0.175 |
| **Final Score** | | | **3.075** |

**Final Score: 3.1** (3.075 weighted)

**Optional modifiers:** none apply. Protocol is <1 year old (no −0.5 for >2 years incident-free) and TVL is far below $500M (no −0.5 for scale).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK — approved with enhanced monitoring.**

The composite is 3.1, in the Medium band. The determining factors are:

- **Governance is the dominant term** (Category 2A at 5.0, carrying 10% of the total weight on its own). A 3/5 Safe with no timelock holds upgrade authority over every contract, arbitrary oracle-price authority, and a privileged path to authorize an ftUSD issuance module that need not enforce collateral. The current production mint path is collateralized and no evidence of privileged unbacked issuance was found, but no invariant survives an adverse governance action. Three Safes with one signer set provide no meaningful separation.
- **Reflexive collateral.** 35.1% of TVL is the protocol's own ftUSD backing; ftUSD is 11.4% of this market's collateral; and ftUSD's price feed is blind to that backing, so an impairment would not surface in liquidation pricing. FT Lend and ftUSD cannot fail independently.
- **Concentration.** Three third-party addresses are 96.1% of third-party TVL; one EOA is 38% of supply and 73% of debt.
- **Lender exit is utilization-bound**, with a second gate at Spark/Aave because wrappers hold zero idle buffer. Liquidity score is not driven by Curve — that venue is for ftUSD holders, not FT Lend suppliers.
- **Audit evidence is not publicly inspectable** for any in-scope contract. A live $1M Sherlock bounty covers deployed production contracts, but there is no Safe Harbor enrolment.
- **Negligible loss reserves** and a novel, untested liquidation engine; blue-chip collateral and the 1.25 target health factor mitigate expected bad-debt risk but do not absorb residual losses.

Offsetting these, and the reason this is not High Risk: the accounting is honest and fully reconcilable onchain, the collateral is genuinely blue-chip and over-collateralized, the oracle construction uses canonical Chainlink plus audited Aave adapters wired immutably, privileges have not drifted since deployment, every contract is source-verified, and current utilization leaves ample cash for same-block lender exits.

**Recommendation for Yearn:** if an allocation proceeds, size it against **third-party TVL ($7.95M), not headline TVL**, cap exposure well below the position of the dominant EOA, avoid ftUSD as a supplied asset (it is the reflexive leg), and treat any admin Safe execution or proxy upgrade as an immediate exit trigger given the absence of a timelock.

---

## Reassessment Triggers

- **Audit status:** reassess if any in-scope audit report is published with firm, date and scope, if Sherlock removes or narrows the dynamic production-contract coverage incorporated by the bounty's Additional Scope, or if the protocol enrols in SEAL Safe Harbor.
- **Governance hardening:** reassess if a timelock is added, if the admin Safe threshold or signer independence materially improves, or if the three Safes are given genuinely distinct signer sets.
- **Reflexivity:** reassess if the Delta-Neutral strategy's share of FT Lend TVL exceeds 40% or falls below 10%, if ftUSD backing is redeployed to a venue outside FT Lend, or if the hedge target or position changes materially.
- **Dynamic LTV:** reassess if an AMM or order-book contract is ever registered via `EngineSet`, or if `ConfigRegistry` gains a depth/volatility input — that would introduce the risk engine the docs already describe and change the collateralization analysis.
- **Time-based:** reassess in **2 months**. Shortened from 3: the hedge leg activating mid-assessment showed this market's state can move materially in days on one actor's decision.
- **TVL/usage-based:** using the August 3 baseline of $7.95M *third-party* lending TVL, reassess if it grows above ~$24M, falls below ~$2.6M, or if any of the three dominant third-party suppliers exits.
- **ftUSD market-based:** the prior >50% Curve-liquidity trigger has occurred. For the ftUSD companion report, reassess on another 25% decline from the September 4 baseline, material imbalance (>70/30), or spot divergence >0.5% from `priceUSD(ftUSD)`. This remains context only for most FT Lend suppliers.
- **Cap-based:** reassess if `supplyCap` is materially raised on any asset — ftUSD is already 95% subscribed against a 1.5M cap.
- **Concentration:** reassess if the dominant EOA's share of supply or debt moves by more than 15 percentage points in either direction.
- **Incident-based:** reassess after any exploit, bad-debt event, oracle override (`setLastGoodPrice`), oracle-wrapper pause, proxy upgrade, ftUSD depeg or unbacked mint, new ftUSD Core module enablement, or any Spark/Aave incident affecting a configured strategy.

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [September 4, 2026](https://github.com/yearn/risk-score/pull/237) | 3.1 | Bounty scope corrected; team-response wording and ftUSD Curve context refreshed; score unchanged |
| [August 7, 2026](https://github.com/yearn/risk-score/pull/237) | 3.1 | Initial assessment |
