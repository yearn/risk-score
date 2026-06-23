# Protocol Risk Assessment: Gauntlet USD Alpha (gtUSDa)

- **Assessment Date:** June 23, 2026
- **Token:** gtUSDa (Gauntlet USD Alpha)
- **Chain:** Ethereum (also deployed on Base, Optimism, Arbitrum)
- **Token Address:** [`0x3bd9248048df95db4fbd748c6cd99c1baa40bad0`](https://etherscan.io/token/0x3bd9248048df95db4fbd748c6cd99c1baa40bad0)
- **Final Score: 2.7/5.0**

## Overview + Links

Gauntlet USD Alpha (gtUSDa) is a yield-bearing stablecoin vault built on the Aera Protocol. It seeks to achieve the highest risk-adjusted yield on USDC by allocating across Morpho lending markets on Ethereum, Base, Arbitrum, and Optimism. The vault combines variable-rate and fixed-rate yield opportunities and is curated by Gauntlet's optimization engine.

The vault is part of the broader Gauntlet ecosystem ($1.45B total TVL across all chains) and targets institutional and crypto-native users. gtUSDa is deployed on 4 chains: Ethereum ($1.5M), Base ($58.5M), Optimism ($23K), and Arbitrum ($4K) — **~$60M aggregate TVL**. gtUSDa tokens represent a pro-rata claim on the vault's USDC deployed across strategies.

**Links:**

- [Protocol Documentation](https://vaultbook.gauntlet.xyz/vaults/gauntlet-usd-alpha-vault)
- [Protocol Dashboard/App](https://app.gauntlet.xyz/vaults/gtusda)
- [Integration Documentation](https://docs.gauntlet.xyz/onboarding/index)
- [Gauntlet Website](https://www.gauntlet.xyz)
- [Gauntlet DefiLlama](https://defillama.com/protocol/gauntlet)

## Audits and Due Diligence Disclosures

- The gtUSDa vault is the **Aera V3** `MultiDepositorVault` (deployed source on Etherscan imports `src/core/MultiDepositorVault.sol` and references the Aera codebase 120×; compiler v0.8.29). Audit coverage applies at the Aera Protocol level, and Aera publishes its audits on its [security page](https://docs.aera.finance/the-protocol/security).
- **Aera Protocol audits** (verified against the Aera security page on June 23, 2026):

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

- **Time in production**: ~6.5 months (deployed December 8, 2025, block 23971333; [deployment tx](https://etherscan.io/tx/0x8da0ba49dca82b18232dd605e997359a0edd25f5dfad3e0186ea98ee79b88441))
- **Past incidents**: No known security incidents or exploits affecting the gtUSDa vault
- **TVL**: ~$60M aggregate across 4 chains (Ethereum $1.53M, Base $58.5M, Optimism $23K, Arbitrum $4K) as of June 23, 2026. The broader Gauntlet protocol has $1.45B TVL across all chains.
  - Source: Onchain `totalSupply()` at [`0x3bd9248048df95db4fbd748c6cd99c1baa40bad0`](https://etherscan.io/token/0x3bd9248048df95db4fbd748c6cd99c1baa40bad0) and [Gauntlet on DefiLlama](https://defillama.com/protocol/gauntlet)
- **TVL history**: The Ethereum deployment is small ($1.53M), but Base carries $58.5M of the ~$60M aggregate gtUSDa TVL. The vault series has grown to meaningful scale since December 2025 deployment.
- **Historical peg**: gtUSDa is a yield-bearing token, not a stablecoin. Its price increases over time as yield accrues (admin-set unit price). No depeg events are applicable.

## Funds Management

- **Yield strategy**: The vault allocates USDC to Morpho lending markets across Ethereum mainnet, Base, Arbitrum, and Optimism. The Gauntlet optimization engine allocates to the highest risk-adjusted yield opportunities.
- **Strategy constraints** (from [docs](https://vaultbook.gauntlet.xyz/vaults/gauntlet-usd-alpha-vault/optimization-and-risk-management-considerations)):
  - Max 40% exposure to non-blue-chip stablecoins
  - Position sizes constrained by vault and DEX liquidity
  - Collateral exposure constrained by DEX liquidity
  - Token turnover constrained by spot DEX liquidity
- **Fees**: Administered via the PriceAndFeeCalculator. Fee parameters can be changed by the fee-calculator governance (separate timelock).

### Accessibility

- **Deposits (mint)**: Anyone can deposit USDC to mint gtUSDa via the Provisioner's `deposit()` and `mint()` functions, subject to a deposit cap. The flow is: User approves USDC to Provisioner → Provisioner pulls USDC and calls `enter()` on vault → Vault mints gtUSDa.
- **Withdrawals (redeem)**: Anyone can redeem gtUSDa for USDC via the Provisioner's `requestRedeem()` / `solveRequestsVault()` flow, or through direct redemption if liquidity is available.
- **Atomicity**: Minting is atomic — USDC is pulled and gtUSDa minted in the same transaction (`enter()` on vault). Redemption involves a request-solve flow that may not be fully atomic in all cases (sync vs async).
- **Rate limits**: A deposit cap is enforced on the Provisioner (`depositCap`/`_requireDepositCapNotExceeded`). The specific cap value was not decoded from the onchain storage. Withdrawals are subject to available vault liquidity.

### Token Mint Authority

**Mint mechanism:** Role-gated via the Provisioner contract. The MultiDepositorVault restricts minting (`enter()`) and burning (`exit()`) to the single `provisioner` address via the `onlyProvisioner` modifier (direct address equality check, not through the authority system).

**Mint requires backing:** Yes — atomic. The Provisioner always transfers USDC from the depositor before calling `vault.enter()` which mints gtUSDa. There is no path for unbacked mint through the deposit flow.

**Per-address mint authority** (verified onchain on June 23, 2026, from token contract [`0x3bd9248048df95db4fbd748c6cd99c1baa40bad0`](https://etherscan.io/address/0x3bd9248048df95db4fbd748c6cd99c1baa40bad0)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11`](https://etherscan.io/address/0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11) | ✓ | ✓ | `provisioner` (direct address check) | Provisioner contract. Owner = TimelockController [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) (1-day delay). The provisioner can be changed by the timelock via `setProvisioner()`. |

**Provisioner owner governance chain:**
- Gauntlet Multisig (Gnosis Safe, 3/9 threshold) [`0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f`](https://etherscan.io/address/0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f) — holds PROPOSER_ROLE and EXECUTOR_ROLE on the TimelockController
- TimelockController [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) — 1-day delay (`getMinDelay()` = 86400), owner of vault, provisioner, and RolesAuthority

**Rate limits / supply caps:** A deposit cap is enforced by the Provisioner. This cap is configurable by governance (timelock).

**Backing check at mint time:** Atomic — minter (Provisioner) must deposit USDC in same transaction. The Provisioner's `deposit()` function pulls `tokensIn` USDC before calling `vault.enter()` which mints `unitsOut` gtUSDa. No path exists to mint without backing.

### Collateralization

- **Collateral type**: 100% backed by USDC. The vault's supply asset is USDC [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48).
- **Collateral quality**: Blue-chip stablecoin (USDC, issued by Circle). This is the highest quality stablecoin collateral available.
- **Backing ratio**: The vault is effectively 100%+ collateralized. Every gtUSDa token represents a pro-rata claim on the vault's USDC deployed across strategies plus any accrued yield.
- **Yield risk**: Funds are deployed to Morpho lending markets. While USDC principal is generally safe, yield is variable and depends on Morpho market conditions. The vault does not employ leverage.
- **Liquidations**: Not applicable — this is not a lending protocol. The vault does not take loans or face liquidation risk.
- **Peg stability**: The unit price of gtUSDa is set via `setUnitPrice()` on the PriceAndFeeCalculator. The oracle hard-codes USDC = $1 as per [Gauntlet docs](https://vaultbook.gauntlet.xyz/resources/frequently-asked-questions/oracles). The price value is computed **offchain** by Gauntlet's optimization engine (total USDC across all chains + accrued yield ÷ gtUSDa total supply) and then submitted onchain by a keeper. This means the gtUSDa exchange rate (PPS) is an admin-updated value reflecting accrued yield — see [Price-Setting Flow](#price-setting-flow) below for the full onchain-verified mechanism.
- **Risk curation**: Gauntlet's automated risk management system curates allocations, applying risk constraints (40% max non-blue-chip exposure, liquidity caps, etc.).

### Provability

- **Onchain verification**: The total supply of gtUSDa is fully onchain (`totalSupply()`). The Provisioner's USDC balance and vault's USDC balance are partially onchain — but USDC deployed to cross-chain Morpho vaults requires cross-chain tracking. On Ethereum mainnet, the vault and provisioner hold minimal USDC ($0 and ~$14K respectively).
- **Yield calculation**: Yield is reflected in the unit price. The price is computed **offchain** by Gauntlet's optimization engine (aggregating USDC positions across Ethereum, Base, Arbitrum, and Optimism Morpho markets), then submitted onchain by a keeper EOA. It is **not** computed programmatically from onchain data in a single transaction.
- **PPS (Price Per Share)**: The conversion between gtUSDa and USDC is managed by `convertTokenToUnits()` / `convertUnitsToToken()` on the PriceAndFeeCalculator, which references the stored unit price. The price is set via `setUnitPrice()` — see [Price-Setting Flow](#price-setting-flow) below for the complete onchain-verified mechanism.
- **Reserve transparency**: While individual balance snapshots are onchain, the full cross-chain position requires aggregation. The Gauntlet App provides live market allocations per docs.
- **Third-party verification**: None identified. No Chainlink Proof of Reserve or external attestation mechanisms.

### Price-Setting Flow

The unit price of gtUSDa is determined through a multi-step offchain→onchain pipeline. The following is verified onchain from contract source and transaction traces.

**Step 1 — Offchain computation:** Gauntlet's optimization engine aggregates total USDC deployed across all chains (Ethereum, Base, Arbitrum, Optimism Morpho markets), adds accrued yield, and divides by gtUSDa `totalSupply()`. This produces the new unit price. This computation is **entirely offchain** — it is not performed by any single onchain contract call.

**Step 2 — Keeper submission:** A keeper EOA (e.g., [`0xdd998274ed12bb12d818800915cfb8f87cbc2801`](https://etherscan.io/address/0xdd998274ed12bb12d818800915cfb8f87cbc2801)) submits the price onchain by calling the **Forwarder** contract [`0xc219d47B645e3446b81889F18B34238310c792d0`](https://etherscan.io/address/0xc219d47B645e3446b81889F18B34238310c792d0) (unverified, owned by the main TimelockController). The Forwarder is the vault's designated **accountant** (`vaultAccountant[gtUSDa]`). The call batches two operations:

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
| Max update delay | `maxUpdateDelayDays` (value not emitted in event) | `setThresholds()` call |

**Critical finding:** When a soft guard is violated, `_shouldPause()` returns `true` and the vault is paused — but the new price is **still written to storage** (`vaultPriceState.unitPrice = price`). The vault owner can subsequently call `unpauseVault(vault, price, timestamp)` to resume operations at that price. There are **no hard limits** preventing arbitrary price setting — the tolerance bounds are a circuit breaker that the vault owner can override, not a prevention mechanism.

**Step 4 — Usage:** Deposits and withdrawals use the stored unit price via `convertTokenToUnits()` / `convertUnitsToToken()`. When the vault is paused, the `*IfActive` conversion variants revert (blocking deposits/withdrawals), but the non-`IfActive` versions still return the paused price.

## Liquidity Risk

- **Exit mechanism**: Users redeem gtUSDa for USDC via the Provisioner. The flow can be synchronous (`deposit()`/`redeem()` with direct vault interaction) or asynchronous (`requestRedeem()` + `solveRequestsVault()`). Synchronous redemption is available only when vault has idle USDC.
- **Liquidity depth**: The Ethereum vault holds $0 idle USDC. Withdrawals likely depend on the Provisioner unwinding or rebalancing cross-chain positions. This may introduce delays for large withdrawals.
- **Slippage**: Not applicable in the traditional DEX sense — redemptions are at the admin-set unit price. However, large redemptions may face delays if cross-chain funds need to be recalled.
- **Withdrawal queues**: Verified from the Provisioner source on Etherscan. Async exits use `requestRedeem(token, unitsIn, minTokensOut, solverTip, deadline, …)`, which escrows the user's gtUSDa and posts a request carrying a user-set `solverTip` and `deadline`. Requests are settled by a **solver** in one of two ways: `solveRequestsVault(token, Request[])` — gated by `requiresAuth` (RolesAuthority), i.e. only a Gauntlet-permissioned solver settling against vault liquidity — or `solveRequestsDirect(token, Request[])` — **permissionless**, where any party fills the request from its own funds and collects the `solverTip`. Synchronous `deposit()`/`mint()` are `anyoneButVault` and execute atomically when vault liquidity allows.
- **Historical liquidity**: No periods of market stress observed since deployment (~6.5 months). The vault has not experienced a major withdrawal event.

## Centralization & Control Risks

### Governance

- **Contract upgradeability**: The MultiDepositorVault is NOT a proxy — it is an immutable deployed contract. Code changes require full redeployment. The Provisioner and PriceAndFeeCalculator are also non-proxy contracts.
- **Owner**: The vault owner is a TimelockController [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) with a 1-day delay (`getMinDelay()` = 86400).
- **Multisig**: Gauntlet Gnosis Safe [`0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f`](https://etherscan.io/address/0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f) — 3-of-9 multisig, holds PROPOSER_ROLE and EXECUTOR_ROLE on the timelock. Signer identities: not validated per assessment rules.
- **Separate Fee governance**: The PriceAndFeeCalculator has its own governance path via TimelockController [`0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B`](https://etherscan.io/address/0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B) (1-day delay), owner of RolesAuthority [`0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40`](https://etherscan.io/address/0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40). **Notable**: Onchain verification shows the FeeCalc timelock holds `DEFAULT_ADMIN_ROLE` on itself but no external address holds `PROPOSER_ROLE` or `EXECUTOR_ROLE`. This suggests the FeeCalc governance may be intentionally frozen (immutable fee parameters) or that proposal rights are managed through a non-standard mechanism. The deployer EOA (0x34a0...2fa8) holds no roles.

**Privileged roles and potential harm paths:**

| Action | Who | Constraint | Harm potential |
|--------|-----|-----------|----------------|
| Change provisioner address | Timelock (1-day delay) | Owner of vault | High — could set malicious provisioner that mints unbacked gtUSDa or steals deposited USDC |
| Pause vault | Timelock OR Guardian | `requiresAuth` or guardian | Medium — freezes deposits/withdrawals temporarily |
| Unpause vault | Timelock only | `requiresAuth` | Time-locked — cannot be done without 1-day delay |
| Set unit price | Keeper EOA → Forwarder (owner = Timelock 1-day) | `setUnitPrice()` only callable by vault's designated accountant (Forwarder `0xc219…92d0`). **Price updates bypass the timelock** — the keeper calls the Forwarder directly. Soft guards trigger pause if price deviates >±0.10% or update interval <60 min, but price is **always set** regardless. Vault owner can unpause at new price. | High — could manipulate gtUSDa exchange rate instantly; soft guards only pause, never block; no timelock delay on price changes |
| Set fees | FeeCalc Timelock (1-day) | `setVaultFees()` requires auth | Medium — could increase fee extraction |
| Add/remove guardians | Timelock | `setGuardianRoot()` requires auth | Medium — guardians can submit arbitrary operations |
| Set provisioner (vault) | Timelock | `setProvisioner()` requires auth | High — controls who can mint/burn |
| Set fee recipient | Timelock | `setFeeRecipient()` requires auth | Low-Medium — controls fee destination |

- **Guardian system**: The vault has a guardian mechanism where approved addresses (with Merkle roots) can call `submit()` to execute arbitrary operations. This is a powerful capability that deserves scrutiny. The set of active guardians was not enumerable via the vault's `getActiveGuardians()` function (reverted on call).
- **Pause/freeze/seize**: Governance can pause the vault. While paused, deposits and withdrawals are halted. The vault has a whitelist contract that can restrict interactions.

### Programmability

- **System operations**: Mostly programmatic — deposits and withdrawals are handled by the Provisioner contract automatically. However, the unit price (PPS) is set administratively, and strategy allocations are determined by Gauntlet's offchain optimization engine.
- **PPS definition**: The price per share is set offchain by Gauntlet's engine and submitted onchain by a keeper EOA via the Forwarder → `setUnitPrice()`. It is **not** computed programmatically from onchain data within the transaction. The current tolerance thresholds (verified onchain from `ThresholdsSet` event at [block 23971333](https://etherscan.io/tx/0x8da0ba49dca82b18232dd605e997359a0edd25f5dfad3e0186ea98ee79b88441)): max price increase **+0.10%**, max decrease **−0.10%**, min update interval **60 minutes**, max price age **255 seconds**. These are **soft guards** — violating them triggers a vault pause but the new price is **always written**. See [Price-Setting Flow](#price-setting-flow) for the complete mechanism.
- **Offchain dependencies**: The Gauntlet optimization engine (offchain) determines strategy allocations. The Provisioner executes onchain transactions based on these offchain decisions. If the offchain engine fails or provides incorrect data, allocations could be suboptimal.
- **Keepers/relayers**: Settlement of async requests depends on a solver. `solveRequestsVault()` requires authorization through the vault's RolesAuthority (`requiresAuth`), so the privileged settlement path is a Gauntlet-operated keeper/solver. The `solveRequestsDirect()` path is permissionless and tip-incentivized, providing a fallback if the privileged solver is offline — though without an active solver, async redemptions wait until their `deadline`. The specific offchain keeper service operated by Gauntlet is not separately identifiable onchain beyond the authorized solver address(es) in RolesAuthority.

### External Dependencies

- **Morpho**: The vault deploys USDC into Morpho lending markets across multiple chains. Morpho is a well-established lending protocol. Risk depends on specific Morpho vault curators.
- **Cross-chain bridging**: The bridge is **Circle CCTP (Cross-Chain Transfer Protocol, V2)** — native USDC burn-and-mint, not a third-party lock-and-mint bridge. Verified onchain: vault USDC outflows go to Circle's CCTP V2 `TokenMinterV2` ([`0xfd78ee919681417d192449715b2594ab58f5d002`](https://etherscan.io/address/0xfd78ee919681417d192449715b2594ab58f5d002)) on the burn side, and USDC inflows to the vault arrive minted from the zero address (~$3.1M observed) on the receive side — the burn/mint signature of CCTP. Using canonical CCTP means there is no extra bridge-operator trust assumption beyond Circle itself; cross-chain risk reduces to Circle/CCTP availability and message-attestation finality rather than a bespoke bridge's security. (USDC is also routed through a `CurveStableSwapNG` pool and two Ethereum-mainnet MetaMorpho V1.1 vaults for same-chain allocation.)
- **USDC (Circle)**: The underlying asset is USDC, which carries its own regulatory and custodial risks. USDC is one of the most established stablecoins with ~$60B market cap.
- **Oracle**: No external oracle dependency — USDC is hard-coded to $1. The vault unit price is admin-set, so Chainlink or other oracle failure does not directly affect gtUSDa.
- **Aera Protocol**: The vault and its infrastructure contracts are built on Aera Protocol. Any vulnerability in Aera's MultiDepositorVault, RolesAuthority, Provisioner, or Guardian system would affect gtUSDa.

## Operational Risk

- **Team**: Gauntlet is a well-known entity in DeFi with 8+ years of experience. The team has a strong reputation for risk management and has managed substantial TVL across DeFi protocols. The multisig signers are not individually validated per assessment rules.
- **Documentation**: Gauntlet provides extensive, well-maintained documentation via [VaultBook](https://vaultbook.gauntlet.xyz) and separate [integration docs](https://docs.gauntlet.xyz). However, specific audit reports for gtUSDa are not publicly available, and the full contract reference for Aera Protocol is not documented in the integration site.
- **Legal structure**: The operating entity is **Gauntlet Networks, Inc.**, a US company headquartered in New York City, founded in 2018 by Tarun Chitra (CEO), John Morrow, and Rei Chiang; it is a Series-B-funded firm ([Gauntlet team](https://www.gauntlet.xyz/our-team), [Crunchbase](https://www.crunchbase.com/person/tarun-chitra)). The exact state of incorporation and the contracting entity for vault terms were not separately verified.
- **Incident response**: No formal, published incident-response plan was found in the Gauntlet/Aera docs. The closest documented emergency controls are protocol-level: per the [Aera security page](https://docs.aera.finance/the-protocol/security), the vault owner "has the power to stop vault operations at any point and to remove the guardian role." Vulnerability disclosure is handled through the [Immunefi bug bounty](https://immunefi.com/bug-bounty/aera/information/); no dedicated `security.txt` or published security contact was located.

## Monitoring

### Key Addresses to Monitor

| Address | Name | Purpose |
|---------|------|---------|
| [`0x3bd9248048df95db4fbd748c6cd99c1baa40bad0`](https://etherscan.io/address/0x3bd9248048df95db4fbd748c6cd99c1baa40bad0) | MultiDepositorVault (Ethereum) | gtUSDa token contract — $1.53M TVL |
| [`0x000000000001CdB57E58Fa75Fe420a0f4D6640D5`](https://basescan.org/address/0x000000000001CdB57E58Fa75Fe420a0f4D6640D5) | MultiDepositorVault (Base) | gtUSDa token contract — $58.5M TVL |
| [`0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC`](https://optimistic.etherscan.io/address/0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC) | MultiDepositorVault (Optimism) | gtUSDa token contract — $23K TVL |
| [`0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC`](https://arbiscan.io/address/0x000000001DC8bd45d7E7829fb1c969cbe4D0D1eC) | MultiDepositorVault (Arbitrum) | gtUSDa token contract — $4K TVL |
| [`0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11`](https://etherscan.io/address/0x74C4A66CE4F4779B11E7c63D42e51EEef3A80D11) | Provisioner | Deposit/withdrawal handler, mint authority |
| [`0x8F3FfA11CD5915f0E869192663b905504A2Ef4a5`](https://etherscan.io/address/0x8F3FfA11CD5915f0E869192663b905504A2Ef4a5) | PriceAndFeeCalculator | Unit price oracle, fee calculator |
| [`0x72820eA60C344186465152e4b11e260CAE391d77`](https://etherscan.io/address/0x72820eA60C344186465152e4b11e260CAE391d77) | TimelockController (Vault) | Vault governance timelock (1-day delay) |
| [`0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B`](https://etherscan.io/address/0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B) | TimelockController (FeeCalc) | Fee calculator governance timelock (1-day delay) |
| [`0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f`](https://etherscan.io/address/0xCa75ab43dABD026466f8DA9CC0938eD7bDea0a6f) | Gnosis Safe (3/9) | Gauntlet multisig, PROPOSER and EXECUTOR on vault timelock |
| [`0xC14604f43ED73011B60426FE6c48317d6583e67e`](https://etherscan.io/address/0xC14604f43ED73011B60426FE6c48317d6583e67e) | RolesAuthority (Vault) | Access control for vault functions |
| [`0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40`](https://etherscan.io/address/0xA83C037DF3b27bF7224AB0a40a2c4531FF1B2f40) | RolesAuthority (FeeCalc) | Access control for fee calculator |
| [`0xdDfd960a7150520548dD1F6E53CC2f201b364692`](https://etherscan.io/address/0xdDfd960a7150520548dD1F6E53CC2f201b364692) | Whitelist | Address whitelist for vault interactions |
| [`0xc219d47B645e3446b81889F18B34238310c792d0`](https://etherscan.io/address/0xc219d47B645e3446b81889F18B34238310c792d0) | Forwarder (Accountant) | Keeper → setUnitPrice() relay, owner = TimelockController (Vault) |
| [`0xbfb2040d37f5da34938a367ef3ae0786fd6a861a`](https://etherscan.io/address/0xbfb2040d37f5da34938a367ef3ae0786fd6a861a) | MinimumUpdateIntervalGuard | Pre-checks min update interval before price updates |
| [`0xdd998274ed12bb12d818800915cfb8f87cbc2801`](https://etherscan.io/address/0xdd998274ed12bb12d818800915cfb8f87cbc2801) | Keeper EOA (example) | Offchain bot that submits unit price updates via Forwarder |

### Critical Events & Functions

**Governance changes (monitor daily):**
- `setProvisioner(address)` on vault — mint authority change
- `setUnitPrice()` on PriceAndFeeCalculator — PPS manipulation
- `setVaultFees()` on PriceAndFeeCalculator — fee change
- `setGuardianRoot()` / `removeGuardian()` on vault — guardian set changes
- `setAuthority()` on RolesAuthority — authority override
- Timelock `schedule()` / `execute()` calls — any pending governance action
- Multisig `addOwner()` / `removeOwner()` / `changeThreshold()` — signer set changes

**Operational events (monitor hourly):**
- `Enter()` / `Exit()` on vault — large deposit/withdrawal activity
- `pause()` / `unpause()` on vault — vault paused state changes
- `setPublicCapability()` on RolesAuthority — access control changes
- `submit()` on vault — guardian-executed operations

**Data fetching functions:**
- `totalSupply()` on vault → circulating gtUSDa
- `getVaultState(vault)` on PriceAndFeeCalculator → vault parameters (unit price, active state, thresholds)
- `getMinDelay()` on both Timelocks → timelock delay (should remain ≥86400)
- `depositCap()` on Provisioner → deposit limits
- `vaultAccountant(vault)` on PriceAndFeeCalculator → accountant (should be Forwarder `0xc219…92d0`)
- `getVaultsPriceAge(vault)` on PriceAndFeeCalculator → seconds since last price update

**Offchain data sources:**
- [Gauntlet App](https://app.gauntlet.xyz/vaults/gtusda) — live market allocations, APY
- [DeFi Llama — Gauntlet](https://defillama.com/protocol/gauntlet) — TVL tracking
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
│        │ PROPOSER_ROLE                │ EXECUTOR_ROLE                │
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
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ TimelockController (FeeCalc, 1-day delay)               │        │
│  │ 0xce75E223E6DbB0503D2B6f55bC5907d1A0372E2B             │        │
│  │ Owner of: PriceAndFeeCalculator, RolesAuthority(FeeCalc) │        │
│  └──┬────────────────────────┬────────────────────────────┘        │
│     │ owns                   │ owns                                  │
│     ▼                        ▼                                       │
│  ┌────────────────────┐  ┌──────────────────────────┐              │
│  │PriceAndFeeCalculator│  │ RolesAuthority(FeeCalc)  │              │
│  │ 0x8F3FfA...        │  │ 0xA83C...                │              │
│  └────────────────────┘  └──────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE LAYER                           │
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│  │ Whitelist        │    │ OracleRegistry   │    │ Guardians     │  │
│  │ 0xdDfd...        │    │ 0xD560...        │    │ (Merkle root  │  │
│  │                  │    │                  │    │  set by vault)│  │
│  └──────────────────┘    └──────────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL DEPENDENCY LAYER                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Morpho Lending Markets (multi-chain)                          │   │
│  │  • Ethereum: USDC markets                                    │   │
│  │  • Base: USDC markets                                        │   │
│  │  • Arbitrum: USDC markets                                    │   │
│  │  • Optimism: USDC markets                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────┐    ┌──────────────────┐                           │
│  │ USDC (Circle)│    │ Circle CCTP v2   │                           │
│  │ 0xA0b869...  │    │ TokenMinter      │ 0xfd78ee91... (burn/mint) │
│  └──────────────┘    └──────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘

Fund Flow:
  User USDC ──→ Provisioner ──→ Vault ──→ Cross-chain ──→ Morpho Markets
                          │                    │
                          │ mint gtUSDa        │ yield accrues
                          ▼                    ▼
                         User             Unit Price updated
                         (gtUSDa)         by admin
```

---

## Risk Summary

### Key Strengths

- Built on the audited Aera V3 Protocol by Gauntlet (Gauntlet Networks, Inc.), a team with 8+ years of DeFi experience and $1.45B in managed TVL
- Audited (Spearbit V3, June 2025 + Cantina competition) with an active $500K Immunefi bug bounty
- Fully USDC-backed — every gtUSDa represents a 1:1 claim on USDC, no leverage
- Non-upgradeable vault contract (immutable) eliminates proxy upgrade risk
- Dual-timelock governance (1-day delay) for both vault and fee operations
- Blue-chip collateral (USDC), established underlying protocol (Morpho), and canonical Circle CCTP for cross-chain transfers

### Key Risks

- Admin-controlled unit price (PPS) — exchange rate is keeper-submitted from offchain NAV with soft-guard-only limits (±0.10%, 60-min cooldown) that pause but never block malicious prices
- Highly concentrated holder base — top holder ~53%, top 3 ~82% of supply (27 holders total)
- Small Ethereum TVL ($1.53M) limits battle-testing of that deployment, but $60M aggregate across 4 chains shows meaningful adoption
- Guardian system with arbitrary execution capability via Merkle proofs
- Provisioner address change could redirect all deposited USDC
- Cross-chain complexity — funds deployed across 4 chains (via Circle CCTP), adding operational surface
- Audit coverage rests on a single tier-1 V3 engagement (Spearbit) plus a small audit competition; the V3 report is only Google-Drive-hosted

### Critical Risks

- **Admin-controlled PPS**: The unit price is set offchain and submitted by a keeper EOA via the Forwarder. Soft guards (±0.10% per update tolerance, 60-min cooldown, 255s max price age) trigger a vault pause if exceeded — but the new price is **always written** and the vault owner can unpause at that price. There are no hard limits preventing arbitrary price manipulation, but pausing is triggered if the price is outside the guards. A malicious or compromised keeper/governance could manipulate the gtUSDa/USDC exchange rate arbitrarily, affecting all holders. See [Price-Setting Flow](#price-setting-flow) for the full mechanism.

---

## Risk Score Assessment

### Critical Risk Gates

If ANY gate is triggered, the protocol automatically receives a score of **5** (High Risk).

- [ ] **No audit** — Not triggered. The Aera V3 contracts deployed here (MultiDepositorVault, Provisioner) were audited by Spearbit (June 2025) and reviewed in a Cantina audit competition, with V2 audits by Spearbit (2023) and OpenZeppelin (2024), plus an active $500K Immunefi bug bounty. Reports are public on the [Aera security page](https://docs.aera.finance/the-protocol/security).
- [ ] **Unverifiable reserves** — Reserves are partially onchain. gtUSDa supply and USDC balances are verifiable, but cross-chain positions (via Circle CCTP to Morpho on Base/Arbitrum/Optimism) require aggregation. Not a full gate trigger.
- [ ] **Total centralization** — Not triggered. Governance is a 3/9 multisig with 1-day timelock. Not a single EOA.


### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

| Audits | Bug Bounty |
|--------|------------|
| Aera V3 audited by Spearbit (June 2025) + Cantina audit competition; V2 by Spearbit (2023) & OpenZeppelin (2024). Reports public on the [Aera security page](https://docs.aera.finance/the-protocol/security). | Active — Immunefi, up to **$500K** ([link](https://immunefi.com/bug-bounty/aera/information/)). |

Score: **2.5/5** — The deployed Aera V3 contracts have a public tier-1 audit (Spearbit) plus an audit competition and an active $500K bug bounty. Score is not lower because V3 coverage rests on a single tier-1 firm plus a small ($15K-pool) competition, the V3 report is only Google-Drive-hosted, and the specific gtUSDa vault configuration is not separately audited.

**Subcategory B: Historical Track Record**

| Time in Production | Scale (TVL) |
|-------------------|-------------|
| ~6.5 months (Dec 2025) | ~$60M across 4 chains (Ethereum $1.5M, Base $58.5M, Optimism $23K, Arbitrum $4K) |

Score: **2.5/5** — Relatively new deployment (~6.5 months) but with meaningful scale ($60M aggregate). The Base vault carries the vast majority of TVL. The broader Gauntlet protocol has $1.45B total TVL and a long track record, but this specific vault series has not been battle-tested through a major market stress event.

**Audits & Historical Score = (2.5 + 2.5) / 2 = 2.5**

**Score: 2.5/5** — Audited Aera V3 codebase with an active bug bounty, moderate track record with $60M multi-chain TVL.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Upgradeability | Timelock | Privileged Roles |
|---------------|----------|-----------------|
| Immutable vault (non-proxy). Cannot upgrade. | 1-day (24 hours) on both vault and fee timelocks | 3/9 multisig proposer. Provisioner can mint/burn. Timelock can change provisioner. Guardians can execute arbitrary operations. Keeper EOA submits unit price via Forwarder with soft guards (±0.10% tolerance, 60-min cooldown) that pause but never block. |

Score: **3.0/5** — The 3/9 multisig with 1-day timelock fits rubric score 3 ("Multisig 5/9 with timelock, 24+ hours, some powerful roles constrained by timelock"). The guardian system allows arbitrary execution — the multisig can update the Merkle root via timelock, then guardians execute instantly. Combined with the keeper-submitted PPS and provisioner-change capability, powerful roles exist but are partially constrained (root changes require 1-day delay). The immutable vault is a positive, preventing score 4.

**Subcategory B: Programmability**

| System Operations | PPS/Rate Definition |
|------------------|---------------------|
| Mostly programmatic deposits/withdrawals via Provisioner. Strategy allocation determined by offchain engine. | Keeper-submitted unit price (offchain NAV computation). Soft guards (±0.10%, 60-min, 255s age) pause vault on violation but **never block** the price update. Vault owner can unpause. |

Score: **3.5/5** — Hybrid onchain/offchain operations. The PPS is keeper-submitted with soft-guard-only limits, creating a trust dependency on the offchain engine accurately reporting yield and the keeper not acting maliciously.

**Subcategory C: External Dependencies**

| Protocol Dependencies | Criticality |
|----------------------|-------------|
| Morpho (4 chains), USDC, Circle CCTP v2 bridge, Aera Protocol | Morpho, USDC, and CCTP are all established. Cross-chain bridge is now identified as canonical Circle CCTP (no bespoke bridge-operator trust). Aera Protocol is the foundational layer. |

Score: **3.0/5** — Multiple dependencies, but all on established protocols: Morpho, USDC, and the canonical Circle CCTP bridge (identified onchain via `TokenMinterV2`), which removes the previously unquantified bridge risk. Residual surface is multi-curator Morpho market risk across 4 chains and dependence on the Aera Protocol contracts. Morpho failure would disrupt yield but not directly cause principal loss (funds are in lending markets).

**Centralization Score = (3.0 + 3.5 + 3.0) / 3 = 3.17**

**Score: 3.17/5** — Adequate governance structure with timelock, but admin-controlled PPS, guardian arbitrary execution, and 3/9 multisig concentration are concerns.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Backing | Collateral Quality | Verifiability |
|---------|-------------------|---------------|
| 100% USDC-backed | Blue-chip (USDC) | Total supply onchain; cross-chain positions require aggregation |

Score: **1.5/5** — Fully backed by blue-chip USDC collateral. The backing is strong and the collateral is high quality. Minor deduction for cross-chain verifiability complexity.

**Subcategory B: Provability**

| Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|---------------------|--------------------|-----------------------|
| Total supply onchain; USDC balances onchain; cross-chain positions require offchain aggregation | Keeper-submitted unit price (offchain NAV) with soft-guard-only limits (±0.10%); Gauntlet App provides allocation data | None identified |

Score: **3.0/5** — Hybrid onchain/offchain reporting. The keeper-submitted PPS means yield reporting depends on the offchain engine's accuracy, with soft guards that pause but never block malicious prices. No third-party verification mechanism.

**Funds Management Score = (1.5 + 3.0) / 2 = 2.25**

**Score: 2.25/5** — Strong collateralization with USDC, but the admin-controlled PPS and lack of independent verification are significant.

#### Category 4: Liquidity Risk (Weight: 15%)

| Exit Mechanism | Liquidity Depth | Large Holder Impact |
|---------------|----------------|---------------------|
| Direct redemption through Provisioner; async request-solve flow available | ~$60M aggregate TVL across 4 chains; Ethereum vault has $0 idle USDC | Top Ethereum holder ~53%; cross-chain recall may delay large exits |

Score: **3.0/5** — Redemption mechanism exists. The Ethereum vault has zero idle USDC and a concentrated holder base, but the $60M aggregate TVL (mostly on Base) provides more exit capacity. Cross-chain fund deployment means large withdrawals may face delays; same-value USDC redemption mitigates price risk.

#### Category 5: Operational Risk (Weight: 5%)

| Team Transparency | Documentation | Legal/Compliance |
|------------------|---------------|-----------------|
| Gauntlet Networks, Inc. (NYC, US; founded 2018; Series B) — well-known, 8+ years in DeFi | Extensive docs via VaultBook + Aera security page; full Aera contract reference still thin | No formal incident-response plan published; disclosure via Immunefi; legal entity identified |

Score: **1.5/5** — Strong reputation, extensive documentation, identified legal entity (Gauntlet Networks, Inc.), and confirmed audits. Residual gaps: no formal published incident-response plan and multisig signers not individually validated.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.17 | 30% | 0.951 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.651/5.0** |

**Final Score: 2.7/5.0** (rounded from 2.651)

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

- **Time-based**: Reassess in 3 months (September 2026)
- **TVL-based**: Reassess if Ethereum TVL exceeds $10M or drops below $500K
- **Incident-based**: Reassess after any exploit, governance change (multisig signer set, timelock delay), provisioner change, unit price manipulation event, or strategy allocation change >50%
- **Audit-based**: Reassess if a new Aera version is deployed without a fresh audit, or if additional tier-1 audits of Aera V3 are published
- **Bridge-based**: Reassess if the vault migrates off Circle CCTP to a different (e.g. third-party lock-and-mint) bridge, or if CCTP undergoes significant changes
- **Concentration-based**: Reassess if the top holder exceeds 60% of supply or if holder count drops materially below the current ~27
