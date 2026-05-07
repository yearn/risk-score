# Protocol Risk Assessment: Apyx

- **Assessment Date:** April 19, 2026 (Updated May 7, 2026)
- **Token:** apxUSD
- **Chain:** Ethereum + Base
- **Token Address:** [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
- **Final Score: 3.48/5.0**

## Overview + Links

Apyx is a "Dividend-Backed Stablecoin" (DBS) protocol that converts offchain corporate dividend income from publicly-traded Digital Asset Treasury (DAT) preferred shares into onchain programmable yield. The protocol offers two tokens:

- **apxUSD**: A synthetic dollar backed by an overcollateralized basket of low-volatility, variable-rate DAT preferred shares. It does NOT pay yield directly to holders and serves as the protocol's primary liquidity and collateral layer.
- **apyUSD**: A yield-bearing ERC-4626 vault token. Users deposit apxUSD and receive apyUSD, which accrues yield through a rising exchange rate (non-rebasing) funded by dividends from the underlying DAT preferred share portfolio.

**Collateral**: The basket currently includes preferred shares from publicly-traded companies:
- **STRC** (Strategy Inc Variable Rate Series A Perpetual Preferred Stock, ~11.25% indicated dividend rate, $100 par value, Nasdaq-listed)
- **SATA** (Strive Inc Variable Rate Series A Perpetual Preferred Stock, ~12% dividend, Nasdaq-listed)

The collateral is dynamically rebalanced based on issuer concentration limits, liquidity needs, and overcollateralization requirements.

### Can Holders Lose Money?

Yes. apxUSD is intended to trade near $1, but it is not backed by onchain stablecoins or cash-equivalents. Its backing is an offchain portfolio of DAT preferred shares. If those preferred shares fall in value, dividends are cut, custody fails, reserves are misreported, or liquid secondary markets dry up, apxUSD can trade below $1 and holders can lose principal.

apyUSD inherits the same risk because it is redeemable into apxUSD. Its exchange rate can rise in apxUSD terms while the USD value of apxUSD itself falls. The 30-day redemption cooldown can also delay exits during stress.

**Key metrics (May 7, 2026):**
- apxUSD Total Supply (Ethereum): ~306.86M (supply cap raised to 500M)
- Base supply: ~14.34M apxUSD and ~0.75M apyUSD via Chainlink CCIP
- apyUSD vault totalAssets: ~103.61M apxUSD (~33.8% of Ethereum apxUSD supply); apyUSD totalSupply: ~76.01M shares; exchange rate: 1.3632 apxUSD per apyUSD
- Curve apxUSD/USDC Pool: ~$29.07M TVL (14.50M apxUSD + 14.57M USDC); virtual price 1.000301
- Uniswap V4 PoolManager: ~10.47M apxUSD
- Listed on CoinGecko
- Chains: Ethereum and Base (via Chainlink CCIP; Solana planned)
- Protocol launched: February 18, 2026 (~78 days ago)

**Links:**

- [Protocol Website](https://apyx.fi/)
- [Protocol Documentation](https://docs.apyx.fi)
- [apxUSD Overview](https://docs.apyx.fi/apxusd/overview)
- [apyUSD Overview](https://docs.apyx.fi/apyusd/overview)
- [Blog - Introducing Apyx](https://blog.apyx.fi/introducing-apyx/)
- [Audits Page](https://docs.apyx.fi/resources/audits)
- [Third-Party Attestation Page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation)
- [Custody Overview](https://docs.apyx.fi/collateral-and-custody/custody-overview)
- [Transparency](https://docs.apyx.fi/collateral-and-custody/transparency)
- [Accountable Proof-of-Reserves Dashboard](https://accountable.apyx.fi/)
- [Accountable DVN Registry](https://dvn.accountable.capital/v1/stats)
- [Curve Pool](https://www.curve.finance/dex/ethereum/pools/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)
- [CoinGecko](https://www.coingecko.com/en/coins/apxusd)
- [GitHub - evm-contracts](https://github.com/apyx-labs/evm-contracts)

## Contract Addresses

### Core Contracts (Ethereum)

| Contract | Address | Type |
|----------|---------|------|
| apxUSD (Proxy) | [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665) | ERC-20, UUPS Proxy |
| apxUSD (Implementation, current) | [`0xdd71fd677fde2ed2579a3c45204f41a11016ccb4`](https://etherscan.io/address/0xdd71fd677fde2ed2579a3c45204f41a11016ccb4) | ApxUSD (upgraded) |
| apyUSD (Proxy) | [`0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a`](https://etherscan.io/address/0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a) | ERC-4626 Vault, UUPS Proxy |
| apyUSD (Implementation, current) | [`0x208507be7b01becfa4d93ee8a7d1f202ec66cacf`](https://etherscan.io/address/0x208507be7b01becfa4d93ee8a7d1f202ec66cacf) | ApyUSD (upgraded) |
| AccessManager | [`0xe167330e2eac88666de253e9607c6d9ae0ca2824`](https://etherscan.io/address/0xe167330e2eac88666de253e9607c6d9ae0ca2824) | OpenZeppelin AccessManager |
| MinterV0 | [`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e) | Mint Strategy (EIP-712) |
| ApxUSDRateOracle (Proxy) | [`0xa2ef2e7bf32248083e514a737259f3785ea8d37d`](https://etherscan.io/address/0xa2ef2e7bf32248083e514a737259f3785ea8d37d) | Curve Pool Oracle, UUPS Proxy |
| ApxUSDRateOracle (Implementation, current) | [`0x26ea4a9099b4da41b2d0e7e9874a29104d8bb17f`](https://etherscan.io/address/0x26ea4a9099b4da41b2d0e7e9874a29104d8bb17f) | Rate oracle (upgraded) |
| LinearVestV0 | [`0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f`](https://etherscan.io/address/0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f) | Yield Vesting (~17-day linear) |
| YieldDistributor | [`0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a`](https://etherscan.io/address/0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a) | Distributes yield to vesting |
| AddressList | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Whitelist/Deny List |
| UnlockToken | [`0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6`](https://etherscan.io/address/0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6) | apyUSD Unlock Token (30-day cooldown) |
| CommitToken (apxUSD) | [`0x17122d869d981d184118b301313bcd157c79871e`](https://etherscan.io/address/0x17122d869d981d184118b301313bcd157c79871e) | CT-apxUSD |
| CommitToken (LP) | [`0xdfc3cf7e540628a52862907dc1ab935cd5859375`](https://etherscan.io/address/0xdfc3cf7e540628a52862907dc1ab935cd5859375) | CT-apxUSDUSDC |
| OrderDelegate | [`0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1`](https://etherscan.io/address/0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1) | Minting Delegate |

### Base / Cross-Chain Contracts

| Contract | Address | Type |
|----------|---------|------|
| apxUSD (Base) | [`0xd993935e13851dd7517af10687ec7e5022127228`](https://basescan.org/address/0xd993935e13851dd7517af10687ec7e5022127228) | Base deployment of apxUSD |
| apyUSD (Base) | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://basescan.org/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Base deployment of apyUSD |
| Base AccessManager | [`0x8AFDE6a90d2396A64eB97e8E69e7548289f78A1D`](https://basescan.org/address/0x8AFDE6a90d2396A64eB97e8E69e7548289f78A1D) | AccessManager returned by Base token `authority()` |

**Bridge / interoperability:** Apyx's Base expansion uses **Chainlink CCIP**. Apyx's April 1, 2026 Base launch post describes the Base expansion as Chainlink-powered cross-chain support, and its April 10, 2026 Chainlink post explicitly states that Apyx is leveraging Chainlink CCIP and Data Feeds for cross-chain expansion of apxUSD and apyUSD. Onchain checks against Base show the Base apxUSD token exposes Apyx-style `authority()` access control and does not expose standard LayerZero OFT methods (`endpoint()`, `oftVersion()` reverted in this review).

### Governance & Multisig Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Admin Safe (current) | [`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96) | **4-of-6** Gnosis Safe, current holder of ADMIN_ROLE (0 exec delay). Granted 2026-03-20. |
| Guardian/Upgrader Safe (former Admin) | [`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2) | 3-of-6 Gnosis Safe. No longer holds ADMIN_ROLE. Now holds: role 24 (UPGRADER, 3-day exec delay), role 21 (PAUSER, 0 delay), role 22 (UNPAUSER, 4-hour delay), role 7 (YIELD_OPERATOR, 0 delay). |
| Operations Safe | [`0x37b0779a66edc491df83e59a56d485835323a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555) | 3-of-5 Gnosis Safe. No AccessManager roles. |
| Third-Party Safe | [`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`](https://etherscan.io/address/0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50) | 2-of-3 Gnosis Safe, holds ~1.03M apxUSD (was 3.58M). |

### Liquidity Contracts

| Contract | Address | Type |
|----------|---------|------|
| Curve apxUSD/USDC Pool | [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) | CurveStableSwapNG |

### On-Chain Verification (Etherscan, April 19, 2026)

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
- **Certora**: Published March 3, 2026. **14 total findings: 1 High severity (fixed and confirmed), 4 Medium, 9 Low/Informational.** Notable: M-01 flagged the backing model as entirely trust-based with no onchain verification. Repo tag `audit/2026-01-19-certora` confirms.
- All three audits are now publicly verifiable. The [Apyx docs audits page](https://docs.apyx.fi/resources/audits) lists all three with direct links.

### Reserve Attestations

| Period | Firm | Standard | Published | Link |
|--------|------|----------|-----------|------|
| **March 2026** | Wolf & Company, P.C. | PCAOB-registered, examination-level attestation | Yes | [March 2026 Attestation Opinion (PDF)](https://docs.apyx.fi/collateral-and-custody/third-party-attestation) |

**Notes:**
- The March 2026 attestation from Wolf & Company (a PCAOB-registered audit firm) is linked on the [Third-Party Attestation page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation). Apyx describes these as "examination-level, assertion-based attestations" rather than lighter-weight AUP engagements or custodian confirmation emails, and commits to publishing them monthly.
- The custodian(s) holding the preferred shares are described as "third-party prime brokerage accounts" on the [Custody Overview page](https://docs.apyx.fi/collateral-and-custody/custody-overview) but are **not publicly named** in the docs as of April 19, 2026.
- Docs mention a cash/short-term Treasuries buffer, but this review did not find a public breakdown of where those cash-equivalent assets are held, whether cash is bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another instrument, nor maturity/WAM details for the Treasuries component.
- The overcollateralization ratio is still not publicly disclosed.

### Accountable Data Verification

| Provider | Mechanism | Status | Evidence |
|----------|-----------|--------|----------|
| **Accountable** | Data Verification Network / Proof-of-Reserves dashboard | Live since **April 23, 2026**; `frequency = live`; `connectors = 3`; `verifiability = 4` | [Accountable Dashboard](https://accountable.apyx.fi/) / [DVN registry](https://dvn.accountable.capital/v1/stats) |

**Notes:**
- Accountable's registry lists Apyx as a `por` integration for ticker `apxUSD`, with API URL `https://api.accountable.apyx.fi/dashboard` and dashboard URL `https://accountable.apyx.fi`.
- [Apyx announced](https://telemetr.io/en/channels/3567636548-apyx_announcements/posts) that Accountable provides third-party assurance on reserves with near-real-time visibility into outstanding supply, reserve composition, collateral coverage, and cross-platform distribution.
- The dashboard methodology has not been independently verified in this review. Specifically, it is not clear whether STRC/SATA reserve coverage uses last traded market prices, broker/custodian marks, modeled fair values, bid-side liquidation marks, or another source when Nasdaq is closed. This means Accountable may show a reserve value.

**How Accountable works (as understood from public materials):**
- [Accountable](https://docs.accountable.capital/accountable-documentation/data-verification-network-dvn) is a third-party data-verification provider. Its system connects to data sources, ingests reserve/liability data, and publishes a dashboard/API for proof-of-reserves or proof-of-solvency reporting.
- Accountable's public DVN registry assigns Apyx `verifiability = 4`, `connectors = 3`, and `frequency = live`. In Accountable's own verification-level model, level 3 is direct connector-based data sourcing, level 4 adds secure-enclave based verification (hardware-level attestation such as SGX/Nitro), and level 5 is zkTLS. Therefore, the Apyx integration should be treated as a live third-party connector/enclave verification system, **not** as a fully onchain or fully zkTLS-backed proof.
- For Apyx, the dashboard is expected to compare token liabilities/outstanding supply against offchain reserve assets and show reserve composition, collateral coverage, and distribution across venues.

**Trustworthiness assessment:**
- **Useful and materially better than self-reporting.** A live Accountable dashboard is a meaningful improvement over a monthly PDF alone because it introduces an independent data-verification layer between attestations.
- **Not trustless.** Accountable does not make the preferred-share collateral onchain, does not by itself enforce minting limits, and does not remove the need to trust the completeness of connected accounts, custody setup, connector configuration, enclave implementation, and Accountable's own operations.
- **Not a substitute for formal attestation/audit.** The Wolf & Company attestation remains important because it is an examination-level accounting opinion. Accountable is best treated as continuous monitoring evidence.

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

- **Time in Production**: apxUSD proxy deployed February 18, 2026 (block [24481772](https://etherscan.io/tx/0xfb528661b410cce683a1ee40b49a5249dbd677e8304a102927bc6639486f450b)). In production for **~78 days** as of May 7, 2026. Still under 3 months.
- **GitHub Repository**: [`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts) — public Foundry repo. Contains all core contract source code, comprehensive test suite (invariant tests, audit-remediation tests), Slither CI. No license specified.
- **TVL History**: Not tracked by DeFi Llama. Listed on CoinGecko. Based on onchain data (May 7, 2026):
  - Ethereum apxUSD supply: ~306.86M (supply cap raised from 300M to 500M)
  - Base supply: ~14.34M apxUSD and ~0.75M apyUSD
  - apyUSD vault totalAssets: ~103.61M apxUSD (~33.8% of Ethereum apxUSD supply)
  - Uniswap V4 PoolManager: ~10.47M apxUSD
  - Curve pool: ~$29.07M (14.50M apxUSD + 14.57M USDC) — up from ~$16.5M on April 19 and ~$5.5M on March 26
  - Guardian/Upgrader Safe (former Admin): ~3.22M apxUSD
  - Third-Party Safe: ~0.32M apxUSD
- **Supply Growth**: Continued — ~13M at launch → ~67M on March 26 → ~175M on April 19 → ~306.86M Ethereum apxUSD supply on May 7. Curve TVL grew from ~$5.5M on March 26 to ~$16.5M on April 19 and ~$29.07M on May 7; Uniswap V4 PoolManager balance increased from 7.84M on March 26 to 15.15M on April 19, then declined to ~10.47M on May 7.
- **Incidents**: None reported.
- **Peg Stability**: Curve pool virtual price is 1.000301 with near-balanced composition. Peg has held stable since launch, though untested under market stress.

### Ethereum apxUSD Supply Distribution (May 7, 2026)

| Holder | Balance | % of Supply |
|--------|---------|-------------|
| apyUSD Vault (direct apxUSD balance) | 103,608,254 | 33.8% |
| Curve Pool (apxUSD/USDC) | 14,504,193 | 4.7% |
| Uniswap V4 PoolManager | 10,466,487 | 3.4% |
| Guardian/Upgrader Safe (former Admin) | 3,223,845 | 1.1% |
| Third-Party Safe (2-of-3) | 321,749 | 0.1% |
| Admin Safe (4-of-6, current) | 0 | 0% |
| Operations Safe | 0 | 0% |
| Other (Pendle, users, LPs, bridge/token-pool accounts, etc.) | ~174,734,819 | ~56.9% |

Base apxUSD totalSupply is ~14,336,153 and Base apyUSD totalSupply is ~748,518; these are not included in the Ethereum holder percentages above. Cross-chain economic supply should be reconciled through CCIP token-pool accounting and Accountable distribution data rather than inferred from a single-chain holder table.

## Funds Management

### Minting & Redemption

**Minting apxUSD**: **Permissioned, no onchain collateral required.** Minting creates tokens without any backing asset transfer in the transaction. The `ApxUSD.mint()` function only checks that the caller has the authorized mint role and that `totalSupply` does not exceed `supplyCap` — then calls `_mint(to, amount)`. **No `transferFrom`, no collateral deposit, no onchain proof of backing.** The entire collateral relationship is trust-based and offchain, verified only via off-chain attestation.

Minting uses EIP-712 structured data signing via MinterV0 with onchain safeguards including per-order limits, rate limits, execution delay, and nonce-based replay protection.

**Minting roles (verified onchain April 19, 2026):**
- **MinterV0** ([`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e)): Holds `MINT_STRAT_ROLE` (role 1) with **60-second execution delay**, and a newer role 4 (mint path for `mint(address,uint256,uint256)`) with **4-hour execution delay**.
- **Current Admin Safe** ([`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96)): Holds ADMIN_ROLE with 0 execution delay. Because `getRoleGrantDelay(ROLE_MINT_STRAT)` and `getTargetAdminDelay(apxUSD)` are both non-trivial, the admin cannot instantly create a new minter path without running into role-grant or target-admin-delay timelocks (see Governance section).

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

- **Backing**: Offchain preferred shares from publicly-traded DAT companies (STRC, SATA on Nasdaq), plus a documented cash/short-term Treasuries buffer. Overcollateralized but specific ratio still not publicly disclosed.
- **Collateral quality**: Variable-rate perpetual preferred shares. These are equities (not stablecoins or crypto assets). They sit subordinated to debt obligations in the capital structure. The preferred shares have dividend adjustment mechanisms that theoretically stabilize their price near par value.
- **Cash & equivalents**: Apyx docs state that the backing includes cash and short-term Treasuries as a liquidity/volatility buffer, but do **not** publicly specify the exact instruments, allocation, maturity profile, account type, bank/broker/custodian, or whether any portion is held as bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another cash-equivalent instrument. No CEX custody for this buffer is described in the docs reviewed.
- **Custody**: Docs describe collateral as held in "third-party prime brokerage accounts" with multi-party MPC key management. **Custodian(s) still not publicly named** in the docs.
- **Onchain verification**: Still not possible (collateral is entirely offchain). Off-chain verification now exists via third-party attestation:
  - **March 2026 PCAOB-registered attestation published** (Wolf & Company, examination-level opinion)
  - Monthly attestations committed to
  - Accountable Proof-of-Reserves dashboard launched after the April 19 assessment; Accountable registry lists the integration as live since April 23, 2026
  - Underlying shares are publicly-traded and priced transparently on Nasdaq

### Provability

- **apxUSD backing**: Offchain, now with **one published PCAOB-registered attestation** (Wolf & Company, March 2026). Monthly cadence committed to; April attestation not yet published.
- **Accountable data verification**: Accountable's DVN registry lists an Apyx/apxUSD Proof-of-Reserves dashboard live since April 23, 2026 (`frequency = live`, `connectors = 3`, `verifiability = 4`). This adds a live third-party verification layer between monthly attestations, but the underlying dashboard/API values were not accessible from this review environment.
- **apyUSD exchange rate**: Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). The exchange rate is not directly admin-set and does not use the manually-set ApxUSDRateOracle. It is derived from `totalAssets() / totalSupply()`, where `totalAssets()` includes apxUSD held directly by the apyUSD vault plus vested apxUSD available from LinearVestV0. Anyone can verify this onchain. Current rate (May 7, 2026): 1.3632 apxUSD per apyUSD.
- **Yield distribution**: Semi-programmatic. Authorized operators/admins can initiate the amount of apxUSD yield sent into YieldDistributor/LinearVestV0; there is no onchain oracle that independently verifies the offchain dividend amount before it is distributed. Once apxUSD is deposited into LinearVestV0, vesting is programmatic (~17-day linear), and the apyUSD vault pulls vested yield, increasing `totalAssets()` and therefore the ERC-4626 exchange rate. This means the **PPS formula is onchain-verifiable**, but the **correctness of the yield amount relative to real offchain dividends remains trust/attestation-based**.
- **Rate oracle**: The ApxUSDRateOracle is **manually set** by a role-0 caller via `setRate()`. Currently 1.000000. No onchain price feed, no TWAP, no staleness check. **Crucially, `getTargetFunctionRole(oracle, setRate)` is 0 (ADMIN_ROLE) and `getTargetAdminDelay(oracle)` is 0 — the current Admin Safe can change the oracle rate instantly with no timelock.** Used by the Curve StableSwap-NG pool for pricing.
- **Cross-chain supply**: apxUSD and apyUSD also trade on Base. Apyx publicly states that its Base/cross-chain expansion uses Chainlink CCIP. This adds a bridge/infrastructure dependency: Base liquidity and cross-chain supply accounting depend on CCIP operation, token-pool/admin configuration, and Apyx's cross-chain mint/burn or lock/release controls remaining correctly configured.

## Liquidity Risk

### Primary Exit Mechanisms

For the Morpho collateral use case, the relevant question is: how can liquidators exit an apxUSD position?

1. **Curve StableSwap-NG Pool (Primary)**: apxUSD/USDC pool with ~$29.07M total liquidity (14.50M apxUSD + 14.57M USDC), near-balanced. **Up from ~$16.5M on April 19 and ~$5.5M on March 26.**
2. **Uniswap V4**: ~10.47M apxUSD in pool manager (up from 7.84M on March 26, down from 15.15M on April 19).
3. **Direct Redemption**: Available only to whitelisted entities. Not a general exit path.

### Liquidity Assessment

- **Pool quality**: Curve pool is near-balanced (virtual price 1.000301) and its apxUSD side represents ~4.7% of Ethereum apxUSD supply.
- **Liquidity trajectory**: Curve pool grew from ~$5.5M on March 26 to ~$16.5M on April 19 and ~$29.07M on May 7, partially offsetting supply growth. Uniswap V4 PoolManager balance is still above March 26 (7.84M → 10.47M apxUSD) but lower than April 19 (15.15M).
- **No stress testing**: Protocol is ~78 days old; no market stress data available.
- **Morpho context**: For Morpho liquidations, the ~$29.07M Curve pool provides meaningfully deeper absolute headroom than on March 26 and April 19, though supply-to-liquidity ratio remains elevated.
- **Pendle integration**: PT-apxUSD positions exist on Pendle, providing additional secondary market activity.

## Centralization & Control Risks

### Governance

Apyx uses an OpenZeppelin AccessManager v5 (`0xe167330e2eac88666de253e9607c6d9ae0ca2824`) for centralized role-based access control across all contracts. **Governance was restructured on 2026-03-20/21.**

**Role assignments (verified onchain April 19, 2026):**

| Role ID | Label (inferred) | Current Holder(s) | Execution Delay |
|---------|------------------|-------------------|-----------------|
| 0 | ADMIN_ROLE | Admin Safe **4-of-6** ([`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96)) | 0 seconds |
| 1 | MINT_STRAT | MinterV0 | 60 seconds |
| 4 | MINT_STRAT (new path) | MinterV0 | 14,400 seconds (4 hours) |
| 7 | YIELD_OPERATOR | Guardian/Upgrader Safe 3-of-6 | 0 seconds |
| 21 | PAUSER | Guardian/Upgrader Safe 3-of-6 | 0 seconds |
| 22 | UNPAUSER | Guardian/Upgrader Safe 3-of-6 | 14,400 seconds (4 hours) |
| 24 | UPGRADER (apxUSD, apyUSD) | Guardian/Upgrader Safe 3-of-6 | **259,200 seconds (3 days)** |
| 31 | (distributed to 6 new-Admin-Safe owners + former Admin Safe) | multiple | 0 seconds |

**Global AccessManager parameters (verified onchain):**
- `minSetback` = 432,000 seconds (5 days): minimum delay before any role-delay reduction takes effect.
- `expiration` = 604,800 seconds (7 days): scheduled operations expire after 7 days.
- `getRoleGrantDelay(ADMIN_ROLE)` = 604,800 seconds (7 days).
- `getRoleGrantDelay(role 24 UPGRADER)` = 604,800 seconds (7 days).
- `getTargetAdminDelay` (delay for AccessManager-admin operations changing a target's config) = **259,200 seconds (3 days)** on apxUSD, apyUSD, MinterV0, YieldDistributor, LinearVestV0, AddressList, UnlockToken; **0 seconds** on the Rate Oracle and on the AccessManager itself.

**Effective upgrade delays (verified via `canCall`):**
- `upgradeToAndCall` on apxUSD / apyUSD: must be called by role 24 holder → **3-day execution delay** (only the Guardian/Upgrader 3-of-6 Safe can initiate).
- `upgradeToAndCall` on the Rate Oracle: restricted to ADMIN_ROLE → **0-second delay** (current 4-of-6 Admin Safe can upgrade instantly).
- `setRate` on the Rate Oracle: ADMIN_ROLE → **0-second delay**.
- `pause` on apxUSD / apyUSD: role 21 holder → **0-second delay** (Guardian Safe can pause instantly).
- `unpause` on apxUSD / apyUSD: role 22 holder → **4-hour delay**.

**Multisig Details:**
- **Current Admin Safe (4-of-6)**: Sole holder of ADMIN_ROLE (0-sec delay). Can change roles and config (subject to 3-day target-admin-delay on most targets and 7-day role-grant delay), upgrade the rate oracle instantly, and set the oracle rate instantly. Currently holds 0 apxUSD.
- **Guardian/Upgrader Safe (3-of-6, former Admin)**: Retains roles 7, 21, 22, 24. Sole entity that can actually initiate proxy upgrades on apxUSD/apyUSD (subject to 3-day delay). Can pause instantly. Holds ~2.94M apxUSD.
- **Operations Safe**: 3-of-5 Gnosis Safe. No AccessManager roles.
- **Deployer EOA**: ADMIN_ROLE was properly revoked shortly after initial grant.

**Key concerns:**
- Admin-Safe-to-Upgrader-Safe separation prevents the 4-of-6 current Admin Safe from unilaterally upgrading the core stablecoin contracts without waiting through timelocks: it would have to either (a) schedule a `setTargetFunctionRole` change on apxUSD/apyUSD (3-day target-admin-delay), or (b) grant role 24 to a new address (7-day role-grant delay) and then still wait the 3-day execution delay. This is a substantial improvement over the prior zero-delay configuration.
- **The Rate Oracle remains a centralization gap.** ADMIN_ROLE can upgrade the oracle and call `setRate()` with zero delay. A compromised 4-of-6 could manipulate the Curve pool's reported exchange rate, though the Curve pool uses the oracle only for pricing and does not hold redeemable backing.
- Admin Safe and Guardian Safe share most signers (the 6 new-Admin-Safe owners plus the former Admin Safe appear together as members of role 31), limiting independence.
- The 4-of-6 threshold is a step up from 3-of-6 at last assessment.

### Programmability

- **apxUSD**: Standard ERC-20 with no onchain exchange rate (it's a 1:1 stablecoin). Minting is permissioned and programmatically rate-limited.
- **apyUSD exchange rate**: Calculated onchain via ERC-4626 (`totalAssets / totalSupply`). Programmatic, no admin input needed for the rate itself. Admins/operators cannot directly type in an arbitrary apyUSD exchange rate without changing onchain assets/share supply or upgrading contracts.
- **Yield distribution**: Semi-manual. Authorized operators/admins deposit apxUSD into YieldDistributor → LinearVestV0 → apyUSD vault pulls vested yield. The yield vesting is programmatic (~17-day linear), but the initial deposit amount is admin/operator initiated and is not verified by an onchain dividend oracle.
- **Rate oracle**: **Manually set** by ADMIN_ROLE with 0-second execution delay. The `setRate()` function has no automation, no TWAP, no staleness check, and no onchain price feed.
- **Minting**: Two-step process (request → execute). Execution delay is 60 seconds via role 1, or 4 hours via role 4. To bypass via role self-grant, the Admin Safe would hit a 7-day role-grant delay or a 3-day target-admin-delay for function-role reconfiguration.

### External Dependencies

| Dependency | Type | Criticality | Impact of Failure |
|------------|------|-------------|-------------------|
| **Offchain preferred shares (STRC, SATA)** | Collateral backing | **Critical** | All value derives from offchain equity holdings. Dividend cuts, issuer default, or custody failure would impair backing |
| **MPC Custody Providers** | Asset custody | **Critical** | Compromise or failure of custody could lead to loss of collateral. Multi-party MPC mitigates single-point risk |
| **Curve StableSwap-NG** | Primary liquidity venue | **High** | Main exit path for non-whitelisted users. Pool failure would severely restrict liquidity |
| **Gnosis Safe** | Multisig infrastructure | **High** | All governance actions flow through Safe multisigs |
| **Ethereum L1** | Settlement layer | **Medium** | All contracts on Ethereum mainnet only |

**Key dependency risk**: The protocol has a **critical dependency on offchain assets and custody** that cannot be verified onchain. The rate oracle is manually set with no automated price feed or fallback mechanism.

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
  - **Alert**: If total pool TVL drops below $10M

### Governance Monitoring

- **Admin Safe (4-of-6, current)**: [`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96)
  - Monitor for owner/signer changes and threshold modifications
  - **Alert**: Immediately on any signer replacement or threshold change
  - Monitor all Safe transaction executions (role grants, rate oracle calls)

- **Guardian/Upgrader Safe (3-of-6)**: [`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2)
  - Monitor Safe transactions — this is the sole initiator of apxUSD/apyUSD proxy upgrades (3-day delayed)
  - **Alert**: On any scheduled upgrade operation

- **AccessManager**: [`0xe167330e2eac88666de253e9607c6d9ae0ca2824`](https://etherscan.io/address/0xe167330e2eac88666de253e9607c6d9ae0ca2824)
  - Monitor `RoleGranted`, `RoleRevoked`, `TargetFunctionRoleUpdated`, `TargetAdminDelayUpdated`, `RoleGrantDelayChanged` events
  - Monitor `OperationScheduled` / `OperationExecuted` / `OperationCanceled` events for pending admin ops during their delay window
  - **Alert**: On any role change or delay-parameter change

### Supply & Holder Monitoring

- Monitor Guardian/Upgrader Safe (`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`) balance and movements
- Monitor Third-Party Safe (`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`) balance
- Monitor Curve pool for large single-sided withdrawals
- Monitor MinterV0 for mint execution events

### Accountable Proof-of-Reserves Monitoring

- **Dashboard**: [`https://accountable.apyx.fi/`](https://accountable.apyx.fi/)
- **Registry entry**: [`https://dvn.accountable.capital/v1/stats`](https://dvn.accountable.capital/v1/stats) should continue to list `name = apyx`, `ticker = apxUSD`, `frequency = live`, `connectors = 3`, and `verifiability = 4`.
- **Alert**: If the Accountable dashboard/API becomes unavailable, stale, degraded, or removed from the DVN registry.
- **Alert**: If connector count or verifiability level decreases.
- **Alert**: If dashboard collateral coverage falls below the protocol's stated minimum or reserve composition shifts materially toward less liquid/non-public assets.

### Chainlink CCIP / Base Monitoring

- **Base apxUSD**: [`0xd993935e13851dd7517af10687ec7e5022127228`](https://basescan.org/address/0xd993935e13851dd7517af10687ec7e5022127228)
- **Base apyUSD**: [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://basescan.org/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa)
- Monitor Chainlink CCIP status for Ethereum/Base routes, Base token supply, Base AccessManager role changes, and cross-chain supply reconciliation versus Ethereum and Accountable-reported distribution.
- **Alert**: If CCIP Ethereum/Base transfers are paused, rate-limited, misconfigured, or if Base supply changes without a matching burn/lock/mint path.

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Rate oracle changes | Real-time | Critical |
| Proxy upgrade events | Real-time | Critical |
| Accountable PoR dashboard freshness / registry status | Real-time | Critical |
| Chainlink CCIP / Base supply reconciliation | Real-time | Critical |
| AccessManager role changes | Real-time | Critical |
| Admin Safe transactions | Real-time | Critical |
| Curve pool balance ratio | Every 6 hours | High |
| apxUSD supply changes | Every 6 hours | High |
| Large holder movements | Daily | Medium |

## Risk Summary

### Key Strengths

- **Publicly-traded collateral**: Underlying preferred shares (STRC, SATA) are Nasdaq-listed with transparent pricing, dividend policies, and regulatory oversight.
- **Three reputable audits**: Quantstamp, Zellic, and Certora audits all completed and publicly published with remediation evidence in the repo.
- **First PCAOB-registered attestation published**: Wolf & Company examination-level attestation for March 2026 is now public, addressing the primary finding from the March 26 assessment.
- **Accountable Proof-of-Reserves integration**: Accountable's public DVN registry lists Apyx/apxUSD as a live proof-of-reserves integration since April 23, 2026, adding third-party between-attestation visibility into supply, reserves, collateral coverage, and distribution.
- **Onchain timelocks on core admin functions**: 3-day execution delay on apxUSD/apyUSD proxy upgrades (via role 24), 7-day role-grant delay for ADMIN_ROLE and role 24, 5-day `minSetback` on delay reductions, 3-day `targetAdminDelay` on core contracts, 4-hour unpause delay.
- **Governance separation**: Proxy upgrades now require the Guardian/Upgrader 3-of-6 Safe (not the current 4-of-6 Admin Safe); pauser and upgrader are operationally separated from day-to-day admin.
- **Increased Admin-Safe threshold**: Moved from 3-of-6 to 4-of-6.
- **Improved liquidity**: Curve pool TVL up to ~$29.07M; Uniswap V4 PoolManager holds ~10.47M apxUSD.
- **Open-source code**: Full Foundry project with invariant tests and Slither CI.
- **Public, credentialed team**: Six named founding contributors with verifiable backgrounds at Kraken, Goldman Sachs, Binance, and DeFi Development Corp.

### Key Risks

- **Offchain collateral, limited attestation track record**: One monthly attestation has been published (March 2026, Wolf & Company). Accountable now adds a live verification layer, but the detailed dashboard values were not independently pulled in this review environment. Custodian(s) still not publicly named; overcollateralization ratio still not disclosed in the docs.
- **BTC/DAT stress sensitivity**: apxUSD is not backed by BTC directly, but its preferred-share collateral is issued by Digital Asset Treasury companies whose market value and liquidity can be sensitive to BTC drawdowns. A fast BTC selloff (e.g., 10% in 1 hour) could pressure STRC/SATA pricing, weaken mark-to-market reserve coverage, reduce market confidence, and push non-whitelisted holders to exit through Curve/Uniswap, causing apxUSD to trade below $1.
- **Weekend market-gap risk (inferred stress path)**: Apyx docs do not explicitly describe weekend/holiday stale-price handling or Accountable's pricing source for STRC/SATA when Nasdaq is closed. The risk follows from the documented structure: BTC trades 24/7, while STRC/SATA are Nasdaq-listed preferreds held offchain. If BTC falls sharply over a weekend or market holiday, STRC/SATA marks may be stale, modeled, or broker-marked until pre-market/regular trading resumes. During that window, ordinary apxUSD holders still cannot redeem directly, but they can sell apxUSD through onchain liquidity venues, potentially causing a secondary-market run before preferred-share prices and Accountable collateral coverage fully update. On Monday, STRC/SATA could gap down, reserve coverage could update lower, and apxUSD liquidity could already be impaired.
- **Rate Oracle retains zero-delay admin control**: The current 4-of-6 Admin Safe can upgrade the Rate Oracle proxy or call `setRate()` instantly. A compromised admin could manipulate the Curve pool's reported price.
- **Unbacked-mint design**: `ApxUSD.mint()` creates tokens without any onchain collateral transfer — backing is verified only off-chain via attestations. The mint execution delay (60 seconds via role 1, 4 hours via role 4) plus role-grant/admin-delay constraints materially slow, but do not eliminate, the ability of a compromised admin to initiate unbacked minting.
- **CCIP / Base bridge dependency**: apxUSD and apyUSD are live on Base using Chainlink CCIP for cross-chain support. This is stronger than an ad hoc bridge, but it adds dependency on CCIP, token-pool configuration, Base-side AccessManager/admin controls, and cross-chain supply reconciliation. A CCIP outage, misconfiguration, or compromised cross-chain admin path could impair Base exits or create supply-accounting issues.
- **Young protocol**: ~78 days in production; still under 3 months, untested under market stress.
- **DFDV concentration**: All six founding contributors are executives at DeFi Development Corp. (Nasdaq: DFDV), which is also the protocol's first institutional investor. BVI legal entity with $100 liability cap.
- **No bug bounty program**: Notable absence for a protocol with >$300M Ethereum apxUSD supply.

### Critical Risks

- **Rate oracle manipulation (no timelock)**: The current Admin Safe can upgrade the ApxUSDRateOracle implementation and call `setRate()` with zero delay. Because the Curve StableSwap-NG pool uses this oracle for pricing, a compromised or malicious 4-of-6 could distort pool pricing for extraction. No staleness check or bounds validation exists onchain.
- **Offchain collateral opacity (mitigated, not resolved)**: If preferred shares are not actually held or are liquidated without disclosure, apxUSD could be undercollateralized. The March 2026 Wolf & Company attestation mitigates this retrospectively for the attested period, and the Accountable dashboard adds live third-party verification, but the collateral is still offchain and the report could not independently extract current Accountable values from this environment.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Three reputable audits confirmed: Quantstamp (Feb 2026), Zellic (Mar 2026), Certora (Mar 2026). All publicly published. **PASS**
- [x] **Unverifiable reserves** -- A PCAOB-registered examination-level attestation from Wolf & Company covering March 2026 has been published on the [Third-Party Attestation page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation). Off-chain proof of reserves now exists for the attested period, and the protocol has committed to monthly attestations going forward. Post-assessment, Accountable's public DVN registry also lists Apyx/apxUSD as a live proof-of-reserves integration since April 23, 2026. Custodian name and overcollateralization ratio are still not disclosed publicly, which remains a concern, but the "no proof of reserves at all" condition that failed this gate on March 26 is resolved. **PASS** (weakly — promotion to Medium Risk tier is conditional on the monthly cadence being sustained and Accountable data remaining live/verifiable).
- [x] **Total centralization** -- 4-of-6 Gnosis Safe for ADMIN_ROLE, 3-of-6 Safe for pause/upgrade. Not a single EOA. **PASS**

**All critical gates pass.** Gate override from March 26 is removed.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 confirmed audits from reputable firms (Quantstamp, Zellic, Certora), all publicly published with remediation evidence. Certora identified 14 findings (1 High, fixed).
- **Bug Bounty**: None found.
- **Time in Production**: ~78 days. Still under 3 months.
- **TVL**: ~306.86M Ethereum apxUSD supply, plus ~14.34M Base apxUSD supply. Listed on CoinGecko.
- **Incidents**: None.

**Score: 3.5/5** -- Three reputable audits with public reports and onchain remediation evidence. Open-source code with comprehensive tests. Between score 3 (multiple audits, 3-6 months) and score 4 (single audit, <3 months). ~78 days (<3 months) and absent bug bounty keep this from lowering the score.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 4-of-6 Admin Safe (ADMIN_ROLE, 0 exec delay) — threshold raised from 3-of-6.
- Separate 3-of-6 Guardian/Upgrader Safe holds role 24 with 3-day execution delay on apxUSD/apyUSD proxy upgrades, plus pauser/unpauser/yield-operator roles.
- 7-day role-grant delay for ADMIN_ROLE and role 24. 5-day `minSetback`. 3-day `targetAdminDelay` on core contracts.
- Rate Oracle has **no timelock**: ADMIN_ROLE can upgrade the oracle or call `setRate()` with 0-second delay.
- No independent Guardian with a veto on upgrades; the Admin Safe can in principle reroute upgrades by creating a new role and granting it (subject to the 7-day grant delay and 3-day target-admin-delay).
- Most Admin Safe signers overlap with the Guardian/Upgrader Safe (via shared role 31 membership).

**Governance Score: 3.0** -- Between score 3 (moderate multisig with short timelock, several admin functions centralized) and score 4 (low threshold, <12h timelock). Core stablecoin proxy upgrades now have a meaningful multi-day timelock. Rate oracle remains a zero-delay single point of governance failure.

**Subcategory B: Programmability**

- apxUSD: Standard ERC-20, no onchain exchange rate needed (1:1 stablecoin).
- apyUSD: ERC-4626 with programmatic exchange rate.
- Yield distribution: ~17-day linear vesting is programmatic, but initial deposits are admin-initiated.
- Rate oracle: Manually set, no automation, no staleness check.
- Minting: Permissioned; 60-second delay for role 1 path, 4-hour delay for role 4 path.

**Programmability Score: 3.5** -- Hybrid system unchanged. apyUSD exchange rate and yield vesting are onchain; rate oracle remains manual; yield distribution still admin-initiated. The new 4-hour mint delay path (role 4) strengthens minting safeguards.

**Subcategory C: External Dependencies**

- **Critical**: Offchain preferred share collateral (STRC, SATA) and custody providers
- **High**: Curve pool for liquidity
- **Medium**: Gnosis Safe infrastructure

**Dependencies Score: 4.0** -- Critical dependency on offchain assets and custody that cannot be verified onchain. No fallback mechanism if custody providers fail. The oracle has no automated price feed.

**Centralization Score = (3.0 + 3.5 + 4.0) / 3 = 3.5**

**Score: 3.5/5** -- Timelocks on core upgrades and role grants are a material improvement, but the Rate Oracle (no timelock) and continued offchain dependencies keep this elevated.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Offchain backing by publicly-traded preferred shares (Nasdaq-listed)
- Cash/short-term Treasuries buffer documented, but exact instruments, location, custodian, and maturity profile are undisclosed
- Overcollateralized (specific ratio undisclosed)
- Custody in "third-party prime brokerage accounts" (custodian not publicly named); multi-party MPC key management
- Cannot verify collateral onchain
- Reserve is equity (not stablecoins) — more volatile than typical stablecoin collateral
- PCAOB-registered examination-level attestation published for March 2026 (Wolf & Company)
- Accountable Proof-of-Reserves dashboard listed as live by Accountable since April 23, 2026

**Collateralization Score: 3.5** -- Between score 3 (100% collateral, some offchain, periodic attestation) and score 4 (partially collateralized or custodial, opaque reporting). Improved from 4.0: an examination-level PCAOB-registered attestation is now published and the monthly cadence has been committed to (one period attested). This score explicitly penalizes the holder-loss path from offchain preferred-share collateral: the reserves are equity-like instruments rather than cash-equivalents, can decline in value, and cannot be redeemed or verified onchain by ordinary holders. Remaining concerns: custodian name undisclosed, overcollateralization ratio undisclosed, asset class is equity rather than cash-equivalents, and the cash/Treasuries buffer lacks public instrument/location/maturity detail.

**Subcategory B: Provability**

- apyUSD exchange rate: onchain (ERC-4626)
- apxUSD collateral: offchain. **One published PCAOB-registered examination-level attestation** (Wolf & Company, March 2026). Monthly cadence committed to; April attestation not yet published.
- Accountable data verification: live proof-of-reserves integration listed in Accountable's DVN registry (`frequency = live`, `connectors = 3`, `verifiability = 4`) since April 23, 2026; detailed current values not independently extracted due dashboard/API 403s from this environment. Pricing methodology for offchain STRC/SATA marks, especially outside Nasdaq market hours, is not independently verified.
- Rate oracle: manually set, no third-party verification.

**Provability Score: 4.0** -- PCAOB-registered examination-level attestation has been published (stronger than typical AUP engagements), and Accountable now provides a live third-party verification layer, but missing April report. Missing data on how and where funds marked as "Cash & Equivalents".

**Funds Management Score = (3.5 + 4.0) / 2 = 3.75**

**Score: 3.75/5** -- Reserve attestation now exists and is examination-level, and Accountable adds live third-party verification, but the score remains elevated because apxUSD/apyUSD holders can still lose money if offchain preferred-share collateral loses value, becomes unavailable, or is not accurately reflected in reserve reporting. Custodian opacity, missing April attestation, undisclosed cash-equivalent details, and inability to independently pull Accountable dashboard values in this environment keep this elevated.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Curve pool**: ~$29.07M (up from ~$16.5M on April 19 and ~$5.5M on March 26), near-balanced, with the apxUSD side at ~4.7% of Ethereum apxUSD supply.
- **Uniswap V4**: ~10.47M apxUSD in pool manager (up from 7.84M on March 26, down from 15.15M on April 19).
- **Direct redemption**: Permissioned only (not available to general users/liquidators).
- **No market stress data**: Protocol is ~78 days old.
- **Peg stability**: Currently stable (1.000301 virtual price); untested under stress.

**Score: 3/5** -- Deep liquidty, but direct redemptions are premissioned.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Public. Six named founding contributors with verifiable backgrounds (Kraken, Goldman Sachs, Binance, DFDV). Strong institutional credibility via Nasdaq-listed DFDV.
- **Documentation**: Minimal. Main docs and FAQ functional. Audits page lists all three reports with links.
- **Legal Structure**: BVI entity, US/EU/EEA geo-blocked.
- **Incident Response**: No formal plan. Admin can pause immediately.
- **Code Availability**: Verified on Etherscan and open-sourced on GitHub ([`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts)). Full Foundry project with 60+ test files, invariant tests, and Slither CI. No license specified.

**Score: 3/5** -- Public, well-credentialed team with verifiable track records at major crypto and TradFi institutions. Open-source code with comprehensive tests. The docs are minimal and missing information where are "Cash & Equivalents".

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.5 | 20% | 0.70 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.475/5.0 (~3.48)** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk — Approved with enhanced monitoring**

---

Apyx's apxUSD is a novel "Dividend-Backed Stablecoin" bridging offchain corporate dividends into onchain yield. Following the March 20-21 governance restructure, the March 2026 Wolf & Company attestation, and the April 23 Accountable Proof-of-Reserves integration, the three gaps identified at the March 26 assessment are materially addressed: proof of reserves, admin timelocks, and liquidity depth.

**Residual concerns that keep the score at 3.48 (Medium Risk, close to Elevated):**
- **Rate Oracle has no timelock.** ADMIN_ROLE can upgrade the oracle and call `setRate()` with zero delay. This remains the most acute centralization risk.
- **Custodian is still not publicly named.** Accountable adds live third-party reserve verification, and Apyx says the dashboard includes collateral coverage, but the custody black-box persists and this review could not independently extract current Accountable dashboard values.
- **Monthly attestation cadence is one data point.** Track record must be established over several consecutive months.
- **Protocol is still young** (~78 days) and untested under market stress.
- **BTC/DAT stress remains untested.** A fast BTC drawdown could indirectly pressure reserve marks and secondary liquidity because the collateral depends on publicly-traded DAT preferred shares.
- **No bug bounty program** at >$300M Ethereum apxUSD supply.

**Conditions for continued or increased exposure:**
1. April 2026 attestation published on schedule (maintains monthly cadence).
2. Add a non-zero execution delay or target-admin-delay to the Rate Oracle (`ApxUSDRateOracle`) such that `setRate()` and `upgradeToAndCall` cannot be executed instantly.
3. Publicly name the custodian(s) holding the preferred shares.
4. Disclose the cash/short-term Treasuries buffer composition, custody location, account type, instrument type, maturity/WAM, and whether any cash is bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another cash-equivalent instrument.
5. Disclose the overcollateralization ratio with supporting evidence (ideally in the monthly attestation).
6. Keep the Accountable dashboard live, current, and externally accessible; publish enough methodology/source detail for independent reviewers to understand what the 3 connectors verify.
7. Upgrade Accountable verification from `verifiability = 4` to a higher tier, ideally level 5 / zkTLS, which would improve trust in the reserve data source.
8. Launch a bug bounty program (Immunefi / Cantina / Safe Harbor).

**Monitoring priorities:**
- Rate oracle for any `RateUpdated` event (currently 1.0).
- Admin Safe (4-of-6) and Guardian/Upgrader Safe (3-of-6) for any ownership/threshold changes or role grant/revoke events.
- Scheduled operations in AccessManager (`OperationScheduled` event) — any pending upgrade should trigger review during the delay window.
- Accountable PoR dashboard freshness, coverage ratio, connector count, and verifiability level.
- Chainlink CCIP Ethereum/Base route status, Base token supply, and cross-chain supply reconciliation.
- STRC/SATA market prices and liquidity during sharp BTC drawdowns; treat a 10% BTC move in 1 hour as an elevated-monitoring event.
- Weekend/holiday BTC drawdowns where STRC/SATA prices are stale; monitor apxUSD peg, Curve balance, and Accountable price timestamps until Nasdaq trading resumes.
- Monthly attestation publication cadence.
- Curve pool balance ratio and TVL, given supply continues to grow.

---

## Reassessment Triggers

- **Attestation cadence**: Reassess (upward if confirmed, downward if missed) when April 2026 attestation is expected.
- **Accountable verification**: Reassess downward if the dashboard becomes unavailable/stale, Accountable removes or downgrades the Apyx registry entry, connector count decreases, verifiability level decreases, or current reserve coverage cannot be independently reviewed. Reassess upward if Apyx moves to a higher Accountable verifiability tier, especially level 5 / zkTLS, or publishes stronger methodology/source coverage for the connectors.
- **Cross-chain / CCIP**: Reassess if Chainlink CCIP Ethereum/Base transfers are paused or impaired, Base token-pool/admin configuration changes materially, Base apxUSD/apyUSD supply diverges from expected cross-chain reconciliation, or Apyx migrates to a different bridge provider.
- **Governance-based**: Reassess on any ownership/threshold change to either multisig, any change to `targetAdminDelay` or `roleGrantDelay` on AccessManager, or any rate-oracle change (upgrade or `setRate`).
- **Time-based**: Reassess in 1 month (June 2026).
- **Supply/TVL-based**: The prior 250M supply trigger has now been crossed. Reassess again if Ethereum apxUSD supply exceeds 400M (toward the 500M cap), if the supply cap is raised again, if Base apxUSD supply grows materially without clear CCIP/Accountable reconciliation, if Curve pool TVL drops below $15M, or if supply-to-Curve-pool ratio exceeds 25x.
- **Market-stress based**: Reassess if BTC falls >10% in 1 hour or >20% in 24 hours and STRC/SATA prices, Accountable collateral coverage, Curve balance, or apxUSD peg quality deteriorate. Reassess urgently if this happens over a weekend/holiday while STRC/SATA marks are stale and apxUSD sells off before Nasdaq trading reopens.
- **Incident-based**: Reassess after any exploit, unplanned oracle change, or peg deviation >1%.
- **Bug bounty**: Reassess if a bug bounty program is launched.
