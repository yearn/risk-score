#!/usr/bin/env python3
"""Generate Substack newsletter images for a risk assessment report.

Usage:
    uv run scripts/substack/generate_images.py <slug>

Generates images in reports/substack/output/<slug>/images/:
    hero.png        - OG-style hero image with score and tier
    score-table.png - Visual score breakdown by category
    dependency.png  - Protocol dependency graph (if in protocols.yaml)
"""

import base64
import subprocess
import sys
import tempfile
from pathlib import Path

import requests
import yaml

ROOT = Path(__file__).resolve().parents[2]
REPORTS_DIR = ROOT / "reports" / "report"
OUTPUT_BASE = ROOT / "reports" / "substack" / "output"
PROTOCOLS_YAML = ROOT / "scripts" / "dependencies" / "protocols.yaml"
RENDER_SCRIPT = ROOT / "scripts" / "substack" / "render_images.ts"
RENDER_PY = ROOT / "scripts" / "dependencies" / "render.py"


def check_report_exists(slug: str) -> Path:
    report = REPORTS_DIR / f"{slug}.md"
    if not report.exists():
        print(f"Error: Report not found: {report}")
        print(f"Available reports:")
        for f in sorted(REPORTS_DIR.glob("*.md")):
            print(f"  {f.stem}")
        sys.exit(1)
    return report


def generate_satori_images(slug: str, images_dir: Path) -> None:
    """Generate hero and score-table images via the Node/Satori script."""
    result = subprocess.run(
        ["npx", "tsx", str(RENDER_SCRIPT), slug, str(images_dir)],
        capture_output=True,
        text=True,
        cwd=str(ROOT),
    )
    if result.returncode != 0:
        print(f"Error generating Satori images:")
        print(result.stderr)
        sys.exit(1)
    print(result.stdout.strip())


def find_protocol_id(slug: str) -> str | None:
    """Find the protocol ID in protocols.yaml that matches this report slug."""
    if not PROTOCOLS_YAML.exists():
        return None

    with open(PROTOCOLS_YAML) as f:
        data = yaml.safe_load(f)

    protocols = data.get("protocols", {})

    # Try exact slug match first
    if slug in protocols:
        return slug

    # Try matching by normalizing: replace hyphens with underscores
    normalized = slug.replace("-", "_")
    if normalized in protocols:
        return normalized

    # Try partial match on protocol name
    slug_lower = slug.lower().replace("-", " ")
    for pid, pdata in protocols.items():
        name_lower = pdata.get("name", "").lower()
        if slug_lower in name_lower or name_lower in slug_lower:
            return pid

    return None


def render_protocol_mermaid(protocol_id: str) -> str | None:
    """Render a filtered Mermaid graph showing only the target protocol's dependencies."""
    if not PROTOCOLS_YAML.exists():
        return None

    with open(PROTOCOLS_YAML) as f:
        data = yaml.safe_load(f)

    protocols = data.get("protocols", {})
    protocol_tokens = data.get("protocol_tokens", {})

    if protocol_id not in protocols:
        return None

    pdata = protocols[protocol_id]
    pname = pdata["name"]

    # Collect this protocol's assets and yield sources
    collateral = []
    for c in pdata.get("collateral", []):
        if isinstance(c, dict):
            collateral.append(c["asset"])
        else:
            collateral.append(c)

    yield_sources = []
    for ys in pdata.get("yield_sources", []):
        if isinstance(ys, dict):
            yield_sources.append((ys["protocol"], ys.get("assets", [])))
        else:
            yield_sources.append((ys, []))

    infrastructure = pdata.get("infrastructure", [])

    # Build mermaid graph
    lines = ["graph LR"]

    # Central protocol node
    def node_id(name: str) -> str:
        return (
            name.replace(" ", "_")
            .replace("-", "_")
            .replace("/", "_")
            .replace("(", "")
            .replace(")", "")
        )

    pid_node = node_id(protocol_id)
    lines.append(f'    {pid_node}["{pname}"]')

    # Collateral asset nodes
    for asset in collateral:
        aid = node_id(asset)
        parent = protocol_tokens.get(asset, "")
        if parent:
            lines.append(f'    {aid}["{asset} ({parent})"]')
        else:
            lines.append(f'    {aid}(["{asset}"])')
        lines.append(f"    {pid_node} --> {aid}")

    # Yield source nodes
    for ys_pid, assets in yield_sources:
        ys_name = ys_pid
        if ys_pid in protocols:
            ys_name = protocols[ys_pid]["name"]
        ys_node = node_id(ys_pid)
        lines.append(f'    {ys_node}(("{ys_name}"))')
        label = f"|{', '.join(assets)}|" if assets else "|yield|"
        lines.append(f"    {pid_node} -.->{label} {ys_node}")

    # Infrastructure nodes
    for infra in infrastructure:
        iid = node_id(infra)
        lines.append(f"    {iid}{{{{{infra}}}}}")
        lines.append(f"    {pid_node} -.-> {iid}")

    # Style
    lines.append(f"    classDef protocol fill:#0675F9,color:#fff,stroke:#0675F9")
    lines.append(f"    class {pid_node} protocol")

    return "\n".join(lines)


