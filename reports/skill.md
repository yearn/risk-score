---
name: generating-risk-reports
description: List of actions, guidelines and tools used for generating risk assessment reports for protocols and assets.
allowed-tools: Read Write Edit Grep Glob Bash(git:*) Bash(gh:*) Bash(cast:*) Bash(curl:*) Bash(uv:*)
---

# Generating risk assessment reports

- Always mark sections as "TODO" if information is unavailable or not found, never assume anything.
- Follow instructions in `reports/README.md`.
- Try to validate onchain code against the protocol's GitHub repository.
- Before starting, pull latest `master`.
- When the report is ready, open a draft pull request with a concise summary, source notes, and validation notes.
- Every new risk report must include a matching dependency graph at `reports/graph/<slug>.yaml`; follow `reports/graph/SKILL.md`.
- Never trust protocol documentation alone. Use docs to understand the intended architecture, then verify claims onchain when possible.
- Back every material claim with a valid link. This includes contracts, transactions, governance records, protocol docs, dashboard/API data, TVL values, and allocation data.
- Actively search for hidden or indirect fund-loss paths for end users: privileged minting, upgradeable implementations, proxy admins, oracle control, role escalation, pause/blacklist paths, redemption gates, offchain custody, fee switches, strategy migration controls, and dependency failure modes.

## Pre-Assessment: Architecture First

Before writing any claims about a protocol, complete these steps in order:

### Pass 1: Architecture Mapping
1. **Read the protocol's GitHub README** — understand the contract architecture, what components exist, and how they relate. Browse the repo directory structure (`src/`, `contracts/`, etc.).
2. **For every contract in the address table, fetch and review its ABI** — use Etherscan or `cast`. Look for references to other contracts (factory → deployed markets, kernel → tranches, vault → strategies). List all public functions.
3. **Read protocol documentation** (gitbook, docs site) — understand the claimed architecture, fund flow, and governance before verifying onchain. Documentation is not evidence by itself.
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
- Treat any path that can move, dilute, freeze, trap, or misprice user funds as a possible end-user loss path, even if it is not described as such in docs.

## Tools

- Use Foundry to fetch blockchain data; focus on `cast`. Docs: https://www.getfoundry.sh/cast
- Use RPC URLs from `.env`. For Ethereum mainnet, use `RPC_1` first and `RPC_2` as fallback. For other chains, use the chain-specific `RPC_<chain_id>` variable when available, for example `RPC_8453` for Base.
- For Python scripts, use `scripts/env.py` to load `.env` and resolve RPC/API-key aliases: call `load_repo_env()` once, then `get_rpc_url(chain_id)` or `get_explorer_api_key(name)`. Do not reimplement `.env` path walking or env-var fallback lists in report scripts.
- Use Etherscan to fetch blockchain data; usage is defined in `reports/etherscan/SKILL.md`.
- For fetching TVL, use the DeFiLlama API. Docs: https://api-docs.defillama.com/ or use script: `uv run reports/scripts/fetch_defillama_tvl.py [protocol]`
- If you use some script multiple times, add it to the `reports/scripts` folder but first ask for permission before committing it.
- Check `.env` for environment variables and secrets. If you cannot access `.env`, stop early and report the blocker.

## Post-Assessment

- After the report is finalized, generate or update the contract dependency graph YAML at `reports/graph/<slug>.yaml`; procedure defined in skill `generating-dependency-graphs` in `reports/graph/SKILL.md`. The graph publishes to `/graph/<slug>/` and is auto-linked from the report page when the YAML exists.
- The report task is not ready for draft PR until the graph exists and `npm run build` validates both the report page and graph schema, unless the graph cannot be produced from available information. If graph data is unavailable, explain why and mark the missing graph facts as `TODO`.
