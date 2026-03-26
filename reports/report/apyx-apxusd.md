# Protocol Risk Assessment: Apyx

- **Assessment Date:** March 26, 2026
- **Token:** apxUSD
- **Chain:** Ethereum
- **Token Address:** [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
- **Final Score: 5.0/5.0**

## Overview + Links

Apyx is a "Dividend-Backed Stablecoin" (DBS) protocol that converts off-chain corporate dividend income from publicly-traded Digital Asset Treasury (DAT) preferred shares into on-chain programmable yield. The protocol offers two tokens:

- **apxUSD**: A synthetic dollar backed by an overcollateralized basket of low-volatility, variable-rate DAT preferred shares. It does NOT pay yield directly to holders and serves as the protocol's primary liquidity and collateral layer.
- **apyUSD**: A yield-bearing ERC-4626 vault token. Users deposit apxUSD and receive apyUSD, which accrues yield through a rising exchange rate (non-rebasing) funded by dividends from the underlying DAT preferred share portfolio.

**Collateral**: The basket currently includes preferred shares from publicly-traded companies:
- **STRC** (Strategy Inc Variable Rate Series A Perpetual Preferred Stock, ~11.25% indicated dividend rate, $100 par value, Nasdaq-listed)
- **SATA** (Strive Inc Variable Rate Series A Perpetual Preferred Stock, ~12% dividend, Nasdaq-listed)

The collateral is dynamically rebalanced based on issuer concentration limits, liquidity needs, and overcollateralization requirements.

**Key metrics (March 26, 2026):**
- apxUSD Total Supply: ~66,978,450 (supply cap: 100,000,000)
- Curve apxUSD/USDC Pool: ~$5.5M TVL (2.72M apxUSD + 2.77M USDC)
- Listed on CoinGecko (~$41M market cap, rank #512). Not listed on DeFi Llama.
- Chain: Ethereum only (Solana planned)
- Protocol launched: February 18, 2026 (~36 days ago)

**Links:**

- [Protocol Website](https://apyx.fi/)
- [Protocol Documentation](https://docs.apyx.fi)
- [apxUSD Overview](https://docs.apyx.fi/apxusd/overview)
- [apyUSD Overview](https://docs.apyx.fi/apyusd/overview)
- [Blog - Introducing Apyx](https://blog.apyx.fi/introducing-apyx/)
- [Audits Page](https://docs.apyx.fi/resources/audits)
- [FAQ](https://docs.apyx.fi/resources/faq)
- [Curve Pool](https://www.curve.finance/dex/ethereum/pools/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)
- [CoinGecko](https://www.coingecko.com/en/coins/apxusd)
- [DFDV Investment Announcement](https://www.globenewswire.com/news-release/2026/02/26/3245596/0/en/DeFi-Development-Corp-Announces-Investment-in-Apyx-The-First-Dividend-Backed-Stablecoin-DBS-Protocol.html)
- [GitHub - evm-contracts](https://github.com/apyx-labs/evm-contracts)

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
| Operations Safe | [`0x37b0779a66edc491df83e59a56d485835323a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555) | 3-of-5 Gnosis Safe, 5 of the 6 Admin Safe owners |
| Third-Party Safe | [`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`](https://etherscan.io/address/0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50) | 2-of-3 Gnosis Safe, different owners, holds 36.5% of supply |

### Liquidity Contracts

| Contract | Address | Type |
|----------|---------|------|
| Curve apxUSD/USDC Pool | [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) | CurveStableSwapNG |

### On-Chain Verification (Etherscan, March 26, 2026)

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
| 2 | **Zellic** | Mar 2026 | Apyx Stablecoin | [Report (PDF)](https://github.com/Zellic/publications/blob/master/Apyx%20Stablecoin%20-%20Zellic%20Audit%20Report.pdf) |
| 3 | **Certora** | Mar 2026 | apxUSD (formal verification) | [Report](https://www.certora.com/reports/apyx-apxusd) / [PDF](https://github.com/Certora/SecurityReports/blob/main/Reports/2026/03_02_2026_Apyx_apxUSD.pdf) |

**Notes:**
- **Quantstamp**: Certificate is JavaScript-rendered; specific finding counts could not be extracted programmatically. Repo tag `audit/2026-02-02-quantstamp` confirms the audit.
- **Zellic**: Published March 20, 2026 to their GitHub publications repo. Repo branch `audit/2026-01-12-zellic-remediation` and multiple PRs (e.g., #65, #110) reference Zellic findings with remediations.
- **Certora**: Published March 3, 2026. **14 total findings: 1 High severity (fixed and confirmed), 4 Medium, 9 Low/Informational.** Notable: M-01 flagged the backing model as entirely trust-based with no on-chain verification. Repo tag `audit/2026-01-19-certora` confirms.
- All three audits are now publicly verifiable. The [Apyx docs audits page](https://docs.apyx.fi/resources/audits) lists all three with direct links.

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

- **Time in Production**: apxUSD proxy deployed February 18, 2026 (block [24481772](https://etherscan.io/tx/0xfb528661b410cce683a1ee40b49a5249dbd677e8304a102927bc6639486f450b)). In production for **~36 days** as of March 26, 2026. **Young protocol** (still under 3 months).
- **GitHub Repository**: [`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts) — public Foundry repo with 263 commits, 2 contributors. Contains all core contract source code (43 Solidity files), comprehensive test suite (60+ test files including invariant tests and audit-remediation tests), Slither CI. Created January 5, 2026. No license specified.
- **TVL History**: Not tracked by DeFi Llama. Listed on CoinGecko (~$41M market cap, rank #512). Based on on-chain data:
  - Total apxUSD supply: ~66,978,450 (5.1x growth from ~13M at launch)
  - apyUSD vault: ~36.9M apxUSD backing (55.1% of supply)
  - Uniswap V4: ~7.84M apxUSD
  - Curve pool: ~$5.5M (2.72M apxUSD + 2.77M USDC) — down from ~$9M at launch
  - Admin Safe: ~2.2M apxUSD
  - Third-Party Safe: ~3.58M apxUSD
- **Supply Growth**: Rapid — 5.1x in 36 days. Supply grew from ~13M to ~67M while Curve pool TVL decreased from ~$9M to ~$5.5M. Liquidity has not kept pace with supply growth.
- **Incidents**: None reported
- **Peg Stability**: Curve pool virtual price is 1.000253 with near-balanced composition. Peg has held stable since launch, though untested under market stress.

### apxUSD Supply Distribution

| Holder | Balance | % of Supply |
|--------|---------|-------------|
| apyUSD Vault (backing) | 36,893,661 | 55.1% |
| Uniswap V4 PoolManager | 7,844,005 | 11.7% |
| Third-Party Safe (2-of-3) | 3,581,374 | 5.3% |
| Curve Pool (apxUSD/USDC) | 2,724,749 | 4.1% |
| Admin Safe (3-of-6) | 2,200,000 | 3.3% |
| Other (Pendle, users, etc.) | ~13,734,661 | ~20.5% |

**Distribution shift**: The apyUSD vault now dominates supply (55.1%), indicating strong adoption of the yield-bearing product. The Third-Party Safe concentration risk has decreased significantly (36.5% → 5.3%). Curve pool share of supply dropped from 34.7% to 4.1% as supply outgrew the pool.

## Funds Management

### Minting & Redemption

**Minting apxUSD**: **Permissioned, no on-chain collateral required.** Minting creates tokens without any backing asset transfer in the transaction. The `ApxUSD.mint()` function only checks that the caller has `MINT_STRAT_ROLE` and that `totalSupply` does not exceed `supplyCap` — then calls `_mint(to, amount)`. **No `transferFrom`, no collateral deposit, no on-chain proof of backing.** The entire collateral relationship is trust-based and off-chain.

Minting uses EIP-712 structured data signing via MinterV0 with the following on-chain safeguards:
- Maximum single mint: 5,000,000 apxUSD
- Rate limit: 5,000,000 apxUSD per 24 hours
- 60-second execution delay via AccessManager (reduced from initial 4 hours)
- Nonce-based replay protection per beneficiary

**Minting roles:**
- **MinterV0** ([`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e)): Holds `MINT_STRAT_ROLE` (role 1). Enforces rate limits, EIP-712 signatures, and nonce checks.
- **Admin Safe** ([`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2)): Does NOT currently hold `MINT_STRAT_ROLE`, but can **self-grant it at any time** (0-second delay as ADMIN_ROLE holder), bypassing all MinterV0 rate limits and signature checks.

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

- **apxUSD backing**: Off-chain. No on-chain proof of reserves. Monthly PCAOB attestations promised but **no attestations published in 36 days**.
- **apyUSD exchange rate**: Calculated on-chain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Anyone can verify. Current rate: 1.3476 apxUSD per apyUSD.
- **Yield distribution**: Semi-programmatic. YieldDistributor deposits apxUSD into LinearVestV0, which vests linearly over ~17 days (1,489,445 seconds). The apyUSD vault pulls vested yield, increasing totalAssets and therefore the exchange rate. The initial yield distribution is admin-initiated.
- **Rate oracle**: The ApxUSDRateOracle is **manually set** by an authorized role via `setRate()`. Currently set at exactly 1.000000 (1:1 with USDC). No on-chain price feed, no TWAP, no staleness check. Used by the Curve StableSwap-NG pool for pricing.

## Liquidity Risk

### Primary Exit Mechanisms

For the Morpho collateral use case, the relevant question is: how can liquidators exit an apxUSD position?

1. **Curve StableSwap-NG Pool (Primary)**: apxUSD/USDC pool with ~$5.5M total liquidity (2.72M apxUSD + 2.77M USDC), near-balanced. **Down from ~$9M at launch.**

2. **Uniswap V4**: ~7.84M apxUSD in pool manager (~$1.93M 24h volume per CoinGecko). Now the most active trading venue.
3. **Direct Redemption**: Available only to whitelisted entities. Not a general exit path.

### Liquidity Assessment

- **Pool quality**: Curve pool is near-balanced but represents only **4.1% of total supply** (down from 35% at launch). Supply has outgrown liquidity significantly.
- **Liquidity degradation**: Curve pool TVL dropped 39% ($9M → $5.5M) while supply grew 414% (13M → 67M). This is a material deterioration in the liquidity-to-supply ratio.
- **Uniswap V4**: Has grown to become the primary trading venue with ~$1.93M daily volume.
- **No stress testing**: Protocol is 36 days old, no market stress data available.
- **Morpho context**: For Morpho liquidations, apxUSD would need to be sold quickly. The Curve pool has adequate absolute liquidity for positions up to ~$1M, but much less headroom than at launch.
- **Pendle integration**: PT-apxUSD positions exist on Pendle, providing additional secondary market activity.

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
- **Admin Safe**: 3-of-6 Gnosis Safe. **Sole holder of ADMIN_ROLE with 0-second execution delay.** Can:
  - Upgrade all UUPS proxy contracts (apxUSD, apyUSD, rate oracle) **immediately**
  - Grant/revoke all roles
  - Pause the protocol
  - Manage the AddressList (whitelist/deny list)
  - Change fee parameters, unlock token, vesting contract
  - Set rate oracle value
- **Operations Safe**: 3-of-5 Gnosis Safe, with 5 of the 6 Admin Safe owners. No AccessManager roles -- used as intermediary for token distribution.
- **Deployer EOA**: ADMIN_ROLE was properly revoked at the same block it was granted to the Safe (block 24481052).

**Key concerns:**
- **No timelock** on admin actions. The Admin Safe can upgrade all proxy contracts and change any parameter instantly with a 3-of-6 signature.
- 5 of 6 Admin Safe signers are also on the Operations Safe -- limited separation of concerns.
- The Admin Safe directly holds ~2,200,000 apxUSD (3.3% of supply).
- The 60-second mint delay (reduced from initial 4 hours in block 24494943) provides minimal protection.

### Programmability

- **apxUSD**: Standard ERC-20 with no on-chain exchange rate (it's a 1:1 stablecoin). Minting is permissioned and programmatically rate-limited.
- **apyUSD exchange rate**: Calculated on-chain via ERC-4626 (`totalAssets / totalSupply`). Programmatic, no admin input needed for the rate itself.
- **Yield distribution**: Semi-manual. Admin deposits apxUSD into YieldDistributor → LinearVestV0 → apyUSD vault pulls vested yield. The yield vesting is programmatic (~17-day linear), but the initial deposit is admin-initiated.
- **Rate oracle**: **Manually set** by authorized role. The `setRate()` function has no automation, no TWAP, and no staleness check. If the oracle is not updated, the Curve pool will continue using the stale rate.
- **Minting**: Two-step process (request → execute) with 60-second delay. Rate-limited to 5M/day via MinterV0. Admin can bypass by self-granting mint role.

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

- **Team Transparency**: **Public**. Six founding contributors are [named on the Apyx website](https://apyx.fi/#team), most with extensive crypto and TradFi backgrounds. Five currently hold C-suite roles at **DeFi Development Corp.** (Nasdaq: DFDV):
  - **Joseph Onorati** — CEO of DFDV. Former CSO at Kraken (8 years), founded a crypto market-making/HFT firm, former CEO of CaVirtEx (Canada's first Bitcoin exchange). Master's in Economics (monetary theory).
  - **Parker White, CFA** — COO & CIO of DFDV. Former Director of Engineering at Kraken (6 years). Background in bond trading and portfolio management (~$2B AUM). Active in DeFi since 2021.
  - **John Han, CFA** — CFO of DFDV. Former CFO of a unicorn L1 blockchain company, VP of Finance at Binance, Head of Strategic Finance at Kraken. Previously at Goldman Sachs equity research.
  - **Dan Kang (DK)** — CSO of DFDV. Former Head of Strategy at Kraken (3 years). Background as a long-short equity analyst (7 years), formerly at Morgan Stanley and Snap. Mathematics degree from Columbia.
  - **Pete Humiston** — CMO of DFDV. In crypto full-time since 2018. Former Sales & Trading at Jefferies. Focus on research, content, and marketing.
  - **Dawson Reid** — Founding contributor. 9 years at Kraken across full engineering stack. 15+ years of software engineering experience, in crypto since 2013.

  The team has strong overlap with DFDV, which is also Apyx's first institutional investor. This dual role (team members = investor executives) is a notable concentration of interest.
- **Fundraising**: Raised $3M across two rounds at a $300M valuation. "No VCs, by design." First institutional capital from DFDV.
- **Documentation**: Adequate. Main docs, FAQ, and audits page are functional. Documentation has been updated since launch.
- **Legal Structure**: **Preference Capital (BVI) Ltd.** and affiliates, incorporated in the British Virgin Islands. Explicitly disclaims being a "marketplace facilitator, broker, financial institution or creditor." Liability capped at $100 per user. US, EU, EEA geo-blocked.
- **Incident Response**: Not formally documented. The Admin Safe can pause the protocol immediately. No Guardian or independent cancellation mechanism.
- **Code Availability**: Contracts verified on Etherscan and **open-sourced on GitHub** ([`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts)). Full Foundry project with source and tests. No license specified.
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
- **Three reputable audits**: Quantstamp, Zellic, and Certora audits all completed and publicly published with remediation evidence in the repo
- **Minting safeguards**: EIP-712 structured signing, rate limiting (5M/day), nonce-based replay protection, and two-step minting process with 60-second delay
- **Open-source code**: Full Foundry project with 43 source files, 60+ test files including invariant tests, and Slither CI
- **Public, credentialed team**: Six named founding contributors with verifiable backgrounds at Kraken, Goldman Sachs, Binance, and DeFi Development Corp.
- **Proper deployer decommissioning**: Deployer EOA's ADMIN_ROLE was revoked, admin control transferred to multisig
- **Multi-party MPC custody**: Shared key management between Apyx and partners prevents single-entity mismanagement

### Key Risks

- **Young protocol**: ~36 days in production. Limited track record, no stress testing, still under 3 months
- **Off-chain, unverifiable collateral**: Reserves backed by off-chain preferred shares with no on-chain proof of reserves. Monthly PCAOB attestations promised but **none published in 36 days**. No custodian publicly named. Certora M-01 flagged this as entirely trust-based.
- **No timelock on admin actions**: Admin Safe (3/6) can upgrade all proxy contracts and change parameters immediately with zero delay
- **Liquidity-supply mismatch**: Curve pool TVL dropped from ~$9M to ~$5.5M while supply grew 5.1x to ~67M. Pool now represents only 4.1% of supply.
- **DFDV concentration**: All six founding contributors are executives at DeFi Development Corp. (Nasdaq: DFDV), which is also the protocol's first institutional investor. BVI legal entity with $100 liability cap
- **No bug bounty program**: Notable absence for a protocol managing ~$67M in token supply
- **Manual rate oracle**: Curve pool pricing depends on a manually-set oracle with no on-chain price feed, TWAP, or staleness detection

### Critical Risks

- **Unbacked minting**: `ApxUSD.mint()` creates tokens without any on-chain collateral transfer. The function only checks role and supply cap — no `transferFrom`, no collateral deposit. The Admin Safe can self-grant `MINT_STRAT_ROLE` (0-second delay), bypassing MinterV0's rate limits and signature checks entirely. **Tokens can be printed without backing at the discretion of the 3-of-6 multisig.**
- **Proxy upgrade without timelock**: The Admin Safe can upgrade apxUSD, apyUSD, and the rate oracle implementation contracts immediately. A compromised or malicious 3-of-6 multisig could deploy a malicious implementation that drains all funds or manipulates balances -- with zero delay for detection or intervention
- **Off-chain collateral opacity**: If preferred shares are not actually held or are liquidated without disclosure, apxUSD could be undercollateralized with no on-chain mechanism to detect this. No PCAOB attestation has been published despite being promised monthly.
- **Rate oracle manipulation**: A compromised admin could set the oracle rate to an extreme value, enabling extraction of value from the Curve pool. No staleness check or bounds validation exists in the oracle contract

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Three reputable audits confirmed: Quantstamp (Feb 2026), Zellic (Mar 2026), Certora (Mar 2026). All publicly published. **PASS**
- [ ] **Unverifiable reserves** -- Reserves are entirely off-chain preferred shares. No on-chain proof of reserves. Monthly PCAOB attestations promised but **none published in 36 days**. No custodian publicly named. Certora M-01 flagged backing as entirely trust-based. Collateral is publicly-traded Nasdaq equity with transparent pricing, but this is **not comparable to USDC/USDT** which publish regular attestations from named, regulated custodians. **FAIL** -- no proof of reserves exists, neither on-chain nor off-chain.
- [x] **Total centralization** -- 3-of-6 Gnosis Safe multisig. Not a single EOA. **PASS**

**Unverifiable reserves gate FAILS.** Gate override applied: final score overridden to **5.0**.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 confirmed audits from reputable firms (Quantstamp, Zellic, Certora). All publicly published with remediation evidence. Certora identified 14 findings (1 High, fixed). Open-source code on GitHub with 60+ test files and invariant tests.
- **Bug Bounty**: None found.
- **Time in Production**: ~36 days. Young -- still under 3 months.
- **TVL**: ~$67M token supply. Listed on CoinGecko (~$41M market cap). Not on DeFi Llama.
- **Incidents**: None.

**Score: 3.5/5** -- Three reputable audits with public reports and on-chain remediation evidence is a strong positive. Open-source code with comprehensive tests. Between score 3 (multiple audits, 3-6 months, established) and score 4 (single audit, <3 months). The 36-day track record (<3 months) and absent bug bounty keep this from reaching 3.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-6 Admin Multisig with 0-second execution delay (no timelock)
- Operations Safe is 3-of-5 with 5 of the 6 Admin Safe owners — limited separation
- UUPS upgradeable contracts can be upgraded immediately
- Deployer admin properly revoked
- No Guardian or independent veto mechanism

**Governance Score: 4.0** -- The 3-of-6 threshold (50%) is reasonable. But the complete absence of a timelock on admin actions (including proxy upgrades) is a severe concern. The ability to instantly upgrade all core contracts with no delay for community review or intervention is between score 4 (low threshold, <12 hours timelock) and score 5 (no timelock, unlimited admin powers). The upgrade from 3-of-5 to 3-of-6 is a marginal improvement.

**Subcategory B: Programmability**

- apxUSD: Standard ERC-20, no on-chain exchange rate needed (1:1 stablecoin)
- apyUSD: ERC-4626 with programmatic exchange rate
- Yield distribution: ~17-day linear vesting is programmatic, but initial deposits are admin-initiated
- Rate oracle: Manually set, no automation
- Minting: Programmatic rate limiting and signatures, but permissioned
- 60-second mint delay reduced from initial 4 hours — governance action lowered safeguard

**Programmability Score: 3.5** -- Hybrid system. apyUSD exchange rate and yield vesting are on-chain. But the rate oracle is entirely manually controlled, yield distribution requires admin initiation, and the 60-second minting delay was reduced from 4 hours. Between score 3 (hybrid) and score 4 (significant manual intervention).

**Subcategory C: External Dependencies**

- **Critical**: Off-chain preferred share collateral (STRC, SATA) and MPC custody providers
- **High**: Curve pool for liquidity
- **Medium**: Gnosis Safe infrastructure

**Dependencies Score: 4.0** -- Critical dependency on off-chain assets and custody that cannot be verified on-chain. No fallback mechanism if custody providers fail. The oracle has no automated price feed.

**Centralization Score = (4.0 + 3.5 + 4.0) / 3 = 3.83**

**Score: 3.8/5** -- Significant centralization risk driven by no timelock on admin actions, UUPS upgradeable contracts with instant upgrade capability, off-chain dependencies, and a manually-controlled rate oracle.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Off-chain backing by publicly-traded preferred shares (Nasdaq-listed)
- Overcollateralized (specific ratio undisclosed)
- Multi-party MPC custody
- Cannot verify collateral on-chain
- Reserve is equity (not stablecoins) -- more volatile than typical stablecoin collateral

**Collateralization Score: 4.0** -- Between score 3 (100% collateral, some off-chain, periodic attestation) and score 4 (partially collateralized or custodial, opaque reporting). Raised from 3.5: 36 days in and still no published attestation despite monthly cadence being promised. No custodian publicly named. Overcollateralization ratio undisclosed. Certora M-01 flagged the entire backing model as trust-based. Collateral is publicly-traded equity with transparent pricing, but that alone doesn't prove reserves are held.

**Subcategory B: Provability**

- apyUSD exchange rate: on-chain (ERC-4626)
- apxUSD collateral: entirely off-chain
- Monthly PCAOB attestations promised but **none published in 36 days**
- Daily NAV reporting promised but not verified
- Rate oracle: manually set, no third-party verification
- No custodian publicly named

**Provability Score: 4.5** -- Between score 4 (infrequent reporting, self-reported only) and score 5 (no reporting at all). After 36 days, zero attestations have been published despite a monthly cadence being promised. No custodian is named. All reserve claims are unverified. The protocol has had enough time to publish at least one attestation and has not.

**Funds Management Score = (4.0 + 4.5) / 2 = 4.25**

**Score: 4.25/5** -- Off-chain collateral with no published attestations after 36 days. No custodian named. Publicly-traded equity provides pricing transparency but not reserve verification.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Curve pool**: ~$5.5M (down from $9M), near-balanced, represents only 4.1% of supply
- **Uniswap V4**: ~7.84M apxUSD, ~$1.93M daily volume — now the primary trading venue
- **Direct redemption**: Permissioned only (not available to general users/liquidators)
- **No market stress data**: Protocol is 36 days old
- **Peg stability**: Currently stable (1.000253 virtual price) but untested under stress

**Score: 3.0/5** -- Curve pool liquidity has degraded significantly: TVL dropped 39% while supply grew 414%. The pool now represents only 4.1% of supply (was 35%). Direct redemption remains permissioned. Uniswap V4 has emerged as the primary venue. Between score 3 (market-based, >$1M, adequate for medium positions) and score 2 (deep liquidity). The deteriorating liquidity-to-supply ratio and lack of stress testing push this to 3.0.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Public. Six named founding contributors with verifiable backgrounds (Kraken, Goldman Sachs, Binance, DFDV). Strong institutional credibility via Nasdaq-listed DFDV.
- **Documentation**: Adequate. Main docs and FAQ functional. Audits page lists all three reports with links.
- **Legal Structure**: BVI entity with $100 liability cap. US/EU/EEA geo-blocked.
- **Incident Response**: No formal plan. Admin can pause immediately.
- **Code Availability**: Verified on Etherscan and open-sourced on GitHub ([`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts)). Full Foundry project with 60+ test files, invariant tests, and Slither CI. No license specified.

**Score: 2.0/5** -- Public, well-credentialed team with verifiable track records at major crypto and TradFi institutions. Open-source code with comprehensive tests. Between score 2 (fully public, strong track record, open source) and score 3 (adequate docs). Remaining concerns: BVI entity with minimal liability ($100 cap), no formal incident response plan, no license on the repo.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.5 | 20% | 0.70 |
| Centralization & Control | 3.8 | 30% | 1.14 |
| Funds Management | 4.25 | 30% | 1.275 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Weighted Total** | | | **3.67** |
| **Gate Override** | | | **Unverifiable reserves → 5.0** |
| **Final Score** | | | **5.0/5.0** |

**Weighted Total: 3.7** — but the **Unverifiable Reserves critical risk gate fails**. No proof of reserves exists (neither on-chain nor off-chain), no custodian is named, and no PCAOB attestation has been published in 36 days despite a monthly cadence being promised. Certora M-01 confirmed the backing model is entirely trust-based. **Gate override applied: Final Score = 5.0.**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: High Risk — Not recommended**

---

Apyx's apxUSD is a novel "Dividend-Backed Stablecoin" with an innovative approach to bridging off-chain corporate dividends into on-chain yield. The team is public and well-credentialed, all three audits are now published, and the code is open-source with comprehensive tests.

However, **apxUSD fails the Unverifiable Reserves critical risk gate.** After 36 days in production, no proof of reserves exists — no PCAOB attestation, no named custodian, no on-chain verification. The backing model is entirely trust-based (confirmed by Certora M-01). Additionally, the protocol has **no timelock on admin actions** (allowing instant proxy upgrades), a **manually-controlled rate oracle**, and **Curve pool liquidity has degraded** from ~$9M to ~$5.5M while supply grew 5.1x.

**Yearn should not take exposure to this asset until the Unverifiable Reserves gate is resolved.**

**Conditions to clear the gate and reconsider exposure:**
1. Publish at least one PCAOB-registered audit firm attestation verifying reserves
2. Publicly name the custodian(s) holding the preferred shares
3. Disclose the overcollateralization ratio with supporting evidence
4. Implement a timelock on admin actions (minimum 24 hours for proxy upgrades)

**If the gate is cleared, additional conditions for exposure:**
- Monitor the rate oracle for any changes (currently 1.0000)
- Monitor Curve pool balance ratio for peg stability signals
- Strict position size limits given the reduced ~$5.5M Curve pool depth
- Monitor supply growth vs liquidity ratio

---

## Reassessment Triggers

- **Attestation-based**: Reassess when first PCAOB attestation is published (primary trigger for clearing the gate)
- **Governance-based**: Reassess if timelock is implemented or multisig composition changes
- **Time-based**: Reassess in 1 month (April 2026)
- **TVL-based**: Reassess if TVL changes by more than 50%
- **Liquidity-based**: Reassess if Curve pool TVL drops below $3M or supply-to-liquidity ratio exceeds 20x
- **Incident-based**: Reassess after any exploit, governance change, oracle manipulation, or peg deviation >2%
- **Bug bounty**: Reassess if a bug bounty program is launched
