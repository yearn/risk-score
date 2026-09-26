# Protocol Risk Assessment: Lombard (LBTC)

- **Assessment Date:** May 26, 2026
- **Token:** LBTC (Lombard Staked Bitcoin)
- **Chain:** Ethereum
- **Token Address:** [`0x8236a87084f8B84306f72007F36F2618A5634494`](https://etherscan.io/address/0x8236a87084f8B84306f72007F36F2618A5634494)
- **Final Score: 2.80/5.0**

> **Context:** This assessment was requested in [issue #216](https://github.com/yearn/risk-score/issues/216) to evaluate LBTC for use as **collateral on Morpho markets**. As of May 26, 2026, ~$58.7M of LBTC is supplied as collateral across Morpho Ethereum markets (dominated by the LBTC/PYUSD market at 86% LLTV, ~$49.7M). See [Liquidity Risk](#liquidity-risk).

## Overview + Links

Lombard is a Bitcoin liquid-staking protocol. Users deposit native BTC, which is staked through **Babylon's Bitcoin Staking Protocol**; in return they receive **LBTC**. The staked BTC secures Babylon-connected PoS networks, and the resulting rewards (converted to BTC) accrue to LBTC holders. LBTC began as a 1:1 BTC-backed token; since the July 2025 yield-bearing migration it is **value-accruing** — each LBTC redeems for BTC at the current `getRate()` (≈1.0041 BTC, rising over time as yield accrues), not a fixed 1:1.

LBTC is **value-accruing (non-rebasing)**. On **July 22, 2025** the token migrated from a claim-based rewards model to an auto-accruing yield-bearing token (the deployed implementation is named `StakedLBTC`). Token balances stay fixed; instead the **LBTC/BTC exchange rate rises over time**. The onchain rate as of this assessment is `getRate() = 1.00409` (i.e. 1 LBTC ≈ 1.0041 BTC). Reported APY is modest (~1%, varies with Babylon rewards).

The underlying BTC is **not held in a trustless onchain vault** — it is custodied off the Bitcoin chain by the **Lombard Security Consortium**, a set of institutional members that jointly control the BTC via threshold cryptography. Mint and redeem are authorized by this consortium's notary set plus an independent attestation layer (the **Bascule drawbridge**).

**Links:**

- [Protocol Documentation](https://docs.lombard.finance/)
- [App](https://www.lombard.finance/)
- [GitHub (EVM contracts)](https://github.com/lombard-finance/evm-smart-contracts)
- [Audits page](https://docs.lombard.finance/learn/security/audits)
- [Bug bounty](https://docs.lombard.finance/learn/security/bug-bounty)
- [Smart contracts list](https://docs.lombard.finance/learn/transparency/smart-contracts)
- [Oracles / PoR](https://docs.lombard.finance/learn/transparency/oracles)
- [DefiLlama — Lombard](https://defillama.com/protocol/lombard)
- [CoinGecko — LBTC](https://www.coingecko.com/en/coins/lombard-staked-btc)

## Contract Addresses

Ethereum mainnet, verified onchain May 26, 2026.

| Contract | Address | Type / Role |
|----------|---------|-------------|
| LBTC token | [`0x8236a87084f8B84306f72007F36F2618A5634494`](https://etherscan.io/address/0x8236a87084f8B84306f72007F36F2618A5634494) | TransparentUpgradeableProxy → `StakedLBTC` impl |
| LBTC implementation | [`0x072072317469eBb6c340A47e41561c9c3b782bd9`](https://etherscan.io/address/0x072072317469eBb6c340A47e41561c9c3b782bd9) | `StakedLBTC` (verified) |
| ProxyAdmin | [`0xbAE061C73876952aA2C5e483b74dfA785425f879`](https://etherscan.io/address/0xbAE061C73876952aA2C5e483b74dfA785425f879) | `ProxyAdmin`, owner = Timelock |
| Lombard Timelock | [`0x055E84e7FE8955E2781010B866f10Ef6E1E77e59`](https://etherscan.io/address/0x055E84e7FE8955E2781010B866f10Ef6E1E77e59) | `LombardTimeLock`, `getMinDelay()` = 86,400 s (24 h). Also holds `DEFAULT_ADMIN_ROLE` on LBTC |
| Consortium | [`0xdAD58DfA5c1a7a34419AFdBE1f0d610efeea95E4`](https://etherscan.io/address/0xdAD58DfA5c1a7a34419AFdBE1f0d610efeea95E4) | `Consortium` (proxy) — verifies notary signatures |
| Bascule | [`0xC3ecFE771564e3f28CFB7a9b203F4d10279338eD`](https://etherscan.io/address/0xC3ecFE771564e3f28CFB7a9b203F4d10279338eD) | `GMPBasculeV1` — independent deposit-attestation layer (set as `Bascule()` on LBTC) |
| AssetRouter (MINTER) | [`0x9eCe5fB1aB62d9075c4ec814b321e24D8EA021ac`](https://etherscan.io/address/0x9eCe5fB1aB62d9075c4ec814b321e24D8EA021ac) | TransparentUpgradeableProxy (impl `0xb823…bd80`) — holds `MINTER_ROLE`, returned by `getAssetRouter()` |
| AssetRouter ProxyAdmin | [`0xBf4202c8a0d852D432266dfE112ED624a1a36754`](https://etherscan.io/address/0xBf4202c8a0d852D432266dfE112ED624a1a36754) | `ProxyAdmin` for AssetRouter, owner = Lombard Timelock (24 h) |
| BridgeV2 (MINTER) | [`0x451C54981C7da5d95901B770c540547cf5FE0a2D`](https://etherscan.io/address/0x451C54981C7da5d95901B770c540547cf5FE0a2D) | TransparentUpgradeableProxy `BridgeV2` (impl `0xc785…a235`) — holds `MINTER_ROLE` (cross-chain bridge) |
| BridgeV2 ProxyAdmin | [`0x6B06CC8D89aD50962563bC5cFE1FF80Ec0b8cbB1`](https://etherscan.io/address/0x6B06CC8D89aD50962563bC5cFE1FF80Ec0b8cbB1) | `ProxyAdmin` for BridgeV2, owner = Lombard Timelock (24 h) |
| Pauser Safe (PAUSER) | [`0xad67Ba2795770C8e0B70E2896C0F81F9d313FD44`](https://etherscan.io/address/0xad67Ba2795770C8e0B70E2896C0F81F9d313FD44) | Gnosis Safe, **2-of-11** — holds `PAUSER_ROLE` |
| Treasury Safe | [`0x251a604E8E8f6906d60f8dedC5aAeb8CD38F4892`](https://etherscan.io/address/0x251a604E8E8f6906d60f8dedC5aAeb8CD38F4892) | Gnosis Safe, **3-of-5** — fee treasury; also Timelock PROPOSER + EXECUTOR + CANCELLER |
| Deployer EOA | [`0x3f6bf1c36ccbb59eaf8415301a0cec73c344a079`](https://etherscan.io/address/0x3f6bf1c36ccbb59eaf8415301a0cec73c344a079) | EOA — deployed LBTC; Timelock PROPOSER (verified; **not** a canceller) |
| Chainlink LBTC/BTC feed | [`0x5c29868C58b6e15e2b962943278969Ab6a7D3212`](https://etherscan.io/address/0x5c29868C58b6e15e2b962943278969Ab6a7D3212) | Exchange-rate feed (8 dec; reads 1.00495 BTC) |
| RedStone LBTC rate feed | [`0xb415eAA355D8440ac7eCB602D3fb67ccC1f0bc81`](https://etherscan.io/address/0xb415eAA355D8440ac7eCB602D3fb67ccC1f0bc81) | RedStone LBTC/BTC rate feed (8 dec; reads 1.00409) |
| PoR reserve registry (Base) | [`0xe7Ebc588F4EC9297d9867aD75a9b5D86848c8018`](https://basescan.org/address/0xe7Ebc588F4EC9297d9867aD75a9b5D86848c8018) | `PoR` (proxy, impl `0x0bb6…70cc`) — onchain BTC reserve-address registry, Chainlink PoR std, 28,626 addresses |

## Audits and Due Diligence Disclosures

Lombard is **extensively audited** — 10 reports from 6 firms ([audits page](https://docs.lombard.finance/learn/security/audits)):

| Firm | Date | Scope |
|------|------|-------|
| OpenZeppelin | Oct 24, 2025 | BTC.b & BridgeV2 |
| ABDK | Sep 22, 2025 | StakeAndBake |
| Sherlock | Jul 25, 2025 | Yield-Bearing |
| OpenZeppelin | Jul 25, 2025 | Yield-Bearing |
| Veridise | Dec 17, 2024 | V2 |
| OpenZeppelin | Dec 13, 2024 | V2 |
| Halborn | Dec 9, 2024 | FBTC integration |
| Halborn | Oct 10, 2024 | BTC.b PMM |
| Veridise | Aug 21, 2024 | V1 |
| Halborn | Aug 5, 2024 | V1 |

Reports are published in the [evm-smart-contracts repo `docs/audit/`](https://github.com/lombard-finance/evm-smart-contracts/tree/main/docs/audit). Multiple top-tier firms (OpenZeppelin ×3, Sherlock) cover the yield-bearing implementation now in production. The onchain surface is moderately complex: an upgradeable AccessControl ERC-20 plus an AssetRouter, BridgeV2, Consortium signature-verification contract, and the Bascule attestation layer.

**Unresolved findings (verified from the raw audit PDFs in Lombard's repo):**

The two **Yield-Bearing** audits (the implementation now in production) carry several findings the team **acknowledged but explicitly chose not to fix**:

- **Sherlock — Yield-Bearing** ([Sherlock_YB.pdf](https://raw.githubusercontent.com/lombard-finance/evm-smart-contracts/main/docs/audit/Sherlock_YB.pdf), audited Jun 24 – Jul 15, 2025): 5 High, 5 Medium. Three High-severity findings were marked acknowledged-won't-fix at audit time; **of these, H-1 is now mitigated in the deployed contract, leaving H-2 and H-5 as the open Highs:**
  - **H-1** — *BridgeV2 deposits are not rate limited.* **Appears mitigated in the current deployment** — `RateLimitsSet` events configure LBTC limits (~100 LBTC / 3 h window per destination chain) and the verified source enforces `RateLimits.updateLimit(...)` before minting (verified onchain May 26, 2026). The audit's "won't fix" response predates this configuration; treat H-1 as **effectively addressed onchain**, not open.
  - **H-2** — *BridgeV2 `deposit()` wrongly burns tokens from the relayer.* Acknowledged-won't-fix; deployment status not independently re-verified.
  - **H-5** — *Swapping CBBTC/BTCB to LBTC via minting breaks per-chain accounting* — described as an inherent design problem where permissioned (non-notarized) mints make the ratio incorrect and **can make some LBTC impossible to redeem back to BTC.** This is the most consequential **still-open** item for a collateral assessment.
- **OpenZeppelin — Yield-Bearing / GMP** ([OZ_YB.pdf](https://raw.githubusercontent.com/lombard-finance/evm-smart-contracts/main/docs/audit/OZ_YB.pdf), Jul 17, 2025): 3 Medium, 5 Low. **M-01** (*missing lower bound on user-specified minting fees*) is **acknowledged, not resolved** (team relies on the claimer choosing acceptable fee payloads; there is an upper bound — `maxMintCommission` = 68 sats — but no lower bound).

These are design trade-offs rather than live bugs, but H-5's redeemability/accounting implication is material and is reflected in the scoring below. Confirm whether any are remediated on the next reassessment.

### Bug Bounty

- **Platform:** [Immunefi](https://immunefi.com/bug-bounty/lombard-finance/scope/) (live since Sep 2024).
- **Max payout:** **$250,000** (critical smart-contract). Scope includes LBTC token, Consortium governance, and the proxy upgrade timelock.
- **Safe Harbor (SEAL):** Not adopted — Lombard does not appear among the SEAL Safe Harbor adopters (checked May 2026). Lombard's security partners (Veridise, Halborn, Immunefi, Hexagate, TRM) cover audits/monitoring rather than the Safe Harbor whitehat agreement.

## Historical Track Record

- **LBTC proxy deployed:** May 17, 2024 (block tx [`0xf5cccb…3ea8b`](https://etherscan.io/tx/0xf5cccb27295295cb2655bdcdea55a2aaf855272c578a91e2f0df55a223d3ea8b)); public mainnet launch ~August 2024 (V1 audits). ~21–24 months in production.
- **Protocol TVL (DefiLlama, May 26, 2026):** ~$1.0B, of which **~$973M is staked BTC** backing. Lombard is the largest BTC LST by share of category. TVL first crossed **$500M on ~Oct 5, 2024 and has stayed above $500M continuously since (~19 months)**, peaking at **~$2.2B on May 23, 2025** (DefiLlama timeseries; single-source). This makes the optional ">$500M TVL for >1 year" modifier applicable — see scoring.
- **Market data (CoinGecko, May 26, 2026):** price ~$76,915; **LBTC/BTC ≈ 1.0066**; market cap ~$789M; circulating supply ~10,252 LBTC (all chains).
- **Onchain supply (Ethereum):** `totalSupply()` ≈ **8,717 LBTC** (8 decimals; 8,717.37 on the May 26 reconciliation re-read — supply drifts with mints/burns). LBTC is multichain — also on Base, BSC, Avalanche, Solana, Sui, Starknet; see *Supply vs Reserves Reconciliation* for the cross-chain total.
- **Peg history:** LBTC/BTC has traded both above and below parity. CoinGecko all-time range is **ATH 1.1277 BTC / ATL 0.9439 BTC** — i.e. a worst-case ~6% discount to BTC has occurred. Currently ~0.66% premium (consistent with accrued yield).
- **Incidents:** No exploits or protocol-level depeg events found for LBTC. Standing risk factors (not realized): Babylon slashing (a new, relatively untested mechanism), and off-chain custody/consortium collusion.
- **Third-party risk coverage:** [Chaos Labs published a "Lombard BTC Risk Assessment"](https://governance.ether.fi/t/lombard-btc-risk-assessment/2308) on the ether.fi governance forum (Sep 13, 2024), flagging limited transparency around consortium membership/decision-making and CubeSigner reliance. **No standalone LlamaRisk report on LBTC was found** — LlamaRisk has only covered LBTC within Aave v3 and Curve governance contexts (collateral onboarding / debt-ceiling methodology). **No Steakhouse Financial report found.**

## Funds Management

### Accessibility

- **Mint:** Permissionless. User sends native BTC to a Lombard deposit address → ~6 BTC confirmations → Consortium notary set co-signs **and** Bascule independently attests the deposit → LBTC mints to the destination wallet. **Not atomic** (gated by BTC confirmations + off-chain notarization). Ethereum mints carry a small LBTC mint fee (gas); other chains have none. Minimum deposit ~0.0002 BTC.
- **Redeem:** `redeemForBtc(...)` burns LBTC onchain immediately; BTC is returned after a **~9-day window** (Babylon's ~7-day unbonding plus Lombard's daily rebalancing). Asynchronous, not atomic.
- **Onchain redeem parameters (verified):** `isRedeemsEnabled() = true`, `getRedeemFee() = 10000` (0.0001 LBTC network-security fee), `getRedeemForBtcMinAmount() = 3300` (0.000033 LBTC).
- **Pausing:** `paused() = false`, `mintBurnPaused() = false`. A `PAUSER_ROLE` Safe can pause transfers and mint/burn (see Centralization).

### Supply vs Reserves Reconciliation

LBTC's backing (native BTC) is held **off the Bitcoin chain**, so a trustless onchain sum is not possible from an EVM vantage point. The best available reconciliation (verified May 26, 2026):

| Side | Measure | Value |
|------|---------|-------|
| **Liability** | Circulating LBTC, all chains (CoinGecko) | **10,252.5 LBTC** |
| | — of which verified onchain (EVM): ETH 8,717.37 + Base 271.92 + BSC 13.72 + Avax 0.01 | **9,003.0 LBTC** |
| | — remainder (Solana / Sui / Starknet, non-EVM) | ~1,249 LBTC |
| **Reserve attestation** | Onchain `PoR` registry (Base), BTC reserve addresses | **28,626 addresses** |
| **Reserve aggregate** | DefiLlama "Bitcoin" staked-BTC TVL | **~$961M** (≈ **12,700 BTC** at BTC ≈ $75,768) |

- The reserve aggregate (~12,700 BTC) **exceeds** circulating LBTC value (10,252 LBTC × 1.0085 ≈ 10,339 BTC) by ~23%. This is **not evidence of over-collateralization of LBTC specifically** — DefiLlama's protocol TVL bundles Lombard's other BTC products (the LBTCv DeFi Vault, BTC.b), so it is an **upper bound** on LBTC backing, not a clean 1:1 tie-out.
- **What this assessment could NOT do:** independently sum the BTC balances across the 28,626 registry addresses (Bitcoin-chain UTxO aggregation is out of scope here). A precise reserve-vs-supply equality therefore remains **dependent on Lombard's off-chain attestation and the PoR feed operator**, not reproduced trustlessly in this report.
- **Conclusion:** the onchain `PoR` address registry plus the DefiLlama aggregate show **no sign of under-backing**, and circulating LBTC reconciles in order-of-magnitude terms, but an exact, independent 1:1 reserve proof is **TODO** (see Open TODOs). The Provability score and the "Unverifiable reserves" gate below are calibrated to this limitation.

### Token Mint Authority

**Mint mechanism:** Role-gated `MINTER_ROLE` (OpenZeppelin AccessControl). Minting is performed by protocol contracts after dual authorization — the Consortium notary signatures **and** the Bascule attestation. There is no open `mint()` callable by arbitrary users.

**Mint requires backing:** Yes in protocol design — LBTC is minted only against a BTC deposit that has been notarized by the Consortium and independently recorded by Bascule. However, backing is **off-chain BTC custody**; the onchain mint check verifies signatures/attestations, not an onchain BTC balance. A compromise of the notary quorum + Bascule would be required to mint unbacked tokens.

**Per-address mint authority** (verified onchain May 26, 2026 via `RoleGranted` events + `hasRole`; no `RoleRevoked` events ever emitted):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x9eCe5fB1aB62d9075c4ec814b321e24D8EA021ac`](https://etherscan.io/address/0x9eCe5fB1aB62d9075c4ec814b321e24D8EA021ac) | ✓ | ✓ | `MINTER_ROLE` | AssetRouter (proxy) — main mint/redeem router, `getAssetRouter()` |
| [`0x451C54981C7da5d95901B770c540547cf5FE0a2D`](https://etherscan.io/address/0x451C54981C7da5d95901B770c540547cf5FE0a2D) | ✓ | ✓ | `MINTER_ROLE` | `BridgeV2` (proxy) — cross-chain bridge mints LBTC on arrival |
| [`0xcd1B5b2e6c1ff8b606cf4B5731e2F3361474C01b`](https://etherscan.io/address/0xcd1B5b2e6c1ff8b606cf4B5731e2F3361474C01b) | — | — | `CLAIMER_ROLE` | EOA — claims/processes yield (not a minter) |
| [`0xad67Ba2795770C8e0B70E2896C0F81F9d313FD44`](https://etherscan.io/address/0xad67Ba2795770C8e0B70E2896C0F81F9d313FD44) | — | — | `PAUSER_ROLE` | Gnosis Safe 2-of-11 — can pause transfers & mint/burn |
| [`0x055E84e7FE8955E2781010B866f10Ef6E1E77e59`](https://etherscan.io/address/0x055E84e7FE8955E2781010B866f10Ef6E1E77e59) | — | — | `DEFAULT_ADMIN_ROLE` | Lombard Timelock (24 h) — can grant/revoke all roles |

`MINTER_ROLE` is therefore held only by two protocol contracts (AssetRouter, BridgeV2), both behind the Consortium + Bascule authorization gate. New minters can only be added by `DEFAULT_ADMIN_ROLE` = the 24-h Timelock.

**Rate limits / supply caps (verified onchain, identical on two RPCs):** **No global supply cap** on the AssetRouter mint path — `depositMinAmount(LBTC)` is set to `type(uint256).max` (the permissionless `deposit()` mint path is effectively disabled on Ethereum; BTC-deposit mints arrive via the notary-gated `batchMint`/`batchMintWithFee`), and `maxMintCommission(LBTC)` = 68 sats, which bounds the *fee* a claimer may charge, not the mint *amount*.

The **BridgeV2 mint path IS rate-limited in the deployed contract** (correcting an earlier draft). `RateLimitsSet` events configure per-token, per-destination-chain limits for LBTC, and the verified source calls `RateLimits.updateLimit(...)` before minting. Configured LBTC limits are **10,000,000,000 (= 100 LBTC) per 10,800 s (3 h) window** on most destination chains (one chain set to 250 LBTC / 3 h); `getTokenRateLimit(LBTC, chainId)` returns these. Sherlock **H-1 ("BridgeV2 deposits are not rate limited") was marked acknowledged-won't-fix at audit time, but the current deployment does configure and enforce these limits** — so the bridge mint path is throttled today. (H-2 and H-5 remain; see Audits.)

**Backing check at mint time:** Dual off-chain attestation (Consortium 12-of-16 notary signatures + Bascule deposit record). Not an atomic onchain collateral transfer.

### Collateralization

- LBTC is **1:1 backed by native BTC** held off the Bitcoin chain by the **Lombard Security Consortium**. There are **no named third-party custodians** (e.g. BitGo/Fireblocks/Copper) — per Lombard's docs the consortium notaries *are* the custodial signers, using threshold cryptography with keys generated inside HSMs via **Cubist / CubeSigner** ("private keys are generated inside HSMs and never leave secure hardware"). Documented custody threshold is **10-of-14** members. Collateral quality is the highest available (native BTC), but **custody is off-chain** — there is no trustless onchain BTC vault, and the custodial set is the consortium itself rather than independent regulated custodians.
- The staked BTC is delegated into **Babylon**, which introduces **slashing risk** (validator misbehavior could cause partial BTC loss) — a new and relatively untested mechanism.
- Risk curation for downstream lending (LLTV, caps, liquidation) is set by each integrating market (e.g. Morpho market creators / Yearn-curated vaults), not by Lombard.

### Provability

- **Onchain reserve registry (verified):** Lombard publishes its BTC reserve addresses through a **`PoR` registry contract on Base** at [`0xe7Ebc588F4EC9297d9867aD75a9b5D86848c8018`](https://basescan.org/address/0xe7Ebc588F4EC9297d9867aD75a9b5D86848c8018) (TransparentUpgradeableProxy → impl `PoR` `0x0bb6…70cc`). It exposes the **Chainlink Proof-of-Reserve standard interface** (`getPoRAddressListLength()`, `getPoRAddressSignatureMessages()`, plus `addAddresses`/`addRootPubkey` gated by `OPERATOR_ROLE`). As of May 26, 2026 it lists **28,626 reserve addresses** (verified identically on two Base RPCs). This registry is the data source Chainlink/RedStone PoR feeds consume.
- **Rate feeds vs reserve quantity:** The Ethereum feeds — RedStone [`0xb415…0bc81`](https://etherscan.io/address/0xb415eAA355D8440ac7eCB602D3fb67ccC1f0bc81) and Chainlink [`0x5c29…3212`](https://etherscan.io/address/0x5c29868C58b6e15e2b962943278969Ab6a7D3212) — report the **LBTC/BTC exchange rate** (~1.004, matching `getRate()`), **not** an absolute BTC reserve quantity. There is **no dedicated Chainlink reserve-quantity PoR feed** listed for Ethereum; reserve-quantity provability runs through the Base `PoR` address registry above.
- **Caveat:** reconciling circulating LBTC against custodied BTC still requires trusting (a) the consortium's reported deposit-address set in the registry and (b) the off-chain BTC actually held at those addresses. This is **registry/attestation-based provability**, stronger than a bare oracle but not trustless onchain verification. Sherlock **H-5** (acknowledged-won't-fix) further notes that permissioned CBBTC/BTCB-swap mints are not notarized, which can make the LBTC/BTC ratio incorrect and some LBTC unredeemable.
- The LBTC/BTC rate is updated by a privileged oracle/operator role rather than derived algorithmically from onchain reserves.

## Liquidity Risk

**Exit paths:**

1. **Protocol redemption** — burn LBTC, receive native BTC after ~9 days (Babylon unbonding). Deepest exit, but slow.
2. **Secondary onchain markets** — swap LBTC → WBTC/BTC.

**Onchain liquidity (DefiLlama yields, Ethereum, May 26, 2026):**

| Venue | Pool | TVL |
|-------|------|-----|
| Lombard (staking) | LBTC | $745.7M |
| Spark (SparkLend) | LBTC (collateral) | $216.0M |
| Aave v3 | LBTC (collateral) | $148.5M |
| Veda | LBTCV | $81.5M |
| Morpho Blue | LBTC (collateral, all markets) | ~$58.7M |
| Uniswap v3 | WBTC-LBTC | $7.0M + $1.2M |
| Curve | LBTC-WBTC | $0.8M |

LBTC is deeply integrated as **lending collateral** (Aave, Spark, Morpho) but **direct swap depth is modest** (~$8–9M across Uniswap v3 + Curve). CEX/aggregator spot volume is low (~$0.74M/24h per CoinGecko). A large holder exiting via DEX would face meaningful slippage; the size-insensitive exit is the 9-day redemption.

**Morpho usage (the issue's context):** ~$58.7M LBTC supplied as collateral on Ethereum Morpho markets:

| Market | LLTV | Collateral | Borrow | Util |
|--------|------|-----------|--------|------|
| [LBTC/PYUSD](https://app.morpho.org/ethereum/market/0x6a7e36eb088bd501d73f7ab4c5b8671358559341a78ce521c9e499dc0bc642b9) | 86.0% | $49.74M | $32.59M | 89% |
| [LBTC/USDC](https://app.morpho.org/ethereum/market/0xbf02d6c6852fa0b8247d5514d0c91e6c1fbde9a168ac3fd2033028b5ee5ce6d0) | 86.0% | $5.30M | $2.65M | 91% |
| [LBTC/WBTC](https://app.morpho.org/ethereum/market/0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549) | 94.5% | $2.91M | $2.59M | 100% |
| [LBTC/EURCV](https://app.morpho.org/ethereum/market/0x9551f52490815c3dd64dcd349050ce6f42ef64d70f5805c14920b4fd6d3b2544) | 86.0% | $0.64M | $0.24M | 93% |
| [LBTC/cbBTC](https://app.morpho.org/ethereum/market/0x444bbce85350aae535b037d090c8bdf6cc4cfc6d79e17725413b4cb0f6183ad4) | 94.5% | $0.15M | $0.14M | 96% |

For Morpho liquidations, what matters is the LBTC/BTC oracle behaving correctly and DEX depth to unwind seized collateral. The historical ~6% discount (ATL 0.944 BTC) and high LLTVs (86–94.5%) mean an LBTC depeg is the primary liquidation-risk vector for these markets.

## Centralization & Control Risks

### Governance

- **Upgradeability:** The LBTC token **and both minter contracts are upgradeable**, each behind its own `ProxyAdmin`, and **all three ProxyAdmins are owned by the Lombard Timelock** ([`0x055E…7e59`](https://etherscan.io/address/0x055E84e7FE8955E2781010B866f10Ef6E1E77e59), `getMinDelay() = 24 h`):
  - LBTC token → ProxyAdmin [`0xbAE0…f879`](https://etherscan.io/address/0xbAE061C73876952aA2C5e483b74dfA785425f879)
  - AssetRouter → ProxyAdmin [`0xBf42…6754`](https://etherscan.io/address/0xBf4202c8a0d852D432266dfE112ED624a1a36754)
  - BridgeV2 → ProxyAdmin [`0x6B06…cbB1`](https://etherscan.io/address/0x6B06CC8D89aD50962563bC5cFE1FF80Ec0b8cbB1)
  - **Implication:** an upgrade to *either minter* can change mint/burn behaviour **without any new `MINTER_ROLE` grant** — so the minter implementations are part of the trust surface and must be monitored alongside the token. All such upgrades are gated by the 24-hour timelock (positive control).
- **Timelock roles (verified onchain on two RPCs):** PROPOSER = the **Treasury Safe (3-of-5)** [`0x251a…4892`](https://etherscan.io/address/0x251a604E8E8f6906d60f8dedC5aAeb8CD38F4892) **and** an **EOA** [`0x3f6b…a079`](https://etherscan.io/address/0x3f6bf1c36ccbb59eaf8415301a0cec73c344a079); EXECUTOR + CANCELLER = the Treasury Safe only. The EOA holds **PROPOSER only — `hasRole(CANCELLER_ROLE, 0x3f6b…) = false`**. So the EOA can *queue* (but not cancel or execute) timelock operations; the 24-h delay, the 3-of-5 executor, and the Safe's exclusive cancel right are the mitigating controls. The EOA proposer is still a minor centralization wart.
- **Token roles (verified onchain):** `DEFAULT_ADMIN_ROLE` = Timelock; `PAUSER_ROLE` = a **2-of-11 Gnosis Safe**. The low pause threshold (2 of 11) means a small group can **freeze transfers and mint/burn** — a freeze would also block normal liquidation of LBTC collateral on Morpho.
- **Off-chain notary set (Consortium, verified onchain at epoch 21):** **16 validators, weight threshold 12** → **12-of-16** signatures required to authorize mint/burn/bridge operations.
- **Documentation-vs-onchain discrepancy:** Lombard's docs list **14 institutional members** with a documented **10-of-14** (two-thirds) policy — Galaxy, OKX, Kraken, DCG, Amber, Wintermute, Antpool, F2Pool, Bitwise, Figment, Kiln, P2P, Cubist, Nansen. The onchain notary set, however, is **16 keys / threshold 12**. These **do not match** and the docs do not state "16/12". The extra keys may be Lombard-operated or otherwise undocumented — this is flagged as an open discrepancy, not reconciled by assumption.
- **Defense in depth:** The **Bascule** (`GMPBasculeV1`) provides an independent second attestation — a mint requires both the Consortium quorum and a matching Bascule deposit record, so compromising the notary keys alone is insufficient.

### Programmability

- The token is an OZ AccessControl + AccessControlDefaultAdminRules upgradeable ERC-20 (`StakedLBTC`). Yield is reflected via `getRate()`, which is **updated by a privileged role/oracle**, not computed algorithmically from onchain reserves — hybrid onchain/offchain accounting.
- Mint/redeem, BTC custody, Babylon staking, and rebalancing are coordinated **off-chain by the Consortium**; the onchain contracts verify signatures and enforce roles. This is a meaningful off-chain operational surface.

### External Dependencies

1. **Babylon** — Bitcoin staking + slashing (new, comparatively untested). Critical to the yield and to backing integrity.
2. **Bitcoin network** — custody and settlement.
3. **Lombard Consortium infrastructure** — 12-of-16 notary signing (CubeSigner/Cubist HSMs).
4. **Bascule / Cubist** — independent attestation layer.
5. **Oracles** — Chainlink + RedStone for LBTC/BTC rate and PoR; downstream lending markets (Morpho, Aave) depend on these for liquidation pricing.

Failure or compromise of Babylon, the consortium custody, or the rate oracle would each materially impair LBTC.

## Operational Risk

- **Team:** Partially doxxed. Co-founder **Jacob Phillips** (ex-Polychain) is public; other named team members exist. Backed by a **$16M seed led by Polychain Capital** with Babylon, Foresight, Mirana, OKX Ventures, Binance Labs, and others.
- **Documentation:** Strong — architecture, security, audits, oracles, and a full smart-contract registry are published on GitBook; contracts are source-verified on Etherscan.
- **Legal structure / jurisdiction:** The Terms of Service name **Lombard Finance Ltd** as operator, governed by **Cayman Islands law** with disputes via binding arbitration **seated in the Cayman Islands**; US persons and sanctioned jurisdictions are excluded. (ToS does not literally state the place of incorporation, but Cayman governing law + Cayman-seated arbitration strongly indicate a Cayman entity.)
- **Incident response:** Pauser multisig + 24-h upgrade timelock provide emergency tooling; no public formal IR plan reviewed.

## Monitoring

Recommended monitored addresses, signals, and frequency.

### 1. Backing / Proof of Reserve (MANDATORY)
- Compare total LBTC supply (Ethereum `LBTC.totalSupply()` + cross-chain) against custodied BTC via the Base `PoR` registry [`0xe7Eb…8018`](https://basescan.org/address/0xe7Ebc588F4EC9297d9867aD75a9b5D86848c8018) — `getPoRAddressListLength()` (28,626 as of this assessment) and the listed addresses; watch `addAddresses`/`deleteAddresses`/`addRootPubkey` events for registry changes.
- RedStone feed [`0xb415…0bc81`](https://etherscan.io/address/0xb415eAA355D8440ac7eCB602D3fb67ccC1f0bc81) and Chainlink LBTC/BTC [`0x5c29…3212`](https://etherscan.io/address/0x5c29868C58b6e15e2b962943278969Ab6a7D3212) — alert if `getRate()`/feed deviates sharply or stops updating.
- **Threshold:** flag if reported reserve < circulating LBTC, or rate feed staleness > expected heartbeat.

### 2. Upgrades & Role Changes (MANDATORY)
- Monitor `Upgraded` on **all three proxies**, since each can change mint/burn behaviour without a new role grant:
  - LBTC token [`0x8236…4494`](https://etherscan.io/address/0x8236a87084f8B84306f72007F36F2618A5634494) (ProxyAdmin [`0xbAE0…f879`](https://etherscan.io/address/0xbAE061C73876952aA2C5e483b74dfA785425f879))
  - AssetRouter [`0x9eCe…21ac`](https://etherscan.io/address/0x9eCe5fB1aB62d9075c4ec814b321e24D8EA021ac) (ProxyAdmin [`0xBf42…6754`](https://etherscan.io/address/0xBf4202c8a0d852D432266dfE112ED624a1a36754))
  - BridgeV2 [`0x451C…0a2D`](https://etherscan.io/address/0x451C54981C7da5d95901B770c540547cf5FE0a2D) (ProxyAdmin [`0x6B06…cbB1`](https://etherscan.io/address/0x6B06CC8D89aD50962563bC5cFE1FF80Ec0b8cbB1))
- Monitor `RoleGranted`/`RoleRevoked` on LBTC (esp. new `MINTER_ROLE` holders), `RateLimitsSet` on BridgeV2 (a raised/removed bridge limit), and `CallScheduled` on the Timelock [`0x055E…7e59`](https://etherscan.io/address/0x055E84e7FE8955E2781010B866f10Ef6E1E77e59) — the 24-h delay is the window to react.
- Alert immediately on any new minter, any minter-proxy upgrade, or any timelock operation scheduled by the EOA proposer [`0x3f6b…a079`](https://etherscan.io/address/0x3f6bf1c36ccbb59eaf8415301a0cec73c344a079).

### 3. Pause State (MANDATORY for Morpho exposure)
- `LBTC.paused()` and `mintBurnPaused()` — a transfer pause would block liquidations of LBTC Morpho collateral.
- Monitor the Pauser Safe [`0xad67…FD44`](https://etherscan.io/address/0xad67Ba2795770C8e0B70E2896C0F81F9d313FD44).

### 4. Consortium Notary Set
- Watch the `Consortium` [`0xdAD5…95E4`](https://etherscan.io/address/0xdAD58DfA5c1a7a34419AFdBE1f0d610efeea95E4) for validator-set / epoch changes (currently epoch 21, 12-of-16). Alert on threshold reductions or membership churn.

### 5. Peg & Liquidity
- LBTC/BTC market price (CoinGecko / DEX). **Alert: sustained discount > 2%** (historical ATL ~0.944 BTC). Relevant to Morpho liquidation safety given 86–94.5% LLTVs.
- DEX swap depth (Uniswap v3 WBTC-LBTC, Curve LBTC-WBTC).

**Frequency:** rate/peg and pause state — hourly; upgrades/roles/timelock — event-driven (immediate); consortium set — daily.

## Appendix: Contract Architecture

```
GOVERNANCE
  EOA deployer 0x3f6b…a079 ──(PROPOSER only)──────┐
  Treasury Safe 0x251a…4892 (3-of-5) ─(PROP/EXEC/CANCEL)─┤
                                                    ▼
                          LombardTimeLock 0x055E…7e59 (24h)
                            │ owns 3 ProxyAdmins + DEFAULT_ADMIN_ROLE on LBTC
                            │   token PA 0xbAE0…f879
                            │   AssetRouter PA 0xBf42…6754
                            │   BridgeV2 PA 0x6B06…cbB1
                            ▼
TOKEN + MINTER LAYER (all upgradeable via timelock)
  LBTC proxy 0x8236…4494  ──impl──►  StakedLBTC 0x0720…2bd9
     ├─ MINTER_ROLE ─► AssetRouter 0x9eCe…21ac ─┐
     ├─ MINTER_ROLE ─► BridgeV2   0x451C…0a2D ─┤ (mint gated by ↓; BridgeV2 rate-limited)
     ├─ PAUSER_ROLE ─► Safe 0xad67…FD44 (2/11)  │
     └─ Bascule()  ─► GMPBasculeV1 0xC3ec…38eD ─┤
                                                │
PROTOCOL / TRUST LAYER                          │
  Consortium 0xdAD5…95E4  (12-of-16 notaries) ──┘ dual-auth: Consortium + Bascule
                            │
UNDERLYING / EXTERNAL                            │
  Babylon Bitcoin staking (slashing)  ◄── staked BTC delegated
  Native BTC custody (consortium notaries, Cubist HSM threshold, off-chain)
  Rate feeds: Chainlink 0x5c29…3212 + RedStone 0xb415…0bc81  (LBTC/BTC rate)
  Reserve registry: PoR 0xe7Eb…8018 on Base (28,626 addrs, Chainlink PoR std)

DOWNSTREAM (Yearn interest)
  Morpho markets: LBTC collateral (~$58.7M; LBTC/PYUSD 86% LLTV dominant)
  Aave v3 ($148M), SparkLend ($216M)
```

---

## Risk Summary

### Key Strengths

1. **Heavily audited** — 10 reports from 6 firms incl. OpenZeppelin ×3 and Sherlock on the live yield-bearing implementation; $250K Immunefi bounty.
2. **Native-BTC backing** (highest collateral quality) and largest BTC LST by TVL (~$973M staked BTC).
3. **24-hour upgrade timelock** owns all three ProxyAdmins (token + both minters) and holds `DEFAULT_ADMIN_ROLE`; minting restricted to two protocol contracts, and the BridgeV2 mint path is onchain rate-limited.
4. **Defense in depth on mint** — Consortium 12-of-16 notary quorum **plus** an independent Bascule attestation; compromising one is insufficient.
5. **Onchain PoR registry** — a Chainlink-PoR-standard `PoR` contract on Base publishes 28,626 BTC reserve addresses, consumed by Chainlink + RedStone feeds.
6. **Long, large track record** — TVL continuously >$500M for ~19 months (peak ~$2.2B), no exploits or protocol depegs.

### Key Risks

1. **Open High-severity audit findings** — Sherlock H-2 (BridgeV2 `deposit()` burns from relayer) and **H-5** remain acknowledged-won't-fix; H-5 can make the LBTC/BTC ratio incorrect and leave some LBTC unredeemable, directly relevant to Morpho collateral use. (H-1, "bridge not rate-limited," is now mitigated onchain via configured `RateLimitsSet` limits.)
2. **Off-chain BTC custody** — backing depends on the consortium's own threshold-controlled custody (no named third-party custodians; keys in Cubist/CubeSigner HSMs), not a trustless onchain vault.
3. **Babylon slashing** — a new, relatively untested mechanism that could cause partial BTC loss.
4. **EOA timelock proposer** + **2-of-11 pause multisig** — centralization warts; a pause would freeze transfers and block Morpho liquidations.
5. **Slow primary exit** — redemption takes ~9 days; direct DEX swap depth is modest (~$8–9M), so large fast exits incur slippage. Historical depeg to ~0.944 BTC combined with 86–94.5% LLTV Morpho markets makes an LBTC discount the main liquidation-risk vector.

### Critical Risks `[If Any]`

- None that trigger a critical gate. The dominant tail risks are consortium custody compromise (12-of-16 collusion/coercion) and a Babylon slashing event — both would impair backing and could cause a sustained depeg that cascades into LBTC-collateralized Morpho positions. Sherlock H-5 (unfixed) is a standing accounting/redeemability weakness rather than a realized loss.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** → PASS — extensively audited (OZ, Sherlock, Veridise, Halborn, ABDK).
- [x] **Unverifiable reserves** → PASS (qualified) — BTC custody is off-chain but attested by an onchain `PoR` address registry (28,626 addresses on Base) and consumed by Chainlink + RedStone feeds. The aggregate cross-check (DefiLlama staked-BTC ≥ circulating LBTC) shows no sign of under-backing, **but an exact, independent 1:1 reserve-vs-supply sum was not reproduced in this assessment** (requires aggregating the registry's Bitcoin addresses); reserve equality remains attestation/operator-dependent. Gate passes on attestation + aggregate, not trustless proof — see *Supply vs Reserves Reconciliation*.
- [x] **Total centralization** → PASS — 24-h timelock + multisig + 12-of-16 consortium; not a single EOA.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- Audits: 10 reports / 6 firms incl. 3 top-tier (coverage → 1); $250K Immunefi bounty (>$200K → 2); moderately complex surface; **two still-open acknowledged-won't-fix High-severity findings (H-2, H-5)** on the live implementation temper the otherwise excellent posture (H-1 mitigated onchain) → **2.0**.
- Historical: ~21–24 months in production; TVL sustained well above $100M (~$1B), no incidents → **1.5** (time-bracketed).

**Audits & Historical = (2.0 + 1.5)/2 = 1.75**

**Score: 1.75/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 3.0** — all three proxies (token + both minters) are upgradeable, but every ProxyAdmin and `DEFAULT_ADMIN_ROLE` sits behind the 24-h timelock (good); the only EOA timelock right is PROPOSER (not cancel/execute), and pausing is a 2-of-11 Safe.
- **Programmability: 3.0** — rate is privileged-role/oracle updated and custody/staking/notarization are off-chain (hybrid). The BridgeV2 mint path enforces onchain rate limits (H-1 mitigated); H-2 and H-5 remain open but are specific code-path issues rather than a systemic programmability failure.
- **External Dependencies: 4.0** — Babylon (new slashing), off-chain consortium custody, Bascule/Cubist, and rate oracles are all critical.

**Centralization = (3.0 + 3.0 + 4.0)/3 = 3.33**

**Score: 3.33/5**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 3.0** — 100% native-BTC backing (top quality) but off-chain custodial; Babylon slashing risk.
- **Provability: 3.0** — onchain `PoR` registry on Base (28,626 reserve addresses, Chainlink PoR-standard interface) plus RedStone/Chainlink rate feeds is better than a bare oracle, but the rate feeds are not reserve-quantity feeds and an exact 1:1 reserve-vs-supply sum could not be reproduced independently (see *Supply vs Reserves Reconciliation*); reserve equality stays attestation/operator-dependent, and Sherlock H-5 means the ratio can be incorrect and some LBTC unredeemable. Registry strength vs the reconciliation gap and H-5 → held at 3.0.

**Funds Management = (3.0 + 3.0)/2 = 3.0**

**Score: 3.0/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Primary exit is 9-day redemption; deep lending integration but modest direct swap depth (~$8–9M DEX) and low spot volume. Large fast exits face slippage. Historical discount to ~0.944 BTC.

**Score: 3.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Doxxed co-founder, reputable backers, strong docs, verified contracts; legal entity is Lombard Finance Ltd under Cayman Islands law.

**Score: 2.0/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.75 | 20% | 0.35 |
| Centralization & Control | 3.33 | 30% | 1.00 |
| Funds Management | 3.0 | 30% | 0.90 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Base Weighted Score** | | | **2.80/5.0** |

**Optional Modifiers:**
- Live >2 years with no incidents: not applied (production ~21–24 months; just under 2 years).
- **TVL >$500M for >1 year: QUALIFIES** (−0.5) — DefiLlama shows TVL continuously above $500M since ~Oct 5, 2024 (~19 months). **Applying it would give 2.30 (Low Risk).** However, per the framework's conservative guidance, the modifier is **withheld**: it is meant to reward a clean, mature track record, and that credit is undercut by the open acknowledged-won't-fix High-severity findings (H-2 and especially **H-5**, which affects LBTC redeemability/accounting) plus the off-chain-custody reserve-reconciliation gap. The reviewer may choose to apply it; doing so moves the token to the Low-Risk tier boundary.

**Final Score: 2.80/5.0** (modifier withheld).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk** (2.80/5.0) — approved with enhanced monitoring. Strong audit posture and native-BTC backing are offset by off-chain custodial trust (no independent 1:1 reserve proof reproduced), Babylon slashing exposure, the open H-2/H-5 audit findings, and centralization/liquidity frictions that matter for high-LLTV Morpho collateral use. (If the −0.5 TVL-longevity modifier is applied, the score is 2.30 / Low Risk; held conservatively at Medium.)

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months.
- **TVL-based:** Reassess if staked-BTC backing changes by more than 30%.
- **Peg-based:** Reassess on any sustained LBTC/BTC discount > 2%.
- **Incident-based:** Reassess after any Babylon slashing event, consortium membership/threshold change, an implementation upgrade to the **token or either minter (AssetRouter / BridgeV2)** proxy, new `MINTER_ROLE` grant, a removed/raised BridgeV2 rate limit, or a transfer pause.

---

## Open TODOs (for follow-up)

Most original TODOs are now resolved (audit findings, PoR registry, mint caps, legal entity, TVL history, custody model, third-party coverage). Remaining open items:

1. **Exact reserve-vs-supply proof:** aggregate the BTC balances of the 28,626 addresses in the Base `PoR` registry (Bitcoin-chain query) and compare to circulating LBTC for a true 1:1 check; the current assessment only did an aggregate cross-check (DefiLlama staked-BTC ≥ circulating LBTC). Also document the PoR feed heartbeat/attestation cadence.
2. **H-2 deployment status:** independently verify whether Sherlock H-2 (BridgeV2 `deposit()` burns from relayer) is still exploitable in the deployed contract (H-1 confirmed mitigated; H-5 still open by design; OZ M-01 still open).
3. **Consortium key discrepancy:** onchain notary set is 16 keys / threshold 12, but docs state 14 institutional members / 10-of-14. The identity of the extra onchain keys is undocumented — ask Lombard or monitor `Consortium` validator-set changes. Do not reconcile by assumption.
4. **Legal incorporation specifics:** ToS implies a Cayman entity (Cayman law + Cayman-seated arbitration) but does not state the registered place of incorporation verbatim — confirm if a precise entity record is needed.

## Sources

- Lombard docs: https://docs.lombard.finance/
- Audits: https://docs.lombard.finance/learn/security/audits
- Bug bounty: https://docs.lombard.finance/learn/security/bug-bounty ; https://immunefi.com/bug-bounty/lombard-finance/scope/
- Smart contracts: https://docs.lombard.finance/learn/transparency/smart-contracts
- Oracles / PoR: https://docs.lombard.finance/learn/transparency/oracles
- DefiLlama: https://defillama.com/protocol/lombard ; https://yields.llama.fi/pools ; https://api.llama.fi/protocol/lombard (TVL history)
- Consortium members: https://docs.lombard.finance/learn/security/consortium-members
- Audit PDFs (raw): https://raw.githubusercontent.com/lombard-finance/evm-smart-contracts/main/docs/audit/Sherlock_YB.pdf ; https://raw.githubusercontent.com/lombard-finance/evm-smart-contracts/main/docs/audit/OZ_YB.pdf
- Terms of Service (legal entity): https://docs.lombard.finance/legals/terms-of-service
- Chaos Labs LBTC risk assessment: https://governance.ether.fi/t/lombard-btc-risk-assessment/2308
- Base PoR registry (Basescan): https://basescan.org/address/0xe7Ebc588F4EC9297d9867aD75a9b5D86848c8018
- CoinGecko LBTC: https://www.coingecko.com/en/coins/lombard-staked-btc
- Morpho Blue API: https://blue-api.morpho.org/graphql
- Onchain verification via `cast` (Ethereum) + Etherscan V2 API, May 26, 2026
