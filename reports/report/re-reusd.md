# Protocol Risk Assessment: Re Protocol reUSD

- **Assessment Date:** September 7, 2026
- **Token:** reUSD (Re Protocol Deposit Token)
- **Chain:** Ethereum (primary), multi-chain (Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink)
- **Token Address:** [`0x5086bf358635B81D8C47C66d1C8b9E567Db70c72`](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72)
- **Final Score: 3.50/5.0** — down marginally from June's 3.51, sitting exactly at the Medium/Elevated boundary. Real, executed improvements (token-level admin moved to the Timelock, DEX/redemption liquidity growth) are outweighed by a genuine increase in the dollar amount exposed at plain-EOA custody (~$80.95M → ~$151.5M) and a reserve base that flipped to near-total sUSDe concentration (~99.5%, USDC collapsed to ~0.25%). See Risk Score Assessment.

## Overview + Links

Re Protocol is a decentralized onchain reinsurance marketplace that tokenizes real-world reinsurance treaties, enabling DeFi participants to earn insurance-backed yields. The protocol is designed as a blockchain-native version of Lloyd's of London, connecting onchain capital with regulated reinsurance programs.

**reUSD** is the protocol's principal-protected, yield-accruing deposit token (branded "Basis-Plus"). It is designed as the "stable core" of the Re Protocol, analogous to a tokenized money-market fund with blockchain composability.

