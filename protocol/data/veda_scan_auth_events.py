"""
Blockchain Event Scanner for Authority Contract

This script scans blockchain events for a given Authority contract address, specifically tracking:
1. UserRoleUpdated - Events that assign/remove roles to/from user addresses
2. RoleCapabilityUpdated - Events that grant/revoke permissions for roles to call specific functions on target contracts

The script:
- Fetches historical events from the blockchain
- Caches results to minimize RPC calls
- Resolves contract names via Etherscan API
- Maps function signatures to human-readable names
- Generates a markdown table showing:
    - Which addresses have which roles
    - What functions each role can call
    - Which contracts (targets) they can interact with

Output is saved to auth-roles.md for easy viewing and tracking of permission changes.
"""

from web3 import Web3
from typing import List, Dict, Optional, Tuple, Set
import json
import logging
from dotenv import load_dotenv
import os
import csv
from pathlib import Path
import requests
from functools import lru_cache
import time
from collections import defaultdict

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def scan_events(
    contract_address: str,
    abi_path: str,
    event_names: List[str],
    from_block: int,
    to_block: Optional[int] = "latest",
    batch_size: int = 10000,
    chain_id: str = "1",
) -> Dict[str, List[dict]]:
    """
    Scan blockchain for specific events with proper error handling and batching
    """
    # Setup web3 connection
    rpc_url = os.getenv(f"RPC_{chain_id}")
    if not rpc_url:
        raise ValueError(f"Missing env variable RPC_{chain_id}")
    w3 = Web3(Web3.HTTPProvider(rpc_url))

    # Load ABI
    with open(abi_path) as f:
        abi = json.load(f)

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(contract_address), abi=abi
    )

    all_events = {event_name: [] for event_name in event_names}
    current_block = from_block
    end_block = w3.eth.block_number if to_block == "latest" else to_block

    while current_block < end_block:
        chunk_end = min(current_block + batch_size, end_block)

        try:
            # Get logs for each event type
            for event_name in event_names:
                event = getattr(contract.events, event_name)
                logs = event.get_logs(from_block=current_block, to_block=chunk_end)
                all_events[event_name].extend(logs)

            logger.info(f"Scanned blocks {current_block} to {chunk_end}")
            current_block = chunk_end + 1

        except Exception as e:
            logger.error(f"Error in batch {current_block}-{chunk_end}: {e}")
            # Reduce batch size on error
            batch_size = batch_size // 2
            if batch_size < 100:
                raise Exception("Batch size too small, something is wrong")
            continue

    return all_events


def process_events_to_table(
    events: Dict[str, List[dict]], function_signatures: Dict[str, str]
) -> List[dict]:
    """Process events into table format, handling both cached and fresh events"""
    # Store role -> addresses mapping
    role_addresses: Dict[int, Set[str]] = defaultdict(set)
    # Store role -> {target -> {function_sig}} mapping
    role_permissions: Dict[int, Dict[str, Set[str]]] = defaultdict(
        lambda: defaultdict(set)
    )
    table_rows = []

    # First pass: build mappings
    for event_name, logs in events.items():
        for log in logs:
            args = dict(log.args) if hasattr(log, "args") else log["args"]

            if event_name == "UserRoleUpdated":
                role = (
                    int(args["role"]) if isinstance(args["role"], str) else args["role"]
                )
                if args["enabled"]:
                    role_addresses[role].add(args["user"])
                else:
                    role_addresses[role].discard(args["user"])

            elif event_name == "RoleCapabilityUpdated":
                role = (
                    int(args["role"]) if isinstance(args["role"], str) else args["role"]
                )
                # Ensure function signature always starts with 0x
                if isinstance(args["functionSig"], bytes):
                    sig = "0x" + args["functionSig"].hex()
                else:
                    # If it's a string, ensure it starts with 0x
                    sig = (
                        args["functionSig"]
                        if args["functionSig"].startswith("0x")
                        else "0x" + args["functionSig"]
                    )

                if args["enabled"]:
                    role_permissions[role][args["target"]].add(sig)
                else:
                    role_permissions[role][args["target"]].discard(sig)

    # Second pass: generate table rows
    for role, addresses in role_addresses.items():
        for target, sigs in role_permissions[role].items():
            for sig in sigs:
                # Ensure we're looking up with 0x prefix
                name = function_signatures.get(sig, "Unknown Function")
                for user_address in addresses:
                    row = {
                        "Role ID": role,
                        "User Name": get_contract_name(user_address),
                        "Target Name": get_contract_name(target),
                        "Function Names": name,
                        "Function Signatures": sig,  # This will always have 0x prefix now
                        "User Address": user_address,
                        "Target Address": target,
                    }
                    table_rows.append(row)

    return table_rows


