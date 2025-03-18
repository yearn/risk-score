from web3 import Web3
from typing import List, Dict, Optional
import json
import logging
from dotenv import load_dotenv
import os

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def scan_events(
    contract_address: str,
    abi_path: str,
    event_names: List[str],
    from_block: int,
    to_block: Optional[int] = 'latest',
    batch_size: int = 10000,
    chain_id: str = "1"
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
        address=Web3.to_checksum_address(contract_address),
        abi=abi
    )

    all_events = {event_name: [] for event_name in event_names}
    current_block = from_block
    end_block = w3.eth.block_number if to_block == 'latest' else to_block

    while current_block < end_block:
        chunk_end = min(current_block + batch_size, end_block)

        try:
            # Get logs for each event type
            for event_name in event_names:
                event = getattr(contract.events, event_name)
                logs = event.get_logs(
                    from_block=current_block,
                    to_block=chunk_end
                )
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

# Usage example
if __name__ == "__main__":
    contract_address = "0x7D5f6108e23c0CB2cfD744E5c46f1aAfFc30A348"
    abi_path = "scripts/abi/authority.json"
    event_names = ["UserRoleUpdated", "RoleCapabilityUpdated"]
    from_block = 21363111
    to_block = 22068858

    events = scan_events(
        contract_address=contract_address,
        abi_path=abi_path,
        event_names=event_names,
        from_block=from_block,
        to_block=to_block
    )

    for event_name, logs in events.items():
        print(f"\nEvents for {event_name}:")
        for log in logs:
            # Convert args to dict and convert all bytes to hex
            args = dict(log.args)
            for key, value in args.items():
                if isinstance(value, bytes):
                    args[key] = '0x' + value.hex()

            print(f"Block: {log.blockNumber}")
            print(f"Transaction: {log.transactionHash.hex()}")
            print(f"Args: {args}")
            print("---")