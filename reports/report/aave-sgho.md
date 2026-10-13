# Protocol Risk Assessment: Aave — sGHO

- **Assessment Date:** April 2, 2026 (Updated: October 13, 2026)
- **Token:** sGho (GHO Savings Vault)
- **Chain:** Ethereum
- **Token Address:** [`0xE1753F2e00940cC31213dd92013cF019DFE4ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d)
- **Final Score: 2.68/5.0**

> **STATUS (October 13, 2026, block 26,181,150):** sGho is live on Ethereum mainnet with **150 days of production history** and `totalAssets() = 176,935,741 GHO` (~$176.7M). Implementation, ProxyAdmin, supply cap, pause state, and role assignments are unchanged since [AIP 484](https://app.aave.com/governance/v3/proposal/?proposalId=484) (no `Upgraded`, `SupplyCapUpdated`, `Paused`, or `RoleGranted`/`RoleRevoked` events). The Aave Savings Rate is **4.50%** (`targetRate() = 450`), raised from 4.25% by the GHO Risk Council on September 1, 2026 in a single sGhoSteward execution (tx [`0x7aa9fd…001f`](https://etherscan.io/tx/0x7aa9fd1ced00357442edddc4011fb3c11886fecbe3ab90f3cfd5c1ebec63001f)). **Current conditions:**
>
> 1. **Yield backing is funded, but the buffer is nearly exhausted.** `IERC20(GHO).balanceOf(sGho) = 176,982,243` against `totalAssets() = 176,935,741` — a **46,502 GHO surplus (0.03% of `totalAssets`)**, about 2.1 days of accrual at ~21,814 GHO/day. The last top-up was 220,000 GHO on September 30 (13 days before the snapshot). Twelve top-ups totalling **2,584,000 GHO** have been made since launch, all executed by the **Aave Finance Committee Safe** ([`0x2274…1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa), 2-of-3); since August 11, 2026 the GHO is pulled directly from the Aave Collector through an AFC GHO allowance. The vault ran a deficit of up to ~269,000 GHO before the July 31 top-up and briefly again around September 6–8 (peak ~32,600 GHO). No contract enforces or schedules the funding.
> 2. **The GSM USDC exit route remains exhausted; the USDT fallback has partly recovered.** GSM USDC `getAvailableLiquidity()` is **0.03 waEthUSDC** — `buyAsset()` has been unusable since mid-June 2026 — and its buy fee was raised **10 → 15 bps** on September 17, 2026 (tx [`0xe967a8…b0b6`](https://etherscan.io/tx/0xe967a8ea12c94ed48deffa425dfb2ec2bfa2da1d0063b8d7d29d6dfb5df7b0b6)). GSM USDT, the deepest deterministic exit, holds **29.35M waEthUSDT shares, worth ≈34.60M USDT / GHO** (≈18.94M on September 27; ≈50.81M on July 27), against 176.9M GHO of sGho claims. Aggregator quotes route ~30M GHO to USDC at <0.3% price impact, with a sharp cliff before 40M.
> 3. **The GHO Risk Council was reconstituted as a 2-of-3 Safe** on August 23, 2026 (tx [`0x9f0f43…5e3e`](https://etherscan.io/tx/0x9f0f435d8d37f9e3446fad0737b57ba37ac00ac841da1bd432085b481bd15e3e)). Its signers are organisation-controlled nested Safes for Aave Labs, LlamaRisk, and TokenLogic ([ARFC](https://governance.aave.com/t/arfc-gho-stewards-signer-update/25452)), the **same three signers as the AFC Safe**. The parties that set the sGho rate also control its funding.
>
> **The new sGho contract remains separate from the legacy stkGHO proxy** ([`0x1a88…885d`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d)), which holds 30.51M stkGHO. The `GhoRouter` is **still not deployed**: [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) is open (not merged, last commit September 16, 2026), there is no `GHO_ROUTER` entry in the [Aave Address Book](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol), and no router proposal exists in [`aave-proposals-v3`](https://github.com/aave-dao/aave-proposals-v3/tree/main/src).

## Overview + Links

sGHO is an **ERC-4626 compliant yield-bearing savings vault** for GHO, Aave's native stablecoin. It replaces the legacy stkGHO staking model with a native, on-chain yield mechanism that automatically accrues interest through an internal yield index.

**Yearn use case per issue #123:** Yearn USDC strategy that acquires GHO (via the GSM USDC module) and deposits into sGHO to earn the Aave Savings Rate (ASR).

**Strategy pipeline:**

- **Deposit:** USDC → waEthUSDC (Aave staticAToken) → GHO (via GSM USDC) → sGHO (direct `deposit()`)
- **Withdrawal:** sGHO → GHO → waEthUSDC (via GSM USDC) → USDC. **The GSM USDC leg is currently unusable** — see *Liquidity Risk*; the practical exits today are GSM USDT (to USDT) or DEX

**Key architecture:**

- **sGHO Vault:** Upgradeable ERC-4626 vault (TransparentUpgradeableProxy) with internal index-based yield accounting. GHO deposited remains in the contract — no rehypothecation, no external strategy deployment
- **GhoRouter:** Not deployed. A routing contract for multi-step USDC↔GHO↔sGHO conversions with slippage protection is drafted in [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) but is not merged, not audited under any published report, and not in the Address Book. All conversions must be composed manually
- **GSM USDC (Gsm4626):** GHO Stability Module that converts waEthUSDC (wrapped Aave USDC) to/from GHO at a fixed 1 USDC = 1 GHO price. Each waEthUSDC share is priced at the USDC it redeems for (`FixedPriceStrategy4626` applies the vault's share conversion: 1 share = 1.187281 GHO at the snapshot), so share amounts and GHO amounts are not 1:1. Uses a pre-minted GHO reserve (does not mint GHO directly). Its underlying-asset inventory is a **shared pool with no per-depositor reservation** — capacity created by one participant's `sellAsset` can be consumed by any other participant's `buyAsset`
- **Yield source:** The Aave Savings Rate (ASR) is set by governance and the GHO Risk Council. Yield is **virtual** — the yield index grows over time, but the actual GHO to back it must be transferred into the vault by the Aave Finance Committee Safe, currently from Aave Collector funds. No strategy or lending is involved, and no on-chain mechanism enforces or schedules the funding
- **Governance:** Aave DAO on-chain governance via Executor Level 1, with GHO Stewards (Risk Council 2-of-3 Safe of organisation-controlled nested Safes) for rate adjustments

**Key parameters (from ARFC, March 25, 2026):**

- **Initial ASR:** 4.25% APR (fixed rate; amplification=0, premium=425 bps). **Current ASR: 4.50%** (`fixedRate = 450`, set September 1, 2026)
- **Supply Cap:** 400,000,000 GHO
- **Maximum Safe Rate Cap:** 50% APR (hardcoded constant)
- **Cooldown:** None
- **Lock-up:** None
- **Slashing:** None
- **Rehypothecation:** None
- **Fees:** None (0% deposit/withdrawal fees on sGHO itself)
- **GSM USDC sell fee:** 0 bps (waEthUSDC → GHO)
- **GSM USDC buy fee:** 15 bps (GHO → waEthUSDC), verified on fee strategy [`0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE`](https://etherscan.io/address/0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE) — `getBuyFee(1_000_000) = 1500`

**Links:**

- [ARFC: sGHO Launch Configuration](https://governance.aave.com/t/arfc-sgho-launch-configuration/24346)
- [ARFC: GHO Savings Upgrade](https://governance.aave.com/t/arfc-gho-savings-upgrade/21680)
- [ARFC: Launch sGHO Cross-Chain](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) (June 24, 2026 — thread auto-closed August 6, 2026 without a Snapshot; would add a Chainlink CCIP dependency if revived)
- [ARFC: GHO Stewards Signer Update](https://governance.aave.com/t/arfc-gho-stewards-signer-update/25452) (August 8, 2026 — Risk Council to 2-of-3 Aave Labs / LlamaRisk / TokenLogic)
- [ARFC: June — Update Signers and SAFE Configuration](https://governance.aave.com/t/arfc-june-update-signers-and-safe-configuration/25023) (AFC and other DAO budget Safes to 2-of-3 nested organisation Safes)
- [GHO Stewards: September 2026 GHO Parameter Update](https://governance.aave.com/t/gho-stewards-september-2026-gho-parameter-update/25644) (GSM fee changes and GSM drain rationale)
- [Snapshot Vote](https://snapshot.org/#/s:aavedao.eth/proposal/0xb9e9b01efcf6151bade78546d0f51f11d7961939b649fb7717e82ea3d43d4f47)
- [Implementation PR #29](https://github.com/aave-dao/gho-origin/pull/29)
- [sGHO Source (gho-origin)](https://github.com/aave-dao/gho-origin/tree/main/src/contracts/sgho)
- [TokenLogic Collaborative Audit (gho-origin/audits)](https://github.com/aave-dao/gho-origin/blob/main/audits/2026.03.04%20-%20Final%20-%20TokenLogic%20Collaborative%20Audit%20Report%201772584390.pdf)
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
| Aave Finance Committee Safe (AFC) | [`0x22740deBa78d5a0c24C58C740e3715ec29de1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa) | 2-of-3 Gnosis Safe of nested organisation Safes — **executes every sGho yield top-up** (`MiscEthereum.AFC_SAFE`) |
| Aave Collector | [`0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c`](https://etherscan.io/address/0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c) | DAO treasury — source of sGho top-ups since August 11, 2026 via a GHO allowance to the AFC (`allowance(Collector, AFC) = 7,406,000` GHO) |
| GhoRouter | Not deployed | [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) open and unmerged; no Address Book entry, no proposal in `aave-proposals-v3` |

Source-of-truth references: [`aave-address-book/GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol) (`SGHO`, `SGHO_STEWARD`); [`aave-address-book/MiscEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/MiscEthereum.sol) (`AFC_SAFE`); [AIP-484 payload diff](https://github.com/aave-dao/aave-proposals-v3/blob/main/diffs/AaveV3Ethereum_SGhoLaunch_20260427_before_AaveV3Ethereum_SGhoLaunch_20260427_after.md) (`AaveV3Ethereum_SGhoLaunch_20260427`); [contract creator](https://etherscan.io/address/0x3765a685a401622c060e5d700d9ad89413363a91).

### GHO Ecosystem Contracts (Deployed)

| Contract | Address | Type |
|----------|---------|------|
| GHO Token | [`0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f`](https://etherscan.io/address/0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f) | `GhoToken` ERC-20, **not a proxy** on Ethereum; Executor L1 holds `DEFAULT_ADMIN`, `FACILITATOR_MANAGER`, and `BUCKET_MANAGER` roles |
| Legacy stkGHO | [`0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d) | Legacy staking (being sunset) |
| GHO Reserve | [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9) | Pre-minted GHO pool for GSMs |

### GSM USDC Contracts (Deployed)

| Contract | Address | Type |
|----------|---------|------|
| GSM USDC (Gsm4626) | [`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | TransparentUpgradeableProxy |
| GSM USDC Implementation | [`0x320be97b4d10b6d20a05cae53a479fa2a0187e8e`](https://etherscan.io/address/0x320be97b4d10b6d20a05cae53a479fa2a0187e8e) | Gsm4626 |
| GSM USDC ProxyAdmin | [`0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21`](https://etherscan.io/address/0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21) | EIP-1967 admin slot |
| waEthUSDC (Underlying) | [`0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E) | Wrapped Aave USDC (ERC-4626); `convertToAssets(1e6) = 1.189402` USDC |
| GSM USDC Fee Strategy | [`0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE`](https://etherscan.io/address/0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE) | FixedFeeStrategy (0 bps sell, 15 bps buy) — live value from `GSM.getFeeStrategy()` |
| GSM USDC Price Strategy | [`0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f`](https://etherscan.io/address/0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f) | FixedPriceStrategy4626 — 1 USDC = 1 GHO after converting waEthUSDC shares to USDC (`getAssetPriceInGho(1e6, true) = 1.189403e18`) |
| GSM USDT Price Strategy | [`0x19804d58eF1721E199E59e10A028991ED1CfaCE9`](https://etherscan.io/address/0x19804d58eF1721E199E59e10A028991ED1CfaCE9) | FixedPriceStrategy4626 — 1 USDT = 1 GHO after converting waEthUSDT shares ([`0x7Bc3…3Af8`](https://etherscan.io/address/0x7Bc3485026Ac48b6cf9BaF0A377477Fff5703Af8)) to USDT (`getAssetPriceInGho(1e6, true) ≈ 1.178865e18`) |
| GSM USDT (Gsm4626) | [`0x882285E62656b9623AF136Ce3078c6BdCc33F5E3`](https://etherscan.io/address/0x882285E62656b9623AF136Ce3078c6BdCc33F5E3) | Alternative GHO exit — 29.35M waEthUSDT shares available (≈34.60M USDT / GHO value), 85M-share exposure cap (≈100.2M GHO), 10 bps buy fee (strategy [`0x06fb…AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1)) |
| Oracle Swap Freezer | [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Chainlink-based auto-freeze |
| GSM Registry | [`0x167527DB01325408696326e3580cd8e55D99Dc1A`](https://etherscan.io/address/0x167527DB01325408696326e3580cd8e55D99Dc1A) | GSM registry |

> The Aave Address Book entries `GSM_USDC_FEE_STRATEGY` ([`0xE502…6D64`](https://etherscan.io/address/0xE5025A7c15a44283A0616567181587eE6A646D64)) and `GSM_USDC_PRICE_STRATEGY` ([`0x00e8…3b72`](https://etherscan.io/address/0x00e89F4022FD13AD56e321D50612Eec598eF3b72)) do **not** match what GSM USDC actually points at on-chain (`getFeeStrategy()` / `PRICE_STRATEGY()`). Read the strategies from the GSM, not the Address Book.

### Governance Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Aave Governance Executor L1 | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A) | On-chain DAO executor — DEFAULT_ADMIN, CONFIGURATOR, SWAP_FREEZER on GSM |
| GHO Risk Council (Stewards) | [`0x8513e6F37dBc52De87b166980Fa3F50639694B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60) | 2-of-3 Gnosis Safe; signers are the Aave Labs, LlamaRisk, and TokenLogic nested Safes (same set as the AFC) |
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

### On-Chain State Verification (October 13, 2026, block 26,181,150)

| Check | Result | Source |
|-------|--------|--------|
| sGho / SGHO_STEWARD entries in Aave Address Book | **Present** | [`GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol) |
| AIP 484 payload state | **Executed** at block 25,109,406 (2026-05-16 18:04 UTC) | [tx 0x48ef4e…d404e](https://etherscan.io/tx/0x48ef4e0de1e5684ee05ae0e49c67af781bd497b675c0ea1a24193a5a499d404e) |
| sGho contract is ERC-4626 with GHO as asset | **Yes** — `asset()` = [`0x40D1…6C2f`](https://etherscan.io/address/0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f) (GHO Token) | `cast call SGHO asset()` |
| sGho `targetRate` | **450** (4.50% APR) — one `TargetRateUpdated` event, 425 → 450 on 2026-09-01 via sGhoSteward, executed by the GHO Risk Council Safe | [tx `0x7aa9fd…001f`](https://etherscan.io/tx/0x7aa9fd1ced00357442edddc4011fb3c11886fecbe3ab90f3cfd5c1ebec63001f) |
| sGho `supplyCap` matches AIP spec (400M) | **Yes** — `supplyCap() = 4e26` (400M·1e18); no `SupplyCapUpdated` event since launch | `cast call SGHO supplyCap()` |
| sGho `MAX_SAFE_RATE` is 50% APR | **Yes** — `MAX_SAFE_RATE() = 5000` (bps) | `cast call SGHO MAX_SAFE_RATE()` |
| sGho `paused` | **false** — no `Paused` event since launch | `cast call SGHO paused()` |
| sGho `totalAssets()` | **176,935,741 GHO** (~$176.7M); `totalSupply() = 173,834,355` shares | `cast call SGHO totalAssets()` |
| sGho `convertToAssets(1e18)` | `1.017841e18` — 1.78% accrued over 150 days | `cast call SGHO convertToAssets(uint256) 1e18` |
| **sGho GHO balance vs `totalAssets()`** | **Surplus — `balanceOf(sGho) = 176,982,243` > `totalAssets() = 176,935,741`; buffer 46,502 GHO (0.03%, ~2.1 days of accrual)** | `cast call GHO balanceOf(SGHO)` |
| sGho implementation unchanged | **Yes** — EIP-1967 impl slot = [`0xff229a…7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04); no `Upgraded` event | `cast storage SGHO 0x3608…2bbc` |
| sGho ProxyAdmin owner | Aave Governance Executor L1 ([`0x5300…192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) | `cast call ProxyAdmin owner()` |
| sGho role assignments changed? | **No** — zero `RoleGranted`/`RoleRevoked` events after the AIP-484 execution block | Etherscan `getLogs` on sGho |
| Steward `getRateConfig()` | `(0, 0, 450)` — one `RateConfigUpdated` event since launch (2026-09-01, caller GHO Risk Council Safe); none since; no steward role changes | `cast call SGHO_STEWARD getRateConfig()` |
| Steward `MAX_RATE` = 5000 bps | **Yes** | `cast call SGHO_STEWARD MAX_RATE()` |
| Steward `sGHO()` points to sGho proxy | **Yes** — returns [`0xE175…ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `cast call SGHO_STEWARD sGHO()` |
| **GHO Risk Council Safe** | **2-of-3** (was 3-of-4). All four prior signers were removed and three nested organisation Safes added on 2026-08-23 — Aave Labs ([`0x4b75…1a74`](https://etherscan.io/address/0x4b752551fC6345A7de82F76fd7a5015CA16d1a74), internal 2-of-6), LlamaRisk ([`0xb291…Afef`](https://etherscan.io/address/0xb291232F480F41c75802C4a60F1D2AC03404Afef), internal **1-of-3**), TokenLogic ([`0x9DE1…1193`](https://etherscan.io/address/0x9DE1d45e2786b03498289959203F25b29B4D1193), internal 2-of-5; one internal signer swapped one-for-one on 2026-10-02, [tx](https://etherscan.io/tx/0xcdabed6b290f38eb5855f61a1ce9edefaae3ac4035707433c9a3b6185b4b55d7)). No modules, no guard. Council owner set and threshold unchanged since 2026-08-23 | [tx `0x9f0f43…5e3e`](https://etherscan.io/tx/0x9f0f435d8d37f9e3446fad0737b57ba37ac00ac841da1bd432085b481bd15e3e), [ARFC](https://governance.aave.com/t/arfc-gho-stewards-signer-update/25452) |
| **AFC Safe** | 2-of-3, unchanged threshold; one signer replaced on 2026-08-04 (TokenLogic nested Safe added). Its signer set is now **identical** to the Risk Council's | [tx `0x523d68…f761`](https://etherscan.io/tx/0x523d6801929e300a7ce2208b8a60f8c976cb60125af6b0ae37095c28aebdf761), [ARFC](https://governance.aave.com/t/arfc-june-update-signers-and-safe-configuration/25023) |
| Protocol Guardian | 4-of-7, owner set unchanged since July 27. The LlamaRisk nested Safe is also one of its signers | `getOwners()` at the July, September, and October snapshot blocks |
| **GSM USDC underlying inventory** | **0.03 waEthUSDC shares (≈0.035 USDC / GHO value)** — `buyAsset()` (GHO → USDC) reverts above this size. `getAvailableUnderlyingExposure() = 174,999,999.97` shares (≈208.1M GHO; deposit direction unaffected) | `cast call GSM getAvailableLiquidity()` |
| GSM USDC frozen / seized | **No / No** — no `SwapFreeze` or `Seized` event; the exit route is exhausted, not administratively blocked | `getIsFrozen()`, `getIsSeized()` |
| GSM USDC fee strategy | **Changed 2026-09-17**: [`0x06fb…AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1) (10 bps buy) → [`0xfDB0…23dE`](https://etherscan.io/address/0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE) (15 bps buy, 0 bps sell) via GhoGsmSteward, executed by the Risk Council Safe | [`FeeStrategyUpdated` tx](https://etherscan.io/tx/0xe967a8ea12c94ed48deffa425dfb2ec2bfa2da1d0063b8d7d29d6dfb5df7b0b6) |
| GSM USDT fee strategy | 10 bps buy. Raised to 15 bps on 2026-09-04 ([tx](https://etherscan.io/tx/0xf322e1d6ae63f205e624efca7c0288a7b90922dce34966f305652ebb00194671)) and returned to 10 bps on 2026-09-17 (same tx as the USDC change) | `getFeeStrategy()` |
| **GSM USDT underlying inventory** | **29.35M waEthUSDT shares ≈ 34.60M USDT / GHO** (≈18.94M on 2026-09-27); `getUsed() = 34.55M` GHO of a 100M limit; not frozen | `getAvailableLiquidity()` → `getAssetPriceInGho(shares, false)` on the price strategy |
| GSM USDC exposure cap | **Unchanged at 175M waEthUSDC shares** (≈208.1M GHO at the snapshot share price) — no `ExposureCapUpdated` event | `cast call GSM getExposureCap()` |
| GSM implementation | GSM USDC impl slot unchanged at [`0x320be9…7e8e`](https://etherscan.io/address/0x320be97b4d10b6d20a05cae53a479fa2a0187e8e); no `Upgraded`, `FeeStrategyUpdated`, `ExposureCapUpdated`, or `SwapFreeze` event on either GSM since 2026-09-17 | `cast storage GSM 0x3608…2bbc` |
| GSM `LIQUIDATOR_ROLE` | **Never granted** — zero `RoleGranted`/`RoleRevoked` logs on either GSM since July 27; zero for `LIQUIDATOR_ROLE` over full history | Etherscan `getLogs` on GSM |
| Legacy stkGHO | Separate contract, `totalSupply() = 30,511,542` stkGHO — down from 216.75M in May | [`0x1a88…885d`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d) |
| GhoRouter deployment status | **Not deployed.** [PR #34](https://github.com/aave-dao/gho-origin/pull/34) open (unmerged, latest commit `9c6c2a01` on 2026-09-16), no `GHO_ROUTER` in the Address Book, no router payload in `aave-proposals-v3`, no router report in [`gho-origin/audits`](https://github.com/aave-dao/gho-origin/tree/main/audits). TokenLogic was reimbursed 11,655 aEthLidoGHO for a *GhoRouter audit* in [AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md) | [PR #34](https://github.com/aave-dao/gho-origin/pull/34) |
| sGho cross-chain (CCIP) live? | **No** — `TokenAdminRegistry.getPool(sGho)` returns the zero address. The [cross-chain ARFC](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) thread auto-closed on 2026-08-06 with no Snapshot or AIP | `getPool(address)` on [TokenAdminRegistry `0xb227…5Cb6`](https://etherscan.io/address/0xb22764f98dD05c789929716D677382Df22C05Cb6) |
| Aave bug bounty (Immunefi) sGho coverage | **Still not enumerated** (re-checked October 13, 2026; program last updated April 17, 2026). "Sub-systems of GHO" covers: GHO stablecoin, GHO reserve of Aave Pool, GHO FlashMinter, GSM/GSM4626, CCIP GHO bridge, GHO stewards, GHO Remote Facilitators | [Immunefi Aave information](https://immunefi.com/bug-bounty/aave/information/) |

**Conclusion:** the sGho contract's code, admin, and role surface are unchanged after 150 days. Its one parameter change — the 4.25% → 4.50% rate increase — was made by the Risk Council under its existing unrate-limited steward authority. Around the vault, yield funding has resumed and is now drawn from the Collector, while GHO exit inventory is mixed: GSM USDC is still empty, and GSM USDT fell from ≈50.81M GHO of value in July to ≈18.94M on September 27 before recovering to ≈34.60M.

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
| TokenLogic Collaborative | Mar 2026 | sGHO + sGhoSteward | [PDF](https://github.com/aave-dao/gho-origin/blob/main/audits/2026.03.04%20-%20Final%20-%20TokenLogic%20Collaborative%20Audit%20Report%201772584390.pdf) |

### sGHO-Specific Audit: Certora (September 2025)

- **Auditor:** Certora
- **Dates:** September 3-8, 2025
- **Scope:** `sGho.sol` in aave-dao/gho-origin
- **Findings:**
  - **0 Critical, 0 High, 0 Medium**
  - **1 Low (L-01):** Users can DoS vault actions by triggering `maxAction()` requires — Status: **Acknowledged**
  - **1 Informational (I-01):** Lack of pausability mechanism — Status: **Fixed** (pausability added)
- **Formal verification:** The published Certora sGHO engagement is a **manual code review** (September 3–8, 2025), not a formal-verification report. Separate Certora Prover suites exist under `certora/` for GHO token, GSM/GSM4626, and stewards; there is **no `certora/sgho` suite** and no published sGHO FV report. Do not treat the sGHO audit as formal verification.

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

A GhoRouter audit has been **commissioned and paid for but not published** (re-checked October 13, 2026). [AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md) (May/June 2026 funding update) transfers **11,655 aEthLidoGHO to TokenLogic** ([`0xAA08…9894`](https://etherscan.io/address/0xAA088dfF3dcF619664094945028d44E779F19894)) explicitly "for the GhoRouter audit reimbursement". No audit report for `GhoRouter.sol` appears in `gho-origin/audits/` and [PR #34](https://github.com/aave-dao/gho-origin/pull/34) remains unmerged. Treat the router as **unaudited from a public-evidence standpoint** until a report is published.

### Aave V3 Platform Audits

The broader Aave V3 platform (which sGHO integrates with for GSM and governance) has been audited extensively:

- Sherlock: Aave V3.3 contest ($230K prize pool, Jan 2025)
- Multiple prior audits from OpenZeppelin, Trail of Bits, SigmaPrime, Certora, and others

### Bug Bounty

- **Aave on Immunefi:** Active bug bounty covering GHO sub-systems. Max payout: **$1,000,000** (Critical)
  - Scope explicitly includes: GHO Token, GSM, stkGHO, GHO FlashMinter, CCIP bridge, stewards
  - Reward tiers: Critical $50K-$1M, High $10K-$75K, Medium $10K, Low $1K
  - Link: https://immunefi.com/bug-bounty/aave/
- **Note:** sGho vault is **still not** in Immunefi scope (re-checked October 13, 2026 — Aave Immunefi "Sub-systems of GHO" enumerates GHO stablecoin, GHO reserve of the Aave Pool, GHO FlashMinter, GSM/GSM4626, CCIP GHO bridge, GHO stewards, and GHO Remote Facilitators; sGho vault, sGho Steward, and any future GhoRouter are not listed). A $177M vault sitting outside the enumerated bounty scope is a material gap. Reassess scope after each Immunefi update

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

**sGho Roles (Verified On-Chain, October 13, 2026, block 26,181,150):**

| Role | Power | Holder (verified via `hasRole`) |
|------|-------|-----------------|
| `DEFAULT_ADMIN_ROLE` (`0x00…00`) | Grant/revoke all roles, full role management | Aave Governance Executor L1 ([`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) |
| `YIELD_MANAGER_ROLE` (`0x470f…fe27`) | `setTargetRate()` (max 50% APR), `setSupplyCap()` | sGho Steward ([`0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757`](https://etherscan.io/address/0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757)) |
| `PAUSE_GUARDIAN_ROLE` (`0x3bb1…21dd`) | `pause()`, `unpause()` — freezes all token operations | Aave Protocol Guardian ([`0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30`](https://etherscan.io/address/0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30)) **and** Aave Governance Executor L1 |
| `TOKEN_RESCUER_ROLE` (`0xbf63…9c06`) | `emergencyTokenTransfer()` — can rescue any token EXCEPT GHO | Aave Governance Executor L1 ([`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) |

No `RoleGranted` or `RoleRevoked` event has been emitted on sGho since the AIP-484 execution block (25,109,406).

**sGho Steward Roles (Verified On-Chain, October 13, 2026, block 26,181,150):**

| Role | Power | Holder(s) |
|------|-------|-----------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke steward sub-roles | Aave Governance Executor L1 ([`0x5300…192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) — Risk Council does **not** hold this |
| `FIXED_RATE_MANAGER_ROLE` (`0x9720…1e0e`) | Update `fixedRate` component of `targetRate` | Aave Governance Executor L1 **AND** GHO Risk Council Safe ([`0x8513e6F37dBc52De87b166980Fa3F50639694B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60)) (2-of-3) |
| `SUPPLY_CAP_MANAGER_ROLE` (`0xd80d…6c04`) | Update `supplyCap` on sGho | Aave Governance Executor L1 **AND** GHO Risk Council Safe |
| `AMPLIFICATION_MANAGER_ROLE` (`0xf8fb…6f6a`) | Update `amplification` component | GHO Risk Council Safe (Executor L1 has DEFAULT_ADMIN and can self-grant if needed) |
| `FLOAT_RATE_MANAGER_ROLE` (`0xdfb8…50d2`) | Update `floatRate` component | GHO Risk Council Safe |

**Consequence:** the GHO Risk Council 2-of-3 Safe can change `fixedRate` (the ASR), the supply cap, and the floatRate/amplification components **without a full DAO vote**, subject only to the `MAX_RATE` cap of 50% APR enforced inside sGho's `setTargetRate`. There is no per-second/per-day rate-limit on the Steward itself — the rate-limited stewardship pattern applies to `GhoGsmSteward`, not `sGhoSteward`. The Risk Council can set `fixedRate` anywhere in `[0, 5000]` bps in a single Safe execution, and **has now used this authority once**: on September 1, 2026 it raised `fixedRate` 425 → 450 bps in a MultiSend batch that also updated GHO borrow-rate parameters through the Aave Core stewards ([tx `0x7aa9fd…001f`](https://etherscan.io/tx/0x7aa9fd1ced00357442edddc4011fb3c11886fecbe3ab90f3cfd5c1ebec63001f)). The change was small and upward, but it increased the vault's unfunded accrual obligation by ~6% with no DAO vote.

**Signer overlap with the funding Safe.** Since August 23, 2026 the Risk Council's three signers are the Aave Labs, LlamaRisk, and TokenLogic nested Safes ([ARFC](https://governance.aave.com/t/arfc-gho-stewards-signer-update/25452)) — the same three signers as the AFC Safe that funds sGho yield. Any two of those organisations can both raise the ASR and decide whether to fund it. The LlamaRisk nested Safe ([`0xb291…Afef`](https://etherscan.io/address/0xb291232F480F41c75802C4a60F1D2AC03404Afef)) has an internal 1-of-3 threshold and is also a Protocol Guardian signer, so a single LlamaRisk signer plus one other organisation's internal quorum is enough to act on the Risk Council or the AFC. The signers are publicly attributed organisations, and each manages its own internal signers without DAO votes.

The Risk Council **has** exercised its parallel GSM authority: on May 23, 2026 it swapped the GSM USDC fee strategy from [`0x73bf…3080`](https://etherscan.io/address/0x73bf24cd7ba43803961c80ee678a5445ec413080) to [`0x06fb…AcC1`](https://etherscan.io/address/0x06fbDE909B43f01202E3C6207De1D27cC208AcC1), raising the buy (exit) fee from 7 bps to 10 bps ([tx `0xd47810…f0d8`](https://etherscan.io/tx/0xd47810e272039dea4b03d90a1352e9e405e9fee6fdd75b3fd8f733030d83f0d8)). On September 17, 2026 it raised the GSM USDC buy fee again, to 15 bps ([`0xfDB0…23dE`](https://etherscan.io/address/0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE), [tx `0xe967a8…b0b6`](https://etherscan.io/tx/0xe967a8ea12c94ed48deffa425dfb2ec2bfa2da1d0063b8d7d29d6dfb5df7b0b6)), and moved GSM USDT back to 10 bps after a brief increase to 15 bps on September 4. TokenLogic's [September parameter update](https://governance.aave.com/t/gho-stewards-september-2026-gho-parameter-update/25644) gives the rationale: with GHO about 10 bps below USDC, the higher USDC redemption fee is meant to stop arbitrageurs from draining the module at a DAO loss. These are within-rate-limit steward actions, but they show that the exit cost is a live, multisig-adjustable parameter.

**Mitigations:** (a) the `MAX_RATE = 5000` bps constant caps the worst case; (b) Safe execution emits `RateConfigUpdated`/`SupplyCapUpdated` events that are easy to monitor; (c) DEFAULT_ADMIN (Executor L1) can revoke Risk Council roles via a DAO vote if abuse is observed.

### GSM USDC — Can Admin Steal Funds?

| Vector | Possible? | Details |
|--------|-----------|---------|
| **Seize all waEthUSDC** | **YES** (but gated) | `seize()` sends all waEthUSDC to GHO Treasury. Requires `LIQUIDATOR_ROLE`, which has **never been granted** (zero `RoleGranted` logs for the role over full contract history). Aave Governance can grant this role and then call seize. Irreversible — permanently disables the GSM. Currently near-moot: the GSM holds only 0.03 waEthUSDC |
| **Freeze swaps (trap funds)** | **YES** | `SWAP_FREEZER_ROLE` can call `setSwapFreeze(true)`. Both Aave Governance and the ChainlinkOracleSwapFreezer hold this role. Freezes both `buyAsset` and `sellAsset` |
| **Auto-freeze on USDC depeg** | **YES** (automatic) | OracleSwapFreezer freezes swaps if USDC price falls outside [$0.99, $1.01]. Unfreezes when price returns to [$0.995, $1.005]. In a permanent depeg, funds could be trapped indefinitely |
| **Change fee to extract value** | **YES** (rate-limited, and exercised) | `CONFIGURATOR_ROLE` can call `updateFeeStrategy()`. The GhoGsmSteward is rate-limited to **+/- 0.5%/day** using the FixedFeeStrategyFactory (max 50% per strategy). Governance can deploy any fee strategy. The Risk Council raised the buy fee 7 → 10 bps on May 23, 2026 and 10 → 15 bps on September 17, 2026 |
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

Role holders verified July 27, 2026 via `hasRole` against every governance address in this report; a `RoleGranted`/`RoleRevoked` log scan on both GSMs from block 25,622,129 to 26,181,150 returns zero events, and `LIQUIDATOR_ROLE` has never been granted.

### GhoRouter — Can Admin Steal Funds?

| Vector | Possible? | Details |
|--------|-----------|---------|
| **Add malicious GSM to allowlist** | **YES** | Owner can call `setGsmAllowed()` with a malicious contract that passes basic validation (`GHO_TOKEN()` matches, `UNDERLYING_ASSET()` exists). Users calling swap functions through this malicious GSM could lose their tokens |
| **Drain user wallets** | **No** | Router cannot pull tokens users haven't approved for that specific call |
| **Rescue stranded tokens** | **YES** | Owner can call `rescueToken()` to transfer any ERC-20 held by the router to any address. The router is intended to avoid persistent balances, but stranded tokens remain an owner-controlled recovery path |
| **Pause the router** | **Draft-dependent** | The original draft had no router-level pause; later PR #34 revisions add pausability tests. GSM paths can also be disabled by removing GSMs from the allowlist, and direct GHO↔sGHO paths fail if sGHO is paused. Reassess against the deployed source |

**GhoRouter status (re-verified October 13, 2026): still not deployed.** The powers above are read from the [PR #34](https://github.com/aave-dao/gho-origin/pull/34) draft source and describe what the router *would* be able to do — they are not live risk today. Current facts:

| Gate from [issue #194](https://github.com/yearn/risk-score/issues/194) | Status (October 13, 2026) |
|---|---|
| `GhoRouter` proposal in [`aave-proposals-v3/src`](https://github.com/aave-dao/aave-proposals-v3/tree/main/src) | **No** — a full recursive tree listing of the repo returns no `GhoRouter` path |
| `GHO_ROUTER` entry in [`GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol) | **No** — the library lists `SGHO`, `SGHO_STEWARD`, GSMs, stewards, reserve, and facilitators; no router constant |
| [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) merged **and** deployed on mainnet | **No** — PR is open, not draft, and unmerged; latest commit `9c6c2a01` (merge of TokenLogic `main` into `gho-router`, September 16, 2026). It carries a full unit-test suite (`TestGhoRouterSwap`, `TestGhoRouterRescueToken`, `TestGhoRouterPausable`, …) and is still being maintained |
| Aave Immunefi scope includes `GhoRouter` | **No** — "Sub-systems of GHO" does not enumerate any router |

[AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md) reimbursed TokenLogic 11,655 aEthLidoGHO for a **GhoRouter audit**, and the PR includes a `docs/gho-router.md` and pausability tests that were absent from the original draft. No audit report or deployment payload has been published, and nothing is on-chain.

**Yearn's USDC → sGho strategy must therefore continue to compose USDC → waEthUSDC → GHO → sGho manually.** Even once deployed, the router would not change the economics: it wraps `GSM.sellAsset()`/`buyAsset()` calls, so the GSM exit fee (15 bps on USDC) and the GSM's exhausted underlying inventory both apply identically. Reassess the router's admin surface (`setGsmAllowed`, `rescueToken`, pause) when a payload actually deploys it.

## Critical Design Characteristic: Virtual/Unfunded Yield

**sGho's yield is accounting-based, not strategy-based.** This is fundamentally different from most ERC-4626 vaults:

1. The `yieldIndex` grows over time at `ratePerSecond`, making each sGho share worth more GHO. `totalAssets()` is defined as `_convertToAssets(totalSupply())` (sGho.sol:243-245) — it is a **pure function of shares × index and never reads the contract's GHO balance**
2. The actual GHO to back this growing obligation **must be transferred into the vault by the Aave DAO** (operationally, by the AFC Safe from treasury funds)
3. If the vault is not topped up, withdrawals become **first-come-first-served** — `maxWithdraw(owner) = min(super.maxWithdraw(owner), IERC20(GHO).balanceOf(sGho))` (sGho.sol:197-205). The single-owner cap is the vault's *entire* GHO balance, not a pro-rata share
4. There is **no mechanism to automatically mint GHO** to cover the yield, and no on-chain schedule, escrow, or keeper that enforces funding
5. The yield index grows independently of the actual GHO balance in the contract

### Who actually funds it, and how well

Enumerating every GHO `Transfer` into sGho since launch (3,220 inbound transfers) and matching them by transaction against the vault's 3,208 `Deposit` events isolates the transfers that added GHO **without** minting shares — i.e. the yield funding. There are twelve. Every one was executed by the **Aave Finance Committee (AFC) Safe** ([`0x22740deBa78d5a0c24C58C740e3715ec29de1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa), `MiscEthereum.AFC_SAFE`, 2-of-3). The first seven came from the AFC's own GHO balance. Since August 11, 2026 the AFC has pulled GHO directly from the Aave Collector ([`0x464C…e18c`](https://etherscan.io/address/0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c)) with `transferFrom`, using a Collector GHO allowance that has **7,406,000 GHO** remaining (`GHO.allowance(Collector, AFC)`), or roughly 11 months of accrual at the current rate and size:

| Date | Amount (GHO) | Token source | Tx |
|---|---|---|---|
| 2026-05-17 | 40,000 | AFC Safe | [`0x66184c…8792`](https://etherscan.io/tx/0x66184c2b22f33dc4f3fa7070f32e2647dc2a48db5ae4d5e9c6527fa5bf08b792) |
| 2026-05-26 | 100,000 | AFC Safe | [`0xbf2c34…f28a7`](https://etherscan.io/tx/0xbf2c34c0eec3aa8c12b25c11fc475e33a198e81ff5a470155fa993d8034f28a7) |
| 2026-06-04 | 150,000 | AFC Safe | [`0xf1fa6e…1863`](https://etherscan.io/tx/0xf1fa6e7e419d1c70e1b39f85f32f5b90c6689b18ae2413221409829ee6b17863) |
| 2026-06-18 | 250,000 | AFC Safe | [`0xed6919…f08c42`](https://etherscan.io/tx/0xed69196deb1f63d27362bbef0f8a9d3c61e8e570f7ac58948cbcf40147f08c42) |
| 2026-06-25 | 150,000 | AFC Safe | [`0x3333cd…73fd`](https://etherscan.io/tx/0x3333cd52c0f55fca91ade84249836424aa6d11983a578fba8052b19e12ad73fd) |
| 2026-06-29 | 150,000 | AFC Safe | [`0x3c049b…c9f5`](https://etherscan.io/tx/0x3c049b8e025fc7dd77c5e1f41c0bebee155be96c728697aa106b1f1efbcbc9f5) |
| 2026-07-31 | 500,000 | AFC Safe | [`0xe2e955…a49d`](https://etherscan.io/tx/0xe2e9556a24687bd724c5eab47346671b5d72a106aaf294966347b854a9a2a49d) |
| 2026-08-11 | 290,000 | Aave Collector (via AFC) | [`0x606984…3275`](https://etherscan.io/tx/0x606984498f2e623b55cea4bc22ae4f4ba19816de8c5b78ddc4216d4c62983275) |
| 2026-08-27 | 154,000 | Aave Collector (via AFC) | [`0xb79b3d…ec70`](https://etherscan.io/tx/0xb79b3d5cb92c760b869e1ccc83cc5ff31bbb5dc0aace941791534383efb2ec70) |
| 2026-09-08 | 330,000 | Aave Collector (via AFC) | [`0x75c05b…c7a5`](https://etherscan.io/tx/0x75c05b4763629b4d2c54d2a91e8b3a11401a0ebf7b670a1db5e0d9c66bc9c7a5) |
| 2026-09-20 | 250,000 | Aave Collector (via AFC) | [`0x499f2d…4e9d`](https://etherscan.io/tx/0x499f2dd731ee77a22325ca50210084d9283010885d0edeaa24882432a0bb4e9d) |
| 2026-09-30 | 220,000 | Aave Collector (via AFC) | [`0x3e7faa…a6ff`](https://etherscan.io/tx/0x3e7faa2077cc4aa14ddf4d5ba29826f1bcd80aa7df131495fa0714868c9ea6ff) |
| **Total** | **2,584,000** | | |

No top-up has been executed by the Governance Executor L1 or any party other than the AFC Safe.

### Current funding position (October 13, 2026, block 26,181,150)

| Quantity | Value (GHO) | Derivation |
|---|---|---|
| `totalAssets()` (obligation) | 176,935,740.60 | `cast call SGHO totalAssets()` |
| `GHO.balanceOf(sGho)` (actual) | 176,982,242.82 | `cast call GHO balanceOf(SGHO)` |
| Net principal (Σ `Deposit` − Σ `Withdraw` assets) | 174,398,242.82 | 454,531,734.08 in − 280,133,491.26 out |
| Yield obligation accrued since launch | 2,537,497.78 | `totalAssets` − net principal |
| Yield funded | 2,584,000.00 | twelve transfers above |
| **Funding buffer** | **+46,502.22** | **0.03% of `totalAssets`; ~2.1 days of accrual** |

The obligation now grows at `totalAssets × 4.50% / 365` ≈ **21,814 GHO/day**, up from ~15,890 GHO/day in July because of both TVL growth and the September 1 rate increase. The last top-up was on September 30 (13 days before this snapshot), so without another top-up the buffer turns negative around October 15, 2026.

**Funding history.** Sampling `balanceOf(sGho) − totalAssets()` about once a day from July 27 to September 27, and every 12 hours from September 27 to October 13, shows:

- The deficit kept widening after the July snapshot and peaked at ~269,000 GHO before the 500,000 GHO top-up on July 31, which ended a **32-day** funding gap
- Top-ups have since come every 10–16 days (August 11, August 27, September 8, September 20, September 30). The vault stayed in surplus except for a short deficit around **September 6–8, 2026** (peak ~32,600 GHO), which the September 8 transfer closed. From September 27 to October 13 the buffer stayed positive, falling from +152,179 to +93,401 GHO before the September 30 top-up lifted it to ~310,000, then declining steadily to +46,502
- Top-up sizes approximately cover accrual over each interval, so the buffer never exceeds ~320,000 GHO (~15 days of accrual)

The identity `balance = net principal + funding` holds exactly, so the vault's GHO balance currently covers every indexed claim.

**The mechanism that makes a deficit dangerous is unchanged.** Because `maxWithdraw` lets a single owner extract up to the *full* GHO balance (capped only by the vault total, not by a fair-share-of-shortfall), **early redeemers take their full virtual entitlement out of the shared GHO pool, and the residual is borne entirely by whoever is last**. Whenever the buffer turns negative, as it did in July and again in September, any positive shortfall can reach a late redeemer's principal; historical funding is not a protected cushion.

Illustrative worst case: 100 users each deposit 1 GHO at index 1.0. `yieldIndex` grows to 1.1 (10% virtual accrual) with no top-up — vault holds 100 GHO against 110 GHO of claims. If users 1–90 redeem first they each take 1.1 GHO (99 GHO drained). Users 91–100 then share the remaining 1 GHO — 0.1 GHO each, a **90% principal loss**.

**Implications for Yearn:**
- The funding is discretionary, manual, unscheduled, and executed by a **2-of-3 multisig**. There is no contract-enforced obligation, no escrow, and no rate limit on how long it can lapse. The Collector allowance improves the source of funds, but a top-up still needs an AFC transaction
- Since August 23, 2026 the AFC and the Risk Council that sets the ASR share the same three signers. A rate increase is therefore decided by the same parties who must fund it, but no rule links the two actions
- The buffer is deliberately thin: the observed pattern is roughly "fund accrued yield to date", so a single missed top-up reopens a deficit within days
- The right monitoring metric is the **signed buffer and its slope**: track `(balance − totalAssets) / totalAssets` and days since the last top-up. Today: +0.03% and 13 days
- A negative buffer is a principal-risk signal for a late redeemer. Monitor its size and slope to determine urgency
- A Yearn strategy holding a large share of sGho would be structurally *late* in any exit race, since unwinding a vault position is slower than an individual EOA redemption

## Historical Track Record

All on-chain numbers below from block 26,181,150 (2026-10-13 04:22 UTC) unless noted.

- **sGho vault:** **Live since May 16, 2026 (AIP 484 execution) — 150 days of production history, no security incidents.** `totalAssets() = 176,935,741 GHO` (~$176.7M at a GHO price of $0.9984), `totalSupply() = 173,834,355` shares. `convertToAssets(1e18) = 1.017841e18` → 1.78% accrued since launch. The ASR was 4.25% until September 1, 2026 and 4.50% since. The contract was deployed on May 5, 2026 and became operational when AIP 484 wired up the roles and supply cap on May 16. 3,208 deposits and 2,111 withdrawals processed
- **sGho funding:** 2,584,000 GHO of yield backing transferred in across twelve AFC-executed transactions (May 17 – September 30, 2026). The vault ran an unfunded-yield deficit from mid-July to July 31, 2026 (peak ~269,000 GHO) and briefly around September 6–8, 2026 (peak ~32,600 GHO). It currently holds a 46,502 GHO surplus
- **GHO stablecoin:** Launched July 2023 — **~3.25 years** in production
- **GHO mainnet supply:** 699.0M GHO (on-chain `totalSupply()`), up from 649.0M on July 27 and 584.0M in May
- **GHO market price:** $0.9984 ([DeFiLlama](https://coins.llama.fi/prices/current/ethereum:0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f)); 30-day daily range $0.9982–$0.9995. TokenLogic attributes the persistent ~10 bps discount mainly to Horizon looping activity ([September parameter update](https://governance.aave.com/t/gho-stewards-september-2026-gho-parameter-update/25644)). The Horizon GHO base rate was raised from 3.00% to 3.25% on September 16, 2026 (`RateDataUpdate` on Horizon's GHO rate strategy [`0x8759…b521`](https://etherscan.io/address/0x87593272C06f4FC49EC2942eBda0972d2F1Ab521), [tx](https://etherscan.io/tx/0x66ed50895fadfff18313f6a61caa4f6e02738fa86fbf97251b8fa442719a9dc8); `getInterestRateDataBps(GHO) = (9900, 325, 0, 0)`)
- **GSM USDC:** Operational but drained. `getAvailableLiquidity() = 0.03` waEthUSDC shares (≈0.035 USDC) against a 175M-share exposure cap; `getAvailableUnderlyingExposure() = 174,999,999.97`; `getUsed() = 0.03` GHO of a 210M facilitator limit; not frozen, not seized. Inventory fell from 111.25M waEthUSDC shares on May 19 to ~27 by June 12 and has stayed near zero since, a **~4-month** period with no GHO → USDC redemption capacity
- **GSM USDT:** `getAvailableLiquidity() = 29.35M` waEthUSDT shares, worth **≈34.60M USDT / GHO** through the price strategy, against an 85M-share exposure cap (≈100.2M GHO); `getUsed() = 34.55M` GHO of a 100M limit; not frozen. Its value fell from ≈50.81M GHO on July 27 to ≈18.94M on September 27 — TokenLogic reports a drop from 40.8M to 18.6M in the 30 days before September 15 ([source](https://governance.aave.com/t/gho-stewards-september-2026-gho-parameter-update/25644)) — and has since recovered to ≈34.60M. It remains the only GSM route with meaningful exit depth
- **GHO Reserve (GSM facilitator):** GHO balance = **275.45M**. The pre-minted pool available to GSMs is ample; the GSM constraint is underlying-asset inventory, not GHO
- **Legacy stkGHO:** Holds **30.51M stkGHO**, down from 42.03M on July 27 and 216.75M in May. Still on the legacy staking implementation (no proxy upgrade; sGho was launched as a separate ERC-4626 contract)
- **Aave V3 USDC market:** aEthUSDC holds 139.93M USDC of underlying liquidity (187.01M on September 27). The final `waEthUSDC → USDC` unwrap leg is unconstrained at current position sizes (`waEthUSDC.convertToAssets(1e6) = 1.189402` USDC)
- **Aave protocol:** One of the largest DeFi protocols, ~$17.31B Aave V3 TVL ([DeFiLlama](https://defillama.com/protocol/aave-v3), October 13, 2026; range $16.76B–$18.85B over the past 30 days), live since January 2020 (~6.75 years)
- **Security incidents (GHO):** No known exploits on GHO token, GSM, sGho, or stkGHO
- **Security incidents (Aave):** Aave V3 has not been exploited. Historical V1/V2 incidents exist but are not relevant to the V3 architecture

## Funds Management

### Strategy Pipeline: USDC → sGHO

**Step 1: USDC → waEthUSDC**

USDC is deposited into the Aave V3 USDC market and wrapped as waEthUSDC ([`0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E)), a staticAToken (ERC-4626) that represents an Aave V3 USDC supply position.

**Step 2: waEthUSDC → GHO (via GSM USDC)**

waEthUSDC is sold to the GSM USDC ([`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112)) at a fixed 1 USDC = 1 GHO price with no oracle. The price strategy converts each waEthUSDC share to its USDC value first, so the GHO received equals the USDC value of the shares, not the share count. The GSM draws GHO from the GHO Reserve ([`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9)) and transfers it to the caller. Sell fee: 0 bps. Deposit-direction headroom is currently the full 175M-share cap (≈208.1M GHO).

**Step 3: GHO → sGHO (deposit)**

GHO is deposited into the sGHO ERC-4626 vault. Shares are issued based on the current `yieldIndex`. No fee.

**Withdrawal pipeline:** Reverse path (sGHO → GHO → waEthUSDC → USDC), GSM buy fee 15 bps. **Step 2 of this path is currently blocked**: GSM USDC holds 0.03 waEthUSDC shares (≈0.035 USDC), so `buyAsset()` reverts with `INSUFFICIENT_AVAILABLE_EXOGENOUS_ASSET_LIQUIDITY` (Gsm.sol `_buyAsset`) for any size above that. See *Liquidity Risk* for the working alternatives.

> **Shared-pool caveat.** The GSM's underlying inventory (`_currentExposure`) is a single shared pool. Depositing via `sellAsset` raises it and creates exit capacity, but grants the depositor **no reserved claim** — any other participant can consume that capacity with `buyAsset`. A strategy that sizes its exit on the capacity its own deposit created is exposed to exactly the drain that emptied the GSM between May 19 and June 12, 2026.

### Accessibility

- **Deposits:** Permissionless — anyone can deposit GHO and receive sGHO shares (ERC-4626). Subject to supply cap (400M GHO; 176.9M used, 223.1M headroom)
- **Withdrawals:** Permissionless, atomic, no cooldown. Capped by actual GHO balance in vault (see Virtual Yield section above) — 176.98M GHO available today
- **GSM:** Permissionless — `sellAsset` and `buyAsset` available to anyone. Subject to exposure cap (175M waEthUSDC shares) and, on the `buyAsset` side, to available inventory. Can be frozen by oracle or governance
- **Fees:** 0% on sGHO deposit/withdrawal. 0 bps GSM sell fee (waEthUSDC → GHO). 15 bps GSM USDC buy fee (GHO → waEthUSDC); 10 bps on GSM USDT

### Collateralization

- **sGHO:** GHO deposited remains in the contract — **no rehypothecation**. `balanceOf(sGho) = 176.98M` covers `totalAssets() = 176.94M` (46,502 GHO surplus) and exceeds net principal deposits of 174.40M. Yield backing still depends on discretionary AFC Safe transfers. The buffer is about two days of accrual, and deficits occurred in July and September. During a deficit, withdrawals do not preserve principal for late users
- **GSM USDC:** Holds waEthUSDC (wrapped Aave USDC supply position). Each waEthUSDC is redeemable for USDC from Aave V3 (subject to Aave V3 liquidity, currently 139.93M USDC). Present waEthUSDC inventory: **0.03 shares**
- **GSM USDT:** 29.35M waEthUSDT shares (≈34.60M USDT) — the deepest currently available GSM redemption route for GHO
- **No leverage** in the pipeline
- **GHO itself:** Backed by over-collateralized Aave V3 loans and GSM stablecoin reserves; 699.0M mainnet supply

### Provability

- **sGHO exchange rate:** On-chain via ERC-4626 `convertToAssets()`/`convertToShares()`. Computed from `yieldIndex`, fully deterministic
- **sGHO actual backing:** `IERC20(GHO).balanceOf(sGHO)` shows actual GHO in vault. Compare to `totalAssets()` to detect any shortfall — this comparison is the only way to see the gap, since `totalAssets()` never reads the balance
- **Yield funding history:** fully reconstructible on-chain by differencing GHO `Transfer` logs into sGho against the vault's `Deposit` events (the residual is yield funding). No protocol-side accounting surfaces it
- **GSM exposure:** `getAvailableLiquidity()`, `getAvailableUnderlyingExposure()`, `getUsed()`, and `getLimit()` readable on-chain
- **GSM fees:** `getBuyFee()` / `getSellFee()` readable on-chain from the strategy returned by `getFeeStrategy()` (not from the Address Book, which is stale for this GSM)
- **GHO Reserve balance:** On-chain verifiable at [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9)

## Liquidity Risk

**Leg 1 — sGho → GHO: atomic, currently fully backed.** ERC-4626 `withdraw()`/`redeem()` has no cooldown or queue. The vault holds 176.98M GHO against 176.94M of claims. When the funding buffer is negative, early redeemers can still exit in full and the deficit falls on the last claims, including those holders' principal.

**Leg 2 — GHO → stablecoin: impaired, with no direct USDC route.** This is where the exit constraint sits:

| Route | Observed liquidity (October 13, 2026) | Cost | Notes |
|---|---|---|---|
| **GSM USDC** `buyAsset` | **0.03 waEthUSDC shares (≈0.035 USDC)** | 15 bps | Effectively dead. Reverts with `INSUFFICIENT_AVAILABLE_EXOGENOUS_ASSET_LIQUIDITY` above inventory. Not frozen, not seized — drained by other participants between May 19 and June 12, 2026 and near zero since |
| **GSM USDT** `buyAsset` | **29.35M waEthUSDT shares ≈ 34.60M USDT / GHO** (85M-share cap ≈ 100.2M GHO) | 10 bps | The deepest deterministic route. Value ≈50.81M GHO on July 27, ≈18.94M on September 27, ≈34.60M now. Exits to **USDT**, not USDC — a USDC-denominated strategy pays an additional USDT→USDC conversion |
| Fluid DEX GHO-USDC | ~$18.8M aggregate pool TVL | swap fee + slippage | Largest direct GHO→USDC venue by reported TVL ([DeFiLlama yields](https://yields.llama.fi/pools)); TVL is not executable USDC capacity |
| Uniswap v4 GHO-USDC | ~$3.0M aggregate pool TVL | swap fee + slippage | TVL is not executable USDC capacity |
| Curve GHO-crvUSD | ~$1.6M aggregate pool TVL | swap fee + slippage | Routes via crvUSD, not USDC |

**Executable GHO → USDC depth (aggregator quotes, October 13, 2026).** [KyberSwap aggregator](https://docs.kyberswap.com/developer-guide/aggregator-api/aggregator-api-specification/evm-swaps) route quotes for GHO → USDC on Ethereum. These are point-in-time routing estimates, not executed trades:

| Size (GHO) | USDC out | Shortfall vs 1:1 |
|---|---|---|
| 1M | 998,170 | 0.18% |
| 5M | 4,989,369 | 0.21% |
| 10M | 9,977,819 | 0.22% |
| 20M | 19,949,927 | 0.25% |
| 25M | 24,932,316 | 0.27% |
| 30M | 29,910,840 | 0.30% |
| 40M | 35,667,431 | **10.83%** |

The routes combine GSM USDT (`gsm-4626`, then USDT → USDC), Sky's LitePSM, Fluid, Curve, Uniswap v3/v4, and PancakeSwap v3 pools. About **30M GHO (~17% of sGho claims)** exits to USDC at under 0.3%, and the cost jumps past 10% before 40M, roughly where GSM USDT inventory runs out. Executable depth is therefore bounded mainly by GSM USDT inventory, a shared pool that halved between July and September before partly recovering.

**How the GSMs empty and refill.** `sellAsset` (stablecoin → GHO) raises `_currentExposure`; `buyAsset` (GHO → stablecoin) lowers it. Between mid-May and mid-June, GHO holders redeemed roughly 111M waEthUSDC shares out of GSM USDC, and TokenLogic reports GSM USDT falling from 40.8M to 18.6M (USD value) in the 30 days before September 15. An arbitrage refill needs GHO at or above $1 net of fees; GHO has traded at $0.9982–$0.9995 for the past 30 days. Non-arbitrage flows can still refill a module: GSM USDT inventory rose by ≈15.7M GHO of value between September 27 and October 13 while GHO stayed below $1. The sellers and their motives are not identified here. GSM USDC received no such inflow. The Risk Council raised the GSM USDC redemption fee to 15 bps and lowered GSM USDT to 10 bps ([rationale](https://governance.aave.com/t/gho-stewards-september-2026-gho-parameter-update/25644)). It also raised the Horizon GHO base rate from 3.00% to 3.25% on September 16, 2026 to reduce looping ([tx](https://etherscan.io/tx/0x66ed50895fadfff18313f6a61caa4f6e02738fa86fbf97251b8fa442719a9dc8)).

**Other liquidity factors:**

- **GSM freeze risk:** Oracle auto-freezes if USDC depegs outside [$0.99, $1.01]. Manual freeze possible by governance. During freeze, no `buyAsset` or `sellAsset`. Currently `getIsFrozen() = false` on both GSMs — the exit blockage is inventory exhaustion, not a freeze
- **GSM buy fee:** 15 bps on GSM USDC and 10 bps on GSM USDT. At the 4.50% ASR, breakeven against simply holding USDC requires holding sGho for ≥ **~12.2 days** via GSM USDC (~8.1 days via GSM USDT, before the USDT→USDC conversion)
- **Aave V3 USDC market:** the final `waEthUSDC → USDC` unwrap is unconstrained at current sizes (139.93M USDC of underlying liquidity, down from 187.01M on September 27), though Aave V3 USDC has previously pinned near 100% utilization
- **Deposit limit:** 400M GHO supply cap on sGho (223.1M headroom); 175M-share (≈208.1M GHO) exposure cap on GSM USDC (essentially all available on the deposit side)
- **Largest risk:** the strategy's documented USDC exit route has been unavailable for ~4 months. Executable USDC depth of ~30M GHO depends mostly on GSM USDT inventory, which other participants drained by 63% between July and September before it partly recovered. A Yearn USDC strategy larger than ~30M must accept a large price impact, a USDT hop, or a wait for GSM capacity

## Centralization & Control Risks

### Governance

sGHO and the GSM are governed through the **Aave DAO governance framework** — one of the most established on-chain governance systems in DeFi.

**Governance hierarchy:**

| Level | Entity | Power |
|-------|--------|-------|
| **Aave DAO** | On-chain governance (AAVE token voting) | Full control: upgrades, role changes, parameter changes, emergency actions |
| **Executor Level 1** ([`0x5300...`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) | Timelock executor | Executes passed proposals. DEFAULT_ADMIN on GSM and sGho |
| **GHO Risk Council** ([`0x8513...`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60)) | **2-of-3** Safe of nested organisation Safes — Aave Labs, LlamaRisk, TokenLogic (verified October 13, 2026; was 3-of-4 until August 23, 2026). No timelock on its steward actions | Parameter changes via steward contracts — rate-limited on GSMs, **not** rate-limited on sGhoSteward. Raised the ASR 4.25% → 4.50% on September 1, 2026 |
| **Aave Finance Committee (AFC)** ([`0x2274...`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa)) | **2-of-3** Safe with the **same three nested-Safe signers as the Risk Council** (verified October 13, 2026) | Executes every sGho yield top-up, since August 2026 from Collector GHO via allowance. Discretionary, unscheduled, not enforced by any contract |
| **Protocol Guardian** ([`0x2CFe...`](https://etherscan.io/address/0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30)) | 4-of-7 emergency multisig (owner set unchanged since July 27, 2026; includes the LlamaRisk nested Safe) | Pause capability |
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
| sGho Vault | **YES** (TransparentUpgradeableProxy) | Aave Governance Executor L1 (via ProxyAdmin [`0xc15700631020eba02317964550365b95a9a28adb`](https://etherscan.io/address/0xc15700631020eba02317964550365b95a9a28adb), `owner()` = [`0x5300…192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)). Implementation slot unchanged at [`0xff229a…7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04) |
| GSM USDC | **YES** (TransparentUpgradeableProxy) | Aave Governance Executor L1 (via ProxyAdmin [`0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21`](https://etherscan.io/address/0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21)). Implementation slot unchanged at [`0x320be9…7e8e`](https://etherscan.io/address/0x320be97b4d10b6d20a05cae53a479fa2a0187e8e) |
| GHO Token | **No** — Ethereum `GhoToken` is not a proxy (Etherscan proxy flag 0, empty EIP-1967 slot). The Certora "Upgradeable GHO" audit covers the upgradeable deployment used on other chains | Aave Governance controls facilitators and bucket capacities (mint authority), not the code |
| GhoRouter | N/A — not deployed | (Draft is non-upgradeable with an owner-managed GSM allowlist) |
| GHO Reserve | **YES** (TransparentUpgradeableProxy) | Aave Governance |

**All upgradeable contracts can have their implementation replaced by governance, which is the most powerful rug vector.** This is standard for Aave-governed contracts and relies on the trust assumption that Aave DAO governance (on-chain AAVE token voting with timelock) will not pass a malicious proposal.

### Programmability

| Factor | Assessment |
|--------|-----------|
| sGHO exchange rate | On-chain, algorithmic (yieldIndex-based), no admin input |
| sGHO yield rate | Set by YIELD_MANAGER_ROLE, max 50% APR (constant), updates index before changing. Currently 4.50% |
| GSM price | Fixed 1 stablecoin = 1 GHO, applied after converting wrapped shares to stablecoins (immutable FixedPriceStrategy4626). No price oracle; the share conversion reads the Aave static-aToken's own exchange rate |
| GSM fees | Set by CONFIGURATOR_ROLE, rate-limited via steward (GSM USDC buy fee changed twice since launch: 7 → 10 → 15 bps) |
| GSM freeze | Automatic (oracle-based) or manual (SWAP_FREEZER_ROLE) |
| Vault operations | Permissionless ERC-4626 deposit/withdraw |

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Aave DAO Governance** | Critical | Controls upgrades of sGHO, GSM, and GHO Reserve, GHO facilitator (mint) roles, and emergency actions |
| **GHO Token** | Critical | The underlying asset. Not upgradeable on Ethereum, but governance can add facilitators and change their mint buckets |
| **AFC Safe (2-of-3)** | Critical | **Only party that has ever topped up the vault.** No contract enforces it. Funding lapsed for 32 days in June–July; since then it has been regular (every 11–16 days) and the vault holds a ~7-day buffer. Same signers as the Risk Council |
| **GSM USDC** | Critical | USDC↔GHO conversion path. Upgradeable, freezeable, and currently exhausted on the exit side |
| **GSM USDT** | High | Currently the deepest working GHO exit route (≈18.94M USDT of value, down from ≈50.81M in July), but exits to USDT and is draining |
| **GHO Reserve** | Critical | Pre-minted GHO pool for GSM operations. 275.45M GHO held — ample |
| **Aave V3 USDC Market** | Critical | waEthUSDC (underlying for GSM) is an Aave V3 supply position; 139.93M USDC of underlying liquidity |
| **GHO DEX liquidity** | High | With the GSM USDC route dry, direct GHO→USDC pools report ~$24M aggregate TVL, but executable USDC output is lower and size/slippage-dependent |
| **Chainlink Oracle** | Medium | Powers auto-freeze on GSM via OracleSwapFreezer. Oracle failure could cause incorrect freeze/unfreeze |
| **Aave Collector / DAO revenue** | Medium | Source of the GHO that the AFC pulls into sGho (7.406M GHO allowance remaining). If revenue declines, yield backing could be insufficient |

## Operational Risk

- **Team:** Aave DAO — one of the most established DeFi protocols. Created by Aave Companies (formerly ETHLend), founded by Stani Kulechov in 2017. Publicly known team
- **Governance:** Fully on-chain Aave DAO governance with AAVE token voting. Established governance framework with multiple safety layers (guardian, stewards, timelocks)
- **Documentation:** Comprehensive Aave and GHO documentation. Source code verified on Etherscan (sGho implementation [`0xff229a…7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04) and GSM) and on GitHub
- **Legal:** GHO is a decentralized stablecoin governed by the Aave DAO. LlamaRisk flagged regulatory concerns under MiCA (EU prohibits interest on stablecoins) — potential legal risk for sGHO in regulated jurisdictions
- **Incident response:** Aave has a Protocol Guardian for emergency pauses. $1M Immunefi bug bounty (sGho not enumerated). Multiple steward contracts with rate-limited powers for rapid parameter adjustments without full governance votes
- **Yield-funding process:** This is still the weakest operational link, though it has improved. Top-ups are Safe transactions with no published cadence, no on-chain commitment, and no public dashboard reporting the funding gap. After a 32-day gap ending July 31, 2026, the AFC has funded every 11–16 days from a pre-approved Collector allowance. Each top-up roughly covers accrual to date, so the buffer stays thin, and one late top-up caused a short deficit around September 6–8
- **GSM operations:** GSM USDC has had effectively zero exit inventory for ~4 months. The DAO's published response ([September parameter update](https://governance.aave.com/t/gho-stewards-september-2026-gho-parameter-update/25644)) protects module inventory — higher USDC redemption fee, lower USDT fee — rather than seeding it. GSM USDT drained to ≈18.94M GHO of value by September 27 and has since recovered to ≈34.60M from flows not attributable to the DAO
- **Track record:** Aave V3 has not been exploited. GHO has operated without security incidents since its July 2023 launch (~3.25 years); sGho has run 150 days without incident

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Monitor |
|----------|---------|---------|
| sGho Vault | [`0xE1753F2e00940cC31213dd92013cF019DFE4ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `totalAssets()`, `convertToAssets(1e18)` (PPS), `IERC20(GHO).balanceOf(sGho)` vs `totalAssets()` (funding gap), `targetRate()`, `paused()`, Deposit/Withdraw/TargetRateUpdated/Paused events |
| sGho Steward | [`0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757`](https://etherscan.io/address/0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757) | `getRateConfig()`, `RateConfigUpdated`/`SupplyCapUpdated`/`RoleGranted`/`RoleRevoked` events |
| **AFC Safe** | [`0x22740deBa78d5a0c24C58C740e3715ec29de1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa) | GHO `Transfer` logs with `to = sGho` not matched by a `Deposit` — the yield top-ups (token source may be the AFC or the Collector). Alert on days-since-last-top-up; threshold + signer-set changes |
| Aave Collector | [`0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c`](https://etherscan.io/address/0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c) | `GHO.allowance(Collector, AFC)` — remaining pre-approved funding (7.626M GHO) |
| GSM USDC | [`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `getAvailableLiquidity()` (**exit capacity — currently ~0.03**), `getAvailableUnderlyingExposure()`, `getUsed()`, `getLimit()`, `getIsFrozen()`, `getIsSeized()`, `getFeeStrategy()`, FeeStrategyUpdated events |
| GSM USDT | [`0x882285E62656b9623AF136Ce3078c6BdCc33F5E3`](https://etherscan.io/address/0x882285E62656b9623AF136Ce3078c6BdCc33F5E3) | `getAvailableLiquidity()` in waEthUSDT shares; convert with the price strategy's `getAssetPriceInGho(shares, false)` — the fallback exit route's remaining depth (≈18.94M GHO, falling) |
| GHO Reserve | [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9) | GHO balance, limit vs used for GSM USDC |
| GHO Risk Council | [`0x8513e6F37dBc52De87b166980Fa3F50639694B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60) | Signer/threshold changes on the Council and on its three nested signer Safes (the LlamaRisk Safe is internally 1-of-3) |
| Oracle Swap Freezer | [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Freeze/unfreeze events |

### Critical Events to Monitor

- **sGHO funding gap** — `IERC20(GHO).balanceOf(sGHO) < totalAssets()`. Currently **false** (+46,502 GHO buffer, ~2.1 days of accrual). It was true from mid-July to July 31 and around September 6–8, 2026. Monitor the signed ratio `(balance − totalAssets) / totalAssets` and its slope, not just the boolean
- **Top-up lapse** — no unmatched GHO `Transfer` into sGho (AFC- or Collector-sourced) for > 21 days. Currently **13 days**; the post-July cadence is 10–16 days
- **sGHO rate changes** — `TargetRateUpdated` event (yield rate changed by steward or governance). Last fired September 1, 2026 (425 → 450 bps)
- **sGHO pause/unpause** — `Paused`/`Unpaused` events
- **GSM exit capacity** — `getAvailableLiquidity()` on both GSMs. This is the metric that failed silently: no event fires when the module drains
- **GSM freeze** — `SwapFreeze` event (manual or oracle-triggered)
- **GSM seize** — `Seized` event (last resort, irreversible)
- **GSM fee changes** — `FeeStrategyUpdated` event (GSM USDC: 7 → 10 bps on May 23, 10 → 15 bps on September 17, 2026; GSM USDT: 10 → 15 → 10 bps in September 2026)
- **GSM exposure cap changes** — `ExposureCapUpdated` event
- **Proxy upgrades** — `Upgraded` event on any TransparentUpgradeableProxy
- **Role changes** — `RoleGranted`/`RoleRevoked` events on sGHO and GSM
- **Safe signer changes** — `AddedOwner`/`RemovedOwner`/`ChangedThreshold` on the Risk Council and AFC Safes, and on their three nested signer Safes
- **GHO peg** — a sustained GHO price below $1 removes the arbitrage incentive that refills GSM exit inventory

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | sGHO | PPS tracking | Every 6 hours |
| `totalAssets()` | sGHO | Total yield obligations | Daily |
| `balanceOf(sGHO)` | GHO Token | Actual GHO in vault — **alert when it falls below `totalAssets()`; escalate if the deficit exceeds 0.25% of `totalAssets`** | Daily |
| GHO `Transfer(* → sGho)` logs not matched by `Deposit` | GHO Token | Days since last yield top-up — **alert at 21 days** | Daily |
| `allowance(Collector, AFC)` | GHO Token | Remaining pre-approved treasury funding for top-ups | Weekly |
| `getAvailableLiquidity()` | GSM USDC | waEthUSDC available for exit — **alert below the strategy's position size** | Every 6 hours |
| `getAvailableLiquidity()` | GSM USDT | Fallback exit depth — **alert below the strategy's position size** | Every 6 hours |
| `getAvailableUnderlyingExposure()` | GSM USDC | Remaining deposit-side headroom | Daily |
| `getUsed()` / `getLimit()` | GSM USDC | GHO reserve usage / limit for this facilitator | Daily |
| `getFeeStrategy()` + `getBuyFee()` | GSM USDC | Live exit fee (do not read from the Address Book) | Daily |
| `getIsFrozen()` | GSM USDC | Swap freeze status | Every 6 hours |
| `getIsSeized()` | GSM USDC | Seize status | Daily |

## Risk Summary

### Key Strengths

- **Extensive audit coverage:** 12+ audits since 2022 by top firms (OpenZeppelin, Certora, Sigma Prime, ABDK). Two sGHO-specific reviews (Certora Sep 2025 manual audit; TokenLogic Collaborative Mar 2026) found 0 critical/high/medium issues. Certora FV exists for GHO/GSM/stewards, not for sGHO itself
- **Stable contract surface for 150 days:** no upgrade, supply-cap change, pause, or role grant or revocation on sGho or sGhoSteward since AIP 484 executed. The only parameter change is the September 1, 2026 rate increase (4.25% → 4.50%), made under the Risk Council's existing authority
- **Aave DAO governance:** One of DeFi's most established on-chain governance systems. Upgrades and role changes require a DAO vote with timelock. Stewards handle day-to-day parameter management, rate-limited on the GSMs
- **Simple sGHO design:** No rehypothecation, no external strategies, no leverage. GHO stays in the vault. Yield is purely accounting-based
- **Currently fully backed:** the vault's GHO balance (176.98M) covers `totalAssets()` (176.94M) and exceeds net principal deposits (174.40M). Since August 2026, top-ups are drawn from a pre-approved Collector allowance (7.406M GHO remaining) on a 10–16-day cadence
- **GHO ecosystem maturity:** GHO live since July 2023 (~3.25 years), GSMs operational, 699M mainnet supply, no security incidents. Migration out of legacy stkGHO is well advanced (216.75M → 30.51M)
- **Aave protocol backing:** ~$17.31B Aave V3 TVL platform (DeFiLlama, October 13, 2026), 6+ years of operation, $1M bug bounty
- **Token rescue protection:** sGHO `maxRescue()` returns 0 for GHO (underlying asset cannot be rescued by admin). GSM protects user funds tracked in `_currentExposure`
- **GSM dangerous roles never granted:** `LIQUIDATOR_ROLE` (seize) has zero `RoleGranted` events over the GSM's full history; `TOKEN_RESCUER_ROLE` is likewise unassigned

### Medium-Severity Issues

- **Yield backing is discretionary and runs a thin buffer (MEDIUM):** `IERC20(GHO).balanceOf(sGho) = 176,982,243` against `totalAssets() = 176,935,741` — a **46,502 GHO surplus**, about 2.1 days of accrual at ~21,814 GHO/day, 13 days after the last top-up. Every top-up is a manual AFC Safe transaction ([`0x2274…1bFa`](https://etherscan.io/address/0x22740deBa78d5a0c24C58C740e3715ec29de1bFa), 2-of-3). No contract enforces, schedules, or escrows this funding. The vault ran a deficit of up to ~269,000 GHO before July 31, 2026 and a short one around September 6–8. Since August the funding has been regular and drawn from a Collector allowance, so this is a medium-severity strategy risk rather than a high-severity protocol failure. Implications for Yearn:
  - `maxWithdraw` is capped by the vault's whole GHO balance rather than a pro-rata share. Whenever the buffer turns negative, the entire shortfall lands on whoever exits last. A vault-sized position is structurally slower to unwind than an EOA
  - Top-ups roughly match accrual to date, so one missed top-up reopens a deficit within about a week
  - Treat any negative buffer as an active principal-risk signal; monitor the signed ratio, its slope, and days since the last top-up to size or exit the position

- **Rate-setting and funding are controlled by the same 2-of-3 signer set (MEDIUM):** since August 23, 2026 the GHO Risk Council, which can set the ASR anywhere in `[0, 5000]` bps in one transaction, and the AFC Safe, which funds that rate, are both 2-of-3 Safes over the same three nested organisation Safes (Aave Labs, LlamaRisk, TokenLogic). The Council threshold was lowered from 3-of-4 to 2-of-3, and the LlamaRisk nested Safe is internally 1-of-3. The Council used the unrate-limited sGhoSteward power for the first time on September 1, 2026 to raise the ASR to 4.50%. The signers are publicly attributed and the change followed a public [ARFC](https://governance.aave.com/t/arfc-gho-stewards-signer-update/25452). Still, rate increases and their funding now depend on the same small group, and no DAO vote is needed for either

- **The documented USDC exit route is exhausted, and executable depth depends on a volatile USDT fallback (MEDIUM):** GSM USDC holds **0.03 waEthUSDC shares (≈0.035 USDC)**. `buyAsset()` — step 2 of the withdrawal pipeline — has reverted above that size since roughly June 12, 2026. The module is **not** frozen or seized; other participants drained 111M waEthUSDC out of it between May 19 and June 12. GSM USDT fell from ≈50.81M GHO of value on July 27 to ≈18.94M on September 27, then recovered to **≈34.60M** (29.35M waEthUSDT shares) by October 13 while sGho grew to 176.9M. Arbitrage refills need GHO at or above $1, which GHO's ~$0.998 price does not support. The September–October recovery came from non-arbitrage flows that cannot be relied on. GSM USDT and DEX routes remain usable, so this is a medium-severity execution and liquidity constraint rather than a total loss of exitability. Implications for Yearn:
  - A USDC-denominated strategy has no fixed-price GSM path back to USDC today
  - GSM USDT offers ≈34.60M USDT of capacity at 10 bps but delivers **USDT**, adding a cross-stable conversion
  - Aggregator quotes route ~30M GHO to USDC at under 0.3%; 40M costs about 10.8%. Executable depth is about 17% of sGho claims
  - GSM capacity created by a Yearn deposit is **not reserved** for Yearn — it is a shared pool that any participant can consume

- **15 bps GSM USDC exit fee on every USDC withdrawal (MEDIUM):** Exiting from sGho back to USDC through GSM USDC requires a `GSM.buyAsset()` call charging **15 bps (0.15%)** on the GHO→waEthUSDC leg (verified on-chain at fee strategy [`0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE`](https://etherscan.io/address/0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE): `getBuyFee(1_000_000) = 1500`). The Risk Council raised it from 7 to 10 bps on May 23, 2026 ([tx](https://etherscan.io/tx/0xd47810e272039dea4b03d90a1352e9e405e9fee6fdd75b3fd8f733030d83f0d8)) and to 15 bps on September 17, 2026 ([tx](https://etherscan.io/tx/0xe967a8ea12c94ed48deffa425dfb2ec2bfa2da1d0063b8d7d29d6dfb5df7b0b6)). It applies on **every** withdrawal, so partial rebalances pay it repeatedly. At the 4.50% ASR, breakeven against holding raw USDC requires holding sGho for ≥**~12.2 days** (15 / 450 of a year). Implications for Yearn:
  - The fee is a flat percentage (`getBuyFee(1_000_000) = 1500`, `getBuyFee(10_000_000) = 15000`), so batching or splitting the same total does not change it; batching only saves gas
  - Every GHO → USDC conversion pays it, so rebalancing or harvest flows that round-trip through USDC add to the drag
  - Deposit direction is fee-free (`sellAsset` charges 0 bps), so the cost is purely on the exit path
  - **A GhoRouter would NOT eliminate this fee** — the router is a UX wrapper; it still calls `GSM.buyAsset()` under the hood
  - The fee is multisig-adjustable via the GhoGsmSteward (rate-limited to ±0.5%/day, max 50% per FixedFeeStrategy), and the Risk Council has moved it twice

### Other Key Risks

- **Still-short production history:** sGho went live on May 16, 2026 — 150 days (≈4.9 months) of mainnet usage, TEMPLATE History band **3–6 months**. Clean, but no stress event (depeg, mass redemption, pause) has been observed
- **sGho outside the bug-bounty scope:** a $177M vault that Immunefi's "Sub-systems of GHO" enumeration does not cover
- **GhoRouter not deployed:** the launch AIP marketed single-tx USDC→sGho onboarding, but no router exists. Yearn's USDC strategy must compose the GSM USDC + sGho deposit steps itself. Even when it ships, it would not change the GSM exit fee or the GSM's empty inventory — both sit at the GSM layer. A router audit has been paid for ([AIP 492](https://github.com/aave-dao/aave-proposals-reports/blob/master/reports/v3-492-aave-v3-MayJune-2026-Funding-Update.md)) but not published
- **Upgradeable contracts (rug via governance):** sGho, the GSMs, and GHO Reserve are upgradeable proxies controlled by Aave Governance, and governance can grant GHO facilitator (mint) roles. A malicious governance proposal could drain all funds or dilute GHO. Mitigated by Aave's established governance framework and community oversight; implementation slots verified unchanged
- **Unrate-limited Steward multisig:** the Risk Council 2-of-3 Safe can set the ASR anywhere in `[0, 5000]` bps and change the supply cap in a single execution, with no per-day limit. Used once so far (4.25% → 4.50% on September 1, 2026)
- **GSM freeze can trap funds:** oracle auto-freezes on USDC depeg, manual freeze by governance. Distinct from — and additive to — the current inventory exhaustion
- **Pause can freeze sGho:** PAUSE_GUARDIAN (Protocol Guardian and Executor L1) can freeze all sGho token operations (deposits, withdrawals, transfers). Mitigated by governance ability to revoke the guardian role
- **Cross-chain expansion dormant:** [ARFC Launch sGHO Cross-Chain](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) proposed extending sGho to Arbitrum via Chainlink CCIP with a pre-provisioned "fast path" liquidity buffer. The thread auto-closed on August 6, 2026 without a Snapshot, and no CCIP token pool is registered for sGho. If revived, it would add a messaging-layer dependency and a remote-liquidity trust assumption

### Critical Risks

- **Upgrade-based rug pull:** The theoretical worst case — a malicious Aave governance proposal that upgrades sGho or GSM to steal funds. The sGho ProxyAdmin owner is the DAO Executor L1, so this requires corrupting Aave's on-chain governance process, which has never happened in 6+ years of operation

---

## Risk Score Assessment

> **Note:** Scores below reflect on-chain state at block 26,181,150 (October 13, 2026). The sGho contract's code, admin, and roles are unchanged. The main penalties are (a) discretionary yield funding with a thin buffer, controlled by the same 2-of-3 signer set that sets the rate, (b) a vault history still under six months, and (c) exhausted GSM USDC exit inventory, with executable USDC depth bounded by a volatile GSM USDT pool.

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — 12+ GHO-ecosystem audits plus two sGHO-specific reviews (Certora manual audit; TokenLogic Collaborative). ✅ PASS
- [x] **Unverifiable reserves** — sGHO is ERC-4626, on-chain verifiable. GSM exposure on-chain. ✅ PASS
- [x] **Total centralization** — Aave DAO on-chain governance with timelock, stewards, and guardian. ✅ PASS
- [x] **Unverified contract source** — every contract in the deposit and withdrawal paths has verified source on Etherscan (checked September 27, 2026; implementation slots re-checked unchanged October 13, 2026): sGho implementation [`0xff22…7c04`](https://etherscan.io/address/0xff229a0bbb614a284de8ae0e41e5974878fd7c04) (`sGho`), sGho ProxyAdmin, `sGhoSteward`, GHO token (`GhoToken`), GHO Reserve implementation [`0x4f38…efe6`](https://etherscan.io/address/0x4f381f0827cb081b3ce2b7d7062402d43c4efbe6) (`GhoReserve`), GSM USDC and GSM USDT implementations [`0x320b…7e8e`](https://etherscan.io/address/0x320be97b4d10b6d20a05cae53a479fa2a0187e8e) / [`0x31fe…8788`](https://etherscan.io/address/0x31fe806ead0a800e68627aa49bab478d20a28788) (`Gsm4626`), waEthUSDC/waEthUSDT implementation [`0x487c…9ad1`](https://etherscan.io/address/0x487c2c53c0866f0a73ae317bd1a28f63adcd9ad1) (`StataTokenV2`), both fee strategies (`FixedFeeStrategy`), both price strategies (`FixedPriceStrategy4626`), `GhoGsmSteward`, and `ChainlinkOracleSwapFreezer`. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 2.0**

| Factor | Assessment |
|--------|-----------|
| Audits | sGHO: **2 protocol-specific reviews** — Certora (Sep 2025, manual code review of `sGho.sol`) and TokenLogic Collaborative via Sherlock (Feb–Mar 2026, `sGho` + `sGhoSteward`). Broader GHO stack has 12+ audits by top firms (OpenZeppelin, Certora, Sigma Prime, ABDK). **No published sGHO formal-verification suite** (Certora Prover covers GHO/GSM/stewards under `certora/`; no `certora/sgho`) |
| Bug bounty | Aave Immunefi max payout **$1,000,000**, but **sGho vault is still outside** the enumerated "Sub-systems of GHO" (re-verified October 13, 2026; program last updated April 17, 2026). Vault bounty coverage is therefore unconfirmed for scoring purposes |

→ **Audit score 2.0** — two reputable sGHO-specific reviews clear the rubric's "2+ audits" row. Held at 2 (rather than 1) because vault bounty coverage is unconfirmed and the sGHO engagement is a manual audit, not formal verification. This is the generous read of the audit column given those caveats.

**Subcategory B: Historical Track Record — 4.0**

| Factor | Assessment |
|--------|-----------|
| Production history | **sGho: 150 days** from AIP 484 activation (May 16, 2026) to snapshot (October 13, 2026) ≈ **4.9 months** → TEMPLATE band **3–6 months = 4**. Incident-free: 3,208 deposits / 2,111 withdrawals; no upgrade, pause, or role change |
| Scale (TVL) | sGho: 176.9M GHO (~$176.7M) — well above the <$10M band, but age of the **assessed vault** binds the History subscore |
| Parent longevity | GHO ~3.2 years / Aave V3 ~6.7 years do **not** establish this vault's reliability, especially its discretionary AFC funding mechanism |
| Security incidents | None on GHO, GSM, sGho, or Aave V3 |

→ **History score 4.0** — rubric age bracket for the vault itself. High TVL and parent-protocol age are noted but do not pull History below 4 while sGho remains under six months with an unenforced funding path.

**Audits & Historical Score = (2.0 + 4.0) / 2 = 3.00**

**Score: 3.00/5** — Conservative TEMPLATE application: strong-but-caveated audits averaged with a 3–6 month vault age. An optimistic read that weighted parent GHO/Aave history more heavily could still argue for Low Risk on the Final; this report takes the conservative path. Improves if sGho is added to Immunefi and/or after six months of clean vault operation (History → 3 on November 16, 2026, giving 2.5).

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Rubric column | Evidence | Row |
|--------|-----------|-----|
| Contract upgradeability | sGho, both GSMs, and GHO Reserve are TransparentUpgradeableProxies owned by Executor L1, so only an Aave DAO vote can upgrade them. GHO itself is not upgradeable on Ethereum | 1 |
| Timelock | **Upgrades and role changes:** ≥5 days end-to-end — 1-day voting cooldown, 3-day vote, 1-day Executor L1 payload delay (`getVotingConfig(1)`, `getExecutorSettingsByAccessControl(1)` on the [Governance](https://etherscan.io/address/0x9AEE0B04504CeF83A65AC3f0e838D0593BCb2BC7) and [PayloadsController](https://etherscan.io/address/0xdAbad81aF85554E9ae636395611C58F7eC1aAEc5) contracts). **sGho rate and supply cap:** no timelock — the Risk Council executes `sGhoSteward` changes immediately | 1 for code / 5 for sGho parameters |
| Privileged roles | GHO Risk Council: **2-of-3** Safe of nested organisation Safes (Aave Labs, LlamaRisk, TokenLogic); the LlamaRisk nested Safe is internally 1-of-3. Holds all four `sGhoSteward` roles with **no per-day rate limit**, so it can set the ASR anywhere in `[0, 5000]` bps and change the supply cap. The same three signers run the AFC Safe that funds the rate. It cannot move principal, upgrade code, or grant roles | 4 |

**Governance Score: 3.5/5** — Code and role control sit with one of DeFi's strongest DAO processes (row 1). The sGho-specific parameter path is the weak point and the one that bears on this vault's solvency: a low-threshold multisig with no timelock and no rate limit sets the obligation that its own signers must fund (rows 4–5). The 50% `MAX_RATE`, public attribution of the signers, and the inability to touch principal or code keep this below 4.0. Applying the "choose the higher score when uncertain" rule between 3.25 and 3.5, it scores 3.5, up from 3.0. Supporting facts:

- sGho ProxyAdmin ([`0xc157…8adb`](https://etherscan.io/address/0xc15700631020eba02317964550365b95a9a28adb)) is owned by the DAO Executor L1, and both the sGho and GSM implementation slots are verified unchanged.
- **The GHO Risk Council Safe ([`0x8513…4B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60)) holds all four sGhoSteward management roles** (`FIXED_RATE_MANAGER_ROLE`, `SUPPLY_CAP_MANAGER_ROLE`, `AMPLIFICATION_MANAGER_ROLE`, `FLOAT_RATE_MANAGER_ROLE`), in addition to Executor L1 holding the first two. It used the rate power on September 1, 2026 (425 → 450 bps).
- **The Council threshold fell from 3-of-4 to 2-of-3 on August 23, 2026, and its signer set is now identical to the AFC Safe's.** Any two of Aave Labs, LlamaRisk, and TokenLogic can set the ASR and decide whether to fund it.

Counterweight: the signers are publicly attributed service providers adopted through a public [ARFC](https://governance.aave.com/t/arfc-gho-stewards-signer-update/25452), and the one sGho rate change was small, upward, and in line with the September GHO rate adjustments. The score reflects the structure, not any observed misuse.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| sGHO PPS | On-chain, algorithmic (yieldIndex-based ERC-4626) |
| sGHO yield | Set by YIELD_MANAGER_ROLE — admin-controlled rate (not market-driven) |
| GSM price | Fixed 1 stablecoin = 1 GHO after wrapped-share conversion (immutable FixedPriceStrategy4626), fully deterministic |
| Vault operations | Permissionless ERC-4626 deposit/withdraw |
| Yield funding | **Off-chain and discretionary** — a 2-of-3 Safe must manually transfer GHO; `totalAssets()` never reads the balance, so the protocol accrues obligations regardless. Currently funded with a ~7-day buffer |

**Programmability Score: 2.5/5** — Rubric: PPS definition is on-chain with an admin-set rate parameter (row 2); system operations are hybrid because solvency depends on manual off-chain-decided top-ups (row 3). The sGHO exchange rate is fully on-chain and deterministic, and the GSM price strategy is immutable. The yield-funding dependency remains the limiting factor. Since July 31, 2026 the AFC has funded on an 11–16-day cadence from a pre-approved Collector allowance, which is an operational improvement. But every top-up is still a manual multisig transaction with no contract-level schedule, escrow, or enforcement, and a short deficit reopened around September 6–8 even under the new cadence. A vault whose stated price-per-share can diverge from its assets through an admin's inaction is materially less programmatic than one whose PPS is asset-derived. Held at 2.5.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Aave DAO (governance), AFC Safe + Aave Collector (yield funding), Aave V3 (waEthUSDC), GSM USDC + GSM USDT, GHO Reserve, Chainlink (oracle for freeze), GHO DEX liquidity |
| Criticality | Mostly within the Aave ecosystem — a single governance trust root — but with two critical single points: the AFC 2-of-3 Safe for yield backing, and third-party arbitrage flow for GSM exit inventory |
| Quality | Blue-chip: Aave is one of the largest DeFi lending protocols, ~$17.31B Aave V3 TVL, 6+ years |

**Dependencies Score: 3.0/5** — Rubric row 3 ("2–3 established protocol dependencies; some critical functions depend on them") fits better than row 2, which requires the dependencies to be non-critical. Solvency depends on the AFC Safe and Collector, and the documented exit depends on GSM inventory supplied by third-party arbitrage. GSM USDC has already failed functionally, and GSM USDT swung from ≈50.81M to ≈18.94M and back to ≈34.60M GHO of value between July and October. The dependencies are blue-chip and share one Aave trust root, which keeps this below row 4. Previously scored 2.5; re-scored to 3.0 on a strict rubric read.

**Centralization Score = (3.5 + 2.5 + 3.0) / 3 = 3.0**

**Score: 3.0/5** — Aave DAO governance remains a genuine strength for code and role changes. The rise from 2.75 comes from applying the rubric strictly to the two paths that matter for this vault. First, an un-timelocked 2-of-3 multisig both sets the rate and funds it. Second, solvency and exit rest on critical dependencies that are discretionary or third-party-driven. Programmability is unchanged at 2.5.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | GHO deposits stay in sGHO contract (no rehypothecation). GSM holds waEthUSDC (wrapped Aave USDC) |
| Collateral quality | GHO: backed by over-collateralized Aave V3 loans and GSM stablecoins. waEthUSDC: USDC supply on Aave V3 |
| Leverage | None |
| Yield backing | **Virtual, currently funded with a thin buffer** — +46,502 GHO (0.03% of `totalAssets`, ~2.1 days of accrual, 13 days after the last top-up). Deficits occurred in mid/late July (peak ~269,000 GHO) and around September 6–8 (peak ~32,600 GHO) |

**Collateralization Score: 2.75/5** — There is no rehypothecation, GHO stays in the vault, the balance currently covers every indexed claim, and the underlying assets are blue-chip with no leverage. The score stays at 2.75 rather than returning to 2.5 because the unfunded-yield condition has proven recurrent, not a one-off. It reappeared in September under the new funding cadence. The observed funding pattern leaves at most about two weeks of buffer, and only about two days at this snapshot. During any deficit, `maxWithdraw` allocates the shortfall to whoever exits last rather than pro rata. Deficits have been small relative to `totalAssets()` and are funded by an Aave DAO-controlled Safe, so this is a medium-severity impairment path, not a high-severity collateral failure. Returns to 2.5 if the buffer stays positive for a full quarter.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | sGHO: on-chain (ERC-4626). GSM: on-chain (`getAvailableLiquidity()`, `getUsed()`, `getLimit()`). GHO Reserve: on-chain |
| Exchange rate | sGHO: on-chain via yieldIndex. GSM: fixed 1 stablecoin = 1 GHO after on-chain share conversion |
| Funding gap | Detectable: compare `balanceOf(GHO, sGHO)` vs `totalAssets()`; funding history reconstructible by differencing `Transfer` against `Deposit` logs |
| Third-party | Chainlink oracle for GSM freeze. [TokenLogic's GHO dashboard](https://aave.tokenlogic.xyz/gho) provides live sGHO supply, rate, mint/burn, holder, user-activity, GHO, and Stability Module analytics. All data remains independently verifiable on-chain |

**Provability Score: 1.25/5** — Excellent on-chain transparency, strengthened by [TokenLogic's GHO dashboard](https://aave.tokenlogic.xyz/gho), which presents live sGHO, GHO, and Stability Module analytics without requiring an integrator to reconstruct basic activity and market data from logs. Every claim in this report remains reproducible from primary on-chain data. The score stays above 1.0 because the most safety-critical reconciliation — `totalAssets() − balanceOf(GHO, sGho)` and the attribution of top-ups — is still not surfaced as a first-class protocol or dashboard health metric, and neither a funding-gap opening nor a GSM inventory drain emits an event.

**Funds Management Score = (2.75 + 1.25) / 2 = 2.0**

**Score: 2.0/5** — Provability remains a genuine strength and the vault is currently fully backed. Collateralization is held at 2.75 because the funding deficit recurred in September and the buffer is structurally thin. Unchanged.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| sGHO exit (leg 1) | Atomic ERC-4626 redemption, no cooldown. 176.98M GHO backs 176.94M of claims; during a deficit, early users exit in full and the last claims absorb it |
| GHO → USDC via GSM USDC (leg 2) | **0.03 waEthUSDC shares (≈0.035 USDC) available — route effectively dead since ~June 12, 2026 (~4 months)** |
| GHO → USDT via GSM USDT | 29.35M waEthUSDT shares ≈ 34.60M USDT / GHO at 10 bps (≈50.81M on July 27, ≈18.94M on September 27), delivers USDT not USDC — ~20% of sGho claims |
| GHO → USDC executable (aggregator) | ~30M GHO at ≤0.30% shortfall; 40M at 10.83% (KyberSwap quotes, October 13, 2026, routing through GSM USDT, LitePSM, Fluid, Curve, Uniswap) |
| Exit fee | 15 bps at GSM USDC (7 → 10 bps May 23, 10 → 15 bps September 17, 2026); ~12.2-day breakeven at the 4.50% ASR. 10 bps at GSM USDT |
| Freeze risk | GSM auto-freezes on USDC depeg [$0.99, $1.01]. Manual freeze possible. Additive to the current exhaustion |
| Pause risk | sGHO pause blocks all token operations including withdrawal |
| Supply cap | 400M GHO (sGHO, 223.1M headroom), 175M waEthUSDC shares ≈ 208.1M GHO (GSM, essentially all available on the deposit side only) |

| Rubric column | Evidence | Row |
|---|---|---|
| Exit mechanism | sGho → GHO is direct and instant (row 1). GHO → USDC has **no direct route** (GSM USDC empty since ~June 12). GHO → USDT is a direct fixed-price redemption at 10 bps (row 2), but in a different stablecoin. GHO → USDC via aggregators is market-based (row 3) | 2.5–3 |
| Liquidity depth | Quoted ~30M GHO → USDC at ≤0.30% shortfall — ">$10M, <0.5% slippage" | 1 |
| Large-holder impact | Executable depth is about 17% of sGho claims. A position above ~30M takes >10% impact or must wait for GSM refills, and the depth itself swung by ~±16M GHO in two weeks | 4 |

**Score: 3.25/5** — The rubric columns average about 2.6. Adjustments add roughly 0.5. First, executable depth is bounded by GSM USDT inventory, a shared pool that halved between July and September before recovering through flows that cannot be relied on, and Yearn's own deposits create no reserved capacity. Second, there is no direct USDC route, and the USDC exit fee is multisig-adjustable and was raised to 15 bps. That lands between 3.0 and 3.25; the conservative rule gives 3.25. Leg 1 is atomic and currently fully backed. Down from 3.5 at the September 27 snapshot because size-specific quotes now show ~30M of executable depth at under 0.3%, and GSM USDT recovered to ≈34.60M GHO. Returns to 3.5 if GSM USDT falls back below ~20M GHO of value or below the intended position size. Improves toward 2.75 if GSM USDC inventory recovers to a multiple of the position size and holds.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Aave — top-tier DeFi team, publicly known, 6+ years of operation. Risk Council and AFC signers are publicly attributed service providers (Aave Labs, LlamaRisk, TokenLogic) |
| Governance | Fully on-chain Aave DAO. Multiple safety layers (guardian, stewards, timelocks, auto-freezer) |
| Documentation | Comprehensive Aave and GHO docs. Source code open and verified. GSM fee changes are explained in public steward posts |
| Legal | LlamaRisk flagged MiCA (EU) prohibits interest on stablecoins — regulatory risk for sGHO |
| Incident response | Protocol Guardian for emergencies. $1M bug bounty (sGho not enumerated). Rate-limited stewards on the GSM |
| Yield funding process | **Weakest link, improved** — after a 32-day lapse ending July 31, 2026, the AFC has funded every 11–16 days from a Collector allowance. Still no published schedule, no on-chain commitment, no public reporting of the gap, and a short deficit around September 6–8 |
| GSM operations | GSM USDC has held ~zero exit inventory for ~4 months. The published response raises the USDC redemption fee rather than seeding inventory; GSM USDT halved by late September before partly refilling |
| Monitoring | Chainlink oracle auto-freezer on GSM. sGho-specific monitoring remains ad-hoc — no published alerting for the two conditions that matter most (funding gap, GSM inventory), and neither emits an event, so both are invisible to event-only monitoring |

**Score: 2.0/5** — Top-tier team, documentation, and governance infrastructure; sGho contract operations have been clean for 150 days. The yield-funding routine is more regular than in July but still undocumented and thin, the GSM USDC exit route has been empty for ~4 months, and the two most important health metrics can only be polled, with no protocol-side alerting. Regulatory uncertainty (LlamaRisk MiCA concerns) is unchanged. Unchanged at 2.0.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (3.0 × 0.30) + (2.0 × 0.30) + (3.0 × 0.20) + (3.25 × 0.15) + (2.0 × 0.05)
            = 0.90 + 0.60 + 0.60 + 0.4875 + 0.10
            = 2.6875
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.00 | 20% | 0.60 |
| Centralization & Control | 3.0 | 30% | 0.90 |
| Funds Management | 2.0 | 30% | 0.60 |
| Liquidity Risk | 3.25 | 15% | 0.4875 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.68/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Risk Tier: Medium Risk (2.68/5.0) — Approved with enhanced monitoring**

> The sGho contract itself has been clean: 150 days, 5,319 user operations, growth to $177M, and no upgrade, pause, or role change. Every category is scored column-by-column against the TEMPLATE rubric. Audits & Historical is **(Audit 2 + History 4) / 2 = 3.00** because the vault is 3–6 months old. Centralization is **3.0** because an un-timelocked 2-of-3 Safe both sets the rate and funds it, and solvency and exit rest on critical discretionary or third-party dependencies. Liquidity is **3.25**: there is no direct USDC exit, and quoted executable depth is ~30M GHO (about 17% of claims), bounded by a volatile GSM USDT pool. Funds Management (2.0) and Operational (2.0) are unchanged. Final **2.68 Medium** (floored).
>
> **Enhanced monitoring for this position must cover the two event-less conditions:** poll the signed buffer `(balanceOf − totalAssets) / totalAssets` and days since the last top-up daily, treating any negative buffer as active late-redeemer principal risk; and poll `GSM.getAvailableLiquidity()` on both GSMs at least every 6 hours, sizing any position against observed inventory plus size-specific DEX quotes rather than exposure caps or aggregate pool TVL.
>
> Score improves to about 2.58 on November 16, 2026, when sGho reaches six months of clean operation (History → 3). It reaches the Low-risk band (~2.47) only if GSM USDC exit inventory also recovers and holds (Liquidity → 2.75) and the funding buffer stays positive for a quarter (Collateralization → 2.5). Lasting improvement below that needs sGho in Immunefi scope or per-day rate limits / a timelock on `sGhoSteward`. Score worsens if the funding gap reopens for more than a few days, if GSM USDT falls below the intended position size, if the ASR is raised again without matching funding, if the cross-chain CCIP ARFC is revived and ships without a re-review, or if a GhoRouter is deployed with broad token-rescue powers.

---

## Appendix: USDC ↔ sGho Conversion Flows

Step-by-step view of the Yearn USDC strategy's two flows, with explicit fees at each leg. All values verified on-chain at block 26,181,150 (October 13, 2026).

### Deposit Flow: USDC → sGho

| # | From → To | Contract | Call | Fee | Notes |
|---|---|---|---|---|---|
| 1 | USDC → waEthUSDC | Aave V3 USDC market + static-aToken wrapper [`0xD4fa…D23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E) | `deposit(usdc, receiver)` | **0%** | USDC starts earning Aave V3 supply APY while held as waEthUSDC |
| 2 | waEthUSDC → GHO | GSM USDC [`0x3A38…4112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `sellAsset(waEthUSDC_amount, receiver)` | **0 bps (0%)** | Fixed 1 USDC = 1 GHO after share conversion (FixedPriceStrategy4626 [`0xEE73…D64f`](https://etherscan.io/address/0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f)), so 1 waEthUSDC share yields ≈1.187 GHO; fee strategy [`0xfDB0…23dE`](https://etherscan.io/address/0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE) returns 0 for sell side. 174,999,999.97 waEthUSDC of headroom under the 175M exposure cap |
| 3 | GHO → sGho | sGho [`0xE175…ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `deposit(gho_amount, receiver)` | **0%** | Standard ERC-4626 — no deposit fee. 223.1M GHO of headroom under the 400M supply cap |

**Total deposit-side fees: 0%.** The deposit direction is entirely unconstrained today. Costs are gas + any GSM unavailability (oracle freeze) + sGho pause. Note that step 2 *creates* GSM exit capacity that any other participant may consume before the strategy tries to use it.

### Withdrawal Flow: sGho → USDC

| # | From → To | Contract | Call | Fee | Notes |
|---|---|---|---|---|---|
| 1 | sGho → GHO | sGho [`0xE175…ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `withdraw(gho_amount, receiver, owner)` or `redeem(shares, receiver, owner)` | **0%** | No withdrawal fee. Capped by `IERC20(GHO).balanceOf(sGho)` = 176,982,243 GHO (single-owner cap, not pro-rata) — see "Virtual/Unfunded Yield" for the first-come-first-served shortfall allocation |
| 2 | GHO → waEthUSDC | GSM USDC [`0x3A38…4112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `buyAsset(waEthUSDC_amount, receiver)` | **15 bps (0.15%)** ⚠️ | **Currently reverts above 0.03 waEthUSDC** (`INSUFFICIENT_AVAILABLE_EXOGENOUS_ASSET_LIQUIDITY`). Fee strategy [`0xfDB0…23dE`](https://etherscan.io/address/0xfDB0090A92d20EE39d82ac680477b1F58f0A23dE): `getBuyFee(1_000_000) = 1500`. GhoRouter would NOT eliminate this — it's charged at the GSM layer regardless of caller |
| 3 | waEthUSDC → USDC | static-aToken wrapper + Aave V3 USDC market | `redeem` / `withdraw(usdc, receiver, owner)` | **0%** | Subject to Aave V3 USDC pool liquidity — 139.93M USDC available today |

**Total withdrawal-side fees: 15 bps (0.15%)** — but step 2 is currently unavailable at any meaningful size. At the 4.50% sGho APR, breakeven against just holding raw USDC is ~12.2 days (15 / 450 of a year).

**Working substitute for step 2 today:**

| Route | Call | Liquidity indicator | Cost | Output |
|---|---|---|---|---|
| GSM USDT | `buyAsset` on [`0x8822…F5E3`](https://etherscan.io/address/0x882285E62656b9623AF136Ce3078c6BdCc33F5E3) | 29.35M waEthUSDT shares ≈ 34.60M USDT | 10 bps + USDT→USDC conversion | USDT |
| Fluid DEX GHO-USDC | swap | ~$18.8M aggregate pool TVL; quote required | swap fee + slippage | USDC |
| Aggregator (GHO → USDC) | swap | ~30M GHO at ≤0.30% shortfall; 40M at 10.83% (October 13, 2026 quotes) | quoted shortfall | USDC |
| Uniswap v4 GHO-USDC | swap | ~$3.0M aggregate pool TVL; quote required | swap fee + slippage | USDC |

### Failure Modes That Block These Flows (no fee, but liquidity risk)

| Condition | Blocks | Recovery |
|---|---|---|
| `sGho.paused = true` | Steps 1+3 of deposit (the sGho `deposit` call) and step 1 of withdrawal | Protocol Guardian or DAO `unpause()` |
| `GSM.isFrozen() = true` (oracle auto-freeze on USDC depeg outside [$0.99, $1.01], or manual governance freeze) | Step 2 of both flows | Oracle unfreezes when USDC returns to [$0.995, $1.005]; or DAO unfreezes manually |
| **`GSM.getAvailableLiquidity()` below the requested size — ACTIVE, 0.03 waEthUSDC shares (≈0.035 USDC)** | Step 2 of withdrawal (`buyAsset` reverts) | Only refills when a third party calls `sellAsset`, which requires GHO ≥ $1 after sell-side costs. GHO is at $0.9990, so there is no current incentive. The September 17, 2026 increase of the `buyAsset` fee to 15 bps is meant to slow further drains, not to refill the module. Governance could seed the module or create a sell-side refill incentive; lowering the `buyAsset` fee would instead make inventory draining cheaper |
| GSM exposure at 175M-share cap (≈208.1M GHO) | Step 2 of deposit only (`sellAsset`) | Wait for withdrawals to free capacity, or DAO raises cap. Not binding today (~175M available) |
| sGho `supplyCap` (400M GHO) reached | Step 3 of deposit | DAO raises cap via Steward `SUPPLY_CAP_MANAGER_ROLE`. Not binding today (223.1M headroom) |
| `IERC20(GHO).balanceOf(sGho) < totalAssets()` — **not active, but about two days away** (+46,502 GHO buffer, 13 days after the last top-up); occurred mid/late July and September 6–8, 2026 | Step 1 of withdrawal for the last claims out — **any deficit can become principal loss for late redeemers after earlier users take their full indexed claims** | AFC Safe tops up GHO from the Collector allowance (last done September 30, 2026). Yearn-side mitigation: treat any negative buffer as principal risk; track its ratio and slope and size or exit before it widens |
| Aave V3 USDC pool at high utilization | Step 3 of withdrawal | Wait for borrowers to repay, or use DEX path. Not binding today (139.93M USDC available) |

---

## Reassessment Triggers

- **Time-based:** Reassess after November 16, 2026, when sGho reaches six months of production history (History subscore 4 → 3), or sooner if any trigger below fires
- **Funding-based:** Reassess if `balanceOf(GHO, sGho) < totalAssets()` for more than 5 consecutive days, if the deficit exceeds **0.25%** of `totalAssets()`, if no top-up occurs for **21 days** after September 30, 2026 (October 21), or if the Collector → AFC GHO allowance (7.406M) is revoked or exhausted without replacement
- **Liquidity-based (currently firing):** GSM USDC `getAvailableLiquidity()` has been ~0 for ~4 months. Re-review if it recovers above the intended position size and holds for 30 days (upgrade case), or if GSM USDT capacity (≈34.60M GHO of value; 29.35M shares) falls below ~20M GHO or the intended position size (downgrade case)
- **TVL-based:** Reassess if sGho TVL changes by more than ±50% from 176.9M GHO, or if it approaches the 400M supply cap
- **Incident-based:** Reassess after any exploit, governance attack, or Aave protocol incident
- **Peg-based:** Reassess if GHO trades below $0.99 for more than 48 hours — this both removes the GSM refill incentive and stresses the exit path
- **Rate-based:** Reassess on any `TargetRateUpdated` / `RateConfigUpdated` event (last: 425 → 450 bps on September 1, 2026), or if the ASR exceeds the GHO borrow rate (arbitrage risk per LlamaRisk)
- **Fee-based:** Reassess on any `FeeStrategyUpdated` on GSM USDC or GSM USDT (USDC buy fee is now 15 bps; USDT 10 bps)
- **GSM-based:** Reassess if a GSM freeze lasts >24 hours or if `LIQUIDATOR_ROLE` is granted to any address
- **Governance-based:** Reassess if sGho proxy admin, implementation, or role assignments change; if the Risk Council or AFC threshold or signer set changes, including the internal thresholds of their nested signer Safes; if per-day rate limits are added to `sGhoSteward`; or if a GhoRouter is deployed and granted token-rescue / approval-handling roles ([issue #194](https://github.com/yearn/risk-score/issues/194))
- **Cross-chain:** Reassess if [ARFC Launch sGHO Cross-Chain](https://governance.aave.com/t/arfc-launch-sgho-cross-chain/25217) is revived and escalated to Snapshot or AIP, or if a CCIP token pool is ever registered for sGho — this would add a messaging-layer dependency and require a `src/data/bridges.json` entry
- **Bug bounty:** Reassess if sGho or sGho Steward are added to the Aave Immunefi scope
- **Migration-based:** Legacy stkGHO is down to 30.51M from 216.75M. Reassess if the residual is force-migrated or unwound via a mechanism that touches sGho
- **Regulatory:** Monitor MiCA enforcement actions related to interest-bearing stablecoins

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| April 2, 2026 | 2.1 | Pre-deployment assessment from ARFC/audit material; rechecked April 22, 2026 |
| May 19, 2026 | 2.3 | Post-deployment refresh after AIP 484. On-chain roles, ProxyAdmin, rate, and supply cap verified. Centralization 2.0 → 2.5 (Risk Council holds unrate-limited sGhoSteward roles); Collateralization 2.0 → 2.5 (late-withdrawer impairment path) |
| July 27, 2026 (updated Aug 6) | 2.50 | 72-day reassessment. sGho contract itself unchanged and clean; TVL 37.3M → 136.5M GHO. Live 205,146 GHO unfunded-yield gap (AFC Safe funding lapsed 28 days); GSM USDC exit inventory exhausted (111.25M → 9.95 waEthUSDC); GSM buy fee 7 → 10 bps. The funding gap, GSM USDC exhaustion, and exit fee are classified as medium-severity strategy risks, not high-severity protocol failures. Liquidity 2.5 → 3.5, Centralization 2.5 → 2.75, Funds Mgmt remains 2.0 after Collateralization 2.5 → 2.75 and Provability 1.5 → 1.25 (TokenLogic dashboard), Operational 1.5 → 2.0, Audits 2.5 → 2.25 |
| [October 13, 2026](https://github.com/yearn/risk-score/pull/494) | 2.68 | 150-day reassessment (rubric-scored, snapshot rolled forward from September 27). sGho contract code, admin, and roles unchanged; TVL 136.5M → 176.9M GHO. ASR raised 4.25% → 4.50% by the Risk Council (September 1). Yield funding resumed July 31; the AFC now pulls from a Collector allowance (12 top-ups, 2.584M GHO). The vault holds a 46,502 GHO buffer (~2 days), with a short deficit around September 6–8. Risk Council reconstituted 3-of-4 → 2-of-3 with the same nested-Safe signers as the AFC. GSM USDC still empty (fee 10 → 15 bps); GSM USDT ≈50.81M → ≈18.94M (September 27) → ≈34.60M GHO of value. Aggregator quotes show ~30M GHO → USDC at ≤0.3%. GHO token corrected to non-upgradeable on Ethereum; Horizon GHO rate 3.25% verified. **Audits & Historical 2.25 → 3.00** (Audit 2 + History 4 for a 3–6 month vault; no sGHO formal verification). Governance 3.0 → 3.5 (un-timelocked 2-of-3 rate setter that also funds the rate) and Dependencies 2.5 → 3.0 (critical, discretionary or third-party), so Centralization 2.75 → 3.0. Liquidity 3.5 → 3.25 (quoted depth >$10M at <0.5%, but only ~17% of claims). Funds Mgmt and Operational unchanged. Final 2.50 → **2.68 Medium** |
