# Yearn Risk Scores

This repository contains risk scores for Yearn V3 strategies, vaults. Additionally, it contains risk assessments for used protocols and assets.

## Protocol & Asset Reports

Risk assessments for protocols and assets are available in the [reports](./reports) folder. The framework uses a unified methodology to evaluate technical, operational, and organizational risks.

**Features:**
- Quantitative scoring system (1-5 scale, weighted by category)
- Comprehensive template covering audits, centralization, funds management, liquidity, and operational risks
- Standardized monitoring requirements

**Example reports:**
- [ETH+ (Reserve)](./reports/report/reserve-ethplus.md)
- [Origin ARM](./reports/report/origin-arm.md)

## Yearn Vault Risk Scores

Yearn Vaults and Strategies risk scores are defined in folder [vaults](./vaults) using internal [Risk Score Framework](./vaults/RISK_FRAMEWORK.md).

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
