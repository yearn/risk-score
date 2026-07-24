---
name: risk-report-reassessment
description: Focused procedure for refreshing existing risk reports by validating mutable on-chain roles, proxy implementations, TVL, strategy allocations, and other current-state data without rewriting the full assessment.
allowed-tools: Read Write Edit Grep Glob Bash(cast:*) Bash(curl:*) Bash(uv:*) Bash(npm:*) Bash(git:*) Bash(gh:*)
---

# Risk Report Reassessment

Use this skill when reassessing an existing report in `reports/report/<slug>.md`.

The goal is a focused refresh, not a new assessment. Update current-state facts, identify material changes, and only adjust risk reasoning or scores when the verified changes justify it.

Follow the project workflow in `CLAUDE.md`: pull latest `master` before starting and open a draft PR when the reassessment task is ready.

## Scope

Always check:

- TVL and recent TVL trend.
- Strategy, farm, vault, or collateral allocations.
- Privileged roles and role-holder counts.
- Timelock delays and proposer/executor/canceller/admin role holders.
- Proxy implementation and proxy admin addresses where contracts are upgradeable.
- Deposit limits, debt limits, redemption liquidity, queue state, and other report-specific monitoring values.
- Existing dependency graph at `reports/graph/<slug>.yaml`, if present.
- Reassessment triggers listed in the report.

Do not spend time redoing static background unless a mutable fact changed. Do not check Safe signer identities; only update threshold and signer count.

## Procedure

1. Read the report end-to-end.
2. Extract the report's current claims into a checklist:
   - contracts and addresses
   - roles and role holders
   - proxy implementations/admins
   - TVL and allocation values
   - monitoring thresholds and reassessment triggers
3. Verify mutable facts from primary sources:
   - on-chain calls with `cast` for roles, proxy slots, allocation, balances, and protocol-specific getters
   - Etherscan or block explorer links for verified source, proxy status, and transactions
   - DeFiLlama for protocol TVL when applicable
   - protocol dashboards or APIs only when on-chain data is unavailable or the report already depends on those sources
4. Compare current values to the report.
5. Check whether graph-relevant facts changed:
   - strategy/farm/collateral allocations
   - active or queued strategies
   - external dependencies
   - governance path, timelocks, role managers, or proxy admins
   - mint authority or privileged supply paths
   - cross-chain bridge / messaging dependencies (LayerZero/OFT, Chainlink CCIP, CCTP, Wormhole, Axelar, Stargate, etc.)
   If any changed, update `reports/graph/<slug>.yaml` using `reports/graph/SKILL.md`. If no graph exists, create one when the report has enough data; otherwise mark the missing graph inputs as `TODO`. If a bridge dependency was added, removed, or changed, also update `src/data/bridges.json` so the `/bridges/` page stays in sync (see the "Bridge dependencies" bullet in `reports/skill.md`); `npm run build` runs `scripts/check_bridges.mjs` and will warn about any bridge the report mentions but that isn't listed.
6. Patch only affected sections **in place**. Do not add a "Reassessment Notes", changelog, or "what changed" section to the report body. Common sections:
   - header assessment date: keep the original date and append the new one in
     parentheses, e.g. `- **Assessment Date:** May 27, 2026 (Updated: June 17, 2026)`.
     Never overwrite the original date — the website derives "Original" vs
     "Latest" and the "Updated report" tag from both dates.
   - Overview + Links
   - Contract Addresses
   - Funds Management
   - Centralization & Control Risks
   - Monitoring
   - Risk Summary
   - Risk Score Assessment
   - Reassessment Triggers
   - Assessment History — append one new row (`| Date | Score | Notes |`) for
     this reassessment; never edit prior rows. Use the same date as the header
     and the new Final Score (or status tag for Not Rated). If the report has no
     "## Assessment History" section yet, add one (see `reports/TEMPLATE.md`),
     seeding a row for the original assessment before the new one.
   - appendices with allocation tables or role tables
7. If a value cannot be verified, mark it `TODO` and say what source/function is missing.
8. Summarize:
   - changed facts
   - graph checked, updated, created, or intentionally left unchanged
   - unchanged critical controls
   - scoring changes, if any
   - remaining TODOs

## On-chain checks