def _try_mmdc(mermaid_text: str, output_path: Path) -> bool:
    """Try rendering via local mermaid-cli (mmdc)."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".mmd", delete=False) as f:
        f.write(mermaid_text)
        mmd_path = f.name

    try:
        result = subprocess.run(
            [
                "npx",
                "mmdc",
                "-i",
                mmd_path,
                "-o",
                str(output_path),
                "-t",
                "dark",
                "-b",
                "#0c0c0c",
                "--scale",
                "2",
            ],
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )
        return result.returncode == 0
    finally:
        Path(mmd_path).unlink(missing_ok=True)


def _try_mermaid_ink(mermaid_text: str, output_path: Path) -> bool:
    """Fallback: render via mermaid.ink hosted API."""
    encoded = base64.urlsafe_b64encode(mermaid_text.encode()).decode()
    url = f"https://mermaid.ink/img/{encoded}?type=png&theme=dark&bgColor=0c0c0c"

    try:
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200 and resp.headers.get("content-type", "").startswith(
            "image/"
        ):
            output_path.write_bytes(resp.content)
            return True
        return False
    except requests.RequestException:
        return False


def generate_dependency_graph(slug: str, images_dir: Path) -> bool:
    """Generate dependency graph PNG. Tries mmdc first, falls back to mermaid.ink."""
    protocol_id = find_protocol_id(slug)
    if not protocol_id:
        print("dependency: skipped (protocol not found in protocols.yaml)")
        return False

    mermaid_text = render_protocol_mermaid(protocol_id)
    if not mermaid_text:
        print("dependency: skipped (no dependency data)")
        return False

    output_path = images_dir / "dependency.png"

    # Try local mmdc first
    if _try_mmdc(mermaid_text, output_path):
        print(f"dependency: {output_path}")
        return True

    # Fallback to mermaid.ink API
    print("dependency: mmdc failed, trying mermaid.ink API...")
    if _try_mermaid_ink(mermaid_text, output_path):
        print(f"dependency: {output_path} (via mermaid.ink)")
        return True

    print("dependency: failed (both mmdc and mermaid.ink)")
    return False


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    slug = sys.argv[1]
    check_report_exists(slug)

    images_dir = OUTPUT_BASE / slug / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    print(f"Generating images for: {slug}")
    print(f"Output: {images_dir}\n")

    # 1. Hero + Score table (via Node/Satori)
    generate_satori_images(slug, images_dir)

    # 2. Dependency graph (via mermaid-cli)
    generate_dependency_graph(slug, images_dir)

    print(f"\nDone. Images in: {images_dir}")


if __name__ == "__main__":
    main()
