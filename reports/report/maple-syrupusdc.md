# Protocol Risk Assessment: Maple Finance

- **Assessment Date:** May 18, 2026
- **Token:** syrupUSDC
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b`](https://etherscan.io/address/0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b)
- **Final Score: 2.33/5.0**

## Overview + Links

syrupUSDC is Maple Finance's yield-bearing stablecoin (ERC-4626 vault token). Users deposit USDC into the Syrup pool and receive syrupUSDC LP tokens that appreciate over time as yield accrues. Yield is primarily generated from fixed-rate, overcollateralized loans to institutional borrowers who post liquid digital assets (BTC, ETH, LBTC, SOL, tETH) as collateral. Additional yield comes from DeFi strategies deployed via Aave and Sky (MakerDAO) strategy contracts.

Deposits are gated by a permission system for regulatory compliance (first-time authorization required, subsequent deposits permissionless). Withdrawals are queue-based (FIFO) and typically processed within minutes to 2 days, with a maximum of 30 days in low-liquidity scenarios.

- **Current Price:** ~$1.16 (CoinGecko/Ethplorer)
- **Total Supply (Ethereum):** ~1,185M syrupUSDC (onchain, block 25124052)
- **Total Supply (all chains):** ~1,185M syrupUSDC (CoinGecko cross-chain, including Base, Arbitrum, Solana wrappers)
- **Market Cap:** ~$1.38B
- **Total Holders (Ethereum):** 3,105 (Ethplorer)
- **Total Maple V2 Pool TVL (all pools, all assets):** ~$1.81B (Syrup USDC $1.38B + Syrup USDT $374M + legacy USDC pools ~$59M)
- **DeFiLlama Protocol TVL:** $2.10B
- **Collateral Ratio (Maple API `collateralRatio`):** 148.35% (`collateralValueUsd` $1.56B / active loan principal $1.05B)
- **Current APY:** ~4.70% (Maple API `spotApy`); ~4.79% (DefiLlama yields, base only, no rewards)
- **Management Fee:** 8.33% of gross borrower interest (Delegate: 3.33% + Platform: 5.00%, verified onchain via PoolManager `delegateManagementFeeRate() = 33300` and MapleGlobals `platformManagementFeeRate(poolManager) = 50000`, both denominated /1e6)

**Links:**

- [Protocol Documentation](https://docs.maple.finance/)
- [Syrup Lender Documentation](https://docs.maple.finance/syrupusdc-usdt-for-lenders/introduction)
- [Protocol App](https://maple.finance/syrup)
- [App Details / Allocations](https://app.maple.finance/earn/details)
- [Smart Contract Integration](https://docs.maple.finance/integrate/ethereum-mainnet/smart-contract-integrations)
- [Security / Audits](https://docs.maple.finance/technical-resources/security/security)
- [GitHub (maple-core-v2)](https://github.com/maple-labs/maple-core-v2)
- [DeFiLlama](https://defillama.com/protocol/maple-finance)
- [Dune Dashboard](https://dune.com/maple-finance/maple-finance)
- [Bug Bounty (Immunefi)](https://immunefi.com/bounty/maple/)
- [LlamaRisk Assessment (Aave Governance)](https://governance.aave.com/t/arfc-onboard-syrupusdc-to-aave-v3-core-instance/22456/5)
- [Maple Address Registry (GitHub)](https://github.com/maple-labs/address-registry/blob/main/MapleAddressRegistryETH.md)
- [LedgerLens Transparency Dashboard (The Network Firm)](https://dashboard.ledgerlens.io/c/maple)
- [Maple Legal Docs (GitHub)](https://github.com/maple-labs/maple-docs/tree/master/legal)

## Contract Addresses

| Contract | Address |
|----------|---------|
| syrupUSDC Pool (ERC-4626) | [`0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b`](https://etherscan.io/address/0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b) |
| SyrupRouter | [`0x134cCaaA4F1e4552eC8aEcb9E4A2360dDcF8df76`](https://etherscan.io/address/0x134cCaaA4F1e4552eC8aEcb9E4A2360dDcF8df76) |
| PoolManager | [`0x7aD5fFa5fdF509E30186F4609c2f6269f4B6158F`](https://etherscan.io/address/0x7aD5fFa5fdF509E30186F4609c2f6269f4B6158F) |
| FixedTermLoanManager | [`0x4A1c3F0D9aD0b3f9dA085bEBfc22dEA54263371b`](https://etherscan.io/address/0x4A1c3F0D9aD0b3f9dA085bEBfc22dEA54263371b) |
| OpenTermLoanManager | [`0x6ACEb4cAbA81Fa6a8065059f3A944fb066A10fAc`](https://etherscan.io/address/0x6ACEb4cAbA81Fa6a8065059f3A944fb066A10fAc) |
| WithdrawalManagerQueue | [`0x1bc47a0Dd0FdaB96E9eF982fdf1F34DC6207cfE3`](https://etherscan.io/address/0x1bc47a0Dd0FdaB96E9eF982fdf1F34DC6207cfE3) |
| PoolDelegateCover | [`0x9e62FE15d0E99cE2b30CE0D256e9Ab7b6893AfF5`](https://etherscan.io/address/0x9e62FE15d0E99cE2b30CE0D256e9Ab7b6893AfF5) |
| PoolPermissionManager | [`0xBe10aDcE8B6E3E02Db384E7FaDA5395DD113D8b3`](https://etherscan.io/address/0xBe10aDcE8B6E3E02Db384E7FaDA5395DD113D8b3) |
| AaveStrategy | [`0x560B3A85Af1cEF113BB60105d0Cf21e1d05F91d4`](https://etherscan.io/address/0x560B3A85Af1cEF113BB60105d0Cf21e1d05F91d4) |
| SkyStrategy | [`0x859C9980931fa0A63765fD8EF2e29918Af5b038C`](https://etherscan.io/address/0x859C9980931fa0A63765fD8EF2e29918Af5b038C) |
| Governor (Timelock) | [`0x2eFFf88747EB5a3FF00d4d8d0f0800E306C0426b`](https://etherscan.io/address/0x2eFFf88747EB5a3FF00d4d8d0f0800E306C0426b) |
| DAO Multisig | [`0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196`](https://etherscan.io/address/0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196) |
| Security Admin | [`0x6b1A78C1943b03086F7Ee53360f9b0672bD60818`](https://etherscan.io/address/0x6b1A78C1943b03086F7Ee53360f9b0672bD60818) |
| Operational Admin | [`0xCe1cE7c7F436DCc4E28Bc8bf86115514d3DC34E8`](https://etherscan.io/address/0xCe1cE7c7F436DCc4E28Bc8bf86115514d3DC34E8) |
| MapleGlobals (v301) | [`0x804a6F5F667170F545Bf14e5DDB48C70B788390C`](https://etherscan.io/address/0x804a6F5F667170F545Bf14e5DDB48C70B788390C) |
| SYRUP Token | [`0x643c4e15d7d62ad0abec4a9bd4b001aa3ef52d66`](https://etherscan.io/address/0x643c4e15d7d62ad0abec4a9bd4b001aa3ef52d66) |

## Audits and Due Diligence Disclosures

Maple Finance has been extensively audited across 7+ releases by multiple reputable firms. The protocol has accumulated **20+ audit reports from 8+ different auditing firms** including Trail of Bits, Spearbit, Sherlock, Three Sigma, 0xMacro, Dedaub, Sigma Prime, PeckShield, and Code4rena. All reported issues have been addressed prior to each release.

Full audit report list: [Appendix A — Audit Reports](#appendix-a--audit-reports)

**Smart Contract Complexity:** High — Upgradeable proxy pattern, multiple loan managers (fixed-term and open-term), withdrawal queue, permission system, DeFi strategy integrations (Aave, Sky), Chainlink oracles, cross-chain CCIP integration.

### Bug Bounty

- **Platform:** Immunefi
- **Maximum Payout:** $500,000 (Critical)
- **High Severity:** $25,000 - $50,000
- **Link:** https://immunefi.com/bounty/maple/

### Safe Harbor

Maple Finance is **not** listed on the SEAL Safe Harbor registry.

## Historical Track Record

- **V1 Launch:** 2021
- **V2 Launch:** December 14, 2022
- **Syrup Launch:** August 2024 (~3 years in production for V2, ~21 months for Syrup-specific contracts as of May 2026)
- **Smart Contract Exploits:** None. No smart contract vulnerabilities have been exploited.
- **Credit Event (V1, Late 2022):** ~$36M in defaults from the Orthogonal Trading pool following the FTX collapse. This was a **credit/counterparty risk event**, not a smart contract exploit. Maple subsequently restructured, launched V2, and shifted entirely to overcollateralized lending.
- **TVL:** Total Maple V2 TVL (all pools): ~$1.81B. syrupUSDC pool `totalAssets`: ~$1.38B. TVL has declined ~50% from the Feb 2026 assessment (~$3.70B) while overall DeFi-llama Maple TVL is $2.10B.
- **Holder Distribution:** Top holders are protocol infrastructure contracts, which is standard for DeFi integrations. Top 5 holders (via Ethplorer, May 2026): ALMProxy `0xb6dd…715a2` (44.4%, Maple Spark infrastructure), Chainlink CCIP LockReleaseTokenPool `0x20b7…6491` (13.3%, backs cross-chain syrupUSDC on Base/Arbitrum/Solana), Morpho Blue `0xbbbb…ffcb` (9.2%, lending integration), ALMProxy `0x1601…347e` (7.6%, Maple infrastructure), ALMProxy `0x491e…a44e` (7.3%, Maple infrastructure). Top 5 concentration: 81.8% (was 87.4%, slightly less concentrated). 3,105 total holders for a $1.38B market cap. No significant external whale concentration risk.
- **Peg Stability:** syrupUSDC is not pegged 1:1 to USDC — it's a yield-bearing vault token that appreciates over time ($1.055 ATL to $1.16+ ATH), reflecting accrued interest. The exchange rate is monotonically increasing — verified onchain `convertToAssets(1e6) = 1,164,827` (i.e. 1.164827 USDC per syrupUSDC at block 25124052, up from 1.15 in Feb 2026, consistent with ~4.7% annualized yield).

## Funds Management

Maple delegates deposited USDC to institutional borrowers via overcollateralized loans. Borrowers post liquid digital assets as collateral.

### Yield Sources

1. **Overcollateralized Institutional Lending** — Primary yield source. Loans to creditworthy crypto-native institutions, currently 100% via `OpenTermLoanManager` (`assetsUnderManagement() = $1.34B`). `FixedTermLoanManager.assetsUnderManagement() = $0` as of block 25124052 — the pool has fully migrated to open-term lending since the previous assessment.
2. **Futures Basis Trading** — Cash-and-carry strategies targeting spreads between futures and spot markets.
3. **DeFi Strategies (currently dormant):** `AaveStrategy.assetsUnderManagement() = 10 wei` and `SkyStrategy.assetsUnderManagement() = 10 wei` — both DeFi strategy contracts hold dust amounts only as of May 18, 2026, indicating idle USDC is held directly in the Pool rather than deployed externally. $37.9M idle USDC sits in the Pool contract.

### Accessibility

- **Deposits:** Gated by `PoolPermissionManager` — first-time depositors require a one-time onchain authorization, subsequent deposits are permissionless. Atomic, single-transaction. See [Appendix B — Deposit Flow](#appendix-b--deposit-flow) for details.
- **Withdrawals:** Queue-based (FIFO). Call `pool.requestRedeem(shares, receiver)` to enter queue. Assets sent directly to wallet when processed. No penalties. Yield stops accruing once withdrawal requested.
- **Withdrawal Timing:** Typically minutes to 2 days. Maximum 30 days in low-liquidity scenarios.
- **Fees:** Total management fee of 8.33% on gross borrower interest (Delegate fee: 3.33% + Platform fee: 5.00%, verified onchain). DeFi strategy performance fees charged on yield generated.
- **Alternative Exit:** syrupUSDC can be swapped on Uniswap (~$20M liquidity in syrupUSDC/USDC pool).

### Collateralization

Loans are overcollateralized with liquid digital assets. Pool-level metrics from Maple Finance GraphQL API (May 18, 2026):

- `totalAssets`: $1,380,402,122 (onchain `IPool.totalAssets()`)
- `collateralValueUsd`: $1,555,966,317 (Maple API, USD-valued collateral)
- `collateralRatio`: 148.35% (down from 168.96% in Feb 2026)
- `numOpenTermLoans`: 149 total (23–55 active depending on the API state filter)

The per-asset collateral USD breakdown returned by the Maple public GraphQL endpoint (`collateralByAsset`) is empty without authentication, and the prior Feb 2026 USD figures are no longer fetchable from a public source. The active-loan table below was obtained from `openTermLoans(where: {state: Active})` **without a pool-scope filter**, so it represents Maple V2 protocol-wide active loans — not syrupUSDC alone. Sum ($1.76B) exceeds this pool's `totalAssets` ($1.38B) and `OpenTermLoanManager.assetsUnderManagement()` ($1.34B), with the delta (~$420M) consistent with the syrupUSDT pool ($374M) and legacy pools (~$59M).

The implied syrupUSDC-pool-specific active principal from the API is `collateralValueUsd / collateralRatio` = $1.556B / 1.4835 ≈ **$1.05B**, which is what backs the $1.34B OTLM AUM after accounting for unallocated cash, **not** the $1.76B in the table.

> ⚠️ **Use the table directionally only.** The shares below describe Maple V2 protocol-wide collateral exposure; syrupUSDC's specific share by asset cannot be derived from the public API at this assessment and is flagged TODO. Funds-management scoring relies on protocol-wide LTV / liquidation parameters (which are pool-agnostic) and the verified onchain pool composition ($1.34B OTLM AUM, $37.9M idle USDC, FTLM = $0), not on this per-asset table.

| Collateral Asset | Active Loan Principal (Maple V2-wide) | Share | # Active Loans |
|------------------|---------------------------------------|-------|----------------|
| BTC | $1,004M | **57.10%** | 26 |
| PYUSD | $253M | **14.39%** | 6 |
| XRP | $234M | **13.31%** | 5 |
| USTB | $154M | **8.78%** | 2 |
| USDC | $47M | **2.64%** | 6 |
| cbBTC | $27M | **1.53%** | 1 |
| ETH | $21M | **1.21%** | 1 |
| HYPE | $7.5M | **0.43%** | 1 |
| USDT | $3.3M | **0.18%** | 4 |
| SOL | $7 | 0.00% | 1 |
| UNKNOWN | $7.4M | 0.42% | 2 |
| **TOTAL (cross-pool)** | **$1.76B** | **100%** | **55** |

Source: Maple GraphQL `openTermLoans(where: {state: Active})`, **unscoped across all V2 pools**. Per-pool scoping not available from the public endpoint without auth.

**Maple V2 protocol-wide allocation shifts vs Feb 2026 assessment** (Feb 2026 figures were syrupUSDC-specific from authenticated `collateralByAsset`; direct comparison is therefore approximate):
- **BTC + cbBTC dominate:** ~59% protocol-wide (was 56% with BTC + LBTC for syrupUSDC alone); cbBTC newly present, LBTC fully exited
- **PYUSD is new:** $253M (14%) — PayPal's stablecoin now material as either collateral or one side of a stable-pair structure (TODO: confirm role)
- **XRP roughly halved (cross-pool):** 13% (was 25% syrupUSDC-only)
- **USTB roughly halved (cross-pool):** 9% (was 16% syrupUSDC-only)
- **LBTC and weETH fully exited**
- **HYPE reduced**

**LTV Parameters (from prior assessment, unchanged in docs):**

| Collateral Asset | Margin Call LTV | Liquidation LTV |
|-----------------|----------------|-----------------|
| BTC | 85% | 90% |
| LBTC | 75% | 85% |
| ETH | 70% | 85% |

**Collateral Concerns** (Maple V2 protocol-wide directional view — syrupUSDC-specific shares are TODO; system-wide LTV/liquidation policies apply identically to all pools):
- **BTC dominance:** BTC (+cbBTC) represents ~59% of Maple V2 protocol-wide borrowed-against collateral — high concentration in a single asset class
- **PYUSD novel concentration (~14% protocol-wide):** TODO — confirm whether PYUSD is the collateral or a stablecoin-pair lending structure; PYUSD-backed loans would introduce PayPal/Paxos counterparty and stablecoin depeg risk
- **XRP still material (~13% protocol-wide):** XRP is more volatile than BTC/ETH and carries regulatory uncertainty
- **USTB (Superstate US T-Bills, ~9% protocol-wide):** tokenized US Treasuries provide stable backing but introduce Superstate protocol dependency
- **HYPE token (~0.4% protocol-wide):** Hyperliquid's native token, lower liquidity, allocation reduced

**Liquidation Mechanism:**
- Maple's smart contracts monitor all loans in real-time for adherence to collateralization levels
- If collateralization reaches liquidation level, Maple has full rights to liquidate collateral
- Liquidations performed by external Keepers, constrained by protocol rules
- Chainlink oracles used for price feeds
- Oracle wrappers add safety checks on top of Chainlink feeds (staleness validation, min/max price bounds, sequence checks) to prevent liquidations at stale or manipulated prices
- Minimum liquidation price parameter prevents liquidation at unfairly low prices

**Impairment Mechanism:**
- Maple can impair loans before technical default if they assess borrower won't repay
- Impairment temporarily reduces loan value, distributing potential losses across current lenders
- Prevents some lenders from withdrawing unaffected while shifting burden to remaining lenders
- If borrower repays, impairment is reversed and pool value restored
- Lenders withdrawing during impairment take a permanent loss and cannot claim future recoveries

### Provability

- Loans are verifiable onchain with transparent margin call and liquidation levels for each loan
- syrupUSDC exchange rate is computed onchain (ERC-4626 `convertToAssets()`/`convertToShares()`)
- Collateral data can be fetched via Maple API and verified on Etherscan
- Loan-level data (principal, collateral, rates) is onchain
- However, the actual lending operations (borrower creditworthiness assessment, loan origination) are managed offchain by Maple Direct (the Pool Delegate)
- DeFi strategy allocations are onchain and verifiable
- **Third-party transparency dashboard ([LedgerLens by The Network Firm](https://dashboard.ledgerlens.io/c/maple)):** Public dashboard attesting **Total Verified Collateral Value across both syrupUSDC + syrupUSDT pools = ~$2B** (last verified May 18, 2026 17:00 UTC — same day as this reassessment). Cross-check: Maple API `collateralValueUsd` for syrupUSDC ($1.556B) + implied syrupUSDT collateral at 148% CR on $374M pool (~$555M) ≈ $2.11B, consistent with the dashboard figure. The Network Firm LLP is a licensed US CPA firm providing audit/attestation services. **Caveats:** (a) the dashboard exposes aggregate-only collateral USD — per-pool and per-asset breakdowns are not public; (b) the specific AICPA attestation standard for the Maple engagement (SOC, AT-C 215 agreed-upon procedures, etc.) is not disclosed on the public dashboard or on the firm's marketing pages — the engagement's legal weight cannot be fully assessed from public materials; (c) the attestation covers collateral *existence and USD valuation*, not borrower creditworthiness or recovery in liquidation.

## Liquidity Risk

- **Primary Exit:** Queue-based redemption at smart contract exchange rate (no slippage). Typical processing: minutes to 2 days. Maximum: 30 days.
- **Current Queue State (onchain, block 25124052):** `queue() = (14649, 14649)` — head equals tail, no active redemption requests in the FIFO queue. `totalShares` (locked across user escrow): ~128,793 syrupUSDC (≈ $150K). Queue is essentially empty, indicating no withdrawal pressure.
- **Idle Liquidity:** $37.9M USDC sitting idle in the Pool contract (onchain `USDC.balanceOf(pool)`), available for immediate redemption without recalling loans.
- **Secondary Exit:** Uniswap V4 syrupUSDC/USDC pool with ~$15.2M TVL and ~$799K daily volume (DefiLlama yields, May 2026).
- **DEX Liquidity:** $15.2M TVL in Uniswap V4 (Ethereum); $1.0M in Fluid DEX. DEX liquidity is only **~1.2% of market cap** — vast majority of exits must use Maple's native withdrawal queue.
- **Withdrawal Queue Behavior:** FIFO ordering via `WithdrawalManagerQueue` proxy (impl `0xf95e5722226a1018d058cd757b75f1d10289e967`). Yield stops accruing once requested. No penalties. Assets sent directly to wallet when liquidity available.
- **Stress Scenario:** In a scenario where many lenders request redemption simultaneously (e.g., credit concern), withdrawals could take up to 30 days. The pool would need to recall loans or wait for loan maturities to generate liquidity.
- **Historical Stress:** The V1 credit event (FTX collapse, 2022) caused significant withdrawal pressure, but V2 has not experienced a comparable stress test. The recent ~50% decline in pool TVL (from $3.7B to $1.8B since Feb 2026) has been absorbed without delays, suggesting orderly redemption.

## Centralization & Control Risks

### Governance

**Governance Structure:**

```
SYRUP Token Holders
        │ (Stake to stSYRUP for voting)
        ▼
