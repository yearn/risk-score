#!/usr/bin/env python3
"""
Consolidate individual vault JSON files into single JSON files per chain.
Transforms: vaults/{chainId}/{address}.json -> vaults/{chainId}.json
Structure: {address: {riskLevel, riskScore}}
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any


def normalize_address(address: str) -> str:
    """Normalize address to lowercase for consistency."""
    return address.lower() if address.startswith("0x") else address


def consolidate_chain_vaults(chain_dir: Path, output_file: Path) -> Dict[str, Any]:
    """
    Consolidate all vault JSON files in a chain directory into a single object.

    Args:
        chain_dir: Directory containing individual vault JSON files
        output_file: Path to write the consolidated JSON file

    Returns:
        Dictionary with addresses as keys and vault data as values
    """
    consolidated: Dict[str, Any] = {}
    json_files = sorted(chain_dir.glob("*.json"))

    if not json_files:
        print(f"  No JSON files found in {chain_dir}")
        return consolidated

    print(f"  Processing {len(json_files)} vault files...")

    for json_file in json_files:
        address = json_file.stem  # filename without .json extension
        normalized_address = normalize_address(address)

        try:
            with open(json_file, "r") as f:
                vault_data = json.load(f)

            # Validate structure
            if not isinstance(vault_data, dict):
                print(f"  Warning: {json_file.name} is not a JSON object, skipping")
                continue

            if "riskLevel" not in vault_data:
                print(f"  Warning: {json_file.name} missing 'riskLevel', skipping")
                continue

            consolidated[normalized_address] = vault_data

        except json.JSONDecodeError as e:
            print(f"  Error: Invalid JSON in {json_file.name}: {e}")
            continue
        except Exception as e:
            print(f"  Error reading {json_file.name}: {e}")
            continue

    # Write consolidated file
    if consolidated:
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, "w") as f:
            json.dump(consolidated, f, indent=4, sort_keys=True)
        print(f"  ✓ Created {output_file} with {len(consolidated)} vaults")
    else:
        print(f"  No valid vaults to consolidate")

    return consolidated


def main():
    """Main function to consolidate all chain vaults."""
    vaults_dir = Path(__file__).parent.parent / "vaults"

    if not vaults_dir.exists():
        print(f"Error: vaults directory not found at {vaults_dir}")
        sys.exit(1)

    print(f"Consolidating vaults from {vaults_dir}\n")

    # Find all chain directories (numeric folder names, excluding 'factory')
    chain_dirs = [
        d for d in vaults_dir.iterdir()
        if d.is_dir() and d.name.isdigit() and d.name != "factory"
    ]

    if not chain_dirs:
        print("No chain directories found")
        sys.exit(1)

    total_vaults = 0
    for chain_dir in sorted(chain_dirs, key=lambda x: int(x.name)):
        chain_id = chain_dir.name
        output_file = vaults_dir / f"{chain_id}.json"

        print(f"Chain {chain_id}:")
        consolidated = consolidate_chain_vaults(chain_dir, output_file)
        total_vaults += len(consolidated)
        print()

    print(f"✓ Consolidation complete! Total vaults: {total_vaults}")


if __name__ == "__main__":
    main()

