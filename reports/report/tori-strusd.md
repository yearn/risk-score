# Protocol Risk Assessment: Tori Finance

- **Assessment Date:** November 4, 2026
- **Onchain Snapshot:** Ethereum block [26340122](https://etherscan.io/block/26340122) (November 4, 2026 08:01 UTC); DeFiLlama, GeckoTerminal, and remote-chain supplies fetched the same day
- **Token:** strUSD (Staked trUSD)
- **Chain:** Ethereum
- **Token Address:** [`0x280839980a7eD0D7717F64125fE241012E5F5815`](https://etherscan.io/address/0x280839980a7eD0D7717F64125fE241012E5F5815)
- **Final Score: 3.25/5.0**

## Overview + Links

Tori Finance issues **trUSD**, a synthetic dollar whose reserves are held in custody and deployed in hedged, market-neutral trading positions (futures basis / calendar spreads / money-market hedges), and **strUSD**, an Ethena-style ERC-4626 share of staked trUSD. Rewards from the trading book are streamed into the vault with an 8-hour vesting period; the share price (`totalAssets / totalSupply`) rises as rewards vest. Unstaking is gated by a **7-day cooldown**; cooled assets sit in a silo until the user claims.

This assessment covers **holding and using strUSD on Ethereum**, including the Morpho strUSD/USDC collateral use case described in issue #576. Economic risk is dominated by **trUSD's offchain delta-neutral backing**, not by the ERC-4626 staking wrapper itself.

**Key metrics (November 4, 2026, Ethereum block 26,340,122):**

| Metric | Value | Source |
|--------|-------|--------|
| Protocol TVL (DeFiLlama, Ethereum) | **~$72.56M** | [tori-finance](https://defillama.com/protocol/tori-finance), latest point 2026-11-04 06:35 UTC |
| trUSD total supply | **~72.80M** | `totalSupply()` |
| strUSD total supply | **~62.54M** | `totalSupply()` |
| strUSD `totalAssets` | **~64.81M trUSD** | ERC-4626 |
| strUSD exchange rate | **~1.0363 trUSD / strUSD** | `convertToAssets(1e18)` |
| Cooldown | **604,800 s (7 days)** | `cooldownDuration()` |
| First DeFiLlama TVL ≥ $1M | **2026-06-26** | DeFiLlama history |
| Token creation | Block [25,275,301](https://etherscan.io/block/25275301) (**2026-06-08**, ~148 days before snapshot) | Etherscan `getcontractcreation` |

**wsrUSD / Reservoir:** No wsrUSD, Reservoir, or recursive srUSD-style exposure was found in Tori's mint path, vault assets, custodian holdings, or documented strategy. Flagged here per Yearn convention because that exposure class is disallowed.

**Yearn / Morpho context (issue #576):** Create / use an strUSD/USDC Morpho market with strUSD as collateral. A live Morpho market already uses RedStone `strUSD_FUNDAMENTAL` (≈ ERC-4626 exchange rate) × Chainlink USDC/USD — that oracle is a **market** dependency, not part of the core mint path. Secondary DEX depth (~$5.3M across strUSD/trUSD, trUSD/USDC, frxUSD/trUSD) is far thinner than Morpho collateral in use, and `reportLoss` (≤5% of `totalAssets` / day) is the main way the fundamental feed can fall.

**Links:**

- [Protocol Documentation](https://docs.tori.finance/)
- [App](https://app.tori.finance) / [Transparency](https://app.tori.finance/transparency)
- [Contract Addresses](https://docs.tori.finance/resources/contracts)
- [Roles, Multisig and Timelocks](https://docs.tori.finance/security/roles)
- [Audits](https://docs.tori.finance/security/audits)
- [Backing & Reserves](https://docs.tori.finance/solution/backing)
- [Accountable attestations](https://tori.accountable.capital)
- [GitHub — tori-contracts](https://github.com/Tori-Finance/tori-contracts)
- [DeFiLlama](https://defillama.com/protocol/tori-finance)

## Contract Addresses

### Core (Ethereum)

| Contract | Address | Notes |
|----------|---------|-------|
| strUSD (StakedTrUSD) | [`0x2808…5815`](https://etherscan.io/address/0x280839980a7eD0D7717F64125fE241012E5F5815) | UUPS proxy; impl [`0x6561…977a`](https://etherscan.io/address/0x6561272e3EbC9f2e07cDB12B7c474Db9132b977a) |
| trUSD | [`0xd058…1697`](https://etherscan.io/address/0xd0580192E98eA6CEB9c7b6191Ed2E27560911697) | UUPS proxy; impl [`0xb1d1…f631`](https://etherscan.io/address/0xb1d133fE29255EB4Ac9B05d647d49cd7F05ff631) |
| Minting | [`0xe16b…3F1E`](https://etherscan.io/address/0xe16b821B9F6B0a6f06a2C4a61D5d1f71cFa53F1E) | Sole `minter` on trUSD |
| Staking Rewards Distributor | [`0xa0C4…D375`](https://etherscan.io/address/0xa0C49fFa4B7941830235cde974d9B2a8420CD375) | Holds `REWARDER_ROLE` on strUSD |
| trUSD Silo | [`0xF7c0…60B4`](https://etherscan.io/address/0xF7c0d8853E69DCD37ee7599c6280d2632F3360B4) | Holds cooled trUSD (~618.3k at snapshot) |
| ToriTimelock (24h) | [`0xA952…6ef4`](https://etherscan.io/address/0xA952453E39F77108Ee37C1b92de593F1C59A6ef4) | `getMinDelay() = 86,400`; replaced prior TL on 15 Sep 2026 per docs |
| Admin Safe (3/5) | [`0x0C6B…8316`](https://etherscan.io/address/0x0C6Bbfd2d5666d44bf28580eDEec0263692C8316) | Gnosis Safe; `DEFAULT_ADMIN` on core contracts |

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

Docs state every finding was fixed or formally acknowledged. Architecture is moderate complexity: UUPS tokens, AccessControl minting with whitelist + EIP-712 orders, ERC-4626 staking with cooldown/silo/vesting, and unmodified Chainlink CCIP pools.

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

**Mint mechanism (strUSD):** Open ERC-4626 deposit (trUSD in → shares out). Privileged `REWARDER_ROLE` can `transferInRewards` / `reportLoss` (loss capped at `MAX_DAILY_LOSS_BPS = 500` = 5%/day).

**Mint requires backing (strUSD shares):** Yes for deposits (trUSD transferred in same tx). Rewards mint economic value without new shares; `reportLoss` can reduce `totalAssets` without burning shares.

**trUSD mint authority** (verified RoleGranted/Revoked + `hasRole` / `minter()` at block 26,340,122):

| Address | Can Mint trUSD | Role / Mechanism | Notes |
|---------|:--------------:|------------------|-------|
| [`Minting 0xe16b…3F1E`](https://etherscan.io/address/0xe16b821B9F6B0a6f06a2C4a61D5d1f71cFa53F1E) | ✓ | Sole `minter()` on trUSD | Whitelist + EIP-712 + per-block caps |
| Minter EOAs `0x2ba9…`, `0x7713…`, `0xca43…` | via Minting | `MINTER_ROLE` | Submit user-signed orders only |
| Redeemer EOAs `0x3b45…`, `0xc885…`, `0xd5b3…` | burn path | `REDEEMER_ROLE` | Symmetric redeem path |

**Rate limits:** Global + per-collateral mint/redeem per-block caps as above; `stablesDeltaLimit = 0` at snapshot.

### Collateralization

Offchain delta-neutral book (docs: money markets, futures arb, calendar spreads). Not onchain blue-chip collateral. Protocol claims continuous ≥100% coverage via Accountable plus a separate revenue-funded reserve fund. **TODO / unverified this run:** live Accountable coverage ratio and AUM breakdown (dashboard TLS/`api` endpoints returned SPA HTML or 403 from this environment; attestation UI at tori.accountable.capital is public but figures were not machine-readable here).

### Exchange Rate

Onchain ERC-4626 rate only. No admin `setExchangeRate`. Rate moves via reward vesting (8h) and `reportLoss`. Morpho markets may use RedStone `strUSD_FUNDAMENTAL` ≈ this rate (market dependency).

### Residual Value

After a severe trading loss, residual value equals whatever Accountable-attested reserves and the reserve fund still cover, socialized via `reportLoss` into a lower strUSD PPS. No onchain senior/junior tranche inside Tori.

## Governance

### Onchain Permissions

| Role | Contract | Holder(s) at snapshot | Delay |
|------|----------|----------------------|-------|
| `DEFAULT_ADMIN_ROLE` | strUSD, trUSD, Minting | Admin Safe 3/5 | **None** (pause, grant/revoke ops roles, disable collateral, set per-block caps) |
| `TIMELOCK_ADMIN_ROLE` | strUSD, trUSD, Minting | Timelock [`0xA952…6ef4`](https://etherscan.io/address/0xA952453E39F77108Ee37C1b92de593F1C59A6ef4) | **24h** (upgrades, add collateral, add custodian, `setMinter`, `setStablesDeltaLimit`) |
| Timelock `PROPOSER_ROLE` | Timelock | Admin Safe | — |
| Timelock `EXECUTOR_ROLE` | Timelock | Admin Safe **and** EOA [`0x039e…0ce7`](https://etherscan.io/address/0x039e71e865a34bcaaebfc641291bec6517ea0ce7) | Docs claim Safe-only; onchain also grants an EOA |
| Timelock `CANCELLER_ROLE` | Timelock | Admin Safe **and** EOA [`0x6022…d065`](https://etherscan.io/address/0x60226cbb34445143e5f923abe2d42e5df852d065) | Docs: MPC canceller |
| `REWARDER_ROLE` | strUSD | Safe + Distributor | Can `reportLoss` ≤5%/day |
| `BLACKLIST_MANAGER_ROLE` | strUSD | Safe + EOA `0xb1e5…a169` | Compliance |
| `GATEKEEPER_ROLE` | Minting | 2 addresses (`0x5a54…`, `0xb044…`) | Can only strip powers / disable mint-redeem |
| `WHITELISTER_ROLE` | Minting | `0x541d…cf6` | Controls mint/redeem whitelist |
| `COLLATERAL_MANAGER_ROLE` | Minting | `0x39c9…213` | `transferToCustody` to timelock-registered custodians only |

Safe owners (3-of-5): `0x84e1…`, `0xfafE…`, `0xb5af…`, `0x9A45…`, `0x5378…`.

**Trust note:** Docs say the Timelock executor is the 3/5 Safe; onchain `EXECUTOR_ROLE` is also granted to EOA `0x039e…0ce7`. Execution still requires a previously Safe-proposed, 24h-queued operation.

### Upgradeability

UUPS on strUSD, trUSD, Minting. `_authorizeUpgrade` gated by `TIMELOCK_ADMIN_ROLE` → 24h timelock. CCIP pools are Chainlink LockReleaseTokenPool 2.0.0; `owner` = Admin Safe (no additional Timelock on pool owner calls observed).

## Oracles

- **Core protocol:** No price oracle for mint/redeem (whitelist NAV). Vault rate is pure ERC-4626 accounting.
- **Morpho market path (context):** RedStone `strUSD_FUNDAMENTAL` + Chainlink USDC/USD via MorphoChainlinkOracleV2 — see overview. Compromise or stale push affects Morpho liquidations, not trUSD minting.

## Dependencies

1. **Offchain trading / custody stack** — critical; economic solvency of trUSD.
2. **Accountable** continuous attestation — transparency layer (not a hard onchain gate).
3. **Chainlink CCIP** — lock/release hub; remote Burn & Mint on Monad / Pharos / Arbitrum / Solana (~13.23M strUSD and ~0.68M trUSD escrowed at snapshot; remote supplies reconcile to lockboxes within ~100 wei dust across verified chains).
4. **USDC / USDT** — mint collateral.
5. **RedStone** (Morpho use only).

## Liquidity Assessment

| Venue | Pair | Approx. TVL | 24h volume |
|-------|------|-------------|------------|
| Curve/Uni (GeckoTerminal) | strUSD / trUSD | **~$2.11M** | ~$303k |
| | trUSD / USDC | **~$2.09M** | ~$1.04M |
| | frxUSD / trUSD | **~$1.09M** | ~$212k |
| **Total secondary (ETH)** | | **~$5.3M** | |

Primary exit for verified parties: whitelist redeem of trUSD (rate-limited). strUSD holders first endure a **7-day cooldown**, then need secondary markets or a whitelist redeem of trUSD. CCIP moves inventory across chains but does not create USD liquidity.

## Cross-Chain Bridge

**Model: lock (Ethereum canonical) / mint (remotes)** via Chainlink CCIP CCT. See bridges.json `ccip` dependency `tori-strusd`. At snapshot, Ethereum lockboxes held ~13.23M strUSD and ~0.68M trUSD; summed remote supplies (Monad + Pharos + Arbitrum + Solana) matched within dust. Lane rate limit per docs: 1.5M tokens / 6h refill. Solana mint authority is 1-of-2 SPL multisig (pool signer **or** Tori MPC wallet with blocking policy); freeze/admin keys are Tori-controlled wallets per docs.

## Risk Score Assessment

**Scoring Guidelines:** Be conservative; use decimals; prioritize onchain evidence.

### Critical Risk Gates

- [ ] **No audit** — Sherlock + Nethermind public reports
- [ ] **Unverified contract source** — core contracts verified
- [ ] **Total centralization** — 3/5 Safe + 24h timelock on upgrades/custody expansion (not a single EOA admin)

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

Two reputable firm audits with public PDFs, $1M critical bounty (private email channel, not Immunefi), no Safe Harbor. Asset age ~5 months / ~4 months above $1M TVL → History scored by asset age ≈ **4**. Blended:

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Governance: 2.0/5** — 24h timelock on upgrades / add-custodian / add-collateral (precedent: 24h → Gov 2). Immediate Safe `DEFAULT_ADMIN` for pause and role grants; extra EOA executor/canceller on the timelock.

**Programmability: 3.5/5** — Vault math onchain, but NAV mint/redeem, reward injection, and loss recognition are privileged / offchain-driven.

**Dependencies: 4.0/5** — Many critical deps (offchain book, custodians, CCIP, attestation). Offchain solvency is a practical single point of failure for economic value.

**Centralization = (2.0 + 3.5 + 4.0) / 3 = 3.17**

**Score: 3.17/5**

#### Category 3: Funds Management (Weight: 30%)

**Collateralization: 3.5/5** — Claimed fully reserved delta-neutral book, not onchain blue-chip collateral; reserve fund exists but size not verified here.

**Provability: 3.5/5** — strUSD `totalAssets` is onchain trUSD; trUSD backing relies on Accountable attestations. Live coverage ratio **not verified** this run (TODO). Onchain custodian balances are a tiny fraction of supply.

**Funds Management = (3.5 + 3.5) / 2 = 3.5**

**Score: 3.5/5**

#### Category 4: Liquidity Risk (Weight: 15%)

~$5.3M DEX depth, whitelist primary redeem, **7-day** strUSD cooldown. Adequate for modest exits; insufficient vs Morpho-scale collateral without primary redeem access.

**Score: 3.5/5**

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
| Centralization & Control | 3.17 | 30% | 0.951 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score (floored)** | | | **3.25/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk (3.25/5.0)**

strUSD's onchain wrapper is conventional and timelocked, but economic value sits in an offchain delta-neutral book attested by Accountable, with a short (~5 month) track record, 7-day exits, and ~$5M secondary liquidity. Enhanced monitoring of Accountable coverage, custodian / timelock queues, CCIP lockboxes, and Morpho oracle/`reportLoss` events is appropriate. **No wsrUSD/Reservoir recursive exposure.**

## Reassessment Triggers

- Time-based: ~60–90 days, or when asset age crosses 12 months
- TVL: DeFiLlama TVL < $40M or > $150M
- Accountable coverage ratio published below 100%, or attestation outage > 48h
- Timelock queue: unexpected upgrade, new custodian, or `setMinter`
- `reportLoss` invocation or pause / gatekeeper `disableMintRedeem`
- CCIP lockbox vs remote supply divergence > immaterial dust
- Morpho oracle / RedStone feed anomaly vs ERC-4626 rate
- Material audit / bounty / Safe Harbor change

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| November 4, 2026 | 3.25 | Initial assessment (PR link TBD) |
