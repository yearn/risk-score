"""Render protocol dependency graph and table from protocols.yaml.

Usage:
    uv run scripts/dependencies/render.py              # all outputs
    uv run scripts/dependencies/render.py mermaid      # Mermaid only
    uv run scripts/dependencies/render.py table        # full table only
    uv run scripts/dependencies/render.py shared       # shared exposure only
"""

import json
import sys
from collections import defaultdict
from pathlib import Path

import yaml

YAML_PATH = Path(__file__).parent / "protocols.yaml"
JSON_PATH = Path(__file__).parents[2] / "src" / "data" / "dependencies.json"

# Well-known Ethereum mainnet token addresses for tokens commonly referenced
# as plain strings (no address) in protocols.yaml
KNOWN_ADDRESSES: dict[str, str] = {
    "WETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "wstETH": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    "stETH": "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    "weETH": "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
    "rETH": "0xae78736Cd615f374D3085123A210448E74Fc6393",
    "sfrxETH": "0xac3E018457B222d93114458476f3E3416Abbe38F",
    "sUSDe": "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
    "USDe": "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
    "sUSDS": "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
    "GHO": "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
    "ETHx": "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
    "LBTC": "0x8236a87084f8B84306f72007F36F2618A5634494",
    "USDtb": "0xC139190F447e929f090edF4C5EEa2c5fDa1dcD32",
    "USR": "0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110",
    "wstUSR": "0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055",
    "USCC": "0x14d60E7FDC0D71d8611742720E4C50E7a974020c",
    "USTB": "0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e",
    "STRC": "0x2Aa8c7856d4B4dDB1Ea7d30C0F3F5A7fadf6d308",
    "BTC": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",  # WBTC icon as proxy
    "ETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",  # WETH icon as proxy
    "XRP": "0x628f76eab0c1298f7a24d337bbbf73aab463c4ea",  # Wrapped XRP
    "HYPE": "0x74EaDB3027Da5e62397dEe1376a9CC2081B89c8B",  # Wrapped HYPE
    "USD3": "0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc",
    "cUSD": "0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC",
    "stcUSD": "0x88887bE419578051FF9F4eb6C858A951921D8888",
    "wWTGXX": "0x1Ecb26A14409C0E6fda3A30F1CfDF1F9c8EFa791",
}


def load_data() -> dict:
    with open(YAML_PATH) as f:
        data = yaml.safe_load(f)
    # Dynamically classify PT-* tokens as Pendle
    pt = data.get("protocol_tokens", {})
    for pdata in data.get("protocols", {}).values():
        for c in pdata.get("collateral", []):
            asset = c["asset"] if isinstance(c, dict) else c
            if asset.startswith("PT-") and asset not in pt:
                pt[asset] = "Pendle"
    return data


def _build_address_map(data: dict) -> dict[str, str]:
    """Build symbol→address map from all collateral entries + known addresses."""
    addr_map: dict[str, str] = dict(KNOWN_ADDRESSES)
    for pdata in data.get("protocols", {}).values():
        for c in pdata.get("collateral", []):
            if isinstance(c, dict) and c.get("address"):
                addr_map.setdefault(c["asset"], c["address"])
    return addr_map


def get_assets(protocol: dict) -> list[str]:
    """Extract asset symbols from a protocol's collateral list."""
    return [
        c["asset"] if isinstance(c, dict) else c
        for c in protocol.get("collateral", [])
    ]


def _ys_protocol(ys) -> str:
    """Get the protocol id from a yield source entry (string or dict)."""
    return ys["protocol"] if isinstance(ys, dict) else ys


def _ys_label(ys, protocols: dict) -> str:
    """Get display label for a yield source entry."""
    if isinstance(ys, dict):
        label = ys.get("label", "")
        if label:
            return label
        pid = ys["protocol"]
        name = protocols[pid]["name"] if pid in protocols else pid.replace("_", " ").title()
        assets = ys.get("assets", [])
        return f"{name} ({', '.join(assets)})" if assets else name
    return protocols[ys]["name"] if ys in protocols else ys.replace("_", " ").title()


def _ys_assets(ys) -> list[str]:
    """Get the assets from a yield source entry."""
    if isinstance(ys, dict):
        return ys.get("assets", [])
    return []


