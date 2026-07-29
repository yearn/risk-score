# Protocol Risk Assessment: InfiniFi

- **Assessment Date:** February 4, 2026 (Updated: July 4, 2026; July 29, 2026)
- **Token:** siUSD (Staked iUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)
- **Final Score: 3.5/5.0**

## Overview + Links

InfiniFi is a stablecoin protocol that allows users to deposit assets (USDC, USDT) to mint iUSD, a stablecoin pegged to the US Dollar. The protocol automatically deploys deposited collateral into a portfolio of farm contracts categorized as **Liquid** (instant withdrawal), **Illiquid** (perpetual but exit-controlled), and **Maturing** (locked until fixed maturity dates). As of this assessment the largest allocations are Midas-tokenized **Fasanara Global** (~41% of TVL, maturity extended to 2026-08-26), three **offchain RWA escrow** positions (~28% combined), a large **PYUSD farm** (~19%), **Cap Protocol stcUSD** (~7%), an **Aave V4 USDG** market (~4%), and several smaller positions including Steakhouse MetaMorpho. Roughly **69% of TVL sits in offchain-custodied or NAV-attested positions** (Midas mGLOBAL + the RWA escrows). All major maturities were rolled forward by 3–4 weeks since the last assessment. See Appendix A for detailed analysis of the largest farm deployments.

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

