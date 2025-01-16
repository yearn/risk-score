# Strategy

This folder contains multiple folders, each folder represents a chain, name of the folder is the chain id (e.g. `1` for Ethereum mainnet).

Each folder contains JSON files of review strategies. Name of the file is the strategy address. After the strategy is reviewed, and deployed contract verified by SAM team, the strategy file is added to specific folder depending on the network.

JSON structure:

- `riskLevel` is the final risk of the strategy displayed on Yearn frontend.
- `riskScore` is object with detailed values of each risk category.

This data is used by [yDaemon](https://github.com/yearn/ydaemon). yDaemon fetches the strategies from blockchain registry and creates new JSON item for each strategy. In this flow, yDaemon **will be** extended in [this file](https://github.com/yearn/ydaemon/blob/bb7a1365c0fe7a8ddb4f401eb0fd08278ca88d32/internal/fetcher/vaults.go) to fetch the strategy risk score from this folder.
