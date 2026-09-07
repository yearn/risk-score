---
name: verifying-onchain-data
description: Reading roles, permissions, and mint authority directly from contracts with cast and the Etherscan API, for the privileged-access sections of a risk report.
---

# Verifying onchain data

Mechanics for the questions risk reports actually ask of a chain: *who can mint
this token, who holds which role, and who can grant that role?*

RPC and API-key conventions are in the [agent guide](../../../AGENTS.md#environment). General Etherscan API reference
lives upstream at <https://docs.etherscan.io/llms.txt> — this file covers only
the patterns this repo relies on.

Endpoints below use the v2 multichain form, `GET /v2/api?...&chainid=<id>`; a
single API key works across all supported chains. Responses are JSON with
`status` (`"1"` success, `"0"` failure), `message`, and `result`.

## Role and permission enumeration

For contracts using OpenZeppelin `AccessControl` / `AccessControlEnumerable` —
common for mint authority, governance, and timelocks.

**Resolve a role hash.** Read the role constant from source or its getter;
commonly it is `keccak256(<NAME>)`:

```bash
cast keccak "MINTER_ROLE"
# 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
```

`DEFAULT_ADMIN_ROLE` is the all-zero bytes32, `0x0000…0000`.

**Count and enumerate holders** (`AccessControlEnumerable` only):

```bash
ROLE=$(cast keccak "MINTER_ROLE")
COUNT=$(cast call <contract> "getRoleMemberCount(bytes32)(uint256)" "$ROLE")
for i in $(seq 0 $((COUNT - 1))); do
  cast call <contract> "getRoleMember(bytes32,uint256)(address)" "$ROLE" "$i"
done
```

**Check one address:**

```bash
cast call <contract> "hasRole(bytes32,address)(bool)" "$ROLE" 0xACCOUNT
```

**Plain `AccessControl` (no Enumerable)** has no onchain enumeration. Trace
`RoleGranted` / `RoleRevoked` events, then confirm each candidate with
`hasRole` at the snapshot block. Scan from deployment to that block, paginate
all results, and split block ranges when the endpoint caps results. An API
error or partial history is unverified, not an empty role set:

```
GET /v2/api?module=logs&action=getLogs
    &address=0xCONTRACT
    &topic0=0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d   # RoleGranted
    &topic1=<role-hash>
    &chainid=1
```

**Role admins** — who can grant or revoke the role, i.e. the next layer of
trust to document:

```bash
cast call <contract> "getRoleAdmin(bytes32)(bytes32)" "$ROLE"
```

**Liquity-fork whitelist mapping** (e.g. MUSD on Ethereum): the token exposes a
plain `mintList(address) returns (bool)` with no enumerator. Walk
`addToMintList(address)` events and check each result against `mintList`.

**Ownable contracts:** read `owner()` and verify which functions its access
checks protect; ownership alone does not imply mint authority.

**Safe multisigs:** follow the [governance standard](references/governance.md).

**Timelocks:** read `getMinDelay()` and enumerate proposer, executor, canceller,
and admin roles using the same role procedure.

## Mint-authority enumeration workflow

Produces the report’s *Token Mint Authority* section.

1. **Read the verified source:**
   `GET /v2/api?module=contract&action=getsourcecode&address=0xTOKEN&chainid=1`.
   Grep `mint(` and `burn(` for the access-control modifiers.
2. **Resolve every minter-class role** you find — `MINTER_ROLE`,
   `RECEIPT_TOKEN_MINTER`, protocol-specific names.
3. **Enumerate holders** per role, using the enumerable or event-trace path
   above.
4. **Classify each holder**: EOA, multisig (threshold + owner count), or a
   known protocol contract. Use verified source and public attribution.
5. **Resolve `getRoleAdmin(role)`** to document who can grant the role.
6. **Cross-check the dependency graph** — every minter should appear with a
   `mints` edge in `reports/graph/<slug>.yaml`.

## Contract verification status

The unverified-source gate in the [report template](../../../reports/TEMPLATE.md)
depends on this check. For a proxy, the **implementation** is what must be verified:

```
GET /v2/api?module=contract&action=getsourcecode&address=0xADDR&chainid=1
```

An empty `SourceCode` field means unverified. For EIP-1967 proxies, read the
implementation slot first (decode its last 20 bytes as an address):

```bash
cast storage <proxy> 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
```

For EIP-1967 proxy admins, read
`0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`.
Resolve other proxy patterns from verified source; do not invent an admin for
an immutable contract or minimal proxy.

Other useful reads: `action=getabi` (ABI for architecture mapping),
`action=getcontractcreation` (deployer and deployment tx).

## Endpoint checks

- **Confirm the chain ID explicitly.** One key spans every supported chain, so
  the wrong `chainid` can return a valid-looking result for another network.
  Never infer support from EVM compatibility — check it.
- **The live endpoint page wins** over this file for parameters, plan gating,
  and response shape. Treat anything here that contradicts it as stale.

For Etherscan work beyond role and mint-authority enumeration — transaction
debugging, fund-flow tracing, contract review — Etherscan publishes dedicated
agent skills at <https://github.com/etherscan/skills>, plus an official CLI
(<https://github.com/etherscan/etherscan-cli>). Neither is a dependency of this
repo; `cast` plus the v2 API covers what reports need.
