# Protocol Risk Assessment: Metronome Synths (msUSD / msETH)

## Overview + Links

Metronome is a decentralized multi-collateral, multi-synthetic protocol that allows users to deposit crypto assets as collateral and mint synthetic versions of popular assets. The core product, **Metronome Synth**, enables minting of **msUSD** (synthetic USD), **msETH** (synthetic ETH), and **msBTC** (synthetic BTC).

Users deposit collateral (e.g., USDC, ETH, WBTC, or yield-bearing Vesper Finance tokens like vaUSDC, vaETH) and mint synthetics up to their collateral factor limit. Synthetic assets are always internally valued at their reference asset's oracle price (msUSD = $1.00, msETH = ETH price), which protects against DEX peg deviations triggering liquidations on the debt side.

Key features:
- **Productive Collateral**: Vesper Finance yield-bearing tokens (vaUSDC, vaETH, etc.) can be used as collateral, earning yield while backing synthetics
- **Smart Farming**: Automated yield looping — deposit productive collateral → mint synth → swap on DEX → redeposit
- **Synth Marketplace**: In-protocol swap between synthetic assets with zero slippage
- **Cross-chain**: Deployed on Ethereum, Optimism, Base, and Hemi via LayerZero OFT

The protocol was originally launched as Metronome 1.0 in June 2018. It relaunched as **Metronome 2.0** in August 2022 with a new governance token (MET 2.0). The Synth protocol launched in early 2023. Built by **Bloq, Inc.**, the same company behind Vesper Finance.

**Links:**