- **Team Multisig**: [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) — Gnosis Safe v1.4.1, **4/8 threshold**, 8 EOA signers (one new signer added since July 4: `0xCC30e7d9dfBc29613E2A1e272cd624aFC3Abe1E9` has no individual protocol roles), nonce 543.
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
- **TVL**: $60.40M (verified onchain via `Accounting.totalAssetsValue()` and corroborated by [DefiLlama](https://defillama.com/protocol/infinifi) at $60.39M on 2026-07-29). TVL has continued to decline from a ~$177M peak in early 2026, through ~$65M in early July and now ~$60M — a slow, steady contraction rather than a run.
- **July–August 2026 maturity roll-forward**: the 2026-07-11 cluster of maturities (RWA escrow 0x04d5, PYUSD swap, Aave V4 USDG, Steakhouse MetaMorpho) and the 2026-08-01 cluster (Midas mGLOBAL, RWA escrow 0x9E5e) were all rolled forward by 3–4 weeks. New maturities are now 2026-08-05 and 2026-08-26 respectively. The 2026-08-29 RWA escrow was also extended to 2026-09-23. This is the second observed roll-forward of the protocol's major maturity clusters — no maturities have been settled to release USDC to the redemption queue since the last assessment.
- **Incidents**: No reported security incidents or exploits found. iUSD oracle still reports 1.0 (verified onchain 2026-07-29 — no loss-socialization event).
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.
- **liUSD unwinding**: The `UnwindingModule` holds ~8.85M iUSD (down from ~16.87M), indicating ~$8M of locked-token positions completed their early-exit process since the last assessment. The `LockingController` totalBalance has shrunk from $27.83M to $19.71M.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed via farm contracts grouped into three `AssetType` buckets in `FarmRegistry`: **Liquid** (instant withdrawal), **Illiquid** (perpetual but slow to unwind), and **Maturing** (locked until a fixed maturity date). The current portfolio is heavily concentrated in tokenized RWA (Midas-Fasanara) and offchain RWA escrow positions, with smaller onchain positions in a PYUSD/Sentora basket, Cap Protocol stcUSD, an Aave V4 USDG market, and Steakhouse MetaMorpho. **Critical: The two largest exposures — Midas mGLOBAL and the three RWA escrows, ~78% of TVL combined — are offchain-custodied. See Appendix A.**
- **Asset Allocation** (verified onchain via `Accounting.totalAssetsValueOf(type)` and per-farm `assets()`, 2026-07-04):

  | Bucket | Value (USD) | Share |
  |--------|------------:|------:|
  | Liquid (USDC instant) | **~$0.7** | **~0%** |
  | Illiquid (perpetual) | $5.45M | 9.0% |
  | Maturing (fixed-term) | $54.94M | 91.0% |
  | **Total** | **$60.40M** | 100% |

  **Critical observation**: The Liquid bucket is empty in practice (only dust in `RedeemController`, ~$0.67 total). Effectively all ~$60.40M of TVL sits in Illiquid or Maturing farms, and the Maturing bucket alone is 91%. **There is no instant-redemption capacity for iUSD holders without entering the queue.**

  Top farms by deployed value:

  | Farm | Type | Target | Assets | Share |
  |------|------|--------|-------:|------:|
  | [`MidasFarm`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF) | Maturing | mGLOBAL — Midas Fasanara Global ([`0x7433…98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)). Maturity **2026-08-26** (rolled forward from 2026-08-01). | ~$24.80M | ~41% |
  | [`PYUSDFarm`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) | Maturing | PYUSD ([`0x6c3e…A0e8`](https://etherscan.io/address/0x6c3ea9036406852006290770BEdFcAbA0e23A0e8)). Maturity 2026-08-05. **Large new position — TODO full contract name/type, sentora pairing status.** | ~$11.77M | ~19% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | Maturing | RWA escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) → receiver = **Team Multisig** [`0x8060…400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). Maturity **2026-08-05** (rolled forward from 2026-07-11). | ~$8.28M | ~13.7% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | Maturing | RWA escrow [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) → receiver [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) (EOA). Maturity **2026-09-23** (extended from 2026-08-29). **Counterparty TODO.** | ~$4.10M | ~6.8% |
  | [`CapFarm`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | Illiquid | stcUSD — Cap Protocol staked cUSD ([`0x8888…8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) | ~$3.55M | ~5.9% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | Maturing | RWA escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) → receiver [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) (EOA). Maturity **2026-08-26** (rolled forward from 2026-08-01). **Counterparty TODO.** | ~$2.08M | ~3.4% |
  | [`AaveV4Farm`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657) | Maturing | Aave V4 USDG market — Global Dollar ([`0xe343…491D`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D)). Maturity **2026-08-05** (rolled forward from 2026-07-11). | ~$1.81M | ~3.0% |
  | [Farm TODO 0xe919C6](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | Maturing | **TODO — identify.** Maturity 2026-08-05. | ~$1.61M | ~2.7% |
  | [`ERC4626FarmWithMaturity`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78) | Maturing | Steakhouse infiniFi USDC ([`0xBEEF…3aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9)) — dedicated MetaMorpho V1.1 vault. Maturity **2026-08-05** (rolled forward from original maturity). | ~$0.91M | ~1.5% |
  | [Farm TODO 0xd880D7](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | Illiquid | **TODO — identify.** Appears to be an Illiquid-type farm. | ~$0.84M | ~1.4% |
  | [`SwapFarmV2WithMaturity`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) | Maturing | Previously CoW-swap PYUSD / Sentora PRIME. Now holds only residual Sentora PRIME. Maturity **2026-08-05** (rolled forward from 2026-07-11). | ~$0.48M | ~0.8% |
  | Remaining (dust / matured / inactive) | mixed | SparkSUSDCFarm, AaveV3Farm (Horizon), MapleFarm, FxSaveFarm, cUSD/stcUSD swap, PrimeBrokerFarm, 0x9A0dB…Bb885, 0xeb32a… — all at $0 / dust | ~$0.01M | <0.1% |

  Notable concentrations: **Midas-Fasanara mGLOBAL ≈ 41%**, **PYUSD (0x84FF7) ≈ 19%**, **offchain RWA escrow (3 farms) ≈ 24%**, **Cap Protocol stcUSD ≈ 6%**, **Aave V4 USDG ≈ 3%**, **Steakhouse MetaMorpho ≈ 1.5%**.

  The book is highly consolidated. The Midas position at ~41% remains the single largest concentration, followed by a new $14.6M PYUSD position (~19% in raw USD terms, normalized to ~$11.8M after correcting for accounting). `SparkSUSDCFarm`, `AaveV3Farm` (Horizon), `MapleFarm`, `FxSaveFarm`, and cUSD/stcUSD CoW-swap farms currently hold $0. Cap Protocol exposure is a single ~$4.4M stcUSD position (~6%). The offchain RWA escrow footprint is **three farms totalling ~$17.5M onchain (raw) / ~$13.7M normalized (~23%)**, down in share from ~31% as the PYUSD position has grown and other maturing farms were partially withdrawn. The farm set also includes two unidentified farms (0xe919C6, 0xd880D7) that together hold ~$2.4M.

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
  1. The `FINANCE_MANAGER` role-holder set (currently 4 contracts: `YieldSharing`, `LiquidationFarm`, `PLSmootherHelper`, and `0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4` replacing the former `PrimeBrokerFarm`). No EOA or multisig holds the role directly. Adding a new holder requires `GOVERNOR` (Long Timelock, 7d).
  2. The calling contract correctly accounting realized farm profit before calling `smoothProfit`. A bug in `YieldSharing`'s profit math, or a compromised farm that over-reports yield, would let PLSmoother mint unbacked iUSD. The PLSmoother contract itself would not catch the discrepancy.

**Slashing-order quirk** (from PLSmoother source comment): *"the vesting yield held by this contract … isn't included in the slashing order. As a result, it could hold undistributed rewards (i.e. pending profit) that would otherwise could have been used to mitigate losses."* If losses materialize while iUSD is still mid-vest inside PLSmoother, that pending profit does **not** absorb the loss — losses skip the smoother and hit liUSD / siUSD directly. An audited and acknowledged design property, not a bug, but a real risk-review-relevant point.

### Collateralization

- **Backing**: iUSD is backed by the assets deployed in the underlying strategies.
- **Verification**: The protocol uses a "Self-Laddering Engine" to match asset duration with liability duration (locked periods).
- **Offchain / High-Risk Exposures** (verified onchain, see Appendix A for detail):
  - **Midas-tokenized Fasanara Global (mGLOBAL)** — single largest position at ~$24.80M (~41%). Midas is a tokenization issuer; the underlying is Fasanara Capital's hedge-fund strategy. Custody and valuation are entirely offchain. Maturity extended to 2026-08-26.
  - **Three RWA Escrow Farms** — ~$17.5M onchain raw (~$13.7M normalized, ~23% of TVL): ~$10.29M via escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) (receiver = the **Team Multisig** itself, maturity extended to 2026-08-05), ~$2.58M via escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) (receiver EOA [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926), maturity extended to 2026-08-26), and ~$5.09M via escrow [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) (receiver EOA [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211), maturity extended to 2026-09-23). All three escrow positions are value-attested onchain by the same keeper/rate manager `RWAEscrowRateManager` ([`0x11F6…4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)). Escrow receivers unchanged. Pure trust-based offchain exposure during the lock period.
  - **PYUSD (0x84FF7 Farm)** — ~$14.61M raw (~$11.77M normalized, ~19% of TVL). Large new PYUSD position via a new farm contract (TODO full contract name/type). Maturity 2026-08-05. PYUSD is Paxos-issued, NYDFS-regulated, but the farm's structure (swap basket or direct holding) is not yet identified.
  - **Cap Protocol stcUSD** — ~$3.55M (~6% of TVL). Cap is a relatively young (2025) stablecoin issuer.
  - **Aave V4 USDG market** — ~$1.81M supplied into Aave's V4 Global Dollar (USDG) market.
- **Token Breakdown** (verified onchain 2026-07-29, all in iUSD-equivalent):

  | Component | Value | Source |
  |-----------|------:|--------|
  | iUSD totalSupply | 60.39M | `iUSD.totalSupply()` |
  | — held by siUSD (Staked) | 40.32M | `iUSD.balanceOf(siUSD)` |
  | — held by LockingController (liUSD active) | 10.86M | `iUSD.balanceOf(LockingController)` |
  | — held by UnwindingModule (liUSD in unwind) | 8.85M | `iUSD.balanceOf(UnwindingModule)` |
  | — held by YieldSharing (dust) | 0.03M | `iUSD.balanceOf(YieldSharing)` |
  | — circulating / in user wallets | ~0.34M | residual |
  | siUSD totalSupply | 37.31M shares | exchange rate ≈1.081 iUSD/siUSD |
  | LockingController totalBalance (liUSD) | 19.71M | `LockingController.totalBalance()` |

  The first-loss buffer (`LockingController.totalBalance()` = 19.71M) has contracted from 27.83M, with ~$8M of liUSD positions completing their early-exit unwinding since the last assessment. The buffer is now smaller than the single Midas mGLOBAL position (~$24.8M) and well below the combined offchain exposure (~$41M).

### Provability

- **Transparency**: Reserves and allocations are verifiable onchain via `FarmRegistry.getFarms()` and per-farm `assets()`.
- **Reserves**: Onchain DeFi positions (Cap stcUSD, Aave V4 USDG, Steakhouse MetaMorpho, the PYUSD/Sentora basket) are fully verifiable. The dominant offchain-backed positions — Midas mGLOBAL (47%) and the three RWA escrow farms (31%) — cannot be independently audited onchain; together they are ~78% of TVL, so the majority of backing now rests on offchain attestation.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: only ~$0.34M circulating outside protocol contracts. Instant-redemption buffer is ~$0; **any iUSD holder wanting to exit today must enter the FIFO queue** and wait for maturing positions to roll off or new deposits to come in.
  - **siUSD**: Staked holders can withdraw to iUSD via `siUSD.withdraw()` (ERC4626) but then face the same redemption queue.
  - **liUSD**: Locked positions (1-13 weeks). Early exits route through `UnwindingModule` and incur a slashing penalty. ~8.85M iUSD is currently mid-unwind (down from ~16.87M), indicating ~$8M of locked positions completed their early exits.
- **Withdrawal Queues**: With the liquid buffer at ~$0 the queue is the only path for iUSD-to-USDC. Upcoming maturities that can restore liquidity are **2026-08-05** (~$30M cluster: $10.29M RWA escrow + $14.61M PYUSD + $2.25M Aave V4 USDG + $1.13M Steakhouse + $2.00M unidentified farm + $0.59M old PYUSD residual), **2026-08-26** (~$31M Midas mGLOBAL + $2.58M RWA escrow), and **2026-09-23** ($5.09M RWA escrow). In practice the queue can only be cleared as these maturities trigger — but all the above have already been rolled forward at least once, and there is no guarantee they will not be rolled forward again.

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
    - _Timelock_: Changes to capital allocation parameters (e.g., Farm Registry updates) use the **Short Timelock** (1 hour delay).
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
    - _Scope_: Adding a new protocol to the allowlist requires a governance vote and must pass through the **Short Timelock** (1 hour delay).
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/8 threshold**, 8 anonymous EOA signers (verified onchain via `getOwners()` and `getThreshold()` on 2026-07-29). Nonce 543. One new signer added since July 4 (`0xCC30e7d9dfBc29613E2A1e272cd624aFC3Abe1E9`, holds no individual protocol roles).

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

- **Other onchain role membership** (verified 2026-07-29 by enumerating `keccak256` of each role name in `CoreRoles`):

  | Role | Count | Notable holders |
  |------|------:|-----------------|
  | ENTRY_POINT | 2 | Gateway proxy, MigrationController |
  | RECEIPT_TOKEN_MINTER | 4 | YieldSharing, MintController, PLSmoother, MigrationController |
  | RECEIPT_TOKEN_BURNER | 7 | siUSD, UnwindingModule, LockingController, YieldSharing, RedeemController, PLSmootherHelper, PLSmoother |
  | LOCKED_TOKEN_MANAGER | 1 | LockingController |
  | TRANSFER_RESTRICTOR | 1 | AllocationVoting |
  | FARM_MANAGER | 4 | ManualRebalancer, AfterMintHook, BeforeRedeemHook, EmergencyWithdrawal |
  | FINANCE_MANAGER | 4 | YieldSharing, LiquidationFarm, PLSmootherHelper, [`0xfD1Ea…83dE4`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4) (replaced former PrimeBrokerFarm; **TODO** identify new contract) |
  | PERIODIC_REBALANCER | 1 | EOA `0x2Cba…aB1a` (keeper bot) |
  | PROTOCOL_PARAMETERS | 3 | Short Timelock, Long Timelock, MaturedFarmCleaner |
  | DEFAULT_ADMIN_ROLE | **0** | — (renounced) |

- **emergencyAction bypass analysis**: The `Timelock.sol` contract **overrides emergencyAction to a no-op**, preventing any GOVERNOR holder from using it to bypass timelock delays. This is a deliberate safety mechanism confirmed in source code.

### Programmability

- **Hybrid Model**: The "Self-Laddering Engine" algorithmically matches asset duration with liability duration. "Allocators" actively manage the amount of capital deployed to specific allowlisted strategies.
- **Oracle**: Protocol uses Chainlink price feeds for asset pricing to maintain the 1:1 mint ratio and calculate collateral value.
- **Oracle Updates**: Oracles are upgradeable via governance (**Short Timelock**, 1-hour delay). The iUSD price oracle (`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`) is a FixedPriceOracle — price changes only during loss socialization events (de-peg).

### External Dependencies

- **Top dependencies (by deployed value)**: **Midas** (mGLOBAL tokenization layer over Fasanara Capital) ~41%, **Unidentified RWA escrow counterparties** (three separate escrows; one routes to the team multisig, two to external EOAs — TODO identify) ~23%, **PYUSD / Paxos** (via a new $14.6M raw PYUSD farm and the residual old swap basket) ~20%, **Cap Protocol** (stcUSD) ~6%, **Aave (V4) / Global Dollar (USDG)** ~3%, **Steakhouse-curated Morpho MetaMorpho** ~1.5%. The Spark/MakerDAO, Aave Horizon, Maple Finance, and f(x) Protocol farms currently hold $0. Two unidentified farms (`0xe919C6`, `0xd880D7`) together hold ~$2.4M. The CoW-Protocol solver set is a settlement dependency for the maturing swap baskets.
- **Stablecoin dependencies**: USDC and USDT enabled as deposit assets (verified onchain). The protocol also takes indirect exposure to PYUSD (now the second-largest position at ~19% via a new farm), USDG / Global Dollar (via the Aave V4 market), cUSD/stcUSD (Cap), and to T-Bill-backed / hedge-fund RWAs (via Midas mGLOBAL and the three RWA escrow counterparties). USDe and sUSDe remain not enabled as deposit assets on FarmRegistry.
- **Cross-chain / bridge dependency (verified July 29, 2026): LayerZero, lock-and-mint.** Both receipt tokens bridge to **Katana** via LayerZero V2 OFT Adapters that **escrow the canonical token on Ethereum** — they hold no mint authority, so a bridge compromise cannot mint native iUSD/siUSD:
  | Token | Ethereum OFT Adapter | Escrowed | Katana native OFT |
  |---|---|---:|---|
  | siUSD | [`0x5f21…c3c0`](https://etherscan.io/address/0x5f2106bb2a5aba6a783dbf29c8d3b09c175bc3c0) | 0 siUSD (fully unwound) | [`0x6894…F92D`](https://explorer.katanarpc.com/address/0x68943c066747690ecDAEB027fa722B090ee6F92D) |
  | iUSD | [`0xdd1c…3005`](https://etherscan.io/address/0xdd1cb2e1aa483e1d94e3e22e70cfbb634fcb3005) | 4.33 iUSD | [`0x9Fa1…1C10`](https://explorer.katanarpc.com/address/0x9Fa1202516916534Ade66962Ee91410d559f1C10) |

  Each adapter's `token()` returns the corresponding mainnet token and its `endpoint()` is the canonical LayerZero V2 `EndpointV2` [`0x1a44…728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c); the Katana side exposes `oftVersion()` and the LZ V2 Katana endpoint `0x6F47…DD5B`. Neither adapter appears in the `RECEIPT_TOKEN_MINTER` set (4 holders, all internal — see [Token Mint Authority](#token-mint-authority)), confirming the lock-and-mint (not mint-authority) model. The siUSD OFT adapter has been fully unwound — all bridged siUSD has returned to Ethereum.
- **Chainlink CCIP: not currently live.** The `OUTLAND_CONNECTOR_CCIP` [`0x4119…dd24`](https://etherscan.io/address/0x41193099288DF3F56a8323812E2844A7CfaFdd24) and `OUTLAND_CONNECTOR_LZ` [`0x54cB…0ee5`](https://etherscan.io/address/0x54cB6634BE99dDF4c7502f8E8f3b8D3f27Ba0ee5) from PR 224 are deployed but hold no iUSD/siUSD. The CCIP `TokenAdminRegistry` was checked on 2026-07-29 and has no code at the expected mainnet address — CCIP may be on a different registry or not deployed to mainnet. **Reassessment trigger:** re-check if a CCIP token pool is registered for iUSD/siUSD or the Outland CCIP connector begins holding value.

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
- Robust governance: 4/8 multisig + dual timelock (7d/1h) + separation of powers. DEFAULT_ADMIN renounced. emergencyAction bypass prevented via no-op override in Timelock.
- All contracts verified onchain, all funded farms properly target their stated protocols/counterparties
- First large maturity cluster (May–June 2026) settled without a loss-socialization event or depeg
- Backed by reputable investors (Electric Capital, Sam Kazemian)

### Key Risks

- **~64% of TVL is offchain-custodied or NAV-attested**: Midas-Fasanara mGLOBAL (~41%) plus three RWA escrow farms (~23%) together represent roughly $38M whose backing cannot be verified onchain — down in share from the prior ~78% due to a large new onchain PYUSD position, but still the dominant risk factor.
- **Perpetual maturity roll-forward without settlement**: all major maturities (2026-07-11 and 2026-08-01 clusters) were rolled forward by 3–4 weeks instead of settling. No maturities have released USDC to the redemption queue since the last assessment — the queue-only state now appears structural rather than transitional.
- **Single-position concentration near 40%**: Midas-Fasanara mGLOBAL is ~41% of TVL ($24.8M normalized), maturing 2026-08-26. This exceeds the entire liUSD first-loss buffer ($19.71M).
- **RWA escrow footprint**: three separate `RWAEscrowFarm` positions hold ~$17.5M onchain (~$13.7M normalized, ~23%). Funds sit with offchain counterparties (one escrow's receiver is the team multisig itself; two are external EOAs), value-attested by a single onchain rate manager. This is the most opaque exposure in the portfolio.
- **Liquid reserves remain fully depleted**: onchain `Accounting.totalAssetsValueOf(Liquid)` returns ~$0.67; the Liquid-type farms hold only dust. iUSD instant redemption stays effectively disabled — every redeemer must enter the FIFO queue.
- **Short Timelock delay is only 1 hour**: parameter, oracle (`setPrice`/`setOracle`), and farm add/remove actions execute after only a 1-hour delay, a narrow early-warning window for those changes.
- **TVL continues to contract**: now ~$60.40M, on a steady downtrend from a ~$177M peak earlier in 2026, with the liUSD first-loss buffer also shrinking ($19.71M, down from $27.83M) — signs of ongoing exit pressure.
- **Multisig retains broad non-timelocked powers** — EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, UNPAUSE, MINOR_ROLES_MANAGER, PAUSE, and EXECUTOR_ROLE on InfiniFiCore — so a 4/8 anonymous signer set can both propose and execute its own timelock actions and move farm funds to a safe address.
- **New unidentified positions**: a new PYUSD farm (0x84FF7, ~$14.6M raw onchain) and two farms (0xe919C6, 0xd880D7) totalling ~$2.4M have not been fully identified; the FINANCE_MANAGER role holder also changed to an unidentified contract.
- **Short operational history** (~13 months in production since June 2025); the first maturity cluster settled cleanly but the protocol has since adopted a roll-forward rather than settlement pattern.
- **Pseudonymous team** with notable history concerns: key contributor (RobAnon) authored Revest Finance contracts exploited for $2M; lead dev's prior projects (Fei, ECG) have wound down.
- **No disclosed legal entity or incident response plan**.
- **Certora formal verification** report published but finding severity breakdown not available on the landing page (full PDF required for detailed review).

### Critical Risks

- **Queue-only redemption backed by a concentrated, offchain book with no demonstrated settlement track record**. Liquid reserves are ~$0 and ~64% of TVL is in Midas mGLOBAL plus three offchain RWA escrows. All major maturities have now been rolled forward at least twice without settling — there is no evidence the protocol can or will release USDC from maturing positions. Combined with a shrinking first-loss buffer ($19.71M) that is smaller than the Midas position alone, operators of any vault that requires reliable USDC exit should treat InfiniFi as queue-mode with heavy offchain-counterparty credit exposure and uncertain settlement timing.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. Multiple audits by reputable firms (Spearbit, Certora, Cantina).
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable onchain.
- [x] **Total centralization** — PASSED. 4/8 multisig with dual timelocks, DEFAULT_ADMIN renounced.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Strong coverage — Spearbit/Cantina Code main review (8H/6M/25L), Certora formal verification ([report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report)), Cantina public competition, multiple upgrade reviews (YieldSharing V2 → V3 upgrade reviewed).
- **History**: ~13 months in production (mainnet launch June 2025; this reassessment July 2026). TVL ~$60M, on a steady downtrend from a ~$177M peak earlier in 2026.
- **Bounty**: [Active on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591).
- **Incidents**: No known exploits or loss events since launch. The May–June 2026 maturity cluster settled without a depeg, but the subsequent cluster (July 2026) was rolled forward without settlement.

**Score: 2.5/5** — Extensive audit coverage including formal verification and ongoing upgrade reviews; ~13 months production with no losses. Held at 2.5 (rather than improving toward 2.0) because TVL has continued to contract and the protocol has not yet weathered an adverse credit event in its offchain positions, and has now demonstrated a roll-forward rather than settle pattern.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.2**
- 4/8 multisig (Gnosis Safe v1.4.1, up from 4/7 with one new signer) with dual timelocks (7d Long for GOVERNOR-scope, 1h Short for parameters) remains in place.
- DEFAULT_ADMIN_ROLE renounced on Core and both timelocks; `Timelock.emergencyAction` is a no-op override.
- All 8 multisig signers are anonymous EOAs; the new signer holds no individual protocol roles.
- The multisig holds EXECUTOR_ROLE on the Long Timelock alongside the deployer EOA and individual signer EOAs, so it can both schedule and execute its own proposals; the timelock delay still applies but the execution gate is not held by a distinct party.
- Short Timelock delay remains **1 hour**. Parameter, oracle, and farm add/remove actions clear after only an hour, materially shrinking the early-warning window for those changes.
- Multisig retains significant non-timelocked direct powers: UNPAUSE, EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, FARM_SWAP_CALLER, MINOR_ROLES_MANAGER, PAUSE.

**Subcategory B: Programmability — 3.0**
- Hybrid model: algorithmic Self-Laddering Engine + active Allocator management. Asset/liability matching is the design intent but in practice the allocator decisions have produced a portfolio with effectively zero liquid buffer and ~64% offchain concentration, with maturities repeatedly extended rather than settled.
- Oracle-dependent for pricing (Chainlink + protocol-specific oracles for stcUSD, mGLOBAL, RWA escrow rate manager); ORACLE_MANAGER role is under the Short Timelock (1h).
- emergencyAction safely disabled on timelocks (unchanged).

**Subcategory C: Dependencies — 3.7**
- Exposure has consolidated into Midas mGLOBAL (~41%), three RWA escrow counterparties (~23%), a large new PYUSD position onchain (~19%), Cap Protocol (stcUSD, ~6%), Aave V4 (USDG, ~3%), Steakhouse MetaMorpho (~1.5%), and two unidentified farms (~$2.4M).
- Offchain exposure is down from ~78% to ~64% due to growth in the onchain PYUSD position, but absolute offchain exposure (~$38M) remains far above the liUSD first-loss buffer (~$19.7M).
- One RWA escrow routes to the team multisig itself; two route to external EOAs whose identities are undisclosed. All three depend on a single onchain rate manager for valuation.
- New unidentified positions (PYUSD farm + two farms totalling ~$2.4M) and a changed FINANCE_MANAGER holder introduce additional dependency opacity.
- Pegs / NAVs depended on: USDC, USDT, PYUSD, cUSD, USDG, and the offchain mGLOBAL NAV and RWA escrow attestations.

**Score: 3.3/5** — (3.2 + 3.0 + 3.7) / 3 ≈ 3.30. Unchanged from last assessment. Governance slightly improved (4/8 vs 4/7) and offchain dependency share declined (~64% vs ~78%), but the 1-hour Short Timelock, unidentified farms, and concentrated offchain counterparty trust keep the score at this level.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.5**
- Reserves are 100% accounted for onchain via `FarmRegistry` and per-farm `assets()` — total matches `Accounting.totalAssetsValue()` of ~$60.40M against an iUSD supply of 60.39M (parity within rounding).
- **~64% of TVL** is in positions whose backing cannot be independently audited onchain:
  - **Midas mGLOBAL** (~41%, ~$24.8M) wraps Fasanara Capital's hedge-fund strategy — TradFi custody and NAV.
  - **Three RWAEscrowFarms** (~23%, ~$13.7M normalized) send funds to offchain counterparties (one receiver is the team multisig, two are external EOAs), with value attested by a single onchain rate manager.
- The remaining ~36% sits in onchain-verifiable positions: a large PYUSD position (~19%), Cap stcUSD (~6%), Aave V4 USDG (~3%), Steakhouse MetaMorpho (~1.5%), and two unidentified farms (~$2.4M).
- Liability ladder (liUSD → siUSD → iUSD) is intact but the first-loss buffer has weakened further: `LockingController.totalBalance()` = $19.71M (down from $27.83M), with ~$8.85M of liUSD still mid-unwind. The buffer is now significantly smaller than the single Midas position and a fraction of the combined offchain exposure — a single adverse credit event in Midas or the RWA escrows could exhaust it before iUSD holders are protected.

**Subcategory B: Provability — 3.5**
- Allocations and book values are fully transparent onchain (which farm holds what, and the attested value).
- The *true* underlying value of the dominant offchain exposures — Midas mGLOBAL (~41%) and the three RWA escrows (~23%) — rests entirely on offchain attestation. Yearn would have to trust Midas/Fasanara's NAV and a single `RWAEscrowRateManager` for ~64% of the book.
- Two farms (0xe919C6, 0xd880D7) and the new FINANCE_MANAGER holder could not be identified via onchain data alone (TODO).
- siUSD exchange rate is ERC4626-standard and verifiable.

**Score: 4.0/5** — (4.5 + 3.5) / 2 = 4.0, unchanged. Offchain/unverifiable exposure has declined from ~78% to ~64%, but the first-loss buffer has weakened by $8M, the Midas position still exceeds it, and new unidentified positions add opacity.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: Onchain `Accounting.totalAssetsValueOf(Liquid)` returns ~$0.67; the Liquid-type farms collectively hold dust. There is **no instant-redemption capacity for iUSD today**.
- **Queue**: With the liquid buffer depleted, redemptions must enter the FIFO queue and wait for maturing positions to roll off. The key maturities were all rolled forward by 3–4 weeks without settlement: the 2026-07-11 cluster (now 2026-08-05) and the 2026-08-01 cluster (now 2026-08-26). This is the second consecutive roll-forward of major maturities — the protocol has not demonstrated a willingness or ability to settle positions and release cash to the queue.
- **Upcoming maturities**: 2026-08-05 (~$30M cluster), 2026-08-26 (~$34M cluster), 2026-09-23 (~$5M). All could be rolled forward again.
- **Depth (secondary)**: iUSD/siUSD DEX depth is thin relative to supply; secondary-market exit at par cannot be assumed under stress.
- **Free supply**: Only ~$0.34M of iUSD sits in user wallets outside protocol contracts — down from ~$0.47M. The queue is the binding constraint for any material exit.

**Score: 4.5/5** — Up from 4.0. The protocol remains queue-only with a ~$0 liquid buffer and now has a demonstrated pattern of rolling forward maturities rather than settling them. The queue-only state appears structural rather than transitional, and there is no evidence the protocol can or will release USDC to redeemers. The risk to a holder needing liquidity has materially worsened.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Semi-pseudonymous; ex-Fei/Revest/ECG contributors. Known prior incident (Revest $2M hack) remains in the team's history.
- **Funding**: $3M Pre-Seed from reputable VCs.
- **Docs**: Above-average technical documentation; transparency dashboard ([stats.infinifi.xyz](https://stats.infinifi.xyz/)) shows live allocation data.
- **Legal**: No disclosed legal entity or jurisdiction.
- **Incident response**: No publicly documented plan. Emergency capabilities exist onchain (pause + emergency withdrawal). The clean settlement of the May–June maturity cluster shows the operational machinery can function, but the subsequent roll-forwards indicate a change in settlement behavior.

**Score: 2.5/5** — Unchanged.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.3 | 30% | 0.99 |
| Funds Management | 4.0 | 30% | 1.20 |
| Liquidity Risk | 4.5 | 15% | 0.675 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.49** |

**Final Score: 3.5**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: ELEVATED RISK**

The composite score is up from 3.4 → 3.5, crossing from MEDIUM to ELEVATED risk tier. The primary driver is the liquidity score increase (4.0 → 4.5) reflecting the demonstrated pattern of perpetual maturity roll-forwards without settlement, making the queue-only state appear structural. The key risks at this reassessment are:
- **Perpetual roll-forward without settlement**: all major maturities were extended without releasing USDC — the protocol has not settled a major position since at least early July.
- **~64% of TVL is offchain-custodied / NAV-attested**: Midas mGLOBAL (~41%) plus three RWA escrow farms (~23%), ~$38M whose backing cannot be verified onchain.
- **Concentration in Midas-Fasanara mGLOBAL** (~41% of TVL): single largest position, tokenized hedge-fund exposure, offchain custody and valuation — larger than the entire liUSD first-loss buffer ($19.71M).
- **First-loss buffer shrinking**: `LockingController.totalBalance()` down from $27.83M to $19.71M as liUSD exits continue.
- **No liquid redemption buffer**: ~$0 in Liquid farms; iUSD-to-USDC is queue-only with uncertain settlement timing.
- **Short Timelock at 1 hour** and multisig with broad non-timelocked powers (now 4/8, up from 4/7).
- **New unidentified positions** (PYUSD farm + two farms) and a FINANCE_MANAGER role holder change to an unidentified contract.
- **Short operational history** (~13 months); one maturity cluster settled cleanly but two subsequent clusters were rolled forward.

---

## Reassessment Triggers

- **Time-based**: Reassess in 30 days (target 2026-08-28), or immediately after the 2026-08-05 or 2026-08-26 maturity clusters settle. Given the roll-forward pattern, trigger if any of these are rolled forward again.
- **Liquidity-based**: Reassess immediately if (a) the FIFO redemption queue forms a backlog that does not clear at the next scheduled maturity, or (b) `Accounting.totalAssetsValueOf(Liquid)` remains <1% of total supply for more than 30 days. **This trigger has already fired** — reassess if liquid reserves remain depleted and another maturity is rolled forward.
- **TVL-based**: Reassess if TVL moves by more than 30% in either direction from the current ~$60.40M.
- **Concentration-based**: Midas-Fasanara mGLOBAL already exceeds the 40% single-farm threshold (~41%). Reassess if it exceeds 55%, if combined offchain exposure (Midas + RWA escrows) exceeds 80% of TVL, or if any *other* single farm exceeds 40% (the new PYUSD farm at ~$14.6M raw should be monitored for this).
- **Issuer / counterparty-based**: Reassess on any material event at Midas, Fasanara Capital, Cap Protocol, Paxos (PYUSD/USDG), or the RWA escrow counterparties (depeg, custodian change, restructure, regulatory action, failure to settle at maturity).
- **Governance-based**: Reassess after any signer change on the multisig, any new EXECUTOR_ROLE / PROPOSER_ROLE / CANCELLER_ROLE grant, any further change to either timelock's `getMinDelay()`, any change to the `Timelock.emergencyAction` no-op override, or any role grant on `InfiniFiCore` outside the Long Timelock.
- **Incident-based**: Reassess after any exploit, oracle failure, or material loss event at the protocol or in any farm with >$2M of InfiniFi exposure.
- **Architecture-based**: Reassess on any new farm category (new `AssetType` bucket), new asset enablement on `FarmRegistry`, new RWA escrow counterparty, or any change to YieldSharing/Accounting beyond the V3 line.

---

## Appendix A: Top Farm Exposure Analysis

Onchain inspection of `FarmRegistry.getFarms()` and per-farm `assets()` on 2026-07-29 shows the portfolio is concentrated in a small number of large positions, most of which are "Maturing" (locked until a fixed date). The Liquid bucket is empty in practice. The farms below cover ~99% of TVL.

The book is highly consolidated. The `SparkSUSDCFarm`, `AaveV3Farm` (Horizon), `MapleFarm`, `FxSaveFarm`, and cUSD/stcUSD CoW-swap farms currently hold $0. Midas mGLOBAL is ~41% of TVL and the offchain RWA escrow footprint spans **three farms totalling ~$17.5M onchain raw (~$13.7M normalized)**. A new PYUSD farm (0x84FF7) has become the second-largest position at ~$14.6M onchain raw (~$11.8M normalized, ~19%). Two additional farms (0xe919C6, 0xd880D7) totalling ~$3M onchain remain unidentified (`TODO`). The `PrimeBrokerFarm`'s FINANCE_MANAGER role was replaced by an unidentified contract (0xfD1Ea). **All major maturities were rolled forward 3–4 weeks** since the last assessment.

### Summary Table: Top Farms by Deployed Value

| Farm | Type | Underlying | Raw Onchain | Share (norm.) | Individual Risk |
|------|------|------------|-------------:|------:|----------------:|
| **MidasFarm (mGLOBAL)** | Maturing (2026-08-26) | Midas-tokenized Fasanara Global hedge-fund strategy | ~$31.0M | ~41% | **4.5/5** |
| **PYUSDFarm** `0x84FF7` | Maturing (2026-08-05) | PYUSD (Paxos) — **TODO** full contract name/type | ~$14.6M | ~19% | **3.0/5** |
| **RWAEscrowFarm** `0x04d5` | Maturing (2026-08-05) | Offchain escrow; receiver = **Team Multisig** | ~$10.3M | ~14% | **4.5/5** |
| **RWAEscrowFarm** `0x277F` | Maturing (2026-09-23) | Offchain escrow; receiver EOA `0xa03B…d211` | ~$5.1M | ~7% | **4.5/5** |
| **CapFarm (stcUSD)** | Illiquid | Cap Protocol staked cUSD | ~$4.4M | ~6% | **4.0/5** |
| **RWAEscrowFarm** `0x9E5e` | Maturing (2026-08-26) | Offchain escrow; receiver EOA `0x4831…D926` | ~$2.6M | ~3% | **4.5/5** |
| **AaveV4Farm (USDG)** | Maturing (2026-08-05) | Aave V4 Global Dollar (USDG) market | ~$2.3M | ~3% | **3.0/5** |
| [Farm TODO 0xe919C6](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | Maturing (2026-08-05) | **TODO** identify | ~$2.0M | ~3% | **TODO** |
| **ERC4626FarmWithMaturity (Steakhouse)** | Maturing (2026-08-05) | Steakhouse-curated MetaMorpho V1.1 USDC vault | ~$1.1M | ~1.5% | **2.5/5** |
| [Farm TODO 0xd880D7](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | Illiquid | **TODO** identify | ~$1.0M | ~1.4% | **TODO** |
| **SwapFarmV2WithMaturity (old PYUSD)** | Maturing (2026-08-05) | Residual Sentora PRIME only; PYUSD position fully withdrawn | ~$0.6M | ~1% | **3.0/5** |

### Detailed Farm Risk Assessments

---

#### 1. MidasFarm — Midas-tokenized Fasanara Global (mGLOBAL)

**Risk Score: 4.5/5**

**Description:**
`MidasFarm` ([`0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF)) holds [`mGLOBAL`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8), an ERC-20 token issued by Midas (a tokenization-as-a-service issuer) that represents a claim on the Fasanara Capital "Global" strategy. The underlying is wrapped in Midas's permissioned-issuance + offchain-NAV-attestation architecture rather than held directly. Maturity: **2026-08-26** (rolled forward from 2026-08-01). At ~41% of TVL this remains the single dominant position — larger than the entire liUSD first-loss buffer ($19.71M).

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Concentration** | **Very High** | ~41% of total InfiniFi TVL in a single position, exceeding the liUSD first-loss buffer |
| **Off-Chain Custody** | **Very High** | Underlying hedge-fund strategy assets held by traditional custodians at Fasanara |
| **NAV / Valuation** | **High** | mGLOBAL price reflects an off-chain NAV attestation from Midas / Fasanara |
| **Issuer Risk** | High | Two stacked issuers (Midas + Fasanara) plus their respective custodians |
| **Regulatory Risk** | High | Tokenized fund products are subject to securities regulation in EU/UK/US |
| **Liquidity Risk** | High | InfiniFi position is locked until the 2026-08-26 maturity, already rolled forward once; secondary mGLOBAL liquidity is thin |

**Why This Matters:**
- Single largest exposure: a loss event large enough to impair mGLOBAL value would consume the entire liUSD first-loss buffer ($19.71M) before iUSD holders are protected.
- Two stacked issuers (Midas + Fasanara) plus their respective custodians; valuation is a pure offchain NAV attestation.
- The 2026-08-26 maturity (was 2026-08-01, already rolled forward once) is the single most important upcoming event for InfiniFi liquidity — but there is no guarantee it will settle rather than being rolled forward again.

**References:**
- [mGLOBAL token on Etherscan](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)
- [Midas Capital](https://midas.app/)
- [Fasanara Capital](https://www.fasanara.com/)

---

#### 2. RWAEscrowFarms — Three Offchain Counterparties

**Risk Score: 4.5/5**

**Description:**
Three separate `RWAEscrowFarm` contracts hold ~$17.5M onchain raw (~$13.7M normalized, ~23% of TVL). Each sends underlying USDC to a dedicated `RWAEscrow` contract that forwards to an offchain receiver; position value during the lock is attested onchain by a single shared `RWAEscrowRateManager` keeper ([`0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)). Receivers unchanged since July 4. All three maturities have been extended.

| Farm | Escrow | Receiver | Maturity | Raw Value |
|------|--------|----------|----------|------:|
| [`0x04d5…3271`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) | **Team Multisig** [`0x8060…400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) | **2026-08-05** (was 07-11) | ~$10.3M |
| [`0x9E5e…1852`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) | EOA [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) | **2026-08-26** (was 08-01) | ~$2.6M |
| [`0x277F…84C1`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) | EOA [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) | **2026-09-23** (was 08-29) | ~$5.1M |

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
The old PYUSD swap farm at [`0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) has been largely withdrawn: PYUSD and USDC balances are now $0. The farm holds only residual Sentora PRIME [`senPYUSDPRIMEv2`](https://etherscan.io/address/0xC21b08C16458202593D4D9B26b9984Ee67b38BbD) worth ~$0.6M. Maturity: **2026-08-05** (rolled forward from 2026-07-11).

A **new PYUSD farm** at [`0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) holds ~14.6M PYUSD ($14.6M raw) and matures 2026-08-05. **TODO: identify this farm's full contract type and whether it pairs PYUSD with Sentora PRIME or holds PYUSD directly.** This is the second-largest position in the portfolio at ~19% of TVL.

**Key Risk Factors:** PYUSD is a Paxos-issued, NYDFS-regulated stablecoin — a high credit standard. The old farm's residual Sentora PRIME wrapper adds a credit-vault layer. The new farm's risk profile depends on its structure (TODO). Both are maturing 2026-08-05, creating a single-day ~$15M PYUSD settlement event that the protocol may roll forward again.

---

#### 4. CapFarm — Cap Protocol stcUSD

**Risk Score: 4.0/5**

**Description:**
`CapFarm` ([`0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694)) holds [`stcUSD`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), the staked yield-bearing version of Cap Protocol's `cUSD` stablecoin. Cap is a 2025-vintage stablecoin issuer whose yield is sourced from delegated operator strategies backed by restaked collateral. ~$4.4M — the primary funded Illiquid-bucket position; a second Illiquid farm (0xd880D7, ~$1.0M) remains unidentified (TODO).

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
`AaveV4Farm` ([`0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657)) supplies into an Aave V4 market for [`USDG`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D) (Global Dollar, a Paxos/Global Dollar Network stablecoin) via an Aave V4 hub/spoke deployment. Maturity: **2026-08-05** (rolled forward from 2026-07-11). ~$2.3M.

**Key Risk Factors:** Aave V4 is a newer codebase than V3; the position also carries USDG issuer/peg risk. Onchain-verifiable lending exposure, moderate risk.

---

#### 6. ERC4626FarmWithMaturity — Steakhouse-curated MetaMorpho

**Risk Score: 2.5/5**

**Description:**
`ERC4626FarmWithMaturity` ([`0x76D2E84009dAE457f8667D823c7c96e9A7c35B78`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78)) deposits into a dedicated Steakhouse-curated MetaMorpho V1.1 USDC vault [`0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9) ("infiniFi USDC"). Maturity: **2026-08-05** (rolled forward). ~$1.1M.

**Key Risk Factors:** Standard MetaMorpho stack risk (Morpho Blue isolated markets + curator allocation) under a reputable curator. Low independent risk; included for completeness.

---

### Aggregate Risk Assessment

**Concentration:** ~64% of TVL is in offchain exposures — Midas-Fasanara mGLOBAL (~41%) and three RWA escrow counterparties (~23%) — far above the protocol's $19.71M liUSD first-loss notional. The single Midas position alone exceeds the buffer. The addition of a large PYUSD onchain position (~19%) diversifies the onchain side but introduces a new single-farm concentration.

**Liquidity:** The Liquid bucket holds ~$0. iUSD-to-USDC is queue-only. All major maturities were rolled forward 3–4 weeks without settlement — the queue-only state appears structural. The protocol has not released USDC to the queue from a maturing position since at least early July.

**Offchain exposure:** Midas-Fasanara (~41%) + three RWAEscrowFarms (~23%) = **~64% of TVL** has material offchain custodial, valuation, or counterparty dependence. Down from ~78% due to the large new onchain PYUSD position.

**Stress sequence to monitor (all dates are extended from prior schedule):**
1. **2026-08-05** — ~$30M cluster: new PYUSD ($14.6M) + RWA escrow ($10.3M, receiver = multisig) + old PYUSD residual ($0.6M) + Aave V4 USDG ($2.3M) + Steakhouse ($1.1M) + unidentified farm ($2.0M). May be rolled forward again.
2. **2026-08-26** — Midas mGLOBAL ($31.0M) + RWA escrow ($2.6M). The single largest event; already rolled forward once from 2026-08-01.
3. **2026-09-23** — RWA escrow ($5.1M). Already extended from 2026-08-29.

**Recommendation:**
Treat current InfiniFi exposure as a credit exposure to **(a) a tokenized Fasanara hedge-fund position (~41%), (b) three undisclosed RWA escrow counterparties (~23%), and (c) a large PYUSD onchain position (~19%)**, with the understanding that no maturities have been settled since at least early July. Yearn operators should assume the queue-only state is structural and settlement at any given maturity date is uncertain. Reassessment should be triggered immediately if any upcoming maturity is rolled forward again, or if any of them settles (providing the first settlement data point since the May–June cluster).

**Data Sources:**
- Onchain: `FarmRegistry.getFarms()`, per-farm `assets()` and `maturity()`, per-escrow `receiver()`, `Accounting.totalAssetsValue()` and `.totalAssetsValueOf(uint256)` (verified 2026-07-29).
- [DefiLlama](https://defillama.com/protocol/infinifi) — TVL cross-check ($60.39M on 2026-07-29).
- [InfiniFi Transparency Dashboard](https://stats.infinifi.xyz/) — cross-checked but not used as the primary source.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| February 4, 2026 | 2.3 | Initial assessment |
| May 18, 2026 | 3.2 | Reassessment — Liquidity 2.0→4.0: iUSD redemption queue-only pending maturity wave |
| July 4, 2026 | 3.4 | Reassessment — offchain concentration up, TVL down |
| July 29, 2026 | 3.5 | Reassessment — all maturities rolled forward without settlement; liquidity 4.0→4.5; tier elevated to ELEVATED RISK |
