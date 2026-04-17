# Protocol Risk Assessment: Re Protocol reUSD

- **Assessment Date:** April 17, 2026
- **Token:** reUSD (Re Protocol Deposit Token)
- **Chain:** Ethereum (primary), multi-chain (Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink)
- **Token Address:** [`0x5086bf358635B81D8C47C66d1C8b9E567Db70c72`](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72)
- **Final Score: 3.5/5.0** (at Medium / Elevated tier boundary)

## Overview + Links

Re Protocol is a decentralized onchain reinsurance marketplace that tokenizes real-world reinsurance treaties, enabling DeFi participants to earn insurance-backed yields. The protocol is designed as a blockchain-native version of Lloyd's of London, connecting onchain capital with regulated reinsurance programs.

**reUSD** is the protocol's principal-protected, yield-accruing deposit token (branded "Basis-Plus"). It is designed as the "stable core" of the Re Protocol, analogous to a tokenized money-market fund with blockchain composability.

**Yield Mechanism:**
reUSD accrues yield daily via a dual-source yield floor. At each daily valuation point (UTC 00:00), the protocol selects the higher of:
1. **Risk-Free Rate Path**: 7-day trailing average risk-free rate + 250 bps (aligned with short-term Treasuries)
2. **Ethena Basis Trade Path**: Current annualized Ethena USDe hedged basis yield + 250 bps (captures excess basis when the futures curve is steep)

The chosen "Applicable APY" is converted to a daily rate, and reUSD's **token price** (not quantity) increases daily. Current APY is approximately 6-9+%.

