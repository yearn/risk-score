# Protocol Risk Assessment: Tori Finance

- **Assessment Date:** November 4, 2026
- **Onchain Snapshot:** Ethereum block [26340122](https://etherscan.io/block/26340122) (November 4, 2026 08:01 UTC); DeFiLlama, GeckoTerminal, and remote-chain supplies fetched the same day; Accountable / HT Digital PoR evidence dated 2026-10-23 and 2026-10-30
- **Token:** strUSD (Staked trUSD)
- **Chain:** Ethereum
- **Token Address:** [`0x280839980a7eD0D7717F64125fE241012E5F5815`](https://etherscan.io/address/0x280839980a7eD0D7717F64125fE241012E5F5815)
- **Final Score: 5.00/5.0**
- **Status:** GATED — capped by the material-EOA / Total centralization critical gate (Distributor `operator` EOA can `reportLoss` without Safe or timelock); ungated weighted score is **3.59** (Elevated). No realized loss event.

## Overview + Links

Tori Finance issues **trUSD**, a synthetic dollar whose reserves are held in custody and deployed in hedged, market-neutral trading positions (futures basis / calendar spreads / money-market hedges), and **strUSD**, an Ethena-style ERC-4626 share of staked trUSD. Rewards from the trading book are streamed into the vault with an 8-hour vesting period; the share price (`totalAssets / totalSupply`) rises as rewards vest. Unstaking is gated by a **7-day cooldown**; cooled assets sit in a silo until the user claims.

This assessment covers **holding and using strUSD on Ethereum**, including the Morpho strUSD/USDC collateral use case described in issue #576. Economic risk is dominated by **trUSD's offchain delta-neutral backing**, not by the ERC-4626 staking wrapper itself. A separate critical control risk is the **Distributor `operator` EOA**, which can burn deposited vault trUSD via `reportLoss` (≤5% of `totalAssets` per day, repeatable) with no Safe approval and no timelock.

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

**wsrUSD / Reservoir:** No wsrUSD, Reservoir, or recursive srUSD-style exposure was found in Tori's mint path, vault assets, custodian holdings, or documented strategy. Flagged here per Yearn convention because that exposure class is disallowed.

**Yearn / Morpho context (issue #576):** Create / use an strUSD/USDC Morpho market with strUSD as collateral. A live Morpho market already uses RedStone `strUSD_FUNDAMENTAL` (≈ ERC-4626 exchange rate) × Chainlink USDC/USD — that oracle is a **market** dependency, not part of the core mint path. Secondary DEX **inventory** is ~$5.3M across three pools, but usable exit liquidity is thinner (Curve `get_dy`: 1M strUSD → ~951,826 trUSD at snapshot). `reportLoss` (≤5% of `totalAssets` / day, callable by an EOA operator) is the main way the fundamental feed can fall.

**Links:**

- [Protocol Documentation](https://docs.tori.finance/)
- [App](https://app.tori.finance) / [Transparency](https://app.tori.finance/transparency)
- [Contract Addresses](https://docs.tori.finance/resources/contracts)
- [Roles, Multisig and Timelocks](https://docs.tori.finance/security/roles)
- [Audits](https://docs.tori.finance/security/audits)
- [Backing & Reserves](https://docs.tori.finance/solution/backing)
- [Accountable attestations](https://tori.accountable.capital)
- [HT Digital PoR letter (23 Oct 2026)](https://stablecoin.accountable.capital/file/HTDS_Tori_BVI_PoR_Letter_2026-10-23.pdf?v=20261029)
- [GitHub — tori-contracts](https://github.com/Tori-Finance/tori-contracts)
- [DeFiLlama](https://defillama.com/protocol/tori-finance)

## Contract Addresses

### Core (Ethereum)

| Contract | Address | Notes |
|----------|---------|-------|
| strUSD (StakedTrUSD) | [`0x2808…5815`](https://etherscan.io/address/0x280839980a7eD0D7717F64125fE241012E5F5815) | UUPS proxy; impl [`0x6561…977a`](https://etherscan.io/address/0x6561272e3EbC9f2e07cDB12B7c474Db9132b977a) |
| trUSD | [`0xd058…1697`](https://etherscan.io/address/0xd0580192E98eA6CEB9c7b6191Ed2E27560911697) | UUPS proxy; impl [`0xb1d1…f631`](https://etherscan.io/address/0xb1d133fE29255EB4Ac9B05d647d49cd7F05ff631) |
| Minting | [`0xe16b…3F1E`](https://etherscan.io/address/0xe16b821B9F6B0a6f06a2C4a61D5d1f71cFa53F1E) | Sole `minter` on trUSD; **directly deployed** (EIP-1967 impl slot = 0; not a UUPS proxy) |
| Staking Rewards Distributor | [`0xa0C4…D375`](https://etherscan.io/address/0xa0C49fFa4B7941830235cde974d9B2a8420CD375) | Holds `REWARDER_ROLE` on strUSD; Ownable → Admin Safe; `operator` = EOA |
| Distributor `operator` | [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) | **EOA** (`extcodesize` = 0 at block 26,340,122 and at tip); can call `reportLoss` / `transferInRewards` |
| trUSD Silo | [`0xF7c0…60B4`](https://etherscan.io/address/0xF7c0d8853E69DCD37ee7599c6280d2632F3360B4) | Holds cooled trUSD (~618.3k at snapshot) |
| ToriTimelock (24h) | [`0xA952…6ef4`](https://etherscan.io/address/0xA952453E39F77108Ee37C1b92de593F1C59A6ef4) | `getMinDelay() = 86,400`; replaced prior TL on 15 Sep 2026 per docs |
| Admin Safe (3/5) | [`0x0C6B…8316`](https://etherscan.io/address/0x0C6Bbfd2d5666d44bf28580eDEec0263692C8316) | Gnosis Safe; `DEFAULT_ADMIN` on core contracts; Timelock `PROPOSER` only |

### Chainlink CCIP (Ethereum hub — Lock & Release)

| Contract | Address |
|----------|---------|
| trUSD LockReleaseTokenPool 2.0.0 | [`0x6823…d463`](https://etherscan.io/address/0x6823666FD0869050a0530eB15BA568936234d463) |
| strUSD LockReleaseTokenPool 2.0.0 | [`0x63AA…66b9`](https://etherscan.io/address/0x63AAEFD6e9F8a306ad6AD60f18f882Ee7Da866b9) |
| trUSD ERC20LockBox | [`0x8D21…a37f`](https://etherscan.io/address/0x8D21EB2945c6084797De85D7AE0c163e1971a37f) (~**680.75k** trUSD) |
| strUSD ERC20LockBox | [`0xc1A9…8F86`](https://etherscan.io/address/0xc1A9e4BBb58573B8971C9b3C24e17f9851268F86) (~**13.23M** strUSD) |

Remote Burn & Mint representations (Monad, Pharos, Arbitrum, Solana) are listed in [docs](https://docs.tori.finance/resources/contracts). Pool `owner()` on both Ethereum pools = Admin Safe.

All core Ethereum contracts above are **verified** on Etherscan. Source matches [Tori-Finance/tori-contracts](https://github.com/Tori-Finance/tori-contracts).

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
- **Concentration:** Morpho / RockawayX Upshift ecosystem vaults are large strUSD users (Morpho market context); DEX LPs are secondary.

## Funds Management

Ultimate backing for strUSD is **trUSD**, which is itself backed by **offchain hedged trading positions** held with institutional custodians, continuously attested via [Accountable](https://tori.accountable.capital). Onchain at snapshot, the registered minting custodian EOA [`0x6339…1CC7`](https://etherscan.io/address/0x63392EaB47926f6Ee3E6ACA285B367A952001CC7) held only **~$689.7k USDC + ~$207.7k USDT** — not the bulk of the ~$72.8M liability. Nearly all economic backing is therefore **offchain**.

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
| Minter EOAs `0x2ba9…`, `0x7713…`, `0xca43…` | via Minting | `MINTER_ROLE` | Submit user-signed orders only |
| Redeemer EOAs `0x3b45…`, `0xc885…`, `0xd5b3…` | burn path | `REDEEMER_ROLE` | Symmetric redeem path |

**Rate limits:** Global + per-collateral mint/redeem per-block caps as above; `stablesDeltaLimit = 0` at snapshot.

### Collateralization

Offchain delta-neutral book (docs: money markets, futures arb, calendar spreads). Not onchain blue-chip collateral. Dated transparent attestation:

- **HT Digital Services Ltd letter, 23 October 2026 14:00 UTC** ([PDF](https://stablecoin.accountable.capital/file/HTDS_Tori_BVI_PoR_Letter_2026-10-23.pdf?v=20261029)): sight of **$73.079M** collateral vs **72.781M** trUSD in circulation (Ethereum block 26,255,786); **collateral ratio 100.41%**. Breakdown: money market $37.877M, bank deposits $15.313M, derivatives cash collateral $7.769M, listed equities (hedged) $5.890M, cash/receivables $0.102M, digital assets $6.127M. Letter states a future ISAE 3000 engagement is planned; this letter is a review of sighted collateral, not assurance.
- **Accountable dashboard capture, 2026-10-30 ~10:15 UTC** (RockawayX Protocol Transparency Rating / Accountable PTR PDF): total supply **USD 72,299,429** (matches onchain `totalSupply`), collateral ratio **~100.4%**, Reserve Fund **USD 292,103** (~0.40% of supply). Continuous Accountable PoR at [tori.accountable.capital](https://tori.accountable.capital).

### Exchange Rate

Onchain ERC-4626 rate only. No admin `setExchangeRate`. Rate moves via reward vesting (8h) and `reportLoss`. Morpho markets may use RedStone `strUSD_FUNDAMENTAL` ≈ this rate (market dependency).

### Residual Value

After a severe trading loss, residual value equals whatever Accountable-attested reserves and the reserve fund still cover, socialized via `reportLoss` into a lower strUSD PPS. No onchain senior/junior tranche inside Tori.

## Governance

### Onchain Permissions

| Role | Contract | Holder(s) at snapshot | Delay |
|------|----------|----------------------|-------|
| `DEFAULT_ADMIN_ROLE` | strUSD, trUSD, Minting | Admin Safe 3/5 | **None** — includes pause, grant/revoke ops roles, disable collateral, set per-block caps, **and** `redistributeLockedAmount` / `seizeCooldown` on strUSD |
| `TIMELOCK_ADMIN_ROLE` | strUSD, trUSD, Minting | Timelock [`0xA952…6ef4`](https://etherscan.io/address/0xA952453E39F77108Ee37C1b92de593F1C59A6ef4) | **24h** — upgrades on **strUSD/trUSD proxies**; on Minting: add collateral, add custodian, `setMinter`, `setStablesDeltaLimit` (Minting itself is **not** upgradeable) |
| Timelock `PROPOSER_ROLE` | Timelock | Admin Safe **only** | — |
| Timelock `EXECUTOR_ROLE` | Timelock | EOA [`0x039e…0ce7`](https://etherscan.io/address/0x039e71e865a34bcaaebfc641291bec6517ea0ce7) **only** | `hasRole(EXECUTOR, Safe) = false` at block 26,340,122 |
| Timelock `CANCELLER_ROLE` | Timelock | EOA [`0x6022…d065`](https://etherscan.io/address/0x60226cbb34445143e5f923abe2d42e5df852d065) **only** | `hasRole(CANCELLER, Safe) = false` at block 26,340,122 |
| `REWARDER_ROLE` | strUSD | Safe + Distributor | Can `reportLoss` ≤5%/day / `transferInRewards` |
| Distributor `operator` | Distributor | EOA [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) | **No delay**; calls Distributor → vault `reportLoss` / rewards |
| `BLACKLIST_MANAGER_ROLE` | strUSD | Safe + EOA [`0xb1e5…a169`](https://etherscan.io/address/0xb1e50b7a19b8f650a6ee77dc0ac52b88059fa169) | `addToBlacklist` / `removeFromBlacklist` (grants `FULL_RESTRICTED_STAKER_ROLE`) |
| `GATEKEEPER_ROLE` | Minting | 2 addresses (`0x5a54…`, `0xb044…`) | Can only strip powers / disable mint-redeem |
| `WHITELISTER_ROLE` | Minting | `0x541d…cf6` | Controls mint/redeem whitelist |
| `COLLATERAL_MANAGER_ROLE` | Minting | `0x39c9…213` | `transferToCustody` to timelock-registered custodians only |

Safe owners (3-of-5): `0x84e1…`, `0xfafE…`, `0xb5af…`, `0x9A45…`, `0x5378…`.

**Immediate confiscation (no 24h timelock):** After a address is blacklisted (`FULL_RESTRICTED_STAKER_ROLE`), Admin Safe as `DEFAULT_ADMIN` can call:

- `redistributeLockedAmount(from, to)` — burns all of `from`'s strUSD shares and mints them to `to` (or burns with no mint when `to == address(0)`, raising PPS for remaining stakers).
- `seizeCooldown(from, to)` — moves `from`'s cooled silo trUSD to `to`.

Blacklisting alone does not move funds; the Safe's immediate `DEFAULT_ADMIN` calls do. Neither path is timelocked.

**Trust note:** Docs say the Timelock executor is the 3/5 Safe. Onchain at block 26,340,122, `hasRole(EXECUTOR_ROLE, Safe) = false` and `hasRole(CANCELLER_ROLE, Safe) = false`; the listed EOAs return `true` for their respective roles. Safe remains the sole `PROPOSER`. Execution of a queued operation still requires a previously Safe-proposed, 24h-ready operation, but the executor key is an EOA, not the Safe.

### Critical Permission Paths and Weakest Link

A **material loss** here is loss of deposited trUSD in the strUSD vault (or confiscation of strUSD shares / cooled trUSD).

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| `Distributor.reportLoss` → `strUSD.reportLoss` burns vault trUSD | Operator EOA [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) (`extcodesize=0`); Distributor owned by Safe (can replace operator) | `MAX_DAILY_LOSS_BPS = 500` (5%/day) + daily cooldown; **no** Safe approval, **no** timelock; repeatable daily | ~**64.81M** vault trUSD (`totalAssets`); max single-day burn ~**3.24M** trUSD at snapshot |
| `strUSD.reportLoss` directly | Admin Safe via `REWARDER_ROLE` | Same 5%/day cap; 3/5 Safe | Same vault assets |
| Blacklist → `redistributeLockedAmount` / `seizeCooldown` | Blacklist: Safe + EOA `0xb1e5…`; redistribute/seize: Safe `DEFAULT_ADMIN` | No timelock; requires prior blacklist on `from` | Targeted user's shares / cooled silo assets |
| UUPS upgrade strUSD / trUSD | Timelock `TIMELOCK_ADMIN` → executor EOA after Safe proposes | 24h delay; Safe proposes | Full token/vault logic |
| Minting parameter / custody expansion (`addCustodian`, `setMinter`, add collateral) | Timelock `TIMELOCK_ADMIN` (Minting **not** upgradeable) | 24h delay | Mint/redeem path / custody set |

**Weakest credible path to material loss:** Distributor **operator EOA** [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) calling `reportLoss`. At block 26,340,122 the address has no code; a read-only simulation accepts burning the maximum ~3.24M deposited trUSD in one call. The 5%/day cap is code-enforced per period but does **not** bound lifetime cumulative loss — repeated daily calls can drain the vault. There is no Safe threshold and no timelock on this path. Comparably severe but higher-threshold: Safe 3/5 immediate `redistributeLockedAmount` / `seizeCooldown` after blacklist (targeted confiscation, no TL).

### Upgradeability

- **strUSD / trUSD:** UUPS proxies. `_authorizeUpgrade` gated by `TIMELOCK_ADMIN_ROLE` → 24h timelock.
- **Minting:** **Not upgradeable.** EIP-1967 implementation slot is zero; verified source is a directly deployed contract with no `upgradeTo` / `_authorizeUpgrade` entrypoint. Timelocked `TIMELOCK_ADMIN` permissions on Minting cover **parameters and custody set** only (add collateral, add custodian, `setMinter`, `setStablesDeltaLimit`), not implementation upgrades.
- **CCIP pools:** Chainlink LockReleaseTokenPool 2.0.0; `owner` = Admin Safe (no additional Timelock on pool owner calls observed).

## Oracles

- **Core protocol:** No price oracle for mint/redeem (whitelist NAV). Vault rate is pure ERC-4626 accounting.
- **Morpho market path (context):** RedStone `strUSD_FUNDAMENTAL` + Chainlink USDC/USD via MorphoChainlinkOracleV2 — see overview. Compromise or stale push affects Morpho liquidations, not trUSD minting.

## Dependencies

1. **Offchain trading / custody stack** — critical; economic solvency of trUSD.
2. **Accountable** continuous attestation — transparency layer (not a hard onchain gate); dated HT Digital letters + dashboard captures cited above.
3. **Chainlink CCIP** — lock/release hub; remote Burn & Mint on Monad / Pharos / Arbitrum / Solana (~13.23M strUSD and ~0.68M trUSD escrowed at snapshot; remote supplies reconcile to lockboxes within ~100 wei dust across verified chains).
4. **USDC / USDT** — mint collateral.
5. **RedStone** (Morpho use only).

## Liquidity Assessment

**Pool inventory (GeckoTerminal, ~snapshot day) — not the same as usable exit depth:**

| Venue | Pair | Pool | Approx. inventory TVL | 24h volume |
|-------|------|------|----------------------|------------|
| Curve | strUSD / trUSD | [`0x25a6…5ccb`](https://etherscan.io/address/0x25a637c80ad90177d0b3ff28aa2d3f74f7165ccb) | **~$2.11M** | ~$303k |
| Fluid DexT1 | trUSD / USDC | [`0x97f3…ee9c`](https://etherscan.io/address/0x97f32e5091d0e6aee24beb398e6592ae111dee9c) | **~$2.09M** | ~$1.04M |
| Curve | frxUSD / trUSD | [`0xd1d9…a6ff`](https://etherscan.io/address/0xd1d954bc94c843815ec7b8119f2de00af27fa6ff) | **~$1.09M** | ~$212k |
| **Total secondary inventory (ETH)** | | | **~$5.3M** | |

**Executable Curve exit quotes** (`get_dy`, block 26,340,122; coins[0]=strUSD, coins[1]=trUSD; pool balances ~1.048M strUSD / ~0.981M trUSD; PPS ~1.0363):

| Size (strUSD in) | trUSD out (`get_dy`) | vs PPS fair (~1.0363×) |
|------------------|----------------------|-------------------------|
| 100,000 | **103,517.22** | −0.11% |
| 250,000 | **258,559.92** | −0.20% |
| 500,000 | **515,897.83** | −0.43% |
| 1,000,000 | **951,825.67** | **−8.15%** |

Selling 1M strUSD on Curve returns only ~951,826 trUSD before any further conversion to USDC — usable exit liquidity is far below headline pool inventory. Fluid DexT1 (`0x97f3…ee9c`) inventory is ~$2.09M; Fluid quote helpers reverted with `FluidDexError(51002)` at this snapshot, so trUSD→USDC executable size was not measured onchain here. Secondary Curve frxUSD/trUSD path: 100k/250k/500k trUSD → frxUSD stay near 1:1, but 1M trUSD → only ~578k frxUSD (thin opposite-side depth).

Primary exit for verified parties: whitelist redeem of trUSD (rate-limited). strUSD holders first endure a **7-day cooldown**, then need secondary markets or a whitelist redeem of trUSD. CCIP moves inventory across chains but does not create USD liquidity.

## Cross-Chain Bridge

**Model: lock (Ethereum canonical) / mint (remotes)** via Chainlink CCIP CCT. See bridges.json `ccip` dependency `tori-strusd`. At snapshot, Ethereum lockboxes held ~13.23M strUSD and ~0.68M trUSD; summed remote supplies (Monad + Pharos + Arbitrum + Solana) matched within dust. Lane rate limit per docs: 1.5M tokens / 6h refill. Solana mint authority is 1-of-2 SPL multisig (pool signer **or** Tori MPC wallet with blocking policy); freeze/admin keys are Tori-controlled wallets per docs.

## Risk Score Assessment

**Scoring Guidelines:** Be conservative; use decimals; prioritize onchain evidence.

### Critical Risk Gates

- [ ] **No audit** — Sherlock + Nethermind public reports
- [ ] **Unverified contract source** — core contracts verified
- [ ] **Unverifiable reserves** — Restored. Dated transparent attestation obtained: HT Digital letter **2026-10-23** (100.41% CR; $73.079M collateral vs 72.781M trUSD) and Accountable dashboard capture **2026-10-30** (~100.4% CR; supply USD 72,299,429; Reserve Fund USD 292,103). Gate passes under the template's "onchain **or** transparent attestation" wording. Reserves remain offchain (reflected in Funds Management scores, not this gate).
- [x] **Total centralization** — **TRIGGERED** under the weakest-link / material-EOA rule ([TEMPLATE](../TEMPLATE.md) / #568): Distributor `operator` EOA [`0xA2AD…F006`](https://etherscan.io/address/0xA2ADCD948DCFB8AF6dB60c43C1c1B841e6d7F006) can burn deposited vault trUSD via `reportLoss` without Safe approval or timelock. Per-day 5% cap is not a qualifying lifetime bound; repeated calls are a material cumulative-loss path. Admin Safe 3/5 + 24h timelock on upgrades do **not** cover this operator path.

**Gate triggered → Final Score capped at 5.00 (Status: GATED).** Category scores below are the ungated rubric result for transparency.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

Two reputable firm audits with public PDFs, $1M critical bounty (private email channel, not Immunefi), no Safe Harbor. Asset age ~5 months / ~4 months above $1M TVL → History scored by asset age ≈ **4**. Blended:

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Governance: 5.0/5** — Weakest material path is an **EOA** (Distributor operator) that can burn deposited vault assets via `reportLoss` with no Safe/timelock (critical gate). Separately, Safe 3/5 can immediately confiscate blacklisted users' shares (`redistributeLockedAmount`) or cooled assets (`seizeCooldown`) with no 24h delay. Timelock executor/canceller are EOAs (Safe is proposer-only). 24h delay applies to proxy upgrades and Minting parameter/custody changes only.

**Programmability: 4.0/5** — Vault math onchain, but NAV mint/redeem, reward injection, and loss recognition are privileged / offchain-driven; operator-driven `reportLoss` is a material admin loss path.

**Dependencies: 4.0/5** — Many critical deps (offchain book, custodians, CCIP, attestation). Offchain solvency is a practical single point of failure for economic value.

**Centralization = (5.0 + 4.0 + 4.0) / 3 = 4.33**

**Score: 4.33/5**

#### Category 3: Funds Management (Weight: 30%)

**Collateralization: 3.5/5** — Attested fully reserved delta-neutral book (HT Digital 100.41% on 2026-10-23; Accountable ~100.4% on 2026-10-30), not onchain blue-chip collateral; Reserve Fund ~$292k (~0.40% of supply) at the Oct 30 capture.

**Provability: 3.0/5** — strUSD `totalAssets` is onchain trUSD; trUSD backing relies on Accountable continuous attestations plus dated HT Digital letters. Onchain custodian balances remain a tiny fraction of supply.

**Funds Management = (3.5 + 3.0) / 2 = 3.25**

**Score: 3.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

~$5.3M is pool **inventory**, not executable depth. Curve `get_dy` at snapshot: 1M strUSD → ~951,826 trUSD (−8.15% vs PPS) before USDC conversion; Fluid quote helpers unreproducible at this block. Whitelist primary redeem + **7-day** strUSD cooldown. Inadequate vs Morpho-scale collateral without primary redeem access.

**Score: 4.0/5**

#### Category 5: Operational Risk (Weight: 5%)

Strong public docs (roles matrix, contracts, risks). Issuer Tori BVI / Foundation; RockawayX visible as Morpho curator. Team not fully doxxed in materials reviewed. No Safe Harbor.

**Score: 2.5/5**

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 4.33 | 30% | 1.299 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Ungated weighted (floored)** | | | **3.59/5.0** |
| **Final Score (gate-capped)** | | | **5.00/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: High Risk (5.00/5.0, GATED)** — ungated weighted **3.59** would be Elevated.

strUSD's onchain wrapper is conventional and (for upgrades) timelocked, but (1) an EOA operator can socialize vault losses via `reportLoss` without Safe/timelock, (2) Safe can immediately confiscate blacklisted users' shares/cooled assets, and (3) economic value sits in an offchain delta-neutral book. Secondary exit depth is thin vs inventory headlines. Enhanced monitoring of Distributor `operator`, `reportLoss` events, Accountable coverage, custodian / timelock queues, CCIP lockboxes, and Morpho oracle feeds is appropriate. **No wsrUSD/Reservoir recursive exposure.**

## Reassessment Triggers

- Time-based: ~60–90 days, or when asset age crosses 12 months
- TVL: DeFiLlama TVL < $40M or > $150M
- Accountable coverage ratio published below 100%, or attestation outage > 48h
- Distributor `operator` change, or `reportLoss` invocation
- Timelock queue: unexpected upgrade, new custodian, or `setMinter`
- Pause / gatekeeper `disableMintRedeem`; blacklist → redistribute/seize events
- CCIP lockbox vs remote supply divergence > immaterial dust
- Morpho oracle / RedStone feed anomaly vs ERC-4626 rate
- Material audit / bounty / Safe Harbor change; replacement of operator with Safe/timelocked path (would reopen the material-EOA gate)

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [November 4, 2026](https://github.com/yearn/risk-score/pull/577) | 5.00 GATED (ungated 3.59) | Review fix: material-EOA `reportLoss` operator path; restore Unverifiable-reserves gate + dated PoR; Safe not TL executor/canceller; Minting non-UUPS; confiscation powers; Curve exit quotes vs inventory |
