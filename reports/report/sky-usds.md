# Protocol Risk Assessment: Sky — USDS & sUSDS

- **Assessment Date:** May 20, 2026
- **Token:** USDS (Sky Dollar) and sUSDS (Savings USDS)
- **Chain:** Ethereum
- **Token Address:** [`0xdC035D45d973E3EC169d2276DDab16f1e407384F`](https://etherscan.io/address/0xdC035D45d973E3EC169d2276DDab16f1e407384F) (USDS) · [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) (sUSDS)
- **Final Score: 1.5/5.0**

## Overview + Links

**USDS** is Sky Protocol's USD-pegged stablecoin — the upgraded, rebranded successor to **DAI**, launched on September 2, 2024 as part of MakerDAO's "Endgame" transition to Sky. USDS is an upgradeable ERC-20 (UUPS/EIP-1967 proxy) and is governed through the same on-chain machinery that governs DAI: the Sky **Maker Vat** (MCD_VAT) ledger, **Chief** continuous-approval voting, and the **PauseProxy** with a 48-hour Governance Security Module (GSM) delay.

USDS does **not** have its own dedicated collateral system. There are **two permissionless, user-facing 1:1 swap paths** for getting in and out of USDS:

1. **DAI ↔ USDS Converter** ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A)) — anyone with DAI can swap 1:1 to USDS (and back) at zero fees in a single transaction. This rails USDS's peg directly to DAI.
2. **USDS-USDC LitePSM Wrapper** ([`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c)) — a thin wrapper around the existing **DAI LitePSM** ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) that lets anyone swap USDC ↔ USDS 1:1 with **zero fees** (`tin = tout = 0`), atomically. Backing USDC is held in a dedicated **Pocket** contract ([`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341)).

