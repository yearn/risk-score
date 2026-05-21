# Protocol Risk Assessment: InfiniFi

- **Assessment Date:** May 18, 2026
- **Token:** siUSD (Staked iUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)
- **Final Score: 3.2/5.0**

## Overview + Links

InfiniFi is a stablecoin protocol that allows users to deposit assets (USDC, USDT) to mint iUSD, a stablecoin pegged to the US Dollar. The protocol automatically deploys deposited collateral into a portfolio of farm contracts categorized as **Liquid** (instant withdrawal), **Illiquid** (perpetual but exit-controlled), and **Maturing** (locked until fixed maturity dates). As of this assessment the largest allocations are Midas-tokenized **Fasanara Global** (~37% of TVL), **Cap Protocol stcUSD** (~20%), CoW-swap fixed-maturity baskets into PYUSD and cUSD/stcUSD (~21% combined), Spark sUSDC (~7%), an active RWA escrow (~6%), Steakhouse-curated MetaMorpho (~4%), and Maple HYSL (~3%). See Appendix A for detailed analysis of the largest farm deployments.

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
- **FarmRegistry**: [`0xF5f2718708f471e43968271956CC01aaA8c46119`](https://etherscan.io/address/0xF5f2718708f471e43968271956CC01aaA8c46119) — canonical list of approved farms (4 Liquid, 5 Illiquid, 12 Maturing)
- **YieldSharing (Proxy → V3)**: [`0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b`](https://etherscan.io/address/0x90E91f5bfD9a0a4d925BF30b512add8cD2bbAE3b) — TransparentUpgradeableProxy → YieldSharingV3 (`0x0d5dBF208A9a7540018D204a9A0aD08A091407e5`). Upgraded from V2 since previous assessment.
- **LockingController (liUSD positions)**: [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) — first-loss tranche
- **UnwindingModule**: [`0x7092A43aE5407666C78dBEA657a1891f42b3dFcc`](https://etherscan.io/address/0x7092A43aE5407666C78dBEA657a1891f42b3dFcc) — settles liUSD early exits over time
- **MintController**: [`0x49877d937B9a00d50557bdC3D87287b5c3a4C256`](https://etherscan.io/address/0x49877d937B9a00d50557bdC3D87287b5c3a4C256)
- **RedeemController**: [`0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601`](https://etherscan.io/address/0xCb1747E89a43DEdcF4A2b831a0D94859EFeC7601)
- **MigrationController**: [`0x5F5403656E4Db95aCcF1064A714B1bcE351839F8`](https://etherscan.io/address/0x5F5403656E4Db95aCcF1064A714B1bcE351839F8) — additional ENTRY_POINT and RECEIPT_TOKEN_MINTER
- **MinorRolesManager**: [`0xa08Bf802dCecd3c44E6420a52d5158867366be9b`](https://etherscan.io/address/0xa08Bf802dCecd3c44E6420a52d5158867366be9b) — note: **no longer holds GOVERNOR** (previous assessment was incorrect on this point; it currently has no role membership on Core, see Governance section)
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

- **Team Multisig**: [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) — Gnosis Safe v1.4.1, **4/7 threshold**, 7 EOA signers, nonce 452 (≈ 165 transactions since previous assessment). Signer #1 has been rotated since prior report (`0x7055…E9eE5` → `0x7A82…D421`).
- **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — 604,800s delay (verified)
- **Short Timelock (1 day)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — 86,400s delay (verified)

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
- **TVL**: $82.66M (verified onchain via `Accounting.totalAssetsValue()` and corroborated by [DefiLlama](https://defillama.com/protocol/infinifi) on 2026-05-18). **TVL has contracted ~54% since the previous assessment ($177.69M → $82.66M).**
- **Incidents**: No reported security incidents or exploits found. iUSD oracle still reports 1.0 (no loss-socialization event).
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed via 21 enabled farm contracts grouped into three `AssetType` buckets in `FarmRegistry`: **Liquid** (4 farms — instant withdrawal), **Illiquid** (5 farms — perpetual but slow to unwind), and **Maturing** (12 farms — locked until a fixed maturity date). The current portfolio is concentrated in tokenized RWA (Midas-Fasanara), Cap Protocol stablecoins, and CoW-swap fixed-maturity baskets. **Critical: Several farms involve high-risk strategies — see Appendix A.**
- **Asset Allocation** (verified onchain via `Accounting.totalAssetsValueOf(type)` and per-farm `assets()`, 2026-05-18):

  | Bucket | Value (USD) | Share |
  |--------|------------:|------:|
  | Liquid (USDC instant) | **~$0.7** | **~0%** |
  | Illiquid (perpetual) | $23.26M | 28.1% |
  | Maturing (fixed-term) | $59.40M | 71.9% |
  | **Total** | **$82.66M** | 100% |

  **Critical observation**: The Liquid bucket is currently empty in practice (only dust in `SwapFarmV2`/`RedeemController`). All ~$82.66M of TVL is sitting in Illiquid or Maturing farms. The previous report showed $37.78M in liquid reserves; that buffer has been fully redeployed. **There is currently no instant-redemption capacity for iUSD holders without entering the queue.**

  Top farms by deployed value:

  | Farm | Type | Target | Assets | Share |
  |------|------|--------|-------:|------:|
  | [`MidasFarm`](https://etherscan.io/address/0x7373A7ce3C023C56Cb66747AFbdF827627D31679) | Maturing | mGLOBAL — Midas Fasanara Global ([`0x7433…98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)). Maturity 2026-06-15. | $30.60M | 37.0% |
  | [`CapFarm`](https://etherscan.io/address/0x35F9EbDc02F936e199826778bc06A13272a06B87) | Illiquid | stcUSD — Cap Protocol staked cUSD ([`0x8888…8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) | $16.48M | 19.9% |
  | [`SwapFarmV2WithMaturity`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) | Maturing | CoW-swap USDC ↔ PYUSD / senPYUSDmain. Maturity 2026-05-25. | $9.00M | 10.9% |
  | [`SwapFarmV2WithMaturity`](https://etherscan.io/address/0xe945de0D08E2F39B0740FE2d6e50FE2Bb9751eA4) | Maturing | CoW-swap USDC ↔ cUSD / stcUSD. Maturity 2026-05-19. | $8.29M | 10.0% |
  | [`SparkSUSDCFarm`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | Illiquid | Spark USDC Vault sUSDC ([`0xBC65…45FE`](https://etherscan.io/address/0xBC65ad17c5C0a2A4D159fa5a503f4992c7B545FE)) | $6.06M | 7.3% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | Maturing | RWA escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) → receiver [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) (EOA). Maturity 2026-06-16. **Counterparty TODO.** | $5.08M | 6.1% |
  | [`ERC4626FarmWithMaturity`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78) | Maturing | Steakhouse infiniFi USDC ([`0xBEEF…3aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9)) — dedicated MetaMorpho V1.1 vault | $3.52M | 4.3% |
  | [`MapleFarm`](https://etherscan.io/address/0xF56E946e92FeF6a050F482C560b5f8DcCB8163B3) | Maturing | Maple High Yield Secured Lending Pool USDC1 ([`0xC39a…b8B9`](https://etherscan.io/address/0xC39a5a616F0aD1Ff45077fa2DE3F79ab8EB8B8B9)) | $2.37M | 2.9% |
  | [`AaveV3Farm`](https://etherscan.io/address/0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032) | Illiquid | Aave Horizon RWA market (aHorRwaUSDC) | $0.72M | 0.9% |
  | [`FxSaveFarm`](https://etherscan.io/address/0xc9c06c49Ed83d12BCA88BEd999d4920f049Beabc) | Maturing | f(x) Protocol fxSAVE / fxUSD via CoW | $0.53M | 0.6% |
  | Remaining (dust / matured / inactive) | mixed | sGHO, autoUSD/infinifiUSD AutoFinance pools, RWA escrows at 0, Euler eUSDC-70, USDT Aave market | ~$0.01M | <0.1% |

  Notable concentrations: **Midas-Fasanara ≈ 37%**, **Cap Protocol exposure (CapFarm + cUSD/stcUSD swap) ≈ 30%**, **PYUSD swap basket ≈ 11%**, **Spark + Steakhouse MetaMorpho + Aave Horizon ≈ 12%**, **RWA escrow ≈ 6%**, **Maple ≈ 3%**.

  Compared to the previous report, **explicit Gauntlet Frontier, Reservoir wsrUSD, direct Pendle, direct Ethena, regular Aave aEthUSDC, and Fluid fUSDC farm positions are no longer present** (those farm addresses are either removed or sit at $0). However the Fasanara exposure has not gone away — it has moved into Midas's tokenized `mGLOBAL` wrapper and grown to be the single largest position. The new heavyweights (Cap Protocol stcUSD and the cUSD/stcUSD swap basket) introduce a fresh concentration in a single younger stablecoin issuer.

- **Risk Hierarchy**: Losses are socialized based on a "liability ladder":
  1. liUSD (Locked) holders take the first loss.
  2. siUSD (Staked) holders take the next loss.
  3. iUSD (Stablecoin) holders are the last to be affected.

### Accessibility

- **Enabled Deposit Assets** (verified onchain via `FarmRegistry.getEnabledAssets()`): USDC ([`0xA0b8…eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)) and USDT ([`0x8292…17eD`](https://etherscan.io/address/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD)). The previous report listed USDe and sUSDe as accepted assets; those are no longer enabled on `FarmRegistry`. The protocol's frontend may still accept them via wrapper logic — TODO verify gateway behavior.
- **Minting**: Users deposit USDC/USDT through the Gateway → `MintController` to mint iUSD.
- **Redemption**:

  - **Instant**: Capped by liquidity in the four Liquid farms (`MintController`, `RedeemController`, `SwapFarmV2`, `LiquidationFarm`). **Currently effectively $0** — instant redemptions are paused in practice until allocators rebalance funds back into liquid farms or maturing positions roll off.
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

**Backing check at mint time:** Atomic for the user-facing `MintController` path (collateral must transfer in the same call). The `YieldSharing` and `PLSmoother` mints are not against fresh user collateral but are bounded by realized yield / loss-absorption accounting — they cannot mint unbacked supply. Trust surface: the 4 contracts above must individually be sound; a bug in any of them is a mint-out-of-thin-air path. None are pausable individually except via the system-wide pause held by 8 PAUSE-role holders.

### Collateralization

- **Backing**: iUSD is backed by the assets deployed in the underlying strategies.
- **Verification**: The protocol uses a "Self-Laddering Engine" to match asset duration with liability duration (locked periods).
- **Offchain / High-Risk Exposures** (verified onchain, see Appendix A for detail):
  - **Midas-tokenized Fasanara Global (mGLOBAL)** — single largest position at $30.6M (37%). Midas is a tokenization issuer; the underlying is Fasanara Capital's hedge-fund strategy. Custody and valuation are entirely offchain.
  - **Cap Protocol stcUSD** — $16.5M direct deposit + $8.3M maturing swap basket = ~$24.8M combined (30% of TVL). Cap is a relatively young (2025) stablecoin issuer.
  - **Maple HYSL Pool** — $2.37M of institutional secured lending exposure.
  - **Aave Horizon (aHorRwaUSDC)** — $0.72M in RWA-collateralized lending market.
  - **RWA Escrow Farm** — $5.08M sent to an EOA receiver ([`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926)), value maintained by `RWAEscrowRateManager` ([`0x11F6…4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)). Pure trust-based offchain exposure during the lock period.
- **Token Breakdown** (verified onchain 2026-05-18, all in iUSD-equivalent):

  | Component | Value | Source |
  |-----------|------:|--------|
  | iUSD totalSupply | 82.66M | `iUSD.totalSupply()` |
  | — held by siUSD (Staked) | 45.60M | `iUSD.balanceOf(siUSD)` |
  | — held by LockingController (liUSD active) | 26.87M | `iUSD.balanceOf(LockingController)` |
  | — held by UnwindingModule (liUSD in unwind) | 4.48M | `iUSD.balanceOf(UnwindingModule)` |
  | — held by YieldSharing (dust) | 0.03M | `iUSD.balanceOf(YieldSharing)` |
  | — circulating / in user wallets | ~5.69M | residual |
  | siUSD totalSupply | 42.66M shares | exchange rate 1.069 iUSD/siUSD |
  | LockingController totalBalance (liUSD) | 31.35M | `LockingController.totalBalance()` |

  Compared to previous assessment: siUSD-backed iUSD dropped from 115.07M → 45.60M (-60%), liUSD positions from 43.34M → 31.35M (-28%), free iUSD from 24.86M → ~5.69M (-77%).

### Provability

- **Transparency**: Reserves and allocations are verifiable onchain via `FarmRegistry.getFarms()` and per-farm `assets()`.
- **Reserves**: Onchain DeFi positions (Spark, Aave Horizon, MetaMorpho, Cap, Maple, sGHO, FxSave, AutoFinance) are fully verifiable. Offchain-backed positions (Midas mGLOBAL, RWAEscrow, partially Cap) cannot be independently audited on-chain.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: ~$5.69M circulating outside protocol contracts. Instant-redemption buffer is currently ~$0; **any iUSD holder wanting to exit today must enter the FIFO queue** and wait for maturing positions to roll off or new deposits to come in.
  - **siUSD**: Staked holders can withdraw to iUSD via `siUSD.withdraw()` (ERC4626) but then face the same redemption queue.
  - **liUSD**: Locked positions (1-13 weeks). Early exits route through `UnwindingModule` and incur a slashing penalty.
- **Withdrawal Queues**: With the liquid buffer at $0 the queue is the only path for iUSD-to-USDC. The earliest material relief is **2026-05-19** ($8.29M Cap swap basket maturity), followed by **2026-05-25** (~$9.0M PYUSD swap + Auto Finance positions), and **2026-06-15/16** ($30.6M Midas-Fasanara + $5.08M RWA escrow). In practice the queue can only be cleared as these maturities trigger.

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
    - _Timelock_: Changes to capital allocation parameters (e.g., Farm Registry updates) use the **Short Timelock** (1 day delay).
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
    - _Scope_: Adding a new protocol to the allowlist requires a governance vote and must pass through the **Short Timelock** (1 day delay).
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/7 threshold**, 7 anonymous EOA signers (verified onchain via `getOwners()` and `getThreshold()` on 2026-05-18). Nonce 452. Signer #1 has been rotated since the prior report.

  | # | Signer | Additional Roles (verified onchain) |
  |---|--------|------------------|
  | 1 | [`0x7A823623B18335A9c1284AC45315fe89972FD421`](https://etherscan.io/address/0x7A823623B18335A9c1284AC45315fe89972FD421) | — (new since prior report; replaced `0x7055E782B94b15BB6142aaFB326a9CeC36399eE5`) |
  | 2 | [`0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD`](https://etherscan.io/address/0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD) | EXECUTOR_ROLE |
  | 3 | [`0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61`](https://etherscan.io/address/0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61) | — |
  | 4 | [`0x6DFa1A32604088EB969242AafFb92420F78373f6`](https://etherscan.io/address/0x6DFa1A32604088EB969242AafFb92420F78373f6) | EXECUTOR_ROLE |
  | 5 | [`0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685`](https://etherscan.io/address/0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685) | PAUSE |
  | 6 | [`0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa`](https://etherscan.io/address/0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa) | EXECUTOR_ROLE |
  | 7 | [`0x383965940c950008a4B67BfaA477Fdf6AC91a7F7`](https://etherscan.io/address/0x383965940c950008a4B67BfaA477Fdf6AC91a7F7) | EXECUTOR_ROLE, PAUSE |

- **Timelocks**: Both are custom `Timelock.sol` extending OZ TimelockController. They override `hasRole()` to delegate role checks to the central `InfiniFiCore` contract. Both have DEFAULT_ADMIN_ROLE renounced (immutable role configuration).

  - **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — `getMinDelay()` returns 604,800s (verified 2026-05-18).
  - **Short Timelock (1 day)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — `getMinDelay()` returns 86,400s (verified 2026-05-18).

  **Timelock-controlling roles on InfiniFiCore** (verified by enumerating `getRoleMember()`):

  | Role | Holders |
  |------|---------|
  | PROPOSER_ROLE | 1: multisig (4/7 required to schedule) |
  | CANCELLER_ROLE | 1: multisig (4/7 required to cancel) |
  | EXECUTOR_ROLE | **6**: signers #2/4/6/7 + deployer EOA (`0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22`) **+ the multisig itself** (new since prior report — multisig can now execute its own scheduled proposals) |

  Governance flow: **Multisig proposes (4/7) → Timelock delay → Any 1 of 5 executor EOAs or the multisig itself triggers execution.**

- **GOVERNOR role holders** (verified via `getRoleMemberCount(keccak256("GOVERNOR"))` = 2):
  - Long Timelock ([`0x3D18…48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9)) — full GOVERNOR scope behind 7-day delay
  - FluidRewardsClaimer ([`0xD0ec…241E`](https://etherscan.io/address/0xD0ec80032C0da717BD78B9569321D9069365241E)) — narrowly scoped to claiming Fluid rewards
  - Deployer EOA has renounced GOVERNOR. **DEFAULT_ADMIN_ROLE has 0 holders** on Core (verified).
  - Note: prior report listed MinorRolesManager as a third GOVERNOR holder. That is no longer the case — MinorRolesManager currently holds no roles on Core, and minor-role grants now go through the multisig (which holds MINOR_ROLES_MANAGER) or the Long Timelock.

- **Actions by timelock tier**:

    **Long Timelock (7 days) — GOVERNOR role (and PROTOCOL_PARAMETERS, PAUSE, MINOR_ROLES_MANAGER it also now holds):**
    enableBucket, setMaxLossPercentage, setAddress (gateway), setAfterMintHook, setBeforeRedeemHook, setYieldSharing, enableAsset, disableAsset, setLendingPool, setSafeAddress, emergencyAction, proxy upgrades (owns ProxyAdmin), all role grants/revokes.

    **Short Timelock (1 day) — PROTOCOL_PARAMETERS role:**
    setBucketMultiplier, setMinAssetAmount, setSafetyBufferSize, setPerformanceFeeAndRecipient, setLiquidReturnMultiplier, setTargetIlliquidRatio, setCap, setMaxSlippage, addFarms, removeFarms, setEnabledRouter, setPendleRouter, setCooldown, setAssetRebalanceThreshold.

    **Short Timelock (1 day) — ORACLE_MANAGER role:**
    setOracle, setPrice.
    Verified onchain: ORACLE_MANAGER has 4 holders — Short Timelock, Accounting (`0x7A5C…42B3`), YieldSharing proxy (`0x90E9…AE3b`), and OracleFactory (`0xA2b3…Ed91`).

    **Multisig WITHOUT timelock** (the multisig directly holds these roles on InfiniFiCore):
    | Role | Capability |
    |------|-----------|
    | UNPAUSE (2 holders: multisig + EmergencyWithdrawal) | Unpause any paused contract |
    | EMERGENCY_WITHDRAWAL (1 holder: multisig) | Move funds from farms to predefined safe address, deprecate farms |
    | MANUAL_REBALANCER (3 holders: multisig + Short Timelock + LiquidationFarm) | Rebalance funds between whitelisted farms |
    | FARM_SWAP_CALLER (3 holders: multisig + EOA `0x7345…2cbB` + Short Timelock) | Trigger swap operations in farms |
    | MINOR_ROLES_MANAGER (2 holders: multisig + Long Timelock) | Grant/revoke PAUSE, PERIODIC_REBALANCER, FARM_SWAP_CALLER |
    | CANCELLER_ROLE / PROPOSER_ROLE | Cancel/propose timelock actions |
    | PAUSE (multisig holds it directly) | Emergency pause |

- **PAUSE role holders** (verified via `getRoleMemberCount(keccak256("PAUSE"))` = **8**, up from 4 in prior report):
  - [`0x383965940c950008a4B67BfaA477Fdf6AC91a7F7`](https://etherscan.io/address/0x383965940c950008a4B67BfaA477Fdf6AC91a7F7) (multisig signer #7)
  - [`0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685`](https://etherscan.io/address/0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685) (multisig signer #5)
  - [`0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148`](https://etherscan.io/address/0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148) (EOA — replaces prior `0x6ef71cA9cD708883E129559F5edBFb9d9D5C1d8A` listed in the previous report)
  - [`0x0652412777f0c1F46b1164d5cdF3295Bdf43F2f2`](https://etherscan.io/address/0x0652412777f0c1F46b1164d5cdF3295Bdf43F2f2) (EOA)
  - [`0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9`](https://etherscan.io/address/0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9) (EmergencyWithdrawal contract)
  - [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) (Long Timelock)
  - [`0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56`](https://etherscan.io/address/0x607b5aB25b2ed5575D296a1caFc3A17161D4fa56) (MaturedFarmCleaner contract)
  - [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) (Multisig)

- **Other onchain role membership** (verified 2026-05-18 by enumerating `keccak256` of each role name in `CoreRoles`):

  | Role | Count | Notable holders |
  |------|------:|-----------------|
  | ENTRY_POINT | 2 | Gateway proxy, MigrationController |
  | RECEIPT_TOKEN_MINTER | 4 | YieldSharing, MintController, PLSmoother, MigrationController |
  | RECEIPT_TOKEN_BURNER | 7 | siUSD, UnwindingModule, LockingController, YieldSharing, RedeemController, PLSmootherHelper, PLSmoother |
  | LOCKED_TOKEN_MANAGER | 1 | LockingController |
  | TRANSFER_RESTRICTOR | 1 | AllocationVoting |
  | FARM_MANAGER | 4 | ManualRebalancer, AfterMintHook, BeforeRedeemHook, EmergencyWithdrawal |
  | FINANCE_MANAGER | 3 | YieldSharing, LiquidationFarm, PLSmootherHelper |
  | PERIODIC_REBALANCER | 1 | EOA `0x2Cba…aB1a` (keeper bot) |
  | PROTOCOL_PARAMETERS | 3 | Short Timelock, Long Timelock, MaturedFarmCleaner |
  | DEFAULT_ADMIN_ROLE | **0** | — (renounced) |

- **emergencyAction bypass analysis**: The `Timelock.sol` contract **overrides emergencyAction to a no-op**, preventing any GOVERNOR holder from using it to bypass timelock delays. This is a deliberate safety mechanism confirmed in source code (unchanged since prior assessment).

### Programmability

- **Hybrid Model**: The "Self-Laddering Engine" algorithmically matches asset duration with liability duration. "Allocators" actively manage the amount of capital deployed to specific allowlisted strategies.
- **Oracle**: Protocol uses Chainlink price feeds for asset pricing to maintain the 1:1 mint ratio and calculate collateral value.
- **Oracle Updates**: Oracles are upgradeable via governance (**Short Timelock**, 1-day delay). The iUSD price oracle (`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`) is a FixedPriceOracle — price changes only during loss socialization events (de-peg).

### External Dependencies

- **Top dependencies (by deployed value)**: **Midas** (mGLOBAL tokenization layer over Fasanara Capital) ~37%, **Cap Protocol** (cUSD/stcUSD as direct deposit and swap target) ~30%, **PYUSD / Paxos** ~11%, **Spark / MakerDAO** ~7%, **Unidentified RWA escrow counterparty** (TODO) ~6%, **Steakhouse-curated Morpho MetaMorpho** ~4%, **Maple Finance** ~3%, **Aave Horizon RWA** ~1%, **f(x) Protocol** ~1%. Smaller exposures to Auto Finance (formerly Tokemak) and Aave sGHO via dust positions.
- **Stablecoin dependencies**: USDC and USDT enabled as deposit assets (verified onchain). The protocol also takes indirect exposure to PYUSD (via maturing swap basket), cUSD/stcUSD (Cap), USDS (via Spark), and indirectly to T-Bill-backed RWAs (via Midas mGLOBAL and unidentified RWA escrow counterparty). USDe and sUSDe are no longer enabled deposit assets on FarmRegistry.

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
| **Long/Short Timelock** | `CallScheduled(bytes32 id, uint256 index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)` | New governance action proposed — decode `data` to understand what will change. Early warning window (7d or 1d). |
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
- Robust governance: 4/7 multisig + dual timelock (7d/1d) + separation of powers. DEFAULT_ADMIN renounced. emergencyAction bypass prevented via no-op override in Timelock.
- All contracts verified onchain, all farms properly target expected DeFi protocols
- Backed by reputable investors (Electric Capital, Sam Kazemian)

### Key Risks

- **Liquid reserves fully depleted**: Onchain `Accounting.totalAssetsValueOf(Liquid)` returns <$1; all four Liquid-type farms (MintController, RedeemController, SwapFarmV2, LiquidationFarm) currently hold dust. iUSD instant redemption is effectively disabled — every redeemer must enter the FIFO queue.
- **Heavy concentration in tokenized RWA**: Midas-Fasanara mGLOBAL is ~37% of TVL ($30.6M) and matures 2026-06-15. This is the single largest position and a pure offchain counterparty.
- **Heavy concentration in Cap Protocol**: Direct stcUSD + the cUSD/stcUSD swap basket combine to ~30% of TVL. Cap is a 2025-vintage stablecoin issuer with limited track record.
- **Concentrated maturity wall**: Roughly $26M of maturities cluster between 2026-05-19 and 2026-05-25 — protocol relies on these rolling off (or being rolled forward) to restore any liquidity.
- **TVL down 54%** since prior assessment ($177.69M → $82.66M) — directionally consistent with the loss of liquid buffer and may reflect ongoing redemption pressure.
- **Offchain/RWA exposure**: Contrary to initial marketing as "100% onchain DeFi", at least 43% of TVL (Midas-Fasanara + unidentified RWA escrow + Aave Horizon RWA + Maple) sits in offchain or RWA-backed strategies whose valuations cannot be verified onchain.
- **Multisig powers expanded since prior assessment**: multisig now directly holds EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, UNPAUSE, MINOR_ROLES_MANAGER, PAUSE, **and EXECUTOR_ROLE** on InfiniFiCore — meaning it can both propose and execute its own timelock actions. This concentrates effective control to a 4/7 anonymous signer set.
- **Short operational history** (<1 year in production since June 2025).
- **Compounded smart contract risk** from layered protocols (Cap stcUSD, Spark, Maple, Morpho/MetaMorpho, Auto Finance, f(x) Protocol, Midas vault flow).
- **Pseudonymous team** with notable history concerns: key contributor (RobAnon) authored Revest Finance contracts exploited for $2M; lead dev's prior projects (Fei, ECG) have wound down.
- **No disclosed legal entity or incident response plan**.
- **Certora formal verification** report published but finding severity breakdown not available on the landing page (full PDF required for detailed review).

### Critical Risks

- **Effective queue-only redemption today**. Liquid reserves are essentially $0. Combined with the 54% TVL contraction since the prior report, this looks like an active redemption stress event being managed by waiting for maturities to roll off rather than honoring instant withdrawals. Operators of any vault that requires reliable USDC exit should treat InfiniFi as queue-mode until the Liquid bucket is rebuilt.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. Multiple audits by reputable firms (Spearbit, Certora, Cantina).
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable onchain.
- [x] **Total centralization** — PASSED. 4/7 multisig with dual timelocks, DEFAULT_ADMIN renounced.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Strong coverage — Spearbit/Cantina Code main review (8H/6M/25L), Certora formal verification ([report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report)), Cantina public competition, multiple upgrade reviews (YieldSharing V2 → V3 upgrade reviewed).
- **History**: ~11 months in production (mainnet launch June 2025; this reassessment May 2026). TVL ~$83M (down ~54% from previous report's $179M peak figure).
- **Bounty**: [Active on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591).
- **Incidents**: No known exploits or loss events since launch. One multisig signer rotation handled cleanly.

**Score: 2.5/5** — Extensive audit coverage including formal verification and ongoing upgrade reviews; ~11 months production with no losses. Held at 2.5 (rather than improving toward 2.0) because TVL has materially contracted and the protocol has not yet weathered a stress event.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.0**
- 4/7 multisig (Gnosis Safe v1.4.1) with dual timelocks (7d Long for GOVERNOR-scope, 1d Short for parameters) remains in place.
- DEFAULT_ADMIN_ROLE renounced on Core and both timelocks; `Timelock.emergencyAction` is a no-op override.
- All 7 multisig signers remain anonymous EOAs. Signer #1 has been rotated since the prior assessment — process worked but the signer set is opaque.
- **New finding**: the multisig now holds EXECUTOR_ROLE on the Long Timelock alongside the deployer EOA and 4 individual signer EOAs. The multisig can therefore both schedule and execute its own proposals; the timelock delay still applies but the execution gate is no longer held by a distinct party.
- Multisig retains significant non-timelocked direct powers: UNPAUSE, EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, FARM_SWAP_CALLER, MINOR_ROLES_MANAGER, PAUSE.

**Subcategory B: Programmability — 3.0**
- Hybrid model: algorithmic Self-Laddering Engine + active Allocator management. Asset/liability matching is the design intent but in practice the allocator decisions have produced a portfolio with effectively zero liquid buffer.
- Oracle-dependent for pricing (Chainlink + protocol-specific oracles for stcUSD, mGLOBAL); ORACLE_MANAGER role is under Short Timelock (1d).
- emergencyAction safely disabled on timelocks (unchanged).

**Subcategory C: Dependencies — 3.5**
- Direct exposure to 8+ external protocols and issuers: Midas (mGLOBAL wrapping Fasanara), Cap Protocol (cUSD/stcUSD), Spark (sUSDC), Aave (Horizon RWA market), Steakhouse MetaMorpho V1.1, Maple Finance (HYSL), f(x) Protocol, AutoFinance.
- Pegs depended on: USDC, USDT, cUSD, mGLOBAL NAV, PYUSD, GHO.
- The CoW-swap maturing baskets create a settlement dependency on CoW Protocol's solvers in addition to the underlying asset issuers.

**Score: 3.2/5** — (3.0 + 3.0 + 3.5) / 3 ≈ 3.17, rounded to 3.2. Slight increase from 3.0 in the prior assessment driven by the EXECUTOR_ROLE consolidation onto the multisig and a wider, more concentrated dependency set.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.0**
- Reserves are 100% accounted for onchain via `FarmRegistry` and per-farm `assets()` — total matches `Accounting.totalAssetsValue()` of ~$82.66M against an iUSD supply of 82.66M (parity within rounding).
- However ~43% of TVL is in positions whose backing cannot be independently audited onchain:
  - **Midas mGLOBAL** (37%, $30.6M) wraps Fasanara Capital's hedge-fund strategy — TradFi custody and NAV.
  - **RWAEscrowFarm** (6%, $5.08M) sends funds to an EOA receiver, with value attested by an onchain rate manager. Pure trust-based offchain exposure during the maturity period.
- Another ~30% sits in Cap Protocol's stcUSD/cUSD — a young (2025) stablecoin issuer with limited history.
- Maple HYSL ($2.4M) and Aave Horizon ($0.7M) add further RWA-collateralized lending exposure.
- Liability ladder (liUSD → siUSD → iUSD) is intact and the first-loss buffer ($31.35M of liUSD) is meaningful, but its protective ratio has weakened: liUSD = 38% of supply versus higher prior assessment levels, and the absolute size of higher-risk positions (Midas + RWAEscrow + Cap) exceeds the liUSD buffer.

**Subcategory B: Provability — 3.0**
- Allocations and book values are fully transparent onchain.
- True underlying value of mGLOBAL, RWAEscrow, and (in part) Cap Protocol relies on offchain attestations — Yearn would have to trust Midas, the RWA escrow rate manager, and Cap's reserve attestations.
- siUSD exchange rate is ERC4626-standard and verifiable.

**Score: 3.5/5** — (4.0 + 3.0) / 2 = 3.5, up from 3.3. The shift is driven by (a) heavier concentration in a single tokenized hedge-fund position and a single young stablecoin issuer, and (b) reduced provability of the largest holdings.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: Onchain `Accounting.totalAssetsValueOf(Liquid)` returns <$1; the four Liquid farms (`MintController`, `RedeemController`, `SwapFarmV2`, `LiquidationFarm`) collectively hold dust. There is **no instant-redemption capacity for iUSD today**.
- **Queue**: With the liquid buffer depleted, redemptions must enter the FIFO queue and wait for maturing positions to roll off. Material reliefs are 2026-05-19 ($8.29M Cap swap), 2026-05-25 (~$9M PYUSD swap), 2026-06-15/16 ($30.6M Midas + $5.08M RWA escrow).
- **Depth (secondary)**: iUSD/siUSD DEX depth is thin relative to supply; secondary-market exit at par cannot be assumed under stress.
- **Free supply**: Only ~$5.69M of iUSD sits in user wallets outside protocol contracts — a small absolute exposure if redemptions stayed limited to free supply, but the same is not true if siUSD/liUSD holders attempted to exit en masse.

**Score: 4.0/5** — Sharp increase from 2.0. The previously cited buffer ($37.78M) is gone; the protocol is now structurally queue-only for iUSD-to-USDC. The design contemplates this state, but the practical risk to a holder needing same-day liquidity is materially higher than at the prior assessment.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Semi-pseudonymous; ex-Fei/Revest/ECG contributors. Known prior incident (Revest $2M hack) remains in the team's history.
- **Funding**: $3M Pre-Seed from reputable VCs.
- **Docs**: Above-average technical documentation; transparency dashboard ([stats.infinifi.xyz](https://stats.infinifi.xyz/)) shows live allocation data.
- **Legal**: No disclosed legal entity or jurisdiction.
- **Incident response**: No publicly documented plan. Emergency capabilities exist onchain (pause + emergency withdrawal). The multisig signer rotation since the last assessment shows the operational machinery functions.

**Score: 2.5/5** — Unchanged.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.2 | 30% | 0.96 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.235** |

**Final Score: 3.2**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK (high end of band)**

The composite score is up from 2.8 → 3.2, driven primarily by the disappearance of the liquid redemption buffer and increased concentration in tokenized-RWA / younger-issuer positions. The key risks at this reassessment are:
- **No liquid redemption buffer**: ~$0 in Liquid farms versus $37.78M at the prior assessment. iUSD-to-USDC is effectively queue-only until maturities settle starting 2026-05-19.
- **Concentration in Midas-Fasanara mGLOBAL** (37% of TVL): single largest position, tokenized hedge-fund exposure, offchain custody and valuation.
- **Concentration in Cap Protocol** (~30% combined between CapFarm and the cUSD/stcUSD swap basket): a young 2025-vintage stablecoin issuer.
- **RWAEscrowFarm** (6%): funds escrowed to an EOA receiver, value attested by an onchain rate manager — pure trust-based offchain exposure during the lock.
- **Multisig retains broad non-timelocked powers** and now also holds EXECUTOR_ROLE on the Long Timelock; signers are still anonymous EOAs.
- **Short operational history** (~11 months) — not yet stress-tested.

---

## Reassessment Triggers

- **Time-based**: Reassess in 60 days (target 2026-07-17), or immediately after the 2026-06-15/16 Midas-mGLOBAL and RWAEscrow maturities settle.
- **Liquidity-based**: Reassess immediately if (a) the FIFO redemption queue forms a backlog that does not clear at the next scheduled maturity, or (b) `Accounting.totalAssetsValueOf(Liquid)` remains <1% of total supply for more than 30 days after the May/June maturity wave.
- **TVL-based**: Reassess if TVL moves by more than 30% in either direction from the current ~$82.66M.
- **Concentration-based**: Reassess if any single farm exceeds 40% of TVL, or if combined Cap Protocol exposure (CapFarm + cUSD/stcUSD swap baskets) exceeds 35% of TVL.
- **Issuer-based**: Reassess on any material event at Midas, Fasanara Capital, Cap Protocol, or Maple Finance (depeg, custodian change, restructure, regulatory action).
- **Governance-based**: Reassess after any signer change on the multisig, any new EXECUTOR_ROLE / PROPOSER_ROLE / CANCELLER_ROLE grant, any change to the `Timelock.emergencyAction` no-op override, or any role grant on `InfiniFiCore` outside the Long Timelock.
- **Incident-based**: Reassess after any exploit, oracle failure, or material loss event at the protocol or in any farm with >$2M of InfiniFi exposure.
- **Architecture-based**: Reassess on any new farm category (new `AssetType` bucket), new asset enablement on `FarmRegistry`, or any change to YieldSharing/Accounting beyond the V2→V3 line.

---

## Appendix A: Top Farm Exposure Analysis

Onchain inspection of `FarmRegistry.getFarms()` and per-farm `assets()` on 2026-05-18 shows the portfolio is concentrated in a small number of large positions, most of which are "Maturing" (locked until a fixed date) or "Illiquid" (perpetual but exit-controlled). The Liquid bucket is currently empty in practice. The farms below cover ~98% of TVL.

Per the previous assessment's appendix, the Gauntlet Frontier (gtUSDa), Reservoir wsrUSD, direct Fasanara Genesis Fund deposit, and Tokemak autoUSD positions are **no longer present** at material weight — those farm addresses are removed from `FarmRegistry` or hold $0 / dust. The Fasanara strategy is, however, still indirectly held via Midas-tokenized `mGLOBAL` (see entry 1).

### Summary Table: Top Farms by Deployed Value

| Farm | Type | Underlying | Assets (USD) | Share | Individual Risk |
|------|------|------------|-------------:|------:|----------------:|
| **MidasFarm (mGLOBAL)** | Maturing (2026-06-15) | Midas-tokenized Fasanara Global hedge-fund strategy | $30.60M | 37.0% | **4.5/5** |
| **CapFarm (stcUSD)** | Illiquid | Cap Protocol staked cUSD | $16.48M | 19.9% | **4.0/5** |
| **SwapFarmV2WithMaturity (PYUSD)** | Maturing (2026-05-25) | CoW-swap basket USDC ↔ PYUSD / senPYUSDmain | $9.00M | 10.9% | **3.0/5** |
| **SwapFarmV2WithMaturity (cUSD/stcUSD)** | Maturing (2026-05-19) | CoW-swap basket USDC ↔ cUSD / stcUSD | $8.29M | 10.0% | **4.0/5** |
| **SparkSUSDCFarm** | Illiquid | Spark USDC Vault (sUSDC) | $6.06M | 7.3% | **2.5/5** |
| **RWAEscrowFarm** | Maturing (2026-06-16) | Funds sent to offchain receiver EOA; rate-managed onchain | $5.08M | 6.1% | **4.5/5** |
| **ERC4626FarmWithMaturity (Steakhouse)** | Maturing | Steakhouse-curated MetaMorpho V1.1 USDC vault | $3.52M | 4.3% | **2.5/5** |
| **MapleFarm** | Maturing | Maple Finance High Yield Secured Lending USDC1 | $2.37M | 2.9% | **3.5/5** |
| **AaveV3Farm (Horizon)** | Illiquid | Aave Horizon RWA market (aHorRwaUSDC) | $0.72M | 0.9% | **3.5/5** |

### Detailed Farm Risk Assessments

---

#### 1. MidasFarm — Midas-tokenized Fasanara Global (mGLOBAL)

**Risk Score: 4.5/5**

**Description:**
`MidasFarm` ([`0x7373A7ce3C023C56Cb66747AFbdF827627D31679`](https://etherscan.io/address/0x7373A7ce3C023C56Cb66747AFbdF827627D31679)) holds [`mGLOBAL`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8), an ERC-20 token issued by Midas (a tokenization-as-a-service issuer) that represents a claim on the Fasanara Capital "Global" strategy. The underlying is the same Fasanara hedge-fund family flagged in the prior report — but now wrapped in Midas's permissioned-issuance + offchain-NAV-attestation architecture rather than held directly. Maturity in this farm: **2026-06-15**.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Concentration** | **Very High** | 37% of total InfiniFi TVL in a single position |
| **Off-Chain Custody** | **Very High** | Underlying hedge-fund strategy assets held by traditional custodians at Fasanara |
| **NAV / Valuation** | **High** | mGLOBAL price reflects an off-chain NAV attestation from Midas / Fasanara |
| **Issuer Risk** | High | Two stacked issuers (Midas + Fasanara) plus their respective custodians |
| **Regulatory Risk** | High | Tokenized fund products are subject to securities regulation in EU/UK/US |
| **Liquidity Risk** | High | InfiniFi position is locked until the 2026-06-15 maturity; secondary mGLOBAL liquidity is thin |

**Why This Matters:**
- Single largest exposure: a loss event large enough to impair mGLOBAL value would consume the liUSD first-loss buffer before iUSD holders are protected.
- The strategy is the same one (Fasanara) the prior report flagged at 4.5/5; the wrapping change reduces direct counterparty surface but adds a second issuer (Midas) on top.
- The 2026-06-15 maturity is the single most important upcoming event for InfiniFi liquidity.

**References:**
- [mGLOBAL token on Etherscan](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)
- [Midas Capital](https://midas.app/)
- [Fasanara Capital](https://www.fasanara.com/)

---

#### 2. CapFarm — Cap Protocol stcUSD

**Risk Score: 4.0/5**

**Description:**
`CapFarm` ([`0x35F9EbDc02F936e199826778bc06A13272a06B87`](https://etherscan.io/address/0x35F9EbDc02F936e199826778bc06A13272a06B87)) holds [`stcUSD`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), the staked yield-bearing version of Cap Protocol's `cUSD` stablecoin. Cap is a 2025-vintage stablecoin issuer whose yield is sourced from delegated operator strategies backed by restaked collateral. Note: a second InfiniFi farm — `SwapFarmV2WithMaturity` for the cUSD/stcUSD basket — adds another $8.29M of Cap exposure, bringing the combined Cap concentration to ~30% of TVL.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Issuer Maturity** | **High** | Cap is <1 year old, limited stress-test history |
| **Concentration (combined)** | **Very High** | CapFarm + cUSD/stcUSD swap basket ≈ 30% of TVL — exceeds the liUSD first-loss buffer's notional |
| **Peg Risk** | High | cUSD peg integrity relies on Cap's reserve attestations and operator soundness |
| **Smart Contract** | Medium | Cap's contracts have been audited but are young in production |
| **Liquidity (secondary)** | Medium | stcUSD secondary liquidity is thin |

**Why This Matters:**
- A Cap depeg or operator insolvency event would hit InfiniFi twice: directly via CapFarm and indirectly via the maturing cUSD/stcUSD swap basket.
- Combined Cap notional exceeds the protocol's available first-loss buffer.

**References:**
- [stcUSD on Etherscan](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- [Cap Protocol](https://cap.app/)

---

#### 3. SwapFarmV2WithMaturity (cUSD/stcUSD basket)

**Risk Score: 4.0/5**

**Description:**
Maturing CoW-swap farm at [`0xe945de0D08E2F39B0740FE2d6e50FE2Bb9751eA4`](https://etherscan.io/address/0xe945de0D08E2F39B0740FE2d6e50FE2Bb9751eA4) used to route USDC into a cUSD/stcUSD basket. Maturity: **2026-05-19** (imminent). $8.29M deployed.

**Key Risk Factors:** Same Cap Protocol issuer risk as entry #2; plus a CoW-Protocol solver dependency for settlement around the maturity window.

**Why This Matters:**
- 2026-05-19 maturity is the first material redemption-queue relief, but it is fully Cap-Protocol-denominated — so depeg or settlement issues at that exact window are the highest-impact short-term risk.

---

#### 4. SwapFarmV2WithMaturity (PYUSD basket)

**Risk Score: 3.0/5**

**Description:**
Maturing CoW-swap farm at [`0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE), denominated in PYUSD / senPYUSDmain. Maturity: **2026-05-25**. $9.00M deployed.

**Key Risk Factors:** PYUSD is a Paxos-issued, NYDFS-regulated stablecoin — the credit standard is materially higher than for cUSD. Primary risks are CoW solver dependency at maturity and the senPYUSDmain wrapper's redemption mechanics.

---

#### 5. SparkSUSDCFarm — Spark USDC Vault

**Risk Score: 2.5/5**

**Description:**
`SparkSUSDCFarm` ([`0xd880D7C5CaFdbE2AEc281250995abF612235e563`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563)) holds [`sUSDC`](https://etherscan.io/address/0xBC65ad17c5C0a2A4D159fa5a503f4992c7B545FE), the Spark Protocol USDC vault. $6.06M.

**Key Risk Factors:** Spark/MakerDAO ecosystem dependency; sUSDC is a known well-audited integration. Low independent risk; included for completeness.

---

#### 6. RWAEscrowFarm — Offchain Counterparty

**Risk Score: 4.5/5**

**Description:**
`RWAEscrowFarm` ([`0x9E5efC5F387D8661C1AFB2469B7EeF6972451852`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852)) sends underlying USDC to escrow address [`0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A), with funds onward-routed to receiver EOA [`0x4831C121879d3DE0E2B181d9d55E9B0724f5D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926). Position value during the lock is set by `RWAEscrowRateManager` ([`0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)). Maturity: **2026-06-16**. $5.08M.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Counterparty Risk** | **Very High** | Funds custodied by an EOA receiver during the lock — pure offchain trust |
| **Identity (TODO)** | Unknown | Counterparty identity behind `0x4831…D926` is not disclosed in public docs |
| **Valuation** | High | Position value during lock is driven by a rate-manager contract whose inputs come offchain |
| **Audit trail** | Low | Onchain only sees the escrow + rate; offchain operation is not verifiable |
| **Recovery** | Low | If the receiver EOA does not return funds at maturity, recovery is a legal matter, not a smart-contract one |

**Why This Matters:**
- The most opaque exposure in the portfolio. Even Midas mGLOBAL has a tokenization issuer with public attestations; this farm relies on a private bilateral arrangement.
- 2026-06-16 maturity coincides almost exactly with the Midas-mGLOBAL roll-off, so a delay or default at either would compound queue pressure.

---

#### 7. ERC4626FarmWithMaturity — Steakhouse-curated MetaMorpho

**Risk Score: 2.5/5**

**Description:**
`ERC4626FarmWithMaturity` ([`0x76D2E84009dAE457f8667D823c7c96e9A7c35B78`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78)) deposits into a dedicated Steakhouse-curated MetaMorpho V1.1 USDC vault [`0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9) ("infiniFi USDC"). $3.52M.

**Key Risk Factors:** Standard MetaMorpho stack risk (Morpho Blue isolated markets + curator allocation) under a reputable curator. Low independent risk; included for completeness.

---

#### 8. MapleFarm — Maple Finance HYSL

**Risk Score: 3.5/5**

**Description:**
`MapleFarm` ([`0xF56E946e92FeF6a050F482C560b5f8DcCB8163B3`](https://etherscan.io/address/0xF56E946e92FeF6a050F482C560b5f8DcCB8163B3)) deposits into Maple's High Yield Secured Lending Pool USDC1 ([`0xC39a5a616F0aD1Ff45077fa2DE3F79ab8EB8B8B9`](https://etherscan.io/address/0xC39a5a616F0aD1Ff45077fa2DE3F79ab8EB8B8B9)). $2.37M.

**Key Risk Factors:** Institutional secured-lending credit exposure with offchain borrower workflows and pool-level default history (Maple has had pool defaults in prior cycles, though the current HYSL design uses overcollateralization and waterfall protections).

---

#### 9. AaveV3Farm — Aave Horizon RWA market

**Risk Score: 3.5/5**

**Description:**
`AaveV3Farm` ([`0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032`](https://etherscan.io/address/0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032)) supplies USDC into Aave's Horizon RWA market (`aHorRwaUSDC` receipt token). $0.72M.

**Key Risk Factors:** Borrower side is collateralized by tokenized RWA collateral types; depends on RWA-specific liquidation paths Aave Horizon has not yet had to exercise at scale.

---

### Aggregate Risk Assessment

**Concentration:** ~67% of TVL is in three issuers/strategies — Midas-Fasanara (37%), Cap Protocol (combined 30%) — well above the protocol's $31.35M liUSD first-loss notional. Either issuer suffering a material adverse event would test, and could exhaust, the liability ladder before iUSD holders are protected.

**Liquidity:** The Liquid bucket holding zero is itself a material change versus the prior assessment. iUSD-to-USDC is queue-only until the maturity sequence (2026-05-19 → 2026-05-25 → 2026-06-15 → 2026-06-16) begins to settle.

**Offchain exposure:** Midas-Fasanara (37%) + RWAEscrowFarm (6%) + Maple HYSL (3%) + Aave Horizon RWA (1%) = **~47% of TVL** has material offchain custodial, valuation, or counterparty dependence.

**Stress sequence to monitor:**
1. **2026-05-19** — Cap cUSD/stcUSD swap basket maturity (~$8.29M). First test of CoW-swap solver maturity routing under load.
2. **2026-05-25** — PYUSD swap basket maturity (~$9.00M).
3. **2026-06-15** — Midas mGLOBAL maturity (~$30.60M). The single largest scheduled event for the protocol.
4. **2026-06-16** — RWA escrow maturity (~$5.08M). Counterparty identity unverified — most binary outcome of the wave.

**Recommendation:**
Treat current InfiniFi exposure as primarily a credit exposure to **(a) a tokenized Fasanara hedge-fund position, (b) Cap Protocol's young stablecoin issuance, and (c) one undisclosed RWA escrow counterparty**, rather than as a diversified DeFi yield strategy. Reassessment should be triggered immediately if any of the four upcoming maturities fail to settle on schedule.

**Data Sources:**
- Onchain: `FarmRegistry.getFarms()`, per-farm `assets()`, `Accounting.totalAssetsValue()` and `.totalAssetsValueOf(AssetType)` (verified 2026-05-18).
- [InfiniFi Transparency Dashboard](https://stats.infinifi.xyz/) — cross-checked but not used as the primary source.
