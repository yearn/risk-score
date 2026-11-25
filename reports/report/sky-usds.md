# Protocol Risk Assessment: Sky — USDS & sUSDS

- **Assessment Date:** June 18, 2026 (Updated: November 24, 2026)
- **Token:** USDS (Sky Dollar) and sUSDS (Savings USDS)
- **Chain:** Ethereum
- **Token Address:** [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) (USDS) · [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) (sUSDS)
- **Final Score: 1.80/5.0**

## Overview + Links

**USDS** is Sky Protocol's USD-pegged stablecoin — the upgraded, rebranded successor to **DAI**, launched on September 2, 2024 as part of MakerDAO's "Endgame" transition to Sky. USDS is an upgradeable ERC-20 (UUPS/EIP-1967 proxy) and is governed through the same on-chain machinery that governs DAI: the Sky **Maker Vat** (MCD_VAT) ledger, **Chief** continuous-approval voting, and the **PauseProxy** with a 48-hour Governance Security Module (GSM) delay.

USDS does **not** have its own dedicated collateral system. There are **two permissionless, user-facing 1:1 swap paths** for getting in and out of USDS:

1. **DAI ↔ USDS Converter** ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A)) — anyone with DAI can swap 1:1 to USDS (and back) at zero fees in a single transaction. This rails USDS's peg directly to DAI.
2. **USDS-USDC LitePSM Wrapper** ([`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c)) — a thin wrapper around the existing **DAI LitePSM** ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) that lets anyone swap USDC ↔ USDS 1:1 with **zero fees** (`tin = tout = 0`), atomically. Backing USDC is held in a dedicated **Pocket** contract ([`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341)).

