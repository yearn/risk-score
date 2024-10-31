# Factory

This folder contains multiple folders, each folder represents a chain, name of the folder is the chain id (e.g. `1` for Ethereum mainnet).

Each folder contains JSON files of review strategy factories. Name of the file is the factory address. After the factory is reviewed, and deployed contract verified by SAM team, the factory file is added to specific folder depending on the network.

If the strategy is created using factory, the strategy risk score file should be created in the `strategy` folder. This flow **will be** handled by Github Actions. Each hour, Github Actions will fetch all factories from this folder and check on the blockchain if the factory created any new strategy. If the strategy is created, Github Actions will create new JSON file in the `strategy` folder using risk score values from the factory file.
