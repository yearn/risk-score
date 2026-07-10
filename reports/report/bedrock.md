# Protocol Risk Assessment: Bedrock brBTC

- **Assessment Date:** May 18, 2026 (Updated: July 10, 2026 — scope narrowed to brBTC only)
- **Token:** brBTC
- **Chain:** Ethereum
- **Token Address:** [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646)
- **Final Score: 3.8/5.0**

## Overview + Links

Bedrock brBTC is a BTC meta-LRT. Users deposit BTC-denominated assets into the brBTC Vault and receive brBTC. The asset is intended to allocate across multiple BTC restaking venues rather than track one single backing venue.

This report is scoped to **brBTC only**. It does not assess uniBTC or uniETH as standalone assets. uniBTC is still mentioned where relevant because it is one of the accepted brBTC deposit assets and therefore an upstream dependency.

**Links:**

- [Bedrock website](https://www.bedrock.technology/)
- [Bedrock app](https://app.bedrock.technology/)
- [Bedrock docs](https://docs.bedrock.technology/)
- [Statistics dashboard](https://app.bedrock.technology/statistics)
- [GitHub — Bedrock-Technology](https://github.com/Bedrock-Technology)
- [brBTC GitHub — Bedrock-Technology/omni](https://github.com/Bedrock-Technology/omni)
- [BlockSec brBTC audit](https://github.com/Bedrock-Technology/omni/blob/main/blocksec_bedrock_br_v1.0-signed.pdf)
- [DefiLlama — Bedrock aggregate](https://defillama.com/protocol/bedrock)
- [Babylon Labs](https://babylonlabs.io/)

## Contract Addresses

### brBTC Token Layer

| Contract | Address | Role |
|----------|---------|------|
| brBTC token proxy | [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646) | User-facing brBTC token, EIP-1967 transparent proxy |
| brBTC token implementation | [`0x6fC60782295B8c3D83bBa1324cd2ab1E77330Fbe`](https://etherscan.io/address/0x6fC60782295B8c3D83bBa1324cd2ab1E77330Fbe) | Token implementation |
| brBTC ProxyAdmin | [`0x9F63269196A8828f05F2E49D1078eA7C44e7f002`](https://etherscan.io/address/0x9F63269196A8828f05F2E49D1078eA7C44e7f002) | Upgrade authority for brBTC token and brBTC Vault |

### brBTC Protocol Layer

| Contract | Address | Role |
|----------|---------|------|
| brBTC Vault proxy | [`0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386`](https://etherscan.io/address/0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386) | brBTC mint and restaking allocation vault |
| brBTC Vault implementation | [`0xC7D81a22b384e4bBE6cC3a860e246501728334C7`](https://etherscan.io/address/0xC7D81a22b384e4bBE6cC3a860e246501728334C7) | `brVault` implementation |

### Bridge / Cross-Chain Mint Layer

| Contract | Address | Role |
|----------|---------|------|
| Chainlink CCIP BurnMintTokenPool 1.5.1 | [`0x512c2Ddf5f7F48a6c44cFF73CD8d7edEC5e6b0d8`](https://etherscan.io/address/0x512c2Ddf5f7F48a6c44cFF73CD8d7edEC5e6b0d8) | Holds `MINTER_ROLE` on brBTC token; `owner()` = Bedrock admin Safe |
| Free Tunnel brBTC bridge proxy | [`0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | `DelayedERC1967Proxy`; holds `MINTER_ROLE` on brBTC token |
| Free Tunnel implementation | [`0x06B4660a3b7999a4817cd2FF3c1832F08FC95DD9`](https://etherscan.io/address/0x06B4660a3b7999a4817cd2FF3c1832F08FC95DD9) | `TunnelContract` (Free Tunnel cross-chain framework) |

### Operational Layer

| Contract | Address | Role |
|----------|---------|------|
| TransferProxy | [`0x28BfF185E5874E67dc03d8C096e27b775D5058A2`](https://etherscan.io/address/0x28bff185e5874e67dc03d8c096e27b775d5058a2) | Sole `OPERATOR_ROLE` holder on brBTC Vault; moves vault collateral to an immutable destination (the brBTC ops Safe); `owner()` = EOA `0x9251Fd3D…` |
| TransferProxy owner | [`0x9251Fd3D79522bB2243a58FFf1dB43E25A495aaB`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) | EOA that can trigger vault→Safe collateral transfers; formerly also held brBTC token `DEFAULT_ADMIN_ROLE`/`MINTER_ROLE` (revoked) |

### Governance Layer

| Safe | Address | Threshold | Controls |
|------|---------|-----------|----------|
| Bedrock admin Safe | [`0xAeE017052DF6Ac002647229D58B786E380B9721A`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A) | 3/5 | Owns brBTC ProxyAdmin `0x9F632691…`; owns CCIP BurnMintTokenPool |
| brBTC ops Safe | [`0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9`](https://etherscan.io/address/0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9) | 3/4 | Holds `DEFAULT_ADMIN_ROLE` on brBTC Vault **and on the brBTC token** |

All thresholds/owners were read live via `getThreshold()` / `getOwners()` in the original verification pass and re-verified on July 10, 2026. ProxyAdmin ownership was read via `owner()`. `DEFAULT_ADMIN_ROLE` was confirmed via `hasRole(bytes32(0), <safe>)` on both the vault and the token.

**Signer overlap:** signer [`0x09610d4239c8f3413509202DCcC7e27C6B0a47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3) appears in multiple Bedrock governance Safes, and signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32) appears in both the uniBTC and brBTC Safe set. This reduces effective independence between Bedrock admin paths.

## How brBTC Works

- **Deposit assets accepted:** uniBTC, FBTC, cbBTC, WBTC, M-BTC.
- **Mint flow:** User-facing mint is atomic through the brBTC Vault. Two additional privileged mint paths exist for cross-chain transfers: a Chainlink CCIP `BurnMintTokenPool` and a Free Tunnel bridge contract (see *Token Mint Authority* below).
- **Restaking allocations:** Babylon Labs, Kernel DAO, SatLayer, Pell Network, Symbiotic, and Mellow Finance. Each venue is a distinct smart-contract and/or protocol counterparty.
- **PoR:** No public Chainlink Proof-of-Reserve feed or equivalent independent reserve feed was found for brBTC. Reserve accounting appears internal to the Bedrock system.
- **Vault status:** `outOfService = false` in the original onchain verification pass.
- **Redemption:** **The brBTC Vault has no redemption function.** Verified in the `brVault` implementation source ([`0xC7D81a22…`](https://etherscan.io/address/0xC7D81a22b384e4bBE6cC3a860e246501728334C7#code)): the only user-facing function is `mint(address,uint256)`; there is no `redeem`/`withdraw` path. Exit therefore depends entirely on Bedrock's offchain/operational process (or bridging to other chains), and the fee/delay/queue mechanics of that process remain undocumented (TODO).
- **Collateral flow (verified onchain July 10, 2026):** deposits sit in the vault until moved out through an `OPERATOR_ROLE`-gated `execute()` restricted to a two-address target whitelist (the uniBTC and M-BTC token contracts, per `TargetAllowed` events). The sole `OPERATOR_ROLE` holder is a `TransferProxy` contract ([`0x28BfF185…`](https://etherscan.io/address/0x28bff185e5874e67dc03d8c096e27b775d5058a2#code)) whose destination is immutably fixed to the brBTC ops Safe and whose `owner()` — the address that can trigger transfers — is the EOA [`0x9251Fd3D…`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab). Of ≈1,284 BTC-denominated tokens ever deposited, only ≈15.5 remain in the vault; the ops Safe balance is zero, so ≈1,268 BTC of collateral has moved beyond onchain-traceable brBTC contracts to restaking venues/custody.

## Audits and Due Diligence Disclosures

| Scope | Firm | Date | Link |
|-------|------|------|------|
| brBTC / BR contracts | BlockSec | Dec 16, 2024 | [PDF](https://github.com/Bedrock-Technology/omni/blob/main/blocksec_bedrock_br_v1.0-signed.pdf) |

brBTC has one published BlockSec audit. The brBTC codebase is separate from Bedrock's uniBTC repository: brBTC lives in [`Bedrock-Technology/omni`](https://github.com/Bedrock-Technology/omni), while uniBTC lives in [`Bedrock-Technology/uniBTC`](https://github.com/Bedrock-Technology/uniBTC). The September 2024 uniBTC exploit is therefore not treated as a direct exploit of brBTC code, but uniBTC remains relevant as an accepted brBTC input asset and as a shared Bedrock governance/ecosystem dependency.

### Bug Bounty

- **No public Immunefi / Cantina / Sherlock / Code4rena bug bounty program found.** Direct URL [immunefi.com/bug-bounty/bedrock/](https://immunefi.com/bug-bounty/bedrock/) returns 404. The Bedrock docs site has no dedicated bug-bounty page.
- **SEAL Safe Harbor: NOT registered.** Confirmed against the onchain SafeHarborRegistry [`0x8f72fcf695523A6FC7DD97EafDd7A083c386b7b6`](https://etherscan.io/address/0x8f72fcf695523A6FC7DD97EafDd7A083c386b7b6) — no Bedrock-related address (vault, token, or deployer) appeared in the registry adoption logs during the original verification pass.

## Historical Track Record

- **Time in production:** brBTC has been live since approximately December 2024, or about 19 months as of July 2026.
- **Scale:** brBTC is materially smaller than Bedrock's uniBTC product. The original onchain verification pass read **121.37 brBTC** total supply on Ethereum (`12,137,141,779` sats). brBTC is not tracked as a separate DeFiLlama protocol page in the same way as Bedrock aggregate / uniBTC.
- **Multichain footprint (verified July 10, 2026):** the Ethereum-resident supply materially understates brBTC's global size. Cumulative Ethereum vault deposits are ≈1,284 BTC-denominated tokens, and remote supplies read live were **518.457 brBTC on Base** ([`0x3376eBcA…`](https://basescan.org/address/0x3376ebca0a85fc8d791b1001a571c41fdd61514a)) and **1.304 brBTC on BNB Chain** ([`0x733A6C29…`](https://bscscan.com/address/0x733a6c29eda4a58931ae81b8d91e29f2eaf01df3)); Berachain and the non-EVM CCIP lanes were not read this session. A full cross-chain supply-to-backing reconciliation remains open.
- **Bedrock aggregate TVL context:** DeFiLlama reported **$310.87M** Bedrock aggregate TVL on July 10, 2026. This should be treated as ecosystem context, not brBTC-specific TVL.
- **Incident history:** No brBTC-specific exploit was identified in this review. Bedrock did suffer a September 2024 uniBTC mint-validation exploit, but that occurred in a different codebase and before brBTC's launch. It remains relevant only as an operational-history signal for the same organization.

## Funds Management

### Accessibility

| Token | Mint | Redeem | Fees | Permissioning |
|-------|------|--------|------|---------------|
| brBTC | Atomic through brBTC Vault | **None onchain** — `brVault` has no redeem/withdraw function (verified in source); exit is offchain/operational or via bridges | TODO (offchain process undocumented) | Mint permissionless; exit not permissionless |

### Token Mint Authority

**Mint mechanism:** Role-gated AccessControl. The brBTC token's `mint(address,uint256)` is `onlyRole(MINTER_ROLE)`; `burn`/`burnFrom` are standard permissionless holder burns (verified in the token implementation source [`0x6fC60782…`](https://etherscan.io/address/0x6fC60782295B8c3D83bBa1324cd2ab1E77330Fbe#code)).

**Mint requires backing:** No — at the token level a `MINTER_ROLE` holder can issue unbacked brBTC. Collateral checks live in the callers: the brBTC Vault path requires a deposit in the same transaction; the two bridge paths rely on brBTC being burned/locked on the source chain.

The role is not enumerable onchain (`getRoleMemberCount` reverts), so holders were reconstructed from a full `RoleGranted` / `RoleRevoked` event scan on the token (blocks 21,000,000 → latest) and each current holder re-confirmed via `hasRole` on July 10, 2026.

**Per-address mint authority** (verified onchain July 10, 2026, from token contract `0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x1419b48e…E3386`](https://etherscan.io/address/0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386) | ✓ | — | `MINTER_ROLE` | brBTC Vault — collateralized user mint path |
| [`0x512c2Ddf…b0d8`](https://etherscan.io/address/0x512c2Ddf5f7F48a6c44cFF73CD8d7edEC5e6b0d8) | ✓ | ✓ | `MINTER_ROLE` | Chainlink CCIP `BurnMintTokenPool 1.5.1`; `owner()` = Bedrock admin Safe (3/5). Rate limits enabled on all 8 configured lanes: 1–2 brBTC bucket capacity, ≈2 brBTC/day refill per lane |
| [`0x70aF4743…Ad21C`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | ✓ | ✓ | `MINTER_ROLE` | Free Tunnel bridge — `DelayedERC1967Proxy` over `TunnelContract` [`0x06B4660a…`](https://etherscan.io/address/0x06B4660a3b7999a4817cd2FF3c1832F08FC95DD9); third-party bridge framework. **Not mentioned in Bedrock's public brBTC bridge docs, which document Chainlink CCIP only.** Mints require 3-of-4 executor signatures; admin is EOA `0x0014Eb4A…`; executor rotation has a 36h–5d built-in delay |
| `0x0000…0000` (zero address) | ✓ | — | `MINTER_ROLE` | Granted in the initialization tx (block 21,434,675) and never revoked. Inert in practice (the zero address cannot originate calls), but an initialization artifact worth noting |
| [`0x1f3c54ec…1aC9`](https://etherscan.io/address/0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9) | grants | grants | `DEFAULT_ADMIN_ROLE` | brBTC ops Safe (3/4) — can grant `MINTER_ROLE` to any address **with no timelock**; this is an unbacked-mint escalation path |

**Historical (revoked) holders:** deployer [`0x899c284A…3c94F`](https://etherscan.io/address/0x899c284a89e113056a72dc9ade5b60e80dd3c94f) (initial `DEFAULT_ADMIN_ROLE`, revoked at block 21,799,264) and EOA [`0x9251Fd3D…95AaB`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) (held both `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE` operationally; both revoked at block 25,006,441–25,006,455, together with old token pool [`0xbeFc7D6a…6633d`](https://etherscan.io/address/0xbefc7d6a15cc9bf839e64a16cd43abd55dd6633d)). That an EOA temporarily held token-admin and mint rights is an operational-history signal.

**Rate limits / supply caps:** None found in the token contract — `mint` has no cap or per-minter limit. Any rate-limiting on the CCIP path lives in the token pool configuration; the Free Tunnel path's limits are TODO.

**Backing check at mint time:** Atomic for the vault path; deferred/bridge-attested for the CCIP and Free Tunnel paths; none at the raw token level.

### Collateralization

- **Accepted backing assets:** uniBTC, FBTC, cbBTC, WBTC, and M-BTC. This creates issuer/custody dependencies on multiple wrapped BTC providers and on Bedrock's own uniBTC.
- **Restaking venue spread:** brBTC allocates across Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, and Mellow. This diversification reduces dependence on one venue but compounds the number of independent slashing, oracle, upgrade, and smart-contract failure paths.

**Ethereum vault deposits vs. current holdings** (read onchain July 10, 2026 via `tokenUsedCaps` / `tokenCaps` / `balanceOf`):

| Token | Cumulative deposited | Vault balance now | Deposit cap |
|-------|---------------------:|------------------:|------------:|
| uniBTC | 271.240 | 13.672 | 3,000 |
| WBTC | 0.526 | 0.526 | 500 |
| FBTC | 0.002 | 0.002 | 500 |
| cbBTC | 0.055 | 0.055 | 500 |
| M-BTC | 1,012.367 | 1.217 | 1,038.046 |
| **Total (BTC-denominated)** | **≈1,284.19** | **≈15.47** | |

- Only uniBTC and M-BTC can leave the vault (their token contracts are the only `allowedTargets` for `execute()`); the WBTC/FBTC/cbBTC balances still equal their cumulative deposits exactly.
- All outflows go through the `TransferProxy` to the brBTC ops Safe (3/4), whose current balances of all five assets are **zero** — the collateral has moved onward to restaking venues/custody that cannot be traced further from the brBTC contracts alone.
- **Custody / reserve visibility:** TODO — no brBTC-specific public PoR feed, no complete per-venue allocation report, and no named BTC custodian/signing arrangement was found in public Bedrock materials. The onchain trail verified above ends at the ops Safe's outbound transfers.

### Provability

brBTC has weak public reserve provability relative to uniBTC. The report found no Chainlink PoR feed for brBTC and no independent public feed that ties brBTC supply to backing collateral across the accepted BTC wrappers and restaking venues. Users must rely on Bedrock's internal accounting and operational controls.

## Liquidity Risk

- **Secondary market liquidity:** brBTC had no meaningful reported 24h DEX volume on CoinGecko in the original review. Treat secondary-market exit as effectively unavailable for material size.
- **Primary exit:** Protocol redemption is therefore the binding exit path, but fee, queue, and delay mechanics are not publicly documented. This is the single largest liquidity disclosure gap.
- **CEX listings:** None disclosed in CoinGecko for brBTC in the original review.

## Centralization & Control Risks

### Governance

- brBTC token and brBTC Vault are upgradeable transparent proxies.
- The Bedrock admin Safe is 3-of-5 and owns the brBTC ProxyAdmin.
- The brBTC ops Safe is 3-of-4 and holds `DEFAULT_ADMIN_ROLE` on the brBTC Vault **and on the brBTC token itself**. The token-level admin role means three ops-Safe signatures can grant `MINTER_ROLE` to an arbitrary address and mint unbacked brBTC, with no timelock in the path (see *Token Mint Authority*).
- Two bridge contracts hold live `MINTER_ROLE` on the token: the Chainlink CCIP `BurnMintTokenPool` (owned by the Bedrock admin Safe) and a Free Tunnel bridge contract whose upgrade/executor control sits in a third-party framework.
- No Safe Guard or Delay module was configured on the relevant Bedrock Safes in the original onchain verification pass. A threshold signature can therefore execute upgrades or privileged actions without an onchain delay.
- **Collateral movement is EOA-triggered.** The vault's only `OPERATOR_ROLE` holder is the `TransferProxy`, owned by EOA `0x9251Fd3D…`. The blast radius is limited — the proxy's destination is immutably the ops Safe, and `execute()` targets are whitelisted to the uniBTC/M-BTC token contracts — but a single hot key controls when and how much collateral leaves the vault, and the same EOA formerly held token-level admin and mint rights.
- **No active pauser.** `PAUSER_ROLE` on the vault has zero current holders (the deployer's grant was revoked at block 25,006,479 and never reassigned). Pausing deposits of a compromised collateral token would first require the ops Safe to grant the role.
- **Free Tunnel control (verified from contract getters):** admin is EOA [`0x0014Eb4A…`](https://etherscan.io/address/0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C) (can add/remove proposers and transfer admin); bridge mints require 3-of-4 executor signatures (executors: `0x9E498DD0…`, `0xdE9a5Ab5…`, `0xa5ED5Aa2…`, `0xdA084147…`); executor-set rotation requires existing executor signatures plus a built-in 36-hour-to-5-day activation delay. Executor `0xdA084147…` is also a brBTC ops Safe signer.
- Signer overlap across Bedrock Safes weakens practical separation between product lines.

### Programmability

brBTC's user-facing mint is atomic, but everything after the deposit is manual: an EOA-owned `TransferProxy` moves collateral from the vault to the ops Safe, the Safe forwards it to restaking venues offchain-coordinated, and there is no onchain redemption function at all. The system is not a simple immutable wrapper; it depends on privileged operational choices, manual capital movement, and upgradeable contracts.

### External Dependencies

| Dependency | Used by brBTC | Criticality |
|-----------|---------------|-------------|
| uniBTC | Accepted deposit asset | High — upstream Bedrock BTC LRT and custody/PoR assumptions |
| WBTC / FBTC / cbBTC / M-BTC | Accepted deposit assets | High — wrapped BTC issuer/custody risk |
| Babylon Labs | BTC restaking venue | High |
| Kernel DAO | BTC restaking venue | High |
| SatLayer | BTC restaking venue | High |
| Pell Network | BTC restaking venue | High |
| Symbiotic | Restaking venue | High |
| Mellow Finance | Restaking / vault venue | High |
| Chainlink CCIP | Cross-chain path — `BurnMintTokenPool` holds `MINTER_ROLE`; 8 lanes configured (docs list 3 networks); per-lane rate limits enabled (1–2 brBTC capacity, ≈2 brBTC/day) | High — bridge security affects multi-chain peg and supply integrity, partially mitigated by rate limits |
| Free Tunnel (Free Protocol) | Cross-chain path — bridge contract holds `MINTER_ROLE`, undocumented in Bedrock docs | High — third-party bridge with mint rights; 3-of-4 executor signatures, EOA admin, delayed executor rotation |
| Undisclosed custody/signing setup | BTC backing control | Critical unknown |

## Operational Risk

- **Team transparency:** Bedrock/RockX leadership is public. Zhuling Chen is CEO of both Bedrock and RockX; Alex Lam is a RockX co-founder.
- **Legal structure:** Per Bedrock [Terms of Use](https://docs.bedrock.technology/legal/terms-of-use.md), the website and protocol are operated by **Golden Bull Enterprises Limited**, formed under the laws of the **British Virgin Islands**.
- **Documentation:** Public docs cover Bedrock architecture and audits, but brBTC-specific redemption and reserve-accounting disclosures are thin.
- **Incident handling:** The prior uniBTC incident response was credible at the organization level (pause, patch, re-audit, user reimbursement by Fuzzland), but it was not a brBTC incident and should not be over-weighted as brBTC code history.

## Monitoring

### Critical

1. **brBTC Vault** [`0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386`](https://etherscan.io/address/0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386):
   - `outOfService()` state changes.
   - `Upgraded` events.
   - `RoleGranted` / `RoleRevoked` for `DEFAULT_ADMIN_ROLE`, `OPERATOR_ROLE`, and `PAUSER_ROLE` (a new `OPERATOR_ROLE` holder is a new fund-exit path; `PAUSER_ROLE` currently has no holder).
   - `TargetAllowed` / `TargetDenied` and `TokenAllowed` / `TokenDenied` events — a new allowed target widens where `execute()` can send vault funds.
   - Vault collateral balances vs. `tokenUsedCaps` (baseline July 10, 2026: ≈15.47 of ≈1,284.19 BTC-denominated deposits remain in the vault).
2. **brBTC token** [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646):
   - `totalSupply()` changes.
   - Implementation upgrades.
   - `RoleGranted` / `RoleRevoked` for `MINTER_ROLE` and `DEFAULT_ADMIN_ROLE` — any new `MINTER_ROLE` holder is a potential unbacked-mint path and should page immediately.
   - Large mints not originating from the brBTC Vault, CCIP token pool [`0x512c2Ddf…`](https://etherscan.io/address/0x512c2Ddf5f7F48a6c44cFF73CD8d7edEC5e6b0d8), or Free Tunnel bridge [`0x70aF4743…`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C).
3. **Governance Safes:**
   - Bedrock admin Safe [`0xAeE017052DF6Ac002647229D58B786E380B9721A`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A).
   - brBTC ops Safe [`0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9`](https://etherscan.io/address/0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9).
   - Monitor owner additions/removals and threshold changes.
4. **Operational pipeline:**
   - TransferProxy [`0x28BfF185…`](https://etherscan.io/address/0x28bff185e5874e67dc03d8c096e27b775d5058a2): `OwnershipTransferred` events and transfer activity of its EOA owner [`0x9251Fd3D…`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab).
   - Ops Safe outbound collateral transfers (where uniBTC / M-BTC go after leaving the vault).
5. **Bridge minters:**
   - CCIP token pool [`0x512c2Ddf…`](https://etherscan.io/address/0x512c2Ddf5f7F48a6c44cFF73CD8d7edEC5e6b0d8): rate-limit config changes, `ChainAdded`/`ChainRemoved`, ownership transfer.
   - Free Tunnel [`0x70aF4743…`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C): executor-set updates, admin transfer, abnormal mint volume.
6. **Restaking venue changes:** alert if Bedrock adds/removes a brBTC venue or materially changes allocation methodology.
7. **Public reserve disclosures:** alert if Bedrock publishes a brBTC PoR feed, per-venue allocation report, or custodian disclosure.

### Recommended Frequency

- Vault state and upgrades: every block.
- Governance Safe activity: daily.
- brBTC supply reconciliation: daily.
- Restaking venue announcements and docs changes: daily.
- TVL / market liquidity: daily.

## Appendix: Contract Architecture

```
Governance Layer
================
Bedrock Admin Safe 0xAeE01705… (3/5)
  └── owns brBTC ProxyAdmin 0x9f632691…
        ├── admin ──> brBTC token 0x2eC37d…
        └── admin ──> brBTC Vault 0x1419b4…

brBTC Ops Safe 0x1f3c54ec… (3/4)
  ├── DEFAULT_ADMIN_ROLE ──> brBTC Vault
  └── DEFAULT_ADMIN_ROLE ──> brBTC token (can grant MINTER_ROLE, no timelock)

Token / Vault Layer
===================
brBTC token 0x2eC37d…646
  ├── mint through brBTC Vault 0x1419b4…3386 (no onchain redeem)
  │     └── accepts deposits: uniBTC, FBTC, cbBTC, WBTC, M-BTC
  ├── MINTER_ROLE: CCIP BurnMintTokenPool 0x512c2D… (owner: Admin Safe, rate-limited)
  ├── MINTER_ROLE: Free Tunnel bridge 0x70aF47… (3/4 executors, EOA admin)
  └── MINTER_ROLE: zero address (init artifact, inert)

Collateral Outflow / Restaking Layer
====================================
brBTC Vault (holds ≈15.5 of ≈1,284 BTC deposited)
  └── execute() by TransferProxy 0x28BfF1… (OPERATOR_ROLE)
        │   owner: EOA 0x9251Fd… — triggers transfers
        └── fixed destination: brBTC Ops Safe (balance now: 0)
              └── onward to Babylon, Kernel DAO, SatLayer, Pell,
                  Symbiotic, Mellow (not traceable from brBTC contracts)

Critical Unknowns
=================
No brBTC-specific public PoR
No onchain redemption; offchain exit process undocumented
Undisclosed custody/signing setup beyond the ops Safe hop
```

---

## Risk Summary

### Key Strengths

1. **Separate brBTC codebase and audit:** brBTC is not the same codebase as the exploited uniBTC vault; it has a dedicated BlockSec audit.
2. **Multisig governance rather than single EOA:** brBTC admin paths are controlled by Safes.
3. **Doxxed leadership and known legal entity:** Bedrock / RockX leadership is public, and Terms of Use identify a BVI operating entity.
4. **Venue diversification:** brBTC is not dependent on a single BTC restaking venue.
5. **Bounded operational blast radius on verified paths:** the collateral-moving `TransferProxy` can only send funds to the ops Safe (immutable destination), CCIP lanes are rate-limited to ≈2 brBTC/day each, and Free Tunnel executor rotation has a built-in 36h–5d delay.

### Key Risks

1. **No brBTC-specific public Proof-of-Reserve.** Users cannot independently reconcile brBTC supply to per-venue reserves from a public feed.
2. **No onchain redemption path exists.** The `brVault` contract has no redeem/withdraw function (verified in source); exit depends entirely on Bedrock's undocumented offchain process or on bridging out.
3. **Very thin secondary liquidity.** Material exits depend on an operational redemption process that is neither onchain nor documented.
4. **Collateral custody leaves the observable system.** Only ≈15.5 of ≈1,284 BTC-denominated deposits remain in the vault; outflows are triggered by a single EOA (via the TransferProxy) and pass through the ops Safe (current balance zero) to untraceable venue/custody positions.
5. **Upgradeable contracts with no onchain timelock.** Safe threshold signatures can upgrade contracts or change privileged roles without an onchain delay. In particular, the 3/4 ops Safe holds `DEFAULT_ADMIN_ROLE` on the brBTC token and can grant `MINTER_ROLE` (an unbacked-mint path) with no delay.
6. **Bridge contracts hold live mint authority — one of them undocumented.** The Chainlink CCIP token pool and a Free Tunnel bridge contract can each mint brBTC; a compromise of either bridge (or of the Free Tunnel executor set) can inflate supply on Ethereum. Bedrock's public bridge documentation covers only Chainlink CCIP; the Free Tunnel minter is disclosed nowhere in the docs. Per-lane CCIP rate limits and the Free Tunnel 3-of-4 executor threshold partially mitigate.
7. **Compounded restaking/counterparty exposure.** Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, and Mellow each add independent failure/slashing paths.
8. **Accepted-asset risk.** brBTC accepts multiple wrapped BTC assets, including uniBTC, so upstream issuer/custody failures can affect brBTC.
9. **One audit only and no public bug bounty.**

### Critical Risks

- brBTC does not trigger a terminal critical gate because it has a published audit, verified contracts, and multisig governance. The unresolved risk is narrower than the original combined Bedrock scope, but no public brBTC PoR, undocumented redemption, thin liquidity, and no timelock still require strict caps and enhanced monitoring.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **Unverified contract source** — PASS. brBTC token and vault proxies and both implementations (`0x6fC60782…`, `0xC7D81a22…`) are source-verified on Etherscan.
- [ ] **No audit** — PASS. brBTC has a dedicated BlockSec audit.
- [ ] **Unverifiable reserves** — BORDERLINE, not triggered. There is no brBTC-specific public PoR or per-venue reserve feed. Not marked as a hard gate only because the contract source is verified and minting is through a public vault, but this remains a major score driver.
- [ ] **Total centralization** — PASS. Governance uses 3-of-5 and 3-of-4 Safes, not a single EOA.

**No gate triggered.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**
- One brBTC-specific BlockSec audit.
- No public bug bounty program.
- Moderate brBTC-specific contract surface, with cross-chain and restaking allocation components.
- **Score: 3.0**

**Subcategory B: Historical Track Record**
- brBTC live since roughly December 2024.
- No brBTC-specific exploit identified.
- Small scale and limited public liquidity history.
- **Score: 3.0**

**Audits & Historical Score = (3.0 + 3.0) / 2 = 3.0**

**Score: 3.0/5** — One dedicated audit and no brBTC-specific incident justify a lower score than the original combined Bedrock assessment, though no bug bounty and limited production history keep it above low risk.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**
- 3-of-5 Safe owns brBTC ProxyAdmin; 3-of-4 Safe controls brBTC Vault admin role **and the brBTC token admin role** (can grant `MINTER_ROLE` — an unbacked-mint escalation path).
- No timelock, no Safe Guard / Delay module in the original verification pass. The scoring rubric's 3/5-multisig row assumes at least a short timelock; here there is none, so the score sits between rows 4 and 5.
- Signer overlap across Bedrock Safes.
- **Score: 4.25**

**Subcategory B: Programmability**
- Mint is onchain, but everything downstream is manual: collateral outflow is triggered by an EOA-owned `TransferProxy`, venue allocation happens from Safe custody offchain, and there is no onchain redemption function.
- **Score: 3.5**

**Subcategory C: External Dependencies**
- Six restaking venues, multiple wrapped BTC issuers, two bridge frameworks with live mint authority (Chainlink CCIP, Free Tunnel), and undisclosed custody/signing setup.
- **Score: 4.25**

**Centralization Score = (4.25 + 3.5 + 4.25) / 3 = 4.0**

**Score: 4.0/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**
- Intended BTC-denominated backing through accepted BTC wrappers and restaking positions.
- Collateral quality is mixed and includes multiple issuer/custody dependencies.
- Verified onchain that only ≈15.5 of ≈1,284 BTC-denominated cumulative deposits remain in the vault; the rest moved through the ops Safe to positions that cannot be traced from the brBTC contracts. Per-venue balances and brBTC-specific reserve reconciliation are not publicly available.
- **Score: 4.0**

**Subcategory B: Provability**
- No brBTC-specific PoR.
- No public per-venue reserve dashboard sufficient to independently reconcile backing.
- **Score: 4.0**

**Funds Management Score = (4.0 + 4.0) / 2 = 4.0**

**Score: 4.0/5** — The absence of public reserve proofs remains the main constraint, now compounded by the verified fact that nearly all collateral sits beyond the onchain-traceable brBTC contracts. The brBTC-only scope still removes unrelated uniBTC/uniETH mechanics from this category.

#### Category 4: Liquidity Risk (Weight: 15%)

- brBTC has effectively no useful secondary DEX exit.
- There is no onchain redemption function in the vault (verified in source); exit depends on an undocumented offchain process or on bridging to other chains' liquidity.
- **Score: 4.25**

**Score: 4.25/5** — Between rubric rows 4 and 5: exits are restricted and the mechanism is not verifiable, but bridges and an operational redemption process appear to exist, so this is not scored as a full "no clear exit mechanism".

#### Category 5: Operational Risk (Weight: 5%)

- Doxxed leadership and legal entity are positives.
- Documentation gaps are material for brBTC specifically.
- Prior uniBTC incident is an organizational caution but not direct brBTC code history.
- **Score: 2.25**

**Score: 2.25/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.600 |
| Centralization & Control | 4.0 | 30% | 1.200 |
| Funds Management | 4.0 | 30% | 1.200 |
| Liquidity Risk | 4.25 | 15% | 0.638 |
| Operational Risk | 2.25 | 5% | 0.113 |
| **Subtotal** | | | **3.750** |

**Modifiers:**
- No brBTC-specific public PoR, the missing onchain redemption function, and the collateral-custody opacity are already captured in Funds Management and Liquidity; no extra modifier applied.
- The token-level unbacked-mint escalation path (ops Safe `DEFAULT_ADMIN_ROLE`, no timelock), the EOA-triggered collateral pipeline, and bridge mint authority are captured in the Centralization subscores; no extra modifier applied.
- Prior uniBTC exploit is not applied as a direct brBTC incident modifier because brBTC uses a separate codebase.

**Adjusted Final Score: ~3.8 / 5.0**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

brBTC should be treated as an elevated-risk BTC restaking asset. The brBTC-only scope removes uniBTC/uniETH mechanics from the assessment, but the July 10, 2026 verification pass hardened the risk picture: there is no onchain redemption path, collateral custody exits the observable contract system through an EOA-triggered pipeline, and two bridge contracts (one undocumented) hold mint authority. Strict caps remain appropriate until Bedrock publishes brBTC-specific reserve proofs and a documented redemption process.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months, or sooner on any of the events below.
- **TVL / supply-based:** Reassess if brBTC supply changes by more than ±40% from the latest verified baseline.
- **Incident-based:** Any exploit, depeg >2% sustained >1h, redemption queue freeze, restaking-venue loss, or governance compromise.
- **Specific triggers:**
  1. brBTC implementation upgrade or brBTC Vault implementation upgrade.
  2. ProxyAdmin or Safe ownership transfer.
  3. Safe owner addition/removal or threshold change.
  4. brBTC adds/removes a restaking venue.
  5. Bedrock publishes brBTC PoR or per-venue reserve reporting.
  6. Bedrock publishes brBTC redemption fee/delay/queue mechanics.
  7. Introduction of a timelock on brBTC upgrades.
  8. New audit or bug bounty publication.
  9. Any `RoleGranted` for `MINTER_ROLE` or `DEFAULT_ADMIN_ROLE` on the brBTC token (new mint authority).
  10. Change of CCIP token pool or Free Tunnel bridge contract, or a mint from an address outside the three known minters.

## Open TODOs (Items Not Verifiable This Session)

- **brBTC reserve proof / per-venue allocations** — no public brBTC-specific PoR or independently reconciliable allocation feed found. The onchain trail was traced as far as it goes (vault → TransferProxy → ops Safe, current Safe balance zero); the venue-level positions beyond that hop remain unverifiable.
- **brBTC offchain redemption process** — verified onchain that the vault has no redemption function; the fee, delay, and processing mechanics of whatever offchain exit process Bedrock operates are not documented publicly.
- **Custody/signing setup** for accepted BTC assets and restaked positions beyond the ops Safe hop is not disclosed.
- **Full cross-chain supply reconciliation** — Ethereum (121.37), Base (518.457), and BNB Chain (1.304) brBTC supplies were read live; Berachain and the non-EVM CCIP lanes were not, so global supply vs. cumulative deposits (≈1,284) is not fully reconciled.
- **Free Tunnel upgrade authority** — executor set (3-of-4) and admin EOA were enumerated from contract getters; the exact hub-level implementation-upgrade path for the tunnel proxy was not fully traced.

**Resolved this session (July 10, 2026):** CCIP token pool rate limits (enabled on all 8 lanes, 1–2 brBTC capacity, ≈2 brBTC/day refill); Free Tunnel executor/admin control (3-of-4 executor signatures, EOA admin, 36h–5d rotation delay); vault redemption (none exists onchain); collateral flow and vault operator enumeration (TransferProxy, EOA owner, fixed Safe destination).

## Sources

- Bedrock docs: https://docs.bedrock.technology/
- Bedrock app: https://app.bedrock.technology/
- Bedrock statistics: https://app.bedrock.technology/statistics
- Bedrock audit reports: https://docs.bedrock.technology/security/audit-reports
- Bedrock GitHub org: https://github.com/Bedrock-Technology
- brBTC GitHub: https://github.com/Bedrock-Technology/omni
- BlockSec brBTC audit: https://github.com/Bedrock-Technology/omni/blob/main/blocksec_bedrock_br_v1.0-signed.pdf
- DefiLlama Bedrock aggregate: https://defillama.com/protocol/bedrock
- Babylon Labs: https://babylonlabs.io/
- Onchain verification from original review: `totalSupply()`, `name()`, `symbol()`, `decimals()`, EIP-1967 implementation/admin slots, `owner()` on ProxyAdmins, `getThreshold()` / `getOwners()` on Safes, `hasRole(bytes32,address)` on brBTC Vault.
- Onchain verification July 10, 2026: re-read of the above, plus full `RoleGranted`/`RoleRevoked` event scan on the brBTC token (blocks 21,000,000 → latest), `hasRole` confirmation of every current `MINTER_ROLE` / `DEFAULT_ADMIN_ROLE` holder, `typeAndVersion()`/`owner()` on the CCIP token pool, and Etherscan source review of the token implementation (`mint` is `onlyRole(MINTER_ROLE)`, no supply cap) and the Free Tunnel proxy/implementation.
- Bedrock brBTC bridge docs (documents Chainlink CCIP only): https://docs.bedrock.technology/multi-asset-liquid-staking/brbtc/bridge
- Free Tunnel contract source (verified on Etherscan): https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C#code
- Onchain verification July 10, 2026 (TODO-closure pass): `brVault` source review (no redeem function; `execute` target whitelist), `TargetAllowed`/`TokenAllowed` and vault `RoleGranted`/`RoleRevoked` event scans, `tokenCaps`/`tokenUsedCaps`/`balanceOf` reads for all five deposit assets on vault and ops Safe, TransferProxy source + `owner()`/`to()` reads, CCIP pool `getSupportedChains` + per-lane in/outbound rate-limiter states + `getRemoteToken`, Free Tunnel `getAdmin()`/`getActiveExecutors()`/`proposerOfIndex()` reads and `updateExecutors` source review, brBTC `totalSupply()` on Base (`RPC_8453`) and BNB Chain.
