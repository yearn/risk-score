# Bridge index schema

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
| `model` | yes | `mint` / `lock` / `transport` per the [bridge models](../SKILL.md); `unknown` only if genuinely unverified, and the checker warns |
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
