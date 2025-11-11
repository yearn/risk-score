# Vault

This folder contains JSON files, one per chain/network. The filename is the chain ID (e.g. `1.json` for Ethereum mainnet, `137.json` for Polygon).

Each JSON file contains an object where vault addresses (normalized to lowercase) are keys, and the values are objects with `riskLevel` and `riskScore` fields.

JSON structure:

```json
{
  "0x7ee351aa702c8fc735d77fb229b7676ac15d7c79": {
    "riskLevel": 2,
    "riskScore": {
      "review": 3,
      "testing": 1,
      ...
    }
  }
}
```

- `riskLevel` is the final risk of the vault displayed on Yearn frontend.
- `riskScore` is object with detailed values of each risk category.

This data is used by [yDaemon](https://github.com/yearn/ydaemon). yDaemon fetches the vaults from blockchain registry and creates new JSON item for each vault. yDaemon was extended in [this commit](https://github.com/yearn/ydaemon/commit/b8296457af78cf97f41ef15cb502ff0744fd0a8b) to fetch the vault risk score from this folder.

TODO: Make Kong use this data and reference the file/commit where this repo is used.

## Adding a new vault

1. Open the JSON file for the appropriate chain (e.g. `1.json` for Ethereum mainnet, `137.json` for Polygon).
2. Add a new entry with the vault address (lowercase) as the key.
3. The value must contain `riskLevel` and `riskScore` fields assigned by the SAM team.
   - Multistrategy vaults contain `riskLevel` field, `riskScore` fields are all 0 and should not be used.
   - Single-strategy vaults contains both `riskLevel` and `riskScore` fields. `riskScore` fields should be filled with the risk score for the strategy. Check [RISK_FRAMEWORK.md](./RISK_FRAMEWORK.md) for more information on how to fill the `riskScore` fields.
4. Keep addresses sorted alphabetically for easier maintenance.

For reference, check [1.json](./1.json) for examples of vault entries.
