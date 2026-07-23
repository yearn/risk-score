# Protocol Risk Assessment: Sky — stUSDS (Staked USDS)

- **Assessment Date:** July 23, 2026
- **Token:** stUSDS (Staked USDS)
- **Chain:** Ethereum
- **Token Address:** [`0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9)
- **Final Score: 1.9/5.0**

## Overview + Links

**stUSDS (Staked USDS)** is Sky Protocol's risk-capital yield token — a separate product from **sUSDS** (Savings USDS). Where sUSDS earns the passive Sky Savings Rate (SSR), stUSDS funds **SKY-backed borrowing** through the LockStake Engine V2 and absorbs first-loss risk from borrower defaults in exchange for a higher, actively managed yield (the **stUSDS Rate**, or `str`). stUSDS is deployed as a UUPS-upgradeable ERC-4626 vault wrapping USDS.

The architecture pits stUSDS depositors (risk-capital providers) against SKY-staking borrowers. Deposited USDS is lent out to borrowers in the `LSEV2-SKY-A` ilk (LockStake Engine V2), where it can be borrowed against locked SKY governance tokens. Yield accrues continuously via the `str` rate, funded by `vat.suck()` against the Vow. Borrowed USDS is protected by over-collateralized SKY positions; if a borrower defaults, the loss is socialized to stUSDS holders through the `cut()` mechanism — stUSDS's `chi` (rate accumulator) is reduced, permanently impairing all holders.

Because stUSDS deposits are lent out, **withdrawals are constrained** by the debt ceiling and current borrowing utilization. At the snapshot, ~$187.5M USDS is deposited, with ~$156.4M borrowed (83.4% utilization), leaving ~$31.1M available for withdrawal. This is a fundamental liquidity risk absent from sUSDS.

The **StUsdsRateSetter** contract enables governance-appointed facilitators (`buds`) to adjust the stUSDS supply rate (`str`), the borrower rate (`duty` on the ilk), the supply cap (`cap`), and the debt ceiling (`line`) within predefined bounds, with a 16-hour cooldown between changes. The **StUsdsMom** provides emergency halt capabilities without the standard 48 h GSM delay.

**Key onchain metrics (July 23, 2026, block 25595151):**

| Metric | Value |
|--------|-------|
| stUSDS total supply (`totalSupply()`) | **176,034,192 stUSDS** (176M shares) |
| stUSDS total assets (`totalAssets()`) | **187,538,821 USDS** (~$187.5M) |
| stUSDS price-per-share (`chi`) | 1.06535 USDS/stUSDS |
| stUSDS supply rate (`str`) | `1.00000000199096233` RAY → **~6.28% APY** |
| stUSDS supply cap (`cap`) | 211,000,000 USDS (~$211M) |
| stUSDS debt ceiling (`line`) | 187,500,000 RAD (~$187.5M) |
| USDS held by stUSDS contract | **187,538,252 USDS** |
| LSEV2-SKY-A normalized debt (`Art`) | 134,968,424 (~135M) |
| LSEV2-SKY-A accumulated rate (`rate`) | 1.15871 RAY → actual debt ~$156.4M |
| LSEV2-SKY-A ilk debt ceiling (`line`) | ~187.5M RAD |
| Withdrawal availability | ~$31.1M USDS (16.6% of total assets) |
| Current block / timestamp | 25595151 / 1784806426 (Jul 23, 2026) |

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

All addresses verified onchain at block **25595151** (July 23, 2026) unless otherwise noted.

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
| USDS | [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) | Underlying asset. stUSDS holds 187.5M USDS |
| USDS Join | [`0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) | Mints/burns USDS against VAT. Called by stUSDS for yield accrual (`usdsJoin.exit`) |
| MCD VAT (core ledger) | [`0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) | `vat.suck(vow, stUSDS, diff)` funds yield from Vow. Holds ilk `LSEV2-SKY-A` debt |
| MCD Jug | [`0x19c0976f590D67707E62397C87829d896Dc0f1F1`](https://etherscan.io/address/0x19c0976f590D67707E62397C87829d896Dc0f1F1) | Stability fee accumulator; `jug.drip(ilk)` called on each deposit/withdraw to update debt |
| MCD Vow | [`0xA950524441892A31ebddF91d3cEEFa04Bf454466`](https://etherscan.io/address/0xA950524441892A31ebddF91d3cEEFa04Bf454466) | Surplus buffer; source of yield via `vat.suck(vow, stUSDS, diff)` |
| Clip (LSEV2-SKY-A) | [`0x836F56750517b1528B5078Cba4Ac4B94fBE4A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399) | Liquidation module for LSEV2-SKY-A. `Due()` tracks pending auction value; `cut()` calls originate from or are compatible with Clip |
| LockStake Engine V2 | (multiple contracts) | The SKY-staking borrowers. Borrow USDS from LSEV2-SKY-A ilk against locked SKY |

### Governance (shared with all Sky contracts)

