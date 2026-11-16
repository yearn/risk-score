# Protocol Risk Assessment: Alchemix — USDC Mix Yield Token (mixUSDC)

- **Assessment Date:** November 16, 2026
- **Token:** mixUSDC (USDC Mix Yield Token, Alchemix V3 MYT)
- **Chain:** Ethereum
- **Token Address:** [`0x9B44efCa3e2a707B63Dc00CE79d646E5E5D24bA5`](https://etherscan.io/address/0x9B44efCa3e2a707B63Dc00CE79d646E5E5D24bA5)
- **Final Score: 3.30/5.0**
- **Snapshot:** Ethereum block [26,428,200](https://etherscan.io/block/26428200) (hash `0x511d24f1a5b1482a5728a198de3ae7a52b2b2abedd8d2be7c66d61f19d27194f`), November 16, 2026 14:30:23 UTC. All `cast` reads below are pinned to this block unless stated otherwise; event histories were replayed from the MYT deployment block (24,875,892) to the snapshot.

## Overview + Links

The **USDC Mix Yield Token (mixUSDC, "MYT")** is the USDC yield vault at the core of **Alchemix V3** on Ethereum. It is an unmodified **Morpho Vault V2** (`VaultV2`, ERC-4626, Solidity 0.8.28, not upgradeable) whose curator and allocator roles are held by Alchemix "middleman" contracts ([AlchemistCurator](https://etherscan.io/address/0x7d61E3cDe8B58C4be192a7A35E9d626c419302A4), [AlchemistAllocator](https://etherscan.io/address/0x693b7594Ae0633d9c5574D0da46a040f92F5b281)). Deposited USDC is routed through Alchemix-written strategy adapters into third-party yield sources.

MYT is also the **collateral and settlement asset of Alchemix V3**. Borrowers deposit MYT into the [AlchemistV3](https://etherscan.io/address/0xeB83112d925268BeDe86654C13D423a987587e3E) and mint **alUSD** up to 90% LTV. The [Transmuter](https://etherscan.io/address/0x2584E8b0616b3E750492c9629a3b27679C410cb9) accepts alUSD, vests it linearly over a fixed term, earmarks borrower debt, and pays matured positions **1:1 in MYT** taken from borrower collateral ([Transmuter docs](https://docs.alchemix.fi/user/concepts/transmuter)).

**Why Yearn is assessing it ([issue #596](https://github.com/yearn/risk-score/issues/596)).** A proposed Yearn V3 strategy would (1) buy alUSD below par with USDC through an auction, (2) deposit the alUSD into the Transmuter, which converts it into MYT over the transmutation term, and (3) redeem the MYT for USDC. The strategy's principal therefore passes through **alUSD → Transmuter → MYT → MYT's underlying strategies**, and this report covers all three layers. The strategy itself is not yet deployed or approved; whether it would sit in yvUSD or another Yearn vault is `TODO` (see [Circular exposure](#circular-exposure-with-yvusd)).

**Key metrics (block 26,428,200):**

- **TVL:** 8,140,050.99 USDC (`totalAssets()`), equal to the sum of the four adapters' `realAssets()`; idle USDC in the vault is 0
- **Supply:** 7,909,838.27 mixUSDC (18 decimals; `virtualShares` = 1e12)
- **Share price:** 1.029087 USDC per mixUSDC (`convertToAssets(1e18)`), up from 0.999972 on April 17, 2026, about **5.0% annualized** net of fees
- **Fees:** 15% performance fee (`performanceFee()` = 0.15e18) paid to the DAO multisig; 0% management fee
- **Max rate:** `maxRate()` = 3,170,979,198 per second, i.e. **10% APR**. This caps how fast the share price can rise. It does not slow losses, which pass through immediately
- **Holders:** the Alchemist holds **6,298,200.62 mixUSDC (79.62%)** as borrower collateral and the Transmuter holds **1,407,755.11 mixUSDC (17.80%)** for pending claims. The remaining ~2.6% is spread across 47 other holders (reconstructed from all 3,941 `Transfer` events and cross-checked with `balanceOf`)

**Strategy allocation (block 26,428,200):**

| Adapter | Name / Venue | `realAssets()` (USDC) | Share of MYT | Risk class | Vault caps (abs / rel) |
|---------|--------------|----------------------:|-------------:|-----------|------------------------|
| [`0x688Af26Bb164FDA2C9c87FCb9066e38eF28Fc3eF`](https://etherscan.io/address/0x688Af26Bb164FDA2C9c87FCb9066e38eF28Fc3eF) | SiUSD Mainnet USDC: InfiniFi [siUSD](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) | 3,288,376.21 | **40.40%** | Moderate (1) | 5,000,000 / 40% |
| [`0xdFDC17F784e16D7634AC270911D98755C68Ae220`](https://etherscan.io/address/0xdFDC17F784e16D7634AC270911D98755C68Ae220) | Yearn Mainnet USDC: Yearn [yvUSD](https://etherscan.io/address/0x696d02Db93291651ED510704c9b286841d506987) (**liquidity adapter**) | 3,250,638.71 | **39.93%** | Conservative (0) | 100,000,000 / 100% |
| [`0x320e38ca23FB11cC1f673b204E301210d3758653`](https://etherscan.io/address/0x320e38ca23FB11cC1f673b204E301210d3758653) | Fluid Lite Mainnet USDC: Instadapp [Fluid Lite USD Vault (fLiteUSD)](https://etherscan.io/address/0x273DA948ACa9261043fbdb2a857BC255ECC29012) | 1,601,035.56 | **19.67%** | Moderate (1) | 5,000,000 / 30% |
| [`0xBE60E0BC077e5221A05D95bA8EF2BF233C799773`](https://etherscan.io/address/0xBE60E0BC077e5221A05D95bA8EF2BF233C799773) | TokeAutoUSD Mainnet: Auto Finance (Tokemak) | 0.51 | ~0% | Moderate (1) | 5,000,000 / 30% |
| | **Total** | **8,140,050.99** | **100%** | | |

The issue describes MYT as investing "mainly in yvUSD", but at the snapshot **InfiniFi siUSD is the largest position (40.40%)**, yvUSD is slightly smaller (39.93%), and Fluid Lite holds the remaining 19.67%. Allocations are discretionary and change when the DAO multisig rebalances; the live composition is shown on the [Alchemix Mixed Yield page](https://alchemix.fi/mixed-yield).

**Links:**

- [Alchemix V3 Documentation](https://docs.alchemix.fi/user)
- [MYT and Yield](https://docs.alchemix.fi/user/concepts/myt-and-yield)
- [Transmuter](https://docs.alchemix.fi/user/concepts/transmuter)
- [Security & Audits](https://docs.alchemix.fi/user/safety/security)
- [Contract Roles](https://docs.alchemix.fi/governance/guides/contract-roles)
- [Security Model](https://docs.alchemix.fi/dev/architecture/security-model)
- [Ethereum contract addresses](https://docs.alchemix.fi/dev/contracts/ethereum)
- [GitHub: alchemix-finance/v3](https://github.com/alchemix-finance/v3)
- [Morpho Vault V2 concepts](https://docs.morpho.org/learn/concepts/vault-v2/)
- [Immunefi bug bounty](https://immunefi.com/bug-bounty/alchemix-1/information/)
- [DeFiLlama: Alchemix V3](https://defillama.com/protocol/alchemix-v3)

## Contract Addresses

### MYT and MYT management (Ethereum)

| Contract | Address | Notes |
|----------|---------|-------|
| mixUSDC (MYT) | [`0x9B44efCa3e2a707B63Dc00CE79d646E5E5D24bA5`](https://etherscan.io/address/0x9B44efCa3e2a707B63Dc00CE79d646E5E5D24bA5) | Morpho `VaultV2`, verified, not a proxy (EIP-1967 slots empty). Deployed April 14, 2026 ([tx](https://etherscan.io/tx/0x4bbf6fb109502907c534aaefe8e1d3ca5efa44303e52acefdae59643c1c1e863)) |
| AlchemistCurator | [`0x7d61E3cDe8B58C4be192a7A35E9d626c419302A4`](https://etherscan.io/address/0x7d61E3cDe8B58C4be192a7A35E9d626c419302A4) | MYT `curator()`. `PermissionedProxy` admin and only operator: v3 admin Safe. Shared with the ETH MYT |
| AlchemistAllocator | [`0x693b7594Ae0633d9c5574D0da46a040f92F5b281`](https://etherscan.io/address/0x693b7594Ae0633d9c5574D0da46a040f92F5b281) | Only MYT allocator. Admin and only operator: v3 admin Safe |
| AlchemistStrategyClassifier | [`0xdb7d25b0bfd1585a797f6BF7d7CCBa26E77253cc`](https://etherscan.io/address/0xdb7d25b0bfd1585a797f6BF7d7CCBa26E77253cc) | Risk-class caps checked by the allocator. Admin: v3 admin Safe |

### Alchemix V3 USDC market (Ethereum)

| Contract | Address | Notes |
|----------|---------|-------|
| AlchemistV3 (proxy) | [`0xeB83112d925268BeDe86654C13D423a987587e3E`](https://etherscan.io/address/0xeB83112d925268BeDe86654C13D423a987587e3E) | `TransparentUpgradeableProxy`; implementation [`0xd5f26c90ead033554bf36227d0bbe993f6f76570`](https://etherscan.io/address/0xd5f26c90ead033554bf36227d0bbe993f6f76570#code) (verified, `AlchemistV3` v3.0.0) |
| Alchemist ProxyAdmin | [`0xdf0dd1203a3a607d34ac01824abbd4f91367272b`](https://etherscan.io/address/0xdf0dd1203a3a607d34ac01824abbd4f91367272b) | `owner()` = v3 admin Safe; no timelock |
| Transmuter | [`0x2584E8b0616b3E750492c9629a3b27679C410cb9`](https://etherscan.io/address/0x2584E8b0616b3E750492c9629a3b27679C410cb9) | Not upgradeable, v3.0.0. Positions are ERC-721 (`TRNSMTR`) |
| AlchemistV3Position (NFT) | [`0x872a03FabC86b59c883CD9c439E969321b719bEB`](https://etherscan.io/address/0x872a03FabC86b59c883CD9c439E969321b719bEB) | Borrower position NFTs (1,250 minted, 946 carrying debt) |
| AlchemistTokenVault (fee vault) | [`0x5B1c7180C630d3B2b6782Df70f43aE5Ea80425ba`](https://etherscan.io/address/0x5B1c7180C630d3B2b6782Df70f43aE5Ea80425ba) | Pays liquidator fees when a position cannot |
| AlchemistRouter | [`0x6733Aa6b2A622e43e8fF61945E8Fbe5f1b6b00FD`](https://etherscan.io/address/0x6733Aa6b2A622e43e8fF61945E8Fbe5f1b6b00FD) | Periphery |
| alUSD | [`0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9`](https://etherscan.io/address/0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9) | Original 2021 `AlToken` (Solidity 0.6.12), shared with Alchemix V2. Supply 10,820,980.29 alUSD |
| alUSD xERC20 | [`0xe9D672f89493c7286A9BAfC6b763364EC0BFe4Fe`](https://etherscan.io/address/0xe9D672f89493c7286A9BAfC6b763364EC0BFe4Fe) | Cross-chain representation; not part of the Ethereum Transmuter path |

### Governance

| Contract | Address | Configuration |
|----------|---------|---------------|
| v3 admin Safe | [`0xF56D660138815fC5d7a06cd0E1630225E788293D`](https://etherscan.io/address/0xF56D660138815fC5d7a06cd0E1630225E788293D) | **3-of-7** Safe v1.3.0, no modules, no guard. MYT `owner()`, curator admin and operator, allocator admin and operator, owner of every MYT adapter, classifier admin, Alchemist `admin()`, ProxyAdmin owner, and Transmuter `admin()` |
| DAO multisig | [`0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9`](https://etherscan.io/address/0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9) | **3-of-7** Safe v1.3.0, no modules, no guard. MYT sentinel, Alchemist guardian, fee receiver for MYT, Alchemist, and Transmuter, and alUSD `ADMIN`. **6 of its 7 owners are also owners of the v3 admin Safe** |
| Legacy dev multisig | [`0x8392F6669292fA56123F71949B52d883aE57e225`](https://etherscan.io/address/0x8392F6669292fA56123F71949B52d883aE57e225) | `MultiSigWalletWithTimeLock`, **4-of-7**, `secondsTimeLocked` = 600 s. alUSD `ADMIN` |
| Guardian EOAs (7) | [`0xf1C5fBf9612b572bc4e2F8c046088aa68f6b4304`](https://etherscan.io/address/0xf1C5fBf9612b572bc4e2F8c046088aa68f6b4304), [`0xFfaA3CdA4f169d33291Dd9ddbea8578d1398430E`](https://etherscan.io/address/0xFfaA3CdA4f169d33291Dd9ddbea8578d1398430E), [`0xf872703F1C8f93fA186869Bac83BAC5A0c87C3c8`](https://etherscan.io/address/0xf872703F1C8f93fA186869Bac83BAC5A0c87C3c8), [`0xf0daAa720286868c8C7B235f450429c197CD579B`](https://etherscan.io/address/0xf0daAa720286868c8C7B235f450429c197CD579B), [`0xD5D6433B4D3e7507623a1A549aCeDF55e07cAd14`](https://etherscan.io/address/0xD5D6433B4D3e7507623a1A549aCeDF55e07cAd14), [`0x5788F90196954A272347aEe78c3b3F86F548D0a9`](https://etherscan.io/address/0x5788F90196954A272347aEe78c3b3F86F548D0a9), [`0x954b066e4bDD3A2d8F15dd6CF8110A002d0853e6`](https://etherscan.io/address/0x954b066e4bDD3A2d8F15dd6CF8110A002d0853e6) | Alchemist guardians (pause deposits and new loans only). All eight `GuardianSet` events since deployment were emitted in block 24,891,005; neither pause has ever been used |

Signer identities for both Safes are not published in the [Alchemix docs](https://docs.alchemix.fi/governance/guides/contract-roles). Four owners of each Safe are among the seven publicly listed contributor Guardian wallets.

## Audits and Due Diligence Disclosures

From the [Alchemix Security & Audits page](https://docs.alchemix.fi/user/safety/security):

| Scope | Auditor | Date |
|-------|---------|------|
| V3 core (fees, liquidations, debt-redemption accounting) | [Spearbit / Cantina](https://cantina.xyz/portfolio/f638950d-a8ad-4df8-a6ec-8b067e416d7b) | May 2025 |
| Alchemist, Transmuter, MYT (competition) | [Immunefi audit competition](https://immunefi.com/audit-competition/alchemix-v3-audit-competition/information/) | Oct–Nov 2025 |
| Earmarking and transmutation accounting | [alpeh_v (independent researcher)](https://hackmd.io/@geistermeister/SkSZiU9ybe) | Oct–Nov 2025 |
| V3 | yAudit (yAuditDAO), [listed here](https://docs.alchemix.fi/user/safety/security) | March 2026 |
| MYT access control and strategy adapters (Aave, Euler, Fluid, Auto Finance, Yearn yvWETH) | Nethermind, [listed here](https://docs.alchemix.fi/user/safety/security) | Feb 2026 (final Aug 2026) |
| Strategies incl. **InfiniFi siUSD** and **Yearn yvUSD** adapters | yAudit strategies report + follow-up, [listed here](https://docs.alchemix.fi/user/safety/security) | April 15–24, 2026 |
| ERC-4626 adapter used for **Fluid** and Stake DAO WETH strategy | Nethermind, [listed here](https://docs.alchemix.fi/user/safety/security) | July–Aug 2026 |

The MYT vault itself is Morpho's `VaultV2` (Morpho Association, GPL-2.0). It is used unmodified, so Morpho's own V2 audits apply to the vault core; this report does not re-list them. Every verified adapter imports the shared `MYTStrategy` base. Two base versions are deployed: the yvUSD adapter uses an older one without the `_canForceDeallocate()` hook (see [Liquidity](#liquidity-risk)).

**Complexity.** High. The MYT core is simple and well understood, but the full Alchemix V3 system combines a Morpho V2 vault with Alchemix curator and allocator proxies, an upgradeable CDP (Alchemist) using novel Q128 earmark and redemption-weight accounting, a Fenwick-tree vesting Transmuter, fee vaults, and per-protocol adapters. Some adapters also take 0x swap calldata or Chainlink-format oracles.

**Post-audit critical.** Immunefi's [Alchemix case study](https://immunefi.com/case-studies/alchemix/) reports that in **June 2026** a researcher found "a critical in one of V3's vault strategies, a bug that put user funds at risk of theft", and was paid "nearly $300,000" in July. The affected strategy and whether any funds were lost are not disclosed: `TODO`, source is an Alchemix post-mortem. The Alchemist implementation was upgraded on [May 1](https://etherscan.io/tx/0xcf6b368c77290f99a1d8211885c52c231c8f351bb651f74e3d2efc8374d4d7f0) and [July 25, 2026](https://etherscan.io/tx/0xb52be39bebc466d4533defac587fc71d20853e74c9854e5d6449ac7953f26d5e). The deployed adapters run two `MYTStrategy` base versions. Neither change has been tied publicly to the reported bug.

### Bug Bounty

- **Immunefi:** [Alchemix V3 program](https://immunefi.com/bug-bounty/alchemix-1/information/), critical smart-contract payouts of 10% of funds directly affected, **minimum $20,000, maximum $150,000** (page last updated November 3, 2026). The program covers the core Alchemist, Transmuter, and MYT contracts. It previously listed a $300,000 maximum.
- **Safe Harbor:** Alchemix is not listed in the Immunefi materials as a SEAL Safe Harbor adopter. Registry check at [safeharbor.securityalliance.org](https://safeharbor.securityalliance.org/): `TODO`.

## Historical Track Record

- **Alchemix:** live since February 2021 (V1 → V2 → V3). Past incidents include the **June 2021 alETH vault bug**: a deployment-script error created unintended vaults, alETH minting was paused, and [REKT](https://alpha.rekt.news/alchemix-rekt) puts the shortfall at ~2,700 ETH (~$6.5M), later repaid by the protocol. The second was the **July 30, 2023 Curve/Vyper re-entrancy exploit** that drained the alETH/ETH Curve pool. The exploiter [returned the funds](https://cointelegraph.com/news/alchemix-reports-return-of-all-stolen-funds-from-curve-pools), but LPs bore a permanent loss of 3,856 alETH ([Alchemix announcement](https://alchemixfi.substack.com/p/the-aleth-curveball)).
- **V3 / this MYT:** MYT, Transmuter, and Alchemist proxy were deployed on **April 14, 2026** (blocks 24,875,892–24,875,910), about **7 months** before the snapshot. One post-launch critical was reported via Immunefi in June 2026 (above).
- **TVL:** MYT total assets sampled every ~100,000 blocks rose from 4.52M USDC (April 17) to 7.96M (May 15). They have stayed between **7.43M and 8.34M USDC** since and are **8.14M** at the snapshot. Alchemix V3 across all chains and markets shows **$32.99M** on [DeFiLlama](https://defillama.com/protocol/alchemix-v3) (peak $43.12M on October 7, 2026).
- **Share price:** MYT `convertToAssets(1e18)` increased at every biweekly sample, from 0.999972 (April 17) to 1.029087 (snapshot). No realized loss is visible at that resolution.
- **Concentration:** MYT is essentially an internal Alchemix asset (97.4% held by the Alchemist and Transmuter). On the borrower side, the top five of 946 indebted positions hold **29.6% of debt**. The four largest (IDs 1205, 1146, 1246, 1213; 24.6% of debt) sit at **CR ≈ 1.114**, right at the 1.111 minimum.
- **alUSD peg:** alUSD trades **below par**. A 1,000 alUSD sale on the [alUSD/USDC Curve NG pool](https://etherscan.io/address/0x1EDD809bc939dC80630cd9f7aEa2247a83440fE5) returns 966.89 USDC (≈3.3% discount). This discount is the yield source the proposed Yearn strategy targets.

## Funds Management

MYT delegates all funds to third-party protocols through adapters. The vault holds no idle USDC (`balanceOf(MYT)` = 0); deposits go straight to the **liquidity adapter** (yvUSD), and withdrawals pull from it.

### Underlying positions

| Venue | MYT exposure | Repository report | Key risk notes |
|-------|-------------:|-------------------|----------------|
| **InfiniFi siUSD** | 3.29M USDC (40.40%); 2,986,812 siUSD ≈ 5.2% of siUSD | [InfiniFi](./infinifi.md), **3.19/5** | ~84% of InfiniFi TVL was in offchain-custodied/NAV-attested RWA positions at its last assessment. InfiniFi's instant-redemption LIQUID bucket is **11.93M USDC (16.1% of 73.93M total)** at the snapshot (`Accounting.totalAssetsValueOf(1)` on [`0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3`](https://etherscan.io/address/0x7A5C5dbA4fbD0e1e1A2eCDBe752fAe55f6E842B3)). Adapter valuation uses InfiniFi's `RedeemController.receiptToAsset` |
| **Yearn yvUSD** | 3.25M USDC (39.93%); 3,125,738 yvUSD = **24.3% of yvUSD supply** | [Yearn yvUSD](./yearn-yvusd.md), **2.46/5** | Cross-chain (Katana/AggLayer), levered Cap looper, and Pendle PT legs; yvUSD TVL 13.36M USDC at the snapshot. `maxWithdraw(adapter)` = 3,250,638.71 USDC (full position withdrawable at the snapshot) |
| **Instadapp Fluid Lite USD** | 1.60M USDC (19.67%); 4.3% of the 37.30M fLiteUSD vault | None (inline below) | Leveraged looping vault; **exchange price cannot decrease**; withdrawals limited to idle fUSDC |
| Auto Finance (Tokemak) autoUSD | 0.51 USDC | None | Dust; adapter remains registered with a 5M / 30% cap |

**Instadapp Fluid Lite USD Vault (fLiteUSD, inline assessment).** The vault is a UUPS proxy ([`0x273DA948ACa9261043fbdb2a857BC255ECC29012`](https://etherscan.io/address/0x273DA948ACa9261043fbdb2a857BC255ECC29012), implementation [`0xe16ccc91a8134d428e7b6240177f9e2b227b9743`](https://etherscan.io/address/0xe16ccc91a8134d428e7b6240177f9e2b227b9743#code)). Per [Instadapp's docs](https://lite.guides.instadapp.io/getting-started/fluid-lite-usd-vault), it converts deposits into sUSDe, syrupUSDC, syrupUSDT, and sUSDai and loops them on lending markets on Ethereum, Arbitrum, and Plasma. Capital crosses chains via Chainlink CCIP and LayerZero OFT. Verified source and onchain reads show:

- `updateExchangePrice` **reverts if the new price is lower** (`LiteVault__ExchangePriceDecrease`) and caps each increase at 2% (`MAX_EXCHANGE_PRICE_INCREASE_BPS` = 200). The price accrues at `max(fixedRate, reward rate)`; `getFixedRate()` = 600 (6%), and `getRewardAmountPerYear()` = 3,000,000 USDC. A loss in the leveraged strategy therefore **cannot be reflected in fLiteUSD's share price**. It would surface as reserve depletion or withdrawal unavailability. MYT's adapter values its fLiteUSD with `previewRedeem`, so MYT's share price inherits this masking for 19.67% of its assets.
- Withdrawals are paid only from idle fUSDC (`LiteVault__InsufficientIdleFunds`). `getIdleBalance()` = 7,930,625.57 USDC (**21.3% of 37.30M**), comfortably above MYT's 1.60M; the withdrawal fee is 5 bps.
- `getOwner()` = [`FluidTimelockController` `0x4d6CE4F4498d59Eed397bCbC687805a07f9b2346`](https://etherscan.io/address/0x4d6CE4F4498d59Eed397bCbC687805a07f9b2346) with `getMinDelay()` = 86,400 s (24 h). The owner controls upgrades, roles, and owners. The secondary owner and only `AUTH_LEVEL` role holder is an Avocado multisig ([`0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e)), which can **pause withdrawals** without delay. The strategy handler ([`0x066e84CA92529B500592867D0Be89E78563fA965`](https://etherscan.io/address/0x066e84CA92529B500592867D0Be89E78563fA965)) can `pullFunds` to the strategies and update the exchange price within the bounds above.
- Open items, all `TODO`: per-chain position sizes and leverage behind the strategy handler, which need Instadapp reporting or strategy-handler reads; Fluid Lite audits, which the Lite docs do not list; and the Avocado multisig's threshold.

### Circular exposure with yvUSD

MYT is a **24.3% holder of yvUSD**, and yvUSD is MYT's liquidity adapter. If the proposed Yearn strategy is attached to yvUSD, which is `TODO` and not stated in the issue, the loop becomes yvUSD → strategy → Transmuter → MYT → yvUSD. A loss in any yvUSD strategy would then reduce MYT's share price, and with it the value of the strategy's Transmuter claims, compounding the loss inside yvUSD. MYT's withdrawals also draw on yvUSD liquidity first. Exposure should be sized with this loop in mind.

### Accessibility

- **MYT deposit/redeem:** permissionless. No gates are set (`receiveSharesGate`, `sendSharesGate`, `receiveAssetsGate`, `sendAssetsGate` all `address(0)`) and there is no deposit cap. Deposits and redemptions are atomic and convert at `totalAssets / totalSupply` with no fee. Each deposit is forwarded to the yvUSD adapter; each redemption pulls the shortfall from it. Redemptions above the yvUSD position need allocator action or `forceDeallocate` (2% penalty), see [Liquidity Risk](#liquidity-risk).
- **Transmuter (the proposed Yearn path):** permissionless `createRedemption(amount, recipient)`. It is capped by `depositCap` = 2,500,000 alUSD against `totalActiveLocked` = 2,487,541.88 alUSD, leaving **only 12,458 alUSD of capacity**, and by `totalLocked ≤ alchemist.totalSyntheticsIssued()` (2,488,148 ≤ 4,851,629). Each position vests linearly over `timeToTransmute` = **870,000 blocks (≈121 days at 12 s)**. `claimRedemption` can be called at any time: the vested share is paid in MYT (`transmutationFee` = 0), and the unvested share is returned in alUSD less `exitFee` = **1%**. Capacity frees as positions are claimed, or via `pokeMatured` once fully vested.

### Token Mint Authority

**Mint mechanism (mixUSDC):** standard ERC-4626 `deposit`/`mint`. Shares are created only against an atomic USDC transfer. The only other share creation is fee accrual (`createShares` to `performanceFeeRecipient` / `managementFeeRecipient` in `accrueInterest`), bounded by `MAX_PERFORMANCE_FEE` = 50% of distributed interest and `MAX_MANAGEMENT_FEE` = 5%/yr.

**Mint requires backing:** Yes. USDC must transfer in the same transaction.

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any depositor | ✓ | ✓ | `deposit` / `mint` / `withdraw` / `redeem` | Atomic USDC in/out |
| [`0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9`](https://etherscan.io/address/0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9) (DAO multisig) | ✓ (fees) | — | `performanceFeeRecipient` | 15% of interest, settable by the curator (v3 admin Safe) up to 50% instantly |

**Rate limits / supply caps:** None on deposits. `maxRate` (10% APR) caps share-price growth, not supply.

**Backing check at mint time:** Atomic.

**alUSD (the asset the Yearn strategy holds before conversion)** is a legacy `AlToken` with a whitelist mint model: `mint` requires `whiteList[msg.sender]`, `hasMinted + amount ≤ ceiling[msg.sender]`, and neither `blacklist` nor `paused` set. `setWhitelist` and `setCeiling` emit no events, so the full set of currently whitelisted minters (V2 Alchemists, bridges) cannot be enumerated from logs: **`TODO`**, requires a trace of `setWhitelist` calls from 2021. The V3 Alchemist is whitelisted with `ceiling` = 8,674,447.06 and `hasMinted` = 7,899,340.66 alUSD (headroom 775,106 alUSD, not paused). The V3 Alchemist mints only against MYT collateral at ≤ 90% LTV.

| Role on alUSD | Holders (enumerated via `getRoleMemberCount`/`getRoleMember`) | Power |
|---------------|------------------------------------------------------------|-------|
| `ADMIN` (admin of itself and `SENTINEL`) | DAO multisig [`0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9`](https://etherscan.io/address/0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9) (3-of-7); legacy [`MultiSigWalletWithTimeLock` `0x8392F6669292fA56123F71949B52d883aE57e225`](https://etherscan.io/address/0x8392F6669292fA56123F71949B52d883aE57e225) (4-of-7, 600 s) | `setWhitelist`, `setCeiling`: can authorize **unbacked alUSD minting** |
| `SENTINEL` | EOA [`0xf4B5b84b8f39bC556ed230FA91A0A89Bb5E8559b`](https://etherscan.io/address/0xf4B5b84b8f39bC556ed230FA91A0A89Bb5E8559b); `V1Deprecatooooor` [`0xdB39286FaDb3f6039C8B5d79BaFA21615c23b4EC`](https://etherscan.io/address/0xdB39286FaDb3f6039C8B5d79BaFA21615c23b4EC) | `setBlacklist`, `pauseAlchemist`: can block minters (incl. the V3 Alchemist) |

Unbacked alUSD would not change V3 `totalSyntheticsIssued`, so it cannot dilute the Transmuter's bad-debt ratio. It could, however, depress alUSD's market price and consume the Transmuter's scarce deposit capacity, which is redeemed against V3 borrowers' MYT collateral.

### Collateralization

- **MYT backing:** 100% onchain adapter positions: siUSD 40.40%, yvUSD 39.93%, fLiteUSD 19.67%. Their quality is mixed. yvUSD is a diversified Yearn vault with cross-chain and levered legs. InfiniFi's backing is mostly offchain RWA. Fluid Lite is a leveraged, multi-chain loop whose share price cannot fall.
- **Risk curation:** discretionary, by the v3 admin Safe through the curator (adapter set, absolute/relative caps), the allocator (allocations), and the [classifier](https://etherscan.io/address/0xdb7d25b0bfd1585a797f6BF7d7CCBa26E77253cc). Onchain classifier caps are Conservative 100%, Moderate **60%** aggregate and 60% individual, Aggressive 10%. The docs list Moderate individual at 40% and Aggressive at 20%, so the onchain values do not match. Moderate strategies total **60.07%** of MYT at the snapshot, at the aggregate limit. siUSD (40.40%) is above its 40% vault relative cap, which is only checked at allocation time. Caps are checked only when allocating, so withdrawals can leave allocations above their caps, and the admin Safe can raise any cap without delay.
- **Alchemix V3 system collateralization:** Alchemist collateral is 6,298,200.62 MYT = **6,481,396.47 USDC** (`getTotalUnderlyingValue()`) against `totalDebt` = **3,406,038.86 alUSD**, a system CR of **1.90**. `minimumCollateralization` = 1.111 (90% LTV); `collateralizationLowerBound` = `globalMinimumCollateralization` = 1.0526 (95% LTV liquidation); liquidator fee 1.5% (`liquidatorFee` = 150 bps). Liquidations are permissionless and paid in MYT, with no external oracle: collateral is valued at `MYT.convertToAssets`, and debt at 1 alUSD = 1 USDC.
- **Transmuter backing:** `totalSyntheticsIssued` = 4,851,628.69 alUSD, i.e. outstanding debt plus redeemed-but-unclaimed alUSD. Backing is `getTotalLockedUnderlyingValue()` = 3,784,487.62 USDC plus the Transmuter's 1,407,755.11 MYT (≈1,448,702 USDC). The resulting `badDebtRatio` ≈ **0.927**, below 1, so claims pay in full. Because collateral and settlement are both MYT, a fall in MYT's share price first pushes the 90%-LTV positions into liquidation. A loss of roughly 10% or more would create bad debt and **pro-rata Transmuter haircuts** (`scaledTransmuted = amountTransmuted × 1e18 / badDebtRatio`).

### Provability

- MYT `totalAssets` is computed onchain as `min(idle + Σ adapter.realAssets(), _totalAssets × (1 + maxRate × elapsed))`. At the snapshot the two coincide (8,140,050.99 USDC), so no undistributed gain is buffered.
- Adapter valuations are onchain but inherit each venue's accounting. yvUSD uses `previewRedeem` (Yearn V3 PPS). siUSD uses InfiniFi `RedeemController.receiptToAsset(iUSD)`; iUSD is NAV-priced and its RWA farms are attested offchain. fLiteUSD uses `previewRedeem` on an exchange price set by Instadapp's strategy handler that cannot decrease.
- The siUSD adapter's swap path is priced by a "Chainlink-formatted InfiniFi RT Oracle" ([`0xF81Aa28A4F68124683AfadA81e8EBBf6e2867067`](https://etherscan.io/address/0xF81Aa28A4F68124683AfadA81e8EBBf6e2867067), answer 1.0e18, 24 h staleness limit). It bounds slippage only and is not used for MYT valuation.
- Alchemist and Transmuter state (debt, earmarks, collateral, positions) is fully onchain and reconciles: the sum of all 1,250 `getCDP` collateral values (6,298,227.59 MYT) matches the Alchemist's MYT balance (6,298,200.62) to within 27 MYT, and summed debt equals `totalDebt` (3,406,038.86 alUSD).

## Liquidity Risk

**MYT redemption.** There is no secondary market for mixUSDC; exit is redemption only.

1. **Instant via the liquidity adapter:** up to the yvUSD position, **3.25M USDC (39.9% of MYT)**, subject to yvUSD's own withdrawal queue (fully withdrawable at the snapshot).
2. **`forceDeallocate` (permissionless, 2% penalty):** `forceDeallocatePenalty` = 0.02e18 on every adapter. The **siUSD adapter** allows it (direct unstake + InfiniFi redeem, which depends on InfiniFi's 11.93M LIQUID bucket), as does the yvUSD adapter (older base, no opt-out). **Fluid Lite and TokeAuto have `canForceDeallocate()` = false**, so the 19.67% in Fluid Lite can only be withdrawn when the allocator (the v3 admin Safe) acts or the DAO sentinel calls `deallocate`. `ForceDeallocate` has been used 6 times since launch.
3. **Allocator deallocation:** unbounded, discretionary, no SLA.

**Transmuter path (proposed Yearn strategy):**

- **Entry:** alUSD is bought on Curve NG pools that are alUSD-heavy and shallow. The [alUSD/USDC pool](https://etherscan.io/address/0x1EDD809bc939dC80630cd9f7aEa2247a83440fE5) holds 308,190 alUSD vs 38,741 USDC: 1,000 USDC buys 1,030.76 alUSD (0.970), but 100,000 USDC buys only 100,794.70 alUSD (0.992), so the discount closes quickly with size. The largest venue is [alUSD/frxUSD](https://etherscan.io/address/0x17f9682c9cd1a448b31c0428f1d0783ed13a9fa3) (1,951,486 alUSD vs 246,575 frxUSD). Others are [alUSD/sDOLA](https://etherscan.io/address/0x460638e6f7605b866736e38045c0de8294d7d87f) (738,536 alUSD), [alUSD/3CRV](https://etherscan.io/address/0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c) (170,741), [alUSD/fxUSD](https://etherscan.io/address/0x27cb9629ae3ee05cb266b99ca4124ec999303c9d) (147,000), [alUSD/avUSD](https://etherscan.io/address/0x3157266c693324bc0177fa5d2a18ddc019bc6ee0) (64,473), and [alUSD/FRAXBP](https://etherscan.io/address/0xB30dA2376F63De30b42dC055C93fa474F31330A5) (18,392). An unlabelled Safe ([`0x1825377ece03098f35951e9600cf3a3cf718bebf`](https://etherscan.io/address/0x1825377ece03098f35951e9600cf3a3cf718bebf)) holds 2,340,745 alUSD (21.6% of supply): owner `TODO`. Holders were reconstructed from all 19,166 alUSD `Transfer` events since block 24,800,000 and confirmed with `balanceOf`; balances that have not moved since earlier are not covered.
- **Capacity:** only **12,458 alUSD** of Transmuter capacity remains. The cap recycles at roughly 2.5M alUSD per 121-day term (≈20.7k/day) as positions mature and are claimed or poked, and the admin can raise it instantly. Strategy size is therefore capacity-bound, not liquidity-bound.
- **Return math:** at a ≈3.0–3.3% discount and a ≈121-day term, the gross yield is ≈9–10% APR at small size. It falls toward zero as purchases close the discount and is paid in MYT.
- **Exit before maturity:** claim early and receive the vested share as MYT plus the unvested alUSD minus 1%, then sell the alUSD into the thin pools. Selling 100,000 alUSD into alUSD/USDC returns only 38,019 USDC (the pool runs out of USDC); the alUSD/frxUSD pool returns 94,907 frxUSD.
- **Exit at maturity:** MYT redemption as above. If bad debt exists, the claim is scaled down or can be deferred.

## Centralization & Control Risks

### Governance

- **Upgradeability:** MYT (`VaultV2`), Transmuter, AlchemistCurator, AlchemistAllocator, classifier, and all adapters are **not upgradeable**. The **AlchemistV3 is upgradeable** through a ProxyAdmin owned by the v3 admin Safe with **no timelock**. It has been upgraded twice: [May 1, 2026](https://etherscan.io/tx/0xcf6b368c77290f99a1d8211885c52c231c8f351bb651f74e3d2efc8374d4d7f0) and [July 25, 2026](https://etherscan.io/tx/0xb52be39bebc466d4533defac587fc71d20853e74c9854e5d6449ac7953f26d5e).
- **Timelocks:** **none.** Every MYT curator selector has `timelock(selector)` = 0 and `abdicated(selector)` = false. This was checked for `setIsAllocator`, `addAdapter`/`removeAdapter`, `setAdapterRegistry`, all four gates, `increase`/`decreaseTimelock`, `abdicate`, fee and fee-recipient setters, cap increases, and `setForceDeallocatePenalty`. `adapterRegistry` = `address(0)`, so any contract can be added as an adapter. The Alchemist and Transmuter admin functions act immediately. The docs state this explicitly: "all timelock durations are currently set to zero" ([Security & Audits](https://docs.alchemix.fi/user/safety/security)).
- **Process:** "Snapshot vote, multisig execution" per the docs. The Snapshot vote is not enforced onchain.
- **Key holder:** a single **3-of-7** Safe (v3 admin Safe) holds every material power in the system. The two-step `submit`/execute flow only requires the parameters to match. It can be completed in a single Safe batch because execution of a submitted action is permissionless once `executableAt` ≤ now. The [June 19, 2026 Safe tx](https://etherscan.io/tx/0xa751d4859462073949fb608898466cd72373c1ea8a525e0b8583b6c1bf743fd9) whitelisted `submit(bytes)` (selector `0xef7fa71b`) as a curator `permissionedCall`, which lets curator operators forward **any** vault `submit`. The deployer EOA [`0xf456A36B04B0951Cd19d6D8aA0c0b3b0a07f9fF2`](https://etherscan.io/address/0xf456A36B04B0951Cd19d6D8aA0c0b3b0a07f9fF2) was the initial curator and allocator operator. It was removed on September 14, 2026 ([tx](https://etherscan.io/tx/0xc9c64360201ac1ad4f578c1400f3c65138ee533854336fb3ef40ee5b398eb988)); `operators(0xf456…9fF2)` = false on both contracts at the snapshot. It remains the recorded `params.owner` field of the yvUSD adapter, but `Ownable.owner()` of every adapter is the v3 admin Safe.
- **Sentinel / revoke:** the DAO multisig is the only MYT sentinel (`isSentinel`; one `SetIsSentinel` event). It can `revoke` pending submissions, decrease caps, and `deallocate`. With zero timelocks there is no window in which to revoke, and 6 of its 7 owners also sign for the v3 admin Safe, so it is not an independent check.

### Critical Permission Paths and Weakest Link

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Add an arbitrary adapter (`addAdapter`) + raise its caps + allocate all MYT USDC into it | v3 admin Safe as curator operator (`setStrategy`, `proxy(submit)`) and curator admin (`submitIncrease*Cap`/`increase*Cap`), then allocator admin (`allocate`). It can also `submitSetAllocator(self)` and call `MYT.allocate` directly, bypassing classifier caps | 3-of-7; timelock 0; no adapter registry; sentinel revoke ineffective at 0 delay | **All MYT assets: 8.14M USDC** (incl. 6.48M of borrower collateral and the Transmuter's 1.45M of claims) |
| Upgrade AlchemistV3 implementation | ProxyAdmin [`0xdf0dd1203a3a607d34ac01824abbd4f91367272b`](https://etherscan.io/address/0xdf0dd1203a3a607d34ac01824abbd4f91367272b) `owner()` = v3 admin Safe | 3-of-7; no timelock | 6,298,200.62 MYT (≈6.48M USDC) borrower collateral; Transmuter redemptions rely on Alchemist `redeem` |
| Redirect Transmuter claims: `setTransmutationFee` (≤ 100%), `setProtocolFeeReceiver`, `setExitFee` (≤ 100%), `setAlchemist` | Transmuter `admin()` = v3 admin Safe | 3-of-7; no timelock | 1,407,755.11 MYT (≈1.45M USDC) held by the Transmuter, plus every future claim, incl. a Yearn strategy's positions |
| Change adapter swap target / slippage / oracle (`setAllowanceHolder`, `setSlippageBPS` < 99.99%, `setPricedTokenOracle`), then deallocate via `deallocateWithUnwrapAndSwap` | Adapter `owner()` = v3 admin Safe; allocator operator/admin = same Safe | 3-of-7; no timelock; default slippage 50 bps vs an InfiniFi-supplied oracle | siUSD position 3.29M USDC (the ERC-4626 adapters revert on swap actions) |
| Alchemist parameters (fees ≤ 100%, collateralization bounds, fee vault, guardians) | Alchemist `admin()` = v3 admin Safe | 3-of-7; no timelock | Borrower collateral via liquidation parameters; protocol fee taken from redemptions |
| Raise MYT performance fee (≤ 50%) / change recipient | Curator admin = v3 admin Safe | 3-of-7; no timelock | Up to 50% of future yield (not principal) |
| Unbacked alUSD mint (`setWhitelist` + `setCeiling`) | alUSD `ADMIN`: DAO multisig (3-of-7) or legacy multisig (4-of-7, 10 min) | Threshold only | alUSD peg/exit liquidity; Transmuter capacity (not V3 collateral directly) |
| Pause Alchemist deposits / new loans | 7 guardian EOAs + DAO multisig + admin | Withdrawals, repayments, liquidations, and Transmuter claims unaffected | None (no material loss) |
| Deallocate, decrease caps, revoke | MYT sentinel = DAO multisig | — | None (funds return to MYT idle) |
| Underlying venues | Yearn (yvUSD: 7-day timelock path, see [report](./yearn-yvusd.md)); InfiniFi (1 h / 7 d timelocks, see [report](./infinifi.md)); Fluid Lite (24 h timelock owner; Avocado can pause withdrawals) | Per venue | Per allocation above |

**Weakest credible path to material loss:** the **v3 admin Safe [`0xF56D660138815fC5d7a06cd0E1630225E788293D`](https://etherscan.io/address/0xF56D660138815fC5d7a06cd0E1630225E788293D) (3-of-7, no modules, no guard)**. Three signers can, in one batched transaction and with no delay:

1. call `AlchemistCurator.submitSetStrategy` and `setStrategy` to add a malicious adapter (`timelock(addAdapter)` = 0, `adapterRegistry` = 0);
2. call `submitIncreaseAbsoluteCap`/`increaseAbsoluteCap` and the relative-cap equivalents;
3. call `AlchemistAllocator.allocate` as admin (classifier caps permitting), or `submitSetAllocator(Safe)` → `MYT.setIsAllocator` → `MYT.allocate`. Either way, every USDC that the existing adapters' `deallocate` can return is moved into the attacker adapter.

That exposes **all 8.14M USDC behind MYT**. It covers both the Alchemist's borrower collateral and the MYT backing the Transmuter's pending claims, which is the asset a Yearn strategy would receive. Comparably weak, and also instant, are an **Alchemist proxy upgrade** (6.48M USDC of collateral) and **`Transmuter.setTransmutationFee(10_000)` with a new fee receiver** (all current and future claims). The only mitigants are the 3-of-7 threshold and a sentinel `revoke` that has no time window at a zero timelock. This sits just above the critical gate (EOA or <3 signers) and is scored at the low end of Governance.

### Programmability

- MYT share price is fully onchain and programmatic (`accrueInterest`, `maxRate` cap). Deposits and withdrawals are atomic and auto-routed through the liquidity adapter.
- **Allocation is manual**: the v3 admin Safe operates the allocator, and there is no keeper. The [allocator runbook](https://github.com/alchemix-finance/v3/blob/main/ALCHEMIST_ALLOCATOR_RUNBOOK.md) describes the operator process.
- Swap-based actions (`allocateWithSwap`, `deallocateWithSwap`, `deallocateWithUnwrapAndSwap`) use caller-supplied 0x calldata executed through the 0x AllowanceHolder (`0x0000000000001fF3684f28c67538d4D072C22734`). Output is bounded by `slippageBPS` against the adapter's oracle; only the siUSD adapter's unwrap-and-swap deallocation path is live.
- Alchemist earmarking, redemptions, liquidations, and Transmuter vesting and claims are programmatic and permissionless.
- Offchain dependency: Fluid Lite's exchange price and reconciliation come from Instadapp's strategy handler, weekly per its docs.

### External Dependencies

| Dependency | Criticality |
|------------|-------------|
| **InfiniFi siUSD/iUSD** (40.40%) | High. Largest single exposure; offchain-RWA-heavy backing; redemption depends on InfiniFi's liquid bucket |
| **Yearn yvUSD** (39.93%) | High. Liquidity adapter and exit path; its own cross-chain and levered legs |
| **Instadapp Fluid Lite USD** (19.67%) | High. Leveraged, multi-chain via CCIP and LayerZero; share price cannot reflect losses; not force-deallocatable |
| **Morpho Vault V2** | Core vault code (immutable, audited) |
| **0x AllowanceHolder** | Swap paths only (siUSD adapter deallocation fallback) |
| **InfiniFi RT oracle** | Slippage bound on the siUSD swap path |
| **Curve alUSD pools** | Entry and early-exit liquidity for the Transmuter path |

Three newer or high-complexity yield sources with no fallback make up 100% of the assets. That is many dependencies, each critical.

## Operational Risk

- **Team:** Alchemix has operated since 2021 under pseudonymous but publicly known contributors. Seven contributor Guardian wallets are published. The Immunefi page references the **Alchemix Association** as the paying entity for KYC'd payouts; its jurisdiction is `TODO`.
- **Documentation:** very good. Detailed V3 docs cover role tables, per-chain addresses, security model, strategy classification, and allocator/strategy runbooks in the repo. Docs are candid about zero timelocks. Some onchain values diverge: classifier caps differ from the published 40%/20% individual/aggressive limits, and the audit table excludes the TokeAuto adapter that is still registered.
- **Incident response:** Hypernative monitoring wired to the Guardian circuit breaker, per the [docs](https://docs.alchemix.fi/user/safety/security). Handling of past incidents (2021 alETH, 2023 Curve) included repayment and refund plans.
- **Monitoring by Alchemix of MYT allocations:** the live composition is shown on the [Mixed Yield page](https://alchemix.fi/mixed-yield).

## Monitoring

### Key contracts

- MYT [`0x9B44efCa3e2a707B63Dc00CE79d646E5E5D24bA5`](https://etherscan.io/address/0x9B44efCa3e2a707B63Dc00CE79d646E5E5D24bA5)
- AlchemistCurator [`0x7d61E3cDe8B58C4be192a7A35E9d626c419302A4`](https://etherscan.io/address/0x7d61E3cDe8B58C4be192a7A35E9d626c419302A4), AlchemistAllocator [`0x693b7594Ae0633d9c5574D0da46a040f92F5b281`](https://etherscan.io/address/0x693b7594Ae0633d9c5574D0da46a040f92F5b281)
- AlchemistV3 [`0xeB83112d925268BeDe86654C13D423a987587e3E`](https://etherscan.io/address/0xeB83112d925268BeDe86654C13D423a987587e3E) + ProxyAdmin [`0xdf0dd1203a3a607d34ac01824abbd4f91367272b`](https://etherscan.io/address/0xdf0dd1203a3a607d34ac01824abbd4f91367272b)
- Transmuter [`0x2584E8b0616b3E750492c9629a3b27679C410cb9`](https://etherscan.io/address/0x2584E8b0616b3E750492c9629a3b27679C410cb9)
- v3 admin Safe [`0xF56D660138815fC5d7a06cd0E1630225E788293D`](https://etherscan.io/address/0xF56D660138815fC5d7a06cd0E1630225E788293D), DAO multisig [`0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9`](https://etherscan.io/address/0x9e2b6378ee8ad2A4A95Fe481d63CAba8FB0EBBF9)
- Adapters (four listed above), fLiteUSD [`0x273DA948ACa9261043fbdb2a857BC255ECC29012`](https://etherscan.io/address/0x273DA948ACa9261043fbdb2a857BC255ECC29012)

### Events and thresholds

| Priority | Watch | Source | Threshold / action |
|----------|-------|--------|--------------------|
| Critical (real-time) | `Submit`, `Accept`, `AddAdapter`, `RemoveAdapter`, `SetIsAllocator`, `SetCurator`, `SetOwner`, `SetIsSentinel`, `IncreaseAbsoluteCap`, `IncreaseRelativeCap`, `SetAdapterRegistry`, `DecreaseTimelock`, gate setters, `SetPerformanceFee*` | MYT | Any new adapter or allocator not announced by Alchemix → pause the Yearn strategy and exit |
| Critical (real-time) | `OperatorUpdated`, `AdminUpdated`, `AddedPermissionedCall` | Curator, Allocator | Any change |
| Critical (real-time) | `Upgraded`, `AdminChanged` | Alchemist proxy / ProxyAdmin | Any upgrade |
| Critical (real-time) | `TransmutationFeeUpdated`, `ExitFeeUpdated`, `ProtocolFeeReceiverUpdated`, `AlchemistUpdated`, `AdminUpdated`, `TransmutationTimeUpdated`, `DepositCapUpdated` | Transmuter | Fee > 0 or receiver change → stop deposits, claim matured positions |
| High (daily) | Share price `convertToAssets(1e18)` | MYT | Any decrease (losses pass through immediately) |
| High (daily) | `allocation(adapterId)` / `realAssets()` per adapter, `liquidityAdapter()` | MYT, adapters | Single venue > 45%, or a new venue |
| High (daily) | `badDebtRatio` inputs: `totalSyntheticsIssued`, `getTotalLockedUnderlyingValue`, Transmuter MYT balance | Alchemist, Transmuter | Ratio > 0.97 |
| High (daily) | `getTotalUnderlyingValue / totalDebt` and positions below CR 1.08 | Alchemist | System CR < 1.3 |
| Medium (daily) | `depositCap − totalActiveLocked` | Transmuter | Capacity for strategy deposits |
| Medium (daily) | yvUSD `maxWithdraw(0xdFDC…e220)` vs MYT outstanding claims | yvUSD | < 25% of MYT TVL |
| Medium (daily) | Fluid Lite `getIdleBalance()`, `isWithdrawalsPaused()`, `getExchangePrice()` updates | fLiteUSD | Idle < 2× MYT position or withdrawals paused |
| Medium (daily) | InfiniFi `Accounting.totalAssetsValueOf(1)` | InfiniFi | LIQUID bucket < 2× MYT siUSD position |
| Medium (daily) | alUSD/USDC and alUSD/frxUSD `get_dy` | Curve | Discount > 5% (stress) or < 1% (strategy unprofitable) |
| Low (weekly) | Safe `getThreshold()`/`getOwners()` for v3 admin and DAO Safes; alUSD `ADMIN` role members | Safes, alUSD | Any change |

## Appendix: Contract Architecture

```
                         ┌──────────────── GOVERNANCE ────────────────┐
                         │ v3 admin Safe 0xF56D…293D (3/7, no delay)  │
                         │  · MYT owner                               │
                         │  · Curator admin+operator · Allocator admin+operator
                         │  · owner of all adapters · Classifier admin│
                         │  · Alchemist admin · ProxyAdmin owner      │
                         │  · Transmuter admin                        │
                         │ DAO Safe 0x9e2b…BBF9 (3/7; 6/7 same owners)│
                         │  · MYT sentinel · Alchemist guardian       │
                         │  · fee receiver · alUSD ADMIN              │
                         └───────────────┬────────────────────────────┘
                                         │ (timelock = 0 on every path)
 ┌───────────────── ALCHEMIX V3 ─────────▼──────────────────────────────────┐
 │  Borrowers ──MYT──► AlchemistV3 (upgradeable) ──mints──► alUSD (AlToken) │
 │                       │  6.30M MYT collateral, 3.41M alUSD debt          │
 │                       │  earmark / redeem (MYT)                          │
 │                       ▼                                                  │
 │  alUSD holders ──► Transmuter (2.5M cap, ~121 d vest, 1% early exit)     │
 │   (Yearn strategy)    │  claim → MYT 1:1 (scaled by badDebtRatio)        │
 └───────────────────────┼──────────────────────────────────────────────────┘
                         ▼
 ┌──────────────── MYT: mixUSDC (Morpho VaultV2) 8.14M USDC ────────────────┐
 │  AlchemistCurator ─ adapters/caps     AlchemistAllocator ─ allocate      │
 │      │                 │                    │                            │
 │      ▼                 ▼                    ▼                            │
 │  SiUSD adapter 40.4%   yvUSD adapter 39.9% (liquidity)  FluidLite 19.7%  │
 └──────┼─────────────────┼───────────────────────────────────┼─────────────┘
        ▼                 ▼                                   ▼
  InfiniFi siUSD/iUSD   Yearn yvUSD (Morpho, Katana,      Fluid Lite USD (UUPS,
  (RWA-heavy, 3.19)     Cap looper, Pendle PTs; 2.46)     24h timelock owner;
                                                          looping on ETH/ARB/Plasma
                                                          via CCIP + LayerZero)
```

---

## Risk Summary

### Key Strengths

- **MYT core is Morpho Vault V2**, an immutable, audited, ERC-4626 vault with onchain share-price accounting. Losses pass through immediately, and a 10% APR `maxRate` caps sudden upward revaluation.
- **Permissionless, atomic MYT redemption** for ~40% of TVL via the yvUSD liquidity adapter. A permissionless `forceDeallocate` (2% penalty) can also pull from the siUSD and yvUSD adapters.
- **Transmuter mechanics are fully onchain and permissionless:** linear vesting, no pause, claims at any time, and an explicit `badDebtRatio` haircut instead of silent insolvency. System CR is 1.90 and the bad-debt ratio is 0.93.
- **Extensive audit coverage** across core (Cantina, Immunefi competition, yAudit) and adapters (Nethermind, yAudit), plus an active Immunefi program and a team operating since 2021.
- **Candid documentation**, including published zero-timelock status, role holders, and per-strategy audit mapping.

### Key Risks

- **Single 3-of-7 Safe with zero timelocks** controls the MYT adapter set, caps, allocations, adapter swap parameters, the Alchemist implementation, and Transmuter fees. The DAO sentinel shares 6 of 7 signers and has no revoke window.
- **Underlying quality is mixed and concentrated:** 40% InfiniFi (offchain-RWA-heavy), 40% yvUSD (cross-chain and levered legs; circular if the Yearn strategy sits in yvUSD), and 20% Fluid Lite, whose share price **cannot decrease** and so masks losses until withdrawals fail.
- **Transmuter capacity is effectively full** (12,458 alUSD free of 2.5M), and alUSD entry and exit liquidity is shallow and imbalanced. The strategy's deployable size and early-exit value are tightly constrained.
- **Thin borrower buffers:** the largest positions sit at CR ≈ 1.114 against liquidation at 1.053. A ~10% MYT drawdown would create bad debt and pro-rata Transmuter haircuts.
- **Recent and evolving code:** about 7 months in production, a June 2026 critical in a strategy, two Alchemist upgrades, and two adapter base versions in use.

### Critical Risks

- The v3 admin Safe can drain all MYT assets (8.14M USDC) in one batched transaction with no delay, by adding a malicious adapter and allocating to it. It can also upgrade the Alchemist (6.48M USDC of collateral) or set a 100% Transmuter fee. This is not a gate trigger (3 signers), but it is the binding risk for any Yearn deployment.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **Unverified contract source**: passes. MYT, curator, allocator, classifier, all four adapters, Alchemist implementation and ProxyAdmin, Transmuter, alUSD, and the fLiteUSD proxy and implementation are verified on Etherscan.
- [x] **No audit**: passes. Multiple audits (see above).
- [x] **Unverifiable reserves**: passes. MYT's reserves are onchain adapter positions; underlying opacity is scored below.
- [x] **Total centralization**: passes, narrowly. Control is a 3-of-7 Safe, not an EOA or <3 signers.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits: 2.5**: 2+ reputable firms (Cantina/Spearbit, Nethermind, yAudit) plus an Immunefi competition and Morpho's audited core. Bounty max is $150K (bounty column: 3), there was a post-launch critical, and the system is highly complex.
- **Historical: 3.5**: MYT, Alchemist, and Transmuter are ~7 months old (6–12 months: 3) with MYT TVL of ~$8.1M (<$10M: 4). The Alchemix team has a 5-year record including two material incidents.

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 4.5**: one 3-of-7 Safe (low threshold) holds every material power with **no timelock**: arbitrary adapters, allocations, an upgradeable Alchemist, and Transmuter fees up to 100%. The weakest path exposes 100% of MYT assets instantly. Not 5 only because the gate threshold (EOA or <3 signers) is not met.
- **Programmability: 2.5**: share price, deposits and withdrawals, earmarking, liquidations, and Transmuter vesting are programmatic. Allocation is manual by multisig, and 19.7% of assets are valued from an offchain-reported, non-decreasing exchange price.
- **External Dependencies: 4.0**: three critical yield venues (InfiniFi, yvUSD, Fluid Lite) make up 100% of assets, two of them with offchain or cross-chain exposure, plus 0x and an InfiniFi-supplied oracle on swap paths.

**Centralization Score = (4.5 + 2.5 + 4.0) / 3 = 3.67**

**Score: 3.67/5**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 3.5**: MYT is 100% backed by onchain positions, but the underlying quality is mixed: offchain RWA (InfiniFi) and a leveraged cross-chain vault whose price cannot reflect losses (Fluid Lite). Curation is discretionary with instantly raisable caps. The Alchemist is overcollateralized at the system level (CR 1.90), with thin buffers on the largest borrowers.
- **Provability: 3.0**: MYT and Alchemix V3 accounting is fully onchain and reconciles. Underlying values rely on InfiniFi NAV/attestations and Instadapp's reported exchange price.

**Funds Management Score = (3.5 + 3.0) / 2 = 3.25**

**Score: 3.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 3.5/5.** MYT redemption is direct and instant for ~40% of TVL (yvUSD). The siUSD leg is reachable via `forceDeallocate` at a 2% penalty, subject to InfiniFi liquidity. Fluid Lite (19.7%) needs a privileged deallocation, and MYT has no secondary market. For the Transmuter path, capacity is nearly exhausted, positions vest over ~121 days with a 1% early-exit fee on the unvested part, and alUSD DEX liquidity is shallow and alUSD-heavy.

#### Category 5: Operational Risk (Weight: 5%)

**Score: 2.0/5.** Long-standing, publicly known pseudonymous team; strong documentation; an identified legal entity (Alchemix Association) with jurisdiction `TODO`; documented monitoring and a guardian circuit breaker.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.00 | 20% | 0.600 |
| Centralization & Control | 3.67 | 30% | 1.100 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 3.50 | 15% | 0.525 |
| Operational Risk | 2.00 | 5% | 0.100 |
| **Final Score** | | | **3.30/5.0** |

**Optional Modifiers:** none apply (V3 has been live < 2 years; TVL < $500M).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk**

The score sits in the upper half of Medium Risk. Any Yearn strategy should be **size-limited** by Transmuter capacity and by the instant-drain path held by a 3-of-7 Safe. It should have real-time alerts on MYT adapter, allocator, and Transmuter fee changes, plus an automated exit procedure. If the strategy is placed in yvUSD, the [circular exposure](#circular-exposure-with-yvusd) should be explicitly capped.

---

## Reassessment Triggers

- **Time-based:** reassess in 3 months (February 2027), given V3's age and the pace of adapter changes.
- **TVL-based:** MYT TVL change > 50%, or any single venue > 50% of MYT.
- **Incident-based:**
  - any new adapter or allocator, or any Alchemist upgrade;
  - any Transmuter fee or admin change;
  - a nonzero timelock being introduced (positive) or an adapter registry being set;
  - an MYT share-price decrease;
  - Transmuter `badDebtRatio` > 1;
  - an incident at InfiniFi, Yearn yvUSD, or Fluid Lite;
  - public disclosure of the June 2026 critical's affected strategy.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| November 16, 2026 | 3.30 | Initial assessment ([issue #596](https://github.com/yearn/risk-score/issues/596)). Snapshot block 26,428,200: MYT 8.14M USDC (siUSD 40.40%, yvUSD 39.93%, Fluid Lite 19.67%); 3-of-7 Safe with zero timelocks; Transmuter 12,458 alUSD capacity free |
