# Protocol Risk Assessment: Apyx

- **Assessment Date:** April 19, 2026 (Updated May 29, 2026; August 1, 2026)
- **Token:** apxUSD
- **Chain:** Ethereum + Base
- **Token Address:** [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
- **Final Score: 3.74/5.0**

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

**Key metrics (August 1, 2026):**
- apxUSD Total Supply (Ethereum): **~312.07M** (supply cap 750M). Down from ~524.66M on May 29 — a ~212M decrease over the past ~64 days via onchain burns.
- Base supply: ~9.77M apxUSD and ~0.57M apyUSD via Chainlink CCIP
- apyUSD vault totalAssets: ~180.89M apxUSD; exchange rate: ~1.405 apxUSD per apyUSD
- Curve apxUSD/USDC Pool: **~$11.9K nominal TVL** — the Guardian/Upgrader Safe withdrew its entire LP position (was 99.96% of the pool), effectively draining the pool. See *Protocol-Owned Liquidity* under Liquidity Risk.
- Uniswap V4 PoolManager: ~5.08M apxUSD
- Listed on CoinGecko
- Chains: Ethereum and Base (via Chainlink CCIP; Solana planned)
- Protocol launched: February 18, 2026 (~164 days ago)

**Links:**

- [Protocol Website](https://apyx.fi/)
- [Protocol Documentation](https://docs.apyx.fi)
- [apxUSD Overview](https://docs.apyx.fi/product-overview/apxusd-overview)
- [apyUSD Overview](https://docs.apyx.fi/product-overview/apyusd-overview)
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
| apyUSD (Implementation, current) | [`0xfd616567ecc1607f61073951a1e822f7315bb112`](https://etherscan.io/address/0xfd616567ecc1607f61073951a1e822f7315bb112) | ApyUSD (upgraded twice since May 29: May 18 via [`0xd2d6…6eee`](https://etherscan.io/tx/0xd2d6402c540a482a267fa10a168bd6df8d4b53a9fecde093a40cae66a67f6eee) → 0x6f4d…3173, then May 27 via [`0x4e5b…696d`](https://etherscan.io/tx/0x4e5b0a6da667cef27e23745f7fd217baa6242b6365ad18b894720cbfb3b4696d) → current) |
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
| Mint Pass-Through | [`0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8`](https://etherscan.io/address/0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8) | Apyx-controlled hop contract: `asset()` returns apxUSD; `authority()` returns the Apyx AccessManager. Balance is currently 0 apxUSD. |

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
| Operations Safe | [`0x37b0779a66edc491df83e59a56d485835323a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555) | 3-of-6 Gnosis Safe. No AccessManager roles. |
| Third-Party Safe | [`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`](https://etherscan.io/address/0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50) | 2-of-3 Gnosis Safe, holds ~0.65M apxUSD. |

### Liquidity Contracts

| Contract | Address | Type |
|----------|---------|------|
| Curve apxUSD/USDC Pool | [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) | CurveStableSwapNG |
| Uniswap V4 Pool Manager | [`0x000000000004444c5dc75cb358380d2e3de08a90`](https://etherscan.io/address/0x000000000004444c5dc75cb358380d2e3de08a90) | Uniswap V4 singleton — large bidirectional USDC flows with the Guardian Safe last 7 days (23.94M in / 5.56M out). |

### Onchain Backing References

| Contract | Address | Type |
|----------|---------|------|
| STRCX (Strategy PP Variable xStock) | [`0x1aad217b8f78dba5e6693460e8470f8b1a3977f3`](https://etherscan.io/token/0x1aad217b8f78dba5e6693460e8470f8b1a3977f3) | Tokenized STRC preferred share (Payward / xStocks line). Total supply 1,662,890; Apyx Operations Safe holds **582,774 (~35%)** — partial onchain visibility into the STRC component of apxUSD backing. |

### On-Chain Verification (Etherscan, August 1, 2026)

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

- **Time in Production**: apxUSD proxy deployed February 18, 2026 (block [24481772](https://etherscan.io/tx/0xfb528661b410cce683a1ee40b49a5249dbd677e8304a102927bc6639486f450b)). In production for **~164 days** as of August 1, 2026. Over 5 months.
- **GitHub Repository**: [`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts) — public Foundry repo. Contains all core contract source code, comprehensive test suite (invariant tests, audit-remediation tests), Slither CI. No license specified.
- **TVL History**: Not tracked by DeFi Llama. Listed on CoinGecko. Based on onchain data (August 1, 2026):
  - Ethereum apxUSD `totalSupply`: **~312.07M** (supply cap 750M) — peaked at ~524.66M around block 25.2M (late June), then declined to current level via onchain burns
  - Base supply: ~9.77M apxUSD and ~0.57M apyUSD
  - apyUSD vault totalAssets: ~180.89M apxUSD
  - Curve pool: **~$11.9K nominal** — Guardian Safe withdrew 100% of its LP (was 40,890,164 of 40,905,346 LP tokens), effectively draining the pool. Virtual price 1.0049.
  - Guardian/Upgrader Safe: **~2.54M apxUSD + ~2.38M apyUSD + ~2.0M USDC** (down from ~$28M aggregate on May 29)
  - Operations Safe: ~1 apxUSD, 0 apyUSD, ~0.9 USDC, holds **582,774 STRCX (~35% of all STRCX supply)** as onchain backing
  - Third-Party Safe: ~0.65M apxUSD
- **Supply History**: ~13M at launch → ~67M on March 26 → ~175M on April 19 → ~306.86M on May 7 → peaked at ~524.66M (late June) → declined to **~312.07M on August 1** via onchain burns. The net ~212M supply reduction from peak represents large-scale redemption activity through the onchain burn mechanism.
- **Onchain burns now active**: Unlike the May 29 observation (zero onchain burns), the supply contraction from ~524.66M to ~312.07M occurred through onchain `burn`/`burnFrom` calls, indicating the redemption pipeline is now routing through onchain burns rather than exclusively offchain.
- **Incidents**: None reported.
- **Peg Stability**: Curve pool virtual price is 1.0049 (+0.49% deviation) after the Guardian Safe's LP withdrawal. The pool is effectively drained (~$11.9K TVL). Uniswap V4 is now the primary onchain venue.

### Ethereum apxUSD Supply Distribution

Snapshot at block ~25,660,831 (August 1, 2026), supply ~312.07M:

| Holder | Balance (Aug 1) | % of Supply (Aug 1) |
|--------|------------------|----------------------|
| Guardian/Upgrader Safe (`0xf986…3ce2`) | ~2.54M apxUSD | ~0.8% |
| Curve Pool (apxUSD/USDC) | ~10,762 apxUSD | <0.01% |
| Uniswap V4 PoolManager | ~5.08M apxUSD | ~1.6% |
| apyUSD Vault (direct apxUSD balance) | ~180.89M apxUSD (totalAssets) | ~58.0% |
| Admin Safe (4-of-6) | 0 | 0% |
| Operations Safe | ~1 apxUSD (holds 582,774 STRCX) | <0.01% |
| Third-Party Safe | ~0.65M apxUSD | ~0.2% |
| Other (Pendle, users, bridge/token-pool accounts, etc.) | balance | balance |

Note: The Curve pool was effectively drained by the Guardian Safe between late June and July 2026 (Guardian LP balance dropped from 40,890,164 to 0). The pool's apxUSD balance is now ~$10.8K.

Base apxUSD totalSupply is ~9,768,204 and Base apyUSD totalSupply is ~568,119 as of August 1; these are not included in the Ethereum holder percentages above. Cross-chain economic supply should be reconciled through CCIP token-pool accounting and Accountable distribution data rather than inferred from a single-chain holder table.

## Funds Management

### Minting & Redemption

**Minting apxUSD**: **Permissioned, no onchain collateral required.** Minting creates tokens without any backing asset transfer in the transaction. The `ApxUSD.mint()` function only checks that the caller has the authorized mint role and that `totalSupply` does not exceed `supplyCap` — then calls `_mint(to, amount)`. **No `transferFrom`, no collateral deposit, no onchain proof of backing.** The entire collateral relationship is trust-based and offchain, verified only via off-chain attestation.

Minting uses EIP-712 structured data signing via MinterV0 with onchain safeguards including per-order limits, rate limits, execution delay, and nonce-based replay protection.

**Minting roles (verified onchain August 1, 2026):**
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
- **Onchain verification**: Partial. The bulk of backing remains offchain (STRC and SATA preferred shares held in prime brokerage). The Apyx Operations Safe ([`0x37b0…a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555)) holds **582,774 STRCX** ([`0x1aad…77f3`](https://etherscan.io/token/0x1aad217b8f78dba5e6693460e8470f8b1a3977f3)), the Payward-issued tokenized version of STRC (xStocks line, custodied 1:1 against the underlying preferred shares). This is **~35% of all onchain STRCX supply** and represents the only directly verifiable portion of apxUSD's reserves. At ~$100 par, this covers roughly **~$58M (~19% of the 312.07M apxUSD supply)** — the remaining ~81% depends on offchain STRC, SATA, and cash buffer attestations.
- Off-chain verification:
  - **March 2026 PCAOB-registered attestation published** (Wolf & Company, examination-level opinion). The attested period had supply ~67M; today's supply is ~7.8× higher, with no fresh attestation yet covering the new supply.
  - Monthly attestations committed to; April 2026 attestation still not yet published as of this update.
  - Accountable Proof-of-Reserves dashboard launched after the April 19 assessment; Accountable registry lists the integration as live since April 23, 2026.
  - Underlying shares are publicly-traded and priced transparently on Nasdaq.

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

1. **Curve StableSwap-NG Pool (Primary)**: apxUSD/USDC pool, **effectively drained** — pool TVL collapsed from ~$29M to ~$11.9K after the Guardian Safe withdrew 100% of its LP position (40,890,164 LP tokens) between late June and July 2026. Virtual price 1.0049 (+0.49% deviation).
2. **Uniswap V4**: ~5.08M apxUSD in pool manager (down from ~10.47M on May 7). Now the largest onchain apxUSD liquidity venue.
3. **Direct Redemption**: Available only to whitelisted entities. Not a general exit path.

### Liquidity Assessment

- **Pool quality**: The Curve pool virtual price has drifted to 1.0049 (+0.49%), indicating peg stress after the LP drain. The apxUSD side (~$10.8K) represents <0.01% of Ethereum apxUSD supply.
- **Liquidity trajectory**: Curve pool TVL collapsed from ~$29M to ~$11.9K — a 99.96% reduction — after the Guardian Safe withdrew 100% of its LP. Uniswap V4 PoolManager apxUSD also decreased from ~10.47M to ~5.08M.
- **Stress event**: The Curve pool drain is a significant structural change, though it appears to have been a deliberate POL withdrawal rather than a market-driven run. The protocol is ~164 days old.
- **Morpho context**: Effective third-party exit depth for liquidators is now critically thin. Curve is essentially non-functional as an exit path. Uniswap V4 provides ~5.08M apxUSD but the counterparty concentration is a concern.
- **Pendle integration**: PT-apxUSD positions on Pendle provide some additional secondary market activity.

### Protocol-Owned Liquidity (POL) Concentration

This concern has fully materialized. The Guardian/Upgrader Safe held 99.96% of the Curve apxUSD/USDC LP at the May 29 assessment and was flagged as a critical concentration risk. Between late June and July 2026, the Guardian Safe withdrew **100% of its LP position** (40,890,164 LP tokens), effectively draining the pool.

- The Curve apxUSD/USDC pool [`0xe1b9…a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) now holds ~10,761 apxUSD and ~1,108 USDC (~$11.9K TVL). LP totalSupply is ~11,701. The Guardian Safe holds 0 LP.
- The Guardian Safe's LP withdrawal was permissionless — Curve `remove_liquidity` has no admin gate, no timelock, and no AccessManager involvement. A 3-of-6 Safe-tx was sufficient.
- The Guardian Safe also reduced its Uniswap V4 exposure: PoolManager apxUSD balance dropped from ~10.47M to ~5.08M.
- **Implication for liquidators**: The ~$29M Curve pool depth previously cited as a liquidity source no longer exists. Onchain exit capacity is now limited to Uniswap V4 (~5.08M apxUSD) plus whatever depth exists on Pendle. Direct redemption remains permissioned only.

## Centralization & Control Risks

### Governance

Apyx uses an OpenZeppelin AccessManager v5 (`0xe167330e2eac88666de253e9607c6d9ae0ca2824`) for centralized role-based access control across all contracts. **Governance was restructured on 2026-03-20/21.**

**Role assignments (verified onchain August 1, 2026):**

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
- **Guardian/Upgrader Safe (3-of-6, former Admin)**: Retains roles 7, 21, 22, 24. Sole entity that can actually initiate proxy upgrades on apxUSD/apyUSD (subject to 3-day delay). Can pause instantly. Holds ~2.54M apxUSD, ~2.38M apyUSD, ~2.0M USDC.
- **Operations Safe**: 3-of-6 Gnosis Safe. No AccessManager roles.
- **Deployer EOA**: ADMIN_ROLE was properly revoked shortly after initial grant.

**Key concerns:**
- Admin-Safe-to-Upgrader-Safe separation prevents the 4-of-6 current Admin Safe from unilaterally upgrading the core stablecoin contracts without waiting through timelocks: it would have to either (a) schedule a `setTargetFunctionRole` change on apxUSD/apyUSD (3-day target-admin-delay), or (b) grant role 24 to a new address (7-day role-grant delay) and then still wait the 3-day execution delay. This is a substantial improvement over the prior zero-delay configuration.
- **The Rate Oracle remains a centralization gap.** ADMIN_ROLE can upgrade the oracle and call `setRate()` with zero delay. A compromised 4-of-6 could manipulate the Curve pool's reported exchange rate, though the Curve pool uses the oracle only for pricing and does not hold redeemable backing.
- Admin Safe and Guardian Safe share most signers (the 6 new-Admin-Safe owners plus the former Admin Safe appear together as members of role 31), limiting independence.
- **The APYUSD vault was upgraded twice** since the May 29 assessment: May 18 (to [`0x6f4d…3173`](https://etherscan.io/address/0x6f4da5be9690cc2b6b0b83ca8c708e2b16153173)) and May 27 (to current [`0xfd61…b112`](https://etherscan.io/address/0xfd616567ecc1607f61073951a1e822f7315bb112)). Both upgrades went through the Guardian Safe with the 3-day execution delay, demonstrating the governance timelock functioning as designed. The current implementation adds `burnWithAssets`, `denyList`, `feeWallet`, and `getCCIPAdmin` functionality.

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
| **Curve StableSwap-NG** | Former primary liquidity venue | **Low** | Pool effectively drained (~$11.9K TVL) after Guardian Safe withdrew LP. No longer a meaningful exit path. |
| **Uniswap V4** | Current primary liquidity venue | **High** | Now the main exit path for non-whitelisted users (~5.08M apxUSD). Pool failure or LP withdrawal would severely restrict liquidity. |
| **Gnosis Safe** | Multisig infrastructure | **High** | All governance actions flow through Safe multisigs |
| **Ethereum L1** | Settlement layer | **Medium** | All contracts on Ethereum mainnet only |

**Key dependency risk**: The protocol has a **critical dependency on offchain assets and custody** that cannot be verified onchain. The rate oracle is manually set with no automated price feed or fallback mechanism. Onchain liquidity is now concentrated in a single venue (Uniswap V4, ~5.08M apxUSD).

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
  - **Alert**: If supply increases by >10M in 24 hours (current supply ~312M; supply cap 750M)
  - Monitor `Transfer` events for large movements (>$500K)
  - Monitor `Paused`/`Unpaused` events
  - Monitor mints (`Transfer` with `from = 0x0`) and burns (`burn`/`burnFrom` calls, or `Transfer` with `to = 0x0`). Supply has been contracting via onchain burns since late June. **Alert**: If mint volume rebounds without corresponding attestation or Accountable dashboard updates.

### Mint Pass-Through Monitoring

- **Pass-through contract**: [`0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8`](https://etherscan.io/address/0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8)
  - Monitor all apxUSD inflows and outflows
  - **Alert**: If outflow destination is not the Guardian Safe (would indicate fresh mints routed somewhere else)
  - **Alert**: If `authority()` ever returns an address other than the Apyx AccessManager (`0xe167…2824`)

### Rate Oracle Monitoring

- **ApxUSDRateOracle**: [`0xa2ef2e7bf32248083e514a737259f3785ea8d37d`](https://etherscan.io/address/0xa2ef2e7bf32248083e514a737259f3785ea8d37d)
  - Monitor `RateUpdated` events -- any rate change should be investigated
  - **Alert**: If rate deviates from 1.0 by >1%
  - **Alert**: If rate deviates from 1.0 by >5% (critical)
  - Monitor for proxy upgrade events (`Upgraded`)

### Curve Pool Monitoring

- **Curve Pool**: [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)
  - Pool is **effectively drained** (~$11.9K TVL) after the Guardian Safe withdrew 100% of its LP. Monitor for any LP redeployment or new liquidity inflows.
  - Monitor pool balance ratio and virtual price for peg stress signals (currently 1.0049, +0.49%)
  - **Alert (Critical)**: If Curve pool virtual price deviates >2% from 1.0
  - **Alert**: If the Guardian Safe redeploys LP into the Curve pool or any new venue
  - **(New) Uniswap V4 PoolManager Monitoring** — Uniswap V4 is now the primary onchain liquidity venue:
    - Monitor [`0x000000000004444c5dc75cb358380d2e3de08a90`](https://etherscan.io/address/0x000000000004444c5dc75cb358380d2e3de08a90) apxUSD balance (currently ~5.08M)
    - **Alert (Critical)**: If PoolManager apxUSD balance drops below $2M
    - **Alert (High)**: Any large apxUSD withdrawal from the PoolManager by the Guardian Safe

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

- Monitor Guardian/Upgrader Safe (`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`) balance and movements (apxUSD: ~2.54M, apyUSD: ~2.38M, USDC: ~2.0M, Curve LP: 0)
- Monitor Operations Safe (`0x37B0779A66edc491df83e59a56D485835323a555`) **STRCX balance** — this is currently the only directly-onchain-verifiable portion of apxUSD backing (~$75–90M)
  - **Alert (Critical)**: Any STRCX transfer out of the Operations Safe, especially to non-Apyx counterparties (would represent a reduction in onchain reserves)
  - **Alert (High)**: STRCX balance drops by >5% in 24 hours
- Monitor Third-Party Safe (`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`) balance
- Monitor Curve pool for any LP redeployment or large inflows (currently ~$11.9K TVL, Guardian LP: 0)
- Monitor MinterV0 for mint execution events
- **Alert**: If apxUSD `supplyCap` changes from current 750M

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
| **Guardian Safe LP token balance** (POL redeployment) | Real-time | **Critical** |
| **Operations Safe STRCX balance** (onchain reserves) | Real-time | **Critical** |
| **Mint pass-through 0xcca1af4d outflow destination** | Real-time | **Critical** |
| Accountable PoR dashboard freshness / registry status | Real-time | Critical |
| Chainlink CCIP / Base supply reconciliation | Real-time | Critical |
| AccessManager role changes | Real-time | Critical |
| Admin Safe transactions | Real-time | Critical |
| Guardian Safe transactions (Safe-level) | Real-time | Critical |
| Curve pool balance ratio | Every 6 hours | High |
| apxUSD supply changes | Every 6 hours | High |
| apxUSD `supplyCap` increases | Real-time | High |
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
- **Supply decreasing from peak**: apxUSD supply contracted from ~524.66M (late June peak) to ~312.07M (August 1) via onchain burns, demonstrating the redemption pipeline now routes through onchain burns. The supply:attestation gap has narrowed (~4.7× vs ~7.8×).
- **Partial onchain backing visibility**: Apyx Operations Safe holds 582,774 STRCX (~35% of all STRCX onchain supply). At ~$100 par, this covers ~$58M (~19% of 312M apxUSD supply), up from ~14–17% coverage at May 29.
- **Onchain burns now active**: The supply contraction occurred through `burn`/`burnFrom` calls, addressing the May 29 concern about asymmetric onchain supply (mints only, no burns).
- **Open-source code**: Full Foundry project with invariant tests and Slither CI.
- **Public, credentialed team**: Six named founding contributors with verifiable backgrounds at Kraken, Goldman Sachs, Binance, and DeFi Development Corp.

### Key Risks

- **Offchain collateral, limited attestation track record**: One monthly attestation has been published (March 2026, Wolf & Company). April and May attestations ~4 months late. Custodian(s) still not publicly named; overcollateralization ratio still not disclosed in the docs.
- **Curve liquidity pool drained (materialized risk)**. The Guardian Safe withdrew 100% of its Curve LP between late June and July 2026. Pool TVL collapsed from ~$29M to ~$11.9K. The only remaining onchain exit venue is Uniswap V4 (~5.08M apxUSD). Virtual price drifted to 1.0049 (+0.49%).
- **BTC/DAT stress sensitivity**: apxUSD is not backed by BTC directly, but its preferred-share collateral is issued by Digital Asset Treasury companies whose market value and liquidity can be sensitive to BTC drawdowns. A fast BTC selloff could pressure STRC/SATA pricing and secondary liquidity.
- **Rate Oracle retains zero-delay admin control**: The current 4-of-6 Admin Safe can upgrade the Rate Oracle proxy or call `setRate()` instantly.
- **Unbacked-mint design**: `ApxUSD.mint()` creates tokens without any onchain collateral transfer — backing is verified only off-chain via attestations. Burn capacity now exists but minting remains permissioned and unbacked.
- **APYUSD vault upgraded twice** since May 29 (May 18 and May 27). Upgrades went through the 3-day timelock as designed, but the pace is notable.
- **Attestation cadence has slipped further**: The only published attestation (March 2026) covered ~67M supply. April and May attestations are ~4 months late. Current supply ~312M is ~4.7× the attested period.
- **CCIP / Base bridge dependency**: apxUSD and apyUSD are live on Base using Chainlink CCIP for cross-chain support.
- **Young protocol**: ~164 days in production as of August 1, 2026. Over 5 months but still a short track record.
- **DFDV concentration**: All six founding contributors are executives at DeFi Development Corp. (Nasdaq: DFDV), which is also the protocol's first institutional investor. BVI legal entity with $100 liability cap.
- **No bug bounty program**: Notable absence for a protocol with >$300M Ethereum apxUSD supply.

### Critical Risks

- **Rate oracle manipulation (no timelock)**: The current Admin Safe can upgrade the ApxUSDRateOracle implementation and call `setRate()` with zero delay. No staleness check or bounds validation exists onchain.
- **Offchain collateral opacity (mitigated, not resolved)**: If preferred shares are not actually held or are liquidated without disclosure, apxUSD could be undercollateralized. The March 2026 Wolf & Company attestation covers a stale period (67M supply). Accountable dashboard returns 403.
- **Onchain liquidity severely diminished**: The Curve pool, previously the primary exit path, has been drained by the Guardian Safe's POL withdrawal. Only Uniswap V4 (~5.08M apxUSD) remains as meaningful onchain liquidity for ~312M supply.

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
- **Time in Production**: ~164 days. Over 5 months.
- **TVL**: ~312.07M Ethereum apxUSD supply (down from ~524.66M peak; supply cap 750M), plus ~9.77M Base apxUSD supply. Listed on CoinGecko.
- **Incidents**: None, but a material liquidity event occurred: Curve pool drained by Guardian Safe POL withdrawal between late June and July 2026.

**Score: 3.5/5** -- Three reputable audits with public reports and onchain remediation evidence. Open-source code with comprehensive tests. The ~164-day track record is still relatively short for a protocol with >$300M supply, and the bug bounty remains absent. The Curve pool drain is a material structural event though not an exploit.

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
- **High**: Uniswap V4 for liquidity (now the primary onchain venue after Curve drain)
- **Medium**: Gnosis Safe infrastructure

**Dependencies Score: 4.0** -- Critical dependency on offchain assets and custody that cannot be verified onchain. No fallback mechanism if custody providers fail. The oracle has no automated price feed. Onchain liquidity is concentrated in a single venue (Uniswap V4, ~5.08M).

**Centralization Score = (3.0 + 3.5 + 4.0) / 3 = 3.5**

**Score: 3.5/5** -- Timelocks on core upgrades and role grants are a material improvement, but the Rate Oracle (no timelock) and continued offchain dependencies keep this elevated.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Offchain backing by publicly-traded preferred shares (Nasdaq-listed)
- Cash/short-term Treasuries buffer documented, but exact instruments, location, custodian, and maturity profile are undisclosed
- Overcollateralized (specific ratio undisclosed)
- Custody in "third-party prime brokerage accounts" (custodian not publicly named); multi-party MPC key management
- Partial onchain verification via Apyx Operations Safe's 582,774 STRCX holding (~$58M at ~$100 par, ~19% of 312M apxUSD supply). Bulk of backing remains offchain.
- Reserve is equity (not stablecoins) — more volatile than typical stablecoin collateral
- PCAOB-registered examination-level attestation published for March 2026 (Wolf & Company); covers a period when supply was ~67M vs current ~524.66M.
- Accountable Proof-of-Reserves dashboard listed as live by Accountable since April 23, 2026

**Collateralization Score: 3.5** -- Held at 3.5. Supply decreased from ~524.66M to ~312.07M, and STRCX held by the Operations Safe decreased from 757,187 to 582,774. The STRCX holding now covers ~$58M at ~$100 par (~19% of 312M supply), up from ~14–17% previously. However, the attestation gap has widened: only the March 2026 attestation (covering ~67M supply) has been published, now ~4 months stale. Other concerns unchanged: custodian undisclosed, OC ratio undisclosed, equity-not-cash, cash buffer composition opaque.

**Subcategory B: Provability**

- apyUSD exchange rate: onchain (ERC-4626)
- apxUSD collateral: offchain. **One published PCAOB-registered examination-level attestation** (Wolf & Company, March 2026), covering a period when supply was ~67M. April attestation **still not published** as of May 29 (now ~2 months behind), against current supply ~524.66M.
- Accountable data verification: live proof-of-reserves integration listed in Accountable's DVN registry (`frequency = live`, `connectors = 3`, `verifiability = 4`) since April 23, 2026; detailed current values not independently extracted due dashboard/API 403s from this environment. Pricing methodology for offchain STRC/SATA marks, especially outside Nasdaq market hours, is not independently verified.
- Onchain backing visibility: STRCX in the Operations Safe (~$75–90M, ~14–17% of supply) is directly verifiable; the remaining ~85% depends on offchain custody.
- Rate oracle: manually set, no third-party verification.
- Onchain supply history: supply peaked at ~524.66M (late June 2026) then contracted to ~312.07M via onchain `burn`/`burnFrom` calls. The mint/redeem pipeline now includes an onchain burn path, addressing the previous asymmetry concern. The single attestation data point (March 2026, ~67M supply) is ~4 months stale, making the attestation cadence load-bearing.

**Provability Score: 4.25** -- Held at 4.25. The supply-vs-attestation gap has shifted: with supply at ~312.07M (down from ~524.66M), the current supply is ~4.7× the attested period (~67M), improving from ~7.8×. However, the attestation cadence has slipped further — April and May 2026 attestations remain unpublished as of August 1 (~4 months since the last published attestation). Accountable dashboard is still listed in the DVN registry (verifiability = 4, connectors = 3, frequency = live) but the dashboard URL returns 403 from this environment. The apyUSD vault was upgraded twice, and the new implementation adds `denyList`, `feeWallet`, and `burnWithAssets` functionality that may affect provability.

**Funds Management Score = (3.5 + 4.25) / 2 = 3.875**

**Score: 3.875/5** -- Up from 3.75. The score remains elevated because apxUSD/apyUSD holders can still lose money if offchain preferred-share collateral loses value, becomes unavailable, or is not accurately reflected in reserve reporting. The supply-vs-attestation gap is the dominant driver of the increase.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Curve pool**: **Effectively drained** — TVL collapsed from ~$29M to ~$11.9K after the Guardian Safe withdrew 100% of its LP (40,890,164 tokens). Virtual price drifted to 1.0049 (+0.49%). Pool is non-functional as a meaningful exit path.
- **Uniswap V4**: ~5.08M apxUSD in pool manager (down from ~10.47M). Now the primary onchain liquidity venue.
- **Direct redemption**: Permissioned only; onchain burns are now active (supply contracted ~212M from peak), but this is not a general exit path.
- **Supply-to-liquidity ratio**: With supply ~312.07M and Uniswap V4 depth ~5.08M, the supply:liquidity ratio is ~61×. When Curve was still intact at ~$29M, the ratio was ~18×.
- **Stress event**: Protocol experienced a deliberate POL withdrawal that drained the primary liquidity pool. Peg has deviated slightly (1.0049 virtual price).

**Score: 4.5/5** -- Up from 4.0. The Curve pool drain that was flagged as a risk in the May 29 assessment has fully materialized. The primary exit path (Curve) has been reduced from ~$29M to ~$11.9K. Only Uniswap V4 (~5.08M) remains as a meaningful onchain liquidity venue. Direct redemption remains permissioned. The virtual price deviation (+0.49%) indicates the peg is under modest stress. A score of 4.5 reflects a protocol where onchain exit depth is severely constrained and concentrated, though not yet zero.

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
| Funds Management | 3.875 | 30% | 1.1625 |
| Liquidity Risk | 4.5 | 15% | 0.675 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.7375/5.0 (~3.74)** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Elevated Risk — Limited approval, strict limits**

> Tier change from May 7 (Medium → Elevated). Drivers (May 29): protocol-owned liquidity concentration, supply growth outpacing attestation cadence. Reassessment (August 1): Curve pool drained by POL withdrawal, liquidity score increased from 4.0 to 4.5, final score moved from 3.66 to 3.74. Still Elevated Risk.

---

Apyx's apxUSD is a novel "Dividend-Backed Stablecoin" bridging offchain corporate dividends into onchain yield. Following the March 20-21 governance restructure, the March 2026 Wolf & Company attestation, and the April 23 Accountable Proof-of-Reserves integration, the three gaps identified at the March 26 assessment were materially addressed: proof of reserves, admin timelocks, and headline liquidity depth. However, an August 1, 2026 reassessment finds that the Curve pool has been drained by the Guardian Safe's POL withdrawal, onchain exit depth is critically thin, the attestation cadence has slipped to ~4 months behind, and the apyUSD vault has been upgraded twice. Supply has contracted from a ~524M peak to ~312M and onchain burns are now active, which are positive developments.

**Residual concerns that drive the score to 3.74 (Elevated Risk):**
- **Curve liquidity pool drained (materialized risk).** The Guardian/Upgrader Safe withdrew 100% of its Curve LP between late June and July 2026. The pool's nominal TVL went from ~$29M to ~$11.9K. The only remaining onchain exit venue is Uniswap V4 (~5.08M apxUSD).
- **Rate Oracle has no timelock.** ADMIN_ROLE can upgrade the oracle and call `setRate()` with zero delay.
- **Custodian is still not publicly named.** Accountable adds live third-party reserve verification, but the custody black-box persists and this review could not independently extract current Accountable dashboard values (dashboard returns 403 from this environment).
- **Monthly attestation cadence has slipped.** March 2026 attestation published; April and May attestations not yet published as of August 1 (~4 months behind). Current supply (~312M) is ~4.7× the attested period supply (~67M).
- **APYUSD vault upgraded twice** since May 29. Upgrades went through the 3-day timelock as designed, but the pace (two upgrades in 9 days) is notable for a protocol with >$300M supply.
- **Protocol still relatively young** (~164 days) with a single published attestation covering a now-stale period.
- **No bug bounty program** at >$300M Ethereum apxUSD supply.

**Conditions for continued or increased exposure:**
1. Publish the overdue April and May 2026 attestations to establish a sustained monthly cadence.
2. Add a non-zero execution delay or target-admin-delay to the Rate Oracle (`ApxUSDRateOracle`) such that `setRate()` and `upgradeToAndCall` cannot be executed instantly.
3. Publicly name the custodian(s) holding the preferred shares.
4. Re-establish or replace the primary onchain liquidity venue — current onchain exit depth (~$5M Uniswap V4) is critically thin relative to ~$312M supply.
5. Disclose the cash/short-term Treasuries buffer composition, custody location, account type, instrument type, maturity/WAM, and whether any cash is bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another cash-equivalent instrument.
6. Disclose the overcollateralization ratio with supporting evidence (ideally in the monthly attestation).
7. Keep the Accountable dashboard live, current, and externally accessible; publish enough methodology/source detail for independent reviewers to understand what the 3 connectors verify.
8. Launch a bug bounty program (Immunefi / Cantina / Safe Harbor).

**Monitoring priorities:**
- Rate oracle for any `RateUpdated` event (currently 1.0).
- Admin Safe (4-of-6) and Guardian/Upgrader Safe (3-of-6) for any ownership/threshold changes or role grant/revoke events.
- Scheduled operations in AccessManager (`OperationScheduled` event) — any pending upgrade should trigger review during the delay window.
- Accountable PoR dashboard freshness, coverage ratio, connector count, and verifiability level.
- Chainlink CCIP Ethereum/Base route status, Base token supply, and cross-chain supply reconciliation.
- Uniswap V4 PoolManager apxUSD balance — this is now the primary onchain liquidity venue.
- Guardian Safe LP token and apxUSD movements — any redeployment of POL into new venues should be monitored.
- STRC/SATA market prices and liquidity during sharp BTC drawdowns.
- Operations Safe STRCX balance (582,774, ~35% of STRCX supply) — continued decline would reduce onchain visibility.
- Monthly attestation publication cadence.
- Curve pool virtual price and balance ratio for peg stress signals.

---

## Reassessment Triggers

- **Attestation cadence**: Reassess when the next PCAOB-registered attestation is published (April and/or May 2026 are overdue).
- **Accountable verification**: Reassess downward if the dashboard becomes unavailable/stale, Accountable removes or downgrades the Apyx registry entry, connector count decreases, or verifiability level decreases.
- **Cross-chain / CCIP**: Reassess if Chainlink CCIP Ethereum/Base transfers are paused or impaired, Base token-pool/admin configuration changes materially, Base apxUSD/apyUSD supply diverges from expected cross-chain reconciliation, or Apyx migrates to a different bridge provider.
- **Governance-based**: Reassess on any ownership/threshold change to either multisig, any change to `targetAdminDelay` or `roleGrantDelay` on AccessManager, any rate-oracle change (upgrade or `setRate`), or any further apxUSD/apyUSD implementation upgrades.
- **Time-based**: Reassess in 1 month (early September 2026).
- **Supply/TVL-based**: Supply is currently ~312.07M. Reassess if supply exceeds 500M again (toward the 750M cap), if the supply cap is raised or lowered, if Base apxUSD supply grows materially without clear CCIP/Accountable reconciliation, or if Uniswap V4 PoolManager apxUSD balance drops below $2M.
- **Liquidity-based**: Reassess if Curve pool TVL recovers above $1M (indicating POL redeployment or organic LP growth), if the Guardian Safe deploys new liquidity into any venue, if a new primary liquidity pool is launched by Apyx, or if Uniswap V4 apxUSD liquidity drops materially.
- **POL movement-based**: Reassess if the Guardian/Upgrader Safe deploys LP into any new or existing venue.
- **Market-stress based**: Reassess if BTC falls >10% in 1 hour or >20% in 24 hours and STRC/SATA prices, Accountable collateral coverage, or apxUSD peg quality deteriorate. Reassess urgently if this happens over a weekend/holiday while STRC/SATA marks are stale and apxUSD sells off before Nasdaq trading reopens.
- **Incident-based**: Reassess after any exploit, unplanned oracle change, or peg deviation >2%.
- **Bug bounty**: Reassess if a bug bounty program is launched.

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| March 26, 2026 | 5.0 (Gated) | Initial assessment. Failed Critical Risk Gates (no audit, unverifiable reserves, total centralization). |
| April 19, 2026 | 3.5 | All critical gates cleared after governance restructure and attestation publication. Supply ~175M. |
| May 29, 2026 | 3.66 | Tier raised to Elevated Risk. POL concentration (99.96% Curve LP), supply growth outpacing attestation (524M vs 67M attested). |
| August 1, 2026 | 3.74 | Curve pool drained by Guardian Safe POL withdrawal (~$29M → ~$11.9K). Supply contracted from 524M to 312M via onchain burns. apyUSD upgraded twice. Liquidity score raised 4.0 → 4.5. |