Snapshot Voting (7-day window, quorum-based)
        │
        ▼
DAO Multisig (0xd6d4...a196)  ── PROPOSER + ROLE_ADMIN
   │              │
   │ propose      │ admin
   ▼              ▼
Governor Timelock (0x2eFF...426b)
   ▲                       ▲
   │ execute               │ cancel
Ops Admin Safe (0xCe1c...) Security Admin Safe (0x6b1A...)
EXECUTOR_ROLE              CANCELLER_ROLE
        │
        ▼
MapleGlobals.governor()  →  Protocol Contracts (PoolManager, MapleGlobals, LoanManagers, etc.)
        │
        │ (2nd timelock layer via MapleGlobals.defaultTimelockParameters: 7-day delay, 2-day window)
```

**Key Roles (re-verified onchain at block 25124052, May 18, 2026):**

| Role | Address | Powers |
|------|---------|--------|
| Governor (Timelock) | [`0x2eFFf88747EB5a3FF00d4d8d0f0800E306C0426b`](https://etherscan.io/address/0x2eFFf88747EB5a3FF00d4d8d0f0800E306C0426b) | Administrative functions, global parameters, pausing. `MapleGlobals.governor() == TimelockContract` (verified) |
| DAO Multisig | [`0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196`](https://etherscan.io/address/0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196) | **PROPOSER + ROLE_ADMIN** on Timelock (not EXECUTOR — corrected from prior assessment). Also `tokenWithdrawer` of Timelock. |
| Security Admin (3/6 Safe) | [`0x6b1A78C1943b03086F7Ee53360f9b0672bD60818`](https://etherscan.io/address/0x6b1A78C1943b03086F7Ee53360f9b0672bD60818) | Emergency pause + **CANCELLER** on Timelock (can veto scheduled proposals) |
| Operational Admin (3/5 Safe) | [`0xCe1cE7c7F436DCc4E28Bc8bf86115514d3DC34E8`](https://etherscan.io/address/0xCe1cE7c7F436DCc4E28Bc8bf86115514d3DC34E8) | Routine operations + **EXECUTOR** on Timelock (executes proposals after delay) |
| Extra EXECUTOR (EOA) | [`0x6d9f3a385796a5407c06a5bf18e903916548993e`](https://etherscan.io/address/0x6d9f3a385796a5407c06a5bf18e903916548993e) | Holds `EXECUTOR_ROLE` on Timelock. EOA, no code. Can execute already-scheduled proposals after the 24h delay window opens (cannot schedule, cannot bypass timelock). TODO: identify off-chain. |
| Extra ROLE_ADMIN (EOA) | [`0xa04bddfb5bce1afc0a939749dc721ba762019b2a`](https://etherscan.io/address/0xa04bddfb5bce1afc0a939749dc721ba762019b2a) | Holds `ROLE_ADMIN` on Timelock. EOA, no code. Powers are *gated through the timelock* — see "ROLE_ADMIN powers" note below. TODO: identify off-chain. |
| Permissions Admin | [`0x54b130c704919320E17F4F1Ffa4832A91AB29Dca`](https://etherscan.io/address/0x54b130c704919320E17F4F1Ffa4832A91AB29Dca) | Controls deposit authorization (signs ECDSA permission bitmaps) |
| Pool Delegate (Maple Direct) | [`0xC1e18FFD8825FfB286D177DDEbeba345EC70B49f`](https://etherscan.io/address/0xC1e18FFD8825FfB286D177DDEbeba345EC70B49f) (EOA) | Manages pool, loan origination, impairments. `PoolManager.poolDelegate()` (verified) |

**Onchain role verification (cast `hasRole(address,bytes32)` against Timelock; role hashes: `PROPOSER_ROLE=0xb09a…9cc1`, `EXECUTOR_ROLE=0xd8aa…9e63`, `CANCELLER_ROLE=0xfd64…f783`, `ROLE_ADMIN=0x2172…5096`):**

| Address | PROPOSER | EXECUTOR | CANCELLER | ROLE_ADMIN |
|---------|----------|----------|-----------|------------|
| DAO Multisig | ✅ true | ❌ false | ❌ false | ✅ true |
| Operational Admin | ❌ | ✅ | ❌ | ❌ |
| Security Admin | ❌ | ❌ | ✅ | ❌ |
| EOA `0x6d9f…993e` | ❌ | ✅ | ❌ | ❌ |
| EOA `0xa04b…9b2a` | ❌ | ❌ | ❌ | ✅ |

**This is a positive correction over the prior assessment.** Separating EXECUTOR (Ops Admin) from PROPOSER (DAO) introduces an extra check — the DAO cannot unilaterally schedule and execute its own proposals through the same hot multisig. The CANCELLER role being held by the Security Admin Safe (3/6) provides an additional kill-switch for malicious or compromised proposals.

**ROLE_ADMIN powers (verified from `GovernorTimelock.sol` source):** Despite the name, `ROLE_ADMIN` cannot unilaterally grant or revoke roles. Reading the contract:
- `updateRole(bytes32,address,bool)` is `onlySelf` — only callable by the Timelock itself (i.e. as the target of an executed proposal).
- `proposeRoleUpdates(...)` is gated by `onlyRole(ROLE_ADMIN)` but **schedules** a `updateRole` call through the normal timelock flow (24h delay → EXECUTOR must execute → CANCELLER can veto).
- `scheduleProposals(...)` explicitly rejects generic proposals targeting `updateRole` (`require(!_isUpdatingRoles(...), "GT:SP:UPDATE_ROLE_NOT_ALLOWED")`), so PROPOSER cannot smuggle a role change in.
- The only direct (non-timelock) power of ROLE_ADMIN is `setPendingTokenWithdrawer(address)`. The new pending withdrawer must then call `acceptTokenWithdrawer()` to actually take the role, after which it can call `withdrawERC20Token`. **Current Timelock balances (block 25124222): 0 USDC, 0 syrupUSDC, 0 MPL, 0 SYRUP, 0 ETH** — no assets at risk; current `tokenWithdrawer` is the DAO Multisig. The token-recovery role exists to retrieve ERC20s mistakenly sent to the Timelock contract.

**Implication:** A compromise of the EOA `0xa04b…9b2a` ROLE_ADMIN holder would require *also* compromising the EXECUTOR (Ops Admin Safe 3/5 or EOA `0x6d9f…993e`) and surviving the 24h window without the CANCELLER (Security Admin Safe 3/6) vetoing, before any role change would take effect. It cannot drain pool funds or modify protocol contracts directly. Still, holding ROLE_ADMIN in an EOA is weaker than holding it in a multisig — the bar to defense-in-depth is the executor + canceller layers, not key custody.

**Timelock (verified onchain):** GovernorTimelock contract with `MIN_DELAY = 86400s (24h)` and `MIN_EXECUTION_WINDOW = 86400s (24h)`. Timelocked actions include: `PoolManager.upgrade()`, `LoanManager.upgrade()`, `WithdrawalManager.upgrade()`. Governor can change timelock parameters, but these changes themselves require going through the timelock. `latestProposalId = 12` — only 12 governance proposals have ever been scheduled since Timelock deployment (block 23418541), indicating very low governance activity / churn.

**MapleGlobals Timelock (verified onchain, May 18 2026):** `defaultTimelockParameters()` on MapleGlobals (`0x804a6F5F667170F545Bf14e5DDB48C70B788390C`) returns **delay = 604800s (7 days)** and **duration = 172800s (2 days)** — unchanged from Feb 2026. This is a second timelock layer on top of the GovernorTimelock, providing robust dual-layer protection for protocol-level admin actions. A prior LlamaRisk assessment flagged `globalsV301` as having no delay at `defaultTimelockParameters` — this concern is fully addressed.

**Multisig Details (verified onchain, May 18 2026):**

| Multisig | Threshold | Owners (count) | Safe Version | Nonce |
|----------|-----------|----------------|--------------|-------|
| DAO Multisig `0xd6d4…a196` | **4 / 7** | 7 EOAs | v1.3.0 | 431 |
| Security Admin `0x6b1A…0818` | **3 / 6** | 6 EOAs | v1.3.0 | TODO |
| Operational Admin `0xCe1c…34E8` | **3 / 5** | 5 EOAs | v1.3.0 | TODO |

All three governance Safes are Gnosis Safe v1.3.0 with all-EOA signers (no nested multisigs). No ENS names registered for the DAO multisig signers. Per LlamaRisk, a minority of DAO signers are Maple employees; the majority are long-standing external advisors and investors who have held their seats for >2 years.

**Emergency Pause:** Three-tier granular pausing system:
1. Global pause — single switch for entire system
2. Per-contract pause — pause specific contract instances
3. Per-function unpause — allow specific functions in paused contracts for recovery

Callable by Governor (Timelock) or Security Admin.

**Voting:** Snapshot-based. SYRUP must be staked into stSYRUP to participate. 7-day voting window, quorum-based.

### Programmability

- syrupUSDC exchange rate (PPS) is calculated onchain via ERC-4626 standard; verified `convertToAssets(1e6) = 1,164,827`
- Loan interest accrual is onchain
- Loan origination, borrower assessment, and impairment decisions are **offchain** (managed by Maple Direct as Pool Delegate, EOA `0xC1e1…49f`)
- Strategy fee rates can be changed at any time by protocol admins
- DeFi strategy allocations (Aave, Sky) are executed onchain but allocation decisions are made offchain (currently both strategies are dormant)
- Liquidations are executed by external Keepers onchain, but margin call decisions can be made offchain

### External Dependencies

1. **Chainlink Oracles (Critical)** — Used for collateral price feeds. Oracle wrappers provide additional security. Failure would impact liquidation mechanics.
2. **Aave (Medium)** — Idle capital deployed via AaveStrategy contract. Aave is a blue-chip DeFi protocol.
3. **Sky/MakerDAO (Medium)** — Idle capital deployed via SkyStrategy contract. Another blue-chip protocol.
4. **Chainlink CCIP (Low-Medium)** — Used for cross-chain syrupUSDC deployments (Base, Arbitrum). Not critical for Ethereum mainnet operations.
5. **Borrower Counterparty (Critical)** — Institutional borrowers must repay loans. Default risk exists despite overcollateralization.

## Operational Risk

- **Team:** Sidney Powell (Co-founder & CEO, previously institutional finance/bond markets). Joe Flanagan (Co-founder & COO, previously NAB — reported as departed). Team composed of former bankers and credit investment professionals. Founded 2019.
- **Funding:** ~$17.7M raised across 4 rounds. Investors include Framework Ventures, Polychain Capital, BlockTower Capital, Alameda Research (seed), Tioga Capital.
- **Documentation:** Good quality. Comprehensive docs site, active GitHub. Technical integration guides available. Dune dashboard maintained.
- **Legal:** Multi-entity structure across three jurisdictions:
  - **Maple Labs Pty Ltd** (Australia) — operates maple.finance interface, publishes primary ToS
  - **Syrup Ltd** (offshore) — issues and administers syrupUSDC/syrupUSDT products, operates syrup.fi
  - **Maple International Operations SPC** (Cayman Islands Segregated Portfolio Company) — legal counterparty for loan arrangements and pool administration. Each pool is a separate segregated portfolio with ring-fenced assets and liabilities.
  - **Maple Foundation** — acts as Security Agent for enforcement of Master Lending Agreements (MLAs)
  - **Restricted jurisdictions:** US, Australia, and 30+ others explicitly excluded from syrupUSDC/USDT products
  - Source: [Terms of Use](https://github.com/maple-labs/maple-docs/blob/master/legal/interface-terms-of-use.md), [syrupUSDC Terms](https://github.com/maple-labs/maple-docs/blob/master/legal/interface-terms-of-use-syrupusdc-and-syrupusdt.md), [Jurisdictions](https://github.com/maple-labs/maple-docs/blob/master/legal/syrupusdc-and-syrupusdt-available-jurisdictions.md)
- **Incident Response:** Real-time invariant monitoring via Tenderly Web3 Actions. PagerDuty integration for critical alerts. Three-tier pause system. $500K Immunefi bug bounty. Learned from V1 credit event (restructured to overcollateralized lending).
- **License:** BUSL 1.1 (Business Source License)

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Purpose | Key Events/Functions |
|----------|---------|---------|---------------------|
| syrupUSDC Pool | [`0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b`](https://etherscan.io/address/0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b) | Vault state | `Deposit`, `Withdraw`, `Transfer`, `totalAssets()`, `totalSupply()`, `convertToAssets()` |
| PoolManager | [`0x7aD5fFa5fdF509E30186F4609c2f6269f4B6158F`](https://etherscan.io/address/0x7aD5fFa5fdF509E30186F4609c2f6269f4B6158F) | Pool configuration | Upgrades, parameter changes |
| WithdrawalManagerQueue | [`0x1bc47a0Dd0FdaB96E9eF982fdf1F34DC6207cfE3`](https://etherscan.io/address/0x1bc47a0Dd0FdaB96E9eF982fdf1F34DC6207cfE3) | Withdrawal processing | Queue length, processing delays |
| Governor Timelock | [`0x2eFFf88747EB5a3FF00d4d8d0f0800E306C0426b`](https://etherscan.io/address/0x2eFFf88747EB5a3FF00d4d8d0f0800E306C0426b) | Governance actions | `CallScheduled`, `CallExecuted`, `Cancelled` |
| DAO Multisig | [`0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196`](https://etherscan.io/address/0xd6d4Bcde6c816F17889f1Dd3000aF0261B03a196) | Multisig transactions | Submitted/confirmed/executed transactions |
| FixedTermLoanManager | [`0x4A1c3F0D9aD0b3f9dA085bEBfc22dEA54263371b`](https://etherscan.io/address/0x4A1c3F0D9aD0b3f9dA085bEBfc22dEA54263371b) | Loan health | Loan impairments, defaults, liquidations |
| OpenTermLoanManager | [`0x6ACEb4cAbA81Fa6a8065059f3A944fb066A10fAc`](https://etherscan.io/address/0x6ACEb4cAbA81Fa6a8065059f3A944fb066A10fAc) | Loan health | Loan impairments, defaults, liquidations |
| MapleGlobals | [`0x804a6F5F667170F545Bf14e5DDB48C70B788390C`](https://etherscan.io/address/0x804a6F5F667170F545Bf14e5DDB48C70B788390C) | Global parameters | `defaultTimelockParameters()`, parameter changes |
| AaveStrategy | [`0x560B3A85Af1cEF113BB60105d0Cf21e1d05F91d4`](https://etherscan.io/address/0x560B3A85Af1cEF113BB60105d0Cf21e1d05F91d4) | DeFi allocation | Deposits, withdrawals, allocation changes |
| SkyStrategy | [`0x859C9980931fa0A63765fD8EF2e29918Af5b038C`](https://etherscan.io/address/0x859C9980931fa0A63765fD8EF2e29918Af5b038C) | DeFi allocation | Deposits, withdrawals, allocation changes |

### Critical Monitoring Points

- **PPS (Price Per Share):** Track `convertToAssets(1e6)` — should be monotonically increasing. Alert on any decrease (would indicate impairment or loss).
- **Collateralization Health:** Monitor individual loan collateralization ratios via Maple API. Alert when approaching margin call or liquidation levels.
- **Withdrawal Queue:** Monitor queue length and average processing time. Alert if queue exceeds 7 days.
- **Governance:** Monitor Timelock scheduled calls and executions. Monitor proxy implementation slot changes.
- **Impairments:** Monitor for loan impairment events — these directly reduce pool value.
- **Large Movements:** Alert on deposits/withdrawals >5% of TVL in 24h.
- **Strategy Allocations:** Monitor Aave and Sky strategy deposits/withdrawals.
- **Recommended Frequency:** Hourly for PPS and collateralization. Daily for governance and queue metrics.

## Risk Summary

### Key Strengths

1. **Extensive audit coverage** — 20+ audits from 8+ firms (Trail of Bits, Spearbit, Three Sigma, 0xMacro, Sherlock, Dedaub, Sigma Prime), continuously audited with each release
2. **Large TVL** ($2.1B protocol, $1.38B syrupUSDC pool — down from $3.7B in Feb 2026 but still substantial)
3. **No smart contract exploits** in protocol history
4. **Overcollateralized lending** with onchain liquidation mechanics and Chainlink oracle integration
5. **Dual-layer timelock protection** — GovernorTimelock (MIN_DELAY=1 day) + MapleGlobals defaultTimelockParameters (7-day delay, 2-day execution window), three-tier pause system, real-time invariant monitoring via Tenderly
6. **Separation of governance powers (re-verified May 2026)** — PROPOSER (DAO 4/7), EXECUTOR (Ops 3/5), CANCELLER (Security 3/6) are held by *different* multisigs, preventing any single Safe from unilaterally pushing through a malicious proposal
7. **Third-party CPA attestation of collateral** — [LedgerLens dashboard](https://dashboard.ledgerlens.io/c/maple) by The Network Firm LLP (licensed US CPA firm) publishes daily-updated verified collateral USD across both Syrup pools (~$2B as of May 18, 2026), consistent with the Maple API self-reported figure. Engagement standard not publicly disclosed (caveats in Provability section).

### Key Risks

1. **Offchain credit risk** — Loan origination and borrower assessment are offchain (Maple Direct). The quality of lending decisions depends on the team's credit analysis capabilities.
2. **Impairment mechanism** — Maple can unilaterally impair loans, temporarily reducing pool value. Lenders who withdraw during impairment take permanent losses.
3. **Collateral concentration (Maple V2 protocol-wide):** BTC (+cbBTC) dominates at ~59%, PYUSD newly at ~14% (stablecoin/issuer dependency), XRP at ~13% (volatility/regulatory risk), USTB at ~9% (Superstate dependency). Pool-scoped shares for syrupUSDC alone are TODO — see Collateralization section.
4. **Permissioned deposits** — First-time deposits require authorization from Maple, creating a gating mechanism.
5. **Withdrawal delays** — Up to 30 days in low-liquidity scenarios. In a credit stress event, many lenders could be queued simultaneously.
6. **Material TVL decline** — Pool `totalAssets` has fallen from ~$1.68B to ~$1.38B (and total Maple V2 TVL from ~$3.7B to ~$1.8B) since Feb 2026. The decline appears to have been absorbed without queue backlog, but a continued contraction may compress yields or signal deteriorating depositor confidence.

### Critical Risks

- **V1 Credit Event Precedent:** The ~$36M default from the FTX collapse (2022) demonstrates that credit risk is real despite mitigation measures. V2's overcollateralized model significantly reduces but does not eliminate this risk.
- **Pool Delegate Power:** The Pool Delegate (`0xC1e1...49f`, EOA) has significant power over loan management, impairments, and collateral decisions without onchain governance approval.
- **~~No default timelock on contract upgrades (per LlamaRisk):~~** Previously flagged by LlamaRisk, but verified onchain (Feb 19, 2026) that `defaultTimelockParameters` is now set to 7-day delay + 2-day execution window. This concern has been addressed.
- **Fixed USDC price oracle (per LlamaRisk):** Maple uses a hardcoded 1 USD price for USDC in internal collateral liquidations rather than a live market feed, creating risk during depeg events.
- **Loss socialization:** No tranching or insurance fund exists; all lenders bear equal exposure to defaults via exchange rate reduction.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** → **PASS** (20+ audits by 8+ firms including Trail of Bits, Spearbit, Sherlock)
- [ ] **Unverifiable reserves** → **PASS** (Loans verifiable onchain, collateral transparent, exchange rate onchain)
- [ ] **Total centralization** → **PASS** (GovernorTimelock + DAO Multisig, not single EOA)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.5**

| Aspect | Assessment |
|--------|-----------|
| Audits | 20+ audits by 8+ top firms (Trail of Bits, Spearbit, Sherlock, Three Sigma, 0xMacro, Dedaub, Sigma Prime). Continuous auditing with each release. |
| Bug Bounty | $500K on Immunefi (active) |
| Time in Production | V2: ~3.5 years, Syrup: ~21 months. No smart contract exploits. |
| TVL | $2.1B DeFiLlama protocol TVL, $1.38B syrupUSDC pool (down from $1.68B Feb 2026 but still large) |
| Historical Incident | V1 credit event ($36M defaults, 2022) — credit risk, not smart contract. V2 redesigned with overcollateralized lending. |

Exceptional audit coverage and large TVL. V1 credit event was counterparty risk, not smart contract failure. High bug bounty ($500K) reduces score by 0.5 from base 2.

**Score: 1.5/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **2.50**

**Subcategory A: Governance — 2.0**

- Dual-layer timelock protection: GovernorTimelock (MIN_DELAY=24h) + MapleGlobals defaultTimelockParameters (7-day delay, 2-day execution window), both verified onchain (May 2026)
- **Separation of roles re-verified onchain (May 2026): PROPOSER (DAO 4/7), EXECUTOR (Ops 3/5), CANCELLER (Security 3/6) are held by *different* multisigs.** Prior assessment incorrectly attributed EXECUTOR to the DAO; reality is stronger. Two EOA addresses also hold EXECUTOR and ROLE_ADMIN respectively — both powers are timelock-gated per the GovernorTimelock source (ROLE_ADMIN cannot grant roles unilaterally; EXECUTOR cannot schedule proposals), so the impact of EOA compromise is bounded by the executor + canceller layers. Still a hot-wallet weakness vs. multisig custody (TODO: identify).
- DAO Multisig is 4/7 Safe v1.3.0, all EOA signers. Minority are employees; majority external advisors (per LlamaRisk)
- Snapshot-based voting with 7-day window and quorum
- Governor can change timelock parameters (through the timelock itself)
- Security Admin and Operational Admin have significant powers but constrained by timelock
- Emergency pause is a reasonable security measure
- `latestProposalId() = 12` — very low historical governance churn over the contract's lifetime

**Subcategory B: Programmability — 3.0**

- Exchange rate (PPS) is onchain via ERC-4626
- Collateral is held onchain with onchain liquidation mechanics (Keepers + Chainlink oracles)
- Withdrawal queue is fully onchain
- DeFi strategy execution (Aave, Sky) is onchain
- Loan origination and borrower assessment are offchain (Pool Delegate discretion)
- Impairment decisions and strategy allocation decisions are offchain
- Hybrid onchain/offchain operations — core protections are programmatic, lending decisions are manual

**Subcategory C: External Dependencies — 2.5**

- Chainlink oracles (established, reliable)
- Aave and Sky/MakerDAO (blue-chip DeFi)
- Borrower counterparty risk (critical dependency on institutional borrowers)
- CCIP for cross-chain (non-critical for mainnet)

**Score: (2.0 + 3.0 + 2.5) / 3 = 2.50/5**

#### Category 3: Funds Management (Weight: 30%) — **2.75**

**Subcategory A: Collateralization — 3.0**

- Overcollateralized lending (`collateralRatio` = 148.35% Maple API, down from 168.96% Feb 2026) with liquid digital assets — system-wide LTV / liquidation parameters are pool-agnostic
- Onchain liquidation mechanics with Chainlink oracles
- Per-asset concentration (**Maple V2 protocol-wide**, syrupUSDC-specific shares TODO): BTC (+cbBTC) ~59%, PYUSD ~14% (new, stablecoin/issuer depeg risk), XRP ~13% (volatility/regulatory), USTB ~9% (Superstate dependency)
- Impairment mechanism can reduce pool value at Maple's discretion
- Credit risk remains despite overcollateralization (V1 precedent)

**Subcategory B: Provability — 2.5**

- All collateral is held and tracked onchain — overcollateralization ratios, margin call levels, and liquidation thresholds are transparently verifiable
- Exchange rate computed onchain (ERC-4626 `convertToAssets()`/`convertToShares()`)
- Loan-level data (principal, collateral, rates) is onchain and verifiable
- Collateral data can be cross-verified via Maple API and Etherscan
- DeFi strategy allocations (Aave, Sky) are onchain and verifiable
- **Third-party CPA attestation:** [LedgerLens dashboard by The Network Firm LLP](https://dashboard.ledgerlens.io/c/maple) — daily-updated verified collateral USD (~$2B across syrupUSDC + syrupUSDT, May 18, 2026), figure cross-checks vs Maple's own API. Specific AICPA attestation standard not publicly disclosed; per-pool / per-asset granularity not exposed on the public dashboard
- Borrower selection and creditworthiness assessment are offchain (Pool Delegate discretion) — but the onchain collateral protections ensure reserves are provable regardless of borrower quality
- Impairment decisions are offchain

**Score: (3.0 + 2.5) / 2 = 2.75/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **2.5**

- Queue-based redemption at smart contract exchange rate (no slippage on redemption value)
- Typical processing: minutes to 2 days
- Maximum 30 days in extreme scenarios
- ~$15.2M Uniswap V4 + ~$1.0M Fluid DEX liquidity as alternative exits (DefiLlama yields, May 2026)
- DEX liquidity is only ~1.2% of market cap — not a viable exit for large holders
- Onchain pool state at block 25124052: withdrawal queue empty (`queue() = (14649, 14649)`); $37.9M idle USDC in pool available for immediate redemption without recalling loans
- Top holders are protocol infrastructure contracts (Maple ALMProxy, Chainlink CCIP pool, Morpho, Fluid) — not external whale withdrawal risk
- Same-value asset (USDC-denominated), which mitigates some waiting risk
- Historical: No V2 stress-test of withdrawal queue during market turmoil
- Throttle mechanism (30-day max) for large exits: +0.5
- Same-value assets mitigate waiting risk: -0.5 (net neutral adjustment)

**Score: 2.5/5**

#### Category 5: Operational Risk (Weight: 5%) — **1.5**

- Established team (founded 2019, ~7 years), public founders, VC-backed ($17.7M raised from Framework Ventures, Polychain Capital, BlockTower Capital)
- Comprehensive documentation, active GitHub, Dune dashboard, technical integration guides
- Real-time monitoring infrastructure (Tenderly Web3 Actions + PagerDuty)
- Clear multi-entity legal structure: Maple Labs Pty Ltd (AU), Syrup Ltd (offshore), Maple Int'l Ops SPC (Cayman Islands) with segregated portfolios
- BUSL 1.1 license
- Demonstrated incident response: V1 credit event led to complete restructuring to overcollateralized lending

**Score: 1.5/5**

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (1.5 × 0.20) + (2.50 × 0.30) + (2.75 × 0.30) + (2.5 × 0.15) + (1.5 × 0.05)
            = 0.30 + 0.75 + 0.825 + 0.375 + 0.075
            = 2.325
            ≈ 2.33
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.30 |
| Centralization & Control | 2.50 | 30% | 0.75 |
| Funds Management | 2.75 | 30% | 0.825 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.33 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (August 2026)
- **TVL-based:** Reassess if pool TVL drops below $1B or changes by more than 30%
- **Incident-based:** Reassess after any loan impairment, borrower default, smart contract exploit, or governance change
- **Collateral-based:** Reassess if collateral composition changes significantly (new asset types, concentration changes)
- **Governance-based:** Reassess if DAO multisig composition changes, timelock parameters are modified, or any Timelock role (PROPOSER/EXECUTOR/CANCELLER/ROLE_ADMIN) is granted to a new address

---

## Appendix A — Audit Reports

### V1 Audits (2021)

| Auditor | Date | Report |
|---------|------|--------|
| PeckShield | 2021 | [Report](https://github.com/maple-labs/maple-core/files/6423601/PeckShield-Audit-Report-Maple-v1.0.1.pdf) |
| Code4rena | Apr 2021 | [Report](https://code423n4.com/reports/2021-04-maple/) |
| Dedaub | 2021 | [Report](https://github.com/maple-labs/maple-core/files/6423621/Dedaub-Audit-Report-Maple-Core.2.pdf) |

### V2 Audits (Dec 2022)

| Auditor | Date | Report |
|---------|------|--------|
| Trail of Bits | Aug 2022 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2022-december/TrailOfBits-Maple.pdf) |
| Spearbit | Oct 2022 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2022-december/Spearbit-maple.pdf) |
| Three Sigma | Oct 2022 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2022-december/Three-Sigma-Maple-Finance-Dec-2022.pdf) |

### June 2023 Release

| Auditor | Date | Report |
|---------|------|--------|
| Cantina (Spearbit) | Jun 2023 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2023-june/Cantina-Maple.pdf) |
| Three Sigma | Apr 2023 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2023-june/Three-Sigma-Maple-Finance-Jun-2023.pdf) |

### December 2023 Release

| Auditor | Date | Report |
|---------|------|--------|
| Three Sigma | Nov 2023 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2023-december/Three-Sigma-Maple-Finance-Dec-2023.pdf) |
| 0xMacro | Nov 2023 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2023-december/0xMacro-Maple-Finance-Dec-2023.pdf) |

### August 2024 Release (Syrup Contracts)

| Auditor | Date | Report |
|---------|------|--------|
| Three Sigma | Aug 2024 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2024-august/Three-Sigma-Maple-Finance-Aug-2024.pdf) |
| 0xMacro | Aug 2024 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2024-august/0xMacro-Maple-Finance-Aug-2024.pdf) |
| Three Sigma (SyrupRouter) | May 2024 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2024-august/Three-Sigma-Maple-Finance-Aug-2024-Syrup.pdf) |

### December 2024 Release

| Auditor | Date | Report |
|---------|------|--------|
| Three Sigma | Dec 2024 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2024-december/Three-Sigma-Maple-Finance-Dec-2024%20.pdf) |
| 0xMacro | Dec 2024 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2024-december/0xMacro-Maple-Finance-Dec-2024.pdf) |

### September 2025 Release (Governor Timelock)

| Auditor | Date | Report |
|---------|------|--------|
| Sherlock | Sep 2025 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2025-sept-governor-timelock/Sherlock-Maple-Finance-timelock-Sept-2025.pdf) |
| 0xMacro | Sep 2025 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2025-sept-governor-timelock/0xMacro-Maple-Finance-timelock-Sept-2025.pdf) |

### November 2025 Release (Withdrawal Manager)

| Auditor | Date | Report |
|---------|------|--------|
| Spearbit | Nov 2025 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2025-november/Spearbit-Maple-Finance-WM-Nov-2025.pdf) |
| Sherlock | Nov 2025 | [Report](https://github.com/maple-labs/maple-core-v2/blob/main/audits/2025-november/Sherlock-Maple-Finance-WM-Nov-2025.pdf) |

### January 2026 Release (CCIP Cross-Chain)

| Auditor | Date | Report |
|---------|------|--------|
| Dedaub | Nov 2025 | [Report](https://github.com/maple-labs/maple-cross-chain-receiver/blob/main/audits/2025-november/Dedaub-Chainlink-Maple.pdf) |
| Sigma Prime | Jan 2026 | [Report](https://github.com/maple-labs/maple-cross-chain-receiver/blob/main/audits/2026-january/SigmaPrime-Chainlink-Maple.pdf) |

---

## Appendix B — Deposit Flow

Deposits into syrupUSDC are gated by the [`PoolPermissionManager`](https://etherscan.io/address/0xBe10aDcE8B6E3E02Db384E7FaDA5395DD113D8b3) contract via a permission bitmap system. The [`SyrupRouter`](https://etherscan.io/address/0x134cCaaA4F1e4552eC8aEcb9E4A2360dDcF8df76) handles authorization and deposits.

**First-time deposit flow:**

1. User connects wallet on [syrup.fi](https://maple.finance/syrup) and enters a USDC deposit amount
2. The frontend requests an ECDSA authorization signature from Maple's backend (checks jurisdiction, sanctions, etc.)
3. If approved, the backend returns a signature from a permission admin ([`0x54b130c704919320E17F4F1Ffa4832A91AB29Dca`](https://etherscan.io/address/0x54b130c704919320E17F4F1Ffa4832A91AB29Dca))
4. The frontend calls `SyrupRouter.authorizeAndDeposit()` — a single atomic transaction that:
   - Verifies the ECDSA signature and sets the user's lender bitmap on `PoolPermissionManager`
   - Checks `hasPermission(poolManager, owner, "P:deposit")`
   - Transfers USDC from user → router → pool, returns syrupUSDC shares to user

**Subsequent deposits:**

The lender bitmap is already set onchain, so the user calls `SyrupRouter.deposit()` or `SyrupRouter.depositWithPermit()` (EIP-2612) directly — no authorization signature needed.

**Alternative (no permission required):**

syrupUSDC can be purchased on Uniswap as a regular token swap, bypassing the permission system entirely. This only applies to buying existing syrupUSDC on the secondary market, not minting new shares.

**Gating mechanism:** Maple can refuse to provide the authorization signature for restricted jurisdictions (US, Australia, 30+ others) or sanctioned addresses. Source: [`SyrupRouter.sol`](https://github.com/maple-labs/syrup-utils/blob/main/contracts/SyrupRouter.sol)

| Function | Gated |
|----------|-------|
| `deposit` | Yes |
| `depositWithPermit` | Yes |
| `mint` | Yes |
| `mintWithPermit` | Yes |
| `requestRedeem` | No |
| `redeem` | No |
| `requestWithdraw` | Yes |
| `withdraw` | Yes |
| `removeShares` | Yes |
| `transfer` | No |
| `transferFrom` | No |

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";

interface IPool {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function asset() external view returns (address);
    function manager() external view returns (address);
}

interface IPoolManager {
    function canCall(bytes32 functionId, address caller, bytes calldata data) external view returns (bool, string memory);
    function poolPermissionManager() external view returns (address);
}

interface IPoolPermissionManager {
    function hasPermission(address poolManager, address lender, bytes32 functionId) external view returns (bool);
}

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract SyrupUSDCDepositTest is Test {
    address constant POOL           = 0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b;
    address constant USDC           = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address constant POOL_MANAGER   = 0x7aD5fFa5fdF509E30186F4609c2f6269f4B6158F;
    address unauthorized = makeAddr("unauthorized_user");
    // Existing EOA holder (rank 8) — already has deposit permission bitmap set
    address constant AUTHORIZED   = 0xdf998bec7943aa893ba8542eE57ea47b78F29007;

    function setUp() public {
        uint256 mainnetFork = vm.createFork("mainnet");
        vm.selectFork(mainnetFork);
        // Give the unauthorized user 10,000 USDC
        deal(USDC, unauthorized, 10_000e6);
        deal(USDC, AUTHORIZED, 10_000e6);
    }

    function test_unauthorized_deposit_reverts() public {
        vm.startPrank(unauthorized);
        // Approve pool to spend USDC
        IERC20(USDC).approve(POOL, type(uint256).max);

        // Verify canCall returns false for unauthorized user
        IPoolManager pm = IPoolManager(POOL_MANAGER);
        bytes memory depositData = abi.encode(uint256(1000e6), unauthorized);
        (bool allowed, string memory reason) = pm.canCall("P:deposit", unauthorized, depositData);
        assertFalse(allowed, "Unauthorized user should NOT be allowed to deposit");
        assertEq(reason, "PM:CC:NOT_ALLOWED", "Should fail with permission error");
        emit log_string("canCall returned false as expected");
        emit log_string(string.concat("Reason: ", reason));

        // Verify the actual deposit call reverts
        vm.expectRevert(bytes("PM:CC:NOT_ALLOWED"));
        IPool(POOL).deposit(1000e6, unauthorized);
        vm.stopPrank();
        emit log_string("PASS: Unauthorized deposit correctly reverted");
    }

    function test_permission_manager_returns_false() public view {
        IPoolManager pm = IPoolManager(POOL_MANAGER);
        address ppm = pm.poolPermissionManager();
        bool hasPermission = IPoolPermissionManager(ppm).hasPermission(POOL_MANAGER, unauthorized, "P:deposit");
        assertFalse(hasPermission, "Random address should not have deposit permission");
    }

    // @notice Authorized user (existing holder) can deposit
    function test_authorized_deposit_succeeds() public {
        vm.startPrank(AUTHORIZED);
        IERC20(USDC).approve(POOL, type(uint256).max);
        uint256 balBefore = IERC20(POOL).balanceOf(AUTHORIZED);
        uint256 shares = IPool(POOL).deposit(1000e6, AUTHORIZED);
        uint256 balAfter = IERC20(POOL).balanceOf(AUTHORIZED);
        assertGt(shares, 0, "Should receive shares");
        assertEq(balAfter - balBefore, shares, "Balance should increase by shares");
        vm.stopPrank();
        emit log_named_uint("Shares received", shares);
    }
}
```
