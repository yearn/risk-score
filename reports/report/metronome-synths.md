# Protocol Risk Assessment: Metronome Synths (msUSD / msETH)

- **Assessment Date:** March 28, 2026
- **Token:** msUSD / msETH
- **Chain:** Ethereum, Base, Optimism
- **Token Address:** [`0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA`](https://etherscan.io/address/0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA) (msUSD) / [`0x64351fC9810aDAd17A690E4e1717Df5e7e085160`](https://etherscan.io/address/0x64351fC9810aDAd17A690E4e1717Df5e7e085160) (msETH)
- **Final Score: 2.6/5.0**

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
- [CoinGecko - msUSD](https://www.coingecko.com/en/coins/metronome-synth-usd)
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

Both ProxyAdmin contracts are owned by [`0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33`](https://etherscan.io/address/0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33) — a **3/5 Gnosis Safe** (verified on-chain 2026-03-28). This means contract upgrades on Ethereum **bypass the Governor/Timelock** and are controlled directly by the multisig. All 5 signers are identical to the L2 Safe signers (5/5 overlap, verified on-chain). All signers are anonymous EOAs.

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

Base and Optimism are governed by a **3/5 Gnosis Safe** ([`0xE01Df4ac1E1e57266900E62C37F12C986495A618`](https://basescan.org/address/0xE01Df4ac1E1e57266900E62C37F12C986495A618)) with the same 5 anonymous EOA signers on both chains. All 5 signers are identical to the Ethereum ProxyAdmin Safe (5/5 overlap, verified on-chain 2026-03-28).

**Token Supply (as of 2026-03-28):**

| Token | Chain | Supply |
|-------|-------|--------|
| msUSD | Ethereum | ~11,605,366 |
| msUSD | Base | ~5,460,850 |
| msUSD | Optimism | ~1,629,191 |
| msUSD | **Total** | **~18,695,407** |
| msETH | Ethereum | ~6,252 ETH |
| msETH | Base | ~10,554 ETH |
| msETH | Optimism | ~478 ETH |
| msETH | **Total** | **~17,284 ETH** |

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
| **Quantstamp** | Metronome Synth | 2022-2023 | [GitHub audits/](https://github.com/autonomoussoftware/metronome-synth-public/tree/main/audits) |

**Quantstamp Audit Findings**: 2 medium-risk, 3 low-risk, 11 informational issues. 9 resolved. Notable unresolved: **absence of fallback oracle** (Chainlink-only, no cross-check or fallback source — classified as medium risk). The team indicated a fallback would be added but it has not been implemented as of this assessment.

**Note**: A [LlamaRisk assessment](https://www.llamarisk.com/research/archive-llamarisk-risk-assessment-metronome) was also conducted (early-stage, when TVL was ~$2M and governance was a 2/4 multisig). Key concerns raised: Vesper dependency (>92% of collateral), collateral factors chosen without simulation testing, frontrunning risk on synthetic marketplace, and no insurance fund for bad debt. Governance has since improved (2/4→3/5 multisig, Governor+Timelock added on Ethereum), but several structural concerns remain.

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
- **Assets in Scope**: 92 assets across Ethereum, Optimism, and Base (including AMO, CrossChainDispatcher, deposit tokens, and the Metronome dApp)

The $50K max bounty is relatively modest compared to similarly-sized protocols.

The protocol is **not** listed in the [SEAL Safe Harbor](https://safeharbor.securityalliance.org/) registry.

## Historical Track Record

- **Production History**: Metronome 1.0 launched June 2018. Metronome 2.0 (MET token migration) launched August 2022. Metronome Synth launched early 2023. The protocol has been live in production for approximately **3+ years** (Synth product for ~3 years).
- **TVL** (DeFiLlama, as of 2026-03-28):
  - Ethereum: $15,210,657
  - Base: $3,771,743
  - Optimism: $2,061,621
  - **Total Protocol TVL: ~$21.04M** (down ~14% from $24.55M on 2026-03-20)
- **Market Data** (CoinGecko, as of 2026-03-28):
  - msUSD: $0.996, market cap $19.9M, 24h volume $7.1M
  - msETH: $2,009.97, market cap $34.7M, 24h volume $7.2M
- **Incidents**:
  - **Sonne Finance exploit (May 2024)**: Affected Metronome positions on Optimism. A Metronome Improvement Proposal (MIP) was submitted for remediation.
  - No direct smart contract exploits of Metronome Synth contracts found on rekt.news.
- **Peg Stability** (CoinGecko):
  - msUSD currently trading at $0.997 (slight discount to $1.00)
  - Historical ATL of $0.43 (Oct 2025) and ATH of $3.43 (Oct 2025) reflect past depeg events during early thin liquidity periods; current DEX depth significantly mitigates this risk
- **Concentration Risk**: With ~$21M protocol TVL spread across 3 chains, user base is moderately concentrated.

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

**Ethereum Treasury Collateral Balances (on-chain, 2026-03-28):**

Collateral is held in the Treasury contract ([`0x3691EF68Ba22a854c36bC92f6b5F30473eF5fb0A`](https://etherscan.io/address/0x3691EF68Ba22a854c36bC92f6b5F30473eF5fb0A)), not directly in the Pool.

| Asset | Balance | Type |
|-------|---------|------|
| USDC | 205,418 | Direct |
| WETH | 97.10 | Direct |
| WBTC | 17.15 | Direct |
| sfrxETH | 1,682.93 | Direct |
| FRAX | 101.46 | Direct |
| DAI | 152.42 | Direct |
| vaUSDC | ~1,445,020 tokens | Vesper yield-bearing |
| vaFRAX | ~1,141,290 tokens | Vesper yield-bearing |
| vaETH | ~1,839 tokens | Vesper yield-bearing |
| vaSTETH | ~873 tokens | Vesper yield-bearing |
| vaCBETH | ~24 tokens | Vesper yield-bearing |
| vaRETH | ~18 tokens | Vesper yield-bearing |

**Ethereum Debt Outstanding (on-chain, 2026-03-28):**

| Debt Token | Outstanding |
|-----------|-------------|
| msUSD-Debt | ~4,247,153 |
| msETH-Debt | ~2,570 ETH |
| msBTC-Debt | ~0.002 BTC |

### Provability

- **On-chain Verification**: Collateral balances are fully verifiable on-chain in Pool contracts on each chain.
- **Oracle-based Pricing**: Chainlink oracle feeds determine collateral values and health factors. Synth assets are hard-coded to their reference asset's oracle price internally (msUSD = $1, msETH = ETH price), preventing peg deviations from triggering liquidations.
- **No Exchange Rate**: Synthetics are not yield-bearing vault tokens — there is no PPS/exchange rate to verify. The system tracks debt positions, not share prices.
- **Productive Collateral Transparency**: Vesper Finance tokens (vaUSDC, vaETH, etc.) have their own on-chain exchange rates, which can be independently verified.

## Liquidity Risk

### On-Chain Liquidity Summary

**Total DEX Pool TVL: $93.41M** (DeFiLlama, as of 2026-03-28):

| DEX / Chain | TVL | Pools |
|---|---|---|
| Aerodrome Slipstream (Base) | $36.04M | 4 |
| Curve (Ethereum) | $35.84M | 7 |
| Aerodrome V1 (Base) | $12.43M | 2 |
| Velodrome (Optimism) | $4.10M | 4 |
| Balancer V3 (Ethereum) | $3.76M | 3 |
| Uniswap V3 (Ethereum) | $1.20M | 2 |
| SushiSwap V3 (Hemi) | $0.04M | 1 |

### Top DEX Pools by TVL

| Chain | DEX | Pool | TVL |
|---|---|---|---|
| Base | Aerodrome Slipstream | WETH-msETH | $18.06M |
| Base | Aerodrome Slipstream | msUSD-USDC | $16.74M |
| Ethereum | Curve | msETH-WETH | $16.07M |
| Ethereum | Curve | FRXUSD-msUSD | $10.10M |
| Ethereum | Curve | msUSD-FRAXBP | $7.49M |
| Base | Aerodrome V1 | WETH-msETH | $7.37M |
| Base | Aerodrome V1 | msUSD-USDC | $5.06M |

### DEX TVL by Chain

| Chain | DEX TVL |
|---|---|
| Base | $48.47M |
| Ethereum | $40.80M |
| Optimism | $4.10M |
| Hemi | $0.04M |

### Yield/Wrapper Ecosystem

An additional **$170M** is locked in yield aggregators and lending protocols built on top of the DEX pools, indicating strong and growing DeFi integration:

| Protocol | Notable Pools | TVL |
|---|---|---|
| Main Street | msUSD | $46.33M |
| Stake DAO | msETH-WETH, FRXUSD-msUSD | $40.40M |
| Morpho V1 | msUSD/USDC, msETH vaults | $26.24M |
| Convex | msETH-WETH, msUSD-FRAXBP, FRXUSD-msUSD | $23.44M |
| Vesper | msUSD, msETH | $15.95M |
| Beefy | Various | $8.68M |
| Pendle | msUSD | $2.64M |
| Extra Finance | Various | $1.92M |
| Yearn | msETH-WETH, msUSD vaults | $1.61M |

### Liquidity Assessment

- **Ethereum msUSD**: ~$40.8M Curve + Uniswap + Balancer liquidity. Sufficient for large exits.
- **Ethereum msETH**: ~$16M Curve liquidity. Good depth.
- **Base msUSD/msETH**: ~$48.5M Aerodrome liquidity. Deepest liquidity overall.
- **Exit Path**: No direct 1:1 redemption. Users must either repay debt + withdraw collateral, or sell on DEX. Market-based exit via DEX pools.
- **Historical Peg**: msUSD experienced price deviations in early days (ATL $0.43, ATH $3.43 in Oct 2025) when liquidity was thin. Current DEX depth substantially reduces peg stability risk. Currently trades at ~$0.996.
- **Yield Ecosystem Growth**: Total yield/wrapper TVL grew from ~$87M to ~$170M since last assessment, reflecting increased DeFi integration and trust from major protocols.

## Centralization & Control Risks

### Governance

**Ethereum:**
- **On-chain Governor**: Compound-style Governor at [`0xc8697de7c190244bfd63d276823aa20035cb5a12`](https://etherscan.io/address/0xc8697de7c190244bfd63d276823aa20035cb5a12)
  - Voting token: esMET (MET Escrow) at [`0xA28D70795a61Dc925D4c220762A4344803876bb8`](https://etherscan.io/address/0xA28D70795a61Dc925D4c220762A4344803876bb8)
  - esMET Total Supply: ~10,919,594 esMET
  - Proposal threshold: 25,000 MET
  - Quorum: 4% of esMET total supply (~375,000-575,000 esMET depending on current supply)
  - Voting delay: 5,760 blocks (~19.2 hours)
  - Voting period: 40,320 blocks (~134.4 hours / ~5.6 days)
- **Timelock**: [`0x4c510878B907d6DDf69E6057ad2f865f60fB7775`](https://etherscan.io/address/0x4c510878B907d6DDf69E6057ad2f865f60fB7775) — **48-hour delay**
- **ProxyAdmin Owner**: [`0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33`](https://etherscan.io/address/0xd1DE3F9CD4AE2F23DA941a67cA4C739f8dD9Af33) — controls upgrades for both ProxyAdmin contracts

**Base / Optimism:**
- **Governor**: 3/5 Gnosis Safe ([`0xE01Df4ac1E1e57266900E62C37F12C986495A618`](https://basescan.org/address/0xE01Df4ac1E1e57266900E62C37F12C986495A618))
- Same 5 anonymous EOA signers on both chains, all 5 identical to Ethereum ProxyAdmin Safe (5/5 overlap)
- No timelock on L2 deployments

**Governance Process (Progressive Decentralization):**

| Phase | Description |
|-------|-------------|
| Phase 1 (Launch) | Sentiment votes, 2-of-4 multisig implements outcomes |
| Phase 2 (~1 month) | Multisig expands to 3-of-5 with external signers |
| Phase 3 (~3 months) | Binding votes begin; multisig retains veto on safety |
| Phase 4 (~9 months) | More binding votes; multisig loses veto except on token supply |
| Phase 5 (~15 months) | Full decentralization, all decisions by community vote |

**Snapshot Governance**: ~30 MIPs on [Snapshot](https://snapshot.org/#/metronome.eth). Low voter participation (5-12 votes per proposal). Last proposal (MIP-30) was in February 2025 — over 1 year with no governance activity.

**Privileged Roles:**
- ProxyAdmin owner can upgrade all contracts on Ethereum
- 3/5 multisig controls all contracts on Base and Optimism (same 5 signers as Ethereum)
- Governor/Timelock system on Ethereum (48h delay)
- Pool governor can modify collateral factors, deposit caps, fee parameters

### Programmability

- **Core Operations**: Fully programmatic on-chain — deposits, minting, liquidations, and swaps are all automated via smart contracts.
- **Smart Farming**: Automated yield looping via SmartFarmingManager contract.
- **No PPS/Rate**: Synthetics are debt-position based, not share-price based. No admin-controlled exchange rate.
- **Oracle Dependency**: Chainlink price feeds are used for all collateral valuation and health factor calculations. No fallback oracle (medium-risk finding from Quantstamp audit, still unresolved).
- **Frontrunning Risk**: Synthetic marketplace executes swaps at oracle price with only a fee (0.45-0.55%) as protection. LlamaRisk identified this as exploitable when inter-oracle-update volatility exceeds the fee.
- **Fee Adjustments**: FeeProvider contract parameters can be changed by governance.

### External Dependencies

| Dependency | Criticality | Risk Level |
|------------|-------------|------------|
| **Chainlink** | Critical — sole oracle for all price feeds, no fallback | Medium. Well-established but single point of failure. Quantstamp flagged absence of fallback oracle as medium-risk finding (still unresolved) |
| **Vesper Finance** | High — productive collateral tokens (vaUSDC, vaETH, etc.) | Medium-High. Same parent company (Bloq). Vesper strategies introduce multi-layer protocol risk (Euler, Aave, Curve, Convex, Frax) beneath the va-tokens |
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

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      GOVERNANCE LAYER                               │
│                                                                     │
│  ┌──────────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Governor         │───▶│  Timelock     │    │  ProxyAdmin      │  │
│  │  (esMET voting)   │    │  (48h delay)  │    │  Owner (3/5 Safe)│  │
│  │  0xc869...        │    │  0x4c51...    │    │  0xd1DE...       │  │
│  └──────────────────┘    └──────┬───────┘    └────────┬─────────┘  │
│         Parameters only ────────┘   Upgrades ─────────┘             │
│                                                                     │
│  L2 (Base/Optimism): 3/5 Safe 0xE01D... (same 5 signers, no TL)   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                     VAULT / TOKEN LAYER                             │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │  msUSD      │  │  msETH      │  │  msBTC      │  Synthetic       │
│  │  0xab5e...  │  │  0x6435...  │  │  0x8b4F...  │  Tokens          │
│  └────────────┘  └────────────┘  └────────────┘                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │  msUSD-Debt │  │  msETH-Debt │  │  msBTC-Debt │  Debt Tokens     │
│  │  0x480e...  │  │  0xF43d...  │  │  0xB93f...  │                  │
│  └────────────┘  └────────────┘  └────────────┘                    │
│  ┌───────────────────────────────────┐                              │
│  │  Deposit Tokens (msd*)            │  Receipt tokens per          │
│  │  msdUSDC, msdWETH, msdvaETH...   │  collateral type             │
│  └───────────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                      PROTOCOL LAYER                                 │
│                                                                     │
│  ┌──────────────────┐    ┌────────────────────────┐                 │
│  │  Pool             │───▶│  Treasury               │  Holds all     │
│  │  0x3364...        │    │  0x3691...              │  collateral     │
│  └──────────────────┘    └────────────────────────┘                 │
│  ┌──────────────────┐    ┌────────────────────────┐                 │
│  │  SmartFarming     │    │  CrossChainDispatcher   │  LayerZero     │
│  │  Manager          │    │  0x8BD8...             │  OFT bridge     │
│  │  0xE0e7...        │    └────────────────────────┘                 │
│  └──────────────────┘    ┌────────────────────────┐                 │
│  ┌──────────────────┐    │  FeeProvider            │                 │
│  │  PoolRegistry     │    │  0x6b53...             │                 │
│  │  0x11eA...        │    └────────────────────────┘                 │
│  └──────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                     UNDERLYING LAYER                                │
│                                                                     │
│  Collateral Assets:                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ USDC      │ │ WETH      │ │ WBTC      │ │ sfrxETH   │ Direct    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ vaUSDC    │ │ vaETH     │ │ vaFRAX    │ │ vaSTETH   │ Vesper    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ (yield)      │
│         │            │            │            │                     │
│         ▼            ▼            ▼            ▼                     │
│  ┌─────────────────────────────────────────────┐                    │
│  │  Vesper Finance Strategies                   │  Multi-layer      │
│  │  (Euler, Aave, Curve, Convex, Frax)         │  protocol risk    │
│  └─────────────────────────────────────────────┘                    │
│                                                                     │
│  Oracle: Chainlink (sole oracle, no fallback)                       │
│  Bridge: LayerZero OFT (Ethereum ↔ Base, Optimism)                 │
└─────────────────────────────────────────────────────────────────────┘

Fund Flow: User → deposit collateral → Pool → Treasury (holds collateral)
           User → mint synth → Debt Token created → Synthetic Token minted
           Liquidator → repay debt → receives collateral + 10% bonus

Trust Boundaries:
  ⚠ ProxyAdmin Safe (3/5) can upgrade ALL contracts — bypasses Governor/Timelock
  ⚠ Same 5 anonymous signers control all chains (no independent signers)
  ⚠ No timelock on Base/Optimism contract upgrades
```

---

## Risk Summary

### Key Strengths

- **Deep and growing liquidity**: $93.4M DEX pool TVL across multiple chains (up from $75.9M), with ~$170M in yield aggregators (Main Street, Stake DAO, Morpho, Convex, Vesper, Beefy, Yearn, Pendle).
- **Multi-chain presence**: Deployed on Ethereum, Base, Optimism with significant liquidity on each.
- **Experienced team**: Bloq Inc. (Jeff Garzik, Matthew Roszak) with 8+ years in crypto infrastructure. Same team behind Vesper Finance.
- **Long production history**: Metronome 1.0 since 2018, Synth protocol since early 2023 (~3 years), with no direct smart contract exploits.
- **Comprehensive DeFi integration**: Integrated with Main Street, Stake DAO, Morpho, Convex, Vesper, Beefy, Yearn, Pendle — indicating broad trust from major DeFi protocols.

### Key Risks

- **Upgradeable contracts**: All contracts are upgradeable proxies. The ProxyAdmin owner on Ethereum is a **3/5 multisig** (not the Governor/Timelock), meaning contract upgrades bypass on-chain governance entirely.
- **Single multisig across all chains**: All 5 signers are identical on Ethereum, Base, and Optimism (5/5 overlap). Base and Optimism have no timelock. All signers are anonymous EOAs.
- **Governance completely inactive**: No Snapshot proposals since MIP-30 (February 2025) — over 1 year of zero governance activity. Only 5-12 votes per proposal when active.
- **Vesper Finance dependency**: Productive collateral tokens (vaUSDC, vaETH) introduce multi-layer smart contract risk — Vesper strategies route through Euler, Aave, Curve, Convex, and Frax beneath the va-tokens. Same parent company (Bloq) creates concentration risk. [LlamaRisk](https://www.llamarisk.com/research/archive-llamarisk-risk-assessment-metronome) noted >92% of collateral consists of Vesper tokens.
- **No fallback oracle**: Chainlink is the sole oracle with no cross-check or fallback source. Quantstamp flagged this as medium-risk; still unresolved.
- **Collateral factors untested**: LlamaRisk noted collateral factors were "chosen without testing whether they are optimal" — and they have since been increased (from 60-75% to 67-85%) without public simulation results.
- **No insurance fund**: Protocol lacks an insurance fund to cover potential bad debt from suboptimal liquidation parameters.
- **Modest bug bounty**: $50K max payout is low relative to protocol TVL ($21M).
- **No new audits**: Most recent audit is from February 2023 — over 3 years without a new security review despite ongoing code changes.
- **Frontrunning risk**: Synthetic marketplace swaps execute at oracle price with only 0.45-0.55% fee protection, exploitable when inter-update volatility exceeds the fee.

### Critical Risks

- **Single-entity rug risk**: [LlamaRisk assessed](https://www.llamarisk.com/research/archive-llamarisk-risk-assessment-metronome) that Bloq can effectively rug users. The ProxyAdmin owner (3/5 multisig) can upgrade any contract on Ethereum without governance approval or timelock — meaning it can mint arbitrary tokens, drain collateral, or brick the protocol. All 5 signers are anonymous EOAs; there is no on-chain evidence that "external signers" (promised in Phase 2 of decentralization) were actually added. All 5 signers are identical across Ethereum, Base, and Optimism Safes (5/5 overlap, verified on-chain 2026-03-28), and the L2 deployments have no timelock at all. At the time of LlamaRisk's review (2/4 multisig), they concluded: *"the entire protocol can essentially be shut down at any moment by two people who work for the same private U.S. company (Bloq)."* The threshold increased to 3/5, but if all signers remain Bloq-affiliated, the structural risk is unchanged.
- **Governance abandoned**: No Snapshot proposals since February 2025 (over 1 year). Only 5-12 votes per proposal when active. On-chain Governor on Ethereum appears unused. This suggests governance is effectively dead and the protocol is operated unilaterally by the multisig.

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

- **Audits**: 2 Halborn audits + 1 Quantstamp audit (external) + multiple internal (Vesper/Bloq) audits. No audits from top-tier firms (Trail of Bits, OpenZeppelin, Spearbit). ~12 total audit reports in repository. Quantstamp found 2 medium-risk issues including absence of fallback oracle (still unresolved).
- **Bug Bounty**: Immunefi program since Feb 2023, but max $50K payout is modest.
- **Time in Production**: Synth protocol live since early 2023 (~3 years). Metronome 1.0 since 2018.
- **TVL**: ~$21M protocol TVL (down ~14% from $24.5M in prior assessment).
- **Incidents**: Indirectly affected by Sonne Finance exploit (May 2024). No direct exploits.
- **Third-party assessment**: [LlamaRisk](https://www.llamarisk.com/research/archive-llamarisk-risk-assessment-metronome) flagged considerable centralization risk, untested collateral parameters, and deep Vesper dependency.

**Score: 2.5/5** - Multiple audits (Halborn, Quantstamp, + internal) and 3+ years production with no direct exploits. Bug bounty present but modest ($50K max). No top-tier auditors. Unresolved medium-risk audit finding (no fallback oracle). Most recent audit is from February 2023 (over 3 years old). LlamaRisk assessment adds third-party validation of concerns. Strong long-term track record from Metronome 1.0.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- Ethereum: Compound Governor with esMET voting token + 48-hour Timelock for parameter changes. However, **contract upgrades are controlled by a 3/5 multisig that bypasses the Governor/Timelock**.
- Base/Optimism: 3/5 multisig with no timelock and anonymous signers.
- All chains governed by the exact same set of 5 multisig signers (5/5 overlap, verified on-chain).
- Low governance participation (5-12 voters). No new Snapshot proposals since MIP-30 in February 2025 (over 1 year of inactivity).

**Governance Score: 4.5/5** - The on-chain Governor with 48h timelock on Ethereum is effectively cosmetic — contract upgrades bypass it entirely via a 3/5 multisig with anonymous signers and no timelock. All chains are controlled by the exact same 5 signers (5/5 overlap, verified on-chain). LlamaRisk concluded Bloq can unilaterally rug users. No on-chain evidence that independent external signers were added as promised. Multisig can upgrade contracts to mint tokens, drain collateral, or brick the protocol. Governance has been completely inactive for over 1 year (last Snapshot proposal: February 2025), suggesting the protocol is operated unilaterally by the multisig with no community oversight.

**Subcategory B: Programmability**

- Core operations (deposits, minting, liquidations, swaps) are fully programmatic.
- No admin-controlled exchange rate (debt-position based, not vault-share based).
- Oracle prices from Chainlink (external but reliable).
- Fee parameters adjustable by governance.
- Smart Farming is automated via smart contract.

**Programmability Score: 2/5** - Highly programmatic system with on-chain automation. Minor admin input for fee parameters.

**Subcategory C: External Dependencies**

- Chainlink (critical — sole oracle, no fallback — medium-risk audit finding unresolved)
- Vesper Finance (high — productive collateral with multi-layer strategy risk: Euler, Aave, Curve, Convex, Frax beneath va-tokens)
- LayerZero (high — cross-chain synthetic transfers)
- Curve (medium — Smart Farming swaps)

**Dependencies Score: 3.5/5** - Chainlink as sole oracle without fallback is a single point of failure (flagged by Quantstamp). Vesper tokens introduce multi-layer protocol dependency. LayerZero adds cross-chain risk.

**Centralization Score = (4.5 + 2 + 3.5) / 3 = 3.33**

**Score: 3.3/5** - Governor + Timelock on Ethereum is cosmetic for upgrades — 3/5 multisig with anonymous, likely Bloq-affiliated signers controls all contract upgrades across all chains with no timelock. All 5 signers are identical on every chain, confirming single-entity control. LlamaRisk concluded single-entity rug risk exists. Governance has been inactive for 1+ year. Chainlink sole oracle without fallback and deep Vesper multi-layer dependency compound the centralization concern.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Over-collateralized CDP model with varying collateral factors (67%-85%).
- Mix of blue-chip (USDC, ETH, WBTC) and DeFi-native (Vesper va-tokens) collateral.
- On-chain liquidation mechanism with 18% penalty (incentivized).
- Deposit caps limit exposure per asset.
- Risk scoring framework for collateral factor determination.
- Ethereum Treasury collateral is predominantly Vesper yield-bearing tokens (vaUSDC, vaFRAX, vaETH, vaSTETH), with direct USDC at only ~$205K (decreased from $364K). This increases smart contract dependency on Vesper Finance (same parent company — Bloq).
- Collateral factors were increased from 60-75% (at LlamaRisk assessment) to 67-85% without published simulation results. LlamaRisk flagged these as "chosen without testing whether they are optimal."
- No insurance fund exists to cover potential bad debt from suboptimal liquidation parameters.

**Collateralization Score: 3/5** - Over-collateralized with on-chain liquidations, but: (1) Ethereum collateral is predominantly Vesper yield-bearing tokens with multi-layer strategy risk, (2) collateral factors raised aggressively without published simulation testing, (3) no insurance fund for bad debt. Same-company concentration risk (Vesper/Bloq).

**Subcategory B: Provability**

- Collateral fully on-chain in Treasury contracts — anyone can verify balances.
- Chainlink oracle feeds are transparent.
- No complex off-chain accounting or opaque exchange rates.
- Vesper token exchange rates verifiable on-chain.
- Multi-chain deployment adds complexity but all data is on-chain.

**Provability Score: 1.5/5** - Fully on-chain, programmatic collateral tracking. No off-chain components for reserve verification.

**Funds Management Score = (3 + 1.5) / 2 = 2.25**

**Score: 2.25/5** - Over-collateralized with full on-chain provability. However, Vesper token concentration, aggressively raised collateral factors without simulation testing, and absence of insurance fund add meaningful risk.

#### Category 4: Liquidity Risk (Weight: 15%)

- **DEX Liquidity**: $93.4M total across 4 chains (up from $75.9M). $40.8M on Ethereum, $48.5M on Base.
- **Top Pools**: WETH-msETH Aerodrome ($18.06M), msUSD-USDC Aerodrome ($16.74M), msETH-WETH Curve ($16.07M).
- **Exit Mechanism**: Market-based (DEX swap). No direct 1:1 redemption — users must repay debt or swap on DEX.
- **Volume**: ~$14.3M combined 24h volume (msUSD: $7.1M, msETH: $7.2M via CoinGecko).
- **Yield Ecosystem**: ~$170M in yield aggregators (Main Street, Stake DAO, Morpho, Convex, Vesper, Beefy, Yearn, Pendle) — nearly doubled since prior assessment.
- **Historical Peg**: Early depeg events (ATL $0.43 in Oct 2025) occurred during thin liquidity; current deep DEX liquidity and stable peg at ~$0.996 indicate low ongoing risk.

**Score: 2/5** - Strong and growing DEX liquidity across multiple chains ($93.4M, up 23%). Market-based exit only (no 1:1 redemption), but pool depth allows large exits with manageable slippage. Yield ecosystem nearly doubled to $170M, indicating broad DeFi trust.

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
| Centralization & Control | 3.3 | 30% | 0.99 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.565/5.0** |

**Optional Modifiers:**
- Protocol live >2 years with no direct incidents: **-0.0** (Sonne Finance exploit in May 2024 indirectly affected Metronome users on Optimism)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk (2.6/5.0)**

Metronome Synth benefits from deep DEX liquidity ($93.4M, up from $75.9M), strong and growing DeFi integration ($170M in yield wrappers), an experienced and public team (Bloq/Garzik), and a fully on-chain over-collateralized model with transparent reserves. However, critical centralization concerns have worsened: all contract upgrades across all chains are controlled by a single 3/5 multisig with 5 identical anonymous signers across Ethereum, Base, and Optimism — with no timelock on L2s and bypassing the Governor on Ethereum. LlamaRisk concluded that Bloq can unilaterally rug users, and there is no on-chain evidence this has been mitigated. Governance has been completely inactive for over 1 year (last Snapshot proposal: February 2025). Additional concerns include: Chainlink as sole oracle with no fallback; Ethereum collateral predominantly in Vesper yield-bearing tokens with multi-layer strategy risk; collateral factors raised without simulation testing; no insurance fund for bad debt; and no new audits since February 2023. Protocol TVL decreased ~14% to ~$21M. With ~3 years in production and no direct exploits, the protocol falls into the medium risk tier with enhanced monitoring recommended.

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (September 2026) or sooner if governance resumes activity
- **TVL-based**: Reassess if protocol TVL changes by more than 50%
- **Incident-based**: Reassess after any exploit, governance change, or collateral modification
- **Governance-based**: Reassess if ProxyAdmin ownership is transferred to the Timelock, if multisig threshold/signers change, or if upgrade timelock is added
- **Dependency-based**: Reassess if Vesper Finance experiences any security incident or significant TVL decline
- **Audit-based**: Reassess when/if top-tier audit is completed or bug bounty is significantly increased

---

*Last verified: March 28, 2026*
