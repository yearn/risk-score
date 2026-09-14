# Bridge contract reads

Use the section matching the bridge under investigation. Apply the shared
[snapshot procedure](../../verifying-onchain-data/SKILL.md#snapshot).

## Mint and escrow permissions

Check `wards(adapterOrController)`, `hasRole(MINTER_ROLE, adapterOrController)`,
and supply-controller tables as applicable. Trace receiver authentication through
any downstream minter; an adapter's own permissions may not describe the full path.

## LayerZero adapter discovery

**Work backwards from the remote chain instead.** Find the token on the
destination explorer (a same-address CREATE2/vanity deployment is a strong
hint), confirm it is an OFT (`oftVersion()`, `endpoint()`), then read
`peers(<origin eid>)` (Ethereum = `30101`) to get the mainnet adapter. Verify
with `adapter.token()`, `adapter.endpoint()` (canonical LZ V2 `EndpointV2` on
Ethereum = [`0x1a44…728c`](https://etherscan.io/address/0x1a44076050125825900e736c501f859c50fE728c)),
and the escrowed `balanceOf(adapter)`.

## Other bridge families

| Family | How to check |
|--------|--------------|
| Chainlink CCIP | `TokenAdminRegistry.getPool(token)` on Ethereum = [`0xb227…5Cb6`](https://etherscan.io/address/0xb22764f98dD05c789929716D677382Df22C05Cb6), then the pool's `typeAndVersion()` — `LockRelease…` ⇒ `lock`, `BurnMint…` ⇒ `mint` |
| Circle CCTP | Burn/mint of the *underlying* — usually `transport` |
| AggLayer / LxLy | `PolygonZkEVMBridgeV2` [`0x2a3D…2EDe`](https://etherscan.io/address/0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe) (same address on every connected chain); `getTokenWrappedAddress(0, <mainnet token>)` on the destination reveals a canonical wrapper |

## LayerZero receive configuration

```bash
# receive-side library for this route
cast call $ENDPOINT "getReceiveLibrary(address,uint32)(address,bool)" $OAPP $SRC_EID
# ULN config (configType 2)
cast call $ENDPOINT "getConfig(address,address,uint32,uint32)(bytes)" $OAPP $LIB $SRC_EID 2
```

The config decodes to
`(confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs[], optionalDVNs[])`.
Map DVN addresses to provider names via
<https://metadata.layerzero-api.com/v1/metadata> (per-chain `dvns`).

For Ethereum/Katana routes, Katana eid is `30375`; Ethereum endpoint and eid
are listed in the adapter-discovery step above.
