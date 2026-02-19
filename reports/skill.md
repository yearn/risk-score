---
name: generating-risk-reports
description: List of actions, guidelines and tools used for generating risk assesment reports for protocols and assets.
allowed-tools: Read Write Edit Grep Glob Bash(git:*)  Bash(cast:*)
---

# Generating risk assesment reports

Always mark sections as "TODO" if information is unavailable or not found, never assume anything. Instructions on how to generate the report are defined in `reports/README.md`.

## Risk

- If you need to validate risk of layer 2 or bridge, check it out on: https://l2beat.com/scaling/risk
- LlamaRisk has good reports on the risk of protocols and assets: https://www.llamarisk.com/research
- When validating protocols, see for info on which focused on protocol decentralization: https://www.defiscan.info/
- Don't check Safe multisig signers, only specify multisig threshold and number of signers.

## Monitoring

- Always define which addresses should be monitored.
- Define which functions can be used to get specific data.
- If data can't be fetched on-chain then fallback to using off-chain data.
- Try to define threshold values.

## Bug bounty

- search for immunfi first then sherlock and cantina
- check if the protocol is using Safe Harbor build by SEAL team. try using [website](https://safeharbor.securityalliance.org/) to check if the protocol is using it.

## Tools

- use foundry toolkit to fetch blockchain data, foucs on cast tool. Docs: https://www.getfoundry.sh/cast
- use etherscan to fetch blockchain data, usage defined in skill etherscan in `reports/etherscan/SKILL.md`
- for fetching TVL, use defillama api. Docs: https://api-docs.defillama.com/ or use script: `uv run reports/scripts/fetch_defillama_tvl.py [protocol]`
- if you use some script multiple times, add it to the `reports/scripts` folder but first ask for permission before committing it.
- check .env file for environment variables and secrets.
