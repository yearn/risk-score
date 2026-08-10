# Protocol Risk Assessment: Bedrock uniBTC

- **Assessment Date:** August 10, 2026
- **Token:** uniBTC
- **Chain:** Ethereum
- **Token Address:** [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568)
- **Final Score: 3.6/5.0**

## Overview + Links

Bedrock uniBTC is a wrapped-BTC liquid restaking token. Users deposit supported BTC-denominated assets into the uniBTC Vault and receive uniBTC 1:1 in 8-decimal BTC units. Bedrock documentation describes the underlying BTC exposure as deployed across BTC restaking / custody venues, with Chainlink Proof-of-Reserve used as the public reserve check.

This report is scoped to **uniBTC only**. Bedrock brBTC is a separate codebase and asset, but it is mentioned where relevant because brBTC accepts uniBTC as a deposit asset and therefore creates downstream demand/contagion paths for uniBTC.

**Links:**

- [Bedrock website](https://www.bedrock.technology/)
- [Bedrock app](https://app.bedrock.technology/)
- [Bedrock docs](https://docs.bedrock.technology/)
- [Statistics dashboard](https://app.bedrock.technology/statistics)
- [GitHub - Bedrock-Technology](https://github.com/Bedrock-Technology)
- [uniBTC GitHub - Bedrock-Technology/uniBTC](https://github.com/Bedrock-Technology/uniBTC)
- [DefiLlama - Bedrock uniBTC](https://defillama.com/protocol/bedrock-unibtc)
- [DefiLlama - Bedrock aggregate](https://defillama.com/protocol/bedrock)
- [Chainlink uniBTC PoR feed](https://data.chain.link/feeds/ethereum/mainnet/unibtc-por)
- [QuillAudits - Sept 2024 exploit analysis](https://www.quillaudits.com/blog/hack-analysis/bedrock-2million-exploit)
- [BlockApex - uniBTC hack analysis](https://blockapex.medium.com/unibtc-hack-analysis-bffd6cebd4a8)
- [Babylon Labs](https://babylonlabs.io/)
- [Merlin Chain M-BTC documentation](https://docs.merlinchain.io/merlin-docs/user-quick-start/how-to/m-token/what-is-m-token)
- [Merlin Chain official bridge](https://docs.merlinchain.io/merlin-docs/user-quick-start/how-to/bridge/official-bridge)
- [M-BTC token and holders](https://scan.merlinchain.io/token/0xB880fd278198bd590252621d4CD071b1842E9Bcd)

## Contract Addresses

### uniBTC Token Layer

| Contract | Address | Role |
|----------|---------|------|
| uniBTC token proxy | [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568) | User-facing uniBTC token, EIP-1967 transparent proxy |
| uniBTC token implementation | [`0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD`](https://etherscan.io/address/0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD) | Token implementation |
| uniBTC ProxyAdmin | [`0x029E4FbDAa31DE075dD74B2238222A08233978f6`](https://etherscan.io/address/0x029E4FbDAa31DE075dD74B2238222A08233978f6) | Upgrade authority for uniBTC token, uniBTC Vault, and CCIPPeer |

### Bridge / Cross-Chain Mint Layer

| Contract | Address | Role |
|----------|---------|------|
| Chainlink CCIP BurnMintTokenPool 1.5.1 | [`0x1689C22eD5435e49071CFc208D1Ac6F2A2274490`](https://etherscan.io/address/0x1689C22eD5435e49071CFc208D1Ac6F2A2274490) | Registered uniBTC pool in the CCIP TokenAdminRegistry; holds `MINTER_ROLE`; `owner()` = Bedrock admin Safe [`0xAeE01705…`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A) (3/5) |
| Bedrock CCIPPeer | [`0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc`](https://etherscan.io/address/0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc) | Bedrock-custom CCIP messaging contract; holds `MINTER_ROLE`; upgradeable proxy under the uniBTC ProxyAdmin |
| Free Tunnel bridge proxy | [`0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | Third-party Free Tunnel (Free Protocol) bridge; holds `MINTER_ROLE`; not mentioned in Bedrock's uniBTC bridge docs |

### uniBTC Protocol Layer

| Contract | Address | Role |
|----------|---------|------|
| uniBTC Vault proxy | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | Mint/redeem uniBTC against allowed wrapped BTC |
| uniBTC Vault implementation | [`0x01e9161D1621466eB086651FD514d3eFb8C3752E`](https://etherscan.io/address/0x01e9161D1621466eB086651FD514d3eFb8C3752E) | `VaultWithoutNative` implementation |
| Chainlink uniBTC PoR feed | [`0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) | uniBTC reserve feed, 18 decimals, 2% deviation |
| uniBTC supply feeder | [`0xE542919E4b281f10b437F947c8Ba224DdfaBc716`](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716) | Aggregates global uniBTC supply for PoR comparison |

### Governance Layer

| Safe | Address | Threshold | Controls |
|------|---------|-----------|----------|
| uniBTC ops Safe | [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) | 3/5 | Owns uniBTC ProxyAdmin; holds `DEFAULT_ADMIN_ROLE` on uniBTC Vault |

Onchain verification on August 10, 2026 read Safe thresholds/owners via `getThreshold()` / `getOwners()`, ProxyAdmin ownership via `owner()`, Vault/token roles via `hasRole(bytes32,address)`, and EIP-1967 implementation/admin slots. The uniBTC ops Safe has no modules and no guard configured (`getModulesPaginated` empty, guard storage slot zero).

**Signer overlap:** signer [`0x09610d4239c8f3413509202DCcC7e27C6B0a47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3) appears in multiple Bedrock governance Safes, and signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32) appears in both the uniBTC and brBTC Safe set. This reduces effective independence across Bedrock product lines.

## How uniBTC Works

- **Deposit assets accepted:** WBTC, FBTC, cbBTC, M-BTC, and uniBTC itself for cross-chain routing.
- **Mint flow:** User deposits a permitted wrapped BTC asset into the Vault `mint` function and atomically receives uniBTC 1:1 in 8-decimal BTC units.
- **PoR gate:** Minting checks Chainlink PoR reserves against circulating supply reported by the uniBTC supply feeder. Onchain verification on August 10, 2026 read `chainlinkReserveFeeder = 0xc590D9fb...`, `uniBTCSupplyFeeder = 0xE542919E...`, `feederHeartbeat = 86,400s`, `outOfService = false`, and `paused = false`.
- **Adequacy ratio:** The Vault explicitly permits minting while PoR-reported reserves are at least 90% of supply. Onchain verification read `adequacyRatio = 900`, and source review found `checkReserve` requiring `supply * adequacyRatio / 1000 <= reserves`. This is not a strict 1:1 mint gate.
- **Redeem flow:** Bedrock docs describe claim-based unstaking with an **8-day delay**, **0.5% redemption fee**, and **2 WBTC/day Ethereum cap**.
- **Custody:** TODO - Bedrock docs do not name the BTC custodian(s), signers, or full address-control model for the backing wallets monitored by Chainlink PoR.
- **Cross-chain:** Chainlink CCIP is the documented canonical bridge path (BurnMintTokenPool with 14 configured lanes). Onchain enumeration also found two additional live Ethereum mint paths: a Bedrock-custom `CCIPPeer` contract and a third-party **Free Tunnel** bridge that Bedrock's uniBTC bridge documentation does not mention. uniBTC is deployed across many chains; Ethereum is one slice of total supply.
- **Freeze authority:** The uniBTC token implements `FREEZER_ROLE` with a `frozenUsers` mapping and a `freezeToRecipient` address. The ops Safe holds `FREEZER_ROLE`, and `freezeToRecipient` is currently the deployer EOA [`0x899c284A…`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f) (verified August 10, 2026). Token-level freezing of user balances is a governance-controlled loss/censorship path.

## Token Mint Authority

**Mint mechanism:** Role-gated AccessControl. `mint(address,uint256)` on the uniBTC token is `onlyRole(MINTER_ROLE)`; `burn`/`burnFrom` are standard permissionless holder burns. The role is not enumerable onchain, so holders were reconstructed from a full `RoleGranted`/`RoleRevoked` event scan on the token (from deployment to August 10, 2026) and each current holder confirmed via `hasRole`.

**Mint requires backing:** No — at the token level any `MINTER_ROLE` holder can issue unbacked uniBTC. Backing checks live in the callers: the Vault path is PoR-gated (to 90% adequacy); the bridge paths rely on burn/lock on the source chain.

**Current Ethereum `MINTER_ROLE` holders (verified August 10, 2026):**

| Minter / Role Holder | Address | Notes |
|----------------------|---------|-------|
| uniBTC Vault | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | Collateralized mint path for supported wrapped BTC deposits. Mint is PoR-gated but allows a 10% reserve shortfall via `adequacyRatio = 900`. |
| Chainlink CCIP BurnMintTokenPool 1.5.1 | [`0x1689C22eD5435e49071CFc208D1Ac6F2A2274490`](https://etherscan.io/address/0x1689C22eD5435e49071CFc208D1Ac6F2A2274490) | Registered in the CCIP `TokenAdminRegistry` (`getPool(uniBTC)` verified). Burn/mint model — the CCIP message path can mint native uniBTC supply. `owner()` = Bedrock admin Safe (3/5). Outbound rate limits enabled on all 14 configured lanes. |
| Bedrock CCIPPeer | [`0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc`](https://etherscan.io/address/0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc) | Bedrock-custom CCIP messaging contract predating the token pool. Upgradeable `TransparentUpgradeableProxy` administered by the uniBTC ProxyAdmin (i.e. the 3/5 ops Safe). Its message-authentication configuration is a distinct mint trust path. |
| Free Tunnel bridge | [`0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | Third-party Free Protocol bridge (`TunnelContract` behind `DelayedERC1967Proxy`). Mints require 3-of-4 executor signatures; admin is EOA [`0x0014Eb4A…`](https://etherscan.io/address/0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C); executor rotation has a built-in 36h–5d delay. **Not mentioned in Bedrock's uniBTC bridge docs.** The same contract also holds `MINTER_ROLE` on Bedrock's brBTC. |

**Token admin / freeze authority:** the ops Safe [`0xC9dA980f…`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) (3/5) holds `DEFAULT_ADMIN_ROLE` (can grant `MINTER_ROLE` to any address with no timelock — an unbacked-mint escalation path) and `FREEZER_ROLE` (token-level user freezing; `freezeToRecipient` is the deployer EOA `0x899c284A…`).

**Historical grants (from the event scan):** several temporary `MINTER_ROLE` grants have been made and revoked over the token's life, including grant-mint-revoke same-block patterns by the ops Safe and two temporary grants to the operational EOA [`0x9251Fd3D…`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) (revoked). This is evidence of manual, admin-driven supply operations outside the vault path.

**Rate limits / supply caps:** none at the token level; the CCIP pool enforces per-lane rate limits (bucket capacity 2 uniBTC, ≈200 uniBTC/day refill on the sampled lane). Free Tunnel and CCIPPeer limits: TODO.

**Non-Ethereum deployments:** complete mint/burn authority enumeration for every non-Ethereum uniBTC deployment (30+ chains) remains TODO.

## Audits and Due Diligence Disclosures

| Scope | Firm | Date | Link |
|-------|------|------|------|
| uniBTC | BlockSec | Jun 12, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/code%20audit%20blocksec.pdf) |
| uniBTC | PeckShield | Oct 1, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/PeckShield-Audit-Report-uniBTC-v1.0.pdf) |
| uniBTC | BlockSec | Oct 30, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/blocksec_bedrock_unibtc_v1.0-signed.pdf) |

The October 2024 audits are post-exploit re-engagements covering the patched uniBTC vault. All three published uniBTC audits are from 2024; no later independent review was found for subsequent production changes, dependency evolution, or the current cross-chain deployment. No top-tier audit engagement (Trail of Bits, OpenZeppelin, ChainSecurity, Spearbit, Cantina) was found for uniBTC.

The age of the reviews matters for two reasons. First, an audit is point-in-time evidence: it only supports the code, configuration, assumptions, and dependencies that were in scope when the work was performed. Even if the core vault bytecode remains unchanged, uniBTC's current security depends on live governance configuration, PoR inputs, cross-chain deployments, custody and Babylon operations, and the material M-BTC/Merlin exposure described below. The 2024 reports do not establish that this present system has been reviewed as one end-to-end trust boundary.

Second, the security-review capability available in 2026 is materially different. Modern engagements can supplement expert manual review with repository-wide AI agents, automated exploit construction, invariant testing, and repeated independent passes. The 2026 EVMbench research demonstrates that frontier agents can detect, patch, and execute high-severity smart-contract exploits end to end, while also showing that detection remains incomplete. This does not make the 2024 audits invalid or make AI a substitute for experienced human auditors; it means those reports did not benefit from today's additional review and adversarial-testing capabilities. A current re-audit should therefore be treated as materially stronger assurance than relying solely on the 2024 reports.

### Bug Bounty

- **No public Immunefi / Cantina / Sherlock / Code4rena bug bounty program found.** Direct URL [immunefi.com/bug-bounty/bedrock/](https://immunefi.com/bug-bounty/bedrock/) returns 404. The Bedrock docs site has no dedicated bug-bounty page.
- **SEAL Safe Harbor: NOT registered.** A check of the onchain SafeHarborRegistry [`0x8f72fcf695523A6FC7DD97EafDd7A083c386b7b6`](https://etherscan.io/address/0x8f72fcf695523A6FC7DD97EafDd7A083c386b7b6) adoption logs found no Bedrock-related entries.

## Historical Track Record

- **Time in production:** uniBTC launched in 2024; DeFiLlama first records Bedrock uniBTC on Oct 29, 2024.
- **TVL (DeFiLlama, August 10, 2026):** Bedrock uniBTC reported **$294.4M**. Major slices: Bitcoin $111.4M, Ethereum $83.7M, Merlin $56.4M, BOB $26.1M, BNB Chain $16.1M.
- **Peak TVL:** Bedrock uniBTC peaked at **$638.3M** on July 15, 2025.
- **Minimum after launch:** $109.4M on Nov 2, 2024, shortly after the Sept 2024 exploit.
- **Ethereum total supply:** Onchain verification on August 10, 2026 read **2,984.38211771 uniBTC** (`298,438,211,771` sats).
- **Global supply vs PoR reserves (August 10, 2026):** the uniBTC supply feeder reported a global supply of **4,551.54515183 uniBTC**, and the Chainlink PoR feed reported reserves of **4,642.877154987678460714 BTC** (18 decimals, updated 2026-08-09T21:48Z) — reserves ≈ **102.0%** of reported global supply at the snapshot.

### Security Incident: September 27, 2024 - uniBTC Mint Exploit

- **Loss:** approximately $2M, reported as roughly 649.6 WETH by public incident analyses.
- **Root cause:** The uniBTC Vault mint flow did not properly validate the deposit asset's price/decimals against the uniBTC issuance rate. Public analyses describe an attacker depositing WETH and receiving uniBTC 1:1, then swapping uniBTC for WETH.
- **Affected contract:** uniBTC Vault [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da), the same proxy address still in use after the patch.
- **Exploiter:** EOA [`0x2bFB373017349820dda2Da8230E6b66739BE9F96`](https://etherscan.io/address/0x2bFB373017349820dda2Da8230E6b66739BE9F96).
- **Response:** Bedrock paused the vault, upgraded the implementation, added Chainlink Proof-of-Reserve / Secure Mint checks, and re-audited with PeckShield and BlockSec in October 2024. Fuzzland publicly took responsibility because the attacker was reportedly a Fuzzland ex-employee; Fuzzland reimbursed Bedrock with company funds ([Cointelegraph, June 2025](https://cointelegraph.com/news/fuzzland-ex-employee-bedrock-unibtc-exploit); [Cryptonews](https://cryptonews.com/news/ex-employee-hacks-bedrock-unibtc-for-2m-fuzzland-uncovers-insider-exploit/)).
- **Restitution txs:** TODO - specific onchain Fuzzland-to-Bedrock reimbursement transaction hashes are not publicly disclosed.

The exploit occurred on the same vault proxy that remains in production. Post-exploit controls are materially stronger, but future upgrade or validation mistakes remain a high-impact path because there is no onchain timelock.

## Funds Management

### Accessibility

| Token | Mint | Redeem | Fees | Permissioning |
|-------|------|--------|------|---------------|
| uniBTC | Atomic, PoR-gated | 8-day queue, per docs | 0.5% redemption fee; 2 WBTC/day Ethereum cap | Permissionless |

### Collateralization

- uniBTC is intended to be backed 1:1 by wrapped BTC assets and native/restaked BTC positions.
- Accepted deposit assets include WBTC, FBTC, cbBTC, and M-BTC. Counterparty quality is mixed: WBTC and cbBTC are more established; FBTC and M-BTC are newer issuer/custody dependencies.
- Chainlink PoR reported backing at ≈102.0% of global supply in the August 10, 2026 verification pass, but the mint gate permits up to 10% under-collateralization via `adequacyRatio = 900`.
- Only a small amount of WBTC is held directly in the Ethereum Vault (0.74418586 WBTC on August 10, 2026, plus 0.01 WBTC in the ops Safe). The majority of backing sits outside the Ethereum vault contract, including native BTC/restaking/custody arrangements monitored through PoR.

#### M-BTC / Merlin concentration

The Bedrock statistics dashboard reported **990.88378325 M-BTC** within uniBTC reserves on August 8, 2026, equal to approximately **21.3%** of total reported reserves (4,643.29 BTC). The linked Merlin explorer independently showed Bedrock's reserve address [`0xF977...AB18`](https://scan.merlinchain.io/address/0xF9775085d726E782E83585033B58606f7731AB18) as the **second-largest M-BTC holder**, holding **17.38%** of M-BTC supply.

M-BTC is not native BTC; Merlin documents it as a receipt minted against Bitcoin Layer 1 assets deposited through Merlin's bridge. This adds Merlin bridge custody, relayer, chain-liveness, and redemption risk beneath uniBTC. Merlin launched mainnet in February 2024 and M-BTC claims opened in March 2024, so the product is no longer brand new but remains materially younger and less trust-minimized than established wrapped-BTC rails. Merlin's official bridge documentation states that the bridge is upgradeable, multisig-managed, and has **no timelock**. Merlin's data-availability documentation also describes public DA as a "coming" solution, while the current design relies on its oracle/DAC layer and offchain proof-verification machinery rather than Bitcoin enforcing the full L2 state transition.

The M-BTC token source restricts mint and burn to its configured bridge, and the current main bridge exposes multiple authorized `unlockTokenAdmin` relayers. That is better than an unrestricted public mint, but correctness still depends on offchain Bitcoin-deposit observation, bridge administration, and custody/signing. No public user-controlled unilateral Bitcoin exit path was identified.

### Provability

uniBTC has materially better reserve provability than brBTC because a Chainlink PoR feed is wired directly into the uniBTC Vault mint path. The Bedrock dashboard also exposes the constituent native-BTC addresses and wrapped-token reserve addresses; it is more than an unlinked aggregate chart. However, address visibility does not prove the full operational state:

- The feed depends on a Bedrock-supplied address set.
- PoR validates balances, not legal ownership, private-key control, liabilities, encumbrances, or the ability to redeem those assets promptly.
- The Vault allows minting if reserves are at least 90% of supply.
- The named custodian/signing setup remains undisclosed, and the dashboard does not map native-BTC UTXOs to Babylon staking state, finality providers, slashing exposure, or unbonding status.
- Approximately 21.3% of reserves are M-BTC, so proving that Bedrock holds the token does not independently prove the corresponding Bitcoin remains available behind Merlin's bridge.

## Liquidity Risk

- **Primary exit:** Bedrock redemption queue. The documented 8-day delay, 0.5% fee, and 2 WBTC/day Ethereum cap materially limit large same-chain exits.
- **Secondary exit:** CoinGecko reported uniBTC 24h volume of only **$7,243** across all listed venues on August 10, 2026 — effectively no secondary market for a ~$294M asset.
- **Slippage (CoW Protocol quotes, August 10, 2026):** a **15.46 uniBTC (~$1M) → WBTC** quote returned 10.50 WBTC, ≈**32% slippage**; a **77.3 uniBTC (~$5M)** quote returned 10.51 WBTC, ≈**86% slippage**. Onchain secondary exit is effectively unusable beyond trivial size; the capped, delayed redemption queue is the only real exit.
- **Downstream integration:** brBTC accepts uniBTC as an input asset. Stress in brBTC may create uniBTC flow pressure, and stress in uniBTC directly affects brBTC when uniBTC is used as backing.

## Centralization & Control Risks

### Governance

- uniBTC token and uniBTC Vault are upgradeable transparent proxies.
- The uniBTC ops Safe is 3-of-5 and owns the ProxyAdmin.
- The same Safe holds `DEFAULT_ADMIN_ROLE` on the uniBTC Vault.
- No Safe Guard or Delay module is configured on the uniBTC ops Safe (verified August 10, 2026). A 3-of-5 signature can therefore upgrade implementations, grant `MINTER_ROLE`, or freeze user balances without an onchain delay.
- The ops Safe additionally holds `DEFAULT_ADMIN_ROLE` and `FREEZER_ROLE` on the uniBTC token itself: it can grant mint authority to any address and freeze arbitrary user balances, with `freezeToRecipient` currently set to a deployer EOA.
- Two bridge contracts and one Bedrock messaging contract hold live `MINTER_ROLE` (CCIP token pool, CCIPPeer, Free Tunnel); the Free Tunnel path is absent from Bedrock's public documentation.
- Signer overlap across Bedrock Safes weakens practical separation between product lines.

### Programmability

Minting is programmatic and PoR-gated, which is a major strength relative to opaque custody wrappers. The main residual programmability risks are upgradeability, role-controlled pausing/outflows, PoR address-set dependence, and the explicit 90% adequacy threshold.

### External Dependencies

| Dependency | Used by uniBTC | Criticality |
|-----------|----------------|-------------|
| Chainlink PoR feed | Mint reserve gate | High - stale/wrong data can halt or weaken mint safety |
| Chainlink CCIP | Cross-chain routing - BurnMintTokenPool + CCIPPeer both hold `MINTER_ROLE`; 14 lanes, per-lane rate limits enabled | High - bridge security affects multi-chain supply/peg, partially mitigated by rate limits |
| Free Tunnel (Free Protocol) | Cross-chain routing - bridge contract holds `MINTER_ROLE`, undocumented in Bedrock docs | High - third-party bridge with mint rights; 3-of-4 executor signatures, EOA admin |
| WBTC / FBTC / cbBTC | Accepted deposit assets | High - issuer/custody risk |
| M-BTC / Merlin bridge | ~21.3% of reported reserves on Aug. 8, 2026 | High - bridge custody, relayer, upgrade, no-timelock, chain-liveness and redemption risk |
| Bitcoin network / native BTC custody | Backing assets | Critical |
| Babylon Labs / BTC restaking venues | Yield / restaking exposure | High |
| Undisclosed custody/signing setup | BTC backing control | Critical unknown |

## Operational Risk

- **Team transparency:** Bedrock/RockX leadership is public. Zhuling Chen is CEO of Bedrock and RockX; Alex Lam is a RockX co-founder.
- **Legal structure:** Per Bedrock [Terms of Use](https://docs.bedrock.technology/legal/terms-of-use.md), the website and protocol are operated by **Golden Bull Enterprises Limited**, formed under the laws of the **British Virgin Islands**.
- **Documentation:** Public docs cover minting, unstaking, audits, and PoR at a high level. Custodian identity, full signing model, and restitution txs remain undisclosed.
- **Incident handling:** The Sept 2024 response was credible (pause, patch, re-audit, PoR hardening, users made whole through Fuzzland reimbursement), but the incident remains a meaningful historical risk marker because it affected the same vault proxy still in production.

## Monitoring

### Critical

1. **Chainlink uniBTC PoR feed** [`0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2):
   - `latestAnswer()` vs global uniBTC supply.
   - Feed staleness relative to the 24h heartbeat.
2. **uniBTC Vault** [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da):
   - `outOfService()`.
   - `paused()`.
   - `Upgraded` events.
   - Role grants/revocations and `execute()` target list changes.
3. **uniBTC token** [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568):
   - `totalSupply()` changes.
   - Implementation upgrades.
   - `RoleGranted` / `RoleRevoked` for `MINTER_ROLE`, `DEFAULT_ADMIN_ROLE`, and `FREEZER_ROLE` — any new minter is a potential unbacked-mint path and should page immediately.
   - Freeze events / `frozenUsers` additions and `freezeToRecipient` changes.
   - Mints not originating from the Vault, CCIP token pool, CCIPPeer, or Free Tunnel bridge.
4. **Bridge minters:**
   - CCIP token pool [`0x1689C22e…`](https://etherscan.io/address/0x1689C22eD5435e49071CFc208D1Ac6F2A2274490): rate-limit config changes, lane additions/removals, ownership transfer.
   - CCIPPeer [`0x55a67cf0…`](https://etherscan.io/address/0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc): implementation upgrades, peer/sender configuration changes.
   - Free Tunnel [`0x70aF4743…`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C): executor-set updates, admin transfer, abnormal mint volume.
5. **uniBTC ops Safe** [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3):
   - owner additions/removals and threshold changes.
6. **Liquidity / peg:**
   - uniBTC/WBTC ratio on Ethereum and major cross-chain venues.
   - DEX depth and 24h volume.
   - Redemption queue throughput versus the 2 WBTC/day Ethereum cap.
7. **M-BTC / Merlin dependency:**
   - Bedrock reserve address `0xF977...AB18` balance as a percentage of uniBTC reserves and total M-BTC supply.
   - M-BTC bridge mint/burn events, authorized `unlockTokenAdmin` changes, bridge upgrades, pauses, and Bitcoin redemption performance.

### Recommended Frequency

- PoR feed: every block or keeper-style monitoring.
- Vault pause/outOfService/upgrades: every block.
- Governance Safe activity: daily.
- Supply reconciliation: daily.
- TVL / market liquidity: daily.

## Appendix: Contract Architecture

```
Governance Layer
================
uniBTC Ops Safe 0xC9dA980f... (3/5)
  |-- owns ProxyAdmin 0x029e4fbd...
  |     |-- admin --> uniBTC token 0x004E9C...
  |     `-- admin --> uniBTC Vault 0x047D41...
  `-- DEFAULT_ADMIN_ROLE --> uniBTC Vault

Token / Vault Layer
===================
uniBTC token 0x004E9C...0568
  |-- MINTER_ROLE: uniBTC Vault 0x047D41...D6Da
  |     |-- accepts WBTC / FBTC / cbBTC / M-BTC
  |     |-- checks Chainlink PoR 0xc590D9fb...
  |     `-- checks global supply feeder 0xE542919E...
  |-- MINTER_ROLE: CCIP BurnMintTokenPool 0x1689C2... (owner: Bedrock admin Safe; 14 rate-limited lanes)
  |-- MINTER_ROLE: Bedrock CCIPPeer 0x55a67c... (proxy under ops-Safe ProxyAdmin)
  |-- MINTER_ROLE: Free Tunnel bridge 0x70aF47... (3/4 executors, EOA admin, undocumented)
  `-- FREEZER_ROLE + DEFAULT_ADMIN_ROLE: ops Safe 0xC9dA98... (freeze users; grant minters; no timelock)

Backing / External Layer
========================
Wrapped BTC issuers
Native BTC custody / restaking
Babylon and BTC restaking venues
M-BTC / Merlin bridge and custody stack
Chainlink PoR + CCIP

Critical Unknowns
=================
Named BTC custodian/signers
Mint/burn authority map for non-Ethereum deployments
Public restitution txs for Sept 2024 exploit
```

---

## Risk Summary

### Key Strengths

1. **Chainlink PoR is wired into the Vault mint path.** Minting is not purely admin-attested; the Vault checks public reserve data before issuing new uniBTC.
2. **Three uniBTC-specific audits** including two post-exploit re-audits.
3. **Verified source and multisig governance** (verified onchain August 10, 2026).
4. **Large ecosystem scale** with $294.4M DeFiLlama uniBTC TVL on August 10, 2026, and PoR reserves at ≈102% of reported global supply.
5. **CCIP mint path is rate-limited** on all 14 configured lanes, bounding the blast radius of a CCIP-lane compromise.
6. **Public team and known legal entity** via Bedrock/RockX leadership and Bedrock Terms of Use.

### Key Risks

1. **Prior exploit on the same vault proxy.** The Sept 2024 mint-validation exploit occurred on the uniBTC Vault still in use.
2. **Audit coverage is dated.** All published uniBTC audits were completed in 2024, two reactively after the exploit. They do not establish coverage of today's full dependency and operational trust boundary, and they predate current AI-assisted and automated exploit-validation capabilities; no current independent review or public bug bounty was found.
3. **Material M-BTC concentration.** About 21.3% of reported reserves are M-BTC, adding Merlin bridge/custody and chain-liveness risk beneath uniBTC.
4. **PoR is not a strict 1:1 mint gate.** `adequacyRatio = 900` permits minting while reserves are at least 90% of supply.
5. **No timelock.** The 3-of-5 Safe can upgrade token/vault implementations, grant `MINTER_ROLE`, or freeze user balances without onchain delay.
6. **Undocumented third-party bridge holds mint authority.** The Free Tunnel contract can mint uniBTC (3-of-4 executor signatures, EOA admin) and appears nowhere in Bedrock's uniBTC documentation; the Bedrock-custom CCIPPeer is a second non-pool mint path.
7. **Token-level freeze authority.** `FREEZER_ROLE` (held by the ops Safe) with `freezeToRecipient` set to a deployer EOA is a governance-controlled censorship/seizure path.
8. **Custody opacity.** Reserve addresses are visible, but Bedrock does not publicly name the BTC custodian/signers or prove unencumbered control and Babylon state.
9. **Secondary liquidity has effectively collapsed.** $7.2K daily volume and ≈32% slippage on a ~$1M exit leave the capped (2 WBTC/day), delayed redemption queue as the only real exit.
10. **No public bug bounty / no SEAL Safe Harbor registration found.**

### Critical Risks

- **No standalone Critical Risk Gate is triggered.** The prior exploit and instant-upgrade governance are material but do not by themselves constitute a current critical condition after the patched mint path and PoR integration. The strongest current concerns are High: dated audit coverage, M-BTC/Merlin concentration, custody opacity, and constrained exits.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **Unverified contract source** - PASS. uniBTC token, Vault proxies, and both implementations are source-verified on Etherscan.
- [ ] **No audit** - PASS. uniBTC has three public audits, including post-exploit audits.
- [ ] **Unverifiable reserves** - PASS, with caveats. Chainlink PoR is wired into the Vault, but it depends on a self-declared address set and allows 90% adequacy.
- [ ] **Total centralization** - PASS. Governance uses a 3-of-5 Safe, not a single EOA.

**No gate triggered.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**
- Three uniBTC-specific audits by BlockSec and PeckShield.
- Two post-exploit re-audits.
- All reviews are from 2024; no current review covering later production changes, live configuration, cross-chain/dependency evolution, or the combined Babylon and M-BTC trust boundary was found.
- The reports predate today's materially stronger AI-assisted review and executable exploit-validation capabilities. This is an assurance gap, not a claim that AI replaces expert human review.
- No top-tier audit and no public bug bounty.
- **Score: 3.5**

**Subcategory B: Historical Track Record**
- uniBTC has been live since 2024 and has sustained material TVL.
- September 2024 exploit on the same vault proxy is a major incident.
- No recurrence identified after the post-exploit implementation and PoR hardening.
- **Score: 3.25**

**Audits & Historical Score = (3.5 + 3.25) / 2 = 3.375**

**Score: 3.4/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**
- 3-of-5 Safe controls ProxyAdmin, Vault admin role, and token `DEFAULT_ADMIN_ROLE` / `FREEZER_ROLE` (can grant minters and freeze balances).
- No onchain timelock or Safe Delay module (verified August 10, 2026).
- **Score: 4.0**

**Subcategory B: Programmability**
- Minting is programmatic and PoR-gated.
- Upgradeability, pause/outflow controls, and adequacy-ratio governance remain material.
- **Score: 2.75**

**Subcategory C: External Dependencies**
- Chainlink PoR/CCIP, the undocumented Free Tunnel bridge minter, wrapped BTC issuers (including the M-BTC/Merlin stack), BTC custody/signers, Babylon/restaking venues.
- **Score: 4.0**

**Centralization Score = (4.0 + 2.75 + 4.0) / 3 = 3.58**

**Score: 3.6/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**
- PoR showed backing at ≈102.0% of reported global supply in the August 10, 2026 verification pass.
- Approximately 21.3% of the August 8 reserve snapshot was M-BTC, creating material Merlin bridge/custody concentration.
- Mixed collateral issuer quality and offchain/native BTC custody opacity.
- Explicit 90% adequacy threshold weakens the mint gate.
- **Score: 4.0**

**Subcategory B: Provability**
- Chainlink PoR is a real positive.
- Reserve addresses are inspectable, but ownership, liabilities, Babylon position state, M-BTC's underlying Bitcoin, custody/signing, and redemption capacity are not independently reconciled.
- Self-declared address set and the 90% threshold further limit confidence.
- **Score: 3.5**

**Funds Management Score = (4.0 + 3.5) / 2 = 3.75**

**Score: 3.75/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Redemption is delayed, fee-bearing, and capped at 2 WBTC/day on Ethereum.
- Secondary liquidity is effectively unusable: $7.2K daily volume, ≈32% slippage at ~$1M, ≈86% at ~$5M (CoW quotes, August 10, 2026).
- Between rubric rows 4 and 5: an exit mechanism exists, but it is capped, delayed, fee-bearing, and the market alternative is near-zero.
- **Score: 4.25**

**Score: 4.25/5**

#### Category 5: Operational Risk (Weight: 5%)

- Doxxed leadership and legal entity are positives.
- Prior incident response was credible.
- Custodian/signing disclosure and formal incident-response disclosure remain incomplete.
- **Score: 2.25**

**Score: 2.25/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.375 | 20% | 0.675 |
| Centralization & Control | 3.58 | 30% | 1.075 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 4.25 | 15% | 0.638 |
| Operational Risk | 2.25 | 5% | 0.113 |
| **Subtotal** | | | **3.626** |

**Modifiers:**
- **None.** The prior exploit is captured in Historical Track Record; M-BTC concentration and custody opacity are captured in Funds Management and External Dependencies. Applying an additional modifier would double count them.

**Final Score: ~3.6 / 5.0**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

uniBTC is stronger than a purely admin-attested wrapper on reserve provability because Chainlink PoR is wired into the mint path. It remains Elevated Risk because all audits are from 2024, approximately 21.3% of reported reserves are M-BTC, minting is allowed down to 90% reserve adequacy, governance has no onchain timelock and holds token-level mint-grant and freeze authority, an undocumented third-party bridge holds live mint rights, backing control and Babylon position state are incompletely disclosed, and large exits are constrained by both redemption caps and near-zero secondary liquidity.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months, or sooner on any event below.
- **TVL / supply-based:** Reassess if uniBTC TVL or supply changes by more than +/-40% from the August 10, 2026 baseline.
- **Incident-based:** Any exploit, depeg >2% sustained >1h, PoR reserve shortfall, redemption queue freeze, bridge failure, or governance compromise.
- **Specific triggers:**
  1. Chainlink uniBTC PoR feed reports backing below circulating supply.
  2. PoR feed stale beyond heartbeat.
  3. `adequacyRatio` is lowered or PoR feeder / supply feeder is changed.
  4. uniBTC token or Vault implementation upgrade.
  5. ProxyAdmin or Safe ownership transfer.
  6. Safe owner addition/removal or threshold change.
  7. Disclosure of BTC custodian/signers.
  8. Introduction of an onchain timelock / Safe Delay module.
  9. New top-tier audit or bug bounty publication.
  10. M-BTC exceeds 25% of uniBTC reserves, depegs, pauses redemption, changes bridge administrators, or changes its mint/burn implementation.
  11. Any `RoleGranted` for `MINTER_ROLE`, `DEFAULT_ADMIN_ROLE`, or `FREEZER_ROLE` on the uniBTC token, any freeze event, or any change to `freezeToRecipient`.
  12. Change of CCIP token pool, CCIPPeer upgrade, Free Tunnel executor/admin change, or a mint from an address outside the four known minters.

## Open TODOs (Items Not Verifiable This Session)

- **Custodian identity / signing setup** for BTC backing uniBTC.
- **Native-BTC/Babylon position reconciliation:** mapping each published reserve address to custodian ownership, Babylon staking transaction, finality provider, slashing status and unbonding state.
- **M-BTC bridge assurance:** independently verified Bitcoin backing, custody/MPC quorum, complete mint-relayer set, upgrade authority, and a documented unilateral or emergency exit path.
- **Mint/burn authority enumeration for non-Ethereum deployments** - Ethereum mint authority is fully enumerated in this report (four minters plus token admin/freezer); the 30+ non-Ethereum deployments each have their own minter/bridge configuration that has not been individually verified.
- **CCIPPeer message-authentication configuration and Free Tunnel per-lane limits** - both hold `MINTER_ROLE`; their complete sender/limit configuration was not fully traced.
- **September 2024 restitution transactions** - onchain Fuzzland-to-Bedrock reimbursement tx hashes are not published.

## Sources

- Bedrock docs: https://docs.bedrock.technology/
- Bedrock app: https://app.bedrock.technology/
- Bedrock statistics: https://app.bedrock.technology/statistics
- Bedrock audit reports: https://docs.bedrock.technology/security/audit-reports
- Bedrock GitHub org: https://github.com/Bedrock-Technology
- uniBTC GitHub: https://github.com/Bedrock-Technology/uniBTC
- DefiLlama Bedrock uniBTC: https://defillama.com/protocol/bedrock-unibtc
- DefiLlama Bedrock aggregate: https://defillama.com/protocol/bedrock
- Chainlink uniBTC PoR feed: https://data.chain.link/feeds/ethereum/mainnet/unibtc-por
- QuillAudits hack analysis: https://www.quillaudits.com/blog/hack-analysis/bedrock-2million-exploit
- BlockApex hack analysis: https://blockapex.medium.com/unibtc-hack-analysis-bffd6cebd4a8
- Babylon Labs: https://babylonlabs.io/
- Bedrock live reserve composition and linked addresses: https://app.bedrock.technology/statistics
- Merlin M-BTC model and contract: https://docs.merlinchain.io/merlin-docs/user-quick-start/how-to/m-token/what-is-m-token and https://docs.merlinchain.io/merlin-docs/user-quick-start/how-to/m-token/m-token-contract-address
- Merlin bridge security disclosures: https://docs.merlinchain.io/merlin-docs/user-quick-start/how-to/bridge/official-bridge
- Merlin data-availability status: https://docs.merlinchain.io/merlin-docs/about-merlin/key-modules/data-availability
- Merlin bridge source: https://github.com/MerlinLayer2/BTCLayer2BridgeContract
- M-BTC holder distribution: https://scan.merlinchain.io/token/0xB880fd278198bd590252621d4CD071b1842E9Bcd
- Independent Merlin trust-model analysis: https://www.spark.money/research/merlin-chain-bitcoin-l2-analysis
- EVMbench smart-contract security agent research (2026): https://openai.com/index/introducing-evmbench/
- Onchain verification on August 10, 2026: `totalSupply()`, EIP-1967 implementation/admin slots, `owner()` on ProxyAdmin, `getThreshold()` / `getOwners()` / `getModulesPaginated()` and guard storage on the Safe, `hasRole(bytes32,address)` on Vault/token (including `FREEZER_ROLE` and `freezeToRecipient()`), full `RoleGranted`/`RoleRevoked` event scan on the token, `chainlinkReserveFeeder()`, `uniBTCSupplyFeeder()` + supply feeder `totalSupply()`, `feederHeartbeat()`, `outOfService()`, `paused()`, `adequacyRatio()`, WBTC `balanceOf(address)` on Vault and Safe, Chainlink PoR `latestRoundData()`, CCIP `TokenAdminRegistry.getPool(uniBTC)` + pool `typeAndVersion()` / `owner()` / `getSupportedChains()` / per-lane rate-limiter states, and Free Tunnel `getAdmin()` / `getActiveExecutors()`.
- Market data on August 10, 2026: DeFiLlama protocol TVL and per-chain split; CoinGecko 24h volume; CoW Protocol swap quotes for ~$1M and ~$5M uniBTC → WBTC exits.
- Reserve/Merlin verification on August 8, 2026: Bedrock dashboard reserve composition and linked addresses; M-BTC `totalSupply()`, `bridgeAddress()`, Bedrock reserve balance and holder rank; main bridge `version()`, admin and mint-relayer reads; EIP-1967 implementation slots; and bytecode-presence checks via Merlin RPC.
