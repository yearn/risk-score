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
3. **Read protocol documentation** (gitbook, docs site) — understand the claimed architecture, fund flow, and governance before verifying on-chain.
4. **Draw a contract architecture diagram** — map all layers (vault, strategy, factory, markets, governance, underlying protocols). This diagram goes in the report as an appendix. Do this FIRST, not last.
5. **Trace the fund flow end-to-end on-chain** — follow the money from user deposit to final yield source. Check token balances, look at who holds what.

### Pass 2: Verification and Scoring
Only after architecture mapping is complete, proceed to verify each component on-chain and write risk assessments.

### "Doesn't Exist" Checklist
Before writing any claim that functionality is missing, unverifiable, or doesn't exist on-chain, confirm ALL of the following:
- [ ] Searched the GitHub repo for the functionality
- [ ] Checked all known contract ABIs for related functions
- [ ] Read the protocol documentation about how this is supposed to work
- [ ] Checked factory/deployer contracts for related deployments or events
- [ ] Checked on-chain event logs for related contract creation

If any answer is "no," use **"unverified"** not **"doesn't exist."**

## Risk

- If you need to validate risk of layer 2 or bridge, check it out on: https://l2beat.com/scaling/risk
- LlamaRisk has good reports on the risk of protocols and assets: https://www.llamarisk.com/research
- See if asset or protocol is reviewed by Steakhouse, check their reports: https://kitchen.steakhouse.financial/archive
- When validating protocols, see for info on which focused on protocol decentralization: https://www.defiscan.info/
- Always include whole `Risk Tier` table and bold the final risk tier.
- Explain how minting and redeeming works, if present. Verify if minting and redeeming are atomic in a single transaction. Verify if minting needs backing assets, high alert if not. List all accounts with minting role.

## Tools

- use foundry toolkit to fetch blockchain data, foucs on cast tool. Docs: https://www.getfoundry.sh/cast
- use etherscan to fetch blockchain data, usage defined in skill etherscan in `reports/etherscan/SKILL.md`
- for fetching TVL, use defillama api. Docs: https://api-docs.defillama.com/ or use script: `uv run reports/scripts/fetch_defillama_tvl.py [protocol]`
- if you use some script multiple times, add it to the `reports/scripts` folder but first ask for permission before committing it.
- check .env file for environment variables and secrets. if you can't access .env exit asap.