Use `.env` for RPC URLs and API keys. For Ethereum mainnet, use `RPC_1` first and `RPC_2` as fallback. For other chains, use the chain-specific `RPC_<chain_id>` variable when available, for example `RPC_8453` for Base.

For Python scripts, use `scripts/env.py`: call `load_repo_env()` once, then `get_rpc_url(chain_id)` or `get_explorer_api_key(name)`. Do not duplicate `.env` discovery or env-var alias logic in reassessment scripts.

### Proxy implementation/admin

For EIP-1967 proxies, read these slots:

```bash
cast storage <proxy> 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc --rpc-url "$RPC_URL"
cast storage <proxy> 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103 --rpc-url "$RPC_URL"
```

Convert the last 20 bytes into the implementation/admin address. If the report says a contract is immutable or a minimal proxy, verify bytecode/source and do not invent a proxy admin.

### Roles

For OpenZeppelin-style AccessControl:

```bash
ROLE=$(cast keccak "<ROLE_NAME>")
cast call <contract> "getRoleMemberCount(bytes32)(uint256)" "$ROLE" --rpc-url "$RPC_URL"
cast call <contract> "getRoleMember(bytes32,uint256)(address)" "$ROLE" 0 --rpc-url "$RPC_URL"
```

For custom role systems, read the verified source or report-specific Monitoring Functions and use the protocol's getters. Record role names exactly as the contract/report uses them.

### Timelocks

Check:

```bash
cast call <timelock> "getMinDelay()(uint256)" --rpc-url "$RPC_URL"
```

Then verify proposer/executor/canceller/admin role holders using the contract's role system.

## TVL and allocations

Use DeFiLlama first when the report cites protocol-level TVL:

```bash
uv run reports/scripts/fetch_defillama_tvl.py <defillama-slug> --days 30
```

For vault or strategy allocations, prefer on-chain values:

- Yearn V3 vaults: `totalAssets()`, `strategies(address)`, `totalDebt`, `maxDebt`, strategy `totalAssets()`.
- ERC-4626 dependencies: `totalAssets()`, `totalSupply()`, `convertToAssets(...)`.
- Protocol-specific registries: use the getters listed in the report's Monitoring section.

Always recompute percentages from current values. If a strategy/farm is dust, queued, revoked, matured, or disabled, state that explicitly.

## Editing rules

- Keep changes factual and scoped.
- Preserve the report's structure and tone.
- Write the report as a clean, current-state document: update stale values in place so the prose reads as if freshly written for today. Do not narrate the refresh or compare against the previous version — avoid phrasings like "changed from last report", "up/down from prior assessment", "previously X", "now Y (was Z)", inline parentheticals such as "(down from $7.6M)", and dedicated "Reassessment Notes" / changelog sections.
- Do not annotate what is new or unchanged: no `(NEW)`, `(new)`, `(unchanged)`, `(unchanged since …)` markers on rows, bullets, or headings. If a value is unchanged you simply leave it; if something changed the current value stands on its own. The reader does not need to know what moved since the last assessment.
- Do not narrate verification in the body: avoid "verified onchain at block X", "re-verified", "rechecked at block …" phrasing sprinkled through sections. Provenance lives once in the header assessment date (and block, if useful); the body states current facts. If a fact were untrue you would have corrected it — saying "verified" adds nothing.
- Prefer compact tables over long verification bullet lists for contract inventories: `Contract | Address | Role / Key facts`. Drop audit issue-count columns (list firm/date/scope only) and bug-bounty reward tables (state the single highest reward). Omit deep implementation trivia (proxy dummy-impl slot mechanics, full multisig signer lists) unless it is itself a risk.
- Material historical events (incidents, exploits, depegs, large TVL swings) belong in Historical Track Record as dated facts, not as diffs against the prior report.
- Record what changed in the PR description / task summary (step 8), not in the report body.
- Include absolute dates for snapshots.
- Include source links for changed facts.
- Do not lower or raise a score unless the verified change affects the scoring rubric.
- If scores change, update every dependent summary value and the final tier table.
- If strategy allocations materially change, update any dependency-concentration discussion, graph YAML, and graph-related appendix notes as needed.

## Validation

After editing:

```bash
npm run build
```

If Python scripts were edited, run the relevant `uv run pytest` or `uv run ruff` command. If validation cannot run because of missing dependencies, Node version, RPC access, or network limits, report that clearly.
