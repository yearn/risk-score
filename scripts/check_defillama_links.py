"""Verify defillama.com/protocol/<slug> URLs against api.llama.fi.

Lychee with `accept = 403` cannot distinguish a real broken DeFiLlama link
from Cloudflare bot-blocking — both surface as 403. This script hits the
unprotected API (`api.llama.fi/protocol/<slug>`) which returns a clean
200 for valid slugs and 400 for renamed/removed ones.

Usage:
    uv run scripts/check_defillama_links.py reports/report/file1.md reports/report/file2.md

Exit codes:
    0 — all defillama slugs valid (or no defillama links found)
    1 — at least one broken slug found
    2 — usage error
"""

import logging
import re
import sys
import time
from pathlib import Path

import requests

DEFILLAMA_RE = re.compile(r"https?://defillama\.com/protocol/([a-zA-Z0-9._-]+)")
API_URL = "https://api.llama.fi/protocol/{slug}"
REQUEST_TIMEOUT = 15
DELAY_BETWEEN = 0.1  # be polite to api.llama.fi

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


def check_slug(slug: str) -> tuple[bool, int | str]:
    """Return (is_valid, status_or_error)."""
    try:
        resp = requests.get(
            API_URL.format(slug=slug),
            timeout=REQUEST_TIMEOUT,
            headers={"User-Agent": "yearn-risk-score-link-checker"},
        )
        return resp.status_code == 200, resp.status_code
    except requests.RequestException as exc:
        return False, str(exc)


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        logger.error("usage: check_defillama_links.py <file.md> [<file.md>...]")
        return 2

    paths = [Path(arg) for arg in argv[1:]]
    slug_to_files = find_defillama_slugs(paths)

    if not slug_to_files:
        logger.info("No defillama links found in %d input file(s).", len(paths))
        return 0

    logger.info("Checking %d unique defillama slug(s)...", len(slug_to_files))
    broken: list[tuple[str, int | str, list[Path]]] = []
    for slug, files in sorted(slug_to_files.items()):
        is_valid, status = check_slug(slug)
        marker = "OK " if is_valid else f"{status}"
        logger.info("  [%s] %s", marker, slug)
        if not is_valid:
            broken.append((slug, status, files))
        time.sleep(DELAY_BETWEEN)

    if broken:
        logger.error("\nFound %d broken defillama link(s):", len(broken))
        for slug, status, files in broken:
            logger.error(
                "  https://defillama.com/protocol/%s — api.llama.fi returned %s",
                slug,
                status,
            )
            for f in files:
                logger.error("    in %s", f)
        return 1

    logger.info("\nAll %d defillama links valid.", len(slug_to_files))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
