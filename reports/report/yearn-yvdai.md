# Protocol Risk Assessment: Yearn — yvDAI-1

- **Assessment Date:** May 11, 2026 (Updated: November 17, 2026)
- **Token:** yvDAI-1 (DAI-1 yVault)
- **Chain:** Ethereum
- **Token Address:** [`0x028eC7330ff87667b6dfb0D94b954c820195336c`](https://etherscan.io/address/0x028eC7330ff87667b6dfb0D94b954c820195336c)
- **Final Score: 1.72/5.0**

## Overview + Links

yvDAI-1 is a **DAI-denominated Yearn V3 vault** (ERC-4626) that deploys deposited DAI through a **vault-of-vaults composition**. At the November 17 snapshot, **72.85% routes through `DAI To USDC-1 Depositor` into yvUSDC-1**, and **27.15% routes through `DAI to USDS Depositor` into yvUSDS-1**. The default queue holds those 2 strategies. The `Savings Dai (sDAI)`, `Spark DAI Lender`, and `Aave V3 DAI Lender` strategies were removed between April 27 and May 5 and are revoked (`activation = 0`).

**Downstream composition:** **yvUSDC-1** deploys across four funded strategies: `stcUSD/USDC Pawn Broker Market` (33.34% of its debt, self-contained v3.0.4 lender, **not in the default withdrawal queue**), `Yearn USDC` (a Yearn-curated Morpho MetaMorpho vault, 32.66%), `USDC to USDS Depositor` (23.85%, into yvUSDS-1), and `USDC to sUSDS Lender` (10.15%). **yvUSDS-1** routes **100% of its debt through the `Grove USDS Compounder`** ([`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622), TokenizedStrategy v3.1.0), which stakes USDS in the Sky **USDS → GROVE** StakingRewards farm. Its `Spark USDS Compounder`, `sUSDS Lender`, and `USDS Sky Rewards Compounder` hold 0 debt.

**Pending timelocked additions to yvUSDC-1:** on November 16, 2026, the ySafe scheduled a Strategy Manager timelock batch ([tx](https://etherscan.io/tx/0xf2ac69b26faa0ebcffcf6bdc8ea20263ca70331dc28336121a053b0d180b63ac)) that adds two strategies to yvUSDC-1 outside the default queue: `Flex siUSD/USDC Lender` ([`0x774b9e40C571867cA5f5660D245467Ff631126ef`](https://etherscan.io/address/0x774b9e40C571867cA5f5660D245467Ff631126ef), `InfinifiFlexLenderStrategy`, max debt 10M USDC) and `USDC to yvUSDS-1 Depositor` ([`0xcb1Eb72F2a27E9EAD2e2Fb3F0AAC7E4Ee39F2EeB`](https://etherscan.io/address/0xcb1Eb72F2a27E9EAD2e2Fb3F0AAC7E4Ee39F2EeB), `USDCToUSDS`, v3.1.0, max debt 50M USDC). Both hold 0 assets. The batch becomes executable on November 23, 2026 at 16:39 UTC. Funding the first would add [infiniFi](./infinifi.md) (3.19/5.0) exposure.

The **`Yearn USDC`** strategy is a **Yearn-curated Morpho MetaMorpho vault** (verified on-chain). It supplies USDC into three Morpho Blue lending markets against cbBTC, WBTC, and wstETH collateral (LLTV 86% each, AdaptiveCurveIRM, ~88% utilization), plus a zero-balance idle market. Its current split is ~62.6% cbBTC / ~34.8% WBTC / ~2.7% wstETH of the 6.21M USDC MetaMorpho TVL; yvUSDC-1 holds ~95.9% of its shares. Security (4-of-7) is owner, the ySafe is guardian, a 2-of-3 Safe is curator, the timelock is 3 days, and the fee is 0%.

The **`stcUSD/USDC Pawn Broker Market`** is a **self-contained, single-borrower Yearn V3 TokenizedStrategy (v3.0.4)**. It lends USDC to one hard-coded borrower, the yvUSD stcUSD looper ([`0xd362efC75Ef1879f37A900823495f402CfdB0986`](https://etherscan.io/address/0xd362efC75Ef1879f37A900823495f402CfdB0986), 7.74x leverage, ~$0.90M equity), against **stcUSD** collateral (Cap's staked-USD ERC-4626 token, [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)) held on its own balance sheet. It does not route through Morpho Blue. Cap is a separate governance domain (3-of-5 anonymous Gnosis Safe → 24h Timelock, upgradeable UUPS proxies, 8 audits); see the [Cap stcUSD report](./cap-stcusd.md) (2.45/5.0). At the snapshot the strategy held 6,072,833.44 USDC of debt against 6,392,939.74 stcUSD collateral, with `currentLtv()` 87.08% against a 91.5% LLTV. Its idle USDC is 1 wei, and it is **not in yvUSDC-1's default withdrawal queue**. See the [yvUSDC-1 report](./yearn-yvusdc.md) for the oracle and liquidation mechanics.

**Effective endpoint mix for yvDAI-1's deployed DAI (November 17):**

| Endpoint | Path | Effective share |
|----------|------|----------------:|
| Sky **USDS → GROVE StakingRewards** | yvDAI-1 → yvUSDS-1 → Grove USDS Compounder (27.15%) **AND** yvDAI-1 → yvUSDC-1 → USDC to USDS Depositor → yvUSDS-1 → Grove USDS Compounder (17.37%) | **~44.5%** |
| **Cap stcUSD** (Pawn Broker lending) | yvDAI-1 → yvUSDC-1 → stcUSD/USDC Pawn Broker Market | **~24.3%** |
| **Morpho Blue** (cbBTC + WBTC + wstETH lending) | yvDAI-1 → yvUSDC-1 → Yearn USDC (Morpho MetaMorpho) | **~23.8%** |
| Sky **sUSDS** (Sky Savings Rate) | yvDAI-1 → yvUSDC-1 → USDC to sUSDS Lender | **~7.4%** |

The cascade is at most **two Yearn V3 vault layers deep** (three counting the MetaMorpho layer inside the Yearn USDC strategy, or the yvUSDC-1 → yvUSDS-1 hop through `USDC to USDS Depositor`). Sky-ecosystem contracts (GROVE farm + sUSDS) receive **~51.9%** of deployed DAI; the remaining ~48.1% splits between Cap stcUSD (~24.3%) and Morpho Blue (~23.8%).

**Key architecture:**

- **Vault:** Standard Yearn V3 vault (v3.0.2) accepting DAI deposits, issuing yvDAI-1 shares. Deployed as an immutable Vyper minimal proxy (EIP-1167) via the v3.0.2 Yearn V3 Vault Factory ([`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0))
- **Default queue (2 strategies, both funded):**
  - **DAI to USDS Depositor** ([`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d)) — 1,510,258.17 DAI (27.15%). DAI → USDS (Sky DAI-USDS Exchanger, 1:1, no fee) → yvUSDS-1 deposit. yvUSDS-1 routes **100% via the `Grove USDS Compounder`** into the Sky USDS → GROVE farm
  - **DAI To USDC-1 Depositor** ([`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5)) — 4,052,537.46 DAI (72.85%). DAI → USDC (Maker PSM Lite, 1:1 at 0% fee) → yvUSDC-1 deposit. yvUSDC-1 routes 33.34% via the `stcUSD/USDC Pawn Broker Market` (not in default queue), 32.66% via `Yearn USDC` (Morpho MetaMorpho), 23.85% via `USDC to USDS Depositor` into yvUSDS-1, and 10.15% via `USDC to sUSDS Lender`
- **Removed between April 27 and May 5:** Savings Dai (sDAI), Spark DAI Lender, Aave V3 DAI Lender — all previously zero-debt; revoked (`activation = 0`) at block 26435312
- **Governance:** Standard **Yearn V3 Role Manager** ([`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41)), whose `governance()` is the **7-day TimelockController** and whose immutable `chad` is the **Yearn 6-of-9 ySafe**. Strategy additions pass through the timelock. Brain (3-of-6) manages both depositor strategies without a timelock; see [Critical Permission Paths and Weakest Link](#critical-permission-paths-and-weakest-link)

**Key metrics (November 17, 2026, snapshot at block 26435312, hash [`0x13890e7e9fcec91745e0971a69f63c11cb87ccc1998bc00f623edacb242ae02a`](https://etherscan.io/block/26435312), timestamp 1794925103 = 14:18:23 UTC):**

- **TVL:** 5,562,795.63 DAI
- **Total Supply:** 4,892,839.80 yvDAI-1
- **Price Per Share:** 1.136926 DAI/yvDAI-1 (~13.69% cumulative appreciation over ~32 months, ~4.9% annualized)
- **Total Debt:** 5,562,795.63 DAI (100.00% deployed)
- **Total Idle:** 1 wei
- **Deposit Limit:** 50,000,000 DAI (enforced via `maxDeposit`, current remainder ~44.44M DAI)
- **Profit Max Unlock Time:** 10 days
- **Fees:** 0% management fee, 10% performance fee (Accountant `getVaultConfig`)

**Verified vault-of-vaults wiring (block 26435312):**

- `DAI To USDC-1 Depositor` ([`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5)) → yvUSDC-1 ([`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204)) via `VAULT()`; holds 3,602,058.67 yvUSDC-1 shares (4,055,528.76 USDC)
- `DAI to USDS Depositor` ([`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d)) → yvUSDS-1 ([`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8)) via `vault()`; holds 1,351,656.68 yvUSDS-1 shares (1,512,071.00 USDS)
- yvUSDC-1 (tracked debt 18,207,445.20 USDC): `stcUSD/USDC Pawn Broker Market` ([`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df), v3.0.4, max debt 10M USDC, **not in default queue**) 6,069,987.60 USDC (33.34%); `Yearn USDC` ([`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)) 5,946,904.37 USDC (32.66%); `USDC to USDS Depositor` ([`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52)) 4,342,046.92 USDC (23.85%); `USDC to sUSDS Lender` ([`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)) 1,848,506.31 USDC (10.15%); `Spark USDC Lender` ([`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a)) 0. The old Spark USDC Lender ([`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673)) is revoked (`activation = 0`). `use_default_queue() = true`
- yvUSDS-1 (tracked debt 8,609,309.44 USDS): `Grove USDS Compounder` ([`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622), v3.1.0, added via the timelock on September 21, 2026 — [tx](https://etherscan.io/tx/0xcb16d156c19a90e98a785d50dc8ca88b5a2297053e2d895f08d4e4091f6dad4d)) holds **100%**; `Spark USDS Compounder` ([`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)), `sUSDS Lender` ([`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)), and `USDS Sky Rewards Compounder` ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81)) each hold 0. yvDAI-1's depositor and yvUSDC-1's `USDC to USDS Depositor` together supply ~68.1% of yvUSDS-1's assets

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
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | Single instance for all category-1 vaults; `governance()` = Strategy Manager timelock, `chad()` = ySafe |
| Daddy / ySafe (Governance) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 Gnosis Safe |
| Brain (Operations) | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-6 Gnosis Safe; `management()` on both depositor strategies |
| Security | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 Gnosis Safe; `emergencyAdmin()` on both depositor strategies |
| Strategy Manager (Timelock) | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | TimelockController — **7-day delay** |
| Keeper | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | yHaaSRelayer — REPORTING only |
| Debt Allocator | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Minimal proxy — REPORTING + DEBT_MANAGER |

### Yearn V3 Infrastructure

| Contract | Address |
|----------|---------|
| Vault Factory (v3.0.2) | [`0x444045c5C13C246e117eD36437303cac8E250aB0`](https://etherscan.io/address/0x444045c5C13C246e117eD36437303cac8E250aB0) |
| Vault Original (v3.0.2) | [`0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467`](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467) |

### Active Strategies (2 in default queue, 2 with debt)

Default queue order at block 26435312 (`use_default_queue() = false`, `minimum_total_idle() = 0`):

| # | Strategy | Name | Activation | Current Debt (DAI) | Allocation |
|---|----------|------|------------|-------------------:|-----------:|
| 1 | [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | **DAI to USDS Depositor** (v3.0.3) | 2025-05-15 | **1,510,258.17** | **27.15%** |
| 2 | [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) | **DAI To USDC-1 Depositor** (v3.0.4) | 2025-10-24 | **4,052,537.46** | **72.85%** |

Both strategies have a 50M DAI `max_debt`. Last reports: DAI to USDS Depositor 2026-11-12 (`last_report = 1794455135`); DAI To USDC-1 Depositor 2026-11-11 (`last_report = 1794366767`). No `StrategyChanged` event was emitted on yvDAI-1 between blocks 25978217 and 26435312.

**Removed between April 27 and May 5 (revoked, `activation = 0`):**

- Savings Dai (sDAI) ([`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA)) — direct sDAI ERC-4626 wrapper from MakerDAO; previously zero debt
- Spark DAI Lender ([`0x1fd862499e9b9402DE6c599b6C391f83981180Ab`](https://etherscan.io/address/0x1fd862499e9b9402DE6c599b6C391f83981180Ab)) — direct supply into Spark Lend; previously zero debt
- Aave V3 DAI Lender ([`0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B`](https://etherscan.io/address/0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B)) — direct supply into Aave V3; previously zero debt

The rationale for removing all three direct-deposit fallbacks has not been independently verified. Reintroducing any of them would require a fresh `add_strategy()` proposal at the Strategy Manager TimelockController (7-day delay).

### Strategy Protocol Dependencies (effective)

After the vault-of-vaults unwind:

| Effective endpoint | Path | Effective share |
|--------------------|------|----------------:|
| **Sky USDS → GROVE StakingRewards** ([`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a)) | yvDAI-1 → yvUSDS-1 → `Grove USDS Compounder` (27.15%) **AND** yvDAI-1 → yvUSDC-1 → `USDC to USDS Depositor` → yvUSDS-1 → `Grove USDS Compounder` (17.37%) | **~44.5%** |
| **Cap stcUSD (Pawn Broker lending)** | yvDAI-1 → yvUSDC-1 → `stcUSD/USDC Pawn Broker Market` (self-contained, not in default queue) | **~24.3%** |
| **Morpho Blue lending** (cbBTC + WBTC + wstETH) | yvDAI-1 → yvUSDC-1 → `Yearn USDC` (Morpho MetaMorpho) | **~23.8%** |
| **Sky / sUSDS (Sky Savings Rate)** | yvDAI-1 → yvUSDC-1 → `USDC to sUSDS Lender` | **~7.4%** |
| **MakerDAO PSM Lite** (USDC ↔ DAI) | Used by `DAI To USDC-1 Depositor` for DAI → USDC conversion (and reverse on withdrawal) | High during routing |
| **Sky DAI-USDS Exchanger** (DAI ↔ USDS) | Used by `DAI to USDS Depositor` for DAI → USDS conversion (and reverse on withdrawal) | High during routing |
| **yvUSDC-1** (intermediate vault) | 72.85% of yvDAI-1 routes through it | Vault-of-vaults dependency |
| **yvUSDS-1** (intermediate vault) | 27.15% directly + ~17.4% via yvUSDC-1's `USDC to USDS Depositor` | Vault-of-vaults dependency |

Sky-ecosystem contracts receive **~51.9%** of deployed DAI (GROVE farm ~44.5% + sUSDS ~7.4%). The remaining ~48.1% splits between **Cap stcUSD** (~24.3%, via the self-contained stcUSD/USDC Pawn Broker Market that lends USDC against stcUSD collateral) and **Morpho Blue** (~23.8%, via the Yearn USDC MetaMorpho vault). The Pawn Broker strategy is **not in yvUSDC-1's default withdrawal queue**; see the [yvUSDC-1 report](./yearn-yvusdc.md) for that vault's queue detail. Percentages use each vault's tracked `current_debt`.

## Audits and Due Diligence Disclosures

### Yearn V3 Core Audits

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Statemind](https://github.com/yearn/yearn-security/blob/master/audits/20240301_Statemind_Yearn_V3.0.2/Yearn%20V3%20report.pdf) | May 2, 2024 | V3 Vaults (v3.0.0) | PDF |
| [ChainSecurity](https://github.com/yearn/yearn-security/tree/master/audits/20230504_ChainSecurity_Yearn_V3) | May 4, 2024 | V3 Vaults + Tokenized Strategy (v3.0.0) | 2 PDFs |
| [yAcademy](https://github.com/yearn/yearn-security/blob/master/audits/20230728_YAcademy_Yearn_V3.0.1/07-2023-Yearn-Vault-V3_yAcademy_Report.pdf) | Jun 2024 | V3 Vaults (v3.0.1) | PDF |

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
- **Morpho (Cantina):** active, **$2,500,000** max payout (Critical). https://cantina.xyz/bounties/35a5f0a1-2ffd-432c-8f3b-77d169add8c3
- **Cap (Sherlock):** active, **$1,000,000** max payout (Critical only). See [Cap stcUSD report](./cap-stcusd.md)
- **Safe Harbor (SEAL):** Yearn is **not** listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The yvDAI-1 system is **moderately complex** because of the vault-of-vaults composition:

- **2 funded strategies**, both depositors into other Yearn V3 vaults
- **Conversion hops:**
  - `DAI To USDC-1 Depositor`: DAI → USDC (PSM Lite) → yvUSDC-1 → (33.34%) USDC into stcUSD/USDC Pawn Broker Market / (32.66%) USDC into Yearn USDC MetaMorpho / (23.85%) USDC into USDC to USDS Depositor → yvUSDS-1 / (10.15%) USDC into sUSDS Lender
  - `DAI to USDS Depositor`: DAI → USDS (Exchanger) → yvUSDS-1 → (100%) USDS into Grove USDS Compounder → Sky USDS → GROVE StakingRewards
- **Two layers of Yearn V3 vault accounting** on the direct paths (yvDAI-1 → yvUSDC-1 or yvDAI-1 → yvUSDS-1), and three on the yvDAI-1 → yvUSDC-1 → yvUSDS-1 path through yvUSDC-1's `USDC to USDS Depositor`
- **No leverage at the yvDAI-1 layer and no cross-chain bridging.** Downstream, the Pawn Broker lends to a single borrower that runs a 7.74x stcUSD loop
- **Standard ERC-4626** at every layer
- **Vault is immutable** (non-upgradeable Vyper minimal proxy)

The vault-of-vaults composition is **not leverage** but is a real complexity surface — a bug or accounting issue at any layer cascades. Each layer is itself ERC-4626 and on-chain verifiable.

## Historical Track Record

- **Vault deployed:** March 12, 2024 (deployment [tx](https://etherscan.io/tx/0xfc6be986a2e60849a91c397c5c4bd10d9b247f0e1fb30cdaf0ed1f7687ea648e)) — **~32 months** in production
- **TVL:** 5,562,795.63 DAI at November 17, 2026 — well within the 50M DAI deposit limit (current remainder ~44.44M DAI via `maxDeposit`). Onchain `totalAssets()` samples: 7.42M DAI (September 18), 7.30M (October 3), 6.76M (October 18), 5.73M (November 2), 5.55M (November 10)
- **PPS trend:** 1.000000 → 1.136926 (~13.69% cumulative return over ~32 months, ~4.9% annualized); PPS rose at every sample above
- **Security incidents:** None known for this vault or for the Yearn V3 framework
- **Strategy changes:** active management. Between April 27 and May 5, three direct-deposit fallbacks (sDAI, Spark DAI Lender, Aave V3 DAI Lender) were removed from the default queue and revoked. The depositor allocation was 73.19 / 26.81 (USDC / USDS) on July 12, 71.16 / 28.84 on September 14, and **72.85 / 27.15** on November 17, 2026
- **Vault-of-vaults rewiring (downstream):**
  - **May 2026 – September 14:** yvUSDC-1 moved from Spark Lend and sUSDS strategies to a four-strategy mix that added the `Yearn USDC` MetaMorpho vault and the self-contained `stcUSD/USDC Pawn Broker Market` ([`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df), v3.0.4, not in default queue). yvUSDS-1 drained its `sUSDS Lender` on August 22 and routed 100% through `Spark USDS Compounder`
  - **September 21–22, 2026:** the `Grove USDS Compounder` was added to yvUSDS-1 through the 7-day timelock ([tx](https://etherscan.io/tx/0xcb16d156c19a90e98a785d50dc8ca88b5a2297053e2d895f08d4e4091f6dad4d)) and received most of yvUSDS-1's debt; by November 17 it held 100%
  - **November 17, 2026:** effective endpoint mix ~44.5% Sky USDS → GROVE farm / ~24.3% Cap stcUSD (Pawn Broker) / ~23.8% Morpho Blue / ~7.4% sUSDS
- **Governance Safe changes:** Brain removed two owners on October 15, 2026 ([tx](https://etherscan.io/tx/0xfcc529cfb0a85204a137315423f15f8a4a59fa4ad0b26d0603e9e0892d091065)), leaving 3-of-6. Security replaced two owners on October 23, 2026 ([tx](https://etherscan.io/tx/0xd0e13ca9737cfbfaf7cacf770289e437ecedd6ee870565e0e778583ac5045767)), keeping 4-of-7. The ySafe replaced one owner on November 16, 2026 ([tx](https://etherscan.io/tx/0xf2ac69b26faa0ebcffcf6bdc8ea20263ca70331dc28336121a053b0d180b63ac)), keeping 6-of-9
- **Yearn V3 track record:** V3 framework has been live since May 2024 (~30 months). No V3 vault exploits

**Yearn protocol TVL:** ~$132.65M total across all chains ([DeFiLlama](https://defillama.com/protocol/yearn-finance), November 17, 2026), down from ~$157.10M on November 5.

**Sky / sUSDS / StakingRewards track record:** see the [yvUSDS-1 report](./yearn-yvusds.md) for the underlying-protocol details — yvDAI-1 inherits the same dependency profile via the depositor strategies.

## Funds Management

yvDAI-1 deploys 100% of its DAI (idle is 1 wei) via two depositor strategies. The deployed DAI terminates across three ecosystems: Sky (~51.9%, split between the USDS → GROVE farm and sUSDS), Cap (~24.3%, via the stcUSD/USDC Pawn Broker Market), and Morpho Blue (~23.8%, via the Yearn USDC MetaMorpho).

### Strategy 1: DAI To USDC-1 Depositor (72.85% allocation)

**Contract:** [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) (`DAIToUSDC`, TokenizedStrategy v3.0.4, [verified source](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5#code)) — immutable `VAULT()` = [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) (yvUSDC-1); immutable `DEPOSITOR()` = yvDAI-1.

**Pipeline:**

1. **DAI → USDC** via MakerDAO PSM Lite ([`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042)) — 1:1 at **0% fee** (`tin = tout = 0`). `availableDepositLimit()` returns 0 unless both fees are 0
2. **USDC → yvUSDC-1** deposit (ERC-4626)
3. yvUSDC-1 routes 33.34% to the self-contained `stcUSD/USDC Pawn Broker Market` ([`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df), v3.0.4, not in default queue), which lends USDC to the yvUSD stcUSD looper against stcUSD collateral; 32.66% to `Yearn USDC` ([`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3)), a Yearn-curated Morpho MetaMorpho vault supplying USDC into three Morpho Blue markets (cbBTC, WBTC, wstETH collateral; LLTV 86%; AdaptiveCurveIRM); 23.85% to `USDC to USDS Depositor` ([`0x39c0aEc5738ED939876245224aFc7E09C8480a52`](https://etherscan.io/address/0x39c0aEc5738ED939876245224aFc7E09C8480a52)) into yvUSDS-1; and 10.15% to `USDC to sUSDS Lender` ([`0x7130570BCEfCedBe9d15B5b11A33006156460f8f`](https://etherscan.io/address/0x7130570BCEfCedBe9d15B5b11A33006156460f8f)) → sUSDS. The `Spark USDC Lender` ([`0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a`](https://etherscan.io/address/0x654a7c4Ae5ac3C853a99F8dbEAD2bC85090F753a)) holds 0 debt; the old one at [`0x25f893276544d86a82b1ce407182836F45cb6673`](https://etherscan.io/address/0x25f893276544d86a82b1ce407182836F45cb6673) is revoked

**Withdrawal:** reverse path. The user's `redeem` on yvDAI-1 triggers `withdraw` from this strategy → `redeem` from yvUSDC-1 → `withdraw` from yvUSDC-1's downstream (queue order: USDC to USDS Depositor, sUSDS Lender, Yearn USDC MetaMorpho → Morpho Blue, Spark USDC Lender; the Pawn Broker is outside the default queue) → unwind into USDC → DAI via PSM. All atomic in the same transaction. At the snapshot, yvUSDC-1's `maxWithdraw()` for this strategy covered its full 4,055,528.76 USDC position.

**Strategy parameters (block 26435312):**
- Activated: 2025-10-24; last reported 2026-11-11 (`last_report = 1794366767`)
- `management()` = Brain (3-of-6); `emergencyAdmin()` = Security (4-of-7); `keeper()` = yHaaSRelayer; `performanceFee()` = 0
- `maxAcceptableFeeOutPSM()` = 0.05% + 1 wei (`500000000000001`): if the PSM `tout` reaches this value, `_freeFunds()` swaps USDC → DAI on Uniswap V3 (router [`0xE592427A0AEce92De3Edee1F18E0157C05861564`](https://etherscan.io/address/0xE592427A0AEce92De3Edee1F18E0157C05861564), DAI/USDC 0.01% pool [`0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168`](https://etherscan.io/address/0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168)) instead of the PSM
- `swapSlippageBPS()` = 50 (0.5% minimum-output tolerance against a fixed 1:1 reference)
- Both values are management-settable without a timelock (`setMaxAcceptableFeeOutPSM()` accepts 0, which forces the Uniswap route; `setSwapSlippageBPS()` accepts up to 10,000). See [Critical Permission Paths and Weakest Link](#critical-permission-paths-and-weakest-link)
- Health check: `doHealthCheck()` = true, `lossLimitRatio()` = 0, `profitLimitRatio()` = 10,000

### Strategy 2: DAI to USDS Depositor (27.15% allocation)

**Contract:** [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) (`USDSFarmerDAI`, TokenizedStrategy v3.0.3, [verified source](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d#code)) — immutable `vault()` = [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) (yvUSDS-1).

**Pipeline:**

1. **DAI → USDS** via Sky DAI-USDS Exchanger ([`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A), a `constant` in the strategy) — 1:1, no fee
2. **USDS → yvUSDS-1** deposit (ERC-4626)
3. yvUSDS-1 routes **100% to its `Grove USDS Compounder`** ([`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622), v3.1.0), which stakes 8,613,089.76 USDS in the Sky USDS → GROVE StakingRewards farm ([`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a)) and sells GROVE rewards for USDS through a Yearn auction. The farm holds 131.12M USDS, pays 38.84 GROVE/s through a reward period ending November 22, 2026, and is not paused. Its `withdraw()` is not gated by the pause flag. yvUSDS-1's `Spark USDS Compounder` ([`0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3`](https://etherscan.io/address/0xc9f01b5c6048B064E6d925d1c2d7206d4fEeF8a3)), `sUSDS Lender` ([`0x3F2dE801629116A83B9734bB72012A554e01CfC1`](https://etherscan.io/address/0x3F2dE801629116A83B9734bB72012A554e01CfC1)), and `USDS Sky Rewards Compounder` ([`0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81`](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81)) hold 0 debt. See the [yvUSDS-1 report](./yearn-yvusds.md) for the Grove strategy and farm details

**Withdrawal:** reverse path. The user's `redeem` on yvDAI-1 triggers `withdraw` from this strategy → `redeem` from yvUSDS-1 → unstake from the GROVE farm via the Grove USDS Compounder → USDS → DAI via the Exchanger. All atomic in the same transaction.

**Strategy parameters (block 26435312):**
- Activated: 2025-05-15; last reported 2026-11-12 (`last_report = 1794455135`)
- `management()` = Brain (3-of-6); `emergencyAdmin()` = Security (4-of-7); `keeper()` = yHaaSRelayer; `performanceFee()` = 0
- No swap route or slippage parameter: both conversions use the hard-coded Exchanger at 1:1

### Removed from default queue (between April 27 and May 5)

- **Savings Dai (sDAI)** ([`0x83F20F44975D03b1b09e64809B757c47f942BEeA`](https://etherscan.io/address/0x83F20F44975D03b1b09e64809B757c47f942BEeA)) — direct ERC-4626 wrapper from MakerDAO; previously zero debt
- **Spark DAI Lender** ([`0x1fd862499e9b9402DE6c599b6C391f83981180Ab`](https://etherscan.io/address/0x1fd862499e9b9402DE6c599b6C391f83981180Ab)) — direct supply into Spark Lend; previously zero debt
- **Aave V3 DAI Lender** ([`0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B`](https://etherscan.io/address/0x9BF50e7589a562da2ecC0a87e2597EFBDBde241B)) — direct supply into Aave V3; previously zero debt

All three are revoked (`strategies(address).activation = 0`). Reintroducing any of them requires a fresh `add_strategy()` proposal at the Strategy Manager TimelockController (7-day delay). Rationale for the removals has not been independently verified.

### Accessibility

- **Deposits:** Permissionless ERC-4626. Subject to 50M DAI deposit limit
- **Withdrawals:** ERC-4626. Atomic, but unwinds through up to three vault layers + Sky farm / sUSDS / Morpho exits
- **No cooldown or lock period**
- **Fees:** 0% management, 10% performance
- **Profit unlock:** 10 days

### Collateralization

- **100% on-chain DAI backing.** All deposits are DAI; deployed DAI terminates across Sky (GROVE farm + sUSDS), Morpho Blue, and the Cap stcUSD Pawn Broker. The PSM and Exchanger unwind at 1:1 while the PSM `tout` stays below the 0.05% threshold
- **Collateral quality:** the GROVE farm holds staked USDS; sUSDS is backed by Sky's over-collateralized loan book + RWA Treasury bills; the Morpho Blue leg is over-collateralized isolated lending against cbBTC / WBTC / wstETH; the Pawn Broker leg lends USDC to one 7.74x-levered borrower against **stcUSD** (Cap) collateral at 87.08% LTV (91.5% LLTV) — a newer protocol (3-of-5 anonymous multisig, upgradeable UUPS proxies, 8 audits, score 2.45/5.0). See the [Cap stcUSD report](./cap-stcusd.md)
- **No leverage at the yvDAI-1 layer** — the vault-of-vaults composition is not leverage. The Pawn Broker's only borrower is the levered stcUSD looper owned by yvUSD; see the [yvUSD report](./yearn-yvusd.md)
- **All positions are redeemable** via the reverse pipeline, but the Pawn Broker strategy (~24.3% effective) is **not in yvUSDC-1's default withdrawal queue** and holds 1 wei of idle USDC; releasing it requires a Brain `callDebt()` and up to a 7-day repayment window

### Provability

- **PPS:** ERC-4626, fully algorithmic
- **Strategy `totalAssets()`:** reads the underlying yvUSDC-1 / yvUSDS-1 share balance and converts via ERC-4626 `convertToAssets()` — fully on-chain, real-time
- **Multi-layer verification:** anyone can independently verify yvDAI-1 → yvUSDC-1 → (sUSDS Lender / Yearn USDC MetaMorpho → Morpho Blue / stcUSD Pawn Broker / USDC to USDS Depositor → yvUSDS-1) and yvDAI-1 → yvUSDS-1 → Grove USDS Compounder on-chain. Each layer's exchange rate is its own ERC-4626 calculation
- **Profit / loss reporting:** keepers via `process_report()`, profits unlock over 10 days

The vault-of-vaults adds a small surface area to verify (multiple `totalAssets()` reads) but does not add any off-chain dependency.

## Liquidity Risk

- **Primary exit:** Redeem yvDAI-1 for DAI via ERC-4626 `withdraw()` / `redeem()`. Triggers reverse pipeline through yvUSDC-1 / yvUSDS-1 (atomic, multi-step in the same transaction)
- **Deep underlying:** the USDS → GROVE farm holds 131.12M USDS staked and unstaking returns the strategy's own USDS; sUSDS holds multi-billion TVL; Morpho Blue cbBTC / WBTC / wstETH markets were ~88% utilized at the snapshot. yvDAI-1's ~$5.56M is a small fraction of underlying capacity
- **PSM liquidity:** MakerDAO PSM Lite provides deep DAI ↔ USDC liquidity at 1:1, 0% fee. PSM capacity is managed by Sky governance and typically holds billions of USDC
- **Cascading withdrawal mechanics:** both depositor paths traverse **two Yearn V3 vault layers** (yvDAI-1 → yvUSDC-1 or yvDAI-1 → yvUSDS-1) plus the terminal exit (GROVE farm unstake, sUSDS withdrawal, Morpho Blue redemption, or the yvUSDC-1 → yvUSDS-1 hop). The Yearn USDC path adds a MetaMorpho layer. All steps execute atomically in the same transaction
- **Pawn Broker queue gap:** the `stcUSD/USDC Pawn Broker Market` (33.34% of yvUSDC-1, ~24.3% of yvDAI-1 effective deployment) is **not in yvUSDC-1's default withdrawal queue**, and yvUSDC-1 has `use_default_queue() = true`. Its idle USDC is 1 wei. A standard redemption draws on yvUSDC-1's queued strategies (~12.14M USDC at the snapshot, covering this depositor's full 4.06M USDC position); the Pawn Broker position needs a Brain `callDebt()` and up to 7 days for repayment
- **No DEX liquidity needed** while PSM fees stay below 0.05% — exit is via Sky's own contracts (PSM, Exchanger, sUSDS, StakingRewards), Morpho Blue redemption, and Yearn vault redemptions
- **Same-value asset:** DAI-denominated vault token — no price-divergence risk
- **No withdrawal queue or cooldown** — atomic redemption
- **Deposit limit:** 50M DAI cap vs ~$5.56M TVL (room for ~+799%)

The cascading multi-layer withdrawal is atomic but has a higher gas cost than a single-strategy vault. The Pawn Broker being outside yvUSDC-1's default queue is the main liquidity nuance — a tail risk under vault-wide redemption stress, not a blocker for ordinary yvDAI-1 exits.

## Centralization & Control Risks

### Governance

Vault roles at block 26435312, read with `roles(address)` for every account that appears in a `RoleSet` event since deployment:

| Position | Address | Threshold | Roles on Vault |
|----------|---------|-----------|----------------|
| **Daddy (ySafe)** | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | 6-of-9 | `16374` (`0x3FF6`): all except ADD_STRATEGY and ACCOUNTANT |
| **Brain** | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | 3-of-6 | `14706` (`0x3972`): REVOKE_STRATEGY, QUEUE, REPORTING, DEBT, DEPOSIT_LIMIT, PROFIT_UNLOCK, DEBT_PURCHASER, EMERGENCY |
| **Security** | [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) | 4-of-7 | `8384` (`0x20C0`): DEBT, MAX_DEBT, EMERGENCY |
| **Strategy Manager (Timelock)** | [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) | 7-day delay | `143` (`0x8F`): ADD_STRATEGY, REVOKE_STRATEGY, FORCE_REVOKE, ACCOUNTANT, MAX_DEBT |
| **Keeper** | [`0x604e586F17cE106B64185A7a0d2c1Da5bAce711E`](https://etherscan.io/address/0x604e586F17cE106B64185A7a0d2c1Da5bAce711E) | Bot | `32`: REPORTING only |
| **Debt Allocator** | [`0x1e9eB053228B1156831759401dE0E115356b8671`](https://etherscan.io/address/0x1e9eB053228B1156831759401dE0E115356b8671) | Bot | `96`: REPORTING + DEBT |

Three other historical `RoleSet` accounts ([`0x52605BbF54845f520a3E94792D019f62407db2f8`](https://etherscan.io/address/0x52605BbF54845f520a3E94792D019f62407db2f8), [`0xc2d26d13582324f10c7c3753B8F5Fc71011EcF57`](https://etherscan.io/address/0xc2d26d13582324f10c7c3753B8F5Fc71011EcF57), [`0xc46D9286Cf830cC2e602e6D5F005455dF9961b4A`](https://etherscan.io/address/0xc46D9286Cf830cC2e602e6D5F005455dF9961b4A)) and the Role Manager itself hold `0`. No `RoleSet` event was emitted between blocks 25978217 and 26435312. The vault's `role_manager()` is the Role Manager and `future_role_manager()` is `0x0`.

The ySafe's 6-of-9 signers include publicly known DeFi contributors — see [Yearn Multisig Info](https://docs.yearn.fi/developers/security/multisig). Owner sets changed since September 14: Brain removed two owners (3-of-8 → 3-of-6), Security replaced two owners, and the ySafe replaced one owner; see [Historical Track Record](#historical-track-record). Two Brain owners also sign Security (one did at September 14); no ySafe owner signs Brain or Security.

**Properties:**

1. **No EOA holds vault roles directly**
2. **Strategy additions and accountant changes pass through the 7-day timelock.** The Role Manager's `governance()` is also the timelock
3. **Self-governed timelock** — TIMELOCK_ADMIN belongs to the timelock itself
4. **Vault contract is immutable** — Vyper minimal proxy; strategies are not upgradeable (TokenizedStrategy address is a constant)
5. **Untimelocked strategy management:** Brain is `management()` on both depositor strategies and can change the DAI To USDC-1 Depositor's swap parameters without delay
6. **Same governance pattern across 37+ vaults**

### Critical Permission Paths and Weakest Link

Material loss means loss of depositors' DAI. The inventory covers yvDAI-1, its Role Manager and timelock, and both depositor strategies, using verified source for the [vault](https://etherscan.io/address/0x1ab62413e0cf2eBEb73da7D40C70E7202ae14467#code), [Role Manager](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41#code), [`DAIToUSDC`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5#code), and [`USDSFarmerDAI`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d#code).

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| Force a lossy USDC → DAI swap: `DAIToUSDC.setMaxAcceptableFeeOutPSM(0)` + `setSwapSlippageBPS(10000)`, then `emergencyWithdrawDirect(shares, false, max)` or any `_freeFunds()` call | Brain (3-of-6) as strategy `management()`; `setPendingManagement()` lets Brain hand this to another address | None beyond the Safe threshold: no timelock, no cap, no rate limit. A 10,000 bps slippage makes the minimum output 0. The 1:1 reference cannot be manipulated, but its tolerance is set by the caller. The swap uses the Uniswap V3 DAI/USDC 0.01% pool, which held ~607K DAI and ~394K USDC at the snapshot | The full 4,052,537.46 DAI position (72.85% of TVL); yvUSDC-1's `maxWithdraw()` covered all 4,055,528.76 USDC |
| Swap at the current 0.5% tolerance: `DAIToUSDC.emergencyWithdrawDirect(shares, false, max)` | Security (4-of-7) as `emergencyAdmin()`, or Brain | Minimum output fixed at 99.5% by `swapSlippageBPS = 50`, which only Brain can change | Up to ~0.5% of the swapped amount per call (~$20K on the full position) |
| Grant itself ADD_STRATEGY without the timelock: Role Manager `removeVault(yvDAI-1)` calls `transfer_role_manager(chad)`; the ySafe then calls `accept_role_manager()` and `set_role()` | Brain (3-of-6) to call `removeVault`, **plus** the ySafe (6-of-9, immutable `chad`) to accept | Two Safes must act; no delay. `RemovedVault` and `UpdateRoleManager` events are visible only at execution | All 5,562,795.63 DAI (add a malicious strategy, raise its max debt, move debt) |
| Write off a strategy's debt: vault `force_revoke_strategy()` | ySafe (6-of-9) directly; also the timelock | No delay for the ySafe. Funds stay in the strategy, but the vault records the full debt as a loss; re-adding needs the 7-day timelock | Accounting loss of up to 72.85% (USDC depositor) or 27.15% (USDS depositor) for holders who exit before recovery |
| Add a strategy and fund it: vault `add_strategy()`, `update_max_debt_for_strategy()`, `update_debt()` | Strategy Manager timelock (ySafe sole proposer) | 7-day delay; ySafe or Brain can cancel; `getMinDelay() = 604800` | All 5,562,795.63 DAI |
| Change Role Manager positions or governance: `setPositionRoles()`, `setPositionHolder()`, `transferGovernance()` | Role Manager `governance()` = timelock | 7-day delay; 2-step governance transfer | Indirect: future role grants |
| Move debt between approved strategies: vault `update_debt()` | Brain, Security, ySafe, Debt Allocator | Only the two approved depositors; each capped at 50M DAI `max_debt` | No direct loss; routes funds into the paths above |
| Change the USDS depositor | Brain (management) on `USDSFarmerDAI` | Exchanger and target vault are constants; no swap or slippage parameter | None found beyond shutdown and emergency withdrawal back to DAI |

**Weakest credible path to material loss:** **Brain (3-of-6)** can, without a timelock, call `setMaxAcceptableFeeOutPSM(0)` and `setSwapSlippageBPS(10000)` on the DAI To USDC-1 Depositor ([source](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5#code)), then call `emergencyWithdrawDirect(shares, false, type(uint256).max)`. That redeems the yvUSDC-1 position and sells the USDC on the Uniswap V3 DAI/USDC 0.01% pool with zero minimum output. The pool held ~$1.0M at the snapshot, far less than the 4.06M USDC position, so most of the value can be lost to price impact or captured by a sandwich. No code bounds the loss: the slippage setter is the same Safe that triggers the swap. The strategy health check (`lossLimitRatio = 0`) only blocks the next `report()`, and management can disable it. Exposure is the strategy's 4,052,537.46 DAI, 72.85% of yvDAI-1. Brain has 3 signers, so the critical gate does not apply, but this is the least protected material path. The next weakest path, the Role Manager handover, also needs the ySafe's 6-of-9 approval. **TODO:** the same Brain-held slippage and liquidation powers on yvUSDC-1's and yvUSDS-1's strategies (e.g. Pawn Broker `liquidate()`, which only Brain may call) are not re-enumerated here; see the [yvUSDC-1](./yearn-yvusdc.md) and [yvUSDS-1](./yearn-yvusds.md) reports.

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
| **yvUSDC-1** (intermediate vault) | Critical — 72.85% of deployed funds route through it | Same governance, audits, code as yvDAI-1. Two strategies (infiniFi `Flex siUSD/USDC Lender`, `USDC to yvUSDS-1 Depositor`) are scheduled for addition, executable November 23, 2026. See [yvUSDC-1 report](./yearn-yvusdc.md) |
| **yvUSDS-1** (intermediate vault) | Critical — 27.15% direct + ~17.4% via yvUSDC-1 | Same governance, audits, code. See [yvUSDS-1 report](./yearn-yvusds.md) |
| **Sky USDS → GROVE StakingRewards** (via Grove USDS Compounder) | Critical — ~44.5% of effective deployment | Sky Endgame `StakingRewards`, deployed June 2026, owned by Sky `DSPauseProxy` (48h GSM); `withdraw()` not pausable. Grove USDS Compounder runs on TokenizedStrategy v3.1.0 and has held yvUSDS-1 debt since September 21, 2026. **TODO:** no audit artifact for the `GroveCompounder` contract was located (per the yvUSDS-1 report) |
| **Cap stcUSD (Pawn Broker)** | High — ~24.3% of effective deployment (via yvUSDC-1) | Single-borrower Yearn V3 TokenizedStrategy (v3.0.4) lending USDC to the yvUSD stcUSD looper (7.74x) against stcUSD collateral at 87.08% LTV, **not in yvUSDC-1's default withdrawal queue**. Cap: 3-of-5 anonymous multisig → 24h timelock, upgradeable UUPS proxies, 8 audits, in production since August 2025. See [Cap stcUSD report](./cap-stcusd.md) (2.45/5.0) |
| **Morpho Blue** (via Yearn USDC MetaMorpho) | High — ~23.8% of effective deployment (via yvUSDC-1) | Yearn-curated Morpho MetaMorpho vault supplying USDC into Morpho Blue (cbBTC, WBTC, wstETH collateral; LLTV 86%; AdaptiveCurveIRM). Security owner, ySafe guardian, 3-day timelock. Morpho Blue audited by Cantina, Spearbit, ChainSecurity |
| **Sky / sUSDS** (Sky Savings Rate) | Moderate — ~7.4% of effective deployment (via yvUSDC-1) | Multi-billion sUSDS TVL, $10M Immunefi bounty. SSR ~3.80% APY at the snapshot |
| **MakerDAO PSM Lite** | High during routing (used by yvUSDC-1 path) | 1:1, 0% fee, audited |
| **Sky DAI-USDS Exchanger** | High during routing (used by yvUSDS-1 path) | 1:1, no fee, audited |
| **DAI / USDS / USDC tokens** | Critical | Inherited from each conversion hop |

**Dependency quality:** Sky / MakerDAO infrastructure and Morpho Blue are top-tier (Sky: $10M Immunefi bounty, multi-billion sUSDS TVL; Morpho Blue: audited by Cantina, Spearbit, ChainSecurity). The largest single endpoint is now a ~5-month-old Sky StakingRewards farm reached through a ~2-month-old Yearn strategy; principal is staked USDS, so GROVE price affects yield only. Cap (stcUSD) is younger and has weaker governance (3-of-5 anonymous multisig, upgradeable UUPS proxies, 8 audits, score 2.45/5.0), and the Pawn Broker's only borrower is a levered looper. Effective deployment spans three ecosystems — Sky ~51.9%, Cap ~24.3%, Morpho Blue ~23.8%. The vault-of-vaults still concentrates dependency on Yearn V3's own vault accounting working correctly across two or three vault layers.

## Operational Risk

- **Team:** Yearn Finance — established 2020, public contributors, named multisig signers
- **Vault management:** Standard Yearn V3 Role Manager pattern shared across 37+ vaults
- **Documentation:** Comprehensive Yearn V3 documentation. All strategy code verified on Etherscan
- **Legal:** Yearn BORG via [YIP-87](https://gov.yearn.fi/t/yip-87-convert-ychad-eth-into-a-borg/14540)
- **Incident response:** 4 historical V1 events handled. V3 framework not yet stress-tested by an exploit
- **V3 immutability:** vault cannot be upgraded — eliminates proxy upgrade risk but means a critical bug requires deploying a new vault
- **Vault-of-vaults operational consideration:** because yvDAI-1's funded strategies all depend on yvUSDC-1 / yvUSDS-1 being healthy, an emergency action on either upstream vault (e.g. shutdown, deposit pause) directly impacts yvDAI-1
- **Signer changes:** all three Yearn Safes changed owners between October 15 and November 16, 2026, with thresholds unchanged; Brain now needs 3 of 6 signatures

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
| DAI to USDC-1 Depositor | [`0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5`](https://etherscan.io/address/0xfF03Dce6d95aa7a30B75EFbaFD11384221B9f9B5) | `totalAssets()`, `isShutdown()`, keeper report, `swapSlippageBPS()` (50), `maxAcceptableFeeOutPSM()` (0.05% + 1 wei), `management()`, `pendingManagement()` |
| DAI to USDS Depositor | [`0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d`](https://etherscan.io/address/0xAeDF7d5F3112552E110e5f9D08c9997Adce0b78d) | `totalAssets()`, `isShutdown()`, keeper report, `management()` |
| yvUSDC-1 (upstream dependency) | [`0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204`](https://etherscan.io/address/0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204) | PPS, shutdown state, strategy queue, `StrategyChanged` (pending infiniFi Flex and USDC to yvUSDS-1 Depositor additions, executable November 23, 2026) |
| yvUSDS-1 (upstream dependency) | [`0x182863131F9a4630fF9E27830d945B1413e347E8`](https://etherscan.io/address/0x182863131F9a4630fF9E27830d945B1413e347E8) | PPS, shutdown state, strategy queue |
| Yearn USDC (Morpho MetaMorpho) | [`0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3`](https://etherscan.io/address/0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3) | `totalAssets()`, `totalSupply()`, `supplyQueue()`, Morpho Blue market utilization rates |
| stcUSD/USDC Pawn Broker Market | [`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df) | `totalAssets()`, `totalIdle()`, stcUSD `balanceOf(address)`, queue membership (not in default queue) — self-contained Yearn V3 v3.0.4 lending strategy |
| stcUSD (Cap) Vault | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | PPS (`convertToAssets(1e18)`), ERC-1967 implementation slot (upgradeable UUPS proxy) — collateral asset in the Pawn Broker |
| Grove USDS Compounder | [`0xe060B80438771f13078048c3b0d930efECA6E622`](https://etherscan.io/address/0xe060B80438771f13078048c3b0d930efECA6E622) | `totalAssets()` vs yvUSDS-1 `current_debt` (100% of yvUSDS-1), `isShutdown()`, `lastReport()` |
| Sky USDS → GROVE farm | [`0x4E41488C19cD35EB4de3083Fc3e204854c75c86a`](https://etherscan.io/address/0x4E41488C19cD35EB4de3083Fc3e204854c75c86a) | `totalSupply()`, `rewardRate()`, `periodFinish()` (November 22, 2026 at snapshot), `paused()` |
| MakerDAO PSM Lite | [`0xf6e72Db5454dd049d0788e411b06CfAF16853042`](https://etherscan.io/address/0xf6e72Db5454dd049d0788e411b06CfAF16853042) | `tin`, `tout` (fee parameters) |
| Sky DAI-USDS Exchanger | [`0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A`](https://etherscan.io/address/0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A) | `dai()` / `usds()` mapping integrity; no on-chain `live()` getter — pause is via upstream Sky governance (`cage`) |
| ySafe (Daddy) | [`0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52`](https://etherscan.io/address/0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52) | Signer / threshold changes |
| Brain | [`0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7`](https://etherscan.io/address/0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7) | Signer / threshold changes (3-of-6) |
| Yearn V3 Role Manager | [`0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41`](https://etherscan.io/address/0xb3bd6B2E61753C311EFbCF0111f75D29706D9a41) | `RemovedVault`, `UpdatePositionHolder`, `UpdatePositionRoles` |

### Critical Events to Monitor

- **PPS decrease** at any of the three vaults in scope (yvDAI-1, yvUSDC-1, yvUSDS-1) — should only increase outside of explicit loss events
- **Strategy additions / removals** at any layer
- **Depositor parameter changes:** any `setSwapSlippageBPS()`, `setMaxAcceptableFeeOutPSM()`, `setPendingManagement()`, or `emergencyWithdrawDirect()` call on the DAI To USDC-1 Depositor
- **Role-manager handover:** Role Manager `RemovedVault` or vault `UpdateRoleManager` for yvDAI-1
- **Emergency actions** (`Shutdown`) at any layer — directly impacts yvDAI-1's redemption path
- **PSM `tin` / `tout`** — if non-zero, USDC ↔ DAI conversion incurs fees
- **DAI-USDS Exchanger pause state**
- **Sky USDS → GROVE farm pause, reward lapse, or migration** (affects ~44.5% of effective deployment via yvUSDS-1 and yvUSDC-1's USDC to USDS Depositor — dominant exposure)
- **Sky sUSDS pause / migration** (affects ~7.4% of effective deployment via yvUSDC-1)
- **Yearn USDC MetaMorpho: guardian or curator changes, market removal, or exploit** (affects ~23.8% of effective deployment via yvUSDC-1)
- **stcUSD/USDC Pawn Broker Market: queue membership change, `currentLtv()` approaching the 91.5% LLTV (87.08% at snapshot), `callDebt()`, liquidation, or Cap (stcUSD) depeg/upgrade** (affects ~24.3% of effective deployment via yvUSDC-1)
- **ySafe / Brain / Security signer or threshold changes**

### Monitoring Functions

| Function | Contract | Purpose | Frequency |
|----------|----------|---------|-----------|
| `convertToAssets(1e18)` | yvDAI-1 | PPS | Every 6 hours |
| `convertToAssets(1e6)` | yvUSDC-1 | Upstream PPS | Every 6 hours |
| `convertToAssets(1e18)` | yvUSDS-1 | Terminal PPS | Every 6 hours |
| `totalAssets()` | All three vaults | TVL | Daily |
| `tin()` / `tout()` | PSM Lite | PSM fee | Daily |
| `dai()` / `usds()` | DAI-USDS Exchanger | Token mapping integrity (no on-chain `live()` getter; pause via upstream Sky `cage`) | Daily |
| `getThreshold()` / `getOwners()` | ySafe, Brain, Security | Governance integrity (compare owner sets, not only counts) | Weekly |
| `swapSlippageBPS()` / `maxAcceptableFeeOutPSM()` | DAI To USDC-1 Depositor | Loss-causing parameter changes | Daily |
| `getMinDelay()` | TimelockController | Delay change detection (7-day) | Weekly |

## Risk Summary

### Key Strengths

- **Battle-tested Yearn V3 infrastructure:** 3 audits by top firms, ~30 months of clean V3 production. Immutable vault contract eliminates proxy upgrade risk
- **Diversified underlying:** ~51.9% Sky (GROVE farm ~44.5% + sUSDS ~7.4%), ~24.3% Cap stcUSD, ~23.8% Morpho Blue (cbBTC/WBTC/wstETH collateral). Sky has a $10M Immunefi bounty; Morpho Blue is a battle-tested isolated-market primitive
- **Timelocked strategy additions:** Yearn V3 Role Manager + 6-of-9 ySafe (named DeFi signers) + 7-day self-governed timelock for adding strategies and changing the accountant
- **Established track record:** ~32 months in production, ~13.69% cumulative return, zero incidents
- **Active monitoring:** vault is in Yearn's hourly monitoring system
- **Cascade depth bounded:** two Yearn-vault layers on the direct paths, three through yvUSDC-1's `USDC to USDS Depositor`
- **No leverage at the yvDAI-1 layer. No cross-chain.** Vault-of-vaults composition is not leverage
- **Liquid underlying** — sUSDS / PSM multi-billion deep, GROVE farm 131M USDS staked, Morpho markets with withdrawable liquidity
- **All conversion hops at 1:1** — PSM Lite (USDC ↔ DAI) and DAI-USDS Exchanger are both 0-fee 1:1

### Key Risks

- **Untimelocked slippage control (weakest permission path):** Brain (3-of-6) can set the DAI To USDC-1 Depositor's swap slippage to 100% and force its 4.05M DAI position (72.85% of TVL) through a ~$1.0M Uniswap V3 pool with zero minimum output, without a timelock or loss cap. See [Critical Permission Paths and Weakest Link](#critical-permission-paths-and-weakest-link)
- **Timelock bypass via Role Manager:** Brain calling `removeVault()` plus the ySafe accepting the role-manager seat would let the ySafe grant itself ADD_STRATEGY with no delay
- **Cap (stcUSD) dependency via Pawn Broker:** ~24.3% of deployed DAI is lent to one 7.74x-levered borrower against stcUSD (Cap) collateral at 87.08% LTV (91.5% LLTV). Cap has a 3-of-5 anonymous multisig, upgradeable UUPS proxies, and a 24h timelock (score 2.45/5.0). The strategy is **not in yvUSDC-1's default withdrawal queue** and holds 1 wei of idle USDC
- **New dominant endpoint:** ~44.5% of deployed DAI sits in the Sky USDS → GROVE farm via the Grove USDS Compounder (v3.1.0, funded since September 21, 2026). No audit artifact for the strategy contract was located (TODO in the yvUSDS-1 report). The farm's current reward period ends November 22, 2026
- **Pending downstream additions:** yvUSDC-1 has an infiniFi `Flex siUSD/USDC Lender` (max debt 10M USDC) and a new `USDC to yvUSDS-1 Depositor` queued in the timelock, executable November 23, 2026. Funding the first adds infiniFi (3.19/5.0) exposure
- **Vault-of-vaults composition:** two to three Yearn V3 vault layers. A bug or accounting issue at any layer cascades. Each layer's emergency state (shutdown, deposit pause) directly affects yvDAI-1
- **Sky-ecosystem concentration:** ~51.9% of deployed DAI ends up in Sky contracts
- **Reward and savings-rate variability:** GROVE emissions, auction clearing, and the SSR affect yield, not principal
- **PSM fee risk:** currently 0%, but Sky governance can change it. At or above 0.05% the USDC depositor swaps on Uniswap V3 with the Brain-set slippage tolerance (0.5% at the snapshot)

### Critical Risks

- None identified under the critical gates. The weakest permission path needs Brain's 3-of-6 quorum, so the fewer-than-3-signers gate does not apply. The dominant systemic risks are (1) a Sky USDS / sUSDS / StakingRewards failure affecting the ~51.9% Sky leg, (2) a Cap stcUSD failure or depeg impairing the ~24.3% Pawn Broker leg, and (3) a bug or exploit in the Yearn USDC MetaMorpho strategy affecting ~23.8% of deployed DAI.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- **Rounding rule:** the weighted sum is recorded to two decimal places, rounded down (1.475 → 1.47). The home page and reports list round it down again to one decimal.

### Critical Risk Gates

- [x] **No audit** — Yearn V3 core audited by 3 top firms. Sky / sUSDS / StakingRewards audited by 7+ firms. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 at all vaults in scope, all positions on-chain verifiable. ✅ PASS
- [x] **Total centralization** — no EOA holds a material path; the weakest material path needs Brain's 3-of-6 quorum. ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | V3 framework: 3 audits by top firms. Sky / sUSDS / StakingRewards: 7+ auditors. Morpho Blue: 3+ firms. Cap (stcUSD): 8 auditors |
| Bug bounty | $200K (Yearn Immunefi); $10M (Sky Immunefi); $2.5M (Morpho Cantina); $1M (Cap Sherlock) |
| Production history | **~32 months** (March 12, 2024). V3 framework: ~30 months |
| TVL | **~$5.56M** DAI. Deposit limit: 50M |
| Security incidents | None on V3, none on Sky |
| Strategy review | Rigorous 12-metric framework with ySec security review |

**Score: 1.5 / 5** — strong audit coverage, ~32 months clean production, no incidents.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | V3 vault is **immutable**; strategies are not upgradeable |
| Multisig | 6-of-9 ySafe with **publicly named, prominent DeFi signers**; Brain 3-of-6 (two owners removed October 15, 2026) |
| Timelock | 7-day delay on `ADD_STRATEGY`, `ACCOUNTANT`, and Role Manager governance. Self-governed. **No delay** on Brain's depositor-strategy management or on the Brain + ySafe role-manager handover |
| Weakest material path | Brain (3-of-6) can set the DAI To USDC-1 Depositor's slippage to 100% and force a Uniswap swap of its 4.05M DAI position (72.85% of TVL). No timelock, no loss cap |
| EOA risk | None |

**Governance Score: 3.5 / 5** — scored on the weakest permission path to a material loss, as the [scoring framework](../README.md) requires. That path is held by a 3-of-6 Safe with no timelock and no code-enforced loss bound, which matches the score-4 row ("Multisig 3/5 or low threshold", "Powerful admin roles with limited constraints"). The vault and strategies are immutable, Brain cannot transfer funds to itself directly, and the swap's 1:1 reference cannot be manipulated, so the score is held at 3.5 rather than 4. Rescored under the weakest-link governance rule; the onchain controls match the prior assessment's 1.0 except that Brain's quorum fell from 3-of-8 to 3-of-6.

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
| Protocol count (effective) | 3 ecosystems (Sky ~51.9%, Cap ~24.3%, Morpho Blue ~23.8%); plus dependency on Yearn V3's own vault-of-vaults accounting (2–3 Yearn vault layers, plus MetaMorpho) |
| Criticality | Sky USDS → GROVE farm ~44.5% (via yvUSDS-1 and yvUSDC-1's USDC to USDS Depositor); Cap stcUSD ~24.3% (via yvUSDC-1's single-borrower Pawn Broker, not in default queue); Morpho Blue ~23.8% (via yvUSDC-1's Yearn USDC MetaMorpho); Sky sUSDS ~7.4% (via yvUSDC-1); same-team Yearn V3 dependency at both intermediate vaults |
| Quality | Sky top-tier ($10M bounty, multi-billion TVL); Morpho Blue audited by Cantina, Spearbit, ChainSecurity ($2.5M bounty); GROVE farm ~5 months old, reached through a ~2-month-old strategy; Cap younger and weaker governance (3-of-5 anonymous multisig, upgradeable UUPS proxies, 8 audits, score 2.45/5.0) |

**Dependencies Score: 2.5 / 5** — effective deployment spans three ecosystems (Sky ~51.9%, Cap ~24.3%, Morpho Blue ~23.8%). The diversification benefit is offset by the Cap (stcUSD) dependency — a newer protocol with weaker governance, lent to a single levered borrower — and by the largest Sky leg now sitting in a young StakingRewards farm. Principal in that farm is staked USDS with an unpausable `withdraw()`. The vault-of-vaults dependency on Yearn V3 itself remains. Pending infiniFi exposure in yvUSDC-1 is not yet funded. Net 2.5, unchanged.

**Centralization Score = (3.5 + 1.0 + 2.5) / 3 ≈ 2.33**

**Score: 2.33 / 5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | 100% on-chain DAI; deployed across Sky (GROVE farm + sUSDS), Cap stcUSD Pawn Broker, and Morpho Blue via vault-of-vaults |
| Collateral quality | Sky legs backed by Sky's over-collateralized loan book + RWA; Morpho Blue over-collateralized cbBTC/WBTC/wstETH lending; Pawn Broker lends USDC to one 7.74x-levered borrower against stcUSD (Cap) collateral at 87.08% LTV (91.5% LLTV) — 3-of-5 anonymous multisig, upgradeable UUPS proxies, 8 audits |
| Leverage | None at the yvDAI-1 layer |
| Verifiability | Fully on-chain across all vault layers |

**Score: 2.0 / 5** — the ~24.3% Cap (stcUSD) collateral exposure via the Pawn Broker introduces moderate collateral-governance risk (anonymous multisig, upgradeable proxies), justifying a 2 rather than 1. The Sky (~51.9%) and Morpho Blue (~23.8%) legs remain top-tier.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain at every layer (ERC-4626 throughout) |
| Exchange rate | Programmatic, real-time at every layer |
| Reporting | Keeper-driven, 10-day profit unlock |
| Vault-of-vaults | Slightly increases the surface area to verify (need to read multiple vaults' totalAssets), but each layer is on-chain and independently verifiable |

**Score: 1.0 / 5** — excellent on-chain provability.

**Funds Management Score = (2.0 + 1.0) / 2 = 1.5**

**Score: 1.5 / 5** — excellent on-chain provability, but the ~24.3% Cap (stcUSD) collateral exposure via the Pawn Broker introduces moderate collateral-governance risk (3-of-5 anonymous multisig, upgradeable UUPS proxies).

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit pipeline | 2–3 vault layers + terminal exit (GROVE farm unstake, sUSDS withdraw, Morpho Blue redemption, or Pawn Broker loan recall) |
| Liquidity depth | sUSDS multi-billion; GROVE farm 131M USDS; PSM billions; Morpho markets ~88% utilized; Pawn Broker idle USDC 1 wei |
| Large holder impact | $5.56M vault vs much deeper underlying — negligible |
| Same-asset | DAI-denominated share token |
| Withdrawal restrictions | None — atomic redemption (multi-step within one transaction); Pawn Broker (~24.3% effective) not in yvUSDC-1's default queue; yvUSDC-1's queued strategies covered the depositor's full position at the snapshot |

**Score: 1.5 / 5** — highly liquid; only mild downward pressure from the multi-layer cascade plus the Pawn Broker's absence from the default withdrawal queue.

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
| Centralization & Control | 2.33 | 30% | 0.700 |
| Funds Management | 1.5 | 30% | 0.450 |
| Liquidity Risk | 1.5 | 15% | 0.225 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **1.72 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (1.72 / 5.0) — Approved with standard monitoring**

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (March 2027) or annually
- **TVL-based:** Reassess if TVL exceeds $25M or changes by ±50%, or if the deposit limit is changed
- **Strategy posture:**
  - any new `add_strategy()` proposal at the Strategy Manager TimelockController for yvDAI-1 (would surface in the 7-day queue) — particularly if it reintroduces direct sDAI / Spark DAI Lender / Aave V3 DAI Lender exposure
  - the depositor allocation between yvUSDC-1 and yvUSDS-1 swings by more than ±20 percentage points from the current 72.85 / 27.15 split
- **Permission paths:**
  - any change to the DAI To USDC-1 Depositor's `swapSlippageBPS()` (50) or `maxAcceptableFeeOutPSM()` (0.05% + 1 wei), any `emergencyWithdrawDirect()` call, or a `management()` / `emergencyAdmin()` change on either depositor
  - a Role Manager `RemovedVault` event or a vault `UpdateRoleManager` event for yvDAI-1
- **Downstream rewiring (the dominant change vector at recent snapshots):**
  - **Pending yvUSDC-1 additions:** if the timelocked `Flex siUSD/USDC Lender` ([`0x774b9e40C571867cA5f5660D245467Ff631126ef`](https://etherscan.io/address/0x774b9e40C571867cA5f5660D245467Ff631126ef)) or `USDC to yvUSDS-1 Depositor` ([`0xcb1Eb72F2a27E9EAD2e2Fb3F0AAC7E4Ee39F2EeB`](https://etherscan.io/address/0xcb1Eb72F2a27E9EAD2e2Fb3F0AAC7E4Ee39F2EeB)) is executed (from November 23, 2026) and receives debt; infiniFi exposure above ~5% of yvDAI-1's effective deployment warrants a rescore
  - if yvUSDC-1 reroutes materially away from its current four-strategy mix (`stcUSD/USDC Pawn Broker Market` 33.34%, `Yearn USDC` 32.66%, `USDC to USDS Depositor` 23.85%, `USDC to sUSDS Lender` 10.15%), yvDAI-1's effective endpoint mix changes accordingly
  - if yvUSDS-1 rewires away from its current 100% `Grove USDS Compounder` routing, yvDAI-1's ~44.5% GROVE-farm share changes accordingly
  - **Yearn USDC MetaMorpho:** reassess if the strategy's Morpho Blue market allocations change materially, if markets are added/removed from the supply queue, or if the guardian/curator changes. Current allocation: cbBTC ~62.6% / WBTC ~34.8% / wstETH ~2.7% of 6.21M USDC TVL
  - **stcUSD/USDC Pawn Broker Market:** reassess if the strategy ([`0xe63a2abc24cd9538398d825a4bfe5778d25687df`](https://etherscan.io/address/0xe63a2abc24cd9538398d825a4bfe5778d25687df), v3.0.4) is added to or removed from yvUSDC-1's default queue, if its debt share exceeds ~35% of yvUSDC-1 (33.34% now; `max_debt` 10M USDC), if `currentLtv()` exceeds 90% (87.08% now), if Brain calls `callDebt()` or `liquidate()`, or if Cap (stcUSD) governance/contracts change materially
- **Vault-of-vaults composition:**
  - reassess if a new strategy adds a fourth Yearn-vault layer (the deepest path is yvDAI-1 → yvUSDC-1 → yvUSDS-1)
  - reassess if either intermediate vault (yvUSDC-1, yvUSDS-1) shuts down a strategy that holds yvDAI-1's deployed funds
- **Sky-specific:**
  - SSR drops below 2% (~3.80% APY at the snapshot; may indicate Sky-side stress)
  - PSM `tin` / `tout` set to 0.05% or above (activates Uniswap V3 fallback in the USDC depositor path)
  - GROVE farm `rewardRate()` lapses without renewal after `periodFinish()` (November 22, 2026), or the farm is paused / migrated
  - DAI-USDS Exchanger pause (via upstream Sky `cage`; the Exchanger contract itself has no `live()` getter)
- **Cap-specific:** stcUSD depeg, Cap multisig/threshold change, stcUSD implementation upgrade, or a change to the [Cap stcUSD report](./cap-stcusd.md) score (currently 2.45/5.0)
- **Incident-based:** any V3 exploit, strategy loss, governance compromise, or major incident at Sky / MakerDAO / Spark / Morpho / Cap / infiniFi
- **Governance-based:** ySafe / Brain / Security owner-set or threshold changes; any change to the timelock delay (would itself require 7 days)

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
│  │  ~$5.56M DAI TVL        │                                             │
│  └───┬───────────────┬─────┘                                             │
│      │ 72.85%        │ 27.15%                                            │
│      ▼               ▼                                                    │
│  ┌────────────┐  ┌─────────────────┐                                    │
│  │ DAI→USDC-1 │  │ DAI→USDS        │   management: Brain (3-of-6)       │
│  │ Depositor  │  │ Depositor       │   emergency:  Security (4-of-7)    │
│  │ 0xfF03…f9B5│  │ 0xAeDF…b78d     │                                    │
│  └────┬───────┘  └────────┬────────┘                                    │
│       │                   │                                              │
│  ┌────▼─────────┐    ┌────▼──────────────────┐                          │
│  │ DAI→USDC     │    │ DAI→USDS              │                          │
│  │ via PSM Lite │    │ via DAI-USDS Exchanger│                          │
│  │ (Uniswap if  │    │ 1:1, no fee           │                          │
│  │  tout≥0.05%) │    │                       │                          │
│  └────┬─────────┘    └────┬──────────────────┘                          │
└───────┼───────────────────┼──────────────────────────────────────────────┘
        │                   │
        ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          VAULT LAYER 2                                   │
│                                                                          │
│  ┌─────────────────────────────┐    ┌────────────────────────────┐      │
│  │  yvUSDC-1                   │    │  yvUSDS-1                  │      │
│  │  0xBe53…6204                │    │  0x1828…47E8               │      │
│  │  33.34% stcUSD Pawn Broker* │    │  100% Grove USDS Compounder│      │
│  │  32.66% Yearn USDC (Morpho) │    │  Spark / sUSDS / Sky       │      │
│  │  23.85% USDC→USDS Depositor ├───►│  Rewards Compounders: 0    │      │
│  │  10.15% sUSDS Lender        │    │                             │      │
│  │  Spark USDC Lender: 0       │    │                             │      │
│  └─────────┬───────────────────┘    └─────────┬──────────────────┘      │
│            │                                   │                          │
│            ▼                                   ▼                          │
│   Cap stcUSD + Morpho Blue + sUSDS         Sky USDS → GROVE farm         │
│   (*Pawn Broker not in default queue)      (StakingRewards)              │
└─────────────────────────────────────────────────────────────────────────┘

Effective endpoint mix for yvDAI-1's deployed DAI (November 17, 2026):
  ~44.5%  Sky USDS → GROVE   (via yvUSDS-1 → Grove Compounder + yvUSDC-1 → USDC→USDS → yvUSDS-1)
  ~24.3%  Cap stcUSD         (via yvUSDC-1 → stcUSD/USDC Pawn Broker Market)
  ~23.8%  Morpho Blue        (via yvUSDC-1 → Yearn USDC MetaMorpho → cbBTC/WBTC/wstETH)
   ~7.4%  Sky sUSDS          (via yvUSDC-1 → USDC to sUSDS Lender)
```

## Appendix: TimelockController Role Structure

TimelockController [`0x88Ba032be87d5EF1fbE87336b7090767F367BF73`](https://etherscan.io/address/0x88Ba032be87d5EF1fbE87336b7090767F367BF73) — same timelock used by 37+ Yearn V3 vaults including all six mainnet risk-1 vaults. `getMinDelay() = 604800` (7 days). Holders below were confirmed with `hasRole()` at block 26435312; no `RoleGranted` or `RoleRevoked` event was emitted between blocks 25978217 and 26435312.

| Role | Holder | Type | Notes |
|------|--------|------|-------|
| **DEFAULT_ADMIN** | *No holder* | — | Never granted (`admin = address(0)`) |
| **TIMELOCK_ADMIN** | Timelock itself | Contract | Self-governed |
| **PROPOSER** | Daddy/ySafe | 6-of-9 Safe | Sole proposer |
| **EXECUTOR** | Daddy/ySafe | 6-of-9 Safe | Direct execution |
| **EXECUTOR** | TimelockExecutor [`0xf8f60bf9456a6e0141149db2dd6f02c60da5779b`](https://etherscan.io/address/0xf8f60bf9456a6e0141149db2dd6f02c60da5779b) | Contract | Wrapper: Brain (3/6) + deployer EOA can call `execute()` through it |
| **CANCELLER** | Daddy/ySafe | 6-of-9 Safe | Cancel pending proposals |
| **CANCELLER** | Brain | 3-of-6 Safe | Cancel pending proposals |

To shorten the delay, Daddy 6/9 must propose `updateDelay()`, wait 7 days during which Brain or Daddy can cancel, then execute. DEFAULT_ADMIN was never granted, so no party can self-grant PROPOSER or TIMELOCK_ADMIN to skip the flow.

The timelock does not cover every route to ADD_STRATEGY on yvDAI-1. The Role Manager's `removeVault()` is callable by Brain without delay and transfers the vault's role-manager seat to the immutable `chad` (the ySafe), which can accept it and call `set_role()` directly. See [Critical Permission Paths and Weakest Link](#critical-permission-paths-and-weakest-link).

---

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [May 11, 2026](https://github.com/yearn/risk-score/pull/148) | 1.3/5.0 | Initial assessment. yvDAI-1 with vault-of-vaults composition routing ~100% into Sky ecosystem via yvUSDC-1 (73%) and yvUSDS-1 (27%). Spark Lend USDC and sUSDS legs. |
| [July 12, 2026](https://github.com/yearn/risk-score/pull/311) | 1.32/5.0 | Reassessment: TVL stable at ~$9.50M. yvUSDC-1 added new "Yearn USDC" strategy (8.41% tracked debt) — verified as a Yearn-curated Morpho MetaMorpho vault supplying USDC into Morpho Blue (cbBTC, WBTC, wstETH collateral, LLTV 86%). Old Spark USDC Lender replaced. yvUSDS-1 added v3.0.3 "USDS Sky Rewards Compounder" (currently near-zero debt). Sky-ecosystem concentration dropped from ~100% to ~93.9%. Effective endpoint mix: ~89.6% sUSDS / ~6.2% Morpho Blue / ~4.3% Sky USDS Staking. All governance roles, multisig thresholds, and timelock delay unchanged. Score unchanged at 1.32. |
| [September 14, 2026](https://github.com/yearn/risk-score/pull/472) | 1.47/5.0 | Reassessment: TVL down ~21.6% to ~$7.44M. yvUSDC-1 materially rewired (USDC to sUSDS Lender 22.2%, Yearn USDC 35.6%, stcUSD/USDC Pawn Broker Market 30.3% — self-contained v3.0.4, not in default queue — and USDC to USDS Depositor 11.9%). yvUSDS-1 fully drained its sUSDS Lender and now routes 100% through Spark USDS Compounder (Sky USDS Staking). Effective endpoint mix: ~37.3% USDS Staking / ~25.3% Morpho Blue / ~21.6% Cap stcUSD / ~15.8% sUSDS. Sky concentration fell ~93.9% → ~53.1%; new Cap dependency (2.4/5.0) via Pawn Broker. Collateralization 1.0 → 2.0, Funds Management 1.0 → 1.5. Governance, multisig thresholds, and timelock delay unchanged. Final score 1.3 → 1.47 (Minimal Risk). |
| [November 17, 2026](https://github.com/yearn/risk-score/pull/TBD) | 1.72/5.0 | Reassessment at block 26435312. TVL down ~25.3% to ~$5.56M; allocation 72.85% yvUSDC-1 / 27.15% yvUSDS-1. yvUSDS-1 now 100% Grove USDS Compounder (Sky USDS → GROVE farm). Effective mix ~44.5% GROVE farm / ~24.3% Cap stcUSD / ~23.8% Morpho Blue / ~7.4% sUSDS. Two yvUSDC-1 strategies (infiniFi Flex lender, USDC to yvUSDS-1 Depositor) pending in the timelock until November 23. Brain 3-of-8 → 3-of-6; Security and ySafe owners rotated, thresholds unchanged. Added Critical Permission Paths and Weakest Link; corrected Brain vault roles and the Role Manager governance. Rescored under weakest-link governance rule: Governance 1.0 → 3.5 because Brain can set the USDC depositor's swap slippage to 100% without a timelock; Centralization 1.5 → 2.33. Final 1.47 → 1.72 (Low Risk). |
