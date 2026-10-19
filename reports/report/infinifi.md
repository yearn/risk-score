# Protocol Risk Assessment: InfiniFi

- **Assessment Date:** February 4, 2026 (Updated: October 19, 2026)
- **Token:** siUSD (Staked iUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)
- **Final Score: 3.09/5.0**
- **Snapshot:** Ethereum block [26,227,163](https://etherscan.io/block/26227163), hash [`0x868f…43a4`](https://etherscan.io/block/0x868f45fbc644ca1cff7db1155abac6b4da796d6e86576bed82e1e2e0dcd443a4), October 19, 2026 at 14:16:59 UTC. Base block [52,815,036](https://basescan.org/block/52815036), hash [`0xfccc…15b9`](https://basescan.org/block/0xfccc8d6a96b8e51680eeaba0fc78feb1c61c6230d44646737303916eba7415b9), and Monad block [114,776,797](https://monadscan.com/block/114776797), hash [`0xf209…5046`](https://monadscan.com/block/0xf209d0d0d6f71270dbdcd7b643918c47fcd516a404d65e89565d2d58877b5046), same timestamp. Roles, balances, farms and proxies are pinned to these blocks; event scans end at the Ethereum block. Monad reads use the public Monad RPC (`rpc.monad.xyz`, chain id 143). API, DefiLlama and DEX observations are separately timed on October 19, 2026.

## Overview + Links

InfiniFi accepts enabled deposit assets to mint iUSD and deploys the backing through farms. siUSD wraps iUSD in an ERC-4626 vault; locked liUSD positions provide the first-loss tranche. The liability ladder remains liUSD → siUSD → iUSD.

The current accounted asset book is **$66.58M**. Five funded RWA escrow positions account for **$34.42M (51.7%)**, all valued through one configured-rate manager. Fasanara GDADF, now held as Midas mGLO, is **32.1%** and Fasanara Genesis is **3.9%**; their combined issuer concentration is **36.0%**. The largest onchain positions are a Pendle PT-reUSD position (**13.5%**) maturing December 10, 2026 and f(x) fxSAVE (**12.2%**). The Monad OutlandFarm L1 book is **$4.11M (6.2%)**. The LIQUID bucket provides **$10.60M** of reported immediate liquidity through Cap, Aave V3 and Spark: **20.6% of liquid capital** (iUSD supply less locked and unwinding liUSD, $51.33M) and 15.9% of TVL. The first-loss notional is **$15.24M**, larger than every single position except GDADF. See Appendix A.

**Reserve evidence:** the ledger is observable, but `RWAEscrowRateManager.harvest()` accrues configured returns and updates timestamps; it is not a NAV or custody verification. Evidence now differs by position. **GDADF ($21.34M):** after a [September 29 conversion notice](https://github.com/InfiniFi-Labs/documents/blob/master/fasanara/gdadf-nav/GDADF%20September%202026%20Notice.pdf), the escrow holds **12,043,884.53 mGLO** onchain and has a pending Midas redemption request for **7,457,000.29 mGLO**. At Midas's published mGLO price these are worth about **$18.85M–$19.22M**, **$2.1M–$2.5M (9.9%–11.7%) below the escrow book**; **TODO:** InfiniFi explanation of that gap. **Genesis ($2.62M):** InfiniFi publishes [monthly position reports](https://github.com/InfiniFi-Labs/documents/blob/master/fasanara/genesis-nav/Gensis%20Fasanara%20Report%20August%202026.pdf) drawn from the fund administrator's statement; the August 31 balance of $2,552,338.45 was 1.5% below the escrow book that day. **New Silver ($8.43M, two escrows):** [monthly fund-level updates](https://github.com/InfiniFi-Labs/documents/blob/master/new-silver/New%20Silver%20Update%20Aug.pdf) only, with no InfiniFi position statement. **FalconX ($2.03M):** no public statement. Position-level evidence for New Silver and FalconX, and a GDADF reconciliation, must be produced by **January 14, 2027**. Periodic and partly onchain evidence is not "no verification", so the unverifiable-reserves gate is not triggered; the gaps are scored as Collateralization 4.0 and Provability 3.5, giving a final score of **3.09**. If that evidence is not available by January 14, 2027, or a counterparty cannot evidence its holdings, apply the gate.

**Farm notice periods:** `RWAEscrowFarm` and `RWAEscrowRouterFarm` use rolling `block.timestamp + duration`; FxSaveFarm returns `now + 7 days`, and OutlandFarm uses `maturityOffset()` (7 days for both current instances). These are accounting/notice horizons, not guaranteed calendar settlement dates. Cash requires an actual counterparty return, unstaking/claim operation or cross-chain transfer.

The protocol offers three tiers of tokens:

1. **iUSD:** base stablecoin receipt, redeemable against available backing.
2. **siUSD:** staked iUSD; ERC-4626 withdrawal to iUSD has no cooldown, but subsequent USDC redemption depends on protocol liquidity.
3. **liUSD:** locked iUSD (1–13 weeks); first-loss capital, with early exits routed through UnwindingModule.

**Links:** [Protocol Documentation](https://docs.infinifi.xyz/) · [Protocol App](https://infinifi.xyz/) · [Analytics](https://stats.infinifi.xyz/) · [GitHub](https://github.com/InfiniFi-Labs/infinifi-protocol) · [Audits](https://docs.infinifi.xyz/audits) · [Dependency graph](https://curation.yearn.fi/graph/infinifi)

## Contract Addresses

All 17 registered Ethereum farms, assessed tokens, and the Gateway, YieldSharing and PortalHub implementations are source-verified on Etherscan. Monad PortalOutpost, AccountingL2, FarmRegistry, connector and both funded farms are source-verified on Monadscan.

**Core / Governance:**

- **iUSD (ReceiptToken)**: [`0x48f9e38f3070AD8945DFEae3FA70987722E3D89c`](https://etherscan.io/address/0x48f9e38f3070AD8945DFEae3FA70987722E3D89c) — ERC20, restricted mint/burn via CoreControlled roles
- **siUSD (StakedToken)**: [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) — ERC4626 vault wrapping iUSD
- **InfiniFiCore (AccessControl)**: [`0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490`](https://etherscan.io/address/0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490) — Central AccessControlEnumerable, DEFAULT_ADMIN_ROLE has 0 holders (renounced).
- **Gateway (Proxy)**: [`0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5`](https://etherscan.io/address/0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5) — TransparentUpgradeableProxy → InfiniFiGatewayV4 ([`0x750136ac021a7149f0ee38141d0ba920cca1fc5d`](https://etherscan.io/address/0x750136ac021a7149f0ee38141d0ba920cca1fc5d))
- **Gateway ProxyAdmin**: [`0x21071E0f9D600571Ffe47873e95fffF2FAc9141c`](https://etherscan.io/address/0x21071E0f9D600571Ffe47873e95fffF2FAc9141c) — Owned by Long Timelock (7-day delay for upgrades)
- **Accounting**: [`0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3`](https://etherscan.io/address/0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3) — aggregates farm TVL via FarmRegistry
- **FarmRegistry**: [`0xF5f2718708f471e43968271956CC01aaA8c46119`](https://etherscan.io/address/0xF5f2718708f471e43968271956CC01aaA8c46119) — canonical list of approved farms (17 registered: 5 PROTOCOL, 3 LIQUID, 9 MATURITY; twelve positions exceed $100,000, including Monad's $4,110,614.48 L1 book and Base's $342,542.25; controller float is $0.001309)
- **YieldSharing (Proxy → V3)**: [`0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b`](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b) — TransparentUpgradeableProxy → YieldSharingV3 ([`0x0d5dBF208A9a7540018D204a9A0aD08A091407e5`](https://etherscan.io/address/0x0d5dBF208A9a7540018D204a9A0aD08A091407e5)).
- **LockingController (liUSD positions)**: [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) — first-loss tranche
- **UnwindingModule**: [`0x7092A43aE5407666C78dBEA657a1891f42b3dFcc`](https://etherscan.io/address/0x7092A43aE5407666C78dBEA657a1891f42b3dFcc) — settles liUSD early exits over time
- **MintController**: [`0x49877d937B9a00d50557bdC3D87287b5c3a4C256`](https://etherscan.io/address/0x49877d937B9a00d50557bdC3D87287b5c3a4C256)
- **RedeemController**: [`0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601`](https://etherscan.io/address/0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601)
- **MigrationController**: [`0x5F5403656E4Db95aCcF1064A714B1bcE351839F8`](https://etherscan.io/address/0x5F5403656E4Db95aCcF1064A714B1bcE351839F8) — additional ENTRY_POINT and RECEIPT_TOKEN_MINTER
- **MinorRolesManager**: [`0xa08Bf802dCecd3c44E6420a52d5158867366be9b`](https://etherscan.io/address/0xa08Bf802dCecd3c44E6420a52d5158867366be9b) — **holds no role membership on Core** (see Governance section)
- **FluidRewardsClaimer**: [`0xD0ec80032C0da717BD78B9569321D9069365241E`](https://etherscan.io/address/0xD0ec80032C0da717BD78B9569321D9069365241E) — GOVERNOR (claim-only scope)
- **PLSmoother / PLSmootherHelper**: [`0xC324569141697045B9EdE54B5d4623a691ed57A4`](https://etherscan.io/address/0xC324569141697045B9EdE54B5d4623a691ed57A4) / [`0x215C7fA0E620FCE99Ed4891BCcb7523388b010b8`](https://etherscan.io/address/0x215C7fA0E620FCE99Ed4891BCcb7523388b010b8) — handle profit/loss smoothing; PLSmoother holds RECEIPT_TOKEN_MINTER and RECEIPT_TOKEN_BURNER, PLSmootherHelper holds RECEIPT_TOKEN_BURNER and FINANCE_MANAGER
- **AfterMintHook / BeforeRedeemHook**: [`0xa5E274E6c2AbBd30E3A94e1A2dF7e6F5944797a8`](https://etherscan.io/address/0xa5E274E6c2AbBd30E3A94e1A2dF7e6F5944797a8) / [`0x4b2bFe49829dE3632449928507452EE667f61395`](https://etherscan.io/address/0x4b2bFe49829dE3632449928507452EE667f61395) — FARM_MANAGER
- **ManualRebalancer**: [`0x5fEaad299BF772505e79250Ec58E28fdfdc52777`](https://etherscan.io/address/0x5fEaad299BF772505e79250Ec58E28fdfdc52777) — FARM_MANAGER
- **EmergencyWithdrawal**: [`0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9`](https://etherscan.io/address/0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9) — FARM_MANAGER, UNPAUSE, PAUSE (multisig-driven)
- **MaturedFarmCleaner**: [`0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56`](https://etherscan.io/address/0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56) — PROTOCOL_PARAMETERS + PAUSE
- **LiquidationFarm**: [`0xda40ce7DdDBE7D54A106D32575b2CCF41dDb1A11`](https://etherscan.io/address/0xda40ce7DdDBE7D54A106D32575b2CCF41dDb1A11) — Liquid-type farm holding MANUAL_REBALANCER + FINANCE_MANAGER
- **AllocationVoting**: [`0x49FA678BB8B2F5F8089493a6f93e1bb8500FF853`](https://etherscan.io/address/0x49FA678BB8B2F5F8089493a6f93e1bb8500FF853) — TRANSFER_RESTRICTOR holder
- **OracleFactory**: [`0xA2b300C5D0e9250F646B20ec924efaD36d19Ed91`](https://etherscan.io/address/0xA2b300C5D0e9250F646B20ec924efaD36d19Ed91) — ORACLE_MANAGER
- **iUSD Oracle (FixedPriceOracle)**: [`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`](https://etherscan.io/address/0x8ABc952f91dB6695E765744ae340BC5eA4B344c1) — `price()` = `1.0e18` at the snapshot; a fixed-price read does not establish market peg or reserve quality

**Team Multisig & Timelocks:**

- **Team Multisig**: [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) — Gnosis Safe v1.4.1, **4/8 threshold**, 8 EOA signers, nonce 682.
- **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — 604,800s delay (verified)
- **Short Timelock (24 hours)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` = 86,400s. Governs parameter/oracle changes and farm additions/removals.

**Active farms** (see Funds Management § Asset Allocation for full table and Appendix A for risk analysis).

**Outland / cross-chain accounting:**

- **PortalHub proxy:** [`0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61`](https://etherscan.io/address/0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61) → verified PortalHub [`0xe66110973b9acc45204b4b1d0c59370466dd686b`](https://etherscan.io/address/0xe66110973b9acc45204b4b1d0c59370466dd686b); ProxyAdmin [`0x866a8e35abdfc42a7f8fd3be24c91ef5fb039d0e`](https://etherscan.io/address/0x866a8e35abdfc42a7f8fd3be24c91ef5fb039d0e) is owned by Long Timelock. `bridgePaused()` is true; `paused()` is false.
- **Base OutlandVault / farm:** [`0x4197F2ADFCe9fDeB36B02e96737Ddf646C841e45`](https://etherscan.io/address/0x4197F2ADFCe9fDeB36B02e96737Ddf646C841e45) / [`0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA`](https://etherscan.io/address/0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA) — native iUSD minter/burner; L1 assets $342,542.25.
- **Monad OutlandVault / farm:** [`0x77776F422B7EB0A95ccD35fBd088A5957D4408eA`](https://etherscan.io/address/0x77776F422B7EB0A95ccD35fBd088A5957D4408eA) / [`0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E`](https://etherscan.io/address/0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E) — native iUSD minter/burner; L1 assets $4,110,614.47. Monad-side [AccountingL2](https://monadscan.com/address/0x386DfFb5a31588aB56Df20C54Ec649F3B554362C#code) reports $4,110,795.34 at the matching block (see Bridge Dependencies).
- **CCIP connector:** [`0x65805D838a3504d283B92a623081E4b8c5583502`](https://etherscan.io/address/0x65805D838a3504d283B92a623081E4b8c5583502) — configured Base peer, no Monad peer.
- **CCTP + CCIP connector:** [`0x3373784A7a52A07F9339aA8F60403420cC602c52`](https://etherscan.io/address/0x3373784A7a52A07F9339aA8F60403420cC602c52) — configured Monad peer, no Base peer. CCTP V2 moves USDC; CCIP carries accounting messages. Both connectors use CCIP router [`0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D`](https://etherscan.io/address/0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D).

## Audits and Due Diligence Disclosures

InfiniFi has undergone extensive security review via Certora, Spearbit/Cantina Code, and a Cantina public competition, plus multiple ongoing upgrade reviews.

- **Spearbit / Cantina Code** (March-April 2025): Main protocol security review. Report published April 1, 2025. Findings: **8 High, 6 Medium, 25 Low, 4 Gas, 24 Informational**. Auditors: Noah Marconi (Lead), R0bert (Lead), Slowfi, Jonatas Martins. [Report PDF](https://r0bert-ethack.github.io/pdfs/report-cantinacode-infinifi-0303.pdf).
- **Certora**: Formal Verification & Security Assessment (March 21 – May 20, 2025). Report published June 4, 2025. Covers formal verification via Certora Prover and manual review. [Report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report).
- **Cantina Public Competition** (April 2025): Public audit competition. [Competition link](https://cantina.xyz/competitions/2ac7f906-1661-47eb-bfd6-519f5db0d36b). Reward pool claimed ~$40,000 ($35k + $5k) — amount unconfirmed via automation.
- **Ongoing Cantina Code / Spearbit Managed Reviews** (6+ additional reviews of upgrades):
  - siUSD rewards interpolation update
  - Pendle SY farm integration
  - Multiasset farms (new farm types)
  - PR 209: Multiple new farms
  - PR 228: J-Curve Smoother, ReservoirFarm, Fluid rewards
  - PR 224: Crosschain support (CCIP + LayerZero)
  All PDFs accessible via [auditor portfolio](https://r0bert-ethack.github.io/).
Note: The initial Spearbit audit and "Cantina Code" review appear to be the **same engagement** (same auditors, same date, same file size). They should not be counted as separate audits.

The [current security page](https://docs.infinifi.xyz/audits) also lists ongoing Three Sigma reviews and Hypernative monitoring. **TODO:** obtain review reports identifying the deployed Gateway V4, PortalHub and both OutlandVault versions; a generic ongoing-review listing does not establish coverage of these deployments.

### Bug Bounty

- [Bug Bounty Program on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591)

## Historical Track Record

- **Production history:** mainnet launch June 2025; approximately 16 months in production. The [September 23, 2026 protocol announcement](https://www.prnewswire.com/news-releases/infinifi-raises-3m-ahead-of-q4-tge-302887464.html) describes an additional $3M+ funding round and a planned Q4 token launch; these are issuer statements, not reserve evidence.
- **TVL:** the January 7, 2026 [DefiLlama](https://defillama.com/protocol/infinifi) peak was $190.49M. The current $66.58M is 65.0% below that peak. TVL was above $50M on 312 of the last 365 DefiLlama daily observations; the exception was a dip between August and early October. DefiLlama shows $48.98M on September 19 and $66.53M on October 19 (**+35.8% over 30 days**), including a +27.7% inflow on October 8→9; the September 28→29 observations fell 10.5%. The snapshot Accounting value is $66,579,254.27; the separately timed protocol API reports $66,579,264.83.
- **Redemption record:** the July 29 assessment recorded 5,909 redemptions and ~$713M in instant USDC payments from deployment through block 25,638,819, including the historical $17.84M March redemption ([transaction](https://etherscan.io/tx/0xdaaf87cc042356c36f23c4fbbac1675817eaed8c45cec26c462089d173dca900)). A paginated scan of blocks 25,638,820–26,227,163 finds **1,027 `Redeem` events, $51.89M paid out, and zero `RedemptionQueued`, `RedemptionFunded`, `RedemptionPartiallyFunded` or `RedemptionClaimed` events**. The largest payment in that interval was $5.24M ([transaction](https://etherscan.io/tx/0xf03e44f0582fe3aba224d17566399fce74d8721df71bd484e3a05f010334fc4b)). The September 28 daily payments totalled $5.83M; this historical liquidity is not the present buffer.
- **Loss/peg state:** no disclosed protocol exploit was identified in the consulted sources. The current iUSD FixedPriceOracle reads $1.00. No `LossesApplied`, `VaultLoss` or `CriticalLoss` events were found through block 26,227,163. Missing reserve proof is separate from a realized-loss status.
- **liUSD unwind state:** LockingController holds $13.35M iUSD and UnwindingModule holds $1.89M; `totalBalance()` is $15.24M, up from $14.00M on October 3 but below the $19.71M recorded on July 29. The combined first-loss notional includes positions in unwind and is not a permanent capital commitment.

## Funds Management

InfiniFi manages an approved farm portfolio in three buckets: PROTOCOL (controller float), LIQUID (instant principal withdrawal), and MATURITY (notice-period/operational exit). Bucket membership is enumerated from `FarmRegistry.getTypeFarms()`. Values below reconcile exactly to `Accounting.totalAssetsValue()` at the snapshot; offchain book-value reconciliation does not prove economic backing.

### Asset Allocation

| Bucket | Value (USD) | Share | Withdrawal terms |
|---|---:|---:|---|
| PROTOCOL | $0.001309 | ~0% | Controller float |
| LIQUID | $10,598,886.59 | 15.9% | Cap $6.363M, Aave V3 $3.177M, Spark $1.059M; all report full principal liquidity |
| MATURITY | $55,980,367.67 | 84.1% | 7 / 28 / 56-day accounting/notice horizons and a December 10, 2026 Pendle maturity; actual cash depends on underlying exits |
| **Total** | **$66,579,254.27** | **100%** | |

| Position / farm | Implementation | Bucket / notice | Assets | Share |
|---|---|---|---:|---:|
| [`Fasanara GDADF (Midas mGLO)`](https://etherscan.io/address/0x2fa5E6C5549BEdF98A935Cac3BB4337459c74897) | RWAEscrowRouterFarm | MATURITY 28d | $21.34M | 32.1% |
| [`Pendle PT-reUSD-10DEC2026`](https://etherscan.io/address/0xe9E44C0A68C49aDe51CdA5e027909C5996B5c71a) | PendleV2FarmV3 | MATURITY Dec 10, 2026 | $9.02M | 13.5% |
| [`f(x) fxSAVE`](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363) | FxSaveFarm | MATURITY 7d | $8.09M | 12.2% |
| [`Cap stcUSD`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | CapFarm | LIQUID | $6.36M | 9.6% |
| [`New Silver`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | RWAEscrowFarm | MATURITY 56d | $5.22M | 7.8% |
| [`Outland Monad`](https://etherscan.io/address/0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E) | OutlandFarm | MATURITY 7d | $4.11M | 6.2% |
| [`New Silver 2 Senior`](https://etherscan.io/address/0x79e1B8e45932A7C802eA3dAb3844e5DEa68d971f) | RWAEscrowRouterFarm | MATURITY 7d | $3.20M | 4.8% |
| [`Aave V3 USDC`](https://etherscan.io/address/0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580) | AaveV3Farm | LIQUID | $3.18M | 4.8% |
| [`Fasanara Genesis`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | RWAEscrowFarm | MATURITY 28d | $2.62M | 3.9% |
| [`FalconX Institutional`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | RWAEscrowFarm | MATURITY 7d | $2.03M | 3.0% |
| [`Spark sUSDC`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | SparkSUSDCFarm | LIQUID | $1.06M | 1.6% |
| [`Outland Base`](https://etherscan.io/address/0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA) | OutlandFarm | MATURITY 7d | $342,542.25 | 0.5% |

Position labels come from the [current vault disclosures](https://docs.infinifi.xyz/vaults) and [portfolio API](https://eth-api.infinifi.xyz/api/protocol/data); addresses, membership, values and exit getters come from fixed-block `cast` reads at the snapshot. The portfolio API can retain removed positions and show a different state from the snapshot, so FarmRegistry is the authority for inclusion.

The original MidasFarm [`0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF) and Team-Safe escrow farm [`0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) are not registered and hold $0. Aave V4 [`0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657) and the two Sentora swap farms [`0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) / [`0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) are removed, with $8.70 / $9.49 / $14.61 of residual assets respectively; they are excluded from current Accounting TVL. The Steakhouse infiniFi MetaMorpho [`0x76D2E84009dAE457f8667D823c7c96e9A7c35B78`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78), Horizon [`0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032`](https://etherscan.io/address/0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032) and Euler [`0x6FBc446f25Ab5141C4F7E7711E52DFc0AdA407A5`](https://etherscan.io/address/0x6FBc446f25Ab5141C4F7E7711E52DFc0AdA407A5) farms, which held zero assets and were paused, are no longer registered. Remaining registered internal farms have $0.

### Accessibility

`FarmRegistry.getEnabledAssets()` returns USDC [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) and RLUSD [`0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD`](https://etherscan.io/address/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD). The second token's `symbol()` and `name()` return `RLUSD`, with 18 decimals; it is not Tether USDT. These identify the enabled asset; direct mint-route support beyond the USDC controller has not been reverified. USDe/sUSDe are not present in the enabled-asset set. Frontend swap support is distinct from direct enabled deposits.

### Token Mint Authority

`ReceiptToken.mint` and `burn` check Core's `RECEIPT_TOKEN_MINTER` / `RECEIPT_TOKEN_BURNER`. Six minters and nine burners are enumerated; mint-role admin is `GOVERNOR`, and DEFAULT_ADMIN has zero members. All six minters have corresponding graph mint edges.

| Contract | Mint | Burn | Path / risk |
|---|:---:|:---:|---|
| [`MintController`](https://etherscan.io/address/0x49877d937B9a00d50557bdC3D87287b5c3a4C256) | ✓ | — | Deposit collateral precedes user-facing mint |
| [`MigrationController`](https://etherscan.io/address/0x5F5403656E4Db95aCcF1064A714B1bcE351839F8) | ✓ | — | Migration collateral path |
| [`YieldSharing`](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b) | ✓ | ✓ | Internal yield distribution; upgradeable V3 |
| [`PLSmoother`](https://etherscan.io/address/0xC324569141697045B9EdE54B5d4623a691ed57A4) | ✓ | ✓ | `smoothProfit` mints without an atomic collateral transfer; trusts upstream profit accounting |
| [`Base OutlandVault`](https://etherscan.io/address/0x4197F2ADFCe9fDeB36B02e96737Ddf646C841e45) | ✓ | ✓ | CCIP-authenticated remote asset/supply reports can mint native iUSD and stake it into siUSD |
| [`Monad OutlandVault`](https://etherscan.io/address/0x77776F422B7EB0A95ccD35fBd088A5957D4408eA) | ✓ | ✓ | Same native mint path; Monad accounting and supplies reconciled at the snapshot |
| [`siUSD`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) / [`UnwindingModule`](https://etherscan.io/address/0x7092A43aE5407666C78dBEA657a1891f42b3dFcc) / [`LockingController`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) | — | ✓ | Loss processing |
| [`RedeemController`](https://etherscan.io/address/0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601) / [`PLSmootherHelper`](https://etherscan.io/address/0x215C7fA0E620FCE99Ed4891BCcb7523388b010b8) | — | ✓ | Redemption and smoothing burns |

The verified [OutlandVault source](https://etherscan.io/address/0x4197F2ADFCe9fDeB36B02e96737Ddf646C841e45#code) calls native `ReceiptToken.mint` from `_syncL2Supply` during `portalUpdate`; it does not require collateral to arrive atomically. PortalHub accepts a message hash from an approved connector, then an `OUTLAND_KEEPER` must process that exact payload in nonce order. There is no onchain independent reconciliation of remote collateral and no per-message mint cap in this path. A forged accepted asset/supply report followed by keeper processing can inflate book assets and canonical supply, affecting native holders regardless of the current Base/Monad exposure. Adding minters and upgrading PortalHub require the 7-day Long Timelock; connector/peer/vault configuration uses 24-hour parameter authority.

The two LayerZero OFT adapters have no native minter role; they escrow existing tokens. That limited blast radius applies to the OFT route only, not the Outland route. `PLSmoother` remains vulnerable to upstream false profit reporting: a keeper-accrued escrow book can feed internal yield accounting without a contemporaneous cash realization. Pending profit held in PLSmoother is excluded from the documented loss waterfall.

### Collateralization

| Component | Current amount | Getter |
|---|---:|---|
| iUSD total supply | 66.575937M | `iUSD.totalSupply()` |
| iUSD held by siUSD | 50.950746M | `iUSD.balanceOf(siUSD)` / `siUSD.totalAssets()` |
| iUSD held by LockingController | 13.349727M | `iUSD.balanceOf(LockingController)` |
| iUSD held by UnwindingModule | 1.894679M | `iUSD.balanceOf(UnwindingModule)` |
| Residual iUSD outside those three contracts | 0.380785M | Supply minus the three balances; includes other contracts |
| siUSD supply | 46.508364M shares | `siUSD.totalSupply()` |
| iUSD per siUSD | 1.095518 | `convertToAssets(1e18)` |
| First-loss notional | 15.244406M | `LockingController.totalBalance()` |

Accounted assets exceed receipt supply by approximately $3,317.60, a **book backing ratio of 100.0050%**. The $34.42M RWA book is supported by keeper-set balances rather than reconciled reserve proof. The $15.24M first-loss notional is **larger than every individual position except GDADF**: the next largest, Pendle PT-reUSD at $9.02M, is 59% of the buffer, so any one of those positions could go to zero without reaching siUSD. GDADF ($21.34M) is the exception; the buffer covers **71.4%** of it, so a loss of roughly 71% of GDADF alone would exhaust the notional. The buffer covers **63.6% of combined Fasanara exposure ($23.96M)** and **44.3% of the RWA book**, so correlated losses across several positions can also exhaust it. The $1.89M in unwind can leave the buffer as claims complete.

### Provability

All registered farm identities, allocations and onchain DeFi balances are observable. Book values of the five RWA escrows (51.7%) are an administrative ledger, `RWAEscrow.totalAssets()`. All five share [RWAEscrowRateManager](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189#code): permissionless `harvest()` accrues governance-configured annual rates (6.20% GDADF, 11.25% New Silver, 6.77% New Silver 2 Senior, 7.51% Genesis, 6.05% FalconX), then refreshes `lastUpdatedAt`. The same parameter authority can use `governanceUpdateTotalAssets` to override a value. All five timestamps are October 19 at 13:31:23 UTC; this proves recent accounting execution, not custodian confirmation. Reserve evidence now differs by position:

| Position | Book | Evidence | Reconciliation |
|---|---:|---|---|
| Fasanara GDADF | $21.34M | Onchain [mGLO](https://etherscan.io/address/0x1dd91a111606382b77a917633ed90feaf25e0f76) holding and Midas price feed; [August fund factsheet](https://github.com/InfiniFi-Labs/documents/blob/master/fasanara/gdadf-nav/GDADF%20August%202026%20Factsheet.pdf) | Escrow holds 12,043,884.53 mGLO plus a pending redemption of 7,457,000.29 mGLO, worth $18.85M–$19.22M at Midas's price; the book is **$2.1M–$2.5M higher**. **TODO:** InfiniFi explanation |
| Fasanara Genesis | $2.62M | [Monthly InfiniFi position report](https://github.com/InfiniFi-Labs/documents/blob/master/fasanara/genesis-nav/Gensis%20Fasanara%20Report%20August%202026.pdf) drawn from the administrator statement (August 2026) | August 31 balance $2,552,338.45 vs escrow book $2,591,476.08 that day (book +1.5%) |
| New Silver (two escrows) | $8.43M | [Monthly fund-level update](https://github.com/InfiniFi-Labs/documents/blob/master/new-silver/New%20Silver%20Update%20Aug.pdf) (August 2026: $43.1M portfolio, zero overdue loans) | No InfiniFi position statement |
| FalconX | $2.03M | None | None |

The [InfiniFi documents repository](https://github.com/InfiniFi-Labs/documents) is maintained by InfiniFi. The Genesis report is InfiniFi-prepared rather than the administrator's own statement, and the GDADF factsheet describes the fund (USD 1.3bn AUM; KPMG auditor, JTC administrator), not InfiniFi's holding. The GDADF position is now independently observable onchain through Midas, which is why the valuation gap above can be measured. The configured Genesis rate (7.51%) exceeds the fund's reported 2.03% net 2026 year-to-date return through August, so the escrow book drifts above NAV between reconciliations. Counterparty names are disclosed, but current custody and recoverability of the New Silver and FalconX claims remain **TODO**. This is the basis of the Collateralization 4.0 and Provability 3.5 scores.

## Liquidity Risk

- **iUSD:** BeforeRedeemHook draws from LIQUID farms in the redemption transaction. Current reported capacity is **$10.60M**; each funded liquid farm's `liquidity()` equals its assets and none is paused. The $0.001309 PROTOCOL float is not the exit buffer. Cap provides ~60% of immediate capacity, Aave ~30% and Spark ~10%.
- **Liquid capital:** locked liUSD cannot exit instantly, so the relevant comparison is iUSD that can redeem now: siUSD-held iUSD ($50.95M) plus unlocked iUSD ($0.38M), $51.33M in total. The buffer covers **20.6%** of that liquid capital (20.8% of siUSD-held iUSD alone, 15.9% of TVL). siUSD withdrawal to iUSD is ERC-4626 with no cooldown; redeeming that iUSD to USDC uses the same finite buffer.
- **liUSD:** locked positions/early exits follow the UnwindingModule path; $1.89M iUSD is in unwind.
- **Queue:** `queueLength()`, `totalEnqueuedRedemptions()` and `totalPendingClaims()` all read zero; RedeemController is unpaused. No queue events occur in the incremental scan. Prior same-block redemptions demonstrate transaction mechanics, not reserve quality or future notice-period settlement.

| Availability / notice | Value | Share | Conditions |
|---|---:|---:|---|
| Immediate | $10.60M | 15.9% | Cap, Aave V3, Spark underlying liquidity and no pause |
| 7-day horizon | $17.78M | 26.7% | fxSAVE $8.09M, Monad $4.11M, New Silver 2 Senior $3.20M, FalconX $2.03M and Base $0.343M in L1 books; requires keeper actions/counterparty return/bridge settlement |
| 28-day notice | $23.96M | 36.0% | GDADF + Genesis, both Fasanara exposures; GDADF also has a pending Midas redemption request for 7,457,000.29 mGLO |
| 56-day notice | $5.22M | 7.8% | New Silver |
| Fixed maturity (Dec 10, 2026) | $9.02M | 13.5% | Pendle PT-reUSD; earlier exit requires a market sale of the PT |

These rows are disjoint buckets, not guaranteed cumulative cash receipts. Every funded RWA farm and the Pendle farm report zero immediate liquidity. Base's underlying vault `maxWithdraw(farm)` is also zero at its snapshot, as is the Monad August USDC V2 vault's `maxWithdraw(farm)`. Correlated exits above the liquid buffer require replenishment or the FIFO queue; reserve or counterparty failure can prevent eventual payment entirely.

**Secondary markets:** the snapshot [Curve iUSD/USDC pool](https://etherscan.io/address/0x2E2d6C119bdF226C420cB40E3B9fC9689cF5986e) holds 3,864.26 iUSD and 4,175.86 USDC. `get_dy` quotes **998.13 USDC for 1,000 iUSD** and **4,167.24 USDC for 10,000 iUSD** (~58.3% shortfall at $10K). The separately timed [Dexscreener iUSD feed](https://api.dexscreener.com/token-pairs/v1/ethereum/0x48f9e38f3070AD8945DFEae3FA70987722E3D89c) reports ~$8.04K liquidity and $104 daily volume. Its [siUSD feed](https://api.dexscreener.com/token-pairs/v1/ethereum/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) lists a Balancer pool with no reported depth and zero volume; depth is **TODO**, so no meaningful market exit at size is established. Do not assume siUSD has no pair or treat these feeds as exhaustive venue coverage.

## Centralization & Control Risks

### Governance

Core roles and the two timelocks define the enforceable governance path. `FarmRegistry.addFarms` and `removeFarms` require `PROTOCOL_PARAMETERS`; the registry does not itself enforce a liUSD vote. The role holders and delays below are verified at the snapshot.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/8 threshold**, 8 EOA signers (`getOwners()` / `getThreshold()`). Nonce 682. Four signers also hold the timelock `EXECUTOR_ROLE` and two hold `PAUSE` directly; execution only follows a scheduled, delayed proposal.

- **Timelocks**: Both are custom `Timelock.sol` extending OZ TimelockController. They override `hasRole()` to delegate role checks to the central `InfiniFiCore` contract. Their default-admin path is renounced through Core; privileged roles remain mutable through Core governance.

  - **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — `getMinDelay()` returns 604,800s (verified 2026-10-19).
  - **Short Timelock (24 hours)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` returns **86,400s (24 hours)** (verified 2026-10-19). Parameter, oracle and farm-add/remove actions have a 24-hour early-warning window.

  **Timelock-controlling roles on InfiniFiCore** (verified by enumerating `getRoleMember()`, 2026-10-19):

  | Role | Holders |
  |------|---------|
  | PROPOSER_ROLE | 1: multisig (4/8 required to schedule) |
  | CANCELLER_ROLE | 1: multisig (4/8 required to cancel) |
  | EXECUTOR_ROLE | **6**: four Safe signers + deployer EOA ([`0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22`](https://etherscan.io/address/0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22)) **+ the multisig itself** (the multisig can execute its own scheduled proposals) |

  Governance flow: **Multisig proposes (4/8) → Timelock delay → Any 1 of 5 executor EOAs or the multisig itself triggers execution.**

- **GOVERNOR role holders** (verified via `getRoleMemberCount(keccak256("GOVERNOR"))` = 2):
  - Long Timelock ([`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9)) — full GOVERNOR scope behind 7-day delay
  - FluidRewardsClaimer ([`0xD0ec80032C0da717BD78B9569321D9069365241E`](https://etherscan.io/address/0xD0ec80032C0da717BD78B9569321D9069365241E)) — narrowly scoped to claiming Fluid rewards
  - Deployer EOA has renounced GOVERNOR. **DEFAULT_ADMIN_ROLE has 0 holders** on Core (verified).
  - MinorRolesManager holds no roles on Core; minor-role grants go through the multisig (which holds MINOR_ROLES_MANAGER) or the Long Timelock.

- **Actions by timelock tier**:

    **Long Timelock (7 days) — GOVERNOR role (plus PROTOCOL_PARAMETERS, PAUSE, MINOR_ROLES_MANAGER):**
    enableBucket, setMaxLossPercentage, setAddress (gateway), setAfterMintHook, setBeforeRedeemHook, setYieldSharing, enableAsset, disableAsset, setLendingPool, setSafeAddress, emergencyAction, proxy upgrades (owns ProxyAdmin), privileged role grants/revokes (operational role admins are described below).

    **Short Timelock (24 hours) — PROTOCOL_PARAMETERS role:**
    setBucketMultiplier, setMinAssetAmount, setSafetyBufferSize, setPerformanceFeeAndRecipient, setLiquidReturnMultiplier, setTargetIlliquidRatio, setCap, setMaxSlippage, addFarms, removeFarms, setEnabledRouter, setPendleRouter, setCooldown, setAssetRebalanceThreshold.

    **Short Timelock (24 hours) — ORACLE_MANAGER role:**
    setOracle, setPrice.
    Verified onchain: ORACLE_MANAGER has 5 holders — Short Timelock, Accounting ([`0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3`](https://etherscan.io/address/0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3)), YieldSharing proxy ([`0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b`](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b)), OracleFactory ([`0xA2b300C5D0e9250F646B20ec924efaD36d19Ed91`](https://etherscan.io/address/0xA2b300C5D0e9250F646B20ec924efaD36d19Ed91)), and Long Timelock.

    **Multisig WITHOUT timelock** (the multisig directly holds these roles on InfiniFiCore):
    | Role | Capability |
    |------|-----------|
    | UNPAUSE (2 holders: multisig + EmergencyWithdrawal) | Unpause any paused contract |
    | EMERGENCY_WITHDRAWAL (1 holder: multisig) | Move funds from farms to predefined safe address, deprecate farms |
    | MANUAL_REBALANCER (4 holders: multisig + Short Timelock + LiquidationFarm + [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4)) | Rebalance funds between whitelisted farms |
    | FARM_SWAP_CALLER (4 holders: multisig + EOA [`0x73455e5Fc7e4cbfDe65A72Ff17f76393DC6A2cbB`](https://etherscan.io/address/0x73455e5Fc7e4cbfDe65A72Ff17f76393DC6A2cbB) + Short Timelock + keeper EOA [`0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a`](https://etherscan.io/address/0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a)) | Trigger swap operations in farms |
    | MINOR_ROLES_MANAGER (2 holders: multisig + Long Timelock) | Grant/revoke operational roles including PAUSE, UNPAUSE, PERIODIC_REBALANCER, FARM_SWAP_CALLER and OUTLAND_KEEPER |
    | CANCELLER_ROLE / PROPOSER_ROLE | Cancel/propose timelock actions |
    | PAUSE (multisig holds it directly) | Emergency pause |

- **PAUSE role holders** (verified via `getRoleMemberCount(keccak256("PAUSE"))` = **8**):
  - [`0x383965940c950008a4B67BfaA477Fdf6AC91a7F7`](https://etherscan.io/address/0x383965940c950008a4B67BfaA477Fdf6AC91a7F7) (multisig signer #8)
  - [`0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685`](https://etherscan.io/address/0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685) (multisig signer #6)
  - [`0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148`](https://etherscan.io/address/0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148) (EOA)
  - [`0x0652412777f0c1F46b1164d5cdF3295Bdf43F2f2`](https://etherscan.io/address/0x0652412777f0c1F46b1164d5cdF3295Bdf43F2f2) (EOA)
  - [`0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9`](https://etherscan.io/address/0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9) (EmergencyWithdrawal contract)
  - [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) (Long Timelock)
  - [`0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56`](https://etherscan.io/address/0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56) (MaturedFarmCleaner contract)
  - [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) (Multisig)

- **Other onchain role membership** (verified 2026-10-19 by enumerating `keccak256` of each role name in `CoreRoles`):

  | Role | Count | Notable holders |
  |------|------:|-----------------|
  | ENTRY_POINT | 2 | Gateway proxy, MigrationController |
  | RECEIPT_TOKEN_MINTER | 6 | YieldSharing, MintController, PLSmoother, MigrationController, Base OutlandVault, Monad OutlandVault |
  | RECEIPT_TOKEN_BURNER | 9 | siUSD, UnwindingModule, LockingController, YieldSharing, RedeemController, PLSmootherHelper, PLSmoother, both OutlandVaults |
  | LOCKED_TOKEN_MANAGER | 2 | LockingController; INFI LockingController [`0x68Afd386D2A882D3aFCBfC1586AE722568052FF6`](https://etherscan.io/address/0x68Afd386D2A882D3aFCBfC1586AE722568052FF6) |
  | GOVERNANCE_TOKEN_ADMIN / MINTER / BURNER | 1 each | 1-of-2 Safe [`0x579B18E60d0245c0F66Fa9463610b15E226Ae8FD`](https://etherscan.io/address/0x579B18E60d0245c0F66Fa9463610b15E226Ae8FD); GOVERNANCE_TOKEN_ADMIN administers all three |
  | TRANSFER_RESTRICTOR | 1 | AllocationVoting |
  | FARM_MANAGER | 5 | ManualRebalancer, AfterMintHook, BeforeRedeemHook, EmergencyWithdrawal, Short Timelock |
  | FINANCE_MANAGER | 4 | YieldSharing, LiquidationFarm, PLSmootherHelper, [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4) (redeployment, PROTOCOL-type, $0) |
  | FARM_SWAP_CALLER | 4 | Multisig, EOA [`0x73455e5Fc7e4cbfDe65A72Ff17f76393DC6A2cbB`](https://etherscan.io/address/0x73455e5Fc7e4cbfDe65A72Ff17f76393DC6A2cbB), Short Timelock, keeper EOA [`0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a`](https://etherscan.io/address/0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a) |
  | ACCRUE_YIELD | 5 | Deployer EOA [`0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22`](https://etherscan.io/address/0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22), multisig, keeper EOA [`0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a`](https://etherscan.io/address/0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a), [`0x0220646F0acdE22b6D46E69B0f65a6362B0dfeb0`](https://etherscan.io/address/0x0220646F0acdE22b6D46E69B0f65a6362B0dfeb0), Short Timelock |
  | PERIODIC_REBALANCER | 1 | EOA [`0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a`](https://etherscan.io/address/0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a) (keeper bot) |
  | PROTOCOL_PARAMETERS | 3 | Short Timelock, Long Timelock, MaturedFarmCleaner |
  | DEFAULT_ADMIN_ROLE | **0** | — (renounced) |

- **emergencyAction bypass analysis**: The `Timelock.sol` contract **overrides emergencyAction to a no-op**, preventing any GOVERNOR holder from using it to bypass timelock delays. This is a deliberate safety mechanism confirmed in source code.

The Safe owner address set and threshold exactly match the July 29 baseline recorded in this report; all eight owners have no contract code at the snapshot. Both timelocks delegate proposer, executor and canceller checks to Core. Core's `DEFAULT_ADMIN_ROLE` remains empty, and privileged role administration remains `GOVERNOR`, except the operational roles delegated to `MINOR_ROLES_MANAGER` and the self-administered governance-token roles below.

**Governance-token setup:** a Long Timelock batch at block 26,133,272 ([transaction](https://etherscan.io/tx/0xb7ad91438944f434518dc87ccbac6595b0231dce828205cddaf8d8a433fdf48a)) registered the verified [INFI GovernanceToken](https://etherscan.io/address/0xf40C07D7cd45F291B93cA674Db66a15C8a98957E#code) and a second, INFI-denominated [LockingController](https://etherscan.io/address/0x68Afd386D2A882D3aFCBfC1586AE722568052FF6#code) with 4/8/13/26-week buckets. It granted that controller `LOCKED_TOKEN_MANAGER` and granted `GOVERNANCE_TOKEN_ADMIN`, `GOVERNANCE_TOKEN_MINTER` and `GOVERNANCE_TOKEN_BURNER` to a 1-of-2 Safe. `GOVERNANCE_TOKEN_ADMIN` administers all three roles, so that Safe can change INFI mint authority without a timelock. At the snapshot INFI supply is zero, the new controller holds no iUSD, its `unwindingModule` is an immutable INFI module, and Gateway's `lockingController` still points to the iUSD controller. INFI is therefore not part of iUSD backing or the liUSD loss waterfall. `LOCKED_TOKEN_MANAGER` is a shared Core role that also guards the iUSD UnwindingModule; the verified new controller has no code path to it. Any future use of INFI in allocation voting or loss absorption requires reassessment.

**Outland roles:** `OUTLAND_PORTAL` has one holder, PortalHub [`0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61`](https://etherscan.io/address/0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61), administered by `GOVERNOR`. `OUTLAND_KEEPER` has three holders: the Team Safe, [`0xDEc0de363DB32d5111AA6915d87f35A841201E6a`](https://etherscan.io/address/0xDEc0de363DB32d5111AA6915d87f35A841201E6a), and Short Timelock; its admin is `MINOR_ROLES_MANAGER`, allowing the Safe to change these operational holders without a timelock. `OUTLAND_KEYVALUE_SENDER` is [`0x2C5d2eF06B943262e51d9cEe696a914bf88B0498`](https://etherscan.io/address/0x2C5d2eF06B943262e51d9cEe696a914bf88B0498); `BRIDGE_INITIATOR` is Gateway. Both are administered by `GOVERNOR`.

### Programmability

The liability ladder and redemption hook execute onchain, while allocation, RWA valuation inputs and cross-chain message processing require privileged operators. Five RWA books use the same governance-configured rate manager for 51.7% of reported assets; the Pendle farm accrues PT value from the Pendle oracle and a governance-set maturity discount. Automatically increasing a receivable does not prove realized profit. Oracles and escrow rate/override controls are behind the 24-hour Short Timelock; Gateway, YieldSharing and PortalHub upgrades are behind the 7-day Long Timelock.

Outland accounting additionally depends on authenticated bridge reports and keeper processing. PortalHub `bridgePaused() = true` blocks user bridge initiation; it does **not** block `receiveMessage`, and `processMessage` checks the main pause and keeper role rather than the bridge pause. The portal and both connectors are unpaused, so inbound native-mint processing remains an authorized path. See verified [PortalHub / PortalBase source](https://etherscan.io/address/0xe66110973b9acc45204b4b1d0c59370466dd686b#code).

### External Dependencies

The dominant issuer is **Fasanara (36.0%)**, spread over GDADF (32.1%) and Genesis (3.9%); these are correlated exposures, not independent diversification. GDADF is now held through Midas mGLO, so it also depends on the Midas token, its price feed and its redemption vault. New Silver contributes 12.7% across two escrows (7.8% and 4.8%) and FalconX 3.0%. Names and strategy descriptions are disclosed in the [current vault disclosures](https://docs.infinifi.xyz/vaults); legal enforceability and position-level reserve evidence for New Silver and FalconX are unresolved. The Pendle PT-reUSD farm (13.5%) adds Pendle market/oracle dependencies and Re Protocol's reUSD, described by the [protocol API](https://eth-api.infinifi.xyz/api/protocol/data) as the senior allocation into a reinsurance portfolio; Re Protocol reserve quality is **TODO**. f(x) Protocol (12.2%) adds fxSAVE/fxUSD base-pool, oracle, upgrade and unstaking dependencies. Cap (9.6%), Aave V3 (4.8%) and Spark/Sky (1.6%) support the liquid buffer. CoW settlement is used by the f(x) and Pendle swap paths. Morpho-stack exposure is the Base farm and the Monad August USDC V2 position ($2.02M, 3.0%); the Ethereum Steakhouse vault is unfunded. The Monad farm also uses a Monad Aave V3 pool ($2.09M, 3.1%).

**LayerZero OFT route — lock model:** Ethereum siUSD adapter [`0x5f2106bb2a5aba6a783dbf29c8d3b09c175bc3c0`](https://etherscan.io/address/0x5f2106bb2a5aba6a783dbf29c8d3b09c175bc3c0) holds **3,186.529708 siUSD** (~$3,490.90 iUSD at the snapshot rate); iUSD adapter [`0xdd1cb2e1aa483e1d94e3e22e70cfbb634fcb3005`](https://etherscan.io/address/0xdd1cb2e1aa483e1d94e3e22e70cfbb634fcb3005) holds **4.329349 iUSD**. Both are owned by the Team Safe, use [EndpointV2](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c), and have Katana peers [siUSD](https://explorer.katanarpc.com/address/0x68943c066747690ecDAEB027fa722B090ee6F92D) / [iUSD](https://explorer.katanarpc.com/address/0x9Fa1202516916534Ade66962Ee91410d559f1C10). Neither has native mint authority. The **Katana→Ethereum escrow-release** receive configs for both adapters require **4-of-4 DVNs: LayerZero Labs, Horizen, Canary and Deutsche Telekom**, with **20 confirmations** and no optional verifier set. This measures that inbound route only; remote supply and other OFT routes are not asserted current.

**Outland route — CCIP native mint + CCTP transport:** Ethereum PortalHub registers Base and Monad vaults. Its Base [ConnectorCCIP](https://etherscan.io/address/0x65805D838a3504d283B92a623081E4b8c5583502#code) authenticates the CCIP router and configured Base peer [`0x386DfFb5a31588aB56Df20C54Ec649F3B554362C`](https://basescan.org/address/0x386DfFb5a31588aB56Df20C54Ec649F3B554362C). The [CCTP/CCIP connector](https://etherscan.io/address/0x3373784A7a52A07F9339aA8F60403420cC602c52#code) configures a Monad peer [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://monadscan.com/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7), CCTP domain 15 and [TokenMessengerV2](https://etherscan.io/address/0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d). CCIP transports remote asset/supply data; a keeper processes that accepted payload and OutlandVault can mint **canonical Ethereum iUSD**. CCTP separately burns/mints underlying USDC and does not itself authorize native iUSD minting. The configured connectors are alternatives by chain, not a two-bridge quorum.

The Base OutlandVault's last L1 mirror reports $342,542.25 assets, 7,086.078765 iUSD and 306,008.118687 siUSD shares at October 19, 05:03:35 UTC. At the matching Base snapshot, [Accounting](https://basescan.org/address/0x2ED079F04211baDA1a4e53F01782217334Cc28ce) reports **$342,557.74**, with 7,084.078765 iUSD and 306,008.118687 siUSD shares. The values differ because the mirror is an earlier report, not an exact real-time reconciliation. The Base [ERC4626Farm](https://basescan.org/address/0x127066E1982940c33fDC882D9c138296AB15F97f) holds 327,842.504723 shares of [Steakhouse Prime USDC](https://basescan.org/address/0xbeef0e0834849aCC03f0089F01f4F1Eeb06873C9); farm `assets()` returns $342,557.74 and `maxWithdraw` returns zero. This small accounted exposure does not bound mint authority.

Monad's L1 mirror reports **$4,110,614.47** of assets, 504.8491 iUSD and 2,804,684.417520 siUSD shares at October 19, 08:10:47 UTC. At the matching Monad block, verified [AccountingL2](https://monadscan.com/address/0x386DfFb5a31588aB56Df20C54Ec649F3B554362C#code) reports **$4,110,795.34** (LIQUID $2,087,679.51, MATURITY $2,023,115.83), `receiptTokenTotalSupply()` 504.849100 iUSD and `stakedTokenTotalSupply()` 2,804,684.417520 siUSD, matching the mirrored supplies exactly. The remote [FarmRegistry](https://monadscan.com/address/0xA7845e48995A974bD1d130F4CA8C61fA47Fb4107#code) lists two farms: [AaveV3Farm](https://monadscan.com/address/0xA171c4a6e0d73DB80911A0C003508fB235F29b63#code) holding 2,087,679.51 [aMonUSDC](https://monadscan.com/address/0x35a73BAcb179d3740395A3ceCc87FF2e581d6042) with full liquidity, and [SwapFarmV2WithMaturity](https://monadscan.com/address/0x1330902050dB4edAc0D9D8ca33FdAb5DbE986c9c#code) holding 1,955,802.96 shares of [August USDC V2](https://monadscan.com/address/0x80017bf0f793ebbe9679cd61ff0e395b62cabb59) (`convertToAssets` $2,023,116.54, `maxWithdraw` zero; about 22.4% of that vault's $9.04M `totalAssets`). The Monad [PortalOutpost](https://monadscan.com/address/0x7092A43aE5407666C78dBEA657a1891f42b3dFcc) proxy and its CCTP/CCIP [connector](https://monadscan.com/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7#code) are source-verified; the outpost is unpaused and its `bridgePaused()` is false. The L1 mirror reconciles to remote accounting within $180.87 (0.004%). August's underlying allocations, curator controls and Monad governance are not separately assessed. [Bridge index](https://github.com/yearn/risk-score/blob/master/src/data/bridges.json) records LayerZero as lock, CCIP as mint and CCTP as transport.

## Operational Risk

- **Team**: InfiniFi Labs. Known team. Key contributors identified via GitHub:
  - **eswak (Erwan Beauvois)**: Lead architect. Former European Space Agency engineer, Fei Protocol core dev (2021-2022), Ethereum Credit Guild core dev (2022-2024). Toulouse, France.
  - **RobAnon (@RobAnon94)**: Contributor.
  - **nikollamalic (Nikola Malic)**: Developer.
  - No public team page. GitHub org has zero public members listed.
- **Funding**: $3M Pre-Seed (Feb 2025) led by Electric Capital, with participation from New Form Capital, Axiom, Kraynos Capital, Sam Kazemian (Frax Finance founder), Defi Dad.
- **Legal Structure**: The linked GDADF holding statement names infiniFi Foundation. **TODO:** jurisdiction, enforceable investor rights, custody arrangements and the entity responsible for each escrow agreement.
- **Documentation**: Technical documentation in the GitHub README and [public docs](https://docs.infinifi.xyz/) describes architecture, vaults and security reviews. The public security page's Safe description is stale relative to the onchain owner set; current reserve and deployment-specific audit evidence remains incomplete.
- **Communication**: Twitter/X at [@infinifilabs](https://x.com/infinifilabs). No public governance forum found (not on Snapshot, Tally, or Commonwealth).
- **Incident Response**: No documented incident response plan found. Emergency capabilities exist via EMERGENCY_WITHDRAWAL role (multisig, no timelock) and system pause (8 PAUSE-role holders — multisig, Long Timelock, EmergencyWithdrawal/MaturedFarmCleaner contracts, and four individual EOAs).

## Monitoring

### Contracts to Monitor

| Contract | Address | Why Monitor Directly |
|----------|---------|---------------------|
| **Long Timelock** | [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) | All critical governance actions (GOVERNOR role) |
| **Short Timelock** | [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) | Parameter changes (PROTOCOL_PARAMETERS, ORACLE_MANAGER) |
| **EmergencyWithdrawal** | [`0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9`](https://etherscan.io/address/0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9) | Multisig-direct, no timelock |
| **ORACLE_IUSD** | [`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`](https://etherscan.io/address/0x8ABc952f91dB6695E765744ae340BC5eA4B344c1) | De-peg event (autonomous, triggered by loss socialization) |
| **LockingController** | [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) | First-loss buffer for liUSD holders. `LossesApplied` = protocol taking damage. Auto-pauses if losses exceed `maxLossPercentage` threshold. |
| **siUSD** | [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) | `VaultLoss` = losses exceeded liUSD first-loss buffer, now hitting siUSD stakers |
| **UnwindingModule** | [`0x7092A43aE5407666C78dBEa657a1891f42b3dFcc`](https://etherscan.io/address/0x7092A43aE5407666C78dBEa657a1891f42b3dFcc) | Settles liUSD early exits over time. `CriticalLoss` = a loss passed to `applyLosses()` exceeds the module's `totalReceiptTokens`; the burn is capped and unwinding positions are wiped out. |
| **InfiniFiCore** | [`0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490`](https://etherscan.io/address/0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490) | All role grants, revocations and admin changes, including Safe-direct operational roles |
| **Team Multisig** | [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) | Proposes all timelock actions and holds non-timelocked operational roles |
| **FarmRegistry** | [`0xF5f2718708f471e43968271956CC01aaA8c46119`](https://etherscan.io/address/0xF5f2718708f471e43968271956CC01aaA8c46119) | Farm additions/removals change the backing set |
| **RWAEscrowRateManager** | [`0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189) | Sets accrual rates and can override RWA book values for 51.7% of TVL |
| **GDADF escrow router** | [`0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E`](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E) | Holds the mGLO position and makes whitelisted external calls |
| **Midas mGLO redemption vault** | [`0x55f3ab43e49ffb6b1fff5e2b310c21278bdaf0f5`](https://etherscan.io/address/0x55f3ab43e49ffb6b1fff5e2b310c21278bdaf0f5) | Pending GDADF redemption request #1 (7,457,000.29 mGLO → USDC) |
| **Midas mGLO data feed** | [`0x98bd3a24d3998EF96b12d896045EaCA7955Ea963`](https://etherscan.io/address/0x98bd3a24d3998EF96b12d896045EaCA7955Ea963) | Independent price for the GDADF position; aggregator changed on October 19, 2026 |
| **PortalHub** | [`0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61`](https://etherscan.io/address/0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61) | Accepts remote reports that drive native iUSD mints |
| **Pendle PT-reUSD farm** | [`0xe9E44C0A68C49aDe51CdA5e027909C5996B5c71a`](https://etherscan.io/address/0xe9E44C0A68C49aDe51CdA5e027909C5996B5c71a) | 13.5% of TVL; December 10, 2026 maturity and governance-set PT discount |

Monitor timelock schedules for privileged configuration and upgrades, and monitor Core, farms and PortalHub directly for operational changes. Core's minor-role grants, keeper processing, rebalancing, accrual and pauses can occur without a timelock event. Timelock monitoring alone does not cover these paths.

### Governance Monitoring (Timelocks + Multisig)

Decode timelock events to identify configuration and upgrade actions. Also monitor Core's `RoleGranted`, `RoleRevoked` and `RoleAdminChanged`: operational roles can change through the Safe directly, and contract-held roles have their own execution paths.

| Contract | Event | Significance |
|----------|-------|-------------|
| **Long/Short Timelock** | `CallScheduled(bytes32 id, uint256 index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)` | New governance action proposed — decode `data` to understand what will change. Early warning window (7d or 24h). |
| **Long/Short Timelock** | `CallExecuted(bytes32 id, uint256 index, address target, uint256 value, bytes data)` | Governance action executed — verify expected outcome |
| **Long/Short Timelock** | `Cancelled(bytes32 id)` | Scheduled action cancelled — may indicate contested governance |
| **Long/Short Timelock** | `MinDelayChange(uint256 oldDuration, uint256 newDuration)` | Timelock delay changed — reduction is critical |
| **InfiniFiCore** | `RoleGranted` / `RoleRevoked` / `RoleAdminChanged` | Any change to minters, burners, `GOVERNOR`, `PROTOCOL_PARAMETERS`, `OUTLAND_*`, `LOCKED_TOKEN_MANAGER` or `GOVERNANCE_TOKEN_*` is critical; operational-role changes are high |
| **Gateway / YieldSharing / PortalHub proxies** | `Upgraded(address implementation)` | Implementation change; must match a Long Timelock execution |
| **Team Multisig** | `AddedOwner` / `RemovedOwner` / `ChangedThreshold` | Signer-set or threshold change |
| **FarmRegistry** | `FarmsAdded(uint256,uint256,address[])` / `FarmsRemoved(uint256,uint256,address[])` | Backing set changed; verify source, dependencies and graph |
| **Accounting** | `OracleSet` / `PriceSet` | Asset oracle or price changed |
| **RWAEscrowRateManager** | `RateUpdated(uint256,address,uint256)` / `KeeperSet(uint256,address)` | Accrual rate or keeper changed for an RWA escrow |
| **Pendle PT-reUSD farm** | `MaturityPTDiscountUpdated(uint256,uint256)` | Valuation discount for 13.5% of TVL changed |

### Non-Timelocked Events — Immediate Alert

These events bypass the timelock and can be triggered directly by the multisig or individual role holders.

| Contract | Event | Triggered By | Significance |
|----------|-------|-------------|-------------|
| **Any CoreControlled** | `Paused(address account)` | 8 PAUSE-role holders (multisig + Long Timelock + EmergencyWithdrawal + MaturedFarmCleaner + 4 individual EOAs) | Emergency pause — no multisig or timelock required when triggered by an EOA pauser |
| **Any CoreControlled** | `Unpaused(address account)` | Multisig (UNPAUSE, no timelock) | System resumed |
| **EmergencyWithdrawal** | `EmergencyWithdraw(uint256 timestamp, address farm, uint256 amount)` | Multisig (no timelock) | Emergency fund extraction from farm |
| **RWA escrows (all five)** | `TotalAssetsUpdated(uint256,address,uint256,uint256)` | Parameter authority via `governanceUpdateTotalAssets`, or keeper accrual | Book-value override; alert when a change exceeds the configured accrual for the elapsed time |
| **RWA escrows (all five)** | `TokensSent` / `TokensWithdrawn` / `CallSuccess` | Escrow operators | Cash or token movement out of an RWA escrow; reconcile against book value |
| **GDADF escrow router** | `WhitelistUpdated(uint256,address,bool)` | Escrow admin | External-call target allowlist changed |
| **Midas mGLO redemption vault** | `ApproveRequest` / `SafeApproveRequest` / `RejectRequest` for request #1 | Midas | GDADF redemption settled or rejected; check USDC received against book |
| **INFI GovernanceToken** | `Transfer(from = 0x0)` | 1-of-2 Safe (no timelock) | Governance-token mint |

### Protocol Health Events — Immediate Alert

Autonomous events triggered by protocol state, not governance actions.

| Contract | Event | Significance |
|----------|-------|-------------|
| **ORACLE_IUSD** | `PriceSet(uint256 timestamp, uint256 price)` | iUSD price changed — price below 1.0 = de-peg (loss socialization to iUSD holders) |
| **LockingController** | `LossesApplied(uint256 timestamp, uint256 amount)` | First-loss tranche consuming — liUSD holders taking losses |
| **siUSD** | `VaultLoss(uint256 timestamp, uint256 epoch, uint256 assets)` | Losses cascading past first-loss tranche to siUSD holders |
| **UnwindingModule** | `CriticalLoss(uint256 timestamp, uint256 amount)` | Loss applied to unwinding liUSD positions exceeds the module's `totalReceiptTokens` (loss capped; unwinding positions fully slashed) |

### Key State to Poll

- **TVL**: `Accounting.totalAssetsValue()`, cross-checked against DefiLlama.
- **Instant-exit capacity**: `Accounting.totalAssetsValueOf(1)` (the LIQUID bucket). This — not `totalAssetsValueOf(0)`, which is controller float and sits near zero by design — is the instant-redemption capacity; compare it with liquid capital (below) and TVL.
- **Queue state**: `RedeemController.queueLength()`, `totalEnqueuedRedemptions()`, `totalPendingClaims()`. Any non-zero value signals a material change from the observed no-queue record.
- **Notice-period concentration**: per-farm `assets()` and `duration()` where available; use `maturity() - block.timestamp` for FxSaveFarm and `maturityOffset()` for OutlandFarm. Track 7 / 28 / 56-day notice exposure.
- **Escrow accounting**: poll `lastUpdatedAt()`, `totalAssets()`, `liquidity()` and USDC balance on the five funded escrows listed in Appendix A, plus `RWAEscrowRateManager.rates(escrow)`. A timestamp older than 48 hours indicates an accrual/keeper outage; a fresh timestamp does **not** prove reserves. Reconcile new documents in the [InfiniFi documents repository](https://github.com/InfiniFi-Labs/documents) to book value monthly.
- **GDADF onchain reconciliation**: daily, value the escrow's `mGLO.balanceOf(escrow)` plus pending Midas redemption requests at `MGloDataFeed.getDataInBase18()`, and compare with `totalAssets()`. Alert if the gap widens beyond the current 9.9%–11.7% or the feed's `aggregator()` changes. Track request #1 via `redeemRequests(1)` (status 0 = pending).

- **First-loss coverage**: poll `LockingController.totalBalance()`, its iUSD balance and the UnwindingModule iUSD balance daily. Compare the $15.24M notional with the largest single position (GDADF $21.34M), the second largest (Pendle $9.02M), Fasanara's combined $23.96M and the $34.42M total RWA book. Alert if any position other than GDADF exceeds the buffer, or if coverage falls below 50% of Fasanara or 40% of the RWA book. Values in unwind may leave the loss buffer as exits complete.
- **Liquid-capital coverage**: daily, divide `Accounting.totalAssetsValueOf(1)` by iUSD supply less LockingController and UnwindingModule balances (currently 20.6%); alert below 15%.
- **Portal mint path**: monitor PortalHub `AssetsUpdateReceived`, `MessageQueued`, `MessageProcessed`, connector changes and upgrades; poll both OutlandVault `portalAssetsReport()` values and token balances hourly. Compare Base's live accounting and supplies with the last mirrored L1 report. Alert on an unexplained mint or report divergence, `bridgePaused()` changes, or Monad L1/remote divergence. The Monad L1 book is $4,110,614.47 at this snapshot and reconciles to Monad AccountingL2 ($4,110,795.34); re-verify remote state before further increases.
- **Pendle maturity**: poll the Pendle farm's `assets()`, `liquidity()`, `maturity()` and PT balance daily, and track the December 10, 2026 maturity, the PT→reUSD→USDC unwind and reUSD redemption terms.
- **Governance token**: alert on any INFI mint, role change for `GOVERNANCE_TOKEN_*` or `LOCKED_TOKEN_MANAGER`, deposits into the INFI LockingController, or any change to Gateway's `lockingController` address.
- **Controls and liquidity**: poll both timelock delays, all six minters and their admins daily; alert immediately on changes. Treat LIQUID-bucket book value as a ceiling and cross-check per-farm `liquidity()` and `paused()` hourly. The three funded liquid farms report full liquidity at the snapshot; this is not a guarantee against future underlying pauses or utilization changes.

## Risk Summary

### Key Strengths

- Multiple established audits, formal verification, ongoing reviews and an active bounty; current implementation-specific coverage remains TODO.
- Same 4-of-8 Safe owner set, renounced Core default admin, 7-day upgrades and 24-hour parameter delay.
- $10.60M reported instant liquidity, 20.6% of liquid capital; 1,027 redemptions worth $51.89M since block 25,638,820 with no queue events.
- TVL up 35.8% over 30 days; first-loss buffer larger than every single position except GDADF.
- GDADF (32.1%) is now an onchain mGLO holding with a Midas price feed, and Genesis has monthly position reports.
- Registered farm book values reconcile exactly to Accounting; asset/share conversions and cross-chain report age are observable.

### Key Risks

- **RWA backing only partly reconciled:** $34.42M (51.7%) consists of keeper-accrued balances. GDADF's book is $2.1M–$2.5M above its Midas-priced mGLO holding, the Genesis book runs 1.5% above the administrator-derived balance, and New Silver and FalconX ($10.46M, 15.7%) have no position-level statement.
- **Issuer concentration:** Fasanara holds 36.0% of the book; the $15.24M first-loss notional covers 63.6% of that exposure and 71.4% of GDADF alone.
- **Native mint bridge path:** two OutlandVaults can mint iUSD using CCIP-sourced reports processed by an operational keeper. Current small remote allocations do not bound potential dilution.
- **Liquidity mismatch:** 84.1% of assets have operational/notice-period exits; the $10.60M buffer covers 20.6% of $51.33M liquid capital, and secondary-market depth is negligible at allocator sizes.
- **Pendle and f(x) positions:** 13.5% depends on Pendle PT-reUSD and Re Protocol until the December 10, 2026 maturity; 12.2% depends on fxSAVE/fxUSD solvency, oracles, upgrades, unstaking and swaps.
- **TVL volatility:** current TVL is 65.0% below the January peak; daily series moves include -10.5% on September 28→29 and +27.7% on October 8→9.
- **Evidence gaps:** GDADF book-to-mGLO reconciliation, New Silver and FalconX position statements, Re Protocol reserve quality, legal rights, deployed upgrade audit scope, and the Monad August USDC V2 vault's underlying allocations.

### Critical Risks

**Partial reserve reconciliation:** onchain accounting does not by itself verify reserve value for the RWA book. GDADF is now observable onchain through Midas, but its escrow book is **$2.1M–$2.5M (9.9%–11.7%) above** the Midas-priced mGLO holding and pending redemption. Genesis has monthly position reports. New Silver has fund-level updates only, and FalconX has none. Obtain an InfiniFi reconciliation of the GDADF gap and position-level holding/custody evidence for New Silver and FalconX by **January 14, 2027**, and review the legal claims. If that evidence is not produced by then, apply the unverifiable-reserves gate.

## Risk Score Assessment

### Critical Risk Gates

- [x] **Unverified contract source — PASSED:** assessed siUSD, all registered Ethereum farms, six Ethereum minters and the three material proxy implementations have verified source. Monad PortalOutpost, AccountingL2, connector and funded farms are also source-verified.
- [x] **No audit — PASSED:** reputable base-protocol audits exist; deployed Gateway V4/PortalHub/OutlandVault upgrade coverage is TODO.
- [x] **Unverifiable reserves — PASSED (conditional, deadline January 14, 2027):** 51.7% of the current book is keeper-accrued RWA value. GDADF (32.1%) is an onchain mGLO holding with a Midas price, though its book exceeds that value by $2.1M–$2.5M. Genesis (3.9%) has monthly InfiniFi-prepared position reports. New Silver (12.7%) has fund-level updates only, and FalconX (3.0%) has no statement. This is periodic and partly onchain evidence with material gaps, scored as Collateralization 4.0 and Provability 3.5 rather than the gate. If the GDADF reconciliation and position-level evidence for New Silver and FalconX are not produced by January 14, 2027, the gate applies (5.00, GATED). See Provability and Appendix A.
- [x] **Total centralization — PASSED:** 4-of-8 Safe and dual timelocks, with operational roles separately identified.

All gates pass; proceed to category scoring. Apply the reserves gate if current reserve evidence is not obtained by January 14, 2027.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Audits — 2.0:** established Spearbit/Cantina and Certora work, public competition and active bounty. **History — 2.0:** approximately 16 months live (score 2: 1–2 years), with TVL above the $50M score-2 scale criterion on 312 of the last 365 daily observations and at $66.58M now. No exploit or realized loss is recorded. Upgrade-specific audit scope remains unresolved.

**Score: 2.0/5** — (2.0 + 2.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance — 2.5:** proxy upgrades, minter grants and privileged role changes require the 4-of-8 Safe plus the 7-day Long Timelock; parameter, oracle and farm-registry changes require the Safe plus the 24-hour Short Timelock (timelock column: score 2). No EOA can change the protocol: EOA roles are limited to pausing, executing already-delayed proposals and keeper calls, and emergency withdrawal can only send funds to a governance-set safe address (privileged-roles column: score 2). The 4-of-8 threshold sits between the rubric's 3/5 and 5/9 rows (upgradeability column: score 3). The 24-hour parameter path also includes `governanceUpdateTotalAssets`, which can rewrite RWA book values, so the score stays above the 2.33 column average. Operational rebalancing, pausing and keeper powers are evaluated under Programmability. The INFI governance-token roles held by a 1-of-2 Safe have no path to iUSD backing and are not scored here.
- **Programmability — 3.5:** redemption mechanics and loss ordering execute onchain; 51.7% of book value relies on configured RWA accrual and governance overrides. Cross-chain reports additionally require CCIP authentication and keeper processing, with native minting based on reported remote supply/assets.
- **Dependencies — 4.0:** Fasanara concentration 36.0% (now via Midas mGLO), New Silver/FalconX exposure, Pendle PT-reUSD/Re Protocol 13.5%, f(x) 12.2%, Monad August USDC V2/Aave (6.2%), multiple liquid venues, and a native mint bridge path. Lower Fasanara concentration is offset by the larger reinsurance-backed PT dependency. Disclosure of counterparty names improves attribution but does not establish reserve quality.

**Score: 3.33/5** — (2.5 + 3.5 + 4.0) / 3 ≈ 3.33.

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization — 4.0:** book backing is 100.0050%, but 51.7% is offchain or tokenized RWA value. Where it can be checked, the book runs above independent value: GDADF by $2.1M–$2.5M against Midas's mGLO price, Genesis by 1.5% against the administrator-derived balance. New Silver and FalconX have no position-level reporting (opaque or infrequent reporting).
- **Provability — 3.5:** hybrid onchain/offchain. Onchain DeFi positions (about 48% of TVL) are fully verifiable; GDADF (32.1%) is an onchain mGLO holding priced by Midas; Genesis has monthly position reports drawn from the administrator; New Silver has monthly fund-level updates. Most RWA reporting is InfiniFi-published rather than direct custodian attestation, and FalconX has none, so the score sits between 3 and 4.

**Score: 3.75/5** — (4.0 + 3.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 3.0/5** — $10.60M reported immediate liquidity across three venues and an observed no-queue redemption record support functional exits. The buffer covers 20.6% of liquid capital (siUSD-held plus unlocked iUSD), but 84.1% of assets depend on non-instant exits, the Base and Monad August vaults have zero `maxWithdraw`, and no substantial secondary-market exit is established. Notice horizons do not guarantee cash. Reserve evidence is scored under Funds Management.

#### Category 5: Operational Risk (Weight: 5%)

**Score: 2.5/5** — established contributors, disclosed funding, useful technical docs and contracted monitoring. Current reserve evidence, legal enforceability, a public incident-response plan and deployment-specific upgrade review scope remain incomplete. The public security page's 4/7 Safe description differs from the verified 4/8 state, illustrating why mutable controls are checked onchain.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|---|---:|---:|---:|
| Audits & Historical | 2.00 | 20% | 0.400 |
| Centralization & Control | 3.33 | 30% | 0.999 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 3.00 | 15% | 0.450 |
| Operational Risk | 2.50 | 5% | 0.125 |
| **Final Score (rounded down)** | | | **3.09/5.0** |

### Risk Tier

**Final Risk Tier: MEDIUM RISK**

Approved with enhanced monitoring. Reserve evidence for the RWA book is only partly reconciled; failure to explain the GDADF gap and evidence the New Silver and FalconX positions by January 14, 2027 triggers the unverifiable-reserves gate.

## Reassessment Triggers

- **Time-based:** reassess within 30 days (November 18, 2026), or immediately when current reserve evidence becomes available.
- **Reserve-proof:** request an InfiniFi reconciliation of the GDADF book to its mGLO holding and pending redemption, plus position-level holding, custody and enforceable-claim evidence for New Silver and FalconX. Reassess immediately if the GDADF gap widens, the pending redemption is rejected, or a new statement shows a value below book. Apply the unverifiable-reserves gate (score 5.00, GATED) if it is not produced by **January 14, 2027**. A keeper timestamp or API label alone is insufficient.
- **Liquidity:** any nonzero queue/pending claims; reported liquid capacity below 5% of TVL for seven days; underlying liquid-farm pause or withdrawal restriction.
- **TVL:** >30% movement from $66.58M, or another >10% daily withdrawal wave.
- **Concentration / coverage:** Fasanara above 60%, total RWA above 80%, any other issuer above 40%, first-loss coverage below 50% of Fasanara or 40% of RWA exposure, any position other than GDADF exceeding the first-loss buffer, or liquid-capital coverage below 15%.
- **Duration:** a funded farm's notice/exit horizon increases, or significant capital moves from 7-day into 28/56-day positions.
- **Governance / mint:** Safe owner or threshold changes, role-admin changes, new minters, proxy upgrades, timelock-delay reductions, connector/peer/vault changes, or unexplained portal-generated mints. Also INFI minting, INFI use in allocation voting or loss absorption, or a Gateway `lockingController` change.
- **Pendle maturity:** the December 10, 2026 PT-reUSD maturity, a failed or loss-making unwind, or new Pendle/Re Protocol positions.
- **Remote expansion:** Monad book above $5M (8% of TVL), any new remote chain, or L1/remote divergence above 1%. At this snapshot the Monad L1 book ($4,110,614.47, 6.2%) reconciles to Monad AccountingL2 ($4,110,795.34) and both funded Monad farms are source-verified. Material Base growth or persistent unexplained mirror divergence also requires review.
- **Incident / counterparty:** loss events, depeg, oracle failures, counterparty default/restructure, missing cash after an actual redemption notice, or keeper timestamps older than 48 hours.

## Appendix A: Top Farm Exposure Analysis

Twelve registered farms exceed $100,000 and account for all non-dust TVL, including Monad's $4,110,614.48 Ethereum-ledger book and Base's $342,542.25. Values reconcile to `Accounting.totalAssetsValue()` at the snapshot.

| Position / farm | Implementation | Bucket / notice | Assets | Share |
|---|---|---|---:|---:|
| [`Fasanara GDADF (Midas mGLO)`](https://etherscan.io/address/0x2fa5E6C5549BEdF98A935Cac3BB4337459c74897) | RWAEscrowRouterFarm | MATURITY 28d | $21.34M | 32.1% |
| [`Pendle PT-reUSD-10DEC2026`](https://etherscan.io/address/0xe9E44C0A68C49aDe51CdA5e027909C5996B5c71a) | PendleV2FarmV3 | MATURITY Dec 10, 2026 | $9.02M | 13.5% |
| [`f(x) fxSAVE`](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363) | FxSaveFarm | MATURITY 7d | $8.09M | 12.2% |
| [`Cap stcUSD`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | CapFarm | LIQUID | $6.36M | 9.6% |
| [`New Silver`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | RWAEscrowFarm | MATURITY 56d | $5.22M | 7.8% |
| [`Outland Monad`](https://etherscan.io/address/0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E) | OutlandFarm | MATURITY 7d | $4.11M | 6.2% |
| [`New Silver 2 Senior`](https://etherscan.io/address/0x79e1B8e45932A7C802eA3dAb3844e5DEa68d971f) | RWAEscrowRouterFarm | MATURITY 7d | $3.20M | 4.8% |
| [`Aave V3 USDC`](https://etherscan.io/address/0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580) | AaveV3Farm | LIQUID | $3.18M | 4.8% |
| [`Fasanara Genesis`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | RWAEscrowFarm | MATURITY 28d | $2.62M | 3.9% |
| [`FalconX Institutional`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | RWAEscrowFarm | MATURITY 7d | $2.03M | 3.0% |
| [`Spark sUSDC`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | SparkSUSDCFarm | LIQUID | $1.06M | 1.6% |
| [`Outland Base`](https://etherscan.io/address/0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA) | OutlandFarm | MATURITY 7d | $342,542.25 | 0.5% |

### RWA farms: shared rate accounting and concentrated credit

| Farm exposure | Escrow | Receiver | Notice | Book value | Configured annual rate |
|---|---|---|---|---:|---:|
| Fasanara GDADF | [`0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E`](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E) | Escrow router itself; permitted external calls | 28d | $21.34M | 6.20% |
| New Silver | [`0x1532f095F8daa79d22a2475FD50c7109add394bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) | [`0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) | 56d | $5.22M | 11.25% |
| New Silver 2 Senior | [`0x6439eb9DADC7977BC1ADC027B10Fb1749AF869A5`](https://etherscan.io/address/0x6439eb9DADC7977BC1ADC027B10Fb1749AF869A5) | Escrow itself | 7d | $3.20M | 6.77% |
| Fasanara Genesis | [`0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) | [`0x4831C121879d3DE0E2B181d9d55E9B0724f5D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) | 28d | $2.62M | 7.51% |
| FalconX Institutional | [`0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C) | [`0xf7583D86D9fB25391Af6e30ad17786572792d83c`](https://etherscan.io/address/0xf7583D86D9fB25391Af6e30ad17786572792d83c) | 7d | $2.03M | 6.05% |

Counterparty attribution is from the [current vault disclosures](https://docs.infinifi.xyz/vaults), not inferred from receiver addresses. All five use [`RWAEscrowRateManager`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189), share the October 19 13:31:23 UTC accounting timestamp. Four report **zero liquidity**; New Silver 2 Senior reports $209.91 of escrow USDC. Its book grew from $1.50M on October 14 to $3.20M. `harvest` grows/reduces book assets at the configured rate; `governanceUpdateTotalAssets` can override them. This creates a common valuation dependency over $34.42M.

GDADF is described by the issuer as asset-backed receivables/private credit, rather than the Genesis digital-asset arbitrage strategy. Per InfiniFi's [September 29 notice](https://github.com/InfiniFi-Labs/documents/blob/master/fasanara/gdadf-nav/GDADF%20September%202026%20Notice.pdf), InfiniFi, Midas and Fasanara converted the mGLOBAL holding into mGLO, whose primary backing is GDADF plus a liquid reserve. Onchain, the GDADF escrow router sent 20,627,291.44 [mGLOBAL](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8) to the [mGLOBAL redemption vault](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) ([transaction](https://etherscan.io/tx/0x792702f6dabf2a47e6df524c6f295a9725659e840dce62e511137861055c8aa6)) and received 19,500,884.82 [mGLO](https://etherscan.io/address/0x1dd91a111606382b77a917633ed90feaf25e0f76) ([transaction](https://etherscan.io/tx/0xcea65cc73a0b3750844b978460f7c6e1e6db294a3f3113e5852c8012a071e9a1)). On September 30 it submitted 7,457,000.29 mGLO to the [mGLO redemption vault](https://etherscan.io/address/0x55f3ab43e49ffb6b1fff5e2b310c21278bdaf0f5) for USDC ([transaction](https://etherscan.io/tx/0x2275482b7a1902ba249b62cecd1e1d4eee8404a6f110f1216cf55a46923faed1)). `redeemRequests(1)` still shows status 0 (pending), with a recorded mGLO rate of 0.93536271. The escrow now holds **12,043,884.53 mGLO** and zero mGLOBAL.

The [mGLO data feed](https://etherscan.io/address/0x98bd3a24d3998EF96b12d896045EaCA7955Ea963#code) reads **0.98565103**. Its aggregator was changed on October 19, 2026 at 13:13:35 UTC ([transaction](https://etherscan.io/tx/0x25f5d32e9d3039b0f5d5ca0c25a1ca0feee47122d77de6dfe737c6b916904936)); before that it read 0.93536271. At the current price the held mGLO is worth $11,871,067.19. The pending request is worth $6,975,000.00 at its recorded rate or $7,350,000.02 at the current price. The total of **$18.85M–$19.22M** compares with an escrow book of **$21,342,226.79**, a gap of **$2.12M–$2.50M (9.9%–11.7%)**. **TODO:** InfiniFi reconciliation of the gap (for example, value held outside the token or a different valuation basis), the router's complete external-call allowlist, and the settlement of request #1. The [August GDADF factsheet](https://github.com/InfiniFi-Labs/documents/blob/master/fasanara/gdadf-nav/GDADF%20August%202026%20Factsheet.pdf) reports fund-level data (USD 1.3bn AUM, 0.93% YTD default rate, 0.13% crystallised losses), not InfiniFi's holding. New Silver has fund-level updates only and FalconX has no reserve/holding statement; identifying their names does not prove their ability to return cash.

### f(x) fxSAVE: onchain position with operational exits

FxSaveFarm [`0x78A31bD6cAca12BdF83F8A608076006C1F58F363`](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363) holds **7,195,150.270592 fxSAVE shares**, no loose fxUSD and no active `lockedProxy`. The [fxSAVE wrapper](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) `previewRedeem` returns **8,011,672.059845 base-pool shares**. Farm `assets()` values the base pool's fxUSD/USDC outputs through Accounting, yielding $8.09M; `liquidity()` is zero. [Verified farm source](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363#code) requires `FARM_SWAP_CALLER` to begin/complete unstaking and swap fxUSD to USDC, with `maxSlippage = 0.999e18` (0.1% tolerated value loss). The rolling seven-day horizon is not an automatic distribution of USDC. Underlying solvency, oracles, upgrade powers and swap execution are material at 12.2% of TVL.

### Pendle PT-reUSD: fixed-maturity position

The verified [PendleV2FarmV3](https://etherscan.io/address/0xe9E44C0A68C49aDe51CdA5e027909C5996B5c71a#code) was registered after October 3. It holds **9,153,522.015858 [PT-reUSD-10DEC2026](https://etherscan.io/address/0xeCfaFdC7741323a945A163ed068B5a3C43483957)** in Pendle market [`0x13285bCbc27F92b47B4EDB99D744C07B48C977c0`](https://etherscan.io/address/0x13285bCbc27F92b47B4EDB99D744C07B48C977c0). Its `totalWrappedAssets()` is $9.01M and `assets()` is $9,016,794.17. `liquidity()` is zero and `maturity()` is December 10, 2026 00:00 UTC. The underlying [reUSD](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72) is named "Re Protocol Deposit Token". The verified source interpolates PT yield linearly to maturity, applies a governance-set `maturityPTDiscount` of 0.9995, and uses Pendle routing and CoW settlement with `maxSlippage = 0.997e18`. Principal depends on reUSD value at maturity and on converting reUSD back to USDC. Re Protocol's reserves, redemption terms and governance are **TODO**.

### Liquid farms and remote positions

Cap [`0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694), Aave V3 [`0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580`](https://etherscan.io/address/0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580) and Spark [`0xd880D7C5CaFdbE2AEc281250995abF612235e563`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) jointly report $10.60M assets/liquidity. Their sources trace Cap's stcUSD→cUSD unwind, Aave principal withdrawal through [Aave V3 Pool](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2) (`lendingPool()` getter) and Spark's sUSDC→Sky/USDC route; any underlying pause or liquidity shortfall can reduce atomic redemption capacity. Cap supplies about 60% of the buffer.

Base Accounting reports a $342,557.74 remote asset book at the synchronized Base snapshot, compared with the older $342,542.25 L1 mirror. The vault's zero `maxWithdraw` limits immediate recovery. Monad's $4,110,614.47 L1 mirror reconciles to $4,110,795.34 in Monad AccountingL2: $2,087,679.51 in a Monad Aave V3 USDC market (full liquidity) and $2,023,115.83 in August USDC V2 (zero `maxWithdraw`). Both mainnet vaults remain material graph nodes because they have mint authority; current position size is not a mint cap.

## Appendix B: Contract Architecture

```text
USDC / enabled assets → Gateway V4 → MintController → iUSD
                                              ↓ stake
                                           siUSD
liUSD / LockingController → first-loss → siUSD losses → iUSD price losses

iUSD backing → FarmRegistry / Accounting
               ├─ Liquid: Cap + Aave V3 + Spark → BeforeRedeemHook → USDC exit
               ├─ RWA: GDADF (Midas mGLO) + Genesis + New Silver ×2 + FalconX
               │        └─ one configured-rate manager → reported book values
               ├─ Pendle PT-reUSD → maturity Dec 10, 2026
               ├─ f(x) fxSAVE → keeper unstake / claim / swaps
               └─ Outland Base / Monad → remote asset and supply reports

CCIP connector → PortalHub queued payload → OUTLAND_KEEPER processing
                                         → OutlandVault → native iUSD mint/burn
CCTP → underlying USDC transport on the Monad route
LayerZero OFT adapters → escrow existing iUSD/siUSD (no native mint role)

4/8 Safe → Long Timelock (7d): minter grants / proxy upgrades
         → Short Timelock (24h): parameters / oracles / connector configuration
         → direct operational powers: pause / rebalance / keeper management
```

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [February 4, 2026](https://github.com/yearn/risk-score/pull/22) | 2.3 | Initial assessment |
| [May 18, 2026](https://github.com/yearn/risk-score/pull/192) | 3.2 | Reassessment — Liquidity 2.0→4.0: iUSD redemption queue-only pending maturity wave |
| [July 4, 2026](https://github.com/yearn/risk-score/pull/288) | 3.4 | Reassessment — offchain concentration up, TVL down |
| [July 29, 2026](https://github.com/yearn/risk-score/pull/357) | 3.19 | Reassessment — offchain exposure restated to 84.4% with a fourth RWA escrow; farm-bucket semantics corrected (`FarmTypes.LIQUID` = bucket 1): instant-exit capacity is $5.45M and the redemption queue has never been used (Liquidity 4.0→3.0) |
| [October 19, 2026](https://github.com/yearn/risk-score/pull/510) | 3.09 | Reassessment — TVL $66.58M; History 2.5→2.0 (TVL above $50M on 312 of 365 days), Governance 2.8→2.5 (24h parameter and 7-day upgrade timelocks), Provability 4.0→3.5 (GDADF held as onchain Midas mGLO; monthly Genesis position reports); GDADF book $2.1M–$2.5M above Midas-priced mGLO flagged; New Silver and FalconX position evidence due January 14, 2027; Pendle PT-reUSD 13.5%; Monad $4.11M reconciled to Monad accounting; INFI governance-token setup; 24h Short Timelock, Gateway V4, six minters and CCIP/CCTP paths verified. |
