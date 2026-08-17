# Protocol Risk Assessment: f(x) Protocol — fxUSD

- **Assessment Date:** May 13, 2026 (Updated: August 15, 2026)
- **Token:** fxUSD (f(x) USD)
- **Chain:** Ethereum
- **Token Address:** [`0x085780639CC2cACd35E474e71f4d000e2405d8f6`](https://etherscan.io/address/0x085780639CC2cACd35E474e71f4d000e2405d8f6)
- **Final Score: 2.2/5.0**

## Overview + Links

fxUSD is a **decentralized stablecoin** issued by the f(x) Protocol (built by AladdinDAO) that maintains its USD peg through a dual-token system splitting yield-bearing collateral into a stable component (fxUSD) and leveraged components (xPOSITION/sPOSITION). The active V2 system accepts **wstETH and WBTC** as collateral, enabling users to mint fxUSD at 0% ongoing interest through the fxMINT product, or to take leveraged long/short positions. Older sfrxETH and other ETH-LST contracts belong to legacy V1 or separate f(x) markets and are not current V2 fxUSD mint collateral.

**Key mechanism — the f(x) Invariant:**
The current V2 invariant balances all position types: `Collateral - Borrowed Collateral = fxUSD (Long) + fxUSD (Short) + xPOSITION + sPOSITION`. Collateral (wstETH and WBTC) is split into a stable component (fxUSD) and leveraged components — xPOSITIONs (leveraged longs) absorb upward volatility while sPOSITIONs (leveraged shorts) borrow collateral against fxUSD. When prices fluctuate, the leveraged positions absorb volatility, keeping fxUSD stable. The system supports up to ~7x leverage on ETH/BTC.

**Yearn use cases (from issue #116):**
1. **yvBTC vault strategies** — deposit BTC collateral and borrow fxUSD via fxMINT at 0% annual interest (one-time ~0.5% fee)
2. **fxUSD vault** — similar to existing crvUSD and BOLD vaults, enabling treasury diversification into DeFi-native stablecoins

**Key metrics (August 15, 2026, Ethereum block 25,759,914):**

- **fxUSD Total Supply:** ~64,309,766 fxUSD
- **fxUSD NAV:** ~$0.9980 (Curve EMA ~$1.00034)
- **Protocol TVL (DeFi Llama):** ~$96.8M (last-90-day peak: $96.9M on July 22, 2026; all-time peak $271M on August 24, 2025)
- **System collateralization:** ~135.6% (~$87.04M V2 collateral vs ~64.31M fxUSD pool debt, worth ~$64.18M at NAV)
- **fxUSD DEX Liquidity:** ~$7.52M in the primary Curve USDC/fxUSD pool (~$1.94M across six secondary Curve pools)
- **fxSAVE Total Assets:** ~61.67M fxSP (~$62.3M), 96.9% of the Stability Pool
- **fxMINT Opening Fee:** 0.5% (ETH/BTC) | Closing Fee: 0.2%
- **Launch Date:** February 23, 2024 (~2.5 years in production)

**Links:**

- [f(x) Protocol Documentation](https://fxprotocol.gitbook.io/fx-docs)
- [f(x) Protocol App](https://fx.aladdin.club)
- [f(x) Protocol Live Statistics](https://fx.aladdin.club/v2/statistics)
- [GitHub — fx-protocol-contracts](https://github.com/AladdinDAO/fx-protocol-contracts)
- [GitHub — aladdin-v3-contracts](https://github.com/AladdinDAO/aladdin-v3-contracts)
- [Audit Reports](https://fxprotocol.gitbook.io/fx-docs/risk-management/audit-reports)
- [Risk Framework](https://fxprotocol.gitbook.io/fx-docs/risk-management/risk-framework)
- [DeFi Llama: fx Protocol](https://defillama.com/protocol/fx-protocol)
- [LlamaRisk — xETH/fETH Assessment](https://www.llamarisk.com/research/archive-llamarisk-asset-risk-assessment-xeth-feth)
- [ChainSecurity — Flash Loan Vulnerability Disclosure](https://www.chainsecurity.com/blog/f-x-protocol-circumventing-access-control-with-a-double-flash-loan-attack)

## Contract Addresses

### Core Token Contracts

| Contract | Address | Type |
|----------|---------|------|
| fxUSD | [`0x085780639CC2cACd35E474e71f4d000e2405d8f6`](https://etherscan.io/address/0x085780639CC2cACd35E474e71f4d000e2405d8f6) | TransparentUpgradeableProxy (impl: FxUSDRegeneracy [`0xf729422d68c2cf00574fb5712972454cf402a9b1`](https://etherscan.io/address/0xf729422d68c2cf00574fb5712972454cf402a9b1)) |
| FXN (governance token) | [`0x365AccFCa291e7D3914637ABf1F7635dB165Bb09`](https://etherscan.io/address/0x365AccFCa291e7D3914637ABf1F7635dB165Bb09) | ERC-20 |
| veFXN | [`0xEC6B8A3F3605B083F7044C0F31f2cac0caf1d469`](https://etherscan.io/address/0xEC6B8A3F3605B083F7044C0F31f2cac0caf1d469) | Vote-escrowed FXN |

### V2 Collateral (PoolManager — Primary Custodian)

In V2, **all position collateral is accounted for by the PoolManager contract** — individual pool contracts (xstETH, xWBTC) are accounting/NFT contracts only and hold zero tokens. The manager normally custodies the tokens directly, except collateral borrowed by registered sPOSITION pools or deliberately deployed through a configured strategy.

| Contract | Address | Role |
|----------|---------|------|
| PoolManager (Long) | [`0x250893CA4Ba5d05626C785e8da758026928FCD24`](https://etherscan.io/address/0x250893CA4Ba5d05626C785e8da758026928FCD24) | Custodies all V2 collateral, manages xPOSITION/fxMINT |
| ShortPoolManager | [`0xaCDc0AB51178d0Ae8F70c1EAd7d3cF5421FDd66D`](https://etherscan.io/address/0xaCDc0AB51178d0Ae8F70c1EAd7d3cF5421FDd66D) | Manages sPOSITION positions (borrows collateral from PoolManager) |

**Collateral held in PoolManager (August 15, 2026):**

| Asset | Amount | USD Value | Pool debt | Pool CR |
|-------|--------|-----------|-----------|---------|
| wstETH (xstETH pool [`0x6ecfa38fee8a5277b91efda204c235814f0122e8`](https://etherscan.io/address/0x6ecfa38fee8a5277b91efda204c235814f0122e8)) | ~4,635.20 wstETH | ~$8.71M | ~6,383,507 fxUSD | ~136.7% |
| WBTC (xWBTC pool [`0xab709e26fa6b0a30c119d8c55b887ded24952473`](https://etherscan.io/address/0xab709e26fa6b0a30c119d8c55b887ded24952473)) | ~1,243.47 WBTC | ~$78.33M | ~57,925,995 fxUSD | ~135.5% |
| **Total** | | **~$87.04M** | **~64,309,502 fxUSD** | |

**Overall V2 collateralization ratio: ~135.6%** (~$87.04M collateral / ~$64.18M debt at NAV $0.9980). The live pool-oracle anchor prices were $1,878.45 per wstETH and $62,992.68 per WBTC at the snapshot block. The WBTC pool carries ~90% of system debt and ~90% of collateral value; both active pools are only about 4–5% of collateral-price downside from the 130% Stability Mode trigger if positions do not deleverage.

**Supply reconciliation:** total supply 64,309,766.03 fxUSD less V2 pool debt 64,309,501.97 leaves 264.06 fxUSD of legacy V1 issuance — the two figures reconcile exactly, confirming that issuance is accounted for by the V2 pools and residual V1 markets.

**Short leg:** sPOSITIONs post fxUSD as collateral in the ShortPoolManager and borrow collateral out of the PoolManager. Two short pools are registered — f(x) stETH Short [`0x25707b9e6690b52c60ae6744d711cf9c1dfc1876`](https://etherscan.io/address/0x25707b9e6690b52c60ae6744d711cf9c1dfc1876) (56,885 fxUSD collateral, 14.72 wstETH borrowed) and f(x) WBTC Short [`0xa0cc8162c523998856d59065faa254f87d20a5b0`](https://etherscan.io/address/0xa0cc8162c523998856d59065faa254f87d20a5b0) (215,796 fxUSD collateral, 1.91 WBTC borrowed). Borrowed collateral is capped at 50% of each long pool's balance (`shortBorrowCapacityRatio` = 5e17) and accounts for most of the gap between the PoolManager's token balance and its internal `collateralBalance`.

**Note:** `fxUSD.isUnderCollateral()` returns `true` — this flag reflects legacy V1 market status (wstETH treasury at 79.3% CR with only ~$8.1K remaining). The active V2 system via PoolManager maintains ~135.6% collateralization.

### Legacy V1 Treasury Contracts (Minimal Remaining Value)

| Treasury | Address | Base Token | Remaining Value |
|----------|---------|------------|----------------|
| stETH Treasury | [`0xED803540037B0ae069c93420F89Cd653B6e3Df1f`](https://etherscan.io/address/0xED803540037B0ae069c93420F89Cd653B6e3Df1f) | wstETH | ~$8.1K (4.30 wstETH, 79.3% CR, ~264 legacy fxUSD) |
| sfrxETH Treasury | [`0xcfEEfF214b256063110d3236ea12Db49d2dF2359`](https://etherscan.io/address/0xcfEEfF214b256063110d3236ea12Db49d2dF2359) | sfrxETH | ~$129K (69.02 sfrxETH, ~10,829% CR) |

### Reserve Pool

| Contract | Address | Holdings |
|----------|---------|----------|
| Reserve Pool | [`0xE93F5DD55eC9bdAbbba5eA88E4b4f3C253ee45Ed`](https://etherscan.io/address/0xE93F5DD55eC9bdAbbba5eA88E4b4f3C253ee45Ed) | 17.78 wstETH + 0.43 WBTC + 1,302 fxUSD — ~$61K total, ~0.1% of debt |

### Market & Infrastructure Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| PegKeeper | [`0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70`](https://etherscan.io/address/0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70) | Maintains fxUSD peg via Stability Pool |
| Configuration | [`0x16b334f2644cc00b85DB1A1efF0C2C395e00C28d`](https://etherscan.io/address/0x16b334f2644cc00b85DB1A1efF0C2C395e00C28d) | Protocol parameter configuration |
| ProxyAdmin | [`0x9b54b7703551d9d0ced177a78367560a8b2edda4`](https://etherscan.io/address/0x9b54b7703551d9d0ced177a78367560a8b2edda4) | Controls all proxy upgrades; owned by TimelockController (since April 20, 2026) |
| TimelockController | [`0x68863fb8855b04509a835082478D6E3D0bE4E61a`](https://etherscan.io/address/0x68863fb8855b04509a835082478D6E3D0bE4E61a) | 3-day (259,200s) minimum delay on ProxyAdmin actions; PROPOSER/EXECUTOR/CANCELLER = 6/9 multisig |
| GatewayRouter | [`0xA5e2Ec4682a32605b9098Ddd7204fe84Ab932fE4`](https://etherscan.io/address/0xA5e2Ec4682a32605b9098Ddd7204fe84Ab932fE4) | User-facing router |
| GaugeController | [`0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37`](https://etherscan.io/address/0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37) | FXN emissions gauge voting |
| StETHPriceOracle | [`0x0C5C61025f047cB7e3e85852dC8eAFd7b9a4Abfb`](https://etherscan.io/address/0x0C5C61025f047cB7e3e85852dC8eAFd7b9a4Abfb) | Live oracle for the xstETH pool; 1% max price deviation. **`owner()` = 6/9 multisig (not the timelock)** |
| WBTCPriceOracle | [`0xb3c90e64EB6f456A5F5C17Aa99b6aecA6f4a6390`](https://etherscan.io/address/0xb3c90e64EB6f456A5F5C17Aa99b6aecA6f4a6390) | Live oracle for the xWBTC pool; 2% max price and WBTC/BTC deviation. **`owner()` = 6/9 multisig (not the timelock)** |
| AaveV3Strategy (wstETH) | [`0xFd3A6540e21D0E285f88FBFd904883B23e08F5C8`](https://etherscan.io/address/0xFd3A6540e21D0E285f88FBFd904883B23e08F5C8) | Configured PoolManager wstETH strategy, 100,000 wstETH capacity; currently holds 0 |
| AaveV3CompoundStrategy (USDC) | [`0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f`](https://etherscan.io/address/0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f) | Configured Stability Pool USDC strategy, 100M USDC capacity; currently holds ~19 USDC |

### Stability Pool & fxSAVE

| Contract | Address | Purpose |
|----------|---------|---------|
| fxSP (Stability Pool) | [`0x65C9A641afCEB9C0E6034e558A319488FA0FA3be`](https://etherscan.io/address/0x65C9A641afCEB9C0E6034e558A319488FA0FA3be) | Holds fxUSD + USDC for peg maintenance; 57,460,692 fxUSD + 6,836,417 USDC (~$64.2M) |
| fxSAVE | [`0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39`](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) | Auto-compounding fxSP vault; 61.67M fxSP (~$62.3M), 96.9% of fxSP |

### Ethereum ↔ Base Bridge

fxUSD uses the standard LayerZero V2 **lock-and-mint representation** model documented in the [official SDK](https://github.com/AladdinDAO/fx-sdk/blob/main/README.md#bridge-base---ethereum) and [route configuration](https://github.com/AladdinDAO/fx-sdk/blob/main/src/configs/layerzero.ts). Canonical Ethereum fxUSD is locked in the adapter; the Base OFT burns and mints only the remote representation. The adapter has no authority to mint canonical Ethereum fxUSD.

| Contract | Chain | Address | Role |
|----------|-------|---------|------|
| FxUSDOFTAdaptor | Ethereum | [`0xA07d8cc424421cC2bce0544a65481376f010A438`](https://etherscan.io/address/0xA07d8cc424421cC2bce0544a65481376f010A438) | Escrows canonical fxUSD; held 308,980.654349 fxUSD (0.48% of supply) at the snapshot block |
| fxUSD OFT | Base | [`0x55380fe7A1910dFf29A47B622057ab4139DA42C5`](https://basescan.org/address/0x55380fe7A1910dFf29A47B622057ab4139DA42C5) | Bridged Base representation; total supply exactly matched Ethereum escrow |
| LayerZero EndpointV2 | Ethereum / Base | [`0x1a44076050125825900e736c501f859c50fE728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c) | Authenticates and delivers OFT messages |
| Base bridge-owner Safe | Base | [`0x44E4158d93ACCf19F7B97a28B88A26DfF3c3D6d2`](https://basescan.org/address/0x44E4158d93ACCf19F7B97a28B88A26DfF3c3D6d2) | 3-of-4 Safe owning the Base OFT; Ethereum adapter is owned by the operational 6-of-9 Safe |

### Governance

| Contract | Address | Configuration |
|----------|---------|---------------|
| Operational Multisig | [`0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`](https://etherscan.io/address/0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF) | 6-of-9 Gnosis Safe (v1.3.0), 678 nonce |
| Emergency Multisig | [`0x28c921adAC4c1072658eB01a28DA06b5F651eF62`](https://etherscan.io/address/0x28c921adAC4c1072658eB01a28DA06b5F651eF62) | 3-of-4 Gnosis Safe (emergency pause), 427 nonce |

### DEX Liquidity Pools

| Pool | Address | Composition |
|------|---------|-------------|
| Curve USDC/fxUSD | [`0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) | ~$7.52M (4.47M USDC + 3.05M fxUSD, 59.4/40.6) — also the EMA source that gates minting and redemption |
| Curve msUSD/fxUSD | [`0x138Bb0f3208bd729a561F3786DDb97BBc69e6628`](https://etherscan.io/address/0x138Bb0f3208bd729a561F3786DDb97BBc69e6628) | ~$0.59M; msUSD was priced near $0.70 by the Curve API at the snapshot |
| Curve reUSD/fxUSD | [`0xb0ef04ACE97d350E24Efa5139d2590D26a61A8Dc`](https://etherscan.io/address/0xb0ef04ACE97d350E24Efa5139d2590D26a61A8Dc) | ~$0.55M |
| Curve USDnr/fxUSD | [`0x3204d754a3003cEc155e2D8F44b3b48eD60b7Cc6`](https://etherscan.io/address/0x3204d754a3003cEc155e2D8F44b3b48eD60b7Cc6) | ~$0.44M |
| Curve fxUSD/frxUSD | [`0x851907CAC684797eee43669798D78004e269Cb5E`](https://etherscan.io/address/0x851907CAC684797eee43669798D78004e269Cb5E) | ~$0.15M |
| Curve alUSD/fxUSD | [`0x27cB9629aE3Ee05cb266B99cA4124EC999303c9D`](https://etherscan.io/address/0x27cB9629aE3Ee05cb266B99cA4124EC999303c9D) | ~$0.14M |
| Curve GHO/fxUSD | [`0x74345504Eaea3D9408fC69Ae7EB2d14095643c5b`](https://etherscan.io/address/0x74345504Eaea3D9408fC69Ae7EB2d14095643c5b) | ~$0.06M |
| Curve DeFi Stable Avengers | [`0x8B878AFE454e31CF0A79c6D7cf2f077DD286C12f`](https://etherscan.io/address/0x8B878AFE454e31CF0A79c6D7cf2f077DD286C12f) | ~$0.03M total across fxUSD, USDC, USDaf and BOLD |

## Audits and Due Diligence Disclosures

f(x) Protocol has an extensive audit history with **21 audit reports** from **3 reputable security firms**:

| Audit Scope | Date | Auditor | Link |
|---|---|---|---|
| f(x) Protocol V1 | June 14, 2023 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_Protocol_Report_v1.0_20230614.pdf) |
| Stability Pool | July 25, 2023 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_Protocol_RebalancePool_Report_v1.2_20230725.pdf) |
| f(x) Protocol V1 Update | September 17, 2023 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_Protocol_Update_Report_v1.1_20230917.pdf) |
| V1 Gauge Mechanism | November 29, 2023 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_Protocol_New_Features_Report_v1.1_20231129.pdf) |
| Stability Pool Boost | December 13, 2023 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_Rebalance_Pool_Boost_Report_v1.0_20231213.pdf) |
| veFXN Boost Delegation | January 18, 2024 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_Shareable_RebalancePool_Report_20240118.pdf) |
| V1 fxUSD | February 23, 2024 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_FxUSD_Report_v1.0_20240223.pdf) |
| f(x) Protocol Overall | April 16, 2024 | Trail of Bits | [Report](https://github.com/trailofbits/publications/blob/master/reviews/2024-03-aladdinfxprotocol-securityreview.pdf) |
| btcUSD | April 19, 2024 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/fx_btcUSD_Report_v1.0_2024_04_19.pdf) |
| New Oracle Design | May 14, 2024 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_New_Oracle_Report_v1.0_20240514.pdf) |
| arUSD | June 18, 2024 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_Concentrator_arUSD_Report_v1.0_20240618.pdf) |
| New Oracle Design | July 10, 2024 | Trail of Bits | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/TrailofBits_fx_oracle_202406.pdf) |
| aFXN | July 26, 2024 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_Concentrator_aFXN_Report_v1.0_20240726.pdf) |
| f(x) Protocol V2 | January 1, 2025 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_V2_Report_v1.2_20250101.pdf) |
| V2 WBTC Oracle & Batch Ops | March 17, 2025 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_Update_Batch_Rebalance_WBTC_Oracle_Report_v1.0_20250317.pdf) |
| fxSAVE | March 17, 2025 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_fxSAVE_And_StabilityPoolUSDCStrategy_Report_v1.1_20250317.pdf) |
| V2.1 (sPOSITIONs) | July 22, 2025 | Secbit | [Report](https://github.com/AladdinDAO/audit-reports/blob/main/SECBIT_f(x)_V2.1_Report_v1.0_20250722.pdf) |
| f(x) Protocol V2.0 | August 4, 2025 | OpenZeppelin | [Report](https://blog.openzeppelin.com/fx-v2-audit) |
| Limit Orders & fxMINT | October 30, 2025 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_LimitOrder_fxMint_Report_v1.0_2025_10_30.pdf) |
| Omnichain fxUSD (EIP-3009) | January 26, 2026 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_FxUSD_Base_EIP3009_Report_2026_01_26.pdf) |
| f(x) 2.0 for Katana Chain | March 9, 2026 | Secbit | [Report](https://github.com/AladdinDAO/aladdin-v3-contracts/blob/main/audit-reports/SECBIT_f(x)_2.0_Katana_Report_v1.1_2026_03_09.pdf) |

The protocol has a complex smart contract architecture spanning multiple treasuries, markets, position managers, stability pools, oracle systems, and governance contracts. All core contracts are upgradeable proxies controlled by the ProxyAdmin. Every version of the protocol in production has been audited, with continuous audit coverage from Secbit since V1.

### Bug Bounty

AladdinDAO operates a self-hosted [security bounty program](https://docs.aladdin.club/security-bounty) covering all contracts in its f(x) repositories, with a maximum **$500,000** payout for critical vulnerabilities. It is not an Immunefi-managed program and disclosures are submitted directly to the team. The payout exceeds the framework's $200K score-2 threshold but remains below the >$1M score-1 threshold.

**Notable vulnerability:** In April 2025, [ChainSecurity responsibly disclosed](https://www.chainsecurity.com/blog/f-x-protocol-circumventing-access-control-with-a-double-flash-loan-attack) a double flash loan vulnerability that could have resulted in >$2M in losses. The f(x) team promptly fixed it by removing the Balancer V2 flash loan integration. ChainSecurity describes this as internal research followed by responsible disclosure; no evidence was found that it was submitted through or paid by the bounty program.

## Historical Track Record

- **In production since:** February 23, 2024 (~30 months as of August 2026)
- **Current TVL:** ~$96.8M ([DeFi Llama](https://defillama.com/protocol/fx-protocol)); ~$87.04M active V2 collateral backing ~64.31M fxUSD pool debt in PoolManager
- **TVL history:** Spent 182 days above $100M between May–November 2025; all-time peak $271M on August 24, 2025. Over the last 90 days TVL ranged from $71.6M on July 1, 2026 to $96.9M on July 22, 2026, and stood at $96.8M on August 15.
- **fxUSD supply:** ~64.31M, up from ~18.1M in March 2026 — the growth has come almost entirely from the WBTC leg, which now carries ~90% of system debt
- **Peg stability:** fxUSD has generally maintained its peg. CoinGecko publishes a $0.9531 ATL for December 5, 2024, but this could not be corroborated: [DeFiLlama's daily series](https://coins.llama.fi/chart/ethereum:0x085780639CC2cACd35E474e71f4d000e2405d8f6?start=1731628800&span=47&period=1d&searchWidth=6h) records $0.99768 that day and the [checked crvUSD/fxUSD Curve pool's recorded swaps](https://prices.curve.finance/v1/trades/ethereum/0x8fFC7b89412eFD0D17EDEa2018F6634eA4C2FCb2?main_token=0x085780639CC2cACd35E474e71f4d000e2405d8f6&reference_token=0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E&page=23&per_page=100) were approximately $0.9948–$0.9970. The unverified aggregator ATL is not treated as an onchain depeg or stress event. Current NAV is ~$0.9980 and Curve EMA ~$1.00034.
- **Security incidents:** One responsibly disclosed vulnerability (ChainSecurity, April 2025) — no exploits or fund losses
- **Governance events:** ProxyAdmin ownership moved to a 3-day TimelockController on April 20, 2026 (block 24,920,358, tx [`0xeb7c71fc…8b9fd8`](https://etherscan.io/tx/0xeb7c71fc855cd928bb4b300eaf7cc5e8b0ad86b625a109f3308b0552068b9fd8)). The last proxy upgrade of any core contract was on April 20, 2026, immediately *before* that transfer; no proxy has been upgraded since the timelock took control.
- **Holder concentration:** The Stability Pool holds 57,460,692 fxUSD — **89.35% of total supply** — and fxSAVE's assets equal 96.9% of all fxSP shares. The Curve USDC/fxUSD pool holds a further 4.7% of supply. Holder distribution remains independently visible through [Blockscout](https://eth.blockscout.com/token/0x085780639CC2cACd35E474e71f4d000e2405d8f6?tab=holders).

The protocol has operated for over 2 years with no exploits or fund losses. The published December 2024 $0.953 ATL is not supported by the checked DeFiLlama and onchain Curve history and is therefore excluded from risk scoring. TVL scaled from launch to a sustained $100M+ band in mid-2025 and is currently about $96.8M.

## Funds Management

In V2, all fxUSD position collateral is accounted for by the PoolManager contract ([`0x250893CA4Ba5d05626C785e8da758026928FCD24`](https://etherscan.io/address/0x250893CA4Ba5d05626C785e8da758026928FCD24)), which records ~4,635.20 wstETH (~$8.71M) and ~1,243.47 WBTC (~$78.33M) — totaling ~$87.04M backing ~64.31M fxUSD pool debt (**~135.6% CR** at NAV). Some collateral is temporarily borrowed by sPOSITIONs, explaining the difference between the manager's accounting balance and direct ERC-20 balance. No collateral is deployed to external protocols today, but that is a discretionary state rather than an architectural guarantee: the PoolManager has a live `allocations` entry pointing wstETH at an AaveV3Strategy ([`0xFd3A6540e21D0E285f88FBFd904883B23e08F5C8`](https://etherscan.io/address/0xFd3A6540e21D0E285f88FBFd904883B23e08F5C8)) with a 100,000 wstETH capacity — roughly 22x the current wstETH balance — and any ASSET_MANAGER_ROLE holder can push collateral into it without a timelock (see *Centralization & Control Risks*). The strategy currently holds 0 wstETH. The Stability Pool has an equivalent USDC path into an AaveV3CompoundStrategy ([`0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f`](https://etherscan.io/address/0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f), 100M USDC capacity) which holds ~19 USDC — actual Aave exposure across the protocol is negligible.

### Accessibility

- **Who can mint:** Anyone can mint fxUSD by depositing collateral (wstETH, WBTC in V2) through fxMINT or by opening xPOSITION/sPOSITION positions. No whitelist required.
- **Minting mechanism:** Atomic in a single transaction via flash loans. Users deposit collateral, fxUSD is minted proportional to their leverage/debt position.
- **Redemption is conditional, not always-on.** `PegKeeper.isRedeemAllowed()` returns `true` only while the Curve USDC/fxUSD EMA is **below** the `priceThreshold` of $0.998 ([PegKeeper implementation](https://etherscan.io/address/0x17e2e8ca0b35aa750771e000d1e926417b97f29d#code)). The EMA is currently ~$1.00034, so redemption is **disabled** and `isBorrowAllowed()` is `true`. The mechanism is a depeg backstop that establishes a floor near $0.995 (redeeming $1 of collateral less a 0.5% fee, `getRedeemFeeRatio()` = 5e6/1e9); it is not an exit route available at par.
- **Fees:** Opening fee: 0.5% of minted debt (fxMINT), 0.3% (xPOSITION/sPOSITION). Closing fee: 0.2% (fxMINT), 0.1% (xPOSITION/sPOSITION). 0% ongoing annual interest for fxMINT. Onchain: redeem fee 0.5%, flash-loan fee 0.01%, liquidation expense ratio 10%, harvester ratio 0.1%.
- **Rate limits:** Each redemption call walks from the highest- to lower-leverage ticks and can consume at most **20% of aggregate debt in each tick** (`getMaxRedeemRatioPerTick()` = 2e8/1e9). A single call may redeem from multiple ticks, but it does not restart at the top; any requested remainder needs another call. This is a per-tick limit, not a 20% cap per individual xPOSITION ([`BasePool._redeem`](https://github.com/AladdinDAO/fx-protocol-contracts/blob/main/contracts/core/pool/BasePool.sol)).

### Collateralization

- **Fully collateralized onchain** by crypto-native assets accounted for in the PoolManager: wstETH (~$8.71M) and WBTC (~$78.33M)
- **Over-collateralization:** The V2 system maintains ~135.6% CR (~$87.04M collateral backing ~$64.18M debt at NAV), equivalent to ~74% aggregate LTV against a per-position rebalance trigger at 88% LTV. The system requires >100% CR; Stability Mode triggers protective measures at CR <130%. Both active pools are close to that system threshold: xstETH is ~136.7% CR and xWBTC ~135.5%, equivalent to only about 4–5% additional collateral-price downside with no deleveraging. Note: `fxUSD.isUnderCollateral()` currently returns `true` due to the legacy V1 wstETH market (79.3% CR with only ~$8.1K remaining), not the active V2 system.
- **Collateral quality:** wstETH (Lido) and WBTC — blue-chip DeFi assets with deep liquidity. V2 concentrates collateral in two high-quality assets rather than the V1 approach of 6+ collateral types, but the mix is heavily skewed: WBTC is ~90% of collateral value and backs ~90% of debt, so system solvency tracks BTC far more than ETH.
- **Liquidations are on-chain** via two mechanisms:
  - **Rebalancing (Liquidation Brake):** Triggered at 88% LTV — partial position reduction, 2.5% bounty
  - **Hard Liquidation:** Triggered at 95% LTV — full position closure, 4% bounty
- **Band system:** Positions are grouped into 0.15% price bands for efficient batch rebalancing by keepers
- **Peg stability mechanisms (5 layers):**
  1. Organic market pressure from position open/close
  2. Stability Pool peg keeper (buys fxUSD below peg using USDC)
  3. Funding Level I: triggered when Stability Pool USDC <5%, cost = Aave USDC borrow rate
  4. Enhanced protection: Curve EMA < $0.998 triggers mint pause + Funding Level II (10x Aave rate)
  5. Redemption: hard floor at $0.995 via 1:1 collateral redemption with 0.5% fee
- **Stable buffer has recovered above its trigger.** The Stability Pool holds 57,460,692 fxUSD and 6,836,417 USDC, making USDC about **10.65%** of pool value — above the 5% Funding Level I threshold. `isFundingEnabled()` is currently `false`, while the PegKeeper has meaningful USDC ammunition to buy fxUSD below peg. This is a favorable change from the 0.16% buffer observed on July 27, but depositors can withdraw and the ratio remains dynamic.
- **Risk curation:** Governance-adjustable parameters include LTV thresholds, fees, oracle deviations, and collateral caps

### Provability

- **Reserves fully verifiable on-chain** — PoolManager accounting, direct token custody, registered short-pool borrowing and any configured-strategy balances are readable by anyone
- **Exchange rate / NAV:** Computed on-chain algorithmically via the f(x) invariant formula. No off-chain inputs for NAV calculation.
- **Oracle system:** Multi-source design:
  - **stETH/USD:** Chainlink ETH/USD + Uniswap V3 USDC/ETH (0.05% and 0.3% pools) + Curve stETH/ETH EMA + Uniswap V3 stETH/ETH. 1% deviation threshold.
  - **WBTC/USD:** Chainlink BTC/USD + Chainlink WBTC/BTC + Uniswap V3 pools (WBTC/USDC, WBTC/ETH, USDC/ETH). 2% deviation threshold.
- **Admin minting:** The fxUSD contract is upgradeable (TransparentUpgradeableProxy, implementation `FxUSDRegeneracy` [`0xf729422D68c2cf00574fb5712972454cf402A9b1`](https://etherscan.io/address/0xf729422d68c2cf00574fb5712972454cf402a9b1), last upgraded February 17, 2026). ProxyAdmin is owned by the TimelockController, so any upgrade that introduced unbacked minting would be visible for 3 days before it could execute. Under the current implementation, fxUSD can only be minted against collateral through the PoolManager and ShortPoolManager.
- **`isUnderCollateral` flag:** The fxUSD contract currently reports `isUnderCollateral() = true` due to a legacy V1 wstETH market with 79.3% CR (~$8.1K remaining, negligible). The active V2 system holds ~$87.04M collateral against ~64.31M fxUSD pool debt (~135.6% CR at NAV).
- **No third-party verification** (no Chainlink PoR or custodian attestation needed — all on-chain)

## Liquidity Risk

- **Primary liquidity:** Curve USDC/fxUSD pool at ~$7.52M with ~59.4% USDC and ~40.6% fxUSD. This single pool is doing double duty — it is both the main exit venue and the EMA price source that the PegKeeper uses to gate minting, redemption and funding costs.
- **Secondary pools:** Six smaller Curve pools total only ~$1.94M at current component prices (msUSD ~$0.59M, reUSD ~$0.55M, USDnr ~$0.44M, frxUSD ~$0.15M, alUSD ~$0.14M, GHO ~$0.06M), plus ~$0.03M in the four-asset DeFi Stable Avengers pool ([Curve API snapshot](https://api.curve.finance/v1/getPools/ethereum/factory-stable-ng)). These venues introduce other stablecoin risk and generally require a second hop to reach USDC; msUSD was itself priced near $0.70 in that snapshot.
- **Redemption mechanism:** Direct redemption for underlying collateral (wstETH/WBTC) with a 0.5% fee — **but only enabled while the Curve EMA is below $0.998**. Each call walks the leverage ticks once and can redeem up to 20% of aggregate debt per tick; it is not capped at 20% of one position or 20% total. Redemption is currently disabled and cannot be relied on as an exit at par.
- **Stability Pool exits:** 1% instant-redeem fee (`instantRedeemFeeRatio` = 1e16), or fee-free after a 60-minute cooldown (`redeemCoolDownPeriod` = 3600s). Redemptions pay out pro-rata in the pool's assets, currently about 89.35% fxUSD and 10.65% USDC by value. This buffer improves exit quality, but most of a large fxSAVE/fxSP redemption would still return fxUSD that must be sold or held.
- **Slippage analysis:** Snapshot-block `get_dy` quotes were materially better than the prior report assumed: 500K fxUSD returned ~500,056 USDC, 1M returned ~999,997 USDC, and 4M returned ~3,989,756 USDC (about 0.26% below par). The pool can therefore absorb ordinary and moderately large exits efficiently in its current state. Impact becomes nonlinear as an exit approaches the pool's ~4.47M USDC side, and direct collateral redemption remains unavailable while fxUSD trades at par.
- **Historical market data caveat:** The published $0.953 December 2024 ATL could not be corroborated in checked DeFiLlama or primary Curve trade history and is not used as evidence of stressed liquidity.
- **Structural concentration:** 89.35% of fxUSD supply sits in the Stability Pool, and fxSAVE's assets equal 96.9% of all fxSP shares. Demand for fxUSD is therefore overwhelmingly protocol-internal yield-seeking rather than external usage, and a coordinated fxSAVE exit would still put most proceeds through the ~$7.52M Curve pool. Primary DEX depth is only ~11.7% of supply; all checked Curve liquidity totals about 14.7% of supply.

## Centralization & Control Risks

### Governance

- **All core contracts are upgradeable** via TransparentUpgradeableProxy, controlled by ProxyAdmin [`0x9b54b7703551d9d0ced177a78367560a8b2edda4`](https://etherscan.io/address/0x9b54b7703551d9d0ced177a78367560a8b2edda4)
- **3-day timelock on upgrades and core parameters (since April 20, 2026):** ProxyAdmin is owned by a TimelockController at [`0x68863fb8855b04509a835082478D6E3D0bE4E61a`](https://etherscan.io/address/0x68863fb8855b04509a835082478D6E3D0bE4E61a) with a 259,200-second (3-day) minimum delay. The timelock also holds `DEFAULT_ADMIN_ROLE` on fxUSD, PoolManager, ShortPoolManager, Configuration, fxSP, fxSAVE and PegKeeper — verified by `hasRole(0x00, timelock) == true` and `hasRole(0x00, multisig) == false` on each. Parameter changes, not just upgrades, therefore go through the delay.
- **The timelock is honored in practice.** On May 27, 2026 the multisig scheduled `updatePoolCapacity(xWBTC, 2000e8, 100_000_000e18)` (tx [`0x6e3b2e46…36115`](https://etherscan.io/tx/0x6e3b2e463ca6bc2e723196e95621049672e0b663a5d56033bc2c3216b5136115)) and executed it on May 30, 2026 (tx [`0x53e62749…9bbeca`](https://etherscan.io/tx/0x53e62749bcdbd2f70020693779a19589a85ee41e74656c793a2ea4a92f9bbeca)) — exactly the 3-day delay, no shortcut. No `MinDelayChange` or `Cancelled` events have been emitted since the timelock was deployed.
- **EXECUTOR_ROLE is granted to `address(0)`**, so execution after the delay is permissionless — anyone can push through a scheduled operation. PROPOSER and CANCELLER are held only by the 6/9 multisig; `TIMELOCK_ADMIN_ROLE` is held only by the timelock itself.

**Material carve-out — the price oracles are not behind the timelock.** The two live price oracles, StETHPriceOracle [`0x0C5C61025f047cB7e3e85852dC8eAFd7b9a4Abfb`](https://etherscan.io/address/0x0C5C61025f047cB7e3e85852dC8eAFd7b9a4Abfb) and WBTCPriceOracle [`0xb3c90e64EB6f456A5F5C17Aa99b6aecA6f4a6390`](https://etherscan.io/address/0xb3c90e64EB6f456A5F5C17Aa99b6aecA6f4a6390) (confirmed as the pools' `priceOracle()`), are plain `Ownable2Step` contracts whose `owner()` is still the 6/9 operational multisig. Their `pendingOwner()` is the TimelockController, and a batch calling `acceptOwnership()` on both was scheduled through the timelock on April 20, 2026 (tx [`0xb8a2e1ce…3b4f6d`](https://etherscan.io/tx/0xb8a2e1cee9100fa1cb7aa0fbcbe9e4725312abb89413ed2de15bd1ba723b4f6d), operation `0x0ac451c6…86dd0`). That operation has been ready to execute since April 23, 2026 and remains pending — `isOperationReady() == true`, `isOperationDone() == false`. Until someone executes it, the multisig can, with no delay:

- `updateMaxPriceDeviation(...)` — currently 1% (stETH) and 2% (WBTC). This bound is what clamps spot prices back to the manipulation-resistant anchor inside `getPrice()`.
- `updateOnchainSpotEncodings(...)` — repoints the oracle at arbitrary on-chain spot sources. The only validation is that the encoding does not revert.

Used together — widen the deviation bound, then point the oracle at a controlled pool — these produce an arbitrary `getExchangePrice()` / `getLiquidatePrice()`, which is a direct, non-timelocked path to force liquidations and capture collateral. Because the remediation is already scheduled and permissionlessly executable, this is a gap in follow-through rather than an intentional design, but it is live today and is the single largest centralization risk in the system.

**Non-timelocked asset-management path.** `ASSET_MANAGER_ROLE` on both the PoolManager and the Stability Pool is held by the 6/9 multisig, the 3/4 emergency multisig and the timelock. That role's `manage(asset, amount)` moves funds into the already-configured strategy up to its capacity. Choosing the strategy (`alloc`) is `DEFAULT_ADMIN_ROLE` and therefore timelocked, which bounds the destination — but the configured wstETH capacity (100,000 wstETH) exceeds the entire wstETH collateral balance by ~22x, so either multisig could move the whole ETH collateral leg into Aave Prime without delay.

- **Operational multisig:** 6-of-9 Gnosis Safe [`0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`](https://etherscan.io/address/0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF)
  - Known signers: Diligent Deer, Paul, chiaki644, Gordon, Guo Yu, Jamie, Martin Krung, Sharlyn Wu, vfat
  - Mix of known and semi-anonymous contributors
  - Holds PROPOSER, EXECUTOR and CANCELLER on the TimelockController (not TIMELOCK_ADMIN_ROLE), plus `EMERGENCY_ROLE` and `ASSET_MANAGER_ROLE` directly, plus ownership of both price oracles
- **Emergency multisig:** 3-of-4 Gnosis Safe [`0x28c921adAC4c1072658eB01a28DA06b5F651eF62`](https://etherscan.io/address/0x28c921adAC4c1072658eB01a28DA06b5F651eF62)
  - Signers: Gordon, Guo Yu, Jamie, Sharlyn Wu (all team members)
  - Holds `EMERGENCY_ROLE` on PoolManager and ShortPoolManager — can pause xPOSITION and sPOSITION operations directly, outside the timelock. Note the operational 6/9 multisig holds the same role, so pause authority is not exclusive to the emergency signer set.
- **Governance voting:** Snapshot space `fxn.eth` using veFXN voting power. 32 proposals to date with low voter participation (4–16 voters, ~118–172K veFXN per vote). The most recent proposal, FIP-30, was created February 4, 2026 — nearly six months without governance activity, so the multisig is effectively the operating authority.
- **Privileged roles:** The 6/9 multisig can propose to upgrade all contracts, change fee parameters and alter system addresses, all subject to the 3-day delay; and can change oracle configuration, pause positions, and deploy collateral to the configured Aave strategies with no delay at all.

**Trust model:** The timelock is a genuine improvement and has been respected in practice — upgrades and core parameter changes now carry a 3-day public notice, and the last proxy upgrade of any core contract predates the transfer. But the "everything is timelocked" reading does not survive verification: oracle ownership, pause authority and strategy funding all sit outside it. The realistic worst case is not a slow malicious upgrade — users could react to that — but an instant oracle repricing by a compromised or malicious 6/9 multisig. Executing the already-scheduled oracle `acceptOwnership()` batch would close the most severe of these paths.

### Programmability

- **Highly programmatic:** Core operations (minting, redemption, liquidation, rebalancing, peg keeping) are all handled by smart contracts
- **NAV/PPS:** Calculated on-chain algorithmically via the f(x) invariant — no manual price updates
- **Keepers:** Rebalancing and liquidation depend on external keepers to trigger transactions. Keeper incentive is 1% (0.01% for fxSAVE harvesting); onchain `getHarvesterRatio()` is 0.1%. If keepers fail to act, positions may not be rebalanced in time.
- **Stability Pool peg keeper:** Automated but depends on sufficient USDC deposits in the pool
- **Oracle updates:** Chainlink feeds + Uniswap/Curve on-chain TWAP/EMA — no off-chain dependencies for price feeds

### External Dependencies

- **Chainlink:** ETH/USD and BTC/USD price feeds — critical for all position operations and liquidations
- **Uniswap V3:** TWAP oracle data used as secondary/validation price source
- **Curve:** stETH/ETH EMA oracle, plus the USDC/fxUSD pool [`0x5018BE88…FB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) whose `price_oracle(0)` EMA is a **hard control input**, not just monitoring: it decides whether minting is allowed, whether redemption is allowed, and whether funding costs are levied. A single ~$7.52M pool therefore gates the protocol's core user operations.
- **Aave:** allocation paths are configured for Stability Pool USDC (100M capacity) and PoolManager wstETH (100,000 wstETH capacity), but ~19 USDC and 0 wstETH are actually deployed — current Aave exposure is negligible while the capacity to create it without a timelock remains.
- **Lido:** wstETH is the ETH collateral leg in V2 (~$8.71M, ~10% of collateral)
- **LayerZero:** fxUSD has a live Ethereum↔Base LayerZero V2 route. The Ethereum [`FxUSDOFTAdaptor`](https://etherscan.io/address/0xA07d8cc424421cC2bce0544a65481376f010A438) locks canonical fxUSD and peers with the Base [`fxUSD OFT`](https://basescan.org/address/0x55380fe7A1910dFf29A47B622057ab4139DA42C5); both point to the canonical EndpointV2 and had exactly 308,980.654349 fxUSD escrow/supply at the snapshot. This is a **lock** model: the adapter cannot mint canonical Ethereum fxUSD, so bridge risk is bounded to the Base representation and escrow (0.48% of Ethereum supply), although a forged Base→Ethereum release could steal that escrow. The receive-side Ethereum route requires all three required DVNs (LayerZero Labs, Nethermind, Google) plus 1-of-3 optional DVNs (Horizen, Polyhedra zkBridge, Canary), with 20 confirmations — an effective **3 required + 1-of-3 optional** quorum. The operational 6-of-9 Safe owns the Ethereum adapter; a separate 3-of-4 Safe owns the Base OFT.

- **Katana deployments are locally issued, not identified bridge representations.** Two `fxUSD` / "f(x) USD" ERC-20s exist on Katana ([`0x4c03…FDF9`](https://explorer.katanarpc.com/address/0x4c03ff0f44A55e7098a09016E02a01d3cdC2FDF9), supply ~12,024; [`0x1364…9f86`](https://explorer.katanarpc.com/address/0x1364b238C668A2dec1294174e4798E8c09979f86), supply ~1,000,018). Each token exposes a local `poolManager()` (`0x27b3…f96a` and `0xFae3…3C68`, respectively), and each PoolManager's `fxUSD()` points back to its corresponding token. The verified `0x1364…9f86` implementation restricts minting to its PoolManager; local mint events, including a 10,000-token genesis mint for `0x4c03…FDF9`, corroborate local issuance. Neither token is a LayerZero OFT (`endpoint()` reverts), and neither is the canonical AggLayer/LxLy wrapper of mainnet fxUSD (`PolygonZkEVMBridgeV2.getTokenWrappedAddress(0, fxUSD)` returns the zero address on Katana). Both supplies are essentially static since the May 2026 check. This positive architecture evidence does not reveal a bridge path from Ethereum fxUSD to either Katana deployment. Because the `0x4c03…FDF9` implementation is not source-verified, a separate custom conversion path cannot be ruled out absolutely; reassess if one is identified rather than inferring a bridge from the shared name and symbol.

The protocol depends on multiple well-established DeFi protocols. Chainlink is the most critical dependency — oracle failure would impair pricing and liquidations. Aave exposure is capped and currently negligible. LayerZero is an optional, bounded bridge route rather than a dependency of Ethereum minting or collateral solvency.

## Operational Risk

- **Team transparency:** [AladdinDAO was launched](https://medium.com/aladdindao/aladdindao-4e181ac5baa) by a consortium of 14 contributors and investors including Sharlyn Wu, Robert Leshner, Kain Warwick and Hart Lambur. AladdinDAO later built/incubated f(x); the launch contributors should not be described as direct f(x) core developers. The current core development team and boule members remain only partially doxxed.
- **AladdinDAO launch backers:** Polychain Capital, Digital Currency Group, 1kx, Multicoin Capital, CMS, Nascent, Alameda Research and DeFi Alliance participated at the AladdinDAO level. Public evidence does not establish each as a direct investor in the f(x) product.
- **Documentation quality:** Good — comprehensive GitBook documentation covering mechanisms, risk framework, fees, and deployments. Active GitHub with open-source contracts.
- **Legal structure:** AladdinDAO is structured as a DAO. No clear traditional legal entity disclosed.
- **Incident response:** The ChainSecurity flash loan vulnerability was handled promptly (April 2025). The protocol has a defined 5-layer risk framework with recapitalization as the final safety mechanism.

## Monitoring

### Key Contracts to Monitor

| Contract | Address | What to Monitor |
|----------|---------|-----------------|
| fxUSD | [`0x085780639CC2cACd35E474e71f4d000e2405d8f6`](https://etherscan.io/address/0x085780639CC2cACd35E474e71f4d000e2405d8f6) | totalSupply changes, NAV deviations from $1.00 |
| ProxyAdmin | [`0x9b54b7703551d9d0ced177a78367560a8b2edda4`](https://etherscan.io/address/0x9b54b7703551d9d0ced177a78367560a8b2edda4) | Any `upgrade()` calls — immediate alert |
| TimelockController | [`0x68863fb8855b04509a835082478D6E3D0bE4E61a`](https://etherscan.io/address/0x68863fb8855b04509a835082478D6E3D0bE4E61a) | `CallScheduled`, `CallExecuted`, `Cancelled`, `MinDelayChange`, role changes; also whether the pending oracle `acceptOwnership()` batch `0x0ac451c6…86dd0` gets executed |
| StETHPriceOracle | [`0x0C5C61025f047cB7e3e85852dC8eAFd7b9a4Abfb`](https://etherscan.io/address/0x0C5C61025f047cB7e3e85852dC8eAFd7b9a4Abfb) | `owner()` (should become the timelock), `UpdateMaxPriceDeviation`, `updateOnchainSpotEncodings` calls |
| WBTCPriceOracle | [`0xb3c90e64EB6f456A5F5C17Aa99b6aecA6f4a6390`](https://etherscan.io/address/0xb3c90e64EB6f456A5F5C17Aa99b6aecA6f4a6390) | `owner()` (should become the timelock), `UpdateMaxPriceDeviation`, `updateMaxWBTCDeviation`, `updateOnchainSpotEncodings` calls |
| Operational Multisig | [`0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`](https://etherscan.io/address/0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF) | Governance parameter changes, new transactions |
| Emergency Multisig | [`0x28c921adAC4c1072658eB01a28DA06b5F651eF62`](https://etherscan.io/address/0x28c921adAC4c1072658eB01a28DA06b5F651eF62) | Pause events on PoolManager/ShortPoolManager |
| PoolManager | [`0x250893CA4Ba5d05626C785e8da758026928FCD24`](https://etherscan.io/address/0x250893CA4Ba5d05626C785e8da758026928FCD24) | Rebalance/Liquidation events, wstETH/WBTC balances, collateral ratio, `manage()` calls moving collateral into the Aave strategy |
| Stability Pool (fxSP) | [`0x65C9A641afCEB9C0E6034e558A319488FA0FA3be`](https://etherscan.io/address/0x65C9A641afCEB9C0E6034e558A319488FA0FA3be) | USDC ratio (currently ~10.65%, above the 5% threshold), deposit/withdrawal flows, `alloc`/`manage` calls |
| fxSAVE | [`0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39`](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) | Total assets, exchange rate changes |
| PegKeeper | [`0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70`](https://etherscan.io/address/0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70) | Peg maintenance events, funding level triggers |
| Curve USDC/fxUSD | [`0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) | Pool balance ratio, large swaps |
| FxUSDOFTAdaptor | [`0xA07d8cc424421cC2bce0544a65481376f010A438`](https://etherscan.io/address/0xA07d8cc424421cC2bce0544a65481376f010A438) | Escrow balance, `SetPeer`, `SetReceiveLibrary`, `SetConfig`, ownership/delegate changes and unexpected releases |
| Base fxUSD OFT | [`0x55380fe7A1910dFf29A47B622057ab4139DA42C5`](https://basescan.org/address/0x55380fe7A1910dFf29A47B622057ab4139DA42C5) | Supply versus Ethereum escrow, peer/config changes and 3-of-4 owner Safe changes |

### Critical Events & Thresholds

| Event | Threshold | Action |
|-------|-----------|--------|
| fxUSD NAV deviation | >2% from $1.00 | Immediate alert |
| Curve EMA price | <$0.998 | Enhanced protection mode: minting disabled, redemption enabled, funding costs levied |
| Stability Pool USDC ratio | <5% of pool | Funding Level I activates — currently not triggered at ~10.65% |
| Collateral Ratio (either V2 pool) | <130% | Stability Mode — enhanced monitoring (currently ~136.7% xstETH / ~135.5% xWBTC) |
| Collateral Ratio (any market) | <100% | Critical — recapitalization mode |
| Oracle `owner()` change | Any | Confirm ownership moved to the timelock, not to a new EOA/multisig |
| `UpdateMaxPriceDeviation` / spot-encoding change on either oracle | Any | Immediate investigation — non-timelocked path to reprice collateral |
| TimelockController `CallScheduled` | Any | Investigate target/calldata; 3 days to react before execution |
| TimelockController `MinDelayChange` | Any | Immediate investigation — delay reduction is a major risk event |
| ProxyAdmin upgrade | Any call | Immediate investigation (should only occur after a timelock-scheduled call) |
| `manage()` on PoolManager or fxSP | Any | Collateral or stable reserves being deployed to Aave without a timelock |
| Emergency pause | Any | Immediate alert and assessment |
| fxUSD totalSupply | >50% change in 24h | Investigate unusual minting/burning |
| fxSP share of fxUSD supply | >95% | Rising protocol-internal concentration; DEX exit capacity shrinking relative to redeemable balance |
| LayerZero escrow / Base supply mismatch | Any | Halt bridge use and investigate stuck, forged or incorrectly accounted cross-chain messages |
| LayerZero DVN quorum change | Any | Re-evaluate Base→Ethereum escrow-release security before continued bridge use |

### Key View Functions

- `fxUSD.nav()` — current NAV (target: 1e18 = $1.00)
- `fxUSD.totalSupply()` — total fxUSD in circulation
- `fxUSD.isUnderCollateral()` — boolean (currently true due to legacy market; monitor for V2 changes)
- `PoolManager.getPoolInfo(pool)` — returns (collateralCapacity, collateralBalance, rawCollateral, debtCapacity, debtBalance) per pool
- `wstETH.balanceOf(PoolManager)` / `WBTC.balanceOf(PoolManager)` — direct collateral balance checks
- `PoolManager.allocations(wstETH)` / `fxSP.allocations(USDC)` — configured external strategy and its capacity
- `StabilityPool.totalSupply()` / `.totalYieldToken()` / `.totalStableToken()` — fxSP shares and the fxUSD/USDC split
- `fxSAVE.totalAssets()` — total assets in fxSAVE vault
- `PegKeeper.isBorrowAllowed()` / `.isRedeemAllowed()` / `.isFundingEnabled()` — the three EMA-gated protocol states
- `PegKeeper.getFxUSDPrice()` — Curve EMA price driving those three gates
- `StETHPriceOracle.owner()` / `WBTCPriceOracle.owner()` — should read as the TimelockController once the pending batch executes
- `TimelockController.isOperationReady(0x0ac451c6de449a81fbe3841b847535ef693957bf41e381012c684680ae786dd0)` — pending oracle ownership transfer

### Recommended Monitoring Frequency

- **fxUSD NAV & Curve pool balance:** Every 15 minutes
- **Collateral ratios:** Hourly
- **Multisig transactions & upgrades:** Real-time (block-by-block)
- **Stability Pool health:** Every 4 hours
- **TVL and supply metrics:** Daily

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GOVERNANCE LAYER                            │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ Operational       │    │ Emergency         │                  │
│  │ Multisig (6/9)   │    │ Multisig (3/4)    │                  │
│  │ 0x26B2...BbF     │    │ 0x28c9...eF62     │                  │
│  └────────┬─────────┘    └────────┬──────────┘                  │
│           │ proposes/             │ can pause                   │
│           │ executes              │                             │
│  ┌────────▼─────────┐             │                             │
│  │ TimelockController │           │                             │
│  │ 0x6886...61a (3d)  │           │                             │
│  └────────┬─────────┘             │                             │
│           │ owns                  │                             │
│  ┌────────▼─────────┐    ┌───────▼───────────┐                  │
│  │ ProxyAdmin        │    │ PoolManager       │                  │
│  │ 0x9b54...da4     │    │ ShortPoolManager   │                  │
│  └────────┬─────────┘    └───────────────────┘                  │
│           │ upgrades all proxies (subject to 3-day timelock)    │
└───────────┼─────────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                     TOKEN / VAULT LAYER                         │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │ fxUSD         │   │ fxSAVE       │   │ FXN / veFXN  │        │
│  │ 0x0857...8f6  │   │ 0x7743...39  │   │ 0x365A...09  │        │
│  │ (stablecoin)  │   │ (yield vault)│   │ (governance) │        │
│  └──────┬───────┘   └──────┬───────┘   └──────────────┘        │
│         │ minted via        │ wraps                             │
│  ┌──────▼───────┐   ┌──────▼───────┐                            │
│  │ Markets       │   │ Stability    │                            │
│  │ (MarketV2)    │   │ Pool (fxSP)  │                            │
│  │ 0xAD9A...155  │   │ 0x65C9...3be │                            │
│  └──────┬───────┘   └──────┬───────┘                            │
└─────────┼──────────────────┼────────────────────────────────────┘
          │                  │
┌─────────▼──────────────────▼────────────────────────────────────┐
│                     PROTOCOL LAYER                              │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ PoolManager   │  │ PegKeeper    │  │ Configuration│           │
│  │ (Long)        │  │ 0x5056...70  │  │ 0x16b3...28d │           │
│  │ 0x2508...D24  │  └──────────────┘  └──────────────┘           │
│  ├──────────────┤  ┌──────────────┐  ┌──────────────┐           │
│  │ ShortPool     │  │ GatewayRouter│  │ GaugeControl │           │
│  │ Manager       │  │ 0xA5e2...fE4│  │ 0xe60e...37  │           │
│  │ 0xaCDc...66D  │  └──────────────┘  └──────────────┘           │
│  └──────┬───────┘                                               │
│         │ custodies ALL V2 collateral                           │
│  ┌──────▼───────────────────────────────────────────────┐       │
│  │ COLLATERAL (held in PoolManager)                      │       │
│  │ wstETH: 4,635.20 (~$8.71M) via xstETH pool           │       │
│  │ WBTC:   1,243.47 (~$78.33M) via xWBTC pool           │       │
│  │ Total: ~$87.04M backing ~64.31M fxUSD (~135.6% CR)   │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────────┐
│                     UNDERLYING LAYER                            │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │ Chainlink  │  │ Uniswap   │  │ Curve     │  │ Aave      │    │
│  │ (oracles)  │  │ V3 (TWAP) │  │ (EMA,DEX) │  │ (yield)   │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
│  ┌───────────┐  ┌──────────────────────────────────────────┐    │
│  │ Lido      │  │ LayerZero V2: Ethereum OFTAdapter        │    │
│  │ (wstETH)  │  │ locks fxUSD ↔ Base OFT (0.48% of supply) │    │
│  └───────────┘  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Trust boundaries:**
- The 6/9 multisig has full upgrade authority over all protocol contracts *and* `DEFAULT_ADMIN_ROLE`-gated parameters, but both are subject to a 3-day timelock (as of April 20, 2026) — this is the primary trust boundary
- **Outside the timelock:** the 6/9 multisig owns both price oracles directly and can change deviation bounds and spot-price sources instantly; both multisigs hold `EMERGENCY_ROLE` (pause) and `ASSET_MANAGER_ROLE` (fund the configured Aave strategies) with no delay
- The 3/4 emergency multisig can pause position operations immediately but cannot upgrade contracts
- Timelock execution is permissionless (`EXECUTOR_ROLE` granted to `address(0)`); only proposing and cancelling are multisig-gated
- Keepers are permissionless (anyone can trigger rebalancing/liquidation for bounties)
- Oracle data flows from Chainlink + Uniswap/Curve and is validated with deviation thresholds — but the thresholds themselves are owner-settable outside the timelock
- The optional Base representation depends on LayerZero's route configuration and the two bridge-owner Safes. The Ethereum adapter uses a lock model and cannot mint canonical fxUSD, bounding current bridge exposure to its ~309K fxUSD escrow.

---

## Risk Summary

### Key Strengths

- **Extensive audit history:** 21 audits from 3 firms (Secbit, Trail of Bits, OpenZeppelin) with continuous coverage since 2023
- **Active security bounty:** AladdinDAO's self-hosted program explicitly covers f(x), with a $500,000 maximum critical payout
- **3-day timelock covers upgrades *and* core parameters** (since April 20, 2026), verified honored in practice on the May 27–30, 2026 `updatePoolCapacity` operation; timelock execution is permissionless
- **Reserves reconcile exactly:** total supply less V2 pool debt leaves 264 fxUSD of legacy issuance, confirming no unaccounted fxUSD
- **Innovative peg mechanism:** 5-layer peg protection with onchain redemption as a floor near $0.995 during a depeg
- **Fully onchain collateral:** All reserves verifiable in the PoolManager, NAV calculated algorithmically
- **Established builder provenance:** AladdinDAO, the builder/incubator of f(x), launched with contributors and investors including Leshner, Warwick, Lambur, Polychain, DCG and 1kx; these are AladdinDAO-level relationships, not evidence that each is a direct f(x) contributor or investor
- **2+ years in production** with no exploits or fund losses; TVL has scaled from launch to a sustained $100M+ band in mid-2025

### Key Risks

- **Price oracles are outside the timelock.** The 6/9 multisig still owns both live oracles and can widen the deviation bound and repoint spot sources in a single transaction, producing an arbitrary liquidation price. The transfer to the timelock has been scheduled and executable since April 23, 2026 but remains unexecuted.
- **Collateral is concentrated in BTC and close to Stability Mode.** WBTC is ~90% of collateral and debt; xWBTC is ~135.5% CR, xstETH ~136.7%, and system CR ~135.6% against a 130% Stability Mode trigger.
- **Redemption is not an always-available exit.** It unlocks only when the Curve EMA falls below $0.998, so a large holder cannot rely on it while fxUSD trades at par.
- **Structural concentration remains high:** 89.35% of fxUSD sits in the Stability Pool and fxSAVE's assets equal 96.9% of fxSP shares, with only ~$7.52M of primary DEX depth (~11.7% of supply) as the main market exit. The improved 10.65% USDC Stability Pool buffer mitigates, but does not remove, this risk.
- **Non-timelocked asset-management and pause authority:** both multisigs hold `ASSET_MANAGER_ROLE` (100,000 wstETH Aave capacity vs ~4,635 wstETH accounted for) and `EMERGENCY_ROLE`.
- **Optional bridge dependency:** Base fxUSD relies on a LayerZero lock-and-mint route and two owner Safes. Current exposure is bounded to ~309K escrowed fxUSD (0.48% of supply), but a forged release or hostile configuration could impair that amount.
- **Dormant governance:** no Snapshot proposal since February 4, 2026; participation historically 4–16 voters
- **Keeper dependency:** Rebalancing and liquidation rely on external keepers; failure to act in time could lead to under-collateralization

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [ ] **No audit** — Protocol has 21 audits from 3 reputable firms ✅
- [ ] **Unverifiable reserves** — All reserves verifiable on-chain ✅
- [ ] **Total centralization** — 6-of-9 multisig (not single EOA) ✅

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

| Score | Audit coverage | Bug bounty |
|-------|-----------------|------------|
| **1** | 3+ audits by top firms | Active, max payout >$1M |
| **2** | 2+ audits by reputable firms | Max payout >$200K |
| **3** | 1 audit by reputable firm | Bounty program present |
| **4** | 1 audit by lesser-known firm or dated | Minimal or no bounty |
| **5** | No audit (CRITICAL GATE) | — |

**Score: 1.5/5** — 21 audits from Secbit, Trail of Bits, and OpenZeppelin provide exceptional coverage, and the active AladdinDAO bounty explicitly covers f(x) with a $500K maximum payout. That bounty clears the score-2 threshold but not the >$1M score-1 threshold; the complex surface (multiple markets, managers, bridge, oracle and stability systems) also supports retaining an intermediate 1.5 rather than a perfect score.

**Subcategory B: Historical Track Record**

| Score | Time in production | Scale (TVL) |
|-------|-------------------|-------------|
| **1** | >2 years | Sustained >$100M |
| **2** | 1–2 years | >$50M |
| **3** | 6–12 months | >$10M |
| **4** | 3–6 months | <$10M |
| **5** | <3 months | No meaningful TVL |

**Score: 2.0/5** — In production >2 years (since Feb 2024) which is excellent. Current TVL ~$96.8M is between the >$50M (score 2) and sustained >$100M (score 1) thresholds; the protocol did spend 182 days above $100M between May–November 2025 (all-time peak $271M on August 24, 2025) but is not currently sustained above $100M. No exploits or fund losses, and one responsibly disclosed vulnerability was handled well. The uncorroborated aggregator $0.953 ATL is excluded from the assessment.

**Audits & Historical Score = (1.5 + 2.0) / 2 = 1.75**

**Score: 1.75/5** — Strong audit coverage, an active $500K bounty and a solid track record with substantial TVL, tempered by contract complexity and TVL not yet sustained above $100M.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Score | Contract Upgradeability | Timelock | Privileged Roles |
|-------|------------------------|----------|-----------------|
| **1** | Immutable or fully decentralized DAO | N/A or >3 days | No privileged roles or multi-party approval |
| **2** | Multisig 7/11+ with timelock | 24+ hours | Limited roles, cannot seize funds |
| **3** | Multisig 5/9 with timelock | 24+ hours | Some powerful roles, constrained by timelock |
| **4** | Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints |
| **5** | EOA or <3 signers (CRITICAL GATE) | No timelock | Unlimited admin powers |

**Score: 3.0/5** — The timelock is real and well-scoped where it applies: ProxyAdmin is owned by a TimelockController with a 3-day (259,200s) minimum delay, the same timelock holds `DEFAULT_ADMIN_ROLE` on every core contract, and the delay was honored exactly on the May 27–30, 2026 `updatePoolCapacity` operation. Permissionless execution (`EXECUTOR_ROLE` = `address(0)`) and a 6/9 threshold both sit better than the score-3 reference case.

What holds the subcategory at 3.0 rather than better is that the timelock does not cover everything. The 6/9 multisig still owns both live price oracles outright and can, without any delay, widen `maxPriceDeviation` and repoint `onchainSpotEncodings` — together an unbounded path to set the liquidation price and seize collateral. Both multisigs also hold `EMERGENCY_ROLE` (instant pause) and `ASSET_MANAGER_ROLE`, the latter able to move the entire wstETH collateral leg into the pre-configured Aave strategy without delay. So "some powerful roles, constrained by timelock" describes the system accurately, and a fund-loss path that bypasses the delay entirely still exists. The mitigating factor is that the oracle handover is already scheduled onchain and anyone can execute it; when that lands, this subcategory would justify a re-score toward 2.5. Known signers include reputable DeFi figures alongside semi-anonymous contributors.

**Subcategory B: Programmability**

| Score | System Operations | PPS/Rate Definition |
|-------|------------------|---------------------|
| **1** | Fully programmatic | Calculated onchain algorithmically |
| **2** | Mostly programmatic with minor admin input | onchain with some parameters |
| **3** | Hybrid onchain/off-chain operations | onchain but reliant on admin updates |
| **4** | Significant manual intervention required | Off-chain accounting with periodic reporting |
| **5** | Fully custodial/centralized operations | Admin-controlled rate, no transparency |

**Score: 1.5/5** — System is highly programmatic. NAV is calculated on-chain algorithmically. All core operations (minting, redemption, liquidation, peg keeping) are automated. Minor admin input for fee parameters and oracle configuration. Keeper dependency for rebalancing is the only significant operational requirement.

**Subcategory C: External Dependencies**

| Score | Protocol Dependencies | Criticality |
|-------|----------------------|-------------|
| **1** | No external dependencies | N/A |
| **2** | 1-2 blue-chip dependencies | Non-critical |
| **3** | 2-3 established protocol dependencies | Some critical functions depend on them |
| **4** | Many or newer protocol dependencies | Critical functionality depends on them |
| **5** | Single point of failure dependency | Failure breaks entire protocol |

**Score: 3.0/5** — Multiple dependencies: Chainlink (critical for pricing), Curve (both the stETH/ETH EMA oracle and the USDC/fxUSD pool whose EMA *gates* minting, redemption and funding costs), Uniswap V3 (TWAP validation), Lido (wstETH), configured-but-unused Aave allocation paths, and an optional LayerZero route for Base fxUSD. These are established protocols and actual Aave exposure is negligible. The bridge is a lock model with only 0.48% of supply escrowed and a 3-required-plus-1-of-3-optional DVN receive quorum, so it adds bounded rather than system-wide risk. Chainlink still drives every liquidation and one ~$7.52M Curve pool decides whether users can mint or redeem. Score 3 holds.

**Centralization Score = (3.0 + 1.5 + 3.0) / 3 = 2.5**

**Score: 2.5/5** — Strong programmability and a working timelock over upgrades and core parameters, offset by non-timelocked oracle ownership and multiple critical dependencies.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Score | Backing | Collateral Quality | Verifiability |
|-------|---------|-------------------|---------------|
| **1** | 100%+ onchain, over-collateralized | Blue-chip assets (ETH, WBTC, stablecoins) | Real-time onchain verification |
| **2** | 100% onchain collateral | High-quality DeFi assets (LSTs, major LPs) | onchain with some complexity |
| **3** | 100% collateral, some off-chain | Mixed quality or newer protocols | Periodic custodian attestation |
| **4** | Partially collateralized or custodial | Lower-quality or illiquid assets | Opaque or infrequent reporting |
| **5** | Uncollateralized or unverifiable (CRITICAL GATE) | Unknown or very high-risk assets | No verification possible |

**Score: 2.0/5** — Over-collateralized onchain at ~135.6% CR with verifiable PoolManager accounting, and supply reconciles exactly against pool debt. Collateral is two high-quality assets, wstETH (~$8.71M) and WBTC (~$78.33M), which keeps it in the blue-chip band. Three factors prevent a better score: the mix is ~90% WBTC so solvency is effectively a single-asset bet; both active pools are only about 4–5% of collateral-price downside from the 130% Stability Mode trigger absent deleveraging; and a non-timelocked `ASSET_MANAGER_ROLE` path could relocate the wstETH leg into Aave Prime. The `isUnderCollateral` flag is triggered by a legacy V1 market with negligible remaining value (~$8.1K, 79.3% CR), not the active V2 system.

**Subcategory B: Provability**

| Score | Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|-------|---------------------|--------------------|-----------------------|
| **1** | Fully onchain, anyone can verify | Programmatic, real-time | Multiple verification sources |
| **2** | Mostly onchain, some off-chain | onchain with periodic updates | Single reliable source |
| **3** | Hybrid onchain/off-chain | Manual reporting by admins | Known custodian attestation |
| **4** | Primarily off-chain | Infrequent reporting | Self-reported only |
| **5** | Opaque, cannot verify | No reporting | No verification |

**Score: 1.5/5** — Fully on-chain reserves with programmatic real-time NAV calculation. Multiple oracle sources (Chainlink + Uniswap + Curve) support price verification. Anyone can query PoolManager accounting and token balances, and the supply-versus-pool-debt reconciliation closes to 264 fxUSD of known legacy issuance. Holder distribution is independently verifiable. No off-chain components back canonical Ethereum fxUSD; the Base representation is exactly matched by adapter escrow.

**Funds Management Score = (2.0 + 1.5) / 2 = 1.75**

**Score: 1.75/5** — Strong on-chain collateralization and provability.

#### Category 4: Liquidity Risk (Weight: 15%)

| Score | Exit Mechanism | Liquidity Depth | Large Holder Impact |
|-------|---------------|----------------|---------------------|
| **1** | Direct 1:1 redemption, instant | >$10M, <0.5% slippage | Full exit with <0.5% impact |
| **2** | Direct redemption with minor delays | >$5M, <1% slippage | Exit with <1% impact over 1-3 days |
| **3** | Market-based or short queues | >$1M, 1-3% slippage | 3-7 days for full exit |
| **4** | Withdrawal queues or restrictions | <$1M, >3% slippage | >1 week or >10% impact |
| **5** | No clear exit mechanism | No liquidity | Cannot exit without massive losses |

**Score: 3.0/5** — The primary Curve pool holds ~$7.52M and current onchain quotes show strong execution: ~0% impact at 500K–1M size and about 0.26% at 4M. The recovered 10.65% Stability Pool USDC buffer also gives fxSP exits a meaningful liquid component. A score better than 3 is not justified because direct collateral redemption remains disabled at par, 89.35% of supply is concentrated in the Stability Pool, and most of a mass fxSAVE exit would still return fxUSD to a market whose USDC side is only ~$4.47M. Secondary pools add ~$1.94M but introduce other stablecoin risk and a second hop. The unverified $0.953 aggregator ATL is excluded.

**Score: 3.0/5** — Strong current Curve execution and a recovered USDC buffer, offset by depeg-gated redemption and high supply concentration relative to external exit capacity.

#### Category 5: Operational Risk (Weight: 5%)

| Score | Team Transparency | Documentation | Legal/Compliance |
|-------|------------------|---------------|-----------------|
| **1** | Fully doxxed or well-known, established reputation | Excellent, comprehensive | Clear legal structure |
| **2** | Mostly public or known anons | Good, mostly complete | Established entity |
| **3** | Mixed unknown and known anons | Adequate, some gaps | Uncertain structure |
| **4** | Mostly unknown, limited info | Poor or outdated | No clear legal entity |
| **5** | Fully unknown, no reputation | No documentation | No legal structure |

**Score: 2.5/5** — The current core team is partially doxxed and mostly semi-anonymous. AladdinDAO has established contributors and institutional backing, but those AladdinDAO-level relationships are not treated as direct f(x) team membership. Documentation is good and comprehensive, and the published fee schedule matches onchain values. Legal structure is DAO-based with uncertain formal entity status. Onchain governance is effectively dormant — the last Snapshot proposal was FIP-30 on February 4, 2026 — so day-to-day authority rests with the multisig rather than token holders.

**Score: 2.5/5** — Good team reputation and documentation, but DAO structure with uncertain legal entity and dormant voting.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.75 | 20% | 0.35 |
| Centralization & Control | 2.5 | 30% | 0.75 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **2.20** |

**Optional Modifiers:**
- Protocol live >2 years with no incidents: **-0.5** → Does not fully apply due to ChainSecurity vulnerability disclosure (though no exploitation occurred). Not applied.
- TVL maintained >$500M for >1 year: Not applicable

**Final Score: 2.2/5.0** — The active $500K bounty, recovered 10.65% Stability Pool USDC buffer and strong current Curve execution support reducing Liquidity from 3.5 to 3.0. V2 CR has meanwhile fallen to ~135.6%, oracle ownership remains outside the timelock, redemption is depeg-gated, 89.35% of supply is concentrated in the Stability Pool, and Base fxUSD adds a bounded LayerZero route. The unsupported $0.953 print is not used in the score.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | ***Low Risk*** | ***Approved with standard monitoring*** |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Low Risk — Approved with standard monitoring**

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (January 2027)
- **TVL-based**: Reassess if TVL changes by more than 50%, or sustains above $150M for >1 month
- **Incident-based**: Reassess after any exploit, governance change, or collateral modification
- **Oracle ownership (highest priority)**: Reassess when the pending `acceptOwnership()` batch `0x0ac451c6…86dd0` executes and both price oracles come under the TimelockController — this would justify revisiting the Governance subcategory (3.0 → ~2.5). Reassess immediately if either oracle's `owner()` changes to anything other than the timelock, or if `maxPriceDeviation` / `onchainSpotEncodings` are modified.
- **Governance**: Reassess if the timelock delay is reduced, ProxyAdmin ownership or any core `DEFAULT_ADMIN_ROLE` moves away from the TimelockController, or if multisig threshold is lowered
- **Collateralization**: Reassess if system CR falls below 135%, or if the xWBTC pool CR falls below 132%
- **Collateral custody**: Reassess if `manage()` is called on the PoolManager or Stability Pool and material balances move into the Aave strategies
- **Liquidity**: Reassess if the primary Curve USDC/fxUSD pool falls below $5M, or if fxSP's share of fxUSD supply exceeds 95%
- **Peg deviation**: Reassess if fxUSD trades below $0.95 for more than 24 hours, or if `PegKeeper.isRedeemAllowed()` turns `true` (indicating the Curve EMA has broken $0.998)
- **Bridge**: Reassess if LayerZero peers, receive libraries or DVN quorum change; if Base supply differs from Ethereum adapter escrow; or if either bridge-owner Safe changes threshold/ownership

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| March 29, 2026 | 2.5 | Initial assessment |
| May 13, 2026 | 2.2 | Reassessment: 3-day TimelockController took ownership of ProxyAdmin (April 20, 2026); supply ~18.1M → ~53.9M, TVL ~$29M → ~$89M. Governance 4.0 → 2.5, Historical Track Record 2.5 → 2.0; Medium → Low Risk |
| [August 15, 2026](https://github.com/yearn/risk-score/pull/352) | 2.2 | Reassessment and [issue #387](https://github.com/yearn/risk-score/issues/387) corrections (latest snapshot block 25,759,914): supply ~64.31M, TVL ~$96.8M, V2 CR ~135.6%, and primary Curve liquidity ~$7.52M. Verified the timelock holds `DEFAULT_ADMIN_ROLE` on all core contracts and was honored by the May 27–30 `updatePoolCapacity` operation, but both live price oracles remain owned by the operational 6-of-9 Safe; their scheduled ownership-transfer batch has been executable since April 23, 2026 but remains unexecuted, leaving a non-timelocked collateral-repricing path. Redemption remains Curve-EMA-gated and disabled, with its 20%-per-tick-per-call behavior clarified. Corrected active V2 collateral to wstETH/WBTC only, removed the uncorroborated $0.953 depeg, documented the $500K AladdinDAO bounty, corrected AladdinDAO-level contributor/backer attribution, and added the LayerZero Ethereum↔Base lock route with its route-specific DVN quorum. The Stability Pool USDC buffer recovered from 0.16% to ~10.65%, and snapshot-block Curve quotes show ~0.26% impact for a 4M fxUSD exit. Governance 2.5 → 3.0; Liquidity ultimately remains 3.0; final score remains Low Risk. |
