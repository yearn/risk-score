# Protocol Risk Assessment: InfiniFi

- **Assessment Date:** February 4, 2026 (Updated: July 4, 2026; July 29, 2026)
- **Token:** siUSD (Staked iUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)
- **Final Score: 3.2/5.0**

## Overview + Links

InfiniFi is a stablecoin protocol that allows users to deposit assets (USDC, USDT) to mint iUSD, a stablecoin pegged to the US Dollar. The protocol automatically deploys deposited collateral into a portfolio of farm contracts grouped by the `FarmTypes` library into **PROTOCOL** (idle protocol float), **LIQUID** (instant principal withdrawal) and **MATURITY** (principal available after a rolling notice period). As of this assessment the largest allocations are Midas-tokenized **Fasanara Global** (~51% of TVL, 28-day notice), four **offchain RWA escrow** positions (~33% combined, 7–56 day notice), **Cap Protocol stcUSD** (~7%, instant), an **Aave V4 USDG** market (~4%), **Steakhouse MetaMorpho** (~2%), and a **Spark sUSDC** position (~2%, instant). Roughly **84% of TVL sits in offchain-custodied or NAV-attested positions** (Midas mGLOBAL + the four RWA escrows). See Appendix A for detailed analysis of the largest farm deployments.

**Note on farm "maturities".** Every MATURITY-type farm is constructed as `perpetual`, so [`MaturityFarm.maturity()`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271#code) returns `block.timestamp + duration` — a **rolling notice period**, not a fixed calendar date. Sampling `MidasFarm.maturity()` across blocks returns exactly `now + 28 days` at every point. The economically meaningful figure is therefore each farm's `duration` (1, 7, 28 or 56 days), which is how the self-laddering engine matches asset duration to liUSD lock duration. Calendar dates derived from `maturity()` are snapshots of that rolling window and must not be read as settlement deadlines.

The protocol offers three tiers of tokens:

1. **iUSD**: The base stablecoin (deposit receipt). Not yield bearing directly but liquid.
2. **siUSD**: Staked iUSD. Yield-bearing and liquid (can be exited via secondary markets).
3. **liUSD**: Locked iUSD. Highest yield, governance power, but locked for 1-13 weeks. Serves as "first loss" capital.

**Links:**

- [Protocol Documentation](https://docs.infinifi.xyz/)
- [Protocol App](https://infinifi.xyz/)
- [Protocol Analytics](https://stats.infinifi.xyz/)
- [GitHub](https://github.com/InfiniFi-Labs/infinifi-protocol)
- [Audits](https://docs.infinifi.xyz/audits)


## Contract Addresses

All contracts verified on Etherscan. Compiled with Solidity 0.8.28 (except Gnosis Safe: 0.7.6).

**Core / Governance:**

- **iUSD (ReceiptToken)**: [`0x48f9e38f3070AD8945DFEae3FA70987722E3D89c`](https://etherscan.io/address/0x48f9e38f3070AD8945DFEae3FA70987722E3D89c) — ERC20, restricted mint/burn via CoreControlled roles
- **siUSD (StakedToken)**: [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) — ERC4626 vault wrapping iUSD
- **InfiniFiCore (AccessControl)**: [`0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490`](https://etherscan.io/address/0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490) — Central AccessControlEnumerable, 19 roles enumerated. DEFAULT_ADMIN_ROLE has 0 holders (renounced).
- **Gateway (Proxy)**: [`0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5`](https://etherscan.io/address/0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5) — TransparentUpgradeableProxy → InfiniFiGatewayV3 (`0xb44e494535A8fC1f0081F4F9289BCc7c57FbffB6`)
- **Gateway ProxyAdmin**: [`0x21071E0f9D600571Ffe47873e95fffF2FAc9141c`](https://etherscan.io/address/0x21071E0f9D600571Ffe47873e95fffF2FAc9141c) — Owned by Long Timelock (7-day delay for upgrades)
- **Accounting**: [`0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3`](https://etherscan.io/address/0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3) — aggregates farm TVL via FarmRegistry
- **FarmRegistry**: [`0xF5f2718708f471e43968271956CC01aaA8c46119`](https://etherscan.io/address/0xF5f2718708f471e43968271956CC01aaA8c46119) — canonical list of approved farms (23 enumerated: 5 PROTOCOL, 5 LIQUID, 13 MATURITY; 10 are funded, the rest sit at $0 / dust)
- **YieldSharing (Proxy → V3)**: [`0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b`](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b) — TransparentUpgradeableProxy → YieldSharingV3 (`0x0d5dBF208A9a7540018D204a9A0aD08A091407e5`).
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
- **iUSD Oracle (FixedPriceOracle)**: [`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`](https://etherscan.io/address/0x8ABc952f91dB6695E765744ae340BC5eA4B344c1) — `price()` = `1.0e18` confirmed onchain (no de-peg event)

**Team Multisig & Timelocks:**

- **Team Multisig**: [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) — Gnosis Safe v1.4.1, **4/8 threshold**, 8 EOA signers, nonce 544.
- **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — 604,800s delay (verified)
- **Short Timelock (1 hour)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` returns **3,600s (1 hour)**, verified onchain 2026-07-29. This is the delay governing PROTOCOL_PARAMETERS, ORACLE_MANAGER (setOracle/setPrice), and farm add/remove actions — the early-warning window for those changes is one hour.

**Active farms** (see Funds Management § Asset Allocation for full table and Appendix A for risk analysis).

## Audits and Due Diligence Disclosures

InfiniFi has undergone extensive security review via Certora, Spearbit/Cantina Code, and a Cantina public competition, plus multiple ongoing upgrade reviews.

- **Spearbit / Cantina Code** (March-April 2025): Main protocol security review. Report published April 1, 2025. Findings: **8 High, 6 Medium, 25 Low, 4 Gas, 24 Informational**. Auditors: Noah Marconi (Lead), R0bert (Lead), Slowfi, Jonatas Martins. [Report PDF](https://raw.githubusercontent.com/spearbit/portfolio/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf).
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

### Bug Bounty

- [Bug Bounty Program on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591)

## Historical Track Record

- **Production History**: The protocol launched in June 2025 with a points program beginning June 1, 2025, designed to reward participation during its six month launch phase.
- **TVL**: $60.40M (verified onchain via `Accounting.totalAssetsValue()` and corroborated by [DefiLlama](https://defillama.com/protocol/infinifi) at $60.38M on 2026-07-29). TVL has declined from a $190.49M peak on 2026-01-07, through ~$65M in early July to ~$60M — a slow, steady contraction (-7.5% over the last 30 days) rather than a run.
- **Redemption record**: the FIFO redemption queue has **never been used**. Across the RedeemController's full history (deployed 2025-05-22, [`0x0c38…253b`](https://etherscan.io/tx/0x0c3824f77664a36c793b52ba47742cf823d043a274a7460925a5e62774b6253b)) there are 5,909 `Redeem` events totalling **~$713M of USDC paid out same-block** and **zero** `RedemptionQueued`, `RedemptionFunded`, `RedemptionPartiallyFunded` or `RedemptionClaimed` events. The largest single instant redemption was **$17.84M** in March 2026 ([`0xdaaf…a900`](https://etherscan.io/tx/0xdaaf87cc042356c36f23c4fbbac1675817eaed8c45cec26c462089d173dca900)). July 1–29, 2026 saw $10.75M redeemed across 194 transactions, all instant.
- **Incidents**: No reported security incidents or exploits found. iUSD oracle reports 1.0 — no loss-socialization event.
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.
- **liUSD unwinding**: The `UnwindingModule` holds ~8.85M iUSD and `LockingController.totalBalance()` is $19.71M. The first-loss tranche has been contracting as liUSD positions complete their early-exit process.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed via farm contracts grouped into three buckets by the [`FarmTypes`](https://etherscan.io/address/0x4b2bFe49829dE3632449928507452EE667f61395#code) library: **PROTOCOL** (type 0 — "not generating any yield but capable of storing funds", i.e. controller float), **LIQUID** (type 1 — "instant principal withdrawals"), and **MATURITY** (type 2 — principal available after the farm's `duration` notice period). The current portfolio is heavily concentrated in tokenized RWA (Midas-Fasanara) and offchain RWA escrow positions, with smaller onchain positions in Cap Protocol stcUSD, an Aave V4 USDG market, Steakhouse MetaMorpho, Spark sUSDC, and a residual Sentora PRIME basket. **Critical: the two largest exposures — Midas mGLOBAL and the four RWA escrows, ~84% of TVL combined — are offchain-custodied. See Appendix A.**
- **Asset Allocation** (verified onchain via `Accounting.totalAssetsValueOf(type)` and per-farm `assets()` / `liquidity()`, 2026-07-29):

  | Bucket | Value (USD) | Share | Withdrawal terms |
  |--------|------------:|------:|------------------|
  | PROTOCOL (controller float) | ~$0.7 | ~0% | Idle, immediate |
  | **LIQUID (instant principal)** | **$5.45M** | **9.0%** | Same-block, pulled automatically on redemption |
  | MATURITY (notice period) | $54.94M | 91.0% | 7 / 28 / 56-day rolling notice |
  | **Total** | **$60.40M** | 100% | |

  **Key observation**: instant-redemption capacity is the **LIQUID bucket ($5.45M, 9.0% of TVL)** — not the PROTOCOL bucket. `BeforeRedeemHook.beforeRedeem` pulls from `FarmTypes.LIQUID` farms *inside the user's own `redeem()` transaction*, so a redeemer draws on the Cap and Spark positions atomically without any keeper action. Verified example: redemption [`0xeac0…1b50`](https://etherscan.io/tx/0xeac0431ac3074b1dc08c22b170df2cdad349c903b7fd93315671c83cccac1b50) paid **$662,752** in one transaction by unwinding both `SparkSUSDCFarm` (sUSDC → USDS → Sky LitePSM → USDC) and `CapFarm` (stcUSD → cUSD → Morpho → USDC) in the same call. The PROTOCOL bucket sits at ~$0.67 because the protocol deliberately holds no idle float, not because exit capacity is absent.

  Farms by deployed value:

  | Farm | Bucket | Target | Assets | Share |
  |------|--------|--------|-------:|------:|
  | [`MidasFarm`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF) | MATURITY 28d | mGLOBAL — Midas Fasanara Global ([`0x7433…98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)) | $31.02M | 51.4% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | MATURITY 7d | RWA escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) → receiver = **Team Multisig** [`0x8060…400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) | $10.29M | 17.0% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | MATURITY 56d | RWA escrow [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) → receiver [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) (EOA). **Counterparty TODO.** | $5.09M | 8.4% |
  | [`CapFarm`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | **LIQUID** | stcUSD — Cap Protocol staked cUSD ([`0x8888…8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)); `liquidity()` = full balance | $4.41M | 7.3% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | MATURITY 28d | RWA escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) → receiver [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) (EOA). **Counterparty TODO.** | $2.58M | 4.3% |
  | [`AaveV4Farm`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657) | MATURITY 7d | Aave V4 USDG market — Global Dollar ([`0xe343…491D`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D)) | $2.25M | 3.7% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | MATURITY 7d | RWA escrow [`0x1B3A…927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C) → receiver [`0xf758…d83c`](https://etherscan.io/address/0xf7583D86D9fB25391Af6e30ad17786572792d83c) (EOA). **Counterparty TODO.** | $2.00M | 3.3% |
  | [`ERC4626FarmWithMaturity`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78) | MATURITY 7d | Steakhouse infiniFi USDC ([`0xBEEF…3aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9)) — dedicated MetaMorpho V1.1 vault | $1.13M | 1.9% |
  | [`SparkSUSDCFarm`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | **LIQUID** | Spark savings USDC; `liquidity()` = full balance | $1.04M | 1.7% |
  | [`SwapFarmV2WithMaturity`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) | MATURITY 7d | Residual Sentora PRIME ([`senPYUSDPRIMEv2`](https://etherscan.io/address/0xC21b08C16458202593D4D9B26b9984Ee67b38BbD)); PYUSD and USDC legs fully withdrawn | $0.59M | 1.0% |
  | Remaining (dust / unfunded) | mixed | `AaveV3Farm` ×2, `ERC4626Farm`, `MapleFarm`, `FxSaveFarm`, `SwapFarmV2WithMaturity` [`0x84FF…E4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) ($14.61 of PYUSD), `RWAEscrowRouterFarm` [`0x9A0d…B885`](https://etherscan.io/address/0x9A0dB2aAC4e3a6a0324021d3a3Fe51Ddb18Bb885) ($5.00), `MintController`, `LiquidationFarm`, `PrimeBrokerFarm`, `SwapFarmV2` [`0xeb32…6fd7`](https://etherscan.io/address/0xeb32a309405c72253d5dB9ef28310A8Ff56b6fd7) — all $0 or dust | ~$0.00M | <0.1% |

  Notable concentrations: **Midas-Fasanara mGLOBAL ≈ 51%**, **offchain RWA escrow (4 farms) ≈ 33%**, **Cap Protocol stcUSD ≈ 7%**, **Aave V4 USDG ≈ 4%**, **Steakhouse MetaMorpho ≈ 2%**, **Spark sUSDC ≈ 2%**.

  The book is highly consolidated: ten funded farms, and the single Midas position is more than half of TVL. The offchain RWA escrow footprint is **four farms totalling $19.96M (33.0%)**, all valued by the same keeper. `AaveV3Farm` (Horizon), `ERC4626Farm`, `MapleFarm` and `FxSaveFarm` currently hold $0. The `SwapFarmV2WithMaturity` at [`0x84FF…E4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) holds 14.611656 PYUSD — $14.61, not $14.6M; PYUSD carries 6 decimals and the position is dust.

- **Risk Hierarchy**: Losses are socialized based on a "liability ladder":
  1. liUSD (Locked) holders take the first loss.
  2. siUSD (Staked) holders take the next loss.
  3. iUSD (Stablecoin) holders are the last to be affected.

### Accessibility

- **Enabled Deposit Assets** (verified onchain via `FarmRegistry.getEnabledAssets()`): USDC ([`0xA0b8…eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)) and USDT ([`0x8292…17eD`](https://etherscan.io/address/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD)). USDe and sUSDe are not enabled on `FarmRegistry`. The protocol's frontend may still accept other assets via wrapper logic — TODO verify gateway behavior.
- **Minting**: Users deposit USDC/USDT through the Gateway → `MintController` to mint iUSD.
- **Redemption**:

  - **Instant**: `Gateway.redeem(to, amount, minAssetsOut)` → `RedeemController.redeem` → `BeforeRedeemHook.beforeRedeem`, which first drains any `MintController` deposit float and then withdraws from `FarmTypes.LIQUID` farms in the same transaction (optimal-farm selection by allocation weights, with a proportional fallback across all LIQUID farms). Instant capacity is therefore **`MintController` float + the LIQUID bucket = ~$5.45M today (9.0% of TVL)**, permissionless and requiring no keeper. `MATURITY`-type farms are never touched by the hook.
  - **Queue**: If a single redemption exceeds available LIQUID liquidity, the residual enters a **FIFO queue** (`RedemptionQueued` → `RedemptionFunded` → `claimRedemption`), fulfilled as capital returns from notice-period farms or new deposits arrive. The queue is currently empty (`queueLength()` = 0, `totalEnqueuedRedemptions()` = 0, `totalPendingClaims()` = 0) and **has never been used since the RedeemController was deployed on 2025-05-22**.
  - **Whitelisting**: No whitelist for redemption; anyone holding iUSD can redeem or enter the queue. `minRedemptionAmount()` = 1 wei, `cap()` = unbounded.

### Token Mint Authority

**Mint mechanism:**

- **siUSD** ([`0xDBDC…7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)): standard ERC-4626 (`StakedToken`) wrapping iUSD. Anyone with iUSD can call `deposit()` / `mint()` and receive siUSD. No privileged role on the share token.
- **iUSD** ([`0x48f9…3D89c`](https://etherscan.io/address/0x48f9e38f3070AD8945DFEae3FA70987722E3D89c)): role-gated mint via `RECEIPT_TOKEN_MINTER` on `InfiniFiCore` ([`0xF6d4…25490`](https://etherscan.io/address/0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490)). Only contracts holding the role can call `mint(...)`. User-facing mint flow: deposit USDC/USDT → `Gateway` → `MintController` → `iUSD.mint`.

**Mint requires backing:** Yes for the user-facing path — `MintController` only mints iUSD against USDC/USDT collateral pulled in the same transaction. The protocol-internal mints (`YieldSharing`, `PLSmoother`) are bounded by the same loss-socialization accounting (PPS can only rise by realized yield) and do not represent admin-mintable supply.

**Per-address mint authority** (verified onchain on May 18, 2026 by enumerating `RECEIPT_TOKEN_MINTER` and `RECEIPT_TOKEN_BURNER` on `InfiniFiCore`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any caller of siUSD `deposit()` / `mint()` | ✓ | ✓ | Permissionless ERC-4626 | Atomic against iUSD |
| [`MintController`](https://etherscan.io/address/0x49877d937B9a00d50557bdC3D87287b5c3a4C256) | ✓ | — | `RECEIPT_TOKEN_MINTER` | User-facing mint controller; only mints against USDC/USDT collateral |
| [`MigrationController`](https://etherscan.io/address/0x5F5403656E4Db95aCcF1064A714B1bcE351839F8) | ✓ | — | `RECEIPT_TOKEN_MINTER` | Additional `ENTRY_POINT` for migrations |
| [`YieldSharing` (proxy)](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b) | ✓ | ✓ | `RECEIPT_TOKEN_MINTER` + `RECEIPT_TOKEN_BURNER` | Distributes farm yield as new iUSD; bounded by realized yield |
| [`PLSmoother`](https://etherscan.io/address/0xC324569141697045B9EdE54B5d4623a691ed57A4) | ✓ | ✓ | `RECEIPT_TOKEN_MINTER` + `RECEIPT_TOKEN_BURNER` | Smooths profit/loss across siUSD epochs |
| [`siUSD` (StakedToken)](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) | — | ✓ | `RECEIPT_TOKEN_BURNER` | Burns iUSD on stcUSD redemptions |
| [`UnwindingModule`](https://etherscan.io/address/0x7092A43aE5407666C78dBEA657a1891f42b3dFcc) | — | ✓ | `RECEIPT_TOKEN_BURNER` | Burns iUSD during liUSD early-exit settlement |
| [`LockingController`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) | — | ✓ | `RECEIPT_TOKEN_BURNER` | Burns iUSD when liUSD positions are slashed |
| [`RedeemController`](https://etherscan.io/address/0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601) | — | ✓ | `RECEIPT_TOKEN_BURNER` | Burns iUSD when redemptions clear the FIFO queue |
| [`PLSmootherHelper`](https://etherscan.io/address/0x215C7fA0E620FCE99Ed4891BCcb7523388b010b8) | — | ✓ | `RECEIPT_TOKEN_BURNER` | Helper for PLSmoother burn flow |

**Adding a new `RECEIPT_TOKEN_MINTER`:** `DEFAULT_ADMIN_ROLE` on `InfiniFiCore` has been renounced (0 holders), so OpenZeppelin's default `grantRole` path is closed. Role grants flow through `GOVERNOR` (held by Long Timelock, 7-day delay). `MINOR_ROLES_MANAGER` (held by multisig + Long Timelock) only covers `PAUSE` / `PERIODIC_REBALANCER` / `FARM_SWAP_CALLER` and explicitly *cannot* add a new mint role — adding a minter requires Long Timelock execution.

**Rate limits / supply caps:** None onchain. Mint capacity is implicitly bounded by deposit-asset supply (USDC/USDT held by `MintController`) and by the `maxLossPercentage` first-loss buffer that auto-pauses on excessive losses.

**Backing check at mint time:**

- **`MintController` path** (user-facing USDC/USDT deposits): **atomic.** Collateral must transfer in the same call before `iUSD.mint(...)` fires. Cannot mint unbacked.
- **`MigrationController` path**: atomic against the migration source (same pull-collateral-then-mint pattern).
- **`YieldSharing` and `PLSmoother` paths** (protocol-internal yield distribution and P&L smoothing): **not atomic with backing.** The minter contract has no `transferFrom(asset, ...)` before `mint(...)`. PLSmoother's [`smoothProfit(receiptTokenProfit, duration)`](https://etherscan.io/address/0xC324569141697045B9EdE54B5d4623a691ed57A4#code) literally calls `ReceiptToken(receiptToken).mint(address(this), receiptTokenProfit)` with no on-chain assertion that USDC has arrived in the protocol — the caller is trusted to only call it when farms have already reported `receiptTokenProfit` of realized USDC profit. The trust surface here is layered:
  1. The `FINANCE_MANAGER` role-holder set (currently 4 contracts: `YieldSharing`, `LiquidationFarm`, `PLSmootherHelper`, and the redeployed [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4), a PROTOCOL-type farm holding $0). No EOA or multisig holds the role directly. Adding a new holder requires `GOVERNOR` (Long Timelock, 7d).
  2. The calling contract correctly accounting realized farm profit before calling `smoothProfit`. A bug in `YieldSharing`'s profit math, or a compromised farm that over-reports yield, would let PLSmoother mint unbacked iUSD. The PLSmoother contract itself would not catch the discrepancy.

**Slashing-order quirk** (from PLSmoother source comment): *"the vesting yield held by this contract … isn't included in the slashing order. As a result, it could hold undistributed rewards (i.e. pending profit) that would otherwise could have been used to mitigate losses."* If losses materialize while iUSD is still mid-vest inside PLSmoother, that pending profit does **not** absorb the loss — losses skip the smoother and hit liUSD / siUSD directly. An audited and acknowledged design property, not a bug, but a real risk-review-relevant point.

### Collateralization

- **Backing**: iUSD is backed by the assets deployed in the underlying strategies.
- **Verification**: The protocol uses a "Self-Laddering Engine" to match asset duration with liability duration (locked periods).
- **Offchain / High-Risk Exposures** (verified onchain, see Appendix A for detail):
  - **Midas-tokenized Fasanara Global (mGLOBAL)** — single largest position at $31.02M (51.4% of TVL). Midas is a tokenization issuer; the underlying is Fasanara Capital's hedge-fund strategy. Custody and valuation are entirely offchain. 28-day notice period.
  - **Four RWA Escrow Farms** — $19.96M (33.0% of TVL): $10.29M via escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) (receiver = the **Team Multisig** itself, 7-day notice), $5.09M via escrow [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) (receiver EOA [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211), 56-day notice), $2.58M via escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) (receiver EOA [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926), 28-day notice), and $2.00M via escrow [`0x1B3A…927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C) (receiver EOA [`0xf758…d83c`](https://etherscan.io/address/0xf7583D86D9fB25391Af6e30ad17786572792d83c), 7-day notice). All four escrows are value-attested onchain by the same keeper/rate manager `RWAEscrowRateManager` ([`0x11F6…4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)), each refreshed within hours of this assessment. Pure trust-based offchain exposure during the notice period.
  - **Cap Protocol stcUSD** — $4.41M (7.3% of TVL), in the LIQUID bucket. Cap is a relatively young (2025) stablecoin issuer.
  - **Aave V4 USDG market** — $2.25M supplied into Aave's V4 Global Dollar (USDG) market, 7-day notice.
- **Token Breakdown** (verified onchain 2026-07-29, all in iUSD-equivalent):

  | Component | Value | Source |
  |-----------|------:|--------|
  | iUSD totalSupply | 60.37M | `iUSD.totalSupply()` |
  | — held by siUSD (Staked) | 40.30M | `iUSD.balanceOf(siUSD)` |
  | — held by LockingController (liUSD active) | 10.86M | `iUSD.balanceOf(LockingController)` |
  | — held by UnwindingModule (liUSD in unwind) | 8.85M | `iUSD.balanceOf(UnwindingModule)` |
  | — circulating / in user wallets and YieldSharing | ~0.36M | residual |
  | siUSD totalSupply | 37.28M shares | exchange rate ≈1.081 iUSD/siUSD |
  | LockingController totalBalance (liUSD) | 19.71M | `LockingController.totalBalance()` |

  The first-loss buffer (`LockingController.totalBalance()` = $19.71M) is **39% of the combined offchain exposure ($50.97M)** and only **64% of the single Midas mGLOBAL position ($31.02M)** — that one position is 1.57× the entire first-loss tranche, so an impairment of roughly two-thirds of mGLOBAL would exhaust liUSD and start cutting into siUSD.

### Provability

- **Transparency**: Reserves and allocations are verifiable onchain via `FarmRegistry.getFarms()` and per-farm `assets()`. Every one of the 23 registered farms is source-verified and identified.
- **Reserves**: Onchain DeFi positions (Cap stcUSD, Spark sUSDC, Aave V4 USDG, Steakhouse MetaMorpho, the residual Sentora basket) are fully verifiable — $9.42M, 15.6% of TVL. The dominant offchain-backed positions — Midas mGLOBAL (51.4%) and the four RWA escrow farms (33.0%) — cannot be independently audited onchain; together they are **84.4% of TVL**, so the large majority of backing rests on offchain attestation funnelled through a single keeper for the escrows and Midas's NAV process for mGLOBAL.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: ~$0.36M circulates outside protocol contracts. Redemption to USDC is instant up to the LIQUID bucket ($5.45M today), drawn atomically inside the redeemer's own transaction.
  - **siUSD**: Staked holders withdraw to iUSD via `siUSD.withdraw()` (ERC4626, no cooldown), then redeem iUSD on the same terms.
  - **liUSD**: Locked positions (1–13 weeks). Early exits route through `UnwindingModule` and incur a slashing penalty; ~8.85M iUSD is currently mid-unwind.
- **Liquidity ladder** (verified onchain 2026-07-29 — each MATURITY farm's `duration` is a rolling notice period, not a calendar deadline):

  | Availability | Value | Share of TVL | Positions |
  |--------------|------:|-------------:|-----------|
  | Instant (same block) | **$5.45M** | 9.0% | Cap stcUSD $4.41M, Spark sUSDC $1.04M |
  | ≤ 7 days | $16.26M | 26.9% | RWA escrow 0x04d5 $10.29M, Aave V4 USDG $2.25M, RWA escrow 0xe919 $2.00M, Steakhouse $1.13M, Sentora residual $0.59M |
  | ≤ 28 days | $33.59M | 55.6% | Midas mGLOBAL $31.02M, RWA escrow 0x9E5e $2.58M |
  | ≤ 56 days | $5.09M | 8.4% | RWA escrow 0x277F |

- **Demonstrated capacity**: the queue has never been used. Since May 2025 the protocol has served 5,909 redemptions worth ~$713M entirely same-block, including a single **$17.84M** redemption in March 2026. Over the last 30 days daily redemptions ranged from ~$2K to ~$1.09M and every one settled instantly. The LIQUID bucket is actively cycled — it moved between $4.2M and $9.4M over July while the PROTOCOL float stayed at $0.67 — so the $5.45M is a managed working buffer, not a residual.
- **Secondary market: effectively nonexistent.** siUSD has **no DEX pair**. iUSD trades only in a Curve iUSD/USDC pool holding ~4,670 iUSD and ~4,374 USDC (~$9K total, ~$40 of daily volume), plus a ~$4K iUSD/frxUSD pool. `get_dy` quotes 996 USDC for 1,000 iUSD but only 4,363 USDC for 10,000 iUSD — a 56% haircut at $10K. Secondary-market exit is not a viable path at any size; primary redemption is the only real exit.
- **Stress profile**: instant capacity is 9% of TVL against $40.30M of siUSD-held iUSD. A correlated exit larger than ~$5.45M pushes the excess into the FIFO queue, where clearing speed depends on offchain counterparties returning cash on 7–56 day notice — Midas/Fasanara for 51% of TVL and four undisclosed escrow receivers for 33%. The ladder has never been tested by a redemption wave larger than the instant bucket.

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
    - _Timelock_: Changes to capital allocation parameters (e.g., Farm Registry updates) use the **Short Timelock** (1 hour delay).
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
    - _Scope_: Adding a new protocol to the allowlist requires a governance vote and must pass through the **Short Timelock** (1 hour delay).
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/8 threshold**, 8 EOA signers (`getOwners()` / `getThreshold()`). Nonce 544.

  | # | Signer | Additional Roles (verified onchain) |
  |---|--------|------------------|
  | 1 | [`0xCC30e7d9dfBc29613E2A1e272cd624aFC3Abe1E9`](https://etherscan.io/address/0xCC30e7d9dfBc29613E2A1e272cd624aFC3Abe1E9) | — (new) |
  | 2 | [`0x7A823623B18335A9c1284AC45315fe89972FD421`](https://etherscan.io/address/0x7A823623B18335A9c1284AC45315fe89972FD421) | — |
  | 3 | [`0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD`](https://etherscan.io/address/0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD) | EXECUTOR_ROLE |
  | 4 | [`0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61`](https://etherscan.io/address/0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61) | — |
  | 5 | [`0x6DFa1A32604088EB969242AafFb92420F78373f6`](https://etherscan.io/address/0x6DFa1A32604088EB969242AafFb92420F78373f6) | EXECUTOR_ROLE |
  | 6 | [`0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685`](https://etherscan.io/address/0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685) | PAUSE |
  | 7 | [`0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa`](https://etherscan.io/address/0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa) | EXECUTOR_ROLE |
  | 8 | [`0x383965940c950008a4B67BfaA477Fdf6AC91a7F7`](https://etherscan.io/address/0x383965940c950008a4B67BfaA477Fdf6AC91a7F7) | EXECUTOR_ROLE, PAUSE |

- **Timelocks**: Both are custom `Timelock.sol` extending OZ TimelockController. They override `hasRole()` to delegate role checks to the central `InfiniFiCore` contract. Both have DEFAULT_ADMIN_ROLE renounced (immutable role configuration).

  - **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — `getMinDelay()` returns 604,800s (verified 2026-07-29).
  - **Short Timelock (1 hour)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` returns **3,600s (1 hour)** (verified 2026-07-29). The delay governing parameter, oracle, and farm-add/remove actions is one hour — a materially shorter early-warning window than the 7-day Long Timelock, and short enough that offchain monitoring must be near-real-time to react before execution.

  **Timelock-controlling roles on InfiniFiCore** (verified by enumerating `getRoleMember()`, 2026-07-29):

  | Role | Holders |
  |------|---------|
  | PROPOSER_ROLE | 1: multisig (4/8 required to schedule) |
  | CANCELLER_ROLE | 1: multisig (4/8 required to cancel) |
  | EXECUTOR_ROLE | **6**: signers #3/5/7/8 + deployer EOA (`0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22`) **+ the multisig itself** (the multisig can execute its own scheduled proposals) |

  Governance flow: **Multisig proposes (4/8) → Timelock delay → Any 1 of 5 executor EOAs or the multisig itself triggers execution.**

- **GOVERNOR role holders** (verified via `getRoleMemberCount(keccak256("GOVERNOR"))` = 2):
  - Long Timelock ([`0x3D18…48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9)) — full GOVERNOR scope behind 7-day delay
  - FluidRewardsClaimer ([`0xD0ec…241E`](https://etherscan.io/address/0xD0ec80032C0da717BD78B9569321D9069365241E)) — narrowly scoped to claiming Fluid rewards
  - Deployer EOA has renounced GOVERNOR. **DEFAULT_ADMIN_ROLE has 0 holders** on Core (verified).
  - MinorRolesManager holds no roles on Core; minor-role grants go through the multisig (which holds MINOR_ROLES_MANAGER) or the Long Timelock.

- **Actions by timelock tier**:

    **Long Timelock (7 days) — GOVERNOR role (and PROTOCOL_PARAMETERS, PAUSE, MINOR_ROLES_MANAGER it also now holds):**
    enableBucket, setMaxLossPercentage, setAddress (gateway), setAfterMintHook, setBeforeRedeemHook, setYieldSharing, enableAsset, disableAsset, setLendingPool, setSafeAddress, emergencyAction, proxy upgrades (owns ProxyAdmin), all role grants/revokes.

    **Short Timelock (1 hour) — PROTOCOL_PARAMETERS role:**
    setBucketMultiplier, setMinAssetAmount, setSafetyBufferSize, setPerformanceFeeAndRecipient, setLiquidReturnMultiplier, setTargetIlliquidRatio, setCap, setMaxSlippage, addFarms, removeFarms, setEnabledRouter, setPendleRouter, setCooldown, setAssetRebalanceThreshold.

    **Short Timelock (1 hour) — ORACLE_MANAGER role:**
    setOracle, setPrice.
    Verified onchain: ORACLE_MANAGER has 4 holders — Short Timelock, Accounting (`0x7A5C…42B3`), YieldSharing proxy (`0x90E9…AE3b`), and OracleFactory (`0xA2b3…Ed91`).

    **Multisig WITHOUT timelock** (the multisig directly holds these roles on InfiniFiCore):
    | Role | Capability |
    |------|-----------|
    | UNPAUSE (2 holders: multisig + EmergencyWithdrawal) | Unpause any paused contract |
    | EMERGENCY_WITHDRAWAL (1 holder: multisig) | Move funds from farms to predefined safe address, deprecate farms |
    | MANUAL_REBALANCER (4 holders: multisig + Short Timelock + LiquidationFarm + [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4)) | Rebalance funds between whitelisted farms |
    | FARM_SWAP_CALLER (4 holders: multisig + EOA `0x7345…2cbB` + Short Timelock + keeper EOA `0x2Cba…aB1a`) | Trigger swap operations in farms |
    | MINOR_ROLES_MANAGER (2 holders: multisig + Long Timelock) | Grant/revoke PAUSE, PERIODIC_REBALANCER, FARM_SWAP_CALLER |
    | CANCELLER_ROLE / PROPOSER_ROLE | Cancel/propose timelock actions |
    | PAUSE (multisig holds it directly) | Emergency pause |

- **PAUSE role holders** (verified via `getRoleMemberCount(keccak256("PAUSE"))` = **8**):
  - [`0x383965940c950008a4B67BfaA477Fdf6AC91a7F7`](https://etherscan.io/address/0x383965940c950008a4B67BfaA477Fdf6AC91a7F7) (multisig signer #7)
  - [`0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685`](https://etherscan.io/address/0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685) (multisig signer #5)
  - [`0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148`](https://etherscan.io/address/0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148) (EOA)
  - [`0x0652412777f0c1F46b1164d5cdF3295Bdf43F2f2`](https://etherscan.io/address/0x0652412777f0c1F46b1164d5cdF3295Bdf43F2f2) (EOA)
  - [`0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9`](https://etherscan.io/address/0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9) (EmergencyWithdrawal contract)
  - [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) (Long Timelock)
  - [`0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56`](https://etherscan.io/address/0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56) (MaturedFarmCleaner contract)
  - [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) (Multisig)

- **Other onchain role membership** (verified 2026-07-29 by enumerating `keccak256` of each role name in `CoreRoles`):

  | Role | Count | Notable holders |
  |------|------:|-----------------|
  | ENTRY_POINT | 2 | Gateway proxy, MigrationController |
  | RECEIPT_TOKEN_MINTER | 4 | YieldSharing, MintController, PLSmoother, MigrationController |
  | RECEIPT_TOKEN_BURNER | 7 | siUSD, UnwindingModule, LockingController, YieldSharing, RedeemController, PLSmootherHelper, PLSmoother |
  | LOCKED_TOKEN_MANAGER | 1 | LockingController |
  | TRANSFER_RESTRICTOR | 1 | AllocationVoting |
  | FARM_MANAGER | 4 | ManualRebalancer, AfterMintHook, BeforeRedeemHook, EmergencyWithdrawal |
  | FINANCE_MANAGER | 4 | YieldSharing, LiquidationFarm, PLSmootherHelper, [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4) (redeployment, PROTOCOL-type, $0) |
  | FARM_SWAP_CALLER | 4 | Multisig, EOA `0x7345…2cbB`, Short Timelock, keeper EOA `0x2Cba…aB1a` |
  | PERIODIC_REBALANCER | 1 | EOA `0x2Cba…aB1a` (keeper bot) |
  | PROTOCOL_PARAMETERS | 3 | Short Timelock, Long Timelock, MaturedFarmCleaner |
  | DEFAULT_ADMIN_ROLE | **0** | — (renounced) |

- **emergencyAction bypass analysis**: The `Timelock.sol` contract **overrides emergencyAction to a no-op**, preventing any GOVERNOR holder from using it to bypass timelock delays. This is a deliberate safety mechanism confirmed in source code.

### Programmability

- **Hybrid Model**: The "Self-Laddering Engine" algorithmically matches asset duration with liability duration. "Allocators" actively manage the amount of capital deployed to specific allowlisted strategies.
- **Oracle**: Protocol uses Chainlink price feeds for asset pricing to maintain the 1:1 mint ratio and calculate collateral value.
- **Oracle Updates**: Oracles are upgradeable via governance (**Short Timelock**, 1-hour delay). The iUSD price oracle (`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`) is a FixedPriceOracle — price changes only during loss socialization events (de-peg).

### External Dependencies

- **Top dependencies (by deployed value)**: **Midas** (mGLOBAL tokenization layer over Fasanara Capital) 51.4%, **undisclosed RWA escrow counterparties** (four separate escrows; one routes to the team multisig, three to external EOAs — TODO identify) 33.0%, **Cap Protocol** (stcUSD) 7.3%, **Aave (V4) / Global Dollar (USDG)** 3.7%, **Steakhouse-curated Morpho MetaMorpho** 1.9%, **Spark / Sky** (sUSDC, and the Sky LitePSM used to source USDC on unwind) 1.7%, **Sentora PRIME** 1.0%. The Aave V3 (Horizon), Maple Finance, and f(x) Protocol farms currently hold $0. The CoW-Protocol solver set is a settlement dependency for the swap-type farms.
- **Stablecoin dependencies**: USDC and USDT enabled as deposit assets (verified onchain). The protocol also takes indirect exposure to USDG / Global Dollar (via the Aave V4 market), cUSD/stcUSD (Cap), USDS/DAI (via the Spark sUSDC unwind path through the Sky LitePSM), a dust PYUSD balance, and to T-Bill-backed / hedge-fund RWAs (via Midas mGLOBAL and the four RWA escrow counterparties). USDe and sUSDe remain not enabled as deposit assets on FarmRegistry.
- **Cross-chain / bridge dependency (verified July 29, 2026): LayerZero, lock-and-mint.** Both receipt tokens bridge to **Katana** via LayerZero V2 OFT Adapters that **escrow the canonical token on Ethereum** — they hold no mint authority, so a bridge compromise cannot mint native iUSD/siUSD:
  | Token | Ethereum OFT Adapter | Escrowed | Katana native OFT |
  |---|---|---:|---|
  | siUSD | [`0x5f21…c3c0`](https://etherscan.io/address/0x5f2106bb2a5aba6a783dbf29c8d3b09c175bc3c0) | 0 siUSD (fully unwound) | [`0x6894…F92D`](https://explorer.katanarpc.com/address/0x68943c066747690ecDAEB027fa722B090ee6F92D) |
  | iUSD | [`0xdd1c…3005`](https://etherscan.io/address/0xdd1cb2e1aa483e1d94e3e22e70cfbb634fcb3005) | 4.33 iUSD | [`0x9Fa1…1C10`](https://explorer.katanarpc.com/address/0x9Fa1202516916534Ade66962Ee91410d559f1C10) |

  Each adapter's `token()` returns the corresponding mainnet token and its `endpoint()` is the canonical LayerZero V2 `EndpointV2` [`0x1a44…728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c); the Katana side exposes `oftVersion()` and the LZ V2 Katana endpoint `0x6F47…DD5B`. Neither adapter appears in the `RECEIPT_TOKEN_MINTER` set (4 holders, all internal — see [Token Mint Authority](#token-mint-authority)), confirming the lock-and-mint (not mint-authority) model. The siUSD OFT adapter has been fully unwound — all bridged siUSD has returned to Ethereum.
- **Chainlink CCIP: not currently live.** The `OUTLAND_CONNECTOR_CCIP` [`0x4119…dd24`](https://etherscan.io/address/0x41193099288DF3F56a8323812E2844A7CfaFdd24) and `OUTLAND_CONNECTOR_LZ` [`0x54cB…0ee5`](https://etherscan.io/address/0x54cB6634BE99dDF4c7502f8E8f3b8D3f27Ba0ee5) from PR 224 are deployed but hold no iUSD/siUSD. The CCIP `TokenAdminRegistry` was checked on 2026-07-29 and has no code at the expected mainnet address — CCIP may be on a different registry or not deployed to mainnet. **Reassessment trigger:** re-check if a CCIP token pool is registered for iUSD/siUSD or the Outland CCIP connector begins holding value.

## Operational Risk

- **Team**: InfiniFi Labs. Known team. Key contributors identified via GitHub:
  - **eswak (Erwan Beauvois)**: Lead architect. Former European Space Agency engineer, Fei Protocol core dev (2021-2022), Ethereum Credit Guild core dev (2022-2024). Toulouse, France.
  - **RobAnon (@RobAnon94)**: Contributor.
  - **nikollamalic (Nikola Malic)**: Developer.
  - No public team page. GitHub org has zero public members listed.
- **Funding**: $3M Pre-Seed (Feb 2025) led by Electric Capital, with participation from New Form Capital, Axiom, Kraynos Capital, Sam Kazemian (Frax Finance founder), Defi Dad.
- **Legal Structure**: No disclosed legal entity, jurisdiction, or DAO structure. TODO.
- **Documentation**: Technical documentation in the GitHub README is comprehensive. Public docs at [docs.infinifi.xyz](https://docs.infinifi.xyz/) behind Cloudflare protection (content not independently verified).
- **Communication**: Twitter/X at [@infinifilabs](https://x.com/infinifilabs). No public governance forum found (not on Snapshot, Tally, or Commonwealth).
- **Incident Response**: No documented incident response plan found. Emergency capabilities exist via EMERGENCY_WITHDRAWAL role (multisig, no timelock) and system pause (now 8 PAUSE-role holders — multisig, Long Timelock, EmergencyWithdrawal/MaturedFarmCleaner contracts, and four individual EOAs).

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

Note: Contracts whose state changes only via timelocks (InfiniFiCore, Gateway, FarmRegistry, Accounting, MintController, RedeemController, YieldSharingV3, MinorRolesManager, MaturedFarmCleaner, MigrationController, PLSmoother(Helper), AfterMintHook, BeforeRedeemHook, ManualRebalancer, LiquidationFarm, AllocationVoting, OracleFactory, etc.) do not need separate monitoring — all their changes appear as `CallScheduled`/`CallExecuted` on the timelocks.

### Governance Monitoring (Timelocks + Multisig)

All timelocked actions (GOVERNOR, PROTOCOL_PARAMETERS, ORACLE_MANAGER) are captured by monitoring the timelock events. No need to separately monitor downstream contract events that can only be triggered via timelocks.

| Contract | Event | Significance |
|----------|-------|-------------|
| **Long/Short Timelock** | `CallScheduled(bytes32 id, uint256 index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)` | New governance action proposed — decode `data` to understand what will change. Early warning window (7d or 1h). |
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
- **Queue state**: `RedeemController.queueLength()`, `totalEnqueuedRedemptions()`, `totalPendingClaims()`. Any non-zero value is the first time in the protocol's history that redemption demand has exceeded instant capacity, and is a material change.
- **Notice-period concentration**: per-farm `duration()` and `assets()` for MATURITY-type farms, to track how much TVL sits behind 7 / 28 / 56-day notice.
- **Escrow attestations**: `lastUpdatedAt()` and `totalAssets()` on each of the four `RWAEscrow` contracts — a stale `lastUpdatedAt` means the keeper has stopped attesting.

## Risk Summary

### Key Strengths

- Strong risk segmentation design with liability ladder (liUSD first-loss → siUSD → iUSD)
- Comprehensive audit coverage: Spearbit/Cantina Code main review + 6 ongoing upgrade reviews + Certora formal verification + public competition
- Robust governance: 4/8 multisig + dual timelock (7d/1h) + separation of powers. DEFAULT_ADMIN renounced. emergencyAction bypass prevented via no-op override in Timelock.
- All contracts verified onchain; every one of the 23 registered farms is identified and targets its stated protocol/counterparty
- **Redemptions have always been served instantly**: ~$713M across 5,909 redemptions since May 2025 with zero queue events, including a single $17.84M same-block redemption
- Backed by reputable investors (Electric Capital, Sam Kazemian)

### Key Risks

- **84% of TVL is offchain-custodied or NAV-attested**: Midas-Fasanara mGLOBAL (51.4%) plus four RWA escrow farms (33.0%) together represent $50.97M whose backing cannot be verified onchain. This is the dominant risk factor.
- **Single-position concentration above 50%**: Midas-Fasanara mGLOBAL is $31.02M, 51.4% of TVL, behind a 28-day notice period. This is **1.57× the entire liUSD first-loss buffer** ($19.71M).
- **RWA escrow footprint**: four separate `RWAEscrowFarm` positions hold $19.96M (33.0%). Funds sit with offchain counterparties (one escrow's receiver is the team multisig itself; three are external EOAs whose identities are undisclosed), all value-attested by a single onchain keeper. This is the most opaque exposure in the portfolio.
- **Instant exit is only 9% of TVL**: the LIQUID bucket is $5.45M against $40.30M of siUSD-held iUSD. Any correlated exit larger than that falls to the FIFO queue, whose clearing speed depends on offchain counterparties honouring 7–56 day notice. That path has never been exercised.
- **No secondary market**: siUSD has no DEX pair; iUSD's deepest pool holds ~$9K. There is no market-based exit if primary redemption slows.
- **Short Timelock delay is only 1 hour**: parameter, oracle (`setPrice`/`setOracle`), and farm add/remove actions execute after only a 1-hour delay, a narrow early-warning window for those changes.
- **TVL continues to contract**: $60.40M, down 68% from the $190.49M peak on 2026-01-07 and -7.5% over the last 30 days, with the liUSD first-loss buffer also shrinking to $19.71M — signs of ongoing exit pressure.
- **Multisig retains broad non-timelocked powers** — EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, UNPAUSE, MINOR_ROLES_MANAGER, PAUSE, and EXECUTOR_ROLE on InfiniFiCore — so a 4/8 signer set can both propose and execute its own timelock actions and move farm funds to a safe address.
- **Escrow counterparty identities undisclosed**: three of four escrow receivers are external EOAs with no public identification, and one receiver is the team multisig itself — an internal-transfer arrangement whose ultimate use is not onchain-visible.
- **Short operational history** (~14 months in production since June 2025), and the notice-period ladder has never been stress-tested by demand exceeding the instant bucket.
- **No disclosed legal entity or incident response plan**.
- **Certora formal verification** report published but finding severity breakdown not available on the landing page (full PDF required for detailed review).

### Critical Risks

- **Concentrated offchain credit exposure well in excess of the first-loss buffer.** 84.4% of TVL ($50.97M) sits with Midas/Fasanara and four undisclosed escrow counterparties, against a $19.71M liUSD first-loss tranche. The Midas position alone is 1.57× that buffer, so an impairment of roughly two-thirds of mGLOBAL would exhaust liUSD and begin cutting siUSD. Redemption mechanics are sound — instant capacity of $5.45M, drawn atomically, with a 14-month record of never queuing a redemption — so the binding risk for a Yearn allocator is **counterparty credit and valuation, not exit plumbing**: the ladder returns cash on 7–56 day notice only if those offchain counterparties pay, and their identities and financials are not public.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. Multiple audits by reputable firms (Spearbit, Certora, Cantina).
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable onchain.
- [x] **Total centralization** — PASSED. 4/8 multisig with dual timelocks, DEFAULT_ADMIN renounced.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Strong coverage — Spearbit/Cantina Code main review (8H/6M/25L), Certora formal verification ([report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report)), Cantina public competition, multiple upgrade reviews (YieldSharing V2 → V3 upgrade reviewed).
- **History**: ~14 months in production (mainnet launch June 2025; this reassessment July 2026). TVL $60.40M, down 68% from the $190.49M peak on 2026-01-07.
- **Bounty**: [Active on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591).
- **Incidents**: No known exploits or loss events since launch, no depeg, and no loss-socialization event. The operational record is strong on the redemption side: ~$713M paid out across 5,909 redemptions with the FIFO queue never once engaged.

**Score: 2.0/5** — Extensive audit coverage including formal verification and ongoing upgrade reviews, an active bounty, and a 14-month operating record with no loss event and every redemption honoured same-block. The relatively short operating history prevents a minimal-risk score. The untested credit quality of the offchain book is scored under Funds Management and Dependencies rather than double-counted here.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.2**
- 4/8 multisig (Gnosis Safe v1.4.1) with dual timelocks (7d Long for GOVERNOR-scope, 1h Short for parameters).
- DEFAULT_ADMIN_ROLE renounced on Core and both timelocks; `Timelock.emergencyAction` is a no-op override.
- All 8 multisig signers are EOAs; four of them additionally hold EXECUTOR_ROLE and two hold PAUSE.
- The multisig holds EXECUTOR_ROLE on the Long Timelock alongside the deployer EOA and individual signer EOAs, so it can both schedule and execute its own proposals; the timelock delay still applies but the execution gate is not held by a distinct party.
- Short Timelock delay remains **1 hour**. Parameter, oracle, and farm add/remove actions clear after only an hour, materially shrinking the early-warning window for those changes.
- Multisig retains significant non-timelocked direct powers: UNPAUSE, EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, FARM_SWAP_CALLER, MINOR_ROLES_MANAGER, PAUSE.

**Subcategory B: Programmability — 3.0**
- Hybrid model: algorithmic Self-Laddering Engine + active Allocator management. The laddering works as designed — instant-exit capacity is maintained as a managed LIQUID bucket (cycled between $4.2M and $9.4M over the last month) while notice-period assets are matched to liUSD lock durations, and the redemption hook pulls instant liquidity without operator intervention.
- The counterweight is allocator discretion: the same machinery has been used to place 84% of the book with offchain counterparties, a decision no onchain rule constrains.
- Oracle-dependent for pricing (Chainlink + protocol-specific oracles for stcUSD, mGLOBAL, RWA escrow rate manager); ORACLE_MANAGER role is under the Short Timelock (1h).
- emergencyAction safely disabled on timelocks.

**Subcategory C: Dependencies — 4.0**
- Exposure is concentrated in Midas mGLOBAL (51.4%), four RWA escrow counterparties (33.0%), Cap Protocol stcUSD (7.3%), Aave V4 USDG (3.7%), Steakhouse MetaMorpho (1.9%), Spark/Sky (1.7%) and a Sentora PRIME residual (1.0%).
- A **single dependency is 51.4% of TVL** — above the 40% single-farm threshold this report itself flags — and offchain exposure totals $50.97M against a $19.71M first-loss buffer.
- Four separate escrow counterparties: one is the team multisig itself, three are unidentified external EOAs. All four depend on the same onchain keeper for valuation, so one compromised or negligent attester misprices a third of the book.
- Pegs / NAVs depended on: USDC, USDT, cUSD, USDG, USDS/DAI, and the offchain mGLOBAL NAV plus four RWA escrow attestations.

**Score: 3.4/5** — (3.2 + 3.0 + 4.0) / 3 = 3.40. Dependency risk dominates: a single counterparty holds 51.4% of TVL and four undisclosed escrow counterparties hold a further 33.0%, putting offchain exposure at 84.4% with one keeper valuing a third of the book. Governance controls (dual timelock, renounced admin, no-op emergencyAction) and the programmability model are sound.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.5**
- Reserves are 100% accounted for onchain via `FarmRegistry` and per-farm `assets()` — the sum of the ten funded farms is $60.396M, matching `Accounting.totalAssetsValue()` exactly, against an iUSD supply of 60.37M (parity within rounding).
- **84.4% of TVL** is in positions whose backing cannot be independently audited onchain:
  - **Midas mGLOBAL** (51.4%, $31.02M) wraps Fasanara Capital's hedge-fund strategy — TradFi custody and NAV.
  - **Four RWAEscrowFarms** (33.0%, $19.96M) send funds to offchain counterparties (one receiver is the team multisig, three are external EOAs), with value attested by a single onchain keeper.
- The remaining 15.6% ($9.42M) sits in onchain-verifiable positions: Cap stcUSD (7.3%), Aave V4 USDG (3.7%), Steakhouse MetaMorpho (1.9%), Spark sUSDC (1.7%), Sentora PRIME residual (1.0%).
- Liability ladder (liUSD → siUSD → iUSD) is intact but thin relative to the exposure it backs: `LockingController.totalBalance()` = $19.71M with ~$8.85M of liUSD still mid-unwind. The buffer is 39% of offchain exposure and 64% of the Midas position alone, so a single adverse credit event at Midas/Fasanara could exhaust it and reach siUSD holders.

**Subcategory B: Provability — 3.5**
- Allocations and book values are fully transparent onchain (which farm holds what, its bucket, its notice period, and the attested value). Every registered farm is now identified — no unidentified positions remain.
- The *true* underlying value of the dominant offchain exposures — Midas mGLOBAL (51.4%) and the four RWA escrows (33.0%) — rests entirely on offchain attestation. Yearn would have to trust Midas/Fasanara's NAV and a single `RWAEscrowRateManager` keeper for 84.4% of the book.
- Escrow attestations are timestamped onchain (`lastUpdatedAt`) and were all refreshed within hours of this assessment, which makes staleness detectable even though the values themselves are unverifiable.
- siUSD exchange rate is ERC4626-standard and verifiable.

**Score: 4.0/5** — (4.5 + 3.5) / 2 = 4.0. Offchain/unverifiable exposure is 84.4% of the book and the first-loss buffer covers only 39% of it. Offsetting this, reserves reconcile exactly against iUSD supply, the farm inventory is fully identified, and every attestation carries an onchain freshness timestamp.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: instant-redemption capacity is the **LIQUID bucket — `Accounting.totalAssetsValueOf(1)` = $5.45M (9.0% of TVL)**, drawn atomically by `BeforeRedeemHook` inside the redeemer's own transaction with no keeper or operator step. The PROTOCOL bucket (`totalAssetsValueOf(0)` = $0.67) is controller float, not the exit buffer; the protocol deliberately keeps no idle USDC.
- **Track record**: the FIFO queue has **never been used** — 5,909 redemptions, ~$713M, all same-block since May 2025, with a single $17.84M redemption cleared instantly in March 2026. Over the last 30 days daily redemption volume of ~$2K–$1.09M was met instantly every day, with `queueLength()` at 0 throughout.
- **Notice-period ladder**: the remaining 91% is not "locked to a date" but held behind rolling notice periods — $16.26M at ≤7 days, $33.59M at ≤28 days, $5.09M at ≤56 days. `maturity()` returns `block.timestamp + duration`, so these are recurring durations, not settlement deadlines that can be missed.
- **Depth (secondary)**: essentially zero. siUSD has no DEX pair; iUSD's deepest venue is a Curve iUSD/USDC pool holding ~4,670 iUSD and ~4,374 USDC, where `get_dy` returns 996 USDC for a 1,000 iUSD swap and only 4,363 USDC for 10,000 iUSD. There is no market-based exit at size.
- **Free supply**: ~$0.36M of iUSD sits outside protocol contracts; $40.30M of iUSD is held via siUSD. Instant capacity covers ~14% of the siUSD position, so a broad exit would test the queue for the first time.

**Score: 3.0/5** — Instant redemption works and always has: $5.45M (9.0% of TVL) is withdrawable same-block by any holder without operator action, backed by a 14-month record of ~$713M in never-queued redemptions and a $17.84M single-transaction proof point. That is materially better than an illiquid, queue-gated profile. The score stays at 3.0 rather than lower because instant capacity is only 9% of TVL against a $40.30M siUSD position, the other 91% returns cash only if offchain counterparties honour 7–56 day notice, there is no secondary market to absorb stress, and the queue path has never actually been exercised.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Known team; ex-Fei/ECG contributors.
- **Funding**: $3M Pre-Seed from reputable VCs.
- **Docs**: Above-average technical documentation; transparency dashboard ([stats.infinifi.xyz](https://stats.infinifi.xyz/)) shows live allocation data.
- **Legal**: No disclosed legal entity or jurisdiction.
- **Incident response**: No publicly documented plan. Emergency capabilities exist onchain (pause + emergency withdrawal). Day-to-day operations run cleanly: keeper-driven yield claims, escrow attestations and LIQUID-bucket rebalancing all execute on schedule, and redemptions have been served continuously.

**Score: 2.5/5** — Team is publicly known with professional engineering background and multiple DeFi projects; contributor set confirmed on GitHub (eswak, nikollamalic, RobAnon). Reputable funding and good documentation are positives. The absence of a disclosed legal entity or jurisdiction, a public team page, a governance forum, and a documented incident-response plan keeps operational risk at 2.5.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.400 |
| Centralization & Control | 3.4 | 30% | 1.020 |
| Funds Management | 4.0 | 30% | 1.200 |
| Liquidity Risk | 3.0 | 15% | 0.450 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.195** |

**Final Score: 3.2**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK**

The composite score is 3.2, in the MEDIUM tier. The key risks at this reassessment are:
- **84.4% of TVL is offchain-custodied / NAV-attested**: Midas mGLOBAL (51.4%) plus four RWA escrow farms (33.0%), $50.97M whose backing cannot be verified onchain.
- **Concentration in Midas-Fasanara mGLOBAL** (51.4% of TVL): single largest position, tokenized hedge-fund exposure, offchain custody and valuation — 1.57× the entire liUSD first-loss buffer ($19.71M).
- **First-loss buffer thin relative to exposure**: $19.71M covers 39% of offchain exposure, with ~$8.85M of liUSD still mid-unwind.
- **Escrow counterparties undisclosed**: three of four escrow receivers are unidentified external EOAs; the fourth is the team multisig itself. All four are valued by one keeper.
- **Instant exit capped at 9% of TVL** with no secondary market; the queue path beyond that has never been exercised.
- **Short Timelock at 1 hour** and multisig with broad non-timelocked powers (4/8).
- **TVL contraction**: down 68% from the January 2026 peak.
- **Short operational history** (~14 months), though with a clean redemption record throughout.

---

## Reassessment Triggers

- **Time-based**: Reassess in 30 days (target 2026-08-28).
- **Liquidity-based**: Reassess immediately if (a) `RedeemController.queueLength()` or `totalEnqueuedRedemptions()` becomes non-zero — this would be the first queued redemption in the protocol's history — or (b) `Accounting.totalAssetsValueOf(1)` (the LIQUID bucket) falls below 5% of TVL for more than 7 days.
- **TVL-based**: Reassess if TVL moves by more than 30% in either direction from the current $60.40M.
- **Concentration-based**: Midas-Fasanara mGLOBAL already exceeds the 40% single-farm threshold (51.4%) and combined offchain exposure already exceeds 80% (84.4%). Reassess if mGLOBAL exceeds 60%, if offchain exposure exceeds 90% of TVL, or if any *other* single farm exceeds 40%.
- **Notice-period based**: Reassess if the weighted-average `duration()` of the MATURITY bucket lengthens materially (e.g. a shift of >$10M from 7-day into 28-day or 56-day notice), or if any funded farm's `duration` is increased.
- **Issuer / counterparty-based**: Reassess on any material event at Midas, Fasanara Capital, Cap Protocol, Paxos (USDG), Sky/Spark, or the RWA escrow counterparties (depeg, custodian change, restructure, regulatory action, failure to return funds on notice), or if any `RWAEscrow.lastUpdatedAt()` goes stale by more than 48 hours.
- **Governance-based**: Reassess after any signer change on the multisig, any new EXECUTOR_ROLE / PROPOSER_ROLE / CANCELLER_ROLE grant, any further change to either timelock's `getMinDelay()`, any change to the `Timelock.emergencyAction` no-op override, or any role grant on `InfiniFiCore` outside the Long Timelock.
- **Incident-based**: Reassess after any exploit, oracle failure, or material loss event at the protocol or in any farm with >$2M of InfiniFi exposure.
- **Architecture-based**: Reassess on any new farm category (new `AssetType` bucket), new asset enablement on `FarmRegistry`, new RWA escrow counterparty, or any change to YieldSharing/Accounting beyond the V3 line.

---

## Appendix A: Top Farm Exposure Analysis

Onchain inspection of `FarmRegistry.getFarms()`, per-farm `assets()`, `liquidity()` and `duration()` on 2026-07-29 shows the portfolio concentrated in a small number of large positions. Ten of the 23 registered farms are funded; they cover >99.9% of TVL. Two farms are in the **LIQUID** bucket (same-block principal withdrawal), the rest are **MATURITY** farms carrying a rolling notice period.

The book is highly consolidated: Midas mGLOBAL alone is 51.4% of TVL and the offchain RWA escrow footprint spans **four farms totalling $19.96M (33.0%)**. `AaveV3Farm` (Horizon), `ERC4626Farm`, `MapleFarm` and `FxSaveFarm` hold $0. The `SwapFarmV2WithMaturity` at `0x84FF7` holds $14.61 of PYUSD (dust — PYUSD has 6 decimals). The `SparkSUSDCFarm` (`0xd880D7`) and the fourth `RWAEscrowFarm` (`0xe919C6`) are identified below, and the FINANCE_MANAGER / MANUAL_REBALANCER holder `0xfD1Ea` is a redeployed `PrimeBrokerFarm` holding $0.

### Summary Table: Funded Farms by Deployed Value

| Farm | Bucket / notice | Underlying | Assets | Share | Individual Risk |
|------|------|------------|-------------:|------:|----------------:|
| **MidasFarm (mGLOBAL)** | MATURITY 28d | Midas-tokenized Fasanara Global hedge-fund strategy | $31.02M | 51.4% | **4.5/5** |
| **RWAEscrowFarm** `0x04d5` | MATURITY 7d | Offchain escrow; receiver = **Team Multisig** | $10.29M | 17.0% | **4.5/5** |
| **RWAEscrowFarm** `0x277F` | MATURITY 56d | Offchain escrow; receiver EOA `0xa03B…d211` | $5.09M | 8.4% | **4.5/5** |
| **CapFarm (stcUSD)** | **LIQUID** | Cap Protocol staked cUSD | $4.41M | 7.3% | **4.0/5** |
| **RWAEscrowFarm** `0x9E5e` | MATURITY 28d | Offchain escrow; receiver EOA `0x4831…D926` | $2.58M | 4.3% | **4.5/5** |
| **AaveV4Farm (USDG)** | MATURITY 7d | Aave V4 Global Dollar (USDG) market | $2.25M | 3.7% | **3.0/5** |
| **RWAEscrowFarm** `0xe919` | MATURITY 7d | Offchain escrow; receiver EOA `0xf758…d83c` | $2.00M | 3.3% | **4.5/5** |
| **ERC4626FarmWithMaturity (Steakhouse)** | MATURITY 7d | Steakhouse-curated MetaMorpho V1.1 USDC vault | $1.13M | 1.9% | **2.5/5** |
| **SparkSUSDCFarm** `0xd880D7` | **LIQUID** | Spark savings USDC (unwinds via Sky LitePSM) | $1.04M | 1.7% | **2.5/5** |
| **SwapFarmV2WithMaturity** `0x7538` | MATURITY 7d | Residual Sentora PRIME; PYUSD and USDC legs fully withdrawn | $0.59M | 1.0% | **3.0/5** |

### Detailed Farm Risk Assessments

---

#### 1. MidasFarm — Midas-tokenized Fasanara Global (mGLOBAL)

**Risk Score: 4.5/5**

**Description:**
`MidasFarm` ([`0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF)) holds [`mGLOBAL`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8), an ERC-20 token issued by Midas (a tokenization-as-a-service issuer) that represents a claim on the Fasanara Capital "Global" strategy. The underlying is wrapped in Midas's permissioned-issuance + offchain-NAV-attestation architecture rather than held directly. Notice period: **28 days** (`duration()` = 2,419,200s). At $31.02M / 51.4% of TVL this is the single dominant position — **1.57× the entire liUSD first-loss buffer** ($19.71M).

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Concentration** | **Very High** | 51.4% of total InfiniFi TVL in a single position, 1.57× the liUSD first-loss buffer |
| **Off-Chain Custody** | **Very High** | Underlying hedge-fund strategy assets held by traditional custodians at Fasanara |
| **NAV / Valuation** | **High** | mGLOBAL price reflects an off-chain NAV attestation from Midas / Fasanara |
| **Issuer Risk** | High | Two stacked issuers (Midas + Fasanara) plus their respective custodians |
| **Regulatory Risk** | High | Tokenized fund products are subject to securities regulation in EU/UK/US |
| **Liquidity Risk** | High | Principal returns on 28-day notice and is not part of the instant-exit bucket; secondary mGLOBAL liquidity is thin |

**Why This Matters:**
- Single largest exposure: because the position is 1.57× the first-loss tranche, an impairment of roughly two-thirds of mGLOBAL's value would exhaust liUSD entirely and begin cutting siUSD holders.
- Two stacked issuers (Midas + Fasanara) plus their respective custodians; valuation is a pure offchain NAV attestation, so mispricing is undetectable onchain.
- More than half of TVL is returnable only on 28-day notice from a single counterparty — the dominant determinant of how fast the book could be wound down if Yearn needed to exit.

**References:**
- [mGLOBAL token on Etherscan](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)
- [Midas Capital](https://midas.app/)
- [Fasanara Capital](https://www.fasanara.com/)

---

#### 2. RWAEscrowFarms — Four Offchain Counterparties

**Risk Score: 4.5/5**

**Description:**
Four separate `RWAEscrowFarm` contracts hold $19.96M (33.0% of TVL). Each sends underlying USDC to a dedicated `RWAEscrow` contract that forwards to an offchain receiver; position value during the notice period is attested onchain by a single shared `RWAEscrowRateManager` keeper ([`0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)), which is the `keeper()` on all four escrows.

| Farm | Escrow | Receiver | Notice | Value | Attested |
|------|--------|----------|--------|------:|----------|
| [`0x04d5…3271`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) | **Team Multisig** [`0x8060…400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) | 7d | $10.29M | 2026-07-29 |
| [`0x277F…84C1`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) | EOA [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) | 56d | $5.09M | 2026-07-29 |
| [`0x9E5e…1852`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) | EOA [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) | 28d | $2.58M | 2026-07-29 |
| [`0xe919…81Cf`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | [`0x1B3A…927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C) | EOA [`0xf758…d83c`](https://etherscan.io/address/0xf7583D86D9fB25391Af6e30ad17786572792d83c) | 7d | $2.00M | 2026-07-29 |

A fifth escrow-type farm, `RWAEscrowRouterFarm` [`0x9A0d…B885`](https://etherscan.io/address/0x9A0dB2aAC4e3a6a0324021d3a3Fe51Ddb18Bb885), is registered with a 56-day notice but holds only $5.00.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Counterparty Risk** | **Very High** | Funds custodied offchain during the notice period — pure trust. Three receivers are external EOAs; one is the team multisig itself, an internal-transfer arrangement whose ultimate use is not onchain-visible. |
| **Identity (TODO)** | Unknown | Counterparty identities behind `0x4831…D926`, `0xa03B…d211` and `0xf758…d83c` are not disclosed in public docs |
| **Concentration** | **Very High** | 33.0% of TVL across four separate escrow farms, all valued by one keeper |
| **Valuation** | High | Position value is driven by a single rate-manager keeper whose inputs come offchain; `lastUpdatedAt` makes staleness visible but not correctness |
| **Recovery** | Low | If a receiver does not return funds, recovery is a legal matter, not a smart-contract one |

**Why This Matters:**
- Collectively the most opaque exposure in the portfolio. Even Midas mGLOBAL has a tokenization issuer with published attestations; these farms rely on private bilateral arrangements with unnamed parties.
- A single keeper attests a third of the book. A compromised or negligent keeper could misstate $19.96M of value, and iUSD would keep minting and redeeming against the wrong NAV.
- $12.29M of the escrow book sits at 7-day notice, so it is the fastest offchain source of cash if the queue is ever engaged — but only if the receivers pay.

---

#### 3. SwapFarmV2WithMaturity — Sentora PRIME residual

**Risk Score: 3.0/5**

**Description:**
The PYUSD swap farm at [`0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) has been largely withdrawn: PYUSD and USDC balances are $0. The farm holds only 291,720 units of Sentora PRIME [`senPYUSDPRIMEv2`](https://etherscan.io/address/0xC21b08C16458202593D4D9B26b9984Ee67b38BbD), valued at $0.59M. Notice period: 7 days.

A second `SwapFarmV2WithMaturity` at [`0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) holds **14.611656 PYUSD — $14.61**, and no USDC or Sentora PRIME. PYUSD carries 6 decimals; this farm is dust and carries no material exposure.

**Key Risk Factors:** PYUSD is a Paxos-issued, NYDFS-regulated stablecoin — a high credit standard — but the protocol's remaining PYUSD exposure is negligible. The residual Sentora PRIME wrapper adds a credit-vault layer over $0.59M, and CoW-Protocol solvers are the settlement dependency for swap-type farms.

---

#### 4. CapFarm — Cap Protocol stcUSD

**Risk Score: 4.0/5**

**Description:**
`CapFarm` ([`0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694)) holds [`stcUSD`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), the staked yield-bearing version of Cap Protocol's `cUSD` stablecoin. Cap is a 2025-vintage stablecoin issuer whose yield is sourced from delegated operator strategies backed by restaked collateral. $4.41M — the largest **LIQUID**-bucket position, with `liquidity()` equal to its full balance, so it is the protocol's primary instant-exit source. Its unwind path (stcUSD → cUSD → Morpho markets → USDC) executes inside a user's redeem transaction.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Issuer Maturity** | **High** | Cap is ~1 year old, limited stress-test history |
| **Peg Risk** | High | cUSD peg integrity relies on Cap's reserve attestations and operator soundness |
| **Smart Contract** | Medium | Cap's contracts have been audited but are young in production |
| **Instant-exit dependency** | Medium | Because Cap is 81% of the LIQUID bucket, a Cap pause or withdrawal restriction would remove most of InfiniFi's instant-redemption capacity and push redemptions into the never-used queue |

**References:**
- [stcUSD on Etherscan](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- [Cap Protocol](https://cap.app/)

---

#### 5. AaveV4Farm — Aave V4 USDG market

**Risk Score: 3.0/5**

**Description:**
`AaveV4Farm` ([`0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657)) supplies into an Aave V4 market for [`USDG`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D) (Global Dollar, a Paxos/Global Dollar Network stablecoin) via an Aave V4 hub/spoke deployment. $2.25M, 7-day notice. The farm claims yield and rotates USDG↔USDC through CoW swaps on a roughly 8-hourly keeper cadence.

**Key Risk Factors:** Aave V4 is a newer codebase than V3; the position also carries USDG issuer/peg risk. Onchain-verifiable lending exposure, moderate risk.

---

#### 6. ERC4626FarmWithMaturity — Steakhouse-curated MetaMorpho

**Risk Score: 2.5/5**

**Description:**
`ERC4626FarmWithMaturity` ([`0x76D2E84009dAE457f8667D823c7c96e9A7c35B78`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78)) deposits into a dedicated Steakhouse-curated MetaMorpho V1.1 USDC vault [`0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9) ("infiniFi USDC"). $1.13M, 7-day notice, of which $0.62M is currently withdrawable from the underlying vault.

**Key Risk Factors:** Standard MetaMorpho stack risk (Morpho Blue isolated markets + curator allocation) under a reputable curator. Low independent risk; included for completeness.

---

#### 7. SparkSUSDCFarm — Spark savings USDC

**Risk Score: 2.5/5**

**Description:**
`SparkSUSDCFarm` ([`0xd880D7C5CaFdbE2AEc281250995abF612235e563`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563)) holds Spark savings USDC and is the second **LIQUID**-bucket position at $1.04M, with `liquidity()` equal to its full balance. Its unwind path routes sUSDC → USDS/DAI → the Sky LitePSM USDC pocket ([`0x3730…7341`](https://etherscan.io/address/0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341)) → USDC, executed atomically inside a user's redeem transaction.

**Key Risk Factors:** Exposure is to Sky/Spark's savings rate module and the LitePSM's USDC reserve — among the deepest and most battle-tested stablecoin liquidity in DeFi. This is the lowest-risk position in the portfolio, and the most reliable component of instant-exit capacity.

---

### Aggregate Risk Assessment

**Concentration:** 84.4% of TVL is in offchain exposures — Midas-Fasanara mGLOBAL (51.4%) and four RWA escrow counterparties (33.0%) — far above the protocol's $19.71M liUSD first-loss notional. The single Midas position is 1.57× the buffer.

**Liquidity:** instant-exit capacity is the LIQUID bucket, $5.45M (9.0% of TVL), drawn atomically inside any holder's `redeem()` call. The FIFO queue has never been used: ~$713M of redemptions since May 2025 have all cleared same-block, including a $17.84M single transaction. The remaining 91% returns on rolling 7 / 28 / 56-day notice. Secondary markets are not an exit path — siUSD has no DEX pair and iUSD's deepest pool holds ~$9K.

**Offchain exposure:** Midas-Fasanara (51.4%) + four RWAEscrowFarms (33.0%) = **84.4% of TVL** has material offchain custodial, valuation, or counterparty dependence, all of it valued by attestation rather than onchain proof.

**Wind-down profile (how fast a full exit could be funded, absent counterparty failure):**
1. **Immediately** — $5.45M from the LIQUID bucket (Cap $4.41M, Spark $1.04M).
2. **Within 7 days** — a further $16.26M: RWA escrow `0x04d5` ($10.29M, receiver = multisig), Aave V4 USDG ($2.25M), RWA escrow `0xe919` ($2.00M), Steakhouse ($1.13M), Sentora residual ($0.59M).
3. **Within 28 days** — a further $33.59M: Midas mGLOBAL ($31.02M) and RWA escrow `0x9E5e` ($2.58M).
4. **Within 56 days** — the final $5.09M: RWA escrow `0x277F`.

**Recommendation:**
Treat current InfiniFi exposure as a credit exposure to **(a) a tokenized Fasanara hedge-fund position (51.4%) and (b) four undisclosed RWA escrow counterparties (33.0%)**, with sound redemption plumbing on top. Exit mechanics are demonstrably reliable at the current scale — instant for the first $5.45M, laddered 7–56 day notice beyond that — so the question for a Yearn allocator is not whether redemptions process but whether the offchain counterparties holding 84% of the book are good for the money. Position sizing should assume no secondary-market exit and that anything above ~$5M requires the queue, which has never been tested.

**Data Sources:**
- Onchain: `FarmRegistry.getFarms()` / `getTypeFarms()`, per-farm `assets()`, `liquidity()`, `duration()`, `perpetual()` and `maturity()`, per-escrow `receiver()` / `keeper()` / `lastUpdatedAt()`, `Accounting.totalAssetsValue()` and `.totalAssetsValueOf(uint256)`, `RedeemController` queue getters and full `Redeem` / `Redemption*` event history from deployment (block 22540552) to block 25638819 (verified 2026-07-29).
- [DefiLlama](https://defillama.com/protocol/infinifi) — TVL cross-check ($60.38M on 2026-07-29).
- DEX depth via Dexscreener for iUSD and siUSD pairs.
- [InfiniFi Transparency Dashboard](https://stats.infinifi.xyz/) — cross-checked but not used as the primary source.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [February 4, 2026](https://github.com/yearn/risk-score/pull/22) | 2.3 | Initial assessment |
| [May 18, 2026](https://github.com/yearn/risk-score/pull/192) | 3.2 | Reassessment — Liquidity 2.0→4.0: iUSD redemption queue-only pending maturity wave |
| [July 4, 2026](https://github.com/yearn/risk-score/pull/288) | 3.4 | Reassessment — offchain concentration up, TVL down |
| [July 29, 2026](https://github.com/yearn/risk-score/pull/357) | 3.2 | Reassessment — offchain exposure restated to 84.4% with a fourth RWA escrow; farm-bucket semantics corrected (`FarmTypes.LIQUID` = bucket 1): instant-exit capacity is $5.45M and the redemption queue has never been used (Liquidity 4.0→3.0) |
