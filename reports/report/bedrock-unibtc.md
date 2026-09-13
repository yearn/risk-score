# Protocol Risk Assessment: Bedrock uniBTC

- **Assessment Date:** August 10, 2026 (Updated: September 13, 2026)
- **Token:** uniBTC
- **Chain:** Ethereum
- **Token Address:** [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568)
- **Final Score: 3.8/5.0**
- **Snapshot:** Ethereum block [25,970,228](https://etherscan.io/block/25970228), hash `0xd28de57e194e0ab8774a712caeec3975fe0cd265c661f8efb403759512b2066f`, September 13, 2026 18:11:59 UTC. Contract reads are pinned to this block. Bedrock reserve API: 18:10:07 UTC; CoinGecko: 18:10:40 UTC; CoW quotes: approximately 18:16 UTC; DeFiLlama: September 13 API snapshot. These independently timed sources are not a single reconciled ledger. [Cached observations and role evidence](../data/bedrock-unibtc-2026-09-13.json).

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
| uniBTC supply feeder | [`0xE542919E4b281f10b437F947c8Ba224DdfaBc716`](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716) | Admin-reported `totalTokenSupply()` used by the Vault; differs from dashboard supply |

### Redemption and Supply Reporting

| Contract | Address | Role |
|----------|---------|------|
| Ethereum DelayRedeemRouter | [`0xAA732c9c110A84d090a72da230eAe1E779f89246`](https://etherscan.io/address/0xAA732c9c110A84d090a72da230eAe1E779f89246) | Live app withdrawal router; implementation [`0x720081e3ee2b1542e341afc793de20b08beb859d`](https://etherscan.io/address/0x720081e3ee2b1542e341afc793de20b08beb859d), under the uniBTC ProxyAdmin |
| Supply feeder implementation | [`0xf50dbaf3d057164fc79c1aa435ffa011c6bcdae9`](https://etherscan.io/address/0xf50dbaf3d057164fc79c1aa435ffa011c6bcdae9#code) | `uniBTCRate`: operators write supply and reserve values; no supply-update timestamp checked by the Vault |
| Vault asset supply feeder | [`0x94C7F81E3B0458daa721Ca5E29F6cEd05CCCE2B3`](https://etherscan.io/address/0x94C7F81E3B0458daa721Ca5E29F6cEd05CCCE2B3) | Per-token `totalSupply(address)` input to deposit-cap checks |

### Governance Layer

| Safe | Address | Threshold | Controls |
|------|---------|-----------|----------|
| uniBTC ops Safe | [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) | 3/5 | Owns uniBTC ProxyAdmin; holds `DEFAULT_ADMIN_ROLE` on uniBTC Vault |

Onchain verification on September 13, 2026 read Safe thresholds/owners via `getThreshold()` / `getOwners()`, ProxyAdmin ownership via `owner()`, Vault/token roles via `hasRole(bytes32,address)`, and EIP-1967 implementation/admin slots. Both the ops and admin Safes remain 3-of-5 with no modules or guard configured (`getModulesPaginated` empty, guard storage slot zero). Complete `AddedOwner`, `RemovedOwner`, and `ChangedThreshold` scans show no owner-set or threshold changes since August 10, 2026. Thresholds alone would not establish this continuity.

**Signer overlap:** signer [`0x09610d4239c8f3413509202DCcC7e27C6B0a47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3) appears in multiple Bedrock governance Safes, and signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32) appears in both the uniBTC and brBTC Safe set. This reduces effective independence across Bedrock product lines.

## How uniBTC Works

- **Deposit assets:** the Ethereum Vault allowlist contains WBTC, FBTC, cbBTC, and Bedrock directBTC; directBTC has no remaining mint headroom. M-BTC is a reserve/input dependency on Merlin, not an Ethereum Vault deposit asset. uniBTC is routed separately by the bridge contracts.
- **Mint flow:** User deposits a permitted wrapped BTC asset into the Vault `mint` function and atomically receives uniBTC 1:1 in 8-decimal BTC units.
- **PoR gate:** Minting checks Chainlink PoR reserves against circulating supply reported by the uniBTC supply feeder. Onchain verification on September 13, 2026 read the [Chainlink reserve feed](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) and [uniBTC supply feeder](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716), `feederHeartbeat = 86,400s`, `outOfService = false`, and `paused = false`.
- **Adequacy ratio:** The Vault explicitly permits minting while PoR-reported reserves are at least 90% of supply. Onchain verification read `adequacyRatio = 900`, and source review found `checkReserve` requiring `supply * adequacyRatio / 1000 <= reserves`. This is not a strict 1:1 mint gate. The gate uses manually reported supply that is 701.74089895 uniBTC below the contemporaneous dashboard total; see Provability.
- **Redeem flow:** the [live Ethereum router](https://etherscan.io/address/0xAA732c9c110A84d090a72da230eAe1E779f89246#readProxyContract) enforces **8 days + 1 second**, a **0.5% fee**, and a quota refilling at **2.00016 WBTC/day**, with a **0.5 WBTC maximum available bucket**. It is unpaused and its whitelist is disabled. After 30 days, `claimPrincipals` returns queued uniBTC, not BTC backing.
- **Custody:** TODO - Bedrock docs do not name the BTC custodian(s), signers, or full address-control model for the backing wallets monitored by Chainlink PoR.
- **Cross-chain:** Chainlink CCIP is the documented canonical bridge path (BurnMintTokenPool with 14 configured lanes). Onchain enumeration also found two additional live Ethereum mint paths: a Bedrock-custom `CCIPPeer` contract and a third-party **Free Tunnel** bridge that Bedrock's uniBTC bridge documentation does not mention. uniBTC is deployed across many chains; Ethereum is one slice of total supply.
- **Freeze authority:** The uniBTC token implements `FREEZER_ROLE` with a `frozenUsers` mapping and a `freezeToRecipient` address. The ops Safe holds `FREEZER_ROLE`, and `freezeToRecipient` is currently the deployer EOA [`0x899c284A…`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f) (verified September 13, 2026). Token-level freezing of user balances is a governance-controlled loss/censorship path.

## Token Mint Authority

**Mint mechanism:** Role-gated AccessControl. `mint(address,uint256)` on the uniBTC token is `onlyRole(MINTER_ROLE)`; `burn`/`burnFrom` are standard permissionless holder burns. The role is not enumerable onchain, so holders were reconstructed from a full `RoleGranted`/`RoleRevoked` event scan on the token (from deployment block 19,645,731 through block 25,970,228) and each current holder confirmed via `hasRole`.

**Mint requires backing:** No — at the token level any `MINTER_ROLE` holder can issue unbacked uniBTC. Backing checks live in the callers: the Vault path is PoR-gated (to 90% adequacy); the bridge paths rely on burn/lock on the source chain.

**Current Ethereum `MINTER_ROLE` holders (verified September 13, 2026):**

| Minter / Role Holder | Address | Notes |
|----------------------|---------|-------|
| uniBTC Vault | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | Collateralized mint path for supported wrapped BTC deposits. Mint is PoR-gated but allows a 10% reserve shortfall via `adequacyRatio = 900`. |
| Chainlink CCIP BurnMintTokenPool 1.5.1 | [`0x1689C22eD5435e49071CFc208D1Ac6F2A2274490`](https://etherscan.io/address/0x1689C22eD5435e49071CFc208D1Ac6F2A2274490) | Registered in the CCIP `TokenAdminRegistry` (`getPool(uniBTC)` verified). Burn/mint model — the CCIP message path can mint native uniBTC supply. `owner()` = Bedrock admin Safe (3/5). Inbound and outbound rate limits are enabled on all 14 configured lanes; sizes differ by lane. |
| Bedrock CCIPPeer | [`0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc`](https://etherscan.io/address/0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc) | Bedrock-custom CCIP messaging contract predating the token pool. Upgradeable `TransparentUpgradeableProxy` administered by the uniBTC ProxyAdmin (i.e. the 3/5 ops Safe). Its message-authentication configuration is a distinct mint trust path. |
| Free Tunnel bridge | [`0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | Third-party Free Protocol bridge (`TunnelContract` behind `DelayedERC1967Proxy`). Mints require 3-of-4 executor signatures; admin is EOA [`0x0014Eb4A…`](https://etherscan.io/address/0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C); executor rotation has a built-in 36h–5d delay. **Not mentioned in Bedrock's uniBTC bridge docs.** The same contract also holds `MINTER_ROLE` on Bedrock's brBTC. |

**Token admin / freeze authority:** the ops Safe [`0xC9dA980f…`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) (3/5) holds `DEFAULT_ADMIN_ROLE` (can grant `MINTER_ROLE` to any address with no timelock — an unbacked-mint escalation path) and `FREEZER_ROLE` (token-level user freezing; `freezeToRecipient` is the [deployer EOA](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f)).

**Historical grants (from the event scan):** several temporary `MINTER_ROLE` grants have been made and revoked over the token's life, including grant-mint-revoke same-block patterns by the ops Safe and two temporary grants to the operational EOA [`0x9251Fd3D…`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) (revoked). This is evidence of manual, admin-driven supply operations outside the vault path.

**Rate limits / supply caps:** none at the token level. Both CCIP directions have eight lanes with 2-uniBTC buckets, one with a 0.5-uniBTC bucket, and five with only 2 satoshis of capacity. Refills range from 1 satoshi/second to 231,428 satoshis/second (199.953792 uniBTC/day). These are lane-specific throttles, not an aggregate supply bound. Pool `getRateLimitAdmin()` is the [operational EOA](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab), which can reconfigure them. Free Tunnel and complete CCIPPeer lane limits remain TODO.

**Non-Ethereum deployments:** complete mint/burn authority enumeration for every non-Ethereum uniBTC deployment (30+ chains) remains TODO.

## Audits and Due Diligence Disclosures

| Scope | Firm | Date | Link |
|-------|------|------|------|
| uniBTC | BlockSec | Jun 12, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/code%20audit%20blocksec.pdf) |
| uniBTC | PeckShield | Oct 1, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/PeckShield-Audit-Report-uniBTC-v1.0.pdf) |
| uniBTC | BlockSec | Oct 30, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/blocksec_bedrock_unibtc_v1.0-signed.pdf) |

The October 2024 audits are post-exploit re-engagements covering the patched uniBTC vault. BlockSec also published a [November 15, 2024 v1.1 revision](https://github.com/Bedrock-Technology/uniBTC/blob/main/blocksec_bedrock_unibtc_v1.1-signed.pdf), reviewing a redeem-logic update and the `contracts/contracts/` and `ccip/` scope. This is a revision of the October engagement, not a fourth independent audit. The [current audit index](https://docs.bedrock.technology/security/audit-reports) additionally lists May 6 and June 18, 2026 PeckShield reports for **cuniBTC** and **cuniBTC-SymbioticProxy**; those scopes do not establish a re-audit of the live uniBTC Vault, reporting inputs, or reserve custody. The three core uniBTC engagements and the v1.1 revision are from 2024; no later review establishing coverage of the complete live uniBTC trust boundary was found. No top-tier audit engagement (Trail of Bits, OpenZeppelin, ChainSecurity, Spearbit, Cantina) was found for uniBTC.

The age of the reviews matters for two reasons. First, an audit is point-in-time evidence: it only supports the code, configuration, assumptions, and dependencies that were in scope when the work was performed. Even if the core vault bytecode remains unchanged, uniBTC's current security depends on live governance configuration, PoR inputs, cross-chain deployments, custody and Babylon operations, and the material M-BTC/Merlin exposure described below. The 2024 reports do not establish that this present system has been reviewed as one end-to-end trust boundary.

Second, the security-review capability available in 2026 is materially different. Modern engagements can supplement expert manual review with repository-wide AI agents, automated exploit construction, invariant testing, and repeated independent passes. The 2026 EVMbench research demonstrates that frontier agents can detect, patch, and execute high-severity smart-contract exploits end to end, while also showing that detection remains incomplete. This does not make the 2024 audits invalid or make AI a substitute for experienced human auditors; it means those reports did not benefit from today's additional review and adversarial-testing capabilities. A current re-audit should therefore be treated as materially stronger assurance than relying solely on the 2024 reports.

### Bug Bounty

- **No public Immunefi / Cantina / Sherlock / Code4rena bug bounty program found.**
- **SEAL Safe Harbor:** the August 10, 2026 check of the onchain SafeHarborRegistry [`0x8f72fcf695523A6FC7DD97EafDd7A083c386b7b6`](https://etherscan.io/address/0x8f72fcf695523A6FC7DD97EafDd7A083c386b7b6) adoption logs found no Bedrock-related entries. TODO: refresh adoption-log coverage; the September reassessment does not establish current registration status.

## Historical Track Record

- **Time in production:** uniBTC launched in 2024; DeFiLlama first records Bedrock uniBTC on Oct 29, 2024.
- **TVL (DeFiLlama, September 13, 2026):** [Bedrock uniBTC](https://defillama.com/protocol/bedrock-unibtc) reported **$349.51M**. Major slices: Bitcoin $132.43M, Ethereum $99.19M, Merlin $67.05M, BOB $30.90M, BNB Chain $19.08M. The nearest daily observation 30 days earlier was $283.37M (August 15): **+23.34%**, with a $230.09M–$385.90M range over the window. TVL is USD-valued collateral, not token supply.
- **Peak TVL:** Bedrock uniBTC peaked at **$638.3M** on July 15, 2025.
- **Minimum after launch:** $109.4M on Nov 2, 2024, shortly after the Sept 2024 exploit.
- **Ethereum total supply:** Onchain verification on September 13, 2026 read **2,981.22322616 uniBTC** (`298,122,322,616` sats).
- **Supply and reserves:** the [Vault supply feeder](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716#readProxyContract) reports **3,845.74449305 uniBTC** through `totalTokenSupply()`. [Chainlink PoR](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2#readContract) reports **4,640.481242116713140279 BTC**, updated September 12 at 19:57:47 UTC, 80,052 seconds before the block (within the 86,400-second heartbeat). The resulting **120.67%** ratio is relative to that feeder value only. The [Bedrock reserve API](https://affiliate-api-eosin.vercel.app/api/v1/third/stats/unibtc) reports **4,547.485392 uniBTC** and **4,640.449475 BTC**, or **102.04%** coverage. The supply discrepancy is unresolved; neither ratio proves complete liabilities.

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
| uniBTC | Atomic, subject to PoR and per-asset headroom | 8 days + 1 second | 0.5% fee; ~2 WBTC/day refill; 0.5 WBTC quota bucket | Whitelist disabled; blacklist and pause controls remain |

### Collateralization

- uniBTC is intended to be backed 1:1 by wrapped BTC assets and native/restaked BTC positions.
- The cross-chain product accepts wrapped BTC inputs; the Ethereum allowlist is WBTC, FBTC, cbBTC and directBTC, while M-BTC is a Merlin dependency. Counterparty quality is mixed: WBTC and cbBTC are more established; FBTC and M-BTC are newer issuer/custody dependencies.
- Dashboard reserves equal ≈102.04% of dashboard supply; the Vault instead compares Chainlink reserves to a lower, manually reported supply value. Its nominal 90% requirement therefore does not establish 90% coverage of complete global liabilities.
- Only a small amount of WBTC is held directly in the Ethereum Vault (0.46121325 WBTC at the snapshot, plus 0.01 WBTC in the ops Safe). The majority of backing sits outside the Ethereum vault contract, including native BTC/restaking/custody arrangements monitored through PoR.

#### Ethereum deposit limits and redemption liquidity

[Vault allowlist events and getters](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da#readProxyContract) give the following 8-decimal BTC-unit values. Headroom is cap minus `supplyFeeder.totalSupply(token)`, not a measure of independently available backing.

| Asset | Cap (BTC units) | Feeder usage | Remaining headroom |
|-------|-----------------|--------------|--------------------|
| [WBTC](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | 50 | 0.46121325 | 49.53878675 |
| [cbBTC](https://etherscan.io/address/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf) | 50 | 0.00315141 | 49.99684859 |
| [FBTC](https://etherscan.io/address/0xC96dE26018A54D51c097160568752c4E3BD6C364) | 1,300 | 1,283.74292562 | 16.25707438 |
| [Bedrock directBTC](https://etherscan.io/address/0xA700992A9815d3bfECEDfE51B030fD294Bc0b090) | 1,458.9998 | 1,458.9998 | 0; mint capacity exhausted |

All four are allowlisted and individually unpaused. directBTC is an internal accounting token; it must not be counted as additional independent Bitcoin backing.

The [withdrawal router](https://etherscan.io/address/0xAA732c9c110A84d090a72da230eAe1E779f89246#readProxyContract) reports WBTC `tokenDebts = (545.56200586, 545.03978836)` BTC units, leaving **0.52221750** uncleared. The Vault holds **0.46121325 WBTC**, so it cannot fund all uncleared requests simultaneously without replenishment. Uncleared debt includes immature requests and uniBTC-return eligibility; it does not by itself prove an overdue queue or a freeze. The 30-day `claimPrincipals` path returns uniBTC and does not satisfy an exit into BTC. TODO: reconcile request maturity, actual recent completion throughput, and replenishment commitments.

#### M-BTC / Merlin concentration

The [Bedrock reserve API](https://affiliate-api-eosin.vercel.app/api/v1/third/stats/unibtc) reports **990.87383330 M-BTC**, or **21.35%** of **4,640.449475 BTC** in total reserves. Native BTC represents **3,648.635637 BTC (78.63%)**; all other wrapped/L2 BTC balances together are about **0.94 BTC (0.02%)**. These are dashboard classifications, not an independent reconciliation of Babylon positions or encumbrances. The published Merlin reserve address is [`0xF977…AB18`](https://scan.merlinchain.io/address/0xF9775085d726E782E83585033B58606f7731AB18). Its second-largest-holder rank and 17.38% share of M-BTC supply were observed on August 8, 2026; current rank, token supply, and Merlin bridge controls were not reverified in this Ethereum snapshot.

M-BTC is not native BTC; Merlin documents it as a receipt minted against Bitcoin Layer 1 assets deposited through Merlin's bridge. This adds Merlin bridge custody, relayer, chain-liveness, and redemption risk beneath uniBTC. Merlin launched mainnet in February 2024 and M-BTC claims opened in March 2024, so the product is no longer brand new but remains materially younger and less trust-minimized than established wrapped-BTC rails. Merlin's official bridge documentation states that the bridge is upgradeable, multisig-managed, and has **no timelock**. Merlin's data-availability documentation also describes public DA as a "coming" solution, while the current design relies on its oracle/DAC layer and offchain proof-verification machinery rather than Bitcoin enforcing the full L2 state transition.

The August 8, 2026 M-BTC source/onchain review found mint and burn restricted to the configured bridge and multiple authorized `unlockTokenAdmin` relayers on the main bridge. Current Merlin implementation and administrator continuity remain TODO. That is better than an unrestricted public mint, but correctness still depends on offchain Bitcoin-deposit observation, bridge administration, and custody/signing. No public user-controlled unilateral Bitcoin exit path was identified.

### Provability

uniBTC has materially better reserve provability than brBTC because a Chainlink PoR feed is wired directly into the uniBTC Vault mint path. The Bedrock dashboard also exposes the constituent native-BTC addresses and wrapped-token reserve addresses; it is more than an unlinked aggregate chart. However, the supply denominator is an independent privileged input. [Verified `uniBTCRate` source](https://etherscan.io/address/0xf50dbaf3d057164fc79c1aa435ffa011c6bcdae9#code) allows its operators to write `totalTokenSupply` and `totalReserve` directly; it does not aggregate chains onchain. Its latest [update transaction](https://etherscan.io/tx/0xb8863ddf91d75d7be2feaf66f69a2e91ca531189768b5cef449803097ff8c1a5) was September 13, 2026 at 07:50:11 UTC. The Vault checks the Chainlink reserve timestamp, but has no freshness or completeness check for this supply input. The **701.74089895 uniBTC** discrepancy versus the dashboard is therefore a material unresolved discrepancy, even though both published ratios exceed 100%. TODO: obtain the reporting methodology and reconcile every included/excluded chain and liability; do not treat 120.67% as established global overcollateralization.

Address visibility also does not prove the full operational state:

- The feed depends on a Bedrock-supplied address set.
- PoR validates balances, not legal ownership, private-key control, liabilities, encumbrances, or the ability to redeem those assets promptly.
- The Vault requires 90% of its manually reported supply input; completeness of that denominator is unresolved.
- The named custodian/signing setup remains undisclosed, and the dashboard does not map native-BTC UTXOs to Babylon staking state, finality providers, slashing exposure, or unbonding status.
- Approximately 21.35% of dashboard reserves are M-BTC, so proving that Bedrock holds the token does not independently prove the corresponding Bitcoin remains available behind Merlin's bridge.

## Liquidity Risk

- **Primary exit:** the [Ethereum router](https://etherscan.io/address/0xAA732c9c110A84d090a72da230eAe1E779f89246#readProxyContract) has an 8-day-plus-1-second delay, 0.5% fee, ~2 WBTC/day quota refill, and 0.5 WBTC maximum available quota. BTC settlement depends on Vault replenishment.
- **Secondary exit:** [CoinGecko](https://www.coingecko.com/en/coins/universal-btc) reports only **$904.34** in 24h volume and a **0.995721 BTC** indicative price. Thin trading makes the displayed near-par price weak evidence of executable depth.
- **Indicative exits:** [CoW Protocol quote API](https://api.cow.fi/mainnet/api/v1/quote) responses for **13 uniBTC (~$1M)** and **65 uniBTC (~$5M)** into WBTC returned **10.89885210** and **10.89886574 WBTC**, respectively: **16.16%** and **83.23%** below 1:1 BTC parity before any additional settlement charge. Quote IDs and raw responses are in the snapshot evidence. These were unsigned, expiring indications, not executed swaps or guaranteed future fills. Large exits remain severely constrained.
- **Downstream integration:** brBTC accepts uniBTC as an input asset. Stress in brBTC may create uniBTC flow pressure, and stress in uniBTC directly affects brBTC when uniBTC is used as backing.

## Centralization & Control Risks

### Governance

- uniBTC token and uniBTC Vault are upgradeable transparent proxies.
- The uniBTC ops Safe is 3-of-5 and owns the ProxyAdmin.
- The same Safe holds `DEFAULT_ADMIN_ROLE` on the uniBTC Vault.
- No Safe Guard or Delay module is configured on the uniBTC ops Safe (verified September 13, 2026). A 3-of-5 signature can therefore upgrade implementations, grant `MINTER_ROLE`, or freeze user balances without an onchain delay.
- The ops Safe additionally holds `DEFAULT_ADMIN_ROLE` and `FREEZER_ROLE` on the uniBTC token itself: it can grant mint authority to any address and freeze arbitrary user balances, with `freezeToRecipient` currently set to a deployer EOA.
- Two bridge contracts and one Bedrock messaging contract hold live `MINTER_ROLE` (CCIP token pool, CCIPPeer, Free Tunnel); the Free Tunnel path is absent from Bedrock's public documentation.
- Signer overlap across Bedrock Safes weakens practical separation between product lines.

### Delegated control paths

Full role-event reconstruction and `hasRole` confirmation establish the following additional authorities. [Snapshot evidence](../data/bedrock-unibtc-2026-09-13.json) records every holder and role-admin getter; all listed AccessControl roles are governed by their contract's `DEFAULT_ADMIN_ROLE`.

| Contract / role | Holders | Effective control |
|-----------------|---------|-------------------|
| Vault `DEFAULT_ADMIN_ROLE` | Ops Safe (1) | Token/target allowlists, caps, asset feeder, and operational role grants |
| Vault `MANAGER_ROLE` | [Operational EOA](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) (1) | Changes reserve/supply feeder addresses, heartbeat and adequacy ratio without a Safe transaction; ratio may be set anywhere above zero through 1000 |
| Vault `PAUSER_ROLE` | Six EOAs | Stops service or pauses individual assets; includes the operational EOA and an ops Safe signer |
| Vault `OPERATOR_ROLE` | Five contracts | [BurnProxy](https://etherscan.io/address/0x4519c8e32b080a778f2ae188d5fdcd98175f0caf), [FBTCProxy](https://etherscan.io/address/0xa3a30f627dbc02aff3c0a736a065443a0e85b1ae), [live withdrawal router](https://etherscan.io/address/0xaa732c9c110a84d090a72da230eae1e779f89246), [legacy withdrawal router](https://etherscan.io/address/0xbb45b3a09bffc15747d1a331775fa408e587f38d), and [TransferProxy](https://etherscan.io/address/0xf0ab759d3a1a4956e8c3c52c71ccb50f20bc342b) call `execute` on permitted targets |
| Supply feeder admin / operators | Operational EOA administers; it and [second updater](https://etherscan.io/address/0x2c62803181243fa99c659de0d2a0530879a79911) hold `OPERATOR_ROLE` | Directly writes the PoR comparison's supply denominator; proxy admin slot is the [deployer address](https://etherscan.io/address/0x899c284a89e113056a72dc9ade5b60e80dd3c94f), outside the ops Safe ProxyAdmin |
| CCIP pool rate-limit admin | Operational EOA (1) | Reconfigures per-lane throttles |
| CCIPPeer admin / pauser | Admin Safe / operational EOA | Configures accepted source peers / pauses messages; proxy upgrades remain with ops Safe |
| Live withdrawal router admin / pauser | Ops Safe / operational EOA | Changes fees, delays, quotas and permission lists / pauses redemptions |

The admin Safe owns both BurnProxy and TransferProxy. TransferProxy can move allowlisted Vault assets to its immutable recipient, the ops Safe; it is not a user redemption queue. `execute` itself has no PoR modifier and allows arbitrary calldata to allowed targets, including uniBTC. Existing operator contract entrypoints constrain their calls; an admin-granted unrestricted operator could invoke uniBTC minting through the Vault without the deposit-path PoR/cap checks. This is an additional role-escalation path, not evidence of an observed exploit. Complete downstream permissions of the legacy router and FBTCProxy remain TODO.

### Programmability

Minting is programmatic and PoR-gated, which is a major strength relative to opaque custody wrappers. The mint gate combines Chainlink reserves with a manually updated supply denominator that does not reconcile to the dashboard. Upgradeability, delegated EOA control over reporting and adequacy parameters, role-controlled outflows, and the explicit 90% threshold materially limit this assurance.

### External Dependencies

| Dependency | Used by uniBTC | Criticality |
|-----------|----------------|-------------|
| Chainlink PoR feed | Mint reserve gate | High - stale/wrong data can halt or weaken mint safety |
| Chainlink CCIP | Cross-chain routing - BurnMintTokenPool + CCIPPeer both hold `MINTER_ROLE`; 14 lanes, per-lane rate limits enabled | High - bridge security affects multi-chain supply/peg, partially mitigated by rate limits |
| Free Tunnel (Free Protocol) | Cross-chain routing - bridge contract holds `MINTER_ROLE`, undocumented in Bedrock docs | High - third-party bridge with mint rights; 3-of-4 executor signatures, EOA admin |
| WBTC / FBTC / cbBTC | Accepted deposit assets | High - issuer/custody risk |
| M-BTC / Merlin bridge | ~21.35% of dashboard reserves on September 13, 2026 | High - bridge custody, relayer, upgrade, no-timelock, chain-liveness and redemption risk |
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
   - `latestRoundData()` reserves vs both `totalTokenSupply()` and independently reconciled global supply; page on the current denominator discrepancy.
   - Supply feeder `Updated` events, updater/admin role changes, and proxy upgrades; reserve heartbeat does not establish supply freshness.
   - Feed staleness relative to the 24h heartbeat.
2. **uniBTC Vault** [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da):
   - `outOfService()`.
   - `paused()`.
   - `Upgraded` events.
   - Role grants/revocations, `execute()` target list changes, `MANAGER_ROLE` activity, asset caps and feeder headroom.
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
   - Redemption queue maturity/throughput, `tokenDebts`, Vault WBTC liquidity, `maxQuotas` (0.5 WBTC) and `quotaRates` (~2 WBTC/day).
7. **M-BTC / Merlin dependency:**
   - [Bedrock reserve address](https://scan.merlinchain.io/address/0xF9775085d726E782E83585033B58606f7731AB18) balance as a percentage of uniBTC reserves and total M-BTC supply.
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
  |     |-- Ethereum allowlist: WBTC / FBTC / cbBTC / directBTC (cap exhausted)
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
3. **Verified source and multisig governance** (verified onchain September 13, 2026).
4. **Large ecosystem scale** with $349.51M DeFiLlama uniBTC TVL; the dashboard reports ≈102.04% reserve coverage, subject to unresolved supply reconciliation.
5. **CCIP mint path has inbound and outbound throttles** on all 14 lanes, with lane-specific capacities; the rate-limit admin can reconfigure them.
6. **Public team and known legal entity** via Bedrock/RockX leadership and Bedrock Terms of Use.

### Key Risks

1. **Prior exploit on the same vault proxy.** The Sept 2024 mint-validation exploit occurred on the uniBTC Vault still in use.
2. **Audit coverage is dated.** All published uniBTC audits were completed in 2024, two reactively after the exploit. They do not establish coverage of today's full dependency and operational trust boundary, and they predate current AI-assisted and automated exploit-validation capabilities; no current independent review or public bug bounty was found.
3. **Material M-BTC concentration.** About 21.35% of reported reserves are M-BTC, adding Merlin bridge/custody and chain-liveness risk beneath uniBTC.
4. **PoR is not a strict 1:1 mint gate.** `adequacyRatio = 900` permits minting while reserves are at least 90% of supply.
5. **No timelock.** The 3-of-5 Safe can upgrade token/vault implementations, grant `MINTER_ROLE`, or freeze user balances without onchain delay.
6. **Undocumented third-party bridge holds mint authority.** The Free Tunnel contract can mint uniBTC (3-of-4 executor signatures, EOA admin) and appears nowhere in Bedrock's uniBTC documentation; the Bedrock-custom CCIPPeer is a second non-pool mint path.
7. **Token-level freeze authority.** `FREEZER_ROLE` (held by the ops Safe) with `freezeToRecipient` set to a deployer EOA is a governance-controlled censorship/seizure path.
8. **Custody opacity.** Reserve addresses are visible, but Bedrock does not publicly name the BTC custodian/signers or prove unencumbered control and Babylon state.
9. **Secondary liquidity is extremely thin.** $904 daily volume, ≈16% loss versus parity on a ~$1M indicative exit, and ≈83% at ~$5M leave large holders dependent on the delayed queue and backing replenishment.
10. **Manual supply reporting does not reconcile.** The Vault denominator is 701.74 uniBTC below dashboard supply; privileged operators set it, with no freshness check in the mint gate.
11. **No public bug bounty found.** Current SEAL Safe Harbor status remains unverified.

### Critical Risks

- **No standalone Critical Risk Gate is triggered.** The prior exploit and instant-upgrade governance are material but do not by themselves constitute a current critical condition after the patched mint path and PoR integration. The strongest current concerns are High: inconsistent supply reporting, delegated reporting control, dated audit coverage, M-BTC/Merlin concentration, custody opacity, and constrained exits. The observed discrepancy is not proof of missing reserves or an exploit.

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
- No onchain timelock or Safe Delay module (verified September 13, 2026).
- **Score: 4.0**

**Subcategory B: Programmability**
- Mint execution is programmatic, but its supply denominator is manually reported and differs materially from the dashboard.
- A delegated EOA can change feeders and adequacy settings; supply freshness/completeness is not enforced. This falls between hybrid admin-updated operation (3) and offchain accounting with periodic reporting (4).
- **Score: 3.5**

**Subcategory C: External Dependencies**
- Chainlink PoR/CCIP, the undocumented Free Tunnel bridge minter, wrapped BTC issuers (including the M-BTC/Merlin stack), BTC custody/signers, Babylon/restaking venues.
- **Score: 4.0**

**Centralization Score = (4.0 + 3.5 + 4.0) / 3 = 3.8333…**

**Score: 3.83/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**
- Dashboard coverage is ≈102.04%; the Vault feeder produces 120.67% against a lower supply denominator, not independently reconciled global liabilities.
- M-BTC is 21.35% of dashboard reserves, creating material Merlin bridge/custody concentration.
- Mixed collateral issuer quality and offchain/native BTC custody opacity.
- Explicit 90% adequacy threshold weakens the mint gate.
- **Score: 4.0**

**Subcategory B: Provability**
- Chainlink PoR is a real positive.
- Reserve addresses are inspectable, but ownership, liabilities, Babylon position state, M-BTC's underlying Bitcoin, custody/signing, and redemption capacity are not independently reconciled.
- The 701.74 uniBTC reporting discrepancy, manually controlled supply input, and missing supply-freshness check prevent reliable liability reconciliation despite inspectable reserve balances.
- **Score: 4.0**

**Funds Management Score = (4.0 + 4.0) / 2 = 4.0**

**Score: 4.0/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Redemption is delayed, fee-bearing, and capped at 2 WBTC/day on Ethereum.
- Only $904 daily volume; indicative CoW exits lose ≈16.16% at ~$1M and ≈83.23% at ~$5M against BTC parity. The queue has a 0.5 WBTC quota bucket and depends on replenishment.
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

Weights use unrounded category means.

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.375 | 20% | 0.675 |
| Centralization & Control | 3.8333 | 30% | 1.1500 |
| Funds Management | 4.0 | 30% | 1.2000 |
| Liquidity Risk | 4.25 | 15% | 0.6375 |
| Operational Risk | 2.25 | 5% | 0.1125 |
| **Subtotal** | | | **3.775** |

**Modifiers:**
- **None.** The prior exploit is captured in Historical Track Record; M-BTC concentration and custody opacity are captured in Funds Management and External Dependencies. Applying an additional modifier would double count them.

**Final Score: ~3.8 / 5.0**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

uniBTC is stronger than a purely admin-attested wrapper on reserve provability because Chainlink PoR is wired into the mint path. It remains Elevated Risk because approximately 21.35% of reported reserves are M-BTC, minting uses an unreconciled manually reported supply denominator and is allowed down to 90% nominal reserve adequacy, governance has no onchain timelock and holds token-level mint-grant and freeze authority, an undocumented third-party bridge holds live mint rights, backing control and Babylon position state are incompletely disclosed, and large exits are constrained by both redemption caps and near-zero secondary liquidity.

---

## Reassessment Triggers

- **Time-based:** Reassess by December 13, 2026; resolve the supply reconciliation discrepancy promptly and refresh immediately if it worsens.
- **TVL / supply-based:** Reassess if uniBTC TVL or supply changes by more than +/-40% from the September 13, 2026 baseline: $349.51M TVL, 2,981.22322616 Ethereum uniBTC, and 4,547.485392 dashboard global uniBTC (dashboard supply remains unreconciled).
- **Incident-based:** Any exploit, depeg >2% sustained >1h, PoR reserve shortfall, redemption queue freeze, bridge failure, or governance compromise.
- **Specific triggers:**
  1. Chainlink uniBTC PoR feed reports backing below independently reconciled supply; any discrepancy between dashboard supply and `totalTokenSupply()` requires investigation (currently unresolved).
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
  13. Supply feeder updater/admin change or proxy upgrade; withdrawal router upgrade, blacklist/whitelist change, quota reduction, or matured debt exceeding available WBTC without replenishment.

The current M-BTC allocation (21.35%) is below the 25% trigger; Chainlink reserves are within the configured heartbeat and exceed both reported supply figures. No token/Vault role grants or revocations, or governance Safe owner/threshold changes, were found since August 10. Supply reconciliation remains an active monitoring issue; point-in-time prices do not establish whether a sustained depeg occurred between observations.

## Open TODOs (Items Not Verifiable This Session)

- **Supply reconciliation:** explain the 701.74089895 uniBTC difference between feeder and dashboard, and verify complete global liabilities and feed-update methodology.
- **Redemption maturity and throughput:** separate mature claims from all uncleared debt, verify recent completions and backing replenishment; a live unpaused router alone does not prove prompt settlement.
- **Merlin continuity:** current M-BTC holder rank/share, implementation, bridge administrators and mint-relayers were not reverified; the historical onchain basis remains August 8, 2026.
- **Operational controls:** complete FBTCProxy/legacy-router downstream authority, directBTC reporting controls, and current Safe Harbor adoption remain unverified.

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
- [September 13, 2026 evidence](../data/bedrock-unibtc-2026-09-13.json): pinned Ethereum contract/proxy/role/allowlist reads, full paginated role histories, Safe continuity, CCIP inbound/outbound lane buckets, live redemption parameters and debts, and unsigned CoW quotes. `totalTokenSupply()` is the supply getter used by the Vault; `totalSupply()` on that feeder reverts.
- [Bedrock reserve API](https://affiliate-api-eosin.vercel.app/api/v1/third/stats/unibtc), [DeFiLlama API](https://api.llama.fi/protocol/bedrock-unibtc), and [CoinGecko](https://www.coingecko.com/en/coins/universal-btc): independently timed market/reserve snapshots recorded in the evidence.
- Reserve/Merlin verification on August 8, 2026: Bedrock dashboard reserve composition and linked addresses; M-BTC `totalSupply()`, `bridgeAddress()`, Bedrock reserve balance and holder rank; main bridge `version()`, admin and mint-relayer reads; EIP-1967 implementation slots; and bytecode-presence checks via Merlin RPC.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [August 10, 2026](https://github.com/yearn/risk-score/pull/303) | 3.6 | Initial uniBTC assessment |
| September 13, 2026 | 3.8 | Verified manual supply reporting and unresolved denominator discrepancy; refreshed roles, deposit limits, redemption liquidity, reserves, and indicative exit quotes. Elevated Risk. |