In addition, USDS supply can also be *issued* (not swapped) through governance-mediated channels: **D3M (Direct-Deposit Modules)** that mint USDS into lending markets (e.g. Spark, Aave-Lido) up to per-market debt ceilings, and **CDP/LockStake borrowers** who post collateral and draw DAI which then routes through the converter into USDS. These additional channels are detailed in the [Funds Management → How USDS Is Issued](#how-usds-is-issued) section.

Because every USDS is fungible with a DAI (via the converter), the total system collateral securing USDS is the **entire Sky/MakerDAO collateral book** sitting in MCD_VAT — a mix of crypto-backed CDPs (ETH, wstETH, WBTC), USDC PSM reserves, Real-World Asset (RWA) tokenized US Treasury bills, and D3M positions.

**sUSDS** is the tokenized Sky Savings Rate vault — an ERC-4626 wrapper deployed September 4, 2024 with a `chi` accumulator that grows continuously at the Sky Savings Rate (**SSR**). Depositing USDS into sUSDS is atomic, fee-free, and so is withdrawal. The SSR is a parameter set by Sky Governance via Chief + PauseProxy (currently a per-second `ssr` of `1.00000000113…` → **~3.65% APY** at the May 20, 2026 snapshot).

**Key onchain metrics (May 20, 2026, block 25137266):**

| Metric | Value |
|--------|-------|
| USDS total supply (Ethereum mainnet) | **8,065,880,503 USDS** (~$8.07B) |
| USDS total supply (cross-chain incl. OFT) | ~8,841,197,061 USDS ([DefiLlama](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=209)) |
| sUSDS supply (shares) | 5,307,774,962 sUSDS |
| sUSDS `totalAssets()` | **5,823,182,712 USDS** (~72% of mainnet USDS supply) |
| sUSDS price-per-share (`chi`) | 1.0971 USDS/sUSDS |
| Sky Savings Rate (SSR) | `1.000000001136785…` per second → **~3.653% APY** |
| USDC held in LitePSM Pocket | **3,803,795,833 USDC** (~$3.80B) |
| MCD_VAT total system debt | ~13.16B (DAI + USDS combined) |
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
- [DefiLlama: USDS stablecoin](https://defillama.com/stablecoin/usds)

## Contract Addresses

All addresses retrieved from the live Sky Chainlog and verified onchain. Snapshot block: **25137266** (May 20, 2026).

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
| USDS LayerZero OFT | [`0x1e1D42781FC170EF9da004Fb735f56F0276d01B8`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8) | Cross-chain transport; owner = PauseProxy |
| sUSDS LayerZero OFT | [`0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1`](https://etherscan.io/address/0x85A3FE4DA2a6cB98A5bdF62458B0dB8471B9f0f1) | Cross-chain transport for sUSDS |

### USDS-USDC PSM Stack

| Contract | Address | Role |
|----------|---------|------|
| **USDS LitePSM Wrapper** | [`0xA188EEC8F81263234dA3622A406892F3D630f98c`](https://etherscan.io/address/0xA188EEC8F81263234dA3622A406892F3D630f98c) | `WRAPPER_USDS_LITE_PSM_USDC_A`. User-facing USDC↔USDS swap (`buyGem` / `sellGem`). Atomic. Deployed 2024-09-03 |
| Underlying LitePSM (DAI-USDC) | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `MCD_LITE_PSM_USDC_A`. Holds the swap logic. `tin = 0`, `tout = 0`, `buf = 400,000,000 DAI` |
| USDC Pocket | [`0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341) | `MCD_LITE_PSM_USDC_A_POCKET`. Custodies the USDC reserves (~3.80B USDC at snapshot) |
| LitePSM Jar | [`0x69cA348Bd928A158ADe7aa193C133f315803b06e`](https://etherscan.io/address/0x69cA348Bd928A158ADe7aa193C133f315803b06e) | `MCD_LITE_PSM_USDC_A_JAR`. Receives swap fees (currently zero) |
| **LitePSM Mom (emergency halt)** | [`0x467b32b0407Ad764f56304420Cddaa563bDab425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) | `LITE_PSM_MOM`. Authority = Chief, owner = PauseProxy. Lets the elected Chief hat instantly halt PSM swaps without the 48 h GSM delay |
| Emergency Halt Spell Factory | [`0xB261b73698F6dBC03cB1E998A3176bdD81C3514A`](https://etherscan.io/address/0xB261b73698F6dBC03cB1E998A3176bdD81C3514A) | `EMSP_LITE_PSM_HALT_FAB` |
| CRON LitePSM Job | [`0x0C86162ba3E507592fC8282b07cF18c7F902C401`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401) | Keeper job that periodically tops up / fills the PSM buffer |

### Sky / MakerDAO Core (governs USDS, sUSDS, PSM)

| Contract | Address | Role |
|----------|---------|------|
| MCD VAT (core ledger) | [`0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B) | The accounting nucleus of the Sky/Maker system. `debt()` ≈ 13.16B (rad-normalized) |
| MCD Vow (surplus / sin buffer) | [`0xA950524441892A31ebddF91d3cEEFa04Bf454466`](https://etherscan.io/address/0xA950524441892A31ebddF91d3cEEFa04Bf454466) | Stability fee accumulator; receives the SSR drip differential |
| MCD Pot (DSR) | [`0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7`](https://etherscan.io/address/0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7) | DAI Savings Rate pot — predates sUSDS, parallel rate accumulator |
| **MCD Pause** | [`0xbE286431454714F511008713973d3B053A2d38f3`](https://etherscan.io/address/0xbE286431454714F511008713973d3B053A2d38f3) | DSPause with `delay() = 172800` seconds (**48 hours GSM delay**). `owner = address(0)`; only spells elected by Chief can schedule |
| **MCD PauseProxy** | [`0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB`](https://etherscan.io/address/0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB) | The address governance executes as. Holds `wards[USDS]==1`, `wards[sUSDS]==1`, and is the upgrade authority for both proxies |
| **MCD Chief (governance vote)** | [`0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9`](https://etherscan.io/address/0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9) | DSChief. Continuous-approval voting over SKY token. Current `hat()` = [`0xA0059DaDd7Fbdbc81a9bb9d1d17cCB029b6AF596`](https://etherscan.io/address/0xA0059DaDd7Fbdbc81a9bb9d1d17cCB029b6AF596) (active spell) |
| MCD Spot (price feed router) | [`0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3`](https://etherscan.io/address/0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3) | Price oracles for VAT collateral types |
| SKY governance token | [`0x56072C95FAA701256059aa122697B133aDEd9279`](https://etherscan.io/address/0x56072C95FAA701256059aa122697B133aDEd9279) | `MCD_GOV`. Total supply ~23.46B SKY |
| SPK token | [`0xc20059e0317DE91738d13af027DfC4a50781b066`](https://etherscan.io/address/0xc20059e0317DE91738d13af027DfC4a50781b066) | Spark/Sky governance subsystem token (USDS Staking Rewards) |
| USDS Staking Rewards | [`0x173e314C7635B45322cd8Cb14f44b312e079F3af`](https://etherscan.io/address/0x173e314C7635B45322cd8Cb14f44b312e079F3af) | `REWARDS_USDS_SPK`. Out-of-scope for this report but referenced by yvUSDS-1 |

### Ward / Auth Verification (onchain, snapshot block 25137266)

```
USDS.wards(MCD_PAUSE_PROXY) = 1        # governance can upgrade & administer
USDS.wards(USDS_JOIN)       = 1        # join can mint/burn USDS
USDS.wards(DAI_USDS)        = 0        # converter goes via USDS_JOIN, not direct ward
sUSDS.wards(MCD_PAUSE_PROXY) = 1       # governance can upgrade & administer
DAI_USDS.dai()  = 0x6B17…71d0F (DAI)
DAI_USDS.usds() = 0xdC03…84F  (USDS)
LITE_PSM_USDC_A.tin()  = 0              # zero swap-in  fee  (USDC -> DAI/USDS)
LITE_PSM_USDC_A.tout() = 0              # zero swap-out fee  (DAI/USDS -> USDC)
LITE_PSM_USDC_A.buf()  = 4.0e26 wei DAI # 400M DAI swap buffer
LITE_PSM_MOM.authority() = MCD_ADM (Chief)
LITE_PSM_MOM.owner()     = MCD_PAUSE_PROXY
MCD_PAUSE.delay()        = 172800       # 48 hours
sUSDS.usdsJoin() = USDS_JOIN
sUSDS.vat()      = MCD_VAT
sUSDS.vow()      = MCD_VOW
sUSDS.usds()     = USDS
sUSDS.asset()    = USDS
sUSDS.ssr()      = 1.000000001136785036595443334  (~3.65% APY)
sUSDS.chi()      = 1.097104280889453199707072239  (price per share)
```

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

**Architecture complexity:** USDS itself is a thin ERC-20 with permit + ERC-1271 (UUPS upgradeable). sUSDS is a thin ERC-4626 with a `chi`/`ssr` accumulator. The USDS-USDC swap path however involves a non-trivial chain: USDS ↔ DAI converter ↔ DAI Lite-PSM ↔ USDC Pocket. While each module is small, the chained dependency means a fault in any one of the four contracts halts USDS-USDC swaps. The wrapper itself is 2,972 bytes of bytecode — essentially a routing shim.

### Bug Bounty

- **Sky on Immunefi** ([immunefi.com/bug-bounty/sky](https://immunefi.com/bug-bounty/sky/)) — live since Feb 10, 2022, last updated Feb 26, 2026
- **Maximum payout: $10,000,000** for critical smart-contract vulnerabilities. Minimum critical: $150K. Reward = 10% of funds at risk, capped at $10M
- **216 assets in scope**, including USDS, sUSDS, LitePSM, DAI-USDS Converter, Chief, Pause, VAT
- Proof-of-concept required for all severities. Payouts in DAI or USDS at $1:1

### Safe Harbor (SEAL)

- Sky is **not** listed on the SEAL [Safe Harbor registry](https://safeharbor.securityalliance.org/) at the time of writing.

## Historical Track Record

- **USDS contract deployed:** September 2, 2024 ([tx `0xdf7d4ba4…b21c`](https://etherscan.io/tx/0xdf7d4ba4114f654a4ef64f74099be3fc91358610078febe5be68af6cf257b21c)) — **~20.6 months** in production
- **sUSDS deployed:** September 4, 2024 ([tx `0xe1be00c4…2c00`](https://etherscan.io/tx/0xe1be00c4ea3c21cf536b98ac082a5bba8485cf75d6b2b94f4d6e3edd06472c00))
- **LitePSM Wrapper deployed:** September 3, 2024 ([tx `0x43ddae74…8585`](https://etherscan.io/tx/0x43ddae74123936f6737b78fcf785547f7f6b7b27e280fe7fbf98c81b3c018585))
- **Underlying MakerDAO system:** live since December 2017 (Multi-Collateral DAI) — **~8.5 years**. Single-Collateral DAI launched November 2017.
- **TVL growth (USDS, DefiLlama stablecoin id 209):** $98.5M on launch day → **~$8.84B today** (cross-chain); ~$8.07B on Ethereum mainnet alone
- **Sky Lending TVL** ([DefiLlama](https://defillama.com/protocol/sky-lending)): ~$5.62B (Ethereum-only)
- **sUSDS adoption:** ~5.82B USDS locked in sUSDS — **about 72% of mainnet USDS supply** is staked in the savings vault, indicating very heavy "yield seeker" capture
- **Peg history (USDS, past 365 days via CoinGecko):**
  - Min: **0.9953** (October 11, 2025) — likely market-wide stablecoin stress, USDS only ~0.5% off peg
  - Max: **1.0008** (April 29, 2026)
  - Latest: 0.9997 (within peg)
- **Past security incidents (relevant to USDS path):**
  - **Black Thursday (March 12, 2020) — DAI/MCD:** Cascading ETH price crash combined with mempool congestion caused some liquidation auctions to be won at $0 bids. ~$6M of system shortfall was absorbed by minting MKR to recapitalize. Affected users were later partly compensated via DAO vote. The liquidation system was redesigned (Liquidations 2.0, audited by Quantstamp). USDS did not exist yet
  - **USDC depeg (March 11, 2023):** Circle's USDC briefly traded as low as ~$0.88 following Silicon Valley Bank exposure. DAI traded down with it (~$0.88 floor) because of the USDC PSM dependency. Sky/Maker responded by widening PSM fees temporarily and accelerating diversification into RWAs. USDS would inherit the same USDC peg exposure today — a USDC depeg is the largest non-bug peg risk to USDS
  - **No USDS/sUSDS/LitePSM-specific incidents** since their respective launches (~20 months at this snapshot)
- **TVL stability:** USDS supply has only grown since launch, with no reported large depositor exits or forced unwinds. The 0.47% peg deviation in Oct 2025 was small and short-lived.

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
     - USDS → USDC direction: bounded by the **Pocket USDC balance** (currently **~3.80B USDC**)
   - **Atomic:** yes — entire path completes in one transaction

3. **D3M (Direct Deposit Module)** — Sky governance can mint USDS directly to lending markets (Spark, Aave-Lido) up to per-market debt ceilings, where the USDS is borrowed by users. At the snapshot, the Spark Aave-Lido USDS pool ([`DIRECT_SPK_AAVE_LIDO_USDS_POOL`](https://etherscan.io/address/0xbf674d0cD6841C1d7f9b8E809B967B3C5E867653)) holds 0 USDS, so this channel is currently dormant for that specific pool

4. **MakerDAO/Sky CDPs (ETH-A, ETH-B, wstETH-A, WBTC-A, USDC-A vault, RWA-* vaults, LockStake)** — borrowers post collateral, draw DAI (which they can then swap to USDS via the converter). These vaults are over-collateralized at the ilk level (typical liquidation ratios 145–170% for crypto, 100%+ for RWAs)

All four channels ultimately settle through **MCD_VAT** ([`0x35D1b3F3…34267082920034666596031`](https://etherscan.io/address/0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B)), which at the snapshot reports `debt() ≈ 13,159,236,494,695,853,301,099,546,069,248,924,267,082,920,034,666,596,031` in rad units → **~13.16B normalized debt**. The corresponding DAI + USDS issued supply (Ethereum mainnet) is ~4.37B + ~8.07B ≈ **~12.44B**, and the difference represents stability-fee accrual and surplus in MCD_VOW.

### Accessibility

| Operation | Permission | Atomic? | Fees | Limits |
|-----------|-----------|---------|------|--------|
| USDC → USDS (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | `buf = 400M DAI` per fill; capped by PSM `line` in VAT |
| USDS → USDC (LitePSM Wrapper) | Permissionless | Yes (1 tx) | 0 | Pocket USDC balance (~3.80B) |
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
| **USDC PSM (LitePSM)** | Pocket holds USDC 1:1 | **~$3.80B USDC** at snapshot (largest single backing line for USDS-USDC swap capacity) |
| RWA vaults (RWA001–RWA015 ilks, Janitor/Conduit/Output flows) | Tokenized US Treasury bills (Monetalis, BlockTower, Centrifuge, Andromeda) | Significant chunk (historically 30–50% of total backing) but **offchain custody** at TradFi institutions — only transparent via attestation |
| LockStake (SKY token staked) | Borrow against locked SKY | Smaller, governance-token-backed |
| D3M (Spark/Aave Direct Deposit Modules) | USDS minted into lending pools where it's borrowed against external collateral | Capacity-extension mechanism rather than primary backing |
| GUSD-A PSM | Gemini USD-backed PSM | Smaller secondary PSM |
| PAX-A PSM (`MCD_PSM_PAX_A`) | Paxos USD-backed PSM | Smaller secondary PSM |

**System-level overcollateralization** is not directly readable from a single onchain call — it requires aggregating per-ilk `Art × rate` (debt) and `ink × oracle price × liquidation-ratio` (locked collateral value). LlamaRisk and Sky governance dashboards typically report ~110–115% **system-wide** CR (with RWA marked at par). At the snapshot the VAT debt of ~13.16B against ~12.44B issued stables suggests a thin direct surplus, with the buffer in MCD_VOW absorbing differences.

**Key takeaway for the USDS holder:** the collateral mix is far better than a fiat-only stablecoin (no single banking dependency), but worse than a pure crypto-collateralized model (RWA is not fully transparent). **For a USDC→USDS→sUSDS user specifically**, the relevant backing slice is overwhelmingly the **USDC PSM pocket** (3.80B USDC), with the rest of the Sky book acting as a *secondary* solvency buffer. As long as the PSM peg arbitrage works, USDS effectively trades at the lower of `peg(DAI)` and `peg(USDC)`.

### Provability

- **USDS exchange rate:** Fixed 1 USDS = 1 USDS internally; the *peg* is enforced externally via the converter/PSM arbitrage chain (programmatic, fee-free)
- **sUSDS exchange rate:** `convertToAssets(shares)` is fully onchain via `chi` accumulator and `ssr` rate. Continuous accrual is a pure function of `ssr` and elapsed time since `rho` (last `drip` timestamp). At snapshot: `chi = 1.0971`, `ssr = 1.0000000011367…`, `rho = 1779289691` (2026-05-15)
- **System debt (VAT):** Readable onchain via `MCD_VAT.debt()` and per-ilk `urns(ilk, urn)`, `ilks(ilk).Art`, `ilks(ilk).rate`. Full reserve audit requires aggregating dozens of ilks but is mechanically possible from public RPC
- **USDC PSM Pocket:** `USDC.balanceOf(pocket)` is publicly callable — at snapshot returns 3,803,795,832,516,012 (3.80B USDC)
- **RWA backing:** Less transparent. Sky publishes monthly RWA attestations (custodian + auditor reports) on the [Sky governance forum](https://forum.sky.money/) and tracker dashboards, but the underlying assets sit at TradFi custodians. This is a known limitation of the model and applies to a meaningful fraction of total backing
- **Can admins mint USDS out of thin air?** Yes, by definition — Sky governance (PauseProxy) can `usds.rely(addr)` to grant `wards = 1` to any address, which then has unrestricted minting via the underlying contract. This change must go through Chief vote + 48 h GSM delay. At the snapshot, the *only* non-governance ward is `USDS_JOIN`, which itself only mints in response to a corresponding `vat.suck` / `vat.move` settled through valid collateral

## Liquidity Risk

### Primary Exit Path: LitePSM Wrapper (USDS → USDC)

- **Direct 1:1 redemption** with zero fee. Atomic in a single transaction
- **Capacity (USDS → USDC):** bounded by **USDC balance in the Pocket = 3,803,795,833 USDC** at snapshot. That is ~3.80B exit capacity in a single tx with **0% slippage**
- **No cooldown, no queue, no per-user cap**. Anyone holding USDS can swap to USDC by calling `WRAPPER_USDS_LITE_PSM_USDC_A.buyGem(usr, gemAmt)`
- **Reverse direction (USDC → USDS)** is also atomic and zero-fee, bounded by the `buf` (400M DAI) per refill cycle. A CRON keeper job ([`CRON_LITE_PSM_JOB`](https://etherscan.io/address/0x0C86162ba3E507592fC8282b07cF18c7F902C401)) regularly refills the buffer; under heavy demand the buffer can be refilled multiple times per day

### Secondary Path: DAI-USDS Converter

- Atomic 1:1 conversion of USDS → DAI (or DAI → USDS), zero fee
- Unbounded — settles directly through `USDS_JOIN` and `DAI_JOIN` against MCD_VAT
- Useful when a user wants to access DAI-paired DEX liquidity (which is much deeper than direct USDS pairs)

### Tertiary: sUSDS ERC-4626 Withdrawal

- `redeem(shares, receiver, owner)` returns USDS at the current `chi` rate, atomic, zero fee. Underlying USDS is minted on-demand via `USDS_JOIN` — there is no per-block withdrawal cap

### DEX Liquidity

USDS DEX liquidity on Ethereum mainnet is meaningful but **not** the primary exit path — most large flows route through the PSM, not AMM pools. Top DEX pools touching USDS or sUSDS on Ethereum, from [DefiLlama yields](https://yields.llama.fi/pools) at snapshot:

| Project | Pool | TVL ($) |
|---------|------|--------:|
| Curve | PYUSD-USDS | ~$100.0M |
| Curve | sUSDS-USDT | ~$50.0M |
| Morpho Blue | sUSDS (multiple markets) | ~$110M aggregate |
| Curve | DOLA-sUSDS | ~$5.6M |
| Curve | USDS-stUSDS | ~$7.1M |
| Uniswap V3 | OHM-sUSDS | ~$10.9M |

Direct **USDS-USDC** DEX liquidity is small (no significant Curve/Uniswap USDS-USDC pool sits above $10M at the snapshot). This is because the **PSM Wrapper provides zero-fee 1:1 USDC↔USDS swaps**, so DEX routes cannot meaningfully out-price the PSM — there is no incentive for LPs to build deep USDS-USDC pools. For any reasonable Yearn integration size, the PSM (with ~$3.80B Pocket depth) is the dominant exit path; DEX liquidity is a secondary concern only at the multi-hundred-million-dollar scale.

### Cross-Chain Liquidity

USDS bridges to L2s and other chains via the **LayerZero OFT** ([`USDS_OFT`](https://etherscan.io/address/0x1e1D42781FC170EF9da004Fb735f56F0276d01B8), owner = PauseProxy) and sister deployments on Base, Arbitrum, Optimism, Unichain. Cross-chain USDS supply is ~770M (the gap between Ethereum mainnet 8.07B and DefiLlama total 8.84B). For an Ethereum-mainnet-only Yearn strategy, OFT exposure is operationally none.

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
  - Total SKY locked in Chief: **7,020,951,306 SKY** (~29.9% of the 23.46B SKY supply)
  - Approvals for the current hat ([`0xA005…F596`](https://etherscan.io/address/0xA0059DaDd7Fbdbc81a9bb9d1d17cCB029b6AF596)): **6,523,143,752 SKY** (~27.8% of total supply; **~92.9% of locked SKY votes for the hat**)
  - Top-10 individual voter concentration is non-trivial to derive purely from contract storage and is not resolved in this assessment — typical sources are Sky's voter dashboard or Chief `Vote`/`Lock` event aggregations. **TODO:** publish a top-10 voter snapshot via the Sky governance UI or a graph-aggregation, to track whether a small set of delegates can unilaterally hold the hat
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
| **Circle / USDC** | LitePSM Wrapper, Pocket holds 3.80B USDC | **Critical** for USDS-USDC swap path. A USDC freeze/blacklist on the Pocket or a USDC depeg would directly impair USDS-USDC convertibility | Circle has blacklisted addresses before (TornadoCash, OFAC sanctions). The Pocket has not been blacklisted but is on-chain visible and bounded by Circle's policy |
| **DAI / MakerDAO core (VAT, Join, Pot, Pause, Chief)** | All conversion paths | **Critical** — USDS shares the VAT with DAI. A bug in any MCD core contract impairs USDS | 8+ years of production with documented incidents (Black Thursday) but no exploit since |
| **Real-World Assets (RWA custodians)** | Backing of ~30–50% of system debt | High but indirect for the USDC→USDS user | Custodians are TradFi (Monetalis, BlockTower, Centrifuge). Failures propagate to system solvency but don't directly impair swap atomicity |
| **LayerZero (USDS_OFT, sUSDS_OFT)** | Cross-chain bridging only | Low for Ethereum-mainnet user | Owner = PauseProxy. Affects cross-chain users, not mainnet |
| **Chainlink / Oracle price feeds (MCD_SPOT)** | Sets per-ilk liquidation prices for collateral CDPs | Indirect — bad oracle → bad liquidations → solvency hit | Mature oracle setup with multi-source feeds |
| **LITE_PSM_MOM emergency halter** | Can pause USDC-USDS PSM swaps instantly | Trust dependency: the elected hat can halt PSM at will | Visible onchain; governance can override |

**Quality:** dependencies are predominantly **blue-chip** (Circle, MakerDAO core, Chainlink). The most material concentration is the **USDC dependency**: the on-chain USDC reserve currently makes up ~30%+ of the direct backing of USDS issued via the swap path, and *any* USDS holder who plans to exit to USDC implicitly trusts Circle.

## Operational Risk

- **Team:** Sky Foundation (formerly MakerDAO) — established 2017, **publicly known team** including Rune Christensen (co-founder), Sébastien Derivaux, and others. Long track record of operating a multi-billion-dollar protocol
- **Legal entity:** "**Skybase International**" operates the [sky.money](https://sky.money/) front-end per the [user-risks legal page](https://docs.sky.money/legal/skybase-international/user-risks). The Sky Protocol itself is described as "non-custodial blockchain-based software". Per Section 5 / 6 of the [Skybase International Terms of Use](https://docs.sky.money/legal/skybase-international/terms-of-use), **the Terms (and any non-contractual obligations) are governed by the laws of the Cayman Islands**, with arbitration under the Cayman Islands Association of Mediators and Arbitrators (CI-ArbCA) and the **seat of arbitration in George Town, Grand Cayman**. Courts of the Cayman Islands hold exclusive jurisdiction for non-arbitrable disputes. US residents are explicitly excluded from certain features (Sky Savings Rate and Sky Token Rewards)
- **Documentation:** Comprehensive — Sky maintains [developers.skyeco.com](https://developers.skyeco.com), [docs.sky.money](https://docs.sky.money), the public chainlog ([chainlog.sky.money](https://chainlog.sky.money)), GitHub org [sky-ecosystem](https://github.com/sky-ecosystem) with all production contract source code, and detailed governance forum at [forum.sky.money](https://forum.sky.money)
- **Incident response track record:**
  - Black Thursday (March 2020) — Sky/MakerDAO governance held an emergency vote, minted MKR to recapitalize the system, paused vulnerable auctions, and shipped Liquidations 2.0
  - USDC depeg (March 2023) — governance widened PSM fees temporarily and accelerated RWA diversification
  - No USDS-specific incidents to date
- **Monitoring infrastructure:** Sky publishes a live [chainlog](https://chainlog.sky.money) with all production addresses; LlamaRisk and Block Analitica produce regular risk dashboards. The Yearn `monitoring` repository already includes USDS-adjacent strategies (yvUSDS-1) in its hourly Telegram-alert pipeline ([source](https://github.com/yearn/monitoring/blob/main/yearn/alert_large_flows.py))
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

### Critical Values, Thresholds, and Frequency

| Metric | Source | Threshold to alert | Frequency |
|--------|--------|---------------------|-----------|
| USDS spot price | DEX TWAP / CoinGecko | < $0.995 or > $1.005 (>0.5% deviation) | 15 min |
| USDC Pocket balance | onchain | < $500M (would signal heavy redemption load) | Hourly |
| LitePSM `tin`, `tout`, `buf` | onchain | Any change | On `Rely`/`File` event |
| LitePSM Halt | event log | Any `Halt` event | Real time |
| `MCD_PAUSE` scheduled spells | `Plot` event | Any spell touching USDS / sUSDS / PSM / Pocket | Real time on event |
| sUSDS `ssr` rate | onchain | Any change >50 bps APY | On change |
| USDS / sUSDS implementation slot | EIP-1967 slot | Any change → `Upgraded` event | Real time on event |
| `Chief.hat()` rotation | onchain | New hat address | Real time on event |
| USDS total supply (cross-chain via OFT) | DefiLlama API | Sudden >5% drop in 24 h | Daily |

### Recommended Functions for Programmatic Monitoring

```solidity
USDS.totalSupply()                                  // mainnet supply
USDS.wards(addr)                                    // detect new minters
sUSDS.ssr()                                         // current per-second SSR
sUSDS.chi()                                         // accumulator (must only increase)
sUSDS.totalAssets()                                 // USDS held by savings vault
USDC.balanceOf(MCD_LITE_PSM_USDC_A_POCKET)          // PSM exit-capacity
MCD_LITE_PSM_USDC_A.tin() / .tout() / .buf()         // PSM economics
MCD_PAUSE.delay()                                   // GSM delay
Chief.hat()                                         // current elected spell
```

For offchain context, monitor the [Sky governance forum](https://forum.sky.money/) for posted spells. The current [LlamaRisk research index](https://llamarisk.com/research) does not list a standalone post-rebrand Sky/USDS assessment (9 articles visible, none on USDS); LlamaRisk has historically published Maker / DAI / RWA-exposure articles and acts as risk advisor for Aave's USDS onboarding, but the most recent dedicated risk report on the Sky stack predates the USDS rebrand.

## Appendix: Contract Architecture

Snapshot block 25137266 (May 20, 2026).

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
│   │ USDS_JOIN        │         │  POCKET              │ 3.80B USDC       │
│   │ 0x3C0f…7FEB      │         │  0x3730…7341         │                  │
│   │ wards[USDS] = 1  │         └──────────────────────┘                  │
│   └─────────┬────────┘                                                   │
│             │                                                             │
│             ▼                                                             │
│   ┌──────────────────────────────────────────────────┐                   │
│   │              MCD_VAT (core ledger)                │  ~13.16B debt    │
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
│   │  chi = 1.0971   ssr = ~3.65% APY                 │                   │
│   │  totalAssets() = 5.82B USDS                      │                   │
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
│   │   MCD_ADM  (Chief)   │  hat() = 0xA005…f596                          │
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
- **Fee-free, atomic, deep liquidity for USDC ↔ USDS** — the LitePSM Wrapper provides a 1:1 swap with no slippage, backed by ~$3.80B USDC in the Pocket. Exit capacity is orders of magnitude larger than any reasonable Yearn vault size
- **Fully onchain accounting** — USDS supply, sUSDS `chi`/`ssr`, PSM pocket balance, and VAT debt are all publicly readable. ERC-4626 standard for sUSDS
- **No EOAs in privileged roles** — all sensitive wards point to PauseProxy or audited Sky contracts; governance is token-weighted Chief vote with 48 h GSM delay
- **Diverse backing** — combination of overcollateralized crypto CDPs, RWA Treasury bills, USDC PSM, and D3M lending, reducing single-asset concentration risk
- **Excellent documentation, public team, and incident-response history** — Sky has demonstrably handled Black Thursday and USDC-depeg events under governance vote
- **High SSR adoption** — ~72% of USDS supply is staked in sUSDS, showing strong user confidence
- **USDS ↔ DAI fungibility** — converter rails USDS's peg directly to DAI, with full DAI DEX-liquidity universe as secondary exit

### Key Risks

- **USDC dependency** — the largest single backing line for the USDS-USDC swap path is Circle's USDC (~$3.80B in Pocket). A USDC depeg or Pocket blacklisting by Circle would directly impair USDS-USDC convertibility, as happened to DAI during the March 2023 SVB event
- **Governance can do anything to USDS / sUSDS** — PauseProxy can upgrade either contract's implementation, add new minters via `rely`, change the SSR, or halt PSM swaps via Mom. All require 48 h GSM delay except Mom-halt. SKY token-weighted voting introduces concentration risk if a small set of SKY holders dominates Chief
- **48 h GSM delay is at the low end** — many newer DeFi systems use 7-day timelocks. 48 h gives a tight reaction window for catching malicious spells
- **Real-World Asset backing is offchain** — a meaningful fraction of system collateral sits at TradFi custodians (Monetalis, BlockTower, Centrifuge) and depends on attestations, not direct onchain visibility
- **RWA legal/jurisdiction exposure** — Sky's RWA program inherits TradFi regulatory and counterparty risk that is not transparent at the contract level
- **Chained contract dependency for USDC→USDS** — the swap path traverses USDC → LitePSM → DAI Join → USDS Join → DAI-USDS Converter → USDS. A fault in any link halts the wrapper
- **SSR is governance-controlled** — sUSDS yield can be changed at any time by Sky governance (with 48 h delay). Historical range: ~5–15% during DAI era; currently ~3.65% APY

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
| Time in production | USDS: **20.6 months** (Sept 2024). Underlying MCD: **8.5 years** |
| TVL | USDS: ~$8.07B mainnet (~$8.84B total). sUSDS holds 5.82B USDS (~72% staked). Sky Lending TVL ~$5.62B |
| Security incidents on USDS / sUSDS / LitePSM | **None** since launch |
| Legacy incidents | Black Thursday (March 2020), USDC depeg (March 2023) — both handled by governance |

**Historical Score: 1.5 / 5** — USDS-specific track record is just shy of 2 years (would map to 2.0), but the underlying MCD core has been multi-billion-dollar production for 8 years with no recent incidents, justifying a slight discount toward 1.0.

**Cat 1 Score = (1.0 + 1.5) / 2 = 1.25 → 1.3 / 5** (conservative round-up to one decimal)

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

**Governance Score: 2.0 / 5** — Token-weighted governance with 48 h delay maps to score 2 on the rubric (between "Multisig 7/11+ with timelock 24+ h" and "EOA or <3 signers"). The 48 h delay is shorter than the 7-day rubric-1 threshold; an upgrade is reachable in <48 h via Mom emergency channel for PSM-pause only.

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
| Critical dependencies | USDC (Circle) — Pocket holds 3.80B USDC; DAI / MCD core; LITE_PSM_MOM; LayerZero (cross-chain only) |
| Quality | All blue-chip — Circle and MakerDAO core are the two largest mature dependencies in stablecoin DeFi |
| Single point of failure | Critical: a USDC freeze/depeg directly impairs the USDS-USDC swap. A bug in MCD_VAT impairs all USDS issuance |

**Dependencies Score: 2.0 / 5** — Two heavy blue-chip dependencies (USDC + MCD core) with material concentration in USDC. Maps to "1-2 blue-chip dependencies" but with non-trivial criticality, so 2.0 rather than 1.0.

**Cat 2 Score = (2.0 + 1.0 + 2.0) / 3 ≈ 1.67 → 1.7 / 5** (conservative round-up to one decimal)

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing model | Inherits MCD_VAT collateral book: crypto CDPs (overcollateralized), USDC PSM (~$3.80B), RWA Treasury bills (offchain custodians), LockStake, D3M |
| System-wide CR | VAT `debt() ≈ 13.16B` vs DAI+USDS supply ≈ 12.44B (Ethereum mainnet) — thin direct surplus, with per-ilk overcollateralization (145–170% on crypto ilks) as the safety margin |
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
| Liquidity depth | USDC Pocket: ~3.80B USDC → multi-hundred-million-dollar exits with 0% slippage |
| Same-value asset | USDS is a 1:1 stablecoin; no PPS divergence risk |
| Withdrawal restrictions | None — no cooldown, no queue, no per-user cap |
| Historical stress behavior | PSM remained functional during October 2025 stablecoin stress; max 1-year USDS depeg was 0.47% |
| Single-tx exit capacity | Pocket balance ($3.80B) far exceeds any plausible Yearn integration size |

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
| Audits & Historical | 1.3 | 20% | 0.260 |
| Centralization & Control | 1.7 | 30% | 0.510 |
| Funds Management | 1.8 | 30% | 0.540 |
| Liquidity Risk | 1.0 | 15% | 0.150 |
| Operational Risk | 1.0 |  5% | 0.050 |
| **Final Score** | | | **1.510 → 1.5 / 5.0** |

**Optional Modifiers Considered:**
- *Live >2 years with no incidents:* **Not applied** — USDS itself is 20.6 months old, just shy of the 24-month threshold. (If reassessed after September 2026, this modifier would likely apply and could drop the score by 0.5.)
- *TVL maintained >$500M for >1 year:* The strict criterion is met for USDS (>$500M continuously since shortly after launch, multi-billion for >1 year). The TVL tailwind is already reflected in the Cat-1 Historical 1.5 (rather than 2.0). **Not applied as an additional -0.5** to avoid double-counting.

**Net final: 1.5 / 5.0.** The unrounded weighted sum is 1.510, which sits just above the Minimal-Risk ceiling (1.5). Per the conservative scoring guideline (when uncertain between two tiers, choose the higher / riskier one), this report classifies USDS at the **Low Risk** tier rather than the Minimal-Risk boundary.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0–1.5 | Minimal Risk | Approved, high confidence |
| **1.5–2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (1.5 / 5.0) — Approved with standard monitoring**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (November 2026) or annually. After September 2026, the >2-year-no-incident modifier becomes available and may reduce the score further.
- **TVL-based:**
  - USDS supply drops >25% from snapshot (~$8.07B → <$6B) — would indicate material loss of confidence or large policy event
  - sUSDS share of USDS supply drops below 50% (currently ~72%) — would indicate SSR has been cut materially or savers are exiting
  - USDC Pocket balance drops below $500M — would indicate sustained exit pressure and compromise of the deep-redemption story
- **Parameter-based:**
  - `LITE_PSM_USDC_A.tin` or `tout` changes from zero (fees introduced) → harden Liquidity score
  - `LITE_PSM_USDC_A.buf` changes materially → re-evaluate exit capacity for USDC→USDS direction
  - `sUSDS.ssr` changes by >50 bps APY → not a risk event but warrants user-facing notice
  - `MCD_PAUSE.delay()` is reduced below 48 h → governance score worsens
  - `USDS.wards()` grants a ward outside the current set (USDS_JOIN, PauseProxy) → re-review mint authority
- **Incident-based:**
  - Any `LITE_PSM_MOM.HALT()` invocation (emergency PSM halt)
  - Any USDS depeg deeper than ±1% sustained for >24 h
  - Any USDC depeg event (would propagate to USDS via PSM)
  - Any exploit or governance attack on the Sky/MCD core (Chief, Pause, VAT, USDS, sUSDS, LitePSM, USDS_JOIN, DAI_USDS, Pocket, OFT)
  - Any blacklisting of the USDC Pocket by Circle
- **Governance-based:**
  - SKY voter concentration changes materially (e.g. single voter exceeds majority of `Chief.approvals(hat)`) — TODO: set up quarterly snapshot once data source identified
  - New USDS / sUSDS implementation deployed (would reset the audit baseline)
  - RWA program changes materially (new custodians, large reallocations, custodian incidents)

---

## Open Items

Resolved in this assessment pass:

- ✅ **Skybase International jurisdiction:** Cayman Islands — confirmed in the [Terms of Use](https://docs.sky.money/legal/skybase-international/terms-of-use) (governing law = Cayman Islands; arbitration seat = George Town, Grand Cayman; exclusive court jurisdiction = Cayman Islands). Reflected in the Operational Risk section
- ✅ **DEX liquidity sanity check:** verified via DefiLlama yields — top direct USDS-paired pool is Curve PYUSD-USDS at ~$100M; direct USDS-USDC DEX liquidity is intentionally thin because the PSM provides zero-fee 1:1 swaps with $3.80B depth (no LP incentive to build deeper USDS-USDC pools). Reflected in the Liquidity Risk section
- ✅ **`LITE_PSM_MOM.halt(...)` history:** confirmed via full Etherscan log scan of [`0x467b…b425`](https://etherscan.io/address/0x467b32b0407Ad764f56304420Cddaa563bDab425) — only 4 events ever (2× `SetOwner`, 2× `SetAuthority` from deployment setup). **Halt has never been invoked.** Reflected in the Liquidity Risk section
- ✅ **Latest LlamaRisk / Steakhouse coverage:** the current [LlamaRisk research index](https://llamarisk.com/research) lists 9 articles, none on Sky/USDS post-rebrand. LlamaRisk has historically published Maker/DAI work (e.g. "MakerDAO Endgame and its Repercussions on Curve Finance", "DAI Exposure to Real World Assets") and has acted as risk advisor for Aave's USDS/sUSDS onboarding — but no standalone post-rebrand assessment exists at the time of this report

Remaining TODOs (true open items, manual follow-up):

- **TODO:** Top-10 SKY voter / approver snapshot. At the snapshot the hat has 6.52B SKY approvals (~92.9% of locked SKY in Chief), but breakdown by individual address requires offchain enrichment (Sky governance UI / a subgraph of `Vote`/`Lock` events). Useful for sizing the realistic minimum SKY budget required to hold the hat in an attack
- **TODO:** Confirm RWA backing share of total VAT debt at snapshot — Sky publishes attestations on the [governance forum](https://forum.sky.money/) but a programmatic per-ilk aggregation is recommended as part of routine monitoring
