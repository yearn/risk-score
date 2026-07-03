# Protocol Risk Assessment: Re Protocol reUSD

- **Assessment Date:** June 21, 2026 (reassessed; previous: April 17, 2026)
- **Token:** reUSD (Re Protocol Deposit Token)
- **Chain:** Ethereum (primary), multi-chain (Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink)
- **Token Address:** [`0x5086bf358635B81D8C47C66d1C8b9E567Db70c72`](https://etherscan.io/address/0x5086bf358635B81D8C47C66d1C8b9E567Db70c72)
- **Final Score: 3.51/5.0** — verified governance improvements are offset by thin reUSD-only onchain coverage (~50.2%, near the 50% floor) and reUSD's 115% loss-attachment; see Risk Score Assessment.

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
- Offchain balances are attested by **The Network Firm** (with read-only account access) and published onchain through a **live Chainlink Proof-of-Reserve feed on Avalanche** ("Re Offchain Reserves," proxy [`0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), [data.chain.link](https://data.chain.link/feeds/avalanche/mainnet/re-reserves), ~$176.8M). Caveats: the feed is on **Avalanche only and is not consumed by reUSD's Ethereum contracts**; its source is **TNF's LedgerLens™ API** (the same offchain attestor, now Chainlink-signed, not an independent second source); Chainlink labels it **"non-value-securing"** with an accuracy disclaimer; and it reports Re's offchain reserves generically, not a reUSD-only figure. The reUSD *share price* is written directly via `setSharePrice` on the Share Price Calculator (not via this feed); the onchain sUSDe price uses the Chainlink sUSDe/USD feed [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099). See the Chainlink usage appendix.

**Key metrics (Jun 21, 2026):**
- reUSD Price: ~$1.085 ([CoinGecko](https://www.coingecko.com/en/coins/re-protocol-reusd)); verified onchain as `1.0847` via Share Price Calculator `getSharePrice()`
- reUSD Market Cap: ~$181.8M (all chains, CoinGecko)
- reUSD Total Supply: ~166.4M on Ethereum ([Etherscan](https://etherscan.io/token/0x5086bf358635b81d8c47c66d1c8b9e567db70c72))
- 24h Trading Volume: ~$1.4M (CoinGecko)
- TVL (DeFi Llama): ~$272.2M ([DeFi Llama](https://defillama.com/protocol/re); includes reUSDe and Re Capital)
- Ethereum NAV: ~$180.55M (onchain totalSupply × sharePrice)

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

Re Protocol has 4 public smart-contract audit reports from Hacken and Certora, plus a 2025 Agreed-Upon Procedures (AUP) report from The Network Firm for offchain reserve/custody verification.

### Audit / Due Diligence History

| # | Date | Scope | Firm | Key Findings | Report |
|---|------|-------|------|-------------|--------|
| 1 | Sep 2024 | Smart Contract Audit (DeFi) | Hacken | 29 findings (0 Critical, 0 High, 4 Medium, 7 Low, 18 Observations), all resolved. Centralized minting, unaudited libraries, gas risk, 42.11% branch coverage | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-defi-aug2024/) |
| 2 | Dec 2024 | Smart Contract Audit | Hacken | Follow-up audit, issues remediated | [Hacken](https://hacken.io/audits/re-protocol/sca-re-re-contracts-nov2024/) |
| 3 | Apr 2025 | NAV Oracle Audit | Hacken | Scope: the Chainlink-Functions-based `NAVConsumer` + related code at `github.com/resilience-foundation/nav-oracle` (commits `ee7e98…` / `e3dd86ef…`). 8 findings, all resolved. The audited contract IS deployed and active onchain at [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6), holds `PRICE_SETTER_ROLE` on the `SharePriceCalculator`, and runs daily at 23:45 UTC. | [Hacken](https://hacken.io/audits/re-protocol/sca-re-nav-oracle-mar2025/) |
| 4 | Sep 2025 | Re Core (comprehensive) | Certora | 13 issues identified, all addressed and fixed. Formal verification and manual review. | [Certora](https://www.certora.com/reports/re-core) |
| 5 | Oct 2025 | Agreed-Upon Procedures (reserve/custody verification; not a smart-contract audit) | The Network Firm | Independent verification of offchain operational controls and reserve attestation | [AUP Report](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf) |

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
- **TVL**: ~$272.2M (DeFi Llama, Jun 21, 2026; includes reUSDe and Re Capital). ~$181.8M market cap across all chains (CoinGecko). ~166.4M reUSD on Ethereum (onchain `totalSupply()`).
- **Written Premiums** (Re-reported): **~$409M premiums written inception-to-date** (~$226M in 2026), per Re's [Capital Strategy dashboard](https://app.re.xyz/capital-strategy) and a May 26, 2026 [press release](https://www.globenewswire.com/news-release/2026/05/26/3300870/0/en/Resilience-Foundation-to-Launch-The-RE-Governance-Token.html). This is cumulative *premium written* — not earned premium and not reUSD TVL. Not independently verified.
- **Exchange Rate History**: reUSD has appreciated from ~$1.00 to ~$1.085, representing ~8.5% cumulative yield since inception (June 2025).
- **Incidents**: No reported security incidents, exploits, or hacks found for Re Protocol's reUSD on Rekt News or DeFi Llama hacks database. **Note**: Resupply Protocol (a different project with a different reUSD token at a different address) suffered a $9.6M exploit in June 2025 -- this is unrelated to Re Protocol/re.xyz.
- **Peg/Price Stability**: reUSD is not a stablecoin in the traditional sense. Its price is designed to monotonically increase (accruing yield), so "depegging" is not applicable in the same way. The token price should only ever go up.

## Funds Management

### Token Mechanism

reUSD is an **ERC-20 deposit token** that uses a **price-appreciation model** (not rebasing):
- Users deposit admitted assets (USDC) into the ICL smart contract and receive reUSD; the token price increases daily based on the Applicable APY.
- **Onchain price path (verified Jun 21, 2026):** the share price is stored in `SharePriceCalculator` [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8) and written via `setSharePrice(uint256)`. The sole writer is `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) — a Chainlink Functions + Chainlink Automation consumer (DON `fun-ethereum-mainnet-1`, subscription `85`, daily at 23:45 UTC). `NAVConsumer` enforces a 10% onchain deviation cap (`maxDeviationBps = 1000`) and was audited by Hacken in April 2025 (`github.com/resilience-foundation/nav-oracle`, 8 findings, all resolved). `PRICE_SETTER_ROLE` on the `SharePriceCalculator` is now held **only** by `NAVConsumer` — the EOA `0x6C15B25E` no longer holds it (revoked). The `NAVConsumer`'s `DEFAULT_ADMIN` has been moved to the Governance Safe, and `EMERGENCY_UPDATER_ROLE` was revoked from the former EOA `0x6C15B25E` — no current holder was observed onchain (the contract is not `AccessControlEnumerable`, so a strict zero-holder state cannot be proven via `hasRole`). The `PriceRouter` [`0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66`](https://etherscan.io/address/0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66) reads the calculator via `SharePriceOracle` [`0x0764BFa862164D28799F31e7e1e7206F5177B6bB`](https://etherscan.io/address/0x0764BFa862164D28799F31e7e1e7206F5177B6bB); the same router reads sUSDe via `SimpleOracle` [`0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) wrapping Chainlink's `sUSDe/USD` aggregator [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099). The `SharePriceCalculator` itself only enforces `newPrice != 0` — the deviation cap lives in the `NAVConsumer`, not the calculator.
- **Governance improvement (reassessed Jun 21, 2026; all changes verified onchain via `hasRole`):** the former EOA bypass of the NAV Oracle has been closed. `PRICE_SETTER_ROLE` on `SharePriceCalculator` was revoked from EOA `0x6C15B25E` — only `NAVConsumer` holds it now. `NAVConsumer`'s `DEFAULT_ADMIN` moved to the Governance Safe; `EMERGENCY_UPDATER_ROLE` was revoked from the former EOA (no holder observed). The standard audited Chainlink-Functions path is the sole onchain price writer today. **Reversibility caveat (verified onchain):** the role admin for `PRICE_SETTER_ROLE` is the `SharePriceCalculator`'s `DEFAULT_ADMIN`, which is the **Governance Safe (3-of-5), not the Timelock**. The Safe can therefore re-grant `PRICE_SETTER_ROLE` to any address — including an EOA — at any time with **no 48h timelock delay**. The bypass is closed in the current state but is reversible by the 3-of-5 multisig without onchain delay; it is not a structurally irreversible fix.
- The Network Firm performs offchain attestations of the §114 Trust balances. A **Chainlink Proof-of-Reserve feed for "Re Offchain Reserves" is live on Avalanche** (proxy [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), OCR2 aggregator, 16 transmitters, TNF LedgerLens source), but **no Chainlink PoR aggregator is consumed onchain by any Ethereum reUSD contract** — the onchain NAV Oracle publishes the *share price*, not reserves, and the Avalanche PoR feed is a standalone transparency mirror. See the Chainlink usage appendix at the end of this report.
- **NAV formula**: `(Spread/365) + max[sUSDe(T)/sUSDe(T-7d) - 1 ; TBILL(T)/TBILL(T-7d) - 1] × (undeployed capital / total capital) + SOFR × (deployed capital / total capital)`. Spread = 250 bps.

### Capital Deployment

1. **Onchain**: a portion of deposits is kept in onchain backing, verified at ~51.9% of Ethereum NAV on Jun 21, 2026 (see Collateralization). Held as USDC, USDT, USDe and sUSDe in the ICL Custodial Wallet and redemption reserves.
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
- **reUSD — Instant Redemption**: available from the onchain instant liquidity buffer via `redeemInstant(uint256 shares, uint256 minPayout)` on the Interaction contract (which delegates to the `InstantRedemption` implementation at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40)). Atomic, same-block settlement. **Onchain-verified parameters** on Apr 17, 2026: `minRedemption = 0.01 reUSD` (`1e16`), `maxRedemption = 1,000,000 reUSD` (`1e24`), `dailyLimitBps = 2000` (20% of capacity), `userLimitBps = 1000` (10% per wallet), `feeBps = 6` (0.06%), `dayPayoutToken = sUSDe`. At the fastest drain rate, ~5 days to exhaust all liquid onchain reserves (20% per day). The "250 reUSD minimum" cited elsewhere is not in the public docs and contradicts the onchain parameter; treat `0.01 reUSD` as the contract-level floor.
- **reUSD — Windowed Redemption**: once the instant buffer is exhausted, the protocol opens a redemption window (minimum 24 hours). Requests fulfilled pro-rata based on available capital. Proceeds must be claimed within two months.
- **reUSDe — redemption works differently** (per [docs](https://docs.re.xyz/products/about-reusde)): **no instant redemption path exists**. reUSDe redemptions are quarterly-only. Request window = first 72 hours of each fiscal quarter; an "actuarial gate" at quarter-end (≤10 business days) determines *Available Surplus*; payouts are pro-rata against that surplus; unfilled balances auto-roll into the next quarter while retaining queue seniority. Re explicitly notes *"No secondary market maker pool is promised"* for reUSDe. The senior-tranche instant buffer/vault described above applies to reUSD only, not reUSDe.
- **DEX Trading (Re reUSD only)**: Fluid reUSD/USDT DEX pool (~$11.62M — note: USDT, not USDC); Curve reUSD/sUSDe (~$1.42M) and reUSD/USDC (~$450K); Avalanche Blackhole reUSD/USDC pools (~$1.47M combined). **Total DEX liquidity ~$14.96M** (DeFi Llama yields API, filtered by underlying token `0x5086…0c72` / `0x180aF87b…625Bf`). Larger pools labelled "reUSD/scrvUSD", "reUSD/sfrxUSD", "reUSD/fxUSD", "reUSD/sDOLA" on Curve/Convex/Stake-DAO/Beefy are **Resupply Protocol's reUSD** (`0x57aB1E00…`) and are NOT Re reUSD exits.
- **Not available to U.S. persons**
- **Fees**: Redemption fee of `6 bps` (0.06%) — **onchain-verified** via `InstantRedemption.feeBps() = 6` at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) ([docs](https://docs.re.xyz/products/about-reusd)). No documented deposit fees, management fees, or performance fees. RWA.xyz reports 0.18% subscription and 0.18% redemption fees — discrepancy with docs may reflect different fee tiers or methodology. Onchain data shows ~$1,535 total deposit fees collected historically, suggesting a small deposit fee mechanism exists in the contracts (also flagged in Hacken audit finding F-2024-5214 "Unclaimed Deposit Fees Unaccounted For").

### Collateralization

- **Onchain reserve target**: Re's public materials describe a target of ≥50% of deposits kept in onchain backing (USDC, sUSDe, and — per protocol claim — potentially T-bill wrappers such as BUIDL).
- **Onchain reserves — verified Jun 21, 2026 against AUP address list**: The Network Firm's Oct-2025 AUP report lists **15 Fireblocks-MPC-controlled addresses** as in-scope for Re's supporting assets ([`AUP-Report-2025.pdf`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf), Procedure 3 table). All 15 were checked for USDC / USDT / USDe / sUSDe / BUIDL balances today. 11 are empty; 4 hold all the reserves:

| # | AUP-listed address | Chain type | Current USD value | Share (reUSD base) |
|---|---|---|---|---|
| 1 | [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) ICL Custodial Wallet | **EOA** | **$24.95M** (USDC $19.55M + USDT $3.24M + USDe $0.37M + sUSDe $1.79M) | 26.6% |
| 2 | [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) Redemption Reserves Custodian | **EOA** | **$52.95M** (sUSDe) | 56.6% |
| 3 | [`0xd4374008c88321Eb2e59ABD311156C44B25831e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9) | **EOA** | **$3.05M** (USDe $2.20M + sUSDe $0.84M) | 3.3% |
| 4 | [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) Daily Instant Redemption Vault | Contract (`RedemptionVault`) | $12.71M (sUSDe) | 13.6% |
| 5 | [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) ICL | Contract (proxy) | $0 | — |
| 6 | [`0xE1886BE2bA8B2496c2044a77516F63a734193082`](https://etherscan.io/address/0xE1886BE2bA8B2496c2044a77516F63a734193082) | Contract | $258 (dust) | — |
| 7-15 | 0x19af…5896, 0x4F1f…DaE4, 0x802e…0291, 0x9AB6…1FE3, 0xb22a…fbe1, 0xD75E…eDE9, 0xe132…9d23, 0xfB60…4BB0, 0xfd40…B852 | 9 × EOA | $0 | — |
| **Total** | | | **~$93.66M** | **100%** |

  (sUSDe valued at the onchain sUSDe/USDe exchange rate of `1.2363` via `convertToAssets`, assuming USDe ≈ $1.)

  **Coverage ratio: $93.66M / $180.55M Ethereum NAV = ~51.9%** (~51.8% vs ~$180.9M total cross-chain NAV). The protocol-stated ≥50% target is met with ~1.9 percentage points of headroom.

  **Address 3 (`0xd4374008…B25831e9`) — reUSDe collateral (per team feedback).** It currently holds $3.05M of USDe and sUSDe. Per Re, this is the **reUSDe ICL Custodial Wallet** and backs **reUSDe, not reUSD**. The table above includes it in the $93.66M total; **excluding it, reUSD-only onchain reserves are ~$90.61M and reUSD-only coverage is ~$90.61M / $180.55M ≈ 50.2%** — only ~0.2 pp above the 50% floor (vs the ~51.9% all-in figure). This attribution is Re's; onchain the address is indistinguishable from the other Fireblocks EOAs. Treat ~50.2% as the conservative reUSD-only coverage.

- **Concentration concerns (onchain-verified)**:
  - ~**72.9%** of onchain reserves are in sUSDe. This inherits Ethena counterparty / smart-contract risk and a 7-day cooldown to unstake sUSDe → USDe. USDC now represents ~20.9% ($19.55M) of onchain reserves — a significant improvement from prior ~9.3% — making a larger share immediately redeemable.
  - **No BUIDL or T-bill-wrapper balances** were found at any of the ICL / vault / custodian addresses (Jun 21, 2026), even though Re's materials mention such assets as potential reserves. Apart from USDC / USDT / USDe / sUSDe, the only non-dust holding is ~1.35M `reUSDsUSDe` Curve LP tokens at the ICL Custodial Wallet (protocol-owned liquidity for the reUSD/sUSDe pool; excluded from the reserve total above). All other token balances at these addresses are airdrop spam or dust (<$500).
  - The ICL contract [`0x4691…3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) itself holds $0 in reserves — assets sit at the Custodial Wallet (an EOA) and at the Redemption Reserves Custodian (also an EOA).

- **Custody / asset-movement surface — ~86% of reserves sit at plain EOAs (critical):**

  Of the $93.66M onchain reserve, **$80.95M (~86.4%) sits at three plain EOAs**: the ICL Custodial Wallet (~$24.95M), the Redemption Reserves Custodian (~$52.95M), and `0xd4374008…B25831e9` (~$3.05M, the **reUSDe** ICL custodian per team feedback — counted here because the EOA custody *risk* is token-agnostic, but excluded from the reUSD-only coverage ratio above). Only $12.71M (the Daily Instant Redemption Vault) sits behind contract-enforced role gating. From the chain's perspective, each EOA is indistinguishable from an ordinary single-key wallet. One ECDSA signature, one `transfer(...)` call, and those funds move anywhere — no onchain delay, no destination whitelist, no role check.

  Re's documentation and the October 2025 AUP describe these as **"Fireblocks MPC (Multi-Party Computation) wallets"** in which *"the associated private key is split into encrypted 'shares'"* (AUP Report 2025, footnote 2). Important caveats about what the AUP actually proves:

  - The AUP procedure for the Fireblocks assets was *"observe Re Management access the Fireblocks blockchain-based MPC wallet"* and then *"query the blockchain-based addresses observed for Supporting Assets"*. **This is watching someone log in; it is not cryptographic verification that N-of-M signers are required for any given transaction.** TNF relied on Re's assertion of the MPC structure.
  - The AUP explicitly disclaims operating-effectiveness testing of internal controls: *"We did not perform procedures regarding the operating effectiveness of the Re's internal controls."*
  - The AUP was also scoped to exclude 1:1 backing, TVL, and token valuations: *"We did not perform procedures over specific aspects of the Re Protocol, including but not limited to … 1:1 backing of reserves to the tokens or the total value locked (TVL) of the Re Protocol."*

  Onchain, the EOAs have no code — no Safe multisig, no timelock wrapper, no onchain-whitelisted destination set, no per-asset spending caps. Whatever Fireblocks policies exist (transaction whitelists, per-asset limits, approval workflows) and whatever the real MPC quorum is are **entirely offchain** and unverifiable by anyone outside Re. The **48-hour Timelock does NOT protect these reserves** — it only gates governance actions routed through `TimelockController` (upgrades, role changes).

  What's needed to drain $80.95M onchain:

  - If the claimed N-of-M MPC is real and Fireblocks policies are tight → compromise the policy + compromise or collude signer quorum → **1 signed tx**.
  - If Fireblocks policies are permissive → signer-quorum compromise / collusion alone → **1 signed tx**.
  - If an insider with quorum access is malicious → **1 signed tx**.

  This is the single largest unmitigated custody risk in the system. The AUP provides evidence that the specific address list is in Re's MPC setup, not that unauthorized movement would be prevented by multi-party signing.
- **Onchain buffer**: Instant redemption vault and Redemption Reserves Custodian hold ~$65.66M of sUSDe plus $0 USDC for immediate redemptions (USDC instant exits unavailable under current config; see Liquidity).
- **Offchain trust**: §114 Reinsurance Trust holds cash and T-Bills in NAIC-compliant banks; Re's public materials name these as "an independent bank / custodian" without disclosing specific counterparty names. The independently-verifiable attestations of these balances are (a) the Oct 31, 2025 Agreed-Upon Procedures report by The Network Firm ([`AUP-Report-2025.pdf`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf)) and (b) the **live Chainlink "Re Offchain Reserves" PoR feed on Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), ~$176.8M), which publishes TNF's LedgerLens attestation through Chainlink's signed OCR2 infrastructure. The PoR feed is a meaningful transparency upgrade but is **not** an independent second source (it transports the same TNF attestation), is **not** consumed by reUSD's Ethereum contracts, and is labeled "non-value-securing" (see the Chainlink usage appendix).
- **Surplus Note protection**: Surplus notes rank junior to policyholders but contractually protect depositor principal
- **Re Capital buffer**: ~$73M subordinated **first-loss** layer (the reinsurer's equity) ahead of reUSDe and reUSD; absorbs losses in the 105–110% combined-ratio band
- **reUSDe as backstop**: reUSDe is the **mezzanine / second-loss** layer (not first-loss). It absorbs losses in the 110–115% band, after Re Capital is exhausted, before losses reach reUSD. Per Re's model, **reUSD's loss likelihood is ~0.9% (portfolio reaching its 115% attachment), not 0.03%** — the 0.03% figure corresponds to a 135% deep-stress level, well beyond reUSD's attachment point

### Provability

- **reUSD price**: Updated daily by a Chainlink-Functions-driven `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) calling `SharePriceCalculator.setSharePrice`. The NAV computation itself is **not** programmatically onchain — Chainlink Functions runs JS offchain (DON `fun-ethereum-mainnet-1`, subscription `85`) and returns a single NAV value. Onchain safeguards: Chainlink Automation triggers daily at 23:45 UTC; `NAVConsumer.maxDeviationBps = 1000` (10%) enforces a deviation guard; Hacken audited the NAV Oracle in Apr 2025. `PRICE_SETTER_ROLE` on the `SharePriceCalculator` is now held **only** by `NAVConsumer` — the EOA `0x6C15B25E` has been revoked. `NAVConsumer`'s `DEFAULT_ADMIN` is now the Governance Safe; `EMERGENCY_UPDATER_ROLE` was revoked from the former EOA (no holder observed; the contract is not independently enumerable). **Reversibility:** the `SharePriceCalculator`'s role admin is the Governance Safe (not the Timelock), so `PRICE_SETTER_ROLE` can be re-granted to an EOA without a timelock delay — the fix is current-state, not structurally irreversible.
- **Onchain reserves**: Visible onchain via the ICL contract and Redemption Reserves Custodian
- **Offchain reserves**: Attested by The Network Firm and published onchain via a **live Chainlink Proof-of-Reserve feed** — "Re Offchain Reserves," proxy [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract) on **Avalanche** ([data.chain.link](https://data.chain.link/feeds/avalanche/mainnet/re-reserves)). It is a genuine Chainlink PoR product (directory path `re-reserves`, Product Type "Proof of Reserve," an `AccessControlledOCR2Aggregator` with 16 transmitters, ~$176.8M). Material caveats: (a) the data source is **TNF's LedgerLens™ API**, so the feed transports the same offchain attestation rather than adding an independent verifier; (b) Chainlink labels it **"non-value-securing"** with an accuracy disclaimer; (c) it is **not consumed by any Ethereum reUSD contract**; and (d) it reports Re's offchain reserves generically, not a reUSD-only number. The onchain Chainlink dependency for reUSD's *pricing* remains the `sUSDe/USD` aggregator ([`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099)). See the Chainlink usage appendix.
- **Insurance performance**: Reinsurance returns are inherently offchain and depend on claim experience over multi-year treaty periods
- **Minting requires backing (ICL path)**: All ICL deposit paths (`deposit`, `depositFromCustodian`, `processPrestakedDeposit`) enforce `safeTransferFrom` — backing tokens must be transferred to the ICL before reUSD is minted (verified in source at [implementation `0x06d4acc104b974cd99bf22e4572f48a051e59670`](https://etherscan.io/address/0x06d4acc104b974cd99bf22e4572f48a051e59670)). However, the reUSD token contract has an unrestricted `mint(address, uint256)` gated only by `MINTER_ROLE`.
- **MINTER_ROLE holders (verified via `hasRole` on Jun 21, 2026)**: **TWO** contracts hold the role (was 3):
  1. `InsuranceCapitalLayer` [`0x4691C475bE804Fa85f91c2D6D0aDf03114de3093`](https://etherscan.io/address/0x4691C475bE804Fa85f91c2D6D0aDf03114de3093) — backed mint path; enforces `safeTransferFrom`.
  2. `InstantRedemption` [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) — burns reUSD on redemption; uses MINTER_ROLE because `mint` and `burn` typically share the role in this codebase.
  - `ShareTokenMinterBurner` [`0x0dFb42aa18CEeD719617cd554304F6cA412A6b18`](https://etherscan.io/address/0x0dFb42aa18CEeD719617cd554304F6cA412A6b18) **no longer holds MINTER_ROLE** (revoked). The OFT cross-chain mint path via `ReMintBurnAdapter` [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85) is rate-limited at `2,500,000 reUSD / 24h` per peer chain. Both `ShareTokenMinterBurner.owner` and `ReMintBurnAdapter.owner` are now the **Governance Safe** ([`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd)) — previously both were owned by EOA `0x6C15B25E`.
- If `MINTER_ROLE` were granted to another address via Governance Safe, that address could mint without a backing check at the token layer.

## Liquidity Risk

### Primary Exit Mechanisms

1. **Instant Redemption**: From the onchain buffer. Atomic, same-block. Available until buffer is exhausted (< 1% of supply triggers window-only mode)
2. **Quarterly Redemption**: Processed pro-rata with available capital not reserved for reinsurance plus actuarially released funds
3. **DEX Swap**: Sell reUSD on Curve reUSD/USDC pool

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

Combined ~$69.3M of Re reUSD is supplied into Fluid + Morpho lending markets onchain.

### Liquidity Summary

- **Total DEX Liquidity (onchain-verified, Re reUSD only)**: **~$14.96M** across Fluid, Curve, and Blackhole (~**8.2%** of ~$181.8M market cap). Fluid reUSD/USDT (~$11.62M) is the dominant venue (~78% of DEX depth). Significantly smaller than the initial "~$26.2M" figure, which erroneously included Resupply-reUSD Curve pools.
- **24h Trading Volume (token-level, CoinGecko)**: ~$1.4M.
- **Instant redemption buffer (Jun 21, 2026, onchain)**: The Daily Instant Redemption Vault at [`0x5C454f5526e41fBE917b63475CD8CA7E4631B147`](https://etherscan.io/address/0x5C454f5526e41fBE917b63475CD8CA7E4631B147) holds `0` USDC and sUSDe worth ~$12.71M. The `custodialWallet` (labeled "Redemption Reserves Custodian" in this report) [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) is an EOA and holds `0` USDC and sUSDe worth ~$52.95M. The configured `dayPayoutToken` is **sUSDe** (not USDC), so instant redemptions settle into sUSDe under current config.
- **Instant Redemption Interaction Contract**: [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) — exposes `redeemInstant(uint256 shares, uint256 minPayout)` for instant redemptions.
- **Onchain capital (Jun 21, 2026)**: ICL Custodial Wallet [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) holds ~$19.55M USDC + ~$1.79M sUSDe. ICL contract itself holds $0.
- **Quarterly queue**: Pro-rata fulfillment, may not be fully met if capital is locked in reinsurance
- **KYC required**: Both for deposit and redemption through the protocol
- **Multi-chain**: Available on 6+ chains. Liquidity concentrated on Ethereum Curve pools (~$16M) with ~$1.5M on Avalanche.

## Centralization & Control Risks

### Governance

- **Governance (onchain-verified)**: A **Safe 3-of-5 multisig** at [`0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd`](https://etherscan.io/address/0x8EEc10616802Ef639ca55C98Ac856553FadeFbAd) (SafeProxy; 5 owners, threshold 3) holds DEFAULT_ADMIN on reUSD, ICL, and NAVConsumer; PROPOSER + CANCELLER on the Timelock. UPGRADER_ROLE on reUSD and ICL now held by the Timelock Controller. The protocol docs also describe additional MPC-controlled admin EOAs (Oracle, Redemptions, Access); those EOAs exist onchain, but the `N-of-M` MPC quorum is offchain and cannot be verified.
  - Oracle admin EOA: `0x49BC5A88…9212A0ee` — **no timelock** (but `PRICE_SETTER_ROLE` on `SharePriceCalculator` is now held only by `NAVConsumer`; the EOA bypass has been closed).
  - Redemptions admin EOA: `0xEE16bE03…310c47f8`.
  - Access admin EOA: `0x80a62B72…812fECAFc` (administers `AccessManager` [`0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8`](https://etherscan.io/address/0x3f0DA1C363e34802C6f12F9C27276dC0e6696FD8); onchain-observed calling `grantRole`/`labelRole`).
  - Custodian manager: **Timelock Controller** [`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93) now holds `CUSTODIAN_MANAGER_ROLE` on ICL (was EOA `0x9b6d7f2d…eC9`). Custodian changes are now 48h-timelocked.
  - Timelock executor EOA: `0x4BFea59b…740738F3` (onchain-verified).
- **Upgrade Pattern**: UUPS / ERC1967 upgradeable contracts (reUSD and ICL implementations verified).
- **Upgrade Authority**: Governance Safe → Timelock Controller ([`0x69dDEa332723cF5407151aAF68B9b076557FCA93`](https://etherscan.io/address/0x69dDEa332723cF5407151aAF68B9b076557FCA93)). Timelock `getMinDelay() = 172800` seconds (**48 hours**, onchain-verified). Both `UPGRADER_ROLE` on reUSD and ICL now held by the Timelock.
- **Timelock**: 48-hour timelock on upgrades, role changes, and custodian changes routed through Timelock. Share price writes go through the audited `NAVConsumer` path with 10% deviation cap — the EOA bypass has been closed.
- **No onchain governance**: Protocol is currently governed by an expert-led council (Resilience Foundation). Planned transition to DAO in the future.
- **MPC signers**: Re Team members — not publicly identified.

### Programmability

- **reUSD price**: **NOT programmatically computed**. The NAV itself is produced offchain by a Chainlink Functions JS job, delivered onchain by `NAVConsumer`, and stored in `SharePriceCalculator`. Onchain, the NAV Consumer enforces a 10% deviation cap per update (`maxDeviationBps = 1000`). A Chainlink PoR feed for Re's offchain reserves is live on Avalanche, but **no PoR aggregator is consumed onchain by the Ethereum reUSD contracts** to gate pricing or redemption (see the Chainlink usage appendix). The `SharePriceCalculator`'s `PRICE_SETTER_ROLE` is now held **only** by `NAVConsumer` — the EOA bypass path has been closed (role revoked from `0x6C15B25E`). `NAVConsumer`'s `DEFAULT_ADMIN` is the Governance Safe; `EMERGENCY_UPDATER_ROLE` was revoked from the former EOA (no holder observed). **Caveat:** the `SharePriceCalculator`'s role admin is the Governance Safe (not the Timelock), so `PRICE_SETTER_ROLE` can be re-granted to an EOA without a timelock delay — the price path is not yet structurally tamper-resistant.
- **Deposits**: Require KYC verification through the KYC Registry contract
- **Redemptions**: Instant redemptions are programmatic (from buffer). Quarterly redemptions involve admin-managed processes
- **Capital deployment**: Offchain, managed by the protocol team through the Fireblocks custody infrastructure

### External Dependencies

- **Chainlink**: Verified onchain use is (a) Chainlink Functions + Automation driving the daily reUSD NAV/share-price update (Ethereum), (b) the Chainlink `sUSDe/USD` price feed used for collateral pricing (Ethereum), and (c) a **live Chainlink Proof-of-Reserve feed** "Re Offchain Reserves" on **Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), TNF LedgerLens source). The PoR feed is a transparency mirror only — it is not consumed by reUSD's Ethereum pricing/redemption logic.
- **The Network Firm**: Third-party accountant for daily offchain reserve verification
- **Ethena**: USDe/sUSDe for basis-trade yield source
- **Fireblocks**: Custody for idle onchain capital (daily sweeps from ICL to Fireblocks vault)
- **§114 Reinsurance Trust**: Offchain U.S.-domiciled trust bank for regulatory collateral
- **Cayman Reinsurer**: Partner reinsurance company (CIMA-licensed, Class B(iii))
- **SumSub / Chainalysis**: KYC/AML verification
- **Multiple blockchains**: Cross-chain deployments on Ethereum, Avalanche, Arbitrum, Base, Katana, BNB Chain, Ink

## Operational Risk

- **Team**: CEO **Karn Saroya** (publicly known, LinkedIn/Twitter). Previously co-founded Cover (YC-backed insurtech) and Stylekick (acquired by Shopify); part of early Shopify team. **Underwriting leadership: James Norris (Chief Underwriting Officer**, 30+ years insurance/reinsurance, former President of Lapis Resources; [appointment confirmed by Reinsurance News](https://www.reinsurancene.ws/re-appoints-james-norris-as-chief-underwriting-officer/)) **and Jonathan Lim (Head of Underwriting**, actuarial background).
- **Company**: Re (re.xyz). Founded 2022. **Token issuer: Resilience Foundation Cayman LLC** (Cayman Islands Exempted Limited Guarantee Foundation Company, per Re's [Legal Disclosures](https://re.xyz/disclosure)). **Resilience (BVI) Ltd is an affiliate service provider, not the issuer** — the earlier "Resilience BVI Ltd. issuer" attribution (from RWA.xyz) was incorrect. Governance controlled by Resilience Foundation.
- **Legal Structure**: Partner reinsurance company (Cover Re SPC) domiciled in Cayman Islands, regulated by CIMA. Offchain trust accounts in U.S. jurisdiction (§114 Trust, NAIC-compliant banks). **Token issuer (Resilience Foundation) domiciled in the Cayman Islands; the BVI entity is a service affiliate.**
- **Investors**: $14M seed round at $100M post-money valuation. Investors include **Electric Capital, Tribe Capital, Stratos, SiriusPoint, Exor, Defy, Framework Ventures, Morgan Creek Digital**.
- **Custody:** Re's public materials (`docs.re.xyz`) name **Fireblocks MPC custody** for idle onchain assets. The [AUP-Report-2025](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf) corroborates that Re operates a Fireblocks MPC wallet set covering the 15 listed addresses but does not cryptographically verify the N-of-M quorum. Public documentation does not name specific banking counterparties for the offchain §114 Trust assets.
- **Documentation**: Comprehensive documentation at docs.re.xyz. Clear description of mechanism, risks, and investor protections.
- **Runtime Monitoring**: ChainAnalysis for onchain transaction monitoring.
- **Incident Response**: Emergency pause mechanism exists. Recovery wallets designated for each ICL (e.g., [`0xDf6bF2713b5c7CA724E684657280bC407938F447`](https://etherscan.io/address/0xDf6bF2713b5c7CA724E684657280bC407938F447) for initial ICL).
- **KYC/AML**: Required for all participants (SumSub + Chainalysis). Revoked KYC = request cancelled, tokens returned.
- **Not available to U.S. persons** and may be restricted in other jurisdictions.
- **Written Premiums** (Re-reported): **~$409M premiums written inception-to-date** (~$226M in 2026), per Re's [Capital Strategy dashboard](https://app.re.xyz/capital-strategy) / [May 2026 press release](https://www.globenewswire.com/news-release/2026/05/26/3300870/0/en/Resilience-Foundation-to-Launch-The-RE-Governance-Token.html); book spans ~35 carriers / "more than 30 insurance partners" and ~600K ("hundreds of thousands") policyholders. Multi-billion-dollar pipeline. Protocol has demonstrated real-world insurance traction (figures Re-reported, not independently verified).

## Monitoring

### reUSD Price Monitoring

- **Share Price Calculator**: [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8)
  - Monitor reUSD price changes daily. Current: ~$1.085 (onchain `getSharePrice()` = `1.0847`, Jun 21, 2026).
  - **Alert**: If price **decreases** (should only ever increase under normal operation).
  - **Alert**: If price growth **stops** for >48 hours (indicates oracle feed interruption or yield issue).
  - **Alert**: Any new member granted `PRICE_SETTER_ROLE` on the Share Price Calculator (currently only `NAVConsumer` `0x84d4eaeb…2b4b6`; EOA `0x6c15b25e…57649` was revoked Jun 2026).
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

- **Reserve EOAs — primary custody risk**: ~86% of onchain reserves are at three plain EOAs (of the 15 Fireblocks-MPC-controlled addresses listed in the AUP-Report-2025). No onchain outflow restriction applies.
  - **ICL Custodial Wallet (EOA)**: [`0x295F67Fdb21255A3Db82964445628a706FBe689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) — current balance ~$24.4M.
    - **Alert (Critical)**: Any transfer (USDC / USDT / USDe / sUSDe) to a destination NOT on the historical allow-list (Ethena sUSDe/USDe contracts, Redemption Reserves Custodian, Daily Instant Redemption Vault, Fireblocks-pattern sweep addresses beginning `0x34b6…`). First-time destinations = incident.
    - **Alert (High)**: Any outbound transfer >$1M.
  - **Redemption Reserves Custodian (EOA)**: [`0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) — current balance ~$65.4M.
    - **Alert (Critical)**: Any sUSDe transfer to a destination NOT on the historical allow-list (only `0x5C45…B147` RedemptionVault and sUSDe/USDe staking contracts observed to date).
    - **Alert (High)**: Any single outbound >$5M.
  - **reUSDe ICL Custodial Wallet (EOA) [`0xd4374008…B25831e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9)**: — currently holds ~$2.6M in USDe+sUSDe. Per Re this backs **reUSDe**, not reUSD (so it is excluded from the reUSD coverage ratio), but it is the same Fireblocks-EOA custody pattern and worth monitoring.
    - **Alert (Critical)**: Any outbound transfer. Small size makes every movement worth a manual look.
  - **All 12 other AUP-listed addresses** (currently empty or dust): monitor for any incoming deposit >$1M and then for any subsequent outgoing transfer. Sudden use of a previously-empty AUP address is a governance signal (either new custody rotation or an unauthorized movement).

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

### Offchain Reserve Monitoring

- **Chainlink "Re Offchain Reserves" PoR feed (Avalanche)** [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract): now a directly-monitorable onchain reserve signal (call `latestRoundData()`; decimals = 8; ~$176.8M on June 17, 2026). Caveat: it reports "Re Offchain Reserves" generically (not reUSD-only) and is sourced from TNF's LedgerLens attestation, so it is not an independent cross-check.
  - **Alert**: if the feed's `updatedAt` goes stale beyond its normal heartbeat (observe the cadence for a calendar month first).
  - **Alert**: if the reported reserve value drops materially or falls below expected offchain backing.
- **The Network Firm attestation**: the only Network Firm engagement publicly verified is the single Agreed-Upon Procedures report dated Oct 31, 2025 (published Dec 17, 2025). No onchain or public evidence establishes a daily or weekly cadence; the "daily attestation" phrasing in Re's docs is a protocol claim, not an observed publication pattern. The Avalanche PoR feed above is the primary onchain reserve signal; the AUP and Re's transparency dashboard are the supporting offchain channels.
  - **Action**: before relying on an "X-hours stale" alert, confirm the actual publication cadence with Re or by observing the transparency dashboard / PoR feed heartbeat for a calendar month.
  - **Alert**: if reported reserves fall below total reUSD supply × share price.
  - **Alert**: if a new AUP report appears with an address list that differs from the 15 addresses in [`AUP-Report-2025`](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf).

- **Onchain coverage ratio**: Compute `(USDC + USDT + USDe + sUSDe_in_USDe_terms)` across all 15 Fireblocks-MPC-controlled addresses listed in the [AUP-Report-2025](https://storage.googleapis.com/foundation-files/AUP-Report-2025.pdf), divided by `reUSD Ethereum totalSupply × getSharePrice()`. Currently ~51.9%.
  - Alert if coverage drops below 50% (Re's stated floor).
  - Alert if coverage drops below 55% (headroom erosion).
  - Alert if the sUSDe share of reserves exceeds 80% or the USDC share drops below 15% (current split: sUSDe ~72.9% / USDC ~20.9%).
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

## Risk Summary

### Key Strengths

- **Senior tranche position (structural)**: reUSD sits senior to reUSDe (mezzanine) and Re Capital (first-loss reinsurer equity) in the loss waterfall; both subordinated layers (105–110% Re Capital, 110–115% reUSDe) must be breached before reUSD is impaired at >115% combined ratio.
- **Third-party offchain reserve verification + live Chainlink PoR**: The Network Firm attests offchain bank balances (Oct 2025 AUP is the verified document), and as of June 2026 those attestations are also published onchain through a **live Chainlink Proof-of-Reserve feed on Avalanche** ("Re Offchain Reserves," ~$176.8M). The PoR feed is a genuine transparency improvement, though it transports TNF's attestation rather than adding an independent verifier and is not consumed by reUSD's Ethereum logic.
- **Comprehensive smart-contract audit coverage**: 4 public smart-contract audit reports across Hacken and Certora, including Certora formal verification and a Hacken audit of the Chainlink-Functions-based `NAVConsumer` that is deployed onchain as the standard price writer. The Network Firm AUP is due diligence/reserve verification, not a smart-contract audit.
- **Onchain NAV path with automation and deviation guard**: Daily share price is written by a Chainlink-Functions + Chainlink-Automation consumer with a `maxDeviationBps = 1000` (10%) onchain check. The EOA bypass previously flagged has been closed — `PRICE_SETTER_ROLE` on the `SharePriceCalculator` is now held only by `NAVConsumer`; the EOA `0x6C15B25E` has been revoked (verified onchain). Caveat: the role admin is the 3-of-5 Safe, not the Timelock, so the grant is re-openable without a timelock delay — see Key Risks.
- **Timelock on upgrades**: `TimelockController.getMinDelay() = 172800` (48 hours) on all privileged governance actions routed through it. `DEFAULT_ADMIN_ROLE` on reUSD and ICL sits with a 3-of-5 Safe multisig.
- **Emergency mechanisms**: Pause functionality on the InstantRedemption, LayerZero adapter, and NAV Consumer; designated recovery wallets; Chainalysis runtime monitoring.

### Key Risks

- **Single EOA can bypass the NAV Oracle** — **LARGELY MITIGATED (Jun 2026; verified onchain via `hasRole`).** The EOA `0x6C15B25E` previously held `PRICE_SETTER_ROLE` on `SharePriceCalculator` and `DEFAULT_ADMIN`/`EMERGENCY_UPDATER_ROLE` on `NAVConsumer`. These have been revoked: `PRICE_SETTER_ROLE` now belongs only to `NAVConsumer`; `DEFAULT_ADMIN` moved to the Governance Safe; `EMERGENCY_UPDATER_ROLE` was revoked from the former EOA (no holder observed). The standard audited Chainlink-Functions path is the sole onchain price writer today. **Residual:** the `SharePriceCalculator`'s `DEFAULT_ADMIN` (the role admin for `PRICE_SETTER_ROLE`) is the Governance Safe (3-of-5), **not** the Timelock — so the multisig can re-grant `PRICE_SETTER_ROLE` to an EOA without a 48h delay. The bypass is closed in current state but is not structurally irreversible. This was the #1 *price-path* centralization risk in April 2026; the reserve-custody EOA risk (below) remains the #1 *fund-loss* risk and is unchanged.
- **Significant offchain capital deployment**: Majority of assets are deployed offchain into §114 Trust and reinsurance programs. This introduces counterparty risk with the trust bank, partner reinsurer, and custodians that cannot be verified fully onchain.
- **Instant redemption vault holds no USDC**: The Daily Instant Redemption Vault holds `0` USDC and sUSDe worth ~$12.71M. The Redemption Reserves Custodian (EOA) holds `0` USDC and sUSDe worth ~$52.95M. `dayPayoutToken` is sUSDe — USDC-denominated instant exits are unavailable under the current config.
- **Onchain reserves concentrated in sUSDe**: Onchain reserves total ~$93.66M (~51.9% of Ethereum NAV all-in; **~50.2% reUSD-only**, essentially at the ≥50% floor, once the reUSDe custodian is excluded). ~72.9% of reserves is sUSDe and ~20.9% is USDC ($19.55M) — a materially improved USDC share, but Ethena (sUSDe issuer) remains a key counterparty (7-day unstake cooldown). The BUIDL / T-bill wrappers mentioned in Re's materials are **not** held onchain.
- **Two MINTER_ROLE holders on reUSD (was 3)**: `InsuranceCapitalLayer` (backed path) and `InstantRedemption` (burns on redeem). `ShareTokenMinterBurner` **no longer holds MINTER_ROLE** (revoked). The OFT cross-chain path remains via `ReMintBurnAdapter` with a 2.5M reUSD/24h rate limit per peer chain. Both `ShareTokenMinterBurner.owner` and `ReMintBurnAdapter.owner` are now the **Governance Safe** (`0x8EEc10…FbAd`) — previously both were owned by EOA `0x6C15B25E`.
- **DEX liquidity thin**: only ~$14.96M of onchain-verified Re reUSD liquidity on DEXes (~8.2% of market cap). (Curve reUSD/scrvUSD, reUSD/sfrxUSD, and reUSD/fxUSD pools are Resupply's reUSD — a different token — and are excluded.)
- **KYC gating**: All deposits and redemptions require KYC. This limits the universe of users who can exit and creates regulatory/jurisdictional risk.
- **Quarterly redemption queue**: Once instant buffer is exhausted, redemptions are windowed and pro-rata. Capital release from reinsurance programs is reevaluated quarterly per Re's public materials.
- **Reinsurance tail risk**: Underlying assets are exposed to insurance claim risk. **reUSD is impaired once the portfolio combined ratio exceeds 115%** (its attachment point), after Re Capital (~$73M, first-loss, 105–110%) and all reUSDe reserves (mezzanine, 110–115%) are depleted. Re's model puts reUSD's loss likelihood at **~0.9%** (probability of reaching 115%); 135%/0.03% is a deeper-stress level, not the attachment. Re's historical combined ratio is ~92% and the portfolio avoids catastrophe lines, but a ~0.9% modeled attachment is not negligible (all figures Re-asserted, model undisclosed).
- **No bug bounty program found**: No Immunefi or comparable bug bounty program identified.

### Critical Risks

- **Custody / asset-movement surface — ~86% of onchain reserves at plain EOAs**: `$80.95M` of `$93.66M` of onchain reserves sits at **three** plain EOAs listed in the AUP-Report-2025: [`0x295F67…689E`](https://etherscan.io/address/0x295F67Fdb21255A3Db82964445628a706FBe689E) ICL Custodial Wallet ($24.95M); [`0x9eA38e…ADF8`](https://etherscan.io/address/0x9eA38e09F41A9DE53972a68268BA0Dcc6d2fAdf8) Redemption Reserves Custodian ($52.95M); [`0xd437…31e9`](https://etherscan.io/address/0xd4374008c88321Eb2e59ABD311156C44B25831e9) auxiliary ($3.05M). None has code; all look identical to single-key wallets from the chain's perspective. **No onchain delay, destination whitelist, or role check** applies to their outbound transfers — one ECDSA signature moves the funds. The claimed Fireblocks MPC custody (N-of-M offchain quorum, destination policies) is unverifiable by anyone outside Re; TNF's AUP procedure was "observe Re Management access the Fireblocks MPC wallet," which does not cryptographically attest the N-of-M quorum. The 48h Timelock does NOT gate these flows. See Funds Management → Collateralization for the full custody table.
- **Offchain dependency concentration**: The protocol's value proposition depends on offchain entities (Cayman reinsurer, §114 Trust, The Network Firm, Fireblocks) operating honestly and solvent. Onchain verification cannot fully cover offchain risks.
- **Oracle/setter manipulation** — **LARGELY MITIGATED (Jun 2026).** The EOA `0x6C15B25E` previously held `PRICE_SETTER_ROLE` on the `SharePriceCalculator` and could bypass the audited `NAVConsumer` path. That role has been revoked; only `NAVConsumer` holds it now. `DEFAULT_ADMIN` on `NAVConsumer` is now the Governance Safe; `EMERGENCY_UPDATER_ROLE` was revoked from the former EOA (no holder observed). The standard audited Chainlink-Functions path with 10% deviation cap is the sole onchain price writer today. **Residual:** because the `SharePriceCalculator`'s role admin is the Governance Safe (not the Timelock), the 3-of-5 can re-grant `PRICE_SETTER_ROLE` without a timelock delay — the fix is current-state, not irreversible. A Chainlink PoR feed for reserves now exists on Avalanche but is a transparency mirror only (not consumed by Ethereum reUSD logic), so reserve assurance still rests on the offchain AUP + direct onchain audit.
- **Liquidity mismatch**: reUSD represents liquid onchain tokens partially backed by offchain reinsurance capital. Capital release is reevaluated quarterly, and programs are short-duration and cat-light (per performance memo). The instant redemption vault holds no USDC (sUSDe only — ~$12.71M in vault, ~$52.95M in Redemption Reserves Custodian). In a bank-run scenario, sUSDe redemption liquidity plus only ~$14.96M in DEX liquidity would need to absorb exits for ~$181.8M in outstanding tokens; windowed queue handles the remainder.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** -- Audited by Hacken (3 public reports, including NAV Oracle) and Certora with formal verification (Sep 2025). 4 public smart-contract audit reports. **PASS**
- [ ] **Unverifiable reserves** -- Offchain reserves attested by The Network Firm and now published onchain via a **live Chainlink Proof-of-Reserve feed on Avalanche** ("Re Offchain Reserves," verified June 2026; see appendix). Onchain buffer is fully verifiable. **CONDITIONAL PASS** -- hybrid onchain/offchain model: the PoR feed is a real transparency improvement, but it transports the same TNF attestation (not an independent verifier), is labeled "non-value-securing," and is not consumed by reUSD's Ethereum pricing/redemption logic.
- [x] **Total centralization** -- MPC wallets with role separation (3-of-5 and 5-of-8). 48-hour upgrade timelock. Not a single EOA. **PASS**

**All gates conditionally pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 2 smart-contract audit firms (Hacken, Certora), 4 public smart-contract audit reports. Certora audit (Sep 2025) included formal verification and found 13 issues (all fixed). Hacken conducted 3 audits (Sep 2024, Dec 2024, Apr 2025 NAV oracle). The Network Firm performed AUP on offchain reserve/custody verification (Oct 2025), which is due diligence rather than a smart-contract audit.
- **Bug Bounty**: No Immunefi or comparable bug bounty program found.
- **Time in Production**: reUSD token ~10 months in production (inception June 2025). Re Protocol company since 2022.
- **TVL**: ~$181.8M market cap, ~$272.2M TVL (DeFi Llama, Jun 21, 2026; includes reUSDe and Re Capital).
- **Incidents**: None reported for Re Protocol.

**Score: 2.5/5** -- Four public smart-contract audits across Hacken and Certora is solid coverage. Certora formal verification and a dedicated NAV oracle audit strengthen confidence. The Network Firm AUP adds offchain verification assurance, but should not be counted as a smart-contract audit. No bug bounty program remains a notable gap. ~13 months in production with no incidents and TVL >$250M.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- Onchain governance root: a 3-of-5 Safe multisig holds `DEFAULT_ADMIN` on reUSD/ICL/NAVConsumer and `PROPOSER/CANCELLER` on the Timelock; 48-hour timelock on UUPS proxy upgrades (`getMinDelay = 172800`) and custodian changes — onchain-verified.
- Per-function admin EOAs (Oracle, Redemptions, Access) described by docs as MPC; the MPC signer quorum is offchain and cannot be independently verified; signers not publicly identified.
- **Governance improvements (Jun 2026; all verified onchain via `hasRole`/`owner()` on Jun 21, 2026)**: `PRICE_SETTER_ROLE` on `SharePriceCalculator` is now held only by `NAVConsumer` (EOA `0x6C15B25E` revoked). `NAVConsumer`'s `DEFAULT_ADMIN` moved to Governance Safe; `EMERGENCY_UPDATER_ROLE` revoked from the former EOA (no holder observed). `CUSTODIAN_MANAGER_ROLE` on ICL moved to Timelock Controller (48h-gated). `UPGRADER_ROLE` on reUSD and ICL moved from the Safe to the Timelock. `ShareTokenMinterBurner` and `ReMintBurnAdapter` ownership moved to Governance Safe. `MINTER_ROLE` holders reduced from 3 to 2. These materially reduce the *default* price-path attack surface from the prior assessment.
- **Reversibility (verified onchain)**: the role admins for `PRICE_SETTER_ROLE` and `MINTER_ROLE` (the `SharePriceCalculator`'s and reUSD's `DEFAULT_ADMIN`) are the **Governance Safe (3-of-5), not the Timelock**. The Safe can re-grant either role to an EOA without a 48h delay, and (as the report already notes) `DEFAULT_ADMIN` on ICL likewise lets the Safe re-grant `CUSTODIAN_MANAGER_ROLE`. The improvements reduce the default attack surface but are not structurally irreversible.
- KYC required for all deposits and protocol redemptions (enforced onchain).

**Governance Score: 3.5** -- Safe-backed Timelock and 48h delay are positive. Governance improvements (all verified onchain) materially reduce the *default* attack surface: the EOA bypass of the NAV Oracle is closed, custodian management is timelock-gated, and OFT adapter ownership is with the multisig. This is tempered because the role admins for the price-write and mint paths are the 3-of-5 Governance Safe (not the Timelock), so `PRICE_SETTER_ROLE` and `MINTER_ROLE` can be re-granted without a 48h delay — the fixes are current-state, not structurally irreversible. Remaining concerns: (a) offchain-only MPC admin EOAs with unverifiable N-of-M quorums, (b) no onchain governance / DAO, and (c) KYC-gated access. The largest fund-loss vector — the reserve-custody EOAs — is unchanged (captured under Collateralization).

**Subcategory B: Programmability**

- reUSD price: Written onchain by a Chainlink-Functions-driven `NAVConsumer` with a 10% deviation cap (`maxDeviationBps = 1000`). NAV computation itself runs offchain in the Chainlink DON. The EOA bypass has been closed — `PRICE_SETTER_ROLE` is now held only by `NAVConsumer`; `EMERGENCY_UPDATER_ROLE` revoked from the former EOA (no holder observed); `DEFAULT_ADMIN` is the Governance Safe. Caveat: the `SharePriceCalculator`'s role admin is the Safe (not the Timelock), so the role can be re-granted without a timelock delay.
- Deposits: Gated by KYC Registry
- Instant redemptions: Programmatic from buffer
- Quarterly redemptions: Admin-managed process
- Capital deployment: Entirely offchain

**Programmability Score: 3.75** -- The core value-determining function (reUSD price/yield) is set by an admin-controlled oracle, not computed programmatically onchain. The EOA bypass of the NAV Oracle has been closed — the audited Chainlink-Functions path is the sole onchain price writer today, the NAVConsumer's `DEFAULT_ADMIN` is the Governance Safe, and the emergency role was revoked from the former EOA. Capital deployment is entirely offchain. The price path is not yet structurally tamper-resistant: the `SharePriceCalculator`'s role admin is the 3-of-5 Safe (not the Timelock) and can re-grant `PRICE_SETTER_ROLE` without a timelock delay.

**Subcategory C: External Dependencies**

- Chainlink: used onchain as (a) the `sUSDe/USD` price feed inside `PriceRouter` (aggregator [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099), 24h staleness, $1.18 / $2.00 price bounds), and (b) **Chainlink Functions + Automation** driving the daily NAV update through `NAVConsumer` [`0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6`](https://etherscan.io/address/0x84d4eaeb10f9e57b67622f667c6c13e22fa4b2b6) (DON `fun-ethereum-mainnet-1`, subscription `85`), and (c) a **live Chainlink Proof-of-Reserve feed** "Re Offchain Reserves" on **Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract)). The PoR feed is a standalone transparency mirror and is not consumed by reUSD's Ethereum contracts — see the Chainlink usage appendix.
- **LayerZero**: cross-chain reUSD transport via `ReMintBurnAdapter` OFT [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85). Active peers: Avalanche (eid 30106), Arbitrum (30110), Base (30184), BNB (30102). Rate limit: 2,500,000 reUSD per 24h inbound AND outbound per chain (onchain-verified).
- The Network Firm for daily attestations
- Ethena for basis-trade yield source
- Fireblocks for custody
- §114 Reinsurance Trust (offchain bank)
- Cayman-domiciled partner reinsurer (CIMA-regulated)
- SumSub / Chainalysis for KYC/AML
- Multiple blockchains for cross-chain deployment

**Dependencies Score: 4.0** -- Heavy reliance on offchain entities (trust bank, reinsurer, attestation firm, custody). Many single-point-of-failure dependencies that cannot be mitigated onchain.

**Centralization Score = (3.5 + 3.75 + 4.0) / 3 = 3.75**

**Score: 3.75/5** -- Centralization concerns are moderated by governance improvements (all verified onchain): the EOA bypass of the NAV Oracle is closed, custodial management is timelock-gated, and OFT adapter/minter-burner ownership is with the Governance Safe. These fixes are re-grantable by the 3-of-5 Safe without a timelock delay (the price-write and mint role admins are the Safe, not the Timelock). Residual concerns: offchain-only MPC admin EOAs, offchain capital deployment, KYC gating, and heavy reliance on external entities.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Onchain buffer: Verifiable, holds liquid assets for instant redemptions
- Offchain trust: §114 Trust attested by The Network Firm and mirrored onchain via a live Chainlink PoR feed on Avalanche (TNF LedgerLens source; transparency mirror, not consumed by Ethereum reUSD logic — see appendix)
- Surplus notes contractually protect principal
- reUSDe (mezzanine / second-loss) and Re Capital (first-loss reinsurer equity) provide subordinated protection for reUSD; reUSD attaches at >115% combined ratio (~0.9% modeled likelihood, Re-asserted)
- Majority of capital deployed offchain in reinsurance programs (capital release reevaluated quarterly per Re's public materials)

**Collateralization Score: 4.25** -- Hybrid onchain/offchain model. Onchain reserves verified at ~$93.66M vs ~$180.55M Ethereum NAV (~51.9% coverage all-in). One address (~$3.05M) is the **reUSDe** ICL custodian; **excluding it, reUSD-only coverage is ~50.2% — essentially at the ≥50% floor.** **Critically, ~$80.95M of the onchain reserve (~86%) sits at three plain EOAs with no onchain restriction on outflow** — a single signed tx can drain them; the 48h Timelock does not apply, and the AUP corroborates the Fireblocks address list only, not the N-of-M quorum. ~72.9% of the reserve is sUSDe (Ethena counterparty risk, 7-day cooldown); ~20.9% is USDC. No BUIDL / T-bill wrappers are held onchain; offchain reinsurance capital release relies on third-party attestation. Two factors weigh against the backing quality: reUSD-only coverage sits at the 50% floor, and the subordinated buffer protecting reUSD attaches at a 115% combined ratio (~0.9% modeled likelihood) — well short of the remote tail its structure implies. The ~$81M plain-EOA custody surface remains the dominant fund-loss vector.

**Subcategory B: Provability**

- reUSD price: Written by Chainlink-Functions `NAVConsumer` (audited, 10% deviation cap). The EOA bypass has been closed — `PRICE_SETTER_ROLE` is now held only by `NAVConsumer`.
- Onchain buffer: Fully verifiable
- Offchain reserves: Attested by The Network Firm and published onchain via a live Chainlink PoR feed on Avalanche (TNF LedgerLens source; transparency mirror, not consumed by reUSD's Ethereum logic)
- Underlying reinsurance performance: Inherently offchain, not verifiable onchain

**Provability Score: 3.75** -- Re's reserve-publication-via-Chainlink claim is substantiated: a live Chainlink Proof-of-Reserve feed ("Re Offchain Reserves") runs on Avalanche, though it is a transparency mirror of TNF's offchain attestation and is not consumed by reUSD's Ethereum pricing/redemption logic (see the Chainlink usage appendix). The EOA bypass of the share-price path has been closed — `PRICE_SETTER_ROLE` is now held only by `NAVConsumer`, `DEFAULT_ADMIN` is the Governance Safe, and `EMERGENCY_UPDATER_ROLE` was revoked from the former EOA; MINTER_ROLE holders reduced from 3 to 2. Core yield calculation, reserve attestation, and performance reporting remain offchain with no independent onchain oracle to cross-check, and the share-price/mint role grants are re-openable by the 3-of-5 Safe without a timelock delay.

**Funds Management Score = (4.25 + 3.75) / 2 = 4.0**

**Score: 4.0/5** -- Hybrid model with meaningful offchain components. Three plain EOAs hold ~86% of onchain reserves with no onchain outflow restriction (the primary concern). Reserve provability relies on offchain attestation with no independent onchain oracle (the Avalanche PoR feed is a transparency mirror, not a control). The oracle-bypass closure and MINTER_ROLE reduction lift Provability (3.75), while the reUSD-only coverage at the ~50% floor and the 115% loss-attachment weigh on Collateralization (4.25).

#### Category 4: Liquidity Risk (Weight: 15%)

- **Instant Exit**: Daily Instant Redemption Vault holds `0` USDC and sUSDe worth ~$12.71M; Redemption Reserves Custodian holds `0` USDC and sUSDe worth ~$52.95M (onchain, Jun 21, 2026). Configured `dayPayoutToken` is sUSDe. Instant redemptions via [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) settle in sUSDe under current config, subject to daily (20%) and per-wallet (10%) caps.
- **Quarterly Queue**: Pro-rata, may not be fully filled if capital locked in reinsurance
- **DEX Liquidity (Re reUSD only)**: ~$14.96M across Fluid, Curve, and Blackhole (~8.2% of ~$181.8M market cap). Largest venue: Fluid reUSD/**USDT** (~$11.62M TVL, ~$1.67M daily volume).
- **24h Volume (token-level, CoinGecko)**: ~$1.4M
- **KYC Required**: Limits universe of participants who can exit via protocol redemption
- **Onchain capital**: ICL Custodial Wallet holds ~$19.55M USDC + ~$1.79M sUSDe (Jun 21, 2026). This is not directly accessible for redemptions without admin action.
- **Multi-chain**: Available on 6+ chains, liquidity concentrated on Ethereum

**Score: 3.75/5** -- Onchain-verified DEX liquidity for Re reUSD is ~$14.96M (~8.2% of market cap), of which ~78% sits in a single Fluid reUSD/USDT pool. Instant redemptions currently pay out in sUSDe only: ~$12.71M in the daily vault and ~$52.95M in the Redemption Reserves Custodian cover ~$65.7M of sUSDe-denominated exits under 20% daily / 10% per-wallet caps. Combined with DEX depth, protocol-native exits plus DEX can absorb ~$80.7M of the ~$181.8M outstanding before falling back to the quarterly queue. Token-level 24h volume is thin (~$1.4M) and reUSD's float is contracting, thinning spot-market exit depth on top of KYC-gated redemptions, single-pool DEX concentration, and no USDC instant exits.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: CEO Karn Saroya publicly known, experienced in insurtech. Underwriting led by James Norris (CUO, 30+ yrs) and Jonathan Lim (Head of Underwriting). Core dev team from Cover (YC) and early Shopify.
- **Company**: Founded 2022, $14M seed at $100M valuation.
- **Investors**: Strong institutional investors (Electric Capital, Tribe Capital, Stratos, SiriusPoint, Exor, Defy, Framework Ventures, Morgan Creek Digital).
- **Documentation**: Comprehensive.
- **Legal Structure**: Cayman-domiciled reinsurer (CIMA-regulated), U.S. §114 Trust.
- **Incident Response**: Documented pause mechanism and recovery wallets.
- **KYC/AML**: Robust (SumSub + Chainalysis).
- **Regulatory risk**: Not available to U.S. persons. Cayman jurisdiction.

**Score: 2.5/5** -- CEO publicly identified, strong investors, comprehensive documentation, emergency mechanisms. Partially offset by limited team visibility and offshore (Cayman) jurisdiction.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.75 | 30% | 1.125 |
| Funds Management | 4.0 | 30% | 1.20 |
| Liquidity Risk | 3.75 | 15% | 0.5625 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.5125** |

**Final Score: 3.51** (3.5125 rounded). The governance improvements that lift Centralization are offset by thin reUSD-only coverage and a 115% loss-attachment (Funds Management) and contracting liquidity, holding the protocol just inside Elevated.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Elevated Risk** (score 3.5 falls in the 3.5–4.5 range). The verified governance improvements genuinely reduce centralization risk and nearly tipped reUSD into Medium, but they are re-grantable by the 3-of-5 Safe without a timelock, and the reassessment surfaced offsetting downside — reUSD-only coverage at the ~50% floor and a 115% loss-attachment. The reserve-custody EOA surface remains unchanged. The protocol sits at the very bottom of the Elevated band.

---

reUSD is a novel product that bridges DeFi capital with traditional reinsurance markets. Re reports (~$409M premiums written inception-to-date, ~35 carriers / ~600K policyholders, ~92% combined ratio per LP memo — all Re-asserted) and reUSD market cap ~$181.8M are meaningful; the capital structure (Re Capital ~$73M **first-loss** + reUSDe **mezzanine/second-loss**) puts reUSD in the senior tranche, attaching at >115% combined ratio (~0.9% modeled loss likelihood; 135% is a deeper-stress level, not the attachment). The risk profile is **Elevated Risk (3.5)** — down marginally from 3.6 in April. Governance enhancements were independently verified onchain and genuinely reduce centralization risk, but they are re-grantable by the 3-of-5 Safe without a timelock, and this reassessment surfaced offsetting downside (reUSD-only coverage at the ~50% floor; reUSD attaches at 115% / ~0.9%), so the protocol stays just inside Elevated rather than crossing into Medium. Primary concerns: (1) **custody / asset-movement surface — ~86% of onchain reserves ($80.95M of $93.66M) sit at three plain EOAs with no onchain outflow restriction; the 48h Timelock does not apply**. The AUP lists the address set but does not cryptographically verify the MPC quorum — this was and remains the single largest unmitigated risk; (2) heavy offchain capital deployment in reinsurance programs (capital release reevaluated quarterly); (3) onchain reserves are ~51.9% of NAV (~50.2% reUSD-only after excluding the reUSDe custodian per team feedback — barely above the 50% floor) with ~72.9% in sUSDe (Ethena counterparty risk, 7-day cooldown); USDC share improved to ~20.9% ($19.55M); (4) KYC-gated redemptions (enforced onchain at every redemption entrypoint); (5) reUSDe redemption works differently — quarterly-only, no instant path. **Key governance improvements since April 2026 (all verified onchain via `hasRole`/`owner()`)**: the EOA bypass of the NAV Oracle has been closed (`PRICE_SETTER_ROLE` on `SharePriceCalculator` now only `NAVConsumer`; `DEFAULT_ADMIN` moved to Governance Safe; `EMERGENCY_UPDATER_ROLE` revoked from the former EOA); `CUSTODIAN_MANAGER_ROLE` moved to 48h Timelock; `UPGRADER_ROLE` on reUSD/ICL moved to Timelock; OFT adapter/minter-burner ownership moved to Governance Safe; MINTER_ROLE holders reduced from 3 to 2. **Caveat:** the price-write and mint role admins are the 3-of-5 Governance Safe, not the Timelock, so these grants can be re-opened without a 48h delay — the improvements lower the default attack surface but are not structurally irreversible. Mitigants: Safe-3-of-5 + 48-hour Timelock on governance (onchain-verified `getMinDelay() = 172800`), 4 public smart-contract audits across Hacken/Certora including a Hacken audit of the deployed `NAVConsumer`, Chainlink Automation driving daily NAV updates, and The Network Firm's offchain AUP of the §114 Trust. **The custody surface at the reserve EOAs remains the single largest unmitigated risk.**

**Key conditions for exposure:**
- Monitor reUSD share price for any decreases (should only increase)
- Monitor The Network Firm's reserve attestation **and the live Chainlink "Re Offchain Reserves" PoR feed on Avalanche** ([`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract); see appendix) for staleness and value drops
- **Monitor instant redemption buffer — track both USDC and sUSDe balances in vault and Redemption Reserves Custodian**
- Monitor instant redemption interaction contract [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) for redemption events and limit changes
- Monitor UUPS proxy upgrades (48-hour review window)
- Track DEX liquidity depth on Fluid reUSD/USDT (~$11.62M) and Curve reUSD/sUSDe (~$1.42M) / reUSD/USDC (~$450K). (Curve reUSD/scrvUSD, reUSD/sfrxUSD, reUSD/fxUSD are Resupply reUSD, not Re — do not count toward Re liquidity.)
- Monitor for KYC policy or regulatory changes affecting redemption access
- Monitor ICL Custodial Wallet balance (~$19.55M USDC + ~$1.79M sUSDe, Jun 21, 2026) for large outflows
- Monitor `MINTER_ROLE` grants on reUSD token — currently held by ICL and `InstantRedemption` (was 3; `ShareTokenMinterBurner` revoked); any third grantee beyond these two should trigger review

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (December 2026) or sooner if instant redemption vault remains empty for >30 days
- **Governance-based**: Reassess after roles are changed, or funds are redeployed
- **Incident-based**: Reassess after any exploit, governance change, reinsurer insolvency, or material claim event
- **Liquidity-based**: Reassess if DEX liquidity drops below $5M or if instant redemption vault remains empty for >30 days
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
│  │  DEFAULT_ADMIN on reUSD/ICL/NAVConsumer;    │                    │
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
  User ──USDC──► ICL (KYC gate) ──mint──► reUSD Token
  ICL ──sweep──► Custodial Wallet ──deploy──► §114 Trust (offchain)
  §114 Trust ──surplus notes──► ICL (principal + yield guarantee)
  Chainlink Functions (offchain NAV) ──► NAVConsumer ──► setSharePrice on Share Price Calc ──► reUSD price
  (EOA PRICE_SETTER_ROLE revoked Jun 2026; only NAVConsumer writes. SharePriceCalculator DEFAULT_ADMIN = Governance Safe, so the role is re-grantable by the 3-of-5 without timelock.)
  Network Firm (LedgerLens) ──► Chainlink PoR feed "Re Offchain Reserves" (Avalanche; transparency mirror, not consumed by Ethereum reUSD logic)
  Chainlink sUSDe/USD ──► SimpleOracle ──► PriceRouter (sUSDe leg only)

Trust Boundaries:
  ⚠ Onchain/offchain boundary at ICL Custodial Wallet sweep
  ⚠ Share price path secured: PRICE_SETTER_ROLE now only NAVConsumer (EOA bypass closed)
  ⚠ Redemption Reserves Custodian (0x9eA3..ADF8) is an EOA
  ⚠ MINTER_ROLE held by TWO contracts on reUSD (ICL, InstantRedemption; ShareTokenMinterBurner revoked)
  ⚠ KYC Registry gates all deposits and protocol redemptions
```

---

## Appendix: Chainlink usage by Re Protocol — what is real vs what is marketing

_Verified June 2026._

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
4. **Chainlink Proof-of-Reserve — "Re Offchain Reserves"** ([proxy `0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract) → `AccessControlledOCR2Aggregator 1.0.0` [`0x2c04457B…E7d7`], **Avalanche**). Listed in Chainlink's reference directory (`feeds-avalanche-mainnet.json`) under path `re-reserves`, `productType: "Proof of Reserve"`, category `custom`. `decimals() = 8`; `latestRoundData()` returned ~**$176.8M** updated **2026-06-17 00:06 UTC**; backed by **16 OCR2 transmitters**. Data source: **The Network Firm's LedgerLens™ On-Chain Proof of Reserves API**. Chainlink's listing marks it **"non-value-securing"** and includes a disclaimer that neither TNF nor Chainlink attests to the accuracy of the balance data. ([data.chain.link](https://data.chain.link/feeds/avalanche/mainnet/re-reserves))

So Re's claim *"A JSON price feed is pushed on-chain via Chainlink"* is correct in a loose sense: the NAV is produced by Chainlink Functions and pushed by Chainlink Automation, even though it's not a classic Chainlink "price feed aggregator". The NAV Oracle code was audited by Hacken in Apr 2025 (repo `github.com/resilience-foundation/nav-oracle`).

**The "Proof-of-Reserves, publicly auditable" claim — substantiated on Avalanche, with caveats:**

1. **The PoR feed exists and is live.** "Re Offchain Reserves" is in Chainlink's reference directory on **Avalanche** (`feeds-avalanche-mainnet.json`, path `re-reserves`, `productType: "Proof of Reserve"`) and resolves onchain to a working `AccessControlledOCR2Aggregator`. Note it is on Avalanche only — the Ethereum directory (`feeds-mainnet.json`) does not list it.
2. **It is not consumed onchain by Re's Ethereum contracts.** `InsuranceCapitalLayer`, `ShareToken`, `SharePriceCalculator`, `PriceRouter`, `SharePriceOracle`, and the Redemption contracts make no `latestRoundData` call against this (or any) reserves feed. The PoR feed is a **standalone transparency publication on a different chain**, not an input to reUSD pricing, minting, or redemption. So it improves *auditability*, not onchain *enforcement*.
3. **Its data source is the same offchain attestor.** The feed is fed by **The Network Firm's LedgerLens™ API**, so it transports TNF's offchain attestation onto Chainlink's signed OCR2 infrastructure — it is not an independent second verifier, and Chainlink explicitly disclaims attesting to the accuracy of the underlying balances ("non-value-securing").
4. **It reports "Re Offchain Reserves" generically (~$176.8M), not a reUSD-only figure**, and covers offchain trust balances — distinct from the onchain reUSD reserves (~$90.61M reUSD-only / ~$93.66M all-in, Jun 21, 2026) this report audits directly.

**Bottom line:**

- "JSON price feed pushed via Chainlink" → **true** (Functions + Automation, verified onchain, Ethereum).
- "Published via Chainlink oracle (for offchain bank balances)" → **true** — a Chainlink PoR feed for Re's offchain reserves is live on Avalanche (TNF LedgerLens source).
- "Proof-of-reserves, publicly auditable" → **substantially true, with caveats**: there is now a Chainlink-signed reserves feed, but it (a) mirrors TNF's offchain attestation rather than independently verifying reserves, (b) is labeled non-value-securing with an accuracy disclaimer, and (c) is not consumed by reUSD's Ethereum logic. Reserve assurance therefore rests on (i) direct onchain balance audit of the ICL/vault/custodian addresses, (ii) The Network Firm's attestation, now also (iii) Chainlink-published on Avalanche.

**Action:** the Chainlink PoR feed is real and monitorable (`latestRoundData()` on [`0xc79a363a…2f607`](https://snowscan.xyz/address/0xc79a363a3f849d8b3F6A1932f748eA9d4fB2f607#readContract), Avalanche). When Re cites "Chainlink proof-of-reserves," treat it as a transparency mirror of TNF's attestation on Avalanche — not as an independent onchain control that gates reUSD value on Ethereum. Verify the feed's heartbeat and value rather than assuming it enforces anything.
