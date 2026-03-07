"""Fetch protocol asset dependencies from on-chain data.

Usage: uv run scripts/dependencies/fetch_protocols.py

Fetches collateral/reserve assets for:
- Aave V3 Core: all reserves from Pool contract
- Compound V3: collateral assets from each Comet market
- Maple Finance: hardcoded from risk assessment report

Uses Etherscan API for on-chain reads (no RPC required).
Outputs: scripts/dependencies/protocols.yaml
"""

import os
import sys
import time
from pathlib import Path

import requests
import yaml
from dotenv import load_dotenv
from eth_abi import decode, encode
from web3 import Web3

# Walk up to find .env (may be in parent repo, not worktree)
_dir = Path(__file__).resolve().parent
while _dir != _dir.parent:
    _env = _dir / ".env"
    if _env.exists():
        load_dotenv(_env)
        break
    _dir = _dir.parent

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
if not ETHERSCAN_API_KEY:
    print("Error: ETHERSCAN_API_KEY not set in .env")
    sys.exit(1)

OUTPUT_PATH = Path(__file__).parent / "protocols.yaml"

# Function selectors (keccak256 first 4 bytes)
SEL_GET_RESERVES_LIST = Web3.keccak(text="getReservesList()")[:4].hex()
SEL_SYMBOL = Web3.keccak(text="symbol()")[:4].hex()
SEL_NUM_ASSETS = Web3.keccak(text="numAssets()")[:4].hex()
SEL_GET_ASSET_INFO = Web3.keccak(text="getAssetInfo(uint8)")[:4].hex()
SEL_BASE_TOKEN = Web3.keccak(text="baseToken()")[:4].hex()

# Maps token symbols to their parent protocol for transitive dependency tracing
PROTOCOL_TOKENS: dict[str, str] = {
    # LSTs
    "wstETH": "Lido",
    "stETH": "Lido",
    "rETH": "Rocket Pool",
    "sfrxETH": "Frax",
    "cbETH": "Coinbase",
    "weETH": "EtherFi",
    "rsETH": "KelpDAO",
    "osETH": "StakeWise",
    "ETHx": "Stader",
    "ezETH": "Renzo",
    "pufETH": "Puffer",
    "rswETH": "Swell",
    "wOETH": "Origin",
    "tETH": "Treehouse",
    # Stablecoins / yield tokens
    "sUSDe": "Ethena",
    "USDe": "Ethena",
    "USDS": "Sky",
    "sUSDS": "Sky",
    "sDAI": "MakerDAO",
    "DAI": "MakerDAO",
    "GHO": "Aave",
    "LUSD": "Liquity",
    "crvUSD": "Curve",
    "FRAX": "Frax",
    "PYUSD": "PayPal",
    "eUSDe": "Ethena",
    "deUSD": "Elixir",
    "sdeUSD": "Elixir",
    "RLUSD": "Ripple",
    "USDtb": "Ethena",
    "mUSD": "Mountain",
    "USDG": "Paxos",
    "EURC": "Circle",
    "XAUt": "Tether",
    "syrupUSDT": "Maple",
    # Wrapped BTC
    "LBTC": "Lombard",
    "tBTC": "Threshold",
    "cbBTC": "Coinbase",
    "WBTC": "BitGo",
    "FBTC": "Ignition",
    "eBTC": "Badger",
    # Protocol tokens
    "AAVE": "Aave",
    "COMP": "Compound",
    "UNI": "Uniswap",
    "LINK": "Chainlink",
    "CRV": "Curve",
    "LDO": "Lido",
    "MKR": "MakerDAO",
    "RPL": "Rocket Pool",
    "ENS": "ENS",
    "SNX": "Synthetix",
    "BAL": "Balancer",
    "FXS": "Frax",
    "STG": "Stargate",
    "KNC": "Kyber",
    "1INCH": "1inch",
    # Base assets
    "USTB": "Superstate",
    "USDT": "Tether",
    "USDC": "Circle",
}

# Compound V3 Comet markets on Ethereum mainnet
COMPOUND_V3_MARKETS = {
    "compound_v3_usdc": {
        "name": "Compound V3 USDC",
        "address": "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
    },
    "compound_v3_weth": {
        "name": "Compound V3 WETH",
        "address": "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
    },
}


# --- Etherscan eth_call ---

_call_count = 0


def eth_call(to: str, data: str) -> bytes:
    """Make an eth_call via Etherscan proxy API. Returns raw bytes."""
    global _call_count
    _call_count += 1
    # Etherscan free tier: 5 calls/sec
    if _call_count % 4 == 0:
        time.sleep(0.3)

    resp = requests.get(
        "https://api.etherscan.io/v2/api",
        params={
            "chainid": "1",
            "module": "proxy",
            "action": "eth_call",
            "to": to,
            "data": "0x" + data,
            "tag": "latest",
            "apikey": ETHERSCAN_API_KEY,
        },
        timeout=30,
    )
    result = resp.json().get("result", "0x")
    if not result or result == "0x":
        return b""
    return bytes.fromhex(result[2:])


# --- Helpers ---

# Tokens with non-standard symbol() (e.g., bytes32 instead of string)
_KNOWN_SYMBOLS: dict[str, str] = {
    "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2": "MKR",
}

_symbol_cache: dict[str, str] = {}


