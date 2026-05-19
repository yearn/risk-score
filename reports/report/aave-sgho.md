# Protocol Risk Assessment: Aave — sGHO

- **Assessment Date:** April 2, 2026 (rechecked April 22, 2026; refreshed post-deployment May 19, 2026)
- **Token:** sGho (GHO Savings Vault)
- **Chain:** Ethereum
- **Token Address:** [`0xE1753F2e00940cC31213dd92013cF019DFE4ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d)
- **Final Score: 2.1/5.0 — Low Risk**

> **DEPLOYMENT STATUS (May 19, 2026):** sGho and sGhoSteward are **deployed and live on Ethereum mainnet**. Implementation, proxy, and steward were deployed on **May 5, 2026** by `0x3765a685a401622c060e5d700d9ad89413363a91`. [AIP 484](https://app.aave.com/governance/v3/proposal/?proposalId=484) ("sGho Launch" by TokenLogic, payload contract [`0x4b2612332f8f73a445d79f7dab34e246bf029061`](https://etherscan.io/address/0x4b2612332f8f73a445d79f7dab34e246bf029061)) executed on **May 16, 2026** (block 25,109,406, tx [`0x48ef4e...d404e`](https://etherscan.io/tx/0x48ef4e0de1e5684ee05ae0e49c67af781bd497b675c0ea1a24193a5a499d404e)), wiring up roles, setting `targetRate = 425 bps` (4.25% APR), `supplyCap = 400M GHO`, and granting allowances. On-chain reads at block 25,129,472 confirm: `totalAssets = 37,298,827 GHO`, `paused = false`, `convertToAssets(1e18) = 1.000326e18` (≈3 days of accrual). **The new sGho contract is separate from the legacy stkGHO proxy** ([`0x1a88...`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d)), which still holds 216.75M stkGHO and was **not** upgraded (no `Upgraded` event, `symbol() = "stkGHO"`, `asset()` reverts — not ERC-4626). The `GhoRouter` referenced in the AIP description was **not** deployed by AIP 484 — it remains a separate future workstream ([gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) was the open draft; it is not in scope of this launch and not in the Aave Address Book).

## Overview + Links

sGHO is an **ERC-4626 compliant yield-bearing savings vault** for GHO, Aave's native stablecoin. It replaces the legacy stkGHO staking model with a native, on-chain yield mechanism that automatically accrues interest through an internal yield index.

**Yearn use case per issue #123:** Yearn USDC strategy that acquires GHO (via the GSM USDC module) and deposits into sGHO to earn the Aave Savings Rate (ASR).

**Strategy pipeline:**

- **Deposit:** USDC → waEthUSDC (Aave staticAToken) → GHO (via GSM USDC) → sGHO (via GhoRouter or direct deposit)
- **Withdrawal:** sGHO → GHO → waEthUSDC (via GSM USDC) → USDC

**Key architecture:**

- **sGHO Vault:** Upgradeable ERC-4626 vault (TransparentUpgradeableProxy) with internal index-based yield accounting. GHO deposited remains in the contract — no rehypothecation, no external strategy deployment
- **GhoRouter:** Routing contract for multi-step USDC↔GHO↔sGHO conversions with slippage protection. It is intended to avoid persistent balances, but routed flows add extra token custody and approval surface versus direct calls
- **GSM USDC (Gsm4626):** GHO Stability Module that converts waEthUSDC (wrapped Aave USDC) to/from GHO at a fixed 1:1 price. Uses a pre-minted GHO reserve (does not mint GHO directly)
- **Yield source:** The Aave Savings Rate (ASR) is set by governance. Yield is **virtual** — the yield index grows over time, but the actual GHO to back it must be provided by the Aave DAO from protocol revenue (borrower interest + GSM fees). No strategy or lending is involved
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
- **GSM USDC sell fee:** 0 bps (waEthUSDC → GHO). The GhoRouter wraps raw USDC into waEthUSDC before selling to the GSM
- **GSM USDC buy fee:** 7 bps (GHO → waEthUSDC). The GhoRouter unwraps waEthUSDC back to USDC after buying from the GSM

**Links:**

- [ARFC: sGHO Launch Configuration](https://governance.aave.com/t/arfc-sgho-launch-configuration/24346)
- [ARFC: GHO Savings Upgrade](https://governance.aave.com/t/arfc-gho-savings-upgrade/21680)
- [Snapshot Vote](https://snapshot.org/#/s:aavedao.eth/proposal/0xb9e9b01efcf6151bade78546d0f51f11d7961939b649fb7717e82ea3d43d4f47)
- [Implementation PR #29](https://github.com/aave-dao/gho-origin/pull/29)
- [sGHO Source (gho-origin)](https://github.com/aave-dao/gho-origin/tree/main/src/contracts/sgho)
- [TokenLogic Audit Repo Snapshot](https://github.com/TokenLogic-com-au/gho-origin/tree/b30f973f99fd6eb7a9f343b4681dae88f58007ef)
- [GHO Core Contracts](https://github.com/aave/gho-core)
- [Aave GHO Documentation](https://aave.com/docs/developers/gho)
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
| GhoRouter | Not deployed — not part of AIP 484 | (Future router; see [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34)) |

Source-of-truth references: [`aave-address-book/GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol) (`SGHO`, `SGHO_STEWARD`); [AIP-484 payload source](https://github.com/aave-dao/aave-proposals-v3/tree/main/src/20260427_AaveV3Ethereum_SGhoLaunch); [contract creator](https://etherscan.io/address/0x3765a685a401622c060e5d700d9ad89413363a91).

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
| waEthUSDC (Underlying) | [`0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E) | Wrapped Aave USDC (ERC-4626) |
| GSM USDC Fee Strategy | [`0x73bf24CD7ba43803961c80Ee678a5445eC413080`](https://etherscan.io/address/0x73bf24CD7ba43803961c80Ee678a5445eC413080) | FixedFeeStrategy (0% sell, 7bps buy) |
| GSM USDC Price Strategy | [`0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f`](https://etherscan.io/address/0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f) | FixedPriceStrategy (1:1) |
| Oracle Swap Freezer | [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Chainlink-based auto-freeze |
| GSM Registry | [`0x167527DB01325408696326e3580cd8e55D99Dc1A`](https://etherscan.io/address/0x167527DB01325408696326e3580cd8e55D99Dc1A) | GSM registry |

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

### Deployment Status Verification (May 19, 2026, block 25,129,472)

Mainnet checks performed to confirm sGho is live and the AIP 484 configuration matches the spec:

| Check | Result | Source |
|-------|--------|--------|
| sGho / SGHO_STEWARD entries in Aave Address Book | **Present** | [`GhoEthereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/GhoEthereum.sol#L20-L23) |
| sGho launch proposal in `aave-proposals-v3/src` | **Merged** as `20260427_AaveV3Ethereum_SGhoLaunch` | [proposal source](https://github.com/aave-dao/aave-proposals-v3/tree/main/src/20260427_AaveV3Ethereum_SGhoLaunch) |
| AIP 484 governance state | **Executed** (state=4) | `cast call AaveGov.getProposalState(484)` |
| AIP 484 payload state | **Executed** at block 25,109,406 (2026-05-16 18:04 UTC) | [tx 0x48ef4e…d404e](https://etherscan.io/tx/0x48ef4e0de1e5684ee05ae0e49c67af781bd497b675c0ea1a24193a5a499d404e) |
| sGho contract is ERC-4626 with GHO as asset | **Yes** — `asset() = 0x40D1…6C2f` (GHO Token) | `cast call SGHO asset()` |
| sGho `targetRate` matches AIP spec (425 bps = 4.25% APR) | **Yes** — `targetRate() = 425` | `cast call SGHO targetRate()` |
| sGho `supplyCap` matches AIP spec (400M) | **Yes** — `supplyCap() = 4e26` (400M·1e18) | `cast call SGHO supplyCap()` |
| sGho `MAX_SAFE_RATE` is 50% APR | **Yes** — `MAX_SAFE_RATE() = 5000` (bps) | `cast call SGHO MAX_SAFE_RATE()` |
| sGho `paused` | **false** | `cast call SGHO paused()` |
| sGho `convertToAssets(1e18)` (post-launch accrual) | `1.000326e18` (≈3 days at 4.25% APR) | `cast call SGHO convertToAssets(uint256) 1e18` |
| Steward `getRateConfig()` matches AIP (amp=0, float=0, fixed=425) | **Yes** — `(0, 0, 425)` | `cast call SGHO_STEWARD getRateConfig()` |
| Steward `MAX_RATE` = 5000 bps | **Yes** | `cast call SGHO_STEWARD MAX_RATE()` |
| Steward `sGHO()` points to sGho proxy | **Yes** — returns `0xE175…ca1d` | `cast call SGHO_STEWARD sGHO()` |
| sGho ProxyAdmin owner | Aave Governance Executor L1 ([`0x5300…192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) | `cast call ProxyAdmin owner()` |
| sGho roles correctly granted (DEFAULT_ADMIN, PAUSE_GUARDIAN, TOKEN_RESCUER, YIELD_MANAGER) | **Verified** — see "sGho Roles (Verified On-Chain)" below | `cast call SGHO hasRole(bytes32,address)` |
| Legacy stkGHO proxy upgraded? | **No** — separate contract; `symbol() = "stkGHO"`, `asset()` reverts (not ERC-4626); no `Upgraded(address)` event | [`0x1a88…`](https://etherscan.io/address/0x1a88Df1cFe15Af22B3c4c783D4e6F7F9e0C1885d) |
| GhoRouter merge / deployment status | **Not deployed** — not part of AIP 484; [gho-origin PR #34](https://github.com/aave-dao/gho-origin/pull/34) still references router as separate work | [PR #34](https://github.com/aave-dao/gho-origin/pull/34); not in Address Book |
| Aave bug bounty (Immunefi) sGho coverage | **Still not enumerated** (re-checked May 19, 2026). Immunefi "Sub-systems of GHO" covers: GHO stablecoin, GHO reserve of Aave Pool, GHO FlashMinter, GSM/GSM4626, CCIP bridge, GHO stewards, GHO Remote Facilitators. sGho vault (`0xE175…ca1d`) and sGho Steward (`0x60Bf…2757`) are not listed | [Immunefi Aave](https://immunefi.com/bug-bounty/aave/) |

**Conclusion:** sGho launched and is operating to spec. All on-chain parameters match the AIP-484 payload. Production history is ~3 days — minimal track record, but the core configuration and admin assignments are verified.

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

### Aave V3 Platform Audits

The broader Aave V3 platform (which sGHO integrates with for GSM and governance) has been audited extensively:

- Sherlock: Aave V3.3 contest ($230K prize pool, Jan 2025)
- Multiple prior audits from OpenZeppelin, Trail of Bits, SigmaPrime, Certora, and others

### Bug Bounty

- **Aave on Immunefi:** Active bug bounty covering GHO sub-systems. Max payout: **$1,000,000** (Critical)
  - Scope explicitly includes: GHO Token, GSM, stkGHO, GHO FlashMinter, CCIP bridge, stewards
  - Reward tiers: Critical $50K-$1M, High $10K-$75K, Medium $10K, Low $1K
  - Link: https://immunefi.com/bug-bounty/aave/
- **Note:** sGho vault is **still not** in Immunefi scope (re-checked May 19, 2026 — Aave Immunefi "Sub-systems of GHO" enumerates GHO stablecoin, GHO reserve of the Aave Pool, GHO FlashMinter, GSM/GSM4626, CCIP bridge, GHO stewards, and GHO Remote Facilitators; sGho vault, sGho Steward, and any future GhoRouter are not listed). Reassess scope after each Immunefi update

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

**sGho Roles (Verified On-Chain, May 19, 2026):**

| Role | Power | Holder (verified via `hasRole`) |
|------|-------|-----------------|
| `DEFAULT_ADMIN_ROLE` (`0x00…00`) | Grant/revoke all roles, full role management | Aave Governance Executor L1 ([`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) |
| `YIELD_MANAGER_ROLE` (`0x470f…fe27`) | `setTargetRate()` (max 50% APR), `setSupplyCap()` | sGho Steward ([`0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757`](https://etherscan.io/address/0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757)) |
| `PAUSE_GUARDIAN_ROLE` (`0x3bb1…21dd`) | `pause()`, `unpause()` — freezes all token operations | Aave Protocol Guardian ([`0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30`](https://etherscan.io/address/0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30)) |
| `TOKEN_RESCUER_ROLE` (`0xbf63…9c06`) | `emergencyTokenTransfer()` — can rescue any token EXCEPT GHO | Aave Governance Executor L1 ([`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) |

**sGho Steward Roles (Verified On-Chain):**

| Role | Power | Holder |
|------|-------|--------|
| `DEFAULT_ADMIN_ROLE` | Grant/revoke steward sub-roles | Aave Governance Executor L1 ([`0x5300…192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) |
| `FIXED_RATE_MANAGER_ROLE` (`0x9720…1e0e`) | Update `fixedRate` component of `targetRate` | Aave Governance Executor L1 |
| `SUPPLY_CAP_MANAGER_ROLE` (`0xd80d…6c04`) | Update `supplyCap` on sGho | Aave Governance Executor L1 |
| `AMPLIFICATION_MANAGER_ROLE` | Update `amplification` component | Unassigned (no `floatRate` to manage at launch) |
| `FLOAT_RATE_MANAGER_ROLE` | Update `floatRate` component | Unassigned |

**Notable:** All four steward management roles route through the DAO Executor L1 at launch, not the Risk Council. The Steward design allows finer-grained delegation later (e.g., granting `FIXED_RATE_MANAGER_ROLE` to the Risk Council for rate-limited daily adjustments) without a full code change.

### GSM USDC — Can Admin Steal Funds?

| Vector | Possible? | Details |
|--------|-----------|---------|
| **Seize all waEthUSDC** | **YES** (but gated) | `seize()` sends all waEthUSDC to GHO Treasury. Requires `LIQUIDATOR_ROLE` which is currently **unassigned**. Aave Governance can grant this role and then call seize. Irreversible — permanently disables the GSM |
| **Freeze swaps (trap funds)** | **YES** | `SWAP_FREEZER_ROLE` can call `setSwapFreeze(true)`. Both Aave Governance and the ChainlinkOracleSwapFreezer hold this role. Freezes both `buyAsset` and `sellAsset` |
| **Auto-freeze on USDC depeg** | **YES** (automatic) | OracleSwapFreezer freezes swaps if USDC price falls outside [$0.99, $1.01]. Unfreezes when price returns to [$0.995, $1.005]. In a permanent depeg, funds could be trapped indefinitely |
| **Change fee to extract value** | **YES** (rate-limited) | `CONFIGURATOR_ROLE` can call `updateFeeStrategy()`. The GhoGsmSteward is rate-limited to **+/- 0.5%/day** using the FixedFeeStrategyFactory (max 50% per strategy). Governance can deploy any fee strategy |
| **Upgrade implementation** | **YES** | TransparentUpgradeableProxy — ProxyAdmin owned by Aave Governance Executor. Can replace implementation with arbitrary code |
| **Rescue underlying tokens** | **Protected** | `TOKEN_RESCUER_ROLE` (currently unassigned) can rescue only surplus waEthUSDC above `_currentExposure` — user funds are protected in code |

**GSM USDC Roles (verified on-chain):**

| Role | Holder | Identity |
|------|--------|----------|
| `DEFAULT_ADMIN_ROLE` | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A) | Aave Governance Executor L1 |
| `CONFIGURATOR_ROLE` | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A), [`0xD1E856a947CdF56b4f000ee29d34F5808E0A6848`](https://etherscan.io/address/0xD1E856a947CdF56b4f000ee29d34F5808E0A6848) | Aave Governance + GhoGsmSteward |
| `SWAP_FREEZER_ROLE` | [`0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A), [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Aave Governance + OracleSwapFreezer |
| `TOKEN_RESCUER_ROLE` | Unassigned | — |
| `LIQUIDATOR_ROLE` | Unassigned | — |

### GhoRouter — Can Admin Steal Funds?

| Vector | Possible? | Details |
|--------|-----------|---------|
| **Add malicious GSM to allowlist** | **YES** | Owner can call `setGsmAllowed()` with a malicious contract that passes basic validation (`GHO_TOKEN()` matches, `UNDERLYING_ASSET()` exists). Users calling swap functions through this malicious GSM could lose their tokens |
| **Drain user wallets** | **No** | Router cannot pull tokens users haven't approved for that specific call |
| **Rescue stranded tokens** | **YES** | Owner can call `rescueToken()` to transfer any ERC-20 held by the router to any address. The router is intended to avoid persistent balances, but stranded tokens remain an owner-controlled recovery path |
| **Pause the router** | **No** | No pause mechanism exists on the router itself. GSM paths can be disabled by removing GSMs from allowlist, and direct GHO↔sGHO paths can still fail if sGHO is paused |

**GhoRouter status:** Not deployed. AIP 484 mentions GhoRouter in its marketing/motivation copy ("Frictionless onboarding…single transaction") but the actual payload does not deploy a router — it only configures sGho, sGhoSteward, and a 10M GHO Collector allowance. The router is not present in `aave-address-book` and the TokenLogic audit does not cover any router contract. **Yearn's USDC → sGho strategy must therefore wrap USDC → waEthUSDC → GHO → sGho manually** (or via the existing GSM USDC) and cannot route through a GhoRouter for the foreseeable future. Reassess if a separate AIP deploys GhoRouter.

## Critical Design Characteristic: Virtual/Unfunded Yield

**sGHO's yield is accounting-based, not strategy-based.** This is fundamentally different from most ERC-4626 vaults:

1. The `yieldIndex` grows over time at `ratePerSecond`, making each sGHO share worth more GHO
2. The actual GHO to back this growing obligation **must be provided by the Aave DAO** via direct transfers from protocol revenue
3. If the DAO does not top up the vault, withdrawals become **first-come-first-served** — `maxWithdraw()` is capped by `min(theoretical_entitlement, actual_GHO_balance)`
4. There is **no mechanism to automatically mint GHO** to cover the yield — the DAO must manually fund it
5. The yield index grows independently of the actual GHO balance in the contract

**Implications for Yearn:**
- In normal operation, the Aave DAO funds sGHO adequately from protocol revenue
- In a stress scenario (DAO governance failure, revenue shortfall), late withdrawers may not receive their full yield entitlement
- Principal is protected as long as the vault's GHO balance exceeds total deposits (yield is the unfunded part)

## Historical Track Record

All on-chain numbers below from block 25,129,472 (2026-05-19 13:16 UTC) unless noted.

- **sGho vault:** **Live since May 16, 2026 (AIP 484 execution) — ~3 days of production history.** `totalAssets() = 37,298,827 GHO`, `totalSupply() = 37,286,664` shares. `convertToAssets(1e18) = 1.000326e18` → ~0.033% accrued (`ratePerSecond` of `1.347666e18` RAY corresponds to 4.25% simple APR per spec; ~4.34% continuously compounded). The contract itself was deployed on May 5, 2026 but only became operational once AIP 484 wired up the roles and supply cap on May 16
- **GHO stablecoin:** Launched July 2023 — **~2.83 years** in production
- **GHO mainnet supply:** 584.0M GHO (on-chain `totalSupply()`, May 19, 2026; unchanged vs April readings)
- **GSM USDC:** Deployed and operational — current waEthUSDC held: ~111.25M (`getAvailableLiquidity()`) against 175M cap; available underlying exposure ~63.75M (already-minted GHO side). Cap unchanged
- **GHO Reserve (GSM USDC facilitator):** GHO balance = **133.49M** (May 19; down from 167.51M on April 22, partially reflecting AIP 484's 10M allowance creation and ongoing GSM activity; reserve also serves GSM USDT)
- **Legacy stkGHO:** Holds **216.75M stkGHO** (May 19; up from 202.78M on April 22 — ~14M net inflow). Still on legacy staking implementation (no proxy upgrade — sGho was launched as a separate ERC-4626 contract rather than via an in-place upgrade). The ARFC envisions an "aggressive migration schedule from the legacy sGHO contract" but that migration is **not** part of AIP 484
- **Aave protocol:** One of the largest DeFi protocols, ~$14.0B Aave V3 TVL (DeFiLlama, May 19, 2026; down from ~$23.85B on April 2, 2026), live since January 2020 (~6 years)
- **Security incidents (GHO):** No known exploits on GHO token, GSM, or stkGHO
- **Security incidents (Aave):** Aave V3 has not been exploited. Historical V1/V2 incidents exist but are not relevant to the V3 architecture

## Funds Management

### Strategy Pipeline: USDC → sGHO

**Step 1: USDC → waEthUSDC**

USDC is deposited into the Aave V3 USDC market and wrapped as waEthUSDC ([`0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E)), a staticAToken (ERC-4626) that represents an Aave V3 USDC supply position.

**Step 2: waEthUSDC → GHO (via GSM USDC)**

waEthUSDC is sold to the GSM USDC ([`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112)) at a fixed 1:1 price (FixedPriceStrategy, no oracle). The GSM draws GHO from the GHO Reserve ([`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9)) and transfers it to the caller. Sell fee: 0%.

**Step 3: GHO → sGHO (deposit)**

GHO is deposited into the sGHO ERC-4626 vault. Shares are issued based on the current `yieldIndex`. No fee.

**Withdrawal pipeline:** Reverse path (sGHO → GHO → waEthUSDC → USDC). GSM buy fee: 7 bps (0.07%).

### Accessibility

- **Deposits:** Permissionless — anyone can deposit GHO and receive sGHO shares (ERC-4626). Subject to supply cap (400M GHO)
- **Withdrawals:** Permissionless, atomic, no cooldown. Capped by actual GHO balance in vault (see Virtual Yield section above)
- **GSM:** Permissionless — `sellAsset` and `buyAsset` available to anyone. Subject to exposure cap (175M waEthUSDC). Can be frozen by oracle or governance
- **Fees:** 0% on sGHO deposit/withdrawal. 0% GSM sell fee (waEthUSDC → GHO). 7 bps GSM buy fee (GHO → waEthUSDC)

### Collateralization

- **sGHO:** GHO deposited remains in the contract — **no rehypothecation**. Principal is fully backed. Yield backing depends on DAO funding
- **GSM USDC:** Holds waEthUSDC (wrapped Aave USDC supply position). Each waEthUSDC is redeemable for USDC from Aave V3 (subject to Aave V3 liquidity). Current waEthUSDC available: ~111.25M (May 19, 2026)
- **No leverage** in the pipeline
- **GHO itself:** Backed by over-collateralized Aave V3 loans and GSM stablecoin reserves

### Provability

- **sGHO exchange rate:** On-chain via ERC-4626 `convertToAssets()`/`convertToShares()`. Computed from `yieldIndex`, fully deterministic
- **sGHO actual backing:** `IERC20(GHO).balanceOf(sGHO)` shows actual GHO in vault. Compare to `totalAssets()` to detect any shortfall
- **GSM exposure:** `getAvailableLiquidity()`, `getAvailableUnderlyingExposure()`, `getUsed()`, and `getLimit()` readable on-chain
- **GSM fees:** `getBuyFee()` / `getSellFee()` readable on-chain
- **GHO Reserve balance:** On-chain verifiable at [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9)

## Liquidity Risk

- **sGHO withdrawal:** Atomic via ERC-4626 `withdraw()`/`redeem()`. No cooldown, no queue. Capped by actual GHO balance
- **GHO → USDC exit (via GSM):** Subject to GSM waEthUSDC availability. Current: ~111.25M waEthUSDC available in the GSM, ~63.75M already-minted-GHO exposure (out of 175M cap; May 19, 2026). If GSM is frozen or at 0 exposure, this exit is blocked
- **GHO → USDC exit (via DEX):** GHO has DEX liquidity (Balancer, Uniswap, Curve). Can be used as fallback if GSM is unavailable
- **GSM freeze risk:** Oracle auto-freezes if USDC depegs outside [$0.99, $1.01]. Manual freeze possible by governance. During freeze, no `buyAsset` or `sellAsset` — funds are trapped until unfreeze
- **GSM buy fee:** 7 bps (0.07%) — minor friction on exit
- **Deposit limit:** 400M GHO supply cap on sGHO
- **Largest risk:** GSM freeze during USDC depeg could prevent USDC exit for an extended period. GHO itself remains redeemable from sGHO, but converting back to USDC depends on GSM availability

## Centralization & Control Risks

### Governance

sGHO and the GSM are governed through the **Aave DAO governance framework** — one of the most established on-chain governance systems in DeFi.

**Governance hierarchy:**

| Level | Entity | Power |
|-------|--------|-------|
| **Aave DAO** | On-chain governance (AAVE token voting) | Full control: upgrades, role changes, parameter changes, emergency actions |
| **Executor Level 1** ([`0x5300...`](https://etherscan.io/address/0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)) | Timelock executor | Executes passed proposals. DEFAULT_ADMIN on GSM |
| **GHO Risk Council** ([`0x8513...`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60)) | 3-of-4 multisig | Rate-limited parameter changes via steward contracts |
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
| sGho Vault | **YES** (TransparentUpgradeableProxy) | Aave Governance Executor L1 (via ProxyAdmin [`0xc15700631020eba02317964550365b95a9a28adb`](https://etherscan.io/address/0xc15700631020eba02317964550365b95a9a28adb), `owner() = 0x5300…192A`) |
| GSM USDC | **YES** (TransparentUpgradeableProxy) | Aave Governance Executor L1 (via ProxyAdmin [`0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21`](https://etherscan.io/address/0x51bbc06d0032f8fea31f4f7a39e369c5e282cc21)) |
| GHO Token | **YES** (upgradeable) | Aave Governance |
| GhoRouter | **No** (not upgradeable, owner-managed allowlist) | N/A |
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
| **GSM USDC** | Critical | USDC↔GHO conversion path. Upgradeable, freezeable |
| **GHO Reserve** | Critical | Pre-minted GHO pool for GSM operations. Must have sufficient GHO |
| **Aave V3 USDC Market** | Critical | waEthUSDC (underlying for GSM) is an Aave V3 supply position |
| **Chainlink Oracle** | Medium | Powers auto-freeze on GSM via OracleSwapFreezer. Oracle failure could cause incorrect freeze/unfreeze |
| **Aave DAO Revenue** | Medium | Must fund sGHO yield. If revenue declines, yield backing could be insufficient |

## Operational Risk

- **Team:** Aave DAO — one of the most established DeFi protocols. Created by Aave Companies (formerly ETHLend), founded by Stani Kulechov in 2017. Publicly known team
- **Governance:** Fully on-chain Aave DAO governance with AAVE token voting. Established governance framework with multiple safety layers (guardian, stewards, timelocks)
- **Documentation:** Comprehensive Aave and GHO documentation. Source code verified on Etherscan (GSM) and on GitHub (sGHO)
- **Legal:** GHO is a decentralized stablecoin governed by the Aave DAO. LlamaRisk flagged regulatory concerns under MiCA (EU prohibits interest on stablecoins) — potential legal risk for sGHO in regulated jurisdictions
- **Incident response:** Aave has a Protocol Guardian for emergency pauses. $1M Immunefi bug bounty. Multiple steward contracts with rate-limited powers for rapid parameter adjustments without full governance votes
- **Track record:** Aave V3 has not been exploited. GHO has operated without security incidents since July 2023 launch (~2.75 years)

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Monitor |
|----------|---------|---------|
| sGho Vault | [`0xE1753F2e00940cC31213dd92013cF019DFE4ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `totalAssets()`, `convertToAssets(1e18)` (PPS), `IERC20(GHO).balanceOf(sGho)` vs `totalAssets()` (funding gap), `targetRate()`, `paused()`, Deposit/Withdraw/TargetRateUpdated/Paused events |
| sGho Steward | [`0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757`](https://etherscan.io/address/0x60Bf2DF49F17529Cf956D57848ebEB8a0d0a2757) | `getRateConfig()`, `RateConfigUpdated`/`SupplyCapUpdated`/`RoleGranted`/`RoleRevoked` events |
| GSM USDC | [`0x3A3868898305f04beC7FEa77BecFf04C13444112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `getAvailableLiquidity()`, `getAvailableUnderlyingExposure()`, `getUsed()`, `getLimit()`, `getIsFrozen()`, `getIsSeized()`, FeeStrategyUpdated events |
| GHO Reserve | [`0x54C58157DeF387A880AE62332D1445f03adbE7E9`](https://etherscan.io/address/0x54C58157DeF387A880AE62332D1445f03adbE7E9) | GHO balance, limit vs used for GSM USDC |
| GHO Risk Council | [`0x8513e6F37dBc52De87b166980Fa3F50639694B60`](https://etherscan.io/address/0x8513e6F37dBc52De87b166980Fa3F50639694B60) | Signer/threshold changes |
| Oracle Swap Freezer | [`0x6e51936e0ED4256f9dA4794B536B619c88Ff0047`](https://etherscan.io/address/0x6e51936e0ED4256f9dA4794B536B619c88Ff0047) | Freeze/unfreeze events |

### Critical Events to Monitor

- **sGHO funding gap** — `IERC20(GHO).balanceOf(sGHO) < totalAssets()` indicates unfunded yield obligations
- **sGHO rate changes** — `TargetRateUpdated` event (yield rate changed by steward or governance)
- **sGHO pause/unpause** — `Paused`/`Unpaused` events
- **GSM freeze** — `SwapFreeze` event (manual or oracle-triggered)
- **GSM seize** — `Seized` event (last resort, irreversible)
- **GSM fee changes** — `FeeStrategyUpdated` event
- **GSM exposure cap changes** — `ExposureCapUpdated` event
- **Proxy upgrades** — `Upgraded` event on any TransparentUpgradeableProxy
- **Role changes** — `RoleGranted`/`RoleRevoked` events on sGHO and GSM

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | sGHO | PPS tracking | Every 6 hours |
| `totalAssets()` | sGHO | Total yield obligations | Daily |
| `balanceOf(sGHO)` | GHO Token | Actual GHO in vault | Daily |
| `getAvailableLiquidity()` | GSM USDC | Current waEthUSDC held | Daily |
| `getAvailableUnderlyingExposure()` | GSM USDC | Remaining waEthUSDC headroom | Daily |
| `getUsed()` | GSM USDC | GHO reserve usage for this facilitator | Daily |
| `getLimit()` | GSM USDC | GHO reserve limit for this facilitator | Daily |
| `getIsFrozen()` | GSM USDC | Swap freeze status | Every 6 hours |
| `getIsSeized()` | GSM USDC | Seize status | Daily |

## Risk Summary

### Key Strengths

- **Extensive audit coverage:** 12+ audits since 2022 by top firms (OpenZeppelin, Certora, Sigma Prime, ABDK). Certora formal verification. sGHO-specific audit found 0 critical/high/medium issues
- **Aave DAO governance:** One of DeFi's most established on-chain governance systems. All critical operations require DAO vote with timelock. Rate-limited stewards for day-to-day parameter management
- **Simple sGHO design:** No rehypothecation, no external strategies, no leverage. GHO stays in the vault. Yield is purely accounting-based
- **GHO ecosystem maturity:** GHO live since July 2023 (~2.75 years), GSM operational, ~584M mainnet supply, no security incidents
- **Aave protocol backing:** ~$23.85B TVL platform, 6+ years of operation, $1M bug bounty
- **Token rescue protection:** sGHO `maxRescue()` returns 0 for GHO (underlying asset cannot be rescued by admin). GSM protects user funds tracked in `_currentExposure`
- **GSM dangerous roles unassigned:** `LIQUIDATOR_ROLE` (seize) and `TOKEN_RESCUER_ROLE` on GSM are currently unassigned

### High-Severity Issues

- **7 bps GSM exit fee on every USDC withdrawal (HIGH):** Exiting from sGho back to USDC requires a `GSM.buyAsset()` call that charges **7 bps (0.07%)** on the GHO→waEthUSDC leg (verified on-chain at GSM fee strategy [`0x73bf24CD7ba43803961c80Ee678a5445eC413080`](https://etherscan.io/address/0x73bf24CD7ba43803961c80Ee678a5445eC413080): `getBuyFee(1_000_000) = 700`). This applies on **every** withdrawal — partial rebalances are repeatedly fee'd. At the current 4.25% APR, breakeven against holding raw USDC requires holding sGho for ≥**~6 days** (7 / 425 of a year). Implications for Yearn:
  - The strategy must batch withdrawals to amortize the fee
  - Frequent rebalancing or harvests that touch USDC will compound this drag
  - Deposit direction is fee-free (`sellAsset` charges 0 bps), so the cost is purely on the exit path
  - **GhoRouter would NOT have eliminated this fee** — the router is a UX wrapper; it still calls `GSM.buyAsset()` under the hood, which is what charges the fee
  - The fee is governance-adjustable via the GhoGsmSteward (rate-limited to ±0.5%/day, max 50% per FixedFeeStrategy). Aave could lower it to 0, but historically has held it at 7 bps to slow GSM reserve drainage
  - Alternative exit via DEX (Balancer/Uniswap/Curve GHO pools) is possible but introduces slippage that is typically worse than 7 bps for size

### Other Key Risks

- **Very short production history:** sGho went live on May 16, 2026 — only ~3 days of mainnet usage at time of this assessment. The configuration matches the AIP-484 spec on-chain, but no stress events have been observed
- **GhoRouter not deployed:** The launch AIP markets the GhoRouter as enabling single-tx USDC→sGho onboarding, but the actual payload deploys no router. Yearn's USDC strategy must compose the existing GSM USDC + sGho deposit steps itself. Note: even if/when the router ships, it would not change the 7 bps exit fee above — that fee is set at the GSM layer
- **Upgradeable contracts (rug via governance):** sGho, GSM, GHO Token, and GHO Reserve are all upgradeable proxies controlled by Aave Governance. A malicious governance proposal could drain all funds. Mitigated by Aave's established governance framework and community oversight
- **Virtual/unfunded yield:** sGho yield index grows independently of actual GHO balance. The DAO must actively fund the vault. In a funding shortfall, late withdrawers lose yield (first-come-first-served). Principal remains protected
- **GSM freeze can trap funds:** Oracle auto-freezes on USDC depeg, manual freeze by governance. During freeze, no USDC exit via GSM. DEX liquidity provides an alternative GHO exit path
- **Pause can freeze sGho:** PAUSE_GUARDIAN can freeze all sGho token operations (deposits, withdrawals, transfers). Mitigated by governance ability to revoke the guardian role

### Critical Risks

- **Upgrade-based rug pull:** The theoretical worst case — a malicious Aave governance proposal that upgrades sGho or GSM to steal funds. The sGho ProxyAdmin owner is the DAO Executor L1, so this requires corrupting Aave's on-chain governance process, which has never happened in 6+ years of operation

---

## Risk Score Assessment

> **Note:** Scores below are computed post-deployment (May 19, 2026), with on-chain roles, ProxyAdmin owner, supply cap, target rate, and audit posture all verified. The dominant penalty is now the very short production history (~3 days), not unverifiable configuration.

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
| Bug bounty | $1,000,000 on Immunefi (Aave, covering GHO sub-systems) |
| Production history | **sGho: ~3 days (deployed May 5, activated by AIP 484 on May 16, 2026)**. GHO: ~2.83 years. GSM USDC: operational. Aave V3: ~6 years |
| TVL | sGho: ~37.3M GHO (3 days post-launch). GHO mainnet supply: 584.0M (May 19, 2026). Aave V3: ~$14.0B TVL (May 19) |
| Security incidents | None on GHO, GSM, sGho, or Aave V3 |

**Score: 2.5/5** — Exceptional audit coverage and formal verification, $1M bug bounty (with sGho **not** enumerated in Immunefi scope as of May 19, 2026), and the broader Aave ecosystem has an outstanding track record. However, the sGho vault itself has **only ~3 days of production history** at the time of assessment — minimal battle-testing. The GHO ecosystem provides strong secondary confidence, but a freshly-deployed vault is inherently riskier than one with months of incident-free operation. Score will likely improve toward 2.0 after a clean first 3-month window.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | **All core contracts upgradeable** (TransparentUpgradeableProxy) by Aave governance |
| Governance | Aave DAO — on-chain AAVE token voting with timelock executor. One of DeFi's most established governance systems |
| Rate-limiting | Stewards limited to small parameter changes (0.5%/day fees, 100% exposure cap). Major changes require full DAO vote |
| Privileged roles | Well-distributed: Governance (admin), Stewards (rate-limited ops), Guardian (pause), Oracle (auto-freeze) |
| EOA risk | No EOAs hold critical roles — all controlled by multisigs, DAO, or automated contracts |

**Governance Score: 2.5/5** — Aave DAO is one of the strongest governance systems in DeFi, with established on-chain voting, timelocks, and community oversight. However, all core contracts are upgradeable proxies — governance can replace any implementation. The rate-limited steward pattern is well-designed. Score elevated due to full upgradeability across the entire contract stack (sGho, GSM, GHO Token, Reserve). sGho ProxyAdmin (`0xc157…8adb`) is owned by the DAO Executor L1 — verified on-chain.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| sGHO PPS | On-chain, algorithmic (yieldIndex-based ERC-4626) |
| sGHO yield | Set by YIELD_MANAGER_ROLE — admin-controlled rate (not market-driven) |
| GSM price | Fixed 1:1 (immutable), fully deterministic |
| Vault operations | Permissionless ERC-4626 deposit/withdraw |
| Yield funding | **Off-chain dependency** — DAO must actively transfer GHO to fund yield obligations |

**Programmability Score: 2/5** — sGHO exchange rate is fully on-chain and deterministic. However, the yield rate is admin-set (not market-driven) and yield backing requires off-chain DAO action to fund the vault. The GSM is fully deterministic with immutable price strategy. Score elevated by the yield funding dependency.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Aave DAO (governance), Aave V3 (waEthUSDC), Chainlink (oracle for freeze), GHO Reserve |
| Criticality | All within the Aave ecosystem — single governance trust root |
| Quality | Blue-chip: Aave is one of the largest DeFi lending protocols, ~$23.85B TVL, 6+ years |

**Dependencies Score: 2/5** — All dependencies are within the Aave ecosystem (single trust root), which is blue-chip quality. The Chainlink oracle dependency for auto-freeze adds a minor external dependency. Per rubric, 1-2 blue-chip dependencies with some concentration = score 2.

**Centralization Score = (2.5 + 2 + 2) / 3 ≈ 2.2**

**Score: 2.0/5** — Strong governance through Aave DAO, but full upgradeability across all contracts and admin-controlled yield rate prevent a lower score. Blue-chip dependencies within the Aave ecosystem.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | GHO deposits stay in sGHO contract (no rehypothecation). GSM holds waEthUSDC (wrapped Aave USDC) |
| Collateral quality | GHO: backed by over-collateralized Aave V3 loans and GSM stablecoins. waEthUSDC: USDC supply on Aave V3 |
| Leverage | None |
| Yield backing | **Virtual** — yield not backed by assets, backed by DAO funding commitment |

**Collateralization Score: 2/5** — Principal is well-protected (no rehypothecation, GHO stays in vault, GSM protects user exposure). However, yield is virtually accrued and depends on DAO funding — this is a meaningful departure from fully-backed vaults. Blue-chip underlying assets (USDC, Aave V3). No leverage.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | sGHO: on-chain (ERC-4626). GSM: on-chain (`getAvailableLiquidity()`, `getUsed()`, `getLimit()`). GHO Reserve: on-chain |
| Exchange rate | sGHO: on-chain via yieldIndex. GSM: fixed 1:1 |
| Funding gap | Detectable: compare `balanceOf(GHO, sGHO)` vs `totalAssets()` |
| Third-party | Chainlink oracle for GSM freeze. All data independently verifiable |

**Provability Score: 1.5/5** — Excellent on-chain transparency. ERC-4626 standard provides real-time verification. Funding gap between actual GHO balance and yield obligations is detectable on-chain. GSM exposure and fees fully readable. Score slightly elevated because yield obligations vs actual backing require manual comparison (not automatically flagged by the protocol).

**Funds Management Score = (2 + 1.5) / 2 = 1.75**

**Score: 2.0/5** — Good provability and blue-chip collateral. Score elevated by the virtual yield model where yield backing is not guaranteed by the protocol itself.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| sGHO exit | Atomic ERC-4626 redemption, no cooldown. Capped by actual GHO balance |
| GHO → USDC exit | Via GSM (7 bps fee) or DEX. GSM has ~111M waEthUSDC available (May 19, 2026) |
| Freeze risk | GSM auto-freezes on USDC depeg [$0.99, $1.01]. Manual freeze possible. **Blocks USDC exit** |
| Pause risk | sGHO pause blocks all token operations including withdrawal |
| DEX fallback | GHO has DEX liquidity (Balancer, Uniswap, Curve) as alternative exit |
| Supply cap | 400M GHO (sGHO), 175M waEthUSDC (GSM) |

**Score: 2.5/5** — Under normal conditions, liquidity is strong: atomic sGHO withdrawal, deep GSM capacity, and DEX fallback. However, two mechanisms can freeze user exits: (1) GSM auto-freeze on USDC depeg — users cannot convert GHO back to USDC via GSM during depeg events, and (2) sGHO pause blocks all withdrawals. Both are governance-recoverable but represent real liquidity risk during stress scenarios. The DEX fallback mitigates GSM freeze risk but may involve slippage.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Aave — top-tier DeFi team, publicly known, 6+ years of operation |
| Governance | Fully on-chain Aave DAO. Multiple safety layers (guardian, stewards, timelocks, auto-freezer) |
| Documentation | Comprehensive Aave and GHO docs. Source code open and verified |
| Legal | LlamaRisk flagged MiCA (EU) prohibits interest on stablecoins — regulatory risk for sGHO |
| Incident response | Protocol Guardian for emergencies. $1M bug bounty. Rate-limited stewards |
| Monitoring | Chainlink oracle auto-freezer on GSM. No known sGHO-specific monitoring yet (not deployed) |

**Score: 1.5/5** — Top-tier operational maturity from one of DeFi's most established teams. Comprehensive documentation and governance infrastructure. Minor elevations for regulatory uncertainty (LlamaRisk MiCA concerns) and lack of sGHO-specific monitoring (pre-deployment).

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (2.0 × 0.30) + (2.0 × 0.30) + (2.5 × 0.20) + (2.5 × 0.15) + (1.5 × 0.05)
            = 0.60 + 0.60 + 0.50 + 0.375 + 0.075
            = 2.15
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 2.0 | 30% | 0.60 |
| Funds Management | 2.0 | 30% | 0.60 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.1/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Risk Tier: Low Risk (2.1/5.0) — Approved with standard monitoring**

> Score may improve toward ~1.8 once sGho has accumulated ~3 months of incident-free production history and is added to the Immunefi bug-bounty scope. Score may worsen if the legacy stkGHO → sGho migration introduces unexpected admin-controlled flows, if a GhoRouter is later deployed with broad token-rescue powers, or if sGho's `IERC20(GHO).balanceOf` consistently lags `totalAssets()` (unfunded yield).

---

## Appendix: USDC ↔ sGho Conversion Flows

Step-by-step view of the Yearn USDC strategy's two flows, with explicit fees at each leg. All fees verified on-chain at block 25,129,472 (May 19, 2026).

### Deposit Flow: USDC → sGho

| # | From → To | Contract | Call | Fee | Notes |
|---|---|---|---|---|---|
| 1 | USDC → waEthUSDC | Aave V3 USDC market + static-aToken wrapper [`0xD4fa…D23E`](https://etherscan.io/address/0xD4fa2D31b7968E448877f69A96DE69f5de8cD23E) | `deposit(usdc, receiver)` | **0%** | USDC starts earning Aave V3 supply APY while held as waEthUSDC |
| 2 | waEthUSDC → GHO | GSM USDC [`0x3A38…4112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `sellAsset(waEthUSDC_amount, receiver)` | **0 bps (0%)** | Fixed 1:1 price (FixedPriceStrategy [`0xEE73…D64f`](https://etherscan.io/address/0xEE73e0c5Cc8E4cAf400baB5239860696Ff44D64f)); fee strategy [`0x73bf…3080`](https://etherscan.io/address/0x73bf24CD7ba43803961c80Ee678a5445eC413080) returns 0 for sell side. Subject to 175M waEthUSDC exposure cap |
| 3 | GHO → sGho | sGho [`0xE175…ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `deposit(gho_amount, receiver)` | **0%** | Standard ERC-4626 — no deposit fee. Subject to 400M GHO supply cap |

**Total deposit-side fees: 0%.** Costs are gas + any GSM unavailability (oracle freeze, exposure cap full) + sGho pause / supply-cap full.

### Withdrawal Flow: sGho → USDC

| # | From → To | Contract | Call | Fee | Notes |
|---|---|---|---|---|---|
| 1 | sGho → GHO | sGho [`0xE175…ca1d`](https://etherscan.io/address/0xE1753F2e00940cC31213dd92013cF019DFE4ca1d) | `withdraw(gho_amount, receiver, owner)` or `redeem(shares, receiver, owner)` | **0%** | No withdrawal fee. Capped by `IERC20(GHO).balanceOf(sGho)` — see "Virtual/Unfunded Yield" |
| 2 | GHO → waEthUSDC | GSM USDC [`0x3A38…4112`](https://etherscan.io/address/0x3A3868898305f04beC7FEa77BecFf04C13444112) | `buyAsset(waEthUSDC_amount, receiver)` | **7 bps (0.07%)** ⚠️ | Fee strategy [`0x73bf…3080`](https://etherscan.io/address/0x73bf24CD7ba43803961c80Ee678a5445eC413080): `getBuyFee(1_000_000) = 700`. **This is the only economic fee in the full round-trip.** GhoRouter would NOT eliminate this — it's charged at the GSM layer regardless of caller |
| 3 | waEthUSDC → USDC | static-aToken wrapper + Aave V3 USDC market | `redeem` / `withdraw(usdc, receiver, owner)` | **0%** | Subject to Aave V3 USDC pool liquidity (utilization-dependent) |

**Total withdrawal-side fees: 7 bps (0.07%).** This is the high-severity issue called out above — every USDC exit incurs this. At the current 4.25% sGho APR, breakeven against just holding raw USDC is ~6 days (7 / 425 of a year).

### Failure Modes That Block These Flows (no fee, but liquidity risk)

| Condition | Blocks | Recovery |
|---|---|---|
| `sGho.paused = true` | Steps 1+3 of deposit (the sGho `deposit` call) and step 1 of withdrawal | Protocol Guardian or DAO `unpause()` |
| `GSM.isFrozen() = true` (oracle auto-freeze on USDC depeg outside [$0.99, $1.01], or manual governance freeze) | Step 2 of both flows | Oracle unfreezes when USDC returns to [$0.995, $1.005]; or DAO unfreezes manually |
| GSM exposure at 175M cap | Step 2 of deposit only (`sellAsset`) | Wait for withdrawals to free capacity, or DAO raises cap |
| sGho `supplyCap` (400M GHO) reached | Step 3 of deposit | DAO raises cap via Steward `SUPPLY_CAP_MANAGER_ROLE` |
| `IERC20(GHO).balanceOf(sGho) < requested_amount` | Step 1 of withdrawal (late withdrawers in funding shortfall) | DAO tops up GHO from protocol revenue |
| Aave V3 USDC pool at high utilization | Step 3 of withdrawal | Wait for borrowers to repay, or use DEX path |

### Alternate Exit Path (Bypassing the 7 bps Fee — With Tradeoffs)

Instead of `GSM.buyAsset()`, exit GHO to USDC via DEX:

| Venue | Pros | Cons |
|---|---|---|
| Balancer / Curve / Uniswap GHO pools | No GSM dependency, no oracle freeze risk | Slippage is typically worse than 7 bps for size; LP pools shallow vs the 175M GSM |
| Direct GHO → USDC OTC | Could be 0 fee | Trust + size constraints, not on-chain composable |

For most Yearn strategy sizes, the GSM at 7 bps is cheaper and more reliable than DEX exit.

---

## Reassessment Triggers

- **Time-based:** Reassess 3 months after the May 16, 2026 launch (mid-August 2026) to capture initial production track record, then every 6 months
- **TVL-based:** Reassess if sGHO TVL exceeds $100M or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, governance attack, or Aave protocol incident
- **Funding-based:** Reassess if `balanceOf(GHO, sGHO) < totalAssets()` (unfunded yield gap)
- **Rate-based:** Reassess if ASR exceeds GHO borrow rate (arbitrage risk per LlamaRisk)
- **GSM-based:** Reassess if GSM freeze lasts >24 hours or if LIQUIDATOR_ROLE is granted to any address
- **Governance-based:** Reassess if sGho proxy admin or role assignments change, or if a GhoRouter is later deployed and granted token rescue / approval-handling roles
- **Migration-based:** Reassess if/when the legacy stkGHO is migrated or unwound (currently 216.75M still held in the legacy contract, separate from the new sGho)
- **Regulatory:** Monitor MiCA enforcement actions related to interest-bearing stablecoins
