# Protocol Risk Assessment: Flare — FXRP

- **Assessment Date:** August 21, 2026
- **Token:** FXRP (Flare FAsset of XRP)
- **Chain:** Ethereum
- **Token Address:** [`0xCE6170EA245dC8D1f275A710a062b70f125F0110`](https://etherscan.io/address/0xCE6170EA245dC8D1f275A710a062b70f125F0110)
- **Final Score: 2.7/5.0**

## Overview + Links

**FXRP** is Flare's **FAsset representation of XRP** — an over-collateralized, trustless wrapped XRP that lets XRP flow into EVM DeFi. The *canonical* FXRP lives on the **Flare** network (chain ID 14), where it is minted by the [FAssets system](https://dev.flare.network/fassets/overview): a user sends XRP to an agent on the XRP Ledger (XRPL), the [Flare Data Connector (FDC)](https://dev.flare.network/fdc/overview) verifies the deposit, and FXRP is minted on Flare. FXRP is redeemable 1:1 back to XRP at any time, and is over-collateralized by agents via vault collateral (stablecoins) plus a community FLR collateral pool.

**On Ethereum, FXRP is deployed as a native [LayerZero Omnichain Fungible Token (OFT)](https://dev.flare.network/fxrp/oft)** at [`0xCE6170EA245dC8D1f275A710a062b70f125F0110`](https://etherscan.io/address/0xCE6170EA245dC8D1f275A710a062b70f125F0110). It is a **bridged representation** of the canonical Flare FXRP: the [Flare OFT Adapter](https://flare-explorer.flare.network/address/0xd70659a6396285BF7214d7Ea9673184e7C72E07E) locks canonical FXRP on Flare, and the Ethereum (and Base/BNB/Katana/HyperEVM/HyperCore) OFTs mint/burn their own local supply in response to LayerZero messages. There is no native XRP on Ethereum — FXRP-on-Ethereum is a cross-chain claim on the Flare-side lock, not a direct XRP wrapper.

**Use case being assessed (from issue #419):** FXRP as **collateral in a lending market**, analogous to the live [Morpho FXRP/RLUSD market](https://app.morpho.org/ethereum/market/0x4fa31e3f8ba345227d44e1cf48559eea53a90dd5311dc006984c060f2f311d96/fxrp-rlusd) (LLTV 77%). The plan is to use FXRP on **Katana**, which requires bridging via LayerZero.

**Key onchain metrics (August 21, 2026, Ethereum block 25,802,687):**

| Metric | Value |
|--------|-------|
| FXRP total supply (Ethereum) | **10,297,973.67 FXRP** |
| FXRP price | ~$1.373 (tracks XRP, [DeFiLlama](https://coins.llama.fi/prices/current/ethereum:0xCE6170EA245dC8D1f275A710a062b70f125F0110)) |
| Canonical FXRP supply (Flare) | ~147,843,478 FXRP |
| Flare OFT Adapter escrow (backs all remote chains) | ~15,829,756.90 FXRP |
| Ethereum share of remote supply | ~65% |
| Morpho Blue FXRP collateral | ~9.94M FXRP (~96.5% of Ethereum supply) |
| FXRP DEX liquidity (Ethereum) | ~$3.05M (Uniswap V3 RLUSD-FXRP) |
| Deployment date | February 10, 2026 (~6.3 months) |

**Links:**

- [FXRP Overview (Flare Developer Hub)](https://dev.flare.network/fxrp/overview)
- [FXRP OFT Docs](https://dev.flare.network/fxrp/oft)
- [FAssets Overview](https://dev.flare.network/fassets/overview)
- [FXRP Operational Parameters](https://dev.flare.network/fxrp/parameters)
- [Flare Network Docs](https://dev.flare.network/)
- [Flare Smart Accounts](https://dev.flare.network/smart-accounts/overview)
- [GitHub — flare-foundation](https://github.com/flare-foundation)
- [Audits](https://dev.flare.network/support/audits)
- [Bug Bounty (Immunefi)](https://immunefi.com/bug-bounty/flarenetwork/information/)
- [Morpho FXRP/RLUSD market](https://app.morpho.org/ethereum/market/0x4fa31e3f8ba345227d44e1cf48559eea53a90dd5311dc006984c060f2f311d96/fxrp-rlusd)

## Contract Addresses

### Ethereum (assessed chain)

| Contract | Address | Role |
|----------|---------|------|
| FXRP (proxy) | [`0xCE6170EA245dC8D1f275A710a062b70f125F0110`](https://etherscan.io/address/0xCE6170EA245dC8D1f275A710a062b70f125F0110) | TransparentUpgradeableProxy; native LayerZero OFT. `token() == self`, `oftVersion() == 1`, `sharedDecimals() == 6` |
| FXRP implementation | [`0x0baf2d2108ea856514136c97612646623a76d024`](https://etherscan.io/address/0x0baf2d2108ea856514136c97612646623a76d024) | `FXRPOFT` (source-verified), extends LayerZero `OFTFeeUpgradeable` |
| FXRP ProxyAdmin | [`0x93bfc1329d6d4d94825434b2c0b55f56b34695c7`](https://etherscan.io/address/0x93bfc1329d6d4d94825434b2c0b55f56b34695c7) | OpenZeppelin ProxyAdmin; can upgrade the FXRP implementation |
| FXRP owner (multisig) | [`0x42D660C6C871a9176cEb102E9ad9722459Aa67D3`](https://etherscan.io/address/0x42D660C6C871a9176cEb102E9ad9722459Aa67D3) | Gnosis Safe v1.4.1, **6-of-11**. Owns the OFT (`owner()`) and the ProxyAdmin |
| LayerZero EndpointV2 | [`0x1a44076050125825900e736c501f859c50fE728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c) | Authenticates and delivers OFT messages; the only caller of `lzReceive` that can mint/burn FXRP on Ethereum |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Holds ~9.94M FXRP (~96.5% of Ethereum supply) as lending collateral |
| RLUSD | [`0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD`](https://etherscan.io/address/0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD) | Loan asset in the Morpho FXRP/RLUSD market |

### Flare (canonical chain)

| Contract | Address | Role |
|----------|---------|------|
| Canonical FXRP | [`0xAd552A648C74D49E10027AB8a618A3ad4901c5bE`](https://flare-explorer.flare.network/address/0xAd552A648C74D49E10027AB8a618A3ad4901c5bE) | FAsset ERC-20 minted by the FAssets system (proxy; not Ownable) |
| FXRP OFT Adapter | [`0xd70659a6396285BF7214d7Ea9673184e7C72E07E`](https://flare-explorer.flare.network/address/0xd70659a6396285BF7214d7Ea9673184e7C72E07E) | Locks canonical FXRP when bridging out (`token()` = canonical FXRP); holds ~15.83M FXRP escrow |
| Flare adapter owner | [`0xbe653C54DF337F13Fcb726101388F4a4803049F3`](https://flare-explorer.flare.network/address/0xbe653C54DF337F13Fcb726101388F4a4803049F3) | Gnosis Safe **6-of-11** (same signer set as the Ethereum Safe) |

### Katana (target chain for the lending use case)

| Contract | Address | Role |
|----------|---------|------|
| FXRP OFT | [`0x565f9415b9c285c03c008e73088148f28d218059`](https://explorer.katanarpc.com/address/0x565f9415b9c285c03c008e73088148f28d218059) | Native OFT on Katana (chain ID 747474, LZ EID 30375); peers back to Ethereum/Flare/Base/BNB. Supply ~145.8 FXRP (negligible today) |
| Katana LayerZero EndpointV2 | [`0x6F475642a6e85809B1c36Fa62763669b1b48DD5B`](https://explorer.katanarpc.com/address/0x6F475642a6e85809B1c36Fa62763669b1b48DD5B) | Katana's EndpointV2 (EID 30375) |
| Katana FXRP owner | [`0xb8bcdEb56Aa56ef2e89E01f9E4b2641C61CbD257`](https://explorer.katanarpc.com/address/0xb8bcdEb56Aa56ef2e89E01f9E4b2641C61CbD257) | Owner of the Katana FXRP OFT |

**Supply reconciliation (Pass 1.5, August 21, 2026):** the Flare OFT Adapter holds **15,829,756.90** canonical FXRP in escrow. Summing the remote OFT supplies: Ethereum 10,297,973.67 + Base 524,342.76 + BNB 130,070.57 + Katana 145.83 + HyperEVM 1,079,249.22 = **12,031,782.05** verified onchain. The ~3.8M FXRP remainder is on HyperCore (Hyperliquid L1, address [`0x2000…016f`](https://app.hyperliquid.xyz/explorer/address/0x200000000000000000000000000000000000016f)), which could not be queried directly — the two figures reconcile within that assumption, confirming the lock invariant (remote supply ≈ adapter escrow). Ethereum is by far the dominant remote chain (~65% of bridged FXRP).

## Audits and Due Diligence Disclosures

The FXRP/FAssets stack has an extensive, multi-firm audit history. The Ethereum FXRP token itself is a thin wrapper (`FXRPOFT` → `FAssetOFT` → LayerZero's standard, widely-audited `OFTFeeUpgradeable`), so the material audit surface is the FAssets system and the OFT Adapter.

| Scope | Auditor | Date | Report |
|-------|---------|------|--------|
| FAssets | OpenZeppelin | Jan 2026 | [PDF](https://dev.flare.network/assets/files/20260128-OpenZeppelin-FAssets-484601fddc2f576c1c7df3a80869b36c.pdf) |
| FAssets Diff v3 | Zellic | Nov 2025 | [PDF](https://dev.flare.network/assets/files/20251125-Zellic-Flare-FAssets-diff-v3-06faf4b4fcf788007e3984a3d70b1341.pdf) |
| FAssets Diff v2 | Zellic | Oct 2025 | [PDF](https://dev.flare.network/assets/files/20251020-Zellic-Flare_FAssets_diff-v2-897466ac721e5bb4fb911c9ed81bbcae.pdf) |
| FAssets Diff v1 | Zellic | Sep 2025 | [PDF](https://dev.flare.network/assets/files/20250923_Zellic-Flare-FAssets-diff-v1-b8551ec5a4b5ee89f93bdd13ab2bea84.pdf) |
| FAsset OFTAdapter | Zellic | Aug 2025 | [PDF](https://dev.flare.network/assets/files/20250409-Zellic-FAsset_OFTAdapter_Report-839b4186f6bce1c67d1ff6262af936c8.pdf) |
| FAsset Smart Contracts v1.2 | Zellic | Aug 2025 | [PDF](https://dev.flare.network/assets/files/20250801-Zellic-Flare_FAssets_Audit_Report_08_2025-b9de3eb32fbd7af035b9d6d6254602cd.pdf) |
| FAsset Immunefi Audit Competition | Immunefi | Jun 2025 | [Leaderboard](https://immunefi.com/audit-competition/audit-comp-flare-fassets/leaderboard/) |
| FAssets v1.1 (Core Vault) | Coinspect | Apr 2025 | [PDF](https://dev.flare.network/assets/files/20250401-Coinspect-SmartContractAudit-Flare-FAssetCoreVault-v250506-30b90828151618d69e05689febda563d.pdf) |
| FAssets V2 Updates | Coinspect | Dec 2024 | [PDF](https://dev.flare.network/assets/files/20241215-Coinspect-SmartContractAudit-Flare-FAssetV2Updates-v241217-0eabaea3059ecf2eceb673fe2278089f.pdf) |
| FAssets Update | Coinspect | Sep 2024 | [PDF](https://dev.flare.network/assets/files/20240901-Coinspect-SmartContractAudit-Flare-FassetUpdate-v240910-4a3297bd5e7f5a45ecc36c1e23b7e6f7.pdf) |
| FAsset Liquidator | Coinspect | Dec 2023 | [PDF](https://dev.flare.network/assets/files/20231207-Coinspect-Flare-Smart_Contract_Review-FAsset_Liquidator-v231207-59702b90f3f564fedc2436ebc2cca35e.pdf) |
| FAsset V2 Bots | Coinspect | Oct 2023 | [PDF](https://dev.flare.network/assets/files/20231001-Coinspect-Flare-Source_Code_Review-FAsset_Bots-v240220-974e96f9f2ff335a0c27fbcb41c261d1.pdf) |
| FAsset V2 Smart Contracts | Coinspect | Sep 2023 | [PDF](https://dev.flare.network/assets/files/20230901-Coinspect-Flare-Smart_Contract_Review-FAsset_V2-v240220-6d7fdd0d39746804905f0b2ba9074df9.pdf) |
| FAssets V1 | Coinspect | Jun 2022 | [PDF](https://dev.flare.network/assets/files/20220601-Coinspect_Smart_Contract_Audit_fAsset_v220829-6b444f231aa824e1c44328cca7d09d5e.pdf) |

**Architecture complexity:** the Ethereum FXRP contract is a minimal, standard LayerZero OFT (upgradeable). The full FXRP stack — FAssets minting, agent collateral, redemption queues, liquidations, the OFT Adapter, and Smart-Account auto-redeem flows — is substantially more complex, but most of that complexity lives on Flare, outside the Ethereum contract surface being assessed.

**Unresolved findings:** no outstanding critical/high findings are disclosed on the public audit page.

### Bug Bounty

- Flare maintains a live [Immunefi bug bounty](https://immunefi.com/bug-bounty/flarenetwork/information/) covering the Flare Network and its protocols (FAssets included).
- Maximum payout: **$250,000** for critical-severity vulnerabilities, per Flare's [bug bounty launch announcement](https://flare.network/news/flare-immunefi-launch-a-comprehensive-bug-bounty-program) (July 16, 2024). Flare notes the maximum "may increase" as scope expands; the live [Immunefi program page](https://immunefi.com/bug-bounty/flarenetwork/information/) is JS-rendered, so the current displayed tier could not be independently re-read at snapshot time.
- Safe Harbor (SEAL 911): not disclosed in Flare's public documentation or the Immunefi program page — could not be verified.

## Historical Track Record

- **Flare Network:** launched 2020 (mainnet); the FAssets system has been in development since 2022 and live on Flare mainnet since 2024–2025. FXRP is Flare's flagship FAsset.
- **FXRP on Ethereum:** deployed **February 10, 2026** ([tx `0x0b62e485022965d092676affa0f8b468287ab406d4715444b8b057de25e6db1f`](https://etherscan.io/tx/0x0b62e485022965d092676affa0f8b468287ab406d4715444b8b057de25e6db1f), block 24,426,330) — **~6.3 months** in production. Ownership was transferred from the deployer EOA to the 6-of-11 Safe three hours after deployment ([tx `0x03099ca3a095a441d946cfa8373dc2b8968208521ac0dbf6601199e18dd16748`](https://etherscan.io/tx/0x03099ca3a095a441d946cfa8373dc2b8968208521ac0dbf6601199e18dd16748)).
- **Scale:** Ethereum FXRP supply ~10.30M (~$14.1M at ~$1.37). ~96.5% of it sits in Morpho Blue as collateral. Across Flare, FXRP DeFi TVL is ~$27.9M (Kinetic) plus smaller pools ([DeFiLlama yields](https://yields.llama.fi/pools)); the canonical Flare FXRP supply is ~147.8M against a 170M XRP minting cap (~87% utilized).
- **Security incidents:** no known exploit of FXRP/FAssets or the OFT bridge to date. Flare has operated without a material FAssets loss since launch.
- **Peg:** FXRP is not pegged to USD — it tracks XRP (currently ~$1.37). There is no FXRP "depeg" concept; the relevant stability property is the over-collateralization of the FAssets backing and the 1:1 redeemability for XRP.
- **Holder concentration (Ethereum):** extremely high — Morpho Blue [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) holds 9,941,091.53 FXRP (~96.5%), and [`0xFa666BD8ec87d0dad7D1cb8f1bfaea24F276dBcA`](https://etherscan.io/address/0xFa666BD8ec87d0dad7D1cb8f1bfaea24F276dBcA) holds a further 300,000 (~2.9%) ([Blockscout holders](https://eth.blockscout.com/token/0xCE6170EA245dC8D1f275A710a062b70f125F0110?tab=holders)). All other holders combined are <1%.

## Funds Management

FXRP-on-Ethereum has two layers of backing:

1. **Bridge layer (assessed token):** each Ethereum FXRP is backed 1:1 by canonical FXRP locked in the Flare OFT Adapter [`0xd70659…7E07E`](https://flare-explorer.flare.network/address/0xd70659a6396285BF7214d7Ea9673184e7C72E07E). This lock is fully on-chain and the invariant (remote supply ≈ adapter escrow) reconciles at the snapshot block.
2. **FAssets layer (canonical FXRP):** canonical FXRP is over-collateralized by the FAssets system — XRP held by agents on XRPL (FDC-attested) plus vault collateral (USDT) and pool collateral (FLR).

### Accessibility

- **Who can mint/redeem:** anyone. Minting canonical FXRP requires sending XRP to an agent (XRPL) with a 10 XRP lot size; the FDC verifies and FXRP is minted on Flare. Redeeming is always available (1:1 to XRP, 0.2% fee). On Ethereum, acquiring/leaving FXRP is market-based (DEX) or via the LayerZero OFT back to Flare.
- **Atomicity:** FAssets mint/redemption spans two chains (XRPL + Flare) and is inherently asynchronous. The LayerZero OFT leg (Flare↔Ethereum) is also asynchronous (minutes, DVN-gated).
- **Fees / limits:** minting cap 170M XRP; lot size 10 XRP; collateral reservation fee 0.01%; redemption fee 0.2%; redemption default premium 5%; max redemption tickets 20 ([parameters](https://dev.flare.network/fxrp/parameters)).

### Token Mint Authority

The Ethereum FXRP is a LayerZero OFT with **no public `mint` function and no AccessControl**. Minting/burning of Ethereum FXRP happens only inside the OFT's `lzReceive`/`send` flow, which the token itself restricts to the LayerZero EndpointV2.

**Mint mechanism:** Bridge/attestation-driven (LayerZero OFT `_credit`/`_debit`), gated by the LayerZero EndpointV2 and authenticated by the configured peers and a **4-of-4 DVN quorum**.

**Mint requires backing:** Yes at the system level — minting Ethereum FXRP requires a corresponding lock of canonical FXRP in the Flare adapter (the OFT lock model). A forged LayerZero message could still mint unbacked Ethereum FXRP, but that is a bridge-compromise path, bounded by the lock model (see below).

**Per-address mint authority** (verified onchain August 21, 2026, token [`0xCE6170EA245dC8D1f275A710a062b70f125F0110`](https://etherscan.io/address/0xCE6170EA245dC8D1f275A710a062b70f125F0110)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x1a44076050125825900e736c501f859c50fE728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c) (LayerZero EndpointV2) | ✓ | ✓ | `lzReceive` caller → OFT `_credit`/`_debit` | Only contract that can invoke the token's receive path; authenticates messages via the 4-of-4 DVN quorum and the peer table |
| [`0x42D660C6C871a9176cEb102E9ad9722459Aa67D3`](https://etherscan.io/address/0x42D660C6C871a9176cEb102E9ad9722459Aa67D3) (6-of-11 Safe) | — | — | `owner()` | Can set peers, enforced options, fee BPS, delegate — but has **no direct mint** |
| [`0x93bfc1329d6d4d94825434b2c0b55f56b34695c7`](https://etherscan.io/address/0x93bfc1329d6d4d94825434b2c0b55f56b34695c7) (ProxyAdmin, owned by the Safe) | — | — | Upgrade authority | Can swap the implementation; a malicious upgrade could add a mint function — no timelock |

**Peers (message originators that can trigger mint on Ethereum):** the Ethereum OFT's `peers` table authorizes four sources — Flare adapter [`0xd70659…7E07E`](https://flare-explorer.flare.network/address/0xd70659a6396285BF7214d7Ea9673184e7C72E07E) (EID 30295), Base [`0xCE61…F0110`](https://basescan.org/address/0xCE6170EA245dC8D1f275A710a062b70f125F0110) (EID 30184), BNB [`0xCE61…F0110`](https://bscscan.com/address/0xce6170ea245dc8d1f275a710a062b70f125f0110) (EID 30102), and Katana [`0x565f…8059`](https://explorer.katanarpc.com/address/0x565f9415b9c285c03c008e73088148f28d218059) (EID 30375).

**Rate limits / supply caps:** none on the Ethereum OFT itself. The FAssets minting cap (170M XRP) caps canonical supply; the OFT escrow is the natural cap on bridged supply (a forged message could exceed it).

**Backing check at mint time:** None on-chain at the token level — the OFT mints in response to an authenticated message; the 1:1 lock on Flare is what provides backing. This is the standard OFT `lock` model.

### Bridge Model (Pass 1.6 segmentation)

**Model: `lock` (bridged representation).** The canonical FXRP lives on Flare and is **locked/escrowed** in the Flare OFT Adapter (not minted by it — the adapter holds `token() = canonical FXRP` and has no mint authority over it). The Ethereum FXRP is a **remote, bridged claim**. Consequences:

- The bridge-controlled message path **cannot mint the canonical FXRP** on Flare. A compromise of the LayerZero path can mint unbacked FXRP *on Ethereum* (and other remote chains), diluting remote holders — but the **blast radius is bounded by the remote supply plus the ~15.83M FXRP locked escrow**, and does not reach the canonical FXRP or the underlying XRP backing on Flare.
- The reverse direction (Ethereum → Flare) releases canonical FXRP from the adapter's escrow — a forged message there could drain escrow up to the locked balance.

**DVN quorum (verified onchain, receive side):**

| Route | Quorum | Confirmations | Required DVNs |
|-------|--------|---------------|---------------|
| Flare → Ethereum (mints Ethereum FXRP) | **4-of-4** required, 0 optional | 20 | LayerZero Labs [`0x589d…236b`](https://etherscan.io/address/0x589dedbd617e0cbcb916a9223f4d1300c294236b), Nethermind [`0xa59b…0ba5`](https://etherscan.io/address/0xa59ba433ac34d2927232918ef5b2eaafcf130ba5), Canary [`0xa4fe…c2cd`](https://etherscan.io/address/0xa4fe5a5b9a846458a70cd0748228aed3bf65c2cd), Horizen [`0x3802…f20d`](https://etherscan.io/address/0x380275805876ff19055ea900cdb2b46a94ecf20d) |
| Ethereum → Flare (releases canonical escrow) | **4-of-4** required, 0 optional | 15 | Same four providers, Flare-side addresses |

This is a **strong multi-DVN configuration** — structurally the opposite of the single-DVN setup exploited in the April 2026 KelpDAO/rsETH incident. All four verifiers must independently attest. The 4-of-4 quorum is materially stronger than the 2-of-2 or 3-of-3 setups seen on many OFT deployments.

### Collateralization

- **On Ethereum:** 1:1 backed by canonical FXRP locked in the Flare adapter (on-chain verifiable; reconciles at snapshot).
- **On Flare (canonical FXRP backing):** over-collateralized via the FAssets system:
  - **Vault collateral:** USDT, minimal CR **1.2** (safety CR 1.3).
  - **Pool collateral:** FLR (native), minimal CR **1.5** (safety CR 1.6).
  - **Minting pool holdings required:** 50% of an agent's backed FAssets.
  - **Liquidations:** on-chain — liquidators burn FAssets for collateral when an agent's CR falls below liquidation CR (≈10% below minimal CR). Challengers can trigger full liquidation for illegal agent actions.
- **Underlying XRP custody:** XRP is held **off-chain on XRPL** by agents (hot work + cold management addresses) and the governance-multisig **Core Vault**. The FDC provides trustless attestation of XRPL movements, and the over-collateralization backstops agent default — but the XRP itself is not inside a smart contract. This is the single most important custody fact for a collateral assessment.
- **Risk curation:** governance sets collateral types, CR thresholds, the minting cap (170M XRP), and agent approval. Changes are made through [Flare Improvement Proposals (FIPs)](https://proposals.flare.network/), which are initiated by the Flare Foundation and voted on by `WFLR`/staked-`FLR` holders (acceptance-based: a simple majority of cast votes, no quorum requirement); approved changes are executed by the Foundation or via governance contract calls. The exact on-chain governance multisig/threshold for the FAssets asset-manager contracts is not published in the [developer docs](https://dev.flare.network/network/governance).

### Provability

- **Bridge escrow:** fully on-chain — `canonicalFXRP.balanceOf(flareAdapter)` and each remote OFT's `totalSupply()` are public and reconcile.
- **FAssets collateral:** on-chain — agent vault balances, collateral pool CPTs, and CR values are readable; prices come from the [FTSO](https://dev.flare.network/ftso/overview) (Flare's enshrined oracle).
- **XRP backing:** verifiable via FDC proofs of XRPL transactions (trustless, on-chain attestation), though the XRP itself is held off-chain. No periodic custodian attestation is required because FDC + over-collateralization is the design.
- **Exchange rate:** N/A — FXRP is 1:1 with XRP; no privileged rate or PPS.
- **Third-party verification:** FDC (Flare's enshrined cross-chain data connector) is the verification layer for XRPL deposits/redemptions.

## Liquidity Risk

- **Exit liquidity (Ethereum) is thin and concentrated:**
  - Uniswap V3 RLUSD-FXRP pool ~**$3.05M** ([DeFiLlama yields](https://yields.llama.fi/pools)) — the only meaningful DEX pair on Ethereum.
  - Morpho Blue FXRP collateral ~**$13.6M** is lending liquidity, not tradable DEX depth.
  - **No CEX listings** for FXRP-on-Ethereum (CoinGecko returns no market data for the token).
- **Redemption mechanism:** there is **no direct redemption on Ethereum**. Exit paths are (a) DEX sale into the ~$3.05M pool, or (b) bridge FXRP back to Flare via LayerZero, then redeem 1:1 for XRP through the FAssets system (0.2% fee, asynchronous, agent-mediated). The redemption path exists but is multi-hop and slow.
- **Large-holder impact:** severe. ~96.5% of supply sits in Morpho Blue. Any Morpho liquidation cascade would push FXRP into the ~$3M Uniswap pool; a large holder's exit would cause >10% price impact. DEX depth is ~30% of Ethereum supply by USD but ~$3M absolute, far below the $10M+ needed for smooth exits.
- **Historical liquidity under stress:** no FXRP-specific stress event observed in its ~6-month life. XRP itself is deeply liquid on CEXs, but that depth is not directly reachable from the Ethereum FXRP without bridging.

## Centralization & Control Risks

### Governance

- **Upgradeability:** FXRP is a TransparentUpgradeableProxy. The ProxyAdmin [`0x93bf…95c7`](https://etherscan.io/address/0x93bfc1329d6d4d94825434b2c0b55f56b34695c7) is owned by the **6-of-11 Safe** [`0x42D6…67D3`](https://etherscan.io/address/0x42D660C6C871a9176cEb102E9ad9722459Aa67D3) — an upgrade can be executed **with no timelock**. The same Safe is the OFT `owner()` (peer table, enforced options, fee BPS) and owns the Flare-side adapter via a second 6-of-11 Safe [`0xbe65…49F3`](https://flare-explorer.flare.network/address/0xbe653C54DF337F13Fcb726101388F4a4803049F3) with the same signer set.
- **Multisig:** 6-of-11 Gnosis Safe v1.4.1 (11 owners, threshold 6). Signer identities: `TODO` — not enumerated (per policy, signers are checked against docs only, and Flare does not publish the signer set in the developer docs).
- **No timelock** on upgrades or peer/config changes is the principal governance weakness. The 6-of-11 threshold is a meaningful barrier, but a compromised or malicious Safe majority could upgrade the FXRP implementation to introduce unbacked minting, repoint the peer table to a malicious OFT, or change the DVN configuration — all with immediate effect and no on-chain warning window.
- **Privileged roles:** the owner can `setPeer` (reroute mint/burn), `setEnforcedOptions`, `setFeeBps`/`setDefaultFeeBps`/`withdrawFees` (fees), `setDelegate`, `setMsgInspector`, `setPreCrime`, `transferOwnership`. None can pause or freeze user FXRP balances (the token has no blacklist/pause), but they can disrupt bridging and mint/burn routing.
- **Flare-side governance:** canonical FXRP and the FAssets parameters are governed by Flare governance (asset manager contracts, governance multisig, Core Vault multisig on XRPL). The [XRP Core Vault](https://dev.flare.network/fassets/core-vault) is a multisig account on the XRP Ledger whose signers are authorized by Flare governance under formal agreements; the exact signer count and threshold are not published in the developer docs.

### Programmability

- **Bridge operations:** fully programmatic — `send`/`lzReceive` are pure smart-contract logic; the DVN verification and execution are automated by LayerZero infrastructure.
- **No manual rate/PPS:** FXRP has no exchange rate; 1 FXRP = 1 XRP claim. No privileged price updates on Ethereum.
- **Admin input:** limited to configuration (peers, fees, options) and upgrades.
- **Off-chain dependencies:** the FAssets layer on Flare relies on agents (off-chain bots) and FDC attestation providers; on Ethereum the OFT has no keeper/relayer dependency beyond LayerZero's standard executor/DVN infrastructure.

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **LayerZero V2** (EndpointV2 + 4 DVNs) | **Critical** for the assessed token | The entire Ethereum FXRP mint/burn path and the bridge to Flare/Katana depend on it. The 4-of-4 DVN quorum is strong, but LayerZero is still a third-party messaging layer whose failure or compromise breaks the token's cross-chain function. |
| **Flare FAssets system** (canonical FXRP) | **Critical** for backing | The ultimate backing of every Ethereum FXRP. A failure (agent default cascade, FDC failure, governance parameter error) impairs the 1:1 redeemability that underpins FXRP's value. |
| **XRP / XRPL** | Critical for the underlying | FXRP value tracks XRP; XRP price collapse or XRPL outage affects FXRP's collateral value and redemption. |
| **FTSO** (Flare oracle) | Indirect | Prices FAssets collateral (USDT/FLR) for CR and liquidations on Flare. |
| **Morpho Blue** (for the assessed use case) | Situational | ~96.5% of Ethereum FXRP is locked there; a Morpho-level event (bad-debt spiral in the FXRP/RLUSD market) would stress FXRP exit liquidity. |

## Operational Risk

- **Team:** Flare Foundation / Flare Network — publicly known, established since 2020, with a large developer ecosystem, public GitHub ([flare-foundation](https://github.com/flare-foundation)), and active governance (Flare Portal, proposals). Well-doxxed leadership.
- **Documentation:** excellent and comprehensive — the [Flare Developer Hub](https://dev.flare.network/) covers FAssets, FXRP, the OFT bridge, parameters, and audits in depth.
- **Legal structure:** the Flare website and ecosystem are operated by **Flare Ecosystems Limited**, a corporation formed in the **British Virgin Islands** (registered office: Commerce House, Wickhams Cay 1, P.O. Box 3140, Road Town, Tortola, BVI VG 1110), per the [Terms of Service & Privacy Policy](https://flare.network/privacy-policy/) (§ 31 "Corporate Information"). Protocol development and governance are led by the Flare Foundation.
- **Incident response:** no FAssets/FXRP loss event to evaluate; the system's design (over-collateralization, liquidators, challengers, Core Vault multisig) is itself a documented risk framework.

## Monitoring

### Key Contracts to Monitor

| Contract | Address | What to Monitor |
|----------|---------|-----------------|
| FXRP (Ethereum) | [`0xCE6170EA245dC8D1f275A710a062b70f125F0110`](https://etherscan.io/address/0xCE6170EA245dC8D1f275A710a062b70f125F0110) | `totalSupply()`, `peers(eid)` changes, `Upgraded` events |
| FXRP ProxyAdmin | [`0x93bfc1329d6d4d94825434b2c0b55f56b34695c7`](https://etherscan.io/address/0x93bfc1329d6d4d94825434b2c0b55f56b34695c7) | any `upgrade`/`upgradeAndCall` (immediate alert — no timelock) |
| FXRP owner Safe | [`0x42D660C6C871a9176cEb102E9ad9722459Aa67D3`](https://etherscan.io/address/0x42D660C6C871a9176cEb102E9ad9722459Aa67D3) | `setPeer`, `setEnforcedOptions`, `transferOwnership`, owner-set changes |
| LayerZero EndpointV2 | [`0x1a44076050125825900e736c501f859c50fE728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c) | `getReceiveLibrary` / ULN `getConfig` changes (DVN quorum) |
| Flare OFT Adapter | [`0xd70659a6396285BF7214d7Ea9673184e7C72E07E`](https://flare-explorer.flare.network/address/0xd70659a6396285BF7214d7Ea9673184e7C72E07E) | escrow balance (`canonicalFXRP.balanceOf(adapter)`) vs. sum of remote supplies |
| Canonical FXRP | [`0xAd552A648C74D49E10027AB8a618A3ad4901c5bE`](https://flare-explorer.flare.network/address/0xAd552A648C74D49E10027AB8a618A3ad4901c5bE) | total supply vs. minting cap (170M XRP) |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | FXRP balance; the FXRP/RLUSD market's borrow/supply and LLTV |
| Uniswap V3 RLUSD-FXRP | [`0x42271FcA1FA435B176D46a5544B2698a1E261782`](https://etherscan.io/address/0x42271FcA1FA435B176D46a5544B2698a1E261782) | pool depth; large swaps indicating forced sells |

### Critical Events & Thresholds

| Event | Threshold | Action |
|-------|-----------|--------|
| ProxyAdmin upgrade | any call | Immediate investigation (no timelock — treat as critical) |
| `setPeer` / peer-table change | any | Investigate — reroutes mint/burn authority |
| DVN quorum change (ULN config) | any | Re-evaluate bridge security before continued use |
| Flare adapter escrow vs. remote supply mismatch | any deviation | Halt bridge use; investigate forged/stuck messages |
| Canonical FXRP supply | approaching 170M XRP cap | Minting halts; monitor redemption demand |
| Morpho FXRP market utilization / bad debt | borrow > supply buffer; any bad debt | Liquidation-cascade risk to FXRP liquidity |
| Uniswap RLUSD-FXRP depth | <$1M | Exit capacity dangerously thin |

### Key View Functions

- `FXRP.totalSupply()` — Ethereum supply (should track the Flare-side escrow minus other chains).
- `FXRP.peers(uint32 eid)` — peer table (Flare 30295, Base 30184, BNB 30102, Katana 30375).
- `FXRP.owner()` — should remain the 6-of-11 Safe.
- `EndpointV2.getReceiveLibrary(FXRP, srcEid)` + `EndpointV2.getConfig(FXRP, lib, srcEid, 2)` — decode `(confirmations, requiredDVNCount, optionalDVNCount, threshold, requiredDVNs, optionalDVNs)` to re-verify the 4-of-4 quorum.
- `canonicalFXRP.balanceOf(flareAdapter)` (on Flare) — the escrow backing remote FXRP.
- `morphoBlue.balanceOf(FXRP)` and the market's `totalSupplyAssets`/`totalBorrowAssets` (market id [`0x4fa31e3f…11d96`](https://app.morpho.org/ethereum/market/0x4fa31e3f8ba345227d44e1cf48559eea53a90dd5311dc006984c060f2f311d96/fxrp-rlusd)).

### Recommended Monitoring Frequency

- **ProxyAdmin / owner actions:** real-time (block-by-block) — the upgrade path has no timelock.
- **Escrow vs. remote supply reconciliation:** hourly.
- **DVN quorum config:** daily (or on any LayerZero config-change event).
- **Morpho market utilization:** hourly.
- **Canonical FXRP supply vs. cap:** daily.

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  XRPL (off-chain)                      Flare (canonical)                   │
│  ┌──────────────┐   XRP deposit   ┌──────────────────┐                     │
│  │ Agent wallets │ ──────────────▶ │ FAssets system   │  mints canonical    │
│  │ + Core Vault │  (FDC-verified) │ (AssetManager)   │ ──────────▶ FXRP    │
│  │  (multisig)  │                 │ collateral: USDT │  0xAd55…C5bE         │
│  └──────────────┘                 │ (CR≥1.2) + FLR   │                      │
│                                    │ (CR≥1.5)         │                      │
│                                    └────────┬─────────┘                      │
│                                             │ lock (escrow)                  │
│                                             ▼                               │
│                                    ┌──────────────────┐                     │
│                                    │ FXRP OFT Adapter │  owner: 6-of-11      │
│                                    │ 0xd706…7E07E     │  Safe 0xbe65…49F3   │
│                                    └────────┬─────────┘                      │
└─────────────────────────────────────────────┼───────────────────────────────┘
                                              │ LayerZero V2 (EndpointV2)
                                              │ 4-of-4 DVNs: LZ Labs, Nethermind,
                                              │              Canary, Horizen
              ┌───────────────────────────────┼──────────────────────────────┐
              │  Ethereum (assessed)          │      other remote OFTs        │
              │  ┌────────────────────────┐   │   Base / BNB (0xCE61…F0110)   │
              │  │ FXRP OFT (proxy)       │◀──┘   Katana 0x565f…8059          │
              │  │ 0xCE61…F0110           │       HyperEVM / HyperCore        │
              │  │ impl: FXRPOFT 0x0baf… │                                    │
              │  └──────┬─────────┬──────┘                                    │
              │         │mints    │holds-role(owner) / upgrade(ProxyAdmin)    │
              │         ▼         ▼                                            │
              │  ┌────────────┐ ┌──────────────────────┐                      │
              │  │ EndpointV2 │ │ 6-of-11 Safe         │                      │
              │  │ 0x1a44…28c │ │ 0x42D6…67D3          │                      │
              │  └────────────┘ │  └── ProxyAdmin 0x93bf…95c7 (no timelock)   │
              │                 └──────────────────────┘                      │
              │  FXRP deposited as collateral                                 │
              │  ┌────────────────────────┐                                    │
              │  │ Morpho Blue            │ ~96.5% of supply                  │
              │  │ 0xBBBB…FFCb            │ (FXRP/RLUSD, LLTV 77%)            │
              │  └────────────────────────┘                                    │
              └───────────────────────────────────────────────────────────────┘
```

---

## Risk Summary

### Key Strengths

- **Strong bridge security:** 4-of-4 required DVNs (LayerZero Labs, Nethermind, Canary, Horizen) on both the mint and escrow-release paths — structurally immune to the single-DVN forgery that caused the April 2026 rsETH incident.
- **Over-collateralized backing:** canonical FXRP is over-collateralized (USDT vault CR ≥1.2, FLR pool CR ≥1.5) with on-chain liquidations and challengers, on top of a trustless FDC-attested bridge from XRPL.
- **Extensive, current audits:** OpenZeppelin (Jan 2026), multiple Zellic and Coinspect reports, plus an Immunefi competition — continuous coverage of the FAssets and OFT stack.
- **Bounded bridge blast radius:** the OFT `lock` model means a LayerZero compromise cannot mint canonical FXRP; it is bounded by the ~15.83M FXRP escrow.
- **Minimal contract surface on Ethereum:** the assessed token is a thin, standard, source-verified LayerZero OFT with no AccessControl, no blacklist, and no privileged mint function.

### Key Risks

- **No timelock on upgrades:** a 6-of-11 Safe can upgrade the FXRP implementation, repoint peers, or change the DVN config with immediate effect and no warning window.
- **Off-chain XRP custody:** the underlying XRP is held by agents and a governance multisig on XRPL — outside any smart contract — backstopped by over-collateralization rather than programmatic custody.
- **Thin, concentrated liquidity:** ~96.5% of Ethereum FXRP sits in Morpho Blue; the only DEX pair is ~$3.05M. A liquidation cascade or large exit would cause >10% price impact.
- **Young deployment:** ~6.3 months on Ethereum; the bridge and Morpho usage have not been tested through a full market cycle.
- **Multi-hop exit:** there is no direct redemption on Ethereum — exit requires DEX sale or bridging back to Flare and redeeming through agents.

### Critical Risks

- **Malicious upgrade path (no timelock).** The ProxyAdmin (owned by the 6-of-11 Safe) can atomically swap the FXRP implementation to one with an unbacked-mint function or a blacklist. This is the highest-severity, highest-probability-relative-to-impact control failure for a collateral token, and there is no on-chain delay to react.
- **Forged LayerZero message mints unbacked Ethereum FXRP.** While the 4-of-4 DVN quorum makes this unlikely, a coordinated compromise of all four verifiers (or a Flare-adapter private-key compromise combined with a LayerZero exploit) could mint unbacked FXRP on Ethereum, diluting collateral positions. Bounded to remote supply + escrow by the lock model.

---

## Risk Score Assessment

**Scoring Guidelines:** be conservative; use decimals where subcategories fall between scores; prioritize onchain evidence.

### Critical Risk Gates

- [x] **Unverified contract source** — NOT triggered: both the FXRP proxy and its `FXRPOFT` implementation are source-verified on Etherscan.
- [x] **No audit** — NOT triggered: OpenZeppelin + Zellic + Coinspect + Immunefi competition cover the stack.
- [x] **Unverifiable reserves** — NOT triggered: the bridge escrow is fully on-chain and reconciles; the FAssets backing is over-collateralized and FDC-attested (hybrid, but verifiable).
- [x] **Total centralization** — NOT triggered: governed by a 6-of-11 multisig, not a single EOA.

**All gates pass.** Proceeding to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits:** 3+ top/reputable firms (OpenZeppelin, Zellic, Coinspect) with continuous 2022–2026 coverage plus an Immunefi competition. Bug bounty is live on Immunefi but the maximum payout is unverified. → **1.5**
- **Historical:** ~6.3 months on Ethereum (>$10M TVL), FAssets live on Flare for longer; no incidents. → **3**

**Audits & Historical Score = (1.5 + 3) / 2 = 2.25**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance:** upgradeable proxy; 6-of-11 Safe with **no timelock**; powerful roles (peers, upgrades, fees) but no pause/blacklist. → **3.5**
- **Programmability:** fully programmatic bridging; no manual rate/PPS; config-only admin input. → **2**
- **External Dependencies:** LayerZero (critical), Flare FAssets (critical), XRP/XRPL, FTSO — several critical dependencies. → **3.5**

**Centralization Score = (3.5 + 2 + 3.5) / 3 = 3.0**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization:** 100%+ backing with the bridge layer fully on-chain and the FAssets layer over-collateralized, but the ultimate XRP is held off-chain by agents (FDC-attested). → **2.5**
- **Provability:** bridge escrow fully on-chain; FAssets collateral on-chain; XRP attested via FDC. → **2**

**Funds Management Score = (2.5 + 2) / 2 = 2.25 → 2.3**

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit:** no direct redemption on Ethereum; multi-hop (DEX or bridge→Flare→redeem). DEX depth ~$3.05M; ~96.5% concentrated in Morpho; no CEX listings. → **4**

**Liquidity Score = 4**

#### Category 5: Operational Risk (Weight: 5%)

- **Team:** Flare Foundation / Flare Ecosystems Limited (BVI) — public, established, doxxed. Documentation excellent. → **1.5**

**Operational Score = 1.5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.25 | 20% | 0.45 |
| Centralization & Control | 3.0 | 30% | 0.90 |
| Funds Management | 2.3 | 30% | 0.69 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Final Score** | | | **2.715 → 2.7/5.0** |

**Optional Modifiers:** none applied (protocol <2 years on Ethereum; TVL <$500M).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |
| **N/A** | **Not Rated** | Terminal — do not use (exploited or wound down) |

**Final Risk Tier: Medium Risk**

---

## Reassessment Triggers

- **Time-based:** reassess in 6 months (the deployment is young; liquidity and holder concentration should be re-checked).
- **Incident-based:** reassess after any Flare/FAssets/LayerZero incident, any ProxyAdmin upgrade or peer/DVN config change, or any Morpho FXRP-market bad-debt event.
- **Liquidity-based:** reassess if Ethereum FXRP DEX depth drops below ~$1M or Morpho concentration rises further.
- **Supply-based:** reassess if canonical FXRP approaches the 170M XRP minting cap or the Flare adapter escrow diverges from remote supply.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [August 21, 2026](https://github.com/yearn/risk-score/pull/420) | 2.7 | Initial assessment |
