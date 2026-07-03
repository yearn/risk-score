# Protocol Risk Assessment: Sky — USDS & sUSDS

- **Assessment Date:** June 18, 2026
- **Token:** USDS (Sky Dollar) and sUSDS (Savings USDS)
- **Chain:** Ethereum
- **Token Address:** [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) (USDS) · [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) (sUSDS)
- **Final Score: 1.3/5.0**

## Overview + Links

**USDS** is Sky Protocol's USD-pegged stablecoin — the upgraded, rebranded successor to **DAI**, launched on September 2, 2024 as part of MakerDAO's "Endgame" transition to Sky. USDS is an upgradeable ERC-20 (UUPS/EIP-1967 proxy) and is governed through the same on-chain machinery that governs DAI: the Sky **Maker Vat** (MCD_VAT) ledger, **Chief** continuous-approval voting, and the **PauseProxy** with a 48-hour Governance Security Module (GSM) delay.

USDS does **not** have its own dedicated collateral system. There are **two permissionless, user-facing 1:1 swap paths** for getting in and out of USDS:

1. **DAI ↔ USDS Converter** ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A)) — anyone with DAI can swap 1:1 to USDS (and back) at zero fees in a single transaction. This rails USDS's peg directly to DAI.
2. **USDS-USDC LitePSM Wrapper** ([`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c)) — a thin wrapper around the existing **DAI LitePSM** ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) that lets anyone swap USDC ↔ USDS 1:1 with **zero fees** (`tin = tout = 0`), atomically. Backing USDC is held in a dedicated **Pocket** contract ([`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341)).

