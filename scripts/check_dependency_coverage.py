"""Assert the dependency graph (scripts/dependencies/protocols.yaml) and the
risk reports (reports/report/*.md) stay in sync.

The linkage is the `report:` field on each protocol entry in protocols.yaml,
e.g. `report: reports/report/maple-syrupusdc.md`. This check enforces, in both
directions:

1. MISSING       — a report has no protocols.yaml entry pointing at it and is
                   not on the REPORTS_WITHOUT_PROTOCOL allowlist.
2. DANGLING      — a protocol's `report:` field points at a file that no longer
                   exists (report renamed/removed).
3. UNDECLARED    — a protocol entry has no `report:` field and is not on the
                   UPSTREAM_PROTOCOLS allowlist (likely a forgotten link).
4. DUPLICATE     — two protocol entries point at the same report.
5. STALE-ALLOW   — an allowlist entry no longer applies (its slug gained a real
                   link, or names a report/protocol that no longer exists), so
                   the allowlist itself can be pruned.

Exit code is non-zero when any of the above is found, so it can gate CI.

Two lists encode the non-drift state; everything else fails:

- UPSTREAM_PROTOCOLS: protocol entries that are upstream dependencies / yield
  sources rather than assessed subjects, so they legitimately have no report.
- REPORTS_WITHOUT_PROTOCOL: reports that intentionally have no dependency-graph
  node. The Yearn vaults are the *roots* of the exposure graph (they hold the
  other protocols), not dependencies of it, so they belong here.
"""

import logging
import sys
from pathlib import Path

import yaml

REPORTS_DIR = Path("reports/report")
PROTOCOLS_YAML = Path("scripts/dependencies/protocols.yaml")

# protocols.yaml entries that are upstream dependencies / yield sources, not
# assessed subjects — they are allowed to have no `report:` field.
UPSTREAM_PROTOCOLS = {
    "aave_v3_core",
    "compound_v3_usdc",
    "compound_v3_weth",
    "spark",
}

# Report slugs that intentionally have no dependency-graph node. Yearn vaults
# are the roots of the exposure graph, not dependencies within it.
REPORTS_WITHOUT_PROTOCOL = {
    "yearn-yvdai",
    "yearn-yvusd",
    "yearn-yvusdc",
    "yearn-yvusds",
    "yearn-yvusdt",
    "yearn-yvwbtc",
    "yearn-yvweth",
}

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger("dependency-coverage")


def report_slugs(reports_dir: Path = REPORTS_DIR) -> set[str]:
    """Return the slug (filename stem) of every report markdown file."""
    return {path.stem for path in reports_dir.glob("*.md")}


def protocol_report_links(
    protocols_yaml: Path = PROTOCOLS_YAML,
) -> dict[str, str | None]:
    """Map each protocol id to its report slug (stem of the `report:` path),
    or None when the entry declares no report."""
    data = yaml.safe_load(protocols_yaml.read_text())
    links: dict[str, str | None] = {}
    for pid, entry in data.get("protocols", {}).items():
        report = entry.get("report")
        links[pid] = Path(report).stem if report else None
    return links


def find_coverage_issues(
    reports: set[str],
    protocol_links: dict[str, str | None],
    upstream: set[str] = UPSTREAM_PROTOCOLS,
    reports_without_protocol: set[str] = REPORTS_WITHOUT_PROTOCOL,
) -> dict[str, list]:
    """Pure coverage diff. Returns a dict of issue category -> findings."""
    linked: dict[str, list[str]] = {}  # report slug -> [protocol ids]
    undeclared: list[str] = []  # protocol ids missing a report and not upstream
    dangling: list[tuple[str, str]] = []  # (protocol id, missing report slug)

    for pid, slug in protocol_links.items():
        if slug is None:
            if pid not in upstream:
                undeclared.append(pid)
            continue
        linked.setdefault(slug, []).append(pid)
        if slug not in reports:
            dangling.append((pid, slug))

    covered = set(linked) & reports
    missing = sorted(reports - covered - reports_without_protocol)
    duplicate = {slug: pids for slug, pids in linked.items() if len(pids) > 1}

    # Allowlist entries that no longer apply, so the lists can be pruned.
    stale = []
    for pid in sorted(upstream):
        if pid not in protocol_links:
            stale.append(
                f"UPSTREAM_PROTOCOLS lists '{pid}' but no such protocol entry exists"
            )
        elif protocol_links[pid] is not None:
            stale.append(
                f"UPSTREAM_PROTOCOLS lists '{pid}' but it now declares a report"
            )
    for slug in sorted(reports_without_protocol):
        if slug not in reports:
            stale.append(
                f"REPORTS_WITHOUT_PROTOCOL lists '{slug}' but no such report exists"
            )
        elif slug in covered:
            stale.append(
                f"REPORTS_WITHOUT_PROTOCOL lists '{slug}' but it now has a protocol entry"
            )

    return {
        "missing": missing,
        "dangling": sorted(dangling),
        "undeclared": sorted(undeclared),
        "duplicate": {slug: sorted(pids) for slug, pids in sorted(duplicate.items())},
        "stale_allowlist": stale,
    }


def main() -> int:
    if not REPORTS_DIR.is_dir():
        log.error("reports directory not found: %s", REPORTS_DIR)
        return 1
    if not PROTOCOLS_YAML.is_file():
        log.error("protocols file not found: %s", PROTOCOLS_YAML)
        return 1

    reports = report_slugs()
    protocol_links = protocol_report_links()
    issues = find_coverage_issues(reports, protocol_links)

    linked = sum(1 for s in protocol_links.values() if s is not None)
    log.info(
        "%d reports, %d protocol entries (%d linked, %d upstream)",
        len(reports),
        len(protocol_links),
        linked,
        len(protocol_links) - linked,
    )

    for slug in issues["missing"]:
        log.error(
            "MISSING    %-22s no protocols.yaml entry — add one with a `report:` "
            "field, or add the slug to REPORTS_WITHOUT_PROTOCOL if out of scope",
            slug,
        )
    for pid, slug in issues["dangling"]:
        log.error(
            "DANGLING   %-22s protocol '%s' points at a report that does not exist",
            slug,
            pid,
        )
    for pid in issues["undeclared"]:
        log.error(
            "UNDECLARED %-22s no `report:` field — add one, or add the id to "
            "UPSTREAM_PROTOCOLS if it is a dependency/yield source",
            pid,
        )
    for slug, pids in issues["duplicate"].items():
        log.error(
            "DUPLICATE  %-22s linked by multiple entries: %s", slug, ", ".join(pids)
        )
    for note in issues["stale_allowlist"]:
        log.error("STALE-ALLOW %s", note)

    total = (
        len(issues["missing"])
        + len(issues["dangling"])
        + len(issues["undeclared"])
        + len(issues["duplicate"])
        + len(issues["stale_allowlist"])
    )
    if total:
        log.error("dependency coverage check FAILED: %d issue(s)", total)
        return 1

    log.info(
        "dependency coverage check passed — reports and protocols.yaml are in sync"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
