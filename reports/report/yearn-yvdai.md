# Protocol Risk Assessment: Yearn — yvDAI-1

- **Assessment Date:** May 11, 2026 (Updated: July 12, 2026)
- **Token:** yvDAI-1 (DAI-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c)
- **Final Score: 1.3/5.0**

## Overview + Links

yvDAI-1 is a **DAI-denominated Yearn V3 vault** (ERC-4626) that deploys deposited DAI through a **vault-of-vaults composition**. At the July 12 snapshot, **73.19% routes through `DAI To USDC-1 Depositor` into yvUSDC-1**, and **26.81% routes through `DAI to USDS Depositor` into yvUSDS-1**. The default queue remains at 2 strategies (unchanged since the May 5 trim from 5 to 2 — the dormant `Savings Dai (sDAI)`, `Spark DAI Lender`, and `Aave V3 DAI Lender` strategies remain absent).

**Material downstream rewiring since May 11:** the intermediate vaults have both changed their strategy compositions. **yvUSDC-1** now has 4 strategies in its queue — a new **"Yearn USDC"** strategy ([`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)) holds 8.41% of tracked debt, and a new `Spark USDC Lender` ([`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a)) replaces the old one at [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) (now with 0 tracked debt). **yvUSDS-1** has added a new **"USDS Sky Rewards Compounder"** strategy ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81), v3.0.3 TokenizedStrategy) at queue position 0 with near-zero debt — a successor to the existing `Spark USDS Compounder`. The yvUSDS-1 split is now 84.09% `sUSDS Lender` / 15.91% `Spark USDS Compounder`.

The **"Yearn USDC"** strategy is a **Yearn-curated Morpho MetaMorpho vault** (verified on-chain). It supplies USDC into four Morpho Blue lending markets: cbBTC collateral via oracle [`0xA6D6950c9F177F1De7f7757FB33539e3Ec60182a`](https://etherscan.io/address/0xA6D6950c9F177F1De7f7757FB33539e3Ec60182a) (LLTV 86%), WBTC via oracle [`0xDddd770BADd886dF3864029e4B377B5F6a2B6b83`](https://etherscan.io/address/0xDddd770BADd886dF3864029e4B377B5F6a2B6b83) (LLTV 86%), and wstETH via two oracles ([`0x48F7E36EB6B826B2dF4B2E630B62Cd25e89E40E2`](https://etherscan.io/address/0x48F7E36EB6B826B2dF4B2E630B62Cd25e89E40E2) and [`0x167D283aCAC1b9ff39466A75aA82902f340f1F4D`](https://etherscan.io/address/0x167D283aCAC1b9ff39466A75aA82902f340f1F4D), both LLTV 86%). All four markets use the same AdaptiveCurveIRM ([`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)). The vault is governed by Yearn's ySafe as guardian, has a 3-day timelock, 0% fee, and Yearn Security as fee recipient. Strategy-level allocation: cbBTC ~74.7% / WBTC ~14.7% / wstETH ~10.7% of the ~$2.15M MetaMorpho TVL.

**Effective endpoint mix for yvDAI-1's deployed DAI (July 12):**

| Endpoint | Path | Effective share |
|----------|------|----------------:|
| Sky **sUSDS** (Sky Savings Rate) | yvDAI-1 → yvUSDC-1 → sUSDS Lender **AND** yvDAI-1 → yvUSDS-1 → sUSDS Lender | **~89.6%** |
| **Morpho Blue** (cbBTC + WBTC + wstETH lending) | yvDAI-1 → yvUSDC-1 → Yearn USDC (Morpho MetaMorpho) | **~6.2%** |
| Sky **USDS Staking Rewards** (SPK farm) | yvDAI-1 → yvUSDS-1 → Spark USDS Compounder | **~4.3%** |

The cascade remains at most **two Yearn V3 vault layers deep** (three when counting the MetaMorpho layer inside the Yearn USDC strategy). Sky-ecosystem concentration (sUSDS + USDS Staking) is ~93.9%, down from ~100% at May 11. The ~6.2% Yearn USDC leg is a Yearn-curated Morpho MetaMorpho vault — same governance as yvDAI-1 — that supplies USDC into Morpho Blue lending markets against cbBTC, WBTC, and wstETH collateral, diversifying the vault beyond the Sky ecosystem.

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting DAI deposits, issuing yvDAI-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Default queue (2 strategies, both funded):**
  - **DAI To USDC-1 Depositor** ([`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5)) — 6,951,724.02 DAI (73.19%). DAI → USDC (Maker PSM Lite, 1:1 at 0% fee) → yvUSDC-1 deposit. yvUSDC-1 routes ~91.59% via its `USDC to sUSDS Lender` strategy directly into sUSDS, plus ~8.41% via its `Yearn USDC` strategy (Morpho MetaMorpho vault) into Morpho Blue lending markets
  - **DAI to USDS Depositor** ([`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d)) — 2,545,516.51 DAI (26.81%). DAI → USDS (Sky DAI-USDS Exchanger, 1:1, no fee) → yvUSDS-1 deposit. yvUSDS-1 currently routes 84.09% via its `sUSDS Lender` strategy (Sky Savings Rate) and 15.91% via its `Spark USDS Compounder` (Sky USDS Staking Rewards)
- **Removed from queue between April 27 and May 5:** Savings Dai (sDAI), Spark DAI Lender, Aave V3 DAI Lender — all previously zero-debt; remain absent at block 25073237
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)) governed by the **Yearn 6-of-9 ySafe** with **7-day TimelockController** for strategy additions

**Key metrics (July 12, 2026, snapshot at block 25519075, timestamp 1783889819 = 20:56:59 UTC):**