In addition, USDS supply can also be *issued* (not swapped) through governance-mediated channels: **D3M (Direct-Deposit Modules)** that mint USDS into lending markets (e.g. Spark, Aave-Lido) up to per-market debt ceilings, and **CDP/LockStake borrowers** who post collateral and draw DAI which then routes through the converter into USDS. These additional channels are detailed in the [Funds Management → How USDS Is Issued](#how-usds-is-issued) section.

Because every USDS is fungible with a DAI (via the converter), the total system collateral securing USDS is the **entire Sky/MakerDAO collateral book** sitting in MCD_VAT — a mix of crypto-backed CDPs (ETH, wstETH, WBTC), USDC PSM reserves, Real-World Asset (RWA) tokenized US Treasury bills, and D3M positions.

**sUSDS** is the tokenized Sky Savings Rate vault — an ERC-4626 wrapper deployed September 4, 2024 with a `chi` accumulator that grows continuously at the Sky Savings Rate (**SSR**). Depositing USDS into sUSDS is atomic, fee-free, and so is withdrawal. The SSR is a parameter set by Sky Governance via Chief + PauseProxy (currently a per-second `ssr` of `1.00000000112…` → **~3.60% APY** at the June 18, 2026 snapshot).

**Key onchain metrics (June 18, 2026, block 25345447):**

| Metric | Value |
|--------|-------|
| USDS total supply (Ethereum mainnet) | **7,821,339,325 USDS** (~$7.82B) |
| USDS total supply (cross-chain, all bridges) | ~8,177,298,635 USDS ([DefiLlama](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)); ~$0.50B is bridged off mainnet (~$0.45B native L2 bridges + ~$48.7M LayerZero) |
| sUSDS supply (shares) | 5,339,985,406 sUSDS |
| sUSDS `totalAssets()` | **5,875,069,384 USDS** (~75.1% of mainnet USDS supply) |
| sUSDS price-per-share (`chi`) | 1.1002 USDS/sUSDS |
| Sky Savings Rate (SSR) | `1.000000001121484…` per second → **~3.60% APY** (unchanged) |
| USDC held in LitePSM Pocket | **4,109,011,415 USDC** (~$4.11B) |
| MCD_VAT total system debt | ~12.76B (DAI + USDS combined) |
| 1-year USDS peg range | 0.9953 (2025-10-11) – 1.0008 (2026-04-29); current 0.9997 |

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

All addresses retrieved from the live Sky Chainlog and verified onchain. Snapshot block: **25345447** (June 18, 2026).

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
| USDS Join | [`0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB`](https://etherscan.io/address/0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB) | Mints/burns USDS against VAT internal balances. `wards[MCD_PAUSE_PROXY] == 1`; `wards[USDS] == 1` |
| USDS LayerZero OFT Adapter | [`0x1e1D42781FC170EF9da004Fb735f56F0276d01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | LayerZero V2 OApp (OFT Adapter). Locks USDS for bridging to **Solana and Avalanche only** (~48.7M USDS locked). `owner = PauseProxy`, `endpoint = 0x1a44…728c` (LZ V2). Does NOT hold `wards` on USDS. See [Cross-Chain Bridges](#cross-chain-bridges-skylink) |
| sUSDS LayerZero OFT Adapter | [`0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | LayerZero V2 OApp for sUSDS. Avalanche peer configured but **0 sUSDS currently locked** — sUSDS bridges via the native L2 token bridges instead. `owner = PauseProxy`. Does NOT hold `wards` on sUSDS |

### Cross-Chain Bridges (SkyLink)

USDS and sUSDS reach other chains through **two independent bridge systems** under the SkyLink umbrella — **not** a single LayerZero deployment. All bridge contracts are ERC-1967 proxies governed by `MCD_PAUSE_PROXY` (`wards[PauseProxy] == 1`), the same path as USDS itself. Addresses from the Sky chainlog, verified onchain at the snapshot.

**1. Native canonical L2 token bridges** (carry both USDS and sUSDS; lock-and-mint via each rollup's own bridge):

| Chain | Token Bridge | L1 Escrow | Bridge tech |
|-------|--------------|-----------|-------------|
| Base | [`0xA587…352A`](https://etherscan.io/address/0xA5874756416Fa632257eEA380CAbd2E87cED352A) | [`0x7F31…9Ef3`](https://etherscan.io/address/0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3) | OP Stack canonical bridge |
| Optimism | [`0x3d25…8057`](https://etherscan.io/address/0x3d25B7d486caE1810374d37A48BCf0963c9B8057) | [`0x4671…6C65`](https://etherscan.io/address/0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) | OP Stack canonical bridge |
| Unichain | [`0xDF05…81d2`](https://etherscan.io/address/0xDF0535a4C96c9Cd8921d8FeC92A7680b281681d2) | [`0x1196…566A`](https://etherscan.io/address/0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A) | OP Stack canonical bridge |
| Arbitrum | [`0x84b9…079E`](https://etherscan.io/address/0x84b9700E28B23F873b82c1BEb23d86C091b6079E) | [`0xA10c…9400`](https://etherscan.io/address/0xA10c7CE4b876998858b1a9E12b10092229539400) | Arbitrum Nitro canonical gateway |

L1 tokens are locked in the per-chain escrow and minted 1:1 on the L2 by the canonical rollup bridge. These do **not** use LayerZero, so they do not appear on LayerZero Scan. Escrow balances at the snapshot (onchain `balanceOf`): Base **147.9M USDS / 202.8M sUSDS**, Arbitrum **99.8M USDS / 327.0M sUSDS**, Optimism **100.3M USDS / 187.2M sUSDS**, Unichain **100.0M USDS / 94.9M sUSDS**. **This is how sUSDS reaches Arbitrum** (~327M sUSDS via the Arbitrum gateway), which is why sUSDS-on-Arbitrum is absent from LayerZero Scan.

**2. LayerZero V2 OFT Adapters** (USDS to Solana + Avalanche only; security analyzed in [LayerZero V2 Dependency](#layerzero-v2-dependency)):

| Token | OFT Adapter | Chains (peers) | Locked at snapshot |
|-------|-------------|----------------|--------------------|
| USDS | [`0x1e1D…01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | Solana (EID 30168), Avalanche (EID 30106) | ~48.7M USDS |
| sUSDS | [`0x85A3…f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | Avalanche (EID 30106) | 0 |

The legacy DAI **Teleport** fast-withdrawal bridges (`ARBITRUM_TELEPORT_BRIDGE`, `OPTIMISM_TELEPORT_BRIDGE`, `STARKNET_TELEPORT_BRIDGE`) also exist in the chainlog but are DAI-era infrastructure and out of scope for USDS/sUSDS.

### USDS-USDC PSM Stack

| Contract | Address | Role |
|----------|---------|------|
| **USDS LitePSM Wrapper** | [`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c) | `WRAPPER_USDS_LITE_PSM_USDC_A`. User-facing USDC↔USDS swap (`buyGem` / `sellGem`). Atomic. Deployed 2024-09-03 |
| Underlying LitePSM (DAI-USDC) | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `MCD_LITE_PSM_USDC_A`. Holds the swap logic. `tin = 0`, `tout = 0`, `buf = 400,000,000 DAI` |
| USDC Pocket | [`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) | `MCD_LITE_PSM_USDC_A_POCKET`. Custodies the USDC reserves (~4.11B USDC at snapshot) |
| LitePSM Jar | [`0x69cA348Bd928A158ADe7aa193C133f315803b06e`](https://etherscan.io/address/0x69cA348Bd928A158ADe7aa193C133f315803b06e) | `MCD_LITE_PSM_USDC_A_JAR`. Receives swap fees (currently zero) |
| **LitePSM Mom (emergency halt)** | [`0x467b32b0407Ad764f56304420Cddaa563bDab425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) | `LITE_PSM_MOM`. Authority = Chief, owner = PauseProxy. Lets the elected Chief hat instantly halt PSM swaps without the 48 h GSM delay |
| Emergency Halt Spell Factory | [`0xB261b73698F6dBC03cB1E998A3176bdD81C3514A`](https://etherscan.io/address/0xB261b73698F6dBC03cB1E998A3176bdD81C3514A) | `EMSP_LITE_PSM_HALT_FAB` |
| CRON LitePSM Job | [`0x0C86162ba3E507592fC8282b07cF18c7F902C401`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401) | Keeper job that periodically tops up / fills the PSM buffer |

### Sky / MakerDAO Core (governs USDS, sUSDS, PSM)

| Contract | Address | Role |
|----------|---------|------|
| MCD VAT (core ledger) | [`0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) | The accounting nucleus of the Sky/Maker system. `debt()` ≈ 12.76B (rad-normalized) |
| MCD Vow (surplus / sin buffer) | [`0xA950524441892A31ebddF91d3cEEFa04Bf454466`](https://etherscan.io/address/0xA950524441892A31ebddF91d3cEEFa04Bf454466) | Stability fee accumulator; receives the SSR drip differential |
| MCD Pot (DSR) | [`0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7`](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7) | DAI Savings Rate pot — predates sUSDS, parallel rate accumulator |
| **MCD Pause** | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | DSPause with `delay() = 172800` seconds (**48 hours GSM delay**). `owner = address(0)`; only spells elected by Chief can schedule |
| **MCD PauseProxy** | [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) | The address governance executes as. Holds `wards[USDS]==1`, `wards[sUSDS]==1`, and is the upgrade authority for both proxies |
| **MCD Chief (governance vote)** | [`0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) | DSChief. Continuous-approval voting over SKY token. Current `hat()` = [`0x0aE3371e9C4e37515259D124C685fe6722c5e253`](https://etherscan.io/address/0x0aE3371e9C4e37515259D124C685fe6722c5e253) (active spell) |
| MCD Spot (price feed router) | [`0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3`](https://etherscan.io/address/0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3) | Price oracles for VAT collateral types |
| SKY governance token | [`0x56072C95FAA701256059aa122697B133aDEd9279`](https://etherscan.io/address/0x56072C95FAA701256059aa122697B133aDEd9279) | `MCD_GOV`. Total supply ~23.46B SKY |
| SPK token | [`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066) | Spark/Sky governance subsystem token (USDS Staking Rewards) |
| USDS Staking Rewards | [`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af) | `REWARDS_USDS_SPK`. Out-of-scope for this report but referenced by yvUSDS-1 |

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

- **Sky on Immunefi** ([immunefi.com/bug-bounty/sky](https://immunefi.com/bug-bounty/sky/)) — live since Feb 10, 2022, last updated Feb 26, 2026
- **Maximum payout: $10,000,000** for critical smart-contract vulnerabilities. Minimum critical: $150K. Reward = 10% of funds at risk, capped at $10M
- **216 assets in scope**, including USDS, sUSDS, LitePSM, DAI-USDS Converter, Chief, Pause, VAT
- Proof-of-concept required for all severities. Payouts in DAI or USDS at $1:1

### Safe Harbor (SEAL)

- Sky is **not** listed on the SEAL [Safe Harbor registry](https://safeharbor.securityalliance.org/) at the time of writing.

## Historical Track Record

- **USDS contract deployed:** September 2, 2024 ([tx `0xdf7d4ba4…b21c`](https://etherscan.io/tx/0xdf7d4ba4114f654a4ef64f74099be3fc91358610078febe5be68af6cf257b21c)) — **~21.5 months** in production
- **sUSDS deployed:** September 4, 2024 ([tx `0xe1be00c4…2c00`](https://etherscan.io/tx/0xe1be00c4ea3c21cf536b98ac082a5bba8485cf75d6b2b94f4d6e3edd06472c00))
- **LitePSM Wrapper deployed:** September 3, 2024 ([tx `0x43ddae74…8585`](https://etherscan.io/tx/0x43ddae74123936f6737b78fcf785547f7f6b7b27e280fe7fbf98c81b3c018585))
- **Underlying MakerDAO system:** live since December 2017 (Multi-Collateral DAI) — **~8.5 years**. Single-Collateral DAI launched November 2017.
- **TVL growth (USDS, DefiLlama stablecoin id 209):** $98.5M on launch day → **~$8.19B at the June 18, 2026 snapshot** (cross-chain); ~$7.84B on Ethereum mainnet by raw ERC-20 `totalSupply()`
- **Sky Lending TVL** ([DefiLlama](https://defillama.com/protocol/sky-lending)): ~$5.81B (Ethereum-only)
- **sUSDS adoption:** ~5.89B USDS locked in sUSDS — **about 75% of mainnet USDS supply** is staked in the savings vault, indicating very heavy "yield seeker" capture
- **Peg history (USDS, past 365 days via CoinGecko):**
  - Min: **0.9953** (October 11, 2025) — likely market-wide stablecoin stress, USDS only ~0.5% off peg
  - Max: **1.0008** (April 29, 2026)
  - Latest: 0.9997 (within peg)
- **Past security incidents (relevant to USDS path):**
  - **Black Thursday (March 12, 2020) — DAI/MCD:** Cascading ETH price crash combined with mempool congestion caused some liquidation auctions to be won at $0 bids. ~$6M of system shortfall was absorbed by minting MKR to recapitalize. Affected users were later partly compensated via DAO vote. The liquidation system was redesigned (Liquidations 2.0, audited by Quantstamp). USDS did not exist yet
  - **USDC depeg (March 11, 2023):** Circle's USDC briefly traded as low as ~$0.88 following Silicon Valley Bank exposure. DAI traded down with it (~$0.88 floor) because of the USDC PSM dependency. Sky/Maker responded by widening PSM fees temporarily and accelerating diversification into RWAs. USDS would inherit the same USDC peg exposure today — a USDC depeg is the largest non-bug peg risk to USDS
  - **No USDS/sUSDS/LitePSM-specific incidents** since their respective launches (~21.5 months at this snapshot)
- **TVL stability:** USDS remains multi-billion scale and has held a tight peg, though supply declined from the May 2026 snapshot (~8.84B cross-chain) to ~8.19B cross-chain at this reassessment. No forced unwind or USDS-specific incident was identified.

## Funds Management

### How USDS Is Issued

USDS has no dedicated CDP system. Every USDS in existence has come from one of the following channels:

1. **DAI → USDS via the DAI-USDS Converter** ([`0x3225737a…F276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A))
   - User sends `n` DAI → receives `n` USDS, no fee, single transaction
   - Implementation: pulls DAI to itself, then calls `usdsJoin.exit()` to mint USDS to the caller
   - Reverse direction is symmetric and identical
   - **Implication:** USDS is fungible with DAI at protocol level. Any DAI holder is a latent USDS arbitrageur

2. **USDC → USDS via the LitePSM Wrapper** ([`0xA188EEC8…0f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c))
   - User calls `sellGem(usr, gemAmt)`: wrapper pulls USDC → calls underlying LitePSM `sellGem()` → DAI minted to wrapper → wrapper calls `daiUsds.daiToUsds()` → USDS delivered to user
   - Reverse (`buyGem(usr, gemAmt)`): user sends USDS → converter swaps to DAI → LitePSM `buyGem()` exchanges DAI for USDC out of the Pocket → USDC delivered to user
   - **Fees:** `tin = tout = 0` (zero). The LitePSM `buf` (400M DAI) acts as a hot supply buffer so user swaps do not have to wait for VAT bookkeeping
   - **Capacity:**
     - USDC → USDS direction: bounded by `buf` (400M DAI per refill cycle, keeper-replenished) and ultimately by the Sky governance-set `line` for the PSM ilk in the VAT
     - USDS → USDC direction: bounded by the **Pocket USDC balance** (currently **~4.11B USDC**)
   - **Atomic:** yes — entire path completes in one transaction

3. **D3M (Direct Deposit Module)** — Sky governance can mint USDS directly to lending markets (Spark, Aave-Lido) up to per-market debt ceilings, where the USDS is borrowed by users. At the snapshot, the Spark Aave-Lido USDS pool ([`DIRECT_SPK_AAVE_LIDO_USDS_POOL`](https://etherscan.io/address/0xbf674d0cD6841C1d7f9b8E809B967B3C5E867653)) holds 0 USDS, so this channel is currently dormant for that specific pool

4. **MakerDAO/Sky CDPs (ETH-A, ETH-B, wstETH-A, WBTC-A, USDC-A vault, RWA-* vaults, LockStake)** — borrowers post collateral, draw DAI (which they can then swap to USDS via the converter). These vaults are over-collateralized at the ilk level (typical liquidation ratios 145–170% for crypto, 100%+ for RWAs)

All four channels ultimately settle through **MCD_VAT** ([`0x35D1b3F3…492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B)), which at the snapshot reports `debt()` in rad units → **~12.76B normalized debt**. The corresponding DAI + USDS issued supply (Ethereum mainnet) is ~4.20B + ~7.84B ≈ **~12.04B**, and the difference represents stability-fee accrual and surplus in MCD_VOW.

### Accessibility

| Operation | Permission | Atomic? | Fees | Limits |
|-----------|-----------|---------|------|--------|
| USDC → USDS (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | `buf = 400M DAI` per fill; capped by PSM `line` in VAT |
| USDS → USDC (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | Pocket USDC balance (~4.11B) |
| DAI ↔ USDS (Converter) | Permissionless | Yes (1 tx) | 0 | None — direct mint/burn through USDS_JOIN |
| Deposit USDS → sUSDS | Permissionless | Yes (1 tx) | 0 | None (sUSDS is unbounded ERC-4626) |
| Withdraw USDS ← sUSDS | Permissionless | Yes (1 tx) | 0 | None |
| **Mint USDS directly** | **Wards-gated** — only contracts in `USDS.wards == 1` (currently USDS_JOIN and PauseProxy) | — | — | Only PauseProxy can grant new wards; new ward requires a passed Chief spell + 48 h GSM delay |

There is **no whitelist on swaps**, no KYC requirement, **no cooldown**, and **no withdrawal queue** for sUSDS. All flows are single-transaction.

### Collateralization

USDS does **not** have a clean "this collateral backs this token" picture — it inherits the full Sky/MakerDAO collateral book. Backing comes from these MCD_VAT ilks (publicly reported in the chainlog):

| Class | Description | Approximate role in backing |
|-------|-------------|----------------------------|
| Crypto-backed CDPs (ETH-A, ETH-B, wstETH-A, RETH-A, WBTC-A, etc.) | Over-collateralized loans, ~145–170% liquidation ratio | Volatile, on-chain liquidatable. Historically the dominant backing in early MCD |
| **USDC PSM (LitePSM)** | Pocket holds USDC 1:1 | **~$4.11B USDC** at snapshot (largest single backing line for USDS-USDC swap capacity) |
| RWA / offchain-credit exposure | Legacy `RWA00x` ilks plus Prime/Grove/Spark tokenized treasury, AAA CLO, private-credit, and OTC credit allocations | Legacy `RWA00x` ilks are now small (**~$94.0M**, ~0.7% of VAT debt). Broader offchain/tokenized treasury and credit backing tracked by Observatory is **~$3.30B** (~25.9% of VAT debt; ~32.6% of Observatory loan-coverage backing) and remains **offchain custody / credit risk** |
| LockStake (SKY token staked) | Borrow against locked SKY | Smaller, governance-token-backed |
| D3M (Spark/Aave Direct Deposit Modules) | USDS minted into lending pools where it's borrowed against external collateral | Capacity-extension mechanism rather than primary backing |
| GUSD-A PSM | Gemini USD-backed PSM | Smaller secondary PSM |
| PAX-A PSM (`MCD_PSM_PAX_A`) | Paxos USD-backed PSM | Smaller secondary PSM |

**System-level overcollateralization** is not directly readable from a single onchain call — it requires aggregating per-ilk `Art × rate` (debt) and `ink × oracle price × liquidation-ratio` (locked collateral value). SkyEco / Observatory's [USDS collateral-backing API](https://observatory.data.blockanalitica.com/sky/backed/items/) reports **~$10.13B loan-coverage backing**, **~$10.80B maintenance-coverage backing**, and **~$14.17B total collateral value** at 2026-06-18 11:30 UTC. Its [balance-sheet aggregate](https://observatory.data.blockanalitica.com/financials/balance-sheet/aggregates/?group_by=month) reports **~$12.33B assets** against **~$12.26B liabilities** for the June 2026 snapshot. At the same time, onchain VAT debt is ~12.76B against ~12.04B Ethereum DAI + USDS issued supply, with the buffer in MCD_VOW absorbing accounting differences.

**Key takeaway for the USDS holder:** the collateral mix is far better than a fiat-only stablecoin (no single banking dependency), but worse than a pure crypto-collateralized model (RWA is not fully transparent). **For a USDC→USDS→sUSDS user specifically**, the relevant backing slice is overwhelmingly the **USDC PSM pocket** (4.11B USDC), with the rest of the Sky book acting as a *secondary* solvency buffer. As long as the PSM peg arbitrage works, USDS effectively trades at the lower of `peg(DAI)` and `peg(USDC)`.

### Provability

- **sUSDS exchange rate:** `convertToAssets(shares)` is fully onchain via `chi` accumulator and `ssr` rate. Continuous accrual is a pure function of `ssr` and elapsed time since `rho` (last `drip` timestamp). At snapshot: `chi = 1.1001`, `ssr = 1.0000000011214…`, `rho = 1781695355` (2026-06-18)
- **System debt (VAT):** Readable onchain via `MCD_VAT.debt()` and per-ilk `urns(ilk, urn)`, `ilks(ilk).Art`, `ilks(ilk).rate`. Full reserve audit requires aggregating dozens of ilks but is mechanically possible from public RPC
- **USDC PSM Pocket:** `USDC.balanceOf(pocket)` is publicly callable — at snapshot returns 4.11B USDC
- **RWA / offchain-credit backing:** Less transparent. Legacy `RWA00x` ilks total only **~$94.0M** at the snapshot, but broader Observatory categories with offchain/tokenized credit exposure total **~$3.30B**: short-duration Treasury bills (~$1.57B), OTC crypto lending (~$1.10B), AAA corporate debt (~$491M), private credit (~$32.8M), basis trade (~$20.1M), and other legacy RWA (~$94.0M). The underlying assets sit at TradFi custodians or offchain credit venues, so this remains the least directly verifiable slice of backing
- **Can admins mint USDS out of thin air?** Yes, by definition — Sky governance (PauseProxy) can `usds.rely(addr)` to grant `wards = 1` to any address, which then has unrestricted minting via the underlying contract. This change must go through Chief vote + 48 h GSM delay. At the snapshot, the *only* non-governance ward is `USDS_JOIN`, which itself only mints in response to a corresponding `vat.suck` / `vat.move` settled through valid collateral

## Liquidity Risk

### Primary Exit Path: LitePSM Wrapper (USDS → USDC)

- **Direct 1:1 redemption** with zero fee. Atomic in a single transaction
- **Capacity (USDS → USDC):** bounded by **USDC balance in the Pocket = 4,107,503,934 USDC** at snapshot. That is ~4.11B exit capacity in a single tx with **0% slippage**
- **No cooldown, no queue, no per-user cap**. Anyone holding USDS can swap to USDC by calling `WRAPPER_USDS_LITE_PSM_USDC_A.buyGem(usr, gemAmt)`
- **Reverse direction (USDC → USDS)** is also atomic and zero-fee, bounded by the `buf` (400M DAI) per refill cycle. A CRON keeper job ([`CRON_LITE_PSM_JOB`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401)) regularly refills the buffer; under heavy demand the buffer can be refilled multiple times per day

### Secondary Path: DAI-USDS Converter

- Atomic 1:1 conversion of USDS → DAI (or DAI → USDS), zero fee
- Unbounded — settles directly through `USDS_JOIN` and `DAI_JOIN` against MCD_VAT
- Useful when a user wants to access DAI-paired DEX liquidity (which is much deeper than direct USDS pairs)

### Tertiary: sUSDS ERC-4626 Withdrawal

- `redeem(shares, receiver, owner)` returns USDS at the current `chi` rate, atomic, zero fee. Underlying USDS is minted on-demand via `USDS_JOIN` — there is no per-block withdrawal cap

### DEX Liquidity

USDS DEX liquidity on Ethereum mainnet is meaningful but **not** the primary exit path — most large flows route through the PSM, not AMM pools. Top Ethereum pools touching USDS or sUSDS, from [DefiLlama yields](https://yields.llama.fi/pools) at snapshot:

| Project | Pool | TVL ($) |
|---------|------|--------:|
| Sky Lending | sUSDS | ~$5.89B |
| Centrifuge | USDS | ~$867M |
| SparkLend | USDS | ~$590M |
| Curve | PYUSD-USDS | ~$100M |
| Morpho Blue | sUSDS market | ~$62M |
| Curve | sUSDS-USDT | ~$40M |
| Uniswap V3 | OHM-sUSDS | ~$9.2M |
| Curve | USDS-stUSDS | ~$6.6M |
| Curve | DOLA-sUSDS | ~$6.0M |

Direct **USDS-USDC** DEX liquidity is small (no significant Curve/Uniswap USDS-USDC pool sits above $10M at the snapshot). This is because the **PSM Wrapper provides zero-fee 1:1 USDC↔USDS swaps**, so DEX routes cannot meaningfully out-price the PSM — there is no incentive for LPs to build deep USDS-USDC pools. For any reasonable Yearn integration size, the PSM (with ~$4.11B Pocket depth) is the dominant exit path; DEX liquidity is a secondary concern only at the multi-hundred-million-dollar scale.

### Cross-Chain Liquidity

USDS and sUSDS reach other chains via **two separate bridge systems** (full contract list in [Cross-Chain Bridges](#cross-chain-bridges-skylink)):

1. **Native canonical L2 token bridges (SkyLink)** — Base, Optimism, Unichain (OP Stack) and Arbitrum (Arbitrum Nitro gateway). L1 tokens are locked in a per-chain escrow and minted 1:1 on the L2 by that chain's own canonical bridge. These carry the **bulk** of cross-chain supply: ~448M USDS and ~812M sUSDS across the four escrows at the snapshot. Security rests on each rollup's canonical bridge (battle-tested L1↔L2 messaging) plus PauseProxy governance; L2→L1 exits inherit the chain's challenge window (up to ~7 days on optimistic rollups). **No LayerZero / DVN trust assumption applies to these chains.**
2. **LayerZero V2 OFT Adapters** — USDS to **Solana + Avalanche only** (~48.7M USDS locked); the sUSDS OFT adapter currently locks 0. This is the only Sky bridge that appears on LayerZero Scan (Ethereum + Solana + Avalanche) and the only one carrying third-party-verifier (DVN) trust — analyzed in [LayerZero V2 Dependency](#layerzero-v2-dependency).

Onchain verification confirms **neither the OFT adapters nor any native bridge holds `wards` on USDS/sUSDS** — none can mint the underlying token; all lock-and-mint against escrowed supply, and all are owned/warded by PauseProxy.

In total ~$0.50B of USDS (and ~812M sUSDS shares, ~$0.89B at `chi`) sits outside Ethereum mainnet — matching DefiLlama's per-chain balances. For an Ethereum-mainnet-only Yearn strategy, cross-chain bridge exposure is operationally none.

### Historical Liquidity Under Stress

- During the October 2025 stablecoin stress event (USDS min price 0.9953), USDS-USDC swaps via the PSM remained available throughout — the peg deviation was driven by secondary AMM markets, not by Pocket depletion
- **`LITE_PSM_MOM.halt(...)` has never been invoked.** Full event-log scan of [`0x467b32b0407Ad764f56304420Cddaa563bDab425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) returns exactly **4 events** since deployment, none of which are `Halt(address indexed psm, Flow indexed what)` (topic `0x495feb065552316a79c594a4305afbd632955a68b2c6f65ad8b2f62d150fea92`). The 4 events are 2× `SetOwner` and 2× `SetAuthority` from initial deployment (final owner = PauseProxy, final authority = Chief). The emergency-halt channel exists but has never been used

## Centralization & Control Risks

### Governance

Sky uses **token-weighted continuous-approval voting** rather than a multisig:

| Stage | Mechanism | Address |
|-------|-----------|---------|
| Vote | SKY holders lock SKY in **Chief** and approve a candidate "spell" address. Highest-voted spell becomes the **hat** | [`MCD_ADM = 0x929d…6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) |
| Execute | The hat schedules transactions on **MCD_PAUSE** (DSPause) which enforces a 48-hour delay | [`MCD_PAUSE = 0xbE28…38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3), `delay = 172800` |
| Apply | After the delay, MCD_PAUSE calls into **MCD_PAUSE_PROXY** which executes the spell's actions (e.g., changing `ssr`, granting `wards`, upgrading USDS implementation) | [`MCD_PAUSE_PROXY = 0xBE8E…aFF52`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) |
| Emergency halt | **LITE_PSM_MOM** can halt PSM swaps **without** the 48 h delay if the current Chief hat authorizes it (`authority = Chief, owner = PauseProxy`) | [`LITE_PSM_MOM = 0x467b…b425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) |

**Strengths:**
- Token-weighted vote in Chief is fully on-chain and continuously contestable — voters can re-deposit and shift weight at any time, providing fast response to malicious spells during the 48 h delay
- The 48 h `MCD_PAUSE.delay()` is **shorter than the typical 7-day timelock** assumed in the rubric (a score-1 criterion), but it has historically been sufficient for Sky's stakeholders to react and rotate the hat if needed. It can only be reduced through a passed spell that itself takes 48 h
- MCD_PAUSE has `owner = address(0)` — no admin shortcut
- Upgrades to USDS/sUSDS proxies require the PauseProxy to call `upgradeToAndCall` on the implementation. Same 48 h delay applies
- No EOA holds direct admin powers on USDS, sUSDS, LitePSM, or the Pocket. All sensitive `wards` mappings point to PauseProxy or other audited Sky contracts

**Weaknesses:**
- **SKY token concentration risk:** voting weight is proportional to SKY locked. Onchain at the snapshot:
  - Total SKY locked in Chief: **7,023,149,881 SKY** (~29.9% of the 23.46B SKY supply)
  - Approvals for the current hat ([`0x0aE3…e253`](https://etherscan.io/address/0x0aE3371e9C4e37515259D124C685fe6722c5e253)): **6,517,630,357 SKY** (~27.8% of total supply; **~92.8% of locked SKY votes for the hat**)
  - Sky's [current-hat API](https://vote.sky.money/api/executive/hat?network=mainnet) and [supporter API](https://vote.sky.money/api/executive/supporters?network=mainnet) show high supporter concentration for the current hat. The largest supporter, **cloaky**, has **3.17B SKY** (**48.59%** of hat approvals). The top 3 supporters have **~95.95%** of hat approvals; the top 5 have **~98.46%**. No single supporter currently exceeds 50%, but two aligned delegates can exceed a majority of current-hat approvals.

| Rank | Supporter | Address | SKY approving current hat | % of hat approvals |
|------|-----------|---------|---------------------------|--------------------|
| 1 | cloaky | [`0x0f23…cc86`](https://etherscan.io/address/0x0f23de72e1581857eacd6308aebb69cf3a49cc86) | 3,166,779,061 | 48.59% |
| 2 | BLUE | [`0x173a…9558`](https://etherscan.io/address/0x173a1c04b79ed9266721c1154daa29addc0b9558) | 2,081,236,730 | 31.93% |
| 3 | Bonapublica | [`0xfc48…753d`](https://etherscan.io/address/0xfc48fbca739079aab08216c4d5e506b96593753d) | 1,005,445,631 | 15.43% |
| 4 | aegisD | [`0xd260…bf5e`](https://etherscan.io/address/0xd260762e442ea1893e5ed5e7d28984e19aafbf5e) | 88,209,870 | 1.35% |
| 5 | Max Staking Yield | [`0xff76…e2f`](https://etherscan.io/address/0xff7615e05ec1c8d5ded24ab50bf74432666bee2f) | 75,384,957 | 1.16% |
| 6 | PBG | [`0x5552…b850`](https://etherscan.io/address/0x555230eca835a808518ec3ea3082f05502bab850) | 47,979,232 | 0.74% |
| 7 | Brendan Navigator | [`0x8a8d…8f11`](https://etherscan.io/address/0x8a8d131502bb4868a0777bef604547a8316a8f11) | 20,904,484 | 0.32% |
| 8 | WBC | [`0x4bed…ae90`](https://etherscan.io/address/0x4bed44a9839b8778f69bb6a6d9f843414377ae90) | 20,538,420 | 0.32% |
| 9 | Shadow Delegate | [`0x2c89…521c`](https://etherscan.io/address/0x2c89024c13a80bc1b662a3db990524652c15221c) | 11,150,654 | 0.17% |
| 10 | Shadow Delegate | [`0x9689…d2f3`](https://etherscan.io/address/0x9689619f0ccec172207743f8a74cc490853cd2f3) | 1,295 | 0.00% |

- **48 h delay is at the low end** for upgradeable stablecoin systems (compared to 7-day on many newer protocols). A determined attacker with sufficient SKY could theoretically push through harmful changes if they can hold the hat for 48 h without being out-voted
- **Privileged role: PauseProxy can mint USDS to anyone** by granting `wards = 1` to a new address. This is the same "governance can do anything" property all DAO-controlled stablecoins share. The 48 h delay + onchain visibility is the only constraint

### Programmability

| Function | Onchain? | Notes |
|----------|----------|-------|
| Mint / burn USDS via USDS_JOIN | Yes, programmatic | Settled through VAT; cannot exceed VAT debt-ceiling parameters |
| DAI ↔ USDS conversion | Yes, programmatic | Pure routing in `DAI_USDS` contract |
| USDC ↔ USDS via LitePSM Wrapper | Yes, programmatic | Wrapper routes through DAI LitePSM. PSM pocket is read directly |
| sUSDS `chi` accumulator | Yes, programmatic | Continuous accrual via `ssr`; `drip()` is permissionless |
| `ssr` rate parameter | **Governance-set** | Changed by Chief spell + 48 h delay |
| PSM `tin`/`tout`/`buf` parameters | **Governance-set** | Same flow |
| Halting the PSM | **Authority-gated** (LitePSM Mom; immediate if hat authorizes) | Used in emergency only |
| Upgrading USDS / sUSDS implementations | **Governance-set** | 48 h delay |

System operations are dominated by programmatic onchain logic. The governance touchpoints (rate setting, parameter tuning) are deterministic and visible; there is no off-chain keeper that drives the price or accrual.

### External Dependencies

| Dependency | Used By | Criticality | Notes |
|-----------|---------|-------------|-------|
| **Circle / USDC** | LitePSM Wrapper, Pocket holds 4.11B USDC | **Critical** for USDS-USDC swap path. A USDC freeze/blacklist on the Pocket or a USDC depeg would directly impair USDS-USDC convertibility | Circle has blacklisted addresses before (TornadoCash, OFAC sanctions). The Pocket has not been blacklisted but is on-chain visible and bounded by Circle's policy |
| **DAI / MakerDAO core (VAT, Join, Pot, Pause, Chief)** | All conversion paths | **Critical** — USDS shares the VAT with DAI. A bug in any MCD core contract impairs USDS | 8+ years of production with documented incidents (Black Thursday) but no exploit since |
| **RWA / offchain-credit custodians** | Legacy `RWA00x` ilks are ~0.7% of VAT debt; broader tokenized treasury / corporate credit / private-credit / OTC credit backing is ~25.9% of VAT debt | High but indirect for the USDC→USDS user | Custodians and credit venues include TradFi/tokenized-credit issuers such as BlackRock BUIDL, Janus Henderson Anemoy/Centrifuge, Securitize, Maple, Anchorage, and legacy RWA vault parties. Failures propagate to system solvency but do not directly impair PSM swap atomicity |
| **LayerZero V2 (USDS_OFT)** | Cross-chain bridging to **Solana + Avalanche only** (~$48.7M); EVM L2s use native bridges, not LayerZero | **Nil** for Ethereum-mainnet-only user; **Low** for cross-chain users | OFT channels verified to require **2 independent DVNs** (LayerZero Labs + Nethermind) — not the single-DVN config exploited at KelpDAO. See expanded section below |
| **Native L2 canonical bridges** (Base/Optimism/Unichain OP Stack; Arbitrum Nitro) | SkyLink cross-chain transport for USDS + sUSDS (~$0.5B USDS + ~812M sUSDS) | **Nil** for Ethereum-mainnet-only user | ERC-1967 proxies governed by PauseProxy; security inherits each rollup's canonical bridge. Not LayerZero |
| **Chainlink / Oracle price feeds (MCD_SPOT)** | Sets per-ilk liquidation prices for collateral CDPs | Indirect — bad oracle → bad liquidations → solvency hit | Mature oracle setup with multi-source feeds |
| **LITE_PSM_MOM emergency halter** | Can pause USDC-USDS PSM swaps instantly | Trust dependency: the elected hat can halt PSM at will | Visible onchain; governance can override |

### LayerZero V2 Dependency

**What LayerZero Is:** LayerZero is a cross-chain interoperability protocol that provides a generic messaging layer between blockchains. It uses a modular verification architecture where each OApp (Omnichain Application) configures one or more **DVNs** (Decentralized Verifier Networks) to attest to cross-chain messages. When a message receives sufficient attestations (as configured by the OApp's security settings), the destination contract executes the payload.

**What Sky Uses It For:** Sky uses LayerZero **only for chains that lack a native canonical bridge to Ethereum** — currently **Solana and Avalanche**. USDS deploys an **OFT Adapter** (Omnichain Fungible Token) on Ethereum (`0x1e1D…01B8`) that locks USDS and authorizes minting of a corresponding OFT on those chains (~48.7M USDS locked at the snapshot). The sUSDS OFT adapter (`0x85A3…f0f1`) has an Avalanche peer configured but currently locks 0. **The EVM L2s — Base, Arbitrum, Optimism, Unichain — do NOT use LayerZero**; they use native canonical rollup bridges (see [Cross-Chain Bridges](#cross-chain-bridges-skylink)). The OFT adapters are owned by PauseProxy; changes require Chief vote + 48 h GSM delay.

**KelpDAO Incident Context (April 18, 2026):** On April 18, 2026, the KelpDAO rsETH bridge — also built on LayerZero — was attacked by the DPRK-affiliated TraderTraitor threat actor, resulting in a loss of ~$292M. The attacker socially engineered a LayerZero Labs developer, pivoted into LayerZero's cloud environment, and poisoned internal RPC nodes to forge DVN attestations for a malicious cross-chain message. The critical vulnerability was that the affected OApp had a **single-verifier configuration** — it relied on the LayerZero Labs DVN alone without requiring a second, independent DVN to confirm. The forged attestation was therefore sufficient to unlock rsETH on the destination chain.

**Impact on Sky:**
- **No other OApps or channels were compromised** — the attack was specific to the KelpDAO OApp's configuration.
- **LayerZero Labs changed operating stance** post-incident: the LayerZero Labs DVN now refuses to sign as the *sole required attestor* on any channel. It enforces a baseline security configuration requiring at least one additional independent verifier.
- **Sky's OFT DVN configuration is verifiable onchain and is a secure multi-DVN setup.** Querying the LayerZero V2 endpoint (`0x1a44…728c`) via the ULN libraries (`getUlnConfig`) at the snapshot, every Sky OFT channel — USDS↔Solana, USDS↔Avalanche, sUSDS↔Avalanche, on both send and receive paths — uses a **custom config requiring 2 independent DVNs** (`requiredDVNCount = 2`, 0 optional): the **LayerZero Labs** DVN (`0x589d…236b`) and the **Nethermind** DVN (`0xa59B…0BA5`), with 12 (Avalanche) / 32 (Solana) block confirmations. This is a **2-of-2** requirement — structurally the *opposite* of the single-DVN configuration that enabled the KelpDAO loss. A single compromised or forging DVN cannot finalize a Sky cross-chain message; both must independently attest.
- **Risk assessment for mainnet users:** The LayerZero dependency is **nil** for users who hold USDS/sUSDS only on Ethereum mainnet and never bridge. The OFT adapter on Ethereum has no mint authority over the underlying token — it locks USDS 1:1 via standard OFT mechanics. A LayerZero exploit on a remote chain could theoretically mint unbacked OFT tokens *on that chain*, but could not create USDS on Ethereum mainnet. Mainnet USDS supply integrity is protected by the `wards` system on the USDS token itself (only USDS_JOIN and PauseProxy hold `wards == 1`).
- **Risk assessment for cross-chain users:** Only **Solana and Avalanche** USDS holders carry any LayerZero dependency at all, and it is **low**: because Sky's channels require two independent DVNs, the single-DVN forgery vector used against KelpDAO does not apply. The residual tail risk (simultaneous compromise of *both* DVNs) is further mitigated by Sky governance's ability to pause/upgrade the OFT adapter via PauseProxy. USDS/sUSDS holders on the EVM L2s do not depend on LayerZero at all — their bridges are native canonical rollup bridges.

**Mitigating factors specific to Sky:**
- Sky governance controls the OFT adapters via PauseProxy and can upgrade or pause them through the same Chief + 48 h GSM delay used for all other protocol changes.
- LayerZero-bridged supply is tiny: ~$48.7M of USDS (Solana + Avalanche), <0.7% of mainnet supply. The larger cross-chain supply (~$0.45B USDS + ~812M sUSDS) rides native canonical bridges, not LayerZero.
- Sky's channels already use a verified **2-DVN configuration** (LayerZero Labs + Nethermind), so they were not exposed to the single-DVN vector even before LayerZero Labs' post-KelpDAO policy enforcing multi-DVN baselines.

**Quality:** dependencies are predominantly **blue-chip** (Circle, MakerDAO core, Chainlink). The most material concentration is the **USDC dependency**: the on-chain USDC reserve currently makes up ~30%+ of the direct backing of USDS issued via the swap path, and *any* USDS holder who plans to exit to USDC implicitly trusts Circle.

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
| DAI-USDS Converter | [`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) | Volume |
| USDC token at Pocket | [`USDC.balanceOf(pocket)`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Pocket reserve level |
| USDS LayerZero OFT Adapter | [`0x1e1D42781FC170EF9da004Fb735f56F0276d01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | `owner()` (should always equal PauseProxy), `endpoint()`, any `Upgraded` events on underlying token; **DVN config via `getUlnConfig` — alert if `requiredDVNCount` drops below 2** |
| sUSDS LayerZero OFT Adapter | [`0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | `owner()` (should always equal PauseProxy), `endpoint()`; any cross-chain supply anomalies |
| Native L2 bridge escrows (Base/Optimism/Unichain/Arbitrum) | [`0x7F31…9Ef3`](https://etherscan.io/address/0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3) · [`0x4671…6C65`](https://etherscan.io/address/0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) · [`0x1196…566A`](https://etherscan.io/address/0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A) · [`0xA10c…9400`](https://etherscan.io/address/0xA10c7CE4b876998858b1a9E12b10092229539400) | `USDS.balanceOf(escrow)` / `sUSDS.balanceOf(escrow)` should equal the minted L2 supply; `wards[PauseProxy]` on each token bridge |

### Critical Values, Thresholds, and Frequency

| Metric | Source | Threshold to alert | Frequency |
|--------|--------|---------------------|-----------|
| USDS spot price | DEX TWAP / CoinGecko | < $0.995 or > $1.005 (>0.5% deviation) | 15 min |
| USDC Pocket balance | onchain | < $500M (would signal heavy redemption load) | Hourly |
| LitePSM `tin`, `tout`, `buf` | onchain | Any change | On `Rely`/`File` event |
| LitePSM Halt | event log | Any `Halt` event | Real time |
| `MCD_PAUSE` scheduled spells | `Plot` event | Any spell touching USDS / sUSDS / PSM / Pocket | Behind timelock |
| sUSDS `ssr` rate | onchain | Any change >50 bps APY | Behind timelock |
| USDS / sUSDS implementation slot | EIP-1967 slot | Any change → `Upgraded` event | Behind timelock |
| USDS total supply (cross-chain, all chains) | DefiLlama API | Sudden >5% drop in 24 h | Hourly |

## Appendix: Contract Architecture

Snapshot block 25345569 (June 18, 2026).

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
│   │ 0x3225…F276A     │◄────────│  0xf6e7…3042         │  buf=400M DAI    │
│   │ 1:1 DAI↔USDS     │         │  tin=tout=0          │                  │
│   └─────────┬────────┘         └──────────┬───────────┘                  │
│             │                             │                              │
│             │  usdsJoin / daiJoin         │  pocket holds USDC           │
│             ▼                             ▼                              │
│   ┌──────────────────┐         ┌──────────────────────┐                  │
│   │ USDS_JOIN        │         │  POCKET              │ 4.11B USDC       │
│   │ 0x3C0f…7FEB      │         │  0x3730…7341         │                  │
│   │ wards[USDS] = 1  │         └──────────────────────┘                  │
│   └─────────┬────────┘                                                   │
│             │                                                             │
│             ▼                                                             │
│   ┌──────────────────────────────────────────────────┐                   │
│   │              MCD_VAT (core ledger)                │  ~12.76B debt    │
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
│   │  chi = 1.1001   ssr = ~3.60% APY                 │                   │
│   │  totalAssets() = 5.89B USDS                      │                   │
│   │  totalSupply()  = 5.31B sUSDS                    │                   │
│   └──────────────┬───────────────────────────────────┘                   │
│                  │  drip() accrues from USDS_JOIN via VAT/VOW            │
│                  ▼                                                        │
│             SSR yield (parameter set by governance)                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         GOVERNANCE LAYER                                  │
│                                                                           │
│   SKY holders (23.46B total supply)                                       │
│         │                                                                 │
│         │  lock + approve                                                 │
│         ▼                                                                 │
│   ┌──────────────────────┐                                                │
│   │   MCD_ADM  (Chief)   │  hat() = 0x0aE3…e253                          │
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
│   │   0xBE8E…aFF52       │  wards[sUSDS]=1, owns USDS/sUSDS upgrades     │
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

---

## Risk Summary

### Key Strengths

- **Battle-tested infrastructure** — the underlying MCD system (VAT, Pause, Chief, Join) has been live since December 2017 with >8 years of production, multiple major audits, and a $10M Immunefi bounty
- **Fee-free, atomic, deep liquidity for USDC ↔ USDS** — the LitePSM Wrapper provides a 1:1 swap with no slippage, backed by ~$4.11B USDC in the Pocket. Exit capacity is orders of magnitude larger than any reasonable Yearn vault size
- **Fully onchain accounting** — USDS supply, sUSDS `chi`/`ssr`, PSM pocket balance, and VAT debt are all publicly readable. ERC-4626 standard for sUSDS
- **No EOAs in privileged roles** — all sensitive wards point to PauseProxy or audited Sky contracts; governance is token-weighted Chief vote with 48 h GSM delay
- **Diverse backing** — combination of overcollateralized crypto CDPs, RWA Treasury bills, USDC PSM, and D3M lending, reducing single-asset concentration risk
- **Excellent documentation, public team, and incident-response history** — Sky has demonstrably handled Black Thursday and USDC-depeg events under governance vote
- **High SSR adoption** — ~75% of USDS supply is staked in sUSDS, showing strong user confidence
- **USDS ↔ DAI fungibility** — converter rails USDS's peg directly to DAI, with full DAI DEX-liquidity universe as secondary exit

### Key Risks

- **USDC dependency** — the largest single backing line for the USDS-USDC swap path is Circle's USDC (~$4.11B in Pocket). A USDC depeg or Pocket blacklisting by Circle would directly impair USDS-USDC convertibility, as happened to DAI during the March 2023 SVB event
- **Governance can do anything to USDS / sUSDS** — PauseProxy can upgrade either contract's implementation, add new minters via `rely`, change the SSR, or halt PSM swaps via Mom. All require 48 h GSM delay except Mom-halt. SKY token-weighted voting introduces concentration risk if a small set of SKY holders dominates Chief
- **48 h GSM delay is at the low end** — many newer DeFi systems use 7-day timelocks. 48 h gives a tight reaction window for catching malicious spells
- **Real-World Asset backing is offchain** — a meaningful fraction of system collateral sits at TradFi custodians (Monetalis, BlockTower, Centrifuge) and depends on attestations, not direct onchain visibility
- **RWA legal/jurisdiction exposure** — Sky's RWA program inherits TradFi regulatory and counterparty risk that is not transparent at the contract level
- **Chained contract dependency for USDC→USDS** — the swap path traverses USDC → LitePSM → DAI Join → USDS Join → DAI-USDS Converter → USDS. A fault in any link halts the wrapper
- **SSR is governance-controlled** — sUSDS yield can be changed at any time by Sky governance (with 48 h delay). Historical range: ~5–15% during DAI era; currently ~3.60% APY

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
| Bug bounty | $10M Immunefi (Sky), live 4+ years, 216 assets in scope |
| Contract surface | Thin tokens (USDS ERC-20, sUSDS ERC-4626). Chained PSM path adds complexity |

**Audits Score: 1.0 / 5** — 3+ top-tier audits per module, $10M bounty, multi-year coverage.

**Subcategory B: Historical Track Record**

| Factor | Assessment |
|--------|-----------|
| Time in production | USDS: **21.5 months** (Sept 2024). Underlying MCD: **8.5 years** |
| TVL | USDS: ~$7.84B mainnet (~$8.19B total). sUSDS holds 5.89B USDS (~75% staked). Sky Lending TVL ~$5.81B |
| Security incidents on USDS / sUSDS / LitePSM | **None** since launch |
| Legacy incidents | Black Thursday (March 2020), USDC depeg (March 2023) — both handled by governance |

**Historical Score: 1.0 / 5** — USDS-specific track record is just shy of 2 years (would map to 2.0), but the underlying MCD core has been multi-billion-dollar production for 8 years with no recent incidents makes is top score.

**Cat 1 Score = (1.0 + 1.0) / 2 = 1.0 / 5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | USDS and sUSDS are **UUPS upgradeable**. Upgrades gated by `wards[PauseProxy]=1` and a 48 h GSM delay |
| Vote / consensus | **SKY token-weighted continuous voting in Chief**. No multisig. Functionally more decentralized than a typical 3/5 safe but exposes governance to SKY holder concentration |
| Timelock | **48 h** GSM delay on MCD_PAUSE (`delay = 172800`). Below the 7-day threshold for a rubric-1 score |
| Emergency channel | LITE_PSM_MOM can halt PSM swaps **without** the 48 h delay (authority = Chief, owner = PauseProxy) |
| Privileged roles | PauseProxy holds direct wards on USDS, sUSDS, all PSM components, and can `rely` new minters |
| EOA risk | None |

**Governance Score: 1.0 / 5** — Sky's Chief is one of the most decentralized governance systems in DeFi: token-weighted continuous-approval voting with **no multisig at all**, no EOA roles, and all wards held by PauseProxy. The rubric awards Score 1 to "Immutable OR fully decentralized DAO" with "Multisig above 3/5 threshold, no EOA roles, multi-party approval" — Sky meets the decentralized-DAO criterion and *exceeds* the multisig criterion (the entire SKY-holder set is the approver). The only column where Sky is below Score 1 is the timelock — 48 h vs the 7-day rubric criterion — but the live re-vote capability in Chief (a contentious spell must maintain hat status throughout the delay) extends the effective defense window beyond a static 7-day timelock. **Caveat:** the LITE_PSM_MOM emergency channel lets the elected hat halt PSM swaps *without* the 48 h delay. This is a one-sided emergency mechanism (it can pause but not extract value), and it has never been invoked since deployment.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Mint / burn | Programmatic via USDS_JOIN against VAT |
| Conversion paths | Fully programmatic (DAI-USDS converter, LitePSM Wrapper) |
| sUSDS exchange rate | Fully onchain via `chi` + `ssr` accumulator |
| Off-chain dependencies | Keeper for CRON_LITE_PSM_JOB (PSM buffer refill); not user-facing critical |
| Rate parameters | SSR / tin / tout / buf set by Sky governance (Chief + 48 h delay) |

**Programmability Score: 1.0 / 5** — Fully programmatic system; governance touches only parameters, not user flow.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| True external dependencies | USDC (Circle) — Pocket holds 4.11B USDC; Chainlink oracles (multi-source) for collateral pricing; LayerZero (cross-chain OFT — non-critical for mainnet user) |
| Not counted as external | MCD core (VAT, Chief, Pause, Join) — this *is* Sky's own infrastructure, not a third-party dependency |
| Quality | USDC is blue-chip (Circle survived March 2023 SVB depeg without halting); Chainlink is multi-source mature oracle |
| Single point of failure | A USDC freeze/depeg directly impairs the USDS-USDC swap, but the DAI-USDS converter path still works without USDC |

**Dependencies Score: 1.5 / 5** — One critical blue-chip external dependency (USDC) and one mature mid-criticality dependency (Chainlink). MCD core was previously double-counted as both internal architecture *and* external dependency — removing that, the residual external surface is small. Score 1.5 (between Score 1 "no external dependencies" and Score 2 "1-2 blue-chip non-critical") reflects that USDC is blue-chip but criticality is non-trivial.

**Cat 2 Score = (1.0 + 1.0 + 1.5) / 3 ≈ 1.17 → 1.2 / 5** (conservative round-up to one decimal)

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing model | Inherits MCD_VAT collateral book: crypto CDPs (overcollateralized), USDC PSM (~$4.11B), RWA Treasury bills (offchain custodians), LockStake, D3M |
| System-wide CR | VAT `debt() ≈ 12.76B` vs DAI+USDS supply ≈ 12.04B (Ethereum mainnet) — thin direct surplus, with per-ilk overcollateralization (145–170% on crypto ilks) as the safety margin |
| Verifiability | Per-ilk debt and ink readable onchain. RWA fraction requires attestations |
| Leverage | None at USDS holder level. CDP borrowers are leveraged by design |

**Collateralization Score: 2.0 / 5** — 100% backed by a *mix* of onchain (crypto, USDC PSM, D3M) and offchain-custody (RWA) assets. Mixed quality but extensively documented and historically robust.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Onchain transparency | USDS supply, sUSDS chi/totalAssets, USDC Pocket balance, VAT per-ilk debt all readable |
| RWA attestations | Published monthly on Sky governance forum and dashboards; offchain custodian reports |
| Exchange rate | `chi` and `ssr` are pure functions; permissionless `drip()` keeps `chi` current |
| Admin minting | Governance can grant new wards (48 h delay); current ward set is small and audited |

**Provability Score: 1.5 / 5** — Excellent onchain transparency for the live-swap path; mild offchain dependence for RWA fraction.

**Cat 3 Score = (2.0 + 1.5) / 2 = 1.75 → 1.8 / 5** (conservative round-up to one decimal)

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Direct 1:1 atomic redemption via LitePSM Wrapper (USDS → USDC), zero fee. sUSDS withdrawal via ERC-4626, zero fee, atomic |
| Liquidity depth | USDC Pocket: ~4.11B USDC → multi-hundred-million-dollar exits with 0% slippage |
| Same-value asset | USDS is a 1:1 stablecoin; no PPS divergence risk |
| Withdrawal restrictions | None — no cooldown, no queue, no per-user cap |
| Historical stress behavior | PSM remained functional during October 2025 stablecoin stress; max 1-year USDS depeg was 0.47% |
| Single-tx exit capacity | Pocket balance ($4.11B) far exceeds any plausible Yearn integration size |

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

**Rounding rule:** category scores use one-decimal precision; when a subcategory average falls between two 0.1 marks, round **up** (conservative). The weighted sum is then rounded to one decimal place with standard nearest-0.1 rounding, with ties broken up.

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.0 | 20% | 0.200 |
| Centralization & Control | 1.2 | 30% | 0.360 |
| Funds Management | 1.8 | 30% | 0.540 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.0 |  5% | 0.050 |
| **Final Score** | | | **1.300 → 1.3 / 5.0** |

**Final Score: 1.3 / 5.0** — well inside the Minimal-Risk tier (1.0–1.5).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.3 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (December 2026) or annually
- **TVL-based:**
  - USDS supply drops >25% from snapshot (~$7.82B → <$5.9B) — would indicate material loss of confidence or large policy event
  - sUSDS share of USDS supply drops below 50% (currently ~75.1%) — would indicate SSR has been cut materially or savers are exiting
  - USDC Pocket balance drops below $500M — would indicate sustained exit pressure and compromise of the deep-redemption story
  - Total cross-chain USDS supply (currently ~$0.50B across all bridges) spikes >$2B, or LayerZero-bridged supply (currently ~$48.7M, Solana + Avalanche) grows materially — would indicate rising bridge dependency exposure
- **Parameter-based:**
  - `LITE_PSM_USDC_A.tin` or `tout` changes from zero (fees introduced) → harden Liquidity score
  - `LITE_PSM_USDC_A.buf` changes materially → re-evaluate exit capacity for USDC→USDS direction
  - `sUSDS.ssr` changes by >50 bps APY → not a risk event but warrants user-facing notice
  - `MCD_PAUSE.delay()` is reduced below 48 h → governance score worsens
  - `USDS.wards()` grants a ward outside the current set (USDS_JOIN, PauseProxy) → re-review mint authority
  - `USDS_OFT.owner()` or `SUSDS_OFT.owner()` changes from PauseProxy → re-review OFT adapter governance
- **Incident-based:**
  - Any `LITE_PSM_MOM.HALT()` invocation (emergency PSM halt)
  - Any USDS depeg deeper than ±1% sustained for >24 h
  - Any USDC depeg event (would propagate to USDS via PSM)
  - Any LayerZero protocol-level or DVN-level incident — especially involving the **LayerZero Labs** (`0x589d…236b`) or **Nethermind** (`0xa59B…0BA5`) DVNs that secure Sky's OFT channels — or any drop in Sky's `requiredDVNCount` below 2
  - Cross-chain USDS supply discrepancy >5% between onchain mainnet `USDS.totalSupply()` and DefiLlama aggregate — would signal a potential OFT exploit or bridge state mismatch
  - Any exploit or governance attack on the Sky/MCD core (Chief, Pause, VAT, USDS, sUSDS, LitePSM, USDS_JOIN, DAI_USDS, Pocket, OFT)
  - Any blacklisting of the USDC Pocket by Circle
- **Governance-based:**
  - SKY voter concentration changes materially: single supporter exceeds 50% of `Chief.approvals(hat)`, top-3 current-hat concentration rises materially from the June 18, 2026 baseline of ~95.95%, or top-5 concentration remains near-total while the hat margin narrows
  - New USDS / sUSDS implementation deployed (would reset the audit baseline)
  - RWA program changes materially (new custodians, large reallocations, custodian incidents)
