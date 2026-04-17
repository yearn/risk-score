# Protocol Risk Assessment: Re Protocol reUSD

- **Assessment Date:** April 17, 2026
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

The chosen "Applicable APY" is converted to a daily rate, and reUSD's **token price** (not quantity) increases daily. Current APY is approximately 6-9+%.

**Onchain price mechanism (verified Apr 17, 2026):** The reUSD price is NOT sourced from a Chainlink aggregator. It is stored in the `SharePriceCalculator` contract at [`0xd1D104a7515989ac82F1AFDa15a23650411b05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8) and updated by an EOA holding `PRICE_SETTER_ROLE` via `setSharePrice(uint256)`. The deployed implementation contains **no onchain guardrail** (only `newPrice != 0` is checked):

```solidity
function setSharePrice(uint256 newPrice) external onlyRole(PRICE_SETTER_ROLE) {
    if (newPrice == 0) revert InvalidPrice();
    sharePrice = newPrice;
    emit SharePriceSet(oldPrice, newPrice);
}
```

Any "daily oracle guardrail" (e.g. 25 bps max daily change) described in protocol docs is therefore enforced **offchain by the setter**, not by the deployed contract. A downstream `PriceRouter` [`0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66`](https://etherscan.io/address/0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66) wraps the calculator via a `SharePriceOracle` at [`0x0764BFa862164D28799F31e7e1e7206F5177B6bB`](https://etherscan.io/address/0x0764BFa862164D28799F31e7e1e7206F5177B6bB). The same router feeds sUSDe pricing via a `SimpleOracle` wrapper [`0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D`](https://etherscan.io/address/0xb6aD3633cB3FAfed3D375d8c64240f122E19fB4D) around Chainlink's `sUSDe/USD` feed [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099) — so Chainlink is used for the sUSDe leg only, not for reUSD's own share price. No Chainlink Proof-of-Reserve feed is consumed onchain by Re's deployed contracts; any "Chainlink PoR" described in docs is offchain publishing only.

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
- The price is stored onchain in the Share Price Calculator and updated by the `PRICE_SETTER_ROLE` holder (EOA) via `setSharePrice(uint256)`. The contract performs no deviation check beyond `newPrice != 0` (verified onchain, see Overview). The "daily 25 bps guardrail" cited in protocol docs is **offchain** (enforced by the setter), not an onchain invariant — flagged as a centralization/trust concern in scoring.
- The Network Firm performs daily offchain attestations. **No Chainlink PoR feed is consumed onchain by Re's contracts** — the deployed `PriceRouter` uses a custom `SharePriceOracle` that reads the Share Price Calculator directly. Chainlink PoR publishing (if any) is external / informational (e.g. for RWA.xyz dashboards).
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

### Capital Structure: reUSDe (Junior Tranche)

reUSDe is the protocol's junior/first-loss tranche ([docs](https://docs.re.xyz/insurance-capital-layers/what-is-reusde)). It absorbs underwriting losses before they reach reUSD in exchange for a share of underwriting profits (historically 16-25% net annual returns per docs).

**Loss waterfall** (losses absorbed in order):
1. **Re Capital** (~$73M) — first-loss buffer, impaired at 105% combined ratio (3.9% likelihood)
2. **reUSDe** (junior) — impaired at 115% combined ratio (0.9% likelihood). Absorbs losses up to the 115-135% combined ratio range.
3. **reUSD** (senior) — only impaired if combined ratio exceeds **135%** (0.03% likelihood), meaning both Re Capital and all reUSDe reserves are depleted

**reUSDe mechanics:**
- Price based on quarterly-refreshed target NAV derived from actuarial reports; compounds daily but surplus realization occurs quarterly
- Idle capital earns sUSDe basis-trade yield until called for underwriting
- Redemptions are quarterly (72h window at fiscal quarter start), pro-rata if requests exceed capacity; unfilled rolls to next quarter
- If losses deplete the buffer, later reinsurance profits first restore reUSD/reUSDe capital before recapitalizing the buffer layer (per DD)
- Issued by Resilience (BVI) Ltd.; Resilience Foundation is the Agent of both reUSD and reUSDe token holders
- reUSD is currently protected by ~$86M of subordinated assets (per DD: Re Capital + reUSDe combined)

### Accessibility

- **Deposits**: KYC/AML required (via SumSub and Chainalysis). Users must pass KYC checks because a portion of protocol capital is deployed with a Cayman-regulated reinsurance company (CIMA-regulated)
- **Instant Redemption**: Available from the onchain instant liquidity buffer via `redeemInstant(uint256 shares, uint256 minPayout)` at [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) (which delegates to the `InstantRedemption` implementation at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40)). Atomic, same-block settlement. **Onchain-verified parameters** on Apr 17, 2026: `minRedemption = 0.01 reUSD` (`1e16`), `maxRedemption = 1,000,000 reUSD` (`1e24`), `dailyLimitBps = 2000` (20% of capacity), `userLimitBps = 1000` (10% per wallet), `feeBps = 6` (0.06%), `dayPayoutToken = sUSDe` (0x9D39A5DE30e57443BfF2A8307A4256c8797A3497). At the fastest drain rate, ~5 days to exhaust all liquid onchain reserves (20% per day). **Note:** the "250 reUSD minimum" previously cited in this report could not be found in the public docs (`docs.re.xyz/protocol/redemption-process-and-liquidity` mentions a "min" but gives no value) and contradicts the onchain parameter. Treat the onchain `minRedemption = 0.01 reUSD` as the authoritative floor; any `$250` figure, if it exists, is a front-end UX gate in `app.re.xyz`, not a contract-level invariant.
- **Windowed Redemption**: Once instant buffer is exhausted, the protocol opens a redemption window (minimum 24 hours). Requests fulfilled pro-rata based on available capital. Proceeds must be claimed within two months.
- **DEX Trading (Re reUSD only)**: Fluid reUSD/USDT DEX pool (~$11.62M — note: USDT, not USDC); Curve reUSD/sUSDe (~$1.42M) and reUSD/USDC (~$450K); Avalanche Blackhole reUSD/USDC pools (~$1.47M combined). **Total DEX liquidity ~$14.96M on Apr 17, 2026** (DeFi Llama yields API, filtered by underlying token `0x5086…0c72` / `0x180aF87b…625Bf`). Larger pools labelled "reUSD/scrvUSD", "reUSD/sfrxUSD", "reUSD/fxUSD", "reUSD/sDOLA" on Curve/Convex/Stake-DAO/Beefy are **Resupply Protocol's reUSD** (`0x57aB1E00…`) and are NOT Re reUSD exits.
- **Not available to U.S. persons**
- **Fees**: Redemption fee of `6 bps` (0.06%) — **onchain-verified** via `InstantRedemption.feeBps() = 6` at [`0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40`](https://etherscan.io/address/0xa31DeeBB3680A3007120e74bcBdf4dF36F042a40) ([docs](https://docs.re.xyz/insurance-capital-layers/what-is-reusd)). No documented deposit fees, management fees, or performance fees. RWA.xyz reports 0.18% subscription and 0.18% redemption fees — discrepancy with docs may reflect different fee tiers or methodology. Onchain data shows ~$1,535 total deposit fees collected historically, suggesting a small deposit fee mechanism exists in the contracts (also flagged in Hacken audit finding F-2024-5214 "Unclaimed Deposit Fees Unaccounted For").

### Collateralization

- **Onchain reserve target**: >=50% of deposits kept in onchain backing (USDC, sUSDe, and potentially T-bill wrappers such as BUIDL), per DD questionnaire
- **Onchain buffer**: Instant redemption vault and Redemption Reserves Custodian hold liquid assets (USDC and sUSDe) for immediate redemptions
- **Offchain trust**: §114 Reinsurance Trust holds cash and T-Bills in NAIC-compliant banks (including Coinbase, Wells Fargo), attested daily by The Network Firm and published via Chainlink
- **Surplus Note protection**: Surplus notes rank junior to policyholders but contractually protect depositor principal
- **Re Capital buffer**: ~$73M subordinated first-loss layer ahead of reUSDe and reUSD
- **reUSDe as backstop**: reUSDe (the risk-bearing token) absorbs first-loss risk across the reinsurance portfolio, providing a backstop to prevent losses reaching reUSD holders. Stress testing shows reUSD loss likelihood = 0.03% at 135% combined ratio

### Provability

- **reUSD price**: Written directly onchain via `setSharePrice(uint256)` by an EOA holding `PRICE_SETTER_ROLE`. **Not computed programmatically onchain** — price is derived offchain (Network Firm attestation) and pushed in by the setter; the contract has no deviation cap. Downstream `PriceRouter` [`0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66`](https://etherscan.io/address/0xFe76cF5eD606593fB7764f33627B8D7E0f9Fab66) exposes this value to dependent contracts.
- **Onchain reserves**: Visible onchain via the ICL contract and Redemption Reserves Custodian
- **Offchain reserves**: Attested daily by The Network Firm (third-party accountant with read-only access) and published via Chainlink Proof of Reserve
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

- **reUSD price**: **NOT programmatic**. Set by an EOA (`PRICE_SETTER_ROLE` holder) via `setSharePrice(uint256)` on the Share Price Calculator. Offchain yield calculation (risk-free rate or Ethena basis yield + 250 bps) is asserted by The Network Firm. **No Chainlink PoR feed is consumed onchain by Re's contracts** — Chainlink is used only for the sUSDe leg of the PriceRouter. **The deployed `setSharePrice` has no onchain guardrail** — only `newPrice != 0` is enforced; any 25 bps daily cap is an offchain convention.
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
  - Monitor reUSD price changes daily. Current: ~$1.072 (onchain `getSharePrice()` = `1072426668551449984`, Apr 17, 2026).
  - **Alert**: If price **decreases** (should only ever increase under normal operation).
  - **Alert**: If price growth **stops** for >48 hours (indicates oracle feed interruption or yield issue).
  - **Alert**: If single-day price change exceeds any offchain guardrail threshold (reminder: `setSharePrice` has **no onchain guardrail**, so monitoring must enforce this).
  - **Alert**: Any new member granted `PRICE_SETTER_ROLE` on the Share Price Calculator.

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
| Instant redemption interaction events | Every 6 hours | High |
| The Network Firm offchain attestation publication | Daily | High |
| DEX pool TVL/balance (Fluid reUSD/USDT + Curve) | Hourly | Medium |
| Total supply changes (Ethereum + cross-chain) | Daily | Medium |

## Risk Summary

### Key Strengths

- **Principal protection with deep capital structure**: reUSD is the senior tranche with 0.03% modeled loss likelihood at 135% combined ratio. Re Capital (~$73M) and reUSDe provide subordinated first-loss protection.
- **Strong underwriting track record (per LP memo / intro deck, not independently verifiable)**: ~92% combined ratio across 3 consecutive years (2022-2024), outperforming industry average (93-95%). No capital impairment or reserve deterioration. $178M gross written premium. Third-party sources consulted: LlamaRisk (no published report on reUSD as of Apr 17, 2026) and Steakhouse (no archived review); no independent re-statement of these ratios was found. Treat as management-asserted until an external attestation (beyond The Network Firm AUP, which covers reserve accounting rather than combined ratios) is published.
- **Third-party reserve verification**: The Network Firm provides daily independent attestation of offchain reserves, published via Chainlink Proof of Reserve. AUP report published.
- **Regulatory framework**: Partner reinsurer is CIMA-regulated. Capital held in §114 Reinsurance Trust at NAIC-compliant banks (Coinbase, Wells Fargo).
- **Comprehensive audit coverage**: 5+ audits across 3 firms (Hacken, Certora, The Network Firm), including formal verification and dedicated NAV oracle audit.
- **Role-separated MPC controls**: Multiple MPC wallets with distinct roles (oracle, redemptions, access, custodian) rather than a single admin key. 48-hour timelock on upgrades.
- **Emergency mechanisms**: Pause functionality, designated recovery wallets, ChainAnalysis runtime monitoring.

### Key Risks

- **Offchain price setter with no onchain guardrail**: reUSD price is set via direct `setSharePrice(uint256)` by an EOA with `PRICE_SETTER_ROLE`. The deployed Share Price Calculator enforces only `newPrice != 0`; any "25 bps daily max" mentioned in docs is an offchain convention, not an onchain invariant. A compromised setter can instantly write an arbitrary positive price. This is a fundamental centralization risk.
- **Significant offchain capital deployment**: Majority of assets are deployed offchain into §114 Trust and reinsurance programs. This introduces counterparty risk with the trust bank, partner reinsurer, and custodians that cannot be verified fully onchain.
- **Instant redemption vault holds no USDC**: The Daily Instant Redemption Vault holds `0` USDC + `6.188M` sUSDe. The Redemption Reserves Custodian (EOA) holds `0` USDC + `53.263M` sUSDe. `dayPayoutToken` is sUSDe — USDC-denominated instant exits are unavailable under the current config.
- **Three MINTER_ROLE holders on reUSD**: Beyond the ICL, `InstantRedemption` and `ShareTokenMinterBurner` also hold MINTER_ROLE. The ICL path enforces backing via `safeTransferFrom`. `InstantRedemption` uses the role for burns during redemption. `ShareTokenMinterBurner` is a LayerZero OFT wrapper — its mint path has no backing check by design (supply is conserved cross-chain), but the OFT adapter [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85) and the wrapper are both owned by the **same EOA** [`0x6C15B25E9750Dccb698C1a4023f34015bFe57649`](https://etherscan.io/address/0x6C15B25E9750Dccb698C1a4023f34015bFe57649) (not a multisig). Compromise of that key would let an attacker repoint the adapter and mint up to `2,500,000 reUSD / 24h / peer` (onchain rate limit) on Ethereum without backing.
- **DEX liquidity thin and concentrated**: ~$14.96M across Fluid, Curve, and Blackhole (~8.0% of ~$186.7M market cap), with Fluid reUSD/USDT alone providing ~78% of depth. A disruption at Fluid would leave very little remaining DEX liquidity. (Previously-cited "~$26.2M" figure included Resupply reUSD pools, a different token.)
- **KYC gating**: All deposits and redemptions require KYC. This limits the universe of users who can exit and creates regulatory/jurisdictional risk.
- **Quarterly redemption queue**: Once instant buffer is exhausted, redemptions are windowed and pro-rata. Capital release from reinsurance programs is reevaluated quarterly (per DD).
- **Reinsurance tail risk**: Underlying assets are exposed to insurance claim risk. reUSD is only impaired if the portfolio combined ratio exceeds 135%, after both Re Capital (~$73M) and all reUSDe reserves are depleted. reUSDe covers losses in the 115-135% combined ratio range. Re's historical combined ratio is ~92% and the portfolio avoids catastrophe lines, but tail risk from extreme loss events remains.
- **No bug bounty program found**: No Immunefi or comparable bug bounty program identified.

### Critical Risks

- **Offchain dependency concentration**: The protocol's value proposition depends on offchain entities (Cayman reinsurer, §114 Trust, The Network Firm, Fireblocks) operating honestly and solvent. Onchain verification cannot fully cover offchain risks.
- **Oracle/setter manipulation**: A compromised `PRICE_SETTER_ROLE` holder can write any positive `sharePrice`, since the deployed contract has no onchain deviation cap. The only mitigations are offchain — the setter's internal policy and offchain monitoring. A compromised Chainlink PoR feed could similarly misrepresent reserve attestations.
- **Liquidity mismatch**: reUSD represents liquid onchain tokens partially backed by offchain reinsurance capital. Capital release is reevaluated quarterly, and programs are short-duration and cat-light (per performance memo). The instant redemption vault holds no USDC (sUSDe only — `6.188M` in vault, `53.263M` in Redemption Reserves Custodian). In a bank-run scenario, sUSDe redemption liquidity plus only ~$14.96M in DEX liquidity would need to absorb exits for ~$186.7M in outstanding tokens; windowed queue handles the remainder.

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
- **TVL**: ~$186.7M market cap, ~$198.1M TVL (DeFi Llama, Apr 17, 2026).
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

- reUSD price: **Offchain setter** (`setSharePrice` by EOA). Not programmatically computed onchain and the contract enforces no deviation cap.
- Deposits: Gated by KYC Registry
- Instant redemptions: Programmatic from buffer
- Quarterly redemptions: Admin-managed process
- Capital deployment: Entirely offchain

**Programmability Score: 4.0** -- The core value-determining function (reUSD price/yield) is set by an admin-controlled oracle, not computed programmatically onchain. This is a significant centralization concern. Capital deployment is entirely offchain.

**Subcategory C: External Dependencies**

- Chainlink: used onchain only for the sUSDe/USD leg of the `PriceRouter` (feed [`0xFF3BC18cCBd5999CE63E788A1c250a88626aD099`](https://etherscan.io/address/0xFF3BC18cCBd5999CE63E788A1c250a88626aD099), 24h staleness, min $1.18 / max $2.00 price bounds). Not used onchain for reUSD share price; no Chainlink PoR feed is consumed onchain.
- **LayerZero**: cross-chain reUSD transport via `ReMintBurnAdapter` OFT [`0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85`](https://etherscan.io/address/0x2BB4046022B9161f3F84Ad8E35cac1d5946e0e85). Active peers: Avalanche (eid 30106), Arbitrum (30110), Base (30184), BNB (30102). Rate limit: 2,500,000 reUSD per 24h inbound AND outbound per chain (onchain-verified).
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

- reUSD price: Set by admin EOA via direct `setSharePrice`; no deviation cap onchain
- Onchain buffer: Fully verifiable
- Offchain reserves: Attested daily by The Network Firm via Chainlink PoR
- Underlying reinsurance performance: Inherently offchain, not verifiable onchain

**Provability Score: 3.5** -- Third-party attestation (The Network Firm + Chainlink) is better than pure self-reporting but still relies on trust in offchain entities. Core yield calculation is offchain.

**Funds Management Score = (3.5 + 3.5) / 2 = 3.5**

**Score: 3.5/5** -- Hybrid model with meaningful offchain components. Third-party attestation provides some assurance but cannot match fully onchain provability.

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
| Centralization & Control | 3.8 | 30% | 1.14 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.34** |

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

reUSD is a novel product that bridges DeFi capital with traditional reinsurance markets. The protocol demonstrates real business traction ($178M gross written premium, ~$186.7M market cap, ~92% combined ratio across 3 years per LP memo) with a deep capital structure (Re Capital ~$73M + reUSDe first-loss). The risk profile is moderate. The primary concerns are: (1) the offchain price setter with **no onchain guardrail** — reUSD's price is updated by an EOA via direct `setSharePrice` on a contract that only checks `newPrice != 0`; (2) heavy offchain capital deployment in reinsurance programs (capital release reevaluated quarterly); (3) the instant redemption vault holds no USDC (sUSDe-denominated exits available via ~6.188M sUSDe in vault + ~53.263M sUSDe in Redemption Reserves Custodian); (4) KYC-gated redemptions creating friction for exits; and (5) **three MINTER_ROLE holders** on the reUSD token (ICL, InstantRedemption, ShareTokenMinterBurner) vs. the single-minter claim previously made — the ICL path enforces backing, the other two need independent review. DEX liquidity has improved significantly to ~$26.2M across Fluid and Curve (up from ~$450K), providing a viable secondary exit. These risks are partially mitigated by third-party reserve attestation (The Network Firm + Chainlink PoR), 5+ audits including formal verification, role separation via a 3-of-5 Safe governance, 48-hour upgrade timelock (onchain-verified `getMinDelay() = 172800`), and the regulatory framework (CIMA-regulated reinsurer, §114 Trust at NAIC-compliant banks).

**Key conditions for exposure:**
- Monitor reUSD share price for any decreases (should only increase)
- Monitor Chainlink PoR attestation for daily updates
- **Monitor instant redemption buffer — track both USDC and sUSDe balances in vault and Redemption Reserves Custodian**
- Monitor instant redemption interaction contract [`0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e`](https://etherscan.io/address/0x8aEb9453EF22Cb38abC7a3Af9c208F65C1BfE31e) for redemption events and limit changes
- Monitor UUPS proxy upgrades (48-hour review window)
- Track DEX liquidity depth across Fluid (reUSD/USDC) and Curve pools (reUSD/scrvUSD, sfrxUSD/reUSD, reUSD/sUSDe, reUSD/USDC)
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
│  └──────┬───────┘    (no onchain guardrail — only newPrice != 0)   │
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