def render_mermaid(data: dict) -> str:
    """Mermaid graph showing only shared assets and cross-protocol relationships."""
    protocols = data["protocols"]
    protocol_tokens = data.get("protocol_tokens", {})

    # Only show assets shared across 2+ protocols
    asset_protocols: dict[str, list[str]] = defaultdict(list)
    for pid, pdata in protocols.items():
        for asset in get_assets(pdata):
            asset_protocols[asset].append(pid)

    shared = {a for a, ps in asset_protocols.items() if len(ps) > 1}

    lines = ["graph LR"]

    # Protocol nodes
    for pid, pdata in protocols.items():
        n_unique = sum(1 for a in get_assets(pdata) if a not in shared)
        label = pdata["name"]
        if n_unique:
            label += f"\\n<small>+{n_unique} unique assets</small>"
        lines.append(f'    {pid}["{label}"]')

    # Shared asset nodes only
    for asset in sorted(shared):
        node_id = _node_id(asset)
        if asset in protocol_tokens:
            parent = protocol_tokens[asset]
            lines.append(f'    {node_id}["{asset}\\n<small>({parent})</small>"]')
        else:
            lines.append(f'    {node_id}(["{asset}"])')

    # Edges: protocol → collateral asset
    for pid, pdata in protocols.items():
        for asset in get_assets(pdata):
            if asset in shared:
                lines.append(f"    {pid} --> {_node_id(asset)}")

    # Edges: yield source (protocol → protocol)
    seen_ys_nodes = set()
    for pid, pdata in protocols.items():
        for ys in pdata.get("yield_sources", []):
            ys_pid = _ys_protocol(ys)
            if ys_pid in protocols:
                assets = _ys_assets(ys)
                edge_label = f"|{', '.join(assets)}|" if assets else "|yield|"
                lines.append(f"    {pid} -.->{ edge_label} {ys_pid}")
            else:
                ys_id = _node_id(ys_pid)
                if ys_id not in seen_ys_nodes:
                    lines.append(f'    {ys_id}(("{ys_pid}"))')
                    seen_ys_nodes.add(ys_id)
                assets = _ys_assets(ys)
                edge_label = f"|{', '.join(assets)}|" if assets else "|yield|"
                lines.append(f"    {pid} -.->{ edge_label} {ys_id}")

    # Style: protocols get a distinct look
    protocol_ids = " ".join(protocols.keys())
    lines.append(f"    classDef protocol fill:#0675F9,color:#fff,stroke:#0675F9")
    lines.append(f"    class {protocol_ids} protocol")

    return "\n".join(lines)


def render_table(data: dict) -> str:
    """Full markdown table of all protocol dependencies."""
    protocols = data["protocols"]
    protocol_tokens = data.get("protocol_tokens", {})

    lines = [
        "| Protocol | Asset | Dep. Type | Parent Protocol | Allocation |",
        "|----------|-------|-----------|-----------------|------------|",
    ]

    for _pid, pdata in protocols.items():
        name = pdata["name"]

        # Base asset (Compound V3)
        base = pdata.get("base_asset")
        if base:
            parent = protocol_tokens.get(base, "")
            lines.append(f"| {name} | {base} | base | {parent} | - |")

        # Collateral
        for c in pdata.get("collateral", []):
            if isinstance(c, dict):
                asset = c["asset"]
                alloc = f'{c["allocation"]}%' if c.get("allocation") else "-"
            else:
                asset = c
                alloc = "-"
            parent = protocol_tokens.get(asset, "")
            lines.append(f"| {name} | {asset} | collateral | {parent} | {alloc} |")

        # Yield sources
        for ys in pdata.get("yield_sources", []):
            label = _ys_label(ys, protocols)
            assets = _ys_assets(ys)
            asset_str = ", ".join(assets) if assets else "-"
            lines.append(f"| {name} | {label} | yield_source | {asset_str} | - |")

        # Infrastructure
        for infra in pdata.get("infrastructure", []):
            lines.append(f"| {name} | {infra} | infrastructure | - | - |")

    return "\n".join(lines)


