# Protocol Risk Assessment: Unit Bitcoin (UBTC)

- **Assessment Date:** May 19, 2026 (reassessment; previous: February 19, 2026)
- **Token:** UBTC
- **Chain:** HyperEVM (Hyperliquid L1 ecosystem)
- **Token Address:** [`0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463`](https://hyperevmscan.io/address/0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463)
- **HyperCore Token ID:** [`0x8f254b963e8468305d409b33aa137c67`](https://app.hyperliquid.xyz/explorer/token/0x8f254b963e8468305d409b33aa137c67)
- **Final Score: 5.0/5.0** (unchanged — critical gate "no audit" still triggered)
- **Status:** GATED — score capped by the "no audit" critical gate; ungated weighted score is 3.19 (Medium). No realized loss event.

## Overview + Links

Unit is the asset tokenization layer on Hyperliquid, enabling deposits and withdrawals for major crypto assets (BTC, ETH, SOL, etc.) between their native blockchains and Hyperliquid. Unit Bitcoin (UBTC) is the protocol's wrapped Bitcoin token — users deposit BTC on the Bitcoin network and receive UBTC on Hyperliquid (both HyperCore and HyperEVM).

The protocol uses a **Guardian Network** — a distributed leader-verifier network of 3 independent operators that collectively manage cross-chain transfers via a **2-of-3 MPC threshold signature scheme (TSS)**. Guardians independently monitor blockchain state, verify transactions, and co-sign operations. No single Guardian can unilaterally perform operations.

UBTC is a **1:1 BTC-backed token** with no yield component. It represents a custodial claim on Bitcoin held in Unit's treasury addresses on the Bitcoin network.

**Context:** UBTC is being evaluated as collateral on Morpho on HyperEVM, specifically the [UBTC-USDC market](https://app.morpho.org/hyperevm/market/0x45af9c72aa97978e143a646498c8922058b7c6f18b6f7b05d7316c8cf7ab942f/ubtc-usdc).

## Reassessment Notes (2026-05-19)

Re-check performed for [issue #164](https://github.com/yearn/risk-score/issues/164) (74-day reassessment trigger). Summary of changes since the February 19, 2026 assessment:

- **Score unchanged at 5.0/5.0** — the "no audit" critical gate is still triggered (re-verified via DeFiLlama API, Unit docs, HyperEVMScan, and Immunefi).
- **No contract changes:** UBTC proxy ownership and implementation both unchanged since deployment (verified via Etherscan V2 logs API on chainId=999 — only one `OwnershipTransferred` and one `Upgraded` event ever emitted, both at deployment block 1,513,232).
- **Implementation still not source-verified** on HyperEVMScan (Etherscan V2 API returns empty `ContractName`/`SourceCode`).
- **TVL down ~7%** (~$447M → ~$414M). Backing is intact and slightly over-collateralized (3,361.95 BTC vs 3,272.76 UBTC circulating).
- **Peg materially tightened** (30-day range ±0.2% vs prior ±1.7%).
- **Morpho UBTC exposure has shrunk** (collateral $7.6M → $4.14M; UBTC-USDC market $2.72M → $836K supply).
- **Supported bridge chains expanded** (Avalanche, Base, ZEC, SPL now in withdrawal-queue API).

**Outstanding TODOs (unchanged from prior assessment):**
- No public Guardian health endpoint identified for monitoring.
- No public reserve dashboard (cross-chain BTC vs UBTC reconciliation still manual).

**Links:**

- [Unit app](https://hyperunit.xyz/)
- [Unit docs](https://docs.hyperunit.xyz/)
- [Unit explorer](https://explorer.hyperunit.xyz)
- [Supported assets](https://docs.hyperunit.xyz/unit/about-unit/supported-assets)
- [Architecture docs](https://docs.hyperunit.xyz/architecture/components)
- [Security docs](https://docs.hyperunit.xyz/architecture/security)
- [Key addresses](https://docs.hyperunit.xyz/developers/key-addresses/mainnet)
- [Token metadata](https://docs.hyperunit.xyz/developers/key-addresses/mainnet/token-metadata)
- [DeFiLlama Unit](https://defillama.com/protocol/unit)
- [CoinGecko UBTC](https://www.coingecko.com/en/coins/unit-bitcoin)
- [Regulatory compliance](https://docs.hyperunit.xyz/legal/regulatory-compliance)

## Contract Addresses

### HyperEVM Contracts

| Contract | Address | Type |
|----------|---------|------|
| UBTC Token | [`0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463`](https://hyperevmscan.io/address/0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463) | UUPS Proxy (ERC-20) |
| UBTC Implementation | [`0x1a7689c3b783eb37550efbb9c81e7f468f7034fc`](https://hyperevmscan.io/address/0x1a7689c3b783eb37550efbb9c81e7f468f7034fc) | Implementation |
| HyperEVM Deployer (Owner) | [`0xB4FC973924a91362D301E583E839Cdaf4f19cdF8`](https://hyperevmscan.io/address/0xB4FC973924a91362D301E583E839Cdaf4f19cdF8) | EOA (MPC-controlled per docs) |

### Treasury Addresses

| Native Chain | Treasury Address | HyperCore Treasury |
|-------------|-----------------|-------------------|
| Bitcoin | `bc1pdwu79dady576y3fupmm82m3g7p2p9f6hgyeqy0tdg7ztxg7xrayqlkl8j9` | [`0x574bAFCe69d9411f662a433896e74e4F153096FA`](https://hyperevmscan.io/address/0x574bAFCe69d9411f662a433896e74e4F153096FA) |

### HyperCore Token Deployer

The HyperCore deployer is a multi-sig user at address [`0xF036a5261406a394bd63Eb4dF49C464634a66155`](https://hyperevmscan.io/address/0xF036a5261406a394bd63Eb4dF49C464634a66155) (per docs, deployed via HIP-1 native token standard).

## How Unit Protocol Works (Context)

Unit is a **bridge/asset tokenization protocol** — not a lending, staking, or yield protocol.

**Deposit flow:**
1. User connects Hyperliquid wallet and selects BTC
2. Unit's Guardian Network generates a unique Bitcoin deposit address (MPC-derived, permanently tied to user's Hyperliquid address)
3. User sends BTC to this address
4. After 2 block confirmations on Bitcoin, Guardians verify and co-sign a transaction to credit UBTC on Hyperliquid

**Withdrawal flow:**
1. User enters destination Bitcoin address and amount
2. Unit generates a unique withdrawal address on Hyperliquid
3. User signs the transaction
4. Upon Hyperliquid finalization (~10 seconds), Guardians process the Bitcoin transfer
5. Withdrawals are batched — BTC withdrawals process every ~3 Bitcoin blocks, ETH every ~21 slots

**Fees:** Unit does not collect revenue from deposits or withdrawals. The only fees are native network transaction fees.

**Required confirmations:**
| Chain | Confirmations | Time |
|-------|--------------|------|
| Bitcoin | 2+ | ≥20 minutes |
| Hyperliquid | 2,000 | ~3.5 minutes |
| Ethereum | 14 | ~3 minutes |

## Audits and Due Diligence Disclosures

**No smart contract audits are publicly disclosed or listed.** Status re-confirmed May 19, 2026.

- DeFiLlama protocol record still reports `audits: 0` and `audit_links: null` for Unit (verified via `/protocol/unit` API).
- No audit reports or links are found in the Unit documentation (`docs.hyperunit.xyz` — searched for audit / bug bounty / Immunefi / Sherlock / Cantina / OpenZeppelin / Trail of Bits / Halborn / ChainSecurity: no matches).
- No audit page exists on the Unit website or docs.
- The `architecture/security` docs page covers MPC, secure enclaves, and state machine design but makes no reference to third-party audits.
- HyperEVMScan still shows no security audit submitted for the UBTC token contract.
- Multiple independent third-party analyses ([ASXN](https://newsletter.asxn.xyz/p/unit-protocol), [Impossible Finance](https://blog.impossible.finance/hyperunit-cross-chain-asset-infrastructure-for-hyperliquid/), [blocmates](https://www.blocmates.com/articles/unit-the-asset-tokenization-layer-on-hyperliquid), [ChainCatcher](https://www.chaincatcher.com/en/article/2168910)) confirm no audits exist.

### Bug Bounty

- **No bug bounty program found** on Immunefi (both `/bounty/unit/` and `/bounty/hyperunit/` return 404), Sherlock, or Cantina.
- Unit Protocol is **not registered** on Safe Harbor (SEAL).

### Source Code

- **Proxy contract** ([`0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463`](https://hyperevmscan.io/address/0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463#code)) **is source-code verified** on HyperEVMScan — `ERC1967Proxy` (Solidity v0.8.24, MIT). Re-verified May 19, 2026 via Etherscan V2 multi-chain API (chainId=999): `ContractName=ERC1967Proxy`, `Proxy=1`, `Implementation=0x1a7689c3b783eb37550efbb9c81e7f468f7034fc`.
- **Implementation contract** ([`0x1a7689c3b783eb37550efbb9c81e7f468f7034fc`](https://hyperevmscan.io/address/0x1a7689c3b783eb37550efbb9c81e7f468f7034fc)) **is STILL NOT source-code verified** — the actual token logic remains opaque. Etherscan V2 API returns empty `ContractName` and `SourceCode` (verified May 19, 2026).
- Selector + string extraction from the bytecode confirms a **USDT-style sender blacklist** plus a **separate compliance-authority role** layered on top of OZ ERC20Upgradeable + OwnableUpgradeable + UUPSUpgradeable. See **Appendix: Implementation Surface (bytecode-derived)** for the full selector list and verification commands.
- No public GitHub repository found for Unit Protocol smart contracts (DeFiLlama lists no GitHub).
- Implementation bytecode is 11,660 bytes. Proxy bytecode is 163 bytes (minimal ERC-1967 proxy).

## Historical Track Record

- **DeFiLlama listing date:** February 14, 2025 (~15 months at reassessment date).
- **Current protocol TVL:** ~$414M (May 19, 2026) — Bitcoin $258M, Ethereum $85M, Solana $57M, Plasma $12M, Monad $3M (per DeFiLlama). Down ~7% since prior assessment ($447M).
- **Peak TVL:** ~$1.48B (October 8, 2025).
- **TVL trend:** ~28% of ATH; ~7% decline since prior assessment.

**CoinGecko market data (UBTC, May 19, 2026):**

| Metric | Value |
|--------|-------|
| Price | ~$76,859 |
| Market Cap | ~$251.5M |
| 24h Volume | ~$43.3M |
| Circulating Supply | ~3,273 UBTC |
| Total Supply (cap) | 21,000,000 UBTC |
| ATH | $126,087 (Oct 6, 2025) |
| ATL | $60,537 (Feb 6, 2026) |
| 30-day Price Change | +1.64% |

**Onchain supply (verified May 19, 2026):**
- `totalSupply()` on UBTC proxy returns `2,100,000,000,000,000` (8 decimals) → 21,000,000 UBTC (Bitcoin hard cap; unchanged).
- Circulating supply per CoinGecko: ~3,273 UBTC — most of the 21M cap is uncirculated.
- **Bitcoin treasury balance:** 3,361.95 BTC at `bc1pdwu79dady576y3fupmm82m3g7p2p9f6hgyeqy0tdg7ztxg7xrayqlkl8j9` (per [blockstream.info](https://blockstream.info/address/bc1pdwu79dady576y3fupmm82m3g7p2p9f6hgyeqy0tdg7ztxg7xrayqlkl8j9), 34,425 txs).
- Reserves (3,361.95 BTC) > circulating UBTC (3,272.76) — over-backed by ~89 BTC (~2.7%). 1:1 backing claim verified.

**Peg stability (30-day UBTC/BTC ratio per CoinGecko, through May 19, 2026):**
- Current: 1.0016 (0.16% above peg)
- 30-day min: 0.9980 (0.20% below peg)
- 30-day max: 1.0016 (0.16% above peg)
- 30-day avg: 0.9999
- Peg materially tighter than the prior assessment window (±0.2% vs prior ±1.7%).

**Incidents:**
- No Unit/UBTC exploits found in DeFiLlama hacks database (cross-checked May 19, 2026) or Rekt News.
- **Guardian offline incident (April 15, 2025):** A Guardian went offline, causing delays in Bitcoin withdrawals and deposit address generation. This exposed fault tolerance gaps in the 2-of-3 Guardian Network. Community feedback called for permissionless Guardian participation to improve decentralization ([source](https://blog.impossible.finance/hyperunit-cross-chain-asset-infrastructure-for-hyperliquid/)).
- No new incidents reported since prior assessment.

## Funds Management

### Accessibility

- **Deposits:** Permissionless — anyone can deposit BTC to receive UBTC.
- **Withdrawals:** Queue-based — withdrawal batches process every ~3 Bitcoin blocks for BTC, ~21 Ethereum slots for ETH.
- **Current withdrawal queue (May 19, 2026, from Unit API):** Bitcoin: 2, Ethereum: 1, Solana: 0, Plasma: 0, Monad: 0, Avalanche: 0, Base: 0, SPL: 0, ZEC: 0. Supported chain set has expanded since prior assessment (Avalanche, Base, ZEC added).
- **Fees:** No protocol fee; only native network gas fees.
- **Minimum deposit:** 0.0003 BTC.
- **Revert mechanism:** Failed deposits can be reverted after sufficient confirmations (20 blocks for BTC = ~3+ hours). Not all failed deposits are revertible.

### Collateralization

UBTC is a **1:1 BTC-backed bridged asset**. For every UBTC in circulation, the protocol claims to hold an equivalent amount of BTC in the Bitcoin treasury address.

- **Bitcoin treasury:** `bc1pdwu79dady576y3fupmm82m3g7p2p9f6hgyeqy0tdg7ztxg7xrayqlkl8j9`
- Reserves can be verified on any Bitcoin block explorer (e.g., mempool.space).
- No offchain collateral or lending activity is disclosed.
- Collateral is entirely **native BTC** — the highest quality collateral for a BTC wrapper.

### Provability

- **Bitcoin reserves** are verifiable onchain via the Bitcoin treasury address.
- **UBTC supply** on HyperCore/HyperEVM is verifiable via `totalSupply()`.
- **The backing ratio requires comparing two chains** (Bitcoin balance vs Hyperliquid UBTC supply), which complicates real-time verification but is deterministic.
- No Chainlink Proof of Reserve (PoR) or equivalent third-party attestation mechanism is in place.
- Unit operates an [explorer](https://explorer.hyperunit.xyz) for transaction tracking.
- The protocol does not have a public dashboard showing real-time reserve status.

## Liquidity Risk

### HyperCore Spot Orderbook (Primary Liquidity)

UBTC trades on Hyperliquid's native spot CLOB (Central Limit Order Book). Per CoinGecko (May 19, 2026):

| Venue | Pair | 24h Volume |
|-------|------|-----------|
| Hyperliquid | UBTC/USDC | ~$27.1M |
| Hyperliquid | UBTC/USDH | ~$2.6M |

This is the primary exit liquidity for UBTC — the spot orderbook provides market-based exit at BTC spot prices.

### HyperEVM DEX & Lending Liquidity

Per DeFiLlama yields API (May 19, 2026), 28 UBTC pools on HyperEVM with **~$43.7M total TVL**. Top pools by TVL:

| Protocol | Pool | TVL |
|----------|------|-----|
| Takara Lend | UBTC | $19,174,083 |
| Project X | WHYPE-UBTC | $7,382,817 |
| HyperLend (pooled) | UBTC | $5,497,047 |
| Felix CDP | feUBTC | $2,215,272 |
| Morpho Blue | UBTC (multiple) | $5,536,000 (sum across markets) |
| HyperSwap V3 | WHYPE-UBTC | $949,836 |
| Project X | UBTC-USDT0 | $728,165 |
| Nest V1 | WHYPE-UBTC | $626,046 |
| HypurrFi (pooled) | UBTC | $469,140 |

### Morpho Markets (UBTC as Collateral)

14 Morpho markets use UBTC as collateral. Verified via Morpho Blue API (May 19, 2026):

- **Total UBTC collateral supply:** ~$4.14M (down from ~$7.6M)
- **Total borrows against UBTC:** ~$2.67M (down from ~$6.4M)

**The specific market from the issue (UBTC-USDC):**

| Metric | Value |
|--------|-------|
| Market ID | [`0x45af9c72aa97978e143a646498c8922058b7c6f18b6f7b05d7316c8cf7ab942f`](https://app.morpho.org/hyperevm/market/0x45af9c72aa97978e143a646498c8922058b7c6f18b6f7b05d7316c8cf7ab942f/ubtc-usdc) |
| Loan Asset | USDC |
| LLTV | 77.0% |
| Supply | ~$836,542 (down from $2.72M) |
| Borrow | ~$697,892 (down from $2.45M) |
| Utilization | 83.4% (down from 90%) |

### Liquidity Assessment

- **Primary exit:** Hyperliquid spot CLOB with ~$30M daily UBTC volume — adequate for most position sizes.
- **Secondary exit:** Protocol withdrawal back to native BTC (queue-based, ~3 Bitcoin block batches). Current BTC withdrawal queue: 2 pending.
- **HyperEVM DEX + lending TVL:** ~$43.7M across 28 pools — improved breadth since prior assessment.
- **All liquidity is within the Hyperliquid ecosystem** — still no CEX listings.

## Centralization & Control Risks

### Governance

**UBTC HyperEVM token contract:**
- **Owner:** [`0xB4FC973924a91362D301E583E839Cdaf4f19cdF8`](https://hyperevmscan.io/address/0xB4FC973924a91362D301E583E839Cdaf4f19cdF8)
- **Onchain code-size: 0** — this is an **EOA** (Externally Owned Account). Re-verified May 19, 2026 (`cast code` returns `0x`).
- **Owner unchanged since deployment** — only one `OwnershipTransferred` event ever emitted (from `0x0` at block 1,513,232, ts 1742779080 / Mar 24, 2025); no subsequent transfers.
- **Per Unit docs:** The HyperEVM deployer is "controlled via multi-party computation (MPC), requiring key-shares from multiple signers to construct and perform transactions." However, this is **not verifiable onchain** — it appears as a regular EOA.
- **Contract type:** UUPS upgradeable proxy — the owner can upgrade the implementation without timelock.
- **Implementation unchanged:** only one `Upgraded` event ever emitted (at deployment). Current implementation slot still points to [`0x1a7689c3b783eb37550efbb9c81e7f468f7034fc`](https://hyperevmscan.io/address/0x1a7689c3b783eb37550efbb9c81e7f468f7034fc) (verified May 19, 2026 via `cast implementation`).
- **No timelock** detected onchain.
- **No multisig** onchain — the MPC claim is offchain only.

**Guardian Network (bridge operations):**
- 2-of-3 MPC threshold signature scheme.
- 3 Guardians: **Unit**, **Hyperliquid**, and **Infinite Field**.
  - **Infinite Field** self-identifies as "a proprietary HFT market making firm" running on Hyperliquid since February 2024 ([source](https://x.com/infinitefieldx/status/1890437991224520799)).
- Each Guardian runs independent blockchain indexers, verifiers, and secure enclaves (e.g., AWS Nitro).
- Guardian keys are generated via distributed key generation (DKG), encrypted at rest via KMS, combined only at runtime in secure enclaves.
- The relay server only forwards ciphertext — no key material.
- **Leader centralization:** Currently a single pre-determined leader coordinates proposals. The protocol plans to implement a leader election process in the future, but this creates interim centralization risk.

**Key concern:** While the bridge operations use 2-of-3 MPC, the HyperEVM token contract ownership is an EOA. A compromise of the MPC key (or the offchain signers controlling it) could allow an attacker to upgrade the UBTC implementation to a malicious contract.

### Programmability

- The UBTC token contract is an **OZ ERC20Upgradeable + OwnableUpgradeable + UUPSUpgradeable**, with two non-OZ additions confirmed from selectors and bytecode strings:
  1. **USDT-style sender blacklist** — functions `addToBlacklist(address)`, `removeFromBlacklist(address)`, `isBlacklisted(address)` are present, and the bytecode contains the revert string `"UBTC: sender blacklisted"`. The blacklist is enforced inside the transfer path → a blacklisted holder cannot move their UBTC. This implies **freeze risk for any HyperEVM holder, including Morpho borrowers** (a frozen position cannot be liquidated normally).
  2. **Compliance-authority role** separate from `owner()` — `complianceAuthority()` returns the address authorized to manage the blacklist; revert strings include `"UBTC: caller is not compliance authority"` and `"UBTC: new compliance authority cannot be zero"`. Currently the compliance authority equals the owner EOA `0xB4FC973924a91362D301E583E839Cdaf4f19cdF8`. There is a setter (selector `0x6b9be885`, signature unrecovered, almost certainly `updateComplianceAuthority(address)`).
- **No `mint(address,uint256)` (`0x40c10f19`) or `burn` selector** is present on the EVM implementation. Supply changes happen on the **HyperCore** side under HIP-1 native token semantics; `totalSupply()` is the fixed 21M Bitcoin cap and tokens move into HyperEVM via the HyperCore↔HyperEVM bridge. The constant `coreDeployer` (selector `0xb768259d`) is hardcoded to `0xF036a5261406a394bd63Eb4dF49C464634a66155`.
- No `paused()`, `cap()`, `MINTER_ROLE()`, `DEFAULT_ADMIN_ROLE()`, or `DOMAIN_SEPARATOR()` functions exposed.
- The bridge operations (deposit/withdrawal) are handled entirely offchain by the Guardian Network — the onchain HyperEVM contract is the ERC-20 reflection plus the freeze/compliance surface above.
- The deterministic state machine underlying all protocol actions guarantees strict, verifiable workflows per the security docs.

### External Dependencies

Critical dependencies:
1. **Bitcoin network** — for BTC custody and transfer verification.
2. **Hyperliquid L1** — HyperCore consensus/liveness and HyperEVM execution.
3. **Guardian Network infrastructure** — AWS Nitro enclaves, relay servers, indexers.
4. **KMS services** — for Guardian key encryption at rest.

**Hyperliquid chain risk:**
- Hyperliquid is a highly centralized chain — Hyper Foundation controls 56.4% of validator stake via 5 validators, exceeding the 1/3 BFT blocking minority (per kHYPE assessment).
- HyperEVM shares the same HyperBFT consensus as HyperCore — no separate bridge risk between the two, but full L1 dependency.

## Operational Risk

- **Team:** Unit describes itself as "a research and development collective dedicated to advancing the Hyperliquid ecosystem." Core team members claim expertise from **HRT** (Hudson River Trading), **Jump** (Jump Crypto), **Fortress**, and **IDF cyber units** (per docs). The team is reportedly self-funded.
- **Team transparency:** No individual team members are named or publicly doxxed. No "Team" page with identifiable individuals. Multiple third-party analyses ([ChainCatcher](https://www.chaincatcher.com/en/article/2168910), [Impossible Finance](https://blog.impossible.finance/hyperunit-cross-chain-asset-infrastructure-for-hyperliquid/)) note "founders and investors are unknown" and flag this as a transparency concern.
- **Entity:** "Unit Labs" — referenced in regulatory compliance docs.
- **Legal:** Unit Labs utilizes blockchain analytics to screen wallets (OFAC SDN List compliance). Frontend implements IP-based geofencing for prohibited jurisdictions. Legal inquiries to `legal@hyperunit.xyz`.
- **Twitter:** [@hyperunit](https://x.com/hyperunit) (primary, per CoinGecko) / [@unitxyz](https://twitter.com/unitxyz) (per DeFiLlama).
- **Token:** The team secured the $UNIT ticker for ~$350K in January 2025, strongly suggesting plans for a future token launch. No official airdrop confirmed.
- **Documentation:** Adequate — hosted on GitBook, covers architecture, security, API, key addresses. Some pages are JS-rendered only.
- **Compliance:** Guardians independently implement compliance screening. Unit Labs uses blockchain analytics software. Maintains transaction records for law enforcement disclosure.
- **Incident handling:** Guardian offline incident (April 15, 2025) was resolved, but no formal public incident response plan is documented.

## Monitoring

Key addresses and data to monitor:

### 1. Bitcoin Treasury Monitoring (MANDATORY)

- **Bitcoin treasury:** `bc1pdwu79dady576y3fupmm82m3g7p2p9f6hgyeqy0tdg7ztxg7xrayqlkl8j9`
- Compare BTC held vs UBTC circulating supply on Hyperliquid
- Alert: If BTC balance falls below circulating UBTC supply

### 2. Token Supply Monitoring (MANDATORY)

- `UBTC.totalSupply()` on HyperEVM: [`0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463`](https://hyperevmscan.io/address/0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463)
- HyperCore token supply via Hyperliquid explorer
- Alert: Sudden supply changes >10% in 24h

### 3. Contract Upgrade Monitoring (MANDATORY)

- Monitor `Upgraded` events on UBTC proxy contract
- Monitor ownership transfers on UBTC contract (`OwnershipTransferred` event)
- Alert: Any implementation upgrade or ownership change (immediate)

### 4. Peg Monitoring

- UBTC/BTC price ratio (CoinGecko, Hyperliquid spot)
- Alert: Discount >3% sustained for >1h

### 5. Withdrawal Queue Monitoring

- Unit API endpoint: `GET https://api.hyperunit.xyz/withdrawal-queue`
- Alert: Bitcoin withdrawal queue >10 pending operations

### 6. Guardian Network Health

- Monitor for any Guardian downtime or signing failures
- TODO: No public endpoint for Guardian health status identified

## Risk Summary

### Key Strengths

1. **Simple architecture** — UBTC is a straightforward 1:1 BTC wrapper with minimal onchain complexity.
2. **Sustained protocol TVL** (~$414M) and meaningful trading volume (~$43M/day) — modest decline from prior assessment but still strong product-market fit.
3. **Bitcoin reserves are verifiable** onchain via the Bitcoin treasury address (3,361.95 BTC vs 3,273 UBTC circulating — over-backed).
4. **Peg has tightened materially** since prior assessment (30-day deviation ±0.2% vs prior ±1.7%).
5. **No implementation upgrades or ownership transfers** since deployment (Mar 24, 2025).
6. **No protocol fees** — reduces attack surface and misalignment incentives.
7. **Regulatory compliance measures** — OFAC screening, geofencing, law enforcement cooperation.

### Key Risks

1. **No public smart contract audits** — no audit reports found anywhere, confirmed by multiple independent sources. This is a critical concern for a bridge holding ~$447M.
2. **No bug bounty program** — no Immunefi, Sherlock, or Cantina listing found.
3. **Implementation source code unverified** — the proxy is verified (standard OpenZeppelin ERC1967Proxy), but the actual token implementation at [`0x1a7689c3b783eb37550efbb9c81e7f468f7034fc`](https://hyperevmscan.io/address/0x1a7689c3b783eb37550efbb9c81e7f468f7034fc) is **not verified**. Bytecode analysis suggests undisclosed allowlist/blacklist features.
4. **EOA ownership on HyperEVM** — the MPC claim is not verifiable onchain. The contract owner (`Unit: Deployer`) appears as a single EOA that can upgrade the implementation instantly.
5. **No timelock** on contract upgrades — implementation can be swapped instantly.
7. **2-of-3 MPC** is a relatively low threshold — compromise of any 2 Guardians (one of which is Unit itself) could compromise the system.
8. **Hyperliquid chain centralization** — Hyper Foundation controls 56.4% of validator stake.

### Critical Risks

- **No audit combined with unverified implementation source code and EOA upgradeability** — the UBTC implementation could contain vulnerabilities or be upgraded to a malicious contract. Bytecode hints at undisclosed allowlist/blacklist mechanisms.
- **2-of-3 MPC with only 3 Guardians** — a coordinated compromise of Unit + one other Guardian (Hyperliquid or Infinite Field) gives full control over bridge funds.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** -> **TRIGGERED** — Protocol has no publicly disclosed audits by any firm.
- [x] **Unverifiable reserves** -> **PASS** — Bitcoin reserves are verifiable onchain.
- [ ] **Total centralization** -> **BORDERLINE** — EOA owner on HyperEVM (claimed MPC), 2-of-3 Guardian Network. Not a single EOA in the traditional sense, but onchain evidence shows EOA ownership.

**Critical gate "No audit" is triggered.** Per the scoring guidelines, this automatically results in a score of **5** (High Risk).

However, given that:
1. The protocol has been operational for ~15 months with ~$414M TVL
2. The onchain token contract interface is relatively simple (standard ERC-20 + UUPS)
3. The 2-of-3 MPC Guardian architecture provides some multi-party security
4. Bitcoin reserves are transparently verifiable (and currently over-backed)

We assess whether the automatic 5 should be applied strictly or with contextual modifiers. **Given the framework's explicit instruction ("If ANY gate is triggered, the protocol automatically receives a score of 5"), we apply the automatic score.**

### Category Scores (For Reference)

Even though the critical gate is triggered, we provide category scores for reference if audits are conducted in the future.

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **No audits** from any firm (re-confirmed May 19, 2026 via DeFiLlama API, Unit docs search, and HyperEVMScan).
- No bug bounty program (Immunefi pages 404).
- Implementation source code still unverified (proxy verified as standard OpenZeppelin ERC1967Proxy).
- ~15 months in production, TVL ~$414M (peaked ~$1.48B).
- One operational incident: Guardian offline (April 15, 2025) causing BTC withdrawal delays. No new incidents since.

**Score: 5.0/5** — No audit (critical gate triggered).

#### Category 2: Centralization & Control Risks (Weight: 30%)

Subscores:
- **Governance: 4.5** — EOA owner (onchain) claimed to be MPC-controlled (offchain). No timelock. UUPS upgradeable. 2-of-3 Guardian Network for bridge operations, but not for contract governance.
- **Programmability: 2.0** — Simple ERC-20 token; bridge operations handled by deterministic state machine. No complex vault logic or admin parameters.
- **External dependencies: 3.5** — Depends on Bitcoin network, Hyperliquid L1 (centralized validator set), Guardian infrastructure (AWS Nitro, KMS). Hyperliquid Foundation controls 56.4% of validator stake.

Centralization score = (4.5 + 2.0 + 3.5) / 3 = **3.33**

**Score: 3.3/5**

#### Category 3: Funds Management (Weight: 30%)

Subscores:
- **Collateralization: 2.0** — 1:1 BTC-backed onchain. Collateral is native BTC (highest quality). No offchain or mixed collateral.
- **Provability: 2.5** — Bitcoin reserves verifiable onchain. UBTC supply verifiable on Hyperliquid. Requires cross-chain comparison. No Proof of Reserve oracle or third-party attestation. No public reserve dashboard.

Funds management score = (2.0 + 2.5) / 2 = **2.25**

**Score: 2.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Primary exit via Hyperliquid CLOB: ~$30M daily UBTC/USDC + USDH volume — adequate.
- Secondary exit via native BTC withdrawal: queue-based, currently 2 pending BTC withdrawals.
- HyperEVM DEX + lending TVL: ~$43.7M across 28 pools.
- All within Hyperliquid ecosystem — no CEX listings.
- Peg deviations only ±0.2% in last 30 days (tighter than prior window).

**Score: 2.5/5** (unchanged — broader pool count offset by lower Morpho deposits)

#### Category 5: Operational Risk (Weight: 5%)

- Team from reputable backgrounds (HRT, Jump, Fortress) but not individually doxxed.
- Documentation adequate but some pages JS-rendered only.
- Regulatory compliance measures in place (OFAC, geofencing).
- No public incident response plan.

**Score: 3.0/5**

### Final Score Calculation

**Due to the critical gate trigger (no audit), the final score is automatically set to 5.0/5.**

For reference, the weighted score without the critical gate would be:

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 5.0 | 20% | 1.00 |
| Centralization & Control | 3.3 | 30% | 0.99 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Weighted Score** | | | **3.19 / 5.0** |

**But critical gate applies → Final Score: 5.0 / 5.0**

## Overall Risk Score: **5.0 / 5.0**

### Risk Tier: **HIGH RISK**

Rationale:
- **The critical gate "No audit" is still triggered.** Unit Protocol has no publicly disclosed audits despite managing ~$414M in TVL (re-confirmed May 19, 2026).
- Implementation source code remains unverified on HyperEVMScan.
- No bug bounty program exists.
- HyperEVM contract owner is still an EOA (MPC claim not verifiable onchain) with UUPS upgradeability and no timelock; no ownership transfer or implementation upgrade since deployment.
- Without the critical gate, the weighted score would be 3.19/5.0 (Medium Risk), primarily elevated by the audit gap and centralization concerns.
- If audits are conducted and code is verified, the score could improve significantly to the Low-Medium range.

## Reassessment Triggers

- **Time-based**: Reassess in 3 months or upon completion of an audit
- **TVL-based**: Reassess if TVL changes by more than 50%
1. Publication of any smart contract audit for Unit Protocol / UBTC
2. Source code verification on block explorers
3. Launch of a bug bounty program
4. Contract implementation upgrade on HyperEVM
5. Ownership transfer of the UBTC contract
6. Change in Guardian Network composition (addition/removal of Guardians)
7. Introduction of timelock governance (positive trigger — would improve score)

## Appendix: What Would Improve the Score

If the following were addressed, the score could improve from 5.0 to approximately **2.5-3.0** (Low-Medium Risk):

1. **Audit by 1-2 reputable firms** → Would remove critical gate trigger
2. **Implementation source code verification** on HyperEVMScan → Would improve transparency (proxy is already verified)
3. **Bug bounty program** → Would reduce audit category score
4. **Onchain multisig** for contract ownership (replacing EOA) → Would improve governance score
5. **Timelock** on contract upgrades → Would improve governance score

## Appendix: Implementation Surface (bytecode-derived)

Source not verified — the function set below was reconstructed from the deployed bytecode on May 19, 2026 and is the baseline to **diff against on the next reassessment**. Any new selector, removed selector, or changed bytecode size means a hidden upgrade or unrecorded behavior change.

**Implementation:** [`0x1a7689c3b783eb37550efbb9c81e7f468f7034fc`](https://hyperevmscan.io/address/0x1a7689c3b783eb37550efbb9c81e7f468f7034fc) — bytecode size **11,660 bytes**.

**Standard OZ surface (callable through the proxy):**

| Selector | Signature | Source |
|---|---|---|
| `0x06fdde03` | `name()` | OZ ERC20 |
| `0x95d89b41` | `symbol()` | OZ ERC20 |
| `0x313ce567` | `decimals()` | OZ ERC20 |
| `0x18160ddd` | `totalSupply()` | OZ ERC20 |
| `0x70a08231` | `balanceOf(address)` | OZ ERC20 |
| `0xa9059cbb` | `transfer(address,uint256)` | OZ ERC20 |
| `0x23b872dd` | `transferFrom(address,address,uint256)` | OZ ERC20 |
| `0x095ea7b3` | `approve(address,uint256)` | OZ ERC20 |
| `0xdd62ed3e` | `allowance(address,address)` | OZ ERC20 |
| `0x8da5cb5b` | `owner()` | OZ Ownable |
| `0xf2fde38b` | `transferOwnership(address)` | OZ Ownable |
| `0x715018a6` | `renounceOwnership()` | OZ Ownable |
| `0x4f1ef286` | `upgradeToAndCall(address,bytes)` | OZ UUPS v5 |
| `0x52d1902d` | `proxiableUUID()` | OZ UUPS |
| `0xad3cb1cc` | `UPGRADE_INTERFACE_VERSION()` | OZ UUPS v5 |
| `0x8129fc1c` | `initialize()` | OZ Initializable |

**Custom (non-OZ) surface — the part that warrants audit:**

| Selector | Signature | Notes |
|---|---|---|
| `0x44337ea1` | `addToBlacklist(address)` | resolved via 4byte directory |
| `0x537df3b6` | `removeFromBlacklist(address)` | resolved via 4byte directory |
| `0xfe575a87` | `isBlacklisted(address)` | resolved via 4byte directory; `isBlacklisted(0x0)=false`, `isBlacklisted(owner)=false` as of 2026-05-19 |
| `0x309f477a` | `complianceAuthority()` | resolved via OpenChain DB; returns `0xB4FC973924a91362D301E583E839Cdaf4f19cdF8` (= current `owner()`) |
| `0x6b9be885` | unknown setter `(address)`, nonpayable | not in 4byte/OpenChain; reverts when called from a non-authority; inferred as `updateComplianceAuthority(address)` |
| `0xb768259d` | unknown pure getter | not in 4byte/OpenChain; returns the constant `0xF036a5261406a394bd63Eb4dF49C464634a66155` (the HyperCore deployer multi-sig); inferred as `coreDeployer()` |

**Notably absent selectors:** no `mint(address,uint256)` (`0x40c10f19`), no `burn(uint256)`/`burnFrom(address,uint256)`, no `pause()`/`unpause()`. Supply changes occur on the HyperCore side; the HyperEVM contract has no mint/burn entrypoint of its own.

**Bytecode strings observed** (printable ASCII runs ≥ 6 chars, after stripping push-data noise):

- `"Unit Bitcoin"`
- `"UBTC: sender blacklisted"` — proves the blacklist is enforced inside the transfer path (sender side, not just metadata).
- `"UBTC: caller is not compliance authority"` — proves a distinct compliance-authority role exists at the modifier level.
- `"UBTC: new compliance authority cannot be zero"` — proves the authority is transferable via a setter with a zero-address check.

**Risk implications of the custom surface:**

1. The owner / compliance authority can freeze any HyperEVM UBTC holder's balance. Downstream protocols (Morpho UBTC-USDC etc.) inherit this risk: a frozen borrower's position cannot be liquidated through normal `transfer`.
2. The `complianceAuthority` role is currently the same EOA as `owner` (`0xB4FC97…cdF8`), which is claimed-MPC but onchain just an EOA. Compromise of that key gives both upgrade rights AND freeze rights.
3. We cannot confirm from bytecode whether the blacklist's transfer-block exempts approved bridge addresses, whether there is a `destroyBlackFunds`-style siphon, or what happens to allowances when an address is blacklisted. **These require source verification or audit to answer.**

**Reproduction commands** (rerun on next reassessment and diff):

```bash
# bytecode + size
cast code 0x1a7689c3b783eb37550efbb9c81e7f468f7034fc \
  --rpc-url https://rpc.hyperliquid.xyz/evm | wc -c   # expect 23323 (= 11,660 bytes + "0x" + newline)

# selectors
cast code 0x1a7689c3b783eb37550efbb9c81e7f468f7034fc \
  --rpc-url https://rpc.hyperliquid.xyz/evm | xargs cast selectors

# privileged role state
cast call 0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463 "owner()(address)" \
  --rpc-url https://rpc.hyperliquid.xyz/evm
cast call 0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463 "complianceAuthority()(address)" \
  --rpc-url https://rpc.hyperliquid.xyz/evm
cast call 0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463 0xb768259d \
  --rpc-url https://rpc.hyperliquid.xyz/evm   # coreDeployer constant

# verify source-verification status (chainId 999 = HyperEVM)
curl -s "https://api.etherscan.io/v2/api?chainid=999&module=contract&action=getsourcecode&address=0x1a7689c3b783eb37550efbb9c81e7f468f7034fc&apikey=$ETHERSCAN_API_KEY"
```

**Checklist for the next reassessment:**

- [ ] Bytecode size still 11,660 bytes? If not → hidden upgrade.
- [ ] Same 22 selectors? Any addition (especially `mint`, `pause`, `seize`, `destroyBlackFunds`) → investigate.
- [ ] Implementation source code verified on HyperEVMScan? If yes → drop the bytecode-derived appendix and replace with a real source review (blacklist semantics, role transfer, transfer hook).
- [ ] `complianceAuthority` still equals `owner`? Any divergence is worth recording.
- [ ] Any address showing `isBlacklisted(addr)=true`? Track and report.
- [ ] Any new `Upgraded` event on the proxy? Already a monitoring trigger; re-check.

## Sources

- Unit docs: https://docs.hyperunit.xyz/
- Unit app: https://hyperunit.xyz/
- Unit explorer: https://explorer.hyperunit.xyz
- Unit architecture: https://docs.hyperunit.xyz/architecture/components
- Unit security: https://docs.hyperunit.xyz/architecture/security
- Unit key addresses: https://docs.hyperunit.xyz/developers/key-addresses/mainnet
- Unit token metadata: https://docs.hyperunit.xyz/developers/key-addresses/mainnet/token-metadata
- Unit team: https://docs.hyperunit.xyz/unit/about-unit/team
- Unit regulatory compliance: https://docs.hyperunit.xyz/legal/regulatory-compliance
- Unit withdrawal queue API: https://api.hyperunit.xyz/withdrawal-queue
- DeFiLlama Unit: https://defillama.com/protocol/unit
- CoinGecko UBTC: https://www.coingecko.com/en/coins/unit-bitcoin
- Morpho UBTC markets: https://app.morpho.org/hyperevm/market/0x45af9c72aa97978e143a646498c8922058b7c6f18b6f7b05d7316c8cf7ab942f
- HyperEVMScan UBTC proxy (verified): https://hyperevmscan.io/address/0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463#code
- HyperEVMScan UBTC implementation (unverified): https://hyperevmscan.io/address/0x1a7689c3b783eb37550efbb9c81e7f468f7034fc
- Onchain verification via `cast` against HyperEVM RPC (`rpc.hyperliquid.xyz/evm`)
- Morpho Blue API: https://blue-api.morpho.org/graphql
- DeFiLlama Yields API: https://yields.llama.fi/pools
- DeFiLlama Hacks: https://api.llama.fi/hacks
- Infinite Field Guardian announcement: https://x.com/infinitefieldx/status/1890437991224520799
- ASXN Unit Protocol analysis: https://newsletter.asxn.xyz/p/unit-protocol
- Impossible Finance HyperUnit analysis: https://blog.impossible.finance/hyperunit-cross-chain-asset-infrastructure-for-hyperliquid/
- blocmates Unit overview: https://www.blocmates.com/articles/unit-the-asset-tokenization-layer-on-hyperliquid
- ChainCatcher Unit analysis: https://www.chaincatcher.com/en/article/2168910
- Delphi Digital HyperUnit analysis: https://members.delphidigital.io/feed/hyperunit-the-infrastructure-powering-native-spot-on-hyperliquid
