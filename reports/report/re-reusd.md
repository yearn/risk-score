# Protocol Risk Assessment: Re Protocol reUSD

- **Assessment Date:** April 15, 2026
- **Token:** reUSD (Re Protocol Deposit Token)
- **Chain:** Ethereum (primary), multi-chain (Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink)
- **Token Address:** [`0x5086bf358635B81D8C47C66d1C8b9E567Db70c72`](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72)
- **Final Score: 3.3/5.0**

## Overview + Links

Re Protocol is a decentralized onchain reinsurance marketplace that tokenizes real-world reinsurance treaties, enabling DeFi participants to earn insurance-backed yields. The protocol is designed as a blockchain-native version of Lloyd's of London, connecting onchain capital with regulated reinsurance programs.

**reUSD** is the protocol's principal-protected, yield-accruing deposit token (branded "Basis-Plus"). It is designed as the "stable core" of the Re Protocol, analogous to a tokenized money-market fund with blockchain composability.

**Yield Mechanism:**
reUSD accrues yield daily via a dual-source yield floor. At each daily valuation point (UTC 00:00), the protocol selects the higher of:
1. **Risk-Free Rate Path**: 7-day trailing average risk-free rate + 250 bps (aligned with short-term Treasuries)
2. **Ethena Basis Trade Path**: Current annualized Ethena USDe hedged basis yield + 250 bps (captures excess basis when the futures curve is steep)

The chosen "Applicable APY" is converted to a daily rate, and reUSD's **token price** (not quantity) increases daily. The price feed is pushed onchain via Chainlink, with a daily oracle guardrail rejecting outsized single-day price changes above a configured threshold. Current APY is approximately 6-9+%.

**Capital Deployment:**
- Users deposit admitted assets (e.g., USDC) into the Insurance Capital Layer (ICL) smart contracts and receive reUSD
- A portion of the pool is converted into cash/T-Bills held in a **§114 Reinsurance Trust Account**, providing regulatory collateral to a Cayman-domiciled partner reinsurer (licensed by CIMA under Class B(iii))
- The offchain entity issues **Surplus Notes** to the ICL, contractually locking in principal protection and an interest rate matching the Applicable APY
- Offchain balances are attested daily by **The Network Firm** (with read-only account access) and published through a **Chainlink oracle**

