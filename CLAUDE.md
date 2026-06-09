# Yearn Curation Score Guidelines

## Development Commands
- **Run Scripts**: `uv run scripts/scan_factories.py` or `uv run reports/old/scripts/veda_scan_auth_events.py`
- **Code Formatting**: `uv run -m ruff format .`
- **Update Lock File**: `uv lock` (after changing dependencies in pyproject.toml)
- Use `.env` for environment variables, RPC URLs, and secrets. Never commit secrets.
- Python scripts that need `.env`, RPC URLs, or explorer keys should use `scripts/env.py`: call `load_repo_env()` at the entrypoint and use `get_rpc_url(chain_id)` / `get_explorer_api_key(name)` instead of duplicating `load_dotenv` or env-var alias logic.

## Dependencies
- **Core Dependencies**:
  - web3: For blockchain interaction
  - python-dotenv: For environment variable management
  - requests: For API calls
- **Dev Dependencies**:
  - ruff: For code formatting and linting

## Style Guidelines
- **Imports**: Group standard library imports first, followed by third-party imports, then local imports
- **Code Organization**: Use functions and classes with clear responsibilities
- **Type Hints**: Use Python typing module for function parameters and return values
- **Error Handling**: Use specific exception catching and provide informative error messages
- **Documentation**: Include docstrings for functions/classes with descriptions and parameter details
- **Naming**: Use snake_case for variables/functions, PascalCase for classes
- **Environment Variables**: Store sensitive data (API keys, RPC URLs) in .env file (never commit)

## Coding Practices
- Cache results to minimize blockchain RPC calls
- Use LRU cache for frequently accessed data
- Prefer batch requests when interacting with blockchain
- Log important information with appropriate log levels
- Organize data output in markdown tables for readability
- Never assume, always verify and provide reference to the source of the data
- Do not trust protocol documentation alone. Treat docs as a map, then verify claims onchain when possible.
- Back material findings with valid links: contract pages, transaction links, source docs, dashboards, or API outputs. TVL and allocation claims need source links too.
- Try to use Etherscan for verification of blockchain data.
- Use Foundry `cast` for direct onchain checks. Load RPC URLs from `.env`: use `RPC_1` first for Ethereum mainnet and `RPC_2` as the fallback; for other chains use the chain-specific `RPC_<chain_id>` variable when available.
- For Python-based blockchain/API scripts, prefer `scripts/env.py` over direct `os.getenv` lookups for RPC and explorer keys so aliases stay consistent across scripts.

## Report, Graph, and Reassessment Workflow

- Before starting a report, graph, or reassessment task, pull latest `master`.
- When the report, graph, or reassessment task is ready, open a draft pull request with a concise summary and validation notes.
- For generating a risk assessment report or making report changes, focus only on `reports` unless the user asks otherwise.
- Always read the existing report and understand the context before generating a report, graph, or reassessment.
- If information is unavailable, mark it as `TODO`; do not guess.
- Look for hidden or indirect fund-loss paths, not only documented happy paths. Check privileged minting, upgrade paths, oracle controls, emergency roles, offchain custody, redemption queues, and dependency failure modes.
- Use skill `generating-risk-reports` for new or updated risk reports (`reports/skill.md`), `generating-dependency-graphs` for dependency graphs (`reports/graph/SKILL.md`), and `risk-report-reassessment` for focused refreshes (`reports/reassessment/SKILL.md`).