**Onchain price mechanism (verified Apr 17, 2026):** reUSD's share price is stored in the `SharePriceCalculator` [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8) and written by `setSharePrice(uint256)`. The `SharePriceCalculator` contract itself only enforces `newPrice != 0`, but the **standard writer is `NAVConsumer`** [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — a **Chainlink Functions + Chainlink Automation consumer**, with DON ID `fun-ethereum-mainnet-1`, subscription `85`, target time `23:45 UTC` daily. `NAVConsumer` enforces a deviation guardrail onchain (`deviationCheckEnabled = true`, `maxDeviationBps = 1000` — i.e. **10% max change per update**; docs' "25 bps" figure is the operational target, not the onchain cap) and was audited by Hacken in April 2025 (repo `github.com/resilience-foundation/nav-oracle`, 8 findings, all resolved). The `PriceRouter` [`0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66`](https://etherscan.io/address/0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66) reads `SharePriceCalculator` via a `SharePriceOracle` [`0x0764BFa862164D28799F31e7e1e7206F5177B6bB`](https://etherscan.io/address/0x0764BFa862164D28799F31e7e1e7206F5177B6bB); the same router reads sUSDe via a `SimpleOracle` [`0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) wrapping Chainlink's `sUSDe/USD` aggregator [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099). **Residual concern:** both `SharePriceCalculator.PRICE_SETTER_ROLE` and all admin/updater roles on `NAVConsumer` (including `EMERGENCY_UPDATER_ROLE` which can call `forceNAVUpdate` and `setDeviationCheckEnabled` which can disable the guardrail) are held by the same EOA `0x6C15B25E9750Dccb698C1a4023f34015bFe57649`. That EOA can bypass `NAVConsumer` entirely and write directly to `SharePriceCalculator`, or disable the deviation check. **No Chainlink Proof-of-Reserve aggregator is consumed onchain** — the NAV Oracle publishes share price, not reserves (see Appendix A.8).

**Capital Deployment:**
- Users deposit admitted assets (e.g., USDC) into the Insurance Capital Layer (ICL) smart contracts and receive reUSD
- A portion of the pool is converted into cash/T-Bills held in a **§114 Reinsurance Trust Account**, providing regulatory collateral to a Cayman-domiciled partner reinsurer (licensed by CIMA under Class B(iii))
- The offchain entity issues **Surplus Notes** to the ICL, contractually locking in principal protection and an interest rate matching the Applicable APY
- Offchain balances are attested daily by **The Network Firm** (with read-only account access). The protocol's docs and marketing reference Chainlink Proof-of-Reserve — onchain investigation shows no Chainlink PoR feed is consumed by Re's deployed contracts. The reUSD *share price* is written directly via `setSharePrice` on the Share Price Calculator; Chainlink is used only for sUSDe pricing (Chainlink sUSDe/USD feed [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099)).

**Key metrics (Apr 17, 2026):**
- reUSD Price: ~$1.072 ([CoinGecko](https://www.coingecko.com/en/coins/re-protocol-reusd)); verified onchain as `1.0724` via Share Price Calculator `getSharePrice()`
- reUSD Market Cap: ~$186.7M (all chains, CoinGecko)
- reUSD Total Supply: ~174.1M tokens (CoinGecko); ~172.6M on Ethereum ([Etherscan](https://etherscan.io/token/0x5086bf358635b81d8c47c66d1c8b9e567db70c72))
- 24h Trading Volume: ~$7.3M (CoinGecko)
- TVL (DeFi Llama): ~$198.1M ([DeFi Llama](https://defillama.com/protocol/re))
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
| NAV Consumer (Chainlink Functions + Automation) | [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) |
| Redemption Reserves Custodian | [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) |
| Daily Instant Redemption Vault | [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) |
| Instant Redemption (impl., fee + limits) | [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) |
| Instant Redemption Interaction | [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) |
| Share Token Minter/Burner (LZ wrapper) | [`0x0dFb42aa18CEeD719617cd554304F6cA412A6b18`](https://etherscan.io/address/0x0dFb42aa18CEeD719617cd554304F6cA412A6b18) |
| ReMintBurnAdapter (LayerZero OFT) | [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85) |
| Redemption Reserve Calculator | [`0x7E499842E7634cce793FFD5D44383BB4a2F086e0`](https://etherscan.io/address/0x7E499842E7634cce793FFD5D44383BB4a2F086e0) |
| PriceRouter | [`0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66`](https://etherscan.io/address/0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66) |
| SharePriceOracle (reUSD PriceFeed) | [`0x0764BFa862164D28799F31e7e1e7206F5177B6bB`](https://etherscan.io/address/0x0764BFa862164D28799F31e7e1e7206F5177B6bB) |
| SimpleOracle (sUSDe PriceFeed wrapper) | [`0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) |
| Chainlink sUSDe/USD aggregator | [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099) |
| AccessManager (OZ v5) | [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8) |
| Governance Safe (3-of-5) | [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) |
| Timelock Controller | [`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93) |

### Protocol Controls (Ethereum)

All MPC team descriptions below come from the protocol's DD questionnaire and cannot be independently verified onchain (MPC signer sets are offchain). What IS onchain-verifiable: (a) the `Governance Safe` is a **3-of-5 Safe multisig** (not MPC) at [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) holding DEFAULT_ADMIN on reUSD/ICL and PROPOSER/CANCELLER on the Timelock; (b) the Timelock min delay is `172800` seconds = 48 hours; (c) an OpenZeppelin v5 `AccessManager` contract at [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8) is the `authority()` for the Instant Redemption contract and is administered by the `Access Admin` EOA below.

| Role | Controller Address | Control Mechanism (per docs) | Onchain Authority | Permissions |
|------|-------------------|------------------------------|-------------------|-------------|
| Oracle Admin | [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee) | MPC 3-of-5 (docs), **no timelock** | EOA; role on Share Price Calculator not verified — current `PRICE_SETTER_ROLE` holders onchain: `0x6c15b25e...bfe57649` and `0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6` | Configure price feeds (per docs) |
| Redemptions Admin | [`0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8`](https://etherscan.io/address/0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8) | MPC 3-of-5 (docs), 48 hours | EOA | Set redemption limits, top-up redemption vault (per docs) |
| Access Admin | [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc) | MPC 5-of-8 (docs), 48 hours | EOA; observed calling `grantRole` / `labelRole` on `AccessManager` [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8) | Admin of OZ `AccessManager` (roles for Instant Redemption, etc.) |
| Custodian Manager | [`0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9`](https://etherscan.io/address/0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9) | MPC 3-of-5 (docs), 48 hours | EOA; holds `CUSTODIAN_MANAGER_ROLE` (0x0792b378…) on ICL — **verified** | Add/remove collateral custodians |
| Governance (Upgrades / DEFAULT_ADMIN) | [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) | **Safe 3-of-5** (onchain-verified; not MPC) | Holds DEFAULT_ADMIN + UPGRADER on reUSD and ICL, PROPOSER + CANCELLER on Timelock | Contract upgrades, role administration (routed through Timelock for timelocked actions) |
| Timelock executor | [`0x4BFea59b948a1a0FAC3C8C40BfD86E0e740738F3`](https://etherscan.io/address/0x4BFea59b948a1a0FAC3C8C40BfD86E0e740738F3) | EOA (onchain-verified) | Holds EXECUTOR_ROLE on the Timelock | Execute queued timelock transactions after 48h delay |

### Cross-Chain Deployments

| Chain | reUSD Address |
|-------|---------------|
| Avalanche | [`0x180aF87b47Bf272B2df59dccf2D76a6eaFa625Bf`](https://snowscan.xyz/address/0x180aF87b47Bf272B2df59dccf2D76a6eaFa625Bf) |
| Arbitrum | [`0x76cE01F0Ef25AA66cC5F1E546a005e4A63B25609`](https://arbiscan.io/address/0x76cE01F0Ef25AA66cC5F1E546a005e4A63B25609) |
| Base | [`0x7D214438D0F27AfCcC23B3d1e1a53906aCE5CFEa`](https://basescan.org/address/0x7D214438D0F27AfCcC23B3d1e1a53906aCE5CFEa) |
| Katana | [`0xe08853433fDBC504240455e295B644E0F44c3B29`](https://katanascan.com/address/0xe08853433fDBC504240455e295B644E0F44c3B29) |
| BNB Chain | [`0xbA9425EC55ee0E72216D18e0ad8BBbA2553bFb60`](https://bscscan.com/address/0xbA9425EC55ee0E72216D18e0ad8BBbA2553bFb60) |
| Ink | [`0x5BCf6B008bf80b9296238546BaCE1797657B05d6`](https://explorer.inkonchain.com/address/0x5BCf6B008bf80b9296238546BaCE1797657B05d6) |

## Audits and Due Diligence Disclosures

Re Protocol has undergone auditing by 3 firms across 5+ audit engagements.

### Audit History

| # | Date | Scope | Firm | Key Findings | Report |
|---|------|-------|------|-------------|--------|
| 1 | Sep 2024 | Smart Contract Audit (DeFi) | Hacken | 29 findings (0 Critical, 0 High, 4 Medium, 7 Low, 18 Observations), all resolved. Centralized minting, unaudited libraries, gas risk, 42.11% branch coverage | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-defi-aug2024/) |
| 2 | Dec 2024 | Smart Contract Audit | Hacken | Follow-up audit, issues remediated | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-contracts-nov2024/) |
| 3 | Apr 2025 | NAV Oracle Audit | Hacken | Scope: the Chainlink-Functions-based `NAVConsumer` + related code at `github.com/resilience-foundation/nav-oracle` (commits `ee7e98…` / `e3dd86ef…`). 8 findings, all resolved. The audited contract IS deployed and active onchain at [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6), holds `PRICE_SETTER_ROLE` on the `SharePriceCalculator`, and runs daily at 23:45 UTC. | [Hacken](https://hacken.io/audits/re-protocol/sca-re-nav-oracle-mar2025/) |
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
- **TVL**: ~$198.1M (DeFi Llama, Apr 17, 2026). ~$186.7M market cap across all chains (CoinGecko). ~174.1M reUSD total supply (CoinGecko); ~172.6M on Ethereum (onchain `totalSupply()`).
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
- The price is written onchain by `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6), a **Chainlink Functions + Automation consumer** that calls `SharePriceCalculator.setSharePrice` with a daily NAV computed offchain by the Chainlink DON. `NAVConsumer` enforces a deviation guardrail (`maxDeviationBps = 1000` = 10% onchain; docs' "25 bps" figure is the operational target, not the onchain cap) and was audited by Hacken in April 2025 (`github.com/resilience-foundation/nav-oracle`).
- An EOA also holds `PRICE_SETTER_ROLE` directly on `SharePriceCalculator`, and all admin roles on `NAVConsumer` (including the ability to disable the deviation check). That EOA can bypass the Chainlink Functions path and write arbitrary prices. See "Residual concern" in the Overview.
- The Network Firm performs daily offchain attestations of the §114 Trust balances. **No Chainlink Proof-of-Reserve aggregator is consumed onchain** — the onchain NAV Oracle publishes the share price, not reserves (see Appendix A.8).
- **NAV formula**: `(Spread/365) + max[sUSDe(T)/sUSDe(T-7d) - 1 ; TBILL(T)/TBILL(T-7d) - 1] × (undeployed capital / total capital) + SOFR × (deployed capital / total capital)`. Spread = 250 bps.

### Capital Deployment

1. **Onchain**: At least 50% of deposits are kept in onchain backing (target per DD). Held as USDC and sUSDe in the ICL Custodial Wallet and redemption reserves.
2. **Offchain (§114 Trust)**: Remainder deployed offchain into U.S.-domiciled §114 Reinsurance Trust Accounts, providing admitted collateral for the partner reinsurer's insurance programs
3. **Surplus Notes**: The offchain entity issues legally binding surplus notes back to the ICL, contractually guaranteeing principal protection and the Applicable APY interest rate
4. **Yield Sources**: Delta-neutral ETH strategy (Ethena basis trade) or T-Bills, plus protocol spread from reinsurance premiums

### Reinsurance Portfolio (summary)

Re reinsures a ~$174M diversified portfolio of U.S. insurance programs across 26+ active reinsurance contracts. Re classifies the book as "low-volatility" and claims a ~92% combined ratio over 2022-2024 with no capital impairment. Stress testing asserted by Re gives reUSD a 0.03% loss likelihood at a 135% combined ratio (reUSDe 0.9%, Re Capital 3.9%). **All portfolio composition, combined-ratio, ROE, pipeline, and stress-testing figures are sourced from Re's own LP memo and intro deck — none are independently verified.** Full figures with source tags are in [Appendix: Reinsurance Portfolio & Performance Claims (Re-provided)](#appendix-reinsurance-portfolio--performance-claims-re-provided).

### Capital Structure: reUSDe (Junior Tranche)

reUSDe is the protocol's junior/first-loss tranche ([docs](https://docs.re.xyz/insurance-capital-layers/what-is-reusde)). It absorbs underwriting losses before they reach reUSD in exchange for a share of underwriting profits (historically 16-25% net annual returns per docs).

**Loss waterfall** (losses absorbed in order):
1. **Re Capital** (~$73M) — first-loss buffer, starts taking losses once portfolio combined ratio reaches 105%.
2. **reUSDe** (junior) — starts taking losses once combined ratio reaches 115% (i.e. after Re Capital is exhausted). Absorbs losses up to the 115-135% combined ratio range.
3. **reUSD** (senior) — only impaired if combined ratio exceeds **135%**, meaning both Re Capital and all reUSDe reserves are depleted.

Re's marketing attaches modeled impairment likelihoods to each threshold (Re Capital **~3.9%** at 105% CR; reUSDe **~0.9%** at 115%; reUSD **~0.03%** at 135%). These three numbers come from **a single chart on page 1 of the Nov 2025 LP Memo** — the *"Re Capital Structure and Risk-Remote Design"* panel — and represent the modeled probability of the portfolio combined ratio reaching each threshold. **The model is undisclosed**: no distributional assumptions, correlation structure, simulation count, calibration window, confidence intervals, or actuarial sign-off are published. The tail figures also assume the subordinated buffer is fully intact at time of stress. See [Appendix A.6](#a6-stress-testing-loss-likelihoods) for the verbatim source quote and caveats.

**reUSDe mechanics:**
- Price based on quarterly-refreshed target NAV derived from actuarial reports; compounds daily but surplus realization occurs quarterly
- Idle capital earns sUSDe basis-trade yield until called for underwriting
- Redemptions are quarterly (72h window at fiscal quarter start), pro-rata if requests exceed capacity; unfilled rolls to next quarter
- If losses deplete the buffer, later reinsurance profits first restore reUSD/reUSDe capital before recapitalizing the buffer layer (per DD)
- Issued by Resilience (BVI) Ltd.; Resilience Foundation is the Agent of both reUSD and reUSDe token holders
- reUSD is currently protected by ~$86M of subordinated assets (per DD: Re Capital + reUSDe combined)

### Accessibility

- **Deposits**: KYC/AML required (via SumSub and Chainalysis). Users must pass KYC checks because a portion of protocol capital is deployed with a Cayman-regulated reinsurance company (CIMA-regulated).
- **KYC on redemption — enforced onchain** (verified Apr 17, 2026): every redemption entrypoint reverts with `KYCRequired` if `kyc.isKYCApproved(msg.sender) == false`. Checked functions in the `InstantRedemptionInteraction` contract [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e): `redeemInstant`, `submitWindowRequest`, `adjustWindowRequest`, `claimWindowPayout`. The same check is repeated inside `InstantRedemption._processRedemption` on the user argument. **A KYC revocation therefore blocks not only new deposits but also the holder's ability to redeem onchain through the protocol.** Selling on a DEX remains possible because DEX routers do not gate transfers on KYC.
- **reUSD — Instant Redemption**: available from the onchain instant liquidity buffer via `redeemInstant(uint256 shares, uint256 minPayout)` on the Interaction contract (which delegates to the `InstantRedemption` implementation at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40)). Atomic, same-block settlement. **Onchain-verified parameters** on Apr 17, 2026: `minRedemption = 0.01 reUSD` (`1e16`), `maxRedemption = 1,000,000 reUSD` (`1e24`), `dailyLimitBps = 2000` (20% of capacity), `userLimitBps = 1000` (10% per wallet), `feeBps = 6` (0.06%), `dayPayoutToken = sUSDe`. At the fastest drain rate, ~5 days to exhaust all liquid onchain reserves (20% per day). The "250 reUSD minimum" cited elsewhere is not in the public docs and contradicts the onchain parameter; treat `0.01 reUSD` as the contract-level floor.
- **reUSD — Windowed Redemption**: once the instant buffer is exhausted, the protocol opens a redemption window (minimum 24 hours). Requests fulfilled pro-rata based on available capital. Proceeds must be claimed within two months.
- **reUSDe — redemption works differently** (per [docs](https://docs.re.xyz/insurance-capital-layers/what-is-reusde)): **no instant redemption path exists**. reUSDe redemptions are quarterly-only. Request window = first 72 hours of each fiscal quarter; an "actuarial gate" at quarter-end (≤10 business days) determines *Available Surplus*; payouts are pro-rata against that surplus; unfilled balances auto-roll into the next quarter while retaining queue seniority. Re explicitly notes *"No secondary market maker pool is promised"* for reUSDe. The senior-tranche instant buffer/vault described above applies to reUSD only, not reUSDe.
- **DEX Trading (Re reUSD only)**: Fluid reUSD/USDT DEX pool (~$11.62M — note: USDT, not USDC); Curve reUSD/sUSDe (~$1.42M) and reUSD/USDC (~$450K); Avalanche Blackhole reUSD/USDC pools (~$1.47M combined). **Total DEX liquidity ~$14.96M on Apr 17, 2026** (DeFi Llama yields API, filtered by underlying token `0x5086…0c72` / `0x180aF87b…625Bf`). Larger pools labelled "reUSD/scrvUSD", "reUSD/sfrxUSD", "reUSD/fxUSD", "reUSD/sDOLA" on Curve/Convex/Stake-DAO/Beefy are **Resupply Protocol's reUSD** (`0x57aB1E00…`) and are NOT Re reUSD exits.
- **Not available to U.S. persons**
- **Fees**: Redemption fee of `6 bps` (0.06%) — **onchain-verified** via `InstantRedemption.feeBps() = 6` at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) ([docs](https://docs.re.xyz/insurance-capital-layers/what-is-reusd)). No documented deposit fees, management fees, or performance fees. RWA.xyz reports 0.18% subscription and 0.18% redemption fees — discrepancy with docs may reflect different fee tiers or methodology. Onchain data shows ~$1,535 total deposit fees collected historically, suggesting a small deposit fee mechanism exists in the contracts (also flagged in Hacken audit finding F-2024-5214 "Unclaimed Deposit Fees Unaccounted For").

### Collateralization

- **Onchain reserve target**: ≥50% of deposits kept in onchain backing (USDC, sUSDe, and potentially T-bill wrappers such as BUIDL), per DD questionnaire.
- **Onchain reserves — verified Apr 17, 2026 against AUP address list**: The Network Firm's Oct-2025 AUP report lists **15 Fireblocks-MPC-controlled addresses** as in-scope for Re's supporting assets ([`AUP-Report-2025.pdf`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf), Procedure 3 table). All 15 were checked for USDC / USDT / USDe / sUSDe / BUIDL balances today. 11 are empty; 4 hold all the reserves:

| # | AUP-listed address | Chain type | Current USD value | Share |
|---|---|---|---|---|
| 1 | [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) ICL Custodial Wallet | **EOA** | **$24.39M** (USDC $9.34M + USDT $1.99M + USDe $0.10M + sUSDe $12.96M) | 24.4% |
| 2 | [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) Redemption Reserves Custodian | **EOA** | **$65.38M** (sUSDe) | 65.4% |
| 3 | [`0xd4374008c88321Eb2e59ABD311156C44B25831e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9) | **EOA** | **$2.56M** (USDe $0.99M + sUSDe $1.57M) | 2.6% |
| 4 | [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) Daily Instant Redemption Vault | Contract (`RedemptionVault`) | $7.60M (sUSDe) | 7.6% |
| 5 | [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) ICL | Contract (proxy) | $0 | — |
| 6 | [`0xE1886BE2bA8B2496c2044a77516F63a734193082`](https://etherscan.io/address/0xE1886BE2bA8B2496c2044a77516F63a734193082) | Contract | $258 (dust) | — |
| 7-15 | 0x19af…5896, 0x4F1f…DaE4, 0x802e…0291, 0x9AB6…1FE3, 0xb22a…fbe1, 0xD75E…eDE9, 0xe132…9d23, 0xfB60…4BB0, 0xfd40…B852 | 9 × EOA | $0 | — |
| **Total** | | | **~$99.93M** | **100%** |

  (sUSDe valued at the onchain sUSDe/USDe exchange rate of `1.22757` via `convertToAssets`, assuming USDe ≈ $1.)

  **Coverage ratio: $99.93M / $185.10M Ethereum NAV = ~54.0%** (~53.5% vs $186.72M total cross-chain NAV). The DD-claimed ≥50% target is met with ~4 percentage points of headroom.

  **Address 3 (`0xd4374008…B25831e9`) is listed in the AUP** but was **not previously enumerated** in this report. It currently holds $2.56M of USDe and sUSDe. Its purpose is undocumented publicly; from its onchain behaviour it appears to be an auxiliary custody / rebalancing EOA in the Fireblocks set.

- **Concentration concerns (onchain-verified)**:
  - ~**90.1%** of onchain reserves are in sUSDe, not USDC. This inherits Ethena counterparty / smart-contract risk and a 7-day cooldown to unstake sUSDe → USDe. Only ~$9.34M of the reserves (≈9.8%) is immediately-redeemable USDC.
  - **No BUIDL or T-bill-wrapper balances** were found at any of the ICL / vault / custodian addresses (Apr 17, 2026), despite the DD questionnaire listing BUIDL as a potential reserve asset. Apart from USDC/USDe/sUSDe, the only non-dust holding is ~1.35M `reUSDsUSDe` Curve LP tokens at the ICL Custodial Wallet (protocol-owned liquidity for the reUSD/sUSDe pool; excluded from the reserve total above). All other token balances at these addresses are airdrop spam or dust (<$500).
  - The ICL contract [`0x4691…3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) itself holds $0 in reserves — assets sit at the Custodial Wallet (an EOA) and at the Redemption Reserves Custodian (also an EOA).

- **Custody / rug-pull surface — 92% of reserves sit at plain EOAs (critical):**

  Of the $99.93M onchain reserve, **$92.33M (~92.4%) sits at three plain EOAs**: the ICL Custodial Wallet (~$24.4M), the Redemption Reserves Custodian (~$65.4M), and the auxiliary address `0xd4374008…B25831e9` (~$2.6M). Only $7.60M (the Daily Instant Redemption Vault) sits behind contract-enforced role gating. From the chain's perspective, each EOA is indistinguishable from an ordinary single-key wallet. One ECDSA signature, one `transfer(...)` call, and those funds move anywhere — no onchain delay, no destination whitelist, no role check.

  Re's documentation and the October 2025 AUP describe these as **"Fireblocks MPC (Multi-Party Computation) wallets"** in which *"the associated private key is split into encrypted 'shares'"* (AUP Report 2025, footnote 2). Important caveats about what the AUP actually proves:

  - The AUP procedure for the Fireblocks assets was *"observe Re Management access the Fireblocks blockchain-based MPC wallet"* and then *"query the blockchain-based addresses observed for Supporting Assets"*. **This is watching someone log in; it is not cryptographic verification that N-of-M signers are required for any given transaction.** TNF relied on Re's assertion of the MPC structure.
  - The AUP explicitly disclaims operating-effectiveness testing of internal controls: *"We did not perform procedures regarding the operating effectiveness of the Re's internal controls."*
  - The AUP was also scoped to exclude 1:1 backing, TVL, and token valuations: *"We did not perform procedures over specific aspects of the Re Protocol, including but not limited to … 1:1 backing of reserves to the tokens or the total value locked (TVL) of the Re Protocol."*

  Onchain, the EOAs have no code — no Safe multisig, no timelock wrapper, no onchain-whitelisted destination set, no per-asset spending caps. Whatever Fireblocks policies exist (transaction whitelists, per-asset limits, approval workflows) and whatever the real MPC quorum is are **entirely offchain** and unverifiable by anyone outside Re. The **48-hour Timelock does NOT protect these reserves** — it only gates governance actions routed through `TimelockController` (upgrades, role changes).

  What's needed to drain $92.3M onchain:

  - If the claimed N-of-M MPC is real and Fireblocks policies are tight → compromise the policy + compromise or collude signer quorum → **1 signed tx**.
  - If Fireblocks policies are permissive → signer-quorum compromise / collusion alone → **1 signed tx**.
  - If an insider with quorum access is malicious → **1 signed tx**.

  This is the single largest unmitigated risk in the system. The AUP provides evidence that the specific address list is in Re's MPC setup, not that a rug would be prevented by multi-party signing.
- **Onchain buffer**: Instant redemption vault and Redemption Reserves Custodian hold ~$72.98M of sUSDe plus $0 USDC for immediate redemptions (USDC instant exits unavailable under current config; see Liquidity).
- **Offchain trust**: §114 Reinsurance Trust holds cash and T-Bills in NAIC-compliant banks, attested daily by The Network Firm. Re's DD questionnaire specifically names Coinbase and Wells Fargo as banking / custody counterparties for certain reinsurance-company assets; this counterparty pair is not disclosed in Re's public docs. Re's docs describe the reserve publication as *"published via Chainlink"* — onchain, no Chainlink PoR aggregator is consumed; see Appendix A.8.
- **Surplus Note protection**: Surplus notes rank junior to policyholders but contractually protect depositor principal
- **Re Capital buffer**: ~$73M subordinated first-loss layer ahead of reUSDe and reUSD
- **reUSDe as backstop**: reUSDe (the risk-bearing token) absorbs first-loss risk across the reinsurance portfolio, providing a backstop to prevent losses reaching reUSD holders. Stress testing shows reUSD loss likelihood = 0.03% at 135% combined ratio

### Provability

- **reUSD price**: Updated daily by a Chainlink-Functions-driven `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) calling `SharePriceCalculator.setSharePrice`. The NAV computation itself is **not** programmatically onchain — Chainlink Functions runs JS offchain (DON `fun-ethereum-mainnet-1`, subscription `85`) and returns a single NAV value. Onchain safeguards: Chainlink Automation triggers daily at 23:45 UTC; `NAVConsumer.maxDeviationBps = 1000` (10%) enforces a deviation guard; Hacken audited the NAV Oracle in Apr 2025. Residual concern: admin/updater roles on `NAVConsumer` and `PRICE_SETTER_ROLE` on `SharePriceCalculator` are both held by a single EOA that can bypass the guard.
- **Onchain reserves**: Visible onchain via the ICL contract and Redemption Reserves Custodian
- **Offchain reserves**: Attested daily by The Network Firm (third-party accountant with read-only access). Re's docs claim this attestation is *"published via Chainlink"* / *"Proof-of-reserves, publicly auditable"*. **This claim could not be substantiated** (Apr 17, 2026): no Chainlink PoR feed for reUSD exists in Chainlink's public reference directory (`reference-data-directory.vercel.app/feeds-mainnet.json`, 23 mainnet PoR feeds — none for Re / reUSD / Resilience; also absent on Avalanche and BSC directories). No Chainlink PoR aggregator is consumed by any verified Re contract. The actual onchain Chainlink dependency is the `sUSDe/USD` price aggregator ([`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099)) used for collateral pricing, not reserves. See "Chainlink PoR claim — not substantiated" in the appendix.
- **Insurance performance**: Reinsurance returns are inherently offchain and depend on claim experience over multi-year treaty periods
- **Minting requires backing (ICL path)**: All ICL deposit paths (`deposit`, `depositFromCustodian`, `processPrestakedDeposit`) enforce `safeTransferFrom` — backing tokens must be transferred to the ICL before reUSD is minted (verified in source at [implementation `0x06d4acc104b974cd99bf22e4572f48a051e59670`](https://etherscan.io/address/0x06d4acc104b974cd99bf22e4572f48a051e59670)). However, the reUSD token contract has an unrestricted `mint(address, uint256)` gated only by `MINTER_ROLE`.
- **MINTER_ROLE holders (verified via RoleGranted logs on Apr 17, 2026)**: THREE contracts hold the role, not one:
  1. `InsuranceCapitalLayer` [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) — backed mint path.
  2. `InstantRedemption` [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) — burns reUSD on redemption; uses MINTER_ROLE because `mint` and `burn` typically share the role in this codebase.
  3. `ShareTokenMinterBurner` [`0x0dFb42aa18CEeD719617cd554304F6cA412A6b18`](https://etherscan.io/address/0x0dFb42aa18CEeD719617cd554304F6cA412A6b18) — **LayerZero OFT wrapper**. Only the registered `adapter` can call `mint`/`burn`. The `adapter` is `ReMintBurnAdapter` [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85), a LayerZero OFT with onchain rate limits of `2,500,000 reUSD / 24h` (inbound and outbound) per peer chain. There is no token-level backing check on this mint path by design — cross-chain OFTs conserve supply by burning on the source chain. **Risk:** both `ShareTokenMinterBurner.owner` and `ReMintBurnAdapter.owner` are the **same EOA** [`0x6C15B25E9750Dccb698C1a4023f34015bFe57649`](https://etherscan.io/address/0x6C15B25E9750Dccb698C1a4023f34015bFe57649) (~0.099 ETH balance). Compromise of this key would let an attacker redirect the adapter and mint up to the 2.5M/day rate limit on Ethereum per connected peer chain.
- If `MINTER_ROLE` were granted to another address via Governance Safe, that address could mint without a backing check at the token layer.

## Liquidity Risk

### Primary Exit Mechanisms

1. **Instant Redemption**: From the onchain buffer. Atomic, same-block. Available until buffer is exhausted (< 1% of supply triggers window-only mode)
2. **Quarterly Redemption**: Processed pro-rata with available capital not reserved for reinsurance plus actuarially released funds
3. **DEX Swap**: Sell reUSD on Curve reUSD/USDC pool

### DEX Liquidity (Apr 17, 2026, source: DeFi Llama yields API)

**Important:** a completely unrelated token, **Resupply Protocol's reUSD** at [`0x57aB1E0003F623289CD798B1824Be09a793e4Bec`](https://etherscan.io/address/0x57aB1E0003F623289CD798B1824Be09a793e4Bec), also uses the "reUSD" symbol. Pool labels like "reUSD/scrvUSD", "reUSD/sfrxUSD", "reUSD/fxUSD", "reUSD/sDOLA" on Curve / Convex / Stake-DAO / Yearn / Beefy refer to **Resupply** reUSD, not Re Protocol reUSD. Only pools whose onchain `underlyingTokens` array contains Re's reUSD (`0x5086bf35…0c72` on Ethereum, `0x180aF87b…625Bf` on Avalanche) are counted below.

| Protocol | Chain | Pool | TVL | Underlying tokens (onchain-verified) |
|----------|-------|------|-----|--------------------------------------|
| Fluid (DEX) | Ethereum | reUSD/USDT | ~$11.62M | `0x5086…0c72` (Re reUSD) / `0xdac17f…831ec7` (USDT) |
| Curve | Ethereum | reUSD/sUSDe | ~$1.42M | `0x5086…0c72` / `0x9D39A5…A3497` (sUSDe) |
| Curve | Ethereum | reUSD/USDC | ~$450K | `0x5086…0c72` / `0xA0b869…6eB48` (USDC) |
| Blackhole CLMM | Avalanche | reUSD/USDC | ~$962K | `0x180aF87b…625Bf` (Re reUSD on Avalanche) / USDC.e |
| Blackhole AMM | Avalanche | reUSD/USDC | ~$510K | `0x180aF87b…625Bf` / USDC.e |

**Total Re reUSD DEX liquidity: ~$14.96M** (Ethereum ~$13.49M + Avalanche ~$1.47M). The Fluid reUSD/USDT DEX pool is the dominant venue (~78% of total).

**Pools previously mis-attributed to Re** (actually Resupply reUSD `0x57aB1E00…`, excluded from the total above):

| Project | Pool | TVL | Correction |
|---------|------|-----|------------|
| Curve | reUSD/scrvUSD | ~$8.32M | Resupply reUSD |
| Curve | reUSD/sfrxUSD | ~$2.36M | Resupply reUSD |
| Curve | reUSD/fxUSD | ~$520K | Resupply reUSD |
| Convex | reUSD/scrvUSD | ~$6.68M | Resupply reUSD |
| Convex | reUSD/sfrxUSD | ~$1.47M | Resupply reUSD |
| Yearn | reUSDscrv | ~$1.81M | Resupply reUSD |
| Beefy | reUSD/scrvUSD | ~$1.45M | Resupply reUSD |
| Stake-DAO | reUSD/scrvUSD, reUSD/sfrxUSD | ~$1.31M | Resupply reUSD |

### DeFi Integrations

Onchain-verified integrations that consume **Re Protocol's reUSD** (`0x5086…0c72`):

| Protocol | Type | Notes |
|----------|------|-------|
| Fluid DEX | DEX | reUSD/USDT pool (~$11.62M TVL, ~$1.67M daily volume). Largest trading venue. |
| Fluid Lending | Lending | Three lending markets supply reUSD: ~$23.58M (vs USDT), ~$23.34M (vs USDC), ~$15.35M (vs fxUSD). Total reUSD supplied ~$62.3M. |
| Curve | DEX | reUSD/sUSDe (~$1.42M), reUSD/USDC (~$450K). (reUSD/scrvUSD, reUSD/sfrxUSD, reUSD/fxUSD, reUSD/sDOLA pools are Resupply reUSD, not Re's.) |
| Morpho | Lending | Re reUSD vaults (~$4.74M + ~$2.29M ≈ $7.0M). PT-REUSD-25JUN2026 Pendle-PT markets also reference Re reUSD indirectly. |
| Pendle | Yield | reUSD yield-tokenization market (~$8.42M TVL). |
| Beefy | Vault | reUSD auto-compounding vault (~$786K). |
| Stake-DAO | Vault | reUSD vault (~$428K). |
| Blackhole (Avalanche) | DEX | reUSD/USDC pools on Blackhole CLMM + AMM (~$962K + ~$510K ≈ $1.47M). |

**Integrations where we could not verify Re reUSD usage onchain (Apr 17, 2026):** Euler, Silo, TermMax. These are listed in Re marketing materials as "reUSD as collateral" but no Re reUSD (`0x5086…0c72`) holdings were found in their markets via the DeFi Llama yields API. Treat as unverified.

The DD questionnaire claim of ">$100M in borrow demand" across lending integrations aligns with the ~$69.3M visible in Fluid + Morpho lending alone.

### Liquidity Summary

- **Total DEX Liquidity (onchain-verified, Re reUSD only)**: **~$14.96M** across Fluid, Curve, and Blackhole (~**8.0%** of ~$186.7M market cap). Fluid reUSD/USDT (~$11.62M) is the dominant venue (~78% of DEX depth). Significantly smaller than the initial "~$26.2M" figure, which erroneously included Resupply-reUSD Curve pools.
- **24h Trading Volume (token-level, CoinGecko)**: ~$7.3M.
- **Instant redemption buffer (Apr 17, 2026, onchain)**: The Daily Instant Redemption Vault at [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) holds `0` USDC and `6.188M` sUSDe. The `custodialWallet` (labeled "Redemption Reserves Custodian" in this report) [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) is an EOA and holds `0` USDC and `53.263M` sUSDe. The configured `dayPayoutToken` is **sUSDe** (not USDC) on Apr 17, 2026, so instant redemptions settle into sUSDe under current config.
- **Instant Redemption Interaction Contract**: [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) — exposes `redeemInstant(uint256 shares, uint256 minPayout)` for instant redemptions.
- **Onchain capital (Apr 17, 2026)**: ICL Custodial Wallet [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) holds `9.344M` USDC + `10.496M` sUSDe. ICL contract itself holds $0.
- **Quarterly queue**: Pro-rata fulfillment, may not be fully met if capital is locked in reinsurance
- **KYC required**: Both for deposit and redemption through the protocol
- **Multi-chain**: Available on 6+ chains. Liquidity concentrated on Ethereum Curve pools (~$16M) with ~$1.5M on Avalanche.

## Centralization & Control Risks

### Governance

- **Governance (onchain-verified)**: A **Safe 3-of-5 multisig** at [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) (SafeProxy; 5 owners, threshold 3) holds DEFAULT_ADMIN + UPGRADER on reUSD and ICL, and PROPOSER + CANCELLER on the Timelock. The protocol docs also describe additional MPC-controlled admin EOAs (Oracle, Redemptions, Access, Custodian); those EOAs exist onchain, but the `N-of-M` MPC quorum is offchain and cannot be verified.
  - Oracle admin EOA: `0x49BC5A88…9212A0ee` — **no timelock** (direct `setSharePrice` capability implied).
  - Redemptions admin EOA: `0xEE16bE03…310c47f8`.
  - Access admin EOA: `0x80a62B72…812fECAFc` (administers `AccessManager` [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8); onchain-observed calling `grantRole`/`labelRole`).
  - Custodian manager EOA: `0x9b6d7f2d…cEbE6eC9` — holds `CUSTODIAN_MANAGER_ROLE` on ICL (onchain-verified).
  - Timelock executor EOA: `0x4BFea59b…740738F3` (onchain-verified).
- **Upgrade Pattern**: UUPS / ERC1967 upgradeable contracts (reUSD and ICL implementations verified).
- **Upgrade Authority**: Governance Safe → Timelock Controller ([`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93)). Timelock `getMinDelay() = 172800` seconds (**48 hours**, onchain-verified).
- **Timelock**: 48-hour timelock on upgrades and role changes routed through Timelock. **The `setSharePrice` path has no onchain timelock or guardrail** — price writes take effect immediately.
- **No onchain governance**: Protocol is currently governed by an expert-led council (Resilience Foundation). Planned transition to DAO in the future.
- **MPC signers**: Re Team members — not publicly identified for security reasons (per DD).

### Programmability

- **reUSD price**: **NOT programmatically computed**. The NAV itself is produced offchain by a Chainlink Functions JS job, delivered onchain by `NAVConsumer`, and stored in `SharePriceCalculator`. Onchain, the NAV Consumer enforces a 10% deviation cap per update (`maxDeviationBps = 1000`). **No Chainlink PoR aggregator for reserves is consumed onchain** (see Appendix A.8). The calculator itself has no guardrail on `setSharePrice`; the admin EOA holds the role and can bypass the NAV Consumer path.
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
- **Custody (sources):** *Fireblocks MPC custody for idle onchain assets* — named in both Re's public docs (`docs.re.xyz/protocol/how-the-re-protocol-work`, `what-is-reusd`) and in the DD questionnaire. *Coinbase and Wells Fargo as banking / custody counterparties for certain reinsurance-company assets* — this specific counterparty pair is **only in the DD questionnaire** (private document provided to Yearn; table row *"Coinbase / Wells Fargo / partner trust accounts — Certain reinsurance company assets — United States — Counterpart…"*). It is **not** in any public Re source. Unverified onchain and offchain.
- **Documentation**: Comprehensive documentation at docs.re.xyz. Clear description of mechanism, risks, and investor protections.
- **Runtime Monitoring**: ChainAnalysis for onchain transaction monitoring.
- **Incident Response**: Emergency pause mechanism exists. Recovery wallets designated for each ICL (e.g., [`0xDf6bF2713b5c7CA724E684657280bC407938F447`](https://etherscan.io/address/0xDf6bF2713b5c7CA724E684657280bC407938F447) for initial ICL).
- **KYC/AML**: Required for all participants (SumSub + Chainalysis). Revoked KYC = request cancelled, tokens returned.
- **Not available to U.S. persons** and may be restricted in other jurisdictions.
- **Written Premiums**: $178M gross written premium to date (intro deck). $4B pipeline dealflow. Protocol has demonstrated real-world insurance business traction.

## Monitoring

### reUSD Price Monitoring

- **Share Price Calculator**: [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8)
  - Monitor reUSD price changes daily. Current: ~$1.072 (onchain `getSharePrice()` = `1072426668551449984`, Apr 17, 2026).
  - **Alert**: If price **decreases** (should only ever increase under normal operation).
  - **Alert**: If price growth **stops** for >48 hours (indicates oracle feed interruption or yield issue).
  - **Alert**: Any new member granted `PRICE_SETTER_ROLE` on the Share Price Calculator (currently `0x6c15b25e…57649` and `NAVConsumer` `0x84d4eaeb…2b4b6`).
  - **Alert (Critical)**: Any `setSharePrice` call whose `msg.sender` is NOT the `NAVConsumer` — this is a bypass of the audited NAV path.

- **NAV Consumer (Chainlink Functions + Automation)**: [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6)
  - **Alert (Critical)**: `maxDeviationBps` changes (currently `1000` = 10%); `deviationCheckEnabled` flipped to `false`; `automationEnabled` flipped to `false`; `paused` flipped to `true`.
  - **Alert (Critical)**: Any call to `forceNAVUpdate` (admin override; minimum 4h interval).
  - **Alert (Critical)**: Role changes on `DEFAULT_ADMIN_ROLE`, `ADMIN_ROLE`, `UPDATER_ROLE`, `EMERGENCY_UPDATER_ROLE`, `KEEPER_ROLE`.
  - **Alert (High)**: `configure(uint64,bytes32,string,bytes)` — changes Chainlink Functions subscription / DON / source code.
  - **Alert (High)**: Daily NAV update did not fire within the configured time window (default target 23:45 UTC).

### ICL and Redemption Monitoring

- **reUSD ICL**: [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093)
  - Monitor for large deposits/withdrawals (>$1M).
  - Monitor total assets under management.

- **Daily Instant Redemption Vault**: [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147)
  - Monitor buffer balance. Alert if buffer drops below 1% of reUSD supply (triggers window-only mode).
  - Monitor for rapid drawdowns indicating potential stress.

- **Reserve EOAs — primary rug-pull surface**: ~92% of onchain reserves are at three plain EOAs (of the 15 Fireblocks-MPC-controlled addresses listed in the AUP-Report-2025). No onchain outflow restriction applies.
  - **ICL Custodial Wallet (EOA)**: [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) — current balance ~$24.4M.
    - **Alert (Critical)**: Any transfer (USDC / USDT / USDe / sUSDe) to a destination NOT on the historical allow-list (Ethena sUSDe/USDe contracts, Redemption Reserves Custodian, Daily Instant Redemption Vault, Fireblocks-pattern sweep addresses beginning `0x34b6…`). First-time destinations = incident.
    - **Alert (High)**: Any outbound transfer >$1M.
    - **Alert (Medium)**: Sequential transfers draining ≥10% of balance within 24h.
  - **Redemption Reserves Custodian (EOA)**: [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) — current balance ~$65.4M.
    - **Alert (Critical)**: Any sUSDe transfer to a destination NOT on the historical allow-list (only `0x5C45…B147` RedemptionVault and sUSDe/USDe staking contracts observed to date).
    - **Alert (High)**: Any single outbound >$5M.
  - **Auxiliary custodian EOA `0xd4374008…B25831e9`**: [etherscan](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9) — currently holds ~$2.6M in USDe+sUSDe. Listed in AUP, role undocumented publicly.
    - **Alert (Critical)**: Any outbound transfer. Small size makes every movement worth a manual look.
  - **All 12 other AUP-listed addresses** (currently empty or dust): monitor for any incoming deposit >$1M and then for any subsequent outgoing transfer. Sudden use of a previously-empty AUP address is a governance signal (either new custody rotation or an unauthorized movement).

- **Instant Redemption Interaction Contract**: [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e)
  - Monitor `redeemInstant` events for redemption volume and frequency.
  - **Alert**: On changes to daily or per-wallet redemption caps.
  - **Alert**: If redemption reverts increase (may indicate liquidity exhaustion).

### Governance & Upgrade Monitoring

- **Oracle admin EOA (MPC 3-of-5 per docs)**: [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee)
  - **Alert**: On any price feed configuration changes; on any new `PRICE_SETTER_ROLE` grant on Share Price Calculator.

- **Access admin EOA (MPC 5-of-8 per docs)**: [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc) — admin of `AccessManager` [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8)
  - **Alert**: On any role assignment or revocation in `AccessManager`; on `MINTER_ROLE` grant on reUSD token.

- **Governance Safe (3-of-5, onchain-verified)**: [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd)
  - **Alert**: On any transaction execution, owner change, or threshold change.

- **Timelock Controller**: [`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93) — the 48h delay between `CallScheduled` and `CallExecuted` is the primary review window for any privileged action; the monitor must fire the moment something is queued, not when it executes.
  - **Alert (Critical)**: On `CallScheduled(bytes32 id, uint256 index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)` — decode `target` / `data` and surface the decoded function call. Every scheduled call deserves a manual review before the 48h window expires.
  - **Alert (Critical)**: On `CallExecuted(bytes32 id, uint256 index, address target, uint256 value, bytes data)` — confirm the execution matches what was scheduled and did not diverge (OZ TimelockController replays the same payload, so any mismatch would be an upstream monitoring bug).
  - **Alert (Critical)**: On `Cancelled(bytes32 id)` — a Safe-initiated cancel is informational; a cancel originating from anything other than the Governance Safe (`0x8EEc10…`) or addresses with `CANCELLER_ROLE` is an incident.
  - **Alert (Critical)**: On `MinDelayChange(uint256 oldDuration, uint256 newDuration)` — any change to the 48h floor is a governance event that materially alters the trust model.
  - **Alert (High)**: On any `RoleGranted` / `RoleRevoked` touching `PROPOSER_ROLE` (0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1), `EXECUTOR_ROLE` (0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63), `CANCELLER_ROLE` (0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783), or `DEFAULT_ADMIN_ROLE`. Current holders (Apr 17, 2026): proposer/canceller/admin = Governance Safe `0x8EEc10…`; executor = EOA `0x4BFea59b…`.
  - **Action**: maintain an allowlist of expected `target` addresses (reUSD token, ICL, Share Price Calculator, AccessManager, PriceRouter, cross-chain adapter, deposit token registry). Any scheduled call to a target off the allowlist is an incident.
  - **Action**: decode `data` against the known ABIs and flag any of these selectors as high-severity: `upgradeTo(address)`, `upgradeToAndCall(address,bytes)`, `grantRole(bytes32,address)`, `revokeRole(bytes32,address)`, `setPriceFeed(address,address)`, `removePriceFeed(address)`, `setAdapter(address)`, `transferOwnership(address)`, `updateFee(uint16)`, `updateLimitPercentages(uint256,uint256)`, `updateRedemptionRange(uint256,uint256)`.

- **UUPS Proxy Upgrades**: Monitor for `Upgraded` events on reUSD token and ICL contracts.
  - **Alert**: Immediately on any implementation change (48-hour timelock provides review window, so this should have been preceded by a `CallScheduled` event ≥48h earlier — absence of that precursor is an incident).

### Liquidity Monitoring

- **Fluid reUSD/USDT pool**: Monitor TVL and volume. Largest trading venue by volume (~$11.6M TVL).
  - **Alert**: If Fluid pool TVL drops below $5M.

- **Curve Re reUSD pools** — only two pools actually pair **Re's reUSD** (`0x5086…0c72`): reUSD/sUSDe and reUSD/USDC. (Curve pools labelled reUSD/scrvUSD, reUSD/sfrxUSD, reUSD/fxUSD, reUSD/sDOLA use **Resupply's reUSD** `0x57aB1E00…` and must NOT be monitored as Re liquidity.) Monitor TVL and balance ratio.
  - **Alert**: If total Curve Re reUSD DEX liquidity drops below $1M (currently ~$1.87M combined).
  - **Alert**: If any pool imbalance exceeds 80/20 in either direction.
- **Avalanche Blackhole reUSD/USDC** (CLMM + AMM, Re's reUSD `0x180aF87b…625Bf`): Monitor TVL.
  - **Alert**: If combined Avalanche TVL drops below $500K (currently ~$1.47M).

- **CoinGecko reUSD price**: Monitor for deviations from expected share price.
  - **Alert**: If CoinGecko price deviates >2% from onchain share price.

### Cross-Chain / LayerZero Monitoring

- **ReMintBurnAdapter** (LayerZero OFT): [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85)
  - **Alert**: On `OwnershipTransferred`, `PeerSet`, or `Paused/Unpaused` events.
  - **Alert**: On any change to inbound/outbound rate limits (current: 2.5M reUSD/24h per peer).
- **ShareTokenMinterBurner**: [`0x0dFb42aa18CEeD719617cd554304F6cA412A6b18`](https://etherscan.io/address/0x0dFb42aa18CEeD719617cd554304F6cA412A6b18)
  - **Alert**: On `AdapterSet` (change of authorized mint/burn caller) or `OwnershipTransferred`.
- **PriceRouter**: [`0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66`](https://etherscan.io/address/0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66)
  - **Alert**: On `PriceFeedSet` / `PriceFeedRemoved` events (any change to how reUSD or sUSDe are priced).

### Offchain Reserve Monitoring

- **The Network Firm daily attestation**: Track daily publication of the offchain reserve attestation (via the Re team's transparency dashboard). No Chainlink PoR feed is consumed onchain, so alerting must target The Network Firm's publication channel, not an onchain aggregator.
  - **Alert**: If attestation is not updated for >48 hours.
  - **Alert**: If reported reserves fall below total reUSD supply × share price.

- **Onchain coverage ratio**: Compute `(USDC + USDT + USDe + sUSDe_in_USDe_terms)` across ALL 15 Fireblocks-MPC-controlled addresses listed in the AUP-Report-2025 (not just the 3 most-known ones), divided by `(reUSD Ethereum totalSupply × getSharePrice())`. Currently ~54.0%.
  - **Alert (Critical)**: If coverage drops below 50% (protocol floor per DD).
  - **Alert (High)**: If coverage drops below 55% (headroom erosion).
  - **Alert (High)**: If sUSDe share of reserves exceeds 92% or USDC share drops below 7% (current split: sUSDe ~90.1% / USDC ~9.8%).
  - **Alert (Medium)**: First appearance of BUIDL or another T-bill-wrapper balance at any reserve address (would change the reserve mix narrative).

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Timelock `CallScheduled` / `CallExecuted` / `Cancelled` / `MinDelayChange` | Real-time | Critical |
| Governance Safe tx execution / owner / threshold changes | Real-time | Critical |
| UUPS proxy upgrade events | Real-time | Critical |
| Access role changes (reUSD MINTER_ROLE, ICL admin, Timelock PROPOSER/EXECUTOR/CANCELLER) | Real-time | Critical |
| PriceRouter `PriceFeedSet` / `PriceFeedRemoved` | Real-time | Critical |
| LayerZero adapter `OwnershipTransferred` / `PeerSet` / rate-limit changes | Real-time | Critical |
| `ShareTokenMinterBurner.AdapterSet` | Real-time | Critical |
| Share Price Calculator `PRICE_SETTER_ROLE` grant / revoke | Real-time | Critical |
| Instant redemption cap changes | Real-time | Critical |
| reUSD share price | Daily | High |
| Instant redemption buffer (USDC + sUSDe) | Every 6 hours | High |
| Onchain coverage ratio (reserves / NAV) + composition | Every 6 hours | High |
| Instant redemption interaction events | Every 6 hours | High |
| The Network Firm offchain attestation publication | Daily | High |
| DEX pool TVL/balance (Fluid reUSD/USDT + Curve) | Hourly | Medium |
| Total supply changes (Ethereum + cross-chain) | Daily | Medium |

## Risk Summary

### Key Strengths

- **Senior tranche position (structural)**: reUSD sits senior to reUSDe and Re Capital in the loss waterfall; losses must breach both subordinated layers before touching reUSD.
- **Third-party offchain reserve attestation**: The Network Firm performs a daily AUP on §114 Trust balances; an AUP report is published annually.
- **Comprehensive audit coverage**: 5+ audits across 3 firms (Hacken, Certora, The Network Firm), including Certora formal verification and a Hacken audit of the Chainlink-Functions-based `NAVConsumer` that is deployed onchain as the standard price writer.
- **Onchain NAV path with automation and deviation guard**: Daily share price is written by a Chainlink-Functions + Chainlink-Automation consumer with a `maxDeviationBps = 1000` (10%) onchain check. Caveat: a single EOA can bypass it — see Key Risks.
- **Timelock on upgrades**: `TimelockController.getMinDelay() = 172800` (48 hours) on all privileged governance actions routed through it. `DEFAULT_ADMIN_ROLE` on reUSD and ICL sits with a 3-of-5 Safe multisig.
- **Emergency mechanisms**: Pause functionality on the InstantRedemption, LayerZero adapter, and NAV Consumer; designated recovery wallets; Chainalysis runtime monitoring.

### Key Risks

- **Single EOA can bypass the NAV Oracle**: the standard price path is the audited Chainlink-Functions `NAVConsumer` (10% deviation cap). However, **the same EOA holds both `PRICE_SETTER_ROLE` on `SharePriceCalculator` and all admin / emergency / keeper roles on `NAVConsumer`**. It can (a) write directly to `SharePriceCalculator`, skipping the Functions path, (b) call `setDeviationCheckEnabled(false)` to disable the guard, or (c) `forceNAVUpdate` once per 4 hours. Compromise of this key ≈ unchecked power over the reUSD share price.
- **Significant offchain capital deployment**: Majority of assets are deployed offchain into §114 Trust and reinsurance programs. This introduces counterparty risk with the trust bank, partner reinsurer, and custodians that cannot be verified fully onchain.
- **Instant redemption vault holds no USDC**: The Daily Instant Redemption Vault holds `0` USDC + `6.188M` sUSDe. The Redemption Reserves Custodian (EOA) holds `0` USDC + `53.263M` sUSDe. `dayPayoutToken` is sUSDe — USDC-denominated instant exits are unavailable under the current config.
- **Onchain reserves heavily concentrated in sUSDe**: Onchain reserves total ~$99.93M (~54.0% of Ethereum NAV — the ≥50% DD target is met with ~4 pp of headroom, not 1.5 pp as earlier indicated). But ~88% of the reserve is sUSDe and only ~9.3% (~$9.34M) is USDC. Ethena (sUSDe issuer) is a material counterparty: an Ethena incident, sUSDe unstaking bottleneck, or USDe depeg would directly impair the "50%+ onchain backing" narrative even before reaching offchain exposures. The DD-cited BUIDL / T-bill wrappers are **not** held onchain.
- **Three MINTER_ROLE holders on reUSD**: Beyond the ICL, `InstantRedemption` and `ShareTokenMinterBurner` also hold MINTER_ROLE. The ICL path enforces backing via `safeTransferFrom`. `InstantRedemption` uses the role for burns during redemption. `ShareTokenMinterBurner` is a LayerZero OFT wrapper — its mint path has no backing check by design (supply is conserved cross-chain), but the OFT adapter [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85) and the wrapper are both owned by the **same EOA** [`0x6C15B25E9750Dccb698C1a4023f34015bFe57649`](https://etherscan.io/address/0x6C15B25E9750Dccb698C1a4023f34015bFe57649) (not a multisig). Compromise of that key would let an attacker repoint the adapter and mint up to `2,500,000 reUSD / 24h / peer` (onchain rate limit) on Ethereum without backing.
- **DEX liquidity thin**: only ~$14.96M of onchain-verified Re reUSD liquidity on DEXes (~8.0% of ~$186.7M market cap). (Previously-cited "~$26.2M" figure included Resupply reUSD pools, a different token.)
- **KYC gating**: All deposits and redemptions require KYC. This limits the universe of users who can exit and creates regulatory/jurisdictional risk.
- **Quarterly redemption queue**: Once instant buffer is exhausted, redemptions are windowed and pro-rata. Capital release from reinsurance programs is reevaluated quarterly (per DD).
- **Reinsurance tail risk**: Underlying assets are exposed to insurance claim risk. reUSD is only impaired if the portfolio combined ratio exceeds 135%, after both Re Capital (~$73M) and all reUSDe reserves are depleted. reUSDe covers losses in the 115-135% combined ratio range. Re's historical combined ratio is ~92% and the portfolio avoids catastrophe lines, but tail risk from extreme loss events remains.
- **No bug bounty program found**: No Immunefi or comparable bug bounty program identified.

### Critical Risks

- **Custody / rug-pull surface — 92% of onchain reserves at plain EOAs**: `$92.33M` of `$99.93M` of onchain reserves sits at **three** plain EOAs listed in the AUP-Report-2025: [`0x295F67…689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) ICL Custodial Wallet ($24.39M); [`0x9eA38e…ADF8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) Redemption Reserves Custodian ($65.38M); [`0xd437…31e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9) auxiliary ($2.56M). None has code; all look identical to single-key wallets from the chain's perspective. **No onchain delay, destination whitelist, or role check** applies to their outbound transfers — one ECDSA signature moves the funds. The claimed Fireblocks MPC custody (N-of-M offchain quorum, destination policies) is unverifiable by anyone outside Re; TNF's AUP procedure was "observe Re Management access the Fireblocks MPC wallet," which does not cryptographically attest the N-of-M quorum. The 48h Timelock does NOT gate these flows. See Funds Management → Collateralization for the full custody table.
- **Offchain dependency concentration**: The protocol's value proposition depends on offchain entities (Cayman reinsurer, §114 Trust, The Network Firm, Fireblocks) operating honestly and solvent. Onchain verification cannot fully cover offchain risks.
- **Oracle/setter manipulation**: the standard share-price path is the audited Chainlink-Functions `NAVConsumer` (10% deviation cap), but a compromised admin EOA can bypass it (write directly to `SharePriceCalculator`, disable the deviation check, or call `forceNAVUpdate` every 4h) and write arbitrary prices. There is no separate Chainlink PoR aggregator attesting reserves independently (see Appendix A.8) — reserve assurance reduces to The Network Firm's offchain AUP plus the onchain balances we audit directly.
- **Liquidity mismatch**: reUSD represents liquid onchain tokens partially backed by offchain reinsurance capital. Capital release is reevaluated quarterly, and programs are short-duration and cat-light (per performance memo). The instant redemption vault holds no USDC (sUSDe only — `6.188M` in vault, `53.263M` in Redemption Reserves Custodian). In a bank-run scenario, sUSDe redemption liquidity plus only ~$14.96M in DEX liquidity would need to absorb exits for ~$186.7M in outstanding tokens; windowed queue handles the remainder.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Audited by Hacken (Aug 2024) and Certora with formal verification (Sep 2025). 3+ total audits. **PASS**
- [ ] **Unverifiable reserves** -- Offchain reserves attested daily by The Network Firm. Docs claim this is "published via Chainlink" but no corresponding Chainlink PoR feed exists publicly and none is consumed onchain (see appendix). Onchain buffer is fully verifiable. **CONDITIONAL PASS** -- hybrid onchain/offchain model with third-party attestation but no independent onchain PoR oracle.
- [x] **Total centralization** -- MPC wallets with role separation (3-of-5 and 5-of-8). 48-hour upgrade timelock. Not a single EOA. **PASS**

**All gates conditionally pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 audit firms (Hacken, Certora, The Network Firm), 5+ engagements. Certora audit (Sep 2025) included formal verification and found 13 issues (all fixed). Hacken conducted 3 audits (Sep 2024, Dec 2024, Apr 2025 NAV oracle). The Network Firm performed AUP on offchain reserve attestation (Oct 2025).
- **Bug Bounty**: No Immunefi or comparable bug bounty program found.
- **Time in Production**: reUSD token ~10 months in production (inception June 2025). Re Protocol company since 2022.
- **TVL**: ~$186.7M market cap, ~$198.1M TVL (DeFi Llama, Apr 17, 2026).
- **Incidents**: None reported for Re Protocol.

**Score: 2.5/5** -- Three audit firms with formal verification and 5+ engagements is solid coverage. Certora formal verification and dedicated NAV oracle audit strengthen confidence. The Network Firm AUP adds offchain verification assurance. No bug bounty program remains a notable gap. Moderate production time (~10 months) with no incidents and TVL >$100M.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- Onchain governance root: a 3-of-5 Safe multisig holds `DEFAULT_ADMIN` on reUSD/ICL and `PROPOSER/CANCELLER` on the Timelock; 48-hour timelock on UUPS proxy upgrades (`getMinDelay = 172800`) — onchain-verified.
- Per-function admin EOAs (Oracle, Redemptions, Access, Custodian) described by docs as MPC 3-of-5 / 5-of-8. The MPC signer quorum is offchain and cannot be independently verified; signers not publicly identified.
- NAV Oracle path (`NAVConsumer`) is audited and uses Chainlink Functions + Automation with a 10% onchain deviation cap — but all admin/updater roles on it sit with a single EOA.
- `PRICE_SETTER_ROLE` on `SharePriceCalculator` directly granted to that same EOA, bypassing the NAV Oracle path if used.
- KYC required for all deposits and protocol redemptions (enforced onchain).

**Governance Score: 4.0** -- Safe-backed Timelock and 48h delay are positive. Undermined by: (a) a single EOA holding every role that governs the share price (direct PRICE_SETTER on the calculator + all admin/emergency/keeper roles on the NAV Consumer), (b) the MPC / N-of-M claims for other admin EOAs being offchain-only and unverifiable, (c) no onchain governance, and (d) KYC-gated access.

**Subcategory B: Programmability**

- reUSD price: Written onchain by a Chainlink-Functions-driven `NAVConsumer` with a 10% deviation cap (`maxDeviationBps = 1000`). NAV computation itself runs offchain in the Chainlink DON. An EOA can bypass the guard (holds `PRICE_SETTER_ROLE` on `SharePriceCalculator` and all admin roles on `NAVConsumer`).
- Deposits: Gated by KYC Registry
- Instant redemptions: Programmatic from buffer
- Quarterly redemptions: Admin-managed process
- Capital deployment: Entirely offchain

**Programmability Score: 4.0** -- The core value-determining function (reUSD price/yield) is set by an admin-controlled oracle, not computed programmatically onchain. This is a significant centralization concern. Capital deployment is entirely offchain.

**Subcategory C: External Dependencies**

- Chainlink: used onchain as (a) the `sUSDe/USD` price feed inside `PriceRouter` (aggregator [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099), 24h staleness, $1.18 / $2.00 price bounds), and (b) **Chainlink Functions + Automation** driving the daily NAV update through `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) (DON `fun-ethereum-mainnet-1`, subscription `85`). **No Chainlink PoR aggregator for reserves** is consumed onchain — see Appendix A.8.
- **LayerZero**: cross-chain reUSD transport via `ReMintBurnAdapter` OFT [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85). Active peers: Avalanche (eid 30106), Arbitrum (30110), Base (30184), BNB (30102). Rate limit: 2,500,000 reUSD per 24h inbound AND outbound per chain (onchain-verified).
- The Network Firm for daily attestations
- Ethena for basis-trade yield source
- Fireblocks for custody
- §114 Reinsurance Trust (offchain bank)
- Cayman-domiciled partner reinsurer (CIMA-regulated)
- SumSub / Chainalysis for KYC/AML
- Multiple blockchains for cross-chain deployment

**Dependencies Score: 4.0** -- Heavy reliance on offchain entities (trust bank, reinsurer, attestation firm, custody). Many single-point-of-failure dependencies that cannot be mitigated onchain.

**Centralization Score = (4.0 + 4.0 + 4.0) / 3 = 4.0**

**Score: 4.0/5** -- Significant centralization due to a single EOA holding unchecked price-writing power (bypasses the audited Chainlink-Functions NAV path), offchain capital deployment, KYC gating, and heavy reliance on external entities.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Onchain buffer: Verifiable, holds liquid assets for instant redemptions
- Offchain trust: §114 Trust with daily attestation via The Network Firm (no onchain Chainlink PoR feed verified — see appendix)
- Surplus notes contractually protect principal
- reUSDe provides first-loss protection for reUSD
- Majority of capital deployed offchain in reinsurance programs (capital release reevaluated quarterly per DD)

**Collateralization Score: 4.0** -- Hybrid onchain/offchain model. Onchain reserves verified at ~$99.93M (across all 15 AUP-listed Fireblocks addresses) vs ~$185.10M Ethereum NAV (~54.0% coverage — DD-claimed ≥50% target met with ~4 pp headroom). **Critically, ~$92.33M of the onchain reserve (~92%) sits at three plain EOAs with no onchain restriction on outflow** — a single signed tx can drain them; the 48h Timelock does not apply. The AUP confirms the address list is in Re's Fireblocks MPC setup, not that multi-party signing would prevent a rug. ~88% of the reserve is sUSDe (Ethena counterparty risk, 7-day cooldown); only ~9.3% is USDC. No BUIDL / T-bill wrappers present onchain despite DD listing. Offchain reinsurance capital release is reevaluated quarterly and relies on third-party attestation.

**Subcategory B: Provability**

- reUSD price: Written by Chainlink-Functions `NAVConsumer` (audited, 10% deviation cap). Bypassable by the admin EOA holding direct `PRICE_SETTER_ROLE` on `SharePriceCalculator`.
- Onchain buffer: Fully verifiable
- Offchain reserves: Attested daily by The Network Firm (no onchain Chainlink PoR feed verified)
- Underlying reinsurance performance: Inherently offchain, not verifiable onchain

**Provability Score: 3.5** -- Third-party attestation (The Network Firm + Chainlink) is better than pure self-reporting but still relies on trust in offchain entities. Core yield calculation is offchain.

**Funds Management Score = (4.0 + 3.5) / 2 = 3.75**

**Score: 3.8/5** -- Hybrid model with meaningful offchain components. Two plain EOAs hold ~92% of onchain reserves with no onchain outflow restriction (rug surface); third-party attestation provides some assurance for offchain balances but cannot match fully onchain provability.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Instant Exit**: Daily Instant Redemption Vault holds `0` USDC + `6.188M` sUSDe; Redemption Reserves Custodian holds `0` USDC + `53.263M` sUSDe (onchain, Apr 17, 2026). Configured `dayPayoutToken` is sUSDe. Instant redemptions via [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) settle in sUSDe under current config, subject to daily (20%) and per-wallet (10%) caps.
- **Quarterly Queue**: Pro-rata, may not be fully filled if capital locked in reinsurance
- **DEX Liquidity (Re reUSD only)**: ~$14.96M across Fluid, Curve, and Blackhole (~8.0% of ~$186.7M market cap). Largest venue: Fluid reUSD/**USDT** (~$11.62M TVL, ~$1.67M daily volume).
- **24h Volume (token-level, CoinGecko)**: ~$7.3M
- **KYC Required**: Limits universe of participants who can exit via protocol redemption
- **Onchain capital**: ICL Custodial Wallet holds `9.344M` USDC + `10.496M` sUSDe (Apr 17, 2026). This is not directly accessible for redemptions without admin action.
- **Multi-chain**: Available on 6+ chains, liquidity concentrated on Ethereum

**Score: 3.5/5** -- After correcting a token-identity mix-up (Resupply reUSD vs Re reUSD), onchain-verified DEX liquidity for Re reUSD is only ~**$14.96M** (~8% of market cap), of which ~78% sits in a single Fluid reUSD/USDT pool. Instant redemptions currently pay out in sUSDe only: ~6.188M in the daily vault and ~53.263M in the Redemption Reserves Custodian cover ~$59.4M of sUSDe-denominated exits under 20% daily / 10% per-wallet caps. Combined with DEX depth, protocol-native exits plus DEX can absorb ~$74M of the ~$186.7M outstanding before falling back to the quarterly queue. KYC-gated protocol redemptions, concentration of DEX liquidity in a single Fluid pool, and absence of USDC instant exits are material concerns — revising the earlier 3.0 to **3.5**.

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
| Centralization & Control | 4.0 | 30% | 1.20 |
| Funds Management | 3.8 | 30% | 1.14 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.49** |

**Final Score: 3.5** (computed 3.49 — **at the Medium / Elevated tier boundary**; conservative scoring per template would place this in Elevated given the unmitigated rug-pull surface at the reserve EOAs)

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

reUSD is a novel product that bridges DeFi capital with traditional reinsurance markets. Re reports ($178M gross written premium, ~92% combined ratio per LP memo) and market cap ~$186.7M are meaningful; the capital structure (Re Capital ~$73M + reUSDe first-loss) puts reUSD in the senior tranche. The risk profile is at the Medium / Elevated tier boundary. Primary concerns: (1) **custody / rug surface — ~92% of onchain reserves ($92.3M) sit at three plain EOAs with no onchain outflow restriction; the 48h Timelock does not apply**. The AUP lists the address set but does not cryptographically verify the MPC quorum; (2) the standard share-price path is an audited Chainlink-Functions NAV Oracle with a 10% onchain deviation cap, but a single admin EOA can bypass it; (3) heavy offchain capital deployment in reinsurance programs (capital release reevaluated quarterly); (4) onchain reserves are ~54% of NAV with ~88% in sUSDe (Ethena counterparty risk, 7-day cooldown); only ~$9.34M is USDC; (5) KYC-gated redemptions (enforced onchain at every redemption entrypoint); (6) reUSDe redemption works differently — quarterly-only, no instant path; (7) three MINTER_ROLE holders on reUSD (ICL enforces backing; LayerZero OFT wrapper shares a single EOA owner with its adapter). Mitigants: Safe-3-of-5 + 48-hour Timelock on governance (onchain-verified `getMinDelay() = 172800`), 5+ audits (Hacken, Certora, The Network Firm AUP) including a Hacken audit of the deployed `NAVConsumer`, Chainlink Automation driving daily NAV updates, and The Network Firm's offchain AUP of the §114 Trust. **None of these mitigants cover the reserve-custody rug surface, which remains the single largest unmitigated risk.**

**Key conditions for exposure:**
- Monitor reUSD share price for any decreases (should only increase)
- Monitor The Network Firm's daily reserve attestation (not a Chainlink PoR feed — see appendix)
- **Monitor instant redemption buffer — track both USDC and sUSDe balances in vault and Redemption Reserves Custodian**
- Monitor instant redemption interaction contract [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) for redemption events and limit changes
- Monitor UUPS proxy upgrades (48-hour review window)
- Track DEX liquidity depth on Fluid reUSD/USDT (~$11.62M) and Curve reUSD/sUSDe (~$1.42M) / reUSD/USDC (~$450K). (Curve reUSD/scrvUSD, reUSD/sfrxUSD, reUSD/fxUSD are Resupply reUSD, not Re — do not count toward Re liquidity.)
- Monitor for KYC policy or regulatory changes affecting redemption access
- Monitor ICL Custodial Wallet balance (~`9.344M` USDC + ~`10.496M` sUSDe, Apr 17, 2026) for large outflows
- Monitor `MINTER_ROLE` grants on reUSD token — currently held by ICL, `InstantRedemption`, and `ShareTokenMinterBurner`; any fourth grantee should trigger review

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
│  │  reUSD Token  │◄──│  Share Price          │◄── PRICE_SETTER_ROLE │
│  │  (ERC-20,     │    │  Calculator           │    (EOA calls       │
│  │   UUPS Proxy) │    │  0xd1D1..11b05B8      │     setSharePrice)  │
│  │  0x5086..0c72 │    └──────────────────────┘                      │
│  └──────┬───────┘    (NAVConsumer: 10% onchain deviation cap;      │
│                       admin EOA can bypass via direct setSharePrice) │
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
│  └──────────────────────────┘    │  (offchain §114 Trust)│         │
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
│  │  Oracle Admin EOA    │  │  Redemptions Admin   │                  │
│  │  MPC 3-of-5 (docs)   │  │  MPC 3-of-5 (docs)   │                  │
│  │  0x49BC..0Aee        │  │  0xEE16..47f8        │                  │
│  │  no onchain timelock │  │  48h timelock (docs) │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │  Access Admin EOA    │  │  Custodian Manager   │                  │
│  │  MPC 5-of-8 (docs)   │  │  (CUSTODIAN_MGR_ROLE)│                  │
│  │  0x80a6..AFc         │  │  0x9b6d..eC9         │                  │
│  │  admins AccessManager│  │  Add/remove          │                  │
│  │  0x3f0D..6FD8        │  │  custodians (ICL)    │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                     │
│  ┌─────────────────────────────────────────────┐                   │
│  │  Governance Safe (3-of-5, onchain)          │                   │
│  │  0x8EEc10..FadeFbAd                         │                   │
│  │  DEFAULT_ADMIN + UPGRADER on reUSD and ICL; │                   │
│  │  PROPOSER + CANCELLER on Timelock           │                   │
│  └─────────────────────────────────────────────┘                   │
│                                                                     │
│  ┌─────────────────────────────────────────────┐                   │
│  │  Timelock Controller  (getMinDelay = 48h)   │                   │
│  │  0x69dDEa..57FCA93                          │                   │
│  │  Executor: 0x4BFea59b..740738F3 (EOA)       │                   │
│  └─────────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘

Fund Flow:
  User ──USDC──► ICL (KYC gate) ──mint──► reUSD Token
  ICL ──sweep──► Custodial Wallet ──deploy──► §114 Trust (offchain)
  §114 Trust ──surplus notes──► ICL (principal + yield guarantee)
  Network Firm attestation ──► PRICE_SETTER EOA ──► setSharePrice on Share Price Calc ──► reUSD price
  Network Firm ──► offchain reserve attestation (no Chainlink PoR consumed onchain)
  Chainlink sUSDe/USD ──► SimpleOracle ──► PriceRouter (sUSDe leg only)

Trust Boundaries:
  ⚠ Onchain/offchain boundary at ICL Custodial Wallet sweep
  ⚠ Share price is written by an admin EOA with no onchain deviation cap
  ⚠ Redemption Reserves Custodian (0x9eA3..ADF8) is an EOA
  ⚠ MINTER_ROLE held by THREE contracts on reUSD (ICL, InstantRedemption, ShareTokenMinterBurner)
  ⚠ KYC Registry gates all deposits and protocol redemptions
```

---

## Appendix: Reinsurance Portfolio & Performance Claims (Re-provided)

All figures in this appendix are **asserted by Re Protocol** in private materials provided to Yearn for due diligence. No figure has been independently reproduced, attested, or actuarially reviewed by Yearn. Source files are checked in under `reports/data/re-reusd/issue-134/` (see `SOURCES.md` in that directory for the Google Drive links).

Source legend:

- **[LP Memo]** — `re-historical-comparative-performance-nov-2025.pdf` (4 pages, titled *"Re Historical and Comparative Performance — November 2025 | LP Memo"*)
- **[Deck]** — `re-ethereum-house-2025.pdf` (8-page intro deck)
- **[DD]** — `current-due-diligence-questionnaire-re.docx`
- **[Cashflow]** — `re-illustrative-cashflow-model-v2-gid-1766877668.csv`

### A.1 Portfolio composition ($174M written premium)

| Line of Business | Allocation | Written Premium | Risk Profile (Re's label) |
|------------------|-----------|-----------------|---------------------------|
| Homeowners Insurance | 35% | $49M | Low Volatility |
| Auto Insurance | 30% | $42M | Low Volatility |
| Small Business Commercial | 20% | $28M | Low Volatility |
| Workers Compensation | 15% | $21M | Low Volatility |

**Source:** [LP Memo], page 3, *"Insurance Strategy Breakdown"* table.
**What "Risk Profile" means here:** the "Low Volatility" label is Re's own self-classification, not a Yearn determination. Re's rationale (same page): Homeowners = "localized residential property with minimal cat exposure"; Auto = "frequency-based vehicle and liability programs with lower limits"; Small Business Commercial = "diversified property and liability across SMEs"; Workers Comp = "stable business segments and lower-layer attachment points". No quantitative volatility metric (e.g. historical std-dev of loss ratios) is disclosed.

### A.2 Combined-ratio history (2022-2024, +1H 2025)

Per [LP Memo] page 2 table *"Re Portfolio Performance"*:

| Year | Global Reinsurance Combined Ratio | Re Portfolio Combined Ratio |
|------|-----------------------------------|-----------------------------|
| 2021 | 96.30% | 92.68% |
| 2022 | 96.20% | 92.58% |
| 2023 | 90.30% | 92.88% |
| 2024 | 91.30% | 91.52% |
| 1H 2025 | 94.80% | 92.67% |

Re-stated underwriting-year view (same page):

| UW Year | Written Premium | CR @ Inception | CR @ YE 2024 |
|---------|----------------|----------------|--------------|
| 2022 | $12.2M | 93.10% | 92.58% |
| 2023 | $13.8M | 93.09% | 92.88% |
| 2024 | $56.1M | 91.88% | 91.52% |
| 2025 | $91.9M | 92.67% | n/a |
| **Total** | **$174.0M** | **92.48%** | **91.91%** |

**Source:** [LP Memo], page 2. Industry ratios cited as *"Source: Aon / Company Disclosure"* on the same chart.

### A.3 Return-on-capital claim (15-23%)

**Source:** [Deck], page 3 (headline slide *"Re is live and scaling to $400M+ EOY"*):

> $178M IN GROSS WRITTEN PREMIUM TO DATE • $4B IN PIPELINE DEALFLOW • **15-23% RETURN ON CAPITAL**

No methodology, time period, or base-of-capital disclosed in the slide.

### A.4 Estimated ROE (12-19%)

**Source:** [LP Memo], page 4, *"Comparative Performance and ROE Outlook"* table:

|  | Global Reinsurance | Re Portfolio |
|---|--------------------|--------------|
| Combined Ratio (Avg.) | ~93-95% | ~92% |
| **Estimated ROE** | ~13-20% | **~12-19%** |
| Volatility Profile | Moderate | Low / Cat-Light |

The same memo (page 2) cites industry-reported ROE for 2021-1H 2025 ranging from 10.2% to 19.6%. Re's own ROE is explicitly labelled "Estimated"; no capital base, leverage assumption, or fee treatment is disclosed.

### A.5 Pipeline Dealflow ($4B)

**Source:** [Deck], page 3 (same slide as ROC).

**Meaning:** "Pipeline Dealflow" is insurance/reinsurance jargon for the dollar notional of reinsurance contract opportunities Re has identified or is in active discussion on but has **not bound**. It is a sales-pipeline forward-looking number, not current revenue, not capital, and not backing for reUSD. Re does not disclose a conversion probability or time horizon. For scale, the same slide shows **$178M gross written premium to date** — so the pipeline is ~23× the bound book. Treat as TAM-style marketing.

### A.6 Stress testing (loss likelihoods)

**Source:** [LP Memo], page 1, box *"Re Capital Structure and Risk-Remote Design"*:

> Modeled stress testing demonstrates:
> - reUSD loss likelihood ≈ **0.03%** at 135% combined ratio
> - reUSDe ≈ **0.9%**
> - Re Capital ≈ **3.9%**

An accompanying chart on the same page also shows Re Capital ≈ 1.9% at 115% CR and charts loss likelihoods at 105% / 110% / 115% / 135%.

**Caveats:**
- The memo uses the phrase *"Modeled stress testing demonstrates"* but discloses no model, distributional assumptions, parameter calibration, confidence intervals, or actuarial attestation.
- The claim is conditional on the Re Capital + reUSDe subordinated buffer remaining intact at the time of a loss event; the 0.03% tail probability assumes the current ~$73M Re Capital layer is fully present.
- No independent actuarial firm has published reproduction of these figures.

### A.7 Auxiliary claims in the DD questionnaire

The DD questionnaire [DD] adds operational claims that similarly depend on Re's own disclosure:

- **≥50% of deposits kept in onchain backing (target)** — **verified onchain as ~54.0% on Apr 17, 2026** ($99.93M reserves across all 15 AUP-listed Fireblocks addresses vs $185.10M Ethereum NAV); see Funds Management → Collateralization for the full breakdown. Composition: ~88% sUSDe, ~9.3% USDC, ~2% USDT, ~1.1% USDe. **No BUIDL or T-bill wrappers** were found at any of the 15 addresses, so the DD's "potentially T-bill wrappers such as BUIDL" language is currently not implemented onchain.
- Capital release from reinsurance programs is reevaluated quarterly.
- Combined ~$100M of borrow demand across lending integrations (Fluid, Morpho; and claims about Euler/Silo/TermMax that we could not verify onchain — see Liquidity section).
- Fireblocks MPC custody for idle onchain capital, with Coinbase and Wells Fargo as banking counterparties for offchain reserves.

Each of these (other than the verified coverage ratio) should be read as **Re's representation**, not onchain- or independently-verified fact.

### A.8 Chainlink usage by Re Protocol — what is real vs what is marketing (Apr 17, 2026)

Re's documentation ties the protocol's reserve and price publication to Chainlink. The relevant quotes:

| Source page | Quote |
|---|---|
| Security and Audits | *"Off-chain bank balances are verified daily by The Network Firm and published via **Chainlink**. The Network Firm also verifies ownership and balances of protocol custody wallets."* |
| How the Re Protocol Works | *"Idle funds are held in a Fireblocks vault under multisig. Balances are published daily to a **Chainlink oracle**. **Proof-of-reserves, publicly auditable**."* |
| How the Re Protocol Works | *"On-Chain Mirror: Trust balances, premium inflows, and claim outflows are hashed and pushed to **Chainlink**, giving 24/7 proof of funds."* |
| How the Re Protocol Works | *"**Chainlink Oracles**: Publish price feeds, trust balances, surplus-note schedules, and redemption queues."* |
| What is reUSD? | *"A JSON price feed is pushed on-chain via **Chainlink**"* |

**What's actually onchain (three Chainlink integrations, verified):**

1. **Chainlink Price Feed — `sUSDe / USD`** ([`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099)) wrapped by `SimpleOracle` [`0xb6aD3633…fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) and read by `PriceRouter`. Used for the sUSDe collateral-pricing leg.
2. **Chainlink Functions** — `NAVConsumer` [`0x84d4eaeb…2b4b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) subscribes to the mainnet DON `fun-ethereum-mainnet-1` (subscription `85`). A JS job in the DON computes the daily NAV offchain and the result is written onchain via `fulfillRequest` → `navReceiver.setSharePrice` → `SharePriceCalculator`.
3. **Chainlink Automation** — a keeper calls `NAVConsumer.performUpkeep(bytes)` daily (observed every ~86400 s; target time 23:45 UTC). This is what triggers (2).

So Re's claim *"A JSON price feed is pushed on-chain via Chainlink"* is correct in a loose sense: the NAV is produced by Chainlink Functions and pushed by Chainlink Automation, even though it's not a classic Chainlink "price feed aggregator". The NAV Oracle code was audited by Hacken in Apr 2025 (repo `github.com/resilience-foundation/nav-oracle`).

**What is NOT onchain — the "Proof-of-Reserves, publicly auditable" claim:**

1. **Chainlink's public PoR directory does not list Re.** The canonical list at `reference-data-directory.vercel.app/feeds-mainnet.json` has 23 Proof-of-Reserve feeds on Ethereum mainnet (FBTC, cbBTC, TUSD, eETH, Lombard, WBTC, M / MetaMask, C1USD, …). **No feed matching `reusd`, `resilience`, `re-protocol`, or `re_usd` exists** — nor on Avalanche (93 feeds) or BSC (178 feeds).
2. **No Re contract consumes a PoR aggregator.** `InsuranceCapitalLayer`, `ShareToken`, `SharePriceCalculator`, `PriceRouter`, `SharePriceOracle`, and the Redemption contracts make no `latestRoundData` call against a reserves feed. The `@chainlink/` imports that appear in `PriceRouter` and `SharePriceOracle` are foundry path remappings, not live integrations.
3. **Chainlink's own media** has no announcement, case study, or press release about a Re Protocol integration.
4. **What the NAV Oracle publishes is the share price, not reserves.** It does not hash trust balances, premium inflows, or claim outflows onto Chainlink as Re's docs imply.

**Bottom line:**

- "JSON price feed pushed via Chainlink" → **true** (Functions + Automation, verified onchain).
- "Published via Chainlink oracle (for offchain bank balances)" → **not verified**; no such feed exists in Chainlink's registry and no Re contract reads one.
- "Proof-of-reserves, publicly auditable" → **overclaim**; reserve assurance is (a) direct onchain balance audit of the ICL/vault/custodian addresses and (b) The Network Firm's offchain AUP — there is no Chainlink-signed reserves oracle to cross-check either.

**Action:** when evaluating "Chainlink" claims in Re's docs, distinguish between Chainlink Functions + Automation (used for the share price, real and audited) vs a Chainlink PoR aggregator for reserves (does not exist onchain). If Re asserts the latter in conversation, ask for the aggregator address — it should be in Chainlink's mainnet directory and verifiable on Etherscan.

### A.9 AUP-Report-2025 address list — cross-referenced onchain (Apr 17, 2026)

The October 2025 AUP ([`AUP-Report-2025.pdf`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf), Procedure 3 table) lists 15 "Fireblocks MPC wallet" addresses as in-scope for Re's onchain Supporting Assets. All 15 were verified onchain:

| # | Address | Chain type | AUP claim | Apr 17 2026 balance (USDC + USDT + USDe + sUSDe) | Where |
|---|---|---|---|---|---|
| 1 | `0x19aff1C007397Bdb7f82BdA18151C28AB4335896` | EOA | Fireblocks MPC | $0 | (unused) |
| 2 | `0x295F67Fdb21255A3Db82964445628a706FBe689E` | EOA | Fireblocks MPC | **$24.39M** | ICL Custodial Wallet (active) |
| 3 | `0x4691C475bE804Fa85f91c2D6D0aDf03114de3093` | Contract | Fireblocks MPC | $0 | ICL contract |
| 4 | `0x4F1ff9b995472B27A6BAfEc967986F35Bf1aDaE4` | EOA | Fireblocks MPC | $0 | (unused) |
| 5 | `0x5C454f5526e41fBE917b63475CD8CA7E4631B147` | Contract | Fireblocks MPC | **$7.60M** | Daily Instant Redemption Vault |
| 6 | `0x802eDbB1Ec20548A4388ABC337E4011718eb0291` | EOA | Fireblocks MPC | $0 | (unused) |
| 7 | `0x9AB62AebAbE738AB233C447eEdCE88D1D0a61FE3` | EOA | Fireblocks MPC | $0 | (unused) |
| 8 | `0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8` | EOA | Fireblocks MPC | **$65.38M** | Redemption Reserves Custodian |
| 9 | `0xb22a8533e6cd81598f82514a42F0B3161745fbe1` | EOA | Fireblocks MPC | $0 | (unused) |
| 10 | `0xd4374008c88321Eb2e59ABD311156C44B25831e9` | EOA | Fireblocks MPC | **$2.56M** | auxiliary (purpose undisclosed publicly) |
| 11 | `0xD75Ea2fd3D00399df7b7241AB7A189085aB2eDE9` | EOA | Fireblocks MPC | $0 | (unused) |
| 12 | `0xe13292F97E38da0C64398De5E0bFc95180DE9d23` | EOA | Fireblocks MPC | $0 | (unused) |
| 13 | `0xE1886BE2bA8B2496c2044a77516F63a734193082` | Contract | Fireblocks MPC | $258 | (dust) |
| 14 | `0xfB602cb83c9c15b4cc49340dc9aD7a8C23754BB0` | EOA | Fireblocks MPC | $0 | (unused) |
| 15 | `0xfd4016Ea13ca8acc04A11a99702dF076A4d3B852` | EOA | Fireblocks MPC | $0 | (unused) |

**Summary:** $99.93M active onchain, ~$92.33M at plain EOAs, ~$7.60M at one contract (RedemptionVault).

**What the AUP establishes vs what it does not:**

- Establishes: (a) the 15 addresses are the complete in-scope set Re disclosed to TNF as of Oct 31 2025; (b) a TNF auditor directly observed Re Management access the Fireblocks UI; (c) TNF independently queried each address's balance at the snapshot time and cross-referenced with CoinGecko prices.
- Does not establish: (a) the actual N-of-M MPC configuration (the audit did not verify the signer threshold cryptographically — it relied on Re's representation that these are MPC wallets); (b) Fireblocks' transfer policies (whitelists, limits, approvals) — not in scope; (c) 1:1 backing or TVL coverage — explicitly excluded by the engagement letter; (d) operating effectiveness of Re's internal controls — explicitly excluded.
- Also note: the AUP lists 15 addresses. The chain reflects 3 EOAs and 2 contracts carrying balances; the other 10 are dormant. An address rotating from dormant to active, or a new address not on this list appearing in the sweep flow, is a governance signal worth monitoring (see Monitoring → Reserve EOAs).

**AUP snapshot totals (Oct 31, 2025) for context:**

| Supporting Asset | USD Value | Where |
|---|---|---|
| Cash | $55,572,232 | Brokerage Account (offchain) |
| Money Market Funds | $4,169,897 | Bank & Brokerage Accounts (offchain) |
| USDC | $1,466,833 | Fireblocks MPC (onchain) |
| USDT | $2,012,386 | Fireblocks MPC (onchain) |
| USDe | $66,919 | Fireblocks MPC (onchain) |
| sUSDe | $17,750,736 | Fireblocks MPC (onchain) |
| UTY + YUTY | $2,472,438 | Fireblocks MPC (onchain; Unity Protocol) |
| LIUSD (1w/2w/4w/8w) | $4,988,125 | Fireblocks MPC (onchain; InfiniFi) |
| Estimated Gross Premium Receivable | $66,117,423 | Reinsurance Contracts (offchain) |
| **Total** | **$154,616,990** | |

Onchain portion then (~$28.76M) has grown to ~$99.93M now; total supporting assets including offchain cash/receivables would be higher today but not independently re-audited since Oct 2025.