- [Protocol Documentation](https://docs.metronome.io)
- [Protocol App](https://app.metronome.io)
- [Smart Farming](https://app.metronome.io/eth/smart-farming)
- [GitHub - Contracts](https://github.com/autonomoussoftware/metronome-synth-public)
- [Immunefi Bug Bounty](https://immunefi.com/bounty/metronome/)
- [Snapshot Governance](https://snapshot.org/#/metronome.eth)
- [Tally On-Chain Governance](https://www.tally.xyz/gov/metronome-dao)
- [DeFiLlama](https://defillama.com/protocol/metronome)
- [CoinGecko - msUSD](https://www.coingecko.com/en/coins/metronome-synth-musd)
- [CoinGecko - msETH](https://www.coingecko.com/en/coins/metronome-synth-eth)

## Contract Addresses

### Ethereum Mainnet

| Contract | Address |
|----------|---------|
| Pool | [`0x3364f53cB866762Aef66DeEF2a6b1a17C1F17f46`](https://etherscan.io/address/0x3364f53cB866762Aef66DeEF2a6b1a17C1F17f46) |
| PoolRegistry | [`0x11eaD85C679eAF528c9C1FE094bF538Db880048A`](https://etherscan.io/address/0x11eaD85C679eAF528c9C1FE094bF538Db880048A) |
| msUSD Synthetic | [`0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA`](https://etherscan.io/address/0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA) |
| msETH Synthetic | [`0x64351fC9810aDAd17A690E4e1717Df5e7e085160`](https://etherscan.io/address/0x64351fC9810aDAd17A690E4e1717Df5e7e085160) |
| msBTC Synthetic | [`0x8b4F8aD3801B4015Dea6DA1D36f063Cbf4e231c7`](https://etherscan.io/address/0x8b4F8aD3801B4015Dea6DA1D36f063Cbf4e231c7) |
| msUSD Debt | [`0x480e3178Fa102dF852643d47CAbdb9adf5dB0174`](https://etherscan.io/address/0x480e3178Fa102dF852643d47CAbdb9adf5dB0174) |
| msETH Debt | [`0xF43de8E0c2596E30c77d69d158842D1d9B937D7c`](https://etherscan.io/address/0xF43de8E0c2596E30c77d69d158842D1d9B937D7c) |
| msBTC Debt | [`0xB93f48D3eA42a25f367fAde092A6Bb56DAB5F7cB`](https://etherscan.io/address/0xB93f48D3eA42a25f367fAde092A6Bb56DAB5F7cB) |
| FeeProvider | [`0x6b53C16B94c1502C661140073ed522aC7Dbc5E5E`](https://etherscan.io/address/0x6b53C16B94c1502C661140073ed522aC7Dbc5E5E) |
| Treasury | [`0x3691EF68Ba22a854c36bC92f6b5F30473eF5fb0A`](https://etherscan.io/address/0x3691EF68Ba22a854c36bC92f6b5F30473eF5fb0A) |
| SmartFarmingManager | [`0xE0e7Ac2b0884BA8A05190fb6CEAFFaDc7c3AEDf1`](https://etherscan.io/address/0xE0e7Ac2b0884BA8A05190fb6CEAFFaDc7c3AEDf1) |
| CrossChainDispatcher | [`0x8BD81c99a2D349F6fB8E8a0B32C81704e3FE7302`](https://etherscan.io/address/0x8BD81c99a2D349F6fB8E8a0B32C81704e3FE7302) |
| MsUSD ProxyOFT | [`0xF37982E3F33ac007C690eD6266F3402d24aA27Ea`](https://etherscan.io/address/0xF37982E3F33ac007C690eD6266F3402d24aA27Ea) |
| MsETH ProxyOFT | [`0x5c574153B195AE284C063a84fB9C73d9fd37955F`](https://etherscan.io/address/0x5c574153B195AE284C063a84fB9C73d9fd37955F) |
| NativeTokenGateway | [`0x564baA321227abf6B2E88a38557b6517077aAD32`](https://etherscan.io/address/0x564baA321227abf6B2E88a38557b6517077aAD32) |
| MET Token | [`0x2Ebd53d035150f328bd754D6DC66B99B0eDB89aa`](https://etherscan.io/address/0x2Ebd53d035150f328bd754D6DC66B99B0eDB89aa) |
| esMET (MET Escrow) | [`0xA28D70795a61Dc925D4c220762A4344803876bb8`](https://etherscan.io/address/0xA28D70795a61Dc925D4c220762A4344803876bb8) |
| Governor | [`0xc8697de7c190244bfd63d276823aa20035cb5a12`](https://etherscan.io/address/0xc8697de7c190244bfd63d276823aa20035cb5a12) |
| Timelock | [`0x4c510878B907d6DDf69E6057ad2f865f60fB7775`](https://etherscan.io/address/0x4c510878B907d6DDf69E6057ad2f865f60fB7775) |
| ProxyAdmin (Synths) | [`0x2fa85a496a9b79c6d50cef590304bdd36efa2dcc`](https://etherscan.io/address/0x2fa85a496a9b79c6d50cef590304bdd36efa2dcc) |
| ProxyAdmin (Pool) | [`0xd4de85da9f2ca8c7c63dcdb417d0b5ce65a6f1be`](https://etherscan.io/address/0xd4de85da9f2ca8c7c63dcdb417d0b5ce65a6f1be) |

Both ProxyAdmin contracts are owned by [`0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33`](https://etherscan.io/address/0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33).

### Base

| Contract | Address |
|----------|---------|
| Pool | [`0xAeDF96597338FE03E8c07a1077A296df5422320e`](https://basescan.org/address/0xAeDF96597338FE03E8c07a1077A296df5422320e) |
| msUSD Synthetic | [`0x526728dbc96689597f85ae4cd716d4f7fccbae9d`](https://basescan.org/address/0x526728dbc96689597f85ae4cd716d4f7fccbae9d) |
| msETH Synthetic | [`0x7ba6f01772924a82d9626c126347a28299e98c98`](https://basescan.org/address/0x7ba6f01772924a82d9626c126347a28299e98c98) |
| Governor (Safe 3/5) | [`0xE01Df4ac1E1e57266900E62C37F12C986495A618`](https://basescan.org/address/0xE01Df4ac1E1e57266900E62C37F12C986495A618) |

### Optimism

| Contract | Address |
|----------|---------|
| Pool | [`0x4c6bf87b7fc1c8db85877151c6ede38ed27c34f6`](https://optimistic.etherscan.io/address/0x4c6bf87b7fc1c8db85877151c6ede38ed27c34f6) |
| msUSD Synthetic | [`0x9dabae7274d28a45f0b65bf8ed201a5731492ca0`](https://optimistic.etherscan.io/address/0x9dabae7274d28a45f0b65bf8ed201a5731492ca0) |
| msETH Synthetic | [`0x1610e3c85dd44af31ed7f33a63642012dca0c5a5`](https://optimistic.etherscan.io/address/0x1610e3c85dd44af31ed7f33a63642012dca0c5a5) |
| Governor (Safe 3/5) | [`0xE01Df4ac1E1e57266900E62C37F12C986495A618`](https://optimistic.etherscan.io/address/0xE01Df4ac1E1e57266900E62C37F12C986495A618) |

**Base/Optimism Safe Signers (3/5):**

| # | Signer |
|---|--------|
| 1 | [`0xa13011197D6793453d86eBCD3B13Cc49A234C339`](https://etherscan.io/address/0xa13011197D6793453d86eBCD3B13Cc49A234C339) |
| 2 | [`0xea28d5d66AE91f12723D6881ce39D8084E332EAe`](https://etherscan.io/address/0xea28d5d66AE91f12723D6881ce39D8084E332EAe) |
| 3 | [`0xb3983cDdBa4B127960A4cDD531AB989264509e23`](https://etherscan.io/address/0xb3983cDdBa4B127960A4cDD531AB989264509e23) |
| 4 | [`0x25FCe091c5b51edEfc7a4A0E765f10ed032e804F`](https://etherscan.io/address/0x25FCe091c5b51edEfc7a4A0E765f10ed032e804F) |
| 5 | [`0xf3e996C8cd4ab3fDad381584D5Bd90C01Ec3C082`](https://etherscan.io/address/0xf3e996C8cd4ab3fDad381584D5Bd90C01Ec3C082) |

**Token Supply (as of 2026-02-13):**

| Token | Chain | Supply |
|-------|-------|--------|
| msUSD | Ethereum | ~10,975,073 |
| msUSD | Base | ~9,646,673 |
| msUSD | Optimism | ~1,106,899 |
| msETH | Ethereum | TODO |
| msETH | Base | ~6,634 ETH |
| msETH | Optimism | ~341 ETH |

## Audits and Due Diligence Disclosures

The GitHub repository (`autonomoussoftware/metronome-synth-public`) contains an `audits/` directory with at least 12 audit reports:

| Auditor | Scope | Date | Link |
|---------|-------|------|------|
| **Halborn** | Vesper Finance Synth Smart Contract | 2022-2023 | [GitHub audits/](https://github.com/autonomoussoftware/metronome-synth-public/tree/main/audits) |
| **Halborn** | Vesper Synth (second report) | 2022-2023 | [GitHub audits/](https://github.com/autonomoussoftware/metronome-synth-public/tree/main/audits) |
| **Internal (Vesper/Bloq)** | Metronome Synth Core (BLOQ-MSC) | Dec 2022 | [GitHub audits/](https://github.com/autonomoussoftware/metronome-synth-public/tree/main/audits) |
| **Internal (Vesper/Bloq)** | BLOQ AMO | 2022-2023 | [GitHub audits/](https://github.com/autonomoussoftware/metronome-synth-public/tree/main/audits) |
| **Internal (Vesper/Bloq)** | Vesper Synth Delta audits | Jan-June 2022 | Multiple reports in [GitHub audits/](https://github.com/autonomoussoftware/metronome-synth-public/tree/main/audits) |
| **Internal (Vesper/Bloq)** | Vesper Metronome Synth + esMET | Feb 2023 | [GitHub audits/](https://github.com/autonomoussoftware/metronome-synth-public/tree/main/audits) |

### Smart Contract Complexity

High complexity. The repository contains **~175 Solidity files**. Core contracts include:
- Pool.sol (29.6 KB) — central contract for deposits, debt, liquidations, swaps, leverage
- SmartFarmingManager.sol (29.3 KB) — automated yield looping
- CrossChainDispatcher.sol (30.2 KB) — LayerZero cross-chain operations
- DepositToken.sol (20 KB), DebtToken.sol (19.7 KB), SyntheticToken.sol (12.7 KB)

All contracts use OpenZeppelin upgradeable proxy pattern (TransparentUpgradeableProxy). MIT license.

### Bug Bounty

- **Platform**: [Immunefi](https://immunefi.com/bounty/metronome/)
- **Launch Date**: February 21, 2023
- **Maximum Payout**: $50,000 (critical smart contract)
- **High**: $5,000-$10,000
- **Medium**: $1,000-$5,000
- **KYC Required**: Yes
- **PoC Required**: Yes
- **Assets in Scope**: ~20 contracts including AMO, CrossChainDispatcher, deposit tokens

The $50K max bounty is relatively modest compared to similarly-sized protocols.

## Historical Track Record

- **Production History**: Metronome 1.0 launched June 2018. Metronome 2.0 (MET token migration) launched August 2022. Metronome Synth launched early 2023. The protocol has been live in production for approximately **3 years** (Synth product for ~2 years).
- **TVL** (DeFiLlama, as of 2026-02-13):
  - Ethereum: $14,860,903
  - Optimism: $2,005,954
  - Base: $1,116,952
  - **Total Protocol TVL: ~$17.98M**
- **Market Data** (CoinGecko):
  - msUSD: $0.9957, market cap $21.84M, 24h volume $2.19M
  - msETH: $1,936.78, market cap $23.84M, 24h volume $1.89M
- **Incidents**:
  - **Sonne Finance exploit (May 2024)**: Affected Metronome positions on Optimism. A Metronome Improvement Proposal (MIP) was submitted for remediation.
  - No direct smart contract exploits of Metronome Synth contracts found on rekt.news.
- **Peg Stability** (CoinGecko):
  - msUSD currently trading at $0.9957 (slight discount to $1.00)
  - Historical ATL of $0.43 and ATH of $3.43 indicate past depeg events (likely related to thin liquidity in early days)
- **Concentration Risk**: With ~$18M protocol TVL spread across 3 chains, user base is moderately concentrated.

## Funds Management

Metronome Synth is a **self-contained CDP protocol** — collateral is held within its own Pool contracts. It does not delegate funds to external lending protocols. However, users can deposit **yield-bearing Vesper Finance tokens** as productive collateral, which indirectly exposes funds to Vesper Finance strategies.

### Accessibility

- **Minting**: Anyone can deposit collateral and mint synthetics up to their collateral factor limit.
- **Redemption**: Users repay their synthetic debt to unlock collateral. There is no direct 1:1 redemption mechanism (unlike Liquity). Users exit by repaying debt and withdrawing collateral, or by selling synthetics on DEXes.
- **Fees**:

| Fee Type | Amount | Notes |
|----------|--------|-------|
| Synth Balance Fee | Annualized, per-second | Applied by increasing outstanding position |
| Marketplace Swap Fee | 0.45% (OP/Base), 0.55% (Ethereum) | In-protocol synth-to-synth swaps |
| Liquidation Fee | 18% total | 10% to liquidator, 8% to protocol |

- **Rate Limits**: Deposit caps per collateral asset and mintage caps per synth. Cross-chain bridge caps via `maxBridgedInSupply()` and `maxBridgedOutSupply()`.
- **No explicit cooldown periods** documented.

### Collateralization

- **Backing**: All synthetics are over-collateralized. Users must maintain collateral value above their collateral factor threshold.
- **Collateral Quality**: Mix of blue-chip assets (USDC, ETH, WBTC, DAI) and yield-bearing Vesper tokens (vaUSDC, vaETH, etc.) with varying risk profiles.
- **Collateral Factors** (maximum borrowing power as % of collateral value):

| Asset | Collateral Factor | Category |
|-------|-------------------|----------|
| USDC | 85% | Stablecoin |
| DAI | 85% | Stablecoin |
| FRAX | 83% | Stablecoin |
| vaUSDC | 82% | Productive Stablecoin |
| vaFRAX | 80% | Productive Stablecoin |
| ETH | 83% | ETH |
| vaETH | 80% | Productive ETH |
| sfrxETH | 80% | ETH LST |
| vastETH | 78% | Productive ETH |
| varETH | 75% | Productive ETH |
| vacbETH | 67% | Productive ETH |
| WBTC | 80% | BTC |

- **Liquidations**: On-chain, anyone can call `liquidate()`. Liquidator repays synthetic debt and receives collateral + 10% bonus. Protocol takes 8%. No grace period.
- **Deposit Caps** (Ethereum):

| Asset | Cap |
|-------|-----|
| USDC | 10,000,000 |
| DAI | 10,000,000 |
| FRAX | 9,000,000 |
| ETH | 4,286 |
| WBTC | 311 |
| vaUSDC | 8,000,000 |
| vaETH | 3,190 |

- **Risk Curation**: Collateral factors are determined by a 5-variable risk scoring framework (Issuance/Market Cap, Open Market Liquidity, Lindy Score, Peg Volatility, Rehypothecation). Changes require governance action.

**Ethereum Pool Collateral Balances (on-chain):**

| Asset | Balance | Approx. Value |
|-------|---------|---------------|
| USDC | 5,837,355 | ~$5.84M |
| WETH | 257.37 | ~$500K |
| WBTC | 3.51 | ~$340K |
| vaUSDC | ~1,756,292 tokens | Variable |
| vaETH | ~1,835 tokens | Variable |
| sfrxETH | ~1,592 tokens | Variable |
| DAI | ~152 | Negligible |
| FRAX | ~101 | Negligible |

### Provability

- **On-chain Verification**: Collateral balances are fully verifiable on-chain in Pool contracts on each chain.
- **Oracle-based Pricing**: Chainlink oracle feeds determine collateral values and health factors. Synth assets are hard-coded to their reference asset's oracle price internally (msUSD = $1, msETH = ETH price), preventing peg deviations from triggering liquidations.
- **No Exchange Rate**: Synthetics are not yield-bearing vault tokens — there is no PPS/exchange rate to verify. The system tracks debt positions, not share prices.
- **Productive Collateral Transparency**: Vesper Finance tokens (vaUSDC, vaETH, etc.) have their own on-chain exchange rates, which can be independently verified.

## Liquidity Risk

### On-Chain Liquidity Summary

**Total DEX Pool TVL: $75.88M** across 26 pools on 5 chains:

| DEX / Chain | TVL | Pools |
|---|---|---|
| Aerodrome (Base) | $39.54M | 6 |
| Curve (Ethereum) | $30.90M | 8 |
| Velodrome (Optimism) | $2.96M | 4 |
| Uniswap V3 (Ethereum) | $1.52M | 2 |
| Balancer V3 / Beets | $0.79M | 4 |
| SushiSwap V3 (Hemi) | $0.18M | 2 |

### Top DEX Pools by TVL

| Chain | DEX | Pool | TVL | 24h Volume | 7d Volume |
|---|---|---|---|---|---|
| Base | Aerodrome Slipstream | msUSD-USDC | $16.67M | $323K | $63.82M |
| Ethereum | Curve | msETH-WETH | $11.80M | $292K | $43.54M |
| Ethereum | Curve | msUSD-FRAXBP | $10.28M | $341K | $23.98M |
| Base | Aerodrome Slipstream | WETH-msETH | $10.01M | $506K | $69.02M |
| Base | Aerodrome V1 | WETH-msETH | $7.00M | N/A | N/A |
| Ethereum | Curve | FRXUSD-msUSD | $5.56M | $153K | $6.48M |
| Base | Aerodrome V1 | msUSD-USDC | $4.71M | N/A | N/A |

### DEX TVL by Chain

| Chain | DEX TVL |
|---|---|
| Base | $39.54M |
| Ethereum | $33.18M |
| Optimism | $2.96M |
| Hemi | $0.18M |
| Sonic | $0.03M |

### Yield/Wrapper Ecosystem

An additional **$87.4M** is locked in yield aggregators and lending protocols built on top of the DEX pools, indicating strong DeFi integration:

| Protocol | Notable Pools | TVL |
|---|---|---|
| Main Street | msUSD | $13.25M |
| Convex | msETH-WETH, msUSD-FRAXBP, FRXUSD-msUSD | $18.68M |
| Morpho V1 | msUSD/USDC, msETH vaults | $17.28M |
| Vesper | msUSD, msETH | $11.68M |
| Stake DAO | msETH-WETH, msUSD-FRAXBP | $9.78M |
| Beefy | Various | $9.64M |
| Yearn | msETH-WETH, msUSD vaults | $1.34M |
| Pendle | msUSD | $1.81M |

### Liquidity Assessment

- **Ethereum msUSD**: ~$33M Curve + Uniswap + Balancer liquidity. Sufficient for moderate exits.
- **Ethereum msETH**: ~$12.5M Curve liquidity. Moderate depth.
- **Base msUSD/msETH**: ~$39.5M Aerodrome liquidity. Deepest liquidity overall.
- **24h Volume**: ~$4.08M combined (msUSD: $2.19M, msETH: $1.89M).
- **Exit Path**: No direct 1:1 redemption. Users must either repay debt + withdraw collateral, or sell on DEX. Market-based exit via DEX pools.
- **Historical Peg**: msUSD has had historical depeg events (ATL $0.43, ATH $3.43) likely during thin early liquidity, but currently trades at $0.9957.
- **7d Volume**: Top pools show high utilization — Aerodrome WETH-msETH pool had $69M in 7-day volume against $10M TVL.

## Centralization & Control Risks

### Governance

**Ethereum:**
- **On-chain Governor**: Compound-style Governor at [`0xc8697de7c190244bfd63d276823aa20035cb5a12`](https://etherscan.io/address/0xc8697de7c190244bfd63d276823aa20035cb5a12)
  - Voting token: esMET (MET Escrow) at [`0xA28D70795a61Dc925D4c220762A4344803876bb8`](https://etherscan.io/address/0xA28D70795a61Dc925D4c220762A4344803876bb8)
  - esMET Total Supply: ~8,356,419 esMET
  - Proposal threshold: 25,000 MET
  - Quorum: ~11,642 MET
  - Voting delay: 5,760 blocks (~19.2 hours)
  - Voting period: 40,320 blocks (~134.4 hours / ~5.6 days)
- **Timelock**: [`0x4c510878B907d6DDf69E6057ad2f865f60fB7775`](https://etherscan.io/address/0x4c510878B907d6DDf69E6057ad2f865f60fB7775) — **48-hour delay**
- **ProxyAdmin Owner**: [`0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33`](https://etherscan.io/address/0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33) — controls upgrades for both ProxyAdmin contracts

**Base / Optimism:**
- **Governor**: 3/5 Gnosis Safe ([`0xE01Df4ac1E1e57266900E62C37F12C986495A618`](https://basescan.org/address/0xE01Df4ac1E1e57266900E62C37F12C986495A618))
- Same 5 EOA signers on both chains
- No timelock on L2 deployments
- Signer identities not publicly disclosed

**Governance Process (Progressive Decentralization):**

| Phase | Description |
|-------|-------------|
| Phase 1 (Launch) | Sentiment votes, 2-of-4 multisig implements outcomes |
| Phase 2 (~1 month) | Multisig expands to 3-of-5 with external signers |
| Phase 3 (~3 months) | Binding votes begin; multisig retains veto on safety |
| Phase 4 (~9 months) | More binding votes; multisig loses veto except on token supply |
| Phase 5 (~15 months) | Full decentralization, all decisions by community vote |

**Snapshot Governance**: ~30 MIPs on [Snapshot](https://snapshot.org/#/metronome.eth). Low voter participation (3-12 votes per proposal).

**Privileged Roles:**
- ProxyAdmin owner can upgrade all contracts on Ethereum
- 3/5 multisig controls all contracts on Base and Optimism
- Governor/Timelock system on Ethereum (48h delay)
- Pool governor can modify collateral factors, deposit caps, fee parameters

### Programmability

- **Core Operations**: Fully programmatic on-chain — deposits, minting, liquidations, and swaps are all automated via smart contracts.
- **Smart Farming**: Automated yield looping via SmartFarmingManager contract.
- **No PPS/Rate**: Synthetics are debt-position based, not share-price based. No admin-controlled exchange rate.
- **Oracle Dependency**: Chainlink price feeds are used for all collateral valuation and health factor calculations.
- **Fee Adjustments**: FeeProvider contract parameters can be changed by governance.

### External Dependencies

| Dependency | Criticality | Risk Level |
|------------|-------------|------------|
| **Chainlink** | Critical — all price feeds for collateral valuation | Low-Medium. Well-established oracle network |
| **Vesper Finance** | High — productive collateral tokens (vaUSDC, vaETH, etc.) | Medium. Same parent company (Bloq). Vesper smart contract risk |
| **LayerZero** | High — cross-chain synthetic transfers (OFT pattern) | Medium. Major cross-chain messaging protocol |
| **Stargate** | Medium — cross-chain token bridging | Medium |
| **Curve** | Medium — DEX used for Smart Farming swaps | Low. Battle-tested DEX |
| **OpenZeppelin** | Low — upgradeability framework | Low. Industry standard |

## Operational Risk

- **Team Transparency**: Built by **Bloq, Inc.** (Chicago/Atlanta, founded 2016). CEO **Jeff Garzik** is a well-known Bitcoin Core developer. Chairman **Matthew Roszak** is a known crypto investor. ~40 team members (120 including Bloq spinoffs). The team operates under the Autonomous Software GitHub organization.
- **Documentation Quality**: Good. Comprehensive GitBook documentation at docs.metronome.io covering protocol mechanics, risks, governance, and contracts. Open-source codebase (MIT license).
- **Legal Structure**: Bloq, Inc. is a US-based company. Vesper Brewing Co Ltd (BVI) appears as the entity for the Vesper Finance GitHub org. DAO governance via MET token.
- **Incident Response**: Demonstrated response to Sonne Finance exploit impact (MIP remediation proposal). Immunefi bug bounty since Feb 2023. No specific incident response plan documented.
- **MET Token Distribution**: Total supply at migration: 14,377,915 MET. Distribution: DAO Treasury (8.2M, 57%), Uniswap LP (2M), Team & Advisors (2M, 24-month vesting), Community (1.87M).

## Monitoring

### Key Contracts to Monitor

**Ethereum:**
- Pool: [`0x3364f53cB866762Aef66DeEF2a6b1a17C1F17f46`](https://etherscan.io/address/0x3364f53cB866762Aef66DeEF2a6b1a17C1F17f46)
- msUSD: [`0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA`](https://etherscan.io/address/0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA)
- msETH: [`0x64351fC9810aDAd17A690E4e1717Df5e7e085160`](https://etherscan.io/address/0x64351fC9810aDAd17A690E4e1717Df5e7e085160)
- Governor: [`0xc8697de7c190244bfd63d276823aa20035cb5a12`](https://etherscan.io/address/0xc8697de7c190244bfd63d276823aa20035cb5a12)
- Timelock: [`0x4c510878B907d6DDf69E6057ad2f865f60fB7775`](https://etherscan.io/address/0x4c510878B907d6DDf69E6057ad2f865f60fB7775)
- ProxyAdmin Owner: [`0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33`](https://etherscan.io/address/0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33)

**Base / Optimism:**
- Pool contracts and Safe multisig on each chain

### Critical Events to Watch

- **Contract upgrades** via ProxyAdmin (Ethereum) or multisig (Base/Optimism)
- **Collateral factor or deposit cap changes** on Pool contracts
- **Large mint/burn events** on synthetic tokens
- **msUSD peg deviations** >2% on DEXes
- **Liquidation events** — elevated liquidation activity may indicate collateral stress
- **Governor proposals** and timelock executions
- **Cross-chain bridge activity** anomalies (LayerZero OFT transfers)
- **Vesper Finance vault** health (vaUSDC, vaETH exchange rates)

### Recommended Frequency

- **Hourly**: Peg monitoring, large transaction alerts
- **Daily**: TVL changes, collateral ratio trends, DEX pool balance ratios
- **Weekly**: Governance activity, Vesper vault health, cross-chain supply consistency

## Risk Summary

### Key Strengths

- **Deep liquidity**: $75.9M in DEX pools + $87.4M in yield aggregators. Among the deepest synth liquidity in DeFi.
- **Multi-chain presence**: Deployed on Ethereum, Base, Optimism with significant liquidity on each.
- **Experienced team**: Bloq Inc. (Jeff Garzik, Matthew Roszak) with 8+ years in crypto infrastructure. Same team behind Vesper Finance.
- **On-chain governance with timelock**: Compound Governor + 48-hour timelock on Ethereum provides meaningful protection against sudden parameter changes.
- **Comprehensive DeFi integration**: Integrated with Convex, Morpho, Stake DAO, Beefy, Yearn, Pendle — indicating trust from major DeFi protocols.

### Key Risks

- **Upgradeable contracts**: All contracts are upgradeable proxies. ProxyAdmin owner on Ethereum can upgrade contracts (relationship between ProxyAdmin owner and Governor/Timelock needs clarification — TODO).
- **3/5 multisig on L2s**: Base and Optimism deployments are governed by a 3/5 multisig with no timelock and anonymous signers.
- **Vesper Finance dependency**: Productive collateral tokens (vaUSDC, vaETH) introduce smart contract risk from Vesper Finance. Same parent company creates concentration risk.
- **Modest bug bounty**: $50K max payout is low relative to protocol TVL ($18M) and DEX liquidity ($76M).
- **Historical depeg events**: msUSD has experienced extreme price deviations ($0.43 - $3.43 historically), though current peg is stable.

### Critical Risks

- **ProxyAdmin upgrade path**: The ProxyAdmin owner (`0xd1DE...`) controls contract upgrades on Ethereum. If this address is not controlled by the Timelock/Governor, upgrades could bypass governance.
- **Low governance participation**: Only 3-12 votes per Snapshot proposal suggests governance is effectively centralized among a small group.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [ ] **No audit** - Protocol has been audited by Halborn (external) and internal teams. Multiple audit reports exist.
- [ ] **Unverifiable reserves** - Collateral is fully on-chain in Pool contracts, verifiable by anyone.
- [ ] **Total centralization** - Ethereum has Governor + 48h Timelock. L2s have 3/5 multisig.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 2 Halborn audits (external) + multiple internal (Vesper/Bloq) audits. No audits from top-tier firms (Trail of Bits, OpenZeppelin, Spearbit). ~12 total audit reports in repository.
- **Bug Bounty**: Immunefi program since Feb 2023, but max $50K payout is modest.
- **Time in Production**: Synth protocol live since early 2023 (~2 years). Metronome 1.0 since 2018.
- **TVL**: ~$18M protocol TVL. $76M in DEX liquidity.
- **Incidents**: Indirectly affected by Sonne Finance exploit (May 2024). No direct exploits.

**Score: 2.5/5** - Multiple audits (Halborn + internal) and 2+ years production with no direct exploits. Bug bounty present but modest. Halborn is reputable but not top-tier. Strong long-term track record from Metronome 1.0.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- Ethereum: Compound Governor with esMET voting token + 48-hour Timelock. Good governance structure.
- Base/Optimism: 3/5 multisig with no timelock and anonymous signers — weaker governance.
- ProxyAdmin owner controls contract upgrades — relationship to Governor/Timelock unclear.
- Low governance participation (3-12 voters).

**Governance Score: 3/5** - On-chain Governor with 48h timelock on Ethereum is good, but L2 deployments rely on a 3/5 multisig without timelock. Anonymous signers and low participation reduce confidence.

**Subcategory B: Programmability**

- Core operations (deposits, minting, liquidations, swaps) are fully programmatic.
- No admin-controlled exchange rate (debt-position based, not vault-share based).
- Oracle prices from Chainlink (external but reliable).
- Fee parameters adjustable by governance.
- Smart Farming is automated via smart contract.

**Programmability Score: 2/5** - Highly programmatic system with on-chain automation. Minor admin input for fee parameters.

**Subcategory C: External Dependencies**

- Chainlink (critical — all price feeds)
- Vesper Finance (high — productive collateral)
- LayerZero (high — cross-chain transfers)
- Curve (medium — Smart Farming swaps)

**Dependencies Score: 3/5** - Multiple established dependencies. Chainlink and LayerZero are well-established. Vesper is same-company, adding concentration risk.

**Centralization Score = (3 + 2 + 3) / 3 = 2.67**

**Score: 2.7/5** - Good governance on Ethereum (Governor + Timelock) but weaker on L2s (3/5 multisig). Moderate external dependencies.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Over-collateralized CDP model with varying collateral factors (67%-85%).
- Mix of blue-chip (USDC, ETH, WBTC) and DeFi-native (Vesper va-tokens) collateral.
- On-chain liquidation mechanism with 18% penalty (incentivized).
- Deposit caps limit exposure per asset.
- Risk scoring framework for collateral factor determination.

**Collateralization Score: 2/5** - Over-collateralized with blue-chip assets and on-chain liquidations. Productive collateral (Vesper tokens) adds a layer of risk but is well-managed with lower collateral factors.

**Subcategory B: Provability**

- Collateral fully on-chain in Pool contracts — anyone can verify balances.
- Chainlink oracle feeds are transparent.
- No complex off-chain accounting or opaque exchange rates.
- Vesper token exchange rates verifiable on-chain.
- Multi-chain deployment adds complexity but all data is on-chain.

**Provability Score: 1.5/5** - Fully on-chain, programmatic collateral tracking. No off-chain components for reserve verification.

**Funds Management Score = (2 + 1.5) / 2 = 1.75**

**Score: 1.75/5** - Strong collateralization model with full on-chain provability. Over-collateralized with transparent liquidation mechanics.

#### Category 4: Liquidity Risk (Weight: 15%)

- **DEX Liquidity**: $75.88M total across 5 chains. $33.18M on Ethereum alone.
- **Top Pools**: msUSD-USDC Aerodrome ($16.67M), msETH-WETH Curve ($11.80M), msUSD-FRAXBP Curve ($10.28M).
- **Exit Mechanism**: Market-based (DEX swap). No direct 1:1 redemption — users must repay debt or swap on DEX.
- **Volume**: $4.08M combined 24h volume. High 7d utilization in top pools.
- **Yield Ecosystem**: $87.4M in yield aggregators shows deep integration.
- **Historical Peg**: Past depeg events (ATL $0.43) but current peg is stable at $0.9957.

**Score: 2/5** - Very strong DEX liquidity ($76M) with active trading. Market-based exit only (no 1:1 redemption), but pool depth allows large exits with minimal slippage. Historical depeg events are concerning but occurred during early thin liquidity.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Bloq Inc. is well-known. Jeff Garzik (Bitcoin Core dev) and Matthew Roszak are public figures.
- **Documentation**: Good GitBook docs, open-source code, public governance process.
- **Legal Structure**: US-based company (Bloq Inc.). BVI entity for Vesper. DAO governance.
- **Incident Response**: Demonstrated response to Sonne exploit impact. Immunefi program active.

**Score: 2/5** - Well-known team with strong reputation, good documentation, and clear legal structure.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 2.7 | 30% | 0.81 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.235/5.0** |

**Optional Modifiers:**
- Protocol live >2 years with no direct incidents: **-0.0** (Sonne incident was indirect but still affected users)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Low Risk (2.2/5.0)**

Metronome Synth benefits from deep DEX liquidity ($76M), strong DeFi integration ($87M in yield aggregators), an experienced and public team (Bloq/Garzik), and a fully on-chain over-collateralized model with transparent reserves. The Governor + 48h Timelock on Ethereum provides meaningful governance protection. The main concerns are the 3/5 multisig without timelock on L2 deployments, the relatively modest bug bounty ($50K), the unclear ProxyAdmin upgrade path, and Vesper Finance concentration risk. With ~2 years in production and no direct exploits, the protocol falls into the low risk tier with standard monitoring recommended.

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (August 2026)
- **TVL-based**: Reassess if protocol TVL changes by more than 50%
- **Incident-based**: Reassess after any exploit, governance change, or collateral modification
- **Governance-based**: Reassess if ProxyAdmin ownership structure changes or if L2 multisig threshold changes
- **Dependency-based**: Reassess if Vesper Finance experiences any security incident or significant TVL decline
- **Audit-based**: Reassess when/if top-tier audit is completed or bug bounty is significantly increased
