# Protocol Risk Assessment: f(x) Protocol — fxUSD

- **Assessment Date:** March 29, 2026
- **Token:** fxUSD (f(x) USD)
- **Chain:** Ethereum
- **Token Address:** [`0x085780639CC2cACd35E474e71f4d000e2405d8f6`](https://etherscan.io/address/0x085780639CC2cACd35E474e71f4d000e2405d8f6)
- **Final Score: 2.5/5.0**

## Overview + Links

fxUSD is a **decentralized stablecoin** issued by the f(x) Protocol (built by AladdinDAO) that maintains its USD peg through a dual-token system splitting yield-bearing collateral into a stable component (fxUSD) and leveraged components (xPOSITION/sPOSITION). The protocol accepts ETH LSTs (wstETH, sfrxETH, weETH, ezETH) and WBTC as collateral, enabling users to mint fxUSD at 0% ongoing interest through the fxMINT product, or to take leveraged long/short positions.

**Key mechanism — the f(x) Invariant:**
The current V2 invariant balances all position types: `Collateral - Borrowed Collateral = fxUSD (Long) + fxUSD (Short) + xPOSITION + sPOSITION`. Collateral (ETH LSTs, WBTC) is split into a stable component (fxUSD) and leveraged components — xPOSITIONs (leveraged longs) absorb upward volatility while sPOSITIONs (leveraged shorts) borrow collateral against fxUSD. When prices fluctuate, the leveraged positions absorb volatility, keeping fxUSD stable. The system supports up to ~7x leverage on ETH/BTC.

**Yearn use cases (from issue #116):**
1. **yvBTC vault strategies** — deposit BTC collateral and borrow fxUSD via fxMINT at 0% annual interest (one-time ~0.5% fee)
2. **fxUSD vault** — similar to existing crvUSD and BOLD vaults, enabling treasury diversification into DeFi-native stablecoins

**Key metrics (March 29, 2026):**

- **fxUSD Total Supply:** ~18,104,437 fxUSD
- **fxUSD NAV:** ~$0.9984
- **Protocol TVL (DeFi Llama):** ~$29.3M
- **fxUSD DEX Liquidity:** ~$9.7M across Curve pools (~$7.1M in primary USDC/fxUSD pool)
- **fxSAVE Total Assets:** ~30.0M fxSP (~$30M in Stability Pool)
- **Stability Pool APY:** ~4.35%
- **fxMINT Opening Fee:** 0.5% (ETH/BTC) | Closing Fee: 0.2%
- **Market Cap (CoinGecko):** ~$18.1M (#848)
- **24h Volume:** ~$326K
- **ATH:** $1.042 (March 23, 2026) | **ATL:** $0.953 (December 5, 2024)
- **Launch Date:** February 23, 2024 (~2 years in production)

**Links:**

- [f(x) Protocol Documentation](https://fxprotocol.gitbook.io/fx-docs)
- [f(x) Protocol App](https://fx.aladdin.club)
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
| ShortPoolManager | [`0xaCDc0AB51178d0Ae8F70c1EAd7d3cF5421FDd66D`](https://etherscan.io/address/0xaCDc0AB51178d0Ae8F70c1EAd7d3cF5421FDd66D) | Manages sPOSITION positions (borrows from PoolManager) |

**Collateral held in PoolManager:**

| Asset | Amount | USD Value | fxUSD Debt | Positions |
|-------|--------|-----------|------------|-----------|
| wstETH (xstETH pool [`0x6ecfa38fee8a5277b91efda204c235814f0122e8`](https://etherscan.io/address/0x6ecfa38fee8a5277b91efda204c235814f0122e8)) | 4,519 wstETH | ~$11.1M | 7,207,005 fxUSD | 1,864 |
| WBTC (xWBTC pool [`0xab709e26fa6b0a30c119d8c55b887ded24952473`](https://etherscan.io/address/0xab709e26fa6b0a30c119d8c55b887ded24952473)) | 228 WBTC | ~$15.2M | 10,123,422 fxUSD | 803 |
| **Total** | | **~$26.2M** | **17,330,427 fxUSD** | 2,667 |

**Overall V2 collateralization ratio: ~151.7%**

**Note:** `fxUSD.isUnderCollateral()` returns `true` — this flag reflects legacy V1 market status (wstETH treasury at 81% CR with only ~$8.5K remaining). The V2 system via PoolManager maintains >150% collateralization.

### Legacy V1 Treasury Contracts (Minimal Remaining Value)

| Treasury | Address | Base Token | Remaining Value |
|----------|---------|------------|----------------|
| stETH Treasury | [`0xED803540037B0ae069c93420F89Cd653B6e3Df1f`](https://etherscan.io/address/0xED803540037B0ae069c93420F89Cd653B6e3Df1f) | wstETH | ~$8.6K (under-collateralized, ~264 legacy fxUSD) |
| sfrxETH Treasury | [`0xcfEEfF214b256063110d3236ea12Db49d2dF2359`](https://etherscan.io/address/0xcfEEfF214b256063110d3236ea12Db49d2dF2359) | sfrxETH | ~$149K |

### Reserve Pool

| Contract | Address | Holdings |
|----------|---------|----------|
| Reserve Pool | [`0xE93F5DD55eC9bdAbbba5eA88E4b4f3C253ee45Ed`](https://etherscan.io/address/0xE93F5DD55eC9bdAbbba5eA88E4b4f3C253ee45Ed) | 17.43 wstETH (~$43K) + 0.38 WBTC (~$25K) + 1,229 fxUSD |

### Market & Infrastructure Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| PegKeeper | [`0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70`](https://etherscan.io/address/0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70) | Maintains fxUSD peg via Stability Pool |
| Configuration | [`0x16b334f2644cc00b85DB1A1efF0C2C395e00C28d`](https://etherscan.io/address/0x16b334f2644cc00b85DB1A1efF0C2C395e00C28d) | Protocol parameter configuration |
| ProxyAdmin | [`0x9b54b7703551d9d0ced177a78367560a8b2edda4`](https://etherscan.io/address/0x9b54b7703551d9d0ced177a78367560a8b2edda4) | Controls all proxy upgrades |
| GatewayRouter | [`0xA5e2Ec4682a32605b9098Ddd7204fe84Ab932fE4`](https://etherscan.io/address/0xA5e2Ec4682a32605b9098Ddd7204fe84Ab932fE4) | User-facing router |
| GaugeController | [`0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37`](https://etherscan.io/address/0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37) | FXN emissions gauge voting |

### Stability Pool & fxSAVE

| Contract | Address | Purpose |
|----------|---------|---------|
| fxSP (Stability Pool) | [`0x65C9A641afCEB9C0E6034e558A319488FA0FA3be`](https://etherscan.io/address/0x65C9A641afCEB9C0E6034e558A319488FA0FA3be) | Holds fxUSD + USDC for peg maintenance |
| fxSAVE | [`0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39`](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) | Auto-compounding fxSP vault (~$30M) |

### Governance

| Contract | Address | Configuration |
|----------|---------|---------------|
| Operational Multisig | [`0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`](https://etherscan.io/address/0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF) | 6-of-9 Gnosis Safe (v1.3.0), 594 nonce |
| Emergency Multisig | [`0x28c921adAC4c1072658eB01a28DA06b5F651eF62`](https://etherscan.io/address/0x28c921adAC4c1072658eB01a28DA06b5F651eF62) | 3-of-4 Gnosis Safe (emergency pause) |

### DEX Liquidity Pools

| Pool | Address | TVL |
|------|---------|-----|
| Curve USDC/fxUSD | [`0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) | ~$7.1M |
| Curve DeFi Stable Avengers | [`0x8B878AFE454e31CF0A79c6D7cf2f077DD286C12f`](https://etherscan.io/address/0x8B878AFE454e31CF0A79c6D7cf2f077DD286C12f) | ~$203K |

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

- **In production since:** February 23, 2024 (~25 months)
- **Current TVL:** ~$29.3M (DeFi Llama); ~$26.2M collateral backing ~17.3M fxUSD debt in PoolManager
- **Peak fxUSD supply:** The token has grown from launch to ~18.1M supply
- **Peg stability:** fxUSD has generally maintained its peg, with an ATL of $0.953 on December 5, 2024. Current price ~$1.00
- **Security incidents:** One responsibly disclosed vulnerability (ChainSecurity, April 2025) — no exploits or fund losses
- **No concentration risk data available** — top holder information requires PRO Etherscan tier

The protocol has operated for over 2 years with no exploits or fund losses. The December 2024 ATL of $0.953 (~4.7% deviation) is notable but represents a relatively mild depeg for a DeFi stablecoin. The TVL at ~$29M is modest but has been sustained.

## Funds Management

In V2, all fxUSD position collateral is custodied by the PoolManager contract ([`0x250893CA4Ba5d05626C785e8da758026928FCD24`](https://etherscan.io/address/0x250893CA4Ba5d05626C785e8da758026928FCD24)), which currently holds ~4,519 wstETH (~$11.1M) and ~228 WBTC (~$15.2M) — totaling ~$26.2M backing ~17.3M fxUSD debt (**~151.7% CR**). The system does not delegate position collateral to external protocols. The Stability Pool separately deploys USDC to Aave (up to 80% cap) for yield generation on behalf of fxSP depositors.

### Accessibility

- **Who can mint:** Anyone can mint fxUSD by depositing collateral (wstETH, WBTC in V2) through fxMINT or by opening xPOSITION/sPOSITION positions. No whitelist required.
- **Minting mechanism:** Atomic in a single transaction via flash loans. Users deposit collateral, fxUSD is minted proportional to their leverage/debt position.
- **Redemption:** Anyone can redeem fxUSD for $1 worth of underlying collateral (wstETH/WBTC) as a last-resort peg mechanism, with a 0.5% fee (creating a hard floor at ~$0.995).
- **Fees:** Opening fee: 0.5% of minted debt (fxMINT), 0.3% (xPOSITION/sPOSITION). Closing fee: 0.2% (fxMINT), 0.1% (xPOSITION/sPOSITION). 0% ongoing annual interest for fxMINT.
- **Rate limits:** Maximum concurrent redemption is 20% of xPOSITION (highest leverage first).

### Collateralization

- **Fully collateralized on-chain** by crypto-native assets held in the PoolManager: wstETH (~$11.1M) and WBTC (~$15.2M)
- **Over-collateralization:** The V2 system maintains ~151.7% CR (~$26.2M collateral backing ~17.3M fxUSD debt). The system requires >100% CR; Stability Mode triggers protective measures at CR <130%. Note: `fxUSD.isUnderCollateral()` currently returns `true` due to the legacy V1 wstETH market (81% CR with only ~$8.5K remaining) — the V2 PoolManager system is healthy at >150%.
- **Collateral quality:** wstETH (Lido) and WBTC — blue-chip DeFi assets with deep liquidity. V2 concentrates collateral in two high-quality assets rather than the V1 approach of 6+ collateral types.
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
- **Risk curation:** Governance-adjustable parameters include LTV thresholds, fees, oracle deviations, and collateral caps

### Provability

- **Reserves fully verifiable on-chain** — all collateral sits in treasury contracts readable by anyone
- **Exchange rate / NAV:** Computed on-chain algorithmically via the f(x) invariant formula. No off-chain inputs for NAV calculation.
- **Oracle system:** Multi-source design:
  - **stETH/USD:** Chainlink ETH/USD + Uniswap V3 USDC/ETH (0.05% and 0.3% pools) + Curve stETH/ETH EMA + Uniswap V3 stETH/ETH. 1% deviation threshold.
  - **WBTC/USD:** Chainlink BTC/USD + Chainlink WBTC/BTC + Uniswap V3 pools (WBTC/USDC, WBTC/ETH, USDC/ETH). 2% deviation threshold.
- **Admin minting:** The fxUSD contract is upgradeable (TransparentUpgradeableProxy). The 6/9 multisig controls the ProxyAdmin and could theoretically upgrade the implementation to allow unbacked minting. Under the current implementation, fxUSD can only be minted against collateral through the PoolManager.
- **`isUnderCollateral` flag:** The fxUSD contract currently reports `isUnderCollateral() = true` due to a legacy V1 wstETH market with 81% CR (~$8.5K remaining, negligible). The active V2 system holds ~$26.2M collateral against ~$17.3M fxUSD debt (151.7% CR).
- **No third-party verification** (no Chainlink PoR or custodian attestation needed — all on-chain)

## Liquidity Risk

- **Primary liquidity:** Curve USDC/fxUSD pool at ~$7.1M TVL with balanced composition (~51.6% USDC, ~48.4% fxUSD)
- **Secondary pools:** Curve DeFi Stable Avengers (~$203K), Curve MSUSD/fxUSD (~$1.2M), Curve USDNR/fxUSD (~$636K), Curve REUSD/fxUSD (~$578K)
- **Total DEX liquidity:** ~$9.7M across Curve pools
- **Redemption mechanism:** Direct 1:1 redemption for underlying collateral (wstETH/WBTC) with 0.5% fee, capped at 20% of xPOSITION per redemption event
- **Stability Pool exits:** 1% early exit fee, 60-minute redemption window
- **24h trading volume:** ~$326K (CoinGecko)
- **Slippage analysis:** With ~$7.1M in the primary Curve pool, a $500K swap would experience moderate slippage. For larger exits ($1M+), the direct redemption mechanism at 0.5% fee provides a reliable floor.
- **Historical liquidity during stress:** The December 2024 depeg to $0.953 suggests that liquidity was somewhat thin during that period, though the peg recovered.
- **Large holder exit:** Given ~$18M market cap and ~$9.7M DEX liquidity, large holders could exit through a combination of DEX swaps and direct redemptions over 1-3 days with <2% impact.

## Centralization & Control Risks

### Governance

- **All contracts are upgradeable** via TransparentUpgradeableProxy, controlled by ProxyAdmin [`0x9b54b7703551d9d0ced177a78367560a8b2edda4`](https://etherscan.io/address/0x9b54b7703551d9d0ced177a78367560a8b2edda4)
- **Operational multisig:** 6-of-9 Gnosis Safe [`0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`](https://etherscan.io/address/0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF)
  - Known signers: Diligent Deer, Paul, chiaki644, Gordon, Guo Yu, Jamie, Martin Krung, Sharlyn Wu, vfat
  - Mix of known and semi-anonymous contributors
- **Emergency multisig:** 3-of-4 Gnosis Safe [`0x28c921adAC4c1072658eB01a28DA06b5F651eF62`](https://etherscan.io/address/0x28c921adAC4c1072658eB01a28DA06b5F651eF62)
  - Signers: Gordon, Guo Yu, Jamie, Sharlyn Wu (all team members)
  - Can pause xPOSITION and sPOSITION operations
- **No timelock detected.** The ProxyAdmin is directly owned by the multisig — upgrades can execute immediately without a delay period.
- **Governance voting:** Snapshot space `fxn.eth` using veFXN voting power. 32 proposals to date with low voter participation (4-16 voters, ~118-172K veFXN per vote).
- **Privileged roles:** The 6/9 multisig can upgrade all contracts, change fee parameters, modify oracle configurations, and alter system addresses. The 3/4 emergency multisig can pause position operations.

**Key concern:** The combination of upgradeable contracts + no timelock means the 6/9 multisig can make immediate, arbitrary changes to all protocol contracts. While the 6/9 threshold is reasonable, the lack of a timelock is a significant centralization risk.

### Programmability

- **Highly programmatic:** Core operations (minting, redemption, liquidation, rebalancing, peg keeping) are all handled by smart contracts
- **NAV/PPS:** Calculated on-chain algorithmically via the f(x) invariant — no manual price updates
- **Keepers:** Rebalancing and liquidation depend on external keepers to trigger transactions. Keeper incentive is 1% (0.01% for fxSAVE harvesting). If keepers fail to act, positions may not be rebalanced in time.
- **Stability Pool peg keeper:** Automated but depends on sufficient USDC deposits in the pool
- **Oracle updates:** Chainlink feeds + Uniswap/Curve on-chain TWAP/EMA — no off-chain dependencies for price feeds

### External Dependencies

- **Chainlink:** ETH/USD and BTC/USD price feeds — critical for all position operations and liquidations
- **Uniswap V3:** TWAP oracle data used as secondary/validation price source
- **Curve:** stETH/ETH EMA oracle + fxUSD/USDC pool for peg monitoring
- **Aave:** Stability Pool deploys USDC to Aave Core (up to 80% cap) and wstETH to Aave Prime (up to 80%)
- **Lido:** wstETH is the primary ETH collateral in V2 (~$11.1M)
- **LayerZero:** Used for omnichain fxUSD bridging (cross-chain OFT)

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
| Operational Multisig | [`0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF`](https://etherscan.io/address/0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF) | Governance parameter changes, new transactions |
| Emergency Multisig | [`0x28c921adAC4c1072658eB01a28DA06b5F651eF62`](https://etherscan.io/address/0x28c921adAC4c1072658eB01a28DA06b5F651eF62) | Pause events on PoolManager/ShortPoolManager |
| PoolManager | [`0x250893CA4Ba5d05626C785e8da758026928FCD24`](https://etherscan.io/address/0x250893CA4Ba5d05626C785e8da758026928FCD24) | Rebalance/Liquidation events, wstETH/WBTC balances, collateral ratio |
| Stability Pool (fxSP) | [`0x65C9A641afCEB9C0E6034e558A319488FA0FA3be`](https://etherscan.io/address/0x65C9A641afCEB9C0E6034e558A319488FA0FA3be) | USDC balance (alert if <5% of pool), deposit/withdrawal flows |
| fxSAVE | [`0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39`](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) | Total assets, exchange rate changes |
| PegKeeper | [`0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70`](https://etherscan.io/address/0x50562fe7e870420F5AAe480B7F94EB4ace2fcd70) | Peg maintenance events, funding level triggers |
| Curve USDC/fxUSD | [`0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f`](https://etherscan.io/address/0x5018BE882DccE5E3F2f3B0913AE2096B9b3fB61f) | Pool balance ratio, large swaps |

### Critical Events & Thresholds

| Event | Threshold | Action |
|-------|-----------|--------|
| fxUSD NAV deviation | >2% from $1.00 | Immediate alert |
| Curve EMA price | <$0.998 | Triggers enhanced protection mode |
| Stability Pool USDC ratio | <5% of pool | Funding Level I activates |
| Collateral Ratio (any market) | <130% | Stability Mode — enhanced monitoring |
| Collateral Ratio (any market) | <100% | Critical — recapitalization mode |
| ProxyAdmin upgrade | Any call | Immediate investigation |
| Emergency pause | Any | Immediate alert and assessment |
| fxUSD totalSupply | >50% change in 24h | Investigate unusual minting/burning |

### Key View Functions

- `fxUSD.nav()` — current NAV (target: 1e18 = $1.00)
- `fxUSD.totalSupply()` — total fxUSD in circulation
- `fxUSD.isUnderCollateral()` — boolean (currently true due to legacy market; monitor for V2 changes)
- `PoolManager.getPoolInfo(pool)` — returns (collateralCapacity, collateralBalance, rawCollateral, debtCapacity, debtBalance) per pool
- `wstETH.balanceOf(PoolManager)` / `WBTC.balanceOf(PoolManager)` — direct collateral balance checks
- `StabilityPool.totalSupply()` — total fxSP tokens
- `fxSAVE.totalAssets()` — total assets in fxSAVE vault

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
│           │ owns                  │ can pause                   │
│  ┌────────▼─────────┐    ┌───────▼───────────┐                  │
│  │ ProxyAdmin        │    │ PoolManager       │                  │
│  │ 0x9b54...da4     │    │ ShortPoolManager   │                  │
│  └────────┬─────────┘    └───────────────────┘                  │
│           │ upgrades all proxies (NO TIMELOCK)                  │
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
│  │ wstETH: 4,519 (~$11.1M) via xstETH pool              │       │
│  │ WBTC:     228 (~$15.2M) via xWBTC pool                │       │
│  │ Total: ~$26.2M backing ~17.3M fxUSD (151.7% CR)      │       │
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
- The 6/9 multisig has full upgrade authority over all protocol contracts with no timelock — this is the primary trust boundary
- The 3/4 emergency multisig can pause position operations but cannot upgrade contracts
- Keepers are permissionless (anyone can trigger rebalancing/liquidation for bounties)
- Oracle data flows from Chainlink + Uniswap/Curve and is validated with deviation thresholds

---

## Risk Summary

### Key Strengths

- **Extensive audit history:** 21 audits from 3 firms (Secbit, Trail of Bits, OpenZeppelin) with continuous coverage since 2023
- **Innovative peg mechanism:** 5-layer peg protection with on-chain redemption as a hard floor at $0.995
- **Fully on-chain collateral:** All reserves verifiable in treasury contracts, NAV calculated algorithmically
- **Strong team backing:** Well-known DeFi founders (Leshner, Warwick, Lambur) as founding contributors, institutional backing from Polychain, DCG, 1kx
- **2+ years in production** with no exploits or fund losses

### Key Risks

- **No timelock on contract upgrades:** The 6/9 multisig can upgrade all protocol contracts immediately, with no delay for users to react
- **No bug bounty program** despite complex contract architecture and a previously discovered vulnerability
- **Modest TVL (~$29M)** and liquidity (~$7.1M primary Curve pool) — large exits could face friction
- **Keeper dependency:** Rebalancing and liquidation rely on external keepers; failure to act in time could lead to under-collateralization
- **Complex multi-contract architecture** with many external dependencies (Chainlink, Aave, Curve, multiple LSTs)

### Critical Risks

- **Upgrade authority without timelock:** If the 6/9 multisig is compromised, all funds could be at risk through malicious contract upgrades with no delay for detection or exit. Adding a timelock would significantly mitigate this risk.

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

**Score: 2.5/5** — In production >2 years (since Feb 2024) which is excellent, but TVL at ~$29M is moderate, not >$50M. No exploits or fund losses. One responsibly disclosed vulnerability handled well. December 2024 depeg to $0.953 was mild.

**Audits & Historical Score = (1.5 + 2.5) / 2 = 2.0**

**Score: 2.0/5** — Strong audit coverage and decent track record, held back by lack of bug bounty and moderate TVL.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Score | Contract Upgradeability | Timelock | Privileged Roles |
|-------|------------------------|----------|-----------------|
| **1** | Immutable or fully decentralized DAO | N/A or >3 days | No privileged roles or multi-party approval |
| **2** | Multisig 7/11+ with timelock | 24+ hours | Limited roles, cannot seize funds |
| **3** | Multisig 5/9 with timelock | 24+ hours | Some powerful roles, constrained by timelock |
| **4** | Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints |
| **5** | EOA or <3 signers (CRITICAL GATE) | No timelock | Unlimited admin powers |

**Score: 4.0/5** — The 6/9 multisig threshold is reasonable, but the complete absence of a timelock is a serious concern. The multisig can upgrade all contracts and change parameters immediately with no delay for users to react or exit. Per scoring guidelines ("be conservative"), the no-timelock column clearly maps to score 4-5, and the powerful admin roles (full upgrade authority over all contracts) add further risk. The emergency 3/4 multisig can also pause operations. Known signers include some reputable DeFi figures but most are semi-anonymous.

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

**Score: 3.0/5** — Multiple dependencies: Chainlink (critical for pricing), Aave (yield on Stability Pool), Curve (peg monitoring EMA + DEX liquidity), Uniswap V3 (TWAP validation), and 4+ LST protocols. All are established blue-chip protocols, but the breadth and criticality (especially Chainlink for all liquidations) pushes toward score 3.

**Centralization Score = (4.0 + 1.5 + 3.0) / 3 = 2.83**

**Score: 2.83/5** — Good programmability offset by lack of timelock on upgradeable contracts and multiple critical dependencies.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Score | Backing | Collateral Quality | Verifiability |
|-------|---------|-------------------|---------------|
| **1** | 100%+ onchain, over-collateralized | Blue-chip assets (ETH, WBTC, stablecoins) | Real-time onchain verification |
| **2** | 100% onchain collateral | High-quality DeFi assets (LSTs, major LPs) | onchain with some complexity |
| **3** | 100% collateral, some off-chain | Mixed quality or newer protocols | Periodic custodian attestation |
| **4** | Partially collateralized or custodial | Lower-quality or illiquid assets | Opaque or infrequent reporting |
| **5** | Uncollateralized or unverifiable (CRITICAL GATE) | Unknown or very high-risk assets | No verification possible |

**Score: 2.0/5** — Over-collateralized on-chain at ~151.7% CR with verifiable reserves in a single PoolManager contract. Collateral is concentrated in two high-quality assets: wstETH (~$11.1M) and WBTC (~$15.2M). The `isUnderCollateral` flag on the fxUSD contract is triggered by a legacy V1 market with negligible remaining value (~$8.5K, 81% CR), not the active V2 system. The V2 architecture simplifies verification by centralizing collateral custody.

**Subcategory B: Provability**

| Score | Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|-------|---------------------|--------------------|-----------------------|
| **1** | Fully onchain, anyone can verify | Programmatic, real-time | Multiple verification sources |
| **2** | Mostly onchain, some off-chain | onchain with periodic updates | Single reliable source |
| **3** | Hybrid onchain/off-chain | Manual reporting by admins | Known custodian attestation |
| **4** | Primarily off-chain | Infrequent reporting | Self-reported only |
| **5** | Opaque, cannot verify | No reporting | No verification |

**Score: 1.5/5** — Fully on-chain reserves with programmatic real-time NAV calculation. Multiple oracle sources (Chainlink + Uniswap + Curve) for price verification. Anyone can query treasury balances and verify backing. No off-chain components for core backing.

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

**Score: 3.0/5** — Direct redemption mechanism exists (0.5% fee) but is capped at 20% of xPOSITION per event and depends on sufficient xPOSITION liquidity. Primary Curve pool has ~$7.1M which is >$5M but below $10M. The Stability Pool has a 1% early exit fee and 60-minute window. For moderate positions ($500K-$1M), exit is feasible within 1-3 days. The December 2024 depeg to $0.953 suggests liquidity can thin during stress. 24h volume of ~$326K is low relative to supply.

**Score: 3.0/5** — Adequate redemption mechanism but moderate DEX depth, capped redemptions, and demonstrated stress-period thinning.

#### Category 5: Operational Risk (Weight: 5%)

| Score | Team Transparency | Documentation | Legal/Compliance |
|-------|------------------|---------------|-----------------|
| **1** | Fully doxxed or well-known, established reputation | Excellent, comprehensive | Clear legal structure |
| **2** | Mostly public or known anons | Good, mostly complete | Established entity |
| **3** | Mixed unknown and known anons | Adequate, some gaps | Uncertain structure |
| **4** | Mostly unknown, limited info | Poor or outdated | No clear legal entity |
| **5** | Fully unknown, no reputation | No documentation | No legal structure |

**Score: 2.5/5** — Team is partially doxxed with well-known DeFi founding contributors (Leshner, Warwick, Sharlyn Wu) and institutional backers. Core dev team is mostly semi-anonymous. Documentation is good and comprehensive. Legal structure is DAO-based with uncertain formal entity status.

**Score: 2.5/5** — Good team reputation and documentation, but DAO structure with uncertain legal entity.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 2.83 | 30% | 0.85 |
| Funds Management | 1.75 | 30% | 0.53 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.5 | 5% | 0.13 |
| **Final Score** | | | **2.35** |

**Optional Modifiers:**
- Protocol live >2 years with no incidents: **-0.5** → Does not fully apply due to ChainSecurity vulnerability disclosure (though no exploitation occurred). Not applied.
- TVL maintained >$500M for >1 year: Not applicable

**Final Score: 2.5/5.0** — Rounded up from 2.35 per conservative scoring guidelines, reflecting the tail risk from immediate-upgrade authority without timelock which is difficult to fully weight in category scoring.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | ***Medium Risk*** | ***Approved with enhanced monitoring*** |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk — Approved with enhanced monitoring**

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (September 2026)
- **TVL-based**: Reassess if TVL changes by more than 50%
- **Incident-based**: Reassess after any exploit, governance change, or collateral modification
- **Governance**: Reassess if timelock is added (positive) or if multisig threshold is lowered (negative)
- **Peg deviation**: Reassess if fxUSD trades below $0.95 for more than 24 hours
