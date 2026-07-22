# Protocol Risk Assessment: Centrifuge JAAA

- **Assessment Date:** May 28, 2026 (Updated: July 14, 2026)
- **Token:** JAAA (Janus Henderson Anemoy AAA CLO Fund Token)
- **Chain:** Ethereum
- **Token Address:** [`0x5a0F93D040De44e78F251b03c43be9CF317Dcf64`](https://etherscan.io/address/0x5a0F93D040De44e78F251b03c43be9CF317Dcf64)
- **Final Score: 2.60/5.0**

## Overview + Links

JAAA is the tokenized form of the **Janus Henderson Anemoy AAA CLO Fund** — a regulated BVI Professional Fund that holds a portfolio of **AAA-rated, floating-rate Collateralized Loan Obligation (CLO) tranches**. The strategy is managed by **Anemoy Capital SPC Limited** (manager / issuer of record) and sub-advised by **Janus Henderson** ([Anemoy fund page](https://www.anemoy.io/funds/jaaa)), drawing on the same portfolio team that runs Janus Henderson's ~$21B AAA CLO ETF.

The fund is brought onchain via **Centrifuge V3** (the protocol's Hub-and-Spoke EVM stack). The deployment under assessment is the **transfer-restricted** share class JAAA, deployed on Ethereum (poolId `281474976710663`). Investor flow is asynchronous (ERC-7540 style): an investor submits a deposit request through the `AsyncVault`, Anemoy/Centrifuge processes subscriptions daily, and the investor claims share tokens. Redemption mirrors this in reverse, settled in USDC. JAAA is the **accumulating** version (NAV grows over time; no distributions).

> **Note — Centrifuge JAAA ≠ NYSE JAAA.** The Janus Henderson "JAAA" ticker on NYSE Arca is a separate **US-listed ETF** (open-end 40-Act fund, ~$21B AUM). Centrifuge JAAA is the **BVI Professional Fund** issued by Anemoy Capital SPC Limited (non-US Professional Investors only, KYC-gated). The two share a **sub-advisor and investment mandate** (the same Janus Henderson Global Securitized team, AAA-rated floating-rate CLO tranches) but they are different legal entities holding their own specific tranches. Centrifuge JAAA holds **CLO debt instruments directly** (36 positions in the current metadata), **not** shares of the NYSE JAAA ETF. Daily marks on the two products can legitimately diverge.

Current onchain values:

- **Onchain NAV:** ~1.040903 USDC per JAAA (verified via `AsyncRequestManager.convertToAssets()` at block 25,532,014; price last updated 2026-07-13 12:00 UTC)
- **Ethereum token supply:** ~357.61M JAAA from `totalSupply()`; [rwa.xyz](https://app.rwa.xyz/assets/JAAA) reports ~164.26M circulating on Ethereum and ~661.18M circulating across all networks. The difference reflects tokens held in bridge/escrow addresses and should not be read as additional fund NAV.
- **Total cross-chain JAAA asset value:** **~$688.24M** ([rwa.xyz](https://app.rwa.xyz/assets/JAAA), 2026-07-14)
- **Centrifuge protocol TVL (DefiLlama):** **~$1.638B** current; peak **~$1.991B** on 2026-04-24 ([DefiLlama](https://defillama.com/protocol/centrifuge))
- **Management fee / expense ratio:** **0.50%** p.a. in the current onchain pool metadata and on [rwa.xyz](https://app.rwa.xyz/assets/JAAA). **Performance fee:** 0%. The April 2025 factsheet's 0.40% management-fee figure is treated as superseded.
- **Settlement:** Daily subscriptions and redemptions, **usually T+3** per factsheet
- **Holders (Ethereum + multichain):** 32 onchain holders per rwa.xyz — institutional only
- **Holdings (offchain CLO portfolio):** **36 CLO positions, ~$673.61M total market value** per the current onchain [JAAA pool metadata IPFS](https://ipfs.io/ipfs/bafkreifdw6nqnafeerd4xgmuyhad7jhzu6prd77lr2fmxvll3ax6soym5m) pointer. No cash row is present in this snapshot. The ~2.1% gap to rwa.xyz's asset value is consistent with different reporting times and fund-level cash/liabilities. Top three positions are **Ares Loan Funding II (4.9%)**, **CTM CLO 2025-2 (4.8%)**, and **Madison Park Funding XXX (4.6%)**.
- **Target APY:** 4.26% (current metadata) | **7-day APY:** 3.53% | **30-day APY:** 3.93% ([rwa.xyz](https://app.rwa.xyz/assets/JAAA), 2026-07-14)
- **Third-party rating:** **Particula AAA** ([per current onchain pool metadata](https://ipfs.io/ipfs/bafkreifdw6nqnafeerd4xgmuyhad7jhzu6prd77lr2fmxvll3ax6soym5m))
- **Minimum initial investment:** $500,000 USDC (per on-chain pool metadata)

A separate, **freely-transferable** wrapper of the same fund — **deJAAA** ([`0xAAA0008C8CF3A7Dca931adaF04336A5D808C82Cc`](https://etherscan.io/address/0xAAA0008C8CF3A7Dca931adaF04336A5D808C82Cc), poolId `281474976710659`) — exists for permissionless DeFi integrations. deJAAA has total supply ~5.65M tokens (18 decimals) and a live vault conversion rate of ~1.039397 USDC/deJAAA. This report focuses on the KYC-gated JAAA primary share class but documents deJAAA where relevant.

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
- [JAAA pool metadata (IPFS, current HubRegistry pointer)](https://ipfs.io/ipfs/bafkreifdw6nqnafeerd4xgmuyhad7jhzu6prd77lr2fmxvll3ax6soym5m)

## Contract Addresses

### JAAA Pool (poolId 281474976710663) — Transfer-restricted

| Contract | Address | Type |
|----------|---------|------|
| JAAA Share Token | [`0x5a0F93D040De44e78F251b03c43be9CF317Dcf64`](https://etherscan.io/address/0x5a0F93D040De44e78F251b03c43be9CF317Dcf64) | `Tranche` ERC-20 (6 decimals, ERC-1404-compatible) |
| AsyncVault | [`0x4880799ee5200fc58da299e965df644fbf46780b`](https://etherscan.io/address/0x4880799ee5200fc58da299e965df644fbf46780b) | ERC-7540 entry/exit |
| Transfer Hook | [`0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7`](https://etherscan.io/address/0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7) | `FullRestrictions` (allowlist) |
| PoolEscrow (JAAA) | [`0x040170aA9AAa916c2e8135777a31f17C440BA52a`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a) | Pool-specific escrow |
| Underlying asset | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | USDC |
| Pool Manager MPC | [`0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec) | **Sole current JAAA Hub manager**; Fordefi multiuser MPC with a high approval threshold per Centrifuge's written attestation |
| Former Pool Manager Safe | [`0x742d100011ffbc6e509e39dbcb0334159e86be1e`](https://etherscan.io/address/0x742d100011ffbc6e509e39dbcb0334159e86be1e) | Gnosis Safe, 3-of-8; removed as JAAA manager on 2026-06-19 in [tx `0xe82f…fc7`](https://etherscan.io/tx/0xe82f7d4a7f0616bc3b792444f233e18cb55f1b05a7238d0758ef8871ce8bbfc7) |

### Centrifuge V3 Core (shared)

| Contract | Address | Role |
|----------|---------|------|
| Root | [`0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f`](https://etherscan.io/address/0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f) | Protocol-level admin; **48h timelock** (`delay()` = 172800 s) on `executeScheduledRely`; can pause/unpause |
| Spoke | [`0xEC3582fcDc34078a4B7a8c75a5a3AE46f48525aB`](https://etherscan.io/address/0xEC3582fcDc34078a4B7a8c75a5a3AE46f48525aB) | Local share/vault registry on Ethereum |
| Hub (current, V3.1+) | [`0xA4A7Bb3831958463b3FE3E27A6a160F764341953`](https://etherscan.io/address/0xA4A7Bb3831958463b3FE3E27A6a160F764341953) | Canonical Hub per [Centrifuge deployments docs](https://docs.centrifuge.io/developer/protocol/deployments/); the JAAA pool is registered here (confirmed via `HubRegistry.exists()` + `UpdateManager` event at block 24376421) |
| Hub (V3.0, legacy) | [`0x9c8454A506263549f07c80698E276e3622077098`](https://etherscan.io/address/0x9c8454A506263549f07c80698E276e3622077098) | Original V3.0 Hub — still onchain and referenced by `ProtocolGuardian (V3.0).hub()` |
| HubRegistry (current, V3.1+) | [`0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93) | Authoritative live registry. JAAA currently has **one** manager: Fordefi MPC `0x7bf090b9…02ec`. The former 3-of-8 Safe is `false` in `manager(poolId,address)` after its 2026-06-19 removal. |
| HubRegistry (legacy) | [`0x12044ef361Cc3446Cb7d36541C8411EE4e6f52cb`](https://etherscan.io/address/0x12044ef361Cc3446Cb7d36541C8411EE4e6f52cb) | Original V3.0 HubRegistry — JAAA pool data still exists onchain, but the current Hub does **not** consult this registry. Manager-change monitoring should target the current registry above. |
| AsyncRequestManager | [`0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae`](https://etherscan.io/address/0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae) | ERC-7540 deposit/redeem flow + price cache (`priceLastUpdated`, `convertToAssets`) |
| BalanceSheet | [`0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e`](https://etherscan.io/address/0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e) | Double-entry onchain accounting layer (V3.1+) |
| NAVManager (V3.1.x onchain-PM) | [`0x493b6C8ccC7BfD43c5a20C4F2C648701f74E9130`](https://etherscan.io/address/0x493b6C8ccC7BfD43c5a20C4F2C648701f74E9130) | Listed under the [V3.1.0 deployment](https://docs.centrifuge.io/developer/protocol/deployments/) but **not initialized for JAAA** (`initialized(281474976710663, 1) = false`, `navHook(poolId) = 0x0`). [`v3.2.0`](https://github.com/centrifuge/protocol/releases/tag/v3.2.0) was released on 2026-07-08, but no `deploy-mainnet-v3.2-*` tag was present at this reassessment and JAAA remains on manager-pushed pricing. |
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

Proxy/implementation review was also refreshed for the material JAAA token, vault, Root, Spoke, Hub, HubRegistry, AsyncRequestManager, BalanceSheet, and MultiAdapter. None has a nonzero EIP-1967 implementation slot; the report therefore does not attribute an undisclosed EIP-1967 proxy admin to these contracts. Safe proxies are documented separately by their live thresholds and owner sets.

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

**Contract complexity:** Centrifuge V3 is a **complex multi-chain protocol** — Hub/Spoke contract pair on every supported chain, async ERC-7540 vault flow with separate request manager, double-entry onchain accounting layer, three transfer-hook variants, plus pool-specific managers. Surface area is large relative to a single-chain ERC-4626.

### Bug Bounty

- **Cantina**: Active program with **$250,000 max payout** for Critical findings (High $50k, Medium $5k). Started July 17, 2025. ~466 findings to date. [Cantina – Centrifuge bounty](https://cantina.xyz/bounties/6cc9d51a-ac1e-4385-a88a-a3924e40c00e)

## Historical Track Record

- **Centrifuge V3 launch:** July 24, 2025 (multichain) ([Centrifuge blog](https://centrifuge.io/blog/centrifuge-v3-multichain-launch)). **Just under 12 months in production** as of July 14, 2026.
- **V3.1 launch:** February 11, 2026 — adds Optimism, HyperEVM, Monad. The new HubRegistry [`0x19f46…ADE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93) became the authoritative registry; JAAA pool was registered there at block 24376421 ([`UpdateManager` event tx](https://etherscan.io/tx/0x499ec04a42f6f4a961be5333f2d58db0538a8503cc058bb8b63fd9ca0fd5b9f8)). ([Centrifuge blog](https://centrifuge.io/blog/centrifuge-v3-1))
- **V3.1.x Onchain Portfolio Manager (mainnet) / v3.2.0 (released, not activated for JAAA):** `NAVManager` and `SimplePriceManager` are deployed under V3.1.0. The expanded [`v3.2.0`](https://github.com/centrifuge/protocol/releases/tag/v3.2.0) onchain-PM release shipped on 2026-07-08, but no `deploy-mainnet-v3.2-*` tag was present at this reassessment. More importantly, JAAA is still not routed through either price manager: `initialized(281474976710663, 1) = false`, `navHook(poolId) = 0x0`, and `SimplePriceManager.pricePoolPerShare(poolId) = 1e18` (default). JAAA's price therefore remains pushed by the sole Fordefi pool manager.
- **JAAA fund inception (offchain):** May 1, 2025. ([rwa.xyz](https://app.rwa.xyz/assets/JAAA))
- **JAAA public onchain launch:** June 25, 2025 with a **$1B seed allocation from Grove** (Sky-incubated credit infrastructure protocol). ([Centrifuge blog](https://centrifuge.io/blog/centrifuge-janus-henderson-grove-tokenized-aaa-clo-fund) · [Businesswire](https://www.businesswire.com/news/home/20250624393365/en/Grove-Announces-Launch-of-Institutional-Grade-Credit-Infrastructure-DeFi-Protocol-with-%241-Billion-Allocation-to-Tokenized-Janus-Henderson-Anemoy-AAA-CLO-Strategy))
- **Peak TVL (Centrifuge protocol-wide):** ~$1.991B on 2026-04-24; current **~$1.638B** on 2026-07-14 ([DefiLlama](https://defillama.com/protocol/centrifuge)).
- **JAAA AUM history:** $1B seed allocation at launch (June 2025), ~$437.9M aggregate asset value on 2026-05-28, and **~$688.24M on 2026-07-14** ([rwa.xyz](https://app.rwa.xyz/assets/JAAA)). This is a volatile institutional allocation history rather than a one-way decline.
- **Security incidents:** **None reported** on Centrifuge V3 contracts. (No incident reports on Centrifuge's [security page](https://centrifuge.io/security) or in public disclosures searched.)
- **Peg / NAV stability:** Onchain NAV reflects fund accumulation (1.000 → 1.034 USDC over ~12 months), consistent with the fund's targeted ~5% AAA-CLO yield.

## Funds Management

### Accessibility

- **Who can subscribe:** Non-U.S. professional/institutional investors only. JAAA is a regulated **BVI Professional Fund**; subscription requires KYC/AML through Anemoy. ([rwa.xyz](https://app.rwa.xyz/assets/JAAA))
- **Onchain mechanics:** Asynchronous ERC-7540-style flow:
  1. Whitelisted investor calls `AsyncVault.requestDeposit(assets, controller, owner)` and the USDC enters the pool escrow.
  2. The pool operator (Anemoy back-office / Fordefi pool-manager MPC) calls `Hub.approveDeposits` and `Hub.issueShares` to allocate JAAA at the most recent NAV.
  3. Investor calls `AsyncVault.mint(shares, receiver, controller)` to claim shares.
  Redemption mirrors this in reverse (`requestRedeem` → operator processes → `withdraw`).
- **Atomicity:** **Not atomic.** Subscriptions and redemptions are processed in **daily** batches; investor must come back to claim. Settlement currency is USDC. Per the [factsheet](https://gateway.pinata.cloud/ipfs/QmcWwvqnoUkH1bMYktnMdEywmUkUeK3PPex2i763zVNUmm), settlement is "usually T+3".
- **Minimum investment:** $500,000 USDC (per on-chain pool metadata).
- **Force-cancel powers:** `AsyncRequestManager` exposes `forceCancelDepositRequest` and `forceCancelRedeemRequest` (auth-gated; callable through the Hub by the pool manager). This allows the pool manager to unwind a pending request without investor signature.
- **Transfer restriction:** Share-to-share transfers on the JAAA token are gated by the `FullRestrictions` hook ([`0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7`](https://etherscan.io/address/0x3C5E7B28c4fF6F0bc8d9A9587992E96401e680A7)) — only allowlisted addresses can hold or receive JAAA. The allowlist is managed by Anemoy / the pool manager (via `Spoke.updateRestriction` → hook).
- **Fees:** Current metadata and rwa.xyz report management fee / expense ratio of 0.50% p.a. and performance fee of 0%; no subscription/redemption fee is encoded onchain. Gas on each user-initiated request applies normally.

### Token Mint Authority

**Mint mechanism:** Role-gated `auth` (MakerDAO-style `wards` access control). `JAAA.Tranche` inherits `ERC20.mint(address,uint256) public virtual auth` from `src/misc/ERC20.sol` in [centrifuge/protocol](https://github.com/centrifuge/protocol/blob/main/src/misc/ERC20.sol); the `auth` modifier requires `wards[msg.sender] == 1`.

**Mint requires backing:** **No** at the token-contract level. The standard happy-path mint (Anemoy fulfilling a deposit batch) does flow against USDC that was previously escrowed into [`PoolEscrow`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a) by the investor's `requestDeposit`, but that backing check lives in `AsyncRequestManager.fulfillDepositRequest`, not in `Tranche.mint`. A privileged ward can call `Tranche.mint` directly with no USDC transfer.

**Per-address mint authority** (verified onchain 2026-07-14 by enumerating all `Rely`/`Deny` events and checking current `wards(address)` state):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0xEC3582fcDc34078a4B7a8c75a5a3AE46f48525aB`](https://etherscan.io/address/0xEC3582fcDc34078a4B7a8c75a5a3AE46f48525aB) | ✓ | ✓ | Spoke, `wards=1` | Routes all production minting from `AsyncRequestManager.fulfillDepositRequest` / batch fulfilment |
| [`0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f`](https://etherscan.io/address/0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f) | ✓ | ✓ | Root, `wards=1` | Master ward; 48h timelock on `scheduleRely` / `executeScheduledRely` before any new ward can be added |
| [`0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e`](https://etherscan.io/address/0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e) | ✓ | ✓ | BalanceSheet, `wards=1` | Can call the share token directly; its pool-scoped `issue`/`revoke` functions are delegated to four current JAAA BalanceSheet managers |

The four live JAAA BalanceSheet managers are two Gnosis Safes ([`0x02eb…5bc7`](https://etherscan.io/address/0x02ebc43f723b4b5e433fe7edb6d9475f13f75bc7), 2-of-7; [`0x5684…5bfa`](https://etherscan.io/address/0x5684d912f0eb115ff6538c680ff00a5088035bfa), 3-of-4), one EOA ([`0x42b7…208f`](https://etherscan.io/address/0x42b71ced90c43c7ab3cfc5e975e9502884c2208f)), and a JAAA-specific trusted-call gateway ([`0xf8b1…ece7`](https://etherscan.io/address/0xf8b1e652453b3c2f0d378a0f7cdac1dee138ece7)). They can reach token issuance through `BalanceSheet.issue`; this is a distinct route from the Hub manager's `Hub.issueShares` path. Other checked addresses—including AsyncRequestManager, Hub, ProtocolAdminSafe, the former 3-of-8 pool-manager Safe, and Fordefi—are not direct token wards.

**Rate limits / supply caps:** `ERC20.mint` enforces `require(totalSupply <= type(uint128).max, ExceedsMaxSupply())` — effectively unlimited at 6 decimals (~3.4×10²² JAAA). No per-block rate limit, no per-minter cap, no Guardian-pause-on-mint.

**Backing check at mint time:** **None at the `Tranche.mint` level.** The fulfilment path enforces "approved deposits ≤ escrowed USDC" inside `AsyncRequestManager`, but that's a procedural invariant of one specific code path — a compromised Spoke or Root caller can mint outside that path. This is the basis for the "Mint without backing is technically possible" risk flagged in Key Risks; the standard 48h Root timelock and the wards model are the only mitigations.

### Collateralization

- **Backing:** 1:1 by the **Janus Henderson Anemoy AAA CLO Fund** — a portfolio of AAA-rated, floating-rate CLO tranches. Cash and short-duration AAA CLO debt of multiple underlying CLO issuers.
- **Specific CLO holdings (issuer mix):** **36 CLO positions totaling ~$673.61M** per the public [current onchain pool metadata](https://ipfs.io/ipfs/bafkreifdw6nqnafeerd4xgmuyhad7jhzu6prd77lr2fmxvll3ax6soym5m), with CUSIP/ISIN/ticker/market-value/% for each position. This snapshot has no cash row. Its value is ~2.1% below rwa.xyz's ~$688.24M total asset value, a reasonable timing and fund-level cash/liability difference. Independent per-tranche verification still requires an institutional pricing service. Top five:
  - ARES LOAN FUNDING II LTD (ARES 2022-ALF2A) — $33.00M / 4.9%
  - CTM CLO 2025-2 LTD — $32.02M / 4.8%
  - MADISON PARK FUNDING XXX LTD (MDPK 2018-30A) — $30.85M / 4.6%
  - AMMC CLO 27 LTD (AMMC 2022-27A) — $30.00M / 4.5%
  - CBAM 2017-1 LTD (CBAMR 2017-1A AR2) — $29.32M / 4.4%
- **Asset quality:** 100% AAA tranches at the senior end of the CLO capital stack. The portfolio is diversified across 36 positions; no position exceeds 4.9% in the current metadata. Third-party rating: **Particula AAA** ([pool metadata](https://ipfs.io/ipfs/bafkreifdw6nqnafeerd4xgmuyhad7jhzu6prd77lr2fmxvll3ax6soym5m)).
- **Custody / service providers (offchain):**
  - **Custodian / traditional broker:** J.P. Morgan per [rwa.xyz](https://app.rwa.xyz/assets/JAAA), replacing the earlier StoneX disclosure.
  - **Fund administrator:** Trident Trust **Cayman** (per [factsheet](https://gateway.pinata.cloud/ipfs/QmcWwvqnoUkH1bMYktnMdEywmUkUeK3PPex2i763zVNUmm) and [current pool metadata](https://ipfs.io/ipfs/bafkreifdw6nqnafeerd4xgmuyhad7jhzu6prd77lr2fmxvll3ax6soym5m))
  - **Auditor:** MHA Cayman
  - **Crypto-asset custodian:** Circle (per rwa.xyz)
  - **Regulator:** BVI Financial Services Commission (FSC) — fund is an open-ended BVI Professional Fund

  Note on jurisdictions: the *fund* is BVI-domiciled and BVI-regulated, but the *administrator* and *auditor* are Cayman-based. This is common for BVI funds and not in itself a red flag.
- **Onchain backing in PoolEscrow:** [`0x040170aA9AAa916c2e8135777a31f17C440BA52a`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a) held **~6.04 USDC** at block 25,532,014. This is operational settlement float, not the reserves backing the share supply. The vast majority of NAV is offchain in CLO instruments under J.P. Morgan custody.
- **Risk curation:** Investment policy (AAA-only, floating-rate, duration limits) is set by Anemoy as fund manager and supervised under the BVI Securities and Investment Business Act. There is no onchain liquidation mechanism — share NAV is set by the offchain fund net asset value computation.

### Provability

- **Share price source:** `AsyncRequestManager.convertToAssets()` returned **1.040903 USDC/JAAA** at block 25,532,014. This is a cached manager push, not a real-time onchain computation; `priceLastUpdated(vault)` was 2026-07-13 12:00 UTC.
- **Who publishes the price:** The **sole current JAAA Hub manager** is Fordefi multiuser MPC wallet [`0x7bf090b9…02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec). Its EOA-like onchain form cannot reveal MPC policy, so the high approval threshold remains dependent on Centrifuge's written attestation. The former 3-of-8 Safe was removed on 2026-06-19 by [this Fordefi transaction](https://etherscan.io/tx/0xe82f7d4a7f0616bc3b792444f233e18cb55f1b05a7238d0758ef8871ce8bbfc7). Because the two managers previously had parallel, independent authority—not a co-sign or veto relationship—removing one reduces the number of principals able to exercise unbounded pool powers. It is directionally positive for compromise-path count, though it also removes an onchain-verifiable fallback and leaves the sole manager's threshold opaque.
- **Onchain pricing infrastructure — available but not used by JAAA:** V3.2's onchain-PM suite can add accounting logic and strategy-specific circuit-breaker guards, but it does not make offchain CLO marks trustless. JAAA is still uninitialized in `NAVManager`, has no `navHook`, and reads the default SimplePriceManager value. Its canonical share price is therefore still the Fordefi manager's unbounded Hub push.
- **Third-party verification:** **Chronicle Labs** publishes a [Proof-of-Asset / Proof-of-Holdings dashboard for JAAA](https://chroniclelabs.org/dashboard/proofofasset/janus-henderson-anemoy-aaa-clo-fund). This is **transparency, not control**: the direct JAAA Hub price is not gated by Chronicle. Morpho's JAAA market uses a Chronicle Verified Asset Oracle adapter, but the reviewed adapter is an attestation feed rather than a dynamic deviation circuit breaker. It protects users from silently consuming a different source; it does not contractually bound Centrifuge's canonical NAV push.
- **Can admin mint tokens without backing?** **Yes, technically.** Root, Spoke, and BalanceSheet are direct `Tranche` wards. Fordefi can also issue through the Hub flow, while four BalanceSheet managers can reach `BalanceSheet.issue`. Happy-path accounting expects backing, but the token itself has no reserve check or meaningful supply cap.
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
- **Concentration risk:** **Holder count = 32** (rwa.xyz). This remains highly concentrated and institutional. A single large redemption could materially exceed onchain settlement float, in which case Anemoy may delay or partially fulfil rather than force-sell. Any underlying CLO liquidation happens offchain through the fund and its J.P. Morgan custody/brokerage arrangement.
- **Withdrawal queue / throttle:** No explicit fixed-cap throttle on `requestRedeem`. Anemoy retains discretion to delay or partially fulfil redemptions if portfolio liquidity is insufficient (typical for open-end credit funds).
- **Historical drawdown handling:** No stress events observed since JAAA inception in May 2025. Indirect reference points: Janus Henderson's $21B **NYSE JAAA ETF** (a separate, US-listed sibling product run by the same Global Securitized team — Centrifuge JAAA does **not** hold the NYSE ETF, only individual CLO tranches) maintained tight bid-ask in 2024–2025, which suggests the underlying AAA-CLO asset class held tight in those windows.
- **Same-value classification:** JAAA is a yield-bearing dollar-denominated security (~5% APY). Not a stablecoin — daily mark-to-market NAV varies slightly with CLO market prices. Acceptable to apply longer exit times for the AAA-credit asset class.

## Centralization & Control Risks

### Governance

- **Single live ProtocolAdminSafe** (verified onchain — `Root.wards()` check on every governance address):
  - **Current V3.1+ Safe** [`0x9711730060C73Ee7Fcfe1890e8A0993858a7D225`](https://etherscan.io/address/0x9711730060C73Ee7Fcfe1890e8A0993858a7D225) — Gnosis Safe, **4-of-9 threshold**, behind the current `ProtocolGuardian` [`0xCEb7…35c6`](https://etherscan.io/address/0xCEb7eD5d5B3bAD3088f6A1697738B60d829635c6) (`Root.wards()=1`).
  - The V3.0 Guardian [`0xfee1…3157`](https://etherscan.io/address/0xfee13c017693a4706391d516acabf6789d5c3157) was `Deny`'d on Root at block **24376326** (tx [`0x559e892f…`](https://etherscan.io/tx/0x559e892f88bedd4042929ddfaa6d92225c6074ba582b9a48168db8138dc4a908)) — the V3.0 4-of-8 Safe behind it is dormant.
- **Pool Manager (Hub-level)** — the current `HubRegistry` has **one registered JAAA manager**, Fordefi multiuser MPC wallet [`0x7bf090b9…02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec). The former 3-of-8 Safe was removed on 2026-06-19. Since the old setup was an OR relationship in which either manager could act alone, the removal reduces authority paths; it did not remove a co-signature or veto.
- **Root timelock:** `delay()` = **172,800 s (48 hours)** for `scheduleRely`/`executeScheduledRely`. The Guardian wraps the Safe and adds a Zodiac Delay module of ~24h per Centrifuge docs (not directly verified onchain in this session). Aggregate "schedule new admin" delay is therefore documented as **72h**; the onchain Root delay alone is 48h.
- **Guardian pause:** `Guardian.pause()` is callable without delay and freezes the protocol. `Guardian.unpause()` and other privileged paths require the Safe.
- **Privileged actions Root/Safes can take:**
  - Upgrade vault / share / hook / hub / spoke implementations
  - Add or remove wards on any protocol contract (including new mint authority on the share token)
  - Pause the protocol (Guardian, no delay)
  - Recover tokens (TokenRecoverer, dispute window applies)
  - Add new cross-chain adapters
- **CFG token governance:** CFG holders discuss and signal on protocol parameters via the [Centrifuge Governance Forum](https://gov.centrifuge.io/). There is **no onchain enforcement linkage between CFG votes and the EVM ProtocolAdminSafe** — the Safe signers act independently, and a CFG vote does not automatically trigger any onchain action on Ethereum. CFG-holder influence over Ethereum-side authority is therefore *social/political* (signaling consumed by Safe signers), not contractual. The structural trust anchor on Ethereum is the 4-of-9 Safe + 48h Root timelock, regardless of CFG voting outcomes.
- **Fund seizure / freeze:** The `FullRestrictions` hook gives the pool manager the ability to **freeze a user's JAAA balance** (`hookDataOf` / `setHookData`). This is a regulatory feature for sanctions/compliance; it is also a real-world risk for any holder if Anemoy or the pool manager is compelled by court order.

### Programmability

- **Share-price update:** Manager-pushed (offchain → onchain). Currently ~1× per ~24h based on `priceLastUpdated`. PPS is therefore **stale between pushes** and admin-controlled.
- **Issuance:** Programmatic *given* a pool-manager approval — the manager must explicitly `approveDeposits` and `issueShares` for each batch.
- **Cross-chain:** All multi-chain operations (issuing JAAA on Avalanche, Stellar, etc., recognizing redemptions, propagating prices) route through a **2-of-2** MultiAdapter quorum — both LayerZero V2 and Chainlink CCIP must sign each message. Failure or compromise of either single adapter does not unilaterally execute a message; failure of both temporarily breaks cross-chain settlement. Recovery flows exist via `initiateRecovery` / `disputeRecovery` on the Guardian.
- **Accounting:** V3.1 introduced full onchain double-entry accounting in `BalanceSheet` [`0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e`](https://etherscan.io/address/0x12a110cE5f0FC871cC72Bc7ECaF35cf39DD0f43e). However, the *valuation* of the offchain CLO holdings still depends on the pool manager's price push.

### External Dependencies

- **Cross-chain messaging — 2/2 threshold with LayerZero V2 + Chainlink CCIP.** The [`MultiAdapter`](https://etherscan.io/address/0x35C837F0A54B715a23D193E1476BFC9BC30073BE) configuration was rechecked for JAAA's destinations. Each uses quorum 2 / threshold 2 with [LayerZero V2 adapter `0xD517…0295`](https://etherscan.io/address/0xD517BC7ba17271A8D87bE7355B2523bf5c750295) plus a Chainlink CCIP adapter (`0x34e9…6484` on destination IDs 2/3/5/6; `0x39CF…D955` on 11/12). Both must attest to a non-Ethereum message. The six live LayerZero inbound routes use 15 confirmations and require Deutsche Telekom + Canary plus 2-of-3 P2P/Nansen/Nethermind DVNs (**4-of-5 effective DVN quorum**).
- **Stablecoin settlement (USDC, USDT, USDS)** — JAAA accepts multiple subscription / redemption assets per Centrifuge. USDC inherits Circle's freeze list and reserve risk; USDT inherits Tether's; USDS inherits Sky's. Multi-asset settlement reduces single-issuer concentration.
- **Anemoy Capital SPC Limited (BVI)** — fund issuer of record. The legal wrapper that holds the underlying CLOs. BVI insolvency or regulatory action against Anemoy would constitute an existential risk for token holders.
- **Janus Henderson** — sub-advisor; selects and manages the CLO portfolio.
- **J.P. Morgan** — current custodian and traditional broker per rwa.xyz. Custodian/broker failure remains an offchain dependency.
- **Trident Trust** — **two roles on JAAA, both gating onchain state**: (1) fund administrator (**Trident Trust Company (Cayman) Ltd** per the on-chain pool metadata) computes NAV daily; (2) KYC/AML service provider for Anemoy (per [rwa.xyz](https://app.rwa.xyz/assets/JAAA)) — Trident performs the underlying identity/compliance review that gates which addresses Anemoy/the pool manager adds to the `FullRestrictions` allowlist. rwa.xyz also lists a sister BVI entity (**Trident Trust Company (B.V.I.) Limited**), likely registered agent / corporate services for Anemoy SPC at the fund's BVI jurisdiction. Trident Trust group is an independent fund-services firm with operations in 25 jurisdictions globally.
- **MHA Cayman** — fund auditor.
- **Sky / Grove** — until recently the largest single JAAA holder ($1B at launch). Grove redemption flow is the largest single-counterparty risk to JAAA's onchain TVL stability.

## Operational Risk

- **Team transparency:** **Centrifuge Network Foundation** is the corporate governing body ([centrifuge.foundation](https://www.centrifuge.foundation/)). Centrifuge has a public engineering team led by Lucas Vogelsang (CEO) and Martin Quensel (co-founder). Anemoy team and Janus Henderson representatives are public institutional figures.
- **Documentation:** Centrifuge V3 has thorough developer documentation at [docs.centrifuge.io](https://docs.centrifuge.io/developer/protocol/overview/). JAAA-specific investor documentation lives at [anemoy.io/funds/jaaa](https://www.anemoy.io/funds/jaaa), [rwa.xyz/JAAA](https://app.rwa.xyz/assets/JAAA), and the current public metadata, which discloses all 36 CLO positions by CUSIP/ISIN and market value.
- **Legal structure:**
  - Centrifuge: Centrifuge Network Foundation, **Cayman Islands** (per Centrifuge team confirmation; supersedes the earlier "Switzerland per press kit" reference, which was stale).
  - JAAA fund: BVI Professional Fund issued by Anemoy Capital SPC Limited, regulated by the BVI FSC under the Securities and Investment Business Act.
- **Incident response:** No public incident-response playbook found, but Guardian-pause and TokenRecoverer flows exist on-protocol. No production incidents have been observed to test response.

## Monitoring

The most consequential signals for JAAA risk are (a) governance Safe actions, (b) the daily NAV push and pool-manager state, and (c) protocol-wide pause/upgrade state. Monitor at least daily for items 1–3; weekly for 4–5.

1. **NAV freshness** — call `AsyncRequestManager.priceLastUpdated(vault)` on [`0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae`](https://etherscan.io/address/0xF48256AbDDf96EcDDc4B3DbD23E8C1921f9761Ae) with the JAAA AsyncVault address. **Alert if price age > 48 hours** during business days. Compare `convertToAssets(vault, 1e6)` against rwa.xyz NAV daily — divergence > 0.5% warrants investigation.

2. **JAAA share supply vs. PoolEscrow + fund NAV** — `IERC20(JAAA).totalSupply()` should track Anemoy's published fund NAV (offchain). PoolEscrow USDC balance [`0x040170aA9AAa916c2e8135777a31f17C440BA52a`](https://etherscan.io/address/0x040170aA9AAa916c2e8135777a31f17C440BA52a) ≠ total backing — it is operational float only. Sudden unexplained supply changes (no corresponding `requestDeposit`/`requestRedeem` activity) are a critical red flag.

3. **Root pause state** — `Root.paused()` on [`0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f`](https://etherscan.io/address/0x7Ed48C31f2fdC40d37407cBaBf0870B2b688368f). Any `Pause` event = stop new flows.

4. **Governance Safe transactions** — monitor on-chain transaction submission to:
   - V3.1+ Safe [`0x9711730060C73Ee7Fcfe1890e8A0993858a7D225`](https://etherscan.io/address/0x9711730060C73Ee7Fcfe1890e8A0993858a7D225) (4-of-9) — sole live admin path to Root
   - Pool Manager Fordefi MPC wallet [`0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec) — sole JAAA Hub manager; flag *any* outgoing tx, especially calls into `Hub` / `AsyncRequestManager` / `Spoke`
   - BalanceSheet manager Safes [`0x02eb…5bc7`](https://etherscan.io/address/0x02ebc43f723b4b5e433fe7edb6d9475f13f75bc7) and [`0x5684…5bfa`](https://etherscan.io/address/0x5684d912f0eb115ff6538c680ff00a5088035bfa), plus the EOA and trusted-call gateway listed under Mint Authority

5. **Root Rely / Deny events** — log `Rely(address)` and `Deny(address)` on Root. Any new ward added to Root is by definition a new governance principal; should match a known protocol upgrade announcement.

6. **HubRegistry.UpdateManager events on the *current* registry** — `UpdateManager(uint64 poolId, address manager, bool canManage)`, topic0 `0x34d7bc620a98c7bbfc3e91245b8fd8cb1812543d39dffb55d1aafc6a44e3cdab`, on the current registry [`0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93). Filter on poolId topic = `0x0000000000000000000000000000000000000000000000000001000000000007` (= 281474976710663). Any new manager registered = change to who can set JAAA price / issue shares. **Do not watch the legacy registry** [`0x12044…f52cb`](https://etherscan.io/address/0x12044ef361Cc3446Cb7d36541C8411EE4e6f52cb) — it is no longer authoritative under the current Hub.

7. **Aggregate cross-chain JAAA supply** — could use offchain data [rwa.xyz/JAAA](https://app.rwa.xyz/assets/JAAA).

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
│   [governance retired]      JAAA manager:                                   │
│                             0x7bf090b9…02ec (sole Fordefi MPC)              │
│                             (legacy HubRegistry 0x1204…f52cb retains stale  │
│                              pool data but is not consulted by current Hub) │
│                                          ▲                                  │
│                                          │ cross-chain via LayerZero + Chainlink CCIP│
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
│  Fordefi Pool Manager MPC    FullRestrictions hook                          │
│  0x7bf0…02ec ───────────────▶ 0x3C5E…80A7 (allowlist)                       │
│        │                                                                    │
│        │ sets price / approves issuance                                     │
│        ▼                                                                    │
│  AsyncVault ───── share() ──▶ JAAA Tranche (ERC-20, 6dp)                    │
│  0x4880…780b                  0x5a0F…cf64                                   │
│        │                                                                    │
│        │                                                                    │
│        ▼                                                                    │
│  PoolEscrow (operational stablecoin float)                                  │
│  0x0401…a52a                                                                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ (offchain settlement)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OFFCHAIN — JANUS HENDERSON / ANEMOY                  │
│                                                                             │
│   Anemoy Capital SPC (BVI Professional Fund — issuer of record)             │
│         │  ├── Sub-advisor: Janus Henderson (CLO portfolio management)      │
│         │  ├── Custodian / broker: J.P. Morgan (CLO holdings)               │
│         │  ├── Administrator: Trident Trust (NAV computation)               │
│         │  ├── Auditor: MHA Cayman                                          │
│         ▼                                                                   │
│   Portfolio of AAA-rated, floating-rate CLO tranches                        │
└─────────────────────────────────────────────────────────────────────────────┘

Parallel deRWA wrapper pool (poolId 281474976710659):
  AsyncVault 0x4865…4c9c → deJAAA token 0xAAA0…82Cc (18dp) → FreelyTransferable
  hook 0x9AAb…1147 — freely transferable, distributed onto DEXes /
  lending markets (Aave Horizon, Falcon, 3F/Morpho).
```

### Appendix: Investor Deposit Flow (ERC-7540 async)

The deposit path is **two-phase**: (1) the investor locks the subscription stablecoin (USDC / USDT / USDS) into PoolEscrow and registers a pending request, (2) on the next batch, the sole Fordefi Hub manager sets a price and approves/issues against that price. Steps 1–3 are user-initiated; steps 4–7 are pool-manager-initiated; step 8 is again user-initiated. On Ethereum, Hub→Spoke calls execute synchronously. On non-Hub chains, the leg is bridged through the verified **2-of-2** LayerZero V2 + Chainlink CCIP configuration.

```
INVESTOR DEPOSIT — ERC-7540 ASYNC FLOW (JAAA on Ethereum)

╭─── 1. ALLOWLIST (one-time) ──────────────────────────────────────────────╮
│  Fordefi Pool Manager MPC → FullRestrictions hook 0x3C5E…80A7                  │
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
│      • else → async cross-chain adapter                                 │
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

### Appendix: Pool-Manager Capability Matrix

Fordefi multiuser MPC wallet `0x7bf090b9…02ec` is the **sole current Hub manager** for JAAA. The former 3-of-8 Safe was removed on 2026-06-19. The table below enumerates what Fordefi can do without further governance approval. "Bounds" refers to onchain validation only; the worst-case column assumes the attested MPC policy is bypassed or compromised.

| # | Capability | Method (caller → contract) | Onchain bounds / checks | Reversibility | Worst-case if pool-manager principal is compromised |
|---|---|---|---|---|---|
| 1 | **Set JAAA NAV to any value** | `Hub.updateSharePrice(poolId, scId, pricePoolPerShare, computedAt)` → `ShareClassManager.updateSharePrice` | Pool exists; `computedAt ≤ block.timestamp`. **No upper bound, no deviation cap, no timelock, no per-epoch limit.** | Irreversible for any fulfilment that prices against it. | Mis-price the fund up or down arbitrarily. Morpho consumes a Chronicle-attested value, but the reviewed adapter does not provide a dynamic deviation bound against the canonical Centrifuge price. |
| 2 | **Notify Spoke of new price** | `Hub.notifySharePrice(poolId, scId, chainId)` → `MessageDispatcher.sendNotifyPricePoolPerShare` | Same-chain → synchronous `Spoke.updatePricePoolPerShare`. Cross-chain → async via MultiAdapter. | Same as (1). | Propagates the mis-price to lending markets and to other chains. |
| 3 | **Approve a deposit batch at chosen price** | `Hub.approveDeposits(poolId, scId, pricePoolPerAsset)` | Manager-set price; pool exists. **No price bound.** | Irreversible once shares are issued in step (4). | Approve a self-deposit at near-zero USDC/JAAA price, minting huge JAAA against a small USDC outlay (combined with (1)/(4)). |
| 4 | **Issue (mint) shares against approved batch** | `Hub.issueShares(poolId, scId, navPerShare)` → `AsyncRequestManager.fulfillDepositRequest` | Approved batch exists; manager-set navPerShare. **No bound.** | Irreversible. | Mint JAAA tokens to depositors (themselves) far in excess of the USDC they queued. |
| 5 | **Approve a redeem batch at chosen price** | `Hub.approveRedeems(...)` | Manager-set price; pool exists. **No price bound.** | Irreversible once USDC is paid out in (6). | Pay out near-zero USDC for redeemed shares (other users' redeems get robbed). |
| 6 | **Revoke (burn) redeemed shares and pay USDC** | `Hub.revokeShares(...)` → `AsyncRequestManager.fulfillRedeemRequest` | Approved redeem batch exists. | Irreversible. | Pair with (5) for redemption value extraction. |
| 7 | **Force-cancel any investor's pending deposit** | `Hub.forceCancelDepositRequest(...)` | Pool-manager auth only. | Reversible — investor can re-request. | Eject pending investors before a price manipulation. |
| 8 | **Force-cancel any investor's pending redeem** | `Hub.forceCancelRedeemRequest(...)` | Pool-manager auth only. | Reversible. | Trap a redeem request indefinitely (combined with refusal to approve batches). |
| 9 | **Add or remove KYC'd holders** | `Hub.updateMember(...)` → FullRestrictions hook `0x3C5E…80A7` `.updateMember` | Pool-manager auth only. | Reversible. | Freeze specific holders (refuse to allowlist them, or block transfers). |
| 10 | **Update pool metadata / IPFS pointer** | `Hub.updateMetadata(...)` | Pool-manager auth only. | Reversible. | Misleading offchain pool documentation (low direct economic risk). |
| 11 | **Add or remove pool managers (including itself)** | `Hub.updateHubManager(poolId, who, canManage)` → `HubRegistry.updateManager` | `_isManager(poolId)` only. Fordefi can grant or revoke manager status without a timelock or governance check. | Adding an attacker is reversible only while a legitimate manager remains; self-removal would require the Root governance path to restore a manager. | Compromised Fordefi adds an attacker-controlled co-manager or removes itself after delegation; protocol governance is the remediation path. |

**What the pool manager *cannot* do directly** (verified by reading Hub / Spoke / Tranche / Root source on Etherscan):

- **Drain PoolEscrow USDC arbitrarily.** USDC only leaves the escrow as part of an approved redeem batch (`revokeShares`) or as an authorized cross-chain transfer initiated by Spoke/Root, not by a raw withdraw. Mis-pricing a redeem batch is the indirect route.
- **Call `Tranche.mint` directly.** Fordefi itself is not a token ward. It reaches issuance through the Hub/Spoke batch path. Separately, BalanceSheet is a direct ward and its four pool-scoped managers can reach `BalanceSheet.issue`; this route is documented under Token Mint Authority.
- **Bypass the 48h Root timelock or Guardian pause.** Root ward changes, protocol upgrades, adapter swaps and TokenRecoverer authorization all go through Root, which the pool manager is not on.
- **Pause the protocol.** Pause/unpause are Guardian-only (`ProtocolGuardian` + `OpsGuardian`).
- **Mutate other pools.** All Hub functions in the table are scoped by `poolId` via `_isManager(poolId)`, which reads `HubRegistry.manager(poolId, msg.sender)`. JAAA's manager has no privileges on deJAAA or any other Centrifuge pool.

### Appendix: Centrifuge JAAA vs NYSE JAAA — Holdings Comparison

Citation for the Overview's "Centrifuge JAAA ≠ NYSE JAAA" note. They share a sub-advisor (Janus Henderson Global Securitized team) and an investment mandate (AAA-rated floating-rate CLO tranches) but hold **different specific tranches**.

**Sources:** Centrifuge JAAA — full current holdings list from the onchain pool-metadata pointer [`bafkrei…soym5m`](https://ipfs.io/ipfs/bafkreifdw6nqnafeerd4xgmuyhad7jhzu6prd77lr2fmxvll3ax6soym5m). NYSE JAAA — top 25 visible at [stockanalysis.com/etf/jaaa/holdings](https://stockanalysis.com/etf/jaaa/holdings/) (data via Finnhub, snapshot 2026-05-29); positions 26–604 are subscriber-gated.

#### Aggregate profile

| Metric | Centrifuge JAAA | NYSE JAAA |
|---|---|---|
| Total positions | **36 CLO tranches** | **604** |
| Total portfolio value | **~$673.61M** in current metadata; rwa.xyz asset value ~$688.24M | **~$21B** |
| #1 position weight | **4.9%** (ARES 2022-ALF2A) | **1.10%** (cash) / top CLO **0.91%** (KKR 35A) |
| Top 5 cumulative | **~23.2%** | **~4.1%** |
| Cash sleeve | **No cash row in current metadata** | 1.10% |

Centrifuge JAAA remains more concentrated than the NYSE ETF, but diversification improved materially from the prior snapshot: 36 positions, a 4.9% largest weight, and ~23.2% in the top five. A full current exact-overlap comparison is not possible from the NYSE ETF's public top-25-only view; the legal and portfolio separation is independently established by the two products' disclosures.

---

## Risk Summary

### Key Strengths

- **Heavy and ongoing audit cadence:** 20+ V3 audits in 14 months from Cantina/Spearbit, yAudit/Electisec, BurraSec, xmxanuel, Recon, plus a Sherlock public contest — far above the median for tokenized-RWA protocols. Active Cantina bug bounty with $250k Critical payout.
- **Institutional-grade offchain stack:** Janus Henderson (subadvisor), Anemoy (BVI-regulated manager), J.P. Morgan (custodian/traditional broker), Trident Trust (administrator), MHA Cayman (auditor), and Circle (crypto custody).
- **Best-in-class collateral class for tokenized RWA:** AAA-rated floating-rate CLO tranches — top of the credit stack, low historical loss rates, large institutional secondary market.
- **Material onchain protection:** 48h Root timelock, Guardian pause (no delay), a single live 4-of-9 ProtocolAdminSafe (the legacy V3.0 4-of-8 path is `Deny`'d on Root at block 24376326), and a **2-of-2 MultiAdapter cross-chain quorum** (LayerZero V2 + Chainlink CCIP, verified onchain via `quorum() = 2`) with dispute window.
- **Independent third-party attestation:** [Chronicle Labs publishes a Proof-of-Asset / Proof-of-Holdings dashboard for JAAA](https://chroniclelabs.org/dashboard/proofofasset/janus-henderson-anemoy-aaa-clo-fund), giving an out-of-band cryptographic attestation of NAV and underlying holdings — uncommon for tokenized RWA funds and meaningfully strengthens Provability.
- **Significant institutional adoption:** Grove ($1B initial seed), Aave Horizon (~$100M in first week), Falcon Finance, 3F/Morpho — demonstrates real demand and provides secondary liquidity routes via the deJAAA wrapper.

### Key Risks

- **The sole Fordefi pool manager has unbounded NAV-push authority.** It can set NAV to any value and add another Hub manager without an onchain bound or timelock. Removing the former Safe reduced independent compromise paths because the old authorities were parallel, but the remaining MPC threshold is not independently visible onchain.
- **NAV is admin-pushed, not onchain-derived.** Underlying CLOs are offchain. Chronicle improves transparency, and Morpho uses Chronicle's attested feed, but neither currently bounds the canonical JAAA Hub price at the protocol contract level.
- **Mint-without-backing is technically possible through multiple routes.** Root, Spoke, and BalanceSheet are direct token wards; Fordefi can issue through Hub, and four BalanceSheet managers can call its pool-scoped issuance route.
- **Highly concentrated holder base.** rwa.xyz reports 32 holders and ~$688.24M asset value. A single institutional redemption can still exceed onchain float and force delayed fulfilment or offchain CLO sales.
- **Multiple offchain trust principals — with a Trident dual-role concentration.** Failure or adversarial action by Anemoy, Janus Henderson, J.P. Morgan, Trident Trust, or the BVI regulatory environment is existential for holders. Trident remains both fund administrator and KYC/AML provider.
- **V3.1 is recent (Feb 2026)** and the V3.2 Onchain Portfolio Manager only audited Mar–Apr 2026. New code paths continue to ship.
- **Pool manager signer identities not publicly disclosed.** Standard for institutional-RWA, but reduces verifiability of "who can move my money."

### Critical Risks `[If Any]`

- **Unbounded NAV-push function + full pool-management API behind one opaque MPC authority.** Fordefi [`0x7bf090b9…02ec`](https://etherscan.io/address/0x7bf090b97f896fb77e852cc98aa52a8cb7dc02ec) is now the sole JAAA Hub manager and can call `updateSharePrice`, batch issuance/redemption functions, allowlist updates, and `updateHubManager` without a timelock. `ShareClassManager.updateSharePrice` checks only that the share class exists and `computedAt <= block.timestamp`; there is no deviation cap, per-epoch limit, or Guardian pause on large changes. Chronicle remains an external attestation layer, not an enforced bound on this direct path.

---

## Risk Score Assessment

**Scoring Guidelines:**

- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — PASS → not triggered (20+ audits from multiple top firms).
- [x] **Unverifiable reserves** — PASS → not triggered. Reserves are offchain but verifiable through a chain of regulated attestation.
- [x] **Total centralization** — PASS → not triggered. Root remains controlled by a 4-of-9 ProtocolAdminSafe behind a 48h timelock + Guardian pause. JAAA's sole Hub manager is a high-threshold Fordefi MPC per Centrifuge's attestation, not an asserted single-key wallet. The opaque policy and unbounded pool powers remain reflected in Governance and Programmability scores.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

- **Coverage:** 20+ V3 audits from Cantina/Spearbit (top firm), yAudit/Electisec (top firm), BurraSec, xmxanuel, Recon, plus Sherlock public contest. Five+ engagements by reputable firms.
- **Bug bounty:** Active Cantina program, $250k max Critical. This sits between the $200K bracket (score 2) and $1M bracket (score 1).
- **Surface area:** Multi-chain protocol with Hub/Spoke, async ERC-7540, double-entry onchain accounting, transfer hooks — moderate-to-high complexity.

→ **Subcategory A score: 1.5** — well above the "≥3 audits by top firms" tier-1 threshold (we have two top firms plus three reputable independents plus a public contest), but held back from a clean 1.0 by (a) the $250K bounty cap sitting below the $1M tier-1 threshold and (b) the genuinely large attack surface (multi-chain Hub/Spoke + ERC-7540 + cross-chain messaging + multiple hook variants).

**Subcategory B: Historical Track Record**

- **Time in production:** Centrifuge V3 is just under 12 months old; JAAA is ~14 months from fund inception. This remains near the 6–12 / 1–2 year boundary because the assessed V3 stack has not yet completed a full year.
- **Scale:** Centrifuge protocol TVL is ~$1.638B (peak ~$1.991B); JAAA asset value is ~$688.24M after recovering from ~$437.9M in May 2026.
- **Incidents:** None.

→ **Subcategory B score: 2.0** — production duration is at the upper end of 6–12 months trending toward 1–2 years; sustained TVL >$1B at protocol level easily satisfies the "$50M+" threshold (and arguably the "$100M+ sustained" threshold for score 1). Score capped at 2 because V3 itself is <1 year old.

**Audits & Historical Score = (1.5 + 2.0) / 2 = 1.75**

**Score: 1.75/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- One live ProtocolAdminSafe (4-of-9) behind a 48h Root timelock + Guardian Zodiac delay (docs cite ~24h, not verified onchain). V3.0 Guardian denied on Root at block 24376326 — no dual-Safe issue.
- Pool Manager (Hub-level) has **one registered principal**: Fordefi multiuser MPC `0x7bf090b9…`, treated as multi-party threshold control per Centrifuge's attestation. Removing the former 3-of-8 Safe reduced parallel attack paths but also removed independently verifiable onchain threshold/redundancy.
- Privileged roles (mint, freeze, force-cancel, recover) exist but are gated through the timelocked Root or the pool manager. Critical actions (Root upgrade) are timelocked; routine actions (price push) are not.

→ **Subcategory A: 3.0** — the 4-of-9 protocol governance and 48h Root delay are unchanged. The manager removal is directionally positive on compromise-path count, but not enough to lower Governance below 3.0: the sole manager's threshold is still offchain-attested, and its price, batch, allowlist, and manager-delegation actions remain untimelocked.

**Subcategory B: Programmability**

- **NAV/price is admin-controlled with no contract-level bounds.** The sole Fordefi manager can set JAAA NAV to any value. `ShareClassManager.updateSharePrice` checks only share-class existence and `computedAt <= block.timestamp`; there is no upper bound, deviation cap, per-epoch limit, or timelock.
- **Transparency layer exists:** [Chronicle Labs publishes a Proof-of-Asset / Proof-of-Holdings dashboard for JAAA](https://chroniclelabs.org/dashboard/proofofasset/janus-henderson-anemoy-aaa-clo-fund) with independent attestation of NAV and holdings. Chronicle does not gate the price push, but a drift between the published onchain price and Chronicle's attested NAV would be detectable.
- **In-development guardrails:** Centrifuge has confirmed a pool-management timelock + price circuit breaker + volume-based mint/burn circuit breaker are being built. None are live as of this assessment; the Reassessment Triggers section captures the conditions for re-scoring once they ship.
- Issuance/redemption is async — the pool manager approves batches at prices the manager itself sets (`approveDeposits/approveRedeems → issueShares/revokeShares`), not fully programmatic.
- Onchain accounting layer (BalanceSheet) is programmatic; underlying valuation is not. JAAA is not routed through the V3.2 SimplePriceManager / NAVManager (`navHook(poolId) = 0x0`), so the only price input is the manager push.
- No transparency on parameter changes beyond raw onchain events; no public preview/queue of price updates before they land.

→ **Subcategory B: 3.5** — the *rate-setting operation* is admin-controlled with no programmatic guardrails (row-5 territory on the "admin-controlled rate" axis), but Chronicle's independent NAV/holdings attestation softens the "no transparency" side of the rubric — there is now an external observer publishing what the NAV *should* be.

**Subcategory C: External Dependencies**

- **Cross-chain:** **2-of-2 MultiAdapter quorum** — LayerZero V2 + Chainlink CCIP. Live destination configurations require both adapters. The LayerZero leg's six inbound routes use 15 confirmations and a 4-of-5 effective DVN quorum (Deutsche Telekom + Canary required, plus 2-of-3 P2P/Nansen/Nethermind), materially stronger than the prior single-Wormhole setup.
- **Stablecoin settlement:** USDC, USDT and USDS are all supported subscription / redemption assets (per Centrifuge team).
- **Offchain stack:** Janus Henderson sub-advisor, Anemoy issuer, J.P. Morgan custody/brokerage, Trident Trust admin+KYC (dual role), and MHA Cayman audit.

→ **Subcategory C: 2.5** — 2-of-2 cross-chain bridge with two top-tier providers and multi-stablecoin settlement materially reduce onchain-dependency concentration. Held above 2.0 by the Trident Trust dual-role concentration (see Provability) and the still-newer Anemoy partnership (~12 months onchain).

**Centralization Score = (3.0 + 3.5 + 2.5) / 3 ≈ 3.00**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- 100% backed by an AAA CLO portfolio under J.P. Morgan custody/brokerage. Offchain assets.
- AAA CLOs are high-quality but not blue-chip onchain assets like ETH/WBTC.
- Backing verifiable via periodic Trident Trust NAV + MHA Cayman audit; not real-time onchain.
- Falls between row 3 ("100% collateral, some offchain; mixed/newer protocols; periodic custodian attestation") and row 2 (high-quality DeFi assets, mostly onchain).

→ **Subcategory A: 3.0** — onchain backing chain depends entirely on the regulated offchain attestation, but the asset class is genuinely high-quality and custody is institutional.

**Subcategory B: Provability**

- Reserves are **primarily offchain**. Onchain Tools verify only that the pool manager has pushed a price, not that the price reflects true NAV.
- Reporting: Trident Trust Cayman computes NAV **daily** and the pool manager pushes it through `Hub.updateSharePrice`. The public dynamic metadata now lists 36 CLO positions totaling ~$673.61M, while rwa.xyz reports ~$688.24M total asset value. Chronicle supplies an independent attestation view, but does not gate the direct Hub update.
- **Independent third-party attestation:** [Chronicle Labs publishes a Proof-of-Asset / Proof-of-Holdings dashboard for JAAA](https://chroniclelabs.org/dashboard/proofofasset/janus-henderson-anemoy-aaa-clo-fund) with cryptographic attestation of NAV and holdings, sourced with direct access to the fund administrator. This is a meaningful improvement over typical TradFi-RWA pattern, where the only verification is the administrator's own publication.
- Verification: regulated administrator + auditor + Chronicle independent attestation.

→ **Subcategory B: 2.5** — Chronicle's independent onchain attestation moves this above row-3 ("manual reporting by admins") toward row 2 ("third-party attestation; trusted custodian"). The remaining gap to a clean 2 is that Chronicle's attestation is informational — it doesn't gate the actual onchain price push.

**Funds Management Score = (3.0 + 2.5) / 2 = 2.75**

#### Category 4: Liquidity Risk (Weight: 15%)

- **Direct redemption:** Daily through Anemoy, NAV-based, USDC-settled. Async — typically T+1 once redemption batch is processed; full settlement subject to fund-level liquidity.
- **Liquidity depth:** Aave Horizon position-unwind, Falcon Finance, 3F/Morpho provide secondary exit routes.
- **Large holder impact:** With 32 holders and ~$688.24M asset value, a $50M+ redemption remains plausible and can exceed onchain settlement float.
- **Stress behavior:** Untested through any market dislocation since launch (May 2025). AAA CLOs would historically widen but remain saleable in stress.
- Best fit: row 3 ("Market-based or short queues; >$1M, 1-3% slippage; 3-7 days for full exit") with a yield-bearing-asset exception (longer exit times acceptable).

**Score: 3.0** — adequate for normal flows; concentration and untested stress behavior keep it from a 2.

#### Category 5: Operational Risk (Weight: 5%)

- **Team transparency:** Centrifuge team is fully public (Lucas Vogelsang, CEO; Martin Quensel, co-founder). Anemoy and Janus Henderson are public institutional entities with named portfolio managers.
- **Documentation:** Excellent for the protocol. The fund's current public metadata discloses all 36 CLO positions with CUSIP/ISIN/market value, supplemented by Chronicle, Anemoy, and rwa.xyz disclosures.
- **Legal:** BVI Professional Fund issued by Anemoy Capital SPC Limited (regulated by the BVI FSC); Centrifuge Network Foundation is described above as Cayman Islands per team confirmation. Both have identified legal jurisdictions.
- **Audit cadence on the protocol code:** Heavy and ongoing (20+ engagements, see Category 1).

→ **Subcategory score: 1.5** — every transparency dimension (team, docs, holdings, legal) is fully public and well-documented. The remaining friction (Pool Manager signer identities not published; investor letters not public) is standard for institutional-RWA and keeps this from a perfect 1.0.

**Score: 1.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.75 | 20% | 0.35 |
| Centralization & Control | 3.00 | 30% | 0.90 |
| Funds Management | 2.75 | 30% | 0.825 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.6/5.0** |

**Optional Modifiers:**

- Protocol live >2 years with no incidents: **not eligible** (V3 is just under one year old).
- TVL maintained >$500M for >1 year: **not yet demonstrated** at the JAAA level despite current ~$688.24M asset value; protocol-level TVL >$1B has been sustained <1 year. No modifier applied.

**Final Score: 2.6/5.0** — unchanged. Removing a parallel manager is directionally positive, while current TVL/AUM and broader holdings also strengthen the profile. Those improvements do not yet overcome the score-driving issue: the sole, offchain-attested Fordefi MPC can still set an unbounded canonical NAV and exercise untimelocked pool powers. Morpho's Chronicle feed is useful attestation protection for that market, but it does not make direct JAAA exposure low risk or enforce a dynamic bound on Centrifuge's price.

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

- **Time-based:** Reassess in **6 months**, or earlier on any subsequent V3.x major release or JAAA migration.
- **TVL-based:** Reassess if aggregate JAAA NAV moves by **±30%** within a 30-day window, or if Centrifuge protocol TVL drops below $500M.
- **Governance:** Reassess on any new `Rely` on Root (new admin principal), any change to the current ProtocolAdminSafe threshold/signer set, or any `UpdateManager` event on the current HubRegistry [`0x19f46…ADE93`](https://etherscan.io/address/0x19f46D8130e610C6C0f0116EA40Fb781dEFaDE93) for poolId `281474976710663` (add/remove of a JAAA Pool Manager — Safe or MPC wallet).
- **Pricing:** Reassess if the JAAA pool migrates to V3.2's onchain `NAVManager`/`PriceManager`, or conversely if the NAV stops being refreshed at least every 48 hours during business days.
- **Onchain guardrails ship:** Reassess (Programmability) when Centrifuge's planned **pool-management timelock + price circuit breaker + volume-based mint/burn circuit breaker** go live and JAAA is migrated to them — material score-reducer.
- **Cross-chain adapter set changes:** Reassess if the active MultiAdapter quorum changes (e.g., a Chainlink CCIP or LayerZero V2 adapter is added/removed for JAAA), or if `quorum()` is lowered.
- **Counterparty:** Reassess on any material change to Anemoy, Janus Henderson sub-advisory, J.P. Morgan custody/brokerage, Trident Trust administration (admin or KYC role), Chronicle Labs attestation availability, or MHA Cayman audit relationships.
- **Incident-based:** Reassess after any Centrifuge protocol exploit, any pause event, any token recovery action via `TokenRecoverer`, or any depeg / NAV-discontinuity > 1%.

## Assessment History

| Date | Score | Change |
|------|------:|--------|
| May 28, 2026 | 2.60 | Initial assessment |
| July 14, 2026 | 2.60 | Refreshed management, TVL/AUM, holdings, custody, mint authority, related contracts, and cross-chain configuration; score unchanged |
