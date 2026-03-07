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

    # Shared exposure
    asset_protocols: dict[str, list[str]] = defaultdict(list)
    for _pid, pdata in protocols.items():
        for asset in get_assets(pdata):
            asset_protocols[asset].append(pdata["name"])

    shared = []
    for asset in sorted(asset_protocols, key=lambda a: len(asset_protocols[a]), reverse=True):
        ps = asset_protocols[asset]
        if len(ps) > 1:
            shared.append({
                "asset": asset,
                "parent": protocol_tokens.get(asset, ""),
                "protocols": ps,
                "count": len(ps),
            })

    # Full deps per protocol
    full = []
    for _pid, pdata in protocols.items():
        name = pdata["name"]
        base = pdata.get("base_asset")
        if base:
            full.append({"protocol": name, "asset": base, "type": "base", "parent": protocol_tokens.get(base, ""), "allocation": ""})
        for c in pdata.get("collateral", []):
            if isinstance(c, dict):
                asset = c["asset"]
                alloc = f'{c["allocation"]}%' if c.get("allocation") else ""
            else:
                asset = c
                alloc = ""
            full.append({"protocol": name, "asset": asset, "type": "collateral", "parent": protocol_tokens.get(asset, ""), "allocation": alloc})
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
