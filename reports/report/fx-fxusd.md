# Protocol Risk Assessment: f(x) Protocol — fxUSD

- **Assessment Date:** May 13, 2026 (Updated: July 27, 2026)
- **Token:** fxUSD (f(x) USD)
- **Chain:** Ethereum
- **Token Address:** [`0x085780639CC2cACd35E474e71f4d000e2405d8f6`](https://etherscan.io/address/0x085780639CC2cACd35E474e71f4d000e2405d8f6)
- **Final Score: 2.3/5.0**

## Overview + Links

fxUSD is a **decentralized stablecoin** issued by the f(x) Protocol (built by AladdinDAO) that maintains its USD peg through a dual-token system splitting yield-bearing collateral into a stable component (fxUSD) and leveraged components (xPOSITION/sPOSITION). The protocol accepts ETH LSTs (wstETH, sfrxETH, weETH, ezETH) and WBTC as collateral, enabling users to mint fxUSD at 0% ongoing interest through the fxMINT product, or to take leveraged long/short positions.

**Key mechanism — the f(x) Invariant:**
The current V2 invariant balances all position types: `Collateral - Borrowed Collateral = fxUSD (Long) + fxUSD (Short) + xPOSITION + sPOSITION`. Collateral (ETH LSTs, WBTC) is split into a stable component (fxUSD) and leveraged components — xPOSITIONs (leveraged longs) absorb upward volatility while sPOSITIONs (leveraged shorts) borrow collateral against fxUSD. When prices fluctuate, the leveraged positions absorb volatility, keeping fxUSD stable. The system supports up to ~7x leverage on ETH/BTC.

**Yearn use cases (from issue #116):**
1. **yvBTC vault strategies** — deposit BTC collateral and borrow fxUSD via fxMINT at 0% annual interest (one-time ~0.5% fee)
2. **fxUSD vault** — similar to existing crvUSD and BOLD vaults, enabling treasury diversification into DeFi-native stablecoins

**Key metrics (July 27, 2026, block 25,625,134):**

- **fxUSD Total Supply:** ~64,232,612 fxUSD
- **fxUSD NAV:** ~$0.9982 (Curve EMA ~$1.0000)
- **Protocol TVL (DeFi Llama):** ~$94.9M (peak last 60 days: $96.9M on July 22, 2026; all-time peak $271M on August 24, 2025)
- **System collateralization:** ~142.6% (~$91.45M collateral vs ~$64.12M fxUSD debt)
- **fxUSD DEX Liquidity:** ~$7.17M in primary Curve USDC/fxUSD pool (~$2.8M across six secondary Curve pools)
- **fxSAVE Total Assets:** ~55.76M fxSP (~$56.3M), 96.6% of the Stability Pool
- **fxMINT Opening Fee:** 0.5% (ETH/BTC) | Closing Fee: 0.2%
- **Launch Date:** February 23, 2024 (~2.4 years in production)

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

In V2, **all position collateral is custodied by the PoolManager contract** — individual pool contracts (xstETH, xWBTC) are accounting/NFT contracts only and hold zero tokens.

| Contract | Address | Role |
|----------|---------|------|
| PoolManager (Long) | [`0x250893CA4Ba5d05626C785e8da758026928FCD24`](https://etherscan.io/address/0x250893CA4Ba5d05626C785e8da758026928FCD24) | Custodies all V2 collateral, manages xPOSITION/fxMINT |
| ShortPoolManager | [`0xaCDc0AB51178d0Ae8F70c1EAd7d3cF5421FDd66D`](https://etherscan.io/address/0xaCDc0AB51178d0Ae8F70c1EAd7d3cF5421FDd66D) | Manages sPOSITION positions (borrows collateral from PoolManager) |

**Collateral held in PoolManager (July 27, 2026):**

| Asset | Amount | USD Value | Pool debt | Pool CR |
|-------|--------|-----------|-----------|---------|
| wstETH (xstETH pool [`0x6ecfa38fee8a5277b91efda204c235814f0122e8`](https://etherscan.io/address/0x6ecfa38fee8a5277b91efda204c235814f0122e8)) | ~4,656.51 wstETH | ~$11.16M | ~6,456,822 fxUSD | ~174% |
| WBTC (xWBTC pool [`0xab709e26fa6b0a30c119d8c55b887ded24952473`](https://etherscan.io/address/0xab709e26fa6b0a30c119d8c55b887ded24952473)) | ~1,242.66 WBTC | ~$80.29M | ~57,775,526 fxUSD | ~139% |
| **Total** | | **~$91.45M** | **~64,232,348 fxUSD** | |

**Overall V2 collateralization ratio: ~142.6%** (~$91.45M collateral / ~$64.12M fxUSD debt at NAV $0.9982). Prices from Chainlink: BTC $64,610.09; ETH $1,932.90; wstETH/stETH ratio 1.240322. The WBTC pool carries ~90% of system debt, so its ~139% CR effectively sets the system's headroom above the 130% Stability Mode trigger.

**Supply reconciliation:** total supply 64,232,611.87 fxUSD less V2 pool debt 64,232,347.81 leaves 264.06 fxUSD of legacy V1 issuance — the two figures reconcile exactly, confirming that no fxUSD exists outside the V2 pools and the residual V1 markets.

**Short leg:** sPOSITIONs post fxUSD as collateral in the ShortPoolManager and borrow collateral out of the PoolManager. Two short pools are registered — f(x) stETH Short [`0x25707b9e6690b52c60ae6744d711cf9c1dfc1876`](https://etherscan.io/address/0x25707b9e6690b52c60ae6744d711cf9c1dfc1876) (75,206 fxUSD collateral, 21.05 wstETH borrowed) and f(x) WBTC Short [`0xa0cc8162c523998856d59065faa254f87d20a5b0`](https://etherscan.io/address/0xa0cc8162c523998856d59065faa254f87d20a5b0) (215,796 fxUSD collateral, 1.91 WBTC borrowed). Borrowed collateral is capped at 50% of each long pool's balance (`shortBorrowCapacityRatio` = 5e17) and accounts for the small gap between the PoolManager's token balance and its internal `collateralBalance`.

**Note:** `fxUSD.isUnderCollateral()` returns `true` — this flag reflects legacy V1 market status (wstETH treasury at 78.6% CR with only ~$8.3K remaining). The V2 system via PoolManager maintains ~142.6% collateralization.

### Legacy V1 Treasury Contracts (Minimal Remaining Value)

| Treasury | Address | Base Token | Remaining Value |
|----------|---------|------------|----------------|
| stETH Treasury | [`0xED803540037B0ae069c93420F89Cd653B6e3Df1f`](https://etherscan.io/address/0xED803540037B0ae069c93420F89Cd653B6e3Df1f) | wstETH | ~$8.3K (3.47 wstETH, 78.6% CR, ~264 legacy fxUSD) |
| sfrxETH Treasury | [`0xcfEEfF214b256063110d3236ea12Db49d2dF2359`](https://etherscan.io/address/0xcfEEfF214b256063110d3236ea12Db49d2dF2359) | sfrxETH | ~$133K (59.24 sfrxETH, ~11,132% CR) |

### Reserve Pool

| Contract | Address | Holdings |
|----------|---------|----------|
| Reserve Pool | [`0xE93F5DD55eC9bdAbbba5eA88E4b4f3C253ee45Ed`](https://etherscan.io/address/0xE93F5DD55eC9bdAbbba5eA88E4b4f3C253ee45Ed) | 17.73 wstETH (~$43K) + 0.43 WBTC (~$27K) + 1,302 fxUSD — ~$71K total, ~0.1% of debt |

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
| fxSP (Stability Pool) | [`0x65C9A641afCEB9C0E6034e558A319488FA0FA3be`](https://etherscan.io/address/0x65C9A641afCEB9C0E6034e558A319488FA0FA3be) | Holds fxUSD + USDC for peg maintenance; 58,225,808 fxUSD + 94,254 USDC (~$58.2M) |
| fxSAVE | [`0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39`](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) | Auto-compounding fxSP vault; 55.76M fxSP (~$56.3M), 96.6% of fxSP |

### Governance

| Contract | Address | Configuration |
|----------|---------|---------------|
| Operational Multisig | [`0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`](https://etherscan.io/address/0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF) | 6-of-9 Gnosis Safe (v1.3.0), 678 nonce |
| Emergency Multisig | [`0x28c921adAC4c1072658eB01a28DA06b5F651eF62`](https://etherscan.io/address/0x28c921adAC4c1072658eB01a28DA06b5F651eF62) | 3-of-4 Gnosis Safe (emergency pause), 427 nonce |

### DEX Liquidity Pools

| Pool | Address | Composition |
|------|---------|-------------|
| Curve USDC/fxUSD | [`0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) | ~$7.17M (3.63M USDC + 3.54M fxUSD, 50.7/49.3) — also the EMA source that gates minting and redemption |
| Curve msUSD/fxUSD | [`0x138Bb0f3208bd729a561F3786DDb97BBc69e6628`](https://etherscan.io/address/0x138Bb0f3208bd729a561F3786DDb97BBc69e6628) | ~$1.13M (937K msUSD + 197K fxUSD) |
| Curve USDnr/fxUSD | [`0x3204d754a3003cEc155e2D8F44b3b48eD60b7Cc6`](https://etherscan.io/address/0x3204d754a3003cEc155e2D8F44b3b48eD60b7Cc6) | ~$0.54M (195K USDnr + 340K fxUSD) |
| Curve reUSD/fxUSD | [`0xb0ef04ACE97d350E24Efa5139d2590D26a61A8Dc`](https://etherscan.io/address/0xb0ef04ACE97d350E24Efa5139d2590D26a61A8Dc) | ~$0.53M (374K reUSD + 152K fxUSD) |
| Curve fxUSD/frxUSD | [`0x851907CAC684797eee43669798D78004e269Cb5E`](https://etherscan.io/address/0x851907CAC684797eee43669798D78004e269Cb5E) | ~$0.25M (120K fxUSD + 126K frxUSD) |
| Curve alUSD/fxUSD | [`0x27cB9629aE3Ee05cb266B99cA4124EC999303c9D`](https://etherscan.io/address/0x27cB9629aE3Ee05cb266B99cA4124EC999303c9D) | ~$0.22M (185K alUSD + 30K fxUSD) |
| Curve GHO/fxUSD | [`0x74345504Eaea3D9408fC69Ae7EB2d14095643c5b`](https://etherscan.io/address/0x74345504Eaea3D9408fC69Ae7EB2d14095643c5b) | ~$0.13M (97K GHO + 32K fxUSD) |
| Curve DeFi Stable Avengers | [`0x8B878AFE454e31CF0A79c6D7cf2f077DD286C12f`](https://etherscan.io/address/0x8B878AFE454e31CF0A79c6D7cf2f077DD286C12f) | ~$6.2K of fxUSD — effectively drained |

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

No bug bounty program was found on Immunefi, Code4rena, Sherlock, or other major platforms. The protocol is **not** registered with SEAL Safe Harbor. Despite the extensive audit history, the absence of a bug bounty program is a notable gap.

**Notable vulnerability:** In April 2025, ChainSecurity responsibly disclosed a double flash loan vulnerability that could have resulted in >$2M in losses. The f(x) team promptly fixed it by removing the Balancer V2 flash loan integration. This was caught through external research, not through a bug bounty program.

## Historical Track Record

- **In production since:** February 23, 2024 (~29 months as of July 2026)
- **Current TVL:** ~$94.9M (DeFi Llama); ~$91.45M collateral backing ~$64.12M fxUSD debt in PoolManager
- **TVL history:** Spent 182 days above $100M between May–November 2025; all-time peak $271M on August 24, 2025. Last 90 days ranged $66.9M (May 2, 2026) to $96.9M (July 22, 2026), with a shallow drawdown to $71.6M on July 1, 2026 before recovering.
- **fxUSD supply:** ~64.2M, up from ~18.1M in March 2026 — the growth has come almost entirely from the WBTC leg, which now carries ~90% of system debt
- **Peg stability:** fxUSD has generally maintained its peg, with an ATL of $0.953 on December 5, 2024. Current NAV ~$0.9982; Curve EMA ~$1.0000
- **Security incidents:** One responsibly disclosed vulnerability (ChainSecurity, April 2025) — no exploits or fund losses
- **Governance events:** ProxyAdmin ownership moved to a 3-day TimelockController on April 20, 2026 (block 24,920,358, tx [`0xeb7c71fc…8b9fd8`](https://etherscan.io/tx/0xeb7c71fc855cd928bb4b300eaf7cc5e8b0ad86b625a109f3308b0552068b9fd8)). The last proxy upgrade of any core contract was on April 20, 2026, immediately *before* that transfer; no proxy has been upgraded since the timelock took control.
- **Holder concentration:** 916 holders. The Stability Pool holds 58,225,808 fxUSD — **90.65% of total supply** — of which fxSAVE owns 96.6%. The Curve USDC/fxUSD pool holds a further 5.5%. Fewer than 4% of fxUSD is held outside protocol-owned or DEX contracts ([Blockscout holders](https://eth.blockscout.com/token/0x085780639CC2cACd35E474e71f4d000e2405d8f6?tab=holders)).

The protocol has operated for over 2 years with no exploits or fund losses. The December 2024 ATL of $0.953 (~4.7% deviation) is notable but represents a relatively mild depeg for a DeFi stablecoin. TVL scaled from launch to a sustained $100M+ band in mid-2025 and sits in the $90–$95M range.

## Funds Management

In V2, all fxUSD position collateral is custodied by the PoolManager contract ([`0x250893CA4Ba5d05626C785e8da758026928FCD24`](https://etherscan.io/address/0x250893CA4Ba5d05626C785e8da758026928FCD24)), which currently holds ~4,656.51 wstETH (~$11.16M) and ~1,242.66 WBTC (~$80.29M) — totaling ~$91.45M backing ~$64.12M fxUSD debt (**~142.6% CR**). No collateral is deployed to external protocols today, but that is a discretionary state rather than an architectural guarantee: the PoolManager has a live `allocations` entry pointing wstETH at an AaveV3Strategy ([`0xFd3A6540e21D0E285f88FBFd904883B23e08F5C8`](https://etherscan.io/address/0xFd3A6540e21D0E285f88FBFd904883B23e08F5C8)) with a 100,000 wstETH capacity — roughly 21x the current wstETH balance — and any ASSET_MANAGER_ROLE holder can push collateral into it without a timelock (see *Centralization & Control Risks*). The strategy currently holds 0 wstETH. The Stability Pool has an equivalent USDC path into an AaveV3CompoundStrategy ([`0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f`](https://etherscan.io/address/0xd023Aac0e2D46c93d4c6e8e2A449bF2d4687804f), 100M USDC capacity) which holds ~19 USDC — actual Aave exposure across the protocol is negligible.

### Accessibility

- **Who can mint:** Anyone can mint fxUSD by depositing collateral (wstETH, WBTC in V2) through fxMINT or by opening xPOSITION/sPOSITION positions. No whitelist required.
- **Minting mechanism:** Atomic in a single transaction via flash loans. Users deposit collateral, fxUSD is minted proportional to their leverage/debt position.
- **Redemption is conditional, not always-on.** `PegKeeper.isRedeemAllowed()` returns `true` only while the Curve USDC/fxUSD EMA is **below** the `priceThreshold` of $0.998 ([PegKeeper implementation](https://etherscan.io/address/0x17e2e8ca0b35aa750771e000d1e926417b97f29d#code)). The EMA is currently ~$1.0000, so redemption is **disabled** and `isBorrowAllowed()` is `true`. The mechanism is a depeg backstop that establishes a floor near $0.995 (redeeming $1 of collateral less a 0.5% fee, `getRedeemFeeRatio()` = 5e6/1e9); it is not an exit route available at par.
- **Fees:** Opening fee: 0.5% of minted debt (fxMINT), 0.3% (xPOSITION/sPOSITION). Closing fee: 0.2% (fxMINT), 0.1% (xPOSITION/sPOSITION). 0% ongoing annual interest for fxMINT. Onchain: redeem fee 0.5%, flash-loan fee 0.01%, liquidation expense ratio 10%, harvester ratio 0.1%.
- **Rate limits:** Maximum concurrent redemption is 20% of xPOSITION per tick (`getMaxRedeemRatioPerTick()` = 2e8/1e9), highest leverage first.

### Collateralization

- **Fully collateralized onchain** by crypto-native assets held in the PoolManager: wstETH (~$11.16M) and WBTC (~$80.29M)
- **Over-collateralization:** The V2 system maintains ~142.6% CR (~$91.45M collateral backing ~$64.12M fxUSD debt), equivalent to ~70% aggregate LTV against a per-position rebalance trigger at 88% LTV. The system requires >100% CR; Stability Mode triggers protective measures at CR <130%. The buffer is thinner than the design's headline figures suggest: the xWBTC pool carries ~90% of debt at ~139% CR, so a further ~9% BTC drawdown with no deleveraging would put the dominant pool at the Stability Mode threshold. Note: `fxUSD.isUnderCollateral()` currently returns `true` due to the legacy V1 wstETH market (78.6% CR with only ~$8.3K remaining) — the V2 PoolManager system is healthy at ~142.6%.
- **Collateral quality:** wstETH (Lido) and WBTC — blue-chip DeFi assets with deep liquidity. V2 concentrates collateral in two high-quality assets rather than the V1 approach of 6+ collateral types, but the mix is now heavily skewed: WBTC is ~88% of collateral value and backs ~90% of debt, so system solvency tracks BTC far more than ETH.
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
- **Stable buffer is effectively empty.** The Stability Pool holds 58,225,808 fxUSD against 94,254 USDC — the stable leg is **0.16%** of pool value, far below the 5% Funding Level I threshold. Layer 2 (the peg keeper buying fxUSD with USDC) therefore has almost no ammunition; the practical defenses today are the funding-cost levies on xPOSITIONs and, if the EMA breaks $0.998, redemption.
- **Risk curation:** Governance-adjustable parameters include LTV thresholds, fees, oracle deviations, and collateral caps

### Provability

- **Reserves fully verifiable on-chain** — all collateral sits in treasury contracts readable by anyone
- **Exchange rate / NAV:** Computed on-chain algorithmically via the f(x) invariant formula. No off-chain inputs for NAV calculation.
- **Oracle system:** Multi-source design:
  - **stETH/USD:** Chainlink ETH/USD + Uniswap V3 USDC/ETH (0.05% and 0.3% pools) + Curve stETH/ETH EMA + Uniswap V3 stETH/ETH. 1% deviation threshold.
  - **WBTC/USD:** Chainlink BTC/USD + Chainlink WBTC/BTC + Uniswap V3 pools (WBTC/USDC, WBTC/ETH, USDC/ETH). 2% deviation threshold.
- **Admin minting:** The fxUSD contract is upgradeable (TransparentUpgradeableProxy, implementation `FxUSDRegeneracy` [`0xf729422D68c2cf00574fb5712972454cf402A9b1`](https://etherscan.io/address/0xf729422d68c2cf00574fb5712972454cf402a9b1), last upgraded February 17, 2026). ProxyAdmin is owned by the TimelockController, so any upgrade that introduced unbacked minting would be visible for 3 days before it could execute. Under the current implementation, fxUSD can only be minted against collateral through the PoolManager and ShortPoolManager.
- **`isUnderCollateral` flag:** The fxUSD contract currently reports `isUnderCollateral() = true` due to a legacy V1 wstETH market with 78.6% CR (~$8.3K remaining, negligible). The active V2 system holds ~$91.45M collateral against ~$64.12M fxUSD debt (~142.6% CR).
- **No third-party verification** (no Chainlink PoR or custodian attestation needed — all on-chain)

## Liquidity Risk

- **Primary liquidity:** Curve USDC/fxUSD pool at ~$7.17M with balanced composition (~50.7% USDC, ~49.3% fxUSD). This single pool is doing double duty — it is both the main exit venue and the EMA price source that the PegKeeper uses to gate minting, redemption and funding costs.
- **Secondary pools:** Six smaller Curve pools totalling ~$2.8M (msUSD ~$1.13M, USDnr ~$0.54M, reUSD ~$0.53M, frxUSD ~$0.25M, alUSD ~$0.22M, GHO ~$0.13M), plus a DeFi Stable Avengers pool now down to ~$6.2K of fxUSD. Every one of these pairs fxUSD against another non-USDC stablecoin, so exiting to a liquid asset requires a second hop.
- **Redemption mechanism:** Direct 1:1 redemption for underlying collateral (wstETH/WBTC) with 0.5% fee, capped at 20% of xPOSITION per tick — **but only enabled while the Curve EMA is below $0.998**. It is currently disabled and cannot be relied on as an exit at par.
- **Stability Pool exits:** 1% instant-redeem fee (`instantRedeemFeeRatio` = 1e16), or fee-free after a 60-minute cooldown (`redeemCoolDownPeriod` = 3600s). Redemptions pay out pro-rata in the pool's assets, which are 99.84% fxUSD — so fxSAVE/fxSP holders exit *into* fxUSD and must then sell it, converging on the same Curve pool.
- **Slippage analysis:** With ~$7.17M in the primary Curve pool, a $500K swap experiences moderate slippage and a $1M+ exit is materially impactful. Because redemption is gated on a depeg, there is no guaranteed alternative route for a large holder wanting out while fxUSD is trading at par.
- **Historical liquidity during stress:** The December 2024 depeg to $0.953 suggests that liquidity was somewhat thin during that period, though the peg recovered.
- **Structural concentration:** 90.65% of fxUSD supply sits in the Stability Pool, 96.6% of which is owned by fxSAVE. Demand for fxUSD is therefore overwhelmingly protocol-internal yield-seeking rather than external usage, and a coordinated fxSAVE exit would funnel through the ~$7.17M Curve pool. Primary DEX depth is only ~11.2% of supply, and it has not kept pace with issuance — supply is ~3.5x its March 2026 level while the primary pool is roughly flat.

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

**Non-timelocked asset-management path.** `ASSET_MANAGER_ROLE` on both the PoolManager and the Stability Pool is held by the 6/9 multisig, the 3/4 emergency multisig and the timelock. That role's `manage(asset, amount)` moves funds into the already-configured strategy up to its capacity. Choosing the strategy (`alloc`) is `DEFAULT_ADMIN_ROLE` and therefore timelocked, which bounds the destination — but the configured wstETH capacity (100,000 wstETH) exceeds the entire wstETH collateral balance by ~21x, so either multisig could move the whole ETH collateral leg into Aave Prime without delay.

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
- **Curve:** stETH/ETH EMA oracle, plus the USDC/fxUSD pool [`0x5018BE88…FB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) whose `price_oracle(0)` EMA is a **hard control input**, not just monitoring: it decides whether minting is allowed, whether redemption is allowed, and whether funding costs are levied. A single ~$7.17M pool therefore gates the protocol's core user operations.
- **Aave:** allocation paths are configured for Stability Pool USDC (100M capacity) and PoolManager wstETH (100,000 wstETH capacity), but ~19 USDC and 0 wstETH are actually deployed — current Aave exposure is negligible while the capacity to create it without a timelock remains.
- **Lido:** wstETH is the ETH collateral leg in V2 (~$11.16M, ~12% of collateral)
- **LayerZero:** **Not a fxUSD dependency** (re-verified July 27, 2026). f(x) uses LayerZero `ProxyOFT` for *other* tokens (fETH, xETH, FXN, arUSD), but **fxUSD itself is not bridged**: the docs list fxUSD with a single Ethereum address and no bridging entry, [DeFiLlama](https://api.llama.fi/protocol/fx-protocol) reports f(x) Protocol on Ethereum only, fxUSD is not a native OFT (`endpoint()` and `oftVersion()` revert on [`0x0857…d8f6`](https://etherscan.io/address/0x085780639CC2cACd35E474e71f4d000e2405d8f6)), it is absent from [LayerZero's OFT registry](https://metadata.layerzero-api.com/v1/metadata/experiment/ofts/list), it has no Chainlink CCIP token pool (`TokenAdminRegistry.getPool` returns the zero address), and no contract exists at the same address on Base.

- **Katana deployments are locally issued, not identified bridge representations.** Two `fxUSD` / "f(x) USD" ERC-20s exist on Katana ([`0x4c03…FDF9`](https://explorer.katanarpc.com/address/0x4c03ff0f44A55e7098a09016E02a01d3cdC2FDF9), supply ~12,024; [`0x1364…9f86`](https://explorer.katanarpc.com/address/0x1364b238C668A2dec1294174e4798E8c09979f86), supply ~1,000,018). Each token exposes a local `poolManager()` (`0x27b3…f96a` and `0xFae3…3C68`, respectively), and each PoolManager's `fxUSD()` points back to its corresponding token. The verified `0x1364…9f86` implementation restricts minting to its PoolManager; local mint events, including a 10,000-token genesis mint for `0x4c03…FDF9`, corroborate local issuance. Neither token is a LayerZero OFT (`endpoint()` reverts), and neither is the canonical AggLayer/LxLy wrapper of mainnet fxUSD (`PolygonZkEVMBridgeV2.getTokenWrappedAddress(0, fxUSD)` returns the zero address on Katana). Both supplies are essentially static since the May 2026 check. This positive architecture evidence does not reveal a bridge path from Ethereum fxUSD to either Katana deployment. Because the `0x4c03…FDF9` implementation is not source-verified, a separate custom conversion path cannot be ruled out absolutely; reassess if one is identified rather than inferring a bridge from the shared name and symbol.

The protocol depends on multiple well-established DeFi protocols. Chainlink is the most critical dependency — oracle failure would impair pricing and liquidations. Aave exposure is capped and non-critical to core fxUSD backing.

## Operational Risk

- **Team transparency:** AladdinDAO was launched by 14 founding contributors including well-known figures: Sharlyn Wu (former CIO of Huobi), Robert Leshner (Compound founder), Kain Warwick (Synthetix founder), Hart Lambur (UMA co-founder). Core development team (~12) and boule members (~30) are partially doxxed.
- **Institutional backers:** Polychain Capital, Digital Currency Group, 1kx, Multicoin Capital, CMS, Nascent, Alameda Research, DeFi Alliance
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
| Stability Pool (fxSP) | [`0x65C9A641afCEB9C0E6034e558A319488FA0FA3be`](https://etherscan.io/address/0x65C9A641afCEB9C0E6034e558A319488FA0FA3be) | USDC balance (currently 0.16% of pool, already below the 5% threshold), deposit/withdrawal flows, `alloc`/`manage` calls |
| fxSAVE | [`0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39`](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) | Total assets, exchange rate changes |
| PegKeeper | [`0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70`](https://etherscan.io/address/0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70) | Peg maintenance events, funding level triggers |
| Curve USDC/fxUSD | [`0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) | Pool balance ratio, large swaps |

### Critical Events & Thresholds

| Event | Threshold | Action |
|-------|-----------|--------|
| fxUSD NAV deviation | >2% from $1.00 | Immediate alert |
| Curve EMA price | <$0.998 | Enhanced protection mode: minting disabled, redemption enabled, funding costs levied |
| Stability Pool USDC ratio | <5% of pool | Funding Level I activates — **currently triggered at 0.16%** |
| Collateral Ratio (xWBTC pool) | <130% | Stability Mode — enhanced monitoring (currently ~139%) |
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
│  │ wstETH: 4,656.51 (~$11.16M) via xstETH pool          │       │
│  │ WBTC:   1,242.66 (~$80.29M) via xWBTC pool            │       │
│  │ Total: ~$91.45M backing ~$64.12M fxUSD (~142.6% CR)  │       │
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
│  ┌───────────┐                                                  │
│  │ Lido      │                                                  │
│  │ (wstETH)  │                                                  │
│  └───────────┘                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Trust boundaries:**
- The 6/9 multisig has full upgrade authority over all protocol contracts *and* `DEFAULT_ADMIN_ROLE`-gated parameters, but both are subject to a 3-day timelock (as of April 20, 2026) — this is the primary trust boundary
- **Outside the timelock:** the 6/9 multisig owns both price oracles directly and can change deviation bounds and spot-price sources instantly; both multisigs hold `EMERGENCY_ROLE` (pause) and `ASSET_MANAGER_ROLE` (fund the configured Aave strategies) with no delay
- The 3/4 emergency multisig can pause position operations immediately but cannot upgrade contracts
- Timelock execution is permissionless (`EXECUTOR_ROLE` granted to `address(0)`); only proposing and cancelling are multisig-gated
- Keepers are permissionless (anyone can trigger rebalancing/liquidation for bounties)
- Oracle data flows from Chainlink + Uniswap/Curve and is validated with deviation thresholds — but the thresholds themselves are owner-settable outside the timelock

---

## Risk Summary

### Key Strengths

- **Extensive audit history:** 21 audits from 3 firms (Secbit, Trail of Bits, OpenZeppelin) with continuous coverage since 2023
- **3-day timelock covers upgrades *and* core parameters** (since April 20, 2026), verified honored in practice on the May 27–30, 2026 `updatePoolCapacity` operation; timelock execution is permissionless
- **Reserves reconcile exactly:** total supply less V2 pool debt leaves 264 fxUSD of legacy issuance, confirming no unaccounted fxUSD
- **Innovative peg mechanism:** 5-layer peg protection with onchain redemption as a floor near $0.995 during a depeg
- **Fully onchain collateral:** All reserves verifiable in the PoolManager, NAV calculated algorithmically
- **Strong team backing:** Well-known DeFi founders (Leshner, Warwick, Lambur) as founding contributors, institutional backing from Polychain, DCG, 1kx
- **2+ years in production** with no exploits or fund losses; TVL has scaled from launch to a sustained $100M+ band in mid-2025

### Key Risks

- **Price oracles are outside the timelock.** The 6/9 multisig still owns both live oracles and can widen the deviation bound and repoint spot sources in a single transaction, producing an arbitrary liquidation price. The transfer to the timelock has been scheduled and executable since April 23, 2026 but remains unexecuted.
- **Collateral is concentrated in BTC and the buffer has narrowed.** WBTC is ~88% of collateral and backs ~90% of debt at ~139% CR; system CR is ~142.6% against a 130% Stability Mode trigger.
- **Redemption is not an always-available exit.** It unlocks only when the Curve EMA falls below $0.998, so a large holder cannot rely on it while fxUSD trades at par.
- **Peg-defense stable buffer is depleted:** the Stability Pool holds 0.16% USDC against a 5% Funding Level I threshold.
- **Extreme structural concentration:** 90.65% of fxUSD sits in the Stability Pool (96.6% of that owned by fxSAVE), with only ~$7.17M of primary DEX depth (~11.2% of supply) as the shared exit
- **Non-timelocked asset-management and pause authority:** both multisigs hold `ASSET_MANAGER_ROLE` (100,000 wstETH Aave capacity vs ~4,657 wstETH held) and `EMERGENCY_ROLE`.
- **No bug bounty program** despite complex contract architecture and a previously discovered vulnerability
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

**Score: 1.5/5** — 21 audits from Secbit, Trail of Bits, and OpenZeppelin (top firms) is exceptional audit coverage. However, the lack of any bug bounty program despite complex architecture prevents a perfect score. The contract surface is complex (multiple markets, treasuries, position managers, oracle systems).

**Subcategory B: Historical Track Record**

| Score | Time in production | Scale (TVL) |
|-------|-------------------|-------------|
| **1** | >2 years | Sustained >$100M |
| **2** | 1–2 years | >$50M |
| **3** | 6–12 months | >$10M |
| **4** | 3–6 months | <$10M |
| **5** | <3 months | No meaningful TVL |

**Score: 2.0/5** — In production >2 years (since Feb 2024) which is excellent. Current TVL ~$94.9M is between the >$50M (score 2) and sustained >$100M (score 1) thresholds; the protocol did spend 182 days above $100M between May–November 2025 (all-time peak $271M on August 24, 2025) but is not currently sustained above $100M. No exploits or fund losses. One responsibly disclosed vulnerability handled well. December 2024 depeg to $0.953 was mild.

**Audits & Historical Score = (1.5 + 2.0) / 2 = 1.75**

**Score: 1.75/5** — Strong audit coverage and solid track record with substantial TVL growth, held back by lack of bug bounty.

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

**Score: 3.0/5** — Multiple dependencies: Chainlink (critical for pricing), Curve (both the stETH/ETH EMA oracle and the USDC/fxUSD pool whose EMA *gates* minting, redemption and funding costs), Uniswap V3 (TWAP validation), Lido (wstETH), and configured-but-unused Aave allocation paths. All are established blue-chip protocols, and actual Aave exposure is negligible, but the criticality is real: Chainlink drives every liquidation and a single ~$7.17M Curve pool decides whether users can mint or redeem at all. Score 3 holds.

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

**Score: 2.0/5** — Over-collateralized onchain at ~142.6% CR with verifiable reserves in a single PoolManager contract, and supply reconciles exactly against pool debt. Collateral is two high-quality assets, wstETH (~$11.16M) and WBTC (~$80.29M), which keeps it in the blue-chip band. Three factors keep it at 2.0 rather than better: the mix is now ~88% WBTC so solvency is effectively a single-asset bet; the dominant xWBTC pool sits at ~139% CR, roughly a 9% BTC drawdown from the 130% Stability Mode trigger; and a non-timelocked `ASSET_MANAGER_ROLE` path could relocate the wstETH leg into Aave Prime, making "all collateral is in one verifiable contract" a current state rather than a guarantee. The `isUnderCollateral` flag on the fxUSD contract is triggered by a legacy V1 market with negligible remaining value (~$8.3K, 78.6% CR), not the active V2 system.

**Subcategory B: Provability**

| Score | Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|-------|---------------------|--------------------|-----------------------|
| **1** | Fully onchain, anyone can verify | Programmatic, real-time | Multiple verification sources |
| **2** | Mostly onchain, some off-chain | onchain with periodic updates | Single reliable source |
| **3** | Hybrid onchain/off-chain | Manual reporting by admins | Known custodian attestation |
| **4** | Primarily off-chain | Infrequent reporting | Self-reported only |
| **5** | Opaque, cannot verify | No reporting | No verification |

**Score: 1.5/5** — Fully on-chain reserves with programmatic real-time NAV calculation. Multiple oracle sources (Chainlink + Uniswap + Curve) for price verification. Anyone can query treasury balances and verify backing, and the supply-versus-pool-debt reconciliation closes to 264 fxUSD of known legacy issuance. Holder distribution is now independently verifiable (916 holders, top holder identified). No off-chain components for core backing.

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

**Score: 3.5/5** — The primary Curve pool holds ~$7.17M (>$5M but below $10M), so a $500K exit is feasible at low-single-digit slippage and moderate positions clear within 1–3 days. Three findings push this past the score-3 band. First, the direct redemption mechanism is **not available at par** — `PegKeeper.isRedeemAllowed()` requires the Curve EMA to be below $0.998, and it is currently `false`. Redemption is a depeg backstop, not an exit route, so the "reliable floor" that would otherwise offset thin DEX depth does not exist in normal conditions. Second, 90.65% of supply sits in the Stability Pool behind a 1% instant-redeem fee (or a 60-minute cooldown), and pool redemptions pay out in fxUSD, so that entire balance would exit through the same ~$7.17M pool. Third, primary DEX depth is only ~11.2% of supply and has not scaled with issuance; the six secondary pools (~$2.8M combined) all pair fxUSD against other non-USDC stablecoins and require a second hop. The December 2024 depeg to $0.953 is direct evidence that liquidity thins under stress.

**Score: 3.5/5** — Adequate depth for ordinary size, but the redemption backstop is depeg-gated rather than always-on, and near all of supply shares one modest exit venue.

#### Category 5: Operational Risk (Weight: 5%)

| Score | Team Transparency | Documentation | Legal/Compliance |
|-------|------------------|---------------|-----------------|
| **1** | Fully doxxed or well-known, established reputation | Excellent, comprehensive | Clear legal structure |
| **2** | Mostly public or known anons | Good, mostly complete | Established entity |
| **3** | Mixed unknown and known anons | Adequate, some gaps | Uncertain structure |
| **4** | Mostly unknown, limited info | Poor or outdated | No clear legal entity |
| **5** | Fully unknown, no reputation | No documentation | No legal structure |

**Score: 2.5/5** — Team is partially doxxed with well-known DeFi founding contributors (Leshner, Warwick, Sharlyn Wu) and institutional backers. Core dev team is mostly semi-anonymous. Documentation is good and comprehensive, and the fee schedule published in the docs matches onchain values. Legal structure is DAO-based with uncertain formal entity status. Onchain governance is effectively dormant — the last Snapshot proposal was FIP-30 on February 4, 2026 — so day-to-day authority rests with the multisig rather than token holders.

**Score: 2.5/5** — Good team reputation and documentation, but DAO structure with uncertain legal entity and dormant voting.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.75 | 20% | 0.35 |
| Centralization & Control | 2.5 | 30% | 0.75 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **2.275** |

**Optional Modifiers:**
- Protocol live >2 years with no incidents: **-0.5** → Does not fully apply due to ChainSecurity vulnerability disclosure (though no exploitation occurred). Not applied.
- TVL maintained >$500M for >1 year: Not applicable

**Final Score: 2.3/5.0** — Rounded up from 2.275 per conservative scoring guidelines. The score sits near the middle of the Low Risk band: a functioning 3-day timelock over upgrades and core parameters, fully verifiable collateral, and an exact supply reconciliation, weighed against oracle ownership that still sits outside the timelock, depeg-gated redemption, and 90.65% of supply concentrated in one contract that exits through one ~$7.17M pool.

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
- **Governance**: Reassess if the timelock delay is reduced, ProxyAdmin ownership or any core `DEFAULT_ADMIN_ROLE` moves away from the TimelockController, or if multisig threshold is lowered (all negative); reassess if a bug bounty program is launched (positive)
- **Collateralization**: Reassess if system CR falls below 135%, or if the xWBTC pool CR falls below 132%
- **Collateral custody**: Reassess if `manage()` is called on the PoolManager or Stability Pool and material balances move into the Aave strategies
- **Liquidity**: Reassess if the primary Curve USDC/fxUSD pool falls below $5M, or if fxSP's share of fxUSD supply exceeds 95%
- **Peg deviation**: Reassess if fxUSD trades below $0.95 for more than 24 hours, or if `PegKeeper.isRedeemAllowed()` turns `true` (indicating the Curve EMA has broken $0.998)

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| March 29, 2026 | 2.5 | Initial assessment |
| May 13, 2026 | 2.2 | Reassessment: 3-day TimelockController took ownership of ProxyAdmin (April 20, 2026); supply ~18.1M → ~53.9M, TVL ~$29M → ~$89M. Governance 4.0 → 2.5, Historical Track Record 2.5 → 2.0; Medium → Low Risk |
| July 27, 2026 | 2.3 | Reassessment (onchain snapshot block 25,625,134): supply ~64.2M, TVL ~$94.9M, system CR 156% → 142.6% on a BTC/ETH drawdown with WBTC now ~88% of collateral. Verified the timelock also holds `DEFAULT_ADMIN_ROLE` on all core contracts and was honored on the May 27–30 `updatePoolCapacity` operation. New findings: both price oracles are still owned by the 6/9 multisig with an `acceptOwnership()` batch scheduled and executable since April 23, 2026 but unexecuted — a non-timelocked path to arbitrary collateral repricing; redemption is gated on the Curve EMA falling below $0.998 and is currently disabled; Stability Pool stable buffer at 0.16% vs a 5% threshold; 90.65% of supply held by fxSP. Governance 2.5 → 3.0, Liquidity 3.0 → 3.5; remains Low Risk |
