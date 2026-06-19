# Protocol Risk Assessment: Midas mGLOBAL

- **Assessment Date:** June 17, 2026
- **Token:** mGLOBAL
- **Chain:** Ethereum
- **Token Address:** [`0x7433806912Eae67919e66aea853d46Fa0aef98A8`](https://etherscan.io/token/0x7433806912Eae67919e66aea853d46Fa0aef98A8)
- **Final Score: 3.51/5.0**

## Overview + Links

mGLOBAL is a tokenized certificate (Liquid Yield Token / LYT) issued by Midas Software GmbH, a German-incorporated tokenization platform. It references the performance of **stablecoin-focused strategies** managed by [Fasanara Capital](https://www.fasanara.com/), a London-based asset management firm. Unlike mHYPER (a floating-NAV growth token), mGLOBAL is a **stable/pegged token** targeting a $1.00 price with yield auto-compounded into the token price.

The token price is maintained at ~$1.00000000 via a custom oracle (`MGlobalCustomAggregatorFeedGrowth`) updated by Midas. mGLOBAL's DepositVault and primary RedemptionVault integrate with **Aave** for idle capital management.

**Key Stats:**

- **mGLOBAL Market Cap / TVL:** ~$37.6M (June 17, 2026; total supply ~37,611,592 mGLOBAL × $1.00)
- **Total Supply:** ~37,611,592.37 mGLOBAL — 18 decimals, verified onchain via `totalSupply()` on [token contract](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8) (all on Ethereum; no cross-chain deployments active)
- **Decimals:** 18 (verified onchain, not 6 as typical for Midas tokens)
- **Token Name:** "Midas Fasanara Global" — explicitly naming Fasanara as the strategy partner
- **Holders:** 8 total holders per [Etherscan](https://etherscan.io/token/0x7433806912Eae67919e66aea853d46Fa0aef98A8), 4 real holders:
  - ⚠ **[MidasFarm / InfiniFi](https://etherscan.io/address/0x7373A7ce3C023C56Cb66747AFbdF827627D31679):** **81%** — This is [InfiniFi's](https://app.infinifi.xyz/) MidasFarm contract, representing InfiniFi depositor funds. **The farm matured June 15, 2026** (yesterday as of this writing) — the position can be redeemed at any time. Per the [InfiniFi report](https://github.com/yearn/risk-score/blob/master/reports/report/infinifi.md), this is a $30.60M position (37% of InfiniFi's total deployed assets), InfiniFi's second-highest risk farm. If InfiniFi redeems, mGLOBAL market cap drops from ~$37.6M to ~$7M overnight
  - **[EOA](https://etherscan.io/address/0x882C825405fBBE45DCc1ad52b639aFbC4592EDb7):** **10.46%** (~$3.9M) — single institutional holder
  - **[Gnosis Safe](https://etherscan.io/address/0xaB05c0DB9D26e96A9dcEDCAFCA23341316F6fe6F):** **6%** (~$2.3M) — 3/4 multisig (likely treasury)
  - **[BeaconProxy](https://etherscan.io/address/0xD36f095556d5717fd9231a2091e8e98bEb7cB621):** **2.3%** (~$870K) — proxy contract
- **Creation:** [Block 24798265](https://etherscan.io/tx/0xacc1f08c1f1ea036fa35444b67328ae3d3098d6cbbc520eacc81116156eb7772) (April 3, 2026, ~10 weeks in production)
- **Midas Platform TVL:** ~$109.5M per [DeFiLlama](https://defillama.com/protocol/midas-rwa) (June 17, 2026)
- **KYC Required:** Yes (greenlist enforced onchain — confirmed via GREENLISTED_ROLE / GREENLIST_OPERATOR_ROLE)

**Links:**

- [Midas Documentation](https://docs.midas.app/)
- [Midas App](https://midas.app/)
- [Fasanara Capital Website](https://www.fasanara.com/)
- [Midas Audits](https://docs.midas.app/resources/audits)
- [DeFiLlama - Midas RWA](https://defillama.com/protocol/midas-rwa)

## Contract Addresses

All contracts use OpenZeppelin's `TransparentUpgradeableProxy` pattern with a shared `ProxyAdmin` at [`0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC).

### mGLOBAL-Specific Contracts

| Contract | Proxy Address | Implementation Address |
|----------|--------------|----------------------|
| **mGLOBAL Token** | [`0x7433806912Eae67919e66aea853d46Fa0aef98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8) | [`0xd22be883b7194ac2d1751bf8e6e4962d87f2f75a`](https://etherscan.io/address/0xd22be883b7194ac2d1751bf8e6e4962d87f2f75a) |
| **mGLOBAL/USD Oracle** (MGlobalCustomAggregatorFeedGrowth) | [`0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38`](https://etherscan.io/address/0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38) | [`0x96ac55e782b9ee3f1dd72b3ba033352b5af95e49`](https://etherscan.io/address/0x96ac55e782b9ee3f1dd72b3ba033352b5af95e49) |
| **mGLOBAL/USD PriceRaised Feed** | [`0x494f142c35167cfbdd3887e8d7897822e63c9618`](https://etherscan.io/address/0x494f142c35167cfbdd3887e8d7897822e63c9618) | N/A (CustomAggregatorV3CompatibleFeedAdjusted) |
| **mGLOBAL/USD PriceLowered Feed** | [`0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f`](https://etherscan.io/address/0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f) | N/A (CustomAggregatorV3CompatibleFeedAdjusted) |
| **MGlobalDataFeed Implementation** | N/A | [`0x94cd5b8904c1f1426f9408ee5c98b789c6a864c6`](https://etherscan.io/address/0x94cd5b8904c1f1426f9408ee5c98b789c6a864c6) |
| **DataFeed Proxy 1** | [`0x58476f452df10e6bf17dc1fee418e98de9e14868`](https://etherscan.io/address/0x58476f452df10e6bf17dc1fee418e98de9e14868) | [`0x94cd5b8904c1f1426f9408ee5c98b789c6a864c6`](https://etherscan.io/address/0x94cd5b8904c1f1426f9408ee5c98b789c6a864c6) |
| **DataFeed Proxy 2** | [`0xb468a6f63868cb6c6d99105edfbe73d6b21f139e`](https://etherscan.io/address/0xb468a6f63868cb6c6d99105edfbe73d6b21f139e) | [`0x94cd5b8904c1f1426f9408ee5c98b789c6a864c6`](https://etherscan.io/address/0x94cd5b8904c1f1426f9408ee5c98b789c6a864c6) |
| **DepositVault** (MGlobalDepositVaultWithAave) | [`0xce29c36c6d4556f2d01d79414c1354b968dddef1`](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1) | [`0x08e4432f84e660235821c63764fb2ffcc7e2b477`](https://etherscan.io/address/0x08e4432f84e660235821c63764fb2ffcc7e2b477) |
| **RedemptionVaultWithAave** | [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) | [`0xf687e76e3d62d62fe6f6a7f66ce9fae21df6438d`](https://etherscan.io/address/0xf687e76e3d62d62fe6f6a7f66ce9fae21df6438d) |
| **RedemptionVaultWithSwapper** | [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) | [`0xe98a4fb7a2e87ad888ccef0587dc820cf1a7cabb`](https://etherscan.io/address/0xe98a4fb7a2e87ad888ccef0587dc820cf1a7cabb) |
| **OFT Adapter** (MidasLzMintBurnOFTAdapter) | [`0xb67f81069e890a1b3e02c7bed3a9f78ba54a445c`](https://etherscan.io/address/0xb67f81069e890a1b3e02c7bed3a9f78ba54a445c) | N/A |

### Shared Infrastructure (shared with all Midas products)

| Contract | Address |
|----------|---------|
| **MidasAccessControl** | [`0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B`](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B) |
| **ProxyAdmin** (shared) | [`0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC) |
| **Timelock** (MidasTimelockController) | [`0xE3EEe3e0D2398799C884a47FC40C029C8e241852`](https://etherscan.io/address/0xE3EEe3e0D2398799C884a47FC40C029C8e241852) |
| **Admin Gnosis Safe** | [`0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89`](https://etherscan.io/address/0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89) |
| **Deployer** | [`0xf377e2aa453be3accd5e0350243965c98bb7149a`](https://etherscan.io/address/0xf377e2aa453be3accd5e0350243965c98bb7149a) |

### Attestation Engine (shared with all Midas products)

| Contract | Address |
|----------|---------|
| **KeystoneForwarder** | [`0x0b93082D9b3C7C97fAcd250082899BAcf3af3885`](https://etherscan.io/address/0x0b93082D9b3C7C97fAcd250082899BAcf3af3885) |
| **SaveCreReceiverProxy** | [`0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6`](https://etherscan.io/address/0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6) |
| **MidasSaveRegistryWithClaim** | [`0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d`](https://etherscan.io/address/0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d) |

## Audits and Due Diligence Disclosures

**Shared Audit History (Midas Core Contracts):**

- [Midas Audits](https://docs.midas.app/resources/audits)
- [Hacken Audit Report (Dec 2023)](https://hacken.io/audits/midas/sca-midas-vault-dec2023/)
- [Sherlock Audit Contest #1 (May 2024)](https://audits.sherlock.xyz/contests/332)
- [Sherlock Audit Contest #2 (Aug 2024)](https://github.com/sherlock-audit/2024-08-midas-minter-redeemer-judging)
- Côme Core Contracts (2024, 2025)
- Sherlock Core Contracts Contest (2025)

**Audit Status:** Extensive — 10 audits across 2023–2025 cover Midas core contracts. mGLOBAL is an implementation/variant of these audited contracts, though the Aave-integrated vaults and custom growth oracle are new patterns relative to prior audit scopes.

**Hacken Audit Results (Dec 2023):**

- Security Score: 10/10 (post-fix). 100% branch coverage
- 0 Critical, 1 High (Accepted — USD tokens with custom decimals), 2 Medium, 1 Low, 4 Observations
- **Critical note:** Auditors explicitly flagged the protocol as **"highly centralized"** with system admins controlling all critical roles

**Smart Contract Complexity:** Low-Moderate

- mGLOBAL extends the standard Midas token (ERC-20 with pausable, role-controlled mint/burn)
- Adds Aave integration for idle capital in vaults (deposits USDC into Aave)
- Uses MGlobalCustomAggregatorFeedGrowth oracle wrapping Chainlink's AggregatorV3 interface — **not** a Chainlink data feed
- Additional PriceRaised / PriceLowered bound feeds (currently without role holders)
- Access control via shared MidasAccessControl contract

### Bug Bounty

- **$1,000,000 USD** total allocated across two platforms per [Midas docs](https://docs.midas.app/security/smart-contract-security):
  - **[Sherlock Bug Bounty](https://audits.sherlock.xyz/bug-bounties/122)** — Live since March 31, 2026. Max payout: $500,000 USDC. Tiers: Critical $25K–$500K (10% of affected funds), High $5K–$25K, Medium $5K, Low $500–$1K
  - **[Cantina Bug Bounty](https://cantina.xyz/bounties/d77405e5-99ce-4ba5-846c-885820b030e1)** — Live since March 23, 2026. Max payout: $500,000. Tiers: Critical $500K, High $25K, Medium $5K, Low $1K

## Historical Track Record

- **Production History:** mGLOBAL token created on Ethereum [April 3, 2026](https://etherscan.io/tx/0xacc1f08c1f1ea036fa35444b67328ae3d3098d6cbbc520eacc81116156eb7772) (~10 weeks in production). Midas platform launched with mTBILL in mid-2024 (~22 months total)
- **TVL Growth:** Midas grew from ~$4M (July 2024) to a peak of ~$927.8M (October 27, 2025), declining to ~$109.5M (June 2026). See [DeFiLlama](https://defillama.com/protocol/midas-rwa)
- **mGLOBAL Market Cap:** ~$37.6M (June 2026), representing ~34% of Midas total TVL
- **Price History:** mGLOBAL targets $1.00. Oracle price is $1.00000000 (round 2, 8 decimals, last updated ~June 4, 2026 per [onchain data](https://etherscan.io/address/0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38)). The token has been in production for only 10 weeks; limited price history available
- **No known security incidents** for mGLOBAL or Midas platform

**Fasanara Capital Track Record:**

- **Fasanara Capital Ltd** — institutional asset manager headquartered at 4th Floor, 25 Argyll Street, London W1F 7TU. Founded **2011** (~15 years operating history)
- **AUM:** Crossed **$4B** in 2022 per [Fasanara website](https://www.fasanara.com/about)
- **CEO:** Francesco Filia, ex-Managing Director & EMEA Head of Mid Caps at Bank of America Merrill Lynch
- **Team:** 40+ named professionals across leadership, investment, origination, quant/technology, legal, risk, and operations ([team page](https://www.fasanara.com/team))
- **Regulatory:** Fasanara Capital Ltd is **FCA Authorised** since [12 August 2011](https://register.fca.org.uk/s/firm?id=001b000000NMar0AAD), Firm Reference Number [551020](https://register.fca.org.uk/s/firm?id=001b000000NMar0AAD), Companies House [07561210](https://find-and-update.company-information.service.gov.uk/company/07561210). Type: regulated. The firm's MiFID permissions scope is on the FCA register (specific activities/product types need manual review of the full record). Also publishes a [MIFIDPRU Disclosure](https://www.fasanara.com/) consistent with its regulatory status
- **Business:** Two main pillars — Fintech Lending (141 loan originators across 60+ countries) and Digital Assets. EU SFDR Article 8 classified funds for certain Alternative Credit sub-funds
- **Track record:** 15-year operating history. ESG initiatives (Sustainability Report 2025 published). No known regulatory actions or incidents found
- **mGLOBAL strategy:** Fasanara's specific strategy mandate for mGLOBAL (asset allocation, risk framework, leverage policy) is not publicly documented. The token name "Midas Fasanara Global" and the 92% "Unclassified" allocation suggest the strategy is primarily offchain/opaque

## Funds Management

Fasanara Capital is the strategy manager for mGLOBAL. Unlike mHYPER which uses Hyperithm for market-neutral DeFi strategies, **the specific strategy allocation, risk parameters, and target yield sources for mGLOBAL can't be fetched**. mGLOBAL integrates with **Aave** at the vault level (DepositVault and RedemptionVault both use Aave for idle capital).

- **Fund Manager:** [Fasanara Capital Ltd](https://www.fasanara.com/) (London, founded 2011, AUM $4B+) — one of Europe's largest fintech-focused asset managers
- **Strategy Allocations (per [SumCap](https://midas.sumcap.xyz/mglobal), June 16, 2026):**
  - **Unclassified: $34.64M (92.09%)** — offchain/opaque positions not attributable to specific onchain protocols
  - **Aave V3: $2.55M (6.78%)** — idle capital deployed on Aave (blue-chip DeFi)
  - **Liquidity Buffer: $426K (1.13%)** — onchain wallet liquidity
  - **Assets To be Deployed: ~$0** — fully allocated
  - **NAV:** $37.61M; **Price:** $1.0000; **APY:** 0.00% (static since May 15, 2026)
  - SumCap methodology: \"NAV is computed as the maximum between total onchain supply × most recent oracle price and NAV tracked by Delta Y across all vault allocator addresses\"
  - ⚠ **92% of mGLOBAL NAV is unclassified** — the majority of the strategy portfolio cannot be verified onchain
- **Custody:** Fordefi MPC custody with tri-party quorum per [Fordefi case study](https://web.fordefi.com/customer-stories/how-midas-brings-tokenized-investment-opportunities-on-chain-with-fordefis-defi-native-custody-2ti85) (Midas + Fasanara + independent signer)
- **Aave Integration:** The DepositVault (MGlobalDepositVaultWithAave) and RedemptionVaultWithAave suggest idle USDC is deposited into Aave for yield — a positive structural feature. SumCap confirms $2.55M is on Aave V3
- **Monitoring:** NAV updates provided by Fasanara, reviewed by Midas, then published onchain. Oracle last updated May 15, 2026 — **33+ days stale**. APY has been 0.00% since that date, suggesting no yield has been reported or accrued onchain since mid-May

### Accessibility

- **KYC Required:** Yes — users must complete KYC/AML screening. Once approved, added to onchain greenlist via `GREENLISTED_ROLE` / `GREENLIST_OPERATOR_ROLE`
- **Minting:** Deposit USDC, receive mGLOBAL tokens at oracle price ($1.00). Via `MGlobalDepositVaultWithAave`
- **Redemption:** Two paths:
  - **MGlobalRedemptionVaultWithAave:** Primary redemption vault with Aave integration for idle capital. Holds `M_GLOBAL_BURN_OPERATOR_ROLE`
  - **MGlobalRedemptionVaultWithSwapper:** Secondary redemption vault with swapper functionality. Also holds `M_GLOBAL_BURN_OPERATOR_ROLE`
- **Fees (mGLOBAL-specific):**
  - **Management fee:** 0.40% annual on AUM
  - **Performance fee:** 0% on yield
  - **Instant Minting:** 0%
  - **Instant Redemption:** 0.50%
  - This is a different fee model from mHYPER (which charges 0% management / 20% performance). mGLOBAL uses AUM-based fees with no performance cut — the 0.40% management fee is a drag on yield but predictable. The 0% performance fee means all strategy yield accrues to token holders

### Token Mint Authority

**Mint mechanism:** Role-gated AccessControl. `mint()` has NO onchain collateral check — only verifies caller has `M_GLOBAL_MINT_OPERATOR_ROLE` (`0x86c2e8326862f916bf4ee800260d2306dc3c829808f94feb79f6d3a20aaf9bc2`).

**Mint requires backing:** No — minter can issue unbacked tokens.

**Rate limits / supply caps:** None onchain.

**Backing check at mint time:** None — minter can issue unbacked tokens.

**Per-address mint authority** (verified onchain June 17, 2026, from token contract [`0x7433806912Eae67919e66aea853d46Fa0aef98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) | ✓ | ✓ | `M_GLOBAL_MINT_OPERATOR_ROLE` + `M_GLOBAL_BURN_OPERATOR_ROLE` + `M_GLOBAL_PAUSE_OPERATOR_ROLE` + `BLACKLIST_OPERATOR` + `GREENLIST_OPERATOR` | EOA, nonce 3. Per Midas pattern, claimed as Fordefi MPC (not verifiable onchain). Also holds generic BLACKLIST_OPERATOR and GREENLIST_OPERATOR roles |
| [`0xce29c36c6d4556f2d01d79414c1354b968dddef1`](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1) | ✓ | — | `M_GLOBAL_MINT_OPERATOR_ROLE` | MGlobalDepositVaultWithAave (proxy). Mints when users deposit USDC |
| [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) | — | ✓ | `M_GLOBAL_BURN_OPERATOR_ROLE` | MGlobalRedemptionVaultWithAave (proxy) |
| [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) | — | ✓ | `M_GLOBAL_BURN_OPERATOR_ROLE` | MGlobalRedemptionVaultWithSwapper (proxy) |

**Mint-role grants bypass the 48-hour timelock entirely.** Either of the two `DEFAULT_ADMIN_ROLE` holders can grant themselves `M_GLOBAL_MINT_OPERATOR_ROLE` and mint unbacked tokens in two transactions with zero delay.

### Collateralization

- **Backing Model:** Offchain / hybrid — mGLOBAL is a **subordinated debt instrument** of Midas Software GmbH, not a direct claim on underlying assets
- **Collateral Quality:** Per [SumCap](https://midas.sumcap.xyz/mglobal) (June 16, 2026): 92.09% Unclassified (offchain/opaque), 6.78% Aave V3 aUSDC (blue-chip DeFi), 1.13% Liquidity Buffer (USDC). The 92% unclassified portion cannot be assessed for quality — this is the primary collateralization concern
- **Verifiability:** Hybrid. The Aave integration in vaults provides partial onchain visibility of idle capital. Full strategy portfolio composition requires offchain reporting
- **Risk Curation:** Fasanara has discretion over allocation within the strategy framework. Midas enforces policy limits via Fordefi policy engine
- **Tri-Party Governance (via Fordefi):** Per Fordefi case study: Midas Treasury + Fasanara (Asset Manager) + Independent Oversight Signer. Operations within predefined rules clear automatically; anything outside routes to tri-party quorum
- **Legal Structure:** LYT holders are **subordinate creditors** of Midas Software GmbH (German GmbH, HRB 254645 B, Berlin-Charlottenburg). Per the [Midas legal structure docs](https://docs.midas.app/legal/legal-structure), Midas offers two structures: Luxembourg securitisation (bankruptcy-remote) and German GmbH. mGLOBAL uses the **German GmbH structure** — no statutory asset segregation or bankruptcy remoteness. This matches mHYPER's structure

### Provability

- **Reserve Transparency:** Hybrid. The shared Midas [Attestation Engine](https://docs.midas.app/transparency/the-midas-attestation-engine) (SAVE, introduced March 2026) adds a multi-party verification layer via three contracts: [KeystoneForwarder](https://etherscan.io/address/0x0b93082D9b3C7C97fAcd250082899BAcf3af3885), [SaveCreReceiverProxy](https://etherscan.io/address/0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6), and [MidasSaveRegistryWithClaim](https://etherscan.io/address/0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d). The registry stores hashes only — not actual reserve data or NAV
- **NAV/Price Updates:** Token price updated via privileged role on the `MGlobalCustomAggregatorFeedGrowth` oracle ([`0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38`](https://etherscan.io/address/0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38)). Current price: $1.00000000 (round 2). **Update history (verified onchain):** The oracle has been updated only **2 times since deployment**: [April 5, 2026](https://etherscan.io/tx/0x45c0c4f317741da7b1e210e7228c5fbc190cb44d07fcef68bd5c0e2f56ddcd39) (initial price set) and [May 15, 2026](https://etherscan.io/tx/0x08076ea85feaac8ae1e276a23f9f93e91ff0bf8c62f6bc0e37a5e40f03be1ad4). **The oracle is now 33+ days stale** (last update May 15, 2026; snapshot June 17, 2026). This is atypical — mHYPER's oracle is updated twice per week. For a stablecoin product, the price has been static at $1.00, but the lack of regular updates is notable
- **Oracle Bounds:** `maxAnswerDeviation` = 100000000 ($1.00, effectively 100% deviation per update — very loose), `minAnswer` = $0.10, `maxAnswer` = $1,000. These are much looser than mHYPER's 0.35% deviation cap
- **Oracle Model:** Uses MGlobalCustomAggregatorFeedGrowth with separate PriceRaised ([`0x494f142c35167cfbdd3887e8d7897822e63c9618`](https://etherscan.io/address/0x494f142c35167cfbdd3887e8d7897822e63c9618)) and PriceLowered ([`0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f`](https://etherscan.io/address/0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f)) bound feeds. These appear to define upper/lower acceptable price bounds, but currently have **no role holders assigned** — suggesting this safety feature is not yet active
- **Attestation Engine Data:** The registry stores proof IDs, attestation hashes, claim hashes, verifier hashes, timestamps, and attestor/verifier addresses. It does **not** expose actual reserve data or an onchain URI/CID
- **Third-Party Verification:** Per Midas docs, the Attestation Engine uses LlamaRisk and Canary Protocol as independent verifiers

## Liquidity Risk

- **DEX Liquidity:** **Zero** — No Uniswap V3 pools found for mGLOBAL/USDC at any fee tier (500/3000/10000 bps) via [Uniswap V3 Factory](https://etherscan.io/address/0x1F98431c8aD98523631AE4a59f267346ea31F984). Zero DEX pairs on DexScreener. The token has no secondary market — exit is entirely dependent on Midas redemption infrastructure
- **Primary Exit:** Via Midas redemption vaults (MGlobalRedemptionVaultWithAave + MGlobalRedemptionVaultWithSwapper)
- **Redemption Mechanism:**
  - **MGlobalRedemptionVaultWithAave** — primary redemption with Aave integration. Likely supports instant redemptions when liquidity available
  - **MGlobalRedemptionVaultWithSwapper** — secondary redemption with swapper functionality
- **Large Holder Impact:** **EXTREME.** [InfiniFi's MidasFarm](https://etherscan.io/address/0x7373A7ce3C023C56Cb66747AFbdF827627D31679) holds 81% of all mGLOBAL (~$30.6M). Farm matured June 15, 2026 (yesterday). The remaining holders (EOA 10.46%, Safe 6%, BeaconProxy 2.3%) would be severely impacted by any InfiniFi exit
- **Vault USDC Balances (onchain, June 17, 2026):**
  - [DepositVault](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1): **$0 USDC**
  - [RedemptionVaultWithAave](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b): **$0 USDC**
  - [RedemptionVaultWithSwapper](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7): **~$734 USDC**
  - The vaults hold negligible idle USDC — funds are either deployed to Aave (aUSDC) or moved offchain to Fasanara custody. This means instant redemption capacity is currently **near zero** at the vault level

## Centralization & Control Risks

### Governance

- **Contract Upgradeability:** Yes — all contracts use `TransparentUpgradeableProxy` with shared `ProxyAdmin` at [`0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC)
- **ProxyAdmin Owner:** [`MidasTimelockController`](https://etherscan.io/address/0xE3EEe3e0D2398799C884a47FC40C029C8e241852) — a verified OpenZeppelin `TimelockController` with a **48-hour minimum delay**. Contract upgrades must be proposed, wait 48 hours, then executed
- **Timelock Proposer/Executor:** Gnosis Safe [`0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89`](https://etherscan.io/address/0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89) — **1/3 onchain threshold** (any single Safe owner can propose/execute). Safe owners:
  - [`0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f`](https://etherscan.io/address/0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f) — EOA. Per Midas, Fordefi MPC (3/n) — not verifiable onchain
  - [`0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7`](https://etherscan.io/address/0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7) — Nested Gnosis Safe (3/7)
  - [`0xC50BD8430545C80a681C7cb33E6560fB0Bd86880`](https://etherscan.io/address/0xC50BD8430545C80a681C7cb33E6560fB0Bd86880) — EOA. Per Midas, Fireblocks MPC (3/n) — not verifiable onchain
  - **Safe signer identities NOT checked** — only threshold and signer count verified, per assessment guidelines
- **Access Control:** Role-based via `MidasAccessControl` ([`0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B`](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B))
- **DEFAULT_ADMIN_ROLE holders (2):** Two addresses hold `DEFAULT_ADMIN_ROLE` on MidasAccessControl — **role changes (mint/burn/pause/blacklist grants) bypass the timelock** and can be executed immediately:
  - The 1/3 Gnosis Safe ([`0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89`](https://etherscan.io/address/0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89))
  - [`0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227`](https://etherscan.io/address/0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227) — EOA. [Per Midas](https://docs.midas.app/security/smart-contract-security#midas-controller), Fordefi MPC (3/n) — not verifiable onchain
  - ⚠️ [`0x875c06a295c41c27840b9c9dfda7f3d819d8bc6a`](https://etherscan.io/address/0x875c06a295c41c27840b9c9dfda7f3d819d8bc6a) was **revoked** — does NOT hold `DEFAULT_ADMIN_ROLE` (verified onchain June 17, 2026)
  - **Either of the two remaining admins can grant/revoke any role with no timelock.** Midas states they are working on gating specific functions behind a timelock
- **Governance Model:** No onchain governance. Midas controls all admin functions
- **Privileged Roles:**
  1. **`M_GLOBAL_MINT_OPERATOR_ROLE`** (`0x86c2e8326862f916bf4ee800260d2306dc3c829808f94feb79f6d3a20aaf9bc2`) — Can mint unlimited mGLOBAL tokens. **The `mint()` function has no onchain collateral check** — it only verifies the caller has the mint role. Currently held by:
    - [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) — EOA, nonce 3. Per Midas pattern, Fordefi MPC (not verifiable). Also holds BURN, PAUSE, BLACKLIST_OP, GREENLIST_OP roles
    - [`0xce29c36c6d4556f2d01d79414c1354b968dddef1`](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1) — MGlobalDepositVaultWithAave (mints when users deposit USDC)
  2. **`M_GLOBAL_BURN_OPERATOR_ROLE`** — Can burn mGLOBAL tokens from any address. Currently held by:
    - [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) — same EOA as above (Fordefi MPC)
    - [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) — MGlobalRedemptionVaultWithAave (proxy)
    - [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) — MGlobalRedemptionVaultWithSwapper (proxy)
  3. **`M_GLOBAL_PAUSE_OPERATOR_ROLE`** — Can pause/unpause the contract (freezing all transfers). Held by [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361)
  4. **`DEFAULT_ADMIN_ROLE`** — Can grant/revoke all other roles (held by 1/3 Safe + one EOA, no timelock). A compromised admin can grant itself the MINT role and mint unbacked tokens in two transactions
  5. **ProxyAdmin owner** — Can upgrade all contract implementations (via 48hr timelock)
  6. **Oracle updater** — Can set the NAV price via `M_GLOBAL_CUSTOM_AGGREGATOR_FEED_ADMIN_ROLE` (`0x9e02beae92a72aee37131404ba654d9d66746f20885ff63bd08d7b4b8864a54e`). Currently held by a single EOA: [`0x088a74de7df74e6a6eb832d28878a9f134ee4f05`](https://etherscan.io/address/0x088a74de7df74e6a6eb832d28878a9f134ee4f05) — nonce 4, no timelock on price updates. Oracle bounds: maxAnswerDeviation = 100% ($1.00), minAnswer = $0.10, maxAnswer = $1,000
  7. **Greenlist/Blacklist operators:**
     - Generic `GREENLIST_OPERATOR`: [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) and [`0x9ba8c38ae60e6e6311d53f8a85e5cf4004d3c987`](https://etherscan.io/address/0x9ba8c38ae60e6e6311d53f8a85e5cf4004d3c987) (nonce 0 — never transacted)
     - Generic `BLACKLIST_OPERATOR`: [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) and [`0x9ba8c38ae60e6e6311d53f8a85e5cf4004d3c987`](https://etherscan.io/address/0x9ba8c38ae60e6e6311d53f8a85e5cf4004d3c987)
     - Token-specific `M_GLOBAL_BLACKLIST_OPERATOR_ROLE` and `M_GLOBAL_GREENLIST_OPERATOR_ROLE`: **NOT currently granted to anyone**
- **Fund Seizure / Unbacked Minting:** The mint operator can create tokens without depositing collateral (no onchain backing check). The burn operator can burn from any address. The blacklist/pause operators can freeze activity. Role grants bypass the timelock — either of the two `DEFAULT_ADMIN_ROLE` holders can grant themselves these roles immediately and unilaterally. `renounceRole` is disabled (always reverts) per shared MidasAccessControl code
- **Audit Assessment:** Hacken auditors explicitly flagged the protocol as **"highly centralized"** with system admins controlling all critical roles

### Programmability

- **System Operations:** Primarily offchain. Strategy execution, NAV calculation, and redemption processing are handled by Midas/Fasanara offchain
- **Oracle/NAV Updates:** The `MGlobalCustomAggregatorFeedGrowth` is updated by a privileged role with significantly looser bounds than mHYPER (100% deviation vs 0.35%). The PriceRaised/PriceLowered bound feeds exist onchain but have no role holders — this safety feature appears inactive
- **PPS Definition:** The oracle price IS the PPS. It is updated by an admin role, not computed onchain from reserves
- **Off-Chain Dependencies:** Critical
  - Fasanara's strategy execution and NAV reporting
  - Midas's redemption processing
  - KYC/AML verification (greenlist management)
  - Fordefi for MPC custody and transaction signing
- **Aave Integration (Positive):** mGLOBAL's vaults integrate with Aave for idle capital, providing some onchain visibility of deposited USDC

### External Dependencies

- **Fasanara Capital (Critical):** Strategy management, NAV calculation, risk monitoring. **Due diligence on Fasanara is partially complete** — confirmed $4B+ AUM, 15-year history, London-based institutional manager with MIFIDPRU disclosure. However, crypto-native track record and mGLOBAL-specific mandate remain unverified. 92% NAV opacity is a key concern. Fasanara is larger ($4B vs $300M AUM) and more established (15yr vs 7yr), but its digital asset strategy transparency is lower
- **Fordefi (Critical):** MPC custody of underlying assets with tri-party MPC governance
- **Aave (Important):** The DepositVault and RedemptionVault integrate directly with Aave for idle capital management. Aave is a blue-chip DeFi protocol — this is a positive dependency compared to mHYPER's fully offchain idle capital handling
- **Strategy Counterparties:** cannot verify specific strategy counterparties, 92% of NAV is unclassified
- **Stablecoin Dependencies:** USDC is the deposit asset. Any USDC depeg would directly impact mGLOBAL value
- **Oracle:** NAV reported via custom contract (MGlobalCustomAggregatorFeedGrowth). **Not** a Chainlink data feed. Bound feeds (PriceRaised/PriceLowered) exist but have no active role holders
- **MidasAccessControl (Critical):** Shared across all Midas products. A failure or compromise of this contract would affect mGLOBAL alongside mHYPER, mTBILL, and other Midas tokens

## Operational Risk

- **Team:** **Shared with all Midas products.** Dennis Dinkelmeyer (CEO, ex-Goldman Sachs), Fabrice Grinda (Executive Chairman, co-founded OLX, FJ Labs), Romain Bourgois (CPO, ex-Ondo Finance). Team includes alumni from Goldman Sachs, Anchorage Digital, Capital Group
- **Investors:** Framework Ventures (lead), BlockTower, HV Capital, Coinbase Ventures, GSR, Hack VC, Cathay Ledger, 6th Man Ventures, FJ Labs, Lattice Capital. $8.75M seed (March 2024)
- **Documentation Quality:** Midas has comprehensive docs at docs.midas.app covering token mechanics, fees, risk management, smart contracts. **However, mGLOBAL-specific documentation is limited**
- **Legal Structure:** Midas Software GmbH, Pappelallee 78/79, 10437 Berlin, Germany (HRB 254645, LEI 984500BB00BN6D2B7C48). Incorporated June 2023. The issuer is **neither licensed nor registered** with the Liechtenstein FMA or any other supervisory authority. Base Prospectus approved by FMA Liechtenstein (July 17, 2025, valid until July 17, 2026)
- **Fasanara Due Diligence:** Fasanara's team, regulatory status, AUM, and incident history need to be researched
- **Incident Response:** Midas demonstrated operational capability during the Stream Finance incident (processed $150M+ in redemptions within 48 hours)

## Monitoring

1. **Oracle/NAV Updates (CRITICAL)**
  - **Contract:** [`0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38`](https://etherscan.io/address/0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38) (MGlobalCustomAggregatorFeedGrowth)
  - **Monitor:** `AnswerUpdated` events, `latestRoundData()` values, `setRoundData` calls
  - **Alert:** Any price deviation from $1.00 (the stable peg), stale price (>7 days without update), unexpected price jumps
  - **Frequency:** Hourly
  - **Thresholds:** Price < $0.995 or > $1.005, staleness > 7 days

2. **Oracle Bound Feeds (RECOMMENDED)**
  - **Contracts:**
    - [`0x494f142c35167cfbdd3887e8d7897822e63c9618`](https://etherscan.io/address/0x494f142c35167cfbdd3887e8d7897822e63c9618) (PriceRaised)
    - [`0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f`](https://etherscan.io/address/0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f) (PriceLowered)
  - **Monitor:** Role grants on these contracts, `AnswerUpdated` events
  - **Alert:** Any role grant (indicating bound feed activation), bound feed value changes
  - **Frequency:** On event

3. **Access Control Changes (CRITICAL)**
  - **Contract:** [`0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B`](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B) (MidasAccessControl)
  - **Monitor:** `RoleGranted`, `RoleRevoked` events for mGLOBAL-specific roles:
    - `M_GLOBAL_MINT_OPERATOR_ROLE` (0x86c2e8326862f916bf4ee800260d2306dc3c829808f94feb79f6d3a20aaf9bc2)
    - `M_GLOBAL_BURN_OPERATOR_ROLE`
    - `M_GLOBAL_PAUSE_OPERATOR_ROLE`
    - `M_GLOBAL_CUSTOM_AGGREGATOR_FEED_ADMIN_ROLE`
    - `M_GLOBAL_DEPOSIT_VAULT_ADMIN_ROLE`
    - `M_GLOBAL_REDEMPTION_VAULT_ADMIN_ROLE`
    - `DEFAULT_ADMIN_ROLE` (0x0000000000000000000000000000000000000000000000000000000000000000)
  - **Alert:** Any role change
  - **Frequency:** On event

4. **Contract Upgrades (CRITICAL)**
  - **Contract:** [`0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC) (ProxyAdmin)
  - **Monitor:** `Upgraded` events on all mGLOBAL proxy contracts:
    - [`0x7433806912Eae67919e66aea853d46Fa0aef98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8) (mGLOBAL Token)
    - [`0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38`](https://etherscan.io/address/0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38) (Oracle)
    - [`0xce29c36c6d4556f2d01d79414c1354b968dddef1`](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1) (DepositVault)
    - [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) (RedemptionVaultWithAave)
    - [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) (RedemptionVaultWithSwapper)
  - **Alert:** Any implementation change
  - **Frequency:** Hourly

5. **Token Supply & Transfers (CRITICAL)**
  - **Contract:** [`0x7433806912Eae67919e66aea853d46Fa0aef98A8`](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8) (mGLOBAL)
  - **Monitor:** `totalSupply()` via `cast call`, `Paused`/`Unpaused` events, large mint/burn events, `Blacklisted`/`Greenlisted` events
  - **Alert:** Supply change > 5% in 24 hours, pause events, any blacklist changes
  - **Frequency:** On event / daily
  - **Thresholds:** Mint > $1M, Burn > $1M, supply delta > 5%

6. **Vault Activity (RECOMMENDED)**
  - **Contracts:**
    - [`0xce29c36c6d4556f2d01d79414c1354b968dddef1`](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1) (DepositVault)
    - [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) (RedemptionVaultWithAave)
    - [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) (RedemptionVaultWithSwapper)
  - **Monitor:** Large deposits/redemptions, vault USDC balances
  - **Alert:** Redemptions >$5M in 24 hours, vault USDC balance <$100K
  - **Frequency:** Hourly

7. **Timelock Activity (RECOMMENDED)**
  - **Contract:** [`0xE3EEe3e0D2398799C884a47FC40C029C8e241852`](https://etherscan.io/address/0xE3EEe3e0D2398799C884a47FC40C029C8e241852) (MidasTimelockController)
  - **Monitor:** `CallScheduled`, `CallExecuted`, `CallCancelled` events
  - **Alert:** Any scheduled call (indicates pending contract upgrade)
  - **Frequency:** Hourly

8. **Aave Position Health (RECOMMENDED)**
  - **Contracts:** MGlobalDepositVaultWithAave and MGlobalRedemptionVaultWithAave
  - **Monitor:** Aave aUSDC balances held by mGLOBAL vaults via `cast call` on Aave aUSDC token
  - **Alert:** Significant aUSDC balance decrease (indicating withdrawal from Aave)
  - **Frequency:** Daily

9. **External Protocol Health (RECOMMENDED)**
  - Monitor Aave for incidents that could impact mGLOBAL's deposited idle capital
  - Monitor USDC for depeg events
  - Monitor MidasAccessControl for any DEFAULT_ADMIN_ROLE changes (affects all Midas products)

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION LAYER                              │
│                                                                              │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │  MGlobalDepositVaultWithAave     │  │  MGlobalRedemptionVaultWithAave  │  │
│  │  (TransparentProxy)              │  │  (TransparentProxy)              │  │
│  │  0xce29c36c..def1                │  │  0xa0fc8bdf..b01b                │  │
│  │                                  │  │                                  │  │
│  │  User deposits USDC ─────────────┼─▶│  User redeems mGLOBAL           │  │
│  │  Idle USDC → Aave aUSDC          │  │  Idle USDC → Aave aUSDC          │  │
│  │  Has: MINT_OPERATOR_ROLE         │  │  Has: BURN_OPERATOR_ROLE         │  │
│  └──────────────┬───────────────────┘  └───────────────┬──────────────────┘  │
│                 │ mints                                │ burns               │
│                 ▼                                      ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  mGLOBAL Token (TransparentProxy)                                    │    │
│  │  0x7433806912Eae67919e66aea853d46Fa0aef98A8                          │    │
│  │  impl: 0xd22be883b7194ac2d1751bf8e6e4962d87f2f75a                    │    │
│  │                                                                      │    │
│  │  mint(to, amount) ── only role check, NO collateral check            │    │
│  │  burn(from, amount) ── can burn from any address                     │    │
│  │  pause() / unpause() / greenlist() / blacklist()                     │    │
│  │  metadata(key) / setMetadata(key, data)                              │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │  MGlobalRedemptionVaultWithSwapper│  │  MidasLzMintBurnOFTAdapter      │  │
│  │  (TransparentProxy)              │  │  0xb67f8106..445c                │  │
│  │  0x1e0fd667..20d7                │  │                                  │  │
│  │                                  │  │  Has: NO mGLOBAL roles           │  │
│  │  Has: BURN_OPERATOR_ROLE         │  │  (cross-chain not active yet)   │  │
│  └──────────────────────────────────┘  └──────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORACLE LAYER                                       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  MGlobalCustomAggregatorFeedGrowth (Oracle / NAV)                     │    │
│  │  Proxy: 0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38                   │    │
│  │  Impl:  0x96ac55e782b9ee3f1dd72b3ba033352b5af95e49                   │    │
│  │                                                                      │    │
│  │  Price: $1.00000000 (r2, updated ~Jun 4 2026)                        │    │
│  │  maxAnswerDeviation: 100% ($1.00) — VERY LOOSE                       │    │
│  │  minAnswer: $0.10, maxAnswer: $1,000                                 │    │
│  │  Updater: EOA 0x088a74de..f05 (no timelock)                          │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────────┐              │
│  │  PriceRaised Feed          │  │  PriceLowered Feed         │              │
│  │  0x494f142c..9618          │  │  0x4c825154..cf6f          │              │
│  │  NO role holders assigned  │  │  NO role holders assigned  │              │
│  │  (bound feed — inactive)   │  │  (bound feed — inactive)   │              │
│  └────────────────────────────┘  └────────────────────────────┘              │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  MGlobalDataFeed                                                      │    │
│  │  Impl: 0x94cd5b8904c1f1426f9408ee5c98b789c6a864c6                    │    │
│  │  Proxy 1: 0x58476f45..8688                                           │    │
│  │  Proxy 2: 0xb468a6f6..139e                                           │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        ACCESS CONTROL LAYER                                   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  MidasAccessControl (TransparentProxy)                                │    │
│  │  0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B                          │    │
│  │                                                                      │    │
│  │  All token/vault operations check roles via this contract            │    │
│  │  grantRole() / revokeRole() ── admin can change any role             │    │
│  │  renounceRole() ── DISABLED (always reverts)                         │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐      │
│  │  ProxyAdmin (shared)       │  │  MidasTimelockController           │      │
│  │  0xbf25b58c..AaC           │◀─│  0xE3EEe3e0..852                  │      │
│  │                            │  │                                    │      │
│  │  Can upgrade all proxy     │  │  48-hour minimum delay             │      │
│  │  implementations           │  │  Proposer/Executor: 1/3 Safe      │      │
│  └────────────────────────────┘  └────────────────────────────────────┘      │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  Timelock Owner: 1/3 Gnosis Safe 0xB60842E9DaBC..7E89               │    │
│  │  Safe owners (3 signers, 1 threshold onchain):                       │    │
│  │  ├─ EOA 0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f (Fordefi MPC?) │    │
│  │  ├─ 3/7 Safe 0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7            │    │
│  │  └─ EOA 0xC50BD8430545C80a681C7cb33E6560fB0Bd86880 (Fireblocks MPC?)│    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        OFF-CHAIN DEPENDENCIES                                 │
│                                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐      │
│  │  Fasanara Capital          │  │  Fordefi MPC Custody               │      │
│  │  (Strategy Manager)        │  │  (Tri-party quorum)               │      │
│  │                            │  │                                    │      │
│  │  Track record, AUM,        │  │  Midas + Fasanara +               │      │
│  │  regulatory status         │  │  Independent signer               │      │
│  │  Strategy allocation:       │  │  Holds underlying assets          │      │
│  └────────────────────────────┘  └────────────────────────────────────┘      │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  Attestation Engine (shared, March 2026)                              │    │
│  │  LlamaRisk + Canary Protocol verify → vlayer notarizes               │    │
│  │  → Chainlink CRE publishes hashes onchain                           │    │
│  │  KeystoneForwarder:      0x0b93082D9b3C7C97fAcd250082899BAcf3af3885 │    │
│  │  SaveCreReceiverProxy:   0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6 │    │
│  │  MidasSaveRegistry:      0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  Aave (Onchain Protocol Dependency)                                  │    │
│  │  DepositVault and RedemptionVault deposit idle USDC → aUSDC         │    │
│  │  Blue-chip DeFi protocol; positive structural feature               │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          GOVERNANCE                                           │
│                                                                              │
│  DEFAULT_ADMIN_ROLE (2 holders, can grant/revoke ANY role, no timelock):     │
│  ├─ 1/3 Gnosis Safe 0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89             │
│  └─ EOA 0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227 (Fordefi MPC?)          │
│                                                                              │
│  ⚠ 0x875c06a295c41c27840b9c9dfda7f3d819d8bc6a ── REVOKED                    │
│                                                                              │
│  Mint/Burn/Pause Operator EOA (holds multi-operational role):                │
│  └─ 0x76e350c5a674db787918e5f728466c7356d4d361 (Fordefi MPC, nonce 3)      │
│                                                                              │
│  Additional MINT holders via M_GLOBAL_MINT_OPERATOR_ROLE:                    │
│  └─ DepositVault 0xce29c36c6d4556f2d01d79414c1354b968dddef1                 │
│                                                                              │
│  Additional BURN holders via M_GLOBAL_BURN_OPERATOR_ROLE:                    │
│  ├─ RedemptionVaultWithAave 0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b     │
│  └─ RedemptionVaultWithSwapper 0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7  │
│                                                                              │
│  Oracle Updater EOA (sets NAV price, no timelock):                           │
│  └─ 0x088a74de7df74e6a6eb832d28878a9f134ee4f05 (nonce 4)                    │
│                                                                              │
│  ⚠ Role changes bypass timelock (only upgrades go through 48h)              │
│  ⚠ mint() has no onchain collateral check                                   │
│  ⚠ Oracle maxAnswerDeviation = 100% ($1.00) — very loose                    │
│  ⚠ PriceRaised/PriceLowered bound feeds have NO role holders (inactive)     │
│  ⚠ Either of 2 DEFAULT_ADMIN can grant MINT → unbacked tokens              │
│  ⚠ OFT adapter deployed but holds no mGLOBAL roles (bridging inactive)     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → DepositVault mints mGLOBAL at oracle price (~$1.00).
Idle USDC in vaults is deposited to Aave for yield. Active strategy funds go to
Fasanara via Fordefi custody for offchain execution. NAV/price updated by oracle
updater EOA. User redeems via RedemptionVaultWithAave or RedemptionVaultWithSwapper.
```

---

## Risk Summary

### Key Strengths

- **Doxxed Midas team with institutional backing** — Goldman Sachs / Morgan Stanley alumni, backed by Coinbase Ventures, Framework Ventures, BlockTower
- **Established strategy manager** — Fasanara Capital Ltd (London, founded 2011, $4B+ AUM, 15-year track record) is a major European institutional asset manager with MIFIDPRU disclosure and SFDR Article 8 classified funds. While less crypto-native than Hyperithm, its size, history, and regulatory infrastructure are meaningful
- **Institutional-grade custody** — Fordefi MPC with tri-party MPC governance prevents unilateral fund access
- **Shared, extensively audited infrastructure** — 10 audits (2023–2025) on Midas core contracts
- **Aave integration at vault level** — idle capital is verifiably deposited on Aave (blue-chip DeFi), providing partial onchain transparency not present in mHYPER
- **Strong $1M bug bounty** across Sherlock + Cantina platforms
- **Stable peg product** — $1.00 target is simpler to verify than floating NAV tokens

### Key Risks

- **Incomplete strategy manager due diligence** — Fasanara Capital Ltd is now partially researched (founded 2011, $4B+ AUM, London-based, large team, MIFIDPRU disclosure). However, its specific** digital asset strategy mandate for mGLOBAL, crypto-native track record, and FCA registration details remain unverified. 92% of mGLOBAL NAV is classified as \"Unclassified\" — significantly more opaque than even mHYPER's 76.8%
- **Very loose oracle bounds** — maxAnswerDeviation of 100% ($1.00) means the oracle price can move from $1.00 to $0.10 or $1,000 in a single update. The PriceRaised/PriceLowered bound feeds are deployed but inactive. **Oracle is 33+ days stale** (last update May 15, 2026) with APY stuck at 0.00%
- **Short production history** — ~10 weeks vs mHYPER's ~9+ months. No stress-test events. APY has been 0% since inception (no yield reported onchain)
- **Unbacked minting possible** — tokens can be minted without collateral by any address holding `M_GLOBAL_MINT_OPERATOR_ROLE`. Role grants bypass the 48-hour timelock entirely
- **Weak access control** — `DEFAULT_ADMIN_ROLE` held by two addresses (1/3 Safe + one EOA). Either can grant/revoke any role immediately
- **Zero secondary market** — No Uniswap V3 pools, no DexScreener pairs. Exit entirely dependent on Midas redemption infrastructure. Vaults hold near-zero USDC for instant redemptions
- **OFT adapter deployed but inactive** — no mGLOBAL bridge roles granted. Cross-chain expansion state is unclear

### Critical Risks

- **Fasanara due diligence gap (partially resolved):** Fasanara Capital Ltd is now confirmed as a London-based, $4B+ AUM institutional manager with 15-year history, MIFIDPRU disclosure, and a large professional team. This is significantly stronger than the initial "unverified" assessment. However, its specific digital asset strategy for mGLOBAL remains opaque — 92% of NAV is "Unclassified." Fasanara's crypto-native track record is less established than Hyperithm's
- **Oracle can report any price:** With 100% maxAnswerDeviation and no active bound feeds, a compromised oracle updater can set the price anywhere between $0.10 and $1,000 in a single transaction. Combined with no-timelock role grants and unbacked minting, this creates a path to significant token holder loss
- **InfiniFi concentration — immediate:** 81% of mGLOBAL ($30.6M) is held by [InfiniFi's MidasFarm](https://etherscan.io/address/0x7373A7ce3C023C56Cb66747AFbdF827627D31679). **The farm matured yesterday (June 15, 2026)** — InfiniFi can redeem at any moment. A full redemption would collapse mGLOBAL market cap from $37.6M to ~$7M. InfiniFi rates this position 4.5/5 risk (their second-highest). This is not a theoretical concern — the maturity trigger has already fired

---

## Risk Score Assessment

**Scoring Guidelines:**

- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- **No audit** → **PASS** — 10 audits (Hacken, Côme, Sherlock, 2023–2025) cover the shared vault infrastructure, bridges, and oracles. mGLOBAL-specific contracts are implementations/variants of audited patterns, though the Aave-integrated vaults and custom growth oracle have not been separately audited
- **Unverifiable reserves** → **PASS** — Reserves are managed offchain by Fasanara. NAV is admin-reported but the shared Attestation Engine provides multi-party verification. The Aave integration provides partial onchain visibility of idle capital. Full strategy composition requires offchain trust — but partial attestation pipeline exists
- **Total centralization** → **PASS** — Role-based access control, tri-party MPC governance via Fordefi, 48-hour timelock on contract upgrades. However, the 1/3 Safe threshold and role changes bypass the timelock

**Result:** Protocol passes critical gates. Proceeding to category scoring.

---

### Category Scoring (1-5 scale, 1 = safest)

#### 1. Audits & Historical Track Record (Weight: 20%)

**Audits:**

- 10 audits across 3 years (2023–2025): 2 Hacken + 2 Côme + 6 Sherlock contests on shared Midas infrastructure
- Broad coverage: core contracts, vaults, bridges (LayerZero/Axelar), oracle system, legacy components
- **mGLOBAL-specific contracts (Aave vaults, growth oracle) are NEW and may not have been covered by prior audits.** The core token logic and access control are audited, but the Aave integration and oracle model are extensions beyond original audit scopes
- Several findings accepted rather than fixed in earlier audits
- Hacken explicitly flagged the protocol as "highly centralized"

**Bug Bounty:** $1M total allocated across [Sherlock](https://audits.sherlock.xyz/bug-bounties/122) ($500K max) and [Cantina](https://cantina.xyz/bounties/d77405e5-99ce-4ba5-846c-885820b030e1) ($500K max). Active since March 2026.

**Time in Production:**

- mGLOBAL: ~10 weeks (April 2026)
- Midas platform: ~22 months (mTBILL since mid-2024)
- Market cap: ~$37.6M, platform TVL: ~$109.5M (down from ~$927.8M peak)
- No security incidents for mGLOBAL
- No stress-test events (mHYPER processed $150M+ during Stream Finance, but mGLOBAL has no comparable test)

**Score: 2.5/5** — 10 audits on shared infrastructure provides strong foundation, but mGLOBAL-specific contract patterns (Aave vaults, growth oracle) are extensions not separately audited. Short 10-week production history with no stress testing. Strong $1M bug bounty. Platform-level track record (~22 months) is positive but the specific product is very new.

#### 2. Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.0**

- Upgradeable proxy contracts with **48-hour timelock** on upgrades via `MidasTimelockController` — users have time to react to proposed upgrades
- However, role changes (mint/burn/pause/blacklist grants) bypass the timelock entirely
- `DEFAULT_ADMIN_ROLE` held by **two addresses**: the 1/3 Gnosis Safe plus one EOA (claimed Fordefi MPC). Either can grant/revoke any role with no timelock
- Oracle price updated by a single EOA with no timelock
- Admin controls all critical roles (flagged by auditors as "highly centralized")
- Oracle bound feeds (PriceRaised/PriceLowered) exist but have **no role holders** — inactive safety mechanism
- 1/3 Safe threshold means single Safe owner can propose/execute. Offchain MPC mitigations (Fordefi/Fireblocks) cannot be verified onchain
- Tri-party MPC custody (Fordefi) is a positive but applies only to fund movements, not contract administration

**Subcategory B: Programmability — 4.0**

- Strategy execution fully offchain (Fasanara)
- NAV/oracle admin-updated at unknown frequency. The Attestation Engine adds programmatic verification and onchain hash publication, but the onchain price update is still admin-triggered and not contractually gated by attestation
- PPS is admin-reported, not computed onchain from reserves
- Redemption partially offchain (standard redemptions processed by Midas team)
- Users cannot independently compute the exchange rate onchain
- **Aave integration is a positive** — idle capital in vaults is verifiable on Aave (blue-chip). This gives partial onchain programmability not present in mHYPER
- Very loose oracle bounds (100% deviation) — admin has effectively unrestricted pricing authority per update
- Bound feeds deployed but inactive — safety net not operational
- No smart contract restrictions on how the funds are managed. Tokens can be minted without backing

**Subcategory C: External Dependencies — 4.0**

- Fasanara Capital: single critical dependency for strategy management and NAV calculation. **Fasanara provides zero public information about how mGLOBAL funds are deployed** — the strategy is a complete black box (92% unclassified). This is a single point of failure for core value creation with no transparency on the dependency's operations
- Aave: idle capital integration (blue-chip, positive). Aave failure would impact vault idle capital but not core strategy
- Fordefi: MPC custody with tri-party governance (established, tested)
- MidasAccessControl: shared across all Midas products — single compromise affects entire platform
- Strategy counterparties: unverifiable without access to Midas transparency data
- Distributed backup shares for the Fordefi workspace, allowing Midas to recover and secure key material in case of counterparty failure

**Centralization Score = (3.0 + 4.0 + 4.0) / 3 ≈ 3.7**

**Score: 3.7/5** — Same structural centralization risks as mHYPER, with additional concerns: (a) oracle bounds are 285x looser (100% vs 0.35%), (b) bound feeds are deployed but inactive, (c) Fasanara is a single point of failure with complete opacity on funds deployment — no public information about how user capital is managed. The Aave integration partially offsets programmability concerns. The 48-hour timelock on upgrades is meaningful; role changes bypassing it entirely is not.

#### 3. Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.5**

- Tokens are subordinated debt instruments — not direct claims on collateral
- Strategy composition, collateral quality, and asset allocation are **92% unclassified and completely opaque** — Fasanara provides zero public information about how mGLOBAL funds are managed. Unlike mHYPER's Hyperithm which had identifiable onchain counterparties, mGLOBAL's strategy is a black box
- Aave integration means idle USDC → aUSDC is onchain and verifiable ($2.55M / 6.78%), but this only covers idle capital, not the active strategy
- No onchain collateral verification in smart contracts; admin can mint tokens without backing
- Tri-party MPC custody via Fordefi should prevent unilateral fund access
- **Score is HIGHER (riskier) than mHYPER's 3.5** due to complete strategy opacity and unverifiable asset quality

**Subcategory B: Provability — 3.5**

- NAV reported by Fasanara, with shared Midas Attestation Engine providing multi-party verification (LlamaRisk, Canary, vlayer, Chainlink CRE)
- Aave integration provides onchain visibility of idle vault capital — a structural improvement over mHYPER
- Full portfolio composition and strategy-level positions are not verifiable onchain; the registry stores only hashes
- Oracle updates are admin-triggered with no onchain gating from the Attestation Engine
- mGLOBAL-specific proof IDs in the registry have not been identified
- **Score is HIGHER than mHYPER's 3.0** because: (a) Fasanara's reporting practices are unverified, (b) strategy allocation is completely opaque, (c) shorter history means fewer attestation cycles to build trust

**Funds Management Score = (4.5 + 3.5) / 2 = 4.0**

**Score: 4.0/5** — Offchain funds management with subordinated debt structure. The Aave integration provides a positive onchain anchor, but it only covers idle capital, not active strategies. **Fasanara provides zero public information about how mGLOBAL funds are deployed** — 92% of NAV is unclassified. This is a black-box strategy dependency. The Attestation Engine provides a verification pipeline, but it cannot compensate for complete strategy opacity.

#### 4. Liquidity Risk (Weight: 15%)

- **Exit Mechanism:** Two redemption vaults (WithAave + WithSwapper). 0.5% fee on instant redemption
- **DEX Liquidity:** non, principal can be redeemed with a fee or full after cycle
- **Instant Redemption Capacity:** 1.15% withdrawable with additional 6.78% deposited into aave.
- **Redemption Vault Duality:** Two vaults provide redundancy — if one faces issues, the other may still process redemptions.
- **Holder Concentration (EXTREME):** [InfiniFi's MidasFarm](https://etherscan.io/address/0x7373A7ce3C023C56Cb66747AFbdF827627D31679) holds **81%** of supply (~$30.6M) and **matured June 15, 2026** — it can redeem at any time, which would collapse market cap from ~$37.6M to ~$7M overnight
- **Vault Liquidity (onchain, June 17, 2026):** DepositVault $0, RedemptionVaultWithAave $0, RedemptionVaultWithSwapper ~$734 USDC. Instant-redemption capacity at the vault level is effectively **near zero** — a large redemption depends on Fasanara unwinding offchain positions
- **Stress Performance:** No stress events for mGLOBAL

**Score: 4.0/5** — No secondary market (zero DEX liquidity), so exit is entirely dependent on Midas redemption infrastructure, which currently holds near-zero idle USDC. Combined with extreme holder concentration (81% in a now-matured InfiniFi position that can exit at will), large or simultaneous redemptions would have to wait on offchain unwinds of a 92%-unclassified strategy. The dual-vault redundancy and 6.78% Aave-backed idle capital are partial mitigants, but instant exit is not assured at scale

#### 5. Operational Risk (Weight: 5%)

- **Midas Team:** Fully doxxed with strong institutional backgrounds. Well-funded ($8.75M from top crypto VCs). **Positive, well-established**
- **Fasanara Capital:** **Now fully researched.** FCA Authorised since August 2011 (FRN [551020](https://register.fca.org.uk/s/firm?id=001b000000NMar0AAD)). $4B+ AUM, London HQ, 15-year track record. CEO Francesco Filia (ex-BofA Merrill Lynch). 40+ professionals. Companies House [07561210](https://find-and-update.company-information.service.gov.uk/company/07561210). Publishes MIFIDPRU Disclosure and Sustainability Report. EU SFDR Article 8 funds. Digital asset strategy transparency for mGLOBAL specifically remains limited — 92% of NAV is unclassified
- **Documentation:** Midas platform docs are comprehensive. mGLOBAL-specific documentation is limited — Midas docs site timed out during scraping (GitBook). SumCap successfully scraped and provides rich NAV/price/allocation data. **Midas transparency page and app require authentication or JS-rendering that could not be fully captured**
- **Legal:** Midas Software GmbH, German-incorporated. Base Prospectus approved by FMA Liechtenstein (July 2025, valid until July 2026).

**Score: 2.0/5** — Midas team is strong (doxxed, institutional, well-funded). Fasanara Capital is now fully verified as FCA Authorised (FRN 551020, since 2011) — this substantively improves the operational risk profile

### Final Score

| Category | Score | Weight | Weighted |
| ------------------------ | ----- | ------ | ----------- |
| Audits & Historical      | 2.5   | 20%    | 0.50        |
| Centralization & Control | 3.7   | 30%    | 1.11        |
| Funds Management         | 4.0   | 30%    | 1.20        |
| Liquidity Risk           | 4.0   | 15%    | 0.60        |
| Operational Risk         | 2.0   | 5%     | 0.10        |
| **Final Score**          |       |        | **3.51/5.0** |


### Risk Tier

| Final Score | Risk Tier       | Recommendation                        |
| ----------- | --------------- | ------------------------------------- |
| 1.0-1.5     | Minimal Risk    | Approved, high confidence             |
| 1.5-2.5     | Low Risk        | Approved with standard monitoring     |
| 2.5-3.5     | Medium Risk     | Approved with enhanced monitoring     |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0     | High Risk       | Not recommended                       |


**Final Risk Tier: Elevated Risk (3.5/5.0)**

**Recommendation:** Limited approval with strict limits. The score is driven by (a) complete strategy opacity — 92% of NAV unclassified, a Funds Management score of 4.0 — and (b) Liquidity risk (4.0): no secondary market, near-zero idle vault USDC, and extreme holder concentration (81% in a now-matured InfiniFi position). **Strongly recommend completing mGLOBAL-specific Fasanara due diligence before any allocation**. Talk directly to Fasanara team for more information.

**Path to a lower score:** This assessment is constrained primarily by opacity, not by a verified flaw. A clear investment deck, strategy mandate, or attested allocation breakdown that classifies the 92% "Unclassified" NAV would directly lower Collateralization, Provability, and External Dependencies — plausibly moving the final score back into the Medium tier (2.5–3.5). Resumption of regular oracle/NAV updates and tighter oracle bounds would reinforce that. The manager itself (Fasanara) is already verified as FCA-authorised; the gap is mGLOBAL-specific strategy disclosure.

**Required Conditions:**

1. **Fasanara FCA Registration** Authorised since August 2011, FRN 551020, Companies House 07561210. Full permissions scope needs manual review of the FCA register, but the firm is regulated and publishes MIFIDPRU disclosures
2. **Verify Strategy Allocation** — Current SumCap data shows 92% unclassified. Obtain breakdown of the unclassified portion from Midas team or attestation reports
3. **Limited Exposure** — Cap initial allocation at 5–10% of vault with gradual ramp-up only after oracle update cadence improves and yield reporting resumes
4. **Enhanced Monitoring** — Real-time alerts on oracle updates (1%+ deviation from $1.00), role changes, contract upgrades, vault activity, and Aave position health (see Monitoring section)
5. **Verify Oracle Bounds** — Confirm whether the 100% oracle deviation is intentional for a stablecoin product. If not, push for tighter bounds and activation of PriceRaised/PriceLowered bound feeds
6. **Weekly NAV Cross-Check** — Verify mGLOBAL oracle price remains at $1.00 ± acceptable tolerance
7. **Verify Redemption Parameters** — Confirm fees, delays, and instant redemption capacity for both vaults
8. **Monthly Reassessment** — Given the unverified manager, short history, and loose oracle bounds, reassess monthly for the first quarter, then quarterly

**Key Concerns Driving the Score:**

- **Fasanara Capital is fully verified** — FCA Authorised (FRN 551020, since 2011), $4B+ AUM, 15-year history, London-based, 40+ team, MIFIDPRU disclosure, Companies House 07561210. The manager risk is now well-understood. However, 92% of mGLOBAL NAV remains "Unclassified" — the digital asset strategy mandate specifically for mGLOBAL is opaque. This is now a "strategy opacity" concern rather than a "manager risk" concern
- **InfiniFi concentration:** 81% of mGLOBAL ($30.6M) sits in InfiniFi's MidasFarm, which matured June 15, 2026
- **Oracle is 33+ days stale with APY at 0%** — only 2 updates in 10 weeks. No yield reported onchain. Profit is probably airdropped to the token holders.

**Mitigating Factors:**

- **Fasanara Capital is an established institution** — $4B+ AUM, 15-year track record, large professional team, MIFIDPRU disclosure. This substantially improves the operational risk profile vs the initial unverified assessment
- **Aave integration** — $2.55M idle capital verifiably on blue-chip DeFi protocol. Structural improvement over mHYPER
- **Extensively audited shared infrastructure** — 10 audits across 3 years + $1M bug bounty
- **Strong Midas team and institutional backing** — doxxed, well-funded, regulated
- **Attestation Engine** — multi-party verification pipeline with onchain hash publication
- **Dual redemption vaults** — redundancy for user exits
- **Platform-level track record** — ~22 months, processed $150M+ redemptions (mHYPER)
- **1/3 Safe signers use institutional-grade MPC** — Fordefi and Fireblocks provide offchain protection beyond the onchain threshold

---

## Reassessment Triggers

- **Time-based**: Reassess in 2 months (August 2026) — accelerated due to short history and incomplete diligence
- **InfiniFi Maturity:** InfiniFi's MidasFarm matured June 15, 2026. The 81% holder ($30.6M) can redeem at any time. Monitor InfiniFi's position daily. If InfiniFi redeems, re-evaluate mGLOBAL viability entirely
- **Fasanara Due Diligence**: FCA Authorised since 2011 (FRN 551020), $4B+ AUM, 15-year track record. Digital asset strategy mandate for mGLOBAL remains the primary open question — Fasanara's institutional credibility is now well-established, but strategy-specific transparency is still needed
- **Strategy Disclosure**: Reassess when mGLOBAL strategy allocations become verifiable (via Midas app, SumCap, or attestation reports)
- **TVL-based**: Reassess if mGLOBAL market cap changes by more than 50% or Midas platform TVL changes by more than 40%
- **Oracle Configuration**: Reassess if oracle bounds are tightened (current 100% is dangerously loose for a stablecoin) or if PriceRaised/PriceLowered bound feeds are activated
- **Incident-based**: Reassess after any exploit, NAV discrepancy, governance change, contract upgrade, or regulatory action affecting Midas or Fasanara
- **Bridge Activation**: Reassess if OFT adapter is granted mGLOBAL mint/burn roles (indicating cross-chain activation)
- **Audit**: If new audit covering mGLOBAL-specific contracts (Aave vaults, growth oracle) is published, reassess
- **Redemption Stress**: If mGLOBAL processes a significant redemption event, reassess based on performance
- **Attestation Engine**: If mGLOBAL-specific attestations are confirmed flowing through the pipeline, reassess for Provability score improvement
