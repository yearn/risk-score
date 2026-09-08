---
name: verifying-onchain-data
description: Reading roles, permissions, and mint authority directly from contracts with cast and the Etherscan API, for the privileged-access sections of a risk report.
---

# Verifying onchain data

Use the [agent guide](../../../AGENTS.md#environment) for RPC/key configuration
and the [Etherscan reference](https://docs.etherscan.io/llms.txt) for current
endpoint parameters, supported chains, and response handling.

## Snapshot

Confirm the RPC chain ID and choose a fixed block for related supply, balance,
role, and proxy reads. Record its number, hash, and timestamp once in the report's
snapshot provenance. Pass `--rpc-url "$RPC_URL" --block "$SNAPSHOT_BLOCK"` to
`cast call` and `cast storage`; end log scans at that block.

For cross-chain checks, choose a block per chain near the same timestamp and
record each separately. Never reuse a block number across chains. If an API only
serves current data or historical reads fail, label the different timestamp or
unverified check; do not present mixed states as one snapshot.

## Mint-authority enumeration workflow

Use these steps for the report's Token Mint Authority section and other
privileged roles, including timelock proposer/executor/canceller/admin roles.

1. Read verified source for each mint/burn entrypoint and its access checks.
   Resolve role constants from source or getters; commonly
   `cast keccak "MINTER_ROLE"`. `DEFAULT_ADMIN_ROLE` is zero bytes32.
2. Enumerate every holder using the contract's actual mechanism:
   - **AccessControlEnumerable:** `getRoleMemberCount(role)`, then
     `getRoleMember(role, i)` for every index from zero to count minus one.
   - **Plain AccessControl:** scan `RoleGranted`/`RoleRevoked` from deployment
     through the snapshot block and confirm candidates with `hasRole`.
     Paginate all results and split capped block ranges. API errors or partial
     history do not establish an empty role set.
   - **Whitelist mappings:** scan grant/removal events and check current mapping
     values, such as Liquity-style `mintList(address)`.
   - **Ownable:** read `owner()` and verify its protected functions. Ownership
     alone does not imply mint authority.
3. Resolve `getRoleAdmin(role)` and enumerate its holders using the same steps
   to identify who can grant or revoke authority. For timelocks, read
   `getMinDelay()` too.
4. Classify holders as EOA, Safe, or identified contract using verified source
   and public attribution. Apply the [multisig standard](references/governance.md).
5. Reconcile each privileged minter with a `mints` edge in
   `reports/graph/<slug>.yaml`.

## Contract verification status

Apply the [template's source-verification gate](../../../reports/TEMPLATE.md).
For proxies, verify the implementation's source. On EIP-1967 proxies, use
`cast storage` and decode the last 20 bytes of these slots:

- Implementation: `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`
- Admin: `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`

Query `GET /v2/api?module=contract&action=getsourcecode&address=0xADDR&chainid=<id>`.
Check API success before interpreting an empty `SourceCode` as unverified.
Resolve other proxy patterns from source; do not invent an admin for an
immutable contract or minimal proxy.
