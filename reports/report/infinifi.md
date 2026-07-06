# Protocol Risk Assessment: InfiniFi

- **Assessment Date:** February 4, 2026 (Updated: July 4, 2026)
- **Token:** siUSD (Staked iUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)
- **Final Score: 3.4/5.0**

## Overview + Links

InfiniFi is a stablecoin protocol that allows users to deposit assets (USDC, USDT) to mint iUSD, a stablecoin pegged to the US Dollar. The protocol automatically deploys deposited collateral into a portfolio of farm contracts categorized as **Liquid** (instant withdrawal), **Illiquid** (perpetual but exit-controlled), and **Maturing** (locked until fixed maturity dates). As of this assessment the largest allocations are Midas-tokenized **Fasanara Global** (~47% of TVL), three **offchain RWA escrow** positions (~31% combined), a CoW-swap fixed-maturity **PYUSD / Sentora PRIME** basket (~7%), **Cap Protocol stcUSD** (~6%), an **Aave V4 USDG** market (~5%), and Steakhouse-curated MetaMorpho (~3%). Roughly **78% of TVL now sits in offchain-custodied or NAV-attested positions** (Midas mGLOBAL + the RWA escrows). See Appendix A for detailed analysis of the largest farm deployments.

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
- **FarmRegistry**: [`0xF5f2718708f471e43968271956CC01aaA8c46119`](https://etherscan.io/address/0xF5f2718708f471e43968271956CC01aaA8c46119) — canonical list of approved farms (23 enumerated: 5 Liquid, 5 Illiquid, 13 Maturing; most sit at $0 / dust)
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

- **Team Multisig**: [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) — Gnosis Safe v1.4.1, **4/7 threshold**, 7 EOA signers, nonce 519. Signer set unchanged (7 anonymous EOAs).
- **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — 604,800s delay (verified)
- **Short Timelock (1 hour)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` returns **3,600s (1 hour)**, verified onchain 2026-07-04. This is the delay governing PROTOCOL_PARAMETERS, ORACLE_MANAGER (setOracle/setPrice), and farm add/remove actions — the early-warning window for those changes is now one hour.

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
- **TVL**: $65.31M (verified onchain via `Accounting.totalAssetsValue()` and corroborated by [DefiLlama](https://defillama.com/protocol/infinifi) at $65.3M on 2026-07-04). TVL has continued to decline from a ~$177M peak in early 2026, through ~$83M in May, ~$80M in mid-June, and now ~$65M — a slow, steady contraction rather than a run.
- **June 2026 maturity wave settled without a depeg**: the mid-May-to-June cluster of maturities (the cUSD/stcUSD CoW-swap basket, the first PYUSD basket, and the original Midas mGLOBAL tranche) rolled off or rolled forward without a loss-socialization event; those farm positions are now at $0 or have been re-established at new maturities. This is the protocol's first observed settlement of a large maturity cluster.
- **Incidents**: No reported security incidents or exploits found. iUSD oracle still reports 1.0 (verified onchain 2026-07-04 — no loss-socialization event).
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.
- **liUSD unwinding**: The `UnwindingModule` holds ~16.87M iUSD, a large volume of locked-token (liUSD) positions exiting early — the first-loss buffer is being drawn down as those positions unwind.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed via farm contracts grouped into three `AssetType` buckets in `FarmRegistry`: **Liquid** (instant withdrawal), **Illiquid** (perpetual but slow to unwind), and **Maturing** (locked until a fixed maturity date). The current portfolio is heavily concentrated in tokenized RWA (Midas-Fasanara) and offchain RWA escrow positions, with smaller onchain positions in a PYUSD/Sentora basket, Cap Protocol stcUSD, an Aave V4 USDG market, and Steakhouse MetaMorpho. **Critical: The two largest exposures — Midas mGLOBAL and the three RWA escrows, ~78% of TVL combined — are offchain-custodied. See Appendix A.**
- **Asset Allocation** (verified onchain via `Accounting.totalAssetsValueOf(type)` and per-farm `assets()`, 2026-07-04):

  | Bucket | Value (USD) | Share |
  |--------|------------:|------:|
  | Liquid (USDC instant) | **~$0.7** | **~0%** |
  | Illiquid (perpetual) | $4.23M | 6.5% |
  | Maturing (fixed-term) | $61.08M | 93.5% |
  | **Total** | **$65.31M** | 100% |

  **Critical observation**: The Liquid bucket is empty in practice (only dust in `SwapFarmV2`/`RedeemController`, ~$0.67 total). Effectively all ~$65.31M of TVL sits in Illiquid or Maturing farms, and the Maturing bucket alone is now 93.5%. **There is no instant-redemption capacity for iUSD holders without entering the queue.**

  Top farms by deployed value:

  | Farm | Type | Target | Assets | Share |
  |------|------|--------|-------:|------:|
  | [`MidasFarm`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF) | Maturing | mGLOBAL — Midas Fasanara Global ([`0x7433…98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)). Maturity 2026-08-01. | $30.87M | 47.3% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | Maturing | RWA escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) → receiver = **Team Multisig** [`0x8060…400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). Maturity 2026-07-11. | $10.21M | 15.6% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | Maturing | RWA escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) → receiver [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) (EOA). Maturity 2026-08-01. **Counterparty TODO.** | $5.10M | 7.8% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | Maturing | RWA escrow [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) → receiver [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) (EOA). Maturity 2026-08-29. **Counterparty TODO.** | $5.05M | 7.7% |
  | [`SwapFarmV2WithMaturity`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) | Maturing | CoW-swap USDC ↔ PYUSD ([`0x6c3e…A0e8`](https://etherscan.io/address/0x6c3ea9036406852006290770BEdFcAbA0e23A0e8)) / Sentora PRIME senPYUSDPRIMEv2 ([`0xC21b…8BbD`](https://etherscan.io/address/0xC21b08C16458202593D4D9B26b9984Ee67b38BbD)). Maturity 2026-07-11. | $4.73M | 7.2% |
  | [`CapFarm`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | Illiquid | stcUSD — Cap Protocol staked cUSD ([`0x8888…8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) | $4.23M | 6.5% |
  | [`AaveV4Farm`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657) | Maturing | Aave V4 USDG market — Global Dollar ([`0xe343…491D`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D)). Maturity 2026-07-11. | $2.99M | 4.6% |
  | [`ERC4626FarmWithMaturity`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78) | Maturing | Steakhouse infiniFi USDC ([`0xBEEF…3aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9)) — dedicated MetaMorpho V1.1 vault | $2.13M | 3.3% |
  | Remaining (dust / matured / inactive) | mixed | SparkSUSDCFarm, AaveV3Farm (Horizon), MapleFarm, FxSaveFarm, cUSD/stcUSD swap, old PYUSD swap, PrimeBrokerFarm — all at $0 / dust | ~$0.01M | <0.1% |

  Notable concentrations: **Midas-Fasanara mGLOBAL ≈ 47%**, **offchain RWA escrow (3 farms) ≈ 31%**, **PYUSD / Sentora PRIME basket ≈ 7%**, **Cap Protocol stcUSD ≈ 6%**, **Aave V4 USDG ≈ 5%**, **Steakhouse MetaMorpho ≈ 3%**.

  The book is highly consolidated. The `SparkSUSDCFarm`, `AaveV3Farm` (Horizon), `MapleFarm`, `FxSaveFarm`, and cUSD/stcUSD CoW-swap farms currently hold $0. Cap Protocol exposure is a single $4.23M stcUSD position (6.5%). The dominant weights are Midas mGLOBAL at nearly half of TVL and the offchain RWA escrow footprint of **three farms totalling ~$20.4M (31%)**. The farm set also includes `AaveV4Farm` (Aave V4 USDG market, $2.99M) and `PrimeBrokerFarm` (a Liquid-type farm currently at $0).

- **Risk Hierarchy**: Losses are socialized based on a "liability ladder":
  1. liUSD (Locked) holders take the first loss.
  2. siUSD (Staked) holders take the next loss.
  3. iUSD (Stablecoin) holders are the last to be affected.

### Accessibility

- **Enabled Deposit Assets** (verified onchain via `FarmRegistry.getEnabledAssets()`): USDC ([`0xA0b8…eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)) and USDT ([`0x8292…17eD`](https://etherscan.io/address/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD)). USDe and sUSDe are not enabled on `FarmRegistry`. The protocol's frontend may still accept other assets via wrapper logic — TODO verify gateway behavior.
- **Minting**: Users deposit USDC/USDT through the Gateway → `MintController` to mint iUSD.
- **Redemption**:

  - **Instant**: Capped by liquidity in the Liquid-type farms (`MintController`, `RedeemController`, `SwapFarmV2`, `LiquidationFarm`, `PrimeBrokerFarm`). **Currently effectively $0** (~$0.67 total) — instant redemptions are paused in practice until allocators rebalance funds back into liquid farms or maturing positions roll off.
  - **Queue**: With liquid reserves depleted, redemption requests enter a **FIFO Queue**. Pending requests are fulfilled as capital is unwound from illiquid strategies or new deposits enter.
  - **Whitelisting**: No whitelist for redemption; anyone holding iUSD can redeem or enter the queue.

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
  1. The `FINANCE_MANAGER` role-holder set (currently 4 contracts: `YieldSharing`, `LiquidationFarm`, `PLSmootherHelper`, and the new `PrimeBrokerFarm`). No EOA or multisig holds the role directly. Adding a new holder requires `GOVERNOR` (Long Timelock, 7d).
  2. The calling contract correctly accounting realized farm profit before calling `smoothProfit`. A bug in `YieldSharing`'s profit math, or a compromised farm that over-reports yield, would let PLSmoother mint unbacked iUSD. The PLSmoother contract itself would not catch the discrepancy.

**Slashing-order quirk** (from PLSmoother source comment): *"the vesting yield held by this contract … isn't included in the slashing order. As a result, it could hold undistributed rewards (i.e. pending profit) that would otherwise could have been used to mitigate losses."* If losses materialize while iUSD is still mid-vest inside PLSmoother, that pending profit does **not** absorb the loss — losses skip the smoother and hit liUSD / siUSD directly. An audited and acknowledged design property, not a bug, but a real risk-review-relevant point.

### Collateralization

- **Backing**: iUSD is backed by the assets deployed in the underlying strategies.
- **Verification**: The protocol uses a "Self-Laddering Engine" to match asset duration with liability duration (locked periods).
- **Offchain / High-Risk Exposures** (verified onchain, see Appendix A for detail):
  - **Midas-tokenized Fasanara Global (mGLOBAL)** — single largest position at $30.87M (47%). Midas is a tokenization issuer; the underlying is Fasanara Capital's hedge-fund strategy. Custody and valuation are entirely offchain.
  - **Three RWA Escrow Farms** — ~$20.4M combined (31% of TVL): $10.21M via escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) (receiver = the **Team Multisig** itself), $5.10M via escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) (receiver EOA [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926)), and $5.05M via escrow [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) (receiver EOA [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211)). All three escrow positions are value-attested onchain by the same keeper/rate manager `RWAEscrowRateManager` ([`0x11F6…4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)) but the underlying funds sit with offchain counterparties. Pure trust-based offchain exposure during the lock period.
  - **Cap Protocol stcUSD** — $4.23M (6.5% of TVL). Cap is a relatively young (2025) stablecoin issuer.
  - **Aave V4 USDG market** — $2.99M supplied into Aave's V4 Global Dollar (USDG) market.
- **Token Breakdown** (verified onchain 2026-07-04, all in iUSD-equivalent):

  | Component | Value | Source |
  |-----------|------:|--------|
  | iUSD totalSupply | 65.31M | `iUSD.totalSupply()` |
  | — held by siUSD (Staked) | 36.98M | `iUSD.balanceOf(siUSD)` |
  | — held by LockingController (liUSD active) | 10.97M | `iUSD.balanceOf(LockingController)` |
  | — held by UnwindingModule (liUSD in unwind) | 16.87M | `iUSD.balanceOf(UnwindingModule)` |
  | — held by YieldSharing (dust) | 0.03M | `iUSD.balanceOf(YieldSharing)` |
  | — circulating / in user wallets | ~0.47M | residual |
  | siUSD totalSupply | 34.35M shares | exchange rate ≈1.077 iUSD/siUSD |
  | LockingController totalBalance (liUSD) | 27.83M | `LockingController.totalBalance()` |

  A large share of the locked tranche is now mid-unwind: the `UnwindingModule` holds 16.87M iUSD against 10.97M still active in `LockingController`, i.e. roughly 60% of the outstanding liUSD notional is being drawn down through early exits. The first-loss buffer (`LockingController.totalBalance()` = 27.83M) is smaller than the single Midas mGLOBAL position ($30.87M) and far below the combined offchain exposure (~$51.2M).

### Provability

- **Transparency**: Reserves and allocations are verifiable onchain via `FarmRegistry.getFarms()` and per-farm `assets()`.
- **Reserves**: Onchain DeFi positions (Cap stcUSD, Aave V4 USDG, Steakhouse MetaMorpho, the PYUSD/Sentora basket) are fully verifiable. The dominant offchain-backed positions — Midas mGLOBAL (47%) and the three RWA escrow farms (31%) — cannot be independently audited onchain; together they are ~78% of TVL, so the majority of backing now rests on offchain attestation.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: only ~$0.47M circulating outside protocol contracts. Instant-redemption buffer is ~$0; **any iUSD holder wanting to exit today must enter the FIFO queue** and wait for maturing positions to roll off or new deposits to come in.
  - **siUSD**: Staked holders can withdraw to iUSD via `siUSD.withdraw()` (ERC4626) but then face the same redemption queue.
  - **liUSD**: Locked positions (1-13 weeks). Early exits route through `UnwindingModule` and incur a slashing penalty. ~16.87M iUSD is currently mid-unwind, indicating active locked-holder exit pressure.
- **Withdrawal Queues**: With the liquid buffer at ~$0 the queue is the only path for iUSD-to-USDC. Upcoming maturities that can restore liquidity are **2026-07-11** (~$17.9M cluster: $10.21M RWA escrow + $4.73M PYUSD/Sentora swap + $2.99M Aave V4 USDG), **2026-08-01** ($30.87M Midas mGLOBAL + $5.10M RWA escrow — the single largest event), and **2026-08-29** ($5.05M RWA escrow). In practice the queue can only be cleared as these maturities trigger (or are rolled forward, which does not release cash).

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
    - _Timelock_: Changes to capital allocation parameters (e.g., Farm Registry updates) use the **Short Timelock** (1 hour delay).
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
    - _Scope_: Adding a new protocol to the allowlist requires a governance vote and must pass through the **Short Timelock** (1 hour delay).
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/7 threshold**, 7 anonymous EOA signers (verified onchain via `getOwners()` and `getThreshold()` on 2026-07-04). Nonce 519.

  | # | Signer | Additional Roles (verified onchain) |
  |---|--------|------------------|
  | 1 | [`0x7A823623B18335A9c1284AC45315fe89972FD421`](https://etherscan.io/address/0x7A823623B18335A9c1284AC45315fe89972FD421) | — |
  | 2 | [`0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD`](https://etherscan.io/address/0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD) | EXECUTOR_ROLE |
  | 3 | [`0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61`](https://etherscan.io/address/0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61) | — |
  | 4 | [`0x6DFa1A32604088EB969242AafFb92420F78373f6`](https://etherscan.io/address/0x6DFa1A32604088EB969242AafFb92420F78373f6) | EXECUTOR_ROLE |
  | 5 | [`0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685`](https://etherscan.io/address/0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685) | PAUSE |
  | 6 | [`0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa`](https://etherscan.io/address/0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa) | EXECUTOR_ROLE |
  | 7 | [`0x383965940c950008a4B67BfaA477Fdf6AC91a7F7`](https://etherscan.io/address/0x383965940c950008a4B67BfaA477Fdf6AC91a7F7) | EXECUTOR_ROLE, PAUSE |

- **Timelocks**: Both are custom `Timelock.sol` extending OZ TimelockController. They override `hasRole()` to delegate role checks to the central `InfiniFiCore` contract. Both have DEFAULT_ADMIN_ROLE renounced (immutable role configuration).

  - **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — `getMinDelay()` returns 604,800s (verified 2026-07-04).
  - **Short Timelock (1 hour)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` returns **3,600s (1 hour)** (verified 2026-07-04). The delay governing parameter, oracle, and farm-add/remove actions is now one hour — a materially shorter early-warning window than the 7-day Long Timelock, and short enough that offchain monitoring must be near-real-time to react before execution.

  **Timelock-controlling roles on InfiniFiCore** (verified by enumerating `getRoleMember()`):

  | Role | Holders |
  |------|---------|
  | PROPOSER_ROLE | 1: multisig (4/7 required to schedule) |
  | CANCELLER_ROLE | 1: multisig (4/7 required to cancel) |
  | EXECUTOR_ROLE | **6**: signers #2/4/6/7 + deployer EOA (`0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22`) **+ the multisig itself** (the multisig can execute its own scheduled proposals) |

  Governance flow: **Multisig proposes (4/7) → Timelock delay → Any 1 of 5 executor EOAs or the multisig itself triggers execution.**

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
    | MANUAL_REBALANCER (4 holders: multisig + Short Timelock + LiquidationFarm + PrimeBrokerFarm) | Rebalance funds between whitelisted farms |
    | FARM_SWAP_CALLER (3 holders: multisig + EOA `0x7345…2cbB` + Short Timelock) | Trigger swap operations in farms |
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

- **Other onchain role membership** (verified 2026-07-04 by enumerating `keccak256` of each role name in `CoreRoles`):

  | Role | Count | Notable holders |
  |------|------:|-----------------|
  | ENTRY_POINT | 2 | Gateway proxy, MigrationController |
  | RECEIPT_TOKEN_MINTER | 4 | YieldSharing, MintController, PLSmoother, MigrationController |
  | RECEIPT_TOKEN_BURNER | 7 | siUSD, UnwindingModule, LockingController, YieldSharing, RedeemController, PLSmootherHelper, PLSmoother |
  | LOCKED_TOKEN_MANAGER | 1 | LockingController |
  | TRANSFER_RESTRICTOR | 1 | AllocationVoting |
  | FARM_MANAGER | 4 | ManualRebalancer, AfterMintHook, BeforeRedeemHook, EmergencyWithdrawal |
  | FINANCE_MANAGER | 4 | YieldSharing, LiquidationFarm, PLSmootherHelper, PrimeBrokerFarm |
  | PERIODIC_REBALANCER | 1 | EOA `0x2Cba…aB1a` (keeper bot) |
  | PROTOCOL_PARAMETERS | 3 | Short Timelock, Long Timelock, MaturedFarmCleaner |
  | DEFAULT_ADMIN_ROLE | **0** | — (renounced) |

- **emergencyAction bypass analysis**: The `Timelock.sol` contract **overrides emergencyAction to a no-op**, preventing any GOVERNOR holder from using it to bypass timelock delays. This is a deliberate safety mechanism confirmed in source code.

### Programmability

- **Hybrid Model**: The "Self-Laddering Engine" algorithmically matches asset duration with liability duration. "Allocators" actively manage the amount of capital deployed to specific allowlisted strategies.
- **Oracle**: Protocol uses Chainlink price feeds for asset pricing to maintain the 1:1 mint ratio and calculate collateral value.
- **Oracle Updates**: Oracles are upgradeable via governance (**Short Timelock**, 1-hour delay). The iUSD price oracle (`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`) is a FixedPriceOracle — price changes only during loss socialization events (de-peg).

### External Dependencies

- **Top dependencies (by deployed value)**: **Midas** (mGLOBAL tokenization layer over Fasanara Capital) ~47%, **Unidentified RWA escrow counterparties** (three separate escrows; one routes to the team multisig, two to external EOAs — TODO identify) ~31%, **PYUSD / Paxos + Sentora PRIME** (via maturing CoW-swap basket) ~7%, **Cap Protocol** (stcUSD) ~6%, **Aave (V4) / Global Dollar (USDG)** ~5%, **Steakhouse-curated Morpho MetaMorpho** ~3%. The Spark/MakerDAO, Aave Horizon, Maple Finance, and f(x) Protocol farms currently hold $0. The CoW-Protocol solver set is a settlement dependency for the maturing swap baskets.
- **Stablecoin dependencies**: USDC and USDT enabled as deposit assets (verified onchain). The protocol also takes indirect exposure to PYUSD (via the maturing swap basket), USDG / Global Dollar (via the Aave V4 market), cUSD/stcUSD (Cap), and to T-Bill-backed / hedge-fund RWAs (via Midas mGLOBAL and the three RWA escrow counterparties). USDe and sUSDe remain not enabled as deposit assets on FarmRegistry.

## Operational Risk

- **Team**: InfiniFi Labs. Pseudonymous/semi-anonymous team. Key contributors identified via GitHub:
  - **eswak (Erwan Beauvois)**: Lead architect. Former Fei Protocol core dev (2021-2022), Ethereum Credit Guild core dev (2022-2024). Toulouse, France.
  - **RobAnon (@RobAnon94)**: Contributor. Former sole developer of Revest Finance core contracts. Note: Revest Finance was exploited for ~$2M via reentrancy in March 2022.
  - **nikollamalic (Nikola Malic)**: Developer. Former Revest Finance infrastructure contributor.
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

- **TVL**: Monitor total protocol TVL via liquid + illiquid farm balances
- **Liquid Reserve Ratio**: Liquid reserves vs total TVL

## Risk Summary

### Key Strengths

- Strong risk segmentation design with liability ladder (liUSD first-loss → siUSD → iUSD)
- Comprehensive audit coverage: Spearbit/Cantina Code main review + 6 ongoing upgrade reviews + Certora formal verification + public competition
- Robust governance: 4/7 multisig + dual timelock (7d/1h) + separation of powers. DEFAULT_ADMIN renounced. emergencyAction bypass prevented via no-op override in Timelock.
- All contracts verified onchain, all funded farms properly target their stated protocols/counterparties
- First large maturity cluster (May–June 2026) settled without a loss-socialization event or depeg
- Backed by reputable investors (Electric Capital, Sam Kazemian)

### Key Risks

- **~78% of TVL is offchain-custodied or NAV-attested**: Midas-Fasanara mGLOBAL (~47%) plus three RWA escrow farms (~31%) together hold roughly $51M whose backing cannot be verified onchain — offchain exposure now dominates the book.
- **Single-position concentration crosses 40%**: Midas-Fasanara mGLOBAL is ~47% of TVL ($30.87M), maturing 2026-08-01. This exceeds the entire liUSD first-loss buffer ($27.83M) on its own.
- **RWA escrow footprint tripled**: three separate `RWAEscrowFarm` positions now hold ~$20.4M (31%). Funds sit with offchain counterparties (one escrow's receiver is the team multisig itself; two are external EOAs), value-attested by a single onchain rate manager. This is the most opaque exposure in the portfolio and its recovery at maturity is a trust/legal matter, not a smart-contract guarantee.
- **Liquid reserves remain fully depleted**: onchain `Accounting.totalAssetsValueOf(Liquid)` returns ~$0.67; the Liquid-type farms hold only dust. iUSD instant redemption stays effectively disabled — every redeemer must enter the FIFO queue.
- **Short Timelock delay is only 1 hour**: parameter, oracle (`setPrice`/`setOracle`), and farm add/remove actions execute after only a 1-hour delay, a narrow early-warning window for those changes.
- **TVL continues to contract**: now ~$65.31M, on a steady downtrend from a ~$177M peak earlier in 2026, with ~16.87M iUSD of locked (liUSD) positions currently mid-unwind — signs of ongoing exit pressure.
- **Multisig retains broad non-timelocked powers** — EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, UNPAUSE, MINOR_ROLES_MANAGER, PAUSE, and EXECUTOR_ROLE on InfiniFiCore — so a 4/7 anonymous signer set can both propose and execute its own timelock actions and move farm funds to a safe address.
- **Short operational history** (~13 months in production since June 2025); the June 2026 maturity cluster settled without a depeg but the book is now more concentrated, not less.
- **Pseudonymous team** with notable history concerns: key contributor (RobAnon) authored Revest Finance contracts exploited for $2M; lead dev's prior projects (Fei, ECG) have wound down.
- **No disclosed legal entity or incident response plan**.
- **Certora formal verification** report published but finding severity breakdown not available on the landing page (full PDF required for detailed review).

### Critical Risks

- **Queue-only redemption backed by a concentrated, offchain book**. Liquid reserves are ~$0 and ~78% of TVL is in Midas mGLOBAL plus three offchain RWA escrows that only settle at their 2026-07-11 / 08-01 / 08-29 maturities. A holder needing USDC today must wait for those maturities, and the single largest ($30.87M Midas, 2026-08-01) exceeds the entire first-loss buffer. Operators of any vault that requires reliable USDC exit should treat InfiniFi as queue-mode with heavy offchain-counterparty credit exposure.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. Multiple audits by reputable firms (Spearbit, Certora, Cantina).
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable onchain.
- [x] **Total centralization** — PASSED. 4/7 multisig with dual timelocks, DEFAULT_ADMIN renounced.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Strong coverage — Spearbit/Cantina Code main review (8H/6M/25L), Certora formal verification ([report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report)), Cantina public competition, multiple upgrade reviews (YieldSharing V2 → V3 upgrade reviewed).
- **History**: ~13 months in production (mainnet launch June 2025; this reassessment July 2026). TVL ~$65M, on a steady downtrend from a ~$177M peak earlier in 2026.
- **Bounty**: [Active on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591).
- **Incidents**: No known exploits or loss events since launch. The May–June 2026 maturity cluster settled without a depeg — a first observed stress data point.

**Score: 2.5/5** — Extensive audit coverage including formal verification and ongoing upgrade reviews; ~13 months production with no losses, and a first maturity cluster settled cleanly. Held at 2.5 (rather than improving toward 2.0) because TVL has continued to contract and the protocol has not yet weathered an adverse credit event in one of its now-dominant offchain positions.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.2**
- 4/7 multisig (Gnosis Safe v1.4.1) with dual timelocks (7d Long for GOVERNOR-scope, Short for parameters) remains in place.
- DEFAULT_ADMIN_ROLE renounced on Core and both timelocks; `Timelock.emergencyAction` is a no-op override.
- All 7 multisig signers are anonymous EOAs.
- The multisig holds EXECUTOR_ROLE on the Long Timelock alongside the deployer EOA and individual signer EOAs, so it can both schedule and execute its own proposals; the timelock delay still applies but the execution gate is not held by a distinct party.
- **New this assessment**: the Short Timelock delay has been reduced from 1 day to **1 hour**. Parameter, oracle, and farm add/remove actions now clear after only an hour, materially shrinking the early-warning window for those changes.
- Multisig retains significant non-timelocked direct powers: UNPAUSE, EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, FARM_SWAP_CALLER, MINOR_ROLES_MANAGER, PAUSE.

**Subcategory B: Programmability — 3.0**
- Hybrid model: algorithmic Self-Laddering Engine + active Allocator management. Asset/liability matching is the design intent but in practice the allocator decisions have produced a portfolio with effectively zero liquid buffer and ~78% offchain concentration.
- Oracle-dependent for pricing (Chainlink + protocol-specific oracles for stcUSD, mGLOBAL, RWA escrow rate manager); ORACLE_MANAGER role is under the Short Timelock (now 1h).
- emergencyAction safely disabled on timelocks (unchanged).

**Subcategory C: Dependencies — 3.8**
- Exposure has consolidated into a small number of largely offchain counterparties: Midas (mGLOBAL wrapping Fasanara) ~47%, three RWA escrow counterparties ~31%, plus smaller onchain positions in Cap Protocol (stcUSD), Aave V4 (USDG), Steakhouse MetaMorpho, and a PYUSD/Sentora PRIME swap basket.
- One RWA escrow routes to the team multisig itself; two route to external EOAs whose identities are undisclosed. All three depend on a single onchain rate manager for valuation.
- Pegs / NAVs depended on: USDC, USDT, cUSD, PYUSD, USDG, and — most heavily — the offchain mGLOBAL NAV and the RWA escrow attestations.
- The CoW-swap maturing baskets add a settlement dependency on CoW Protocol's solvers. Fewer distinct DeFi integrations than before, but far more concentrated offchain-counterparty trust.

**Score: 3.3/5** — (3.2 + 3.0 + 3.8) / 3 ≈ 3.33. Up from 3.2, driven by the Short Timelock's 1-hour delay and a dependency set concentrated in offchain RWA counterparties (Midas + three escrows ≈ 78%).

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.5**
- Reserves are 100% accounted for onchain via `FarmRegistry` and per-farm `assets()` — total matches `Accounting.totalAssetsValue()` of ~$65.31M against an iUSD supply of 65.31M (parity within rounding).
- However ~**78% of TVL** is in positions whose backing cannot be independently audited onchain:
  - **Midas mGLOBAL** (47%, $30.87M) wraps Fasanara Capital's hedge-fund strategy — TradFi custody and NAV.
  - **Three RWAEscrowFarms** (31%, ~$20.4M) send funds to offchain counterparties (one receiver is the team multisig, two are external EOAs), with value attested by a single onchain rate manager. Pure trust-based offchain exposure during the maturity period.
- The remaining ~22% sits in onchain-verifiable positions: Cap stcUSD (young 2025 issuer), Aave V4 USDG, Steakhouse MetaMorpho, and a PYUSD/Sentora PRIME swap basket.
- Liability ladder (liUSD → siUSD → iUSD) is intact but the first-loss buffer has weakened: `LockingController.totalBalance()` = $27.83M, with ~$16.87M of liUSD already mid-unwind. The buffer is now smaller than the single Midas position ($30.87M) and roughly a third of the combined offchain exposure (~$51M) — a single adverse credit event in Midas or the RWA escrows could exhaust it before iUSD holders are protected.

**Subcategory B: Provability — 3.5**
- Allocations and book values are fully transparent onchain (which farm holds what, and the attested value).
- But the *true* underlying value of the two dominant exposures — Midas mGLOBAL (47%) and the three RWA escrows (31%) — rests entirely on offchain attestation. Yearn would have to trust Midas/Fasanara's NAV and a single `RWAEscrowRateManager` for ~78% of the book, with no onchain proof of the underlying assets.
- siUSD exchange rate is ERC4626-standard and verifiable.

**Score: 4.0/5** — (4.5 + 3.5) / 2 = 4.0, up from 3.5. Driven by offchain/unverifiable exposure rising from ~43% to ~78% of TVL, a single 47% tokenized-hedge-fund position that exceeds the first-loss buffer, and an RWA escrow footprint that has tripled to ~31%.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: Onchain `Accounting.totalAssetsValueOf(Liquid)` returns ~$0.67; the Liquid-type farms collectively hold dust. There is **no instant-redemption capacity for iUSD today**.
- **Queue**: With the liquid buffer depleted, redemptions must enter the FIFO queue and wait for maturing positions to roll off. Reliefs are 2026-07-11 (~$17.9M: RWA escrow + PYUSD/Sentora swap + Aave V4 USDG), 2026-08-01 ($30.87M Midas + $5.10M RWA escrow), 2026-08-29 ($5.05M RWA escrow) — but a roll-forward at maturity releases no cash.
- **Depth (secondary)**: iUSD/siUSD DEX depth is thin relative to supply; secondary-market exit at par cannot be assumed under stress.
- **Free supply**: Only ~$0.47M of iUSD sits in user wallets outside protocol contracts, and ~$16.87M of liUSD is already mid-unwind — the queue is the binding constraint for any material exit.

**Score: 4.0/5** — Unchanged. The protocol remains structurally queue-only for iUSD-to-USDC with a ~$0 liquid buffer. The design contemplates this state and the May–June maturities did settle, but the practical risk to a holder needing same-day liquidity remains high and now sits behind a longer, more offchain-dependent maturity schedule.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Semi-pseudonymous; ex-Fei/Revest/ECG contributors. Known prior incident (Revest $2M hack) remains in the team's history.
- **Funding**: $3M Pre-Seed from reputable VCs.
- **Docs**: Above-average technical documentation; transparency dashboard ([stats.infinifi.xyz](https://stats.infinifi.xyz/)) shows live allocation data.
- **Legal**: No disclosed legal entity or jurisdiction.
- **Incident response**: No publicly documented plan. Emergency capabilities exist onchain (pause + emergency withdrawal). The clean settlement of the May–June maturity cluster shows the operational machinery functions.

**Score: 2.5/5** — Unchanged.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.3 | 30% | 0.99 |
| Funds Management | 4.0 | 30% | 1.20 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.415** |

**Final Score: 3.4**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK (top of band, near the Elevated boundary)**

The composite score is up from 3.2 → 3.4, driven primarily by the sharp rise in offchain/unverifiable exposure and single-position concentration on the funds-management side. The key risks at this reassessment are:
- **~78% of TVL is offchain-custodied / NAV-attested**: Midas mGLOBAL (~47%) plus three RWA escrow farms (~31%), ~$51M whose backing cannot be verified onchain.
- **Concentration in Midas-Fasanara mGLOBAL** (~47% of TVL): single largest position, tokenized hedge-fund exposure, offchain custody and valuation — larger than the entire liUSD first-loss buffer.
- **RWA escrow footprint tripled to ~$20.4M (31%)** across three farms; one receiver is the team multisig, two are external EOAs, all value-attested by one rate manager.
- **No liquid redemption buffer**: ~$0 in Liquid farms; iUSD-to-USDC is queue-only until maturities settle (2026-07-11 / 08-01 / 08-29).
- **Short Timelock cut to 1 hour**, shrinking the early-warning window for parameter/oracle/farm changes.
- **Multisig retains broad non-timelocked powers** and holds EXECUTOR_ROLE on the Long Timelock; signers are still anonymous EOAs.
- **Short operational history** (~13 months); one maturity cluster settled cleanly but the book is now more concentrated and more offchain.

---

## Reassessment Triggers

- **Time-based**: Reassess in 60 days (target 2026-09-02), or immediately after the 2026-08-01 Midas-mGLOBAL maturity settles.
- **Liquidity-based**: Reassess immediately if (a) the FIFO redemption queue forms a backlog that does not clear at the next scheduled maturity, or (b) `Accounting.totalAssetsValueOf(Liquid)` remains <1% of total supply for more than 30 days.
- **TVL-based**: Reassess if TVL moves by more than 30% in either direction from the current ~$65.31M.
- **Concentration-based**: Midas-Fasanara mGLOBAL already exceeds the 40% single-farm threshold (~47%). Reassess if it exceeds 55%, if combined offchain exposure (Midas + RWA escrows) exceeds 85% of TVL, or if any *other* single farm exceeds 40%.
- **Issuer / counterparty-based**: Reassess on any material event at Midas, Fasanara Capital, Cap Protocol, Paxos (PYUSD/USDG), or the RWA escrow counterparties (depeg, custodian change, restructure, regulatory action, failure to settle at maturity).
- **Governance-based**: Reassess after any signer change on the multisig, any new EXECUTOR_ROLE / PROPOSER_ROLE / CANCELLER_ROLE grant, any further change to either timelock's `getMinDelay()`, any change to the `Timelock.emergencyAction` no-op override, or any role grant on `InfiniFiCore` outside the Long Timelock.
- **Incident-based**: Reassess after any exploit, oracle failure, or material loss event at the protocol or in any farm with >$2M of InfiniFi exposure.
- **Architecture-based**: Reassess on any new farm category (new `AssetType` bucket), new asset enablement on `FarmRegistry`, new RWA escrow counterparty, or any change to YieldSharing/Accounting beyond the V3 line.

---

## Appendix A: Top Farm Exposure Analysis

Onchain inspection of `FarmRegistry.getFarms()` and per-farm `assets()` on 2026-07-04 shows the portfolio is concentrated in a small number of large positions, most of which are "Maturing" (locked until a fixed date). The Liquid bucket is empty in practice. The farms below cover ~99% of TVL.

The book is highly consolidated. The `SparkSUSDCFarm`, `AaveV3Farm` (Horizon), `MapleFarm`, `FxSaveFarm`, and cUSD/stcUSD CoW-swap farms currently hold $0. Cap Protocol exposure is a single $4.23M stcUSD deposit. Midas mGLOBAL is ~47% of TVL and the offchain RWA escrow footprint spans **three farms totalling ~$20.4M**. The farm set also includes `AaveV4Farm` (Aave V4 USDG market) and `PrimeBrokerFarm` (Liquid-type, currently $0).

### Summary Table: Top Farms by Deployed Value

| Farm | Type | Underlying | Assets (USD) | Share | Individual Risk |
|------|------|------------|-------------:|------:|----------------:|
| **MidasFarm (mGLOBAL)** | Maturing (2026-08-01) | Midas-tokenized Fasanara Global hedge-fund strategy | $30.87M | 47.3% | **4.5/5** |
| **RWAEscrowFarm** `0x04d5` | Maturing (2026-07-11) | Offchain escrow; receiver = **Team Multisig** | $10.21M | 15.6% | **4.5/5** |
| **RWAEscrowFarm** `0x9E5e` | Maturing (2026-08-01) | Offchain escrow; receiver EOA `0x4831…D926` | $5.10M | 7.8% | **4.5/5** |
| **RWAEscrowFarm** `0x277F` | Maturing (2026-08-29) | Offchain escrow; receiver EOA `0xa03B…d211` | $5.05M | 7.7% | **4.5/5** |
| **SwapFarmV2WithMaturity (PYUSD)** | Maturing (2026-07-11) | CoW-swap basket USDC ↔ PYUSD / Sentora PRIME | $4.73M | 7.2% | **3.0/5** |
| **CapFarm (stcUSD)** | Illiquid | Cap Protocol staked cUSD | $4.23M | 6.5% | **4.0/5** |
| **AaveV4Farm (USDG)** | Maturing (2026-07-11) | Aave V4 Global Dollar (USDG) market | $2.99M | 4.6% | **3.0/5** |
| **ERC4626FarmWithMaturity (Steakhouse)** | Maturing | Steakhouse-curated MetaMorpho V1.1 USDC vault | $2.13M | 3.3% | **2.5/5** |

### Detailed Farm Risk Assessments

---

#### 1. MidasFarm — Midas-tokenized Fasanara Global (mGLOBAL)

**Risk Score: 4.5/5**

**Description:**
`MidasFarm` ([`0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF)) holds [`mGLOBAL`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8), an ERC-20 token issued by Midas (a tokenization-as-a-service issuer) that represents a claim on the Fasanara Capital "Global" strategy. The underlying is wrapped in Midas's permissioned-issuance + offchain-NAV-attestation architecture rather than held directly. Maturity in this farm: **2026-08-01**. At ~47% of TVL this is now, by a wide margin, the single dominant position — larger than the entire liUSD first-loss buffer.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Concentration** | **Very High** | ~47% of total InfiniFi TVL in a single position, exceeding the liUSD first-loss buffer |
| **Off-Chain Custody** | **Very High** | Underlying hedge-fund strategy assets held by traditional custodians at Fasanara |
| **NAV / Valuation** | **High** | mGLOBAL price reflects an off-chain NAV attestation from Midas / Fasanara |
| **Issuer Risk** | High | Two stacked issuers (Midas + Fasanara) plus their respective custodians |
| **Regulatory Risk** | High | Tokenized fund products are subject to securities regulation in EU/UK/US |
| **Liquidity Risk** | High | InfiniFi position is locked until the 2026-08-01 maturity; secondary mGLOBAL liquidity is thin |

**Why This Matters:**
- Single largest exposure: a loss event large enough to impair mGLOBAL value would consume the entire liUSD first-loss buffer ($27.83M) before iUSD holders are protected.
- Two stacked issuers (Midas + Fasanara) plus their respective custodians; valuation is a pure offchain NAV attestation.
- The 2026-08-01 maturity is the single most important upcoming event for InfiniFi liquidity.

**References:**
- [mGLOBAL token on Etherscan](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)
- [Midas Capital](https://midas.app/)
- [Fasanara Capital](https://www.fasanara.com/)

---

#### 2. RWAEscrowFarms — Three Offchain Counterparties

**Risk Score: 4.5/5**

**Description:**
Three separate `RWAEscrowFarm` contracts now hold ~$20.4M combined (~31% of TVL). Each sends underlying USDC to a dedicated `RWAEscrow` contract that forwards to an offchain receiver; position value during the lock is attested onchain by a single shared `RWAEscrowRateManager` keeper ([`0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)).

| Farm | Escrow | Receiver | Maturity | Value |
|------|--------|----------|----------|------:|
| [`0x04d5…3271`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) | **Team Multisig** [`0x8060…400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) | 2026-07-11 | $10.21M |
| [`0x9E5e…1852`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) | EOA [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) | 2026-08-01 | $5.10M |
| [`0x277F…84C1`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) | EOA [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) | 2026-08-29 | $5.05M |

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Counterparty Risk** | **Very High** | Funds custodied offchain during the lock — pure trust. Two receivers are external EOAs; one is the team multisig itself, an internal-transfer arrangement whose ultimate use is not onchain-visible. |
| **Identity (TODO)** | Unknown | Counterparty identities behind `0x4831…D926` and `0xa03B…d211` are not disclosed in public docs |
| **Concentration** | **Very High** | ~31% of TVL across three separate escrow farms |
| **Valuation** | High | Position value during lock is driven by a single rate-manager keeper whose inputs come offchain |
| **Recovery** | Low | If a receiver does not return funds at maturity, recovery is a legal matter, not a smart-contract one |

**Why This Matters:**
- Collectively the most opaque exposure in the portfolio. Even Midas mGLOBAL has a tokenization issuer with public attestations; these farms rely on private bilateral arrangements.
- The three maturities (2026-07-11, 08-01, 08-29) straddle the Midas mGLOBAL roll-off (08-01), so a delay or default at any would compound queue pressure precisely when the largest position also matures.

---

#### 3. SwapFarmV2WithMaturity (PYUSD / Sentora PRIME basket)

**Risk Score: 3.0/5**

**Description:**
Maturing CoW-swap farm at [`0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) routing USDC into a basket of [`PYUSD`](https://etherscan.io/address/0x6c3ea9036406852006290770BEdFcAbA0e23A0e8) and Sentora PRIME [`senPYUSDPRIMEv2`](https://etherscan.io/address/0xC21b08C16458202593D4D9B26b9984Ee67b38BbD). Maturity: **2026-07-11**. $4.73M deployed.

**Key Risk Factors:** PYUSD is a Paxos-issued, NYDFS-regulated stablecoin — a high credit standard. The Sentora PRIME wrapper adds a credit-vault layer over PYUSD. Primary risks are the CoW-solver settlement dependency at maturity and the Sentora PRIME redemption mechanics.

---

#### 4. CapFarm — Cap Protocol stcUSD

**Risk Score: 4.0/5**

**Description:**
`CapFarm` ([`0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694)) holds [`stcUSD`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), the staked yield-bearing version of Cap Protocol's `cUSD` stablecoin. Cap is a 2025-vintage stablecoin issuer whose yield is sourced from delegated operator strategies backed by restaked collateral. $4.23M — the only funded Illiquid-bucket position; the cUSD/stcUSD swap basket that also carried Cap exposure now holds $0.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Issuer Maturity** | **High** | Cap is ~1 year old, limited stress-test history |
| **Peg Risk** | High | cUSD peg integrity relies on Cap's reserve attestations and operator soundness |
| **Smart Contract** | Medium | Cap's contracts have been audited but are young in production |
| **Liquidity (secondary)** | Medium | stcUSD secondary liquidity is thin |

**References:**
- [stcUSD on Etherscan](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- [Cap Protocol](https://cap.app/)

---

#### 5. AaveV4Farm — Aave V4 USDG market

**Risk Score: 3.0/5**

**Description:**
`AaveV4Farm` ([`0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657)) supplies into an Aave V4 market for [`USDG`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D) (Global Dollar, a Paxos/Global Dollar Network stablecoin) via an Aave V4 hub/spoke deployment. Maturity: **2026-07-11**. $2.99M. A new farm type this assessment.

**Key Risk Factors:** Aave V4 is a newer codebase than V3; the position also carries USDG issuer/peg risk. Onchain-verifiable lending exposure, moderate risk.

---

#### 6. ERC4626FarmWithMaturity — Steakhouse-curated MetaMorpho

**Risk Score: 2.5/5**

**Description:**
`ERC4626FarmWithMaturity` ([`0x76D2E84009dAE457f8667D823c7c96e9A7c35B78`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78)) deposits into a dedicated Steakhouse-curated MetaMorpho V1.1 USDC vault [`0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9) ("infiniFi USDC"). $2.13M.

**Key Risk Factors:** Standard MetaMorpho stack risk (Morpho Blue isolated markets + curator allocation) under a reputable curator. Low independent risk; included for completeness.

---

### Aggregate Risk Assessment

**Concentration:** ~78% of TVL is in two offchain exposures — Midas-Fasanara mGLOBAL (~47%) and three RWA escrow counterparties (~31%) — far above the protocol's $27.83M liUSD first-loss notional. The single Midas position alone exceeds the buffer. An adverse event at either would test, and could exhaust, the liability ladder before iUSD holders are protected.

**Liquidity:** The Liquid bucket holds ~$0. iUSD-to-USDC is queue-only until the maturity sequence (2026-07-11 → 2026-08-01 → 2026-08-29) settles — and a roll-forward at any of those dates releases no cash.

**Offchain exposure:** Midas-Fasanara (~47%) + three RWAEscrowFarms (~31%) = **~78% of TVL** has material offchain custodial, valuation, or counterparty dependence.

**Stress sequence to monitor:**
1. **2026-07-11** — ~$17.9M cluster: RWA escrow ($10.21M, receiver = multisig) + PYUSD/Sentora swap ($4.73M) + Aave V4 USDG ($2.99M).
2. **2026-08-01** — Midas mGLOBAL ($30.87M) + RWA escrow ($5.10M). The single largest scheduled event for the protocol.
3. **2026-08-29** — RWA escrow ($5.05M). Counterparty identity unverified.

**Recommendation:**
Treat current InfiniFi exposure as primarily a credit exposure to **(a) a tokenized Fasanara hedge-fund position (~47%) and (b) three undisclosed RWA escrow counterparties (~31%)**, rather than as a diversified DeFi yield strategy — the onchain-verifiable DeFi positions are now a minority of the book. Reassessment should be triggered immediately if any of the upcoming maturities fail to settle on schedule.

**Data Sources:**
- Onchain: `FarmRegistry.getFarms()` / `getTypeFarms()`, per-farm `assets()` and `maturity()`, per-escrow `receiver()`/`totalAssets()`, `Accounting.totalAssetsValue()` and `.totalAssetsValueOf(uint256)` (verified 2026-07-04).
- [DefiLlama](https://defillama.com/protocol/infinifi) — TVL cross-check ($65.3M on 2026-07-04).
- [InfiniFi Transparency Dashboard](https://stats.infinifi.xyz/) — cross-checked but not used as the primary source.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| February 4, 2026 | 2.3 | Initial assessment |
| May 18, 2026 | 3.2 | Reassessment |
| July 4, 2026 | 3.4 | Reassessment — offchain concentration up, TVL down |
