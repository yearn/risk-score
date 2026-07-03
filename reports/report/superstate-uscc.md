# Protocol Risk Assessment: Superstate USCC

- **Assessment Date:** July 3, 2026
- **Token:** USCC
- **Chain:** Ethereum
- **Token Address:** [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c)
- **Final Score: 2.95/5.0**

## Overview + Links

USCC is the **Superstate Crypto Carry Fund** — a tokenized investment fund issued by Superstate Inc. that runs **crypto cash-and-carry (basis) trades** on Bitcoin and Ether (including staked ETH) alongside U.S. Treasury Bills. The fund's investment objective is to capture the differential between spot and futures prices on CFTC-regulated venues while idle collateral earns the federal-funds rate via T-Bills.

USCC uses a **price-appreciation model** (non-rebasing). Unlike USTB, USCC's NAV **is not monotonic** — daily NAV reflects mark-to-market gains and losses on the futures leg, so the share price can decrease during basis-expansion episodes even when the trade economics remain intact (per the protocol's own [risk disclosure](https://docs.superstate.com/llms-full.txt)).

This means USCC holders can suffer **principal loss**, not merely delayed yield or temporary illiquidity. Losses can arise from basis widening, forced futures unwinds, futures-venue counterparty failure, crypto custody loss, ETH slashing if ETH is staked, or adverse mark-to-market movement during the offchain redemption window.

Investors must clear KYC/AML, be **Qualified Purchasers** ($5M+ individuals, $25M+ institutions) **and** Accredited Investors, get whitelisted in the same shared AllowList contract used by USTB, then subscribe/redeem either onchain (offchain-settled) or via book-entry shares.

- **Current NAV/Share:** $11.628080 (Chainlink USCC NAV feed, latest round updated Jul 2, 2026 13:10 UTC; verified onchain Jul 3, 2026)
- **Ethereum Supply:** 6,229,050.91 USCC ($72.43M, verified onchain Jul 3, 2026)
- **Total Shares (incl. book-entry):** ~13,999,991 USCC (per [superstate.com](https://superstate.com/assets/uscc))
- **Total AUM (incl. book-entry):** $162.79M (per [superstate.com](https://superstate.com/assets/uscc), Jul 3, 2026)
- **Public TVL:** $136.18M (per [DeFiLlama](https://defillama.com/protocol/bitwise-uscc), Jul 3, 2026). DeFiLlama currently reports Ethereum $72.43M, Solana $47.32M, and Plume $16.43M; Superstate's own network table reports Ethereum $72.43M, Solana $23.66M, Plume $16.43M, and book-entry $50.27M.
- **Onchain Holders (Ethereum):** 55 in the latest RWA.xyz snapshot available during review; holder count not refreshed in this TVL update
- **30-day Yield:** 2.60% (variable, depends on basis spread)
- **Management Fee:** 0.75% annually (waived until AUM exceeds $50M — now exceeded)
- **Minimum Investment:** $100,000

**Links:**

- [Protocol Documentation](https://docs.superstate.com/)
- [USCC Fund Info](https://superstate.com/assets/uscc)
- [USCC Docs Page](https://docs.superstate.com/superstate-funds/uscc)
- [Smart Contract Addresses](https://docs.superstate.com/investors/smart-contracts)
- [Security Documentation](https://docs.superstate.com/welcome-to-superstate/security)
- [GitHub (USTB/USCC contracts)](https://github.com/superstateinc/ustb)
- [DeFiLlama](https://defillama.com/protocol/bitwise-uscc)
- [Etherscan Token Page](https://etherscan.io/token/0x14d60E7FDC0D71d8611742720E4C50E7a974020c)
- [Chainlink USCC NAV Feed](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9)
- [RWA.xyz](https://app.rwa.xyz/assets/USCC)
- [Steakhouse Overview](https://kitchen.steakhouse.financial/p/overview-of-uscc)
- [USTB Risk Report (sibling product)](https://github.com/yearn/risk-score/blob/master/reports/report/superstate-ustb.md)

## Contract Addresses

*Core addresses and owner roles re-verified onchain Jul 3, 2026.*

| Contract | Address |
|----------|---------|
| USCC Token (Proxy) | [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c) |
| USCC Implementation (SuperstateTokenV5, `VERSION "5"`) | [`0x9b7282Cb80baA4B1F8F6436f8D531B436BaE2A70`](https://etherscan.io/address/0x9b7282Cb80baA4B1F8F6436f8D531B436BaE2A70) |
| USCC ProxyAdmin | [`0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D`](https://etherscan.io/address/0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D) |
| AllowList V3.1 (Proxy, **shared with USTB**) | [`0x02f1fA8B196d21c7b733EB2700B825611d8A38E5`](https://etherscan.io/address/0x02f1fA8B196d21c7b733EB2700B825611d8A38E5) |
| Chainlink USCC NAV Oracle (OffchainAggregator wrapper) | [`0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9`](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9) |
| Chainlink USCC Aggregator (OCR-style) | [`0x5C00518D3d423EC59D553Af123Be8a63B11078CF`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF) |
| Aggregator owner (Chainlink-controlled) | [`0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) |

### Owner Addresses

Verified onchain Jul 3, 2026. **All Superstate-controlled admin keys are EOAs (code size 0)**:

Onchain, these owners are plain EOAs. Superstate states that admin keys use Turnkey secure enclaves, but that is an offchain operational control and cannot be independently verified from Ethereum contract state. This report therefore scores the owner addresses as EOAs for governance purposes; any MPC / TEE / Turnkey protection is treated only as an offchain mitigation.

| Role | Address |
|------|---------|
| USCC Token Owner + USCC ProxyAdmin Owner (same EOA) | [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) |
| AllowList Owner (shared with USTB) | [`0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe`](https://etherscan.io/address/0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe) |
| Chainlink USCC NAV Aggregator Owner (Chainlink, not Superstate) | [`0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) |

Note that the prior USCC owner was [`0x8c7db8a96d39f76d9f456db23d591c2fdd0e2f8a`](https://etherscan.io/address/0x8c7db8a96d39f76d9f456db23d591c2fdd0e2f8a); ownership was transferred on Oct 31, 2024 ([tx `0xd2d1c711…`](https://etherscan.io/tx/0xd2d1c711f5f7ecf9053637145d218e33f0b22d2d26d59a63d94535e88ca46c72)) via the `Ownable2StepUpgradeable` flow.

## Audits and Due Diligence Disclosures

USCC reuses the same SuperstateTokenV5 implementation family as USTB and the same shared AllowList V3.1 contract, so the audit surface overlaps substantially. Per the [Superstate Security page](https://docs.superstate.com/welcome-to-superstate/security) (as exposed via `llms-full.txt`), Superstate has commissioned **11 numbered 0xMacro audits**, plus a ChainSecurity audit and Offside Labs Solana audit. **Certora formal verification is referenced in the broader Security overview**, but USCC-specific findings are not enumerated separately.

### Audit History

| # | Firm | Approx. Date | Scope | Notes |
|---|------|---|---|---|
| A-1..9 | **0xMacro** | Jul 2024 – Jul 2025 | Token + Redemption + AllowList across V1→V3.1 — see [USTB report](https://github.com/yearn/risk-score/blob/master/reports/report/superstate-ustb.md) for individual findings | Findings fixed; 2H/4M/7M cumulative |
| A-10 | **0xMacro** | TODO (post-Jul 2025) | TODO — fetch from [0xmacro.com/library/audits/superstate-10](https://0xmacro.com/library/audits/superstate-10) | Audit page lists this exists; full PDF not loaded |
| A-11 | **0xMacro** | TODO (post-Jul 2025) | TODO — fetch from [0xmacro.com/library/audits/superstate-11](https://0xmacro.com/library/audits/superstate-11) | Audit page lists this exists; full PDF not loaded |
| -- | **ChainSecurity** | 2023 | Compound SUPTB (original USTB token) | 2 Critical, fixed pre-launch |
| -- | **Offside Labs** | May 2025 | Solana AllowList | Separate program |
| -- | **Certora** | — | Formal verification | Referenced but no public report URL |

**Smart Contract Complexity:** Moderate. Standard upgradeable EIP-1967 transparent proxy (legacy storage slot pattern: implementation accessible via `ProxyAdmin.getProxyImplementation`, not the canonical EIP-1967 slot). ERC-20 with AllowList-gated transfers, `Ownable2StepUpgradeable` access, cross-chain bridging via burn-and-mint to Solana (Token-2022) and Plume.

A key observation onchain: **USCC has a strict subset of the V5 token's capabilities enabled**:

- `superstateOracle() = 0x0` — no Superstate Continuous Price Oracle attached
- `redemptionContract() = 0x0` — no RedemptionIdle / atomic onchain redemption
- `supportedStablecoins(USDC) = 0x0` — no onchain stablecoin subscribe config
- `supportedChainIds(1) = false` … bridging destinations all return `false` via the `uint256` getter — TODO: verify how the active bridge destinations are configured (Solana mainnet ID, Plume ID); we observed a Solana `Bridge` event in production (block 22934217), so the path is live but the read path here may use a different signature than what was probed
- `subscribe()` reverts with `OnchainSubscriptionsDisabled()` (selector `0xdbf0cc51`)

So **all USCC mint operations are admin-driven** (`mint`/`bulkMint` by the owner EOA) and the only onchain user actions are `transfer` (AllowList-gated), `offchainRedeem` (burn, settled offchain T+1), and `bridge` to Solana/Plume.

### Bug Bounty

- **Platform:** Self-hosted (security@superstate.co)
- **Formal Rewards:** None — "Superstate does not have a formal reward policy"
- **Safe Harbor:** CFAA and DMCA safe harbor language for good-faith researchers
- **Note:** Same weakness as USTB. Not on the SEAL Safe Harbor registry.

## Historical Track Record

- **Fund Launch:** July 15, 2024 onchain (first mint at [block 20312293](https://etherscan.io/tx/0xeefda6ce766bca7c431bb6ef157b4b78925d9a0a3527a811d2ea54e41485fb1b), Unix ts 1721051099). DeFiLlama [first records Sep 9, 2024](https://defillama.com/protocol/bitwise-uscc) at ~$15.7M TVL. **Nearly 24 months in production** as of Jul 3, 2026.
- **Contract Upgrades:** Token implementation reports `VERSION "5"`. Earlier USCC versions (V1→V4) were upgraded through the same ProxyAdmin path used by USTB. Each version was audited prior to deployment.
- **Smart Contract Exploits:** None reported.
- **Ownership Changes:** USCC token ownership was transferred Oct 31, 2024 from [`0x8c7db8a9…`](https://etherscan.io/address/0x8c7db8a96d39f76d9f456db23d591c2fdd0e2f8a) to [`0x8abC89D9…`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) via the two-step Ownable flow ([Etherscan tx](https://etherscan.io/tx/0xd2d1c711f5f7ecf9053637145d218e33f0b22d2d26d59a63d94535e88ca46c72)).
- **TVL History ([DeFiLlama](https://defillama.com/protocol/bitwise-uscc)):**
  - Sep 2024 (first record): ~$15.7M
  - Oct 2024: ~$27M
  - Nov 21, 2025 peak: ~$496.61M
  - Jul 3, 2026: ~$136.18M public TVL; Superstate reports $162.79M AUM including book-entry
- **NAV History:** NAV launched near $10.00, sits at $11.628080 as of the latest Chainlink USCC round (updated Jul 2, 2026 13:10 UTC; verified Jul 3, 2026). Unlike USTB, NAV is **not monotonic** — the protocol's own docs warn that "daily NAV reflects mark-to-market gains and losses, including unrealized valuation changes" and that basis expansion can produce temporary NAV declines. TODO: enumerate any specific NAV-drawdown episodes; historical per-day NAV data is not available on the public Chainlink feed without scraping `NewTransmission` logs from aggregator [`0x5C00518D3d…`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF).
- **Holder Distribution:** 55 onchain holders in the latest RWA.xyz snapshot available during review. TODO: refresh current holder count via Etherscan Pro / Dune query and top-10 concentration.
- **Incidents:** None publicly reported.

## Funds Management

### Yield Sources

1. **Crypto basis (cash-and-carry):** Long spot/custodied crypto assets, short futures at CFTC-permitted Trading Venues. Current Superstate public holdings identify BTC, ETH, SOL, and XRP futures exposure, with futures on CME and an XRP futures leg on Coinbase.
2. **Staked crypto / liquid staking tokens:** Current public holdings include staked SOL and weETH exposure; staking and liquid-staking losses can flow through NAV.
3. **U.S. Treasury Bills:** Idle cash and futures-margin reserves earn short-dated Treasury yield (federal-funds-rate-like).

The fund "will trade only those digital assets for which the CFTC has permitted exchange-listed futures contracts" (per [Steakhouse overview](https://kitchen.steakhouse.financial/p/overview-of-uscc)). Superstate's current public holdings identify CME and Coinbase futures exposure, but the public documents still do not fully disclose margin policy, counterparty concentration limits, or whether the displayed venues are exhaustive over time.

### Accessibility

- **KYC Required:** Yes — **Qualified Purchaser** ($5M+ individuals, $25M+ institutions) **AND Accredited Investor** status. 29 supported jurisdictions including U.S., Cayman, BVI, Bermuda, UK, Canada, Singapore, UAE, etc.
- **Minimum Investment:** $100,000.
- **Subscriptions (Minting):**
  - **Onchain atomic via `subscribe()`:** **DISABLED** — verified onchain. Calling `subscribe(...)` reverts with `OnchainSubscriptionsDisabled()` (selector `0xdbf0cc51`). `supportedStablecoins(USDC)` returns the zero address with zero fee. **Subscriptions are processed offchain only** (T+1).
  - **Offchain:** USD wire or USDC transfer. T+1 if received before 5pm ET on a Market Day; T+2 otherwise.
  - Per docs: "There is no minimum redemption amount" but a $100K minimum applies to subscriptions unless waived.
- **Redemptions (Burning):**
  - **Onchain atomic:** **NOT AVAILABLE** — `redemptionContract()` returns `0x0` onchain. There is no RedemptionIdle contract for USCC.
  - **Offchain:** Send tokens to a redemption address **or** call `offchainRedeem(uint256)` which burns USCC. Proceeds paid as USD wire or USDC on Ethereum/Solana. T+1 if request received before 5pm ET on a Market Day; T+2 otherwise.
  - No redemption fees per docs (investor pays gas).
- **Geographic Restrictions:** 29 jurisdictions per docs. Not available to sanctioned countries.
- **Management Fee:** 0.75% annually (waived until AUM exceeds $50M — now exceeded).

### Token Mint Authority

**Mint mechanism:** Ownable — a single owner EOA controls minting.

**Mint requires backing:** **No** — `mint(address,uint256)` and `bulkMint(address[],uint256[])` are gated by `onlyOwner` and do **not** check or pull collateral onchain. Backing exists offchain at Anchorage Digital / Trading Venues and is asserted by the operator. The onchain mint is a unilateral admin action.

**Per-address mint authority** (verified onchain Jul 3, 2026, USCC token [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) | ✓ | ✓ (`adminBurn`) | `owner()` of USCC token (Ownable) | **EOA** (code size 0, nonce 589). Same EOA is `owner()` of USCC ProxyAdmin, so it can also `upgrade()` the implementation to a malicious one and effectively grant mint power to anyone. |
| (no other onchain minters) | — | — | — | The V5 token contract has no `AccessControl` / `MINTER_ROLE`; `hasRole(...)` reverts. |

**Rate limits / supply caps:** None onchain. There is no `maxMintPerBlock`, no global supply cap, no per-minter quota.

**Backing check at mint time:** **None onchain**. Backing is settled offchain; minted USCC is asserted to be 100% backed by the offchain portfolio (Anchorage cash + crypto + futures collateral + T-Bills) but this is not enforced or verified by any onchain mechanism.

### Collateralization

- **Backing Model:** **Hybrid offchain** — USCC tokens represent shares in a fund holding:
  - Spot / staked crypto assets at **Anchorage Digital Bank N.A.** and related custody / staking venues
  - Short futures positions and posted margin at **Trading Venues** (current public holdings identify CME and Coinbase exposure)
  - U.S. Treasury Bills / USTB, USD collateral, and other cash-equivalent reserves
- **Collateral Quality:**
  - T-Bills are the safest asset class globally
  - Spot / staked crypto custody carries crypto custody risk (key management, staking or liquid-staking losses, custodian operational risk)
  - **Futures-leg margin posted at trading venues is the dominant counterparty risk** — if a futures venue becomes insolvent or fails operationally, the margin and any unrealized P&L on that venue is at risk. CFTC-regulated futures clearinghouses (CME-style) significantly reduce this risk vs offshore venues, but Superstate still does not publicly disclose full counterparty concentration or margin policy.
  - Basis-trade losses flow through NAV. If futures basis widens, futures positions are forcibly unwound, or posted margin is impaired, USCC holders can realize losses on principal.
- **Manager / Sub-Advisor:**
  - **Investment manager:** **Bitwise Investment Manager, LLC** ([per superstate.com/assets/uscc](https://superstate.com/assets/uscc), accessed Jul 3, 2026)
  - **Sub-advisor:** **Superstate Advisers LLC**
  - This is a recent operational change from the prior Superstate self-managed setup and should continue to be monitored post-transition.
- **Bankruptcy Remoteness:** Fund is a series within **Superstate Asset Trust** (Delaware Statutory Trust) with inter-series liability protection — bankruptcy-remote from Superstate Inc.
- **Verification:** **Ernst & Young** annual audit. **NAV Fund Services** for independent NAV calculation. Daily NAV is **mark-to-market**, so unrealized losses on the futures leg do flow into the share price.

### Provability

- **NAV/Price Updates:** **Chainlink USCC NAV feed** [`0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9`](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9) — an OCR (off-chain reporting) aggregator wrapper around [`0x5C00518D3d…`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF). 16 Chainlink-operated transmitters reach consensus on the daily NAV from Superstate. The aggregator owner is [`0x21f73D42…`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA), a Chainlink-controlled contract (not Superstate). **This is the only onchain NAV source for USCC** — unlike USTB, USCC has no Superstate Continuous Price Oracle, so there is no linear-interpolation extrapolation between checkpoints; the price is the most recent OCR transmission only.
- **No Chainlink Proof-of-Reserves onchain:** A [Chronicle Labs PoR dashboard](https://chroniclelabs.org/dashboard/proofofasset/superstate-uscc) is referenced by Superstate but we were unable to load it during this assessment (HTTP 429); TODO confirm the live PoR feed exists and what its update cadence is.
- **Offchain Assets:** Treasury, BTC, ETH, and futures positions are all held offchain. Token holders cannot independently verify positions onchain. Independent verification layers:
  - NAV Fund Services (independent NAV agent)
  - Ernst & Young (annual audit)
  - Anchorage Digital (regulated digital-asset custody)
  - SEC regulatory framework (Reg D / Section 3(c)(7))
- **Reserve Transparency:** Superstate publishes headline NAV/AUM/yield and current holdings on [superstate.com/assets/uscc](https://superstate.com/assets/uscc). Public holdings now include asset quantities, notional values, and current futures venues, but margin balances, counterparty concentration policy, historical venue usage, and T-Bill CUSIPs are still not fully disclosed publicly.
- **NAV Mark-to-Market Risk:** Because the futures leg is mark-to-market daily, the share price reflects unrealized basis-trade P&L in real time. The protocol explicitly warns of "unrealized losses" during basis expansion. This is fundamentally different from USTB whose underlying T-Bills have a much smoother mark-to-market profile. A Yearn position redeeming through USCC's T+1/T+2 offchain process may realize losses if NAV falls before settlement.

## Liquidity Risk

- **Primary Exit:** **Offchain redemption only** — burn USCC via `offchainRedeem(uint256)` or send to a redemption address, then receive USDC/USD T+1 (before 5pm ET on Market Days) or T+2 (after 5pm or weekends/holidays).
- **No Onchain Atomic Redemption:** Verified onchain: `redemptionContract() = 0x0`. There is no USDC-backed RedemptionIdle contract like USTB has — **USCC has zero instant onchain exit capacity at any size**.
- **No DEX Liquidity:** $0 DEX volume by design. AllowList-gated transfers prevent secondary markets.
- **Transfer Restrictions:** All transfers require both sender and receiver to be on the AllowList (the same shared V3.1 contract as USTB). Removing an address from the AllowList freezes their tokens.
- **DeFi Integrations:** Smaller than USTB. [Steakhouse Financial publicly evaluated USCC](https://kitchen.steakhouse.financial/p/overview-of-uscc) for inclusion in Morpho vaults; integration status / final decision is TODO. We could not identify large Aave / Spark / M^0 integrations for USCC equivalent to those listed for USTB.
- **Stress Scenario:** In a basis-blowup scenario (futures premium collapse, exchange counterparty event, slashing of staked ETH, or simultaneous redemption surge), the fund's liquidity depends on (a) unwinding futures positions at potentially worse-than-market prices, (b) Anchorage's ability to deliver spot, and (c) the futures venues' ability to honor margin. T-Bills are highly liquid; spot BTC/ETH are highly liquid; futures positions are liquid in normal markets but can become illiquid during stress (basis spreads can widen materially before they converge). **The mark-to-market NAV will reflect this stress in real time, potentially producing principal losses for holders and realized losses for users redeeming through the offchain settlement window.**

### AllowList Freeze Risk (Critical for DeFi Integrations)

Identical to USTB: if an address is removed from the shared AllowList, USCC tokens at that address are **completely frozen with zero exit paths**:

1. `transfer` / `transferFrom` revert (AllowList checks both sender and receiver)
2. `offchainRedeem` reverts (requires AllowList status)
3. `bridge` reverts (requires AllowList)
4. No DEX fallback ($0 liquidity + AllowList-gated DEX contracts would need permission too)

The only recovery is to be re-whitelisted by Superstate or have Superstate `adminBurn` and process an offchain payment manually.

**Implication for Yearn:** Yearn's vault/strategy contract must hold an active AllowList permission. If Superstate revokes it (regulatory action, dispute, sanctions, operational error), Yearn's entire USCC position becomes frozen and unredeemable. The risk profile here matches USTB.

## Centralization & Control Risks

### Governance

**Governance Model:** Fully centralized — Superstate Inc. controls all administrative functions. No onchain governance, no DAO, no community voting.

**Key Privileged Roles (verified onchain, Jul 3, 2026):**

| Role | Address | Type | Powers |
|------|---------|------|--------|
| USCC Token Owner + USCC ProxyAdmin Owner | [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) | **EOA** | `mint`, `bulkMint`, `adminBurn`, `pause`/`unpause`, `accountingPause`/`accountingUnpause`, `setOracle`, `setRedemptionContract`, `setStablecoinConfig`, `setChainIdSupport`, `setMaximumOracleDelay`, and `upgrade()`/`upgradeAndCall()` of the USCC implementation via ProxyAdmin. **This single EOA controls both the token and its proxy admin**, matching the USTB token/ProxyAdmin ownership pattern rather than improving on it. |
| AllowList Owner (shared with USTB) | [`0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe`](https://etherscan.io/address/0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe) | **EOA** | `setEntityIdForAddress`, `setProtocolAddressPermission`, etc. Can also upgrade AllowList via its ProxyAdmin. |
| Chainlink USCC NAV Aggregator Owner | [`0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) | **Chainlink contract** | Chainlink-side governance over the OCR feed; not Superstate-controlled. |

**Critical centralization concerns specific to USCC (in addition to USTB-style risks):**

1. **Single EOA controls both token and ProxyAdmin.** This matches USTB's token/ProxyAdmin concentration (`0xad309b…` owns both on USTB). A compromise of `0x8abC89D9…` lets the attacker mint unlimited USCC AND upgrade the implementation to embed any logic. There is no multisig and no timelock.
2. **No timelock on any operation** — proxy upgrades, parameter changes, and mint/burn execute immediately.
3. **Unlimited admin mint with no onchain backing check** — the owner can call `mint(any_addr, any_amount)` without depositing collateral. The backing-vs-supply relationship is enforced offchain only.
4. **`adminBurn` confiscation** — the owner can burn tokens from any holder. Documented as a regulatory-compliance tool.
5. **NAV oracle is admin-set** — although the Chainlink aggregator is Chainlink-controlled (16 OCR nodes), the NAV value itself is reported by Superstate to the OCR network. A malicious or compromised Superstate reporter could push an incorrect NAV — onchain there is no validation against the actual portfolio.
6. **AllowList control (shared with USTB)** — can freeze any holder; can revoke whitelisted DeFi protocol addresses unilaterally.

**Mitigations (same shape as USTB):**

- Superstate states it uses Turnkey secure enclaves for admin keys. This may reduce operational key-compromise risk, but it is not verifiable onchain and does not change the contract-level fact that the owner is a single EOA.
- `Ownable2StepUpgradeable` two-step transfer
- `renounceOwnership` disabled
- Regulatory accountability: Superstate Inc. is a U.S. corporation under SEC exemptions, SEC-registered transfer agent (Superstate Services LLC), Reg D / 3(c)(7) framework

### Programmability

- **NAV pricing:** Chainlink OCR feed only. Updated as the Chainlink network transmits new rounds (cadence depends on heartbeat / deviation thresholds — TODO verify exact heartbeat for this feed). **No SuperstateOracle with linear interpolation as USTB has** — between transmissions, the onchain price is simply stale.
- **Subscriptions:** Admin-driven (`mint`/`bulkMint` only). Onchain user `subscribe()` is explicitly disabled (`OnchainSubscriptionsDisabled()`).
- **Redemptions:** User-initiated burn (`offchainRedeem`) is onchain and programmatic, but settlement is offchain (T+1/T+2). No atomic onchain payout.
- **Transfers:** AllowList enforcement on every transfer (onchain and programmatic).
- **Bridging:** Burn-and-mint to Solana (Token-2022) and Plume via `bridge()` — programmatic per chain, but only enabled chain IDs are mintable destinations.

USCC is materially **less programmatic than USTB**: no atomic onchain subscribe, no atomic onchain redeem.

### External Dependencies

1. **Anchorage Digital Bank N.A. (Critical)** — qualified custodian for spot crypto and cash. OCC-regulated. Operational failure or custodial breach is direct loss to fund holders.
2. **Futures Trading Venues (Critical)** — counterparties for short futures legs and margin. Current public holdings identify CME and Coinbase exposure, but concentration / margin policy is not fully public. Venue or clearing failure can be a direct loss.
3. **Bitwise Investment Manager (Critical)** — current investment manager. Daily portfolio management for the basis trades. Operational track record at Bitwise is strong (institutional crypto asset manager), but the recent transition still introduces post-handoff monitoring risk.
4. **U.S. Treasury Market (Critical)** — for T-Bill reserves, same as USTB.
5. **Chainlink (Medium-High)** — sole onchain NAV oracle. No fallback Superstate-run oracle, unlike USTB.
6. **Circle (Medium)** — USDC redemption rail.
7. **Ernst & Young (Low)** — annual audit.
8. **NAV Fund Services (Low)** — independent NAV calculator.
9. **Turnkey (Medium)** — admin key custody (same as USTB).
10. **Ethereum staking infrastructure (Medium, provider not disclosed)** — if any ETH leg is staked, slashing risk applies. TODO: provider identity.

## Operational Risk

- **Team:** Same as USTB. Robert Leshner (CEO, Compound Finance co-founder), Reid Cuming (COO), Jim Hiltner (BD), Dean Swennumson (Ops). ~23 employees per public reporting.
- **Funding:** $100.5M total raised; Series B of $82.5M closed January 2026 (Bain Capital Crypto, Distributed Global, Brevan Howard Digital, Galaxy Digital, Haun Ventures).
- **Documentation:** Generally comprehensive, but USCC-specific operational documentation (counterparty concentration, leverage, staking / liquid-staking provider policy, margin policy) is **noticeably thinner** than USTB documentation. The fund Offering Documents (private) presumably cover this; the public docs do not.
- **Legal Structure:**
  - **Superstate Inc.** (Delaware corporation) — investment adviser
  - **Superstate Asset Trust** (Delaware Statutory Trust) — series-based, bankruptcy-remote
  - **Superstate Advisers LLC** — Exempt Reporting Adviser (SEC)
  - **Superstate Services LLC** — SEC-registered transfer agent
  - Reg D 506(c) / Section 3(c)(7) — Qualified Purchasers and Accredited Investors
- **Manager Transition:** Superstate Inc. → Bitwise Investment Manager LLC became effective June 1, 2026 — a recent material operational change. Continued post-transition monitoring is warranted.
- **Incident Response:** Same Turnkey TEE key management as USTB. No publicly documented USCC-specific incident playbook (e.g., what happens if a futures venue fails).
- **License:** BUSL 1.1.

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Purpose | Key Events / Functions |
|----------|---------|---------|------------------------|
| USCC Token | [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c) | Token state | `Mint`, `AdminBurn`, `OffchainRedeem`, `Bridge`, `BridgeToBookEntry`, `Paused`/`Unpaused`, `AccountingPaused`/`AccountingUnpaused`, `SetOracle`, `SetRedemptionContract`, `SetStablecoinConfig`, `SetChainIdSupport`, `OwnershipTransferStarted`, `totalSupply()` |
| USCC ProxyAdmin | [`0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D`](https://etherscan.io/address/0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D) | USCC proxy upgrades | `Upgraded` event on the USCC proxy; `OwnershipTransferred` on the ProxyAdmin |
| AllowList V3.1 (shared) | [`0x02f1fA8B196d21c7b733EB2700B825611d8A38E5`](https://etherscan.io/address/0x02f1fA8B196d21c7b733EB2700B825611d8A38E5) | Permission changes | `EntityIdSet`, `ProtocolAddressPermissionSet`, `PrivateInstrumentPermissionSet` |
| Chainlink USCC NAV Oracle wrapper | [`0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9`](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9) | NAV reporting | `AnswerUpdated`, `latestRoundData()` |
| Chainlink USCC Aggregator | [`0x5C00518D3d423EC59D553Af123Be8a63B11078CF`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF) | OCR transmission | `NewTransmission`, `ConfigSet` |

### Admin EOAs to Monitor

| EOA | Role | Key Actions |
|-----|------|-------------|
| [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) | USCC Token + ProxyAdmin Owner | `mint`, `adminBurn`, `pause`, `upgrade()` USCC impl |
| [`0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe`](https://etherscan.io/address/0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe) | AllowList Owner (shared with USTB) | Add/remove addresses; revoke protocol permissions |

### Critical Monitoring Points

- **NAV/Share:** Read the Chainlink USCC feed every transmission. Unlike USTB, NAV **may decrease** during basis stress — alert on day-over-day declines >2% to investigate whether it reflects market mark-to-market or an attestation issue.
- **Admin Burns:** Monitor `AdminBurn` events — forced burns from holder addresses are critical.
- **Pause Events:** Monitor `Paused`/`Unpaused` and `AccountingPaused`/`AccountingUnpaused` on USCC token.
- **Contract Upgrades:** Monitor USCC ProxyAdmin [`0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D`](https://etherscan.io/address/0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D) for `Upgraded` events. **No timelock — upgrades are instant.**
- **AllowList Changes:** Monitor `ProtocolAddressPermissionSet` events on the shared AllowList for revocation of any contract holding USCC.
- **Ownership Transfers:** Monitor `OwnershipTransferStarted` on USCC token and ProxyAdmin.
- **Large Supply Changes:** Alert on mints/burns >5% of total supply in 24h. Current Ethereum supply: ~6.23M USCC; Superstate reports ~14.00M total shares including book-entry.
- **Offchain Disclosures:** Track Superstate Q&A / website AUM figures and Chronicle Labs PoR (if live) — the onchain `totalSupply()` × Chainlink NAV is only a backing claim if the underlying portfolio is verified independently.
- **Manager Transition (effective Jun 1, 2026):** Track for any operational disruption after the Superstate → Bitwise handoff.
- **Recommended Frequency:** Per-transmission for NAV. Hourly for pause/admin events. Daily for AllowList changes.

## Appendix: Contract Architecture

*Verified onchain Jul 3, 2026. All Superstate-controlled owners are EOAs (code size 0). No multisig, no timelock on any contract.*

```
GOVERNANCE LAYER
══════════════════════════════════════════════════════════════
  [EOA-USCC]  USCC Token owner + USCC ProxyAdmin owner
              0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1
              (single EOA, code size 0)

  [EOA-AL]    AllowList owner (shared with USTB)
              0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe

  [CL-OWN]    Chainlink USCC NAV Aggregator owner (Chainlink-controlled)
              0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA


PROXY ADMIN LAYER
═════════════════
  [PA-USCC]   USCC ProxyAdmin (owned by [EOA-USCC])
              0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D
              ── upgrade(USCC proxy) → impl 0x9b7282Cb…

  [PA-AL]     AllowList ProxyAdmin (separate; verified for USTB)
              0xb819692a58db9dd4d3b403a875439b6ca155c610


TOKEN LAYER
═══════════
  [USCC]   USCC Token (Proxy)
           0x14d60E7FDC0D71d8611742720E4C50E7a974020c
           impl: 0x9b7282Cb80baA4B1F8F6436f8D531B436BaE2A70
           VERSION "5" (SuperstateTokenV5 family)

           Admin (owner [EOA-USCC] only):
           ├── mint() / bulkMint()      ← no onchain backing check
           ├── adminBurn(address, amount)
           ├── pause() / unpause()
           ├── accountingPause() / accountingUnpause()
           ├── setOracle(newOracle)     ← currently 0x0 (no SuperstateOracle)
           ├── setRedemptionContract(newContract)
           │                            ← currently 0x0 (no RedemptionIdle)
           ├── setStablecoinConfig(stablecoin, dest, fee)
           │                            ← USDC currently unset
           ├── setChainIdSupport(chainId, supported)
           └── setMaximumOracleDelay(delay)
                                        ← currently 0

           User functions (AllowList-gated):
           ├── subscribe(...)           ← REVERTS: OnchainSubscriptionsDisabled
           ├── offchainRedeem(amount)   ← burn; settled offchain T+1
           ├── bridge(amount, dest, chainId, ...)
           ├── bridgeToBookEntry(amount)
           └── transfer / transferFrom


PROTOCOL LAYER
══════════════
  [AL] AllowList V3.1 (Proxy)            [CL] Chainlink USCC NAV Feed
       0x02f1fA8B196d21c7b733EB2700B…         0xAfFd8F5578E8590665de561b…
       owner: [EOA-AL]                        wraps aggregator 0x5C00518D…
       (SHARED WITH USTB)                     owner: [CL-OWN] (Chainlink)

       Admin:                                 Mechanics:
       ├ setEntityIdForAddress()              ├ 16 OCR transmitters
       ├ setProtocolAddressPermission()       ├ NAV reported by Superstate
       ├ setEntityAllowedFor...()             └ No interpolation between rounds
       └ transferOwnership()

       Gating: isAllowed() onchain on
       every USCC transfer/burn/bridge


EXTERNAL / UNDERLYING LAYER
════════════════════════════
  Offchain:
  ├── Anchorage Digital Bank N.A. (spot BTC/ETH + cash custody)
  ├── Trading Venues (futures + margin) — current holdings identify CME and Coinbase; margin policy not fully public
  ├── Bitwise Investment Manager (investment manager, effective Jun 1, 2026)
  ├── Ernst & Young (annual auditor)
  ├── NAV Fund Services (NAV calculation agent)
  └── U.S. Treasury Bills (reserves)

  Cross-chain destinations (via bridge()):
  ├── Solana mainnet: Token-2022 BTRR3sj1Bn2ZjuemgbeQ6SCtf84iXS81CS7UDTSxUCaK
  └── Plume mainnet: 0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf
```

**Address Legend:**

| Label | Address |
|-------|---------|
| [EOA-USCC] | [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) |
| [EOA-AL] | [`0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe`](https://etherscan.io/address/0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe) |
| [CL-OWN] | [`0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) |
| [PA-USCC] | [`0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D`](https://etherscan.io/address/0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D) |
| [PA-AL] | [`0xb819692a58db9dd4d3b403a875439b6ca155c610`](https://etherscan.io/address/0xb819692a58db9dd4d3b403a875439b6ca155c610) |
| [USCC] Token (Proxy) | [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c) |
| USCC Implementation | [`0x9b7282Cb80baA4B1F8F6436f8D531B436BaE2A70`](https://etherscan.io/address/0x9b7282Cb80baA4B1F8F6436f8D531B436BaE2A70) |
| [AL] AllowList V3.1 (Proxy) | [`0x02f1fA8B196d21c7b733EB2700B825611d8A38E5`](https://etherscan.io/address/0x02f1fA8B196d21c7b733EB2700B825611d8A38E5) |
| [CL] Chainlink USCC NAV | [`0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9`](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9) |
| Chainlink USCC Aggregator | [`0x5C00518D3d423EC59D553Af123Be8a63B11078CF`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF) |

---

## Risk Summary

### Key Strengths

1. **Institutional service-provider stack** — Anchorage Digital (OCC-regulated custodian for digital assets), Ernst & Young (auditor), NAV Fund Services (independent NAV), and Bitwise Investment Manager as current investment manager.
2. **Heavy audit coverage** — 11 0xMacro audits + ChainSecurity + Offside Labs + referenced Certora formal verification across the SuperstateTokenV5 family that USCC reuses.
3. **Bankruptcy-remote legal structure** — Delaware Statutory Trust series with inter-series liability protection; Reg D / 3(c)(7) regulatory framework; SEC-registered transfer agent.
4. **Strong team and backing** — Compound Finance founders, $100.5M raised; Bain Capital Crypto / Brevan Howard / Galaxy / Haun Ventures.
5. **Nearly 24 months in production** — incident-free operational history since Jul 2024.
6. **Same shared AllowList as USTB** — code reuse with USTB's longer operating history.

### Key Risks

1. **EOA-controlled admin with token + ProxyAdmin concentrated in a single key.** The same EOA can `mint` unlimited tokens AND `upgrade()` the implementation. No multisig, no timelock.
2. **Mark-to-market NAV with basis-trade exposure.** Unlike USTB, USCC's NAV can decrease — daily P&L from futures positions flows into the share price. Holders can suffer principal loss if basis spreads widen, futures positions are unwound at a loss, posted margin is impaired, or crypto custody / staking losses occur.
3. **Opaque counterparty and margin exposure.** Current public holdings identify CME and Coinbase futures exposure, but public docs still do not disclose margin levels, concentration limits, or whether the displayed venues are exhaustive over time. This is the dominant risk and we cannot quantify it from public information.
4. **No atomic onchain redemption** — `redemptionContract() = 0x0` onchain. Subscribe is also disabled onchain (`OnchainSubscriptionsDisabled`). All mints/redeems flow through offchain operations with T+1/T+2 settlement.
5. **Sole onchain NAV oracle is Chainlink-OCR-only** — no Superstate-run fallback price feed; between transmissions the onchain price is just stale.
6. **Small holder base (55 holders in the latest RWA.xyz snapshot; $112.52M Superstate-reported onchain network value, $136.18M DeFiLlama public TVL)** — concentrated, expected for a Qualified-Purchaser permissioned fund but a real exit-liquidity constraint.
7. **Recent manager transition to Bitwise effective Jun 1, 2026** — operational change with post-handoff risk.
8. **No formal bug bounty rewards.**

### Critical Risks

- **AllowList freeze risk** (shared with USTB) — if Superstate revokes Yearn's AllowList permission, the entire USCC position is frozen with zero exit paths.
- **Single-key compromise** — compromise of [`0x8abC89D9…`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) lets the attacker mint unlimited USCC AND upgrade the implementation to malicious code in a single transaction. No multisig, no timelock. Superstate's claimed Turnkey TEE custody is an offchain mitigation only and cannot be verified from contract state.
- **Admin burn capability** — owner can confiscate tokens from any holder via `adminBurn`.
- **Futures-venue counterparty failure** — a venue or clearing failure affecting USCC futures margin would impair the fund's NAV directly and can cause principal loss. Public holdings currently identify CME and Coinbase exposure, but we do not have public information on venue diversification policy, margin concentration limits, or stress procedures.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** → **PASS** — 11 0xMacro audits + ChainSecurity + Offside Labs + referenced Certora formal verification on the shared V5 codebase.
- [x] **Unverifiable reserves** → **BORDERLINE PASS** — Offchain reserves (crypto assets at custodians / staking venues + futures margin + T-Bills / cash-equivalent reserves), with NAV Fund Services as independent NAV agent and EY annual audit. Current public holdings are itemized, but margin balances, concentration policy, and full counterparty-risk controls are not publicly verifiable. The multiple independent attestation layers (custodian, NAV agent, auditor, SEC framework) clear the gate.
- [x] **Total centralization** → **BORDERLINE PASS** — Single EOA controls both the token and its ProxyAdmin, matching USTB's token/ProxyAdmin ownership pattern. Mitigated by Turnkey TEE key custody and Superstate's regulatory accountability (SEC-registered transfer agent, Reg D framework). This is a borderline pass because the absolute single-key blast radius remains high: the same EOA can mint/adminBurn and upgrade the token implementation with no multisig or timelock.

**Result:** Protocol passes critical gates. Proceeding to category scoring with **conservative bias** on governance and provability.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.75**

**Subcategory A: Audits — 1.5**

11 0xMacro audits + ChainSecurity + Offside Labs + Certora formal verification on the shared V5 codebase. Continuous audit relationship — each version audited before deployment. The lack of a funded bug bounty with formal monetary rewards prevents a perfect score.

**Subcategory B: Historical — 2.0**

- Nearly 24 months in production (launched Jul 15, 2024). Still just shy of the >2-year threshold for a 1 as of Jul 3, 2026.
- Sustained TVL >$50M (currently $136.18M DeFiLlama public TVL; $162.79M Superstate AUM including book-entry). >$100M only relatively recently. 2 fits the >$50M / 1-2 year band.
- Clean operational history — no exploits, no admin incidents.

**Score: (1.5 + 2.0) / 2 = 1.75/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **3.67**

**Subcategory A: Governance — 5.0**

- **Single EOA controls both USCC token AND its ProxyAdmin** — the same token/ProxyAdmin concentration pattern used by USTB.
- No multisig anywhere.
- No timelock on any operation — upgrades, parameter changes, mint, adminBurn all execute immediately.
- Per the rubric, "EOA or <3 signers" is the level-5 (Critical Gate) governance signal. The fact that the protocol clears the critical gate is on Turnkey TEE + regulatory accountability, not onchain governance.

**Subcategory B: Programmability — 3.0**

- NAV pricing: programmatic via Chainlink OCR, but **value itself is reported by Superstate** to the network. No SuperstateOracle as a second source.
- Subscriptions: **fully offchain** (onchain `subscribe()` is disabled). All mint operations are admin-driven.
- Redemptions: user burns onchain (`offchainRedeem`), settlement is offchain T+1/T+2. **No atomic onchain payout.**
- Transfers: onchain AllowList-gated, programmatic.
- Bridging: programmatic.
- Overall: meaningfully less programmatic than USTB (which has both atomic subscribe and atomic redeem). Hybrid onchain/offchain — fits the level-3 description.

**Subcategory C: External Dependencies — 3.0**

- Anchorage Digital (critical, single custodian for crypto)
- Trading Venues for futures (critical; current public holdings identify CME and Coinbase, but concentration / margin policy is not fully public)
- Bitwise (critical, current investment manager)
- Chainlink (medium-high — sole onchain NAV oracle)
- USDC / Circle (medium — redemption rail)
- Turnkey, Ernst & Young, NAV Fund Services
- More dependencies than USTB, and they sit in a more failure-prone domain (crypto futures venues).

**Score: (5.0 + 3.0 + 3.0) / 3 = 3.67/5**

#### Category 3: Funds Management (Weight: 30%) — **3.0**

**Subcategory A: Collateralization — 3.0**

- Mixed collateral: spot BTC/ETH (high quality, with custodial risk), short futures positions (counterparty risk), T-Bills (highest quality), potentially staked ETH (slashing risk).
- 100% collateralized in principle but held entirely offchain across multiple counterparties.
- Anchorage is a strong, regulated custodian for the crypto leg. Current public holdings identify CME and Coinbase futures exposure, but margin balances and concentration policy are not directly verifiable.
- The basis-trade design is sound under normal market conditions but exposes holders to mark-to-market drawdowns during basis widening.
- This fits the level-3 description: "100% collateral, some offchain; Mixed quality or newer protocols; Periodic custodian attestation."

**Subcategory B: Provability — 3.0**

- NAV is reported daily via Chainlink (independent feed) and calculated by NAV Fund Services.
- Annual audit by EY.
- **Granular risk controls (margin balances, counterparty concentration policy, historical venue usage, and T-Bill maturities) are not fully publicly disclosed** — investor-portal-only or not available in public docs.
- Chronicle Labs PoR is referenced but we could not confirm it is live (HTTP 429 during this assessment) — TODO.
- Fits level 3: "Hybrid onchain/offchain; Manual reporting by admins; Known custodian attestation."

**Score: (3.0 + 3.0) / 2 = 3.0/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **3.5**

- **No atomic onchain redemption at any size** (`redemptionContract() = 0x0`).
- **No atomic onchain subscription** (`OnchainSubscriptionsDisabled`).
- Offchain redemption T+1 (or T+2 after 5pm ET) — multi-day notice in practice for any large redemption that requires unwinding futures positions.
- No DEX liquidity; AllowList-gated transfers.
- AllowList freeze risk (shared with USTB) — zero exit paths if Superstate revokes permission.
- Same-value-asset character (USD-denominated fund) somewhat mitigates the multi-day settlement risk per the rubric note, but the mark-to-market NAV means waiting through a basis-widening episode costs holders real money.
- 55 holders only — very thin secondary-market-equivalent population.

Closer to level 4 ("Withdrawal queues or restrictions"; "<$1M") than to level 3 because the onchain instant-exit facility is **zero**, not "small." Compromise at **3.5**.

**Score: 3.5/5**

#### Category 5: Operational Risk (Weight: 5%) — **1.5**

- Team fully doxxed, prominent founders (Compound Finance lineage).
- $100.5M raised from top-tier investors.
- Service-provider stack: Anchorage Digital, Bitwise, Ernst & Young, NAV Fund Services — all institutional-grade.
- Documentation is comprehensive on USTB; USCC-specific public documentation still has gaps around leverage, staking / liquid-staking provider policy, counterparty concentration, and margin controls.
- The Jun 1, 2026 manager transition introduces near-term post-handoff risk.
- Clear legal structure (Delaware Statutory Trust series, SEC-registered transfer agent).

Slightly worse than USTB (1.0) because of the public documentation gaps on the basis-trade execution and the recent manager transition.

**Score: 1.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.75 | 20% | 0.35 |
| Centralization & Control | 3.67 | 30% | 1.10 |
| Funds Management | 3.0 | 30% | 0.90 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.95 / 5.0** |

**Optional Modifiers:**

- Live >2 years with no incidents (-0.5): **Not applied** — nearly 24 months as of Jul 3, 2026, still short of 2 years.
- TVL maintained >$500M for >1 year (-0.5): **Not applied** — current DeFiLlama public TVL is $136.18M; Superstate AUM including book-entry is $162.79M.

After modifier review, final score remains **2.95**. No additional score adjustment is applied; the single-EOA token/ProxyAdmin control and offchain counterparty / margin opacity are already reflected in the Centralization & Control and Funds Management category scores.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK**

USCC is materially **higher risk than USTB** despite sharing infrastructure. The principal drivers are (a) the crypto-basis-trade strategy itself, which introduces futures-venue counterparty exposure and mark-to-market NAV volatility, (b) the same single-EOA token/ProxyAdmin control pattern as USTB, with immediate mint/adminBurn/upgrade authority and no timelock, (c) no atomic onchain subscribe or redeem, and (d) thinner public disclosure on operational specifics (counterparty concentration, margin policy, staking / liquid-staking provider policy, leverage). These are partly offset by the same audit/legal/custodial stack as USTB and nearly 24 months of incident-free operation.

**Key conditions for exposure:**

1. Strict size limit reflecting offchain-only redemption (no instant exit).
2. Monitor [`0x8abC89D9…`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) for any ownership transfer, mint > 5% of supply, `adminBurn`, or proxy upgrade event.
3. Monitor the shared AllowList [`0x02f1fA8B…`](https://etherscan.io/address/0x02f1fA8B196d21c7b733EB2700B825611d8A38E5) for any `ProtocolAddressPermissionSet` change affecting Yearn's vault/strategy contract.
4. Track Chainlink USCC NAV for day-over-day declines >2% (basis-stress signal).
5. Continue post-transition monitoring after the Bitwise manager handoff (effective Jun 1, 2026).
6. Continue to demand greater disclosure on margin policy, counterparty concentration, and staking / liquid-staking provider policy before scaling exposure.

**Score-improving triggers:**

- **Multisig adoption** on USCC token owner / ProxyAdmin owner (would materially improve Centralization score).
- **Timelock** on contract upgrades and critical parameter changes.
- **Public disclosure of margin/leverage policy and counterparty concentration limits** (would improve Provability and reduce counterparty opacity).
- **Chainlink Proof-of-Reserves live** for USCC (would improve Provability).
- **Atomic onchain redemption** facility (would improve Liquidity).
- **Formal funded bug bounty.**

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (Oct 2026) — shorter interval than USTB due to (a) the recent Bitwise manager transition effective Jun 1, 2026, (b) basis-trade NAV volatility warrants more frequent review, and (c) onchain-redemption infrastructure could change.
- **TVL-based:** Reassess if AUM changes by more than 30% (more sensitive than USTB given thinner holder base).
- **Incident-based:** Reassess after any exploit, admin key compromise, contract upgrade, AllowList policy change, manager transition issue, or any large NAV drawdown (>5% in a single day).
- **Strategy-based:** Reassess on any change to futures venues, ETH staking provider, leverage policy, or asset mix (e.g., addition of new basis pairs).
- **Governance-based:** Reassess if Superstate adopts multisig or timelock for USCC admin controls.
