# Venus Protocol Analysis  

## Summary  
Modified CompoundV2 code.  

## Components  

### Comptroller  
- vTokens have supply caps that are checked in the Comptroller.  
- There is an [AccessControlManager](https://etherscan.io/address/0x230058da2D23eb8836EC5DB7037ef7250c56E25E#code) contract that checks if an account is allowed to call certain functions. These functions are:  
  - `unlistMarket`  
  - `setCloseFactor`  
  - `setCollateralFactor`  
  - `setLiquidationIncentive`  
  - `setMarketBorrowCaps`  
  - `setMarketSupplyCaps`  
  - `setActionsPaused`  
  - `setMinLiquidatableCollateral`  
  - `setForcedLiquidation`  
- On top of reward distributors, there is also a contract called  
  [Prime](https://etherscan.io/address/0x14C4525f47A7f7C984474979c57a2Dccb8EACB39#readProxyContract), which distributes XVS tokens based on boost. Boost is calculated as a function of the supplied amount by the user and how much staked XVS is held by the user.  
- Different from CompV2, Venus has a bad debt handling mechanism. However, when bad debt is realized, it is only accounted for in the contract, and the exchange rate is not changed. Bad debt is removed from borrows so it does not accrue interest, and the user's collateral is fully removed. Bad debt can be manually repaid by the `shortfall` address.  

### Timelocks  
There are 3 Timelock contracts in Venus:  
- [Normal Timelock](https://etherscan.io/address/0xd969E79406c35E80750aAae061D402Aab9325714#code)  
- [Fast Timelock](https://etherscan.io/address/0x8764F50616B62a99A997876C2DEAaa04554C5B2E)  
- [Critical Timelock](https://etherscan.io/address/0xeb9b85342c34f65af734c7bd4a149c86c472bc00#code)  

#### Normal Timelock  
- Current `delay` is 2 days.  
- Owns:  
  - Comptroller  
  - vTokens  
  - `DEFAULT_ADMIN_ROLE` on AccessControlManager  
  - Reward Distributor contracts  
  - Main Oracle contract and child oracle contracts  
  - Prime  

#### Fast Timelock  
- Current `delay` is 6 hours.  
- Can set any token’s price to a fixed value by calling `setDirectPrice`.  

#### Critical Timelock  
- Current `delay` is 1 hour.  
- Can pause markets.  
- Can set any token’s price to a fixed value by calling `setDirectPrice`.  

**Aside from that, there is a [safe multisig 3/6](https://etherscan.io/address/0x285960c5b22fd66a736c7136967a3eb15e93cc67#readProxyContract), which has `DEFAULT_ADMIN_ROLE` and can call the oracle's `setDirectPrice`. This multisig is never mentioned in their docs and should not have these powers over the protocol.  
This multisig also owns the entire governance contracts.**  

### Oracle  
The [Main Oracle](https://etherscan.io/address/0xd2ce3fb018805ef92b8C5976cb31F84b4E295F94) is the contract the Comptroller calls. This contract then calls other oracles like the Chainlink oracle and ERC4626 oracle contracts, which use the underlying oracle and are written by the Venus team.  

- Anyone with the `setTokenConfig` or `setOracle` roles can set the price of a token to anything in the oracle contract.  
- Almost all tokens use the [ChainlinkOracle](https://etherscan.io/address/0x94c3A2d6B7B2c051aDa041282aec5B0752F8A1F2#readProxyContract). This contract also has an option to return a fixed price, which can be set by anyone with the `setDirectPrice` role.  

## Documentation & Resources  
https://docs-v4.venus.io/  

## Security Concerns  
- The Critical Timelock delay is only 1 hour and can set values that could disrupt the entire protocol.  
- The Safe multisig owns the entire governance and AccessControlManager. The Safe multisig can do anything they want.  
- Like any lending protocol, Venus can have bad debt. Some assets, like BAL and TUSD, are risky, but the supply caps are well set, so it's not a major issue.  

## Monitoring  
- Monitor all Timelocks and the Safe multisig.  

## Notes  
- Venus does not have the empty market issue in CompV2. The Venus team specifically changed how new markets are added to completely remove that attack vector.  