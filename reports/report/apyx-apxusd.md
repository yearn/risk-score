# Protocol Risk Assessment: Apyx

- **Assessment Date:** April 19, 2026 (Updated May 29, 2026; August 1, 2026; corrected August 3, 2026)
- **Token:** apxUSD
- **Chain:** Ethereum + Base + BNB Chain
- **Token Address:** [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
- **Final Score: 3.73/5.0**

## Overview + Links

Apyx is a "Dividend-Backed Stablecoin" (DBS) protocol that converts offchain corporate dividend income from publicly-traded Digital Asset Treasury (DAT) preferred shares into onchain programmable yield. The protocol offers two tokens:

- **apxUSD**: A synthetic dollar that Apyx describes as backed by an overcollateralized basket of low-volatility, variable-rate DAT preferred shares. It does NOT pay yield directly to holders and serves as the protocol's primary liquidity and collateral layer.
- **apyUSD**: A yield-bearing ERC-4626 vault token. Users deposit apxUSD and receive apyUSD, which accrues yield through a rising exchange rate (non-rebasing) funded by dividends from the underlying DAT preferred share portfolio.

**Collateral**: The basket currently includes preferred shares from publicly-traded companies:
- **STRC** (Strategy Inc Variable Rate Series A Perpetual Preferred Stock, ~11.25% indicated dividend rate, $100 par value, Nasdaq-listed)
- **SATA** (Strive Inc Variable Rate Series A Perpetual Preferred Stock, ~12% dividend, Nasdaq-listed)

Apyx states that the collateral is dynamically rebalanced based on issuer concentration limits, liquidity needs, and overcollateralization requirements.

### Can Holders Lose Money?

Yes — and holders currently are. apxUSD is intended to trade near $1, but it is not backed by onchain stablecoins or cash-equivalents. Its backing is an offchain portfolio of DAT preferred shares. If those preferred shares fall in value, dividends are cut, custody fails, reserves are misreported, or liquid secondary markets dry up, apxUSD can trade below $1 and holders can lose principal.

This is not hypothetical. **apxUSD has traded below par continuously since early June 2026** following a record STRC drawdown, reaching a daily low of ~$0.75 in late June and trading at **$0.881 on August 1, 2026 (−11.9%)**. See *Historical Track Record → June 2026 Depeg*.

apyUSD inherits the same risk because it is redeemable into apxUSD. Its exchange rate can rise in apxUSD terms while the USD value of apxUSD itself falls. The redemption cooldown (up to 20 days) can also delay exits during stress.

**Key metrics (August 1, 2026):**
- apxUSD market price: **$0.881** — 11.9% below par, sustained since early June ([DefiLlama](https://coins.llama.fi/prices/current/ethereum:0x98a878B1CD98131b271883b390F68d2c90674665))
- apxUSD Total Supply (Ethereum): **~312.07M** (supply cap 750M)
- Accountable Proof of Solvency (August 3, 11:26 UTC): **$217.04M asset reserves / $235.30M circulating supply = 92.24% collateralization**; redemption value **$0.9131** ([dashboard](https://accountable.apyx.fi/), [API](https://api.accountable.apyx.fi/dashboard))
- Base supply: ~9.77M apxUSD and ~0.57M apyUSD via Chainlink CCIP
- BNB Chain supply: ~2.44M apxUSD via Chainlink CCIP ([token](https://bscscan.com/token/0x6b3788fd6604bbf03c5378d24e57bb334baad4af))
- apyUSD vault totalAssets: ~180.91M apxUSD; exchange rate: ~1.405 apxUSD per apyUSD
- Curve apxUSD/USDC Pool: **~$11.9K nominal TVL** — the Guardian/Upgrader Safe withdrew its entire LP position, effectively draining the pool. See *Protocol-Owned Liquidity* under Liquidity Risk.
- Uniswap V4 PoolManager: ~5.07M apxUSD (singleton balance, not tradable depth)
- Listed on CoinGecko
- Chains: Ethereum, Base, and BNB Chain via Chainlink CCIP; Solana is planned. A third CCIP selector is configured, but its remote-token/deployment status is **TODO**.
- Protocol launched: February 18, 2026 (~164 days ago)

**Links:**

- [Protocol Website](https://apyx.fi/)
- [Protocol Documentation](https://docs.apyx.fi)
- [apxUSD Overview](https://docs.apyx.fi/product-overview/apxusd-overview)
- [apyUSD Overview](https://docs.apyx.fi/product-overview/apyusd-overview)
- [Blog - Introducing Apyx](https://blog.apyx.fi/introducing-apyx/)
- [Post-Mortem: The STRC Drawdown & the apxUSD Price Movement (June 8, 2026)](https://blog.apyx.fi/post-mortem/)
- [Apyx 2.0: Redemption Value & Total Collateralization (June 15, 2026)](https://blog.apyx.fi/apyx-2-0-redemption-value-total-collateralization-evolution-of-the-dividend-backed-dollar/)
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
| apyUSD (Implementation, current) | [`0xfd616567ecc1607f61073951a1e822f7315bb112`](https://etherscan.io/address/0xfd616567ecc1607f61073951a1e822f7315bb112) | ApyUSD. Set May 27, 2026 (block 25188571) via [`0x4e5b…696d`](https://etherscan.io/tx/0x4e5b0a6da667cef27e23745f7fd217baa6242b6365ad18b894720cbfb3b4696d). Adds `burnWithAssets`, `denyList`, `feeWallet`, `redeemForMinAssets`, `getCCIPAdmin`. |
| AccessManager | [`0xe167330e2eac88666de253e9607c6d9ae0ca2824`](https://etherscan.io/address/0xe167330e2eac88666de253e9607c6d9ae0ca2824) | OpenZeppelin AccessManager |
| MinterV0 | [`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e) | Mint Strategy (EIP-712) |
| ApxUSDRateOracle (Proxy) | [`0xa2ef2e7bf32248083e514a737259f3785ea8d37d`](https://etherscan.io/address/0xa2ef2e7bf32248083e514a737259f3785ea8d37d) | Curve Pool Oracle, UUPS Proxy |
| ApxUSDRateOracle (Implementation, current) | [`0x26ea4a9099b4da41b2d0e7e9874a29104d8bb17f`](https://etherscan.io/address/0x26ea4a9099b4da41b2d0e7e9874a29104d8bb17f) | Rate oracle (upgraded) |
| LinearVestV0 | [`0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f`](https://etherscan.io/address/0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f) | Yield Vesting (~17-day linear) |
| YieldDistributor | [`0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a`](https://etherscan.io/address/0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a) | Distributes yield to vesting |
| AddressList | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Whitelist/Deny List. Wired into apxUSD, apyUSD, and UnlockToken — see *Deny List* under Centralization. |
| UnlockToken | [`0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6`](https://etherscan.io/address/0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6) | apyUSD Unlock Token (`unlockingDelay() = 1,728,000s` = 20 days) |
| Fee Wallet | [`0x6F93635F2A1C19b4F7f1BD9BA655F6A073C629Dc`](https://etherscan.io/address/0x6F93635F2A1C19b4F7f1BD9BA655F6A073C629Dc) | Recipient of the apyUSD unlocking fee (`apyUSD.feeWallet()`); admin-settable via `setFeeWallet`. |
| CommitToken (apxUSD) | [`0x17122d869d981d184118b301313bcd157c79871e`](https://etherscan.io/address/0x17122d869d981d184118b301313bcd157c79871e) | CT-apxUSD |
| CommitToken (LP) | [`0xdfc3cf7e540628a52862907dc1ab935cd5859375`](https://etherscan.io/address/0xdfc3cf7e540628a52862907dc1ab935cd5859375) | CT-apxUSDUSDC |
| OrderDelegate | [`0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1`](https://etherscan.io/address/0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1) | Minting Delegate |
| Mint Pass-Through | [`0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8`](https://etherscan.io/address/0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8) | Apyx-controlled hop contract: `asset()` returns apxUSD; `authority()` returns the Apyx AccessManager. Balance is currently 0 apxUSD. |

### Cross-Chain Contracts

| Contract | Address | Type |
|----------|---------|------|
| apxUSD (Base) | [`0xd993935e13851dd7517af10687ec7e5022127228`](https://basescan.org/address/0xd993935e13851dd7517af10687ec7e5022127228) | Base deployment of apxUSD |
| apyUSD (Base) | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://basescan.org/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Base deployment of apyUSD |
| Base AccessManager | [`0x8AFDE6a90d2396A64eB97e8E69e7548289f78A1D`](https://basescan.org/address/0x8AFDE6a90d2396A64eB97e8E69e7548289f78A1D) | AccessManager returned by Base token `authority()` |
| apxUSD (BNB Chain) | [`0x6b3788fd6604bbf03c5378d24e57bb334baad4af`](https://bscscan.com/token/0x6b3788fd6604bbf03c5378d24e57bb334baad4af) | BNB Chain apxUSD representation; ~2.44M supply at the August 1 snapshot; `getCCIPAdmin()` returns the Guardian Safe |
| Ethereum CCIP LockReleaseTokenPool | [`0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5`](https://etherscan.io/address/0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5) | Escrows canonical apxUSD and maps CCIP routes to Base and BNB Chain remote tokens |

**Bridge / interoperability:** Apyx uses **Chainlink CCIP** with a lock/release model on Ethereum. The Ethereum TokenAdminRegistry maps apxUSD to the LockReleaseTokenPool above. Its onchain `getSupportedChains()` includes Base selector `15971525489660198786`, BNB Chain selector `11344663589394136015`, and a third selector whose live deployment status remains **TODO**. `getRemoteToken` maps the first two selectors to the Base and BNB Chain token addresses listed above. Canonical apxUSD is escrowed on Ethereum; remote tokens are bridged representations. The pool and the BNB token's `getCCIPAdmin()` are controlled by the Guardian Safe.

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
| Uniswap V4 Pool Manager | [`0x000000000004444c5dc75cb358380d2e3de08a90`](https://etherscan.io/address/0x000000000004444c5dc75cb358380d2e3de08a90) | Uniswap V4 singleton holding ~5.07M apxUSD — the primary remaining Ethereum spot venue. The balance aggregates all pools and includes out-of-range positions, so it is an upper bound on inventory rather than executable depth. |

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

| Period | Report Dates | Opinion Date | Latest Attested Assets | Standard / Opinion | Link |
|--------|--------------|--------------|-------------------------|--------------------|------|
| **March 2026** | March 24 and 31 | April 14 | $52,988,762 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#march-2026) |
| **April 2026** | April 9 and 30 | May 18 | $133,927,390 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#april-2026) |
| **May 2026** | May 5 and 31 | June 17 | $302,457,888 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#may-2026) |
| **June 2026** | June 17 and 30 | July 22 | $193,307,068 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#june-2026) |

**Notes:**
- All four Wolf & Company PDFs were fetched through Chromium/Playwright on August 3, 2026. Each current GitBook link returned HTTP 200, `application/pdf`, and extractable report text. The reports are Independent Accountant's Reports conducted under AICPA attestation standards to obtain reasonable assurance; Wolf opines that management's asset assertions are fairly stated in all material respects.
- Scope is narrower than proof of solvency: the opinions cover the reported assets' existence, ownership, custody, and valuation at two dates per month. They do not opine on apxUSD liabilities or collateral coverage.
- The April–June reports name **Alpaca** as the U.S. brokerage holding offchain STRC/SATA. The June 30 report attests `$109,512,763` at Alpaca and `$83,794,305` of self-custodied onchain STRCx, totaling `$193,307,068`. The bank/custodian for cash and cash-equivalent balances is not named.
- Four consecutive monthly reports confirm the publication cadence through June. No July report is currently listed; prior opinions were issued 14–22 days after month-end, so July may still be within the observed publication lag.
- Docs mention a cash/short-term Treasuries buffer, but this review did not find a public breakdown of where those cash-equivalent assets are held, whether cash is bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another instrument, nor maturity/WAM details for the Treasuries component.
- The protocol's target or minimum overcollateralization requirement is not publicly disclosed; Accountable does publicly report the current ratio (92.24% at this snapshot).

### Accountable Data Verification

| Provider | Mechanism | Status | Evidence |
|----------|-----------|--------|----------|
| **Accountable** | Data Verification Network / Proof-of-Reserves dashboard | Live since **April 23, 2026**; `frequency = live`; `connectors = 3`; `verifiability = 4` | [Accountable Dashboard](https://accountable.apyx.fi/) / [DVN registry](https://dvn.accountable.capital/v1/stats) |

**Notes:**
- Accountable's registry lists Apyx as a `por` integration for ticker `apxUSD`, with API URL `https://api.accountable.apyx.fi/dashboard` and dashboard URL `https://accountable.apyx.fi`.
- [Apyx announced](https://telemetr.io/en/channels/3567636548-apyx_announcements/posts) that Accountable provides third-party assurance on reserves with near-real-time visibility into outstanding supply, reserve composition, collateral coverage, and cross-platform distribution.
- **Live data retrieved through Chromium/Playwright on August 3, 2026 at 11:26 UTC:** the API returned `$217,035,429.31` of asset reserves against `$235,301,450.21` of circulating supply, a `0.922372` collateral ratio and `$0.9131` redemption value. The response separately reported `$31,929,748.28` of inventory and `$44,842,316.33` of protocol-owned liquidity; including those categories produced `$293,807,493.92` of total reserves against `$312,073,514.82` total supply. Accountable marked the snapshot `verifiability = 100` and included Nitro-enclave attestation material.
- The API identities reconcile: asset reserves equal STRC (`$183,285,475.70`) plus Cash & Equivalents (`$33,743,189.09`) plus Other (`$6,764.52`), while circulating supply equals total supply less inventory and protocol-owned liquidity. The displayed collateral ratio is asset reserves divided by circulating supply, rather than all reported reserve categories divided by total supply.
- The remaining methodological limitation is valuation, not availability. The API does not expose source-level timestamps or explain whether STRC/SATA coverage uses last-traded prices, broker/custodian marks, modeled fair values, bid-side liquidation marks, or another source when Nasdaq is closed.

**How Accountable works (as understood from public materials):**
- [Accountable](https://docs.accountable.capital/accountable-documentation/data-verification-network-dvn) is a third-party data-verification provider. Its system connects to data sources, ingests reserve/liability data, and publishes a dashboard/API for proof-of-reserves or proof-of-solvency reporting.
- Accountable's public DVN registry assigns Apyx `verifiability = 4`, `connectors = 3`, and `frequency = live`. In Accountable's own verification-level model, level 3 is direct connector-based data sourcing, level 4 adds secure-enclave based verification (hardware-level attestation such as SGX/Nitro), and level 5 is zkTLS. Therefore, the Apyx integration should be treated as a live third-party connector/enclave verification system, **not** as a fully onchain or fully zkTLS-backed proof.
- For Apyx, the live dashboard compares token liabilities/outstanding supply against offchain reserve assets and shows reserve composition and collateral coverage. Its API `supply_split` currently itemizes Ethereum only, so route-level Base/BNB reconciliation is still not available there.

**Trustworthiness assessment:**
- **Useful and materially better than self-reporting.** The live Accountable dashboard and public JSON API are independently inspectable and introduce a data-verification layer between attestations. This is sufficient to clear the framework's unverifiable-reserves gate.
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
  - Ethereum apxUSD `totalSupply`: **~312.07M** (supply cap 750M)
  - Base supply: ~9.77M apxUSD and ~0.57M apyUSD
  - BNB Chain supply: ~2.44M apxUSD
  - apyUSD vault totalAssets: ~180.91M apxUSD
  - Curve pool: **~$11.9K nominal** at par; the Guardian Safe's LP balance is 0
  - Guardian/Upgrader Safe: **~2.54M apxUSD + ~2.38M apyUSD + ~2.0M USDC**
  - Operations Safe: ~1 apxUSD, 0 apyUSD, ~0.9 USDC, holds **582,774 STRCX (~35% of all STRCX supply)** as onchain backing
  - Third-Party Safe: ~0.65M apxUSD
- **Supply History**: ~13M at launch → ~67M on March 26 → ~175M on April 19 → ~306.86M on May 7 → ~524.66M peak (late May/June) → **~312.07M on August 1**. The ~212M contraction from peak was executed through onchain `burn`/`burnFrom` calls and reflects the redemption wave that followed the June depeg. The mint/redeem pipeline is no longer onchain-asymmetric: burns are now observable onchain rather than settled exclusively offchain.
- **Incidents**: **One material incident — the June 2026 depeg (below).** No exploit, realized custody loss, or smart-contract failure was identified. The live Accountable snapshot now reports 92.24% asset-reserve coverage of circulating supply, so dollar-par solvency should not be inferred.
- **Peg Stability**: **Broken since early June 2026 and not recovered.** apxUSD trades at **$0.881** as of August 1 (−11.9%). Note that the Curve pool's `get_virtual_price()` (1.0049) is *not* a peg measure — it is a cumulative LP-share accumulator that only rises with fee accrual and cannot fall during a depeg. Peg quality must be read from market price, not virtual price.

### June 2026 Depeg

The protocol's first major stress event, documented by Apyx in a [post-mortem published June 8, 2026](https://blog.apyx.fi/post-mortem/). Prices below are DefiLlama daily marks for [`0x98a878B1…4665`](https://coins.llama.fi/chart/ethereum:0x98a878B1CD98131b271883b390F68d2c90674665).

| Date | Event | apxUSD |
|------|-------|--------|
| Late May 2026 | BTC falls ~30% in a month, ~20% in a week. STRC declines from par to **$90.38** — its largest drawdown on record. | ~$1.00 |
| ~Jun 1–3 | apxUSD trades below NAV; deepest wicks occur overnight while Nasdaq is closed. | **$0.90** |
| Jun 1–5 | Guardian Safe withdraws ~88% of its Curve LP (40,890,164 → <10,000,000 by block [25252968](https://etherscan.io/block/25252968)). | ~$0.90 |
| Jun 8 | Post-mortem published. Partial recovery as redemptions are processed. | ~$0.96 |
| Jun 15 | [Apyx 2.0](https://blog.apyx.fi/apyx-2-0-redemption-value-total-collateralization-evolution-of-the-dividend-backed-dollar/) announced — redemption value and total collateralization model. | ~$0.96 |
| Jun 26–29 | Second leg down; daily low **$0.749** (−25%). | **$0.75** |
| Jul 6 | Guardian Safe's remaining Curve LP goes to 0 (block [25474518](https://etherscan.io/block/25474518)). | ~$0.88 |
| Aug 1 | Discount persists; 8+ weeks without recovery to par. | **$0.881** |

**Root causes** (Apyx's own accounting, in the post-mortem):
1. **Collateral shock** — STRC, the majority of the backing basket, fell to $90.38 as BTC sold off. Apyx notes STRC is ~80% retail-held, which thinned liquidity into the decline.
2. **Overnight/weekend liquidity gap** — the deepest dislocations occurred while US equity markets were closed. The protocol could neither sell STRC nor confidently bid apxUSD without knowing where STRC would open. This is the structural TradFi/DeFi mismatch flagged as an inferred stress path in the prior assessment; it materialized as described.
3. **Transparency dashboard displayed an incorrect NAV** — a bug in the STRCX pricing feed caused the public dashboard to show a *higher* NAV than the team's internal figures. Users transacted against wrong reserve data during the most critical window. Apyx also notes the Accountable dashboard grouped POL and inventory into "Cash & Equivalents," which led external analysts to misread collateral composition.
4. **Operational plumbing** — mint/redeem is manual by design (multisig, time delays, daily caps); the coordination required exceeded what the setup could deliver at the pace of the event.
5. **POL withdrawal** — the Guardian Safe removed the bulk of the only permissionless exit venue during the drawdown (see *Protocol-Owned Liquidity*).

**What held**: Apyx states that the protocol remained solvent throughout and that reserves exceeded the market value of circulating supply. The current Accountable API is retrievable and reports a 92.24% asset-reserve ratio, consistent with redemption below par rather than full dollar backing; it does not retroactively prove every reserve mark during the June event. Independently observable outcomes are narrower: the apyUSD/apxUSD redemption rate did not decline; the unlock window remained active; and the apyUSD/apxUSD Morpho market saw no STRC-driven liquidations because its oracle is the redemption rate rather than spot or DEX price. Apyx also reports that redemptions were processed proportionally across the asset basket.

**Why it has not recovered**: no deep onchain pool remains for arbitrage, direct apxUSD redemption is permissioned and priced at redemption value, and the separate apyUSD exit can take up to 20 days. Apyx 2.0's explicit redemption-value model means the market prices forward STRC drawdown risk into apxUSD rather than treating $1 as a floor. STRC itself traded around **$84 (−16% below par)** by [July 1, 2026](https://blog.apyx.fi/strategy-strc-everyones-wrong-but-were-right/).

### Ethereum apxUSD Supply Distribution

Snapshot at block ~25,660,831 (August 1, 2026), supply ~312.07M:

| Holder | Balance (Aug 1) | % of Supply (Aug 1) |
|--------|------------------|----------------------|
| Guardian/Upgrader Safe (`0xf986…3ce2`) | ~2.54M apxUSD | ~0.8% |
| Curve Pool (apxUSD/USDC) | ~10,742 apxUSD | <0.01% |
| Uniswap V4 PoolManager | ~5.07M apxUSD | ~1.6% |
| apyUSD Vault (`totalAssets`) | ~180.91M apxUSD | ~58.0% |
| Admin Safe (4-of-6) | 0 | 0% |
| Operations Safe | ~1 apxUSD (holds 582,774 STRCX) | <0.01% |
| Third-Party Safe | ~0.65M apxUSD | ~0.2% |
| Other (Pendle, users, bridge/token-pool accounts, etc.) | **TODO — holder-level reconciliation incomplete** | **TODO** |

Notes: the apyUSD vault row is `totalAssets()`, which includes apxUSD held directly by the vault **plus** vested apxUSD claimable from LinearVestV0 — it is not purely a token balance. The Curve pool was drained by the Guardian Safe in two stages: ~88% of the LP between June 1 and June 5, 2026, and the remainder by July 6 (LP balance 40,890,164 → 0).

Base apxUSD totalSupply is ~9,768,204, Base apyUSD totalSupply is ~568,119, and BNB Chain apxUSD supply is ~2.44M as of August 1; these are not included in the Ethereum holder percentages above. The BNB token and Ethereum LockReleaseTokenPool route are verified onchain, but a full cross-chain liability-versus-escrow reconciliation remains **TODO** because Accountable's current `supply_split` itemizes Ethereum only.

## Funds Management

### Minting & Redemption

**Minting apxUSD**: **Permissioned, no onchain collateral required.** Minting creates tokens without any backing asset transfer in the transaction. The `ApxUSD.mint()` function only checks that the caller has the authorized mint role and that `totalSupply` does not exceed `supplyCap` — then calls `_mint(to, amount)`. **No `transferFrom`, no collateral deposit, no onchain proof of backing.** The collateral relationship is offchain and is checked after the fact through Accountable's live feed and Wolf's periodic examination reports rather than enforced atomically at mint.

Minting uses EIP-712 structured data signing via MinterV0 with onchain safeguards including per-order limits, rate limits, execution delay, and nonce-based replay protection.

**Minting roles (verified onchain August 1, 2026):**
- **MinterV0** ([`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e)): Holds `MINT_STRAT_ROLE` (role 1) with **60-second execution delay**, and a newer role 4 (mint path for `mint(address,uint256,uint256)`) with **4-hour execution delay**.
- **Current Admin Safe** ([`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96)): Holds ADMIN_ROLE with 0 execution delay. Because `getRoleGrantDelay(ROLE_MINT_STRAT)` and `getTargetAdminDelay(apxUSD)` are both non-trivial, the admin cannot instantly create a new minter path without running into role-grant or target-admin-delay timelocks (see Governance section).

General users acquire apxUSD through secondary markets (Curve, Uniswap).

**Minting apyUSD**: **Permissionless** -- any user can deposit apxUSD into the ERC-4626 vault to receive apyUSD. No KYB/KYC required (certain jurisdictions restricted via frontend).

**Redeeming apyUSD → apxUSD**: Uses UnlockToken contract with:
1. User requests redemption (exchange rate locks at this point)
2. **Cooldown of up to 20 days** (`UnlockToken.unlockingDelay() = 1,728,000s`; no yield accrual during cooldown)
3. User claims assets after cooldown
- `apyUSD.unlockingFee() = 1e15` (**0.1%**), paid to the [Fee Wallet](https://etherscan.io/address/0x6F93635F2A1C19b4F7f1BD9BA655F6A073C629Dc) and settable by the admin via `setUnlockingFee`. The post-mortem describes the user-facing schedule as a **3-to-20-day window with a fee declining linearly from 3.5% to 0.1%**; only the 0.1% terminal fee is readable onchain, and the declining schedule could not be located in the UnlockToken or apyUSD ABIs — **TODO**: identify where the early-exit fee is computed.
- Adding assets to existing request **resets the cooldown**
- Only one pending request at a time
- `redeemForMinAssets(uint256,uint256,address)` on the current implementation lets a redeemer set a minimum-assets bound, i.e. redemption output is not guaranteed to be a fixed rate at claim time.

**Redemption value (Apyx 2.0)**: Following the June depeg, Apyx [announced a redemption-value and total-collateralization model](https://blog.apyx.fi/apyx-2-0-redemption-value-total-collateralization-evolution-of-the-dividend-backed-dollar/) (June 15, 2026). Redemption is priced off protocol-computed redemption value rather than an implicit $1, which means whitelisted redeemers can be paid **below par** when collateral marks are below par. This is a design change to the exit path and a contributor to why the market prices apxUSD below $1 rather than treating par as a floor. **TODO**: the onchain enforcement point for redemption value was not identified in this review; the mint/redeem path for apxUSD remains permissioned and largely offchain.

### Accessibility

- **apxUSD deposits (into Morpho, Curve, etc.)**: Permissionless
- **apxUSD minting/redemption**: Permissioned (whitelisted entities only)
- **apyUSD deposits**: Permissionless
- **apyUSD redemptions**: Permissionless but subject to the unlock cooldown (up to 20 days) and to the deny list
- **Geographic restrictions**: US, EU, EEA, and sanctioned jurisdictions restricted

### Collateralization

- **Backing**: Offchain preferred shares from publicly-traded DAT companies (STRC, SATA on Nasdaq), plus a documented cash/short-term Treasuries buffer. Although Apyx describes the design as overcollateralized, Accountable's August 3 snapshot reports **92.24% asset-reserve coverage of circulating supply** and a **$0.9131 redemption value**.
- **Collateral quality**: Variable-rate perpetual preferred shares. These are equities (not stablecoins or crypto assets). They sit subordinated to debt obligations in the capital structure. The preferred shares have dividend adjustment mechanisms that theoretically stabilize their price near par value.
- **Cash & equivalents**: Apyx docs state that the backing includes cash and short-term Treasuries as a liquidity/volatility buffer, but do **not** publicly specify the exact instruments, allocation, maturity profile, account type, bank/broker/custodian, or whether any portion is held as bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another cash-equivalent instrument. No CEX custody for this buffer is described in the docs reviewed.
- **Custody**: Docs describe collateral as held in third-party prime brokerage accounts with multi-party MPC key management. The April–June Wolf reports name **Alpaca** as the U.S. brokerage holding offchain STRC/SATA; the bank/custodian for cash and cash-equivalent balances remains unnamed.
- **Onchain verification**: Partial. The bulk of backing remains offchain (STRC and SATA preferred shares held in prime brokerage). The Apyx Operations Safe ([`0x37b0…a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555)) holds **582,774 STRCX** ([`0x1aad…77f3`](https://etherscan.io/token/0x1aad217b8f78dba5e6693460e8470f8b1a3977f3)), the Payward-issued tokenized version of STRC (xStocks line, custodied 1:1 against the underlying preferred shares). This is **~35% of all onchain STRCX supply** and represents the only directly verifiable portion of apxUSD's reserves. **Marking it is no longer straightforward**: at $100 par it covers ~$58M (~19% of the 312.07M supply), but STRC has not traded at par since May — it fell to $90.38 during the June drawdown and was around **$84 (−16%)** by July 1, which puts the same holding nearer **~$49M (~16%)**. The remaining ~84% depends on offchain STRC, SATA, and cash buffer attestations.
- Off-chain verification:
  - **Four downloadable Wolf & Company examination reports** cover March–June 2026. Playwright fetched each current GitBook PDF with HTTP 200 and valid extractable content. Conducted under AICPA attestation standards, the opinions cover asset existence, ownership, custody, and valuation, but not liabilities or overall collateral coverage.
  - Accountable Proof-of-Solvency dashboard launched after the April 19 assessment; Accountable's public API was retrieved through Chromium/Playwright on August 3. It reports `$217.04M` asset reserves against `$235.30M` circulating supply (92.24%), with `verifiability = 100` and Nitro-enclave attestation material.
  - Underlying shares are publicly-traded and priced transparently on Nasdaq — which also means reserve marks move with a volatile equity, as June demonstrated.

### Provability

- **apxUSD backing**: Offchain. The [attestation page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation) publishes four downloadable Wolf & Company examination reports for March–June 2026. The reports were independently fetched and read: they provide reasonable assurance over reported asset existence, ownership, custody, and valuation at two dates per month. They do not test token liabilities or express an opinion on collateral coverage.
- **Reserve reporting failed during the stress event.** Apyx's own post-mortem records that the public transparency dashboard displayed an **inflated NAV** throughout the June drawdown, caused by a bug in the STRCX pricing feed, and that the team's internal admin dashboard carried different, more accurate numbers. The Accountable dashboard separately grouped protocol-owned liquidity and inventory into "Cash & Equivalents," which Apyx says led multiple external analysts to misread collateral composition. The proof-of-reserves surface was wrong precisely when holders most needed it — this is the single strongest argument against treating the reporting stack as reliable.
- **Accountable data verification**: Accountable's DVN registry lists an Apyx/apxUSD Proof-of-Reserves dashboard live since April 23, 2026 (`frequency = live`, `connectors = 3`, registry verification level `4`). The [public API](https://api.accountable.apyx.fi/dashboard) was retrieved through Chromium/Playwright and returned a fresh, internally reconcilable snapshot with `verifiability = 100` plus Nitro-enclave attestation material. This is meaningful transparent verification and clears the critical gate. It does not make the reserve assets onchain or eliminate valuation/model risk, particularly given the June NAV incident and the absence of source-level freshness metadata in the response.
- **apyUSD exchange rate**: Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). The exchange rate is not directly admin-set and does not use the manually-set ApxUSDRateOracle. It is derived from `totalAssets() / totalSupply()`, where `totalAssets()` includes apxUSD held directly by the apyUSD vault plus vested apxUSD available from LinearVestV0. Anyone can verify this onchain. Current rate: **~1.405 apxUSD per apyUSD** (`totalAssets` ~180.91M / `totalSupply` ~128.75M). This rate held through the June drawdown — LinearVestV0 ingests only realized dividends and never references STRC market price, so the ratchet did not reverse. Note that a stable apyUSD/apxUSD rate says nothing about the USD value of apxUSD itself.
- **Yield distribution**: Semi-programmatic. Authorized operators/admins can initiate the amount of apxUSD yield sent into YieldDistributor/LinearVestV0; there is no onchain oracle that independently verifies the offchain dividend amount before it is distributed. Once apxUSD is deposited into LinearVestV0, vesting is programmatic (~17-day linear), and the apyUSD vault pulls vested yield, increasing `totalAssets()` and therefore the ERC-4626 exchange rate. This means the **PPS formula is onchain-verifiable**, but the **correctness of the yield amount relative to real offchain dividends remains trust/attestation-based**.
- **Rate oracle**: The ApxUSDRateOracle is **manually set** by a role-0 caller via `setRate()`. Currently 1.000000. No onchain price feed, no TWAP, no staleness check. **Crucially, `getTargetFunctionRole(oracle, setRate)` is 0 (ADMIN_ROLE) and `getTargetAdminDelay(oracle)` is 0 — the current Admin Safe can change the oracle rate instantly with no timelock.** Used by the Curve StableSwap-NG pool for pricing.
- **Cross-chain supply**: apxUSD and apyUSD trade on Base, and apxUSD is also live on BNB Chain. The Ethereum CCIP LockReleaseTokenPool maps both remote token addresses and escrows canonical apxUSD. This adds a bridge/infrastructure dependency: remote liquidity and cross-chain supply accounting depend on CCIP operation, token-pool/admin configuration, and escrow remaining reconciled to remote supply. Accountable's API currently itemizes Ethereum only in `supply_split`, so full route-by-route reconciliation remains **TODO**.

## Liquidity Risk

### Primary Exit Mechanisms

For the Morpho collateral use case, the relevant question is: how can liquidators exit an apxUSD position?

1. **Curve StableSwap-NG Pool**: apxUSD/USDC pool, **drained** — ~$11.9K nominal TVL. Non-functional as an exit path.
2. **Uniswap V4**: ~5.07M apxUSD sits in the PoolManager singleton. This is the largest observed Ethereum spot venue for apxUSD, but the singleton balance is an upper bound on inventory, **not** executable depth: it aggregates all pools and includes out-of-range concentrated-liquidity positions. Depth at a given slippage is materially lower and was not independently measured in this review.
3. **Direct apxUSD Redemption**: Available only to whitelisted entities and priced at redemption value rather than par (Apyx 2.0). This permissioned/manual primary-market process is distinct from apyUSD's onchain 20-day UnlockToken cooldown; no fixed apxUSD cooldown was verified. It is not a general exit path.
4. **Pendle**: PT-apxUSD positions provide some additional secondary market activity.

### Liquidity Assessment

- **Exit quality is now demonstrated, not modelled.** apxUSD has traded 11–25% below par continuously since early June. Holders wanting out have taken that discount for eight weeks; the discount has not arbitraged away because there is no deep pool to arbitrage into and the redemption path is gated and permissioned.
- **Curve is gone**: ~$29M → ~$11.9K, a 99.96% reduction. The pool [`0xe1b9…a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) holds ~10,742 apxUSD and ~1,108 USDC against an LP `totalSupply` of ~11,701.
- **Supply-to-liquidity**: ~312M supply against ~5.07M of Uniswap V4 inventory is a **~61× ratio** on the most generous reading of depth; the effective ratio is worse.
- **Do not read the Curve virtual price as peg health.** `get_virtual_price()` = 1.0049 is a cumulative fee accumulator, monotonically non-decreasing, and would have kept rising through the entire depeg. Use market price.
- **Morpho context**: effective third-party exit depth for liquidators is critically thin. A liquidator forced to unwind a meaningful apxUSD position onchain today has no venue that can absorb it near par.

### Protocol-Owned Liquidity (POL) Concentration

The concentration risk flagged at the prior assessment materialized, and the timing matters: **the Guardian Safe pulled its liquidity as the peg broke, not after it stabilized.**

Guardian Safe LP balance on the Curve pool, read at block:

| Block | Date | LP balance |
|-------|------|-----------|
| 25200000 | May 29, 2026 | 40,890,163 |
| 25252968 | **Jun 5, 2026** | <10,000,000 |
| 25260000 | Jun 6, 2026 | 4,817,606 |
| 25440000 | Jul 1, 2026 | 4,817,606 |
| 25474518 | Jul 6, 2026 | **0** |

- ~88% of the position was removed between June 1 and June 5 — the same days apxUSD first traded to $0.90 and the post-mortem's "deepest wicks" occurred. The remaining tranche was withdrawn July 6.
- Apyx's post-mortem gives the rationale: with Nasdaq closed the protocol "could not confidently bid apxUSD" without knowing where STRC would open, and defending a price above realizable NAV would have burned cash. That is a coherent treasury decision — but the effect on users is that the only permissionless exit was withdrawn at the moment of maximum need, and the report scores the effect, not the intent.
- The withdrawal required no protocol permission: Curve `remove_liquidity` has no admin gate, no timelock, and no AccessManager involvement. A 3-of-6 Safe transaction was sufficient, and the same is true of any future venue Apyx seeds.
- **Implication for liquidators**: the ~$29M of Curve depth previously cited as a liquidity strength no longer exists and was never third-party depth to begin with. Onchain exit capacity is Uniswap V4 inventory plus whatever Pendle offers. Any future POL should be treated as withdrawable at the issuer's discretion when it is most needed.

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
- **apyUSD implementation history** (`Upgraded(address)` events on the proxy): block 24495109 → `0x1c40…531e`; block 24770480 (Mar 30, 2026, tx [`0xd2d6…6eee`](https://etherscan.io/tx/0xd2d6402c540a482a267fa10a168bd6df8d4b53a9fecde093a40cae66a67f6eee)) → `0x2085…cacf`; block 25124599 (May 18, 2026, tx [`0x064b…d441`](https://etherscan.io/tx/0x064b70ff07a642edf4807731e0c4f69fec509eee3bd6a2d8c013f52e2ad7d441)) → `0x6f4d…3173`; block 25188571 (May 27, 2026, tx [`0x4e5b…696d`](https://etherscan.io/tx/0x4e5b0a6da667cef27e23745f7fd217baa6242b6365ad18b894720cbfb3b4696d)) → current [`0xfd61…b112`](https://etherscan.io/address/0xfd616567ecc1607f61073951a1e822f7315bb112). Four upgrades in ~3.5 months, two of them nine days apart, on a contract holding the majority of circulating apxUSD. Every upgrade routed through the Guardian Safe under the 3-day execution delay — the timelock is functioning as designed, but the cadence means the code holding user funds is not stable.

### Deny List

The canonical apxUSD token, the current apyUSD implementation, and the redemption queue all read the same deny list:

- `apxUSD.denyList()` → [`0x2c271ddF…F6AA`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) (AddressList); the ERC-20 transfer hook rejects transfers involving denied addresses
- `apyUSD.denyList()` → [`0x2c271ddF…F6AA`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) (AddressList)
- `UnlockToken.denyList()` → same AddressList
- All three references are admin-settable via `setDenyList`, and the AddressList is itself governed by the AccessManager

This is a **user-level freeze path across the assessed stablecoin, yield vault, and redemption queue**. A listed address can be prevented from transferring apxUSD and blocked from the apyUSD exit path while its principal remains in the system. List-content changes are not rate-limited or protected by a user-visible timelock. Combined with apyUSD's up-to-20-day unlock cooldown and permissioned apxUSD redemption, this concentrates meaningful transfer and exit discretion in the admin path. No evidence was found that the deny list has been used punitively; the risk is the capability itself.

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
| **STRC (Strategy Inc)** | Majority collateral, single issuer | **Critical** | Concentration in one issuer's preferred stock. STRC's record drawdown to $90.38 in June, and ~$84 by July, transmitted directly into the apxUSD market price |
| **Curve StableSwap-NG** | Former primary liquidity venue | **Low** | Pool drained (~$11.9K TVL). No longer a meaningful exit path |
| **Uniswap V4** | Primary remaining Ethereum spot venue | **High** | Largest observed Ethereum spot inventory for non-whitelisted users (~5.07M apxUSD), but singleton balances overstate executable depth |
| **Gnosis Safe** | Multisig infrastructure | **High** | All governance actions flow through Safe multisigs |
| **Ethereum L1 + CCIP** | Canonical settlement and cross-chain transport | **High** | Canonical apxUSD and escrow are on Ethereum; Base and BNB Chain representations depend on CCIP route and pool configuration |

**Key dependency risk**: The protocol has a **critical dependency on offchain assets and custody** that cannot be verified onchain, concentrated in a single issuer's preferred stock. The rate oracle is manually set with no automated price feed or fallback mechanism. Ethereum spot liquidity is concentrated in Uniswap V4 after Apyx withdrew its Curve POL; remote supply adds CCIP and cross-chain reconciliation risk.

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
  - **Alert**: If supply increases by >5M in 24 hours (supply ~312M against a 750M cap; unbacked mint is a top-tier risk here, so the threshold stays tight while supply is contracting)
  - Monitor `Transfer` events for large movements (>$500K)
  - Monitor `Paused`/`Unpaused` events
  - Monitor mints (`Transfer` with `from = 0x0`) and **track the destination**. **Alert (Critical)**: if a mint destination is anything other than the documented pass-through [`0xcca1af4d`](https://etherscan.io/address/0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8), or if the pass-through forwards anywhere other than the Guardian Safe.
  - Monitor burns (`Transfer` with `to = 0x0`) — the redemption pipeline now settles onchain, so burn volume is a usable proxy for redemption pressure.

### Peg Monitoring

apxUSD is currently depegged; these are the primary user-impact signals.

- **Market price** (CoinGecko / DefiLlama / GeckoTerminal, not Curve `get_virtual_price()` — see *Liquidity Assessment*)
  - **Alert (Critical)**: price below $0.97 (currently breached at $0.881)
  - **Alert (Critical)**: any further leg down >3% in 24 hours
  - **Alert**: recovery above $0.99 sustained for 7 days — this is the signal that would justify an upward reassessment
- **STRC and SATA market prices** — collateral marks transmit directly into apxUSD. Track distance from $100 par (STRC ~$84 as of July 1).
- **Overnight and weekend windows**: the deepest June dislocations occurred while Nasdaq was closed and STRC marks were stale. Monitor apxUSD price, Uniswap V4 inventory, and Accountable price timestamps through weekends and US market holidays until Apyx's stated overnight-liquidity arrangements are verifiable onchain.
- **Public NAV vs. onchain reality**: the June incident was a pricing-feed bug that inflated the published NAV. Cross-check the Accountable/transparency dashboard NAV against independently computed STRCX marks rather than trusting the published figure.

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

### Liquidity Venue Monitoring

- **Curve Pool**: [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)
  - Pool holds ~$11.9K. Monitor for LP redeployment or new liquidity inflows — a rebuild here is a positive signal worth catching early.
  - Monitor the pool balance ratio (apxUSD vs USDC sides) for directional pressure. Do **not** alert on `get_virtual_price()`; it is a fee accumulator and cannot detect a depeg.
  - **Alert**: if the Guardian Safe adds LP to this pool or seeds any new venue
- **Uniswap V4 PoolManager** — the only remaining onchain venue:
  - Monitor [`0x000000000004444c5dc75cb358380d2e3de08a90`](https://etherscan.io/address/0x000000000004444c5dc75cb358380d2e3de08a90) apxUSD balance (~5.07M tokens)
  - **Alert (Critical)**: if the PoolManager apxUSD balance drops below **2.5M tokens** (~50% of current inventory). Note this is a token balance, not a USD figure, and it overstates executable depth.
  - **Alert (High)**: any large apxUSD withdrawal from the PoolManager attributable to the Guardian Safe — this is the same action that removed the Curve exit in June

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

- Monitor Guardian/Upgrader Safe (`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`) balance and movements (apxUSD, apyUSD, USDC, and LP tokens of any venue)
- Monitor Operations Safe (`0x37B0779A66edc491df83e59a56D485835323a555`) **STRCX balance** — the only directly-onchain-verifiable portion of apxUSD backing (582,774 STRCX, ~$49–58M depending on STRC's distance from par)
  - **Alert (Critical)**: Any STRCX transfer out of the Operations Safe, especially to non-Apyx counterparties (would represent a reduction in onchain reserves)
  - **Alert (High)**: STRCX balance drops by >5% in 24 hours
- Monitor Third-Party Safe (`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`) balance
- Monitor MinterV0 for mint execution events
- Monitor the AddressList (`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`) for deny-list additions — a listed address can be blocked from transferring apxUSD and from the apyUSD exit path
- **Alert**: If apxUSD `supplyCap` changes from current 750M

### Accountable Proof-of-Reserves Monitoring

- **Dashboard**: [`https://accountable.apyx.fi/`](https://accountable.apyx.fi/)
- **Public JSON API**: [`https://api.accountable.apyx.fi/dashboard`](https://api.accountable.apyx.fi/dashboard). Fetch this endpoint directly or through a browser context; the frontend host's `/dashboard` route is not the JSON endpoint.
- **Registry entry**: [`https://dvn.accountable.capital/v1/stats`](https://dvn.accountable.capital/v1/stats) should continue to list `name = apyx`, `ticker = apxUSD`, `frequency = live`, `connectors = 3`, and `verifiability = 4`.
- **Alert**: If the Accountable dashboard/API becomes unavailable, stale, degraded, or removed from the DVN registry.
- **Alert**: If connector count or verifiability level decreases.
- **Ratio calculation**: Recompute asset coverage from `(STRC + Cash & Equivalents + Other) / (total_supply - inventory - pol)` rather than trusting the rounded `collateralization` field. August 3 baseline: `217,035,429.31 / 235,301,450.21 = 92.2372%`.
- **Alert (Critical)**: Coverage below 100% on two consecutive newer reports; **Alert (High)** below 105% or on a material shift toward less liquid/non-public assets. Re-polling the same `ts` must not confirm a critical condition.

### Chainlink CCIP / Base / BNB Chain Monitoring

- **Base apxUSD**: [`0xd993935e13851dd7517af10687ec7e5022127228`](https://basescan.org/address/0xd993935e13851dd7517af10687ec7e5022127228)
- **Base apyUSD**: [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://basescan.org/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa)
- **BNB Chain apxUSD**: [`0x6b3788fd6604bbf03c5378d24e57bb334baad4af`](https://bscscan.com/token/0x6b3788fd6604bbf03c5378d24e57bb334baad4af)
- **Ethereum LockReleaseTokenPool**: [`0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5`](https://etherscan.io/address/0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5)
- Monitor Chainlink CCIP status for Ethereum/Base and Ethereum/BNB routes, remote token supply, token-pool configuration, remote-token mappings, and escrow-versus-remote-supply reconciliation.
- **Alert**: If either route is paused, rate-limited, reconfigured, or if Base/BNB supply changes without a matching lock/release accounting path.

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| **apxUSD market price / peg** | Real-time | **Critical** |
| Rate oracle changes | Real-time | Critical |
| Proxy upgrade events | Real-time | Critical |
| **Uniswap V4 PoolManager apxUSD inventory** | Real-time | **Critical** |
| **Guardian Safe LP token balance** (POL withdrawal or redeployment) | Real-time | **Critical** |
| **Operations Safe STRCX balance** (onchain reserves) | Real-time | **Critical** |
| **Mint pass-through 0xcca1af4d outflow destination** | Real-time | **Critical** |
| Accountable PoR dashboard freshness / registry status | Real-time | Critical |
| Chainlink CCIP / Base + BNB supply reconciliation | Real-time | Critical |
| AccessManager role changes | Real-time | Critical |
| Admin Safe transactions | Real-time | Critical |
| Guardian Safe transactions (Safe-level) | Real-time | Critical |
| STRC / SATA distance from par | Daily (market hours) | High |
| Deny-list additions (AddressList) | Real-time | High |
| Curve pool balance ratio | Every 6 hours | High |
| apxUSD supply changes | Every 6 hours | High |
| apxUSD `supplyCap` increases | Real-time | High |
| Large holder movements | Daily | Medium |

## Risk Summary

### Key Strengths

- **Publicly-traded collateral**: Underlying preferred shares (STRC, SATA) are Nasdaq-listed with transparent pricing, dividend policies, and regulatory oversight.
- **Three reputable audits**: Quantstamp, Zellic, and Certora audits all completed and publicly published with remediation evidence in the repo.
- **Four independently readable examination reports**: Wolf & Company reports covering March–June 2026 are downloadable and provide reasonable assurance under AICPA attestation standards over asset existence, ownership, custody, and valuation. This confirms the monthly cadence through June and names Alpaca as the brokerage holding offchain STRC/SATA in the April–June reports.
- **Live third-party reserve verification**: Accountable's public API returned a fresh, internally reconcilable snapshot with 100% dashboard verifiability and Nitro-enclave attestation material. It independently exposes both the present 92.24% coverage shortfall and reserve composition rather than requiring reliance on Apyx's solvency claim.
- **Structural safeguards worked as designed under stress**: the unlock window prevented a bank run, and the apyUSD/apxUSD Morpho market saw zero liquidations from the STRC move because its oracle is the redemption rate rather than spot price.
- **Credible incident response**: a detailed, self-critical post-mortem was published within days, naming the NAV feed bug and the operational shortfalls explicitly rather than attributing the depeg solely to market conditions.
- **Accountable Proof-of-Reserves integration**: Accountable's public DVN registry lists Apyx/apxUSD as a live proof-of-reserves integration since April 23, 2026, and its dashboard/API are publicly retrievable, adding third-party between-attestation visibility into supply, reserves, and collateral coverage.
- **Onchain timelocks on core admin functions**: 3-day execution delay on apxUSD/apyUSD proxy upgrades (via role 24), 7-day role-grant delay for ADMIN_ROLE and role 24, 5-day `minSetback` on delay reductions, 3-day `targetAdminDelay` on core contracts, 4-hour unpause delay.
- **Governance separation**: Proxy upgrades now require the Guardian/Upgrader 3-of-6 Safe (not the current 4-of-6 Admin Safe); pauser and upgrader are operationally separated from day-to-day admin.
- **Admin Safe threshold at 4-of-6**.
- **Onchain burn path active**: the ~212M supply contraction from peak settled through `burn`/`burnFrom` calls, so redemption pressure is now observable onchain rather than exclusively offchain.
- **Partial onchain backing visibility**: Apyx Operations Safe holds 582,774 STRCX (~35% of all STRCX onchain supply), covering ~16–19% of supply depending on STRC's distance from par.
- **Open-source code**: Full Foundry project with invariant tests and Slither CI.
- **Public, credentialed team**: Six named founding contributors with verifiable backgrounds at Kraken, Goldman Sachs, Binance, and DeFi Development Corp.

### Key Risks

- **Sustained depeg**: apxUSD has traded below par since early June 2026, bottoming at ~$0.75 and sitting at $0.881 on August 1. Eight weeks without recovery indicates the discount reflects a repriced view of the collateral and exit mechanics, not a transient dislocation.
- **BTC/DAT stress sensitivity (realized)**: the preferred-share collateral is issued by Digital Asset Treasury companies whose market value tracks BTC. A ~30% BTC drawdown transmitted straight through STRC into the apxUSD market price. This was flagged as an inferred stress path at the prior assessment and has now been observed end-to-end.
- **Weekend/overnight market-gap risk (realized)**: the deepest dislocations occurred while Nasdaq was closed and STRC marks were stale. Apyx describes overnight liquidity arrangements and possible STRCX-based onchain sales as mitigations; neither is verifiable onchain yet.
- **Current reserve coverage is below par**: Accountable reports `$217.04M` asset reserves against `$235.30M` circulating supply (92.24%) and a `$0.9131` redemption value. The Wolf opinions confirm historical asset balances but do not attest liabilities or overall coverage; no July opinion is currently listed, and cash-account custody remains unnamed.
- **Reserve reporting failed during the incident**: the public NAV was inflated by a pricing-feed bug for the duration of the drawdown, and Accountable's earlier asset bucketing misled analysts. The live API is now retrievable and separates STRC, POL, cash/equivalents, inventory, and other reserves, but it does not expose source-level timestamps or the off-hours marking method.
- **Rate Oracle retains zero-delay admin control**: the 4-of-6 Admin Safe can upgrade the Rate Oracle proxy or call `setRate()` instantly.
- **Unbacked-mint design**: `ApxUSD.mint()` creates tokens without any onchain collateral transfer — backing is verified only offchain via attestations.
- **Admin freeze path across transfers and the exit**: the deny list is wired into apxUSD, apyUSD, and the UnlockToken redemption queue; apxUSD redemption is permissioned and priced at redemption value rather than par.
- **Upgrade cadence**: four apyUSD implementations in ~3.5 months, two of them nine days apart, on the contract holding the majority of circulating apxUSD.
- **Issuer concentration**: the collateral basket is majority STRC, a single issuer's preferred stock, itself ~16% below par as of July 1.
- **CCIP / remote-chain dependency**: apxUSD is live on Base and BNB Chain, while apyUSD is live on Base; remote supply depends on the Ethereum LockReleaseTokenPool and route configuration.
- **Young protocol**: ~164 days in production, with its only stress test resulting in an unrecovered depeg.
- **DFDV concentration**: all six founding contributors are executives at DeFi Development Corp. (Nasdaq: DFDV), which is also the protocol's first institutional investor. BVI legal entity with $100 liability cap.
- **No bug bounty program**: notable absence for a protocol with >$300M Ethereum apxUSD supply.

### Critical Risks

- **No functioning Ethereum exit at par for a meaningful position**: Uniswap V4 has ~5.07M tokens of singleton inventory against ~312M Ethereum supply, Curve is drained, and holders have taken a 12–25% discount to exit. Small remote-chain pools do not provide enough depth to change the Ethereum liquidator outcome. Whitelisted apxUSD redemption is a separate permissioned/manual path priced at redemption value; the 20-day UnlockToken cooldown applies to apyUSD, not apxUSD.
- **Rate oracle manipulation (no timelock)**: the Admin Safe can upgrade the ApxUSDRateOracle implementation and call `setRate()` with zero delay. No staleness check or bounds validation exists onchain.
- **Documented reserve shortfall and valuation risk**: Accountable currently reports only 92.24% asset-reserve coverage of circulating supply. The preferred-share marks remain exposed to equity volatility and off-hours valuation gaps; the June NAV bug shows that even a live reserve-reporting surface can be wrong during the conditions that matter.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **Unverified contract source** -- Assessed proxies and current implementations are source-verified on public explorers. **PASS**
- [x] **No audit** -- Three reputable audits confirmed: Quantstamp (Feb 2026), Zellic (Mar 2026), Certora (Mar 2026). All publicly published. **PASS**
- [x] **Unverifiable reserves** -- The [Accountable dashboard](https://accountable.apyx.fi/) and [public API](https://api.accountable.apyx.fi/dashboard) were retrieved through Chromium/Playwright on August 3, 2026. The fresh response exposes reserve composition, supply, a 92.24% collateral ratio, `verifiability = 100`, and Nitro-enclave attestation material. Four Wolf & Company examination reports were also independently fetched and read; they cover March–June asset existence, ownership, custody, and valuation. The historical NAV bug, asset-only opinion scope, and remaining valuation/cash-custody limitations stay category risks, but reserves are verifiable through transparent third-party evidence. **PASS**
- [x] **Total centralization** -- 4-of-6 Gnosis Safe for ADMIN_ROLE, 3-of-6 Safe for pause/upgrade. Not a single EOA. **PASS**

**All critical gates pass.** Proceeding to category scoring; the current reserve shortfall and remaining transparency limitations are reflected in Funds Management rather than a gate override.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 confirmed audits from reputable firms (Quantstamp, Zellic, Certora), all publicly published with remediation evidence. Certora identified 14 findings (1 High, fixed).
- **Bug Bounty**: None found.
- **Time in Production**: ~164 days.
- **TVL**: ~312.07M Ethereum apxUSD supply (cap 750M), plus ~9.77M Base and ~2.44M BNB Chain apxUSD supply. Listed on CoinGecko.
- **Incidents**: **One material incident.** The June 2026 depeg — apxUSD to $0.90, then a daily low of $0.749, and $0.881 at eight weeks. No exploit, realized custody loss, or smart-contract failure was identified, but the current Accountable snapshot reports only 92.24% asset-reserve coverage of circulating supply. A stablecoin that has not traded at par in two months is a track-record fact, not a liquidity footnote. Response was strong: a self-critical post-mortem within days, proportional redemptions, and structural safeguards (unlock window, rate ratchet, redemption-rate oracle on Morpho) that all performed as designed.

**Audits subcategory: ~3** — three top-firm audits with public remediation evidence would score 1 on coverage alone, pulled toward the middle of the range by the complete absence of a bug bounty at >$300M supply.

**Historical Track Record subcategory: ~5** — the rubric's 3–6 month production band already implies 4, and the protocol's single stress test produced an unrecovered depeg. Scale (>$100M) argues the other way, but the incident dominates.

**Score: 4.0/5** — `(3 + 5) / 2`. Raised from 3.5. The code and audit posture are unchanged and remain a genuine strength; what changed is that this protocol now has a track record, and the track record includes a two-month depeg. Incident response was materially better than the incident, which is why this is 4.0 rather than higher.

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
- **High**: Uniswap V4 — the primary remaining Ethereum spot venue
- **Medium**: Gnosis Safe infrastructure

**Dependencies Score: 4.0** -- Critical dependency on offchain assets and custody that cannot be verified onchain, concentrated in a single issuer's preferred stock. No fallback mechanism if custody providers fail. The oracle has no automated price feed. Ethereum spot liquidity is concentrated in Uniswap V4 after issuer-owned Curve liquidity was withdrawn, while remote supply adds CCIP route and escrow-reconciliation dependencies.

**Centralization Score = (3.0 + 3.5 + 4.0) / 3 = 3.5**

**Score: 3.5/5** -- Held at 3.5. Timelocks on core upgrades and role grants remain a material strength, and every role assignment, delay, and threshold verified this period is unchanged. Two facts push against holding: the deny list is wired into apxUSD transfers, apyUSD, and the redemption queue, while Apyx 2.0 prices redemption at protocol-computed redemption value rather than par. These capabilities would support Programmability 4.0 — `(3.0 + 4.0 + 4.0) / 3 = 3.67` — but no punitive deny-list use was observed and the redemption-value enforcement point was not located onchain. Held at 3.5 pending operational evidence; see *Reassessment Triggers*.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Offchain backing by publicly-traded preferred shares (Nasdaq-listed)
- Cash/short-term Treasuries buffer documented, but exact instruments, location, custodian, and maturity profile are undisclosed
- Accountable currently reports 92.24% asset-reserve coverage of circulating supply and a $0.9131 redemption value; the protocol is therefore not dollar-overcollateralized under the dashboard's current methodology
- Offchain STRC/SATA held with Alpaca per the April–June Wolf reports; self-custodied STRCx held onchain. Cash-account custodian remains unnamed; Apyx documents multi-party MPC key management
- Partial onchain verification via Apyx Operations Safe's 582,774 STRCX holding — ~$58M at $100 par, ~$49M at STRC's July level, i.e. ~16–19% of the 312M supply. Bulk of backing remains offchain.
- Reserve is equity (not stablecoins) — **and the volatility is no longer theoretical**: STRC posted its largest-ever drawdown from par in June, reaching $90.38, and was around $84 by July 1.
- Collateral is concentrated in a single issuer (majority STRC).
- Four downloadable Wolf & Company AICPA examination reports cover March–June 2026; each was independently fetched and read.
- Accountable Proof-of-Reserves dashboard/API live since April 23, 2026; independently retrieved through Chromium/Playwright on August 3 with a fresh timestamp, `verifiability = 100`, and Nitro-enclave attestation material.

**Collateralization Score: 4.0** — Raised from 3.5. Accountable now makes the present condition observable rather than assumed: `$217.04M` of asset reserves cover `$235.30M` of circulating supply (92.24%), with redemption value `$0.9131`. That fits the rubric's partially collateralized band. The collateral also demonstrated equity-like drawdown and remains concentrated in one issuer. Alpaca being named as the STRC/SATA brokerage improves custody transparency, but it does not restore dollar coverage; cash custody remains unnamed.

**Subcategory B: Provability**

- apyUSD exchange rate: onchain (ERC-4626)
- apxUSD collateral: offchain. Four Wolf & Company examination reports on the [attestation page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation) cover March–June 2026 and are independently downloadable. The reports provide reasonable assurance over asset existence, ownership, custody, and valuation at two dates per month; they do not opine on liabilities or collateral coverage.
- **Reserve reporting was wrong during the June drawdown**: the public transparency dashboard displayed an inflated NAV for the duration of the event due to an STRCX pricing-feed bug, diverging from the team's internal figures, and the Accountable dashboard grouped POL and inventory into "Cash & Equivalents" in a way Apyx says misled external analysts.
- Accountable data verification: live proof-of-reserves integration listed in the DVN registry (`frequency = live`, `connectors = 3`, verification level `4`) since April 23, 2026. Its public API was independently extracted through Chromium/Playwright and returned an internally reconcilable snapshot, `verifiability = 100`, and Nitro-enclave attestation material. Pricing methodology for offchain STRC/SATA marks, especially outside Nasdaq market hours, is still not independently established — and this is exactly where the June failure occurred.
- Onchain backing visibility: 582,774 STRCX in the Operations Safe (~16–19% of supply) is directly verifiable; the remainder depends on offchain custody.
- Rate oracle: manually set, no third-party verification.
- Onchain supply history: the ~212M contraction from peak settled through `burn`/`burnFrom` calls, so redemption pressure is now observable onchain — a genuine improvement over the previously mints-only picture.

**Provability Score: 3.0** — Improved from 4.25. This now matches the rubric's periodic-custodian-attestation anchor: four readable independent examination reports verify historical asset assertions, identify Alpaca for the offchain securities, and are complemented by a fresh, internally reconcilable Accountable API with enclave-attestation material. It does not score below 3 because the assets remain primarily offchain, the Wolf opinions do not test liabilities or collateral coverage, Accountable omits source-level freshness, cash custody remains unnamed, and the public NAV was wrong during the June event.

**Funds Management Score = (4.0 + 3.0) / 2 = 3.5**

**Score: 3.5/5** — Lowered from 3.875 because both evidence paths are now independently inspectable: Accountable provides current coverage and four Wolf examination reports verify historical asset assertions. That improvement is offset by direct evidence that asset reserves currently cover only 92.24% of circulating supply. Holders remain exposed to preferred-share losses, offchain custody, and valuation/reporting errors, but those risks are materially more provable than previously assessed.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: no direct redemption for general holders. apxUSD redemption is whitelisted, manual, and priced at redemption value rather than par. The up-to-20-day UnlockToken cooldown applies to apyUSD→apxUSD redemption, not to apxUSD itself. Rubric band **4** ("withdrawal queues or restrictions"), bordering 5.
- **Depth**: Curve holds ~$11.9K. Uniswap V4 PoolManager holds ~5.07M apxUSD of *inventory*, which overstates executable depth (singleton across pools, includes out-of-range positions). Realistic depth at <3% slippage sits in rubric band **4** (`<$1M, >3% slippage`), not band 3.
- **Large-holder impact**: observed rather than modelled. Holders exiting since early June have taken an 11–25% haircut, and eight weeks on the discount has not arbitraged away. This is the band **5** anchor ("cannot exit without massive losses").
- **Supply-to-liquidity ratio**: ~312M supply against ~5.07M of V4 inventory is **~61×** on the most generous reading.
- **Modifiers**: the rubric's "maintained liquidity during major drawdowns: −0.5" does **not** apply — the opposite occurred, with ~88% of POL withdrawn in the first week of the depeg. The `+0.5` throttle modifier is **not** applied: the fixed 20-day cooldown belongs to apyUSD, while no fixed cooldown was verified for the assessed apxUSD token. Permissioning is already reflected in the exit-mechanism band.

**Score: 4.5/5** — Raised from 4.0. The three rubric dimensions average to 4.5: restrictions and permissioning are severe, observed exits incurred double-digit losses, and Ethereum depth is critically thin. The score is not raised to 5.0 by apyUSD's cooldown because that mechanism does not apply to an apxUSD holder or Morpho liquidator. Reassess if a fixed apxUSD redemption delay is verified, a durable third-party venue appears, or redemption opens beyond the whitelist.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Public. Six named founding contributors with verifiable backgrounds (Kraken, Goldman Sachs, Binance, DFDV). Strong institutional credibility via Nasdaq-listed DFDV.
- **Documentation**: Minimal. Main docs and FAQ functional. Audits page lists all three reports with links.
- **Legal Structure**: BVI entity, US/EU/EEA geo-blocked.
- **Incident Response**: No formal published plan, but a real test: a detailed post-mortem within days of the June event, naming the NAV feed bug, delayed communications, and operational shortfalls explicitly. Admin can pause immediately.
- **Operational limits exposed in June**: Apyx states its manual mint/redeem process — multisig coordination across signers and time zones, brokerage sales, wires, USDC conversion, pool deployment — could not keep pace with the event. The manual design is deliberate (anti-inflation safeguards) but is a documented throughput constraint under stress.
- **Code Availability**: Verified on Etherscan and open-sourced on GitHub ([`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts)). Full Foundry project with 60+ test files, invariant tests, and Slither CI. No license specified.

**Score: 3/5** — Held at 3.0. Public, well-credentialed team; open-source code with comprehensive tests; docs remain minimal on the "Cash & Equivalents" composition. The June event cuts both ways and nets flat: the transparency dashboard shipped a wrong NAV and Apyx concedes communications were inadequate and operational plumbing under-scaled, but the post-mortem was fast, specific, and self-critical — better disclosure practice than most protocols manage after a depeg.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 4.0 | 20% | 0.80 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 4.5 | 15% | 0.675 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.725/5.0 (~3.73)** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |
| **N/A** | **Not Rated** | Terminal — do not use (exploited or wound down) |

**Final Risk Tier: Elevated Risk — Limited approval, strict limits**

> The final score is 3.73 (Elevated), driven by the June 2026 depeg, current 92.24% Accountable collateral ratio, and collapse of Ethereum exit capacity. The transparent Accountable feed and four readable Wolf examination reports clear the unverifiable-reserves gate and improve Provability; the current shortfall remains reflected directly in Collateralization.

---

Apyx's apxUSD is a novel "Dividend-Backed Stablecoin" bridging offchain corporate dividends into onchain yield. The governance architecture built after the March 20–21 restructure is sound and verified intact: role assignments, multi-day upgrade timelocks, role-grant delays, and multisig thresholds are all unchanged this period, and every apyUSD upgrade routed correctly through the Guardian Safe's 3-day delay.

What the June 2026 stress test showed is that the governance was never the binding constraint. A record STRC drawdown transmitted directly into the apxUSD market price; the deepest dislocations landed overnight while Nasdaq was closed and collateral marks were stale; the public NAV dashboard was displaying inflated numbers throughout; and the Guardian Safe withdrew the bulk of the only permissionless Ethereum exit venue in the same week. The apyUSD ratchet and absence of Morpho liquidations are observable onchain. Accountable now makes the reserve position independently inspectable and reports 92.24% asset-reserve coverage, consistent with redemption below par rather than a dollar-solvent stablecoin. apxUSD has not traded at par since, and at eight weeks the discount is a repricing rather than a dislocation.

**Residual concerns underlying the 3.73 score:**
- **Sustained depeg.** apxUSD at $0.881 (−11.9%), below par continuously since early June, low of ~$0.75. Not recovering on its own without a deeper venue or an open redemption path.
- **No meaningful Ethereum exit at par.** Curve is drained (~$11.9K); Uniswap V4 inventory is ~5.07M tokens against ~312M supply (~61×) and overstates executable depth. Whitelisted apxUSD redemption is manual and priced at redemption value, not $1; the 20-day cooldown applies only when exiting apyUSD.
- **POL is withdrawable at the issuer's discretion, and was withdrawn under stress.** No admin gate, no timelock — a 3-of-6 Safe transaction. Any future venue Apyx seeds carries the same property.
- **Collateral is a single volatile issuer.** Majority STRC, which reached $90.38 in June and ~$84 by July 1. Reserve marks move with an equity, not a cash instrument.
- **Reserve coverage is currently below par.** Accountable reports 92.24% asset-reserve coverage and a $0.9131 redemption value. Reserve reporting also failed during the June stress event. The Wolf reports are now readable, but they attest assets only—not liabilities or overall coverage—and the latest covers June 30.
- **Rate Oracle has no timelock.** ADMIN_ROLE can upgrade the oracle and call `setRate()` with zero delay. Unmitigated since first flagged.
- **Admin discretion over transfers and the exit.** The deny list is wired into apxUSD, apyUSD, and the redemption queue; apxUSD redemption is permissioned and uses redemption-value pricing.
- **Cross-chain reconciliation remains incomplete.** Base and BNB Chain supplies depend on Ethereum CCIP escrow, while Accountable's `supply_split` currently itemizes only Ethereum.
- **Custody disclosure remains incomplete.** Alpaca is named for the offchain STRC/SATA holdings, but the cash-account custodian and detailed cash-equivalent instruments remain undisclosed.
- **Upgrade cadence**: four apyUSD implementations in ~3.5 months on the contract holding the majority of circulating apxUSD.
- **No bug bounty program** at >$300M Ethereum apxUSD supply.

**Conditions for continued or increased exposure**, roughly in order of how much each would move the score:

1. **Restore a credible onchain exit.** Third-party liquidity that Apyx cannot unilaterally withdraw, deep enough to absorb a meaningful position near par. Protocol-owned liquidity does not satisfy this — June demonstrated why.
2. **Peg recovery.** apxUSD sustained above $0.99 for 30 days, without that recovery depending on Apyx seeding the venue it is quoted on.
3. **Add a non-zero execution delay or target-admin-delay to the Rate Oracle** (`ApxUSDRateOracle`) so `setRate()` and `upgradeToAndCall` cannot execute instantly.
4. **Continue the examination-report cadence** and publish the July report with stable direct links. Extend the scope to reconcile liabilities and collateral coverage, not only asset balances.
5. **Complete the transparency-stack remediation**: publish the NAV pricing methodology (including how STRC/SATA are marked outside Nasdaq hours), expose source-level freshness in the Accountable API, and keep POL/inventory separated from asset reserves.
6. **Complete custody disclosure** by naming the bank/custodian and account structure for cash and cash equivalents; Alpaca is already identified for STRC/SATA.
7. **Include the collateral ratio and liability reconciliation in the monthly examination report**, complementing Accountable's live calculation.
8. **Disclose the cash/short-term Treasuries buffer composition** — custody location, account type, instrument type, maturity/WAM, and whether any portion is bank cash, brokerage sweep cash, money-market exposure, or Treasury bills/notes.
9. **Deliver the overnight-liquidity mitigations** described in the post-mortem (market-maker arrangements, STRCX-based onchain sales outside market hours) in a form outside reviewers can verify.
10. **Launch a bug bounty program** (Immunefi / Cantina / Safe Harbor).

**Monitoring priorities:**
- **apxUSD market price** — the primary user-impact signal while the depeg persists. Not the Curve virtual price.
- Rate oracle for any `RateUpdated` event (currently 1.0).
- Admin Safe (4-of-6) and Guardian/Upgrader Safe (3-of-6) for any ownership/threshold changes or role grant/revoke events.
- Scheduled operations in AccessManager (`OperationScheduled` event) — any pending upgrade should trigger review during the delay window.
- Accountable PoR dashboard freshness, coverage ratio, connector count, and verifiability level.
- Chainlink CCIP Ethereum/Base and Ethereum/BNB route status, remote token supply, and cross-chain escrow reconciliation.
- Uniswap V4 PoolManager apxUSD balance — this is now the primary onchain liquidity venue.
- Guardian Safe LP token and apxUSD movements — any redeployment of POL into new venues should be monitored.
- STRC/SATA market prices and distance from par, especially during sharp BTC drawdowns.
- **Weekend and holiday windows** where STRC/SATA marks are stale and apxUSD keeps trading — the mechanism behind June's deepest wicks.
- Operations Safe STRCX balance (582,774, ~35% of STRCX supply) — continued decline would reduce onchain visibility.
- Monthly Wolf examination-report cadence, link availability, scope, and whether the July report is published.
- Curve pool balance ratio (not virtual price) for directional pressure.

---

## Reassessment Triggers

- **Peg-based**: Reassess **upward** if apxUSD sustains above $0.99 for 30 days without Apyx-seeded liquidity being the venue of record. Reassess **downward** on any new leg below $0.75, or if the discount widens past 15% for a sustained period.
- **Attestation cadence**: Reassess when the July 2026 Wolf examination report is published. Also reassess if reports stop appearing, links break, the engagement standard or scope changes, or an opinion begins reconciling liabilities and collateral coverage in addition to assets.
- **Redemption mechanics**: Reassess if the Apyx 2.0 redemption-value calculation is enforced onchain in an identifiable contract, if the deny list is used against a non-sanctions counterparty, if `setUnlockingFee` or `unlockingDelay` change, or if apxUSD redemption is opened beyond the whitelist. The first three would support raising Programmability from 3.5 to 4.0; the last would be a material improvement to Liquidity.
- **Accountable verification**: Reassess if the dashboard/API becomes unavailable or stale, the collateral ratio crosses a material threshold, Accountable removes or downgrades the Apyx registry entry, connector count decreases, or verifiability level decreases.
- **Cross-chain / CCIP**: Reassess if Chainlink CCIP Ethereum/Base or Ethereum/BNB transfers are paused or impaired, token-pool/admin configuration changes materially, remote apxUSD/apyUSD supply diverges from Ethereum escrow accounting, or Apyx migrates to a different bridge provider.
- **Governance-based**: Reassess on any ownership/threshold change to either multisig, any change to `targetAdminDelay` or `roleGrantDelay` on AccessManager, any rate-oracle change (upgrade or `setRate`), or any further apxUSD/apyUSD implementation upgrades.
- **Time-based**: Reassess in 1 month (early September 2026).
- **Supply/TVL-based**: Ethereum supply is ~312.07M. Reassess if it exceeds 500M again (toward the 750M cap), if the supply cap changes, if Base or BNB Chain apxUSD supply grows materially without clear CCIP escrow reconciliation, or if the Uniswap V4 PoolManager apxUSD balance drops below 2.5M tokens.
- **Liquidity-based**: Reassess if a durable third-party venue appears (the condition that would most improve the Liquidity score), if Curve TVL recovers above $1M, if Apyx launches a new primary pool, or if Uniswap V4 apxUSD inventory falls materially.
- **POL movement-based**: Reassess if the Guardian/Upgrader Safe deploys LP into any new or existing venue — and treat any such deployment as withdrawable, per June.
- **Collateral-based**: Reassess if STRC or SATA moves more than 10% further from par, if issuer dividend policy changes, or if basket composition shifts materially between issuers.
- **Market-stress based**: Reassess if BTC falls >10% in 1 hour or >20% in 24 hours and STRC/SATA prices, Accountable collateral coverage, or apxUSD peg quality deteriorate. Reassess urgently if this happens over a weekend/holiday while STRC/SATA marks are stale and apxUSD sells off before Nasdaq trading reopens — this is the exact sequence that produced the June depeg.
- **Incident-based**: Reassess after any exploit, unplanned oracle change, or any further NAV/reserve-reporting error.
- **Bug bounty**: Reassess if a bug bounty program is launched.

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [March 26, 2026](https://github.com/yearn/risk-score/pull/110) | 5.0 (Gated) | Initial assessment. Failed Critical Risk Gates (no audit, unverifiable reserves, total centralization). |
| [April 19, 2026](https://github.com/yearn/risk-score/pull/140) | 3.5 | All critical gates cleared after governance restructure and attestation publication. Supply ~175M. |
| [May 29, 2026](https://github.com/yearn/risk-score/pull/227) | 3.66 | Tier raised to Elevated Risk. POL concentration (99.96% Curve LP), supply growth outpacing attestation (524M vs 67M attested). |
| [August 1, 2026](https://github.com/yearn/risk-score/pull/373) | 3.73 | June 2026 depeg recorded: apxUSD below par since early June, low ~$0.75, $0.881 at eight weeks. Guardian Safe withdrew ~88% of Curve LP June 1–5 and the remainder by July 6 (~$29M → ~$11.9K). Ethereum supply contracted 524M → 312M via onchain burns; Base and BNB Chain routes are live through CCIP. The 20-day cooldown applies to apyUSD, not direct apxUSD redemption. The deny list controls apxUSD transfers, apyUSD, and the unlock queue. Playwright retrieved Accountable's public API (92.24% asset-reserve coverage, $0.9131 redemption value, 100% dashboard verifiability, Nitro attestation) and all four Wolf examination reports for March–June. The Wolf opinions verify asset existence, ownership, custody, and valuation and name Alpaca for offchain STRC/SATA, but do not attest liabilities or coverage. Audits & Historical 3.5→4.0; Liquidity 4.0→4.5; Funds Management 3.875→3.5. |
