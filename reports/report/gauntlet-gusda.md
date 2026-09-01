# Protocol Risk Assessment: Gauntlet USD Alpha (gtUSDa)

- **Assessment Date:** June 23, 2026 (Updated: August 31, 2026)
- **Token:** gtUSDa (Gauntlet USD Alpha)
- **Chain:** Ethereum (also deployed on Base, Optimism, Arbitrum)
- **Token Address:** [`0x3bd9248048df95db4fbd748c6cd99c1baa40bad0`](https://etherscan.io/token/0x3bd9248048df95db4fbd748c6cd99c1baa40bad0)
- **Final Score: 3.1/5.0**

## Overview + Links

Gauntlet USD Alpha (gtUSDa) is a yield-bearing stablecoin vault built on the Aera Protocol. It seeks to achieve the highest risk-adjusted yield on USDC by allocating across Morpho lending markets on Ethereum, Base, Arbitrum, and Optimism. The vault combines variable-rate and fixed-rate yield opportunities and is curated by Gauntlet's optimization engine.

The vault is part of the broader Gauntlet ecosystem ($1.49B total TVL across all chains) and targets institutional and crypto-native users. gtUSDa is deployed on 4 chains: Ethereum ($1.58M), Base ($51.77M), Arbitrum ($5.03M), and Optimism ($25K) — **~$58.4M aggregate TVL**. gtUSDa tokens represent a pro-rata claim on the vault's USDC deployed across strategies.

gtUSDa units are **non-transferable**: the vault's transfer hook only permits mint, burn, and transfers to or from the Provisioner. There is no secondary market and no DEX exit — see [Liquidity Risk](#liquidity-risk).

**Links:**

- [Protocol Documentation](https://vaultbook.gauntlet.xyz/vaults/gauntlet-usd-alpha-vault)
- [Protocol Dashboard/App](https://app.gauntlet.xyz/vaults/gtusda)
- [Integration Documentation](https://docs.gauntlet.xyz/onboarding/index)
- [Gauntlet Website](https://www.gauntlet.xyz)
- [Gauntlet DefiLlama](https://defillama.com/protocol/gauntlet)

## Audits and Due Diligence Disclosures

- The gtUSDa vault is the **Aera V3** `MultiDepositorVault` (deployed source on Etherscan imports `src/core/MultiDepositorVault.sol` and references the Aera codebase 120×; compiler v0.8.29). Audit coverage applies at the Aera Protocol level, and Aera publishes its audits on its [security page](https://docs.aera.finance/the-protocol/security).
- **Aera Protocol audits:**

| Firm | Date | Scope | Report |
|------|------|-------|--------|
| Spearbit | June 2025 | **Aera V3** (the MultiDepositorVault / Provisioner generation deployed here) | [Spearbit V3 PDF](https://drive.google.com/file/d/1YYJI6AIzcJku0VfWqDxyx7Jn7m0nIjtE/view?usp=sharing) (linked from Aera docs; hosted on Google Drive) |
| Cantina / Spearbit | June 2025 | Aera V3 audit competition (commit `4c24979c…`; $15K pool, 397 submissions) | [Cantina competition](https://cantina.xyz/competitions/ffe90f03-ffd0-449b-a15f-6e7702323d16) |
| Spearbit | Aug 2023 | Aera V2 | [Spearbit V2 PDF](https://github.com/aera-finance/aera-contracts-public/blob/main/v2/audits/spearbit/2023-09-22.pdf) |
| OpenZeppelin | May 2024 | Aera V2 — LlamaPay integration | [OpenZeppelin V2 PDF](https://github.com/aera-finance/aera-contracts-public/blob/main/v2/audits/openzeppelin/2024-05-15.pdf) |

- Aera docs state "all relevant issues identified by auditors were addressed prior to the launch of V3."
- **Caveat**: The V3 Spearbit report is hosted on Google Drive (not in the public `aera-contracts-public` repo), and the only V3 review by a tier-1 firm found is the single Spearbit engagement plus the small ($15K-pool) Cantina competition. No Trail of Bits / ChainSecurity / Sherlock engagement was located. The gtUSDa vault instance itself (its specific configuration) is not separately audited — coverage is at the protocol/contract level.
- Note: DefiLlama lists 0 audits for the Gauntlet protocol ([Gauntlet on DefiLlama](https://defillama.com/protocol/gauntlet)) because the audits are published under the Aera Protocol, not the Gauntlet listing.

### Bug Bounty

- **Active** — Aera runs a bug bounty on [Immunefi](https://immunefi.com/bug-bounty/aera/information/) with a max payout of **$500,000** (critical smart-contract bug, calculated as 10% of directly affected funds, min $20K). High = $10K, Medium = $2K, paid in USDC. Scope covers 5 assets across Ethereum, Arbitrum, Base, Polygon, and Optimism. KYC and a PoC are mandatory; the program runs under "Primacy of Rules."
- **Safe Harbor / SEAL**: not confirmed — no Safe Harbor or SEAL adoption is referenced on the Aera Immunefi page or docs.

## Historical Track Record

- **Time in production**: ~8.7 months (deployed December 8, 2025, block 23971333; [deployment tx](https://etherscan.io/tx/0x8da0ba49dca82b18232dd605e997359a0edd25f5dfad3e0186ea98ee79b88441))
- **Past incidents**: No known security incidents or exploits affecting the gtUSDa vault. The vault has never been paused: neither `Paused`/`Unpaused` on the vault nor `VaultPausedChanged` on the PriceAndFeeCalculator has fired since deployment.
- **TVL**: ~$58.4M aggregate across 4 chains as of August 31, 2026 (block 25,879,680). The broader Gauntlet protocol has $1.49B TVL across all chains.

| Chain | gtUSDa supply | Net asset value | Deposit cap |
|-------|--------------:|----------------:|------------:|
| Ethereum | 1,462,955.86 | $1,581,356 | $100M |
| Base | 47,894,375.81 | $51,770,228 | $200M |
| Arbitrum | 4,651,242.96 | $5,027,654 | $100M |
| Optimism | 22,864.17 | $24,715 | $100M |
| **Total** | **54,031,438.80** | **$58,403,953** | |

  - Source: onchain `totalSupply()` on each vault and `depositCap()` / `maxDeposit()` on each chain's Provisioner (NAV = `depositCap - maxDeposit`, denominated in USDC); [Gauntlet on DefiLlama](https://defillama.com/protocol/gauntlet) for the protocol-level figure.
- **TVL history**: The Ethereum deployment is small ($1.58M of locally issued units), while Base carries $51.77M — 88.6% — of the $58.4M aggregate. The Base leg has contracted from a ~$58M level in mid-2026, offset by roughly $5M arriving on Arbitrum; Ethereum and Optimism are broadly flat.
- **Historical peg**: gtUSDa is a yield-bearing token, not a stablecoin. Its price increases over time as yield accrues (admin-set unit price, currently 1.080904 USDC). No depeg events are applicable.
- **Unit-price continuity**: every price write has stayed inside the ±0.10% tolerance band — a breach would have emitted `VaultPausedChanged`, and none exists.

## Funds Management

- **Yield strategy**: The vault allocates USDC to Morpho lending markets across Ethereum mainnet, Base, Arbitrum, and Optimism. The Gauntlet optimization engine allocates to the highest risk-adjusted yield opportunities.
- **Assets are pooled across chains, claims are not.** Each chain runs its own `MultiDepositorVault` with its own asset pool, but the unit price is a single global figure computed offchain from the whole system's NAV and applied identically on all four chains (1.080904, 1.080905, 1.080917 and the Arbitrum equivalent differ only by update timing). Capital is therefore not held in proportion to where units were issued: the Ethereum vault holds **~$14.00M of assets against $1.58M of locally issued gtUSDa**, while the Base vault holds ~$34.9M of identified Morpho positions (Gauntlet USDC Prime, plus idle USDC) against $51.77M of locally issued units. The practical consequences are that (a) Ethereum-side redemptions are backed by far more local capital than local claims, and (b) a loss in any chain's positions is mutualised into the single global unit price, so Ethereum holders carry Base, Arbitrum, and Optimism strategy risk.
- **Ethereum allocation** (block 25,879,678):

| Position | Contract | Value | Share |
|----------|----------|------:|------:|
| Gauntlet USDC Frontier (Morpho V2) | [`0x9a1D6bd5b8642C41F25e0958129B85f8E1176F3e`](https://etherscan.io/address/0x9a1D6bd5b8642C41F25e0958129B85f8E1176F3e) | $10,211,688 | 72.9% |
| Gauntlet USDC RWA (MetaMorpho V1.1) | [`0xA8875aaeBc4f830524e35d57F9772FfAcbdD6C45`](https://etherscan.io/address/0xA8875aaeBc4f830524e35d57F9772FfAcbdD6C45) | $3,780,837 | 27.0% |
| Idle USDC | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | $10,000 | 0.07% |
| Aave v3 aEthUSDC, Gauntlet USDC Prime (Morpho V2) | — | $1,371 | 0.01% |
| **Total** | | **$14,003,895** | |

- **Strategy constraints** (from [docs](https://vaultbook.gauntlet.xyz/vaults/gauntlet-usd-alpha-vault/optimization-and-risk-management-considerations)):
  - Max 40% exposure to non-blue-chip stablecoins
  - Position sizes constrained by vault and DEX liquidity
  - Collateral exposure constrained by DEX liquidity
  - Token turnover constrained by spot DEX liquidity
- **Fees**: Administered via the PriceAndFeeCalculator. Both fee rates are currently **zero** — `getVaultState()` returns a TVL fee of 0 bps and a performance fee of 0 bps, with 0 accrued vault fees and 0 accrued protocol fees. No `VaultFeesSet` event has ever fired for this vault and `FeesClaimed` has never been emitted. Fee parameters can be raised by the fee-calculator governance (separate 1-day timelock) without user consent.
- **Reward harvesting**: incentives arrive as RLUSD and USDT claimed from the [Merkl Distributor](https://etherscan.io/address/0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae) and are swapped to USDC by the guardian through an unverified third-party swap contract [`0x8f10…f996`](https://etherscan.io/address/0x8f10b468b06c6fd214b65f87778827f7d113f996), in trades of a few hundred dollars each. The non-USDC balances are transient (RLUSD balance is currently zero).

### Accessibility

- **Deposits (mint)**: **Asynchronous only.** `tokensDetails(USDC)` on the Provisioner returns `asyncDepositEnabled = true`, `asyncRedeemEnabled = true`, `syncDepositEnabled = false`, with deposit and redeem multipliers both at 10000 bps (no haircut). Because sync deposits are disabled, the Provisioner's `deposit()` and `mint()` revert with `Aera__SyncDepositDisabled` — entry runs through `requestDeposit(token, tokensIn, minUnitsOut, solverTip, deadline, maxPriceAge, isFixedPrice)`, which escrows the depositor's USDC and waits for a solver.
- **Withdrawals (redeem)**: Anyone can request redemption of gtUSDa for USDC via the Provisioner's `requestRedeem()`, settled by a solver through `solveRequestsVault()` (permissioned) or `solveRequestsDirect()` (permissionless, tip-incentivised).
- **Atomicity**: Neither direction is atomic for the user. Both entry and exit post a request that a third party must fill before the user's `deadline`; the only atomicity guarantee is that when a solver does fill, USDC and gtUSDa move in the same transaction.
- **Transferability**: gtUSDa units are non-transferable. The vault's `beforeTransferHook` is the [`TransferBlacklistHook`](https://etherscan.io/address/0x1703a1B0fee4D507CA8a743f04E168BCd4862d24), whose `isVaultUnitTransferable(gtUSDa)` is `false`, so any transfer that is not a mint, a burn, or a transfer to/from the Provisioner reverts with `Aera__VaultUnitsNotTransferable`. All 327 `Transfer` events emitted since deployment involve the zero address or the Provisioner; there has never been a peer-to-peer transfer. The hook additionally blocks addresses flagged by a Chainalysis-interface sanctions oracle [`0x40C57923924B5c5c5455c48D93317139ADDaC8fb`](https://etherscan.io/address/0x40C57923924B5c5c5455c48D93317139ADDaC8fb).
- **Rate limits**: `depositCap()` on the Ethereum Provisioner is **$100,000,000** (1e14 in USDC units) and `maxDeposit()` reports $98,418,685 of remaining headroom. Caps on the other chains are $200M (Base) and $100M each (Arbitrum, Optimism). The cap is measured against the vault's NAV in numeraire, and governance (timelock) can change it via `setDepositDetails()`. Deposits also carry a `depositRefundTimeout()` of 3600 seconds, during which an authorised caller can claw back a settled deposit via `refundDeposit()`.

### Token Mint Authority

**Mint mechanism:** Role-gated via the Provisioner contract. The MultiDepositorVault restricts minting (`enter()`) and burning (`exit()`) to the single `provisioner` address via the `onlyProvisioner` modifier (direct address equality check, not through the authority system).

**Mint requires backing:** Yes. The Provisioner escrows the depositor's USDC at `requestDeposit()` time and only mints when a solver settles the request, so USDC and gtUSDa move together. There is no path for unbacked mint through the deposit flow.

**Per-address mint authority** (token contract [`0x3bd9248048df95db4fbd748c6cd99c1baa40bad0`](https://etherscan.io/address/0x3bd9248048df95db4fbd748c6cd99c1baa40bad0)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11`](https://etherscan.io/address/0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11) | ✓ | ✓ | `provisioner` (direct address check) | Provisioner contract. Owner = TimelockController [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) (1-day delay). The provisioner can be changed by the timelock via `setProvisioner()`. |

**Provisioner owner governance chain:**
- Gauntlet Multisig (Gnosis Safe, 3/9 threshold) [`0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f`](https://etherscan.io/address/0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f) — holds PROPOSER_ROLE and EXECUTOR_ROLE on the TimelockController
- TimelockController [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) — 1-day delay (`getMinDelay()` = 86400), owner of vault, provisioner, and RolesAuthority

**Rate limits / supply caps:** The Provisioner enforces a $100M deposit cap on the Ethereum vault, measured in numeraire against total NAV. Governance (timelock) can change it via `setDepositDetails()`.

**Backing check at mint time:** The Provisioner holds the depositor's USDC in escrow from `requestDeposit()` and releases it to the vault in the same transaction that mints `unitsOut` gtUSDa. No path exists to mint without backing.

### Collateralization

- **Collateral type**: All positions are USDC-denominated. The vault's supply asset is USDC [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48), and every strategy leg is a USDC ERC-4626 deposit. What matters for solvency, however, is not the denomination but what the underlying Morpho markets lend against.
- **Look-through collateral (Ethereum)**: the Ethereum vault's two Morpho positions resolve to a heavily concentrated market mix.

| Market collateral | Look-through value | Share of vault assets |
|-------------------|-------------------:|----------------------:|
| `AA_FalconXUSDC` (77% LLTV) | $13,267,189 | **94.7%** |
| cbBTC (86% LLTV) | $589,928 | 4.2% |
| LBTC (86% LLTV) | $116,650 | 0.8% |
| PRIME (86% LLTV) | $15,586 | 0.1% |
| Idle USDC | $10,000 | 0.1% |
| PT-sUSDD-27AUG2026, PT-USDG, SPYon, others | $4,542 | <0.1% |

  Derived from the Ethereum vault's Frontier ($10.21M) and RWA ($3.78M) positions and each vault's per-market allocation: Frontier is 93.05% `AA_FalconXUSDC` and Gauntlet USDC RWA is 99.59% `AA_FalconXUSDC`.
- **Dominant exposure is private credit, not crypto collateral**: `AA_FalconXUSDC` ([`0xC26A6Fa2C37b38E549a4a1807543801Db684f99C`](https://etherscan.io/address/0xC26A6Fa2C37b38E549a4a1807543801Db684f99C)) is an `IdleCDOTranche` — the **senior (AA) tranche of the Pareto FalconX USDC credit vault**, i.e. an undercollateralised loan to a crypto prime broker wrapped as an ERC-20. Roughly 95% of the Ethereum vault's assets ultimately sit behind FalconX's ability to repay, subordinated only by the vault's BB junior tranche. This is a materially different risk profile from the blue-chip crypto collateral the strategy constraints describe, and it is the single largest driver of principal risk on this deployment.
- **The collateral is marked at the issuer's own book value**: the [market](https://app.morpho.org/ethereum/market/0xe83d72fa5b00dcd46d9e0e860d95aa540d5ec106da5833108a9f826f21f36f52/) uses a `MorphoChainlinkOracleV2` [`0x52eA2C12734B5bB61e1edf52Bb0f01D9206493Fc`](https://etherscan.io/address/0x52eA2C12734B5bB61e1edf52Bb0f01D9206493Fc) whose only feed is a `TranchesChainlinkOracle` [`0x50449B3D1f5931d568A1951Ee506A9534e7f7dFf`](https://etherscan.io/address/0x50449B3D1f5931d568A1951Ee506A9534e7f7dFf). That feed passes through the CDO's `virtualPrice(AA)` (currently 1.102079) and returns `roundId = 0` and `updatedAt = 0` — there is no market price, no staleness metadata, and no independent valuation. A write-down only reaches the oracle when Pareto records it on the CDO, and the CDO itself is a `TransparentUpgradeableProxy` ([`0x433D5B175148dA32Ffe1e1A37a939E1b7e79be4d`](https://etherscan.io/address/0x433D5B175148dA32Ffe1e1A37a939E1b7e79be4d), admin [`0x9438…f351`](https://etherscan.io/address/0x9438904abc7d8944a6e2a89671fef51c629af351)), so its pricing logic is upgradeable.
- **Backing ratio**: Every gtUSDa token represents a pro-rata claim on the system-wide USDC NAV plus accrued yield. Realized backing depends on the solvency and liquidity of the underlying Morpho markets and of the cross-chain positions, and — because the unit price is global — on positions held on chains other than the one the holder redeems from.
- **Yield / market risk**: Principal can be impaired if a market suffers bad debt, collateral/oracle failure, curator misconfiguration, or insufficient liquidity during withdrawals. The vault does not employ leverage directly, but lending-market exposure remains a principal-loss path. The FalconX market currently pays a 5.74% supply APY at 90.3% utilization.
- **Liquidations**: The vault does not borrow and faces no liquidation risk of its own. Liquidations in the dominant market are structurally constrained, though: `AA_FalconXUSDC` has no liquid secondary market, and redemption at the CDO is gated by Pareto's ~28.5-day epoch cycle (`epochDuration()` = 2,466,720 s), during which the CDO reports `paused() = true` and `isEpochRunning() = true`. A liquidator seizing this collateral mid-epoch cannot convert it until the epoch closes.
- **Peg stability**: The unit price of gtUSDa is set via `setUnitPrice()` on the PriceAndFeeCalculator. The oracle hard-codes USDC = $1 as per [Gauntlet docs](https://vaultbook.gauntlet.xyz/resources/frequently-asked-questions/oracles). The price value is computed **offchain** by Gauntlet's optimization engine (total USDC across all chains + accrued yield ÷ gtUSDa total supply) and then submitted onchain by a keeper. This means the gtUSDa exchange rate (PPS) is an admin-updated value reflecting accrued yield — see [Price-Setting Flow](#price-setting-flow) below for the full onchain-verified mechanism.
- **Risk curation**: Gauntlet's automated risk management system curates allocations, applying risk constraints (40% max non-blue-chip exposure, liquidity caps, etc.). The published constraints are framed around stablecoin and DEX-liquidity limits and do not appear to bound single-market or private-credit concentration, which is where the current allocation sits.

### Provability

- **Onchain verification**: The total supply of gtUSDa is fully onchain (`totalSupply()`), and the Ethereum vault's positions can be read directly (idle USDC $9,999.80; Provisioner USDC balance $0.01; ERC-4626 shares in Frontier and RWA convertible via `convertToAssets()`). What cannot be checked from Ethereum alone is whether those assets back the units issued on Ethereum: they do not correspond one-to-one, because the vault holds ~$14.00M against $1.58M of local claims and the price is a global figure. Verifying gtUSDa's backing therefore requires aggregating four chains.
- **Yield calculation**: Yield is reflected in the unit price. The price is computed **offchain** by Gauntlet's optimization engine (aggregating USDC positions across Ethereum, Base, Arbitrum, and Optimism Morpho markets), then submitted onchain by a keeper EOA. It is **not** computed programmatically from onchain data in a single transaction.
- **Valuation of the dominant position**: ~95% of the Ethereum vault's assets are valued through the Pareto CDO's `virtualPrice`, an issuer-reported book value with no market price behind it and no staleness metadata on the feed. Even a full cross-chain aggregation of onchain balances inherits that valuation rather than independently verifying it.
- **PPS (Price Per Share)**: The conversion between gtUSDa and USDC is managed by `convertTokenToUnits()` / `convertUnitsToToken()` on the PriceAndFeeCalculator, which references the stored unit price. The price is set via `setUnitPrice()` — see [Price-Setting Flow](#price-setting-flow) below for the complete onchain-verified mechanism.
- **Reserve transparency**: While individual balance snapshots are onchain, the full cross-chain position requires aggregation. The Gauntlet App provides live market allocations per docs.
- **Third-party verification**: None identified. No Chainlink Proof of Reserve or external attestation mechanisms.

### Price-Setting Flow

The unit price of gtUSDa is determined through a multi-step offchain→onchain pipeline. The following is verified onchain from contract source and transaction traces.

**Step 1 — Offchain computation:** Gauntlet's optimization engine aggregates total USDC deployed across all chains (Ethereum, Base, Arbitrum, Optimism Morpho markets), adds accrued yield, and divides by gtUSDa `totalSupply()`. This produces the new unit price. This computation is **entirely offchain** — it is not performed by any single onchain contract call.

**Step 2 — Keeper submission:** The keeper EOA [`0xdd998274ed12bb12d818800915cfb8f87cbc2801`](https://etherscan.io/address/0xdd998274ed12bb12d818800915cfb8f87cbc2801) submits the price onchain by calling the **Forwarder** contract [`0xc219d47B645e3446b81889F18B34238310c792d0`](https://etherscan.io/address/0xc219d47B645e3446b81889F18B34238310c792d0) (verified as `Forwarder`, owned by the main TimelockController). The Forwarder is the vault's designated **accountant** (`vaultAccountant[gtUSDa]`) and enforces a per-caller, per-(target, selector) allowlist. Its `CallerCapabilityAdded` log shows exactly four capabilities, all granted to that one keeper: `setUnitPrice` and `setInitialPrice` on the PriceAndFeeCalculator, `checkSetUnitPrice` on the MinimumUpdateIntervalGuard, and `solveRequestsVault` on the Provisioner — so the same key that prices the vault is also the permissioned solver. The price call batches two operations:

1. `checkSetUnitPrice(PriceAndFeeCalculator, vault, timestamp)` on **MinimumUpdateIntervalGuard** [`0xbfb2040d37f5da34938a367ef3ae0786fd6a861a`](https://etherscan.io/address/0xbfb2040d37f5da34938a367ef3ae0786fd6a861a) — pre-validates that the minimum update interval has elapsed.
2. `setUnitPrice(vault, price, timestamp)` on **PriceAndFeeCalculator** [`0x8F3FfA11CD5915f0E869192663b905504A2Ef4a5`](https://etherscan.io/address/0x8F3FfA11CD5915f0E869192663b905504A2Ef4a5).

Example transaction: [`0xe5aebe0ef8a7470b85964b143cbf45ced0a81e7eedb91b14832fca6422719499`](https://etherscan.io/tx/0xe5aebe0ef8a7470b85964b143cbf45ced0a81e7eedb91b14832fca6422719499) (block 25381302).

**Step 3 — Onchain validation in `setUnitPrice()`:**

*Soft guards / pause triggers (violation = vault pause, but price is **always written**):*
| Guard | Current gtUSDa Threshold | Source |
|-------|--------------------------|--------|
| Max price **decrease** | **0.10%** (`minPriceToleranceRatio = 9990 BPS`) | [`ThresholdsSet` event block 23971333](https://etherscan.io/tx/0x8da0ba49dca82b18232dd605e997359a0edd25f5dfad3e0186ea98ee79b88441#eventlog) |
| Max price **increase** | **0.10%** (`maxPriceToleranceRatio = 10010 BPS`) | Same as above |
| Min update interval | **60 minutes** | Same as above |
| Max price age | **255 seconds** (~4.25 min) | Same as above |
| Max update delay | **7 days** (`maxUpdateDelayDays = 7`) | `getVaultState(gtUSDa)` |

These thresholds have not changed since deployment — `ThresholdsSet` has fired exactly once, in the deployment transaction.

**Critical finding:** When a soft guard is violated, `_shouldPause()` returns `true` and the vault is paused — but the new price is **still written to storage** (`vaultPriceState.unitPrice = price`). The vault owner can subsequently call `unpauseVault(vault, price, timestamp)` to resume operations at that price. There are **no hard limits** preventing arbitrary price setting — the tolerance bounds are a circuit breaker that the vault owner can override, not a prevention mechanism.

**Step 4 — Usage:** Deposits and withdrawals use the stored unit price via `convertTokenToUnits()` / `convertUnitsToToken()`. When the vault is paused, the `*IfActive` conversion variants revert (blocking deposits/withdrawals), but the non-`IfActive` versions still return the paused price.

**Current state:** unit price 1.080904 USDC, equal to `highestPrice`; last written August 31, 2026 18:55 UTC (`getVaultsPriceAge()` ≈ 1.9 hours); vault not paused; accrual lag 0.

## Liquidity Risk

- **The redemption queue is the only exit.** gtUSDa units are non-transferable (`isVaultUnitTransferable(gtUSDa) = false` on the transfer hook), so there is no DEX pool, no OTC transfer, and no way for a holder to exit except by posting a redeem request and waiting for a solver. A holder who needs liquidity cannot sell into a market at a discount; the position is illiquid until someone settles the request.
- **Withdrawal queues**: Async exits use `requestRedeem(token, unitsIn, minTokensOut, solverTip, deadline, maxPriceAge, isFixedPrice)`, which escrows the user's gtUSDa and posts a request carrying a user-set `solverTip` and `deadline`. Requests are settled in one of two ways: `solveRequestsVault(token, Request[])` — gated by `requiresAuth`, in practice the Gauntlet keeper acting through the accountant Forwarder, settling against vault liquidity — or `solveRequestsDirect(token, Request[])` — **permissionless**, where any party fills the request from its own funds and collects the `solverTip`. The permissionless path is the fallback if the Gauntlet solver goes offline; absent any solver, a request simply expires at its `deadline` and the units are returned.
- **Liquidity depth**: The Ethereum vault holds $9,999.80 of idle USDC against $1.58M of locally issued units and ~$14.00M of deployed assets. Any redemption beyond the idle balance requires the guardian to first withdraw from the underlying Morpho vaults, which is a discretionary, offchain-triggered operation rather than an automatic queue.
- **Underlying liquidity is the binding constraint**: ~95% of the Ethereum vault's assets sit in the `AA_FalconXUSDC` market, which currently has $49.02M supplied against $44.25M borrowed — **90.3% utilization, leaving $4.77M of free market liquidity against the vault's $13.27M of exposure**. Exiting more than that requires either borrowers to repay or the seized collateral to be redeemed at the Pareto CDO, which is gated by a ~28.5-day epoch (`paused() = true`, `isEpochRunning() = true` while an epoch runs; the current epoch ends September 1, 2026).
- **Slippage**: Not applicable in the traditional DEX sense — redemptions settle at the admin-set unit price. The risk is timing rather than price: cross-chain recall via CCTP and epoch-gated underlying redemption both add delay.
- **Historical liquidity**: No periods of market stress observed since deployment (~8.7 months). The vault has not experienced a major withdrawal event, so the solver path and the underlying unwind have not been tested at size.

## Centralization & Control Risks

### Governance

- **Contract upgradeability**: The MultiDepositorVault is NOT a proxy — it is an immutable deployed contract. Code changes require full redeployment. The Provisioner and PriceAndFeeCalculator are also non-proxy contracts.
- **Owner**: The vault owner is a TimelockController [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) with a 1-day delay (`getMinDelay()` = 86400).
- **Multisig**: Gauntlet Gnosis Safe [`0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f`](https://etherscan.io/address/0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f) — 3-of-9 multisig, holds PROPOSER_ROLE, EXECUTOR_ROLE, and CANCELLER_ROLE on the vault timelock. The timelock holds `DEFAULT_ADMIN_ROLE` over itself; no other address holds any role. Signer identities: not validated per assessment rules.
- **Timelock delay**: 1 day on both timelocks (`getMinDelay()` = 86400). The vault timelock was raised from 6 hours to 24 hours on June 1, 2026 ([`MinDelayChange`](https://etherscan.io/tx/0xbe36de0991b99ec9eb26283bddcd1c4fa3eb9068575de6b694e7935a7ad7c342), block 25223762); no timelock operation has been scheduled or executed since.
- **Separate Fee governance**: The PriceAndFeeCalculator has its own governance path via TimelockController [`0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B`](https://etherscan.io/address/0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B) (1-day delay), owner of RolesAuthority [`0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40`](https://etherscan.io/address/0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40) and of the Whitelist. Its PROPOSER, EXECUTOR, and CANCELLER roles are held by a **3-of-7 Gnosis Safe** [`0x5cc25c6b59c551d15941144ca060d330eb02fc62`](https://etherscan.io/address/0x5cc25c6b59c551d15941144ca060d330eb02fc62), granted at the timelock's deployment in May 2025. This is Aera protocol-level governance shared across Aera vaults rather than a gtUSDa-specific control, and it is live, not frozen — fee parameters, pause state, price thresholds, and the whitelist all sit behind it.

**Privileged roles and potential harm paths:**

| Action | Who | Constraint | Harm potential |
|--------|-----|-----------|----------------|
| Change provisioner address | Timelock (1-day delay) | Owner of vault | High — could set malicious provisioner that mints unbacked gtUSDa or steals deposited USDC |
| Pause vault | Timelock OR Guardian | `requiresAuth` or guardian | Medium — freezes deposits/withdrawals temporarily |
| Unpause vault | Timelock only | `requiresAuth` | Time-locked — cannot be done without 1-day delay |
| Set unit price | Keeper EOA → Forwarder (owner = Timelock 1-day) | `setUnitPrice()` only callable by vault's designated accountant (Forwarder `0xc219…92d0`). **Price updates bypass the timelock** — the keeper calls the Forwarder directly. Soft guards trigger pause if price deviates >±0.10% or update interval <60 min, but price is **always set** regardless. Vault owner can unpause at new price. | High — could manipulate gtUSDa exchange rate instantly; soft guards only pause, never block; no timelock delay on price changes |
| Set fees | FeeCalc Timelock (1-day), proposed by 3/7 Safe | `setVaultFees()` requires auth | Medium — fees are currently 0/0 bps and can be raised without user consent |
| Add/remove guardians, set guardian root | Timelock | `setGuardianRoot()` requires auth | Medium-High — defines what the single guardian key may execute via `submit()` |
| Execute vault operations | Guardian EOA `0x42141d…c9b2` → guardian Forwarder | Merkle proof against the current guardian root; no delay | High — rebalances, claims, and swaps run through one hot key at guardian speed |
| Set provisioner (vault) | Timelock | `setProvisioner()` requires auth | High — controls who can mint/burn |
| Set fee recipient | Timelock | `setFeeRecipient()` requires auth | Low-Medium — controls fee destination |
| Enable/disable unit transfers | Vault owner (Timelock) via transfer hook | `setIsVaultUnitsTransferable()` | Low — currently disabled; enabling would create a secondary market |
| Change deposit cap / token modes | Timelock | `setDepositDetails()`, `setTokenDetails()` requires auth | Medium — can halt new deposits or re-enable sync deposits |

- **Guardian system**: `getActiveGuardians()` returns two guardians, both `Forwarder` contracts owned by the vault timelock: [`0x4F169C3A6545CE65Ecb26502218f90eEd610bEbf`](https://etherscan.io/address/0x4F169C3A6545CE65Ecb26502218f90eEd610bEbf) and [`0x249759B13879515219c482F3f2700fCC696293F9`](https://etherscan.io/address/0x249759B13879515219c482F3f2700fCC696293F9). Each grants exactly one capability, to the same EOA [`0x42141d0291e1e62993faf0dc2fc6371bd928c9b2`](https://etherscan.io/address/0x42141d0291e1e62993faf0dc2fc6371bd928c9b2): `submit(bytes)` on the vault. Operationally this means **a single hot key drives all vault rebalancing, reward claiming, and swapping**, constrained only by the Merkle root the timelock has set for that guardian. Roots are rotated frequently — 16 `GuardianRootSet` events since deployment, most recently June 25 and August 4, 2026 — so the set of permitted operations changes roughly monthly through the 1-day timelock.
- **Pause/freeze/seize**: Governance can pause the vault. While paused, deposits and withdrawals are halted. The Whitelist contract [`0xdDfd960a7150520548dD1F6E53CC2f201b364692`](https://etherscan.io/address/0xdDfd960a7150520548dD1F6E53CC2f201b364692) (84 entries, owned by the FeeCalc timelock) gates which addresses guardians may interact with, and the transfer hook can block sanctioned addresses and can flip gtUSDa transferability on or off via `setIsVaultUnitsTransferable()`.

### Programmability

- **System operations**: Mostly programmatic — deposits and withdrawals are handled by the Provisioner contract automatically. However, the unit price (PPS) is set administratively, and strategy allocations are determined by Gauntlet's offchain optimization engine.
- **PPS definition**: The price per share is set offchain by Gauntlet's engine and submitted onchain by a keeper EOA via the Forwarder → `setUnitPrice()`. It is **not** computed programmatically from onchain data within the transaction. The current tolerance thresholds (verified onchain from `ThresholdsSet` event at [block 23971333](https://etherscan.io/tx/0x8da0ba49dca82b18232dd605e997359a0edd25f5dfad3e0186ea98ee79b88441)): max price increase **+0.10%**, max decrease **−0.10%**, min update interval **60 minutes**, max price age **255 seconds**. These are **soft guards** — violating them triggers a vault pause but the new price is **always written**. See [Price-Setting Flow](#price-setting-flow) for the complete mechanism.
- **Offchain dependencies**: The Gauntlet optimization engine (offchain) determines strategy allocations. The Provisioner executes onchain transactions based on these offchain decisions. If the offchain engine fails or provides incorrect data, allocations could be suboptimal.
- **Keepers/relayers**: Because sync deposits are disabled, **both** entry and exit depend on a solver. `solveRequestsVault()` runs through the accountant Forwarder, whose only authorised caller is the keeper EOA [`0xdd9982…2801`](https://etherscan.io/address/0xdd998274ed12bb12d818800915cfb8f87cbc2801) — the same key that writes the unit price. The `solveRequestsDirect()` path is permissionless and tip-incentivized, providing a fallback if the privileged solver is offline, though it requires a third party willing to warehouse the position; without any solver, requests simply expire at their `deadline`.
- **Operational key concentration**: two EOAs carry the day-to-day system: `0xdd9982…2801` (pricing + request settlement, via the accountant Forwarder) and `0x42141d…c9b2` (all vault operations, via the two guardian Forwarders). Neither is behind a multisig or a delay; the timelock's control is limited to which capabilities and Merkle roots those keys are granted.

### External Dependencies

- **Morpho**: The vault deploys USDC into Morpho lending markets across multiple chains, on Ethereum through the Gauntlet USDC Frontier (Morpho V2), Gauntlet USDC RWA (MetaMorpho V1.1), and Gauntlet USDC Prime vaults. Morpho is a well-established lending protocol, but risk depends on specific market collateral, oracle configuration, borrower health, liquidation performance, and curator choices. A severe Morpho market failure can impair principal, not just yield.
- **Pareto Credit and FalconX** — the dominant dependency on this deployment. About 94.7% of the Ethereum vault's assets sit behind the `AA_FalconXUSDC` Morpho market, whose collateral is the senior tranche of the Pareto FalconX USDC credit vault. That chain of trust runs: gtUSDa → Gauntlet Frontier/RWA → Morpho market → Pareto `IdleCDO` (upgradeable proxy) → an unsecured credit exposure to FalconX. Three distinct failure modes stack here — FalconX non-repayment, a Pareto CDO write-down or upgrade that mis-prices the tranche, and the epoch lock that prevents redemption for up to ~28.5 days at a time.
- **Curators**: the Frontier and RWA vaults share an owner ([`0xC684c6587712e5E7BDf9fD64415F23Bd2b05fAec`](https://etherscan.io/address/0xC684c6587712e5E7BDf9fD64415F23Bd2b05fAec)) and a curator ([`0x9E33faAE38ff641094fa68c65c2cE600b3410585`](https://etherscan.io/address/0x9E33faAE38ff641094fa68c65c2cE600b3410585)), both Gauntlet-controlled. Gauntlet is therefore on both sides of this allocation: it curates gtUSDa and it curates the Morpho vaults gtUSDa deposits into, so the "external" diversification is thinner than the vault count suggests. The RWA vault carries a 3-day curator timelock; the V2 Frontier vault exposes no equivalent getter.
- **Cross-chain bridging**: The bridge is **Circle CCTP (Cross-Chain Transfer Protocol, V2)** — native USDC burn-and-mint, not a third-party lock-and-mint bridge. Vault USDC outflows go to Circle's CCTP V2 `TokenMinterV2` ([`0xfd78ee919681417d192449715b2594ab58f5d002`](https://etherscan.io/address/0xfd78ee919681417d192449715b2594ab58f5d002)) on the burn side — 145 such transfers since June 23, 2026 — and USDC inflows arrive minted from the zero address on the receive side. Using canonical CCTP means there is no extra bridge-operator trust assumption beyond Circle itself; cross-chain risk reduces to Circle/CCTP availability and message-attestation finality rather than a bespoke bridge's security.
- **USDC (Circle)**: The underlying asset is USDC, which carries its own regulatory and custodial risks. USDC is one of the most established stablecoins with ~$60B market cap.
- **Merkl and DEX routing**: reward incentives are claimed from the [Merkl Distributor](https://etherscan.io/address/0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae) in RLUSD and USDT and swapped to USDC through an unverified swap contract [`0x8f10…f996`](https://etherscan.io/address/0x8f10b468b06c6fd214b65f87778827f7d113f996). Trade sizes are a few hundred dollars, so the exposure is immaterial, but it does place unverified code in the guardian's execution path.
- **Aave v3**: a residual `aEthUSDC` position ([`0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c`](https://etherscan.io/address/0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c)) is used intermittently as an allocation venue; the current balance is dust.
- **Oracle**: gtUSDa's own unit price is admin-set and hard-codes USDC = $1, so a Chainlink outage does not directly affect it. The look-through exposure is oracle-dependent, however: the dominant market prices its collateral through a `TranchesChainlinkOracle` that reports the Pareto CDO's internal `virtualPrice` with no staleness metadata.
- **Aera Protocol**: The vault and its infrastructure contracts are built on Aera Protocol. Any vulnerability in Aera's MultiDepositorVault, RolesAuthority, Provisioner, Forwarder, or Guardian system would affect gtUSDa. Aera-level governance (the 3/7 Safe behind the FeeCalc timelock) also controls fee, threshold, pause, and whitelist parameters for this vault.

## Operational Risk

- **Team**: Gauntlet is a well-known entity in DeFi with 8+ years of experience. The team has a strong reputation for risk management and has managed substantial TVL across DeFi protocols. The multisig signers are not individually validated per assessment rules.
- **Documentation**: Gauntlet provides extensive, well-maintained documentation via [VaultBook](https://vaultbook.gauntlet.xyz) and separate [integration docs](https://docs.gauntlet.xyz). However, specific audit reports for gtUSDa are not publicly available, and the full contract reference for Aera Protocol is not documented in the integration site.
- **Legal structure**: The operating entity is **Gauntlet Networks, Inc.**, a US company headquartered in New York City, founded in 2018 by Tarun Chitra (CEO), John Morrow, and Rei Chiang; it is a Series-B-funded firm ([Gauntlet team](https://www.gauntlet.xyz/our-team), [Crunchbase](https://www.crunchbase.com/person/tarun-chitra)). The exact state of incorporation and the contracting entity for vault terms were not separately verified.
- **Incident response**: No formal, published incident-response plan was found in the Gauntlet/Aera docs. The closest documented emergency controls are protocol-level: per the [Aera security page](https://docs.aera.finance/the-protocol/security), the vault owner "has the power to stop vault operations at any point and to remove the guardian role." Vulnerability disclosure is handled through the [Immunefi bug bounty](https://immunefi.com/bug-bounty/aera/information/); no dedicated `security.txt` or published security contact was located.

## Monitoring

### Key Addresses to Monitor

| Address | Name | Purpose |
|---------|------|---------|
| [`0x3bd9248048df95db4fbd748c6cd99c1baa40bad0`](https://etherscan.io/address/0x3bd9248048df95db4fbd748c6cd99c1baa40bad0) | MultiDepositorVault (Ethereum) | gtUSDa token contract — $1.58M of units, ~$14.00M of assets |
| [`0x000000000001CdB57E58Fa75Fe420a0f4D6640D5`](https://basescan.org/address/0x000000000001CdB57E58Fa75Fe420a0f4D6640D5) | MultiDepositorVault (Base) | gtUSDa token contract — $51.77M of units |
| [`0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC`](https://arbiscan.io/address/0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC) | MultiDepositorVault (Arbitrum) | gtUSDa token contract — $5.03M of units |
| [`0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC`](https://optimistic.etherscan.io/address/0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC) | MultiDepositorVault (Optimism) | gtUSDa token contract — $25K of units |
| [`0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11`](https://etherscan.io/address/0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11) | Provisioner | Deposit/withdrawal handler, mint authority, $100M deposit cap |
| [`0x8F3FfA11CD5915f0E869192663b905504A2Ef4a5`](https://etherscan.io/address/0x8F3FfA11CD5915f0E869192663b905504A2Ef4a5) | PriceAndFeeCalculator | Unit price oracle, fee calculator |
| [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) | TimelockController (Vault) | Vault governance timelock (1-day delay) |
| [`0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B`](https://etherscan.io/address/0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B) | TimelockController (FeeCalc) | Fee/threshold/whitelist governance timelock (1-day delay) |
| [`0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f`](https://etherscan.io/address/0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f) | Gnosis Safe (3/9) | Gauntlet multisig; PROPOSER, EXECUTOR, CANCELLER on vault timelock; feeRecipient |
| [`0x5cc25c6b59c551d15941144ca060d330eb02fc62`](https://etherscan.io/address/0x5cc25c6b59c551d15941144ca060d330eb02fc62) | Gnosis Safe (3/7) | Aera-level multisig; PROPOSER, EXECUTOR, CANCELLER on FeeCalc timelock |
| [`0xC14604f43ED73011B60426FE6c48317d6583e67e`](https://etherscan.io/address/0xC14604f43ED73011B60426FE6c48317d6583e67e) | RolesAuthority (Vault) | Access control for vault functions |
| [`0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40`](https://etherscan.io/address/0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40) | RolesAuthority (FeeCalc) | Access control for fee calculator |
| [`0xdDfd960a7150520548dD1F6E53CC2f201b364692`](https://etherscan.io/address/0xdDfd960a7150520548dD1F6E53CC2f201b364692) | Whitelist | Address whitelist for vault interactions (84 entries) |
| [`0x1703a1B0fee4D507CA8a743f04E168BCd4862d24`](https://etherscan.io/address/0x1703a1B0fee4D507CA8a743f04E168BCd4862d24) | TransferBlacklistHook | Enforces gtUSDa non-transferability and sanctions screening |
| [`0xc219d47B645e3446b81889F18B34238310c792d0`](https://etherscan.io/address/0xc219d47B645e3446b81889F18B34238310c792d0) | Forwarder (Accountant) | Keeper → `setUnitPrice()` / `solveRequestsVault()` relay; owner = vault timelock |
| [`0x4F169C3A6545CE65Ecb26502218f90eEd610bEbf`](https://etherscan.io/address/0x4F169C3A6545CE65Ecb26502218f90eEd610bEbf) | Forwarder (Guardian 1) | Active guardian; grants `submit(bytes)` to the guardian EOA |
| [`0x249759B13879515219c482F3f2700fCC696293F9`](https://etherscan.io/address/0x249759B13879515219c482F3f2700fCC696293F9) | Forwarder (Guardian 2) | Active guardian; grants `submit(bytes)` to the guardian EOA |
| [`0xbfb2040d37f5da34938a367ef3ae0786fd6a861a`](https://etherscan.io/address/0xbfb2040d37f5da34938a367ef3ae0786fd6a861a) | MinimumUpdateIntervalGuard | Pre-checks min update interval before price updates |
| [`0xdd998274ed12bb12d818800915cfb8f87cbc2801`](https://etherscan.io/address/0xdd998274ed12bb12d818800915cfb8f87cbc2801) | Keeper EOA | Writes the unit price and settles async requests |
| [`0x42141d0291e1e62993faf0dc2fc6371bd928c9b2`](https://etherscan.io/address/0x42141d0291e1e62993faf0dc2fc6371bd928c9b2) | Guardian EOA | Executes all vault operations through the guardian Forwarders |
| [`0x9a1D6bd5b8642C41F25e0958129B85f8E1176F3e`](https://etherscan.io/address/0x9a1D6bd5b8642C41F25e0958129B85f8E1176F3e) | Gauntlet USDC Frontier | Morpho V2 vault — 72.9% of Ethereum assets |
| [`0xA8875aaeBc4f830524e35d57F9772FfAcbdD6C45`](https://etherscan.io/address/0xA8875aaeBc4f830524e35d57F9772FfAcbdD6C45) | Gauntlet USDC RWA | MetaMorpho V1.1 vault — 27.0% of Ethereum assets |
| [`0x433D5B175148dA32Ffe1e1A37a939E1b7e79be4d`](https://etherscan.io/address/0x433D5B175148dA32Ffe1e1A37a939E1b7e79be4d) | Pareto FalconX IdleCDO | Issues `AA_FalconXUSDC`; epoch state and `virtualPrice` drive ~95% of asset value |
| [`0xfd78ee919681417d192449715b2594ab58f5d002`](https://etherscan.io/address/0xfd78ee919681417d192449715b2594ab58f5d002) | Circle CCTP v2 TokenMinterV2 | Cross-chain USDC burn/mint counterparty |

### Critical Events & Functions

**Governance changes (monitor daily):**
- `ProvisionerSet(address)` on vault — mint authority change
- `VaultFeesSet(address,uint16,uint16)` on PriceAndFeeCalculator — fee change away from 0/0 bps
- `ThresholdsSet(...)` on PriceAndFeeCalculator — price-guard loosening
- `GuardianRootSet(address,bytes32)` / `removeGuardian()` on vault — guardian set and permitted-operation changes
- `CallerCapabilityAdded` / `CallerCapabilityRemoved` on all three Forwarders — new keys granted price, solver, or `submit()` rights
- `VaultUnitTransferableSet` on the TransferBlacklistHook — gtUSDa becoming transferable
- `AuthorityUpdated` on vault / RolesAuthority — authority override
- Timelock `CallScheduled` / `CallExecuted` / `MinDelayChange` — any pending governance action or delay reduction
- Multisig `AddedOwner` / `RemovedOwner` / `ChangedThreshold` on both Safes — signer set changes

**Operational events (monitor hourly):**
- `Enter()` / `Exit()` on vault — large deposit/withdrawal activity
- `VaultPausedChanged(address,bool)` on PriceAndFeeCalculator — soft-guard breach or governance pause
- `UnitPriceUpdated(address,uint128,uint32)` — price writes and gaps between them
- `setPublicCapability()` on RolesAuthority — access control changes
- `submit()` on vault — guardian-executed operations

**Data fetching functions:**
- `totalSupply()` on each chain's vault → circulating gtUSDa per chain
- `getVaultState(vault)` on PriceAndFeeCalculator → unit price, paused flag, thresholds, fees (expect 0/0 bps)
- `getVaultsPriceAge(vault)` on PriceAndFeeCalculator → seconds since last price update (expect <1 hour, hard ceiling 7 days)
- `getMinDelay()` on both Timelocks → timelock delay (should remain ≥86400)
- `depositCap()` / `maxDeposit()` on Provisioner → cap and remaining headroom; the difference is the vault's NAV
- `tokensDetails(USDC)` on Provisioner → sync/async deposit and redeem modes, and the deposit/redeem multipliers
- `vaultAccountant(vault)` on PriceAndFeeCalculator → accountant (should be Forwarder `0xc219…92d0`)
- `getActiveGuardians()` and `getGuardianRoot(address)` on vault → guardian set and current roots
- `isVaultUnitTransferable(vault)` on the TransferBlacklistHook → expect `false`
- `balanceOf(vault)` + `convertToAssets()` on Frontier and RWA → Ethereum asset mix; compare against `depositCap - maxDeposit` to track the local asset-versus-claim gap
- `paused()`, `isEpochRunning()`, `epochEndDate()`, `virtualPrice(AA)` on the Pareto FalconX CDO → redemption window and the mark on ~95% of Ethereum assets

**Offchain data sources:**
- [Gauntlet App](https://app.gauntlet.xyz/vaults/gtusda) — live market allocations, APY
- [DeFi Llama — Gauntlet](https://defillama.com/protocol/gauntlet) — TVL tracking
- [Morpho `AA_FalconXUSDC` market](https://app.morpho.org/ethereum/market/0xe83d72fa5b00dcd46d9e0e860d95aa540d5ec106da5833108a9f826f21f36f52/) — utilization and free liquidity in the dominant market
- [Morpho](https://morpho.org) — underlying market health

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GOVERNANCE LAYER                              │
│                                                                      │
│  ┌─────────────────────────────────────────────┐                    │
│  │ Gauntlet Multisig (Gnosis Safe, 3/9)        │                    │
│  │ 0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f  │                    │
│  └─────┬───────────────────────────────┬───────┘                    │
│        │ PROPOSER + CANCELLER         │ EXECUTOR_ROLE                │
│        ▼                              ▼                              │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ TimelockController (Vault, 1-day delay)                 │        │
│  │ 0x72820eA60C344186465152e4b11e260CAE391d77              │        │
│  │ Owner of: Vault, Provisioner, RolesAuthority(Vault)      │        │
│  └──┬──────────────────┬──────────────────┬───────────────┘        │
│     │ owns             │ owns             │ owns                     │
│     ▼                  ▼                  ▼                          │
│  ┌──────────┐  ┌────────────────┐  ┌──────────────────────┐        │
│  │ Vault    │  │ Provisioner    │  │ RolesAuthority(Vault) │        │
│  │ 0x3bd... │  │ 0x74C4A...     │  │ 0xC146...             │        │
│  └──────────┘  └────────────────┘  └──────────────────────┘        │
│        ▲              │                                                │
│        │ onlyProvisioner (mint/burn)                                   │
│        └──────────────┘                                                │
│                                                                      │
│  ┌─────────────────────────────────────────────┐                    │
│  │ Aera Multisig (Gnosis Safe, 3/7)            │                    │
│  │ 0x5cc25c6b59c551d15941144ca060d330eb02fc62  │                    │
│  └─────┬───────────────────────────────────────┘                    │
│        │ PROPOSER + EXECUTOR + CANCELLER                             │
│        ▼                                                             │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ TimelockController (FeeCalc, 1-day delay)               │        │
│  │ 0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B             │        │
│  │ Owner of: PriceAndFeeCalculator, RolesAuthority(FeeCalc),│        │
│  │           Whitelist                                      │        │
│  └──┬────────────────────────┬────────────────────────────┘        │
│     │ owns                   │ owns                                  │
│     ▼                        ▼                                       │
│  ┌────────────────────┐  ┌──────────────────────────┐              │
│  │PriceAndFeeCalculator│  │ RolesAuthority(FeeCalc)  │              │
│  │ 0x8F3FfA...        │  │ 0xA83C...                │              │
│  └────────────────────┘  └──────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        OPERATIONS LAYER                              │
│                                                                      │
│  Keeper EOA 0xdd9982...        Guardian EOA 0x42141d...             │
│        │                              │                              │
│        ▼                              ▼                              │
│  ┌──────────────────┐    ┌────────────────────────────────┐        │
│  │ Forwarder        │    │ Forwarder (Guardian) x2         │        │
│  │ (Accountant)     │    │ 0x4F169C... / 0x249759...       │        │
│  │ 0xc219d4...      │    │ capability: submit(bytes)       │        │
│  │ setUnitPrice,    │    └──────────────┬─────────────────┘        │
│  │ setInitialPrice, │                   │ Merkle-proofed ops        │
│  │ checkSetUnitPrice│                   ▼                           │
│  │ solveRequestsVlt │            ┌──────────┐                       │
│  └──────────────────┘            │ Vault    │                       │
│                                  └──────────┘                       │
│  ┌──────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │ Whitelist        │  │ TransferBlacklistHook │  │ MinUpdate    │  │
│  │ 0xdDfd... (84)   │  │ 0x1703a1...           │  │ IntervalGuard│  │
│  │                  │  │ transfers DISABLED    │  │ 0xbfb204...  │  │
│  └──────────────────┘  └──────────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL DEPENDENCY LAYER                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Morpho — Ethereum allocation                                  │   │
│  │  • Gauntlet USDC Frontier (V2)  0x9a1D6b...   72.9%          │   │
│  │  • Gauntlet USDC RWA (V1.1)     0xA8875a...   27.0%          │   │
│  │  • Gauntlet USDC Prime (V2), Aave v3 aEthUSDC   dust         │   │
│  │        │ 93.05%                    │ 99.59%                   │   │
│  │        ▼                           ▼                          │   │
│  │  ┌────────────────────────────────────────────────────┐      │   │
│  │  │ Morpho market AA_FalconXUSDC/USDC · 77% LLTV       │      │   │
│  │  │ = 94.7% of Ethereum vault assets                   │      │   │
│  │  │ 90.3% utilization, $4.77M free liquidity           │      │   │
│  │  └───────────────────────┬────────────────────────────┘      │   │
│  └──────────────────────────┼───────────────────────────────────┘   │
│                             ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Pareto IdleCDO (upgradeable) 0x433D5B...                      │   │
│  │  AA senior tranche 0xC26A6F... — priced by virtualPrice       │   │
│  │  ~28.5-day epoch gates redemption; borrower: FalconX          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────┐    │
│  │ USDC (Circle)│  │ Circle CCTP v2   │  │ Merkl Distributor  │    │
│  │ 0xA0b869...  │  │ 0xfd78ee91...    │  │ 0x3Ef3D8...        │    │
│  └──────────────┘  └──────────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

Fund Flow:
  User USDC ──→ Provisioner (escrow) ──→ solver settles ──→ Vault
                          │                                    │
                          │ mint gtUSDa (non-transferable)     │
                          ▼                                    ▼
                         User                    Morpho vaults / CCTP
                                                          │
                                                          ▼
                                              Unit Price updated
                                              by keeper (global NAV)
```

---

## Risk Summary

### Key Strengths

- Built on the audited Aera V3 Protocol by Gauntlet (Gauntlet Networks, Inc.), a team with 8+ years of DeFi experience and $1.49B in managed TVL
- Audited (Spearbit V3, June 2025 + Cantina competition) with an active $500K Immunefi bug bounty
- Non-upgradeable vault contract (immutable) eliminates proxy upgrade risk
- Dual-timelock governance (1-day delay) for both vault and fee operations; the vault timelock's delay was raised from 6 to 24 hours in June 2026
- Fees are currently zero (0 bps TVL, 0 bps performance) and no fee has ever been claimed
- All strategy legs are USDC-denominated with no direct leverage; cross-chain transfers use canonical Circle CCTP rather than a bespoke bridge
- Clean operating history — never paused, no incidents, and every price write inside the ±0.10% band since December 2025
- The Ethereum vault holds ~$14.00M of assets against $1.58M of locally issued units, so local redemption capacity is far ahead of local claims

### Key Risks

- **Single-market concentration in private credit** — ~94.7% of the Ethereum vault's assets look through to one Morpho market collateralized by the Pareto senior tranche of a FalconX loan, marked at the issuer's own `virtualPrice`
- No secondary market — gtUSDa is non-transferable, so the redemption queue is the only exit, and both entry and exit depend on a solver because sync deposits are disabled
- Underlying liquidity is thin relative to exposure — the dominant market runs at 90.3% utilization with $4.77M free against $13.27M of vault exposure, and collateral redemption is gated by a ~28.5-day Pareto epoch
- Admin-controlled unit price (PPS) — exchange rate is keeper-submitted from offchain NAV with soft-guard-only limits (±0.10%, 60-min cooldown) that pause but never block malicious prices
- Two unprotected hot keys run the system: one writes the price and settles requests, the other executes every vault operation
- Highly concentrated holder base — top holder 55.7%, top 3 85.7% of supply across 72 holders
- Cross-chain loss mutualization — one global unit price means Ethereum holders absorb losses from Base, Arbitrum, and Optimism positions
- Gauntlet curates both gtUSDa and the Morpho vaults it deposits into, so the intermediate vault layer adds little independent risk oversight
- Provisioner address change could redirect all deposited USDC
- Audit coverage rests on a single tier-1 V3 engagement (Spearbit) plus a small audit competition; the V3 report is only Google-Drive-hosted

### Critical Risks

- **Concentrated private-credit exposure**: roughly 95% of the Ethereum vault's assets resolve to the `AA_FalconXUSDC` Morpho market. The collateral is an `IdleCDOTranche` representing the senior claim on an unsecured loan to FalconX, valued by a feed that passes through the Pareto CDO's own `virtualPrice` with `updatedAt = 0`. A FalconX credit event, a Pareto write-down, or an upgrade to the CDO proxy propagates directly into gtUSDa's NAV, and there is no independent market price to contradict the issuer's mark. Because the market runs at 90.3% utilization and the tranche can only be redeemed between ~28.5-day epochs, an exit at size is not available on demand.
- **Admin-controlled PPS**: The unit price is set offchain and submitted by a keeper EOA via the Forwarder. Soft guards (±0.10% per update tolerance, 60-min cooldown, 255s max price age) trigger a vault pause if exceeded — but the new price is **always written** and the vault owner can unpause at that price. There are no hard limits preventing arbitrary price manipulation, but pausing is triggered if the price is outside the guards. A malicious or compromised keeper/governance could manipulate the gtUSDa/USDC exchange rate arbitrarily, affecting all holders. See [Price-Setting Flow](#price-setting-flow) for the full mechanism.
- **No exit other than the queue**: gtUSDa cannot be transferred, so a holder facing any of the above cannot sell the position — only request redemption and wait for a solver to settle against vault liquidity that is itself locked in the FalconX market.

---

## Risk Score Assessment

### Critical Risk Gates

If ANY gate is triggered, the protocol automatically receives a score of **5** (High Risk).

- [ ] **No audit** — Not triggered. The Aera V3 contracts deployed here (MultiDepositorVault, Provisioner) were audited by Spearbit (June 2025) and reviewed in a Cantina audit competition, with V2 audits by Spearbit (2023) and OpenZeppelin (2024), plus an active $500K Immunefi bug bounty. Reports are public on the [Aera security page](https://docs.aera.finance/the-protocol/security).
- [ ] **Unverifiable reserves** — Reserves are partially onchain. Supply and every position contract are readable onchain, but the assets held on any one chain do not correspond to the units issued there, so backing can only be established by aggregating four chains, and ~95% of the Ethereum position is marked at the Pareto CDO's own reported `virtualPrice`. Weak, but the positions themselves are onchain and enumerable, so this is not a full gate trigger.
- [ ] **Total centralization** — Not triggered. Governance is a 3/9 multisig with a 1-day timelock, not a single EOA. Day-to-day operation does run through two unprotected EOAs, but their authority is bounded by Forwarder capabilities and guardian Merkle roots that only the timelock can change.


### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

- Aera V3 was audited by Spearbit in June 2025 and reviewed in a Cantina audit competition. Aera V2 was reviewed by Spearbit in 2023 and OpenZeppelin in 2024. Reports are public on the [Aera security page](https://docs.aera.finance/the-protocol/security).
- Aera has an active Immunefi bug bounty with a maximum payout of **$500K** ([link](https://immunefi.com/bug-bounty/aera/information/)).

Score: **2.5/5** — The deployed Aera V3 contracts have a public tier-1 audit (Spearbit) plus an audit competition and an active $500K bug bounty. Score is not lower because V3 coverage rests on a single tier-1 firm plus a small ($15K-pool) competition, the V3 report is only Google-Drive-hosted, and the specific gtUSDa vault configuration is not separately audited.

**Subcategory B: Historical Track Record**

- Time in production is ~8.7 months, based on a December 2025 deployment.
- Scale is ~$58.4M across 4 chains: Ethereum $1.58M, Base $51.77M, Arbitrum $5.03M, and Optimism $25K.
- Operating record is clean: no incidents, no pause events, and no price write outside the ±0.10% guard band.

Score: **2.5/5** — Relatively new deployment (~8.7 months) but with meaningful scale ($58.4M aggregate) and an unblemished operating record. The Base vault carries the vast majority of TVL. The broader Gauntlet protocol has $1.49B total TVL and a long track record, but this specific vault series has not been battle-tested through a major market stress event or a large redemption.

**Audits & Historical Score = (2.5 + 2.5) / 2 = 2.5**

**Score: 2.5/5** — Audited Aera V3 codebase with an active bug bounty, moderate track record with $58.4M multi-chain TVL.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- The vault is immutable and non-proxy, so code cannot be upgraded in place.
- Vault operations sit behind a 3/9 Gauntlet multisig and a 1-day timelock; fee, threshold, pause, and whitelist parameters sit behind a 3/7 Aera multisig and a separate 1-day timelock.
- The Provisioner can mint/burn, the timelock can change the provisioner, guardians can execute Merkle-approved operations instantly, and the keeper EOA writes the unit price and settles requests via the accountant Forwarder. PPS soft guards (±0.10% tolerance, 60-minute cooldown) pause but do not block price writes.
- Guardian authority resolves to a single EOA acting through two timelock-owned Forwarders, with roots rotated roughly monthly.

Score: **3.0/5** — The 3/9 multisig with 1-day timelock fits rubric score 3 ("Multisig 5/9 with timelock, 24+ hours, some powerful roles constrained by timelock"). Both governance paths are live multisig-behind-timelock arrangements, and the guardian layer is narrow in scope: timelock-owned Forwarders granting exactly one capability to one operational key. Powerful roles exist but every configuration change carries the 1-day delay, and the immutable vault prevents a score of 4.

**Subcategory B: Programmability**

- Strategy allocation is determined by Gauntlet's offchain engine and executed by a guardian key; the vault itself performs no autonomous allocation.
- Sync deposits are disabled, so both entry and exit require an offchain solver to settle a posted request; the permissionless `solveRequestsDirect()` path is the only non-Gauntlet fallback.
- PPS is keeper-submitted from offchain NAV computation. Soft guards (±0.10%, 60-minute minimum interval, 255-second price age, 7-day max update delay) pause the vault on violation but **never block** the price update. The vault owner can unpause.

Score: **3.5/5** — Hybrid onchain/offchain operations. The PPS is keeper-submitted with soft-guard-only limits, and because sync deposits are disabled the user's entire lifecycle — enter, exit, and valuation — depends on Gauntlet's offchain services running correctly and honestly.

**Subcategory C: External Dependencies**

- Dependencies are Morpho across 4 chains, USDC, Circle CCTP v2, Aera Protocol, Merkl, and — dominating the Ethereum leg — Pareto Credit and its FalconX borrower.
- Morpho, USDC, and CCTP are established, and the cross-chain bridge is canonical Circle CCTP rather than a bespoke bridge.
- The Gauntlet-curated intermediate vaults share an owner and curator with the gtUSDa strategy itself, so they add a contract layer without adding independent oversight.
- The `AA_FalconXUSDC` chain adds an upgradeable third-party CDO proxy, an issuer-reported price feed, and an offchain credit counterparty behind ~95% of Ethereum assets.

Score: **3.5/5** — The infrastructure dependencies remain established and well-chosen: canonical Circle CCTP (identified onchain via `TokenMinterV2`), Morpho, and USDC. The dependency risk sits in what the markets lend against rather than in the venues. Concentrating ~95% of Ethereum assets behind a single Pareto CDO — an upgradeable proxy that both prices the collateral and gates its redemption — introduces a counterparty and valuation dependency of a different character from crypto-collateralized lending, and the curator layer is Gauntlet-on-Gauntlet rather than independent. Not higher because the venues themselves are mature and the bridge carries no bespoke operator trust.

**Centralization Score = (3.0 + 3.5 + 3.5) / 3 = 3.33**

**Score: 3.33/5** — Adequate governance structure with timelock, but admin-controlled PPS, solver-dependent entry and exit, single-key operations, and a concentrated private-credit dependency are concerns.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Every position is USDC-denominated and the vault takes no direct leverage.
- Look-through collateral is dominated by a single market: ~94.7% of Ethereum assets sit behind [`AA_FalconXUSDC`](https://app.morpho.org/ethereum/market/0xe83d72fa5b00dcd46d9e0e860d95aa540d5ec106da5833108a9f826f21f36f52/), the Pareto senior tranche of an unsecured FalconX loan, at 77% LLTV. The remainder is cbBTC and LBTC collateral plus dust.
- That collateral has no market price; it is marked at the CDO's own `virtualPrice` and can only be redeemed between ~28.5-day epochs.
- Local backing on Ethereum is generous ($14.00M of assets against $1.58M of local units), but the unit price mutualizes losses across all four chains.

Score: **3.5/5** — All exposure is USDC-denominated with no leverage, and local asset coverage on Ethereum is strong, which keeps this out of the elevated band. Against that, the effective collateral is not blue-chip: a single private-credit tranche accounts for roughly 95% of assets, valued by its issuer and redeemable only on an epoch schedule, so both the credit and the mark sit outside anything the vault or a holder can verify or liquidate independently.

**Subcategory B: Provability**

- Supply and every position contract are readable onchain, but per-chain assets do not correspond to per-chain claims, so backing can only be established by aggregating four chains.
- ~95% of Ethereum assets are valued through an issuer-reported `virtualPrice` whose feed returns `roundId = 0` and `updatedAt = 0`.
- The reporting mechanism is a keeper-submitted unit price based on offchain NAV, with soft-guard-only limits of ±0.10%. The Gauntlet App provides allocation data.
- No independent third-party verification mechanism was identified.

Score: **3.5/5** — Hybrid onchain/offchain reporting where the offchain component now dominates. Even a complete cross-chain aggregation of onchain balances resolves to a valuation the issuer supplies, with no staleness signal and no third-party attestation, and the keeper-submitted PPS adds a second unverified layer on top.

**Funds Management Score = (3.5 + 3.5) / 2 = 3.5**

**Score: 3.5/5** — USDC denomination and no leverage are genuine strengths, but the concentration into issuer-priced private credit, the cross-chain claim/asset mismatch, the admin-controlled PPS, and the absence of independent verification dominate.

#### Category 4: Liquidity Risk (Weight: 15%)

- gtUSDa is non-transferable, so the async redeem queue is the only exit — there is no secondary market to sell into at any price.
- Sync deposits are disabled, so entry is also solver-dependent; the permissionless `solveRequestsDirect()` path is the only fallback if the Gauntlet solver stops.
- The Ethereum vault holds $9,999.80 of idle USDC against $1.58M of local units and ~$14.00M of deployed assets; anything beyond the idle balance requires a discretionary guardian unwind.
- The dominant underlying market runs at 90.3% utilization with $4.77M of free liquidity against $13.27M of exposure, and its collateral can only be redeemed between ~28.5-day Pareto epochs.
- The top Ethereum holder controls 55.7% of supply and the top three control 85.7% across 72 holders, so a single exit decision can move most of the deployment.

Score: **3.5/5** — A working redemption mechanism with a permissionless fallback solver keeps this out of the high band, and same-value USDC redemption removes price risk on exit. But the exit is structurally single-path: no transferability, no sync entry, negligible idle liquidity, and an underlying market whose free liquidity is roughly a third of the vault's exposure and whose collateral is epoch-locked. Concentration means the likely stress case is one holder redeeming most of the deployment at once — precisely the case the current liquidity profile does not cover on demand.

#### Category 5: Operational Risk (Weight: 5%)

- Team transparency is strong: Gauntlet Networks, Inc. is a well-known New York-based firm founded in 2018, with 8+ years in DeFi.
- Documentation is extensive through VaultBook and the Aera security page, although the full Aera contract reference remains thin.
- Legal/compliance posture is partially documented. The legal entity is identified and disclosure runs through Immunefi, but no formal incident-response plan was found.

Score: **1.5/5** — Strong reputation, extensive documentation, identified legal entity (Gauntlet Networks, Inc.), and confirmed audits. Residual gaps: no formal published incident-response plan and multisig signers not individually validated.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.33 | 30% | 0.999 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **3.149/5.0** |

**Final Score: 3.1/5.0** (rounded from 3.149)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk**

---

## Reassessment Triggers

- **Time-based**: Reassess in 3 months (November 2026)
- **Collateral-based**: Reassess if the `AA_FalconXUSDC` share of Ethereum assets moves outside 80–99%, if any new market exceeds 10% of look-through assets, or if a private-credit or RWA market is added on any chain
- **Credit-counterparty-based**: Reassess on any FalconX credit event, any Pareto CDO write-down (`virtualPrice(AA)` falling), any upgrade to the Pareto `IdleCDO` proxy, or any change to the epoch schedule or the market's oracle
- **Underlying-liquidity-based**: Reassess if free liquidity in the `AA_FalconXUSDC` market falls below the vault's exposure there, or if utilization exceeds 95%
- **TVL-based**: Reassess if Ethereum TVL exceeds $10M or drops below $500K, or if the Ethereum vault's asset balance falls to within 2× of its local unit claims
- **Accessibility-based**: Reassess if `isVaultUnitTransferable(gtUSDa)` flips to `true`, if `syncDepositEnabled` is re-enabled, or if the deposit or redeem multipliers move off 10000 bps
- **Fee-based**: Reassess if `VaultFeesSet` moves either fee off 0 bps
- **Incident-based**: Reassess after any exploit, governance change (multisig signer set, timelock delay), provisioner change, `VaultPausedChanged` event, new Forwarder caller capability, or strategy allocation change >50%
- **Audit-based**: Reassess if a new Aera version is deployed without a fresh audit, or if additional tier-1 audits of Aera V3 are published
- **Bridge-based**: Reassess if the vault migrates off Circle CCTP to a different (e.g. third-party lock-and-mint) bridge, or if CCTP undergoes significant changes
- **Concentration-based**: Reassess if the top holder exceeds 65% of supply or if holder count drops materially below the current 72

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [June 23, 2026](https://github.com/yearn/risk-score/pull/266) | 2.9 | Initial assessment. Aera V3 MultiDepositorVault, dual 1-day timelocks, keeper-submitted PPS with soft-guard-only limits, Circle CCTP v2 cross-chain routing. |
| [August 31, 2026](https://github.com/yearn/risk-score/pull/PENDING) | 3.1 | 69-day reassessment. |
