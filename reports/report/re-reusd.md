# Protocol Risk Assessment: Re Protocol reUSD

- **Assessment Date:** March 6, 2026
- **Token:** reUSD (Re Protocol Deposit Token)
- **Chain:** Ethereum (primary), multi-chain (Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink)
- **Token Address:** [`0x5086bf358635B81D8C47C66d1C8b9E567Db70c72`](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72)
- **Final Score: 3.5/5.0**

## Overview + Links

Re Protocol is a decentralized on-chain reinsurance marketplace that tokenizes real-world reinsurance treaties, enabling DeFi participants to earn insurance-backed yields. The protocol is designed as a blockchain-native version of Lloyd's of London, connecting on-chain capital with regulated reinsurance programs.

**reUSD** is the protocol's principal-protected, yield-accruing deposit token (branded "Basis-Plus"). It is designed as the "stable core" of the Re Protocol, analogous to a tokenized money-market fund with blockchain composability.

**Yield Mechanism:**
reUSD accrues yield daily via a dual-source yield floor. At each daily valuation point (UTC 00:00), the protocol selects the higher of:
1. **Risk-Free Rate Path**: 7-day trailing average risk-free rate + 250 bps (aligned with short-term Treasuries)
2. **Ethena Basis Trade Path**: Current annualized Ethena USDe hedged basis yield + 250 bps (captures excess basis when the futures curve is steep)

The chosen "Applicable APY" is converted to a daily rate, and reUSD's **token price** (not quantity) increases daily. The price feed is pushed on-chain via Chainlink, with a daily oracle guardrail rejecting outsized single-day price changes above a configured threshold. Current APY is approximately 6-9+%.

**Capital Deployment:**
- Users deposit admitted assets (e.g., USDC) into the Insurance Capital Layer (ICL) smart contracts and receive reUSD
- A portion of the pool is converted into cash/T-Bills held in a **§114 Reinsurance Trust Account**, providing regulatory collateral to a Cayman-domiciled partner reinsurer (licensed by CIMA under Class B(iii))
- The off-chain entity issues **Surplus Notes** to the ICL, contractually locking in principal protection and an interest rate matching the Applicable APY
- Off-chain balances are attested daily by **The Network Firm** (with read-only account access) and published through a **Chainlink oracle**

