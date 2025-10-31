# OriginARM

## Documentation & Resources

- [Website](https://www.originprotocol.com/arm)
- [Documentation](https://docs.originprotocol.com/arm/steth-arm)
- [GitHub](https://github.com/OriginProtocol/arm-oeth)

## Protocol Analysis

- Origin’s stETH ARM offers LPs a low-risk strategy to earn passive yield on their ETH. The ARM (Automated Redemption Manager) consists of an ETH vault (ETH in, ETH out) that is used to arbitrage the stETH redemption queue.
- AbstractARM contains main logic which also easy extension for other LSTs like OETH
- stARM contract: https://etherscan.io/address/0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6#readProxyContract & https://vscode.blockscan.com/ethereum/0xec6fdcc3904f8dd6a9cbbbcc41b741df5963b42e
- It is a proxy contract but the owner is timelock with 2 days delay: https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F#readContract#F6
- The stARM contract is under bug bounty program with 1M rewards: https://immunefi.com/bug-bounty/originprotocol/scope/#top
- ARM enables swapping between tokens at fixed price regardless of size.
- Price of tokens is set by operator or admin, both sell and buy price for stETH. There is cross price which is set only by admin(timelock controller) which protects the contract from  the ARM making a loss when the base asset is sold at a lower price than it was bought.
- Deposits are standard, send weth and get shares. Check how cap manager deposit hook works, currently set to [address(0)](https://etherscan.io/address/0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6#readProxyContract#F10)
- Withdraw must be requests and there is delay (10min) that must pass before withdrawing. If there is no liquidity in contract and lending market, withdraw can’t be filled. There is no priority in the queue. Funds in the queue don’t earn fees. PPS is defined at requesting withdraw and the shares are burned at that moment.
- Yield is earned by:
    - Trading fees from swaps
    - Yield from lending markets
- New lending markets can be added by admin, but only one market can be active at a time. In stETH ARM, there is a single [lending market](https://etherscan.io/address/0x29c4Bb7B1eBcc53e8CBd16480B5bAe52C69806D3#readProxyContract#F8) on Morpho: [MEV Capital wETH](https://app.morpho.org/ethereum/vault/0x9a8bC3B04b7f3D87cfC09ba407dCED575f2d61D8/mev-capital-weth).
- [ARMBuffer value](https://etherscan.io/address/0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6#readProxyContract#F7) defines how much WETH is idle in the contract. When liquidity is above ARMBuffer, idle asset is deposited into lending market, if liquidity is below, WETH is removed from lending market. This action can be triggered by calling permissionsless function `allocate()`. ARMBuffer is currently set to 5%, can be updated by operator or admin.
