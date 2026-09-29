# Protocol Risk Assessment: Ondo USDY

- **Assessment Date:** September 29, 2026
- **Token:** USDY (Ondo U.S. Dollar Yield)
- **Chain:** Ethereum (also Stellar, Sei, Solana, BNB Chain, Sui, Arbitrum, Aptos, Tempo, Mantle, Noble; Immunefi also lists X Layer and Plume deployments)
- **Token Address:** [`0x96F6eF951840721AdBF46Ac996b59E0235CB985C`](https://etherscan.io/address/0x96F6eF951840721AdBF46Ac996b59E0235CB985C)
- **Final Score: 2.47/5.0**

## Overview + Links

USDY is a tokenized, yield-bearing note secured by short-dated US Treasury bills and bank deposits, offered to non-US persons under Regulation S. It is an *accumulating* token: the per-token price rises every day at a rate that Ondo fixes each month in an onchain oracle. On September 29, 2026 the price was **$1.14786** per USDY ([`RWADynamicOracle.getPrice()`](https://etherscan.io/address/0xA0219AA5B31e65Bc920B5b6DFb8EdF0988121De0#readContract)), up from $1.00 at launch in August 2023. The current monthly rate is ~3.6% APY ([Ondo USDY page](https://ondo.finance/usdy)). A rebasing wrapper, [rUSDY](https://etherscan.io/address/0xaf37c1167910ebC994e266949387d2c7C326b879), is priced at $1.00 and holds only ~1.79M USDY on Ethereum.

**Two issuers now share one token.** USDY was originally issued by **Ondo USDY LLC**, under a Tokenized Credit and Security Agreement (TCSA) dated July 29, 2023. [Ankura Trust Company](https://ondo.finance/usdy) acts as Verification Agent and Collateral Agent under that agreement. On **December 15, 2025** USDY was "folded into the Ondo Stocks umbrella" ([USDY Basics](https://docs.ondo.finance/general-access-products/usdy/basics)). New web-app issuance and redemption now go through **Ondo Global Markets (BVI) Limited** (OGM) via the [`USDY_InstantManager`](https://etherscan.io/address/0xa42613C243b67BF6194Ac327795b926B4b491f15) ([Important Notes](https://docs.ondo.finance/general-access-products/usdy/important-notes)). Ondo USDY LLC still reports daily. The legacy [`USDYManager`](https://etherscan.io/address/0x25A103A1D6AeC5967c1A4fe2039cdc514886b97e), which Ondo's docs label "deprecated", has still minted ~1.25B USDY on Ethereum in 2026 (see [Token Mint Authority](#token-mint-authority)). Both issuers' notes are the same ERC-20, so a holder cannot tell onchain which issuer's obligation a given token represents.

**Scope for Yearn.** The issue requests an assessment of (1) holding USDY and (2) a strategy that swaps USDC→USDY, holds, and redeems when needed. The practical path for (2) is the `USDY_InstantManager`. It mints and redeems atomically at the oracle price with currently zero fees. The calling address must be registered in Ondo's ID registry, so the strategy contract must pass KYC as a non-US entity. Redemptions are capped by rate limits and a manually funded USDC buffer (see [Liquidity Risk](#liquidity-risk)).

**Snapshot provenance.** Ethereum reads are at block [`26084693`](https://etherscan.io/block/26084693) (hash `0x48261da9f4180a3c18ffcd765c3ebc6a390e8d3889b737c3eec535b9ad8b4616`, timestamp 1790703827 = September 29, 2026 17:43 UTC). Arbitrum, BNB Chain and Mantle reads are pinned to the block at the same timestamp:

| Chain | Block | Hash |
|-------|-------|------|
| Arbitrum | [`510100459`](https://arbiscan.io/block/510100459) | `0x1d72a4728424b797db915a8cc805e2f9fe0ce69171bf0b77d87c97a585be61a3` |
| BNB Chain | [`124758689`](https://bscscan.com/block/124758689) | `0x47cc145784f6d1490225c910dd25048b12ade9ec2bbeea98f42163848de28f94` |
| Mantle | [`101286758`](https://explorer.mantle.xyz/block/101286758) | `0xb226a1ead2b2e57cdbb9f26ec48f281a97692b8e048c564e61cac339835c6c75` |

Sei reads are Etherscan-API `latest` reads taken minutes later (block 234822172). Solana supply comes from the Jupiter token indexer, not an onchain read. Stellar, Sui, Aptos, Noble, Tempo, X Layer and Plume were not read directly: no configured RPC or explorer access. Their figures come from Ondo's per-chain TVL data.

**Links:**

- [USDY product page and holdings](https://ondo.finance/usdy)
- [USDY documentation](https://docs.ondo.finance/general-access-products/usdy/basics)
- [USDY_InstantManager integration guide](https://docs.ondo.finance/developer-guides/usdy-instant-manager-integration)
- [Contract addresses](https://docs.ondo.finance/addresses#usdy)
- [Ondo Token Bridge (LayerZero)](https://docs.ondo.finance/tools/ondo-bridge)
- [Audits](https://docs.ondo.finance/audits)
- [Source code: ondoprotocol/rwa-contracts](https://github.com/ondoprotocol/rwa-contracts)
- [Daily Ankura attestation reports (Dropbox)](https://www.dropbox.com/scl/fo/375wdvar3rbc7o23nxsgp/AOFY8jhpENaNx9WAw-WPnbY?rlkey=4icqn1z9bez725wywr30fx52a&st=bsxeh8j5&dl=0)
- [Monthly Ankura attestation reports (Dropbox)](https://www.dropbox.com/scl/fo/fk5t99zyihshuak3u1u9v/AMYiYSUwvoL6osa2FX_G_M8?rlkey=0ttmb4ifhdg4ebvhbh8aa3juc&st=fyoof4cu&dl=0)
- [Immunefi bug bounty](https://immunefi.com/bug-bounty/ondofinance/)
- [DeFiLlama: Ondo Yield Assets](https://defillama.com/protocol/ondo-yield-assets)
- [LlamaRisk: USDY asset overview (2023)](https://llamarisk.com/research/archive-llamarisk-asset-overview-u-s-dollar-token-usdy)

## Audits and Due Diligence Disclosures

Ondo lists the following audits for "Ondo Funds and USDY (Ethereum)" ([audits page](https://docs.ondo.finance/audits)):

| Date | Firm | Link |
|------|------|------|
| March 2025 | Spearbit (Cantina) | [Report](https://cantina.xyz/portfolio/fb329103-8bd1-45ac-91d8-4f75e1abf812) |
| February 2025 | Halborn | [PDF](https://docs-v2-git-prod-ondo-docs.vercel.app/pdf/Ondo-Halborn-Audit-Feb-2025.pdf) |
| April 2024 | Code4rena | [Report](https://code4rena.com/reports/2024-03-ondo-finance) |
| April 2024 | Cyfrin | [PDF](https://docs-v2-git-prod-ondo-docs.vercel.app/pdf/Ondo-Cyfrin-Audit-April-2024.pdf) |
| September 2023 | Code4rena | [Report](https://code4rena.com/reports/2023-09-ondo/) |
| August 2023 | Zokyo | [PDF](https://docs-v2-git-prod-ondo-docs.vercel.app/pdf/Ondo-Zokyo-Audit-August-2023.pdf) |
| April 2023 | NetherMind | [PDF](https://docs-v2-git-prod-ondo-docs.vercel.app/pdf/Ondo-NetherMind-Audit-April-2023.pdf) |
| January 2023 | Code4rena | [Report](https://code4rena.com/reports/2023-01-ondo/) |

Noble USDY was audited by Halborn (June and July 2024). The Ondo Stocks/OGM stack, including the October 2025 Cantina review of the USDon converter and bridge registrar, has a separate audit list of 13 reports from Cantina, Spearbit, Cyfrin, Zellic and FYEO.

**Coverage gaps (checked against the report texts):**

- **`USDY_InstantManager`** was deployed on December 8, 2025 ([creation tx](https://etherscan.io/tx/0xa65d7e9c8f7c7cc9bf341f3b14d3effce5151842da5fdca19adbc72afc11bb53)). Its source is published in [ondoprotocol/rwa-contracts](https://github.com/ondoprotocol/rwa-contracts) under `contracts/xManager/rwaManagers/usdyInstantManager/`.
  - The shared xManager stack it inherits was audited through `OUSG_InstantManager`. [Halborn (Nov 2024 – Jan 2025)](https://docs-v2-git-prod-ondo-docs.vercel.app/pdf/Ondo-Halborn-Audit-Feb-2025.pdf) covered `BaseRWAManager`, `OndoTokenRouter`, `OndoRateLimiter`, `OndoFees`, `OndoCompliance`, `OndoIDRegistry`, `PauseManager` and token sources/recipients. [Spearbit (Feb–Mar 2025)](https://cdn.cantina.xyz/reports/Ondo-Spearbit-Security-Review-March-2025.pdf) also reviewed `BaseRWAManager` and `OndoTokenRouter`.
  - **No published report names the USDY subclass** or its rUSDY wrap path. The subclass is small (288 lines) and mostly delegates to the audited base.
- **`OndoMintBurnAdapter`** (LayerZero) was deployed August 21, 2024. It is **not** named in any report on Ondo's audit page and is not in `rwa-contracts`. The bridge docs only mention review by "a leading Web3 security firm". It is in the Immunefi bounty scope on Ethereum, Arbitrum, Mantle, Sei and Solana.
- **Legacy stack.** The legacy token, `USDYManager`, rUSDY and `RWADynamicOracle` were covered by the 2023–2024 Code4rena, Cyfrin and NetherMind reviews.

**Complexity.** The token is a simple OpenZeppelin `ERC20PresetMinterPauserUpgradeable` with blocklist, allowlist (currently an `AllowlistStub` that returns `true`) and Chainalysis sanctions hooks, plus an unrestricted `BURNER_ROLE` burn. The surrounding system is more complex: two mint managers, a router with pluggable token sources and recipients, an oracle registry, a rate limiter, fee modules, an admin-subscription allowance contract and a LayerZero adapter.

### Bug Bounty

- [Immunefi](https://immunefi.com/bug-bounty/ondofinance/), live since March 7, 2023. Critical smart-contract bugs pay 10% of funds affected, **up to $1,000,000**, with a $50,000 minimum.
- **Scope** includes the USDY token (Ethereum, Arbitrum, Mantle, Sei, Plume, X Layer, Solana, Aptos, Noble), rUSDY, `USDY Instant RWA Manager`, `USDY Manager`, the USDY price oracle and wrapper, the xManager stack, and all `OndoMintBurnAdapter` deployments. The page was last updated September 29, 2026.
- **SEAL Safe Harbor:** not adopted. The Immunefi program data reports `isSafeHarborActive: false`, and no scope asset is marked Safe Harbor.

## Historical Track Record

- **In production since August 2023.** The token proxy was created July 11, 2023 ([tx](https://etherscan.io/tx/0xad49610a1f99fac0b77b42ec9e3e21f986fc765349481278d52fcb96c12e3fb7)); the oracle's first range starts August 1, 2023; the first Ethereum mint was September 18, 2023.
- **Scale (Ondo USDY LLC token principal, monthly Ankura reports):** $71.5M (Jan 2024) → $450.7M (Dec 2024) → $559.3M (Feb 2025) → $705.9M (Dec 2025) → $1,406.5M (Jan 2026) → $2,120.9M (Apr 2026) → **$2,138.6M (Aug 2026)**. The latest daily report shows **$2,066.7M** on September 24, 2026. Principal has stayed above $500M since February 2025 (19 months).
- **Ondo's headline figures** ([USDY page](https://ondo.finance/usdy), September 28, 2026): TVL $2.20B; "Value of USDY Outstanding" $2.07B; "Value of Underlying Assets" $2.30B; "Collateralization Ratio" 121.95%. The ratio cannot be reproduced from the page's own figures (2.30/2.07 = 111%); see [Collateralization](#collateralization).
- **Security incidents:** no smart-contract exploit, unbacked mint or loss of funds found.
- **Covenant event, January 2026.** The January 2026 monthly Ankura report shows Permitted Assets / Token Principal of **1.0042**, below the 100.5% threshold. The report records **"Portfolio Default Test: FAIL"** and **"Portfolio Default: YES"**. The month included a $700M certificate issuance. February 2026 was back to 1.0055 (PASS). No public incident communication was found (**TODO**).
- **Shrinking cushion.** From September to December 2025 the LLC held ~2.9–3.0% excess collateral, consistent with the historical 3% first-loss buffer described by [LlamaRisk](https://llamarisk.com/research/archive-llamarisk-asset-overview-u-s-dollar-token-usdy). Since January 2026 the excess has been 0.31–0.78%.
- **Holder concentration (Ethereum, reconstructed from all 19,838 `Transfer` events to the snapshot block; balances sum exactly to `totalSupply`).** 1,265 holders. The top four addresses hold **81.2%**: 359.0M, 298.8M, 107.8M and 83.4M USDY, all in 3-of-5 Safes. These Safes have never sent a transaction, share no signers with each other or with Ondo's governance Safes, and received their USDY from the legacy `USDYManager` in 2026 batch mints. Their owners are not publicly identified.
- **Peg / price behaviour:** USDY is not pegged; it accrues at the oracle rate. DeFiLlama's market price ($1.14558) was 0.2% below the oracle price ($1.14786) at the snapshot.

## Funds Management

USDY holders do not deposit into onchain strategies. Subscription USDC leaves the chain to the issuer, which buys T-bills held at brokers and custodians. Onchain, the relevant flows are:

1. **Subscription (OGM, `USDY_InstantManager`).** USDC → [`OndoTokenRouter`](https://etherscan.io/address/0x99B8d1D1c17a10CD1A878d1A44c11fd7E4daD7bC) → [`BasicRecipient`](https://etherscan.io/address/0x14dd822e1b75253525A209e3cC917Cd0d54B6cAe) → 3-of-6 Safe [`0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5`](https://etherscan.io/address/0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5). USDY is minted to the caller in the same transaction.
2. **Redemption (OGM).** USDY is burned. USDC is pulled via [`BasicSource`](https://etherscan.io/address/0x95feCDD21D48426d3bAd195c6A3f0686e6b4d635) from the same Safe [`0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5`](https://etherscan.io/address/0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5), which holds **24,987,673.71 USDC** with unlimited allowance to the source.
3. **Legacy issuance (Ondo USDY LLC, `USDYManager`).** USDC or USD is wired offchain (historically to the Coinbase Prime address [`0xbDa73A0F13958ee444e0782E1768aB4B76EdaE28`](https://etherscan.io/address/0xbDa73A0F13958ee444e0782E1768aB4B76EdaE28), which holds 0 USDC). A relayer posts a deposit "proof", a price ID and claim timestamp are set, and USDY is minted when claimed.

**Monitoring delegation changes:** the router's `depositTokenRecipient(USDY, USDC)` and `withdrawTokenSources(USDY, USDC, i)`, the `BasicSource.withdrawAddress()`, and the offchain custodian mix in daily Ankura reports.

### Accessibility

- **Who can mint/redeem:** only onboarded, KYC'd non-US persons. The `USDY_InstantManager` requires `ondoCompliance.checkIsCompliant` and a non-zero `ondoIDRegistry.getRegisteredID(USDY, caller)` for both subscribe and redeem. Contract wallets must register the exact calling address ([integration guide](https://docs.ondo.finance/developer-guides/usdy-instant-manager-integration)).
- **Transfers are permissionless** apart from the Blocklist and Chainalysis sanctions list. The allowlist hook points to an [`AllowlistStub`](https://etherscan.io/address/0x5Cd9e3a4C9933133B512Da1b6ba4672160e0C665) that returns `true` for any address.
- **Atomicity:** `subscribe` and `redeem` are atomic and priced at the oracle.
- **Fees:** both [`OndoFees`](https://etherscan.io/address/0xEaC2181075BA0FC53D5141B17943Ea9F913954e6) modules ([redemption](https://etherscan.io/address/0xE1cb24077d77d2fE763fCAC63e5653D97dc8D20C)) return `defaultFee(USDY) = (active, 0, 0)`, i.e. no fee. Fees can be changed by the `FEE_MANAGER_ROLE` without a timelock.
- **Minimums:** $1 subscription and $1 redemption (`minimumDepositUSD` / `minimumRedemptionUSD` = 1e18).
- **Rate limits** ([`OndoRateLimiter`](https://etherscan.io/address/0x98Db502215Da1ad9F626D4a0090A8A2f4971003c), 24h linear decay):

| Limit | Value |
|-------|-------|
| Global subscription | $100,000,000 / 24h |
| Global redemption | **$15,000,000 / 24h** |
| Default per-user subscription | $50,000,000 / 24h |
| Default per-user redemption | **$10,000,000 / 24h** |

- **Price guard:** `minimumRwaPrice = 1.1157` blocks subscribe/redeem if the oracle falls below that floor. The router also enforces `minimumTokenPrice(USDC) = 0.995` via Chainlink [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) (108,000s staleness). The manager itself values USDC at a hardcoded $1.00 in [`OndoOracle`](https://etherscan.io/address/0x9Cad45a8BF0Ed41Ff33074449B357C7a1fAb4094).
- **Other chains:** minting and redeeming on Sui, Aptos, Stellar, XRP and Noble is by support request, with a $5,000 minimum ([USDY Basics](https://docs.ondo.finance/general-access-products/usdy/basics)).

### Token Mint Authority

**Mint mechanism:** Role-gated OpenZeppelin `AccessControlEnumerable` (`MINTER_ROLE`) on the upgradeable USDY token. Remote-chain tokens have their own `MINTER_ROLE` sets.

**Mint requires backing:** No, for three of the four Ethereum minters. Only the `USDY_InstantManager.subscribe` path moves collateral (USDC) in the same transaction. Even that USDC goes to an Ondo Safe, not to a verifiable reserve.

**Per-address mint authority** (verified onchain at block 26084693 via `getRoleMemberCount` / `getRoleMember` on [`0x96F6eF951840721AdBF46Ac996b59E0235CB985C`](https://etherscan.io/address/0x96F6eF951840721AdBF46Ac996b59E0235CB985C)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0xa42613C243b67BF6194Ac327795b926B4b491f15`](https://etherscan.io/address/0xa42613C243b67BF6194Ac327795b926B4b491f15) | ✓ | own balance | `MINTER_ROLE` — `USDY_InstantManager` (OGM) | `subscribe` mints against USDC. **`adminSubscribe` mints without any deposit.** It is gated by `ADMIN_SUBSCRIPTION_ROLE` (3-of-6 Safe [`0x505ff4462bA5E62ed529FA836D768ECd7B85439c`](https://etherscan.io/address/0x505ff4462bA5E62ed529FA836D768ECd7B85439c)) and a USD allowance in [`AdminSubscriptionChecker`](https://etherscan.io/address/0x1cb2Dcc325615d02ae384941149d1dA6521fa018) (currently **$25,000,000** remaining). The allowance is re-settable by the 3-of-5 Safe [`0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF`](https://etherscan.io/address/0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF). 8 admin subscriptions totalling 42.16M USDY ($48.05M) since April 8, 2026. |
| [`0x25A103A1D6AeC5967c1A4fe2039cdc514886b97e`](https://etherscan.io/address/0x25A103A1D6AeC5967c1A4fe2039cdc514886b97e) | ✓ | — | `MINTER_ROLE` — legacy `USDYManager` (Ondo USDY LLC) | Mints on `claimMint` after `RELAYER_ROLE` posts an offchain deposit proof (`addProof`), `PRICE_ID_SETTER_ROLE` sets its price and `TIMESTAMP_SETTER_ROLE` sets the claim time. Relayer and price-ID setter: 2-of-6 Safe [`0x8D52a385D19F13Ef5A544E0514c62f0A44ff31bf`](https://etherscan.io/address/0x8D52a385D19F13Ef5A544E0514c62f0A44ff31bf) and admin Safe. Timestamp setter: 3-of-6 Safe [`0x505ff4462bA5E62ed529FA836D768ECd7B85439c`](https://etherscan.io/address/0x505ff4462bA5E62ed529FA836D768ECd7B85439c) and admin Safe. The two operational Safes have the **same six owners**. Still active: ~1,251.4M USDY minted through this path in 2026, e.g. [344.9M in one batch on March 9, 2026](https://etherscan.io/tx/0x997879d88c4c5c9afa8a1156e485b704e1e8ae3e1050525cc5febfd18f6cb032) and [493.4M on May 11, 2026](https://etherscan.io/tx/0x5a08b28c8e6f6ed33ce42da3879339603769824bec867a9e6be8feff87fa3d6c). Legacy redemptions are paused (`redemptionPaused = true`). |
| [`0xa6275720b3fB1Efe3E6EF2b5BF2293148852307D`](https://etherscan.io/address/0xa6275720b3fB1Efe3E6EF2b5BF2293148852307D) | ✓ | ✓ | `MINTER_ROLE` — LayerZero `OndoMintBurnAdapter` | Burns on send, mints on receive. Inbound is capped at 500,000 USDY/24h per EVM route and 300,000/24h from Solana; BNB Chain and Plume inbound limits are 0. See [External Dependencies](#external-dependencies). Owner/delegate: admin Safe. |
| [`0x1a694A09494E214a3Be3652e4B343B7B81A73ad7`](https://etherscan.io/address/0x1a694A09494E214a3Be3652e4B343B7B81A73ad7) | ✓ | via grant | `MINTER_ROLE` + `DEFAULT_ADMIN_ROLE` — 4-of-7 Safe (Ondo admin) | Can mint any amount directly, grant `MINTER_ROLE` or `BURNER_ROLE` to anyone, and upgrade the token via [ProxyAdmin `0x3ed61633057da0bc58f84b2b9002845e56f94c19`](https://etherscan.io/address/0x3ed61633057da0bc58f84b2b9002845e56f94c19), which it owns. No timelock, module or guard. **Used in practice:** 17 direct `mint` calls in 2026 totalling 95.96M USDY, including [92.14M on May 29, 2026](https://etherscan.io/tx/0x5ef005ec88ea5f40a805a2791690e5f7028205a7ea48bf983beb648ac4dafb72) to top holder [`0xc392749b6ff2cd95e5a4e3ed396c93f813395041`](https://etherscan.io/address/0xc392749b6ff2cd95e5a4e3ed396c93f813395041) and recurring ~0.2–0.3M mints (latest [September 28, 2026](https://etherscan.io/tx/0xf2c0c3df54f9e06674b87189dc8ba1eee010d24d6343e40983d7bfbf7f703cdb)). The 92.14M mint is **not** recorded as LLC issuance: the LLC's digital-token count is unchanged at 1,873,710,038.64 in the daily Ankura reports for May 27 – June 2, 2026. No offsetting burn exists on Ethereum, Sei, Arbitrum or Mantle. The recurring small mints (2.71M in total) went to EOA [`0x5cec0b5e7cd0eaffa2c5d802767f35976224c72f`](https://etherscan.io/address/0x5cec0b5e7cd0eaffa2c5d802767f35976224c72f). The purpose and backing of these mints is undisclosed (**TODO**). It may be OGM issuance or a migration from Solana/BNB Chain/Stellar, which could not be checked. |

`BURNER_ROLE` (burn **from any address**) currently has 0 holders. The admin Safe can grant it at any time.

**Rate limits / supply caps:** No supply cap on the token. The InstantManager path is capped by the rate limiter ($100M/24h global subscriptions) and the admin-subscription allowance. The LayerZero adapter is capped by inbound rate limits. **The legacy `USDYManager` and the admin Safe have no onchain cap.**

**Backing check at mint time:** Atomic USDC transfer for `USDY_InstantManager.subscribe` only. The legacy manager and `adminSubscribe` settle offchain, and the admin Safe needs no backing at all.

**Remote EVM chains.** Each remote token is an upgradeable proxy whose ProxyAdmin is owned by that chain's 4-of-7 Ondo admin Safe. That Safe also holds `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE`, so it can mint directly. `BURNER_ROLE` is empty on every chain. Each chain also has a 1-of-9 pauser Safe.

| Chain | Token | Supply | `MINTER_ROLE` holders | Admin Safe (4/7) | Pauser Safe (1/9) |
|-------|-------|-------:|-----------------------|------------------|-------------------|
| BNB Chain | [`0x608593d17A2decBbc4399e4185bE4922F97eD32E`](https://bscscan.com/address/0x608593d17A2decBbc4399e4185bE4922F97eD32E) | 72.20M | admin Safe; LayerZero adapter [`0xAE6a049cDda7536Af3875B3dAAF34f24Be5cF00c`](https://bscscan.com/address/0xAE6a049cDda7536Af3875B3dAAF34f24Be5cF00c); `USDY_InstantManager` [`0x9bA360087075A4Cef548eeD71Eed197bf4cFA4E2`](https://bscscan.com/address/0x9bA360087075A4Cef548eeD71Eed197bf4cFA4E2) | [`0x79dfe7e9A32a9aB32aA77ccF46d788e7290aFA3d`](https://bscscan.com/address/0x79dfe7e9A32a9aB32aA77ccF46d788e7290aFA3d) | [`0x80120C4d44fFD6f86716FD8DaCd5E395d8BBbe97`](https://bscscan.com/address/0x80120C4d44fFD6f86716FD8DaCd5E395d8BBbe97) |
| Sei | [`0x54cD901491AeF397084453F4372B93c33260e2A6`](https://seiscan.io/address/0x54cD901491AeF397084453F4372B93c33260e2A6) | 225.83M | admin Safe; LayerZero adapter [`0x6f04b655d5209e85e47d3920a2ef407a66e83f6c`](https://seiscan.io/address/0x6f04b655d5209e85e47d3920a2ef407a66e83f6c) | [`0x17813b63cc706111894190ae25d10af5cf586e58`](https://seiscan.io/address/0x17813b63cc706111894190ae25d10af5cf586e58) | not read |
| Arbitrum | [`0x35e050d3C0eC2d29D269a8EcEa763a183bDF9A9D`](https://arbiscan.io/address/0x35e050d3C0eC2d29D269a8EcEa763a183bDF9A9D) | 2.73M | admin Safe; LayerZero adapter [`0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41`](https://arbiscan.io/address/0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41) | [`0xC4ac5c2fA461901b4D91832d03A7018092eDCb4D`](https://arbiscan.io/address/0xC4ac5c2fA461901b4D91832d03A7018092eDCb4D) | [`0x3AE96235C9F99ABE9D36E60ff79f8D3C8844D196`](https://arbiscan.io/address/0x3AE96235C9F99ABE9D36E60ff79f8D3C8844D196) |
| Mantle | [`0x5bE26527e817998A7206475496fDE1E68957c5A6`](https://explorer.mantle.xyz/address/0x5bE26527e817998A7206475496fDE1E68957c5A6) | 0.32M | admin Safe; LayerZero adapter [`0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41`](https://explorer.mantle.xyz/address/0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41) | [`0xC8A7870fFe41054612F7f3433E173D8b5bFcA8E3`](https://explorer.mantle.xyz/address/0xC8A7870fFe41054612F7f3433E173D8b5bFcA8E3) | [`0xC04E1818932f24Ec03457763deF23475D575A44C`](https://explorer.mantle.xyz/address/0xC04E1818932f24Ec03457763deF23475D575A44C) |

- **Sei.** The 225.83M supply was minted natively on Sei, not bridged: Ethereum's outbound limit of 450k USDY/day could not have moved it. For example, [133.74M on May 1, 2026](https://seiscan.io/tx/0x3f775e74879c5a8d4dc98ae2cbb386e57be835cce0deb8d4b9524ab2634b39e3) went to a single address, [`0xbbc97fa7898bfc6e387c66b42ec243573d2f8027`](https://seiscan.io/address/0xbbc97fa7898bfc6e387c66b42ec243573d2f8027).
- **BNB Chain** has its own OGM `USDY_InstantManager`, which subscribes and redeems in USDT. Its admin is 4-of-7 Safe [`0xa307e57ca7f9712af3557Af8c5624BeF214aa913`](https://bscscan.com/address/0xa307e57ca7f9712af3557Af8c5624BeF214aa913); `adminSubscribe` is held by 3-of-6 Safe [`0x4d25d4790B4eC8B40605dA55509479047a3D4728`](https://bscscan.com/address/0x4d25d4790B4eC8B40605dA55509479047a3D4728), with **$34.97M** of admin-mint allowance remaining.
  - The BNB LayerZero adapter's **outbound** limits are 0 on every route, and Ethereum's inbound limit from BNB is 0. BNB USDY therefore cannot be bridged out.
  - A full BNB mint/burn history was not reconstructed: the configured BNB RPC limits `eth_getLogs` to 10-block ranges.
- **Solana.** Mint authority `BB7W8gZouRNRGyr8Djx8zyoRcgckrDXkKiMjNMtPwaAQ`; freeze authority `51QVCuHfL1FeNjd8BDeffCKhCcAYoULnVB3yjNhShiuK`. Both come from the Jupiter token indexer, and who controls them is **TODO**.
- **Stellar, Sui, Aptos, Noble, Tempo, X Layer, Plume:** mint authorities not verified (**TODO**: no configured RPC or explorer access). Stellar carries the second-largest supply (see [Provability](#provability)).

**Ethereum supply history.** All 2,226 mint and 1,408 burn events net to exactly `totalSupply` = **1,044,977,484.60 USDY**. Since December 15, 2025 the InstantManager has processed:

- 686 subscriptions: 164.40M USDY / $187.39M
- 660 redemptions: 57.29M USDY / $65.21M
- 8 admin subscriptions: 42.16M USDY / $48.05M

That leaves ~149.3M USDY (~$171M) net OGM issuance on Ethereum, broadly consistent with the "$216.3M Ondo Stocks issued USDY" line on Ondo's page once other chains are included.

### Collateralization

**Ondo USDY LLC (legacy issuer, ~90% of value).** The [daily Ankura report for September 24, 2026](https://www.dropbox.com/scl/fo/375wdvar3rbc7o23nxsgp/AOFY8jhpENaNx9WAw-WPnbY?rlkey=4icqn1z9bez725wywr30fx52a&st=bsxeh8j5&dl=0) shows:

| Item | Value |
|------|-------|
| Token Principal Outstanding | $2,066,700,997.67 (1,801,360,567.99 digital tokens × $1.1473) |
| Permitted Assets | $2,082,911,466.72 |
| Ratio | **1.007844** |
| US Treasury Bills | $2,082,280,902.05 (99.97%), WAM 167 days |
| First Citizens bank deposit | $620,484 |
| Brokerage cash | $10,080 |
| Custody split | Marex $1,994.7M (95.8%); StoneX (BNY Mellon custody) $87.6M |

**Opt-Out Lender structure.** The monthly reports footnote that the Marex balance "includes securities used for structured financing and which constitute Opt-Out Lender Underlyings under the **Amended and Restated** Tokenized Credit and Security Agreement". Since the July 2026 report, "**Marex is not subject to Portfolio Default Test**". In August 2026 the 100.5% test covered only $154.7M of assets against $147.0M of token value (ratio 1.053); the remaining ~$1.99B of principal is outside it. Ondo's page (footnote 5) likewise excludes these securities from its collateralization ratio.

The amended TCSA is not public, so it is unverified:

- what "structured financing" means (e.g. repo or pledge to Marex);
- whether Marex holds a senior claim over those T-bills;
- which lenders "opted out" and what they receive.

The four 3-of-5 Safes holding 81% of Ethereum supply received their USDY via the same 2026 batch mints. This suggests, but does not prove, that they are the Opt-Out Lenders. **TODO:** obtain the amended TCSA or an Ondo statement.

**OGM-issued USDY (~$216M, ~9.4%).** Ondo's page lists "Ondo Stocks issued USDY – USD Value $216,275,570" as an *underlying asset*. The daily Ankura report states it "reflects only USDY issued by Ondo USDY LLC, and does not account for USDY issued by Ondo Global Markets (BVI) Limited." No attestation of the reserves behind OGM-issued USDY was found.

The Ondo Stocks framework describes the OGM issuer as a bankruptcy-remote SPV with Ankura as security agent and daily attestations of *stock* holdings ([Trust & Transparency](https://docs.ondo.finance/ondo-stocks/trust-and-transparency)). Whether that framework covers USDY reserves is **TODO**. The USDC from OGM subscriptions is routed to Safe [`0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5`](https://etherscan.io/address/0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5), which held only $24.99M at the snapshot.

**Headline ratio.** Ondo's 121.95% "Collateralization Ratio" does not follow from its own published figures ($2.30B / $2.07B = 111%). The $2.30B includes OGM-issued USDY valued at face as an asset. The verifiable figure is the LLC's **100.4–100.8%** in recent daily and monthly reports.

**Collateral quality:** high. Short T-bills (maturities October 2026 – September 2027) and small bank deposits; no credit or duration risk beyond ~1 year.

**Custody and control:** offchain, at Marex, StoneX/BNY Mellon and First Citizens, under Ankura's security interest for LLC lenders. Onchain actors cannot move the reserves. Ondo controls issuance, the price oracle and the USDC redemption buffer.

**Risk curation:** the oracle rate is set monthly by Ondo "in accordance with the USDY governing documents" (September 2026 daily rate 1.0000969, ~3.6% APY). Rate limits, fees and the admin-subscription allowance are set by Ondo Safes without a timelock.

### Provability

- **Reserves:** offchain. Ankura Trust, as Verification Agent, reviews market values, CUSIPs and maturities daily through read-only access to the deposit, brokerage, operating and exchange accounts. It publishes daily and monthly PDFs; the latest monthly report (August 2026) was uploaded September 3, 2026. There is no Chainlink PoR or other onchain reserve feed.
- **Coverage gap:** OGM-issued USDY (~9%) is not covered by the Ankura reports, and the Marex opt-out sleeve (~93% of LLC assets) is excluded from the covenant test.
- **Supply reconciliation.** Ondo's USDY page embeds per-chain TVL (`tvlUsd`, total $2,278,091,841.77 at price $1.14785599). Converted to tokens and compared with direct reads:

| Chain | Ondo-reported (tokens) | Independent read | Source |
|-------|-----------------------:|-----------------:|--------|
| Ethereum | 1,044.98M | 1,044.98M | onchain `totalSupply` |
| Stellar | 467.50M | — | not read (**TODO**) |
| Sei | 225.83M | 225.83M | onchain (Etherscan API) |
| Solana | 155.99M | 156.47M | Jupiter token indexer |
| BNB Chain | 72.20M | 72.20M | onchain `totalSupply` |
| Sui | 12.49M | — | not read |
| Arbitrum | 2.73M | 2.73M | onchain `totalSupply` |
| Aptos | 1.85M | — | not read |
| Tempo / Mantle / Noble | 0.70M / 0.32M / 0.06M | Mantle 0.32M | Mantle onchain |
| **Total** | **1,984.65M** | | |

  Where independent reads exist they match Ondo's figures. The total of 1,984.65M tokens is within **−0.26%** of the two issuers combined: LLC 1,801.36M digital tokens (September 24 report) plus ~188.4M OGM tokens (Ondo's $216.28M "Ondo Stocks issued USDY" line at $1.1479). The small difference is consistent with the gap between the report and snapshot dates. The supply therefore reconciles at the aggregate level.

  Stellar (23.6% of supply) and the other non-EVM chains rest on Ondo's own figures. Splitting the supply by issuer on each chain is not possible onchain.
- **Price / yield:** calculated onchain by [`RWADynamicOracle`](https://etherscan.io/address/0xA0219AA5B31e65Bc920B5b6DFb8EdF0988121De0) as a daily-compounding rate over monthly ranges (38 ranges; current range ends October 1, 2026 00:00 UTC). Anyone can compute it.
  - The rate itself is chosen by Ondo's `SETTER_ROLE`: the admin Safe and 4-of-8 Safe [`0x19c114B7c6Ff86482cEbFc6AE3cef894e6793Db8`](https://etherscan.io/address/0x19c114B7c6Ff86482cEbFc6AE3cef894e6793Db8). `setRange` rejects rates below 1.0, so it cannot lower the price.
  - The admin Safe can call `overrideRange` to rewrite any range, including the price, and can pause the oracle. A paused oracle makes `getPrice()` revert, which blocks InstantManager mint and redeem.
  - If no new range is set, the price freezes at the last range end rather than reverting.
  - The price is not derived from NAV; it is a pre-announced rate. The gap between accrued yield and reserve income is absorbed by the issuer's excess collateral.

## Liquidity Risk

**Primary exit (KYC'd, non-US holders): `USDY_InstantManager.redeem`.** Atomic, oracle-priced and currently fee-free. Capacity at the snapshot was the lowest of:

- Global redemption rate limit: **$15.0M per 24h** (fully available at the snapshot)
- Per-user default limit: **$10.0M per 24h**
- USDC available from `BasicSource` (balance of Safe [`0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5`](https://etherscan.io/address/0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5)): **$24.99M**

The buffer is manually topped up by Ondo; there is no onchain link between the buffer and the T-bill reserves. A Yearn strategy that is registered could therefore exit about $10M per day. A $50M position would take at least 5 days if no other user competes for the $15M global limit and Ondo refills the buffer. Beyond the buffer, redemption requires Ondo to sell T-bills offchain. Neither the onchain contracts nor Ondo's docs specify a settlement time for that case (**TODO**: OGM sales terms, available only after KYC).

**BNB Chain exit:** the BNB `USDY_InstantManager` redeems into USDT with the same limits: $15M/24h global, $10M/24h per user, zero fees. USDT comes from [`BasicSource` `0xcf234Acac91fCb0390b4CFfb2D8cbb50be5FC245`](https://bscscan.com/address/0xcf234Acac91fCb0390b4CFfb2D8cbb50be5FC245), backed by 3-of-6 Safe [`0xb33A6BDF4192Ebd826ee14967C48F08D3B889fAd`](https://bscscan.com/address/0xb33A6BDF4192Ebd826ee14967C48F08D3B889fAd) holding **25.90M USDT**. BNB USDY cannot be bridged out (outbound limits are 0), so this manager and BNB DEXs are its only exits.

**Legacy exit:** `USDYManager` redemptions are paused onchain. LLC holders redeem by USD wire to non-US bank accounts ([USDY Basics](https://docs.ondo.finance/general-access-products/usdy/basics)). Non-EVM chains (Sui, Aptos, Noble, Stellar) redeem by sending tokens to a per-chain "USDY Redemptions Account" ([addresses](https://docs.ondo.finance/addresses#usdy)). Ondo's docs publish no settlement timing for these offchain paths (**TODO**).

**Secondary markets (non-KYC holders):**

| Venue | Pool | Liquidity (GeckoTerminal) |
|-------|------|---------------------------|
| Solana Orca Whirlpool | [`AGXrswVDRoUf62UX9voTXv6TCGw6fBUEwDpyUd9YdZfD`](https://solscan.io/account/AGXrswVDRoUf62UX9voTXv6TCGw6fBUEwDpyUd9YdZfD) USDY/USDC | ~$2.90M |
| Sei DragonSwap V2 | [`0xc1b96fa8421807c5bac89ba699c75737c81feea5`](https://seiscan.io/address/0xc1b96fa8421807c5bac89ba699c75737c81feea5) USDY/USDC 0.01% | ~$1.01M |
| Ethereum Uniswap V4 | several USDY/USDC pools | <$100K combined |
| Ethereum Uniswap V3 | [USDC 0.01%](https://etherscan.io/address/0xB5C58439bb259A1F221A029Fb82ce97F256648D7) 0.64 USDY; [USDT 0.3%](https://etherscan.io/address/0xcf5F0C2B704bB20403E30b63d3107b4fBE6C084c) 118 USDY | negligible |
| Ethereum Curve | [rUSDY/USDC](https://etherscan.io/address/0xe1fbaEc91b8A211db901AdF5ACc5b31f9A988279) and other USDY pools | ≤$47 |
| Mantle (Agni, iZiSwap, FusionX) | several | <$5K combined |

No Uniswap V2 USDY pair exists on Ethereum.

**Executable quotes (Jupiter, Solana, USDY→USDC, against oracle $1.14786):**

| Size | USDC out | Implied price | vs oracle |
|------|---------:|--------------:|----------:|
| 100,000 USDY | 114,402 | 1.14402 | −0.33% |
| 500,000 USDY | 571,061 | 1.14212 | −0.50% |
| 1,000,000 USDY | 1,139,320 | 1.13932 | −0.74% |
| 2,000,000 USDY | 1,339,120 | 0.66956 | −41.7% |

A non-whitelisted holder cannot exit more than ~$1M without heavy loss. Ethereum has no usable secondary liquidity.

**LP concentration: not determined.**
- The Sei DragonSwap V2 pool is a concentrated-liquidity pool with ~87K `Mint`/`Burn` events. Reconstructing positions from the Etherscan log API gave inconsistent totals (more burns than mints), so no ownership split is reported.
- The Orca pool is on Solana, which has no configured RPC.
- Treat both pools' liquidity as removable at short notice (**TODO**).

**Stress history:** no observed stress event for USDY's redemption path. The December 2025 issuer change and the January 2026 covenant breach did not show up as onchain redemption failures.

## Centralization & Control Risks

### Governance

| Contract | Upgrade / admin authority | Timelock |
|----------|---------------------------|----------|
| USDY token (TransparentUpgradeableProxy → impl [`0xea0f7eebdc2ae40edfe33bf03d332f8a7f617528`](https://etherscan.io/address/0xea0f7eebdc2ae40edfe33bf03d332f8a7f617528)) | ProxyAdmin [`0x3ed61633057da0bc58f84b2b9002845e56f94c19`](https://etherscan.io/address/0x3ed61633057da0bc58f84b2b9002845e56f94c19) owned by 4-of-7 Safe [`0x1a694A09494E214a3Be3652e4B343B7B81A73ad7`](https://etherscan.io/address/0x1a694A09494E214a3Be3652e4B343B7B81A73ad7); same Safe is `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, `PAUSER_ROLE`, `LIST_CONFIGURER_ROLE` | None |
| rUSDY (proxy → impl [`0x58910371d0b52dcf9d2e0a1af4e0078c58436908`](https://etherscan.io/address/0x58910371d0b52dcf9d2e0a1af4e0078c58436908)) | ProxyAdmin [`0xd037a4c1c6b7368cad2537c67e0dc75369d252e9`](https://etherscan.io/address/0xd037a4c1c6b7368cad2537c67e0dc75369d252e9) owned by [`0x1a694A09494E214a3Be3652e4B343B7B81A73ad7`](https://etherscan.io/address/0x1a694A09494E214a3Be3652e4B343B7B81A73ad7) | None |
| `USDY_InstantManager`, `OndoTokenRouter`, `OndoOracle`, `OndoRateLimiter`, `AdminSubscriptionChecker`, `OndoCompliance`, `OndoFees` | `DEFAULT_ADMIN_ROLE` = 3-of-5 Safe [`0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF`](https://etherscan.io/address/0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF) (not upgradeable, but admin can swap the router, oracle, compliance, ID registry, rate limiter and fee modules, and `retrieveTokens`) | None |
| `OndoIDRegistry` ([proxy `0xcf6958D69d535FD03BD6Df3F4fe6CDcd127D97df`](https://etherscan.io/address/0xcf6958D69d535FD03BD6Df3F4fe6CDcd127D97df)) | ProxyAdmin [`0x988d740a4365d9d8106fc71aa691ddd2527c07ff`](https://etherscan.io/address/0x988d740a4365d9d8106fc71aa691ddd2527c07ff) owned by [`0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF`](https://etherscan.io/address/0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF) | None |
| `RWADynamicOracle` | `DEFAULT_ADMIN_ROLE`/`PAUSER_ROLE` = [`0x1a694A09494E214a3Be3652e4B343B7B81A73ad7`](https://etherscan.io/address/0x1a694A09494E214a3Be3652e4B343B7B81A73ad7); `SETTER_ROLE` also 4-of-8 Safe [`0x19c114B7c6Ff86482cEbFc6AE3cef894e6793Db8`](https://etherscan.io/address/0x19c114B7c6Ff86482cEbFc6AE3cef894e6793Db8) | None |
| `USDYOracleWrapper` [`0x87b126e5518b6a1Bb8465779b4607C45C643DF90`](https://etherscan.io/address/0x87b126e5518b6a1Bb8465779b4607C45C643DF90) | `Ownable2Step` owner [`0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF`](https://etherscan.io/address/0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF) (`setRwaOracle`) | None |
| Blocklist [`0xd8c8174691d936E2C80114EC449037b13421B0a8`](https://etherscan.io/address/0xd8c8174691d936E2C80114EC449037b13421B0a8) | Owner **1-of-2 Safe** [`0x99ca4f54F6Bb1c36C662e7C404f517D150FD1173`](https://etherscan.io/address/0x99ca4f54F6Bb1c36C662e7C404f517D150FD1173) | None |
| LayerZero adapter [`0xa6275720b3fB1Efe3E6EF2b5BF2293148852307D`](https://etherscan.io/address/0xa6275720b3fB1Efe3E6EF2b5BF2293148852307D) | Owner and endpoint delegate [`0x1a694A09494E214a3Be3652e4B343B7B81A73ad7`](https://etherscan.io/address/0x1a694A09494E214a3Be3652e4B343B7B81A73ad7) (peers, DVNs, rate limits) | None |

**Multisigs:**

| Safe | Threshold | Role |
|------|-----------|------|
| [`0x1a694A09494E214a3Be3652e4B343B7B81A73ad7`](https://etherscan.io/address/0x1a694A09494E214a3Be3652e4B343B7B81A73ad7) | 4/7 | Admin |
| [`0x2e55b738F5969Eea10fB67e326BEE5e2fA15A2CC`](https://etherscan.io/address/0x2e55b738F5969Eea10fB67e326BEE5e2fA15A2CC) | **1/9** | Pauser |
| [`0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF`](https://etherscan.io/address/0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF) | 3/5 | xManager admin |
| [`0x505ff4462bA5E62ed529FA836D768ECd7B85439c`](https://etherscan.io/address/0x505ff4462bA5E62ed529FA836D768ECd7B85439c) | 3/6 | Admin subscriptions, legacy timestamp setter |
| [`0x8D52a385D19F13Ef5A544E0514c62f0A44ff31bf`](https://etherscan.io/address/0x8D52a385D19F13Ef5A544E0514c62f0A44ff31bf) | **2/6** | Legacy relayer / pricer |
| [`0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5`](https://etherscan.io/address/0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5) | 3/6 | USDC treasury |
| [`0x19c114B7c6Ff86482cEbFc6AE3cef894e6793Db8`](https://etherscan.io/address/0x19c114B7c6Ff86482cEbFc6AE3cef894e6793Db8) | 4/8 | Oracle setter |
| [`0x99ca4f54F6Bb1c36C662e7C404f517D150FD1173`](https://etherscan.io/address/0x99ca4f54F6Bb1c36C662e7C404f517D150FD1173) | **1/2** | Blocklist owner |

- Signers are not publicly named.
- All seven admin-Safe owners also sit on the 1-of-9 pauser Safe.
- Three owners of [`0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF`](https://etherscan.io/address/0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF) are admin-Safe owners.
- The six owners of [`0x505ff4462bA5E62ed529FA836D768ECd7B85439c`](https://etherscan.io/address/0x505ff4462bA5E62ed529FA836D768ECd7B85439c) and [`0x8D52a385D19F13Ef5A544E0514c62f0A44ff31bf`](https://etherscan.io/address/0x8D52a385D19F13Ef5A544E0514c62f0A44ff31bf) are identical and largely match [`0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5`](https://etherscan.io/address/0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5).

**Powers that can harm holders:**

- The admin Safe can **mint unbacked USDY**, **upgrade the token implementation**, and grant `BURNER_ROLE` to burn any holder's balance. It can also rewrite oracle ranges (`overrideRange`) and pause the token or oracle.
- The 1-of-2 blocklist Safe can **freeze any address** (all transfers from or to a blocked address revert).
- The 1-of-9 pauser Safe can pause all USDY transfers; only the admin Safe can unpause.
- None of these actions is timelocked.

### Programmability

- **Onchain:** instant mint/redeem accounting, oracle price derivation, rate limits and the LayerZero burn/mint.
- **Admin-driven:** the monthly rate range, the USDC redemption buffer (manually funded Safe), and legacy issuance (offchain proofs posted by a 2-of-6 Safe). Admin subscriptions are recorded offchain via a `metadata` field.
- **PPS definition:** onchain formula with an admin-supplied monthly rate, independent of actual reserve NAV.
- **Offchain dependencies:** Ondo compliance/KYC backend (ID registry), treasury operations that refill the buffer, Ankura reporting, custodians and brokers.

### External Dependencies

- **Custodians / brokers:** Marex (~96% of LLC Treasuries), StoneX with BNY Mellon custody, First Citizens Bank. Coinbase Prime was historically the subscription deposit address.
- **Ankura Trust Company:** Verification Agent and Collateral Agent (LLC).
- **Chainalysis sanctions oracle:** [`0x40C57923924B5c5c5455c48D93317139ADDaC8fb`](https://etherscan.io/address/0x40C57923924B5c5c5455c48D93317139ADDaC8fb), checked on every transfer.
- **Circle USDC:** the only accepted subscription and redemption token on Ethereum.
- **Chainlink USDC/USD:** used by the router's price floor.
- **LayerZero V2:** the Ethereum adapter can mint canonical USDY on inbound messages. Receive-side ULN configs read at the snapshot:

| Route (inbound to Ethereum) | Peer | Required DVNs | Confirmations | Inbound limit / 24h |
|---|---|---|---|---|
| Arbitrum → Ethereum | [`0x0be393dc46248e4285dc5caca3084bc7e9bfbb41`](https://arbiscan.io/address/0x0be393dc46248e4285dc5caca3084bc7e9bfbb41) | 4-of-4: Ondo, LayerZero Labs, Canary, Fidelity (FCAT) | 3,600 | 500,000 USDY |
| Mantle → Ethereum | [`0x0be393dc46248e4285dc5caca3084bc7e9bfbb41`](https://explorer.mantle.xyz/address/0x0be393dc46248e4285dc5caca3084bc7e9bfbb41) | 3-of-3: Ondo, LayerZero Labs, Canary | 375 | 500,000 USDY |
| Sei → Ethereum | [`0x6f04b655d5209e85e47d3920a2ef407a66e83f6c`](https://seiscan.io/address/0x6f04b655d5209e85e47d3920a2ef407a66e83f6c) | 3-of-3: Ondo, LayerZero Labs, Canary | 20 | 500,000 USDY |
| Solana → Ethereum | peer bytes32 `0x612f5a1940cb8711900ef4cdab2065ffa2fb060d0afca4a99c43371dd3b1e6a8` | 4-of-4: Ondo, LayerZero Labs, Canary, Fidelity (FCAT) | 32 | 300,000 USDY |
| Tempo → Ethereum | [`0xd45c2377241f1da765570e0d57920f1cf4855bcb`](https://explore.tempo.xyz/address/0xd45c2377241f1da765570e0d57920f1cf4855bcb) | 4-of-4: Ondo, LayerZero Labs, Canary, Fidelity (FCAT) | 100 | 500,000 USDY |
| BNB Chain → Ethereum | [`0xae6a049cdda7536af3875b3daaf34f24be5cf00c`](https://bscscan.com/address/0xae6a049cdda7536af3875b3daaf34f24be5cf00c) | 3-of-3: Ondo, LayerZero Labs, Canary | 70 | **0** (inbound disabled) |
| Plume → Ethereum | [`0x944acfc05062339c6862555b42f12d3fb03f8122`](https://explorer.plume.org/address/0x944acfc05062339c6862555b42f12d3fb03f8122) | 3-of-3 | 1,800 | **0** (limit unset) |

DVN names are from the [LayerZero metadata API](https://metadata.layerzero-api.com/v1/metadata). The rate limits bound the daily damage from a DVN-quorum or peer compromise to at most ~0.5M USDY per route on Ethereum. They are the owner's configuration, however: the admin Safe can raise them or change DVNs without a timelock.

**Remote receive side (mint on the remote chain).** Receive-side ULN configs were read on the remote adapters at the snapshot blocks:

| Route | Adapter | Required DVNs | Inbound limit / 24h |
|-------|---------|---------------|--------------------:|
| Ethereum → Arbitrum | [`0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41`](https://arbiscan.io/address/0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41) | 4-of-4: Ondo, LayerZero Labs, Canary, Fidelity (FCAT); 65 confirmations | 500,000 USDY |
| Ethereum → BNB Chain | [`0xAE6a049cDda7536Af3875B3dAAF34f24Be5cF00c`](https://bscscan.com/address/0xAE6a049cDda7536Af3875B3dAAF34f24Be5cF00c) | 3-of-3: Ondo, LayerZero Labs, Canary; 65 confirmations | 500,000 USDY |
| Ethereum → Mantle | [`0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41`](https://explorer.mantle.xyz/address/0x0bE393DC46248E4285dc5CAcA3084bc7e9bfbB41) | 3-of-3: Ondo, LayerZero Labs, Canary; 65 confirmations | 500,000 USDY |

- The remote adapters also peer with each other (Arbitrum, BNB Chain, Mantle, Sei, Solana, Tempo). Routes use 3-of-3 or 4-of-4 quorums, and every route from BNB Chain has a 0 inbound limit.
- All adapters are owned by their chain's 4-of-7 admin Safe.
- No remote adapter was paused at the snapshot.
- Sei, Solana and Tempo receive configs were not read (**TODO**).

- **Fallbacks:** none onchain. If Ondo's backend, Marex or the treasury Safe is unavailable, instant redemptions stop at the remaining buffer and rate limits.

## Operational Risk

- **Team:** Ondo Finance Inc. is a well-known RWA tokenization company that has operated OUSG and USDY since 2023 ([Ondo](https://ondo.finance/usdy)). Signers of the Safes are not publicly identified.
- **Legal structure:**
  - Legacy notes are issued by **Ondo USDY LLC** under the TCSA, with Ankura as collateral agent.
  - New notes are issued by **Ondo Global Markets (BVI) Limited**, a BVI SPV owned 90.01% by Flux Finance Inc. (Ondo Foundation) and 9.99% by Ondo Finance Inc. ([Legal & Regulatory](https://docs.ondo.finance/ondo-stocks/legal-and-regulatory)).
  - Offered under Regulation S; not registered under the Securities Act or the Investment Company Act.
- **Documentation:** good for integrators (addresses, InstantManager guide, bridge limits). It is inconsistent on the issuer transition:
  - `USDYManager` is labelled "deprecated" but is the largest 2026 minter.
  - The reserve page mixes both issuers.
  - The amended TCSA and OGM USDY terms are not public.
- **Incident response:** pause roles exist (1-of-9 pauser, oracle pauser, LayerZero adapter pause), and there are emergency rate limits. No published incident-response plan was found. The January 2026 portfolio-default flag was not publicly communicated as far as could be found.

## Monitoring

| Target | Address | What to watch | Threshold / action | Frequency |
|--------|---------|---------------|--------------------|-----------|
| USDY token | [`0x96F6eF951840721AdBF46Ac996b59E0235CB985C`](https://etherscan.io/address/0x96F6eF951840721AdBF46Ac996b59E0235CB985C) | `RoleGranted`/`RoleRevoked` (esp. `MINTER_ROLE`, `BURNER_ROLE`), `Upgraded`, `Paused`, `AllowlistSet`/`BlocklistSet`/`SanctionsListSet`, `totalSupply()` | Any role/impl change → alert; supply change >5% in 24h → alert | Real-time |
| ProxyAdmin | [`0x3ed61633057da0bc58f84b2b9002845e56f94c19`](https://etherscan.io/address/0x3ed61633057da0bc58f84b2b9002845e56f94c19) | `OwnershipTransferred`, `upgrade` calls | Any → alert | Real-time |
| Admin Safe | [`0x1a694A09494E214a3Be3652e4B343B7B81A73ad7`](https://etherscan.io/address/0x1a694A09494E214a3Be3652e4B343B7B81A73ad7) | Executed txs, owner/threshold changes, direct `mint` calls | Any mint by Safe → alert | Real-time |
| Legacy USDYManager | [`0x25A103A1D6AeC5967c1A4fe2039cdc514886b97e`](https://etherscan.io/address/0x25A103A1D6AeC5967c1A4fe2039cdc514886b97e) | `DepositProofAdded`, `MintCompleted`, `ClaimableTimestampSet` | Mint >$25M → alert | Real-time |
| USDY_InstantManager | [`0xa42613C243b67BF6194Ac327795b926B4b491f15`](https://etherscan.io/address/0xa42613C243b67BF6194Ac327795b926B4b491f15) | `subscribePaused()`, `redeemPaused()`, `AdminSubscription`, setter events (router/oracle/compliance/fees) | Redeem paused, or any setter → alert | Real-time |
| Redemption buffer | [`0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5`](https://etherscan.io/address/0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5) | `USDC.balanceOf` / `BasicSource.availableToWithdraw(USDC)` | < $10M → warn; < $2M → alert | Hourly |
| BNB redemption buffer | [`0xb33A6BDF4192Ebd826ee14967C48F08D3B889fAd`](https://bscscan.com/address/0xb33A6BDF4192Ebd826ee14967C48F08D3B889fAd) | `USDT.balanceOf` / `BasicSource.availableToWithdraw(USDT)` on [`0xcf234Acac91fCb0390b4CFfb2D8cbb50be5FC245`](https://bscscan.com/address/0xcf234Acac91fCb0390b4CFfb2D8cbb50be5FC245) | < $10M → warn | Hourly |
| Remote admin Safes | BNB [`0x79dfe7e9A32a9aB32aA77ccF46d788e7290aFA3d`](https://bscscan.com/address/0x79dfe7e9A32a9aB32aA77ccF46d788e7290aFA3d), Sei [`0x17813b63cc706111894190ae25d10af5cf586e58`](https://seiscan.io/address/0x17813b63cc706111894190ae25d10af5cf586e58), Arbitrum [`0xC4ac5c2fA461901b4D91832d03A7018092eDCb4D`](https://arbiscan.io/address/0xC4ac5c2fA461901b4D91832d03A7018092eDCb4D), Mantle [`0xC8A7870fFe41054612F7f3433E173D8b5bFcA8E3`](https://explorer.mantle.xyz/address/0xC8A7870fFe41054612F7f3433E173D8b5bFcA8E3) | Direct `mint` calls, role grants, adapter `setPeer`/`RateLimitsChanged` | Any → alert | Real-time |
| Per-chain supply | Ondo `tvlUsd` per chain vs onchain `totalSupply` | Sum vs LLC digital tokens + OGM line | Divergence > 1% → alert | Daily |
| Rate limiter | [`0x98Db502215Da1ad9F626D4a0090A8A2f4971003c`](https://etherscan.io/address/0x98Db502215Da1ad9F626D4a0090A8A2f4971003c) | `getCurrentGlobalRedemptionLimit(USDY)`, `GlobalRateLimitSet` | Available < $5M or limit lowered → alert | Hourly |
| Admin-subscription allowance | [`0x1cb2Dcc325615d02ae384941149d1dA6521fa018`](https://etherscan.io/address/0x1cb2Dcc325615d02ae384941149d1dA6521fa018) | `adminSubscriptionAllowance(0x505ff4462bA5E62ed529FA836D768ECd7B85439c)`, `AdminSubscriptionAllowanceSet` | Any increase → alert | Real-time |
| Fees | [`0xEaC2181075BA0FC53D5141B17943Ea9F913954e6`](https://etherscan.io/address/0xEaC2181075BA0FC53D5141B17943Ea9F913954e6), [`0xE1cb24077d77d2fE763fCAC63e5653D97dc8D20C`](https://etherscan.io/address/0xE1cb24077d77d2fE763fCAC63e5653D97dc8D20C) | `DefaultFeeConfigUpdated` | Any non-zero fee → alert | Real-time |
| Price oracle | [`0xA0219AA5B31e65Bc920B5b6DFb8EdF0988121De0`](https://etherscan.io/address/0xA0219AA5B31e65Bc920B5b6DFb8EdF0988121De0) | `RangeSet`, `RangeOverriden`, `Paused`; `getPrice()` monotonicity | Any `RangeOverriden`, pause, or price decrease → alert. No new range by 1st of month → warn | Daily |
| Oracle wrapper | [`0x87b126e5518b6a1Bb8465779b4607C45C643DF90`](https://etherscan.io/address/0x87b126e5518b6a1Bb8465779b4607C45C643DF90) | `rwaOracle()` changes | Any → alert | Daily |
| Blocklist | [`0xd8c8174691d936E2C80114EC449037b13421B0a8`](https://etherscan.io/address/0xd8c8174691d936E2C80114EC449037b13421B0a8) | `BlockedAddressesAdded` for Yearn strategy addresses | Strategy blocked → critical | Real-time |
| LayerZero adapter | [`0xa6275720b3fB1Efe3E6EF2b5BF2293148852307D`](https://etherscan.io/address/0xa6275720b3fB1Efe3E6EF2b5BF2293148852307D) | `PeerSet`, `RateLimitsChanged`, endpoint `setConfig` (DVNs) | Any → alert; inbound limit > 1M/day → alert | Real-time |
| Ankura reports | Dropbox folders above | Daily Permitted Assets / Token Principal; monthly Portfolio Default flags; Marex share | Ratio < 1.005 or any "Default: YES" → alert; no daily report for 3 business days → warn | Daily |
| Ondo reserve page | [ondo.finance/usdy](https://ondo.finance/usdy) | "Ondo Stocks issued USDY" value; collateral mix | OGM share > 20% without attestation → reassess | Weekly |

## Appendix: Contract Architecture

```
                         ┌───────────────────────── GOVERNANCE (no timelocks) ──────────────────────────┐
                         │ Admin Safe 4/7 0x1a694A09494E214a3Be3652e4B343B7B81A73ad7 ── owns ProxyAdmins, DEFAULT_ADMIN on USDY/rUSDY/     │
                         │   oracle/USDYManager/pricer, MINTER on USDY, LZ adapter owner+delegate          │
                         │ Pauser Safe 1/9 0x2e55b738F5969Eea10fB67e326BEE5e2fA15A2CC ── pause USDY/rUSDY/InstantManager/legacy manager   │
                         │ xManager Admin Safe 3/5 0x5AE21c99FC5f1584D8Cb09a298CFFd92B5d178eF ── router/oracle registry/rate limits/fees  │
                         │ Ops Safes 3/6 0x505ff4462bA5E62ed529FA836D768ECd7B85439c + 2/6 0x8D52a385D19F13Ef5A544E0514c62f0A44ff31bf (same 6 owners) ── admin subs,      │
                         │   legacy relayer/price-id/timestamp; Oracle setter 4/8 0x19c114B7c6Ff86482cEbFc6AE3cef894e6793Db8              │
                         │ Blocklist owner 1/2 0x99ca4f54F6Bb1c36C662e7C404f517D150FD1173                                                  │
                         └───────────────────────────────────────────────────────────────────────────────┘
                                                    │ MINTER_ROLE / admin
   ┌────────────────────────────────── TOKEN LAYER ─┴──────────────────────────────────┐
   │  USDY (proxy 0x96F6eF951840721AdBF46Ac996b59E0235CB985C) ←wrap── rUSDY (0xaf37c1167910ebC994e266949387d2c7C326b879)                               │
   │   hooks: AllowlistStub (always true) · Blocklist · Chainalysis SanctionsList        │
   └──────▲──────────────────▲────────────────────▲─────────────────────▲──────────────┘
          │ mint/burn         │ mint (claimMint)   │ mint/burn            │ mint (direct)
 ┌────────┴────────┐  ┌───────┴─────────┐  ┌───────┴────────────┐  ┌─────┴──────┐
 │USDY_Instant-    │  │USDYManager      │  │OndoMintBurnAdapter │  │Admin Safe  │
 │Manager (OGM)    │  │(legacy LLC)     │  │(LayerZero V2)      │  │4/7         │
 │subscribe/redeem │  │addProof→priceId │  │DVNs 3–4 of 3–4,    │  └────────────┘
 │adminSubscribe   │  │→timestamp→claim │  │≤500k/day inbound   │
 └──┬──────────┬───┘  └──────┬──────────┘  └───────┬────────────┘
    │ USDC     │ oracle      │ USDYPricer          │ Arbitrum · Mantle · Sei · Solana · Tempo
    ▼          ▼             ▼                     ▼ (BNB/Plume inbound 0); remote 4/7 Safes mint too
 OndoTokenRouter   OndoOracle → USDYOracleWrapper → RWADynamicOracle (monthly rate ranges)
    │  ├─ BasicRecipient → Safe 3/6 0x3312cc371Fe0Dd5171878630A1E5cf69778E8fa5 (USDC treasury, $24.99M)
    │  └─ BasicSource   ← same Safe (redemption buffer)
    ▼
 ───────────── OFFCHAIN ─────────────────────────────────────────────────────────────────
 Ondo USDY LLC (TCSA, Ankura Verification/Collateral Agent): $2.08B T-bills
     Marex ~96% (incl. "Opt-Out Lender" structured-financing sleeve, excluded from test)
     StoneX/BNY Mellon ~4% · First Citizens deposits
 Ondo Global Markets (BVI) Ltd: OGM-issued USDY (~$216M) — reserves not covered by Ankura USDY reports
```

---

## Risk Summary

### Key Strengths

- **High-quality collateral:** ~99.97% short-dated US T-bills (WAM ~167 days) for the LLC portfolio. Daily and monthly third-party verification by Ankura Trust against custodian and broker account data.
- **Track record and scale:** three years in production, LLC principal >$500M for 19 months and ~$2.07B now. No smart-contract exploit or unbacked mint found.
- **Atomic, fee-free primary market** for KYC'd holders via `USDY_InstantManager`, at the oracle price, with ~$10M/day per user and $15M/day global redemption capacity.
- **Extensive audit history** (8 USDY/Funds audits from Code4rena, Spearbit, Cyfrin, Halborn, NetherMind, Zokyo) and a $1M Immunefi bounty.
- **Bridge hardening:** 3–4 required DVNs (including Ondo's own DVN and Fidelity FCAT on some routes) and ≤0.5M USDY/day inbound limits bound LayerZero mint risk.

### Key Risks

- **Two issuers, one token, partial attestation.** ~$216M of OGM-issued USDY is fungible with LLC-issued USDY but is excluded from the Ankura reports. Ondo's headline 121.95% collateralization ratio cannot be reproduced.
- **Thin and partly exempted cushion.** LLC excess collateral fell from ~3% (2025) to 0.3–0.8% (2026). A portfolio-default flag was raised in January 2026. Since July 2026, ~93% of LLC assets (Marex "Opt-Out Lender" structured-financing sleeve) are excluded from the 100.5% covenant test under an unpublished amended TCSA.
- **Unbounded mint authority without timelock.** The 4/7 admin Safe can mint, upgrade, grant burn-from-any-address, and rewrite the oracle. It actively mints directly: 95.96M USDY in 2026, including 92.14M in one transaction. The legacy `USDYManager` mints on offchain proofs from Safes with the same six owners (2/6 relayer). `adminSubscribe` mints without deposit up to a re-settable $25M allowance.
- **Concentration:** four unidentified 3/5 Safes hold 81% of Ethereum USDY (~$974M). Most of the Sei supply (≥223M USDY) was minted to a single address.
- **Exit depends on Ondo:** onchain secondary liquidity is ~$4M total (mostly Solana), and there is none on Ethereum. Primary redemption is limited by a manually funded ~$25M USDC buffer, rate limits and KYC status, all adjustable without timelock. The 1/2 blocklist Safe can freeze any holder.

### Critical Risks

- None triggers a critical gate. The combination of an offchain, ~0.8% cushion, an unattested OGM sleeve, and untimelocked unbacked-mint authority means holders rely almost entirely on Ondo's operational integrity and legal structure.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **Unverified contract source** — PASS. Token proxy and implementation, rUSDY, InstantManager, USDYManager, router, oracle stack and LayerZero adapter are all verified on Etherscan.
- [x] **No audit** — PASS. Multiple audits from reputable firms.
- [x] **Unverifiable reserves** — PASS, with caveat. LLC reserves (~90%) are independently verified daily by Ankura; the OGM sleeve (~9%) is not.
- [x] **Total centralization** — PASS. No single-EOA control over the token; admin is a 4/7 Safe. The 1/2 blocklist and 1/9 pauser Safes are low-threshold, but their powers are limited to freezing and pausing.

All gates pass; proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits: 1.5.** 8 USDY/Funds audits from top firms plus a $1M Immunefi bounty would score 1. Raised by 0.5 because the newest mint surfaces (`USDY_InstantManager`, LayerZero adapter) have no explicitly named published audit and the multi-manager system is complex.
- **Historical: 1.5.** More than 3 years in production with >$500M sustained for 19 months (score 1), minus the January 2026 covenant default flag and the undisclosed 2026 restructuring of collateral terms.

**Score: 1.5/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 4.5.** Upgradeable token owned by a 4/7 Safe with **no timelock** on any path: upgrades, role grants, oracle overrides, LayerZero config. The admin can mint unbacked tokens and grant burn-from-any-address. Operational Safes of 2/6, 3/5 and 3/6 hold mint-adjacent roles; blocklist 1/2; pauser 1/9.
- **Programmability: 3.5.** Mint/redeem and price derivation are onchain, but the rate is admin-set monthly and not tied to NAV. The redemption buffer is manually funded, and legacy issuance depends on offchain proofs.
- **External Dependencies: 3.5.** Single-issuer, single-broker concentration (Marex ~96%), plus Ankura, BNY/StoneX, First Citizens, Circle USDC, Chainalysis and LayerZero. Failure of Ondo operations or Marex would break redemptions.

**Centralization Score = (4.5 + 3.5 + 3.5) / 3 = 3.83**

**Score: 3.83/5**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 3.5.** Top-quality T-bill collateral held offchain with custodian attestation (score 3 baseline). Worsened by:
  - a thin 0.3–0.8% cushion;
  - ~93% of LLC assets in a structured-financing sleeve excluded from the covenant test under unpublished terms;
  - ~9% of value (OGM-issued USDY) with no verified reserve attestation.
- **Provability: 3.0.** Daily and monthly Ankura verification of LLC accounts. Price is computable onchain, but reserves are fully offchain. Ondo's headline ratio is not reproducible. Aggregate cross-chain supply reconciles to LLC plus OGM within 0.26%, but Stellar (23.6% of supply) and other non-EVM chains rely on Ondo-reported figures, and the per-issuer split is not visible onchain.

**Funds Management Score = (3.5 + 3.0) / 2 = 3.25**

**Score: 3.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- For a whitelisted Yearn strategy: direct, atomic, oracle-priced redemption, but throttled to $10M/day per user and $15M/day globally. It is backed by a ~$25M manually refilled buffer (base 2.5, +0.5 throttle).
- Non-whitelisted holders face ~$4M of secondary liquidity: ~0.74% slippage at 1M USDY, ~42% at 2M, and none on Ethereum.

**Score: 3.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Ondo is a well-known, established RWA issuer with good integrator documentation and a defined legal structure (Ondo USDY LLC TCSA; BVI SPV with independent director).
- Docked for the opaque December 2025 issuer transition ("deprecated" manager still minting; amended TCSA unpublished), anonymous Safe signers, and no public incident report for the January 2026 default flag.

**Score: 2.0/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 3.83 | 30% | 1.150 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 3.0 | 15% | 0.450 |
| Operational Risk | 2.0 | 5% | 0.100 |
| **Subtotal** | | | **2.975** |
| TVL modifier (>$500M for >1 year) | | | **−0.5** |
| **Final Score** | | | **2.47/5.0** |

**Optional Modifiers:**

- Protocol live >2 years with no incidents: **not applied.** No exploit occurred, but the January 2026 portfolio-default flag is a covenant incident.
- TVL maintained >$500M for >1 year: **applied (−0.5).** LLC principal has been >$500M every month since February 2025.

**Final Risk Tier: Low Risk** (2.47, just below the 2.50 Medium boundary)

**Yearn strategy note.** The score assumes the strategy is KYC-registered in `OndoIDRegistry`, since it cannot subscribe or redeem otherwise. Without registration the liquidity score would be ~4.0 and the final score ~2.62 (Medium). Recommended strategy guardrails:

- keep the position below the per-user $10M/day redemption limit multiplied by the intended exit window;
- read `BasicSource.availableToWithdraw(USDC)` and `getCurrentUserRedemptionLimit` before redeeming;
- value holdings at the `RWADynamicOracle` price, since market prices are thin;
- monitor the blocklist for the strategy address.

---

## Reassessment Triggers

- **Time-based:** reassess in 3 months (December 2026), or on publication of the amended TCSA or an OGM USDY reserve attestation.
- **TVL-based:** reassess if LLC token principal or Ethereum supply changes by more than 25%, or if OGM-issued USDY exceeds 20% of outstanding value.
- **Collateral-based:** reassess on any Ankura "Portfolio Default: YES", LLC ratio below 1.005, change in custodian mix (Marex share), or new "Opt-Out" categories.
- **Governance-based:** reassess on any change to token implementation, admin Safe threshold or owners, new `MINTER_ROLE`/`BURNER_ROLE` grants, adoption of a timelock (possible improvement), or an increase to the admin-subscription allowance.
- **Liquidity-based:** reassess if the redemption buffer stays below $10M, rate limits are lowered, or InstantManager redemptions are paused.
- **Incident-based:** reassess after any exploit, bridge incident, oracle override, or freeze affecting integrators.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| September 29, 2026 | 2.47 | Initial assessment |