**Key metrics (Mar 6, 2026):**
- reUSD Price: ~$1.052 ([CoinGecko](https://www.coingecko.com/en/coins/re-protocol-reusd))
- reUSD Market Cap: ~$111.5M (all chains)
- reUSD Ethereum Total Supply: ~87.2M tokens ([Etherscan](https://etherscan.io/token/0x5086bf358635b81d8c47c66d1c8b9e567db70c72))
- Holders (Ethereum): ~465
- 24h Trading Volume: ~$76.8K
- Re Protocol Written Premiums (2025): $168.8M
- Reinsurance Capacity Unlocked: >$134M

**Links:**

- [Protocol Documentation](https://docs.re.xyz/)
- [Protocol App (reUSD)](https://app.re.xyz/reusd)
- [What is reUSD?](https://docs.re.xyz/insurance-capital-layers/what-is-reusd)
- [How the Re Protocol Works](https://docs.re.xyz/protocol/how-the-re-protocol-work)
- [Security and Audits](https://docs.re.xyz/security-and-audits)
- [Smart Contract Addresses](https://docs.re.xyz/protocol/smart-contract-addresses)
- [Investor Protections](https://docs.re.xyz/investor-protections-and-risk-management)
- [Redemption Process and Liquidity](https://docs.re.xyz/protocol/redemption-process-and-liquidity)
- [DeFiLlama](https://defillama.com/protocol/re)
- [CoinGecko](https://www.coingecko.com/en/coins/re-protocol-reusd)
- [RWA.xyz](https://app.rwa.xyz/assets/reUSD)

## Contract Addresses

### Ethereum Network

| Contract | Address |
|----------|---------|
| reUSD Token | [`0x5086bf358635B81D8C47C66d1C8b9E567Db70c72`](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72) |
| reUSD Insurance Capital Layer (ICL) | [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) |
| reUSD ICL Custodial Wallet | [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) |
| Deposit Token Registry | [`0x73d37A98C0fCBd049BfFFfe67Bf9af36d603c0F6`](https://etherscan.io/address/0x73d37A98C0fCBd049BfFFfe67Bf9af36d603c0F6) |
| KYC Registry | [`0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995`](https://etherscan.io/address/0x82F1806AEab5Ecb9a485eb041d5Ed4940b123995) |
| Decentralized Fund | [`0xF04422E68f55E7C25724128692C3063A775472f2`](https://etherscan.io/address/0xF04422E68f55E7C25724128692C3063A775472f2) |
| Share Price Calculator | [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8) |
| Redemption Reserves Custodian | [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) |
| Daily Instant Redemption Vault | [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) |

### Protocol Controls (Ethereum)

| Role | Controller Address | Control Mechanism | Permissions |
|------|-------------------|-------------------|-------------|
| Oracle Config | [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee) | MPC 3-of-5 | Set price feeds for deposit and collateral tokens |
| Redemptions Config | [`0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8`](https://etherscan.io/address/0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8) | MPC 3-of-5 | Set redemption limits, top-up redemption vault |
| Access Manager | [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc) | MPC 5-of-8 | Assign/revoke access roles |
| Custodian Manager | [`0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9`](https://etherscan.io/address/0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9) | MPC 3-of-5 | Add/remove collateral custodians |

### Cross-Chain Deployments

| Chain | reUSD Address |
|-------|---------------|
| Avalanche | [`0x180aF87b47Bf272B2df59dccf2D76a6eaFa625Bf`](https://snowscan.xyz/address/0x180aF87b47Bf272B2df59dccf2D76a6eaFa625Bf) |
| Arbitrum | [`0x76cE01F0Ef25AA66cC5F1E546a005e4A63B25609`](https://arbiscan.io/address/0x76cE01F0Ef25AA66cC5F1E546a005e4A63B25609) |
| Base | [`0x7D214438D0F27AfCcC23B3d1e1a53906aCE5CFEa`](https://basescan.org/address/0x7D214438D0F27AfCcC23B3d1e1a53906aCE5CFEa) |
| Katana | [`0xe08853433fDBC504240455e295B644E0F44c3B29`](https://etherscan.io/address/0xe08853433fDBC504240455e295B644E0F44c3B29) |
| BNB Chain | [`0xbA9425EC55ee0E72216D18e0ad8BBbA2553bFb60`](https://bscscan.com/address/0xbA9425EC55ee0E72216D18e0ad8BBbA2553bFb60) |
| Ink | [`0x5BCf6B008bf80b9296238546BaCE1797657B05d6`](https://etherscan.io/address/0x5BCf6B008bf80b9296238546BaCE1797657B05d6) |

## Audits and Due Diligence Disclosures

Re Protocol has undergone auditing by 2 firms across 3+ audit engagements.

### Audit History

| # | Date | Scope | Firm | Key Findings | Report |
|---|------|-------|------|-------------|--------|
| 1 | Aug 2024 | Smart Contract Audit (DeFi) | Hacken | Multiple issues: centralized minting, unaudited libraries, large array iteration gas risk, centralized oracles, 42.11% branch coverage | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-defi-aug2024/) |
| 2 | Previous | Additional audits | Hacken | 3 total audits on record | [Hacken Audits](https://hacken.io/audits/re-protocol/) |
| 3 | Sep 2025 | Re Core (comprehensive) | Certora | 13 issues identified, all addressed and fixed. Formal verification and manual review. | [Certora](https://www.certora.com/reports/re-core) |

### Hacken Aug 2024 Findings (Detail)

- **Centralization**: USDRWA and ReToken contracts concentrate minting/burning in a single address
- **Unaudited Dependencies**: Protocol uses libraries/contracts without security audits
- **Gas Risk**: Iteration over large dynamic arrays risks denial of service from out-of-gas errors
- **Missing Governance Audit**: Governance code was not covered in the audit scope
- **Low Test Coverage**: 42.11% branch coverage -- deployment and basic interactions tested, multi-user interactions not thoroughly tested

### Bug Bounty

- **No Immunefi bug bounty program found** for Re Protocol

### Known Issues

- Centralized oracle price updates for reUSD (daily, admin-controlled)
- Centralized minting/burning via single controller addresses
- Governance code not yet audited

## Historical Track Record

- **Production History**: Re Protocol launched in late 2022. reUSD token has been in production for approximately 1+ year (Curve pool created ~8 months ago per GeckoTerminal).
- **TVL**: ~$111.5M market cap across all chains. ~87.2M reUSD on Ethereum.
- **Written Premiums**: $168.8M in 2025. >$134M in reinsurance capacity unlocked.
- **Exchange Rate History**: reUSD has appreciated from ~$1.00 to ~$1.052, representing ~5.2% cumulative yield since inception.
- **Incidents**: No reported security incidents, exploits, or hacks found for Re Protocol's reUSD on Rekt News or DeFi Llama hacks database. **Note**: Resupply Protocol (a different project with a different reUSD token at a different address) suffered a $9.6M exploit in June 2025 -- this is unrelated to Re Protocol/re.xyz.
- **Peg/Price Stability**: reUSD is not a stablecoin in the traditional sense. Its price is designed to monotonically increase (accruing yield), so "depegging" is not applicable in the same way. The token price should only ever go up.

## Funds Management

### Token Mechanism

reUSD is an **ERC-20 deposit token** that uses a **price-appreciation model** (not rebasing):
- Users deposit admitted assets (USDC) into the ICL smart contract
- Users receive reUSD tokens representing their deposit
- The reUSD token price increases daily based on the Applicable APY
- The price is updated on-chain via a **Chainlink oracle** fed by daily attestations from **The Network Firm**
- A **daily oracle guardrail** rejects outsized single-day price changes above the configured threshold

### Capital Deployment

1. **On-Chain**: A portion of capital remains on-chain as an instant redemption buffer in the Daily Instant Redemption Vault
2. **Off-Chain (§114 Trust)**: The majority of capital is deployed off-chain into a U.S.-domiciled §114 Reinsurance Trust Account, providing admitted collateral for the partner reinsurer's insurance programs
3. **Surplus Notes**: The off-chain entity issues legally binding surplus notes back to the ICL, contractually guaranteeing principal protection and the Applicable APY interest rate
4. **Yield Sources**: Delta-neutral ETH strategy (Ethena basis trade) or T-Bills, plus protocol spread from reinsurance premiums

### Accessibility

- **Deposits**: KYC/AML required (via SumSub and Chainalysis). Users must pass KYC checks because a portion of protocol capital is deployed with a Cayman-regulated reinsurance company (CIMA-regulated)
- **Instant Redemption**: Available from the on-chain instant liquidity buffer (up to ~10% of NAV). First-come, first-served. Atomic, same-block settlement
- **Quarterly Redemption**: Once instant buffer is exhausted (< 1% of supply), the contract reverts to "window-only" mode. Quarterly queue, pro-rata fulfillment
- **DEX Trading**: Can be traded on Curve reUSD/USDC pool
- **Not available to U.S. persons**
- **Fees**: TODO - need to verify fee structure

### Collateralization

- **On-chain buffer**: Instant redemption vault holds liquid assets (USDC) for immediate redemptions
- **Off-chain trust**: §114 Reinsurance Trust holds cash and T-Bills, attested daily by The Network Firm and published via Chainlink
- **Surplus Note protection**: Surplus notes rank junior to policyholders but contractually protect depositor principal
- **reUSDe as backstop**: reUSDe (the risk-bearing token) absorbs first-loss risk across the reinsurance portfolio, providing a backstop to prevent losses reaching reUSD holders

### Provability

- **reUSD price**: Updated daily via Chainlink oracle. **Not computed programmatically on-chain** -- the price is set by an admin-controlled oracle feed based on off-chain yield calculations
- **On-chain reserves**: Visible on-chain via the ICL contract and Redemption Reserves Custodian
- **Off-chain reserves**: Attested daily by The Network Firm (third-party accountant with read-only access) and published via Chainlink Proof of Reserve
- **Insurance performance**: Reinsurance returns are inherently off-chain and depend on claim experience over multi-year treaty periods

## Liquidity Risk

### Primary Exit Mechanisms

1. **Instant Redemption**: From the on-chain buffer. Atomic, same-block. Available until buffer is exhausted (< 1% of supply triggers window-only mode)
2. **Quarterly Redemption**: Processed pro-rata with available capital not reserved for reinsurance plus actuarially released funds
3. **DEX Swap**: Sell reUSD on Curve reUSD/USDC pool

### DEX Liquidity (Mar 6, 2026)

| Protocol | Chain | Pool | TVL | Notes |
|----------|-------|------|-----|-------|
| Curve | Ethereum | reUSD/USDC | ~$450K | ~217K reUSD + ~217K USDC |

### DeFi Integrations

| Protocol | Type | Notes |
|----------|------|-------|
| Curve | DEX | reUSD/USDC pool |
| Morpho | Lending | reUSD as collateral (mentioned in docs, 5x points for Re Airdrop) |
| Pendle | Yield | Compatible for yield tokenization |

### Liquidity Summary

- **Total DEX Liquidity**: ~$450K (very thin compared to market cap of ~$111.5M)
- **24h Trading Volume**: ~$76.8K
- **Instant redemption buffer**: Up to ~10% of NAV (actuarially determined), but exact current size unknown
- **Quarterly queue**: Pro-rata fulfillment, may not be fully met if capital is locked in reinsurance
- **KYC required**: Both for deposit and redemption through the protocol
- **Multi-chain**: Available on 6+ chains but DEX liquidity concentrated on Ethereum Curve pool

## Centralization & Control Risks

### Governance

- **MPC Wallets**: The protocol uses **MPC (Multi-Party Computation)** wallets rather than traditional multisigs. Multiple control wallets with role separation:
  - Oracle Config: MPC 3-of-5
  - Redemptions Config: MPC 3-of-5
  - Access Manager: MPC 5-of-8
  - Custodian Manager: MPC 3-of-5
- **Upgrade Pattern**: UUPS upgradeable contracts
- **Upgrade Authority**: Governance MPC (3-of-5)
- **Timelock**: 48-hour timelock on upgrades, no documented bypass path
- **No on-chain governance**: Protocol is currently governed by an expert-led council during initial phase. Planned transition to DAO in the future
- **MPC signers are not publicly identified**

### Programmability

- **reUSD price**: **NOT programmatic**. Updated daily via Chainlink oracle, fed by admin/The Network Firm attestations. Price is derived from off-chain yield calculations (risk-free rate or Ethena basis yield + 250 bps). A daily change guardrail rejects large moves above a threshold.
- **Deposits**: Require KYC verification through the KYC Registry contract
- **Redemptions**: Instant redemptions are programmatic (from buffer). Quarterly redemptions involve admin-managed processes
- **Capital deployment**: Off-chain, managed by the protocol team through the Fireblocks custody infrastructure

### External Dependencies

- **Chainlink**: Oracle for reUSD price feed and Proof of Reserve attestations
- **The Network Firm**: Third-party accountant for daily off-chain reserve verification
- **Ethena**: USDe/sUSDe for basis-trade yield source
- **Fireblocks**: Custody for idle on-chain capital (daily sweeps from ICL to Fireblocks vault)
- **§114 Reinsurance Trust**: Off-chain U.S.-domiciled trust bank for regulatory collateral
- **Cayman Reinsurer**: Partner reinsurance company (CIMA-licensed, Class B(iii))
- **SumSub / Chainalysis**: KYC/AML verification
- **Multiple blockchains**: Cross-chain deployments on Ethereum, Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink

## Operational Risk

- **Team**: CEO **Karn Saroya** (publicly known, LinkedIn/Twitter). Previously co-founded Cover (insurtech acquired/wound down) and Stylekick (acquired by Shopify). Veteran of the insurance-tech space for 10+ years. Other team members not prominently identified.
- **Company**: Re (re.xyz). Founded 2022.
- **Legal Structure**: Partner reinsurance company domiciled in Cayman Islands, regulated by CIMA. Off-chain trust accounts in U.S. jurisdiction (§114 Trust).
- **Investors**: $14M seed round at $100M post-money valuation. Investors include **Tribe Capital, Framework Ventures, Morgan Creek Digital, SiriusPoint**.
- **Documentation**: Comprehensive documentation at docs.re.xyz. Clear description of mechanism, risks, and investor protections.
- **Incident Response**: Emergency pause mechanism exists. Recovery wallets designated for each ICL (e.g., [`0xDf6bF2713b5c7CA724E684657280bC407938F447`](https://etherscan.io/address/0xDf6bF2713b5c7CA724E684657280bC407938F447) for initial ICL).
- **KYC/AML**: Required for all participants (SumSub + Chainalysis). Revoked KYC = request cancelled, tokens returned.
- **Not available to U.S. persons** and may be restricted in other jurisdictions.
- **Written Premiums**: $168.8M in 2025. Protocol has demonstrated real-world insurance business traction.

## Monitoring

### reUSD Price Monitoring

- **Share Price Calculator**: [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8)
  - Monitor reUSD price changes daily. Current: ~$1.052.
  - **Alert**: If price **decreases** (should only ever increase under normal operation).
  - **Alert**: If price growth **stops** for >48 hours (indicates oracle feed interruption or yield issue).
  - **Alert**: If single-day price change exceeds the configured guardrail threshold.

### ICL and Redemption Monitoring

- **reUSD ICL**: [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093)
  - Monitor for large deposits/withdrawals (>$1M).
  - Monitor total assets under management.

- **Daily Instant Redemption Vault**: [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147)
  - Monitor buffer balance. Alert if buffer drops below 1% of reUSD supply (triggers window-only mode).
  - Monitor for rapid drawdowns indicating potential stress.

- **Redemption Reserves Custodian**: [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8)
  - Monitor balance levels and replenishment events.

### Governance & Upgrade Monitoring

- **Oracle Config (MPC 3-of-5)**: [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee)
  - **Alert**: On any price feed configuration changes.

- **Access Manager (MPC 5-of-8)**: [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc)
  - **Alert**: On any role assignment or revocation.

- **UUPS Proxy Upgrades**: Monitor for `Upgraded` events on reUSD token and ICL contracts.
  - **Alert**: Immediately on any implementation change (48-hour timelock provides review window).

### Liquidity Monitoring

- **Curve reUSD/USDC pool**: Monitor TVL and balance ratio.
  - **Alert**: If pool TVL drops below $200K.
  - **Alert**: If pool imbalance exceeds 80/20 in either direction.

- **CoinGecko reUSD price**: Monitor for deviations from expected share price.
  - **Alert**: If CoinGecko price deviates >2% from on-chain share price.

### Off-Chain Reserve Monitoring

- **Chainlink Proof of Reserve**: Monitor for daily attestation updates.
  - **Alert**: If attestation is not updated for >48 hours.
  - **Alert**: If reported reserves fall below total reUSD supply * share price.

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| UUPS proxy upgrade events | Real-time | Critical |
| Access role changes | Real-time | Critical |
| Oracle config changes | Real-time | Critical |
| reUSD share price | Daily | High |
| Instant redemption buffer | Every 6 hours | High |
| Chainlink PoR attestation | Daily | High |
| DEX pool TVL/balance | Hourly | Medium |
| Total supply changes | Daily | Medium |

## Risk Summary

### Key Strengths

- **Principal protection**: reUSD is designed as the senior, principal-protected layer. reUSDe absorbs first-loss risk from reinsurance before any impact to reUSD holders.
- **Third-party reserve verification**: The Network Firm provides daily independent attestation of off-chain reserves, published via Chainlink Proof of Reserve.
- **Regulatory framework**: Partner reinsurer is CIMA-regulated. Capital held in §114 Reinsurance Trust with independent bank/custodian.
- **Role-separated MPC controls**: Multiple MPC wallets with distinct roles (oracle, redemptions, access, custodian) rather than a single admin key.
- **Upgrade timelock**: 48-hour timelock on UUPS proxy upgrades with no documented bypass.
- **Real business traction**: $168.8M in written premiums (2025), >$134M reinsurance capacity unlocked.
- **Certora formal verification**: Comprehensive audit with formal verification (Sept 2025).
- **Emergency mechanisms**: Pause functionality and designated recovery wallets.

### Key Risks

- **Off-chain price oracle**: reUSD price is NOT computed programmatically on-chain. It is set via admin-controlled Chainlink oracle based on off-chain yield calculations. This is a fundamental centralization risk -- the price can theoretically be manipulated by compromising the oracle feed or The Network Firm attestation.
- **Significant off-chain capital deployment**: Majority of assets are deployed off-chain into §114 Trust and reinsurance programs. This introduces counterparty risk with the trust bank, partner reinsurer, and custodians that cannot be verified fully on-chain.
- **Very thin DEX liquidity**: Only ~$450K in Curve pool vs ~$111.5M market cap. If instant redemption buffer is exhausted, secondary market exit is severely constrained.
- **KYC gating**: All deposits and redemptions require KYC. This limits the universe of users who can exit and creates regulatory/jurisdictional risk.
- **Quarterly redemption queue**: Once instant buffer is exhausted, redemptions are quarterly and pro-rata. Capital locked in reinsurance programs may not be available for 18+ months.
- **Reinsurance tail risk**: Underlying assets are exposed to insurance claim risk. While reUSDe absorbs first-loss, a catastrophic insurance event could potentially impact reUSD if reUSDe reserves are depleted.
- **No bug bounty program found**: No Immunefi or comparable bug bounty program identified.

### Critical Risks

- **Off-chain dependency concentration**: The protocol's value proposition depends on off-chain entities (Cayman reinsurer, §114 Trust, The Network Firm, Fireblocks) operating honestly and solvent. On-chain verification cannot fully cover off-chain risks.
- **Oracle manipulation**: A compromised oracle could misrepresent the reUSD price or reserve attestation. The daily oracle guardrail mitigates but does not eliminate this risk.
- **Liquidity mismatch**: reUSD represents liquid on-chain tokens backed by illiquid reinsurance capital locked for 18+ months. A bank-run scenario (all holders redeeming simultaneously) would quickly exhaust the instant buffer, leaving holders in a quarterly queue.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Audited by Hacken (Aug 2024) and Certora with formal verification (Sep 2025). 3+ total audits. **PASS**
- [ ] **Unverifiable reserves** -- Off-chain reserves attested daily by The Network Firm via Chainlink PoR, but ultimate verification relies on trust in off-chain entities. On-chain buffer is verifiable. **CONDITIONAL PASS** -- hybrid on-chain/off-chain model with third-party attestation.
- [x] **Total centralization** -- MPC wallets with role separation (3-of-5 and 5-of-8). 48-hour upgrade timelock. Not a single EOA. **PASS**

**All gates conditionally pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 2 audit firms (Hacken, Certora), 3+ engagements. Certora audit (Sep 2025) included formal verification and found 13 issues (all fixed). Hacken audit (Aug 2024) found centralization issues, low test coverage (42% branch), and unaudited dependencies.
- **Bug Bounty**: No Immunefi or comparable bug bounty program found.
- **Time in Production**: reUSD token ~1+ year in production. Re Protocol company since 2022.
- **TVL**: ~$111.5M market cap.
- **Incidents**: None reported for Re Protocol.

**Score: 3.0/5** -- Two audit firms with formal verification is positive, but only 3 audits total. No bug bounty program is a notable gap. Hacken findings showed concerning centralization and low test coverage. Moderate production time with no incidents.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- MPC wallets with role separation (3-of-5, 5-of-8)
- 48-hour timelock on UUPS proxy upgrades
- No on-chain governance (expert-led council, planned DAO transition)
- MPC signers not publicly identified
- KYC required for all participants

**Governance Score: 3.5** -- MPC wallets with role separation and timelock are positive. However, no on-chain governance, unidentified signers, and KYC-gated access are centralizing factors.

**Subcategory B: Programmability**

- reUSD price: **Off-chain oracle** (Chainlink feed from The Network Firm attestation). Not programmatically computed on-chain.
- Deposits: Gated by KYC Registry
- Instant redemptions: Programmatic from buffer
- Quarterly redemptions: Admin-managed process
- Capital deployment: Entirely off-chain

**Programmability Score: 4.0** -- The core value-determining function (reUSD price/yield) is set by an admin-controlled oracle, not computed programmatically on-chain. This is a significant centralization concern. Capital deployment is entirely off-chain.

**Subcategory C: External Dependencies**

- Chainlink oracle for price feed and PoR
- The Network Firm for daily attestations
- Ethena for basis-trade yield source
- Fireblocks for custody
- §114 Reinsurance Trust (off-chain bank)
- Cayman-domiciled partner reinsurer (CIMA-regulated)
- SumSub / Chainalysis for KYC/AML
- Multiple blockchains for cross-chain deployment

**Dependencies Score: 4.0** -- Heavy reliance on off-chain entities (trust bank, reinsurer, attestation firm, custody). Many single-point-of-failure dependencies that cannot be mitigated on-chain.

**Centralization Score = (3.5 + 4.0 + 4.0) / 3 = 3.83**

**Score: 3.8/5** -- Significant centralization due to off-chain price oracle, off-chain capital deployment, KYC gating, and heavy reliance on external entities.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- On-chain buffer: Verifiable, holds liquid assets for instant redemptions
- Off-chain trust: §114 Trust with daily attestation via The Network Firm / Chainlink PoR
- Surplus notes contractually protect principal
- reUSDe provides first-loss protection for reUSD
- Majority of capital deployed off-chain in reinsurance programs (locked 18+ months)

**Collateralization Score: 3.5** -- Hybrid on-chain/off-chain model. On-chain buffer is verifiable but represents only ~10% of NAV. Off-chain reserves rely on third-party attestation rather than direct on-chain verification. Reinsurance capital is illiquid (18+ month lock).

**Subcategory B: Provability**

- reUSD price: Set by oracle, not computed on-chain
- On-chain buffer: Fully verifiable
- Off-chain reserves: Attested daily by The Network Firm via Chainlink PoR
- Underlying reinsurance performance: Inherently off-chain, not verifiable on-chain

**Provability Score: 3.5** -- Third-party attestation (The Network Firm + Chainlink) is better than pure self-reporting but still relies on trust in off-chain entities. Core yield calculation is off-chain.

**Funds Management Score = (3.5 + 3.5) / 2 = 3.5**

**Score: 3.5/5** -- Hybrid model with meaningful off-chain components. Third-party attestation provides some assurance but cannot match fully on-chain provability.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Instant Exit**: Available from buffer (up to ~10% NAV), but exact current buffer size unknown
- **Quarterly Queue**: Pro-rata, may not be fully filled if capital locked in reinsurance
- **DEX Liquidity**: ~$450K in Curve pool -- extremely thin for ~$111.5M market cap
- **KYC Required**: Limits universe of participants who can exit
- **24h Volume**: ~$76.8K -- very low
- **No lending market integration** for collateral liquidation price discovery
- **Multi-chain**: Available on 6+ chains but concentrated liquidity

**Score: 4.0/5** -- Very thin DEX liquidity (~0.4% of market cap), KYC-gated redemptions, quarterly queue when buffer exhausted, and 18+ month capital lock in reinsurance create significant liquidity risk. Instant buffer provides some mitigation but is limited.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: CEO Karn Saroya publicly known, experienced in insurtech. Other team members not prominently identified.
- **Company**: Founded 2022, $14M seed at $100M valuation.
- **Investors**: Strong institutional investors (Tribe Capital, Framework Ventures, Morgan Creek Digital, SiriusPoint).
- **Documentation**: Comprehensive.
- **Legal Structure**: Cayman-domiciled reinsurer (CIMA-regulated), U.S. §114 Trust.
- **Incident Response**: Documented pause mechanism and recovery wallets.
- **KYC/AML**: Robust (SumSub + Chainalysis).
- **Regulatory risk**: Not available to U.S. persons. Cayman jurisdiction.

**Score: 2.5/5** -- CEO publicly identified, strong investors, comprehensive documentation, emergency mechanisms. Partially offset by limited team visibility and offshore (Cayman) jurisdiction.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 3.8 | 30% | 1.14 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.515** |

**Final Score: 3.5**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **3.5-4.5** | **Medium-High Risk** | Approved with enhanced monitoring and strict exposure limits |

**Final Risk Tier: Medium-High Risk**

---

reUSD is a novel product that bridges DeFi capital with traditional reinsurance markets. While the concept is innovative and the protocol demonstrates real business traction ($168.8M written premiums), the risk profile is elevated compared to purely on-chain yield products. The primary concerns are: (1) the off-chain price oracle -- reUSD's price is not computed programmatically on-chain but set via admin-controlled Chainlink feed, (2) heavy off-chain capital deployment with 18+ month lock-ups in reinsurance programs, (3) extremely thin DEX liquidity (~$450K vs ~$111.5M market cap), and (4) KYC-gated redemptions creating friction for exits. These are partially mitigated by third-party reserve attestation (The Network Firm + Chainlink PoR), the reUSDe first-loss protection layer, MPC wallet role separation, 48-hour upgrade timelock, and the regulatory framework (CIMA-regulated reinsurer, §114 Trust).

**Key conditions for exposure:**
- Monitor reUSD share price for any decreases (should only increase)
- Monitor Chainlink PoR attestation for daily updates
- Monitor instant redemption buffer balance (alert if < 1% of supply)
- Monitor UUPS proxy upgrades (48-hour review window)
- Track Curve reUSD/USDC pool liquidity depth
- Monitor for KYC policy or regulatory changes affecting redemption access

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (September 2026)
- **Governance-based**: Reassess when DAO governance is activated
- **Incident-based**: Reassess after any exploit, governance change, reinsurer insolvency, or material claim event
- **Liquidity-based**: Reassess if instant redemption buffer is exhausted or DEX liquidity drops below $200K
- **Regulatory-based**: Reassess if CIMA regulatory status changes or new jurisdictional restrictions apply