In addition, USDS supply can also be *issued* (not swapped) through governance-mediated channels: **Prime allocator vaults** (Spark, Grove, Obex) that mint USDS against a governance-set debt ceiling for deployment by an allocator, **D3M (Direct-Deposit Modules)** that mint USDS into lending markets (e.g. Spark, Aave-Lido) up to per-market debt ceilings, and **CDP/LockStake borrowers** who post collateral and draw DAI which then routes through the converter into USDS. These additional channels are detailed in the [Funds Management → How USDS Is Issued](#how-usds-is-issued) section.

Because every USDS is fungible with a DAI (via the converter), the total system collateral securing USDS is the **entire Sky/MakerDAO collateral book** sitting in MCD_VAT — a mix of USDC PSM reserves, Prime allocator positions (onchain lending, third-party stablecoins, tokenized credit and OTC lending), crypto-backed CDPs (ETH, wstETH, WBTC), LockStake loans and legacy Real-World Asset (RWA) vaults. The D3M channel is dormant at the snapshot.

**sUSDS** is the tokenized Sky Savings Rate vault — an ERC-4626 wrapper deployed September 4, 2024 with a `chi` accumulator that grows continuously at the Sky Savings Rate (**SSR**). Depositing USDS into sUSDS is atomic, fee-free, and so is withdrawal. The SSR is a parameter on sUSDS that Sky Governance can set via Chief + PauseProxy, and that the [SP-BEAM](#programmability) rate module can also move within governance-set bounds without the GSM delay. It is currently a per-second `ssr` of `1.00000000118…` → **~3.80% APY** at the November 24, 2026 snapshot.

**Key onchain metrics (November 24, 2026, block [26487462](https://etherscan.io/block/26487462), 20:38:47 UTC):**

| Metric | Value |
|--------|-------|
| USDS total supply (Ethereum mainnet) | **3,156,371,346 USDS** (~$3.16B) |
| USDS total supply (all chains) | ≈ mainnet `totalSupply()`, since every bridge is lock-and-mint: ~8.7M of the mainnet supply is escrowed on L1 (~4.5M native L2 escrows + ~4.2M LayerZero) and re-issued 1:1 on the destination chains, not added on top; the Gnosis xDAI bridge separately locks ~1.0M USDS and ~36.1M sUSDS to back xDAI. [DefiLlama](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)'s latest daily point (00:00 UTC, November 25, 2026) aggregates the per-chain balances to ~3,160,960,000 USDS, within 0.14% of the onchain `totalSupply()` of 3,156,481,769 at the same time ([block 26488468](https://etherscan.io/block/26488468)) |
| sUSDS supply (shares) | 1,736,062,471 sUSDS |
| sUSDS `totalAssets()` | **1,940,034,911 USDS** (~61.5% of mainnet USDS supply) |
| sUSDS price-per-share (`chi`) | 1.1175 USDS/sUSDS |
| Sky Savings Rate (SSR) | `1.000000001182641…` per second → **~3.80% APY**, set by SP-BEAM on October 7, 2026 ([tx](https://etherscan.io/tx/0x6ab0be000a3dfbbf0fdce381985a224fe37511958403a4bbc2278c33bc1f503e)) |
| USDC held in LitePSM Pocket | **1,817,800,321 USDC** (~$1.82B) |
| MCD_VAT total system debt | ~8.43B (DAI + USDS combined) |
| 1-year USDS peg range ([CoinGecko](https://www.coingecko.com/en/coins/usds) daily series) | 0.9968 (2026-10-30) – 1.0011 (2026-02-23); hourly low 0.9962 (2026-11-19 21:00 UTC); current 0.9999 |

**Links:**

- [Sky Developer Documentation](https://developers.skyeco.com/)
- [Sky Protocol App](https://app.sky.money/)
- [USDS Token Docs](https://developers.skyeco.com/protocol/tokens/usds/)
- [sUSDS Docs](https://developers.skyeco.com/protocol/tokens/susds/)
- [Sky GitHub Organization](https://github.com/sky-ecosystem)
- [sky-ecosystem/usds repo](https://github.com/sky-ecosystem/usds) (contract source)
- [sky-ecosystem/sdai (susds branch)](https://github.com/sky-ecosystem/sdai/tree/susds) (sUSDS source)
- [sky-ecosystem/dss-lite-psm](https://github.com/sky-ecosystem/dss-lite-psm) (LitePSM + Wrapper source)
- [Sky Bug Bounty (Immunefi)](https://immunefi.com/bug-bounty/sky/)
- [Sky Governance Portal](https://vote.sky.money/)
- [Sky Chainlog (active addresses, JSON)](https://chainlog.sky.money/api/mainnet/active.json)
- [DefiLlama: Sky Lending](https://defillama.com/protocol/sky-lending)
- [DefiLlama: USDS stablecoin data](https://stablecoins.llama.fi/stablecoin/209)

## Contract Addresses

All addresses retrieved from the onchain [Sky Chainlog](https://etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F#readContract) (version 1.20.23) and verified onchain. Snapshot block: **[26487462](https://etherscan.io/block/26487462)** (hash `0x456648fe1e33cccb6c4120790147e5319a145f2cab60534fa3e348d135c6aedf`, November 24, 2026 20:38:47 UTC).

### Tokens & Conversion Layer

| Contract | Address | Type / Role |
|----------|---------|-------------|
| USDS (proxy) | [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) | UUPS/EIP-1967 proxy. Deployed 2024-09-02 |
| USDS implementation | [`0x1923DfeE706A8E78157416C29cBCCFDe7cdF4102`](https://etherscan.io/address/0x1923DfeE706A8E78157416C29cBCCFDe7cdF4102) | Current implementation (`USDS_IMP`) |
| sUSDS (proxy) | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | UUPS/EIP-1967 proxy, ERC-4626. Deployed 2024-09-04 |
| sUSDS implementation | [`0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0`](https://etherscan.io/address/0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0) | Current implementation (`SUSDS_IMP`) |
| DAI | [`0x6B175474E89094C44Da98b954EedeAC495271d0F`](https://etherscan.io/address/0x6B175474E89094C44Da98b954EedeAC495271d0F) | Sister stablecoin, 1:1 with USDS via converter |
| USDC | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Circle USDC, gem for the LitePSM Wrapper |
| **DAI-USDS Converter** | [`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) | `DAI_USDS`. Atomic, fee-free 1:1 conversion |
| USDS Join | [`0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) | Mints/burns USDS against VAT internal balances. Holds `USDS.wards(USDS_JOIN) == 1`. The join itself has no `wards` (the getter reverts) and no admin functions |
| USDS LayerZero OFT Adapter | [`0x1e1D42781FC170EF9da004Fb735f56F0276d01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | LayerZero V2 OApp (OFT Adapter). Locks USDS for bridging to **Solana and Avalanche only** (~4.18M USDS locked). `owner = PauseProxy`, `endpoint =` [`0x1a44076050125825900e736c501f859c50fe728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fe728c) (LZ V2). Does NOT hold `wards` on USDS. See [Cross-Chain Bridges](#cross-chain-bridges-skylink) |
| sUSDS LayerZero OFT Adapter | [`0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | LayerZero V2 OApp for sUSDS. Avalanche peer configured but **0 sUSDS currently locked** — sUSDS bridges via the native L2 token bridges instead. `owner = PauseProxy`. Does NOT hold `wards` on sUSDS |

### Cross-Chain Bridges (SkyLink)

USDS and sUSDS reach other chains through **two independent bridge systems** under the SkyLink umbrella — **not** a single LayerZero deployment. The native token bridges are ERC-1967 proxies with `wards[PauseProxy] == 1`; the OFT adapters are owned by PauseProxy. Both sit on the same governance path as USDS itself. Addresses from the Sky chainlog, verified onchain at the snapshot.

**1. Native canonical L2 token bridges** (carry both USDS and sUSDS; lock-and-mint via each rollup's own bridge):

| Chain | Token Bridge | L1 Escrow | Bridge tech |
|-------|--------------|-----------|-------------|
| Base | [`0xA587…352A`](https://etherscan.io/address/0xA5874756416Fa632257eEA380CAbd2E87cED352A) | [`0x7F31…9Ef3`](https://etherscan.io/address/0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3) | OP Stack canonical bridge |
| Optimism | [`0x3d25…8057`](https://etherscan.io/address/0x3d25B7d486caE1810374d37A48BCf0963c9B8057) | [`0x4671…6C65`](https://etherscan.io/address/0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) | OP Stack canonical bridge |
| Unichain | [`0xDF05…81d2`](https://etherscan.io/address/0xDF0535a4C96c9Cd8921d8FeC92A7680b281681d2) | [`0x1196…566A`](https://etherscan.io/address/0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A) | OP Stack canonical bridge |
| Arbitrum | [`0x84b9…079E`](https://etherscan.io/address/0x84b9700E28B23F873b82c1BEb23d86C091b6079E) | [`0xA10c…9400`](https://etherscan.io/address/0xA10c7CE4b876998858b1a9E12b10092229539400) | Arbitrum Nitro canonical gateway |

L1 tokens are locked in the per-chain escrow and minted 1:1 on the L2 by the canonical rollup bridge. These do **not** use LayerZero, so they do not appear on LayerZero Scan. Escrow balances at the snapshot (onchain `balanceOf`): Base **4.02M USDS / 10.83M sUSDS**, Arbitrum **0.44M USDS / 427.0M sUSDS**, Optimism **0.011M USDS / 4.62M sUSDS**, Unichain **0.010M USDS / 0.15M sUSDS**. **This is how sUSDS reaches Arbitrum** (~427M sUSDS via the Arbitrum gateway), which is why sUSDS-on-Arbitrum is absent from LayerZero Scan. Arbitrum holds ~96.5% of escrowed sUSDS and Base ~89.7% of the now small escrowed USDS balance. On July 13, 2026 the Spark Liquidity Layer withdrew its Base, Optimism and Unichain positions back to its mainnet ALM Proxy ([`0x1601843c5E9bC251A3272907010AFa41Fa18347E`](https://etherscan.io/address/0x1601843c5E9bC251A3272907010AFa41Fa18347E)) through the canonical bridges — e.g. [146.6M USDS out of the Base escrow](https://etherscan.io/tx/0xac90aa7e2dc4035c921324e3a10ad3ba6c39f21826375b1558ee6acc27964a22) and [192.0M sUSDS in the same block range](https://etherscan.io/tx/0xb2c9215da24ae539d7a3fe9b65b731d079f0aaf0229e51e885e35d319e05c9e8). On October 19, 2026 it withdrew [99.33M USDS from the Arbitrum escrow](https://etherscan.io/tx/0x2b7241789acd29f18928f2f11faba2784ea5544e2683b5e5cec22d0599940c1a) to the same ALM Proxy, and on October 29, 2026 the Spark SubProxy ([`0x3300f198988e4C9C63F75dF86De36421f06af8c4`](https://etherscan.io/address/0x3300f198988e4C9C63F75dF86De36421f06af8c4)) [bridged 100.0M sUSDS to Arbitrum](https://etherscan.io/tx/0x8075abed11525daa47909008d54964e3656bf771bfc0d48f329d1a886abeb8b5).

**2. LayerZero V2 OFT Adapters** (USDS to Solana + Avalanche only; security analyzed in [LayerZero V2 Dependency](#layerzero-v2-dependency)):

| Token | OFT Adapter | Chains (peers) | Locked at snapshot |
|-------|-------------|----------------|--------------------|
| USDS | [`0x1e1D…01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | Solana (EID 30168), Avalanche (EID 30106) | ~4.18M USDS |
| sUSDS | [`0x85A3…f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | Avalanche (EID 30106) | 0 |

**3. Gnosis xDAI bridge (third-party, not SkyLink).** The Gnosis Chain [xDAI bridge](https://docs.gnosischain.com/bridges/About%20Token%20Bridges/xdai-bridge) ([`0x4aa4…5016`](https://etherscan.io/address/0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016), `XDaiForeignBridge`) has locked USDS as the backing for Gnosis's native xDAI since November 7, 2025. At the snapshot it holds **1.0M USDS plus 36.07M sUSDS** (~$41.3M); idle USDS above `minCashThreshold` (1M) is invested in sUSDS. It is secured by a 4-of-7 validator set ([`0xe157…201E`](https://etherscan.io/address/0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E)), and an 8-of-15 Gnosis governance Safe ([`0x42F3…A3F6`](https://etherscan.io/address/0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6)) owns and can upgrade it. Releases to Ethereum are capped by `executionDailyLimit` = 15M USDS. The bridge holds no `wards` on USDS or sUSDS, so a compromise could release the ~$41M escrow to xDAI claimants but cannot create USDS on Ethereum.

The legacy DAI **Teleport** fast-withdrawal bridges (`ARBITRUM_TELEPORT_BRIDGE`, `OPTIMISM_TELEPORT_BRIDGE`, `STARKNET_TELEPORT_BRIDGE`) also exist in the chainlog but are DAI-era infrastructure and out of scope for USDS/sUSDS.

### USDS-USDC PSM Stack

| Contract | Address | Role |
|----------|---------|------|
| **USDS LitePSM Wrapper** | [`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c) | `WRAPPER_USDS_LITE_PSM_USDC_A`. User-facing USDC↔USDS swap (`buyGem` / `sellGem`). Atomic. Deployed 2024-09-03 |
| Underlying LitePSM (DAI-USDC) | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `MCD_LITE_PSM_USDC_A`. Holds the swap logic. `tin = 0`, `tout = 0`, `buf = 800,000,000 DAI` (794.7M DAI held at snapshot) |
| USDC Pocket | [`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) | `MCD_LITE_PSM_USDC_A_POCKET`. Custodies the USDC reserves (~1.82B USDC at snapshot) |
| LitePSM Jar | [`0x69cA348Bd928A158ADe7aa193C133f315803b06e`](https://etherscan.io/address/0x69cA348Bd928A158ADe7aa193C133f315803b06e) | `MCD_LITE_PSM_USDC_A_JAR`. Receives swap fees (currently zero) |
| **LitePSM Mom (emergency halt)** | [`0x467b32b0407Ad764f56304420Cddaa563bDab425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) | `LITE_PSM_MOM`. Authority = Chief, owner = PauseProxy. Lets the elected Chief hat instantly halt PSM swaps without the 48 h GSM delay |
| Emergency Halt Spell Factory | [`0xB261b73698F6dBC03cB1E998A3176bdD81C3514A`](https://etherscan.io/address/0xB261b73698F6dBC03cB1E998A3176bdD81C3514A) | `EMSP_LITE_PSM_HALT_FAB` |
| CRON LitePSM Job | [`0x0C86162ba3E507592fC8282b07cF18c7F902C401`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401) | Keeper job that periodically tops up / fills the PSM buffer |

### Sky / MakerDAO Core (governs USDS, sUSDS, PSM)

| Contract | Address | Role |
|----------|---------|------|
| MCD VAT (core ledger) | [`0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) | The accounting nucleus of the Sky/Maker system. `debt()` ≈ 8.43B (rad-normalized) |
| MCD Vow (surplus / sin buffer) | [`0xA950524441892A31ebddF91d3cEEFa04Bf454466`](https://etherscan.io/address/0xA950524441892A31ebddF91d3cEEFa04Bf454466) | Stability fee accumulator; receives the SSR drip differential |
| MCD Pot (DSR) | [`0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7`](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7) | DAI Savings Rate pot — predates sUSDS, parallel rate accumulator |
| **MCD Pause** | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | DSPause with `delay() = 172800` seconds (**48 hours GSM delay**). `owner = address(0)`; only spells elected by Chief can schedule |
| **MCD PauseProxy** | [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) | The address governance executes as. Holds `wards[USDS]==1`, `wards[sUSDS]==1`, and is the upgrade authority for both proxies |
| **MCD Chief (governance vote)** | [`0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) | DSChief. Continuous-approval voting over SKY token. Current `hat()` = [`0x8c7eE657FcbEda789F45A6660Dc592a6E30fE88c`](https://etherscan.io/address/0x8c7eE657FcbEda789F45A6660Dc592a6E30fE88c) ("2026-11-19 MakerDAO Executive Spell", executed November 23, 2026, [tx](https://etherscan.io/tx/0x4babaf4be2f91bdcf19e8c7213144ed0481d05ac468bb27aae24de272a644e29); `done() == true`) |
| MCD Spot (price feed router) | [`0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3`](https://etherscan.io/address/0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3) | Price oracles for VAT collateral types |
| SKY governance token | [`0x56072C95FAA701256059aa122697B133aDEd9279`](https://etherscan.io/address/0x56072C95FAA701256059aa122697B133aDEd9279) | `MCD_GOV`. Total supply ~23.44B SKY |
| SPK token | [`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066) | Spark/Sky governance subsystem token (USDS Staking Rewards) |
| USDS Staking Rewards | [`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af) | `REWARDS_USDS_SPK`. Out-of-scope for this report but referenced by yvUSDS-1 |
| **SP-BEAM (rate module)** | [`0x36B072ed8AFE665E3Aa6DaBa79Decbec63752b22`](https://etherscan.io/address/0x36B072ed8AFE665E3Aa6DaBa79Decbec63752b22) | `MCD_SPBEAM`. Holds `sUSDS.wards == 1` (granted April 21, 2025, [tx](https://etherscan.io/tx/0xc147db030f1033e0fcc151f8c74236eee05604d16be7403f5becf193b2b1e45f)). Its only `bud`, a 2-of-3 Safe ([`0xe1c6f81D0c3CD570A77813b81AA064c5fff80309`](https://etherscan.io/address/0xe1c6f81D0c3CD570A77813b81AA064c5fff80309)), can set SSR, DSR and configured stability fees without the GSM delay. Each call is bounded by `cfgs(id)` (SSR: 2%–30%, ≤4 percentage points per change) and spaced by `tau = 57600` s (16 h) |
| SP-BEAM Mom | [`0xf0C6e6Ec8B367cC483A411e595D3Ba0a816d37D0`](https://etherscan.io/address/0xf0C6e6Ec8B367cC483A411e595D3Ba0a816d37D0) | `SPBEAM_MOM`. Authority = Chief, owner = PauseProxy; lets the hat halt SP-BEAM without the GSM delay |
| IAM AutoLine | [`0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3`](https://etherscan.io/address/0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3) | `MCD_IAM_AUTO_LINE`. Permissionless `exec(ilk)` raises an ilk's `line` by up to `gap` per `ttl`, capped at a governance-set maximum. Wards: PauseProxy and `LINE_MOM` |
| Allocator Roles | [`0x9A865A710399cea85dbD9144b7a09C889e94E803`](https://etherscan.io/address/0x9A865A710399cea85dbD9144b7a09C889e94E803) | `ALLOCATOR_ROLES`. Ward: PauseProxy. Assigns each `ALLOCATOR-*` ilk an admin (the Prime's SubProxy), which grants the roles that call `draw`/`wipe` on the allocator vault |

## Audits and Due Diligence Disclosures

Sky/MakerDAO is one of the most extensively audited DeFi protocols. Coverage for the in-scope contracts:

### USDS Token

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| **ChainSecurity** | Sep 4, 2024 | USDS core (Endgame launch) | [PDF](https://github.com/sky-ecosystem/usds/blob/dev/audit/20240904-ChainSecurity_MakerDAO_USDS_audit.pdf) |
| **Cantina** | Jul 3, 2024 | USDS review | [PDF](https://github.com/sky-ecosystem/usds/blob/dev/audit/) |
| **Cantina** | Nov 24, 2023 | NST (USDS predecessor) | [PDF](https://github.com/sky-ecosystem/usds/blob/dev/audit/) |

### sUSDS

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| **ChainSecurity** | Sep 30, 2024 | Savings USDS contract | [PDF](https://github.com/sky-ecosystem/sdai/blob/susds/audit/20240930-ChainSecurity_MakerDAO_Savings_USDS_audit.pdf) |
| **Cantina** | Sep 26, 2024 | sUSDS review | [PDF](https://github.com/sky-ecosystem/sdai/blob/susds/audit/20240926-cantina-report-maker-susds.pdf) |

### LitePSM & Wrapper

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| **ChainSecurity** | (Lite PSM) | Lite PSM audit | [PDF](https://github.com/sky-ecosystem/dss-lite-psm/blob/main/audits/ChainSecurity_MakerDAO_PSM_Lite_audit.pdf) |
| **Cantina** | (Lite PSM) | Lite PSM review | [PDF](https://github.com/sky-ecosystem/dss-lite-psm/blob/main/audits/report-review-makerdao-dss-lite-psm.pdf) |

### Endgame Stack (SKY token, LockStake, VoteDelegate, Flappers, Toolkit)

| Auditor | Date | Scope |
|---------|------|-------|
| ChainSecurity | Sep 2024 | Multiple Endgame contracts |
| Cantina | 2024 | Endgame Toolkit, Vote Delegate, Flappers |
| **Sherlock public contest** | Aug 5, 2024 | MakerDAO Endgame → [report](https://github.com/sherlock-protocol/sherlock-reports/blob/main/audits/2024.08.05%20-%20Final%20-%20MakerDAO%20Endgame%20Audit%20Report.pdf) |

### Legacy MCD (still in use — VAT, Vow, Pot, Pause, Chief)

| Auditor | Coverage |
|---------|----------|
| Trail of Bits | MCD core |
| PeckShield | MCD core |
| Quantstamp | Liquidations 2.0 |
| ChainSecurity | Multiple modules over the years |
| ABDK | Vote Delegate |

**Architecture complexity:** USDS itself is a thin ERC-20 with permit + ERC-1271 (UUPS upgradeable). sUSDS is a thin ERC-4626 with a `chi`/`ssr` accumulator. The USDS-USDC swap path however involves a non-trivial chain: USDS ↔ DAI converter ↔ DAI Lite-PSM ↔ USDC Pocket. While each module is small, the chained dependency means a fault in any one of the four contracts halts USDS-USDC swaps.

### Bug Bounty

- **Sky on Immunefi** ([immunefi.com/bug-bounty/sky](https://immunefi.com/bug-bounty/sky/)) — live since Feb 10, 2022, last updated Sep 4, 2026
- **Maximum payout: $10,000,000** for critical smart-contract vulnerabilities. Minimum critical: $150K. Reward = 10% of funds at risk, capped at $10M
- **255 assets in scope**, including USDS, sUSDS, LitePSM, DAI-USDS Converter, Chief, Pause, VAT
- Proof-of-concept required for all severities. Payouts in DAI or USDS at $1:1

### Safe Harbor (SEAL)

- Sky is **not** listed on the SEAL [Safe Harbor registry](https://safeharbor.securityalliance.org/) at the time of writing.

## Historical Track Record

- **USDS contract deployed:** September 2, 2024 ([tx `0xdf7d4ba4…b21c`](https://etherscan.io/tx/0xdf7d4ba4114f654a4ef64f74099be3fc91358610078febe5be68af6cf257b21c)) — **~26 months** in production
- **sUSDS deployed:** September 4, 2024 ([tx `0xe1be00c4…2c00`](https://etherscan.io/tx/0xe1be00c4ea3c21cf536b98ac082a5bba8485cf75d6b2b94f4d6e3edd06472c00))
- **LitePSM Wrapper deployed:** September 3, 2024 ([tx `0x43ddae74…8585`](https://etherscan.io/tx/0x43ddae74123936f6737b78fcf785547f7f6b7b27e280fe7fbf98c81b3c018585))
- **Underlying MakerDAO system:** live since December 2017 (Multi-Collateral DAI) — **~8.9 years**. Single-Collateral DAI launched November 2017.
- **TVL growth (USDS, [DefiLlama stablecoin id 209](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)):** $98.5M on launch day → **~$3.16B on November 25, 2026 00:00 UTC** (cross-chain); ~$3.16B on Ethereum mainnet by raw ERC-20 `totalSupply()` at the November 24 snapshot
- **Sky Lending TVL** ([DefiLlama](https://defillama.com/protocol/sky-lending)): ~$2.91B (Ethereum-only)
- **sUSDS adoption:** ~1.94B USDS locked in sUSDS — **about 61.5% of mainnet USDS supply** is staked in the savings vault, down from ~70% before the November 19 outflow. A further ~158.3M USDS sits in the newer **stUSDS** staking module ([`0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9)), assessed separately in [sky-stusds.md](sky-stusds.md)
- **Peg history (USDS, past 365 days via [CoinGecko](https://www.coingecko.com/en/coins/usds) daily series):**
  - Min: **0.9968** (October 30, 2026); the hourly series over the last 90 days bottoms at **0.9962** (November 19, 2026 21:00 UTC), 0.38% off peg, during the redemption wave described below
  - Max: **1.0011** (February 23, 2026)
  - Latest: 0.9999 (within peg)
  - Earlier stress: during the October 2025 market-wide stablecoin stress the daily series bottomed at **0.9975** (October 11, 2025) and the hourly series at **0.9947** (October 6, 2025)
- **Past security incidents (relevant to USDS path):**
  - **Black Thursday (March 12, 2020) — DAI/MCD:** Cascading ETH price crash combined with mempool congestion caused some liquidation auctions to be won at $0 bids. ~$6M of system shortfall was absorbed by minting MKR to recapitalize. Affected users were later partly compensated via DAO vote. The liquidation system was redesigned (Liquidations 2.0, audited by Quantstamp). USDS did not exist yet
  - **USDC depeg (March 11, 2023):** Circle's USDC briefly traded as low as ~$0.88 following Silicon Valley Bank exposure. DAI traded down with it (~$0.88 floor) because of the USDC PSM dependency. Sky/Maker responded by widening PSM fees temporarily and accelerating diversification into RWAs. USDS would inherit the same USDC peg exposure today — a USDC depeg is the largest non-bug peg risk to USDS
  - **No USDS/sUSDS/LitePSM-specific exploit or loss** since their respective launches (~26 months at this snapshot)
  - **Illicit-finance report and redemption wave (November 19–20, 2026):** an Inca Digital investigation reported that ~$518M of LitePSM swaps traced to illicit actors, including ~$102M attributed to North Korea-linked actors; Sky disputes the findings, and Upbit and Bithumb added caution flags to SKY and USDS ([Unchained](https://unchainedcrypto.com/skys-usds-supply-drops-2-billion-as-report-traces-518-million-in-illicit-linked-swaps/), [The Crypto Times](https://www.cryptotimes.io/2026/11/23/sky-usds-hit-with-caution-flags-after-518m-illicit-flow-report-north-korea-ties/)). These are third-party allegations not verified here. Onchain, a single EOA ([`0x176F…a132`](https://etherscan.io/address/0x176F3DAb24a159341c0509bB36B833E7fdd0a132)) redeemed **1,488M USDS for USDC** through the LitePSM Wrapper in four transactions on November 19 at 15:48–15:52 UTC (e.g. [400M](https://etherscan.io/tx/0xbb6b66dcc79efb6a4d9861f3a8e7598b2b93697295ab79229a254240c08ea623)). Between 15:43 and 16:03 UTC mainnet supply fell from 5.09B to 3.51B and the Pocket from 2.53B to 0.96B USDC; the Pocket bottomed at **$799.8M** ([block 26450465](https://etherscan.io/block/26450465), 16:56 UTC) before allocator repayments refilled it to $1.82B by the snapshot. Pocket outflows totalled ~$3.18B over November 18–22. The LitePSM never halted and kept `tin = tout = 0`, and the hourly USDS price stayed at or above 0.9962. No exploit or redemption failure occurred.
  - **Vault offboarding (November 23, 2026):** the [November 19 executive spell](https://etherscan.io/tx/0x4babaf4be2f91bdcf19e8c7213144ed0481d05ac468bb27aae24de272a644e29) set `line = 0` for `ETH-A`, `ETH-B`, `ETH-C`, `WSTETH-A` and `WSTETH-B` (existing loans continue, no new borrowing), denied the legacy `MCD_JOIN_PSM_USDC_A` and `MCD_CLIP_PSM_USDC_A` on the VAT, and removed `PSM-USDC-A` from the ilk registry ([TokenPost](https://www.tokenpost.com/news/technology/56187))
- **TVL trend:** Cross-chain supply contracted through mid-2026 (~8.84B in May → ~8.19B in June → ~6.64B on September 9), recovered to ~7.07B on October 16, 2026, and fell to ~5.36B by November 16 and **~3.16B** by November 25, 2026 ([DefiLlama](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)). Most of the November decline came in two waves of LitePSM redemptions: ~840M of USDC left the Pocket over November 5–16, and ~$1.58B of USDS supply was redeemed within 20 minutes on November 19. Mainnet supply is down ~40% since November 16, ~53% since September 9 and ~60% since June 2026; sUSDS `totalAssets()` fell from 3.67B to 1.94B over the last week. Allocators repaid debt to refill the Pocket: `ALLOCATOR-SPARK-A` fell from 3.69B to 2.77B, `ALLOCATOR-OBEX-A` from 406M to 227M, and `ALLOCATOR-BLOOM-A` (Grove) from 1.49B to 1.30B.
- **Cross-chain repatriation (July 13 and October 19, 2026):** the Spark Liquidity Layer withdrew its Base, Optimism and Unichain USDS/sUSDS positions to mainnet through the canonical rollup bridges on July 13, cutting native-escrow USDS from ~448M to ~102M and escrowed sUSDS from ~812M to ~343M. On October 19 it withdrew a further 99.33M USDS from the Arbitrum escrow, leaving ~4.4M USDS in all native escrows; escrowed sUSDS later rose to ~443M after a 100M sUSDS Spark deposit to Arbitrum on October 29. These were allocator rebalances executed over the ordinary bridge path, not bridge failures; escrow contracts, `wards`, and bridge ownership were unchanged.

## Funds Management

### How USDS Is Issued

USDS has no dedicated CDP system. Every USDS in existence has come from one of the following channels:

1. **DAI → USDS via the DAI-USDS Converter** ([`0x3225737a…B276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A))
   - User sends `n` DAI → receives `n` USDS, no fee, single transaction
   - Implementation: pulls DAI to itself, then calls `usdsJoin.exit()` to mint USDS to the caller
   - Reverse direction is symmetric and identical
   - **Implication:** USDS is fungible with DAI at protocol level. Any DAI holder is a latent USDS arbitrageur

2. **USDC → USDS via the LitePSM Wrapper** ([`0xA188EEC8…0f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c))
   - User calls `sellGem(usr, gemAmt)`: wrapper pulls USDC → calls underlying LitePSM `sellGem()` → DAI minted to wrapper → wrapper calls `daiUsds.daiToUsds()` → USDS delivered to user
   - Reverse (`buyGem(usr, gemAmt)`): user sends USDS → converter swaps to DAI → LitePSM `buyGem()` exchanges DAI for USDC out of the Pocket → USDC delivered to user
   - **Fees:** `tin = tout = 0` (zero). The LitePSM `buf` (800M DAI) acts as a hot supply buffer so user swaps do not have to wait for VAT bookkeeping. 794.7M DAI was held against that target at the snapshot
   - **Capacity:**
     - USDC → USDS direction: bounded by `buf` (800M DAI per refill cycle, keeper-replenished) and ultimately by the Sky governance-set `line` for the PSM ilk in the VAT
     - USDS → USDC direction: bounded by the **Pocket USDC balance** (currently **~1.82B USDC**)
   - **Atomic:** yes — entire path completes in one transaction

3. **Prime allocator vaults** — the largest issuance channel after the PSM. Sky governance grants an allocator (a "Prime" or "Star") a VAT ilk with a debt ceiling; the allocator draws USDS and deploys it into onchain lending, tokenized treasuries, and credit strategies. At the snapshot, per-ilk debt (`Art × rate` from `MCD_VAT.ilks`): **Spark** (`ALLOCATOR-SPARK-A`) **~$2.77B**, **Grove** (`ALLOCATOR-BLOOM-A`) **~$1.30B**, **Obex** (`ALLOCATOR-OBEX-A`) **~$227M**, plus `ALLOCATOR-GROVE-A` (~$130.0M) and `ALLOCATOR-PRYSM-A` (~$25.0M, administered by the Osero SubProxy); **Keel** (`ALLOCATOR-NOVA-A`), `ALLOCATOR-PATTERN-A` and `ALLOCATOR-INTERVAL-A` are at 0. Together ~$4.45B, ~52.8% of VAT debt. Each ilk's `line` is raised by the permissionless AutoLine up to a governance-set maximum (Spark: up to $10B, at most +$1.5B per 24 h; Grove `BLOOM`: $5B, +$500M; Obex: $2.5B, +$50M). What backs these positions is discussed under [Collateralization](#collateralization)

4. **D3M (Direct Deposit Module)** — Sky governance can mint USDS directly to lending markets (Spark, Aave-Lido) up to per-market debt ceilings, where the USDS is borrowed by users. At the snapshot the `DIRECT-SPK-AAVE-LIDO-USDS` ilk carries **zero** debt and the Spark Aave-Lido USDS pool ([`DIRECT_SPK_AAVE_LIDO_USDS_POOL`](https://etherscan.io/address/0xbf674d0cD6841C1d7f9b8E809B967B3C5E867653)) holds 0 USDS, so this channel is dormant

5. **MakerDAO/Sky CDPs (ETH-A, ETH-B, ETH-C, wstETH-A, wstETH-B, WBTC-C, RWA-* vaults, LockStake)** — borrowers post collateral, draw DAI (which they can then swap to USDS via the converter). These vaults are over-collateralized at the ilk level (typical liquidation ratios 145–170% for crypto, 100%+ for RWAs). Combined crypto-CDP and LockStake debt is now **~$530M**, ~6.3% of VAT debt. Since the November 23 spell every crypto CDP ilk (`ETH-*`, `WSTETH-*`, `WBTC-*`) has `line = 0`, so these loans can be repaid but not increased

All channels ultimately settle through **MCD_VAT** ([`0x35D1b3F3…492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B)), which at the snapshot reports `debt()` in rad units → **~8.43B normalized debt**. The corresponding DAI + USDS issued supply (Ethereum mainnet) is ~4.36B + ~3.16B ≈ **~7.52B**. The ~$916.1M difference is internal `vat.dai` that has not been exited to ERC-20: the Vow's **$732.9M** surplus (`vat.dai(MCD_VOW)`) and **$182.7M** of DSR deposits held by [MCD_POT](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7) (`vat.dai(MCD_POT)`), with ~$0.5M in other internal balances.

### Accessibility

| Operation | Permission | Atomic? | Fees | Limits |
|-----------|-----------|---------|------|--------|
| USDC → USDS (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | `buf = 800M DAI` per fill; capped by PSM `line` in VAT |
| USDS → USDC (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | Pocket USDC balance (~1.82B) |
| DAI ↔ USDS (Converter) | Permissionless | Yes (1 tx) | 0 | None — direct mint/burn through USDS_JOIN |
| Deposit USDS → sUSDS | Permissionless | Yes (1 tx) | 0 | None (sUSDS is unbounded ERC-4626) |
| Withdraw USDS ← sUSDS | Permissionless | Yes (1 tx) | 0 | None |
| **Mint USDS directly** | **Wards-gated** — only contracts in `USDS.wards == 1` (currently USDS_JOIN and PauseProxy) | — | — | Only PauseProxy can grant new wards; new ward requires a passed Chief spell + 48 h GSM delay |

There is **no whitelist on swaps**, no KYC requirement, **no cooldown**, and **no withdrawal queue** for sUSDS. All flows are single-transaction.

### Token Mint Authority

**Mint mechanism:** `wards` mapping on the USDS proxy. `mint(to, value)` is `auth` (any address with `wards == 1`); `burn` is permissionless for the holder or an approved spender. USDS_JOIN mints only on `exit`, which first moves the caller's internal `vat.dai` to the join, so every USDS minted through the join is a liability already recorded in MCD_VAT.

**Mint requires backing:** Through USDS_JOIN, the internal `vat.dai` must already exist. That `vat.dai` comes from VAT debt: collateralized CDP draws, LitePSM sales of USDC, `vat.suck` for savings interest, or Prime allocator draws. Allocator draws are bounded by the ilk's `line` but are not backed at mint time; backing is whatever the allocator deploys the USDS into. PauseProxy can mint directly without backing.

**Per-address mint authority** (verified onchain at block [26487462](https://etherscan.io/block/26487462) from `Rely`/`Deny` events on the USDS proxy since deployment; each candidate rechecked with `wards(address)`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) (USDS_JOIN) | ✓ | ✓ | `wards == 1` | Mints against internal `vat.dai`; no admin functions or `wards` of its own |
| [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) (MCD_PAUSE_PROXY) | ✓ | ✓ | `wards == 1`; upgrade authority | Executes only spells passed by Chief and delayed 48 h by MCD_PAUSE. Can also `rely` new minters or upgrade the implementation |

Of the three historical `Rely`/`Deny` candidates, only these two hold `wards == 1`. The OFT adapters, native token bridges and DAI-USDS converter hold no USDS `wards`.

**Upstream `vat.dai` creation:** any MCD_VAT ward can create internal `vat.dai` (`suck`), which USDS_JOIN will exit as USDS. VAT `rely` emits no event, so the ward set was reconstructed two ways. First, every address in the onchain chainlog was tested. Second, all executed spells (every `exec` on MCD_PAUSE, 287 through the snapshot) and the 251 deployer transactions before the first spell were traced with `debug_traceTransaction`. That found 164 `Vat.rely`/`deny` calls, all from PauseProxy or the 2019 `DssDeploy`/`VatFab` deployers (which denied themselves). The [November 19 spell](https://etherscan.io/tx/0x4babaf4be2f91bdcf19e8c7213144ed0481d05ac468bb27aae24de272a644e29) only denied the legacy `MCD_JOIN_PSM_USDC_A` and `MCD_CLIP_PSM_USDC_A`, leaving **123 current wards**; both methods give the same set. All are Sky contracts deployed and wired by governance: PauseProxy, END/ESM, Jug, Spot, Dog, Pot, sUSDS, stUSDS, LockStake engine and clipper, `MCD_FLASH`, `MCD_KICK`, `MCD_VEST_*`, `DIRECT_HUB`, AutoLine, `LINE_MOM`, and collateral joins and clippers. None is an EOA or Safe.

**Rate limits / supply caps:** Global `Vat.Line()` = ~$12.03B against $8.43B of debt. Per-ilk `line`; allocator and LockStake lines are managed by AutoLine (`exec` is permissionless and raises `line` by at most `gap` per `ttl` up to a governance-set maximum). PauseProxy minting is uncapped.

**Backing check at mint time:** Atomic for the PSM (USDC in) and CDPs (collateral locked, `spot` checked). Deferred for Prime allocators (drawn against `line`, backed by downstream positions). None for `vat.suck`, which creates `vice` that is covered from Vow surplus.

### Collateralization

USDS does **not** have a clean "this collateral backs this token" picture — it inherits the full Sky/MakerDAO collateral book. Per-ilk debt below is `Art × rate` read from `MCD_VAT.ilks(ilk)` at the snapshot block, against total VAT `debt()` of ~8.43B:

| Class | Ilk(s) | Debt at snapshot | Share of VAT debt | Role in backing |
|-------|--------|-----------------:|------------------:|-----------------|
| **USDC PSM (LitePSM)** | `LITE-PSM-USDC-A` | **~$2.61B** | 31.0% | Only ~$1.82B of this is external collateral (USDC in the Pocket); the other ~$794.7M is system-issued DAI pre-minted into the PSM as swap inventory, so it backs nothing on its own. Observatory books this line at the Pocket value (~$1.82B), not the ilk debt. Largest single backing line and the source of USDS-USDC swap capacity |
| **Prime allocator vaults** | `ALLOCATOR-SPARK-A` (~$2.77B), `ALLOCATOR-BLOOM-A` / Grove (~$1.30B), `ALLOCATOR-OBEX-A` (~$227M), `ALLOCATOR-GROVE-A` (~$130.0M), `ALLOCATOR-PRYSM-A` (~$25.0M), `ALLOCATOR-NOVA-A` / Keel and two others (0) | **~$4.45B** | 52.8% | USDS drawn by allocators and deployed into onchain lending, stablecoins, tokenized credit and OTC lending. Backing quality is the quality of those downstream positions, not of a liquidatable onchain CDP |
| Crypto-backed CDPs | `ETH-A`, `ETH-B`, `ETH-C`, `WSTETH-A`, `WSTETH-B`, `WBTC-A`, `WBTC-B`, `WBTC-C` | ~$372M | 4.4% | Over-collateralized loans, ~145–170% liquidation ratio. Volatile but onchain-liquidatable. All eight ilks now have `line = 0` (no new borrowing) |
| LockStake (SKY staked) | `LSEV2-SKY-A` | ~$158M | 1.9% | Borrow against locked SKY — governance-token-backed, reflexive. The ilk `line` equals its current debt, so no new LockStake borrowing is available at the snapshot |
| Legacy RWA vaults | `RWA002-A` (New Silver, ~$12.4M), `RWA004-A` (Harbor Trade, ~$1.5M), `RWA005-A` (FortunaFi, ~$2.8M), `RWA009-A` (HVB, ~$49.6M) | ~$66.3M | 0.8% | Offchain custody / credit risk; the residual of the original RWA program |
| **System unbacked debt (`vice`)** | not an ilk — `MCD_VAT.vice()`, all attributed to MCD_VOW | **~$772.0M** | 9.2% | The `sin` side of the ledger. Structurally generated by savings accrual: `sUSDS.drip()` and `Pot.drip()` call `vat.suck(vow, …)` to mint SSR/DSR interest, which creates unbacked debt at the Vow. See the Vow position below |
| D3M (Spark/Aave Direct Deposit) | `DIRECT-SPK-AAVE-LIDO-USDS` and four legacy D3M ilks | **0** | 0% | Dormant at the snapshot |

The table reconciles exactly against the VAT identity `debt = Σ(Art × rate) + vice`: summing all 32 ilks in the [ILK_REGISTRY](https://etherscan.io/address/0x5a464C28D19848f44199D003BeF5ecc87d090F87#readContract) gives **$7,659,530,957.31**, plus `vice()` of **$771,987,604.66**, equals `debt()` of **$8,431,518,561.97** to the cent. `PSM-GUSD-A`, `PSM-PAX-A` and, since November 23, `PSM-USDC-A` have left the registry and carry zero `Art`.

**The Vow's net position is a deficit, not a surplus.** At the snapshot the Vow holds **$732.9M** of surplus DAI (`vat.dai(vow)`) against **$772.0M** of unbacked debt (`vat.sin(vow)`, all of the system's `vice`), leaving a **net −$39.1M**. Of that debt, $229.1M is queued for `flog` (`vow.Sin()`) and none is on auction (`vow.Ash() = 0`). The legacy surplus-auction path is disabled — `vow.bump() = 0` and `vow.hump() = 2^256−1` make `flap()` unreachable — so surplus is handled outside the Vow's own auction machinery. Observatory books the same ~$39.1M as its "Operating Cash Balance" liability line.

Cutting the same book by *underlying asset* rather than by ilk, SkyEco / Observatory's [USDS collateral-backing API](https://observatory.data.blockanalitica.com/sky/backed/items/) reports at 2026-11-24 20:40 UTC: stablecoins ~$2.91B (45.9%), onchain crypto lending ~$1.94B (30.6%), OTC crypto lending ~$883M (13.9%), AAA corporate debt ~$501M (7.9%), legacy RWA (Observatory category "Other") ~$66.3M, basis trade ~$20.6M and private credit ~$15.3M. The short-duration Treasury bill category (~$1.33B in September, Janus Henderson Treasury Fund and BlackRock BUIDL) no longer appears; its exit coincides with the fall in `ALLOCATOR-BLOOM-A` debt. **Offchain or tokenized credit exposure therefore totals ~$1.49B — ~23.5% of Observatory's ~$6.33B loan-coverage backing**, leaving ~76.5% onchain. The offchain share rose from ~19.8% on November 16 because the November redemptions drew down the onchain PSM and lending lines while the offchain positions stayed in place. Maintenance-coverage backing is ~$6.94B and total collateral value ~$9.60B, the latter ~114% of VAT debt.

**A note on denominators.** The table above is expressed as a share of `VAT.debt()` because that is the issuance side of the ledger, and it is the only view derivable purely onchain. It is *not* a backing denominator: it includes $772.0M of `vice` (which is unbacked by construction) and prices the PSM at ilk debt rather than at the Pocket's USDC. Any claim about the *composition of collateral* uses Observatory's ~$6.33B loan-coverage backing instead. The same offchain exposure is ~17.6% of VAT debt but ~23.5% of backing; the backing figure is the meaningful one, and this report uses it wherever collateral quality is being characterised. Observatory's per-asset figures are reported holdings with periodic attestation for the offchain slice, not independently verified reserves — only the ~$1.82B Pocket USDC and the onchain lending and LP positions can be confirmed by direct contract reads.

**System-level overcollateralization** is not directly readable from a single onchain call — it requires aggregating per-ilk `Art × rate` (debt) and `ink × oracle price × liquidation-ratio` (locked collateral value). Observatory's [balance-sheet aggregate](https://observatory.data.blockanalitica.com/financials/balance-sheet/aggregates/?group_by=month) reports **~$7.67B assets** against **~$7.70B liabilities** for its November 24, 2026 snapshot, a ~$32M shortfall (the September 30, 2026 month-end row shows ~$11.41B against ~$11.47B). This is a book-value frame, not a solvency measure. It counts the $157M Sky Capital Buffer as an asset and books the Spark, Grove `BLOOM` and Obex vaults at their drawn debt (~$4.30B), not at the value of what they hold. It also omits `ALLOCATOR-GROVE-A` (~$130.0M) and `ALLOCATOR-PRYSM-A` (~$25.0M) from assets while counting the USDS they issued as liabilities; booking those two at debt would turn the shortfall into a ~$123M margin. The figure therefore neither confirms nor rules out allocator losses. The [initial per-allocator valuation](#allocator-backing-checks) puts every allocator at ~99.5% coverage or above; Spark is ~99.5% net of its Savings Vault liabilities. Onchain VAT debt is ~8.43B against ~7.52B Ethereum DAI + USDS issued supply.

**Key takeaway for the USDS holder:** the collateral mix is far better than a fiat-only stablecoin (no single banking dependency), but worse than a pure crypto-collateralized model — direct crypto-CDP backing is now only ~4.4% of VAT debt (and closed to new borrowing), and more than half of issuance sits in Prime allocator vaults whose assets are a mix of onchain lending, stablecoins, tokenized credit and OTC lending. **For a USDC→USDS→sUSDS user specifically**, the relevant backing slice is the **USDC PSM pocket** (~1.82B USDC, ~28.7% of loan-coverage backing), with the rest of the Sky book acting as a *secondary* solvency buffer. As long as the PSM peg arbitrage works, USDS effectively trades at the lower of `peg(DAI)` and `peg(USDC)`.

### Provability

- **sUSDS exchange rate:** `convertToAssets(shares)` is fully onchain via `chi` accumulator and `ssr` rate. Continuous accrual is a pure function of `ssr` and elapsed time since `rho` (last `drip` timestamp). At snapshot: `chi = 1.11749`, `ssr = 1.0000000011826…`, `rho = 1795552631` (2026-11-24 20:37 UTC)
- **System debt (VAT):** Readable onchain via `MCD_VAT.debt()` and per-ilk `urns(ilk, urn)`, `ilks(ilk).Art`, `ilks(ilk).rate`. Full reserve audit requires aggregating dozens of ilks but is mechanically possible from public RPC
- **USDC PSM Pocket:** `USDC.balanceOf(pocket)` is publicly callable — at snapshot returns 1.82B USDC
- **RWA / offchain-credit backing:** Less transparent. Legacy `RWA00x` ilks total only **~$66.3M** at the snapshot, but broader Observatory categories with offchain/tokenized credit exposure total **~$1.49B**: OTC crypto lending (~$883M), AAA corporate debt (~$501M), legacy RWA (~$66.3M), basis trade (~$20.6M) and private credit (~$15.3M). The underlying assets sit at TradFi custodians or offchain credit venues, so this remains the least directly verifiable slice of backing. Because ~52.8% of VAT debt is drawn by **Prime allocator vaults**, the ilk-level view alone does not reveal what backs it — that requires trusting Observatory's look-through into each allocator's positions. Measured on the backing side rather than the debt side, the offchain slice is ~23.5% of Observatory's ~$6.33B loan-coverage backing
- **Can admins mint USDS out of thin air?** Yes, by definition — Sky governance (PauseProxy) can `usds.rely(addr)` to grant `wards = 1` to any address, which then has unrestricted minting via the underlying contract. This change must go through Chief vote + 48 h GSM delay. At the snapshot, the *only* non-governance ward is `USDS_JOIN`, which itself only exits `vat.dai` already created in the VAT (see [Token Mint Authority](#token-mint-authority))

## Liquidity Risk

### Primary Exit Path: LitePSM Wrapper (USDS → USDC)

- **Direct 1:1 redemption** with zero fee. Atomic in a single transaction
- **Capacity (USDS → USDC):** bounded by **USDC balance in the Pocket = 1,817,800,321 USDC** at snapshot. That is ~1.82B exit capacity in a single tx with **0% slippage**
- **No cooldown, no queue, no per-user cap**. Anyone holding USDS can swap to USDC by calling `WRAPPER_USDS_LITE_PSM_USDC_A.buyGem(usr, gemAmt)`
- **Reverse direction (USDC → USDS)** is also atomic and zero-fee, bounded by the `buf` (800M DAI) per refill cycle. A CRON keeper job ([`CRON_LITE_PSM_JOB`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401)) regularly refills the buffer; under heavy demand the buffer can be refilled multiple times per day

### Secondary Path: DAI-USDS Converter

- Atomic 1:1 conversion of USDS → DAI (or DAI → USDS), zero fee
- Unbounded — settles directly through `USDS_JOIN` and `DAI_JOIN` against MCD_VAT
- Useful when a user wants to access DAI-paired DEX liquidity (which is much deeper than direct USDS pairs)

### Tertiary: sUSDS ERC-4626 Withdrawal

- `redeem(shares, receiver, owner)` returns USDS at the current `chi` rate, atomic, zero fee. It first calls `drip()`, which mints only the yield accrued since the last `rho` (`vat.suck(vow, sUSDS, diff)` then `usdsJoin.exit(sUSDS, diff)`), then burns the shares and transfers USDS the vault already holds (`usds.transfer(receiver, assets)` in the deployed [`SUsds` implementation](https://etherscan.io/address/0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0#code)). Principal is not minted on withdrawal: at the snapshot the vault held [1,940,034,691 USDS](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F#readContract) (`USDS.balanceOf(sUSDS)`) against `totalAssets()` of 1,940,034,911 — the ~220 USDS difference is yield accrued since the last `drip()` (~2 minutes earlier) but not yet minted. sUSDS redeemed ~1.28B USDS within 20 minutes on November 19 without any cap or delay. There is no per-block withdrawal cap or queue; every share is redeemable from the vault's own USDS balance

### DEX Liquidity

USDS DEX liquidity on Ethereum mainnet is meaningful but **not** the primary exit path — most large flows route through the PSM, not AMM pools. Top Ethereum pools touching USDS or sUSDS, from [DefiLlama yields](https://yields.llama.fi/pools) on November 24, 2026:

| Project | Pool | TVL ($) |
|---------|------|--------:|
| Sky Lending | sUSDS | ~$1.94B |
| SparkLend | USDS (two pools) | ~$161M + ~$137M |
| Sky Lending | stUSDS | ~$158M |
| Uniswap V4 | PYUSD-USDS | ~$100M |
| Sky Lending | USDS (Grove farming pool) | ~$79M |
| Uniswap V4 | USDT-USDS | ~$55M |
| Uniswap V4 | RLUSD-USDS | ~$50M |
| Morpho Blue | sUSDS market | ~$37M |
| Yearn | USDS | ~$28M |
| Centrifuge | USDS (Janus Henderson Treasury Fund) | ~$25M |

Direct **USDS-USDC** DEX liquidity is small (no Uniswap/Curve USDS-USDC pool sits above $10M at the snapshot). This is because the **PSM Wrapper provides zero-fee 1:1 USDC↔USDS swaps**, so DEX routes cannot meaningfully out-price the PSM — there is no incentive for LPs to build deep USDS-USDC pools. For any reasonable Yearn integration size, the PSM (with ~$1.82B Pocket depth) is the dominant exit path; DEX liquidity is a secondary concern only at the multi-hundred-million-dollar scale.

### Cross-Chain Liquidity

USDS and sUSDS reach other chains via **two Sky-governed bridge systems**, plus the third-party Gnosis xDAI bridge (full contract list in [Cross-Chain Bridges](#cross-chain-bridges-skylink)):

1. **Native canonical L2 token bridges (SkyLink)** — Base, Optimism, Unichain (OP Stack) and Arbitrum (Arbitrum Nitro gateway). L1 tokens are locked in a per-chain escrow and minted 1:1 on the L2 by that chain's own canonical bridge. These carry the **bulk** of cross-chain supply: ~4.5M USDS and ~443M sUSDS across the four escrows at the snapshot, with ~96.5% of the sUSDS in the Arbitrum escrow and ~89.7% of the USDS in the Base escrow after the July and October 2026 Spark repatriations. Security rests on each rollup's canonical bridge (battle-tested L1↔L2 messaging) plus PauseProxy governance; L2→L1 exits inherit the chain's challenge window (up to ~7 days on optimistic rollups). **No LayerZero / DVN trust assumption applies to these chains.**
2. **LayerZero V2 OFT Adapters** — USDS to **Solana + Avalanche only** (~4.18M USDS locked); the sUSDS OFT adapter currently locks 0. This is the only Sky bridge that appears on LayerZero Scan (Ethereum + Solana + Avalanche) and the only one carrying third-party-verifier (DVN) trust — analyzed in [LayerZero V2 Dependency](#layerzero-v2-dependency).

3. **Gnosis xDAI bridge** — locks ~1.0M USDS + ~36.1M sUSDS (~$41.3M) behind Gnosis's native xDAI under a 4-of-7 validator set and 8-of-15 Gnosis governance Safe; Sky governance does not control it.

Onchain verification confirms **neither the OFT adapters, the xDAI bridge nor any native bridge holds `wards` on USDS/sUSDS** — none can mint the underlying token; all lock-and-mint against escrowed supply. The native token bridges are warded by PauseProxy, and both OFT adapters are owned by PauseProxy.

In total ~8.7M USDS in Sky bridges (and ~443M sUSDS shares, ~$495M at `chi`) plus the ~$41.3M xDAI-bridge escrow sits outside Ethereum mainnet — matching DefiLlama's per-chain balances (Gnosis ~41.3M, Solana ~4.1M, Base ~4.0M, Arbitrum ~0.4M, Optimism/Unichain/Avalanche dust). For an Ethereum-mainnet-only Yearn strategy, cross-chain bridge exposure is operationally none.

### Historical Liquidity Under Stress

- During the October 2025 stablecoin stress event (USDS hourly low 0.9947 on October 6, 2025), USDS-USDC swaps via the PSM remained available throughout — the peg deviation was driven by secondary AMM markets, not by Pocket depletion
- Over November 5–16, 2026, ~840M USDC left the Pocket (3.51B → 2.67B) as USDS supply fell from 6.47B to 5.22B. The LitePSM processed the redemptions at `tin = tout = 0` with no halt, and the hourly USDS price stayed at or above 0.9985 over the window ([CoinGecko](https://www.coingecko.com/en/coins/usds))
- **November 19–20, 2026 redemption wave:** ~$1.58B of USDS supply was redeemed within 20 minutes on November 19, including 1,488M by a single EOA in four `buyGem` calls. The Pocket fell from 2.53B to a low of **$799.8M** ([block 26450465](https://etherscan.io/block/26450465)) and was refilled to 1.82B by the snapshot as allocators repaid debt and sold USDC back into the PSM. The LitePSM stayed at `tin = tout = 0` with no halt, and the hourly USDS low was 0.9962 ([CoinGecko](https://www.coingecko.com/en/coins/usds)). This is the largest single-day redemption test of the USDS exit path to date, and it cleared without a queue
- **`LITE_PSM_MOM.halt(...)` has never been invoked.** Full event-log scan of [`0x467b32b0407Ad764f56304420Cddaa563bDab425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) returns exactly **4 events** from deployment through the snapshot block, none of which are `Halt(address indexed psm, Flow indexed what)` (topic `0x495feb065552316a79c594a4305afbd632955a68b2c6f65ad8b2f62d150fea92`). The 4 events are 2× `SetOwner` at deployment and 2× `SetAuthority` (at deployment and on May 19, 2025, block [22517471](https://etherscan.io/block/22517471)); final owner = PauseProxy, final authority = Chief. The emergency-halt channel exists but has never been used

## Centralization & Control Risks

### Governance

Sky uses **token-weighted continuous-approval voting** rather than a multisig:

| Stage | Mechanism | Address |
|-------|-----------|---------|
| Vote | SKY holders lock SKY in **Chief** and approve a candidate "spell" address. Highest-voted spell becomes the **hat** | [`MCD_ADM = 0x929d…6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) |
| Execute | The hat schedules transactions on **MCD_PAUSE** (DSPause) which enforces a 48-hour delay | [`MCD_PAUSE = 0xbE28…38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3), `delay = 172800` |
| Apply | After the delay, MCD_PAUSE calls into **MCD_PAUSE_PROXY** which executes the spell's actions (e.g., changing `ssr`, granting `wards`, upgrading USDS implementation) | [`MCD_PAUSE_PROXY = 0xBE8E…98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) |
| Emergency halt | **LITE_PSM_MOM** can halt PSM swaps **without** the 48 h delay if the current Chief hat authorizes it (`authority = Chief, owner = PauseProxy`) | [`LITE_PSM_MOM = 0x467b…b425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) |

**Strengths:**
- Token-weighted vote in Chief is fully on-chain and continuously contestable — voters can re-deposit and shift weight at any time, providing fast response to malicious spells during the 48 h delay
- The 48 h `MCD_PAUSE.delay()` applies to every upgrade, ward change, and parameter change, meeting the rubric's 48h+ Score-1 timelock bar, and it has historically been sufficient for Sky's stakeholders to react and rotate the hat if needed. It can only be reduced through a passed spell that itself takes 48 h
- MCD_PAUSE has `owner = address(0)` — no admin shortcut
- Upgrades to USDS/sUSDS proxies require the PauseProxy to call `upgradeToAndCall` on the implementation. Same 48 h delay applies
- No EOA holds direct admin powers on USDS, sUSDS, LitePSM, or the Pocket. All `wards` on these contracts point to PauseProxy or Sky contracts; the one non-governance signer path is the SP-BEAM 2-of-3 Safe, which can move rates only within code-enforced bounds (see [Critical Permission Paths](#critical-permission-paths-and-weakest-link))

**Weaknesses:**
- **SKY token concentration risk:** voting weight is proportional to SKY locked. Onchain at the snapshot:
  - Total SKY locked in Chief: **7,120,918,969 SKY** (~30.4% of the 23.44B SKY supply)
  - Approvals for the current hat ([`0x8c7eE657FcbEda789F45A6660Dc592a6E30fE88c`](https://etherscan.io/address/0x8c7eE657FcbEda789F45A6660Dc592a6E30fE88c), the November 19, 2026 spell executed November 23): **6,698,176,582 SKY** (~28.6% of total supply; **~94.1% of locked SKY votes for the hat**)
  - Sky's [current-hat API](https://vote.sky.money/api/executive/hat?network=mainnet) and [supporter API](https://vote.sky.money/api/executive/supporters?network=mainnet), read on November 24, 2026, show six supporters for the current hat. The largest supporter, **cloaky**, has **2.78B SKY** (**41.48%** of hat approvals). The top 2 have **~79.4%** and the top 3 **~98.3%**. No single supporter currently exceeds 50%, but any two of the top three delegates exceed a majority of current-hat approvals. Tango, the largest supporter of the previous hat, does not support this one.

| Rank | Supporter | Vote-delegate address | SKY approving current hat | % of hat approvals |
|------|-----------|-----------------------|---------------------------|--------------------|
| 1 | cloaky | [`0x0f23…cc86`](https://etherscan.io/address/0x0f23de72e1581857eacd6308aebb69cf3a49cc86) | 2,778,551,781 | 41.48% |
| 2 | BLUE | [`0x173a…9558`](https://etherscan.io/address/0x173a1c04b79ed9266721c1154daa29addc0b9558) | 2,536,807,961 | 37.87% |
| 3 | Bonapublica | [`0xfc48…753d`](https://etherscan.io/address/0xfc48fbca739079aab08216c4d5e506b96593753d) | 1,265,914,335 | 18.90% |
| 4 | PBG | [`0x5552…b850`](https://etherscan.io/address/0x555230eca835a808518ec3ea3082f05502bab850) | 48,367,525 | 0.72% |
| 5 | Max Staking Yield | [`0xff76…ee2f`](https://etherscan.io/address/0xff7615e05ec1c8d5ded24ab50bf74432666bee2f) | 46,982,805 | 0.70% |
| 6 | WBC | [`0x4bed…ae90`](https://etherscan.io/address/0x4bed44a9839b8778f69bb6a6d9f843414377ae90) | 21,552,419 | 0.32% |

- **48 h delay is at the low end** for upgradeable stablecoin systems (compared to 7-day on many newer protocols). A determined attacker with sufficient SKY could theoretically push through harmful changes if they can hold the hat for 48 h without being out-voted
- **Privileged role: PauseProxy can mint USDS to anyone** by granting `wards = 1` to a new address. This is the same "governance can do anything" property all DAO-controlled stablecoins share. The 48 h delay + onchain visibility is the only constraint

### Critical Permission Paths and Weakest Link

A material loss here is a loss of the USDS backing or of the USDS held by sUSDS. Roles were read at block [26487462](https://etherscan.io/block/26487462): `wards` on USDS, sUSDS and the LitePSM from `Rely`/`Deny` events since deployment; MCD_VAT `wards` by testing every chainlog address; SubProxy `wards` from events; Mom `owner`/`authority`; SP-BEAM `buds` from `Kiss`/`Diss` events.

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Upgrade USDS / sUSDS (`upgradeToAndCall`), `rely` new USDS minters or VAT wards, `file` any VAT/PSM/sUSDS parameter; with a new minter, redeem unbacked USDS for the Pocket's USDC through the LitePSM | [MCD_PAUSE_PROXY](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB), reached only through a spell that is the Chief hat ([`MCD_ADM`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9)) and is plotted on [MCD_PAUSE](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | `delay() = 172800` (48 h); `MCD_PAUSE.owner = 0`; the hat must out-approve 6.70B SKY; a later hat can `drop` the plan during the delay | Everything: 3.16B USDS supply, 1.94B USDS in sUSDS, 1.82B USDC in the Pocket, all VAT collateral |
| Draw USDS against an `ALLOCATOR-*` ilk and deploy it (`AllocatorVault.draw`, buffer approvals) | Roles granted by each ilk admin in [ALLOCATOR_ROLES](https://etherscan.io/address/0x9A865A710399cea85dbD9144b7a09C889e94E803): the Prime SubProxy ([Spark](https://etherscan.io/address/0x3300f198988e4C9C63F75dF86De36421f06af8c4), [Grove](https://etherscan.io/address/0x1369f7b2b38c76B6478c0f0E66D94923421891Ba), [Obex](https://etherscan.io/address/0x8be042581f581E3620e29F213EA8b94afA1C8071), [Osero](https://etherscan.io/address/0x24fdcd3bFA5C2553e05B2f9AD0365EBC296278D3)). Each SubProxy's `wards` are PauseProxy and the Prime's StarGuard ([Spark](https://etherscan.io/address/0x6605aa120fe8b656482903E7757BaBF56947E45E), [Grove](https://etherscan.io/address/0xfc51CAa049E8894bEcFfB68c61095C3F3Ec8a880), [Obex](https://etherscan.io/address/0x987f1C31f9935e9926555BcFB76516bb2EcEccaD)), which executes only spells plotted by PauseProxy (`maxDelay = 604800`) | Ilk `line` via AutoLine (Spark ≤ $10B, +$1.5B per 24 h; Grove `BLOOM` ≤ $5B, +$500M; Obex ≤ $2.5B, +$50M) | $4.45B currently drawn; up to the AutoLine maxima |
| Move allocator-held funds between integrations (`MainnetController` relayer functions: deposits/withdrawals, Curve and OTC swaps, `transferAsset`, CCTP/LayerZero) | `RELAYER` on each Prime's controller ([Spark](https://etherscan.io/address/0xc953972Cd006d1f12686fd7185c6D443b15900Cd), which replaced controller [`0x5c46…02D3`](https://etherscan.io/address/0x5c46Fc65855c0C7465a1EA85EEA0B24B601502D3) on November 23, 2026 with the same role holders: 2-of-5 Safe [`0x8Cc0…4795`](https://etherscan.io/address/0x8Cc0Cb0cfB6B7e548cfd395B833c05C346534795) and **1-of-2 Safe** [`0x8a25…39AB`](https://etherscan.io/address/0x8a25A24EDE9482C4Fc0738F99611BE58F1c839AB); [Grove](https://etherscan.io/address/0xfd9dEA9a8D5B955649579Af482DB7198A392A9F5): 4-of-7 [`0x0eEC…F85f`](https://etherscan.io/address/0x0eEC86649E756a23CBc68d9EFEd756f16aD5F85f) and two 2-of-3 Safes [`0x4364…Fe96`](https://etherscan.io/address/0x4364D17B578b0eD1c42Be9075D774D1d6AeAFe96), [`0x9187…9179`](https://etherscan.io/address/0x9187807e07112359C481870feB58f0c117a29179); [Obex](https://etherscan.io/address/0xF2bB664f16E2df4b0c71F9d2cFc386504E795b7A): 4-of-7 [`0x5d36…5663`](https://etherscan.io/address/0x5d36918C8F4726a62257AA79a50E53D553465663) and 2-of-3 [`0x2b1D…6054`](https://etherscan.io/address/0x2b1D60B11B7015fB83361a219BE01B7564436054)). `DEFAULT_ADMIN_ROLE` on each controller, ALM proxy and `RateLimits` is the Prime SubProxy | Every action is keyed to a `RateLimits` entry that only the SubProxy can set, so the relayer cannot add venues or recipients. `transferAsset` sends only to the (asset, destination) pairs with a configured limit. Curve swaps check `maxSlippages` (0.1%–0.2%, admin-set, against pool stored rates). A `FREEZER` Safe (Spark 2-of-4 [`0x90D8…3431`](https://etherscan.io/address/0x90D8c80C028B4C09C0d8dcAab9bbB057F0513431), Grove 2-of-5 [`0xB011…40e5`](https://etherscan.io/address/0xB0113804960345fd0a245788b3423319c86940e5), Obex 2-of-5 [`0x1924…16D8`](https://etherscan.io/address/0x1924b6990B63c5f820b81a23CD40383808D416D8)) can `removeRelayer` | Bounded per key. All active `RateLimits` keys on the Spark (70), Grove (68) and Obex (4) mainnet controllers were decoded from the setter spells. Changes since November 16: Spark set its CCTP routes to domains 1, 2 and 10 to zero, and Grove added two transfer destinations capped at $10M per window, USDC to [`0xc6a7…7edf`](https://etherscan.io/address/0xc6a7d3662e7d38f8e3a1e991116f6c3628bd7edf) and AUSD to [`0x9307…4619`](https://etherscan.io/address/0x9307672c95c7b92e659da63ef5ee64b0c0d14619). Unlimited `transferAsset` keys go only to Spark's own Savings Vaults (USDC, USDT, PYUSD, ETH), which the ALM can `take` back. Grove has two more: BUIDL to [`0x8780…4200`](https://etherscan.io/address/0x8780dd016171b91e4df47075da0a947959c34200), a redemption address whose 44 past transfers were repaid in USDC; and its ~$104M of STAC to [`0xbb54…842b`](https://etherscan.io/address/0xbb543c77436645c8b95b64eec39e3c0d48d4842b), Securitize's redemption wallet: 235 transfers of VBILL, ACRED, HLSCOPE and STAC from many holders, each subsequently burned. Every other transfer destination (Anchorage, Galaxy and other counterparty addresses) is capped at ≤$50M per window. Curve and Uniswap swaps are capped at ≤$25M per window |
| Set SSR, DSR and configured stability fees (`SPBEAM.set` → `sUSDS.file("ssr")`, `pot.file`, `jug.file`) | Only `bud`: 2-of-3 Safe [`0xe1c6f81D0c3CD570A77813b81AA064c5fff80309`](https://etherscan.io/address/0xe1c6f81D0c3CD570A77813b81AA064c5fff80309) via [MCD_SPBEAM](https://etherscan.io/address/0x36B072ed8AFE665E3Aa6DaBa79Decbec63752b22) (owner set unchanged since the September 9, 2026 snapshot) | Code-enforced: SSR 2%–30%, ≤4 percentage points per change, one batch per `tau` = 16 h. The hat can halt it instantly via [SPBEAM_MOM](https://etherscan.io/address/0xf0C6e6Ec8B367cC483A411e595D3Ba0a816d37D0); PauseProxy can `deny` it | No principal moves. The maximum SSR is reachable in seven changes over ≥4 days; at 30% the extra accrual on 1.94B sUSDS would be ~$1.4M/day of new `vice` |
| Halt PSM swaps, stop oracles or liquidations, wipe debt ceilings (`LITE_PSM_MOM`, `OSM_MOM`, `CLIPPER_MOM`, `LINE_MOM`, `SPLITTER_MOM`, `DIRECT_MOM`, `STUSDS_MOM`) | Chief hat (`authority`), owner PauseProxy | None: no GSM delay. Pause-only; cannot move funds | Blocks the 1.82B USDC exit path; DAI-USDS converter and DEX exits remain |
| Mint OFT / L2 representations | OFT adapters owned by PauseProxy (2-of-2 DVN: LayerZero Labs + Nethermind); native token bridges warded by PauseProxy | 48 h governance path; no USDS/sUSDS `wards` | 4.18M USDS (LayerZero) and 4.5M USDS + 443M sUSDS (native escrows) |

[ESM](https://etherscan.io/address/0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58) is disabled: `min() = 2^256−1`, so emergency shutdown cannot be triggered by depositing governance tokens and is reachable only through a governance spell.

**Weakest credible path to material loss:** Sky governance via the Chief hat. Any spell that gains more SKY approval than the current hat's 6.70B SKY (~28.6% of supply; any two of the top three delegates control a majority of it) can, after the 48 h `MCD_PAUSE` delay, upgrade USDS or sUSDS, or `rely` an arbitrary minter whose unbacked USDS can then be redeemed for the Pocket's USDC. This places every USDS and the 1.94B USDS in sUSDS at risk. The same hat can halt LitePSM exits through `LITE_PSM_MOM` with no delay while the malicious spell waits, leaving the DAI converter and DEX liquidity as exits. The 48 h delay and the ability of a competing hat to `drop` the plan are the only enforceable safeguards. The Prime allocator layer was checked as a candidate weaker path. Its relayers are Safes with lower thresholds, including Spark's 1-of-2, but they act only within `RateLimits` keys and destinations set by each Prime SubProxy. Those SubProxies are reachable only through Sky governance (PauseProxy, or a StarGuard spell plotted by PauseProxy). Every active key on the Spark, Grove and Obex mainnet controllers was decoded. A compromised relayer can move funds among governance-approved venues and counterparties, swap within per-window caps at ≤0.2% Curve slippage, push funds to Spark's Savings Vaults, or redeem BUIDL/STAC through their issuers' redemption addresses. It cannot pick its own recipient, and a freezer Safe can remove it. These are bounded operational powers, scored under Programmability rather than as the weakest material path. The same relayer and freezer Safes, with admin held by bridge-controlled executors whose only `SUBMISSION_ROLE` is a receiver with `l1Authority()` set to the Prime's mainnet SubProxy, govern the Base ALMs (Spark [executor](https://basescan.org/address/0xF93B7122450A50AF3e5A76E1d546e95Ac1d0F579), Grove [executor](https://basescan.org/address/0x491EDFB0B8b608044e227225C715981a30F3A44E); `delay = 0`) and Spark's Arbitrum ALM ([executor](https://arbiscan.io/address/0x65d946e533748A998B1f0E430803e39A6388f7a1)). Osero ([controller](https://etherscan.io/address/0x24169Afb34fAe4D4356BC54Bd80319131e35ca38), ~$25M drawn) and `ALLOCATOR-GROVE-A` ([ALM proxy](https://etherscan.io/address/0x0DcD9298e163dFD3c0B5b00F0d9093C36e40A153), ~$130M drawn) use the newer PAS design. Their rate limits can be adjusted by 2-of-3 cBEAM Safes ([`0x42D1…E180`](https://etherscan.io/address/0x42D1038017E466b413aa44Ae798E30FB80b2E180) for Osero, [`0x91dC…46C4`](https://etherscan.io/address/0x91dC2F6DbB8Adf76d373A54D408EDd7D736046C4) for Grove-A) through the [PAS Configurator](https://etherscan.io/address/0xb7E61Df6CAb0A51E9A5dab1A7DD3f942dDe5b929). They are limited to one change per 16 h `hop` and a `maxChange` factor, within BeamState defaults (between November 17 and 23 the Osero cBEAM raised one key's refill rate in five ×1.2 steps from ~$4.0M to $10M per day, showing the bound in operation); [BeamState](https://etherscan.io/address/0x1A1879E66547F90bfF87D45A5b0335950E019E02) is warded by PauseProxy and `PAS_MOM`. On both PAS controllers, admin (`DEFAULT_ADMIN_ROLE` on the access-control contract) is held by the Prime SubProxy and the PAS Configurator. The operator role (hash `0x68bf109b…`) is held by an `AdministeredAgent` ([Osero](https://etherscan.io/address/0x1837505D104F7a6D8b7e19452610B0A3D652EF12), [Grove-A](https://etherscan.io/address/0xdBD17832df0e57b1732cE1C84c652E820e549BAa)). Its actors can make arbitrary calls as the agent. The actors are Safes: Osero's are two 2-of-3s, [`0x3de6…2b26`](https://etherscan.io/address/0x3de688267cf099307abdd85f64d8efe03d0b2b26) and [`0x29c5…b6a8`](https://etherscan.io/address/0x29c5a20a49a0d522a3714af97c517a908946b6a8); Grove-A's are the same 4-of-7 and two 2-of-3 Safes as Grove's mainnet relayers. The agent's admin is the Prime SubProxy, and a 2-of-5 revoker Safe can remove actors (Osero [`0xf61f…e603`](https://etherscan.io/address/0xf61f90907551a8a23f0f8eee9658fa53326de603), Grove-A [`0xB011…40e5`](https://etherscan.io/address/0xB0113804960345fd0a245788b3423319c86940e5)). As with the classic controllers, the operator acts through admin-set integrations and rate limits. `TODO`: Grove's Avalanche ALM (~$282M) and the Plume/Robinhood positions (~$30M) could not be read because no RPC for those chains is configured, and Etherscan's free tier excludes Avalanche.

### Programmability

| Function | Onchain? | Notes |
|----------|----------|-------|
| Mint / burn USDS via USDS_JOIN | Yes, programmatic | Settled through VAT; cannot exceed VAT debt-ceiling parameters |
| DAI ↔ USDS conversion | Yes, programmatic | Pure routing in `DAI_USDS` contract |
| USDC ↔ USDS via LitePSM Wrapper | Yes, programmatic | Wrapper routes through DAI LitePSM. PSM pocket is read directly |
| sUSDS `chi` accumulator | Yes, programmatic | Continuous accrual via `ssr`; `drip()` is permissionless |
| `ssr` rate parameter | **Admin-set within bounds** | SP-BEAM `bud` (2-of-3 Safe) can move it without the GSM delay: 2%–30%, ≤4 pp per change, once per 16 h. Last changed 3.60% → 3.80% on October 7, 2026 ([tx](https://etherscan.io/tx/0x6ab0be000a3dfbbf0fdce381985a224fe37511958403a4bbc2278c33bc1f503e)). Chief spell + 48 h delay can also set it |
| Prime allocator deployment | **Hybrid** | Allocators draw USDS against their ilk `line` and deploy it through Prime ALM relayers into onchain and offchain positions; the drawn debt is onchain but the deployment is operator-driven |
| PSM `tin`/`tout`/`buf` parameters | **Governance-set** | Same flow |
| Halting the PSM | **Authority-gated** (LitePSM Mom; immediate if hat authorizes) | Used in emergency only |
| Upgrading USDS / sUSDS implementations | **Governance-set** | 48 h delay |

User-facing operations (minting, conversion, swaps, savings accrual) are programmatic onchain logic, and no offchain keeper drives the price or accrual. Two operator inputs remain: the SP-BEAM Safe sets the SSR and stability fees within code bounds without a timelock, and Prime allocators deploy more than half of VAT debt through operator-run ALM relayers.

### External Dependencies

| Dependency | Used By | Criticality | Notes |
|-----------|---------|-------------|-------|
| **Circle / USDC** | LitePSM Wrapper, Pocket holds 1.82B USDC | **Critical** for USDS-USDC swap path. A USDC freeze/blacklist on the Pocket or a USDC depeg would directly impair USDS-USDC convertibility | Circle has blacklisted addresses before (TornadoCash, OFAC sanctions). The Pocket has not been blacklisted but is on-chain visible and bounded by Circle's policy. The November 2026 [Inca Digital allegations](https://unchainedcrypto.com/skys-usds-supply-drops-2-billion-as-report-traces-518-million-in-illicit-linked-swaps/) that illicit actors used the permissionless LitePSM raise the policy pressure on this dependency, although no freeze or compliance action against the Pocket was found |
| **DAI / MakerDAO core (VAT, Join, Pot, Pause, Chief)** | All conversion paths | **Critical** — USDS shares the VAT with DAI. A bug in any MCD core contract impairs USDS | 8+ years of production with documented incidents (Black Thursday) but no exploit since |
| **Offchain / tokenized-credit issuers and custodians** (via Prime allocators) | ~23.5% of backing (~$1.49B). Named positions at the snapshot: Galaxy Warehouse OTC (~$430.0M) and Galaxy Arch CLO token (~$17.9M), Janus Henderson Anemoy AAA CLO (~$264.5M), Syrup USDC / Maple (~$228.5M), Anchorage OTC (~$210.0M), Janus Henderson AAA CLO (~$132.0M), Securitize Tokenized AAA CLO (~$104.1M), Arkis basis trade (~$20.6M), Anemoy/Apollo Diversified Credit (~$15.3M), plus legacy `RWA00x` (~$66.3M: HVB, New Silver, FortunaFi, Harbor Trade) | **High** for solvency; indirect for the USDC→USDS user | Impairment at any of these flows into the allocator's ilk, then to the Vow as `sin`, degrading USDS backing. It does not impair PSM swap atomicity while the Pocket holds USDC. Positions are reported by [Observatory](https://observatory.data.blockanalitica.com/sky/backed/items/) with periodic attestation, not verifiable by contract read |
| **Onchain lending markets and DEXs** (via Prime allocators) | Onchain crypto lending is ~30.6% of backing (~$1.94B, including ~$530M of Sky's own CDP and LockStake debt). SparkLend USDS/USDT/DAI/PYUSD/RLUSD/USDC markets (~$1.11B combined), Morpho vaults (Sentora x Spark RLUSD ~$500M, Grove x Steakhouse USDC on Base ~$351M, Spark Blue Chip USDT ~$50M, Osero x Gauntlet USDC ~$24M), Uniswap V4 PYUSD/USDS (~$100.1M), USDT/USDS (~$50.0M) and RLUSD/USDS (~$50.0M) | **Medium-high** for solvency | Established DeFi protocols, onchain-verifiable, but they carry smart-contract and market risk that propagates to USDS backing through the same allocator path |
| **Third-party stablecoins held as backing** | PayPal USD (Paxos, ~$134.7M), RLUSD (Ripple, ~$90.4M held directly, plus the RLUSD in the Sentora x Spark Morpho vault), Global Dollar (Paxos, ~$15.1M), plus USDC beyond the Pocket | **Medium** for solvency | A depeg or freeze at any of these reduces allocator backing. Smaller and more diversified than the USDC PSM exposure |
| **LayerZero V2 (USDS_OFT)** | Cross-chain bridging to **Solana + Avalanche only** (~$4.18M); EVM L2s use native bridges, not LayerZero | **Nil** for Ethereum-mainnet-only user; **Low** for cross-chain users | OFT channels verified to require **2 independent DVNs** (LayerZero Labs + Nethermind) — not the single-DVN config exploited at KelpDAO. See expanded section below |
| **Native L2 canonical bridges** (Base/Optimism/Unichain OP Stack; Arbitrum Nitro) | SkyLink cross-chain transport for USDS + sUSDS (~4.5M USDS + ~443M sUSDS) | **Nil** for Ethereum-mainnet-only user | ERC-1967 proxies governed by PauseProxy; security inherits each rollup's canonical bridge. Not LayerZero |
| **Gnosis xDAI bridge** | Locks ~1.0M USDS + ~36.1M sUSDS (~$41.3M) backing xDAI on Gnosis Chain | **Nil** for Ethereum-mainnet USDS holders; xDAI holders bear it | 4-of-7 validators, 8-of-15 Gnosis governance Safe; no USDS `wards`; releases capped at 15M USDS per day |
| **Chainlink / Oracle price feeds (MCD_SPOT)** | Sets per-ilk liquidation prices for collateral CDPs | Indirect — bad oracle → bad liquidations → solvency hit | Mature oracle setup with multi-source feeds |
| **LITE_PSM_MOM emergency halter** | Can pause USDC-USDS PSM swaps instantly | Trust dependency: the elected hat can halt PSM at will | Visible onchain; governance can override |

### LayerZero V2 Dependency

**What LayerZero Is:** LayerZero is a cross-chain interoperability protocol that provides a generic messaging layer between blockchains. It uses a modular verification architecture where each OApp (Omnichain Application) configures one or more **DVNs** (Decentralized Verifier Networks) to attest to cross-chain messages. When a message receives sufficient attestations (as configured by the OApp's security settings), the destination contract executes the payload.

**What Sky Uses It For:** Sky uses LayerZero **only for chains that lack a native canonical bridge to Ethereum** — currently **Solana and Avalanche**. USDS deploys an **OFT Adapter** (Omnichain Fungible Token) on Ethereum ([`0x1e1D…01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8)) that locks USDS and authorizes minting of a corresponding OFT on those chains (~4.18M USDS locked at the snapshot). The sUSDS OFT adapter ([`0x85A3…f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1)) has an Avalanche peer configured but currently locks 0. **The EVM L2s — Base, Arbitrum, Optimism, Unichain — do NOT use LayerZero**; they use native canonical rollup bridges (see [Cross-Chain Bridges](#cross-chain-bridges-skylink)). The OFT adapters are owned by PauseProxy; changes require Chief vote + 48 h GSM delay.

**KelpDAO Incident Context (April 18, 2026):** On April 18, 2026, the KelpDAO rsETH bridge — also built on LayerZero — was attacked by the DPRK-affiliated TraderTraitor threat actor, resulting in a loss of ~$292M. The attacker socially engineered a LayerZero Labs developer, pivoted into LayerZero's cloud environment, and poisoned internal RPC nodes to forge DVN attestations for a malicious cross-chain message. The critical vulnerability was that the affected OApp had a **single-verifier configuration** — it relied on the LayerZero Labs DVN alone without requiring a second, independent DVN to confirm. The forged attestation was therefore sufficient to unlock rsETH on the destination chain.

**Impact on Sky:**
- **No other OApps or channels were compromised** — the attack was specific to the KelpDAO OApp's configuration.
- **LayerZero Labs changed operating stance** post-incident: the LayerZero Labs DVN now refuses to sign as the *sole required attestor* on any channel. It enforces a baseline security configuration requiring at least one additional independent verifier.
- **Sky's OFT DVN configuration is verifiable onchain and is a secure multi-DVN setup.** Querying the LayerZero V2 endpoint ([`0x1a44…728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fe728c)) via the ULN libraries (`getUlnConfig`) at block 26487462, every Sky OFT channel — USDS↔Solana, USDS↔Avalanche, sUSDS↔Avalanche, on both send and receive paths — uses a **custom config requiring 2 independent DVNs** (`requiredDVNCount = 2`, 0 optional): the **LayerZero Labs** DVN ([`0x589d…236b`](https://etherscan.io/address/0x589dEDbD617e0CBcB916A9223F4d1300c294236b)) and the **Nethermind** DVN ([`0xa59B…0BA5`](https://etherscan.io/address/0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)), with 15 Ethereum confirmations outbound and 12 (Avalanche) / 32 (Solana) confirmations inbound. This is a **2-of-2** requirement — structurally the *opposite* of the single-DVN configuration that enabled the KelpDAO loss. A single compromised or forging DVN cannot finalize a Sky cross-chain message; both must independently attest.
- **Risk assessment for mainnet users:** The LayerZero dependency is **nil** for users who hold USDS/sUSDS only on Ethereum mainnet and never bridge. The OFT adapter on Ethereum has no mint authority over the underlying token — it locks USDS 1:1 via standard OFT mechanics. A LayerZero exploit on a remote chain could theoretically mint unbacked OFT tokens *on that chain*, but could not create USDS on Ethereum mainnet. Mainnet USDS supply integrity is protected by the `wards` system on the USDS token itself (only USDS_JOIN and PauseProxy hold `wards == 1`).
- **Risk assessment for cross-chain users:** Only **Solana and Avalanche** USDS holders carry any LayerZero dependency at all, and it is **low**: because Sky's channels require two independent DVNs, the single-DVN forgery vector used against KelpDAO does not apply. The residual tail risk (simultaneous compromise of *both* DVNs) is further mitigated by Sky governance's ability to pause/upgrade the OFT adapter via PauseProxy. USDS/sUSDS holders on the EVM L2s do not depend on LayerZero at all — their bridges are native canonical rollup bridges.

**Mitigating factors specific to Sky:**
- Sky governance controls the OFT adapters via PauseProxy and can upgrade or pause them through the same Chief + 48 h GSM delay used for all other protocol changes.
- LayerZero-bridged supply is tiny: ~$4.18M of USDS (Solana + Avalanche), ~0.13% of mainnet supply. The larger cross-chain supply (~4.5M USDS + ~443M sUSDS) rides native canonical bridges, not LayerZero.
- Sky's channels already use a verified **2-DVN configuration** (LayerZero Labs + Nethermind), so they were not exposed to the single-DVN vector even before LayerZero Labs' post-KelpDAO policy enforcing multi-DVN baselines.

**Quality:** dependencies are predominantly **blue-chip** (Circle, MakerDAO core, Chainlink). The most material concentration is the **USDC dependency**: the LitePSM ilk is ~31.0% of VAT debt, of which the on-chain USDC reserve itself is ~21.6%, and *any* USDS holder who plans to exit to USDC implicitly trusts Circle.

## Operational Risk

- **Team:** Sky Foundation (formerly MakerDAO) — established 2017, **publicly known team** including Rune Christensen (co-founder), Sébastien Derivaux, and others. Long track record of operating a multi-billion-dollar protocol
- **Legal entity:** "**Skybase International**" operates the [sky.money](https://sky.money/) front-end per the [user-risks legal page](https://docs.sky.money/legal/skybase-international/user-risks). The Sky Protocol itself is described as "non-custodial blockchain-based software". Per Section 5 / 6 of the [Skybase International Terms of Use](https://docs.sky.money/legal/skybase-international/terms-of-use), **the Terms (and any non-contractual obligations) are governed by the laws of the Cayman Islands**, with arbitration under the Cayman Islands Association of Mediators and Arbitrators (CI-ArbCA) and the **seat of arbitration in George Town, Grand Cayman**. Courts of the Cayman Islands hold exclusive jurisdiction for non-arbitrable disputes. US residents are explicitly excluded from certain features (Sky Savings Rate and Sky Token Rewards)
- **Documentation:** Comprehensive — Sky maintains [developers.skyeco.com](https://developers.skyeco.com), [docs.sky.money](https://docs.sky.money), the public chainlog ([chainlog.sky.money](https://chainlog.sky.money)), GitHub org [sky-ecosystem](https://github.com/sky-ecosystem) with all production contract source code, and detailed governance forum at [forum.sky.money](https://forum.sky.money)
- **Incident response track record:**
  - Black Thursday (March 2020) — Sky/MakerDAO governance held an emergency vote, minted MKR to recapitalize the system, paused vulnerable auctions, and shipped Liquidations 2.0
  - USDC depeg (March 2023) — governance widened PSM fees temporarily and accelerated RWA diversification
  - No USDS-specific incidents to date
- **Monitoring infrastructure:** Sky publishes a live [chainlog](https://chainlog.sky.money) with all production addresses; LlamaRisk and Block Analitica produce regular risk dashboards. The Yearn `monitoring` repository already includes USDS-adjacent strategies (yvUSDS-1) in its hourly Telegram-alert pipeline ([source](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py))
- **Bug bounty:** $10M Immunefi, live 4+ years
- **Disclosed legal risks:** [user-risks](https://docs.sky.money/legal/skybase-international/user-risks) explicitly warns about front-end attacks, "altering the interface to display incorrect information," "injecting malicious transaction data," and "phishing attacks." US residents are excluded from certain features

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Critical Values / Events |
|----------|---------|--------------------------|
| USDS | [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) | `totalSupply()`, `Upgraded(impl)` event (implementation change), `Rely(usr)` / `Deny(usr)` events on wards |
| sUSDS | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) | `chi()`, `ssr()`, `totalAssets()`, `Upgraded(impl)`, `Drip()` event frequency |
| LitePSM Wrapper | [`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c) | `BuyGem` / `SellGem` events, halted state of underlying PSM |
| Underlying LitePSM | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `tin`, `tout`, `buf`, `Halt` events |
| USDC Pocket | [`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) | `USDC.balanceOf(pocket)` — exit-capacity gauge |
| LitePSM Mom | [`0x467b32b0407Ad764f56304420Cddaa563bDab425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) | Any call (would be an emergency halt) |
| MCD_PAUSE | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | `Plot` events (scheduled spells), `delay()` value, `Exec` |
| MCD_PAUSE_PROXY | [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) | Outgoing calls = enacted governance |
| Chief | [`0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) | `hat()` rotation, top approvals |
| SP-BEAM | [`0x36B072ed8AFE665E3Aa6DaBa79Decbec63752b22`](https://etherscan.io/address/0x36B072ed8AFE665E3Aa6DaBa79Decbec63752b22) | `Set(id, bps)` events (no timelock), `Kiss`/`Diss` (bud changes), `cfgs("SSR")` and `tau()` changes; `getOwners()`/`getThreshold()` on the bud Safe [`0xe1c6f81D0c3CD570A77813b81AA064c5fff80309`](https://etherscan.io/address/0xe1c6f81D0c3CD570A77813b81AA064c5fff80309) |
| DAI-USDS Converter | [`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) | Volume |
| USDC token at Pocket | [`USDC.balanceOf(pocket)`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Pocket reserve level |
| USDS LayerZero OFT Adapter | [`0x1e1D42781FC170EF9da004Fb735f56F0276d01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | `owner()` (should always equal PauseProxy), `endpoint()`, any `Upgraded` events on underlying token; **DVN config via `getUlnConfig` — alert if `requiredDVNCount` drops below 2** |
| sUSDS LayerZero OFT Adapter | [`0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | `owner()` (should always equal PauseProxy), `endpoint()`; any cross-chain supply anomalies |
| Native L2 bridge escrows (Base/Optimism/Unichain/Arbitrum) | [`0x7F31…9Ef3`](https://etherscan.io/address/0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3) · [`0x4671…6C65`](https://etherscan.io/address/0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) · [`0x1196…566A`](https://etherscan.io/address/0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A) · [`0xA10c…9400`](https://etherscan.io/address/0xA10c7CE4b876998858b1a9E12b10092229539400) | `USDS.balanceOf(escrow)` / `sUSDS.balanceOf(escrow)` should equal the minted L2 supply; `wards[PauseProxy]` on each token bridge |
| Prime allocator ilks (all `ALLOCATOR-*`, including Spark, Grove, Obex, Prysm and Keel) | [`MCD_VAT.ilks(ilk)`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) for every registered `ALLOCATOR-*` ilk | `Art × rate` (drawn debt) and `line` (debt ceiling) per allocator — ~52.8% of VAT debt is issued here; reconcile with downstream backing, since debt can stay unchanged after an asset loss |
| Prime ALM controllers and rate limits | Spark [`0xc953972Cd006d1f12686fd7185c6D443b15900Cd`](https://etherscan.io/address/0xc953972Cd006d1f12686fd7185c6D443b15900Cd) / [`0x7A5FD5cf045e010e62147F065cEAe59e5344b188`](https://etherscan.io/address/0x7A5FD5cf045e010e62147F065cEAe59e5344b188); Grove [`0xfd9dEA9a8D5B955649579Af482DB7198A392A9F5`](https://etherscan.io/address/0xfd9dEA9a8D5B955649579Af482DB7198A392A9F5) / [`0x5F5cfCB8a463868E37Ab27B5eFF3ba02112dF19a`](https://etherscan.io/address/0x5F5cfCB8a463868E37Ab27B5eFF3ba02112dF19a); Obex [`0xF2bB664f16E2df4b0c71F9d2cFc386504E795b7A`](https://etherscan.io/address/0xF2bB664f16E2df4b0c71F9d2cFc386504E795b7A) / [`0x81f8f5306cF80655Edff78f89860a8D89118E150`](https://etherscan.io/address/0x81f8f5306cF80655Edff78f89860a8D89118E150) | `RoleGranted`/`RoleRevoked` (`RELAYER`, `FREEZER`, `DEFAULT_ADMIN_ROLE`), `RateLimitDataSet` (new keys, especially `LIMIT_ASSET_TRANSFER` and `LIMIT_OTC_SWAP`), `MaxSlippageSet`, `RelayerRemoved` (freezer action); `CONTROLLER` changes on each ALM proxy (Spark's controller was replaced on November 23, 2026) |

### Critical Values, Thresholds, and Frequency

| Metric | Source | Threshold to alert | Frequency |
|--------|--------|---------------------|-----------|
| USDS spot price | DEX TWAP / CoinGecko | < $0.995 or > $1.005 (>0.5% deviation) | 15 min |
| USDC Pocket balance | onchain | < $500M (would signal heavy redemption load), or a fall of >20% in 7 days | Hourly |
| Prime allocator ilk debt | `MCD_VAT.ilks` | Any allocator's drawn debt rises >20% in 7 days, or a new `ALLOCATOR-*` ilk is onboarded | Daily |
| Allocator asset/debt coverage | Position valuations and `MCD_VAT.ilks`; methodology and open measurements below | Coverage <100%, or falls ≥5 percentage points in 7 days after accounting for flows | Daily |
| Material counterparty impairment | [Observatory backing items](https://observatory.data.blockanalitica.com/sky/backed/items/), position contracts, issuer notices and attestations | Any confirmed default, write-down, or redemption suspension; unexplained ≥5% value drop in 24 h for a position ≥1% of reported system backing | Daily; immediately on incident notice |
| Backing-data and attestation freshness | Observatory `updated_at`; dated custodian reports | Any monitored position absent or >24 h stale; attestation overdue against its published schedule, or >45 days old where the expected cadence is monthly | Daily |
| LitePSM `tin`, `tout`, `buf` | onchain | Any change | On `Rely`/`File` event |
| LitePSM Halt | event log | Any `Halt` event | Real time |
| `MCD_PAUSE` scheduled spells | `Plot` event | Any spell touching USDS / sUSDS / PSM / Pocket | Behind timelock |
| sUSDS `ssr` rate | onchain `sUSDS.ssr()`, SP-BEAM `Set` events | Any change >50 bps APY; any SP-BEAM `cfgs` widening or new `bud` | Real time (SP-BEAM changes are not timelocked) |
| USDS / sUSDS implementation slot | EIP-1967 slot | Any change → `Upgraded` event | Behind timelock |
| USDS total supply (cross-chain, all chains) | DefiLlama API | Sudden >5% drop in 24 h | Hourly |

### Allocator Backing Checks

Read all registered `ALLOCATOR-*` ilks, including the smaller active `ALLOCATOR-PRYSM-A` and `ALLOCATOR-GROVE-A`. Cache each debt read (`Art × rate`, normalized from rad) with its block and timestamp. A counterparty loss need not change this debt, so the debt-growth alert is insufficient on its own.

Use [Observatory backing items](https://observatory.data.blockanalitica.com/sky/backed/items/) to locate positions by `star`, `name`, `network`, `wallet_address`, and `token_address`. Spark corresponds to `ALLOCATOR-SPARK-A`; Grove to `ALLOCATOR-BLOOM-A`; Obex to `ALLOCATOR-OBEX-A`. Archive each response and its per-item `updated_at`. Track reported `backed`, `backed_lt`, and `backed_total` separately: these are loan coverage, maintenance coverage, and gross collateral values, not interchangeable measures of an allocator's net assets. A decline or missing row requires reconciliation with transfers, repayments and mandate changes before being classified as a loss. A fresh API timestamp does not establish that the underlying custodian attestation is fresh.

For asset/debt coverage, value the allocator's actual claims and cash in USD at the same timestamp as its VAT debt, deduct downstream liabilities, and divide net asset value by drawn debt. Confirm onchain cash with `balanceOf(wallet)` and ERC-4626 claims with `convertToAssets(balanceOf(wallet))`, then assess the underlying assets for impairment; an unchanged share price can conceal a credit loss. Use dated issuer valuations and custodian attestations for offchain claims. Count each claim once; do not add borrower gross collateral to the lending claim's value or count the same assets through both a vault and its look-through. Check changes in coverage and each material counterparty even when drawn debt is unchanged.

**Per-allocator coverage (November 24, 2026).** Assets are valued onchain at block 26487462 (Base 61811761, Arbitrum 527224965) with `balanceOf` for SparkLend spTokens and stablecoins, `convertToAssets` for ERC-4626 vaults, PSM3 share value, and Uniswap V3 position math. Observatory figures are used only where no onchain read was possible: OTC loans, CLO and fund tokens, Uniswap V4 positions, and the Avalanche/Plume/Robinhood positions. Spark's downstream liabilities are the funds it has `take`n from its Savings Vaults (`totalAssets() − idle balance`): USDC $196.8M, USDT $199.5M, ETH $39.1M. SubProxy treasury balances (Spark 52.3M USDS, Grove 28.8M USDS) are excluded.

| Ilk | Drawn debt | Net assets | Coverage | Onchain share of gross assets | Notes |
|-----|-----------:|-----------:|---------:|------------------------------:|-------|
| `ALLOCATOR-SPARK-A` | $2,765.2M | ~$2,750.2M | ~99.5% | ~87% | Gross ~$3,185.6M less $435.3M Savings Vault liabilities; includes 50.0M sUSDS on Arbitrum and 23,376 spWETH. Spark repaid ~$925M of debt since November 16 |
| `ALLOCATOR-BLOOM-A` (Grove) | $1,303.4M | ~$1,329.5M | ~102.0% | ~26% | Galaxy Warehouse ($430.0M), JAAA ($132.0M Ethereum, $264.5M Avalanche) and STAC ($104.1M) are Observatory-valued |
| `ALLOCATOR-GROVE-A` | $130.0M | ~$130.0M | ~100% | 100% | AUSD/USDC Uniswap V3 position (~$30.0M) plus ~100.0M USDS in a [GroveBasin](https://etherscan.io/address/0xf08943f817e1F902dEbC884c7B19Ea5764594Ac9) pocket; absent from Observatory |
| `ALLOCATOR-OBEX-A` | $227.3M | ~$228.5M | ~100.6% | 100% | 191.3M syrupUSDC at Maple's share price; no shares queued for withdrawal. Obex redeemed ~$180M of syrupUSDC to repay debt since November 16 |
| `ALLOCATOR-PRYSM-A` (Osero) | $25.0M | ~$25.0M | ~100.1% | 100% | Osero x Gauntlet USDC Prime Morpho vault |

Coverage near 100% is expected: allocators draw debt to fund positions, and their profit or loss shows up as the gap. It is not a buffer. The figures rely on Maple's share price, Morpho/SparkLend accounting and Observatory's offchain valuations, so a loss inside Galaxy, Anchorage, the CLO funds or Maple's loan book would not appear until those sources mark it down.

**Offchain position reporting sources.** Use these sources to check attestation freshness:

| Position (allocator, ~size) | Valuation / reporting source | Cadence | Notes |
|---|---|---|---|
| Syrup USDC / Maple (Obex, ~$408M) | Onchain share price (`convertToAssets`); [LedgerLens by The Network Firm](https://dashboard.ledgerlens.io/c/maple) verified-collateral dashboard | Daily (dashboard) | Assessed in [maple-syrupusdc.md](maple-syrupusdc.md) |
| Janus Henderson Anemoy AAA CLO, JAAA (Grove, ~$396M on Ethereum + Avalanche) | NAV by fund administrator Trident Trust Cayman, auditor MHA Cayman; [Chronicle Proof-of-Asset dashboard](https://chroniclelabs.org/dashboard/proofofasset/janus-henderson-anemoy-aaa-clo-fund) | Daily NAV and dealing | Assessed in [centrifuge-jaaa.md](centrifuge-jaaa.md); the onchain price is set by the pool manager with no onchain bound |
| Anchorage institutional loans (Spark, ~$210M) | [RedStone](https://www.redstone.finance/blog/redstone-brings-sparks-institutional-collateral-data-onchain/) republishes Anchorage's LTV, collateral (BTC and USD) and loan-balance data as [pull feeds](https://app.redstone.finance/pull-feeds?search=spark) `SPARK/LTV_FUNDAMENTAL`, `SPARK/COLL_BTC`, `SPARK/COLL_BTC_USD`, `SPARK/COLL_TOTAL_USD`, `SPARK/LOAN_USD` and `SPARK/LOAN_TOTAL_USD` | `TODO`: heartbeat and deviation thresholds not published | Collateral is BTC in Anchorage Digital custody |
| Securitize Tokenized AAA CLO Fund, STAC (Grove, ~$104M; 100,000 tokens held onchain) | Custodian BNY, sub-adviser BNY Investments ([BNY release, October 29, 2025](https://www.bny.com/corporate/global/en/about-us/newsroom/company-news/securitize-launches-tokenized-aaa-clo-fund-with-services-provided-by-bny-bringing-institutional-structured-credit-on-chain.html)); [Chronicle Proof-of-Asset dashboard](https://chroniclelabs.org/dashboard/proofofasset/securitize-stac) | `TODO`: the dashboard could not be read (rate-limited); NAV cadence and administrator not confirmed from a primary source | |
| Galaxy Warehouse (Grove, ~$430M) and Galaxy Arch CLO token (~$17.9M) | Observatory only | `TODO`: no public loan-tape, collateral attestation or reporting schedule found | Facility terms are announced in a July 15, 2026 Grove/Galaxy press release that could not be retrieved for verification |
| Arkis basis trade (Spark, ~$20.6M), Anemoy/Apollo credit (Grove, ~$15.3M), legacy RWA vaults (~$64.6M) | ERC-4626 share price (Arkis); Observatory | `TODO` | Smaller positions; sources not catalogued |

**TODO — monitoring measurements:** automate the valuation above. Confirm the reporting cadence for the Anchorage, STAC and Galaxy positions. Read Grove's Avalanche ALM (~$282M) and the Plume/Robinhood positions (~$30M) onchain once RPCs for those chains are configured. Until these are recorded, attestation freshness for those positions is **unverified**, not healthy by default. Raise a data-availability alert for an unresolved position or report. The thresholds above define the required monitoring policy, not an already deployed monitor.

## Appendix: Contract Architecture

Snapshot block 26487462 (November 24, 2026).

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              USER LAYER                                   │
│                                                                           │
│   user holds USDC ───────┐               ┌────── user holds USDS          │
│                          ▼               ▼                                │
│   ┌──────────────────────────────────────────────────────┐                │
│   │  WRAPPER_USDS_LITE_PSM_USDC_A  (0xA188…f98c)         │                │
│   │  sellGem / buyGem  — atomic, 0% fee, 1:1            │                │
│   └────────────────┬──────────────────────┬─────────────┘                │
│                    │                      │                              │
│                    │  daiUsds.daiToUsds   │  daiUsds.usdsToDai            │
│                    ▼                      ▼                              │
│   ┌──────────────────┐         ┌──────────────────────┐                  │
│   │ DAI_USDS         │         │  MCD_LITE_PSM_USDC_A │                  │
│   │ 0x3225…B276A     │◄────────│  0xf6e7…3042         │  buf=800M DAI    │
│   │ 1:1 DAI↔USDS     │         │  tin=tout=0          │                  │
│   └─────────┬────────┘         └──────────┬───────────┘                  │
│             │                             │                              │
│             │  usdsJoin / daiJoin         │  pocket holds USDC           │
│             ▼                             ▼                              │
│   ┌──────────────────┐         ┌──────────────────────┐                  │
│   │ USDS_JOIN        │         │  POCKET              │ 1.82B USDC       │
│   │ 0x3C0f…7FEB      │         │  0x3730…7341         │                  │
│   │ wards[USDS] = 1  │         └──────────────────────┘                  │
│   └─────────┬────────┘                                                   │
│             │                                                             │
│             ▼                                                             │
│   ┌──────────────────────────────────────────────────┐                   │
│   │              MCD_VAT (core ledger)                │  ~8.43B debt     │
│   │              0x35D1…492B                          │  (DAI+USDS)      │
│   │  Holds all ilk debt: ETH-A, wstETH-A, RWA-*,     │                  │
│   │  PSM-USDC-A, LockStake, D3M Spark, etc.          │                  │
│   └──────────────────────────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                          USDS-denominated
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           SAVINGS LAYER                                   │
│                                                                           │
│   user deposits USDS                                                      │
│                  │                                                        │
│                  ▼                                                        │
│   ┌──────────────────────────────────────────────────┐                   │
│   │  sUSDS  (0xa393…7fbD)  — ERC-4626                │                   │
│   │  implementation 0x4e79…61e0                       │                   │
│   │  chi = 1.1175   ssr = ~3.80% APY                 │                   │
│   │  totalAssets() = 1.94B USDS                      │                   │
│   │  totalSupply()  = 1.74B sUSDS                    │                   │
│   └──────────────┬───────────────────────────────────┘                   │
│                  │  drip() accrues from USDS_JOIN via VAT/VOW            │
│                  ▼                                                        │
│             SSR yield (parameter set by governance)                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         GOVERNANCE LAYER                                  │
│                                                                           │
│   SKY holders (23.44B total supply)                                       │
│         │                                                                 │
│         │  lock + approve                                                 │
│         ▼                                                                 │
│   ┌──────────────────────┐                                                │
│   │   MCD_ADM  (Chief)   │  hat() = 0x8c7e…E88c                          │
│   │   0x929d…6f9         │  continuous-approval                          │
│   └──────────┬───────────┘                                                │
│              │                                                            │
│              │  plot spell                                                │
│              ▼                                                            │
│   ┌──────────────────────┐                                                │
│   │   MCD_PAUSE          │  delay = 172800 (48 h GSM)                    │
│   │   0xbE28…38f3        │                                                │
│   └──────────┬───────────┘                                                │
│              │                                                            │
│              │  exec after delay                                          │
│              ▼                                                            │
│   ┌──────────────────────┐                                                │
│   │   MCD_PAUSE_PROXY    │  executes spells; wards[USDS]=1,              │
│   │   0xBE8E…98FB        │  wards[sUSDS]=1, owns USDS/sUSDS upgrades     │
│   └──────────┬───────────┘                                                │
│              │                                                            │
│              ▼                                                            │
│      modifies parameters on USDS, sUSDS, LitePSM, VAT, etc.              │
│                                                                           │
│   Emergency channel (no 48 h delay):                                      │
│   ┌──────────────────────┐                                                │
│   │  LITE_PSM_MOM        │  authority=Chief, owner=PauseProxy            │
│   │  0x467b…b425         │  HALT() pauses USDC↔USDS swaps instantly      │
│   └──────────────────────┘                                                │
└──────────────────────────────────────────────────────────────────────────┘
```

Diagram address key: [`0xA188…f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c) (LitePSM Wrapper), [`0x3225…B276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) (DAI_USDS), [`0xf6e7…3042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) (LitePSM), [`0x3C0f…7FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) (USDS_JOIN), [`0x3730…7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) (Pocket), [`0x35D1…492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) (MCD_VAT), [`0xa393…7fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) (sUSDS), [`0x4e79…61e0`](https://etherscan.io/address/0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0) (sUSDS implementation), [`0x8c7e…E88c`](https://etherscan.io/address/0x8c7eE657FcbEda789F45A6660Dc592a6E30fE88c) (hat), [`0x929d…a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) (Chief), [`0xbE28…38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) (MCD_PAUSE), [`0xBE8E…98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) (PauseProxy), [`0x467b…b425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) (LITE_PSM_MOM).

---

## Risk Summary

### Key Strengths

- **Battle-tested infrastructure** — the underlying MCD system (VAT, Pause, Chief, Join) has been live since December 2017 with >8 years of production, multiple major audits, and a $10M Immunefi bounty
- **Fee-free, atomic, deep liquidity for USDC ↔ USDS** — the LitePSM Wrapper provides a 1:1 swap with no slippage, backed by ~$1.82B USDC in the Pocket. Exit capacity is orders of magnitude larger than any reasonable Yearn vault size. The PSM absorbed ~$1.58B of redemptions in 20 minutes on November 19, 2026, and ~$3.2B of Pocket outflows over November 18–22, without fees, a halt or a queue; the Pocket never fell below ~$800M
- **Fully onchain accounting** — USDS supply, sUSDS `chi`/`ssr`, PSM pocket balance, and VAT debt are all publicly readable. ERC-4626 standard for sUSDS
- **No EOAs in privileged roles** — all sensitive wards point to PauseProxy or audited Sky contracts; governance is token-weighted Chief vote with 48 h GSM delay. The only signer-held path, the SP-BEAM 2-of-3 Safe, is limited to bounded rate changes
- **Diverse backing** — combination of the USDC PSM (~31.0% of VAT debt), Prime allocator vaults deploying into onchain lending, stablecoins and tokenized credit (~52.8%), overcollateralized crypto CDPs, LockStake, and legacy RWA, reducing single-asset concentration risk. ~76.5% of Observatory loan-coverage backing is onchain
- **Excellent documentation, public team, and incident-response history** — Sky has demonstrably handled Black Thursday and USDC-depeg events under governance vote
- **High SSR adoption** — ~61.5% of USDS supply remains staked in sUSDS even after the November outflow
- **USDS ↔ DAI fungibility** — converter rails USDS's peg directly to DAI, with full DAI DEX-liquidity universe as secondary exit

### Key Risks

- **Rapid supply contraction and illicit-finance allegations** — USDS supply fell ~40% in the week to November 24, 2026 (5.22B → 3.16B), ~53% since September 9 and ~60% since June. The trigger was an Inca Digital report alleging ~$518M of illicit-linked LitePSM swaps, which Sky disputes, and exchange caution flags followed. The exit path held, but the permissionless PSM now carries visible compliance pressure, and the Pocket fell from 3.95B (September) to 1.82B USDC
- **USDC dependency** — the largest single backing line for the USDS-USDC swap path is Circle's USDC (~$1.82B in Pocket). A USDC depeg or Pocket blacklisting by Circle would directly impair USDS-USDC convertibility, as happened to DAI during the March 2023 SVB event
- **Governance can do anything to USDS / sUSDS** — PauseProxy can upgrade either contract's implementation, add new minters via `rely`, change the SSR, or halt PSM swaps via Mom. All require 48 h GSM delay except Mom halts and bounded SP-BEAM rate changes. The hat that plots a malicious spell can also halt LitePSM exits immediately. SKY token-weighted voting introduces concentration risk if a small set of SKY holders dominates Chief
- **48 h GSM delay is at the low end** — many newer DeFi systems use 7-day timelocks. 48 h gives a tight reaction window for catching malicious spells
- **Offchain and tokenized-credit backing** — ~23.5% of backing (~$1.49B: OTC crypto lending, AAA corporate debt, legacy RWA, basis trade, private credit) sits with offchain custodians and credit venues and depends on attestations and Observatory reporting, not direct onchain visibility. Named counterparties are in [External Dependencies](#external-dependencies)
- **Prime allocator concentration** — ~52.8% of VAT debt is drawn by Prime allocators, and ~51.0 points of that sit in just three (Spark ~$2.77B, Grove `BLOOM` ~$1.30B, Obex ~$227M). Spark alone is ~32.8% of VAT debt. Observatory's balance sheet books the Prime vaults at drawn debt; an onchain-first valuation puts each allocator at ~99.5% coverage or above (Spark ~99.5% net of ~$435M owed to its Savings Vaults; see [Allocator Backing Checks](#allocator-backing-checks)). Allocator relayers include a 1-of-2 Safe at Spark; all mainnet rate-limit keys were decoded, and its powers are rate-limited and restricted to governance-set destinations. The ilk itself shows only the debt; what backs it is whatever those allocators hold, so USDS solvency now depends heavily on allocator mandate discipline and Sky's ability to unwind those positions
- **RWA legal/jurisdiction exposure** — Sky's RWA program inherits TradFi regulatory and counterparty risk that is not transparent at the contract level
- **Chained contract dependency for USDC→USDS** — the swap path traverses USDC → LitePSM → DAI Join → USDS Join → DAI-USDS Converter → USDS. A fault in any link halts the wrapper
- **SSR is operator-adjustable** — the SP-BEAM 2-of-3 Safe can move the SSR between 2% and 30% in ≤4-point steps every 16 h without a timelock, and Sky governance can change it with a 48 h delay. Historical range: ~5–15% during DAI era; currently ~3.80% APY

### Critical Risks `[If Any]`

- **None identified.** The dominant tail risks are (1) a USDC depeg/freeze, made more salient by the November 2026 illicit-flow allegations against the permissionless PSM, and (2) a Sky-governance-level incident. Both are well-known DeFi systemic risks and not unique to this integration.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — USDS, sUSDS, LitePSM each audited by ChainSecurity + Cantina; broader Endgame stack also reviewed by Sherlock contest. ✅ PASS
- [x] **Unverifiable reserves** — USDS supply, sUSDS chi/totalAssets, USDC Pocket balance, and VAT debt are all readable onchain. RWA fraction is the only opaque slice, and Sky publishes attestations for it. ✅ PASS
- [x] **Total centralization** — Token-weighted Chief vote + 48 h Pause + PauseProxy. No EOA holds direct admin powers on USDS/sUSDS. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

| Factor | Assessment |
|--------|-----------|
| Audit firms | **ChainSecurity** (USDS, sUSDS, LitePSM, Endgame, plus 9 audits historically), **Cantina** (USDS, sUSDS, LitePSM, plus 10 audits historically), **Sherlock** contest, plus legacy Trail of Bits, PeckShield, Quantstamp on MCD core |
| Bug bounty | $10M Immunefi (Sky), live 4+ years, 255 assets in scope |
| Contract surface | Thin tokens (USDS ERC-20, sUSDS ERC-4626). Chained PSM path adds complexity |

**Audits Score: 1.0 / 5** — 3+ top-tier audits per module, $10M bounty, multi-year coverage.

**Subcategory B: Historical Track Record**

| Factor | Assessment |
|--------|-----------|
| Time in production | USDS: **26 months** (Sept 2024). Underlying MCD: **8.9 years** |
| TVL | USDS: ~$3.16B mainnet at the snapshot (~$3.16B total). sUSDS holds 1.94B USDS (~61.5% staked). Sky Lending TVL ~$2.91B |
| Security incidents on USDS / sUSDS / LitePSM | **None** since launch |
| Legacy incidents | Black Thursday (March 2020), USDC depeg (March 2023) — both handled by governance |

**Historical Score: 1.0 / 5** — USDS-specific track record has now passed 2 years with no exploit or loss, and the underlying MCD core has been multi-billion-dollar production for 8.9 years. Supply contracted ~40% in the week to November 24, 2026 after third-party illicit-finance allegations, but there was no protocol failure. The LitePSM cleared ~$1.58B in 20 minutes at zero fees with no halt, the hourly low was 0.9962 (0.38% off peg), and TVL remains well above the rubric's sustained >$100M bar. It does not warrant a harsher score.

**Cat 1 Score = (1.0 + 1.0) / 2 = 1.0 / 5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | USDS and sUSDS are **UUPS upgradeable**. Upgrades gated by `wards[PauseProxy]=1` and a 48 h GSM delay |
| Vote / consensus | **SKY token-weighted continuous voting in Chief**. No multisig. Functionally more decentralized than a typical 3/5 safe but exposes governance to SKY holder concentration |
| Timelock | **48 h** GSM delay on MCD_PAUSE (`delay = 172800`) on every upgrade, `rely`, and parameter change. Meets the rubric's Score-1 bar ("48h+ timelock on critical operations") with no margin above it |
| Emergency channel | LITE_PSM_MOM can halt PSM swaps **without** the 48 h delay (authority = Chief, owner = PauseProxy) |
| Privileged roles | PauseProxy holds direct wards on USDS, sUSDS, all PSM components, and can `rely` new minters. SP-BEAM (2-of-3 Safe `bud`) holds a bounded rate-setting ward on sUSDS |
| EOA risk | None. Weakest material path is the Chief hat + 48 h delay (see [Critical Permission Paths](#critical-permission-paths-and-weakest-link)) |

**Governance Score: 1.0 / 5** — Sky's Chief is one of the most decentralized governance systems in DeFi: token-weighted continuous-approval voting with **no multisig on the upgrade or minting path**, no EOA roles, and all upgrade and minting wards held by PauseProxy. The rubric awards Score 1 to "Immutable OR fully decentralized DAO" with "Multisig above 3/5 threshold, no EOA roles, multi-party approval" — Sky meets the decentralized-DAO criterion and *exceeds* the multisig criterion (the entire SKY-holder set is the approver). The timelock column is met exactly: every upgrade, `rely`, and parameter change passes the 48 h `MCD_PAUSE` delay, which is the rubric's Score-1 threshold ("48h+"; the rubric gives no extra credit above it). Continuous re-voting in Chief lets holders replace a malicious hat during the delay, but it does not lengthen the 48 h window and is not relied on for this score. Governance powers are broad — PauseProxy can upgrade both proxies and `rely` new minters — and SKY approval is concentrated (current hat: top supporter ~41.5%, top-2 ~79.4%, top-3 ~98.3% of approvals), so any reduction of `delay()` below 48 h would drop the timelock column to Score 2, and a single supporter exceeding 50% of hat approvals triggers a governance re-review (see [Reassessment Triggers](#reassessment-triggers)). **Caveat:** the LITE_PSM_MOM emergency channel lets the elected hat halt PSM swaps *without* the 48 h delay. This is a one-sided emergency mechanism (it can pause but not extract value), and it has never been invoked since deployment.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Mint / burn | Programmatic via USDS_JOIN against VAT |
| Conversion paths | Fully programmatic (DAI-USDS converter, LitePSM Wrapper) |
| sUSDS exchange rate | Fully onchain via `chi` + `ssr` accumulator |
| Off-chain dependencies | Keeper for CRON_LITE_PSM_JOB (PSM buffer refill); not user-facing critical. Prime ALM relayers deploy allocator-drawn USDS (~52.8% of VAT debt) |
| Rate parameters | `tin` / `tout` / `buf` set by Sky governance (Chief + 48 h delay). SSR, DSR and stability fees can also be set by the SP-BEAM 2-of-3 Safe without a timelock, within 2%–30% (SSR), ≤4 pp per change, every ≥16 h |

**Programmability Score: 1.5 / 5** — Minting, conversion, swaps and `chi` accrual are fully programmatic, and the exchange rate is calculated onchain (Score 1 on the PPS column). Operations are "mostly programmatic with minor admin input" (Score 2) in two respects. The SP-BEAM 2-of-3 Safe sets the SSR and stability fees without a timelock, bounded by `cfgs` and `tau`; it has held this ward since April 21, 2025. Prime allocators also deploy more than half of VAT debt through operator-run ALM relayers (Safes from 1-of-2 to 4-of-7), bounded by SubProxy-set rate limits, destinations and slippage caps. The SP-BEAM role is scored here rather than under Governance because it cannot move principal and its cumulative cost is code-bounded and haltable by the hat.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Swap-path dependencies | USDC (Circle) — Pocket holds 1.82B USDC; Chainlink/Chronicle oracles for collateral pricing; LayerZero (cross-chain OFT — non-critical for mainnet user) |
| Solvency-path dependencies (via Prime allocators, ~52.8% of VAT debt) | **Offchain/tokenized credit (~23.5% of backing):** Galaxy, Maple (Syrup), Janus Henderson/Anemoy, Anchorage, Securitize, Arkis, Apollo, legacy RWA parties. **Onchain crypto lending (~30.6%):** SparkLend, Morpho (Steakhouse-, Sentora-, Gauntlet- and Spark-curated vaults), Sky CDPs. **Stablecoins (~45.9%, including the PSM's USDC):** Circle, Paxos (PYUSD, USDG), Ripple (RLUSD), Uniswap V4 stablecoin pools |
| Not counted as external | MCD core (VAT, Chief, Pause, Join) — this *is* Sky's own infrastructure, not a third-party dependency |
| Quality | Predominantly established: Circle, Janus Henderson, Chainlink, Spark, Morpho, Uniswap, Paxos, Ripple. Newer or less-liquid venues (Maple, Galaxy, Arkis, Apollo private credit) are individually ≤~$450M |
| Single point of failure | None. A USDC freeze/depeg impairs the USDS-USDC swap but the DAI-USDS converter still works; no single offchain counterparty exceeds ~7.1% of backing (Galaxy, ~$447.9M) |

**Dependencies Score: 4.0 / 5** — the rubric's Score 4 is "Many or newer protocol dependencies; critical functionality depends on them", and that is what the enumerated allocator book shows: a dozen-plus counterparties (Circle for the swap path; Galaxy, Maple, Janus Henderson/Anemoy, Anchorage, Securitize, Arkis and Apollo for offchain credit; SparkLend, Morpho and Uniswap for onchain deployment; Ripple and Paxos stablecoins), and USDS solvency — a core requirement of a stablecoin — depends on them collectively. Score 3 ("2-3 established protocol dependencies") understates the count. ~52.8% of VAT debt sits in allocator vaults with named downstream exposure. Mitigants are real but do not change the rubric row: the counterparties are predominantly established, no single offchain counterparty exceeds ~7.1% of backing (Galaxy, ~$447.9M across the Warehouse and Arch CLO positions), the largest single onchain lines are the Sentora x Spark RLUSD vault (~$500M, ~7.9%) and SparkLend USDS (~$496M, ~7.8%), and holding USDS, converting to DAI, and accruing SSR remain mechanically operational even if backing is impaired. No single dependency's failure breaks the protocol, so Score 5 does not apply.

**Cat 2 Score = (1.0 + 1.5 + 4.0) / 3 = 2.17 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing model | Inherits MCD_VAT collateral book: USDC PSM (~$2.61B, 31.0%), Prime allocator vaults (~$4.45B, 52.8%), crypto CDPs (~$372M, 4.4%, closed to new borrowing), LockStake (~$158M), legacy RWA (~$66.3M), `vice` (~$772M, 9.2%), D3M (dormant) |
| System-wide CR | VAT `debt() ≈ 8.43B` vs DAI+USDS supply ≈ 7.52B (Ethereum mainnet). Vow net position **−$39.1M** (surplus $732.9M vs unbacked debt $772.0M). Observatory book-value balance sheet: ~$7.67B assets vs ~$7.70B liabilities, a ~$32M shortfall that reverses to a ~$123M margin once the two omitted allocator ilks are booked at debt. Per-ilk overcollateralization (145–170% on crypto ilks) is the onchain safety buffer |
| Verifiability | Per-ilk debt and ink readable onchain. Prime allocator and RWA fractions require Observatory look-through / attestations |
| Leverage | None at USDS holder level. CDP borrowers are leveraged by design |

**Collateralization Score: 3.0 / 5** — collateralized in aggregate (total collateral value ~$9.60B, ~114% of VAT debt), but not by the rubric's Score-2 standard of "100% **onchain** collateral". Measured against Observatory's ~$6.33B loan-coverage backing, **~23.5% (~$1.49B) is offchain** OTC credit, AAA CLO, basis-trade, private-credit and legacy RWA exposure, confirmed by periodic attestation rather than contract reads. Two of the rubric's three columns match Score 3 outright — backing ("100% collateral, some offchain") and verifiability ("periodic custodian attestation") — and the onchain majority does not remove the dependence on that offchain slice. The November redemptions were paid from the onchain lines (PSM USDC, SparkLend, Maple), so the offchain share has risen.

**Allocator opacity** reinforces this: ~52.8% of VAT debt is drawn by Prime allocator vaults (Spark, Grove, Obex and smaller ones) where the ilk exposes only the drawn debt, not the assets standing behind it. Reconstructing that backing requires trusting Block Analitica's Observatory look-through rather than reading the VAT. That structure was not documented in the June 2026 assessment; the move from 2.0 was a correction to how this subcategory was scored, not a deterioration in the protocol. The offchain share fell from ~29.3% (September) to ~19.8% (November 16) as the Treasury-bill positions left the book, then rose to ~23.5% as onchain positions funded the November 19 redemptions.

Mitigants keep this at 3.0 rather than higher: ~76.5% of backing is onchain, the single largest line — ~$1.82B of USDC in the PSM Pocket, ~28.7% of backing — is instantly verifiable by a `balanceOf` call, and measured allocator coverage is ~99.5% or above.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Onchain transparency | USDS supply, sUSDS chi/totalAssets, USDC Pocket balance, VAT per-ilk debt all readable |
| RWA / allocator attestations | Published monthly on Sky governance forum and dashboards; offchain custodian reports. Observatory provides a daily look-through of Prime allocator holdings |
| Exchange rate | `chi` and `ssr` are pure functions; permissionless `drip()` keeps `chi` current |
| Admin minting | Governance can grant new wards (48 h delay); current USDS ward set is USDS_JOIN and PauseProxy |

**Provability Score: 2.0 / 5** — Mostly onchain reserves (~76.5% of Observatory loan-coverage backing), with programmatic supply and savings-rate accounting, match the rubric's Score 2 ("Mostly onchain, some offchain" with periodic updates and a single reliable source). The ~23.5% offchain slice (~$1.49B) depends on periodic custodian reporting, and the Prime allocator book needs Observatory look-through; this prevents a score between 1 and 2, since Score 1 requires fully onchain reserves and multiple verification sources. The offchain slice has Score-3 characteristics, but the aggregate remains predominantly onchain. Swap-path transparency alone does not establish reserve transparency for the entire backing book.

**Cat 3 Score = (3.0 + 2.0) / 2 = 2.50 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Direct 1:1 atomic redemption via LitePSM Wrapper (USDS → USDC), zero fee. sUSDS withdrawal via ERC-4626, zero fee, atomic |
| Liquidity depth | USDC Pocket: ~1.82B USDC → multi-hundred-million-dollar exits with 0% slippage |
| Same-value asset | USDS is a 1:1 stablecoin; no PPS divergence risk |
| Withdrawal restrictions | None — no cooldown, no queue, no per-user cap |
| Historical stress behavior | PSM remained functional during the October 2025 stablecoin stress (hourly low 0.9947). On November 19, 2026 it cleared ~$1.58B of redemptions in 20 minutes, including a single 1,488M exit, with zero fees, no halt or queue, and the Pocket never below ~$800M; the hourly low was 0.9962. The deepest daily print over the past year was 0.32% below peg (0.9968, October 30, 2026) |
| Single-tx exit capacity | Pocket balance ($1.82B) far exceeds any plausible Yearn integration size |

**Score: 1.0 / 5** — Textbook score-1 liquidity profile: atomic 1:1 redemption with ~$1.8B of depth and no friction, now demonstrated under a ~40% one-week supply run.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Sky Foundation / MakerDAO veterans; publicly known leadership (Rune Christensen et al.); established 2017 |
| Documentation | Comprehensive — developer docs, governance forum, public chainlog, GitHub source |
| Legal entity | Skybase International (governed by Cayman Islands law) operates the sky.money front-end; the Sky Protocol itself is non-custodial onchain code. In November 2026 an Inca Digital report alleged illicit-linked use of the permissionless LitePSM, which Sky disputes, and Upbit and Bithumb added caution flags. This is a compliance-perception issue with no change to the legal structure |
| Incident response | Demonstrated across Black Thursday and 2023 USDC depeg; the November 2026 redemption wave was met with allocator repayments that refilled the Pocket from ~$0.80B to ~$1.82B within five days |
| Monitoring | Public chainlog + governance forum + LlamaRisk / Block Analitica dashboards. Yearn's `monitoring` repo already alerts on USDS-adjacent vaults |

**Score: 1.0 / 5** — Top-tier operational maturity. The November 2026 illicit-finance allegations are noted but held here, because they do not change the team, documentation or legal structure; their mechanical effect (USDC freeze or exchange delisting pressure) is covered under External Dependencies and Liquidity.

### Final Score Calculation

**Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.0 | 20% | 0.200 |
| Centralization & Control | 2.17 | 30% | 0.650 |
| Funds Management | 2.50 | 30% | 0.750 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.0 |  5% | 0.050 |
| **Final Score** | | | **1.80/5.0** |

**Final Score: 1.80 / 5.0** — in the Low-Risk tier (1.50–2.49). The move out of Minimal Risk comes from scoring the Prime-allocator backing and counterparty set and the SP-BEAM rate path that the June 2026 assessment did not document, not from a deterioration in the protocol. The Centralization weighted value uses the unrounded 6.5 / 3 × 0.30 = 0.650.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (1.80 / 5.0) — Approved with standard monitoring**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (March 2027) or annually
- **TVL-based:**
  - USDS supply drops >25% from snapshot (~$3.16B → <$2.4B) — would indicate material loss of confidence or large policy event. This trigger fired between November 16 and 24, 2026 (5.22B → 3.16B, −40%), prompting this update
  - sUSDS share of USDS supply drops below 50% (currently ~61.5%, down from ~70% before November 19) — would indicate SSR has been cut materially or savers are exiting
  - USDC Pocket balance drops below $500M, or falls >20% in 7 days (it fell ~32% between November 16 and 24, 2026, with an intraday low of ~$800M on November 19) — would indicate sustained exit pressure and compromise of the deep-redemption story
  - Total cross-chain USDS supply (currently ~8.7M in Sky bridges plus ~443M sUSDS, and ~$41.3M in the Gnosis xDAI bridge) spikes >$1B, or LayerZero-bridged supply (currently ~4.18M, Solana + Avalanche) grows materially — would indicate rising bridge dependency exposure
- **Parameter-based:**
  - Any registered `ALLOCATOR-*` ilk grows >20% in 7 days, or a new `ALLOCATOR-*` ilk is onboarded → re-review the backing look-through
  - `LITE_PSM_USDC_A.tin` or `tout` changes from zero (fees introduced) → harden Liquidity score
  - `LITE_PSM_USDC_A.buf` changes materially → re-evaluate exit capacity for USDC→USDS direction
  - `sUSDS.ssr` changes by >50 bps APY → not a risk event but warrants user-facing notice
  - SP-BEAM gains a new `bud`, its bud Safe's threshold or owner set changes, or `cfgs("SSR")` / `tau` is widened → re-review the bounded-rate classification
  - A Prime controller grants a new `RELAYER` or `FREEZER`, a relayer/freezer Safe changes threshold or owners, or a `RateLimitDataSet` adds an `ASSET_TRANSFER`/`OTC_SWAP` key or raises a `maxSlippages` tolerance → re-review the allocator path; any new uncapped `ASSET_TRANSFER` destination that is not an issuer redemption or Spark-owned vault → re-score Governance
  - `MCD_PAUSE.delay()` is reduced below 48 h → governance score worsens
  - `USDS.wards()` grants a ward outside the current set (USDS_JOIN, PauseProxy), or `sUSDS.wards()` outside (PauseProxy, SP-BEAM) → re-review mint and rate authority
  - `USDS_OFT.owner()` or `SUSDS_OFT.owner()` changes from PauseProxy → re-review OFT adapter governance
- **Backing-based:**
  - Any allocator's net-asset/debt coverage falls below 100% or drops ≥5 percentage points in 7 days after accounting for flows
  - Any confirmed allocator-counterparty default, write-down, or redemption suspension, or an unexplained ≥5% daily value drop in a position ≥1% of system backing
  - A monitored backing item is missing or >24 h stale, or a required custodian attestation is overdue (monthly reports >45 days old) → review reserve provability; unresolved measurements remain `TODO`
- **Incident-based:**
  - Any `LITE_PSM_MOM.HALT()` invocation (emergency PSM halt)
  - Any USDS depeg deeper than ±1% sustained for >24 h
  - Any USDC depeg event (would propagate to USDS via PSM)
  - Any compliance action against the LitePSM, Pocket or USDS (Circle freeze, regulator action, exchange delisting beyond the November 2026 Upbit/Bithumb caution flags) following the illicit-finance allegations
  - Any LayerZero protocol-level or DVN-level incident — especially involving the **LayerZero Labs** ([`0x589d…236b`](https://etherscan.io/address/0x589dEDbD617e0CBcB916A9223F4d1300c294236b)) or **Nethermind** ([`0xa59B…0BA5`](https://etherscan.io/address/0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)) DVNs that secure Sky's OFT channels — or any drop in Sky's `requiredDVNCount` below 2
  - Cross-chain USDS supply discrepancy >5% between onchain mainnet `USDS.totalSupply()` and DefiLlama aggregate — would signal a potential OFT exploit or bridge state mismatch
  - Any exploit or governance attack on the Sky/MCD core (Chief, Pause, VAT, USDS, sUSDS, LitePSM, USDS_JOIN, DAI_USDS, Pocket, OFT)
  - Any blacklisting of the USDC Pocket by Circle
- **Governance-based:**
  - SKY voter concentration changes materially: single supporter exceeds 50% of `Chief.approvals(hat)`, top-2 current-hat concentration rises materially from the November 24, 2026 baseline of ~79.4% (top-3 ~98.3%), or top-5 concentration remains near-total while the hat margin narrows
  - New USDS / sUSDS implementation deployed (would reset the audit baseline)
  - RWA or Prime allocator program changes materially (new custodians or allocators, large reallocations, custodian incidents)

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 18, 2026](https://github.com/yearn/risk-score/pull/204) | 1.3 | Initial assessment |
| [November 24, 2026](https://github.com/yearn/risk-score/pull/457) | 1.80 | Reassessment documenting the Prime allocator book (~53% of VAT debt, coverage ~99.5%+) and the SP-BEAM rate path; USDS fell from 7.82B to 3.16B, including ~$1.6B redeemed through the LitePSM in 20 minutes on November 19 without a halt. Collateralization 2.0 → 3.0; Provability 1.5 → 2.0; External Dependencies 1.5 → 4.0; Programmability 1.0 → 1.5; Governance held at 1.0. Minimal Risk → Low Risk |