def render_shared_exposure(data: dict) -> str:
    """Table showing assets shared across multiple protocols (contagion risk)."""
    protocols = data["protocols"]
    protocol_tokens = data.get("protocol_tokens", {})

    asset_protocols: dict[str, list[str]] = defaultdict(list)
    for _pid, pdata in protocols.items():
        for asset in get_assets(pdata):
            asset_protocols[asset].append(pdata["name"])

    shared = {a: ps for a, ps in asset_protocols.items() if len(ps) > 1}
    if not shared:
        return "No shared assets found across protocols."

    lines = [
        "| Asset | Parent Protocol | Exposed Protocols | Count |",
        "|-------|-----------------|-------------------|-------|",
    ]
    for asset in sorted(shared, key=lambda a: len(shared[a]), reverse=True):
        ps = shared[asset]
        parent = protocol_tokens.get(asset, "-")
        lines.append(f"| {asset} | {parent} | {', '.join(ps)} | {len(ps)} |")

    return "\n".join(lines)


def _node_id(name: str) -> str:
    """Sanitize a name for use as a Mermaid node ID."""
    return name.replace(" ", "_").replace("-", "_").replace("/", "_").replace("(", "").replace(")", "")


def build_json(data: dict) -> dict:
    """Build structured JSON for the Astro frontend."""
    protocols = data["protocols"]
    protocol_tokens = data.get("protocol_tokens", {})
    addr_map = _build_address_map(data)

    # Shared exposure
    asset_protocols: dict[str, list[str]] = defaultdict(list)
    for _pid, pdata in protocols.items():
        for asset in get_assets(pdata):
            asset_protocols[asset].append(pdata["name"])

    shared = []
    for asset in sorted(asset_protocols, key=lambda a: len(asset_protocols[a]), reverse=True):
        ps = asset_protocols[asset]
        if len(ps) > 1:
            entry: dict = {
                "asset": asset,
                "parent": protocol_tokens.get(asset, ""),
                "protocols": ps,
                "count": len(ps),
            }
            if asset in addr_map:
                entry["address"] = addr_map[asset]
            shared.append(entry)

    # Full deps per protocol
    full = []
    for _pid, pdata in protocols.items():
        name = pdata["name"]
        chain = pdata.get("chain", "ethereum")
        base = pdata.get("base_asset")
        if base:
            dep: dict = {"protocol": name, "asset": base, "type": "base", "parent": protocol_tokens.get(base, ""), "allocation": ""}
            if base in addr_map:
                dep["address"] = addr_map[base]
            full.append(dep)
        for c in pdata.get("collateral", []):
            if isinstance(c, dict):
                asset = c["asset"]
                alloc = f'{c["allocation"]}%' if c.get("allocation") else ""
                addr = c.get("address", addr_map.get(asset, ""))
            else:
                asset = c
                alloc = ""
                addr = addr_map.get(asset, "")
            dep = {"protocol": name, "asset": asset, "type": "collateral", "parent": protocol_tokens.get(asset, ""), "allocation": alloc}
            if addr:
                dep["address"] = addr
            full.append(dep)
        for ys in pdata.get("yield_sources", []):
            label = _ys_label(ys, protocols)
            assets = _ys_assets(ys)
            asset_str = ", ".join(assets) if assets else ""
            full.append({"protocol": name, "asset": label, "type": "yield_source", "parent": asset_str, "allocation": ""})

    # Protocol summaries
    summaries = []
    for pid, pdata in protocols.items():
        summaries.append({
            "id": pid,
            "name": pdata["name"],
            "chain": pdata.get("chain", ""),
            "type": pdata.get("type", ""),
            "address": pdata.get("address", ""),
            "assetCount": len(pdata.get("collateral", [])),
        })

    return {
        "protocols": summaries,
        "shared": shared,
        "dependencies": full,
        "mermaid": render_mermaid(data),
    }


def main():
    fmt = sys.argv[1] if len(sys.argv) > 1 else "all"
    data = load_data()

    if fmt in ("mermaid", "all"):
        print("## Dependency Graph\n")
        print("```mermaid")
        print(render_mermaid(data))
        print("```\n")

    if fmt in ("table", "all"):
        print("## Full Dependency Table\n")
        print(render_table(data))
        print()

    if fmt in ("shared", "all"):
        print("## Shared Asset Exposure (Contagion Risk)\n")
        print(render_shared_exposure(data))
        print()

    if fmt in ("json", "all"):
        JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(JSON_PATH, "w") as f:
            json.dump(build_json(data), f, indent=2)
        print(f"Written JSON to {JSON_PATH}")


if __name__ == "__main__":
    main()
