# Protocol Risk Assessment: Sky — stUSDS (Staked USDS)

- **Assessment Date:** July 23, 2026 (Updated: September 27, 2026)
- **Token:** stUSDS (Staked USDS)
- **Chain:** Ethereum
- **Token Address:** [`0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9)
- **Final Score: 2.50/5.0**
- **Snapshot:** Ethereum block [26,069,994](https://etherscan.io/block/26069994), September 27, 2026 16:29:59 UTC

## Overview + Links

**stUSDS (Staked USDS)** is Sky Protocol's risk-capital yield token — a separate product from **sUSDS** (Savings USDS). Where sUSDS earns the passive Sky Savings Rate (SSR), stUSDS funds **SKY-backed borrowing** through the LockStake Engine V2 and absorbs first-loss risk from borrower defaults in exchange for a higher, actively managed yield (the **stUSDS Rate**, or `str`). stUSDS is deployed as a UUPS-upgradeable ERC-4626 vault wrapping USDS.

The architecture pits stUSDS depositors (risk-capital providers) against SKY-staking borrowers. Deposited USDS is lent out to borrowers in the `LSEV2-SKY-A` ilk (LockStake Engine V2), where it can be borrowed against locked SKY governance tokens. Yield accrues continuously via the `str` rate, funded by `vat.suck()` against the Vow. Borrowed USDS is protected by over-collateralized SKY positions; if a borrower defaults, the loss is socialized to stUSDS holders through the `cut()` mechanism — stUSDS's `chi` (rate accumulator) is reduced, permanently impairing all holders.

Because stUSDS deposits are lent out, **withdrawals are constrained** by the debt ceiling and current borrowing utilization. At the snapshot, ~$207.0M USDS is deposited, with ~$159.7M borrowed (77.1% utilization), leaving ~$47.3M available for withdrawal. This is a fundamental liquidity risk absent from sUSDS.

The borrower-side liquidation backstop was **fully disabled at the snapshot**: [`Clip.stopped()`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399#readContract) returned `3`, which the [verified source](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeClipper.sol#L108-L113) defines as disabling new `kick()`, `redo()`, and `take()` operations. It has remained at level 3 since [September 8, 2025](https://etherscan.io/tx/0x0032e26b8e4b284e3c61ea8aeb0870e3f0dbb7d3173945faf0449ca6ec5138e8), and `Clip.kicks() = 0`: this Clipper has never started an auction. Exact per-urn reconstruction found **12 unsafe urns carrying ~$70.89M of debt** under the $0.025 capped feed. Their SKY collateral still covered principal at the $0.0749 OSM price, but the disabled liquidation path allows losses to accumulate if SKY falls and requires governance to restore auction execution.

No later `File("stopped", …)` event was found through the snapshot. Lowering the breaker is an [`auth`-gated `file("stopped", value)` call](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeClipper.sol#L125-L144). The live ward set includes PauseProxy, Dog, and End, but Dog and End expose liquidation/global-settlement operations rather than an arbitrary Clipper parameter-forwarding path; StUsdsMom is not a ward. Under the current permissions, the normal restart therefore requires a governance executive spell executed by PauseProxy after the MCD Pause's **172,800-second (48 h) delay**. That means at least 48 hours from scheduling, plus any voting and operational response time, during which a sharp SKY decline can deepen the economic shortfall before auctions can even begin.

The **StUsdsRateSetter** contract enables governance-appointed facilitators (`buds`) to adjust the stUSDS supply rate (`str`), the borrower rate (`duty` on the ilk), the supply cap (`cap`), and the debt ceiling (`line`) within predefined bounds, with a 16-hour cooldown between changes. One facilitator is active: a 2-of-3 Safe ([`0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16`](https://etherscan.io/address/0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16)) that called `set()` 12 times between July 23 and September 27, 2026. The **StUsdsMom** provides emergency halt capabilities without the standard 48 h GSM delay.

**Key onchain metrics (September 27, 2026, block 26069994):**

| Metric | Value |
|--------|-------|
| stUSDS total supply (`totalSupply()`) | **192,364,731 stUSDS** (192.4M shares) |
| stUSDS total assets (`totalAssets()`) | **206,995,464 USDS** (~$207.0M) |
| stUSDS price-per-share (`chi`) | 1.07605 USDS/stUSDS |
| stUSDS supply rate (`str`) | `1.00000000158032835` RAY → **~5.11% compounded APY** (~4.98% simple annualized) |
| LSEV2-SKY-A borrower rate (`jug.duty`) | `1.00000000189253559` RAY → **~6.15% compounded APY** |
| stUSDS supply cap (`cap`) | 215,000,000 USDS (~$215M; 96.3% used) |
| stUSDS debt ceiling (`line`) | 191,000,000 RAD (~$191M) |
| USDS held by stUSDS contract | **206,993,855 USDS** |
| LSEV2-SKY-A normalized debt (`Art`) | 136,150,917 (~136.2M) |
| LSEV2-SKY-A accumulated rate (`rate`) | 1.17268 RAY → actual debt ~$159.66M |
| LSEV2-SKY-A ilk debt ceiling (`line`) | 191M RAD (`min(stUSDS.line, totalAssets − Due)`) |
| Withdrawal availability | ~$47.33M USDS (22.9% of total assets) |
| LockStake Clipper circuit breaker | **`stopped = 3` — `kick`, `redo`, and `take` disabled; `kicks() = 0`** |
| Unsafe LSE urns at capped feed | **12 urns / ~$70.89M debt** |
| Current block / timestamp | 26069994 / 1790526599 (Sep 27, 2026) |

**Links:**

- [Sky Developer Documentation — stUSDS](https://developers.skyeco.com/protocol/tokens/stusds/)
- [GitHub Repository — sky-ecosystem/stusds](https://github.com/sky-ecosystem/stusds)
- [Sky App](https://app.sky.money/)
- [Sky Chainlog (active addresses, JSON)](https://chainlog.sky.money/api/mainnet/active.json)
- [Sky Bug Bounty (Immunefi)](https://immunefi.com/bug-bounty/sky/)
- [Sky Governance Portal](https://vote.sky.money/)
- [DefiLlama: Sky Lending](https://defillama.com/protocol/sky-lending)
- [Sky Protocol Docs — Tokens](https://developers.skyeco.com/protocol/tokens/)

## Contract Addresses

All addresses verified onchain at block **26069994** (September 27, 2026) unless otherwise noted.

### stUSDS — Core Contracts

| Contract | Address | Type / Role |
|----------|---------|-------------|
| stUSDS (proxy) | [`0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9) | UUPS/EIP-1967 proxy, ERC-4626 vault. Deployed Aug 25, 2025 |
| stUSDS implementation | [`0x7A61B7adCFD493f7CF0F86dFCECB94b72c227F22`](https://etherscan.io/address/0x7A61B7adCFD493f7CF0F86dFCECB94b72c227F22) | `STUSDS_IMP`. Current implementation behind proxy. Source: [StUsds.sol](https://github.com/sky-ecosystem/stusds/blob/master/src/StUsds.sol) |
| StUsdsRateSetter | [`0x30784615252B13E1DbE2bDf598627eaC297Bf4C5`](https://etherscan.io/address/0x30784615252B13E1DbE2bDf598627eaC297Bf4C5) | `STUSDS_RATE_SETTER`. Governance-configured rate/line/cap controller. Source: [StUsdsRateSetter.sol](https://github.com/sky-ecosystem/stusds/blob/master/src/StUsdsRateSetter.sol) |
| StUsdsMom | [`0x99159d0b885CC6633daC7CD4d82e4247A834b89A`](https://etherscan.io/address/0x99159d0b885CC6633daC7CD4d82e4247A834b89A) | `STUSDS_MOM`. Emergency halt module. `owner = PauseProxy`, `authority = Chief`. Source: [StUsdsMom.sol](https://github.com/sky-ecosystem/stusds/blob/master/src/StUsdsMom.sol) |
| Conv (rate converter) | [`0xea91A18dAFA1Cb1d2a19DFB205816034e6Fe7e52`](https://etherscan.io/address/0xea91A18dAFA1Cb1d2a19DFB205816034e6Fe7e52) | Converts between basis points and RAY (used by RateSetter). Part of [sky-ecosystem/rates-conv](https://github.com/sky-ecosystem/rates-conv) |

### Emergency Spell Factories

| Contract | Address | Role |
|----------|---------|------|
| EMSP_STUSDS_RATE_S_DISS_BUD_FAB | [`0xb3Fd827F58989cFacFE50d2F8e86A1113b6066D1`](https://etherscan.io/address/0xb3Fd827F58989cFacFE50d2F8e86A1113b6066D1) | Factory for spells that diss RateSetter buds |
| EMSP_STUSDS_WIPE_PARAM_FAB | [`0x768D5Ce639c7E7d51E1244E2634d6149bd0d8096`](https://etherscan.io/address/0x768D5Ce639c7E7d51E1244E2634d6149bd0d8096) | Factory for spells that wipe RateSetter parameters |
| EMSP_STUSDS_RATE_SETTER_HALT | [`0x91808ABeCd82495a4a7bf27d80C8c1e89de9effb`](https://etherscan.io/address/0x91808ABeCd82495a4a7bf27d80C8c1e89de9effb) | Factory for spells that halt the RateSetter (`bad = 1`) |

### Sky / MakerDAO Core Dependencies (shared with USDS/sUSDS)

| Contract | Address | Role in stUSDS |
|----------|---------|----------------|
| USDS | [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) | Underlying asset. stUSDS holds 207.0M USDS |
| USDS Join | [`0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) | Mints/burns USDS against VAT. Called by stUSDS for yield accrual (`usdsJoin.exit`) |
| MCD VAT (core ledger) | [`0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) | `vat.suck(vow, stUSDS, diff)` funds yield from Vow. Holds ilk `LSEV2-SKY-A` debt |
| MCD Jug | [`0x19c0976f590D67707E62397C87829d896Dc0f1F1`](https://etherscan.io/address/0x19c0976f590D67707E62397C87829d896Dc0f1F1) | Stability fee accumulator; `jug.drip(ilk)` called on each deposit/withdraw to update debt |
| MCD Vow | [`0xA950524441892A31ebddF91d3cEEFa04Bf454466`](https://etherscan.io/address/0xA950524441892A31ebddF91d3cEEFa04Bf454466) | Surplus buffer; source of yield via `vat.suck(vow, stUSDS, diff)` |
| Clip (LSEV2-SKY-A) | [`0x836F56750517b1528B5078Cba4Ac4B94fBE4A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399) | Liquidation module for LSEV2-SKY-A. **`stopped() = 3` at the snapshot, disabling `kick`, `redo`, and `take` since Sep 8, 2025.** `Due() = 0` and `kicks() = 0` |
| LockStake Engine V2 | (multiple contracts) | The SKY-staking borrowers. Borrow USDS from LSEV2-SKY-A ilk against locked SKY |

### Governance (shared with all Sky contracts)

| Contract | Address | Role |
|----------|---------|------|
| **MCD PauseProxy** | [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) | Holds `wards[stUSDS]=1`, `wards[RateSetter]=1`, owns Mom. Upgrades stUSDS implementation |
| **RateSetter bud Safe** | [`0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16`](https://etherscan.io/address/0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16) | Safe v1.4.1, **2-of-3**, no modules or guard. `RateSetter.buds = 1` since the [Sep 8, 2025 `Kiss`](https://etherscan.io/tx/0x0032e26b8e4b284e3c61ea8aeb0870e3f0dbb7d3173945faf0449ca6ec5138e8). Not listed in the [Sky chainlog](https://chainlog.sky.money/api/mainnet/active.json). Calls `set()` for `str`, `duty`, `line`, and `cap` |
| **MCD Chief** | [`0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) | Continuous-approval governance. `hat()` elects active spell |
| **MCD Pause** | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | DSPause with `delay() = 172800` (48 h GSM delay). `owner = address(0)` |

### Morpho Blue Markets (stUSDS as collateral)

At the snapshot, there are five Morpho Blue markets using stUSDS as collateral. The most active:

| Market | Market ID | Oracle | Supply | Borrow | Utilization | LLTV |
|--------|-----------|--------|--------|--------|-------------|------|
| stUSDS/USDC | [`0xd570…af93d`](https://app.morpho.org/ethereum/variable/0xd570c19c0dc0fbe4ab7faf4a37c4150e1c141c8aada8ca3e1b4b6c1b712af93d) | [`0xba3D…9DD0`](https://etherscan.io/address/0xba3D2Dc1670763c6729CC923A922C7513C0f9DD0) | ~$10,626,377 | ~$9,260,885 | ~87% | 86% |
| stUSDS/USDS | [`0x77e6…7f82`](https://app.morpho.org/ethereum/variable/0x77e624dd9dd980810c2b804249e88f3598d9c7ec91f16aa5fbf6e3fdf6087f82) | [`0x0A97…454C`](https://etherscan.io/address/0x0A976226d113B67Bd42D672Ac9f83f92B44b454C) | ~$1,033,403 | ~$918,040 | ~89% | 86% |
| stUSDS/USDC | [`0xccc1…14e6`](https://app.morpho.org/ethereum/variable/0xccc12702b53f19835bd043f65c3317c886b44d5e747ce1da3ef502947a4314e6) | [`0x3699…1Dc5`](https://etherscan.io/address/0x3699ABA2d63532A0890A761CAd609D128A631Dc5) | 0 | — | inactive | 86% |
| stUSDS/USDC | [`0x9a3d…68a5`](https://app.morpho.org/ethereum/variable/0x9a3d1baed83bc5c05739810350a7224617f41cd809a85f0db7aad0772ec968a5) | [`0x9D27…5FB5`](https://etherscan.io/address/0x9D278a48bDC6591D99C1bc1Cdb27775097105FB5) | ~$2 | 0 | inactive | 86% |
| stUSDS/USDT | [`0x710f…7d8a`](https://app.morpho.org/ethereum/variable/0x710f02caee4555b8ff75b7d48e5b52adc48898dc0c670b977fb1ea83bf4e7d8a) | [`0x9C56…3B3c`](https://etherscan.io/address/0x9C56D403d26C0aE00FA2e767e12F6b588c203B3c) | ~$311,767 | ~$232,507 | ~75% | 86% |

Across the five markets, total loan-token supply was **~$11.97M** and total borrowing was **~$10.41M** at the snapshot, read from [`Morpho.market(id)`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb#readContract). Morpho held 12.67M stUSDS (~$13.64M at `chi`) as borrower collateral. Morpho market utilization is `totalBorrowAssets / totalSupplyAssets`; it measures available loan-token liquidity and is **not** borrower LTV. Borrower health must be computed per account from `Morpho.position(marketId, borrower)`, the market share conversion, and the oracle price.

The primary stUSDS/USDC market had **87.15% utilization** at the snapshot, leaving **~$1.365M** of immediately available USDC. This is lender exit liquidity, not borrower LTV. The market uses Morpho's AdaptiveCurveIRM, whose [configured target utilization is 90%](https://github.com/morpho-org/morpho-blue-irm/blob/main/src/adaptive-curve-irm/libraries/ConstantsLib.sol#L337-L346), so utilization near 90% is expected equilibrium rather than an abnormal condition; it still leaves only about 10–13% of supply immediately available to exiting lenders.

**Risk-scope distinction:** The final **2.50 / 5.0 Medium Risk** score assesses stUSDS as an asset held directly. Supplying USDC to a Morpho market backed by stUSDS is a separate lending exposure: the supplier's exit depends on free USDC, and a sufficiently large stUSDS `chi` cut can propagate through borrower liquidations into Morpho lender bad debt. A small USDC-lender position may be defensible only when it is capped relative to free USDC, can be withdrawn in a tested transaction, and is protected by real-time governance, SKY-price, stUSDS-redemption, and PSM monitoring. That venue-specific operational conclusion does not re-score the stUSDS asset.

**Oracle type for all stUSDS Morpho markets:** All five oracle contracts return price values based on the stUSDS `chi()` rate accumulator. The stUSDS/USDS oracle returns the `chi` value directly at 1e36 scale (~1.076e36). The stUSDS/USDC oracles return `chi` scaled to the loan-token's decimals (~1.076e24 for USDC markets, ~1.076e24 for USDT). These are **rate-feeding oracles** (no Chainlink component) — the price is derived from stUSDS's onchain `chi` accumulator, not from an external market-data feed. For the USDC and USDT pairs, a separate conversion layer maps the stUSDS/USD rate into the loan-token unit. Verified onchain at block 26069994.

For the USDC-denominated markets, a liquidator that can redeem seized stUSDS into USDS has a deep conversion path through the [USDS LitePSM Wrapper](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c). At the snapshot, the underlying [LitePSM](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042#readContract) had `tout = 0`, so USDS could be converted atomically to USDC 1:1 without fee or price slippage, and its [Pocket](https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48?a=0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) held **~4.185B USDC**. This was far larger than Morpho's aggregate **~$13.64M** of stUSDS collateral value. The PSM therefore removes USDS→USDC market-depth as the current bottleneck, but it does not remove the prior stUSDS redemption gate: seized stUSDS must first fit within global `maxWithdraw`/`maxRedeem`. The route also remains conditional on the PSM not being halted, its fee staying acceptable, and the Pocket retaining sufficient USDC.

## Audits and Due Diligence Disclosures

### stUSDS Audit History

The stUSDS codebase (`sky-ecosystem/stusds`) has been audited by two top-tier firms, with formal verification via Certora:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| **ChainSecurity** | Aug 12, 2025 | Initial stUSDS audit | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20250812-ChainSecurity_Sky_stUSDS_audit.pdf) |
| **Cantina** | Aug 18, 2025 | stUSDS review | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20250818-cantina-report-sky-stusds.pdf) |
| **ChainSecurity** | Apr 10, 2026 | Second stUSDS audit (post-update) | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20260410-ChainSecurity_Sky_SkyStUSDS_Audit.pdf) |
| **Cantina** | May 4, 2026 | StUsdsMom audit | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20260504-cantina-report-sky-stusdsmom.pdf) |

The April 2026 ChainSecurity report contains two material design-risk notes on [page 13](https://raw.githubusercontent.com/sky-ecosystem/stusds/master/audit/20260410-ChainSecurity_Sky_SkyStUSDS_Audit.pdf#page=13):

- **Bad debt may exceed the segregated stUSDS risk capital.** ChainSecurity notes that stUSDS is intended to fund staked-SKY borrowing, but does not guarantee that depositor capital covers every loss. If existing LockStake debt is larger than incentivized stUSDS deposits during launch, a large liquidation can leave residual bad debt on the Vow/system surplus buffer. It also identifies a systemic scenario in which USDS deposited into stUSDS was created through the allocation system without eventual collateral backing: slashing that deposit turns the amount into system bad debt. This is a modeled design scenario, not evidence that the current stUSDS deposit base was minted without backing.
- **Depositors can lose principal and can be unable to withdraw.** A liquidation- or governance-triggered `cut()` can slash some or all depositor value. Because only idle funds are withdrawable, exits may depend on new deposits or debt repayment. ChainSecurity also notes transaction-ordering griefing: another user can fill the deposit cap or consume/borrow the remaining idle funds first. The auditors classified these as informational **Notes**, not unresolved code vulnerabilities, and explicitly kept the intended borrow/supply-rate liquidity management outside the review scope.

In addition to audits, the codebase has **Certora formal verification** specifications for all three core contracts:
- `certora/StUsds.conf` + `certora/StUsds.spec`
- `certora/StUsdsMom.conf` + `certora/StUsdsMom.spec`
- `certora/StUsdsRateSetter.conf` + `certora/StUsdsRateSetter.spec`

The RateSetter logic inherits from **SPBEAM** ([sky-ecosystem/sp-beam](https://github.com/sky-ecosystem/sp-beam)), which itself has separate audit coverage.

### Contract Architecture Complexity

stUSDS's architecture is **materially more complex than sUSDS**. While stUSDS itself is a thin ERC-4626 (similar to sUSDS in surface area), it introduces:

1. **RateSetter** — an external contract with its own governance (`buds` facilitators), rate-change cooldown, bounds checking, and circuit breaker (`bad` flag). It bridges to the Jug for borrower-rate settings and to stUSDS for supply-rate/cap/line settings.
2. **Mom** — emergency halt module with authority gated by Chief approval. Can revoke `buds`, halt the RateSetter, or zero out cap/line without 48 h delay.
3. **VAT ilk dependency** — `_burn()` checks `Art * rate + clip.Due() + assets <= totalSupply * chi`, creating a constraint path through the VAT, Jug, and Clip that doesn't exist in sUSDS.
4. **Chained drip calls** — deposit/withdraw trigger `jug.drip(ilk)` to ensure debt accounting is current, adding gas cost and dependency complexity.

### Source Code Verification

The stUSDS source code is publicly available at [GitHub sky-ecosystem/stusds](https://github.com/sky-ecosystem/stusds) (AGPL-3.0 license). **Etherscan source verification: CONFIRMED.** Both the proxy ([`0x99CD…EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9#code)) and the implementation ([`0x7A61…7F22`](https://etherscan.io/address/0x7A61B7adCFD493f7CF0F86dFCECB94b72c227F22#code)) are verified on Etherscan. The implementation is contract `StUsds`, compiled with Solidity v0.8.21 with 200 optimizer runs. The proxy is a standard OpenZeppelin ERC1967Proxy (MIT license).

### Bug Bounty

- **Sky on Immunefi** ([immunefi.com/bug-bounty/sky](https://immunefi.com/bug-bounty/sky/)) — live since Feb 10, 2022, last updated Feb 26, 2026
- **Maximum payout: $10,000,000** for critical smart-contract vulnerabilities
- stUSDS, RateSetter, Mom, and all dependency contracts are in scope under the Sky umbrella

### Safe Harbor (SEAL)

- Sky is **not** listed on the SEAL [Safe Harbor registry](https://safeharbor.securityalliance.org/) at the time of writing.

## Historical Track Record

- **stUSDS deployed:** **August 25, 2025** at block [23219535](https://etherscan.io/tx/0x719ef7cf10e4497963bd2c0a7d4123240331d94991c5ee5010ba1beee9effcfd) via deployer `0x54ead…039e`. Implementation at block [23219532](https://etherscan.io/address/0x7A61B7adCFD493f7CF0F86dFCECB94b72c227F22), RateSetter at block [23219540](https://etherscan.io/address/0x30784615252B13E1DbE2bDf598627eaC297Bf4C5). The StUsdsMom was deployed separately on **May 28, 2026** at block [25193315](https://etherscan.io/address/0x99159d0b885CC6633daC7CD4d82e4247A834b89A)
- **Time in production:** ~13 months at snapshot
- **stUSDS TVL:** ~$207.0M in total assets at snapshot; has grown steadily from launch. Sky Lending TVL (includes sUSDS + stUSDS) was ~$5.89B on DefiLlama on September 27, 2026, within a $5.13B–$5.89B range over the prior 30 days ([source](https://defillama.com/protocol/sky-lending))
- **Underlying Sky/MCD core:** 8+ years in production (since December 2017)
- **stUSDS-specific security incidents:** **None** since launch
- **Past security incidents in Sky ecosystem:**
  - **Black Thursday (March 12, 2020)** — DAI/MCD liquidation auction failures (~$6M shortfall, recapped via MKR mint). Liquidation redesign followed
  - **USDC depeg (March 2023)** — DAI tracked USDC down to ~$0.88. Would similarly impact stUSDS via USDS. Sky diversifying into RWAs since
- **stUSDS price history:** The `chi` accumulator has grown from 1.0 RAY at inception to 1.07605 RAY at snapshot, representing ~7.6% cumulative return over its lifetime. No chi-reduction (`cut()`) events have occurred, and the proxy still points to the original implementation `0x7A61…7F22`
- **LSE liquidation history:** `Clip.kicks() = 0` at the snapshot — the LSEV2-SKY-A Clipper has never started an auction, so the auction-to-`cut()` loss path has no production history
- **Holder concentration (reconstructed from all 17,767 `Transfer` events through the snapshot):** 659 non-zero holders reconcile to `totalSupply = 192,364,730.74` shares. Top-1 held **20.25%**, top-5 **46.50%**, top-10 **55.85%**, and top-20 **67.27%**. The largest holder was an EOA ([`0xee2826453A4Fd5AfeB7ceffeEF3fFA2320081268`](https://etherscan.io/address/0xee2826453A4Fd5AfeB7ceffeEF3fFA2320081268), 38.96M shares / 20.25%); the second was an EOA ([`0x31dBa9b97FAAD27cb6ddF86c92815652098AFa01`](https://etherscan.io/address/0x31dBa9b97FAAD27cb6ddF86c92815652098AFa01), 20.45M shares / 10.63%); Morpho held 12.67M shares / 6.59% as pooled borrower collateral; the Curve pool held 1.09M shares / 0.57%. Reproducible analysis: [`reports/scripts/analyze_erc20_holders_snapshot.mjs`](https://github.com/yearn/risk-score/blob/master/reports/scripts/analyze_erc20_holders_snapshot.mjs)

## Funds Management

### How stUSDS Works — Fund Flow Architecture

```
DEPOSIT (USDS → stUSDS):
  User calls stUSDS.deposit(assets) or mint(shares)
  → _mint() transfers USDS from user to stUSDS
  → Mints stUSDS shares at current chi rate
  → Checks cap (max 215M USDS total supply)
  → Calls _setLine() to dynamically adjust VAT debt ceiling

YIELD ACCRUAL:
  stUSDS._drip() calculates accrued yield:
    chi_growth = str^(t - rho)  (continuous compounding at str rate)
    diff = new_chi * totalSupply - old_chi * totalSupply
  → vat.suck(vow, stUSDS, diff * RAY)  — mints internal USDS from Vow
  → usdsJoin.exit(stUSDS, diff)         — converts internal USDS to ERC-20 USDS
  → chi is updated

BORROWING (LockStake Engine V2):
  SKY stakers lock SKY → post as collateral → borrow USDS from LSEV2-SKY-A ilk
  → Borrowed USDS comes from stUSDS's USDS pool
  → Borrowing rate (duty) set by RateSetter
  → stUSDS dynamically manages the debt ceiling (line) as deposits change

WITHDRAW (stUSDS → USDS):
  User calls stUSDS.withdraw(assets) or redeem(shares)
  → _burn() checks:
      Art * rate + clip.Due() + assets * RAY <= totalSupply * chi
  → Must have sufficient idle (unborrowed) USDS available
  → Transfers USDS to user, burns stUSDS shares

FIRST-LOSS ABSORPTION (cut):
  Auth (PauseProxy or Clip) calls stUSDS.cut(rad)
  → Transfers USDS from stUSDS to Vow
  → Reduces chi, permanently impairing all stUSDS holders
  → Used when LockStake borrower defaults cause bad debt
```

### Accessibility

| Operation | Permission | Atomic? | Fees | Limits |
|-----------|-----------|---------|------|--------|
| USDS → stUSDS (deposit) | Permissionless | Yes (1 tx) | 0 | `cap` = 215M USDS max supply |
| stUSDS → USDS (withdraw) | Permissionless | Yes (1 tx) | 0 | **Constrained by available idle funds** (~$47.3M at snapshot) |
| Cut (loss socialization) | **Auth-gated** (Clip or PauseProxy) | N/A | 0 (loss event) | A direct governance call requires a Pause spell and at least 48 h after scheduling. Clip can call after auction settlement without an additional delay, but while `stopped = 3` and `Due() = 0` that path cannot execute; governance must first complete the timelocked restart. Both paths reduce chi for all holders |
| Yield accrual (`drip`) | Permissionless (anyone can call) | N/A | Gas cost only | — |

**Critical distinction from sUSDS:** stUSDS is **not** a 1:1 liquid vault. Withdrawals are constrained by the borrowing pool's utilization. At the snapshot, only ~22.9% of deposited USDS is withdrawable. If utilization reaches 100%, no withdrawals are possible. This is a fundamental architectural difference from sUSDS, where all deposits are always withdrawable.

### Token Mint Authority

**Mint mechanism:** Permissionless ERC-4626 deposit — any user can mint stUSDS by depositing USDS, subject to the `cap` supply limit. There is **no privileged minting role** on stUSDS. No address can mint stUSDS out of thin air; every stUSDS is backed by a corresponding USDS deposit.

**Mint requires backing:** Yes — `_mint()` atomically transfers USDS from the depositor to the stUSDS contract in the same transaction.

**Per-address mint authority** (verified onchain at block 26069994 from stUSDS `wards()` and the full `Rely`/`Deny` event history at `0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any user | ✓ (via deposit) | ✓ (via withdraw/redeem) | Permissionless ERC-4626 | Must transfer USDS; gated by cap and withdrawal availability |
| PauseProxy ([`0xBE8E…98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB)) | — | — | `wards[stUSDS]=1` | Can upgrade implementation, call `cut()`, `file()` parameters |
| Clip ([`0x836F…A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399)) | — | — | `wards[stUSDS]=1` | Calls `cut()` for unrecovered auction residuals |
| StUsdsRateSetter ([`0x3078…Bf4C5`](https://etherscan.io/address/0x30784615252B13E1DbE2bDf598627eaC297Bf4C5)) | — | — | `wards[stUSDS]=1` | Calls `file()` for `str`, `line`, and `cap` through its bounded `set()` path |
| StUsdsMom ([`0x9915…b89A`](https://etherscan.io/address/0x99159d0b885CC6633daC7CD4d82e4247A834b89A)) | — | — | `wards[stUSDS]=1` | Exposes only `zeroCap`/`zeroLine` on stUSDS; relied on June 22, 2026 when the prior ward [`0xf5DEe2CeDC5ADdd85597742445c0bf9b9cAfc699`](https://etherscan.io/address/0xf5DEe2CeDC5ADdd85597742445c0bf9b9cAfc699) was denied |

**Rate limits / supply caps:**
- Global supply cap: `cap = 215,000,000 USDS` (215M), adjustable by governance or the RateSetter bud up to `maxCap = 1B`
- No per-user or per-transaction limits
- No cooldown on deposits or withdrawals

**Backing check at mint time:** Atomic — depositor's USDS is transferred to stUSDS contract in the same `_mint()` call. Supply is fully backed at all times. The *quality* of backing (lent vs idle) is what varies.

### Collateralization

stUSDS is **not directly collateralized by external assets** in the way a lending protocol or stablecoin might be. Rather:

1. **Every stUSDS is backed 1:1 by USDS** held in the stUSDS contract (at `chi > 1`, the backing exceeds 1:1 due to accumulated yield)
2. **The USDS held by stUSDS is partially lent** to LockStake Engine V2 borrowers. The loans are over-collateralized by locked SKY tokens (specific liquidation ratios are set by Sky governance for the LSEV2-SKY-A ilk)
3. **If a borrower defaults**, the loss cascades to stUSDS holders via `cut()`. There is no separate insurance fund or buffer — stUSDS **is** the first-loss capital
4. **stUSDS depositor solvency and value preservation** depend on: (a) LockStake borrower over-collateralization holding, (b) the Clip liquidation module functioning correctly, and (c) governance using its direct `cut()` authority only to socialize correctly measured losses. A direct governance `cut()` is not an immediate or hidden power under the current permissions: it requires a Chief-approved Pause spell, at least the 48 h Pause delay after scheduling, and execution through PauseProxy. That observable window materially reduces surprise risk and gives holders time to react to a queued slash, although high utilization can still prevent a complete withdrawal. A Clip-originated `cut()` has no separate delay once an enabled auction settles; however, with `stopped = 3` and `Due() = 0` at the live recheck, Clip cannot currently reach settlement, and the practical path to enable it first requires the same observable governance restart and 48 h Pause delay

At the snapshot, using the VAT ilk state for LSEV2-SKY-A:
- Actual borrow utilization: $159.66M / $207.0M = **77.1%**
- The LSEV2-SKY-A `line` is set by stUSDS as `min(stUSDS.line, totalAssets − Due)`. At 191M, it capped borrowing at 92.3% of total assets; the RateSetter bud can raise `stUSDS.line` up to `maxLine` (1B), which would allow 100% of assets to be borrowed
- The `dust` parameter (30,000 RAD) prevents dust loans from persisting
- Exact reconstruction of all 6,690 opened urns found 3,096 active urns and 42 debt-bearing urns. At the capped $0.025 feed, **12 urns with ~$70.89M debt (44.4% of LSE debt) were unsafe**
- The configured Clipper could not liquidate those urns: `stopped() = 3` disables `kick`, `redo`, and `take`. The breaker had been at level 3 since September 8, 2025, with no later `File("stopped", ...)` event through the snapshot

**LockStake borrower health is known per urn at pinned blocks.** Safety is computed as `ink × vatSpot / (art × rate)`; a value below 1 means the position is unsafe under the configured feed. The snapshot reconstruction with the report's [analysis script](https://github.com/yearn/risk-score/blob/master/reports/scripts/analyze_lse_snapshot.mjs) covered every opened urn and reconciled to VAT debt (~$159.661M) and `lsSKY.totalSupply()` (~17.472B SKY). Of the 42 debt-bearing urns, **12 were unsafe under the $0.025 capped feed and carried ~$70.887M debt**. The most leveraged urn ([`0x6af58cdF60Bf1aAfC580FC9C51A11376B7b7F831`](https://etherscan.io/address/0x6af58cdF60Bf1aAfC580FC9C51A11376B7b7F831)) held 68.23M SKY against ~$1.717M debt, with a $0.0301974 liquidation threshold and $0.0251645 principal-parity price. At the capped $0.025 reference, only that urn was below principal parity, with about **$11,226** of idealized shortfall. “Unsafe” therefore means below the required 120% collateralization ratio, not that all $70.887M is bad debt. These are point-in-time results rather than a live guarantee, so monitoring must recompute every debt-bearing urn as collateral, debt, rates, and the feed change.

### Provability

| Metric | Onchain? | How |
|--------|----------|-----|
| stUSDS total supply | ✅ | `stUSDS.totalSupply()` |
| stUSDS total assets | ✅ | `stUSDS.totalAssets()` (sums USDS balance + yield differential) |
| stUSDS exchange rate (`chi`) | ✅ | `stUSDS.chi()` — pure accumulator |
| Supply rate (`str`) | ✅ | `stUSDS.str()` |
| Cap, debt ceiling | ✅ | `stUSDS.cap()`, `stUSDS.line()` |
| VAT ilk debt (LSEV2-SKY-A) | ✅ | `vat.ilks("LSEV2-SKY-A")` → `Art`, `rate` |
| Withdrawal availability | ✅ | Computed: `totalAssets - (Art * rate / RAY + clip.Due() / RAY)` (approximate) |
| USDS backing balance | ✅ | `USDS.balanceOf(stUSDS)` |
| RateSetter parameters | ✅ | `rateSetter.strCfg()`, `rateSetter.dutyCfg()`, `rateSetter.tau()`, `rateSetter.bad()` |
| RateSetter facilitators (`buds`) | ✅ Onchain | `rateSetter.buds(addr)` plus the full `Kiss`/`Diss` event history. One `Kiss` since deployment ([Sep 8, 2025](https://etherscan.io/tx/0x0032e26b8e4b284e3c61ea8aeb0870e3f0dbb7d3173945faf0449ca6ec5138e8)) and no `Diss`: the 2-of-3 Safe `0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16` is the only bud. See Governance section below |
| LockStake Engine V2 solvency | ✅ Onchain, computationally complex | Enumerate `Open` events, then aggregate pinned `vat.urns(ilk, urn)` reads. Snapshot analysis reconciles to VAT `Art` and `lsSKY.totalSupply()`; see [`analyze_lse_snapshot.mjs`](https://github.com/yearn/risk-score/blob/master/reports/scripts/analyze_lse_snapshot.mjs) |
| stUSDS holder concentration | ✅ Onchain, computationally complex | Replay all ERC-20 `Transfer` events through the snapshot and reconcile balances to `totalSupply()`; see [`analyze_erc20_holders_snapshot.mjs`](https://github.com/yearn/risk-score/blob/master/reports/scripts/analyze_erc20_holders_snapshot.mjs) |

**Key transparency note:** The withdrawal-gating formula (`Art * rate + clip.Due() + assets <= totalSupply * chi`) is computed atomically at withdrawal time. Users can simulate it before submitting. The formula is fully onchain but requires multiple contract reads (stUSDS + VAT + Jug + Clip).

## Liquidity Risk

### Primary Mechanism: Direct ERC-4626 Withdrawal

- **Atomic 1:1 redemption** (at current `chi` rate). No fee, no cooldown
- **Constrained by borrowing utilization** — at snapshot, only ~$47.3M of ~$207.0M is idle and available for withdrawal
- **In the worst case** (100% utilization + borrower defaults), 0 USDS would be withdrawable — holders would need to wait for either: (a) borrowers repaying loans, (b) governance reducing the debt ceiling to encourage repayment, or (c) liquidation of defaulted borrowers
- **No withdrawal queue** — withdrawals are first-come-first-served at the contract level. When utilization nears 100%, this creates a bank-run dynamic

### Secondary Liquidity: DEX Markets

stUSDS trades on secondary markets, providing an alternative exit path:

- **Curve stUSDS-USDS pool** ([`0x2C7C98A3b1582D83c43987202aEFf638312478aE`](https://etherscan.io/address/0x2C7C98A3b1582D83c43987202aEFf638312478aE)): **~$3.0M TVL** (~1.82M USDS + ~1.09M stUSDS, worth ~$1.17M at `chi`). `get_dy` quoted 1M stUSDS → 1,074,102 USDS, 0.18% below the 1,076,049 USDS `chi` value. Allows exiting to USDS at market price rather than at `chi`
- **Morpho Blue markets** — stUSDS is used as collateral in five Morpho Blue lending markets. The largest, stUSDS/USDC, had ~$10.63M supplied and ~$9.26M borrowed; all markets totaled ~$11.97M supplied and ~$10.41M borrowed. These markets let holders borrow against stUSDS but are **not spot exit liquidity**: the holder retains encumbered stUSDS and incurs debt and liquidation risk

While DEX liquidity provides an alternative exit, the presence of the direct withdrawal mechanism (even if gated by utilization) means large stUSDS holders may prefer to wait for withdrawals rather than taking DEX slippage.

### Historical Liquidity

- **No `cut()` events** have occurred since deployment — `chi` has only increased
- **Utilization history:** Peak historical utilization has not been reconstructed (TODO: replay LSEV2-SKY-A `frob` history against `totalAssets`). Utilization was 77.1% at the snapshot, and the 191M ilk `line` capped it at 92.3%
- **Curve pool pricing:** A 1M stUSDS sale quoted 0.18% below `chi` at the snapshot. The pool's `get_virtual_price()` (~1.034) measures LP-share growth, not the stUSDS/USDS exchange rate
- stUSDS has been live for ~13 months without a withdrawal crisis

### Withdrawal Constraint Analysis

At the snapshot:
- **Idle USDS for withdrawal:** ~$47.3M (22.9% of total assets)
- **Single-tx withdrawal capacity:** Up to $47.3M (no per-tx limits)
- **Impact of a large withdrawal:** Would temporarily prevent further withdrawals until borrowers repay or new depositors enter
- **What triggers additional withdrawal capacity:**
  1. Borrowers repaying loans (frees up USDS)
  2. New deposits (increases idle USDS)
  3. Clip liquidations completing (converts auctioned collateral back to USDS)
  4. RateSetter reducing `line` (forces debt ceiling down, encouraging repayment)

**Liquidity Score consideration:** While the direct ERC-4626 withdrawal mechanism exists, the gating by borrowing utilization significantly differentiates stUSDS from sUSDS (where 100% of assets are always withdrawable). The secondary DEX path exists but lacks deep liquidity relative to total supply.

## Centralization & Control Risks

### Governance

stUSDS inherits Sky's governance infrastructure identically to USDS and sUSDS:

| Stage | Mechanism | Address |
|-------|-----------|---------|
| Vote | SKY holders lock SKY in **Chief** and approve a candidate spell. Highest-voted becomes the **hat** | [`MCD_ADM = 0x929d…6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) |
| Execute | Hat schedules transactions on **MCD_PAUSE** with 48 h delay | [`MCD_PAUSE = 0xbE28…38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3), `delay = 172800` |
| Apply | After delay, PauseProxy executes the spell | [`MCD_PAUSE_PROXY = 0xBE8E…E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) |
| Emergency halt | **StUsdsMom** can halt RateSetter, zero cap/line without 48 h delay. `owner = PauseProxy`, `authority = Chief` | [`STUSDS_MOM = 0x9915…b89A`](https://etherscan.io/address/0x99159d0b885CC6633daC7CD4d82e4247A834b89A) |

**stUSDS-specific governance powers beyond the Sky baseline:**

| Power | Who | Delay | Impact |
|-------|-----|-------|--------|
| Upgrade stUSDS implementation | PauseProxy (via Chief + 48 h) | 48 h | Can change all contract logic |
| Call `cut()` to socialize losses | PauseProxy or Clip | Governance: **at least 48 h after the spell is scheduled**; Clip: none after an enabled auction settles | **Permanently reduces chi** — impairs all holders. Direct governance is observable during the timelock. While `stopped = 3` and `Due() = 0`, the Clip path is also preceded by the timelocked restart; after restart, individual settlements have no second delay |
| Change `str` (supply rate), `duty`, `cap`, `line` | RateSetter bud (2-of-3 Safe) or PauseProxy | No delay, 16 h cooldown between `set()` calls (RateSetter); 48 h (PauseProxy via spell) | Affects yield, deposit capacity, borrowing capacity. `str`/`duty` bounded to 2%–50% with ≤15% per step; `line`/`cap` only bounded by `maxLine`/`maxCap` (1B), so the bud can allow 100% of assets to be borrowed |
| Change RateSetter config (bounds, cooldown) | PauseProxy (wards) | 48 h | Can widen/restrict rate-step bounds |
| Add/remove RateSetter `buds` | PauseProxy (wards) | 48 h | Changes who can set rates |
| Restart LSEV2-SKY-A Clipper | PauseProxy via governance spell | **At least 48 h after the spell is scheduled**, plus voting/coordination time | Lowers `stopped` so auctions can start/clear. No currently authorized emergency module exposes an immediate restart path |
| Halt RateSetter (`bad = 1`) | PauseProxy or Mom (via Chief approval) | Mom: immediate | Stops rate changes |
| Zero cap / line | Mom (via Chief approval) | Immediate | Halts new deposits / borrowing |
| Remove `buds` | Mom (via Chief approval) | Immediate | Revokes facilitator privileges |

**RateSetter facilitators (`buds`):** A scan of the RateSetter's full event history from deployment to the snapshot found one `Kiss(address)` event and no `Diss(address)` events. The only bud is the Safe [`0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16`](https://etherscan.io/address/0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16), added in the [Sep 8, 2025 initialization transaction](https://etherscan.io/tx/0x0032e26b8e4b284e3c61ea8aeb0870e3f0dbb7d3173945faf0449ca6ec5138e8); `buds(0xBB86…EA16) = 1` at the snapshot. It is a Safe v1.4.1 with a **2-of-3** threshold, no modules, and no guard, and it is not listed in the Sky chainlog. Signer identities are TODO: no public attribution was found. Between July 23 and September 27, 2026 it executed 12 `set()` calls (latest `toc = 1789153115`, September 11, 2026). These lowered `str` from ~6.48% to 5.11% APY, lowered `duty` from 7.57% (first post-July call) to 6.15%, raised `line` from 187.5M to 191M, and raised `cap` from 211M to 215M. Rate and capacity changes therefore take effect **without the 48 h GSM delay**, limited only by the 16 h cooldown and the configured bounds. Mom can remove the bud immediately (`dissRateSetterBud`) with Chief authority; adding a bud requires a PauseProxy spell.

**Strengths (shared with USDS/sUSDS):**
- Token-weighted continuous-approval voting in Chief with no multisig
- 48 h GSM delay on all standard governance operations
- `MCD_PAUSE.owner = address(0)` — no admin shortcut
- No EOA holds direct admin powers on stUSDS, RateSetter, or Mom. The only non-governance privileged actor is the 2-of-3 RateSetter bud Safe, bounded to `set()`

**Weaknesses (unique to stUSDS):**
1. **`cut()` has two timing paths, but neither is presently unannounced** — a direct governance `cut()` must be queued through MCD Pause and wait at least 48 h after scheduling. Clip can socialize an auction's unrecovered residual immediately at settlement without a second GSM delay, but `stopped = 3` currently disables `kick`, `redo`, and `take`, and `Due() = 0` means no auction is pending. Under the current permissions, governance must therefore queue and execute the 48 h restart before any Clip-originated `cut()` becomes possible. Monitoring decoded Pause spells supplies a reaction window for both current paths, although utilization may still prevent a complete withdrawal; after restart, later auction settlements no longer provide a per-auction governance window
2. **Mom has immediate emergency powers** — can halt RateSetter, zero cap, zero line without 48 h GSM delay. These are defensive mechanisms but could be used to trap funds
3. **RateSetter adds a fast operator path** — the active 2-of-3 bud Safe can change `str`, `duty`, `line`, and `cap` every 16 h without the GSM delay. Rate steps are bounded, but `line`/`cap` are bounded only by the 1B maxima, so the bud can allow borrowing of all idle USDS
4. **48 h GSM delay is non-standard during high-utilization periods** — if utilization is near 100%, holders cannot exit during the delay even if they detect a malicious spell
5. **The liquidation breaker was persistently fully engaged and slow to restore** — `Clip.stopped() = 3` had disabled `kick`, `redo`, and `take` since September 8, 2025. Twelve urns with ~$70.89M debt were unsafe at the snapshot feed, and the Clipper has never started an auction (`kicks() = 0`). Under the current ward set, restoring the backstop requires a PauseProxy governance spell and the 48 h Pause delay; StUsdsMom cannot restart this Clipper. In a fast SKY crash, economic shortfall can therefore grow for at least the timelock period before auctions begin, after which clearing still depends on keeper capital and SKY market depth

### Programmability

| Function | Onchain? | Notes |
|----------|----------|-------|
| stUSDS `chi` accumulator | Yes | Continuous accrual via `str`; `drip()` is permissionless |
| USDS deposit → mint stUSDS | Yes | Fully programmatic, gas-only cost |
| stUSDS withdraw → USDS | Yes | Programmatic but gated by borrowing utilization |
| `str` supply rate | **Governance-set** | Via RateSetter buds (16 h cooldown) or PauseProxy (48 h) |
| `duty` borrower rate | **Governance-set** | Via RateSetter buds (16 h cooldown) |
| `cap`, `line` | **Governance-set** | Via RateSetter buds (16 h cooldown) |
| `cut()` loss socialization | **Governance/Clip** | Clip during auction settlement; governance with 48 h delay |
| LSE liquidation | **Disabled / governance-dependent at snapshot and live recheck** | `Clip.stopped() = 3`; no `kick`, `redo`, or `take` until an authorized `file("stopped", lowerLevel)` transaction. The current practical route is a PauseProxy governance spell subject to the 48 h Pause delay |
| Upgrading stUSDS implementation | **Governance** | 48 h delay |

User accounting remains programmatic, but the core borrower-loss-control path was not operational at the snapshot. Rate management also requires ongoing parameter adjustments by facilitators or governance. This makes the live system hybrid rather than fully autonomous.

### External Dependencies

| Dependency | Used By | Criticality | Notes |
|-----------|---------|-------------|-------|
| **USDS** | Core functionality | **Critical** — stUSDS wraps USDS. A USDS failure breaks stUSDS completely | See [sky-usds.md](sky-usds.md) for USDS risk assessment (Score 1.3 — Minimal Risk) |
| **Sky/MCD Core (VAT, Vow, Jug, Chief, Pause, PauseProxy)** | All operations | **Critical** — stUSDS is built on the same infrastructure. VAT ilk accounting, Vow-based yield, Chief governance all directly affect stUSDS | 8+ years production, extensively audited |
| **LockStake Engine V2** | Borrower side | **Critical** — all lending risk depends on LockStake borrower solvency and the liquidation module | SKY-backed, over-collateralized. Specific CR parameters are governance-set |
| **LockStake Clipper** ([`0x836F…A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399)) | Bad-debt absorption | **Critical and unavailable at snapshot** — `stopped() = 3` disabled `kick`, `redo`, and `take`; unsafe debt could not enter or clear auctions | Breaker level 3 set Sep 8, 2025 and not lowered through [block 26069994](https://etherscan.io/block/26069994); `kicks() = 0` |
| **Conv (rates-conv)** | RateSetter rate conversion | **Low** — pure math contract (`btor` / `rtob`), no state, no admin | Part of shared Sky rate-conversion infrastructure |
| **SPBEAM** | RateSetter design origin | **Indirect** — architectural dependency on SPBEAM's proven rate-control model | Audited separately ([reports](https://github.com/sky-ecosystem/sp-beam/tree/master/audits)) |
| **Morpho Blue** | External leverage venue (stUSDS as collateral) | **Low for stUSDS core / High for affected borrowers** — not required for stUSDS to function, but a `chi` cut can trigger same-block liquidations and lender losses | ~$11.97M supplied and ~$10.41M borrowed at snapshot; this is lending exposure, not spot exit liquidity |
| **Chainlink / MCD Spot (OSM)** | Collateral pricing for LSEV2-SKY-A liquidations | **Indirect but critical** — oracle failures could allow underwater borrowers to avoid liquidation, passing losses to stUSDS | Mature multi-source oracle infrastructure |

## Operational Risk

- **Team:** Sky Foundation (formerly MakerDAO) — established 2017, publicly known team including Rune Christensen (co-founder)
- **Legal entity:** Skybase International, governed by Cayman Islands law per [Terms of Use](https://docs.sky.money/legal/skybase-international/terms-of-use). US residents excluded from certain features (Sky Savings Rate, Sky Token Rewards)
- **Documentation:** Comprehensive — [developer docs](https://developers.skyeco.com/protocol/tokens/stusds/), GitHub README with extensive risk disclaimers, public chainlog, governance forum. The stUSDS README explicitly documents 10+ trust assumptions and risk considerations
- **Incident response:** Sky has demonstrated incident response for Black Thursday (2020) and USDC depeg (2023). No stUSDS-specific incidents to date
- **Bug bounty:** $10M Immunefi (Sky), live 4+ years
- **Code quality:** AGPL-3.0 licensed, Certora formal verification on all three core contracts, Foundry test suite, OpenZeppelin upgradeability validation

**Notable: stUSDS's README explicitly lists 15+ trust assumptions and risk considerations**, including:
- Governance can upgrade the contract, and during the 48 h delay all funds could become borrowed, preventing withdrawals
- `cut()` can be called by governance directly, not just by Clip, but the direct governance path is subject to the 48 h Pause delay and can be detected from the queued spell
- RateSetter operators can set rates so that all funds are borrowed
- No debt-ceiling Instant Access Module (autoline) — borrowing can move very fast
- Deposits can be griefed by other deposits; withdrawals can be griefed by borrowers
- Early depositors bear disproportionately higher `cut()` impact before the pool reaches equilibrium
- In a known-bad-debt scenario, all withdrawable funds may be pulled, preventing socialization

This transparency is a positive signal for operational maturity.

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Critical Values / Events |
|----------|---------|--------------------------|
| stUSDS | [`0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9) | `chi()` — any decrease is a loss event; `str()`, `cap()`, `line()` — parameter changes; `totalSupply()`, `totalAssets()` — supply/backing ratio; `Upgraded(impl)` — implementation change; `Rely(usr)` / `Deny(usr)` — ward changes |
| StUsdsRateSetter | [`0x30784615252B13E1DbE2bDf598627eaC297Bf4C5`](https://etherscan.io/address/0x30784615252B13E1DbE2bDf598627eaC297Bf4C5) | `Set(strBps, dutyBps, line, cap)` events; `bad` flag — any change to 1 is a critical halt; `Kiss(usr)` / `Diss(usr)` — facilitator changes; `File("bad", 1)` — circuit breaker; `toc`, `tau` — cooldown parameters |
| StUsdsMom | [`0x99159d0b885CC6633daC7CD4d82e4247A834b89A`](https://etherscan.io/address/0x99159d0b885CC6633daC7CD4d82e4247A834b89A) | **Any call** — Mom actions are emergency-level events: `DissRateSetterBud`, `HaltRateSetter`, `ZeroCap`, `ZeroLine`; `SetOwner` / `SetAuthority` |
| VAT LSEV2-SKY-A | [`0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) | `ilks("LSEV2-SKY-A")` → `Art`, `rate`, `line` — debt growth, interest accrual, ceiling changes |
| MCD Pause | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | Monitor every `Plot` in real time and decode the spell before its ETA. Treat any direct stUSDS `cut()`, ward change, upgrade, or Clipper restart as critical. Under current permissions, the live `stopped = 3`, `Due() = 0` state supplies at least 48 h warning before either a direct governance slash or the restart required to make a Clip-originated slash possible. Once restarted, auction settlements have no separate governance warning |
| Clip (LSEV2-SKY-A) | [`0x836F56750517b1528B5078Cba4Ac4B94fBE4A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399) | `Due()` — any non-zero value means an auction is pending (withdrawals are further constrained); `Take` events — liquidation activity |
| USDS balance at stUSDS | [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) | `balanceOf(stUSDS)` — idle reserve gauge |
| Morpho markets | (see Contract Addresses table) | stUSDS collateral utilization; oracle price feeds for stUSDS |
| SKY price oracle (OSM) | [`PIP_SKY` `0x511485bBd96e7e3a056a8D1b84C5071071C52D6F`](https://etherscan.io/address/0x511485bBd96e7e3a056a8D1b84C5071071C52D6F), sourcing from [`FLAP_SKY_ORACLE` `0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff`](https://etherscan.io/address/0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff) | `peek()` → SKY/USD price (with 1 h OSM delay; reads are whitelist-gated). Monitor for sudden drops approaching liquidation thresholds |
| RateSetter bud Safe | [`0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16`](https://etherscan.io/address/0xBB865F94B8A92E57f79fCc89Dfd4dcf0D3fDEA16) | `getThreshold()` (2), `getOwners()`, module/guard changes; every executed `set()` and its `line`/`cap` values |
| Dog (Liquidation Engine) | [`0x135954d155898D42C90D2a57824C690e0c7BEf1B`](https://etherscan.io/address/0x135954d155898D42C90D2a57824C690e0c7BEf1B) | `ilks("LSEV2-SKY-A")` → `chop`, `hole`, `dirt`; `Bark` events — liquidation initiations; `dirt` approaching `hole` means liquidation throughput is saturated |
| LockStake Engine V2 | [`0xCe01C90dE7FD1bcFa39e237FE6D8D9F569e8A6a3`](https://etherscan.io/address/0xCe01C90dE7FD1bcFa39e237FE6D8D9F569e8A6a3) | `SKY.balanceOf(LockStakeEngine)` — total SKY collateral locked. Decreasing = liquidations or withdrawals; increasing = new borrowers |
| SKY liquidation-market depth | [DEX Screener Ethereum pairs](https://api.dexscreener.com/token-pairs/v1/ethereum/0x56072C95FAA701256059aa122697B133aDEd9279) and direct pool reserve reads | Track total Ethereum DEX volume/liquidity and executable SKY→USDS quotes. Headline TVL includes SKY-side inventory and must not be treated as stablecoin exit capacity |
| Curve stUSDS/USDS pool | [`0x2C7C…78aE`](https://etherscan.io/address/0x2C7C98A3b1582D83c43987202aEFf638312478aE) | Monitor token balances, `TokenExchange` activity, and executable stUSDS→USDS quotes against `convertToAssets`/`chi`. This is the secondary liquidation/holder exit route when direct stUSDS redemption is constrained |
| Primary Morpho stUSDS/USDC market | [Market ID `0xd570…af93d`](https://app.morpho.org/ethereum/variable/0xd570c19c0dc0fbe4ab7faf4a37c4150e1c141c8aada8ca3e1b4b6c1b712af93d) via Morpho [`0xBBBBB…FFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | `market(id)` → supply, borrow, and free USDC; `position(id, borrower)` plus oracle price → borrower LTV. Its AdaptiveCurveIRM targets 90% utilization, so assess lender exit capacity as free USDC relative to the intended position rather than treating 90% itself as abnormal; utilization does not imply borrower LTV |
| Morpho stUSDS/USDS market | [Market ID `0x77e6…7f82`](https://app.morpho.org/ethereum/variable/0x77e624dd9dd980810c2b804249e88f3598d9c7ec91f16aa5fbf6e3fdf6087f82) via Morpho [`0xBBBBB…FFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Same market-utilization and per-borrower LTV checks, denominated in USDS |

### Critical Values, Thresholds, and Frequency

| Metric | Source | Threshold to alert | Frequency |
|--------|--------|---------------------|-----------|
| stUSDS `chi()` | onchain | **Any decrease** (critical — loss event) | Every block / Real time |
| stUSDS withdrawal availability | Computed: `totalAssets - (Art*rate/RAY + Due()/RAY)` | <10% of totalAssets (<$20.7M) — near-full utilization | Hourly |
| LSEV2-SKY-A utilization | `(Art * rate) / totalAssets` | >95% — withdrawal gating imminent | Hourly |
| RateSetter `Set` event | event log | Any change to `str`, `duty`, `line`, or `cap`; **critical** if `line` ≥ `totalAssets` (removes the idle-USDS floor) | Real time |
| RateSetter `bad` flag | onchain | Any change to 1 (catastrophic) | Real time |
| Mom event | event log | **Any event** (emergency action) | Real time |
| `cut()` call on stUSDS | transaction | **Any call** (loss socialization) | Real time |
| stUSDS `cap` utilization | `totalAssets / cap` | >95% — deposit gating imminent | Hourly |
| stUSDS daily deposit/withdraw volume | event logs `Deposit` / `Withdraw` | >20% of totalSupply in 24 h — bank-run signal | Daily |
| stUSDS `str` rate | onchain | Change >200 bps APY — material yield change | On `Set` event |
| USDS depeg | CoinGecko / DEX | >±1% sustained >24 h | 15 min |
| `MCD_PAUSE` spells touching stUSDS | `Plot` event plus decoded spell calldata/actions | **Any** — review immediately. A queued direct `cut()` is critical and starts the exit window; alert with its ETA, proposed `rad`, and implied chi loss. The minimum 48 h warning begins when the spell is scheduled, not when voting or the underlying incident begins | Real time |
| stUSDS `Upgraded` event | event log | Any implementation change | Behind 48 h GSM delay |
| **SKY/USD price and LSE feed** | Underlying OSM plus [`LockstakeCappedOsmWrapper`](https://etherscan.io/address/0x0C13fF3DC02E85aC169c4099C09c9B388f2943Fd) | Wrapper feed is `min(OSM, cap)`. **< $0.025** means the market price has crossed the snapshot cap and further declines reduce LSE collateral value; do not infer liquidations from aggregate CR alone | 15 min |
| **Per-urn LSEV2 safety** | For each urn: `ink × vatSpot / (art × rate)`; aggregate collateral from `lsSKY.totalSupply()` plus unsold auction lots | **< 1.10** warning; **< 1.00** urn is unsafe and would be barkable only when `clip.stopped() < 1`. Report count and debt of unsafe urns rather than treating aggregate CR as a position-level threshold | Hourly |
| **Clip `stopped()`** | onchain | **Any value >0** means liquidation functionality is restricted; **3 is critical** because `kick`, `redo`, and `take` are all disabled. The [snapshot block 26069994](https://etherscan.io/block/26069994) read 3. Because restart currently requires the 48 h governance delay, alert on the change to 3 rather than waiting for SKY to cross a loss threshold | Every block / Real time |
| **Dog.dirt(ilk)** approaching **Dog.hole** | onchain | `dirt > 0.8 × hole` — liquidation throughput saturated; queued auctions at risk of further price deterioration | On every `Bark` event |
| **Clip `Take` events** | event log on [`0x836F56750517b1528B5078Cba4Ac4B94fBE4A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399) | **Spike >3 auctions/hour** — active liquidation cascade; sustained >10/hour = crisis mode | Real time |
| **Clip `Due()` > 0 for >24 h** | onchain | Stale auction — potential failed liquidation, bad debt may flow to stUSDS | Hourly |
| **SKY liquidation-market depth** | [DEX Screener pairs](https://api.dexscreener.com/token-pairs/v1/ethereum/0x56072C95FAA701256059aa122697B133aDEd9279), dominant [SKY/USDS pool](https://dexscreener.com/ethereum/0x2621cc0b3f3c079c1db0e80794aa24976f0b9e3c), executable route quotes | Alert if a SKY→USDS sale sized to `Dog.hole` ($250K reference notional) has >5% impact, or if depth/volume falls while unsafe debt rises. At the snapshot, the direct dominant-pool estimate was already ~5.28% | Hourly; every block during stress |
| **Curve stUSDS/USDS executable depth** | [`0x2C7C…78aE`](https://etherscan.io/address/0x2C7C98A3b1582D83c43987202aEFf638312478aE) pool balances and executable stUSDS→USDS quote versus `convertToAssets`/`chi` | Alert if stUSDS trades >1% below its chi-implied USDS value, or if selling collateral equal to the largest active Morpho borrower would incur >5% price impact. Requote after any `cut()` or material balance change | Hourly; every block during stress |
| **Morpho stUSDS market utilization** | onchain (see Monitoring Functions below) | >90% means loan-token liquidity is thin; it does **not** measure borrower liquidation headroom | Hourly |
| **Morpho borrower LTV** | `position()` + accrued market share conversion + oracle `price()` | Any borrower >85% against 86% LLTV is within ~1.2% of liquidation from a `chi` cut | Hourly; every block after `Cut` |
| **Total locked SKY** | `lsSKY.totalSupply()` plus unsold `clip.sales(id).lot` while auctions are active | Drop >10% in 24 h — mass withdrawal or liquidation event in progress. Do not use `SKY.balanceOf(engine)`, which excludes delegated collateral | Hourly |

### Monitoring Functions

Key read functions for automated monitoring:

```
# stUSDS core
stUSDS.chi() → uint256         # Price-per-share. Any decrease = loss event
stUSDS.totalAssets() → uint256 # Total USDS backing
stUSDS.totalSupply() → uint256 # Total stUSDS shares
stUSDS.str() → uint256         # Supply rate (RAY)
stUSDS.cap() → uint256         # Supply cap (WAD)
stUSDS.line() → uint256        # Debt ceiling (RAD)

# Withdrawal availability (requires multi-contract read)
vat.ilks("LSEV2-SKY-A") → (Art, rate, spot, line, dust)
jug.ilks("LSEV2-SKY-A") → (duty, rho)
clip.Due() → uint256
USDS.balanceOf(stUSDS) → uint256
# withdrawable ≈ totalAssets - (Art * rate + Due) / RAY

# RateSetter
rateSetter.bad() → uint8       # Circuit breaker (0 = ok, 1 = halted)
rateSetter.tau() → uint64      # Cooldown period
rateSetter.toc() → uint128     # Last rate update timestamp
rateSetter.strCfg() → (min, max, step)
rateSetter.dutyCfg() → (min, max, step)
rateSetter.buds(address) → uint256  # Check specific facilitators

# Mom
mom.owner() → address           # Should always equal PauseProxy
mom.authority() → address       # Should always equal Chief

# SKY price & LockStake liquidation monitoring
osm.peek() → (bytes32, bool)    # SKY/USD price (price × 1e18 in bytes32). 1 h OSM delay
spot.ilks("LSEV2-SKY-A") → (pip, mat)  # Oracle address & liquidation ratio
dog.ilks("LSEV2-SKY-A") → (clip, chop, hole, dirt)  # Liquidation engine state
clip.kicks() → uint256          # Total auction count; rising = liquidation activity
clip.Due() → uint256            # Pending auction value (RAD). Non-zero beyond 1 h = stale auction
clip.stopped() → uint256        # 0 active; 1 blocks kick; 2 also blocks redo; 3 also blocks take
lsSKY.totalSupply() → uint256    # Locked SKY in active urns (WAD)
clip.list() / clip.sales(id)     # Add unsold auction lots while Due() > 0

# Aggregate LSE collateral diagnostic (does not replace per-urn health checks)
# collateral = lsSKY.totalSupply + sum(active clip sales[id].lot)
# feedPrice = min(underlyingOSMPrice, wrapper.cap)
# atRiskDebt = (Art * rate + Due) / 1e27
# aggregateCR = collateral * feedPrice / atRiskDebt

# Morpho stUSDS market health (for market id, see Contract Addresses table)
morpho.market(marketId) → (totalSupplyAssets, totalSupplyShares, totalBorrowAssets, ...)
# Utilization = totalBorrowAssets / totalSupplyAssets
# Utilization alert: >90% means thin loan-token liquidity, not high borrower LTV
# Borrower alert: compute each position's accrued debt / oracle-valued collateral
# Alert: any `Liquidate` event on stUSDS-collateral Morpho markets
```

## Appendix A: Contract Architecture

Snapshot block 26069994 (September 27, 2026).

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              USER LAYER                                   │
│                                                                           │
│   user holds USDS ─── deposit(stUSDS) ──────→ receives stUSDS shares      │
│                        mint(stUSDS)                                       │
│                                                                           │
│   stUSDS holder ───── withdraw(stUSDS) ────→ receives USDS (if idle)      │
│                        redeem(stUSDS)                                     │
│               OR sell stUSDS on Curve / borrow against it on Morpho      │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           STUSDS CORE                                     │
│                                                                           │
│   ┌──────────────────────────────────────────────────┐                   │
│   │  stUSDS Proxy (0x99CD…EEB9)                      │                   │
│   │  Implementation: 0x7A61…7F22 (UUPS)               │                   │
│   │                                                   │                   │
│   │  ERC-4626 + ERC-20 (with permit, EIP-2612)       │                   │
│   │  chi = 1.07605   str = ~5.11% APY                │                   │
│   │  cap = 215M   line = 191M RAD                     │                   │
│   │  totalAssets = $207.0M   totalSupply = 192.4M     │                   │
│   │  wards: PauseProxy, Clip, RateSetter, Mom         │                   │
│   └──────────┬───────────────────────────────────────┘                   │
│              │                                                            │
│              │  drip (yield accrual)                                       │
│              ▼                                                            │
│   ┌──────────────────────┐                                                │
│   │  vat.suck(vow,       │  ← generates yield from Vow surplus            │
│   │    stUSDS, diff)     │                                                │
│   │  usdsJoin.exit(      │  ← converts internal USDS to ERC-20            │
│   │    stUSDS, diff)     │                                                │
│   └──────────────────────┘                                                │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │  USDS pool is partially lent
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         VAT / BORROWING LAYER                             │
│                                                                           │
│   ┌──────────────────────────────────────────────────┐                   │
│   │  MCD_VAT (0x35D1…492B)                           │                   │
│   │  ilk: LSEV2-SKY-A                                │                   │
│   │    Art = 136.15M   rate = 1.1727                  │                   │
│   │    line = 191M RAD   dust = 30K RAD               │                   │
│   │    actual debt = $159.66M                         │                   │
│   └──────────┬───────────────────────────────────────┘                   │
│              │                                                            │
│              ▼                                                            │
│   ┌──────────────────────┐     ┌──────────────────────┐                  │
│   │  MCD_Jug             │     │  Clip (LSEV2-SKY-A)   │                  │
│   │  0x19c0…f1F1         │     │  0x836F…A399          │                  │
│   │  drip(ilk): accrues  │     │  Due()=0, stopped=3   │                  │
│   │  stability fee       │     │  Liquidates defaulted │                  │
│   └──────────────────────┘     │  LockStake positions  │                  │
│                                └──────────────────────┘                  │
│                                                                           │
│   ┌──────────────────────────────────────────────────┐                   │
│   │  LockStake Engine V2                             │                   │
│   │  (SKY stakers borrow USDS against locked SKY)    │                   │
│   │  Over-collateralized; liquidation ratio set by   │                   │
│   │  MCD Spot oracles                                │                   │
│   └──────────────────────────────────────────────────┘                   │
│                                                                           │
│   ┌──────────────────────┐                                                │
│   │  MCD_Vow             │                                                │
│   │  0xA950…4666         │                                                │
│   │  Surplus buffer;     │                                                │
│   │  funds yield via     │                                                │
│   │  vat.suck(vow,…)     │                                                │
│   └──────────────────────┘                                                │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                       RATE CONTROL LAYER                                  │
│                                                                           │
│   ┌──────────────────────────────────────────────────┐                   │
│   │  StUsdsRateSetter (0x3078…Bf4C5)                 │                   │
│   │  wards: PauseProxy, Mom                           │                   │
│   │  buds[0xBB86…EA16] = 1 (2-of-3 Safe)              │                   │
│   │  tau = 57600 (16h cooldown)   bad = 0             │                   │
│   │  strCfg: min=200 max=5000 step=1500 (bps)         │                   │
│   │  dutyCfg: min=210 max=5000 step=1500 (bps)        │                   │
│   │  maxLine = 10^54   maxCap = 10^27 (1B)            │                   │
│   │  conv = 0xea91…7e52 (rates-conv)                  │                   │
│   └──────────┬───────────────────────────────────────┘                   │
│              │                                                            │
│              ▼                                                            │
│   ┌──────────────────────────────────────────────────┐                   │
│   │  StUsdsMom (0x9915…b89A)                         │                   │
│   │  owner = PauseProxy   authority = Chief           │                   │
│   │  EMERGENCY (no 48h delay):                        │                   │
│   │    dissRateSetterBud — remove a facilitator       │                   │
│   │    haltRateSetter — set bad=1 (circuit breaker)   │                   │
│   │    zeroCap — set cap and maxCap to 0              │                   │
│   │    zeroLine — set line and maxLine to 0           │                   │
│   └──────────────────────────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         GOVERNANCE LAYER                                  │
│                                                                           │
│   SKY holders (23.46B supply)                                             │
│         │                                                                 │
│         │  lock + approve in Chief                                        │
│         ▼                                                                 │
│   ┌──────────────────────┐                                                │
│   │  MCD_ADM (Chief)     │  hat = 0xF01b…BaDC                             │
│   │  0x929d…6f9          │  continuous-approval voting                   │
│   └──────────┬───────────┘                                                │
│              │                                                            │
│              │  plot spell                                                │
│              ▼                                                            │
│   ┌──────────────────────┐                                                │
│   │  MCD_PAUSE           │  delay = 172800 (48 h GSM)                    │
│   │  0xbE28…38f3         │                                                │
│   └──────────┬───────────┘                                                │
│              │                                                            │
│              │  exec after delay                                          │
│              ▼                                                            │
│   ┌──────────────────────┐                                                │
│   │  MCD_PAUSE_PROXY     │  wards[stUSDS]=1, wards[RateSetter]=1         │
│   │  0xBE8E…E98FB        │  owns Mom, upgrades stUSDS impl                │
│   └──────────────────────┘                                                │
│                                                                           │
│   Emergency (no 48 h delay, via Chief authority):                         │
│        Mom.dissRateSetterBud / haltRateSetter / zeroCap / zeroLine        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Risk Summary

### Key Strengths

- **2 top-tier audits + Certora formal verification** — ChainSecurity (2 audits) and Cantina (2 audits) across all three core contracts; Certora specs for stUSDS, RateSetter, and Mom
- **Built on 8+ year battle-tested infrastructure** — VAT, Vow, Jug, Chief, PauseProxy are among the most proven contracts in DeFi
- **1:1 USDS backing at all times** — every stUSDS is backed by a corresponding USDS held in the stUSDS contract (with accumulated yield providing over-backing at `chi > 1`)
- **Fully onchain accounting** — `chi`, `str`, `cap`, `line`, and the withdrawal-availability formula are all publicly readable. ERC-4626 standard compliance
- **No privileged minting** — stUSDS cannot be minted without USDS deposit. No address holds direct mint authority
- **Explicit risk documentation** — the GitHub README contains 15+ explicit trust assumptions and risk warnings, demonstrating operational transparency
- **$10M Immunefi bug bounty** under the Sky umbrella, live 4+ years

### Key Risks

- **Withdrawal gating risk** — stUSDS is fundamentally different from sUSDS in that withdrawals are constrained by borrowing utilization. At the snapshot, only ~22.9% of assets ($47.3M) are withdrawable, and the largest holder's position alone (~$41.9M at `chi`) equaled ~89% of that amount. In a crisis, 100% utilization would prevent all withdrawals
- **First-loss exposure** — stUSDS holders bear the first-loss risk from LockStake Engine V2 borrower defaults via the `cut()` mechanism. Chi can be permanently reduced without a second 48 h GSM delay during an enabled Clip auction's settlement. In the current `stopped = 3`, `Due() = 0` state, that path cannot execute until governance completes the observable timelocked restart
- **Active rate-setter operator** — the `str` rate, `duty` rate, `cap`, and `line` are actively managed by a 2-of-3 Safe bud without the GSM delay (12 `set()` calls between July 23 and September 27, 2026). Poor rate-setting, or raising `line` above total assets, could drive utilization to 100% or create unsustainable yield expectations
- **Governance `cut()` power** — Sky governance can directly call `cut()` via PauseProxy, socializing an arbitrary amount up to all stUSDS assets. The current path requires a queued spell and at least the 48 h Pause delay, making it observable and materially reducing surprise risk; monitor the proposed amount and exit during the warning window where liquidity permits
- **Mom emergency powers without delay** — the Mom can halt the RateSetter, zero out cap/line, and revoke facilitators without the 48 h GSM delay. While defensive, these could trap funds
- **Limited DEX liquidity** — the Curve stUSDS-USDS pool (~$3.0M TVL, ~1.82M USDS) is the identified spot exit and is shallow relative to total assets ($207.0M). Morpho markets provide leverage against stUSDS, not a sale or redemption path
- **Thin SKY liquidation-market depth** — at the snapshot, Ethereum SKY pairs showed only ~$21.01M of headline liquidity and ~$1.99M of 24 h DEX volume; the dominant SKY/USDS pool held just ~$4.74M USDS. This is small relative to the ~$70.89M debt sitting in feed-unsafe urns, and headline liquidity overstates executable stablecoin capacity because it includes SKY-side inventory and concentrated-liquidity ranges
- **RateSetter bud is a small multisig** — the 2-of-3 Safe has no public signer attribution (TODO) and is not in the Sky chainlog. Its powers are bounded to `set()`, and Mom can revoke it immediately
- **Early-depositor tail risk** — if `cut()` events occur before the pool reaches borrowing equilibrium, early depositors could bear disproportionate losses (explicitly warned in README)

### Critical Risks `[If Any]`

- **Withdrawal gate combined with governance upgrade risk** — during the 48 h GSM delay period for a malicious governance spell, if utilization is at or near 100%, no stUSDS holder can exit. This is a structural risk not present in sUSDS or USDS. A well-timed malicious governance action (e.g., upgrading stUSDS to a drainer contract) during a high-utilization period could trap all depositors
- **Stopped liquidation backstop, delayed restart, and residual auction shortfall — the report's largest current risk.** The sole LSEV2-SKY-A Clipper remains at level 3, disabling the protective auction path. Auctions are beneficial: when collateral sales recover the outstanding principal, no `cut()` occurs. The loss path exists only if an enabled auction exhausts all SKY collateral while the remaining principal exceeds the final payment; in that case, the [`take()` settlement logic](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeClipper.sol#L430-L436) atomically calls `cut(due - owe)` for the unrecovered amount, without a separate governance delay. The immediate `cut()` is therefore loss recognition after under-recovery, not a reason to disable auctions. The present stop is the primary issue because no SKY can be sold to recover debt while a sharp price decline can deepen the latent shortfall. Restart requires governance scheduling, at least the 48 h Pause delay, and execution before auctions can begin; after restart, thin SKY market depth can still cause slow or discounted clearing and a residual `cut()`. This is a **high-severity failure mode and a critical dependency condition**. The timelock is itself a governance safeguard, and neither the stopped state nor the passage of 48 hours alone realizes accounting bad debt

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **Unverified contract source** — ✅ Both stUSDS proxy ([`0x99CD…EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9#code)) and implementation ([`0x7A61…7F22`](https://etherscan.io/address/0x7A61B7adCFD493f7CF0F86dFCECB94b72c227F22#code)) are **verified on Etherscan**. Implementation is `StUsds`, compiled v0.8.21 with 200 optimizer runs, AGPL-3.0. ✅ PASS
- [x] **No audit** — stUSDS has been audited by ChainSecurity (2 audits: Aug 2025 and Apr 2026) and Cantina (2 audits: Aug 2025 and May 2026), with Certora formal verification. ✅ PASS
- [x] **Unverifiable reserves** — stUSDS's `totalAssets()`, `chi`, `cap`, `line`, USDS balance held, and VAT ilk state are all readable onchain. The only gating constraint (withdrawal availability) is computed from onchain data. ✅ PASS
- [x] **Total centralization** — Governance is SKY token-weighted Chief vote + 48 h GSM Pause + PauseProxy. No EOA holds direct admin powers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

| Factor | Assessment |
|--------|-----------|
| Audit firms | **ChainSecurity** (2 audits: Aug 2025, Apr 2026), **Cantina** (2 audits: Aug 2025, May 2026) across stUSDS core + Mom + RateSetter |
| Formal verification | **Certora** specs for all three core contracts |
| Bug bounty | $10M Immunefi (Sky umbrella), live 4+ years, 216 assets in scope |
| Contract surface | Thin ERC-4626 vault (stUSDS) + RateSetter (~200 lines) + Mom (~100 lines). Medium overall complexity due to VAT/Jug/Clip cross-contract interactions |
| Dependency audit coverage | Underlying MCD core (VAT, etc.) has 8+ years of multi-firm audit history |

**Audits Score: 1.0 / 5** — 2 top-tier firms with 4 total audits + Certora formal verification + $10M bounty. Equivalent or better than sUSDS.

**Subcategory B: Historical Track Record**

| Factor | Assessment |
|--------|-----------|
| Time in production (stUSDS) | **~13 months** (since Aug 25, 2025) |
| TVL | **$207.0M** — above rubric threshold for >$100M sustained |
| Liquidation history | `Clip.kicks() = 0` — the LSE auction and auction-to-`cut()` path has never executed |
| Underlying MCD core | 8+ years in production |
| stUSDS-specific incidents | **None** since launch |
| TVL stability | Steady growth from launch; no forced unwind or crisis |

**Historical Score: 2.5 / 5** — stUSDS has ~13 months of production and $207.0M of assets, which enters the rubric's 1–2 year Score-2 band. The score stays between Score 2 and Score 3 because the product's defining first-loss path has no production history: the Clipper has been stopped since two weeks after launch and has never started an auction (`kicks() = 0`). Under the conservative tie-break, this is scored 2.5 rather than 2.0.

**Cat 1 Score = (1.0 + 2.5) / 2 = 1.75 / 5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | UUPS upgradeable. Upgrades gated by `wards[PauseProxy]=1` with 48 h GSM delay |
| Vote / consensus | SKY token-weighted continuous-approval Chief voting. No multisig |
| Timelock | 48 h GSM delay (`MCD_PAUSE.delay = 172800`). Below the 7-day rubric Score-1 threshold |
| Emergency channel (Mom) | Can halt RateSetter, zero cap/line, remove buds **without GSM delay** (authority = Chief) |
| `cut()` channel | Can be called without a second GSM delay during enabled Clip auction settlement. With `stopped = 3` and `Due() = 0`, governance must first complete the timelocked restart |
| RateSetter facilitators | One active bud: a 2-of-3 Safe with bounded `set()` authority (16 h cooldown, no GSM delay). Scored as an operational role under Programmability per the rubric |
| Privileged roles | PauseProxy holds `wards[stUSDS]=1`, `wards[RateSetter]=1`, owns Mom. Can call `cut()` directly (with delay). Can upgrade implementation |
| EOA risk | None |

**Governance Score: 1.5 / 5** — Sky's Chief is one of the most decentralized governance systems in DeFi, meeting the Score-1 "fully decentralized DAO" criterion. However, stUSDS-specific governance features push the score up:
- **Mom emergency powers without GSM delay** — while defensive, this is a powerful immediate-action channel (Score-2 territory, approaching Score-3 for "powerful admin roles with limited constraints")
- **Clip settlement `cut()` has no second GSM delay** — the current stopped/no-auction state first requires an observable 48 h governance restart, but after restart individual auction residuals can be socialized immediately at settlement
- **48 h timelock** is below the Score-1 "7+ days" criterion
- **RateSetter bud is operational, not governance** — the 2-of-3 Safe cannot upgrade contracts, change roles, or widen its own bounds; those actions remain behind the 48 h GSM delay

Score 1.5: Scores well on overall DAO decentralization (Score 1) but the Mom emergency powers and low timelock push toward Score 2 territory. A conservative midpoint between Score 1 and Score 2.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Deposit / mint | Fully programmatic via ERC-4626 |
| Withdraw / redeem | Programmatic but gated by borrowing utilization |
| Exchange rate (`chi`) | Fully onchain, continuous accrual |
| Rate parameters (`str`, `duty`, `cap`, `line`) | **Actively managed** — set by the 2-of-3 RateSetter bud (16 h cooldown; 12 calls between July 23 and September 27, 2026) or PauseProxy (48 h). Not a static "set once" parameter like sUSDS's `ssr` |
| `cut()` loss socialization | Manual trigger (Clip auction settlement or governance) |
| Off-chain dependencies | RateSetter facilitators need off-chain algorithms to compute optimal rates |
| Keeper dependency | None for critical user flows; `drip()` is permissionless |

**Programmability Score: 3.0 / 5** — The system matches the rubric's hybrid onchain/admin-dependent band:
- The `str`, `duty`, `cap`, and `line` parameters require ongoing active management by facilitators or governance
- The `cut()` mechanism is a manual governance/auction action, not a pure algorithmic operation
- Most importantly, the live Clipper was fully stopped: level 3 disabled all auction starts, resets, and purchases. Restoring the critical liquidation backstop requires an authorized parameter transaction

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| USDS | Blue-chip underlying asset. Critical — stUSDS wraps USDS. USDS risk assessment: Score 1.3 (Minimal Risk) |
| MCD Core (VAT, Vow, Jug, etc.) | Sky's own infrastructure — battle-tested, 8+ years. Critical for accounting, yield generation, and governance |
| LockStake Engine V2 + Clip | SKY-collateralized borrowing infrastructure. Critical for stUSDS's risk-capital model |
| Conv (rates-conv) | Pure math contract, no state. Non-critical |
| Morpho Blue | External leverage venue — non-critical for stUSDS function, but `chi` cuts can liquidate borrowers and impair Morpho lenders |
| Chainlink / MCD Spot (OSM) | Mature multi-source oracle for LockStake collateral pricing. Indirect but critical for liquidation integrity |

**Dependencies Score: 3.0 / 5** — stUSDS depends critically on USDS, MCD accounting/governance, LockStake Engine V2, Clipper, and the SKY oracle path. The components are established or MCD-internal, but failure of the LockStake/Clip path directly exposes principal. That matches the rubric's Score-3 condition: multiple established dependencies with critical functions depending on them. The snapshot demonstrates that this is not theoretical because the configured Clipper was fully stopped.

**Cat 2 Score = (1.5 + 3.0 + 3.0) / 3 = 2.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Direct backing | 1:1 USDS backing at all times (over-backed at `chi > 1`) |
| USDS quality | USDS is the upgraded DAI, backed by Sky's full collateral book (Score 1.3 Minimal Risk). See [sky-usds.md](sky-usds.md) |
| Lending risk | USDS is lent to LockStake borrowers (SKY-backed, over-collateralized). Borrowers can default, triggering loss to stUSDS via `cut()` |
| First-loss position | stUSDS is **first-loss** capital — no buffer or insurance fund between borrowers and depositors |
| Collateral quality (borrower side) | SKY governance token — volatile, governance-dependent collateral. Lower quality than ETH/wstETH/WBTC used in traditional MCD CDPs |
| System CR (borrower side) | **Liquidation ratio (`mat`) = 120%**. SKY is priced through the $0.025 capped wrapper. Exact reconstruction found 12 unsafe urns with ~$70.89M debt, while the Clipper was fully stopped |
| Verifiability | Fully onchain for USDS backing. Complex for borrower-level solvency (requires reading per-urn positions in LockStake contracts) |
| Loss mechanism | `cut()` — permanent chi reduction. No insurance, no compensation path. Socialized to ALL stUSDS holders |

**Collateralization Score: 3.5 / 5** — the balance sheet is fully onchain, but its economic protection is materially weaker than the raw aggregate CR suggests:
- stUSDS is unbuffered first-loss capital against volatile SKY collateral
- 12 urns representing **44.4% of LSE debt** were already unsafe under the live capped feed
- the only configured auction path was fully stopped, so the protocol could neither start nor clear those liquidations
- the $0.0749 OSM price provided economic coverage, but a fall below $0.02516 begins principal shortfall in the first urn and losses can accumulate without programmatic disposal

This falls between the rubric's Score-3 mixed-quality collateral band and Score-4 impaired/illiquid protection band.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| stUSDS exchange rate (`chi`) | Fully onchain, pure function of `str` and time since `rho` |
| USDS backing (`totalAssets`) | Onchain via `totalAssets()` and `USDS.balanceOf(stUSDS)` |
| Withdrawal availability | Computable from onchain data (VAT ilk state + Clip.Due() + USDS balance) |
| Borrower solvency | Readable onchain but complex (requires aggregating LockStake per-urn positions) |
| RateSetter parameters | Fully onchain |
| Yield accrual | Permissionless `drip()` — anyone can trigger and verify |

**Provability Score: 1.5 / 5** — Excellent onchain transparency for the core metrics (chi, backing, withdrawal availability formula). The borrower-side solvency assessment is more complex but still onchain. Score 1.5: between "fully onchain, anyone can verify" (Score 1 — sUSDS lands here because it has no borrower complexity) and "mostly onchain, some offchain" (Score 2).

**Cat 3 Score = (3.5 + 1.5) / 2 = 2.5 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Direct ERC-4626 withdrawal (at `chi` rate, zero fee). Exists but is **gated by borrowing utilization** (~$47.3M / $207.0M = 22.9% available) |
| DEX liquidity | Curve stUSDS-USDS pool (TVL: ~$3.0M at [`0x2C7C98A3b1582D83c43987202aEFf638312478aE`](https://etherscan.io/address/0x2C7C98A3b1582D83c43987202aEFf638312478aE)). Morpho had ~$11.97M supplied and ~$10.41M borrowed against stUSDS, but borrowing against collateral is not a spot exit. The identified spot liquidity is shallow vs total assets ($207.0M) |
| Same-value asset | stUSDS/USDS is a yield-bearing stablecoin pair — minimal PPS divergence risk, but DEX price can deviate from `chi` under stress |
| Withdrawal restrictions | No cooldown, no queue, no per-user cap. But utilization-based gating is effectively a hidden restriction |
| Historical stress | No `cut()` events. ~13-month track record without a liquidity crisis |
| Large holder impact | A whale exiting >$47.3M would temporarily exhaust withdrawal capacity; subsequent withdrawals would be blocked until utilization drops |

**Score: 4.0 / 5** — The formal mechanism is ERC-4626, but the effective exit meets the rubric's Score-4 restricted-withdrawal band. At 77.1% utilization, only 22.9% of assets were liquid. The decisive reason for moving from the prior 3.5 midpoint to 4.0 is the disabled liquidation backstop: the system could not auction already-unsafe SKY collateral to recover USDS and restore withdrawal capacity. Key considerations:
- The largest holder's position represented ~20.3% of shares (~$41.9M at `chi`), about 89% of immediately withdrawable USDS; the top two holders together (~$63.9M) exceeded available withdrawals
- The RateSetter bud can raise `line` to or above total assets without the GSM delay, which would allow the remaining idle USDS to be borrowed
- **No throttle mechanism to speak of** — withdrawals stop cold, not gradually
- **DEX liquidity is insufficient** for large exits (the Curve secondary path would likely trade at a poor price if direct withdrawals are gated)
- Disabled liquidations prevent the normal borrower-side unwind that would otherwise restore USDS liquidity from unsafe positions

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Sky Foundation / MakerDAO — publicly known, established 2017 |
| Documentation | Comprehensive — developer docs, GitHub with 15+ explicit risk warnings, public chainlog, governance forum |
| Legal entity | Skybase International (Cayman Islands) |
| Incident response | Demonstrated for Black Thursday (2020) and USDC depeg (2023) |
| Bug bounty | $10M Immunefi, live 4+ years |
| Code quality | AGPL-3.0, Certora formal verification, Foundry tests, OpenZeppelin validation suite |

**Score: 1.0 / 5** — Top-tier operational maturity, consistent with the overall Sky ecosystem assessment.

### Final Score Calculation

**Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.75 | 20% | 0.350 |
| Centralization & Control | 2.5 | 30% | 0.750 |
| Funds Management | 2.5 | 30% | 0.750 |
| Liquidity Risk | 4.0 | 15% | 0.600 |
| Operational Risk | 1.0 |  5% | 0.050 |
| **Final Score** | | | **2.50 / 5.0** |

**Score justification notes:**
- **Audits & Historical (1.75):** Top-tier audits earn 1.0. ~13 months of production enters the 1–2 year band, but the never-exercised liquidation path keeps Historical at 2.5. Average = 1.75.
- **Centralization & Control (2.5):** Governance remains strong, but rate management is active through a 2-of-3 bud Safe and the borrower liquidation backstop requires governance to lower a persistent level-3 breaker. Critical dependencies include USDS, MCD, LockStake, Clipper, and the oracle path.
- **Funds Management (2.5):** stUSDS is transparent but unbuffered first-loss capital. Twelve unsafe urns carried ~$70.89M debt and could not be auctioned while the Clipper was stopped. The exact position set is now provable, but verifiability does not remove the economic risk.
- **Liquidity Risk (4.0):** Only ~$47.3M / 22.9% was immediately withdrawable, the largest holder alone could consume ~89% of it, and the top two exceeded it. Most importantly, the level-3 Clipper stop prevented the system from auctioning already-unsafe collateral to recover USDS and restore withdrawal capacity.
- **Operational Risk (1.0):** Top-tier team, documentation, bug bounty, and incident response.

The unrounded weighted result is **2.500**, recorded as **2.50 / 5.0**.

**Final Score: 2.50 / 5.0 — Medium Risk.** The largest current risk is the disabled auction backstop: at the snapshot, 44.4% of LSE debt sat in unsafe urns under the configured feed while the sole Clipper was fully stopped. No unsafe SKY collateral could be sold to recover USDS, restart required governance plus the 48 h Pause delay, and thin SKY market depth would remain a clearing constraint after restart. Strong audits, governance, and onchain transparency prevent a higher score. The separate Morpho USDC-lender exposure requires the enhanced controls described in this report and the monitoring plan.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| 1.50–2.49 | Low Risk | Approved with standard asset monitoring |
| **2.50–3.49** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk (2.50 / 5.0) — Approved with enhanced monitoring**

---

## Appendix B: SKY Price Crash — Liquidation & Bad Debt Simulations

This appendix separates three events that must not be conflated:

1. a SKY price decline makes an individual LSEV2 urn unsafe;
2. a SKY auction exhausts its collateral without recovering the urn's original debt, causing `stUSDS.cut()` and a permanent `chi` reduction; and
3. that `chi` reduction makes individual Morpho borrowers liquidatable and, after a sufficiently large same-block gap, can create Morpho lender bad debt.

SKY price alone does not determine realized bad debt. LSE bad debt depends on each urn's collateral and debt plus auction execution; Morpho effects depend on each borrower's LTV at the moment `chi` falls.

### Baseline Data (snapshot block 26069994, September 27, 2026)

| Metric | Value | Source |
|--------|-------|--------|
| Underlying SKY OSM price | $0.0749 | [`PIP_SKY`](https://etherscan.io/address/0x511485bBd96e7e3a056a8D1b84C5071071C52D6F) current value read from storage (`peek()` is whitelist-gated); source feed [`FLAP_SKY_ORACLE`](https://etherscan.io/address/0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff) |
| LSE capped-oracle price | **$0.0250** | [`LockstakeCappedOsmWrapper.cap()`](https://etherscan.io/address/0x0C13fF3DC02E85aC169c4099C09c9B388f2943Fd); the [verified source](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeCappedOsmWrapper.sol#L132-L148) returns `min(OSM, cap)` |
| SKY total reported 24h trading volume | $16.69M | [CoinGecko](https://www.coingecko.com/en/coins/sky), September 27, 2026; this is not Ethereum DEX-only volume |
| SKY market cap | $1.78B | CoinGecko, September 27, 2026 |
| Total SKY locked in active urns | **~17.472B SKY** | [`lsSKY.totalSupply()`](https://etherscan.io/address/0xf9A9cfD3229E985B91F99Bc866d42938044FFa1C); `Clip.Due() = 0`, so no auction lots needed to be added |
| Raw `SKY.balanceOf(engine)` | ~10.311B SKY | [`SKY.balanceOf(LockStakeEngine)`](https://etherscan.io/token/0x56072C95FAA701256059aa122697B133aDEd9279?a=0xCe01C90dE7FD1bcFa39e237FE6D8D9F569e8A6a3); excludes SKY moved to vote delegates and must not be used as total collateral |
| Collateral value at OSM price | **~$1.309B** | 17.472B × $0.0749 |
| Collateral value at capped LSE feed | **~$436.8M** | 17.472B × $0.025 |
| Total debt (LSEV2-SKY-A) | **~$159.661M** | [`vat.ilks("LSEV2-SKY-A").Art × rate`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) |
| Aggregate CR at OSM price | **~820.1%** | $1.309B / $159.661M |
| Aggregate CR at capped LSE feed | **~273.6%** | $436.8M / $159.661M |
| Liquidation ratio (`mat`) | **120%** | `MCD_SPOT.ilks("LSEV2-SKY-A").mat` |
| Liquidation penalty (`chop`) | **13%** | `Dog.ilks("LSEV2-SKY-A").chop = 1.13` |
| Per-ilk active-auction limit (`hole`) | **250,000 USDS** | `Dog.ilks("LSEV2-SKY-A").hole`; maximum debt-plus-fees targeted by concurrently active auctions, not an amount per cooldown. `dirt = 0` |
| Clipper breaker | **`stopped = 3`**, `kicks() = 0` | Disables `kick`, `redo`, and `take`; set in [this Sep 8, 2025 transaction](https://etherscan.io/tx/0x0032e26b8e4b284e3c61ea8aeb0870e3f0dbb7d3173945faf0449ca6ec5138e8) and not lowered through the snapshot |
| Exact urn set | **6,690 opened / 3,096 active / 42 debt-bearing** | Reconstructed from every engine `Open` event and pinned `vat.urns()` reads; [`analysis script`](https://github.com/yearn/risk-score/blob/master/reports/scripts/analyze_lse_snapshot.mjs) |
| stUSDS total assets | **$207.0M** | `stUSDS.totalAssets()` |
| stUSDS withdrawal availability | **$47.3M** (22.9% idle) | Computed from `totalAssets − (Art×rate + Due)` |
| Morpho stUSDS markets | **~$11.97M supplied / ~$10.41M borrowed** | [`Morpho.market(id)`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) across the five market IDs |

`SKY.balanceOf(engine)` is incomplete because the engine can transfer SKY to a selected vote delegate while retaining the same VAT collateral credit. The [engine lock path](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeEngine.sol#L291-L308) mints one `lsSKY` per SKY locked; at this snapshot there were no active auctions, making `lsSKY.totalSupply()` the reconciled locked-collateral measure. When `Clip.Due() > 0`, monitoring must also add each active auction's unsold `lot` because `lsSKY` is burned when an urn is kicked.

### Per-Urn SKY Price Sensitivity

The position reconstruction reconciles to **17.472410030B SKY** and **$159.6613024M debt**, matching `lsSKY.totalSupply()` and VAT ilk debt. The most leveraged urn held 68.23M SKY against $1.717M debt: its 120%-CR liquidation threshold was **$0.0301974**, above the $0.025 capped feed, and its principal-parity price was **$0.0251645**. It was therefore already unsafe under the configured feed. Across the book, **12 urns carrying $70.887M debt were unsafe at the snapshot**, but `stopped = 3` prevented them from entering auctions.

| SKY Market Price | Drop from $0.0749 | LSE Feed | Aggregate CR | Unsafe Urns / Debt | Idealized Principal Shortfall | Implied `chi` Loss |
|-----------------:|------------------:|---------:|-------------:|-------------------:|-------------------------------:|-------------------:|
| $0.0749 | 0% | $0.0250 cap | 273.6% | 12 / $70.89M | $0 at current market clearing value | 0% |
| $0.0375 | 50.0% | $0.0250 cap | 273.6% | 12 / $70.89M | $0 | 0% |
| **$0.0250** | **66.6%** | **$0.0250** | **273.6%** | **12 / $70.89M** | **$11,226** | **0.005%** |
| $0.0227 | 69.7% | $0.0227 | 248.4% | 16 / $71.47M | $177.9K | 0.09% |
| $0.0190 | 74.6% | $0.0190 | 207.9% | 24 / $100.49M | $8.97M | 4.33% |
| $0.0152 | 79.7% | $0.0152 | 166.3% | 34 / $158.41M | $25.30M | 12.22% |
| $0.01097 | 85.4% | $0.01097 | 120.0% | 40 / $158.84M | $59.98M | 28.98% |
| $0.00914 | 87.8% | $0.00914 | 100.0% | 40 / $158.84M | $76.45M | 36.94% |

The idealized shortfall is `Σ max(debt_i − collateral_i × marketPrice, 0)`. It assumes every underwater urn ultimately clears at the stated market price, with no additional auction slippage. It is not a prediction of immediate `cut()` size—especially while the Clipper is stopped—but it bounds the principal deficit embedded in the reconstructed book.

### When LSE Bad Debt Reaches stUSDS

Normally an unsafe urn can be barked into an auction, but that event alone does not reduce `chi`. [`LockstakeClipper.kick()`](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeClipper.sol#L240-L280) tracks `due = tab / chop`, representing original debt without the liquidation penalty. While the auction is active, `Due()` replaces the removed VAT debt in the stUSDS withdrawal check and reduces withdrawable liquidity. At this snapshot, however, `stopped = 3` made `kick`, `redo`, and `take` revert. Unsafe debt therefore remained in VAT rather than being auctioned, and no automatic Clip-originated `cut()` could occur until governance lowered the breaker.

The irreversible loss occurs only when an auction exhausts its SKY collateral and the remaining original `due` exceeds the final auction payment `owe`; the [clipper then calls `stUSDS.cut(due - owe)`](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeClipper.sol#L430-L448). Ignoring auction timing and slippage, the per-urn principal shortfall at clearing price `p` is:

`LSE bad debt_i = max(debt_i − SKY collateral_i × p, 0)`

Actual loss can be higher if SKY falls while auctions wait or clear below the reference price. It can be lower or zero if keepers clear auctions before collateral value falls below original debt. The aggregate $0.00914 parity price is therefore **not** the first-bad-debt price.

For realized LSE loss `B`, the [`stUSDS.cut()` implementation](https://github.com/sky-ecosystem/stusds/blob/master/src/StUsds.sol#L250-L259) reduces total assets and `chi` proportionally:

`chi loss fraction ≈ B / stUSDS totalAssets`

At the snapshot, each 1% `chi` cut corresponds to approximately **$2.070M** of realized LSE bad debt.

### Morpho Contagion From a `chi` Cut

All five Morpho oracles follow stUSDS `chi`, so a loss is reflected in collateral values in the same block. Morpho's [liquidation implementation](https://github.com/morpho-org/morpho-blue/blob/main/src/Morpho.sol#L347-L415) and [constants](https://github.com/morpho-org/morpho-blue/blob/main/src/libraries/ConstantsLib.sol) give the 86% LLTV markets a liquidation incentive factor of:

`LIF = min(1.15, 1 / (1 − 0.3 × (1 − 0.86))) ≈ 1.04384`

A borrower becomes liquidatable when `LTV / (1 − chiLoss) > 86%`. If a liquidator seizes all collateral, Morpho realizes lender bad debt when the post-cut LTV exceeds `1 / LIF ≈ 95.8%`.

The following results use all 22 non-zero borrower positions reconstructed from `Borrow` events and `Morpho.position()` at snapshot block 26069994, with borrow shares converted using the pinned market state. The highest LTV was 85.19% ([`0xae0a739c3724bB5Cd2bDCF73764c87a5A6eC21a3`](https://etherscan.io/address/0xae0a739c3724bB5Cd2bDCF73764c87a5A6eC21a3), ~$2.80M USDC debt):

| Instantaneous `chi` Loss | Realized LSE Loss Implied | Morpho Debt Liquidatable | Modeled Morpho Bad Debt |
|-------------------------:|--------------------------:|-------------------------:|--------------------------:|
| **0.940%** | **$1.945M** | **First position: ~$2.80M** | $0 |
| 1.0% | $2.070M | ~$2.80M | $0 |
| 2.0% | $4.140M | ~$2.80M | $0 |
| 3.0% | $6.210M | ~$7.20M | $0 |
| 5.0% | $10.35M | ~$7.80M | $0 |
| 10.0% | $20.70M | ~$7.84M | $0 |
| **11.073%** | **$22.92M** | ~$7.84M | **First position reaches bad-debt boundary** |
| 12.0% | $24.84M | ~$7.84M | ~$29.2K |
| 20.0% | $41.40M | ~$8.09M | ~$0.70M |

Combining the exact LSE shortfall curve with these Morpho thresholds gives the requested end-to-end boundaries under the idealized clearing assumption:

- **First LSE principal shortfall:** SKY below **$0.0251645** (−66.42% from $0.0749).
- **First Morpho liquidation caused by a realized LSE loss:** approximately **$1.945M** of LSE loss / 0.940% `chi` cut, reached at SKY **$0.0211407** (−71.79%).
- **First modeled Morpho lender bad debt:** approximately **$22.921M** of LSE loss / 11.073% `chi` cut, reached at SKY **$0.0156430** (−79.13%).

These thresholds are sequential, not equivalent. An LSE principal shortfall first reduces the stUSDS exchange rate when the Clipper [calls `cut()` for an auction's unrecovered residual](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeClipper.sol#L430-L448); Morpho lenders incur bad debt only if that impairment is large enough that a [Morpho liquidation](https://github.com/morpho-org/morpho-blue/blob/main/src/Morpho.sol#L347-L415) exhausts a borrower's stUSDS collateral while USDC debt remains.

Because the Clipper was fully stopped, these SKY prices describe latent economic shortfall, not automatic realization timing. Loss could be crystallized discontinuously after a governance restart and auction clearing, or directly through a governance `cut()`.

### Governance Restart Delay and SKY Auction Depth

The governance-delay concern is directionally correct, with two qualifications. First, the 48 h delay does not itself create accounting bad debt: it creates a window in which **economic principal shortfall can accumulate** because unsafe positions cannot be auctioned. The loss reaches stUSDS only when an eventual auction fails to recover original debt and calls `cut()`, or governance calls `cut()` directly. Second, the response time is not merely 48 hours from a price move. Under the current permissions, governance must first agree and schedule a spell; only then does the [MCD Pause](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) enforce its 172,800-second delay before PauseProxy can execute the Clipper's [`auth`-gated breaker setter](https://github.com/sky-ecosystem/lockstake/blob/master/src/LockstakeClipper.sol#L125-L144). Neither StUsdsMom nor another currently authorized emergency module exposes an immediate restart call.

A point-in-time liquidity check at the [snapshot block 26069994](https://etherscan.io/block/26069994) found:

| SKY liquidity metric | Live value | Interpretation |
|---|---:|---|
| Ethereum DEX pair liquidity, summed headline value | **~$21.01M** | Across 18 pairs returned by [DEX Screener](https://api.dexscreener.com/token-pairs/v1/ethereum/0x56072C95FAA701256059aa122697B133aDEd9279). Includes both SKY and quote-side inventory; not all is executable through a crash |
| Ethereum DEX 24 h volume | **~$1.99M** | The ~$70.89M debt in the 12 urns unsafe at the capped feed was equivalent to ~36 days of that volume; this is a scale comparison, not a clearing-time forecast |
| Dominant Uniswap V2 SKY/USDS pool ([`0x2621…9e3c`](https://etherscan.io/address/0x2621CC0B3F3c079c1Db0E80794AA24976F0b9e3c#readContract)) | **62.30M SKY + 4.737M USDS** (~$9.47M total) | The USDS side, not total pool TVL, is the immediate direct-pool exit reserve. [Market view](https://dexscreener.com/ethereum/0x2621cc0b3f3c079c1db0e80794aa24976f0b9e3c) |
| Direct-pool $250K SKY sale at current spot | **~$236.8K USDS out / 5.28% impact** | Uses the pool's constant-product formula and 0.30% fee; $250K matches the current `Dog.hole` reference size |
| Direct-pool $1M SKY sale at current spot | **~$823.7K USDS out / 17.63% impact** | Illustrates nonlinear depth; routing across other pools can improve execution but concentrated liquidity may disappear as price moves |
| Direct-pool $5M SKY sale at current spot | **~$2.429M USDS out / 51.42% impact** | Stress illustration only, not a prediction that one auction sells this amount |

This comparison does **not** assume all ~$70.89M of unsafe debt is auctioned or market-sold at once. `Dog.hole = $250,000` limits concurrently active debt-plus-fee target and therefore stages liquidations; keepers may warehouse SKY, hedge on centralized venues, or source USDS without immediately selling onchain. However, staging does not solve the underlying capacity problem: it extends the time needed to clear a large backlog, while SKY can continue falling. Even the reference-size tranche already exceeds a 5% direct-pool impact threshold, current DEX volume is low, and the headline $21.01M includes SKY-side inventory. **Materially more durable quote-side liquidity and keeper capital would be needed for confidence that a large post-restart liquidation backlog can clear near oracle value.**

### Key Assumptions & Caveats

1. **Aggregate CR masks individual leverage.** LSE liquidation is per urn. Aggregate thresholds are structural reference points, not predictions that all positions liquidate together.

2. **Auction execution was disabled, not merely uncertain.** `stopped = 3` prevented `kick`, `redo`, and `take`. Under current permissions, governance cannot restore it until a scheduled spell completes the 48 h Pause delay. If governance re-enables the Clipper, subsequent execution remains path-dependent on keeper availability, oracle validity, gas conditions, and SKY depth.

3. **`Dog.hole` limits concurrent auction target, not debt per cooldown.** At $250,000, new `bark()` calls can be constrained when per-ilk `dirt` approaches `hole`; capacity returns as auction payments call `Dog.digs()`. Throughput depends on how fast keepers take auctions, not a fixed reset interval.

4. **Morpho results model an instantaneous gap.** In practice, borrowers or liquidators may act after smaller cuts, so positions can be repaid or collateral sold before the 11.156% first-bad-debt boundary. Conversely, withdrawal gating and limited Curve depth may reduce liquidation profitability.

5. **The Morpho liquidation path is conditional.** A liquidator receives stUSDS and can redeem to USDS only up to `maxWithdraw`; otherwise it must hold stUSDS or sell through Curve. Morpho itself does not provide a spot exit, and the LitePSM path begins only after a successful stUSDS redemption.

6. **No historical stress test.** stUSDS has never experienced a `cut()` event (chi reduction) or a mass LockStake liquidation. The SKY token has not experienced a >50% drawdown since stUSDS deployment. These simulations are theoretical and based on onchain parameters.

- **Time-based:** Reassess in 6 months (March 2027) or earlier if utilization or TVL change materially
- **TVL-based:**
  - stUSDS `totalAssets()` drops >30% from snapshot ($207.0M → <$145M) — would indicate material depositor exit or loss event
  - stUSDS `totalAssets()` grows >3× ($207.0M → >$621M) — would increase systemic footprint materially
- **Utilization-based:**
  - LSEV2-SKY-A utilization (`Art * rate / totalAssets`) exceeds **95%** — withdrawal capacity critically low (<$10.4M)
  - LSEV2-SKY-A utilization drops below **50%** — would indicate borrowers are deleveraging; reassess risk profile
- **Parameter-based:**
  - `stUSDS.str()` changes by >200 bps APY — material yield change
  - `stUSDS.cap()` or `stUSDS.line()` changes by >30% — material capacity change
  - RateSetter `tau` (cooldown) changes — affects rate-change governance speed
  - RateSetter config (`strCfg`, `dutyCfg`) bounds change — affects rate-setting flexibility
  - `MCD_PAUSE.delay()` reduced below 48 h — governance speed increases
  - New RateSetter `buds` added, or the bud Safe's owners, threshold, modules, or guard change — expands or alters the facilitator surface
  - RateSetter `set()` raises `stUSDS.line` to or above `totalAssets()` — removes the idle-USDS withdrawal floor
- **Incident-based:**
  - **Any `cut()` call on stUSDS** — loss socialization event; immediate reassessment required
  - **Any `chi()` decrease** — permanent holder impairment
  - **Any Clipper breaker change** — `stopped > 0` restricts liquidation; level 3 disables all `kick`, `redo`, and `take`. Reassess immediately when lowered because accumulated unsafe debt can enter auctions
  - **Any Mom emergency action** (`DissRateSetterBud`, `HaltRateSetter`, `ZeroCap`, `ZeroLine`) — emergency response or governance crisis
  - RateSetter `bad` set to 1 — circuit breaker triggered
  - Any LockStake Engine V2 exploit or governance attack
  - Any USDS depeg >±1% sustained for >24 h — underlier stress propagates to stUSDS
  - Any LSEV2-SKY-A liquidation spike — borrower distress signal
  - stUSDS implementation upgrade — new code to re-audit
- **Governance-based:**
  - SKY voter concentration changes materially (any single supporter exceeds 50% of Chief approvals)
  - Any stUSDS-specific governance spell is proposed or scheduled — decode it immediately. A queued direct `cut()` is a critical exit signal with at least the 48 h Pause window after scheduling
  - New LockStake Engine version deployed — changes borrower-side dynamics

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [July 25, 2026](https://github.com/yearn/risk-score/pull/344) | 2.5 | Initial and corrected assessment. All 6,244 opened LSE urns and 15,571 stUSDS transfers were reconstructed at block 25595151. Eleven unsafe urns carried ~$70.01M debt while `Clip.stopped() = 3` had disabled `kick`, `redo`, and `take` since Sep 8, 2025. Holder concentration: top-1 15.71%, top-5 45.41%. Confirmed `Clip.stopped() = 3` persisted through block 25609984; restart requires PauseProxy governance spell + 48 h Pause delay. SKY DEX depth: ~$19.11M headline Ethereum liquidity, ~$0.80M 24 h volume, ~$4.14M USDS in dominant pool; $250K sale modeled ~5.97% impact. Score raised to 2.5 (Low Risk, upper boundary under the repository-wide tier convention). Reviewer follow-up: compounded `str` APY to 6.48%, production age ~11 months, exact Morpho market IDs and stUSDS-holder/USDC-lender scope distinction, LitePSM USDS→USDC liquidation route, ChainSecurity bad-debt/slashing/withdrawal-risk notes, decoded-spell and Curve stUSDS/USDS executable-depth monitoring, primary Morpho market 90% IRM utilization target. |
| [July 27, 2026](https://github.com/yearn/risk-score/pull/350) | 2.55 | Liquidity Risk increased from 3.5 to 4.0. The report now identifies the persistent level-3 Clipper stop as the largest current risk: already-unsafe SKY positions could not be auctioned to recover USDS or restore withdrawal capacity, restart required governance plus the 48 h Pause delay, and thin SKY market depth remained a post-restart clearing constraint. A fresh full scan at block 25624658 found 36 debt-bearing urns, including 11 unsafe urns carrying ~$70.064M debt; only two were below principal parity at the capped feed, with about $11,590 of idealized shortfall. |
| [September 27, 2026](https://github.com/yearn/risk-score/pull/493) | 2.50 | Reassessment at block 26069994. Audits & Historical improved from 2.0 to 1.75: production reached ~13 months (Historical 3.0 → 2.5, held above 2.0 because `Clip.kicks() = 0`). Correction: RateSetter bud `0xBB86…EA16` (2-of-3 Safe) has been active since Sep 8, 2025 and made 12 `set()` calls since July 23; scored under Programmability (unchanged 3.0). `Clip.stopped() = 3` persists; 12 urns / ~$70.89M debt unsafe at the $0.025 cap. Total assets $207.0M, 77.1% utilization, $47.3M withdrawable; top holder 20.25%. Morpho exposure ~$11.97M supplied / ~$10.41M borrowed. |
