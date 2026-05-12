"""Verify defillama.com/protocol/<slug> URLs against api.llama.fi.

Lychee with `accept = 403` cannot distinguish a real broken DeFiLlama link
from Cloudflare bot-blocking — both surface as 403. This script fetches
the full protocol list from api.llama.fi (unprotected) once and checks
each slug against it locally, catching renamed/removed protocols without
hammering per-protocol endpoints that can time out on large protocols
(e.g. yearn).

Usage:
    uv run scripts/check_defillama_links.py reports/report/file1.md reports/report/file2.md

Exit codes:
    0 — all defillama slugs valid (or no defillama links found)
    1 — at least one broken slug found
    2 — usage error
    3 — could not fetch protocol list from api.llama.fi
"""

import logging
import re
import sys
from pathlib import Path

import requests

DEFILLAMA_RE = re.compile(r"https?://defillama\.com/protocol/([a-zA-Z0-9._-]+)")
PROTOCOLS_URL = "https://api.llama.fi/protocols"
REQUEST_TIMEOUT = 60  # /protocols payload is ~5MB, give it room

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)


def find_defillama_slugs(paths: list[Path]) -> dict[str, list[Path]]:
    """Map each unique slug to the files that reference it."""
    slug_to_files: dict[str, list[Path]] = {}
    for path in paths:
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for slug in DEFILLAMA_RE.findall(text):
            slug_to_files.setdefault(slug, []).append(path)
    return slug_to_files


def fetch_valid_slugs() -> set[str]:
    """Fetch all current DeFiLlama protocol slugs in one request.

    Includes both direct protocol slugs and parent-protocol slugs (referenced
    by children via `parentProtocol: "parent#<slug>"`). The parent slugs are
    valid URLs on defillama.com/protocol/ but don't appear standalone in the
    list response.
    """
    resp = requests.get(
        PROTOCOLS_URL,
        timeout=REQUEST_TIMEOUT,
        headers={"User-Agent": "yearn-risk-score-link-checker"},
    )
    resp.raise_for_status()
    data = resp.json()
    slugs = {p["slug"] for p in data if p.get("slug")}
    for p in data:
        parent = p.get("parentProtocol")
        if parent and parent.startswith("parent#"):
            slugs.add(parent.split("#", 1)[1])
    return slugs


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        logger.error("usage: check_defillama_links.py <file.md> [<file.md>...]")
        return 2

    paths = [Path(arg) for arg in argv[1:]]
    slug_to_files = find_defillama_slugs(paths)

    if not slug_to_files:
        logger.info("No defillama links found in %d input file(s).", len(paths))
        return 0

    logger.info("Fetching DeFiLlama protocol list...")
    try:
        valid_slugs = fetch_valid_slugs()
    except requests.RequestException as exc:
        logger.error("Could not fetch protocol list: %s", exc)
        return 3
    logger.info("Loaded %d known slugs; checking %d unique referenced slug(s)...",
                len(valid_slugs), len(slug_to_files))

    broken: list[tuple[str, list[Path]]] = []
    for slug, files in sorted(slug_to_files.items()):
        if slug in valid_slugs:
            logger.info("  [OK    ] %s", slug)
        else:
            logger.info("  [MISSING] %s", slug)
            broken.append((slug, files))

    if broken:
        logger.error("\nFound %d broken defillama link(s):", len(broken))
        for slug, files in broken:
            logger.error("  https://defillama.com/protocol/%s — slug not in current protocol list", slug)
            for f in files:
                logger.error("    in %s", f)
        return 1

    logger.info("\nAll %d defillama links valid.", len(slug_to_files))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
