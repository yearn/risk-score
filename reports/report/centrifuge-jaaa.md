# Protocol Risk Assessment: Centrifuge JAAA

- **Assessment Date:** May 28, 2026
- **Token:** JAAA (Janus Henderson Anemoy AAA CLO Fund Token)
- **Chain:** Ethereum
- **Token Address:** [`0x5a0F93D040De44e78F251b03c43be9CF317Dcf64`](https://etherscan.io/address/0x5a0F93D040De44e78F251b03c43be9CF317Dcf64)
- **Final Score: 3.03/5.0**

## Overview + Links

JAAA is the tokenized form of the **Janus Henderson Anemoy AAA CLO Fund** — a regulated BVI Professional Fund that holds a portfolio of **AAA-rated, floating-rate Collateralized Loan Obligation (CLO) tranches**. The strategy is managed by **Anemoy Capital SPC Limited** (manager / issuer of record) and sub-advised by **Janus Henderson** ([Anemoy fund page](https://www.anemoy.io/funds/jaaa)), drawing on the same portfolio team that runs Janus Henderson's ~$21B AAA CLO ETF.

The fund is brought onchain via **Centrifuge V3** (the protocol's Hub-and-Spoke EVM stack). The deployment under assessment is the **transfer-restricted** share class JAAA, deployed on Ethereum (poolId `281474976710663`). Investor flow is asynchronous (ERC-7540 style): an investor submits a deposit request through the `AsyncVault`, Anemoy/Centrifuge processes subscriptions daily, and the investor claims share tokens. Redemption mirrors this in reverse, settled in USDC. JAAA is the **accumulating** version (NAV grows over time; no distributions). Current onchain values:

- **Onchain NAV:** ~1.036124 USDC per JAAA (verified via `AsyncRequestManager.convertToAssets()` at block ~25.20M, price last updated 2026-05-27 12:00 UTC)
- **Ethereum supply:** ~167.98M JAAA (verified onchain) — Ethereum-side NAV ≈ $174.05M
- **Total cross-chain JAAA NAV:** ~$437.9M ([rwa.xyz](https://app.rwa.xyz/assets/JAAA), 2026-05-28)
- **Centrifuge protocol TVL (DefiLlama):** ~$1.38B current; peak ~$1.99B on 2026-04-24 ([DefiLlama](https://defillama.com/protocol/centrifuge))
- **Management fee:** 40 bps (0.40%) p.a. per [JAAA factsheet (April 2025)](https://gateway.pinata.cloud/ipfs/QmcWwvqnoUkH1bMYktnMdEywmUkUeK3PPex2i763zVNUmm). All-in **expense ratio: 0.50%** per on-chain pool metadata (mgmt fee + brokerage / custody / admin / audit). **Performance fee:** 0%.
- **Settlement:** Daily subscriptions and redemptions, **usually T+3** per factsheet
- **Holders (Ethereum + multichain):** 23 onchain holders per rwa.xyz — institutional only
- **Holdings (offchain CLO portfolio):** 21 positions totalling ~$762.7M market value (99.99% allocated). Top three: **ARES LOAN FUNDING II LTD (8.68%)**, **MADISON PARK FUNDING XXX LTD (8.08%)**, **AMMC CLO 27 LTD (7.87%)** — full holdings list available in [JAAA pool metadata IPFS](https://ipfs.io/ipfs/QmPzzjsF9xZcXZJhzJR6EHmQpaMmRnrtRnvBSWBRzyBEh1).
- **Target APY:** 5.7% (factsheet) | **7-day APY (rwa.xyz):** 5.54%
- **Third-party rating:** **Particula AAA** ([per on-chain pool metadata](https://ipfs.io/ipfs/QmPzzjsF9xZcXZJhzJR6EHmQpaMmRnrtRnvBSWBRzyBEh1))
- **Minimum initial investment:** $500,000 USDC (per on-chain pool metadata)

A separate, **freely-transferable** wrapper of the same fund — **deJAAA** ([`0xAAA0008C8CF3A7Dca931adaF04336A5D808C82Cc`](https://etherscan.io/address/0xAAA0008C8CF3A7Dca931adaF04336A5D808C82Cc), poolId `281474976710659`) — exists for permissionless DeFi integrations. deJAAA has total supply ~6.61M tokens (18 decimals). This report focuses on the KYC-gated JAAA primary share class but documents deJAAA where relevant.

**Links:**

- [Centrifuge V3 Documentation](https://docs.centrifuge.io/developer/protocol/overview/)
- [Centrifuge App – JAAA pool](https://app.centrifuge.io/pool/281474976710663/ethereum/0x4880799ee5200fc58da299e965df644fbf46780b)
- [Centrifuge App – deJAAA pool](https://app.centrifuge.io/pool/281474976710659/ethereum/0x4865bc9701fbd1207a7b50e2af442c7daf154c9c)
- [Centrifuge GitHub – protocol](https://github.com/centrifuge/protocol)
- [Audits folder (GitHub)](https://github.com/centrifuge/protocol/tree/main/docs/audits)
- [Anemoy fund page – JAAA](https://www.anemoy.io/funds/jaaa)
- [rwa.xyz – JAAA](https://app.rwa.xyz/assets/JAAA)
- [Centrifuge blog – JAAA launch (Grove $1B)](https://centrifuge.io/blog/centrifuge-janus-henderson-grove-tokenized-aaa-clo-fund)
- [Janus Henderson press release – Anemoy partnership](https://www.janushenderson.com/corporate/press-releases/janus-henderson-to-partner-with-anemoy-and-centrifuge-on-its-first-tokenized-fund/)
- [DefiLlama – Centrifuge](https://defillama.com/protocol/centrifuge)
- [JAAA factsheet (April 2025, IPFS-linked from on-chain pool metadata)](https://gateway.pinata.cloud/ipfs/QmcWwvqnoUkH1bMYktnMdEywmUkUeK3PPex2i763zVNUmm)
- [JAAA pool metadata (IPFS, referenced by HubRegistry)](https://ipfs.io/ipfs/QmPzzjsF9xZcXZJhzJR6EHmQpaMmRnrtRnvBSWBRzyBEh1)
- LlamaRisk report on JAAA: none — no Centrifuge / JAAA / JTRSY / Anemoy report was found in [LlamaRisk's research catalog](https://www.llamarisk.com/research) as of this assessment.

## Contract Addresses

### JAAA Pool (poolId 281474976710663) — Transfer-restricted

| Contract | Address | Type |
|----------|---------|------|
| JAAA Share Token | [`0x5a0F93D040De44e78F251b03c43be9CF317Dcf64`](https://etherscan.io/address/0x5a0F93D040De44e78F251b03c43be9CF317Dcf64) | `Tranche` ERC-20 (6 decimals, ERC-1404-compatible) |
| AsyncVault | [`0x4880799ee5200fc58da299e965df644fbf46780b`](https://etherscan.io/address/0x4880799ee5200fc58da299e965df644fbf46780b) | ERC-7540 entry/exit |
| Transfer Hook | [`0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7`](https://etherscan.io/address/0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7) | `FullRestrictions` (allowlist) |
| PoolEscrow (JAAA) | [`0x040170aA9AAa916c2e8135777a31f17C440BA52a`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a) | Pool-specific USDC escrow |
| Underlying asset | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | USDC |
| Pool Manager Safe | [`0x742d100011ffbc6e509e39dbcb0334159e86be1e`](https://etherscan.io/address/0x742d100011ffbc6e509e39dbcb0334159e86be1e) | Gnosis Safe — **3-of-8 threshold** (verified via `getThreshold()` / `getOwners()`); appointed for JAAA pool via `HubRegistry.updateManager` event (tx block 22932166) |

### Centrifuge V3 Core (shared)

| Contract | Address | Role |
|----------|---------|------|
| Root | [`0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f`](https://etherscan.io/address/0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f) | Protocol-level admin; **48h timelock** (`delay()` = 172800 s) on `executeScheduledRely`; can pause/unpause |
| Spoke | [`0xEC3582fcDc34078a4B7a8c75a5a3AE46f48525aB`](https://etherscan.io/address/0xEC3582fcDc34078a4B7a8c75a5a3AE46f48525aB) | Local share/vault registry on Ethereum |
| Hub (current, V3.1+) | [`0xA4A7Bb3831958463b3FE3E27A6a160F764341953`](https://etherscan.io/address/0xA4A7Bb3831958463b3FE3E27A6a160F764341953) | Canonical Hub per [Centrifuge deployments docs](https://docs.centrifuge.io/developer/protocol/deployments/); the JAAA pool is registered here (confirmed via `HubRegistry.exists()` + `UpdateManager` event at block 24376421) |
| Hub (V3.0, legacy) | [`0x9c8454A506263549f07c80698E276e3622077098`](https://etherscan.io/address/0x9c8454A506263549f07c80698E276e3622077098) | Original V3.0 Hub — still onchain and referenced by `ProtocolGuardian (V3.0).hub()` |
| HubRegistry (current, V3.1+) | [`0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93) | Per [docs](https://docs.centrifuge.io/developer/protocol/deployments/); JAAA pool 281474976710663 is registered here at block 24376421 with **two** managers: the 3-of-8 Safe `0x742d…be1e` and EOA `0x7bf090b9…02ec`. **This registry is the authoritative one for live operations under the current Hub.** |
| HubRegistry (legacy) | [`0x12044ef361Cc3446Cb7d36541C8411EE4e6f52cb`](https://etherscan.io/address/0x12044ef361Cc3446Cb7d36541C8411EE4e6f52cb) | Original V3.0 HubRegistry — JAAA pool data still exists onchain, but the current Hub does **not** consult this registry. Manager-change monitoring should target the current registry above. |
| AsyncRequestManager | [`0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae`](https://etherscan.io/address/0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae) | ERC-7540 deposit/redeem flow + price cache (`priceLastUpdated`, `convertToAssets`) |
| BalanceSheet | [`0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e`](https://etherscan.io/address/0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e) | Double-entry onchain accounting layer (V3.1+) |
| NAVManager (V3.1.x onchain-PM) | [`0x493b6C8ccC7BfD43c5a20C4F2C648701f74E9130`](https://etherscan.io/address/0x493b6C8ccC7BfD43c5a20C4F2C648701f74E9130) | Onchain-NAV manager listed under the [V3.1.0 deployment in Centrifuge docs](https://docs.centrifuge.io/developer/protocol/deployments/) — **NOT initialized for JAAA pool** (verified: `initialized(281474976710663, 1)` = `false`, `navHook(poolId)` = `0x0`); JAAA still uses manager-pushed pricing. The expanded onchain-PM feature suite was formalized in the [`v3.2.0` codebase tag](https://github.com/centrifuge/protocol/tree/v3.2.0) (April 2026) but no `deploy-mainnet-v3.2-*` tag exists yet, so the deployed contract here is the V3.1.x version. |
| SimplePriceManager (V3.1.x onchain-PM) | [`0x280C94eB440A8a75c2F8f6cA8c6FaFf907000823`](https://etherscan.io/address/0x280C94eB440A8a75c2F8f6cA8c6FaFf907000823) | Simple-price manager listed under V3.1.0 deployment in Centrifuge docs; `navUpdater()` = NAVManager. `pricePoolPerShare(JAAA poolId)` returns 1e18 (default), suggesting JAAA is not yet routed through it either. |
| Gateway (current) | [`0x19a524D03aA94ECEe41a80341537BCFCb47D3172`](https://etherscan.io/address/0x19a524D03aA94ECEe41a80341537BCFCb47D3172) | Outbound message gateway used by current Hub (`processor()` → current MessageProcessor) |
| MultiAdapter (current) | [`0x35C837F0A54B715a23D193E1476BFC9BC30073BE`](https://etherscan.io/address/0x35C837F0A54B715a23D193E1476BFC9BC30073BE) | Cross-chain message router per [docs](https://docs.centrifuge.io/developer/protocol/deployments/) (V3.1+) |
| MultiAdapter (legacy) | [`0x457C91384C984b1659157160e8543adb12BC5317`](https://etherscan.io/address/0x457C91384C984b1659157160e8543adb12BC5317) | Original V3.0 adapter (referenced by V3.0 Guardian) |
| MessageProcessor (current) | [`0x97cc7e9Dafdd725Cc23B25eeBC93c4384B4Fe30A`](https://etherscan.io/address/0x97cc7e9Dafdd725Cc23B25eeBC93c4384B4Fe30A) | Incoming cross-chain message handler — `Root.wards()=1` (verified onchain) |
| MessageProcessor (legacy) | [`0xe994149c6d00fe8708f843dc73973d1e7205530d`](https://etherscan.io/address/0xe994149c6d00fe8708f843dc73973d1e7205530d) | V3.0 legacy — `Root.wards()=0` (denied; do not monitor for live activity) |
| MessageDispatcher (current) | [`0xf837a22883e004f705E0D7e1deE08e295Df30B27`](https://etherscan.io/address/0xf837a22883e004f705E0D7e1deE08e295Df30B27) | Outgoing cross-chain dispatcher (Hub `sender()`) — `Root.wards()=1` |
| MessageDispatcher (legacy) | [`0x21AF0C29611CFAaFf9271C8a3F84F2bC31d59132`](https://etherscan.io/address/0x21AF0C29611CFAaFf9271C8a3F84F2bC31d59132) | V3.0 legacy — `Root.wards()=0` |
| TokenRecoverer (current) | [`0x1E70530e9555711f8DF4838Ab940b97c039B4037`](https://etherscan.io/address/0x1E70530e9555711f8DF4838Ab940b97c039B4037) | Authorized token recovery flow — `Root.wards()=1` (verified onchain via `MessageProcessor.tokenRecoverer()`) |
| TokenRecoverer (legacy) | [`0x94269dbaba605b63321221679df1356be0c00e63`](https://etherscan.io/address/0x94269dbaba605b63321221679df1356be0c00e63) | V3.0 legacy — `Root.wards()=0` |

### Governance Contracts

| Contract | Address | Role |
|----------|---------|------|
| ProtocolGuardian (V3.0, **retired**) | [`0xfee13c017693a4706391d516acabf6789d5c3157`](https://etherscan.io/address/0xfee13c017693a4706391d516acabf6789d5c3157) | Original V3.0 Guardian — **`Root.wards()=0`**; `Deny` emitted on Root at block **24376326** (tx [`0x559e892f...`](https://etherscan.io/tx/0x559e892f88bedd4042929ddfaa6d92225c6074ba582b9a48168db8138dc4a908)). No longer has admin power. |
| ProtocolAdminSafe (V3.0, **retired**) | [`0xD9D30ab47c0f096b0AA67e9B8B1624504a63e7FD`](https://etherscan.io/address/0xD9D30ab47c0f096b0AA67e9B8B1624504a63e7FD) | Gnosis Safe v1.3.0 — 4-of-8; only ever controlled Root indirectly via the V3.0 Guardian above, which is now denied. Effectively dormant. |
| ProtocolGuardian (current) | [`0xCEb7eD5d5B3bAD3088f6A1697738B60d829635c6`](https://etherscan.io/address/0xCEb7eD5d5B3bAD3088f6A1697738B60d829635c6) | `safe()` = `0x9711…7D225`; `Root.wards()=1` (added at block 24376326 in the same tx that retired V3.0). **Sole live admin path to Root.** |
| ProtocolAdminSafe (current) | [`0x9711730060C73Ee7Fcfe1890e8A0993858a7D225`](https://etherscan.io/address/0x9711730060C73Ee7Fcfe1890e8A0993858a7D225) | Gnosis Safe — **4-of-9 threshold** (verified onchain). Owns the current Guardian. |
| OpsGuardian | [`0x055589229506Ee89645EF08ebE9B9a863486d0dE`](https://etherscan.io/address/0x055589229506Ee89645EF08ebE9B9a863486d0dE) | Operations Guardian (lower-privilege actions, e.g. `createPool`, `wire`) |
| OpsSafe | [`0xd21413291444C5c104F1b5918cA0D2f6EC91Ad16`](https://etherscan.io/address/0xd21413291444C5c104F1b5918cA0D2f6EC91Ad16) | Gnosis Safe behind OpsGuardian |
| FullActionBatcher (deployer) | [`0x5f3f8ea3b54bff7795de7754866e0eac52e0881d`](https://etherscan.io/address/0x5f3f8ea3b54bff7795de7754866e0eac52e0881d) | Atomic deployment script — held bootstrap rely on Root at block 22924235 |

Per the Centrifuge `wards` permission model (`rely(addr)` → `wards[addr]=1`), Root is the master ward on Vault, Share Token, AsyncRequestManager, Spoke, Hub, BalanceSheet, the FullRestrictions hook, etc. (all verified onchain). Root in turn is ward'd by the current `ProtocolGuardian` and the current protocol-internal contracts (current MessageProcessor / MessageDispatcher / TokenRecoverer). The **V3.0 Guardian was `Deny`'d on Root at block 24376326** ([Deny event](https://etherscan.io/tx/0x559e892f88bedd4042929ddfaa6d92225c6074ba582b9a48168db8138dc4a908)) during the V3.1 upgrade; the V3.0 ProtocolAdminSafe behind it is therefore dormant. The current 4-of-9 `ProtocolAdminSafe` (via its Guardian) is the **sole live admin path to Root** — verified onchain by checking `Root.wards()` on every governance address.

### deJAAA Pool (poolId 281474976710659) — Freely-transferable wrapper

| Contract | Address | Type |
|----------|---------|------|
| deJAAA Share Token | [`0xAAA0008C8CF3A7Dca931adaF04336A5D808C82Cc`](https://etherscan.io/address/0xAAA0008C8CF3A7Dca931adaF04336A5D808C82Cc) | ERC-20 (18 decimals) |
| AsyncVault | [`0x4865bc9701fbd1207a7b50e2af442c7daf154c9c`](https://etherscan.io/address/0x4865bc9701fbd1207a7b50e2af442c7daf154c9c) | ERC-7540 |
| Transfer Hook | [`0x9AAb592CAE455Afb6fC78c922f9212bC2A4f1147`](https://etherscan.io/address/0x9AAb592CAE455Afb6fC78c922f9212bC2A4f1147) | `FreelyTransferable` |

## Audits and Due Diligence Disclosures

Centrifuge V3 has received an unusually heavy audit cadence — **20+ engagements since Feb 2025** across two top-tier firms (Cantina/Spearbit, yAudit/Electisec), three reputable independent reviewers (BurraSec, xmxanuel, Recon), and a Sherlock public contest with Blackthorn. All reports are published in the GitHub repo at [centrifuge/protocol/docs/audits](https://github.com/centrifuge/protocol/tree/main/docs/audits).

### V3 Audit History (selected)

| Date | Firm | Scope | Link |
|------|------|-------|------|
| Feb 2025 | Cantina | V3 core | [PDF](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-02-Cantina.pdf) |
| Mar 2025 | xmxanuel | V3.0 | [PDF](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-03-xmxanuel.pdf) |
| Apr 2025 | Recon | V3.0 invariants | [PDF](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-04-Recon.pdf) |
| Apr 2025 | BurraSec (×2) | V3.0 | [PDF1](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-04-burraSec-1.pdf) · [PDF2](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-04-burraSec-2.pdf) |
| May 2025 | Cantina (Spearbit) | V3.0 | [Cantina page](https://cantina.xyz/portfolio/8b98604d-b303-42ee-95bf-50c9c6eb7b47) |
| Jul 2025 | yAudit / Electisec | V3.0 | [PDF](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-07-yAudit.pdf) |
| Aug 2025 | Cantina | V3 updates | [PDF](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-08-Cantina.pdf) |
| Sep–Oct 2025 | BurraSec, yAudit | V3.1 | [9-burraSec](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-09-burraSec.pdf) · [10-yAudit](https://github.com/centrifuge/protocol/blob/main/docs/audits/2025-10-yAudit.pdf) |
| Dec 2025 | Sherlock + Blackthorn | V3.1 public contest, 320k USDC prize pool | [Contest](https://audits.sherlock.xyz/contests/1028) |
| Jan 2026 | yAudit | V3.1 | [PDF](https://github.com/centrifuge/protocol/blob/main/docs/audits/2026-01-yAudit.pdf) |
| Feb 2026 | Sherlock | V3.1 deployment | [PDF](https://github.com/centrifuge/protocol/blob/main/docs/audits/2026-02-Sherlock-deployment.pdf) |
| Mar–Apr 2026 | xmxanuel, Sherlock, BurraSec | V3.2 Onchain PM | [3-xmxanuel](https://github.com/centrifuge/protocol/blob/main/docs/audits/2026-03-xmxanuel-onchain-pm.pdf) · [4-Sherlock](https://github.com/centrifuge/protocol/blob/main/docs/audits/2026-04-Sherlock-onchain-pm.pdf) |

(V2 audits from Spearbit, Code4rena and SR Labs from 2023–2024 also remain in the same folder.)

**Contract complexity:** Centrifuge V3 is a **complex multi-chain protocol** — Hub/Spoke contract pair on every supported chain, Wormhole message adapter, async ERC-7540 vault flow with separate request manager, double-entry onchain accounting layer, three transfer-hook variants, plus pool-specific managers. Surface area is large relative to a single-chain ERC-4626. Several unresolved findings from these audits: TODO — full triage of fix status across all 20+ reports is out of scope for this assessment.

### Bug Bounty

- **Cantina**: Active program with **$250,000 max payout** for Critical findings (High $50k, Medium $5k). Started July 17, 2025. ~466 findings to date. [Cantina – Centrifuge bounty](https://cantina.xyz/bounties/6cc9d51a-ac1e-4385-a88a-a3924e40c00e)
- **SEAL Safe Harbor**: Centrifuge not located on the [Safe Harbor registry](https://safeharbor.securityalliance.org/) as of this assessment.
- **Immunefi**: No public listing found.

## Historical Track Record

- **Centrifuge V3 launch:** July 24, 2025 (multichain) ([Centrifuge blog](https://centrifuge.io/blog/centrifuge-v3-multichain-launch)). **~10 months in production** as of May 28, 2026.
- **V3.1 launch:** February 11, 2026 — adds Optimism, HyperEVM, Monad; new ProtocolGuardian deployed and the V3.0 Guardian was `Deny`'d on Root at block 24376326 ([Deny event tx](https://etherscan.io/tx/0x559e892f88bedd4042929ddfaa6d92225c6074ba582b9a48168db8138dc4a908)). The new HubRegistry [`0x19f46…ADE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93) became the authoritative registry; JAAA pool was registered there at block 24376421 ([`UpdateManager` event tx](https://etherscan.io/tx/0x499ec04a42f6f4a961be5333f2d58db0538a8503cc058bb8b63fd9ca0fd5b9f8)). ([Centrifuge blog](https://centrifuge.io/blog/centrifuge-v3-1))
- **V3.1.x Onchain Portfolio Manager (mainnet) / v3.2.0 (tagged, not yet mainnet-deployed):** An onchain `NAVManager` ([`0x493b…9130`](https://etherscan.io/address/0x493b6C8ccC7BfD43c5a20C4F2C648701f74E9130)) and `SimplePriceManager` ([`0x280C…0823`](https://etherscan.io/address/0x280C94eB440A8a75c2F8f6cA8c6FaFf907000823)) are deployed on Ethereum under the V3.1.0 release per the [Centrifuge deployments docs](https://docs.centrifuge.io/developer/protocol/deployments/). The expanded onchain-PM feature suite (onchain-PM, guards, accounting token — see commit message of [v3.2.0 tag](https://github.com/centrifuge/protocol/commit/41e19975946ac60927f3db7087f6c0b67bf752bb)) was tagged in the codebase on 2026-04-27 and audited Mar–Apr 2026, but the only `deploy-mainnet-v3.*` tags in the protocol repo as of this assessment target v3.1.x — there is **no `deploy-mainnet-v3.2-*` tag yet**, so v3.2.0 is not yet live on Ethereum mainnet. **JAAA does not currently use the deployed contracts** either — verified onchain: `NAVManager.initialized(281474976710663, 1)` = `false`, `NAVManager.navHook(281474976710663)` = `0x0`, and `SimplePriceManager.pricePoolPerShare(281474976710663)` returns the default 1e18. JAAA's price remains pushed manually by the Pool Manager (Safe or EOA).
- **JAAA fund inception (offchain):** May 1, 2025. ([rwa.xyz](https://app.rwa.xyz/assets/JAAA))
- **JAAA public onchain launch:** June 25, 2025 with a **$1B seed allocation from Grove** (Sky-incubated credit infrastructure protocol). ([Centrifuge blog](https://centrifuge.io/blog/centrifuge-janus-henderson-grove-tokenized-aaa-clo-fund) · [Businesswire](https://www.businesswire.com/news/home/20250624393365/en/Grove-Announces-Launch-of-Institutional-Grade-Credit-Infrastructure-DeFi-Protocol-with-%241-Billion-Allocation-to-Tokenized-Janus-Henderson-Anemoy-AAA-CLO-Strategy))
- **Peak TVL (Centrifuge protocol-wide):** ~$1.99B on 2026-04-24 ([DefiLlama](https://defillama.com/protocol/centrifuge)). Current ~$1.38B (latest DefiLlama reading 2026-05-28).
- **JAAA AUM history:** From $1B at Grove launch (June 2025) to ~$437.9M aggregate NAV across chains as of 2026-05-28 ([rwa.xyz](https://app.rwa.xyz/assets/JAAA)) — apparent net Grove redemption / reallocation between launch and current. Specific cause: **TODO** (most likely Grove rebalancing into other Centrifuge products like JTRSY and Apollo's ACRDX, but not confirmed).
- **Security incidents:** **None reported** on Centrifuge V3 contracts. (No incident reports on Centrifuge's [security page](https://centrifuge.io/security) or in public disclosures searched.)
- **Peg / NAV stability:** Onchain NAV reflects fund accumulation (1.000 → 1.034 USDC over ~12 months), consistent with the fund's targeted ~5% AAA-CLO yield.

## Funds Management

### Accessibility

- **Who can subscribe:** Non-U.S. professional/institutional investors only. JAAA is a regulated **BVI Professional Fund**; subscription requires KYC/AML through Anemoy. ([rwa.xyz](https://app.rwa.xyz/assets/JAAA))
- **Onchain mechanics:** Asynchronous ERC-7540-style flow:
  1. Whitelisted investor calls `AsyncVault.requestDeposit(assets, controller, owner)` and the USDC enters the pool escrow.
  2. The pool operator (Anemoy back-office / Pool Manager Safe) calls `Hub.approveDeposits` and `Hub.issueShares` to allocate JAAA at the most recent NAV.
  3. Investor calls `AsyncVault.mint(shares, receiver, controller)` to claim shares.
  Redemption mirrors this in reverse (`requestRedeem` → operator processes → `withdraw`).
- **Atomicity:** **Not atomic.** Subscriptions and redemptions are processed in **daily** batches; investor must come back to claim. Settlement currency is USDC. Per the [factsheet](https://gateway.pinata.cloud/ipfs/QmcWwvqnoUkH1bMYktnMdEywmUkUeK3PPex2i763zVNUmm), settlement is "usually T+3".
- **Minimum investment:** $500,000 USDC (per on-chain pool metadata).
- **Force-cancel powers:** `AsyncRequestManager` exposes `forceCancelDepositRequest` and `forceCancelRedeemRequest` (auth-gated; callable through the Hub by the pool manager). This allows the pool manager to unwind a pending request without investor signature.
- **Transfer restriction:** Share-to-share transfers on the JAAA token are gated by the `FullRestrictions` hook ([`0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7`](https://etherscan.io/address/0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7)) — only allowlisted addresses can hold or receive JAAA. The allowlist is managed by Anemoy / the pool manager (via `Spoke.updateRestriction` → hook).
- **Fees:** Management 0.40% p.a., performance 0%, no subscription/redemption fees onchain (rwa.xyz). Gas on each user-initiated request applies normally.

### Collateralization

- **Backing:** 1:1 by the **Janus Henderson Anemoy AAA CLO Fund** — a portfolio of AAA-rated, floating-rate CLO tranches. Cash and short-duration AAA CLO debt of multiple underlying CLO issuers.
- **Specific CLO holdings (issuer mix):** **21 positions, $762.7M total market value, 99.99% of portfolio allocated** per the public [on-chain pool metadata IPFS](https://ipfs.io/ipfs/QmPzzjsF9xZcXZJhzJR6EHmQpaMmRnrtRnvBSWBRzyBEh1) (full list with CUSIP/ISIN/ticker/market-value/% available; refetched 2026-05-28). Top five:
  - ARES LOAN FUNDING II LTD (ARES 2022-ALF2A) — 8.68%
  - MADISON PARK FUNDING XXX LTD (MDPK 2018-30A) — 8.08%
  - AMMC CLO 27 LTD (AMMC 2022-27A) — 7.87%
  - CBAM 2017-1 LTD (CBAMR 2017-1A AR2) — 7.68%
  - CARLYLE US CLO 2021-10 LTD (CGMS 2021-10A) — 5.26%
- **Asset quality:** 100% AAA tranches at the senior end of the CLO capital stack. The CLO managers shown (Ares Capital, Credit Suisse Asset Management / Madison Park, American Money Management Corp / AMMC) are large, established institutional CLO managers. Historical loss rates on AAA CLO tranches are near zero through multiple credit cycles. Third-party rating: **Particula AAA** ([pool metadata](https://ipfs.io/ipfs/QmPzzjsF9xZcXZJhzJR6EHmQpaMmRnrtRnvBSWBRzyBEh1)).
- **Custody / service providers (offchain):**
  - **Custodian:** StoneX Securities Inc. (regulated U.S. broker-dealer) per [rwa.xyz](https://app.rwa.xyz/assets/JAAA) — note: not separately named in the factsheet, but rwa.xyz is operated by the data provider that aggregates issuer disclosures.
  - **Fund administrator:** Trident Trust **Cayman** (per [factsheet](https://gateway.pinata.cloud/ipfs/QmcWwvqnoUkH1bMYktnMdEywmUkUeK3PPex2i763zVNUmm) and [pool metadata](https://ipfs.io/ipfs/QmPzzjsF9xZcXZJhzJR6EHmQpaMmRnrtRnvBSWBRzyBEh1))
  - **Auditor:** MHA Cayman
  - **Crypto-asset custodian:** Circle (per rwa.xyz)
  - **Regulator:** BVI Financial Services Commission (FSC) — fund is an open-ended BVI Professional Fund

  Note on jurisdictions: the *fund* is BVI-domiciled and BVI-regulated, but the *administrator* and *auditor* are Cayman-based. This is common for BVI funds and not in itself a red flag.
- **Onchain backing in PoolEscrow:** [`0x040170aA9AAa916c2e8135777a31f17C440BA52a`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a) holds ~14,281 USDC at the assessment block — this is **operational liquidity for pending subscriptions/redemptions only**, not the reserves backing the share supply. The vast majority of NAV is offchain at StoneX in CLO instruments.
- **Risk curation:** Investment policy (AAA-only, floating-rate, duration limits) is set by Anemoy as fund manager and supervised under the BVI Securities and Investment Business Act. There is no onchain liquidation mechanism — share NAV is set by the offchain fund net asset value computation.

### Provability

- **Share price source:** The price returned by `AsyncRequestManager.convertToAssets()` (1.036124 USDC/JAAA at this assessment, block 25,195,241) is a **cached value pushed onchain by the pool manager**, not a real-time onchain computation. `priceLastUpdated(vault)` returned timestamp `1779883200` = 2026-05-27 12:00 UTC, i.e., the price had been refreshed ~29 hours before this assessment.
- **Who publishes the price:** Two principals are registered as JAAA pool managers on the current HubRegistry (`manager(281474976710663, addr)==true` verified onchain):
  - **3-of-8 Pool Manager Safe** [`0x742d100011ffbc6e509e39dbcb0334159e86be1e`](https://etherscan.io/address/0x742d100011ffbc6e509e39dbcb0334159e86be1e) — original manager appointed via `HubRegistry.updateManager` at block 22932166.
  - **EOA** [`0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec) — added at block 24376421 during the V3.1 upgrade; no contract code (single-key authority).
- **Onchain pricing infrastructure — deployed (V3.1.x) but not used by JAAA:** Centrifuge's onchain-PM feature suite introduces a `NAVManager` ([`0x493b…9130`](https://etherscan.io/address/0x493b6C8ccC7BfD43c5a20C4F2C648701f74E9130)) that "recomputes the fund's net asset value directly from onchain state" and a `SimplePriceManager` ([`0x280C…0823`](https://etherscan.io/address/0x280C94eB440A8a75c2F8f6cA8c6FaFf907000823)) ([blog](https://centrifuge.io/blog/onchain-pm)). The mainnet contracts at these addresses were deployed under V3.1.0 per docs; the codebase formally bundles this feature suite under the [v3.2.0 tag](https://github.com/centrifuge/protocol/tree/v3.2.0) (April 2026), which has not yet been mainnet-deployed. For JAAA — whose underlying assets (CLO tranches) live entirely offchain — a fully onchain NAV is structurally impossible regardless. Verified onchain: `NAVManager.initialized(281474976710663, 1)` = `false` and `NAVManager.navHook(281474976710663)` = `address(0)`. The JAAA price is therefore still pushed manually by the Pool Manager (Safe or EOA) via the Hub, not derived from onchain state.
- **Third-party verification:** No Chainlink Proof of Reserves or NAVLink feed for JAAA was found. Trust is therefore anchored on (a) Trident Trust as fund administrator publishing NAV, (b) MHA Cayman as auditor, (c) StoneX as regulated custodian, and (d) the BVI Financial Services Commission as the fund's regulator. The Centrifuge protocol enforces no onchain attestation; whatever Anemoy/the pool manager pushes is canonical.
- **Can admin mint tokens without backing?** **Yes, technically.** The JAAA `Tranche` (share token) exposes `mint(address, uint256)` gated only by `wards[caller]==1`. Root has ward power, and Root is reachable only through the current 4-of-9 V3.1+ ProtocolAdminSafe (verified onchain — the V3.0 Guardian was `Deny`'d on Root at block 24376326). In normal operation the protocol only mints in response to deposit requests with backing escrowed; however, an attacker controlling the current governance Safe — or either of the two pool-manager principals (3-of-8 Safe or the EOA) operating via the Hub — could issue shares without corresponding USDC backing. The Pool Manager EOA path is the most concerning: a single private key, no timelock for issuance, daily NAV-push authority. This is a generic governance-key risk shared with most issuer-controlled stablecoins (USDG, USDC, etc.) but worth noting given JAAA's institutional positioning.
- **Token recovery:** The current `TokenRecoverer` contract ([`0x1E70530e9555711f8DF4838Ab940b97c039B4037`](https://etherscan.io/address/0x1E70530e9555711f8DF4838Ab940b97c039B4037)) is ward'd on Root (verified onchain — `Root.wards()=1`; resolved via `MessageProcessor.tokenRecoverer()`) and can move tokens out of protocol contracts via auth-protected `recoverTokens` flows. The legacy V3.0 TokenRecoverer [`0x94269d…00e63`](https://etherscan.io/address/0x94269dbaba605b63321221679df1356be0c00e63) is denied (`Root.wards()=0`). Token recovery is necessary for cross-chain message-loss recovery but represents a privileged-action surface. The Guardian must `initiateRecovery` and a `disputeRecovery` window exists.

## Liquidity Risk

- **Primary exit (intended):** Daily 1:1 redemption through Anemoy at NAV, settled in USDC. Async — investor submits `requestRedeem`, operator processes in next daily batch, investor claims USDC. Per the factsheet, settlement is "usually T+3."
- **Redemption capacity:** Constrained by the underlying CLO portfolio's secondary-market liquidity. AAA CLOs are relatively liquid in normal markets (large institutional buyer base) but liquidity is **historically lower than U.S. Treasuries** and can widen materially in stress (e.g. March 2020).
- **Onchain liquidity (JAAA share):** Transfer-restricted — no DEX pools available for JAAA itself. Secondary onchain liquidity is only available via the **deJAAA** wrapper or via Aave Horizon collateral position unwinding.
- **DeFi integrations providing secondary liquidity:**
  - **Aave Horizon** (institutional market) — JAAA selected as launch collateral; reached ~$100M in first week. ([Centrifuge Q3 2025 recap](https://centrifuge.io/blog/centrifuge-q3-2025-recap))
  - **Resolv × Aave Horizon** — Up to $100M JAAA as actively-managed leveraged collateral (80% LTV). ([Centrifuge blog](https://centrifuge.io/blog/resolv-aave-centrifuge-partnership))
  - **Falcon Finance** — JAAA accepted as collateral to mint USDf. ([Falcon Finance](https://falcon.finance/news/falcon-finance-adds-centrifuges-jaaa-as-collateral-unlocking-onchain-liquidity-for-institutional-grade-credit))
  - **3F (Morpho)** — Leveraged exposure product on JAAA. ([The Block](https://www.theblock.co/post/398686/3f-morpho-funding-everaged-exposure-tokenized-assets))
- **Concentration risk:** **Holder count = 23** (rwa.xyz). Highly concentrated — likely a small number of institutional holders (Grove, Resolv, Aave Horizon position holders, possibly a few funds). A single large redemption could materially drain pool-level USDC float, in which case Anemoy's offering-memo discretion (see "Withdrawal queue / throttle" below) allows the fund manager to **delay or partially fulfil** the redemption rather than force-sell. Any net liquidation of underlying CLOs happens **offchain** — at StoneX custody, via Anemoy in the secondary market — not via any onchain forced-sale mechanism. JAAA is a claim on the offchain fund, not collateral that smart contracts liquidate.
- **Withdrawal queue / throttle:** No explicit fixed-cap throttle on `requestRedeem`. Anemoy retains discretion to delay or partially fulfil redemptions if portfolio liquidity is insufficient (typical for open-end credit funds). Specific gating language in the fund offering memorandum: **TODO** (offering memo not publicly downloadable).
- **Historical drawdown handling:** No stress events observed since JAAA inception in May 2025. Indirect reference points: Janus Henderson's $21B JAAA ETF maintained tight bid-ask in 2024–2025.
- **Same-value classification:** JAAA is a yield-bearing dollar-denominated security (~5% APY). Not a stablecoin — daily mark-to-market NAV varies slightly with CLO market prices. Acceptable to apply longer exit times for the AAA-credit asset class.

## Centralization & Control Risks

### Governance

- **Single live ProtocolAdminSafe** (verified onchain — `Root.wards()` check on every governance address):
  - **Current V3.1+ Safe** [`0x9711730060C73Ee7Fcfe1890e8A0993858a7D225`](https://etherscan.io/address/0x9711730060C73Ee7Fcfe1890e8A0993858a7D225) — Gnosis Safe, **4-of-9 threshold**, behind the current `ProtocolGuardian` [`0xCEb7…35c6`](https://etherscan.io/address/0xCEb7eD5d5B3bAD3088f6A1697738B60d829635c6) (`Root.wards()=1`).
  - The V3.0 Guardian [`0xfee1…3157`](https://etherscan.io/address/0xfee13c017693a4706391d516acabf6789d5c3157) was `Deny`'d on Root at block **24376326** (tx [`0x559e892f…`](https://etherscan.io/tx/0x559e892f88bedd4042929ddfaa6d92225c6074ba582b9a48168db8138dc4a908)) — the V3.0 4-of-8 Safe behind it is dormant.
- **Pool Manager (Hub-level)** — the JAAA pool has **two registered managers** on the current `HubRegistry` ([`0x19f46…ADE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93)), both verified by `manager(281474976710663, addr) == true`:
  1. **Pool Manager Safe** [`0x742d100011ffbc6e509e39dbcb0334159e86be1e`](https://etherscan.io/address/0x742d100011ffbc6e509e39dbcb0334159e86be1e) — **3-of-8 Gnosis Safe**.
  2. **Pool Manager EOA** [`0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec) — externally-owned account (no contract code), registered as a manager at block **24376421** during the V3.1 upgrade ([`UpdateManager` event](https://etherscan.io/tx/0x499ec04a42f6f4a961be5333f2d58db0538a8503cc058bb8b63fd9ca0fd5b9f8)). Likely an Anemoy pricing/automation key.
  Either manager can set prices, approve/issue/revoke shares, force-cancel investor requests, and update the allowlist for the JAAA pool. The **EOA path is a single-key risk** — compromise of one signer is sufficient to mis-price or seize. Investor recourse is to (a) wait for the 48h Root timelock to ratify a Pool Manager change or (b) rely on Guardian pause.
- **Root timelock:** `delay()` = **172,800 s (48 hours)** for `scheduleRely`/`executeScheduledRely`. The Guardian wraps the Safe and adds a Zodiac Delay module of ~24h per Centrifuge docs (not directly verified onchain in this session). Aggregate "schedule new admin" delay is therefore documented as **72h**; the onchain Root delay alone is 48h.
- **Guardian pause:** `Guardian.pause()` is callable without delay and freezes the protocol. `Guardian.unpause()` and other privileged paths require the Safe.
- **CFG token governance:** CFG holders discuss and signal on protocol parameters via the [Centrifuge Governance Forum](https://gov.centrifuge.io/). There is **no onchain enforcement linkage between CFG votes and the EVM ProtocolAdminSafe** — the Safe signers act independently, and a CFG vote does not automatically trigger any onchain action on Ethereum. CFG-holder influence over Ethereum-side authority is therefore *social/political* (signaling consumed by Safe signers), not contractual. The structural trust anchor on Ethereum is the 4-of-9 Safe + 48h Root timelock, regardless of CFG voting outcomes.
- **Privileged actions Root/Safes can take:**
  - Upgrade vault / share / hook / hub / spoke implementations
  - Add or remove wards on any protocol contract (including new mint authority on the share token)
  - Pause the protocol (Guardian, no delay)
  - Recover tokens (TokenRecoverer, dispute window applies)
  - Add new cross-chain adapters (e.g. wire new Wormhole route)
- **Fund seizure / freeze:** The `FullRestrictions` hook gives the pool manager the ability to **freeze a user's JAAA balance** (`hookDataOf` / `setHookData`). This is a regulatory feature for sanctions/compliance; it is also a real-world risk for any holder if Anemoy or the pool manager is compelled by court order.

### Programmability

- **Share-price update:** Manager-pushed (offchain → onchain). Currently ~1× per ~24h based on `priceLastUpdated`. PPS is therefore **stale between pushes** and admin-controlled.
- **Issuance:** Programmatic *given* a pool-manager approval — the manager must explicitly `approveDeposits` and `issueShares` for each batch.
- **Cross-chain:** All multi-chain operations (issuing JAAA on Avalanche, Stellar, etc., recognizing redemptions, propagating prices) route through Wormhole. Failure or compromise of the Wormhole adapter would temporarily break cross-chain settlement; recovery flows exist via `initiateRecovery` / `disputeRecovery` on the Guardian.
- **Accounting:** V3.1 introduced full onchain double-entry accounting in `BalanceSheet` [`0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e`](https://etherscan.io/address/0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e). However, the *valuation* of the offchain CLO holdings still depends on the pool manager's price push.

### External Dependencies

- **Wormhole** — sole cross-chain messaging adapter at present (`MultiAdapter` is wired for Wormhole, additional adapter routes can be added by the Guardian per V3 docs). Wormhole has a strong track record post-2022 ($325M Solana exploit), but it remains a single bridging dependency for cross-chain JAAA accounting.
- **USDC (Circle)** — the underlying asset for the JAAA vault. Inherits Circle's freeze list and reserve risk.
- **Anemoy Capital SPC Limited (BVI)** — fund issuer of record. The legal wrapper that holds the underlying CLOs. BVI insolvency or regulatory action against Anemoy would constitute an existential risk for token holders.
- **Janus Henderson** — sub-advisor; selects and manages the CLO portfolio.
- **StoneX Securities Inc.** — custodian of the underlying CLO instruments. Custodian failure / fraud risk.
- **Trident Trust** — fund administrator; computes NAV.
- **MHA Cayman** — fund auditor.
- **Circle** — crypto custody leg.
- **Sky / Grove** — until recently the largest single JAAA holder ($1B at launch). Grove redemption flow is the largest single-counterparty risk to JAAA's onchain TVL stability.

## Operational Risk

- **Team transparency:** **Centrifuge Network Foundation** is the corporate governing body ([centrifuge.foundation](https://www.centrifuge.foundation/)). Centrifuge has a public engineering team led by Lucas Vogelsang (CEO) and Martin Quensel (co-founder). Anemoy team and Janus Henderson representatives are public institutional figures.
- **Documentation:** Centrifuge V3 has thorough developer documentation at [docs.centrifuge.io](https://docs.centrifuge.io/developer/protocol/overview/), including architecture pages for [Hub](https://docs.centrifuge.io/developer/protocol/architecture/hub/), [Spoke](https://docs.centrifuge.io/developer/protocol/architecture/spoke/), and [Security](https://docs.centrifuge.io/developer/protocol/security/). JAAA-specific investor documentation lives at [anemoy.io/funds/jaaa](https://www.anemoy.io/funds/jaaa) and [rwa.xyz/JAAA](https://app.rwa.xyz/assets/JAAA). Public per-issuer holdings disclosure for the JAAA fund: not located.
- **Legal structure:**
  - Centrifuge: Centrifuge Network Foundation (Switzerland — per public press kit; legal jurisdiction TODO to verify).
  - JAAA fund: BVI Professional Fund issued by Anemoy Capital SPC Limited, regulated by the BVI FSC under the Securities and Investment Business Act.
- **Incident response:** No public incident-response playbook found, but Guardian-pause and TokenRecoverer flows exist on-protocol. No production incidents have been observed to test response.

## Monitoring

The most consequential signals for JAAA risk are (a) governance Safe actions, (b) the daily NAV push and pool-manager state, and (c) protocol-wide pause/upgrade state. Monitor at least daily for items 1–3; weekly for 4–5.

1. **NAV freshness** — call `AsyncRequestManager.priceLastUpdated(vault)` on [`0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae`](https://etherscan.io/address/0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae) with the JAAA AsyncVault address. **Alert if price age > 48 hours** during business days. Compare `convertToAssets(vault, 1e6)` against rwa.xyz NAV daily — divergence > 0.5% warrants investigation.

2. **JAAA share supply vs. PoolEscrow + fund NAV** — `IERC20(JAAA).totalSupply()` should track Anemoy's published fund NAV (offchain). PoolEscrow USDC balance [`0x040170aA9AAa916c2e8135777a31f17C440BA52a`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a) ≠ total backing — it is operational float only. Sudden unexplained supply changes (no corresponding `requestDeposit`/`requestRedeem` activity) are a critical red flag.

3. **Root pause state** — `Root.paused()` on [`0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f`](https://etherscan.io/address/0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f). Any `Pause` event = stop new flows.

4. **Governance Safe transactions** — monitor on-chain transaction submission to:
   - V3.1+ Safe [`0x9711730060C73Ee7Fcfe1890e8A0993858a7D225`](https://etherscan.io/address/0x9711730060C73Ee7Fcfe1890e8A0993858a7D225) (4-of-9) — sole live admin path to Root
   - Pool Manager Safe [`0x742d100011ffbc6e509e39dbcb0334159e86be1e`](https://etherscan.io/address/0x742d100011ffbc6e509e39dbcb0334159e86be1e) (3-of-8 — JAAA-specific)
   - Pool Manager EOA [`0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec) — JAAA-specific; flag *any* outgoing tx, especially calls into `Hub` / `AsyncRequestManager` / `Spoke`
   - OpsSafe [`0xd21413291444C5c104F1b5918cA0D2f6EC91Ad16`](https://etherscan.io/address/0xd21413291444C5c104F1b5918cA0D2f6EC91Ad16)
   The V3.0 Safe [`0xD9D30…7e7FD`](https://etherscan.io/address/0xD9D30ab47c0f096b0AA67e9B8B1624504a63e7FD) is dormant after its Guardian was denied (block 24376326) — no longer needs active monitoring.
   Use [`safe-monitor`](https://github.com/yearn/monitoring-scripts-py/blob/main/safe/main.py) pattern.

5. **Root Rely / Deny events** — log `Rely(address)` and `Deny(address)` on Root. Any new ward added to Root is by definition a new governance principal; should match a known protocol upgrade announcement.

6. **HubRegistry.UpdateManager events on the *current* registry** — `UpdateManager(uint64 poolId, address manager, bool canManage)`, topic0 `0x34d7bc620a98c7bbfc3e91245b8fd8cb1812543d39dffb55d1aafc6a44e3cdab`, on the current registry [`0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93). Filter on poolId topic = `0x0000000000000000000000000000000000000000000000000001000000000007` (= 281474976710663). Any new manager registered = change to who can set JAAA price / issue shares. **Do not watch the legacy registry** [`0x12044…f52cb`](https://etherscan.io/address/0x12044ef361Cc3446Cb7d36541C8411EE4e6f52cb) — it is no longer authoritative under the current Hub.

7. **Aggregate cross-chain JAAA supply** — pull from [rwa.xyz/JAAA](https://app.rwa.xyz/assets/JAAA) (offchain dashboard); cross-check with each chain's `IERC20(JAAA).totalSupply()`.

8. **Anemoy / Janus Henderson disclosures** — periodic fund attestations / factsheets (if/when Anemoy publishes them — TODO to confirm cadence).

9. **Guardian pause/upgrade events** — `pause()`, `unpause()`, `scheduleUpgrade()`, `cancelUpgrade()` on both ProtocolGuardian contracts.

10. **PoolEscrow USDC flow** — `Transfer` events on USDC from/to [`0x040170aA9AAa916c2e8135777a31f17C440BA52a`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a). Large outflows without corresponding redemption requests warrant investigation.

Recommended frequency: daily for NAV / Safe / pause monitoring; weekly for aggregate supply reconciliation.

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOVERNANCE / TIMELOCK LAYER                         │
│                                                                             │
│   V3.0 Safe (4/8)          V3.1+ Safe (4/9)        OpsSafe                  │
│   0xD9D3…7e7FD             0x9711…7D225            0xd214…dAd16             │
│   [DORMANT]                     │                       │                   │
│        │                        ▼                       ▼                   │
│        ▼                   ProtocolGuardian         OpsGuardian            │
│   ProtocolGuardian          (current) 0xCEb7…35c6    0x0555…d0dE            │
│   (V3.0) 0xfee1…3157                │                      │                │
│   [DENIED on Root,                  │                      │                │
│    block 24376326]                  ▼                      │                │
│                              Root (48h delay)              │                │
│                              0x7Ed4…368f                   │                │
└──────────────────────────┬─────────────────────────────────┴────────────────┘
                           │ wards = master admin
                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PROTOCOL CORE (V3)                                 │
│                                                                             │
│   Hub (V3.0, legacy)        HubRegistry (current)     Hub (V3.1+, current)  │
│   0x9c84…7098               0x19f46…ADE93 ◀─────────▶ 0xA4A7…1953           │
│   [governance retired]      JAAA managers:                                  │
│                             0x742d…be1e (3/8 Safe)                          │
│                             0x7bf090b9…02ec (EOA)                           │
│                             (legacy HubRegistry 0x1204…f52cb retains stale  │
│                              pool data but is not consulted by current Hub) │
│                                          ▲                                  │
│                                          │ cross-chain via Wormhole         │
│                                          │ MultiAdapter (current)           │
│                                          │ 0x35C8…73BE                      │
│                                          ▼                                  │
│   Spoke (Ethereum)               BalanceSheet (V3.1 acctg)                  │
│   0xEC35…525aB                   0x12a1…f43e                                │
│        │                                                                    │
│        ▼                                                                    │
│   AsyncRequestManager (ERC-7540, price cache)                               │
│   0xF482…761Ae                                                              │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              JAAA POOL (poolId 281474976710663)                             │
│                                                                             │
│  Pool Manager Safe (3/8)     FullRestrictions hook                          │
│  0x742d…be1e ───────────────▶ 0x3C5E…80A7 (allowlist)                       │
│        │                                                                    │
│        │ sets price / approves issuance                                     │
│        ▼                                                                    │
│  AsyncVault ───── share() ──▶ JAAA Tranche (ERC-20, 6dp)                    │
│  0x4880…780b                  0x5a0F…cf64                                   │
│        │                                                                    │
│        │ asset = USDC                                                       │
│        ▼                                                                    │
│  PoolEscrow (operational USDC float)                                        │
│  0x0401…a52a                                                                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ (offchain settlement)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OFFCHAIN — JANUS HENDERSON / ANEMOY                  │
│                                                                             │
│   Anemoy Capital SPC (BVI Professional Fund — issuer of record)             │
│         │  ├── Sub-advisor: Janus Henderson (CLO portfolio management)      │
│         │  ├── Custodian: StoneX Securities Inc. (CLO holdings)             │
│         │  ├── Administrator: Trident Trust (NAV computation)               │
│         │  ├── Auditor: MHA Cayman                                          │
│         │  └── Crypto custodian: Circle                                     │
│         ▼                                                                   │
│   Portfolio of AAA-rated, floating-rate CLO tranches                        │
└─────────────────────────────────────────────────────────────────────────────┘

Parallel deRWA wrapper pool (poolId 281474976710659):
  AsyncVault 0x4865…4c9c → deJAAA token 0xAAA0…82Cc (18dp) → FreelyTransferable
  hook 0x9AAb…1147 — freely transferable, distributed onto DEXes /
  lending markets (Aave Horizon, Falcon, 3F/Morpho).
```

### Appendix: Investor Deposit Flow (ERC-7540 async)

The deposit path is **two-phase**: (1) the investor locks USDC into the PoolEscrow and registers a pending request, (2) on the next batch, the pool manager (3-of-8 Safe **or** EOA) sets a price and approves/issues against that price. Steps 1–3 are user-initiated; steps 4–7 are pool-manager-initiated; step 8 is again user-initiated. On Ethereum (the Hub chain), all Hub→Spoke calls execute synchronously inside the same transaction (no cross-chain async window). On non-Hub chains, the Hub→Spoke leg is bridged via Wormhole and is async.

```
INVESTOR DEPOSIT — ERC-7540 ASYNC FLOW (JAAA on Ethereum)

╭─── 1. ALLOWLIST (one-time) ──────────────────────────────────────────────╮
│  Pool Manager (Safe or EOA) → FullRestrictions hook 0x3C5E…80A7         │
│  .updateMember(investor) — KYC-gated, off-chain check happens upstream  │
╰──────────────────────────────────────────────────────────────────────────╯
                                  │
                                  ▼
╭─── 2. REQUEST DEPOSIT (investor) ────────────────────────────────────────╮
│  Investor → AsyncVault 0x4880…780b .requestDeposit(assets, ctrl, owner) │
│      → AsyncRequestManager 0xF482…761Ae .requestDeposit                 │
│          • pulls `assets` USDC from investor into PoolEscrow 0x0401…a52a│
│          • increments pendingDepositRequest[poolId][scId][user]         │
│          • emits DepositRequest message (Hub-chain handler)             │
╰──────────────────────────────────────────────────────────────────────────╯
                                  │
                                  ▼
╭─── 3. PENDING (no shares minted yet — investor holds a claim) ───────────╮
│  PoolEscrow now custodies the USDC.                                     │
│  No JAAA exists for this request until the manager processes the batch. │
╰──────────────────────────────────────────────────────────────────────────╯
                                  │
                       ── Daily off-chain step ──
                       Anemoy + Trident Trust
                       compute true fund NAV
                                  │
                                  ▼
╭─── 4. PUSH PRICE (pool manager) ── ★ UNBOUNDED ──────────────────────────╮
│  Manager → Hub 0xA4A7…1953 .updateSharePrice(                            │
│      poolId, scId, pricePoolPerShare, computedAt)                        │
│  → ShareClassManager 0xaFFC…9BEf .updateSharePrice                       │
│      • Checks: share class exists; computedAt ≤ block.timestamp          │
│      • NO upper bound, NO deviation cap, NO timelock                     │
│  → (if feeHook set) feeHook.accrue() — JAAA: not currently set           │
╰──────────────────────────────────────────────────────────────────────────╯
                                  │
                                  ▼
╭─── 5. NOTIFY SPOKE (same tx on Ethereum) ────────────────────────────────╮
│  Manager → Hub .notifySharePrice(poolId, scId, chainId)                 │
│  → MessageDispatcher 0xf837…30B27 .sendNotifyPricePoolPerShare           │
│      • chainId == localCentrifugeId  → SYNCHRONOUS:                     │
│           Spoke 0xEC35…525aB .updatePricePoolPerShare(...)              │
│           → AsyncRequestManager.priceLastUpdated set                    │
│           → convertToAssets() now returns new NAV immediately           │
│      • else → async cross-chain via Gateway + Wormhole adapter          │
╰──────────────────────────────────────────────────────────────────────────╯
                                  │
                                  ▼
╭─── 6. APPROVE BATCH (pool manager) ──────────────────────────────────────╮
│  Manager → Hub .approveDeposits(poolId, scId, pricePoolPerAsset)        │
│  Locks the price at which queued USDC will be converted into shares.    │
╰──────────────────────────────────────────────────────────────────────────╯
                                  │
                                  ▼
╭─── 7. ISSUE & FULFILL (pool manager) ────────────────────────────────────╮
│  Manager → Hub .issueShares(poolId, scId, navPerShare)                  │
│  → AsyncRequestManager .fulfillDepositRequest                            │
│      • Locks state.depositPrice per user (so price at fulfilment is     │
│        the price the user later mints against)                          │
│      • Increments maxMint[user] = pendingDepositRequest * 1/price       │
│      • Pending request cleared                                          │
╰──────────────────────────────────────────────────────────────────────────╯
                                  │
                                  ▼
╭─── 8. CLAIM SHARES (investor) ───────────────────────────────────────────╮
│  Investor → AsyncVault .mint(shares, receiver)                          │
│  → AsyncRequestManager .mint                                            │
│      • Computes assets-out = shares * state.depositPrice (locked)       │
│      • JAAA Tranche 0x5a0F…cf64 mints `shares` to receiver              │
│      • Subject to FullRestrictions hook (receiver must be allowlisted)  │
╰──────────────────────────────────────────────────────────────────────────╯

Price-update propagation summary:
  • On Ethereum (Hub chain): steps 4 + 5 land in ONE transaction.
    convertToAssets() and any fulfilment that follows use the new price
    in the same block. There is no inspection window.
  • Pending-batch users: get whatever price the manager sets in step 6
    (approveDeposits) and step 7 (issueShares) — also manager-chosen,
    also unbounded.
  • Already-minted JAAA: only affected via convertToAssets() readbacks
    (e.g., lending markets pricing collateral). The shares themselves
    are fungible ERC-20 — their *interpretation* changes, not balances.

Redemptions mirror this flow in reverse (requestRedeem →
approveRedeems → revokeShares → withdraw); the same manager-set
prices apply to each redeem batch.
```

### Appendix: Pool-Manager (Safe + EOA) Capability Matrix

Both the 3-of-8 Pool Manager Safe `0x742d…be1e` and the EOA `0x7bf090b9…02ec` are registered as managers for the JAAA pool on the current HubRegistry `0x19f46…ADE93` (`manager(poolId, addr) = true`, verified at block 24376421). They have **identical privileges** at the Hub level. The table below enumerates what either principal can do directly without further governance approval. "Bounds" refers to onchain validation only — offchain operational policy is not enforced by the contracts.

| # | Capability | Method (caller → contract) | Onchain bounds / checks | Reversibility | Worst-case if EOA key is compromised |
|---|---|---|---|---|---|
| 1 | **Set JAAA NAV to any value** | `Hub.updateSharePrice(poolId, scId, pricePoolPerShare, computedAt)` → `ShareClassManager.updateSharePrice` | Pool exists; `computedAt ≤ block.timestamp`. **No upper bound, no deviation cap, no timelock, no per-epoch limit.** | Irreversible for any fulfilment that prices against it. | Mis-price the fund up or down arbitrarily — convertToAssets, integrators (Aave Horizon, Falcon, 3F/Morpho) all consume the new value the same block on Ethereum. |
| 2 | **Notify Spoke of new price** | `Hub.notifySharePrice(poolId, scId, chainId)` → `MessageDispatcher.sendNotifyPricePoolPerShare` | Same-chain → synchronous `Spoke.updatePricePoolPerShare`. Cross-chain → async via Wormhole MultiAdapter. | Same as (1). | Propagates the mis-price to lending markets and to other chains. |
| 3 | **Approve a deposit batch at chosen price** | `Hub.approveDeposits(poolId, scId, pricePoolPerAsset)` | Manager-set price; pool exists. **No price bound.** | Irreversible once shares are issued in step (4). | Approve a self-deposit at near-zero USDC/JAAA price, minting huge JAAA against a small USDC outlay (combined with (1)/(4)). |
| 4 | **Issue (mint) shares against approved batch** | `Hub.issueShares(poolId, scId, navPerShare)` → `AsyncRequestManager.fulfillDepositRequest` | Approved batch exists; manager-set navPerShare. **No bound.** | Irreversible. | Mint JAAA tokens to depositors (themselves) far in excess of the USDC they queued. |
| 5 | **Approve a redeem batch at chosen price** | `Hub.approveRedeems(...)` | Manager-set price; pool exists. **No price bound.** | Irreversible once USDC is paid out in (6). | Pay out near-zero USDC for redeemed shares (other users' redeems get robbed). |
| 6 | **Revoke (burn) redeemed shares and pay USDC** | `Hub.revokeShares(...)` → `AsyncRequestManager.fulfillRedeemRequest` | Approved redeem batch exists. | Irreversible. | Pair with (5) for redemption value extraction. |
| 7 | **Force-cancel any investor's pending deposit** | `Hub.forceCancelDepositRequest(...)` | Pool-manager auth only. | Reversible — investor can re-request. | Eject pending investors before a price manipulation. |
| 8 | **Force-cancel any investor's pending redeem** | `Hub.forceCancelRedeemRequest(...)` | Pool-manager auth only. | Reversible. | Trap a redeem request indefinitely (combined with refusal to approve batches). |
| 9 | **Add or remove KYC'd holders** | `Hub.updateMember(...)` → FullRestrictions hook `0x3C5E…80A7` `.updateMember` | Pool-manager auth only. | Reversible. | Freeze specific holders (refuse to allowlist them, or block transfers). |
| 10 | **Update pool metadata / IPFS pointer** | `Hub.updateMetadata(...)` | Pool-manager auth only. | Reversible. | Misleading offchain pool documentation (low direct economic risk). |
| 11 | **Add or remove other pool managers (including itself)** | `Hub.updateHubManager(poolId, who, canManage)` → `HubRegistry.updateManager` | `_isManager(poolId)` only — **any current manager can grant or revoke manager status to any address**. No timelock, no governance check. (Verified onchain — `Hub.sol` source: function body is two lines, `_isManager(poolId); hubRegistry.updateManager(...)`.) | Reversible only if another manager is still authorized to revoke. If the EOA revokes the 3-of-8 Safe first, it becomes the sole authority and only Root (48h timelock) can remediate. | EOA unilaterally removes the 3-of-8 Safe and/or adds an attacker-controlled address as a co-manager; protocol-admin path (4-of-9 Safe → Root → `HubRegistry.rely`/`deny`) is the only recourse. |

**What the pool manager *cannot* do directly** (verified by reading Hub / Spoke / Tranche / Root source on Etherscan):

- **Drain PoolEscrow USDC arbitrarily.** USDC only leaves the escrow as part of an approved redeem batch (`revokeShares`) or as an authorized cross-chain transfer initiated by Spoke/Root, not by a raw withdraw. Mis-pricing a redeem batch is the indirect route.
- **Mint share tokens outside the AsyncRequestManager flow.** `JAAA.Tranche.mint()` is `auth`-gated and only **Spoke** and **Root** are currently wards on the JAAA share token (verified onchain via `cast call ... wards(addr)`: Spoke=1, Root=1; AsyncRequestManager=0, Hub=0, ProtocolAdminSafe=0). Hub managers therefore cannot mint directly — issuance can only happen via Spoke's batch-fulfilment routing in step 4 above.
- **Bypass the 48h Root timelock or Guardian pause.** Root ward changes, protocol upgrades, adapter swaps and TokenRecoverer authorization all go through Root, which the pool manager is not on.
- **Pause the protocol.** Pause/unpause are Guardian-only (`ProtocolGuardian` + `OpsGuardian`).
- **Mutate other pools.** All Hub functions in the table are scoped by `poolId` via `_isManager(poolId)`, which reads `HubRegistry.manager(poolId, msg.sender)`. JAAA's manager has no privileges on deJAAA or any other Centrifuge pool.

**Net summary.** The EOA cannot steal PoolEscrow USDC by direct withdrawal and cannot mint JAAA out of thin air bypassing AsyncRequestManager — but rows 1–6 are a *complete economic capture surface*, and row 11 means the EOA can also unilaterally elevate itself to sole-manager status (revoking the 3-of-8 Safe). Setting the price (or batch price) to arbitrary values, combined with the manager's own ability to queue and fulfill a deposit/redeem, is functionally equivalent to "mint to self / drain to self" within one batch cycle. The only mitigations are (a) offchain operational discipline at Anemoy, (b) post-hoc TokenRecoverer / Guardian-pause response (slow, requires the protocol-admin path), and (c) Yearn-side monitoring of the EOA address — especially `UpdateManager` events on the HubRegistry for poolId `281474976710663`.

---

## Risk Summary

### Key Strengths

- **Heavy and ongoing audit cadence:** 20+ V3 audits in 14 months from Cantina/Spearbit, yAudit/Electisec, BurraSec, xmxanuel, Recon, plus a Sherlock public contest — far above the median for tokenized-RWA protocols. Active Cantina bug bounty with $250k Critical payout.
- **Institutional-grade offchain stack:** Janus Henderson (subadvisor), Anemoy (BVI-regulated manager), StoneX (custodian), Trident Trust (administrator), MHA Cayman (auditor), Circle (crypto custody). The regulatory and operational counterparties are reputable and structurally separated.
- **Best-in-class collateral class for tokenized RWA:** AAA-rated floating-rate CLO tranches — top of the credit stack, low historical loss rates, large institutional secondary market.
- **Material onchain protection:** 48h Root timelock, Guardian pause (no delay), a single live 4-of-9 ProtocolAdminSafe (the legacy V3.0 4-of-8 path is `Deny`'d on Root at block 24376326), Wormhole-mediated cross-chain accounting with dispute window.
- **Significant institutional adoption:** Grove ($1B initial seed), Aave Horizon (~$100M in first week), Resolv (up to $100M leveraged), Falcon Finance, 3F/Morpho — demonstrates real demand and provides secondary liquidity routes via the deJAAA wrapper.

### Key Risks

- **EOA Pool Manager with unbounded NAV-push authority.** One of the JAAA pool's two registered managers is a single-key EOA ([`0x7bf090b9…02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec)); either principal can set NAV to any value with no bound or timelock, replace the other via `Hub.updateHubManager`, force-cancel investor requests, and modify the FullRestrictions allowlist. See **Critical Risks** below for the full capability surface.
- **NAV is admin-pushed, not onchain-derived.** Underlying CLOs are offchain, so a fully onchain proof-of-reserves is structurally impossible. Token holders trust Anemoy / Trident Trust to compute correct NAV and the Pool Manager Safe to push it faithfully. No Chainlink PoR or independent oracle.
- **Mint-without-backing is technically possible** via the share token's `mint(address,uint256)` (gated only by wards). Standard governance-key risk, mitigated by the 48h Root timelock but not eliminated for paths involving the Pool Manager Safe acting via the Hub.
- **Highly concentrated holder base.** rwa.xyz reports 23 holders globally; a single large redemption (e.g. Grove unwinding) could deplete the pool's USDC float, forcing Anemoy to either delay/partially fulfil the redemption per fund discretion or sell CLOs offchain in the secondary market — neither path is enforced onchain. Grove appears to have already drawn down a significant portion of its original $1B allocation (current aggregate JAAA NAV ~$437.9M as of 2026-05-28).
- **Multiple offchain trust principals.** A failure or adversarial action by Anemoy, Janus Henderson, StoneX, Trident Trust, or the BVI regulatory environment is an existential risk for token holders. None of these can be hedged onchain.
- **V3.1 is recent (Feb 2026)** and the V3.2 Onchain Portfolio Manager only audited Mar–Apr 2026. New code paths continue to ship.
- **Pool manager signer identities not publicly disclosed.** Standard for institutional-RWA, but reduces verifiability of "who can move my money."

### Critical Risks `[If Any]`

- **EOA Pool Manager — unbounded NAV-push and full pool-management API.** The current HubRegistry has an EOA pool manager [`0x7bf090b9…02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec) registered alongside the 3-of-8 Pool Manager Safe ([`0x742d…be1e`](https://etherscan.io/address/0x742d100011ffbc6e509e39dbcb0334159e86be1e)). Both have identical `_isManager(poolId)`-gated privileges. Either principal can call `Hub.updateSharePrice(poolId, scId, pricePoolPerShare, computedAt)` on the current Hub [`0xA4A7…1953`](https://etherscan.io/address/0xA4A7Bb3831958463b3FE3E27A6a160F764341953); the only checks in `ShareClassManager.updateSharePrice` are that the share class exists and that `computedAt <= block.timestamp`. **There is no upper bound, no deviation cap, no per-epoch limit, no timelock and no Guardian-pause-on-large-change.** The Spoke-side price is updated synchronously in the same Ethereum transaction via `Hub.notifySharePrice` (which calls `Spoke.updatePricePoolPerShare` directly when `chainId == localCentrifugeId`), so `AsyncRequestManager.convertToAssets()`, batch fulfilment prices and any third-party integrator (Aave Horizon, Falcon, 3F/Morpho, Resolv via deJAAA) consume the manipulated value immediately. Beyond NAV, the same `_isManager` gate also grants either principal: `Hub.updateHubManager` (revoke the other manager or grant it to any address — see Appendix row 11), `Hub.approveDeposits` / `approveRedeems` / `issueShares` / `revokeShares` at manager-chosen prices, `forceCancelDepositRequest` / `forceCancelRedeemRequest` against any investor, and `updateMember` on the FullRestrictions allowlist hook. A compromised single private key is sufficient to:
  1. set the price to a near-zero value before fulfilling a pending deposit the attacker has queued, minting excess JAAA against a small USDC outlay (shares_out = USDC / price);
  2. set the price to an arbitrarily high value before processing a pending redeem the attacker has queued, extracting excess USDC against a small share burn (USDC_out = shares × price);
  3. or, more subtly, drift the published NAV away from the true offchain NAV indefinitely.
  This is **not** treated as a Critical-Gate auto-fail (the 48h Root timelock, 4-of-9 ProtocolAdminSafe and Guardian pause still constrain protocol-level upgrades; PoolEscrow USDC is not directly drainable), but it is the single largest operational risk on JAAA and the dominant reason this report sits in the upper end of Medium Risk. Yearn integrations should monitor every outgoing transaction from the EOA in real time and treat *any* call into `Hub`, `AsyncRequestManager` or `Spoke` from it as an incident. See the Appendix capability table for the full set of EOA powers.

---

## Risk Score Assessment

**Scoring Guidelines:**

- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — FAIL → not triggered (20+ audits from multiple top firms).
- [x] **Unverifiable reserves** — FAIL → not triggered. Reserves are offchain but verifiable through a chain of regulated attestation (BVI FSC → Anemoy → MHA Cayman audit → Trident Trust admin → StoneX custody). Comparable to Paxos USDG / Superstate USTB in transparency model.
- [x] **Total centralization** — FAIL → not triggered for protocol-level governance. Root is controlled by a 4-of-9 ProtocolAdminSafe behind a 48h timelock + Guardian pause. **However**, the JAAA pool itself has an EOA as one of two registered pool managers, with unbounded NAV-push authority (see Critical Risks above). This does not trip the auto-fail gate (protocol-level admin is multi-sig + timelocked and PoolEscrow USDC is not directly drainable), but it materially elevates Centralization scoring.

**All gates pass** → proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

- **Coverage:** 20+ V3 audits from Cantina/Spearbit (top firm), yAudit/Electisec (top firm), BurraSec, xmxanuel, Recon, plus Sherlock public contest. Five+ engagements by reputable firms.
- **Bug bounty:** Active Cantina program, $250k max Critical. This sits between the $200K bracket (score 2) and $1M bracket (score 1).
- **Surface area:** Multi-chain protocol with Hub/Spoke, async ERC-7540, double-entry onchain accounting, transfer hooks — moderate-to-high complexity.

→ **Subcategory A score: 2.0** (well above the "2+ audits by reputable firms" floor and bounty meets the $200K+ tier; complexity offsets pushing toward 1.0).

**Subcategory B: Historical Track Record**

- **Time in production:** Centrifuge V3 ~10 months (since July 2025); JAAA share class ~12 months since fund inception (May 2025). Falls in the 6–12 month bracket.
- **Scale:** Centrifuge protocol-wide TVL has sustained >$1B since late 2025 (current $1.38B, peak $1.99B 2026-04-24). JAAA itself peaked above $1B AUM and currently sits at ~$437.9M aggregate NAV across chains.
- **Incidents:** None.

→ **Subcategory B score: 2.0** — production duration is at the upper end of 6–12 months trending toward 1–2 years; sustained TVL >$1B at protocol level easily satisfies the "$50M+" threshold (and arguably the "$100M+ sustained" threshold for score 1). Score capped at 2 because V3 itself is <1 year old.

**Audits & Historical Score = (2.0 + 2.0) / 2 = 2.0**

**Score: 2.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- One live ProtocolAdminSafe (4-of-9) behind a 48h Root timelock + Guardian Zodiac delay (docs cite ~24h, not verified onchain). V3.0 Guardian denied on Root at block 24376326 — no dual-Safe issue.
- Pool Manager (Hub-level) has **two registered principals**: a 3-of-8 Safe **and** an EOA (`0x7bf090b9…`). The EOA path means a single-key compromise is sufficient to set NAV / issue shares for JAAA — strictly worse than the Safe-only assumption.
- Privileged roles (mint, freeze, force-cancel, recover) exist but are gated through the timelocked Root or the pool manager. Critical actions (Root upgrade) are timelocked; routine actions (price push) are not.

→ **Subcategory A: 3.5** — 4-of-9 governance with 48h timelock is healthy for *protocol-level* admin, but the pool-manager EOA path is the dominant daily centralization risk: a single private key has NAV-push authority with no bound, no cap and no timelock. This pulls the subcategory firmly into the 4 ("Multisig (3-5)/admin keys; No real timelock for routine actions; Significant admin powers") side of the rubric, partly offset by the timelocked Root above it.

**Subcategory B: Programmability**

- **NAV/price is fully admin-controlled with no bounds.** Either pool-manager principal (3-of-8 Safe or EOA `0x7bf090b9…`) can call `Hub.updateSharePrice(poolId, scId, pricePoolPerShare, computedAt)` to set the JAAA NAV to **any** value. `ShareClassManager.updateSharePrice` only checks that the share class exists and that `computedAt <= block.timestamp` — there is no upper bound, no deviation cap, no per-epoch limit and no timelock. The Spoke-side price is updated synchronously on Ethereum in the same transaction via `Hub.notifySharePrice` (which calls `Spoke.updatePricePoolPerShare` directly when chain-id matches), so `convertToAssets()` and batch-fulfilment prices reflect the new value immediately.
- Issuance/redemption is async — the pool manager approves batches at prices the manager itself sets (`approveDeposits/approveRedeems → issueShares/revokeShares`), not fully programmatic.
- Onchain accounting layer (BalanceSheet) is programmatic; underlying valuation is not. JAAA is not routed through the V3.2 SimplePriceManager / NAVManager (`navHook(poolId) = 0x0`), so the only price input is the manager push.
- No transparency on parameter changes beyond raw onchain events; no public preview/queue of price updates before they land.

→ **Subcategory B: 5.0** — matches the row-5 rubric ("Fully custodial/centralized operations; Admin-controlled rate, no transparency"). NAV is the single most important parameter for any RWA token, and it is set by an admin call (one of which is an EOA private key) with **no programmatic guardrails of any kind**. The presence of an onchain accounting layer below the price push does not mitigate this — it just records the manipulated price faithfully.

**Subcategory C: External Dependencies**

- Wormhole (single bridge), USDC (single stablecoin), Janus Henderson + Anemoy + StoneX + Trident Trust + MHA Cayman + Circle (offchain stack) — multiple critical dependencies, several being newer institutional partnerships (Anemoy onchain ~12 months).
- Several of the dependencies (StoneX custody, Janus Henderson management) are battle-tested in TradFi.
- Cross-chain settlement entirely Wormhole-dependent.

→ **Subcategory C: 3.5** (between "2-3 established dependencies" and "many or newer protocol dependencies"; the institutional offchain dependencies are mature, but the onchain dependency on Wormhole as sole adapter justifies pushing toward 4).

**Centralization Score = (3.5 + 5.0 + 3.5) / 3 ≈ 4.0**

**Score: 4.0/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- 100% backed by AAA CLO portfolio, custody at StoneX (regulated U.S. broker-dealer). Offchain assets.
- AAA CLOs are high-quality but not blue-chip onchain assets like ETH/WBTC.
- Backing verifiable via periodic Trident Trust NAV + MHA Cayman audit; not real-time onchain.
- Falls between row 3 ("100% collateral, some offchain; mixed/newer protocols; periodic custodian attestation") and row 2 (high-quality DeFi assets, mostly onchain).

→ **Subcategory A: 3.0** — onchain backing chain depends entirely on the regulated offchain attestation, but the asset class is genuinely high-quality and custody is institutional.

**Subcategory B: Provability**

- Reserves are **primarily offchain**. Onchain Tools verify only that the pool manager has pushed a price, not that the price reflects true NAV.
- Reporting: Trident Trust Cayman computes NAV **daily** (required to support the fund's daily subscription/redemption design per the [JAAA factsheet](https://gateway.pinata.cloud/ipfs/QmcWwvqnoUkH1bMYktnMdEywmUkUeK3PPex2i763zVNUmm) and the [Anemoy fund page](https://www.anemoy.io/funds/jaaa)). The Pool Manager pushes that daily NAV onchain via `Hub.updateSharePrice` — verified onchain by sampling `AsyncRequestManager.priceLastUpdated(vault)` over multiple sessions (each reading advances ~24h on the next business day). Anemoy publishes investor-facing factsheets **monthly**. No Chainlink PoR or independent onchain attestation.
- Verification: regulated administrator + auditor; no third-party onchain attestation.
- Matches row 3 ("Hybrid onchain/offchain; Manual reporting by admins; Known custodian attestation").

→ **Subcategory B: 3.0** (slightly worse than 3 due to lack of public per-issuer holdings disclosure, but the institutional attestation chain is the typical TradFi-RWA model and is the highest quality available in this asset class).

**Funds Management Score = (3.0 + 3.0) / 2 = 3.0**

**Score: 3.0/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- **Direct redemption:** Daily through Anemoy, NAV-based, USDC-settled. Async — typically T+1 once redemption batch is processed; full settlement subject to fund-level liquidity.
- **Liquidity depth:** Aave Horizon position-unwind, Falcon Finance, Resolv, 3F/Morpho provide secondary exit routes (denominated via the deJAAA wrapper).
- **Large holder impact:** With only 23 holders globally and ~$437.9M aggregate NAV, a single $50M+ redemption is plausible and could exceed the pool's float, forcing CLO secondary sales over multiple days.
- **Stress behavior:** Untested through any market dislocation since launch (May 2025). AAA CLOs would historically widen but remain saleable in stress.
- Best fit: row 3 ("Market-based or short queues; >$1M, 1-3% slippage; 3-7 days for full exit") with a yield-bearing-asset exception (longer exit times acceptable).

→ **Score: 3.0** — adequate for normal flows; concentration and untested stress behavior keep it from a 2.

**Score: 3.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- **Team transparency:** Centrifuge team is fully public (Lucas Vogelsang, CEO; Martin Quensel, co-founder). Anemoy and Janus Henderson are public institutional entities with named portfolio managers.
- **Documentation:** Excellent for the Centrifuge protocol (developer + user docs, architecture pages, every audit posted to GitHub). The JAAA fund itself is also transparently disclosed — the full 21-position CLO portfolio with CUSIP/ISIN/market-value/% is in the public pool-metadata IPFS; the Anemoy fund page and monthly factsheet are public.
- **Legal:** BVI Professional Fund issued by Anemoy Capital SPC Limited (regulated by the BVI FSC), Centrifuge Network Foundation (Switzerland). Both are established legal entities with clear jurisdiction.
- **Audit cadence on the protocol code:** Heavy and ongoing (20+ engagements, see Category 1).

→ **Subcategory score: 1.5** — every transparency dimension (team, docs, holdings, legal) is fully public and well-documented. The remaining friction (Pool Manager signer identities not published; investor letters not public) is standard for institutional-RWA and keeps this from a perfect 1.0.

**Score: 1.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 4.0 | 30% | 1.20 |
| Funds Management | 3.0 | 30% | 0.90 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **3.03/5.0** |

**Optional Modifiers:**

- Protocol live >2 years with no incidents: **not eligible** (V3 is ~10 months old).
- TVL maintained >$500M for >1 year: **not eligible** at JAAA level (Grove redemption has brought aggregate NAV from $1B at launch to ~$437.9M as of 2026-05-28); protocol-level TVL >$1B has been sustained <1 year. No modifier applied.

**Final Score: 3.03/5.0** — sits in the upper end of the **Medium Risk** band (2.5–3.5), pulled there primarily by the EOA pool-manager + unbounded NAV-push capability documented in the Critical Risks subsection. If the EOA were removed from the HubRegistry and NAV updates were routed through a multisig (or the onchain `NAVManager` / `SimplePriceManager` were initialized for the JAAA pool), Programmability would compress from 5 to ~3 and the overall score would fall back toward 2.50–2.65.

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

## Reassessment Triggers

- **Time-based:** Reassess in **6 months** (or earlier if V3.2 or any V3.x major release ships).
- **TVL-based:** Reassess if aggregate JAAA NAV moves by **±30%** within a 30-day window, or if Centrifuge protocol TVL drops below $500M.
- **Governance:** Reassess on any new `Rely` on Root (new admin principal), any change to the current ProtocolAdminSafe threshold/signer set, or any `UpdateManager` event on the current HubRegistry [`0x19f46…ADE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93) for poolId `281474976710663` (add/remove of a JAAA Pool Manager — Safe or EOA).
- **Pricing:** Reassess if the JAAA pool migrates to V3.2's onchain `NAVManager`/`PriceManager`, or conversely if the NAV stops being refreshed at least every 48 hours during business days.
- **Counterparty:** Reassess on any material change to Anemoy, Janus Henderson sub-advisory, StoneX custody, Trident Trust administration, or MHA Cayman audit relationships.
- **Incident-based:** Reassess after any Centrifuge protocol exploit, any pause event, any token recovery action via `TokenRecoverer`, or any depeg / NAV-discontinuity > 1%.
