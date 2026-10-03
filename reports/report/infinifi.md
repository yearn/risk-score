# Protocol Risk Assessment: InfiniFi

- **Assessment Date:** February 4, 2026 (Updated: October 4, 2026)
- **Status:** GATED
- **Token:** siUSD (Staked iUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)
- **Final Score: 5.00/5.0**
- **Snapshot:** Ethereum block [26,114,509](https://etherscan.io/block/26114509), hash [`0xf6c5…0829`](https://etherscan.io/block/0xf6c5a914df3d9a526db026ff2c731220772c285fd542c9a8eaaeed9172340829), October 3, 2026 at 21:29:23 UTC. Base block [52,136,808](https://basescan.org/block/52136808), hash [`0x412b…2e`](https://basescan.org/block/0x412b15be13eefbfbeb4fea7c75c858b6e1de38af71f8b651a717da5383d2a52e), same timestamp. Roles, balances, farms and proxies are pinned to these blocks; event scans end at the Ethereum block. API/DEX observations are separately timestamped in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json). Monad RPC verification was excluded at the requester's direction: its $23.01 figure below is an Ethereum-mirrored book value, not proof of remote reserves.

## Overview + Links

InfiniFi accepts enabled deposit assets to mint iUSD and deploys the backing through farms. siUSD wraps iUSD in an ERC-4626 vault; locked liUSD positions provide the first-loss tranche. The liability ladder remains liUSD → siUSD → iUSD.

The current accounted asset book is **$44.20M**. Four funded RWA escrow positions account for **$31.12M (70.4%)**, all valued through one configured-rate manager. Fasanara GDADF, labelled mGLOBAL by the protocol, is **48.2%** and Fasanara Genesis is **5.9%**; their combined issuer concentration is **54.1%**. The largest onchain position is f(x) fxSAVE (**18.3%**). The LIQUID bucket provides **$4.94M (11.2%)** of reported immediate liquidity through Cap, Aave V3 and Spark. The first-loss notional is **$14.00M**. See [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json) and Appendix A.

**Reserve-proof gate:** the ledger is observable, but current backing of the dominant RWA book is not established by current transparent reserve attestations. `RWAEscrowRateManager.harvest()` accrues configured returns and updates timestamps; it is not a NAV or custody verification. The largest farm's escrow holds **zero mGLOBAL tokens**. Public fund statements linked in the [current vault disclosures](https://docs.infinifi.xyz/vaults) are dated April 27, 2026 (GDADF) and February 26, 2026 (Genesis). **TODO:** obtain current holding/NAV and custody evidence for all four RWA positions, reconciled to InfiniFi's claims. The report is **GATED at 5.00** pending that proof; the ungated weighted score is **3.40**. This reflects missing reserve verification, not an observed exploit or realized loss.

**Farm notice periods:** `RWAEscrowFarm` and `RWAEscrowRouterFarm` use rolling `block.timestamp + duration`; FxSaveFarm returns `now + 7 days`, and OutlandFarm uses `maturityOffset()` (7 days for both current instances). These are accounting/notice horizons, not guaranteed calendar settlement dates. Cash requires an actual counterparty return, unstaking/claim operation or cross-chain transfer.

The protocol offers three tiers of tokens:

1. **iUSD:** base stablecoin receipt, redeemable against available backing.
2. **siUSD:** staked iUSD; ERC-4626 withdrawal to iUSD has no cooldown, but subsequent USDC redemption depends on protocol liquidity.
3. **liUSD:** locked iUSD (1–13 weeks); first-loss capital, with early exits routed through UnwindingModule.

**Links:** [Protocol Documentation](https://docs.infinifi.xyz/) · [Protocol App](https://infinifi.xyz/) · [Analytics](https://stats.infinifi.xyz/) · [GitHub](https://github.com/InfiniFi-Labs/infinifi-protocol) · [Audits](https://docs.infinifi.xyz/audits) · [Dependency graph](https://curation.yearn.fi/graph/infinifi)

## Contract Addresses

All 19 registered Ethereum farms, assessed tokens, and the Gateway, YieldSharing and PortalHub implementations are source-verified on Etherscan; see the verification inventory in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json).

**Core / Governance:**

- **iUSD (ReceiptToken)**: [`0x48f9e38f3070AD8945DFEae3FA70987722E3D89c`](https://etherscan.io/address/0x48f9e38f3070AD8945DFEae3FA70987722E3D89c) — ERC20, restricted mint/burn via CoreControlled roles
- **siUSD (StakedToken)**: [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) — ERC4626 vault wrapping iUSD
- **InfiniFiCore (AccessControl)**: [`0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490`](https://etherscan.io/address/0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490) — Central AccessControlEnumerable, DEFAULT_ADMIN_ROLE has 0 holders (renounced).
- **Gateway (Proxy)**: [`0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5`](https://etherscan.io/address/0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5) — TransparentUpgradeableProxy → InfiniFiGatewayV4 ([`0x750136ac021a7149f0ee38141d0ba920cca1fc5d`](https://etherscan.io/address/0x750136ac021a7149f0ee38141d0ba920cca1fc5d))
- **Gateway ProxyAdmin**: [`0x21071E0f9D600571Ffe47873e95fffF2FAc9141c`](https://etherscan.io/address/0x21071E0f9D600571Ffe47873e95fffF2FAc9141c) — Owned by Long Timelock (7-day delay for upgrades)
- **Accounting**: [`0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3`](https://etherscan.io/address/0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3) — aggregates farm TVL via FarmRegistry
- **FarmRegistry**: [`0xF5f2718708f471e43968271956CC01aaA8c46119`](https://etherscan.io/address/0xF5f2718708f471e43968271956CC01aaA8c46119) — canonical list of approved farms (19 registered: 5 PROTOCOL, 5 LIQUID, 9 MATURITY; eight positions exceed $100,000, Base holds ~$68,060, Monad is $23.01 in L1 accounting and controller float is $0.000967)
- **YieldSharing (Proxy → V3)**: [`0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b`](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b) — TransparentUpgradeableProxy → YieldSharingV3 ([`0x0d5dBF208A9a7540018D204a9A0aD08A091407e5`](https://etherscan.io/address/0x0d5dBF208A9a7540018D204a9A0aD08A091407e5)).
- **LockingController (liUSD positions)**: [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) — first-loss tranche
- **UnwindingModule**: [`0x7092A43aE5407666C78dBEA657a1891f42b3dFcc`](https://etherscan.io/address/0x7092A43aE5407666C78dBEA657a1891f42b3dFcc) — settles liUSD early exits over time
- **MintController**: [`0x49877d937B9a00d50557bdC3D87287b5c3a4C256`](https://etherscan.io/address/0x49877d937B9a00d50557bdC3D87287b5c3a4C256)
- **RedeemController**: [`0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601`](https://etherscan.io/address/0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601)
- **MigrationController**: [`0x5F5403656E4Db95aCcF1064A714B1bcE351839F8`](https://etherscan.io/address/0x5F5403656E4Db95aCcF1064A714B1bcE351839F8) — additional ENTRY_POINT and RECEIPT_TOKEN_MINTER
- **MinorRolesManager**: [`0xa08Bf802dCecd3c44E6420a52d5158867366be9b`](https://etherscan.io/address/0xa08Bf802dCecd3c44E6420a52d5158867366be9b) — **holds no role membership on Core** (see Governance section)
- **FluidRewardsClaimer**: [`0xD0ec80032C0da717BD78B9569321D9069365241E`](https://etherscan.io/address/0xD0ec80032C0da717BD78B9569321D9069365241E) — GOVERNOR (claim-only scope)
- **PLSmoother / PLSmootherHelper**: [`0xC324569141697045B9EdE54B5d4623a691ed57A4`](https://etherscan.io/address/0xC324569141697045B9EdE54B5d4623a691ed57A4) / [`0x215C7fA0E620FCE99Ed4891BCcb7523388b010b8`](https://etherscan.io/address/0x215C7fA0E620FCE99Ed4891BCcb7523388b010b8) — handle profit/loss smoothing; hold RECEIPT_TOKEN_MINTER/BURNER and FINANCE_MANAGER
- **AfterMintHook / BeforeRedeemHook**: [`0xa5E274E6c2AbBd30E3A94e1A2dF7e6F5944797a8`](https://etherscan.io/address/0xa5E274E6c2AbBd30E3A94e1A2dF7e6F5944797a8) / [`0x4b2bFe49829dE3632449928507452EE667f61395`](https://etherscan.io/address/0x4b2bFe49829dE3632449928507452EE667f61395) — FARM_MANAGER
- **ManualRebalancer**: [`0x5fEaad299BF772505e79250Ec58E28fdfdc52777`](https://etherscan.io/address/0x5fEaad299BF772505e79250Ec58E28fdfdc52777) — FARM_MANAGER
- **EmergencyWithdrawal**: [`0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9`](https://etherscan.io/address/0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9) — FARM_MANAGER, UNPAUSE, PAUSE (multisig-driven)
- **MaturedFarmCleaner**: [`0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56`](https://etherscan.io/address/0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56) — PROTOCOL_PARAMETERS + PAUSE
- **LiquidationFarm**: [`0xda40ce7DdDBE7D54A106D32575b2CCF41dDb1A11`](https://etherscan.io/address/0xda40ce7DdDBE7D54A106D32575b2CCF41dDb1A11) — Liquid-type farm holding MANUAL_REBALANCER + FINANCE_MANAGER
- **AllocationVoting**: [`0x49FA678BB8B2F5F8089493a6f93e1bb8500FF853`](https://etherscan.io/address/0x49FA678BB8B2F5F8089493a6f93e1bb8500FF853) — TRANSFER_RESTRICTOR holder
- **OracleFactory**: [`0xA2b300C5D0e9250F646B20ec924efaD36d19Ed91`](https://etherscan.io/address/0xA2b300C5D0e9250F646B20ec924efaD36d19Ed91) — ORACLE_MANAGER
- **iUSD Oracle (FixedPriceOracle)**: [`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`](https://etherscan.io/address/0x8ABc952f91dB6695E765744ae340BC5eA4B344c1) — `price()` = `1.0e18` at the snapshot; a fixed-price read does not establish market peg or reserve quality

**Team Multisig & Timelocks:**

- **Team Multisig**: [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) — Gnosis Safe v1.4.1, **4/8 threshold**, 8 EOA signers, nonce 644.
- **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — 604,800s delay (verified)
- **Short Timelock (24 hours)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` = 86,400s. Governs parameter/oracle changes and farm additions/removals.

**Active farms** (see Funds Management § Asset Allocation for full table and Appendix A for risk analysis).

**Outland / cross-chain accounting:**

- **PortalHub proxy:** [`0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61`](https://etherscan.io/address/0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61) → verified PortalHub [`0xe66110973b9acc45204b4b1d0c59370466dd686b`](https://etherscan.io/address/0xe66110973b9acc45204b4b1d0c59370466dd686b); ProxyAdmin [`0x866a8e35abdfc42a7f8fd3be24c91ef5fb039d0e`](https://etherscan.io/address/0x866a8e35abdfc42a7f8fd3be24c91ef5fb039d0e) is owned by Long Timelock. `bridgePaused()` is true; `paused()` is false.
- **Base OutlandVault / farm:** [`0x4197F2ADFCe9fDeB36B02e96737Ddf646C841e45`](https://etherscan.io/address/0x4197F2ADFCe9fDeB36B02e96737Ddf646C841e45) / [`0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA`](https://etherscan.io/address/0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA) — native iUSD minter/burner; L1 assets $68,060.48.
- **Monad OutlandVault / farm:** [`0x77776F422B7EB0A95ccD35fBd088A5957D4408eA`](https://etherscan.io/address/0x77776F422B7EB0A95ccD35fBd088A5957D4408eA) / [`0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E`](https://etherscan.io/address/0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E) — native iUSD minter/burner; L1 assets $23.01. **TODO:** remote RPC/source/reserve verification, excluded by request.
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
- **TVL:** the January 7, 2026 [DefiLlama](https://defillama.com/protocol/infinifi) peak was $190.49M. July 29 accounted assets were $60.40M. The current $44.20M is 76.8% below the January peak. DefiLlama's September 3 observation was $47.71M versus $44.19M on October 3 (-7.4% over 30 calendar days); its September 28→29 daily observations fell from $50.49M to $45.19M (-10.5%). The snapshot Accounting value is $44,198,703.80 and the separately timed API latest TVL is $44,198,552.00. Dated series is preserved in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json).
- **Redemption record:** the July 29 assessment recorded 5,909 redemptions and ~$713M in instant USDC payments from deployment through block 25,638,819, including the historical $17.84M March redemption ([transaction](https://etherscan.io/tx/0xdaaf87cc042356c36f23c4fbbac1675817eaed8c45cec26c462089d173dca900)). A paginated scan of blocks 25,638,820–26,114,509 finds **805 `Redeem` events, $48.33M paid out, and zero `RedemptionQueued`, `RedemptionFunded`, `RedemptionPartiallyFunded` or `RedemptionClaimed` events**. The largest payment in that interval was $5.24M ([transaction](https://etherscan.io/tx/0xf03e44f0582fe3aba224d17566399fce74d8721df71bd484e3a05f010334fc4b)). The September 28 daily payments totalled $5.83M; this historical liquidity is not the present buffer. Event counts and totals are in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json).
- **Loss/peg state:** no disclosed protocol exploit was identified in the consulted sources. The current iUSD FixedPriceOracle reads $1.00. No `LossesApplied`, `VaultLoss` or `CriticalLoss` events were found since the preceding snapshot; scans are recorded in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json); reserve-proof gating is separate from a realized-loss status.
- **liUSD unwind state:** LockingController holds $12.02M iUSD and UnwindingModule holds $1.98M; `totalBalance()` is $14.00M. The combined first-loss notional includes positions in unwind and is not a permanent capital commitment.

## Funds Management

InfiniFi manages an approved farm portfolio in three buckets: PROTOCOL (controller float), LIQUID (instant principal withdrawal), and MATURITY (notice-period/operational exit). Bucket membership is enumerated from `FarmRegistry.getTypeFarms()`. Values below reconcile exactly to `Accounting.totalAssetsValue()` at the snapshot; offchain book-value reconciliation does not prove economic backing.

### Asset Allocation

| Bucket | Value (USD) | Share | Withdrawal terms |
|---|---:|---:|---|
| PROTOCOL | $0.000967 | ~0% | Controller float |
| LIQUID | $4,941,915.90 | 11.2% | Cap $2.224M, Aave V3 $2.224M, Spark $0.494M; all report full principal liquidity |
| MATURITY | $39,256,787.90 | 88.8% | 7 / 28 / 56-day accounting/notice horizons; actual cash depends on underlying exits |
| **Total** | **$44,198,703.80** | **100%** | |

| Position / farm | Implementation | Bucket / notice | Assets | Share |
|---|---|---|---:|---:|
| [`Fasanara GDADF (labelled mGLOBAL)`](https://etherscan.io/address/0x2fa5E6C5549BEdF98A935Cac3BB4337459c74897) | RWAEscrowRouterFarm | MATURITY 28d | $21.29M | 48.2% |
| [`f(x) fxSAVE`](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363) | FxSaveFarm | MATURITY 7d | $8.07M | 18.3% |
| [`New Silver`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | RWAEscrowFarm | MATURITY 56d | $5.20M | 11.8% |
| [`Fasanara Genesis`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | RWAEscrowFarm | MATURITY 28d | $2.61M | 5.9% |
| [`Cap stcUSD`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | CapFarm | LIQUID | $2.22M | 5.0% |
| [`Aave V3 USDC`](https://etherscan.io/address/0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580) | AaveV3Farm | LIQUID | $2.22M | 5.0% |
| [`FalconX Institutional`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | RWAEscrowFarm | MATURITY 7d | $2.02M | 4.6% |
| [`Spark sUSDC`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | SparkSUSDCFarm | LIQUID | $494,191.65 | 1.1% |
| [`Outland Base`](https://etherscan.io/address/0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA) | OutlandFarm | MATURITY 7d | $68,060.48 | 0.2% |
| [`Outland Monad (L1 book value)`](https://etherscan.io/address/0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E) | OutlandFarm | MATURITY 7d | $23.01 | <0.1% |

Position labels come from the [current vault disclosures](https://docs.infinifi.xyz/vaults) and [portfolio API](https://eth-api.infinifi.xyz/api/protocol/data); addresses, membership, values and exit getters come from the fixed-block [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json). The portfolio API can retain removed positions and show a different state from the snapshot, so FarmRegistry is the authority for inclusion.

The original MidasFarm [`0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF) and Team-Safe escrow farm [`0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) are not registered and hold $0. Aave V4 [`0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657) and the two Sentora swap farms [`0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) / [`0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) are removed, with $8.70 / $9.49 / $14.61 of residual assets respectively; they are excluded from current Accounting TVL. The registered Steakhouse infiniFi MetaMorpho, Horizon and Euler farms have zero assets and are paused. New Silver Senior is registered with $0. Remaining registered internal farms have $0.

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
| [`Monad OutlandVault`](https://etherscan.io/address/0x77776F422B7EB0A95ccD35fBd088A5957D4408eA) | ✓ | ✓ | Same native mint path; remote state unverified by request |
| [`siUSD`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) / [`UnwindingModule`](https://etherscan.io/address/0x7092A43aE5407666C78dBEA657a1891f42b3dFcc) / [`LockingController`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) | — | ✓ | Loss processing |
| [`RedeemController`](https://etherscan.io/address/0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601) / [`PLSmootherHelper`](https://etherscan.io/address/0x215C7fA0E620FCE99Ed4891BCcb7523388b010b8) | — | ✓ | Redemption and smoothing burns |

The verified [OutlandVault source](https://etherscan.io/address/0x4197F2ADFCe9fDeB36B02e96737Ddf646C841e45#code) calls native `ReceiptToken.mint` from `_syncL2Supply` during `portalUpdate`; it does not require collateral to arrive atomically. PortalHub accepts a message hash from an approved connector, then an `OUTLAND_KEEPER` must process that exact payload in nonce order. There is no onchain independent reconciliation of remote collateral and no per-message mint cap in this path. A forged accepted asset/supply report followed by keeper processing can inflate book assets and canonical supply, affecting native holders regardless of the current $68K/$23 exposure. Adding minters and upgrading PortalHub require the 7-day Long Timelock; connector/peer/vault configuration uses 24-hour parameter authority.

The two LayerZero OFT adapters have no native minter role; they escrow existing tokens. That limited blast radius applies to the OFT route only, not the Outland route. `PLSmoother` remains vulnerable to upstream false profit reporting: a keeper-accrued escrow book can feed internal yield accounting without a contemporaneous cash realization. Pending profit held in PLSmoother is excluded from the documented loss waterfall.

### Collateralization

| Component | Current amount | Getter |
|---|---:|---|
| iUSD total supply | 44.198524M | `iUSD.totalSupply()` |
| iUSD held by siUSD | 29.860218M | `iUSD.balanceOf(siUSD)` / `siUSD.totalAssets()` |
| iUSD held by LockingController | 12.019704M | `iUSD.balanceOf(LockingController)` |
| iUSD held by UnwindingModule | 1.980275M | `iUSD.balanceOf(UnwindingModule)` |
| Residual iUSD outside those three contracts | 0.338327M | Supply minus the three balances; includes other contracts |
| siUSD supply | 27.329814M shares | `siUSD.totalSupply()` |
| iUSD per siUSD | 1.092588 | `convertToAssets(1e18)` |
| First-loss notional | 13.999979M | `LockingController.totalBalance()` |

Accounted assets exceed receipt supply by approximately $179.48, a **book backing ratio of 100.0004%**. The $31.12M RWA book is supported by keeper-set balances rather than current reserve proof. The $14.00M first-loss notional covers **45.0% of the RWA book**, **58.6% of combined Fasanara exposure ($23.89M)**, and **65.8% of the GDADF position ($21.29M)**. A loss of roughly two-thirds of GDADF alone would exhaust that notional; smaller correlated losses across both Fasanara positions can do the same. The $1.98M in unwind can leave the buffer as claims complete.

### Provability

All registered farm identities, allocations and onchain DeFi balances are observable. The **economic backing of 70.4% is not verified**. `RWAEscrow.totalAssets()` is an administrative ledger. All four funded escrows share [RWAEscrowRateManager](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189#code): permissionless `harvest()` accrues governance-configured annual rates (6.20% GDADF, 11.25% New Silver, 7.51% Genesis, 6.05% FalconX), then refreshes `lastUpdatedAt`. The same parameter authority can use `governanceUpdateTotalAssets` to override a value. All four timestamps are October 3 at 18:37:59 UTC; this proves recent accounting execution, not custodian confirmation.

The latest GDADF document linked by the public vault page is a [holding/accrued-interest statement dated April 27](https://raw.githubusercontent.com/InfiniFi-Labs/documents/master/fasanara/gdadf-nav/2026-04-27-gdadf-nav.pdf), describing a $30M note plus accrued interest at that date. It does not reconcile the current $21.29M book. Genesis has a [performance statement dated February 26](https://raw.githubusercontent.com/InfiniFi-Labs/documents/master/fasanara/genesis-nav/2026-02-26-genesis-nav.pdf). New Silver material is an investor summary and press release; no current holding/reserve reconciliation for New Silver or FalconX was established. Counterparty names are disclosed, but current ownership, custody and recoverability of InfiniFi's claims remain **TODO**. This is the basis of the reserve-proof gate.

## Liquidity Risk

- **iUSD:** BeforeRedeemHook draws from LIQUID farms in the redemption transaction. Current reported capacity is **$4.94M (11.2% of TVL)**; each funded liquid farm's `liquidity()` equals its assets and none is paused. The $0.000967 PROTOCOL float is not the exit buffer. Cap and Aave each provide ~45% of immediate capacity; Spark provides ~10%.
- **siUSD:** withdrawal to iUSD is ERC-4626 with no cooldown; redeeming that iUSD to USDC uses the same finite buffer. $4.94M covers **16.6%** of the $29.86M siUSD-held iUSD.
- **liUSD:** locked positions/early exits follow the UnwindingModule path; $1.98M iUSD is in unwind.
- **Queue:** `queueLength()`, `totalEnqueuedRedemptions()` and `totalPendingClaims()` all read zero; RedeemController is unpaused. No queue events occur in the incremental scan. Prior same-block redemptions demonstrate transaction mechanics, not reserve quality or future notice-period settlement.

| Availability / notice | Value | Share | Conditions |
|---|---:|---:|---|
| Immediate | $4.94M | 11.2% | Cap, Aave V3, Spark underlying liquidity and no pause |
| 7-day horizon | $10.16M | 23.0% | fxSAVE $8.07M, FalconX $2.02M, Base $0.068M, Monad $23.01 in L1 books; requires keeper actions/counterparty return/bridge settlement |
| 28-day notice | $23.89M | 54.1% | GDADF + Genesis, both Fasanara exposures |
| 56-day notice | $5.20M | 11.8% | New Silver |

These rows are disjoint buckets, not guaranteed cumulative cash receipts. Every funded RWA farm reports zero immediate liquidity. Base's underlying vault `maxWithdraw(farm)` is also zero at its snapshot. Correlated exits above the liquid buffer require replenishment or the FIFO queue; reserve or counterparty failure can prevent eventual payment entirely.

**Secondary markets:** the snapshot [Curve iUSD/USDC pool](https://etherscan.io/address/0x2E2d6C119bdF226C420cB40E3B9fC9689cF5986e) holds 5,349.13 iUSD and 5,387.48 USDC. `get_dy` quotes **998.07 USDC for 1,000 iUSD** and **5,365.19 USDC for 10,000 iUSD** (~46.3% shortfall at $10K). The separately timed [Dexscreener iUSD feed](https://api.dexscreener.com/token-pairs/v1/ethereum/0x48f9e38f3070AD8945DFEae3FA70987722E3D89c) reports ~$10.74K liquidity and $651 daily volume. Its [siUSD feed](https://api.dexscreener.com/token-pairs/v1/ethereum/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) lists a Balancer pool with no reported depth and zero volume; depth is **TODO**, so no meaningful market exit at size is established. Do not assume siUSD has no pair or treat these feeds as exhaustive venue coverage.

## Centralization & Control Risks

### Governance

Core roles and the two timelocks define the enforceable governance path. `FarmRegistry.addFarms` and `removeFarms` require `PROTOCOL_PARAMETERS`; the registry does not itself enforce a liUSD vote. The role holders and delays below are verified at the snapshot.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/8 threshold**, 8 EOA signers (`getOwners()` / `getThreshold()`). Nonce 644.

  | # | Signer | Additional Roles (verified onchain) |
  |---|--------|------------------|
  | 1 | [`0xCC30e7d9dfBc29613E2A1e272cd624aFC3Abe1E9`](https://etherscan.io/address/0xCC30e7d9dfBc29613E2A1e272cd624aFC3Abe1E9) | — |
  | 2 | [`0x7A823623B18335A9c1284AC45315fe89972FD421`](https://etherscan.io/address/0x7A823623B18335A9c1284AC45315fe89972FD421) | — |
  | 3 | [`0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD`](https://etherscan.io/address/0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD) | EXECUTOR_ROLE |
  | 4 | [`0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61`](https://etherscan.io/address/0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61) | — |
  | 5 | [`0x6DFa1A32604088EB969242AafFb92420F78373f6`](https://etherscan.io/address/0x6DFa1A32604088EB969242AafFb92420F78373f6) | EXECUTOR_ROLE |
  | 6 | [`0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685`](https://etherscan.io/address/0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685) | PAUSE |
  | 7 | [`0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa`](https://etherscan.io/address/0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa) | EXECUTOR_ROLE |
  | 8 | [`0x383965940c950008a4B67BfaA477Fdf6AC91a7F7`](https://etherscan.io/address/0x383965940c950008a4B67BfaA477Fdf6AC91a7F7) | EXECUTOR_ROLE, PAUSE |

- **Timelocks**: Both are custom `Timelock.sol` extending OZ TimelockController. They override `hasRole()` to delegate role checks to the central `InfiniFiCore` contract. Their default-admin path is renounced through Core; privileged roles remain mutable through Core governance.

  - **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — `getMinDelay()` returns 604,800s (verified 2026-10-03).
  - **Short Timelock (24 hours)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` returns **86,400s (24 hours)** (verified 2026-10-03). Parameter, oracle and farm-add/remove actions have a 24-hour early-warning window.

  **Timelock-controlling roles on InfiniFiCore** (verified by enumerating `getRoleMember()`, 2026-10-03):

  | Role | Holders |
  |------|---------|
  | PROPOSER_ROLE | 1: multisig (4/8 required to schedule) |
  | CANCELLER_ROLE | 1: multisig (4/8 required to cancel) |
  | EXECUTOR_ROLE | **6**: signers #3/5/7/8 + deployer EOA ([`0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22`](https://etherscan.io/address/0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22)) **+ the multisig itself** (the multisig can execute its own scheduled proposals) |

  Governance flow: **Multisig proposes (4/8) → Timelock delay → Any 1 of 5 executor EOAs or the multisig itself triggers execution.**

- **GOVERNOR role holders** (verified via `getRoleMemberCount(keccak256("GOVERNOR"))` = 2):
  - Long Timelock ([`0x3D18…48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9)) — full GOVERNOR scope behind 7-day delay
  - FluidRewardsClaimer ([`0xD0ec…241E`](https://etherscan.io/address/0xD0ec80032C0da717BD78B9569321D9069365241E)) — narrowly scoped to claiming Fluid rewards
  - Deployer EOA has renounced GOVERNOR. **DEFAULT_ADMIN_ROLE has 0 holders** on Core (verified).
  - MinorRolesManager holds no roles on Core; minor-role grants go through the multisig (which holds MINOR_ROLES_MANAGER) or the Long Timelock.

- **Actions by timelock tier**:

    **Long Timelock (7 days) — GOVERNOR role (plus PROTOCOL_PARAMETERS, PAUSE, MINOR_ROLES_MANAGER):**
    enableBucket, setMaxLossPercentage, setAddress (gateway), setAfterMintHook, setBeforeRedeemHook, setYieldSharing, enableAsset, disableAsset, setLendingPool, setSafeAddress, emergencyAction, proxy upgrades (owns ProxyAdmin), privileged role grants/revokes (operational role admins are described below).

    **Short Timelock (24 hours) — PROTOCOL_PARAMETERS role:**
    setBucketMultiplier, setMinAssetAmount, setSafetyBufferSize, setPerformanceFeeAndRecipient, setLiquidReturnMultiplier, setTargetIlliquidRatio, setCap, setMaxSlippage, addFarms, removeFarms, setEnabledRouter, setPendleRouter, setCooldown, setAssetRebalanceThreshold.

    **Short Timelock (24 hours) — ORACLE_MANAGER role:**
    setOracle, setPrice.
    Verified onchain: ORACLE_MANAGER has 5 holders — Short Timelock, Accounting ([`0x7A5C…42B3`](https://etherscan.io/address/0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3)), YieldSharing proxy ([`0x90E9…AE3b`](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b)), OracleFactory ([`0xA2b3…Ed91`](https://etherscan.io/address/0xA2b300C5D0e9250F646B20ec924efaD36d19Ed91)), and Long Timelock.

    **Multisig WITHOUT timelock** (the multisig directly holds these roles on InfiniFiCore):
    | Role | Capability |
    |------|-----------|
    | UNPAUSE (2 holders: multisig + EmergencyWithdrawal) | Unpause any paused contract |
    | EMERGENCY_WITHDRAWAL (1 holder: multisig) | Move funds from farms to predefined safe address, deprecate farms |
    | MANUAL_REBALANCER (4 holders: multisig + Short Timelock + LiquidationFarm + [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4)) | Rebalance funds between whitelisted farms |
    | FARM_SWAP_CALLER (4 holders: multisig + EOA [`0x7345…2cbB`](https://etherscan.io/address/0x73455e5Fc7e4cbfDe65A72Ff17f76393DC6A2cbB) + Short Timelock + keeper EOA [`0x2Cba…aB1a`](https://etherscan.io/address/0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a)) | Trigger swap operations in farms |
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

- **Other onchain role membership** (verified 2026-10-03 by enumerating `keccak256` of each role name in `CoreRoles`):

  | Role | Count | Notable holders |
  |------|------:|-----------------|
  | ENTRY_POINT | 2 | Gateway proxy, MigrationController |
  | RECEIPT_TOKEN_MINTER | 6 | YieldSharing, MintController, PLSmoother, MigrationController, Base OutlandVault, Monad OutlandVault |
  | RECEIPT_TOKEN_BURNER | 9 | siUSD, UnwindingModule, LockingController, YieldSharing, RedeemController, PLSmootherHelper, PLSmoother, both OutlandVaults |
  | LOCKED_TOKEN_MANAGER | 1 | LockingController |
  | TRANSFER_RESTRICTOR | 1 | AllocationVoting |
  | FARM_MANAGER | 5 | ManualRebalancer, AfterMintHook, BeforeRedeemHook, EmergencyWithdrawal, Short Timelock |
  | FINANCE_MANAGER | 4 | YieldSharing, LiquidationFarm, PLSmootherHelper, [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4) (redeployment, PROTOCOL-type, $0) |
  | FARM_SWAP_CALLER | 4 | Multisig, EOA [`0x7345…2cbB`](https://etherscan.io/address/0x73455e5Fc7e4cbfDe65A72Ff17f76393DC6A2cbB), Short Timelock, keeper EOA [`0x2Cba…aB1a`](https://etherscan.io/address/0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a) |
  | PERIODIC_REBALANCER | 1 | EOA [`0x2Cba…aB1a`](https://etherscan.io/address/0x2Cba0C86ED78f95fFF5fC0c18FE0E6343479aB1a) (keeper bot) |
  | PROTOCOL_PARAMETERS | 3 | Short Timelock, Long Timelock, MaturedFarmCleaner |
  | DEFAULT_ADMIN_ROLE | **0** | — (renounced) |

- **emergencyAction bypass analysis**: The `Timelock.sol` contract **overrides emergencyAction to a no-op**, preventing any GOVERNOR holder from using it to bypass timelock delays. This is a deliberate safety mechanism confirmed in source code.

The Safe owner address set and threshold exactly match the July 29 baseline recorded in this report; all eight owners have no contract code at the snapshot. The current owner set is preserved in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json). Both timelocks delegate proposer, executor and canceller checks to Core. Core's `DEFAULT_ADMIN_ROLE` remains empty, and privileged role administration remains `GOVERNOR`, except the operational roles delegated to `MINOR_ROLES_MANAGER`.

**Outland roles:** `OUTLAND_PORTAL` has one holder, PortalHub [`0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61`](https://etherscan.io/address/0x13025F34C1ec2A16bF68f3a3c4e986a3E85CED61), administered by `GOVERNOR`. `OUTLAND_KEEPER` has three holders: the Team Safe, [`0xDEc0de363DB32d5111AA6915d87f35A841201E6a`](https://etherscan.io/address/0xDEc0de363DB32d5111AA6915d87f35A841201E6a), and Short Timelock; its admin is `MINOR_ROLES_MANAGER`, allowing the Safe to change these operational holders without a timelock. `OUTLAND_KEYVALUE_SENDER` is [`0x2C5d2eF06B943262e51d9cEe696a914bf88B0498`](https://etherscan.io/address/0x2C5d2eF06B943262e51d9cEe696a914bf88B0498); `BRIDGE_INITIATOR` is Gateway. Both are administered by `GOVERNOR`. Source and all holder/admin reads are recorded in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json).

### Programmability

The liability ladder and redemption hook execute onchain, while allocation, RWA valuation inputs and cross-chain message processing require privileged operators. Four RWA books use the same governance-configured rate manager for 70.4% of reported assets. Automatically increasing a receivable does not prove realized profit. Oracles and escrow rate/override controls are behind the 24-hour Short Timelock; Gateway, YieldSharing and PortalHub upgrades are behind the 7-day Long Timelock.

Outland accounting additionally depends on authenticated bridge reports and keeper processing. PortalHub `bridgePaused() = true` blocks user bridge initiation; it does **not** block `receiveMessage`, and `processMessage` checks the main pause and keeper role rather than the bridge pause. The portal and both connectors are unpaused, so inbound native-mint processing remains an authorized path. See verified [PortalHub / PortalBase source](https://etherscan.io/address/0xe66110973b9acc45204b4b1d0c59370466dd686b#code) and [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json).

### External Dependencies

The dominant issuer is **Fasanara (54.1%)**, spread over GDADF (48.2%) and Genesis (5.9%); these are correlated exposures, not independent diversification. New Silver contributes 11.8% and FalconX 4.6%. Names and strategy descriptions are disclosed in the [current vault disclosures](https://docs.infinifi.xyz/vaults); legal enforceability and current reserve evidence are unresolved. f(x) Protocol (18.3%) adds fxSAVE/fxUSD base-pool, oracle, upgrade and unstaking dependencies; Cap (5.0%), Aave V3 (5.0%) and Spark/Sky (1.1%) support the liquid buffer. CoW settlement is used by the f(x) swap path. Current Morpho exposure is confined to the small Base farm; the Ethereum Steakhouse vault is unfunded.

**LayerZero OFT route — lock model:** Ethereum siUSD adapter [`0x5f2106bb2a5aba6a783dbf29c8d3b09c175bc3c0`](https://etherscan.io/address/0x5f2106bb2a5aba6a783dbf29c8d3b09c175bc3c0) holds **3,186.529708 siUSD** (~$3,481.57 iUSD at the snapshot rate); iUSD adapter [`0xdd1cb2e1aa483e1d94e3e22e70cfbb634fcb3005`](https://etherscan.io/address/0xdd1cb2e1aa483e1d94e3e22e70cfbb634fcb3005) holds **4.329349 iUSD**. Both are owned by the Team Safe, use [EndpointV2](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c), and have Katana peers [siUSD](https://explorer.katanarpc.com/address/0x68943c066747690ecDAEB027fa722B090ee6F92D) / [iUSD](https://explorer.katanarpc.com/address/0x9Fa1202516916534Ade66962Ee91410d559f1C10). Neither has native mint authority. The **Katana→Ethereum escrow-release** receive configs for both adapters require **4-of-4 DVNs: LayerZero Labs, Horizen, Canary and Deutsche Telekom**, with **20 confirmations** and no optional verifier set. This measures that inbound route only; remote supply and other OFT routes are not asserted current. Raw config and provider attribution are in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json).

**Outland route — CCIP native mint + CCTP transport:** Ethereum PortalHub registers Base and Monad vaults. Its Base [ConnectorCCIP](https://etherscan.io/address/0x65805D838a3504d283B92a623081E4b8c5583502#code) authenticates the CCIP router and configured Base peer [`0x386DfFb5a31588aB56Df20C54Ec649F3B554362C`](https://basescan.org/address/0x386DfFb5a31588aB56Df20C54Ec649F3B554362C). The [CCTP/CCIP connector](https://etherscan.io/address/0x3373784A7a52A07F9339aA8F60403420cC602c52#code) configures a Monad peer [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://monadscan.com/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7), CCTP domain 15 and [TokenMessengerV2](https://etherscan.io/address/0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d). CCIP transports remote asset/supply data; a keeper processes that accepted payload and OutlandVault can mint **canonical Ethereum iUSD**. CCTP separately burns/mints underlying USDC and does not itself authorize native iUSD minting. The configured connectors are alternatives by chain, not a two-bridge quorum.

The Base OutlandVault's last L1 mirror reports $68,060.48 assets, 2,738.150369 iUSD and 59,633.385622 siUSD shares at October 2, 23:10:59 UTC. At the matching Base snapshot, [Accounting](https://basescan.org/address/0x2ED079F04211baDA1a4e53F01782217334Cc28ce) reports **$68,166.48**, with 2,739.136192 iUSD and 59,722.392654 siUSD shares. These differ because the mirror is an earlier report, not an exact real-time reconciliation. The Base [ERC4626Farm](https://basescan.org/address/0x127066E1982940c33fDC882D9c138296AB15F97f) holds 65,364.889803 shares of [Steakhouse Prime USDC](https://basescan.org/address/0xbeef0e0834849aCC03f0089F01f4F1Eeb06873C9); `convertToAssets` returns $68,166.48 and `maxWithdraw` returns zero. This small accounted exposure does not bound mint authority.

Monad's L1 mirror reports **$23.01**, 4.899 iUSD and 7.321345 siUSD shares at October 3, 16:11:23 UTC. **TODO:** remote supply, collateral, governance and connector verification are excluded by requester instruction; do not present the small L1 report as verified remote reserves or infer zero funds. Any expansion requires remote verification. [Bridge index](https://github.com/yearn/risk-score/blob/master/src/data/bridges.json) records LayerZero as lock, CCIP as mint and CCTP as transport.

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
| **UnwindingModule** | [`0x7092A43aE5407666C78dBEa657a1891f42b3dFcc`](https://etherscan.io/address/0x7092A43aE5407666C78dBEa657a1891f42b3dFcc) | Handles forced liquidation of illiquid positions (e.g. Pendle fixed-term). `CriticalLoss` = losses during unwinding exceed module balance. |

Monitor timelock schedules for privileged configuration and upgrades, and monitor Core, farms and PortalHub directly for operational changes. Core's minor-role grants, keeper processing, rebalancing, accrual and pauses can occur without a timelock event. Timelock monitoring alone does not cover these paths.

### Governance Monitoring (Timelocks + Multisig)

Decode timelock events to identify configuration and upgrade actions. Also monitor Core's `RoleGranted`, `RoleRevoked` and `RoleAdminChanged`: operational roles can change through the Safe directly, and contract-held roles have their own execution paths.

| Contract | Event | Significance |
|----------|-------|-------------|
| **Long/Short Timelock** | `CallScheduled(bytes32 id, uint256 index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)` | New governance action proposed — decode `data` to understand what will change. Early warning window (7d or 24h). |
| **Long/Short Timelock** | `CallExecuted(bytes32 id, uint256 index, address target, uint256 value, bytes data)` | Governance action executed — verify expected outcome |
| **Long/Short Timelock** | `Cancelled(bytes32 id)` | Scheduled action cancelled — may indicate contested governance |
| **Long/Short Timelock** | `MinDelayChange(uint256 oldDuration, uint256 newDuration)` | Timelock delay changed — reduction is critical |

### Non-Timelocked Events — Immediate Alert

These events bypass the timelock and can be triggered directly by the multisig or individual role holders.

| Contract | Event | Triggered By | Significance |
|----------|-------|-------------|-------------|
| **Any CoreControlled** | `Paused(address account)` | 8 PAUSE-role holders (multisig + Long Timelock + EmergencyWithdrawal + MaturedFarmCleaner + 4 individual EOAs) | Emergency pause — no multisig or timelock required when triggered by an EOA pauser |
| **Any CoreControlled** | `Unpaused(address account)` | Multisig (UNPAUSE, no timelock) | System resumed |
| **EmergencyWithdrawal** | `EmergencyWithdraw(uint256 timestamp, address farm, uint256 amount)` | Multisig (no timelock) | Emergency fund extraction from farm |

### Protocol Health Events — Immediate Alert

Autonomous events triggered by protocol state, not governance actions.

| Contract | Event | Significance |
|----------|-------|-------------|
| **ORACLE_IUSD** | `PriceSet(uint256 timestamp, uint256 price)` | iUSD price changed — price below 1.0 = de-peg (loss socialization to iUSD holders) |
| **LockingController** | `LossesApplied(uint256 timestamp, uint256 amount)` | First-loss tranche consuming — liUSD holders taking losses |
| **siUSD** | `VaultLoss(uint256 timestamp, uint256 epoch, uint256 assets)` | Losses cascading past first-loss tranche to siUSD holders |
| **UnwindingModule** | `CriticalLoss(uint256 timestamp, uint256 amount)` | Losses during forced liquidation of illiquid positions exceed module balance |

### Key State to Poll

- **TVL**: `Accounting.totalAssetsValue()`, cross-checked against DefiLlama.
- **Instant-exit ratio**: `Accounting.totalAssetsValueOf(1)` (the LIQUID bucket) divided by total TVL. This — not `totalAssetsValueOf(0)`, which is controller float and sits near zero by design — is the instant-redemption capacity.
- **Queue state**: `RedeemController.queueLength()`, `totalEnqueuedRedemptions()`, `totalPendingClaims()`. Any non-zero value signals a material change from the observed no-queue record.
- **Notice-period concentration**: per-farm `assets()` and `duration()` where available; use `maturity() - block.timestamp` for FxSaveFarm and `maturityOffset()` for OutlandFarm. Track 7 / 28 / 56-day notice exposure.
- **Escrow accounting**: poll `lastUpdatedAt()`, `totalAssets()` and `liquidity()` on the four funded escrows listed in Appendix A, plus `RWAEscrowRateManager.rates(escrow)`. A timestamp older than 48 hours indicates an accrual/keeper outage; a fresh timestamp does **not** prove reserves. Obtain current counterparty NAV/holding attestations independently and reconcile them to book value.

- **First-loss coverage**: poll `LockingController.totalBalance()`, its iUSD balance and the UnwindingModule iUSD balance daily. Compare the $14.00M notional with Fasanara's combined $23.89M and the $31.12M total RWA book; alert on coverage below 50% and 40%, respectively. Values in unwind may leave the loss buffer as exits complete.
- **Portal mint path**: monitor PortalHub `AssetsUpdateReceived`, `MessageQueued`, `MessageProcessed`, connector changes and upgrades; poll both OutlandVault `portalAssetsReport()` values and token balances hourly. Compare Base's live accounting and supplies with the last mirrored L1 report. Alert on an unexplained mint or report divergence, `bridgePaused()` changes, or growth of the Monad L1 book above $10,000; the latter requires a full remote verification before increasing exposure.
- **Controls and liquidity**: poll both timelock delays, all six minters and their admins daily; alert immediately on changes. Treat LIQUID-bucket book value as a ceiling and cross-check per-farm `liquidity()` and `paused()` hourly. The three funded liquid farms report full liquidity at the snapshot; this is not a guarantee against future underlying pauses or utilization changes.

## Risk Summary

### Key Strengths

- Multiple established audits, formal verification, ongoing reviews and an active bounty; current implementation-specific coverage remains TODO.
- Same 4-of-8 Safe owner set, renounced Core default admin, 7-day upgrades and 24-hour parameter delay.
- $4.94M reported instant liquidity; 805 incremental redemptions worth $48.33M with no queue events.
- Registered farm book values reconcile exactly to Accounting; asset/share conversions and cross-chain report age are observable.

### Key Risks

- **Current RWA backing is unverified:** $31.12M (70.4%) consists of keeper-accrued balances; recent timestamps do not attest reserves.
- **Issuer concentration:** Fasanara holds 54.1% of the book; the $14.00M first-loss notional covers only 58.6% of that exposure.
- **Native mint bridge path:** two OutlandVaults can mint iUSD using CCIP-sourced reports processed by an operational keeper. Current small remote allocations do not bound potential dilution.
- **Liquidity mismatch:** 88.8% of assets have operational/notice-period exits, while siUSD-held iUSD is $29.86M; secondary-market depth is negligible at allocator sizes.
- **f(x) concentration:** 18.3% depends on fxSAVE/fxUSD solvency, oracles, upgrades, unstaking and swaps.
- **TVL decline:** current TVL is 76.8% below the January peak, including a 10.5% daily-series decline September 28→29.
- **Evidence gaps:** current independent RWA holdings/custody attestations, legal rights, deployed upgrade audit scope, and Monad remote state.

### Critical Risks

**Unverifiable-reserves gate:** onchain accounting and identity disclosure are insufficient to verify current reserve existence and value for the dominant RWA book. Obtain current counterparty holding/NAV and custody attestations, reconcile them to the four escrow balances and review the legal claims before lifting GATED status. No exploit or realized-loss status is assigned by this gate.

## Risk Score Assessment

### Critical Risk Gates

- [x] **Unverified contract source — PASSED:** assessed siUSD, all registered Ethereum farms, six Ethereum minters and the three material proxy implementations have verified source. Monad remote coverage is explicitly excluded.
- [x] **No audit — PASSED:** reputable base-protocol audits exist; deployed Gateway V4/PortalHub/OutlandVault upgrade coverage is TODO.
- [ ] **Unverifiable reserves — TRIGGERED:** 70.4% of the current book is keeper-accrued RWA value without established current reserve proof. GDADF/Genesis public statements are dated April/February, and no current New Silver/FalconX reserve reconciliation was established. See Provability and Appendix A.
- [x] **Total centralization — PASSED:** 4-of-8 Safe and dual timelocks, with operational roles separately identified.

The triggered gate sets **Final Score = 5.00** and **Status = GATED**. The category calculation below remains visible for comparability and does not override the gate.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Audits — 2.0:** established Spearbit/Cantina and Certora work, public competition and active bounty. **History — 2.5:** approximately 16 months live, but current $44.20M TVL is below the framework's $50M score-2 scale criterion; the production record is longer than score 3's 6–12 months. Use the conservative intermediate score. Upgrade-specific audit scope remains unresolved.

**Score: 2.25/5** — (2.0 + 2.5) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance — 2.8:** same 4-of-8 Safe, 7-day implementation upgrades and now 24-hour parameter/oracle delay. The threshold remains below the rubric's strongest governance examples; role and configuration changes remain powerful. Operational rebalancing, pausing and keeper powers are evaluated below.
- **Programmability — 3.5:** redemption mechanics and loss ordering execute onchain; 70.4% of book value relies on configured RWA accrual and governance overrides. Cross-chain reports additionally require CCIP authentication and keeper processing, with native minting based on reported remote supply/assets.
- **Dependencies — 4.0:** Fasanara concentration 54.1%, New Silver/FalconX exposure, f(x) 18.3%, multiple liquid venues, and a native mint bridge path. Disclosure of counterparty names improves attribution but does not establish reserve quality.

**Score: 3.43/5** — (2.8 + 3.5 + 4.0) / 3 ≈ 3.43.

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization — 5.0:** book backing is 100.0004%, but current economic backing of the dominant RWA book is unverified; this is also the critical gate.
- **Provability — 4.0:** allocation and accounting are transparent, but current RWA values are self-reported/configured-rate accrual. Dated fund statements and investor material do not independently establish today's reserves. The first-loss notional covers 45.0% of the RWA book and 58.6% of combined Fasanara exposure.

**Score: 4.5/5** — (5.0 + 4.0) / 2.0.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 3.0/5** — $4.94M reported immediate liquidity across three venues and an observed no-queue redemption record support functional exits. The buffer covers only 16.6% of siUSD-held iUSD, 88.8% of assets depend on non-instant exits, Base's small vault has zero `maxWithdraw`, and no substantial secondary-market exit is established. Notice horizons do not guarantee cash. The reserve-proof gate is scored separately.

#### Category 5: Operational Risk (Weight: 5%)

**Score: 2.5/5** — established contributors, disclosed funding, useful technical docs and contracted monitoring. Current reserve evidence, legal enforceability, a public incident-response plan and deployment-specific upgrade review scope remain incomplete. The public security page's 4/7 Safe description differs from the verified 4/8 state, illustrating why mutable controls are checked onchain.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|---|---:|---:|---:|
| Audits & Historical | 2.25 | 20% | 0.450 |
| Centralization & Control | 3.43 | 30% | 1.029 |
| Funds Management | 4.50 | 30% | 1.350 |
| Liquidity Risk | 3.00 | 15% | 0.450 |
| Operational Risk | 2.50 | 5% | 0.125 |
| **Ungated weighted score (rounded down)** | | | **3.40** |
| **Final Score (reserve-proof gate)** | | | **5.00** |

### Risk Tier

**Final Risk Tier: HIGH RISK (GATED)**

The ungated weighted score falls in the Medium band. The final score is 5.00 because current reserve existence/value has not been verified for the dominant RWA exposure. This is a live-protocol evidence gate, not a terminal HACKED/DEAD classification.

## Reassessment Triggers

- **Time-based:** reassess within 30 days (November 3, 2026), or immediately when current reserve evidence becomes available.
- **Reserve-proof:** current counterparty holding/NAV, custody and enforceable-claim evidence reconciled to every funded RWA escrow is required to consider lifting GATED status. A keeper timestamp or API label alone is insufficient.
- **Liquidity:** any nonzero queue/pending claims; reported liquid capacity below 5% of TVL for seven days; underlying liquid-farm pause or withdrawal restriction.
- **TVL:** >30% movement from $44.20M, or another >10% daily withdrawal wave.
- **Concentration / coverage:** Fasanara above 60%, total RWA above 80%, any other issuer above 40%, first-loss coverage below 50% of Fasanara or 40% of RWA exposure.
- **Duration:** a funded farm's notice/exit horizon increases, or significant capital moves from 7-day into 28/56-day positions.
- **Governance / mint:** Safe owner or threshold changes, role-admin changes, new minters, proxy upgrades, timelock-delay reductions, connector/peer/vault changes, or unexplained portal-generated mints.
- **Remote expansion:** Monad L1 book exceeds $10,000 or any planned allocation increase; require remote RPC/source/governance/reserve verification. Material Base growth or persistent unexplained mirror divergence also requires review.
- **Incident / counterparty:** loss events, depeg, oracle failures, counterparty default/restructure, missing cash after an actual redemption notice, or keeper timestamps older than 48 hours.

## Appendix A: Top Farm Exposure Analysis

Eight registered farms exceed $100,000 and account for >99.8% of TVL; Base adds $68,060.48 and Monad is $23.01 in the Ethereum ledger. All material allocations and discarded residual farms are reconciled in [snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/infinifi-2026-10-03.json).

| Position / farm | Implementation | Bucket / notice | Assets | Share |
|---|---|---|---:|---:|
| [`Fasanara GDADF (labelled mGLOBAL)`](https://etherscan.io/address/0x2fa5E6C5549BEdF98A935Cac3BB4337459c74897) | RWAEscrowRouterFarm | MATURITY 28d | $21.29M | 48.2% |
| [`f(x) fxSAVE`](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363) | FxSaveFarm | MATURITY 7d | $8.07M | 18.3% |
| [`New Silver`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | RWAEscrowFarm | MATURITY 56d | $5.20M | 11.8% |
| [`Fasanara Genesis`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | RWAEscrowFarm | MATURITY 28d | $2.61M | 5.9% |
| [`Cap stcUSD`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | CapFarm | LIQUID | $2.22M | 5.0% |
| [`Aave V3 USDC`](https://etherscan.io/address/0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580) | AaveV3Farm | LIQUID | $2.22M | 5.0% |
| [`FalconX Institutional`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | RWAEscrowFarm | MATURITY 7d | $2.02M | 4.6% |
| [`Spark sUSDC`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | SparkSUSDCFarm | LIQUID | $494,191.65 | 1.1% |
| [`Outland Base`](https://etherscan.io/address/0xbD6c2d1C4809a5D8847FbA3a3cf7d6BDf6b6C3bA) | OutlandFarm | MATURITY 7d | $68,060.48 | 0.2% |
| [`Outland Monad (L1 book value)`](https://etherscan.io/address/0xA7c1DAEAA5D97e1319B4Ff6Cdf658F5C4582A27E) | OutlandFarm | MATURITY 7d | $23.01 | <0.1% |

### RWA farms: shared rate accounting and concentrated credit

| Farm exposure | Escrow | Receiver | Notice | Book value | Configured annual rate |
|---|---|---|---|---:|---:|
| Fasanara GDADF | [`0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E`](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E) | Escrow router itself; permitted external calls | 28d | $21.29M | 6.20% |
| New Silver | [`0x1532f095F8daa79d22a2475FD50c7109add394bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) | [`0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) | 56d | $5.20M | 11.25% |
| Fasanara Genesis | [`0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) | [`0x4831C121879d3DE0E2B181d9d55E9B0724f5D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) | 28d | $2.61M | 7.51% |
| FalconX Institutional | [`0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C) | [`0xf7583D86D9fB25391Af6e30ad17786572792d83c`](https://etherscan.io/address/0xf7583D86D9fB25391Af6e30ad17786572792d83c) | 7d | $2.02M | 6.05% |

Counterparty attribution is from the [current vault disclosures](https://docs.infinifi.xyz/vaults), not inferred from receiver addresses. All four use [`RWAEscrowRateManager`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189), share the October 3 18:37:59 UTC accounting timestamp and report **zero liquidity**. `harvest` grows/reduces book assets at the configured rate; `governanceUpdateTotalAssets` can override them. This creates a common valuation dependency over $31.12M.

GDADF is described by the issuer as asset-backed receivables/private credit, rather than the Genesis digital-asset arbitrage strategy. The GDADF router holds **zero** [mGLOBAL tokens](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8), so its API label does not establish tokenized custody or an onchain NAV conversion. The prior MidasFarm is empty and removed. **TODO:** verify current note ownership, custody and redemption rights, the router's complete external target allowlist, and reconcile both Fasanara books to current independent statements. New Silver and FalconX also require current reserve/holding proof; identifying their names does not prove their ability to return cash.

### f(x) fxSAVE: onchain position with operational exits

FxSaveFarm [`0x78A31bD6cAca12BdF83F8A608076006C1F58F363`](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363) holds **7,195,150.270592 fxSAVE shares**, no loose fxUSD and no active `lockedProxy`. The [fxSAVE wrapper](https://etherscan.io/address/0x7743e50F534a7f9F1791DdE7dCD89F7783Eefc39) `previewRedeem` returns **7,989,717.880626 base-pool shares**. Farm `assets()` values the base pool's fxUSD/USDC outputs through Accounting, yielding $8.07M; `liquidity()` is zero. [Verified farm source](https://etherscan.io/address/0x78A31bD6cAca12BdF83F8A608076006C1F58F363#code) requires `FARM_SWAP_CALLER` to begin/complete unstaking and swap fxUSD to USDC, with `maxSlippage = 0.999e18` (0.1% tolerated value loss). The rolling seven-day horizon is not an automatic distribution of USDC. Underlying solvency, oracles, upgrade powers and swap execution are material at 18.3% of TVL.

### Liquid farms and remote positions

Cap [`0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694), Aave V3 [`0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580`](https://etherscan.io/address/0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580) and Spark [`0xd880D7C5CaFdbE2AEc281250995abF612235e563`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) jointly report $4.94M assets/liquidity. Their sources trace Cap's stcUSD→cUSD unwind, Aave principal withdrawal through [Aave V3 Pool](https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2) (`lendingPool()` getter) and Spark's sUSDC→Sky/USDC route; any underlying pause or liquidity shortfall can reduce atomic redemption capacity. No single liquid venue now supplies more than half the buffer.

The Base share conversion verifies a $68,166.48 remote asset book at the synchronized Base snapshot, compared with the older $68,060.48 L1 mirror. The vault's zero `maxWithdraw` limits immediate recovery. Monad's $23.01 is only an L1 mirror. Both mainnet vaults remain material graph nodes because they have mint authority; current position size is not a mint cap.

## Appendix B: Contract Architecture

```text
USDC / enabled assets → Gateway V4 → MintController → iUSD
                                              ↓ stake
                                           siUSD
liUSD / LockingController → first-loss → siUSD losses → iUSD price losses

iUSD backing → FarmRegistry / Accounting
               ├─ Liquid: Cap + Aave V3 + Spark → BeforeRedeemHook → USDC exit
               ├─ RWA: GDADF + Genesis + New Silver + FalconX
               │        └─ one configured-rate manager → reported book values
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
| [October 4, 2026](https://github.com/yearn/risk-score/pull/510) | 5.00 | Reassessment — GATED for missing current reserve proof: 70.4% keeper-accrued RWA book; 24h Short Timelock, Gateway V4, six minters and CCIP/CCTP paths verified; Monad remote state excluded by request. Ungated weighted score 3.40. |
