"""Environment helpers for repository scripts.

Secrets live in the repo-level .env file. These helpers load that file from
any script location and provide compatibility with older variable names.
"""

import os
from pathlib import Path
from typing import Iterable

from dotenv import load_dotenv


RPC_ENV_ALIASES: dict[str, tuple[str, ...]] = {
    "1": ("PROVIDER_URL_MAINNET", "PROVIDER_URL_MAINNET_1"),
    "10": ("PROVIDER_URL_OPTIMISM",),
    "137": ("PROVIDER_URL_POLYGON",),
    "42161": ("PROVIDER_URL_ARBITRUM", "PROVIDER_URL_ARBITRUM_2"),
}

EXPLORER_API_KEY_ALIASES: dict[str, tuple[str, ...]] = {
    "ETHERSCAN_API_KEY": ("ETHERSCAN_TOKEN",),
    "POLYGONSCAN_API_KEY": ("POLYGONSCAN_TOKEN",),
    "SONICSCAN_API_KEY": ("SONICSCAN_TOKEN",),
    "ARBISCAN_API_KEY": ("ARBISCAN_TOKEN",),
    "OPTIMISMSCAN_API_KEY": ("OPTIMISMSCAN_TOKEN",),
}


def load_repo_env(start: str | Path | None = None) -> Path | None:
    """Load the nearest .env at or above start, returning its path if found."""
    start_path = Path(start).resolve() if start is not None else Path.cwd().resolve()
    if start_path.is_file():
        start_path = start_path.parent

    for directory in (start_path, *start_path.parents):
        env_path = directory / ".env"
        if env_path.is_file():
            load_dotenv(env_path)
            return env_path

    load_dotenv()
    return None


def required_env(name: str, aliases: Iterable[str] = ()) -> str:
    """Return the first configured env var from name or aliases."""
    names = (name, *aliases)
    for env_name in names:
        value = os.getenv(env_name)
        if value:
            return value

    raise ValueError(f"Missing env variable in .env: {' or '.join(names)}")


def get_rpc_url(chain_id: int | str) -> str:
    """Return the configured RPC URL for chain_id."""
    chain = str(chain_id)
    return required_env(f"RPC_{chain}", RPC_ENV_ALIASES.get(chain, ()))


def get_explorer_api_key(name: str) -> str:
    """Return an explorer API key, accepting *_API_KEY and *_TOKEN names."""
    env_name = name.upper()
    if not env_name.endswith("_API_KEY"):
        env_name = f"{env_name}_API_KEY"
    return required_env(env_name, EXPLORER_API_KEY_ALIASES.get(env_name, ()))
