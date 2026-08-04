# Protocol Risk Assessment: Flying Tulip — FT Lend (ftDNMM)

- **Assessment Date:** June 7, 2026 (Updated: July 27, 2026; Updated: August 3, 2026)
- **Token:** FT Lend market (supply / borrow); system tokens ftUSD and FT
- **Chain:** Ethereum Mainnet
- **Core Contract:** PositionsManager [`0xbe4050a73a7Fb384c65E885a15C33461A4B20055`](https://etherscan.io/address/0xbe4050a73a7Fb384c65E885a15C33461A4B20055)
- **Final Score: 3.6/5.0**
- **Elevated Risk** — limited approval, strict limits. A 3-of-5 Safe with no timelock can upgrade every contract, override every price, and mint or seize ftUSD. **34.5% of the market's TVL is the protocol's own ftUSD backing collateral lent back into itself**, and only three genuinely third-party addresses hold 96% of the remainder. Audit coverage is asserted but sits behind an access-code wall and cannot be verified. See [Risk Score Assessment](#risk-score-assessment). (Also deployed on Sonic; this report covers Ethereum.)

> **Scope.** Yearn's interest (issue [yearn/risk-score#234](https://github.com/yearn/risk-score/issues/234)) is the risk of supplying ("just lend") and/or borrowing in the **FT Lend** market. This report covers the lending engine, the assets it touches, and — because they are structurally entangled with it (see [Reflexivity](#the-reflexivity-loop-ftusd-backing-is-lent-into-ft-lend)) — the ftUSD mint/redeem and collateral-custody contracts. The unrelated `tulip.garden` protocol on Solana is **not** Flying Tulip and is excluded. Original values were verified **June 7, 2026 at block `25264957`**; this revision re-verified everything on **August 3, 2026 at block `25675412`** via `cast` and Etherscan against an Ethereum mainnet RPC.

## Overview + Links

**Flying Tulip** is Andre Cronje's "on-chain financial system that standardizes pricing, credit, and risk across a suite of products" — a hybrid AMM-CLOB spot exchange, a lending market (FT Lend), perpetual futures, and a yield stablecoin (ftUSD). The products share collateral and pricing so "a single deposit can back a loan, serve as collateral for a limit order, and support a future position simultaneously."

**FT Lend** (the contract suite is labelled **ftDNMM** in the protocol's address registry) works as follows:

- **Markets.** Two models: (1) *permissionless* pair markets auto-created for any Spot pool, and (2) a curated *permissioned* cross-collateral pool. On Ethereum today the live set is the curated pool (7 enabled assets, 6 priced).
- **Supply side.** A lender calls `deposit(asset, amount)` on the `PositionsManager`. Un-borrowed liquidity is held by the asset's `ftYieldWrapper`, which deploys it to an external strategy. Suppliers earn borrower interest plus strategy yield through the supply index.
- **Borrow side.** Borrowers post collateral and borrow against it. **LTV is dynamic and snapshotted** at position open based on AMM depth and multi-timeframe volatility. Onchain, each asset carries a **maintenance-margin rate (`mmBps`)** in the `ConfigRegistry`, and account health is enforced against `marginHfTargetBps`/`marginHfSafeBps`.
- **Pricing.** An onchain `OracleRouterChainlink` — Chainlink-anchored, with Aave-style adapters for WBTC and wstETH, and a protocol-internal redemption oracle for ftUSD.
- **Liquidations.** Time-sliced / soft liquidations routed through resting CLOB orders and keepers (`liquidateFlash`, RFQ engines), designed to limit price impact on large positions.

**Links:**

- [Protocol Documentation](https://docs.flyingtulip.com/) · [FT Lend docs](https://docs.flyingtulip.com/product-suite/ft-lend/) · [Contract Addresses](https://docs.flyingtulip.com/contract-addresses/) · [Risks page](https://docs.flyingtulip.com/risks/)
- [App](https://flyingtulip.com/) · [Lend dashboard](https://flyingtulip.com/lend/dashboard/) · [Blog](https://blog.flyingtulip.com/)
- [GitHub org `flyingtulipdotcom`](https://github.com/flyingtulipdotcom) (only `ft`, `escrow`, `supporter-whitelist` are public; the lending/ftUSD repos are private)
- [DeFiLlama — Flying Tulip](https://defillama.com/protocol/flying-tulip) (slug `flying-tulip`)
- [Sherlock contest #1223 (ftPUT)](https://audits.sherlock.xyz/contests/1223) · [CoinList sale](https://coinlist.co/flying-tulip)

## Audits and Due Diligence Disclosures

**Status: asserted but unverifiable.** The team states the in-scope FT Lend / ftDNMM contracts and ftUSD have been audited multiple times by reputable firms, and keeps the reports and finding-level detail private.

An investor-relations portal does host a structured **Audits** registry — its front-end code contains a component that renders an "Audits" heading over a list, with per-row states for entries that have **no attached report file**. The portal is behind a **unique-access-code wall**: every page renders only "Enter Your Unique Code Below" and fetches no audit data until authenticated. No firm name, date, scope, or finding count could be verified for this assessment.

| Item | Status |
|---|---|
| Public audit reports for `PositionsManager` / `ConfigRegistry` / IRMs / RFQ engines | **NOT FOUND** |
| Public audit reports for `FlyingTulipUSD` / ftUSD Core / `MintAndRedeem` | **NOT FOUND** |
| Firm names, dates, scopes (any in-scope contract) | **Unverified** — access-code gated |
| Formal verification (Certora / Halmos) | **NOT FOUND** |
| Public bug bounty (Immunefi / Cantina / Code4rena / Sherlock / HackerOne) | **NOT FOUND** |
| SEAL Safe Harbor enrolment | **Not enrolled** (absent from the `security-alliance/safe-harbor` registry) |
| Contract source verification on Etherscan | **PASS** — all 20 contracts checked are verified (see Appendix B) |

- The docs' [Risks page](https://docs.flyingtulip.com/risks/) states a policy of "external audits before enabling capital-bearing features" and lists "Transparency. Publish parameters, addresses, **audit reports**, and incident post-mortems" as a security principle. The audit reports are not published.
- Only two reviews are publicly confirmable, and **neither covers the assessed contracts**: the token-sale `Escrow` (PeckShield #2025-170, Oct 2025; Cantina Managed, Oct 2025) and the separate **ftPUT** product ([Sherlock contest #1223](https://audits.sherlock.xyz/contests/1223), Jan 2026).
- **Accepted risks** from the Sherlock ftPUT contest README — relevant because the same team and patterns build Lend: "protocol-level loss handling and backstops are out-of-scope," "malicious strategy manager cannot be removed," "caps updates can be front-run," and a circuit-breaker that does not cover all flows. Each of these is observable in the deployed Lend contracts (see [Centralization](#centralization--control-risks)).

**Contract complexity is high:** a novel dynamic-LTV money market with snapshot LTVs, an RFQ/relayer/session layer, flash-liquidations, epoch settlement, cross-product shared collateral, and a stablecoin whose backing is actively managed by a strategy contract. Complexity of this order is precisely where public, finding-level audit disclosure matters most.

> **Scoring note.** This does **not** trigger the "No audit" critical gate — a real audit registry demonstrably exists, so asserting "no audit" would be false. It does mean the Audits subcategory cannot be credited above the "one reputable audit" band, because zero audits are independently confirmable for the contracts a Yearn deposit would touch.

## Historical Track Record

- **Production history.** TGE / mainnet ~**Feb 23, 2026**; ftUSD [deployed Feb 21, 2026](https://etherscan.io/tx/0x52e7d46b7e166b8e30c5d38a09d93c44537bcb77b439e5b125d8b51d5670ea21). The assessed lending engine is newer: `ConfigRegistry` and `PositionsManager` were [deployed April 27, 2026](https://etherscan.io/tx/0x8838947473f9a3b6ba3f46bd89ecd5b28d7bd470e8c0b969cb38ceb5c4ebcdef) (block `24974967`) and the **first `Deposit` event is April 29, 2026** (block [`24986969`](https://etherscan.io/block/24986969)). Protocol ~5.4 months old; **FT Lend in its current deployment ~3.2 months.**
- **TVL (DeFiLlama, whole protocol):** **~$12.56M** on August 3, 2026 — Ethereum $12.14M, Sonic $0.42M ([API](https://api.llama.fi/protocol/flying-tulip)). Peak **~$12.58M on July 31, 2026**; tracked since ~May 12, 2026 (85 data points). The marketed "$126M+ TVL" figure is **raise capital parked in Aave**, not protocol usage.
- **FT Lend onchain TVL:** **$12.13M supplied / $0.78M borrowed** (6.43% utilization) — reconciles with DeFiLlama's $12.14M Ethereum figure.
- **Genuine third-party TVL is $7.95M, not $12.13M.** $4.18M (34.5%) is the protocol's own ftUSD backing collateral supplied back into the market by its own strategy contract — see [Reflexivity](#the-reflexivity-loop-ftusd-backing-is-lent-into-ft-lend).
- **Incidents / exploits / depegs:** **NONE FOUND** for Flying Tulip itself through August 2026. (An April 23, 2026 news item concerns Flying Tulip *adding* a withdrawal circuit breaker after *other* protocols' April exploits — preventive, not a breach.)
- **ftUSD:** supply 4,142,539; oracle price ~$0.9988; `maxSupply` cap 100M (raised from 5M); thinly traded.

### FT Lend market state — onchain, block `25675412` (August 3, 2026)

| Asset | IRM | Maint. margin | Borrowable | Collateral | Supplied | Borrowed | Util | Supply cap | Cap used |
|-------|-----|:---:|:---:|:---:|---|---|:---:|---|:---:|
| [USDC](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Stable | 1.50% | ✓ | ✓ | 3,140,190 ($3.14M) | 237,621 | 7.6% | 10M | 31% |
| [USDT](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) | Stable | 1.50% | ✓ | ✓ | 1,404,423 ($1.40M) | 223,477 | 15.9% | 10M | 14% |
| [WETH](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) | Major | 19.0% | ✓ | ✓ | 736.92 ($1.37M) | 0.35 | 0.05% | 1,000 | 74% |
| [WBTC](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | Major | 22.0% | ✓ | ✓ | 75.18 ($4.79M) | 0 | 0% | 100 | 75% |
| [wstETH](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | Major | 21.0% | — | ✓ | 0 | 0 | — | 300 | 0% |
| [ftUSD](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | Stable | 1.50% | ✓ | ✓ | 1,428,403 ($1.43M) | 319,073 | 22.3% | **1.5M** | **95%** |
| [FT](https://etherscan.io/address/0x5DD1A7A369e8273371d2DBf9d83356057088082c) | LongTail | 0% | — | — | 763.25 (unpriced) | — | — | 0 | — |
| **Total** | | | | | **$12.13M** | **$0.78M** | **6.4%** | | |

USD values use the protocol's own oracle prices at block `25675412` (USDC $0.9998, USDT $0.9989, WETH $1,861.78, WBTC $63,659.67, wstETH $2,308.80, ftUSD $0.9988). FT has **no configured price feed** — `priceUSD(FT)` reverts — consistent with it being neither collateral nor borrowable.

**Cap headroom is a live constraint.** ftUSD is at **95% of its 1.5M supply cap**; WBTC and WETH at ~75%. Caps are raised by the admin Safe in one transaction via `PMWrapper.setCaps` with no delay, so current conservative sizing is a policy choice, not a durable limit on blast radius.

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

### The reflexivity loop: ftUSD backing is lent into FT Lend

This is the most consequential structural finding of this assessment and is not described in the protocol's public documentation.

Tracing ftUSD's collateral end-to-end (Pass 1.5 reconciliation):

```
User mints ftUSD with USDC/USDT
   └─► MintAndRedeem  0xAa48EcBC…D23C     (holds 0.0002 USDC, 0 USDT — custody is NOT here)
         └─► wrapper.deposit()  ──────────────────────────────────┐
               ftUSD-USDC wrapper 0x6aaf8456…837D  capital 2,767,516.43 USDC
               ftUSD-USDT wrapper 0x28CCa8eE…47D6  capital 1,417,609.56 USDT
                     └─► strategy: "Flying Tulip Delta Neutral"
                           MultiCollateralDeltaNeutralStakingStrategy
                           0xe0E44596…1A59
                                 └─► PositionsManager.deposit()
                                       2,766,289.53 USDC + 1,417,609.56 USDT
                                       = 34.5% of FT Lend TVL
```

Every step reconciles exactly:

| Check | Value |
|---|---|
| ftUSD `totalSupply()` | 4,142,539.28 |
| ftUSD Core `totalDebt()` (= minted 5,607,621.80 − burned 1,424,772.22) | 4,182,849.58 |
| `MintAndRedeem.accountedCollateralTvl()` | 4,185,125.99 |
| — of which USDC / USDT | 2,767,516.43 / 1,417,609.56 |
| ftUSD-USDC wrapper `capital()` | 2,767,516.43 ✓ |
| ftUSD-USDT wrapper `capital()` | 1,417,609.56 ✓ |
| Delta-Neutral strategy position in FT Lend (USDC / USDT) | 2,766,289.53 / 1,417,609.56 ✓ |
| Residual in Aave (USDC) | 1,226.89 ✓ |
| **Nominal collateral ratio** | **101.03%** |

**What this means:**

1. **ftUSD is not backed by idle stablecoins.** Its backing is a *lender position inside Flying Tulip's own money market*. If FT Lend takes bad debt, is paused, or is drained via the admin paths below, ftUSD's collateral is impaired at the same moment ftUSD holders would want to redeem.
2. **The loop closes.** ftUSD is itself collateral-enabled *and* borrowable in FT Lend (1,428,403 supplied / 319,073 borrowed). So FT Lend accepts as collateral a token whose own backing is a claim on FT Lend.
3. **The ftUSD price feed is part of the loop.** ftUSD is priced by `FtUsdMintRedeemOracleProxy` [`0xA69f7a38…DFf8`](https://etherscan.io/address/0xA69f7a38B6c91a4bc2477f097DC8a1F16DAADFf8), which derives price from `MintAndRedeem`'s redemption factor — i.e. from the accounted value of collateral that is itself deployed into FT Lend. It is a redemption-value oracle, not a market price, so a real ftUSD market discount would not appear in liquidation pricing.
4. **Reported TVL is inflated by the loop.** $12.13M of "supplied" includes $4.18M the protocol supplied to itself. Genuine third-party TVL is **$7.95M**.
5. **The "delta-neutral" strategy is not currently delta-neutral.** The contract is designed to hedge (it borrows WETH and integrates Lido/stETH — the source references `Lido`, `stETH` and `Uniswap`), but onchain it holds **0 stETH, 0 wstETH, 0 WETH and 0 ETH**, and its WETH debt is **0.3439 WETH (~$640)**. Its entire `valueOfCapital()` is the FT Lend supply position. Today ftUSD is a stablecoin backed by a lending position, and the marketed yield source is not running.

This is not necessarily a solvency problem at current size — the collateral genuinely exists and is over-collateralized 101% — but it is a **correlation** problem: ftUSD and FT Lend cannot fail independently, and a Yearn deposit into FT Lend is exposed to both legs at once.

### Accessibility & Token Mint Authority (ftUSD)

ftUSD is both borrowable and collateral-enabled in FT Lend, so its mint authority is directly part of the lender/borrower trust surface. **ftUSD is a Circle FiatToken-style stablecoin** ([`FlyingTulipUSD`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C), 6 decimals, UUPS upgradeable, implementation [`0xf47bb65f…1885`](https://etherscan.io/address/0xf47bb65fb0886be183db541afce555345e3e1885)).

**Mint mechanism:** single role-gated `minter()`, fronted by a **debt-ceiling module system**. `ftUSD Core` [`0x56c5892B…8ca9`](https://etherscan.io/address/0x56c5892B0cF41B792217CCDD208f0FA85B178ca9) is the sole registered minter; it mints only on behalf of *enabled modules*, each with its own ceiling.

**Mint requires backing:** Yes for the one enabled module — `MintAndRedeem` transfers collateral in and deposits it to the wrapper in the same transaction before calling `core.mint`.

**Per-address mint authority** (verified onchain August 3, 2026):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x56c5892B…8ca9`](https://etherscan.io/address/0x56c5892B0cF41B792217CCDD208f0FA85B178ca9) | ✓ | ✓ | sole `minter()`, allowance ≈ 2²⁵⁶−1 | **ftUSD Core** — mints only for enabled modules within their ceilings |
| [`0xAa48EcBC…D23C`](https://etherscan.io/address/0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C) | ✓ (via Core) | ✓ | enabled module, ceiling **100M**, `moduleDebt` 4,182,849.58 | **MintAndRedeem** — the only enabled module; collateralized mint/redeem |
| [`0x1118e1c0…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | **indirectly, unbacked** | ✓ | `owner` + `masterMinter` + `pauser` + `blacklister` | **3/5 Safe** — can `configureMinter` / `removeMinter` / `updateMasterMinter`, enable a new Core module with an arbitrary ceiling, `setMaxSupply`, `pause`, **`blacklist` / `wipeBlacklistedAddress` (freeze & burn user balances)**, and `upgradeToAndCall` |

- **Rate limits / caps:** ftUSD `maxSupply` 100M; ftUSD Core `globalDebtCeiling` 100M; `MintAndRedeem` per-collateral cap 100M each; mint/redeem fee 7 bps each way; mint price hard-capped at $1.00 (`mintPriceHardcapWad` = 1e18); `minTVLForMint` 5,000,000.
- **Backing check at mint time:** atomic. **But** the masterMinter (3/5 Safe) can register an arbitrary new module or replace the minter outright, which issues ftUSD with no backing. This is a direct unbacked-mint path gated only by a 3-of-5 multisig with no timelock.
- **Accounting drift — flagged, not explained.** `totalDebt` (4,182,849.58) exceeds `totalSupply` (4,142,539.28) by **40,310.30 ftUSD**. Only 6,565.59 of that is fee ftUSD held on `MintAndRedeem`. The residual ~33,745 ftUSD appears to have been burned through a path that did not decrement module debt. This is not a solvency issue (debt overstates supply, i.e. it is conservative) but it does mean the ceiling accounting drifts, permanently consuming mint capacity. **Cause unverified — worth a question to the team.**

### Collateralization

- **Backing.** Borrowing is over-collateralized and enforced onchain via per-asset maintenance margins (`ConfigRegistry.assetCfg`) and account health: `marginHfSafeBps = 15000` (1.50), `marginHfTargetBps = 12500` (1.25), `marginMinEquityUSDWad = 250e18` ($250 minimum position equity).
- **Collateral quality.** Blue-chip (WETH, WBTC, wstETH, USDC, USDT) plus ftUSD. The blue-chip leg is genuinely high quality; ftUSD (11.8% of TVL) carries the reflexivity above.
- **Maintenance margins are thin on stables.** `mmBps = 150` implies a 1.5% maintenance floor — ~66× theoretical leverage before the dynamic-LTV haircut. The protocol states effective LTV is reduced from this floor by AMM depth and volatility and snapshotted at position open, but that reduction is computed off the Spot AMM/CLOB and is **not independently verifiable onchain**. The floor is what the contract enforces.
- **Liquidations.** Onchain, keeper-driven, time-sliced and RFQ-routed. The sole registered liquidation module is `RfqEngine` [`0xEB00B335…Dc32`](https://etherscan.io/address/0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32) (set at deployment, never changed). Novel and untested at scale. Per the team's own accepted-risk list there is **no protocol-level loss backstop / insurance fund** for bad debt.
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

  Using Aave's audited peg and cap adapters for WBTC and wstETH is a sound choice and better than a raw feed. The residual concerns are: the owner can `setPaused(true)` on any wrapper (a price-denial, not a price-forgery, path); ftUSD's price is **circular** (derived from collateral deployed into the market that prices it) and carries a **0 bps deviation tolerance**; and WBTC's 88,200s (24.5h) staleness window is long for a 39.5%-of-TVL asset.
- **The real override is at the router.** `OracleRouterChainlink` [`0xe4372dB4…674A`](https://etherscan.io/address/0xe4372dB43D2814750a19b93950157AD81D93674A) exposes `setLastGoodPrice(asset, price)` to its owner — the 3/5 Safe — which writes an **arbitrary price directly**, bypassing every adapter safeguard above. `setPriceFeed`, `setStaleFallback`, `setPriceDeviation` and `setOwner` are likewise owner-only; `disablePrice` is guardian-only. Immutable adapters do not constrain this path.
- **Source availability.** All 20 assessed contracts are source-verified on Etherscan (Appendix B). **No public GitHub repo** for the lending or ftUSD code, and no public audit reports, so review is limited to reading verified bytecode.

## Liquidity Risk

- **Exit mechanism.** Suppliers withdraw against available wrapper liquidity: 2.903M USDC of 3.140M supplied (7.6% utilized), 1.181M USDT of 1.404M (15.9%), 736.58 of 736.92 WETH (0.05%), all 75.18 WBTC (0%), 1.110M of 1.428M ftUSD (22.3%). Exit is instant today; borrowed funds are unavailable until repaid or liquidated.
- **Depth.** Thin absolutely: largest pool is WBTC at $4.79M, then USDC at $3.14M. There is no secondary market for the supply receipts.
- **Concentration is the dominant liquidity risk.** Only **25 addresses** hold the entire $12.13M. Excluding the protocol's own Delta-Neutral strategy, **three genuinely third-party addresses hold 96.1% of the $7.95M third-party TVL**:

| Supplier | Type | USD | % of total TVL | % of third-party TVL | Holdings |
|---|---|---:|---:|---:|---|
| [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) | EOA | $4.62M | 38.1% | **58.1%** | 72.18 WBTC + 21.9K USDC |
| [`0xe0E445…1A59`](https://etherscan.io/address/0xe0E445967256EE60111e243e0F0F94DD1D351A59) | **protocol strategy** | $4.18M | 34.5% | — | 2.77M USDC + 1.42M USDT |
| [`0x666130…701c`](https://etherscan.io/address/0x66613091b75e54954f77746e160c98391f99701c) | Safe | $1.87M | 15.4% | 23.5% | 1.43M ftUSD + 237.4 WETH |
| [`0x0d5dc6…4e83`](https://etherscan.io/address/0x0d5dc686d0a2abbfdafdfb4d0533e886517d4e83) | Safe | $1.15M | 9.5% | 14.5% | 485.1 WETH + 245.2K USDC |
| 21 others | mixed | $0.31M | 2.5% | 3.9% | — |

- **Borrowing is one account.** 11 addresses carry debt; the *same* EOA [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) holds **72.7% of all outstanding debt** ($567K across USDC/USDT/ftUSD) while being the largest supplier. It is simultaneously the market's biggest lender, biggest borrower, and sole WBTC depositor of size. A single account's liquidation, exit, or default is the dominant tail risk.
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

With **no delay**, the 3/5 Safe can: upgrade any contract to arbitrary code, change which assets/caps/margins apply, write an arbitrary oracle price, pause user funds, redirect where lender capital is deployed, and (for ftUSD) mint unbacked supply, blacklist, and burn balances. There is **no timelock, no DAO, and no independent guardian.**

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

Lending accounting (supply/borrow indices, health factors) is onchain and the oracle is Chainlink-anchored — good. The offchain/operator surface is nonetheless substantial: an RFQ/relayer/session layer (`RelayerAuth` [`0x823a97a2…53F4`](https://etherscan.io/address/0x823a97a2c32985e0f5457fc8103F36698D1F53F4), `SessionManager` [`0xF9f3ddF2…60f8`](https://etherscan.io/address/0xF9f3ddF2E96Cabef94e2634c326DC6dde99360f8), `MetaActions`/`MetaSessionActions`), keeper-driven time-sliced liquidations, admin-settable oracle prices, epoch settlement by a privileged collector, and — uniquely here — a **discretionary strategy contract that decides where ftUSD's backing sits**.

### External Dependencies

- **Spark & Aave** — hold 100% of the idle USDC/USDT/WETH/WBTC supply. A depeg, freeze, insolvency, or withdrawal-liquidity failure directly blocks lender exits. **Critical.**
- **Chainlink** — liquidation/solvency pricing for all six priced assets. Single feed per asset.
- **Aave price adapters** — `CLSynchronicityPriceAdapterPegToBase` (WBTC) and `WstETHPriceCapAdapter` (wstETH) sit in the pricing path for 39.5% of TVL.
- **FT Lend itself (reflexive)** — via ftUSD's backing. Unusual and material; see [Reflexivity](#the-reflexivity-loop-ftusd-backing-is-lent-into-ft-lend).
- **The Spot AMM / CLOB** — supplies the depth/volatility signals for dynamic LTV and is the venue for liquidation routing. Not independently verified in this assessment (**TODO**).
- **Lido / stETH** — referenced by the Delta-Neutral strategy design but **not currently held** (0 balance).
- **Permit2** ([`0xEB450d21…c8EC`](https://etherscan.io/address/0xEB450d21ae68D3303Cf5775A54Cc84EE7c3fC8eC)).

## Operational Risk

- **Team:** Founder **Andre Cronje** (public; founded Yearn, Keep3r, co-founded Sonic/Fantom) — strong but mixed reputation (history of abandoned/incomplete launches). The rest of the team (~15) is **anonymous**. Key-person dependency.
- **Legal entity / jurisdiction:** **NOT FOUND** / undisclosed (docs reference a "Foundation" with no domicile). CoinList sale excluded the US, Canada and ~21 other jurisdictions.
- **Funding:** ~$200M seed (Sep 2025, $1B FDV), ~$25.5M Series A (Jan 2026), public sale; the official sale-update blog reports total raised ≈ **$184M** (below the "$200M seed" headline — a reconciliation gap). FT token (Aug 3, 2026): max supply 10B, mainnet `totalSupply()` **1,197,190,528**, circulating ~547M, price ~**$0.0994**, **market cap ~$54.5M**, FDV ~$119M ([CoinGecko](https://www.coingecko.com/en/coins/flying-tulip)). FT is an OFT, so mainnet supply is not the cross-chain total.
- **Documentation vs. reality gap.** Beyond the usual omissions (oracle design, risk parameters, multisig setup), two deployed behaviours are not disclosed publicly: that **ftUSD's backing is lent into FT Lend**, and that the **"delta-neutral" strategy currently runs no hedge**. The docs' own transparency principle commits to publishing audit reports, which has not happened.
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
              (0 stETH / 0 WETH held — hedge leg not running)
              ⟲ REFLEXIVITY: ftUSD backing is 34.5% of FT Lend TVL

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
- **All 20 contracts in the trust surface are source-verified on Etherscan.**
- **Conservative caps and a small footprint** limit blast radius today.

### Key Risks

- **34.5% of TVL is the protocol lending to itself.** ftUSD's backing is deployed into FT Lend, so ftUSD and the lending market cannot fail independently, headline TVL overstates third-party capital by $4.18M, and ftUSD's own price feed is derived from collateral sitting inside the market that feed prices.
- **Single 3/5 multisig controls everything with no timelock** — instant upgrade of any contract, arbitrary oracle price override, pause of user funds, unbacked ftUSD mint, blacklist and seizure. Two further Safes share the identical signer set, so apparent separation of duties is cosmetic.
- **Extreme lender and borrower concentration:** 25 suppliers total; three third-party addresses are 96.1% of third-party TVL; one EOA is 38% of all supply and 73% of all debt.
- **Zero exit buffer.** Every withdrawal is a Spark/Aave withdrawal; `deployed() == capital()` on all four funded wrappers.
- **Audit coverage is asserted but access-code gated** — no firm, date, scope or finding is independently confirmable for any in-scope contract. No bug bounty, not in Safe Harbor.
- **Very new** (engine ~3.2 months) with **no stress history**, an untested novel liquidation engine, and **no loss backstop** (reserves are negligible).

### Critical Risks

- **Unilateral, instant admin control.** A 3/5 multisig — effectively one party, given the identical signer set across all three Safes — can upgrade the engine, rewrite the oracle price via `setLastGoodPrice`, redirect lender capital through a zero-delay `setStrategy`, or mint unbacked ftUSD, with no delay and no independent check. Deployed invariants must be treated as mutable, not durable.
- **Reflexive collateral.** A loss event in FT Lend impairs ftUSD's backing, which impairs ftUSD, which is 11.8% of FT Lend's collateral and is priced by a feed that reads the impaired collateral. The system has no circuit-breaker for this path and no insurance fund behind it.
- **Unverifiable audit status on capital-bearing contracts** a Yearn deposit would touch, combined with high novelty and complexity.

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

**Subcategory A: Audits & Security Reviews — 3.5**
- Multiple reviews asserted by the team; a real, structured audit registry exists in the investor portal. This is more than a bare marketing claim.
- **No firm, date, scope, or finding count is verifiable.** The portal renders only "Enter Your Unique Code Below" without authentication, and its own UI carries a "No report attached" state, implying some registry rows have no delivered report.
- The only two publicly confirmable reviews cover the token-sale `Escrow` and the separate ftPUT product — **neither touches `PositionsManager`, `ConfigRegistry`, the IRMs, the RFQ engines, ftUSD, ftUSD Core, or `MintAndRedeem`.**
- No formal verification. **No bug bounty.** Not in SEAL Safe Harbor.
- Contract surface is large and novel: dynamic snapshot LTV, RFQ/relayer/session layer, flash liquidation, epoch settlement, cross-product shared collateral, and a discretionary backing strategy. The rubric notes simple surfaces score better than complex ones.
- Between the "1 audit by reputable firm" band (3) and "1 audit by lesser-known firm or dated" (4): coverage is plausibly better than one audit, but the *evidence available to a depositor* is weaker than one published report. **3.5.**

**Subcategory B: Historical Track Record — 4.0**
- Time in production: the assessed `PositionsManager` was deployed **April 27, 2026** with first deposit **April 29, 2026** — **3.2 months**. The wider protocol is 5.4 months. Rubric band "3–6 months" = 4.
- Scale: headline TVL $12.13M would sit in the ">$10M" band (3), but **$4.18M of it is the protocol's own recycled ftUSD collateral**. Genuine third-party TVL is **$7.95M**, which is the "<$10M" band (4).
- No incidents, exploits, or depegs — but also no stress event of any kind, no drawdown, and no liquidation cascade. The clean record carries little information at this age and size.
- Both columns land on 4. **4.0.**

**Score: 3.75/5** — (3.5 + 4.0) / 2 = 3.75. A young, small market whose audit evidence a depositor cannot inspect. The score is held off 4.0+ because a genuine audit registry does exist and the code is fully source-verified; it cannot go below 3.5 because not one in-scope contract has a confirmable review.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0**
- 3-of-5 Gnosis Safe, **no timelock anywhere in the system**. Rubric row 4 is "Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints"; row 5 is "No timelock | Unlimited admin powers". Two of three columns are row 5.
- Every core contract is a **UUPS proxy upgradeable by that Safe** — audited (or unaudited) code can be replaced with arbitrary code in one transaction. This alone makes every other invariant in this report non-durable.
- The Safe is ftUSD `owner` + `masterMinter` + `pauser` + `blacklister`: it can register a new mint module with an arbitrary ceiling (**unbacked mint**), and `blacklist` + `wipeBlacklistedAddress` (**freeze and burn user balances**).
- It can write **arbitrary oracle prices** via `setLastGoodPrice`, bypassing the immutable adapter safeguards.
- **Apparent separation of duties is cosmetic:** the Guardian Safe (3/4) is a strict subset of the admin signers, and the WBTC strategy-manager Safe (3/5) has the *identical five signers*. Three Safes, one party.
- `strategyDelayConfig = 0` on all seven wrappers, so the strategy-change timelock that exists in code is disabled in configuration.
- Signer identities undisclosed. **5.0** — this is the top of the band and is the single largest contributor to the final score.

**Subcategory B: Programmability — 4.0**
- Positives: supply/borrow indices, health factors and liquidation eligibility are computed onchain; IRM curves are `pure` functions; the supply index accrues without operator action.
- Offsetting: admin-settable prices; instant proxy upgrades; four whitelisted engines holding debit allowances over user balances; a keeper-driven, time-sliced, RFQ-routed liquidation path that depends on offchain relayers and resting CLOB orders; epoch settlement performed by a privileged collector; and a **discretionary strategy contract that decides where ftUSD's backing is deployed** with no onchain rule constraining it.
- Rubric row 4 is "Significant manual intervention required | Offchain accounting with periodic reporting". Accounting is not offchain — that pulls toward 3 — but the volume of operator surface and the discretionary backing management pull to 4. Conservative choice: **4.0.**

**Subcategory C: External Dependencies — 4.0**
- Spark and Aave hold **100%** of idle USDC/USDT/WETH/WBTC — `deployed() == capital()` on every funded wrapper. Lender exits are Spark/Aave withdrawals with no buffer. That is "critical functionality depends on them" (row 4), not "some critical functions" (row 3).
- Chainlink is a single feed per asset for all solvency pricing, with two Aave adapters in the path for 39.5% of TVL.
- **A reflexive dependency on FT Lend itself** via ftUSD's backing — an unusual failure mode with no analogue in the rubric, and one that removes the diversification a normal dependency set would provide.
- The Spot AMM/CLOB supplies dynamic-LTV inputs and is the liquidation venue, but was **not independently verified** in this assessment.
- Dependencies are individually blue-chip (which argues for 3), but criticality is total and the reflexive leg is a genuine correlation risk (which argues for 4–5). **4.0.**

**Score: 4.33/5** — (5.0 + 4.0 + 4.0) / 3 = 4.33. Governance is at the ceiling of the band: one party, three Safes, no timelock, arbitrary upgrade and arbitrary price authority, plus an unbacked-mint path on a token that is 11.8% of the market's collateral.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 3.5**
- The direct lending book is strong: 100% onchain, over-collateralized, blue-chip collateral, health factors enforced in-contract (`marginHfSafeBps` 1.50 / `marginHfTargetBps` 1.25 / $250 min equity). On its own this is rubric row 1–2 territory.
- Dragging it down: **ftUSD (11.8% of TVL) is collateral whose own backing is a claim on this same market**, at a nominal 101.03% CR with no independent buffer.
- **Maintenance margins on stables are 1.5%** — a ~66× leverage floor. The dynamic-LTV haircut that is supposed to reduce this is computed off the Spot AMM/CLOB and is not verifiable onchain; the 1.5% floor is what the contract enforces.
- **No loss backstop.** Protocol reserves are 7.72 USDC / 13.16 USDT / 303.01 ftUSD / ~0 WETH / 0 WBTC — negligible against $12.13M. Bad debt would be socialized to suppliers.
- Liquidation engine is novel, keeper- and RFQ-dependent, and has never run at scale.
- Admin can override the price that determines whether a position is solvent at all.
- **3.5** — the blue-chip majority of the book keeps this out of the 4s; the reflexive leg, zero backstop and thin margin floor keep it well above 2.

**Subcategory B: Provability — 2.5**
- Strong: reserves reconcile exactly and independently (supplier balances → `totalSupplied`; debt shares → `borrows`; ftUSD collateral chain → wrapper `capital()` → strategy position). Anyone can reproduce this with `cast`. The supply index is computed onchain.
- Strong: oracle wrappers have **immutable** base feeds and adapters, so the pricing *construction* is fixed and auditable.
- Weak: `setLastGoodPrice` lets the admin write an arbitrary price, which defeats the above at will.
- Weak: **ftUSD's price is circular** — derived from `MintAndRedeem`'s redeem factor over collateral deployed into the market being priced — with a 0 bps deviation tolerance, so a genuine ftUSD market discount cannot surface in liquidation pricing.
- Weak: verifying ftUSD's backing takes four hops through undocumented contracts; nothing in the public docs describes it.
- Weak: no public source repository and no public audit reports, so review is confined to reading verified bytecode.
- **2.5** — genuinely verifiable today, but only for someone who knows where to look, and defeasible by a single admin transaction.

**Score: 3.0/5** — (3.5 + 2.5) / 2 = 3.0. The arithmetic is honest and checkable, which is a real strength; the risks are structural (reflexivity, no backstop) and discretionary (price override), not accounting opacity.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit works today.** Utilization is 6.4%; every asset has ample un-borrowed liquidity (USDC 92.4% available, WBTC 100%, WETH 99.95%). A supplier can leave same-block. On mechanism alone this is rubric row 2–3.
- **But the buffer is zero.** `deployed() == capital()` on all four funded wrappers, so every exit is a Spark or Aave withdrawal. Exit capacity is not a protocol property; it is Spark's and Aave's.
- **Concentration is the real constraint.** 25 suppliers hold the whole market. Excluding the protocol's own strategy, **three addresses hold 96.1% of third-party TVL** (58.1% / 23.5% / 14.5%). One of them is simultaneously 73% of all borrowing. There is no diversified lender base to absorb a large exit, and no secondary market for the supply receipts.
- **Depth is thin absolutely:** $4.79M (WBTC) and $3.14M (USDC) are the two largest pools.
- **Throttles apply (+0.5 modifier).** The rubric adds +0.5 for "throttle mechanisms delaying large exits": per-asset `setWithdrawPaused`, a `CircuitBreaker` on the outflow path, and two withdrawal-gating config flags (`marginRestrictWithdrawToSettlement`, `marginWithdrawRequiresNoDebt`) that are currently `false` but are one admin transaction from `true`.
- **No stress history** — the exit path has never been tested by a drawdown or a large simultaneous withdrawal.

**Score: 3.5/5** — Base 3.0 for a working market-based exit with >$1M depth, **+0.5 for the throttle mechanisms**. Held at 3.5 rather than 4.0 because exit genuinely is instant today at 6.4% utilization; held above 3.0 because the buffer is zero, three parties are 96% of third-party TVL, and the largest of them is also the dominant borrower.

#### Category 5: Operational Risk (Weight: 5%)

- **Team:** founder is public and well known (Andre Cronje — Yearn, Keep3r, Sonic/Fantom), which is a genuine positive and argues for 2. His track record is mixed, with a documented history of abandoned or incomplete launches. The remaining ~15 team members are anonymous. Net: mixed known/unknown, rubric row 3.
- **Legal:** **no disclosed legal entity or jurisdiction** — docs reference a "Foundation" with no domicile. Rubric row 4.
- **Documentation:** conceptually reasonable, but omits oracle design, risk parameters and the multisig setup, and — more seriously — **misdescribes deployed behaviour**. The docs do not disclose that ftUSD's backing is lent into FT Lend, and the "delta-neutral" strategy holds no hedge. The docs' own transparency principle promises published audit reports that do not exist. Rubric row 3–4.
- **Governance transparency:** no DAO, no forum, no Snapshot, signers undisclosed.
- **Incident response:** docs reference "formal incident runbooks"; none is public. Emergency capability exists onchain (pause, circuit breaker, `disablePrice`) and has never been exercised in anger.
- **3.5** — a public, high-profile founder and adequate conceptual docs keep this out of row 4; no legal entity, an anonymous team, undisclosed governance and a documentation-versus-reality gap keep it above 3.

**Score: 3.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.75 | 20% | 0.750 |
| Centralization & Control | 4.33 | 30% | 1.299 |
| Funds Management | 3.00 | 30% | 0.900 |
| Liquidity Risk | 3.50 | 15% | 0.525 |
| Operational Risk | 3.50 | 5% | 0.175 |
| **Final Score** | | | **3.649** |

**Final Score: 3.6**

**Optional modifiers:** none apply. Protocol is <1 year old (no −0.5 for >2 years incident-free) and TVL is far below $500M (no −0.5 for scale).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: ELEVATED RISK — limited approval, strict limits.**

The composite is 3.6, inside the Elevated band. The determining factors are:

- **Governance is the dominant term** (Category 2A at 5.0, carrying 10% of the total weight on its own). A 3/5 Safe with no timelock, holding upgrade authority over every contract, arbitrary oracle-price authority, and an unbacked-mint path on ftUSD, means no invariant in this report survives an adverse governance action. Three Safes with one signer set provide no meaningful separation.
- **Reflexive collateral.** 34.5% of TVL is the protocol's own ftUSD backing; ftUSD is 11.8% of collateral; ftUSD's price feed reads that same backing. FT Lend and ftUSD cannot fail independently.
- **Concentration.** Three third-party addresses are 96.1% of third-party TVL; one EOA is 38% of supply and 73% of debt.
- **Zero exit buffer** — all lender liquidity sits inside Spark/Aave.
- **Audit evidence is not inspectable** for any in-scope contract, with no bounty and no Safe Harbor.
- **No loss backstop** and a novel, untested liquidation engine.

Offsetting these, and the reason this is not High Risk: the accounting is honest and fully reconcilable onchain, the collateral is genuinely blue-chip and over-collateralized, the oracle construction uses canonical Chainlink plus audited Aave adapters wired immutably, privileges have not drifted since deployment, and every contract is source-verified.

**Recommendation for Yearn:** if an allocation proceeds, size it against **third-party TVL ($7.95M), not headline TVL**, cap exposure well below the position of the dominant EOA, avoid ftUSD as a supplied asset (it is the reflexive leg), and treat any admin Safe execution or proxy upgrade as an immediate exit trigger given the absence of a timelock.

---

## Reassessment Triggers

- **Audit status:** reassess if any in-scope audit report is published with firm, date and scope, if a bug bounty launches, or if the protocol enrols in SEAL Safe Harbor.
- **Governance hardening:** reassess if a timelock is added, if the admin Safe threshold or signer independence materially improves, or if the three Safes are given genuinely distinct signer sets.
- **Reflexivity:** reassess if the Delta-Neutral strategy's share of FT Lend TVL exceeds 40% or falls below 10%, if ftUSD backing is redeployed to a venue outside FT Lend, or if the hedge leg (stETH/WETH) is actually activated at size.
- **Time-based:** reassess in **3 months** (fast-moving, early-stage protocol).
- **TVL/usage-based:** using the August 3 baseline of $7.95M *third-party* lending TVL, reassess if it grows above ~$24M, falls below ~$2.6M, or if any of the three dominant third-party suppliers exits.
- **Cap-based:** reassess if `supplyCap` is materially raised on any asset — ftUSD is already 95% subscribed against a 1.5M cap.
- **Concentration:** reassess if the dominant EOA's share of supply or debt moves by more than 15 percentage points in either direction.
- **Incident-based:** reassess after any exploit, bad-debt event, oracle override (`setLastGoodPrice`), oracle-wrapper pause, proxy upgrade, ftUSD depeg or unbacked mint, new ftUSD Core module enablement, or any Spark/Aave incident affecting a configured strategy.

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 7, 2026](https://github.com/yearn/risk-score/pull/237) | 5.0 | Initial assessment — gated by "No audit" |
| [June 12, 2026](https://github.com/yearn/risk-score/pull/237) | 3.5 | Gate cleared after review of the investor-relations audit registry; weighted scoring applied |
| [July 27, 2026](https://github.com/yearn/risk-score/pull/237) | 3.5 | Reassessment: TVL refreshed, market state updated, addresses corrected, ftUSD `maxSupply` raised to 100M. Scores unchanged |
| [August 3, 2026](https://github.com/yearn/risk-score/pull/237) | 3.6 | Full re-assessment. Completed the Pass 1.5 backing reconciliation and found **ftUSD's collateral is lent into FT Lend (34.5% of TVL)** with a circular ftUSD price feed; found the "delta-neutral" strategy runs no hedge; corrected ftUSD caps (1.5M/0.5M, 95% subscribed), the launch date (Apr 27/29 2026), DeFiLlama TVL and FT token supply/market cap; established that three third-party addresses hold 96.1% of third-party TVL and one EOA is 38% of supply and 73% of debt; documented zero wrapper idle buffer, a third 3/5 Safe, the `YieldClaimer` arbitrary-`execute` path and `strategyDelayConfig = 0`; verified the audit portal is access-code gated; mapped the oracle stack (3 canonical Chainlink + 2 Aave adapters + 1 circular internal feed, all immutably wired). Audits 3.0→3.5, Historical 4.5→4.0, Centralization 4.0→4.33, Liquidity 3.0→3.5 |