@lru_cache(maxsize=100)
def get_contract_name_from_etherscan(address: str, chain_id: str = "1") -> str:
    """
    Get contract name from Etherscan API by searching source code for known contract names
    """
    # Known contract names we're looking for
    KNOWN_CONTRACT_NAMES = {
        "Teller": [
            "TellerWithMultiAssetSupport",
            "Teller",
            "TellerWithRemediation",
            "LayerZeroTeller",
        ],
        "BoringOnChainQueue": ["BoringOnChainQueue", "OnChainQueue"],
        "Manager": ["ManagerWithMerkleVerification"],
        "BoringSolver": ["BoringSolver", "Solver"],
        "Pauser": ["Pauser"],
        "Accountant": ["AccountantWithFixedRate", "AccountantWithRateProviders"],
        "BoringVault": ["BoringVault"],
        "Queue": [
            "WithdrawQueue",
            "BoringOnChainQueue",
            "BoringOnChainQueueWithTracking",
        ],
        "Multisig": ["Proxy", "SafeProxy"],
        "Timelock": ["TimelockController"],
    }

    etherscan_api_key = os.getenv("ETHERSCAN_API_KEY")
    if not etherscan_api_key:
        raise ValueError("Missing ETHERSCAN_API_KEY in environment variables")

    # Select API URL based on chain
    if chain_id == "1":
        api_url = "https://api.etherscan.io/api"
    elif chain_id == "137":
        api_url = "https://api.polygonscan.com/api"
    else:
        raise ValueError(f"Unsupported chain_id: {chain_id}")

    try:
        params = {
            "module": "contract",
            "action": "getsourcecode",
            "address": address,
            "apikey": etherscan_api_key,
        }

        response = requests.get(api_url, params=params)
        data = response.json()

        if (
            data.get("message") == "NOTOK"
            and "rate limit" in data.get("result", "").lower()
        ):
            logger.warning("Rate limit hit, waiting 1 second...")
            time.sleep(1)
            return get_contract_name_from_etherscan(address, chain_id)

        if data["status"] == "1" and data["result"][0]:
            source_code = data["result"][0].get("SourceCode", "")
            if len(source_code) < 10:
                return "EOA"

            # Search for contract definitions in the source code
            for display_name, possible_names in KNOWN_CONTRACT_NAMES.items():
                for contract_name in possible_names:
                    # Look for "contract ContractName {" pattern
                    if f"contract {contract_name}" in source_code:
                        logger.info(f"Found contract {display_name} at {address}")
                        return display_name

            # If we found source code but no matching contract, log it
            if source_code:
                logger.info(
                    f"Contract at {address} source code found but no matching known contracts"
                )
                # Could extract actual contract name for future mapping updates
                import re

                contracts = re.findall(r"contract\s+(\w+)", source_code)
                if contracts:
                    logger.info(f"Found contracts in source: {contracts}")

        elif data["status"] == "0":
            logger.warning(
                f"Etherscan API error: {data.get('message', 'Unknown error')}"
            )

    except Exception as e:
        logger.warning(
            f"Error fetching contract name from Etherscan for {address}: {e}"
        )

    return "Unknown"


def get_contract_name(address: str, chain_id: str = "1") -> str:
    """
    Get contract name from local mapping or Etherscan
    """
    # Local mapping for known contracts
    contract_names = {
        "0x358CFACf00d0B4634849821BB3d1965b472c776a": "Teller",
        "0x3754480db8b3E607fbE125697EB496a44A1Be720": "BoringOnChainQueue",
        # ... etc
    }

    # Try local mapping first
    if address in contract_names:
        return contract_names[address]

    # If not in local mapping, try Etherscan
    return get_contract_name_from_etherscan(address, chain_id)


