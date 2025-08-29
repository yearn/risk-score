# Vault

This folder contains multiple folders, each folder represents a chain, name of the folder is the chain id (e.g. `1` for Ethereum mainnet).

Each folder contains JSON files of review vaults. Name of the file is the vault address. After the vault is reviewed, and deployed contract verified by SAM team, the vault file is added to specific folder depending on the network.

JSON structure:

- `riskLevel` is the final risk of the vault displayed on Yearn frontend.
- `riskScore` is object with detailed values of each risk category.

This data is used by [yDaemon](https://github.com/yearn/ydaemon). yDaemon fetches the vaults from blockchain registry and creates new JSON item for each vault. yDaemon was extended in [this commit](https://github.com/yearn/ydaemon/commit/b8296457af78cf97f41ef15cb502ff0744fd0a8b) to fetch the vault risk score from this folder.

TODO: Make Kong use this data and reference the file/commit where this repo is used.

## Adding a new vault

1. Create a new JSON file with name corresponding to the vault address in the `vaults` folder. File must be in the correct folder. Name of the folder is the chain id, e.g. `1` for Ethereum mainnet.
2. JSON file must contain `riskLevel` and `riskScore` fields assigned by the SAM team.

For the reference check [file](./1/0x70E75D8053e3Fb0Dda35e80EB16f208c7e4D54F4.json).

The scores on yDaemon are updated [daily](https://github.com/yearn/ydaemon/blob/1253cce0cbcccb6b1ea2f0da5e7f4aa9596a384c/internal/main.go#L108) at 12:10 UTC. After adding a new vault, it will take some time to reflect on yDaemon.