**Yield Mechanism:**
reUSD accrues yield daily. The base rate is a **single blended rate** — a weighted average of (i) **deployed** capital earning the risk-free rate (SOFR) and (ii) **undeployed** capital capturing the Ethena USDe hedged basis trade — plus **one 250 bps spread** applied to the blend (per [docs.re.xyz](https://docs.re.xyz/products/about-reusd) and confirmed by the NAV formula in Funds Management → Token Mechanism). This is **not** a "higher-of" floor between two independently-spread paths; the 250 bps spread is added once to the weighted blend, not to each path.

The resulting "Applicable APY" is converted to a daily rate, and reUSD's **token price** (not quantity) increases daily. Current APY is approximately 6-9+%. See Funds Management → Token Mechanism for how the price is written onchain.

**Capital Deployment:**
- Users deposit admitted assets (e.g., USDC) into the Insurance Capital Layer (ICL) smart contracts and receive reUSD
- A portion of the pool is converted into cash/T-Bills held in a **§114 Reinsurance Trust Account**, providing regulatory collateral to a Cayman-domiciled partner reinsurer (licensed by CIMA under Class B(iii))
- The offchain entity issues **Surplus Notes** to the ICL, contractually locking in principal protection and an interest rate matching the Applicable APY
- Offchain balances are attested by **The Network Firm** (with read-only account access) and published onchain through a **live Chainlink Proof-of-Reserve feed on Avalanche** ("Re Offchain Reserves," proxy [`0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), [data.chain.link](https://data.chain.link/feeds/avalanche/mainnet/re-reserves), re-verified onchain Sep 7, 2026 via `latestRoundData()`: ~$179.5M, last updated Sep 6, 2026 12:07 UTC). Caveats: the feed is on **Avalanche only and is not consumed by reUSD's Ethereum contracts**; its source is **TNF's LedgerLens™ API** (the same offchain attestor, now Chainlink-signed, not an independent second source); Chainlink labels it **"non-value-securing"** with an accuracy disclaimer; and it reports Re's offchain reserves generically, not a reUSD-only figure. The reUSD *share price* is written directly via `setSharePrice` on the Share Price Calculator (not via this feed); the onchain sUSDe price uses the Chainlink sUSDe/USD feed [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099). See the Chainlink usage appendix.

**Key metrics (Sep 7, 2026):**
- reUSD Price: ~$1.099 ([CoinGecko](https://www.coingecko.com/en/coins/re-protocol-reusd)); verified onchain as `1.099349` via Share Price Calculator `getSharePrice()`
- reUSD Market Cap: ~$252.7M (all chains, CoinGecko)
- reUSD Total Supply: ~215.16M on Ethereum (onchain `totalSupply()`, verified Sep 7, 2026)
- 24h Trading Volume: ~$365K (CoinGecko) — down sharply from ~$1.4M in June and ~$7.3M in April; token-level secondary-market activity is thinning even as onchain TVL grows
- TVL (DeFi Llama): ~$343.6M ([DeFi Llama](https://defillama.com/protocol/re); includes reUSDe and Re Capital)
- Ethereum NAV: ~$236.5M (onchain totalSupply × sharePrice, verified Sep 7, 2026; cross-checked against DeFi Llama's `re`/REUSD pool entry: $236,534,359)

**Links:**

- [Protocol Documentation](https://docs.re.xyz/)
- [Protocol App (reUSD)](https://app.re.xyz/)
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

MPC team descriptions below come from Re's public protocol materials and cannot be independently verified onchain (MPC signer sets are offchain). What IS onchain-verifiable: (a) the `Governance Safe` is a **3-of-5 Safe multisig** (not MPC) at [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) holding DEFAULT_ADMIN on reUSD/ICL/NAVConsumer and PROPOSER/CANCELLER on the Timelock; (b) the Timelock min delay is `172800` seconds = 48 hours and now holds UPGRADER_ROLE on reUSD and ICL and CUSTODIAN_MANAGER_ROLE on ICL; (c) an OpenZeppelin v5 `AccessManager` contract at [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8) is the `authority()` for the Instant Redemption contract and is administered by the `Access Admin` EOA below.

| Role | Controller Address | Control Mechanism (per docs) | Onchain Authority | Permissions |
|------|-------------------|------------------------------|-------------------|-------------|
| Oracle Admin | [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee) | MPC 3-of-5 (docs), **no timelock** | EOA; current `PRICE_SETTER_ROLE` holder onchain: only `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6). EOA `0x6C15B25E` NO LONGER holds this role (revoked). | Configure price feeds (per docs) |
| Redemptions Admin | [`0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8`](https://etherscan.io/address/0xEE16bE0374f2eFb34218affC1a8EbEe9310c47f8) | MPC 3-of-5 (docs), 48 hours | EOA | Set redemption limits, top-up redemption vault (per docs) |
| Access Admin | [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc) | MPC 5-of-8 (docs), 48 hours | EOA; observed calling `grantRole` / `labelRole` on `AccessManager` [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8) | Admin of OZ `AccessManager` (roles for Instant Redemption, etc.) |
| Custodian Manager | [`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93) | Timelock Controller, 48h delay | `CUSTODIAN_MANAGER_ROLE` on ICL now held by Timelock Controller (previously EOA `0x9b6d7f2de2E4569297C7e88531E47679cEbE6eC9`) — **verified** | Add/remove collateral custodians (48h timelocked) |
| Governance (DEFAULT_ADMIN) | [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) | **Safe 3-of-5** (onchain-verified; not MPC) | Holds DEFAULT_ADMIN on reUSD, ICL, and NAVConsumer; PROPOSER + CANCELLER on Timelock. UPGRADER_ROLE on reUSD and ICL now held by Timelock. Also owns ShareTokenMinterBurner and ReMintBurnAdapter. | Contract upgrades (via Timelock), role administration |
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

Re Protocol has 5 public smart-contract audit reports from Hacken, Certora, and Sherlock, plus a 2025 Agreed-Upon Procedures (AUP) report from The Network Firm for offchain reserve/custody verification and an August 2026 financial-statement audit of the reinsurer entity by Grant Thornton.

### Audit / Due Diligence History

| # | Date | Scope | Firm | Key Findings | Report |
|---|------|-------|------|-------------|--------|
| 1 | Sep 2024 | Smart Contract Audit (DeFi) | Hacken | 29 findings (0 Critical, 0 High, 4 Medium, 7 Low, 18 Observations), all resolved. Centralized minting, unaudited libraries, gas risk, 42.11% branch coverage | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-defi-aug2024/) |
| 2 | Dec 2024 | Smart Contract Audit | Hacken | Follow-up audit, issues remediated | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-contracts-nov2024/) |
| 3 | Apr 2025 | NAV Oracle Audit | Hacken | Scope: the Chainlink-Functions-based `NAVConsumer` + related code at `github.com/resilience-foundation/nav-oracle` (commits `ee7e98…` / `e3dd86ef…`). 8 findings, all resolved. The audited contract IS deployed and active onchain at [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6), holds `PRICE_SETTER_ROLE` on the `SharePriceCalculator`, and runs daily at 23:45 UTC. | [Hacken](https://hacken.io/audits/re-protocol/sca-re-nav-oracle-mar2025/) |
| 4 | Sep 2025 | Re Core (comprehensive) | Certora | 13 issues identified, all addressed and fixed. Formal verification and manual review. | [Certora](https://www.certora.com/reports/re-core) |
| 5 | Oct 2025 | Agreed-Upon Procedures (reserve/custody verification; not a smart-contract audit) | The Network Firm | Independent verification of offchain operational controls and reserve attestation | [AUP Report](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf) |
| 6 | Jul 15–18, 2026 | NAV Oracle re-audit (independent second review) | Sherlock (researchers KupiaSec, vinica_boy) | 0 High, 1 Medium (resolved), 5 Low/Informational (resolved). 100% of issues fixed prior to the audited commit being published. | [Re Insights](https://re.xyz/insights/auditing-the-oracle-sherlock-review) |
| 7 | FY2025 (published ~Aug 2026) | Financial-statement audit (GAAP-style, not a smart-contract audit) of **Cover Reinsurance SPC Ltd.** (the regulated reinsurer entity) — examined reinsurance transactions, premiums written, and reserves | Grant Thornton | Formal opinion on fair presentation of the reinsurer's financials, produced for exchange-listing purposes. Re states The Network Firm separately performed "complementary" audits of onchain/offchain balances and premium calculations around the same time; no new public TNF report was located to substantiate that claim independently. | [Re Insights](https://re.xyz/insights/re-first-protocol-audited-financials) |

**New since June 2026 reassessment:** items #6 and #7. The Sherlock engagement is a genuine independent second opinion on the audited-but-single-firm-reviewed NAV oracle stack (previously only Hacken had reviewed it). The Grant Thornton audit strengthens confidence in Cover Reinsurance SPC's solvency reporting but is a traditional accounting audit of the offchain reinsurer, not a review of any onchain contract — it does not change the smart-contract risk surface.

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

- **Production History**: Re Protocol launched in late 2022. reUSD token inception June 12, 2025 (per RWA.xyz) — ~15 months in production as of this reassessment. Curve pool created ~9 months ago per GeckoTerminal.
- **TVL**: ~$343.6M (DeFi Llama, Sep 7, 2026; includes reUSDe and Re Capital). ~$252.7M market cap across all chains (CoinGecko). ~215.16M reUSD on Ethereum (onchain `totalSupply()`).
- **Written Premiums** (Re-reported): **~$500M premiums written inception-to-date** (~$310M in 2026), reinsurance provided to **~1M US policyholders** across **~40 carriers/insurance partners**, per Re's June 18, 2026 $RE token-generation-event materials ([blog.re.xyz](https://blog.re.xyz/re-tge-launch/), [GlobeNewswire](https://www.globenewswire.com/news-release/2026/05/26/3300870/0/en/Resilience-Foundation-to-Launch-The-RE-Governance-Token.html)) — the most recent figures found; no fresher (post-TGE / September) update was located. This is cumulative *premium written* — not earned premium and not reUSD TVL. Not independently verified onchain (though FY2025 reinsurer financials now have a Grant Thornton audit opinion — see Audits).
- **Exchange Rate History**: reUSD has appreciated from ~$1.00 to ~$1.099, representing ~9.9% cumulative yield since inception (June 2025).
- **Governance token launch ($RE, Jun 18, 2026)**: Resilience Foundation conducted a token-generation event for **$RE**, the protocol's governance token (1B total supply; ~159.6M / ~16% in circulation at launch). Per Re's own governance site ([govern.re.xyz](https://govern.re.xyz/)), "Phase 1" (live at TGE) nominally covers "stake-to-vote governance, delegation, protocol upgrades, technical permissions." **Onchain, this has not yet translated into actual transfer of contract control**: the `DEFAULT_ADMIN_ROLE` on reUSD's core contracts was, and as of several of them still is, held by the same 3-of-5 Governance Safe that predates the TGE (see Centralization & Control → Governance for the verified current state). Treat the DAO launch as a governance-token and community-formation milestone, not yet as onchain decentralization of protocol control.
- **Incident (Aug 25, 2026) — Pendle/Morpho PT-reUSD TWAP manipulation, $36.4M liquidated**: An anonymous wallet (`0x854e…690d`) executed 11 trades on Pendle between 04:28–04:37 UTC, converting ~$320K of SY-reUSD into >9.5M YT-reUSD, pushing the implied PT-reUSD/YT-reUSD annualized yield above 20% and the PT-reUSD price down ~3%. Morpho's 15-minute TWAP oracle on the (thin, long-dated) PT-reUSD collateral market picked up the move and forced ~$36.4M in liquidations of leveraged borrowers (one address at ~90.9% LTV with <3% collateral buffer); the attacker profited an estimated ≥$360K. **Re Protocol's reUSD token and core contracts were not compromised and the Morpho market incurred no bad debt** — this was a downstream TWAP-oracle/leverage-design issue in Pendle's PT/YT market and Morpho's oracle configuration, not a Re Protocol exploit. Re publicly stated it is "investigating whether the PT market price was intentionally manipulated and working with relevant teams on a safer oracle configuration." Sources: [CryptoTimes](https://www.cryptotimes.io/2026/08/25/morphos-15-minute-twap-oracle-exploited-in-36-4m-liquidation-attack/), [CryptoBriefing](https://cryptobriefing.com/morpho-liquidations-pendle-reusd-cascade/), [CryptoRank/Pendle statement](https://cryptorank.io/news/feed/2af08-pendle-reusd-liquidations-pt-price-drop-oracle). This is the first incident of any kind associated with the reUSD ecosystem since inception; see Liquidity Risk for the current size of the PT-reUSD market this exposure sits in.
- **Other incidents**: No reported security incidents, exploits, or hacks found for Re Protocol's own reUSD contracts on Rekt News or DeFi Llama hacks database. **Note**: Resupply Protocol (a different project with a different reUSD token at a different address) suffered a $9.6M exploit in June 2025 -- this is unrelated to Re Protocol/re.xyz.
- **Peg/Price Stability**: reUSD is not a stablecoin in the traditional sense. Its price is designed to monotonically increase (accruing yield), so "depegging" is not applicable in the same way. The token price should only ever go up.

## Funds Management

### Token Mechanism

reUSD is an **ERC-20 deposit token** that uses a **price-appreciation model** (not rebasing):
- Users deposit admitted assets (USDC) into the ICL smart contract and receive reUSD; the token price increases daily based on the Applicable APY.
- **Onchain price path (re-verified Sep 7, 2026):** the share price is stored in `SharePriceCalculator` [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8) and written via `setSharePrice(uint256)`. The sole writer is `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — a Chainlink Functions + Chainlink Automation consumer (DON `fun-ethereum-mainnet-1`, subscription `85`, daily at 23:45 UTC). `NAVConsumer` enforces a 10% onchain deviation cap (`maxDeviationBps = 1000`) and was audited by Hacken in April 2025 and re-audited independently by Sherlock in July 2026 (0 High findings — see Audits). `PRICE_SETTER_ROLE` on the `SharePriceCalculator` is still held **only** by `NAVConsumer` (re-verified via `hasRole`, Sep 7, 2026) — the EOA `0x6C15B25E` remains revoked. `NAVConsumer`'s `DEFAULT_ADMIN` is still the Governance Safe (`hasRole` re-verified true); `EMERGENCY_UPDATER_ROLE` remains revoked from the former EOA. The `PriceRouter` [`0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66`](https://etherscan.io/address/0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66) reads the calculator via `SharePriceOracle` [`0x0764BFa862164D28799F31e7e1e7206F5177B6bB`](https://etherscan.io/address/0x0764BFa862164D28799F31e7e1e7206F5177B6bB); the same router reads sUSDe via `SimpleOracle` [`0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) wrapping Chainlink's `sUSDe/USD` aggregator [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099). The `SharePriceCalculator` itself only enforces `newPrice != 0` — the deviation cap lives in the `NAVConsumer`, not the calculator.
- **Governance improvement, phase 1 — token-level admin moved to the Timelock (executed; verified onchain via `hasRole`, Sep 7, 2026):** on Aug 10, 2026 (block 25725060, [tx `0x6ea549c7…`](https://etherscan.io/tx/0x6ea549c77800ce8d14aa710b3999dee0a6175b62ed9aad36a5f588e32d662254)) a Timelock-routed call **revoked `DEFAULT_ADMIN_ROLE` on the reUSD token from the Governance Safe** (and did the same on the reUSDe token [`0xddc0f880…`](https://etherscan.io/address/0xddc0f880ff6e4e22e4b74632fbb43ce4df6ccc5a)). `hasRole(DEFAULT_ADMIN_ROLE, Safe)` on reUSD now returns `false`; `hasRole(DEFAULT_ADMIN_ROLE, Timelock)` returns `true`. Since `DEFAULT_ADMIN_ROLE` is the role-admin for `MINTER_ROLE` on the token, this closes the June reversibility caveat **for minting**: the Safe can no longer re-grant `MINTER_ROLE` on reUSD without going through the 48-hour public Timelock queue.
- **Governance improvement, phase 2 — oracle/ICL-level admin migration scheduled but NOT yet executed (verified onchain, Sep 7, 2026):** on Sep 2, 2026 (block 25890480, [tx `0x3daca0b0…`](https://etherscan.io/tx/0x3daca0b03e904b11b057cf6fe2d47e6d4a8a76376a563e315fa273bb59183b92)) the Timelock scheduled 14 more `revokeRole(DEFAULT_ADMIN_ROLE, Safe)` calls, including on **ICL** [`0x4691…3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093), **`SharePriceCalculator`**, **`NAVConsumer`**, the **KYC Registry**, the **Deposit Token Registry**, the AUP "dust" contract [`0xE1886…3082`](https://etherscan.io/address/0xE1886BE2bA8B2496c2044a77516F63a734193082), and mirrored infrastructure for reUSDe (a second `SharePriceCalculator`/`NAVConsumer`/`DepositTokenRegistry` and an `InsuranceCapitalLayerFactory`). This batch became executable Sep 4, 2026 15:23 UTC (48h delay elapsed) but **had not been executed as of this report** (Sep 7, 2026, ~67h after eligibility — no `CallExecuted` or `Cancelled` event found). **Until it executes, the June reversibility caveat for price-setting still stands as-is today**: `SharePriceCalculator`'s `DEFAULT_ADMIN_ROLE` is still the Governance Safe (re-verified `hasRole` = `true`, Sep 7, 2026), so the Safe can still re-grant `PRICE_SETTER_ROLE` to any address without a timelock delay. Monitor for this call's execution — once it lands, the price-path reversibility caveat closes structurally.
- The Network Firm performs offchain attestations of the §114 Trust balances. A **Chainlink Proof-of-Reserve feed for "Re Offchain Reserves" is live on Avalanche** (proxy [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), OCR2 aggregator, re-verified live and current Sep 7, 2026: ~$179.5M, last updated Sep 6, 2026), but **no Chainlink PoR aggregator is consumed onchain by any Ethereum reUSD contract** — the onchain NAV Oracle publishes the *share price*, not reserves, and the Avalanche PoR feed is a standalone transparency mirror. See the Chainlink usage appendix at the end of this report.
- The Network Firm performs offchain attestations of the §114 Trust balances. A **Chainlink Proof-of-Reserve feed for "Re Offchain Reserves" is live on Avalanche** (proxy [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), OCR2 aggregator, 16 transmitters, TNF LedgerLens source), but **no Chainlink PoR aggregator is consumed onchain by any Ethereum reUSD contract** — the onchain NAV Oracle publishes the *share price*, not reserves, and the Avalanche PoR feed is a standalone transparency mirror. See the Chainlink usage appendix at the end of this report.
- **NAV formula**: `(Spread/365) + max[sUSDe(T)/sUSDe(T-7d) - 1 ; TBILL(T)/TBILL(T-7d) - 1] × (undeployed capital / total capital) + SOFR × (deployed capital / total capital)`. Spread = 250 bps.

### Capital Deployment

1. **Onchain**: a portion of deposits is kept in onchain backing, verified at ~67.9% of Ethereum NAV on Sep 7, 2026 (see Collateralization). Held as USDC, USDT, USDe and sUSDe in the ICL Custodial Wallet and redemption reserves.
2. **Offchain (§114 Trust)**: Remainder deployed offchain into U.S.-domiciled §114 Reinsurance Trust Accounts, providing admitted collateral for the partner reinsurer's insurance programs
3. **Surplus Notes**: The offchain entity issues legally binding surplus notes back to the ICL, contractually guaranteeing principal protection and the Applicable APY interest rate
4. **Yield Sources**: Delta-neutral ETH strategy (Ethena basis trade) or T-Bills, plus protocol spread from reinsurance premiums

### Reinsurance Portfolio (summary)

Re reinsures a diversified book of U.S. insurance programs. Per Re's public materials and a May 2026 press release ([GlobeNewswire](https://www.globenewswire.com/news-release/2026/05/26/3300870/0/en/Resilience-Foundation-to-Launch-The-RE-Governance-Token.html)), the book spans **~35 carriers / insurance partners** ("more than 30" per the release) and **~600K policyholders** ("hundreds of thousands"), with **inception-to-date premiums written of ~$409M** (~$226M of it written in 2026). The premium base is therefore a **multiple of reUSD TVL** — Re cites roughly **7:1 authorized leverage** of premium to capital. (Earlier drafts described "a ~$174M portfolio across 26+ contracts"; that conflated the **reUSD token supply** with the reinsurance book and is removed.) Re classifies the book as "low-volatility" and claims a ~92% combined ratio over 2022-2024 with no capital impairment. Re's own modeled loss ladder (LP memo) ties combined-ratio levels to probabilities of the portfolio reaching them: **105% → 3.9%** (Re Capital attaches), **110% → 1.9%** (reUSDe attaches), **115% → 0.9% (reUSD attaches)**, **135% → 0.03%** (deep stress). **All portfolio composition, carrier/policyholder counts, leverage, combined-ratio, ROE, pipeline, and stress-testing figures are sourced from Re's own materials (LP memo, intro deck, press release, app.re.xyz dashboards) — none are independently verified onchain.**

### Capital Structure: reUSDe (Mezzanine / Second-Loss Tranche)

reUSDe is the protocol's **mezzanine / second-loss** tranche ([docs](https://docs.re.xyz/products/about-reusde)) — **not** the first-loss tranche. Per Re's own loss waterfall, the **first-loss buffer is Re Capital (the reinsurer's own equity)**; reUSDe absorbs losses only *after* reinsurer equity is exhausted; reUSD is the senior, last-to-be-impaired layer. reUSDe takes underwriting losses before they reach reUSD in exchange for a higher yield: it earns the **risk-free/SOFR rate plus a fixed 850 bps spread** (vs +250 bps for reUSD) per [docs.re.xyz](https://docs.re.xyz/products/about-reusde) (*"reUSDe earns a very predictable risk free rate + a spread of 850bps"*). (The retired "16-25% net annual returns" performance-share model is no longer in effect and has been removed.)

**Loss waterfall** (losses absorbed in order, by portfolio combined ratio):
1. **No losses below ~105%** combined ratio.
2. **Re Capital** (~$73M, the reinsurer's equity) — **first-loss** buffer, absorbs losses in the **105–110%** band.
3. **reUSDe** (mezzanine / second-loss) — absorbs losses in the **110–115%** band, after Re Capital is exhausted.
4. **reUSD** (senior) — **starts taking losses above 115%** combined ratio, after both Re Capital and all reUSDe reserves are depleted. (135% is a deep-stress scenario, not the attachment point.)

Re's modeled impairment likelihoods are the probability of the portfolio combined ratio *reaching* each level: **105% → ~3.9%** (Re Capital attaches), **110% → ~1.9%** (reUSDe attaches), **115% → ~0.9% (reUSD attaches)**, **135% → ~0.03%** (deep stress). **The relevant figure for reUSD is therefore ~0.9% (reaching its 115% attachment), not the ~0.03% at the 135% deep-stress level.** These numbers come from a single chart in the Nov 2025 LP Memo (*"Re Capital Structure and Risk-Remote Design"*). **The model is undisclosed**: no distributional assumptions, correlation structure, simulation count, calibration window, confidence intervals, or actuarial sign-off are published. The tail figures also assume the subordinated buffer is fully intact at time of stress. Treat as Re-asserted, not independently attested.

**reUSDe mechanics:**
- Price based on quarterly-refreshed target NAV derived from actuarial reports; compounds daily but surplus realization occurs quarterly
- Idle capital earns sUSDe basis-trade yield until called for underwriting
- Redemptions are quarterly (72h window at fiscal quarter start), pro-rata if requests exceed capacity; unfilled rolls to next quarter
- Re's public materials describe a restoration order in which later reinsurance profits first recapitalize reUSD/reUSDe before the Re Capital buffer (not verifiable onchain).
- **Issuer:** reUSD and reUSDe are issued through **Resilience Foundation Cayman LLC** (Cayman Islands Exempted Limited Guarantee Foundation Company), per Re's [Legal Disclosures](https://re.xyz/disclosure). **Resilience (BVI) Ltd is an affiliate service provider** (administrative/operational/token-related services), **not** the token issuer — the earlier "issued by Resilience (BVI) Ltd" attribution (taken from RWA.xyz) was incorrect.
- reUSD is stated to be protected by subordinated assets (Re Capital + reUSDe combined); only Re Capital ~$73M is directly referenced in the LP Memo. The total subordinated buffer amount is a protocol claim, not independently verified.

### Accessibility

- **Deposits**: KYC/AML required (via SumSub and Chainalysis). Users must pass KYC checks because a portion of protocol capital is deployed with a Cayman-regulated reinsurance company (CIMA-regulated).
- **KYC on redemption — enforced onchain** (verified Apr 17, 2026): every redemption entrypoint reverts with `KYCRequired` if `kyc.isKYCApproved(msg.sender) == false`. Checked functions in the `InstantRedemptionInteraction` contract [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e): `redeemInstant`, `submitWindowRequest`, `adjustWindowRequest`, `claimWindowPayout`. The same check is repeated inside `InstantRedemption._processRedemption` on the user argument. **A KYC revocation therefore blocks not only new deposits but also the holder's ability to redeem onchain through the protocol.** Selling on a DEX remains possible because DEX routers do not gate transfers on KYC.
- **reUSD — Instant Redemption**: available from the onchain instant liquidity buffer via `redeemInstant(uint256 shares, uint256 minPayout)` on the Interaction contract (which delegates to the `InstantRedemption` implementation at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40)). Atomic, same-block settlement. **Onchain-verified parameters, re-checked Sep 7, 2026 — unchanged since Apr 2026**: `minRedemption = 0.01 reUSD` (`1e16`), `maxRedemption = 1,000,000 reUSD` (`1e24`), `dailyLimitBps = 2000` (20% of capacity), `userLimitBps = 1000` (10% per wallet), `feeBps = 6` (0.06%), `dayPayoutToken = sUSDe`. At the fastest drain rate, ~5 days to exhaust all liquid onchain reserves (20% per day). The "250 reUSD minimum" cited elsewhere is not in the public docs and contradicts the onchain parameter; treat `0.01 reUSD` as the contract-level floor.
- **reUSD — Windowed Redemption**: once the instant buffer is exhausted, the protocol opens a redemption window (minimum 24 hours). Requests fulfilled pro-rata based on available capital. Proceeds must be claimed within two months.
- **reUSDe — redemption works differently** (per [docs](https://docs.re.xyz/products/about-reusde)): **no instant redemption path exists**. reUSDe redemptions are quarterly-only. Request window = first 72 hours of each fiscal quarter; an "actuarial gate" at quarter-end (≤10 business days) determines *Available Surplus*; payouts are pro-rata against that surplus; unfilled balances auto-roll into the next quarter while retaining queue seniority. Re explicitly notes *"No secondary market maker pool is promised"* for reUSDe. The senior-tranche instant buffer/vault described above applies to reUSD only, not reUSDe.
- **DEX Trading (Re reUSD only, re-verified Sep 7, 2026)**: Fluid reUSD/USDT DEX pool (~$24.94M — note: USDT, not USDC); Curve reUSD/sUSDe (~$2.31M) and reUSD/USDC (~$452K); Avalanche Blackhole reUSD/USDC pools **not found** in DeFi Llama's current listings (was ~$1.47M combined in June — unverified this cycle, see Liquidity Risk). **Total DEX liquidity ~$27.7M** on Ethereum (DeFi Llama yields API, filtered by underlying token `0x5086…0c72`). Larger pools labelled "reUSD/scrvUSD", "reUSD/sfrxUSD", "reUSD/fxUSD", "reUSD/sDOLA" on Curve/Convex/Stake-DAO/Beefy are **Resupply Protocol's reUSD** (`0x57aB1E00…`) and are NOT Re reUSD exits.
- **Not available to U.S. persons**
- **Fees**: Redemption fee of `6 bps` (0.06%) — **onchain-verified** via `InstantRedemption.feeBps() = 6` at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) ([docs](https://docs.re.xyz/products/about-reusd)). No documented deposit fees, management fees, or performance fees. RWA.xyz reports 0.18% subscription and 0.18% redemption fees — discrepancy with docs may reflect different fee tiers or methodology. Onchain data shows ~$1,535 total deposit fees collected historically, suggesting a small deposit fee mechanism exists in the contracts (also flagged in Hacken audit finding F-2024-5214 "Unclaimed Deposit Fees Unaccounted For").

### Collateralization

- **Onchain reserve target**: Re's public materials describe a target of ≥50% of deposits kept in onchain backing (USDC, sUSDe, and — per protocol claim — potentially T-bill wrappers such as BUIDL).
- **Onchain reserves — re-verified Sep 7, 2026 against AUP address list**: The Network Firm's Oct-2025 AUP report lists **15 Fireblocks-MPC-controlled addresses** as in-scope for Re's supporting assets ([`AUP-Report-2025.pdf`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf), Procedure 3 table). All 15 were re-checked onchain for USDC / USDT / USDe / sUSDe / BUIDL balances today. 10 are empty; 5 hold non-dust balances:

| # | AUP-listed address | Chain type | Current USD value | Share (all-in) |
|---|---|---|---|---|
| 1 | [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) ICL Custodial Wallet | **EOA** | **$55.14M** (USDC $0.40M + USDT $0.31M + USDe $0.09M + sUSDe $54.33M) | 34.3% |
| 2 | [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) Redemption Reserves Custodian | **EOA** | **$93.50M** (100% sUSDe) | 58.2% |
| 3 | [`0xd4374008c88321Eb2e59ABD311156C44B25831e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9) | **EOA** | **$2.87M** (100% sUSDe) | 1.8% |
| 4 | [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) Daily Instant Redemption Vault | Contract (`RedemptionVault`) | $9.09M (100% sUSDe) | 5.7% |
| 5 | [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) ICL | Contract (proxy) | $0 | — |
| 6 | [`0xE1886BE2bA8B2496c2044a77516F63a734193082`](https://etherscan.io/address/0xE1886BE2bA8B2496c2044a77516F63a734193082) | Contract | $5.2K (USDe+sUSDe dust, up from $258 in June) | — |
| 7-15 | 0x19af…5896, 0x4F1f…DaE4, 0x802e…0291, 0x9AB6…1FE3, 0xb22a…fbe1, 0xD75E…eDE9, 0xe132…9d23, 0xfB60…4BB0, 0xfd40…B852 | 9 × EOA | $0 | — |
| **Total** | | | **~$160.60M** | **100%** |

  (sUSDe valued at the onchain sUSDe/USDe exchange rate of `1.246915` via `convertToAssets`, re-queried Sep 7, 2026, assuming USDe ≈ $1.)

  **Coverage ratio: $160.60M / $236.53M Ethereum NAV = ~67.9%** (all-in). The protocol-stated ≥50% target is now met with ~18 percentage points of headroom — a sharp improvement from ~2 pp in June.

  **Address 3 (`0xd4374008…B25831e9`) — reUSDe collateral (per team feedback, unchanged attribution).** It currently holds $2.87M, now entirely sUSDe (was a USDe/sUSDe mix in June). Per Re, this backs **reUSDe, not reUSD**. **Excluding it, reUSD-only onchain reserves are ~$157.73M and reUSD-only coverage is ~$157.73M / $236.53M ≈ 66.7%** (up from ~50.2% in June). This attribution is Re's; onchain the address is indistinguishable from the other Fireblocks EOAs.

- **Concentration flip — reserves swung from mixed to near-monoline sUSDe (critical, new this cycle)**:
  - **~99.5% of onchain reserves are now sUSDe** (up from ~72.9% in June), and **USDC has collapsed to ~0.25% (~$400K, down from ~20.9% / $19.55M in June)**. USDT (~0.20%) and USDe (~0.06%) are similarly negligible. This reverses the improving-USDC trend the June report highlighted. The immediately-liquid (non-cooldown-gated) share of onchain reserves is now close to zero: virtually the entire $160.6M sits in an asset that requires Ethena's 7-day sUSDe→USDe unstake cooldown to convert to a non-sUSDe stable asset. **This breaches the monitoring thresholds this report itself set in June** ("alert if the sUSDe share of reserves exceeds 80% or the USDC share drops below 15%") — both are now breached by a wide margin.
  - **No BUIDL or T-bill-wrapper balances** were found at any of the ICL / vault / custodian addresses (Sep 7, 2026), even though Re's materials mention such assets as potential reserves. Apart from USDC / USDT / USDe / sUSDe, the ICL Custodial Wallet continues to hold non-dust protocol-owned `reUSDsUSDe` Curve LP tokens (excluded from the reserve total above). All other token balances at these addresses are airdrop spam or dust.
  - The ICL contract [`0x4691…3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) itself still holds $0 in reserves — assets sit at the Custodial Wallet (an EOA) and at the Redemption Reserves Custodian (also an EOA).

- **Custody / asset-movement surface — ~94% of reserves now sit at plain EOAs (critical, up from ~86% in June)**:

  Of the $160.60M onchain reserve, **$151.50M (~94.3%) sits at three plain EOAs**: the ICL Custodial Wallet (~$55.14M), the Redemption Reserves Custodian (~$93.50M), and `0xd4374008…B25831e9` (~$2.87M, the **reUSDe** ICL custodian per team feedback — counted here because the EOA custody *risk* is token-agnostic, but excluded from the reUSD-only coverage ratio above). Only $9.09M (the Daily Instant Redemption Vault) sits behind contract-enforced role gating — a smaller share of a larger pie than in June. From the chain's perspective, each EOA is indistinguishable from an ordinary single-key wallet. One ECDSA signature, one `transfer(...)` call, and those funds move anywhere — no onchain delay, no destination whitelist, no role check.

  Re's documentation and the October 2025 AUP describe these as **"Fireblocks MPC (Multi-Party Computation) wallets"** in which *"the associated private key is split into encrypted 'shares'"* (AUP Report 2025, footnote 2). Important caveats about what the AUP actually proves:

  - The AUP procedure for the Fireblocks assets was *"observe Re Management access the Fireblocks blockchain-based MPC wallet"* and then *"query the blockchain-based addresses observed for Supporting Assets"*. **This is watching someone log in; it is not cryptographic verification that N-of-M signers are required for any given transaction.** TNF relied on Re's assertion of the MPC structure.
  - The AUP explicitly disclaims operating-effectiveness testing of internal controls: *"We did not perform procedures regarding the operating effectiveness of the Re's internal controls."*
  - The AUP was also scoped to exclude 1:1 backing, TVL, and token valuations: *"We did not perform procedures over specific aspects of the Re Protocol, including but not limited to … 1:1 backing of reserves to the tokens or the total value locked (TVL) of the Re Protocol."*

  Onchain, the EOAs have no code — no Safe multisig, no timelock wrapper, no onchain-whitelisted destination set, no per-asset spending caps. Whatever Fireblocks policies exist (transaction whitelists, per-asset limits, approval workflows) and whatever the real MPC quorum is are **entirely offchain** and unverifiable by anyone outside Re. The **48-hour Timelock does NOT protect these reserves** — it only gates governance actions routed through `TimelockController` (upgrades, role changes).

  What's needed to drain $151.50M onchain:

  - If the claimed N-of-M MPC is real and Fireblocks policies are tight → compromise the policy + compromise or collude signer quorum → **1 signed tx**.
  - If Fireblocks policies are permissive → signer-quorum compromise / collusion alone → **1 signed tx**.
  - If an insider with quorum access is malicious → **1 signed tx**.

  This is the single largest unmitigated custody risk in the system. The AUP provides evidence that the specific address list is in Re's MPC setup, not that unauthorized movement would be prevented by multi-party signing.
- **Onchain buffer**: Instant redemption vault and Redemption Reserves Custodian hold ~$102.59M of sUSDe plus $0 USDC for immediate redemptions (up from ~$65.66M in June; USDC instant exits still unavailable under current config — see Liquidity).
- **Offchain trust**: §114 Reinsurance Trust holds cash and T-Bills in NAIC-compliant banks; Re's public materials name these as "an independent bank / custodian" without disclosing specific counterparty names. The independently-verifiable attestations of these balances are (a) the Oct 31, 2025 Agreed-Upon Procedures report by The Network Firm ([`AUP-Report-2025.pdf`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf)), (b) an August 2026 Grant Thornton FY2025 financial-statement audit of the reinsurer entity Cover Reinsurance SPC Ltd. (see Audits — a traditional accounting audit, not onchain verification), and (c) the **live Chainlink "Re Offchain Reserves" PoR feed on Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), re-verified live Sep 7, 2026: ~$179.5M, last updated Sep 6, 2026), which publishes TNF's LedgerLens attestation through Chainlink's signed OCR2 infrastructure. The PoR feed is a meaningful transparency upgrade but is **not** an independent second source (it transports the same TNF attestation), is **not** consumed by reUSD's Ethereum contracts, and is labeled "non-value-securing" (see the Chainlink usage appendix).
- **Surplus Note protection**: Surplus notes rank junior to policyholders but contractually protect depositor principal
- **Re Capital buffer**: ~$73M subordinated **first-loss** layer (the reinsurer's equity) ahead of reUSDe and reUSD; absorbs losses in the 105–110% combined-ratio band
- **reUSDe as backstop**: reUSDe is the **mezzanine / second-loss** layer (not first-loss). It absorbs losses in the 110–115% band, after Re Capital is exhausted, before losses reach reUSD. Per Re's model, **reUSD's loss likelihood is ~0.9% (portfolio reaching its 115% attachment), not 0.03%** — the 0.03% figure corresponds to a 135% deep-stress level, well beyond reUSD's attachment point

### Provability

- **reUSD price**: Updated daily by a Chainlink-Functions-driven `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) calling `SharePriceCalculator.setSharePrice`. The NAV computation itself is **not** programmatically onchain — Chainlink Functions runs JS offchain (DON `fun-ethereum-mainnet-1`, subscription `85`) and returns a single NAV value. Onchain safeguards: Chainlink Automation triggers daily at 23:45 UTC; `NAVConsumer.maxDeviationBps = 1000` (10%) enforces a deviation guard; Hacken audited the NAV Oracle in Apr 2025 and Sherlock independently re-audited it in Jul 2026 (0 High findings). `PRICE_SETTER_ROLE` on the `SharePriceCalculator` is re-verified (Sep 7, 2026) still held **only** by `NAVConsumer` — the EOA `0x6C15B25E` remains revoked. `NAVConsumer`'s `DEFAULT_ADMIN` is still the Governance Safe (re-verified); `EMERGENCY_UPDATER_ROLE` remains revoked from the former EOA. **Reversibility — partially closed, one leg still open:** the Governance Safe's `DEFAULT_ADMIN_ROLE` on the reUSD **token** was moved to the Timelock on Aug 10, 2026 (verified onchain), closing the reversibility gap for `MINTER_ROLE`. A matching move for `SharePriceCalculator` and `NAVConsumer` was scheduled Sep 2, 2026 and became executable Sep 4, 2026, but **has not executed as of this report** — so `PRICE_SETTER_ROLE` can still be re-granted to an EOA by the Safe without a timelock delay today. See Token Mechanism above for the full timeline.
- **Onchain reserves**: Visible onchain via the ICL contract and Redemption Reserves Custodian
- **Offchain reserves**: Attested by The Network Firm and published onchain via a **live Chainlink Proof-of-Reserve feed** — "Re Offchain Reserves," proxy [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract) on **Avalanche** ([data.chain.link](https://data.chain.link/feeds/avalanche/mainnet/re-reserves)), re-verified live Sep 7, 2026 (~$179.5M, last updated Sep 6, 2026). It is a genuine Chainlink PoR product (directory path `re-reserves`, Product Type "Proof of Reserve," an `AccessControlledOCR2Aggregator` with 16 transmitters). Material caveats unchanged from June: (a) the data source is **TNF's LedgerLens™ API**, so the feed transports the same offchain attestation rather than adding an independent verifier; (b) Chainlink labels it **"non-value-securing"** with an accuracy disclaimer; (c) it is **not consumed by any Ethereum reUSD contract**; and (d) it reports Re's offchain reserves generically, not a reUSD-only number. The onchain Chainlink dependency for reUSD's *pricing* remains the `sUSDe/USD` aggregator ([`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099)). Now also complemented offchain by the Grant Thornton FY2025 financial-statement audit of Cover Reinsurance SPC Ltd. (see Audits). See the Chainlink usage appendix.
- **Insurance performance**: Reinsurance returns are inherently offchain and depend on claim experience over multi-year treaty periods
- **Minting requires backing (ICL path)**: All ICL deposit paths (`deposit`, `depositFromCustodian`, `processPrestakedDeposit`) enforce `safeTransferFrom` — backing tokens must be transferred to the ICL before reUSD is minted (verified in source at [implementation `0x06d4acc104b974cd99bf22e4572f48a051e59670`](https://etherscan.io/address/0x06d4acc104b974cd99bf22e4572f48a051e59670)). However, the reUSD token contract has an unrestricted `mint(address, uint256)` gated only by `MINTER_ROLE`.
- **MINTER_ROLE holders (re-verified via `hasRole` on Sep 7, 2026)**: **TWO** contracts hold the role — unchanged from June:
  1. `InsuranceCapitalLayer` [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) — backed mint path; enforces `safeTransferFrom`.
  2. `InstantRedemption` [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) — burns reUSD on redemption; uses MINTER_ROLE because `mint` and `burn` typically share the role in this codebase.
  - `ShareTokenMinterBurner` [`0x0dFb42aa18CEeD719617cd554304F6cA412A6b18`](https://etherscan.io/address/0x0dFb42aa18CEeD719617cd554304F6cA412A6b18) still **does not hold MINTER_ROLE** (re-verified false, Sep 7, 2026). The OFT cross-chain mint path via `ReMintBurnAdapter` [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85) is rate-limited at `2,500,000 reUSD / 24h` per peer chain.
- **Grant of `MINTER_ROLE` is now timelock-gated**: because `DEFAULT_ADMIN_ROLE` on the reUSD token moved from the Governance Safe to the Timelock on Aug 10, 2026 (verified onchain), any future `MINTER_ROLE` grant must go through the 48-hour public Timelock queue rather than being directly callable by the Safe. This closes the June-era concern that the Safe could re-grant `MINTER_ROLE` without delay.

## Liquidity Risk

### Primary Exit Mechanisms

1. **Instant Redemption**: From the onchain buffer. Atomic, same-block. Available until buffer is exhausted (< 1% of supply triggers window-only mode)
2. **Quarterly Redemption**: Processed pro-rata with available capital not reserved for reinsurance plus actuarially released funds
3. **DEX Swap**: Sell reUSD on Curve reUSD/USDC pool

### DeFi Integrations

Onchain-verified integrations that consume **Re Protocol's reUSD** (`0x5086…0c72`), re-checked Sep 7, 2026 against DeFi Llama's yields API (`underlyingTokens` match, not just symbol match):

| Protocol | Type | Notes |
|----------|------|-------|
| Fluid DEX | DEX | reUSD/USDT pool: **~$24.94M TVL** (up from ~$11.62M in June — more than doubled). Largest trading venue. |
| Fluid Lending | Lending | Three lending markets supply reUSD, combined **~$26.0M** (down from ~$62.3M in June). |
| Curve | DEX | reUSD/sUSDe (~$2.31M, up from ~$1.42M), reUSD/USDC (~$452K, flat). (reUSD/scrvUSD, reUSD/sfrxUSD, reUSD/fxUSD, reUSD/sDOLA pools are Resupply reUSD, not Re's.) |
| Morpho (direct reUSD collateral) | Lending | Re reUSD vaults, combined **~$15.45M** (up from ~$7.0M in June). |
| Morpho (PT-reUSD collateral, via Pendle) | Lending | **New/materially larger this cycle**: two markets using Pendle's wrapped `PT-REUSD-10DEC2026` token as collateral, combined **~$103.1M TVL** (underlying token `0xeCfaFdC7…957`, distinct from raw reUSD). This is the market family that suffered the Aug 25, 2026 TWAP-manipulation liquidation (see Historical Track Record) — the June report only flagged this as "PT-REUSD-25JUN2026 markets also reference Re reUSD indirectly" without sizing it; it is now a ~$103M leveraged exposure surface, larger than reUSD's entire DEX + direct-lending footprint combined. |
| Pendle | Yield | reUSD SY/PT/YT tokenization market: ~$10.60M TVL (up from ~$8.42M). This is the market where the Aug 25 TWAP manipulation occurred. |
| Beefy | Vault | reUSD auto-compounding vault: ~$188K (down from ~$786K). |
| Stake-DAO | Vault | `SUSG-REUSD` vault: ~$989K (up from ~$428K single-asset vault in June; pairing changed). |
| Blackhole (Avalanche) | DEX | **Not found** in DeFi Llama's current Avalanche pool listings for either underlying token or "reusd" in the symbol (checked Sep 7, 2026), versus ~$1.47M combined in June. Could reflect delisting from tracking or a real liquidity withdrawal — **unverified this cycle; flag as TODO to confirm directly via Snowtrace** before treating Avalanche DEX liquidity as zero. |

Combined ~$41.5M of Re reUSD (direct, unwrapped) is supplied into Fluid + Morpho lending markets onchain — down from ~$69.3M in June — while a new ~$103M pool of *wrapped* (Pendle PT) reUSD collateral has grown on Morpho, a market segment demonstrated to be fragile to oracle manipulation on Aug 25, 2026.

### Liquidity Summary

- **Total DEX Liquidity (onchain-verified, Re reUSD only, Ethereum)**: **~$27.7M** across Fluid and Curve (~**11.0%** of ~$252.7M market cap) — up from ~$14.96M / ~8.2% in June. Fluid reUSD/USDT (~$24.94M) remains the dominant venue (~90% of DEX depth). Avalanche Blackhole liquidity is unverified this cycle (see above) and excluded from this total, so it is a conservative floor.
- **24h Trading Volume (token-level, CoinGecko)**: ~$365K — down sharply from ~$1.4M in June and ~$7.3M in April, even as onchain TVL and DEX depth grew. Secondary-market turnover is thinning.
- **Instant redemption buffer (Sep 7, 2026, onchain, re-verified)**: The Daily Instant Redemption Vault at [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) holds `0` USDC and sUSDe worth ~$9.09M (down from ~$12.71M in June). The `custodialWallet` (labeled "Redemption Reserves Custodian" in this report) [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) is an EOA and holds `0` USDC and sUSDe worth ~$93.50M (up from ~$52.95M in June). Combined instant-adjacent buffer ~$102.6M (up from ~$65.66M). The configured `dayPayoutToken` is still **sUSDe** (not USDC) — re-verified onchain — so instant redemptions still settle into sUSDe under current config, and (per Collateralization above) there is now almost no USDC anywhere in the reserve stack to fall back to.
- **Instant Redemption Interaction Contract**: [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) — exposes `redeemInstant(uint256 shares, uint256 minPayout)` for instant redemptions. Params re-verified unchanged: `dailyLimitBps=2000` (20%), `userLimitBps=1000` (10%), `feeBps=6` (0.06%).
- **Onchain capital (Sep 7, 2026)**: ICL Custodial Wallet [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) holds ~$0.40M USDC + ~$54.33M sUSDe (was ~$19.55M USDC + ~$1.79M sUSDe in June — a near-complete reversal of composition). ICL contract itself holds $0.
- **Quarterly queue**: Pro-rata fulfillment, may not be fully met if capital is locked in reinsurance
- **KYC required**: Both for deposit and redemption through the protocol
- **Multi-chain**: Available on 6+ chains. Ethereum DEX liquidity now ~$27.7M; Avalanche DEX presence unverified this cycle (see above).

## Centralization & Control Risks

### Governance

- **Governance (re-verified onchain, Sep 7, 2026)**: A **Safe 3-of-5 multisig** at [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) (SafeProxy; still 5 owners, same addresses, threshold 3 — unchanged since June) holds `PROPOSER` + `CANCELLER` on the Timelock and **still** holds `DEFAULT_ADMIN_ROLE` on **ICL** and **NAVConsumer** (re-verified `hasRole` = true). It **no longer** holds `DEFAULT_ADMIN_ROLE` on the reUSD or reUSDe **tokens** — that moved to the Timelock on Aug 10, 2026 (verified onchain; see Token Mechanism). `UPGRADER_ROLE` on reUSD and ICL remains with the Timelock Controller (unchanged). The protocol docs also describe additional MPC-controlled admin EOAs (Oracle, Redemptions, Access); those EOAs still exist onchain, unchanged, but the `N-of-M` MPC quorum remains offchain and unverifiable.
  - Oracle admin EOA: `0x49BC5A88…9212A0ee` — **no timelock** (but `PRICE_SETTER_ROLE` on `SharePriceCalculator` is re-verified held only by `NAVConsumer`; the EOA bypass remains closed).
  - Redemptions admin EOA: `0xEE16bE03…310c47f8`.
  - Access admin EOA: `0x80a62B72…812fECAFc` (administers `AccessManager` [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8)).
  - Custodian manager: **Timelock Controller** [`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93) re-verified still holds `CUSTODIAN_MANAGER_ROLE` on ICL. Custodian changes remain 48h-timelocked.
  - Timelock executor EOA: `0x4BFea59b…740738F3` (unchanged).
- **Pending governance migration (scheduled Sep 2, 2026; not yet executed)**: a Timelock batch would revoke the Governance Safe's `DEFAULT_ADMIN_ROLE` on ICL, `SharePriceCalculator`, `NAVConsumer`, the KYC Registry, the Deposit Token Registry, and mirrored reUSDe-side infrastructure. It became executable Sep 4, 2026 15:23 UTC and, as of this report (Sep 7, 2026), has **not been executed** — no `CallExecuted` or `Cancelled` event found ~67 hours after eligibility. Once it lands, the remaining reversibility gap on `PRICE_SETTER_ROLE` (see Programmability) closes. Until then, treat the June-era caveat as still fully in force.
- **Upgrade Pattern**: UUPS / ERC1967 upgradeable contracts (reUSD and ICL implementations verified, no new `Upgraded` events since June).
- **Upgrade Authority**: Timelock Controller ([`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93)). Timelock `getMinDelay() = 172800` seconds (**48 hours**, re-verified onchain, unchanged). Both `UPGRADER_ROLE` on reUSD and ICL remain with the Timelock.
- **Timelock**: 48-hour timelock on upgrades, role changes, and custodian changes routed through Timelock. Since Aug 10, 2026 this also covers the token-level admin role (mint authority); the oracle/ICL-level admin role is scheduled to follow but has not yet executed.
- **$RE governance token launched (Jun 18, 2026) — marketing vs. onchain reality**: Resilience Foundation conducted a TGE for **$RE** (1B supply, ~16% circulating at launch), branding "Phase 1" as covering "protocol upgrades, technical permissions." **Onchain, actual contract control has not moved to any DAO/Governor contract** — every admin role checked in this reassessment is still held by the same 3-of-5 Governance Safe or the Timelock it controls via `PROPOSER`/`CANCELLER`. No Governor contract was found holding any role on the audited contracts. Treat $RE as a governance-token and community-formation milestone; it has not yet decentralized who can act on the protocol.
- **No onchain governance over contract control**: Protocol is currently governed by an expert-led council (Resilience Foundation) via the same Safe/Timelock structure verified since inception. The DAO framework exists but has not yet taken custody of any admin role.
- **MPC signers**: Re Team members — not publicly identified.

### Programmability

- **reUSD price**: **NOT programmatically computed**. The NAV itself is produced offchain by a Chainlink Functions JS job, delivered onchain by `NAVConsumer`, and stored in `SharePriceCalculator`. Onchain, the NAV Consumer enforces a 10% deviation cap per update (`maxDeviationBps = 1000`), re-verified unchanged. A Chainlink PoR feed for Re's offchain reserves is live on Avalanche (re-verified live, updated Sep 6, 2026), but **no PoR aggregator is consumed onchain by the Ethereum reUSD contracts** to gate pricing or redemption (see the Chainlink usage appendix). The `SharePriceCalculator`'s `PRICE_SETTER_ROLE` is re-verified held **only** by `NAVConsumer` — the EOA bypass path remains closed. `NAVConsumer`'s `DEFAULT_ADMIN` is still the Governance Safe (re-verified); `EMERGENCY_UPDATER_ROLE` remains revoked from the former EOA. **Caveat — unchanged from June, closure pending**: the `SharePriceCalculator`'s role admin is still the Governance Safe (not the Timelock) as of this report, so `PRICE_SETTER_ROLE` can still be re-granted to an EOA without a timelock delay. A Timelock call that would close this gap was scheduled Sep 2, 2026 and is overdue for execution (see Governance above) — the price path is not yet structurally tamper-resistant, though a fix is queued.
- **Deposits**: Require KYC verification through the KYC Registry contract
- **Redemptions**: Instant redemptions are programmatic (from buffer). Quarterly redemptions involve admin-managed processes
- **Capital deployment**: Offchain, managed by the protocol team through the Fireblocks custody infrastructure
- **Minting**: `MINTER_ROLE` grants on the reUSD token are now timelock-gated (token `DEFAULT_ADMIN_ROLE` moved to the Timelock Aug 10, 2026) — a genuine improvement over June, where the Safe could re-grant `MINTER_ROLE` without delay.

### External Dependencies

- **Chainlink**: Verified onchain use is (a) Chainlink Functions + Automation driving the daily reUSD NAV/share-price update (Ethereum), (b) the Chainlink `sUSDe/USD` price feed used for collateral pricing (Ethereum), and (c) a **live Chainlink Proof-of-Reserve feed** "Re Offchain Reserves" on **Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), TNF LedgerLens source, re-verified live Sep 7, 2026). The PoR feed is a transparency mirror only — it is not consumed by reUSD's Ethereum pricing/redemption logic.
- **The Network Firm**: Third-party accountant for offchain reserve verification.
- **Ethena**: USDe/sUSDe for basis-trade yield source — now a substantially larger dependency given onchain reserves are ~99.5% sUSDe (see Collateralization).
- **Fireblocks**: Custody for idle onchain capital (daily sweeps from ICL to Fireblocks vault)
- **§114 Reinsurance Trust**: Offchain U.S.-domiciled trust bank for regulatory collateral
- **Cayman Reinsurer**: Partner reinsurance company (CIMA-licensed, Class B(iii)), now with a Grant Thornton FY2025 financial-statement audit (see Audits)
- **SumSub / Chainalysis**: KYC/AML verification
- **Pendle / Morpho (new, material)**: a ~$103M market in Pendle-wrapped `PT-REUSD-10DEC2026` used as Morpho collateral demonstrated real fragility on Aug 25, 2026 (see Historical Track Record). Not a dependency of reUSD's own contracts, but a material transmission channel for stress originating in reUSD-adjacent markets.
- **Multiple blockchains**: Cross-chain deployments on Ethereum, Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink

## Operational Risk

- **Team**: CEO **Karn Saroya** (publicly known, LinkedIn/Twitter). Previously co-founded Cover (YC-backed insurtech) and Stylekick (acquired by Shopify); part of early Shopify team. **Underwriting leadership: James Norris (Chief Underwriting Officer**, 30+ years insurance/reinsurance, former President of Lapis Resources; [appointment confirmed by Reinsurance News](https://www.reinsurancene.ws/re-appoints-james-norris-as-chief-underwriting-officer/)) **and Jonathan Lim (Head of Underwriting**, actuarial background).
- **Company**: Re (re.xyz). Founded 2022. **Token issuer: Resilience Foundation Cayman LLC** (Cayman Islands Exempted Limited Guarantee Foundation Company, per Re's [Legal Disclosures](https://re.xyz/disclosure)). **Resilience (BVI) Ltd is an affiliate service provider, not the issuer** — the earlier "Resilience BVI Ltd. issuer" attribution (from RWA.xyz) was incorrect. Governance controlled by Resilience Foundation.
- **Legal Structure**: Partner reinsurance company (Cover Re SPC) domiciled in Cayman Islands, regulated by CIMA. Offchain trust accounts in U.S. jurisdiction (§114 Trust, NAIC-compliant banks). **Token issuer (Resilience Foundation) domiciled in the Cayman Islands; the BVI entity is a service affiliate.**
- **Investors**: $14M seed round at $100M post-money valuation. Investors include **Electric Capital, Tribe Capital, Stratos, SiriusPoint, Exor, Defy, Framework Ventures, Morgan Creek Digital**.
- **Custody:** Re's public materials (`docs.re.xyz`) name **Fireblocks MPC custody** for idle onchain assets. The [AUP-Report-2025](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf) corroborates that Re operates a Fireblocks MPC wallet set covering the 15 listed addresses but does not cryptographically verify the N-of-M quorum. Public documentation does not name specific banking counterparties for the offchain §114 Trust assets.
- **Documentation**: Comprehensive documentation at docs.re.xyz. Clear description of mechanism, risks, and investor protections.
- **Financial transparency (new, Aug 2026)**: Cover Reinsurance SPC Ltd.'s FY2025 financial statements were independently audited by **Grant Thornton** for exchange-listing purposes — a traditional GAAP-style accounting audit of the reinsurer entity, examining reinsurance transactions, premiums written, and reserves. Re states The Network Firm separately performed "complementary" audits of on/offchain balances and premium calculations around the same time; no new public TNF report was located to independently confirm scope or findings.
- **Runtime Monitoring**: ChainAnalysis for onchain transaction monitoring.
- **Incident Response**: Emergency pause mechanism exists. Recovery wallets designated for each ICL (e.g., [`0xDf6bF2713b5c7CA724E684657280bC407938F447`](https://etherscan.io/address/0xDf6bF2713b5c7CA724E684657280bC407938F447) for initial ICL). First real-world test: the Aug 25, 2026 Pendle/Morpho PT-reUSD incident did not require Re to intervene (Re's own contracts were unaffected), so its emergency mechanisms were not exercised by that event.
- **KYC/AML**: Required for all participants (SumSub + Chainalysis). Revoked KYC = request cancelled, tokens returned.
- **Not available to U.S. persons** and may be restricted in other jurisdictions.
- **Governance token ($RE) and community**: TGE on Jun 18, 2026; ~10,170 holders at launch. See Centralization & Control → Governance for the (currently unchanged) onchain control implications.
- **Written Premiums** (Re-reported): **~$500M premiums written inception-to-date** (~$310M in 2026), per Re's Jun 18, 2026 $RE TGE materials ([blog.re.xyz](https://blog.re.xyz/re-tge-launch/)); book spans **~40 carriers/insurance partners** and **~1M US policyholders** — up from ~$409M / ~35 carriers / ~600K policyholders reported in June. Multi-billion-dollar pipeline. Protocol has demonstrated continued real-world insurance traction (figures Re-reported, not independently verified onchain; FY2025 reinsurer financials now carry a Grant Thornton audit opinion — see above).

## Monitoring

### reUSD Price Monitoring

- **Share Price Calculator**: [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8)
  - Monitor reUSD price changes daily. Current: ~$1.099 (onchain `getSharePrice()` = `1.099349`, Sep 7, 2026).
  - **Alert**: If price **decreases** (should only ever increase under normal operation).
  - **Alert**: If price growth **stops** for >48 hours (indicates oracle feed interruption or yield issue).
  - **Alert**: Any new member granted `PRICE_SETTER_ROLE` on the Share Price Calculator (currently only `NAVConsumer` `0x84d4eaeb…2b4b6`; EOA `0x6c15b25e…57649` remains revoked, re-verified Sep 2026).
  - **Alert (Critical)**: Any `setSharePrice` call whose `msg.sender` is NOT the `NAVConsumer` — this is a bypass of the audited NAV path.
  - **Alert (High, new)**: Execution of the pending Sep 2, 2026 Timelock batch (`CallExecuted` for the id containing target `SharePriceCalculator`) — this moves `DEFAULT_ADMIN_ROLE` off the Governance Safe and should be confirmed against the exact scheduled payload, not just its existence.

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

- **Reserve EOAs — primary custody risk**: ~94% of onchain reserves are at three plain EOAs (of the 15 Fireblocks-MPC-controlled addresses listed in the AUP-Report-2025), up from ~86% in June. No onchain outflow restriction applies.
  - **ICL Custodial Wallet (EOA)**: [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) — current balance ~$55.1M (up from ~$24.4M in June).
    - **Alert (Critical)**: Any transfer (USDC / USDT / USDe / sUSDe) to a destination NOT on the historical allow-list (Ethena sUSDe/USDe contracts, Redemption Reserves Custodian, Daily Instant Redemption Vault, Fireblocks-pattern sweep addresses beginning `0x34b6…`). First-time destinations = incident.
    - **Alert (High)**: Any outbound transfer >$1M.
  - **Redemption Reserves Custodian (EOA)**: [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) — current balance ~$93.5M (up from ~$52.95M in June).
    - **Alert (Critical)**: Any sUSDe transfer to a destination NOT on the historical allow-list (only `0x5C45…B147` RedemptionVault and sUSDe/USDe staking contracts observed to date).
    - **Alert (High)**: Any single outbound >$5M.
  - **reUSDe ICL Custodial Wallet (EOA) [`0xd4374008…B25831e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9)**: — currently holds ~$2.87M, now 100% sUSDe. Per Re this backs **reUSDe**, not reUSD (so it is excluded from the reUSD coverage ratio), but it is the same Fireblocks-EOA custody pattern and worth monitoring.
    - **Alert (Critical)**: Any outbound transfer. Small size makes every movement worth a manual look.
  - **AUP dust address `0xE1886…3082`**: grew from $258 to ~$5.2K this cycle (still dust, but non-zero movement is worth a note).
  - **All 11 other AUP-listed addresses** (currently empty): monitor for any incoming deposit >$1M and then for any subsequent outgoing transfer. Sudden use of a previously-empty AUP address is a governance signal (either new custody rotation or an unauthorized movement).

- **Instant Redemption Interaction Contract**: [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e)
  - Monitor threshold value.
  - **Alert**: On changes to daily or per-wallet redemption caps.

### Governance & Upgrade Monitoring

- **Oracle admin EOA (MPC 3-of-5 per docs)**: [`0x49BC5A880f77247A348764DdB95951cd9212A0ee`](https://etherscan.io/address/0x49BC5A880f77247A348764DdB95951cd9212A0ee)
  - **Alert**: On any price feed configuration changes; on any new `PRICE_SETTER_ROLE` grant on Share Price Calculator.

- **Access admin EOA (MPC 5-of-8 per docs)**: [`0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc`](https://etherscan.io/address/0x80a62B72dF1136aCBc57141FB67Aa46812fECAFc) — admin of `AccessManager` [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8)
  - **Alert**: On any role assignment or revocation in `AccessManager`; on `MINTER_ROLE` grant on reUSD token.

- **Governance Safe (3-of-5, onchain-verified)**: [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd)
  - **Alert**: On any transaction execution, owner change, or threshold change.

- **Timelock Controller**: [`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93) — the 48h delay between `CallScheduled` and `CallExecuted` is the primary review window for any privileged action; the monitor must fire the moment something is queued, not when it executes.
  - **Alert**: On `CallScheduled(bytes32 id, uint256 index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)` — decode `target` / `data` and surface the decoded function call. Every scheduled call deserves a manual review before the 48h window expires.
  - **Alert**: On `CallExecuted(bytes32 id, uint256 index, address target, uint256 value, bytes data)` — confirm the execution matches what was scheduled and did not diverge (OZ TimelockController replays the same payload, so any mismatch would be an upstream monitoring bug).
  - **Alert**: On `Cancelled(bytes32 id)` — a Safe-initiated cancel is informational; a cancel originating from anything other than the Governance Safe (`0x8EEc10…`) or addresses with `CANCELLER_ROLE` is an incident.
  - **Alert (High, open item)**: **Pending execution overdue.** The batch scheduled Sep 2, 2026 (tx [`0x3daca0b0…`](https://etherscan.io/tx/0x3daca0b03e904b11b057cf6fe2d47e6d4a8a76376a563e315fa273bb59183b92), 14 `revokeRole(DEFAULT_ADMIN_ROLE, Safe)` calls across ICL/SharePriceCalculator/NAVConsumer/KYC Registry/Deposit Token Registry and reUSDe-side mirrors) became executable Sep 4, 2026 15:23 UTC and remained unexecuted as of Sep 7, 2026 (~67h overdue, no `CallExecuted`/`Cancelled` found). Track this specific `id` until it executes or is cancelled — cancellation without explanation would itself be worth investigating.
- **UUPS Proxy Upgrades**: Monitor for `Upgraded` events on reUSD token and ICL contracts.
  - **Alert**: Immediately on any implementation change (48-hour timelock provides review window, so this should have been preceded by a `CallScheduled` event ≥48h earlier — absence of that precursor is an incident).

### Liquidity Monitoring

- **Fluid reUSD/USDT pool**: Monitor TVL and volume. Largest trading venue (~$24.9M TVL, up from ~$11.6M in June).
  - **Alert**: If Fluid pool TVL drops below $10M (threshold raised to track the larger current base).

- **Curve Re reUSD pools** — only two pools actually pair **Re's reUSD** (`0x5086…0c72`): reUSD/sUSDe and reUSD/USDC. (Curve pools labelled reUSD/scrvUSD, reUSD/sfrxUSD, reUSD/fxUSD, reUSD/sDOLA use **Resupply's reUSD** `0x57aB1E00…` and must NOT be monitored as Re liquidity.) Monitor TVL and balance ratio.
  - **Alert**: If total Curve Re reUSD DEX liquidity drops below $1M (currently ~$2.76M combined).
  - **Alert**: If any pool imbalance exceeds 80/20 in either direction.
- **Avalanche Blackhole reUSD/USDC** (Re's reUSD `0x180aF87b…625Bf`): **Not found in DeFi Llama's Avalanche pool listings as of Sep 7, 2026** (was ~$1.47M in June). **Action**: confirm directly via Snowtrace whether these pools still hold liquidity before treating this as a real decline — could be a DeFi Llama tracking gap rather than a withdrawal.
- **Pendle PT-reUSD / Morpho leveraged market (new)**: ~$103.1M across two Morpho markets using `PT-REUSD-10DEC2026` (Pendle-wrapped reUSD) as collateral — the market family that suffered the Aug 25, 2026 TWAP-manipulation liquidation. Not part of Re's own contracts, but material to reUSD-linked leverage risk.
  - **Alert**: Large, rapid shifts in the PT-reUSD implied yield (>10 pp move within an hour) — the pattern seen in the Aug 25 incident.
  - **Alert**: Liquidation volume on either Morpho PT-reUSD market exceeding $5M within a 24h window.

- **CoinGecko reUSD price**: Monitor for deviations from expected share price.
  - **Alert**: If CoinGecko price deviates >2% from onchain share price.
- **Token-level 24h volume**: fell from ~$7.3M (Apr) → ~$1.4M (Jun) → ~$365K (Sep), even as TVL and DEX depth grew.
  - **Alert**: If 24h volume stays below $200K for more than a week — thinning secondary-market activity is itself a slow-moving liquidity signal.

### Offchain Reserve Monitoring

- **Chainlink "Re Offchain Reserves" PoR feed (Avalanche)** [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract): a directly-monitorable onchain reserve signal (call `latestRoundData()`; decimals = 8; re-verified live Sep 7, 2026 at ~$179.5M, updated Sep 6, 2026 12:07 UTC). Caveat: it reports "Re Offchain Reserves" generically (not reUSD-only) and is sourced from TNF's LedgerLens attestation, so it is not an independent cross-check.
  - **Alert**: if the feed's `updatedAt` goes stale beyond its normal heartbeat (observe the cadence for a calendar month first).
  - **Alert**: if the reported reserve value drops materially or falls below expected offchain backing.
- **The Network Firm attestation**: the only Network Firm engagement publicly verified is the single Agreed-Upon Procedures report dated Oct 31, 2025 (published Dec 17, 2025). No onchain or public evidence establishes a daily or weekly cadence; the "daily attestation" phrasing in Re's docs is a protocol claim, not an observed publication pattern. The Avalanche PoR feed above is the primary onchain reserve signal; the AUP and Re's transparency dashboard are the supporting offchain channels.
  - **Action**: before relying on an "X-hours stale" alert, confirm the actual publication cadence with Re or by observing the transparency dashboard / PoR feed heartbeat for a calendar month.
  - **Alert**: if reported reserves fall below total reUSD supply × share price.
  - **Alert**: if a new AUP report appears with an address list that differs from the 15 addresses in [`AUP-Report-2025`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf).

- **Onchain coverage ratio**: Compute `(USDC + USDT + USDe + sUSDe_in_USDe_terms)` across all 15 Fireblocks-MPC-controlled addresses listed in the [AUP-Report-2025](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf), divided by `reUSD Ethereum totalSupply × getSharePrice()`. Currently ~67.9% (up from ~51.9% in June).
  - Alert if coverage drops below 50% (Re's stated floor).
  - Alert if coverage drops below 55% (headroom erosion).
  - **Alert — currently breached**: sUSDe share of reserves exceeds 80% or USDC share drops below 15% (current split: sUSDe ~99.5% / USDC ~0.25%, both far past the June-set thresholds). This alert should already be firing; treat the underlying concentration as the active finding for this cycle rather than waiting for a future breach.
  - Alert on first appearance of BUIDL or another T-bill-wrapper balance at any reserve address.

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Timelock `CallScheduled` / `CallExecuted` / `Cancelled` / `MinDelayChange` | Real-time | Critical |
| Governance Safe tx execution / owner / threshold changes | Real-time | Critical |
| UUPS proxy upgrade events | Real-time | Critical |
| Access role changes (reUSD MINTER_ROLE, ICL admin, Timelock PROPOSER/EXECUTOR/CANCELLER) | Real-time | Critical |
| Share Price Calculator `PRICE_SETTER_ROLE` grant / revoke | Real-time | Critical |
| Instant redemption cap changes | Real-time | Critical |
| reUSD share price | Daily | High |
| Instant redemption buffer (USDC + sUSDe) | Every 6 hours | High |
| Onchain coverage ratio (reserves / NAV) + composition | Every 6 hours | High |
| Instant redemption interaction events | Every 6 hours | High |
| The Network Firm offchain attestation publication | Daily | High |
| DEX pool TVL/balance (Fluid reUSD/USDT + Curve) | Hourly | Medium |
| Total supply changes (Ethereum + cross-chain) | Daily | Medium |
| Pendle PT-reUSD implied yield / Morpho PT-reUSD liquidation volume | Hourly | High |
| Pending Timelock batch (Sep 2, 2026 id) execution status | Daily until resolved | High |

## Risk Summary

### Key Strengths

- **Senior tranche position (structural)**: reUSD sits senior to reUSDe (mezzanine) and Re Capital (first-loss reinsurer equity) in the loss waterfall; both subordinated layers (105–110% Re Capital, 110–115% reUSDe) must be breached before reUSD is impaired at >115% combined ratio.
- **Token-level admin control moved to the Timelock (new, executed)**: on Aug 10, 2026 `DEFAULT_ADMIN_ROLE` on the reUSD and reUSDe tokens moved from the 3-of-5 Governance Safe to the Timelock Controller itself (verified onchain via `hasRole`). `MINTER_ROLE` grants now require the 48h public Timelock queue rather than being directly callable by the Safe — closing a June-era reversibility gap.
- **Independent second audit of the NAV oracle (new)**: Sherlock re-audited the NAV oracle stack in July 2026 (0 High, 1 Medium resolved, 5 Low/Informational resolved) — previously only Hacken had reviewed this code, so this is a genuine second opinion, not a rubber stamp.
- **Onchain reserve coverage ratio materially higher**: onchain reserves now cover ~67.9% of Ethereum NAV all-in (~66.7% reUSD-only), up from ~51.9%/~50.2% in June — ~18 pp of headroom above Re's stated 50% floor versus ~2 pp before.
- **Third-party offchain reserve verification, now with a financial-statement audit too**: The Network Firm's Oct 2025 AUP and the live Chainlink "Re Offchain Reserves" PoR feed on Avalanche (re-verified live Sep 7, 2026, ~$179.5M) are joined by an August 2026 Grant Thornton audit of Cover Reinsurance SPC Ltd.'s FY2025 financial statements — the first traditional accounting-audit opinion on the reinsurer entity.
- **Onchain NAV path with automation and deviation guard, re-verified unchanged**: Daily share price is still written solely by the audited Chainlink-Functions + Automation `NAVConsumer` with a `maxDeviationBps = 1000` (10%) onchain check; the EOA bypass closed in June remains closed (re-verified `hasRole`, Sep 7, 2026).
- **Timelock on upgrades, unchanged**: `TimelockController.getMinDelay() = 172800` (48 hours, re-verified) on all privileged governance actions routed through it.
- **Emergency mechanisms**: Pause functionality on the InstantRedemption, LayerZero adapter, and NAV Consumer; designated recovery wallets; Chainalysis runtime monitoring. Not exercised by the Aug 25 Pendle/Morpho incident (Re's own contracts were unaffected).
- **Continued growth and traction**: TVL ~$343.6M (up from ~$272.2M), ~$500M inception-to-date premiums written (~$310M in 2026) across ~40 carriers and ~1M policyholders per Re's June TGE materials (Re-reported, not independently verified onchain).

### Key Risks

- **Reversibility gap only half-closed — price-path fix still pending execution**: the token-level `DEFAULT_ADMIN_ROLE` migration (above) does not cover `SharePriceCalculator` or `NAVConsumer`. A Timelock batch to close that gap was scheduled Sep 2, 2026, became executable Sep 4, 2026, and **remained unexecuted as of this report** (~67h overdue). Until it lands, the Governance Safe can still re-grant `PRICE_SETTER_ROLE` to an EOA without a 48h delay — functionally unchanged from June despite the token-level progress.
- **Reserves flipped to near-monoline sUSDe (new, material)**: onchain reserves are now ~99.5% sUSDe and ~0.25% USDC (was ~72.9%/~20.9% in June) — a reversal of the improving trend the June report highlighted, and a breach of the sUSDe/USDC concentration thresholds this report itself set as alert triggers. The much higher coverage ratio (above) is real, but it is now backed almost entirely by a single cooldown-gated asset rather than a diversified mix.
- **First ecosystem-adjacent incident (new)**: on Aug 25, 2026, TWAP manipulation of Pendle's PT-reUSD/YT-reUSD market triggered ~$36.4M in liquidations on a downstream Morpho lending market using PT-reUSD as collateral. Re's own reUSD token and contracts were not compromised and the Morpho market incurred no bad debt, but this is the first incident of any kind touching the reUSD ecosystem since inception, and the market it occurred in (~$103.1M, Pendle-wrapped PT-reUSD collateral on Morpho) has grown materially since June.
- **Significant offchain capital deployment**: Majority of assets are deployed offchain into §114 Trust and reinsurance programs. This introduces counterparty risk with the trust bank, partner reinsurer, and custodians that cannot be verified fully onchain.
- **Instant redemption vault still holds no USDC, and now neither does almost anything else**: The Daily Instant Redemption Vault holds `0` USDC and sUSDe worth ~$9.09M. The Redemption Reserves Custodian (EOA) holds `0` USDC and sUSDe worth ~$93.50M. `dayPayoutToken` is sUSDe — USDC-denominated instant exits are unavailable under the current config, and (unlike June) there is now almost no USDC anywhere in the reserve stack to fall back to.
- **Two MINTER_ROLE holders on reUSD, re-verified unchanged**: `InsuranceCapitalLayer` (backed path) and `InstantRedemption` (burns on redeem). `ShareTokenMinterBurner` still does not hold `MINTER_ROLE`. Grants are now Timelock-gated (see Key Strengths).
- **$RE governance token launched, but onchain control unchanged**: the June 18, 2026 TGE and "Phase 1 governance" marketing have not yet translated into any DAO/Governor contract holding a role on the audited contracts — the same 3-of-5 Safe verified since inception still controls (or, pending the Sep 2 batch, mostly still controls) the protocol.
- **KYC gating**: All deposits and redemptions require KYC. This limits the universe of users who can exit and creates regulatory/jurisdictional risk.
- **Quarterly redemption queue**: Once instant buffer is exhausted, redemptions are windowed and pro-rata. Capital release from reinsurance programs is reevaluated quarterly per Re's public materials.
- **Reinsurance tail risk**: Underlying assets are exposed to insurance claim risk. **reUSD is impaired once the portfolio combined ratio exceeds 115%** (its attachment point), after Re Capital (~$73M, first-loss, 105–110%) and all reUSDe reserves (mezzanine, 110–115%) are depleted. Re's model puts reUSD's loss likelihood at **~0.9%** (probability of reaching 115%); 135%/0.03% is a deeper-stress level, not the attachment. No updated modeled figures were found this cycle (all Re-asserted, model undisclosed).
- **No bug bounty program found**: re-checked Sep 7, 2026 — still no Immunefi or comparable bug bounty program identified.

### Critical Risks

- **Custody / asset-movement surface — ~94% of onchain reserves at plain EOAs (up from ~86% in June)**: `$151.50M` of `$160.60M` of onchain reserves sits at **three** plain EOAs listed in the AUP-Report-2025: [`0x295F67…689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) ICL Custodial Wallet ($55.14M); [`0x9eA38e…ADF8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) Redemption Reserves Custodian ($93.50M); [`0xd437…31e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9) auxiliary ($2.87M). None has code; all look identical to single-key wallets from the chain's perspective. **No onchain delay, destination whitelist, or role check** applies to their outbound transfers — one ECDSA signature moves the funds, and the absolute dollar amount at risk grew ~87% since June even as the percentage at EOAs also rose. The claimed Fireblocks MPC custody (N-of-M offchain quorum, destination policies) remains unverifiable by anyone outside Re. The 48h Timelock does NOT gate these flows. See Funds Management → Collateralization for the full custody table. **This remains the single largest unmitigated risk in the system, and it got larger in absolute terms this cycle.**
- **Offchain dependency concentration**: The protocol's value proposition depends on offchain entities (Cayman reinsurer, §114 Trust, The Network Firm, Fireblocks) operating honestly and solvent. Onchain verification cannot fully cover offchain risks. Ethena/sUSDe is now a materially larger single dependency given the reserve concentration above.
- **Oracle/setter manipulation — token-level fix executed, oracle-level fix still pending**: `PRICE_SETTER_ROLE` on `SharePriceCalculator` remains solely `NAVConsumer` (re-verified), but the Governance Safe's ability to re-grant it without a timelock delay is unchanged from June — the Timelock call that would close this is scheduled but overdue for execution (see Key Risks). Reserve assurance still rests on the offchain AUP + Grant Thornton financial audit + direct onchain audit; the Avalanche PoR feed remains a transparency mirror, not an onchain control.
- **Liquidity mismatch**: reUSD represents liquid onchain tokens partially backed by offchain reinsurance capital. Capital release is reevaluated quarterly, and programs are short-duration and cat-light (per performance memo). The instant redemption vault holds no USDC (sUSDe only — ~$9.09M in vault, ~$93.50M in Redemption Reserves Custodian). In a bank-run scenario, sUSDe redemption liquidity plus ~$27.7M in DEX liquidity would need to absorb exits for ~$252.7M in outstanding tokens; windowed queue handles the remainder. The ratio of protocol-native + DEX exit capacity to market cap is broadly similar to June, but the underlying reserves are now almost entirely single-asset.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Audited by Hacken (3 public reports, including NAV Oracle), Certora with formal verification (Sep 2025), and now Sherlock (Jul 2026 NAV oracle re-audit, 0 High). 5 public smart-contract audit reports. **PASS**
- [ ] **Unverifiable reserves** -- Offchain reserves attested by The Network Firm and published onchain via a **live Chainlink Proof-of-Reserve feed on Avalanche** ("Re Offchain Reserves," re-verified live Sep 7, 2026; see appendix), now complemented by an August 2026 Grant Thornton financial-statement audit of the reinsurer entity. Onchain buffer is fully verifiable and its coverage ratio has materially improved (~67.9% all-in vs ~51.9% in June). **CONDITIONAL PASS** -- hybrid onchain/offchain model: the PoR feed is a real transparency improvement, but it transports the same TNF attestation (not an independent verifier), is labeled "non-value-securing," and is not consumed by reUSD's Ethereum pricing/redemption logic. The higher coverage ratio is now backed almost entirely (~99.5%) by a single asset (sUSDe) rather than a diversified mix — see Collateralization.
- [x] **Total centralization** -- MPC wallets with role separation (3-of-5 and 5-of-8). 48-hour upgrade timelock. Token-level admin now sits with the Timelock itself (not just the Safe). Not a single EOA. **PASS**

**All gates conditionally pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 smart-contract audit firms (Hacken, Certora, **Sherlock — new**), 5 public smart-contract audit reports. Certora audit (Sep 2025) included formal verification and found 13 issues (all fixed). Hacken conducted 3 audits (Sep 2024, Dec 2024, Apr 2025 NAV oracle). **Sherlock independently re-audited the NAV oracle in Jul 2026** (0 High, 1 Medium resolved, 5 Low/Info resolved) — a genuine second opinion on previously single-firm-reviewed code. The Network Firm performed AUP on offchain reserve/custody verification (Oct 2025); Grant Thornton audited the reinsurer's FY2025 financial statements (Aug 2026) — both due diligence, not smart-contract audits.
- **Bug Bounty**: Re-checked Sep 7, 2026 — still no Immunefi or comparable bug bounty program found.
- **Time in Production**: reUSD token ~15 months in production (inception June 2025). Re Protocol company since 2022.
- **TVL**: ~$252.7M market cap, ~$343.6M TVL (DeFi Llama, Sep 7, 2026; includes reUSDe and Re Capital).
- **Incidents**: **New this cycle** — the Aug 25, 2026 Pendle/Morpho PT-reUSD TWAP-manipulation liquidation ($36.4M, downstream market; Re's own contracts unaffected, no bad debt to the Morpho market). This is the first incident of any kind associated with the reUSD ecosystem since inception; it does not implicate Re's own contracts but breaks the previously-clean "no incidents" record for the ecosystem.

**Score: 2.5/5 (unchanged)** -- A fifth public smart-contract audit (Sherlock, independent second review of the NAV oracle) and ~15 months of production with TVL >$340M would, on their own, argue for an improvement. That is offset by the first incident touching the reUSD ecosystem (Aug 25 Pendle/Morpho liquidation) — Re's core contracts held up cleanly, which is itself informative, but per the conservative scoring guideline this reassessment does not treat a newly-broken "zero incidents" record as an improvement. No bug bounty program remains a persistent gap. Net: score held flat at 2.5.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- Onchain governance root, re-verified Sep 7, 2026: a 3-of-5 Safe multisig (unchanged owners/threshold) holds `PROPOSER/CANCELLER` on the Timelock and still holds `DEFAULT_ADMIN` on ICL and NAVConsumer, but **no longer** on the reUSD/reUSDe tokens (moved to the Timelock, Aug 10, 2026). 48-hour timelock on UUPS proxy upgrades (`getMinDelay = 172800`, unchanged) and custodian changes.
- Per-function admin EOAs (Oracle, Redemptions, Access) described by docs as MPC; the MPC signer quorum is offchain and cannot be independently verified; signers not publicly identified — unchanged since June.
- **Governance progress this cycle, phased and partial (verified onchain)**: token-level `DEFAULT_ADMIN_ROLE` (governing `MINTER_ROLE`) moved from the Safe to the Timelock on Aug 10, 2026 — executed, verified. A matching move for `SharePriceCalculator`, `NAVConsumer`, ICL, and other contracts was scheduled Sep 2, 2026, became executable Sep 4, 2026, but **remained unexecuted as of Sep 7, 2026** (~67h overdue). The June-era fixes (EOA revoked from `PRICE_SETTER_ROLE`, `CUSTODIAN_MANAGER_ROLE` on Timelock, `MINTER_ROLE` reduced to 2 holders, OFT adapter/minter-burner owned by the Safe) were all re-verified unchanged.
- **Reversibility — half-closed**: `MINTER_ROLE`'s role admin is now the Timelock (closed, per above). `PRICE_SETTER_ROLE`'s role admin is **still the Governance Safe** as of this report — the Safe can re-grant it to an EOA without a 48h delay, functionally unchanged from June, pending execution of the overdue Sep 2 batch.
- **$RE governance token (new, Jun 18, 2026 TGE)**: marketed as opening "protocol upgrades, technical permissions" governance, but **no DAO/Governor contract was found holding any role** on the audited contracts. All admin authority remains with the same 3-of-5 Safe / Timelock structure verified since inception. Treat the DAO launch as not yet having decentralized actual contract control.
- KYC required for all deposits and protocol redemptions (enforced onchain, unchanged).

**Governance Score: 3.25 (improved from 3.5)** -- The token-level admin migration to the Timelock is a real, *executed and verified* improvement — it closes the mint-role reversibility gap flagged since April, one of the two specific reversibility caveats this report has carried. That is genuine progress, not offset by anything that got *worse* in governance specifically this cycle: the larger migration (price-setting path) being scheduled-but-overdue is unchanged risk, not new risk, and the $RE DAO launch not yet transferring onchain control is the status quo dressed in marketing, not a fresh negative. Remaining concerns, unchanged: offchain-only MPC admin EOAs with unverifiable N-of-M quorums, no onchain governance over contract control, and KYC-gated access. The largest fund-loss vector — the reserve-custody EOAs — is unchanged in kind and larger in dollar terms (captured under Collateralization, not here).

**Subcategory B: Programmability**

- reUSD price: Written onchain by a Chainlink-Functions-driven `NAVConsumer` with a 10% deviation cap (`maxDeviationBps = 1000`, re-verified unchanged). NAV computation itself runs offchain in the Chainlink DON, now independently re-audited by Sherlock (Jul 2026, 0 High). The EOA bypass remains closed — `PRICE_SETTER_ROLE` is re-verified held only by `NAVConsumer`; `EMERGENCY_UPDATER_ROLE` remains revoked from the former EOA; `DEFAULT_ADMIN` is still the Governance Safe. Caveat, unchanged: the `SharePriceCalculator`'s role admin is still the Safe (not the Timelock) as of this report, so the role can still be re-granted without a timelock delay — the fix that would close this is scheduled but overdue for execution.
- Deposits: Gated by KYC Registry
- Instant redemptions: Programmatic from buffer
- Quarterly redemptions: Admin-managed process
- Capital deployment: Entirely offchain
- Minting: `MINTER_ROLE` grants on reUSD are now timelock-gated (token-level `DEFAULT_ADMIN_ROLE` moved to the Timelock, Aug 10, 2026) — an improvement, though it doesn't touch the price path scored here.

**Programmability Score: 3.75 (unchanged)** -- The core value-determining function (reUSD price/yield) is still set by an admin-controlled oracle, not computed programmatically onchain — and the specific mechanism scored here (the price path) is unchanged from June: the audited Chainlink-Functions path is still the sole onchain price writer, but the `SharePriceCalculator`'s role admin is still the 3-of-5 Safe, not the Timelock, so `PRICE_SETTER_ROLE` remains re-grantable without delay. The new Sherlock audit adds confidence in the oracle's code but does not change its administrative structure. Capital deployment remains entirely offchain. Net: held flat, since the change that would move this score (the Sep 2 Timelock migration) has not executed yet.

**Subcategory C: External Dependencies**

- Chainlink: used onchain as (a) the `sUSDe/USD` price feed inside `PriceRouter` (aggregator [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099), 24h staleness, $1.18 / $2.00 price bounds), and (b) **Chainlink Functions + Automation** driving the daily NAV update through `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) (DON `fun-ethereum-mainnet-1`, subscription `85`), and (c) a **live Chainlink Proof-of-Reserve feed** "Re Offchain Reserves" on **Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), re-verified live Sep 7, 2026). The PoR feed is a standalone transparency mirror and is not consumed by reUSD's Ethereum contracts — see the Chainlink usage appendix.
- **LayerZero**: cross-chain reUSD transport via `ReMintBurnAdapter` OFT [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85). Active peers: Avalanche (eid 30106), Arbitrum (30110), Base (30184), BNB (30102). Rate limit: 2,500,000 reUSD per 24h inbound AND outbound per chain (unchanged).
- The Network Firm for offchain attestations (now supplemented by Grant Thornton's FY2025 financial-statement audit of the reinsurer — see Audits)
- **Ethena — larger dependency this cycle**: onchain reserves are now ~99.5% sUSDe (was ~72.9% in June), so Ethena's solvency, sUSDe/USDe peg, and the 7-day unstake cooldown matter more than they did last cycle.
- Fireblocks for custody
- §114 Reinsurance Trust (offchain bank)
- Cayman-domiciled partner reinsurer (CIMA-licensed, now with an independent FY2025 financial audit)
- SumSub / Chainalysis for KYC/AML
- **Pendle / Morpho (new)**: not a dependency of reUSD's own contracts, but a ~$103M market in Pendle-wrapped PT-reUSD collateral on Morpho demonstrated real fragility to oracle manipulation on Aug 25, 2026 — a downstream transmission channel worth tracking even though it sits outside Re's contracts.
- Multiple blockchains for cross-chain deployment

**Dependencies Score: 4.25 (worse than 4.0)** -- Heavy reliance on offchain entities (trust bank, reinsurer, attestation firm, custody) is unchanged, but the Ethena dependency specifically deepened materially and measurably: onchain reserves went from ~73% to ~99.5% sUSDe. That is a real, quantified increase in exposure to a single counterparty (Ethena solvency, sUSDe/USDe peg, 7-day unstake cooldown), not offset by the new Grant Thornton financial audit — that audit strengthens confidence in the *reinsurer*, a different dependency, and doesn't reduce the Ethena concentration at all. Many single-point-of-failure dependencies that cannot be mitigated onchain remain, and one of them just got materially larger.

**Centralization Score = (3.25 + 3.75 + 4.25) / 3 = 3.75**

**Score: 3.75/5 (same total, different composition)** -- Two real, independently-evidenced moves happen to net to the same category average: Governance improved (token-level admin now behind the Timelock, a genuine executed fix) while Dependencies worsened (Ethena/sUSDe concentration deepened sharply). Programmability held flat because the specific mechanism it scores — the price-setting path — is unchanged pending the overdue Sep 2 migration. Residual concerns unchanged: offchain-only MPC admin EOAs, offchain capital deployment, and KYC gating.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Onchain buffer: Verifiable, holds liquid assets for instant redemptions — larger in absolute terms this cycle (~$102.6M vs ~$65.66M)
- Offchain trust: §114 Trust attested by The Network Firm, mirrored onchain via a live Chainlink PoR feed on Avalanche (re-verified live), and now audited (FY2025 financial statements) by Grant Thornton
- Surplus notes contractually protect principal
- reUSDe (mezzanine / second-loss) and Re Capital (first-loss reinsurer equity) provide subordinated protection for reUSD; reUSD attaches at >115% combined ratio (~0.9% modeled likelihood, Re-asserted, unchanged this cycle — no updated figures found)
- Majority of capital deployed offchain in reinsurance programs (capital release reevaluated quarterly per Re's public materials)

**Collateralization Score: 4.5 (worse than 4.25)** -- Hybrid onchain/offchain model. Onchain reserves verified at ~$160.60M vs ~$236.53M Ethereum NAV (**~67.9% coverage all-in, ~66.7% reUSD-only** — up sharply from ~51.9%/~50.2% in June). The ratio improvement is real, but it does not reduce the dominant risk in this subcategory: **the plain-EOA custody surface — the report's own #1 critical, fund-loss risk — grew from ~$80.95M to ~$151.5M (~86% → ~94% of onchain reserves)**, meaning the actual dollar amount a single compromised signature can steal grew ~87% in absolute terms. A bigger coverage ratio does not lower the probability or magnitude of that specific loss event; it only means more of the token is nominally "covered" if the drain never happens. Compounding this, **the reserve mix flipped to near-monoline sUSDe (~99.5%, USDC collapsed to ~0.25%)**, breaching this report's own June-set concentration alert thresholds and adding a real, cooldown-gated fragility that wasn't priced into the June score. The subordinated buffer still attaches at a 115% combined ratio (~0.9% modeled likelihood, unchanged). Net: per the conservative scoring guideline, a genuine increase in worst-case dollar exposure outweighs a genuine improvement in a coverage ratio that doesn't itself reduce that exposure.

**Subcategory B: Provability**

- reUSD price: Written by Chainlink-Functions `NAVConsumer` (audited, 10% deviation cap, now independently re-audited by Sherlock). The EOA bypass remains closed — `PRICE_SETTER_ROLE` re-verified held only by `NAVConsumer`.
- Onchain buffer: Fully verifiable
- Offchain reserves: Attested by The Network Firm, published onchain via a live Chainlink PoR feed on Avalanche (re-verified live Sep 7, 2026), and now also covered by a Grant Thornton FY2025 financial-statement audit of the reinsurer
- Underlying reinsurance performance: Inherently offchain, not verifiable onchain

**Provability Score: 3.75 (unchanged)** -- Re's reserve-publication-via-Chainlink claim remains substantiated and was re-verified live this cycle. The EOA bypass of the share-price path remains closed at the `PRICE_SETTER_ROLE` level, but the role admin for that role is still the Governance Safe, not the Timelock, as of this report (fix scheduled, overdue) — the specific concern this subscore tracks is unchanged. (The new Sherlock and Grant Thornton audits are credited under Audits and Operational respectively, to avoid counting the same two facts across three categories.) Core yield calculation, reserve attestation, and performance reporting remain offchain with no independent onchain oracle to cross-check. Held flat because the reversibility gap this subscore is about is, today, literally the same as in June.

**Funds Management Score = (4.5 + 3.75) / 2 = 4.125**

**Score: 4.125/5 (worse than 4.0)** -- Hybrid model with meaningful offchain components. The coverage ratio improved substantially, but almost entirely through sUSDe accumulation — reserves are now a near-single-asset position custodied ~94% at plain EOAs, both worse than June in relative *and* absolute terms. That absolute-dollar deterioration in the report's own dominant fund-loss vector is the reason this category moves worse rather than holding flat, even though the headline coverage percentage looks better. Provability held flat: its specific concern (price-role reversibility) is unchanged in state.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Instant Exit**: Daily Instant Redemption Vault holds `0` USDC and sUSDe worth ~$9.09M; Redemption Reserves Custodian holds `0` USDC and sUSDe worth ~$93.50M (onchain, re-verified Sep 7, 2026). Configured `dayPayoutToken` is still sUSDe. Instant redemptions via [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) settle in sUSDe under current config, subject to daily (20%) and per-wallet (10%) caps, unchanged.
- **Quarterly Queue**: Pro-rata, may not be fully filled if capital locked in reinsurance
- **DEX Liquidity (Re reUSD only)**: ~$27.7M across Fluid and Curve (~11.0% of ~$252.7M market cap, up from ~8.2% in June). Largest venue: Fluid reUSD/**USDT** (~$24.94M TVL, more than doubled from ~$11.62M). Avalanche Blackhole liquidity unverified this cycle (see Liquidity Risk).
- **24h Volume (token-level, CoinGecko)**: ~$365K — down sharply from ~$1.4M in June and ~$7.3M in April.
- **KYC Required**: Limits universe of participants who can exit via protocol redemption
- **Onchain capital**: ICL Custodial Wallet holds ~$0.40M USDC + ~$54.33M sUSDe (Sep 7, 2026) — composition flipped from ~$19.55M USDC + ~$1.79M sUSDe in June. This is not directly accessible for redemptions without admin action.
- **New this cycle**: a ~$103.1M Pendle-wrapped PT-reUSD collateral market on Morpho suffered a $36.4M TWAP-manipulation liquidation on Aug 25, 2026 (Re's own contracts unaffected). Not part of reUSD's own liquidity, but demonstrates real fragility in a large reUSD-derived leverage market.
- **Multi-chain**: Available on 6+ chains, DEX liquidity now concentrated on Ethereum (~$27.7M); Avalanche presence unverified this cycle.

**Score: 3.5/5 (improved from 3.75)** -- Onchain-verified DEX liquidity grew to ~$27.7M (~11.0% of market cap, up from ~8.2%), and the instant-adjacent buffer grew to ~$102.6M (up from ~$65.7M) — both genuine, sizeable improvements in actual exit capacity for reUSD holders, which is what this category scores. Token-level 24h volume did collapse to ~$365K, thinning price-discovery depth, but exit *capacity* is driven more by pool TVL than by trailing volume, so this is a real but secondary concern rather than a full offset. The Aug 25 Pendle/Morpho incident is counted under Audits/Dependencies (it didn't touch reUSD's own liquidity, cause reUSD price stress, or reduce any of the DEX/buffer figures above) rather than double-counted here. Avalanche liquidity being unverifiable this cycle is a data gap, not a confirmed decline. No USDC instant exits remain available (unchanged concern). Net: real growth in both DEX depth and redemption buffer capacity outweighs the volume decline.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: CEO Karn Saroya publicly known, experienced in insurtech. Underwriting led by James Norris (CUO, 30+ yrs) and Jonathan Lim (Head of Underwriting). Core dev team from Cover (YC) and early Shopify. Unchanged this cycle.
- **Company**: Founded 2022, $14M seed at $100M valuation.
- **Investors**: Strong institutional investors (Electric Capital, Tribe Capital, Stratos, SiriusPoint, Exor, Defy, Framework Ventures, Morgan Creek Digital).
- **Documentation**: Comprehensive.
- **Legal Structure**: Cayman-domiciled reinsurer (CIMA-regulated), U.S. §114 Trust.
- **Financial transparency (new)**: FY2025 financial statements of the reinsurer (Cover Reinsurance SPC Ltd.) independently audited by Grant Thornton, published ~Aug 2026.
- **Incident Response**: Documented pause mechanism and recovery wallets. First real-world test (Aug 25 Pendle/Morpho incident) did not require Re intervention since Re's own contracts were unaffected.
- **KYC/AML**: Robust (SumSub + Chainalysis).
- **Regulatory risk**: Not available to U.S. persons. Cayman jurisdiction. No CIMA status changes found this cycle.
- **Governance token / community**: $RE TGE (Jun 18, 2026), ~10,170 holders at launch — a genuine step in community formation, though onchain contract control is unchanged (see Centralization & Control).

**Score: 2.25/5 (improved from 2.5)** -- CEO and underwriting leadership publicly identified, strong investors, comprehensive documentation, emergency mechanisms (not tested by the Aug 25 incident, which didn't touch Re's own contracts). The new Grant Thornton FY2025 financial-statement audit of the reinsurer entity is a genuine, singular new fact — an unusual and valuable transparency step for a DeFi-adjacent protocol, credited here rather than in Funds Management or Audits to avoid counting it three times. The $RE community launch (~10,170 holders at TGE) is a real, if modest, operational-maturity milestone even though it hasn't yet changed onchain control. No new negative specific to this category was found this cycle (team, legal structure, and regulatory posture are all unchanged). Net: a small, genuine improvement.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.75 | 30% | 1.125 |
| Funds Management | 4.125 | 30% | 1.2375 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.25 | 5% | 0.1125 |
| **Final Score** | | | **3.5000** |

**Final Score: 3.50** (down from June's 3.51) — landing exactly on the Medium/Elevated boundary. This is not a "nothing changed" result: real money moved in both directions this cycle. Governance improved (token-level admin now behind the Timelock — executed, not promised) and Liquidity improved (DEX depth +85%, redemption buffer +56%) and Operational improved (a genuine new financial-statement audit of the reinsurer). Dependencies worsened (Ethena/sUSDe concentration deepened from ~73% to ~99.5% of reserves) and, most consequentially, Collateralization worsened (the plain-EOA custody surface — this report's own #1 fund-loss risk — grew from ~$80.95M to ~$151.5M, a ~87% increase in the dollar amount a single compromised signature could steal). Audits, Programmability, and Provability held flat because the specific facts each of them tracks are, as of this report, genuinely unchanged from June. The net effect of five categories each moving on real evidence happens to land almost exactly where June did — but 0.01 points lower, and for substantively different reasons than a surface reading of "same score" would suggest.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Elevated Risk, at the exact floor of the band** (score 3.50 sits precisely on the 3.5 boundary between Medium and Elevated; this report's convention, consistent with the June and April assessments, treats 3.5 as the bottom of Elevated rather than the top of Medium). The protocol is one small adverse move — for example, execution risk on the overdue Sep 2 Timelock migration stalling further, or continued erosion of reserve diversification — away from crossing into Medium Risk on a future reassessment, and equally close to crossing further into Elevated if the plain-EOA custody exposure keeps growing in dollar terms. **The single most important open item from this reassessment is the overdue Sep 2, 2026 Timelock batch** — its execution would close the remaining price-path reversibility gap and is worth an out-of-cycle check rather than waiting for the next scheduled reassessment.

---

reUSD is a novel product that bridges DeFi capital with traditional reinsurance markets. Re reports (~$500M premiums written inception-to-date, ~40 carriers, ~1M policyholders, ~92% historical combined ratio — all Re-asserted, most recently updated at the June 2026 $RE TGE) and reUSD market cap ~$252.7M are meaningful and growing; the capital structure (Re Capital ~$73M **first-loss** + reUSDe **mezzanine/second-loss**) puts reUSD in the senior tranche, attaching at >115% combined ratio (~0.9% modeled loss likelihood, unchanged this cycle). The risk profile is **Elevated Risk (3.50)** — down marginally from June's 3.51 (and April's 3.55), sitting exactly on the Medium/Elevated boundary. Five categories moved on real, independently-evidenced facts this cycle rather than holding flat, and the net effect happened to land almost exactly where June did. **What actually changed this cycle**: (1) token-level `DEFAULT_ADMIN_ROLE` moved from the 3-of-5 Governance Safe to the Timelock on Aug 10, 2026 (verified onchain), closing the `MINTER_ROLE` reversibility gap — a genuine, executed improvement; (2) a matching migration for the price-setting path (`SharePriceCalculator`, `NAVConsumer`, ICL) was scheduled Sep 2, 2026 and became executable Sep 4, 2026, but **had not executed as of this report** — the `PRICE_SETTER_ROLE` reversibility caveat this report has carried since April is therefore still fully in force today; (3) Sherlock independently re-audited the NAV oracle (Jul 2026, 0 High); (4) the onchain coverage ratio jumped to ~67.9% all-in / ~66.7% reUSD-only (from ~51.9%/~50.2%), but reserves flipped from a ~73%/~21% sUSDe/USDC split to a **~99.5%/~0.25%** split — a large new concentration risk that breaches this report's own June-set alert thresholds; (5) the plain-EOA share of custody rose to **~94% (~$151.5M)**, both a higher percentage and a larger absolute dollar amount than June's ~86%/~$80.95M — a ~87% increase in the loss magnitude of this report's own #1 fund-loss risk, which is why Collateralization moved worse despite the better coverage ratio; (6) on Aug 25, 2026, TWAP manipulation of Pendle's PT-reUSD market triggered $36.4M in liquidations on a downstream Morpho market — Re's own contracts were unaffected and the market incurred no bad debt, but this is the ecosystem's first incident since inception, occurring in a market (Pendle-wrapped PT-reUSD on Morpho) that has grown to ~$103.1M; (7) the $RE governance token launched (Jun 18, 2026) with marketing describing live "protocol upgrades, technical permissions" governance, but no DAO/Governor contract was found holding any onchain role — actual control remains with the same Safe/Timelock structure verified since inception. Mitigants unchanged: Safe-3-of-5 + 48-hour Timelock on governance (`getMinDelay() = 172800`, re-verified), now 5 public smart-contract audits across Hacken/Certora/Sherlock, Chainlink Automation driving daily NAV updates, The Network Firm's AUP, and (new) a Grant Thornton FY2025 financial-statement audit of the reinsurer. **The custody surface at the reserve EOAs remains the single largest unmitigated risk, and it grew this cycle.**

**Key conditions for exposure:**
- Monitor reUSD share price for any decreases (should only increase)
- Monitor The Network Firm's reserve attestation **and the live Chainlink "Re Offchain Reserves" PoR feed on Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract); re-verified live Sep 7, 2026) for staleness and value drops
- **Monitor instant redemption buffer — track both USDC and sUSDe balances in vault and Redemption Reserves Custodian** (currently ~$9.09M and ~$93.50M respectively, both 100% sUSDe)
- Monitor instant redemption interaction contract [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) for redemption events and limit changes
- Monitor UUPS proxy upgrades (48-hour review window)
- **Track execution of the overdue Sep 2, 2026 Timelock batch** — this is the single most important open item from this reassessment; its execution would close the price-path reversibility gap
- Track DEX liquidity depth on Fluid reUSD/USDT (~$24.9M) and Curve reUSD/sUSDe (~$2.31M) / reUSD/USDC (~$452K). (Curve reUSD/scrvUSD, reUSD/sfrxUSD, reUSD/fxUSD are Resupply reUSD, not Re — do not count toward Re liquidity.)
- Monitor for KYC policy or regulatory changes affecting redemption access
- Monitor ICL Custodial Wallet balance (~$0.40M USDC + ~$54.33M sUSDe, Sep 7, 2026) for large outflows and for any reversal of the sUSDe/USDC concentration
- Monitor `MINTER_ROLE` grants on reUSD token — currently held by ICL and `InstantRedemption`; any third grantee should trigger review
- Monitor the Pendle PT-reUSD / Morpho leveraged market (~$103.1M) for repeat TWAP-manipulation patterns

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (March 2027) or sooner if instant redemption vault remains empty for >30 days
- **Governance-based**: Reassess when the pending Sep 2, 2026 Timelock batch executes (or if it is cancelled without explanation), when any DAO/Governor contract is granted an onchain role, or after any further role changes or fund redeployments
- **Incident-based**: Reassess after any exploit, governance change, reinsurer insolvency, material claim event, or repeat incident in reUSD-linked derivative markets (Pendle/Morpho PT-reUSD or similar)
- **Liquidity-based**: Reassess if DEX liquidity drops below $5M, if the instant redemption vault remains empty for >30 days, or if the sUSDe share of onchain reserves does not begin normalizing back toward a diversified mix
- **Regulatory-based**: Reassess if CIMA regulatory status changes or new jurisdictional restrictions apply

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     VAULT / TOKEN LAYER                             │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────────┐                       │
│  │  reUSD Token  │◄──│  Share Price          │◄── PRICE_SETTER_ROLE │
│  │  (ERC-20,     │    │  Calculator           │    (NAV sets        │
│  │   UUPS Proxy) │    │  0xd1D1..11b05B8      │     setSharePrice)  │
│  │  0x5086..0c72 │    └──────────────────────┘                      │
│  └──────┬───────┘    (NAVConsumer: 10% onchain deviation cap;       │
│        (now only NAVConsumer; EOA PRICE_SETTER_ROLE revoked)       │
│         │ mint/burn                                                 │
│  ┌──────▼───────────────────┐    ┌─────────────────────────┐        │
│  │  Insurance Capital Layer  │───►│  ICL Custodial Wallet    │      │
│  │  (ICL)                    │    │  (Fireblocks)            │      │
│  │  0x4691..3093             │    │  0x295F..689E             │     │
│  └──────┬───────────────────┘    └───────────┬─────────────┘        │
│         │                                     │                     │
│  ┌──────▼───────────────────┐                │ sweep                │
│  │  Daily Instant Redemption │                ▼                     │
│  │  Vault                    │    ┌──────────────────────┐          │
│  │  0x5C45..B147             │    │  Offchain Deployment  │         │
│  └──────────────────────────┘    │  (offchain §114 Trust)│          │
│                                   └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     PROTOCOL LAYER                                  │
│                                                                     │
│  ┌────────────────────┐   ┌────────────────────┐                    │
│  │  Deposit Token      │   │  KYC Registry       │                  │
│  │  Registry           │   │  (SumSub/Chainalysis)│                 │
│  │  0x73d3..03F6       │   │  0x82F1..9995       │                  │
│  └────────────────────┘   └────────────────────┘                    │
│                                                                     │
│  ┌────────────────────┐   ┌────────────────────┐                    │
│  │  Decentralized Fund │   │  Redemption Reserves│                  │
│  │  0xF044..72f2       │   │  Custodian (EOA)    │                  │
│  └────────────────────┘   │  0x9eA3..ADF8       │                   │
│                            └────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     UNDERLYING LAYER                                │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │  Chainlink       │  │  The Network Firm │  │  §114 Reinsurance│  │
│  │  (Price Feed +   │  │  (Daily offchain  │  │  Trust (U.S.)    │  │
│  │   Proof of       │  │   attestation)    │  │  Cash + T-Bills  │  │
│  │   Reserve)       │  │                   │  │                  │  │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘    │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐                          │
│  │  Ethena (USDe)   │  │  Cayman Reinsurer │                        │
│  │  (Basis trade    │  │  (CIMA-licensed,  │                        │
│  │   yield source)  │  │   Class B(iii))   │                        │
│  └─────────────────┘  └──────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     GOVERNANCE                                      │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  Oracle Admin EOA    │  │  Redemptions Admin   │                 │
│  │  MPC 3-of-5 (docs)   │  │  MPC 3-of-5 (docs)   │                 │
│  │  0x49BC..0Aee        │  │  0xEE16..47f8        │                 │
│  │  no onchain timelock │  │  48h timelock (docs) │                 │
│  └─────────────────────┘  └─────────────────────┘                   │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  Access Admin EOA    │  │  Custodian Manager   │                 │
│  │  MPC 5-of-8 (docs)   │  │  (CUSTODIAN_MGR_ROLE)│                 │
│  │  0x80a6..AFc         │  │  → Timelock          │                 │
│  │  admins AccessManager│  │  Add/remove          │                 │
│  │  0x3f0D..6FD8        │  │  custodians (ICL)    │                 │
│  └─────────────────────┘  └─────────────────────┘                   │
│                                                                     │
│  ┌─────────────────────────────────────────────┐                    │
│  │  Governance Safe (3-of-5, onchain)          │                    │
│  │  0x8EEc10..FadeFbAd                         │                    │
│  │  DEFAULT_ADMIN on ICL/NAVConsumer/          │                    │
│  │  SharePriceCalculator (still, as of Sep 7); │                    │
│  │  NO LONGER DEFAULT_ADMIN on reUSD/reUSDe    │                    │
│  │  tokens (moved to Timelock, Aug 10, 2026);  │                    │
│  │  ICL-level move scheduled Sep 2, overdue    │                    │
│  │  for execution as of this report;           │                    │
│  │  PROPOSER + CANCELLER on Timelock           │                    │
│  └─────────────────────────────────────────────┘                    │
│                                                                     │
│  ┌─────────────────────────────────────────────┐                    │
│  │  Timelock Controller  (getMinDelay = 48h)   │                    │
│  │  0x69dDEa..57FCA93                          │                    │
│  │  Executor: 0x4BFea59b..740738F3 (EOA)       │                    │
│  └─────────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘

Fund Flow:
  User ──USDC/sUSDe──► ICL (KYC gate) ──mint──► reUSD Token
  ICL ──sweep──► Custodial Wallet (now ~99.5% sUSDe, ~0.25% USDC) ──deploy──► §114 Trust (offchain)
  §114 Trust ──surplus notes──► ICL (principal + yield guarantee)
  Chainlink Functions (offchain NAV) ──► NAVConsumer ──► setSharePrice on Share Price Calc ──► reUSD price
  (EOA PRICE_SETTER_ROLE revoked Jun 2026, re-verified still revoked Sep 2026; only NAVConsumer writes. SharePriceCalculator DEFAULT_ADMIN is STILL Governance Safe as of Sep 7, 2026 — a Timelock call to move it to the Timelock was scheduled Sep 2, 2026 and is overdue for execution — so the role remains re-grantable by the 3-of-5 without timelock today.)
  Network Firm (LedgerLens) ──► Chainlink PoR feed "Re Offchain Reserves" (Avalanche, re-verified live Sep 2026; transparency mirror, not consumed by Ethereum reUSD logic)
  reUSD Token DEFAULT_ADMIN_ROLE: Governance Safe ──[executed Aug 10, 2026]──► Timelock Controller (MINTER_ROLE grants now require 48h public queue)
  Chainlink sUSDe/USD ──► SimpleOracle ──► PriceRouter (sUSDe leg only)

Trust Boundaries:
  ⚠ Onchain/offchain boundary at ICL Custodial Wallet sweep
  ⚠ Share price path: PRICE_SETTER_ROLE still only NAVConsumer (EOA bypass remains closed), but SharePriceCalculator's DEFAULT_ADMIN is STILL the Governance Safe as of Sep 7, 2026 — a pending Timelock migration to close this is overdue
  ⚠ Redemption Reserves Custodian (0x9eA3..ADF8) is an EOA, now holding ~$93.5M (up from ~$53M in June)
  ⚠ MINTER_ROLE held by TWO contracts on reUSD (ICL, InstantRedemption; ShareTokenMinterBurner still revoked) — but grants are now Timelock-gated (token DEFAULT_ADMIN moved Aug 10, 2026)
  ⚠ KYC Registry gates all deposits and protocol redemptions
  ⚠ NEW: onchain reserves are ~99.5% sUSDe / ~0.25% USDC — near-total single-asset concentration
  ⚠ NEW: ~94% of onchain reserves ($151.5M) sit at plain EOAs, up from ~86% in June
```

---

## Appendix: Chainlink usage by Re Protocol — what is real vs what is marketing

_Verified June 2026; re-verified live Sep 7, 2026 (feed still active, updated Sep 6, 2026, no structural changes found)._

Re's documentation ties the protocol's reserve and price publication to Chainlink. The relevant quotes:

| Source page | Quote |
|---|---|
| Security and Audits | *"Off-chain bank balances are verified daily by The Network Firm and published via **Chainlink**. The Network Firm also verifies ownership and balances of protocol custody wallets."* |
| How the Re Protocol Works | *"Idle funds are held in a Fireblocks vault under multisig. Balances are published daily to a **Chainlink oracle**. **Proof-of-reserves, publicly auditable**."* |
| How the Re Protocol Works | *"On-Chain Mirror: Trust balances, premium inflows, and claim outflows are hashed and pushed to **Chainlink**, giving 24/7 proof of funds."* |
| How the Re Protocol Works | *"**Chainlink Oracles**: Publish price feeds, trust balances, surplus-note schedules, and redemption queues."* |
| What is reUSD? | *"A JSON price feed is pushed on-chain via **Chainlink**"* |

**What's actually onchain (four Chainlink integrations, verified):**

1. **Chainlink Price Feed — `sUSDe / USD`** ([`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099)) wrapped by `SimpleOracle` [`0xb6aD3633…fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) and read by `PriceRouter`. Used for the sUSDe collateral-pricing leg. (Ethereum.)
2. **Chainlink Functions** — `NAVConsumer` [`0x84d4eaeb…2b4b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) subscribes to the mainnet DON `fun-ethereum-mainnet-1` (subscription `85`). A JS job in the DON computes the daily NAV offchain and the result is written onchain via `fulfillRequest` → `navReceiver.setSharePrice` → `SharePriceCalculator`. (Ethereum.)
3. **Chainlink Automation** — a keeper calls `NAVConsumer.performUpkeep(bytes)` daily (observed every ~86400 s; target time 23:45 UTC). This is what triggers (2). (Ethereum.)
4. **Chainlink Proof-of-Reserve — "Re Offchain Reserves"** ([proxy `0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract) → `AccessControlledOCR2Aggregator 1.0.0` [`0x2c04457B…E7d7`], **Avalanche**). Listed in Chainlink's reference directory (`feeds-avalanche-mainnet.json`) under path `re-reserves`, `productType: "Proof of Reserve"`, category `custom`. `decimals() = 8`; `latestRoundData()` re-verified Sep 7, 2026 returned ~**$179.5M** updated **2026-09-06 12:07 UTC** (was ~$176.8M on 2026-06-17); still backed by **16 OCR2 transmitters**. Data source: **The Network Firm's LedgerLens™ On-Chain Proof of Reserves API**. Chainlink's listing marks it **"non-value-securing"** and includes a disclaimer that neither TNF nor Chainlink attests to the accuracy of the balance data. ([data.chain.link](https://data.chain.link/feeds/avalanche/mainnet/re-reserves))

So Re's claim *"A JSON price feed is pushed on-chain via Chainlink"* is correct in a loose sense: the NAV is produced by Chainlink Functions and pushed by Chainlink Automation, even though it's not a classic Chainlink "price feed aggregator". The NAV Oracle code was audited by Hacken in Apr 2025 (repo `github.com/resilience-foundation/nav-oracle`).

**The "Proof-of-Reserves, publicly auditable" claim — substantiated on Avalanche, with caveats:**

1. **The PoR feed exists and is live.** "Re Offchain Reserves" is in Chainlink's reference directory on **Avalanche** (`feeds-avalanche-mainnet.json`, path `re-reserves`, `productType: "Proof of Reserve"`) and resolves onchain to a working `AccessControlledOCR2Aggregator`. Note it is on Avalanche only — the Ethereum directory (`feeds-mainnet.json`) does not list it.
2. **It is not consumed onchain by Re's Ethereum contracts.** `InsuranceCapitalLayer`, `ShareToken`, `SharePriceCalculator`, `PriceRouter`, `SharePriceOracle`, and the Redemption contracts make no `latestRoundData` call against this (or any) reserves feed. The PoR feed is a **standalone transparency publication on a different chain**, not an input to reUSD pricing, minting, or redemption. So it improves *auditability*, not onchain *enforcement*.
3. **Its data source is the same offchain attestor.** The feed is fed by **The Network Firm's LedgerLens™ API**, so it transports TNF's offchain attestation onto Chainlink's signed OCR2 infrastructure — it is not an independent second verifier, and Chainlink explicitly disclaims attesting to the accuracy of the underlying balances ("non-value-securing").
4. **It reports "Re Offchain Reserves" generically (~$179.5M as of Sep 6, 2026), not a reUSD-only figure**, and covers offchain trust balances — distinct from the onchain reUSD reserves (~$157.73M reUSD-only / ~$160.60M all-in, Sep 7, 2026) this report audits directly.

**Bottom line:**

- "JSON price feed pushed via Chainlink" → **true** (Functions + Automation, verified onchain, Ethereum).
- "Published via Chainlink oracle (for offchain bank balances)" → **true** — a Chainlink PoR feed for Re's offchain reserves is live on Avalanche (TNF LedgerLens source).
- "Proof-of-reserves, publicly auditable" → **substantially true, with caveats**: there is now a Chainlink-signed reserves feed, but it (a) mirrors TNF's offchain attestation rather than independently verifying reserves, (b) is labeled non-value-securing with an accuracy disclaimer, and (c) is not consumed by reUSD's Ethereum logic. Reserve assurance therefore rests on (i) direct onchain balance audit of the ICL/vault/custodian addresses, (ii) The Network Firm's attestation, now also (iii) Chainlink-published on Avalanche.

**Action:** the Chainlink PoR feed is real and monitorable (`latestRoundData()` on [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), Avalanche). When Re cites "Chainlink proof-of-reserves," treat it as a transparency mirror of TNF's attestation on Avalanche — not as an independent onchain control that gates reUSD value on Ethereum. Verify the feed's heartbeat and value rather than assuming it enforces anything.
