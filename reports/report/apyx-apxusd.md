# Protocol Risk Assessment: Apyx

- **Assessment Date:** March 16, 2026
- **Token:** apxUSD
- **Chain:** Ethereum
- **Token Address:** [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
- **Final Score: 3.6/5.0**

## Overview + Links

Apyx is a "Dividend-Backed Stablecoin" (DBS) protocol that converts off-chain corporate dividend income from publicly-traded Digital Asset Treasury (DAT) preferred shares into on-chain programmable yield. The protocol offers two tokens:

- **apxUSD**: A synthetic dollar backed by an overcollateralized basket of low-volatility, variable-rate DAT preferred shares. It does NOT pay yield directly to holders and serves as the protocol's primary liquidity and collateral layer.
- **apyUSD**: A yield-bearing ERC-4626 vault token. Users deposit apxUSD and receive apyUSD, which accrues yield through a rising exchange rate (non-rebasing) funded by dividends from the underlying DAT preferred share portfolio.

**Collateral**: The basket currently includes preferred shares from publicly-traded companies:
- **STRC** (Strategy Inc Variable Rate Series A Perpetual Preferred Stock, ~11.25% indicated dividend rate, $100 par value, Nasdaq-listed)
- **SATA** (Strive Inc Variable Rate Series A Perpetual Preferred Stock, ~12% dividend, Nasdaq-listed)

The collateral is dynamically rebalanced based on issuer concentration limits, liquidity needs, and overcollateralization requirements.

**Yearn use case per issue [#63](https://github.com/yearn/risk-score/issues/63)**: Use apxUSD as collateral in Morpho lending markets.

**Note**: The actual Morpho market (created March 12, 2026) uses **apyUSD as collateral** and **apxUSD as the loan asset** -- the inverse of what the original issue assumed. This enables a leveraged yield strategy (deposit apyUSD → borrow apxUSD → deposit into apyUSD vault → repeat). See [Morpho Market](#morpho-market) section below.

**Key metrics (March 16, 2026):**
- apxUSD Total Supply: ~51,478,450 (supply cap: 100,000,000)
- Curve apxUSD/USDC Pool: ~$5.5M TVL (2.72M apxUSD + 2.77M USDC)
- Listed on CoinGecko (~$41.2M market cap, rank #512). Not yet listed on DeFi Llama
- Chain: Ethereum only (Solana planned)
- Protocol launched: February 18, 2026 (~26 days ago)

**Links:**

- [Protocol Website](https://apyx.fi/)
- [Protocol Documentation](https://docs.apyx.fi)
- [apxUSD Overview](https://docs.apyx.fi/solution-overview/apxusd-overview)
- [apyUSD Overview](https://docs.apyx.fi/solution-overview/apyusd-overview)
- [Peg Stability Model](https://docs.apyx.fi/solution-overview/peg-stability-model)
- [Blog - Introducing Apyx](https://blog.apyx.fi/introducing-apyx/)
- [Audits Page](https://docs.apyx.fi/resources/audits)
- [FAQ](https://docs.apyx.fi/resources/faq)
- [Curve Pool](https://www.curve.finance/dex/ethereum/pools/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)
- [DFDV Investment Announcement](https://www.globenewswire.com/news-release/2026/02/26/3245596/0/en/DeFi-Development-Corp-Announces-Investment-in-Apyx-The-First-Dividend-Backed-Stablecoin-DBS-Protocol.html)
- [CoinGecko](https://www.coingecko.com/en/coins/apxusd)
- [Certora Audit Report](https://www.certora.com/reports/apyx-apxusd)
- [Morpho Market (apyUSD/apxUSD)](https://app.morpho.org/ethereum/market/0xe23380494e365453f72f736f2d941959ae945773eb67a06cf4f538c7c4201264/apyusd-apxusd)

## Contract Addresses

### Core Contracts (Ethereum)

| Contract | Address | Type |
|----------|---------|------|
| apxUSD (Proxy) | [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665) | ERC-20, UUPS Proxy |
| apxUSD (Implementation) | [`0x1d42504c026f8f4f6809308e736646e4437f1fc0`](https://etherscan.io/address/0x1d42504c026f8f4f6809308e736646e4437f1fc0) | ApxUSD (Solidity 0.8.30) |
| apyUSD (Proxy) | [`0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a`](https://etherscan.io/address/0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a) | ERC-4626 Vault, UUPS Proxy |
| apyUSD (Implementation) | [`0x1c407113acf0f879b3eb161bf774f4c1fdfb531e`](https://etherscan.io/address/0x1c407113acf0f879b3eb161bf774f4c1fdfb531e) | ApyUSD (Solidity 0.8.30) |
| AccessManager | [`0xe167330e2eac88666de253e9607c6d9ae0ca2824`](https://etherscan.io/address/0xe167330e2eac88666de253e9607c6d9ae0ca2824) | OpenZeppelin AccessManager |
| MinterV0 | [`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e) | Mint Strategy (EIP-712) |
| ApxUSDRateOracle (Proxy) | [`0xa2ef2e7bf32248083e514a737259f3785ea8d37d`](https://etherscan.io/address/0xa2ef2e7bf32248083e514a737259f3785ea8d37d) | Curve Pool Oracle, UUPS Proxy |
| LinearVestV0 | [`0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f`](https://etherscan.io/address/0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f) | Yield Vesting (~17-day linear) |
| YieldDistributor | [`0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a`](https://etherscan.io/address/0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a) | Distributes yield to vesting |
| AddressList | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Whitelist/Deny List |
| UnlockToken | [`0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6`](https://etherscan.io/address/0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6) | apyUSD Unlock Token (30-day cooldown) |
| CommitToken (apxUSD) | [`0x17122d869d981d184118b301313bcd157c79871e`](https://etherscan.io/address/0x17122d869d981d184118b301313bcd157c79871e) | CT-apxUSD |
| CommitToken (LP) | [`0xdfc3cf7e540628a52862907dc1ab935cd5859375`](https://etherscan.io/address/0xdfc3cf7e540628a52862907dc1ab935cd5859375) | CT-apxUSDUSDC |
| OrderDelegate | [`0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1`](https://etherscan.io/address/0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1) | Minting Delegate |

### Governance & Multisig Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Admin Safe | [`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2) | 3-of-6 Gnosis Safe, sole holder of ADMIN_ROLE |
| Operations Safe | [`0x37b0779a66edc491df83e59a56d485835323a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555) | 3-of-5 Gnosis Safe, 5 of 6 Admin Safe owners |
| Third-Party Safe | [`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`](https://etherscan.io/address/0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50) | 2-of-3 Gnosis Safe, independent owners, holds 6.7% of supply |

### Liquidity & Lending Contracts

| Contract | Address | Type |
|----------|---------|------|
| Curve apxUSD/USDC Pool | [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) | CurveStableSwapNG |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Morpho Blue Core |
| Morpho Oracle (apyUSD/apxUSD) | [`0x770661EE520Ff9F7D8FaCAdC4EFF885739Bd8872`](https://etherscan.io/address/0x770661EE520Ff9F7D8FaCAdC4EFF885739Bd8872) | MorphoChainlinkOracleV2 (immutable) |

### On-Chain Verification (Etherscan, March 16, 2026)

All core contracts are **verified on Etherscan**:

| Contract | Etherscan Name | Verified | Proxy |
|----------|---------------|----------|-------|
| apxUSD | ERC1967Proxy → ApxUSD (impl) | Yes | Yes (UUPS) |
| apyUSD | ERC1967Proxy → ApyUSD (impl) | Yes | Yes (UUPS) |
| AccessManager | AccessManager | Yes | No |
| MinterV0 | MinterV0 | Yes | No |
| ApxUSDRateOracle | ERC1967Proxy → ApxUSDRateOracle (impl) | Yes | Yes (UUPS) |
| LinearVestV0 | LinearVestV0 | Yes | No |

All contracts compiled with Solidity 0.8.30 using OpenZeppelin v5.5.0.

## Audits and Due Diligence Disclosures

### Audit History

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **Quantstamp** | Feb 2-9, 2026 | ApxUSD Stablecoin Ecosystem (14 findings) | [Certificate](https://certificate.quantstamp.com/full/apx-usd-stablecoin/2a5be074-3d9f-49e7-aa08-46fb5f1e5bd6/index.html) |
| 2 | **Certora** | Feb 2026 (work Jan 19-28, 2026) | apxUSD (18 contracts) | [Full Report](https://www.certora.com/reports/apyx-apxusd) ([PDF](https://certora.cdn.prismic.io/certora/aaX0-1xvIZEnjP6j_Apyx-apxUSD-Finalreport-February2026.pdf)) |
| 3 | **Zellic** | Claimed | Unknown | Not publicly available |

#### Certora Audit Findings (14 total, 11 confirmed/fixed)

| Severity | Discovered | Fixed |
|---|---|---|
| Critical | 0 | - |
| High | 1 | 1 |
| Medium | 4 | 2 |
| Low | 5 | 5 |
| Informational | 4 | 3 |

**Notable findings:**
- **H-01** (Fixed): Cooldown griefing allowed attacker to lock victim's funds in UnlockToken
- **M-01** (Acknowledged, NOT fixed): Backing model is entirely trust-based with no on-chain verification. Certora compared unfavorably to Ethena (on-chain reserve fund) and Ondo USDY (on-chain NAV oracle). Apyx plans third-party custodial audits instead
- **M-02** (Fixed): Deny list was not enforced on ApyUSD and ApxUSD transfers
- **M-03** (Fixed): Partial claims corrupted vesting schedule, enabling early token extraction
- **M-04** (Acknowledged, NOT fixed): Yield distribution can be gamed -- new depositors can capture yield from dividends they didn't generate, diluting existing depositors. Apyx relies on vesting period and cooldown to mitigate, but doesn't prevent the issue

#### Quantstamp Audit Findings (14 total)

Repo: `apyx-labs/evm-contracts` @ commit `c263465b`. Audit period: Feb 2-9, 2026.

| Severity | Count | Fixed | Mitigated | Acknowledged |
|---|---|---|---|---|
| High | 1 | 1 | 0 | 0 |
| Medium | 2 | 2 | 0 | 0 |
| Low | 7 | 6 | 1 | 0 |
| Informational | 4 | 3 | 0 | 1 |

**Notable findings:**
- **QS-1** (High, Fixed): `LinearVestV0.pullVestedYield()` does not reset `vestingAmount` after pulling, allowing the admin to extend vesting with stale accounting and double-distribute yield
- **QS-2** (Medium, Fixed): `ERC20DenyListUpgradable` uses `initializer` instead of `onlyInitializing`, breaking initialization for derived contracts
- **QS-3** (Medium, Fixed): `RedemptionPoolV0` requires matching decimals for asset/reserveAsset, preventing use with USDC (6 decimals)
- **QS-4** (Low, Mitigated): `ApyUSD._decimalsOffset()` returns 0 (instead of OZ default), making first-depositor inflation attack slightly more feasible. Mitigated by team deploying with initial deposit
- **QS-10** (Low, Fixed): `RedemptionPoolV0.redeem()` has no slippage protection -- admin can change exchange rate while user tx is pending (front-running risk)
- **QS-13** (Informational, Acknowledged): `MinterV0` rate-limit checked at request time but not at execution -- requests can be queued and batch-executed, bypassing intended issuance cap

**Notes:**
- The Quantstamp audit certificate is JavaScript-rendered but finding data was extracted. All 14 findings are documented above. The audit reviewed the same `apyx-labs/evm-contracts` repo as Certora but at a different commit.
- The Certora audit was published in March 2026 with full findings. Scope covered 18 contracts including ApxUSD, ApyUSD, MinterV0, UnlockToken, LinearVestV0, YieldDistributor, etc. Two medium-severity findings (M-01 trust-based backing, M-04 yield gaming) were acknowledged but **not fixed**.
- Zellic was previously claimed in the [Apyx FAQ](https://docs.apyx.fi/resources/faq) but is **no longer listed on the official audits page**. No public report found in Zellic's GitHub publications repository (365+ published PDFs). This audit cannot be independently verified.
- Several documentation pages in the Technical Overview section return 404 errors, suggesting incomplete documentation.

### On-Chain Complexity

The architecture is moderately complex:
- **UUPS Proxy Pattern**: apxUSD, apyUSD, and ApxUSDRateOracle all use ERC-1967 UUPS upgradeable proxies
- **AccessManager**: Centralized role-based access control (OpenZeppelin AccessManager) governs all contracts
- **Two-Step Minting**: EIP-712 signed orders → AccessManager-scheduled execution with rate limiting
- **Yield Distribution**: YieldDistributor → LinearVestV0 (~17-day linear vesting) → apyUSD vault
- **Cooldown Mechanism**: UnlockToken contract enforces withdrawal cooldown for apyUSD

### Bug Bounty

**No active bug bounty program found.** Exhaustive search across Immunefi, Sherlock, Cantina, HackerOne, and Safe Harbor yielded no bug bounty listing. This is a notable gap.

## Historical Track Record

- **Time in Production**: apxUSD proxy deployed February 18, 2026 (block [24481772](https://etherscan.io/tx/0xfb528661b410cce683a1ee40b49a5249dbd677e8304a102927bc6639486f450b)). In production for **~26 days** as of March 16, 2026. **Very young protocol.**
- **GitHub Repository**: [`apyx-labs`](https://github.com/apyx-labs) organization exists on GitHub but contains only a `.github` profile repository. **No public smart contract source code repositories.** Contracts are verified on Etherscan but not open-sourced on GitHub.
- **TVL History**: Listed on CoinGecko (~$41.2M market cap, rank #512, $1.93M 24h volume). Not tracked by DeFi Llama. On-chain data:
  - Total apxUSD supply: ~51,478,450 (up ~4x from ~13M at launch)
  - Curve pool: ~$5.5M (2.72M apxUSD + 2.77M USDC)
  - Uniswap V4: ~7.86M apxUSD
  - apyUSD vault: ~26.4M apxUSD backing (~19.6M apyUSD shares)
  - 237 holders, 861 total transfers
- **Incidents**: None reported (still very new)
- **Peg Stability**: The Curve pool virtual price is 1.000090 with a near-balanced composition (apxUSD/USDC ratio ~0.983). apxUSD trades slightly below par in the pool but within acceptable range. CoinGecko price: $1.00
- **Supply Growth**: Supply grew ~4x in 15 days (13M → 51.5M), driven primarily by apyUSD vault deposits (now holding 51.3% of supply). This rapid growth warrants monitoring

### apxUSD Supply Distribution

| Holder | Balance | % of Supply |
|--------|---------|-------------|
| apyUSD Vault (backing) | 26,397,377 | 51.3% |
| Uniswap V4 PoolManager | 7,857,957 | 15.3% |
| Third-Party Safe (2-of-3) | 3,451,356 | 6.7% |
| Curve Pool (apxUSD/USDC) | 2,722,715 | 5.3% |
| Admin Safe (3-of-6) | 2,020,000 | 3.9% |
| Other (Pendle, users, etc.) | ~9,029,045 | ~17.5% |

**Concentration risk**: The apyUSD vault now dominates supply distribution at 51.3%, reflecting strong yield-seeking demand. The Third-Party Safe's share dropped significantly from 36.5% to 6.7% (distributed into the ecosystem). The Admin Safe holds 2.02M apxUSD (3.9%). The "Other" category at 17.5% (~9M apxUSD) is spread across Pendle, individual wallets, and other DeFi protocols. Concentration risk has improved compared to initial assessment -- no single entity holds a destabilizing share outside the vault.

## Funds Management

### Minting & Redemption

**Minting apxUSD**: **Permissioned** -- only whitelisted institutional participants can mint/redeem apxUSD directly. Minting uses EIP-712 structured data signing with the following on-chain safeguards:
- Maximum single mint: 10,000,000 apxUSD
- Rate limit: ~10,001,000 apxUSD per 24 hours
- 60-second execution delay via AccessManager (reduced from initial 4 hours)
- Nonce-based replay protection per beneficiary

General users acquire apxUSD through secondary markets (Curve, Uniswap).

**Minting apyUSD**: **Permissionless** -- any user can deposit apxUSD into the ERC-4626 vault to receive apyUSD. No KYB/KYC required (certain jurisdictions restricted via frontend).

**Redeeming apyUSD → apxUSD**: Uses UnlockToken contract with:
1. User requests redemption (exchange rate locks at this point)
2. **Cooldown period** (no yield accrual during cooldown)
3. User claims assets after cooldown
- 0.1% unlocking fee (max allowed: 1%)
- Adding assets to existing request **resets the cooldown**
- Only one pending request at a time

### Accessibility

- **apxUSD deposits (into Morpho, Curve, etc.)**: Permissionless
- **apxUSD minting/redemption**: Permissioned (whitelisted entities only)
- **apyUSD deposits**: Permissionless
- **apyUSD redemptions**: Permissionless but subject to cooldown period
- **Geographic restrictions**: US, EU, EEA, and sanctioned jurisdictions restricted

### Collateralization

- **Backing**: Off-chain preferred shares from publicly-traded DAT companies (STRC, SATA on Nasdaq). Overcollateralized but specific ratio not disclosed publicly.
- **Collateral quality**: Variable-rate perpetual preferred shares. These are equities (not stablecoins or crypto assets). They sit subordinated to debt obligations in the capital structure. The preferred shares have dividend adjustment mechanisms that theoretically stabilize their price near par value.
- **Custody**: Multi-party MPC key management -- both Apyx and custody partners hold keys. "No singular entity has the ability to mismanage the funds."
- **On-chain verification**: **Not possible**. Collateral is entirely off-chain. Users must rely on:
  - Promised monthly PCAOB-registered audit firm attestations (none published yet)
  - Promised real-time dashboard for reserve monitoring
  - Promised daily NAV reporting
  - The fact that underlying shares are publicly-traded and priced transparently on Nasdaq

### Provability

- **apxUSD backing**: Off-chain. No on-chain proof of reserves. Monthly PCAOB attestations promised but **no attestations published yet** (protocol is 26 days old). Certora audit M-01 explicitly flagged this as a medium-severity issue -- the backing model is entirely trust-based with no on-chain verification. The team acknowledged but did not fix, planning third-party custodial audits instead.
- **apyUSD exchange rate**: Calculated on-chain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Anyone can verify. Current rate: 1.3443 apxUSD per apyUSD (totalAssets: 26.4M, totalSupply: 19.6M shares).
- **Yield distribution**: Semi-programmatic. YieldDistributor deposits apxUSD into LinearVestV0, which vests linearly over ~17 days (1,489,445 seconds on-chain, not 30 days as previously documented). The apyUSD vault pulls vested yield, increasing totalAssets and therefore the exchange rate. The initial yield distribution is admin-initiated.
- **Rate oracle**: The ApxUSDRateOracle is **manually set** by an authorized role via `setRate()`. Currently set at exactly 1.000000 (1:1 with USDC). No on-chain price feed, no TWAP, no staleness check. Used by the Curve StableSwap-NG pool for pricing.

## Liquidity Risk

### Primary Exit Mechanisms

For the Morpho market, the relevant question is: how can liquidators exit positions? In the active market (apyUSD collateral / apxUSD loan), liquidators would seize apyUSD collateral and need to convert it to apxUSD (via the vault's `redeem`) or sell on secondary markets.

1. **Curve StableSwap-NG Pool**: apxUSD/USDC pool with ~$5.5M total liquidity (2.72M apxUSD + 2.77M USDC). Pool ratio ~0.983 (apxUSD slightly below par). A=100, fee=0.01%.

   *Note: The Curve pool has shrunk from ~$9M to ~$5.5M since initial assessment. Slippage estimates from March 1 are no longer accurate -- expect roughly 60% worse slippage for equivalent swap sizes given the reduced depth.*

2. **Uniswap V4**: ~7.86M apxUSD in PoolManager (up from 1.52M). CoinGecko shows the apxUSD/USDC Uniswap V4 pair as the most active ($1.19M 24h volume). This has become a significant liquidity venue.
3. **Direct Redemption**: Available only to whitelisted entities. Not a general exit path.

### Liquidity Assessment

- **Pool quality**: The Curve pool has shrunk to ~$5.5M (down from ~$9M), representing only 5.3% of supply (down from 35%). Supply growth has outpaced liquidity depth.
- **Uniswap V4 growth**: Uniswap V4 now holds ~7.86M apxUSD (15.3% of supply) and is the most active trading venue by volume ($1.19M/day). Combined DEX liquidity is reasonable.
- **Trading volume**: CoinGecko reports ~$1.93M 24h trading volume across all venues.
- **No stress testing**: Protocol is 26 days old, no market stress data available.
- **Morpho context**: For Morpho liquidations, apxUSD would need to be sold quickly. The combined Curve + Uniswap V4 liquidity provides adequate exit paths for positions up to ~$1-2M, but larger liquidations could face challenges given the reduced Curve pool depth.
- **Pendle integration**: PT-apxUSD positions exist on Pendle, providing additional secondary market activity.
- **GoPlus Warning**: CoinGecko flags a GoPlus security warning: "This is a proxy contract. The contract owner can make code changes to the token contract including but not limited to disabling sells, changing fees, minting, transferring tokens etc."

## Morpho Market

### Active Market: apyUSD (collateral) / apxUSD (loan)

A Morpho Blue market was created on March 12, 2026 (4 days ago as of this assessment):

| Parameter | Value |
|-----------|-------|
| Market ID | `0xe233...1264` |
| Collateral | apyUSD ([`0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a`](https://etherscan.io/address/0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a)) |
| Loan Asset | apxUSD ([`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)) |
| LLTV | 86% |
| Supply | ~$1.03M apxUSD |
| Borrow | ~$1.0M apxUSD |
| Utilization | **97.1%** (extremely high) |
| Supply APY | ~10.7% |
| Borrow APY | ~11.1% |
| Fee | 0% |
| Warnings | None (from Morpho) |

**Note**: The original issue [#63](https://github.com/yearn/risk-score/issues/63) describes using **apxUSD as collateral**. However, the only active Morpho market uses **apyUSD as collateral** with apxUSD as the loan token. No Morpho market exists with apxUSD as collateral.

### Morpho Oracle

The oracle ([`0x770661EE520Ff9F7D8FaCAdC4EFF885739Bd8872`](https://etherscan.io/address/0x770661EE520Ff9F7D8FaCAdC4EFF885739Bd8872)) is a **standard MorphoChainlinkOracleV2** contract (from `morpho-org/morpho-blue-oracles`):

- **Immutable** -- all parameters set at deployment, no admin functions, no owner
- **Pure on-chain pricing** -- reads apyUSD's `convertToAssets(1e18)` to derive the exchange rate
- **No external feeds** -- all four Chainlink feed slots are address(0) (unused)
- **No staleness risk** -- price is computed fresh from vault state on each call
- **Deployed by** "Apyx: Deployer 2" (`0x5db416BcFc1a8b5b921f55C1E078d1F39194e99F`)

This is **significantly better** than the manually-set ApxUSDRateOracle used by the Curve pool. The Morpho oracle has no admin control and derives pricing purely from on-chain ERC-4626 state.

**However**, since apyUSD is a UUPS upgradeable proxy, the Admin Safe could upgrade the vault implementation and alter the `convertToAssets()` calculation, which would directly affect the Morpho oracle output. This is an indirect centralization risk.

### Morpho-Specific Risks

- **Leveraged looping strategy**: The apyUSD/apxUSD market enables recursive leverage (deposit apyUSD → borrow apxUSD → deposit into apyUSD vault → repeat). This amplifies both yield and risk. A sharp decline in the apyUSD exchange rate or apxUSD depeg could trigger cascading liquidations.
- **97% utilization**: Nearly all supplied apxUSD is borrowed. Lenders attempting to withdraw may face delays until utilization drops. This also means the market is very tight -- small supply/demand changes have outsized rate impacts.
- **86% LLTV**: Aggressive for a 4-day-old market on a 26-day-old protocol. Leaves only 14% buffer before liquidation.
- **apyUSD vault upgrade risk**: The Morpho oracle reads from `convertToAssets()`. If the Admin Safe upgrades the apyUSD implementation to alter this function, it could manipulate collateral valuation in the Morpho market.
- **Small market size**: Only ~$1M supplied. Early stage -- risk parameters are still being tested.

## Centralization & Control Risks

### Governance

Apyx uses an OpenZeppelin AccessManager for centralized role-based access control across all contracts.

**Defined Roles:**

| Role ID | Label | Holder | Delay |
|---------|-------|--------|-------|
| 0 | ADMIN_ROLE | Admin Safe (3/6) | **0 seconds** |
| 1 | ROLE_MINT_STRAT | MinterV0 contract | 60 seconds |
| 2 | ROLE_MINTER | None assigned | - |
| 3 | ROLE_MINT_GUARD | None assigned | - |
| 6 | ROLE_YIELD_DISTRIBUTOR | YieldDistributor contract | 0 seconds |
| 7 | ROLE_YIELD_OPERATOR | None assigned | - |
| 8 | ROLE_REDEEMER | None assigned | - |

**Multisig Details:**
- **Admin Safe**: 3-of-6 Gnosis Safe (upgraded from 3-of-5 since initial assessment). **Sole holder of ADMIN_ROLE with 0-second execution delay.** Can:
  - Upgrade all UUPS proxy contracts (apxUSD, apyUSD, rate oracle) **immediately**
  - Grant/revoke all roles
  - Pause the protocol
  - Manage the AddressList (whitelist/deny list)
  - Change fee parameters, unlock token, vesting contract
  - Set rate oracle value
- **Admin Safe Signers** (6 total):
  - `0xb51F89DEA7Df709cEbb4809B40c6431361e61d0d` (new, Admin Safe only)
  - `0x5db416BcFc1a8b5b921f55C1E078d1F39194e99F`
  - `0x0442cC5BBfBc4B7Dc3A14F9766c21C82b45f0024` (deployer EOA)
  - `0xcFCF3C9Ed3d97DB54c99BDd197E59952a0973f6e`
  - `0xB98cD8C868cf00cEA934977dBE4AC090E808fb87`
  - `0xd66a0Fc924fAb7476D35aFe5941856ef76BA0839`
- **Operations Safe**: 3-of-5 Gnosis Safe. All 5 Operations Safe owners are also Admin Safe owners. No AccessManager roles -- used as intermediary for token distribution.
- **Admin Safe has 1 additional unique signer** (`0xb51F...1d0d`) not shared with Operations Safe. Still limited separation of concerns.
- **Third-Party Safe**: 2-of-3 Gnosis Safe with 3 completely independent signers (zero overlap with Admin or Operations).
- **Deployer EOA**: ADMIN_ROLE was properly revoked at the same block it was granted to the Safe (block 24481052).

**Key concerns:**
- **No timelock** on admin actions. The Admin Safe can upgrade all proxy contracts and change any parameter instantly with a 3-of-6 signature.
- 5 of 6 Admin signers are also Operations Safe signers -- limited separation of concerns.
- The Admin Safe directly holds 2,020,000 apxUSD (3.9% of supply).
- The 60-second mint delay (reduced from initial 4 hours in block 24494943) provides minimal protection.
- **AddressList** (whitelist/deny list) is currently empty (0 entries) -- deny list not actively used despite Certora M-02 finding about unenforced deny list.

### Programmability

- **apxUSD**: Standard ERC-20 with no on-chain exchange rate (it's a 1:1 stablecoin). Minting is permissioned and programmatically rate-limited.
- **apyUSD exchange rate**: Calculated on-chain via ERC-4626 (`totalAssets / totalSupply`). Programmatic, no admin input needed for the rate itself.
- **Yield distribution**: Semi-manual. Admin deposits apxUSD into YieldDistributor → LinearVestV0 → apyUSD vault pulls vested yield. The yield vesting is programmatic (~17-day linear), but the initial deposit is admin-initiated.
- **Rate oracle**: **Manually set** by authorized role. The `setRate()` function has no automation, no TWAP, and no staleness check. If the oracle is not updated, the Curve pool will continue using the stale rate.
- **Minting**: Two-step process (request → execute) with 60-second delay. Rate-limited to ~10M/day.

### External Dependencies

| Dependency | Type | Criticality | Impact of Failure |
|------------|------|-------------|-------------------|
| **Off-chain preferred shares (STRC, SATA)** | Collateral backing | **Critical** | All value derives from off-chain equity holdings. Dividend cuts, issuer default, or custody failure would impair backing |
| **MPC Custody Providers** | Asset custody | **Critical** | Compromise or failure of custody could lead to loss of collateral. Multi-party MPC mitigates single-point risk |
| **Curve StableSwap-NG** | Primary liquidity venue | **High** | Main exit path for non-whitelisted users. Pool failure would severely restrict liquidity |
| **Morpho Blue** | Lending protocol | **High** | Active apyUSD/apxUSD market with 97% utilization. Leveraged looping creates recursive exposure. Immutable oracle depends on apyUSD vault state |
| **Gnosis Safe** | Multisig infrastructure | **High** | All governance actions flow through Safe multisigs |
| **Ethereum L1** | Settlement layer | **Medium** | All contracts on Ethereum mainnet only |

**Key dependency risk**: The protocol has a **critical dependency on off-chain assets and custody** that cannot be verified on-chain. The rate oracle is manually set with no automated price feed or fallback mechanism.

## Operational Risk

- **Team Transparency**: **Fully anonymous**. No individual team members from Apyx are publicly named in documentation or blog posts. The only publicly associated individual is **Joseph Onorati** (CEO of DeFi Development Corp., Nasdaq: DFDV), who announced DFDV's investment in Apyx. The team is described as "crypto and TradFi veterans with deep experience in capital markets, digital assets, and the DAT model."
- **Fundraising**: Raised $3M across two rounds at a $300M valuation. "No VCs, by design." First institutional capital from DFDV.
- **Documentation**: Adequate but incomplete. The main docs cover core concepts, but multiple pages in the Technical Overview section return 404 errors (Minting, Unlocking, Commit Token pages). Documentation was recently updated for launch.
- **Legal Structure**: **Preference Capital (BVI) Ltd.** and affiliates, incorporated in the British Virgin Islands. Explicitly disclaims being a "marketplace facilitator, broker, financial institution or creditor." Liability capped at $100 per user. US, EU, EEA geo-blocked.
- **Incident Response**: Not formally documented. The Admin Safe can pause the protocol immediately. No Guardian or independent cancellation mechanism.
- **Code Availability**: Contracts verified on Etherscan but **not open-sourced on GitHub**. The `apyx-labs` GitHub organization contains only a profile README.
- **Points Program**: "Pips" points program active with various multipliers (5x for holding apxUSD, 10x for committing, up to 16x for Curve LP). This may attract mercenary capital.

## Monitoring

### apxUSD Token Monitoring

- **apxUSD contract**: [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
  - Monitor `totalSupply()` for unexpected minting events
  - **Alert**: If supply increases by >1M in 24 hours
  - Monitor `Transfer` events for large movements (>$500K)
  - Monitor `Paused`/`Unpaused` events

### Rate Oracle Monitoring

- **ApxUSDRateOracle**: [`0xa2ef2e7bf32248083e514a737259f3785ea8d37d`](https://etherscan.io/address/0xa2ef2e7bf32248083e514a737259f3785ea8d37d)
  - Monitor `RateUpdated` events -- any rate change should be investigated
  - **Alert**: If rate deviates from 1.0 by >1%
  - **Alert**: If rate deviates from 1.0 by >5% (critical)
  - Monitor for proxy upgrade events (`Upgraded`)

### Curve Pool Monitoring

- **Curve Pool**: [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)
  - Monitor pool balance ratio (should stay near 50/50)
  - **Alert**: If ratio deviates >10% from balanced (indicates peg pressure)
  - **Alert**: If total pool TVL drops below $5M

### Governance Monitoring

- **Admin Safe**: [`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2)
  - Monitor for owner/signer changes and threshold modifications
  - **Alert**: Immediately on any signer replacement or threshold change
  - Monitor all Safe transaction executions (especially proxy upgrades, role changes)

- **AccessManager**: [`0xe167330e2eac88666de253e9607c6d9ae0ca2824`](https://etherscan.io/address/0xe167330e2eac88666de253e9607c6d9ae0ca2824)
  - Monitor `RoleGranted`, `RoleRevoked` events
  - Monitor `TargetFunctionRoleUpdated` events
  - **Alert**: On any role change

### Morpho Market Monitoring

- **Morpho Market** (apyUSD/apxUSD): Market ID `0xe233...1264`
  - Monitor utilization rate (currently 97.1% -- extremely high)
  - **Alert**: If utilization exceeds 99% (lender withdrawal risk)
  - **Alert**: If total supply or borrow changes by >50% in 24 hours
  - Monitor for liquidation events -- early liquidations signal stress
  - Monitor apyUSD `convertToAssets()` rate for anomalies (Morpho oracle input)
  - **Alert**: If exchange rate drops (would indicate vault losses)

### Supply & Holder Monitoring

- Monitor Third-Party Safe (`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`) balance -- holds 6.7% of supply (~3.45M apxUSD)
  - **Alert**: If this address moves >$500K of apxUSD
- Monitor Admin Safe (`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`) balance -- holds 3.9% of supply (~2.02M apxUSD)
  - **Alert**: If this address moves >$500K of apxUSD
- Monitor Curve pool for large single-sided withdrawals
- Monitor MinterV0 for mint execution events

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Rate oracle changes | Real-time | Critical |
| Proxy upgrade events | Real-time | Critical |
| AccessManager role changes | Real-time | Critical |
| Admin Safe transactions | Real-time | Critical |
| Morpho market utilization & liquidations | Every 6 hours | Critical |
| Curve pool balance ratio | Every 6 hours | High |
| apxUSD supply changes | Every 6 hours | High |
| apyUSD exchange rate (Morpho oracle input) | Every 6 hours | High |
| Large holder movements | Daily | Medium |

## Risk Summary

### Key Strengths

- **Publicly-traded collateral**: Underlying preferred shares (STRC, SATA) are Nasdaq-listed with transparent pricing, dividend policies, and regulatory oversight
- **Two confirmed audits**: Quantstamp (Feb 2026) and Certora (Feb 2026) with published reports. Certora report is thorough with detailed findings
- **Well-designed minting safeguards**: EIP-712 structured signing, rate limiting (~10M/day), nonce-based replay protection, and two-step minting process
- **Improved concentration risk**: Third-Party Safe share dropped from 36.5% to 6.7%, with supply more distributed across vault, Uniswap, and other protocols
- **Proper deployer decommissioning**: Deployer EOA's ADMIN_ROLE was revoked, admin control transferred to multisig
- **Multi-party MPC custody**: Shared key management between Apyx and partners prevents single-entity mismanagement
- **Strong growth**: Supply grew 4x in 15 days with CoinGecko listing and $1.93M daily volume
- **Morpho oracle quality**: The Morpho market uses a standard immutable MorphoChainlinkOracleV2 that reads directly from the ERC-4626 vault -- significantly better than the manually-set Curve oracle

### Key Risks

- **Very new protocol**: Only ~26 days in production. Limited track record, stress testing, or historical data
- **Off-chain, unverifiable collateral**: Reserves backed by off-chain preferred shares with no on-chain proof of reserves. Monthly PCAOB attestations promised but none published yet. Certora audit M-01 explicitly flagged this as a medium-severity finding
- **No timelock on admin actions**: Admin Safe (3/6) can upgrade all proxy contracts and change parameters immediately with zero delay
- **Anonymous team**: No team members publicly identified. BVI legal entity with $100 liability cap
- **Unverifiable Zellic audit**: Previously claimed but no longer listed on official audits page. No public report found
- **No bug bounty program**: Notable absence for a protocol managing ~$51M in token supply
- **Manual rate oracle**: Curve pool pricing depends on a manually-set oracle with no on-chain price feed, TWAP, or staleness detection
- **Yield gaming vulnerability**: Certora M-04 (acknowledged, not fixed) -- new depositors can capture yield from dividends they didn't generate
- **Reduced Curve liquidity**: Curve pool shrank from ~$9M to ~$5.5M while supply grew 4x, widening the liquidity gap
- **Morpho leveraged looping**: The apyUSD/apxUSD Morpho market (86% LLTV, 97% utilization) enables recursive leverage that amplifies both yield and risk. Cascading liquidations possible if apyUSD exchange rate drops

### Critical Risks

- **Proxy upgrade without timelock**: The Admin Safe can upgrade apxUSD, apyUSD, and the rate oracle implementation contracts immediately. A compromised or malicious 3-of-6 multisig could deploy a malicious implementation that drains all funds or manipulates balances -- with zero delay for detection or intervention
- **Off-chain collateral opacity**: If preferred shares are not actually held or are liquidated without disclosure, apxUSD could be undercollateralized with no on-chain mechanism to detect this. No attestation has been published despite being 26 days live
- **Rate oracle manipulation**: A compromised admin could set the oracle rate to an extreme value, enabling extraction of value from the Curve pool. No staleness check or bounds validation exists in the oracle contract
- **Liquidity/supply mismatch**: Supply grew 4x to ~$51M while Curve pool shrank to ~$5.5M. In a stress scenario, exit liquidity may be insufficient relative to outstanding supply

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Quantstamp audit confirmed (Feb 2026). Certora audit published (Feb 2026) with detailed findings. Zellic claimed but unverifiable and no longer listed on docs. **PASS** (two confirmed reputable audits)
- [ ] **Unverifiable reserves** -- Reserves are entirely off-chain preferred shares. No on-chain proof of reserves. Monthly PCAOB attestations promised but none published yet (26 days live). Certora M-01 explicitly flagged this. However, collateral is publicly-traded Nasdaq equity with transparent pricing. **BORDERLINE PASS** -- similar to USDC/USDT model but with no published attestations yet
- [x] **Total centralization** -- 3-of-6 Gnosis Safe multisig. Not a single EOA. **PASS**

**All gates pass (borderline).** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 2 confirmed audits (Quantstamp, Certora -- both reputable). Certora published detailed findings including 1 High (fixed), 4 Medium (2 acknowledged/not fixed). Zellic previously claimed but no longer listed and unverifiable. Contract code verified on Etherscan but not open-sourced on GitHub.
- **Bug Bounty**: None found.
- **Time in Production**: ~26 days. Very young -- well below the 3-month minimum for comfort.
- **TVL**: ~$51.5M token supply. Listed on CoinGecko (rank #512, $1.93M 24h volume). Not tracked on DeFi Llama.
- **Incidents**: None (still too new for meaningful track record).

**Score: 4.0/5** -- Two confirmed reputable audits (Quantstamp + Certora) meaningfully improve the audit posture compared to one confirmed audit. However, the very short track record (~26 days, well below 3 months), absence of bug bounty, 2 unresolved medium findings in Certora (trust-based backing M-01, yield gaming M-04), and no open-source code still place this in high-risk territory. Improved from 4.5 to 4.0 due to the published Certora audit and slightly longer track record.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-6 Admin Multisig with 0-second execution delay (no timelock) -- improved from 3-of-5
- 5 of 6 Admin Safe signers are also Operations Safe signers -- limited separation, but 1 additional unique signer added
- Third-Party Safe (2-of-3) has fully independent signers (zero overlap)
- UUPS upgradeable contracts can be upgraded immediately
- Deployer admin properly revoked
- No Guardian or independent veto mechanism

**Governance Score: 4.0** -- The 3-of-6 threshold is an improvement over 3-of-5 (now requires 50% vs 60% consensus). However, the complete absence of a timelock on admin actions (including proxy upgrades) remains a severe concern. One additional independent signer improves the picture slightly. Between score 4 (low threshold, <12 hours timelock) and score 5 (no timelock, unlimited admin powers). Improved from 4.5 to 4.0.

**Subcategory B: Programmability**

- apxUSD: Standard ERC-20, no on-chain exchange rate needed (1:1 stablecoin)
- apyUSD: ERC-4626 with programmatic exchange rate
- Yield distribution: Linear vesting (~17-day) is programmatic, but initial deposits are admin-initiated
- Rate oracle: Manually set, no automation
- Minting: Programmatic rate limiting and signatures, but permissioned

**Programmability Score: 3.0** -- Hybrid system. apyUSD exchange rate and yield vesting are on-chain. But the rate oracle, yield distribution initiation, and minting are all dependent on admin input. Between score 3 (hybrid) and score 4 (significant manual intervention).

**Subcategory C: External Dependencies**

- **Critical**: Off-chain preferred share collateral (STRC, SATA) and MPC custody providers
- **High**: Curve pool for liquidity
- **Medium**: Gnosis Safe infrastructure

**Dependencies Score: 4.0** -- Critical dependency on off-chain assets and custody that cannot be verified on-chain. No fallback mechanism if custody providers fail. The oracle has no automated price feed.

**Centralization Score = (4.0 + 3.0 + 4.0) / 3 = 3.67**

**Score: 3.7/5** -- Significant centralization risk driven by no timelock on admin actions, UUPS upgradeable contracts with instant upgrade capability, off-chain dependencies, and a manually-controlled rate oracle. Slightly improved from 3.8 due to the Admin Safe upgrade to 3-of-6.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Off-chain backing by publicly-traded preferred shares (Nasdaq-listed)
- Overcollateralized (specific ratio undisclosed)
- Multi-party MPC custody
- Cannot verify collateral on-chain
- Reserve is equity (not stablecoins) -- more volatile than typical stablecoin collateral

**Collateralization Score: 3.5** -- Between score 3 (100% collateral, some off-chain, periodic attestation) and score 4 (partially collateralized or custodial, opaque reporting). Collateral quality is moderate -- publicly-traded equity is transparent in pricing but subordinated to debt in capital structure and subject to market volatility. No on-chain verification.

**Subcategory B: Provability**

- apyUSD exchange rate: on-chain (ERC-4626)
- apxUSD collateral: entirely off-chain
- Monthly PCAOB attestations promised but **none published yet**
- Daily NAV reporting promised but not verified
- Rate oracle: manually set, no third-party verification

**Provability Score: 4.0** -- Between score 3 (manual reporting by admins, known custodian attestation) and score 4 (infrequent reporting, self-reported only). No attestation has been published yet, and all reserve claims are currently unverified. The protocol is simply too new.

**Funds Management Score = (3.5 + 4.0) / 2 = 3.75**

**Score: 3.75/5** -- Off-chain collateral with no published attestations yet. Publicly-traded equity provides pricing transparency but not reserve verification.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Curve pool**: ~$5.5M (down from ~$9M), slightly imbalanced (apxUSD/USDC ratio ~0.983)
- **Uniswap V4**: ~7.86M apxUSD, most active venue ($1.19M/day volume)
- **Combined DEX liquidity**: Reasonable but has not kept pace with 4x supply growth
- **Direct redemption**: Permissioned only (not available to general users/liquidators)
- **No market stress data**: Protocol is 26 days old
- **Peg stability**: Currently stable ($1.00 on CoinGecko, virtual price 1.000090) but untested under stress

**Score: 3.0/5** -- The Curve pool shrank from ~$9M to ~$5.5M while supply grew 4x to ~$51M. The liquidity-to-supply ratio has deteriorated significantly (from ~69% to ~11% in Curve alone). Uniswap V4 has grown as a liquidity venue but concentrated liquidity depth is harder to assess. Combined DEX activity is healthy ($1.93M/day) for normal operations. However, for Morpho liquidations in stress scenarios, the reduced Curve pool and high supply create a wider gap. Worsened from 2.5 to 3.0 due to the liquidity/supply mismatch.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Fully anonymous. No individual Apyx team members named. DFDV (Nasdaq-listed) provides some institutional backing.
- **Documentation**: Adequate but incomplete (multiple 404 pages). Actively being updated.
- **Legal Structure**: BVI entity with $100 liability cap. US/EU/EEA geo-blocked.
- **Incident Response**: No formal plan. Admin can pause immediately.
- **Code Availability**: Verified on Etherscan but not open-sourced on GitHub.

**Score: 4.0/5** -- Fully anonymous team is a significant concern. BVI entity with minimal liability provides limited legal recourse. Incomplete documentation. Between score 3 (mixed unknown/known anons, adequate docs) and score 4 (mostly unknown, poor docs). The DFDV backing (Nasdaq-listed) and verified-on-Etherscan contracts provide some offset but not enough.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 4.0 | 20% | 0.80 |
| Centralization & Control | 3.7 | 30% | 1.11 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 4.0 | 5% | 0.20 |
| **Final Score** | | | **3.69** |

**Final Score: 3.7** (rounded)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Elevated Risk**

---

Apyx's apxUSD is a novel "Dividend-Backed Stablecoin" with an innovative approach to bridging off-chain corporate dividends into on-chain yield. The underlying collateral (publicly-traded preferred shares on Nasdaq) provides pricing transparency. The protocol has shown strong growth (4x supply in 15 days) and now has two confirmed audits (Quantstamp, Certora).

However, the protocol is **very young** (~26 days), has **no published reserve attestations** (despite Certora explicitly flagging this as M-01), relies on **off-chain collateral that cannot be verified on-chain**, has **no timelock on admin actions** (allowing instant proxy upgrades), an **anonymous team**, and a **manually-controlled rate oracle**. Curve pool liquidity has not kept pace with supply growth.

**Morpho market update**: The actual Morpho market (created March 12, 2026) uses **apyUSD as collateral / apxUSD as loan** -- the inverse of what issue #63 anticipated. The Morpho oracle is immutable and reads directly from the ERC-4626 vault (much better than the Curve oracle). However, 97% utilization and 86% LLTV on a 4-day-old market create leveraged looping risk.

**For Yearn exposure via Morpho:**
- The primary exit path for liquidators is through apyUSD → apxUSD vault redemption (subject to cooldown) or secondary market sales
- The Morpho oracle is sound (immutable, on-chain ERC-4626 rate), but indirectly affected by apyUSD vault upgrades
- 97% utilization means lenders face withdrawal risk
- The leveraged looping strategy amplifies protocol exposure -- cascading liquidations are possible if apxUSD depegs or apyUSD exchange rate drops
- Morpho exposure should be strictly limited given the protocol's youth, elevated risk profile, and extreme utilization

**Key conditions for any exposure:**
- Verify that published PCAOB attestations exist before committing significant capital
- Monitor the rate oracle for any changes (currently 1.0000)
- Monitor Curve pool balance ratio for peg stability signals
- Strict position size limits given the $5.5M Curve pool depth (reduced from $9M)
- Request the team implement a timelock on admin actions before expanding exposure
- Monitor for resolution of Certora M-04 (yield gaming vulnerability)
- Track Zellic audit status -- previously claimed but no longer listed on docs page
- Monitor Morpho market utilization (currently 97%) and any liquidation events

---

## Reassessment Triggers

- **Time-based**: Reassess in 1 month (April 16, 2026) -- protocol's youth demands rapid re-evaluation
- **TVL-based**: Reassess if TVL changes by more than 50% (supply already grew 4x since launch)
- **Incident-based**: Reassess after any exploit, governance change, oracle manipulation, or peg deviation >2%
- **Attestation-based**: Reassess when first PCAOB attestation is published (promised monthly, none yet)
- **Audit-based**: Reassess if Zellic audit report surfaces or is formally retracted
- **Governance-based**: Reassess if timelock is implemented or multisig composition changes further
- **Bug bounty**: Reassess if a bug bounty program is launched
- **Liquidity-based**: Reassess if Curve pool TVL drops below $3M or ratio deviates >15%
- **Morpho-based**: Reassess if Morpho market utilization exceeds 99%, any liquidations occur, or new apxUSD-collateral markets are created
- **Certora findings**: Reassess if M-01 (trust-based backing) or M-04 (yield gaming) are addressed
