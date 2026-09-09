---
name: assessing-bridge-dependencies
description: Procedure for finding a token's cross-chain bridge dependency, classifying its blast radius as mint/lock/transport, reading the LayerZero DVN quorum onchain, and recording it in src/data/bridges.json.
---

# Assessing bridge dependencies

Follow [AGENTS.md](../../../AGENTS.md) and the
[snapshot procedure](../verifying-onchain-data/SKILL.md#snapshot).
Record findings in the report's Token Mint Authority section and bridge index.

## Classify the model

Trace the authenticated message path through adapters and downstream controllers
to the token's supply/custody checks. Establish the required quorum and the
addresses involved; a bridge provider may not be able to act alone.

| Model | Exposure | Example |
|-------|----------|---------|
| `mint` | The bridge path can create canonical supply, directly or through a downstream minter. Compromise can create unbacked tokens and dilute native holders. | [Centrifuge JAAA](../../../reports/report/centrifuge-jaaa.md) |
| `lock` | Canonical tokens are escrowed; remote tokens are claims on that escrow. Exposure includes locked collateral and remote claims. | [Sky USDS](../../../reports/report/sky-usds.md) |
| `transport` | The protocol moves underlying assets rather than the assessed token. Exposure can persist during remote custody and through accounting/return paths, beyond transit. | [Yearn yvUSD](../../../reports/report/yearn-yvusd.md) |

## Establish the trust path

- Check relevant bridge families, including dependencies' bridges. A negative
  LayerZero check does not rule out CCIP, CCTP, AggLayer, or other paths.
- A plain mainnet ERC-20 may use a separate OFT adapter. Neither a reverting
  token `endpoint()`, a missing registry entry, nor DeFiLlama's TVL-by-chain
  list proves the token has no bridge. Work backwards from remote deployments.
- Read [contract queries](references/onchain-reads.md) for the relevant bridge
  when locating adapters or checking mint/escrow permissions.
- For LayerZero, verify the receive-side DVN quorum. Prioritize the route that
  can mint canonical supply (`mint`) or release canonical escrow (`lock`).
  Configuration is directional: identify the measured route and never present
  one route as protocol-wide coverage. A `1-of-1` quorum is a single verifier.

## Update the index

Use the [index schema](references/schema.md) when changing
`src/data/bridges.json`. Resolve bridge-mention warnings by recording actual
dependencies or adding genuine non-dependency mentions to the bridge's `ignore`
list.
