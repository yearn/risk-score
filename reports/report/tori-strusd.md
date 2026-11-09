# Protocol Risk Assessment: Tori Finance

- **Assessment Date:** November 4, 2026 (Updated: November 9, 2026)
- **Onchain Snapshot:** Ethereum block [26340122](https://etherscan.io/block/26340122), hash `0x9436fc1d4978c0f9d964a2890475c895be97898e6ee43c8295c4300cce7de8f8` (November 4, 2026 08:01:59 UTC); permissions, proxy slots, supply, and Curve quotes revalidated November 6 at this fixed block. DeFiLlama and GeckoTerminal figures retain their November 4 observation dates. Accountable is a separate **November 6, 2026 04:01:02.208 UTC** observation. CCIP, Safe, Fluid, Curve-LP and Morpho reads added November 8 use the same fixed block. Monad supply is pinned at the matching-timestamp block from mint/burn logs and Arbitrum at its archive block. Pharos, Solana and Canton provenance remains TODO; see Cross-Chain Bridge.
- **Token:** strUSD (Staked trUSD)
- **Chain:** Ethereum
- **Token Address:** [`0x280839980a7eD0D7717F64125fE241012E5F5815`](https://etherscan.io/address/0x280839980a7eD0D7717F64125fE241012E5F5815)
- **Final Score: 3.55/5.0**

## Overview + Links

Tori Finance issues **trUSD**, a synthetic dollar backed primarily by custodial money-market instruments, hedged equity positions and cash, alongside onchain lending/liquidity, and **strUSD**, an ERC-4626 share of staked trUSD. Reserve composition is disclosed through Accountable, with verification limits described below. Rewards are streamed into the vault with an 8-hour vesting period; the share price (`totalAssets / totalSupply`) rises as rewards vest. Unstaking is gated by a **7-day cooldown**; cooled assets sit in a silo until the user claims.

This assessment covers **holding and using strUSD on Ethereum**, including the Morpho strUSD/USDC collateral use case described in issue #576. Economic risk is dominated by **trUSD's offchain delta-neutral backing**, not by the ERC-4626 staking wrapper itself. A separate control risk is the **Distributor `operator`**, a no-code address that Tori reports as a Fordefi MPC wallet. It can burn deposited vault trUSD via `reportLoss` (≤5% of `totalAssets` per day, repeatable) with no Safe approval and no timelock.

**Key metrics (November 4, 2026, Ethereum block 26,340,122):**

| Metric | Value | Source |
|--------|-------|--------|
| Protocol TVL (DeFiLlama, Ethereum) | **~$72.56M** | [tori-finance](https://defillama.com/protocol/tori-finance), latest point 2026-11-04 06:35 UTC |
| trUSD total supply | **~72.80M** | `totalSupply()` |
| strUSD total supply | **~62.54M** | `totalSupply()` |
| strUSD `totalAssets` | **~64.81M trUSD** | ERC-4626 |
| strUSD exchange rate | **~1.0363 trUSD / strUSD** | `convertToAssets(1e18)` |
| Max daily `reportLoss` | **~3.24M trUSD** (5% of `totalAssets`) | `MAX_DAILY_LOSS_BPS = 500` |
| Cooldown | **604,800 s (7 days)** | `cooldownDuration()` |
| First DeFiLlama TVL ≥ $1M | **2026-06-26** | DeFiLlama history |
| Token creation | Block [25,275,301](https://etherscan.io/block/25275301) (**2026-06-08**, ~148 days before snapshot) | Etherscan `getcontractcreation` |

**wsrUSD / Reservoir:** No such exposure was identified in the reviewed core mint/vault contracts or public reserve disclosures. This does not establish its absence from private asset-manager positions. Separately, Accountable explicitly reports **Morpho loans against Tori-token collateral**; this is a circular backing risk described under Collateralization.

**Yearn / Morpho context ([issue #576](https://github.com/yearn/risk-score/issues/576)):** Create / use an strUSD/USDC Morpho market with strUSD as collateral. The existing [86% LLTV market](https://app.morpho.org/ethereum/variable/0x975c6e8b71073a82216ae464bc44f67d71988450d2542d635d88bc78fca344b1/usdc-strusd) uses RedStone `strUSD_FUNDAMENTAL` divided by Chainlink USDC/USD, with decimal scaling. This fundamental price does not independently mark trUSD's market peg or offchain reserve losses; see Oracles. Secondary DEX **inventory** is ~$5.3M across three pools, but usable exit liquidity is thinner (Curve `get_dy`: 1M strUSD → ~951,826 trUSD at snapshot). At snapshot the market held [**12.58M USDC** of supply and **11.33M USDC** of borrows](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json) (**90.07%** utilization, ~1.25M USDC withdrawable).

**Links:**

- [Protocol Documentation](https://docs.tori.finance/)
- [App](https://app.tori.finance) / [Transparency](https://app.tori.finance/transparency)
- [Contract Addresses](https://docs.tori.finance/resources/contracts)
- [Roles, Multisig and Timelocks](https://docs.tori.finance/security/roles)
- [Audits](https://docs.tori.finance/security/audits)
- [Backing & Reserves](https://docs.tori.finance/solution/backing)
- [Accountable attestations (UI)](https://tori.accountable.capital/)
- [Accountable live JSON feed](https://tori.accountable.capital:8443/dashboard) (DFID `100000007`; Yearn monitor pattern: [`utils/accountable.py`](https://github.com/yearn/monitoring/blob/main/utils/accountable.py))
- [HT Digital PoR letter (23 Oct 2026)](https://stablecoin.accountable.capital/file/HTDS_Tori_BVI_PoR_Letter_2026-10-23.pdf?v=20261029)
- [GitHub — tori-contracts](https://github.com/Tori-Finance/tori-contracts)
- [DeFiLlama](https://defillama.com/protocol/tori-finance)
- [November 6 verification evidence](https://github.com/yearn/risk-score/blob/93c1c7cccae645fb419d7f32f66a12fad724ed22/reports/data/tori-strusd-2026-11-06.json): pinned Ethereum reads, role-holder reconciliation, and selected dated Accountable fields. Private reserve inputs and cryptographic proof blobs were not independently verified.
- [November 8 verification evidence](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json): Ethereum CCIP controls and lanes, Safe modules/guards, Fluid and Curve exit reads, Curve LP concentration, Morpho market state, oracle update rules, and the Accountable-relayed MPC policy statement.

## Contract Addresses

### Core (Ethereum)

| Contract | Address | Notes |
|----------|---------|-------|
| strUSD (StakedTrUSD) | [`0x2808…5815`](https://etherscan.io/address/0x280839980a7eD0D7717F64125fE241012E5F5815) | UUPS proxy; impl [`0x6561…977a`](https://etherscan.io/address/0x6561272e3EbC9f2e07cDB12B7c474Db9132b977a) |
| trUSD | [`0xd058…1697`](https://etherscan.io/address/0xd0580192E98eA6CEB9c7b6191Ed2E27560911697) | UUPS proxy; impl [`0xb1d1…f631`](https://etherscan.io/address/0xb1d133fE29255EB4Ac9B05d647d49cd7F05ff631) |
| Minting | [`0xe16b…3F1E`](https://etherscan.io/address/0xe16b821B9F6B0a6f06a2C4a61D5d1f71cFa53F1E) | Sole `minter` on trUSD; **directly deployed** (EIP-1967 impl slot = 0; not a UUPS proxy) |
| Staking Rewards Distributor | [`0xa0C4…D375`](https://etherscan.io/address/0xa0C49fFa4B7941830235cde974d9B2a8420CD375) | Holds `REWARDER_ROLE` on strUSD; Ownable → Admin Safe; `operator` = EOA |
| Distributor `operator` | [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) | No code (`extcodesize` = 0 at block 26,340,122); Tori-reported Fordefi MPC; can call `reportLoss` / `transferInRewards` |
| trUSD Silo | [`0xF7c0…60B4`](https://etherscan.io/address/0xF7c0d8853E69DCD37ee7599c6280d2632F3360B4) | Holds cooled trUSD (~618.3k at snapshot) |
| ToriTimelock (24h) | [`0xA952…6ef4`](https://etherscan.io/address/0xA952453E39F77108Ee37C1b92de593F1C59A6ef4) | `getMinDelay() = 86,400`; replaced prior TL on 15 Sep 2026 per docs |
| Admin Safe (3/5) | [`0x0C6B…8316`](https://etherscan.io/address/0x0C6Bbfd2d5666d44bf28580eDEec0263692C8316) | Gnosis Safe; `DEFAULT_ADMIN` on core contracts; Timelock `PROPOSER` only; same address, owners and threshold on Monad and Arbitrum |

### Chainlink CCIP (Ethereum hub — Lock & Release)

| Contract | Address |
|----------|---------|
| trUSD LockReleaseTokenPool 2.0.0 | [`0x6823…d463`](https://etherscan.io/address/0x6823666FD0869050a0530eB15BA568936234d463) |
| strUSD LockReleaseTokenPool 2.0.0 | [`0x63AA…66b9`](https://etherscan.io/address/0x63AAEFD6e9F8a306ad6AD60f18f882Ee7Da866b9) |
| trUSD ERC20LockBox | [`0x8D21…a37f`](https://etherscan.io/address/0x8D21EB2945c6084797De85D7AE0c163e1971a37f) (~**680.75k** trUSD) |
| strUSD ERC20LockBox | [`0xc1A9…8F86`](https://etherscan.io/address/0xc1A9e4BBb58573B8971C9b3C24e17f9851268F86) (~**13.23M** strUSD) |

Remote Burn & Mint representations (Monad, Pharos, Arbitrum, Solana) are listed in [docs](https://docs.tori.finance/resources/contracts). Both Ethereum pools also configure a fifth lane, **Canton** (selector `2308837218439511688`), [at block 26,340,122](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json); docs do not list it. Pool `owner()` on both Ethereum pools = Admin Safe. Monad and Arbitrum token and pool controls are [read separately](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json); see Cross-Chain Bridge.

Core contract source, including the token proxy implementations, is **verified** on Etherscan. Published protocol source is available at [Tori-Finance/tori-contracts](https://github.com/Tori-Finance/tori-contracts); the operator is an EOA, not a source-verifiable contract.

## Audits and Due Diligence Disclosures

| Firm | Date | Scope | Report |
|------|------|-------|--------|
| **Sherlock** (collaborative) | Jan 15–22, 2026 | Full protocol | [PDF](https://github.com/sherlock-protocol/sherlock-reports/blob/main/audits/2026.02.10%20-%20Final%20-%20Tori%20Finance%20Collaborative%20Audit%20Report%201770734349.pdf) |
| **Nethermind** | Mar 24–26, 2026 | Full protocol | [PDF](https://github.com/NethermindEth/PublicAuditReports/blob/main/NM_0854_Tori.pdf) |

Docs state every finding was fixed or formally acknowledged. Architecture is moderate complexity: UUPS tokens (strUSD, trUSD), non-upgradeable Minting with AccessControl + whitelist + EIP-712 orders, ERC-4626 staking with cooldown/silo/vesting, and unmodified Chainlink CCIP pools.

### Bug Bounty

- Private program via [security@tori.finance](mailto:security@tori.finance): Critical up to **$1,000,000**; High $10k–$50k; Medium $1k–$10k; Low up to $1k ([audits page](https://docs.tori.finance/security/audits)).
- **Not** listed on SEAL Safe Harbor (homepage / public agreement list checked 2026-11-04; no Tori entry found).
- Hypernative monitoring claimed in security docs (not independently verified this assessment).

## Historical Track Record

- **Age:** strUSD deployed **2026-06-08** (~**148 days** / ~5 months at snapshot). DeFiLlama first recorded TVL ≥ $1M on **2026-06-26** (~131 days of material TVL).
- **TVL path:** Rose from ~$46M (first ≥$1M day) to a local peak near ~$78M in mid-October 2026, then settled near **~$72.6M** (all Ethereum per DeFiLlama `currentChainTvls`).
- **Incidents:** No public exploit, pause, or depeg incident found in docs, Discord announcements, or onchain pause state at snapshot.
- **Concentration:** strUSD holder concentration was not measured. The 86% LLTV Morpho market is the only non-dust strUSD or trUSD Morpho market on Ethereum found through the [Morpho API](https://blue-api.morpho.org/graphql) on November 8; its snapshot size is above. Curve LP concentration is covered under Liquidity Assessment.

## Funds Management

Ultimate backing for strUSD is **trUSD**, supported by a predominantly offchain reserve portfolio disclosed through [Accountable](https://tori.accountable.capital). At the Ethereum snapshot, the registered minting custodian EOA [`0x6339…1CC7`](https://etherscan.io/address/0x63392EaB47926f6Ee3E6ACA285B367A952001CC7) held **~$689.7k USDC + ~$207.7k USDT**. This account is not the complete reserve inventory: the separate November 6 Accountable observation also reports onchain Morpho positions and other wallet assets, totaling **9.51%** of reserves. The remaining **90.49%** is reported in custodial bank/investment-bank custody.

### Accessibility

- **trUSD mint/redeem:** Whitelist-gated at `Minting`; verified participants submit EIP-712 orders executed by `MINTER` / `REDEEMER` EOAs. Docs: **10 bps mint fee**. Per-block caps: `globalMaxMintPerBlock = 5e24` (5M 18-dec), `globalMaxRedeemPerBlock = 5e23` (500k); USDC/USDT `tokenConfig` enabled with the same per-asset caps.
- **strUSD stake:** Permissionless ERC-4626 `deposit`/`mint` for anyone holding trUSD (subject to blacklist / full-restricted lists).
- **strUSD unstake:** `cooldownDuration = 7 days`, then claim from silo. Not atomic exit to USD.

### Token Mint Authority

**Mint mechanism (strUSD):** Open ERC-4626 deposit (trUSD in → shares out). Privileged `REWARDER_ROLE` (Distributor + Safe) can `transferInRewards` / `reportLoss` (loss capped at `MAX_DAILY_LOSS_BPS = 500` = 5%/day). The Distributor forwards `reportLoss` / reward calls from its `operator` EOA.

**Mint requires backing (strUSD shares):** Yes for deposits (trUSD transferred in same tx). Rewards mint economic value without new shares; `reportLoss` burns vault-held trUSD (reducing `totalAssets` without burning shares), socializing losses into PPS.

**trUSD mint authority** (verified RoleGranted/Revoked + `hasRole` / `minter()` at block 26,340,122):

| Address | Can Mint trUSD | Role / Mechanism | Notes |
|---------|:--------------:|------------------|-------|
| [`Minting 0xe16b…3F1E`](https://etherscan.io/address/0xe16b821B9F6B0a6f06a2C4a61D5d1f71cFa53F1E) | ✓ | Sole `minter()` on trUSD | Whitelist + EIP-712 + per-block caps |
| Minter EOAs [`0x2ba9…f70`](https://etherscan.io/address/0x2ba9857e5b1099f3809e0304a8f789659e7a8f70), [`0x7713…1ab`](https://etherscan.io/address/0x7713ba984fdfd4053ace737761de903b10c351ab), [`0xca43…bce`](https://etherscan.io/address/0xca4317c842b5d52fd0cb3a5b11d9f8fe8281fbce) | via Minting | `MINTER_ROLE` | Submit user-signed orders; stablecoin collateral transfers atomically to registered custodians |
| Redeemer EOAs [`0x3b45…71e`](https://etherscan.io/address/0x3b45316d817a97e401d3e2649983d73e15a3471e), [`0xc885…bc9`](https://etherscan.io/address/0xc885cfbb77414813dda6142db7aa8a957b533bc9), [`0xd5b3…3ec`](https://etherscan.io/address/0xd5b369fbef4bbf8ac0b3c0faf4b3efde0bc2f3ec) | burn path | `REDEEMER_ROLE` | User-signed order burns approved trUSD and transfers available collateral |

**Rate limits:** Global + per-collateral mint/redeem per-block caps as above; `stablesDeltaLimit = 0` at snapshot.

### Collateralization

Predominantly offchain reserves, with an onchain lending and liquidity sleeve. The public [Accountable feed](https://tori.accountable.capital:8443/dashboard) was fetched with `Accept: application/json`; [selected response fields and calculations](https://github.com/yearn/risk-score/blob/93c1c7cccae645fb419d7f32f66a12fad724ed22/reports/data/tori-strusd-2026-11-06.json) are retained so the dated evidence survives changes to the live endpoint:

- **Endpoint:** [`https://tori.accountable.capital:8443/dashboard`](https://tori.accountable.capital:8443/dashboard) (SPA config `dashboardUrl`; DFID **`100000007`**; UI [tori.accountable.capital](https://tori.accountable.capital/)).
- **Report timestamp (`data.ts`):** **2026-11-06 04:01:02.208 UTC**. This is separate from the November 4 Ethereum snapshot; the feed's `underlying_exposure_as_of` is November 4.
- **Totals (`data.reserves`):** `total_reserves.value` **$74,070,623.20**; `total_supply.value` **$73,920,779.79** (`fx: 1`); reported `data.collateralization` **1.002027** (**100.2027%**); `data.net` **$149,843.41**. Feed labels `verifiability = 100`, `interval = live` are provider-reported metadata.
- **Composition (`reserves.nested_split`, USD):** Money Market Instruments **$53.05M**; Delta-Neutral Equity Arbitrage **$6.72M**; FX Collateral **$7.16M**; Bank Cash **~$0.10M**; onchain sleeves **~$7.04M**. Custody mix: regulated custodian banks **80.83%**, regulated investment banks **9.66%**, onchain custody **9.51%**.
- **Circular backing:** The feed explicitly labels **$3,312,168.91** of Monad AUSD loans and **$126,199.48** of Ethereum USDC loans as **Morpho (Tori token collateral)**: **$3,438,368.39**, or **4.64% of reported reserves**. A Tori collateral impairment can therefore cause bad debt in assets counted as trUSD backing. As an illustrative zero-recovery stress, excluding these claims gives **95.55%** coverage of the same reported liabilities. This is a stress calculation, not a measured shortfall. The feed-named DeFi Operator [`0xD07d…00eb`](https://etherscan.io/address/0xD07d31698E9689Af5954698b08e0c963ad9c00eb) accounts for [almost all of both sleeves](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json). **Ethereum:** at block 26,353,280 (the feed timestamp) it supplied **$126,028.59** USDC across the 86% strUSD market ($90,728.78), PT-trUSD-26NOV2026 ($25,221.24), PT-strUSD-26NOV2026 ($5,040.10) and etrUSD ($5,038.47) markets, leaving **$170.89** of the feed figure unattributed. **Monad:** it holds **~$1.00M** directly in the [strUSD/AUSD 86% market](https://monadscan.com/address/0xD5D960E8C380B724a48AC59E2DfF1b2CB4a1eAee) and **~$2.32M** through [SharpByte AUSD Tori Ecosystem](https://monadscan.com/address/0x790e4f829fe865d432c4ea83b8b15f8871415b6c), a Morpho VaultV2 that supplies ~$6.7M of its ~$7.06M assets to that same market, for ~$3.318M against the feed's $3.312M (+0.17%). Monad figures are November 9 reads with shares from the feed block, so they are not fully time-matched. Recovery in a Tori impairment is scenario-dependent, since the collateral and its exit liquidity would fall together, and is not estimated here.
- **Data sources (share of reserves):** Asset Manager API **90.36%** (provider level 4, private); DeFi Protocols **8.10%** (level 6, public); Blockchain Wallets **1.41%** (level 6); Payment Service provider **0.13%** (level 2). The response contains cryptographic attestation blobs, but their validity and the private inputs were not independently verified.
- **Cross-check letter:** HT Digital Services Ltd, **23 October 2026 14:00 UTC** ([PDF](https://stablecoin.accountable.capital/file/HTDS_Tori_BVI_PoR_Letter_2026-10-23.pdf?v=20261029)): sight of **$73.079M** collateral vs **72.781M** trUSD (block [26,255,786](https://etherscan.io/block/26255786)); **100.41%** CR. Offchain balances are dated **October 22**, while the token read is October 23. The letter relies on management's statement that accounts are designated for reserves; controls and asset-ownership assurance under ISAE 3000 are described as future work.

### Exchange Rate

ERC-4626 accounting has no direct admin `setExchangeRate`. Rewards vest over 8h and `reportLoss` burns underlying; direct donations and privileged share burns through `redistributeLockedAmount(from, address(0))` can also change PPS. Morpho's RedStone fundamental feed is a separately updated observation, rather than an atomic read of the vault's current conversion rate.

### Residual Value

After a severe trading loss, residual value equals whatever Accountable-attested reserves and the reserve fund still cover, socialized via `reportLoss` into a lower strUSD PPS. No onchain senior/junior tranche inside Tori.

## Governance

### Onchain Permissions

| Role | Contract | Holder(s) at snapshot | Delay |
|------|----------|----------------------|-------|
| `DEFAULT_ADMIN_ROLE` | strUSD, trUSD, Minting | Admin Safe 3/5 | **None** — includes pause, grant/revoke ops roles, disable collateral, set per-block caps, **and** `redistributeLockedAmount` / `seizeCooldown` / `setCooldownDuration` (up to the 90-day maximum) on strUSD |
| `TIMELOCK_ADMIN_ROLE` | strUSD, trUSD, Minting | Timelock [`0xA952…6ef4`](https://etherscan.io/address/0xA952453E39F77108Ee37C1b92de593F1C59A6ef4) | **24h** — upgrades on **strUSD/trUSD proxies** and `trUSD.setMinter`; on Minting: add/enable collateral, `addCustodianAddress`, `setStablesDeltaLimit` (Minting itself is **not** upgradeable) |
| Timelock `PROPOSER_ROLE` | Timelock | Admin Safe **only** | — |
| Timelock `EXECUTOR_ROLE` | Timelock | EOA [`0x039e…0ce7`](https://etherscan.io/address/0x039e71e865a34bcaaebfc641291bec6517ea0ce7) **only** | `hasRole(EXECUTOR, Safe) = false` at block 26,340,122 |
| Timelock `CANCELLER_ROLE` | Timelock | EOA [`0x6022…d065`](https://etherscan.io/address/0x60226cbb34445143e5f923abe2d42e5df852d065) **only** | `hasRole(CANCELLER, Safe) = false` at block 26,340,122 |
| `REWARDER_ROLE` | strUSD | Safe + Distributor | Can `reportLoss` ≤5%/day / `transferInRewards` |
| Distributor `operator` | Distributor | EOA [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) | **No delay**; calls Distributor → vault `reportLoss` / rewards |
| `BLACKLIST_MANAGER_ROLE` | strUSD | Safe + EOA [`0xb1e5…a169`](https://etherscan.io/address/0xb1e50b7a19b8f650a6ee77dc0ac52b88059fa169) | `addToBlacklist` / `removeFromBlacklist` (grants `FULL_RESTRICTED_STAKER_ROLE`) |
| `GATEKEEPER_ROLE` | Minting | [`0x5a54…66c7`](https://etherscan.io/address/0x5a54bbae78a3f043a1a41d6f9eb39fb2a1f766c7), [`0xb044…183d`](https://etherscan.io/address/0xb0444060adcc379e57b72c5eb7e09530351b183d) | On Minting, can only strip powers / disable mint-redeem; [`0x5a54…66c7`](https://etherscan.io/address/0x5a54bbae78a3f043a1a41d6f9eb39fb2a1f766c7) is also `rateLimitAdmin` on both CCIP pools |
| `WHITELISTER_ROLE` | Minting | [`0x541d…cf6`](https://etherscan.io/address/0x541d53bc10213ff7835b3393f6e74baaefca3cf6) | Controls mint/redeem whitelist |
| `COLLATERAL_MANAGER_ROLE` | Minting | [`0x39c9…213`](https://etherscan.io/address/0x39c9106e9be3622104a1ab97f3fcc88b65874213) | `transferToCustody` to timelock-registered custodians only |

Safe `getThreshold() = 3`; `getOwners()` returns five addresses, retained in the [snapshot evidence](https://github.com/yearn/risk-score/blob/93c1c7cccae645fb419d7f32f66a12fad724ed22/reports/data/tori-strusd-2026-11-06.json). `getModulesPaginated` returns no modules, and the guard and module-guard slots are zero, [at block 26,340,122](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json), so no module can bypass the 3/5 threshold. Public signer identities were not established. Protocol [roles documentation](https://docs.tori.finance/security/roles) describes several keys, including the reward operator, as MPC-controlled. The Accountable feed's [`policy_attestation`](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json) states that Fordefi confirmed manual approval policies as of 2026-10-26 17:04 UTC: **3/4** for the Reward Operator, and **2/4** for the custodian, collateral manager, whitelister, gatekeeper [`0xb044…183d`](https://etherscan.io/address/0xb0444060adcc379e57b72c5eb7e09530351b183d), proposal executor and proposal canceller. This is a static statement published by Tori through Accountable: it excludes later policy changes, says specified API operations follow separate undisclosed rules, and was not independently verified. It does not list the blacklist manager, minter or redeemer EOAs, or gatekeeper [`0x5a54…66c7`](https://etherscan.io/address/0x5a54bbae78a3f043a1a41d6f9eb39fb2a1f766c7). Onchain, [all 375 operator transactions](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json) through the snapshot block are `transferInRewards` at a machine-regular ~8h02m cadence and none is `reportLoss`, so routine activity runs under the undisclosed API rules rather than the 3/4 manual quorum. **TODO:** obtain the API rule's function scope from Tori to establish whether `reportLoss` falls under it. A no-code address does not establish how its key is held, and this path has no onchain multiparty approval requirement.

**Immediate confiscation (no 24h timelock):** After an address is blacklisted (`FULL_RESTRICTED_STAKER_ROLE`), Admin Safe as `DEFAULT_ADMIN` can call:

- `redistributeLockedAmount(from, to)` — burns all of `from`'s strUSD shares and mints them to `to` (or burns with no mint when `to == address(0)`, raising PPS for remaining stakers).
- `seizeCooldown(from, to)` — moves `from`'s cooled silo trUSD to `to`.

Blacklisting alone does not move funds; the Safe's immediate `DEFAULT_ADMIN` calls do. Neither path is timelocked. Both functions and their access checks are in the [verified strUSD implementation](https://etherscan.io/address/0x6561272e3EbC9f2e07cDB12B7c474Db9132b977a#code).

**Trust note:** Docs say the Timelock executor is the 3/5 Safe. Onchain at block 26,340,122, `hasRole(EXECUTOR_ROLE, Safe) = false` and `hasRole(CANCELLER_ROLE, Safe) = false`; the listed EOAs return `true` for their respective roles. Safe remains the sole `PROPOSER`. Execution of a queued operation still requires a previously Safe-proposed, 24h-ready operation, but the executor key is an EOA, not the Safe.

### Critical Permission Paths and Weakest Link

A **material loss** here is loss of deposited trUSD in the strUSD vault (or confiscation of strUSD shares / cooled trUSD).

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| `Distributor.reportLoss` → `strUSD.reportLoss` burns vault trUSD | Operator EOA [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) (`extcodesize=0`); Distributor owned by Safe (can replace operator) | `MAX_DAILY_LOSS_BPS = 500` (5%/day) + daily cooldown; **no** Safe approval, **no** timelock; repeatable daily | ~**64.81M** vault trUSD (`totalAssets`); max single-day burn ~**3.24M** trUSD at snapshot |
| `strUSD.reportLoss` directly | Admin Safe via `REWARDER_ROLE` | Same 5%/day cap; 3/5 Safe | Same vault assets |
| Blacklist → `redistributeLockedAmount` / `seizeCooldown` | Blacklist: Safe + EOA [`0xb1e5…a169`](https://etherscan.io/address/0xb1e50b7a19b8f650a6ee77dc0ac52b88059fa169); redistribute/seize: Safe `DEFAULT_ADMIN` | No timelock; requires prior blacklist on `from` | Targeted user's shares / cooled silo assets (~618.3k trUSD across silo users) |
| UUPS upgrade strUSD / trUSD | Timelock `TIMELOCK_ADMIN` → executor EOA after Safe proposes | 24h delay; Safe proposes | Full token/vault logic |
| `trUSD.setMinter` changes canonical mint authority | Timelock `TIMELOCK_ADMIN` on trUSD | 24h delay | Entire trUSD supply; replacement minter can issue unbacked tokens |
| Minting parameter / custody expansion (`addCustodianAddress`, `addAllowedToken`, `setStablesDeltaLimit`) | Timelock `TIMELOCK_ADMIN` (Minting **not** upgradeable) | 24h delay | Mint/redeem path / custody set |
| `Minting.transferToCustody` → registered custodian | Collateral manager [`0x39c9…213`](https://etherscan.io/address/0x39c9106e9be3622104a1ab97f3fcc88b65874213); Safe can grant this role | Destination allowlist; no timelock or per-call/per-day amount cap | ~100.4k USDC held in Minting at snapshot; subsequent collateral inflows |
| Transfers from the registered custodian account | Custodian EOA [`0x6339…1CC7`](https://etherscan.io/address/0x63392EaB47926f6Ee3E6ACA285B367A952001CC7) | No onchain threshold, recipient restriction, or amount cap after funds arrive | ~689.7k USDC + ~207.7k USDT at snapshot; bank/asset-manager account permissions **TODO** |
| `ERC20LockBox.withdraw` after `applyAuthorizedCallerUpdates` (CCIP escrow) | Admin Safe as lockbox `owner()`; Safe is also pool owner and `TokenAdminRegistry` administrator | 3/5 Safe; **no** timelock; today the sole [authorized caller](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json) is the matching pool | ~**13.23M** strUSD (~21% of supply) and ~0.68M trUSD backing remote tokens |
| Remote minter grants, then bridge to release Ethereum escrow | Admin Safe as token `owner()` / `DEFAULT_ADMIN` on [Monad and Arbitrum](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json), with the same five owners and 3/5 threshold | No timelock; each token's sole minter today is its pool; escrow release limited to 1.5M per 6h per pool | Up to the same lockbox balances, more slowly than direct `withdraw`; unbacked remote supply |
| CCIP lane limits via `setRateLimitConfig` | Pool owner (Safe) or `rateLimitAdmin` [`0x5a54…66c7`](https://etherscan.io/address/0x5a54bbae78a3f043a1a41d6f9eb39fb2a1f766c7) (no code, absent from the MPC statement) | No timelock; [1.5M with 6h refill](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json) on all five lanes | Can remove the throttle on a CCIP or remote-mint compromise; does not move funds alone |

**Weakest verified vault path to material loss:** Distributor **operator** [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) calling `reportLoss`. The [verified Distributor source](https://etherscan.io/address/0xa0C49fFa4B7941830235cde974d9B2a8420CD375#code) forwards operator-selected amounts to the vault. At block 26,340,122 the address has no code; a [read-only simulation](https://github.com/yearn/risk-score/blob/93c1c7cccae645fb419d7f32f66a12fad724ed22/reports/data/tori-strusd-2026-11-06.json) accepts burning the maximum ~3.24M deposited trUSD in one call. The code-enforced 5% limit and 24h interval still allow material repeated losses. There is no onchain Safe threshold or timelock on this path; the only reported approval control is the offchain Fordefi policy, and its coverage of `reportLoss` is not disclosed. The registered custodian, reported at a 2/4 approval quorum, is another immediate path over collateral already received (~$897k at snapshot, ~1.2% of reported reserves). The Safe's higher-threshold confiscation path can affect targeted shares and cooled assets without a timelock, and it can drain both CCIP lockboxes by authorizing itself as a caller.

**Inventory limits:** Grant/revoke histories and current privileged holders were reconciled for strUSD, trUSD, Minting, and Timelock; Distributor owner/operator and the Safe owner set were read directly. Ethereum CCIP pool, lockbox and `TokenAdminRegistry` controls and Safe module/guard state are [read at block 26,340,122](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json). [Monad and Arbitrum token, pool and registry controls](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json) are read; Monad state is current as of November 9 because Etherscan's `eth_call` does not honor historical block tags there. **TODO:** complete Pharos, Solana and Canton pool and mint-control inventories (no configured RPC) and bank/asset-manager account approval policies (private). These gaps leave the weakest-path claim limited to the verified contracts; a globally exclusive claim is not established.

### Upgradeability

- **strUSD / trUSD:** UUPS proxies. `_authorizeUpgrade` gated by `TIMELOCK_ADMIN_ROLE` → 24h timelock.
- **Minting:** **Not upgradeable.** EIP-1967 implementation slot is zero; [verified source](https://etherscan.io/address/0xe16b821B9F6B0a6f06a2C4a61D5d1f71cFa53F1E#code) is a directly deployed contract with no upgrade entrypoint. Timelocked permissions cover **parameters and custody set** (`addAllowedToken`, `enableAllowedToken`, `addCustodianAddress`, `setStablesDeltaLimit`). `setMinter` belongs to **trUSD**, not Minting.
- **CCIP pools:** Chainlink LockReleaseTokenPool 2.0.0; `owner` = Admin Safe with no timelock on pool owner calls; `rateLimitAdmin` = [`0x5a54…66c7`](https://etherscan.io/address/0x5a54bbae78a3f043a1a41d6f9eb39fb2a1f766c7); lockbox `owner` = Admin Safe, sole authorized caller = matching pool.

## Oracles

- **Core protocol:** No market-price oracle in the verified mint/redeem path. `verifyStablesLimit` compares decimal-normalized stablecoin collateral and trUSD amounts against `stablesDeltaLimit` (zero at snapshot). User signatures and the role/whitelist checks do not independently value offchain backing.
- **Morpho market path:** Market [USDC/strUSD, 86% LLTV](https://app.morpho.org/ethereum/variable/0x975c6e8b71073a82216ae464bc44f67d71988450d2542d635d88bc78fca344b1/usdc-strusd) has oracle [`0x1506…A6A4`](https://etherscan.io/address/0x1506c98cE61aC63c8438B710C054a51c5dD9A6A4#code). Its `BASE_FEED_1` is RedStone [`strUSD_FUNDAMENTAL`](https://etherscan.io/address/0x7fdA577c085330E69df3179A2A5867751A9D0cAA); `QUOTE_FEED_1` is Chainlink [`USDC/USD`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6); both vault fields and second feeds are zero. Price is the **base feed divided by the quote feed**, with decimal scaling. At snapshot, RedStone reports 1.03629122 and Chainlink reports 0.99963359; the resulting price is ~1.03667107 USDC/strUSD. The fundamental feed does not independently reflect a trUSD market depeg or unreported reserve loss. RedStone's [relayer manifest](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/relayer-remote-config/main/relayer-manifests-multi-feed/ethereumMultiFeed.json) sets a 0.1% deviation and 6h heartbeat for `strUSD_FUNDAMENTAL`; Chainlink's [directory](https://reference-data-directory.vercel.app/feeds-mainnet.json) lists USDC/USD at 0.25% and 23h. At snapshot the feeds were ~4.5h and ~19.2h old, within those rules. Stale or compromised data affects Morpho liquidation/accounting; it is not used by core Minting.

## Dependencies

1. **Offchain trading / custody stack** — critical; economic solvency of trUSD.
2. **Accountable** continuous attestation — live JSON feed at `:8443/dashboard` (DFID 100000007) as cited above; not a hard onchain solvency gate.
3. **Chainlink CCIP** — lock/release hub; remote Burn & Mint on Monad / Pharos / Arbitrum / Solana, plus a Canton lane absent from docs (~13.23M strUSD and ~0.68M trUSD escrowed in the original assessment). Remote-supply reconciliation requires retained per-chain snapshots; see Cross-Chain Bridge.
4. **USDC / USDT** — mint collateral.
5. **RedStone** (Morpho use only).
6. **Morpho reserve loans** — Accountable reports ~$3.44M of backing claims against Tori-token collateral; collateral impairment can feed back into reserve losses. [Attributed](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json) to the feed-named DeFi Operator on Ethereum and Monad; see Collateralization.

## Liquidity Assessment

**Pool inventory ([Curve strUSD/trUSD](https://www.geckoterminal.com/eth/pools/0x25a637c80ad90177d0b3ff28aa2d3f74f7165ccb), [Fluid trUSD/USDC](https://www.geckoterminal.com/eth/pools/0x97f32e5091d0e6aee24beb398e6592ae111dee9c), [Curve frxUSD/trUSD](https://www.geckoterminal.com/eth/pools/0xd1d954bc94c843815ec7b8119f2de00af27fa6ff) on GeckoTerminal, ~snapshot day) — not the same as usable exit depth:**

| Venue | Pair | Pool | Approx. inventory TVL | 24h volume |
|-------|------|------|----------------------|------------|
| Curve | strUSD / trUSD | [`0x25a6…5ccb`](https://etherscan.io/address/0x25a637c80ad90177d0b3ff28aa2d3f74f7165ccb) | **~$2.11M** | ~$303k |
| Fluid DexT1 | trUSD / USDC | [`0x97f3…ee9c`](https://etherscan.io/address/0x97f32e5091d0e6aee24beb398e6592ae111dee9c) | **~$2.09M** | ~$1.04M |
| Curve | frxUSD / trUSD | [`0xd1d9…a6ff`](https://etherscan.io/address/0xd1d954bc94c843815ec7b8119f2de00af27fa6ff) | **~$1.09M** | ~$212k |
| **Total secondary inventory (ETH)** | | | **~$5.3M** | |

**Executable Curve exit quotes** (`get_dy`, block 26,340,122; coins[0]=strUSD, coins[1]=trUSD; pool balances ~1.048M strUSD / ~0.981M trUSD; PPS ~1.036343):

| Size (strUSD in) | trUSD out (`get_dy`) | vs PPS fair (~1.036343×) |
|------------------|----------------------|-------------------------|
| 100,000 | **103,517.22** | −0.11% |
| 250,000 | **258,559.92** | −0.20% |
| 500,000 | **515,897.83** | −0.44% |
| 1,000,000 | **951,825.67** | **−8.15%** |

Selling 1M strUSD on Curve returns only ~951,826 trUSD before any further conversion to USDC — usable exit liquidity is far below headline pool inventory. Fluid DexT1 ([`0x97f3…ee9c`](https://etherscan.io/address/0x97f32e5091d0e6aee24beb398e6592ae111dee9c)) inventory is ~$2.09M; estimate-mode `swapIn` [returns 999,222.89 USDC for 1M trUSD](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json) at the snapshot block and reverts from 1.1M trUSD. Curve is the constraint at the sizes tested. Secondary Curve frxUSD/trUSD quotes remain near 1:1 through 500k trUSD, but 1M trUSD returns only ~578k frxUSD.

**Executable strUSD→USDC route** (Curve then Fluid, same block; excludes gas and competing liquidators):

| Size (strUSD in) | USDC out | vs PPS fair (~1.036343×) |
|------------------|----------|-------------------------|
| 100,000 | **103,503.57** | −0.13% |
| 250,000 | **258,496.95** | −0.23% |
| 500,000 | **515,676.61** | −0.48% |
| 1,000,000 | **951,118.98** | **−8.22%** |

**LP concentration:** The Curve gauges hold [99.99% of strUSD/trUSD and 99.40% of frxUSD/trUSD LP supply](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json), and a single no-code address [`0xa8a6…a60e`](https://etherscan.io/address/0xa8a697f7fec0e99c1e6d82add6c80aafb07da60e) holds 100.00% and 99.07% of those gauge deposits. The same address holds [**99.60%** of the FluidSmartLending wrapper](https://etherscan.io/address/0x2241757fb95d970646b2e8cfef02af9436fb1ace), which is the [sole whitelisted supplier](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json) to the Fluid DEX. One holder can therefore withdraw effectively all inventory from all three exit venues without warning. That address is also whitelisted at Minting and has minted a cumulative **~56.10M trUSD** against **~56.20M** of USDC and USDT sent to the registered custodian, so primary issuance and secondary liquidity are concentrated in one party. **TODO:** the holder's name and affiliation are not published and it is not listed in the Accountable feed; obtain them from Tori.

Primary exit for verified parties: whitelist redeem of trUSD (rate-limited). strUSD holders first endure a **7-day cooldown**, then need secondary markets or a whitelist redeem of trUSD. CCIP moves inventory across chains but does not create USD liquidity.

## Cross-Chain Bridge

**Model: lock (Ethereum canonical) / mint (remotes)** via Chainlink CCIP CCT. See bridges.json `ccip` dependency `tori-strusd`. Ethereum escrow at block 26,340,122 is **13,234,354.19 strUSD** and **680,750.37 trUSD**. [Pinned remote supply](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json): **Monad** block [119,273,951](https://monadscan.com/block/119273951), derived from all mint/burn logs, **12,328,052.02 strUSD** and **680,647.20 trUSD**; **Arbitrum** block [521,117,081](https://arbiscan.io/block/521117081), **~0.0962 strUSD** and **~0.2211 trUSD**. That leaves **906,302.08 strUSD** and **102.95 trUSD** for Pharos, Solana and Canton. The unretained November 4 readings (Pharos ~906.2k strUSD / ~2.81 trUSD, Solana 0 / ~0.14) leave ~100 of each token unexplained, so the original "match within dust" is withdrawn; the remainder may sit on the unread Canton lane, but this is not established. **TODO:** read Pharos, Canton and Solana supply at pinned blocks/slots (no configured RPC). Both Ethereum pools [enforce 1.5M tokens with 6h refill](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json) inbound and outbound on all five lanes at block 26,340,122; Monad and Arbitrum enforce the same on their Ethereum lanes and list no Canton lane. On both chains the 3/5 Safe is token and pool owner and `TokenAdminRegistry` administrator, each token's sole minter and burner is its pool, and `maxSupply` is zero (uncapped). Arbitrum strUSD [`0x2f0e…4974`](https://arbiscan.io/address/0x2f0ef93ce562bd192f13db1acb32d3a8aa324974) is unverified on Arbiscan, but its bytecode is identical to the [verified Monad deployment](https://monadscan.com/address/0x683fb58ee77172626d5b49087ddac71ef7825d20#code). Solana mint authority is documented as a 1-of-2 SPL multisig (pool signer **or** Tori MPC wallet); the wallet's blocking policy is an offchain claim, not an onchain second approval. Freeze/admin keys are Tori-controlled wallets per [contract documentation](https://docs.tori.finance/resources/contracts).

## Monitoring

Use the linked addresses in Contract Addresses and the permission table as targets. Ethereum values below refer to block 26,340,122; Accountable must be checked on its own timestamp.

| Target | Observable checks | Alert / frequency |
|--------|-------------------|-------------------|
| Distributor and strUSD | `operator()`, `owner()`, `OperatorUpdated`, `LossReported`, `remainingDailyLoss()`, `nextLossAllowedAt()` | Every block: any operator/owner change or loss report; recompute exposed trUSD and remaining cap |
| strUSD / trUSD proxies, Minting, Timelock | Implementation slots, `RoleGranted` / `RoleRevoked`, timelock `CallScheduled` / `CallExecuted`, `getMinDelay()`, `minter()` | Every block: any authority/implementation change; delay below 86,400s; new custodian/collateral or delta-limit change |
| Admin Safe and strUSD confiscation | `getOwners()`, `getThreshold()`, `LockedAmountRedistributed`, `CooldownSeized` | Every block: any signer-set/threshold change or confiscation event; also alert on any Safe module or guard change |
| Minting and custodian | `getCustodianAddresses()`, stablecoin `balanceOf`, `paused()`, mint/redeem events and per-block limits | Hourly balances; immediate pause or custody/limit change; investigate sharp liquidity outflows |
| Accountable | `data.ts`, `reserves.total_reserves`, `reserves.total_supply`, `collateralization`, Tori-collateral Morpho sleeves | Hourly: reported coverage <100%, timestamp age >48h, or growth in circular backing; distinguish reported totals from independent-reserve stress coverage |
| Curve/Fluid pools and Morpho oracle | Balances of [`0xa8a6…a60e`](https://etherscan.io/address/0xa8a697f7fec0e99c1e6d82add6c80aafb07da60e) across both gauges and the Fluid wrapper; repeat `get_dy` at 100k/250k/500k/1M; oracle `price()`, both feeds' `latestRoundData`, compare to vault conversion and market peg | Hourly: any withdrawal by that holder, exit impact >3% at intended liquidation size or unexpected price/feed divergence; RedStone age >6h, Chainlink age >23h, or moves beyond 0.1% / 0.25% without an update |
| CCIP lockboxes and remotes | Canonical `balanceOf(lockbox)`, normalized remote supply at separately pinned blocks | Daily reconciliation across all five lanes, using log-derived supply where historical state is unavailable; **TODO:** add Pharos, Solana and Canton reads and resolve the ~100-token remainder |

## Appendix: Contract Architecture

```text
USDC / USDT -- user-signed mint --> Minting --> registered custodian
                                      |              |
                                      | mints        +--> predominantly offchain reserves
                                      v              +--> Morpho reserve loans (some Tori collateral)
                                    trUSD
                                      | deposit / rewards
                                      v
                                   strUSD -- cooldown --> Silo --> user claim

Operator (no code; Tori-reported MPC) --> Distributor.reportLoss --> strUSD burns deposited trUSD
Admin Safe --> immediate role grants / blacklist + confiscation / operator replacement
Admin Safe --> Timelock proposal --> executor EOA after 24h --> token upgrades / parameters
trUSD / strUSD --> CCIP canonical lockboxes <--> remote token representations (Safe-owned on Monad and Arbitrum)
Accountable --> public reserve observations; does not enforce solvency onchain
```

## Risk Score Assessment

**Scoring Guidelines:** Be conservative; use decimals; prioritize onchain evidence.

### Critical Risk Gates

- [ ] **No audit** — Sherlock + Nethermind public reports
- [ ] **Unverified contract source** — core contracts verified
- [ ] **Unverifiable reserves** — The [captured Accountable response](https://github.com/yearn/risk-score/blob/93c1c7cccae645fb419d7f32f66a12fad724ed22/reports/data/tori-strusd-2026-11-06.json) has `res=ok`, `data.ts` **2026-11-06 04:01:02.208 UTC**, **$74,070,623.20** reserves / **$73,920,779.79** liabilities and reported CR **100.2027%**, with composition/custody disclosures and dated HT Digital letters. This passes the template's transparent-attestation route. It does not establish independent collateral quality, private-account ownership, or cryptographic-proof validity; the circular reserve claims and assurance limits remain material Funds Management risks.
- [ ] **Total centralization** — **PASS, not triggered.** Tori is not controlled by a single key: a 3/5 Safe holds admin powers and a 24h timelock covers upgrades. The closest path is the Distributor `operator` [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006), a no-code address that can burn deposited vault trUSD with no onchain multiparty approval or timelock. A [Tori-published Accountable snapshot](https://github.com/yearn/risk-score/blob/2b5c19fb5c9af5cd3cdb89794f3495c2aefade79/reports/data/tori-strusd-2026-11-08.json) states that Fordefi confirmed a 3/4 manual approval policy for this wallet as of 2026-10-26. That is the same class of evidence accepted for Fordefi MPC control in [centrifuge-jaaa](https://github.com/yearn/risk-score/blob/master/reports/report/centrifuge-jaaa.md) and [midas-mglobal](https://github.com/yearn/risk-score/blob/master/reports/report/midas-mglobal.md), and more specific than either, so the operator is treated as attested MPC rather than a single-key EOA. The attestation is static, Tori-published and not enforced onchain, and the [observed automated cadence](https://github.com/yearn/risk-score/blob/368e2decaca9ae123acecbd415bffcabe0c9a8ed/reports/data/tori-strusd-2026-11-09.json) shows that an undisclosed API rule covers routine calls. Those limits are reflected in Governance. The gate should be reopened if the API rule is shown to cover `reportLoss`, or if the policy falls below three approvers. The custodian's reported 2/4 quorum is below that line, but it controls a transit balance of ~1.2% of reported reserves, not vault assets, so it is scored in Governance rather than treated as total control.

**All gates pass; proceed to category scoring.**

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

Two reputable firm audits with public PDFs, $1M critical bounty (private email channel, not Immunefi), no Safe Harbor. Asset age ~5 months / ~4 months above $1M TVL → History scored by asset age ≈ **4**. Blended:

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Governance: 4.5/5** — Upgrades and Minting parameters go through a 3/5 Safe and a 24h timelock, while the Safe can immediately confiscate blacklisted users' shares (`redistributeLockedAmount`) or cooled assets (`seizeCooldown`), drain the CCIP lockboxes and extend the cooldown to 90 days. Timelock executor and canceller are no-code addresses with reported 2/4 policies (Safe is proposer-only). Scored above the rubric's 3/5 row because the weakest material path, operator `reportLoss`, has no timelock and relies on an offchain policy that cannot be verified onchain and whose API coverage of `reportLoss` is undisclosed.

**Programmability: 4.0/5** — Vault math onchain, but NAV mint/redeem, reward injection, and loss recognition are privileged / offchain-driven; operator-driven `reportLoss` is a material admin loss path.

**Dependencies: 4.0/5** — Many critical deps (offchain book, custodians, CCIP, attestation). Offchain solvency is a practical single point of failure for economic value.

**Centralization = (4.5 + 4.0 + 4.0) / 3 = 4.1667** (retain full precision in the weighted total).

**Score: 4.17/5**

#### Category 3: Funds Management (Weight: 30%)

**Collateralization: 3.5/5** — Accountable reports **100.2027%** CR ($74.07M / $73.92M at November 6 04:01 UTC). Reserves are predominantly custodial/private-source assets; **4.64%** are reported Morpho loans against Tori-token collateral. Independent-reserve coverage under zero recovery of those claims would be **95.55%**, rather than the headline ratio. This stress exposure and private-account limitations constrain confidence in backing.

**Provability: 3.0/5** — strUSD accounting is onchain; trUSD backing has public Accountable disclosures and a dated HT Digital collateral-sighting letter. **90.36%** of the feed's reserves derive from private Asset Manager API inputs. Cryptographic blobs were not independently verified, and the letter does not provide completed ownership/controls assurance. Retained response fields make this assessment's public figures reproducible.

**Funds Management = (3.5 + 3.0) / 2 = 3.25**

**Score: 3.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

~$5.3M is pool **inventory**, not executable depth. Curve `get_dy` at snapshot: 1M strUSD → ~951,826 trUSD (−8.15% vs PPS); the Fluid leg brings the full strUSD→USDC route to ~951,119 USDC (−8.22%). The same address also holds 99.60% of the Fluid LP wrapper, so all three venues share one LP. Whitelist primary redeem + **7-day** strUSD cooldown. Inadequate vs Morpho-scale collateral without primary redeem access.

**Score: 4.0/5**

#### Category 5: Operational Risk (Weight: 5%)

Strong public docs (roles matrix, contracts, risks). Issuer Tori BVI / Foundation. Team not fully doxxed in materials reviewed. No Safe Harbor.

**Score: 2.5/5**

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 4.1667 | 30% | 1.25 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.55/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: Elevated Risk (3.55/5.0)** — limited approval with strict limits.

The final score reflects an offchain-attested operator loss path with no onchain approval or timelock. Additional risks are immediate Safe confiscation and lockbox control, custodian transfers under a 2/4 quorum, predominantly private-source backing, and circular Morpho reserve claims backed by Tori collateral. Secondary exit capacity is limited relative to pool inventory, and one address supplies effectively all of it. No wsrUSD/Reservoir exposure was identified in the reviewed public evidence; private positions were not exhaustively verified.

## Reassessment Triggers

- Time-based: ~60–90 days, or when asset age crosses 12 months
- TVL: DeFiLlama TVL < $40M or > $150M
- Accountable coverage ratio published below 100%, or attestation outage > 48h
- Growth or impairment of Tori-collateral Morpho reserve claims; SharpByte vault exposure changes; independent-reserve stress analysis
- Distributor `operator` change, `reportLoss` invocation, any change to the Fordefi policy, or disclosure that the API rule covers `reportLoss` (would trigger the Total centralization gate)
- Timelock queue: unexpected upgrade, new custodian, or `setMinter`
- Pause / gatekeeper `disableMintRedeem`; blacklist → redistribute/seize events
- CCIP lockbox vs remote supply divergence > immaterial dust; any withdrawal by the dominant exit-liquidity holder
- Morpho oracle / RedStone feed anomaly vs ERC-4626 rate
- Material audit / bounty / Safe Harbor change; replacement of operator with a Safe/timelocked path (would lower Governance)

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [November 4, 2026](https://github.com/yearn/risk-score/pull/577) | 5.00 GATED (ungated 3.60) | Initial assessment; November 6 validation retains the material-EOA gate, captures dated reserve evidence, identifies Tori-collateral Morpho backing claims, and corrects permission targets, oracle construction and intermediate score rounding. |
| [November 8, 2026](https://github.com/yearn/risk-score/pull/577) | 5.00 GATED (ungated 3.60) | Completes Ethereum-side CCIP and Safe inventories (including the undocumented Canton lane), measures the full USDC exit route and Curve LP concentration, adds oracle update rules, and records the Accountable-relayed MPC policy statement. Score unchanged. |
| [November 9, 2026](https://github.com/yearn/risk-score/pull/577) | 3.55 | Removes the Total centralization gate: Fordefi-attested MPC evidence is now treated consistently with other reports, with Governance lowered from 5.0 to 4.5 to reflect the undisclosed API rule on an automated operator. Pins Monad supply, reads Monad and Arbitrum controls, attributes the Morpho reserve loans, and finds one address supplying effectively all Curve and Fluid liquidity. Withdraws the earlier "match within dust" reconciliation. |
