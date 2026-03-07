"""Render protocol dependency graph and table from protocols.yaml.

Usage:
    uv run scripts/dependencies/render.py              # all outputs
    uv run scripts/dependencies/render.py mermaid      # Mermaid only
    uv run scripts/dependencies/render.py table        # full table only
    uv run scripts/dependencies/render.py shared       # shared exposure only
"""

import sys
from collections import defaultdict
from pathlib import Path

import yaml

YAML_PATH = Path(__file__).parent / "protocols.yaml"


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


def get_assets(protocol: dict) -> list[str]:
    """Extract asset symbols from a protocol's collateral list."""
    return [
        c["asset"] if isinstance(c, dict) else c
        for c in protocol.get("collateral", [])
    ]


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
    for pid, pdata in protocols.items():
        for ys in pdata.get("yield_sources", []):
            if ys in protocols:
                lines.append(f"    {pid} -.->|yield| {ys}")
            else:
                ys_id = _node_id(ys)
                lines.append(f'    {ys_id}(("{ys}"))')
                lines.append(f"    {pid} -.->|yield| {ys_id}")

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
            ys_name = protocols[ys]["name"] if ys in protocols else ys
            lines.append(f"| {name} | {ys_name} | yield_source | - | - |")

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


if __name__ == "__main__":
    main()
