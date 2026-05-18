# Protocol Risk Assessment: Bedrock (uniBTC, brBTC, uniETH)

- **Assessment Date:** May 18, 2026
- **Tokens:** uniBTC, brBTC, uniETH
- **Chain:** Ethereum
- **Token Addresses:**
  - uniBTC: [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568)
  - brBTC: [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646)
  - uniETH: [`0xF1376bceF0f78459C0Ed0ba5ddce976F1ddF51F4`](https://etherscan.io/address/0xF1376bceF0f78459C0Ed0ba5ddce976F1ddF51F4)
- **Final Score: 4.2/5.0**

## Overview + Links

Bedrock is a multi-asset liquid restaking protocol developed in partnership with **RockX** (institutional staking provider; same CEO). It issues three liquid restaking tokens (LRTs) on Ethereum:

- **uniBTC** — a wrapped-BTC LRT. Users deposit WBTC / FBTC / cbBTC / M-BTC into a Bedrock vault and receive uniBTC 1:1 (8 decimals). The underlying BTC is restaked across Babylon and other BTC restaking venues. Backing is reported through a Chainlink Proof-of-Reserve feed.
- **brBTC** — a meta-LRT that auto-allocates BTC deposits across multiple BTC restaking venues (Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, Mellow). Accepts uniBTC, FBTC, cbBTC, WBTC, M-BTC. Cross-chain via Chainlink CCIP.
- **uniETH** — an ETH LST. Users deposit native ETH and receive uniETH (value-accruing, non-rebasing). Underlying ETH is staked through RockX-operated validators with an EigenPod for EigenLayer restaking. Yield comes from consensus + execution rewards (10% protocol fee) and EigenLayer points (0% fee).

Bedrock suffered a **~$2M exploit on September 27, 2024** in the uniBTC vault's mint flow (asset-validation bug). Users were reimbursed by Fuzzland — a security firm whose ex-employee was the attacker. Bedrock has since integrated Chainlink Proof-of-Reserve and re-audited the affected contracts.

**Links:**

- [Bedrock website](https://www.bedrock.technology/)
- [Bedrock app](https://app.bedrock.technology/)
- [Bedrock docs](https://docs.bedrock.technology/)
- [Statistics dashboard](https://app.bedrock.technology/statistics)
- [GitHub — Bedrock-Technology](https://github.com/Bedrock-Technology)
- [Audit reports index](https://docs.bedrock.technology/security/audit-reports)
- [DefiLlama — Bedrock uniBTC](https://defillama.com/protocol/bedrock-unibtc)
- [DefiLlama — Bedrock (aggregate)](https://defillama.com/protocol/bedrock)
- [Chainlink uniBTC PoR feed](https://data.chain.link/feeds/ethereum/mainnet/unibtc-por)
- [QuillAudits — Sept 2024 exploit analysis](https://www.quillaudits.com/blog/hack-analysis/bedrock-2million-exploit)
- [BlockApex — uniBTC hack analysis](https://blockapex.medium.com/unibtc-hack-analysis-bffd6cebd4a8)
- [Babylon Labs](https://babylonlabs.io/)

## Contract Addresses

### Token Layer (all are EIP-1967 transparent upgradeable proxies)

| Token | Proxy | Implementation | Proxy Admin |
|-------|-------|----------------|-------------|
| uniBTC | [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568) | [`0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD`](https://etherscan.io/address/0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD) | [`0x029e4fbdaa31de075dd74b2238222a08233978f6`](https://etherscan.io/address/0x029e4fbdaa31de075dd74b2238222a08233978f6) |
| uniETH | [`0xF1376bceF0f78459C0Ed0ba5ddce976F1ddF51F4`](https://etherscan.io/address/0xF1376bceF0f78459C0Ed0ba5ddce976F1ddF51F4) | [`0x8a94866dF557bB7FCe88EFF9917237286098E590`](https://etherscan.io/address/0x8a94866dF557bB7FCe88EFF9917237286098E590) | [`0xa5f2b6ab5b38b88ba221741b3a189999b4c889c6`](https://etherscan.io/address/0xa5f2b6ab5b38b88ba221741b3a189999b4c889c6) |
| brBTC | [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646) | [`0x6fc60782295b8c3d83bba1324cd2ab1e77330fbe`](https://etherscan.io/address/0x6fc60782295b8c3d83bba1324cd2ab1e77330fbe) | [`0x9f63269196a8828f05f2e49d1078ea7c44e7f002`](https://etherscan.io/address/0x9f63269196a8828f05f2e49d1078ea7c44e7f002) |

Verified onchain (May 18, 2026): `name`, `symbol`, `decimals`, EIP-1967 implementation and admin storage slots.

### Protocol Layer

| Contract | Address | Role |
|----------|---------|------|
| uniBTC Vault (proxy) | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | Mint/redeem uniBTC against allowed wrapped BTC |
| uniBTC Vault impl | [`0x01e9161D1621466eB086651FD514d3eFb8C3752E`](https://etherscan.io/address/0x01e9161D1621466eB086651FD514d3eFb8C3752E) | `VaultWithoutNative` |
| uniETH Staking (proxy) | [`0x4beFa2aA9c305238AA3E0b5D17eB20C045269E9d`](https://etherscan.io/address/0x4beFa2aA9c305238AA3E0b5D17eB20C045269E9d) | Native ETH staking and uniETH minting |
| uniETH Staking impl | [`0xf047d19D064C541bb96f03A99620256B749Df110`](https://etherscan.io/address/0xf047d19D064C541bb96f03A99620256B749Df110) | `Staking` |
| uniETH Restaking (proxy) | [`0x3f4eAceb930b0EdFa78A1Dfcbae5C5494E6E9850`](https://etherscan.io/address/0x3f4eAceb930b0EdFa78A1Dfcbae5C5494E6E9850) | EigenLayer restaking wrapper |
| uniETH EigenPod | [`0x926720Ae39114D0e2043b79570A1e08f00D01cCE`](https://etherscan.io/address/0x926720Ae39114D0e2043b79570A1e08f00D01cCE) | EigenLayer EigenPod |
| brBTC Vault (proxy) | [`0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386`](https://etherscan.io/address/0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386) | brBTC mint and venue allocation |
| brBTC Vault impl | [`0xC7D81a22b384e4bBE6cC3a860e246501728334C7`](https://etherscan.io/address/0xC7D81a22b384e4bBE6cC3a860e246501728334C7) | `brVault` |
| Chainlink uniBTC PoR feed | [`0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) | "uniBTC PoR", 18 decimals, 2% deviation |
| uniBTC supply feeder | [`0xE542919E4b281f10b437F947c8Ba224DdfaBc716`](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716) | Aggregates uniBTC supply across chains for PoR comparison |

### Governance Layer

| Safe | Address | Threshold | Controls |
|------|---------|-----------|----------|
| uniBTC ops Safe (3-of-5) | [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) | 3/5 | Owns uniBTC ProxyAdmin `0x029e4fbd…`; holds `DEFAULT_ADMIN_ROLE` on uniBTC Vault |
| uniETH upgrade Safe (3-of-5) | [`0x3050620423f4dB43E1904815E898C466526387b8`](https://etherscan.io/address/0x3050620423f4dB43E1904815E898C466526387b8) | 3/5 | Owns uniETH ProxyAdmin `0xa5f2b6ab…` (upgrade authority for uniETH token + Staking) |
| Bedrock admin Safe (3-of-5) | [`0xAeE017052DF6Ac002647229D58B786E380B9721A`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A) | 3/5 | Owns brBTC ProxyAdmin `0x9f632691…`; holds `DEFAULT_ADMIN_ROLE` on uniETH Staking |
| brBTC ops Safe (3-of-4) | [`0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9`](https://etherscan.io/address/0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9) | 3/4 | Holds `DEFAULT_ADMIN_ROLE` on brBTC Vault |

All thresholds/owners read live via `getThreshold()` / `getOwners()` on each Safe. ProxyAdmin owners read via `owner()`. `DEFAULT_ADMIN_ROLE` holders confirmed via `hasRole(bytes32(0), <safe>)`.

**Signer overlap:** signer [`0x09610d4239c8f3413509202DCcC7e27C6B0a47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3) appears in three of the four governance Safes; signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32) appears in the uniBTC and brBTC Safes. This reduces effective independence between Safes.

## How Each Token Works

### uniBTC (BTC LRT, 8 decimals)

- **Deposit assets accepted:** WBTC, FBTC, cbBTC, M-BTC (and `uniBTC` itself for cross-chain routing).
- **Mint flow:** User deposits a permitted wrapped BTC into the Vault `mint` function and atomically receives uniBTC 1:1 (in 8-decimal sat units). Mint reverts unless the Chainlink PoR feeder reports reserves >= circulating uniBTC × `adequacyRatio / 1000`. **The Vault explicitly tolerates a 10% reserve shortfall:** verified onchain `adequacyRatio = 900` and source-code `checkReserve` modifier `require(supply * adequacyRatio / 1000 <= reserves, "SYS013")` — so mint is allowed as long as backing ≥ 90% of supply. `setAdequacyRatio` NatSpec confirms 3-decimal base (`880 → 0.88`). The Vault wiring is verified onchain: `chainlinkReserveFeeder = 0xc590D9fb…`, `uniBTCSupplyFeeder = 0xE542919E…`, `feederHeartbeat = 86,400s`, `outOfService = false`. `EXCHANGE_RATE_BASE = 1e10` is a separate constant used to scale 18-decimal wrapped BTC down to 8-decimal uniBTC inside `_amounts()`, not part of the PoR check.
- **Redeem flow (per [Bedrock docs](https://docs.bedrock.technology/multi-asset-liquid-staking/unibtc/unstaking)):** claim-based queue with **8-day delay, 0.5% redemption fee, capped at 2 WBTC/day on Ethereum**.
- **Onchain reserve held in Vault:** verified live — only **0.32249593 WBTC** sits in the Vault contract directly (3,224,9593 raw with 8 decimals). The remainder of the ~4,615 BTC reported by the PoR feed is held off-Ethereum (Babylon-restaked BTC, Bitcoin native treasury, custodied wrapped BTC on other chains). The Vault's `execute(...)` function — gated by `OPERATOR_ROLE` and an `allowedTargetList` whitelist — can move the WBTC out.
- **Custody:** TODO — Bedrock docs do **not** name a custodian (Cobo, Ceffu, BitGo, etc.). Public materials describe the design as "non-custodial in partnership with RockX" but the wallets monitored by the Chainlink PoR feed are self-declared by the project. The PoR detects unbacked mints up to the 10% tolerance but does not independently verify which signers control the BTC.
- **Cross-chain:** Chainlink CCIP is the documented canonical bridge. uniBTC is deployed on 17+ chains; the Ethereum slice is one of several supply sources.

### brBTC (BTC meta-LRT, 8 decimals)

- **Deposit assets accepted:** uniBTC, FBTC, cbBTC, WBTC, M-BTC.
- **Restaking allocations:** Babylon Labs, Kernel DAO, SatLayer, Pell Network, Symbiotic, Mellow Finance. Each is a separate smart-contract counterparty.
- **PoR:** No Chainlink Proof-of-Reserve feed for brBTC. Reserve accounting is internal to the protocol.
- **Vault status:** `outOfService = false`.
- **Redemption:** TODO — Bedrock's public documentation does not specify brBTC redemption fee, delay, or queue mechanics. The brBTC docs pages document only minting and bridging; the dApp page is JS-rendered with no static text. Treat as a material disclosure gap.

### uniETH (ETH LST, 18 decimals)

- **Mint flow:** Atomic `deposit()` on the Staking contract; minimum 0.01 ETH.
- **Validator operator:** RockX is the sole validator operator. uniETH balance reporting is "oracle-less" per docs (computed onchain from EigenPod / beacon balances).
- **Restaking:** EigenLayer via the EigenPod at [`0x926720Ae39114D0e2043b79570A1e08f00D01cCE`](https://etherscan.io/address/0x926720Ae39114D0e2043b79570A1e08f00D01cCE).
- **Fees:** 10% protocol fee on consensus + execution rewards; 0% on EigenLayer points.
- **Redeem flow:** Queued in 32-ETH multiples; 2–10 day exit + 7-day EigenLayer processing per docs.

## Audits and Due Diligence Disclosures

From the [Bedrock audit reports index](https://docs.bedrock.technology/security/audit-reports):

| Scope | Firm | Date | Link |
|-------|------|------|------|
| uniETH | PeckShield | Feb 15, 2024 | [PDF](https://raw.githubusercontent.com/Bedrock-Technology/docs/main/PeckShield-Audit-Report-Bedrock-v1.0.pdf) |
| uniBTC | BlockSec | Jun 12, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/code%20audit%20blocksec.pdf) |
| uniBTC | PeckShield | Oct 1, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/PeckShield-Audit-Report-uniBTC-v1.0.pdf) |
| uniBTC | BlockSec | Oct 30, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/blocksec_bedrock_unibtc_v1.0-signed.pdf) |
| brBTC | BlockSec | Dec 16, 2024 | [PDF](https://github.com/Bedrock-Technology/omni/blob/main/blocksec_bedrock_br_v1.0-signed.pdf) |

Five audit reports total by two reputable firms (PeckShield, BlockSec). The October 2024 audits are post-exploit re-engagements covering the patched uniBTC vault. No engagements with top-tier shops (Trail of Bits, OpenZeppelin, ChainSecurity, Cantina, Spearbit). All three token implementations and all three vault implementations have verified source on Etherscan.

### Bug Bounty

- **No public Immunefi / Cantina / Sherlock / Code4rena bug bounty program found.** Direct URL [immunefi.com/bug-bounty/bedrock/](https://immunefi.com/bug-bounty/bedrock/) returns 404. The Bedrock docs site has no dedicated bug-bounty page.
- **SEAL Safe Harbor: NOT registered.** Confirmed against the onchain SafeHarborRegistry [`0x8f72fcf695523a6fc7dd97eafdd7a083c386b7b6`](https://etherscan.io/address/0x8f72fcf695523a6fc7dd97eafdd7a083c386b7b6) — no Bedrock-related address (vault, token, or deployer) appears in the registry's adoption logs.

## Historical Track Record

- **Time in production:** uniETH live since February 2024; uniBTC vault deployed mid-2024 (initial DefiLlama listing Oct 29, 2024); brBTC live since December 2024. **~2 years total** at assessment date.
- **TVL (DefiLlama, May 18, 2026):**
  - Bedrock uniBTC (sub-protocol): **$354.83M** across 17 chains (Ethereum slice $98.9M; Bitcoin $130.3M; Merlin $74.9M; BOB $30.8M; BSC $19.0M).
  - Bedrock aggregate (all products including uniETH): **$379.14M** (Ethereum $121.4M).
  - Peak uniBTC TVL: ~$638M (July 15, 2025).
  - Minimum: $109M (Nov 2, 2024, just after the exploit).
  - Volatility ratio: 5.8× (peak / min).
- **uniBTC totalSupply (Ethereum, verified onchain):** 2,981.38 uniBTC (`298,138,175,772` sats).
- **brBTC totalSupply (Ethereum, verified onchain):** 121.37 brBTC (`12,137,141,779` sats).
- **uniETH totalSupply (Ethereum, verified onchain):** 9,299.10 uniETH (`9,299,102,553,635,685,029,012` wei).
- **Peg history:** uniBTC trades within ~0.6% of WBTC on Uniswap V3 (Ethereum) and Aerodrome (Base) per CoinGecko. brBTC is essentially illiquid (no 24h volume). uniETH onchain `exchangeRatio() = 1.131913` matches CoinGecko's ETH-equivalent (~1.1296) — oracle peg holds.

### Security Incident: September 27, 2024 — uniBTC Mint Exploit

- **Loss:** ~$2M (~649.6 WETH).
- **Root cause:** The uniBTC Vault `mint` function did not properly validate the deposit asset's price/decimals against the uniBTC issuance rate. An attacker deposited WETH and received uniBTC 1:1, then swapped uniBTC for WETH on a DEX. The bug was an asset-validation gap rather than the classic 8-vs-18 decimal swap — though decimal handling was a contributing factor.
- **Affected contract:** uniBTC Vault [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) (same proxy address still in use after the patch; implementation was upgraded).
- **Exploiter:** EOA [`0x2bFB373017349820dda2Da8230E6b66739BE9F96`](https://etherscan.io/address/0x2bFB373017349820dda2Da8230E6b66739BE9F96).
- **Response:**
  - Vault paused; vulnerability patched and re-audited (PeckShield Oct 1 2024, BlockSec Oct 30 2024).
  - Chainlink Proof-of-Reserve and Chainlink Secure Mint integrated as hardening — Vault now reverts on mint if PoR-reported reserves drop below 90% of circulating supply (adequacyRatio = 900/1000).
  - **Fuzzland publicly took responsibility:** the attacker was a Fuzzland ex-employee, and Fuzzland reimbursed Bedrock for the loss with company funds ([Cointelegraph, Jun 2025](https://cointelegraph.com/news/fuzzland-ex-employee-bedrock-unibtc-exploit); [Cryptonews](https://cryptonews.com/news/ex-employee-hacks-bedrock-unibtc-for-2m-fuzzland-uncovers-insider-exploit/)). Users were made whole through this third-party reimbursement, not by Bedrock's treasury.
  - **TODO:** specific onchain reimbursement transaction hashes are not publicly disclosed. The labeled `fuzzland.eth` address shows no $2M outflow — reimbursement appears to have come from an unannounced Fuzzland-controlled wallet.

This is a significant incident on the same vault that is still in production, although the patched implementation has not had a recurrence in the 19 months since.

## Funds Management

### Accessibility

| Token | Mint | Redeem | Fees | Permissioning |
|-------|------|--------|------|---------------|
| uniBTC | Atomic, PoR-gated | 8-day queue (per docs) | 0.5% redemption fee | Permissionless |
| brBTC | Atomic | TODO (delay/fee) | TODO | Permissionless |
| uniETH | Atomic (min 0.01 ETH) | Queue in 32-ETH multiples; 2–10 day exit + EigenLayer 7-day delay | 10% on rewards/MEV; 0% redeem fee | Permissionless |

### Collateralization

- **uniBTC:** 1:1 backed by wrapped BTC (WBTC/FBTC/cbBTC/M-BTC) and native BTC restaked at Babylon, held across multi-chain addresses self-declared to the Chainlink PoR feeder. Verified onchain: PoR feed `latestAnswer = 4,615.31 BTC` (18 decimals) vs uniBTC global supply tracked by the supply feeder — backing **exceeds** circulating supply at present. Counterparty quality is mixed: WBTC and cbBTC are blue-chip, FBTC and M-BTC are newer/lower-quality.
- **brBTC:** Backed by deposited BTC variants restaked across Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, Mellow. **Multiple compounding restaking-protocol counterparties** — each can independently slash or fail.
- **uniETH:** Backed by native ETH staked via RockX validators. EigenLayer restaking adds slashing exposure once EigenLayer slashing goes live. Single-operator concentration (RockX) is a key fund-management concern.

### Provability

- **uniBTC: Chainlink PoR is the strongest provability mechanism among the three.** PoR feed [`0xc590D9fb…`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) ("uniBTC PoR", 2% deviation, heartbeat 86,400s) is **wired into the Vault** — verified by reading `chainlinkReserveFeeder()` and `uniBTCSupplyFeeder()` on the Vault. Mint reverts if reserves are inadequate. **Caveat:** PoR monitors addresses **self-declared by Bedrock**; it cannot verify that the project controls those addresses' private keys or that the BTC is unencumbered.
- **brBTC:** No public PoR. Reserve accounting is internal.
- **uniETH:** Native ETH staking is verifiable on the beacon chain and EigenLayer; supply-vs-reserves comparison requires reading consensus-layer balances.
- TODO: identify the specific custodian(s) of the wrapped/native BTC backing uniBTC. Docs reference "non-custodial with RockX" but do not name signers or custody providers.

## Liquidity Risk

- **uniBTC pools (CoinGecko, May 18, 2026):**
  - Uniswap V3 (Ethereum) uniBTC/WBTC — ~50.9% of uniBTC volume
  - Aerodrome Slipstream (Base) uniBTC/cbBTC — ~40.1% of volume
  - Kodiak V3 (Berachain) uniBTC/WBTC — ~7.1% of volume
  - **Aggregate uniBTC 24h volume across all DEXes: ~$19,774** — very thin for a $229M market cap.
- **uniETH Ethereum pools** (Curve API, verified onchain):
  - uniETH/frxETH (Curve factory-stable-ng) [`0x78C579A2Dcfe10Ae8B3C888A583337Beb4D91733`](https://etherscan.io/address/0x78C579A2Dcfe10Ae8B3C888A583337Beb4D91733) — TVL ~$485K (87.93 uniETH / 125.70 frxETH).
  - uniETH/ETH (Curve factory-stable-ng) [`0x0f2F4D68308dB60d36268a602EF273421A227021`](https://etherscan.io/address/0x0f2F4D68308dB60d36268a602EF273421A227021) — effectively dead (~$7 TVL).
- **brBTC:** No reported 24h DEX volume on CoinGecko — effectively illiquid on secondary markets.

### Slippage (CoW Protocol quotes, May 18, 2026)

| Token | Size | Route | Slippage |
|-------|------|-------|----------|
| uniBTC → WBTC | ~10 uniBTC (~$1M) | Ethereum mainnet | **~2.4%** |
| uniBTC → WBTC | ~50 uniBTC (~$5M) | Ethereum mainnet | **~77%** (cliff; route saturates) |
| uniETH → WETH | ~300 uniETH (~$1M) | Ethereum mainnet | **~63%** (frxETH pool too shallow) |
| uniETH → WETH | ~1,500 uniETH (~$5M) | Ethereum mainnet | **~93%** |

uniETH's onchain `exchangeRatio() = 1.131913` matches CoinGecko's ETH-equivalent ratio (~1.1296) — the **oracle peg holds, but realized DEX exit price collapses immediately above ~$200K size** because the only meaningful pool is the $485K uniETH/frxETH. Holders depend almost entirely on protocol redemption for non-trivial exits.

- **CEX listings:** None disclosed in CoinGecko for any of the three tokens.
- **Protocol redemption is the primary exit** for all three tokens, and all three are queued/delayed:
  - uniBTC: 8-day queue, 0.5% fee, 2 WBTC/day cap on Ethereum.
  - uniETH: 32-ETH-multiple queue + EigenLayer 7-day delay (2–10 days protocol + 7d EL per docs).
  - brBTC: queue and fee not publicly documented.

## Centralization & Control Risks

### Governance

- **All three tokens and their core vaults are upgradeable transparent proxies with no onchain timelock.** A 3-of-5 (or 3-of-4 for brBTC operations) Safe can swap any implementation atomically.
- **Four distinct Safes** govern the system (see Contract Addresses → Governance Layer). Three of them are 3-of-5; one is 3-of-4 (brBTC Vault admin).
- **Signer overlap** between Safes (signers `0x09610d…` and `0x1fc76b…` each appear in multiple Safes) reduces the practical independence of the governance partition.
- **No Safe Guards or Modules configured on any of the four Safes** — verified onchain by reading the Safe Guard storage slot (`0x4a204f…34c8`) and `getModulesPaginated(SENTINEL, 10)` on each Safe. All return zero. **There is no Delay module, no spending-limit module, and no Guard contract intercepting transactions.** A 3/5 (or 3/4) signature is sufficient to execute any operation, including a contract upgrade or `execute(...)` outflow from the vault, without any onchain delay.
- **Roles:** uniBTC Vault exposes `DEFAULT_ADMIN_ROLE`, `PAUSER_ROLE`, `OPERATOR_ROLE`, `MANAGER_ROLE`. brBTC Vault and uniETH Staking use similar role models. Verified onchain that the protocol deployer EOA [`0x899c284a89e113056a72dC9ADe5B60E80dd3c94f`](https://etherscan.io/address/0x899c284a89e113056a72dc9ade5b60e80dd3c94f) **does not currently hold** `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, `PAUSER_ROLE`, `OPERATOR_ROLE`, or `MANAGER_ROLE` on any of the three vaults (each role probed individually). Initial-deployment grants appear to have been revoked.

### Programmability

- **uniBTC:** Mint is fully programmatic and gated by onchain Chainlink PoR. Redemption is queued — TODO: confirm whether queue processing requires admin signature or runs automatically.
- **brBTC:** More opaque — multi-venue allocation across Babylon/Kernel/SatLayer/Pell/Symbiotic/Mellow is performed by privileged operator roles. The user-facing mint is atomic onchain, but the underlying allocation strategy is admin-driven.
- **uniETH:** Validator selection, EigenLayer registration, and reward distribution involve RockX operations. Per docs, balance reporting is "oracle-less" (onchain reads from beacon chain).

### External Dependencies

| Dependency | Used by | Criticality |
|-----------|---------|-------------|
| Chainlink PoR feed | uniBTC vault mint gating | High — failure stalls mints (acceptable failure mode) |
| Chainlink CCIP | uniBTC + brBTC cross-chain | High — bridge security determines multi-chain peg |
| EigenLayer | uniETH | High — slashing risk once live |
| Babylon Labs | uniBTC, brBTC | High — BTC restaking yield + slashing exposure |
| Kernel DAO, SatLayer, Pell, Symbiotic, Mellow | brBTC | Cumulative — each adds independent counterparty risk |
| RockX validators | uniETH | Sole-operator concentration |
| Undisclosed BTC custodian | uniBTC | Critical — opaque custody is the single largest unknown |

### Team / Doxxing

- **Zhuling Chen** — CEO of Bedrock and CEO of RockX. Publicly identified across LinkedIn, kr-Asia, Blockhead, Pexx interviews. MIT-educated; prior co-founder/COO at aelf.
- **Alex Lam** — co-founder at RockX.
- **Funding:** OKX Ventures led an investment round in Bedrock (Medium 2024 announcement).
- Leadership is doxxed and reputable, but RockX is also the sole validator operator for uniETH — Bedrock's CEO controls both the protocol's governance and its primary off-protocol counterparty.

## Operational Risk

- **Team transparency:** Public, doxxed leadership with prior crypto-industry experience.
- **Documentation:** Adequate GitBook coverage of architecture, fees, redemption (uniBTC and uniETH only — brBTC redemption is undocumented), audits. Some pages are JS-rendered. The audit list is well-organized and links directly to PDFs.
- **Legal structure:** Per Bedrock [Terms of Use](https://docs.bedrock.technology/legal/terms-of-use.md), the website and protocol are operated by **Golden Bull Enterprises Limited**, an entity formed under the laws of the **British Virgin Islands**. Governing-law clause confirms BVI jurisdiction.
- **Incident handling:** The Sept 2024 exploit response was credible — vault paused, re-audited, PoR integrated, users made whole (via third-party reimbursement). However, the reimbursement was extraordinary (not Bedrock's treasury) and there is no published formal incident-response plan.

## Monitoring

### Critical (always)

1. **Chainlink uniBTC PoR feed** [`0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) — `latestAnswer()` vs uniBTC global supply. **Alert if PoR falls below 100% of circulating uniBTC, or if the feed goes stale (no update in 24h heartbeat).**
2. **uniBTC Vault** [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da):
   - `outOfService()` — alert if `true`.
   - `paused()` — alert on state change.
   - `Upgraded` event — alert on any implementation upgrade.
3. **brBTC Vault** [`0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386`](https://etherscan.io/address/0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386):
   - `outOfService()`, `Upgraded` event.
   - `RoleGranted` / `RoleRevoked` for `DEFAULT_ADMIN_ROLE`, `OPERATOR_ROLE`.
4. **uniETH Staking** [`0x4beFa2aA9c305238AA3E0b5D17eB20C045269E9d`](https://etherscan.io/address/0x4beFa2aA9c305238AA3E0b5D17eB20C045269E9d):
   - `Upgraded` event.
   - Validator registration / EigenPod events.

### Token-supply monitoring

- `totalSupply()` on each of the three tokens; cross-check Ethereum supply against DefiLlama aggregate.
- Alert on sudden supply changes >10% in 24h.

### Governance monitoring

- Safe owner/threshold changes (`AddedOwner`, `RemovedOwner`, `ChangedThreshold`) on all four governance Safes:
  - [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3)
  - [`0x3050620423f4dB43E1904815E898C466526387b8`](https://etherscan.io/address/0x3050620423f4dB43E1904815E898C466526387b8)
  - [`0xAeE017052DF6Ac002647229D58B786E380B9721A`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A)
  - [`0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9`](https://etherscan.io/address/0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9)
- ProxyAdmin `OwnershipTransferred` events on:
  - [`0x029e4fbdaa31de075dd74b2238222a08233978f6`](https://etherscan.io/address/0x029e4fbdaa31de075dd74b2238222a08233978f6)
  - [`0xa5f2b6ab5b38b88ba221741b3a189999b4c889c6`](https://etherscan.io/address/0xa5f2b6ab5b38b88ba221741b3a189999b4c889c6)
  - [`0x9f63269196a8828f05f2e49d1078ea7c44e7f002`](https://etherscan.io/address/0x9f63269196a8828f05f2e49d1078ea7c44e7f002)

### Peg / liquidity

- uniBTC/WBTC ratio on Uniswap V3 (Ethereum) and Aerodrome (Base). Alert if discount >2% sustained for >1h.
- brBTC/BTC ratio: no liquid onchain pool to establish a market ratio. Monitor `totalSupply()` against backing reports if Bedrock publishes a brBTC PoR feed in the future.

### Recommended frequency

- PoR feed: every block (or via Chainlink keeper-style monitor).
- Vault `outOfService` / pause: every block.
- Governance multisig activity: daily.
- Supply reconciliation: daily.
- TVL: daily.

## Appendix: Contract Architecture

```
Governance Layer
================
Safe 0xC9dA980f… (3/5) ──owns──> ProxyAdmin 0x029e4fbd… ──admin──> uniBTC token + uniBTC Vault
                       ──holds DEFAULT_ADMIN_ROLE──> uniBTC Vault

Safe 0x30506204… (3/5) ──owns──> ProxyAdmin 0xa5f2b6ab… ──admin──> uniETH token + uniETH Staking

Safe 0xAeE01705… (3/5) ──owns──> ProxyAdmin 0x9f632691… ──admin──> brBTC token + brBTC Vault
                       ──holds DEFAULT_ADMIN_ROLE──> uniETH Staking

Safe 0x1f3c54ec… (3/4) ──holds DEFAULT_ADMIN_ROLE──> brBTC Vault

Token Layer (all transparent upgradeable proxies)
=================================================
uniBTC  0x004E9C…0568  impl 0xe0E6a1…cAD
uniETH  0xF1376b…1F4   impl 0x8a9486…590  ("RockXETH")
brBTC   0x2eC37d…646   impl 0x6fc607…fbe

Protocol Layer
==============
uniBTC Vault     0x047D41…D6Da  impl 0x01e916…752E  (VaultWithoutNative)
                   │
                   ├── chainlinkReserveFeeder ──> 0xc590D9fb…fF2 (Chainlink uniBTC PoR)
                   ├── uniBTCSupplyFeeder ──────> 0xE54291…c716 (global uniBTC supply oracle)
                   └── accepts deposits ────────> WBTC, FBTC, cbBTC, M-BTC

uniETH Staking   0x4beFa2…9E9d  impl 0xf047d1…f110  (Staking)
                   │
                   ├── Restaking proxy ─────────> 0x3f4eAc…9850 ──> EigenLayer
                   └── EigenPod ────────────────> 0x926720…1cCE

brBTC Vault      0x1419b4…3386  impl 0xC7D81a…34C7  (brVault)
                   │
                   └── Allocates to: Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, Mellow

Underlying / External
=====================
Babylon Labs (BTC restaking)
EigenLayer (ETH restaking)
RockX (validator operator for uniETH)
Chainlink (PoR feed + CCIP cross-chain bridge)
Undisclosed BTC custodian(s)  ←── TODO
```

---

## Risk Summary

### Key Strengths

1. **Onchain Chainlink Proof-of-Reserve is wired directly into the uniBTC Vault** — mints atomically revert if reserves are inadequate. This is a meaningful post-exploit hardening that few BTC LRT competitors have.
2. **Five published audits** by two reputable firms (PeckShield, BlockSec), including two post-exploit re-audits of the patched code.
3. **Doxxed leadership** (Zhuling Chen, RockX/Bedrock CEO; Alex Lam, RockX co-founder) with prior crypto experience and OKX Ventures backing.
4. **All contract source code is verified on Etherscan** for both proxies and implementations.
5. **Onchain governance uses Safe multisigs** (3-of-5 and 3-of-4) rather than EOAs. Verified onchain that the deployer EOA holds no privileged roles on any of the three vaults today.

### Key Risks

1. **September 2024 exploit on the same uniBTC vault still in use** (~$2M lost). Users were made whole only because Fuzzland (third party) reimbursed — Bedrock's own treasury did not absorb the loss, so a recurrence is not necessarily covered.
2. **No timelock and no Safe Guard/Delay module on any upgrade or admin path.** Confirmed onchain: all four governance Safes return zero for both the EIP-1967 Safe Guard storage slot and `getModulesPaginated`. A 3-of-5 (or 3-of-4) signature is sufficient to upgrade any implementation or call `execute()` on the vault, with zero onchain delay.
3. **Mint allowed against up to 10% under-collateralization.** Verified onchain `adequacyRatio = 900` (base 1000): the Vault `checkReserve` modifier permits minting as long as PoR-reported reserves are ≥ 90% of circulating uniBTC. This is by design but means PoR is not a strict 1:1 gate.
4. **Custody opacity for the BTC backing uniBTC and brBTC.** No custodian is named in docs, and Chainlink PoR only verifies balances at self-declared addresses — not control of those addresses. Only **0.32 WBTC** is held directly in the Ethereum Vault contract; the remaining ~4,615 BTC of backing is held off-Ethereum (Babylon-restaked, multi-chain wrapped, native Bitcoin).
5. **Signer overlap across governance Safes** reduces independence of the four-Safe partition.
6. **Sole validator operator (RockX) for uniETH**, owned by Bedrock's CEO — concentration of governance and the off-chain counterparty.
7. **Compounded restaking exposure for brBTC** across six restaking venues — each is a separate slashing/contract counterparty.
8. **Catastrophic uniETH DEX liquidity** — quoted slippage ~63% for a $1M exit and ~93% for $5M; sole pool of consequence is uniETH/frxETH at $485K TVL. uniBTC at $5M cliffs to ~77% slippage. brBTC has no DEX exit at any size. Holders depend on protocol redemption queues for non-trivial exits.
9. **No formal bug bounty program** (no Immunefi / Cantina / Sherlock; SEAL Safe Harbor confirmed NOT adopted via onchain registry check).

### Critical Risks

- Same uniBTC vault address that was previously exploited remains in production. The risk is mitigated by PoR-gated minting, but a logic bug in a future implementation upgrade is the residual concern, and there is no timelock to delay a malicious or buggy upgrade.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASS (5 audits across the three tokens, 2 reputable firms).
- [x] **Unverifiable reserves** — PASS for uniBTC (Chainlink PoR onchain) and uniETH (beacon chain). **BORDERLINE for brBTC** (no PoR, multi-venue accounting). Not triggered because the asset family as a whole has onchain verification for the dominant component (uniBTC).
- [x] **Total centralization** — PASS (Safes are 3-of-5 and 3-of-4, not single EOA; deployer EOA confirmed to hold no roles today).

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**
- 5 audit reports by 2 reputable firms (PeckShield, BlockSec) including 2 post-exploit re-audits. No top-tier firm engagement (Trail of Bits, OpenZeppelin, ChainSecurity).
- No public bug bounty program.
- Complex contract surface (multi-venue restaking, cross-chain via CCIP, PoR-gated mint).
- **Score: 3.0**

**Subcategory B: Historical Track Record**
- ~2 years in production (uniETH since Feb 2024; uniBTC mid-2024; brBTC Dec 2024).
- Bedrock combined TVL $379M today (Ethereum $121M); peak $638M; sustained >$100M for >1 year.
- One major exploit (Sept 2024, ~$2M) — pulls score up.
- **Score: 2.5** (1–2 years sustained, >$50M, with prior incident penalty)

**Audits & Historical Score = (3.0 + 2.5) / 2 = 2.75**

**Score: 2.75/5** — Adequate audit coverage from two reputable firms and >$100M TVL sustained, but a prior $2M exploit and no top-tier audit weigh on the score.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**
- 3-of-5 (and 3-of-4 for brBTC ops) Safes; no Safe Guard or Module on any of the four Safes (verified onchain); no onchain timelock; fully upgradeable transparent proxies.
- Privileged roles can pause / unpause / upgrade / re-allocate restaking venues without delay.
- Doxxed signers per docs but not individually identified onchain. Signer overlap reduces Safe independence.
- **Score: 4.0** (Multisig 3-of-5, effectively instant execution, powerful admin roles)

**Subcategory B: Programmability**
- uniBTC mint is fully programmatic and PoR-gated.
- brBTC venue allocation is admin-driven across six restaking protocols.
- uniETH validator selection and EigenLayer integration involve RockX off-chain operations.
- **Score: 2.5** (Hybrid: onchain mint with admin-driven allocation; PPS-equivalent derived onchain for uniBTC via PoR)

**Subcategory C: External Dependencies**
- Many critical dependencies: Babylon, EigenLayer, RockX validators, Chainlink (PoR + CCIP), and for brBTC five additional restaking protocols (Kernel DAO, SatLayer, Pell, Symbiotic, Mellow).
- Failure of any restaking venue can socialize losses through brBTC; failure of CCIP impacts multi-chain peg; PoR failure halts mints (safe failure mode).
- Undisclosed BTC custodian is a hard external dependency.
- **Score: 4.0** (Many/newer protocol dependencies; critical functionality depends on them)

**Centralization Score = (4.0 + 2.5 + 4.0) / 3 = 3.5**

**Score: 3.5/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**
- 100% backed onchain at present (Chainlink PoR shows ~4,615 BTC backing vs ~3,103 BTC of uniBTC+brBTC supply across chains).
- **However, the protocol explicitly tolerates up to 10% under-collateralization** via `adequacyRatio = 900` — mints are permitted when backing is ≥ 90% of supply.
- Collateral mix: blue-chip (WBTC, cbBTC, native ETH staked) plus newer wrapped variants (FBTC, M-BTC) plus restaked positions at Babylon, EigenLayer, and (for brBTC) five additional venues.
- Restaked collateral carries slashing risk; brBTC compounds this across six venues.
- **Score: 3.5** (mixed quality, slashing exposure, opaque off-chain custody, explicit 10% under-collateralization tolerance)

**Subcategory B: Provability**
- **uniBTC: 2.5** — Chainlink PoR wired into Vault and verifiable onchain, but PoR is a self-attested address list and the 10% adequacy band weakens the gate.
- **brBTC: 4.0** — no PoR, no published per-venue allocation accounting.
- **uniETH: 2.5** — beacon-chain and EigenPod balances verifiable onchain, but no aggregate dashboard.
- Weighted by approximate USD size (uniBTC ≫ uniETH ≫ brBTC on Ethereum): blended **~2.75**.
- **Score: 2.75**

**Funds Management Score = (3.5 + 2.75) / 2 = 3.125**

**Score: 3.1/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- uniBTC primary exit is protocol redemption (8-day queue, 0.5% fee, 2 WBTC/day Ethereum cap). Secondary DEX volume ~$20K/day, slippage ~2.4% at $1M but ~77% at $5M — insufficient for institutional size on Ethereum.
- uniETH primary DEX is uniETH/frxETH on Curve at only **$485K TVL** — quoted slippage **~63% at $1M, ~93% at $5M**. Effectively no secondary exit; redemption queue (32-ETH multiples + EigenLayer 7-day delay) is the only realistic path.
- brBTC has effectively zero secondary liquidity and undisclosed redemption mechanics.
- All redemption queues persisted through prior volatility per docs; no published incident of redemption queue freeze.
- **Score: 4.0** (Withdrawal queues with very thin DEX liquidity; uniETH market exit catastrophic above ~$200K; brBTC market exit nonexistent; +0.5 because queue mechanism is throttled)

**Score: 4.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Doxxed leadership (Zhuling Chen, Alex Lam) with prior crypto industry experience and institutional funding (OKX Ventures).
- Legal entity confirmed: Golden Bull Enterprises Limited (BVI) per Terms of Use.
- Documentation is adequate but lacks named custodian, formal incident response plan, and brBTC redemption details.
- The Sept 2024 incident was handled credibly (re-audit + PoR + Fuzzland reimbursement).
- **Score: 2.0** (Public team, known legal entity in established offshore jurisdiction, good docs, established product, with custody/IR gaps)

**Score: 2.0/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.75 | 20% | 0.550 |
| Centralization & Control | 3.5 | 30% | 1.050 |
| Funds Management | 3.1 | 30% | 0.930 |
| Liquidity Risk | 4.0 | 15% | 0.600 |
| Operational Risk | 2.0 | 5% | 0.100 |
| **Subtotal** | | | **3.230** |

**Modifiers:**
- Prior $2M exploit on the same vault still in use: **+0.5** (incident penalty; framework specifies modifiers for sustained operation without incident, this applies the inverse for an unmitigated repeat-exposure risk)
- Custodian opacity for BTC backing: **+0.25**
- No timelock, no Safe Guard/Module, and explicit 10% under-collateralization tolerance: **+0.25**

**Adjusted Final Score: 3.230 + 1.0 = ~4.2 / 5.0** (capped within [1.0, 5.0])

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

The three Bedrock LRTs are not all equally risky:
- **uniBTC** carries the most direct exposure to the September 2024 vulnerability surface but also benefits from the strongest provability mitigation (Chainlink PoR wired into the Vault).
- **brBTC** is the riskiest individually — multiple compounding restaking-venue counterparties, no PoR, effectively no secondary liquidity, low TVL ($9M).
- **uniETH** is a relatively conventional ETH LST + EigenLayer restaking design with single-operator (RockX) concentration.

A vault implementer should treat these as three different assets with different sizing limits.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months, or sooner on any of the events below.
- **TVL-based:** Reassess if Bedrock aggregate TVL changes by ±40% from $379M.
- **Incident-based:** Any exploit, depeg >2% sustained >1h, redemption queue freeze, or governance compromise.
- **Specific triggers:**
  1. Chainlink uniBTC PoR feed reports backing < circulating supply (immediate alert).
  2. Implementation upgrade on any of the three token proxies or three core vaults.
  3. ProxyAdmin or Safe ownership transfer.
  4. Safe owner addition/removal or threshold change.
  5. brBTC adds a new restaking venue or removes an existing one.
  6. Public disclosure of the BTC custodian (positive trigger — would reduce custody-opacity modifier).
  7. Introduction of a timelock on upgrades (positive trigger).
  8. Top-tier audit publication (positive trigger — would improve audit score).
  9. Listing on Immunefi / Cantina / SEAL Safe Harbor (positive trigger).

## Open TODOs (Items Not Verifiable This Session)

- **Custodian identity** for BTC backing uniBTC and brBTC — Bedrock docs and public materials do not name a custodian (Cobo / Ceffu / BitGo / Fireblocks). Treat as a material disclosure gap.
- **brBTC redemption flow** — exact fee, delay, and queue mechanics are not documented publicly. The brBTC docs cover only mint and bridging; the dApp page is JS-rendered. Contact Bedrock for clarification.
- **September 2024 restitution transactions** — onchain Fuzzland-to-Bedrock reimbursement tx hashes are not published. The labeled `fuzzland.eth` address shows no $2M outbound; reimbursement appears to have come from an unannounced Fuzzland-controlled wallet.

## Sources

- Bedrock docs: https://docs.bedrock.technology/
- Bedrock app: https://app.bedrock.technology/
- Bedrock statistics: https://app.bedrock.technology/statistics
- Bedrock audit reports: https://docs.bedrock.technology/security/audit-reports
- Bedrock GitHub org: https://github.com/Bedrock-Technology
- uniBTC GitHub: https://github.com/Bedrock-Technology/uniBTC
- brBTC GitHub: https://github.com/Bedrock-Technology/omni
- DefiLlama Bedrock uniBTC: https://defillama.com/protocol/bedrock-unibtc
- DefiLlama Bedrock (aggregate): https://defillama.com/protocol/bedrock
- Chainlink uniBTC PoR feed: https://data.chain.link/feeds/ethereum/mainnet/unibtc-por
- QuillAudits hack analysis: https://www.quillaudits.com/blog/hack-analysis/bedrock-2million-exploit
- BlockApex hack analysis: https://blockapex.medium.com/unibtc-hack-analysis-bffd6cebd4a8
- Babylon Labs: https://babylonlabs.io/
- EigenLayer: https://www.eigenlayer.xyz/
- Onchain verification via `cast` against Ethereum mainnet RPC: `totalSupply()`, `name()`, `symbol()`, `decimals()`, EIP-1967 implementation/admin slots, `owner()` on ProxyAdmins, `getThreshold()` / `getOwners()` on each Safe, `hasRole(bytes32,address)` on each Vault for `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, `PAUSER_ROLE`, `OPERATOR_ROLE`, `MANAGER_ROLE`. `chainlinkReserveFeeder()`, `uniBTCSupplyFeeder()`, `outOfService()`, `paused()` on uniBTC Vault. `latestAnswer()`, `description()`, `decimals()` on the Chainlink PoR feed.
