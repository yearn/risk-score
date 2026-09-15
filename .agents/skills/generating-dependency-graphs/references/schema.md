# Graph schema

[graph.ts](../../../../src/lib/graph.ts) defines and validates the schema.
For complete examples, read [yearn-yvusdc.yaml](../../../../reports/graph/yearn-yvusdc.yaml)
(single vault) or [infinifi.yaml](../../../../reports/graph/infinifi.yaml)
(multiple tokens, strategies, and timelocks).

| Top-level | Required | Type | Notes |
|-----------|----------|------|-------|
| `slug` | yes | string | Matches the filename and report slug. |
| `title` | no | string | Defaults to the slug. |
| `chain` | yes | string | Default chain for nodes. `ethereum`, `polygon`, `base`, `arbitrum`, `sonic`, `katana`, `hyperevm`, `monad`, `avalanche`. |
| `categories` | yes | list | Entries with `id` and display `label`; declare only categories used. |
| `nodes` | yes | list | Node fields below. |
| `edges` | yes | list | Edge fields below. |

## Node fields

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Unique slug-style identifier. |
| `label` | yes | Short readable title, around 40 characters maximum. |
| `category` | yes | One of the five categories below. |
| `address` | no | Full EVM address; drives explorer and cross-graph links. At least one `vault` node must have one. |
| `chain` | no | Overrides the graph's default chain. |
| `link` | no | HTTPS URL; useful for addressless dependencies. Market IDs belong here, never in `address`. |
| `note` | no | Human-readable context shown in the details panel. |
| `morphoVault` | no | `v1` or `v2`; requires `address`. See [Morpho expansion](morpho.md) before using. |

## Edge fields

| Field | Required | Notes |
|-------|----------|-------|
| `from`, `to` | yes | Existing node IDs. Direction follows the meanings below. |
| `kind` | yes | One of the eleven edge kinds below. |
| `label` | no | Include allocation percentages/amounts and actual authority role names where known. All labels appear in the panel; only `allocates-to` and `deposits-into` labels appear on the canvas. |

## Vocabulary

Do not invent enum values. Extensions require coordinated validator and renderer
changes in [graph.ts](../../../../src/lib/graph.ts),
[graphStyle.ts](../../../../src/lib/graphStyle.ts), and
[the graph page](../../../../src/pages/graph/[slug].astro).

### Categories (5)

| `id` | Use for |
|------|---------|
| `vault` | User-facing vault, receipt, or share tokens; these anchor cross-graph links. |
| `strategy` | An active investment leg. |
| `governance` | Safes, timelocks, access-control roots, and role managers. |
| `infra` | Internal protocol machinery such as mint/redeem controllers. |
| `dependency` | External protocols, underlying vaults, pools, or counterparties. |

### Edge kinds (11)

| `kind` | Meaning |
|--------|---------|
| `allocates-to` | Vault → strategy debt. Label with the report's percentage, otherwise amount, otherwise a qualitative description. Numeric labels feed the largest-allocation metric. |
| `deposits-into` | Strategy → underlying venue where capital is deposited. |
| `routes-through` | Capital moves through an intermediate contract. |
| `mints` | Privileged minter → token. One edge per role-holder/token; label the role. No such edges is appropriate only when there is no privileged mint path. |
| `holds-role` | Account → contract on which it holds a named privileged role. |
| `controls` | Administrator → administered contract. |
| `manages` | Registry/factory → managed contract. |
| `proposes-on` | Proposer → timelock. |
| `cancels-on` | Canceller → timelock. |
| `routes-fees-to` | Fee source → fee recipient. |
| `deploys` | Deployer → deployed contract. |

### Flow kinds

`allocates-to`, `deposits-into`, and `routes-through` carry capital flow and
participate in downstream cross-graph expansion. Authority edges do not.
