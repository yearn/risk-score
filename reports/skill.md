---
name: generating-risk-reports
description: List of actions, guidelines and tools used for generating risk assesment reports for protocols and assets.
allowed-tools: Read Write Edit Grep Glob Bash(git:*)  Bash(cast:*)
---

# Generating risk assesment reports

- Always mark sections as "TODO" if information is unavailable or not found, never assume anything.
- Follow instructions in `reports/README.md`.
- Try to valide onchain code with github repository.

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