- **TVL:** 9,497,240.53 DAI
- **Total Supply:** 8,449,852.84 yvDAI-1
- **Price Per Share:** 1.123954 DAI/yvDAI-1 (~12.40% cumulative appreciation over ~28 months, ~5.3% annualized)
- **Total Debt:** 9,497,240.53 DAI (100% deployed)
- **Total Idle:** 0 DAI
- **Deposit Limit:** 50,000,000 DAI (enforced via `maxDeposit`, current remainder ~40.5M DAI)
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee

**Verified vault-of-vaults wiring (block 25519075):**

- `DAI To USDC-1 Depositor` ([`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5)) → yvUSDC-1 ([`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204))
- `DAI to USDS Depositor` ([`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d)) → yvUSDS-1 ([`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8))
- yvUSDC-1's `USDC to sUSDS Lender` ([`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)) holds 91.59% of yvUSDC-1's tracked debt; `Yearn USDC` ([`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)) holds 8.41%; `Spark USDC Lender` (new, [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a)) holds 0; `USDC to USDS Depositor` ([`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52)) holds 0 USDC. The old Spark USDC Lender ([`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673)) shows 0 tracked debt and is no longer in the default queue.
- yvUSDS-1's `sUSDS Lender` ([`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)) holds 84.09% of yvUSDS-1's debt; `Spark USDS Compounder` ([`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)) holds 15.91%; `USDS Sky Rewards Compounder` ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81)) holds 0 USDS

**Links:**

