# Protocol Risk Assessment: Flying Tulip — FT Lend (ftDNMM)

- **Assessment Date:** June 7, 2026 (Updated: July 27, 2026; data corrected August 3, 2026)
- **Token:** FT Lend market (supply / borrow); system tokens ftUSD and FT
- **Chain:** Ethereum Mainnet
- **Core Contract:** PositionsManager [`0xbe4050a73a7Fb384c65E885a15C33461A4B20055`](https://etherscan.io/address/0xbe4050a73a7Fb384c65E885a15C33461A4B20055)
- **Final Score: 3.5/5.0**
- **Elevated Risk** — limited approval, strict limits. The codebase has been audited multiple times by reputable firms, but the reports and finding-level detail are kept private by the team. The profile remains high-concern because the system is young, complex, centrally controlled, and its core invariants can be changed by a 3/5 Safe with no timelock. See [Risk Score Assessment](#risk-score-assessment). (Also deployed on Sonic; this report covers Ethereum.)

> **Scope.** Yearn's interest (issue [yearn/risk-score#234](https://github.com/yearn/risk-score/issues/234)) is the risk of supplying ("just lend") and/or borrowing in the **FT Lend** market. This report focuses on the lending engine and the assets it touches. The unrelated `tulip.garden` protocol on Solana is **not** Flying Tulip and is excluded. All onchain values in the original assessment were verified on **June 7, 2026 at block `25264957`**; current-state values were refreshed and corrected on **August 3, 2026 at block `25675412`** via `cast` against an Ethereum mainnet RPC.

## Overview + Links

**Flying Tulip** is Andre Cronje's "on-chain financial system that standardizes pricing, credit, and risk across a suite of products" — a hybrid AMM-CLOB spot exchange, a lending market (FT Lend), perpetual futures, and a delta-neutral yield stablecoin (ftUSD). The products share collateral and pricing so "a single deposit can back a loan, serve as collateral for a limit order, and support a future position simultaneously."

**FT Lend** (the contract suite is labelled **ftDNMM** in the protocol's address registry) works as follows:

- **Markets.** Two models: (1) *permissionless* pair markets auto-created for any Spot pool (e.g. an ETH/USDC pool yields an ETH↔USDC lending pair), and (2) a curated *permissioned* cross-collateral pool, documented to "launch with a 10 million TVL cap … may start as low as 1 million." On Ethereum today the live set is the curated pool (6 assets, below).
- **Supply side / yield.** A lender deposits an asset into a per-asset **yield wrapper**. At the assessment block, the USDC, USDT, and WETH wrappers deployed idle liquidity to **Spark**, WBTC deployed to **Aave**, and the ftUSD, wstETH, and FT wrappers had no configured external strategy. Suppliers earn borrower interest plus external strategy yield where applicable. Each asset's `ftYieldWrapper` is registered in the `ConfigRegistry`.
- **Borrow side.** Borrowers post collateral and borrow against it. **LTV is dynamic and snapshotted** at position open based on AMM depth and multi-timeframe volatility ("how much of token X could we sell for token Y right now without blowing through depth?"). Onchain, each asset carries a **maintenance-margin rate (`mmBps`)** in the `ConfigRegistry`, and account health is enforced against `marginHfTargetBps`/`marginHfSafeBps`.
- **Pricing.** For lending/liquidation, the protocol uses an onchain **Chainlink oracle router** (`OracleRouterChainlink`) — distinct from the "oracleless" internal pricing used by the perps product.
- **Liquidations.** Time-sliced / soft liquidations routed through resting CLOB orders and keepers (`liquidateFlash`, RFQ engines), designed to limit price impact on large positions.

**Links:**

- [Protocol Documentation](https://docs.flyingtulip.com/) · [FT Lend docs](https://docs.flyingtulip.com/product-suite/ft-lend/) · [Contract Addresses](https://docs.flyingtulip.com/contract-addresses/) · [Risks page](https://docs.flyingtulip.com/risks/)
- [App](https://flyingtulip.com/) · [Lend dashboard](https://flyingtulip.com/lend/dashboard/) · [Blog](https://blog.flyingtulip.com/)
- [GitHub org `flyingtulipdotcom`](https://github.com/flyingtulipdotcom) (only `ft`, `escrow`, `supporter-whitelist` are public; the lending/ftUSD repos are private)
- [DeFiLlama — Flying Tulip](https://defillama.com/protocol/flying-tulip) (slug `flying-tulip`)
- [Sherlock contest #1223 (ftPUT)](https://audits.sherlock.xyz/contests/1223)
- [CoinList sale](https://coinlist.co/flying-tulip)

## Audits and Due Diligence Disclosures

The in-scope FT Lend / ftDNMM contracts and ftUSD code have been audited multiple times by reputable firms. The team keeps the reports and finding-level detail private, so the audits reduce the binary "no review" risk but do **not** provide the same public assurance as published final reports.

> **Evidence gap — action required before this report is finalized.** This section currently carries no citable evidence: no firm, no date, no scope, no link. That is the claim which clears the **No audit** critical gate and takes the score from 5.0 to 3.5, so it is the single highest-leverage assertion in the report and the only one a reader cannot independently re-derive. Per `reports/skill.md`, a claim that cannot be linked should read *unverified*. Whoever reviewed the source material should record at minimum the **firm names, report dates, and scope** — that much is normally disclosable even under NDA — and state how the reports were seen. Absent that, the gate decision should be revisited.

- **ftDNMM lending contracts** (`PositionsManager`, `ConfigRegistry`, `AccountValuesRouter`, `RfqEngine`/`LeverageRfqEngine`, `StableIRM`/`MajorIRM`/`LongTailIRM`, `MetaActions`): independently reviewed multiple times, but report contents are private.
- **ftUSD contracts** (`FlyingTulipUSD`, `ftUSD Core`, `MintAndRedeem`, `CircuitBreakerV2`): independently reviewed, but report contents are private.
- **Formal verification (Certora/Halmos):** NOT FOUND.
- The docs' [Risks page](https://docs.flyingtulip.com/risks/) states a policy of "external audits before enabling capital-bearing features," but the public docs do not link the underlying reports.
- **Accepted risks** from the Sherlock ftPUT contest README (relevant because the same team/patterns build Lend): "protocol-level loss handling and backstops are out-of-scope," "malicious strategy manager cannot be removed," "caps updates can be front-run," and a circuit-breaker that does not cover all flows. These are design choices that carry into the lending product.

**Contract complexity is high:** a novel dynamic-LTV money market with snapshot LTVs, an RFQ/relayer/session layer, flash-liquidations, epoch settlement, and cross-product shared collateral. Multiple audits reduce the binary audit-gate risk, but private report contents and unpublished final reports keep the category materially risky.

### Bug Bounty

**NOT FOUND.** No Immunefi/Cantina/Code4rena/Sherlock/HackerOne live bug-bounty program. The Sherlock engagement was a fixed-window audit *contest*, not a bounty. **Not enrolled in SEAL Safe Harbor** (verified absent from the `security-alliance/safe-harbor` registry).

## Historical Track Record

- **Production history:** TGE / mainnet ~**Feb 23, 2026** (ftUSD [deployed Feb 21, 2026](https://etherscan.io/tx/0x52e7d46b7e166b8e30c5d38a09d93c44537bcb77b439e5b125d8b51d5670ea21)). The assessed lending engine is newer: `ConfigRegistry` and `PositionsManager` were [deployed April 27, 2026](https://etherscan.io/tx/0x8838947473f9a3b6ba3f46bd89ecd5b28d7bd470e8c0b969cb38ceb5c4ebcdef) (block `24974967`) and the **first `Deposit` event is April 29, 2026** (block [`24986969`](https://etherscan.io/block/24986969)). So the protocol is ~5.4 months old but **FT Lend in its current deployment is only ~3.2 months old.**
- **TVL (DeFiLlama, whole protocol):** **~$12.56M** on August 3, 2026 — Ethereum $12.14M, Sonic $0.42M ([API](https://api.llama.fi/protocol/flying-tulip)). Peak **~$12.58M on July 31, 2026**; DeFiLlama has tracked the protocol since ~May 12, 2026 (85 data points). The marketed "$126M+ TVL" figure is **raise capital parked in Aave**, not organic protocol usage — treat it with skepticism.
- **FT Lend onchain TVL (block `25675412`):** **~$12.13M supplied / ~$0.78M borrowed** across 6 priced assets (table below). Utilization is low (~6.4% overall) but has grown from a near-zero base. This reconciles with DeFiLlama's $12.14M Ethereum figure.
- **Concentration — severe.** Enumerating every `Deposit`/`DepositFor` event and reading current balances gives **25 supplier addresses** holding the entire $12.13M:

| Supplier | Type | USD | Share | Holdings |
|---|---|---|---|---|
| [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) | EOA | $4.62M | **38.1%** | 72.18 WBTC + 21.9K USDC |
| [`0xe0e445…1a59`](https://etherscan.io/address/0xe0e445967256ee60111e243e0f0f94dd1d351a59) | contract | $4.14M | 34.1% | 2.75M USDC + 1.40M USDT |
| [`0x666130…701c`](https://etherscan.io/address/0x66613091b75e54954f77746e160c98391f99701c) | Safe | $1.87M | 15.4% | 1.43M ftUSD + 237.4 WETH |
| [`0x0d5dc6…4e83`](https://etherscan.io/address/0x0d5dc686d0a2abbfdafdfb4d0533e886517d4e83) | Safe | $1.15M | 9.5% | 485.1 WETH + 245.2K USDC |
| 21 others | — | $0.35M | 2.9% | — |

  **Top-1 = 38%, top-2 = 72%, top-3 = 88%, top-4 = 97% of lending TVL.** On the borrow side there are 11 accounts with debt, and the *same* EOA [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) holds **72.7% of all outstanding debt** ($567K across USDC/USDT/ftUSD) while also being the largest supplier. In practice the market is one leveraged EOA looping WBTC collateral into stables, plus a handful of small accounts.
- **Incidents / exploits / depegs:** **NONE FOUND** for Flying Tulip itself through August 2026. (An April 23, 2026 news item is about Flying Tulip *adding* a withdrawal circuit breaker in response to *other* protocols' April exploits — a preventive measure, not a breach.)
- **ftUSD:** trading at peg (~$0.999 per the protocol oracle); supply ~**4.14M** onchain (cap raised to **100M**), thinly traded.

### FT Lend market state — onchain, block `25675412` (August 3, 2026)

| Asset | IRM | Maint. margin | Borrowable | Collateral | Supplied (onchain) | Borrowed | Supply cap | Cap used | Borrow cap |
|-------|-----|:---:|:---:|:---:|---|---|---|:---:|---|
| [USDC](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Stable | 1.50% | ✓ | ✓ | ~3,140,190 ($3.14M) | ~237,621 | 10M | 31% | 2M |
| [USDT](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) | Stable | 1.50% | ✓ | ✓ | ~1,404,423 ($1.40M) | ~223,477 | 10M | 14% | 2M |
| [WETH](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) | Major | 19.0% | ✓ | ✓ | ~736.92 ($1.37M) | ~0.35 | 1,000 | 74% | 100 |
| [WBTC](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | Major | 22.0% | ✓ | ✓ | ~75.18 ($4.79M) | 0 | 100 | 75% | 20 |
| [wstETH](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | Major | 21.0% | — | ✓ | 0 | 0 | 300 | 0% | 1 |
| [ftUSD](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | Stable | 1.50% | ✓ | ✓ | ~1,428,403 ($1.43M) | ~319,073 | **1.5M** | **95%** | **0.5M** |
| [FT](https://etherscan.io/address/0x5DD1A7A369e8273371d2DBf9d83356057088082c) | LongTail | 0% | — | — | ~763.25 (unpriced) | — | 0 | — | 1 |

USD values use the protocol's own Chainlink oracle prices read at block `25675412` (USDC ~$0.9998, USDT ~$0.9989, WETH ~$1,861.78, WBTC ~$63,659.67, wstETH ~$2,308.80, ftUSD ~$0.9988). The `mmBps` is the per-asset maintenance-margin floor (e.g. stables 1.5% → high baseline leverage; ETH/BTC/LSTs 19–22%); the docs state the *effective* LTV is reduced dynamically from this floor by AMM depth and volatility and snapshotted at position open.

**Cap headroom is a live constraint, not a theoretical one.** ftUSD supply sits at **95% of its 1.5M cap** and WBTC/WETH at ~75% of theirs. Because caps are raised by the admin Safe with no delay (`PMWrapper.setCaps`), the current conservative sizing is a policy choice that can change in one transaction — it is not a durable limit on blast radius.

## Funds Management

### How supplying works

A lender calls `deposit(asset, amount)` on the `PositionsManager`. Un-borrowed liquidity is held by the asset's `ftYieldWrapper`; where a strategy is configured, the wrapper deploys it for external yield. At block `25675412`, the USDC, USDT, and WETH wrappers each used a Spark strategy, while WBTC used Aave. The ftUSD, wstETH, and FT wrappers had no configured strategy, so their idle balances were not deployed to Aave or Spark. Borrower interest and any applicable strategy yield accrue through the supply index. Withdrawals (`withdraw`) pull from currently available wrapper liquidity.

**There is no idle buffer.** On all four wrappers with a strategy, `deployed()` equals `capital()` to the wei — 2,902,577.215876 USDC, 736.579217 WETH, 1,180,959.539429 of 1,180,959.539430 USDT, and 7,518,219,204 WBTC units are all sitting inside Spark/Aave rather than in the wrapper. Every lender withdrawal is therefore a Spark or Aave withdrawal in the same transaction, and inherits that venue's liquidity and pause state. Only the ftUSD wrapper (1,109,633 ftUSD, no strategy) holds its balance locally.

The yield wrappers/strategies reside at: USDC wrapper [`0xD2e4A5ac…39E2`](https://etherscan.io/address/0xD2e4A5ac4B4Da102317cF7C9A1289aDF082639E2) → Spark strategy [`0xfBE0736e…b0e5`](https://etherscan.io/address/0xfBE0736eBF5668A604D73BA93a5DdBEe9c10b0e5); WETH/wNative wrapper [`0x460494aF…2da2`](https://etherscan.io/address/0x460494aF61BcB92B59797B4e09C26A5ADecb2da2) → Spark strategy [`0x4df6f4f8…F2a7`](https://etherscan.io/address/0x4df6f4f8CDA409550A5d8A89aD66DE355CF7F2a7); USDT wrapper [`0x28b0905d…123B`](https://etherscan.io/address/0x28b0905d83BCe5FFA6c54651F25858828A38123B) → Spark strategy [`0x852dc763…6a42`](https://etherscan.io/address/0x852dc7638aD159Ec12526d7E47f53f1307756a42); WBTC wrapper [`0x1A5730c7…E042`](https://etherscan.io/address/0x1A5730c71576D77048E9FdC79DD40e4B1E8Fe042) → Aave strategy [`0x06980dC5…3B92`](https://etherscan.io/address/0x06980dC564e85c1eef0b2F85c803f08A30113B92); wstETH wrapper [`0x01980BD1…3db7`](https://etherscan.io/address/0x01980BD1B58313bD3767f6adc75Af8b6464f3db7); ftUSD wrapper [`0xc67D966f…53d9`](https://etherscan.io/address/0xc67D966f761e8cf13Faa0a1E774425290c8453d9); and FT wrapper [`0x7127BB9d…840E`](https://etherscan.io/address/0x7127BB9d9ad0f47B8dA9087e634D67F3946F840E).

### Accessibility & Token Mint Authority (ftUSD)

ftUSD is both borrowable and collateral-enabled in FT Lend, so its mint authority is a direct part of the lender and borrower trust surface. **ftUSD is a Circle FiatToken-style stablecoin** ([`FlyingTulipUSD`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C), 6 decimals, UUPS upgradeable).

**Mint mechanism:** single role-gated minter. **Mint requires backing:** users mint/redeem 1:1 against approved collateral through `MintAndRedeem`; the registered minter is the ftUSD Core contract.

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x56c5892B…8ca9`](https://etherscan.io/address/0x56c5892B0cF41B792217CCDD208f0FA85B178ca9) | ✓ | ✓ | sole `minter()` (allowance ≈ unlimited) | **ftUSD Core (proxy)** — entry point behind `MintAndRedeem` [`0xAa48EcBC…D23C`](https://etherscan.io/address/0xAa48EcBC843cF7E9A29155D112b8Cb27902bD23C) |
| [`0x1118e1c0…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | indirectly | — | `owner` + `masterMinter` | **3/5 Safe** — can `configureMinter`/`removeMinter`, set a new minter, `setMaxSupply`, `pause`, **`blacklist`/`wipeBlacklistedAddress` (freeze & burn user balances)**, and `upgradeToAndCall` |

- **Supply:** 4,142,539 ftUSD; **max supply cap:** 100M (`maxSupply` — raised from 5M since original assessment).
- **Rate limits / caps:** global `maxSupply` 100M; minter allowance ≈ unbounded.
- **Backing check:** atomic at the `MintAndRedeem` layer (collateral in, ftUSD out). However the masterMinter (3/5 Safe) **can configure an arbitrary minter** that issues ftUSD without backing — a high-trust power. ftUSD also carries **blacklist + balance-wipe (seizure)** powers.

For FT Lend lenders this is direct exposure: at block `25675412`, the market had about **1.428M ftUSD supplied and 319,073 ftUSD borrowed**. A privileged unbacked mint or ftUSD impairment could therefore affect ftUSD suppliers directly and weaken positions using ftUSD as collateral. Note that essentially all of that ftUSD supply comes from a single depositor ([`0x666130…701c`](https://etherscan.io/address/0x66613091b75e54954f77746e160c98391f99701c), 1,427,164 of 1,428,403).

### Collateralization

- **Backing:** Borrowing is over-collateralized and enforced onchain via per-asset maintenance margins (`ConfigRegistry.assetCfg`) and account health factors: `marginHfSafeBps = 15000` (1.50), `marginHfTargetBps = 12500` (1.25), `marginMinEquityUSDWad = 250e18` ($250 minimum position equity).
- **Collateral quality:** blue-chip (ETH, WBTC, wstETH, USDC, USDT) plus ftUSD. Good quality.
- **Liquidations:** onchain, keeper-driven, time-sliced and RFQ-routed (`liquidateFlash`, `RfqEngine` [`0xEB00B335…Dc32`](https://etherscan.io/address/0xEB00B335Ca52216Fb60fdFFA361397367C39Dc32), `LeverageRfqEngine` [`0x8263a075…40e2`](https://etherscan.io/address/0x8263a07504d93cB95e0a74f3627bb15faaf140e2)). **This liquidation design has audit coverage but remains novel and untested at scale.** Per the team's own accepted-risk list there is **no protocol-level loss backstop / insurance fund** for bad debt.
- **Curation:** the 3/5 Safe sets every risk parameter — which assets are enabled/collateral/borrowable, maintenance margins, supply/borrow caps, IRMs, the oracle, and the oracle prices themselves.

### Provability

- **Reserves are fully onchain and verifiable:** per-asset `astate` on the `PositionsManager`, wrapper share supply, and any configured Spark/Aave positions can all be read by anyone. The supply index is computed onchain. Verified: summing every supplier's `getBalance` reconciles exactly to the per-asset `astate.totalSupplied`, and summing `debtShares` pro-rata reconciles exactly to `astate.borrows`.
- **Oracle:** `OracleRouterChainlink` [`0xe4372dB4…674A`](https://etherscan.io/address/0xe4372dB43D2814750a19b93950157AD81D93674A) maps assets to **canonical Chainlink feeds** — e.g. USDC/USD [`0x8fFfFfd4…18f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6), ETH/USD [`0x5f4eC3Df…8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419), plus per-asset deviation/staleness handling. **Caveat:** the owner (3/5 Safe) can `setPriceFeed`, `setStaleFallback`, and **`setLastGoodPrice(asset, price)` — i.e. directly write an arbitrary oracle price** — and the guardian can `disablePrice`. So pricing is Chainlink-anchored but **admin-overridable**, which materially weakens provability.
- **Source availability:** verified on Etherscan but **not in a public GitHub repo**; independent audit reports are not public.

## Liquidity Risk

- **Exit mechanism:** suppliers withdraw against currently available wrapper liquidity. At block `25675412`, this was about **2.903M USDC of 3.140M supplied** (~7.6% utilized), **1.181M USDT of 1.404M** (~15.9% utilized), **736.58 WETH of 736.92 WETH** (~0.05% utilized), the full **75.18 WBTC** balance (0% utilized), and **1.110M ftUSD of 1.428M** (~22.3% utilized). A supplier can exit only up to the available liquidity at execution time; borrowed funds are not withdrawable until repaid or liquidated.
- **Depth:** thin in absolute terms: the largest pool (WBTC) is $4.8M and USDC is $3.1M, both small by DeFi lending standards. There is little secondary liquidity for the supply receipts.
- **Holder concentration dominates the exit picture.** Only 25 addresses supply the market, and the **top four hold 97% of TVL** (38% / 34% / 15% / 9.5% — see Historical Track Record). Any one of them exiting moves TVL by 10–38% in a single transaction, and the largest supplier is simultaneously 73% of the protocol's debt. "Low utilization means easy exit" holds only while these four stay put; there is no diversified lender base to absorb a large withdrawal.
- **Throttles / pause:** the admin can pause deposits/borrows/withdrawals per asset (`setDepositPaused`/`setBorrowPaused`/`setWithdrawPaused`), a `Lend CircuitBreaker` [`0x9676E697…18e0`](https://etherscan.io/address/0x9676E697399581AB288844cDE5F73d0887eC18e0) can halt flows, and config flags (`marginRestrictWithdrawToSettlement`, `marginWithdrawRequiresNoDebt`) can gate withdrawals (both currently `false`). The breaker is **owned by the admin Safe** (`owner()` = [`0x1118…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb)), and each wrapper's `setCircuitBreaker` is `onlyStrategyManager` and accepts `address(0)` to disable it — so it is an operational rate limiter, not a safeguard against the admin itself.
- **Stress history:** none — the market has not experienced a drawdown or mass-exit event.
- **Dependency:** exit liquidity for USDC, USDT, WETH, and WBTC depends **entirely** on the relevant **Spark/Aave** strategy having withdrawable liquidity — those wrappers hold no idle buffer at all (`deployed() == capital()`, see Funds Management). The ftUSD, wstETH, and FT wrappers had no external strategy at this block.

## Centralization & Control Risks

### Governance

**A single 3-of-5 Gnosis Safe is the root of all authority, with no timelock.**

- **Admin Safe:** [`0x1118e1c057211306a40A4d7006C040dbfE1370Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) — Gnosis Safe v1.3.0, **threshold 3 of 5**. Verified onchain. Signers (undisclosed in docs, presumed team-controlled EOAs): [`0xB7B54333…08bc8`](https://etherscan.io/address/0xB7B543337539219A5a1326aCB71dBa8Bba408bc8), [`0x3c427497…1B4E`](https://etherscan.io/address/0x3c42749709BF354B3aE0Db29Fd2dd88089b21B4E), [`0xf9E5aF16…9a10`](https://etherscan.io/address/0xf9E5aF16243041cE3141284D225CAfC0fC749a10), [`0x09E2B492…7881`](https://etherscan.io/address/0x09E2B49280f1879172b2C3345d08896921707881), and [`0xD0CA8838…6f5A`](https://etherscan.io/address/0xD0CA88388d1732594D611535314e9B6745396f5A).
- **Guardian Safe:** [`0x22246a9183cE2CE6e2c2a9973F94aEA91435017C`](https://etherscan.io/address/0x22246a9183cE2CE6e2c2a9973F94aEA91435017C) — Gnosis Safe, **threshold 3 of 4**, signer set is a *subset* of the admin Safe (no independent parties). Holds guardian powers (e.g. `disablePrice`, pauses).
- **WBTC strategy-manager Safe:** [`0x5557729b169082f07d3131D560E2f2cb5e6c48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) — a **third** Gnosis Safe, **threshold 3 of 5**, with the *same five signers* as the admin Safe. It is the `strategyManager` of the WBTC yield wrapper only. Separate address, zero added independence.
- **Upgradeability:** every core contract is an OpenZeppelin **UUPS proxy** (`ERC1967Proxy`, EIP-1967 admin slot empty; upgrade gated by `owner()`/`admin()`). The PositionsManager is administered through `PMWrapper` [`0xBDD80028…C68B`](https://etherscan.io/address/0xBDD80028c9e4b9A2D268D2cF62Fb54Ec8697C68B), whose `admin()` is the same 3/5 Safe and which can `upgradePM`, `setCaps`, pause, and `withdrawReserves`.

This means the 3/5 Safe can, **with no delay**: upgrade any contract (including the token and the lending engine) to arbitrary code, change which assets/caps/margins apply, change or hand-set oracle prices, pause user funds, and (for ftUSD) mint, blacklist, and burn balances. There is **no timelock, no DAO, and no independent guardian**. Signers are not disclosed and overlap entirely between the two Safes.

### Admin powers over FT Lend (verified onchain)

| Role | Who | Powers |
|------|-----|--------|
| Owner (ConfigRegistry, OracleRouter, LendingLens, AccountValuesRouter, MintAndRedeem; ftUSD owner/masterMinter/pauser/blacklister) | [3/5 Safe `0x1118…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | Enable/disable assets, set maintenance margins, set IRMs, set/override oracle & prices, upgrade all proxies, mint/seize ftUSD |
| PositionsManager admin (via PMWrapper) | 3/5 Safe (`PMWrapper.admin()`) | `upgradePM`, `setCaps`, `setBorrowPaused`/`setDepositPaused`/`setWithdrawPaused`, `setLiquidationModule`, `setEngine`, `withdrawReserves`, `settleEpoch` |
| Guardian (ConfigRegistry, OracleRouter) | [3/4 Safe `0x22246a…017C`](https://etherscan.io/address/0x22246a9183cE2CE6e2c2a9973F94aEA91435017C) | `disablePrice`, pause |
| Lend CircuitBreaker owner | [3/5 Safe `0x1118…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | Owns the breaker itself — can pause, reconfigure, or be removed from the wrappers entirely |
| Fee collector / epoch settler | [`0x5cd6Abe6…958a`](https://etherscan.io/address/0x5cd6Abe67f8af1C0c699dF36d90a6469Eaf1958a) | receives reserves/fees, settles epochs (76-byte minimal-proxy contract, not a Safe) |
| Yield-wrapper `strategyManager` — USDC, USDT, WETH, wstETH, ftUSD, FT | [3/5 Safe `0x1118…70Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | `setStrategy`, `removeStrategy`, `setStrategiesOrder`, `setCircuitBreaker` (incl. to `address(0)`), `setDepositor`, `setPutManager` |
| Yield-wrapper `strategyManager` — **WBTC only** | [3/5 Safe `0x5557729b…48f6`](https://etherscan.io/address/0x5557729b169082f07d3131D560E2f2cb5e6c48f6) | Same powers over the wrapper holding ~39% of TVL. A **third** Safe, distinct from the admin and guardian Safes but with the identical five signers |
| Yield-wrapper `yieldClaimer` (USDC/USDT/WETH/WBTC) | [`0x88432bB6…1397`](https://etherscan.io/address/0x88432bB6EA62e774cB6d87995CC5277568d01397) | `execute(strategy, to, value, data)` — arbitrary call forwarded through the strategy contract — plus `forceWithdrawToWrapper`, `claimYield` |
| Yield-wrapper `treasury` | [`0x9B2F12De…cDe5`](https://etherscan.io/address/0x9B2F12De620d4E2993068e5cab6D6c7451f6cDe5) | `setStrategyDelay` (76-byte minimal-proxy contract, not a Safe) |

**`strategyDelayConfig` is `0` on every wrapper.** The two-step `setStrategy` → `confirmStrategy` flow that the code implies exists as a safeguard has its timelock set to zero, so a strategy manager can register and activate a new strategy — i.e. redirect where lender capital is deployed — in the same block. Combined with the `execute` arbitrary-call path and the admin Safe's ability to upgrade the wrapper proxies, custody of supplied assets is fully discretionary.

### Programmability

Lending accounting (supply/borrow indices, health factors) is onchain and the oracle is Chainlink-anchored — good. But there is a meaningful **offchain/operator surface**: an RFQ/relayer/session layer (`RelayerAuth` [`0x823a97a2…53F4`](https://etherscan.io/address/0x823a97a2c32985e0f5457fc8103F36698D1F53F4), `Lend SessionManager` [`0xF9f3ddF2…60f8`](https://etherscan.io/address/0xF9f3ddF2E96Cabef94e2634c326DC6dde99360f8), `MetaActions`/`MetaSessionActions`), keeper-driven time-sliced liquidations, and admin-settable oracle prices. Privileged "engines"/"meta modules" can be whitelisted by the admin (`setEngine`, `setMetaModule`) and granted spending allowances.

### External Dependencies

- **Spark & Aave** — at the assessment block, the USDC, USDT, and WETH wrappers used Spark, while WBTC used Aave. A depeg, freeze, insolvency, or withdrawal-liquidity failure at the relevant venue directly impairs affected lender funds and exits. Critical.
- **Chainlink** — liquidation/solvency pricing. Single oracle source per asset (admin-overridable).
- **The Spot AMM / CLOB** — provides the depth/volatility signals for dynamic LTV and the venue for liquidation routing.
- **Permit2** ([`0xEB450d21…c8EC`](https://etherscan.io/address/0xEB450d21ae68D3303Cf5775A54Cc84EE7c3fC8eC)).

## Operational Risk

- **Team:** Founder **Andre Cronje** (public; founded Yearn, Keep3r, co-founded Sonic/Fantom) — strong but mixed reputation (history of abandoned/incomplete launches). The rest of the team (~15) is **anonymous**. Key-person dependency on Cronje.
- **Legal entity / jurisdiction:** **NOT FOUND** / undisclosed (docs reference a "Foundation" with no domicile). CoinList sale excluded the US, Canada and ~21 other jurisdictions.
- **Funding:** ~$200M seed (Sep 2025, $1B FDV), ~$25.5M Series A (Jan 2026), public sale; the official sale-update blog reports total raised ≈ **$184M** (below the "$200M seed" headline — a reconciliation gap worth noting). FT token (Aug 3, 2026): **max supply 10B**, mainnet `totalSupply()` **1,197,190,528**, circulating ~547M, price ~**$0.0994**, **market cap ~$54.5M**, FDV ~$119M ([CoinGecko](https://www.coingecko.com/en/coins/flying-tulip)). FT is an OFT, so mainnet supply is not the cross-chain total.
- **Documentation:** product docs are reasonable conceptually, but **lending oracle design, risk parameters, and the admin/multisig setup are not transparently documented**, and audit reports are not linked from the public docs site.
- **Governance transparency:** no DAO, no forum/Snapshot, multisig signer identities undisclosed.

## Monitoring

Recommended frequency: **daily** for governance/oracle/caps; **hourly** for pause/circuit-breaker and large supply/borrow swings given the market's small size, complex code, and private audit profile.

### Contracts to monitor

| Contract | Address | Why |
|----------|---------|-----|
| PositionsManager | [`0xbe4050a73a7Fb384c65E885a15C33461A4B20055`](https://etherscan.io/address/0xbe4050a73a7Fb384c65E885a15C33461A4B20055) | Core engine. Watch `astate` per asset (supply/borrow/index), `supplyCap`/`borrowCap`, pause flags, `Upgraded` (impl change) |
| ConfigRegistry | [`0xA8777c3D446fa7F0b0FC97a80C1Ea1d37F1ca33E`](https://etherscan.io/address/0xA8777c3D446fa7F0b0FC97a80C1Ea1d37F1ca33E) | Asset enable/disable, `mmBps`, margins, oracle pointer, `Upgraded` |
| OracleRouterChainlink | [`0xe4372dB43D2814750a19b93950157AD81D93674A`](https://etherscan.io/address/0xe4372dB43D2814750a19b93950157AD81D93674A) | `setPriceFeed`, `setLastGoodPrice` (admin price override!), `disablePrice`, `priceUSD` deviation vs Chainlink |
| PMWrapper (PM admin) | [`0xBDD80028c9e4b9A2D268D2cF62Fb54Ec8697C68B`](https://etherscan.io/address/0xBDD80028c9e4b9A2D268D2cF62Fb54Ec8697C68B) | `upgradePM`, `setCaps`, `withdrawReserves`, admin changes |
| Admin Safe (3/5) | [`0x1118e1c057211306a40A4d7006C040dbfE1370Cb`](https://etherscan.io/address/0x1118e1c057211306a40A4d7006C040dbfE1370Cb) | Any `ExecutionSuccess`; owner/threshold changes (`AddedOwner`/`ChangedThreshold`) |
| Guardian Safe (3/4) | [`0x22246a9183cE2CE6e2c2a9973F94aEA91435017C`](https://etherscan.io/address/0x22246a9183cE2CE6e2c2a9973F94aEA91435017C) | Pause / circuit-breaker / `disablePrice` actions |
| Lend CircuitBreaker | [`0x9676E697399581AB288844cDE5F73d0887eC18e0`](https://etherscan.io/address/0x9676E697399581AB288844cDE5F73d0887eC18e0) | Trips that halt flows |
| ftUSD | [`0xF7D85EC4E7710f71992752eac2111312e73E9C9C`](https://etherscan.io/address/0xF7D85EC4E7710f71992752eac2111312e73E9C9C) | `MinterConfigured`/`setMaxSupply`/`Blacklisted`/`Upgraded`; `totalSupply` vs cap; peg |
| Yield wrappers / configured strategies | USDC [`0xD2e4A5ac…39E2`](https://etherscan.io/address/0xD2e4A5ac4B4Da102317cF7C9A1289aDF082639E2), WETH [`0x460494aF…2da2`](https://etherscan.io/address/0x460494aF61BcB92B59797B4e09C26A5ADecb2da2), USDT [`0x28b0905d…123B`](https://etherscan.io/address/0x28b0905d83BCe5FFA6c54651F25858828A38123B), WBTC [`0x1A5730c7…E042`](https://etherscan.io/address/0x1A5730c71576D77048E9FdC79DD40e4B1E8Fe042), wstETH [`0x01980BD1…3db7`](https://etherscan.io/address/0x01980BD1B58313bD3767f6adc75Af8b6464f3db7), ftUSD [`0xc67D966f…53d9`](https://etherscan.io/address/0xc67D966f761e8cf13Faa0a1E774425290c8453d9) | Strategy configuration changes and available wrapper liquidity; Spark exposure for USDC/USDT/WETH and Aave exposure for WBTC |

### Key thresholds / values

- **Backing/health:** monitor that each market's borrowed ≤ supplied and that no asset's oracle `priceUSD` deviates from its Chainlink feed (admin-override detection). Alert on any `setLastGoodPrice`.
- **Caps:** alert on `setCaps` and on supply approaching cap.
- **Governance:** alert on **any** admin/guardian Safe execution and **any** proxy `Upgraded` event (no timelock means zero warning).
- **Concentration:** the top 4 suppliers are 97% of TVL. Track each of [`0xef6953…ae0d`](https://etherscan.io/address/0xef6953954e9c753da43da41136d41a754cd5ae0d) (38%, also 73% of debt), [`0xe0e445…1a59`](https://etherscan.io/address/0xe0e445967256ee60111e243e0f0f94dd1d351a59) (34%), [`0x666130…701c`](https://etherscan.io/address/0x66613091b75e54954f77746e160c98391f99701c) (15%) and [`0x0d5dc6…4e83`](https://etherscan.io/address/0x0d5dc686d0a2abbfdafdfb4d0533e886517d4e83) (9.5%) via `getBalance(user, asset)`; alert on any withdrawal >25% of their position.
- **Caps:** alert when any asset exceeds ~90% of `supplyCap` — ftUSD is already at **95%** (1,428,403 of 1.5M) — and on every `setCaps` call.
- **Solvency fallback:** if onchain bad-debt is not directly readable, monitor liquidations and the `collector`/reserves.

## Appendix: Contract Architecture

```
GOVERNANCE (no timelock)
  Admin Safe 3/5 ── owns/upgrades ───────────────┐   Guardian Safe 3/4 (subset signers)
        │ (also ftUSD owner/masterMinter/pauser/blacklister)   │ disablePrice / pause / circuit-breaker
        ▼                                                       ▼
TOKEN/STABLE LAYER                                       LEND ENGINE (ftDNMM)
  ftUSD (FiatToken, UUPS)                                  PositionsManager (UUPS)
     ▲ mint/redeem 1:1                                      ├─ admin via PMWrapper (admin=Safe)
  ftUSD Core (sole minter)                                  ├─ config → ConfigRegistry
  MintAndRedeem                                              │     • per-asset: IRM, mmBps, wrapper, borrow/collat flags
  FT token                                                   │     • margins: HF safe 1.50 / target 1.25 / minEq $250
                                                            ├─ valuesLens → AccountValuesRouter
LEND ASSETS (Ethereum)                                      ├─ oracle → OracleRouterChainlink → Chainlink feeds
  USDC USDT ftUSD (Stable IRM, 1.5% MM)                     ├─ IRMs: Stable / Major / LongTail
  WETH WBTC wstETH (Major IRM, 19/22/21% MM)                ├─ RFQ: RfqEngine / LeverageRfqEngine
  FT (LongTail IRM, not collateral/borrowable)              ├─ session/relayer: RelayerAuth / SessionManager / MetaActions
                                                            └─ CircuitBreaker
SUPPLY ROUTING (yield)                                  UNDERLYING YIELD
  USDC / USDT / WETH wrappers ───────────────────────►  Spark
  WBTC wrapper ──────────────────────────────────────►  Aave
  ftUSD / wstETH / FT wrappers ──────────────────────►  No strategy configured at assessment block
```

---

## Risk Summary

### Key Strengths

- **Onchain, over-collateralized** lending with blue-chip collateral and a **Chainlink-anchored** oracle (a real oracle for liquidations, unlike the perps product).
- **Reserves are fully verifiable onchain** (per-asset `astate`, wrapper balances, and configured Spark/Aave positions) and the supply index accrues programmatically.
- Idle USDC/USDT/WETH supply earns **Spark** base yield and idle WBTC earns **Aave** base yield; these are blue-chip venues.
- Founder (Andre Cronje) is public with deep DeFi pedigree; well-funded ($180M+ raised).
- Conservative starting **caps** and small footprint limit blast radius today.

### Key Risks

- **Audit reports and findings are private** (no public audit reports, no bug bounty, not in Safe Harbor), and the code is novel and complex.
- **Single 3/5 multisig controls everything with no timelock** — instant upgrade of core contracts, arbitrary oracle price override (`setLastGoodPrice`), pause of user funds, and (for ftUSD) mint/blacklist/seize. Guardian Safe shares the same signers; signer identities undisclosed. This means audited code can be replaced and protocol invariants can change without a delay window.
- **Very new** (protocol ~5.4 months; the assessed lending engine only **~3.2 months**, first deposit April 29, 2026) and **small (~$12.13M lending TVL)**, with **only 25 supplier addresses — the top 4 hold 97% of TVL** and the largest supplier is also 73% of all debt. No stress history.
- **Untested, novel liquidation engine** (time-sliced, RFQ/keeper-routed) with **no protocol-level loss backstop** for bad debt.
- **External dependency on the configured Spark/Aave strategies** for yield and exit liquidity, and on Chainlink for solvency pricing.

### Critical Risks

- **Private audit details for capital-bearing contracts** that a Yearn deposit would touch. There is still no public bounty or insurance fund behind the system.
- **Unilateral, instant admin control:** a 3/5 (effectively single-party) multisig can upgrade the engine or rewrite the oracle price and drain or freeze positions with no delay and no independent check. This materially undermines decentralization and makes the current code invariants non-durable.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** — Not triggered: FT Lend / ftDNMM and ftUSD have been audited multiple times by reputable firms. Caveat: reports and finding-level detail are kept private by the team.
- [ ] **Unverifiable reserves** — Not triggered: reserves are fully onchain and verifiable.
- [ ] **Total centralization (single EOA)** — Not cleanly triggered: control is a 3/5 multisig (not a lone EOA), though with no timelock and overlapping guardian signers it is close.

**No critical gate is triggered.** The final score therefore uses the weighted category scoring below.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits:** multiple in-scope reviews by reputable firms. Downgraded because reports/findings are private, no public bug bounty is available, and the protocol is not in Safe Harbor. **3/5.**
- **Historical:** protocol ~5.4 months live, assessed lending engine ~3.2 months (first deposit April 29, 2026); ~$12.13M lending TVL; 25 suppliers with top-4 at 97%; no stress history. **4.5/5.** *(Score carried forward unchanged pending team review — note that the rubric's `>$10M` scale row is a 3 and `3–6 months` is a 4, so this subcategory is due a re-derivation now that TVL has crossed $10M.)*

**Score: 3.75/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance:** core contracts are UUPS-upgradeable by a 3/5 Safe with **no timelock**; guardian Safe shares signers; admin can override oracle prices and (for ftUSD) mint/seize; signers undisclosed. Because the Safe can replace audited implementations and change core invariants without notice, this sits near the top of the governance-risk range. **5/5.**
- **Programmability:** onchain accounting + Chainlink oracle, but admin-settable prices, immediate proxy upgrades, RFQ/relayer/session/keeper offchain surface, and whitelisted engines mean the system is only partially programmatic from a depositor's perspective. **4/5.**
- **External Dependencies:** Aave + Spark (hold idle supply) + Chainlink + Spot AMM; several established but some critical. **3/5.**

**Score: 4.0/5**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization:** onchain, over-collateralized, blue-chip collateral, but thin stable maintenance margins, novel untested liquidations, no loss backstop, admin oracle override, and external Spark/Aave strategies where configured. **3.5/5.**
- **Provability:** reserves fully onchain and readable; programmatic index; Chainlink oracle — but admin price override and no public-repo source weaken it. **2.5/5.**

**Score: 3.0/5**

#### Category 4: Liquidity Risk (Weight: 15%)

Market-based exit from un-borrowed wrapper liquidity plus the configured Spark/Aave positions; low utilization today so exit is currently easy, but markets are thin (ex-WBTC, the largest pool is USDC at $3.1M), still concentrated, pausable by admin, and untested under stress. **Score: 3.0/5**

*Carried forward unchanged pending team review.* Three findings added in the August 3 pass argue this is understated: only **25 supplier addresses** exist with the **top 4 at 97% of TVL**; the yield wrappers hold **zero idle buffer** (`deployed() == capital()`), so every exit is a Spark/Aave withdrawal; and the template's `+0.5 throttle mechanisms delaying large exits` modifier applies given the circuit breaker and per-asset `setWithdrawPaused`.

#### Category 5: Operational Risk (Weight: 5%)

Public founder with mixed reputation + anonymous team; no disclosed legal entity; docs adequate conceptually but omit oracle/risk-param/multisig detail and do not link public audit reports; no DAO/forum. **Score: 3.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.75 | 20% | 0.75 |
| Centralization & Control | 4.0 | 30% | 1.20 |
| Funds Management | 3.0 | 30% | 0.90 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 3.5 | 5% | 0.175 |
| **Final Score** | | | **≈3.5/5.0** |

No positive modifiers apply (protocol is <1 year old, TVL well under $500M).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk — Limited approval, strict limits.** A single 3/5 Safe with no timelock can upgrade core contracts, override prices, pause withdrawals, and mint/seize ftUSD, so Yearn should treat the deployed invariants as mutable rather than durable.

---

## Reassessment Triggers

- **Audit status changes:** reassess if public audit reports are released or if new audit findings are disclosed.
- **Governance hardening:** reassess if a timelock is added or the admin Safe's threshold/independent-signer set is materially improved.
- **Time-based:** reassess in **3 months** from this refresh (fast-moving, early-stage protocol).
- **TVL/usage-based:** using the August 3 baseline of ~$12.13M lending TVL, reassess if TVL grows above **~$36.4M**, falls below **~$4.0M**, or if any of the four dominant suppliers exits.
- **Cap-based:** reassess if `supplyCap` is materially raised on any asset, in particular ftUSD (currently 95% subscribed at a 1.5M cap).
- **Incident-based:** reassess after any exploit, bad-debt event, oracle override (`setLastGoodPrice`), proxy upgrade, ftUSD depeg, or Spark/Aave incident affecting a configured strategy.

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| June 7, 2026 | 3.5 | Initial assessment |
| July 27, 2026 | 3.5 | Reassessment: TVL refreshed (~$12.6M protocol / ~$12.3M lending), market state table updated, AccountValuesRouter and fee collector addresses corrected, ftUSD maxSupply raised to 100M, wrapper addresses refreshed. Scores unchanged. |
| August 3, 2026 | 3.5 | Data-correction pass at block `25675412`. Fixed ftUSD supply/borrow caps (were listed as 10M/2M, actually **1.5M/0.5M** — 95% subscribed); corrected the FT Lend launch date (engine deployed Apr 27, first deposit Apr 29, 2026 — not March); corrected DeFiLlama TVL and peak; corrected FT token supply/market cap; added full supplier and borrower concentration census (25 suppliers, top-4 = 97%, one EOA = 38% of supply and 73% of debt); documented the zero idle buffer in the yield wrappers, the third 3/5 Safe acting as WBTC `strategyManager`, the `yieldClaimer` arbitrary-`execute` path, `strategyDelayConfig = 0`, and admin-Safe ownership of the circuit breaker. **Scores intentionally unchanged pending team review** — see the note under Category 1 and Liquidity Risk. |
