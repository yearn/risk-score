---
name: assessing-bridge-dependencies
description: Procedure for finding a token's cross-chain bridge dependency, classifying its blast radius as mint/lock/transport, reading the LayerZero DVN quorum onchain, and recording it in src/data/bridges.json.
---

# Assessing bridge dependencies

Use when an assessed asset or protocol touches a cross-chain bridge or
messaging layer — LayerZero/OFT, Chainlink CCIP, Circle CCTP, AggLayer (LxLy),
Wormhole, Axelar, Stargate, native rollup bridges.

Use the [agent guide](../../../AGENTS.md) for evidence and environment.
Follow the [snapshot procedure](../verifying-onchain-data/SKILL.md#snapshot)
for chain reads. Record findings in the report's Token Mint Authority section
and bridge index.

## 1. Classify the bridge model

Classify the bridge dependency by its supply and custody path. Trace direct and downstream mint
authority: `wards(<adapter-or-controller>)` (Sky/Centrifuge style),
`hasRole(MINTER_ROLE, <adapter-or-controller>)`, the token's supply-controller
table, and the bridge receiver's authentication logic.

### `mint` — the bridge path can create canonical supply

The bridge-controlled message path can mint the *canonical* token, because the
bridge controller holds mint authority directly or an authenticated downstream
controller does. **A compromise of the required bridge trust path can mint
unbacked native supply and dilute every holder, including on mainnet.** Record
the quorum requirement rather than implying one provider can act alone.

Worked examples: [Midas mHYPER](../../../reports/report/midas-mhyper.md),
[Paxos USDG](../../../reports/report/paxos-usdg.md), and
[Centrifuge JAAA](../../../reports/report/centrifuge-jaaa.md).
Read the reports for dated authority, limit, and quorum evidence.

### `lock` — the remote token is a bridged claim

The canonical token is locked/escrowed on its origin chain; the remote token is
only a claim on that escrow. Blast radius is bounded by remote supply plus
locked collateral.

Worked example: [Sky USDS](../../../reports/report/sky-usds.md).

### `transport` — an underlying asset moves, not the assessed token

The protocol bridges an *underlying* asset (e.g. USDC via CCTP) to remote
strategies; the assessed token is not bridged at all. Exposure persists while
assets are remote and can include bridge-dependent custody, accounting
callbacks, and return paths — it is **not** necessarily limited to funds in
transit.

Worked example: [Yearn yvUSD](../../../reports/report/yearn-yvusd.md).

## 2. Find the adapter

The most common LayerZero shape is a **plain ERC-20 on mainnet + a separate OFT
Adapter + a native OFT on the remote chain**. Three checks look authoritative
and miss it:

| Check | Why it misses |
|-------|---------------|
| "The mainnet token isn't an OFT" (`endpoint()` reverts) | Expected under this shape — the adapter is a different contract |
| [LayerZero's OFT registry](https://metadata.layerzero-api.com/v1/metadata/experiment/ofts/list) | A missing registry entry alone does not prove absence |
| DeFiLlama `chains` | Tracks **protocol TVL by chain, not token deployments** |

**Work backwards from the remote chain instead.** Find the token on the
destination explorer (a same-address CREATE2/vanity deployment is a strong
hint), confirm it is an OFT (`oftVersion()`, `endpoint()`), then read
`peers(<origin eid>)` (Ethereum = `30101`) to get the mainnet adapter. Verify
with `adapter.token()`, `adapter.endpoint()` (canonical LZ V2 `EndpointV2` on
Ethereum = [`0x1a44…728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c)),
and the escrowed `balanceOf(adapter)`.

### Check every bridge family, not just one

A negative LayerZero result is not a negative bridge result.

| Family | How to check |
|--------|--------------|
| Chainlink CCIP | `TokenAdminRegistry.getPool(token)` on Ethereum = [`0xb227…5Cb6`](https://etherscan.io/address/0xb22764f98dD05c789929716D677382Df22C05Cb6), then the pool's `typeAndVersion()` — `LockRelease…` ⇒ `lock`, `BurnMint…` ⇒ `mint` |
| Circle CCTP | Burn/mint of the *underlying* — usually `transport` |
| AggLayer / LxLy | `PolygonZkEVMBridgeV2` [`0x2a3D…2EDe`](https://etherscan.io/address/0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) (same address on every connected chain); `getTokenWrappedAddress(0, <mainnet token>)` on the destination reveals a canonical wrapper |

## 3. Read the LayerZero DVN quorum onchain

For LayerZero rows this is required, not optional. The DVN quorum is how many
independent verifiers must attest; a `1-of-1` is a single point of failure.

```bash
# receive-side library for this route
cast call $ENDPOINT "getReceiveLibrary(address,uint32)(address,bool)" $OAPP $SRC_EID
# ULN config (configType 2)
cast call $ENDPOINT "getConfig(address,address,uint32,uint32)(bytes)" $OAPP $LIB $SRC_EID 2
```

The config decodes to
`(confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs[], optionalDVNs[])`.
Map DVN addresses to provider names via
<https://metadata.layerzero-api.com/v1/metadata> (per-chain `dvns`).

For Ethereum/Katana routes, Katana eid is `30375`; Ethereum endpoint and eid
are listed in the adapter-discovery step above.

**Configuration is directional.** For `mint`, prioritize the receive path that
can mint canonical supply. For `lock`, prioritize the receive path that can
release canonical escrow. Do not present one sampled route as protocol-wide
coverage — name the route you measured.

## 4. Update the bridge index

When adding or changing a dependency, use the [index schema](references/schema.md)
to update `src/data/bridges.json`. Resolve bridge-mention warnings by recording
actual dependencies or explaining non-dependency mentions through the bridge's
`ignore` list. Follow [project validation](../../../AGENTS.md#validation).