- [Yearn V3 Documentation](https://docs.yearn.fi/getting-started/products/yvaults/v3)
- [Yearn V3 Vault Management](https://docs.yearn.fi/developers/v3/vault_management)
- [Yearn Security](https://github.com/yearn/yearn-security/blob/master/SECURITY.md)
- [DeFiLlama: Yearn Finance](https://defillama.com/protocol/yearn-finance)
- [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig)
- [Sky Protocol Documentation](https://developers.skyeco.com/)
- [Sky Savings Rate (sUSDS)](https://docs.spark.fi/user-guides/earning-savings/susds)
- [Companion report: yvUSDC-1](./yearn-yvusdc.md)
- [Companion report: yvUSDS-1](./yearn-yvusds.md)

## Contract Addresses

### Core yvDAI-1 Contracts

| Contract | Address | Type |
|----------|---------|------|
| yvDAI-1 Vault | [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c) | Yearn V3 Vault (v3.0.2), Vyper minimal proxy |
| Underlying asset (DAI) | [`0x6B175474E89094C44Da98b954EedeAC495271d0F`](https://etherscan.io/address/0x6B175474E89094C44Da98b954EedeAC495271d0F) | MakerDAO DAI |
| Accountant | [`0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69`](https://etherscan.io/address/0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69) | Shared Yearn Accountant (0% mgmt, 10% perf) |
| Fee Recipient (Dumper) | [`0x590Dd9399bB53f1085097399C3265C7137c1C4Cf`](https://etherscan.io/address/0x590Dd9399bB53f1085097399C3265C7137c1C4Cf) | Claims fees and routes to auctions/splitters |

### Governance Contracts (shared with all Yearn V3 risk-1 vaults)

| Contract | Address | Configuration |
|----------|---------|---------------|
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Single instance for all category-1 vaults |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 Gnosis Safe |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) |
| Vault Original (v3.0.2) | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) |

### Active Strategies (2 in default queue, 2 with debt)

Default queue order at block 25519075:

| # | Strategy | Name | Activation | Current Debt (DAI) | Allocation |
|---|----------|------|------------|-------------------:|-----------:|
| 1 | [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | **DAI to USDS Depositor** | 2025-05-15 | **2,545,516.51** | **26.81%** |
| 2 | [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) | **DAI To USDC-1 Depositor** | 2025-10-24 | **6,951,724.02** | **73.19%** |

Last reports: DAI to USDS Depositor 2026-07-12; DAI To USDC-1 Depositor 2026-07-12.

**Removed from queue between April 27 and May 5 (no longer in `get_default_queue()`):**

- Savings Dai (sDAI) ([`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA)) — direct sDAI ERC-4626 wrapper from MakerDAO; previously zero debt
- Spark DAI Lender ([`0x1fd862499e9b9402DE6c599b6C391f83981180Ab`](https://etherscan.io/address/0x1fd862499e9b9402DE6c599b6C391f83981180Ab)) — direct supply into Spark Lend; previously zero debt
- Aave V3 DAI Lender ([`0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B`](https://etherscan.io/address/0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B)) — direct supply into Aave V3; previously zero debt

The rationale for removing all three direct-deposit fallbacks has not been independently verified. Reintroducing any of them would require a fresh `addStrategy()` proposal at the Strategy Manager TimelockController (7-day delay).

### Strategy Protocol Dependencies (effective)

After the vault-of-vaults unwind:

| Effective endpoint | Path | Effective share |
|--------------------|------|----------------:|
| **Sky / sUSDS (Sky Savings Rate)** | yvDAI-1 → yvUSDC-1 → `USDC to sUSDS Lender` (~67.0%) **AND** yvDAI-1 → yvUSDS-1 → `sUSDS Lender` (~22.6%) | **~89.6%** |
| **Morpho Blue lending** (cbBTC + WBTC + wstETH) | yvDAI-1 → yvUSDC-1 → `Yearn USDC` (Morpho MetaMorpho) | **~6.2%** |
| **Sky USDS Staking Rewards (SPK farm)** | yvDAI-1 → yvUSDS-1 → Spark USDS Compounder → Sky USDS Staking | **~4.3%** |
| **MakerDAO PSM Lite** (USDC ↔ DAI) | Used by `DAI To USDC-1 Depositor` for inbound DAI → USDC conversion (and reverse on withdrawal) | High during routing |
| **Sky DAI-USDS Exchanger** (DAI ↔ USDS) | Used by `DAI to USDS Depositor` for inbound DAI → USDS conversion (and reverse on withdrawal) | High during routing |
| **yvUSDC-1** (intermediate vault) | 73.19% of yvDAI-1 routes through it | Vault-of-vaults dependency |
| **yvUSDS-1** (intermediate vault) | 26.81% of yvDAI-1 routes through it | Vault-of-vaults dependency |

Net Sky-ecosystem concentration: ~93.9% of deployed DAI (sUSDS + Sky USDS Staking). The remaining ~6.2% is deployed through the `Yearn USDC` strategy — a **Yearn-curated Morpho MetaMorpho vault** that supplies USDC into Morpho Blue lending markets against cbBTC, WBTC, and wstETH collateral, providing diversification beyond the Sky ecosystem under the same Yearn governance.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240502_Statemind_Yearn_V3/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/blob/master/audits/20240504_ChainSecurity_Yearn_V3/) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20240601_YAcademy_Yearn_V3/06-2023-Yearn-Vault-V3_yAcademy_Reports.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

### Sky / MakerDAO Audits (Underlying Protocol)

Sky (formerly MakerDAO) is one of the most extensively audited DeFi protocols:

| Auditor | Coverage | Notes |
|---------|----------|-------|
| ChainSecurity | 9 audits including USDS, sUSDS, PSM Lite | Core security partner |
| Cantina | 10 audit reports including sUSDS and USDS | Comprehensive coverage |
| Sherlock | Public audit contest (Aug 2024) | Community audit |
| Trail of Bits | Core DAI system (legacy MCD) | Historical audit |
| PeckShield | Core DAI system (legacy MCD) | Historical audit |
| Quantstamp | Liquidations 2.0 | Historical audit |
| ABDK | Vote Delegate security | Governance audit |

**LitePSM** (used for USDC ↔ DAI conversion): audited by ChainSecurity and Cantina.

**DAI-USDS Exchanger**: part of the Sky Endgame stack, audited under the same umbrella.

### Strategy Review Process

All strategies pass through Yearn's **12-metric risk-scoring framework** ([RISK_FRAMEWORK.md](https://github.com/yearn/risk-score/blob/master/vaults/RISK_FRAMEWORK.md)). yvDAI-1 is registered as **Category 1** in the Role Manager (`getCategory(vault) == 1`), the strictest tier.

### Bug Bounty

- **Yearn (Immunefi):** active, **$200,000** max payout (Critical). https://immunefi.com/bounty/yearnfinance/
- **Yearn (Sherlock):** also listed at https://audits.sherlock.xyz/bug-bounties/30
- **Sky / MakerDAO (Immunefi):** active, **$10,000,000** max payout (Critical). Scope includes DAI, USDS, sUSDS, PSM. https://immunefi.com/bug-bounty/sky/
- **Morpho Blue (Immunefi):** active, **$2,500,000** max payout (Critical). https://immunefi.com/bug-bounty/morpho/
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvDAI-1 system is **moderately complex** because of the vault-of-vaults composition:

- **2 funded strategies**, both depositors into other Yearn V3 vaults
- **Conversion hops:**
  - `DAI To USDC-1 Depositor`: DAI → USDC (PSM Lite) → yvUSDC-1 → (91.59%) USDC into sUSDS Lender / (8.41%) USDC into Yearn USDC strategy
  - `DAI to USDS Depositor`: DAI → USDS (Exchanger) → yvUSDS-1 → (84.09%) USDS into sUSDS Lender / (15.91%) USDS into Spark USDS Compounder → Sky USDS Staking Rewards
- **Two layers of Yearn V3 vault accounting** to verify (yvDAI-1 → yvUSDC-1 or yvDAI-1 → yvUSDS-1). Neither intermediate vault chains through the other
- **No leverage, no looping, no cross-chain bridging**
- **Standard ERC-4626** at every layer
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

The vault-of-vaults composition is **not leverage** but is a real complexity surface — a bug or accounting issue at any layer cascades. Each layer is itself ERC-4626 and on-chain verifiable.

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~28 months** in production
- **TVL:** 9,497,240.53 DAI — well within the 50M DAI deposit limit (current remainder ~40.5M DAI via `maxDeposit`)
- **PPS trend:** 1.000000 → 1.123954 (~12.40% cumulative return over ~28 months, ~5.3% annualized)
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management. Between April 27 and May 5, three direct-deposit fallbacks (sDAI, Spark DAI Lender, Aave V3 DAI Lender) were removed from the default queue (and remain absent at July 12). Between May 5 and May 11, the depositor allocation shifted from 79.44 / 20.56 to 72.97 / 27.03 (USDC / USDS). The allocation at July 12 is 73.19 / 26.81 — largely stable since May 11
- **Vault-of-vaults rewiring (downstream):**
  - Between May 11 and July 12, both intermediate vaults added new strategies. **yvUSDC-1** added a new "Yearn USDC" strategy ([`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)) that now holds 8.41% of tracked debt, replacing the old `Spark USDC Lender` ([`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673)) which now has 0 tracked debt. The Spark USDC Lender was replaced by a new version at [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a) (currently 0 debt). **yvUSDS-1** added a new "USDS Sky Rewards Compounder" strategy ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81), v3.0.3 TokenizedStrategy) as a successor to the existing `Spark USDS Compounder`, currently with near-zero debt
  - **Net effect at July 12:** effective endpoint mix is ~89.6% sUSDS / ~6.2% Morpho Blue lending (via Yearn USDC MetaMorpho) / ~4.3% Sky USDS Staking. Overall Sky-ecosystem concentration dropped from ~100% to ~93.9% as the Spark Lend USDC leg was replaced by the Yearn USDC MetaMorpho vault deploying into Morpho Blue markets
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~26 months). No V3 vault exploits

**Yearn protocol TVL:** ~$197.5M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn), April 2026).

**Sky / sUSDS / USDS Staking track record:** see the [yvUSDS-1 report](./yearn-yvusds.md) for the underlying-protocol details — yvDAI-1 inherits the same dependency profile via the depositor strategies.

## Funds Management

yvDAI-1 deploys ~99.9999% of its DAI via two depositor strategies. The majority terminates inside the Sky ecosystem, with a ~6.2% leg through the Yearn USDC strategy — a Yearn-curated Morpho MetaMorpho vault that supplies USDC into Morpho Blue lending markets against cbBTC, WBTC, and wstETH collateral.

### Strategy 1: DAI To USDC-1 Depositor (73.19% allocation)

**Contract:** [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) — verified vault target [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) (yvUSDC-1).

**Pipeline:**

1. **DAI → USDC** via MakerDAO PSM Lite ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) — 1:1 at **0% fee** (`tin = tout = 0`)
2. **USDC → yvUSDC-1** deposit (ERC-4626)
3. yvUSDC-1 internally routes ~91.59% to its `USDC to sUSDS Lender` strategy ([`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)) → USDC → USDS (or sUSDS-internal conversion) → sUSDS, plus ~8.41% to its `Yearn USDC` strategy ([`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)) — a **Yearn-curated Morpho MetaMorpho vault** that supplies USDC into four Morpho Blue markets against cbBTC, WBTC, and wstETH collateral (LLTV 86% each, AdaptiveCurveIRM). The `Spark USDC Lender` (new version at [`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a)) holds 0 debt. The old Spark USDC Lender at [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) has 0 tracked debt and is no longer in the default queue

**Withdrawal:** reverse path. The user's `redeem` on yvDAI-1 triggers `withdraw` from this strategy → `redeem` from yvUSDC-1 → `withdraw` from yvUSDC-1's downstream (sUSDS Lender or Yearn USDC MetaMorpho → Morpho Blue) → unwind into USDC → DAI via PSM. All atomic in the same transaction.

**Strategy parameters:**
- Activated: 2025-10-24
- Last reported: 2026-07-12 (`last_report = 1783830887`)
- PSM fee fallback: 0.05% threshold (above which the strategy can be configured to use Uniswap V3 with 0.5% slippage tolerance)

### Strategy 2: DAI to USDS Depositor (26.81% allocation)

**Contract:** [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) — verified vault target [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) (yvUSDS-1).

**Pipeline:**

1. **DAI → USDS** via Sky DAI-USDS Exchanger ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A)) — 1:1, no fee
2. **USDS → yvUSDS-1** deposit (ERC-4626)
3. yvUSDS-1 currently routes 84.09% to its `sUSDS Lender` strategy ([`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)) → direct deposit into Sky's sUSDS (Sky Savings Rate), plus 15.91% to its `Spark USDS Compounder` strategy ([`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)) → Sky USDS Staking Rewards (SPK farm). A new `USDS Sky Rewards Compounder` strategy ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81), v3.0.3 TokenizedStrategy) is in queue position 0 with near-zero debt — intended as a successor to the existing Spark USDS Compounder

**Withdrawal:** reverse path. The user's `redeem` on yvDAI-1 triggers `withdraw` from this strategy → `redeem` from yvUSDS-1 → unwind from whichever yvUSDS-1 leg the redemption hits in queue order (sUSDS Lender then Spark Compounder). All atomic in the same transaction.

**Strategy parameters:**
- Activated: 2025-05-15
- Last reported: 2026-07-12 (`last_report = 1783831475`)

### Removed from default queue (between April 27 and May 5)

- **Savings Dai (sDAI)** ([`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA)) — direct ERC-4626 wrapper from MakerDAO; previously zero debt
- **Spark DAI Lender** ([`0x1fd862499e9b9402DE6c599b6C391f83981180Ab`](https://etherscan.io/address/0x1fd862499e9b9402DE6c599b6C391f83981180Ab)) — direct supply into Spark Lend; previously zero debt
- **Aave V3 DAI Lender** ([`0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B`](https://etherscan.io/address/0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B)) — direct supply into Aave V3; previously zero debt

The removal of all three direct-deposit fallbacks eliminates the on-chain single-hop alternatives that were available at the prior snapshot. Reintroducing any of them now requires a fresh `addStrategy()` proposal at the Strategy Manager TimelockController (7-day delay). Rationale for the removals has not been independently verified.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 50M DAI deposit limit
- **Withdrawals:** ERC-4626. Atomic, but unwinds through up to three vault layers + Sky / Spark unstaking
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% on-chain DAI backing.** All deposits are DAI; deployed DAI ends up as USDS at the terminal layer (yvUSDS-1) but the unwind always returns DAI 1:1
- **Collateral quality:** ultimately backed by Sky's over-collateralized loan book + RWA Treasury bills (via USDS / sUSDS / USDS Staking Rewards) — see [yvUSDS-1 report](./yearn-yvusds.md) for full underlying details
- **No leverage** — vault-of-vaults composition is not leverage
- **All positions are fully redeemable** via the reverse pipeline

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads the underlying yvUSDC-1 / yvUSDS-1 share balance and converts via ERC-4626 `convertToAssets()` — fully on-chain, real-time
- **Multi-layer verification:** anyone can independently verify yvDAI-1 → yvUSDC-1 → (sUSDS or Yearn USDC MetaMorpho → Morpho Blue) and yvDAI-1 → yvUSDS-1 → Spark USDS Compounder on-chain. Each layer's exchange rate is its own ERC-4626 calculation
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 10 days

The vault-of-vaults adds a small surface area to verify (multiple `totalAssets()` reads) but does not add any off-chain dependency.

## Liquidity Risk

- **Primary exit:** Redeem yvDAI-1 for DAI via ERC-4626 `withdraw()` / `redeem()`. Triggers reverse pipeline through yvUSDC-1 / yvUSDS-1 (atomic, multi-step in the same transaction)
- **Highly liquid underlying:** sUSDS holds multi-billion TVL; USDS Staking Rewards has multi-billion USDS staked; Morpho Blue markets for cbBTC, WBTC, and wstETH are deep and liquid. yvDAI-1's ~$9.50M is a tiny fraction of underlying capacity
- **PSM liquidity:** MakerDAO PSM Lite provides deep DAI ↔ USDC liquidity at 1:1, 0% fee. PSM capacity is managed by Sky governance and typically holds billions of USDC
- **Cascading withdrawal mechanics:** both depositor paths traverse **two Yearn V3 vault layers** (yvDAI-1 → yvUSDC-1 or yvDAI-1 → yvUSDS-1) plus the terminal unstake (sUSDS withdrawal, Morpho Blue withdrawal, or Spark Compounder unwind). The Yearn USDC path adds an additional MetaMorpho layer (bounded). Neither intermediate vault chains through the other. All steps execute atomically in the same transaction
- **No DEX liquidity needed** — exit is via Sky's own contracts (PSM, Exchanger, sUSDS, USDS Staking) and Morpho Blue
- **Same-value asset:** DAI-denominated vault token — no price-divergence risk
- **No withdrawal queue or cooldown** — atomic redemption
- **Deposit limit:** 50M DAI cap vs ~$9.50M TVL (room for +426%)

The cascading multi-layer withdrawal is atomic but has a higher gas cost than a single-strategy vault. For a large institutional withdrawal, the gas of unwinding through both layers plus the terminal Sky / Spark unstakes should be considered when sizing the redemption.

## Centralization & Control Risks

### Governance

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | 12 of 14 vault roles |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-8 | QUEUE, REPORTING, DEBT, MAX_DEBT, DEPOSIT_LIMIT, WITHDRAW_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | DEBT, MAX_DEBT, EMERGENCY |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | REPORTING + DEBT_MANAGER |

ySafe 6-of-9 signers include publicly known DeFi contributors — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig).

**Properties:**

1. **No EOA holds vault roles directly**
2. **Strategy additions and accountant changes pass through 7-day timelock**
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself
4. **Vault contract is immutable** — Vyper minimal proxy
5. **Same governance pattern across 37+ vaults**

### Programmability

- **PPS:** ERC-4626, fully algorithmic at every vault layer
- **Vault operations:** permissionless deposit / withdraw on-chain
- **Strategy reporting:** automated via keeper at every vault layer
- **Debt allocation:** Debt Allocator (automated) + Brain (manual) at every vault layer
- **Off-chain inputs:** none

### External Dependencies

After resolving the vault-of-vaults composition, yvDAI-1's effective dependencies are:

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **yvUSDC-1** (intermediate vault) | Critical — 73.19% of deployed funds route through it | Same governance, audits, code as yvDAI-1. See [yvUSDC-1 report](./yearn-yvusdc.md) |
| **yvUSDS-1** (intermediate vault) | Critical — 26.81% of deployed funds route through it | Same governance, audits, code. See [yvUSDS-1 report](./yearn-yvusds.md) |
| **Sky / sUSDS** (Sky Savings Rate) | Critical — ~89.6% of effective deployment (via both intermediate vaults) | Multi-billion sUSDS TVL, $10M Immunefi bounty |
| **Yearn USDC (Morpho MetaMorpho)** | Moderate — ~6.2% of effective deployment (via yvUSDC-1) | Yearn-curated Morpho MetaMorpho vault supplying USDC into Morpho Blue (cbBTC, WBTC, wstETH collateral; LLTV 86%; AdaptiveCurveIRM). Same Yearn governance (ySafe guardian, Security fee recipient, 3-day timelock). Morpho Blue audited by Cantina, Spearbit, ChainSecurity |
| **Sky USDS Staking Rewards (SPK farm)** | Moderate — ~4.3% of effective deployment (via yvUSDS-1) | First-party Sky contract; share decreased from ~5.4% at May 11 |
| **MakerDAO PSM Lite** | High during routing (used by yvUSDC-1 path) | 1:1, 0% fee, audited |
| **Sky DAI-USDS Exchanger** | High during routing (used by yvUSDS-1 path) | 1:1, no fee, audited |
| **DAI / USDS / USDC tokens** | Critical | Inherited from each conversion hop |

**Dependency quality:** all dependencies are top-tier — Sky / MakerDAO infrastructure, Morpho Blue (audited by 3+ firms, battle-tested lending primitive), plus Yearn V3 itself. The vault-of-vaults composition concentrates dependency on the Sky ecosystem (~93.9% of effective deployment across sUSDS + USDS Staking) and on Yearn V3's own vault accounting working correctly across two vault layers. The ~6.2% Yearn USDC leg is a Yearn-curated Morpho MetaMorpho vault under the same Yearn governance, with the Morpho Blue protocol as a well-audited, non-Sky dependency that provides collateral diversification.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. All strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault
- **Vault-of-vaults operational consideration:** because yvDAI-1's funded strategies all depend on yvUSDC-1 / yvUSDS-1 being healthy, an emergency action on either upstream vault (e.g. shutdown, deposit pause) directly impacts yvDAI-1

## Monitoring

### Existing Monitoring Infrastructure

Yearn maintains the [`monitoring`](https://github.com/yearn/monitoring) repository with active alerting. **yvDAI-1 is in the monitored vault list:**

- **Large flow alerts** ([`protocols/yearn/alert_large_flows.py`](https://github.com/yearn/monitoring/blob/main/protocols/yearn/alert_large_flows.py)) — runs **hourly via the automation scheduler**
- **Endorsed vault check** (`protocols/yearn/check_endorsed.py`) — daily
- **Timelock monitoring** (`protocols/timelock/timelock_alerts.py`)

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| yvDAI-1 Vault | [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c) | PPS, `totalAssets()`, `totalDebt()`, `totalIdle()`, Deposit / Withdraw events |
| DAI to USDC-1 Depositor | [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) | `totalAssets()`, `isShutdown()`, keeper report |
| DAI to USDS Depositor | [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | `totalAssets()`, `isShutdown()`, keeper report |
| yvUSDC-1 (upstream dependency) | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | PPS, shutdown state, strategy queue |
| yvUSDS-1 (upstream dependency) | [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) | PPS, shutdown state, strategy queue |
| Yearn USDC (Morpho MetaMorpho) | [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3) | `totalAssets()`, `totalSupply()`, `supplyQueue()`, Morpho Blue market utilization rates |
| USDS Sky Rewards Compounder | [`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | `totalAssets()`, debt migration from Spark USDS Compounder |
| MakerDAO PSM Lite | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `tin`, `tout` (fee parameters) |
| Sky DAI-USDS Exchanger | [`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) | Pause state |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |

### Critical Events to Monitor

- **PPS decrease** at any of the three vaults in scope (yvDAI-1, yvUSDC-1, yvUSDS-1) — should only increase outside of explicit loss events
- **Strategy additions / removals** at any layer
- **Emergency actions** (`Shutdown`) at any layer — directly impacts yvDAI-1's redemption path
- **PSM `tin` / `tout`** — if non-zero, USDC ↔ DAI conversion incurs fees
- **DAI-USDS Exchanger pause state**
- **Sky USDS Staking Rewards pause / migration** (affects ~4.3% of effective deployment via yvUSDS-1)
- **Sky sUSDS pause / migration** (affects ~89.6% of effective deployment via both intermediate vaults — dominant exposure)
- **Yearn USDC MetaMorpho: guardian or curator changes, market removal, or exploit** (affects ~6.2% of effective deployment via yvUSDC-1)
- **ySafe / Brain / Security signer or threshold changes**

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | yvDAI-1 | PPS | Every 6 hours |
| `convertToAssets(1e6)` | yvUSDC-1 | Upstream PPS | Every 6 hours |
| `convertToAssets(1e18)` | yvUSDS-1 | Terminal PPS | Every 6 hours |
| `totalAssets()` | All three vaults | TVL | Daily |
| `tin()` / `tout()` | PSM Lite | PSM fee | Daily |
| `live()` | DAI-USDS Exchanger | Exchanger active | Daily |
| `getThreshold()` / `getOwners()` | ySafe | Governance integrity | Weekly |
| `getMinDelay()` | ySafe | Delay change detection | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~26 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Predominantly top-tier underlying:** ~93.9% of effective deployment ends at Sky-ecosystem contracts (sUSDS ~89.6% + USDS Staking ~4.3%) — Sky has a $10M Immunefi bounty and is one of the most extensively audited DeFi protocols
- **Standard Yearn governance:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock
- **Established track record:** ~28 months in production, ~12.40% cumulative return, zero incidents
- **Active monitoring:** vault is in Yearn's hourly monitoring system
- **Cascade depth bounded:** the deepest Yearn-vault chain is two layers (yvDAI-1 → yvUSDC-1 or yvDAI-1 → yvUSDS-1); neither intermediate vault chains through the other
- **No leverage. No cross-chain.** Vault-of-vaults composition is not leverage
- **Highly liquid underlying** — Sky / sUSDS / PSM all multi-billion-dollar deep
- **All conversion hops at 1:1** — PSM Lite (USDC ↔ DAI) and DAI-USDS Exchanger are both 0-fee 1:1

### Key Risks

- **Vault-of-vaults composition (2 layers):** both depositor paths traverse two Yearn V3 vault layers. A bug or accounting issue at any layer cascades. Each layer's emergency state (shutdown, deposit pause) directly affects yvDAI-1
- **Effective concentration into Sky ecosystem:** ~93.9% of deployed DAI ultimately ends up in Sky-ecosystem contracts (sUSDS ~89.6%, Sky USDS Staking ~4.3%). The remaining ~6.2% is deployed through the `Yearn USDC` MetaMorpho vault into Morpho Blue lending markets (cbBTC, WBTC, wstETH collateral) — a non-Sky dependency under the same Yearn governance. A bug or governance failure at the sUSDS contract would affect ~89.6% of deployed value; a Sky-wide systemic failure would affect ~93.9%
- **Sky Savings Rate / SPK reward rate variability:** affects yield, not principal
- **PSM fee risk:** currently 0%, but Sky governance can change. Above 0.05% the strategy can fall back to Uniswap V3 with 0.5% slippage
- **Intermediate-vault dependency:** both paths have a single intermediate Yearn V3 vault (yvUSDC-1 or yvUSDS-1) between yvDAI-1 and the terminal Sky / Spark contracts

### Critical Risks

- None identified. The dominant systemic risk is a Sky USDS / sUSDS / USDS Staking failure, which would simultaneously impair the four risk-1 stable vaults — but that is a system-wide DeFi event, not a Yearn-specific risk. The ~6.2% Yearn USDC Morpho leg diversifies into non-Sky collateral (cbBTC/WBTC/wstETH) under Yearn governance, reducing the single-ecosystem concentration from ~100% to ~93.9%. A bug or exploit in the Yearn USDC MetaMorpho strategy would affect ~6.2% of deployed DAI.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is rounded to one decimal place using standard nearest-0.1 rounding; when the value is exactly halfway between two 0.1 marks (X.X50), round UP to the higher (riskier) score per the conservative principle

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Sky / sUSDS / USDS Staking audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 at all vaults in scope, all positions on-chain verifiable. ✅ PASS
- [x] **Total centralization** — 6-of-9 multisig with publicly named signers. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Sky / sUSDS / USDS Staking: 7+ auditors |
| Bug bounty | $200K (Yearn Immunefi); $10M (Sky Immunefi) |
| Production history | **~28 months** (March 12, 2024). V3 framework: ~26 months |
| TVL | **~$9.50M** DAI. Deposit limit: 50M |
| Security incidents | None on V3, none on Sky |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — strong audit coverage, ~28 months clean production, no incidents.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable** |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers** |
| Timelock | 7-day delay on `ADD_STRATEGY` and `ACCOUNTANT`. Self-governed |
| Privileged roles | Well-distributed; no role concentration |
| EOA risk | None |

**Governance Score: 1.0 / 5** — textbook score-1 governance.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, algorithmic at every layer |
| Vault operations | Permissionless deposits / withdrawals |
| Strategy reporting | Programmatic via keeper |
| Debt allocation | Automated (Debt Allocator) + manual (Brain) |
| Vault-of-vaults | All on-chain; multiple layers to verify but each layer is deterministic |

**Programmability Score: 1.0 / 5** — fully programmatic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count (effective) | 2 ecosystems (Sky ~93.9%, Morpho Blue ~6.2%); plus dependency on Yearn V3's own vault-of-vaults accounting (bounded at 2 Yearn vault layers, 3 including MetaMorpho) |
| Criticality | Sky sUSDS critical (~89.6% of deployed funds, via both intermediate vaults); Yearn USDC MetaMorpho moderate (~6.2% via yvUSDC-1, deploys into Morpho Blue cbBTC/WBTC/wstETH lending under Yearn governance); Sky USDS Staking moderate (~4.3% via yvUSDS-1); same-team Yearn V3 dependency at both intermediate vaults |
| Quality | Top-tier: Sky $10M bounty, multi-billion sUSDS TVL; Morpho Blue audited by Cantina, Spearbit, ChainSecurity with $2.5M Immunefi bounty; same Yearn V3 framework throughout |

**Dependencies Score: 2.5 / 5** — Sky-ecosystem effective concentration (~93.9%) plus a two-layer vault-of-vaults dependency on Yearn V3 itself (three layers including the MetaMorpho vault). The ~6.2% Morpho Blue leg provides collateral diversification under the same Yearn governance. Both Sky and Morpho are top-tier protocols. The concentration still warrants 2.5, but the composition is now verified and understood.

**Centralization Score = (1.0 + 1.0 + 2.5) / 3 ≈ 1.5**

**Score: 1.5 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain DAI; deployed to Sky-ecosystem contracts via vault-of-vaults |
| Collateral quality | USDS / sUSDS / Sky Staking — all backed by Sky's over-collateralized loan book + RWA |
| Leverage | None |
| Verifiability | Fully on-chain across both vault layers |

**Score: 1.0 / 5** — top-tier.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain at every layer (ERC-4626 throughout) |
| Exchange rate | Programmatic, real-time at every layer |
| Reporting | Keeper-driven, 10-day profit unlock |
| Vault-of-vaults | Slightly increases the surface area to verify (need to read multiple vaults' totalAssets), but each layer is on-chain and independently verifiable |

**Score: 1.0 / 5** — excellent on-chain provability.

**Funds Management Score = (1.0 + 1.0) / 2 = 1.0**

**Score: 1.0 / 5** — outstanding on-chain provability and top-tier collateral throughout.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit pipeline | 2 vault layers + terminal Sky unstake / Yearn USDC withdraw (sUSDS withdraw or Spark Compounder unwind) |
| Liquidity depth | sUSDS multi-billion; PSM billions; Spark / Aave / Morpho deep |
| Large holder impact | $9.50M vault vs multi-billion underlying — negligible |
| Same-asset | DAI-denominated share token |
| Withdrawal restrictions | None — atomic redemption (multi-step within one transaction) |

**Score: 1.5 / 5** — highly liquid; only mild downward pressure from the 2-layer cascade.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Yearn — established 2020, public, named multisig signers |
| Vault management | Standard pattern across 37+ vaults |
| Documentation | Comprehensive, code verified on Etherscan |
| Legal | BORG (Cayman foundation) |
| Incident response | 4 historical V1 events, $200K Immunefi |
| Monitoring | Active hourly alerts, vault in monitored list |

**Score: 1.0 / 5** — top-tier operational maturity.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 1.5 | 30% | 0.450 |
| Funds Management | 1.0 | 30% | 0.300 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.325 → 1.3 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: Minimal Risk (1.3 / 5.0) — Approved, high confidence**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (November 2026) or annually
- **TVL-based:** Reassess if TVL exceeds $25M or changes by ±50%, or if the deposit limit is changed
- **Strategy posture:**
  - any new `addStrategy()` proposal at the Strategy Manager TimelockController for yvDAI-1 (would surface in the 7-day queue) — particularly if it reintroduces direct sDAI / Spark DAI Lender / Aave V3 DAI Lender exposure
  - the depositor allocation between yvUSDC-1 and yvUSDS-1 swings by more than ±20 percentage points from the current 73.19 / 26.81 split
- **Downstream rewiring (the dominant change vector at recent snapshots):**
  - if yvUSDC-1 reroutes materially away from its current `USDC to sUSDS Lender` strategy, yvDAI-1's effective endpoint mix changes accordingly — ~67.0 percentage points of the sUSDS share is inherited from yvUSDC-1
  - if yvUSDS-1 rewires its current 84.09 / 15.91 sUSDS Lender / Spark Compounder split, yvDAI-1's secondary exposure changes accordingly — ~22.6 percentage points of the sUSDS share and the entire ~4.3% USDS Staking share are inherited from yvUSDS-1
  - **Yearn USDC MetaMorpho:** reassess if the strategy's Morpho Blue market allocations change materially, if markets are added/removed from the supply queue, or if the guardian/curator changes. Current allocation: cbBTC ~74.7% / WBTC ~14.7% / wstETH ~10.7% of ~$2.15M TVL
  - **USDS Sky Rewards Compounder:** reassess if the new `USDS Sky Rewards Compounder` ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81), v3.0.3) replaces the existing `Spark USDS Compounder` in the yvUSDS-1 default queue and begins receiving meaningful debt
- **Vault-of-vaults composition:**
  - **reassess if a new strategy is added that creates a third Yearn-vault layer** (the cascade is currently 2 layers deep)
  - reassess if any of the two intermediate vaults (yvUSDC-1, yvUSDS-1) shuts down a strategy that holds yvDAI-1's deployed funds
- **Sky-specific:**
  - SSR drops below 2% (may indicate Sky-side stress)
  - PSM `tin` / `tout` set above 0.05% (activates Uniswap V3 fallback in the USDC depositor path)
  - SPK reward rate changes materially or USDS Staking Rewards is paused / migrated
  - DAI-USDS Exchanger pause
  - Spark Lend USDC market freeze / pause (no longer directly affects yvDAI-1 as the Spark USDC Lender has been replaced; see downstream rewiring note above)
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Sky / MakerDAO / Spark
- **Governance-based:** ySafe / Brain / Security signer or threshold changes; any change to the timelock delay (would itself require 7 days)

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER 1                                   │
│                                                                          │
│  ┌────────────────────────┐                                             │
│  │  yvDAI-1 (v3.0.2)      │                                             │
│  │  ERC-4626, immutable    │                                             │
│  │  0x028e…336c            │                                             │
│  │                         │                                             │
│  │  ~$9.50M DAI TVL        │                                             │
│  └───┬───────────────┬─────┘                                             │
│      │ 73.19%        │ 26.81%                                            │
│      ▼               ▼                                                    │
│  ┌────────────┐  ┌─────────────────┐                                    │
│  │ DAI→USDC-1 │  │ DAI→USDS        │                                    │
│  │ Depositor  │  │ Depositor       │                                    │
│  │ 0xfF03…f9B5│  │ 0xAeDF…b78d     │                                    │
│  └────┬───────┘  └────────┬────────┘                                    │
│       │                   │                                              │
│  ┌────▼─────────┐    ┌────▼──────────────────┐                          │
│  │ DAI→USDC     │    │ DAI→USDS              │                          │
│  │ via PSM Lite │    │ via DAI-USDS Exchanger│                          │
│  │ 1:1, 0 fee   │    │ 1:1, no fee           │                          │
│  └────┬─────────┘    └────┬──────────────────┘                          │
└───────┼───────────────────┼──────────────────────────────────────────────┘
        │                   │
        ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER 2 (TERMINAL Yearn layer)            │
│                                                                          │
│  ┌─────────────────────────────┐    ┌────────────────────────────┐      │
│  │  yvUSDC-1                   │    │  yvUSDS-1                  │      │
│  │  0xBe53…6204                │    │  0x1828…47E8               │      │
│  ～91.59% sUSDS Lender       │    │  84.09% sUSDS Lender       │      │
│  │   ~8.41% Yearn USDC          │    │  15.91% Spark USDS Compounder│    │
│  │  Spark USDC Lender: 0 USDC  │    │  USDS Sky Rewards: 0 USDS  │      │
│  │  USDS Depositor: 0 USDC     │    │  (Sky USDS Staking / SPK)  │      │
│  └─────────┬───────────────────┘    └─────────┬──────────────────┘      │
│            │                                   │                          │
│            ▼                                   ▼                          │
│   sUSDS (Sky Savings Rate)             sUSDS + Sky USDS Staking Rewards │
│   + Morpho Blue (cbBTC/WBTC/wstETH)    (SPK farm)                       │
└─────────────────────────────────────────────────────────────────────────┘

Effective endpoint mix for yvDAI-1's deployed DAI (July 12, 2026):
  ~89.6%  Sky sUSDS         (combined: yvUSDC-1→sUSDS Lender ~67.0% + yvUSDS-1→sUSDS Lender ~22.6%)
  ~6.2%   Morpho Blue        (via yvUSDC-1 → Yearn USDC MetaMorpho → Morpho Blue lending: cbBTC, WBTC, wstETH)
  ~4.3%   Sky USDS Staking   (via yvUSDS-1 → Spark USDS Compounder)
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — same timelock used by 37+ Yearn V3 vaults including all six mainnet risk-1 vaults. `getMinDelay() = 604800` (7 days).

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)`) |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | Sole proposer |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper: Brain (3/8) + deployer EOA can call `execute()` through it |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-8 Safe | Cancel pending proposals |

To shorten the delay, Daddy 6/9 must propose `updateDelay()`, wait 7 days during which Brain or Daddy can cancel, then execute. DEFAULT_ADMIN was never granted, so no party can self-grant PROPOSER or TIMELOCK_ADMIN to skip the flow.

---

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| May 11, 2026 | 1.3/5.0 | Initial assessment. yvDAI-1 with vault-of-vaults composition routing ~100% into Sky ecosystem via yvUSDC-1 (73%) and yvUSDS-1 (27%). Spark Lend USDC and sUSDS legs. |
| July 12, 2026 | 1.3/5.0 | Reassessment: TVL stable at ~$9.50M. yvUSDC-1 added new "Yearn USDC" strategy (8.41% tracked debt) — verified as a Yearn-curated Morpho MetaMorpho vault supplying USDC into Morpho Blue (cbBTC, WBTC, wstETH collateral, LLTV 86%). Old Spark USDC Lender replaced. yvUSDS-1 added v3.0.3 "USDS Sky Rewards Compounder" (currently near-zero debt). Sky-ecosystem concentration dropped from ~100% to ~93.9%. Effective endpoint mix: ~89.6% sUSDS / ~6.2% Morpho Blue / ~4.3% Sky USDS Staking. All governance roles, multisig thresholds, and timelock delay unchanged. Score unchanged at 1.3. |
