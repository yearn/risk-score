# Protocol Risk Assessment: Apyx

- **Assessment Date:** March 1, 2026
- **Token:** apxUSD
- **Chain:** Ethereum
- **Token Address:** [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
- **Final Score: 3.8/5.0**

## Overview + Links

Apyx is a "Dividend-Backed Stablecoin" (DBS) protocol that converts off-chain corporate dividend income from publicly-traded Digital Asset Treasury (DAT) preferred shares into on-chain programmable yield. The protocol offers two tokens:

- **apxUSD**: A synthetic dollar backed by an overcollateralized basket of low-volatility, variable-rate DAT preferred shares. It does NOT pay yield directly to holders and serves as the protocol's primary liquidity and collateral layer.
- **apyUSD**: A yield-bearing ERC-4626 vault token. Users deposit apxUSD and receive apyUSD, which accrues yield through a rising exchange rate (non-rebasing) funded by dividends from the underlying DAT preferred share portfolio.

**Collateral**: The basket currently includes preferred shares from publicly-traded companies:
- **STRC** (Strategy Inc Variable Rate Series A Perpetual Preferred Stock, ~11.25% indicated dividend rate, $100 par value, Nasdaq-listed)
- **SATA** (Strive Inc Variable Rate Series A Perpetual Preferred Stock, ~12% dividend, Nasdaq-listed)

The collateral is dynamically rebalanced based on issuer concentration limits, liquidity needs, and overcollateralization requirements.

**Yearn use case per issue [#63](https://github.com/yearn/risk-score/issues/63)**: Use apxUSD as collateral in Morpho lending markets.

**Key metrics (March 1, 2026):**
- apxUSD Total Supply: ~13,028,350 (supply cap: 100,000,000)
- Curve apxUSD/USDC Pool: ~$9M TVL
- Protocol not yet listed on DeFi Llama or CoinGecko
- Chain: Ethereum only (Solana planned)
- Protocol launched: February 18, 2026 (~11 days ago)

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
| LinearVestV0 | [`0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f`](https://etherscan.io/address/0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f) | Yield Vesting (30-day linear) |
| YieldDistributor | [`0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a`](https://etherscan.io/address/0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a) | Distributes yield to vesting |
| AddressList | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Whitelist/Deny List |
| UnlockToken | [`0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6`](https://etherscan.io/address/0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6) | apyUSD Unlock Token (30-day cooldown) |
| CommitToken (apxUSD) | [`0x17122d869d981d184118b301313bcd157c79871e`](https://etherscan.io/address/0x17122d869d981d184118b301313bcd157c79871e) | CT-apxUSD |
| CommitToken (LP) | [`0xdfc3cf7e540628a52862907dc1ab935cd5859375`](https://etherscan.io/address/0xdfc3cf7e540628a52862907dc1ab935cd5859375) | CT-apxUSDUSDC |
| OrderDelegate | [`0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1`](https://etherscan.io/address/0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1) | Minting Delegate |

### Governance & Multisig Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Admin Safe | [`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2) | 3-of-5 Gnosis Safe, sole holder of ADMIN_ROLE |
| Operations Safe | [`0x37b0779a66edc491df83e59a56d485835323a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555) | 3-of-5 Gnosis Safe, same 5 owners as Admin Safe |
| Third-Party Safe | [`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`](https://etherscan.io/address/0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50) | 2-of-3 Gnosis Safe, different owners, holds 36.5% of supply |

### Liquidity Contracts

| Contract | Address | Type |
|----------|---------|------|
| Curve apxUSD/USDC Pool | [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) | CurveStableSwapNG |

### On-Chain Verification (Etherscan, March 1, 2026)

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
| 1 | **Quantstamp** | Feb 2026 | APX USD Stablecoin | [Certificate](https://certificate.quantstamp.com/full/apx-usd-stablecoin/2a5be074-3d9f-49e7-aa08-46fb5f1e5bd6/index.html) |
| 2 | **Zellic** | Claimed | Unknown | Not publicly available |
| 3 | **Certora** | Claimed | Unknown (formal verification) | Not publicly available |

**Notes:**
- The Quantstamp audit is confirmed with a public certificate link, but the certificate is JavaScript-rendered and specific finding counts (Critical/High/Medium/Low) could not be extracted programmatically.
- Zellic and Certora audits are claimed in the [Apyx FAQ](https://docs.apyx.fi/resources/faq) as "comprehensive security audits by leading firms including Zellic and Certora." However, **no public reports were found** in Zellic's GitHub publications repository (353+ published PDFs) or Certora's SecurityReports repository. These audits cannot be independently verified at this time.
- Several documentation pages in the Technical Overview section return 404 errors, suggesting incomplete documentation.

### On-Chain Complexity

The architecture is moderately complex:
- **UUPS Proxy Pattern**: apxUSD, apyUSD, and ApxUSDRateOracle all use ERC-1967 UUPS upgradeable proxies
- **AccessManager**: Centralized role-based access control (OpenZeppelin AccessManager) governs all contracts
- **Two-Step Minting**: EIP-712 signed orders → AccessManager-scheduled execution with rate limiting
- **Yield Distribution**: YieldDistributor → LinearVestV0 (30-day linear vesting) → apyUSD vault
- **Cooldown Mechanism**: UnlockToken contract enforces 30-day withdrawal cooldown for apyUSD

### Bug Bounty

**No active bug bounty program found.** Exhaustive search across Immunefi, Sherlock, Cantina, HackerOne, and Safe Harbor yielded no bug bounty listing. This is a notable gap.

## Historical Track Record

- **Time in Production**: apxUSD proxy deployed February 18, 2026 (block [24481772](https://etherscan.io/tx/0xfb528661b410cce683a1ee40b49a5249dbd677e8304a102927bc6639486f450b)). In production for **~11 days** as of March 1, 2026. **Extremely young protocol.**
- **GitHub Repository**: [`apyx-labs`](https://github.com/apyx-labs) organization exists on GitHub but contains only a `.github` profile repository. **No public smart contract source code repositories.** Contracts are verified on Etherscan but not open-sourced on GitHub.
- **TVL History**: Not tracked by DeFi Llama or CoinGecko. Based on on-chain data:
  - Total apxUSD supply: ~13,028,350
  - Curve pool: ~$9M (4.52M apxUSD + 4.52M USDC)
  - Uniswap V4: ~1.52M apxUSD
  - apyUSD vault: ~1.01M apxUSD backing
- **Incidents**: None reported (too new to have meaningful track record)
- **Peg Stability**: The Curve pool virtual price is 1.000061 with a nearly balanced 50/50 composition, indicating stable peg in the very short period since launch

### apxUSD Supply Distribution

| Holder | Balance | % of Supply |
|--------|---------|-------------|
| Third-Party Safe (2-of-3) | 4,751,407 | 36.5% |
| Curve Pool (apxUSD/USDC) | 4,524,532 | 34.7% |
| Uniswap V4 PoolManager | 1,521,281 | 11.7% |
| apyUSD Vault (backing) | 1,009,938 | 7.8% |
| Admin Safe (3-of-5) | 393,930 | 3.0% |
| Other (Pendle, users, etc.) | ~826,937 | ~6.3% |

**Concentration risk**: A single 2-of-3 Safe (non-team owners) holds 36.5% of total supply. Combined with the Curve pool (34.7% of supply is POL per the issue), the top 2 holders account for 71.2% of supply.

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
2. **~30-day cooldown period** (no yield accrual during cooldown)
3. User claims assets after cooldown
- 0.1% unlocking fee (max allowed: 1%)
- Adding assets to existing request **resets the cooldown**
- Only one pending request at a time

### Accessibility

- **apxUSD deposits (into Morpho, Curve, etc.)**: Permissionless
- **apxUSD minting/redemption**: Permissioned (whitelisted entities only)
- **apyUSD deposits**: Permissionless
- **apyUSD redemptions**: Permissionless but subject to 30-day cooldown
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

- **apxUSD backing**: Off-chain. No on-chain proof of reserves. Monthly PCAOB attestations promised but **no attestations published yet** (protocol is 11 days old).
- **apyUSD exchange rate**: Calculated on-chain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Anyone can verify. Current rate: 1.3377 apxUSD per apyUSD.
- **Yield distribution**: Semi-programmatic. YieldDistributor deposits apxUSD into LinearVestV0, which vests linearly over 30 days. The apyUSD vault pulls vested yield, increasing totalAssets and therefore the exchange rate. The initial yield distribution is admin-initiated.
- **Rate oracle**: The ApxUSDRateOracle is **manually set** by an authorized role via `setRate()`. Currently set at exactly 1.000000 (1:1 with USDC). No on-chain price feed, no TWAP, no staleness check. Used by the Curve StableSwap-NG pool for pricing.

## Liquidity Risk

### Primary Exit Mechanisms

For the Morpho collateral use case, the relevant question is: how can liquidators exit an apxUSD position?

1. **Curve StableSwap-NG Pool (Primary)**: apxUSD/USDC pool with ~$9M total liquidity, well-balanced (50/50).

| Swap Amount (apxUSD) | USDC Output | Slippage |
|---|---|---|
| 1 | 1.00 | 0.01% |
| 100,000 | 99,966 | 0.03% |
| 500,000 | 499,388 | 0.12% |
| 1,000,000 | 997,586 | 0.24% |
| 2,000,000 | 1,988,979 | 0.55% |
| 3,000,000 | 2,965,705 | 1.14% |

2. **Uniswap V4**: ~1.52M apxUSD in pool manager. Liquidity depth not independently verified.
3. **Direct Redemption**: Available only to whitelisted entities. Not a general exit path.

### Liquidity Assessment

- **Pool quality**: The Curve pool is well-balanced with good depth relative to total supply (~35% of supply). The issue notes 50% is POL.
- **Slippage**: Excellent for medium-sized swaps (<0.25% for $1M). Larger swaps (>$2M) start showing meaningful slippage.
- **No stress testing**: Protocol is 11 days old, no market stress data available.
- **Morpho context**: For Morpho liquidations, apxUSD would need to be sold quickly. The Curve pool provides adequate liquidity for positions up to ~$1-2M with minimal slippage, but larger liquidations could face challenges.
- **Pendle integration**: PT-apxUSD positions exist on Pendle, providing additional secondary market activity.

## Centralization & Control Risks

### Governance

Apyx uses an OpenZeppelin AccessManager for centralized role-based access control across all contracts.

**Defined Roles:**

| Role ID | Label | Holder | Delay |
|---------|-------|--------|-------|
| 0 | ADMIN_ROLE | Admin Safe (3/5) | **0 seconds** |
| 1 | ROLE_MINT_STRAT | MinterV0 contract | 60 seconds |
| 2 | ROLE_MINTER | None assigned | - |
| 3 | ROLE_MINT_GUARD | None assigned | - |
| 6 | ROLE_YIELD_DISTRIBUTOR | YieldDistributor contract | 0 seconds |
| 7 | ROLE_YIELD_OPERATOR | None assigned | - |
| 8 | ROLE_REDEEMER | None assigned | - |

**Multisig Details:**
- **Admin Safe**: 3-of-5 Gnosis Safe. **Sole holder of ADMIN_ROLE with 0-second execution delay.** Can:
  - Upgrade all UUPS proxy contracts (apxUSD, apyUSD, rate oracle) **immediately**
  - Grant/revoke all roles
  - Pause the protocol
  - Manage the AddressList (whitelist/deny list)
  - Change fee parameters, unlock token, vesting contract
  - Set rate oracle value
- **Operations Safe**: 3-of-5 Gnosis Safe, same 5 owners as Admin Safe. No AccessManager roles -- used as intermediary for token distribution.
- **Both team Safes share the same 5 owners** (including the deployer EOA `0x0442cc...`). No separation of concerns at the owner level.
- **Deployer EOA**: ADMIN_ROLE was properly revoked at the same block it was granted to the Safe (block 24481052).

**Key concerns:**
- **No timelock** on admin actions. The Admin Safe can upgrade all proxy contracts and change any parameter instantly with a 3-of-5 signature.
- Same 5 signers on both multisigs -- no external or independent signers.
- The Admin Safe directly holds 393,930 apxUSD (3% of supply).
- The 60-second mint delay (reduced from initial 4 hours in block 24494943) provides minimal protection.

### Programmability

- **apxUSD**: Standard ERC-20 with no on-chain exchange rate (it's a 1:1 stablecoin). Minting is permissioned and programmatically rate-limited.
- **apyUSD exchange rate**: Calculated on-chain via ERC-4626 (`totalAssets / totalSupply`). Programmatic, no admin input needed for the rate itself.
- **Yield distribution**: Semi-manual. Admin deposits apxUSD into YieldDistributor → LinearVestV0 → apyUSD vault pulls vested yield. The yield vesting is programmatic (30-day linear), but the initial deposit is admin-initiated.
- **Rate oracle**: **Manually set** by authorized role. The `setRate()` function has no automation, no TWAP, and no staleness check. If the oracle is not updated, the Curve pool will continue using the stale rate.
- **Minting**: Two-step process (request → execute) with 60-second delay. Rate-limited to ~10M/day.

### External Dependencies

| Dependency | Type | Criticality | Impact of Failure |
|------------|------|-------------|-------------------|
| **Off-chain preferred shares (STRC, SATA)** | Collateral backing | **Critical** | All value derives from off-chain equity holdings. Dividend cuts, issuer default, or custody failure would impair backing |
| **MPC Custody Providers** | Asset custody | **Critical** | Compromise or failure of custody could lead to loss of collateral. Multi-party MPC mitigates single-point risk |
| **Curve StableSwap-NG** | Primary liquidity venue | **High** | Main exit path for non-whitelisted users. Pool failure would severely restrict liquidity |
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

### Supply & Holder Monitoring

- Monitor Third-Party Safe (`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`) balance -- holds 36.5% of supply
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
| Curve pool balance ratio | Every 6 hours | High |
| apxUSD supply changes | Every 6 hours | High |
| Large holder movements | Daily | Medium |

## Risk Summary

### Key Strengths

- **Publicly-traded collateral**: Underlying preferred shares (STRC, SATA) are Nasdaq-listed with transparent pricing, dividend policies, and regulatory oversight
- **Well-designed minting safeguards**: EIP-712 structured signing, rate limiting (~10M/day), nonce-based replay protection, and two-step minting process
- **Good Curve pool liquidity**: ~$9M pool with <0.25% slippage for $1M swaps, 50% POL
- **Proper deployer decommissioning**: Deployer EOA's ADMIN_ROLE was revoked, admin control transferred to multisig
- **Multi-party MPC custody**: Shared key management between Apyx and partners prevents single-entity mismanagement

### Key Risks

- **Extremely new protocol**: Only ~11 days in production. No meaningful track record, stress testing, or historical data
- **Off-chain, unverifiable collateral**: Reserves backed by off-chain preferred shares with no on-chain proof of reserves. Monthly PCAOB attestations promised but none published yet
- **No timelock on admin actions**: Admin Safe (3/5) can upgrade all proxy contracts and change parameters immediately with zero delay
- **Anonymous team**: No team members publicly identified. BVI legal entity with $100 liability cap
- **Unverifiable audits**: 2 of 3 claimed audits (Zellic, Certora) have no publicly available reports. Only Quantstamp certificate is published
- **No bug bounty program**: Notable absence for a protocol managing ~$13M in token supply
- **Manual rate oracle**: Curve pool pricing depends on a manually-set oracle with no on-chain price feed, TWAP, or staleness detection

### Critical Risks

- **Proxy upgrade without timelock**: The Admin Safe can upgrade apxUSD, apyUSD, and the rate oracle implementation contracts immediately. A compromised or malicious 3-of-5 multisig could deploy a malicious implementation that drains all funds or manipulates balances -- with zero delay for detection or intervention
- **Off-chain collateral opacity**: If preferred shares are not actually held or are liquidated without disclosure, apxUSD could be undercollateralized with no on-chain mechanism to detect this. The protocol is too new for any attestation to have been published
- **Rate oracle manipulation**: A compromised admin could set the oracle rate to an extreme value, enabling extraction of value from the Curve pool. No staleness check or bounds validation exists in the oracle contract
- **Concentration risk**: 36.5% of supply held by a single 2-of-3 Safe with unknown owners. A rapid exit by this holder could destabilize the Curve pool and peg

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Quantstamp audit confirmed (Feb 2026). Zellic and Certora claimed but unverifiable. **PASS** (one confirmed reputable audit)
- [ ] **Unverifiable reserves** -- Reserves are entirely off-chain preferred shares. No on-chain proof of reserves. Monthly PCAOB attestations promised but none published yet. However, collateral is publicly-traded Nasdaq equity with transparent pricing. **BORDERLINE PASS** -- similar to USDC/USDT model but with no published attestations yet
- [x] **Total centralization** -- 3-of-5 Gnosis Safe multisig. Not a single EOA. **PASS**

**All gates pass (borderline).** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 1 confirmed audit (Quantstamp, reputable), 2 claimed but unverifiable (Zellic, Certora). Contract code verified on Etherscan but not open-sourced on GitHub.
- **Bug Bounty**: None found.
- **Time in Production**: ~11 days. Extremely young -- among the youngest protocols we've assessed.
- **TVL**: ~$13M token supply. Not tracked on DeFi Llama or CoinGecko.
- **Incidents**: None (too new).

**Score: 4.5/5** -- One confirmed reputable audit partially satisfies the audit requirement (between score 3 and 4 on audits alone). But the extremely short track record (~11 days, well below 3 months), absence of bug bounty, and unverifiable additional audits push this firmly into high-risk territory. The scoring rubric places <3 months at score 5 for track record. Conservative assessment: 4.5.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-5 Admin Multisig with 0-second execution delay (no timelock)
- Same 5 signers on both team multisigs, no external/independent signers
- UUPS upgradeable contracts can be upgraded immediately
- Deployer admin properly revoked
- No Guardian or independent veto mechanism

**Governance Score: 4.5** -- The 3-of-5 threshold is reasonable, but the complete absence of a timelock on admin actions (including proxy upgrades) is a severe concern. The ability to instantly upgrade all core contracts with no delay for community review or intervention is between score 4 (low threshold, <12 hours timelock) and score 5 (no timelock, unlimited admin powers). No independent signers.

**Subcategory B: Programmability**

- apxUSD: Standard ERC-20, no on-chain exchange rate needed (1:1 stablecoin)
- apyUSD: ERC-4626 with programmatic exchange rate
- Yield distribution: Linear vesting is programmatic, but initial deposits are admin-initiated
- Rate oracle: Manually set, no automation
- Minting: Programmatic rate limiting and signatures, but permissioned

**Programmability Score: 3.0** -- Hybrid system. apyUSD exchange rate and yield vesting are on-chain. But the rate oracle, yield distribution initiation, and minting are all dependent on admin input. Between score 3 (hybrid) and score 4 (significant manual intervention).

**Subcategory C: External Dependencies**

- **Critical**: Off-chain preferred share collateral (STRC, SATA) and MPC custody providers
- **High**: Curve pool for liquidity
- **Medium**: Gnosis Safe infrastructure

**Dependencies Score: 4.0** -- Critical dependency on off-chain assets and custody that cannot be verified on-chain. No fallback mechanism if custody providers fail. The oracle has no automated price feed.

**Centralization Score = (4.5 + 3.0 + 4.0) / 3 = 3.83**

**Score: 3.8/5** -- Significant centralization risk driven by no timelock on admin actions, UUPS upgradeable contracts with instant upgrade capability, off-chain dependencies, and a manually-controlled rate oracle.

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

- **Curve pool**: ~$9M, well-balanced, <0.25% slippage for $1M
- **Direct redemption**: Permissioned only (not available to general users/liquidators)
- **DEX exit**: Primary path for Morpho liquidators
- **No market stress data**: Protocol is 11 days old
- **Peg stability**: Currently stable (1.000061 virtual price) but untested

**Score: 2.5/5** -- Good Curve pool liquidity with low slippage for medium-sized positions. The pool is well-balanced with 50% POL, providing stability. However, direct redemption is not available to all users (permissioned), and there is zero stress-testing history. For the Morpho collateral use case, the Curve pool is the primary exit mechanism. Between score 2 (direct redemption with minor delays, >$5M) and score 3 (market-based, >$1M).

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
| Audits & Historical | 4.5 | 20% | 0.90 |
| Centralization & Control | 3.8 | 30% | 1.14 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 4.0 | 5% | 0.20 |
| **Final Score** | | | **3.74** |

**Final Score: 3.8** (rounded)

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

Apyx's apxUSD is a novel "Dividend-Backed Stablecoin" with an innovative approach to bridging off-chain corporate dividends into on-chain yield. The underlying collateral (publicly-traded preferred shares on Nasdaq) provides pricing transparency, and the Curve pool offers reasonable liquidity for medium-sized positions.

However, the protocol is **extremely young** (~11 days), has **no published reserve attestations**, relies on **off-chain collateral that cannot be verified on-chain**, has **no timelock on admin actions** (allowing instant proxy upgrades), an **anonymous team**, and a **manually-controlled rate oracle**. Two of three claimed audits cannot be independently verified.

**For the intended Yearn use case (apxUSD as Morpho collateral):**
- The primary liquidation path is through the Curve pool (~$9M, good liquidity)
- apxUSD should maintain its peg through arbitrage by whitelisted participants
- However, the peg mechanism is entirely untested under stress, and the oracle is manually set
- Morpho exposure should be strictly limited given the protocol's youth and elevated risk profile

**Key conditions for any exposure:**
- Verify that published PCAOB attestations exist before committing significant capital
- Confirm the Zellic and Certora audit reports become publicly available
- Monitor the rate oracle for any changes (currently 1.0000)
- Monitor Curve pool balance ratio for peg stability signals
- Strict position size limits given the $9M Curve pool depth
- Request the team implement a timelock on admin actions before expanding exposure
- Verify the identity/purpose of the 2-of-3 Safe holding 36.5% of supply

---

## Reassessment Triggers

- **Time-based**: Reassess in 1 month (April 2026) -- protocol's extreme youth demands rapid re-evaluation
- **TVL-based**: Reassess if TVL changes by more than 50%
- **Incident-based**: Reassess after any exploit, governance change, oracle manipulation, or peg deviation >2%
- **Attestation-based**: Reassess when first PCAOB attestation is published
- **Audit-based**: Reassess when Zellic and/or Certora audit reports become publicly available
- **Governance-based**: Reassess if timelock is implemented or multisig composition changes
- **Bug bounty**: Reassess if a bug bounty program is launched
