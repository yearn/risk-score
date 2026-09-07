---
name: assessing-bridge-dependencies
description: Procedure for finding a token's cross-chain bridge dependency, classifying its blast radius as mint/lock/transport, reading the LayerZero DVN quorum onchain, and recording it in src/data/bridges.json.
---

# Assessing bridge dependencies

Use when an assessed asset or protocol touches a cross-chain bridge or
messaging layer — LayerZero/OFT, Chainlink CCIP, Circle CCTP, AggLayer (LxLy),
Wormhole, Axelar, Stargate, native rollup bridges.

Two deliverables:

1. The bridge's place in the *Token Mint Authority* section of the report
   (`reports/SKILL.md` § Pass 1.6).
2. A row in `src/data/bridges.json`, which publishes to `/bridges/`.

## 1. Segment the model — this is the whole assessment

A bridge dependency's blast radius depends entirely on which of three shapes it
is. **Verify it; never assume.** Trace both direct and downstream mint
authority: `wards(<adapter-or-controller>)` (Sky/Centrifuge style),
`hasRole(MINTER_ROLE, <adapter-or-controller>)`, the token's supply-controller
table, and the bridge receiver's authentication logic.

### `mint` — the bridge path can create canonical supply

The bridge-controlled message path can mint the *canonical* token, because the
bridge controller holds mint authority directly or an authenticated downstream
controller does. **A compromise of the required bridge trust path can mint
unbacked native supply and dilute every holder, including on mainnet.** Record
the quorum requirement rather than implying one provider can act alone.

Worked examples:
- Midas mHYPER — the LayerZero OFT adapter holds `M_HYPER_MINT_OPERATOR_ROLE`
  (`reports/report/midas-mhyper.md`).
- Paxos USDG — the `OFTWrapper` is Supply Controller SC3 with a 45M USDG mint
  capacity (`reports/report/paxos-usdg.md`).
- Centrifuge JAAA — the Spoke holds `wards`, and a 2-of-2 MultiAdapter
  authenticates the message before the Spoke mints
  (`reports/report/centrifuge-jaaa.md`).

### `lock` — the remote token is a bridged claim

The canonical token is locked/escrowed on its origin chain; the remote token is
only a claim on that escrow. Blast radius is bounded by remote supply plus
locked collateral.

Worked example: Sky USDS — the OFT Adapter locks USDS and **does not hold
`wards` on USDS**, so it cannot mint native (`reports/report/sky-usds.md`).

### `transport` — an underlying asset moves, not the assessed token

The protocol bridges an *underlying* asset (e.g. USDC via CCTP) to remote
strategies; the assessed token is not bridged at all. Exposure persists while
assets are remote and can include bridge-dependent custody, accounting
callbacks, and return paths — it is **not** necessarily limited to funds in
transit.

Worked example: `reports/report/yearn-yvusd.md`.

## 2. Finding the adapter — do not conclude "no bridge" from a negative

The most common LayerZero shape is a **plain ERC-20 on mainnet + a separate OFT
Adapter + a native OFT on the remote chain**. Three checks look authoritative
and miss it:

| Check | Why it misses |
|-------|---------------|
| "The mainnet token isn't an OFT" (`endpoint()` reverts) | Expected under this shape — the adapter is a different contract |
| [LayerZero's OFT registry](https://metadata.layerzero-api.com/v1/metadata/experiment/ofts/list) | Useful when it hits, but **incomplete** — it lists Resolv, but not Cap or InfiniFi |
| DeFiLlama `chains` | Tracks **protocol TVL by chain, not token deployments** — reported "Ethereum only" for protocols live on Katana |

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
independent verifiers must attest; a `1-of-1` is a single point of failure —
the April 2026 rsETH failure mode.

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

Reference values: `EndpointV2` (Ethereum)
[`0x1a44…728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c),
Ethereum eid `30101`, Katana eid `30375`.

**Configuration is directional.** For `mint`, prioritize the receive path that
can mint canonical supply. For `lock`, prioritize the receive path that can
release canonical escrow. Do not present one sampled route as protocol-wide
coverage — name the route you measured.

## 4. Record it in `src/data/bridges.json`

Add the report's `slug` under the matching bridge. If the bridge is not listed,
add a new bridge object, **inserted in alphabetical order by `name`** (the
checker enforces ordering).

**Bridge object:**

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Slug-style identifier |
| `name` | yes | Display name; drives alphabetical ordering |
| `type` | yes | Short classification, e.g. "Unified canonical bridge (Polygon CDK / AggLayer)" |
| `url` | yes | Docs homepage |
| `description` | yes | What the bridge is and how it moves value |
| `keywords` | yes | Drives the report-mention scan |
| `finality` | no | Per-direction timing |
| `admin` | no | Upgrade/ownership control over the bridge itself |
| `ignore` | no | Report slugs that mention the bridge but do **not** depend on it |
| `dependencies` | yes | Rows below, sorted `direct` before `indirect` |

**Dependency row:**

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | yes | Must match `reports/report/<slug>.md` — build **fails** otherwise |
| `name` | yes | Display name of the asset/protocol |
| `kind` | yes | `direct` (the assessed asset itself bridges) or `indirect` (it depends on something that does) |
| `model` | yes | `mint` / `lock` / `transport` per §1; `unknown` only if genuinely unverified, and the checker warns |
| `integration` | yes | One phrase, e.g. `LayerZero OFT Adapter ("LayerZero vault")` |
| `detail` | yes | Evidence, with **linked** addresses — rendered as markdown |
| `security` | LayerZero | Object below |
| `owner` | no | Who controls the adapter |
| `icon` | no | `protocol:<slug>` / `stablecoin:<slug>` / `token:<address>` / `token:<chainId>:<address>` |

**`security` object** (LayerZero rows; the checker validates every field):

```json
"security": {
  "label": "3-of-3",
  "confirmations": 15,
  "providers": ["LayerZero Labs", "Canary", "Nethermind"],
  "route": "Ethereum→Katana (mint side)",
  "weak": false,
  "verifiedAt": "2026-07-16",
  "link": "https://explorer.katanarpc.com/address/0x88887bE419578051FF9F4eb6C858A951921D8888"
}
```

Checker rules worth knowing before you write it:

- `label` is `N-of-M` or `"TODO"`. `TODO` additionally requires a non-empty
  `note` and a valid tracking `link`.
- `providers` must contain exactly `M` non-empty, non-duplicate names.
- `weak` must be `true` **iff** the required count is 1.
- `route` must name the direction measured; `verifiedAt` is `YYYY-MM-DD` and
  must be a real date; `link` points at the receive-side OApp.

The Route Security column renders the route below the badge, and only for
bridges that populate it (LayerZero today; the field is reusable for others).

## 5. Validate

```bash
npm run build           # fails if a dependency slug has no report; warns on gaps
npm run check-bridges   # --strict: zero unreviewed bridge mentions
```

`scripts/check_bridges.mjs` warns when a report mentions a bridge keyword but is
not listed as depending on it. Resolve **every** warning — either add the
dependency, or add the slug to that bridge's `ignore` list when the mention is
genuinely not a dependency.

Every truncated address in a `detail` string needs a link to the full one; the
Bridges page renders `detail` as markdown for exactly that reason.
