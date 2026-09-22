# Protocol Risk Assessment: Bedrock uniBTC

- **Assessment Date:** August 10, 2026 (Updated: September 15, 2026)
- **Token:** uniBTC
- **Chain:** Ethereum
- **Token Address:** [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568)
- **Final Score: 3.9/5.0**
- **Snapshot:** Ethereum block [25,981,132](https://etherscan.io/block/25981132), September 15, 2026 06:40:23 UTC

## Overview + Links

Bedrock uniBTC is a wrapped-BTC liquid restaking token. Users deposit supported BTC-denominated assets into the uniBTC Vault and receive uniBTC 1:1 in 8-decimal BTC units. Bedrock documentation describes the underlying BTC exposure as deployed across BTC restaking / custody venues, with Chainlink Proof-of-Reserve used as the public reserve check.

This report is scoped to **uniBTC only**. Bedrock brBTC is a separate codebase and asset, but it is mentioned where relevant because brBTC accepts uniBTC as a deposit asset and therefore creates downstream demand/contagion paths for uniBTC.

**Links:**

- [Bedrock website](https://www.bedrock.technology/)
- [Bedrock docs](https://docs.bedrock.technology/)
- [Statistics dashboard](https://app.bedrock.technology/statistics)
- [GitHub - Bedrock-Technology](https://github.com/Bedrock-Technology)
- [uniBTC GitHub - Bedrock-Technology/uniBTC](https://github.com/Bedrock-Technology/uniBTC)
- [DefiLlama - Bedrock uniBTC](https://defillama.com/protocol/bedrock-unibtc)
- [Chainlink uniBTC PoR feed](https://data.chain.link/feeds/ethereum/mainnet/unibtc-por)
- [BlockApex - uniBTC hack analysis](https://blockapex.medium.com/unibtc-hack-analysis-bffd6cebd4a8)

## Contract Addresses

### uniBTC Token Layer

| Contract | Address | Role |
|----------|---------|------|
| uniBTC token proxy | [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568) | User-facing uniBTC token, EIP-1967 transparent proxy |
| uniBTC token implementation | [`0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD`](https://etherscan.io/address/0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD) | Token implementation |
| uniBTC ProxyAdmin | [`0x029E4FbDAa31DE075dD74B2238222A08233978f6`](https://etherscan.io/address/0x029E4FbDAa31DE075dD74B2238222A08233978f6) | Upgrade authority for uniBTC token, uniBTC Vault, CCIPPeer, live withdrawal router, asset supply feeder, and directBTC |

### Bridge / Cross-Chain Mint Layer

| Contract | Address | Role |
|----------|---------|------|
| Chainlink CCIP BurnMintTokenPool 1.5.1 | [`0x1689C22eD5435e49071CFc208D1Ac6F2A2274490`](https://etherscan.io/address/0x1689C22eD5435e49071CFc208D1Ac6F2A2274490) | Registered uniBTC pool in the CCIP [TokenAdminRegistry](https://etherscan.io/address/0xb22764f98dD05c789929716D677382Df22C05Cb6); holds `MINTER_ROLE`; `owner()` and registry token administrator = Bedrock admin Safe [`0xAeE01705…`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A) (3/5) |
| Bedrock CCIPPeer | [`0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc`](https://etherscan.io/address/0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc) | Bedrock-custom CCIP messaging contract; holds `MINTER_ROLE`; upgradeable proxy under the uniBTC ProxyAdmin |
| Free Tunnel bridge proxy | [`0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | Third-party Free Tunnel (Free Protocol) bridge; holds `MINTER_ROLE`; not mentioned in Bedrock's uniBTC bridge docs |
| Free Tunnel hub | [`0x690357e684F7661911CED0f857a5920E983853aB`](https://etherscan.io/address/0x690357e684F7661911CED0f857a5920E983853aB) | Publishes the only implementation the Tunnel admin can install; owner is a 3-of-4 multisig [`0xb58F7aC2…`](https://etherscan.io/address/0xb58F7aC2d503cEa14B3582C21d72e9817839DcBA) |

### uniBTC Protocol Layer

| Contract | Address | Role |
|----------|---------|------|
| uniBTC Vault proxy | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | Mint/redeem uniBTC against allowed wrapped BTC |
| uniBTC Vault implementation | [`0x01e9161D1621466eB086651FD514d3eFb8C3752E`](https://etherscan.io/address/0x01e9161D1621466eB086651FD514d3eFb8C3752E) | `VaultWithoutNative` implementation |
| Chainlink uniBTC PoR feed | [`0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) | uniBTC reserve feed, 18 decimals, 2% deviation |
| uniBTC supply feeder | [`0xE542919E4b281f10b437F947c8Ba224DdfaBc716`](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716) | Operator-reported `totalTokenSupply()` used by the Vault; differs from dashboard supply |

### Redemption, Operators and Supply Reporting

| Contract | Address | Role |
|----------|---------|------|
| Ethereum DelayRedeemRouter | [`0xAA732c9c110A84d090a72da230eAe1E779f89246`](https://etherscan.io/address/0xAA732c9c110A84d090a72da230eAe1E779f89246) | Live app withdrawal router; implementation [`0x720081e3ee2b1542e341afc793de20b08beb859d`](https://etherscan.io/address/0x720081e3ee2b1542e341afc793de20b08beb859d), under the uniBTC ProxyAdmin |
| Legacy DelayRedeemRouter | [`0xbb45b3a09bffc15747d1a331775fa408e587f38d`](https://etherscan.io/address/0xbb45b3a09bffc15747d1a331775fa408e587f38d) | Superseded router with zero debt that still holds Vault `OPERATOR_ROLE`; implementation [`0x6e542567d4744d648f6ab47ac80becd02e47ac09`](https://etherscan.io/address/0x6e542567d4744d648f6ab47ac80becd02e47ac09); EIP-1967 admin is EOA [`0x3eea50ba…`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) |
| BurnProxy | [`0x4519c8e32b080a778f2ae188d5fdcd98175f0caf`](https://etherscan.io/address/0x4519c8e32b080a778f2ae188d5fdcd98175f0caf) | Vault operator; `burn` only; owned by admin Safe |
| TransferProxy | [`0xf0ab759d3a1a4956e8c3c52c71ccb50f20bc342b`](https://etherscan.io/address/0xf0ab759d3a1a4956e8c3c52c71ccb50f20bc342b) | Vault operator; transfers allowed assets to the ops Safe; owned by admin Safe |
| FBTCProxy | [`0xa3a30f627dbc02aff3c0a736a065443a0e85b1ae`](https://etherscan.io/address/0xa3a30f627dbc02aff3c0a736a065443a0e85b1ae) | Vault operator; non-upgradeable; LockedFBTC mint/redeem calls; operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) holds its admin and operator roles |
| Supply feeder implementation | [`0xf50dbaf3d057164fc79c1aa435ffa011c6bcdae9`](https://etherscan.io/address/0xf50dbaf3d057164fc79c1aa435ffa011c6bcdae9#code) | `uniBTCRate`: operators write supply and reserve values; no supply-update timestamp checked by the Vault |
| Vault asset supply feeder | [`0x94C7F81E3B0458daa721Ca5E29F6cEd05CCCE2B3`](https://etherscan.io/address/0x94C7F81E3B0458daa721Ca5E29F6cEd05CCCE2B3) | `Sigma`; per-token `totalSupply(address)` input to deposit-cap checks |
| directBTC | [`0xA700992A9815d3bfECEDfE51B030fD294Bc0b090`](https://etherscan.io/address/0xA700992A9815d3bfECEDfE51B030fD294Bc0b090) | Bedrock accounting token accepted by the Vault; `MINTER_ROLE` held by the Vault and contract [`0x91fd8c7a…`](https://etherscan.io/address/0x91fd8c7a5fda7d52ab41bbe423eedd3a65d64500); admin Safe is `DEFAULT_ADMIN_ROLE` |

### Governance Layer

| Controller | Address | Type | Controls |
|------------|---------|------|----------|
| uniBTC ops Safe | [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) | Safe 3/5 | Owns uniBTC ProxyAdmin; `DEFAULT_ADMIN_ROLE` on uniBTC token, Vault and live router; `FREEZER_ROLE` on token |
| Bedrock admin Safe | [`0xAeE017052DF6Ac002647229D58B786E380B9721A`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A) | Safe 3/5 | Owns CCIP pool, BurnProxy and TransferProxy; CCIPPeer and directBTC `DEFAULT_ADMIN_ROLE` |
| Operational EOA | [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) | EOA | Vault `MANAGER_ROLE`/`PAUSER_ROLE`, supply feeder admin/operator, CCIP rate-limit admin, router and CCIPPeer pauser, FBTCProxy admin |
| Legacy router admin | [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) | EOA | EIP-1967 admin of the legacy router, which holds Vault `OPERATOR_ROLE` |
| Supply feeder proxy admin | [`0x899c284A89E113056a72dC9ade5b60E80DD3c94f`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f) | EOA | EIP-1967 admin of the supply feeder; also token `freezeToRecipient` |

**Signer overlap:** signer [`0x09610d4239c8f3413509202DCcC7e27C6B0a47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3) appears in multiple Bedrock governance Safes, and signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32) appears in both the uniBTC and brBTC Safe set. The latter also individually holds `DEFAULT_ADMIN_ROLE` and `PAUSER_ROLE` on the legacy router.

## How uniBTC Works

- **Deposit assets:** the Ethereum Vault allowlist contains WBTC, FBTC, cbBTC, and Bedrock directBTC; directBTC has no remaining mint headroom. M-BTC is a reserve/input dependency on Merlin, not an Ethereum Vault deposit asset. uniBTC is routed separately by the bridge contracts.
- **Mint flow:** User deposits a permitted wrapped BTC asset into the Vault `mint` function and atomically receives uniBTC 1:1 in 8-decimal BTC units.
- **PoR gate:** `mint()` applies the `checkReserve` modifier: it reverts if the [Chainlink reserve feed](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) is older than `feederHeartbeat = 86,400s`, and compares reserves with the [uniBTC supply feeder](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716). The check is skipped entirely if either feeder address is zero or `adequacyRatio` is zero.
- **Adequacy ratio:** `adequacyRatio = 900`; `checkReserve` requires `supply * adequacyRatio / 1000 <= reserves`, so minting is permitted while PoR reserves are at least 90% of the feeder's supply value. This is not a strict 1:1 mint gate, and the feeder value is 700.93 uniBTC below the contemporaneous dashboard total; see Provability.
- **Ungated operator path:** `execute(target, data, value)` is restricted only to `OPERATOR_ROLE`, the service switch, and an allowlist of targets that includes the uniBTC token. Because the Vault itself holds `MINTER_ROLE`, any operator can make the Vault call `uniBTC.mint` without `checkReserve`, deposit transfer or caps; see Token Mint Authority.
- **Redeem flow:** the [live Ethereum router](https://etherscan.io/address/0xAA732c9c110A84d090a72da230eAe1E779f89246#readProxyContract) enforces **8 days + 1 second**, a **0.5% fee**, and a quota refilling at **2.00016 WBTC/day** with a **0.5 WBTC maximum available bucket**. Only WBTC is redeemable (`isBtclisted`). It is unpaused and its whitelist is disabled. After 30 days, `claimPrincipals` returns queued uniBTC, not BTC backing.
- **Custody:** Bedrock docs do not name the BTC custodian(s), signers, or full address-control model for the backing wallets monitored by Chainlink PoR.
- **Cross-chain:** Chainlink CCIP is the documented canonical bridge path (BurnMintTokenPool with 14 configured lanes). Onchain enumeration also found two additional live Ethereum mint paths: a Bedrock-custom `CCIPPeer` contract and a third-party **Free Tunnel** bridge that Bedrock's uniBTC bridge documentation does not mention. uniBTC is deployed across many chains; Ethereum is one slice of total supply.
- **Freeze authority:** The uniBTC token implements `FREEZER_ROLE` with a `frozenUsers` mapping and a `freezeToRecipient` address. The ops Safe holds `FREEZER_ROLE`, and `freezeToRecipient` is the EOA [`0x899c284A…`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f). `freezeUsers`, `unfreezeUsers` and `setFreezeToRecipient` emit no events. Token-level freezing of user balances is a governance-controlled loss/censorship path.

## Token Mint Authority

**Mint mechanism:** Role-gated AccessControl. `mint(address,uint256)` on the uniBTC token is `onlyRole(MINTER_ROLE)`; `burn`/`burnFrom` are standard permissionless holder burns. The role is not enumerable onchain, so holders were reconstructed from a full `RoleGranted`/`RoleRevoked` event scan on the token (26 events from deployment through block 25,981,132; the latest is a May 7, 2026 `MINTER_ROLE` [revocation](https://etherscan.io/tx/0xd1924fbac96059b2057151aa2830481137cbd065d486b289c2e9dc072cf47cf1)) and each current holder confirmed via `hasRole`.

**Mint requires backing:** No — at the token level any `MINTER_ROLE` holder can issue unbacked uniBTC. Backing checks live in the callers: the Vault `mint()` path is PoR-gated (to 90% adequacy), the Vault `execute()` path is not, and the bridge paths rely on burn/lock on the source chain.

**Current uniBTC token `MINTER_ROLE` holders on Ethereum (verified September 15, 2026; read on the [token contract](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568#readProxyContract), not on the holders):**

| Minter / Role Holder | Address | Notes |
|----------------------|---------|-------|
| uniBTC Vault | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | `mint()` is PoR-gated with `adequacyRatio = 900`. `execute()` lets five operator contracts invoke `uniBTC.mint` through the Vault with no reserve check. |
| Chainlink CCIP BurnMintTokenPool 1.5.1 | [`0x1689C22eD5435e49071CFc208D1Ac6F2A2274490`](https://etherscan.io/address/0x1689C22eD5435e49071CFc208D1Ac6F2A2274490) | Registered in the CCIP `TokenAdminRegistry` (`getPool(uniBTC)` verified). Burn/mint model — the CCIP message path can mint native uniBTC supply. `owner()` = Bedrock admin Safe (3/5). Inbound and outbound rate limits are enabled on all 14 configured lanes; sizes differ by lane. |
| Bedrock CCIPPeer | [`0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc`](https://etherscan.io/address/0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc) | Bedrock-custom CCIP messaging contract predating the token pool. Upgradeable proxy administered by the uniBTC ProxyAdmin (i.e. the 3/5 ops Safe). Source and destination allowlists are enabled only for BNB Chain and BOB among the pool's lanes; no messages in the 30 days to the snapshot. |
| Free Tunnel bridge | [`0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C`](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | Third-party Free Protocol bridge (`TunnelContract` behind `DelayedERC1967Proxy`, mint mode). Mints require 3-of-4 executor signatures; admin is EOA [`0x0014Eb4A…`](https://etherscan.io/address/0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C); `upgradeTunnel` installs only the hub's current implementation (version 20250105) and `upgradeToAndCall` is disabled; executor rotation has a built-in 36h–5d delay. No events in the 30 days to the snapshot. **Not mentioned in Bedrock's uniBTC bridge docs.** The same contract also holds `MINTER_ROLE` on Bedrock's brBTC. |

**Token admin / freeze authority:** the ops Safe [`0xC9dA980f…`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) (3/5) holds `DEFAULT_ADMIN_ROLE` (can grant `MINTER_ROLE` to any address with no timelock — an unbacked-mint escalation path) and `FREEZER_ROLE` (token-level user freezing; `freezeToRecipient` is EOA [`0x899c284A89E113056a72dC9ade5b60E80DD3c94f`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f)).

### Single-EOA mint path through the legacy router

**EOA:** [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef). It is the EIP-1967 proxy admin of the [legacy withdrawal router](https://etherscan.io/address/0xbb45b3a09bffc15747d1a331775fa408e587f38d). The Vault holds uniBTC token `MINTER_ROLE`, and the legacy router holds Vault `OPERATOR_ROLE`.

**Not exploitable through the current router code; exploitable after an upgrade that only this EOA can perform:**

- The current [router implementation](https://etherscan.io/address/0x6e542567d4744d648f6ab47ac80becd02e47ac09#code) calls `Vault.execute` in one place only, to `burnFrom` uniBTC during redemption claims. No function lets a caller choose the target or calldata. The router's `DEFAULT_ADMIN_ROLE` holder, ops Safe signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32), can change only router settings (token list, whitelist, day cap, delay), none of which mints.
- The router is a `TransparentUpgradeableProxy` whose admin slot holds [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) directly. There is no ProxyAdmin contract or Safe above it. That EOA alone can call `upgradeTo` at any time, with no delay, and install code that passes `uniBTC.mint` calldata to `Vault.execute`.
- Rechecked at block [25,990,808](https://etherscan.io/block/25990808): same admin (no code, nonce 29), same implementation, Vault `OPERATOR_ROLE` still held, uniBTC still an allowed target.
- Live-chain simulation (`eth_call`, no transaction sent) at block [25,990,834](https://etherscan.io/block/25990834): the admin has no code, so it is a private-key EOA rather than a contract. The proxy bytecode contains all transparent-proxy admin functions (stored as negated selector constants). `admin()` called by the EOA returns the EOA, and `upgradeTo` from the EOA succeeds while the same call from a random address reverts. `Vault.execute(uniBTC, mint(0x…dEaD, 100,000 uniBTC), 0)` succeeds with the router as sender and reverts with `AccessControl` from a random address.
- Closing the path: the ops Safe, as Vault `DEFAULT_ADMIN_ROLE`, can revoke the router's `OPERATOR_ROLE`; or the EOA can move the proxy admin to the Safe-owned ProxyAdmin.

Five contracts hold Vault `OPERATOR_ROLE`: BurnProxy, TransferProxy, FBTCProxy, the live router and the legacy router. The first four are owned by a Safe, non-upgradeable with fixed call patterns, or upgradeable only through the ops-Safe ProxyAdmin. The legacy router is different:

- [`0xbb45b3a0…`](https://etherscan.io/address/0xbb45b3a09bffc15747d1a331775fa408e587f38d) is a verified OpenZeppelin `TransparentUpgradeableProxy`. Its EIP-1967 admin slot is [`0x3eea50ba…`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), an address with no code and nonce 29.
- EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) [deployed the proxy](https://etherscan.io/tx/0xb7d6612425fd42030e638f78864c6764750de3c873cc52c24771463431207249) on September 20, 2024. The only `AdminChanged` event is the one at creation.
- The key is in active general use: its latest outgoing transaction was a [contract ownership transfer on August 10, 2026](https://etherscan.io/tx/0xec68b97d5ae2f8bf86e4968f151f4db0a7c1c809a843f77eebb6ee6aaa06fe65), and its history includes trading-order, bridge and token-transfer calls.
- The router has no remaining debt (`totalDebt = 0`) and no allowlisted redemption tokens, so its role serves no current redemption function.
- The Vault's `allowedTargetList` includes the uniBTC token, WBTC, cbBTC, FBTC, directBTC, the ops Safe and LockedFBTC [`0xd681C557…`](https://etherscan.io/address/0xd681C5574b7F4E387B608ed9AF5F5Fc88662b37c).
- **The path is not new.** The Vault received uniBTC `MINTER_ROLE` on [April 13, 2024](https://etherscan.io/tx/0x549c37e07be58e4c024c5e106a66eb974558f9fc7f78d90b8cbfb99c0df21a6d), the legacy router received Vault `OPERATOR_ROLE` on [September 20, 2024](https://etherscan.io/tx/0xeca14e82f7e0ab5f2b34c0b94e04d5ba59555a297acc1f94b08edd6011ce787b), and uniBTC became an allowed `execute` target in the [October 1, 2024](https://etherscan.io/tx/0x1004af1811924b9565096cf7eb5bd4ea3911d81e8413cd7347f66731d8b52cfa) post-exploit relaunch. It has existed since then, including at the August 10, 2026 assessment, which enumerated direct token minters but not Vault operators or their upgrade authority.

The PoR limit (`feederSupply * 0.9 <= Chainlink reserves`) is the `checkReserve` modifier on Vault `mint()` only; neither `uniBTC.mint` (plain `onlyRole(MINTER_ROLE)`) nor `Vault.execute` applies it. Local anvil forks at the snapshot block confirmed the path end to end:

- Impersonating EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), `upgradeTo` on the legacy router succeeded; the same upgrade from an unrelated address failed.
- From the router, `Vault.execute(uniBTC, mint(0x…dEaD, 100,000 uniBTC), 0)` succeeded and raised Ethereum supply from 2,981.12556288 to 102,981.12556288 uniBTC — about 21 times the 4,640.52 BTC Chainlink reserves, far above the ~5,156 uniBTC the 0.9 check would permit.
- Control: after setting the supply feeder to 100,000 uniBTC so the check fails, a WBTC deposit through `Vault.mint()` reverted with `SYS013`, while the same `execute` mint still succeeded.

A compromise or misuse of EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) can therefore mint arbitrary unbacked uniBTC on Ethereum and transfer the Vault's allowlisted assets, with no multisig, timelock, PoR check or cap. The dilution would affect every uniBTC holder and every venue accepting uniBTC, and bridged supply could propagate it within CCIP rate limits. Revoking the legacy router's Vault `OPERATOR_ROLE` (ops Safe as Vault admin) or moving its proxy admin to the ops-Safe ProxyAdmin would close this path.

**Observed minting (30 days to the snapshot, blocks 25,765,132–25,981,132):** 73 uniBTC mints. The CCIP pool minted 3.00640757 uniBTC across 71 transfers (largest [1.31983465](https://etherscan.io/tx/0x01801d25d8e95970aa68461415fbfbc93372e09da5d230b9da5a9af351f77846)); the Vault minted 0.06402319 uniBTC across two FBTC deposits, each with a Vault `Minted` event. CCIPPeer and Free Tunnel minted nothing. No mint was attributable to any other address.

**Historical grants (from the event scan):** several temporary `MINTER_ROLE` grants have been made and revoked over the token's life, including grant-mint-revoke same-block patterns by the ops Safe and two temporary grants to the operational EOA [`0x9251Fd3D…`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) (revoked). This is evidence of manual, admin-driven supply operations outside the vault path.

**Rate limits / supply caps:** none at the token level. CCIP pool lanes, identical inbound and outbound:

| Bucket | Lanes | Refill |
|--------|-------|--------|
| 2 uniBTC | Arbitrum One | 231,428 sats/s (199.953792 uniBTC/day) |
| 2 uniBTC | Optimism, Mantle | 11,574 sats/s (~10 uniBTC/day) |
| 2 uniBTC | BNB Chain, Berachain, Base, Aptos | 2,315 sats/s (~2 uniBTC/day) |
| 2 uniBTC | Solana | 232 sats/s (~0.2 uniBTC/day) |
| 0.5 uniBTC | BOB | 2,315 sats/s (~2 uniBTC/day) |
| 2 satoshis | Unichain, B², X Layer, Ink, HyperEVM | 1 sat/s (effectively closed) |

These are lane-specific throttles, not an aggregate supply bound. Pool `getRateLimitAdmin()` is the [operational EOA](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab), which can reconfigure them. Chain names are from Chainlink's [chain-selectors registry](https://github.com/smartcontractkit/chain-selectors). Free Tunnel and complete CCIPPeer lane limits remain TODO.

**Non-Ethereum deployments:** complete mint/burn authority enumeration for every non-Ethereum uniBTC deployment (30+ chains) remains TODO.

## Audits and Due Diligence Disclosures

| Scope | Firm | Date | Link |
|-------|------|------|------|
| uniBTC | BlockSec | Jun 12, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/code%20audit%20blocksec.pdf) |
| uniBTC | PeckShield | Oct 1, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/PeckShield-Audit-Report-uniBTC-v1.0.pdf) |
| uniBTC | BlockSec | Oct 30, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/blocksec_bedrock_unibtc_v1.0-signed.pdf) |

The October 2024 audits are post-exploit re-engagements covering the patched uniBTC vault. BlockSec also published a [November 15, 2024 v1.1 revision](https://github.com/Bedrock-Technology/uniBTC/blob/main/blocksec_bedrock_unibtc_v1.1-signed.pdf), reviewing a redeem-logic update and the `contracts/contracts/` and `ccip/` scope. This is a revision of the October engagement, not a fourth independent audit. The [current audit index](https://docs.bedrock.technology/security/audit-reports) (rechecked September 15, 2026) additionally lists May 6 and June 18, 2026 PeckShield reports for **cuniBTC** and **cuniBTC-SymbioticProxy**; those scopes do not establish a re-audit of the live uniBTC Vault, reporting inputs, operator contracts, or reserve custody. The three core uniBTC engagements and the v1.1 revision are from 2024; no later review establishing coverage of the complete live uniBTC trust boundary was found. No top-tier audit engagement (Trail of Bits, OpenZeppelin, ChainSecurity, Spearbit, Cantina) was found for uniBTC.

The age of the reviews matters for two reasons. First, an audit is point-in-time evidence: it only supports the code, configuration, assumptions, and dependencies that were in scope when the work was performed. Even if the core vault bytecode remains unchanged, uniBTC's current security depends on live governance configuration, PoR inputs, operator contracts, cross-chain deployments, custody and Babylon operations, and the material M-BTC/Merlin exposure described below.

### Bug Bounty

- **No public Immunefi / Cantina / Sherlock / Code4rena bug bounty program found.**
- **No SEAL Safe Harbor**

## Historical Track Record

- **Time in production:** uniBTC launched in 2024; DeFiLlama first records Bedrock uniBTC on Oct 29, 2024.
- **TVL (DeFiLlama, September 15, 2026):** [Bedrock uniBTC](https://defillama.com/protocol/bedrock-unibtc) reported **$357.92M**. Major slices: Bitcoin $132.75M, Ethereum $99.51M, Merlin $74.67M, BOB $31.00M, BNB Chain $19.14M. The earliest daily observation in the 30-day window was $292.95M (August 18): **+22.18%**, with a $236.32M–$385.90M range. TVL is USD-valued collateral, not token supply.
- **Peak TVL:** Bedrock uniBTC peaked at **$638.3M** on July 15, 2025.
- **Minimum after launch:** $109.4M on Nov 2, 2024, shortly after the Sept 2024 exploit.
- **Ethereum total supply:** **2,981.12556288 uniBTC** (`298,112,556,288` sats) at the snapshot.
- **Supply and reserves:** [Chainlink PoR](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2#readContract) reports **4,640.515622996713140279 BTC**, updated September 14 at 19:58:09 UTC, 38,534 seconds before the block (within the 86,400-second heartbeat). The reserve ratio depends on which supply figure is used:

  | Supply figure | uniBTC | Chainlink reserves ÷ supply |
  |---|---|---|
  | Ethereum uniBTC `totalSupply()` only | 2,981.12556288 | ~155.7% |
  | [Vault supply feeder](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716#readProxyContract) `totalTokenSupply()` (what the Vault checks) | 3,845.74449304 | 120.67% |
  | [Bedrock reserve API](https://affiliate-api-eosin.vercel.app/api/v1/third/stats/unibtc) `total_supply`, sum of 20 chains | 4,546.67793 | **102.06%** |

  The supply feeder is meant to hold global supply, not Ethereum supply. It matched the all-chain total until the September 13 update and is now 700.93 uniBTC short (see Provability). The **~102% all-chain ratio is the meaningful coverage figure**; 120.67% comes only from the feeder's missing supply. The API's own reserves are 4,639.417015 BTC (102.04% of its supply). Per-chain supplies are Bedrock-reported and were not verified onchain, and double counting through lock-mode bridges on other chains was not ruled out, so neither ratio proves complete liabilities.

### Security Incident: September 27, 2024 - uniBTC Mint Exploit

- **Loss:** approximately $2M, reported as roughly 649.6 WETH by public incident analyses.
- **Root cause:** The uniBTC Vault mint flow did not properly validate the deposit asset's price/decimals against the uniBTC issuance rate. Public analyses describe an attacker depositing WETH and receiving uniBTC 1:1, then swapping uniBTC for WETH.
- **Affected contract:** uniBTC Vault [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da), the same proxy address still in use after the patch.
- **Exploiter:** EOA [`0x2bFB373017349820dda2Da8230E6b66739BE9F96`](https://etherscan.io/address/0x2bFB373017349820dda2Da8230E6b66739BE9F96).
- **Response:** Bedrock paused the vault, upgraded the implementation, added Chainlink Proof-of-Reserve / Secure Mint checks, and re-audited with PeckShield and BlockSec in October 2024. Fuzzland publicly took responsibility because the attacker was reportedly a Fuzzland ex-employee; Fuzzland reimbursed Bedrock with company funds ([Cointelegraph, June 2025](https://cointelegraph.com/news/fuzzland-ex-employee-bedrock-unibtc-exploit); [Cryptonews](https://cryptonews.com/news/ex-employee-hacks-bedrock-unibtc-for-2m-fuzzland-uncovers-insider-exploit/)).

The exploit occurred on the same vault proxy that remains in production. Post-exploit controls are materially stronger on `mint()`, but the Vault's `execute()` path and its operator set are outside that gate, and future upgrade or validation mistakes remain a high-impact path because there is no onchain timelock.

## Funds Management

### Accessibility

| Token | Mint | Redeem | Fees | Permissioning |
|-------|------|--------|------|---------------|
| uniBTC | Atomic, subject to PoR and per-asset headroom | 8 days + 1 second, WBTC only | 0.5% fee; ~2 WBTC/day refill; 0.5 WBTC quota bucket | Whitelist disabled; blacklist and pause controls remain |

### Collateralization

- uniBTC is intended to be backed 1:1 by wrapped BTC assets and native/restaked BTC positions.
- The cross-chain product accepts wrapped BTC inputs; the Ethereum allowlist is WBTC, FBTC, cbBTC and directBTC, while M-BTC is a Merlin dependency. Counterparty quality is mixed: WBTC and cbBTC are more established; FBTC and M-BTC are newer issuer/custody dependencies.
- Dashboard reserves equal ≈102.04% of dashboard supply; the Vault instead compares Chainlink reserves to a lower, operator-reported supply value. Its nominal 90% requirement therefore does not establish 90% coverage of complete global liabilities.
- The Ethereum Vault holds 0.46065725 WBTC, 0.06802893 FBTC, 0.00315141 cbBTC and 1,458.9998 directBTC; the ops Safe holds 0.01 WBTC. The majority of backing sits outside the Ethereum vault contract, including native BTC/restaking/custody arrangements monitored through PoR.

#### Ethereum deposit limits and redemption liquidity

[Vault allowlist getters](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da#readProxyContract) give the following 8-decimal BTC-unit values at the snapshot. Headroom is cap minus `supplyFeeder.totalSupply(token)`, not a measure of independently available backing.

| Asset | Cap (BTC units) | Feeder usage | Remaining headroom |
|-------|-----------------|--------------|--------------------|
| [WBTC](https://etherscan.io/address/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | 50 | 0.46065725 | 49.53934275 |
| [cbBTC](https://etherscan.io/address/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf) | 50 | 0.00315141 | 49.99684859 |
| [FBTC](https://etherscan.io/address/0xC96dE26018A54D51c097160568752c4E3BD6C364) | 1,300 | 1,283.74292562 | 16.25707438 |
| [Bedrock directBTC](https://etherscan.io/address/0xA700992A9815d3bfECEDfE51B030fD294Bc0b090) | 1,458.9998 | 1,458.9998 | 0; mint capacity exhausted |

All four are allowlisted and individually unpaused. directBTC is an internal accounting token; it must not be counted as additional independent Bitcoin backing.

#### M-BTC / Merlin concentration

The [Bedrock reserve API](https://affiliate-api-eosin.vercel.app/api/v1/third/stats/unibtc) reports **990.8738333 M-BTC**, or **21.36%** of **4,639.417015 BTC** in total reserves. Native BTC across 44 published addresses represents **3,647.635638 BTC (78.62%)**; all other wrapped/L2 BTC balances together are about **0.91 BTC (0.02%)**. These are dashboard classifications, not an independent reconciliation of Babylon positions or encumbrances. The published Merlin reserve address [`0xF977…AB18`](https://scan.merlinchain.io/address/0xF9775085d726E782E83585033B58606f7731AB18) is the [second-largest M-BTC holder](https://scan.merlinchain.io/token/0xB880fd278198bd590252621d4CD071b1842E9Bcd), with **17.39%** of 5,697.45 M-BTC supply on September 15, 2026.

M-BTC is not native BTC; Merlin documents it as a receipt minted against Bitcoin Layer 1 assets deposited through Merlin's bridge. This adds Merlin bridge custody, relayer, chain-liveness, and redemption risk beneath uniBTC. Merlin launched mainnet in February 2024 and M-BTC claims opened in March 2024, so the product is no longer brand new but remains materially younger and less trust-minimized than established wrapped-BTC rails. Merlin's official bridge documentation states that the bridge is upgradeable, multisig-managed, and has **no timelock**. Merlin's data-availability documentation also describes public DA as a "coming" solution, while the current design relies on its oracle/DAC layer and offchain proof-verification machinery rather than Bitcoin enforcing the full L2 state transition.

### Provability

uniBTC has materially better reserve provability than brBTC because a Chainlink PoR feed is wired directly into the uniBTC Vault mint path. The Bedrock dashboard also exposes the constituent native-BTC addresses and wrapped-token reserve addresses; it is more than an unlinked aggregate chart. However, the supply denominator is an independent privileged input. [Verified `uniBTCRate` source](https://etherscan.io/address/0xf50dbaf3d057164fc79c1aa435ffa011c6bcdae9#code) lets its operators write `totalTokenSupply` and `totalReserve` directly through `update()`; it does not aggregate chains onchain. The Vault uses only `totalTokenSupply` and checks no freshness or completeness for it.

The feeder's history makes the current discrepancy a recurring reporting fault rather than a one-off:

- **Cadence:** 653 `Updated` events since October 15, 2024, normally daily at about 07:50 UTC (median gap 24.0h; 90-day maximum 40.5h). All of the last 40 were sent by the [second updater](https://etherscan.io/address/0x2c62803181243fa99c659de0d2a0530879a79911).
- **One-day dips:** on April 30, May 16, May 19, June 24, July 17, July 23 and August 23, 2026, `totalTokenSupply` fell by roughly 640–680 uniBTC and was restored by the next daily update (for example [down](https://etherscan.io/tx/0xccfef805061d55f358855abaebc135e566c7ff828dcd08bbe3c34f75d4391b47) on August 23 and [restored](https://etherscan.io/tx/0x6b4157f33036faf1a77c2de1667b925e8eb8974b39d006947afe83ced6a46a82) on August 24).
- **Current dip:** the September 13 [update](https://etherscan.io/tx/0xb8863ddf91d75d7be2feaf66f69a2e91ca531189768b5cef449803097ff8c1a5) lowered supply from 4,547.45892811 to 3,845.74449305 and `totalReserve` from 4,640.42301174 to 3,961.11682784. The September 14 [update](https://etherscan.io/tx/0xeabbb96fd1842029c9c3bcf437a5470e9b9b28e86e4df5cc668b6dfe104644b6) repeated the lower values. This is the first dip in the scanned history to persist through two updates.
- **Size:** the 700.93 uniBTC gap to the dashboard is close to the API's BOB supply (701.5560332 uniBTC). That is consistent with one chain's supply dropping out of the reporting job, but Bedrock has not disclosed the cause. TODO: confirm with Bedrock or independent BOB supply data.

During a dip the Vault's reserve check is looser: at 90% adequacy against Chainlink reserves it would admit up to about 1,310 uniBTC of feeder-reported supply growth, versus about 609 uniBTC against dashboard supply. Vault mints still require a 1:1 allowlisted deposit and cap headroom, so this weakens the reserve safeguard rather than creating unbacked supply by itself. Both published ratios exceed 100%, but neither establishes complete global liabilities.

Address visibility also does not prove the full operational state:

- The feed depends on a Bedrock-supplied address set.
- PoR validates balances, not legal ownership, private-key control, liabilities, encumbrances, or the ability to redeem those assets promptly.
- The Vault requires 90% of its operator-reported supply input; completeness of that denominator is unresolved.
- Approximately 21.36% of dashboard reserves are M-BTC, so proving that Bedrock holds the token does not independently prove the corresponding Bitcoin remains available behind Merlin's bridge.

## Liquidity Risk

- **Primary exit:** the [Ethereum router](https://etherscan.io/address/0xAA732c9c110A84d090a72da230eAe1E779f89246#readProxyContract) has an 8-day-plus-1-second delay, 0.5% fee, ~2 WBTC/day quota refill, and 0.5 WBTC maximum available quota. BTC settlement depends on Vault replenishment; 30-day usage was 17 requests totalling 0.33 WBTC.
- **Indicative exits:** [CoW Protocol quote API](https://api.cow.fi/mainnet/api/v1/quote) responses into WBTC returned **0.99253745 WBTC for 1 uniBTC** (0.75% below parity), **11.02803585 WBTC for 13 uniBTC (~$1M)** (15.17% below) and **11.02805981 WBTC for 65 uniBTC (~$5M)** (83.03% below). Quote IDs are in the snapshot evidence. These were unsigned, expiring indications, not executed swaps or guaranteed future fills. Aggregated onchain depth is roughly 11 WBTC; large exits remain severely constrained.
- **Downstream integration:** brBTC accepts uniBTC as an input asset. Stress in brBTC may create uniBTC flow pressure, and stress in uniBTC directly affects brBTC when uniBTC is used as backing.

## Centralization & Control Risks

### Governance

- uniBTC token and uniBTC Vault are upgradeable transparent proxies.
- The uniBTC ops Safe is 3-of-5 and owns the ProxyAdmin.
- The same Safe holds `DEFAULT_ADMIN_ROLE` on the uniBTC Vault.
- No Safe Guard or Delay module is configured on either Safe (verified September 15, 2026). A 3-of-5 signature can therefore upgrade implementations, grant uniBTC token `MINTER_ROLE`, or freeze user balances without an onchain delay.
- The ops Safe additionally holds `DEFAULT_ADMIN_ROLE` and `FREEZER_ROLE` on the uniBTC token itself: it can grant mint authority to any address and freeze arbitrary user balances, with `freezeToRecipient` set to EOA [`0x899c284A89E113056a72dC9ade5b60E80DD3c94f`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f).
- **A single EOA can mint unbacked uniBTC.** The legacy router's proxy admin, EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), can upgrade a contract holding Vault `OPERATOR_ROLE` and mint through `Vault.execute`, bypassing both the Safe and the PoR gate (fork-verified; see Token Mint Authority).
- Two bridge contracts and one Bedrock messaging contract hold live `MINTER_ROLE` (CCIP token pool, CCIPPeer, Free Tunnel); the Free Tunnel path is absent from Bedrock's public documentation.
- Signer overlap across Bedrock Safes weakens practical separation between product lines.

### Delegated control paths

Full role-event reconstruction and `hasRole` confirmation establish the following additional authorities. All listed AccessControl roles are governed by their contract's `DEFAULT_ADMIN_ROLE`.

| Contract / role | Holders | Effective control |
|-----------------|---------|-------------------|
| Vault `DEFAULT_ADMIN_ROLE` | Ops Safe | Token/target allowlists, caps, asset feeder, and operator role grants and revocations |
| Vault `MANAGER_ROLE` | [Operational EOA](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) | Changes reserve/supply feeder addresses, heartbeat and adequacy ratio without a Safe transaction |
| Vault `PAUSER_ROLE` | Six EOAs: [`0x0961…47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3), [`0x9251…5aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab), [`0xaa0b…e034`](https://etherscan.io/address/0xaa0b7c44eaa5ed1cf811b35ddd11875576ace034), [`0xae4a…2973`](https://etherscan.io/address/0xae4a2ffeed8eeda4698bbf4a36f01d1f86602973), [`0xeea6…761f`](https://etherscan.io/address/0xeea6f790f18563e91b18df00b89d9f79b2e6761f), [`0xf6a4…8615`](https://etherscan.io/address/0xf6a43475cffb2a05cf2b8d0d930abc3e1fe08615) | Stops service or pauses individual assets; includes the operational EOA and an ops Safe signer |
| Vault `OPERATOR_ROLE` | Five contracts | [BurnProxy](https://etherscan.io/address/0x4519c8e32b080a778f2ae188d5fdcd98175f0caf), [FBTCProxy](https://etherscan.io/address/0xa3a30f627dbc02aff3c0a736a065443a0e85b1ae), [live withdrawal router](https://etherscan.io/address/0xaa732c9c110a84d090a72da230eae1e779f89246), [legacy withdrawal router](https://etherscan.io/address/0xbb45b3a09bffc15747d1a331775fa408e587f38d), and [TransferProxy](https://etherscan.io/address/0xf0ab759d3a1a4956e8c3c52c71ccb50f20bc342b) call `execute` on allowed targets, including uniBTC |
| Legacy router proxy admin | EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) | Replaces the legacy router implementation at will; through its Vault operator role, mints uniBTC and moves allowlisted Vault assets |
| Supply feeder admin / operators | Operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) administers; it and [second updater](https://etherscan.io/address/0x2c62803181243fa99c659de0d2a0530879a79911) hold `OPERATOR_ROLE` | Directly writes the PoR comparison's supply denominator; proxy admin slot is EOA [`0x899c284A89E113056a72dC9ade5b60E80DD3c94f`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f), outside the ops Safe ProxyAdmin |
| CCIP pool rate-limit admin | Operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) | Reconfigures per-lane throttles |
| CCIPPeer admin / pauser | Admin Safe / operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) | Configures accepted source peers / pauses messages; proxy upgrades remain with ops Safe |
| Live withdrawal router admin / pauser | Ops Safe / operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) | Changes fees, delays, quotas and permission lists / pauses redemptions |

The admin Safe owns both BurnProxy and TransferProxy. TransferProxy can move allowlisted Vault assets to its immutable recipient, the ops Safe; it is not a user redemption queue. FBTCProxy can only issue LockedFBTC mint/redeem calls through the Vault. Legacy router `DEFAULT_ADMIN_ROLE` and `PAUSER_ROLE` are held by an individual ops Safe signer.

### Programmability

`mint()` is programmatic and PoR-gated, which is a major strength relative to opaque custody wrappers. The gate combines Chainlink reserves with a manually updated supply denominator that is currently 700.93 uniBTC below the dashboard and has repeatedly dropped by a similar amount for a day. The Vault's operator `execute()` path sits outside the gate. Upgradeability, control by operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) over reporting and adequacy parameters, role-controlled outflows, and the explicit 90% threshold materially limit this assurance.

### External Dependencies

| Dependency | Used by uniBTC | Criticality |
|-----------|----------------|-------------|
| Chainlink PoR feed | Mint reserve gate | High - stale data halts `mint()`; wrong data can weaken mint safety |
| Chainlink CCIP | Cross-chain routing - BurnMintTokenPool + CCIPPeer both hold `MINTER_ROLE`; 14 lanes, per-lane rate limits enabled | High - bridge security affects multi-chain supply/peg, partially mitigated by rate limits |
| Free Tunnel (Free Protocol) | Cross-chain routing - bridge contract holds `MINTER_ROLE`, undocumented in Bedrock docs | High - third-party bridge with mint rights; 3-of-4 executor signatures, EOA admin [`0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C`](https://etherscan.io/address/0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C), hub-supplied upgrades |
| WBTC / FBTC / cbBTC | Accepted deposit assets | High - issuer/custody risk |
| M-BTC / Merlin bridge | ~21.36% of dashboard reserves on September 15, 2026 | High - bridge custody, relayer, upgrade, no-timelock, chain-liveness and redemption risk |
| Bitcoin network / native BTC custody | Backing assets | Critical |
| Babylon Labs / BTC restaking venues | Yield / restaking exposure | High |
| Undisclosed custody/signing setup | BTC backing control | Critical unknown |

## Operational Risk

- **Team transparency:** Bedrock/RockX leadership is public. Zhuling Chen is CEO of Bedrock and RockX; Alex Lam is a RockX co-founder.
- **Legal structure:** Per Bedrock [Terms of Use](https://docs.bedrock.technology/legal/terms-of-use.md), the website and protocol are operated by **Golden Bull Enterprises Limited**, formed under the laws of the **British Virgin Islands**.
- **Documentation:** Public docs cover minting, unstaking, audits, and PoR at a high level. Custodian identity, full signing model, operator contracts, supply-reporting methodology, and restitution txs remain undisclosed.
- **Incident handling:** The Sept 2024 response was credible (pause, patch, re-audit, PoR hardening, users made whole through Fuzzland reimbursement), but the incident remains a meaningful historical risk marker because it affected the same vault proxy still in production.
- **Key hygiene:** deployer EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), used for unrelated transactions, has kept upgrade authority over a Vault operator for about two years after the router was superseded, and EOA [`0x899c284A89E113056a72dC9ade5b60E80DD3c94f`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f) remains proxy admin of the supply feeder.

## Monitoring

### Critical — page immediately

| Signal | Source / detection | Baseline | Alert when |
|--------|--------------------|----------|------------|
| Legacy router upgrade or admin use | `Upgraded(address)` / `AdminChanged(address,address)` on [legacy router](https://etherscan.io/address/0xbb45b3a09bffc15747d1a331775fa408e587f38d); EIP-1967 implementation slot; any transaction sent by admin EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) | Implementation `0x6e542567d4744d648f6ab47ac80becd02e47ac09`; no `AdminChanged` since creation; last admin tx Aug 10, 2026 | Any event, implementation change, or admin-EOA transaction |
| Mint outside the reserve gate | uniBTC `Transfer(from = 0x0)` where the [Vault](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) is the caller but the transaction has no Vault `Minted(address,uint256)` event (i.e. `execute()` path) | 2 Vault mints in 30 days, both with `Minted` | Any occurrence |
| Unknown minter | uniBTC `Transfer(from = 0x0)` not accompanied by an event from the Vault, [CCIP pool](https://etherscan.io/address/0x1689C22eD5435e49071CFc208D1Ac6F2A2274490), [CCIPPeer](https://etherscan.io/address/0x55a67cf07b8a9A09FB6D565279287cfE4Ab60eDc) or [Free Tunnel](https://etherscan.io/address/0x70aF4743F85E5E74E3b6dDFa38926c0a762Ad21C) | 73 mints in 30 days, all attributed | Any occurrence |
| Token role change | `RoleGranted` / `RoleRevoked` on [uniBTC](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568) for `MINTER_ROLE`, `DEFAULT_ADMIN_ROLE`, `FREEZER_ROLE` | 4 minters; last event May 7, 2026 | Any event |
| Vault operator or manager change | `RoleGranted` / `RoleRevoked` on the Vault for `OPERATOR_ROLE`, `MANAGER_ROLE`, `DEFAULT_ADMIN_ROLE`; `TargetAllowed` / `TokenAllowed` | 5 operators; 7 allowed targets; no config events in 30 days | Any grant or allow event (a legacy router `OPERATOR_ROLE` revocation is a positive reassessment trigger) |
| Reserve gate parameters | Vault `AdequacyRatioSet`, `PoRFeederSet`, `StopService`, `Paused`; `adequacyRatio()`, `chainlinkReserveFeeder()`, `uniBTCSupplyFeeder()`, `feederHeartbeat()` | 900; feeders `0xc590D9fb…` / `0xE542919E…`; 86,400s | Any event; ratio below 900 or zero; either feeder changed or zero |
| Upgrades of core proxies | `Upgraded` on uniBTC, Vault, CCIPPeer, live router, [supply feeder](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716), [asset feeder](https://etherscan.io/address/0x94C7F81E3B0458daa721Ca5E29F6cEd05CCCE2B3), [directBTC](https://etherscan.io/address/0xA700992A9815d3bfECEDfE51B030fD294Bc0b090) and Free Tunnel; `OwnershipTransferred` on the [ProxyAdmin](https://etherscan.io/address/0x029E4FbDAa31DE075dD74B2238222A08233978f6); `AdminChanged` on the supply feeder | Implementations listed in the evidence; ProxyAdmin owner unchanged since May 22, 2024 | Any event |
| Reserves below supply | Chainlink [PoR](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) `latestRoundData().answer` vs [reserve API](https://affiliate-api-eosin.vercel.app/api/v1/third/stats/unibtc) `total_supply` (and per-chain `totalSupply()` where RPCs exist) | 4,640.515623 BTC / 4,546.67793 uniBTC = 102.06% | Ratio < 100% (critical); < 101% (high) |
| Governance Safes | `AddedOwner`, `RemovedOwner`, `ChangedThreshold`, `ChangedGuard`, `EnabledModule` on the [ops Safe](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) and [admin Safe](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A) | 3/5 each; no guard or modules | Any event |

### High — alert within the hour

| Signal | Source / detection | Baseline | Alert when |
|--------|--------------------|----------|------------|
| Supply feeder integrity | Supply feeder `Updated(totalReserve, totalTokenSupply)`; compare with reserve API `total_supply` | 3,845.74449304 vs 4,546.67793 (15.42% gap, active since Sep 13); daily ~07:50 UTC | Gap > 2% (currently firing); day-over-day change > 5%; no update for 48h; feeder `RoleGranted` / `RoleRevoked` |
| PoR staleness | PoR `updatedAt` age | 38,534s | Age > 86,400s (Vault `mint()` reverts `SYS013`); answer moves > 2% in one round |
| Ops Safe activity and freezes | Ops Safe `ExecutionSuccess`, decoded; calls to uniBTC `freezeUsers` / `unfreezeUsers` / `setFreezeToRecipient` (no token events, so decode Safe calldata); poll `freezeToRecipient()` | No ops Safe tx in 30 days; nonce 101; recipient `0x899c284A…` | Any ops Safe execution (decode target and selector); any freeze call; recipient change |
| CCIP inbound mint volume | CCIP pool `Minted` and `TokensConsumed` by lane | 71 mints / 3.00640757 uniBTC in 30 days; largest 1.31983465 | > 2 uniBTC minted in 24h; any lane bucket exhausted |
| CCIP configuration | Pool `ChainConfigured`, `ChainRemoved`, `ChainRateLimiterConfigUpdated`, `RateLimitAdminSet`, `OwnershipTransferred`; [TokenAdminRegistry](https://etherscan.io/address/0xb22764f98dD05c789929716D677382Df22C05Cb6) `getPool(uniBTC)` and administrator | 14 lanes; limits in Token Mint Authority | Any event; pool or administrator change; any 2-satoshi lane raised |
| Dormant mint bridges | CCIPPeer `MessageExecuted`, `SysSignerChange`, allowlist changes; Free Tunnel `TokenMintExecuted`, `AdminTransferred`, `Upgraded`; poll `getActiveExecutors()` and hub `currentTBMVersion()` | No CCIPPeer or Tunnel events in 30 days; 4 executors, threshold 3; version 20250105 | Any mint or configuration event; executor or hub version change |
| Vault asset outflows | WBTC / FBTC / cbBTC / directBTC `Transfer(from = Vault)` | 20 WBTC outflows (0.27122798), all router claims; no FBTC, cbBTC or directBTC outflows | Any non-WBTC outflow; any WBTC outflow without a router `DelayedRedeemsClaimed` in the same tx |
| Redemption solvency | Router `tokenDebts(WBTC)` uncleared minus immature requests (from `DelayedRedeemCreated` timestamps) vs Vault WBTC `balanceOf` | 0.75152598 uncleared; ~0.4916 matured; 0.46065725 in Vault | Matured debt > Vault WBTC for > 24h; a matured claim reverts |
| Redemption controls | Router `Paused`, `TokensPaused`, `RateSet`, `MaxQuotaSet`, `RedeemDelaySet`, `RedeemFeeRateSet`, `BlacklistAdded`, `WhitelistEnabledSet`, `BtclistRemoved` | Unpaused; 0.5 WBTC max quota; 2,315 sats/s; 691,201s delay; 50 bps fee | Any event |

### Recommended Frequency

| Category | Frequency |
|----------|-----------|
| Legacy router, unknown/ungated mints, role and upgrade events | Real-time |
| Reserve gate parameters, Safe owner/threshold changes | Real-time |
| PoR vs supply ratio, PoR staleness | Hourly |
| Supply feeder update and gap | After each daily update (~08:00 UTC) plus a 48h staleness check |
| CCIP/Tunnel/CCIPPeer mint volume and configuration | Real-time events; daily volume roll-up |
| Redemption solvency and router configuration | Hourly |
| M-BTC share, reserve address set, peg, depth, caps, TVL | Daily |

## Appendix: Contract Architecture

```
Governance Layer
================
uniBTC Ops Safe 0xC9dA980f... (3/5)
  |-- owns ProxyAdmin 0x029e4fbd...
  |     |-- admin --> uniBTC token 0x004E9C...
  |     |-- admin --> uniBTC Vault 0x047D41...
  |     `-- admin --> CCIPPeer, live router, asset feeder, directBTC
  `-- DEFAULT_ADMIN_ROLE --> uniBTC Vault, uniBTC token, live router
Bedrock Admin Safe 0xAeE01705... (3/5)
  `-- owns CCIP pool, BurnProxy, TransferProxy
EOAs
  |-- 0x3eea50ba... proxy admin --> legacy router (Vault OPERATOR_ROLE)
  |-- 0x899c284A... proxy admin --> supply feeder
  `-- 0x9251fd3D... Vault MANAGER, feeder operator, CCIP rate-limit admin

Token / Vault Layer
===================
uniBTC token 0x004E9C...0568
  |-- MINTER_ROLE: uniBTC Vault 0x047D41...D6Da
  |     |-- mint(): WBTC / FBTC / cbBTC / directBTC (cap exhausted)
  |     |     |-- checks Chainlink PoR 0xc590D9fb...
  |     |     `-- checks supply feeder 0xE542919E... (operator-written)
  |     `-- execute(): 5 operators, targets incl. uniBTC (no PoR check)
  |           `-- legacy router 0xbb45b3a0... <-- upgradeable by EOA 0x3eea50ba...
  |-- MINTER_ROLE: CCIP BurnMintTokenPool 0x1689C2... (owner: Bedrock admin Safe; 14 rate-limited lanes)
  |-- MINTER_ROLE: Bedrock CCIPPeer 0x55a67c... (proxy under ops-Safe ProxyAdmin)
  |-- MINTER_ROLE: Free Tunnel bridge 0x70aF47... (3/4 executors, EOA admin, hub-supplied upgrades, undocumented)
  `-- FREEZER_ROLE + DEFAULT_ADMIN_ROLE: ops Safe 0xC9dA98... (freeze users; grant minters; no timelock)
```

---

## Risk Summary

### Key Strengths

1. **Chainlink PoR is wired into the Vault `mint()` path.** Deposit minting is not purely admin-attested; the Vault checks public reserve data and reverts on a stale feed.
2. **Three uniBTC-specific audits** including two post-exploit re-audits.
3. **Verified source; core token, Vault and ProxyAdmin governed by 3-of-5 Safes** with unchanged owner sets (verified onchain September 15, 2026).
4. **Large ecosystem scale** with $357.92M DeFiLlama uniBTC TVL; the dashboard reports ≈102.04% reserve coverage, subject to unresolved supply reconciliation.
5. **CCIP mint path has inbound and outbound throttles** on all 14 lanes, five of them effectively closed; CCIPPeer and Free Tunnel have been dormant for 30 days.
6. **Public team and known legal entity** via Bedrock/RockX leadership and Bedrock Terms of Use.

### Key Risks

1. **A single EOA can mint unbacked uniBTC.** The legacy router's proxy admin, EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), can upgrade it and use its Vault `OPERATOR_ROLE` to call `uniBTC.mint` through `Vault.execute`, bypassing the Safe, PoR gate and caps (fork-verified).
2. **Prior exploit on the same vault proxy.** The Sept 2024 mint-validation exploit occurred on the uniBTC Vault still in use.
3. **Audit coverage is dated.** All published uniBTC audits were completed in 2024, two reactively after the exploit. They do not establish coverage of today's full dependency and operational trust boundary, and they predate current AI-assisted and automated exploit-validation capabilities; no current independent review or public bug bounty was found.
4. **Supply reporting is manual and unreliable.** The Vault denominator is 700.93 uniBTC below dashboard supply; the feeder has dropped by a similar amount for a day eight times since April 2026, and the current dip has persisted through two updates.
5. **Material M-BTC concentration.** About 21.36% of reported reserves are M-BTC, adding Merlin bridge/custody and chain-liveness risk beneath uniBTC.
6. **PoR is not a strict 1:1 mint gate.** `adequacyRatio = 900` permits minting while reserves are at least 90% of the feeder's supply value, and operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) (Vault `MANAGER_ROLE`) can change the ratio and feeders.
7. **No timelock.** The 3-of-5 Safe can upgrade token/vault implementations, grant `MINTER_ROLE`, or freeze user balances without onchain delay.
8. **Undocumented third-party bridge holds mint authority.** The Free Tunnel contract can mint uniBTC (3-of-4 executor signatures, EOA admin [`0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C`](https://etherscan.io/address/0x0014Eb4Ac6Dd1473b258d088E6EF214b2BCdc53C)) and appears nowhere in Bedrock's uniBTC documentation; the Bedrock-custom CCIPPeer is a second non-pool mint path.
9. **Token-level freeze authority.** `FREEZER_ROLE` (held by the ops Safe) with `freezeToRecipient` set to EOA [`0x899c284A89E113056a72dC9ade5b60E80DD3c94f`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f) is a governance-controlled censorship/seizure path, and freezes emit no events.
10. **Custody opacity.** Reserve addresses are visible, but Bedrock does not publicly name the BTC custodian/signers or prove unencumbered control and Babylon state.
11. **Secondary liquidity is extremely thin.** $4.6K daily volume, ≈15% loss versus parity on a ~$1M indicative exit, and ≈83% at ~$5M leave large holders dependent on the delayed queue and backing replenishment.
12. **No public bug bounty found.**

### Critical Risks

- **Single-EOA unbacked-mint path.** The legacy router admin, EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), can mint arbitrary uniBTC through the Vault's `execute()` without the Safe, PoR, caps or delay. This is a live control weakness, not an observed exploit; no such mint has occurred in the 30-day scan. It does not trigger the template's "Total centralization" gate because token, Vault and ProxyAdmin governance remain with 3-of-5 Safes, but it drives Governance to the maximum score. New or increased uniBTC exposure should wait until the legacy router's Vault `OPERATOR_ROLE` is revoked or its proxy admin moves under the ops-Safe ProxyAdmin.
- Other High concerns: inconsistent supply reporting, delegated reporting control by operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab), dated audit coverage, M-BTC/Merlin concentration, custody opacity, and constrained exits. The supply discrepancy is not proof of missing reserves.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **Unverified contract source** - PASS. uniBTC token, Vault, routers, feeders, operator proxies and their implementations are source-verified on Etherscan.
- [ ] **No audit** - PASS. uniBTC has three public audits, including post-exploit audits.
- [ ] **Unverifiable reserves** - PASS, with caveats. Chainlink PoR is wired into the Vault, but it depends on a self-declared address set and allows 90% adequacy against an operator-reported supply value.
- [ ] **Total centralization** - PASS, borderline. Token, Vault and ProxyAdmin governance uses 3-of-5 Safes, but EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) holds a verified unbacked-mint path through the legacy router. That path is scored under Governance rather than as protocol-wide single-EOA control.

**No gate triggered.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**
- Three uniBTC-specific audits by BlockSec and PeckShield.
- Two post-exploit re-audits.
- All reviews are from 2024; no current review covering later production changes, live configuration, operator contracts, cross-chain/dependency evolution, or the combined Babylon and M-BTC trust boundary was found.
- The reports predate today's materially stronger AI-assisted review and executable exploit-validation capabilities. This is an assurance gap, not a claim that AI replaces expert human review.
- No top-tier audit and no public bug bounty.
- **Score: 3.5**

**Subcategory B: Historical Track Record**
- uniBTC has been live since 2024 and has sustained material TVL.
- September 2024 exploit on the same vault proxy is a major incident.
- No recurrence identified after the post-exploit implementation and PoR hardening.
- **Score: 3.0**

**Audits & Historical Score = (3.5 + 3.0) / 2 = 3.25**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**
- 3-of-5 Safe controls ProxyAdmin, Vault admin role, and token `DEFAULT_ADMIN_ROLE` / `FREEZER_ROLE` (can grant minters and freeze balances), with no timelock or Safe Delay module.
- EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) can upgrade a Vault operator and mint unbacked uniBTC (fork-verified at block 25,981,132). Operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) also holds the Vault manager role, supply feeder admin and CCIP rate-limit admin, and EOA [`0x899c284A89E113056a72dC9ade5b60E80DD3c94f`](https://etherscan.io/address/0x899c284A89E113056a72dC9ade5b60E80DD3c94f) is the supply feeder proxy admin.
- Rubric row 5: EOA upgrade authority, no timelock, and effectively unlimited mint power on this path.
- **Score: 5.0**

**Subcategory B: Programmability**
- Deposit mint execution is programmatic, but its supply denominator is manually reported, differs materially from the dashboard, and has recurring one-day reporting dips.
- Operational EOA [`0x9251fd3d79522bb2243a58fff1db43e25a495aab`](https://etherscan.io/address/0x9251fd3d79522bb2243a58fff1db43e25a495aab) can change feeders and adequacy settings; supply freshness/completeness is not enforced. This falls between hybrid admin-updated operation (3) and offchain accounting with periodic reporting (4).
- **Score: 3.5**

**Subcategory C: External Dependencies**
- Chainlink PoR/CCIP, the undocumented Free Tunnel bridge minter, wrapped BTC issuers (including the M-BTC/Merlin stack), BTC custody/signers, Babylon/restaking venues.
- **Score: 4.0**

**Centralization Score = (5.0 + 3.5 + 4.0) / 3 = 4.1667**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**
- Dashboard coverage is ≈102.04%; the Vault feeder produces 120.67% against a lower supply denominator, not independently reconciled global liabilities.
- M-BTC is 21.36% of dashboard reserves, creating material Merlin bridge/custody concentration.
- Mixed collateral issuer quality and offchain/native BTC custody opacity.
- Explicit 90% adequacy threshold weakens the mint gate.
- **Score: 4.0**

**Subcategory B: Provability**
- Chainlink PoR is a real positive.
- Reserve addresses are inspectable, but ownership, liabilities, Babylon position state, M-BTC's underlying Bitcoin, custody/signing, and redemption capacity are not independently reconciled.
- The 700.93 uniBTC reporting discrepancy, recurring feeder dips, operator-written supply input, and missing supply-freshness check prevent reliable liability reconciliation despite inspectable reserve balances.
- **Score: 4.0**

**Funds Management Score = (4.0 + 4.0) / 2 = 4.0**

#### Category 4: Liquidity Risk (Weight: 15%)

- Redemption is delayed, fee-bearing, WBTC-only, and capped at ~2 WBTC/day on Ethereum with a 0.5 WBTC bucket; matured requests slightly exceed Vault WBTC.
- Only $4.6K daily volume; indicative CoW exits lose ≈15.17% at ~$1M and ≈83.03% at ~$5M against BTC parity.
- Between rubric rows 4 and 5: an exit mechanism exists, but it is capped, delayed, fee-bearing, and the market alternative is near-zero.

**Score Liquidity Risk: 4.25/5**

#### Category 5: Operational Risk (Weight: 5%)

- Doxxed leadership and legal entity are positives.
- Prior incident response was credible.
- Custodian/signing, operator-contract and supply-reporting disclosure remain incomplete. The stale upgrade authority of EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) is scored under Governance to avoid double counting.

**Score Operational Risk: 2.25/5**

### Final Score Calculation

Weights use unrounded category means.

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.25 | 20% | 0.6500 |
| Centralization & Control | 4.1667 | 30% | 1.2500 |
| Funds Management | 4.0 | 30% | 1.2000 |
| Liquidity Risk | 4.25 | 15% | 0.6375 |
| Operational Risk | 2.25 | 5% | 0.1125 |
| **Subtotal** | | | **3.850** |

**Modifiers:**
- **None.** The prior exploit is captured in Historical Track Record; the single-EOA mint path in Governance; M-BTC concentration and custody opacity in Funds Management and External Dependencies. Applying an additional modifier would double count them.

**Final Score: 3.85 / 5.0**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

uniBTC is stronger than a purely admin-attested wrapper on reserve provability because Chainlink PoR is wired into the deposit mint path. It is Elevated Risk, near the upper half of the band, because EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef) can mint unbacked uniBTC around that gate, the gate itself relies on an unreconciled and repeatedly faulty manual supply report and allows 90% adequacy, governance has no onchain timelock, an undocumented third-party bridge holds live mint rights, approximately 21.36% of reported reserves are M-BTC, backing control and Babylon position state are incompletely disclosed, and large exits are constrained by both redemption caps and near-zero secondary liquidity. Until the legacy operator path is closed, strict limits should mean no new or increased exposure.

---

## Reassessment Triggers

- **Time-based:** Reassess by December 15, 2026.
- **TVL / supply-based:** Reassess if uniBTC TVL or supply changes by more than +/-40% from the September 15, 2026 baseline: $357.92M TVL, 2,981.12556288 Ethereum uniBTC, and 4,546.67793 dashboard global uniBTC (dashboard supply remains unreconciled).
- **Incident-based:** Any exploit, depeg >2% sustained >1h, PoR reserve shortfall, redemption queue freeze, bridge failure, or governance compromise.
- **Specific triggers:**
  1. **Any transaction from the legacy router admin EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), any legacy router upgrade, or any mint through `Vault.execute`.** Conversely, revocation of the legacy router's Vault `OPERATOR_ROLE` or moving its proxy admin to the ops-Safe ProxyAdmin warrants a prompt rescore of Governance.
  2. Chainlink uniBTC PoR feed reports backing below independently reconciled supply; supply feeder gap to dashboard supply above 2% for more than one further daily update (currently firing), or resolution of its cause.
  3. PoR feed stale beyond heartbeat.
  4. `adequacyRatio` is lowered or PoR feeder / supply feeder is changed.
  5. uniBTC token, Vault, router, feeder or directBTC implementation upgrade.
  6. ProxyAdmin or Safe ownership transfer.
  7. Safe owner addition/removal or threshold change.
  8. Disclosure of BTC custodian/signers or of the supply-reporting methodology.
  9. Introduction of an onchain timelock / Safe Delay module.
  10. New top-tier audit or bug bounty publication.
  11. M-BTC exceeds 25% of uniBTC reserves, depegs, pauses redemption, changes bridge administrators, or changes its mint/burn implementation.
  12. Any `RoleGranted` for `MINTER_ROLE`, `DEFAULT_ADMIN_ROLE`, or `FREEZER_ROLE` on the uniBTC token, any Vault `OPERATOR_ROLE` or `MANAGER_ROLE` grant, any freeze call, or any change to `freezeToRecipient`.
  13. Change of CCIP token pool, CCIPPeer upgrade or first mint in 30+ days, Free Tunnel executor/admin/version change or mint, or a mint from an address outside the four known minters.
  14. Supply feeder updater/admin change or proxy upgrade; withdrawal router upgrade, blacklist/whitelist change, quota reduction, or matured debt exceeding available WBTC for more than 24 hours.

At the snapshot, M-BTC (21.36%) is below the 25% trigger, and Chainlink reserves are within the heartbeat and exceed both reported supply figures. No token role grants or revocations since May 7, 2026, no Vault configuration events and no governance Safe owner or threshold changes appeared in the scans. The supply-feeder gap trigger is active, and matured redemption debt slightly exceeds Vault WBTC. Point-in-time prices do not establish whether a sustained depeg occurred between observations.

## Open TODOs (Items Not Verifiable This Session)

- **Legacy operator remediation:** confirm with Bedrock the intended status of the legacy router and its admin EOA [`0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef`](https://etherscan.io/address/0x3eea50ba10952e5e0dfaa50ecfcc5ab19ad591ef), and whether revocation is planned.
- **Supply reconciliation:** explain the 700.93 uniBTC difference between feeder and dashboard and the recurring one-day dips (consistent with, but not confirmed as, BOB supply dropping out), and verify complete global liabilities and feed-update methodology.
- **Redemption maturity and throughput:** reconstruct pre-window requests individually and verify replenishment commitments; a live unpaused router alone does not prove prompt settlement.
- **Merlin continuity:** M-BTC bridge administrators and mint-relayers were not reverified; the historical onchain basis remains August 8, 2026.
- **Operational controls:** directBTC minter [`0x91fd8c7a…`](https://etherscan.io/address/0x91fd8c7a5fda7d52ab41bbe423eedd3a65d64500) permissions, Free Tunnel hub owner composition.
- **Custodian identity / signing setup** for BTC backing uniBTC.
- **Native-BTC/Babylon position reconciliation:** mapping each published reserve address to custodian ownership, Babylon staking transaction, finality provider, slashing status and unbonding state.
- **M-BTC bridge assurance:** independently verified Bitcoin backing, custody/MPC quorum, complete mint-relayer set, upgrade authority, and a documented unilateral or emergency exit path.
- **Mint/burn authority enumeration for non-Ethereum deployments** - Ethereum mint authority is enumerated in this report (four direct minters, five Vault operators, and token admin/freezer); the 30+ non-Ethereum deployments each have their own minter/bridge configuration that has not been individually verified.
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
- Chainlink CCIP chain selectors: https://github.com/smartcontractkit/chain-selectors
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
- [September 15, 2026 evidence](https://github.com/yearn/risk-score/blob/fef9d99c1268925a0821bcc0c2c1c0d369f99224/reports/data/bedrock-unibtc-2026-09-15.json): pinned Ethereum contract/proxy/role/allowlist reads; proxy admin code and nonce checks; legacy router creation, admin history and anvil fork simulation; Free Tunnel hub reads; complete supply feeder `Updated` history; 30-day mint attribution, router, CCIP pool, Vault asset-flow and Safe event scans; CCIP lane buckets; reserve API, CoinGecko, CoW, DeFiLlama and Merlin explorer observations.
- [September 13, 2026 evidence](https://github.com/yearn/risk-score/blob/9457f23a5be5fc62032e9a94dc1a9b16bc46d264/reports/data/bedrock-unibtc-2026-09-13.json): full paginated role histories and Safe owner sets used as the continuity baseline.
- [Bedrock reserve API](https://affiliate-api-eosin.vercel.app/api/v1/third/stats/unibtc), [DeFiLlama API](https://api.llama.fi/protocol/bedrock-unibtc), and [CoinGecko](https://www.coingecko.com/en/coins/universal-btc): independently timed market/reserve snapshots recorded in the evidence.
- Reserve/Merlin verification on August 8, 2026: Bedrock dashboard reserve composition and linked addresses; M-BTC `totalSupply()`, `bridgeAddress()`, Bedrock reserve balance and holder rank; main bridge `version()`, admin and mint-relayer reads; EIP-1967 implementation slots; and bytecode-presence checks via Merlin RPC.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [August 10, 2026](https://github.com/yearn/risk-score/pull/303) | 3.6 | Initial uniBTC assessment |
| [September 15, 2026](https://github.com/yearn/risk-score/pull/468) | 3.9 | Fork-verified single-EOA unbacked-mint path via the legacy withdrawal router (Governance 4.0 → 5.0); documented recurring supply-feeder dips and the unresolved denominator gap; expanded monitoring with baselines and thresholds; refreshed roles, limits, redemption liquidity, reserves, and exit quotes. Elevated Risk. |
