# Strategy

This folder contains multiple folders, each folder represents a chain, name of the folder is the chain id (e.g. `1` for Ethereum mainnet).

Each folder contains JSON files of review strategies. Name of the file is the strategy address. After the strategy is reviewed, and deployed contract verified by SAM team, the strategy file is added to specific folder depending on the network.

JSON structure:

- `riskLevel` is the final risk of the strategy displayed on Yearn frontend.
- `riskScore` is object with detailed values of each risk category.

This data is used by [yDaemon](https://github.com/yearn/ydaemon). yDaemon fetches the strategies from blockchain registry and creates new JSON item for each strategy. yDaemon was extended in [this commit](https://github.com/yearn/ydaemon/commit/b8296457af78cf97f41ef15cb502ff0744fd0a8b) to fetch the strategy risk score from this folder.

## Adding a new strategy

1. Create a new JSON file with name corresponding to the strategy address in the `strategy` folder. File must be in the correct folder. Name of the folder is the chain id, e.g. `1` for Ethereum mainnet.
2. JSON file must contain `riskLevel` and `riskScore` fields assigned by the SAM team.

For the reference check [file](./1/0x70E75D8053e3Fb0Dda35e80EB16f208c7e4D54F4.json).
