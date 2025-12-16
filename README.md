# Yearn Risk Scores

This repository contains risk scores for Yearn strategies, vaults, assets, and protocols.

## Strategy Risk Scores

Yearn vault risk scores are defined in folder [vaults](./vaults) using [Risk Score Framework](./vaults/RISK_FRAMEWORK.md).

## Asset Risk Scores

Analysis of the assets is available in the [asset](./asset) folder.

## Protocol Risk Scores

Analysis of the protocols is available in the [protocol](./protocol) folder.

## API

Risk data is served via `https://risk.yearn.fi`.

### Vault Endpoints

**Get all vaults for a chain:**
```
GET https://risk.yearn.fi/cdn/vaults/{chainId}.json
```

Example:
```
https://risk.yearn.fi/cdn/vaults/1.json
```

**Get a single vault:**
```
GET https://risk.yearn.fi/cdn/vaults/{chainId}/{address}.json
```

Example:
```
https://risk.yearn.fi/cdn/vaults/1/0x4cE9c93513DfF543Bc392870d57dF8C04e89Ba0a.json
```

Vault addresses are case-insensitive and normalized to lowercase.

### Supported Chains

| Chain | ID |
|-------|-----|
| Ethereum | 1 |
| Polygon | 137 |
| Sonic | 146 |
| Base | 8453 |
| Arbitrum | 42161 |
| Katana | 747474 |
