# Protocol Risk Assessment: Aave — sGHO

- **Assessment Date:** April 2, 2026 (rechecked April 22, 2026; refreshed post-deployment May 19, 2026; external-review corrections May 19, 2026; reassessed July 27, 2026)
- **Token:** sGho (GHO Savings Vault)
- **Chain:** Ethereum
- **Token Address:** [`0xE1753F2e00940cC31213dd92013cF019DFE4ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d)
- **Final Score: 2.5/5.0**

> **STATUS (July 27, 2026, block 25,622,129):** sGho is live on Ethereum mainnet with **72 days of production history** and `totalAssets() = 136,466,586 GHO` (~$136.3M). The vault is operating to the [AIP 484](https://app.aave.com/governance/v3/proposal/?proposalId=484) spec — `targetRate() = 425` bps, `supplyCap() = 4e26` (400M GHO), `paused() = false`, implementation and ProxyAdmin unchanged, no `TargetRateUpdated`, `SupplyCapUpdated`, `Paused`, `Upgraded`, or `RoleGranted`/`RoleRevoked` events since launch. **Two live conditions dominate this assessment:**
>
> 1. **The vault's yield obligation is under-funded.** `IERC20(GHO).balanceOf(sGho) = 136,261,440` against `totalAssets() = 136,466,586` — a **205,146 GHO shortfall (0.15% of `totalAssets`, 19.6% of all yield accrued since launch)**. Yield backing is supplied by discretionary manual GHO transfers from the **Aave Finance Committee Safe** ([`0x2274…1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa), 2-of-3); six transfers totalling 840,000 GHO were made between May 17 and **June 29, 2026**, and none since. The deficit widens by ~15,890 GHO/day. Because withdrawals pay early redeemers their full indexed claims, this live deficit can already be concentrated as principal loss on whoever exits last even though the pre-withdrawal balance exceeds aggregate net deposits.
> 2. **The GSM USDC exit route is exhausted.** `getAvailableLiquidity()` on GSM USDC is **9.95 waEthUSDC** (down from 111.25M on May 19), so `buyAsset()` — the GHO → USDC leg of the withdrawal pipeline — reverts with `INSUFFICIENT_AVAILABLE_EXOGENOUS_ASSET_LIQUIDITY` for any meaningful size and has done so since mid-June. The GSM is **not** frozen or seized; it is simply drained. The GSM buy fee was also raised **7 bps → 10 bps** by the Risk Council on May 23, 2026 (tx [`0xd47810…f0d8`](https://etherscan.io/tx/0xd47810e272039dea4b03d90a1352e9e405e9fee6fdd75b3fd8f733030d83f0d8)).
>
> **The new sGho contract remains separate from the legacy stkGHO proxy** ([`0x1a88…`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d)), which holds 42.03M stkGHO — migration out of legacy staking is well advanced. The `GhoRouter` is **still not deployed**: [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) is open (not merged, last commit June 29, 2026), there is no `GHO_ROUTER` entry in the [Aave Address Book](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol), and no router proposal exists in [`aave-proposals-v3`](https://github.com/aave-dao/aave-proposals-v3/tree/main/src).

## Overview + Links

sGHO is an **ERC-4626 compliant yield-bearing savings vault** for GHO, Aave's native stablecoin. It replaces the legacy stkGHO staking model with a native, on-chain yield mechanism that automatically accrues interest through an internal yield index.

**Yearn use case per issue #123:** Yearn USDC strategy that acquires GHO (via the GSM USDC module) and deposits into sGHO to earn the Aave Savings Rate (ASR).

**Strategy pipeline:**

- **Deposit:** USDC → waEthUSDC (Aave staticAToken) → GHO (via GSM USDC) → sGHO (direct `deposit()`)
- **Withdrawal:** sGHO → GHO → waEthUSDC (via GSM USDC) → USDC. **The GSM USDC leg is currently unusable** — see *Liquidity Risk*; the practical exits today are GSM USDT (to USDT) or DEX

**Key architecture:**

- **sGHO Vault:** Upgradeable ERC-4626 vault (TransparentUpgradeableProxy) with internal index-based yield accounting. GHO deposited remains in the contract — no rehypothecation, no external strategy deployment
- **GhoRouter:** Not deployed. A routing contract for multi-step USDC↔GHO↔sGHO conversions with slippage protection is drafted in [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) but is not merged, not audited under any published report, and not in the Address Book. All conversions must be composed manually
- **GSM USDC (Gsm4626):** GHO Stability Module that converts waEthUSDC (wrapped Aave USDC) to/from GHO at a fixed 1:1 price. Uses a pre-minted GHO reserve (does not mint GHO directly). Its underlying-asset inventory is a **shared pool with no per-depositor reservation** — capacity created by one participant's `sellAsset` can be consumed by any other participant's `buyAsset`
- **Yield source:** The Aave Savings Rate (ASR) is set by governance. Yield is **virtual** — the yield index grows over time, but the actual GHO to back it must be transferred into the vault by the Aave Finance Committee Safe from protocol revenue (borrower interest + GSM fees). No strategy or lending is involved, and no on-chain mechanism enforces or schedules the funding
- **Governance:** Aave DAO on-chain governance via Executor Level 1, with GHO Stewards (Risk Council 3-of-4 multisig) for rate adjustments

**Key parameters (from ARFC, March 25, 2026):**

- **Initial ASR:** 4.25% APR (fixed rate; amplification=0, premium=425 bps)
- **Supply Cap:** 400,000,000 GHO
- **Maximum Safe Rate Cap:** 50% APR (hardcoded constant)
- **Cooldown:** None
- **Lock-up:** None
- **Slashing:** None
- **Rehypothecation:** None
- **Fees:** None (0% deposit/withdrawal fees on sGHO itself)
- **GSM USDC sell fee:** 0 bps (waEthUSDC → GHO)
- **GSM USDC buy fee:** 10 bps (GHO → waEthUSDC), verified on fee strategy [`0x06fbDE909B43f01202E3C6207De1D27cC208AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1) — `getBuyFee(1_000_000) = 1000`

**Links:**

- [ARFC: sGHO Launch Configuration](https://governance.aave.com/t/arfc-sgho-launch-configuration/24346)
- [ARFC: GHO Savings Upgrade](https://governance.aave.com/t/arfc-gho-savings-upgrade/21680)
- [ARFC: Launch sGHO Cross-Chain](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) (June 24, 2026 — ARFC stage; would add a Chainlink CCIP dependency if escalated)
- [Snapshot Vote](https://snapshot.org/#/s:aavedao.eth/proposal/0xb9e9b01efcf6151bade78546d0f51f11d7961939b649fb7717e82ea3d43d4f47)
- [Implementation PR #29](https://github.com/aave-dao/gho-origin/pull/29)
- [sGHO Source (gho-origin)](https://github.com/aave-dao/gho-origin/tree/main/src/contracts/sgho)
- [TokenLogic Audit Repo Snapshot](https://github.com/TokenLogic-com-au/gho-origin/tree/b30f973f99fd6eb7a9f343b4681dae88f58007ef)
- [GHO Core Contracts](https://github.com/aave/gho-core)
- [Aave GHO Documentation](https://aave.com/docs/developers/gho)
- [TokenLogic: GHO On-Chain Analytics](https://aave.tokenlogic.xyz/gho) — live GHO, sGHO, GSM, and market analytics; supplementary to direct contract reads
- [DeFiLlama: Aave](https://defillama.com/protocol/aave)
- [LlamaRisk: sGHO Analysis](https://llamarisk.com/research/2025-04-11t20-52-28-000z)

## Contract Addresses

### sGho Contracts (Deployed May 5, 2026; activated by AIP 484 on May 16, 2026)

| Contract | Address | Type |
|----------|---------|------|
| sGho Vault (proxy) | [`0xE1753F2e00940cC31213dd92013cF019DFE4ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | ERC-4626, TransparentUpgradeableProxy |
| sGho Implementation | [`0xff229a0bbb614a284de8ae0e41e5974878fd7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04) | `sGho.sol` |
| sGho ProxyAdmin | [`0xc15700631020eba02317964550365b95a9a28adb`](https://etherscan.io/address/0xc15700631020eba02317964550365b95a9a28adb) | Owner = Aave Governance Executor L1 |
| sGho Steward | [`0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757`](https://etherscan.io/address/0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757) | Rate/cap governance (`sGhoSteward.sol`) |
| Aave Finance Committee Safe (AFC) | [`0x22740deBa78d5a0c24C58C740e3715ec29de1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa) | 2-of-3 Gnosis Safe — **sole funder of sGho yield backing** (`MiscEthereum.AFC_SAFE`) |
| GhoRouter | Not deployed | [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) open and unmerged; no Address Book entry, no proposal in `aave-proposals-v3` |

Source-of-truth references: [`aave-address-book/GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol) (`SGHO`, `SGHO_STEWARD`); [`aave-address-book/MiscEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/MiscEthereum.sol) (`AFC_SAFE`); [AIP-484 payload diff](https://github.com/aave-dao/aave-proposals-v3/blob/main/diffs/AaveV3Ethereum_SGhoLaunch_20260427_before_AaveV3Ethereum_SGhoLaunch_20260427_after.md) (`AaveV3Ethereum_SGhoLaunch_20260427`); [contract creator](https://etherscan.io/address/0x3765a685a401622c060e5d700d9ad89413363a91).

### GHO Ecosystem Contracts (Deployed)

| Contract | Address | Type |
|----------|---------|------|
| GHO Token | [`0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f`](https://etherscan.io/address/0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f) | ERC-20, upgradeable |
| Legacy stkGHO | [`0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d) | Legacy staking (being sunset) |
| GHO Reserve | [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9) | Pre-minted GHO pool for GSMs |

### GSM USDC Contracts (Deployed)

| Contract | Address | Type |
|----------|---------|------|
| GSM USDC (Gsm4626) | [`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | TransparentUpgradeableProxy |
| GSM USDC Implementation | [`0x320be97b4d10b6d20a05cae53a479fa2a0187e8e`](https://etherscan.io/address/0x320be97b4d10b6d20a05cae53a479fa2a0187e8e) | Gsm4626 |
| GSM USDC ProxyAdmin | [`0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21`](https://etherscan.io/address/0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21) | EIP-1967 admin slot |
| waEthUSDC (Underlying) | [`0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E) | Wrapped Aave USDC (ERC-4626); `convertToAssets(1e6) = 1.179842` USDC |
| GSM USDC Fee Strategy | [`0x06fbDE909B43f01202E3C6207De1D27cC208AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1) | FixedFeeStrategy (0 bps sell, 10 bps buy) — live value from `GSM.getFeeStrategy()` |
| GSM USDC Price Strategy | [`0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f`](https://etherscan.io/address/0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f) | FixedPriceStrategy (1:1) |
| GSM USDT (Gsm4626) | [`0x882285E62656b9623AF136Ce3078c6BdCc33F5E3`](https://etherscan.io/address/0x882285E62656b9623AF136Ce3078c6BdCc33F5E3) | Alternative GHO exit — 43.42M waEthUSDT available, 85M exposure cap, same 10 bps fee strategy |
| Oracle Swap Freezer | [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Chainlink-based auto-freeze |
| GSM Registry | [`0x167527DB01325408696326e3580cd8e55D99Dc1A`](https://etherscan.io/address/0x167527DB01325408696326e3580cd8e55D99Dc1A) | GSM registry |

> The Aave Address Book entries `GSM_USDC_FEE_STRATEGY` (`0xE502…6D64`) and `GSM_USDC_PRICE_STRATEGY` (`0x00e8…3b72`) do **not** match what GSM USDC actually points at on-chain (`getFeeStrategy()` / `PRICE_STRATEGY()`). Read the strategies from the GSM, not the Address Book.

### Governance Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Aave Governance Executor L1 | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A) | On-chain DAO executor — DEFAULT_ADMIN, CONFIGURATOR, SWAP_FREEZER on GSM |
| GHO Risk Council (Stewards) | [`0x8513e6F37dBc52De87b166980Fa3F50639694B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60) | 3-of-4 Gnosis Safe |
| Aave Protocol Guardian | [`0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30`](https://etherscan.io/address/0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30) | Emergency pause capability |
| GHO GSM Steward | [`0xD1E856a947CdF56b4f000ee29d34F5808E0A6848`](https://etherscan.io/address/0xD1E856a947CdF56b4f000ee29d34F5808E0A6848) | CONFIGURATOR on GSMs, rate-limited |
| GHO Aave Core Steward | [`0x98217A06721Ebf727f2C8d9aD7718ec28b7aAe34`](https://etherscan.io/address/0x98217A06721Ebf727f2C8d9aD7718ec28b7aAe34) | Aave protocol parameter steward |
| GHO Bucket Steward | [`0x46Aa1063e5265b43663E81329333B47c517A5409`](https://etherscan.io/address/0x46Aa1063e5265b43663E81329333B47c517A5409) | GHO bucket capacity management |
| GHO CCIP Steward | [`0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39`](https://etherscan.io/address/0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39) | Cross-chain bridge steward |

### GSM USDC On-Chain Verification

| Contract | Etherscan Verified | Proxy |
|----------|-------------------|-------|
| GSM USDC | Yes | Yes (TransparentUpgradeableProxy → Gsm4626) |
| waEthUSDC | Yes | Yes |
| Fee Strategy | Yes | No (immutable) |
| Price Strategy | Yes | No (immutable) |
| Oracle Swap Freezer | Yes | No |
| GHO Reserve | Yes | Yes (TransparentUpgradeableProxy) |

### On-Chain State Verification (July 27, 2026, block 25,622,129)

| Check | Result | Source |
|-------|--------|--------|
| sGho / SGHO_STEWARD entries in Aave Address Book | **Present** | [`GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol) |
| AIP 484 payload state | **Executed** at block 25,109,406 (2026-05-16 18:04 UTC) | [tx 0x48ef4e…d404e](https://etherscan.io/tx/0x48ef4e0de1e5684ee05ae0e49c67af781bd497b675c0ea1a24193a5a499d404e) |
| sGho contract is ERC-4626 with GHO as asset | **Yes** — `asset() = 0x40D1…6C2f` (GHO Token) | `cast call SGHO asset()` |
| sGho `targetRate` matches AIP spec (425 bps = 4.25% APR) | **Yes** — `targetRate() = 425`; no `TargetRateUpdated` event since launch | `cast call SGHO targetRate()` |
| sGho `supplyCap` matches AIP spec (400M) | **Yes** — `supplyCap() = 4e26` (400M·1e18); no `SupplyCapUpdated` event since launch | `cast call SGHO supplyCap()` |
| sGho `MAX_SAFE_RATE` is 50% APR | **Yes** — `MAX_SAFE_RATE() = 5000` (bps) | `cast call SGHO MAX_SAFE_RATE()` |
| sGho `paused` | **false** — no `Paused` event since launch | `cast call SGHO paused()` |
| sGho `totalAssets()` | **136,466,586 GHO** (~$136.3M); `totalSupply() = 135,335,406` shares | `cast call SGHO totalAssets()` |
| sGho `convertToAssets(1e18)` | `1.008358e18` — 0.836% accrued over 72 days | `cast call SGHO convertToAssets(uint256) 1e18` |
| **sGho GHO balance vs `totalAssets()`** | **SHORTFALL — `balanceOf(sGho) = 136,261,440` < `totalAssets() = 136,466,586`; gap 205,146 GHO (0.15%)** | `cast call GHO balanceOf(SGHO)` |
| sGho implementation unchanged | **Yes** — EIP-1967 impl slot = [`0xff229a…7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04); no `Upgraded` event | `cast storage SGHO 0x3608…2bbc` |
| sGho ProxyAdmin owner | Aave Governance Executor L1 ([`0x5300…192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) | `cast call ProxyAdmin owner()` |
| sGho role assignments changed? | **No** — zero `RoleGranted`/`RoleRevoked` events after the AIP-484 execution block | Etherscan `getLogs` on sGho |
| Steward `getRateConfig()` matches AIP (amp=0, float=0, fixed=425) | **Yes** — `(0, 0, 425)`; no `RateConfigUpdated` event ever emitted | `cast call SGHO_STEWARD getRateConfig()` |
| Steward `MAX_RATE` = 5000 bps | **Yes** | `cast call SGHO_STEWARD MAX_RATE()` |
| Steward `sGHO()` points to sGho proxy | **Yes** — returns `0xE175…ca1d` | `cast call SGHO_STEWARD sGHO()` |
| **GSM USDC underlying inventory** | **9.95 waEthUSDC** — `buyAsset()` (GHO → USDC) reverts above this size. `getAvailableUnderlyingExposure() = 174,999,990` (deposit direction unaffected) | `cast call GSM getAvailableLiquidity()` |
| GSM USDC frozen / seized | **No / No** — the exit route is exhausted, not administratively blocked | `getIsFrozen()`, `getIsSeized()` |
| GSM USDC fee strategy | **Changed 2026-05-23**: `0x73bf…3080` (7 bps buy) → [`0x06fb…AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1) (10 bps buy, 0 bps sell), executed by the GHO Risk Council Safe | [`FeeStrategyUpdated` tx](https://etherscan.io/tx/0xd47810e272039dea4b03d90a1352e9e405e9fee6fdd75b3fd8f733030d83f0d8) |
| GSM USDC exposure cap | **Unchanged at 175M** — no `ExposureCapUpdated` event | `cast call GSM getExposureCap()` |
| GSM `LIQUIDATOR_ROLE` | **Never granted** — zero `RoleGranted` logs for this role over full contract history | Etherscan `getLogs` on GSM |
| Legacy stkGHO | Separate contract, `totalSupply() = 42,030,438` stkGHO — down from 216.75M in May as holders migrate | [`0x1a88…`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d) |
| GhoRouter deployment status | **Not deployed.** [PR #34](https://github.com/aave-dao/gho-origin/pull/34) open (unmerged, last commit 2026-06-29), no `GHO_ROUTER` in the Address Book, no router payload in `aave-proposals-v3`. TokenLogic was reimbursed 11,655 aEthLidoGHO for a *GhoRouter audit* in [AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md), so an audit has been commissioned but no report is public | [PR #34](https://github.com/aave-dao/gho-origin/pull/34), [AIP 492 report](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md) |
| sGho cross-chain (CCIP) live? | **No** — `TokenAdminRegistry.getPool(sGho)` returns the zero address on Ethereum. [ARFC Launch sGHO Cross-Chain](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) (June 24, 2026) is at ARFC stage with no Snapshot or AIP | `cast call 0xb227…5Cb6 getPool(address)` |
| Aave bug bounty (Immunefi) sGho coverage | **Still not enumerated** (re-checked July 27, 2026). "Sub-systems of GHO" covers: GHO stablecoin, GHO reserve of Aave Pool, GHO FlashMinter, GSM/GSM4626, CCIP GHO bridge, GHO stewards, GHO Remote Facilitators. sGho vault, sGho Steward, and GhoRouter are not listed | [Immunefi Aave scope](https://immunefi.com/bug-bounty/aave/scope/) |

**Conclusion:** the sGho contract itself is operating exactly to the AIP-484 specification — no parameter, role, or implementation change in 72 days. The two degradations are in the surrounding system: the DAO-side funding of the yield obligation has lapsed, and the GSM USDC exit inventory has been consumed by other market participants.

## Audits and Due Diligence Disclosures

### GHO Ecosystem Audits (12+ since 2022)

GHO is one of the most extensively audited DeFi stablecoin systems:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| OpenZeppelin | Aug 2022 | GHO Token v1 | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2022-08-12_Openzeppelin-v1.pdf) |
| OpenZeppelin | Nov 2022 | GHO Token v2 | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2022-11-10_Openzeppelin-v2.pdf) |
| ABDK | Mar 2023 | GHO Core | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2023-03-01_ABDK.pdf) |
| Sigma Prime | Jun 2023 | GHO Steward | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2023-06-13_GhoSteward_SigmaPrime.pdf) |
| Sigma Prime | Jul 2023 | GHO Core | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2023-07-06_SigmaPrime.pdf) |
| Stermi | Sep 2023 | GSM | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2023-09-20_GSM_Stermi.pdf) |
| Sigma Prime | Oct 2023 | GSM | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2023-10-23_GSM_SigmaPrime.pdf) |
| Certora | Mar 2024 | GHO Steward V2 | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2024-03-14_GhoStewardV2_Certora.pdf) |
| Certora | Jun 2024 | Upgradeable GHO | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2024-06-11_UpgradeableGHO_Certora.pdf) |
| Certora | Sep 2024 | Modular GHO Stewards | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2024-09-15_ModularGhoStewards_Certora.pdf) |
| Certora | Jul 2025 | Remote GSM | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2025-07-15_RemoteGSM_Certora.pdf) |
| **Certora** | **Sep 2025** | **sGHO Vault** | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2025-09-09_sGHO_Certora.pdf) |
| TokenLogic Collaborative | Mar 2026 | sGHO + sGhoSteward | [PDF](https://github.com/TokenLogic-com-au/gho-origin/blob/b30f973f99fd6eb7a9f343b4681dae88f58007ef/audits/2026.03.04%20-%20Final%20-%20TokenLogic%20Collaborative%20Audit%20Report%201772584390.pdf) |

### sGHO-Specific Audit: Certora (September 2025)

- **Auditor:** Certora
- **Dates:** September 3-8, 2025
- **Scope:** `sGho.sol` in aave-dao/gho-origin
- **Findings:**
  - **0 Critical, 0 High, 0 Medium**
  - **1 Low (L-01):** Users can DoS vault actions by triggering `maxAction()` requires — Status: **Acknowledged**
  - **1 Informational (I-01):** Lack of pausability mechanism — Status: **Fixed** (pausability added)
- **Formal verification:** Certora ran multiple formal verification proof suites covering sGHO, stewards, GHO token, GSM, and ERC-4626 compliance

### TokenLogic Collaborative Audit (February 2026, report dated March 4, 2026)

- **Facilitated through:** Sherlock collaborative audit program (Blackthorn)
- **Dates:** February 24 - 26, 2026
- **Lead Security Experts:** `0x52`, `pkqs90`
- **Audited Commit:** `f46868277c5e8b715cb33dcd6564e98cb73d064f`
- **Final Commit (post-fixes):** `646ab32b290b0dd34934c867a69b26579a9b3ef4`
- **Scope:** `src/contracts/sgho/sGho.sol`, `src/contracts/sgho/interfaces/IsGho.sol`, `src/contracts/misc/sGhoSteward.sol`, plus 12 test files under `tests/unit/` and `tests/misc/`. **No GhoRouter files are listed in scope**
- **Findings:** **0 High, 0 Medium, 2 Low/Info** — both **RESOLVED** (not merely acknowledged)
  - **I-1 [RESOLVED]:** Configured 50% target rate realizes ~64.87% annual yield under frequent updates. Root cause: `_getCurrentYieldIndex()` applies a linear step over elapsed time, but `_update()` runs on every share movement (deposit/withdraw/transfer), so the step compounds intra-year. With `newRate=5000` and 12-second updates, `yearly_factor = step_factor^(2,628,000) ≈ 1.6487`
  - **I-2 [RESOLVED]:** Role documentation and code mismatch. Pause is enforced in `_update()`, so it also blocks `transfer()`/`transferFrom()` (not only deposits/withdrawals). `YIELD_MANAGER_ROLE` can also call `setSupplyCap()`, not only `setTargetRate()`
- **Note:** Router-specific risk must be assessed separately — this audit does not cover `GhoRouter.sol`

### GhoRouter Audit Status

A GhoRouter audit has been **commissioned and paid for but not published**. [AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md) (May/June 2026 funding update) transfers **11,655 aEthLidoGHO to TokenLogic** ([`0xAA08…9894`](https://etherscan.io/address/0xAA088dfF3dcF619664094945028d44E779F19894)) explicitly "for the GhoRouter audit reimbursement". No audit report for `GhoRouter.sol` appears in `gho-origin/audits/` and [PR #34](https://github.com/aave-dao/gho-origin/pull/34) remains unmerged. Treat the router as **unaudited from a public-evidence standpoint** until a report is published.

### Aave V3 Platform Audits

The broader Aave V3 platform (which sGHO integrates with for GSM and governance) has been audited extensively:

- Sherlock: Aave V3.3 contest ($230K prize pool, Jan 2025)
- Multiple prior audits from OpenZeppelin, Trail of Bits, SigmaPrime, Certora, and others

### Bug Bounty

- **Aave on Immunefi:** Active bug bounty covering GHO sub-systems. Max payout: **$1,000,000** (Critical)
  - Scope explicitly includes: GHO Token, GSM, stkGHO, GHO FlashMinter, CCIP bridge, stewards
  - Reward tiers: Critical $50K-$1M, High $10K-$75K, Medium $10K, Low $1K
  - Link: https://immunefi.com/bug-bounty/aave/
- **Note:** sGho vault is **still not** in Immunefi scope (re-checked July 27, 2026 — Aave Immunefi "Sub-systems of GHO" enumerates GHO stablecoin, GHO reserve of the Aave Pool, GHO FlashMinter, GSM/GSM4626, CCIP GHO bridge, GHO stewards, and GHO Remote Facilitators; sGho vault, sGho Steward, and any future GhoRouter are not listed). A $136M vault sitting outside the enumerated bounty scope is a material gap. Reassess scope after each Immunefi update

### LlamaRisk Analysis

LlamaRisk published multiple analyses supporting sGHO but flagging key risks:

- **Arbitrage risk:** If ASR significantly exceeds GHO borrow rates, users could borrow-and-deposit for risk-free profit
- **Peg vulnerability:** Large sGHO withdrawals could pressure GHO stability
- **Index rate feedback loop:** High sGHO adoption via GSMs could depress USDC supply rates
- **Regulatory concerns:** sGHO does not meet EU MiCA, Singapore, or UAE stablecoin requirements (MiCA explicitly prohibits interest on stablecoins)
- Sources: [ARFC Analysis](https://llamarisk.com/research/2025-04-11t20-52-28-000z), [Legal Analysis](https://llamarisk.com/research/2025-03-26t17-58-30-000z)

## Security Deep-Dive: Admin Powers & Rug Vectors

### sGHO Vault — Can Admin Steal Funds?

| Vector | Possible? | Details |
|--------|-----------|---------|
| **Mint sGHO shares out of thin air** | **No** (in current implementation) | No admin mint function. All minting requires depositing GHO via standard ERC-4626 `deposit()`/`mint()` |
| **Drain GHO from vault** | **No** (in current implementation) | `TOKEN_RESCUER_ROLE` explicitly **cannot** rescue GHO — `maxRescue()` returns 0 for the underlying asset (hardcoded) |
| **Upgrade implementation to steal funds** | **YES** | TransparentUpgradeableProxy — the ProxyAdmin owner can replace the implementation with arbitrary code. **This is the primary rug vector.** Gated by Aave DAO governance |
| **Freeze all user funds via pause** | **YES** | `PAUSE_GUARDIAN_ROLE` can call `pause()`, blocking ALL deposits, withdrawals, and transfers. Admin functions (`setTargetRate`, `setSupplyCap`, `emergencyTokenTransfer`) continue to work while paused |
| **Set yield rate to 0 (steal future yield)** | **YES** (future yield only) | `YIELD_MANAGER_ROLE` can set rate to 0. **Accrued yield is preserved** — `_updateYieldIndex()` is called before rate change, permanently recording all yield up to that moment. Only future accrual stops |
| **Set supply cap to 0 (block deposits)** | **YES** | `YIELD_MANAGER_ROLE` can set cap to 0. Blocks new deposits but does **not** affect existing depositors' ability to withdraw |
| **Donation attack** | **Not possible** | `totalAssets()` is computed from `totalSupply() * yieldIndex`, NOT from actual GHO balance. Donating GHO does not affect share pricing |

**sGho Roles (Verified On-Chain, July 27, 2026, block 25,622,129):**

| Role | Power | Holder (verified via `hasRole`) |
|------|-------|-----------------|
| `DEFAULT_ADMIN_ROLE` (`0x00…00`) | Grant/revoke all roles, full role management | Aave Governance Executor L1 ([`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) |
| `YIELD_MANAGER_ROLE` (`0x470f…fe27`) | `setTargetRate()` (max 50% APR), `setSupplyCap()` | sGho Steward ([`0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757`](https://etherscan.io/address/0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757)) |
| `PAUSE_GUARDIAN_ROLE` (`0x3bb1…21dd`) | `pause()`, `unpause()` — freezes all token operations | Aave Protocol Guardian ([`0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30`](https://etherscan.io/address/0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30)) **and** Aave Governance Executor L1 |
| `TOKEN_RESCUER_ROLE` (`0xbf63…9c06`) | `emergencyTokenTransfer()` — can rescue any token EXCEPT GHO | Aave Governance Executor L1 ([`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) |

No `RoleGranted` or `RoleRevoked` event has been emitted on sGho since the AIP-484 execution block (25,109,406).

**sGho Steward Roles (Verified On-Chain, July 27, 2026, block 25,622,129):**

| Role | Power | Holder(s) |
|------|-------|-----------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke steward sub-roles | Aave Governance Executor L1 ([`0x5300…192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) — Risk Council does **not** hold this |
| `FIXED_RATE_MANAGER_ROLE` (`0x9720…1e0e`) | Update `fixedRate` component of `targetRate` | Aave Governance Executor L1 **AND** GHO Risk Council Safe ([`0x8513e6F37dBc52De87b166980Fa3F50639694B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60)) (3-of-4) |
| `SUPPLY_CAP_MANAGER_ROLE` (`0xd80d…6c04`) | Update `supplyCap` on sGho | Aave Governance Executor L1 **AND** GHO Risk Council Safe |
| `AMPLIFICATION_MANAGER_ROLE` (`0xf8fb…6f6a`) | Update `amplification` component | GHO Risk Council Safe (Executor L1 has DEFAULT_ADMIN and can self-grant if needed) |
| `FLOAT_RATE_MANAGER_ROLE` (`0xdfb8…50d2`) | Update `floatRate` component | GHO Risk Council Safe |

**Consequence:** the GHO Risk Council 3-of-4 Safe can change `fixedRate` (the ASR), the supply cap, and the floatRate/amplification components **without a full DAO vote**, subject only to the `MAX_RATE` cap of 50% APR enforced inside sGho's `setTargetRate`. There is no per-second/per-day rate-limit on the Steward itself — the rate-limited stewardship pattern applies to `GhoGsmSteward`, not `sGhoSteward`. The Risk Council can in principle set `fixedRate` anywhere in `[0, 5000]` bps in a single Safe execution. It has not exercised this authority: `sGhoSteward` has never emitted a `RateConfigUpdated` event.

The Risk Council **has** exercised its parallel GSM authority: on May 23, 2026 it swapped the GSM USDC fee strategy from `0x73bf…3080` to [`0x06fb…AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1), raising the buy (exit) fee from 7 bps to 10 bps ([tx `0xd47810…f0d8`](https://etherscan.io/tx/0xd47810e272039dea4b03d90a1352e9e405e9fee6fdd75b3fd8f733030d83f0d8)). This is a within-rate-limit steward action, but it demonstrates that the exit cost is a live, multisig-adjustable parameter.

**Mitigations:** (a) the `MAX_RATE = 5000` bps constant caps the worst case; (b) Safe execution emits `RateConfigUpdated`/`SupplyCapUpdated` events that are easy to monitor; (c) DEFAULT_ADMIN (Executor L1) can revoke Risk Council roles via a DAO vote if abuse is observed.

### GSM USDC — Can Admin Steal Funds?

| Vector | Possible? | Details |
|--------|-----------|---------|
| **Seize all waEthUSDC** | **YES** (but gated) | `seize()` sends all waEthUSDC to GHO Treasury. Requires `LIQUIDATOR_ROLE`, which has **never been granted** (zero `RoleGranted` logs for the role over full contract history). Aave Governance can grant this role and then call seize. Irreversible — permanently disables the GSM. Currently near-moot: the GSM holds only 9.95 waEthUSDC |
| **Freeze swaps (trap funds)** | **YES** | `SWAP_FREEZER_ROLE` can call `setSwapFreeze(true)`. Both Aave Governance and the ChainlinkOracleSwapFreezer hold this role. Freezes both `buyAsset` and `sellAsset` |
| **Auto-freeze on USDC depeg** | **YES** (automatic) | OracleSwapFreezer freezes swaps if USDC price falls outside [$0.99, $1.01]. Unfreezes when price returns to [$0.995, $1.005]. In a permanent depeg, funds could be trapped indefinitely |
| **Change fee to extract value** | **YES** (rate-limited, and exercised) | `CONFIGURATOR_ROLE` can call `updateFeeStrategy()`. The GhoGsmSteward is rate-limited to **+/- 0.5%/day** using the FixedFeeStrategyFactory (max 50% per strategy). Governance can deploy any fee strategy. The Risk Council raised the buy fee 7 bps → 10 bps on May 23, 2026 |
| **Upgrade implementation** | **YES** | TransparentUpgradeableProxy — ProxyAdmin owned by Aave Governance Executor. Can replace implementation with arbitrary code |
| **Rescue underlying tokens** | **Protected** | `TOKEN_RESCUER_ROLE` (currently unassigned) can rescue only surplus waEthUSDC above `_currentExposure` — user funds are protected in code |

**GSM USDC Roles (verified on-chain):**

| Role | Holder | Identity |
|------|--------|----------|
| `DEFAULT_ADMIN_ROLE` | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A) | Aave Governance Executor L1 |
| `CONFIGURATOR_ROLE` | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A), [`0xD1E856a947CdF56b4f000ee29d34F5808E0A6848`](https://etherscan.io/address/0xD1E856a947CdF56b4f000ee29d34F5808E0A6848) | Aave Governance + GhoGsmSteward |
| `SWAP_FREEZER_ROLE` | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A), [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Aave Governance + OracleSwapFreezer |
| `TOKEN_RESCUER_ROLE` | Unassigned | — |
| `LIQUIDATOR_ROLE` | Unassigned (never granted) | — |

Verified July 27, 2026 via `hasRole` against every governance address in this report, plus a full-history `RoleGranted` log scan on the GSM (zero events since block 25,100,000, zero for `LIQUIDATOR_ROLE` over all history).

### GhoRouter — Can Admin Steal Funds?

| Vector | Possible? | Details |
|--------|-----------|---------|
| **Add malicious GSM to allowlist** | **YES** | Owner can call `setGsmAllowed()` with a malicious contract that passes basic validation (`GHO_TOKEN()` matches, `UNDERLYING_ASSET()` exists). Users calling swap functions through this malicious GSM could lose their tokens |
| **Drain user wallets** | **No** | Router cannot pull tokens users haven't approved for that specific call |
| **Rescue stranded tokens** | **YES** | Owner can call `rescueToken()` to transfer any ERC-20 held by the router to any address. The router is intended to avoid persistent balances, but stranded tokens remain an owner-controlled recovery path |
| **Pause the router** | **No** | No pause mechanism exists on the router itself. GSM paths can be disabled by removing GSMs from allowlist, and direct GHO↔sGHO paths can still fail if sGHO is paused |

**GhoRouter status (re-verified July 27, 2026): still not deployed.** The powers above are read from the [PR #34](https://github.com/aave-dao/gho-origin/pull/34) draft source and describe what the router *would* be able to do — they are not live risk today. Current facts:

| Gate from [issue #194](https://github.com/yearn/risk-score/issues/194) | Status (July 27, 2026) |
|---|---|
| `GhoRouter` proposal in [`aave-proposals-v3/src`](https://github.com/aave-dao/aave-proposals-v3/tree/main/src) | **No** — a full recursive tree listing of the repo returns no `GhoRouter` path (the only `src/` matches for "router" are `CCIPChainRouters.sol`, unrelated CCIP routers) |
| `GHO_ROUTER` entry in [`GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol) | **No** — the library lists `SGHO`, `SGHO_STEWARD`, GSMs, stewards, reserve, and facilitators; no router constant |
| [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) merged **and** deployed on mainnet | **No** — PR is open and unmerged; latest commit `7cb687d5` ("use token to stata mapping", June 29, 2026); branch last touched July 24, 2026. It has left draft status and now carries a full unit-test suite (`TestGhoRouterSwap`, `TestGhoRouterRescueToken`, `TestGhoRouterPausable`, …), so it is actively progressing |
| Aave Immunefi scope includes `GhoRouter` | **No** — "Sub-systems of GHO" does not enumerate any router |

One thing **has** changed: [AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md) reimbursed TokenLogic 11,655 aEthLidoGHO for a **GhoRouter audit**, and the PR now includes a `docs/gho-router.md` and pausability tests that were absent from the original draft. Deployment therefore looks more likely than it did in May, but nothing is on-chain.

**Yearn's USDC → sGho strategy must therefore continue to compose USDC → waEthUSDC → GHO → sGho manually.** Even once deployed, the router would not change the economics: it wraps `GSM.sellAsset()`/`buyAsset()` calls, so the 10 bps exit fee and the GSM's exhausted underlying inventory both apply identically. Reassess the router's admin surface (`setGsmAllowed`, `rescueToken`, pause) when a payload actually deploys it.

## Critical Design Characteristic: Virtual/Unfunded Yield

**sGho's yield is accounting-based, not strategy-based.** This is fundamentally different from most ERC-4626 vaults:

1. The `yieldIndex` grows over time at `ratePerSecond`, making each sGho share worth more GHO. `totalAssets()` is defined as `_convertToAssets(totalSupply())` (sGho.sol:243-245) — it is a **pure function of shares × index and never reads the contract's GHO balance**
2. The actual GHO to back this growing obligation **must be transferred into the vault by the Aave DAO** from protocol revenue
3. If the vault is not topped up, withdrawals become **first-come-first-served** — `maxWithdraw(owner) = min(super.maxWithdraw(owner), IERC20(GHO).balanceOf(sGho))` (sGho.sol:197-205). The single-owner cap is the vault's *entire* GHO balance, not a pro-rata share
4. There is **no mechanism to automatically mint GHO** to cover the yield, and no on-chain schedule, escrow, or keeper that enforces funding
5. The yield index grows independently of the actual GHO balance in the contract

### Who actually funds it, and how well

Enumerating every GHO `Transfer` into sGho since launch (1,873 inbound transfers) and matching them against the vault's 1,867 `Deposit` events isolates the transfers that added GHO **without** minting shares — i.e. the yield funding. There are exactly six, all from the **Aave Finance Committee (AFC) Safe** ([`0x22740deBa78d5a0c24C58C740e3715ec29de1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa), `MiscEthereum.AFC_SAFE`, 2-of-3):

| Date | Amount (GHO) | Tx |
|---|---|---|
| 2026-05-17 | 40,000 | [`0x66184c…8792`](https://etherscan.io/tx/0x66184c2b22f33dc4f3fa7070f32e2647dc2a48db5ae4d5e9c6527fa5bf08b792) |
| 2026-05-26 | 100,000 | [`0xbf2c34…f28a7`](https://etherscan.io/tx/0xbf2c34c0eec3aa8c12b25c11fc475e33a198e81ff5a470155fa993d8034f28a7) |
| 2026-06-04 | 150,000 | [`0xf1fa6e…1863`](https://etherscan.io/tx/0xf1fa6e7e419d1c70e1b39f85f32f5b90c6689b18ae2413221409829ee6b17863) |
| 2026-06-18 | 250,000 | [`0xed6919…f08c42`](https://etherscan.io/tx/0xed69196deb1f63d27362bbef0f8a9d3c61e8e570f7ac58948cbcf40147f08c42) |
| 2026-06-25 | 150,000 | [`0x3333cd…73fd`](https://etherscan.io/tx/0x3333cd52c0f55fca91ade84249836424aa6d11983a578fba8052b19e12ad73fd) |
| 2026-06-29 | 150,000 | [`0x3c049b…c9f5`](https://etherscan.io/tx/0x3c049b8e025fc7dd77c5e1f41c0bebee155be96c728697aa106b1f1efbcbc9f5) |
| **Total** | **840,000** | |

No GHO has ever reached sGho from the Aave Collector ([`0x464C…6e18c`](https://etherscan.io/address/0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c)) or the Governance Executor L1 directly — the AFC Safe is the sole funding path.

### Current funding position (July 27, 2026, block 25,622,129)

| Quantity | Value (GHO) | Derivation |
|---|---|---|
| `totalAssets()` (obligation) | 136,466,586.27 | `cast call SGHO totalAssets()` |
| `GHO.balanceOf(sGho)` (actual) | 136,261,439.78 | `cast call GHO balanceOf(SGHO)` |
| Net principal (Σ `Deposit` − Σ `Withdraw` assets) | 135,421,439.78 | 289,147,643.95 in − 153,726,204.17 out |
| Yield obligation accrued since launch | 1,045,146.49 | `totalAssets` − net principal |
| Yield funded by AFC | 840,000.00 | six transfers above |
| **Unfunded yield** | **205,146.49** | **19.63% of accrued yield; 0.15% of `totalAssets`** |

The deficit grows at `totalAssets × 4.25% / 365` ≈ **15,890 GHO/day** and has been growing continuously for **28 days** since the last top-up — the longest unfunded stretch since launch (previous intervals between top-ups were 4–14 days). The balance has crossed below `totalAssets()` twice before (around June 12 and again from mid-July onward); the first episode was cured by the June 18 transfer.

**How bad is it right now?** The identity `balance = net principal + AFC funding` holds exactly, so the pre-withdrawal balance exceeds aggregate net deposits by 840,000 GHO. But the contract does not segregate that accounting surplus from principal or distribute the shortfall pro rata. The current 205,146 GHO deficit means not every indexed claim can be paid; after early redeemers take their full claims, the unpaid tail can include the last holders' original deposits. The aggregate amount missing is 0.15% of claims, but it can already be concentrated as principal loss on a much smaller cohort.

**The mechanism that makes it dangerous is unchanged.** Because `maxWithdraw` lets a single owner extract up to the *full* GHO balance (capped only by the vault total, not by a fair-share-of-shortfall), **early redeemers take their full virtual entitlement out of the shared GHO pool, and the residual is borne entirely by whoever is last**. Any positive shortfall can therefore reach a late redeemer's principal; the 840,000 GHO of historical AFC funding is not a protected cushion or an impairment threshold.

Illustrative worst case: 100 users each deposit 1 GHO at index 1.0. `yieldIndex` grows to 1.1 (10% virtual accrual) with no top-up — vault holds 100 GHO against 110 GHO of claims. If users 1–90 redeem first they each take 1.1 GHO (99 GHO drained). Users 91–100 then share the remaining 1 GHO — 0.1 GHO each, a **90% principal loss**.

**Implications for Yearn:**
- The funding is discretionary, manual, unscheduled, and controlled by a **2-of-3 multisig**. There is no contract-enforced obligation, no escrow, and no rate limit on how long it can lapse
- `IERC20(GHO).balanceOf(sGho) < totalAssets()` is not a hypothetical monitoring trigger — it is the **current live state** and has been for roughly two weeks
- The right monitoring metric is not the boolean but the **ratio and its slope**: track `(totalAssets − balance) / totalAssets` and days-since-last-AFC-transfer. Today: 0.15% and 28 days
- A positive shortfall is already a principal-risk signal for a late redeemer. Monitor its size and slope to determine urgency; do not use the 840,000 GHO of historical AFC funding as an exit threshold
- A Yearn strategy holding a large share of sGho would be structurally *late* in any exit race, since unwinding a vault position is slower than an individual EOA redemption

## Historical Track Record

All on-chain numbers below from block 25,622,129 (2026-07-27 05:43 UTC) unless noted.

- **sGho vault:** **Live since May 16, 2026 (AIP 484 execution) — 72 days of production history, no incidents.** `totalAssets() = 136,466,586 GHO` (~$136.3M at a GHO price of $0.9990), `totalSupply() = 135,335,406` shares. `convertToAssets(1e18) = 1.008358e18` → 0.836% accrued (`ratePerSecond` of `1.347666e18` RAY corresponds to 4.25% simple APR per spec; ~4.34% continuously compounded). The contract was deployed on May 5, 2026 and became operational when AIP 484 wired up the roles and supply cap on May 16. 1,867 deposits and 951 withdrawals processed
- **sGho funding:** 840,000 GHO of yield backing transferred in by the AFC Safe across six transactions (May 17 – June 29, 2026); 205,146 GHO of accrued yield currently unbacked
- **GHO stablecoin:** Launched July 2023 — **~3.0 years** in production
- **GHO mainnet supply:** 649.0M GHO (on-chain `totalSupply()`) — up from 584.0M in May as sGho demand pulled GHO through the GSMs
- **GHO market price:** $0.9990 ([DeFiLlama](https://coins.llama.fi/prices/current/ethereum:0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f)) — a small discount consistent with the GSM USDC redemption route being exhausted
- **GSM USDC:** Operational but drained. `getAvailableLiquidity() = 9.95` waEthUSDC against a 175M exposure cap; `getAvailableUnderlyingExposure() = 174,999,990`; `getUsed() = 11.71` GHO of a 210M facilitator limit; not frozen, not seized. Inventory fell from 111.25M waEthUSDC on May 19 to ~27 by June 12 and has sat at ~10 ever since — roughly six weeks with no GHO → USDC redemption capacity
- **GSM USDT:** `getAvailableLiquidity() = 43.42M` waEthUSDT against an 85M exposure cap; `getUsed() = 50.79M` GHO of a 100M limit; not frozen. This is currently the only GSM route with meaningful exit depth
- **GHO Reserve (GSM facilitator):** GHO balance = **259.21M** — the pre-minted pool available to GSMs is ample; the GSM constraint is underlying-asset inventory, not GHO
- **Legacy stkGHO:** Holds **42.03M stkGHO**, down from 216.75M in May — roughly 175M has exited legacy staking over the period, consistent with migration into sGho. Still on the legacy staking implementation (no proxy upgrade; sGho was launched as a separate ERC-4626 contract)
- **Aave V3 USDC market:** aEthUSDC holds 230.01M USDC of underlying liquidity — the final `waEthUSDC → USDC` unwrap leg is unconstrained today (`waEthUSDC.convertToAssets(1e6) = 1.179842` USDC)
- **Aave protocol:** One of the largest DeFi protocols, ~$14.67B Aave V3 TVL ([DeFiLlama](https://defillama.com/protocol/aave), July 27, 2026; range $12.8B–$14.7B over the past 30 days), live since January 2020 (~6.5 years)
- **Security incidents (GHO):** No known exploits on GHO token, GSM, sGho, or stkGHO
- **Security incidents (Aave):** Aave V3 has not been exploited. Historical V1/V2 incidents exist but are not relevant to the V3 architecture

## Funds Management

### Strategy Pipeline: USDC → sGHO

**Step 1: USDC → waEthUSDC**

USDC is deposited into the Aave V3 USDC market and wrapped as waEthUSDC ([`0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E)), a staticAToken (ERC-4626) that represents an Aave V3 USDC supply position.

**Step 2: waEthUSDC → GHO (via GSM USDC)**

waEthUSDC is sold to the GSM USDC ([`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112)) at a fixed 1:1 price (FixedPriceStrategy, no oracle). The GSM draws GHO from the GHO Reserve ([`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9)) and transfers it to the caller. Sell fee: 0 bps. Deposit-direction headroom is currently the full 175M cap.

**Step 3: GHO → sGHO (deposit)**

GHO is deposited into the sGHO ERC-4626 vault. Shares are issued based on the current `yieldIndex`. No fee.

**Withdrawal pipeline:** Reverse path (sGHO → GHO → waEthUSDC → USDC), GSM buy fee 10 bps. **Step 2 of this path is currently blocked**: GSM USDC holds 9.95 waEthUSDC, so `buyAsset()` reverts with `INSUFFICIENT_AVAILABLE_EXOGENOUS_ASSET_LIQUIDITY` (Gsm.sol `_buyAsset`) for any size above that. See *Liquidity Risk* for the working alternatives.

> **Shared-pool caveat.** The GSM's underlying inventory (`_currentExposure`) is a single shared pool. Depositing via `sellAsset` raises it and creates exit capacity, but grants the depositor **no reserved claim** — any other participant can consume that capacity with `buyAsset`. A strategy that sizes its exit on the capacity its own deposit created is exposed to exactly the drain that emptied the GSM between May 19 and June 12, 2026.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit GHO and receive sGHO shares (ERC-4626). Subject to supply cap (400M GHO; 136.5M used, 263.5M headroom)
- **Withdrawals:** Permissionless, atomic, no cooldown. Capped by actual GHO balance in vault (see Virtual Yield section above) — 136.26M GHO available today
- **GSM:** Permissionless — `sellAsset` and `buyAsset` available to anyone. Subject to exposure cap (175M waEthUSDC) and, on the `buyAsset` side, to available inventory. Can be frozen by oracle or governance
- **Fees:** 0% on sGHO deposit/withdrawal. 0 bps GSM sell fee (waEthUSDC → GHO). 10 bps GSM buy fee (GHO → waEthUSDC)

### Collateralization

- **sGHO:** GHO deposited remains in the contract — **no rehypothecation**. The pre-withdrawal balance exceeds aggregate net deposits (`balanceOf(sGho) = 136.26M` vs net principal deposits of 135.42M), but withdrawals do not preserve that surplus for late users: the current **205,146 GHO shortfall** can already be concentrated as principal loss on the last redeemers. Yield backing depends on discretionary AFC Safe transfers and is 19.6% short
- **GSM USDC:** Holds waEthUSDC (wrapped Aave USDC supply position). Each waEthUSDC is redeemable for USDC from Aave V3 (subject to Aave V3 liquidity, currently 230.01M USDC). Present waEthUSDC inventory: **9.95**
- **GSM USDT:** 43.42M waEthUSDT — the deepest currently available GSM redemption route for GHO
- **No leverage** in the pipeline
- **GHO itself:** Backed by over-collateralized Aave V3 loans and GSM stablecoin reserves; 649.0M mainnet supply

### Provability

- **sGHO exchange rate:** On-chain via ERC-4626 `convertToAssets()`/`convertToShares()`. Computed from `yieldIndex`, fully deterministic
- **sGHO actual backing:** `IERC20(GHO).balanceOf(sGHO)` shows actual GHO in vault. Compare to `totalAssets()` to detect any shortfall — this comparison is the only way to see the gap, since `totalAssets()` never reads the balance
- **Yield funding history:** fully reconstructible on-chain by differencing GHO `Transfer` logs into sGho against the vault's `Deposit` events (the residual is AFC funding). No protocol-side accounting surfaces it
- **GSM exposure:** `getAvailableLiquidity()`, `getAvailableUnderlyingExposure()`, `getUsed()`, and `getLimit()` readable on-chain
- **GSM fees:** `getBuyFee()` / `getSellFee()` readable on-chain from the strategy returned by `getFeeStrategy()` (not from the Address Book, which is stale for this GSM)
- **GHO Reserve balance:** On-chain verifiable at [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9)

## Liquidity Risk

**Leg 1 — sGho → GHO: atomic but under-funded.** ERC-4626 `withdraw()`/`redeem()` has no cooldown or queue, but the vault holds 136.26M GHO against 136.47M of claims. Early redeemers can exit in full; the 0.15% aggregate deficit is allocated to the last claims and can include those holders' principal.

**Leg 2 — GHO → stablecoin: materially impaired.** This is where the exit constraint now sits:

| Route | Observed liquidity (July 27, 2026) | Cost | Notes |
|---|---|---|---|
| **GSM USDC** `buyAsset` | **9.95 waEthUSDC** | 10 bps | Effectively dead. Reverts with `INSUFFICIENT_AVAILABLE_EXOGENOUS_ASSET_LIQUIDITY` above inventory. Not frozen, not seized — drained by other participants between May 19 and June 12, 2026 and flat at ~10 since |
| **GSM USDT** `buyAsset` | **43.42M waEthUSDT** (85M cap) | 10 bps | The deepest working route, but exits to **USDT**, not USDC — a USDC-denominated strategy pays an additional USDT→USDC conversion |
| Fluid DEX GHO-USDC | ~$15.8M aggregate pool TVL | swap fee + slippage | Largest direct GHO→USDC venue by reported TVL ([DeFiLlama yields](https://yields.llama.fi/pools)); TVL is not executable USDC capacity |
| Uniswap v4 GHO-USDC | ~$3.0M aggregate pool TVL | swap fee + slippage | TVL is not executable USDC capacity |
| Curve GHO-crvUSD | ~$1.6M aggregate pool TVL | swap fee + slippage | Routes via crvUSD, not USDC |
| Uniswap v3 GHO-USDC | ~$0.2M aggregate pool TVL | swap fee + slippage | TVL is not executable USDC capacity |

The direct GHO→USDC pools report roughly **$19M of aggregate TVL** against a $136M vault, but that figure includes both sides of each pool and cannot be treated as $19M of withdrawable USDC. Executable exit capacity depends on reserve composition, concentrated-liquidity ranges, trade size, and acceptable slippage; it must be measured with route-specific quotes. The only deterministic large fallback observed here is the 43.42M waEthUSDT in GSM USDT, which still requires a USDT→USDC conversion.

**Why the GSM emptied.** `sellAsset` (USDC → GHO) raises `_currentExposure`; `buyAsset` (GHO → USDC) lowers it. Between mid-May and mid-June, GHO holders redeemed roughly 111M waEthUSDC out of the module — plausibly the same flow that unwound ~175M of stkGHO. The module refills only when someone finds it profitable to sell USDC into it, which requires GHO to trade at or above $1 net of fees. GHO is at **$0.9990**, so the refill incentive is currently absent. This is a self-reinforcing state, not a transient one.

**Other liquidity factors:**

- **GSM freeze risk:** Oracle auto-freezes if USDC depegs outside [$0.99, $1.01]. Manual freeze possible by governance. During freeze, no `buyAsset` or `sellAsset`. Currently `getIsFrozen() = false` — the exit blockage is inventory exhaustion, not a freeze
- **GSM buy fee:** 10 bps (0.10%). At the 4.25% ASR, breakeven against simply holding USDC requires holding sGho for ≥ **~8.6 days**
- **Aave V3 USDC market:** the final `waEthUSDC → USDC` unwrap is unconstrained today (230.01M USDC of underlying liquidity), though Aave V3 USDC has previously pinned near 100% utilization
- **Deposit limit:** 400M GHO supply cap on sGho (263.5M headroom); 175M waEthUSDC exposure cap on GSM USDC (essentially all available on the deposit side)
- **Largest risk:** the strategy's documented USDC exit route is **already unavailable**, and re-opening it depends on third-party arbitrage flow that the current GHO price does not incentivise. A Yearn USDC strategy would need to either accept a USDT hop, accept DEX slippage, or hold GHO until GSM capacity returns

## Centralization & Control Risks

### Governance

sGHO and the GSM are governed through the **Aave DAO governance framework** — one of the most established on-chain governance systems in DeFi.

**Governance hierarchy:**

| Level | Entity | Power |
|-------|--------|-------|
| **Aave DAO** | On-chain governance (AAVE token voting) | Full control: upgrades, role changes, parameter changes, emergency actions |
| **Executor Level 1** ([`0x5300...`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) | Timelock executor | Executes passed proposals. DEFAULT_ADMIN on GSM and sGho |
| **GHO Risk Council** ([`0x8513...`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60)) | 3-of-4 multisig (verified July 27, 2026) | Parameter changes via steward contracts — rate-limited on GSMs, **not** rate-limited on sGhoSteward |
| **Aave Finance Committee (AFC)** ([`0x2274...`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa)) | **2-of-3 multisig** (verified July 27, 2026) | Sole funder of sGho's yield obligation. Discretionary, unscheduled, not enforced by any contract |
| **Protocol Guardian** ([`0x2CFe...`](https://etherscan.io/address/0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30)) | Emergency multisig | Pause capability |
| **OracleSwapFreezer** | Automated (Chainlink) | Auto-freeze GSM on USDC depeg |

**Rate-limiting on GHO Stewards:** The GhoGsmSteward contract limits CONFIGURATOR actions:
- Fee changes: max +/- 0.5% per update, 1-day minimum delay between updates
- Exposure cap changes: max +/- 100% of current value, 1-day delay
- Uses FixedFeeStrategyFactory (capped at <50% per fee)

**sGHO Steward (sGhoSteward):** Decomposes `YIELD_MANAGER_ROLE` into sub-roles:
- `AMPLIFICATION_MANAGER_ROLE`
- `FLOAT_RATE_MANAGER_ROLE`
- `FIXED_RATE_MANAGER_ROLE`
- `SUPPLY_CAP_MANAGER_ROLE`

### Upgradeability

| Contract | Upgradeable | Upgrade Authority |
|----------|-------------|-------------------|
| sGho Vault | **YES** (TransparentUpgradeableProxy) | Aave Governance Executor L1 (via ProxyAdmin [`0xc15700631020eba02317964550365b95a9a28adb`](https://etherscan.io/address/0xc15700631020eba02317964550365b95a9a28adb), `owner() = 0x5300…192A`). Implementation slot unchanged at [`0xff229a…7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04) |
| GSM USDC | **YES** (TransparentUpgradeableProxy) | Aave Governance Executor L1 (via ProxyAdmin [`0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21`](https://etherscan.io/address/0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21)). Implementation slot unchanged at [`0x320be9…7e8e`](https://etherscan.io/address/0x320be97b4d10b6d20a05cae53a479fa2a0187e8e) |
| GHO Token | **YES** (upgradeable) | Aave Governance |
| GhoRouter | N/A — not deployed | (Draft is non-upgradeable with an owner-managed GSM allowlist) |
| GHO Reserve | **YES** (TransparentUpgradeableProxy) | Aave Governance |

**All upgradeable contracts can have their implementation replaced by governance, which is the most powerful rug vector.** This is standard for Aave-governed contracts and relies on the trust assumption that Aave DAO governance (on-chain AAVE token voting with timelock) will not pass a malicious proposal.

### Programmability

| Factor | Assessment |
|--------|-----------|
| sGHO exchange rate | On-chain, algorithmic (yieldIndex-based), no admin input |
| sGHO yield rate | Set by YIELD_MANAGER_ROLE, max 50% APR (constant), updates index before changing |
| GSM price | Fixed 1:1 (immutable FixedPriceStrategy), no oracle manipulation possible |
| GSM fees | Set by CONFIGURATOR_ROLE, rate-limited via steward |
| GSM freeze | Automatic (oracle-based) or manual (SWAP_FREEZER_ROLE) |
| Vault operations | Permissionless ERC-4626 deposit/withdraw |

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Aave DAO Governance** | Critical | Controls all upgrades, roles, and emergency actions across sGHO, GSM, and GHO Token |
| **GHO Token** | Critical | The underlying asset. Upgradeable by governance |
| **AFC Safe (2-of-3)** | Critical | **Sole path by which yield backing enters the vault.** No contract enforces it; funding has lapsed for 28 days and 19.6% of accrued yield is unbacked |
| **GSM USDC** | Critical | USDC↔GHO conversion path. Upgradeable, freezeable, and currently exhausted on the exit side |
| **GSM USDT** | High | Currently the deepest working GHO exit route (43.42M), but exits to USDT |
| **GHO Reserve** | Critical | Pre-minted GHO pool for GSM operations. 259.21M GHO held — ample |
| **Aave V3 USDC Market** | Critical | waEthUSDC (underlying for GSM) is an Aave V3 supply position; 230.01M USDC of underlying liquidity |
| **GHO DEX liquidity** | High | With the GSM USDC route dry, direct GHO→USDC pools report ~$19M aggregate TVL, but executable USDC output is lower and size/slippage-dependent |
| **Chainlink Oracle** | Medium | Powers auto-freeze on GSM via OracleSwapFreezer. Oracle failure could cause incorrect freeze/unfreeze |
| **Aave DAO Revenue** | Medium | Ultimate source of the GHO that the AFC transfers into sGho. If revenue declines, yield backing could be insufficient |

## Operational Risk

- **Team:** Aave DAO — one of the most established DeFi protocols. Created by Aave Companies (formerly ETHLend), founded by Stani Kulechov in 2017. Publicly known team
- **Governance:** Fully on-chain Aave DAO governance with AAVE token voting. Established governance framework with multiple safety layers (guardian, stewards, timelocks)
- **Documentation:** Comprehensive Aave and GHO documentation. Source code verified on Etherscan (sGho implementation [`0xff229a…7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04) and GSM) and on GitHub
- **Legal:** GHO is a decentralized stablecoin governed by the Aave DAO. LlamaRisk flagged regulatory concerns under MiCA (EU prohibits interest on stablecoins) — potential legal risk for sGHO in regulated jurisdictions
- **Incident response:** Aave has a Protocol Guardian for emergency pauses. $1M Immunefi bug bounty (sGho not enumerated). Multiple steward contracts with rate-limited powers for rapid parameter adjustments without full governance votes
- **Yield-funding process:** This is the weakest operational link. Top-ups are ad-hoc Safe transactions with no published cadence, no on-chain commitment, and no public dashboard reporting the funding gap. The cadence has been irregular (4, 9, 9, 14, 7 days between the six transfers, then a 28-day gap), and no communication accompanies a lapse
- **GSM operations:** GSM USDC has had effectively zero exit inventory for roughly six weeks with no visible remediation (no treasury seeding, no sell-side refill incentive, no forum post located)
- **Track record:** Aave V3 has not been exploited. GHO has operated without security incidents since its July 2023 launch (~3.0 years); sGho has run 72 days without incident

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Monitor |
|----------|---------|---------|
| sGho Vault | [`0xE1753F2e00940cC31213dd92013cF019DFE4ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `totalAssets()`, `convertToAssets(1e18)` (PPS), `IERC20(GHO).balanceOf(sGho)` vs `totalAssets()` (funding gap), `targetRate()`, `paused()`, Deposit/Withdraw/TargetRateUpdated/Paused events |
| sGho Steward | [`0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757`](https://etherscan.io/address/0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757) | `getRateConfig()`, `RateConfigUpdated`/`SupplyCapUpdated`/`RoleGranted`/`RoleRevoked` events |
| **AFC Safe** | [`0x22740deBa78d5a0c24C58C740e3715ec29de1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa) | GHO `Transfer` logs with `to = sGho` — the yield top-ups. Alert on days-since-last-transfer; threshold + signer-count changes |
| GSM USDC | [`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `getAvailableLiquidity()` (**exit capacity — currently ~10**), `getAvailableUnderlyingExposure()`, `getUsed()`, `getLimit()`, `getIsFrozen()`, `getIsSeized()`, `getFeeStrategy()`, FeeStrategyUpdated events |
| GSM USDT | [`0x882285E62656b9623AF136Ce3078c6BdCc33F5E3`](https://etherscan.io/address/0x882285E62656b9623AF136Ce3078c6BdCc33F5E3) | `getAvailableLiquidity()` — the fallback exit route's remaining depth |
| GHO Reserve | [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9) | GHO balance, limit vs used for GSM USDC |
| GHO Risk Council | [`0x8513e6F37dBc52De87b166980Fa3F50639694B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60) | Signer/threshold changes |
| Oracle Swap Freezer | [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Freeze/unfreeze events |

### Critical Events to Monitor

- **sGHO funding gap** — `IERC20(GHO).balanceOf(sGHO) < totalAssets()`. Currently **true**; monitor the ratio `(totalAssets − balance) / totalAssets` and its slope, not just the boolean
- **AFC top-up lapse** — no GHO `Transfer` from the AFC Safe into sGho for > 21 days. Currently **28 days**
- **sGHO rate changes** — `TargetRateUpdated` event (yield rate changed by steward or governance)
- **sGHO pause/unpause** — `Paused`/`Unpaused` events
- **GSM exit capacity** — `getAvailableLiquidity()` on both GSMs. This is the metric that failed silently: no event fires when the module drains
- **GSM freeze** — `SwapFreeze` event (manual or oracle-triggered)
- **GSM seize** — `Seized` event (last resort, irreversible)
- **GSM fee changes** — `FeeStrategyUpdated` event (fired May 23, 2026 — 7 → 10 bps)
- **GSM exposure cap changes** — `ExposureCapUpdated` event
- **Proxy upgrades** — `Upgraded` event on any TransparentUpgradeableProxy
- **Role changes** — `RoleGranted`/`RoleRevoked` events on sGHO and GSM
- **GHO peg** — a sustained GHO price below $1 removes the arbitrage incentive that refills GSM exit inventory

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | sGHO | PPS tracking | Every 6 hours |
| `totalAssets()` | sGHO | Total yield obligations | Daily |
| `balanceOf(sGHO)` | GHO Token | Actual GHO in vault — **alert if the gap exceeds 1% of `totalAssets`** | Daily |
| GHO `Transfer(AFC → sGho)` logs | GHO Token | Days since last yield top-up — **alert at 21 days** | Daily |
| `getAvailableLiquidity()` | GSM USDC | waEthUSDC available for exit — **alert below the strategy's position size** | Every 6 hours |
| `getAvailableLiquidity()` | GSM USDT | Fallback exit depth | Daily |
| `getAvailableUnderlyingExposure()` | GSM USDC | Remaining deposit-side headroom | Daily |
| `getUsed()` / `getLimit()` | GSM USDC | GHO reserve usage / limit for this facilitator | Daily |
| `getFeeStrategy()` + `getBuyFee()` | GSM USDC | Live exit fee (do not read from the Address Book) | Daily |
| `getIsFrozen()` | GSM USDC | Swap freeze status | Every 6 hours |
| `getIsSeized()` | GSM USDC | Seize status | Daily |

## Risk Summary

### Key Strengths

- **Extensive audit coverage:** 12+ audits since 2022 by top firms (OpenZeppelin, Certora, Sigma Prime, ABDK). Certora formal verification. sGHO-specific audit found 0 critical/high/medium issues
- **Zero configuration drift in 72 days:** no rate change, no supply-cap change, no pause, no upgrade, no role grant or revocation on sGho or sGhoSteward since AIP 484 executed. Every AIP-484 parameter still matches spec on-chain
- **Aave DAO governance:** One of DeFi's most established on-chain governance systems. All critical operations require DAO vote with timelock. Rate-limited stewards for day-to-day parameter management
- **Simple sGHO design:** No rehypothecation, no external strategies, no leverage. GHO stays in the vault. Yield is purely accounting-based
- **No rehypothecation and an aggregate accounting surplus:** the vault's GHO balance (136.26M) exceeds net principal deposits (135.42M), although the first-come-first-served withdrawal logic means the live shortfall can still reach a late redeemer's principal
- **GHO ecosystem maturity:** GHO live since July 2023 (~3.0 years), GSMs operational, 649M mainnet supply, no security incidents. Migration out of legacy stkGHO is well advanced (216.75M → 42.03M)
- **Aave protocol backing:** ~$14.67B Aave V3 TVL platform (DeFiLlama, July 27, 2026), 6+ years of operation, $1M bug bounty
- **Token rescue protection:** sGHO `maxRescue()` returns 0 for GHO (underlying asset cannot be rescued by admin). GSM protects user funds tracked in `_currentExposure`
- **GSM dangerous roles never granted:** `LIQUIDATOR_ROLE` (seize) has zero `RoleGranted` events over the GSM's full history; `TOKEN_RESCUER_ROLE` is likewise unassigned

### High-Severity Issues

- **Yield obligation is under-funded, and funding is a discretionary 2-of-3 multisig action (HIGH):** `IERC20(GHO).balanceOf(sGho) = 136,261,440` against `totalAssets() = 136,466,586` — a **205,146 GHO shortfall**, equal to **19.6% of all yield accrued since launch**, widening at ~15,890 GHO/day. The only funding path is manual GHO transfers from the AFC Safe ([`0x2274…1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa), 2-of-3); the last one was **June 29, 2026 — 28 days ago**, the longest lapse since launch. No contract enforces, schedules, or escrows this funding. Implications for Yearn:
  - The pre-withdrawal balance exceeds aggregate net deposits, but that does **not** protect each holder's principal: early redeemers can take their full indexed claims and concentrate the current 205,146 GHO deficit on late users
  - `maxWithdraw` is capped by the vault's whole GHO balance rather than a pro-rata share, so the entire shortfall lands on whoever exits last. A vault-sized position is structurally slower to unwind than an EOA
  - The report's pre-existing "funding-based" reassessment trigger is **live**, not hypothetical
  - Treat any positive gap as an active principal-risk signal; monitor its ratio, slope, and days-since-last-AFC-transfer to size or exit the position

- **The documented USDC exit route is exhausted (HIGH):** GSM USDC holds **9.95 waEthUSDC**. `buyAsset()` — step 2 of the withdrawal pipeline — reverts above that size and has done so since roughly June 12, 2026. The module is **not** frozen or seized; other participants simply drained 111M waEthUSDC out of it between May 19 and June 12. Refill requires third-party arbitrage that GHO's $0.9990 price does not currently incentivise. Implications for Yearn:
  - A USDC-denominated strategy has no 1:1 GSM path back to USDC today
  - GSM USDT offers 43.42M of capacity at 10 bps but delivers **USDT**, adding a cross-stable conversion
  - Direct GHO→USDC pools report roughly **$19M aggregate TVL**, not $19M of executable USDC capacity; size-specific quotes are required
  - GSM capacity created by a Yearn deposit is **not reserved** for Yearn — it is a shared pool that any participant can consume

- **10 bps GSM exit fee on every USDC withdrawal (HIGH):** Exiting from sGho back to USDC requires a `GSM.buyAsset()` call charging **10 bps (0.10%)** on the GHO→waEthUSDC leg (verified on-chain at fee strategy [`0x06fbDE909B43f01202E3C6207De1D27cC208AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1): `getBuyFee(1_000_000) = 1000`). The Risk Council raised it from 7 bps on May 23, 2026 ([tx](https://etherscan.io/tx/0xd47810e272039dea4b03d90a1352e9e405e9fee6fdd75b3fd8f733030d83f0d8)). It applies on **every** withdrawal — partial rebalances are repeatedly fee'd. At the 4.25% ASR, breakeven against holding raw USDC requires holding sGho for ≥**~8.6 days** (10 / 425 of a year). Implications for Yearn:
  - The strategy must batch withdrawals to amortize the fee
  - Frequent rebalancing or harvests that touch USDC will compound this drag
  - Deposit direction is fee-free (`sellAsset` charges 0 bps), so the cost is purely on the exit path
  - **A GhoRouter would NOT eliminate this fee** — the router is a UX wrapper; it still calls `GSM.buyAsset()` under the hood
  - The fee is multisig-adjustable via the GhoGsmSteward (rate-limited to ±0.5%/day, max 50% per FixedFeeStrategy), and the Risk Council has now demonstrated it will move it

### Other Key Risks

- **Still-short production history:** sGho went live on May 16, 2026 — 72 days of mainnet usage. Clean, but short of a full quarter, and no stress event (depeg, mass redemption, pause) has been observed
- **sGho outside the bug-bounty scope:** a $136M vault that Immunefi's "Sub-systems of GHO" enumeration does not cover
- **GhoRouter not deployed:** the launch AIP marketed single-tx USDC→sGho onboarding, but no router exists. Yearn's USDC strategy must compose the GSM USDC + sGho deposit steps itself. Even when it ships, it would not change the 10 bps exit fee or the GSM's empty inventory — both sit at the GSM layer. A router audit has been paid for ([AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md)) but not published
- **Upgradeable contracts (rug via governance):** sGho, GSM, GHO Token, and GHO Reserve are all upgradeable proxies controlled by Aave Governance. A malicious governance proposal could drain all funds. Mitigated by Aave's established governance framework and community oversight; implementation slots verified unchanged
- **Unrate-limited Steward multisig:** the Risk Council 3-of-4 Safe can set the ASR anywhere in `[0, 5000]` bps and change the supply cap in a single execution, with no per-day limit. Unused so far on sGho, but exercised on the GSM fee
- **GSM freeze can trap funds:** oracle auto-freezes on USDC depeg, manual freeze by governance. Distinct from — and additive to — the current inventory exhaustion
- **Pause can freeze sGho:** PAUSE_GUARDIAN (Protocol Guardian and Executor L1) can freeze all sGho token operations (deposits, withdrawals, transfers). Mitigated by governance ability to revoke the guardian role
- **Cross-chain expansion pending:** [ARFC Launch sGHO Cross-Chain](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) proposes extending sGho to Arbitrum via Chainlink CCIP with a pre-provisioned "fast path" liquidity buffer. Not live — no CCIP token pool is registered for sGho — but it would add a messaging-layer dependency and a remote-liquidity trust assumption if escalated

### Critical Risks

- **Upgrade-based rug pull:** The theoretical worst case — a malicious Aave governance proposal that upgrades sGho or GSM to steal funds. The sGho ProxyAdmin owner is the DAO Executor L1, so this requires corrupting Aave's on-chain governance process, which has never happened in 6+ years of operation

---

## Risk Score Assessment

> **Note:** Scores below reflect on-chain state at block 25,622,129 (July 27, 2026). The sGho contract's own configuration is unchanged and fully verified; the dominant penalties are now (a) the live yield-funding shortfall and its discretionary 2-of-3 funding path, and (b) the exhausted GSM USDC exit route. Production history is no longer the leading concern.

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — 12+ audits including sGHO-specific Certora audit with formal verification. ✅ PASS
- [x] **Unverifiable reserves** — sGHO is ERC-4626, on-chain verifiable. GSM exposure on-chain. ✅ PASS
- [x] **Total centralization** — Aave DAO on-chain governance with timelock, stewards, and guardian. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | GHO: 12+ audits by top firms (OpenZeppelin, Certora, Sigma Prime, ABDK). sGHO: 2 audits (Certora + TokenLogic). Formal verification |
| Bug bounty | $1,000,000 on Immunefi — **sGho vault and sGho Steward remain outside the enumerated "Sub-systems of GHO"** (re-verified July 27, 2026) |
| Production history | **sGho: 72 days, incident-free** (activated by AIP 484 on May 16, 2026), 1,867 deposits / 951 withdrawals, zero config drift. GHO: ~3.0 years. Aave V3: ~6.5 years |
| TVL | sGho: 136.5M GHO (~$136.3M). GHO mainnet supply: 649.0M. Aave V3: ~$14.67B |
| Security incidents | None on GHO, GSM, sGho, or Aave V3 |

**Score: 2.25/5** — Exceptional audit coverage and formal verification, and the vault has now run 72 days without an incident, a pause, a rate change, or an upgrade while growing 3.7x. That removes most of the "freshly-deployed" penalty that drove the prior 2.5. Two things hold it above 2.0: the clean window is ~72 days rather than a full quarter, and a $136M vault still sits outside the enumerated Immunefi bounty scope. Improves to 2.0 once the vault passes 90 clean days, and below that only if sGho is added to Immunefi.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | **All core contracts upgradeable** (TransparentUpgradeableProxy) by Aave governance |
| Governance | Aave DAO — on-chain AAVE token voting with timelock executor. One of DeFi's most established governance systems |
| Rate-limiting | Stewards limited to small parameter changes (0.5%/day fees, 100% exposure cap). Major changes require full DAO vote |
| Privileged roles | Well-distributed: Governance (admin), Stewards (rate-limited ops), Guardian (pause), Oracle (auto-freeze) |
| EOA risk | No EOAs hold critical roles — all controlled by multisigs, DAO, or automated contracts |

**Governance Score: 3.0/5** — Aave DAO is one of the strongest governance systems in DeFi, with established on-chain voting, timelocks, and community oversight. Two governance facts on sGho hold this subscore at 3.0:

- All core contracts are upgradeable proxies — governance can replace any implementation. sGho ProxyAdmin (`0xc157…8adb`) is owned by the DAO Executor L1, and both the sGho and GSM implementation slots are verified unchanged.
- **The GHO Risk Council 3-of-4 Safe (`0x8513…B60`) holds all four sGhoSteward management roles** (`FIXED_RATE_MANAGER_ROLE`, `SUPPLY_CAP_MANAGER_ROLE`, `AMPLIFICATION_MANAGER_ROLE`, `FLOAT_RATE_MANAGER_ROLE`), in addition to Executor L1 holding the first two. Unlike `GhoGsmSteward`, **`sGhoSteward` has no per-day rate limit** — the Risk Council can set `fixedRate` anywhere in `[0, 5000]` bps and change the supply cap in a single Safe execution. The `MAX_RATE = 5000` bps constant is the only cap. This is a meaningful concentration of power in a 3-of-4 multisig.

Counterweight: the Council has not touched sGho at all in 72 days (no `RateConfigUpdated` ever emitted), and its one exercised action — the GSM fee change — stayed inside the rate limit.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| sGHO PPS | On-chain, algorithmic (yieldIndex-based ERC-4626) |
| sGHO yield | Set by YIELD_MANAGER_ROLE — admin-controlled rate (not market-driven) |
| GSM price | Fixed 1:1 (immutable), fully deterministic |
| Vault operations | Permissionless ERC-4626 deposit/withdraw |
| Yield funding | **Off-chain, discretionary, and currently in deficit** — a 2-of-3 Safe must manually transfer GHO; `totalAssets()` never reads the balance, so the protocol accrues obligations regardless |

**Programmability Score: 2.5/5** — the sGHO exchange rate is fully on-chain and deterministic, and the GSM price strategy is immutable. But the yield-funding dependency is no longer a theoretical caveat: the vault has run an unbacked yield obligation for roughly two weeks, funded only when a 2-of-3 multisig chooses to act, with no contract-level schedule, escrow, or enforcement. A vault whose stated price-per-share can diverge from its assets by an admin's inaction is materially less programmatic than one whose PPS is asset-derived.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Aave DAO (governance), AFC Safe (yield funding), Aave V3 (waEthUSDC), GSM USDC + GSM USDT, GHO Reserve, Chainlink (oracle for freeze), GHO DEX liquidity |
| Criticality | Mostly within the Aave ecosystem — single governance trust root — but with two newly-critical single points: the AFC 2-of-3 Safe for yield backing, and third-party arbitrage flow for GSM exit inventory |
| Quality | Blue-chip: Aave is one of the largest DeFi lending protocols, ~$14.67B Aave V3 TVL, 6+ years |

**Dependencies Score: 2.5/5** — the dependency *set* is blue-chip and concentrated in one trust root, which is normally favourable. What raises this subscore is that two of the dependencies have demonstrably failed to deliver in this period: the AFC Safe stopped funding yield, and the GSM's exit inventory was consumed by parties Yearn does not control. Neither is a counterparty-quality problem; both are dependencies on *discretionary or third-party behaviour* rather than on code.

**Centralization Score = (3.0 + 2.5 + 2.5) / 3 ≈ 2.67**

**Score: 2.75/5** — Aave DAO governance remains a genuine strength and nothing in the sGho contract's control surface changed. The increase is driven entirely by the two dependency/programmability facts above: yield backing rests on an unenforced 2-of-3 multisig action that has lapsed, and the exit route rests on shared inventory that other participants drained. The unrate-limited Steward Safe continues to prevent a lower governance subscore.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | GHO deposits stay in sGHO contract (no rehypothecation). GSM holds waEthUSDC (wrapped Aave USDC) |
| Collateral quality | GHO: backed by over-collateralized Aave V3 loans and GSM stablecoins. waEthUSDC: USDC supply on Aave V3 |
| Leverage | None |
| Yield backing | **Virtual and currently in deficit** — 205,146 GHO of accrued yield (19.6% of all yield since launch) is unbacked; funding lapsed 28 days ago |

**Collateralization Score: 3.0/5** — There is no rehypothecation, GHO stays in the vault, the pre-withdrawal balance exceeds aggregate net deposits, and the underlying assets are blue-chip with no leverage. But that aggregate accounting surplus does not protect individual principal: the virtual-yield model has moved from an edge case to an observed condition, `totalAssets()` exceeds the GHO actually held, and `maxWithdraw` allocates the shortfall to whoever exits last rather than pro rata. A vault that is running a real, widening, unbacked liability — however small as a percentage — does not score the same as one whose obligations are fully funded.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | sGHO: on-chain (ERC-4626). GSM: on-chain (`getAvailableLiquidity()`, `getUsed()`, `getLimit()`). GHO Reserve: on-chain |
| Exchange rate | sGHO: on-chain via yieldIndex. GSM: fixed 1:1 |
| Funding gap | Detectable: compare `balanceOf(GHO, sGHO)` vs `totalAssets()`; funding history reconstructible by differencing `Transfer` against `Deposit` logs |
| Third-party | Chainlink oracle for GSM freeze. [TokenLogic's GHO dashboard](https://aave.tokenlogic.xyz/gho) provides live sGHO supply, rate, mint/burn, holder, user-activity, GHO, and Stability Module analytics. All data remains independently verifiable on-chain |

**Provability Score: 1.25/5** — Excellent on-chain transparency, strengthened by [TokenLogic's GHO dashboard](https://aave.tokenlogic.xyz/gho), which presents live sGHO, GHO, and Stability Module analytics without requiring an integrator to reconstruct basic activity and market data from logs. Every claim in this report remains reproducible from primary on-chain data. The score stays above 1.0 because the most safety-critical reconciliation — `totalAssets() − balanceOf(GHO, sGho)` and attribution of the shortfall to AFC funding — is still not surfaced as a first-class protocol or dashboard health metric, and neither a funding-gap opening nor GSM inventory drain emits an event.

**Funds Management Score = (3.0 + 1.25) / 2 = 2.125**

**Score: 2.13/5** — Provability remains a genuine strength, now supported by a dedicated independent analytics surface, and the vault still holds more GHO than aggregate net deposits before withdrawals. The increase reflects Collateralization moving 2.5 → 3.0: the unfunded-yield scenario the prior assessment described as an edge case is now live, and the withdrawal ordering can already turn that deficit into principal loss for late users.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| sGHO exit (leg 1) | Atomic ERC-4626 redemption, no cooldown, but 136.26M GHO backs 136.47M of claims; early users exit in full and the last claims absorb the deficit |
| GHO → USDC via GSM USDC (leg 2) | **9.95 waEthUSDC available — route effectively dead since ~June 12, 2026** |
| GHO → USDT via GSM USDT | 43.42M available at 10 bps, but delivers USDT not USDC |
| GHO → USDC via DEX | Direct pools report ~$19M aggregate TVL (Fluid $15.8M, Uni v4 $3.0M, Uni v3 $0.2M), but executable USDC output is lower and must be quoted by size/slippage |
| Exit fee | 10 bps at the GSM (raised from 7 bps on May 23, 2026); ~8.6-day breakeven at the 4.25% ASR |
| Freeze risk | GSM auto-freezes on USDC depeg [$0.99, $1.01]. Manual freeze possible. Additive to the current exhaustion |
| Pause risk | sGHO pause blocks all token operations including withdrawal |
| Supply cap | 400M GHO (sGHO, 263.5M headroom), 175M waEthUSDC (GSM, essentially all available on the deposit side only) |

**Score: 3.5/5** — This is the category that deteriorated most. Leg 1 (sGho → GHO) remains atomic but is modestly under-funded, while the strategy is denominated in USDC and **the documented USDC exit route is not merely at risk, it is already unavailable** and has been for roughly six weeks. GSM USDT provides 43.42M of deterministic fallback inventory but delivers USDT; the DEX alternatives report only ~$19M of aggregate pool TVL, and their executable USDC output is smaller and slippage-dependent. Recovery of the GSM route depends on third-party arbitrage that GHO's sub-$1 price does not currently incentivise, and capacity created by a Yearn deposit is not reserved for Yearn. The prior 2.5 assumed ~111M of GSM depth as the base case; that assumption no longer holds. Score would return toward 2.5 if GSM USDC inventory recovers to a multiple of the intended position size and holds there.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Aave — top-tier DeFi team, publicly known, 6+ years of operation |
| Governance | Fully on-chain Aave DAO. Multiple safety layers (guardian, stewards, timelocks, auto-freezer) |
| Documentation | Comprehensive Aave and GHO docs. Source code open and verified |
| Legal | LlamaRisk flagged MiCA (EU) prohibits interest on stablecoins — regulatory risk for sGHO |
| Incident response | Protocol Guardian for emergencies. $1M bug bounty (sGho not enumerated). Rate-limited stewards on the GSM |
| Yield funding process | **Weakest link** — ad-hoc AFC Safe transactions, irregular cadence (4–14 days, then a 28-day lapse), no published schedule, no on-chain commitment, no public reporting of the gap |
| GSM operations | GSM USDC has held ~zero exit inventory for roughly six weeks with no visible remediation (no treasury seeding, no sell-side refill incentive, no forum post located) |
| Monitoring | Chainlink oracle auto-freezer on GSM. sGho-specific monitoring remains ad-hoc — no published dashboards or alerting frameworks, and the two conditions that actually degraded (funding gap, GSM inventory) emit **no events at all**, so they are invisible to event-only monitoring |

**Score: 2.0/5** — Top-tier team, documentation, and governance infrastructure; the contract-level operations have been flawless for 72 days. The increase from 1.5 reflects process rather than capability: the yield-funding routine that the product's economics depend on is undocumented and has lapsed, the GSM exit route has sat empty for six weeks without visible response, and the two most important health metrics are pollable-only with no protocol-side alerting. Regulatory uncertainty (LlamaRisk MiCA concerns) is unchanged.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (2.75 × 0.30) + (2.125 × 0.30) + (2.25 × 0.20) + (3.5 × 0.15) + (2.0 × 0.05)
            = 0.825 + 0.6375 + 0.45 + 0.525 + 0.10
            = 2.5375
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.25 | 20% | 0.45 |
| Centralization & Control | 2.75 | 30% | 0.825 |
| Funds Management | 2.125 | 30% | 0.6375 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.5/5.0** (2.5375 unrounded) |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Risk Tier: Medium Risk (2.5/5.0; 2.5375 unrounded) — Approved with enhanced monitoring**

> The sGho contract itself has been exemplary: 72 days, 2,818 user operations, 3.7x TVL growth, and not one parameter, role, or implementation change. The downgrade is entirely about the system around it. Two conditions the prior assessment listed as risks to watch have both materialised — the vault is running an unfunded yield obligation, and the GSM USDC exit route is empty — and neither emits an event, so both are invisible to event-driven monitoring.
>
> **Enhanced monitoring means, concretely:** poll `(totalAssets − balanceOf) / totalAssets` and days-since-last-AFC-transfer daily; treat any positive shortfall as active late-redeemer principal risk and use its size and slope to set position limits or exit urgency; and poll `GSM.getAvailableLiquidity()` on both GSMs at least every 6 hours, sizing any position against observed inventory plus size-specific DEX quotes rather than exposure caps or aggregate pool TVL.
>
> Score improves toward ~2.2 if the AFC resumes regular funding and closes the gap, GSM USDC exit inventory recovers and holds, and sGho passes 90 clean days; further improvement requires Immunefi scope coverage and GhoGsmSteward-style per-day rate limits on sGhoSteward. Score worsens if the funding gap keeps widening, if GSM exit depth stays near zero while sGho TVL grows, if the cross-chain CCIP ARFC ships without a re-review, or if a GhoRouter is deployed with broad token-rescue powers.

---

## Appendix: USDC ↔ sGho Conversion Flows

Step-by-step view of the Yearn USDC strategy's two flows, with explicit fees at each leg. All values verified on-chain at block 25,622,129 (July 27, 2026).

### Deposit Flow: USDC → sGho

| # | From → To | Contract | Call | Fee | Notes |
|---|---|---|---|---|---|
| 1 | USDC → waEthUSDC | Aave V3 USDC market + static-aToken wrapper [`0xD4fa…D23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E) | `deposit(usdc, receiver)` | **0%** | USDC starts earning Aave V3 supply APY while held as waEthUSDC |
| 2 | waEthUSDC → GHO | GSM USDC [`0x3A38…4112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `sellAsset(waEthUSDC_amount, receiver)` | **0 bps (0%)** | Fixed 1:1 price (FixedPriceStrategy [`0xEE73…D64f`](https://etherscan.io/address/0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f)); fee strategy [`0x06fb…AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1) returns 0 for sell side. 174,999,990 waEthUSDC of headroom under the 175M exposure cap |
| 3 | GHO → sGho | sGho [`0xE175…ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `deposit(gho_amount, receiver)` | **0%** | Standard ERC-4626 — no deposit fee. 263.5M GHO of headroom under the 400M supply cap |

**Total deposit-side fees: 0%.** The deposit direction is entirely unconstrained today. Costs are gas + any GSM unavailability (oracle freeze) + sGho pause. Note that step 2 *creates* GSM exit capacity that any other participant may consume before the strategy tries to use it.

### Withdrawal Flow: sGho → USDC

| # | From → To | Contract | Call | Fee | Notes |
|---|---|---|---|---|---|
| 1 | sGho → GHO | sGho [`0xE175…ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `withdraw(gho_amount, receiver, owner)` or `redeem(shares, receiver, owner)` | **0%** | No withdrawal fee. Capped by `IERC20(GHO).balanceOf(sGho)` = 136,261,440 GHO (single-owner cap, not pro-rata) — see "Virtual/Unfunded Yield" for the first-come-first-served shortfall allocation |
| 2 | GHO → waEthUSDC | GSM USDC [`0x3A38…4112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `buyAsset(waEthUSDC_amount, receiver)` | **10 bps (0.10%)** ⚠️ | **Currently reverts above 9.95 waEthUSDC** (`INSUFFICIENT_AVAILABLE_EXOGENOUS_ASSET_LIQUIDITY`). Fee strategy [`0x06fb…AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1): `getBuyFee(1_000_000) = 1000`. GhoRouter would NOT eliminate this — it's charged at the GSM layer regardless of caller |
| 3 | waEthUSDC → USDC | static-aToken wrapper + Aave V3 USDC market | `redeem` / `withdraw(usdc, receiver, owner)` | **0%** | Subject to Aave V3 USDC pool liquidity — 230.01M USDC available today |

**Total withdrawal-side fees: 10 bps (0.10%)** — but step 2 is currently unavailable at any meaningful size. At the 4.25% sGho APR, breakeven against just holding raw USDC is ~8.6 days (10 / 425 of a year).

**Working substitute for step 2 today:**

| Route | Call | Liquidity indicator | Cost | Output |
|---|---|---|---|---|
| GSM USDT | `buyAsset` on [`0x8822…F5E3`](https://etherscan.io/address/0x882285E62656b9623AF136Ce3078c6BdCc33F5E3) | 43.42M waEthUSDT | 10 bps + USDT→USDC conversion | USDT |
| Fluid DEX GHO-USDC | swap | ~$15.8M aggregate pool TVL; quote required | swap fee + slippage | USDC |
| Uniswap v4 GHO-USDC | swap | ~$3.0M aggregate pool TVL; quote required | swap fee + slippage | USDC |

### Failure Modes That Block These Flows (no fee, but liquidity risk)

| Condition | Blocks | Recovery |
|---|---|---|
| `sGho.paused = true` | Steps 1+3 of deposit (the sGho `deposit` call) and step 1 of withdrawal | Protocol Guardian or DAO `unpause()` |
| `GSM.isFrozen() = true` (oracle auto-freeze on USDC depeg outside [$0.99, $1.01], or manual governance freeze) | Step 2 of both flows | Oracle unfreezes when USDC returns to [$0.995, $1.005]; or DAO unfreezes manually |
| **`GSM.getAvailableLiquidity()` below the requested size — ACTIVE, 9.95 waEthUSDC** | Step 2 of withdrawal (`buyAsset` reverts) | Only refills when a third party calls `sellAsset`, which requires GHO ≥ $1 after sell-side costs. GHO is at $0.9990, so there is no current incentive. Governance could seed the module or create a sell-side refill incentive; lowering the `buyAsset` fee would instead make inventory draining cheaper |
| GSM exposure at 175M cap | Step 2 of deposit only (`sellAsset`) | Wait for withdrawals to free capacity, or DAO raises cap. Not binding today (175M available) |
| sGho `supplyCap` (400M GHO) reached | Step 3 of deposit | DAO raises cap via Steward `SUPPLY_CAP_MANAGER_ROLE`. Not binding today (263.5M headroom) |
| **`IERC20(GHO).balanceOf(sGho) < totalAssets()` — ACTIVE, 205,146 GHO short** | Step 1 of withdrawal for the last claims out — **any positive gap can become principal loss for late redeemers after earlier users take their full indexed claims** | AFC Safe tops up GHO from protocol revenue (last done June 29, 2026). Yearn-side mitigation: treat the live gap as principal risk now; track its ratio and slope and size or exit before it widens |
| Aave V3 USDC pool at high utilization | Step 3 of withdrawal | Wait for borrowers to repay, or use DEX path. Not binding today (230.01M USDC available) |

---

## Reassessment Triggers

- **Time-based:** Reassess by late October 2026 (6 months post-launch), or sooner if any trigger below fires
- **Funding-based (currently firing):** the gap `totalAssets() − balanceOf(GHO, sGho)` is live at 205,146 GHO and already creates late-redeemer principal risk. Keep this trigger active until the gap returns to zero; escalate if the gap grows materially from the current 0.15% of `totalAssets()`, exceeds **1%**, or no AFC top-up occurs for **45 days** from June 29, 2026
- **Liquidity-based (currently firing):** GSM USDC `getAvailableLiquidity()` has been ~10 waEthUSDC for roughly six weeks. Re-review if it recovers above the intended position size and holds for 30 days (upgrade case), or if GSM USDT capacity also falls below the intended position size (downgrade case)
- **TVL-based:** Reassess if sGho TVL changes by more than ±50% from 136.5M GHO, or if it approaches the 400M supply cap
- **Incident-based:** Reassess after any exploit, governance attack, or Aave protocol incident
- **Peg-based:** Reassess if GHO trades below $0.99 for more than 48 hours — this both removes the GSM refill incentive and stresses the exit path
- **Rate-based:** Reassess on any `TargetRateUpdated` / `RateConfigUpdated` event, or if the ASR exceeds the GHO borrow rate (arbitrage risk per LlamaRisk)
- **Fee-based:** Reassess on any `FeeStrategyUpdated` on GSM USDC (buy fee is now 10 bps, raised from 7 bps on May 23, 2026)
- **GSM-based:** Reassess if a GSM freeze lasts >24 hours or if `LIQUIDATOR_ROLE` is granted to any address
- **Governance-based:** Reassess if sGho proxy admin, implementation, or role assignments change; if per-day rate limits are added to `sGhoSteward`; or if a GhoRouter is deployed and granted token-rescue / approval-handling roles ([issue #194](https://github.com/yearn/risk-score/issues/194))
- **Cross-chain:** Reassess if [ARFC Launch sGHO Cross-Chain](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) escalates to Snapshot or AIP, or if a CCIP token pool is ever registered for sGho — this would add a messaging-layer dependency and require a `src/data/bridges.json` entry
- **Bug bounty:** Reassess if sGho or sGho Steward are added to the Aave Immunefi scope
- **Migration-based:** Legacy stkGHO is down to 42.03M from 216.75M. Reassess if the residual is force-migrated or unwound via a mechanism that touches sGho
- **Regulatory:** Monitor MiCA enforcement actions related to interest-bearing stablecoins

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| April 2, 2026 | 2.1 | Pre-deployment assessment from ARFC/audit material; rechecked April 22, 2026 |
| May 19, 2026 | 2.3 | Post-deployment refresh after AIP 484. On-chain roles, ProxyAdmin, rate, and supply cap verified. Centralization 2.0 → 2.5 (Risk Council holds unrate-limited sGhoSteward roles); Collateralization 2.0 → 2.5 (late-withdrawer impairment path) |
| July 27, 2026 (updated Aug 6) | 2.5 | 72-day reassessment. sGho contract itself unchanged and clean; TVL 37.3M → 136.5M GHO. Live 205,146 GHO unfunded-yield gap (AFC Safe funding lapsed 28 days); GSM USDC exit inventory exhausted (111.25M → 9.95 waEthUSDC); GSM buy fee 7 → 10 bps. Liquidity 2.5 → 3.5, Centralization 2.5 → 2.75, Funds Mgmt 2.0 → 2.125 after the TokenLogic dashboard improved the Provability subscore 1.5 → 1.25, Operational 1.5 → 2.0, Audits 2.5 → 2.25 |