def get_symbol(address: str) -> str:
    """Fetch ERC20 symbol via Etherscan eth_call."""
    addr = Web3.to_checksum_address(address)
    if addr in _KNOWN_SYMBOLS:
        _symbol_cache[addr] = _KNOWN_SYMBOLS[addr]
        return _KNOWN_SYMBOLS[addr]
    if addr in _symbol_cache:
        return _symbol_cache[addr]

    try:
        raw = eth_call(addr, SEL_SYMBOL)
        (symbol,) = decode(["string"], raw)
        _symbol_cache[addr] = symbol
    except Exception:
        _symbol_cache[addr] = f"UNKNOWN({addr[:10]})"

    return _symbol_cache[addr]


# --- Fetchers ---


def fetch_aave_v3_core() -> dict:
    """Fetch all Aave V3 Core reserves from the Pool contract."""
    print("Fetching Aave V3 Core reserves...")
    pool_address = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"

    raw = eth_call(pool_address, SEL_GET_RESERVES_LIST)
    (reserves,) = decode(["address[]"], raw)

    collateral = []
    for addr in reserves:
        symbol = get_symbol(addr)
        collateral.append({"asset": symbol, "address": addr})
        print(f"  {symbol}: {addr}")

    return {
        "name": "Aave V3 Core",
        "chain": "ethereum",
        "type": "lending_market",
        "address": pool_address,
        "collateral": collateral,
        "infrastructure": ["Chainlink"],
    }


def fetch_compound_v3(comet_address: str) -> dict:
    """Fetch collateral assets from a Compound V3 Comet market."""
    # Base token
    raw = eth_call(comet_address, SEL_BASE_TOKEN)
    (base_addr,) = decode(["address"], raw)
    base_symbol = get_symbol(base_addr)

    # Number of collateral assets
    raw = eth_call(comet_address, SEL_NUM_ASSETS)
    (num_assets,) = decode(["uint8"], raw)

    collateral = []
    for i in range(num_assets):
        # Encode getAssetInfo(uint8 i)
        calldata = SEL_GET_ASSET_INFO + encode(["uint8"], [i]).hex()
        raw = eth_call(comet_address, calldata)
        # Decode tuple: (uint8 offset, address asset, address priceFeed, uint64 scale,
        #   uint128 borrowCF, uint128 liquidateCF, uint128 liquidationFactor, uint128 supplyCap)
        decoded = decode(
            ["uint8", "address", "address", "uint64", "uint128", "uint128", "uint128", "uint128"],
            raw,
        )
        asset_addr = decoded[1]
        symbol = get_symbol(asset_addr)
        collateral.append({"asset": symbol, "address": asset_addr})
        print(f"  {symbol}: {asset_addr}")

    return {"base_asset": base_symbol, "collateral": collateral}


def maple_data() -> dict:
    """Maple Finance dependency data from risk assessment report (Feb 2026)."""
    return {
        "name": "Maple Finance (syrupUSDC)",
        "chain": "ethereum",
        "type": "lending",
        "address": "0x80ac24aA929eaF5013f6436cdA2a7ba190f5Cc0b",
        "report": "reports/report/maple-syrupusdc.md",
        "collateral": [
            {"asset": "BTC", "allocation": 53.92},
            {"asset": "XRP", "allocation": 25.38},
            {"asset": "USTB", "allocation": 16.16},
            {"asset": "LBTC", "allocation": 2.43},
            {"asset": "weETH", "allocation": 1.06},
            {"asset": "HYPE", "allocation": 1.05},
        ],
        "yield_sources": ["aave_v3_core", "sky"],
        "infrastructure": ["Chainlink"],
    }


def infinifi_data() -> dict:
    """InfiniFi dependency data from risk assessment report (Feb 2026)."""
    return {
        "name": "InfiniFi (siUSD)",
        "chain": "ethereum",
        "type": "stablecoin",
        "address": "0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB",
        "report": "reports/report/infinifi.md",
        "collateral": [
            {"asset": "USDC"},
            {"asset": "USDT"},
            {"asset": "USDe"},
            {"asset": "sUSDe"},
        ],
        "yield_sources": [
            "aave_v3_core",
            "fluid",
            "euler",
            "spark",
            "pendle",
            "ethena",
            "gauntlet",
            "reservoir",
            "fasanara",
            "tokemak",
        ],
        "infrastructure": ["Chainlink"],
    }


def main():
    data: dict = {
        "protocol_tokens": PROTOCOL_TOKENS,
        "protocols": {},
    }

    # Aave V3 Core
    data["protocols"]["aave_v3_core"] = fetch_aave_v3_core()

    # Compound V3 markets
    for market_id, market_info in COMPOUND_V3_MARKETS.items():
        print(f"\nFetching {market_info['name']}...")
        market_data = fetch_compound_v3(market_info["address"])
        data["protocols"][market_id] = {
            "name": market_info["name"],
            "chain": "ethereum",
            "type": "lending_market",
            "address": market_info["address"],
            **market_data,
            "infrastructure": ["Chainlink"],
        }

    # Maple Finance
    data["protocols"]["maple"] = maple_data()

    # InfiniFi
    data["protocols"]["infinifi"] = infinifi_data()

    # Write YAML
    with open(OUTPUT_PATH, "w") as f:
        yaml.dump(
            data, f, default_flow_style=False, sort_keys=False, allow_unicode=True
        )

    print(f"\nWritten to {OUTPUT_PATH}")
    for pid, pdata in data["protocols"].items():
        n = len(pdata.get("collateral", []))
        print(f"  {pdata['name']}: {n} collateral assets")


if __name__ == "__main__":
    main()
