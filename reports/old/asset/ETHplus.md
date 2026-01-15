# ETH+

The ETH+ contract is an implementation of Reserve RToken, a reward-generating Ethereum Liquid Staking Token basket with over-collateralized protection. For more details about implementation, see [Reserve Protocol](../protocol/old/reserve.md).

ETH+ token is [collateral basket](https://app.reserve.org/ethereum/token/0xe72b141df173b999ae7c1adcbf60cc9833ce56a8/overview) of following assets on 21st April 2025:

- 50% wstETH
- 21% sfrxETH
- 21% rETH
- 8% ETHx

Governance can update the basket configuration and upgrade contacts. Monitoring is recommended.

## Monitoring

- [Timelock contract](https://etherscan.io/address/0x5f4A10aE2fF68bE3cdA7d7FB432b10C6BFA6457B#code) (3-day delay) for governance actions. Monitor events `CallScheduled`, `CallExecuted`.
- Governance proposals are also available on [Reserve website](https://app.reserve.org/ethereum/token/0xe72b141df173b999ae7c1adcbf60cc9833ce56a8/governance).
- The redemption price: [`basketNeeded`](https://etherscan.io/address/0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8#readProxyContract#F9) / [`totalSupply`](https://etherscan.io/address/0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8#readProxyContract#F22)  in the RToken contract.
- The exchange rate between RSR and StRSR for [eth+RSR](https://etherscan.io/address/0xffa151Ad0A0e2e40F39f9e5E9F87cF9E45e819dd#readProxyContract#F16). Falling ratio could indicate the risk for ETH+.
- Bonus: Pauser, Freezer and Guardian roles.

## Links

- [ETH+ address](https://app.reserve.org/ethereum/token/0xe72b141df173b999ae7c1adcbf60cc9833ce56a8/overview)
- [LlamaRisk](https://www.llamarisk.com/research/rtoken-risk-ethplus)
