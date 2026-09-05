# Protocol Risk Assessment: Superstate USCC

- **Assessment Date:** July 3, 2026 (Updated: September 5, 2026)
- **Token:** USCC
- **Chain:** Ethereum
- **Token Address:** [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c)
- **Final Score: 2.45/5.0**

## Overview + Links

USCC is the **Bitwise Crypto Carry Fund** (formerly Superstate Crypto Carry Fund) — a tokenized investment fund issued through the Superstate infrastructure that runs **crypto cash-and-carry (basis) trades** across multiple crypto assets alongside U.S. Treasury Bills / USTB and cash collateral. The fund's investment objective is to capture the differential between spot and futures prices on CFTC-regulated venues while idle collateral earns short-term rates.

USCC uses a **price-appreciation model** (non-rebasing). Unlike USTB, USCC's NAV **is not monotonic** — daily NAV reflects mark-to-market gains and losses on the futures leg, so the share price can decrease during basis-expansion episodes even when the trade economics remain intact (per the protocol's own [risk disclosure](https://superstate.com/assets/uscc#disclaimers)).

This means USCC holders can suffer **principal loss**, not merely delayed yield or temporary illiquidity. Losses can arise from basis widening, forced futures unwinds, futures-venue counterparty failure, crypto custody loss, staking / liquid-staking losses, or adverse mark-to-market movement during the offchain redemption window.

Investors must clear KYC/AML, be Qualified Purchasers and Accredited Investors, get whitelisted in the same shared AllowList contract used by USTB, then subscribe/redeem either onchain (offchain-settled) or via book-entry shares.

- **Current NAV/Share:** $11.725624 ([Chainlink USCC NAV feed](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9), latest round updated September 4, 2026 13:18 UTC)
- **Ethereum Supply:** 5,761,292.38 USCC ($67.55M at the current NAV, September 5, 2026)
- **NAV-statement Shares (incl. book-entry):** 12,236,723.87 USCC ([Superstate](https://superstate.com/assets/uscc), NAV effective September 3, 2026)
- **Total AUM:** $143.48M ([Superstate](https://superstate.com/assets/uscc), NAV effective September 3, 2026)
- **Public TVL:** $103.41M ([DeFiLlama](https://defillama.com/protocol/bitwise-uscc), September 5, 2026), up 74.3% over 30 days from $59.34M
- **30-day SEC Yield:** 6.68% (variable, depends on basis spread)
- **Management Fee:** 0.75% annually
- **Minimum Investment:** $100,000

**Share-count timing:** the Bitwise network-distribution table is a realtime balance and totals 12,849,759.44 shares as of September 4, while the 12,236,723.87-share AUM statement is effective September 3. Two Ethereum mints on September 4 added 613,035.402635 USCC ([604,173.998756 USCC](https://etherscan.io/tx/0x3273f52b4a2c587d7310a6dcaff5369122fd7387c644c8f1fba5ff986c13e55f) and [8,861.403879 USCC](https://etherscan.io/tx/0xd66e8791290955f2549e3dbc984146d61ca5ca19a6c0089a404c5c9fa85b160f)), explaining all but 0.164482 USCC of the difference. The figures represent different cutoffs rather than a material reserve inconsistency.

**Links:**

- [Protocol Documentation](https://docs.superstate.com/)
- [Bitwise USCC Fund Page](https://bitwiseinvestments.com/crypto-funds/uscc)
- [Bitwise USCC Fact Sheet](https://bitwise-materials.s3.us-east-1.amazonaws.com/public/fact-sheets/private_uscc.pdf)
- [USCC Fund Info](https://superstate.com/assets/uscc)
- [USCC Docs Page](https://docs.superstate.com/investors/tokenized-funds/available-funds/bitwise-uscc)
- [Smart Contract Addresses](https://docs.superstate.com/investors/smart-contracts)
- [Security Documentation](https://docs.superstate.com/investors/security)
- [GitHub (USTB/USCC contracts)](https://github.com/superstateinc/ustb)
- [DeFiLlama](https://defillama.com/protocol/bitwise-uscc)
- [Etherscan Token Page](https://etherscan.io/token/0x14d60E7FDC0D71d8611742720E4C50E7a974020c)
- [Chainlink USCC NAV Feed](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9)
- [RWA.xyz](https://app.rwa.xyz/assets/USCC)
- [Steakhouse Overview](https://kitchen.steakhouse.financial/p/overview-of-uscc)
- [USTB Risk Report (sibling product)](https://github.com/yearn/risk-score/blob/master/reports/report/superstate-ustb.md)

## Contract Addresses

*Snapshot date: September 5, 2026.*

| Contract | Address |
|----------|---------|
| USCC Token (Proxy) | [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c) |
| USCC Implementation (`FundToken`, `VERSION "1.3.0"`) | [`0x7e906c0006d3F08bE94EF4685c59b5Cde4fb4feF`](https://etherscan.io/address/0x7e906c0006d3F08bE94EF4685c59b5Cde4fb4feF) |
| USCC ProxyAdmin | [`0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D`](https://etherscan.io/address/0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D) |
| AllowList V3.1 (Proxy, **shared with USTB**) | [`0x02f1fA8B196d21c7b733EB2700B825611d8A38E5`](https://etherscan.io/address/0x02f1fA8B196d21c7b733EB2700B825611d8A38E5) |
| AllowList Implementation (`VERSION "3.1"`) | [`0x2f67d98bd20D9580F52Efa5FF70EDaEd9F2f316D`](https://etherscan.io/address/0x2f67d98bd20D9580F52Efa5FF70EDaEd9F2f316D) |
| AllowList ProxyAdmin | [`0xb819692a58db9dd4d3b403a875439b6ca155c610`](https://etherscan.io/address/0xb819692a58db9dd4d3b403a875439b6ca155c610) |
| Chainlink USCC NAV Oracle (OffchainAggregator wrapper) | [`0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9`](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9) |
| Chainlink USCC Aggregator (OCR-style) | [`0x5C00518D3d423EC59D553Af123Be8a63B11078CF`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF) |
| Aggregator owner (Chainlink-controlled) | [`0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) |

### Owner Addresses

As of September 5, 2026, **all Superstate-controlled admin keys are EOAs**:

Onchain, these owners are plain EOAs. Superstate states that admin keys use Turnkey secure enclaves, but that is an offchain operational control and cannot be independently verified from Ethereum contract state. This report therefore scores the owner addresses as EOAs for governance purposes; any MPC / TEE / Turnkey protection is treated only as an offchain mitigation.

| Role | Address |
|------|---------|
| USCC Token Owner + USCC ProxyAdmin Owner (same EOA) | [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) |
| AllowList Owner (shared with USTB) | [`0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe`](https://etherscan.io/address/0x7747940aDBc7191f877a9B90596E0DA4f8deb2Fe) |
| Chainlink USCC NAV Aggregator Owner (Chainlink, not Superstate) | [`0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA) |

Note that the prior USCC owner was [`0x8c7db8a96d39f76d9f456db23d591c2fdd0e2f8a`](https://etherscan.io/address/0x8c7db8a96d39f76d9f456db23d591c2fdd0e2f8a); ownership was transferred on Oct 31, 2024 ([tx `0xd2d1c711…`](https://etherscan.io/tx/0xd2d1c711f5f7ecf9053637145d218e33f0b22d2d26d59a63d94535e88ca46c72)) via the `Ownable2StepUpgradeable` flow.

## Audits and Due Diligence Disclosures

USCC uses the source-verified `FundToken` v1.3.0 implementation and the same shared AllowList V3.1 contract as USTB. The [Superstate Security page](https://docs.superstate.com/investors/security) lists **11 numbered 0xMacro audits**, plus ChainSecurity, Solana/AllowList reviews, and a Certora formal-verification report. Earlier 0xMacro scopes cover USCC/SuperstateToken, redemption, the shared token components, and AllowList V3; however, the published audit list does not map a report explicitly to the integrated `FundToken` v1.2.0/v1.3.0 implementation deployed in July 2026. A-10 and A-11 scope DIP/EquityToken rather than `FundToken`.

**Audit scope limitation:** no published audit report or hash-to-scope mapping explicitly covers the integrated `FundToken` v1.2.0/v1.3.0 deployment. The implementation is source-verified and much of its component surface has prior review coverage, but the deployed integration and storage migration cannot be tied to a public independent-review artifact.

### Audit History

| # | Firm | Approx. Date | Scope |
|---|------|---|---|
| A-1..6 | **0xMacro** | 2023–2025 | SuperstateToken / USCC, oracle, subscription, and redemption iterations — see [individual reports](https://0xmacro.com/library/audits/superstate-2) and the [USTB report](https://github.com/yearn/risk-score/blob/master/reports/report/superstate-ustb.md) |
| A-7 | **0xMacro** | 2025 | Solana AllowList program |
| A-8 | **0xMacro** | 2025 | EquityToken plus shared `AccountingPausable`, `Allowlistable`, `Bridgeable`, `Permittable`, and `SuperstateTokenCore` components |
| A-9 | **0xMacro** | 2025 | AllowList V3 |
| A-10..11 | **0xMacro** | Nov 2025 – Feb 2026 | DIP / EquityToken scopes; not the current integrated `FundToken` ([A-10](https://0xmacro.com/library/audits/superstate-10), [A-11](https://0xmacro.com/library/audits/superstate-11)) |
| -- | **ChainSecurity** | 2023 | [Compound SUPTB (original USTB token)](https://chainsecurity.com/security-audit/compound-suptb/) |
| -- | **Certora** | April 2025 | [Formal verification](https://1275722710-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FvEZgAuuCGOpJUFqcgO0l%2Fuploads%2Fv0ktODEvUrKfIVnyeNkN%2FSuperstat%20audit%20report%20by%20Certora.pdf?alt=media&token=4d2af22c-57cc-4c0d-a11e-6867a48049e7) |

**Smart Contract Complexity:** Moderate. Standard upgradeable EIP-1967 transparent proxy with canonical implementation/admin slots, ERC-7201 namespaced component storage in `FundToken` v1.3.0, AllowList-gated transfers, `Ownable2StepUpgradeable` access, EIP-2612 permit, and issuer-operated burn-and-mint bridging between the EVM deployments.

A key observation onchain: **USCC has a strict subset of the current FundToken's capabilities enabled**:

- `superstateOracle() = 0x0` — no Superstate Continuous Price Oracle attached
- `redemptionContract() = 0x0` — no RedemptionIdle / atomic onchain redemption
- `supportedStablecoins(USDC) = 0x0` — no onchain stablecoin subscribe config
- `isChainIdSupported(0) = true` — book-entry conversion is enabled
- `isChainIdSupported(98866) = true` — Plume is the only enabled onchain destination from Ethereum
- `isChainIdSupported(900) = false` — Solana is not an enabled destination; Superstate's documentation says SVM bridging is unsupported and requires redeeming/re-purchasing to change networks
- `subscribe()` - reverts with `OnchainSubscriptionsDisabled()` (selector `0xdbf0cc51`)

So **all USCC mint operations are admin-driven** (`mint`/`bulkMint` by the owner EOA). On Ethereum, user actions are `transfer` (AllowList-gated), `offchainRedeem` (burn, settled offchain T+1/T+2), `bridge` to Plume, and `bridgeToBookEntry`. Solana USCC remains live, but movements to or from Solana use Superstate's offchain redemption/tokenization workflow rather than the EVM `bridge()` path.

### Bug Bounty

- **Platform:** Self-hosted (security@superstate.co)
- **Formal Rewards:** None — "Superstate does not have a formal reward policy"
- **Safe Harbor:** CFAA and DMCA safe harbor language for good-faith researchers
- **Note:** Same weakness as USTB. Not on the SEAL Safe Harbor registry.

## Historical Track Record

- **Fund Launch:** July 15, 2024 onchain (first mint at [block 20312293](https://etherscan.io/tx/0xeefda6ce766bca7c431bb6ef157b4b78925d9a0a3527a811d2ea54e41485fb1b), Unix ts 1721051099). DeFiLlama [first records Sep 9, 2024](https://defillama.com/protocol/bitwise-uscc) at ~$15.7M TVL. The fund has now operated for **more than two years**.
- **Contract Upgrades:** The token moved from the legacy V5 implementation to `FundToken` v1.2.0 on July 20, 2026 ([upgrade](https://etherscan.io/tx/0xe38fb441aa385cfe91eada867aab14698fbf90acd6ef694e72bfadf1f59f0990), [migration initialization](https://etherscan.io/tx/0x87155971d23c3f2200061ff8fa066ea2ae7382c60d9013a67f196ee37659d883)), then to v1.3.0 on July 21, 2026 ([upgrade](https://etherscan.io/tx/0x73b4604e54b163e843f1631d54e329fbaf1b1f036b43a6d2117580beaf0cbcc5)). The migration enabled book-entry conversion and Plume bridging. No ownership, oracle, redemption, stablecoin-config, pause, accounting-pause, or `AdminBurn` events occurred from July 3 through September 5, 2026.
- **Smart Contract Exploits:** None reported.
- **Ownership Changes:** USCC token ownership was transferred Oct 31, 2024 from [`0x8c7db8a9…`](https://etherscan.io/address/0x8c7db8a96d39f76d9f456db23d591c2fdd0e2f8a) to [`0x8abC89D9…`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) via the two-step Ownable flow ([Etherscan tx](https://etherscan.io/tx/0xd2d1c711f5f7ecf9053637145d218e33f0b22d2d26d59a63d94535e88ca46c72)); no subsequent transfer was observed.
- **TVL History ([DeFiLlama](https://defillama.com/protocol/bitwise-uscc)):**
  - Sep 2024 (first record): ~$15.7M
  - Oct 2024: ~$27M
  - Nov 21, 2025 peak: ~$496.61M
  - Aug 8, 2026: ~$59.34M
  - Sep 5, 2026: ~$103.41M public TVL; Superstate reports $143.48M AUM including book-entry
- **NAV History:** NAV launched near $10.00 and is $11.725624 in the latest Chainlink round (updated September 4, 2026 13:18 UTC). Unlike USTB, NAV is **not monotonic**: mark-to-market gains and losses, including unrealized changes, flow through daily NAV.
- **Incidents:** None publicly reported.

## Funds Management

### Yield Sources

1. **Crypto basis (cash-and-carry):** Long spot/custodied crypto assets, short futures at CFTC-permitted Trading Venues. Current Bitwise public holdings identify BTC, ETH, SOL, and XRP exposure, with futures on CME and an XRP futures leg on Coinbase.
2. **Staked crypto / liquid staking tokens:** Current public holdings include staked SOL, weETH, and a small JitoSOL position; staking and liquid-staking losses can flow through NAV.
3. **U.S. Treasury Bills:** Idle cash and futures-margin reserves earn short-dated Treasury yield (federal-funds-rate-like).

The fund "will trade only those digital assets for which the CFTC has permitted exchange-listed futures contracts" (per [Steakhouse overview](https://kitchen.steakhouse.financial/p/overview-of-uscc)). Bitwise's current public holdings identify CME and Coinbase futures exposure, but the public documents still do not fully disclose margin policy, counterparty concentration limits, or whether the displayed venues are exhaustive over time.

**Public holdings snapshot:** Bitwise publishes current USCC holdings on its [USCC fund page](https://bitwiseinvestments.com/crypto-funds/uscc). The table below uses the public holdings shown there as of **September 4, 2026**. Holdings are unaudited and may change at the investment manager's discretion.

| Holding | Quantity | Implied Yield | Notional Value | Portfolio % | Notes |
|---------|---------:|--------------:|---------------:|------------:|-------|
| USD Collateral | 57,540,700.00 | 1.84% | $57.54M | 35.55% | Cash / margin collateral |
| USTB | 681,058.68 | 3.47% | $7.63M | 4.71% | Tokenized T-Bill exposure |
| Bitcoin Custody | 267.20 BTC | 0.00% | $21.32M | 13.18% | Spot crypto custody |
| Bitcoin Collateral | 65.00 BTC | 0.00% | $0 | 0.00% | Reported collateral quantity; no notional assigned in the public table |
| Ether Custody | 1,267.16 ETH | 0.00% | $3.11M | 1.92% | Spot crypto custody |
| Ether Collateral | 0 ETH | 0.00% | $0 | 0.00% | — |
| Solana Custody | -9,318.31 SOL | 0.00% | -$0.95M | -0.59% | Negative custody balance as published |
| Solana Collateral | 0 SOL | 0.00% | $0 | 0.00% | — |
| Solana Staked | 196,037.83 SOL | 6.29% | $19.94M | 12.32% | Staking / validator risk |
| EtherFi Wrapped eETH | 13,501.49 weETH | 2.47% | $36.58M | 22.60% | Liquid-staking-token risk |
| Ripple Custody | 11,921,438.36 XRP | 0.00% | $16.68M | 10.30% | Spot crypto custody |
| JitoSOL Custody | 4.02 JitoSOL | 5.53% | $532 | 0.00% | Small liquid-staking-token position |
| BTC Future SEP26 (Coinbase) | -265.00 | 6.66% | -$21.25M | -13.13% | Short futures hedge |
| ETH Future SEP26 (Coinbase) | -240.00 | 6.84% | -$0.59M | -0.37% | Short futures hedge |
| ETH Future SEP26 (CME) | -15,750.00 | 5.75% | -$38.81M | -23.98% | Short futures hedge |
| SOL Future SEP26 (CME) | -183,500.00 | -0.88% | -$18.65M | -11.52% | Short futures hedge |
| XRP Future SEP26 (Coinbase) | -11,640,000.00 | 13.93% | -$16.41M | -10.14% | Short futures hedge |

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

**Per-address mint authority** (verified onchain September 5, 2026, USCC token [`0x14d60E7FDC0D71d8611742720E4C50E7a974020c`](https://etherscan.io/address/0x14d60E7FDC0D71d8611742720E4C50E7a974020c)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) | ✓ | ✓ (`adminBurn`) | `owner()` of USCC token (Ownable) | **EOA** (code size 0, nonce 624). Same EOA is `owner()` of USCC ProxyAdmin, so it can also `upgrade()` the implementation to a malicious one and effectively grant mint power to anyone. |
| (no other onchain minters) | — | — | — | The current `FundToken` contract has no `AccessControl` / `MINTER_ROLE`; minting remains owner-only. |

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
  - **Investment manager:** **Bitwise Investment Manager, LLC** ([per superstate.com/assets/uscc](https://superstate.com/assets/uscc), accessed September 5, 2026)
  - **Sub-advisor:** **Superstate Advisers LLC**
  - This is a recent operational change from the prior Superstate self-managed setup and should continue to be monitored post-transition.
- **Bankruptcy Remoteness:** Fund is a series within **Superstate Asset Trust** (Delaware Statutory Trust) with inter-series liability protection — bankruptcy-remote from Superstate Inc.
- **Verification:** **Ernst & Young** annual audit. **NAV Fund Services** for independent NAV calculation. Daily NAV is **mark-to-market**, so unrealized losses on the futures leg do flow into the share price.

### Provability

- **NAV/Price Updates:** **Chainlink USCC NAV feed** [`0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9`](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9) — an OCR (off-chain reporting) aggregator wrapper around [`0x5C00518D3d…`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF). 16 Chainlink-operated transmitters reach consensus on the daily NAV from Superstate. The aggregator owner is [`0x21f73D42…`](https://etherscan.io/address/0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA), a Chainlink-controlled contract (not Superstate). **This is the only onchain NAV source for USCC** — unlike USTB, USCC has no Superstate Continuous Price Oracle, so there is no linear-interpolation extrapolation between checkpoints; the price is the most recent OCR transmission only.
- **Offchain Assets:** Cash collateral, USTB / Treasury exposure, spot crypto, staked / liquid-staked crypto, and futures positions are all held offchain. Token holders cannot independently verify positions onchain. Independent verification layers:
  - NAV Fund Services (independent NAV agent)
  - Ernst & Young (annual audit)
  - Anchorage Digital (regulated digital-asset custody)
  - SEC regulatory framework (Reg D / Section 3(c)(7))
- **Reserve Transparency:** Bitwise publishes headline NAV/AUM/yield, network balances, DeFi integrations, and current holdings on [bitwiseinvestments.com/crypto-funds/uscc](https://bitwiseinvestments.com/crypto-funds/uscc). Public holdings now include asset quantities, implied yields, notional values, portfolio weights, and current futures venues, but margin balances, counterparty concentration policy, historical venue usage, and T-Bill / USTB look-through details are still not fully disclosed publicly.
- **Share-Supply Reconciliation:** The apparent 613,035.57-share gap is a cutoff difference: the AUM statement is effective September 3, while the realtime network total includes 613,035.402635 USCC minted on Ethereum on September 4. The residual is 0.164482 USCC.
- **NAV Mark-to-Market Risk:** Because the futures leg is mark-to-market daily, the share price reflects unrealized basis-trade P&L in real time. The protocol explicitly warns of "unrealized losses" during basis expansion. This is fundamentally different from USTB whose underlying T-Bills have a much smoother mark-to-market profile.

## Liquidity Risk

- **Primary Exit:** **Offchain redemption only** — burn USCC via `offchainRedeem(uint256)` or send to a redemption address, then receive USDC/USD T+1 (before 5pm ET on Market Days) or T+2 (after 5pm or weekends/holidays).
- **No Onchain Atomic Redemption:** Verified onchain: `redemptionContract() = 0x0`. There is no USDC-backed RedemptionIdle contract like USTB has — **USCC has zero instant onchain exit capacity at any size**.
- **No DEX Liquidity:** $0 DEX volume by design. AllowList-gated transfers prevent secondary markets.
- **Transfer Restrictions:** All transfers require both sender and receiver to be on the AllowList (the same shared V3.1 contract as USTB). Removing an address from the AllowList freezes their tokens.
- **DeFi Integrations:** Smaller than USTB but live. Bitwise reports Aave on Ethereum (4.35M USCC / $51.01M), Kamino on Solana (378,573 USCC / $4.44M), and two de minimis Morpho positions on Ethereum as of September 5, 2026. See the active [Morpho market](https://app.morpho.org/ethereum/market/0x1a9ccaca2dba9469cd9cba3d077466761b05f465c412d2bf2c71614c4963dd84/uscc-usdc#market). RWA.xyz reports 53 wallets holding USCC across networks; Etherscan reports 46 Ethereum holders.
- **Stress Scenario:** In a basis-blowup scenario (futures premium collapse, exchange counterparty event, staking / liquid-staking impairment, or simultaneous redemption surge), the fund's liquidity depends on (a) unwinding futures positions at potentially worse-than-market prices, (b) Anchorage's and related venues' ability to deliver spot / staked assets, and (c) the futures venues' ability to honor margin. T-Bills and USTB are highly liquid; major spot crypto is normally liquid but can gap during stress; futures positions can become illiquid during stress because basis spreads can widen materially before they converge. **The mark-to-market NAV will reflect this stress in real time, potentially producing principal losses for holders and realized losses for users redeeming through the offchain settlement window.**

### AllowList Freeze Risk (Critical for DeFi Integrations)

Identical to USTB: if an address is removed from the shared AllowList, USCC tokens at that address are **completely frozen with zero exit paths**:

1. `transfer` / `transferFrom` revert (AllowList checks both sender and receiver)
2. `offchainRedeem` reverts (requires AllowList status)
3. `bridge` reverts (requires AllowList)
4. No DEX fallback ($0 liquidity + AllowList-gated DEX contracts would need permission too)

The only recovery is to be re-whitelisted by Superstate or have Superstate `adminBurn` and process an offchain payment manually.

## Centralization & Control Risks

### Governance

**Governance Model:** Fully centralized — Superstate Inc. controls all administrative functions. No onchain governance, no DAO, no community voting.

**Key Privileged Roles (verified onchain, September 5, 2026):**

| Role | Address | Type | Powers |
|------|---------|------|--------|
| USCC Token Owner + USCC ProxyAdmin Owner | [`0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) | **EOA** | `mint`, `bulkMint`, `adminBurn`, `pause`/`unpause`, `accountingPause`/`accountingUnpause`, `setOracle`, `setRedemptionContract`, `setStablecoinConfig`, `setChainIdSupport`, `setMaximumOracleDelay`, `setAllowlist`, `setIsPublicInstrument`, `setName`, `setSymbol`, and `upgrade()`/`upgradeAndCall()` of the USCC implementation via ProxyAdmin. **This single EOA controls both the token and its proxy admin**, matching the USTB token/ProxyAdmin ownership pattern rather than improving on it. |
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

- **NAV pricing:** Chainlink OCR feed only. Updated as the Chainlink network transmits new rounds (cadence depends on heartbeat / deviation thresholds).
- **Subscriptions:** Admin-driven (`mint`/`bulkMint` only). Onchain user `subscribe()` is explicitly disabled (`OnchainSubscriptionsDisabled()`).
- **Redemptions:** User-initiated burn (`offchainRedeem`) is onchain and programmatic, but settlement is offchain (T+1/T+2). No atomic onchain payout.
- **Transfers:** AllowList enforcement on every transfer (onchain and programmatic).
- **Bridging:** The issuer-operated burn-and-mint path is enabled from Ethereum to Plume (`chainId 98866`). Book-entry conversion is also enabled. Solana has live supply, but Superstate documents SVM bridging as unsupported; changing between EVM and Solana requires offchain redemption and re-tokenization.

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
10. **Staking / liquid-staking infrastructure (Medium)** — current holdings include staked SOL, weETH, and JitoSOL exposure. Slashing, validator, liquid-staking-token, or staking-provider failures can flow through NAV; public materials do not fully describe provider concentration or risk controls.

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
| USCC ProxyAdmin | [`0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D`](https://etherscan.io/address/0x2Bb7B8B4dF7fD96baF7CB9a2Ce9e292eCd5BAF3D) | USCC proxy upgrades | `Upgraded` event on the USCC proxy; implementation slot; `OwnershipTransferred` on the ProxyAdmin |
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
- **Contract Upgrades:** Monitor `Upgraded` events and the canonical EIP-1967 implementation slot on USCC. The July 20–21 migration changed the implementation twice without a timelock; upgrades are instant.
- **AllowList Changes:** Monitor `ProtocolAddressPermissionSet` events on the shared AllowList for revocation of any contract holding USCC.
- **Ownership Transfers:** Monitor `OwnershipTransferStarted` on USCC token and ProxyAdmin.
- **Large Supply Changes:** Alert on mints/burns >5% of total supply in 24h.
- **Manager Transition (effective Jun 1, 2026):** Track for any operational disruption after the Superstate → Bitwise handoff.
- **Recommended Frequency:** Per-transmission for NAV. Hourly for pause/admin events. Daily for AllowList changes.

## Appendix: Contract Architecture

*Verified onchain September 5, 2026. All Superstate-controlled owners are EOAs (code size 0). No multisig or timelock controls the token or AllowList upgrade paths.*

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
              ── upgrade(USCC proxy) → impl 0x7e906c00…

  [PA-AL]     AllowList ProxyAdmin (separate; verified for USTB)
              0xb819692a58db9dd4d3b403a875439b6ca155c610


TOKEN LAYER
═══════════
  [USCC]   USCC Token (Proxy)
           0x14d60E7FDC0D71d8611742720E4C50E7a974020c
           impl: 0x7e906c0006d3F08bE94EF4685c59b5Cde4fb4feF
           VERSION "1.3.0" (FundToken; ERC-7201 component storage)

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
  ├── Anchorage Digital Bank N.A. and related venues (spot / staked crypto + cash custody)
  ├── Trading Venues (futures + margin) — current holdings identify CME and Coinbase; margin policy not fully public
  ├── Bitwise Investment Manager (investment manager, effective Jun 1, 2026)
  ├── Ernst & Young (annual auditor)
  ├── NAV Fund Services (NAV calculation agent)
  └── U.S. Treasury Bills (reserves)

  Cross-chain state:
  ├── Plume mainnet via bridge(): 0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf
  │   VERSION 1.3.0; same owner EOA; 1,440,926.89 USCC supply
  └── Solana Token-2022: BTRR3sj1Bn2ZjuemgbeQ6SCtf84iXS81CS7UDTSxUCaK
      808,371.22 USCC supply; not bridge-connected per current Superstate docs
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
| USCC Implementation | [`0x7e906c0006d3F08bE94EF4685c59b5Cde4fb4feF`](https://etherscan.io/address/0x7e906c0006d3F08bE94EF4685c59b5Cde4fb4feF) |
| [AL] AllowList V3.1 (Proxy) | [`0x02f1fA8B196d21c7b733EB2700B825611d8A38E5`](https://etherscan.io/address/0x02f1fA8B196d21c7b733EB2700B825611d8A38E5) |
| [CL] Chainlink USCC NAV | [`0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9`](https://etherscan.io/address/0xAfFd8F5578E8590665de561bdE9E7BAdb99300d9) |
| Chainlink USCC Aggregator | [`0x5C00518D3d423EC59D553Af123Be8a63B11078CF`](https://etherscan.io/address/0x5C00518D3d423EC59D553Af123Be8a63B11078CF) |

---

## Risk Summary

### Key Strengths

1. **Institutional service-provider stack** — Anchorage Digital (OCC-regulated custodian for digital assets), Ernst & Young (auditor), NAV Fund Services (independent NAV), and Bitwise Investment Manager as current investment manager.
2. **Substantial audit coverage** — 11 0xMacro reviews plus ChainSecurity, Solana/AllowList reviews, and Certora verification cover earlier token versions and shared components; the current FundToken integration still needs an explicit public scope mapping.
3. **Bankruptcy-remote legal structure** — Delaware Statutory Trust series with inter-series liability protection; Reg D / 3(c)(7) regulatory framework; SEC-registered transfer agent.
4. **Strong team and backing** — Compound Finance founders, $100.5M raised; Bain Capital Crypto / Brevan Howard / Galaxy / Haun Ventures.
5. **More than two years in production** — incident-free operational history since July 2024.
6. **Same shared AllowList as USTB** — code reuse with USTB's longer operating history.

### Key Risks

1. **EOA-controlled admin with token + ProxyAdmin concentrated in a single key.** The same EOA can `mint` unlimited tokens AND `upgrade()` the implementation. No multisig, no timelock.
2. **Mark-to-market NAV with basis-trade exposure.** Unlike USTB, USCC's NAV can decrease — daily P&L from futures positions flows into the share price. Holders can suffer principal loss if basis spreads widen, futures positions are unwound at a loss, posted margin is impaired, or crypto custody / staking / liquid-staking losses occur.
3. **Opaque counterparty and margin exposure.** Current public holdings identify CME and Coinbase futures exposure, but public docs still do not disclose margin levels, concentration limits, or whether the displayed venues are exhaustive over time. This is the dominant risk and we cannot quantify it from public information.
4. **No atomic onchain redemption** — `redemptionContract() = 0x0` onchain. Subscribe is also disabled onchain (`OnchainSubscriptionsDisabled`). All mints/redeems flow through offchain operations with T+1/T+2 settlement.
5. **Sole onchain NAV oracle is Chainlink-OCR-only** — no Superstate-run fallback price feed; between transmissions the onchain price is just stale.
6. **Small holder base (53 multi-chain wallets per RWA.xyz; 46 Ethereum holders) and no secondary liquidity** — concentrated, expected for a Qualified-Purchaser permissioned fund but a real exit-liquidity constraint. Public TVL is $103.41M.
7. **Current implementation audit scope is unclear.** Published reports do not explicitly map to the deployed FundToken v1.2/v1.3 migration.
8. **Manager transition to Bitwise effective Jun 1, 2026** — operational change with continuing post-handoff risk.
9. **No formal bug bounty rewards.**

### Critical Risks

- **AllowList freeze risk** (shared with USTB) — if Superstate revokes Yearn's AllowList permission, the entire USCC position is frozen with zero exit paths.
- **Single-key compromise** — compromise of [`0x8abC89D9…`](https://etherscan.io/address/0x8abC89D9b56dFD90dA18e8E18CFaC9111100bDd1) lets the attacker mint unlimited USCC AND upgrade the implementation to malicious code in a single transaction. No multisig, no timelock. Superstate's claimed Turnkey TEE custody is an offchain mitigation only and cannot be verified from contract state.
- **Admin burn capability** — owner can confiscate tokens from any holder via `adminBurn`.
- **Futures-venue counterparty failure** — a venue or clearing failure affecting USCC futures margin would impair the fund's NAV directly and can cause principal loss. Public holdings currently identify CME and Coinbase exposure, but we do not have public information on venue diversification policy, margin concentration limits, or stress procedures.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** → **PASS** — the token family and shared components have substantial independent review coverage. The deployed FundToken integration is source-verified, although no public v1.2/v1.3 audit mapping is available.
- [x] **Unverifiable reserves** → **BORDERLINE PASS** — NAV Fund Services, EY, regulated custody, and detailed public holdings provide independent layers, but positions and margin cannot be verified onchain. The different AUM-statement and realtime-supply cutoffs reconcile to the September 4 Ethereum mints.
- [x] **Total centralization** → **BORDERLINE PASS** — a single EOA controls the token and its ProxyAdmin. Turnkey key-custody claims and regulatory accountability mitigate operational risk but do not reduce the onchain single-key blast radius.

**Result:** Protocol passes critical gates. Category scoring retains a conservative bias on governance and provability.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.75**

**Subcategory A: Audits — 2.0**

Earlier token versions, redemption, AllowList, and shared FundToken components have repeated 0xMacro review plus Certora and other specialist work. The score is constrained because no published report explicitly maps to the integrated v1.2.0/v1.3.0 deployment and storage migration, and there is no funded bug bounty.

**Subcategory B: Historical — 1.5**

- More than two years in production since July 15, 2024, with no reported exploit or admin incident.
- Public TVL is $103.41M and peaked near $496.61M, but fell below $100M during the last month before recovering 74.3%.
- The combination supports a score between the rubric's mature/high-TVL and 1–2-year/$50M bands.

**Score: (2.0 + 1.5) / 2 = 1.75/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **3.67**

**Subcategory A: Governance — 5.0**

- One EOA controls the USCC token and ProxyAdmin, including unlimited mint, admin burn, pause, parameters, and immediate upgrades.
- There is no multisig or timelock. The July upgrades demonstrate that the path remains active.
- Turnkey and regulatory controls are offchain mitigations, not onchain authorization constraints.

**Subcategory B: Programmability — 3.0**

- Chainlink OCR provides programmatic NAV, but the underlying fund value is supplied offchain.
- Subscriptions are admin-driven; onchain `subscribe()` is disabled.
- Users burn onchain for redemption, but settlement is offchain T+1/T+2; there is no atomic payout.
- AllowList-gated transfers and the Ethereum-to-Plume bridge are programmatic.

**Subcategory C: External Dependencies — 3.0**

Critical dependencies include Anchorage, futures venues, Bitwise, and the Treasury market. Chainlink is the sole onchain NAV oracle; Circle, Turnkey, EY, NAV Fund Services, and staking/liquid-staking infrastructure add further operational dependencies.

**Score: (5.0 + 3.0 + 3.0) / 3 = 3.67/5**

#### Category 3: Funds Management (Weight: 30%) — **3.0**

**Subcategory A: Collateralization — 3.0**

The portfolio mixes USD collateral and USTB with custodied crypto, staked/liquid-staked assets, and short futures. It is intended to be fully collateralized but is entirely offchain and exposed to custody, margin, venue, staking, and mark-to-market risk. Current public holdings identify CME and Coinbase exposure but not margin balances or concentration policy.

**Subcategory B: Provability — 3.0**

Daily Chainlink NAV, an independent NAV agent, annual EY audit, and detailed holdings are meaningful evidence. Holders still cannot verify positions, margin balances, or counterparty concentration onchain. The AUM-statement and realtime network totals use different cutoffs and reconcile to the September 4 Ethereum mints, so they do not add a separate provability penalty.

**Score: (3.0 + 3.0) / 2 = 3.0/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **3.5**

- No atomic onchain subscribe or redemption at any size.
- Offchain settlement is T+1/T+2, with no DEX liquidity and AllowList freeze risk.
- The USD-denominated character partially mitigates settlement delay, while mark-to-market basis exposure can create real losses during the wait.
- The holder base remains thin: 53 multi-chain wallets and 46 Ethereum holders.

**Score: 3.5/5**

#### Category 5: Operational Risk (Weight: 5%) — **1.5**

The doxxed team, financing, legal structure, and institutional service providers are strong. USCC-specific public disclosure remains incomplete around leverage, margin, counterparty concentration, and staking providers, and the June 2026 manager handoff still merits monitoring.

**Score: 1.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.75 | 20% | 0.350 |
| Centralization & Control | 3.67 | 30% | 1.101 |
| Funds Management | 3.0 | 30% | 0.900 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Raw Score** | | | **2.95 / 5.0** |
| Live >2 years without incidents | | | **-0.50** |
| **Final Score** | | | **2.45 / 5.0** |

The >2-year incident-free modifier applies. The current-implementation audit gap offsets the improved historical subscore, while the share totals reconcile as different reporting cutoffs.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

USCC remains materially higher risk than USTB. Its crypto-basis strategy adds futures-venue, staking, custody, and mark-to-market risks to the shared single-EOA and AllowList control model. It has no atomic onchain subscription or redemption. More than two incident-free years improve the score. The July implementation migration and incomplete public audit mapping prevent a stronger result.

**Key conditions for exposure:**

1. Keep a strict size limit reflecting offchain-only redemption.
2. Monitor the token owner for ownership transfer, mint >5% of supply, `adminBurn`, parameter changes, or proxy upgrades.
3. Monitor the shared AllowList for permission changes affecting any Yearn vault or strategy.
4. Track Chainlink USCC NAV for day-over-day declines >2%.
5. Obtain the deployed FundToken v1.2/v1.3 audit-scope mapping and greater disclosure on margin, counterparties, and staking providers before scaling exposure.

**Score-improving triggers:** multisig and timelock adoption; a published audit mapping for the current implementation; public margin and concentration limits; Proof of Reserves; atomic onchain redemption; or a funded bug bounty.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (December 2026) due to the FundToken migration, basis-trade NAV volatility, and the ongoing Bitwise post-handoff period.
- **TVL-based:** Reassess if AUM changes by more than 30% (more sensitive than USTB given thinner holder base).
- **Incident-based:** Reassess after any exploit, admin key compromise, contract upgrade, AllowList policy change, manager transition issue, or any large NAV drawdown (>5% in a single day).
- **Strategy-based:** Reassess on any change to futures venues, staking / liquid-staking provider policy, leverage policy, or asset mix (e.g., addition of new basis pairs).
- **Governance-based:** Reassess if Superstate adopts multisig or timelock for USCC admin controls.

## Assessment History

| Date | Score | Notes |
|------|------:|-------|
| [July 3, 2026](https://github.com/yearn/risk-score/pull/230) | 2.95 | Initial assessment |
| [September 5, 2026](https://github.com/yearn/risk-score/pull/445) | 2.45 | Updated implementation, portfolio, TVL, cross-chain state, and controls |
