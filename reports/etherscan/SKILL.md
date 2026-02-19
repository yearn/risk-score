---
name: Etherscan
description: Documentation and capabilities reference for Etherscan
metadata:
  mintlify-proj: etherscan
---

## Capabilities

Hello World.

Etherscan and other scan sites enables agents to query and analyze blockchain data across 60+ EVM-compatible chains through a unified API. Agents can retrieve account balances, transaction histories, token transfers, contract information, gas prices, and network statistics. The platform supports contract verification, source code retrieval, and metadata enrichment for addresses. With Model Context Protocol (MCP) integration, agents can connect directly to AI models like ChatGPT and Claude for blockchain-aware applications.

## Skills

### Account & Balance Queries

* **Get Native Balance**: Retrieve ETH/native token balance for addresses using `GET /v2/api?module=account&action=balance&address=0x...&chainid=1`
* **Get Historical Balance**: Query balance at specific block heights (PRO endpoint)
* **Get Transaction List**: Retrieve normal transactions for an address with pagination using `action=txlist`
* **Get Internal Transactions**: Query internal contract calls using `action=txlistinternal`
* **Get Mined Blocks**: List blocks mined by an address using `action=getminedblocks`

### Token Operations

* **Get Token Balance**: Retrieve ERC-20 token balance for an address using `action=tokenbalance&contractaddress=0x...`
* **Get Token Transfers**: List ERC-20 token transfers with `action=tokentx`, filter by contract address
* **Get Token Supply**: Query total token supply using `action=tokensupply`
* **Get Token Info**: Retrieve token metadata including name, symbol, decimals (PRO endpoint)
* **Get Top Token Holders**: Analyze largest token holders (PRO endpoint)
* **Get Token Holder List**: Retrieve all holders for a token contract (PRO endpoint)
* **Get NFT Transfers**: Query ERC-721 and ERC-1155 token transfers using `action=tokennfttx` and `action=token1155tx`
* **Get NFT Inventory**: Retrieve NFT holdings by contract (PRO endpoint)

### Contract Operations

* **Get Contract ABI**: Retrieve verified contract ABI using `module=contract&action=getabi&address=0x...`
* **Get Contract Source Code**: Fetch verified source code with `action=getsourcecode`
* **Get Contract Creation**: Find contract deployment transaction and creator using `action=getcontractcreation`
* **Verify Solidity Contract**: Submit source code for verification with `action=verifysourcecode` (POST request)
* **Verify Vyper Contract**: Submit Vyper code with `action=verifyvyper&codeformat=vyper-json`
* **Verify Stylus Contract**: Submit Stylus projects with `action=verifystylus`
* **Verify Proxy Contract**: Submit proxy contracts with `action=verifyproxycontract`
* **Check Verification Status**: Monitor verification progress using `action=checkverifystatus`

### Gas & Network Data

* **Get Gas Oracle**: Retrieve current gas price recommendations using `module=gastracker&action=gasoracle`
* **Get Gas Estimate**: Estimate gas for transactions using `action=gasestimate`
* **Get Daily Gas Stats**: Query daily gas usage, limits, and prices (PRO endpoints)
* **Get Network Stats**: Retrieve ETH supply, price, node count, chain size using `module=stats`
* **Get Daily Network Metrics**: Query daily transaction counts, new addresses, network difficulty (PRO endpoints)

### Event Logs & Monitoring

* **Get Event Logs**: Retrieve logs from addresses using `module=logs&action=getLogs&address=0x...&fromBlock=X&toBlock=Y`
* **Filter by Topics**: Query logs with specific event signatures using topic parameters
* **Get Transaction Status**: Check transaction success/failure using `module=transaction&action=getstatus`
* **Get Transaction Receipt**: Retrieve transaction receipt details using `action=gettxreceiptstatus`

### Proxy/RPC Methods

* **eth\_call**: Execute contract calls without creating transactions using `module=proxy&action=eth_call`
* **eth\_getBlockByNumber**: Retrieve block data using `action=ethgetblockbynumber`
* **eth\_getTransactionByHash**: Get transaction details using `action=ethgettransactionbyhash`
* **eth\_getTransactionReceipt**: Retrieve transaction receipt using `action=ethgettransactionreceipt`
* **eth\_getCode**: Get contract bytecode using `action=ethgetcode`
* **eth\_getStorageAt**: Query contract storage using `action=ethgetstorageat`
* **eth\_sendRawTransaction**: Broadcast signed transactions using `action=ethsendrawtransaction`
* **eth\_estimateGas**: Estimate gas for transactions using `action=ethestimategas`

### Metadata & Labels

* **Get Address Metadata**: Retrieve nametags, labels, and reputation for addresses using `module=nametag&action=getaddresstag` (Pro Plus tier)
* **Get Label Master List**: Export all available labels in CSV format (enterprise endpoint)
* **Export Address Tags**: Bulk export address metadata and labels (enterprise endpoint)

### Multi-Chain Support

