---
name: generating-risk-reports
description: List of actions, guidelines and tools used for generating risk assesment reports for protocols and assets.
allowed-tools: Read Write Edit Grep Glob Bash(git:*)  Bash(cast:*)
---

# Generating risk assesment reports

- Always mark sections as "TODO" if information is unavailable or not found, never assume anything.
- Follow instructions in `reports/README.md`.
- Try to validate onchain code with github repository.

## Pre-Assessment: Architecture First

Before writing any claims about a protocol, complete these steps in order:

### Pass 1: Architecture Mapping
1. **Read the protocol's GitHub README** — understand the contract architecture, what components exist, and how they relate. Browse the repo directory structure (`src/`, `contracts/`, etc.).
2. **For every contract in the address table, fetch and review its ABI** — use Etherscan or `cast`. Look for references to other contracts (factory → deployed markets, kernel → tranches, vault → strategies). List all public functions.
3. **Read protocol documentation** (gitbook, docs site) — understand the claimed architecture, fund flow, and governance before verifying onchain.
4. **Draw a contract architecture diagram** — map all layers (vault, strategy, factory, markets, governance, underlying protocols). This diagram goes in the report as an appendix. Do this FIRST, not last.
5. **Trace the fund flow end-to-end onchain** — follow the money from user deposit to final yield source. Check token balances, look at who holds what.

### Pass 1.5: Supply vs Reserves Reconciliation

Before writing any collateralization claims, complete this arithmetic check:

1. **Get the token's total supply** — `cast call <token> "totalSupply()(uint256)"`
2. **Locate ALL contracts holding backing collateral** — do NOT rely on contract labels ("treasury", "vault"). Check token balances (wstETH, WBTC, USDC, etc.) across every known protocol contract: pools, managers, treasuries, routers, keepers. Protocols often migrate architectures (V1 → V2) and collateral custody may move to new contracts.
3. **Sum the USD value of all located collateral** and compare to total supply. If `total collateral found < total supply`, you are missing collateral locations — keep searching before writing the report.
4. **Compute the actual system-wide CR** = total collateral USD / total debt USD. Do not report per-market CRs as the system CR — they can be misleading (e.g. a legacy market with $8K at 12,000% CR and $0 in the main pool).
5. **Cross-check with DeFi Llama TVL** — if your collateral total diverges significantly from reported TVL, investigate the gap.

This step must pass before proceeding. A mismatch between supply and reserves is a red flag that the architecture mapping (Pass 1) is incomplete.

### Pass 1.6: Mint Authority Enumeration

Before writing the *Token Mint Authority* section of the report (defined in `reports/TEMPLATE.md`), enumerate every address that can mint the assessed token. Patterns to check, in order:

1. **AccessControl-based tokens** (most modern protocols, OpenZeppelin):
   - Read the token's source on Etherscan and grep for `onlyRole(...)` modifiers on `mint` / `burn` functions. Note every role name involved (`MINTER_ROLE`, `RECEIPT_TOKEN_MINTER`, custom names).
   - For each role, enumerate holders: `getRoleMemberCount(role)` and then `getRoleMember(role, i)` for `i = 0..count-1`. Patterns documented in `reports/etherscan/SKILL.md` § "Role & permission enumeration".
   - Examples: InfiniFi `RECEIPT_TOKEN_MINTER` (4 holders), Cap `AccessControl` (via `0x7731…c683`).

2. **Whitelist-mapping tokens** (Liquity-fork style):
   - Read `mintList(address)` for known protocol contracts.
   - Iterate `addToMintList` / `removeFromMintList` events to find every address ever granted, then check current state.
   - Worked example: `reports/report/mezo-musd.md` lines 67–80.

3. **Ownable tokens**: read `owner()` — that single address can mint via `mint(...)`. Classify owner (EOA, multisig, contract).

4. **Bridge-managed tokens**: read the bridge controller address (Wormhole NTT Manager, LayerZero OFT, etc.). It typically holds the only mint authority on the destination chain. Confirm by reading the token's `mint` function for the access check.

5. **For every role-holder address**, classify it in the *Notes* column of the mint table: EOA, multisig (with threshold + named-vs-anonymous signers), or specific contract (with its purpose, e.g. "MintController — entry-point proxy for user deposits"). If a role-holder is itself a multisig, also document its threshold and signer set.

6. **Cross-check against the dependency-graph** (if a YAML exists at `reports/graph/<slug>.yaml`): every mint-authority contract should appear as a node with a `mints` edge (direction: `minter → token`) connecting to the assessed token. The `mints` edge kind renders red and is reserved for privileged supply-creation authority. If your enumeration finds an address that the graph doesn't, the graph is incomplete; if the graph shows a `mints` edge from an address that you can't reproduce onchain, the graph is wrong. Absence of `mints` edges means the token has no privileged minter (permissionless ERC-4626, collateral-only mint, etc.) — also a valid and important visual signal.

### Pass 2: Verification and Scoring
Only after architecture mapping, supply reconciliation, and mint-authority enumeration are complete, proceed to verify each component onchain and write risk assessments.

### "Doesn't Exist" Checklist
Before writing any claim that functionality is missing, unverifiable, or doesn't exist onchain, confirm ALL of the following:
- [ ] Searched the GitHub repo for the functionality
- [ ] Checked all known contract ABIs for related functions
- [ ] Read the protocol documentation about how this is supposed to work
- [ ] Checked factory/deployer contracts for related deployments or events
- [ ] Checked onchain event logs for related contract creation

If any answer is "no," use **"unverified"** not **"doesn't exist."**

## Risk

- If you need to validate risk of layer 2 or bridge, check it out on: https://l2beat.com/scaling/risk
- LlamaRisk has good reports on the risk of protocols and assets: https://www.llamarisk.com/research
- See if asset or protocol is reviewed by Steakhouse, check their reports: https://kitchen.steakhouse.financial/archive
- When validating protocols, see for info on which focused on protocol decentralization: https://www.defiscan.info/
- Always include whole `Risk Tier` table and bold the final risk tier.
- Explain how minting and redeeming works, if present. Verify whether the operations are atomic and whether minting requires backing — flag any path that lets an admin mint unbacked tokens as a high-risk finding. Full mint-authority enumeration (every role-holder, with classification) goes into the *Token Mint Authority* section of the report; the procedure is in Pass 1.6 above.

## Tools

- use foundry toolkit to fetch blockchain data, foucs on cast tool. Docs: https://www.getfoundry.sh/cast
- use etherscan to fetch blockchain data, usage defined in skill etherscan in `reports/etherscan/SKILL.md`
- for fetching TVL, use defillama api. Docs: https://api-docs.defillama.com/ or use script: `uv run reports/scripts/fetch_defillama_tvl.py [protocol]`
- if you use some script multiple times, add it to the `reports/scripts` folder but first ask for permission before committing it.
- check .env file for environment variables and secrets. if you can't access .env exit asap.

## Post-Assessment

- after the report is finalized, optionally generate the contract dependency graph YAML; procedure defined in skill `generating-dependency-graphs` in `reports/graph/SKILL.md`. The graph publishes to `/graph/<slug>/` and is auto-linked from the report page when the YAML exists.
