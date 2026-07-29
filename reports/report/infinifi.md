# Protocol Risk Assessment: InfiniFi

- **Assessment Date:** February 4, 2026 (Updated: July 4, 2026; July 29, 2026)
- **Token:** siUSD (Staked iUSD)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB)
- **Final Score: 3.3/5.0**

## Overview + Links

InfiniFi is a stablecoin protocol that allows users to deposit assets (USDC, USDT) to mint iUSD, a stablecoin pegged to the US Dollar. The protocol deploys collateral through farm contracts categorized as **Liquid** (instant withdrawal), **Illiquid** (perpetual but exit-controlled), and **Maturing** (subject to a configured rolling withdrawal horizon). As of this assessment the largest allocations are Midas-tokenized **Fasanara Global** (51.4% of TVL), four **offchain RWA escrow** positions (33.1% combined), **Cap Protocol stcUSD** (7.3%), an **Aave V4 USDG** market (3.7%), Steakhouse MetaMorpho (1.9%), and Spark sUSDC (1.7%). Roughly **84.4% of TVL is offchain-custodied or NAV-attested** through Midas mGLOBAL and the four RWA escrows. The reported `maturity()` timestamps advance with `block.timestamp`; they represent rolling 7/28/56-day withdrawal horizons, not fixed calendar maturities that were extended. See Appendix A for detailed analysis.

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
- **Rolling-horizon correction**: source review shows that the funded Maturing farms generally compute `maturity()` as `block.timestamp + duration`. The observed dates therefore moved because the view function reports a rolling horizon, not because governance repeatedly extended fixed maturities. Current configured horizons are 7 days for Aave V4, Steakhouse, the old PYUSD swap farm, and RWA farms `0x04d5`/`0xe919`; 28 days for Midas and RWA farm `0x9E5e`; and 56 days for RWA farm `0x277F`.
- **Incidents**: No reported security incidents or exploits found. iUSD oracle still reports 1.0 (verified onchain 2026-07-29 — no loss-socialization event).
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.
- **liUSD unwinding**: The `UnwindingModule` holds ~8.85M iUSD (down from ~16.87M), indicating ~$8M of locked-token positions completed their early-exit process since the last assessment. The `LockingController` totalBalance has shrunk from $27.83M to $19.71M.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed via farm contracts grouped into three `AssetType` buckets in `FarmRegistry`: **Liquid** (instant withdrawal), **Illiquid** (perpetual but slow to unwind), and **Maturing** (subject to a configured withdrawal horizon). The current portfolio is heavily concentrated in tokenized RWA (Midas-Fasanara) and offchain RWA escrow positions, with smaller onchain positions in Cap Protocol stcUSD, Aave V4 USDG, Steakhouse MetaMorpho, Spark sUSDC, and residual Sentora PRIME. **Critical: Midas mGLOBAL and the four RWA escrows represent 84.4% of TVL and depend on offchain custody or NAV attestation. See Appendix A.**
- **Asset Allocation** (verified onchain via `Accounting.totalAssetsValueOf(type)` and per-farm `assets()`, 2026-07-29):

  | Bucket | Value (USD) | Share |
  |--------|------------:|------:|
  | Liquid (USDC instant) | **$0.67** | **~0%** |
  | Illiquid (perpetual) | $5,451,990.14 | 9.0% |
  | Maturing (rolling horizon) | $54,944,500.86 | 91.0% |
  | **Total** | **$60,396,491.68** | 100% |

  **Critical observation**: The Liquid bucket is empty in practice (only ~$0.67 across Liquid farms). Effectively all $60.40M of TVL sits in Illiquid or Maturing farms. `RedeemController` currently reports an empty queue, but any material redemption exceeding the dust-sized Liquid balance would enqueue. The $5.45M Illiquid bucket can be unwound only through operator rebalancing; `BeforeRedeemHook` pulls only from Liquid farms.

  Top farms by deployed value:

  | Farm | Type | Target | Assets | Share |
  |------|------|--------|-------:|------:|
  | [`MidasFarm`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF) | Maturing | mGLOBAL — Midas Fasanara Global ([`0x7433…98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)); rolling 28-day withdrawal horizon. | $31.02M | 51.35% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | Maturing | Escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) → Team Multisig; rolling 7-day horizon. | $10.29M | 17.03% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | Maturing | Escrow [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) → receiver [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211); rolling 56-day horizon. Counterparty identity TODO. | $5.09M | 8.43% |
  | [`CapFarm`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694) | Illiquid | stcUSD — Cap Protocol staked cUSD ([`0x8888…8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)). | $4.41M | 7.30% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | Maturing | Escrow [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) → receiver [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926); rolling 28-day horizon. Counterparty identity TODO. | $2.58M | 4.27% |
  | [`AaveV4Farm`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657) | Maturing | Aave V4 USDG market; rolling 7-day horizon. | $2.25M | 3.73% |
  | [`RWAEscrowFarm`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | Maturing | Escrow [`0x1B3A…9927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C) → receiver [`0xf758…d83c`](https://etherscan.io/address/0xf7583D86D9fB25391Af6e30ad17786572792d83c); rolling 7-day horizon. Counterparty identity TODO. | $2.00M | 3.32% |
  | [`ERC4626FarmWithMaturity`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78) | Maturing | Steakhouse infiniFi USDC MetaMorpho vault; rolling 7-day horizon. | $1.13M | 1.87% |
  | [`SparkSUSDCFarm`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) | Illiquid | Spark USDC Vault ([`0xBc65…45FE`](https://etherscan.io/address/0xBc65ad17c5C0a2A4D159fa5a503f4992c7B545FE)). | $1.04M | 1.73% |
  | [`SwapFarmV2WithMaturity`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) | Maturing | Residual Sentora PRIME; rolling 7-day horizon. | $0.59M | 0.97% |
  | Remaining (dust / inactive) | mixed | Includes verified [`SwapFarmV2WithMaturity`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE), which holds only 14.611656 PYUSD and no senPYUSDmain. | <$0.01M | <0.1% |

  Notable concentrations: **Midas-Fasanara mGLOBAL 51.35%**, **four offchain RWA escrows 33.05%**, **Cap stcUSD 7.30%**, **Aave V4 USDG 3.73%**, **Steakhouse MetaMorpho 1.87%**, and **Spark sUSDC 1.73%**.

  The book is highly consolidated. Midas plus the four RWA escrows total $50.97M, or 84.4% of accounting TVL. The prior apparent $14.6M PYUSD position was a decimals error: the farm holds 14,611,656 raw PYUSD units, equal to 14.611656 PYUSD because PYUSD has six decimals.

- **Risk Hierarchy**: Losses are socialized based on a "liability ladder":
  1. liUSD (Locked) holders take the first loss.
  2. siUSD (Staked) holders take the next loss.
  3. iUSD (Stablecoin) holders are the last to be affected.

### Accessibility

- **Enabled Deposit Assets** (verified onchain via `FarmRegistry.getEnabledAssets()`): USDC ([`0xA0b8…eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)) and USDT ([`0x8292…17eD`](https://etherscan.io/address/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD)). USDe and sUSDe are not enabled on `FarmRegistry`. The protocol's frontend may still accept other assets via wrapper logic — TODO verify gateway behavior.
- **Minting**: Users deposit USDC/USDT through the Gateway → `MintController` to mint iUSD.
- **Redemption**:

  - **Instant**: Capped by liquidity in the Liquid-type farms (`MintController`, `RedeemController`, `SwapFarmV2`, `LiquidationFarm`, `PrimeBrokerFarm`). **Currently effectively $0** (~$0.67 total); any material redemption would enqueue unless allocators first rebalance funds into Liquid farms.
  - **Queue**: With instant-redemption reserves near zero, redemption requests enter a **FIFO Queue**. Pending requests are fulfilled as capital is unwound from illiquid strategies or new deposits enter.
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
  - **Midas-tokenized Fasanara Global (mGLOBAL)** — $31.02M (51.35%). Midas is a tokenization issuer; the underlying is Fasanara Capital's hedge-fund strategy. Custody and valuation depend on offchain parties and NAV attestation. The farm has a rolling 28-day withdrawal horizon.
  - **Four RWA Escrow Farms** — $19.96M (33.05%): $10.29M through escrow [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd), $5.09M through [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB), $2.58M through [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A), and $2.00M through [`0x1B3A…9927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C). All four positions are value-attested onchain by the same keeper/rate manager `RWAEscrowRateManager` ([`0x11F6…4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)) and have rolling 7/28/56-day horizons.
  - **Cap Protocol stcUSD** — $4.41M (7.30%). Cap is a relatively young stablecoin issuer.
  - **Aave V4 USDG market** — $2.25M (3.73%) supplied into Aave's Global Dollar market.
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

  The first-loss buffer (`LockingController.totalBalance()` = 19.71M) has contracted from 27.83M, with ~$8M of liUSD positions completing their early-exit unwinding since the last assessment. The buffer is now smaller than the single Midas mGLOBAL position ($31.02M) and well below the combined offchain exposure ($50.97M).

### Provability

- **Transparency**: Farm allocations and reported book values are verifiable onchain via `FarmRegistry.getFarms()`, per-farm `assets()`, and `Accounting`.
- **Reserves**: Onchain positions such as Cap stcUSD, Spark sUSDC, Aave V4 USDG, and Steakhouse MetaMorpho are directly inspectable. The true underlying value of Midas mGLOBAL (51.35%) and the four RWA escrow farms (33.05%) cannot be independently audited onchain; together, 84.4% of TVL depends on offchain custody, counterparties, keepers, or NAV attestation.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: only ~$0.34M circulates outside protocol contracts. The instant-redemption buffer is ~$0.67. `RedeemController` currently reports `queueLength = 0`, `totalEnqueuedRedemptions = 0`, and `totalPendingClaims = 0`; however, any material exit exceeding Liquid-farm dust would enter the FIFO queue.
  - **siUSD**: Staked holders can withdraw to iUSD via `siUSD.withdraw()` (ERC4626) but then face the same redemption queue.
  - **liUSD**: Locked positions (1-13 weeks). Early exits route through `UnwindingModule` and incur a slashing penalty. ~8.85M iUSD is currently mid-unwind (down from ~16.87M), indicating ~$8M of locked positions completed their early exits.
- **Withdrawal Queues**: The queue is empty at the observation block, but the Liquid bucket cannot serve a material redemption. `BeforeRedeemHook` pulls only from Liquid farms, so the $5.45M Illiquid bucket requires an operator rebalancing action before it can fund redemptions. The Maturing farms expose rolling withdrawal horizons: 7 days for $15.67M, 28 days for $33.59M, and 56 days for $5.09M. These are duration constraints rather than scheduled calendar settlement events.

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
    - _Timelock_: Changes to capital allocation parameters (e.g., Farm Registry updates) use the **Short Timelock** (1 hour delay).
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
    - _Scope_: Adding a new protocol to the allowlist requires a governance vote and must pass through the **Short Timelock** (1 hour delay).
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/8 threshold**, 8 EOA signers (verified onchain via `getOwners()` and `getThreshold()` on 2026-07-29). Nonce 543. One new signer added since July 4 (`0xCC30e7d9dfBc29613E2A1e272cd624aFC3Abe1E9`, holds no individual protocol roles).

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
    | MANUAL_REBALANCER (4 holders: multisig + Short Timelock + LiquidationFarm + [`0xfD1Ea…83dE4`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4)) | Rebalance funds between whitelisted farms |
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
  | FINANCE_MANAGER | 4 | YieldSharing, LiquidationFarm, PLSmootherHelper, [`PrimeBrokerFarm`](https://etherscan.io/address/0xfD1Ea12d29B90630b265DBbc6Af88266d1a83dE4) |
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

- **Top dependencies (by deployed value)**: **Midas / Fasanara** (mGLOBAL) 51.35%; **four RWA escrow counterparties** 33.05% (one receiver is the team multisig and three are external addresses whose legal identities remain TODO); **Cap Protocol** 7.30%; **Aave V4 / Global Dollar** 3.73%; **Steakhouse-curated Morpho** 1.87%; and **Spark sUSDC** 1.73%. The identified `PrimeBrokerFarm` currently holds no assets. The CoW Protocol solver set remains a dependency for swap farms.
- **Stablecoin dependencies**: USDC and USDT are enabled deposit assets. The protocol also has exposure to USDG / Global Dollar, cUSD/stcUSD, Spark sUSDC, residual Sentora PRIME, and tokenized/offchain RWAs through Midas and four escrow counterparties. The verified farm at `0x84FF7` holds only 14.611656 PYUSD, which is immaterial; PYUSD is treated as a quality risk-2 asset. USDe and sUSDe remain disabled on `FarmRegistry`.
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

- **TVL**: Monitor total protocol TVL via liquid + illiquid farm balances
- **Liquid Reserve Ratio**: Liquid reserves vs total TVL

## Risk Summary

### Key Strengths

- Strong risk segmentation design with liability ladder (liUSD first-loss → siUSD → iUSD)
- Comprehensive audit coverage: Spearbit/Cantina Code main review + 6 ongoing upgrade reviews + Certora formal verification + public competition
- Robust governance: 4/8 multisig + dual timelock (7d/1h) + separation of powers. DEFAULT_ADMIN renounced. emergencyAction bypass prevented via no-op override in Timelock.
- All contracts verified onchain, all funded farms properly target their stated protocols/counterparties
- No reported exploit or loss-socialization event since launch
- Backed by reputable investors (Electric Capital, Sam Kazemian)

### Key Risks

- **84.4% of TVL is offchain-custodied or NAV-attested**: Midas-Fasanara mGLOBAL (51.35%) plus four RWA escrow farms (33.05%) represent $50.97M whose true underlying backing cannot be independently verified onchain.
- **Single-position concentration above 50%**: Midas-Fasanara mGLOBAL is 51.35% of TVL ($31.02M), subject to a rolling 28-day withdrawal horizon. This exceeds the entire liUSD first-loss buffer ($19.71M).
- **RWA escrow footprint**: four `RWAEscrowFarm` positions hold $19.96M (33.05%). Funds sit with offchain counterparties (one receiver is the team multisig and three are external addresses), with values attested by a single onchain rate manager.
- **Instant-redemption buffer is effectively $0**: the strictly Liquid-type farms hold only dust (~$0.67), so instant (no-queue) iUSD redemption is unavailable. The Illiquid bucket ($5.45M, exit-controlled but not maturity-locked) provides some withdrawal capacity, but redemptions from it are not instant.
- **Short Timelock delay is only 1 hour**: parameter, oracle (`setPrice`/`setOracle`), and farm add/remove actions execute after only a 1-hour delay, a narrow early-warning window for those changes.
- **TVL continues to contract**: now ~$60.40M, on a steady downtrend from a ~$177M peak earlier in 2026, with the liUSD first-loss buffer also shrinking ($19.71M, down from $27.83M) — signs of ongoing exit pressure.
- **Multisig retains broad non-timelocked powers** — EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, UNPAUSE, MINOR_ROLES_MANAGER, PAUSE, and EXECUTOR_ROLE on InfiniFiCore — so a 4/8 signer set can both propose and execute its own timelock actions and move farm funds to a safe address.
- **Rolling withdrawal horizons**: 91% of TVL is in Maturing farms with 7/28/56-day horizons. These horizons were previously misread as fixed settlement dates because `maturity()` is calculated from the current block timestamp.
- **Short operational history** (~13 months in production since June 2025).

- **No disclosed legal entity or incident response plan**.
- **Certora formal verification** report published but finding severity breakdown not available on the landing page (full PDF required for detailed review).

### Critical Risks

- **Material redemptions depend on active unwinding of a concentrated, offchain-heavy book.** Instant-redemption capacity is ~$0.67 and 84.4% of TVL is in Midas mGLOBAL plus four offchain RWA escrows. The queue is currently empty, and the Illiquid bucket ($5.45M) provides exit-controlled capacity, but neither is automatically available to `BeforeRedeemHook`. Operators requiring reliable USDC exit should treat InfiniFi as queue-capable exposure with heavy offchain-counterparty credit risk and 7/28/56-day withdrawal horizons.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. Multiple audits by reputable firms (Spearbit, Certora, Cantina).
- [x] **Unverified contract source** — PASSED. siUSD, core contracts, and all material farm contracts assessed here have verified source.
- [x] **Unverifiable reserves** — CONDITIONALLY PASSED. Allocations and reported book values are onchain, but Midas and the four RWA escrows depend on offchain custody/NAV or keeper attestations.
- [x] **Total centralization** — PASSED. 4/8 multisig with dual timelocks, DEFAULT_ADMIN renounced.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Strong coverage — Spearbit/Cantina Code main review (8H/6M/25L), Certora formal verification ([report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report)), Cantina public competition, multiple upgrade reviews (YieldSharing V2 → V3 upgrade reviewed).
- **History**: ~13 months in production (mainnet launch June 2025; this reassessment July 2026). TVL ~$60M, on a steady downtrend from a ~$177M peak earlier in 2026.
- **Bounty**: [Active on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591).
- **Incidents**: No known exploits or loss events since launch.

**Score: 2.0/5** — Extensive audit coverage, formal verification, an active bounty, ongoing upgrade reviews, and ~13 months in production without a known loss event support a low audit/history score. The relatively short operating history prevents a minimal-risk score.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.2**
- 4/8 multisig (Gnosis Safe v1.4.1, up from 4/7 with one new signer) with dual timelocks (7d Long for GOVERNOR-scope, 1h Short for parameters) remains in place.
- DEFAULT_ADMIN_ROLE renounced on Core and both timelocks; `Timelock.emergencyAction` is a no-op override.
- All 8 multisig signers are EOAs; the new signer holds no individual protocol roles.
- The multisig holds EXECUTOR_ROLE on the Long Timelock alongside the deployer EOA and individual signer EOAs, so it can both schedule and execute its own proposals; the timelock delay still applies but the execution gate is not held by a distinct party.
- Short Timelock delay remains **1 hour**. Parameter, oracle, and farm add/remove actions clear after only an hour, materially shrinking the early-warning window for those changes.
- Multisig retains significant non-timelocked direct powers: UNPAUSE, EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, FARM_SWAP_CALLER, MINOR_ROLES_MANAGER, PAUSE.

**Subcategory B: Programmability — 3.0**
- Hybrid model: algorithmic Self-Laddering Engine + active Allocator management. Asset/liability matching is the design intent, but current allocator decisions have produced an effectively zero liquid buffer, 84.4% offchain concentration, and 91% exposure to rolling withdrawal horizons.
- Oracle-dependent for pricing (Chainlink + protocol-specific oracles for stcUSD, mGLOBAL, RWA escrow rate manager); ORACLE_MANAGER role is under the Short Timelock (1h).
- emergencyAction safely disabled on timelocks (unchanged).

**Subcategory C: Dependencies — 4.0**
- Exposure is concentrated in Midas mGLOBAL (51.35%) and four RWA escrow counterparties (33.05%); the combined 84.4% offchain dependency is far above the liUSD first-loss buffer.
- One RWA escrow receiver is the team multisig and three are external addresses whose legal counterparty identities are not publicly disclosed. All four depend on a single onchain rate manager for valuation.
- Secondary dependencies include Cap stcUSD, Aave V4/USDG, Steakhouse/Morpho, and Spark sUSDC.
- Pegs / NAVs depended on include USDC, USDT, cUSD, USDG, and the offchain mGLOBAL and RWA escrow attestations.

**Score: 3.4/5** — (3.2 + 3.0 + 4.0) / 3 = 3.4. Governance improved from 4/7 to 4/8, but the 1-hour Short Timelock and 84.4% concentration in offchain dependencies justify a slight increase.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.5**
- Reserves are 100% accounted for onchain via `FarmRegistry` and per-farm `assets()` — total matches `Accounting.totalAssetsValue()` of ~$60.40M against an iUSD supply of 60.39M (parity within rounding).
- **84.4% of TVL** is in positions whose true backing cannot be independently audited onchain:
  - **Midas mGLOBAL** (51.35%, $31.02M) wraps Fasanara Capital's hedge-fund strategy.
  - **Four RWAEscrowFarms** (33.05%, $19.96M) send funds to offchain counterparties and use a single rate manager for valuation.
- The remaining 15.6% sits primarily in onchain-verifiable Cap stcUSD, Aave V4 USDG, Steakhouse MetaMorpho, Spark sUSDC, and residual Sentora PRIME positions.
- Liability ladder (liUSD → siUSD → iUSD) is intact but the first-loss buffer has weakened further: `LockingController.totalBalance()` = $19.71M (down from $27.83M), with ~$8.85M of liUSD still mid-unwind. The buffer is now significantly smaller than the single Midas position and a fraction of the combined offchain exposure — a single adverse credit event in Midas or the RWA escrows could exhaust it before iUSD holders are protected.

**Subcategory B: Provability — 3.5**
- Allocations and book values are fully transparent onchain (which farm holds what, and the attested value).
- The *true* underlying value of Midas mGLOBAL (51.35%) and the four RWA escrows (33.05%) rests on offchain custody, counterparties, and attestations. Yearn would have to trust Midas/Fasanara's NAV and a single `RWAEscrowRateManager` for 84.4% of the book.
- Material farm contracts and the changed FINANCE_MANAGER holder were source-identified; legal identities for three external RWA receivers remain TODO.
- siUSD exchange rate is ERC4626-standard and verifiable.

**Score: 4.0/5** — (4.5 + 3.5) / 2 = 4.0, unchanged. Offchain exposure is 84.4%, the first-loss buffer has weakened by $8M, and the Midas position alone exceeds it.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: Onchain `Accounting.totalAssetsValueOf(Liquid)` returns ~$0.67; the Liquid-type farms collectively hold dust. There is **no instant-redemption capacity for iUSD today**.
- **Queue**: `RedeemController` currently reports no queued redemptions or pending claims. A material redemption would enqueue because `BeforeRedeemHook` can pull only from Liquid farms. The $5.45M Illiquid bucket requires operator rebalancing, while Maturing positions use rolling 7/28/56-day horizons.
- **Depth (secondary)**: The Curve iUSD/USDC pool held only about 4,670 iUSD and 4,374 USDC at the observation block. A 10,000 iUSD quote returned only about 4,363 USDC, so secondary-market exit at par cannot be assumed.
- **Free supply**: Only ~$0.34M of iUSD sits in user wallets outside protocol contracts — down from ~$0.47M. The queue is the binding constraint for any material exit.

**Score: 3.5/5** — The empty queue, $5.45M exit-controlled Illiquid bucket, and same-value USDC backing mitigate the score. However, instant reserves are only ~$0.67, secondary liquidity is tiny, Illiquid funds need operator action, and 91% of TVL is subject to rolling 7/28/56-day withdrawal horizons.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Known team; ex-Fei/ECG contributors.
- **Funding**: $3M Pre-Seed from reputable VCs.
- **Docs**: Above-average technical documentation; transparency dashboard ([stats.infinifi.xyz](https://stats.infinifi.xyz/)) shows live allocation data.
- **Legal**: No disclosed legal entity or jurisdiction.
- **Incident response**: No publicly documented plan. Emergency capabilities exist onchain (pause + emergency withdrawal).

**Score: 2.5/5** — Known technical contributors, reputable funding, and good documentation are positives. The absence of a disclosed legal entity/jurisdiction, public team page, governance forum, or documented incident-response plan keeps operational risk at 2.5.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.400 |
| Centralization & Control | 3.4 | 30% | 1.020 |
| Funds Management | 4.0 | 30% | 1.20 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.270** |

**Final Score: 3.3**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK**

The composite score is 3.3. The key risks at this reassessment are:
- **84.4% of TVL is offchain-custodied / NAV-attested** through Midas mGLOBAL and four RWA escrow farms.
- **Concentration in Midas-Fasanara mGLOBAL** (51.35% of TVL): the single $31.02M position is larger than the entire liUSD first-loss buffer.
- **First-loss buffer shrinking**: `LockingController.totalBalance()` down from $27.83M to $19.71M as liUSD exits continue.
- **No material liquid redemption buffer**: only ~$0.67 in Liquid farms. The queue is empty now, but a material iUSD-to-USDC exit would enqueue and depend on operator rebalancing plus farm withdrawal horizons.
- **Short Timelock at 1 hour** and multisig with broad non-timelocked powers (now 4/8, up from 4/7).
- **Rolling withdrawal horizons**: 91% of TVL is subject to 7/28/56-day horizons.
- **Short operational history** (~13 months).

---

## Reassessment Triggers

- **Time-based**: Reassess in 30 days (target 2026-08-28).
- **Liquidity-based**: Reassess immediately if the FIFO queue develops a material backlog, pending claims remain uncleared for longer than the applicable farm withdrawal horizon, or Liquid assets remain below 1% of supply for another 30 days.
- **TVL-based**: Reassess if TVL moves by more than 30% in either direction from the current ~$60.40M.
- **Concentration-based**: Midas already exceeds 50% and combined offchain exposure already exceeds 80%. Reassess if Midas exceeds 55%, combined offchain exposure exceeds 90%, or any other single farm exceeds 20%.
- **Issuer / counterparty-based**: Reassess on any material event at Midas, Fasanara Capital, Cap Protocol, Paxos/Global Dollar, Spark, or the RWA escrow counterparties, including a custodian change, restructure, regulatory action, depeg, or delayed return beyond the configured withdrawal horizon.
- **Governance-based**: Reassess after any signer change on the multisig, any new EXECUTOR_ROLE / PROPOSER_ROLE / CANCELLER_ROLE grant, any further change to either timelock's `getMinDelay()`, any change to the `Timelock.emergencyAction` no-op override, or any role grant on `InfiniFiCore` outside the Long Timelock.
- **Incident-based**: Reassess after any exploit, oracle failure, or material loss event at the protocol or in any farm with >$2M of InfiniFi exposure.
- **Architecture-based**: Reassess on any new farm category (new `AssetType` bucket), new asset enablement on `FarmRegistry`, new RWA escrow counterparty, or any change to YieldSharing/Accounting beyond the V3 line.

---

## Appendix A: Top Farm Exposure Analysis

Onchain inspection of `FarmRegistry.getFarms()` and per-farm `assets()` on 2026-07-29 shows a concentrated portfolio, with 91% in Maturing farms that apply rolling 7/28/56-day withdrawal horizons. The Liquid bucket holds only dust. The farms below cover more than 99% of TVL.

Midas mGLOBAL is 51.35% of TVL and four RWA escrow farms total 33.05%. `0xe919…` is a source-verified fourth `RWAEscrowFarm`; `0xd880…` is a source-verified `SparkSUSDCFarm`; and role holder `0xfD1E…` is a source-verified `PrimeBrokerFarm`. The farm at `0x84FF7…` is a `SwapFarmV2WithMaturity` containing only 14.611656 PYUSD plus zero senPYUSDmain, not a $14.6M position.

### Summary Table: Top Farms by Deployed Value

| Farm | Type / Horizon | Underlying | Assets | Share | Individual Risk |
|------|----------------|------------|-------:|------:|----------------:|
| **MidasFarm (mGLOBAL)** | Maturing / 28d | Midas-tokenized Fasanara Global strategy | $31.02M | 51.35% | **4.5/5** |
| **RWAEscrowFarm** `0x04d5` | Maturing / 7d | Offchain escrow; receiver = Team Multisig | $10.29M | 17.03% | **4.5/5** |
| **RWAEscrowFarm** `0x277F` | Maturing / 56d | Offchain escrow; receiver `0xa03B…d211` | $5.09M | 8.43% | **4.5/5** |
| **CapFarm (stcUSD)** | Illiquid | Cap Protocol staked cUSD | $4.41M | 7.30% | **4.0/5** |
| **RWAEscrowFarm** `0x9E5e` | Maturing / 28d | Offchain escrow; receiver `0x4831…D926` | $2.58M | 4.27% | **4.5/5** |
| **AaveV4Farm (USDG)** | Maturing / 7d | Aave V4 Global Dollar market | $2.25M | 3.73% | **3.0/5** |
| **RWAEscrowFarm** `0xe919` | Maturing / 7d | Offchain escrow; receiver `0xf758…d83c` | $2.00M | 3.32% | **4.5/5** |
| **ERC4626FarmWithMaturity (Steakhouse)** | Maturing / 7d | Steakhouse-curated MetaMorpho USDC vault | $1.13M | 1.87% | **2.5/5** |
| **SparkSUSDCFarm** `0xd880` | Illiquid | Spark USDC Vault | $1.04M | 1.73% | **2.5/5** |
| **SwapFarmV2WithMaturity (old PYUSD)** | Maturing / 7d | Residual Sentora PRIME | $0.59M | 0.97% | **3.0/5** |

### Detailed Farm Risk Assessments

---

#### 1. MidasFarm — Midas-tokenized Fasanara Global (mGLOBAL)

**Risk Score: 4.5/5**

**Description:**
`MidasFarm` ([`0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF`](https://etherscan.io/address/0xF4Ea3Ec87B1c254f17a2Fb68164dB0CAf6c4cecF)) holds [`mGLOBAL`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8), an ERC-20 token issued by Midas that represents a claim on the Fasanara Capital "Global" strategy. The underlying is wrapped in Midas's permissioned-issuance and offchain-NAV-attestation architecture rather than held directly. The farm reports a rolling 28-day withdrawal horizon. At 51.35% of TVL, it is the dominant position and is larger than the entire liUSD first-loss buffer.

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Concentration** | **Very High** | 51.35% of total InfiniFi TVL in a single position, exceeding the liUSD first-loss buffer |
| **Off-Chain Custody** | **Very High** | Underlying hedge-fund strategy assets held by traditional custodians at Fasanara |
| **NAV / Valuation** | **High** | mGLOBAL price reflects an off-chain NAV attestation from Midas / Fasanara |
| **Issuer Risk** | High | Two stacked issuers (Midas + Fasanara) plus their respective custodians |
| **Regulatory Risk** | High | Tokenized fund products are subject to securities regulation in EU/UK/US |
| **Liquidity Risk** | High | The farm applies a rolling 28-day withdrawal horizon and secondary mGLOBAL liquidity is thin |

**Why This Matters:**
- Single largest exposure: a loss event large enough to impair mGLOBAL value would consume the entire liUSD first-loss buffer ($19.71M) before iUSD holders are protected.
- Two stacked issuers (Midas + Fasanara) plus their respective custodians; valuation is a pure offchain NAV attestation.
- The rolling 28-day withdrawal horizon means the largest position is not available for immediate redemption funding.

**References:**
- [mGLOBAL token on Etherscan](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)
- [Midas Capital](https://midas.app/)
- [Fasanara Capital](https://www.fasanara.com/)

---

#### 2. RWAEscrowFarms — Four Offchain Counterparties

**Risk Score: 4.5/5**

**Description:**
Four `RWAEscrowFarm` contracts hold $19.96M (33.05% of TVL). Each sends USDC to a dedicated escrow that forwards to an offchain receiver; position value is attested onchain by a shared `RWAEscrowRateManager` keeper ([`0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189)).

| Farm | Escrow | Receiver | Rolling Horizon | Value |
|------|--------|----------|----------------:|------:|
| [`0x04d5…3271`](https://etherscan.io/address/0x04d5521ac09F8823338e8163Dd8BAdAEE39F3271) | [`0x4962…26Dd`](https://etherscan.io/address/0x4962762Bd3BA495CeDb9c33F5775C007e37b26Dd) | Team Multisig [`0x8060…400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) | 7d | $10.29M |
| [`0x277F…84C1`](https://etherscan.io/address/0x277FdF6Dc5c53C5c2828188Da84B9593A50884C1) | [`0x1532…94bB`](https://etherscan.io/address/0x1532f095F8daa79d22a2475FD50c7109add394bB) | [`0xa03B…d211`](https://etherscan.io/address/0xa03B88D7985E1C6A847Cfb123C786c1d7eA8d211) | 56d | $5.09M |
| [`0x9E5e…1852`](https://etherscan.io/address/0x9E5efC5F387D8661C1AFB2469B7EeF6972451852) | [`0x868C…741A`](https://etherscan.io/address/0x868C82b7BAa3675F9Da1404510DB60c1f6A7741A) | [`0x4831…D926`](https://etherscan.io/address/0x4831C121879d3DE0E2B181d9d55E9B0724f5D926) | 28d | $2.58M |
| [`0xe919…81Cf`](https://etherscan.io/address/0xe919C66475f2F30d285c768853E6B5b23ef181Cf) | [`0x1B3A…9927C`](https://etherscan.io/address/0x1B3A2680713Aa1CdAE1403F7D2B1D5E936d9927C) | [`0xf758…d83c`](https://etherscan.io/address/0xf7583D86D9fB25391Af6e30ad17786572792d83c) | 7d | $2.00M |

**Key Risk Factors:**

| Risk Category | Assessment | Details |
|--------------|------------|---------|
| **Counterparty Risk** | **Very High** | Funds are custodied offchain. One receiver is the team multisig and three are external addresses; ultimate use is not onchain-visible. |
| **Identity (TODO)** | Unknown | Legal identities behind `0x4831…D926`, `0xa03B…d211`, and `0xf758…d83c` are not disclosed in public docs |
| **Concentration** | **Very High** | 33.05% of TVL across four escrow farms |
| **Valuation** | High | Position value during lock is driven by a single rate-manager keeper whose inputs come offchain |
| **Recovery** | Low | If a receiver does not return funds after the withdrawal horizon, recovery is a legal matter, not a smart-contract one |

**Why This Matters:**
- Collectively the most opaque exposure in the portfolio. Even Midas mGLOBAL has a tokenization issuer with public attestations; these farms rely on private bilateral arrangements.
- The 7/28/56-day horizons and offchain return process can compound queue pressure during a large redemption wave.

---

#### 3. SwapFarmV2WithMaturity (PYUSD / Sentora PRIME basket)

**Risk Score: 3.0/5**

**Description:**
The old PYUSD swap farm at [`0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E`](https://etherscan.io/address/0x75381e9Bc6B908a2e9bC31A535fC48CeCeAc568E) now holds only residual Sentora PRIME [`senPYUSDPRIMEv2`](https://etherscan.io/address/0xC21b08C16458202593D4D9B26b9984Ee67b38BbD) worth $0.59M and has a rolling 7-day horizon.

The second farm at [`0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE`](https://etherscan.io/address/0x84FF7Ef9568807c93436F09E2E613dE2aF3FE4EE) is source-verified as `SwapFarmV2WithMaturity`. It holds 14,611,656 raw PYUSD units, equal to **14.611656 PYUSD** at six decimals, and zero senPYUSDmain. This is dust, not $14.6M.

**Key Risk Factors:** PYUSD itself is treated as a quality risk-2 asset. The material $0.59M residual Sentora PRIME position adds a credit-vault layer and therefore retains a 3.0 individual farm score.

---

#### 4. CapFarm — Cap Protocol stcUSD

**Risk Score: 4.0/5**

**Description:**
`CapFarm` ([`0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694`](https://etherscan.io/address/0xAc21B22B5aEb11bc32De4ecF59E4538fCa48b694)) holds $4.41M of [`stcUSD`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888), the staked yield-bearing version of Cap Protocol's `cUSD`. A second Illiquid farm holds $1.04M in the identified Spark USDC Vault.

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
`AaveV4Farm` ([`0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657`](https://etherscan.io/address/0x2CdF51ca20C2DD56480c35adEA667A6653Fb7657)) supplies $2.25M into an Aave V4 market for [`USDG`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D) and has a rolling 7-day withdrawal horizon.

**Key Risk Factors:** Aave V4 is a newer codebase than V3; the position also carries USDG issuer/peg risk. Onchain-verifiable lending exposure, moderate risk.

---

#### 6. ERC4626FarmWithMaturity — Steakhouse-curated MetaMorpho

**Risk Score: 2.5/5**

**Description:**
`ERC4626FarmWithMaturity` ([`0x76D2E84009dAE457f8667D823c7c96e9A7c35B78`](https://etherscan.io/address/0x76D2E84009dAE457f8667D823c7c96e9A7c35B78)) deposits $1.13M into a dedicated Steakhouse-curated MetaMorpho V1.1 USDC vault [`0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9`](https://etherscan.io/address/0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9) and has a rolling 7-day withdrawal horizon.

**Key Risk Factors:** Standard MetaMorpho stack risk (Morpho Blue isolated markets + curator allocation) under a reputable curator. Low independent risk; included for completeness.

---

### Aggregate Risk Assessment

**Concentration:** 84.4% of TVL is in offchain exposures — Midas-Fasanara mGLOBAL (51.35%) and four RWA escrow counterparties (33.05%). The single Midas position alone exceeds the $19.71M first-loss buffer.

**Liquidity:** The Liquid bucket holds only ~$0.67 and the queue is currently empty. The $5.45M Illiquid bucket needs operator rebalancing, while 91% of TVL is in farms with rolling 7/28/56-day withdrawal horizons. The Curve iUSD/USDC pool is too small to provide a material alternative exit.

**Offchain exposure:** Midas-Fasanara plus four `RWAEscrowFarm` positions total **$50.97M, or 84.4% of TVL**, with material custodial, valuation, or counterparty dependence.

**Withdrawal horizons to monitor:**

1. **7 days** — $16.26M across RWA escrows `0x04d5`/`0xe919`, Aave V4, Steakhouse, and residual Sentora PRIME.
2. **28 days** — $33.59M across Midas mGLOBAL and RWA escrow `0x9E5e`.
3. **56 days** — $5.09M in RWA escrow `0x277F`.

**Recommendation:**
Treat current InfiniFi exposure primarily as credit exposure to **a tokenized Fasanara hedge-fund position (51.35%) and four RWA escrow counterparties (33.05%)**. Yearn operators should assume material exits may enqueue and depend on active rebalancing plus the applicable 7/28/56-day withdrawal horizon. Reassess if a material queue backlog persists beyond those horizons or an offchain counterparty delays the return of funds.

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
| July 29, 2026 | 3.3 | Reassessment — corrected rolling-horizon interpretation and PYUSD decimals; identified pending contracts; refreshed allocation, liquidity, and governance data |
