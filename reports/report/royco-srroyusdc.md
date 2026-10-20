# Protocol Risk Assessment: Royco Dawn (srRoyUSDC)

- **Assessment Date:** March 26, 2026 (Updated: October 19, 2026)
- **Onchain Snapshot:** Ethereum block [26229366](https://etherscan.io/block/26229366) (October 19, 2026 21:39:47 UTC). Royco docs, DeFiLlama, and the Morpho API were fetched the same day.
- **Token:** srRoyUSDC (Senior Royco USDC)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32)
- **Final Score: N/A** (Not Rated: the vault is winding down in withdrawal-only mode; see [Risk Score Assessment](#risk-score-assessment))
- **Status:** DEAD
- **Visibility:** Hidden

## Overview + Links

srRoyUSDC is the Senior Vault of **Royco Dawn**. It is an async ERC-4626 vault built on the Concrete framework, curated by Dialectic, and it allocated USDC across Royco Dawn Senior tranches.

**The vault is winding down.** Royco's docs state: *"The Senior Royco USDC Vault and the Royco ETH Vault are winding down and are now in withdrawal-only mode. Deposits are closed, but you can still withdraw your funds"* ([Vaults Overview](https://docs.royco.org/how-the-vaults-work.md), [Senior Vault](https://docs.royco.org/vault-products.md)). Dawn itself is now labelled a [legacy deployment](https://docs.royco.org/royco-dawn/legacy-deployment.md) with a known Junior-recovery accounting limitation. Royco's active product is **Royco Day**, assessed separately in [Royco Day Senior Tranches](royco-day.md).

**Current state (snapshot):**

- **Total assets:** 4,872,163.97 USDC (`totalAssets()`), down from ~$10.73M on March 25, 2026.
- **Total supply:** 4,726,849.96 srRoyUSDC.
- **PPS:** 1.030742 USDC per share (`convertToAssets(1e6)`).
- **Allocation:** 100% to [RoycoVaultMakinaStrategy](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778), which is now the only strategy (`getStrategies()`); the former MultisigStrategy is no longer attached. The vault holds 979.13 USDC idle.
- **Deposits:** the last `Deposit` event was on August 6, 2026 (6 USDC). **The docs' closure is not enforced onchain.**
  - Deposits and mints pass through a `WhitelistUserDepositHook` ([`0x5c4952751cf5c9d4ea3ad84f3407c56ba2342f13`](https://etherscan.io/address/0x5c4952751cf5c9d4ea3ad84f3407c56ba2342f13)), configured on January 27, 2026 with the pre-deposit and pre-mint flags.
  - All 26 addresses ever whitelisted remain whitelisted, and `canUserDeposit` returns `true` for each of them.
  - Both the vault deposit limits (`getDepositLimits()`) and the hook's per-user cap are `type(uint256).max`.
  - The hook is owned by the 1-of-4 Safe [`0xb2B80EBcb7EE285806ddcB26E84a444032D1c244`](https://etherscan.io/address/0xb2B80EBcb7EE285806ddcB26E84a444032D1c244).
  - The wind-down therefore rests on Royco and whitelisted depositors choosing not to deposit.
- **Withdrawals:** processed through 30-day epochs. Epochs 4–7 were processed on August 10, August 28, September 30, and October 15, 2026.
- **Fees:** the docs list a 10% performance fee and 0% management fee. `PerformanceFeeAccrued` events were emitted through September 29, 2026. In March 2026, both fees were 0%.

**Links:**

- [Royco docs: Vaults Overview](https://docs.royco.org/how-the-vaults-work.md)
- [Royco Dawn: Key Addresses](https://docs.royco.org/royco-dawn/key-addresses.md)
- [Royco Dawn: Legacy Deployment](https://docs.royco.org/royco-dawn/legacy-deployment.md)
- [GitHub (roycoprotocol/royco-dawn)](https://github.com/roycoprotocol/royco-dawn)
- [Bug Bounty (Immunefi)](https://immunefi.com/bug-bounty/royco/information/)
- [DeFiLlama (Royco V2)](https://defillama.com/protocol/royco-v2)

## Contract Addresses

| Contract | Address | Status at snapshot |
|----------|---------|--------------------|
| srRoyUSDC (VaultProxy, ERC-4626) | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) | Withdrawal-only per docs; whitelist deposit hook still admits 26 addresses |
| Implementation (ConcreteAsyncVaultImpl) | [`0x1b5cd91e61505d431d2a61192a1006146bd9bb28`](https://etherscan.io/address/0x1b5cd91e61505d431d2a61192a1006146bd9bb28) | Unchanged since March 2026 |
| Vault owner (`owner()`) | [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) | Safe 3-of-4 (formerly the VAULT_MANAGER Safe). Also root `ADMIN` of the Royco Day AccessManager |
| ConcreteFactory (vault proxy admin) | [`0x0265d73a8e61f698d8eb0dfeb91ddce55516844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c) | Unchanged |
| RoycoVaultMakinaStrategy | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) | Sole strategy; `totalAllocatedValue()` = 4,871,250.15 USDC; `maxWithdraw()` = 1,206,023.85 USDC |
| Makina Machine | [`0xFa097420f0e2C72456B361a1eD85172B9ccd8c38`](https://etherscan.io/address/0xFa097420f0e2C72456B361a1eD85172B9ccd8c38) | `lastTotalAum()` = 4,871,250.15 USDC; last global accounting September 28, 2026 19:30 UTC |
| Makina hub Caliber | [`0x5476F4E23dAA093Ce6700e1026013c55F7AF9083`](https://etherscan.io/address/0x5476F4E23dAA093Ce6700e1026013c55F7AF9083) | 9 positions; `getNetAum()` reverts `PositionAccountingStale` |
| Makina security council | [`0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc`](https://etherscan.io/address/0x89faa3b02EF5aB185b8ACE489Af62748ACB50Afc) | Safe, threshold 3 |
| Former MultisigStrategy | [`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D) | No longer in `getStrategies()`; `totalAllocatedValue()` reverts |
| Former Treasury Safe | [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8) | Safe 3-of-5 |
| Former Owner Safe | [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190) | Safe now 3-of-4 (was 3-of-5) |

## Audits and Due Diligence Disclosures

Dawn audits: Hexens (January 2026, plus March and April 2026 updates), Cantina competition, and a Certora formal-verification review in June 2026 ([Security and Audits](https://docs.royco.org/royco-dawn/security-and-audits.md)). The Concrete vault framework was audited by Halborn and Cantina. Makina V1.1 was audited by ChainSecurity, Enigma Dark, Sigma Prime, Cantina, and OtterSec ([Makina security](https://docs.makina.finance/contracts/security)). The Immunefi program ($250K maximum) lists srRoyUSDC, the Multisig Strategy, the Makina strategy, and the Dawn factories as in-scope assets.

## Historical Track Record

- **Launch:** January 6, 2026. Peak vault `totalAssets()` was ~$10.7M (March 2026).
- **Wind-down:** no deposits since August 6, 2026. The docs mark the vault withdrawal-only. `totalAssets()` fell to $4.87M by October 19, 2026.
- **Epoch 7 (October 15, 2026):** 2,134,386.81 shares were processed for 2,199,999.99 USDC ([tx](https://etherscan.io/tx/0xab2dc726949b066e3fc68ca58f2745d144527e5d879526ba3e635d1835e097f2)). Two requests from [`0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476`](https://etherscan.io/address/0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476) (350,000 shares) and [`0xea0832641d6bc5c3cda3c5cab4f5a0d1a3f0dac0`](https://etherscan.io/address/0xea0832641d6bc5c3cda3c5cab4f5a0d1a3f0dac0) (380,702.61 shares) were **moved to epoch 8** (`RequestMovedToNextEpoch`). Under the documented priority order, Royco's own vaults are served first, then priority partners, then remaining withdrawals.
- **Dawn accounting limitation:** Royco now documents that Dawn can clear Junior impermanent loss before Junior value is fully restored ([Legacy Deployment](https://docs.royco.org/royco-dawn/legacy-deployment.md)).
- **Exploits:** none found.
- **DeFiLlama Royco V2 (Dawn + Day):** $17.58M (October 19, 2026), down from a $25.25M peak on August 6, 2026.

## Funds Management

### Current Allocation

All vault capital sits in the Makina strategy. Its machine reports $4.87M AUM, last globally accounted on September 28, 2026. Positions were mapped by matching each caliber position mark against the caliber's token balances and decoding its `managePosition` transactions:

| Holding | Value (USD) | Share of AUM | Evidence |
|---------|------------:|-------------:|----------|
| [Pareto Credit Vault FalconX USDC](https://etherscan.io/address/0x17e9ab2992dfecbe779a06a92a6cdb9fe6aeeef3) (position 5) | 2,677,495 | 55.0% | Caliber balance 2,677,495.153561 = position mark. This is a Pareto credit vault for FalconX, per the token name. |
| Idle USDC at the Makina machine | 1,206,024 | 24.8% | `USDC.balanceOf(machine)`; equals the strategy's `maxWithdraw()` |
| Dialectic mGLOBAL machine shares, pending redemption (position 7) | 616,078 | 12.7% | On October 19, 2026 ([tx](https://etherscan.io/tx/0x49ea5f579c4acf017d3694023cce9a4406b56ab533ac16882756c9e3afa287da)), the caliber redeemed its Dawn Senior tranche ROY-ST-DMG ([`0xaC9CF7e8f83C471cA596F4371fF002cdaF9573e6`](https://etherscan.io/address/0xaC9CF7e8f83C471cA596F4371fF002cdaF9573e6)) for 604,168.91 DMG ([`0x761C3B16a5Afdd7A1869C4B979cFF3383d5Fe98B`](https://etherscan.io/address/0x761C3B16a5Afdd7A1869C4B979cFF3383d5Fe98B), a Makina machine share). It then queued that DMG in the `AsyncRedeemerFee` [`0xc4ecaf359a6174f9651c5fcd7b6fe9ae6b682ca5`](https://etherscan.io/address/0xc4ecaf359a6174f9651c5fcd7b6fe9ae6b682ca5) as request #2. That request is unfinalized (`lastFinalizedRequestId` = 1) and carries a 1.3% redeem fee. The underlying is Midas mGLOBAL (Fasanara) exposure via Dialectic's Makina machine [`0xC4fFab8540AC27E40D4e2930517aA711e9C00c5b`](https://etherscan.io/address/0xC4fFab8540AC27E40D4e2930517aA711e9C00c5b). |
| frxUSD supplied on Aave V4 (position 4) | 256,990 | 5.3% | `getUserSuppliedAssets(12, caliber)` on spoke [`0x94e7a5dcbe816e498b89ab752661904e2f56c485`](https://etherscan.io/address/0x94e7a5dcbe816e498b89ab752661904e2f56c485) = 257,099.57 frxUSD; no debt |
| PYUSD (idle base token) | 154,418 | 3.2% | Caliber balance |
| VanEck VBILL, aEthUSDtb, frxUSD, USDG, dust Aave positions | ~3,700 | <0.1% | Caliber balances; positions 0, 1, 2, 3, 6, 8 |
| **Total** | **~4,914,700** | | vs `lastTotalAum()` 4,871,250. The 0.9% gap reflects AUM last being globally accounted on September 28. |

- `getNetAum()` on the caliber currently reverts with `PositionAccountingStale`.
- The caliber holds `ST_LP_ROLE` on the Royco Day AccessManager but holds **no** Day Senior tranche tokens at the snapshot.
- Several unsolicited airdrop tokens held by the caliber (ALPHA, TENDIE, GLAMDOG, ODYSSEY, HEX) are excluded.

### Accessibility

- **Deposits:** closed per the docs, but not onchain: 26 whitelisted addresses can still deposit (see [Overview](#overview--links)). The last deposit was on August 6, 2026.
- **Withdrawals:** request into the open 30-day epoch. The curator processes it over a ~2-day window, then the user claims. Partially filled or deprioritised requests roll to the next epoch. KYC/KYB is required for direct vault withdrawals ([Deposits and Withdrawals](https://docs.royco.org/deposits-and-withdrawals.md)).

### Token Mint Authority

**Mint mechanism:** ERC-4626 `deposit`/`mint` (USDC pulled in the same transaction) plus fee-share minting through `accrueYield()`. The implementation is unchanged from the [initial assessment](https://github.com/yearn/risk-score/pull/119). Deposit minting remains technically open to the 26 whitelisted addresses. The other active mint path is performance-fee shares (10% per the docs).

### Collateralization and Provability

`totalAssets()` is reported by the Makina strategy from the machine's AUM. That AUM is recomputed from caliber position marks, and those marks are stale at the snapshot. The mapped holdings reconcile to within 0.9% of reported AUM (see [Current Allocation](#current-allocation)). **55% of the remaining capital is offchain credit (the Pareto FalconX credit vault)**, and a further 12.7% is a pending Midas mGLOBAL redemption. Their redeemability, not the onchain accounting, now drives how fast the wind-down can pay out.

## Liquidity Risk

- **Primary exit:** 30-day epochs, served in priority order. Epoch 7 rolled ~731K shares (~$0.75M) to the next epoch.
- **Secondary exit:** Morpho Blue holds 1,676,242 srRoyUSDC (35.5% of supply) as collateral, mainly in the [srRoyUSDC/USDC 91.5% LLTV market](https://app.morpho.org/ethereum/market/0xacc49fbf58feb1ac971acce68f8adc177c43682d6a7087bbd4991a05cb7a2c67/srroyusdc-usdc). That market has $1.49M supplied, $1.38M borrowed (~93% utilised), and $1.73M of collateral. Its lenders are exposed to a wind-down collateral whose redemption is epoch-gated and priority-ordered.

## Centralization & Control Risks

- **Vault owner:** Safe [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) (3-of-4). The same Safe is root `ADMIN` of the Royco Day AccessManager.
- **Vault implementation upgrades:** still require the ConcreteFactory (Concrete team Safe).
- **Strategy management:** handled by the Makina machine roles (mechanic EOA [`0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF`](https://etherscan.io/address/0x425BbC2cfF0c7E7960baA9BaC2f0Cb67B41d3beF), security council Safe above). The machine's `riskManager()` is the Royco Day AccessManager [`0x82EecE4a736db0767370d2DfFdE9BDF6e38AaeB8`](https://etherscan.io/address/0x82EecE4a736db0767370d2DfFdE9BDF6e38AaeB8).

## Operational Risk

Royco Foundation and Dialectic are winding the product down. Documentation states the wind-down clearly but does not publish a completion date or the epoch schedule beyond the 30-day cadence.

## Monitoring

| Contract | Address | What to watch |
|----------|---------|---------------|
| srRoyUSDC | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) | `totalAssets()`, `convertToAssets(1e6)` (alert on decrease), `EpochProcessed`, `RequestMovedToNextEpoch`, any `Deposit` |
| Makina strategy / machine | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) / [`0xFa097420f0e2C72456B361a1eD85172B9ccd8c38`](https://etherscan.io/address/0xFa097420f0e2C72456B361a1eD85172B9ccd8c38) | `maxWithdraw()`, `lastTotalAum()`, `lastGlobalAccountingTime()` (alert if >7 days stale) |
| Morpho srRoyUSDC/USDC | [market](https://app.morpho.org/ethereum/market/0xacc49fbf58feb1ac971acce68f8adc177c43682d6a7087bbd4991a05cb7a2c67/srroyusdc-usdc) | Utilisation and borrow size against epoch throughput |

## Risk Summary

### Key Strengths

- Withdrawals are being processed on schedule: four epochs since August 2026, ~$2.2M paid in epoch 7.
- PPS has risen from 1.0056 (March 2026) to 1.0307, with no recorded loss.

### Key Risks

- The product is in wind-down. Exits depend on curator epoch processing and a priority order that serves Royco's own vaults first.
- 55% of the remaining $4.87M is a Pareto FalconX credit-vault position and 12.7% is an unfinalized mGLOBAL redemption. Only ~$1.21M (24.8%) is idle USDC available for the next epoch. Makina position marks are stale at the snapshot.
- Deposits are closed by policy only; the whitelist hook still admits 26 addresses.
- Morpho lenders in the 91.5% LLTV market (~93% utilised) hold exposure to a collateral with no new deposits and epoch-gated redemption.

### Critical Risks

- None identified beyond wind-down execution risk. Royco's forward risk now sits in Royco Day ([report](royco-day.md)).

---

## Risk Score Assessment

**Status: DEAD (wind-down, withdrawal-only).** Per the template, a deprecated or wind-down product is a terminal state, so the Final Score is **N/A (Not Rated)**. Yearn should not add new exposure.

The last forward-looking score was **3.80 (Elevated Risk)** on March 26, 2026, derived as follows:

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 5.0 | 30% | 1.50 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.80** |

That derivation relied on the MultisigStrategy custody path, which the vault no longer uses. It is retained for the record only.

### Risk Tier

**Final Risk Tier: Not Rated** (terminal: wind-down).

---

## Reassessment Triggers

- **Status-based:** reassess if deposits reopen, or if the vault is repurposed to allocate into Royco Day markets.
- **Incident-based:** reassess on any PPS decrease, an epoch that is not processed within 35 days of its close, or a vault or strategy upgrade.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [March 25, 2026](https://github.com/yearn/risk-score/pull/53) | 3.6 | Initial assessment |
| [March 26, 2026](https://github.com/yearn/risk-score/pull/111) | 3.35 | Onchain Dawn tranching verified (Junior coverage 12.4–12.5% vs 10% required) |
| [March 26, 2026](https://github.com/yearn/risk-score/pull/118) | 3.65 | MultisigStrategy full-custody handoff to the Treasury Safe identified; Collateralization 3.0 → 5.0 |
| [March 26, 2026](https://github.com/yearn/risk-score/pull/119) | 3.80 | Provability 4.0 → 5.0 (admin-reported NAV over full-custody handoff); Funds Management 5.0 |
| [October 19, 2026](https://github.com/yearn/risk-score/pull/541) | DEAD | Vault in withdrawal-only wind-down (Royco docs); no deposits since Aug 6, 2026; TVL $4.87M, 100% via Makina strategy (MultisigStrategy detached): 55% Pareto FalconX credit vault, 24.8% idle USDC, 12.7% pending mGLOBAL redemption. Deposit closure is policy only (whitelist hook still admits 26 addresses). 30-day epochs with requests rolled to epoch 8. Royco's active product assessed separately in [royco-day](royco-day.md). |