def load_function_signatures(
    csv_path: str = "protocol/data/veda_function_signatures.csv",
) -> Dict[str, str]:
    """
    Load function signatures from CSV file
    Returns: Dict[signature -> function_name]
    """
    signatures = {}
    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            signatures[row["function_sig"]] = row["function_name"]
    return signatures


def get_function_info(sig: str, signatures: Dict[str, str]) -> Tuple[str, str]:
    """
    Returns both signature and name
    Returns: (signature, function_name)
    """
    # Remove '0x' if present for consistency
    clean_sig = sig.replace("0x", "")
    return f"0x{clean_sig}", signatures.get(clean_sig, clean_sig)


def save_events_to_file(events: dict, filename: str = "cached_events.json"):
    """Save events to a JSON file in a consistent format"""
    serializable_events = {}
    for event_name, logs in events.items():
        serializable_events[event_name] = [
            {
                "blockNumber": (
                    log.blockNumber
                    if hasattr(log, "blockNumber")
                    else log["blockNumber"]
                ),
                "transactionHash": (
                    log.transactionHash.hex()
                    if hasattr(log, "transactionHash")
                    else log["transactionHash"]
                ),
                "args": {
                    k: v.hex() if isinstance(v, bytes) else v
                    for k, v in (
                        dict(log.args) if hasattr(log, "args") else log["args"]
                    ).items()
                },
            }
            for log in logs
        ]

    with open(filename, "w") as f:
        json.dump(serializable_events, f, indent=2)


def load_events_from_file(filename: str = "cached_events.json") -> dict:
    """Load events from a JSON file"""
    if not Path(filename).exists():
        return None

    with open(filename, "r") as f:
        return json.load(f)


def get_events(
    contract_address: str,
    abi_path: str,
    event_names: List[str],
    from_block: int,
    to_block: Optional[int] = "latest",
    use_cache: bool = True,
    cache_file: str = "cached_events.json",
) -> Dict[str, List[dict]]:
    """Get events either from cache or by scanning blockchain"""

    # Try to load from cache if enabled
    if use_cache:
        cached_events = load_events_from_file(cache_file)
        if cached_events is not None:
            logger.info("Using cached events")
            return cached_events

    # If no cache or cache disabled, scan blockchain
    logger.info("Scanning blockchain for events")
    events = scan_events(
        contract_address=contract_address,
        abi_path=abi_path,
        event_names=event_names,
        from_block=from_block,
        to_block=to_block,
    )

    # Save to cache if enabled
    if use_cache:
        save_events_to_file(events, cache_file)

    return events


def save_markdown_table(
    contract_address: str, table_rows: List[dict], filename: str = "auth-roles.md"
):
    """Save the roles and permissions data as a markdown table"""
    with open(filename, "w") as f:
        # Write table header
        f.write(
            f"# Authorization Roles and Permissions for contract {contract_address}\n\n"
        )
        f.write(
            "| User Name | Target Name | Function Names | Function Signatures | User Address | Target Address |\n"
        )
        f.write(
            "|-----------|-------------|----------------|-------------------|--------------|----------------|\n"
        )

        # Write table rows
        for row in table_rows:
            f.write(
                f"| {row['User Name']} | {row['Target Name']} | {row['Function Names']} | "
                f"{row['Function Signatures']} | {row['User Address']} | {row['Target Address']} |\n"
            )


# Usage example
if __name__ == "__main__":
    # Load function signatures first
    function_signatures = load_function_signatures()

    contract_address = "0x7D5f6108e23c0CB2cfD744E5c46f1aAfFc30A348"
    abi_path = "protocol/data/abi/authority.json"
    event_names = ["UserRoleUpdated", "RoleCapabilityUpdated"]
    from_block = 21363111
    to_block = 22068858

    # Use cache by default, can be disabled with use_cache=False
    events = get_events(
        contract_address=contract_address,
        abi_path=abi_path,
        event_names=event_names,
        from_block=from_block,
        to_block=to_block,
        use_cache=True,  # Set to False to force blockchain scan
    )

    # Process events into table format
    table_rows = process_events_to_table(events, function_signatures)

    # Save to markdown file
    save_markdown_table(contract_address, table_rows, "auth-roles.md")

    # Optionally, still print to console
    print("Table saved to auth-roles.md")