| Contract | Address | Role |
|----------|---------|------|
| **MCD PauseProxy** | [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) | Holds `wards[stUSDS]=1`, `wards[RateSetter]=1`, owns Mom. Upgrades stUSDS implementation |
| **MCD Chief** | [`0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) | Continuous-approval governance. `hat()` elects active spell |
| **MCD Pause** | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | DSPause with `delay() = 172800` (48 h GSM delay). `owner = address(0)` |

### Morpho Blue Markets (stUSDS as collateral)

At the snapshot, there are five Morpho Blue markets using stUSDS as collateral. The most active:

| Market | Oracle | Supply | Borrow | Utilization | LLTV |
|--------|--------|--------|--------|-------------|------|
| stUSDS/USDC (`0xba3D…9DD0`) | [`0xba3D2Dc1670763c6729CC923A922C7513C0f9DD0`](https://etherscan.io/address/0xba3D2Dc1670763c6729CC923A922C7513C0f9DD0) | ~$20,950 | ~$17,208 | ~82% | 86% |
| stUSDS/USDS (`0x0A97…454C`) | [`0x0A976226d113B67Bd42D672Ac9f83f92B44b454C`](https://etherscan.io/address/0x0A976226d113B67Bd42D672Ac9f83f92B44b454C) | ~$1,248,500 | ~$1,123,568 | ~90% | 86% |
| stUSDS/USDC (`0x3699…Dc5`) | [`0x3699ABA2d63532A0890A761CAd609D128A631Dc5`](https://etherscan.io/address/0x3699ABA2d63532A0890A761CAd609D128A631Dc5) | 0 | — | inactive | 86% |
| stUSDS/USDC (`0x9D27…5FB5`) | [`0x9D278a48bDC6591D99C1bc1Cdb27775097105FB5`](https://etherscan.io/address/0x9D278a48bDC6591D99C1bc1Cdb27775097105FB5) | ~$2 | 0 | inactive | 86% |
| stUSDS/USDT (`0x9C56…3B3c`) | [`0x9C56D403d26C0aE00FA2e767e12F6b588c203B3c`](https://etherscan.io/address/0x9C56D403d26C0aE00FA2e767e12F6b588c203B3c) | ~$539,595 | ~$479,504 | ~89% | 86% |

**Oracle type for all stUSDS Morpho markets:** All five oracle contracts return price values based on the stUSDS `chi()` rate accumulator. The stUSDS/USDS oracle returns the `chi` value directly at 1e36 scale (~1.065e36). The stUSDS/USDC oracles return `chi` scaled to the loan-token's decimals (~1.065e24 for USDC markets, ~1.065e24 for USDT). These are **rate-feeding oracles** (no Chainlink component) — the price is derived from stUSDS's onchain `chi` accumulator, not from an external market-data feed. For the USDC and USDT pairs, a separate conversion layer maps the stUSDS/USD rate into the loan-token unit. Verified onchain at block 25595151.

## Audits and Due Diligence Disclosures

### stUSDS Audit History

The stUSDS codebase (`sky-ecosystem/stusds`) has been audited by two top-tier firms, with formal verification via Certora:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| **ChainSecurity** | Aug 12, 2025 | Initial stUSDS audit | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20250812-ChainSecurity_Sky_stUSDS_audit.pdf) |
| **Cantina** | Aug 18, 2025 | stUSDS review | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20250818-cantina-report-sky-stusds.pdf) |
| **ChainSecurity** | Apr 10, 2026 | Second stUSDS audit (post-update) | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20260410-ChainSecurity_Sky_SkyStUSDS_Audit.pdf) |
| **Cantina** | May 4, 2026 | StUsdsMom audit | [PDF](https://github.com/sky-ecosystem/stusds/blob/master/audit/20260504-cantina-report-sky-stusdsmom.pdf) |

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
- **Time in production:** ~10 months at snapshot
- **stUSDS TVL:** ~$187.5M in total assets at snapshot; has grown steadily from launch. Sky Lending TVL (includes sUSDS + stUSDS) is ~$6.12B on DefiLlama ([source](https://defillama.com/protocol/sky-lending))
- **Underlying Sky/MCD core:** 8+ years in production (since December 2017)
- **stUSDS-specific security incidents:** **None** since launch
- **Past security incidents in Sky ecosystem:**
  - **Black Thursday (March 12, 2020)** — DAI/MCD liquidation auction failures (~$6M shortfall, recapped via MKR mint). Liquidation redesign followed
  - **USDC depeg (March 2023)** — DAI tracked USDC down to ~$0.88. Would similarly impact stUSDS via USDS. Sky diversifying into RWAs since
- **stUSDS price history:** The `chi` accumulator has grown from 1.0 RAY at inception to 1.06535 RAY at snapshot, representing ~6.5% cumulative return over its lifetime. No chi-reduction (`cut()`) events have occurred
- **TVL concentration:** Top holder enumeration requires Etherscan API Pro tier (not available). All known Sky governance addresses (PauseProxy, Chief, Mom) hold 0 stUSDS, consistent with the permissionless deposit model. DefiLlama confirms stUSDS price of $1.065 ([source](https://coins.llama.fi/prices/current/ethereum:0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9))

## Funds Management

### How stUSDS Works — Fund Flow Architecture

```
DEPOSIT (USDS → stUSDS):
  User calls stUSDS.deposit(assets) or mint(shares)
  → _mint() transfers USDS from user to stUSDS
  → Mints stUSDS shares at current chi rate
  → Checks cap (max 211M USDS total supply)
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
| USDS → stUSDS (deposit) | Permissionless | Yes (1 tx) | 0 | `cap` = 211M USDS max supply |
| stUSDS → USDS (withdraw) | Permissionless | Yes (1 tx) | 0 | **Constrained by available idle funds** (~$31.1M at snapshot) |
| Cut (loss socialization) | **Auth-gated** (wards/PauseProxy) | N/A | 0 (loss event) | Reduces chi for all holders |
| Yield accrual (`drip`) | Permissionless (anyone can call) | N/A | Gas cost only | — |

**Critical distinction from sUSDS:** stUSDS is **not** a 1:1 liquid vault. Withdrawals are constrained by the borrowing pool's utilization. At the snapshot, only ~16.6% of deposited USDS is withdrawable. If utilization reaches 100%, no withdrawals are possible. This is a fundamental architectural difference from sUSDS, where all deposits are always withdrawable.

### Token Mint Authority

**Mint mechanism:** Permissionless ERC-4626 deposit — any user can mint stUSDS by depositing USDS, subject to the `cap` supply limit. There is **no privileged minting role** on stUSDS. No address can mint stUSDS out of thin air; every stUSDS is backed by a corresponding USDS deposit.

**Mint requires backing:** Yes — `_mint()` atomically transfers USDS from the depositor to the stUSDS contract in the same transaction.

**Per-address mint authority** (verified onchain on July 23, 2026, from stUSDS at `0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any user | ✓ (via deposit) | ✓ (via withdraw/redeem) | Permissionless ERC-4626 | Must transfer USDS; gated by cap and withdrawal availability |
| PauseProxy (`0xBE8E…98FB`) | — | — | `wards[stUSDS]=1` | Can upgrade implementation, call `cut()`, `file()` parameters |

**Rate limits / supply caps:**
- Global supply cap: `cap = 211,000,000 USDS` (211M), adjustable by governance
- No per-user or per-transaction limits
- No cooldown on deposits or withdrawals

**Backing check at mint time:** Atomic — depositor's USDS is transferred to stUSDS contract in the same `_mint()` call. Supply is fully backed at all times. The *quality* of backing (lent vs idle) is what varies.

### Collateralization

stUSDS is **not directly collateralized by external assets** in the way a lending protocol or stablecoin might be. Rather:

1. **Every stUSDS is backed 1:1 by USDS** held in the stUSDS contract (at `chi > 1`, the backing exceeds 1:1 due to accumulated yield)
2. **The USDS held by stUSDS is partially lent** to LockStake Engine V2 borrowers. The loans are over-collateralized by locked SKY tokens (specific liquidation ratios are set by Sky governance for the LSEV2-SKY-A ilk)
3. **If a borrower defaults**, the loss cascades to stUSDS holders via `cut()`. There is no separate insurance fund or buffer — stUSDS **is** the first-loss capital
4. **System-wide solvency** for stUSDS depends on: (a) LockStake borrower over-collateralization holding, (b) the Clip liquidation module functioning correctly, and (c) governance not abusing the `cut()` capability

At the snapshot, using the VAT ilk state for LSEV2-SKY-A:
- Actual borrow utilization: $156.4M / $187.5M = **83.4%**
- The LSEV2-SKY-A `line` is set by stUSDS dynamically but capped by the RateSetter's `maxLine`
- The `dust` parameter (30,000 RAD) prevents dust loans from persisting

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
| RateSetter facilitators (`buds`) | ✅ Onchain | `rateSetter.buds(addr)` — individual address checks. No active buds found at snapshot (all known governance addresses returned 0); no recent `Kiss`/`Diss` events. Rate changes currently require governance spells (48 h GSM). See Governance section below |
| LockStake Engine V2 solvency | ⚠️ Complex | Requires aggregating per-urn positions in the LockStake contracts |

**Key transparency note:** The withdrawal-gating formula (`Art * rate + clip.Due() + assets <= totalSupply * chi`) is computed atomically at withdrawal time. Users can simulate it before submitting. The formula is fully onchain but requires multiple contract reads (stUSDS + VAT + Jug + Clip).

## Liquidity Risk

### Primary Mechanism: Direct ERC-4626 Withdrawal

- **Atomic 1:1 redemption** (at current `chi` rate). No fee, no cooldown
- **Constrained by borrowing utilization** — at snapshot, only ~$31.1M of ~$187.5M is idle and available for withdrawal
- **In the worst case** (100% utilization + borrower defaults), 0 USDS would be withdrawable — holders would need to wait for either: (a) borrowers repaying loans, (b) governance reducing the debt ceiling to encourage repayment, or (c) liquidation of defaulted borrowers
- **No withdrawal queue** — withdrawals are first-come-first-served at the contract level. When utilization nears 100%, this creates a bank-run dynamic

### Secondary Liquidity: DEX Markets

stUSDS trades on secondary markets, providing an alternative exit path:

- **Curve stUSDS-USDS pool** ([`0x2C7C98A3b1582D83c43987202aEFf638312478aE`](https://etherscan.io/address/0x2C7C98A3b1582D83c43987202aEFf638312478aE)): **~$5.81M TVL** (~$2.62M USDS + ~$3.19M stUSDS at snapshot). `get_virtual_price()` = ~1.028, indicating tight peg. Allows exiting to USDS at market price rather than at `chi`
- **Morpho Blue markets** — stUSDS is used as collateral in several Morpho Blue lending markets. The most active market (stUSDS/USDS) has ~$1.25M supply and ~$1.12M borrowed at 90% utilization. These provide some additional liquidity but are small relative to total stUSDS supply

While DEX liquidity provides an alternative exit, the presence of the direct withdrawal mechanism (even if gated by utilization) means large stUSDS holders may prefer to wait for withdrawals rather than taking DEX slippage.

### Historical Liquidity

- **No `cut()` events** have occurred since deployment — `chi` has only increased
- **No Utilization spikes to 100%** have occurred — the RateSetter's active management and the 83.4% current utilization suggest healthy buffer management
- **Curve pool peg stability:** The pool's `get_virtual_price()` of ~1.028 at snapshot is close to 1.0, indicating the stUSDS/USDS price has remained tightly pegged. The pool uses Curve's stableswap invariant, designed for same-peg assets, providing low-slippage swaps between the two
- stUSDS has been live for ~10 months without a withdrawal crisis

### Withdrawal Constraint Analysis

At the snapshot:
- **Idle USDS for withdrawal:** ~$31.1M (16.6% of total assets)
- **Single-tx withdrawal capacity:** Up to $31.1M (no per-tx limits)
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
| Call `cut()` to socialize losses | PauseProxy or Clip | None (Clip: during auction) | **Permanently reduces chi** — impairs all holders |
| Change `str` (supply rate), `cap`, `line` | RateSetter `buds` or PauseProxy | 16 h cooldown (RateSetter); 48 h (PauseProxy via spell) | Affects yield, deposit capacity, borrowing capacity |
| Change RateSetter config (bounds, cooldown) | PauseProxy (wards) | 48 h | Can widen/restrict rate-step bounds |
| Add/remove RateSetter `buds` | PauseProxy (wards) | 48 h | Changes who can set rates |
| Halt RateSetter (`bad = 1`) | PauseProxy or Mom (via Chief approval) | Mom: immediate | Stops rate changes |
| Zero cap / line | Mom (via Chief approval) | Immediate | Halts new deposits / borrowing |
| Remove `buds` | Mom (via Chief approval) | Immediate | Revokes facilitator privileges |

**RateSetter facilitators (`buds`):** At the snapshot, the `buds` mapping on the RateSetter (`0x3078…Bf4C5`) was checked against all known Sky governance addresses (PauseProxy, Chief, Pause, USDS, stUSDS, SKY token, Mom, hat address, and the three EMSP spell factories) — all returned `0`. A scan of the last 10,000 blocks for `Kiss(address)` and `Diss(address)` events yielded no results. The RateSetter's `toc` (time of last change) reads `1784481491` (~July 19, 2026, ~91 hours before snapshot), showing the last rate-set occurred ~3.8 days prior. **No active `buds` have been identified onchain.** Rate changes currently require a full governance spell (Chief + 48 h GSM delay) rather than the faster 16 h RateSetter path. The Mom can still add/remove buds immediately via Chief authority.

**Strengths (shared with USDS/sUSDS):**
- Token-weighted continuous-approval voting in Chief with no multisig
- 48 h GSM delay on all standard governance operations
- `MCD_PAUSE.owner = address(0)` — no admin shortcut
- No EOA holds direct admin powers on stUSDS, RateSetter, or Mom

**Weaknesses (unique to stUSDS):**
1. **`cut()` can be called without GSM delay** — losses are socialized immediately when Clip concludes an auction with bad debt. Governance can also call `cut()` directly via PauseProxy (with 48 h delay). The irreversible chi reduction means stUSDS holders cannot "wait out" a governance decision
2. **Mom has immediate emergency powers** — can halt RateSetter, zero cap, zero line without 48 h GSM delay. These are defensive mechanisms but could be used to trap funds
3. **RateSetter adds a governance dependency layer** — the `buds` facilitators (even if currently empty) are an additional class of privileged actors distinct from the Chief/PauseProxy path
4. **48 h GSM delay is non-standard during high-utilization periods** — if utilization is near 100%, holders cannot exit during the delay even if they detect a malicious spell

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
| Upgrading stUSDS implementation | **Governance** | 48 h delay |

System operations are predominantly programmatic, but stUSDS has more governance touchpoints than sUSDS — the active rate-setting model requires ongoing parameter adjustments by either facilitators or governance.

### External Dependencies

| Dependency | Used By | Criticality | Notes |
|-----------|---------|-------------|-------|
| **USDS** | Core functionality | **Critical** — stUSDS wraps USDS. A USDS failure breaks stUSDS completely | See [sky-usds.md](sky-usds.md) for USDS risk assessment (Score 1.3 — Minimal Risk) |
| **Sky/MCD Core (VAT, Vow, Jug, Chief, Pause, PauseProxy)** | All operations | **Critical** — stUSDS is built on the same infrastructure. VAT ilk accounting, Vow-based yield, Chief governance all directly affect stUSDS | 8+ years production, extensively audited |
| **LockStake Engine V2** | Borrower side | **Critical** — all lending risk depends on LockStake borrower solvency and the liquidation module | SKY-backed, over-collateralized. Specific CR parameters are governance-set |
| **LockStake Clipper** (`0x836F…A399`) | Bad-debt absorption | **High** — if the Clipper fails to liquidate underwater borrowers, losses accrue to stUSDS via `cut()` | Standard Sky/MCD liquidation infrastructure |
| **Conv (rates-conv)** | RateSetter rate conversion | **Low** — pure math contract (`btor` / `rtob`), no state, no admin | Part of shared Sky rate-conversion infrastructure |
| **SPBEAM** | RateSetter design origin | **Indirect** — architectural dependency on SPBEAM's proven rate-control model | Audited separately ([reports](https://github.com/sky-ecosystem/sp-beam/tree/master/audits)) |
| **Morpho Blue** | Secondary liquidity (stUSDS as collateral) | **Low** — not required for stUSDS to function. Would affect holders using stUSDS as Morpho collateral | Active markets are small (<$1.5M total) relative to $187.5M stUSDS supply |
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
- `cut()` can be called by governance directly, not just by Clip
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
| MCD Pause | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | `Plot` events — any spell touching stUSDS, RateSetter, Mom, or `LSEV2-SKY-A` ilk; `delay()` changes |
| Clip (LSEV2-SKY-A) | [`0x836F56750517b1528B5078Cba4Ac4B94fBE4A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399) | `Due()` — any non-zero value means an auction is pending (withdrawals are further constrained); `Take` events — liquidation activity |
| USDS balance at stUSDS | [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) | `balanceOf(stUSDS)` — idle reserve gauge |
| Morpho markets | (see Contract Addresses table) | stUSDS collateral utilization; oracle price feeds for stUSDS |
| SKY price oracle (OSM) | [`0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff`](https://etherscan.io/address/0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff) | `peek()` → SKY/USD price (with 1 h OSM delay). Monitor for sudden drops approaching liquidation thresholds |
| Dog (Liquidation Engine) | [`0x135954d155898D42C90D2a57824C690e0c7BEf1B`](https://etherscan.io/address/0x135954d155898D42C90D2a57824C690e0c7BEf1B) | `ilks("LSEV2-SKY-A")` → `chop`, `hole`, `dirt`; `Bark` events — liquidation initiations; `dirt` approaching `hole` means liquidation throughput is saturated |
| LockStake Engine V2 | [`0xCe01C90dE7FD1bcFa39e237FE6D8D9F569e8A6a3`](https://etherscan.io/address/0xCe01C90dE7FD1bcFa39e237FE6D8D9F569e8A6a3) | `SKY.balanceOf(LockStakeEngine)` — total SKY collateral locked. Decreasing = liquidations or withdrawals; increasing = new borrowers |
| SKY token DEX volume | Coingecko [`0x56072C95FAA701256059aa122697B133aDEd9279`](https://www.coingecko.com/en/coins/sky) | 24h volume — gauge of liquidation absorption capacity. <$5M/day during a crash raises auction-clearing risk |
| Morpho stUSDS/USDS market | Market ID `0x77e6…7f82` via Morpho [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | `market(id)` → `totalBorrowAssets`, `totalSupplyAssets`. Utilization >95% = borrowers near max LTV, vulnerable to chi changes |

### Critical Values, Thresholds, and Frequency

| Metric | Source | Threshold to alert | Frequency |
|--------|--------|---------------------|-----------|
| stUSDS `chi()` | onchain | **Any decrease** (critical — loss event) | Every block / Real time |
| stUSDS withdrawal availability | Computed: `totalAssets - (Art*rate/RAY + Due()/RAY)` | <10% of totalAssets (<$18M) — near-full utilization | Hourly |
| LSEV2-SKY-A utilization | `(Art * rate) / totalAssets` | >95% — withdrawal gating imminent | Hourly |
| RateSetter `Set` event | event log | Any change to `str`, `duty`, `line`, or `cap` | Real time |
| RateSetter `bad` flag | onchain | Any change to 1 (catastrophic) | Real time |
| Mom event | event log | **Any event** (emergency action) | Real time |
| `cut()` call on stUSDS | transaction | **Any call** (loss socialization) | Real time |
| stUSDS `cap` utilization | `totalSupply / cap` | >95% — deposit gating imminent | Hourly |
| stUSDS daily deposit/withdraw volume | event logs `Deposit` / `Withdraw` | >20% of totalSupply in 24 h — bank-run signal | Daily |
| stUSDS `str` rate | onchain | Change >200 bps APY — material yield change | On `Set` event |
| USDS depeg | CoinGecko / DEX | >±1% sustained >24 h | 15 min |
| `MCD_PAUSE` spells touching stUSDS | `Plot` event | **Any** — provides 48 h warning | Behind timelock |
| stUSDS `Upgraded` event | event log | Any implementation change | Behind 48 h GSM delay |
| **SKY/USD price** | OSM `peek()` via [`0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff`](https://etherscan.io/address/0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff) | **< $0.030** (−50% from snapshot) — widespread LockStake liquidations likely; **< $0.020** (−67%) — system CR approaching 120% mat, mass liquidations imminent | 15 min |
| **LSEV2-SKY-A system CR** | Computed: `SKY_locked × SKY_price / (Art × rate)` | **< 200%** — liquidation risk escalating; **< 150%** — majority of vault positions eligible for liquidation; **< 120%** — system-wide underwater | Hourly |
| **Dog.dirt(ilk)** approaching **Dog.hole** | onchain | `dirt > 0.8 × hole` — liquidation throughput saturated; queued auctions at risk of further price deterioration | On every `Bark` event |
| **Clip `Take` events** | event log on [`0x836F56750517b1528B5078Cba4Ac4B94fBE4A399`](https://etherscan.io/address/0x836F56750517b1528B5078Cba4Ac4B94fBE4A399) | **Spike >3 auctions/hour** — active liquidation cascade; sustained >10/hour = crisis mode | Real time |
| **Clip `Due()` > 0 for >24 h** | onchain | Stale auction — potential failed liquidation, bad debt may flow to stUSDS | Hourly |
| **SKY DEX 24h volume** | CoinGecko | <$5M during liquidation cascade — insufficient depth to absorb Clip auction supply | Hourly during stress |
| **Morpho stUSDS market utilization** | onchain (see Monitoring Functions below) | >90% on any stUSDS-collateral market — LTV headroom thin, vulnerable to chi drops | Hourly |
| **LockStake Engine SKY balance** | `SKY.balanceOf(LockStakeEngine)` | Drop >10% in 24 h — mass withdrawal or liquidation event in progress | Hourly |

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
# withdrawable ≈ balanceOf - (Art * rate / RAY)

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
SKY.balanceOf(lockstakeEngine) → uint256  # Total SKY collateral (WAD)

# System CR (computed)
# systemCR = (SKY_balance × SKY_price) / (Art × rate / 1e27)
# Alert thresholds: <200% (warning), <150% (critical), <120% (system underwater)

# Morpho stUSDS market health (for market id, see Contract Addresses table)
morpho.market(marketId) → (totalSupplyAssets, totalSupplyShares, totalBorrowAssets, ...)
# Utilization = totalBorrowAssets / totalSupplyAssets
# Alert: >90% on any stUSDS market (borrowers near max LTV, vulnerable to chi drops)
# Alert: any `Liquidate` event on stUSDS-collateral Morpho markets
```

## Appendix A: Contract Architecture

Snapshot block 25595151 (July 23, 2026).

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              USER LAYER                                   │
│                                                                           │
│   user holds USDS ─── deposit(stUSDS) ──────→ receives stUSDS shares      │
│                        mint(stUSDS)                                       │
│                                                                           │
│   stUSDS holder ───── withdraw(stUSDS) ────→ receives USDS (if idle)      │
│                        redeem(stUSDS)                                     │
│                        OR sell stUSDS on Curve/Morpho                     │
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
│   │  chi = 1.06535   str = ~6.28% APY                │                   │
│   │  cap = 211M   line = 187.5M RAD                   │                   │
│   │  totalAssets = $187.5M   totalSupply = 176M       │                   │
│   │  wards[PauseProxy] = 1                            │                   │
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
│   │    Art = 134.97M   rate = 1.1587                  │                   │
│   │    line = 187.5M RAD   dust = 30K RAD             │                   │
│   │    actual debt = $156.4M                          │                   │
│   └──────────┬───────────────────────────────────────┘                   │
│              │                                                            │
│              ▼                                                            │
│   ┌──────────────────────┐     ┌──────────────────────┐                  │
│   │  MCD_Jug             │     │  Clip (LSEV2-SKY-A)   │                  │
│   │  0x19c0…f1F1         │     │  0x836F…A399          │                  │
│   │  drip(ilk): accrues  │     │  Due() = 0            │                  │
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
│   │  wards[PauseProxy] = 1                            │                   │
│   │  buds[?] = no active buds found onchain           │                   │
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
│   │  MCD_ADM (Chief)     │  hat = 0x0aE3…e253                             │
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

- **Withdrawal gating risk** — stUSDS is fundamentally different from sUSDS in that withdrawals are constrained by borrowing utilization. At the snapshot, only ~16.6% of assets ($31.1M) are withdrawable. In a crisis, 100% utilization would prevent all withdrawals
- **First-loss exposure** — stUSDS holders bear the first-loss risk from LockStake Engine V2 borrower defaults via the `cut()` mechanism. Chi can be permanently reduced without the 48 h GSM delay (during Clip auction settlement)
- **Active rate-setter governance** — the `str` rate, `duty` rate, `cap`, and `line` are actively managed by RateSetter facilitators (`buds`) or governance. Poor rate-setting could drive utilization to 100% or create unsustainable yield expectations
- **Governance `cut()` power** — Sky governance can directly call `cut()` via PauseProxy (with 48 h delay), socializing arbitrary losses to stUSDS holders. This is explicitly documented in the README
- **Mom emergency powers without delay** — the Mom can halt the RateSetter, zero out cap/line, and revoke facilitators without the 48 h GSM delay. While defensive, these could trap funds
- **Limited DEX liquidity** — Curve stUSDS-USDS and Morpho markets provide alternative exits but at shallow depth relative to total supply ($187.5M)
- **RateSetter facilitators (`buds`) are inactive** — no active facilitators found onchain; all rate changes currently require governance spells with 48 h GSM delay. This reduces the fast-rate-change risk but creates governance dependency for parameter tuning
- **Early-depositor tail risk** — if `cut()` events occur before the pool reaches borrowing equilibrium, early depositors could bear disproportionate losses (explicitly warned in README)

### Critical Risks `[If Any]`

- **Withdrawal gate combined with governance upgrade risk** — during the 48 h GSM delay period for a malicious governance spell, if utilization is at or near 100%, no stUSDS holder can exit. This is a structural risk not present in sUSDS or USDS. A well-timed malicious governance action (e.g., upgrading stUSDS to a drainer contract) during a high-utilization period could trap all depositors
- **`cut()` without GSM delay** — loss socialization through `cut()` can occur at any time during Clip auction settlement, with no governance delay. Holders have zero reaction window for this specific risk vector

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
| Time in production (stUSDS) | **~10 months** (since ~Sep 2025) |
| TVL | **$187.5M** — above rubric threshold for >$100M sustained |
| Underlying MCD core | 8+ years in production |
| stUSDS-specific incidents | **None** since launch |
| TVL stability | Steady growth from launch; no forced unwind or crisis |

**Historical Score: 2.0 / 5** — stUSDS itself has only ~10 months of production (Score 3 threshold = 6–12 months, Score 2 = 1–2 years). TVL is well above $100M (Score 1 criterion). **The younger age of the specific contract is the binding constraint** — the underlying MCD core is 8+ years old, but stUSDS introduces novel mechanisms (dynamic debt ceiling, withdrawal gating, RateSetter) that are less battle-tested. Score 2.0: at the boundary between 1-2 years and $100M+ TVL.

**Cat 1 Score = (1.0 + 2.0) / 2 = 1.5 / 5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | UUPS upgradeable. Upgrades gated by `wards[PauseProxy]=1` with 48 h GSM delay |
| Vote / consensus | SKY token-weighted continuous-approval Chief voting. No multisig |
| Timelock | 48 h GSM delay (`MCD_PAUSE.delay = 172800`). Below the 7-day rubric Score-1 threshold |
| Emergency channel (Mom) | Can halt RateSetter, zero cap/line, remove buds **without GSM delay** (authority = Chief) |
| `cut()` channel | Can be called without GSM delay during Clip auction settlement |
| RateSetter facilitators | Additional privileged-actor class (buds) — currently empty onchain; no active facilitators found. Rate changes require governance spells |
| Privileged roles | PauseProxy holds `wards[stUSDS]=1`, `wards[RateSetter]=1`, owns Mom. Can call `cut()` directly (with delay). Can upgrade implementation |
| EOA risk | None |

**Governance Score: 1.5 / 5** — Sky's Chief is one of the most decentralized governance systems in DeFi, meeting the Score-1 "fully decentralized DAO" criterion. However, stUSDS-specific governance features push the score up:
- **Mom emergency powers without GSM delay** — while defensive, this is a powerful immediate-action channel (Score-2 territory, approaching Score-3 for "powerful admin roles with limited constraints")
- **`cut()` without GSM delay via Clip** — loss socialization has no governance delay
- **48 h timelock** is below the Score-1 "7+ days" criterion
- **RateSetter buds are inactive** — no active facilitators found onchain; all rate changes currently require governance spells with 48 h GSM delay. This reduces the fast-rate-change risk but creates governance dependency for parameter tuning

Score 1.5: Scores well on overall DAO decentralization (Score 1) but the Mom emergency powers and low timelock push toward Score 2 territory. A conservative midpoint between Score 1 and Score 2.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Deposit / mint | Fully programmatic via ERC-4626 |
| Withdraw / redeem | Programmatic but gated by borrowing utilization |
| Exchange rate (`chi`) | Fully onchain, continuous accrual |
| Rate parameters (`str`, `duty`, `cap`, `line`) | **Actively managed** — set by RateSetter facilitators (16 h cooldown) or PauseProxy (48 h). Not a static "set once" parameter like sUSDS's `ssr` |
| `cut()` loss socialization | Manual trigger (Clip auction settlement or governance) |
| Off-chain dependencies | RateSetter facilitators need off-chain algorithms to compute optimal rates |
| Keeper dependency | None for critical user flows; `drip()` is permissionless |

**Programmability Score: 2.0 / 5** — The system is "mostly programmatic with minor admin input" (Score 2) rather than "fully programmatic" (Score 1) because:
- The `str`, `duty`, `cap`, and `line` parameters require ongoing active management by facilitators or governance
- The `cut()` mechanism is a manual governance/auction action, not a pure algorithmic operation
- sUSDS's `ssr` is comparatively static (Score 1); stUSDS's actively managed rate model is fundamentally different

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| USDS | Blue-chip underlying asset. Critical — stUSDS wraps USDS. USDS risk assessment: Score 1.3 (Minimal Risk) |
| MCD Core (VAT, Vow, Jug, etc.) | Sky's own infrastructure — battle-tested, 8+ years. Critical for accounting, yield generation, and governance |
| LockStake Engine V2 + Clip | SKY-collateralized borrowing infrastructure. Critical for stUSDS's risk-capital model |
| Conv (rates-conv) | Pure math contract, no state. Non-critical |
| Morpho Blue | Secondary liquidity — non-critical for stUSDS function |
| Chainlink / MCD Spot (OSM) | Mature multi-source oracle for LockStake collateral pricing. Indirect but critical for liquidation integrity |

**Dependencies Score: 2.0 / 5** — stUSDS has multiple critical dependencies (USDS, MCD core, LockStake Engine + Clip, oracles), but they are all blue-chip/MCD-internal. This places it at Score 2 ("2-3 established protocol dependencies, some critical functions depend on them") rather than Score 1 (no dependencies) or Score 3 (many or newer dependencies). The LockStake Engine V2 is the newest dependency and the one with the least production history.

**Cat 2 Score = (1.5 + 2.0 + 2.0) / 3 = 1.83 → 1.8 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Direct backing | 1:1 USDS backing at all times (over-backed at `chi > 1`) |
| USDS quality | USDS is the upgraded DAI, backed by Sky's full collateral book (Score 1.3 Minimal Risk). See [sky-usds.md](sky-usds.md) |
| Lending risk | USDS is lent to LockStake borrowers (SKY-backed, over-collateralized). Borrowers can default, triggering loss to stUSDS via `cut()` |
| First-loss position | stUSDS is **first-loss** capital — no buffer or insurance fund between borrowers and depositors |
| Collateral quality (borrower side) | SKY governance token — volatile, governance-dependent collateral. Lower quality than ETH/wstETH/WBTC used in traditional MCD CDPs |
| System CR (borrower side) | Set by governance for LSEV2-SKY-A. **Liquidation ratio (`mat`) = 120%** (1.2 RAY), read from `MCD_SPOT.ilks("LSEV2-SKY-A").mat`. SKY collateral price sourced from a **LockstakeCappedOsmWrapper** ([`0x0C13fF3DC02E85aC169c4099C09c9B388f2943Fd`](https://etherscan.io/address/0x0C13fF3DC02E85aC169c4099C09c9B388f2943Fd)) backed by a **Chronicle OSM** ([`0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff`](https://etherscan.io/address/0xc2ffbbDCCF1466Eb8968a846179191cb881eCdff)). Current SKY price: ~$0.0613. This is a low liquidation ratio compared to typical MCD crypto CDPs (145–170%) — consistent with stUSDS's first-loss risk-capital design
| Verifiability | Fully onchain for USDS backing. Complex for borrower-level solvency (requires reading per-urn positions in LockStake contracts) |
| Loss mechanism | `cut()` — permanent chi reduction. No insurance, no compensation path. Socialized to ALL stUSDS holders |

**Collateralization Score: 2.5 / 5** — 100% backed onchain (Score 1-2 criteria), but with critical caveats:
- The USDS is lent to borrowers posting **SKY governance tokens** as collateral — a materially riskier collateral class than the ETH/wstETH/WBTC backing traditional MCD vaults
- stUSDS is in a **first-loss position** with no intermediate buffer. A single large borrower default directly impairs all holders
- The borrower-side over-collateralization parameters are set by the same governance that oversees stUSDS — a potential conflict during crisis
- Score 2.5: between "100% onchain, high-quality collateral" (Score 1-2) and "mixed quality" (Score 3). The USDS backing is Score-1 quality, but the lending-book quality and first-loss position warrant a higher score

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

**Cat 3 Score = (2.5 + 1.5) / 2 = 2.0 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Direct ERC-4626 withdrawal (at `chi` rate, zero fee). Exists but is **gated by borrowing utilization** (~$31.1M / $187.5M = 16.6% available) |
| DEX liquidity | Curve stUSDS-USDS pool (TVL: ~$5.81M at [`0x2C7C98A3b1582D83c43987202aEFf638312478aE`](https://etherscan.io/address/0x2C7C98A3b1582D83c43987202aEFf638312478aE)), Morpho Blue markets (~$1.81M total supply across all markets). Secondary exits exist but are shallow vs total supply ($187.5M)
| Same-value asset | stUSDS/USDS is a yield-bearing stablecoin pair — minimal PPS divergence risk, but DEX price can deviate from `chi` under stress |
| Withdrawal restrictions | No cooldown, no queue, no per-user cap. But utilization-based gating is effectively a hidden restriction |
| Historical stress | No `cut()` events, no utilization spikes to 100%. 10-month track record without liquidity crisis |
| Large holder impact | A whale exiting >$31.1M would temporarily exhaust withdrawal capacity; subsequent withdrawals would be blocked until utilization drops |

**Score: 3.0 / 5** — The formal mechanism (ERC-4626, zero fee, no queue) reads like a Score 1-2 profile, but the **utilization-based gating** is a structural liquidity constraint not present in sUSDS. At 83.4% utilization, only 16.6% of assets are liquid. Key considerations:
- **Score 2.5-3.0 territory:** "Direct redemption with minor delays" (Score-2) is too generous — the delay could be indefinite if utilization reaches 100%. "Market-based or short queues" (Score-3) is closer, but stUSDS has a direct withdrawal path when idle funds exist
- **No throttle mechanism to speak of** — withdrawals stop cold, not gradually
- **DEX liquidity is insufficient** for large exits (secondary path exists but at likely poor price if utilization is high)
- Score 3.0: conservative assessment recognizing the fundamental liquidity risk of the lending-backed model

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

**Rounding rule:** category scores use one-decimal precision; when a subcategory average falls between two 0.1 marks, round **up** (conservative). The weighted sum is then rounded to one decimal place with standard nearest-0.1 rounding, with ties broken up.

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 2.0 | 30% | 0.600 |
| Funds Management | 2.0 | 30% | 0.600 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.0 |  5% | 0.050 |
| **Final Score** | | | **1.925 → 1.9 / 5.0** |

**Score justification notes:**
- **Audits & Historical (1.5):** Top-tier audits (2 firms, 4 reports + Certora formal verification) earn Score 1.0 for audits, but only ~11 months of production for stUSDS specifically (Score 2 for historical). Average = 1.5.
- **Centralization & Control (2.0):** Sky's Chief DAO is highly decentralized (Score 1 territory), but stUSDS adds Mom emergency powers without GSM delay (Mom itself only ~2 months in production), `cut()` without delay via Clip, and actively managed RateSetter parameters (buds currently inactive but infrastructure exists). Programmability is less automatic than sUSDS (active rate management vs static SSR). Dependencies are blue-chip but multi-layered (MCD core + LockStake + Clip). Raw average = 1.83, conservatively rounded to 2.0 per rubric guidance.
- **Funds Management (2.0):** 1:1 USDS backing is Score 1, but the lending book quality (SKY-token-collateralized loans, first-loss position) pushes collateralization to 2.5. Provability is excellent (1.5) with all metrics onchain. The LockStake borrower solvency assessment adds complexity. Average = 2.0.
- **Liquidity Risk (2.5):** Direct ERC-4626 withdrawal exists but is gated by borrowing utilization (only ~$31.1M / $187.5M = 16.6% available at snapshot). Below the Score-2 threshold for frictionless exit but above Score-3 for market-only exit. The structural risk of 0% withdrawal capability at 100% utilization + the absence of a gradual throttling mechanism (it's a hard stop) warrants Score 2.5.
- **Operational Risk (1.0):** Top-tier team, documentation, bug bounty, and incident response.

**Final Score: 1.9 / 5.0** — within the Low-Risk tier (1.5–2.5), clearly differentiated from sUSDS (1.3 — Minimal Risk) due to the withdrawal-gating, first-loss exposure, and active-rate-setting governance dependencies inherent to the risk-capital model.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0–1.5 | Minimal Risk | Approved, high confidence |
| **1.5–2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (1.9 / 5.0) — Approved with standard monitoring**

---

## Appendix B: SKY Price Crash — Liquidation & Bad Debt Simulations

This appendix models the impact of severe SKY price crashes on the LockStake Engine V2 (LSEV2-SKY-A) vault, the resulting bad-debt flow to stUSDS via `cut()`, and the downstream effect on Morpho Blue markets where stUSDS serves as collateral.

### Baseline Data (snapshot block 25595151, July 23, 2026)

| Metric | Value | Source |
|--------|-------|--------|
| SKY price | $0.0613 | Chronicle OSM via [`LockstakeCappedOsmWrapper`](https://etherscan.io/address/0x0C13fF3DC02E85aC169c4099C09c9B388f2943Fd) |
| SKY 24h DEX volume | $12.58M | [CoinGecko](https://www.coingecko.com/en/coins/sky) |
| SKY market cap | $1.42B | CoinGecko |
| Total SKY locked as collateral | **~10.17B SKY** (43.4% of 23.46B total supply) | `SKY.balanceOf(LockStakeEngine)` onchain |
| Total collateral value | **~$623.7M** | 10.17B × $0.0613 |
| Total debt (LSEV2-SKY-A) | **~$156.4M** | `vat.ilks("LSEV2-SKY-A").Art × rate` |
| Aggregate system CR | **~399%** | $623.7M / $156.4M |
| Liquidation ratio (`mat`) | **120%** | `MCD_SPOT.ilks("LSEV2-SKY-A").mat` |
| Liquidation penalty (`chop`) | **13%** | `Dog.ilks("LSEV2-SKY-A").chop = 1.13` |
| Liquidation debt ceiling (`hole`) | **250,000 DAI** (per cooldown period) | `Dog.ilks("LSEV2-SKY-A").hole` |
| stUSDS total assets | **$187.5M** | `stUSDS.totalAssets()` |
| stUSDS withdrawal availability | **$31.1M** (16.6% idle) | Computed from `totalAssets − (Art×rate + Due)` |

### Simulation Results

| Scenario | SKY Price | Collateral Value | Aggregate CR | Liquidations | Estimated Bad Debt | stUSDS Chi Impact | Morpho Impact |
|----------|----------|-----------------|-------------|-------------|-------------------|-------------------|---------------|
| **Current** | $0.0613 | $623.7M | 399% | None | $0 | 0% | None |
| **−30% drop** | $0.0429 | $436.6M | 279% | Isolated — only most-leveraged positions (~120% CR) | $0–2M | 0–1% | Minimal (<1% chi move won't trigger Morpho LTV breaches) |
| **−50% drop** | $0.0307 | $311.9M | 199% | Widespread — significant portion of vault positions under water | $0–10M | 0–5.3% | Modest. At 5% chi drop, Morpho stUSDS/USDS borrowers need 90.5% original-LTV-equivalent to stay safe. Most positions at <90% utilization remain safe |
| **−70% drop** | $0.0184 | $187.7M | **120%** | **System-wide trigger** — aggregate CR hits `mat`. All positions eligible for liquidation | $10–40M | 5.3–21.3% | **Significant.** 10%+ chi drop liquidates near-max-LTV Morpho borrowers (~$1.8M across all markets). Liquidation path via stUSDS→USDS→PSM remains functional |
| **−75% drop** | $0.0153 | $155.9M | **99.7%** | **System underwater** — collateral < debt at aggregate level | $40–80M | **21.3–42.7%** | **Severe.** Mass Morpho liquidations. All stUSDS-collateral borrowers underwater. ~$1.81M Morpho market at risk of bad debt if liquidations cascade |

### Key Assumptions & Caveats

1. **Aggregate CR masks individual leverage.** The 399% system CR is an average. Individual LockStake positions may be leveraged closer to 120% mat and would liquidate at much smaller price drops. A single highly-leveraged whale could trigger outsized liquidations.

2. **Clip Dutch auctions always find a clearing price.** The Maker Clip liquidation mechanism starts auctions at a high price and decays linearly. In theory, auctions always clear — the question is at what price. If SKY DEX volume ($12.6M/day) is insufficient to absorb a flood of auctioned SKY, prices could crash further, widening the bad-debt gap. At a 75% crash, ~$155.9M of SKY would need to be auctioned — over 12× the daily DEX volume.

3. **Dog.hole limits liquidation throughput.** The `hole` parameter (250,000 DAI per cooldown period) caps how much debt can be liquidated per batch. During a cascading crash, liquidations queue up. While they wait, SKY price can deteriorate further, increasing the eventual bad-debt shortfall. The `hole` is a governor-set parameter and can be increased via spell (48 h GSM delay).

4. **Morpho oracle follows chi.** The Morpho oracle for stUSDS markets reads the stUSDS `chi()` value directly. If chi drops 20%, the oracle reports a 20% lower collateral value within the same block. Morpho borrowers at >80% LTV pre-drop would be immediately eligible for liquidation post-drop. However, the Morpho market sizes are small (~$1.81M total supply vs $187.5M stUSDS), limiting systemic contagion.

5. **Liquidation path remains functional.** Even with reduced chi, a Morpho liquidator can: receive stUSDS → `stUSDS.redeem()` → receive USDS at current chi → swap USDS→USDC via LitePSM (zero-fee, atomic). The only bottleneck is the stUSDS withdrawal gate — if utilization is near 100%, the liquidator may be unable to redeem.

6. **No historical stress test.** stUSDS has never experienced a `cut()` event (chi reduction) or a mass LockStake liquidation. The SKY token has not experienced a >50% drawdown since stUSDS deployment. These simulations are theoretical and based on onchain parameters.

- **Time-based:** Reassess in 6 months (January 2026) or earlier if utilization or TVL change materially
- **TVL-based:**
  - stUSDS `totalAssets()` drops >30% from snapshot ($187.5M → <$131M) — would indicate material depositor exit or loss event
  - stUSDS `totalAssets()` grows >3× ($187.5M → >$562M) — would increase systemic footprint materially
- **Utilization-based:**
  - LSEV2-SKY-A utilization (`Art * rate / totalAssets`) exceeds **95%** — withdrawal capacity critically low (<$9.4M)
  - LSEV2-SKY-A utilization drops below **50%** — would indicate borrowers are deleveraging; reassess risk profile
- **Parameter-based:**
  - `stUSDS.str()` changes by >200 bps APY — material yield change
  - `stUSDS.cap()` or `stUSDS.line()` changes by >30% — material capacity change
  - RateSetter `tau` (cooldown) changes — affects rate-change governance speed
  - RateSetter config (`strCfg`, `dutyCfg`) bounds change — affects rate-setting flexibility
  - `MCD_PAUSE.delay()` reduced below 48 h — governance speed increases
  - New RateSetter `buds` added — expands the facilitator surface
- **Incident-based:**
  - **Any `cut()` call on stUSDS** — loss socialization event; immediate reassessment required
  - **Any `chi()` decrease** — permanent holder impairment
  - **Any Mom emergency action** (`DissRateSetterBud`, `HaltRateSetter`, `ZeroCap`, `ZeroLine`) — emergency response or governance crisis
  - RateSetter `bad` set to 1 — circuit breaker triggered
  - Any LockStake Engine V2 exploit or governance attack
  - Any USDS depeg >±1% sustained for >24 h — underlier stress propagates to stUSDS
  - Any LSEV2-SKY-A liquidation spike — borrower distress signal
  - stUSDS implementation upgrade — new code to re-audit
- **Governance-based:**
  - SKY voter concentration changes materially (any single supporter exceeds 50% of Chief approvals)
  - stUSDS-specific governance spell passes — revalidate all parameters post-change
  - New LockStake Engine version deployed — changes borrower-side dynamics

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| July 23, 2026 | 1.9 | Initial assessment. stUSDS deployed Aug 25, 2025 (~11 months in production), $187.5M TVL, 4 audits + Certora formal verification, 83.4% borrowing utilization. Etherscan verified. Mom deployed separately May 28, 2026. Unresolved: top-holder distribution (needs Etherscan API Pro). |