**Key metrics (Apr 15, 2026):**
- reUSD Price: ~$1.072 ([CoinGecko](https://www.coingecko.com/en/coins/re-protocol-reusd))
- reUSD Market Cap: ~$179.4M (all chains, CoinGecko)
- reUSD Total Supply: ~167.36M tokens (CoinGecko); ~165.85M on Ethereum ([Etherscan](https://etherscan.io/token/0x5086bf358635b81d8c47c66d1c8b9e567db70c72))
- 24h Trading Volume: ~$3.3M
- TVL (DeFi Llama): ~$190.9M
- Total Deposits (Transparency Dashboard): ~$196.8M
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
- [Transparency Dashboard](https://app.re.xyz/transparency)
- [Backing & Redemptions (DeBank)](https://debank.com/bundles/220455/portfolio)

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
| Instant Redemption Interaction | [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) |
| Timelock Controller | [`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93) |

### Protocol Controls (Ethereum)

| Role | Controller Address | Control Mechanism | Timelock | Permissions |
|------|-------------------|-------------------|----------|-------------|
| Oracle Config | [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee) | MPC 3-of-5 | **None** | Set price feeds for deposit and collateral tokens |
| Redemptions Config | [`0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8`](https://etherscan.io/address/0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8) | MPC 3-of-5 | 48 hours | Set redemption limits, top-up redemption vault |
| Access Manager | [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc) | MPC 5-of-8 | 48 hours | Assign/revoke access roles |
| Custodian Manager | [`0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9`](https://etherscan.io/address/0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9) | MPC 3-of-5 | 48 hours | Add/remove collateral custodians |
| Upgrade / Admin | Governance MPC via Timelock | MPC 3-of-5 | 48 hours | Contract upgrades |

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

Re Protocol has undergone auditing by 3 firms across 5+ audit engagements.

### Audit History

| # | Date | Scope | Firm | Key Findings | Report |
|---|------|-------|------|-------------|--------|
| 1 | Sep 2024 | Smart Contract Audit (DeFi) | Hacken | 29 findings (0 Critical, 0 High, 4 Medium, 7 Low, 18 Observations), all resolved. Centralized minting, unaudited libraries, gas risk, 42.11% branch coverage | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-defi-aug2024/) |
| 2 | Dec 2024 | Smart Contract Audit | Hacken | Follow-up audit, issues remediated | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-contracts-nov2024/) |
| 3 | Apr 2025 | NAV Oracle Audit | Hacken | Focused on NAV oracle implementation, issues remediated | [Hacken](https://hacken.io/audits/re-protocol/sca-re-nav-oracle-mar2025/) |
| 4 | Sep 2025 | Re Core (comprehensive) | Certora | 13 issues identified, all addressed and fixed. Formal verification and manual review. | [Certora](https://www.certora.com/reports/re-core) |
| 5 | 2025 | Agreed-Upon Procedures (AUP) | The Network Firm | Independent verification of offchain operational controls and reserve attestation | [AUP Report](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf) |

### Hacken Aug 2024 Findings (Detail)

- **Centralization**: USDRWA and ReToken contracts concentrate minting/burning in a single address
- **Unaudited Dependencies**: Protocol uses libraries/contracts without security audits
- **Gas Risk**: Iteration over large dynamic arrays risks denial of service from out-of-gas errors
- **Missing Governance Audit**: Governance code was not covered in the audit scope
- **Low Test Coverage**: 42.11% branch coverage -- deployment and basic interactions tested, multi-user interactions not thoroughly tested

### Bug Bounty

- **No Immunefi bug bounty program found** for Re Protocol
- **No Safe Harbor** adoption found via [SEAL Safe Harbor Registry](https://safeharbor.securityalliance.org/)

### Known Issues

- Centralized oracle price updates for reUSD (daily, admin-controlled)
- Centralized minting/burning via single controller addresses
- Governance code not yet audited

## Historical Track Record

- **Production History**: Re Protocol launched in late 2022. reUSD token inception June 12, 2025 (per RWA.xyz). Curve pool created ~9 months ago per GeckoTerminal.
- **TVL**: ~$190.9M (DeFi Llama). ~$179.4M market cap across all chains. ~167.36M reUSD total supply (CoinGecko).
- **Written Premiums**: $168.8M in 2025. >$134M in reinsurance capacity unlocked.
- **Exchange Rate History**: reUSD has appreciated from ~$1.00 to ~$1.067, representing ~6.7% cumulative yield since inception (June 2025).
- **Incidents**: No reported security incidents, exploits, or hacks found for Re Protocol's reUSD on Rekt News or DeFi Llama hacks database. **Note**: Resupply Protocol (a different project with a different reUSD token at a different address) suffered a $9.6M exploit in June 2025 -- this is unrelated to Re Protocol/re.xyz.
- **Peg/Price Stability**: reUSD is not a stablecoin in the traditional sense. Its price is designed to monotonically increase (accruing yield), so "depegging" is not applicable in the same way. The token price should only ever go up.

## Funds Management

### Token Mechanism

reUSD is an **ERC-20 deposit token** that uses a **price-appreciation model** (not rebasing):
- Users deposit admitted assets (USDC) into the ICL smart contract
- Users receive reUSD tokens representing their deposit
- The reUSD token price increases daily based on the Applicable APY
- The price is updated onchain via a **Chainlink oracle** fed by daily attestations from **The Network Firm**
- A **daily oracle guardrail** rejects single-day price changes above **25 bps**
- **NAV formula**: `(Spread/365) + max[sUSDe(T)/sUSDe(T-7d) - 1 ; TBILL(T)/TBILL(T-7d) - 1] × (undeployed capital / total capital) + SOFR × (deployed capital / total capital)`. Spread = 250 bps.

### Capital Deployment

1. **Onchain**: At least 50% of deposits are kept in onchain backing (target per DD). Held as USDC and sUSDe in the ICL Custodial Wallet and redemption reserves.
2. **Offchain (§114 Trust)**: Remainder deployed offchain into U.S.-domiciled §114 Reinsurance Trust Accounts, providing admitted collateral for the partner reinsurer's insurance programs
3. **Surplus Notes**: The offchain entity issues legally binding surplus notes back to the ICL, contractually guaranteeing principal protection and the Applicable APY interest rate
4. **Yield Sources**: Delta-neutral ETH strategy (Ethena basis trade) or T-Bills, plus protocol spread from reinsurance premiums

### Reinsurance Portfolio (Nov 2025 LP Memo)

Re reinsures a diversified $174M portfolio of U.S. insurance programs emphasizing low-volatility risk across 26+ active reinsurance contracts:

| Line of Business | Allocation | Written Premium | Risk Profile |
|-----------------|-----------|----------------|-------------|
| Homeowners Insurance | 35% | $49M | Low Volatility |
| Auto Insurance | 30% | $42M | Low Volatility |
| Small Business Commercial | 20% | $28M | Low Volatility |
| Workers Compensation | 15% | $21M | Low Volatility |

- **Combined Ratio**: ~92% across 3 consecutive underwriting years (2022-2024), no capital impairment or reserve deterioration. Industry average: 93-95%.
- **Return on Capital**: 15-23% (intro deck). Estimated ROE: 12-19%.
- **Pipeline Dealflow**: $4B.
- **Portfolio Focus**: Lower-layer, short-duration, cat-light programs. Avoids catastrophe-driven and long-tail casualty segments.
- **Stress Testing** (capital structure): reUSD loss likelihood = **0.03%** at 135% combined ratio; reUSDe = 0.9%; Re Capital = 3.9%. Re Capital buffer ~$73M provides first-loss protection ahead of reUSDe and reUSD.

### Accessibility

- **Deposits**: KYC/AML required (via SumSub and Chainalysis). Users must pass KYC checks because a portion of protocol capital is deployed with a Cayman-regulated reinsurance company (CIMA-regulated)
- **Instant Redemption**: Available from the onchain instant liquidity buffer into USDC or sUSDe via `redeemInstant(uint256 shares, uint256 minPayout)` at [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e). Atomic, same-block settlement. Minimum redemption: 250 reUSD. Capped at 20% of daily redemption capacity and 10% per wallet. At the fastest drain rate, it would take ~5 days to exhaust all liquid onchain reserves (20% per day).
- **Windowed Redemption**: Once instant buffer is exhausted, the protocol opens a redemption window (minimum 24 hours). Requests fulfilled pro-rata based on available capital. Proceeds must be claimed within two months.
- **DEX Trading**: Can be traded on Fluid (reUSD/USDC ~$12M) and multiple Curve pools (reUSD/scrvUSD, sfrxUSD/reUSD, reUSD/sUSDe, reUSD/USDC) totaling ~$29.4M liquidity
- **Not available to U.S. persons**
- **Fees**: Redemption fee of 6 bps (0.06%) applied at the interaction layer ([docs](https://docs.re.xyz/insurance-capital-layers/what-is-reusd)). No documented deposit fees, management fees, or performance fees. RWA.xyz reports 0.18% subscription and 0.18% redemption fees — discrepancy with docs may reflect different fee tiers or methodology. Onchain data shows ~$1,535 total deposit fees collected historically, suggesting a small deposit fee mechanism exists in the contracts (also flagged in Hacken audit finding F-2024-5214 "Unclaimed Deposit Fees Unaccounted For").

### Collateralization

- **Onchain reserve target**: >=50% of deposits kept in onchain backing (USDC, sUSDe, and potentially T-bill wrappers such as BUIDL), per DD questionnaire
- **Onchain buffer**: Instant redemption vault and Redemption Reserves Custodian hold liquid assets (USDC and sUSDe) for immediate redemptions
- **Offchain trust**: §114 Reinsurance Trust holds cash and T-Bills in NAIC-compliant banks (including Coinbase, Wells Fargo), attested daily by The Network Firm and published via Chainlink
- **Surplus Note protection**: Surplus notes rank junior to policyholders but contractually protect depositor principal
- **Re Capital buffer**: ~$73M subordinated first-loss layer ahead of reUSDe and reUSD
- **reUSDe as backstop**: reUSDe (the risk-bearing token) absorbs first-loss risk across the reinsurance portfolio, providing a backstop to prevent losses reaching reUSD holders. Stress testing shows reUSD loss likelihood = 0.03% at 135% combined ratio

### Provability

- **reUSD price**: Updated daily via Chainlink oracle. **Not computed programmatically onchain** -- the price is set by an admin-controlled oracle feed based on offchain yield calculations
- **Onchain reserves**: Visible onchain via the ICL contract and Redemption Reserves Custodian
- **Offchain reserves**: Attested daily by The Network Firm (third-party accountant with read-only access) and published via Chainlink Proof of Reserve
- **Insurance performance**: Reinsurance returns are inherently offchain and depend on claim experience over multi-year treaty periods
- **Minting requires backing**: All ICL deposit paths (`deposit`, `depositFromCustodian`, `processPrestakedDeposit`) enforce `safeTransferFrom` — backing tokens must be transferred to the ICL before reUSD is minted (verified in source at [implementation `0x06d4acc104b974cd99bf22e4572f48a051e59670`](https://etherscan.io/address/0x06d4acc104b974cd99bf22e4572f48a051e59670)). However, the reUSD token contract has an unrestricted `mint(address, uint256)` gated only by `MINTER_ROLE`. Currently only the ICL holds this role. If `MINTER_ROLE` were granted to another address via Access Manager (MPC 5-of-8, 48h timelock), that address could mint without backing.

## Liquidity Risk

### Primary Exit Mechanisms

1. **Instant Redemption**: From the onchain buffer. Atomic, same-block. Available until buffer is exhausted (< 1% of supply triggers window-only mode)
2. **Quarterly Redemption**: Processed pro-rata with available capital not reserved for reinsurance plus actuarially released funds
3. **DEX Swap**: Sell reUSD on Curve reUSD/USDC pool

### DEX Liquidity (Apr 15, 2026)

| Protocol | Chain | Pool | TVL | 24h Volume |
|----------|-------|------|-----|------------|
| Fluid | Ethereum | reUSD/USDC | ~$12.0M | ~$3.14M |
| Curve | Ethereum | reUSD/scrvUSD | ~$10.0M | ~$130K |
| Curve | Ethereum | sfrxUSD/reUSD | ~$3.5M | ~$29K |
| Curve | Ethereum | reUSD/sUSDe | ~$1.45M | ~$270K |
| Curve | Ethereum | reUSD/fxUSD | ~$503K | ~$13K |
| Curve | Ethereum | reUSD/USDC | ~$450K | ~$432K |
| Curve | Ethereum | reUSDe/sUSDe | ~$543K | ~$308K |
| Blackhole | Avalanche | reUSD/USDC | ~$956K | ~$12K |
| DEX | Avalanche | reUSD/USDC | ~$509K | ~$3K |

### DeFi Integrations

| Protocol | Type | Notes |
|----------|------|-------|
| Fluid | DEX/Lending | reUSD/USDC pool (~$12M TVL, ~$3.14M daily volume). Major trading venue — most swap volume routes through Fluid |
| Curve | DEX | Multiple pools: reUSD/scrvUSD (~$10M), sfrxUSD/reUSD (~$3.5M), reUSD/sUSDe (~$1.45M), reUSD/fxUSD (~$503K), reUSD/USDC (~$450K) |
| Morpho | Lending | reUSD as collateral |
| Euler | Lending | reUSD as collateral |
| Silo | Lending | reUSD as collateral |
| TermMax | Lending | reUSD as collateral |
| Pendle | Yield | Compatible for yield tokenization |

Total lending integrations support over $100M in borrow demand per the DD questionnaire.

### Liquidity Summary

- **Total DEX Liquidity**: ~$29.4M across Fluid, Curve, and other venues (~16.4% of market cap). Significant improvement from ~$450K at initial assessment. Fluid (~$12M) is the largest single venue by volume.
- **24h Trading Volume**: ~$10.8M
- **Instant redemption buffer**: The Daily Instant Redemption Vault at [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) holds $0 USDC but ~6.19M sUSDe as of Apr 15, 2026. The Redemption Reserves Custodian ([`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8), an EOA) holds ~53.26M sUSDe. Instant redemptions can be fulfilled in USDC or sUSDe, subject to daily and per-wallet caps. The vault holds no USDC, but instant redemption liquidity exists via sUSDe.
- **Instant Redemption Interaction Contract**: [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) — exposes `redeemInstant(uint256 shares, uint256 minPayout)` for instant redemptions.
- **Onchain capital**: ICL Custodial Wallet holds ~$5.97M USDC + ~7.77M sUSDe (Apr 15, 2026). ICL contract itself holds $0.
- **Quarterly queue**: Pro-rata fulfillment, may not be fully met if capital is locked in reinsurance
- **KYC required**: Both for deposit and redemption through the protocol
- **Multi-chain**: Available on 6+ chains. Liquidity concentrated on Ethereum Curve pools (~$16M) with ~$1.5M on Avalanche.

## Centralization & Control Risks

### Governance

- **MPC Wallets**: The protocol uses **MPC (Multi-Party Computation)** wallets controlled by Resilience Foundation governance structure. Multiple control wallets with role separation:
  - Oracle Config: MPC 3-of-5 — **no timelock**
  - Redemptions Config: MPC 3-of-5 — 48-hour timelock
  - Access Manager: MPC 5-of-8 — 48-hour timelock
  - Custodian Manager: MPC 3-of-5 — 48-hour timelock
  - Upgrade / Admin: Governance MPC 3-of-5 — 48-hour timelock
- **Upgrade Pattern**: UUPS upgradeable contracts
- **Upgrade Authority**: Governance MPC (3-of-5) via Timelock Controller ([`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93))
- **Timelock**: 48-hour timelock on upgrades, redemptions, access, and custodian changes. **Oracle Config has no timelock** — price feed changes take effect immediately.
- **No onchain governance**: Protocol is currently governed by an expert-led council (Resilience Foundation). Planned transition to DAO in the future
- **MPC signers**: Re Team members — not publicly identified for security reasons (per DD)

### Programmability

- **reUSD price**: **NOT programmatic**. Updated daily via Chainlink oracle, fed by admin/The Network Firm attestations. Price is derived from offchain yield calculations (risk-free rate or Ethena basis yield + 250 bps). A daily change guardrail rejects large moves above a threshold.
- **Deposits**: Require KYC verification through the KYC Registry contract
- **Redemptions**: Instant redemptions are programmatic (from buffer). Quarterly redemptions involve admin-managed processes
- **Capital deployment**: Offchain, managed by the protocol team through the Fireblocks custody infrastructure

### External Dependencies

- **Chainlink**: Oracle for reUSD price feed and Proof of Reserve attestations
- **The Network Firm**: Third-party accountant for daily offchain reserve verification
- **Ethena**: USDe/sUSDe for basis-trade yield source
- **Fireblocks**: Custody for idle onchain capital (daily sweeps from ICL to Fireblocks vault)
- **§114 Reinsurance Trust**: Offchain U.S.-domiciled trust bank for regulatory collateral
- **Cayman Reinsurer**: Partner reinsurance company (CIMA-licensed, Class B(iii))
- **SumSub / Chainalysis**: KYC/AML verification
- **Multiple blockchains**: Cross-chain deployments on Ethereum, Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink

## Operational Risk

- **Team**: CEO **Karn Saroya** (publicly known, LinkedIn/Twitter). Previously co-founded Cover (YC-backed insurtech) and Stylekick (acquired by Shopify); part of early Shopify team. Reinsurance operations headed by **former CEO of Willis Programs**. Veteran team in insurance-tech for 10+ years.
- **Company**: Re (re.xyz). Founded 2022. Issuer entity: Resilience BVI Ltd. (British Virgin Islands, per [RWA.xyz](https://app.rwa.xyz/assets/reUSD)). Governance controlled by Resilience Foundation.
- **Legal Structure**: Partner reinsurance company domiciled in Cayman Islands, regulated by CIMA. Offchain trust accounts in U.S. jurisdiction (§114 Trust, NAIC-compliant banks). Token issuer domiciled in BVI.
- **Investors**: $14M seed round at $100M post-money valuation. Investors include **Electric Capital, Tribe Capital, Stratos, SiriusPoint, Exor, Defy, Framework Ventures, Morgan Creek Digital**.
- **Custody**: Fireblocks MPC custody for onchain assets; Coinbase and Wells Fargo as banking/custody counterparties for certain reinsurance company assets; §114 Trust accounts at NAIC-compliant banks for offchain reserves.
- **Documentation**: Comprehensive documentation at docs.re.xyz. Clear description of mechanism, risks, and investor protections.
- **Runtime Monitoring**: ChainAnalysis for onchain transaction monitoring.
- **Incident Response**: Emergency pause mechanism exists. Recovery wallets designated for each ICL (e.g., [`0xDf6bF2713b5c7CA724E684657280bC407938F447`](https://etherscan.io/address/0xDf6bF2713b5c7CA724E684657280bC407938F447) for initial ICL).
- **KYC/AML**: Required for all participants (SumSub + Chainalysis). Revoked KYC = request cancelled, tokens returned.
- **Not available to U.S. persons** and may be restricted in other jurisdictions.
- **Written Premiums**: $178M gross written premium to date (intro deck). $4B pipeline dealflow. Protocol has demonstrated real-world insurance business traction.

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
  - Monitor balance levels (both USDC and sUSDe) and replenishment events.

- **Instant Redemption Interaction Contract**: [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e)
  - Monitor `redeemInstant` events for redemption volume and frequency.
  - **Alert**: On changes to daily or per-wallet redemption caps.
  - **Alert**: If redemption reverts increase (may indicate liquidity exhaustion).

### Governance & Upgrade Monitoring

- **Oracle Config (MPC 3-of-5)**: [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee)
  - **Alert**: On any price feed configuration changes.

- **Access Manager (MPC 5-of-8)**: [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc)
  - **Alert**: On any role assignment or revocation.

- **UUPS Proxy Upgrades**: Monitor for `Upgraded` events on reUSD token and ICL contracts.
  - **Alert**: Immediately on any implementation change (48-hour timelock provides review window).

### Liquidity Monitoring

- **Fluid reUSD/USDC pool**: Monitor TVL and volume. Largest trading venue by volume (~$12M TVL).
  - **Alert**: If Fluid pool TVL drops below $5M.

- **Curve reUSD pools** (reUSD/scrvUSD, sfrxUSD/reUSD, reUSD/sUSDe, reUSD/USDC): Monitor TVL and balance ratio.
  - **Alert**: If total Curve reUSD DEX liquidity drops below $5M (currently ~$16M).
  - **Alert**: If any pool imbalance exceeds 80/20 in either direction.

- **CoinGecko reUSD price**: Monitor for deviations from expected share price.
  - **Alert**: If CoinGecko price deviates >2% from onchain share price.

### Offchain Reserve Monitoring

- **Chainlink Proof of Reserve**: Monitor for daily attestation updates.
  - **Alert**: If attestation is not updated for >48 hours.
  - **Alert**: If reported reserves fall below total reUSD supply * share price.

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| UUPS proxy upgrade events | Real-time | Critical |
| Access role changes | Real-time | Critical |
| Oracle config changes | Real-time | Critical |
| Instant redemption cap changes | Real-time | Critical |
| reUSD share price | Daily | High |
| Instant redemption buffer (USDC + sUSDe) | Every 6 hours | High |
| Instant redemption interaction events | Every 6 hours | High |
| Chainlink PoR attestation | Daily | High |
| DEX pool TVL/balance | Hourly | Medium |
| Total supply changes | Daily | Medium |

## Risk Summary

### Key Strengths

- **Principal protection with deep capital structure**: reUSD is the senior tranche with 0.03% modeled loss likelihood at 135% combined ratio. Re Capital (~$73M) and reUSDe provide subordinated first-loss protection.
- **Strong underwriting track record**: 92% combined ratio across 3 consecutive years (2022-2024), outperforming industry average (93-95%). No capital impairment or reserve deterioration. $178M gross written premium.
- **Third-party reserve verification**: The Network Firm provides daily independent attestation of offchain reserves, published via Chainlink Proof of Reserve. AUP report published.
- **Regulatory framework**: Partner reinsurer is CIMA-regulated. Capital held in §114 Reinsurance Trust at NAIC-compliant banks (Coinbase, Wells Fargo).
- **Comprehensive audit coverage**: 5+ audits across 3 firms (Hacken, Certora, The Network Firm), including formal verification and dedicated NAV oracle audit.
- **Role-separated MPC controls**: Multiple MPC wallets with distinct roles (oracle, redemptions, access, custodian) rather than a single admin key. 48-hour timelock on upgrades.
- **Emergency mechanisms**: Pause functionality, designated recovery wallets, ChainAnalysis runtime monitoring.

### Key Risks

- **Offchain price oracle with no timelock**: reUSD price is NOT computed programmatically onchain. It is set via admin-controlled Chainlink oracle based on offchain yield calculations. The Oracle Config MPC (3-of-5) has **no timelock** — price feed changes take effect immediately. This is a fundamental centralization risk.
- **Significant offchain capital deployment**: Majority of assets are deployed offchain into §114 Trust and reinsurance programs. This introduces counterparty risk with the trust bank, partner reinsurer, and custodians that cannot be verified fully onchain.
- **Instant redemption vault holds no USDC**: The Daily Instant Redemption Vault holds $0 USDC but ~6.19M sUSDe. The Redemption Reserves Custodian holds ~53.26M sUSDe. Instant redemptions can be fulfilled in sUSDe, but USDC-denominated instant exits are unavailable.
- **DEX liquidity improved but still limited**: ~$29.4M across Fluid and Curve (~16.4% of ~$179.4M market cap). Significant improvement from ~$450K.
- **KYC gating**: All deposits and redemptions require KYC. This limits the universe of users who can exit and creates regulatory/jurisdictional risk.
- **Quarterly redemption queue**: Once instant buffer is exhausted, redemptions are windowed and pro-rata. Capital release from reinsurance programs is reevaluated quarterly (per DD).
- **Reinsurance tail risk**: Underlying assets are exposed to insurance claim risk. While reUSDe absorbs first-loss, a catastrophic insurance event could potentially impact reUSD if reUSDe reserves are depleted.
- **No bug bounty program found**: No Immunefi or comparable bug bounty program identified.

### Critical Risks

- **Offchain dependency concentration**: The protocol's value proposition depends on offchain entities (Cayman reinsurer, §114 Trust, The Network Firm, Fireblocks) operating honestly and solvent. Onchain verification cannot fully cover offchain risks.
- **Oracle manipulation**: A compromised oracle could misrepresent the reUSD price or reserve attestation. The daily oracle guardrail mitigates but does not eliminate this risk.
- **Liquidity mismatch**: reUSD represents liquid onchain tokens partially backed by offchain reinsurance capital. Capital release is reevaluated quarterly, and programs are short-duration and cat-light (per performance memo). The instant redemption vault holds no USDC (sUSDe only — ~6.19M in vault, ~53.26M in Redemption Reserves Custodian). In a bank-run scenario, sUSDe redemption liquidity plus ~$29.4M in DEX liquidity would need to absorb exits for ~$179.4M in outstanding tokens; windowed queue handles the remainder.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Audited by Hacken (Aug 2024) and Certora with formal verification (Sep 2025). 3+ total audits. **PASS**
- [ ] **Unverifiable reserves** -- Offchain reserves attested daily by The Network Firm via Chainlink PoR, but ultimate verification relies on trust in offchain entities. Onchain buffer is verifiable. **CONDITIONAL PASS** -- hybrid onchain/offchain model with third-party attestation.
- [x] **Total centralization** -- MPC wallets with role separation (3-of-5 and 5-of-8). 48-hour upgrade timelock. Not a single EOA. **PASS**

**All gates conditionally pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 audit firms (Hacken, Certora, The Network Firm), 5+ engagements. Certora audit (Sep 2025) included formal verification and found 13 issues (all fixed). Hacken conducted 3 audits (Sep 2024, Dec 2024, Apr 2025 NAV oracle). The Network Firm performed AUP on offchain reserve attestation (Oct 2025).
- **Bug Bounty**: No Immunefi or comparable bug bounty program found.
- **Time in Production**: reUSD token ~10 months in production (inception June 2025). Re Protocol company since 2022.
- **TVL**: ~$179.4M market cap, ~$190.9M TVL (DeFi Llama).
- **Incidents**: None reported for Re Protocol.

**Score: 2.5/5** -- Three audit firms with formal verification and 5+ engagements is solid coverage. Certora formal verification and dedicated NAV oracle audit strengthen confidence. The Network Firm AUP adds offchain verification assurance. No bug bounty program remains a notable gap. Moderate production time (~10 months) with no incidents and TVL >$100M.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- MPC wallets with role separation (3-of-5, 5-of-8)
- 48-hour timelock on UUPS proxy upgrades
- No onchain governance (expert-led council, planned DAO transition)
- MPC signers not publicly identified
- KYC required for all participants

**Governance Score: 3.5** -- MPC wallets with role separation and timelock are positive. However, no onchain governance, unidentified signers, and KYC-gated access are centralizing factors.

**Subcategory B: Programmability**

- reUSD price: **Offchain oracle** (Chainlink feed from The Network Firm attestation). Not programmatically computed onchain.
- Deposits: Gated by KYC Registry
- Instant redemptions: Programmatic from buffer
- Quarterly redemptions: Admin-managed process
- Capital deployment: Entirely offchain

**Programmability Score: 4.0** -- The core value-determining function (reUSD price/yield) is set by an admin-controlled oracle, not computed programmatically onchain. This is a significant centralization concern. Capital deployment is entirely offchain.

**Subcategory C: External Dependencies**

- Chainlink oracle for price feed and PoR
- The Network Firm for daily attestations
- Ethena for basis-trade yield source
- Fireblocks for custody
- §114 Reinsurance Trust (offchain bank)
- Cayman-domiciled partner reinsurer (CIMA-regulated)
- SumSub / Chainalysis for KYC/AML
- Multiple blockchains for cross-chain deployment

**Dependencies Score: 4.0** -- Heavy reliance on offchain entities (trust bank, reinsurer, attestation firm, custody). Many single-point-of-failure dependencies that cannot be mitigated onchain.

**Centralization Score = (3.5 + 4.0 + 4.0) / 3 = 3.83**

**Score: 3.8/5** -- Significant centralization due to offchain price oracle, offchain capital deployment, KYC gating, and heavy reliance on external entities.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Onchain buffer: Verifiable, holds liquid assets for instant redemptions
- Offchain trust: §114 Trust with daily attestation via The Network Firm / Chainlink PoR
- Surplus notes contractually protect principal
- reUSDe provides first-loss protection for reUSD
- Majority of capital deployed offchain in reinsurance programs (capital release reevaluated quarterly per DD)

**Collateralization Score: 3.5** -- Hybrid onchain/offchain model. Onchain buffer is verifiable but represents only ~10% of NAV. Offchain reserves rely on third-party attestation rather than direct onchain verification. Offchain reinsurance capital release is reevaluated quarterly.

**Subcategory B: Provability**

- reUSD price: Set by oracle, not computed onchain
- Onchain buffer: Fully verifiable
- Offchain reserves: Attested daily by The Network Firm via Chainlink PoR
- Underlying reinsurance performance: Inherently offchain, not verifiable onchain

**Provability Score: 3.5** -- Third-party attestation (The Network Firm + Chainlink) is better than pure self-reporting but still relies on trust in offchain entities. Core yield calculation is offchain.

**Funds Management Score = (3.5 + 3.5) / 2 = 3.5**

**Score: 3.5/5** -- Hybrid model with meaningful offchain components. Third-party attestation provides some assurance but cannot match fully onchain provability.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Instant Exit**: The Daily Instant Redemption Vault holds $0 USDC but ~6.19M sUSDe. The Redemption Reserves Custodian holds ~53.26M sUSDe. Instant redemptions via [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) can be fulfilled in USDC or sUSDe, subject to daily and per-wallet caps. USDC instant exits are currently unavailable; sUSDe instant exits are available.
- **Quarterly Queue**: Pro-rata, may not be fully filled if capital locked in reinsurance
- **DEX Liquidity**: ~$29.4M across Fluid and Curve (~16.4% of ~$179.4M market cap). Largest venue by volume: Fluid reUSD/USDC (~$12M). Significant improvement from ~$450K at initial assessment.
- **24h Volume**: ~$3.3M
- **KYC Required**: Limits universe of participants who can exit via protocol redemption
- **Onchain capital**: ICL Custodial Wallet holds ~$5.97M USDC + ~7.77M sUSDe, but this is not directly accessible for redemptions without admin action
- **Multi-chain**: Available on 6+ chains, liquidity concentrated on Ethereum

**Score: 3.0/5** -- DEX liquidity improved significantly from ~$450K to ~$29.4M (65x increase) across Fluid and Curve, providing a viable secondary market exit. The instant redemption vault holds ~6.19M sUSDe and the Redemption Reserves Custodian holds ~53.26M sUSDe — sUSDe-denominated instant exits are available with daily/wallet caps (20% daily, 10% per wallet). Combined protocol-native sUSDe redemptions (~$59.4M) plus DEX liquidity (~$29.4M) cover a meaningful portion of the ~$179.4M market cap. KYC-gated protocol redemptions and offchain capital deployment remain material concerns, but the absence of USDC instant exits is partially mitigated by sUSDe availability.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: CEO Karn Saroya publicly known, experienced in insurtech. Reinsurance ops led by former CEO of Willis Programs. Core dev team from Cover (YC) and early Shopify.
- **Company**: Founded 2022, $14M seed at $100M valuation.
- **Investors**: Strong institutional investors (Electric Capital, Tribe Capital, Stratos, SiriusPoint, Exor, Defy, Framework Ventures, Morgan Creek Digital).
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
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.8 | 30% | 1.14 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.27** |

**Final Score: 3.3**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk**

---

reUSD is a novel product that bridges DeFi capital with traditional reinsurance markets. The protocol demonstrates real business traction ($178M gross written premium, ~$179.4M market cap, 92% combined ratio across 3 years) with a deep capital structure (Re Capital ~$73M + reUSDe first-loss). The risk profile is moderate. The primary concerns are: (1) the offchain price oracle with no timelock — reUSD's price is not computed programmatically onchain but set via admin-controlled Chainlink feed, (2) heavy offchain capital deployment in reinsurance programs (capital release reevaluated quarterly), (3) the instant redemption vault holds no USDC (sUSDe-denominated exits available via ~6.19M sUSDe in vault + ~53.26M sUSDe in Redemption Reserves Custodian), and (4) KYC-gated redemptions creating friction for exits. DEX liquidity has improved significantly to ~$29.4M across Fluid and Curve (up from ~$450K), providing a viable secondary exit. These risks are partially mitigated by third-party reserve attestation (The Network Firm + Chainlink PoR), 5+ audits including formal verification, MPC wallet role separation, 48-hour upgrade timelock, and the regulatory framework (CIMA-regulated reinsurer, §114 Trust at NAIC-compliant banks).

**Key conditions for exposure:**
- Monitor reUSD share price for any decreases (should only increase)
- Monitor Chainlink PoR attestation for daily updates
- **Monitor instant redemption buffer — track both USDC and sUSDe balances in vault and Redemption Reserves Custodian**
- Monitor instant redemption interaction contract [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) for redemption events and limit changes
- Monitor UUPS proxy upgrades (48-hour review window)
- Track DEX liquidity depth across Fluid (reUSD/USDC) and Curve pools (reUSD/scrvUSD, sfrxUSD/reUSD, reUSD/sUSDe, reUSD/USDC)
- Monitor for KYC policy or regulatory changes affecting redemption access
- Monitor ICL Custodial Wallet balance (~$5.97M USDC + ~7.77M sUSDe onchain) for large outflows

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (September 2026) or sooner if instant redemption vault remains empty for >30 days
- **Governance-based**: Reassess when DAO governance is activated
- **Incident-based**: Reassess after any exploit, governance change, reinsurer insolvency, or material claim event
- **Liquidity-based**: Reassess if DEX liquidity drops below $5M or if instant redemption vault remains empty for >30 days
- **Regulatory-based**: Reassess if CIMA regulatory status changes or new jurisdictional restrictions apply

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     VAULT / TOKEN LAYER                            │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────────┐                      │
│  │  reUSD Token  │◄──│  Share Price          │◄── Chainlink Oracle  │
│  │  (ERC-20,     │    │  Calculator           │    (daily price      │
│  │   UUPS Proxy) │    │  0xd1D1..11b05B8      │     attestation)     │
│  │  0x5086..0c72 │    └──────────────────────┘                      │
│  └──────┬───────┘                                                   │
│         │ mint/burn                                                  │
│  ┌──────▼───────────────────┐    ┌─────────────────────────┐       │
│  │  Insurance Capital Layer  │───►│  ICL Custodial Wallet    │       │
│  │  (ICL)                    │    │  (Fireblocks)            │       │
│  │  0x4691..3093             │    │  0x295F..689E             │       │
│  └──────┬───────────────────┘    └───────────┬─────────────┘       │
│         │                                     │                     │
│  ┌──────▼───────────────────┐                │ sweep               │
│  │  Daily Instant Redemption │                ▼                     │
│  │  Vault                    │    ┌──────────────────────┐         │
│  │  0x5C45..B147             │    │  Offchain Deployment  │         │
│  └──────────────────────────┘    │  (~$94M to §114 Trust)│         │
│                                   └──────────────────────┘         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     PROTOCOL LAYER                                  │
│                                                                     │
│  ┌────────────────────┐   ┌────────────────────┐                   │
│  │  Deposit Token      │   │  KYC Registry       │                   │
│  │  Registry           │   │  (SumSub/Chainalysis)│                  │
│  │  0x73d3..03F6       │   │  0x82F1..9995       │                   │
│  └────────────────────┘   └────────────────────┘                   │
│                                                                     │
│  ┌────────────────────┐   ┌────────────────────┐                   │
│  │  Decentralized Fund │   │  Redemption Reserves│                   │
│  │  0xF044..72f2       │   │  Custodian (EOA)    │                   │
│  └────────────────────┘   │  0x9eA3..ADF8       │                   │
│                            └────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     UNDERLYING LAYER                                │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Chainlink       │  │  The Network Firm │  │  §114 Reinsurance│  │
│  │  (Price Feed +   │  │  (Daily offchain  │  │  Trust (U.S.)    │  │
│  │   Proof of       │  │   attestation)    │  │  Cash + T-Bills  │  │
│  │   Reserve)       │  │                   │  │                  │  │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐                         │
│  │  Ethena (USDe)   │  │  Cayman Reinsurer │                        │
│  │  (Basis trade    │  │  (CIMA-licensed,  │                        │
│  │   yield source)  │  │   Class B(iii))   │                        │
│  └─────────────────┘  └──────────────────┘                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     GOVERNANCE                                      │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │  Oracle Config       │  │  Redemptions Config  │                  │
│  │  MPC 3-of-5          │  │  MPC 3-of-5          │                  │
│  │  0x49BC..0Aee        │  │  0xEE16..47f8        │                  │
│  │  Set price feeds     │  │  Set redemption      │                  │
│  │                      │  │  limits, top-up vault│                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │  Access Manager      │  │  Custodian Manager   │                  │
│  │  MPC 5-of-8          │  │  MPC 3-of-5          │                  │
│  │  0x80a6..AFc         │  │  0x9b6d..eC9         │                  │
│  │  Assign/revoke roles │  │  Add/remove          │                  │
│  │                      │  │  custodians           │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘

Fund Flow:
  User ──USDC──► ICL (KYC gate) ──mint──► reUSD Token
  ICL ──sweep──► Custodial Wallet ──deploy──► §114 Trust (offchain)
  §114 Trust ──surplus notes──► ICL (principal + yield guarantee)
  Chainlink ◄── The Network Firm (daily attestation) ──► Share Price Calculator ──► reUSD price

Trust Boundaries:
  ⚠ Onchain/offchain boundary at ICL Custodial Wallet sweep
  ⚠ Price oracle is admin-controlled (not programmatic)
  ⚠ Redemption Reserves Custodian is an EOA
  ⚠ KYC Registry gates all deposits and protocol redemptions
```
