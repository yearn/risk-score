# Protocol Risk Assessment: Sky — USDS & sUSDS

- **Assessment Date:** June 18, 2026 (Updated: November 16, 2026)
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

**sUSDS** is the tokenized Sky Savings Rate vault — an ERC-4626 wrapper deployed September 4, 2024 with a `chi` accumulator that grows continuously at the Sky Savings Rate (**SSR**). Depositing USDS into sUSDS is atomic, fee-free, and so is withdrawal. The SSR is a parameter on sUSDS that Sky Governance can set via Chief + PauseProxy, and that the [SP-BEAM](#programmability) rate module can also move within governance-set bounds without the GSM delay. It is currently a per-second `ssr` of `1.00000000118…` → **~3.80% APY** at the November 16, 2026 snapshot.

**Key onchain metrics (November 16, 2026, block [26429600](https://etherscan.io/block/26429600), 19:11:47 UTC):**

| Metric | Value |
|--------|-------|
| USDS total supply (Ethereum mainnet) | **5,220,097,844 USDS** (~$5.22B) |
| USDS total supply (all chains) | ≈ mainnet `totalSupply()`, since every bridge is lock-and-mint: ~9.0M of the mainnet supply is escrowed on L1 (~4.4M native L2 escrows + ~4.6M LayerZero) and re-issued 1:1 on the destination chains, not added on top. [DefiLlama](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)'s latest daily point (00:00 UTC, November 16, 2026) aggregates the per-chain balances to ~5,356,080,543 USDS, within 0.08% of the onchain `totalSupply()` of 5,351,929,000 at the same time ([block 26423841](https://etherscan.io/block/26423841)); a further ~132M was redeemed before the snapshot |
| sUSDS supply (shares) | 3,288,356,722 sUSDS |
| sUSDS `totalAssets()` | **3,671,685,113 USDS** (~70.3% of mainnet USDS supply) |
| sUSDS price-per-share (`chi`) | 1.1166 USDS/sUSDS |
| Sky Savings Rate (SSR) | `1.000000001182641…` per second → **~3.80% APY**, set by SP-BEAM on October 7, 2026 ([tx](https://etherscan.io/tx/0x6ab0be000a3dfbbf0fdce381985a224fe37511958403a4bbc2278c33bc1f503e)) |
| USDC held in LitePSM Pocket | **2,674,118,037 USDC** (~$2.67B) |
| MCD_VAT total system debt | ~10.54B (DAI + USDS combined) |
| 1-year USDS peg range ([CoinGecko](https://www.coingecko.com/en/coins/usds) daily series) | 0.9968 (2026-10-30) – 1.0011 (2026-02-23); current 0.9998 |

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

All addresses retrieved from the onchain [Sky Chainlog](https://etherscan.io/address/0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F#readContract) (version 1.20.22) and verified onchain. Snapshot block: **[26429600](https://etherscan.io/block/26429600)** (hash `0x61e4096e2e7e43e0ee03c3baf31dc81acdeff12e21b310377dc7390d84e09929`, November 16, 2026 19:11:47 UTC).

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
| USDS LayerZero OFT Adapter | [`0x1e1D42781FC170EF9da004Fb735f56F0276d01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | LayerZero V2 OApp (OFT Adapter). Locks USDS for bridging to **Solana and Avalanche only** (~4.58M USDS locked). `owner = PauseProxy`, `endpoint =` [`0x1a44076050125825900e736c501f859c50fe728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fe728c) (LZ V2). Does NOT hold `wards` on USDS. See [Cross-Chain Bridges](#cross-chain-bridges-skylink) |
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

L1 tokens are locked in the per-chain escrow and minted 1:1 on the L2 by the canonical rollup bridge. These do **not** use LayerZero, so they do not appear on LayerZero Scan. Escrow balances at the snapshot (onchain `balanceOf`): Base **3.92M USDS / 10.83M sUSDS**, Arbitrum **0.44M USDS / 427.0M sUSDS**, Optimism **0.011M USDS / 4.62M sUSDS**, Unichain **0.010M USDS / 0.15M sUSDS**. **This is how sUSDS reaches Arbitrum** (~427M sUSDS via the Arbitrum gateway), which is why sUSDS-on-Arbitrum is absent from LayerZero Scan. Arbitrum holds ~96.5% of escrowed sUSDS and Base ~89.5% of the now small escrowed USDS balance. On July 13, 2026 the Spark Liquidity Layer withdrew its Base, Optimism and Unichain positions back to its mainnet ALM Proxy ([`0x1601843c5E9bC251A3272907010AFa41Fa18347E`](https://etherscan.io/address/0x1601843c5E9bC251A3272907010AFa41Fa18347E)) through the canonical bridges — e.g. [146.6M USDS out of the Base escrow](https://etherscan.io/tx/0xac90aa7e2dc4035c921324e3a10ad3ba6c39f21826375b1558ee6acc27964a22) and [192.0M sUSDS in the same block range](https://etherscan.io/tx/0xb2c9215da24ae539d7a3fe9b65b731d079f0aaf0229e51e885e35d319e05c9e8). On October 19, 2026 it withdrew [99.33M USDS from the Arbitrum escrow](https://etherscan.io/tx/0x2b7241789acd29f18928f2f11faba2784ea5544e2683b5e5cec22d0599940c1a) to the same ALM Proxy, and on October 29, 2026 the Spark SubProxy ([`0x3300f198988e4C9C63F75dF86De36421f06af8c4`](https://etherscan.io/address/0x3300f198988e4C9C63F75dF86De36421f06af8c4)) [bridged 100.0M sUSDS to Arbitrum](https://etherscan.io/tx/0x8075abed11525daa47909008d54964e3656bf771bfc0d48f329d1a886abeb8b5).

**2. LayerZero V2 OFT Adapters** (USDS to Solana + Avalanche only; security analyzed in [LayerZero V2 Dependency](#layerzero-v2-dependency)):

| Token | OFT Adapter | Chains (peers) | Locked at snapshot |
|-------|-------------|----------------|--------------------|
| USDS | [`0x1e1D…01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | Solana (EID 30168), Avalanche (EID 30106) | ~4.58M USDS |
| sUSDS | [`0x85A3…f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | Avalanche (EID 30106) | 0 |

The legacy DAI **Teleport** fast-withdrawal bridges (`ARBITRUM_TELEPORT_BRIDGE`, `OPTIMISM_TELEPORT_BRIDGE`, `STARKNET_TELEPORT_BRIDGE`) also exist in the chainlog but are DAI-era infrastructure and out of scope for USDS/sUSDS.

### USDS-USDC PSM Stack

| Contract | Address | Role |
|----------|---------|------|
| **USDS LitePSM Wrapper** | [`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c) | `WRAPPER_USDS_LITE_PSM_USDC_A`. User-facing USDC↔USDS swap (`buyGem` / `sellGem`). Atomic. Deployed 2024-09-03 |
| Underlying LitePSM (DAI-USDC) | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `MCD_LITE_PSM_USDC_A`. Holds the swap logic. `tin = 0`, `tout = 0`, `buf = 800,000,000 DAI` (789.5M DAI held at snapshot) |
| USDC Pocket | [`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) | `MCD_LITE_PSM_USDC_A_POCKET`. Custodies the USDC reserves (~2.67B USDC at snapshot) |
| LitePSM Jar | [`0x69cA348Bd928A158ADe7aa193C133f315803b06e`](https://etherscan.io/address/0x69cA348Bd928A158ADe7aa193C133f315803b06e) | `MCD_LITE_PSM_USDC_A_JAR`. Receives swap fees (currently zero) |
| **LitePSM Mom (emergency halt)** | [`0x467b32b0407Ad764f56304420Cddaa563bDab425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) | `LITE_PSM_MOM`. Authority = Chief, owner = PauseProxy. Lets the elected Chief hat instantly halt PSM swaps without the 48 h GSM delay |
| Emergency Halt Spell Factory | [`0xB261b73698F6dBC03cB1E998A3176bdD81C3514A`](https://etherscan.io/address/0xB261b73698F6dBC03cB1E998A3176bdD81C3514A) | `EMSP_LITE_PSM_HALT_FAB` |
| CRON LitePSM Job | [`0x0C86162ba3E507592fC8282b07cF18c7F902C401`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401) | Keeper job that periodically tops up / fills the PSM buffer |

### Sky / MakerDAO Core (governs USDS, sUSDS, PSM)

| Contract | Address | Role |
|----------|---------|------|
| MCD VAT (core ledger) | [`0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) | The accounting nucleus of the Sky/Maker system. `debt()` ≈ 10.54B (rad-normalized) |
| MCD Vow (surplus / sin buffer) | [`0xA950524441892A31ebddF91d3cEEFa04Bf454466`](https://etherscan.io/address/0xA950524441892A31ebddF91d3cEEFa04Bf454466) | Stability fee accumulator; receives the SSR drip differential |
| MCD Pot (DSR) | [`0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7`](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7) | DAI Savings Rate pot — predates sUSDS, parallel rate accumulator |
| **MCD Pause** | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | DSPause with `delay() = 172800` seconds (**48 hours GSM delay**). `owner = address(0)`; only spells elected by Chief can schedule |
| **MCD PauseProxy** | [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) | The address governance executes as. Holds `wards[USDS]==1`, `wards[sUSDS]==1`, and is the upgrade authority for both proxies |
| **MCD Chief (governance vote)** | [`0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) | DSChief. Continuous-approval voting over SKY token. Current `hat()` = [`0xaBc702420dCc1868F7f8Df06A89dA766BcB01136`](https://etherscan.io/address/0xaBc702420dCc1868F7f8Df06A89dA766BcB01136) ("2026-11-05 MakerDAO Executive Spell", `done() == true`) |
| MCD Spot (price feed router) | [`0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3`](https://etherscan.io/address/0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3) | Price oracles for VAT collateral types |
| SKY governance token | [`0x56072C95FAA701256059aa122697B133aDEd9279`](https://etherscan.io/address/0x56072C95FAA701256059aa122697B133aDEd9279) | `MCD_GOV`. Total supply ~23.45B SKY |
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
- **TVL growth (USDS, [DefiLlama stablecoin id 209](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)):** $98.5M on launch day → **~$5.36B on November 16, 2026 00:00 UTC** (cross-chain); ~$5.22B on Ethereum mainnet by raw ERC-20 `totalSupply()` at the 19:11 UTC snapshot
- **Sky Lending TVL** ([DefiLlama](https://defillama.com/protocol/sky-lending)): ~$3.75B (Ethereum-only)
- **sUSDS adoption:** ~3.67B USDS locked in sUSDS — **about 70% of mainnet USDS supply** is staked in the savings vault, indicating very heavy "yield seeker" capture. A further ~161.8M USDS sits in the newer **stUSDS** staking module ([`0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9`](https://etherscan.io/address/0x99CD4Ec3f88A45940936F469E4bB72A2A701EEB9)), assessed separately in [sky-stusds.md](sky-stusds.md)
- **Peg history (USDS, past 365 days via [CoinGecko](https://www.coingecko.com/en/coins/usds) daily series):**
  - Min: **0.9968** (October 30, 2026); the hourly series over the last 90 days bottoms at **0.9965** (October 30, 2026 01:00 UTC), 0.35% off peg
  - Max: **1.0011** (February 23, 2026)
  - Latest: 0.9998 (within peg)
  - Earlier stress: during the October 2025 market-wide stablecoin stress the daily series bottomed at **0.9975** (October 11, 2025) and the hourly series at **0.9947** (October 6, 2025)
- **Past security incidents (relevant to USDS path):**
  - **Black Thursday (March 12, 2020) — DAI/MCD:** Cascading ETH price crash combined with mempool congestion caused some liquidation auctions to be won at $0 bids. ~$6M of system shortfall was absorbed by minting MKR to recapitalize. Affected users were later partly compensated via DAO vote. The liquidation system was redesigned (Liquidations 2.0, audited by Quantstamp). USDS did not exist yet
  - **USDC depeg (March 11, 2023):** Circle's USDC briefly traded as low as ~$0.88 following Silicon Valley Bank exposure. DAI traded down with it (~$0.88 floor) because of the USDC PSM dependency. Sky/Maker responded by widening PSM fees temporarily and accelerating diversification into RWAs. USDS would inherit the same USDC peg exposure today — a USDC depeg is the largest non-bug peg risk to USDS
  - **No USDS/sUSDS/LitePSM-specific incidents** since their respective launches (~26 months at this snapshot)
- **TVL trend:** USDS remains multi-billion scale and has held a tight peg. Cross-chain supply contracted through mid-2026 (~8.84B in May → ~8.19B in June → ~6.64B on September 9), recovered to ~7.07B on October 16, 2026, and then fell to **~5.36B** by November 16, 2026 ([DefiLlama](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)). Onchain mainnet `totalSupply()` fell from 6.47B ([block 26350000](https://etherscan.io/block/26350000), November 5) to 5.36B ([block 26400000](https://etherscan.io/block/26400000), November 12) and 5.22B at the snapshot; sUSDS `totalAssets()` fell from 4.51B to 3.67B over the same window. Over November 5–16, the Pocket's USDC balance fell from 3.51B to 2.67B and `LITE-PSM-USDC-A` debt from 4.30B to 3.46B, so ~840M of the outflow was redeemed for USDC through the LitePSM. `ALLOCATOR-SPARK-A` debt fell from 4.08B to 3.69B. Separately, `ALLOCATOR-BLOOM-A` (Grove) debt fell from 2.50B on September 9 to ~1.49B. The LitePSM absorbed the outflow with `tin = tout = 0`, no halt, and an hourly low of 0.9985 since November 5. No forced unwind, redemption failure, or USDS-specific incident was identified.
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
   - **Fees:** `tin = tout = 0` (zero). The LitePSM `buf` (800M DAI) acts as a hot supply buffer so user swaps do not have to wait for VAT bookkeeping. 789.5M DAI was held against that target at the snapshot
   - **Capacity:**
     - USDC → USDS direction: bounded by `buf` (800M DAI per refill cycle, keeper-replenished) and ultimately by the Sky governance-set `line` for the PSM ilk in the VAT
     - USDS → USDC direction: bounded by the **Pocket USDC balance** (currently **~2.67B USDC**)
   - **Atomic:** yes — entire path completes in one transaction

3. **Prime allocator vaults** — the largest issuance channel after the PSM. Sky governance grants an allocator (a "Prime" or "Star") a VAT ilk with a debt ceiling; the allocator draws USDS and deploys it into onchain lending, tokenized treasuries, and credit strategies. At the snapshot, per-ilk debt (`Art × rate` from `MCD_VAT.ilks`): **Spark** (`ALLOCATOR-SPARK-A`) **~$3.69B**, **Grove** (`ALLOCATOR-BLOOM-A`) **~$1.49B**, **Obex** (`ALLOCATOR-OBEX-A`) **~$406M**, plus `ALLOCATOR-GROVE-A` (~$129.9M) and `ALLOCATOR-PRYSM-A` (~$10.0M, administered by the Osero SubProxy); **Keel** (`ALLOCATOR-NOVA-A`), `ALLOCATOR-PATTERN-A` and `ALLOCATOR-INTERVAL-A` are at 0. Together ~$5.73B, ~54.3% of VAT debt. Each ilk's `line` is raised by the permissionless AutoLine up to a governance-set maximum (Spark: up to $10B, at most +$1.5B per 24 h; Grove `BLOOM`: $5B, +$500M; Obex: $2.5B, +$50M). What backs these positions is discussed under [Collateralization](#collateralization)

4. **D3M (Direct Deposit Module)** — Sky governance can mint USDS directly to lending markets (Spark, Aave-Lido) up to per-market debt ceilings, where the USDS is borrowed by users. At the snapshot the `DIRECT-SPK-AAVE-LIDO-USDS` ilk carries **zero** debt and the Spark Aave-Lido USDS pool ([`DIRECT_SPK_AAVE_LIDO_USDS_POOL`](https://etherscan.io/address/0xbf674d0cD6841C1d7f9b8E809B967B3C5E867653)) holds 0 USDS, so this channel is dormant

5. **MakerDAO/Sky CDPs (ETH-A, ETH-B, ETH-C, wstETH-A, wstETH-B, WBTC-C, RWA-* vaults, LockStake)** — borrowers post collateral, draw DAI (which they can then swap to USDS via the converter). These vaults are over-collateralized at the ilk level (typical liquidation ratios 145–170% for crypto, 100%+ for RWAs). Combined crypto-CDP and LockStake debt is now **~$534M**, ~5.1% of VAT debt

All channels ultimately settle through **MCD_VAT** ([`0x35D1b3F3…492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B)), which at the snapshot reports `debt()` in rad units → **~10.54B normalized debt**. The corresponding DAI + USDS issued supply (Ethereum mainnet) is ~4.43B + ~5.22B ≈ **~9.65B**. The ~$890.6M difference is internal `vat.dai` that has not been exited to ERC-20: the Vow's **$706.0M** surplus (`vat.dai(MCD_VOW)`) and **$184.0M** of DSR deposits held by [MCD_POT](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7) (`vat.dai(MCD_POT)`), with ~$0.5M in other internal balances.

### Accessibility

| Operation | Permission | Atomic? | Fees | Limits |
|-----------|-----------|---------|------|--------|
| USDC → USDS (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | `buf = 800M DAI` per fill; capped by PSM `line` in VAT |
| USDS → USDC (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | Pocket USDC balance (~2.67B) |
| DAI ↔ USDS (Converter) | Permissionless | Yes (1 tx) | 0 | None — direct mint/burn through USDS_JOIN |
| Deposit USDS → sUSDS | Permissionless | Yes (1 tx) | 0 | None (sUSDS is unbounded ERC-4626) |
| Withdraw USDS ← sUSDS | Permissionless | Yes (1 tx) | 0 | None |
| **Mint USDS directly** | **Wards-gated** — only contracts in `USDS.wards == 1` (currently USDS_JOIN and PauseProxy) | — | — | Only PauseProxy can grant new wards; new ward requires a passed Chief spell + 48 h GSM delay |

There is **no whitelist on swaps**, no KYC requirement, **no cooldown**, and **no withdrawal queue** for sUSDS. All flows are single-transaction.

### Token Mint Authority

**Mint mechanism:** `wards` mapping on the USDS proxy. `mint(to, value)` is `auth` (any address with `wards == 1`); `burn` is permissionless for the holder or an approved spender. USDS_JOIN mints only on `exit`, which first moves the caller's internal `vat.dai` to the join, so every USDS minted through the join is a liability already recorded in MCD_VAT.

**Mint requires backing:** Through USDS_JOIN, the internal `vat.dai` must already exist. That `vat.dai` comes from VAT debt: collateralized CDP draws, LitePSM sales of USDC, `vat.suck` for savings interest, or Prime allocator draws. Allocator draws are bounded by the ilk's `line` but are not backed at mint time; backing is whatever the allocator deploys the USDS into. PauseProxy can mint directly without backing.

**Per-address mint authority** (verified onchain at block [26429600](https://etherscan.io/block/26429600) from `Rely`/`Deny` events on the USDS proxy since deployment; each candidate rechecked with `wards(address)`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) (USDS_JOIN) | ✓ | ✓ | `wards == 1` | Mints against internal `vat.dai`; no admin functions or `wards` of its own |
| [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) (MCD_PAUSE_PROXY) | ✓ | ✓ | `wards == 1`; upgrade authority | Executes only spells passed by Chief and delayed 48 h by MCD_PAUSE. Can also `rely` new minters or upgrade the implementation |

Of the three historical `Rely`/`Deny` candidates, only these two hold `wards == 1`. The OFT adapters, native token bridges and DAI-USDS converter hold no USDS `wards`.

**Upstream `vat.dai` creation:** any MCD_VAT ward can create internal `vat.dai` (`suck`), which USDS_JOIN will exit as USDS. VAT `rely` emits no event, so the ward set was tested against every address in the onchain chainlog: **125 of them hold `wards == 1`**. All are Sky contracts deployed and wired by governance: PauseProxy, END/ESM, Jug, Spot, Dog, Pot, sUSDS, stUSDS, LockStake engine and clipper, `MCD_FLASH`, `MCD_KICK`, `MCD_VEST_*`, `DIRECT_HUB`, AutoLine, `LINE_MOM`, and collateral joins and clippers. No EOA or Safe was found among them. `TODO`: VAT wards outside the chainlog cannot be enumerated from events; a full ward set requires tracing `Vat.rely` calls in executed spells.

**Rate limits / supply caps:** Global `Vat.Line()` = ~$14.74B against $10.54B of debt. Per-ilk `line`; allocator and LockStake lines are managed by AutoLine (`exec` is permissionless and raises `line` by at most `gap` per `ttl` up to a governance-set maximum). PauseProxy minting is uncapped.

**Backing check at mint time:** Atomic for the PSM (USDC in) and CDPs (collateral locked, `spot` checked). Deferred for Prime allocators (drawn against `line`, backed by downstream positions). None for `vat.suck`, which creates `vice` that is covered from Vow surplus.

### Collateralization

USDS does **not** have a clean "this collateral backs this token" picture — it inherits the full Sky/MakerDAO collateral book. Per-ilk debt below is `Art × rate` read from `MCD_VAT.ilks(ilk)` at the snapshot block, against total VAT `debt()` of ~10.54B:

| Class | Ilk(s) | Debt at snapshot | Share of VAT debt | Role in backing |
|-------|--------|-----------------:|------------------:|-----------------|
| **USDC PSM (LitePSM)** | `LITE-PSM-USDC-A` | **~$3.46B** | 32.9% | Only ~$2.67B of this is external collateral (USDC in the Pocket); the other ~$789.5M is system-issued DAI pre-minted into the PSM as swap inventory, so it backs nothing on its own. Observatory books this line at the Pocket value (~$2.68B), not the ilk debt. Largest single backing line and the source of USDS-USDC swap capacity |
| **Prime allocator vaults** | `ALLOCATOR-SPARK-A` (~$3.69B), `ALLOCATOR-BLOOM-A` / Grove (~$1.49B), `ALLOCATOR-OBEX-A` (~$406M), `ALLOCATOR-GROVE-A` (~$129.9M), `ALLOCATOR-PRYSM-A` (~$10.0M), `ALLOCATOR-NOVA-A` / Keel and two others (0) | **~$5.73B** | 54.3% | USDS drawn by allocators and deployed into onchain lending, stablecoins, tokenized credit and OTC lending. Backing quality is the quality of those downstream positions, not of a liquidatable onchain CDP |
| Crypto-backed CDPs | `ETH-A`, `ETH-B`, `ETH-C`, `WSTETH-A`, `WSTETH-B`, `WBTC-A`, `WBTC-B`, `WBTC-C` | ~$372M | 3.5% | Over-collateralized loans, ~145–170% liquidation ratio. Volatile but onchain-liquidatable |
| LockStake (SKY staked) | `LSEV2-SKY-A` | ~$162M | 1.5% | Borrow against locked SKY — governance-token-backed, reflexive. The ilk `line` equals its current debt, so no new LockStake borrowing is available at the snapshot |
| Legacy RWA vaults | `RWA002-A` (New Silver, ~$10.7M), `RWA004-A` (Harbor Trade, ~$1.5M), `RWA005-A` (FortunaFi, ~$2.8M), `RWA009-A` (HVB, ~$49.6M) | ~$64.6M | 0.6% | Offchain custody / credit risk; the residual of the original RWA program |
| **System unbacked debt (`vice`)** | not an ilk — `MCD_VAT.vice()`, all attributed to MCD_VOW | **~$752.3M** | 7.1% | The `sin` side of the ledger. Structurally generated by savings accrual: `sUSDS.drip()` and `Pot.drip()` call `vat.suck(vow, …)` to mint SSR/DSR interest, which creates unbacked debt at the Vow. See the Vow position below |
| D3M (Spark/Aave Direct Deposit) | `DIRECT-SPK-AAVE-LIDO-USDS` and four legacy D3M ilks | **0** | 0% | Dormant at the snapshot |

The table reconciles exactly against the VAT identity `debt = Σ(Art × rate) + vice`: summing all 33 ilks in the [ILK_REGISTRY](https://etherscan.io/address/0x5a464C28D19848f44199D003BeF5ecc87d090F87#readContract) gives **$9,787,355,569.44**, plus `vice()` of **$752,268,538.07**, equals `debt()` of **$10,539,624,107.51** to the cent. `PSM-GUSD-A` and `PSM-PAX-A` have left the registry and carry zero `Art`.

**The Vow's net position is a deficit, not a surplus.** At the snapshot the Vow holds **$706.0M** of surplus DAI (`vat.dai(vow)`) against **$752.3M** of unbacked debt (`vat.sin(vow)`, all of the system's `vice`), leaving a **net −$46.3M**. Of that debt, $228.9M is queued for `flog` (`vow.Sin()`) and none is on auction (`vow.Ash() = 0`). The legacy surplus-auction path is disabled — `vow.bump() = 0` and `vow.hump() = 2^256−1` make `flap()` unreachable — so surplus is handled outside the Vow's own auction machinery. Observatory books the same ~$46.3M as its "Operating Cash Balance" liability line.

Cutting the same book by *underlying asset* rather than by ilk, SkyEco / Observatory's [USDS collateral-backing API](https://observatory.data.blockanalitica.com/sky/backed/items/) reports at 2026-11-16 20:00 UTC: stablecoins ~$4.01B (47.5%), onchain crypto lending ~$2.76B (32.7%), OTC crypto lending ~$1.07B (12.6%), AAA corporate debt ~$500M (5.9%), legacy RWA (Observatory category "Other") ~$64.6M, basis trade ~$20.6M and private credit ~$15.3M. The short-duration Treasury bill category (~$1.33B in September, Janus Henderson Treasury Fund and BlackRock BUIDL) no longer appears; its exit coincides with the ~$1.01B fall in `ALLOCATOR-BLOOM-A` debt. **Offchain or tokenized credit exposure therefore totals ~$1.67B — ~19.8% of Observatory's ~$8.43B loan-coverage backing**, leaving ~80.2% onchain. Maintenance-coverage backing is ~$9.22B and total collateral value ~$12.76B, the latter ~121% of VAT debt.

**A note on denominators.** The table above is expressed as a share of `VAT.debt()` because that is the issuance side of the ledger, and it is the only view derivable purely onchain. It is *not* a backing denominator: it includes $752.3M of `vice` (which is unbacked by construction) and prices the PSM at ilk debt rather than at the Pocket's USDC. Any claim about the *composition of collateral* uses Observatory's ~$8.43B loan-coverage backing instead. The same offchain exposure is ~15.8% of VAT debt but ~19.8% of backing; the backing figure is the meaningful one, and this report uses it wherever collateral quality is being characterised. Observatory's per-asset figures are reported holdings with periodic attestation for the offchain slice, not independently verified reserves — only the ~$2.67B Pocket USDC and the onchain lending and LP positions can be confirmed by direct contract reads.

**System-level overcollateralization** is not directly readable from a single onchain call — it requires aggregating per-ilk `Art × rate` (debt) and `ink × oracle price × liquidation-ratio` (locked collateral value). Observatory's [balance-sheet aggregate](https://observatory.data.blockanalitica.com/financials/balance-sheet/aggregates/?group_by=month) reports **~$9.80B assets** against **~$9.83B liabilities** for its November 16, 2026 snapshot — a **~$28M deficit** (the September 30, 2026 month-end row shows ~$11.41B against ~$11.47B, a ~$57M deficit). This is a wider accounting frame than the Vow: it counts the $157M Sky Capital Buffer as an asset and books the Prime vaults at ~$5.58B, below their ~$5.73B drawn debt. Onchain VAT debt is ~10.54B against ~9.65B Ethereum DAI + USDS issued supply.

**Key takeaway for the USDS holder:** the collateral mix is far better than a fiat-only stablecoin (no single banking dependency), but worse than a pure crypto-collateralized model — direct crypto-CDP backing is now only ~3.5% of VAT debt, and more than half of issuance sits in Prime allocator vaults whose assets are a mix of onchain lending, stablecoins, tokenized credit and OTC lending. **For a USDC→USDS→sUSDS user specifically**, the relevant backing slice is the **USDC PSM pocket** (~2.67B USDC, ~31.7% of loan-coverage backing), with the rest of the Sky book acting as a *secondary* solvency buffer. As long as the PSM peg arbitrage works, USDS effectively trades at the lower of `peg(DAI)` and `peg(USDC)`.

### Provability

- **sUSDS exchange rate:** `convertToAssets(shares)` is fully onchain via `chi` accumulator and `ssr` rate. Continuous accrual is a pure function of `ssr` and elapsed time since `rho` (last `drip` timestamp). At snapshot: `chi = 1.11657`, `ssr = 1.0000000011826…`, `rho = 1794855671` (2026-11-16 19:01 UTC)
- **System debt (VAT):** Readable onchain via `MCD_VAT.debt()` and per-ilk `urns(ilk, urn)`, `ilks(ilk).Art`, `ilks(ilk).rate`. Full reserve audit requires aggregating dozens of ilks but is mechanically possible from public RPC
- **USDC PSM Pocket:** `USDC.balanceOf(pocket)` is publicly callable — at snapshot returns 2.67B USDC
- **RWA / offchain-credit backing:** Less transparent. Legacy `RWA00x` ilks total only **~$64.6M** at the snapshot, but broader Observatory categories with offchain/tokenized credit exposure total **~$1.67B**: OTC crypto lending (~$1.07B), AAA corporate debt (~$500M), legacy RWA (~$64.6M), basis trade (~$20.6M) and private credit (~$15.3M). The underlying assets sit at TradFi custodians or offchain credit venues, so this remains the least directly verifiable slice of backing. Because ~54.3% of VAT debt is drawn by **Prime allocator vaults**, the ilk-level view alone does not reveal what backs it — that requires trusting Observatory's look-through into each allocator's positions. Measured on the backing side rather than the debt side, the offchain slice is ~19.8% of Observatory's ~$8.43B loan-coverage backing
- **Can admins mint USDS out of thin air?** Yes, by definition — Sky governance (PauseProxy) can `usds.rely(addr)` to grant `wards = 1` to any address, which then has unrestricted minting via the underlying contract. This change must go through Chief vote + 48 h GSM delay. At the snapshot, the *only* non-governance ward is `USDS_JOIN`, which itself only exits `vat.dai` already created in the VAT (see [Token Mint Authority](#token-mint-authority))

## Liquidity Risk

### Primary Exit Path: LitePSM Wrapper (USDS → USDC)

- **Direct 1:1 redemption** with zero fee. Atomic in a single transaction
- **Capacity (USDS → USDC):** bounded by **USDC balance in the Pocket = 2,674,118,037 USDC** at snapshot. That is ~2.67B exit capacity in a single tx with **0% slippage**
- **No cooldown, no queue, no per-user cap**. Anyone holding USDS can swap to USDC by calling `WRAPPER_USDS_LITE_PSM_USDC_A.buyGem(usr, gemAmt)`
- **Reverse direction (USDC → USDS)** is also atomic and zero-fee, bounded by the `buf` (800M DAI) per refill cycle. A CRON keeper job ([`CRON_LITE_PSM_JOB`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401)) regularly refills the buffer; under heavy demand the buffer can be refilled multiple times per day

### Secondary Path: DAI-USDS Converter

- Atomic 1:1 conversion of USDS → DAI (or DAI → USDS), zero fee
- Unbounded — settles directly through `USDS_JOIN` and `DAI_JOIN` against MCD_VAT
- Useful when a user wants to access DAI-paired DEX liquidity (which is much deeper than direct USDS pairs)

### Tertiary: sUSDS ERC-4626 Withdrawal

- `redeem(shares, receiver, owner)` returns USDS at the current `chi` rate, atomic, zero fee. It first calls `drip()`, which mints only the yield accrued since the last `rho` (`vat.suck(vow, sUSDS, diff)` then `usdsJoin.exit(sUSDS, diff)`), then burns the shares and transfers USDS the vault already holds (`usds.transfer(receiver, assets)` in the deployed [`SUsds` implementation](https://etherscan.io/address/0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0#code)). Principal is not minted on withdrawal: at the snapshot the vault held [3,671,682,351 USDS](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F#readContract) (`USDS.balanceOf(sUSDS)`) against `totalAssets()` of 3,671,685,113 — the ~2,762 USDS difference is yield accrued since the last `drip()` (~10 minutes earlier) but not yet minted. There is no per-block withdrawal cap or queue; every share is redeemable from the vault's own USDS balance

### DEX Liquidity

USDS DEX liquidity on Ethereum mainnet is meaningful but **not** the primary exit path — most large flows route through the PSM, not AMM pools. Top Ethereum pools touching USDS or sUSDS, from [DefiLlama yields](https://yields.llama.fi/pools) on November 16, 2026:

| Project | Pool | TVL ($) |
|---------|------|--------:|
| Sky Lending | sUSDS | ~$3.67B |
| SparkLend | USDS (two pools) | ~$351M + ~$212M |
| Sky Lending | stUSDS | ~$162M |
| Sky Lending | USDS (Grove farming pool) | ~$129M |
| Uniswap V4 | PYUSD-USDS | ~$100M |
| Uniswap V4 | USDT-USDS | ~$55M |
| Morpho Blue | sUSDS market | ~$54M |
| Uniswap V4 | RLUSD-USDS | ~$50M |
| Centrifuge | USDS (Janus Henderson Treasury Fund) | ~$26M |
| Morpho Blue | PT-sUSDS-26NOV2026 | ~$11M |

Direct **USDS-USDC** DEX liquidity is small (no Uniswap/Curve USDS-USDC pool sits above $10M at the snapshot). This is because the **PSM Wrapper provides zero-fee 1:1 USDC↔USDS swaps**, so DEX routes cannot meaningfully out-price the PSM — there is no incentive for LPs to build deep USDS-USDC pools. For any reasonable Yearn integration size, the PSM (with ~$2.67B Pocket depth) is the dominant exit path; DEX liquidity is a secondary concern only at the multi-hundred-million-dollar scale.

### Cross-Chain Liquidity

USDS and sUSDS reach other chains via **two separate bridge systems** (full contract list in [Cross-Chain Bridges](#cross-chain-bridges-skylink)):

1. **Native canonical L2 token bridges (SkyLink)** — Base, Optimism, Unichain (OP Stack) and Arbitrum (Arbitrum Nitro gateway). L1 tokens are locked in a per-chain escrow and minted 1:1 on the L2 by that chain's own canonical bridge. These carry the **bulk** of cross-chain supply: ~4.4M USDS and ~443M sUSDS across the four escrows at the snapshot, with ~96.5% of the sUSDS in the Arbitrum escrow and ~89.5% of the USDS in the Base escrow after the July and October 2026 Spark repatriations. Security rests on each rollup's canonical bridge (battle-tested L1↔L2 messaging) plus PauseProxy governance; L2→L1 exits inherit the chain's challenge window (up to ~7 days on optimistic rollups). **No LayerZero / DVN trust assumption applies to these chains.**
2. **LayerZero V2 OFT Adapters** — USDS to **Solana + Avalanche only** (~4.58M USDS locked); the sUSDS OFT adapter currently locks 0. This is the only Sky bridge that appears on LayerZero Scan (Ethereum + Solana + Avalanche) and the only one carrying third-party-verifier (DVN) trust — analyzed in [LayerZero V2 Dependency](#layerzero-v2-dependency).

Onchain verification confirms **neither the OFT adapters nor any native bridge holds `wards` on USDS/sUSDS** — none can mint the underlying token; all lock-and-mint against escrowed supply. The native token bridges are warded by PauseProxy, and both OFT adapters are owned by PauseProxy.

In total ~9.0M USDS (and ~443M sUSDS shares, ~$494M at `chi`) sits outside Ethereum mainnet — matching DefiLlama's per-chain USDS balances (Solana ~4.6M, Base ~3.9M, Arbitrum ~0.4M, Optimism/Unichain/Avalanche dust). For an Ethereum-mainnet-only Yearn strategy, cross-chain bridge exposure is operationally none.

### Historical Liquidity Under Stress

- During the October 2025 stablecoin stress event (USDS hourly low 0.9947 on October 6, 2025), USDS-USDC swaps via the PSM remained available throughout — the peg deviation was driven by secondary AMM markets, not by Pocket depletion
- Over November 5–16, 2026, ~840M USDC left the Pocket (3.51B → 2.67B) as USDS supply fell from 6.47B to 5.22B. The LitePSM processed the redemptions at `tin = tout = 0` with no halt, and the hourly USDS price stayed at or above 0.9985 over the window ([CoinGecko](https://www.coingecko.com/en/coins/usds))
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
  - Total SKY locked in Chief: **7,137,322,027 SKY** (~30.4% of the 23.45B SKY supply)
  - Approvals for the current hat ([`0xaBc702420dCc1868F7f8Df06A89dA766BcB01136`](https://etherscan.io/address/0xaBc702420dCc1868F7f8Df06A89dA766BcB01136), the executed November 5, 2026 spell): **7,028,386,042 SKY** (~30.0% of total supply; **~98.5% of locked SKY votes for the hat**)
  - Sky's [current-hat API](https://vote.sky.money/api/executive/hat?network=mainnet) and [supporter API](https://vote.sky.money/api/executive/supporters?network=mainnet), read on November 16, 2026, show high supporter concentration for the current hat. The largest supporter, **Tango**, has **2.47B SKY** (**35.19%** of hat approvals). The top 3 supporters have **~90.0%** of hat approvals; the top 5 have **~98.2%**. No single supporter currently exceeds 50%, but any two of the top three delegates can exceed a majority of current-hat approvals.

| Rank | Supporter | Vote-delegate address | SKY approving current hat | % of hat approvals |
|------|-----------|-----------------------|---------------------------|--------------------|
| 1 | Tango | [`0x550e…72ad`](https://etherscan.io/address/0x550e5ec00b9d26a3517ce772ddfe73e8ed1672ad) | 2,473,121,144 | 35.19% |
| 2 | cloaky | [`0x0f23…cc86`](https://etherscan.io/address/0x0f23de72e1581857eacd6308aebb69cf3a49cc86) | 2,145,193,988 | 30.52% |
| 3 | BLUE | [`0x173a…9558`](https://etherscan.io/address/0x173a1c04b79ed9266721c1154daa29addc0b9558) | 1,706,370,364 | 24.28% |
| 4 | Bonapublica | [`0xfc48…753d`](https://etherscan.io/address/0xfc48fbca739079aab08216c4d5e506b96593753d) | 488,595,047 | 6.95% |
| 5 | aegisD | [`0xd260…bf5e`](https://etherscan.io/address/0xd260762e442ea1893e5ed5e7d28984e19aafbf5e) | 91,266,394 | 1.30% |
| 6 | Max Staking Yield | [`0xff76…ee2f`](https://etherscan.io/address/0xff7615e05ec1c8d5ded24ab50bf74432666bee2f) | 53,873,837 | 0.77% |
| 7 | PBG | [`0x5552…b850`](https://etherscan.io/address/0x555230eca835a808518ec3ea3082f05502bab850) | 48,424,350 | 0.69% |
| 8 | WBC | [`0x4bed…ae90`](https://etherscan.io/address/0x4bed44a9839b8778f69bb6a6d9f843414377ae90) | 21,551,213 | 0.31% |
| 9 | Shadow Delegate | [`0x768c…565e`](https://etherscan.io/address/0x768c6d939126935d4d53be38eaa043d7cf08565e) | 1,019 | 0.00% |

- **48 h delay is at the low end** for upgradeable stablecoin systems (compared to 7-day on many newer protocols). A determined attacker with sufficient SKY could theoretically push through harmful changes if they can hold the hat for 48 h without being out-voted
- **Privileged role: PauseProxy can mint USDS to anyone** by granting `wards = 1` to a new address. This is the same "governance can do anything" property all DAO-controlled stablecoins share. The 48 h delay + onchain visibility is the only constraint

### Critical Permission Paths and Weakest Link

A material loss here is a loss of the USDS backing or of the USDS held by sUSDS. Roles were read at block [26429600](https://etherscan.io/block/26429600): `wards` on USDS, sUSDS and the LitePSM from `Rely`/`Deny` events since deployment; MCD_VAT `wards` by testing every chainlog address; SubProxy `wards` from events; Mom `owner`/`authority`; SP-BEAM `buds` from `Kiss`/`Diss` events.

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Upgrade USDS / sUSDS (`upgradeToAndCall`), `rely` new USDS minters or VAT wards, `file` any VAT/PSM/sUSDS parameter; with a new minter, redeem unbacked USDS for the Pocket's USDC through the LitePSM | [MCD_PAUSE_PROXY](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB), reached only through a spell that is the Chief hat ([`MCD_ADM`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9)) and is plotted on [MCD_PAUSE](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | `delay() = 172800` (48 h); `MCD_PAUSE.owner = 0`; the hat must out-approve 7.03B SKY; a later hat can `drop` the plan during the delay | Everything: 5.22B USDS supply, 3.67B USDS in sUSDS, 2.67B USDC in the Pocket, all VAT collateral |
| Draw USDS against an `ALLOCATOR-*` ilk and deploy it (`AllocatorVault.draw`, buffer approvals) | Roles granted by each ilk admin in [ALLOCATOR_ROLES](https://etherscan.io/address/0x9A865A710399cea85dbD9144b7a09C889e94E803): the Prime SubProxy ([Spark](https://etherscan.io/address/0x3300f198988e4C9C63F75dF86De36421f06af8c4), [Grove](https://etherscan.io/address/0x1369f7b2b38c76B6478c0f0E66D94923421891Ba), [Obex](https://etherscan.io/address/0x8be042581f581E3620e29F213EA8b94afA1C8071), [Osero](https://etherscan.io/address/0x24fdcd3bFA5C2553e05B2f9AD0365EBC296278D3)). Each SubProxy's `wards` are PauseProxy and the Prime's StarGuard ([Spark](https://etherscan.io/address/0x6605aa120fe8b656482903E7757BaBF56947E45E), [Grove](https://etherscan.io/address/0xfc51CAa049E8894bEcFfB68c61095C3F3Ec8a880), [Obex](https://etherscan.io/address/0x987f1C31f9935e9926555BcFB76516bb2EcEccaD)), which executes only spells plotted by PauseProxy (`maxDelay = 604800`) | Ilk `line` via AutoLine (Spark ≤ $10B, +$1.5B per 24 h; Grove `BLOOM` ≤ $5B, +$500M; Obex ≤ $2.5B, +$50M). Downstream relayer roles, rate limits and allowlists are not enumerated: `TODO` | $5.73B currently drawn; up to the AutoLine maxima |
| Set SSR, DSR and configured stability fees (`SPBEAM.set` → `sUSDS.file("ssr")`, `pot.file`, `jug.file`) | Only `bud`: 2-of-3 Safe [`0xe1c6f81D0c3CD570A77813b81AA064c5fff80309`](https://etherscan.io/address/0xe1c6f81D0c3CD570A77813b81AA064c5fff80309) via [MCD_SPBEAM](https://etherscan.io/address/0x36B072ed8AFE665E3Aa6DaBa79Decbec63752b22) (owner set unchanged since the September 9, 2026 snapshot) | Code-enforced: SSR 2%–30%, ≤4 percentage points per change, one batch per `tau` = 16 h. The hat can halt it instantly via [SPBEAM_MOM](https://etherscan.io/address/0xf0C6e6Ec8B367cC483A411e595D3Ba0a816d37D0); PauseProxy can `deny` it | No principal moves. The maximum SSR is reachable in seven changes over ≥4 days; at 30% the extra accrual on 3.67B sUSDS would be ~$2.6M/day of new `vice` |
| Halt PSM swaps, stop oracles or liquidations, wipe debt ceilings (`LITE_PSM_MOM`, `OSM_MOM`, `CLIPPER_MOM`, `LINE_MOM`, `SPLITTER_MOM`, `DIRECT_MOM`, `STUSDS_MOM`) | Chief hat (`authority`), owner PauseProxy | None: no GSM delay. Pause-only; cannot move funds | Blocks the 2.67B USDC exit path; DAI-USDS converter and DEX exits remain |
| Mint OFT / L2 representations | OFT adapters owned by PauseProxy (2-of-2 DVN: LayerZero Labs + Nethermind); native token bridges warded by PauseProxy | 48 h governance path; no USDS/sUSDS `wards` | 4.58M USDS (LayerZero) and 4.4M USDS + 443M sUSDS (native escrows) |

[ESM](https://etherscan.io/address/0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58) is disabled: `min() = 2^256−1`, so emergency shutdown cannot be triggered by depositing governance tokens and is reachable only through a governance spell.

**Weakest credible path to material loss:** Sky governance via the Chief hat. Any spell that gains more SKY approval than the current hat's 7.03B SKY (~30.0% of supply; any two of the top three delegates control a majority of it) can, after the 48 h `MCD_PAUSE` delay, upgrade USDS or sUSDS, or `rely` an arbitrary minter whose unbacked USDS can then be redeemed for the Pocket's USDC. This places every USDS and the 3.67B USDS in sUSDS at risk. The same hat can halt LitePSM exits through `LITE_PSM_MOM` with no delay while the malicious spell waits, leaving the DAI converter and DEX liquidity as exits. The 48 h delay and the ability of a competing hat to `drop` the plan are the only enforceable safeguards. The Prime allocator layer is a potentially comparable path: $5.73B of drawn USDS is controlled by each Prime's ALM roles, whose relayer keys, rate limits and allowlists are not enumerated here (`TODO`: Spark ALM Proxy [`0x1601843c5E9bC251A3272907010AFa41Fa18347E`](https://etherscan.io/address/0x1601843c5E9bC251A3272907010AFa41Fa18347E) controller roles and `RateLimits`, and the Grove, Obex and Osero equivalents). Until they are, this report does not claim that no weaker path exists. The SP-BEAM Safe is a bounded rate role, not a material-loss path: it cannot move principal, its cumulative cost is capped by `step`, `max` and `tau`, and the hat can halt it immediately.

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
| **Circle / USDC** | LitePSM Wrapper, Pocket holds 2.67B USDC | **Critical** for USDS-USDC swap path. A USDC freeze/blacklist on the Pocket or a USDC depeg would directly impair USDS-USDC convertibility | Circle has blacklisted addresses before (TornadoCash, OFAC sanctions). The Pocket has not been blacklisted but is on-chain visible and bounded by Circle's policy |
| **DAI / MakerDAO core (VAT, Join, Pot, Pause, Chief)** | All conversion paths | **Critical** — USDS shares the VAT with DAI. A bug in any MCD core contract impairs USDS | 8+ years of production with documented incidents (Black Thursday) but no exploit since |
| **Offchain / tokenized-credit issuers and custodians** (via Prime allocators) | ~19.8% of backing (~$1.67B). Named positions at the snapshot: Galaxy Warehouse OTC (~$430.0M) and Galaxy Arch CLO token (~$17.9M), Syrup USDC / Maple (~$407.4M), Janus Henderson Anemoy AAA CLO (~$264.2M), Anchorage OTC (~$210.0M), Janus Henderson AAA CLO (~$131.9M), Securitize Tokenized AAA CLO (~$104.0M), Arkis basis trade (~$20.6M), Anemoy/Apollo Diversified Credit (~$15.3M), plus legacy `RWA00x` (~$64.6M: HVB, New Silver, FortunaFi, Harbor Trade) | **High** for solvency; indirect for the USDC→USDS user | Impairment at any of these flows into the allocator's ilk, then to the Vow as `sin`, degrading USDS backing. It does not impair PSM swap atomicity while the Pocket holds USDC. Positions are reported by [Observatory](https://observatory.data.blockanalitica.com/sky/backed/items/) with periodic attestation, not verifiable by contract read |
| **Onchain lending markets and DEXs** (via Prime allocators) | Onchain crypto lending is ~32.7% of backing (~$2.76B, including ~$534M of Sky's own CDP and LockStake debt). SparkLend USDS/USDT/DAI/USDC/PYUSD/RLUSD markets (~$1.36B combined), Morpho vaults (Grove x Steakhouse USDC ~$545M, Spark USDC Vault ~$373M, Sentora x Spark RLUSD ~$500M, Spark Blue Chip vaults ~$40M), Uniswap V4 PYUSD/USDS (~$100.1M), USDT/USDS (~$50.0M) and RLUSD/USDS (~$50.0M) | **Medium-high** for solvency | Established DeFi protocols, onchain-verifiable, but they carry smart-contract and market risk that propagates to USDS backing through the same allocator path |
| **Third-party stablecoins held as backing** | PayPal USD (Paxos, ~$243.3M), RLUSD (Ripple, ~$164.5M held directly, plus the RLUSD in the Sentora x Spark Morpho vault), Global Dollar (Paxos, ~$15.0M), plus USDC beyond the Pocket | **Medium** for solvency | A depeg or freeze at any of these reduces allocator backing. Smaller and more diversified than the USDC PSM exposure |
| **LayerZero V2 (USDS_OFT)** | Cross-chain bridging to **Solana + Avalanche only** (~$4.58M); EVM L2s use native bridges, not LayerZero | **Nil** for Ethereum-mainnet-only user; **Low** for cross-chain users | OFT channels verified to require **2 independent DVNs** (LayerZero Labs + Nethermind) — not the single-DVN config exploited at KelpDAO. See expanded section below |
| **Native L2 canonical bridges** (Base/Optimism/Unichain OP Stack; Arbitrum Nitro) | SkyLink cross-chain transport for USDS + sUSDS (~4.4M USDS + ~443M sUSDS) | **Nil** for Ethereum-mainnet-only user | ERC-1967 proxies governed by PauseProxy; security inherits each rollup's canonical bridge. Not LayerZero |
| **Chainlink / Oracle price feeds (MCD_SPOT)** | Sets per-ilk liquidation prices for collateral CDPs | Indirect — bad oracle → bad liquidations → solvency hit | Mature oracle setup with multi-source feeds |
| **LITE_PSM_MOM emergency halter** | Can pause USDC-USDS PSM swaps instantly | Trust dependency: the elected hat can halt PSM at will | Visible onchain; governance can override |

### LayerZero V2 Dependency

**What LayerZero Is:** LayerZero is a cross-chain interoperability protocol that provides a generic messaging layer between blockchains. It uses a modular verification architecture where each OApp (Omnichain Application) configures one or more **DVNs** (Decentralized Verifier Networks) to attest to cross-chain messages. When a message receives sufficient attestations (as configured by the OApp's security settings), the destination contract executes the payload.

**What Sky Uses It For:** Sky uses LayerZero **only for chains that lack a native canonical bridge to Ethereum** — currently **Solana and Avalanche**. USDS deploys an **OFT Adapter** (Omnichain Fungible Token) on Ethereum ([`0x1e1D…01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8)) that locks USDS and authorizes minting of a corresponding OFT on those chains (~4.58M USDS locked at the snapshot). The sUSDS OFT adapter ([`0x85A3…f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1)) has an Avalanche peer configured but currently locks 0. **The EVM L2s — Base, Arbitrum, Optimism, Unichain — do NOT use LayerZero**; they use native canonical rollup bridges (see [Cross-Chain Bridges](#cross-chain-bridges-skylink)). The OFT adapters are owned by PauseProxy; changes require Chief vote + 48 h GSM delay.

**KelpDAO Incident Context (April 18, 2026):** On April 18, 2026, the KelpDAO rsETH bridge — also built on LayerZero — was attacked by the DPRK-affiliated TraderTraitor threat actor, resulting in a loss of ~$292M. The attacker socially engineered a LayerZero Labs developer, pivoted into LayerZero's cloud environment, and poisoned internal RPC nodes to forge DVN attestations for a malicious cross-chain message. The critical vulnerability was that the affected OApp had a **single-verifier configuration** — it relied on the LayerZero Labs DVN alone without requiring a second, independent DVN to confirm. The forged attestation was therefore sufficient to unlock rsETH on the destination chain.

**Impact on Sky:**
- **No other OApps or channels were compromised** — the attack was specific to the KelpDAO OApp's configuration.
- **LayerZero Labs changed operating stance** post-incident: the LayerZero Labs DVN now refuses to sign as the *sole required attestor* on any channel. It enforces a baseline security configuration requiring at least one additional independent verifier.
- **Sky's OFT DVN configuration is verifiable onchain and is a secure multi-DVN setup.** Querying the LayerZero V2 endpoint ([`0x1a44…728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fe728c)) via the ULN libraries (`getUlnConfig`) at block 26429600, every Sky OFT channel — USDS↔Solana, USDS↔Avalanche, sUSDS↔Avalanche, on both send and receive paths — uses a **custom config requiring 2 independent DVNs** (`requiredDVNCount = 2`, 0 optional): the **LayerZero Labs** DVN ([`0x589d…236b`](https://etherscan.io/address/0x589dEDbD617e0CBcB916A9223F4d1300c294236b)) and the **Nethermind** DVN ([`0xa59B…0BA5`](https://etherscan.io/address/0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)), with 15 Ethereum confirmations outbound and 12 (Avalanche) / 32 (Solana) confirmations inbound. This is a **2-of-2** requirement — structurally the *opposite* of the single-DVN configuration that enabled the KelpDAO loss. A single compromised or forging DVN cannot finalize a Sky cross-chain message; both must independently attest.
- **Risk assessment for mainnet users:** The LayerZero dependency is **nil** for users who hold USDS/sUSDS only on Ethereum mainnet and never bridge. The OFT adapter on Ethereum has no mint authority over the underlying token — it locks USDS 1:1 via standard OFT mechanics. A LayerZero exploit on a remote chain could theoretically mint unbacked OFT tokens *on that chain*, but could not create USDS on Ethereum mainnet. Mainnet USDS supply integrity is protected by the `wards` system on the USDS token itself (only USDS_JOIN and PauseProxy hold `wards == 1`).
- **Risk assessment for cross-chain users:** Only **Solana and Avalanche** USDS holders carry any LayerZero dependency at all, and it is **low**: because Sky's channels require two independent DVNs, the single-DVN forgery vector used against KelpDAO does not apply. The residual tail risk (simultaneous compromise of *both* DVNs) is further mitigated by Sky governance's ability to pause/upgrade the OFT adapter via PauseProxy. USDS/sUSDS holders on the EVM L2s do not depend on LayerZero at all — their bridges are native canonical rollup bridges.

**Mitigating factors specific to Sky:**
- Sky governance controls the OFT adapters via PauseProxy and can upgrade or pause them through the same Chief + 48 h GSM delay used for all other protocol changes.
- LayerZero-bridged supply is tiny: ~$4.58M of USDS (Solana + Avalanche), ~0.09% of mainnet supply. The larger cross-chain supply (~4.4M USDS + ~443M sUSDS) rides native canonical bridges, not LayerZero.
- Sky's channels already use a verified **2-DVN configuration** (LayerZero Labs + Nethermind), so they were not exposed to the single-DVN vector even before LayerZero Labs' post-KelpDAO policy enforcing multi-DVN baselines.

**Quality:** dependencies are predominantly **blue-chip** (Circle, MakerDAO core, Chainlink). The most material concentration is the **USDC dependency**: the LitePSM ilk is ~32.9% of VAT debt, of which the on-chain USDC reserve itself is ~25.4%, and *any* USDS holder who plans to exit to USDC implicitly trusts Circle.

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
| Prime allocator ilks (all `ALLOCATOR-*`, including Spark, Grove, Obex, Prysm and Keel) | [`MCD_VAT.ilks(ilk)`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) for every registered `ALLOCATOR-*` ilk | `Art × rate` (drawn debt) and `line` (debt ceiling) per allocator — ~54.3% of VAT debt is issued here; reconcile with downstream backing, since debt can stay unchanged after an asset loss |

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

**TODO — monitoring measurements:** record the full position-contract/getter inventory, downstream liabilities, valuation sources, allocator-to-ilk mapping for the smaller allocators, and initial net-asset/debt coverage per allocator. Catalog the dated attestation URLs, reporting periods, and publication schedules for the offchain positions named in [External Dependencies](#external-dependencies). Until these are recorded, per-allocator coverage and attestation freshness are **unverified**, not healthy by default; raise a data-availability alert for an unresolved position or report. The thresholds above define the required monitoring policy, not an already deployed monitor.

## Appendix: Contract Architecture

Snapshot block 26429600 (November 16, 2026).

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
│   │ USDS_JOIN        │         │  POCKET              │ 2.67B USDC       │
│   │ 0x3C0f…7FEB      │         │  0x3730…7341         │                  │
│   │ wards[USDS] = 1  │         └──────────────────────┘                  │
│   └─────────┬────────┘                                                   │
│             │                                                             │
│             ▼                                                             │
│   ┌──────────────────────────────────────────────────┐                   │
│   │              MCD_VAT (core ledger)                │  ~10.54B debt    │
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
│   │  chi = 1.1166   ssr = ~3.80% APY                 │                   │
│   │  totalAssets() = 3.67B USDS                      │                   │
│   │  totalSupply()  = 3.29B sUSDS                    │                   │
│   └──────────────┬───────────────────────────────────┘                   │
│                  │  drip() accrues from USDS_JOIN via VAT/VOW            │
│                  ▼                                                        │
│             SSR yield (parameter set by governance)                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         GOVERNANCE LAYER                                  │
│                                                                           │
│   SKY holders (23.45B total supply)                                       │
│         │                                                                 │
│         │  lock + approve                                                 │
│         ▼                                                                 │
│   ┌──────────────────────┐                                                │
│   │   MCD_ADM  (Chief)   │  hat() = 0xaBc7…1136                          │
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

Diagram address key: [`0xA188…f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c) (LitePSM Wrapper), [`0x3225…B276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) (DAI_USDS), [`0xf6e7…3042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) (LitePSM), [`0x3C0f…7FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) (USDS_JOIN), [`0x3730…7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) (Pocket), [`0x35D1…492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) (MCD_VAT), [`0xa393…7fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) (sUSDS), [`0x4e79…61e0`](https://etherscan.io/address/0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0) (sUSDS implementation), [`0xaBc7…1136`](https://etherscan.io/address/0xaBc702420dCc1868F7f8Df06A89dA766BcB01136) (hat), [`0x929d…a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) (Chief), [`0xbE28…38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) (MCD_PAUSE), [`0xBE8E…98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) (PauseProxy), [`0x467b…b425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) (LITE_PSM_MOM).

---

## Risk Summary

### Key Strengths

- **Battle-tested infrastructure** — the underlying MCD system (VAT, Pause, Chief, Join) has been live since December 2017 with >8 years of production, multiple major audits, and a $10M Immunefi bounty
- **Fee-free, atomic, deep liquidity for USDC ↔ USDS** — the LitePSM Wrapper provides a 1:1 swap with no slippage, backed by ~$2.67B USDC in the Pocket. Exit capacity is orders of magnitude larger than any reasonable Yearn vault size, and the PSM absorbed ~$840M of redemptions over November 5–16, 2026 without fees or a halt
- **Fully onchain accounting** — USDS supply, sUSDS `chi`/`ssr`, PSM pocket balance, and VAT debt are all publicly readable. ERC-4626 standard for sUSDS
- **No EOAs in privileged roles** — all sensitive wards point to PauseProxy or audited Sky contracts; governance is token-weighted Chief vote with 48 h GSM delay. The only signer-held path, the SP-BEAM 2-of-3 Safe, is limited to bounded rate changes
- **Diverse backing** — combination of the USDC PSM (~32.9% of VAT debt), Prime allocator vaults deploying into onchain lending, stablecoins and tokenized credit (~54.3%), overcollateralized crypto CDPs, LockStake, and legacy RWA, reducing single-asset concentration risk. ~80.2% of Observatory loan-coverage backing is onchain
- **Excellent documentation, public team, and incident-response history** — Sky has demonstrably handled Black Thursday and USDC-depeg events under governance vote
- **High SSR adoption** — ~70% of USDS supply is staked in sUSDS, showing strong user confidence
- **USDS ↔ DAI fungibility** — converter rails USDS's peg directly to DAI, with full DAI DEX-liquidity universe as secondary exit

### Key Risks

- **Shrinking supply and exit buffer** — USDS supply fell ~21% since September 9, 2026 (6.65B → 5.22B) and ~33% since June, and the Pocket fell from 3.95B to 2.67B USDC. Exits have so far been orderly
- **USDC dependency** — the largest single backing line for the USDS-USDC swap path is Circle's USDC (~$2.67B in Pocket). A USDC depeg or Pocket blacklisting by Circle would directly impair USDS-USDC convertibility, as happened to DAI during the March 2023 SVB event
- **Governance can do anything to USDS / sUSDS** — PauseProxy can upgrade either contract's implementation, add new minters via `rely`, change the SSR, or halt PSM swaps via Mom. All require 48 h GSM delay except Mom halts and bounded SP-BEAM rate changes. The hat that plots a malicious spell can also halt LitePSM exits immediately. SKY token-weighted voting introduces concentration risk if a small set of SKY holders dominates Chief
- **48 h GSM delay is at the low end** — many newer DeFi systems use 7-day timelocks. 48 h gives a tight reaction window for catching malicious spells
- **Offchain and tokenized-credit backing** — ~19.8% of backing (~$1.67B: OTC crypto lending, AAA corporate debt, legacy RWA, basis trade, private credit) sits with offchain custodians and credit venues and depends on attestations and Observatory reporting, not direct onchain visibility. Named counterparties are in [External Dependencies](#external-dependencies)
- **Prime allocator concentration** — ~54.3% of VAT debt is drawn by Prime allocators, and ~53.0 points of that sit in just three (Spark ~$3.69B, Grove `BLOOM` ~$1.49B, Obex ~$406M). Spark alone is ~35.0% of VAT debt. Observatory books the Prime vaults at ~$5.58B against ~$5.73B drawn, and its system balance sheet shows a ~$28M deficit. Allocator relayer roles and rate limits are not yet enumerated (`TODO`). The ilk itself shows only the debt; what backs it is whatever those allocators hold, so USDS solvency now depends heavily on allocator mandate discipline and Sky's ability to unwind those positions
- **RWA legal/jurisdiction exposure** — Sky's RWA program inherits TradFi regulatory and counterparty risk that is not transparent at the contract level
- **Chained contract dependency for USDC→USDS** — the swap path traverses USDC → LitePSM → DAI Join → USDS Join → DAI-USDS Converter → USDS. A fault in any link halts the wrapper
- **SSR is operator-adjustable** — the SP-BEAM 2-of-3 Safe can move the SSR between 2% and 30% in ≤4-point steps every 16 h without a timelock, and Sky governance can change it with a 48 h delay. Historical range: ~5–15% during DAI era; currently ~3.80% APY

### Critical Risks `[If Any]`

- **None identified.** The dominant tail risks are (1) a USDC depeg/freeze and (2) a Sky-governance-level incident, both of which are well-known DeFi systemic risks and not unique to this integration.

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
| TVL | USDS: ~$5.22B mainnet at the snapshot (~$5.36B total at 00:00 UTC). sUSDS holds 3.67B USDS (~70% staked). Sky Lending TVL ~$3.75B |
| Security incidents on USDS / sUSDS / LitePSM | **None** since launch |
| Legacy incidents | Black Thursday (March 2020), USDC depeg (March 2023) — both handled by governance |

**Historical Score: 1.0 / 5** — USDS-specific track record has now passed 2 years with no incident, and the underlying MCD core has been multi-billion-dollar production for 8.9 years with no recent incidents. The ~21% supply contraction since September 9, 2026 was orderly: the deepest hourly print over the last 90 days was 0.35% below peg (0.9965 on 2026-10-30), and the ~$840M PSM redemption wave of November 5–16 cleared at zero fees with no halt and an hourly low of 0.9985. It does not warrant a harsher score.

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

**Governance Score: 1.0 / 5** — Sky's Chief is one of the most decentralized governance systems in DeFi: token-weighted continuous-approval voting with **no multisig on the upgrade or minting path**, no EOA roles, and all upgrade and minting wards held by PauseProxy. The rubric awards Score 1 to "Immutable OR fully decentralized DAO" with "Multisig above 3/5 threshold, no EOA roles, multi-party approval" — Sky meets the decentralized-DAO criterion and *exceeds* the multisig criterion (the entire SKY-holder set is the approver). The timelock column is met exactly: every upgrade, `rely`, and parameter change passes the 48 h `MCD_PAUSE` delay, which is the rubric's Score-1 threshold ("48h+"; the rubric gives no extra credit above it). Continuous re-voting in Chief lets holders replace a malicious hat during the delay, but it does not lengthen the 48 h window and is not relied on for this score. Governance powers are broad — PauseProxy can upgrade both proxies and `rely` new minters — and SKY approval is concentrated (top-3 supporters ~90.0% of hat approvals), so any reduction of `delay()` below 48 h would drop the timelock column to Score 2, and a single supporter exceeding 50% of hat approvals triggers a governance re-review (see [Reassessment Triggers](#reassessment-triggers)). **Caveat:** the LITE_PSM_MOM emergency channel lets the elected hat halt PSM swaps *without* the 48 h delay. This is a one-sided emergency mechanism (it can pause but not extract value), and it has never been invoked since deployment.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Mint / burn | Programmatic via USDS_JOIN against VAT |
| Conversion paths | Fully programmatic (DAI-USDS converter, LitePSM Wrapper) |
| sUSDS exchange rate | Fully onchain via `chi` + `ssr` accumulator |
| Off-chain dependencies | Keeper for CRON_LITE_PSM_JOB (PSM buffer refill); not user-facing critical. Prime ALM relayers deploy allocator-drawn USDS (~54.3% of VAT debt) |
| Rate parameters | `tin` / `tout` / `buf` set by Sky governance (Chief + 48 h delay). SSR, DSR and stability fees can also be set by the SP-BEAM 2-of-3 Safe without a timelock, within 2%–30% (SSR), ≤4 pp per change, every ≥16 h |

**Programmability Score: 1.5 / 5** — Minting, conversion, swaps and `chi` accrual are fully programmatic, and the exchange rate is calculated onchain (Score 1 on the PPS column). Operations are "mostly programmatic with minor admin input" (Score 2) in two respects. The SP-BEAM 2-of-3 Safe sets the SSR and stability fees without a timelock, bounded by `cfgs` and `tau`; it has held this ward since April 21, 2025. Prime allocators also deploy more than half of VAT debt through operator-run ALM relayers. The SP-BEAM role is scored here rather than under Governance because it cannot move principal and its cumulative cost is code-bounded and haltable by the hat.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Swap-path dependencies | USDC (Circle) — Pocket holds 2.67B USDC; Chainlink/Chronicle oracles for collateral pricing; LayerZero (cross-chain OFT — non-critical for mainnet user) |
| Solvency-path dependencies (via Prime allocators, ~54.3% of VAT debt) | **Offchain/tokenized credit (~19.8% of backing):** Galaxy, Maple (Syrup), Janus Henderson/Anemoy, Anchorage, Securitize, Arkis, Apollo, legacy RWA parties. **Onchain crypto lending (~32.7%):** SparkLend, Morpho (Steakhouse-, Sentora- and Spark-curated vaults), Sky CDPs. **Stablecoins (~47.5%, including the PSM's USDC):** Circle, Paxos (PYUSD, USDG), Ripple (RLUSD), Uniswap V4 stablecoin pools |
| Not counted as external | MCD core (VAT, Chief, Pause, Join) — this *is* Sky's own infrastructure, not a third-party dependency |
| Quality | Predominantly established: Circle, Janus Henderson, Chainlink, Spark, Morpho, Uniswap, Paxos, Ripple. Newer or less-liquid venues (Maple, Galaxy, Arkis, Apollo private credit) are individually ≤~$450M |
| Single point of failure | None. A USDC freeze/depeg impairs the USDS-USDC swap but the DAI-USDS converter still works; no single offchain counterparty exceeds ~5.3% of backing (Galaxy, ~$447.9M) |

**Dependencies Score: 4.0 / 5** — the rubric's Score 4 is "Many or newer protocol dependencies; critical functionality depends on them", and that is what the enumerated allocator book shows: a dozen-plus counterparties (Circle for the swap path; Galaxy, Maple, Janus Henderson/Anemoy, Anchorage, Securitize, Arkis and Apollo for offchain credit; SparkLend, Morpho and Uniswap for onchain deployment; Ripple and Paxos stablecoins), and USDS solvency — a core requirement of a stablecoin — depends on them collectively. Score 3 ("2-3 established protocol dependencies") understates the count. ~54.3% of VAT debt sits in allocator vaults with named downstream exposure. Mitigants are real but do not change the rubric row: the counterparties are predominantly established, no single offchain counterparty exceeds ~5.3% of backing (Galaxy, ~$447.9M across the Warehouse and Arch CLO positions), the largest single onchain line is SparkLend USDS (~$767M, ~9.1%), and holding USDS, converting to DAI, and accruing SSR remain mechanically operational even if backing is impaired. No single dependency's failure breaks the protocol, so Score 5 does not apply.

**Cat 2 Score = (1.0 + 1.5 + 4.0) / 3 = 2.17 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing model | Inherits MCD_VAT collateral book: USDC PSM (~$3.46B, 32.9%), Prime allocator vaults (~$5.73B, 54.3%), crypto CDPs (~$372M, 3.5%), LockStake (~$162M), legacy RWA (~$64.6M), `vice` (~$752M, 7.1%), D3M (dormant) |
| System-wide CR | VAT `debt() ≈ 10.54B` vs DAI+USDS supply ≈ 9.65B (Ethereum mainnet). Vow net position **−$46.3M** (surplus $706.0M vs unbacked debt $752.3M). Observatory balance sheet: ~$9.80B assets vs ~$9.83B liabilities — a ~$28M deficit, with per-ilk overcollateralization (145–170% on crypto ilks) as the safety buffer |
| Verifiability | Per-ilk debt and ink readable onchain. Prime allocator and RWA fractions require Observatory look-through / attestations |
| Leverage | None at USDS holder level. CDP borrowers are leveraged by design |

**Collateralization Score: 3.0 / 5** — collateralized in aggregate (total collateral value ~$12.76B, ~121% of VAT debt), but not by the rubric's Score-2 standard of "100% **onchain** collateral". Measured against Observatory's ~$8.43B loan-coverage backing, **~19.8% (~$1.67B) is offchain** OTC credit, AAA CLO, basis-trade, private-credit and legacy RWA exposure, confirmed by periodic attestation rather than contract reads. Two of the rubric's three columns match Score 3 outright — backing ("100% collateral, some offchain") and verifiability ("periodic custodian attestation") — and the onchain majority does not remove the dependence on that offchain slice. Observatory's balance sheet is also ~$28M short of liabilities at the snapshot.

**Allocator opacity** reinforces this: ~54.3% of VAT debt is drawn by Prime allocator vaults (Spark, Grove, Obex and smaller ones) where the ilk exposes only the drawn debt, not the assets standing behind it. Reconstructing that backing requires trusting Block Analitica's Observatory look-through rather than reading the VAT. That structure was not documented in the June 2026 assessment; the move from 2.0 was a correction to how this subcategory was scored, not a deterioration in the protocol. The offchain share has since fallen further, from ~29.3% to ~19.8% of Observatory loan-coverage backing, as the Treasury-bill positions left the book.

Mitigants keep this at 3.0 rather than higher: ~80.2% of backing is onchain, and the single largest line — ~$2.67B of USDC in the PSM Pocket, ~31.7% of backing — is instantly verifiable by a `balanceOf` call.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Onchain transparency | USDS supply, sUSDS chi/totalAssets, USDC Pocket balance, VAT per-ilk debt all readable |
| RWA / allocator attestations | Published monthly on Sky governance forum and dashboards; offchain custodian reports. Observatory provides a daily look-through of Prime allocator holdings |
| Exchange rate | `chi` and `ssr` are pure functions; permissionless `drip()` keeps `chi` current |
| Admin minting | Governance can grant new wards (48 h delay); current USDS ward set is USDS_JOIN and PauseProxy |

**Provability Score: 2.0 / 5** — Mostly onchain reserves (~80.2% of Observatory loan-coverage backing), with programmatic supply and savings-rate accounting, match the rubric's Score 2 ("Mostly onchain, some offchain" with periodic updates and a single reliable source). The ~19.8% offchain slice (~$1.67B) depends on periodic custodian reporting, and the Prime allocator book needs Observatory look-through; this prevents a score between 1 and 2, since Score 1 requires fully onchain reserves and multiple verification sources. The offchain slice has Score-3 characteristics, but the aggregate remains predominantly onchain. Swap-path transparency alone does not establish reserve transparency for the entire backing book.

**Cat 3 Score = (3.0 + 2.0) / 2 = 2.50 / 5**

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Direct 1:1 atomic redemption via LitePSM Wrapper (USDS → USDC), zero fee. sUSDS withdrawal via ERC-4626, zero fee, atomic |
| Liquidity depth | USDC Pocket: ~2.67B USDC → multi-hundred-million-dollar exits with 0% slippage |
| Same-value asset | USDS is a 1:1 stablecoin; no PPS divergence risk |
| Withdrawal restrictions | None — no cooldown, no queue, no per-user cap |
| Historical stress behavior | PSM remained functional during the October 2025 stablecoin stress (hourly low 0.9947) and absorbed ~$840M of redemptions over November 5–16, 2026 with zero fees and no halt. The deepest daily print over the past year was 0.32% below peg (0.9968, October 30, 2026) |
| Single-tx exit capacity | Pocket balance ($2.67B) far exceeds any plausible Yearn integration size |

**Score: 1.0 / 5** — Textbook score-1 liquidity profile. Atomic 1:1 redemption with multi-billion-dollar depth and no friction.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Sky Foundation / MakerDAO veterans; publicly known leadership (Rune Christensen et al.); established 2017 |
| Documentation | Comprehensive — developer docs, governance forum, public chainlog, GitHub source |
| Legal entity | Skybase International (governed by Cayman Islands law) operates the sky.money front-end; the Sky Protocol itself is non-custodial onchain code |
| Incident response | Demonstrated across Black Thursday and 2023 USDC depeg |
| Monitoring | Public chainlog + governance forum + LlamaRisk / Block Analitica dashboards. Yearn's `monitoring` repo already alerts on USDS-adjacent vaults |

**Score: 1.0 / 5** — Top-tier operational maturity.

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
  - USDS supply drops >25% from snapshot (~$5.22B → <$3.9B) — would indicate material loss of confidence or large policy event. Supply has already contracted ~33% since June 2026 and ~21% since September 9, 2026, so this trend deserves attention even short of the threshold
  - sUSDS share of USDS supply drops below 50% (currently ~70.3%) — would indicate SSR has been cut materially or savers are exiting
  - USDC Pocket balance drops below $500M, or falls >20% in 7 days (it fell ~24% over November 5–16, 2026) — would indicate sustained exit pressure and compromise of the deep-redemption story
  - Total cross-chain USDS supply (currently ~9.0M across all bridges, plus ~443M sUSDS) spikes >$1B, or LayerZero-bridged supply (currently ~4.58M, Solana + Avalanche) grows materially — would indicate rising bridge dependency exposure
- **Parameter-based:**
  - Any registered `ALLOCATOR-*` ilk grows >20% in 7 days, or a new `ALLOCATOR-*` ilk is onboarded → re-review the backing look-through
  - `LITE_PSM_USDC_A.tin` or `tout` changes from zero (fees introduced) → harden Liquidity score
  - `LITE_PSM_USDC_A.buf` changes materially → re-evaluate exit capacity for USDC→USDS direction
  - `sUSDS.ssr` changes by >50 bps APY → not a risk event but warrants user-facing notice
  - SP-BEAM gains a new `bud`, its bud Safe's threshold or owner set changes, or `cfgs("SSR")` / `tau` is widened → re-review the bounded-rate classification
  - Prime ALM relayer roles or rate limits are enumerated and show a path weaker than Sky governance → re-score Governance
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
  - Any LayerZero protocol-level or DVN-level incident — especially involving the **LayerZero Labs** ([`0x589d…236b`](https://etherscan.io/address/0x589dEDbD617e0CBcB916A9223F4d1300c294236b)) or **Nethermind** ([`0xa59B…0BA5`](https://etherscan.io/address/0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)) DVNs that secure Sky's OFT channels — or any drop in Sky's `requiredDVNCount` below 2
  - Cross-chain USDS supply discrepancy >5% between onchain mainnet `USDS.totalSupply()` and DefiLlama aggregate — would signal a potential OFT exploit or bridge state mismatch
  - Any exploit or governance attack on the Sky/MCD core (Chief, Pause, VAT, USDS, sUSDS, LitePSM, USDS_JOIN, DAI_USDS, Pocket, OFT)
  - Any blacklisting of the USDC Pocket by Circle
- **Governance-based:**
  - SKY voter concentration changes materially: single supporter exceeds 50% of `Chief.approvals(hat)`, top-3 current-hat concentration rises materially from the November 16, 2026 baseline of ~90.0%, or top-5 concentration remains near-total while the hat margin narrows
  - New USDS / sUSDS implementation deployed (would reset the audit baseline)
  - RWA or Prime allocator program changes materially (new custodians or allocators, large reallocations, custodian incidents)

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 18, 2026](https://github.com/yearn/risk-score/pull/204) | 1.3 | Initial assessment |
| [November 16, 2026](https://github.com/yearn/risk-score/pull/457) | 1.80 | Reassessment. Supply contraction (USDS 7.82B → 5.22B; sUSDS assets 5.88B → 3.67B; Pocket 4.11B → 2.67B USDC), including ~$840M of orderly LitePSM redemptions over November 5–16, 2026; LitePSM `buf` doubled to 800M DAI; Spark Liquidity Layer repatriated its Base/Optimism/Unichain (July) and Arbitrum USDS (October) bridge positions. Collateralization restated from onchain per-ilk debt: Prime allocator vaults are ~54.3% of VAT debt and were previously undocumented, and the ~$752M `vice` was previously mischaracterised as Vow surplus. SP-BEAM, a 2-of-3 Safe that has held a bounded SSR-setting ward on sUSDS since April 2025, was previously undocumented; SSR moved 3.60% → 3.80% through it. Proxies, USDS `wards`, 48 h GSM delay, and 2-of-2 DVN config unchanged; added Token Mint Authority and Critical Permission Paths sections, with Prime ALM relayer roles marked TODO. Subscores: Collateralization 2.0 → 3.0 (~19.8% of backing offchain under periodic attestation, plus allocator opacity); Provability 1.5 → 2.0 (mostly onchain reserves with periodic offchain reporting and a single allocator look-through source); External Dependencies 1.5 → 4.0 once the allocator counterparty set is enumerated; Programmability 1.0 → 1.5 for SP-BEAM rate setting and operator-run allocator deployment; Governance stays 1.0 under the 48h+ Score-1 timelock bar. Added allocator coverage, counterparty-impairment, reporting-freshness and SP-BEAM monitoring, with missing measurements marked TODO. Final score 1.3 → 1.80, Minimal Risk → Low Risk |
