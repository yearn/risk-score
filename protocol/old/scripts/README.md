# Scripts

## Veda BoringVault Permissions

The script `veda_scan_auth_events.py` scans blockchain events for Veda BoringVault authority contracts to generate a markdown file with all permissions defined in the Authority contract. For more information on Veda, see [Veda protocol analysis](/protocol/veda.md).

### Requirements

Copy `.env.example` to `.env` and fill in your RPC endpoints and Etherscan API keys.

### Usage

Run with default settings (Ethereum mainnet, with caching):

```bash
uv run protocol/scripts/veda_scan_auth_events.py --vault <vault_address>
```

Run with custom chain ID:

```bash
uv run protocol/scripts/veda_scan_auth_events.py --vault <vault_address> --chain-id 137
```

Disable caching and force blockchain scan:

```bash
uv run protocol/scripts/veda_scan_auth_events.py --vault <vault_address> --no-cache
```

Arguments:

- `--vault`: BoringVault contract address (required)
- `--chain-id`: Chain ID (1=Ethereum, 137=Polygon, 146=Sonic). Default: 1
- `--no-cache`: Disable cache and force blockchain scan

Output will be saved to `protocol/data/{vault_name}-auth-{authority_contract_address}-{chain_id}.md`
