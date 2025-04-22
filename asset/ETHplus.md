# ETH+

- [ETH+ address](https://app.reserve.org/ethereum/token/0xe72b141df173b999ae7c1adcbf60cc9833ce56a8/overview)
- [LlamaRisk](https://www.llamarisk.com/research/rtoken-risk-ethplus)

ETH+ is collateral basket of following assets on 21st April 2025:

- 50% wstETH
- 21% sfraxETH
- 20% rETH
- 8% ETHx

The ETH+ contract is a Resolve implementation of RToken. For more details see [Reserve Protocol](../protocol/reserve.md).

## Monitoring

- [Timelock contract](https://etherscan.io/address/0x239cDcBE174B4728c870A24F77540dAB3dC5F981#code) for governance actions for event ProposalQueued or function `queue()`.
- Governance proposlas are also available on [Reserve website](https://app.reserve.org/ethereum/token/0xe72b141df173b999ae7c1adcbf60cc9833ce56a8/governance).
- The redemption price: [`basketNeeded`](https://etherscan.io/address/0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8#readProxyContract#F9) / [`totalSupply`](https://etherscan.io/address/0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8#readProxyContract#F22)  in the RToken contract.
- The exchange rate between RSR and StRSR for [eth+RSR](https://etherscan.io/address/0xffa151Ad0A0e2e40F39f9e5E9F87cF9E45e819dd#readProxyContract#F16). Falling ratio could indicate the risk for ETH+.
- Bonus: Pauser, Freezer and Guardian roles.