* All endpoints support 60+ chains via `chainid` parameter: Ethereum (1), Base (8453), Arbitrum (42161), Polygon (137), Optimism (10), Avalanche (43114), and many others
* Single API key works across all supported chains
* Testnet support for major chains (Sepolia, Amoy, Holeskey, etc.)

## Workflows

### Portfolio Analysis Workflow

1. Get address balance: `GET /v2/api?module=account&action=balance&address=0x...&chainid=1`
2. List all token holdings: `GET /v2/api?module=account&action=addresstokenbalance&address=0x...`
3. Get current prices: `GET /v2/api?module=stats&action=ethprice&chainid=1`
4. Calculate portfolio value by multiplying balances by prices

### Transaction Monitoring Workflow

1. Retrieve transaction list: `GET /v2/api?module=account&action=txlist&address=0x...&startblock=0&endblock=latest`
2. Filter for specific token transfers: `GET /v2/api?module=account&action=tokentx&contractaddress=0xUSDC&address=0x...`
3. Get transaction receipts: `GET /v2/api?module=transaction&action=gettxreceiptstatus&txhash=0x...`
4. Analyze gas costs and transaction status

### Contract Verification Workflow

1. Retrieve existing contract source: `GET /v2/api?module=contract&action=getsourcecode&address=0x...`
2. Submit for verification: `POST /v2/api?module=contract&action=verifysourcecode&contractaddress=0x...&sourceCode=...&compilerversion=v0.8.24`
3. Check verification status: `GET /v2/api?module=contract&action=checkverifystatus&guid=...`
4. Once verified, retrieve ABI: `GET /v2/api?module=contract&action=getabi&address=0x...`

### Event Log Analysis Workflow

1. Query logs for address: `GET /v2/api?module=logs&action=getLogs&address=0x...&fromBlock=12878196&toBlock=12878196`
2. Filter by event topic: Add `topic0=0x...` parameter for specific event signatures
3. Paginate through results using `page` and `offset` parameters
4. Parse log data to extract event parameters

### Gas Price Monitoring Workflow

1. Get current gas prices: `GET /v2/api?module=gastracker&action=gasoracle&chainid=1`
2. Estimate gas for transaction: `GET /v2/api?module=proxy&action=ethestimategas&to=0x...&data=0x...`
3. Calculate transaction cost: gasUsed × gasPrice
4. Monitor daily gas trends: `GET /v2/api?module=stats&action=dailyavggasprice` (PRO)

### Cross-Chain Data Aggregation

1. Query same address across multiple chains by changing `chainid` parameter
2. Aggregate balances: sum native balances from chainid=1, 8453, 42161, etc.
3. Combine token holdings across chains
4. Create unified portfolio view across all EVM chains

## Integration

Etherscan integrates with:

* **AI Models**: Model Context Protocol (MCP) server at `https://mcp.etherscan.io/mcp` enables direct integration with ChatGPT, Claude, and other LLMs
* **Development Tools**: Hardhat, Foundry, and Remix plugins for contract verification
* **Web3 Libraries**: Compatible with ethers.js, web3.js, and other Ethereum libraries
* **Blockchain Explorers**: Unified data across 60+ EVM chains including Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, and more
* **Analytics Platforms**: Metadata CSV export for enterprise data integration

## Context

**API Key Management**: Create free or paid API keys from the Etherscan dashboard. Free tier supports selected chains with 3 calls/second limit. Paid tiers (Lite through Pro Plus) offer higher rate limits (5-30 calls/second) and access to PRO endpoints.

**Rate Limits**: Free tier: 3 calls/second, 100,000 calls/day. Standard: 10 calls/second, 200,000 calls/day. Professional: 30 calls/second, 1,000,000 calls/day. Some endpoints throttled to 2 calls/second regardless of tier.

**Supported Chains**: 60+ EVM-compatible chains including Ethereum Mainnet, Sepolia, BNB Smart Chain, Polygon, Base, Arbitrum, Optimism, Avalanche, Linea, Blast, and many others. Each chain has a unique chainid parameter.

**Response Format**: All endpoints return JSON with `status`, `message`, and `result` fields. Status "1" indicates success, "0" indicates failure.

**Block Parameters**: Endpoints accept block numbers as integers or hex format (0x...). Use "latest" for the most recent block. Historical queries limited to last 128 blocks for some endpoints.

**Address Format**: All addresses must be in checksummed format (0x...). Endpoints support querying up to 20 addresses separated by commas.

**Contract Verification**: Requires exact compiler version, optimization settings, and constructor arguments. Supports Solidity, Vyper, and Stylus languages. Verification status can be checked asynchronously.

**PRO Endpoints**: Historical balance queries, token holder lists, daily network metrics, and address metadata require Standard Plan or higher. Some PRO endpoints throttled to 2 calls/second.

**MCP Integration**: Authenticate with Etherscan API key as Bearer token in Authorization header when using the MCP server for AI model integration.

***

> For additional documentation and navigation, see: [https://docs.etherscan.io/llms.txt](https://docs.etherscan.io/llms.txt)

