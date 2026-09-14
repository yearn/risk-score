# Morpho market expansion

A node tagged `morphoVault: v1` (or `v2`) is expanded by `scripts/update_morpho_graph_markets.mjs` into its current underlying market allocations. The tag records the vault contract's immutable generation, so the updater queries only the declared API collection (`vaults` for v1, `vaultV2s` for v2) rather than probing both.

What the generator does:

- Scans every `reports/graph/*.yaml`, finds tagged nodes, and fetches their allocations from the Morpho GraphQL API (`https://api.morpho.org/graphql`).
- Emits a `dependency` node per non-zero market (label `cbBTC/USDC · 86% LLTV`, `link` to the Morpho market page, full 32-byte `marketId` in the `note`) and a `deposits-into` edge from the vault node to each market carrying its percentage label.
- Represents idle assets (`collateralAsset` is null) as a synthetic `Idle <asset>` node with no Morpho link, so displayed allocations reconcile to 100%. Tiny positive shares are labelled `<0.1%`, never rounded to 0.
- Writes into two marker-delimited sections — `# BEGIN/END GENERATED MORPHO MARKET NODES` (before `edges:`) and `# BEGIN/END GENERATED MORPHO MARKET EDGES` (inside the edge list) — preserving every byte outside those regions. V2 vaults are supported for direct `MorphoMarketV1Adapter` positions; nested/unsupported adapters fail closed.

Commands:

```bash
node scripts/update_morpho_graph_markets.mjs            # check: exits 1 if any managed section is stale
node scripts/update_morpho_graph_markets.mjs --write    # apply
node scripts/update_morpho_graph_markets.mjs --graph <slug> --write   # one graph
```

Authoring rules:

- Tag only actual Morpho vault contracts. Skip generic Morpho protocol/market nodes, strategies that only use flashloans, and wrappers/farms that deposit into a separate vault node.
- A tag/version mismatch fails closed with an actionable error — do not guess the version; verify the contract onchain or via the API first.
- The generated market IDs are 32-byte identifiers, not EVM addresses — they live in `link`, never in `address`.
