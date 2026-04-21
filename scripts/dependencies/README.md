# Protocol Asset Dependency Graph

Maps asset dependencies per protocol to identify shared exposure and contagion paths across DeFi lending markets.

## Usage

Requires `ETHERSCAN_API_KEY` in `.env`.

```bash
# Fetch onchain data and generate protocols.yaml
uv run scripts/dependencies/fetch_protocols.py

# Render all views (Mermaid graph + tables)
uv run scripts/dependencies/render.py

# Individual views
uv run scripts/dependencies/render.py mermaid   # dependency graph (shared assets only)
uv run scripts/dependencies/render.py table     # full dependency table
uv run scripts/dependencies/render.py shared    # shared exposure / contagion table
```

## Files

| File | Purpose |
|------|---------|
| `fetch_protocols.py` | Fetches collateral assets onchain via Etherscan API, outputs `protocols.yaml` |
| `render.py` | Reads `protocols.yaml`, outputs Mermaid graph and markdown tables |
| `protocols.yaml` | Generated source of truth for all protocol dependency data |

## Adding a new protocol

### Onchain fetcher (lending markets)

Add a new fetcher function in `fetch_protocols.py` and call it from `main()`:

```python
def fetch_my_protocol() -> dict:
    """Fetch collateral from MyProtocol contract."""
    # Use eth_call() for onchain reads, get_symbol() for token names
    raw = eth_call(contract_address, selector)
    # ... decode and collect assets ...
    return {
        "name": "My Protocol",
        "chain": "ethereum",
        "type": "lending_market",
        "address": contract_address,
        "collateral": [{"asset": "WETH", "address": "0x..."}],
        "infrastructure": ["Chainlink"],
    }
```

### Manual entry (from risk reports)

Add directly to `protocols.yaml` or as a hardcoded function like `maple_data()`:

```python
def my_protocol_data() -> dict:
    return {
        "name": "My Protocol (token)",
        "chain": "ethereum",
        "type": "lending",  # or: stablecoin, yield, basket, wrapper
        "address": "0x...",
        "report": "reports/report/my-protocol.md",  # if we have a report
        "collateral": [
            {"asset": "USDC", "allocation": 50.0},
            {"asset": "sUSDe", "allocation": 50.0},
        ],
        "yield_sources": ["aave_v3_core"],  # protocol IDs from protocols.yaml
        "infrastructure": ["Chainlink"],
    }
```

### Adding protocol tokens

If the new protocol introduces tokens that other protocols accept as collateral (e.g., a new LST or stablecoin), add them to the `PROTOCOL_TOKENS` dict in `fetch_protocols.py`:

```python
PROTOCOL_TOKENS = {
    # ...
    "myToken": "My Protocol",
}
```

This enables the render script to trace transitive dependencies (e.g., if Aave accepts `myToken`, the graph shows `Aave -> myToken -> My Protocol`).

## Schema

Each protocol entry in `protocols.yaml` supports:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Display name |
| `chain` | yes | Network (ethereum, arbitrum, etc.) |
| `type` | yes | Protocol type: `lending_market`, `lending`, `stablecoin`, `yield`, `basket`, `wrapper` |
| `address` | yes | Primary contract address |
| `report` | no | Path to risk assessment report |
| `base_asset` | no | Base asset for isolated markets (e.g., Compound V3 USDC market) |
| `collateral` | yes | List of assets — either `{asset, address, allocation}` dicts or plain strings |
| `yield_sources` | no | List of protocol IDs this protocol deploys yield into |
| `infrastructure` | no | List of infrastructure dependencies (oracles, bridges) |

## Render outputs

### Mermaid graph

Shows only assets shared across 2+ protocols. Protocols with unique assets show a count label. Yield source relationships are shown as dashed arrows. Paste the output into any Mermaid-compatible renderer (GitHub, Notion, etc.).

### Full dependency table

Every asset per protocol with dependency type, parent protocol, and allocation percentage.

### Shared exposure table

Assets that appear in multiple protocols, sorted by exposure count. This is the primary contagion analysis view — if an asset depegs or a parent protocol fails, all listed protocols are affected.
