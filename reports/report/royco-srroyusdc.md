# Protocol Risk Assessment: Royco Dawn (srRoyUSDC)

- **Assessment Date:** June 26, 2026
- **Token:** srRoyUSDC (Senior Royco USDC)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32)
- **Final Score: 4.10/5.0**

## Overview + Links

srRoyUSDC is the Senior Vault token of Royco Dawn. It was initially assessed as a Concrete async vault that allocated through Royco Dawn Senior Tranche markets, but the current capital path has materially changed: as of June 26, 2026, almost all reported vault assets are allocated through `RoycoVaultMakinaStrategy` into a Makina machine rather than through the prior `MultisigStrategy` treasury handoff.

The new Makina path removes the old Treasury Safe's direct custody of the Ethereum Senior Tranche positions, but it introduces a broader, more opaque managed-position system. The Makina machine reports AUM across hub positions on Ethereum and one Arbitrum spoke caliber. Current position IDs and base tokens are visible onchain, but the exact external venues behind each position require Makina/caliber-specific decoding and monitoring.

- **Current PPS:** ~1.017419 USDC per srRoyUSDC (verified onchain June 26, 2026)
- **Total Supply:** ~12,712,411 srRoyUSDC
- **Total Assets:** ~$12,933,854 USDC (about $12,927,643 reported by Makina strategy, ~$44,211 USDC idle in vault)
- **Total Holders:** ~54 reconstructed from transfer history. The largest EOA holds ~9.56M srRoyUSDC (~75.2% of supply); Morpho Blue holds ~2.42M (~19.0%).
- **DeFiLlama TVL (Royco V2, all chains):** ~$17.81M on June 26, 2026, down from a June 17, 2026 local peak of ~$19.94M.
- **Management Fee:** 0%
- **Performance Fee:** 10% (`performanceFee()` returns recipient [`0xD6F9B6Cdf8dEb1B16E22b830166AD793fd9a0F9C`](https://etherscan.io/address/0xD6F9B6Cdf8dEb1B16E22b830166AD793fd9a0F9C), fee `1000`; recipient currently holds ~203.52 srRoyUSDC). This changed from the March assessment's 0% fee state and triggers reassessment.
- **Contract Created:** January 6, 2026 (~171 days ago)

**Links:**

- [Royco Dawn Documentation](https://royco.gitbook.io/royco-dawn)
- [Dawn Senior Vault (DSV)](https://royco.gitbook.io/royco-dawn/royco-dawn/dawn-senior-vault-dsv)
- [Mechanism](https://royco.gitbook.io/royco-dawn/royco-dawn/mechanism)
- [Key Addresses](https://royco.gitbook.io/royco-dawn/royco-dawn/key-addresses)
- [Security & Audits](https://royco.gitbook.io/royco-dawn/royco-dawn/security-and-audits)
- [GitHub (roycoprotocol/royco-dawn)](https://github.com/roycoprotocol/royco-dawn)
- [Bug Bounty (Immunefi)](https://immunefi.com/bug-bounty/royco/information/)
- [DeFiLlama (Royco V2)](https://defillama.com/protocol/royco-v2)
- [Summer.fi RFC — Onboard Royco Dawn Senior Vault](https://forum.summer.fi/t/rfc-onboard-royco-dawn-lp-program-senior-vault-as-new-yield-source/681)

## Contract Addresses

| Contract | Address |
|----------|---------|
| srRoyUSDC (VaultProxy, ERC-4626) | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) |
| Implementation (ConcreteAsyncVaultImpl) | [`0x1b5cd91e61505d431d2a61192a1006146bd9bb28`](https://etherscan.io/address/0x1b5cd91e61505d431d2a61192a1006146bd9bb28) |
| Vault owner / VAULT_MANAGER (Gnosis Safe 3/4) | [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) |
| Legacy Owner Safe (Gnosis Safe 3/4) | [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190) |
| Treasury Safe (Gnosis Safe 3/5, legacy MultisigStrategy accounting/custody) | [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8) |
| Multisig Strategy (TransparentUpgradeableProxy, current allocation 0) | [`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D) |
| MultisigStrategy Implementation | [`0xb417a7c43a7a8aa27bba2b2bb4639878532f9d0c`](https://etherscan.io/address/0xb417a7c43a7a8aa27bba2b2bb4639878532f9d0c) |
| RoycoVaultMakinaStrategy (current primary strategy) | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) |
| Makina Machine (BeaconProxy) | [`0xFa097420f0e2C72456B361a1eD85172B9ccd8c38`](https://etherscan.io/address/0xFa097420f0e2C72456B361a1eD85172B9ccd8c38) |
| Makina Machine Beacon | [`0x5c680ec39bafe8524f3c2fa9d5f6d65f09bd7333`](https://etherscan.io/address/0x5c680ec39bafe8524f3c2fa9d5f6d65f09bd7333) |
| Makina Machine Implementation | [`0xb655ad796634562136B593397b8b4849F332213f`](https://etherscan.io/address/0xb655ad796634562136B593397b8b4849F332213f) |
| Makina Share Token | [`0x1004D230aCA4b781d0049AFD6D0b1ee8ed3A6787`](https://etherscan.io/address/0x1004D230aCA4b781d0049AFD6D0b1ee8ed3A6787) |
| Makina Hub Caliber | [`0x5476F4E23dAA093Ce6700e1026013c55F7AF9083`](https://etherscan.io/address/0x5476F4E23dAA093Ce6700e1026013c55F7AF9083) |
| Makina Hub Caliber Beacon | [`0x3f5a881db86d6f495823028a1e892e7b2cd7e162`](https://etherscan.io/address/0x3f5a881db86d6f495823028a1e892e7b2cd7e162) |
| Makina Hub Caliber Implementation | [`0x44B80fB32ae735d9491bE7011A9850072D61FaD9`](https://etherscan.io/address/0x44B80fB32ae735d9491bE7011A9850072D61FaD9) |
| Makina Arbitrum Spoke Mailbox | [`0x81Efb959957B0735A1B25dCF929d4b89579495c6`](https://arbiscan.io/address/0x81Efb959957B0735A1B25dCF929d4b89579495c6) |
| Makina Arbitrum Spoke Mailbox Beacon | [`0x2f7101C2EFfa4a2d48A95958F594e3306717a0A0`](https://arbiscan.io/address/0x2f7101C2EFfa4a2d48A95958F594e3306717a0A0) |
| Makina Arbitrum Spoke Mailbox Implementation | [`0x2fA89c9b9711ddaC4BB429DCAAC918aC65e98b7a`](https://arbiscan.io/address/0x2fA89c9b9711ddaC4BB429DCAAC918aC65e98b7a) |
| Makina Arbitrum Spoke Caliber | [`0x5476F4E23dAA093Ce6700e1026013c55F7AF9083`](https://arbiscan.io/address/0x5476F4E23dAA093Ce6700e1026013c55F7AF9083) |
| Makina Machine Authority | [`0x0fCEfa3f1047F35521A49cD8B06faBd588665d7F`](https://etherscan.io/address/0x0fCEfa3f1047F35521A49cD8B06faBd588665d7F) |
| Makina Operator / Mechanic EOA | [`0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF`](https://etherscan.io/address/0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF) |
| Makina Security Council (Gnosis Safe 2/4) | [`0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc`](https://etherscan.io/address/0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc) |
| ConcreteFactory (Vault Proxy Admin) | [`0x0265d73a8e61f698d8eb0dfeb91ddce55516844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c) |
| ConcreteFactory Owner (Gnosis Safe 3/5) | [`0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C`](https://etherscan.io/address/0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C) |
| RoycoFactory (AccessManager) | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) |
| AdaptiveCurveYDM (Yield Distribution Model) | [`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc) |
| RoycoFactory Proxy (Dawn Market Factory) | [`0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C`](https://etherscan.io/address/0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C) |
| Contract Creator | [`0xe86055afa2714dcd416594bc2db9b8fa69d70a47`](https://etherscan.io/address/0xe86055afa2714dcd416594bc2db9b8fa69d70a47) |

### Current Makina Allocation Path

`RoycoVaultMakinaStrategy.getMakinaMachine()` returns [`0xFa097420f0e2C72456B361a1eD85172B9ccd8c38`](https://etherscan.io/address/0xFa097420f0e2C72456B361a1eD85172B9ccd8c38). The strategy is the machine's configured depositor and redeemer. On June 26, 2026:

- `RoycoVaultMakinaStrategy.totalAllocatedValue()` = **12,927,642.546087 USDC**
- Makina machine `recoveryMode()` = **false**
- Makina machine `maxWithdraw()` = **435.535075 USDC** (only idle USDC at the machine is immediately withdrawable)
- Machine `lastTotalAum()` = **12,927,642.546088 USDC**, last global accounting update at **2026-06-26 20:02:35 UTC**
- Hub caliber `getDetailedAum()` = **12,342,555.087744 USDC** across 10 current position IDs
- One Arbitrum spoke is registered for chain ID 42161. The mailbox [`0x81Efb959957B0735A1B25dCF929d4b89579495c6`](https://arbiscan.io/address/0x81Efb959957B0735A1B25dCF929d4b89579495c6) is a BeaconProxy using beacon [`0x2f7101C2EFfa4a2d48A95958F594e3306717a0A0`](https://arbiscan.io/address/0x2f7101C2EFfa4a2d48A95958F594e3306717a0A0) and implementation [`0x2fA89c9b9711ddaC4BB429DCAAC918aC65e98b7a`](https://arbiscan.io/address/0x2fA89c9b9711ddaC4BB429DCAAC918aC65e98b7a). Its linked Arbitrum caliber is [`0x5476F4E23dAA093Ce6700e1026013c55F7AF9083`](https://arbiscan.io/address/0x5476F4E23dAA093Ce6700e1026013c55F7AF9083); `getDetailedAum()` reports **584,651.923269 USDC** across one position ID (`0x280b434adb08af0aec159fc023fa6d96`).

Makina hub base tokens currently registered on Ethereum:

| Token | Address |
|-------|---------|
| USDC | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) |
| NUSD (Neutrl USD) | [`0xE556ABa6fe6036275Ec1f87eda296BE72C811BCE`](https://etherscan.io/address/0xE556ABa6fe6036275Ec1f87eda296BE72C811BCE) |
| USDG (Global Dollar) | [`0xe343167631d89B6Ffc58B88d6b7fB0228795491D`](https://etherscan.io/address/0xe343167631d89B6Ffc58B88d6b7fB0228795491D) |
| RLUSD | [`0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD`](https://etherscan.io/address/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD) |
| PYUSD | [`0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`](https://etherscan.io/address/0x6c3ea9036406852006290770BEdFcAbA0e23A0e8) |
| USDtb | [`0xC139190F447e929f090Edeb554D95AbB8b18aC1C`](https://etherscan.io/address/0xC139190F447e929f090Edeb554D95AbB8b18aC1C) |
| cUSD (Cap) | [`0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC`](https://etherscan.io/address/0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC) |

Makina Arbitrum spoke base tokens currently registered:

| Token | Address |
|-------|---------|
| USDC | [`0xaf88d065e77c8cC2239327C5EDb3A432268e5831`](https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831) |
| PYUSD | [`0x46850aD61c2B7d64d08c9c754F45254596696984`](https://arbiscan.io/address/0x46850aD61c2B7d64d08c9c754F45254596696984) |
| USDai | [`0x0a1a1A107E45b7Ced86833863F482BC5f4ed82EF`](https://arbiscan.io/address/0x0a1a1A107E45b7Ced86833863F482BC5f4ed82EF) |

Current hub position values are visible only by position ID, not by human-readable venue:

| Position ID | Value (USDC) |
|-------------|--------------|
| `0xee8d64c04ee7633412b9ddfad3b42979` | ~1,781,172 |
| `0xbf7e4ddf0195edf3a0240c54c91869fe` | ~2,445,835 |
| `0xcdf058132e4b72dac4b2be45f350b54d` | ~1,546,209 |
| `0x4879fe0d3dff270d0e4de1269bee3631` | ~2,598,939 |
| `0x88099e63d7c94e1d222b1c075ba7290c` | ~1,756,865 |
| `0x92944864fa8c7a6664302cfd7ab2bb40` | ~1,606,558 |
| `0x903ba29812874db073661de18fb5401` | ~605,000 |
| Other dust / small IDs | ~$1,978 |

### Legacy Dawn Market Contracts

The March 2026 assessment traced Treasury-held Senior Tranche positions across Neutrl sNUSD, Tokemak autoUSD, Aave aUSDC, and Avalanche savUSD. On June 26, 2026, Ethereum `balanceOf()` checks for the Treasury Safe returned **0** for aUSDC, ROY-ST-sNUSD, ROY-ST-sNUSD legacy, ROY-ST-autoUSD, and USDC. The prior Dawn tranching table is therefore historical context, not the current srRoyUSDC allocation path.

## Audits and Due Diligence Disclosures

Royco Dawn has multiple public audit artifacts in the `roycoprotocol/royco-dawn` repository. Since the March assessment, the public audit folder has added Certora and additional Hexens reports. The protocol is built on the Concrete vault framework and now routes srRoyUSDC through Makina contracts; audits of Royco Dawn do not remove the current operational/accounting dependency on Makina-controlled positions.

| Auditor | Scope | Date | Status | Report |
|---------|-------|------|--------|--------|
| Hexens | Royco Dawn | 2026 | Completed | [Report 1](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn-1.pdf), [Report 2](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn-2.pdf), [Report 3](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn-3.pdf) |
| Hexens | Royco Dawn (whitelist) | ~Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn-Whitelist.pdf) |
| Certora | Royco Dawn | 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Certora-Royco-Dawn-1.pdf) |
| Cantina | Royco Dawn (competition) | Jan 20-27, 2026 | Public competition page still available; final standalone report not found in repo audit folder | [Competition Page](https://cantina.xyz/competitions/9c6e38e2-535e-47b2-83ef-29df91fbb774) |
| Cantina | Royco Dawn (whitelist) | Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Cantina-Royco-Dawn-Whitelist.pdf) |
| Spearbit | Royco V1 (not Dawn) | Oct 2024 | Completed | [Report (PDF)](https://3836750677-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FFUgP4mdwyU2SaFFJTcT6%2Fuploads%2FyMcPEXtbAbVKk8rFSLAZ%2Freport-spearbit.pdf) |
| Nethermind | Royco Boosts (not Dawn) | May 2025 | Completed | [Blog Post](https://www.nethermind.io/blog/how-nethermind-secured-royco-boosts-development) |

**Smart Contract Complexity:** High — ERC-1967 Concrete vault, legacy TransparentUpgradeableProxy `MultisigStrategy`, active `RoycoVaultMakinaStrategy`, Makina BeaconProxy machine and hub caliber, Arbitrum spoke accounting, AccessManager permissions, async vault queue, fee-share minting, and opaque managed positions.

**Note:** The Cantina competition explicitly excluded from scope: oracle/NAV/share price manipulation, whitelisted parties behaving maliciously, external protocol bugs, centralization risks, MEV, and frontrunning. These exclusions mean some significant risk vectors remain unaudited.

### Bug Bounty

- **Platform:** Immunefi
- **Maximum Payout:** $250,000 (Critical, capped at 10% of affected funds)
- **Status:** Live since February 17, 2026
- **KYC Required:** Yes
- **Link:** https://immunefi.com/bug-bounty/royco/information/

### Safe Harbor

Royco is **not** listed on the [SEAL Safe Harbor Registry](https://safeharbor.securityalliance.org/).

## Historical Track Record

- **Royco V1 Launch:** 2024 (incentive marketplace for DeFi liquidity)
- **Royco Dawn (V2) Launch:** January 6, 2026 (~171 days in production)
- **Smart Contract Exploits:** None known. Protocol is still very new.
- **Security Incidents:** None found in rekt.news, de.fi REKT Database, or other exploit trackers.
- **TVL:** ~$17.81M across Royco V2 on DeFiLlama on June 26, 2026. srRoyUSDC vault `totalAssets()`: ~$12.93M, primarily reported by Makina machine accounting.
- **Holder Distribution:** 54 current holders reconstructed from transfer history. The largest EOA ([`0x72f9c5433113289985977e72f87d76969194f9ef`](https://etherscan.io/address/0x72f9c5433113289985977e72f87d76969194f9ef)) holds ~9.56M srRoyUSDC (~75.2%). Morpho Blue ([`0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb`](https://etherscan.io/address/0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb)) holds ~2.42M (~19.0%). Extreme concentration risk remains.
- **Peg Stability / Secondary Liquidity:** srRoyUSDC is priced at ~1.017419 USDC. Curve CurveStableSwapNG pool ([`0x8fc753f96752b35f64d1bae514e6cf8db0b9322e`](https://etherscan.io/address/0x8fc753f96752b35f64d1bae514e6cf8db0b9322e)) now holds only ~8,686 srRoyUSDC, a sharp decline from March.
- **GitHub Activity:** 548 commits on main branch, 2 contributors (Shivaansh Kapoor and Ankur Dubey). v1.0.0 released February 5, 2026. Repository has 4 stars.

## Funds Management

The vault now allocates primarily through RoycoVaultMakinaStrategy into a Makina machine. This is a material change from the March architecture where the Treasury Safe held Senior Tranche tokens and aUSDC.

### Current Allocation

| Component | Current value / status (June 26, 2026) |
|-----------|----------------------------------------|
| Vault `totalAssets()` | ~$12.934M |
| Vault idle USDC | ~$44.2K |
| MultisigStrategy allocation | 0 |
| RoycoVaultMakinaStrategy allocation | ~$12.927M |
| Makina hub caliber AUM | ~$12.343M across 10 opaque position IDs |
| Makina Arbitrum spoke AUM | ~$584.7K verified on Arbitrum across one position ID |
| Makina idle USDC / immediate strategy `maxWithdraw()` | ~$435.5 |

The current allocation is no longer expressible as the old Avant / Neutrl / Aave / Auto target table. Makina base tokens now include USDC, NUSD, USDG, RLUSD, PYUSD, USDtb, and cUSD. That widens the dependency set to multiple stablecoin issuers and Makina position management.

### Accessibility

- **Deposits:** KYC-gated. Participants undergo KYC verification and deposits are restricted to whitelisted addresses.
- **Withdrawals:** Async withdrawal queue remains active. Vault exits depend on Makina strategy redemptions and machine liquidity.
- **Fees:** Management fee remains 0%. Performance fee is now 1000 bps with recipient [`0xD6F9B6Cdf8dEb1B16E22b830166AD793fd9a0F9C`](https://etherscan.io/address/0xD6F9B6Cdf8dEb1B16E22b830166AD793fd9a0F9C). Fee changes require the VAULT_MANAGER Safe.
- **Secondary Market:** Curve liquidity has fallen to ~8,686 srRoyUSDC. Morpho USDC liquidity is larger than March but still limited relative to the dominant holder and vault size.

### Collateralization

- srRoyUSDC remains USDC-denominated, but current backing is mediated by Makina machine accounting rather than directly visible Senior Tranche balances.
- The Makina hub exposes position IDs and USDC-denominated values; it does not provide human-readable venue labels from simple read calls.
- The old Dawn Junior-first coverage analysis is no longer the primary collateralization path for srRoyUSDC because Treasury Safe balances in the prior Senior Tranche tokens are now zero on Ethereum.
- Current backing includes exposure to registered Ethereum base tokens USDC, NUSD, USDG, RLUSD, PYUSD, USDtb, and cUSD, plus Arbitrum spoke base tokens USDC, PYUSD, and USDai. Each introduces issuer, liquidity, oracle/accounting, and bridge/spoke risks.
- Makina `recoveryMode()` is currently false, but `maxWithdraw()` is only ~$435.5 because machine withdrawals are limited to idle accounting-token balance. This makes the async vault dependent on position unwinds, not a large immediately liquid reserve.

### Provability

- srRoyUSDC exchange rate is computed onchain via ERC-4626 (`totalAssets()` / `totalSupply()`).
- `totalAssets()` is currently dominated by `RoycoVaultMakinaStrategy.totalAllocatedValue()`, which values the strategy share-token balance in the Makina machine via `convertToAssets()`.
- Makina machine `lastTotalAum()` is onchain and was updated on June 26, 2026. Hub caliber position values are visible onchain by position ID.
- The exact external venue behind each Makina position ID is not decoded in this report. That limits independent reserve verification and makes the Makina operator/accounting process a central risk surface.
- The Makina operator/mechanic EOA [`0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF`](https://etherscan.io/address/0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF) is currently an accounting agent. The Makina Security Council Safe is also accounting-authorized.
- Arbitrum spoke accounting was decoded through the monitoring RPC. The spoke caliber reports one position ID (`0x280b434adb08af0aec159fc023fa6d96`) worth ~584,651.923269 USDC, with registered Arbitrum base tokens USDC, PYUSD, and USDai. This confirms the spoke AUM reported by the machine, but the human-readable external venue behind the position ID remains opaque.

## Liquidity Risk

- **Primary Exit:** Async withdrawal from vault. There is no instant vault redemption path.
- **Makina liquidity:** RoycoVaultMakinaStrategy `maxWithdraw()` is only ~435.5 USDC despite ~$12.93M allocated value, so exits depend on Makina position unwinds and accounting freshness.
- **Secondary Exit (DEX):** Curve CurveStableSwapNG pool ([`0x8fc753f96752b35f64d1bae514e6cf8db0b9322e`](https://etherscan.io/address/0x8fc753f96752b35f64d1bae514e6cf8db0b9322e)) holds only ~8,686 srRoyUSDC, so DEX exit capacity is negligible versus TVL.
- **Morpho Blue Markets** (verified via [Morpho API](https://api.morpho.org/graphql), June 26, 2026):
  - srRoyUSDC/USDC (91.5% LLTV, [market](https://app.morpho.org/ethereum/market/0xacc49fbf58feb1ac971acce68f8adc177c43682d6a7087bbd4991a05cb7a2c67/srroyusdc-usdc)): ~$1.665M supply, ~$1.465M borrowed, 87.94% utilized, ~$200.8K liquid USDC, and ~$2.46M srRoyUSDC collateral.
  - srRoyUSDC/pmUSD (86% LLTV, [market](https://app.morpho.org/ethereum/market/0x72cc79433e9f91c2a185422725510f4bdd19c9006010f464f851468b2371b756/srroyusdc-pmusd)): ~$35.9K supply, ~$2 borrowed, near-zero utilization, and only ~$7.6 srRoyUSDC collateral.
- **Large Holder Impact:** The largest EOA holds ~75.2% of supply. A withdrawal or sale of this size would require a managed unwind of most vault exposure and cannot be absorbed by current secondary liquidity.

## Centralization & Control Risks

### Governance

The current governance path involves the Concrete vault proxy admin, the Royco AccessManager, the VAULT_MANAGER Safe, Makina governance roles, and a legacy MultisigStrategy proxy admin.

**VAULT_MANAGER / Vault Owner:** [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997)
- **Type:** Gnosis Safe v1.4.1
- **Threshold:** 3 of 4 signers
- **Powers:** Current `owner()` of the srRoyUSDC vault, fee/queue management, Makina risk manager and risk-manager timelock, and current holder of several RoycoFactory AccessManager admin roles.

**Legacy Owner Safe:** [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190)
- **Type:** Gnosis Safe v1.3.0
- **Threshold:** 3 of 4 signers
- **Powers:** No longer the vault `owner()`. Still relevant because the MultisigStrategy ProxyAdmin owner remains tied to this legacy control path.

**Treasury Safe:** [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)
- **Type:** Gnosis Safe v1.4.1
- **Threshold:** 3 of 5 signers
- **Powers:** Legacy MultisigStrategy accounting/custody path. Current Ethereum balances for the old senior tranche and aUSDC positions are zero.

**Makina Security Council:** [`0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc`](https://etherscan.io/address/0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc)
- **Type:** Gnosis Safe v1.4.1
- **Threshold:** 2 of 4 signers
- **Powers:** Accounting-authorized on the active Makina machine.

**Makina Operator / Mechanic:** [`0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF`](https://etherscan.io/address/0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF)
- **Type:** EOA
- **Powers:** Machine `operator`, `mechanic`, accounting agent, and accounting-authorized address. This is a major operational centralization point.

**ConcreteFactory Owner:** [`0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C`](https://etherscan.io/address/0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C)
- **Type:** Gnosis Safe v1.4.1
- **Threshold:** 3 of 5 signers
- **Powers:** Approves vault implementation upgrades through ConcreteFactory.

**Timelock / delay observations:** RoycoFactory AccessManager roles now appear assigned to VAULT_MANAGER. Sidecar checks found `ADMIN_UPGRADER_ROLE`, `ADMIN_KERNEL_ROLE`, and `ADMIN_ACCOUNTANT_ROLE` with 172,800 second delays; `ADMIN_ROLE`, `ADMIN_PAUSER_ROLE`, and `SYNC_ROLE` had zero delay. The active Makina machine uses its own AccessManaged authority [`0x0fCEfa3f1047F35521A49cD8B06faBd588665d7F`](https://etherscan.io/address/0x0fCEfa3f1047F35521A49cD8B06faBd588665d7F).

**Upgradeable Contracts:**
- srRoyUSDC vault: ERC-1967 proxy -> ConcreteAsyncVaultImpl [`0x1b5c...bb28`](https://etherscan.io/address/0x1b5cd91e61505d431d2a61192a1006146bd9bb28); admin ConcreteFactory [`0x0265...844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c).
- MultisigStrategy: TransparentUpgradeableProxy -> [`0xb417...9d0c`](https://etherscan.io/address/0xb417a7c43a7a8aa27bba2b2bb4639878532f9d0c); current allocation 0, but proxy remains upgradeable.
- Makina strategy: verified non-proxy strategy contract with immutable vault and machine addresses.
- Makina machine: BeaconProxy; beacon [`0x5c68...333`](https://etherscan.io/address/0x5c680ec39bafe8524f3c2fa9d5f6d65f09bd7333), implementation [`0xb655...213f`](https://etherscan.io/address/0xb655ad796634562136B593397b8b4849F332213f).
- Makina hub caliber: BeaconProxy; beacon [`0x3f5a...e162`](https://etherscan.io/address/0x3f5a881db86d6f495823028a1e892e7b2cd7e162), implementation [`0x44B8...FaD9`](https://etherscan.io/address/0x44B80fB32ae735d9491bE7011A9850072D61FaD9).

### Programmability

- PPS is calculated onchain via ERC-4626, but the asset value now depends on Makina machine accounting.
- Makina accounting is more programmatic than the old full Treasury handoff, but still depends on authorized operators/accounting agents and position accounting freshness.
- Performance fee is now enabled at 10%, so `accrueYield()` can mint fee shares to a nonzero recipient.
- KYC gating remains an offchain dependency for deposits.

### External Dependencies

1. **Makina machine / caliber system (Critical):** Active allocation path, opaque position IDs, BeaconProxy upgrade surface, accounting agents, and one Arbitrum spoke.
2. **Stablecoin/base-token dependencies (Critical):** USDC, NUSD, USDG, RLUSD, PYUSD, USDtb, and cUSD are registered base tokens in the Makina hub.
3. **Concrete Framework (Medium-High):** Concrete remains the vault implementation and proxy-admin framework.
4. **Morpho / Curve secondary liquidity (Medium):** Secondary liquidity is limited and cannot absorb large exits.

## Operational Risk

- **Team:** Jai Bhavnani (Co-founder & CEO of Waymont, the company behind Royco). Previously co-founded Rari Capital (grew to $1.5B AUM, sold to Tribe DAO for $375M). Also founded Ambo (acquired by MyCrypto). James Folkestad is co-founder. Team is small — only 2 contributors to the GitHub repo (Shivaansh Kapoor and Ankur Dubey).
- **Funding:** Pre-seed completed. Investors include Electric Capital, Coinbase Ventures, Amber Group, and Hashed. Exact amount undisclosed.
- **Documentation:** Adequate. Gitbook documentation covers mechanism, risk framework, key addresses, and DSV. Some areas lack depth (oracle mechanism, detailed per-market coverage data). No comprehensive technical documentation for smart contract integrations.
- **Legal:** Waymont Co., based in Los Angeles, California. Founded 2022. Formal legal structure not disclosed in detail. KYC required for participation suggests regulatory compliance efforts.
- **Incident Response:** Hypernative being configured for continuous monitoring. Emergency upgrade system in place. Private security council being assembled. No publicly documented incident response plan yet.
- **License:** Not specified in contracts.

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Purpose | Key Events/Functions |
|----------|---------|---------|---------------------|
| srRoyUSDC Vault | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) | Vault state | `totalAssets()`, `totalSupply()`, `convertToAssets()`, queue state, fee config, `accrueYield()` |
| VAULT_MANAGER | [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) | Vault owner / risk manager | Fee updates, queue changes, AccessManager role actions, signer changes |
| RoycoVaultMakinaStrategy | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) | Active strategy | `totalAllocatedValue()`, `maxWithdraw()`, `paused()`, machine address |
| Makina Machine | [`0xFa097420f0e2C72456B361a1eD85172B9ccd8c38`](https://etherscan.io/address/0xFa097420f0e2C72456B361a1eD85172B9ccd8c38) | Active allocator/accounting | `lastTotalAum()`, `lastGlobalAccountingTime()`, `recoveryMode()`, `maxWithdraw()`, base tokens, spoke calibers |
| Makina Hub Caliber | [`0x5476F4E23dAA093Ce6700e1026013c55F7AF9083`](https://etherscan.io/address/0x5476F4E23dAA093Ce6700e1026013c55F7AF9083) | Position accounting | `getDetailedAum()`, `getPositionsLength()`, `getPosition()`, allowed instruction root |
| Makina Security Council | [`0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc`](https://etherscan.io/address/0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc) | Accounting-authorized Safe | signer/threshold changes, accounting actions |
| Makina Operator / Mechanic | [`0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF`](https://etherscan.io/address/0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF) | Accounting/operator EOA | accounting updates, position management, role changes |
| ConcreteFactory | [`0x0265d73a8e61f698d8eb0dfeb91ddce55516844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c) | Vault proxy admin | Implementation approvals, vault upgrades |
| RoycoFactory / AccessManager | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) | Role manager | role grants, scheduled operations, delay changes |

### Critical Monitoring Points

- **PPS:** Track `convertToAssets(1e6)`. Current baseline: ~1.017419 USDC.
- **Fee config:** Management fee 0%; performance fee 1000 bps to [`0xD6F9...0F9C`](https://etherscan.io/address/0xD6F9B6Cdf8dEb1B16E22b830166AD793fd9a0F9C). Alert on any fee or recipient change.
- **Makina AUM:** Track `lastTotalAum()`, `lastGlobalAccountingTime()`, hub `getDetailedAum()`, and the chain-42161 spoke. Alert if accounting becomes stale or if AUM changes without expected position events.
- **Makina liquidity:** Track strategy `maxWithdraw()` and machine idle USDC. Current baseline is only ~435.5 USDC.
- **Recovery mode / pauses:** Alert if Makina machine `recoveryMode()` or strategy `paused()` becomes true.
- **Position IDs:** Alert on new, removed, or sharply changing Makina hub positions; decode adapters/venues before treating a new position as understood.
- **Base tokens:** Alert on additions/removals of hub base tokens, especially new non-USDC stablecoin dependencies.
- **Holder concentration:** Monitor the dominant EOA (~75.2%), Morpho Blue (~19.0%), and Curve pool (~8.7K srRoyUSDC).
- **Secondary liquidity:** Monitor Curve srRoyUSDC balance and Morpho USDC market liquid assets.

## Risk Summary

### Key Strengths

1. **Onchain vault/share accounting remains available** — srRoyUSDC PPS, supply, total assets, strategy value, and Makina machine AUM are queryable onchain.
2. **More audit artifacts are public** — Royco Dawn now has additional Hexens reports and a Certora report in the public audit folder.
3. **Dual-control vault implementation upgrades remain** — ConcreteFactory still controls vault implementation upgrades, separating that path from Royco-only controls.
4. **KYC-gated participation** — deposits remain permissioned, reducing anonymous depositor risk.
5. **Makina position values are at least observable by ID** — while not human-readable, hub position AUM and timestamps can be monitored directly.

### Key Risks

1. **Material strategy migration** — nearly all assets moved from the old Treasury / Dawn Senior Tranche path to Makina. The previous allocation and coverage analysis is stale for current risk.
2. **Opaque Makina positions** — the report can verify position IDs and values, but not the human-readable venues behind them without additional Makina adapter decoding.
3. **Very low immediate liquidity** — Makina `maxWithdraw()` is ~$435.5, Curve holds only ~8,686 srRoyUSDC, and Morpho liquid USDC is only ~$200.8K.
4. **Extreme holder concentration** — the largest EOA holds ~75.2% of supply.
5. **Performance fee enabled** — performance fee changed from 0% to 10%, enabling fee-share minting to a nonzero recipient.
6. **Makina operator/accounting centralization** — an EOA is operator, mechanic, accounting agent, and accounting-authorized; a 2-of-4 Safe is also accounting-authorized.

### Critical Risks

- **Reserve provability is still conditional:** The vault value is onchain, but the backing path now depends on Makina position accounting and opaque position IDs. This is not equivalent to independently verifying all underlying venues.
- **Exit liquidity is weak:** A large withdrawal must rely on managed position unwinds. Current immediate machine liquidity and secondary market depth are tiny versus vault TVL.
- **Expanded stablecoin dependency set:** Current Makina base tokens include NUSD, USDG, RLUSD, PYUSD, USDtb, and cUSD in addition to USDC.
- **Governance/accounting concentration:** VAULT_MANAGER controls the vault; Makina operator/accounting permissions are concentrated in an EOA and a 2-of-4 Safe.

---

## Token Minting Analysis

### Current Implementation — No Direct Minting Without Assets

The vault implementation uses standard ERC-4626 mint/deposit paths that require USDC transfer before share minting. There is no directly observed unrestricted `mint` function for arbitrary srRoyUSDC supply creation.

### Fee Share Minting

Fee share minting is now active as a risk path because performance fee is nonzero:

- `managementFee()` returns recipient `address(0)`, fee `0`, last update timestamp `1782491051`.
- `performanceFee()` returns recipient [`0xD6F9B6Cdf8dEb1B16E22b830166AD793fd9a0F9C`](https://etherscan.io/address/0xD6F9B6Cdf8dEb1B16E22b830166AD793fd9a0F9C), fee `1000`.
- The performance-fee recipient currently holds ~203.52 srRoyUSDC.
- `accrueYield()` is publicly callable, so once yield is recognized, fee shares can be minted according to current fee config.

### Indirect Inflation Vectors

1. **Makina AUM / PPS reporting:** srRoyUSDC PPS now depends on Makina machine `lastTotalAum()` and strategy-owned machine shares. Incorrect or malicious Makina accounting can affect vault PPS.
2. **Performance fee minting:** A nonzero performance fee can dilute depositors by minting fee shares to the recipient when yield accrues.
3. **Vault implementation upgrade:** A malicious vault implementation could add unrestricted minting, but this requires the ConcreteFactory upgrade path.
4. **Makina implementation / authority changes:** Beacon upgrades or authority changes in the Makina machine/hub path could alter accounting, withdrawals, or position-management constraints.

### Conclusion

There is still no direct unrestricted srRoyUSDC mint path in the current vault implementation. The important June 2026 change is that fee minting is no longer disabled: the performance fee is set to 1000 bps with a nonzero recipient. The larger inflation/accounting risk is now Makina AUM correctness rather than the old MultisigStrategy `adjustTotalAssets()` path.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** → **PASS** (Royco Dawn has Hexens, Certora, and whitelist audit artifacts; Makina-specific integration risk remains a live review item)
- [ ] **Unverifiable reserves** → **CONDITIONAL PASS** (ERC-4626 exchange rate and Makina machine AUM are onchain. Arbitrum spoke AUM is now decoded, but the human-readable venue composition behind Makina position IDs is still not fully transparent from the vault layer.)
- [ ] **Total centralization** → **PASS, with elevated centralization** (vault ownership moved to VAULT_MANAGER Safe and Royco AccessManager roles are multisig-held, but Makina operation/accounting includes concentrated EOA and security-council authority)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **3.0**

| Aspect | Assessment |
|--------|-----------|
| Audits | Royco Dawn public audit folder now includes Hexens, Certora, and whitelist reports. A standalone final Cantina competition report was not found in the repo audit folder. Makina path integration should be treated as separate operational surface. |
| Bug Bounty | Immunefi bounty remains a positive signal, but it does not cover all whitelisted-party, governance, or offchain/accounting failures. |
| Time in Production | ~171 days since January 6, 2026 launch of this product line. |
| TVL | srRoyUSDC reports ~12.93M USDC total assets. Royco V2 DeFiLlama TVL was ~$17.81M on June 26, 2026. |
| Historical Incidents | No public incident found during reassessment. |

The audit trail has improved since March, and the product has operated longer without a public incident. The score remains constrained by short production history, reliance on newer Royco/Makina components, and the absence of a readily located final public Cantina competition report.

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **4.0**

**Subcategory A: Governance — 4.0**

- Vault `owner()` is now VAULT_MANAGER Safe (`0x7c405b...9997`, 3-of-4), replacing the old Owner Safe for the primary vault owner path.
- RoycoFactory AccessManager roles are now assigned primarily to VAULT_MANAGER, with 2-day delays on upgrader/kernel/accountant admin roles and no delay on several operational roles.
- Vault implementation upgrades still involve the ConcreteFactory proxy-admin path, owned by Concrete's 3-of-5 Safe.
- The legacy MultisigStrategy remains upgradeable and ProxyAdmin-owned by the old Owner Safe, but current allocation is 0.
- No DAO or broad token-holder governance exists.

**Subcategory B: Programmability — 4.0**

- PPS and vault accounting are onchain, but now depend on Makina machine AUM and machine-share accounting rather than direct Dawn Senior Tranche balances.
- Makina `restrictedAccountingMode()` is true and accounting stale threshold is 8 hours, but updates depend on authorized Makina actors.
- Machine operator/mechanic/accounting authority includes EOA [`0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF`](https://etherscan.io/address/0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF).
- The security council Safe (`0x89faa3...0Afc`, 2-of-4) also has accounting authority.
- Performance fee is now nonzero, and `accrueYield()` can mint fee shares according to current fee settings.

**Subcategory C: External Dependencies — 4.0**

- Capital path now depends on the Makina strategy, Makina BeaconProxy machine, hub caliber, Arbitrum spoke caliber, and base-token universe.
- Base-token universe includes USDC, NUSD, USDG, RLUSD, PYUSD, USDtb, and cUSD.
- Current hub caliber positions are opaque IDs rather than the prior easy-to-map Dawn Senior Tranche table.
- Concrete remains a third-party dependency for vault proxy administration.
- Secondary liquidity depends on Curve and Morpho markets, neither of which can absorb a large holder exit without meaningful slippage or queue reliance.

**Score: (4.0 + 4.0 + 4.0) / 3 = 4.0/5**

#### Category 3: Funds Management (Weight: 30%) — **5.0**

**Subcategory A: Collateralization — 5.0**

- Vault `totalAssets()` reports ~12.93M USDC, with ~12.93M USDC-equivalent allocated through RoycoVaultMakinaStrategy and only ~44.2K idle in the vault.
- The active strategy owns Makina machine shares rather than the old Senior Tranche positions.
- Makina machine `lastTotalAum()` is ~12.93M USDC and hub caliber `getDetailedAum()` is ~12.34M USDC.
- The Makina base-token universe includes several newer stablecoin/receipt-token dependencies: NUSD, USDG, RLUSD, PYUSD, USDtb, and cUSD.
- Current onchain `maxWithdraw()` from the machine/strategy is only ~435.5 USDC, so collateral quality and liquidity depend on Makina position unwind behavior.
- Legacy Treasury Safe balances for the old Dawn Senior Tranche and aUSDC positions checked on Ethereum are zero.

**Subcategory B: Provability — 5.0**

- ERC-4626 exchange rate is onchain, and current PPS is ~1.017419 USDC per srRoyUSDC.
- Makina AUM and hub position values are queryable onchain, but the position IDs do not provide simple, user-readable attribution to final protocols from the vault report alone.
- Arbitrum spoke accounting is now verified from Arbitrum RPC: one position ID reports ~584,651.923269 USDC, with USDC, PYUSD, and USDai as registered spoke base tokens.
- No independent proof-of-reserves, third-party attestation, or fully decoded position inventory was found.
- The provability risk moved from old `adjustTotalAssets()` self-reporting to Makina accounting and cross-chain position transparency.

**Score: (5.0 + 5.0) / 2 = 5.0/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **4.5**

- Queue-based withdrawal with up to 14-day unlock period
- Current onchain `maxWithdraw()` from the Makina machine/strategy is ~435.5 USDC, far below vault TVL.
- Curve CurveStableSwapNG pool now holds only ~8,686 srRoyUSDC, a sharp decline from March.
- Morpho srRoyUSDC/USDC market has ~$200.8K liquid USDC against ~$2.46M collateral and ~87.9% utilization.
- Morpho srRoyUSDC/pmUSD market has ~$35.9K liquidity and negligible borrow, but it is not a direct USDC exit.
- Holder concentration is extreme: the largest holder owns ~75.17% of supply, while Morpho Blue holds ~19.00%.
- A single large withdrawal or collateral liquidation would require Makina unwinds and/or queue processing.
- Same-value asset (USDC-denominated) mitigates some waiting risk

**Score: 4.5/5**

#### Category 5: Operational Risk (Weight: 5%) — **2.5**

- Founder Jai Bhavnani is publicly known with DeFi track record
- VC-backed by reputable investors (Electric Capital, Coinbase Ventures, Hashed, Amber Group)
- Public GitHub repo ([roycoprotocol/royco-dawn](https://github.com/roycoprotocol/royco-dawn)) — verified source code
- Documentation and public reporting have gaps around the current Makina position inventory and spoke composition.
- Monitoring should include vault PPS, Makina AUM, stale accounting threshold, Makina roles, fees, holder concentration, Curve/Morpho liquidity, and spoke changes.
- Makina security council is now identifiable onchain, but the operator/accounting EOA remains a concentrated operational dependency.
- No publicly documented incident response plan
- KYC requirements suggest regulatory compliance awareness
- Legal structure: Waymont Co., Los Angeles — details limited

**Score: 2.5/5**

### Final Score Calculation

No optional modifiers apply (protocol is <2 years old, TVL <$500M).

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 4.0 | 30% | 1.20 |
| Funds Management | 5.0 | 30% | 1.50 |
| Liquidity Risk | 4.5 | 15% | 0.675 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **4.10 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: ELEVATED RISK**

---

## Reassessment Triggers

- **Time-based:** Reassess by August 2026
- **TVL-based:** Reassess if TVL exceeds $50M or drops below $2M
- **Incident-based:** Reassess after any exploit, accounting anomaly, protection-mode event, delayed withdrawal event, or Makina recovery-mode activation
- **Governance-based:** Reassess if VAULT_MANAGER, ConcreteFactory owner, RoycoFactory roles, Makina operator/mechanic, Makina security council, risk manager, or beacon implementations change
- **Strategy-based:** Reassess if Makina base tokens, position IDs, spoke chains, or AUM distribution change materially
- **Fee-based:** Reassess if management fee, performance fee, or fee recipient changes
- **Liquidity-based:** Reassess if Curve liquidity falls further, Morpho USDC liquidity drops below $100K, the largest holder exceeds 80%, or the largest holder/Morpho position moves materially
- **Verification-based:** Reassess when Makina position IDs can be mapped to human-readable venues/adapters, or if spoke accounting no longer reconciles with machine-reported spoke AUM

---

## Appendix: Contract Architecture

```
User USDC
  |
  v
srRoyUSDC vault (ERC-4626 / ERC-7540, ERC-1967 proxy)
0xcD9f5907F92818bC06c9Ad70217f089E190d2a32
  | owner: VAULT_MANAGER Safe 0x7c405b...9997
  | proxy admin: ConcreteFactory 0x0265...5844
  |
  v
RoycoVaultMakinaStrategy
0xc5FeF644d59415cec65049e0653CA10eD9Cba778
  | current allocated value: ~12.93M USDC
  | maxWithdraw: ~435.5 USDC
  |
  v
Makina Machine (BeaconProxy)
0xFa097420f0e2C72456B361a1eD85172B9ccd8c38
  | beacon: 0x5c680e...7333
  | implementation: 0xb655...213f
  | share token: 0x1004D230aCA4b781d0049AFD6D0b1ee8ed3A6787
  | restrictedAccountingMode: true
  | operator/mechanic/accounting EOA: 0x425BbC...3beF
  | security council: 0x89faa3...0Afc
  |
  +--> Hub Caliber (Ethereum)
  |    0x5476F4E23dAA093Ce6700e1026013c55F7AF9083
  |    beacon implementation: 0x44B80f...FaD9
  |    detailed AUM: ~12.34M USDC
  |    base tokens: USDC, NUSD, USDG, RLUSD, PYUSD, USDtb, cUSD
  |
  +--> Arbitrum Spoke Caliber
       0x81Efb959957B0735A1B25dCF929d4b89579495c6
       mailbox beacon: 0x2f7101...7a0A0
       implementation: 0x2fA89c...8b7a
       caliber: 0x5476F4...9083
       verified spoke AUM: ~$584.7K
       one position ID: 0x280b434adb08af0aec159fc023fa6d96
       base tokens: USDC, PYUSD, USDai

Legacy path retained for monitoring:
srRoyUSDC -> MultisigStrategy -> Treasury Safe -> Dawn Senior Tranches
Current MultisigStrategy allocation is 0, and Treasury Safe balances for the
old Ethereum Dawn Senior Tranche/aUSDC positions checked during reassessment
were 0.

Governance/control:
- VAULT_MANAGER Safe controls the vault owner role and RoycoFactory AccessManager roles.
- ConcreteFactory owner controls vault implementation upgrade approval path.
- Makina authority/risk-manager/security-council/operator roles control accounting,
  recovery, and machine operations.
- Performance fee recipient is nonzero and currently holds fee shares.
```
