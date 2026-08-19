# Protocol Risk Assessment: Midas mHYPER

- **Assessment Date:** February 7, 2026 (Updated: August 19, 2026)
- **Token:** mHYPER
- **Chain:** Ethereum (also deployed on Monad, Plasma, and Katana)
- **Token Address:** [`0x9b5528528656DBC094765E2abB79F293c21191B9`](https://etherscan.io/token/0x9b5528528656dbc094765e2abb79f293c21191b9)
- **Final Score: 2.8/5.0**

## Overview + Links

mHYPER is a yield-bearing tokenized certificate issued by Midas Software GmbH. Its price references a stablecoin-focused, market-neutral portfolio managed by [Hyperithm](https://www.hyperithm.com/). Yield accrues through the token price rather than rebasing. mHYPER is legally a qualified subordinated debt claim against the German issuer, not a direct ownership interest in strategy assets or a bankruptcy-remote vehicle.

**mHYPER is not principal-protected.** Negative strategy performance—including losses caused by poor allocation, hedging, leverage, liquidation, or counterparty decisions—can reduce portfolio NAV and the token's redemption value without any hack or smart-contract incident. Market-neutral positioning is a risk-management objective, not a guarantee against loss.

The strategy is materially onchain but not contractually tied to the token. Hyperithm deploys capital through Midas/Fordefi-controlled allocator wallets, Midas publishes an admin-set NAV price, and minting is not limited by an onchain proof-of-reserves check. The [Delta Y transparency dashboard](https://midas.deltay.xyz/mhyper) and [Midas Attestation Engine](https://docs.midas.app/transparency/the-midas-attestation-engine) provide meaningful visibility and independent checks, but wallet attribution and source data remain offchain assertions.

**Current statistics (August 19, 2026):**

- **NAV:** $39.41M ([NAV endpoint](https://api-midas.deltay.xyz/vaults/mHYPER/nav)); **price:** $1.121519 ([price endpoint](https://api-midas.deltay.xyz/vaults/mHYPER/prices)); **APY:** 5.73% ([APY endpoint](https://api-midas.deltay.xyz/vaults/mHYPER/apy))
- **Ethereum supply:** 34.55M mHYPER, verified through the token's [`totalSupply()`](https://etherscan.io/token/0x9b5528528656dbc094765e2abb79f293c21191b9) at [block 25,788,517](https://etherscan.io/block/25788517)
- **Tracked holders:** 954 across the dashboard's indexed chains ([Delta Y](https://midas.deltay.xyz/mhyper))
- **Midas platform TVL:** $128.82M ([DeFiLlama](https://defillama.com/protocol/midas-rwa))
- **KYC:** required; transfers are subject to Midas greenlist/blacklist controls

**Primary links:**

- [Midas mHYPER product page](https://midas.app/mhyper)
- [Midas documentation](https://docs.midas.app/)
- [mHYPER legal documents](https://docs.midas.app/resources/legal-product-documentation/mhyper)
- [Delta Y mHYPER transparency](https://midas.deltay.xyz/mhyper)
- [Hyperithm](https://www.hyperithm.com/)

## Contract Addresses

The core Ethereum contracts use OpenZeppelin transparent proxies with a shared `ProxyAdmin`.

| Contract | Proxy | Current implementation |
| --- | --- | --- |
| mHYPER token | [`0x9b5528528656DBC094765E2abB79F293c21191B9`](https://etherscan.io/address/0x9b5528528656DBC094765E2abB79F293c21191B9) | [`0x3f0ec5b26ec6e50907abea87a798bf395189bcd5`](https://etherscan.io/address/0x3f0ec5b26ec6e50907abea87a798bf395189bcd5) |
| mHYPER/USD oracle | [`0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68`](https://etherscan.io/address/0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68) | [`0xa19f5e16dc09641b17adf95bc950f71dbe5cb11b`](https://etherscan.io/address/0xa19f5e16dc09641b17adf95bc950f71dbe5cb11b) |
| mHYPER DataFeed | [`0x92004DCC5359eD67f287F32d12715A37916deCdE`](https://etherscan.io/address/0x92004DCC5359eD67f287F32d12715A37916deCdE) | [`0xE3240302aCEc5922b8549509615c16a97C05654A`](https://etherscan.io/address/0xE3240302aCEc5922b8549509615c16a97C05654A) |
| DepositVault | [`0xbA9FD2850965053Ffab368Df8AA7eD2486f11024`](https://etherscan.io/address/0xbA9FD2850965053Ffab368Df8AA7eD2486f11024) | [`0xd2B5f8f1DED3D6e00965b8215b57A33c21101c63`](https://etherscan.io/address/0xd2B5f8f1DED3D6e00965b8215b57A33c21101c63) |
| RedemptionVaultWithSwapper | [`0x6Be2f55816efd0d91f52720f096006d63c366e98`](https://etherscan.io/address/0x6Be2f55816efd0d91f52720f096006d63c366e98) | [`0x570C15bC5faF98531A8b351d69E22E41e3505E47`](https://etherscan.io/address/0x570C15bC5faF98531A8b351d69E22E41e3505E47) |
| MidasAccessControl | [`0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B`](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B) | [`0xDd5a54bA2ab379a5e642c58f98ad793a183960e2`](https://etherscan.io/address/0xDd5a54bA2ab379a5e642c58f98ad793a183960e2) |
| Shared ProxyAdmin | [`0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC) | N/A |
| LayerZero OFT adapter | [`0x148c86390a4ae6f7a02df5903bc0a89e8b4581a0`](https://etherscan.io/address/0x148c86390a4ae6f7a02df5903bc0a89e8b4581a0) | N/A |

The token implementation was [upgraded on August 13, 2026](https://etherscan.io/tx/0xc9d222894a1bb6a4a49bebf6fb26782a56058bd23cdd9f7e2d7c3f692c7fcb9c). The verified source refactors the inherited base token and exposes `burnGoverned()` for privileged burning. The effective privileged-burn authority is broadly consistent with the earlier implementation, but no published audit on the [Midas audit page](https://docs.midas.app/resources/audits) identifies this exact implementation.

## Audits and Historical Track Record

Midas publishes ten audits and contests from Hacken, Côme, and Sherlock covering the shared token, vault, access-control, oracle, and bridge infrastructure from 2023 through 2025. Earlier findings include centralized administration, excessive vault permissions, and a permissive burn role; several findings were acknowledged or accepted rather than removed. Midas also advertises $1M of active bounty capacity split between [Sherlock](https://audits.sherlock.xyz/bug-bounties/122) and [Cantina](https://cantina.xyz/bounties/d77405e5-99ce-4ba5-846c-885820b030e1).

- **mHYPER production history:** since July 15, 2025 ([deployment transaction](https://etherscan.io/tx/0x8dd0b1216e7970be06bd897ed57ebfba3f4213ec63d68aa622740608e93ffd5f))
- **Midas platform history:** since mid-2024; DeFiLlama records a $4.08M starting TVL and a $927.76M peak ([DeFiLlama](https://defillama.com/protocol/midas-rwa))
- **Price history:** $1.00 at inception to $1.121519; the current oracle is round 113 and was updated August 18, 2026 ([oracle](https://etherscan.io/address/0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68))
- **Known smart-contract loss:** none identified for mHYPER

## Funds Management

Hyperithm has operated since 2018 and describes itself as a 60+ person digital-asset manager focused on algorithmic, high-frequency, and market-neutral strategies. The current Japanese Financial Services Agency list of Specially Permitted Businesses for Qualified Institutional Investors includes `HYPERITHM`, corporate number `8010001189312`, for private placement and investment management. The FSA explicitly cautions that this notification regime is not an endorsement and is principally for professional-investor business ([FSA registry](https://www.fsa.go.jp/menkyo/menkyoj/tokurei.html)). Hyperithm is not present in the FSA's current cessation or uncontactable-business lists.

Midas's launch disclosure described Hyperithm as managing more than $300M, but Hyperithm's current public site does not publish live AUM. The manager has discretionary strategy authority inside Fordefi transaction policies; no smart contract restricts protocol selection, leverage, or concentration.

### Current allocation

Delta Y reports the following net allocations against $39.41M NAV. Its methodology uses the higher of onchain supply multiplied by oracle price and the sum of tracked allocator-wallet NAV. Consequently, `Unclassified` is a residual rather than proof of a specific offchain asset, and wallet-to-product attribution is maintained by the dashboard rather than enforced onchain.

| Allocation | Net value | NAV share | Main location / risk |
| --- | ---: | ---: | --- |
| Morpho V2 | $16.84M | 42.72% | USDC positions on Monad and Ethereum; exact vault is not identified by the public API |
| Hypercore | $12.69M | 32.20% | Hyperliquid spot, perpetual, and staking balances |
| Fluid | $4.62M | 11.72% | Leveraged positions across Ethereum, Arbitrum, and Plasma |
| Unclassified residual | $2.95M | 7.48% | Difference under the dashboard's max-NAV methodology |
| Onchain wallets | $1.27M | 3.22% | Predominantly idle USDC |
| Midas redemption vault | $0.74M | 1.88% | USDC available in the redemption path |
| Liquidity buffer | $0.28M | 0.70% | Additional backing-side liquidity |
| Other | $0.03M | 0.08% | Assets to deploy, Ethena, Kamino, Merkl, and dust |

The current portfolio has two large venue concentrations: Morpho V2 and Hypercore total 74.9% of NAV. Delta Y reports portfolio-wide gross leverage of approximately 1.82x. Fluid alone has approximately $36.85M of assets and $32.23M of liabilities, or about 7.97x assets/net equity. A public strategy notice also permits up to 10% of mHYPER AUM in the Hyperithm Degen Vault, which can supply a whitelisted mHYPER/USDC Morpho market and introduces recursive lending/rehypothecation risk. The public allocation API does not establish that all reported Morpho exposure is in that vault.

### Custody and multisig assessment

[Fordefi's Midas case study](https://web.fordefi.com/customer-stories/how-midas-brings-tokenized-investment-opportunities-on-chain-with-fordefis-defi-native-custody-2ti85) describes a policy engine that checks destination, asset, method, and notional. Transactions inside a pre-approved policy can execute automatically; exceptions route to Midas treasury, the asset manager, and an independent signer. Midas retains an administrative share and the manager retains an MPC share. This is a meaningful operational control, but the policy thresholds and current configuration are not publicly inspectable onchain.

The current dashboard identifies the following primary allocator wallets:

| Wallet | Current use |
| --- | --- |
| [`0x68e7...8264`](https://etherscan.io/address/0x68e7E72938db36a5CBbCa7b52c71DBBaaDfB8264) (Fordefi2) | Morpho V2 and most idle wallet assets |
| [`0xcd06...3186`](https://etherscan.io/address/0xcd0673721a489B1CeA0E2580FA304Bcb6ccA3186) (Fordefi3) | Hypercore / Hyperliquid |
| [`0x17B5...c7D2`](https://etherscan.io/address/0x17B504247b0D8c1856e541a70495dd622023c7D2) (Fordefi4) | Most Fluid positions |

The three dashboard-labeled Safe wallets do not establish a blanket multisig over current fund management:

- [`0xe7c2...Ec9a`](https://app.safe.global/home?safe=eth:0xe7c241B82c2cd7e96E6ea656b08752f8C01DEc9a) (Safe1) is **1-of-1**, solely owned by Fordefi2. Its 68 recorded transactions each require one confirmation.
- [`0xb81E...d475`](https://hyperevmscan.io/address/0xb81Eb60fA132535346eA93D46916A52a8c3dd475) (Safe2) is **1-of-1**, solely owned by Fordefi2 on HyperEVM.
- [`0xA4E1...c5eA`](https://app.safe.global/home?safe=eth:0xA4E16cEdBBaF9c35d2adC4eaD2e87343C3cec5eA) (Safe3) is a genuine **2-of-2** between Fordefi2 and a second owner. Its sole recorded transaction required both confirmations.

Delta Y does not currently attribute material strategy NAV to Safe1, Safe2, or Safe3. Most visible NAV is instead attributed directly to Fordefi2, Fordefi3, and Fordefi4. The appropriate positive control is therefore Fordefi's MPC and policy-based governance, plus the isolated 2-of-2 Safe—not a claim that the current portfolio as a whole is protected by an onchain multisig quorum.

These custody controls address transaction authorization, not investment quality. A trade can comply with Fordefi policy or receive every required signature and still lose money because of poor strategy selection, hedge execution, leverage, liquidation, market liquidity, or counterparty performance. Multisig and MPC controls therefore do not protect mHYPER holders from ordinary fund-management losses.

### Collateralization and legal claim

- mHYPER is a qualified subordinated debt obligation of Midas Software GmbH. Holders have no direct title to allocator-wallet assets, statutory segregation, or bankruptcy remoteness under this German GmbH structure ([legal structure](https://docs.midas.app/legal/legal-structure)).
- Midas's [qualified-subordination disclosure](https://docs.midas.app/legal/qualified-subordination) states that claims may be unenforceable before formal insolvency if payment would cause insolvency and that total loss is possible.
- The portfolio is stablecoin-focused but includes protocol, bridge, oracle, leverage, counterparty, and Hyperliquid execution risks.
- Administrators can grant mint authority without an onchain collateral check.

### Provability and attestations

The Delta Y dashboard classifies 92.5% of current NAV, a substantial level of observable detail. Its public API exposes wallet metadata, positions, assets, liabilities, chain allocations, and calculation methodology. The main limitations are the 7.48% residual, unidentified exact Morpho vaults, offchain wallet attribution, and lack of a contract-enforced reconciliation to token supply.

The [SAVE registry](https://etherscan.io/address/0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d) has continued operating. The latest mHYPER attestation was posted August 18, 2026, with two claims and two verifier records. The registry stores hashes, actors, and timestamps; it does not store the underlying balances or expose a retrievable source URI. SAVE therefore provides tamper-evident, multi-party evidence, but it neither proves live solvency by itself nor gates minting or oracle updates.

## Liquidity Risk

- **Primary exit:** Midas offers instant redemption when vault liquidity is available, subject to a 0.50% fee. Standard redemption depends on the risk manager setting funds aside; the product page says this is usually completed after two price updates but gives no binding completion time or execution price guarantee ([mHYPER product page](https://midas.app/mhyper)).
- **Backing-side liquidity:** the redemption-vault balance and liquidity buffer total approximately $1.02M, or 2.59% of NAV.
- **Direct DEX liquidity:** the GeckoTerminal-indexed mHYPER/USDC pool has effectively zero reserves and volume, so it is not a practical exit route ([GeckoTerminal](https://www.geckoterminal.com/eth/pools/0x8df7e5d4d7f09b1cb516443f49a165747a503462)).
- **Integrations:** DeFiLlama identifies approximately $1.33M in a Pendle mHYPER pool, $0.92M across Morpho mHYPER markets, and $1.16M in Strata tranches. These integrations improve utility but are not equivalent to spot redemption depth ([DeFiLlama Yields](https://defillama.com/yields)).

Liquidity remains dependent on active Midas/Hyperithm unwinds and redemption operations. The limited liquid buffer and strategy concentration make a large synchronized exit vulnerable to delay and price movement.

## Centralization & Control Risks

### Governance

- The shared [`ProxyAdmin`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC) is owned by a 48-hour [`MidasTimelockController`](https://etherscan.io/address/0xE3EEe3e0D2398799C884a47FC40C029C8e241852).
- `DEFAULT_ADMIN_ROLE` has two direct holders: a [`1-of-3 Safe`](https://app.safe.global/home?safe=eth:0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89) and Fordefi MPC address [`0xd419...1227`](https://etherscan.io/address/0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227). Each can grant or revoke operational roles without the timelock.
- The admin Safe's owners include a nested [`3-of-7 Safe`](https://app.safe.global/home?safe=eth:0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7), but its outer threshold remains one.
- Mint holders are the DepositVault, LayerZero adapter, and operator [`0x5683...4e25`](https://etherscan.io/address/0x5683de280d0c3967fba2f04d707fa1ef5a044e25). Burn holders are the RedemptionVault, LayerZero adapter, and the same operator.
- The oracle updater [`0xd1e0...a99f`](https://etherscan.io/address/0xd1e01471f3e1002d4eec1b39b7dbd7aff952a99f) can publish NAV without a timelock. Per-update movement is bounded to 0.35%, with absolute bounds of $0.10 and $1,000.

### Programmability

Strategy selection, leverage, NAV calculation, standard redemptions, KYC, and wallet attribution are offchain processes. The token price is admin-published rather than computed from reserves. SAVE attestation and the price update are separate processes: a valid registry record is not required before the oracle changes. The token can be paused, accounts can be blacklisted, and role holders can burn governed balances.

### External dependencies

Critical dependencies include Hyperithm, Midas, Fordefi, USDC and other stablecoins, Morpho, Hyperliquid/Hypercore, Fluid, relevant bridges, the NAV/attestation pipeline, and the legal issuer. The portfolio's current Morpho and Hypercore concentration makes those venues especially important.

The LayerZero bridge configuration remains the existing assessed 4-of-4 verification setup with 1,200 confirmations; its owner is the same 1-of-3 admin Safe. No bridge-record change is required for this reassessment.

## Operational Risk

Midas and Hyperithm are identified teams with institutional investors and multi-year operating histories. Midas publishes extensive technical, legal, risk, and transparency documentation. Hyperithm's current Japanese SPBQII filing and absence from adverse FSA status lists are positive regulatory evidence, but the notification framework is not a prudential license or regulator endorsement.

The current public legal-document page still exposes the July 17, 2025 base prospectus, which states a validity period ending July 17, 2026, and the 2025 mHYPER Final Terms. No replacement prospectus was found on that page as of this assessment. The product page continues to describe a public offer under the EU Prospectus Regulation. This is a documentation/control gap, not evidence that the product is operating unlawfully.

## Monitoring

1. Monitor oracle `AnswerUpdated` events, staleness beyond the expected twice-weekly cadence, and any price decrease or repeated maximum-deviation updates.
2. Alert on every `RoleGranted`, `RoleRevoked`, pause, blacklist, mint, burn, and proxy `Upgraded` event.
3. Reconcile total cross-chain supply, oracle price, Delta Y NAV, classified wallet NAV, and SAVE timestamps at least weekly.
4. Monitor the $1.02M redemption liquidity, standard-redemption completion times, and any change to fees or eligibility.
5. Track Morpho, Hyperliquid/Hypercore, and Fluid health, including borrowing utilization, liquidation thresholds, and bridge dependencies.
6. Track Fordefi policy/custody disclosures and any allocator-wallet or Safe owner/threshold change.

## Risk Summary

### Key strengths

- 92.5% of NAV is classified in a detailed public dashboard, with continuing multi-party SAVE attestations.
- Fordefi MPC custody includes policy limits and multi-party exception handling; Safe3 adds a genuine 2-of-2 control for its isolated flow.
- Ten published audits/contests, active $1M bounty capacity, and no identified mHYPER contract loss.
- A 48-hour timelock protects proxy upgrades, and the oracle limits per-update price movement.
- Hyperithm has an eight-year history and a current Japanese SPBQII notification.

### Key risks

- mHYPER is not principal-protected: ordinary management losses can reduce NAV and redemption value without a hack, including through poor allocation, hedging, leverage, liquidation, or counterparty decisions.
- mHYPER is an unsecured, qualified subordinated issuer claim with no statutory asset segregation.
- Morpho and Hypercore account for 74.9% of NAV; the portfolio is leveraged and Fluid is highly levered on a net-equity basis.
- The major current positions are in direct Fordefi allocator wallets, not behind a publicly verifiable onchain multisig quorum.
- Admins can change roles and the oracle without the upgrade timelock; minting is not reserve-gated.
- Direct DEX liquidity is negligible and primary redemptions depend on active offchain operations.
- The exact August 2026 token implementation is not named in the published audit list, and the displayed base prospectus has passed its stated validity date.

## Risk Score Assessment

### Critical risk gates

- **No audit:** PASS — broad audit coverage exists, although it does not identify the latest token implementation.
- **Unverifiable reserves:** PASS — most NAV is position-level and onchain-classified, supplemented by SAVE attestations; material offchain attribution assumptions remain.
- **Total centralization:** PASS — upgrades are timelocked and custody uses MPC policy controls, although role and oracle controls remain highly centralized.

### Category scoring

#### 1. Audits & Historical Track Record (20%): 1.8/5

Ten audits/contests, two active bounty programs, more than one year of mHYPER operation, and no identified loss are strong positives. The latest token implementation was deployed after the published audit set and is not explicitly covered, preventing a lower score.

#### 2. Centralization & Control Risks (30%): 3.5/5

- **Governance: 3.0** — upgrades have a 48-hour timelock, but either direct default admin can change operational roles immediately; the admin Safe is 1-of-3.
- **Programmability: 4.0** — reserves, strategy, leverage, NAV, and standard redemptions are not enforced end-to-end onchain.
- **External dependencies: 3.5** — Hyperithm, Midas, Fordefi, the issuer, price/attestation operators, stablecoins, and concentrated DeFi venues are critical.

`(3.0 + 4.0 + 3.5) / 3 = 3.5`

#### 3. Funds Management (30%): 2.9/5

- **Collateralization: 3.5** — assets are observable and policy-controlled, but holders have a subordinated issuer claim; concentration, leverage, recursive lending risk, discretionary management, and unbacked-mint authority remain.
- **Provability: 2.25** — 92.5% is classified at position level and SAVE has sustained current attestations. The 7.5% residual, exact-vault gaps, hash-only registry, offchain wallet attribution, and lack of onchain reconciliation prevent a stronger score.

`(3.5 + 2.25) / 2 = 2.875`, rounded to **2.9**.

#### 4. Liquidity Risk (15%): 3.0/5

Midas provides instant and standard redemption paths, but direct secondary liquidity is negligible, the immediately identified backing-side buffer is only 2.59% of NAV, and standard execution has no binding timing or price guarantee.

#### 5. Operational Risk (5%): 1.8/5

Both teams are public and established, documentation is substantial, and Hyperithm has current Japanese regulatory-notification evidence. The subordinated issuer structure and absence of a publicly posted replacement for the expired displayed prospectus add material operational/legal-documentation risk.

### Final score

| Category | Score | Weight | Weighted |
| --- | ---: | ---: | ---: |
| Audits & Historical | 1.8 | 20% | 0.36 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 2.9 | 30% | 0.87 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.8 | 5% | 0.09 |
| **Final Score** | | | **2.82 ≈ 2.8/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
| --- | --- | --- |
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |
| **N/A** | **Not Rated** | Terminal — do not use (exploited or wound down) |

**Final Risk Tier: Medium Risk (2.8/5.0).** Approved with enhanced monitoring and conservative exposure limits.

## Reassessment Triggers

- Any exploit, NAV discrepancy, delayed redemption, role change, proxy upgrade, allocator-wallet change, or regulatory action.
- Morpho or Hypercore exceeding 50% individually, portfolio gross leverage exceeding 2.0x, or unclassified NAV exceeding 15%.
- Redemption liquidity falling below 1% of NAV or a standard redemption remaining incomplete beyond two scheduled price updates.
- Publication of an audit covering the August 2026 token implementation.
- Publication or regulatory approval of a replacement base prospectus.
- A publicly verifiable change to Fordefi policies or Safe thresholds that materially changes unilateral fund-movement risk.
- Routine reassessment by November 19, 2026.

## Assessment History

| Date | Score | Notes |
| --- | ---: | --- |
| [February 7, 2026](https://github.com/yearn/risk-score/pull/31) | 3.3 | Initial assessment |
| [March 20, 2026](https://github.com/yearn/risk-score/pull/103) | 3.2 | Attestation Engine reassessment |
| [April 13, 2026](https://github.com/yearn/risk-score/pull/133) | 2.9 | Controls and provability reassessment |
| [June 13, 2026](https://github.com/yearn/risk-score/pull/248) | 2.9 | Allocation and role reassessment |
| [August 19, 2026](https://github.com/yearn/risk-score/pull/417) | 2.8 | Custody, allocation, and control reassessment |

## Appendix: Current Control Summary

```text
Users ──USDC──> DepositVault (MINT) ──> mHYPER
Users <─USDC── RedemptionVault (BURN) <─ mHYPER
                         │
                  admin-set NAV oracle

Midas/Hyperithm ── Fordefi MPC policy layer
                         │
          ┌──────────────┼──────────────┐
       Fordefi2       Fordefi3       Fordefi4
       Morpho/idle    Hypercore      Fluid
          │
     Safe1 1/1 ─ Safe2 1/1 ─ Safe3 2/2
     (no material current dashboard allocation to these Safes)

Admin Safe 1/3 ──> 48h Timelock ──> ProxyAdmin ──> upgrades
Admin Safe 1/3 ─┐
Fordefi admin ──┴──> AccessControl ──> roles without timelock
Oracle updater ─────> NAV oracle without timelock

Delta Y positions + offchain source data
          └──> SAVE verifiers/attestor ──> hash registry
                (evidence layer; does not enforce NAV or minting)
```
