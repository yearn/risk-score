# Protocol Risk Assessment: Midas mGLOBAL

- **Assessment Date:** June 17, 2026 (Updated: August 24, 2026)
- **Token:** mGLOBAL
- **Chain:** Ethereum
- **Token Address:** [`0x7433806912Eae67919e66aea853d46Fa0aef98A8`](https://etherscan.io/token/0x7433806912Eae67919e66aea853d46Fa0aef98A8)
- **Final Score: 3.42/5.0**

## Overview + Links

mGLOBAL is a tokenized certificate (Liquid Yield Token / LYT) issued by Midas Software GmbH, a German-incorporated tokenization platform. It references the performance of **stablecoin-focused strategies** managed by [Fasanara Capital](https://www.fasanara.com/), a London-based asset management firm. mGLOBAL is an **accruing (growth) token**: it launched at $1.00 and yield is compounded into the token price rather than distributed, so the price ratchets upward with each NAV publication.

The price is set by a custom oracle (`MGlobalCustomAggregatorFeedGrowth`) updated by Midas. mGLOBAL's DepositVault and primary RedemptionVault integrate with **Aave** for idle capital management.

**Key Stats:**

- **mGLOBAL Market Cap / NAV:** ~$69.23M (August 24, 2026; 68,097,489.96 mGLOBAL × $1.01664609), corroborated by [SumCap / Delta Y](https://midas.sumcap.xyz/mglobal) at $69,231,046.91
- **Total Supply:** 68,097,489.96 mGLOBAL — 18 decimals, via `totalSupply()` on the [token contract](https://etherscan.io/address/0x7433806912Eae67919e66aea853d46Fa0aef98A8) at block 25,822,232. All supply is on Ethereum; no non-Ethereum mGLOBAL deployment exists
- **Token Price:** $1.01664609 (oracle round 5, [set August 20, 2026](https://etherscan.io/tx/0x7600447f1393f66f7403c04c4b746e47efce5e7d2451596d04f74a07e6b5f6db)). Realized return since the $1.00 launch price is **+1.6646%**, an annualized ~6.3% over the accruing period; SumCap reports a trailing **7.13% APY**
- **Decimals:** 18 (not 6 as typical for Midas tokens)
- **Token Name:** "Midas Fasanara Global" — explicitly naming Fasanara as the strategy partner
- **Holders (16 addresses hold a non-zero balance):**
  - **[Aave Horizon aMGLOBAL](https://etherscan.io/address/0x49d3cdE03813eE32DFD47F6aA3957d5F9CbAB985):** **44.05%** (29,999,999.00 mGLOBAL) — mGLOBAL supplied as collateral on the permissioned [Aave Horizon RWA market](https://app.aave.com/reserve-overview/?underlyingAsset=0x7433806912eae67919e66aea853d46fa0aef98a8&marketName=proto_horizon_v3). The reserve sits **exactly at its 30M supply cap**, so this holder cannot grow further
  - ⚠ **[InfiniFi RWAEscrowRouter](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E):** **30.29%** (20,627,291.44 mGLOBAL) — InfiniFi's exposure. On [August 17, 2026](https://etherscan.io/tx/0xb4d8d9c153c8242adc6701c987709f9a372e29ea538f4990902d95ebad32abde) InfiniFi's `MidasFarm` ([`0xf4ea…cecf`](https://etherscan.io/address/0xf4ea3ec87b1c254f17a2fb68164db0caf6c4cecf)) transferred its entire position into this `RWAEscrowRouter`, which reports `core()` = [`InfiniFiCore`](https://etherscan.io/address/0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490) and `keeper()` = [`RWAEscrowRateManager`](https://etherscan.io/address/0x11F6FAb3f4D8635880C3e80cbae8AEF8136D4189). The router values the position offchain (`totalAssets()` = 21,075,436.16 USDC) and reports `liquidity()` = 0. See the [InfiniFi report](https://github.com/yearn/risk-score/blob/master/reports/report/infinifi.md)
  - **[EOA `0x0dfa…8319`](https://etherscan.io/address/0x0dfa220249fccc15fd19e7c7fa3198f4742b8319):** **14.48%** (9,863,541.98 mGLOBAL) — externally owned account with nonce 0 (has never sent a transaction), consistent with a custodied or omnibus position
  - **[Gnosis Safe `0xaB05…fe6F`](https://etherscan.io/address/0xaB05c0DB9D26e96A9dcEDCAFCA23341316F6fe6F):** **3.58%** (2,435,957.20 mGLOBAL) — 3-of-n multisig
  - **[RedemptionVaultWithSwapper](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7):** **2.94%** (2,000,001.74 mGLOBAL) — protocol-held swap inventory
  - Unwrapping the Aave Horizon aToken to its underlying suppliers, the largest **beneficial** owner is InfiniFi at 30.29%, followed by [`0x882C…EDb7`](https://etherscan.io/address/0x882C825405fBBE45DCc1ad52b639aFbC4592EDb7) at 26.11% (619,305.39 held directly plus 17,164,227.35 supplied to Horizon) and [`0x0dfa…8319`](https://etherscan.io/address/0x0dfa220249fccc15fd19e7c7fa3198f4742b8319) at 14.48%
- **KYC'd addresses:** 98 hold `M_GLOBAL_GREENLISTED_ROLE`, added continuously since April 2026
- **Creation:** [Block 24798265](https://etherscan.io/tx/0xacc1f08c1f1ea036fa35444b67328ae3d3098d6cbbc520eacc81116156eb7772) (April 3, 2026 — ~4.7 months in production)
- **Midas Platform TVL:** ~$152.9M per [DeFiLlama](https://defillama.com/protocol/midas-rwa) (August 24, 2026); mGLOBAL is ~45% of it
- **KYC Required:** Yes (greenlist enforced onchain via `GREENLISTED_ROLE` / `M_GLOBAL_GREENLISTED_ROLE`)

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
| **Second RedemptionVaultWithSwapper** (staged, unfunded) | [`0xdbd621e67d9cffffcdcd316a27285f657c178e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76) | [`0xe98a4fb7a2e87ad888ccef0587dc820cf1a7cabb`](https://etherscan.io/address/0xe98a4fb7a2e87ad888ccef0587dc820cf1a7cabb) |

**Second swapper vault (staged):** [`0xdbd621e6…8e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76) shares the RedemptionVaultWithSwapper implementation and was granted `M_GLOBAL_BURN_OPERATOR_ROLE` on [August 12, 2026](https://etherscan.io/tx/0x8cff72082df0ec3a239cde44bc40efd1fe608945bae172e347f62bd0f3a91524). It holds no USDC and no mGLOBAL, and it is **not configured for production**: `mTbillRedemptionVault()` and `liquidityProvider()` both return the sentinel `0xFFfF…FFfF`, `instantFee()` is 0, and `instantDailyLimit()` is `type(uint256).max` (versus 50 bps and a 2,000,000-token daily cap on the two live vaults). It is unpaused. A burn-authorized contract left in an unhardened, uncapped state is a live surface that should either be configured or have its burn role revoked — see [Monitoring](#monitoring).

**Cross-chain status:** mGLOBAL is Ethereum-only. The token address holds no code on Base, Arbitrum, Polygon, or Sonic; it does not appear in the [LayerZero OFT registry](https://metadata.layerzero-api.com/v1/metadata/experiment/ofts/list); [RWA.xyz](https://app.rwa.xyz/assets/mGLOBAL) lists only Ethereum; and no bridge adapter holds mGLOBAL mint or burn authority (see [Token Mint Authority](#token-mint-authority)).

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

- **Critical note:** Auditors explicitly flagged the protocol as **"highly centralized"** with system admins controlling all critical roles

**Smart Contract Complexity:** Low-Moderate

- mGLOBAL extends the standard Midas token (ERC-20 with pausable, role-controlled mint/burn)
- Adds Aave integration for idle capital in vaults (deposits USDC into Aave)
- Uses MGlobalCustomAggregatorFeedGrowth oracle wrapping Chainlink's AggregatorV3 interface — **not** a Chainlink data feed
- Additional PriceRaised / PriceLowered bound feeds (currently without role holders)
- Access control via shared MidasAccessControl contract

### Bug Bounty

- **$1,000,000 USD** total allocated across two platforms per [Midas docs](https://docs.midas.app/security/smart-contract-security):
  - **[Sherlock Bug Bounty](https://audits.sherlock.xyz/bug-bounties/122)** — Live since March 31, 2026. Max payout: $500,000
  - **[Cantina Bug Bounty](https://cantina.xyz/bounties/d77405e5-99ce-4ba5-846c-885820b030e1)** — Live since March 23, 2026. Max payout: $500,000

## Historical Track Record

- **Production History:** mGLOBAL token created on Ethereum [April 3, 2026](https://etherscan.io/tx/0xacc1f08c1f1ea036fa35444b67328ae3d3098d6cbbc520eacc81116156eb7772) (~4.7 months in production). Midas platform launched with mTBILL in mid-2024 (~2 years total)
- **TVL Growth:** Midas grew from ~$4M (July 2024) to a peak of ~$927.8M (October 27, 2025), then fell to a 2026 trough around ~$89.8M (August 6, 2026) before recovering to ~$152.9M (August 24, 2026). See [DeFiLlama](https://defillama.com/protocol/midas-rwa)
- **mGLOBAL Market Cap:** ~$69.23M (August 24, 2026), ~45% of Midas total TVL. Supply has grown steadily since launch: 74,344,745.20 mGLOBAL minted and 6,247,255.24 burned to date, for a net 68,097,489.96 outstanding
- **Price History:** the oracle has published **five rounds** since deployment, all from the same updater EOA:

  | Round | Date | Price | Setter |
  |---|---|---|---|
  | 1 | [April 5, 2026](https://etherscan.io/tx/0x45c0c4f317741d476578eba17e747df898834afb05a50e806b14bff75396eaca) | $1.00000000 | `setRoundData` |
  | 2 | [May 15, 2026](https://etherscan.io/tx/0x08076ea85feaac9198f8462badd0946323ac33fa98a9cc4b6afc0e587f374d4d) | $1.00000000 | `setRoundDataSafe` |
  | 3 | [June 29, 2026](https://etherscan.io/tx/0xb5a89445753a3b14be749ff7590b0a81e32c4166975a1e5327a57ec70cddcc81) | $1.00576480 | `setRoundDataSafe` |
  | 4 | [July 23, 2026](https://etherscan.io/tx/0x029dcad255abca1cf02dccbacae8a29f37a31c959b129688690e029591169fb0) | $1.01128145 | `setRoundDataSafe` |
  | 5 | [August 20, 2026](https://etherscan.io/tx/0x7600447f1393f66f7403c04c4b746e47efce5e7d2451596d04f74a07e6b5f6db) | $1.01664609 | `setRoundDataSafe` |

  Yield accrual began with round 3. From May 15 to August 20 the price rose 1.6646%, an annualized ~6.3%; the three accruing intervals annualize to 4.68%, 8.32%, and 6.91% respectively. Update cadence is roughly monthly (24–45 day gaps), materially slower than mHYPER's twice-weekly cadence, so the published price can lag the true NAV by weeks
- **No known security incidents** for mGLOBAL or the Midas platform

**Fasanara Capital Track Record:**

- **Fasanara Capital Ltd** — institutional asset manager headquartered at 4th Floor, 25 Argyll Street, London W1F 7TU. Founded **2011** (~15 years operating history)
- **AUM:** Crossed **$4B** in 2022 per [Fasanara website](https://www.fasanara.com/about)
- **CEO:** Francesco Filia, ex-Managing Director & EMEA Head of Mid Caps at Bank of America Merrill Lynch
- **Team:** 40+ named professionals across leadership, investment, origination, quant/technology, legal, risk, and operations ([team page](https://www.fasanara.com/team))
- **Regulatory:** Fasanara Capital Ltd is **FCA Authorised** since [12 August 2011](https://register.fca.org.uk/s/firm?id=001b000000NMar0AAD), Firm Reference Number [551020](https://register.fca.org.uk/s/firm?id=001b000000NMar0AAD), Companies House [07561210](https://find-and-update.company-information.service.gov.uk/company/07561210). Type: regulated. The firm's MiFID permissions scope is on the FCA register (specific activities/product types need manual review of the full record). Also publishes a [MIFIDPRU Disclosure](https://www.fasanara.com/) consistent with its regulatory status
- **Business:** Two main pillars — Fintech Lending (141 loan originators across 60+ countries, $115bn+ total volumes traded per [Fasanara lending](https://www.fasanara.com/lending)) and Digital Assets. EU SFDR Article 8 classified funds for certain Alternative Credit sub-funds
- **Flagship strategy:** The [Global Diversified Alternative Debt Fund](https://www.fasanara.com/lending) (the multi-strategy receivables flagship that mGLOBAL's "Global Fund" mirrors) has ~10.5 years of history and $3B+ dedicated AUM. Fasanara reports ~$4.5–5.5B firm-wide AUM ([Alternatives Watch interview, 2024](https://www.alternativeswatch.com/2024/07/29/interview-alternative-credit-manager-fasanara-francesco-filia-fintech-lending/))
- **Track record:** 15-year operating history. ESG initiatives (Sustainability Report 2025 published). No known regulatory actions or incidents found
- **mGLOBAL strategy (documented, not onchain-verifiable):** Per [RWA.xyz](https://app.rwa.xyz/assets/mGLOBAL) and [Fasanara](https://www.fasanara.com/lending), mGLOBAL gives exposure to Fasanara's "Global Fund," which follows the same strategy as the Global Diversified Alternative Debt Fund: an asset-backed lending portfolio investing primarily in **short-dated trade receivables, digital invoices, and SME loans** bought from a network of ~141 fintech originators. The 97.03% "Unclassified" label reflects that these are offchain receivables (not onchain protocol positions), so the *strategy* is documented but the *specific allocation* (originators, geographies, sectors, delinquency/loss rates for this vehicle) is not disclosed or verifiable. See [Funds Management](#funds-management)

## Funds Management

Fasanara Capital is the strategy manager for mGLOBAL. Unlike mHYPER which uses Hyperithm for market-neutral DeFi strategies, mGLOBAL's yield comes from **offchain private credit** — and while the *strategy* is now documented (below), **the position-level allocation and current credit metrics for the mGLOBAL pool cannot be fetched or verified onchain**. mGLOBAL integrates with **Aave** at the vault level (DepositVault and RedemptionVault both use Aave for idle capital).

### Underlying Strategy & Yield Source (documented)

Where the funds end up, and what generates the yield (per [Fasanara lending](https://www.fasanara.com/lending), [RWA.xyz](https://app.rwa.xyz/assets/mGLOBAL), [Hedge Fund Journal](https://thehedgefundjournal.com/fasanara-capital-digital-finance-smart-fintech-lending/), and [Alternatives Watch](https://www.alternativeswatch.com/2024/07/29/interview-alternative-credit-manager-fasanara-francesco-filia-fintech-lending/)):

- **Capital flow:** USDC deposit → Midas DepositVault (mints mGLOBAL) → Fordefi tri-party MPC custody → Fasanara's "Global Fund" (mirrors the Global Diversified Alternative Debt Fund) → purchase of short-dated **trade receivables, digital invoices, and SME loans**.
- **What earns the yield:** This is **asset-backed private credit / trade-finance income**, not DeFi yield or T-bills. Fasanara buys invoices/receivables at a discount; when the SME obligor repays at face value (typically within ~3 months), the spread is the return. Fasanara sits at the top of a **hub-and-spoke network of ~141 fintech originators across 60+ countries** ($115bn+ total volume) that source the underlying borrowers — Fasanara is the capital provider, not the originator.
- **Risk profile of the assets:** ~3-month average duration, self-liquidating; **no leverage** on most vehicles; 10,000+ obligors per fund (claimed 20–30× more diversified than a CLO); proprietary credit scoring (Fasanara Credit Model / Debtor Rating); first-loss structuring and **credit insurance** (e.g. the Allianz Trade partnership). Fund-level target return is ~10–20% net p.a. depending on the sleeve.
- **How yield reaches holders:** each NAV publication raises the oracle price; there is no distribution or rebase. Every round to date has carried `growthApr = 0`, so the price is a step function that jumps on update and is flat in between — it does not accrue continuously. Onchain data confirms the *published* price but cannot verify the underlying profit that justifies it.
- **Residual gap:** This describes *what kind* of credit risk backs mGLOBAL (defensive: short-dated, insured, unlevered, diversified SME trade finance), but **not whether this specific book is healthy** — no attested per-vehicle allocation, geography/sector mix, or delinquency/loss data is disclosed. Verifiability, not strategy legitimacy, remains the binding constraint.

- **Fund Manager:** [Fasanara Capital Ltd](https://www.fasanara.com/) (London, founded 2011, AUM $4B+) — one of Europe's largest fintech-focused asset managers
- **Strategy Allocations (per [SumCap / Delta Y](https://midas.sumcap.xyz/mglobal), August 23–24, 2026 window):**
  - **Unclassified: $67,177,041.40 (97.03%)** — offchain/opaque positions not attributable to specific onchain protocols
  - **USDC on Aave V3: $2,053,999.71 (2.97%)** — the only protocol-classified position
  - **ETH: $5.80 (0.00%)** — dust
  - **NAV:** $69,231,046.91; **Price:** $1.016646; **APY:** 7.13%
  - SumCap methodology: \"NAV is computed as the maximum between total onchain supply × most recent oracle price and NAV tracked by Delta Y across all vault allocator addresses\"
  - ⚠ **97.03% of mGLOBAL NAV is unclassified** — the classified share has shrunk as the vehicle has grown, and the offchain book is now almost the entire portfolio
  - ⚠ **Reconciliation gap:** Delta Y attributes $2.05M to Aave V3, but the RedemptionVaultWithAave independently holds **$6,237,620 of aUSDC** onchain (verified via `balanceOf` on [aEthUSDC](https://etherscan.io/address/0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c)). The two figures measure different address sets and do not tie out; treat the Delta Y protocol split as indicative rather than a complete onchain census
- **Custody:** Fordefi MPC custody with tri-party quorum per [Fordefi case study](https://web.fordefi.com/customer-stories/how-midas-brings-tokenized-investment-opportunities-on-chain-with-fordefis-defi-native-custody-2ti85) (Midas + Fasanara + independent signer)
- **Aave Integration:** the RedemptionVaultWithAave holds **$6,237,620 aUSDC** — idle redemption capital verifiably deployed on blue-chip DeFi and, unlike the offchain book, independently auditable. This is ~9.0% of NAV. The DepositVault currently holds no USDC or aUSDC
- **NAV process:** NAV is supplied by Fasanara, reviewed by Midas, then published onchain by the oracle updater EOA. The oracle is current — last updated **August 20, 2026, ~3.4 days before this snapshot** — on a roughly monthly cadence

### Accessibility

- **KYC Required:** Yes — users must complete KYC/AML screening. Once approved, added to onchain greenlist via `GREENLISTED_ROLE` / `GREENLIST_OPERATOR_ROLE`
- **Minting:** Deposit USDC, receive mGLOBAL tokens at oracle price ($1.00). Via `MGlobalDepositVaultWithAave`
- **Redemption:** two live paths, both holding `M_GLOBAL_BURN_OPERATOR_ROLE`, both unpaused, both accepting USDC only:
  - **MGlobalRedemptionVaultWithAave** — primary vault; idle capital sits in Aave ($6,237,620 aUSDC). `instantDailyLimit` 2,000,000 mGLOBAL/day, `instantFee` 50 bps, `variationTolerance` 200 bps, greenlist enforced, Chainalysis-style `sanctionsList` set to [`0x40C5…c8fb`](https://etherscan.io/address/0x40C57923924B5c5c5455c48D93317139ADDaC8fb)
  - **MGlobalRedemptionVaultWithSwapper** — secondary vault holding 2,000,001.74 mGLOBAL of swap inventory and $0.73 USDC. Same 2,000,000/day limit and 50 bps instant fee; routes through the mTBILL redemption vault [`0x569D…f0Ec`](https://etherscan.io/address/0x569D7dccBF6923350521ecBC28A555A500c4f0Ec) with liquidity provider [`0x0461…B846`](https://etherscan.io/address/0x0461bD693caE49bE9d030E5c212e080F9c78B846)
  - A third vault ([`0xdbd621e6…8e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76)) holds burn authority but is unfunded and unconfigured — see [Contract Addresses](#contract-addresses)
  - Combined instant capacity is therefore bounded by the 2,000,000 mGLOBAL/day per-vault cap and, in practice, by the $6.24M of aUSDC actually held
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

**Per-address mint authority** (enumerated from `RoleGranted`/`RoleRevoked` on [MidasAccessControl](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B) and confirmed with `hasRole`, block 25,822,232):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) | ✓ | ✓ | `M_GLOBAL_MINT_OPERATOR_ROLE` + `M_GLOBAL_BURN_OPERATOR_ROLE` + `M_GLOBAL_PAUSE_OPERATOR_ROLE` + `BLACKLIST_OPERATOR_ROLE` + `GREENLIST_OPERATOR_ROLE` | EOA, nonce 8. Per Midas pattern, claimed as Fordefi MPC (not verifiable onchain) |
| [`0xce29c36c6d4556f2d01d79414c1354b968dddef1`](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1) | ✓ | — | `M_GLOBAL_MINT_OPERATOR_ROLE` | MGlobalDepositVaultWithAave (proxy). Mints when users deposit USDC |
| [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) | — | ✓ | `M_GLOBAL_BURN_OPERATOR_ROLE` | MGlobalRedemptionVaultWithAave (proxy) |
| [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) | — | ✓ | `M_GLOBAL_BURN_OPERATOR_ROLE` | MGlobalRedemptionVaultWithSwapper (proxy) |
| [`0xdbd621e67d9cffffcdcd316a27285f657c178e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76) | — | ✓ | `M_GLOBAL_BURN_OPERATOR_ROLE` | Second swapper vault, [granted August 12, 2026](https://etherscan.io/tx/0x8cff72082df0ec3a239cde44bc40efd1fe608945bae172e347f62bd0f3a91524). Unfunded and unconfigured (sentinel `0xFFfF…FFfF` addresses, 0 fee, uncapped daily limit) |

No bridge adapter, OFT adapter, or CCIP token pool holds mint or burn authority — mGLOBAL is not a cross-chain token.

**Mint-role grants bypass the 48-hour timelock entirely.** Either of the two `DEFAULT_ADMIN_ROLE` holders can grant themselves `M_GLOBAL_MINT_OPERATOR_ROLE` and mint unbacked tokens in two transactions with zero delay.

### Collateralization

- **Backing Model:** Offchain / hybrid — mGLOBAL is a **subordinated debt instrument** of Midas Software GmbH, not a direct claim on underlying assets
- **Collateral Quality:** per [SumCap / Delta Y](https://midas.sumcap.xyz/mglobal) (August 24, 2026): **97.03% Unclassified** (offchain/opaque) and 2.97% USDC on Aave V3. The unclassified portion cannot be assessed for quality and is now almost the entire portfolio — this is the primary collateralization concern. Independently verifiable onchain backing is limited to the $6,237,620 of aUSDC in the RedemptionVaultWithAave (~9.0% of NAV)
- **Verifiability:** Hybrid. The Aave integration in vaults provides partial onchain visibility of idle capital. Full strategy portfolio composition requires offchain reporting
- **Risk Curation:** Fasanara has discretion over allocation within the strategy framework. Midas enforces policy limits via Fordefi policy engine
- **Tri-Party Governance (via Fordefi):** Per Fordefi case study: Midas Treasury + Fasanara (Asset Manager) + Independent Oversight Signer. Operations within predefined rules clear automatically; anything outside routes to tri-party quorum
- **Legal Structure:** LYT holders are **subordinate creditors** of Midas Software GmbH (German GmbH, HRB 254645 B, Berlin-Charlottenburg). Per the [Midas legal structure docs](https://docs.midas.app/legal/legal-structure), Midas offers two structures: Luxembourg securitisation (bankruptcy-remote) and German GmbH. mGLOBAL uses the **German GmbH structure** — no statutory asset segregation or bankruptcy remoteness. This matches mHYPER's structure

### Provability

- **Reserve Transparency:** Hybrid. The shared Midas [Attestation Engine](https://docs.midas.app/transparency/the-midas-attestation-engine) (SAVE, introduced March 2026) adds a multi-party verification layer via three contracts: [KeystoneForwarder](https://etherscan.io/address/0x0b93082D9b3C7C97fAcd250082899BAcf3af3885), [SaveCreReceiverProxy](https://etherscan.io/address/0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6), and [MidasSaveRegistryWithClaim](https://etherscan.io/address/0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d). The registry stores hashes only — not actual reserve data or NAV
- **NAV/Price Updates:** the token price is set via a privileged role on the `MGlobalCustomAggregatorFeedGrowth` oracle ([`0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38`](https://etherscan.io/address/0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38)). Current price $1.01664609 at round 5, published August 20, 2026 — **3.4 days before this snapshot**. Full round history is tabulated in [Historical Track Record](#historical-track-record). Cadence is roughly monthly against mHYPER's twice-weekly, so the onchain price can trail true NAV by weeks
- **Oracle Bounds:** `maxAnswerDeviation` = 100000000 ($1.00 — a 100% move permitted per update), `minAnswer` = $0.10, `maxAnswer` = $1,000. `minGrowthApr` = `maxGrowthApr` = 0, so no interpolated growth is permitted; the price is a step function that only changes when a round is published. `onlyUp` is **true**
- ⚠ **The deviation cap and the `onlyUp` guard are not enforced on the admin path.** The oracle exposes two setters. `setRoundDataSafe(int256,uint256,int80)` checks the deviation against `maxAnswerDeviation`, enforces `onlyUp`, and requires at least an hour since the last update — but it then calls `setRoundData(int256,uint256,int80)`, which is itself `public onlyAggregatorAdmin` and validates **only** that the answer is within `[minAnswer, maxAnswer]`, that `growthApr` is within `[minGrowthApr, maxGrowthApr]`, and that the data timestamp is in the past. The oracle admin can therefore call `setRoundData` directly and set any price between **$0.10 and $1,000 in a single transaction**, in either direction, with no deviation limit and no hourly spacing. Round 1 was in fact written through the raw `setRoundData` path ([selector `0x2b6e02c7`](https://etherscan.io/tx/0x45c0c4f317741d476578eba17e747df898834afb05a50e806b14bff75396eaca)); rounds 2–5 used `setRoundDataSafe` (selector `0x92260352`). The safe path is an operational convention, not an invariant
- ⚠ **`onlyUp` blocks markdowns on the safe path.** Because `onlyUp` is true, `setRoundDataSafe` rejects any downward revision, so a credit impairment in Fasanara's receivables book cannot be reflected through the routine update path. NAV can only ratchet upward unless the admin switches to the raw setter. A stale-high price lets early redeemers exit at more than the assets are worth, concentrating the loss on whoever remains — the classic first-mover run dynamic for an unlisted, redemption-only instrument
- **Oracle Model:** Uses MGlobalCustomAggregatorFeedGrowth with separate PriceRaised ([`0x494f142c35167cfbdd3887e8d7897822e63c9618`](https://etherscan.io/address/0x494f142c35167cfbdd3887e8d7897822e63c9618)) and PriceLowered ([`0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f`](https://etherscan.io/address/0x4c825154d02eafab7f3c779d96c279bcdb9fcf6f)) bound feeds. These appear to define upper/lower acceptable price bounds, but currently have **no role holders assigned** — suggesting this safety feature is not yet active
- **Attestation Engine Data:** The registry stores proof IDs, attestation hashes, claim hashes, verifier hashes, timestamps, and attestor/verifier addresses. It does **not** expose actual reserve data or an onchain URI/CID
- **Third-Party Verification:** Per Midas docs, the Attestation Engine uses LlamaRisk and Canary Protocol as independent verifiers

## Liquidity Risk

- **DEX Liquidity:** **Zero.** No Uniswap V3 pool exists for mGLOBAL/USDC at the 100, 500, 3000, or 10000 bps tiers via the [Uniswap V3 Factory](https://etherscan.io/address/0x1F98431c8aD98523631AE4a59f267346ea31F984), and no Uniswap V2 pair exists via the [V2 Factory](https://etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f). There is no secondary market; exit is entirely dependent on Midas redemption infrastructure
- **Aave Horizon collateral reserve — now at its cap:** mGLOBAL is an active collateral reserve on the permissioned [Aave Horizon RWA market](https://app.aave.com/reserve-overview/?underlyingAsset=0x7433806912eae67919e66aea853d46fa0aef98a8&marketName=proto_horizon_v3) (Pool [`0xAe05…32C8`](https://etherscan.io/address/0xAe05Cd22df81871bc7cC2a04BeCfb516bFe332C8), aMGLOBAL [`0x49d3…B985`](https://etherscan.io/address/0x49d3cdE03813eE32DFD47F6aA3957d5F9CbAB985)). Current reserve configuration, decoded from `getConfiguration`: `usageAsCollateral` true, **LTV 0.05%**, **liquidation threshold 0.10%**, liquidation bonus 6%, reserve factor 0%, borrowing of mGLOBAL disabled, not frozen and not paused. The credit extendable against mGLOBAL is therefore still effectively **zero**.
  - The **supply cap was reduced from 50,000,000 to 30,000,000 on [July 2, 2026](https://etherscan.io/tx/0x8f4a77b86f71129e8acc7452494a732150c963fbbef50d670d958ee3ea668acf)** (it had been [raised from 0 to 50M on June 23, 2026](https://etherscan.io/tx/0xc03ba2579c8217ddf090fdc3aa3e322c86b3a116f97fc2ed00f40e1f2ed526eb)), and the reserve now sits at **29,999,999 of 30,000,000** — fully saturated. The curator tightened the limit rather than extending credit, and no further mGLOBAL can be supplied. This closes what had been the main source of incremental demand
  - Horizon is **not an exit venue**: suppliers must withdraw and then redeem through Midas
  - Horizon prices mGLOBAL through a Chainlink OCR2 feed, "mGlobal NAV - Aave Llamaguard" ([aggregator `0x61b3…1460`](https://etherscan.io/address/0x61b35E8fD649992e184FC3e619E6899c0e851460) behind proxy [`0xe034…E939`](https://etherscan.io/address/0xe034De753a3d855B6daD1A4984de75a5c443E939)), with **16 transmitters** and updates every few hours (round 73, last written 8.6 hours before this snapshot) against the Midas oracle's monthly cadence. The DON improves availability and adds an attestation layer, but it *tracks* the Midas NAV — it does not value the book independently, so a bad Midas print still propagates into Aave. The feed itself carries no meaningful bounds (`minAnswer` 0, `maxAnswer` effectively unbounded)
- **Primary Exit:** the two live Midas redemption vaults. Instant redemption is capped at **2,000,000 mGLOBAL per vault per day** with a **50 bps** fee; larger exits go through the request/approval flow processed offchain by Midas
- **Onchain redemption liquidity:** the RedemptionVaultWithAave holds **$6,237,620 of aUSDC** — real, verifiable instant-redemption backing worth ~9.0% of NAV, and a structural improvement over an empty vault. The RedemptionVaultWithSwapper holds $0.73 USDC plus 2,000,001.74 mGLOBAL of swap inventory; the DepositVault and the staged third vault hold nothing. Anything beyond ~$6.2M still depends on Fasanara unwinding offchain receivables
- **Holder Concentration (MODERATE):** the largest beneficial holder is **InfiniFi at 30.29%** (20,627,291.44 mGLOBAL, ~$21M), followed by [`0x882C…EDb7`](https://etherscan.io/address/0x882C825405fBBE45DCc1ad52b639aFbC4592EDb7) at 26.11% and [`0x0dfa…8319`](https://etherscan.io/address/0x0dfa220249fccc15fd19e7c7fa3198f4742b8319) at 14.48%. Only 16 addresses hold a non-zero balance, so the holder base is small even where it is no longer dominated by one name. A single 30% holder exiting would require roughly $21M against ~$6.2M of instant capacity — still a forced offchain unwind, but no longer an all-or-nothing dependency on one counterparty
- **InfiniFi exposure has changed shape, not size:** InfiniFi did not redeem. On [August 17, 2026](https://etherscan.io/tx/0xb4d8d9c153c8242adc6701c987709f9a372e29ea538f4990902d95ebad32abde) its `MidasFarm` moved the entire position into an InfiniFi [`RWAEscrowRouter`](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E), which values the holding offchain via the `RWAEscrowRateManager` keeper and reports `liquidity()` = 0. From mGLOBAL's side the exposure is unchanged in size; from InfiniFi's side it is now booked as an offchain-attested escrow rather than a tokenized farm, which reduces transparency on both ends and removes the fixed maturity date that previously gave advance warning of an exit
- **Stress Performance:** no forced-redemption stress event has occurred. The June 2026 InfiniFi farm maturity passed without a redemption, and the August transfer into the escrow router likewise moved the position without touching Midas redemption capacity — so the exit path has still never been tested at size

## Centralization & Control Risks

### Governance

- **Contract Upgradeability:** Yes — all contracts use `TransparentUpgradeableProxy` with shared `ProxyAdmin` at [`0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC)
- **ProxyAdmin Owner:** [`MidasTimelockController`](https://etherscan.io/address/0xE3EEe3e0D2398799C884a47FC40C029C8e241852) — a verified OpenZeppelin `TimelockController` with a **48-hour minimum delay**. Contract upgrades must be proposed, wait 48 hours, then executed. Every mGLOBAL proxy implementation matches the addresses in [Contract Addresses](#contract-addresses); none has been upgraded since deployment
- **Shared timelock queue:** the timelock serves all Midas products and has processed 87 scheduled operations (82 executed, 3 cancelled). Two operations scheduled August 18, 2026 are **pending and past their 48-hour ETA** — both are `upgrade(proxy,impl)` calls targeting the mTBILL and mBASIS data feeds, not mGLOBAL contracts. Because the `ProxyAdmin` is shared, queue activity should be monitored even when the target is another product
- **Timelock Proposer/Executor/Canceller:** Gnosis Safe [`0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89`](https://etherscan.io/address/0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89) holds all three roles — **1/3 onchain threshold**, so any single Safe owner can propose, execute, or cancel. `TIMELOCK_ADMIN_ROLE` is held only by the timelock itself. `getMinDelay()` returns 172,800 seconds (48 hours). Safe owners:
  - [`0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f`](https://etherscan.io/address/0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f) — EOA. Per Midas, Fordefi MPC (3/n) — not verifiable onchain
  - [`0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7`](https://etherscan.io/address/0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7) — Nested Gnosis Safe (3/7)
  - [`0xC50BD8430545C80a681C7cb33E6560fB0Bd86880`](https://etherscan.io/address/0xC50BD8430545C80a681C7cb33E6560fB0Bd86880) — EOA. Per Midas, Fireblocks MPC (3/n) — not verifiable onchain
  - **Safe signer identities NOT checked** — only threshold and signer count verified, per assessment guidelines
- **Access Control:** Role-based via `MidasAccessControl` ([`0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B`](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B))
- **DEFAULT_ADMIN_ROLE holders (2):** Two addresses hold `DEFAULT_ADMIN_ROLE` on MidasAccessControl — **role changes (mint/burn/pause/blacklist grants) bypass the timelock** and can be executed immediately:
  - The 1/3 Gnosis Safe ([`0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89`](https://etherscan.io/address/0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89))
  - [`0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227`](https://etherscan.io/address/0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227) — EOA, nonce 375. [Per Midas](https://docs.midas.app/security/smart-contract-security#midas-controller), Fordefi MPC (3/n) — not verifiable onchain
  - **Either of the two remaining admins can grant/revoke any role with no timelock.** Midas states they are working on gating specific functions behind a timelock
- **Governance Model:** No onchain governance. Midas controls all admin functions
- **Privileged Roles:**
  1. **`M_GLOBAL_MINT_OPERATOR_ROLE`** (`0x86c2e8326862f916bf4ee800260d2306dc3c829808f94feb79f6d3a20aaf9bc2`) — Can mint unlimited mGLOBAL tokens. **The `mint()` function has no onchain collateral check** — it only verifies the caller has the mint role. Currently held by:
    - [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) — EOA, nonce 3. Per Midas pattern, Fordefi MPC (not verifiable). Also holds BURN, PAUSE, BLACKLIST_OP, GREENLIST_OP roles
    - [`0xce29c36c6d4556f2d01d79414c1354b968dddef1`](https://etherscan.io/address/0xce29c36c6d4556f2d01d79414c1354b968dddef1) — MGlobalDepositVaultWithAave (mints when users deposit USDC)
  2. **`M_GLOBAL_BURN_OPERATOR_ROLE`** — Can burn mGLOBAL tokens from any address. Held by four addresses:
    - [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361) — same EOA as above (Fordefi MPC)
    - [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) — MGlobalRedemptionVaultWithAave (proxy)
    - [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) — MGlobalRedemptionVaultWithSwapper (proxy)
    - [`0xdbd621e67d9cffffcdcd316a27285f657c178e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76) — second swapper vault, unfunded and unconfigured (sentinel addresses, zero fee, uncapped daily limit)
  3. **`M_GLOBAL_PAUSE_OPERATOR_ROLE`** — Can pause/unpause the contract (freezing all transfers). Held by [`0x76e350c5a674db787918e5f728466c7356d4d361`](https://etherscan.io/address/0x76e350c5a674db787918e5f728466c7356d4d361)
  4. **`DEFAULT_ADMIN_ROLE`** — Can grant/revoke all other roles (held by 1/3 Safe + one EOA, no timelock). A compromised admin can grant itself the MINT role and mint unbacked tokens in two transactions
  5. **ProxyAdmin owner** — Can upgrade all contract implementations (via 48hr timelock)
  6. **Oracle updater** — Can set the NAV price via `M_GLOBAL_CUSTOM_AGGREGATOR_FEED_ADMIN_ROLE` (`0x9e02beae92a72aee37131404ba654d9d66746f20885ff63bd08d7b4b8864a54e`). Held by a single EOA: [`0x088a74de7df74e6a6eb832d28878a9f134ee4f05`](https://etherscan.io/address/0x088a74de7df74e6a6eb832d28878a9f134ee4f05) — nonce 12, no timelock on price updates. Because `setRoundData` is directly callable by this role and skips the deviation and `onlyUp` checks (see [Provability](#provability)), this single key can reprice mGLOBAL anywhere in $0.10–$1,000 in one transaction
  7. **`M_GLOBAL_DEPOSIT_VAULT_ADMIN_ROLE`** — Held by one EOA, [`0x2acb4bdcbef02f81bf713b696ac26390d7f79a12`](https://etherscan.io/address/0x2acb4bdcbef02f81bf713b696ac26390d7f79a12) (nonce 7,786 — an active operational key). Controls deposit-vault parameters
  8. **Greenlist/Blacklist operators — 53 EOAs each.** `GREENLIST_OPERATOR_ROLE` (`0x77c5b782…1999d`) and `BLACKLIST_OPERATOR_ROLE` (`0x2fdc6683…889ff`) are each held by the **same 53 externally owned accounts**, accumulated one at a time since December 2023 and still being added (most recently August 20, 2026). These are platform-wide Midas roles, not mGLOBAL-specific, and the token-specific `M_GLOBAL_GREENLIST_OPERATOR_ROLE` / `M_GLOBAL_BLACKLIST_OPERATOR_ROLE` variants are granted to nobody — so all greenlist and blacklist authority over mGLOBAL runs through this 53-key set. **Any one of the 53 can blacklist an arbitrary holder**, which under the token's transfer checks freezes that holder's balance and blocks redemption. For a KYC-gated instrument some operator breadth is expected, but 53 independent EOAs with unilateral freeze authority is a wide and poorly-bounded surface, and none of it is timelocked
     - `BLACKLISTED_ROLE` is currently held by exactly one address, [`0x3e2e66af…4436`](https://etherscan.io/address/0x3e2e66af967075120fa8be27c659d0803dff4436), blacklisted on October 15, 2025 — platform-wide and predating mGLOBAL
     - `M_GLOBAL_GREENLISTED_ROLE` (the mGLOBAL KYC allowlist) is held by 98 addresses
- **Fund Seizure / Unbacked Minting:** The mint operator can create tokens without depositing collateral (no onchain backing check). The burn operator can burn from any address. The blacklist/pause operators can freeze activity. Role grants bypass the timelock — either of the two `DEFAULT_ADMIN_ROLE` holders can grant themselves these roles immediately and unilaterally. `renounceRole` is disabled (always reverts) per shared MidasAccessControl code
- **Audit Assessment:** Hacken auditors explicitly flagged the protocol as **"highly centralized"** with system admins controlling all critical roles

### Programmability

- **System Operations:** Primarily offchain. Strategy execution, NAV calculation, and redemption processing are handled by Midas/Fasanara offchain
- **Oracle/NAV Updates:** the `MGlobalCustomAggregatorFeedGrowth` is written by a privileged role with far looser bounds than mHYPER (100% permitted deviation vs 0.35%), and the deviation bound is skippable entirely via the raw `setRoundData` path. The PriceRaised/PriceLowered bound feeds exist onchain but have no role holders — this safety feature remains inactive
- **PPS Definition:** The oracle price IS the PPS. It is updated by an admin role, not computed onchain from reserves. `onlyUp` prevents downward revisions on the guarded path, so the published PPS cannot reflect a loss without an explicit switch to the unguarded setter
- **Off-Chain Dependencies:** Critical
  - Fasanara's strategy execution and NAV reporting
  - Midas's redemption processing
  - KYC/AML verification (greenlist management)
  - Fordefi for MPC custody and transaction signing
- **Aave Integration (Positive):** mGLOBAL's vaults integrate with Aave for idle capital, providing some onchain visibility of deposited USDC

### External Dependencies

- **Fasanara Capital (Critical):** strategy management, NAV calculation, risk monitoring. Firm-level diligence is complete — FCA-authorised, $4B+ AUM, 15-year history, London-based, MIFIDPRU disclosure. What remains unverified is the mGLOBAL-specific mandate: **97.03% of NAV is unclassified**, so neither the position-level book nor its credit health can be checked. Fasanara is larger and more established than mHYPER's Hyperithm, but its transparency on this vehicle is materially lower
- **Fordefi (Critical):** MPC custody of underlying assets with tri-party MPC governance
- **Aave (Important):** two distinct relationships. (1) The RedemptionVaultWithAave holds $6,237,620 of aUSDC, so redemption float is verifiably on blue-chip DeFi rather than fully offchain — a structural advantage over mHYPER. (2) mGLOBAL is a **collateral reserve on Aave Horizon**, saturated at its 30M supply cap with LTV 0.05%, so Aave extends near-zero credit against it. Horizon consumes mGLOBAL's price through the Chainlink OCR2 "mGlobal NAV - Aave Llamaguard" feed ([`0xe034…E939`](https://etherscan.io/address/0xe034De753a3d855B6daD1A4984de75a5c443E939), $1.01664609), which mirrors the Midas NAV rather than valuing the book independently. The conservative LTV and the cap reduction both read as curator caution about exactly that dependency
- **InfiniFi (Important):** the single largest holder at 30.29%, now held through an [`RWAEscrowRouter`](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E) that marks the position offchain via a keeper rather than through the mGLOBAL oracle. Concentration risk runs in both directions: mGLOBAL depends on InfiniFi not exiting, and per the [InfiniFi report](https://github.com/yearn/risk-score/blob/master/reports/report/infinifi.md) InfiniFi's own backing is heavily dependent on this position
- **Strategy Counterparties:** specific counterparties cannot be verified; 97.03% of NAV is unclassified
- **Oracle:** NAV reported via custom contract (MGlobalCustomAggregatorFeedGrowth). **Not** a Chainlink data feed. Bound feeds (PriceRaised/PriceLowered) exist but have no active role holders
- **MidasAccessControl (Critical):** Shared across all Midas products. A failure or compromise of this contract would affect mGLOBAL alongside mHYPER, mTBILL, and other Midas tokens

## Operational Risk

- **Team:** **Shared with all Midas products.** Dennis Dinkelmeyer (CEO, ex-Goldman Sachs), Fabrice Grinda (Executive Chairman, co-founded OLX, FJ Labs), Romain Bourgois (CPO, ex-Ondo Finance). Team includes alumni from Goldman Sachs, Anchorage Digital, Capital Group
- **Investors:** Framework Ventures (lead), BlockTower, HV Capital, Coinbase Ventures, GSR, Hack VC, Cathay Ledger, 6th Man Ventures, FJ Labs, Lattice Capital. $8.75M seed (March 2024)
- **Documentation Quality:** Midas has comprehensive docs at docs.midas.app covering token mechanics, fees, risk management, smart contracts. **However, mGLOBAL-specific documentation is limited**
- **Legal Structure:** Midas Software GmbH, Pappelallee 78/79, 10437 Berlin, Germany (HRB 254645, LEI 984500BB00BN6D2B7C48). Incorporated June 2023. The issuer is **neither licensed nor registered** with the Liechtenstein FMA or any other supervisory authority
- **Base Prospectus — validity lapsed, renewal `TODO`:** the prospectus approved by FMA Liechtenstein on July 17, 2025 was valid **until July 17, 2026**, which has now passed. Whether a successor prospectus has been approved could not be confirmed: [docs.midas.app](https://docs.midas.app/legal/legal-structure) is behind a Cloudflare bot challenge and returns no content to automated retrieval, and the FMA prospectus register was not reachable from this environment. A lapsed base prospectus would constrain new public offers of the instrument in the EEA without affecting existing tokens onchain. **Confirm renewal directly with Midas before allocating**
- **Fasanara Due Diligence:** complete at the firm level (see Historical Track Record); open only on the mGLOBAL-specific mandate
- **Incident Response:** Midas demonstrated operational capability during the Stream Finance incident (processed $150M+ in redemptions within 48 hours)

## Monitoring

1. **Oracle/NAV Updates (CRITICAL)**
  - **Contract:** [`0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38`](https://etherscan.io/address/0x66aa9fcd63df74e1f67a9452e6e59fbc67f75e38) (MGlobalCustomAggregatorFeedGrowth)
  - **Monitor:** `AnswerUpdated` events, `latestRoundData()` / `latestRoundDataRaw()`, and — critically — **which setter was used**: calldata selector `0x2b6e02c7` (`setRoundData`, unguarded) versus `0x92260352` (`setRoundDataSafe`, guarded). Also watch `setOnlyUp`, `setMinGrowthApr`, `setMaxGrowthApr`
  - **Alert:** any use of the raw `setRoundData` selector; any downward price revision; any single-round move beyond ~1.5% (roughly two months of expected accrual); no update for >45 days (cadence has been 24–45 days); `onlyUp` being set to false
  - **Frequency:** Hourly

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
  - **Monitor:** `totalSupply()`, `Paused`/`Unpaused` events, large mint/burn events, `Blacklisted`/`Greenlisted` events
  - **Alert:** Supply change > 5% in 24 hours, pause events, any blacklist changes
  - **Frequency:** On event / daily
  - **Thresholds:** Mint > $1M, Burn > $1M, supply delta > 5%

6. **Vault Activity (RECOMMENDED)**
  - **Contracts:**
    - [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b) (RedemptionVaultWithAave)
    - [`0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7`](https://etherscan.io/address/0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7) (RedemptionVaultWithSwapper)
  - **Monitor:** Large redemptions, vault USDC balances
  - **Alert:** Redemptions >$5M in 24 hours, vault USDC balance <$100K
  - **Frequency:** Hourly

7. **Timelock Activity (RECOMMENDED)**
  - **Contract:** [`0xE3EEe3e0D2398799C884a47FC40C029C8e241852`](https://etherscan.io/address/0xE3EEe3e0D2398799C884a47FC40C029C8e241852) (MidasTimelockController)
  - **Monitor:** `CallScheduled`, `CallExecuted`, `CallCancelled` events
  - **Alert:** Any scheduled call (indicates pending contract upgrade)
  - **Frequency:** On event

8. **Aave Position Health (RECOMMENDED)**
  - **Contracts:** MGlobalDepositVaultWithAave and MGlobalRedemptionVaultWithAave
  - **Monitor:** Aave aUSDC balances held by mGLOBAL vaults
  - **Alert:** Significant aUSDC balance decrease (indicating withdrawal from Aave)
  - **Frequency:** Daily

9. **Aave Horizon Reserve (CRITICAL)**
  - **Contracts:** Horizon Pool [`0xAe05Cd22df81871bc7cC2a04BeCfb516bFe332C8`](https://etherscan.io/address/0xAe05Cd22df81871bc7cC2a04BeCfb516bFe332C8), aMGLOBAL [`0x49d3cdE03813eE32DFD47F6aA3957d5F9CbAB985`](https://etherscan.io/address/0x49d3cdE03813eE32DFD47F6aA3957d5F9CbAB985), price feed [`0xe034De753a3d855B6daD1A4984de75a5c443E939`](https://etherscan.io/address/0xe034De753a3d855B6daD1A4984de75a5c443E939)
  - **Monitor:** reserve config via `getConfiguration` (LTV, liquidation threshold, supply cap, frozen/paused flags), aMGLOBAL total supply against the cap, and the Llamaguard feed's `latestTimestamp`
  - **Alert:** any further supply-cap reduction (the curator already cut 50M → 30M and the reserve is at the cap, so a cut would force withdrawals); LTV or liquidation threshold raised above ~0.10%; reserve frozen, paused, or delisted; Llamaguard feed stale beyond ~24 hours or diverging from the Midas oracle price
  - **Frequency:** Daily / on event

10. **InfiniFi Concentration (CRITICAL)**
  - **Contract:** InfiniFi `RWAEscrowRouter` [`0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E`](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E)
  - **Monitor:** mGLOBAL `balanceOf` on the router, plus the router's `totalAssets()`, `liquidity()`, `paused()`, and `lastUpdatedAt()` (keeper freshness)
  - **Alert:** any balance decrease (redemption or transfer out), the router being paused, or the keeper attestation going stale. Unlike the previous `MidasFarm` structure this wrapper exposes **no maturity date**, so a drawdown gives no advance notice — monitor the balance itself
  - **Frequency:** Daily

11. **Redemption Capacity (CRITICAL)**
  - **Contracts:** RedemptionVaultWithAave [`0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b`](https://etherscan.io/address/0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b), aEthUSDC [`0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c`](https://etherscan.io/address/0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c)
  - **Monitor:** aUSDC `balanceOf` the redemption vault (currently $6,237,620), `instantDailyLimit()`, `instantFee()`, and `paused()` on both live vaults
  - **Alert:** aUSDC balance falling below ~$2M or below 3% of NAV; `instantDailyLimit` reduced; `instantFee` raised materially above 50 bps; either vault paused
  - **Frequency:** Hourly

12. **Staged Third Redemption Vault (RECOMMENDED)**
  - **Contract:** [`0xdbd621e67d9cffffcdcd316a27285f657c178e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76)
  - **Monitor:** `mTbillRedemptionVault()`, `liquidityProvider()`, `instantFee()`, `instantDailyLimit()`, token balances, and whether `M_GLOBAL_BURN_OPERATOR_ROLE` is retained
  - **Alert:** the sentinel `0xFFfF…FFfF` addresses being replaced (activation), any funding of the vault, or any burn executed through it while it remains uncapped and zero-fee
  - **Frequency:** On event

13. **Greenlist / Blacklist Operator Set (RECOMMENDED)**
  - **Contract:** [`0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B`](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B) (MidasAccessControl)
  - **Monitor:** `RoleGranted` / `RoleRevoked` for `GREENLIST_OPERATOR_ROLE` (`0x77c5b782…1999d`), `BLACKLIST_OPERATOR_ROLE` (`0x2fdc6683…889ff`), and `BLACKLISTED_ROLE` (`0x548c7f03…a8ed`)
  - **Alert:** the operator set growing beyond its current 53 members, or any address being added to `BLACKLISTED_ROLE` — a blacklist freezes the holder's balance and blocks redemption
  - **Frequency:** On event

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
│  │  MGlobalRedemptionVaultWithSwapper│  │  2nd SwapperVault (STAGED)       │  │
│  │  (TransparentProxy)              │  │  0xdbd621e6..8e76                │  │
│  │  0x1e0fd667..20d7                │  │                                  │  │
│  │  Holds 2,000,001.74 mGLOBAL      │  │  Has: BURN_OPERATOR_ROLE         │  │
│  │  Has: BURN_OPERATOR_ROLE         │  │  UNFUNDED / UNCONFIGURED         │  │
│  │  2M/day cap, 50 bps fee          │  │  sentinel 0xFFfF..FFfF, 0 fee,   │  │
│  │                                  │  │  uncapped daily limit            │  │
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
│  │  Price: $1.01664609 (r5, updated Aug 20 2026 — 3.4d)                 │    │
│  │  maxAnswerDeviation: 100% — and NOT enforced on setRoundData         │    │
│  │  minAnswer: $0.10, maxAnswer: $1,000  (the only hard bounds)         │    │
│  │  onlyUp: true — guarded path cannot mark NAV down                    │    │
│  │  minGrowthApr = maxGrowthApr = 0 (step function, no interpolation)   │    │
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
│  │  RedemptionVaultWithAave holds $6,237,620 aUSDC (~9.0% of NAV)      │    │
│  │  Aave Horizon: collateral reserve, SATURATED at 30M cap             │    │
│  │    LTV 0.05% / LT 0.10% — near-zero credit extended                 │    │
│  │    Price via Chainlink OCR2 "mGlobal NAV - Aave Llamaguard"         │    │
│  │    0xe034De75..E939 (16 transmitters) — mirrors Midas NAV           │    │
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
│  Additional BURN holders via M_GLOBAL_BURN_OPERATOR_ROLE (4 total):          │
│  ├─ RedemptionVaultWithAave 0xa0fc8bdfb1e6a705c1375810989b1d70a982b01b     │
│  ├─ RedemptionVaultWithSwapper 0x1e0fd66753198c7b8ba64edee8d41d8628bf20d7  │
│  └─ 2nd SwapperVault 0xdbd621e67d9cffffcdcd316a27285f657c178e76 (staged)   │
│                                                                              │
│  Oracle Updater EOA (sets NAV price, no timelock):                           │
│  └─ 0x088a74de7df74e6a6eb832d28878a9f134ee4f05 (nonce 12)                   │
│                                                                              │
│  Greenlist + Blacklist operators: 53 EOAs (each holds BOTH roles)            │
│  └─ platform-wide; token-specific M_GLOBAL_* variants granted to nobody     │
│                                                                              │
│  ⚠ Role changes bypass timelock (only upgrades go through 48h)              │
│  ⚠ mint() has no onchain collateral check                                   │
│  ⚠ setRoundData() skips maxAnswerDeviation AND onlyUp → $0.10–$1,000       │
│  ⚠ onlyUp=true → guarded path can never report a NAV loss                   │
│  ⚠ Any 1 of 53 blacklist operators can freeze a holder, no timelock         │
│  ⚠ PriceRaised/PriceLowered bound feeds have NO role holders (inactive)     │
│  ⚠ Either of 2 DEFAULT_ADMIN can grant MINT → unbacked tokens              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → DepositVault mints mGLOBAL at the oracle price
($1.01664609). Redemption float sits in Aave as aUSDC. Active strategy funds go to
Fasanara via Fordefi custody for offchain execution; 97.03% of NAV is unclassified.
NAV/price is published by the oracle updater EOA roughly monthly. Users redeem via
RedemptionVaultWithAave or RedemptionVaultWithSwapper (2,000,000/day each, 50 bps).
```

---

## Risk Summary

### Key Strengths

- **Doxxed Midas team with institutional backing** — Goldman Sachs / Morgan Stanley alumni, backed by Coinbase Ventures, Framework Ventures, BlockTower
- **Established strategy manager** — Fasanara Capital Ltd (London, founded 2011, $4B+ AUM, 15-year track record) is a major European institutional asset manager, FCA-authorised, with MIFIDPRU disclosure and SFDR Article 8 classified funds
- **Institutional-grade custody** — Fordefi MPC with tri-party governance prevents unilateral fund access
- **Shared, extensively audited infrastructure** — 10 audits (2023–2025) on Midas core contracts, plus a $1M bug bounty across Sherlock and Cantina
- **NAV publication and yield accrual are working** — the oracle has produced five rounds, is current to within 3.4 days, and has delivered a realized ~6.3% annualized return since accrual began
- **Real, verifiable redemption liquidity** — the RedemptionVaultWithAave holds $6,237,620 of aUSDC (~9.0% of NAV), independently auditable onchain
- **Holder concentration is moderate** — no single beneficial holder exceeds ~30%
- **Timelock discipline holds** — 48-hour delay on upgrades, ProxyAdmin owned by the timelock, and no mGLOBAL proxy has ever been upgraded

### Key Risks

- **Near-total strategy opacity** — 97.03% of NAV is "Unclassified" per [SumCap / Delta Y](https://midas.sumcap.xyz/mglobal), the highest share since launch and far more opaque than mHYPER. The position-level book, its geography/sector mix, and its delinquency and loss rates are undisclosed and not verifiable onchain
- **The oracle's safety bounds are bypassable** — `setRoundData` is directly callable by the oracle admin role and enforces neither `maxAnswerDeviation` nor `onlyUp`. A single EOA can set any price between $0.10 and $1,000 in one transaction. The deviation cap is an operational convention, not an invariant
- **NAV cannot be marked down through the routine path** — with `onlyUp` true, `setRoundDataSafe` rejects downward revisions, so a credit impairment cannot be reflected without switching setters. A stale-high price rewards early redeemers at the expense of those who remain
- **53 EOAs hold blacklist authority** — any one of them can freeze an arbitrary holder's balance and block their redemption, with no timelock and no multisig
- **Unbacked minting possible** — `mint()` has no onchain collateral check, and role grants bypass the 48-hour timelock entirely, so either `DEFAULT_ADMIN_ROLE` holder can self-grant the mint role and issue unbacked tokens in two transactions
- **Zero secondary market** — no Uniswap V2 or V3 liquidity at any tier. Exit depends entirely on Midas redemption, capped at 2,000,000 mGLOBAL/day per vault, with only ~$6.2M of instant capacity behind it
- **The Horizon demand sink is closed** — the supply cap was cut from 50M to 30M and the reserve is saturated, so the venue that absorbed most of the recent growth can absorb no more
- **A burn-authorized contract sits unconfigured** — the staged third vault holds `M_GLOBAL_BURN_OPERATOR_ROLE` with sentinel addresses, zero fee, and an uncapped daily limit
- **Base Prospectus validity has lapsed** and renewal is unconfirmed (`TODO`)

### Critical Risks

- **Oracle can report almost any price, and only upward through the safe path.** Combining the unguarded `setRoundData` route ($0.10–$1,000 in one transaction), a single non-timelocked EOA holding the feed admin role, inactive PriceRaised/PriceLowered bound feeds, and no-timelock role grants produces a direct path to mispricing every mint and redemption. The `onlyUp` flag narrows the *routine* failure mode to over-valuation rather than a crash, which is the more insidious direction for a redemption-only instrument: it converts an unreported credit loss into a first-mover run
- **97% of the book is unverifiable.** The strategy type is documented and defensible — short-dated, insured, unlevered SME trade receivables — but nothing about *this* vehicle's holdings can be checked. Verifiability, not strategy legitimacy, is the binding constraint on the score
- **Concentration and illiquidity still compound.** InfiniFi's 30.29% now sits in an escrow wrapper with no maturity date, so a withdrawal arrives without warning. ~$21M of exposure against ~$6.2M of instant capacity and zero DEX depth means any large exit becomes an offchain unwind of receivables on Fasanara's timetable, not the holder's

---

## Risk Score Assessment

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
- Broad coverage: core contracts, vaults, bridges, oracle system, legacy components
- **mGLOBAL-specific contracts (Aave-integrated vaults, growth oracle) remain extensions beyond the original audit scopes** and have not been separately audited. The `setRoundData` / `setRoundDataSafe` split documented in [Provability](#provability) is exactly the kind of issue a scoped audit of the growth oracle would be expected to address
- Several findings accepted rather than fixed in earlier audits
- Hacken explicitly flagged the protocol as "highly centralized"

**Bug Bounty:** $1M total across [Sherlock](https://audits.sherlock.xyz/bug-bounties/122) ($500K max) and [Cantina](https://cantina.xyz/bounties/d77405e5-99ce-4ba5-846c-885820b030e1) ($500K max). Active since March 2026.

**Time in Production:**

- mGLOBAL: ~4.7 months (since April 3, 2026)
- Midas platform: ~2 years (mTBILL since mid-2024)
- Market cap ~$69.23M; platform TVL ~$152.9M
- No security incidents for mGLOBAL; no forced-redemption stress event

**Score: 2.5/5** — the audit position is unchanged: a strong shared-infrastructure foundation, but the mGLOBAL-specific patterns are still unaudited, and a live example of an unguarded oracle path argues against crediting the extension as covered. Time in production has roughly doubled and NAV operations now have a real track record, which offsets rather than improves on the audit gap.

#### 2. Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.5**

- 48-hour timelock on upgrades via `MidasTimelockController`, ProxyAdmin owned by the timelock, and no mGLOBAL proxy has ever been upgraded — the mechanism is real and has been exercised
- Role changes still bypass the timelock entirely
- `DEFAULT_ADMIN_ROLE` held by two addresses (a 1/3 Safe plus one EOA); either can grant or revoke any role instantly
- The 1/3 Safe holds `PROPOSER`, `EXECUTOR`, **and** `CANCELLER` on the timelock, so a single Safe owner controls the entire upgrade lifecycle including cancellation
- **53 EOAs hold `GREENLIST_OPERATOR_ROLE` and `BLACKLIST_OPERATOR_ROLE`.** Any one can freeze an arbitrary holder's balance and block redemption, untimelocked. This is a far wider unilateral-freeze surface than the two-operator arrangement the design implies, and it is the main reason this subscore moves against the protocol
- Oracle price written by a single EOA with no timelock, on a path that skips its own deviation and direction guards
- Bound feeds (PriceRaised/PriceLowered) still have no role holders — inactive
- Tri-party MPC custody (Fordefi) is a genuine positive but governs fund movements, not contract administration

**Subcategory B: Programmability — 4.0**

- Strategy execution fully offchain (Fasanara)
- NAV is admin-published on a roughly monthly cadence; the Attestation Engine publishes hashes but does not gate the price update
- PPS is admin-reported, not computed onchain from reserves, and `onlyUp` prevents the routine path from ever reporting a loss
- Users cannot independently compute the exchange rate onchain
- Oracle bounds are loose in principle (100% deviation) and unenforced in practice on the admin path
- Offsetting: the Aave position is now materially funded ($6.24M aUSDC) and independently verifiable, and instant redemption is governed by explicit onchain parameters (2,000,000/day cap, 50 bps fee) rather than pure discretion
- No smart-contract restriction on how funds are managed; tokens can be minted without backing

**Subcategory C: External Dependencies — 4.2**

- Fasanara Capital: single critical dependency for strategy and NAV. The strategy *type* is documented, but **97.03% of NAV is unclassified** — nearly the whole book
- InfiniFi: 30.29% holder whose position moved into an offchain-attested escrow wrapper with no maturity date, reducing visibility on the largest single exit risk
- Aave: redemption float on Aave V3 is a positive; the Horizon reserve is saturated at a reduced 30M cap, and its Llamaguard feed mirrors rather than independently validates the Midas NAV
- Fordefi: MPC custody with tri-party governance (established, tested)
- MidasAccessControl and the shared ProxyAdmin: a compromise affects every Midas product simultaneously
- Strategy counterparties remain unverifiable

**Centralization Score = (3.5 + 4.0 + 4.2) / 3 ≈ 3.9**

**Score: 3.9/5** — the structural picture is unchanged but two specifics have hardened against the protocol: a 53-key unilateral freeze surface, and an oracle whose stated bounds are not enforced on the path the admin can actually take. Dependency opacity also increased. The functioning timelock and the funded, verifiable Aave position keep this from moving further.

#### 3. Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.5**

- Tokens are subordinated debt instruments, not direct claims on collateral
- The strategy *type* is documented (short-dated SME trade receivables, ~3-month duration, unlevered, credit-insured), but **97.03% of NAV is unclassified** and the position-level composition, collateral quality, and loss/delinquency metrics for this vehicle are undisclosed
- Verifiable onchain backing is limited to $6,237,620 of aUSDC (~9.0% of NAV) — real and auditable, but redemption float rather than strategy collateral
- No onchain collateral verification; `mint()` has no backing check
- Tri-party MPC custody via Fordefi should prevent unilateral fund access
- Held at 4.5: the increase in opacity and the improvement in verifiable float offset each other, and the dominant fact — an unauditable book — is unchanged

**Subcategory B: Provability — 3.5**

- NAV reported by Fasanara with the shared Attestation Engine providing multi-party verification (LlamaRisk, Canary, vlayer, Chainlink CRE)
- Improved: the oracle now publishes a real, verifiable growth series across five rounds, and Aave's independent Chainlink OCR2 feed republishes the NAV with 16 transmitters — more eyes on the number than at the prior assessment
- Worsened: the guarded setter is bypassable, `onlyUp` prevents markdowns on the routine path, and the classified share of NAV fell to 2.97%
- Full portfolio composition is not verifiable onchain; the registry stores only hashes
- Oracle updates remain admin-triggered with no onchain gating from the Attestation Engine
- mGLOBAL-specific proof IDs in the registry have not been identified
- Held at 3.5: a live, auditable price series and independent republication are genuine gains, cancelled out by the enforcement gap and the shrinking classified share

**Funds Management Score = (4.5 + 3.5) / 2 = 4.0**

**Score: 4.0/5** — offchain funds management under a subordinated-debt structure. The Aave position is now a meaningful onchain anchor and NAV publication works, but 97.03% of the book is unclassified and the price that governs every mint and redemption can be set outside its stated bounds by one key. Verifiability, not strategy legitimacy, remains the binding constraint.

#### 4. Liquidity Risk (Weight: 15%)

- **Exit Mechanism:** two live redemption vaults, both unpaused, each capped at 2,000,000 mGLOBAL/day instant with a 50 bps fee; larger exits route through an offchain request/approval flow
- **Onchain capacity:** $6,237,620 of aUSDC in the RedemptionVaultWithAave — ~9.0% of NAV of genuine, verifiable instant-redemption backing where there was previously none. This is the single largest improvement since the prior assessment
- **DEX Liquidity:** none, at any Uniswap V2 or V3 tier. The Aave Horizon listing is not an exit venue and is now saturated at its reduced 30M cap
- **Holder Concentration:** the largest beneficial holder is InfiniFi at 30.29%, then 26.11% and 14.48% — no single dominant counterparty, versus 58% previously. Offsetting this, only 16 addresses hold any balance, so the base is broad in percentage terms but thin in absolute terms
- **Warning time has decreased:** InfiniFi's position no longer sits behind a dated `MidasFarm` maturity. The `RWAEscrowRouter` exposes no maturity, so an exit would arrive unannounced
- **Stress Performance:** no forced-redemption event. The June 2026 InfiniFi maturity passed without redemption

**Score: 3.0/5** (was 3.5) — two real improvements: instant-redemption capacity went from ~$0 to $6.24M, and top-holder concentration fell from 58% to ~30%. Structural illiquidity is unchanged — no secondary market, redemption-only exit, and a ~$21M single holder against ~$6.2M of instant capacity — and the Horizon cap reduction removes the marginal demand sink while the escrow wrapper removes advance notice of an InfiniFi exit. The score improves one notch but stays elevated.

#### 5. Operational Risk (Weight: 5%)

- **Midas Team:** fully doxxed with strong institutional backgrounds and well funded ($8.75M from top crypto VCs)
- **Fasanara Capital:** FCA Authorised since August 2011 (FRN [551020](https://register.fca.org.uk/s/firm?id=001b000000NMar0AAD)), $4B+ AUM, London HQ, 15-year track record, CEO Francesco Filia (ex-BofA Merrill Lynch), 40+ professionals, Companies House [07561210](https://find-and-update.company-information.service.gov.uk/company/07561210), MIFIDPRU Disclosure, EU SFDR Article 8 funds. Firm-level diligence is complete; mGLOBAL-specific strategy transparency is not
- **Operational execution has been sound** — NAV published on schedule since June, redemption vaults funded, no incidents, no emergency actions
- **Documentation:** Midas platform docs are comprehensive but sit behind a Cloudflare challenge that blocks automated retrieval; mGLOBAL-specific documentation remains limited. SumCap / Delta Y provides usable NAV, price, and allocation data
- **Legal:** Midas Software GmbH, German-incorporated. The FMA Liechtenstein Base Prospectus lapsed July 17, 2026 and renewal is unconfirmed (`TODO`)

**Score: 2.0/5** — unchanged. The team and manager are strong and operational execution over the period was clean. The lapsed prospectus is flagged as a monitoring item rather than scored, because renewal could not be verified either way and scoring an unverified fact would not be sound.

### Final Score

| Category | Score | Weight | Weighted |
| ------------------------ | ----- | ------ | ----------- |
| Audits & Historical      | 2.5   | 20%    | 0.50        |
| Centralization & Control | 3.9   | 30%    | 1.17        |
| Funds Management         | 4.0   | 30%    | 1.20        |
| Liquidity Risk           | 3.0   | 15%    | 0.45        |
| Operational Risk         | 2.0   | 5%     | 0.10        |
| **Final Score**          |       |        | **3.42/5.0** |


### Risk Tier

| Final Score | Risk Tier       | Recommendation                        |
| ----------- | --------------- | ------------------------------------- |
| 1.0-1.5     | Minimal Risk    | Approved, high confidence             |
| 1.5-2.5     | Low Risk        | Approved with standard monitoring     |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5     | Elevated Risk   | Limited approval, strict limits       |
| 4.5-5.0     | High Risk       | Not recommended                       |


**Final Risk Tier: Medium Risk (3.42/5.0) — borderline, just below the Elevated threshold**

**Recommendation:** Approved with enhanced monitoring and conservative limits. The headline score is essentially flat, but the composition of the risk has shifted materially. Liquidity improved on two fronts — instant-redemption capacity went from ~$0 to $6.24M of aUSDC, and top-holder concentration fell from 58% to ~30% — and the oracle stall that dominated the previous assessment resolved into a working monthly NAV cadence with ~6.3% annualized accrual. Those gains are offset by three things that got worse: strategy opacity rose to 97.03% of NAV, a 53-key unilateral blacklist surface was confirmed, and the oracle's deviation cap and `onlyUp` guard turn out not to be enforced on the path the admin can actually take. **Complete mGLOBAL-specific Fasanara due diligence and confirm the Base Prospectus renewal before any allocation.**

**Path to a lower score:** the binding constraint is opacity, not a verified flaw. An attested allocation breakdown that classifies the 97.03% "Unclassified" NAV would directly improve Collateralization, Provability, and External Dependencies and could move the score toward the middle of the Medium tier. Three cheaper fixes would also help: revoking `M_GLOBAL_BURN_OPERATOR_ROLE` from the unconfigured third vault, pruning the 53-address blacklist-operator set or routing it through a multisig, and either removing the public `setRoundData` path or moving the feed admin role behind a timelock so the deviation cap becomes an enforced invariant rather than a convention. Tightening `maxAnswerDeviation` from 100% and activating the PriceRaised/PriceLowered bound feeds would reinforce that.

**Required Conditions:**

1. **Verify Strategy Allocation** — 97.03% of NAV is unclassified. Obtain a breakdown of the unclassified portion from Midas or via attestation reports
2. **Confirm Base Prospectus renewal** — the FMA Liechtenstein prospectus lapsed July 17, 2026; obtain the successor document or written confirmation
3. **Limited Exposure** — cap initial allocation at 5–10% of vault, sized so that a full exit stays within the $6.2M instant-redemption capacity and the 2,000,000 mGLOBAL/day per-vault limit
4. **Enhanced Monitoring** — real-time alerts on oracle setter selector and price moves, role changes, contract upgrades, redemption-vault aUSDC balance, InfiniFi router balance, and Horizon reserve parameters (see [Monitoring](#monitoring))
5. **Oracle hardening** — confirm with Midas whether the public `setRoundData` path is intentional; push for a timelock on the feed admin role, a tighter `maxAnswerDeviation`, and activation of the bound feeds
6. **Burn-role hygiene** — ask Midas to revoke `M_GLOBAL_BURN_OPERATOR_ROLE` from [`0xdbd621e6…8e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76) until it is configured for production
7. **Monthly NAV Cross-Check** — verify each published round against expected accrual and confirm the guarded setter was used
8. **Quarterly Reassessment** — the acute triggers from the prior assessment have resolved; a quarterly cadence is now appropriate absent an alert

**Key Concerns Driving the Score:**

- **Strategy opacity at 97.03%** — the highest since launch. Fasanara's institutional credibility is well established; what is missing is any view into this vehicle's book
- **Oracle bounds are not invariants** — the deviation cap and `onlyUp` guard live only on `setRoundDataSafe`, while `setRoundData` is directly callable by a single non-timelocked EOA and permits any price from $0.10 to $1,000
- **53 EOAs can freeze any holder** — unilateral, untimelocked blacklist authority across the whole Midas platform
- **Exit remains redemption-only** — no DEX market, ~$6.2M instant capacity, 2,000,000/day per-vault cap, and a 30.29% holder whose position now carries no maturity date

**Mitigating Factors:**

- **NAV publication and yield accrual are demonstrably working** — five oracle rounds, current to 3.4 days, ~6.3% annualized realized return
- **Verifiable redemption float** — $6,237,620 of aUSDC on Aave, ~9.0% of NAV, independently auditable
- **No dominant counterparty** — the largest beneficial holder is ~30%, and the top three are 30.29%, 26.11%, and 14.48%
- **Timelock discipline is real** — 48-hour delay, ProxyAdmin owned by the timelock, no mGLOBAL proxy ever upgraded, 82 of 87 queued operations executed cleanly
- **Third-party scrutiny** — Aave Horizon onboarding plus a 16-transmitter Chainlink OCR2 feed republishing the NAV
- **Fasanara is an established institution** — $4B+ AUM, 15-year track record, FCA-authorised, MIFIDPRU disclosure
- **Extensively audited shared infrastructure** — 10 audits across 3 years plus a $1M bug bounty
- **Strong Midas team and institutional backing** — doxxed, well funded
- **Attestation Engine** — multi-party verification pipeline with onchain hash publication
- **Dual funded redemption vaults** with explicit onchain limits and fees
- **1/3 Safe signers use institutional-grade MPC** — Fordefi and Fireblocks, beyond the onchain threshold

---

## Reassessment Triggers

- **Time-based**: reassess in 3 months (November 2026). The acute triggers from the prior assessment — a stalled oracle and a dated counterparty maturity — have both resolved, so the accelerated monthly cadence is no longer warranted
- **Oracle integrity (highest priority)**: reassess immediately on any use of the raw `setRoundData` selector (`0x2b6e02c7`), any downward price revision, any single-round move beyond ~1.5%, `onlyUp` being set to false, or no update for more than 45 days
- **Oracle governance**: reassess if the feed admin role moves behind a timelock, if `maxAnswerDeviation` is tightened, or if the PriceRaised/PriceLowered bound feeds are activated — each would materially improve Programmability and Provability
- **InfiniFi concentration**: monitor mGLOBAL `balanceOf` on the [`RWAEscrowRouter`](https://etherscan.io/address/0x7912Eaff92B2f5Bc64Cdd21C76d79FFC12eA855E) daily. The wrapper exposes no maturity date, so any balance decrease is the only available signal and should trigger an immediate liquidity and concentration review
- **Redemption capacity**: reassess if the RedemptionVaultWithAave's aUSDC balance falls below ~$2M or below 3% of NAV, if `instantDailyLimit` is reduced, or if either live vault is paused
- **Aave Horizon parameters**: the reserve is saturated at a 30M supply cap with LTV 0.05%. Reassess on any further cap reduction (which would force withdrawals), any material LTV or liquidation-threshold increase, a freeze or delisting, or the Llamaguard feed going stale or diverging from the Midas oracle
- **Burn-role hygiene**: reassess if the staged third vault [`0xdbd621e6…8e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76) is activated, funded, or used while uncapped and zero-fee — or, positively, if its burn role is revoked
- **Blacklist authority**: reassess if the 53-address `BLACKLIST_OPERATOR_ROLE` set grows materially, if any mGLOBAL holder is added to `BLACKLISTED_ROLE`, or — positively — if the set is pruned or routed through a multisig
- **Strategy disclosure**: reassess when mGLOBAL allocations become verifiable (via Midas, SumCap / Delta Y, or attestation reports). A drop in the unclassified share below ~75% would be materially score-relevant
- **Base Prospectus**: confirm whether the FMA Liechtenstein prospectus was renewed after July 17, 2026; reassess on the answer either way
- **TVL-based**: reassess if mGLOBAL market cap changes by more than 50% or Midas platform TVL changes by more than 40%
- **Incident-based**: reassess after any exploit, NAV discrepancy, governance change, mGLOBAL contract upgrade, or regulatory action affecting Midas or Fasanara
- **Shared-infrastructure changes**: the ProxyAdmin, timelock, and MidasAccessControl are shared across all Midas products; reassess on any change to their ownership or role configuration even when the immediate target is another token
- **Cross-chain activation**: reassess if mGLOBAL is deployed on another chain or any bridge adapter is granted mGLOBAL mint or burn roles
- **Audit**: reassess if an audit covering the mGLOBAL-specific contracts (Aave-integrated vaults, growth oracle) is published
- **Redemption stress**: reassess after any significant redemption event, based on observed performance
- **Attestation Engine**: reassess if mGLOBAL-specific attestations are confirmed flowing through the pipeline

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 17, 2026](https://github.com/yearn/risk-score/pull/258) | 3.51 | Initial assessment |
| [June 23, 2026](https://github.com/yearn/risk-score/pull/269) | 3.43 | Reassessment: InfiniFi's matured MidasFarm renewed rather than redeeming, and Aave Horizon onboarding added independent demand; top-holder concentration 81% → 58%. Liquidity Risk 4.0 → 3.5. |
| August 24, 2026 | 3.42 | Reassessment at block 25,822,232. Supply 52.63M → 68.10M and NAV $52.63M → $69.23M as the oracle resumed publishing: five rounds now, price $1.01664609, last updated August 20 (3.4 days stale versus 39), realized ~6.3% annualized. Liquidity Risk 3.5 → 3.0 — the RedemptionVaultWithAave now holds $6.24M aUSDC where it held $0, and top-holder concentration fell 58% → 30.29% after InfiniFi moved its position from `MidasFarm` into an `RWAEscrowRouter` with no maturity date. Centralization 3.7 → 3.9: `GREENLIST_OPERATOR_ROLE` and `BLACKLIST_OPERATOR_ROLE` are each held by 53 EOAs with untimelocked unilateral freeze authority, and the oracle's `maxAnswerDeviation` and `onlyUp` guards were found to live only on `setRoundDataSafe` — the admin-callable `setRoundData` skips both and permits any price in $0.10–$1,000. Strategy opacity rose 88.61% → 97.03% of NAV. Added a fourth `M_GLOBAL_BURN_OPERATOR_ROLE` holder ([`0xdbd621e6…8e76`](https://etherscan.io/address/0xdbd621e67d9cffffcdcd316a27285f657c178e76), granted August 12), an unfunded and unconfigured swapper vault with zero fee and an uncapped daily limit. Aave Horizon's supply cap was cut 50M → 30M on July 2 and the reserve is saturated. Corrected a broken April 5 oracle transaction link. Flagged the lapsed FMA Base Prospectus as `TODO`. |

